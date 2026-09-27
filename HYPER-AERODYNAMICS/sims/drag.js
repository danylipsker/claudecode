/* HYPER-AERODYNAMICS · sims/drag.js — simulations for the Drag branch.
 *   drag-vehicles     aerodynamic drag, rolling resistance, slope and power against speed, from a city
 *                     cyclist to a 40 t truck; energy and fuel per 100 km
 *   drag-polar        the parabolic drag polar with its tangent from the origin (best L/D), and drag
 *                     against airspeed for five aircraft in the standard atmosphere
 *   drag-terminal     falling bodies — skydivers, a stratospheric jump, raindrops, hail, a ping-pong
 *                     ball — integrated in small steps through the standard atmosphere, with a canopy
 *   drag-paceline     riders drafting in a pace line: the drag and power of each position, rotating the lead
 *   drag-downforce    downforce against speed and the grip-limited cornering speed of five cars
 *   drag-porpoising   a ground-effect car in heave: the floor stalls near the road, the flow lags, it bounces
 *   drag-ball-flight  sports balls in flight: the drag crisis, dimples and spin (Magnus lift)
 */
(function () {
  'use strict';
  const G = 9.80665, D2R = Math.PI / 180;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const graphDiv = box => { const d = document.createElement('div'); d.style.padding = '4px 10px 10px'; box.stage.appendChild(d); return d; };
  const fN = F => { const a = Math.abs(F); return a >= 1e4 ? (F / 1e3).toFixed(1) + ' kN' : a >= 1e3 ? (F / 1e3).toFixed(2) + ' kN' : a >= 10 ? F.toFixed(0) + ' N' : F.toFixed(2) + ' N'; };
  const fW = P => { const a = Math.abs(P); return a >= 1e6 ? (P / 1e6).toFixed(2) + ' MW' : a >= 1e5 ? (P / 1e3).toFixed(0) + ' kW' : a >= 1e3 ? (P / 1e3).toFixed(1) + ' kW' : P.toFixed(0) + ' W'; };
  const kmh = v => (v * 3.6).toFixed(v * 3.6 < 20 ? 1 : 0) + ' km/h';
  const bisect = (f, lo, hi) => { let flo = f(lo); for (let k = 0; k < 90; k++) { const m = (lo + hi) / 2, fm = f(m); if ((fm < 0) === (flo < 0)) { lo = m; flo = fm; } else hi = m; } return (lo + hi) / 2; };
  // drag of a smooth sphere against Reynolds number (Clift & Gauvin's correlation, good to Re ≈ 3·10⁵)
  const cdSphere = Re => { Re = Math.max(Re, 1e-3); return 24 / Re * (1 + 0.15 * Math.pow(Re, 0.687)) + 0.42 / (1 + 42500 * Math.pow(Re, -1.16)); };

  /* ---------------------------------------------------------------- drawings shared by the sims */
  const RIDER = {
    upright: { hip: [-0.12, 1.0], sh: [-0.02, 1.55], head: [0.03, 1.73], hand: [0.42, 1.1], bar: [0.42, 1.08] },
    hoods: { hip: [-0.14, 1.0], sh: [0.27, 1.38], head: [0.41, 1.5], hand: [0.5, 1.0], bar: [0.47, 0.98] },
    tt: { hip: [-0.12, 1.02], sh: [0.36, 1.14], head: [0.52, 1.19], elbow: [0.4, 1.0], hand: [0.68, 1.03], bar: [0.6, 0.97] }
  };
  function knee(h, p, a, b) {                   // two-link leg: hip h, foot p, thigh a, shin b; the knee points forward
    const dx = p[0] - h[0], dy = p[1] - h[1], d = Math.min(Math.hypot(dx, dy) || 1e-6, a + b - 1e-6);
    const ang = Math.atan2(dy, dx), A = Math.acos(clamp((a * a + d * d - b * b) / (2 * a * d), -1, 1));
    const k1 = [h[0] + a * Math.cos(ang + A), h[1] + a * Math.sin(ang + A)], k2 = [h[0] + a * Math.cos(ang - A), h[1] + a * Math.sin(ang - A)];
    return k1[0] > k2[0] ? k1 : k2;
  }
  // a rider on a bicycle facing right; (x, y) is the ground under the bottom bracket, s pixels per metre
  function drawBike(c, pose, x, y, s, C, crank, jersey) {
    if (!(s > 0)) return;                                  // a stage too small to draw in (mounting, resizing)
    const P = (u, v) => [x + u * s, y - v * s];
    const seg = (a, b, w, col) => { const p1 = P(a[0], a[1]), p2 = P(b[0], b[1]); c.beginPath(); c.moveTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]); c.lineWidth = Math.max(1, w * s); c.strokeStyle = col; c.lineCap = 'round'; c.stroke(); };
    const r = 0.34, R = RIDER[pose] || RIDER.hoods;
    for (const u of [-0.52, 0.52]) {
      const [a, b] = P(u, r);
      c.beginPath(); c.arc(a, b, r * s, 0, 2 * Math.PI);
      if (pose === 'tt' && u < 0) { c.globalAlpha = 0.35; c.fillStyle = C.muted; c.fill(); c.globalAlpha = 1; }
      c.lineWidth = Math.max(1.2, 0.03 * s); c.strokeStyle = C.text; c.stroke();
    }
    const bb = [0, 0.3], seat = [-0.14, 0.95], top = [0.4, 0.88];
    seg([-0.52, r], bb, 0.025, C.muted); seg(bb, [0.38, 0.72], 0.03, C.muted); seg([0.38, 0.72], [0.52, r], 0.025, C.muted);
    seg(bb, seat, 0.03, C.muted); seg(seat, top, 0.025, C.muted); seg([-0.52, r], seat, 0.02, C.muted); seg(top, R.bar, 0.025, C.muted);
    for (const ph of [crank + Math.PI, crank]) {
      const pd = [bb[0] + 0.17 * Math.cos(ph), bb[1] + 0.17 * Math.sin(ph)], kn = knee(R.hip, pd, 0.46, 0.46);
      c.globalAlpha = ph === crank ? 1 : 0.55;
      seg(R.hip, kn, 0.12, C.text); seg(kn, pd, 0.085, C.text);
      c.globalAlpha = 1;
    }
    seg(R.hip, R.sh, 0.17, jersey);
    if (R.elbow) { seg(R.sh, R.elbow, 0.075, jersey); seg(R.elbow, R.hand, 0.065, jersey); } else seg(R.sh, R.hand, 0.075, jersey);
    const [hx, hy] = P(R.head[0], R.head[1]);
    c.beginPath(); c.arc(hx, hy, 0.115 * s, 0, 2 * Math.PI); c.fillStyle = jersey; c.fill();
  }
  const BODY = {
    car: { pts: [[-2.1, 0.32], [-2.15, 0.78], [-1.8, 0.95], [-1.05, 1.44], [0.45, 1.46], [1.1, 1.0], [2.05, 0.86], [2.15, 0.55], [2.1, 0.32]], win: [[-1.7, 0.99], [-0.98, 1.37], [0.4, 1.39], [0.95, 1.01]], wheels: [-1.35, 1.35], r: 0.31, h: 1.46, L: 4.3 },
    ev: { pts: [[-2.4, 0.28], [-2.42, 0.74], [-2.05, 0.95], [-0.95, 1.42], [0.15, 1.44], [1.15, 1.0], [2.25, 0.74], [2.42, 0.45], [2.36, 0.28]], win: [[-1.95, 0.98], [-0.9, 1.35], [0.12, 1.37], [1.02, 1.01]], wheels: [-1.45, 1.45], r: 0.34, h: 1.44, L: 4.85 },
    suv: { pts: [[-2.45, 0.42], [-2.48, 1.7], [-2.25, 1.8], [0.55, 1.8], [1.35, 1.2], [2.35, 1.02], [2.47, 0.62], [2.42, 0.42]], win: [[-2.2, 1.26], [-2.1, 1.7], [0.5, 1.7], [1.2, 1.23]], wheels: [-1.5, 1.5], r: 0.38, h: 1.8, L: 4.95 },
    moto: { pts: [[-0.95, 0.5], [-0.62, 0.78], [0.1, 0.8], [0.52, 1.08], [0.82, 0.98], [0.78, 0.58], [0.25, 0.36], [-0.55, 0.36]], wheels: [-0.72, 0.72], r: 0.31, h: 1.5, L: 2.1 },
    truck: { pts: [[-8.2, 1.15], [-8.2, 4.0], [5.15, 4.0], [5.15, 1.15]], cab: [[5.35, 0.6], [5.35, 3.95], [7.45, 3.95], [7.85, 3.25], [7.95, 0.6]], win: [[6.6, 3.7], [7.4, 3.7], [7.72, 3.05], [6.6, 3.05]], wheels: [-7.3, -6.25, -5.2, 6.0, 7.1], r: 0.5, h: 4.0, L: 16.2 }
  };
  function drawMotor(c, kind, x, y, s, C, roll, extras) {
    if (!(s > 0)) return;                                  // a stage too small to draw in (mounting, resizing)
    const B = BODY[kind], P = (u, v) => [x + u * s, y - v * s];
    const poly = (pts, fill, stroke) => { c.beginPath(); pts.forEach((q, i) => { const [a, b] = P(q[0], q[1]); i ? c.lineTo(a, b) : c.moveTo(a, b); }); c.closePath(); c.fillStyle = fill; c.fill(); if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1.5; c.stroke(); } };
    poly(B.pts, C.surface, C.text);
    if (B.cab) poly(B.cab, C.surface, C.text);
    if (B.win) poly(B.win, C.bg2, C.muted);
    if (kind === 'truck' && extras) {
      if (extras.skirts) poly([[-4.9, 1.15], [4.6, 1.15], [4.6, 0.55], [-4.9, 0.55]], C.bg2, C.muted);
      if (extras.tail) poly([[-8.2, 4.0], [-9.0, 3.6], [-9.0, 1.55], [-8.2, 1.15]], C.bg2, C.muted);
    }
    if (kind === 'moto') {                                          // the rider, crouched a little
      const seg = (a, b, w, col) => { const p1 = P(a[0], a[1]), p2 = P(b[0], b[1]); c.beginPath(); c.moveTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]); c.lineWidth = w * s; c.strokeStyle = col; c.lineCap = 'round'; c.stroke(); };
      seg([-0.3, 0.98], [0.12, 0.78], 0.13, C.text); seg([0.12, 0.78], [-0.08, 0.45], 0.1, C.text);
      seg([-0.3, 0.98], [0.2, 1.32], 0.19, C.accent); seg([0.2, 1.32], [0.56, 1.1], 0.08, C.accent);
      const [hx, hy] = P(0.33, 1.47); c.beginPath(); c.arc(hx, hy, 0.13 * s, 0, 2 * Math.PI); c.fillStyle = C.accent; c.fill();
    }
    for (const u of B.wheels) {
      const [a, b] = P(u, B.r);
      c.beginPath(); c.arc(a, b, B.r * s, 0, 2 * Math.PI); c.fillStyle = C.text; c.fill();
      c.beginPath(); c.arc(a, b, B.r * s * 0.55, 0, 2 * Math.PI); c.fillStyle = C.muted; c.fill();
      c.beginPath();
      for (let k = 0; k < 3; k++) { const an = -roll / B.r + k * 2.094; c.moveTo(a, b); c.lineTo(a + Math.cos(an) * B.r * s * 0.5, b + Math.sin(an) * B.r * s * 0.5); }
      c.strokeStyle = C.surface; c.lineWidth = 1.2; c.stroke();
    }
  }

  /* ================================================================ drag-vehicles */
  const VEH = {
    upright: { name: 'Cyclist, upright on a city bike', kind: 'bike', pose: 'upright', m: 95, CdA: 0.55, Crr: 0.007, eta: 0.95, src: 'human', v: 20, L: 1.9, h: 1.85 },
    road: { name: 'Road cyclist, hands on the hoods', kind: 'bike', pose: 'hoods', m: 90, CdA: 0.42, Crr: 0.006, eta: 0.97, src: 'human', v: 30, L: 1.9, h: 1.65 },
    tt: { name: 'Time-trial cyclist, tucked', kind: 'bike', pose: 'tt', m: 85, CdA: 0.22, Crr: 0.004, eta: 0.975, src: 'human', v: 45, L: 1.9, h: 1.4 },
    moto: { name: 'Motorcycle and rider', kind: 'moto', m: 280, CdA: 0.45, Crr: 0.015, eta: 0.20, src: 'petrol', v: 110 },
    car: { name: 'Small family car (C_D 0.30 × 2.2 m²)', kind: 'car', m: 1300, CdA: 0.66, Crr: 0.010, eta: 0.22, src: 'petrol', v: 100 },
    ev: { name: 'Streamlined electric saloon (C_D 0.21 × 2.3 m²)', kind: 'ev', m: 1900, CdA: 0.48, Crr: 0.008, eta: 0.85, src: 'battery', v: 110 },
    suv: { name: 'Large SUV (C_D 0.36 × 2.8 m²)', kind: 'suv', m: 2200, CdA: 1.0, Crr: 0.011, eta: 0.24, src: 'petrol', v: 110 },
    truck: { name: 'Articulated truck, 40 t (C_D 0.60 × 10 m²)', kind: 'truck', m: 40000, CdA: 6.0, Crr: 0.006, eta: 0.38, src: 'diesel', v: 85 }
  };
  const LHV = { petrol: 32e6, diesel: 36e6 };                      // J per litre (lower heating value, rounded)

  Hyper.sim('drag-vehicles', {
    title: 'Drag, rolling resistance and power on the road',
    blurb: `A vehicle at a steady speed pushes against three forces: aerodynamic drag $\\tfrac12\\rho V^2 C_DA$, rolling resistance $C_{rr}mg$ and, on a slope, a part of its weight. Power is force × speed, so the drag part of the power grows with the **cube** of speed. The graph shows the power at the wheels against speed; the read-out converts it into energy, fuel or food per 100 km with typical, rounded efficiencies.

**Try this**
- Take the road cyclist to 30 km/h: about 200 W, three-quarters of it against the air. Now tuck into the time-trial position at the same speed.
- Find the speed at which drag overtakes rolling resistance for the car, then for the truck (read-out "aero = rolling").
- Drive the car at 90, 110 and 130 km/h and watch the fuel per 100 km. Then cut the drag area by 20 %.
- Give the truck side skirts and a boat tail (drag area 85 %): how many litres per 100 km does it save at 85 km/h?
- Put the cyclist on a 6 % climb at 15 km/h: the air hardly matters any more — the slope does.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 220 });
      const gd = graphDiv(box);
      const key0 = params && VEH[params.vehicle] ? params.vehicle : 'road';
      const p0 = VEH[key0];
      const ctl = kit.controls(box.side, [
        { id: 'veh', type: 'select', label: 'Vehicle', options: Object.keys(VEH).map(k => [VEH[k].name, k]), value: key0 },
        { id: 'vb', label: 'Speed', min: 5, max: 70, step: 0.5, value: p0.kind === 'bike' ? p0.v : 30, unit: 'km/h' },
        { id: 'vm', label: 'Speed', min: 10, max: 180, step: 1, value: p0.kind === 'bike' ? 100 : p0.v, unit: 'km/h' },
        { id: 'wind', label: 'Headwind (− = tailwind)', min: -10, max: 15, step: 0.5, value: 0, unit: 'm/s' },
        { id: 'grade', label: 'Slope', min: -6, max: 10, step: 0.5, value: 0, unit: '%' },
        { id: 'aero', label: 'Drag area C_DA (change)', min: 60, max: 130, step: 1, value: 100, unit: '%' },
        { id: 'alt', label: 'Altitude', min: 0, max: 3000, step: 50, value: 0, unit: 'm' }
      ], (id, v) => {
        if (id === 'veh') { const p = VEH[v]; if (p.kind === 'bike') ctl.set('vb', p.v); else ctl.set('vm', p.v); ctl.set('aero', 100); ctl.set('grade', 0); }
        update();
      });
      const ro = kit.readout(box.side, [['air', 'Air speed · density'], ['Fa', 'Aerodynamic drag'], ['Fr', 'Rolling resistance'], ['Fg', 'Slope force'], ['share', 'Share of the air in the resistance'],
        ['Pw', 'Power at the wheels'], ['Ps', 'Power at the source'], ['E', 'Energy'], ['fuel', 'Fuel or food'], ['vx', 'Speed where aero = rolling']]);
      const plot = kit.plot(gd, { x: { label: 'speed (km/h)', min: 0 }, y: { label: 'power at the wheels' }, legend: true }, 190);
      const V = ctl.values;
      let r = null, roll = 0, crank = 0, dash = 0;
      const streaks = [];
      function forces(p, v, rho) {
        const va = v + V.wind, CdA = p.CdA * V.aero / 100, th = Math.atan(V.grade / 100);
        const Fa = 0.5 * rho * CdA * va * Math.abs(va), Fr = p.Crr * p.m * G * Math.cos(th), Fg = p.m * G * Math.sin(th);
        return { va, CdA, Fa, Fr, Fg, Ft: Fa + Fr + Fg };
      }
      function update() {
        const p = VEH[V.veh], bike = p.kind === 'bike';
        ctl.show('vb', bike); ctl.show('vm', !bike);
        const v = (bike ? V.vb : V.vm) / 3.6, air = F.isa(V.alt), rho = air.rho;
        const f = forces(p, v, rho), Pw = f.Ft * v, Ps = Pw > 0 ? Pw / p.eta : 0;
        r = Object.assign({ p, v, rho, Pw, Ps }, f);
        ro.set('air', (f.va * 3.6).toFixed(0) + ' km/h · ' + rho.toFixed(3) + ' kg/m³');
        ro.set('Fa', fN(f.Fa) + '  (C_DA = ' + f.CdA.toFixed(2) + ' m²)');
        ro.set('Fr', fN(f.Fr) + '  (C_rr = ' + p.Crr + ')');
        ro.set('Fg', V.grade ? fN(f.Fg) : '0 (level road)');
        const res = Math.max(f.Fa, 0) + f.Fr + Math.max(f.Fg, 0);
        ro.set('share', res > 0 ? (100 * Math.max(f.Fa, 0) / res).toFixed(0) + ' % air · ' + (100 * f.Fr / res).toFixed(0) + ' % tyres' + (f.Fg > 0 ? ' · ' + (100 * f.Fg / res).toFixed(0) + ' % slope' : '') : '—');
        ro.set('Pw', Pw > 0 ? fW(Pw) : 'none needed: ' + fW(-Pw) + ' to brake away (gravity or wind push)');
        const srcName = { human: 'legs', petrol: 'fuel', diesel: 'fuel', battery: 'battery' }[p.src];
        ro.set('Ps', Pw > 0 ? fW(Ps) + ' from the ' + srcName + ' (efficiency ' + (100 * p.eta).toFixed(0) + ' %)' : '—');
        const Ew = Math.max(0, f.Ft) * 1e5;                          // J per 100 km at the wheels
        ro.set('E', (Ew / 3.6e6).toFixed(Ew / 3.6e6 < 10 ? 2 : 1) + ' kWh per 100 km at the wheels');
        if (p.src === 'human') ro.set('fuel', Pw > 0 ? (Ps / 0.24 * 3600 / 4184).toFixed(0) + ' kcal/h of food (muscles ≈ 24 % efficient)' : 'coasting');
        else if (p.src === 'battery') ro.set('fuel', (Ew / p.eta / 3.6e6).toFixed(1) + ' kWh/100 km from the battery');
        else ro.set('fuel', (Ew / p.eta / LHV[p.src]).toFixed(1) + ' L/100 km of ' + p.src);
        const vx = Math.sqrt(2 * p.Crr * p.m * G / (rho * p.CdA * V.aero / 100));
        ro.set('vx', (vx * 3.6).toFixed(0) + ' km/h (level, still air)');
        // the power curves against speed
        const vmax = bike ? 70 : 180, unit = bike ? 1 : 1000, uName = bike ? 'W' : 'kW';
        const sa = [], sr = [], sg = [], stt = [];
        for (let k = 0; k <= 90; k++) {
          const vk = vmax * k / 90 / 3.6, fk = forces(p, vk, rho);
          sa.push([vk * 3.6, fk.Fa * vk / unit]); sr.push([vk * 3.6, fk.Fr * vk / unit]); sg.push([vk * 3.6, fk.Fg * vk / unit]); stt.push([vk * 3.6, fk.Ft * vk / unit]);
        }
        const series = [{ pts: stt, label: 'total' }, { pts: sa, label: 'air drag', dash: [6, 4] }, { pts: sr, label: 'rolling', dash: [2, 3] }];
        if (V.grade) series.push({ pts: sg, label: 'slope', dash: [8, 3, 2, 3] });
        plot.set({ x: { label: 'speed (km/h)', min: 0, max: vmax }, y: { label: 'power at the wheels (' + uName + ')' }, series, vlines: [{ x: v * 3.6, label: (v * 3.6).toFixed(0) + ' km/h' }], marks: [{ x: v * 3.6, y: Pw / unit }], fmtY: y => y.toFixed(bike ? 0 : 1) + ' ' + uName });
        loop.once();
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!r) return;
        const p = r.p, gy = st.H * 0.8;
        // ground and road markings, moving at the ground speed; air streaks at the air speed
        c.fillStyle = C.surface; c.fillRect(0, gy, st.W, st.H - gy);
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, gy); c.lineTo(st.W, gy); c.stroke();
        roll += r.v * dt; dash += (40 + r.v * 7) * dt;
        c.strokeStyle = C.faint; c.lineWidth = 3;
        const off = dash % 80;
        for (let x = -off; x < st.W; x += 80) { c.beginPath(); c.moveTo(x, gy + (st.H - gy) * 0.55); c.lineTo(x + 36, gy + (st.H - gy) * 0.55); c.stroke(); }
        while (streaks.length < 36) streaks.push({ x: Math.random() * st.W, y: 18 + Math.random() * (gy - 26), l: 10 + Math.random() * 26 });
        const air = r.va * 7 + Math.sign(r.va) * 40;
        c.strokeStyle = C.faint; c.lineWidth = 1.2;
        for (const q of streaks) {
          q.x -= air * dt;
          if (q.x < -40) q.x += st.W + 60; if (q.x > st.W + 40) q.x -= st.W + 60;
          c.beginPath(); c.moveTo(q.x, q.y); c.lineTo(q.x + q.l, q.y); c.stroke();
        }
        // the vehicle, scaled to fit
        const L = p.kind === 'bike' ? p.L : BODY[p.kind].L, Hh = p.kind === 'bike' ? p.h : BODY[p.kind].h;
        const s = Math.min(st.W * 0.5 / L, (gy - 60) / Hh), cx = st.W * 0.48;
        if (p.kind === 'bike') { crank -= dt * (r.Pw > 0 ? 9 : 0); drawBike(c, p.pose, cx, gy, s, C, crank, C.accent); }
        else drawMotor(c, p.kind, cx, gy, s, C, roll, { skirts: V.aero <= 92, tail: V.aero <= 86 });
        // forces, to one scale
        const rear = p.kind === 'truck' ? 9.0 : L / 2;                // the truck's boat tail sticks out behind
        const back = cx - rear * s - 6, ya = gy - Hh * s * 0.55;
        const big = Math.max(Math.abs(r.Fa), r.Fr, Math.abs(r.Fg), 1e-6), k = clamp(back - 14, 30, 110) / big;
        const lab = (t, x, y, col) => kit.label(c, t, Math.max(x, 8), y, { align: 'left', size: 12, weight: 700, color: col });
        if (Math.abs(r.Fa) * k > 2) { kit.arrow(c, back, ya, back - r.Fa * k, ya, C.series[0], 3); lab('air ' + fN(r.Fa), back - Math.max(r.Fa * k, 0), ya - 14, C.series[0]); }
        kit.arrow(c, back, gy - 6, back - r.Fr * k, gy - 6, C.series[1], 3);
        lab('rolling ' + fN(r.Fr), back - r.Fr * k, gy + 16, C.series[1]);
        if (Math.abs(r.Fg) * k > 2) { kit.arrow(c, cx, gy - Hh * s * 0.3, cx - r.Fg * k, gy - Hh * s * 0.3, C.series[2], 3); lab('slope ' + fN(r.Fg), cx - Math.max(r.Fg * k, 0), gy - Hh * s * 0.3 - 14, C.series[2]); }
        // a stacked bar: where the resistance comes from
        const parts = [[Math.max(r.Fa, 0), C.series[0], 'air'], [r.Fr, C.series[1], 'tyres'], [Math.max(r.Fg, 0), C.series[2], 'slope']];
        const tot = parts.reduce((a, q) => a + q[0], 0) || 1, bw = Math.min(220, st.W * 0.36), bx = st.W - bw - 12;
        let x0 = bx;
        for (const [f, col] of parts) { const w = bw * f / tot; c.fillStyle = col; c.fillRect(x0, 34, w, 12); x0 += w; }
        kit.label(c, 'resistance: ' + parts.filter(q => q[0] / tot > 0.08).map(q => q[2] + ' ' + (100 * q[0] / tot).toFixed(0) + ' %').join(' · '), st.W - 12, 58, { align: 'right', size: 11.5, color: C.muted });
        kit.label(c, p.name.replace(/ \(.*\)$/, ''), 12, 16, { size: 13, weight: 700 });
        kit.label(c, (r.v * 3.6).toFixed(0) + ' km/h' + (V.wind ? ', wind ' + (V.wind > 0 ? 'against' : 'behind') + ' ' + Math.abs(V.wind) + ' m/s' : '') + (V.grade ? ', slope ' + V.grade + ' %' : ''), 12, 36, { size: 12, color: C.muted });
        kit.label(c, 'power at the wheels ' + (r.Pw > 0 ? fW(r.Pw) : 'none'), st.W - 12, 16, { align: 'right', size: 13, weight: 700, color: C.text });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ drag-polar */
  const CRAFT = {
    light: { name: 'Light aircraft, 1100 kg', m: 1100, S: 16.2, AR: 7.4, e: 0.75, CD0: 0.030, CLmax: 1.5, V: 55, h: 1000, u: 1, uN: 'N' },
    airliner: { name: 'Narrow-body airliner, 65 t', m: 65000, S: 122.6, AR: 9.5, e: 0.80, CD0: 0.019, CLmax: 1.4, V: 200, h: 10000, u: 1000, uN: 'kN' },
    glider: { name: '15 m sailplane, 450 kg', m: 450, S: 10.5, AR: 21.4, e: 0.90, CD0: 0.0095, CLmax: 1.4, V: 28, h: 1000, u: 1, uN: 'N' },
    fighter: { name: 'Jet fighter, subsonic, 12 t', m: 12000, S: 28, AR: 3.2, e: 0.80, CD0: 0.018, CLmax: 1.2, V: 180, h: 5000, u: 1000, uN: 'kN' },
    hpa: { name: 'Human-powered aircraft, 105 kg', m: 105, S: 31, AR: 37, e: 0.95, CD0: 0.017, CLmax: 1.2, V: 7, h: 0, u: 1, uN: 'N' }
  };
  Hyper.sim('drag-polar', {
    title: 'The drag polar and the best lift-to-drag ratio',
    blurb: `The drag polar $C_D = C_{D,0} + C_L^2/(\\pi\\,\\mathit{AR}\\, e)$ drawn as lift coefficient against drag coefficient. A line from the origin to any point has slope $C_L/C_D = L/D$; the steepest such line **touches** the polar — the tangent from the origin — at the best lift-to-drag ratio $(L/D)_{\\max} = \\tfrac12\\sqrt{\\pi\\,\\mathit{AR}\\,e/C_{D,0}}$. Drag the orange point along the polar, or set the airspeed; the graph below shows the same aircraft's parasite, induced and total drag against airspeed.

**Try this**
- Fly the light aircraft slowly and then fast: the operating point runs up and down the polar and the L/D line swings. Where is it steepest?
- Double the aspect ratio: the polar narrows and the tangent steepens. Halve the zero-lift drag instead: which does more?
- Pick the sailplane and compare its $(L/D)_{\\max}$ with the light aircraft's — that is metres forward per metre of height lost in a glide.
- Climb the airliner from 0 to 10 000 m: the polar does not change, but the true airspeed of best L/D rises by about 70 %.
- On the drag graph, note that at the best-L/D speed parasite and induced drag are equal.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 250 });
      const gd = graphDiv(box);
      const key0 = params && CRAFT[params.craft] ? params.craft : 'light';
      const c0 = CRAFT[key0];
      const ctl = kit.controls(box.side, [
        { id: 'craft', type: 'select', label: 'Aircraft', options: Object.keys(CRAFT).map(k => [CRAFT[k].name, k]), value: key0 },
        { id: 'V', label: 'True airspeed', min: 4, max: 300, value: c0.V, unit: 'm/s', log: true, sig: 3 },
        { id: 'h', label: 'Altitude', min: 0, max: 12000, step: 100, value: c0.h, unit: 'm' },
        { id: 'AR', label: 'Aspect ratio AR', min: 3, max: 40, value: c0.AR, log: true, sig: 3 },
        { id: 'e', label: 'Oswald efficiency e', min: 0.5, max: 1, step: 0.01, value: c0.e },
        { id: 'CD0', label: 'Zero-lift drag C_D0', min: 0.005, max: 0.06, value: c0.CD0, log: true, sig: 2 }
      ], (id, v) => {
        if (id === 'craft') { const p = CRAFT[v]; for (const k of ['V', 'h', 'AR', 'e', 'CD0']) ctl.set(k, p[k]); }
        update();
      });
      const ro = kit.readout(box.side, [['rho', 'Air density · Mach'], ['CL', 'Lift coefficient C_L'], ['CD', 'Drag coefficient C_D'], ['LD', 'L/D here'], ['LDmax', '(L/D)max (tangent)'],
        ['Vmd', 'Speed of best L/D'], ['D', 'Drag · power here'], ['glide', 'Best glide from 1000 m']]);
      const plot = kit.plot(gd, { x: { label: 'true airspeed (m/s)' }, y: { label: 'drag' }, legend: true }, 180);
      const V = ctl.values;
      let r = null, box2 = null;
      function calc() {
        const p = CRAFT[V.craft], air = F.isa(V.h), rho = air.rho, W = p.m * G, S = p.S;
        const K = 1 / (Math.PI * V.AR * V.e), q = 0.5 * rho * V.V * V.V, CLreq = W / (q * S);
        const CD = V.CD0 + K * CLreq * CLreq, LD = CLreq / CD;
        const CLs = Math.sqrt(V.CD0 / K), LDmax = 0.5 / Math.sqrt(K * V.CD0);
        const Vmd = Math.sqrt(2 * W / (rho * S * CLs)), Vs = Math.sqrt(2 * W / (rho * S * p.CLmax));
        return { p, air, rho, W, S, K, q, CLreq, CD, LD, CLs, LDmax, Vmd, Vs, D: q * S * CD, M: V.V / air.a };
      }
      function update() {
        r = calc();
        const p = r.p;
        ro.set('rho', r.rho.toFixed(3) + ' kg/m³ · M ' + r.M.toFixed(2) + (r.M > 0.75 ? ' (wave drag not modelled)' : ''));
        ro.set('CL', r.CLreq > p.CLmax ? r.CLreq.toFixed(2) + ' — above C_L,max ' + p.CLmax + ': too slow to fly' : r.CLreq.toFixed(3));
        ro.set('CD', r.CD.toFixed(4) + '  (' + V.CD0.toFixed(4) + ' parasite + ' + (r.K * r.CLreq * r.CLreq).toFixed(4) + ' induced)');
        ro.set('LD', r.LD.toFixed(1));
        ro.set('LDmax', r.LDmax.toFixed(1) + ' at C_L = ' + r.CLs.toFixed(2) + (r.CLs > p.CLmax ? ' (beyond the stall)' : ''));
        ro.set('Vmd', r.Vmd.toFixed(1) + ' m/s = ' + (r.Vmd * 3600 / 1852).toFixed(0) + ' kt (stall ' + (r.Vs * 3600 / 1852).toFixed(0) + ' kt)');
        ro.set('D', fN(r.D) + ' · ' + fW(r.D * V.V));
        ro.set('glide', (Math.atan(1 / r.LDmax) / D2R).toFixed(2) + '° slope, ' + (r.LDmax).toFixed(1) + ' km over the ground in still air');
        // drag against airspeed
        const lo = Math.max(1, 0.8 * r.Vs), hi = Math.max(3 * r.Vmd, 1.25 * V.V, lo * 2), sp = [], si = [], stt = [];
        for (let k = 0; k <= 100; k++) {
          const v = lo + (hi - lo) * k / 100, q = 0.5 * r.rho * v * v, CL = r.W / (q * r.S);
          const Dp = q * r.S * V.CD0, Di = q * r.S * r.K * CL * CL;
          sp.push([v, Dp / p.u]); si.push([v, Di / p.u]); stt.push([v, (Dp + Di) / p.u]);
        }
        const Dmin = r.W / r.LDmax;
        plot.set({ x: { label: 'true airspeed (m/s)', min: lo, max: hi }, y: { label: 'drag (' + p.uN + ')', min: 0, max: 3.2 * Dmin / p.u }, series: [{ pts: stt, label: 'total drag' }, { pts: sp, label: 'parasite', dash: [6, 4] }, { pts: si, label: 'induced', dash: [2, 3] }],
          vlines: [{ x: V.V, label: 'now' }], marks: [{ x: r.Vmd, y: Dmin / p.u, label: 'min drag = W/(L/D)max' }, { x: V.V, y: r.D / p.u, color: C0().series[1] }], fmtY: y => y.toFixed(p.u > 1 ? 1 : 0) + ' ' + p.uN });
        loop.once();
      }
      const C0 = () => kit.colors();
      // the polar, drawn on the stage: C_D across, C_L up
      function frame() {
        const W = st.W, H = st.H, L = 58, R = W - 18, T = 16, B = H - 34, p = r.p;
        const ymin = -0.3, ymax = p.CLmax + 0.3, xmax = (V.CD0 + r.K * (1.12 * p.CLmax) ** 2) * 1.08;
        return { L, R, T, B, ymin, ymax, xmax, X: cd => L + (R - L) * cd / xmax, Y: cl => B - (B - T) * (cl - ymin) / (ymax - ymin), CLof: y => ymin + (B - y) / (B - T) * (ymax - ymin) };
      }
      kit.drag(st, {
        hit: pt => { if (!r || !box2) return null; const cl = Math.min(r.CLreq, r.p.CLmax), x = box2.X(V.CD0 + r.K * cl * cl), y = box2.Y(cl); return Math.hypot(pt.x - x, pt.y - y) < 18 ? 1 : null; },
        move: (_, pt) => {
          if (!r || !box2) return;
          const cl = clamp(box2.CLof(pt.y), 0.03, r.p.CLmax);
          ctl.set('V', clamp(Math.sqrt(2 * r.W / (r.rho * r.S * cl)), 4, 300));
          update();
        },
        hover: true
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (!r) return;
        const f = box2 = frame(), p = r.p;
        // grid and axes
        const xs = Hyper.niceStep(f.xmax, 6), ys = Hyper.niceStep(f.ymax - f.ymin, 6);
        c.lineWidth = 1; c.strokeStyle = C.grid; c.fillStyle = C.muted; c.font = '11.5px sans-serif';
        for (let x = 0; x <= f.xmax + 1e-9; x += xs) { c.beginPath(); c.moveTo(f.X(x), f.T); c.lineTo(f.X(x), f.B); c.stroke(); kit.label(c, +x.toFixed(4) + '', f.X(x), f.B + 12, { align: 'center', size: 11, color: C.muted }); }
        for (let y = Math.ceil(f.ymin / ys) * ys; y <= f.ymax + 1e-9; y += ys) { c.beginPath(); c.moveTo(f.L, f.Y(y)); c.lineTo(f.R, f.Y(y)); c.stroke(); kit.label(c, (+y.toFixed(2)).toString().replace('-', '−'), f.L - 6, f.Y(y), { align: 'right', size: 11, color: C.muted }); }
        c.strokeStyle = C.axis; c.lineWidth = 1.3; c.beginPath(); c.moveTo(f.L, f.Y(0)); c.lineTo(f.R, f.Y(0)); c.moveTo(f.L, f.T); c.lineTo(f.L, f.B); c.stroke();
        kit.label(c, 'drag coefficient C_D →', f.R, f.B + 26, { align: 'right', size: 12, weight: 600, color: C.text2 || C.text });
        kit.label(c, '↑ lift coefficient C_L', f.L + 6, f.T + 8, { size: 12, weight: 600, color: C.text2 || C.text });
        // C_D0 line
        c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(f.X(V.CD0), f.T); c.lineTo(f.X(V.CD0), f.B); c.stroke(); c.setLineDash([]);
        kit.label(c, 'C_D0', f.X(V.CD0) + 4, f.B - 10, { size: 11, color: C.muted });
        // the polar
        c.strokeStyle = C.accent; c.lineWidth = 2.4; c.beginPath();
        for (let k = 0; k <= 120; k++) { const cl = f.ymin + (p.CLmax - f.ymin) * k / 120, x = f.X(V.CD0 + r.K * cl * cl), y = f.Y(cl); k ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.stroke();
        kit.dot(c, f.X(V.CD0 + r.K * p.CLmax * p.CLmax), f.Y(p.CLmax), 4, C.warn);
        kit.label(c, 'stall, C_L,max = ' + p.CLmax, f.X(V.CD0 + r.K * p.CLmax * p.CLmax) + 8, f.Y(p.CLmax) - 8, { size: 11.5, color: C.warn });
        // the tangent from the origin
        const cls = Math.min(r.CLs, p.CLmax), xT = V.CD0 + r.K * cls * cls, slope = cls / xT;
        const xEnd = Math.min(f.xmax, (f.ymax - 0.05) / slope);
        c.strokeStyle = C.ok; c.lineWidth = 1.8; c.setLineDash([7, 4]); c.beginPath(); c.moveTo(f.X(0), f.Y(0)); c.lineTo(f.X(xEnd), f.Y(slope * xEnd)); c.stroke(); c.setLineDash([]);
        kit.dot(c, f.X(xT), f.Y(cls), 5.5, C.ok, C.surface);
        kit.label(c, '(L/D)max = ' + r.LDmax.toFixed(1), f.X(xT) + 10, f.Y(cls) + 12, { size: 12.5, weight: 700, color: C.ok, bg: C.surface });
        // minimum power: C_L = √(3 C_D0/K), C_D = 4 C_D0
        const clp = Math.sqrt(3 * V.CD0 / r.K);
        if (clp < p.CLmax) { kit.dot(c, f.X(4 * V.CD0), f.Y(clp), 4, C.series[5]); kit.label(c, 'min power', f.X(4 * V.CD0) + 8, f.Y(clp), { size: 11, color: C.series[5] }); }
        // the operating point, its L/D ray and the split of C_D
        const cl = Math.min(r.CLreq, p.CLmax), cd = V.CD0 + r.K * cl * cl, ox = f.X(cd), oy = f.Y(cl);
        c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(f.X(0), f.Y(0)); c.lineTo(ox, oy); c.stroke();
        c.lineWidth = 5; c.strokeStyle = C.series[0]; c.globalAlpha = 0.5; c.beginPath(); c.moveTo(f.X(0), oy); c.lineTo(f.X(V.CD0), oy); c.stroke();
        c.strokeStyle = C.series[2]; c.beginPath(); c.moveTo(f.X(V.CD0), oy); c.lineTo(ox, oy); c.stroke(); c.globalAlpha = 1;
        kit.dot(c, ox, oy, 7, r.CLreq > p.CLmax ? C.bad : C.series[1], C.surface);
        kit.label(c, (r.CLreq > p.CLmax ? 'too slow — stalled' : 'L/D = ' + r.LD.toFixed(1)) + '  (' + V.V.toFixed(V.V < 20 ? 1 : 0) + ' m/s)', ox + 12, oy - 12, { size: 12.5, weight: 700, color: r.CLreq > p.CLmax ? C.bad : C.text, bg: C.surface });
        kit.label(c, 'parasite', f.X(V.CD0 / 2), oy + 12, { align: 'center', size: 10.5, color: C.muted });
        if (ox - f.X(V.CD0) > 40) kit.label(c, 'induced', (f.X(V.CD0) + ox) / 2, oy + 12, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, p.name, f.R, f.T + 8, { align: 'right', size: 12.5, weight: 700 });
        kit.label(c, 'AR ' + V.AR.toFixed(1) + ' · e ' + V.e.toFixed(2) + ' · C_D0 ' + V.CD0.toFixed(4), f.R, f.T + 26, { align: 'right', size: 11.5, color: C.muted });
      }, box.stage);
      if (st.onResize) st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ drag-terminal */
  const OBJ = {
    belly: { name: 'Skydiver, belly to earth', kind: 'diver', pose: 'belly', m: 90, CdA: 0.45, h0: 4000, open: 1200, warp: 2 },
    head: { name: 'Skydiver, head down', kind: 'diver', pose: 'head', m: 90, CdA: 0.18, h0: 4000, open: 1200, warp: 2 },
    strato: { name: 'Stratospheric jump from 39 km (pressure suit)', kind: 'diver', pose: 'belly', m: 118, CdA: 0.36, h0: 38969, open: 2500, mach: true, warp: 10 },
    rain: { name: 'Raindrop', kind: 'drop', rhoP: 1000, h0: 1500, warp: 20 },
    hail: { name: 'Hailstone, 2 cm', kind: 'ball', d: 0.02, rhoP: 900, h0: 3000, warp: 5 },
    pingpong: { name: 'Ping-pong ball (2.7 g, 40 mm)', kind: 'ball', d: 0.040, mass: 0.0027, h0: 50, warp: 1 }
  };
  const CANOPY = 55;                                                 // m², a main canopy's drag area (rounded)
  // transonic drag rise of a tumbling or belly-flying body: C_D roughly doubles between M 0.6 and 1.1
  const machRise = M => { const u = clamp((M - 0.6) / 0.5, 0, 1); return 1 + 1.1 * u * u * (3 - 2 * u); };
  Hyper.sim('drag-terminal', {
    title: 'Falling to terminal velocity',
    blurb: `A body falls, speeds up, and the air pushes back harder and harder ($\\tfrac12\\rho v^2 C_DA$) until drag equals weight: **terminal velocity** $v_t = \\sqrt{2mg/(\\rho C_DA)}$. The motion is integrated in small fixed steps through the standard atmosphere, so the air thickens as the body falls. Balls and raindrops use the measured drag of a sphere at their Reynolds number; big raindrops flatten and drag more.

**Try this**
- Drop the belly-to-earth skydiver: about 10 s and a few hundred metres to reach 90 % of terminal speed. Then go head down.
- Watch the terminal-speed read-out fall as the diver descends into thicker air: the diver actually *slows down* on the way.
- Open the canopy: drag area grows from 0.45 to about 55 m² over a few seconds and the speed drops to a gentle 5–6 m/s. Note the peak deceleration — then open it from head-down, at 90 m/s. (Real head-down flyers slow to belly-to-earth first.)
- Jump from 39 km: in air a hundredth as dense, the fall goes supersonic before the thickening air brakes it.
- Try raindrops from 0.1 to 5 mm: a 0.1 mm droplet drifts down at about 0.25 m/s, a 5 mm drop falls at about 9 m/s.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const gd = graphDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'obj', type: 'select', label: 'Falling body', options: Object.keys(OBJ).map(k => [OBJ[k].name, k]), value: 'belly' },
        { id: 'dd', label: 'Drop diameter', min: 0.1, max: 5, value: 2, unit: 'mm', log: true, sig: 2 },
        { id: 'warp', type: 'select', label: 'Time runs', options: [['in real time', 1], ['2 × faster', 2], ['5 × faster', 5], ['10 × faster', 10], ['20 × faster', 20], ['50 × faster', 50]], value: 2 },
        { id: 'auto', type: 'check', label: 'Canopy opens by itself (1200 m; 2500 m from 39 km)', value: true },
        { type: 'buttons', items: [{ id: 'reset', label: 'Drop again', primary: true }, { id: 'open', label: 'Open canopy now' }] }
      ], (id) => {
        if (id === 'obj') { ctl.set('warp', OBJ[V.obj].warp); reset(); }
        else if (id === 'dd' || id === 'reset') reset();
        else if (id === 'open') openCanopy();
      });
      const ro = kit.readout(box.side, [['t', 'Time'], ['h', 'Height'], ['v', 'Speed'], ['vt', 'Terminal speed at this height'], ['frac', 'Speed ÷ terminal speed'], ['acc', 'Acceleration'], ['num', 'Reynolds · Mach'], ['max', 'Top speed · peak deceleration']]);
      const plot = kit.plot(gd, { x: { label: 'time (s)', min: 0 }, y: { label: 'speed (m/s)' }, legend: true }, 180);
      const V = ctl.values;
      let S = null, streaks = [], frameNo = 0;
      function body() {
        const o = OBJ[V.obj];
        if (o.kind === 'diver') return { o, m: o.m, CdA: o.CdA };
        const d = o.kind === 'drop' ? V.dd / 1000 : o.d, A = Math.PI * d * d / 4;
        const m = o.mass || o.rhoP * Math.PI / 6 * d * d * d;
        const flat = o.kind === 'drop' ? 1 + 0.03 * Math.pow(Math.max(0, V.dd - 1), 2.3) : 1;   // big drops flatten into buns
        return { o, m, d, A, flat, rhoP: o.rhoP || m / (Math.PI / 6 * d * d * d) };
      }
      // drag force (N, upward when falling); with withVt also the terminal speed at this height
      function dragOf(b, h, v, t, withVt) {
        const air = F.isa(clamp(h, 0, 47000));
        if (b.o.kind === 'diver') {
          let CdA = b.CdA;
          if (S && S.canopy != null) { const u = clamp((t - S.canopy) / 3.5, 0, 1); CdA = b.CdA + (CANOPY - b.CdA) * u * u * u; }
          const f = b.o.mach ? machRise(Math.abs(v) / air.a) : 1;
          return { D: 0.5 * air.rho * CdA * f * v * Math.abs(v), vt: Math.sqrt(2 * b.m * G / (air.rho * CdA * f)), air, CdA };
        }
        const Re = air.rho * Math.abs(v) * b.d / air.mu, cd = cdSphere(Re) * b.flat;
        const out = { D: 0.5 * air.rho * b.A * cd * v * Math.abs(v), vt: 0, air, Re, buoy: air.rho / b.rhoP };
        if (withVt) {
          // the sphere's terminal speed: fixed-point passes on v = √(2mg'/(ρ A C_D(Re)))
          const gEff = G * (1 - air.rho / b.rhoP);
          let vt = Math.max(Math.abs(v), 0.05);
          for (let k = 0; k < 30; k++) vt = 0.5 * vt + 0.5 * Math.sqrt(2 * b.m * gEff / (air.rho * b.A * cdSphere(air.rho * vt * b.d / air.mu) * b.flat));
          out.vt = vt;
        }
        return out;
      }
      function accel(b, h, v, t) { const q = dragOf(b, h, v, t, false); return G * (1 - (q.buoy || 0)) - q.D / b.m; }
      function reset() {
        S = null;
        const b = body();
        const isDiver = b.o.kind === 'diver';
        ctl.show('dd', b.o.kind === 'drop'); ctl.show('auto', isDiver); ctl.show('open', isDiver);
        const q0 = dragOf(b, b.o.h0, 0, 0, true);
        // a step small against the time the body needs to reach terminal speed (v_t/g)
        const dt = clamp(q0.vt / G / 40, 0.0004, 0.005);
        S = { b, h: b.o.h0, v: 0, t: 0, dt, canopy: null, vmax: 0, peak: 0, landed: false, vt0: q0.vt, hist: [[0, 0]], histT: [[0, q0.vt]], acc: G };
        streaks = [];
        loop.start();
      }
      function openCanopy() { if (S && S.b.o.kind === 'diver' && S.canopy == null && !S.landed) S.canopy = S.t; }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const b = S.b;
        // integrate: RK4 on height and speed in fixed sub-steps
        if (!S.landed && dt > 0) {
          const n = Math.min(4000, Math.max(1, Math.round(dt * V.warp / S.dt)));
          for (let i = 0; i < n && !S.landed; i++) {
            const h = S.h, v = S.v, t = S.t, k = S.dt;
            const a1 = accel(b, h, v, t), a2 = accel(b, h - v * k / 2, v + a1 * k / 2, t + k / 2);
            const a3 = accel(b, h - (v + a1 * k / 2) * k / 2, v + a2 * k / 2, t + k / 2), a4 = accel(b, h - (v + a2 * k / 2) * k, v + a3 * k, t + k);
            S.h -= k * (v + k / 6 * (a1 + a2 + a3));
            S.v += k / 6 * (a1 + 2 * a2 + 2 * a3 + a4);
            S.t += k; S.acc = a1;
            S.vmax = Math.max(S.vmax, S.v); S.peak = Math.max(S.peak, -a1 / G);
            if (V.auto && b.o.kind === 'diver' && S.canopy == null && S.h < b.o.open) S.canopy = S.t;
            if (S.h <= 0) { S.h = 0; S.landed = true; }
          }
          const q = dragOf(b, S.h, S.v, S.t, true);
          S.hist.push([S.t, S.v]); S.histT.push([S.t, q.vt]);
          if (S.hist.length > 1600) { S.hist = S.hist.filter((_, i) => i % 2 === 0); S.histT = S.histT.filter((_, i) => i % 2 === 0); }
        }
        const q = dragOf(b, S.h, S.v, S.t, true);
        // ---- the scene: a height scale on the left, the body with its forces on the right
        const colX = 70, top = 26, bot = st.H - 22;
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(colX, top); c.lineTo(colX, bot); c.stroke();
        for (let k = 0; k <= 4; k++) { const hh = b.o.h0 * k / 4, y = bot - (bot - top) * k / 4; c.beginPath(); c.moveTo(colX - 5, y); c.lineTo(colX + 5, y); c.stroke(); kit.label(c, hh >= 1000 ? (hh / 1000).toFixed(hh % 1000 ? 1 : 0) + ' km' : hh.toFixed(0) + ' m', colX - 9, y, { align: 'right', size: 11, color: C.muted }); }
        const yb = bot - (bot - top) * S.h / b.o.h0;
        kit.dot(c, colX, yb, 6, S.canopy != null ? C.ok : C.accent, C.surface);
        c.fillStyle = C.surface; c.fillRect(0, bot, st.W, st.H - bot);
        // air streaks rushing up past the body
        const cx = st.W * 0.5, cy = st.H * 0.48, ref = Math.max(S.vt0, 0.1);
        while (streaks.length < 30) streaks.push({ x: cx - 150 + Math.random() * 300, y: Math.random() * st.H, l: 8 + Math.random() * 22 });
        c.strokeStyle = C.faint; c.lineWidth = 1.2;
        for (const s of streaks) { s.y -= (20 + 380 * Math.min(1.5, S.v / ref)) * dt; if (s.y < -30) s.y += st.H + 40; c.beginPath(); c.moveTo(s.x, s.y); c.lineTo(s.x, s.y + s.l); c.stroke(); }
        // the body
        c.save(); c.translate(cx, cy);
        if (b.o.kind === 'diver') {
          const k = 26;
          if (S.canopy != null) {
            const u = clamp((S.t - S.canopy) / 3.5, 0, 1), w = 20 + 90 * u, hgt = 10 + 40 * u;
            c.fillStyle = C.accent; c.globalAlpha = 0.85; c.beginPath(); c.ellipse(0, -80 - hgt * 0.2, w, hgt, 0, Math.PI, 2 * Math.PI); c.fill(); c.globalAlpha = 1;
            c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(-w, -80 - hgt * 0.2); c.lineTo(0, -18); c.lineTo(w, -80 - hgt * 0.2); c.stroke();
          }
          c.strokeStyle = C.text; c.lineCap = 'round';
          if (S.canopy != null) {                                                                           // hanging under the canopy
            c.lineWidth = 11; c.beginPath(); c.moveTo(0, -4); c.lineTo(0, 30); c.stroke();
            c.lineWidth = 6; c.beginPath(); c.moveTo(0, 30); c.lineTo(-7, 54); c.moveTo(0, 30); c.lineTo(7, 54); c.moveTo(0, 0); c.lineTo(-13, -17); c.moveTo(0, 0); c.lineTo(13, -17); c.stroke();
            kit.dot(c, 0, -14, 8, C.accent);
          } else if (b.o.pose === 'belly') {
            c.lineWidth = 11; c.beginPath(); c.moveTo(-k, 0); c.lineTo(k, 0); c.stroke();                      // body, seen from the side
            c.lineWidth = 6; c.beginPath(); c.moveTo(k * 0.6, 0); c.lineTo(k * 1.2, -k * 0.7); c.moveTo(-k * 0.9, 0); c.lineTo(-k * 1.5, -k * 0.6); c.stroke();
            kit.dot(c, k + 9, -2, 8, C.accent);
          } else {
            c.lineWidth = 11; c.beginPath(); c.moveTo(0, -k * 1.1); c.lineTo(0, k * 0.8); c.stroke();
            c.lineWidth = 6; c.beginPath(); c.moveTo(0, -k * 1.1); c.lineTo(-k * 0.35, -k * 1.9); c.moveTo(0, -k * 1.1); c.lineTo(k * 0.35, -k * 1.9); c.stroke();
            kit.dot(c, 0, k * 0.8 + 9, 8, C.accent);
          }
        } else if (b.o.kind === 'drop') {
          const R = 10 + 5 * Math.log(1 + V.dd * 3), asp = clamp(1 - 0.09 * (V.dd - 1), 0.62, 1);
          c.fillStyle = C.accent; c.globalAlpha = 0.8; c.beginPath(); c.ellipse(0, 0, R, R * asp, 0, 0, 2 * Math.PI); c.fill(); c.globalAlpha = 1;
          kit.label(c, V.dd.toFixed(V.dd < 1 ? 2 : 1) + ' mm (drawn enlarged)', 0, R + 16, { align: 'center', size: 11, color: C.muted });
        } else {
          kit.dot(c, 0, 0, 18, b.o.rhoP ? C.faint : C.surface, C.text);
        }
        c.restore();
        // forces: weight down, drag up, to one scale
        const Wt = b.m * G, kf = 70 / Wt;
        kit.arrow(c, cx + 60, cy, cx + 60, cy + 70, C.bad, 3);
        kit.label(c, 'weight ' + fN(Wt), cx + 68, cy + 60, { size: 12, weight: 700, color: C.bad });
        const Dlen = Math.min(170, q.D * kf);
        if (Dlen > 2) kit.arrow(c, cx - 60, cy, cx - 60, cy - Dlen, C.ok, 3);
        kit.label(c, 'drag ' + fN(q.D), cx - 68, cy - Math.max(Dlen, 10), { align: 'right', size: 12, weight: 700, color: C.ok });
        kit.label(c, b.o.name, st.W - 12, 16, { align: 'right', size: 13, weight: 700 });
        kit.label(c, (S.v * 3.6).toFixed(S.v < 3 ? 2 : 0) + ' km/h', st.W - 12, 40, { align: 'right', size: 20, weight: 700, color: C.accent });
        if (S.landed) kit.label(c, 'landed after ' + S.t.toFixed(1) + ' s at ' + S.v.toFixed(1) + ' m/s', st.W - 12, 64, { align: 'right', size: 12.5, weight: 700, color: C.ok });
        else if (S.canopy != null && b.o.kind === 'diver' && S.t - S.canopy < 4) kit.label(c, 'canopy opening', st.W - 12, 64, { align: 'right', size: 12.5, weight: 700, color: C.warn });
        // read-outs and the graph
        ro.set('t', S.t.toFixed(1) + ' s');
        ro.set('h', S.h >= 1000 ? (S.h / 1000).toFixed(2) + ' km' : S.h.toFixed(S.h < 100 ? 1 : 0) + ' m');
        ro.set('v', S.v.toFixed(S.v < 10 ? 2 : 1) + ' m/s = ' + (S.v * 3.6).toFixed(S.v < 3 ? 1 : 0) + ' km/h');
        ro.set('vt', q.vt.toFixed(q.vt < 10 ? 2 : 1) + ' m/s (air ' + q.air.rho.toFixed(q.air.rho < 0.1 ? 4 : 3) + ' kg/m³)');
        ro.set('frac', (100 * S.v / q.vt).toFixed(0) + ' %');
        const ag = S.acc / G;
        ro.set('acc', (Math.abs(ag) < 0.005 ? '0.00' : ag.toFixed(2)) + ' g' + (ag < -0.01 ? ' (slowing)' : ''));
        ro.set('num', b.o.kind === 'diver' ? 'Mach ' + (S.v / q.air.a).toFixed(2) : 'Re ' + Math.round(q.Re || 0).toLocaleString('en') + ' · C_D ' + (cdSphere(q.Re || 0) * b.flat).toFixed(2));
        ro.set('max', S.vmax.toFixed(1) + ' m/s · ' + S.peak.toFixed(1) + ' g');
        if (frameNo++ % 3 === 0 || S.landed) {
          const series = [{ pts: S.hist, label: 'speed' }, { pts: S.histT, label: 'terminal speed at the height reached', dash: [6, 4] }];
          if (!b.o.mach && S.canopy == null) {
            const tanh = [], vt0 = S.vt0, tEnd = Math.max(S.t, 1e-3);
            for (let k = 0; k <= 60; k++) { const t = tEnd * k / 60; tanh.push([t, vt0 * Math.tanh(G * t / vt0)]); }
            series.push({ pts: tanh, label: 'v_t tanh(gt/v_t), air of the start', dash: [2, 3] });
          }
          plot.set({ x: { label: 'time (s)', min: 0, max: Math.max(S.t, 1e-3) }, series, fmtY: y => y.toFixed(2) + ' m/s' });
        }
        if (S.landed) loop.stop();
      }, box.stage);
      reset();
    }
  });

  /* ================================================================ drag-paceline */
  // the drag of the rider in position i (0 = at the front) of a line of n, relative to riding alone (gap in metres);
  // rounded from wind-tunnel and track measurements: about 35–45 % less at half a wheel, the leader gains a few per cent
  function draft(i, n, gap) {
    if (n <= 1) return 1;
    const pushed = i < n - 1 ? 1 - 0.035 * Math.exp(-gap / 1.0) : 1;
    if (i === 0) return pushed;
    const shelter = (i === 1 ? 0.45 : i === 2 ? 0.49 : 0.52) * Math.exp(-gap / 4);
    return (1 - shelter) * pushed;
  }
  Hyper.sim('drag-paceline', {
    title: 'Drafting in a pace line',
    blurb: `Riders in a line share the work: the leader punches the hole in the air, the riders behind sit in the slow, low-pressure wake and need far less power — and a rider close behind even helps the leader a little by filling the leader's wake. Each rider's drag is the solo drag times a factor that depends on the position and the gap (rounded from track and wind-tunnel measurements). Power = (rolling resistance + drag) × speed.

**Try this**
- Four riders at 45 km/h with a 0.4 m gap: the second rider needs about a third less power than the leader. Open the gap to 2 m: a good part of the shelter is gone.
- Compare the average power, with the lead shared, to a lone rider's: that is why a group rides faster than a soloist.
- Put 8 riders in the line. Beyond the third wheel, the extra shelter is small.
- Add a 5 m/s headwind: drafting saves more watts — breakaways die in the wind.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 210 });
      const gd = graphDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Riders in the line', min: 1, max: 8, step: 1, value: 4 },
        { id: 'v', label: 'Speed', min: 20, max: 60, step: 0.5, value: 45, unit: 'km/h' },
        { id: 'gap', label: 'Gap between wheels', min: 0.1, max: 5, step: 0.05, value: 0.4, unit: 'm' },
        { id: 'cda', label: 'Drag area of one rider C_DA', min: 0.18, max: 0.5, step: 0.01, value: 0.28, unit: 'm²' },
        { id: 'wind', label: 'Headwind (− = tailwind)', min: -6, max: 10, step: 0.5, value: 0, unit: 'm/s' },
        { id: 'rot', type: 'check', label: 'Share the lead: rotate every 8 s', value: true }
      ], () => update());
      const ro = kit.readout(box.side, [['solo', 'A lone rider needs'], ['lead', 'Leader'], ['second', 'Second rider'], ['last', 'Last rider'], ['avg', 'Average, sharing the lead'], ['save', 'Saving against riding alone'], ['eq', 'A lone rider on that average power rides at']]);
      const plot = kit.plot(gd, { x: { label: 'gap between wheels (m)', min: 0, max: 5 }, y: { label: 'drag ÷ riding alone (%)', min: 40, max: 102 }, legend: true }, 170);
      const V = ctl.values, m = 85, Crr = 0.004, eta = 0.975, rho = 1.2;
      let riders = [], P = [], solo = 0, timer = 0, roll = 0, crank = 0;
      const power = (f, v) => (Crr * m * G + 0.5 * rho * V.cda * f * (v + V.wind) * Math.abs(v + V.wind)) * v / eta;
      function update() {
        const n = Math.round(V.n), v = V.v / 3.6;
        if (riders.length !== n) { riders = []; for (let i = 0; i < n; i++) riders.push({ id: i, slot: i, pos: i, lane: 0 }); timer = 0; }
        P = []; for (let i = 0; i < n; i++) P.push(power(draft(i, n, V.gap), v));
        solo = power(1, v);
        const avg = P.reduce((a, b) => a + b, 0) / n;
        ro.set('solo', solo.toFixed(0) + ' W');
        ro.set('lead', P[0].toFixed(0) + ' W (drag ' + (100 * draft(0, n, V.gap)).toFixed(0) + ' %)');
        ro.set('second', n > 1 ? P[1].toFixed(0) + ' W (drag ' + (100 * draft(1, n, V.gap)).toFixed(0) + ' %)' : '—');
        ro.set('last', n > 2 ? P[n - 1].toFixed(0) + ' W (drag ' + (100 * draft(n - 1, n, V.gap)).toFixed(0) + ' %)' : '—');
        ro.set('avg', avg.toFixed(0) + ' W');
        ro.set('save', (100 * (1 - avg / solo)).toFixed(0) + ' %');
        const veq = bisect(x => power(1, x) - avg, 0.5, 30);
        ro.set('eq', (veq * 3.6).toFixed(1) + ' km/h — the group rides ' + (V.v - veq * 3.6).toFixed(1) + ' km/h faster');
        const gaps = [], s2 = [], s3 = [], s4 = [], s0 = [];
        for (let k = 0; k <= 50; k++) { const g = 5 * k / 50; gaps.push(g); s0.push([g, 100 * draft(0, 4, g)]); s2.push([g, 100 * draft(1, 4, g)]); s3.push([g, 100 * draft(2, 4, g)]); s4.push([g, 100 * draft(3, 5, g)]); }
        plot.set({ series: [{ pts: s0, label: 'leader' }, { pts: s2, label: 'second' }, { pts: s3, label: 'third', dash: [6, 4] }, { pts: s4, label: 'fourth and later', dash: [2, 3] }], vlines: [{ x: V.gap, label: V.gap.toFixed(2) + ' m' }], fmtY: y => y.toFixed(0) + ' %' });
        loop.once();
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        const n = riders.length;
        if (!n) return;
        // rotate the lead: the leader swings out and drifts to the back, everyone moves up one place
        timer += dt;
        if (V.rot && n > 1 && timer > 8) {
          timer = 0;
          for (const r of riders) { if (r.slot === 0) { r.slot = n - 1; r.lane = 1; } else r.slot -= 1; }
        }
        for (const r of riders) { r.pos += (r.slot - r.pos) * Math.min(1, dt * 1.1); if (Math.abs(r.pos - r.slot) < 0.12) r.lane += (0 - r.lane) * Math.min(1, dt * 2); }
        const gy = st.H * 0.84, len = 1.75, span = n * len + (n - 1) * V.gap + 1.5;
        const s = Math.min(70, (st.W - 40) / span, (gy - 60) / 1.7);
        c.fillStyle = C.surface; c.fillRect(0, gy, st.W, st.H - gy);
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, gy); c.lineTo(st.W, gy); c.stroke();
        roll += V.v / 3.6 * dt; crank -= 9.4 * dt;                 // about 90 turns of the cranks a minute
        c.strokeStyle = C.faint; c.lineWidth = 3;
        const off = (roll * s) % 60;
        for (let x = -off; x < st.W; x += 60) { c.beginPath(); c.moveTo(x, gy + (st.H - gy) * 0.55); c.lineTo(x + 26, gy + (st.H - gy) * 0.55); c.stroke(); }
        const frontX = st.W - 30 - 0.7 * s;
        const xOf = pos => frontX - pos * (len + V.gap) * s;
        // the wakes: slow air trailing each rider
        for (const r of riders) {
          const x = xOf(r.pos) - 0.6 * s, wl = Math.min(3.2, 1 + V.gap) * s;
          const grd = c.createLinearGradient(x, 0, x - wl, 0);
          grd.addColorStop(0, kit.hue(200, 0.28)); grd.addColorStop(1, kit.hue(200, 0));
          c.fillStyle = grd; c.beginPath(); c.moveTo(x, gy - 1.55 * s - r.lane * 8); c.lineTo(x - wl, gy - 1.2 * s); c.lineTo(x - wl, gy); c.lineTo(x, gy); c.closePath(); c.fill();
        }
        // the riders, back to front, with their power above them
        const order = riders.slice().sort((a, b) => b.pos - a.pos);
        const pmax = Math.max(solo, ...P, 1);
        for (const r of order) {
          const x = xOf(r.pos), y = gy - r.lane * 10;
          c.globalAlpha = r.lane > 0.3 ? 0.7 : 1;
          drawBike(c, 'hoods', x, y, s, C, crank + r.id * 1.3, C.series[r.id % C.series.length]);
          c.globalAlpha = 1;
          const pw = r.lane > 0.3 ? power(0.6, V.v / 3.6) : P[Math.round(clamp(r.slot, 0, n - 1))];
          const bh = 46 * pw / pmax, bx = x - 7, by = gy - 1.75 * s - 16;
          c.fillStyle = C.series[r.id % C.series.length]; c.fillRect(bx, by - bh, 14, bh);
          kit.label(c, pw.toFixed(0) + ' W', x, by - bh - 9, { align: 'center', size: 11, weight: 700 });
        }
        kit.label(c, 'riding →', 12, 16, { size: 12, color: C.muted });
        kit.label(c, 'a lone rider: ' + solo.toFixed(0) + ' W', 12, 34, { size: 12, color: C.muted });
        kit.label(c, V.v.toFixed(1) + ' km/h' + (V.wind ? ', headwind ' + V.wind + ' m/s' : ''), st.W - 12, 16, { align: 'right', size: 12.5, weight: 700 });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ drag-downforce */
  const CARS = {
    road: { name: 'Family car (a little lift)', m: 1400, ClA: -0.08, CdA: 0.65, mu: 0.95, P: 100e3 },
    sports: { name: 'Sports car with a rear wing', m: 1450, ClA: 0.35, CdA: 0.75, mu: 1.1, P: 380e3 },
    gt: { name: 'GT racing car', m: 1300, ClA: 2.0, CdA: 1.0, mu: 1.4, P: 420e3 },
    proto: { name: 'Endurance prototype', m: 1050, ClA: 3.5, CdA: 1.0, mu: 1.5, P: 500e3 },
    f1: { name: 'Single-seater, high-downforce set-up', m: 800, ClA: 4.5, CdA: 1.25, mu: 1.6, P: 750e3 }
  };
  const RHO = 1.225, CRR_CAR = 0.013;
  function cornerSpeed(m, mu, ClA, R) {                            // m V²/R = μ (m g + ½ ρ V² ClA)
    const den = 1 - mu * RHO * ClA * R / (2 * m);
    return den > 1e-3 ? Math.sqrt(mu * G * R / den) : Infinity;
  }
  const topSpeed = (m, CdA, P) => bisect(v => 0.92 * P - v * (CRR_CAR * m * G + 0.5 * RHO * CdA * v * v), 1, 200);
  Hyper.sim('drag-downforce', {
    title: 'Downforce and cornering speed',
    blurb: `Tyres can push sideways with at most μ times the load on them. Without wings the load is the weight, so the cornering speed is $\\sqrt{\\mu g R}$ whatever the car weighs. **Downforce** $\\tfrac12\\rho V^2 C_LA$ adds load that grows with speed, so the faster the car goes, the more grip it has: $mV^2/R = \\mu(mg + \\tfrac12\\rho V^2 C_LA)$. Beyond a certain radius the grip outgrows the need and the corner is taken flat out, limited only by power and drag. Figures are rounded and illustrative; real tyres lose some grip per newton as the load rises, so the gain is a little smaller.

**Try this**
- Take the GT car round a 60 m hairpin and then a 250 m sweeper, each with its downforce and with C_LA set to 0: the air adds a few per cent in the hairpin and over 20 % in the sweeper.
- Pick the single-seater and find the radius beyond which it is limited by power, not grip.
- Give the family car the GT car's downforce area at road speeds: it barely helps. Downforce needs speed.
- Watch the lateral acceleration read-out: several g is only possible because the air presses the tyres into the road.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 240 });
      const gd = graphDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'car', type: 'select', label: 'Car', options: Object.keys(CARS).map(k => [CARS[k].name, k]), value: 'gt' },
        { id: 'R', label: 'Corner radius', min: 15, max: 1000, value: 120, unit: 'm', log: true, sig: 3 },
        { id: 'ClA', label: 'Downforce area C_LA', min: -0.2, max: 6, step: 0.05, value: CARS.gt.ClA, unit: 'm²' },
        { id: 'mu', label: 'Tyre friction μ', min: 0.7, max: 1.9, step: 0.05, value: CARS.gt.mu },
        { id: 'm', label: 'Mass', min: 600, max: 2000, step: 10, value: CARS.gt.m, unit: 'kg' }
      ], (id, v) => {
        if (id === 'car') { const p = CARS[v]; ctl.set('ClA', p.ClA); ctl.set('mu', p.mu); ctl.set('m', p.m); }
        update();
      });
      const ro = kit.readout(box.side, [['v', 'Cornering speed'], ['lat', 'Lateral acceleration'], ['df', 'Downforce at that speed'], ['drag', 'Drag · power against it'], ['rstar', 'Grip outgrows the need beyond'], ['vw', 'Downforce equals weight at'], ['top', 'Top speed (power ÷ drag)']]);
      const plot = kit.plot(gd, { x: { label: 'corner radius (m)', log: true, min: 15, max: 1000 }, y: { label: 'cornering speed (km/h)', min: 0 }, legend: true }, 180);
      const V = ctl.values;
      let r = null, ang = 0;
      function update() {
        const p = CARS[V.car], vtop = topSpeed(V.m, p.CdA, p.P);
        const vg = cornerSpeed(V.m, V.mu, V.ClA, V.R), v = Math.min(vg, vtop);
        const q = 0.5 * RHO * v * v, Fd = q * V.ClA, Wt = V.m * G, D = q * p.CdA;
        r = { p, v, vg, vtop, Fd, Wt, D, lat: v * v / V.R, flat: vg >= vtop };
        ro.set('v', kmh(v) + (r.flat ? ' — flat out: grip to spare' : ''));
        ro.set('lat', (r.lat / G).toFixed(2) + ' g');
        ro.set('df', Fd >= 0 ? fN(Fd) + ' = ' + (Fd / Wt).toFixed(2) + ' × weight' : 'none — a lift of ' + fN(-Fd) + ' (' + (100 * -Fd / Wt).toFixed(1) + ' % of the weight)');
        ro.set('drag', fN(D) + ' · ' + fW(D * v));
        const rs = V.ClA > 0 ? 2 * V.m / (V.mu * RHO * V.ClA) : Infinity;
        ro.set('rstar', Number.isFinite(rs) ? rs.toFixed(0) + ' m (then only power limits the speed)' : 'never — no downforce');
        ro.set('vw', V.ClA > 0 ? kmh(Math.sqrt(2 * Wt / (RHO * V.ClA))) : '—');
        ro.set('top', kmh(vtop) + ' (' + (p.P / 1000).toFixed(0) + ' kW, C_DA ' + p.CdA + ' m²)');
        const sw = [], sn = [];
        for (let k = 0; k <= 120; k++) {
          const R = 15 * Math.pow(1000 / 15, k / 120);
          sw.push([R, 3.6 * Math.min(cornerSpeed(V.m, V.mu, V.ClA, R), vtop)]);
          sn.push([R, 3.6 * Math.min(cornerSpeed(V.m, V.mu, 0, R), vtop)]);
        }
        const vl = [{ x: V.R, label: 'R = ' + V.R.toFixed(0) + ' m' }];
        if (Number.isFinite(rs) && rs < 1000 && rs > 15) vl.push({ x: rs, label: 'grip ≥ need', color: kit.colors().ok });
        plot.set({ series: [{ pts: sw, label: 'with this downforce' }, { pts: sn, label: 'no downforce (√μgR)', dash: [6, 4] }], vlines: vl, hlines: [{ y: vtop * 3.6, label: 'top speed' }], marks: [{ x: V.R, y: v * 3.6 }], fmtY: y => y.toFixed(0) + ' km/h', fmtX: x => x.toFixed(0) + ' m' });
        loop.once();
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!r) return;
        // top view: a circular corner of radius R (drawn to a fixed size), the car going round at the limit
        const cx = st.W * 0.3, cy = st.H * 0.52, rd = Math.min(st.W * 0.24, st.H * 0.4);
        c.strokeStyle = C.surface; c.lineWidth = 26; c.beginPath(); c.arc(cx, cy, rd, 0, 2 * Math.PI); c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([6, 6]); c.beginPath(); c.arc(cx, cy, rd, 0, 2 * Math.PI); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.muted; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + rd, cy); c.stroke();
        kit.label(c, 'R = ' + V.R.toFixed(0) + ' m', cx + rd / 2, cy - 10, { align: 'center', size: 11.5, color: C.muted });
        ang += r.v / V.R * dt;
        const x = cx + rd * Math.cos(ang), y = cy + rd * Math.sin(ang);
        c.save(); c.translate(x, y); c.rotate(ang + Math.PI / 2);
        c.fillStyle = C.accent; c.fillRect(-7, -15, 14, 30); c.fillStyle = C.text; c.fillRect(-9, -11, 3, 7); c.fillRect(6, -11, 3, 7); c.fillRect(-9, 5, 3, 7); c.fillRect(6, 5, 3, 7);
        c.restore();
        const al = Math.min(rd * 0.8, 18 * r.lat / G);
        kit.arrow(c, x, y, x - al * Math.cos(ang), y - al * Math.sin(ang), C.bad, 2.5);
        kit.label(c, (r.lat / G).toFixed(1) + ' g', x - (al + 14) * Math.cos(ang), y - (al + 14) * Math.sin(ang), { align: 'center', size: 11.5, weight: 700, color: C.bad });
        kit.label(c, kmh(r.v), cx, cy, { align: 'center', size: 16, weight: 700, color: C.accent });
        // side view: weight and downforce, available grip and the grip needed
        const sx = st.W * 0.62, sy = st.H * 0.44, L = st.W * 0.3;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(sx, sy); c.lineTo(sx + L * 0.12, sy - 18); c.lineTo(sx + L * 0.75, sy - 22); c.lineTo(sx + L, sy - 8); c.lineTo(sx + L, sy); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = C.text; c.fillRect(sx - 4, sy - 34, L * 0.14, 5); c.fillRect(sx + L * 0.88, sy - 4, L * 0.14, 4);   // rear and front wings
        for (const u of [0.18, 0.84]) kit.dot(c, sx + L * u, sy + 3, 11, C.text);
        const kW = 60 / r.Wt;
        kit.arrow(c, sx + L * 0.5, sy - 10, sx + L * 0.5, sy - 10 + r.Wt * kW, C.bad, 3);
        kit.label(c, 'weight', sx + L * 0.5 + 6, sy + 40, { size: 11.5, color: C.bad });
        if (Math.abs(r.Fd) * kW > 2) {
          const dl = clamp(r.Fd * kW, -60, 200);
          kit.arrow(c, sx + L * 0.12, sy - 60 - dl * 0.55, sx + L * 0.12, sy - 60, C.accent, 3);
          kit.arrow(c, sx + L * 0.9, sy - 40 - dl * 0.45, sx + L * 0.9, sy - 40, C.accent, 3);
          kit.label(c, 'downforce ' + (r.Fd / r.Wt).toFixed(2) + ' × weight', sx + L * 0.5, sy - 70 - Math.max(0, dl) * 0.55, { align: 'center', size: 12, weight: 700, color: C.accent });
        }
        const grip = V.mu * (r.Wt + r.Fd), need = V.m * r.lat, bw = L, by = st.H * 0.8;
        c.fillStyle = C.surface; c.fillRect(sx, by, bw, 10); c.fillRect(sx, by + 24, bw, 10);
        const gmax = Math.max(grip, need, 1);
        c.fillStyle = C.ok; c.fillRect(sx, by, bw * grip / gmax, 10);
        c.fillStyle = C.warn; c.fillRect(sx, by + 24, bw * need / gmax, 10);
        kit.label(c, 'grip available μ(W + downforce) ' + fN(grip), sx, by - 8, { size: 11, color: C.muted });
        kit.label(c, 'sideways force needed mV²/R ' + fN(need), sx, by + 46, { size: 11, color: C.muted });
        kit.label(c, r.p.name, st.W - 12, 16, { align: 'right', size: 12.5, weight: 700 });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ drag-porpoising */
  // downforce area of a ground-effect floor against ride height (mm): it grows as the floor nears the road,
  // peaks, then collapses when the flow under the floor chokes and separates (the floor "stalls")
  const FLOOR = { hp: 18, clmax: 4.6, cl0: 2.6, dec: 22, clstall: 2.4, Lf: 3.0 };
  function floorClA(h) {
    const P = FLOOR;
    if (h >= P.hp) return P.cl0 + (P.clmax - P.cl0) * Math.exp(-(h - P.hp) / P.dec);
    const u = clamp(h / P.hp, 0, 1);
    return P.clstall + (P.clmax - P.clstall) * u * u * (3 - 2 * u);
  }
  Hyper.sim('drag-porpoising', {
    title: 'Porpoising: a ground-effect car that bounces',
    blurb: `A ground-effect floor makes more downforce the closer it runs to the road — until the flow under it chokes and separates, and the downforce collapses. The car is modelled as a mass on its suspension (heave only); the floor's downforce follows ride height with a short lag, the time the air takes to pass under the car. Above a certain speed the downforce pulls the floor into the region where it stalls, the lag feeds energy into the bounce, and the car **porpoises**. Ride height is drawn ten times enlarged. Figures are illustrative.

**Try this**
- Start at 200 km/h: the car settles lower as speed rises. Go to 300 km/h and watch the bounce build up.
- Raise the static ride height by 10 mm: the bouncing starts later, but the floor gives less downforce at medium speed.
- Stiffen the suspension or add damping — two of the fixes teams used in 2022 — and find the speed where it starts again.
- Watch the downforce curve: the dot runs back and forth over the peak, on the stalled side.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 190 });
      const gd = graphDiv(box), gd2 = graphDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'v', label: 'Speed', min: 100, max: 340, step: 1, value: 300, unit: 'km/h' },
        { id: 'h0', label: 'Static ride height', min: 30, max: 70, step: 1, value: 45, unit: 'mm' },
        { id: 'k', label: 'Heave stiffness', min: 200, max: 1200, step: 10, value: 450, unit: 'kN/m' },
        { id: 'c', label: 'Heave damping', min: 3, max: 40, step: 0.5, value: 11, unit: 'kN·s/m' },
        { id: 'slow', type: 'select', label: 'Playback', options: [['real time', 1], ['slow motion (¼)', 0.25]], value: 1 },
        { type: 'buttons', items: [{ id: 'kick', label: 'Bump', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], (id) => { if (id === 'reset') reset(); else if (id === 'kick') S.w += 0.08; });
      const ro = kit.readout(box.side, [['h', 'Ride height now'], ['range', 'Range over the last 2 s'], ['F', 'Downforce'], ['ratio', 'Downforce ÷ weight'], ['fn', 'Heave natural frequency'], ['state', 'State']]);
      const plotH = kit.plot(gd, { x: { label: 'time (s)' }, y: { label: 'ride height (mm)', min: -5, max: 75 } }, 150);
      const plotC = kit.plot(gd2, { x: { label: 'ride height (mm)', min: 0, max: 80 }, y: { label: 'downforce area C_LA (m²)', min: 2, max: 5 } }, 140);
      const V = ctl.values, m = 800;
      let S = null, frameNo = 0, flowX = [];
      const curve = []; for (let h = 0; h <= 80; h += 1) curve.push([h, floorClA(h)]);
      function reset() { S = { z: 0, w: 0, c: floorClA(V.h0), t: 0, hist: [], hmin: Infinity, hmax: -Infinity, win: [] }; }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const v = V.v / 3.6, q = 0.5 * RHO * v * v, tau = FLOOR.Lf / Math.max(v, 5), k = V.k * 1e3, cd = V.c * 1e3;
        // fixed sub-steps of 0.5 ms: semi-implicit Euler for the heave, first-order lag for the floor
        const n = Math.round(dt * V.slow / 0.0005);
        for (let i = 0; i < n; i++) {
          const h = V.h0 - S.z * 1000;
          S.c += (floorClA(h) - S.c) * 0.0005 / tau;
          let Fg = 0; if (h < 0) Fg = 3e6 * (-h / 1000) + 2e4 * Math.max(0, S.w);        // the plank on the road
          const a = (q * S.c - k * S.z - cd * S.w - Fg) / m;
          S.w += a * 0.0005; S.z += S.w * 0.0005; S.t += 0.0005;
        }
        const h = V.h0 - S.z * 1000;
        if (n) { S.hist.push([S.t, h]); S.win.push([S.t, h]); }
        while (S.hist.length && S.hist[0][0] < S.t - 4) S.hist.shift();
        while (S.win.length && S.win[0][0] < S.t - 2) S.win.shift();
        const hs = S.win.map(p => p[1]), hmin = hs.length ? Math.min(...hs) : h, hmax = hs.length ? Math.max(...hs) : h, amp = (hmax - hmin) / 2;
        // ---- the scene: side view of the car over the road; ride height ×10
        const gy = st.H * 0.8, L = st.W * 0.62, x0 = st.W * 0.2, sc = L / 5.5, ex = 10 * sc / 1000;   // px per m for a 5.5 m car; ride height ×10
        c.fillStyle = C.surface; c.fillRect(0, gy, st.W, st.H - gy);
        c.strokeStyle = C.axis; c.lineWidth = 1.5; c.beginPath(); c.moveTo(0, gy); c.lineTo(st.W, gy); c.stroke();
        const floorY = gy - Math.max(0, h) * ex;
        // air under the floor: orderly when attached, churning when the floor has stalled
        const stalled = h < FLOOR.hp;
        while (flowX.length < 28) flowX.push(Math.random());
        c.lineWidth = 1.5;
        for (let i = 0; i < flowX.length; i++) {
          flowX[i] -= dt * (0.3 + v / 200); if (flowX[i] < 0) flowX[i] += 1;
          const fx = x0 + L * flowX[i], jitter = stalled ? (Math.random() - 0.5) * 6 : 0, fy = floorY + (gy - floorY) * (0.3 + 0.4 * ((i * 7) % 5) / 5) + jitter;
          c.strokeStyle = stalled ? C.bad : C.accent; c.beginPath(); c.moveTo(fx, fy); c.lineTo(fx + 14, fy + jitter * 0.5); c.stroke();
        }
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(x0, floorY); c.lineTo(x0 + L, floorY); c.lineTo(x0 + L * 1.05, floorY - 10); c.lineTo(x0 + L * 0.7, floorY - 26); c.lineTo(x0 + L * 0.45, floorY - 48); c.lineTo(x0 + L * 0.3, floorY - 30); c.lineTo(x0 - 6, floorY - 30); c.closePath(); c.fill(); c.stroke();
        c.fillStyle = C.text; c.fillRect(x0 - 16, floorY - 60, 36, 6); c.fillRect(x0 + L * 0.98, floorY - 4, 30, 4);
        const wr = Math.min(0.36 * sc, st.H * 0.12);
        for (const u of [0.1, 0.86]) kit.dot(c, x0 + L * u, gy - wr, wr, C.text);
        const F = q * S.c;
        for (const u of [0.3, 0.55, 0.8]) kit.arrow(c, x0 + L * u, floorY - 30 - F / 900, x0 + L * u, floorY - 30, C.accent, 2.5);
        kit.label(c, 'ride height ' + h.toFixed(1) + ' mm (drawn ×10)', st.W - 12, 16, { align: 'right', size: 12.5, weight: 700, color: stalled ? C.bad : C.text });
        kit.label(c, V.v.toFixed(0) + ' km/h · downforce ' + (F / 1000).toFixed(1) + ' kN', 12, 16, { size: 12.5, weight: 700 });
        if (stalled) kit.label(c, 'floor stalled', x0 + L * 0.5, gy + 14, { align: 'center', size: 11.5, weight: 700, color: C.bad });
        // read-outs and graphs
        ro.set('h', h.toFixed(1) + ' mm (peak downforce at ' + FLOOR.hp + ' mm)');
        ro.set('range', hmin.toFixed(1) + ' to ' + hmax.toFixed(1) + ' mm');
        ro.set('F', (F / 1000).toFixed(1) + ' kN (C_LA ' + S.c.toFixed(2) + ' m²)');
        ro.set('ratio', (F / (m * G)).toFixed(2));
        ro.set('fn', (Math.sqrt(k / m) / (2 * Math.PI)).toFixed(1) + ' Hz, damping ratio ' + (cd / (2 * Math.sqrt(k * m))).toFixed(2));
        ro.set('state', hmin < 0.5 ? 'bottoming: the plank hits the road' : amp > 1.5 ? 'porpoising (± ' + amp.toFixed(1) + ' mm)' : amp > 0.3 ? 'oscillating' : 'steady');
        if (frameNo++ % 2 === 0) {
          plotH.set({ x: { label: 'time (s)', min: Math.max(0, S.t - 4), max: Math.max(4, S.t) }, series: [{ pts: S.hist.slice() }], hlines: [{ y: FLOOR.hp, label: 'floor stalls below', color: C.bad }, { y: 0, label: 'plank on the road' }] });
          plotC.set({ series: [{ pts: curve }], marks: [{ x: clamp(h, 0, 80), y: S.c }], vlines: [{ x: FLOOR.hp, label: 'stall', color: C.bad }] });
        }
      }, box.stage);
      reset();
      loop.start();
    }
  });

  /* ================================================================ drag-ball-flight */
  // drag against Reynolds number: subcritical C_D, the drop through the drag crisis at Re_c, a slow rise after it
  const BALLS = {
    golf: { name: 'Golf ball, dimpled', m: 0.04593, d: 0.04267, cdSub: 0.50, cdSup: 0.22, reC: 5.5e4, w: 0.10, rise: 0.04, clK: 1, V: 70, a: 11, spin: 2700, y0: 0 },
    smooth: { name: 'Golf ball, smooth (no dimples)', m: 0.04593, d: 0.04267, cdSub: 0.48, cdSup: 0.10, reC: 3.5e5, w: 0.05, rise: 0.10, clK: 0.5, V: 70, a: 11, spin: 2700, y0: 0 },
    soccer: { name: 'Football (soccer ball)', m: 0.43, d: 0.22, cdSub: 0.47, cdSup: 0.16, reC: 2.4e5, w: 0.06, rise: 0.05, clK: 1, V: 28, a: 25, spin: 300, y0: 0 },
    base: { name: 'Baseball', m: 0.145, d: 0.0737, cdSub: 0.48, cdSup: 0.30, reC: 1.6e5, w: 0.12, rise: 0.03, clK: 1, V: 45, a: 30, spin: 2000, y0: 1 },
    tennis: { name: 'Tennis ball', m: 0.057, d: 0.067, cdSub: 0.58, cdSup: 0.55, reC: 3e5, w: 0.2, rise: 0, clK: 0.8, V: 45, a: -4, spin: -2000, y0: 2.7 },
    pingpong: { name: 'Table-tennis ball', m: 0.0027, d: 0.040, cdSub: 0.47, cdSup: 0.2, reC: 4e5, w: 0.05, rise: 0, clK: 1, V: 12, a: 12, spin: -3000, y0: 0.3 }
  };
  const ballCd = (b, Re, S) => b.cdSub - (b.cdSub - b.cdSup) / (1 + Math.exp(-(Math.log10(Math.max(Re, 1)) - Math.log10(b.reC)) / b.w)) + b.rise * Math.max(0, Math.log10(Math.max(Re, 1) / b.reC)) + 0.15 * Math.min(0.5, Math.abs(S));
  const ballCl = (b, S) => S === 0 ? 0 : b.clK * Math.sign(S) * 0.54 * Math.pow(Math.min(Math.abs(S), 0.6), 0.4);
  Hyper.sim('drag-ball-flight', {
    title: 'Balls in flight: dimples, the drag crisis and spin',
    blurb: `A ball in flight feels its weight, drag $\\tfrac12\\rho V^2 C_DA$ against its motion and — when it spins — a Magnus lift across it, $\\tfrac12\\rho V^2 C_LA$, with $C_L$ rising with the spin parameter $r\\omega/V$. The drag coefficient depends on the Reynolds number: at the **drag crisis** the boundary layer turns turbulent, clings on further round the back, and the drag falls by half or more. Dimples trigger that at golf-ball speeds; a smooth ball of the same size reaches it only at speeds no golfer can hit. Rounded models of measured data; the trajectory is integrated in 2 ms steps.

**Try this**
- Hit the dimpled golf ball, then the smooth one with the same speed, angle and spin. Compare the carry — and look at the lower graph, where each ball's Reynolds numbers sit.
- Take the spin off the golf ball: without Magnus lift it drops out of the sky.
- Hit the baseball at altitude 1600 m (Denver): about 5 % further.
- Serve the tennis ball with topspin and then with none: topspin pulls it down into the court.
- Compare every ball with the "no air" parabola.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 230 });
      const gd = graphDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'ball', type: 'select', label: 'Ball', options: Object.keys(BALLS).map(k => [BALLS[k].name, k]), value: 'golf' },
        { id: 'V', label: 'Launch speed', min: 5, max: 80, step: 0.5, value: 70, unit: 'm/s' },
        { id: 'a', label: 'Launch angle', min: -10, max: 60, step: 0.5, value: 11, unit: '°' },
        { id: 'spin', label: 'Spin (+ backspin, − topspin)', min: -8000, max: 10000, step: 100, value: 2700, unit: 'rpm' },
        { id: 'alt', type: 'select', label: 'Altitude', options: [['sea level', 0], ['1600 m (Denver)', 1600], ['2240 m (Mexico City)', 2240]], value: 0 },
        { id: 'cmp', type: 'check', label: 'Show "no air" and "no spin" flights', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Launch', primary: true }] }
      ], (id, v) => {
        if (id === 'ball') { const b = BALLS[v]; ctl.set('V', b.V); ctl.set('a', b.a); ctl.set('spin', b.spin); }
        update();
      });
      const ro = kit.readout(box.side, [['carry', 'Carry'], ['apex', 'Highest point'], ['time', 'Time of flight'], ['land', 'Landing speed · angle'], ['re', 'Reynolds number at launch'], ['coef', 'C_D · C_L at launch'], ['dw', 'Drag ÷ weight at launch'], ['cmp', 'No air · no spin']]);
      const plot = kit.plot(gd, { x: { label: 'Reynolds number', log: true, min: 1e4, max: 1e6 }, y: { label: 'drag coefficient C_D (no spin)', min: 0, max: 0.7 }, legend: true }, 160);
      const V = ctl.values;
      let tr = null, tv = null, tn = null, anim = 0;
      function fly(b, air, opt) {
        const A = Math.PI * b.d * b.d / 4, r = b.d / 2, k = 0.5 * air.rho * A / b.m, dt = 0.002;
        let x = 0, y = b.y0, vx = V.V * Math.cos(V.a * D2R), vy = V.V * Math.sin(V.a * D2R), w = opt.nospin ? 0 : V.spin * 2 * Math.PI / 60, t = 0, ymax = y;
        const pts = [[0, y]];
        const f = (vx, vy) => {
          const U = Math.hypot(vx, vy) || 1e-9, Re = U * b.d / air.nu, S = r * w / U;
          const CD = opt.vac ? 0 : ballCd(b, Re, S), CL = opt.vac ? 0 : ballCl(b, S);
          return [-k * U * (CD * vx + CL * vy), -G + k * U * (CL * vx - CD * vy)];
        };
        let n = 0;
        while (t < 30 && x < 2000 && (y >= 0 || t < 0.01)) {
          const [ax1, ay1] = f(vx, vy), [ax2, ay2] = f(vx + ax1 * dt / 2, vy + ay1 * dt / 2), [ax3, ay3] = f(vx + ax2 * dt / 2, vy + ay2 * dt / 2), [ax4, ay4] = f(vx + ax3 * dt, vy + ay3 * dt);
          x += dt * (vx + dt / 6 * (ax1 + ax2 + ax3)); y += dt * (vy + dt / 6 * (ay1 + ay2 + ay3));
          vx += dt / 6 * (ax1 + 2 * ax2 + 2 * ax3 + ax4); vy += dt / 6 * (ay1 + 2 * ay2 + 2 * ay3 + ay4);
          w *= Math.exp(-dt / 25); t += dt; ymax = Math.max(ymax, y);
          if (++n % 10 === 0) pts.push([x, Math.max(y, 0)]);
        }
        pts.push([x, Math.max(0, y)]);
        return { pts, x, t, ymax, vland: Math.hypot(vx, vy), angLand: Math.atan2(-vy, vx) / D2R };
      }
      function update() {
        const b = BALLS[V.ball], air = F.isa(V.alt);
        tr = fly(b, air, {}); tv = fly(b, air, { vac: true }); tn = fly(b, air, { nospin: true });
        anim = 0;
        const Re0 = V.V * b.d / air.nu, S0 = b.d / 2 * V.spin * 2 * Math.PI / 60 / Math.max(V.V, 1e-6);
        const cd0 = ballCd(b, Re0, S0), cl0 = ballCl(b, S0), A = Math.PI * b.d * b.d / 4;
        ro.set('carry', tr.x.toFixed(1) + ' m');
        ro.set('apex', tr.ymax.toFixed(1) + ' m');
        ro.set('time', tr.t.toFixed(2) + ' s');
        ro.set('land', tr.vland.toFixed(1) + ' m/s · ' + tr.angLand.toFixed(0) + '°');
        ro.set('re', Re0.toExponential(2).replace('e+', ' × 10^') + ' (crisis near ' + b.reC.toExponential(1).replace('e+', ' × 10^') + ')');
        ro.set('coef', cd0.toFixed(2) + ' · ' + cl0.toFixed(2) + ' (spin parameter rω/V = ' + S0.toFixed(2) + ')');
        ro.set('dw', (0.5 * air.rho * V.V * V.V * cd0 * A / (b.m * G)).toFixed(2));
        ro.set('cmp', tv.x.toFixed(0) + ' m · ' + tn.x.toFixed(0) + ' m');
        const cdc = [], cdSmooth = [];
        for (let k = 0; k <= 120; k++) { const Re = 1e4 * Math.pow(100, k / 120); cdc.push([Re, ballCd(b, Re, 0)]); cdSmooth.push([Re, ballCd(BALLS.smooth, Re, 0)]); }
        const ReL = tr.vland * b.d / air.nu, series = [{ pts: cdc, label: b.name }];
        if (V.ball !== 'smooth') series.push({ pts: cdSmooth, label: 'smooth sphere', dash: [6, 4] });
        plot.set({ series, marks: [{ x: clamp(Re0, 1e4, 1e6), y: ballCd(b, Re0, 0), label: 'launch' }, { x: clamp(ReL, 1e4, 1e6), y: ballCd(b, ReL, 0), label: 'landing', color: kit.colors().series[1] }], fmtX: x => x.toExponential(2), fmtY: y => y.toFixed(3) });
        loop.start();
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!tr) return;
        const shown = V.cmp ? [tr, tv, tn] : [tr];
        const xmax = Math.max(...shown.map(q => q.x), 1), ymax = Math.max(...shown.map(q => q.ymax), 0.5);
        const L = 40, B = st.H - 30, s = Math.min((st.W - L - 20) / xmax, (B - 30) / ymax);
        const P = (x, y) => [L + x * s, B - y * s];
        c.fillStyle = C.surface; c.fillRect(0, B, st.W, st.H - B);
        c.strokeStyle = C.axis; c.lineWidth = 1.3; c.beginPath(); c.moveTo(0, B); c.lineTo(st.W, B); c.stroke();
        const step = Hyper.niceStep(xmax, 6);
        for (let x = step; x <= xmax * 1.02; x += step) { const [a, bb] = P(x, 0); c.beginPath(); c.moveTo(a, bb); c.lineTo(a, bb + 5); c.stroke(); kit.label(c, x.toFixed(step < 1 ? 1 : 0) + ' m', a, bb + 14, { align: 'center', size: 10.5, color: C.muted }); }
        const path = (q, col, dash, w) => { c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash); c.beginPath(); q.pts.forEach((p, i) => { const [a, bb] = P(p[0], p[1]); i ? c.lineTo(a, bb) : c.moveTo(a, bb); }); c.stroke(); c.setLineDash([]); };
        if (V.cmp) { path(tv, C.faint, [6, 5], 1.5); path(tn, C.series[1], [2, 4], 1.8); }
        path(tr, C.accent, [], 2.4);
        if (V.cmp) {
          kit.label(c, 'no air', P(tv.x, 0)[0], B - 12, { align: 'center', size: 11, color: C.muted });
          kit.label(c, 'no spin', P(tn.x, 0)[0], B - 26, { align: 'center', size: 11, color: C.series[1] });
        }
        anim += dt;
        const i = Math.min(tr.pts.length - 1, Math.floor(anim / tr.t * (tr.pts.length - 1)));
        const [bx, by] = P(tr.pts[i][0], tr.pts[i][1]);
        kit.dot(c, bx, by, 6, C.surface, C.text);
        kit.label(c, BALLS[V.ball].name + ' — carry ' + tr.x.toFixed(1) + ' m', st.W - 12, 16, { align: 'right', size: 13, weight: 700 });
        kit.label(c, V.V + ' m/s at ' + V.a + '°, ' + (V.spin >= 0 ? 'backspin ' : 'topspin ') + Math.abs(V.spin) + ' rpm', st.W - 12, 34, { align: 'right', size: 12, color: C.muted });
        if (anim > tr.t + 1.2) loop.stop();
      }, box.stage);
      update();
    }
  });
})();
