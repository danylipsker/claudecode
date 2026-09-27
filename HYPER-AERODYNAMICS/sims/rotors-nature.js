/* HYPER-AERODYNAMICS · sims/rotors-nature.js — simulations for rotors, wind energy and flight in nature
 *   rot-hover        power to hover against rotor size, mass, altitude and temperature (momentum theory)
 *   rot-multicopter  a multicopter's hover power and battery endurance, and the best battery mass
 *   rot-disc         a helicopter rotor in forward flight: advancing and retreating blades, collective and cyclic
 *                    trim, reverse flow and retreating-blade stall (blade-element theory, uniform inflow)
 *   rot-betz         the actuator-disc stream tube of a wind turbine: slow-down factor, speed and pressure, C_P, C_T
 *   rot-turbine      a 5 MW wind turbine: the C_P–λ curve, variable speed and pitch control, the power curve
 *   rot-sail         apparent wind on a sailing craft: the vector triangle, sail forces and a speed polar
 *   rot-samara       a maple seed falling in autorotation (blade-element momentum theory, like a wind turbine)
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, KT = 1852 / 3600, G = 9.80665;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const graphBox = box => { const d = document.createElement('div'); d.style.padding = '4px 10px 10px'; box.stage.appendChild(d); return d; };
  const bisect = (f, lo, hi, n) => {
    let flo = f(lo);
    for (let k = 0; k < (n || 60); k++) { const m = (lo + hi) / 2, fm = f(m); if ((fm < 0) === (flo < 0)) { lo = m; flo = fm; } else hi = m; }
    return (lo + hi) / 2;
  };
  // air at altitude h (m), with the temperature shifted by dT (K) from the standard atmosphere at the same pressure
  const airAt = (F, h, dT) => { const s = F.isa(h), T = s.T + (dT || 0); return { rho: s.p / (F.Rair * T), T, p: s.p, a: Math.sqrt(1.4 * F.Rair * T) }; };
  const fmtP = w => { const a = Math.abs(w); return a >= 1e6 ? (w / 1e6).toFixed(2) + ' MW' : a >= 1e3 ? (w / 1e3).toFixed(a >= 1e5 ? 0 : 1) + ' kW' : w.toFixed(a >= 10 ? 0 : 1) + ' W'; };
  const fmtF = n => { const a = Math.abs(n); return a >= 1e6 ? (n / 1e6).toFixed(2) + ' MN' : a >= 1e3 ? (n / 1e3).toFixed(a >= 1e5 ? 0 : 2) + ' kN' : n.toFixed(a >= 10 ? 0 : 2) + ' N'; };

  /* ================================================================ rot-hover */
  Hyper.sim('rot-hover', {
    title: 'Power to hover',
    blurb: `A hovering rotor pushes a column of air downward. Momentum theory gives the speed of that air through the disc, $v_h = \\sqrt{T/(2\\rho A)}$, twice as much far below, and the ideal power $P = T v_h = T^{3/2}/\\sqrt{2\\rho A}$. A real rotor needs the ideal power divided by its figure of merit (0.6–0.8). The air density comes from the standard atmosphere, with the temperature shifted as you choose; the dots in the stream tube move at speeds in proportion to the real air (slowed down to be visible).

**Try this**
- Start from the light two-seater and double the rotor diameter: the disc area grows four times and the power halves.
- Climb to 3000 m, then add +20 °C — a hot, high day. How much more power does the same hover need?
- Compare the heavy-lift helicopter and the drone: disc loading, the speed of the downwash and kilograms lifted per kilowatt.
- Lower the figure of merit to 0.5, typical of a small propeller at a low Reynolds number.
- Ground effect, which lowers the power close to the ground, is not included.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const gb = graphBox(box);
      const PRE = [{ m: 620, D: 7.67 }, { m: 1450, D: 10.16 }, { m: 9000, D: 16.36 }, { m: 56000, D: 32 }, { m: 1.5, D: 0.508 }];
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Start from', options: [['Light two-seat helicopter', 0], ['Light utility helicopter', 1], ['Medium utility helicopter', 2], ['Heavy-lift helicopter', 3], ['Camera drone (4 props as one disc)', 4]], value: 0 },
        { id: 'm', label: 'Mass', min: 1, max: 60000, value: 620, unit: 'kg', log: true, sig: 3 },
        { id: 'D', label: 'Rotor diameter', min: 0.3, max: 35, value: 7.67, unit: 'm', log: true, sig: 3 },
        { id: 'h', label: 'Altitude', min: 0, max: 5000, step: 50, value: 0, unit: 'm' },
        { id: 'dT', label: 'Temperature against standard', min: -20, max: 30, step: 1, value: 0, unit: '°C' },
        { id: 'FM', label: 'Figure of merit', min: 0.4, max: 1, step: 0.01, value: 0.7 }
      ], (id, v) => {
        if (id === 'preset') { const p = PRE[v] || PRE[0]; ctl.set('m', p.m); ctl.set('D', p.D); }
        update();
      });
      const ro = kit.readout(box.side, [['rho', 'Air density ρ'], ['DL', 'Disc loading T/A'], ['vh', 'Air speed through the disc v_h'], ['vw', 'Air speed far below, 2v_h'],
        ['Pi', 'Ideal power T·v_h'], ['P', 'Rotor power (÷ figure of merit)'], ['PL', 'Power loading'], ['cmp', 'Against sea level, standard day']]);
      const plot = kit.plot(gb, { x: { label: 'rotor diameter (m)', log: true }, y: { label: 'hover power (kW)', min: 0 }, legend: true }, 170);
      const V = ctl.values;
      let S = null;
      const parts = [];
      function update() {
        const air = airAt(F, V.h, V.dT), T = V.m * G, A = Math.PI * V.D * V.D / 4;
        const DL = T / A, vh = Math.sqrt(DL / (2 * air.rho)), Pi = T * vh, P = Pi / V.FM;
        const P0 = T * Math.sqrt(DL / (2 * 1.225)) / V.FM;
        S = { air, T, A, DL, vh, Pi, P, P0 };
        ro.set('rho', air.rho.toFixed(3) + ' kg/m³');
        ro.set('DL', kit.fmt(DL, 3) + ' N/m²  (' + kit.fmt(DL / G, 3) + ' kg/m²)');
        ro.set('vh', vh.toFixed(2) + ' m/s');
        ro.set('vw', (2 * vh).toFixed(2) + ' m/s');
        ro.set('Pi', fmtP(Pi));
        ro.set('P', fmtP(P) + '  (' + kit.fmt(P / 745.7, 3) + ' hp)');
        ro.set('PL', kit.fmt(V.m / (P / 1000), 3) + ' kg per kW');
        ro.set('cmp', (P >= P0 ? '+' : '−') + Math.abs((P / P0 - 1) * 100).toFixed(1) + ' % power');
        const k = P < 5000 ? 1 : 1000, cur = [], sl = [], d0 = V.D / 3, d1 = V.D * 3;
        for (let i = 0; i <= 60; i++) {
          const d = d0 * Math.pow(d1 / d0, i / 60), a = Math.PI * d * d / 4;
          cur.push([d, T * Math.sqrt(T / a / (2 * air.rho)) / V.FM / k]);
          sl.push([d, T * Math.sqrt(T / a / (2 * 1.225)) / V.FM / k]);
        }
        plot.set({ x: { label: 'rotor diameter (m)', log: true, min: d0, max: d1 }, y: { label: 'hover power (' + (k === 1 ? 'W' : 'kW') + ')', min: 0 },
          series: [{ pts: cur, label: 'this air' }, { pts: sl, label: 'sea level, standard day', dash: [5, 4] }],
          marks: [{ x: V.D, y: P / k, label: fmtP(P) }] });
        loop.once();
      }
      // on the axis of an actuator disc: speed u/v_h = 1 + ζ/√(ζ²+1), tube radius r/R = 1/√(u/v_h)  (ζ = depth / R)
      const uOf = z => 1 + z / Math.sqrt(z * z + 1);
      const rOf = z => Math.min(3, 1 / Math.sqrt(Math.max(0.02, uOf(z))));
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const W = st.W, H = st.H, cx = W * 0.44, y0 = H * 0.3, Rp = Math.max(30, Math.min(W * 0.2, H * 0.34));
        const zTop = -(y0 - 6) / Rp, zBot = (H - y0 - 4) / Rp;
        // the stream tube
        const edge = side => { const pts = []; for (let i = 0; i <= 60; i++) { const z = zTop + (zBot - zTop) * i / 60; pts.push([cx + side * Rp * rOf(z), y0 + z * Rp]); } return pts; };
        const L = edge(-1), Rr = edge(1);
        c.beginPath(); L.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); for (let i = Rr.length - 1; i >= 0; i--) c.lineTo(Rr[i][0], Rr[i][1]); c.closePath();
        c.fillStyle = C.dark ? 'hsl(205 60% 45% / .16)' : 'hsl(205 70% 55% / .12)'; c.fill();
        c.setLineDash([5, 4]); c.strokeStyle = C.accent; c.lineWidth = 1.2;
        for (const e of [L, Rr]) { c.beginPath(); e.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); }
        c.setLineDash([]);
        // air particles, speed in proportion to the real flow
        while (parts.length < 110) parts.push({ s: Math.random() * 2 - 1, z: zTop + Math.random() * (zBot - zTop) });
        for (const q of parts) {
          q.z += uOf(q.z) * dt * 0.8;
          if (q.z > zBot) { q.z = zTop; q.s = Math.random() * 2 - 1; }
          const x = cx + q.s * rOf(q.z) * Rp, y = y0 + q.z * Rp;
          c.globalAlpha = clamp(0.25 + 0.35 * uOf(q.z), 0, 1); c.fillStyle = C.accent; c.fillRect(x - 1.5, y - 1.5, 3, 3);
        }
        c.globalAlpha = 1;
        // the aircraft
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        if (V.m < 25) {
          c.beginPath(); c.rect(cx - Rp * 0.22, y0 + 4, Rp * 0.44, Rp * 0.1); c.fill(); c.stroke();
          for (const s of [-1, 1]) { c.beginPath(); c.moveTo(cx + s * Rp * 0.22, y0 + 8); c.lineTo(cx + s * Rp * 0.55, y0 + 2); c.stroke(); }
        } else {
          c.beginPath(); c.ellipse(cx - Rp * 0.05, y0 + Rp * 0.2, Rp * 0.24, Rp * 0.13, 0, 0, Math.PI * 2); c.fill(); c.stroke();
          c.beginPath(); c.moveTo(cx + Rp * 0.17, y0 + Rp * 0.17); c.lineTo(cx + Rp * 0.95, y0 + Rp * 0.12); c.lineTo(cx + Rp * 0.95, y0 + Rp * 0.17); c.lineTo(cx + Rp * 0.17, y0 + Rp * 0.25); c.closePath(); c.fill(); c.stroke();
          c.beginPath(); c.arc(cx + Rp * 0.97, y0 + Rp * 0.1, Rp * 0.08, 0, Math.PI * 2); c.stroke();
          c.beginPath(); c.moveTo(cx, y0); c.lineTo(cx, y0 + Rp * 0.08); c.stroke();
        }
        c.beginPath(); c.ellipse(cx, y0, Rp, Math.max(2, Rp * 0.045), 0, 0, Math.PI * 2);
        c.fillStyle = C.dark ? 'hsl(210 30% 70% / .35)' : 'hsl(210 25% 40% / .25)'; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
        // thrust, dimensions and speeds
        kit.arrow(c, cx, y0 - 4, cx, y0 - Math.min(y0 - 10, 46), C.ok, 2.5);
        kit.label(c, 'thrust = weight = ' + fmtF(S.T), cx + 8, Math.max(12, y0 - 40), { color: C.text, size: 12, weight: 700 });
        const yv = y0 + Rp * 0.55, yw = Math.min(H - 16, y0 + Rp * 2.2);
        kit.arrow(c, cx + Rp * 1.15, yv - 16, cx + Rp * 1.15, yv + 16, C.accent, 2);
        kit.label(c, 'v_h = ' + S.vh.toFixed(1) + ' m/s', cx + Rp * 1.15 + 8, yv, { color: C.text, size: 12 });
        kit.arrow(c, cx - Rp * 0.95, yw - 20, cx - Rp * 0.95, yw + 12, C.accent, 2.5);
        kit.label(c, '2v_h = ' + (2 * S.vh).toFixed(1) + ' m/s', cx - Rp * 0.95 - 8, yw - 4, { align: 'right', color: C.text, size: 12 });
        kit.label(c, 'D = ' + kit.fmt(V.D, 3) + ' m', cx - Rp, y0 - 14, { color: C.muted, size: 12 });
        kit.label(c, 'disc loading ' + kit.fmt(S.DL, 3) + ' N/m²', W - 12, H - 36, { align: 'right', color: C.muted, size: 12, bg: C.bg2 });
        kit.label(c, 'power ' + fmtP(S.P) + '  ·  ρ = ' + S.air.rho.toFixed(3) + ' kg/m³', W - 12, H - 16, { align: 'right', color: C.text, size: 13, weight: 700, bg: C.bg2 });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ rot-multicopter */
  Hyper.sim('rot-multicopter', {
    title: 'Multicopter endurance',
    blurb: `A multicopter hovers on the thrust of its rotors, and momentum theory sets the power: $P = (mg)^{3/2}/(\\mathrm{FM}\\,\\eta\\sqrt{2\\rho N A_1})$, electrical, with $\\eta$ for the motors and their controllers. The battery holds its mass times its specific energy; 80 % of it is used, keeping a reserve. The flight clock runs in time-lapse, one second for each minute of hover.

**Try this**
- The default is a 1.5 kg quadcopter with 10-inch propellers and 0.5 kg of battery (about 74 Wh). Note the hover time, then add battery: the time rises, then falls — extra battery must lift itself.
- Find the peak: with this model it is always where the battery is two-thirds of the take-off mass. Notice how flat the curve is near the top.
- Swap to 15-inch propellers: bigger discs, lower disc loading, less power.
- Go to 3000 m, where the thin air costs about 15 % more power.
- Pick a hexacopter with the same propellers: more disc area, and a spare motor's worth of redundancy.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'N', type: 'select', label: 'Rotors', options: [['4 (quadcopter)', 4], ['6 (hexacopter)', 6], ['8 (octocopter)', 8]], value: 4 },
        { id: 'Dp', label: 'Propeller diameter', min: 3, max: 30, step: 0.5, value: 10, unit: 'in' },
        { id: 'm0', label: 'Drone without battery', min: 0.1, max: 20, value: 1.0, unit: 'kg', log: true, sig: 2 },
        { id: 'mb', label: 'Battery mass', min: 0.02, max: 15, value: 0.5, unit: 'kg', log: true, sig: 2 },
        { id: 'cells', type: 'select', label: 'Battery voltage', options: [['3 cells (11.1 V)', 3], ['4 cells (14.8 V)', 4], ['6 cells (22.2 V)', 6], ['12 cells (44.4 V)', 12]], value: 4 },
        { id: 'es', label: 'Pack specific energy', min: 80, max: 300, step: 5, value: 150, unit: 'Wh/kg' },
        { id: 'FM', label: 'Figure of merit', min: 0.35, max: 0.8, step: 0.01, value: 0.6 },
        { id: 'eta', label: 'Motor × controller efficiency', min: 0.5, max: 0.95, step: 0.01, value: 0.8 },
        { id: 'h', label: 'Altitude', min: 0, max: 4000, step: 50, value: 0, unit: 'm' }
      ], () => update());
      const ro = kit.readout(box.side, [['m', 'Take-off mass'], ['T1', 'Thrust per rotor'], ['DL', 'Disc loading · downwash v_h'], ['P', 'Electrical power to hover'],
        ['I', 'Battery current'], ['E', 'Battery energy (80 % used)'], ['t', 'Hover time'], ['best', 'Best battery mass here'], ['note', '']]);
      const plot = kit.plot(gb, { x: { label: 'battery mass (kg)', min: 0 }, y: { label: 'hover time (min)', min: 0 } }, 170);
      const V = ctl.values, USABLE = 0.8;
      let S = null, clock = 0, pause = 0, spin = 0;
      function calc(mb) {
        const rho = F.isa(V.h).rho, W = (V.m0 + mb) * G, d = V.Dp * 0.0254, A1 = Math.PI * d * d / 4, N = +V.N;
        const P = Math.pow(W, 1.5) / (V.FM * V.eta * Math.sqrt(2 * rho * N * A1));
        const E = mb * V.es;
        return { rho, W, A1, N, P, E, t: USABLE * E / P * 60, vh: Math.sqrt(W / (2 * rho * N * A1)) };
      }
      function update() {
        const s = calc(V.mb), Vb = 3.7 * V.cells, cap = s.E / Vb, I = s.P / Vb, Cr = cap > 0 ? I / cap : 0;
        const best = 2 * V.m0, sb = calc(best);
        S = Object.assign(s, { Vb, cap, I, Cr, best, tb: sb.t });
        ro.set('m', (V.m0 + V.mb).toFixed(2) + ' kg (battery ' + Math.round(100 * V.mb / (V.m0 + V.mb)) + ' %)');
        ro.set('T1', (s.W / s.N).toFixed(2) + ' N  (' + Math.round(s.W / s.N / G * 1000) + ' g)');
        ro.set('DL', kit.fmt(s.W / (s.N * s.A1), 3) + ' N/m² · ' + s.vh.toFixed(1) + ' m/s');
        ro.set('P', fmtP(s.P));
        ro.set('I', I.toFixed(1) + ' A at ' + Vb.toFixed(1) + ' V  (' + Cr.toFixed(1) + ' C)');
        ro.set('E', (s.E * USABLE).toFixed(0) + ' Wh of ' + s.E.toFixed(0) + ' Wh  (' + Math.round(cap * 1000) + ' mAh)');
        ro.set('t', s.t.toFixed(1) + ' min');
        ro.set('best', best.toFixed(2) + ' kg → ' + sb.t.toFixed(1) + ' min');
        ro.set('note', Cr > 25 ? 'This current is beyond what most packs are rated for' : s.W / (s.N * s.A1) > 250 ? 'High disc loading: small props for this mass' : 'Hover only; forward flight, wind and climbs cost more');
        const top = Math.max(best * 2.5, V.mb * 1.3), pts = [];
        for (let i = 1; i <= 80; i++) { const mb = top * i / 80; pts.push([mb, calc(mb).t]); }
        plot.set({ x: { label: 'battery mass (kg)', min: 0, max: top }, series: [{ pts, label: 'hover time' }], marks: [{ x: V.mb, y: s.t, label: 'now' }],
          vlines: [{ x: best, label: 'best: battery = ⅔ of take-off mass' }] });
        clock = 0; pause = 0;
        loop.once();
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const Wd = st.W * 0.62, H = st.H, cx = Wd * 0.5, cy = H * 0.5, N = S.N;
        const armD = Math.max(0.75, 1.12 / (2 * Math.sin(Math.PI / N)));      // arm length in propeller diameters
        const px = Math.min(Wd, H) * 0.9 / (2 * armD + 1), rp = px / 2;
        spin += dt * 22;
        for (let k = 0; k < N; k++) {
          const a = -Math.PI / 2 + Math.PI / N + 2 * Math.PI * k / N, x = cx + Math.cos(a) * armD * px, y = cy + Math.sin(a) * armD * px;
          const dir = k % 2 ? -1 : 1, col = dir > 0 ? C.series[0] : C.series[1];
          c.strokeStyle = C.text; c.lineWidth = Math.max(2, px * 0.06); c.beginPath(); c.moveTo(cx, cy); c.lineTo(x, y); c.stroke();
          c.beginPath(); c.arc(x, y, rp, 0, Math.PI * 2); c.globalAlpha = 0.16; c.fillStyle = col; c.fill(); c.globalAlpha = 1;
          c.strokeStyle = col; c.lineWidth = 1; c.stroke();
          const b = spin * dir + k;
          c.lineWidth = Math.max(2, rp * 0.1); c.beginPath(); c.moveTo(x - Math.cos(b) * rp * 0.95, y - Math.sin(b) * rp * 0.95); c.lineTo(x + Math.cos(b) * rp * 0.95, y + Math.sin(b) * rp * 0.95); c.stroke();
          kit.dot(c, x, y, Math.max(2.5, rp * 0.1), C.text);
          kit.label(c, dir > 0 ? '↻ CW' : '↺ CCW', x, y + rp + 10, { align: 'center', color: col, size: 11 });
        }
        // body with the battery drawn in proportion to its share of the mass
        const bw = px * 0.55, bh = px * 0.34;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.rect(cx - bw / 2, cy - bh / 2, bw, bh); c.fill(); c.stroke();
        const frac = V.mb / (V.m0 + V.mb);
        c.fillStyle = C.warn; c.fillRect(cx - bw / 2 + 3, cy - bh / 2 + 3, (bw - 6) * frac, bh - 6);
        c.beginPath(); c.moveTo(cx, cy - bh / 2 - 12); c.lineTo(cx - 7, cy - bh / 2 - 2); c.lineTo(cx + 7, cy - bh / 2 - 2); c.closePath(); c.fillStyle = C.accent; c.fill();
        // the flight clock (time-lapse) and the battery gauge
        if (pause > 0) { pause -= dt; if (pause <= 0) clock = 0; }
        else { clock += dt; if (clock >= S.t) { clock = S.t; pause = 2.5; } }
        const left = 1 - clock / Math.max(S.t, 1e-6), charge = 0.2 + 0.8 * left;
        const gx = st.W * 0.72, gy = H * 0.2, gw = Math.min(70, st.W * 0.1), gh = H * 0.5;
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(gx, gy, gw, gh); c.fillStyle = C.text; c.fillRect(gx + gw * 0.3, gy - 7, gw * 0.4, 7);
        c.fillStyle = charge > 0.35 ? C.ok : charge > 0.22 ? C.warn : C.bad;
        c.fillRect(gx + 3, gy + 3 + (gh - 6) * (1 - charge), gw - 6, (gh - 6) * charge);
        c.strokeStyle = C.muted; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(gx - 6, gy + 3 + (gh - 6) * 0.8); c.lineTo(gx + gw + 6, gy + 3 + (gh - 6) * 0.8); c.stroke(); c.setLineDash([]);
        kit.label(c, Math.round(charge * 100) + ' %', gx + gw + 10, gy + gh * (1 - charge) + 6, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'reserve 20 %', gx + gw + 10, gy + 3 + (gh - 6) * 0.8, { color: C.muted, size: 11 });
        kit.label(c, 'hovering ' + clock.toFixed(1) + ' of ' + S.t.toFixed(1) + ' min', gx - 4, gy + gh + 22, { color: C.text, size: 12, weight: 700 });
        kit.label(c, pause > 0 ? 'land now — reserve reached' : 'time-lapse: 1 s = 1 min', gx - 4, gy + gh + 40, { color: pause > 0 ? C.bad : C.muted, size: 11 });
        kit.label(c, fmtP(S.P) + '  ·  ' + S.I.toFixed(1) + ' A', 12, H - 14, { color: C.text, size: 13, weight: 700 });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ rot-disc */
  Hyper.sim('rot-disc', {
    title: 'Rotor disc in forward flight',
    blurb: `A four-bladed rotor of 14.6 m seen from above, flying up the screen. Each blade section meets air at its own speed, $\\Omega r + V\\sin\\psi$: fast on the advancing side (right, for a rotor turning anticlockwise), slow on the retreating side, and backwards inside the **reverse-flow circle**. To keep the rotor from rolling, the controls trim the blade pitch — collective $\\theta_0$ plus cyclic $\\theta_{1s}\\sin\\psi$ — so that the lift moment of the advancing side equals that of the retreating side; the colours show each section's angle of attack. The model is blade-element theory with uniform inflow, rigid blades and 10° of twist; sections above 12° are marked stalled.

**Try this**
- Hover (0 kt): every azimuth looks the same. Speed up and watch the cyclic grow and the retreating side work harder.
- Find the speed where stall first appears on the retreating side. Now add mass or climb to 3000 m: stall comes sooner.
- Push toward 200 kt and read the advancing tip's Mach number — the other limit of a conventional rotor.
- Lower the tip speed: the advancing tip is relieved, but the advance ratio rises and the retreating side stalls earlier.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 290, maxH: 560 });
      const gb = graphBox(box);
      const R = 7.3, NB = 4, CH = 0.53, FE = 2.0, TW = -10 * D2R, A0 = 5.73, ASTALL = 12, X0 = 0.2, NX = 24, NP = 72;
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Forward speed', min: 0, max: 210, step: 1, value: 120, unit: 'kt' },
        { id: 'm', label: 'Mass', min: 5000, max: 11000, step: 100, value: 8000, unit: 'kg' },
        { id: 'h', label: 'Altitude', min: 0, max: 4000, step: 50, value: 0, unit: 'm' },
        { id: 'tip', label: 'Tip speed ΩR', min: 180, max: 240, step: 1, value: 220, unit: 'm/s' },
        { id: 'show', type: 'select', label: 'Colours show', options: [['Angle of attack', 'alpha'], ['Air speed over the blade', 'speed']], value: 'alpha' }
      ], () => trim());
      const ro = kit.readout(box.side, [['mu', 'Advance ratio μ = V/ΩR'], ['adv', 'Advancing tip'], ['ret', 'Retreating tip'], ['rev', 'Reverse-flow circle'],
        ['th0', 'Collective θ₀ (at 75 % radius)'], ['th1', 'Cyclic θ₁s'], ['amax', 'Highest angle of attack'], ['stall', 'Stalled share of the disc'], ['note', '']]);
      const plot = kit.plot(gb, { x: { label: 'blade azimuth ψ (°): 90 advancing, 270 retreating', min: 0, max: 360 }, y: { label: 'angle of attack (°)' }, legend: true }, 170);
      const V = ctl.values;
      let S = null, psi0 = 0;
      const alpha = new Float64Array(NX * NP), speed = new Float64Array(NX * NP), rev = new Uint8Array(NX * NP);
      function trim() {
        const air = F.isa(V.h), rho = air.rho, tip = V.tip, v = V.V * KT, W = V.m * G, A = Math.PI * R * R;
        const mu = v / tip, CT = W / (rho * A * tip * tip), Dr = 0.5 * rho * v * v * FE, ad = Math.atan2(Dr, W);
        let li = Math.sqrt(CT / 2), lam = li;
        for (let k = 0; k < 300; k++) { lam = mu * Math.tan(ad) + li; li = 0.5 * li + 0.5 * CT / (2 * Math.sqrt(mu * mu + lam * lam)); }
        lam = mu * Math.tan(ad) + li;
        // lift per unit span ∝ (θ0 + θ1s sinψ + twist) u_T² − λ u_T ; thrust = weight and no rolling moment
        let I1 = 0, I2 = 0, I3 = 0, J1 = 0, J2 = 0, J3 = 0;
        const dx = (1 - X0) / NX;
        for (let j = 0; j < NP; j++) {
          const s = Math.sin((j + 0.5) / NP * 2 * Math.PI);
          for (let i = 0; i < NX; i++) {
            const x = X0 + (i + 0.5) * dx, uT = x + mu * s;
            if (uT <= 0) continue;
            const tw = TW * (x - 0.75), u2 = uT * uT;
            I1 += u2; I2 += s * u2; I3 += lam * uT - tw * u2;
            J1 += x * s * u2; J2 += x * s * s * u2; J3 += x * s * (lam * uT - tw * u2);
          }
        }
        const nrm = dx / NP; I1 *= nrm; I2 *= nrm; I3 *= nrm; J1 *= nrm; J2 *= nrm; J3 *= nrm;
        const K = 0.5 * rho * CH * A0 * tip * tip * R * NB, r1 = W / K + I3, r2 = J3, det = I1 * J2 - I2 * J1 || 1e-12;
        const th0 = (r1 * J2 - I2 * r2) / det, th1s = (I1 * r2 - J1 * r1) / det;
        let amax = -99, nSt = 0, n = 0;
        for (let j = 0; j < NP; j++) {
          const s = Math.sin((j + 0.5) / NP * 2 * Math.PI);
          for (let i = 0; i < NX; i++) {
            const x = X0 + (i + 0.5) * dx, uT = x + mu * s, k = j * NX + i;
            speed[k] = uT * tip;
            if (uT <= 0) { rev[k] = 1; alpha[k] = 0; continue; }
            rev[k] = 0;
            const al = (th0 + th1s * s + TW * (x - 0.75) - Math.atan2(lam, uT)) / D2R;
            alpha[k] = al; n++; if (al > ASTALL) nSt++; if (al > amax) amax = al;
          }
        }
        S = { air, mu, CT, lam, th0: th0 / D2R, th1s: th1s / D2R, amax, stall: n ? nSt / n : 0, tip, v, Madv: (tip + v) / air.a };
        ro.set('mu', mu.toFixed(3));
        ro.set('adv', (tip + v).toFixed(0) + ' m/s, Mach ' + S.Madv.toFixed(2));
        ro.set('ret', (tip - v).toFixed(0) + ' m/s');
        ro.set('rev', mu > 0.005 ? 'diameter ' + (mu * R).toFixed(2) + ' m (' + (mu * 100).toFixed(0) + ' % of R)' : 'none in hover');
        ro.set('th0', S.th0.toFixed(1) + '°');
        ro.set('th1', S.th1s.toFixed(1) + '°  (pitch ' + (S.th0 + S.th1s).toFixed(1) + '° advancing, ' + (S.th0 - S.th1s).toFixed(1) + '° retreating)');
        ro.set('amax', amax.toFixed(1) + '°');
        ro.set('stall', (S.stall * 100).toFixed(1) + ' %');
        ro.set('note', S.stall > 0.02 ? 'Retreating-blade stall: vibration, pitch-up and roll' : S.Madv > 0.9 ? 'Advancing tip near Mach 1: shocks, noise, power' : S.stall > 0 ? 'Stall is starting at the retreating tip' : 'Within the rotor\'s limits');
        const series = [];
        for (const xr of [0.5, 0.75, 0.95]) {
          const pts = [];
          for (let d = 0; d <= 360; d += 2) {
            const s = Math.sin(d * D2R), uT = xr + mu * s;
            if (uT <= 0.02) continue;
            pts.push([d, (th0 + th1s * s + TW * (xr - 0.75) - Math.atan2(lam, uT)) / D2R]);
          }
          series.push({ pts, label: Math.round(xr * 100) + ' % radius', dash: xr === 0.5 ? [5, 4] : undefined });
        }
        plot.set({ series, hlines: [{ y: ASTALL, label: 'stall ≈ 12°' }], vlines: [{ x: 90, label: 'advancing' }, { x: 270, label: 'retreating' }] });
        loop.once();
      }
      const heat = (t, C) => 'hsl(' + (235 - 235 * clamp(t, 0, 1)).toFixed(0) + ' 75% ' + (C.dark ? 48 : 56) + '%)';
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const W = st.W, H = st.H, cx = W * 0.43, cy = H * 0.5, Rp = Math.max(40, Math.min(W * 0.33, H * 0.42));
        // the fuselage underneath
        c.fillStyle = C.surface; c.strokeStyle = C.muted; c.lineWidth = 1.2;
        c.beginPath(); c.ellipse(cx, cy - Rp * 0.05, Rp * 0.12, Rp * 0.3, 0, 0, Math.PI * 2); c.fill(); c.stroke();
        c.beginPath(); c.rect(cx - Rp * 0.025, cy + Rp * 0.2, Rp * 0.05, Rp * 0.95); c.fill(); c.stroke();
        // the disc, cell by cell
        const dx = (1 - X0) / NX, mode = V.show;
        for (let j = 0; j < NP; j++) {
          const p1 = j / NP * 2 * Math.PI, p2 = (j + 1) / NP * 2 * Math.PI;
          for (let i = 0; i < NX; i++) {
            const k = j * NX + i, r1 = (X0 + i * dx) * Rp, r2 = (X0 + (i + 1) * dx) * Rp;
            let col;
            if (rev[k]) col = C.dark ? 'hsl(0 0% 30%)' : 'hsl(0 0% 72%)';
            else if (mode === 'speed') col = heat(speed[k] / (S.tip + S.v || 1), C);
            else col = alpha[k] > ASTALL ? (C.dark ? 'hsl(350 80% 40%)' : 'hsl(350 80% 38%)') : heat((alpha[k] + 2) / (ASTALL + 2), C);
            c.beginPath(); c.arc(cx, cy, r2 + 0.4, Math.PI / 2 - p2 - 0.004, Math.PI / 2 - p1 + 0.004); c.arc(cx, cy, r1, Math.PI / 2 - p1 + 0.004, Math.PI / 2 - p2 - 0.004, true); c.closePath();
            c.globalAlpha = 0.9; c.fillStyle = col; c.fill();
          }
        }
        c.globalAlpha = 1;
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.arc(cx, cy, Rp, 0, Math.PI * 2); c.stroke();
        if (S.mu > 0.005) { c.setLineDash([4, 3]); c.beginPath(); c.arc(cx - S.mu * Rp / 2, cy, S.mu * Rp / 2, 0, Math.PI * 2); c.stroke(); c.setLineDash([]); }
        // blades, turning anticlockwise seen from above (slowed down)
        psi0 += dt * 2 * Math.PI * 0.35;
        c.strokeStyle = C.text; c.lineWidth = 3;
        for (let b = 0; b < NB; b++) {
          const p = psi0 + b * Math.PI / 2, ex = Math.sin(p), ey = Math.cos(p);
          c.beginPath(); c.moveTo(cx + ex * Rp * 0.06, cy + ey * Rp * 0.06); c.lineTo(cx + ex * Rp, cy + ey * Rp); c.stroke();
        }
        kit.dot(c, cx, cy, Math.max(3, Rp * 0.05), C.text);
        // labels and the relative wind
        kit.label(c, 'flight ↑', cx, 12, { align: 'center', color: C.text, size: 12, weight: 700 });
        kit.label(c, 'advancing', cx + Rp * 0.62, cy - Rp - 8 < 14 ? cy + Rp + 12 : cy - Rp - 8, { align: 'center', color: C.muted, size: 12 });
        kit.label(c, 'retreating', cx - Rp * 0.62, cy - Rp - 8 < 14 ? cy + Rp + 12 : cy - Rp - 8, { align: 'center', color: C.muted, size: 12 });
        if (S.v > 1) for (let i = 0; i < 4; i++) { const y = cy - Rp * 0.8 + i * Rp * 0.5; kit.arrow(c, cx - Rp - 22, y, cx - Rp - 22, y + 26, C.faint, 1.4); kit.arrow(c, cx + Rp + 22, y, cx + Rp + 22, y + 26, C.faint, 1.4); }
        if (S.mu > 0.08) kit.label(c, 'reverse flow', cx - S.mu * Rp / 2, cy, { align: 'center', color: C.text, size: 10, bg: C.bg2 });
        // colour key
        const kx = W - 34, ky = H * 0.14, kh = H * 0.62;
        for (let i = 0; i < 40; i++) {
          const t = 1 - i / 40;
          c.fillStyle = mode === 'speed' ? heat(t, C) : (t * (ASTALL + 4) - 2 > ASTALL ? (C.dark ? 'hsl(350 80% 40%)' : 'hsl(350 80% 38%)') : heat((t * (ASTALL + 4)) / (ASTALL + 2), C));
          c.fillRect(kx, ky + kh * i / 40, 14, kh / 40 + 1);
        }
        const lab = mode === 'speed' ? [[1, (S.tip + S.v).toFixed(0) + ' m/s'], [0, '0']] : [[1, (ASTALL + 2) + '°'], [(ASTALL + 2) / (ASTALL + 4), 'stall'], [2 / (ASTALL + 4), '0°'], [0, '−2°']];
        for (const [t, s] of lab) kit.label(c, s, kx - 4, ky + kh * (1 - t), { align: 'right', color: C.muted, size: 10 });
        kit.label(c, mode === 'speed' ? 'air speed' : 'α', kx + 7, ky - 10, { align: 'center', color: C.text, size: 11, weight: 700 });
        kit.label(c, 'μ = ' + S.mu.toFixed(2) + '   ' + V.V.toFixed(0) + ' kt', 12, H - 14, { color: S.stall > 0.02 ? C.bad : C.text, size: 13, weight: 700 });
      }, box.stage);
      trim();
      loop.start();
    }
  });

  /* ================================================================ rot-betz */
  Hyper.sim('rot-betz', {
    title: 'The Betz stream tube',
    blurb: `An ideal wind turbine as an actuator disc. It slows the wind by a fraction $a$ at the disc and $2a$ far behind, so the stream tube widens as it passes. The speed falls smoothly; the pressure rises ahead of the disc, drops suddenly across it (that jump is the thrust) and recovers in the wake. The power taken out is $P = \\tfrac12\\rho A V^3\\cdot 4a(1-a)^2$ — dots move at speeds in proportion to the real air.

**Try this**
- Start at $a = 1/3$: $C_P = 16/27 = 0.593$, the Betz limit. Move either way and the power falls.
- Push $a$ toward 0.5: the wake almost stops and the tube balloons, the thrust keeps growing, and the power falls. Beyond about 0.4 real rotors leave momentum theory (turbulent wake).
- Set $a$ small: the air hardly notices the rotor and little power is taken.
- Change the wind speed: power grows with $V^3$, thrust with $V^2$.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 290, maxH: 560 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'a', label: 'Slow-down factor a', min: 0, max: 0.5, step: 0.005, value: 0.335 },
        { id: 'V', label: 'Wind speed', min: 3, max: 25, step: 0.5, value: 10, unit: 'm/s' },
        { id: 'D', label: 'Rotor diameter', min: 1, max: 240, step: 1, value: 126, unit: 'm' }
      ], () => update());
      const ro = kit.readout(box.side, [['v2', 'Speed at the rotor V(1 − a)'], ['v3', 'Speed far behind V(1 − 2a)'], ['ar', 'Areas: upstream : rotor : wake'], ['cp', 'Power coefficient C_P'],
        ['ct', 'Thrust coefficient C_T'], ['Pw', 'Wind power through the disc'], ['P', 'Power taken out'], ['T', 'Thrust on the rotor'], ['frac', 'Share of the Betz limit']]);
      const plot = kit.plot(gb, { x: { label: 'slow-down factor a', min: 0, max: 0.5 }, y: { label: 'coefficient', min: 0, max: 1.05 }, legend: true }, 170);
      const V = ctl.values, rho = 1.225;
      let S = null;
      const parts = [], outer = [];
      function update() {
        const a = V.a, A = Math.PI * V.D * V.D / 4, cp = 4 * a * (1 - a) * (1 - a), ct = 4 * a * (1 - a), q = 0.5 * rho * V.V * V.V;
        S = { a, cp, ct };
        ro.set('v2', (V.V * (1 - a)).toFixed(2) + ' m/s');
        ro.set('v3', (V.V * (1 - 2 * a)).toFixed(2) + ' m/s');
        ro.set('ar', a < 0.499 ? (1 - a).toFixed(2) + ' : 1 : ' + ((1 - a) / (1 - 2 * a)).toFixed(2) : (1 - a).toFixed(2) + ' : 1 : very large');
        ro.set('cp', cp.toFixed(4) + (Math.abs(a - 1 / 3) < 0.004 ? '  = 16/27, the maximum' : ''));
        ro.set('ct', ct.toFixed(3));
        ro.set('Pw', fmtP(q * V.V * A));
        ro.set('P', fmtP(q * V.V * A * cp));
        ro.set('T', fmtF(q * A * ct));
        ro.set('frac', (cp / (16 / 27) * 100).toFixed(1) + ' %');
        const pc = [], pt = [];
        for (let i = 0; i <= 100; i++) { const x = 0.5 * i / 100; pc.push([x, 4 * x * (1 - x) * (1 - x)]); pt.push([x, 4 * x * (1 - x)]); }
        plot.set({ series: [{ pts: pc, label: 'C_P = 4a(1 − a)²' }, { pts: pt, label: 'C_T = 4a(1 − a)', dash: [5, 4] }],
          marks: [{ x: a, y: cp, label: 'C_P ' + cp.toFixed(3) }, { x: a, y: ct }], vlines: [{ x: 1 / 3, label: 'a = 1/3' }, { x: 0.4, label: 'momentum theory fails →' }], hlines: [{ y: 16 / 27, label: '16/27' }] });
        loop.once();
      }
      const u = (xi, a) => 1 - a * (1 + xi / Math.sqrt(xi * xi + 1));                    // speed / V on the axis
      const r = (xi, a) => Math.min(2.6, Math.sqrt((1 - a) / Math.max(0.02, u(xi, a))));   // tube radius / R
      const XI0 = -3, XI1 = 4;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const a = S.a, W = st.W, H = st.H, x0 = 40, x1 = W - 16, yc = H * 0.3, Rp = H * 0.085;
        const X = xi => x0 + (xi - XI0) / (XI1 - XI0) * (x1 - x0);
        const edge = s => { const p = []; for (let i = 0; i <= 80; i++) { const xi = XI0 + (XI1 - XI0) * i / 80; p.push([X(xi), yc + s * r(xi, a) * Rp]); } return p; };
        const up = edge(-1), lo = edge(1);
        c.beginPath(); up.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); for (let i = lo.length - 1; i >= 0; i--) c.lineTo(lo[i][0], lo[i][1]); c.closePath();
        c.fillStyle = C.dark ? 'hsl(205 60% 45% / .16)' : 'hsl(205 70% 55% / .12)'; c.fill();
        c.strokeStyle = C.accent; c.lineWidth = 1.4;
        for (const e of [up, lo]) { c.beginPath(); e.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); }
        // particles inside the tube and in the outer stream
        while (parts.length < 90) parts.push({ xi: XI0 + Math.random() * (XI1 - XI0), s: Math.random() * 2 - 1 });
        while (outer.length < 50) outer.push({ xi: XI0 + Math.random() * (XI1 - XI0), d: (Math.random() < 0.5 ? -1 : 1) * (0.25 + Math.random() * 1.1) });
        c.fillStyle = C.accent;
        for (const q of parts) {
          q.xi += u(q.xi, a) * dt * 0.9;
          if (q.xi > XI1) { q.xi = XI0; q.s = Math.random() * 2 - 1; }
          c.fillRect(X(q.xi) - 1.5, yc + q.s * r(q.xi, a) * Rp - 1.5, 3, 3);
        }
        c.fillStyle = C.faint;
        for (const q of outer) {
          q.xi += dt * 0.9;
          if (q.xi > XI1) q.xi = XI0;
          const y = yc + (q.d > 0 ? 1 : -1) * (r(q.xi, a) + Math.abs(q.d)) * Rp;
          if (y > 4 && y < H * 0.56) c.fillRect(X(q.xi) - 1.2, y - 1.2, 2.4, 2.4);
        }
        // the rotor, edge-on
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(X(0), yc - Rp); c.lineTo(X(0), yc + Rp); c.stroke();
        kit.dot(c, X(0), yc, 4, C.text);
        kit.label(c, 'wind V = ' + V.V.toFixed(1) + ' m/s', 8, 14, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'V(1 − a) = ' + (V.V * (1 - a)).toFixed(1), X(0) + 8, yc - Rp - 10, { color: C.text, size: 12 });
        kit.label(c, 'V(1 − 2a) = ' + (V.V * (1 - 2 * a)).toFixed(1), X(3.1), 14, { align: 'center', color: C.text, size: 12 });
        // speed and pressure along the axis, on the same x scale
        const gy0 = H * 0.62, gy1 = H - 22, ymin = -0.5, ymax = 1.1, Y = v => gy1 - (v - ymin) / (ymax - ymin) * (gy1 - gy0);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, Y(0)); c.lineTo(x1, Y(0)); c.moveTo(x0, Y(1)); c.lineTo(x1, Y(1)); c.stroke();
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(X(0), gy0); c.lineTo(X(0), gy1); c.stroke();
        // upstream of the disc, then downstream (the pressure jumps at the disc; the speed does not)
        const line = (fUp, fDn, col, dash) => {
          c.strokeStyle = col; c.lineWidth = 2; c.setLineDash(dash || []); c.beginPath();
          for (let i = 0; i <= 70; i++) { const xi = XI0 * (1 - i / 70); i ? c.lineTo(X(xi), Y(fUp(xi))) : c.moveTo(X(xi), Y(fUp(xi))); }
          for (let i = 0; i <= 90; i++) { const xi = XI1 * i / 90; c.lineTo(X(xi), Y(fDn(xi))); }
          c.stroke(); c.setLineDash([]);
        };
        const sp = xi => u(xi, a);
        line(sp, sp, C.accent);
        line(xi => 1 - sp(xi) * sp(xi), xi => (1 - 2 * a) * (1 - 2 * a) - sp(xi) * sp(xi), C.warn, [6, 3]);
        kit.label(c, 'speed u/V', x0 + 4, Y(1) - 9, { color: C.accent, size: 11, weight: 700 });
        kit.label(c, 'pressure (p − p∞)/½ρV²', X(-2.6), Y(0) - 9, { color: C.warn, size: 11, weight: 700 });
        kit.label(c, '1', x0 - 6, Y(1), { align: 'right', color: C.muted, size: 10 });
        kit.label(c, '0', x0 - 6, Y(0), { align: 'right', color: C.muted, size: 10 });
        kit.label(c, 'pressure jump = C_T = ' + S.ct.toFixed(2), X(0) + 8, Y(-0.42), { color: C.text, size: 11 });
        kit.label(c, 'C_P = ' + S.cp.toFixed(3), W - 12, H * 0.56, { align: 'right', color: Math.abs(a - 1 / 3) < 0.01 ? C.ok : C.text, size: 13, weight: 700 });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ rot-turbine */
  // an empirical C_P(λ, β) surface widely used in turbine-control studies (β in degrees); peak 0.48 at λ ≈ 8.1
  const cpFit = (lam, b) => {
    if (lam <= 0.05) return 0;
    const li = 1 / (1 / (lam + 0.08 * b) - 0.035 / (b * b * b + 1));
    return 0.5176 * (116 / li - 0.4 * b - 5) * Math.exp(-21 / li) + 0.0068 * lam;
  };
  Hyper.sim('rot-turbine', {
    title: 'Wind turbine: C_P–λ and the power curve',
    blurb: `A generic 5 MW turbine with a 126 m rotor. Its power coefficient depends on the tip-speed ratio $\\lambda = \\Omega R/V$ and the blade pitch $\\beta$ (an empirical fit that peaks at $C_P = 0.48$, $\\lambda \\approx 8$). In **automatic** mode the controller does what real turbines do: below rated wind it changes rotor speed to hold the best $\\lambda$; at rated power it holds the speed and pitches the blades to shed the surplus; above 25 m/s it feathers and stops. The inset shows the wind and blade speeds meeting at the tip.

**Try this**
- In automatic mode sweep the wind from 3 to 25 m/s and watch the operating point: it sits on the peak of the $C_P$–λ curve, then slides left as the pitch rises.
- Switch to manual, set 12 rpm and change the wind: with fixed speed, λ changes and the turbine leaves its peak.
- In manual mode raise the pitch: the whole curve drops — that is how a turbine sheds power in a gale.
- Move the site to 2000 m: thinner air, less power at the same wind, and rated power comes later.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const gb = graphBox(box), gb2 = graphBox(box);
      const R = 63, A = Math.PI * R * R, PR = 5e6, WR = 12.1 * 2 * Math.PI / 60, WMIN = 5.5 * 2 * Math.PI / 60, VIN = 3, VOUT = 25, LOPT = 8.1;
      const mode0 = params && params.mode === 'manual' ? 'manual' : 'auto';
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Wind speed at the hub', min: 0, max: 30, step: 0.1, value: 8, unit: 'm/s' },
        { id: 'mode', type: 'select', label: 'Control', options: [['Automatic: best λ, then pitch', 'auto'], ['Manual rotor speed and pitch', 'manual']], value: mode0 },
        { id: 'rpm', label: 'Rotor speed (manual)', min: 0, max: 16, step: 0.1, value: 12, unit: 'rpm' },
        { id: 'pitch', label: 'Blade pitch (manual)', min: 0, max: 30, step: 0.5, value: 0, unit: '°' },
        { id: 'h', label: 'Site elevation', min: 0, max: 3000, step: 50, value: 0, unit: 'm' }
      ], () => update());
      const ro = kit.readout(box.side, [['reg', 'Operating region'], ['rho', 'Air density'], ['Pw', 'Power in the wind ½ρAV³'], ['lam', 'Tip-speed ratio λ = ΩR/V'], ['rpm', 'Rotor speed · tip speed'],
        ['beta', 'Blade pitch'], ['cp', 'Power coefficient C_P'], ['P', 'Rotor power'], ['Q', 'Rotor torque']]);
      const plotA = kit.plot(gb, { x: { label: 'tip-speed ratio λ', min: 0, max: 16 }, y: { label: 'power coefficient C_P', min: -0.1, max: 0.65 }, legend: true }, 160);
      const plotB = kit.plot(gb2, { x: { label: 'wind speed at the hub (m/s)', min: 0, max: 30 }, y: { label: 'power (MW)', min: 0, max: 7 }, legend: true }, 160);
      const V = ctl.values;
      let S = null, rot = 0;
      function auto(v, rho) {
        if (v < VIN) return { W: 0, beta: 0, P: 0, lam: 0, cp: 0, reg: 'Below cut-in: idling, no power' };
        if (v > VOUT) return { W: 0, beta: 90, P: 0, lam: 0, cp: 0, reg: 'Above cut-out: feathered and stopped' };
        let W = clamp(LOPT * v / R, WMIN, WR), lam = W * R / v, beta = 0, cp = cpFit(lam, 0), P = 0.5 * rho * A * v * v * v * cp, reg;
        if (P > PR) {
          W = WR; lam = W * R / v;
          beta = bisect(b => 0.5 * rho * A * v * v * v * cpFit(lam, b) - PR, 0, 60, 50);
          cp = cpFit(lam, beta); P = 0.5 * rho * A * v * v * v * cp; reg = 'Rated power: pitching to hold 5 MW';
        } else reg = W >= WR - 1e-9 ? 'Rated rotor speed, below rated power' : W <= WMIN + 1e-9 ? 'Minimum rotor speed' : 'Tracking the best tip-speed ratio';
        return { W, beta, P: Math.max(0, P), lam, cp, reg };
      }
      function update() {
        const manual = V.mode === 'manual';
        ctl.show('rpm', manual); ctl.show('pitch', manual);
        const rho = F.isa(V.h).rho, v = V.V;
        let o;
        if (manual) {
          const W = V.rpm * 2 * Math.PI / 60, lam = v > 0.05 ? W * R / v : 0, cp = v > 0.05 ? cpFit(lam, V.pitch) : 0;
          const P = 0.5 * rho * A * v * v * v * cp;
          o = { W, beta: V.pitch, P, lam, cp, reg: v < 0.05 ? 'No wind' : cp < 0 ? 'C_P < 0: the rotor would have to be driven, like a fan' : P > 1.1 * PR ? 'Overloaded: above the 5 MW rating' : 'Manual operation' };
        } else o = auto(v, rho);
        S = Object.assign(o, { rho, v });
        ro.set('reg', o.reg);
        ro.set('rho', rho.toFixed(3) + ' kg/m³');
        ro.set('Pw', fmtP(0.5 * rho * A * v * v * v));
        ro.set('lam', o.W > 0 && v > 0.05 ? o.lam.toFixed(2) : '—');
        ro.set('rpm', (o.W * 60 / (2 * Math.PI)).toFixed(1) + ' rpm · ' + (o.W * R).toFixed(0) + ' m/s');
        ro.set('beta', o.beta.toFixed(1) + '°');
        ro.set('cp', o.W > 0 ? o.cp.toFixed(3) + '  (' + (o.cp / (16 / 27) * 100).toFixed(0) + ' % of Betz)' : '—');
        ro.set('P', fmtP(o.P));
        ro.set('Q', o.W > 0 ? (o.P / o.W / 1000).toFixed(0) + ' kN·m' : '—');
        const c0 = [], cb = [];
        for (let l = 0.2; l <= 16.001; l += 0.1) { c0.push([l, Math.max(-0.1, cpFit(l, 0))]); if (o.beta > 0.3 && o.beta < 60) cb.push([l, Math.max(-0.1, cpFit(l, o.beta))]); }
        const sA = [{ pts: c0, label: 'pitch 0°' }];
        if (cb.length) sA.push({ pts: cb, label: 'pitch ' + o.beta.toFixed(1) + '°', dash: [5, 4] });
        plotA.set({ series: sA, hlines: [{ y: 16 / 27, label: 'Betz 16/27' }], marks: o.W > 0 && v > 0.05 && o.lam <= 16 ? [{ x: o.lam, y: Math.max(-0.1, o.cp), label: 'now' }] : [] });
        const pc = [], pb = [];
        let vr = null;
        for (let x = 0; x <= 30.001; x += 0.25) {
          const a = auto(x, rho); pc.push([x, a.P / 1e6]);
          if (vr == null && a.P >= PR * 0.999) vr = x;
          const b = 0.5 * rho * A * x * x * x * 16 / 27 / 1e6; if (b <= 7) pb.push([x, b]);
        }
        const vl = [{ x: VIN, label: 'cut-in' }, { x: VOUT, label: 'cut-out' }];
        if (vr != null) vl.push({ x: vr, label: 'rated ' + vr.toFixed(1) });
        plotB.set({ series: [{ pts: pc, label: 'automatic control' }, { pts: pb, label: 'Betz limit × wind power', dash: [5, 4] }], vlines: vl, marks: [{ x: v, y: Math.min(7, Math.max(0, o.P / 1e6)), label: 'now' }] });
        loop.once();
      }
      const foil = F.naca4(0.02, 0.4, 0.12, 20);
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const W = st.W, H = st.H, hx = W * 0.3, hy = H * 0.44, Lb = Math.min(H * 0.38, W * 0.26);
        // sky and tower
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(hx - Lb * 0.05, H); c.lineTo(hx - Lb * 0.025, hy); c.lineTo(hx + Lb * 0.025, hy); c.lineTo(hx + Lb * 0.05, H); c.closePath(); c.fill(); c.stroke();
        rot += S.W * dt;
        const wf = Math.max(0.12, Math.cos(S.beta * D2R));
        for (let b = 0; b < 3; b++) {
          const a = rot + b * 2 * Math.PI / 3, ex = Math.sin(a), ey = -Math.cos(a), nx = -ey, ny = ex;
          const pts = [[0.06, 0.05], [0.25, 0.085], [1, 0.022], [1, -0.012], [0.25, -0.04], [0.06, -0.035]];
          c.beginPath();
          pts.forEach((p, i) => { const x = hx + ex * p[0] * Lb + nx * p[1] * Lb * wf, y = hy + ey * p[0] * Lb + ny * p[1] * Lb * wf; i ? c.lineTo(x, y) : c.moveTo(x, y); });
          c.closePath(); c.fillStyle = C.surface; c.fill(); c.stroke();
        }
        kit.dot(c, hx, hy, Math.max(4, Lb * 0.06), C.text);
        kit.label(c, 'wind ' + S.v.toFixed(1) + ' m/s into the screen', 10, 14, { color: C.text, size: 12, weight: 700 });
        kit.label(c, fmtP(S.P) + '  ·  ' + (S.W * 60 / (2 * Math.PI)).toFixed(1) + ' rpm', 10, H - 14, { color: C.text, size: 13, weight: 700 });
        // the velocity triangle at the tip: blade speed ΩR, wind at the rotor ≈ (2/3)V, relative wind at the inflow angle φ
        const bx0 = W * 0.6, bw = W * 0.38, by0 = H * 0.08, bh = H * 0.8;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(bx0, by0, bw, bh);
        kit.label(c, 'at the blade tip (seen along the blade)', bx0 + 8, by0 + 12, { color: C.muted, size: 11 });
        const ox = bx0 + bw * 0.62, oy = by0 + bh * 0.62, ut = S.W * R, ua = S.v * 2 / 3, sc = bw * 0.5 / Math.max(ut, ua * 1.6, 20);
        c.strokeStyle = C.axis; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(bx0 + 6, oy); c.lineTo(bx0 + bw - 6, oy); c.stroke(); c.setLineDash([]);
        kit.label(c, 'rotor plane', bx0 + bw - 8, oy + 12, { align: 'right', color: C.muted, size: 10 });
        // air arriving at the section: from blade motion (from the left) and wind (from below)
        kit.arrow(c, ox - ut * sc, oy, ox, oy, C.series[1], 2);
        kit.arrow(c, ox, oy + ua * sc, ox, oy, C.series[2], 2);
        kit.arrow(c, ox - ut * sc, oy + ua * sc, ox, oy, C.accent, 2.5);
        kit.label(c, 'ΩR ' + ut.toFixed(0), ox - ut * sc / 2, oy - 10, { align: 'center', color: C.series[1], size: 11 });
        kit.label(c, '⅔V ' + ua.toFixed(1), ox + 6, oy + ua * sc / 2, { color: C.series[2], size: 11 });
        const phi = Math.atan2(ua, Math.max(ut, 1e-6));
        kit.label(c, 'relative wind, φ = ' + (phi / D2R).toFixed(1) + '°', ox - ut * sc, oy + ua * sc + 14, { color: C.accent, size: 11 });
        // the section at pitch β: leading edge to the left (the blade moves left), turned down toward the wind by β
        const ch = bw * 0.28, cb = Math.cos(S.beta * D2R), sb = Math.sin(S.beta * D2R);
        c.beginPath();
        foil.forEach((p, i) => { const xl = (p[0] - 0.3) * ch, yl = p[1] * ch; const X = ox + xl * cb - yl * sb, Y = oy - (xl * sb + yl * cb); i ? c.lineTo(X, Y) : c.moveTo(X, Y); });
        c.closePath(); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        kit.label(c, 'pitch β = ' + S.beta.toFixed(1) + '°,  α = φ − β = ' + ((phi / D2R) - S.beta).toFixed(1) + '°', bx0 + 8, by0 + bh - 12, { color: C.text, size: 11, weight: 700 });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ rot-sail */
  const CRAFTS = {
    dinghy: { S: 7, CLmax: 1.3, AR: 3, CD0: 0.05, CdA: 0.6, Hmax: 450, b: 0.9, Sk: 0.45, res: v => 12 * v * v * (1 + Math.pow(v / 3.0, 4)), ice: false },
    keel: { S: 45, CLmax: 1.3, AR: 3, CD0: 0.06, CdA: 2.5, Hmax: 4500, b: 1.8, Sk: 2.2, res: v => 60 * v * v * (1 + Math.pow(v / 3.4, 4)), ice: false },
    ice: { S: 7, CLmax: 1.2, AR: 4.5, CD0: 0.03, CdA: 0.35, Hmax: 700, b: 0, Sk: 0, res: () => 0.02 * 130 * G, ice: true }
  };
  function sailCoef(k, al) {                            // sail polar against angle of attack (rad)
    const am = 20 * D2R;
    const CL = al <= am ? k.CLmax * Math.sin(al / am * Math.PI / 2) : k.CLmax * Math.max(0, Math.cos((al - am) / (Math.PI / 2 - am) * Math.PI / 2));
    return { CL, CD: k.CD0 + CL * CL / (Math.PI * k.AR) + 1.2 * Math.pow(Math.sin(al), 2) };
  }
  // the best sail trim at apparent wind angle g (rad from the bow): most drive, within the heel and keel limits
  function sailForces(k, g, VA, VB, step) {
    const q = 0.5 * 1.225 * VA * VA, qw = 0.5 * 1025 * VB * VB, keelMax = k.Sk ? qw * k.Sk * 3.5 * 0.17 : Infinity;
    const amax = Math.max(0, g / D2R - 10);             // sails cannot be sheeted closer than about 10° to the centreline
    let best = null;
    for (let d = 0; d <= Math.min(90, amax); d += step || 1) {
      const al = d * D2R, cf = sailCoef(k, al), CDt = cf.CD + k.CdA / k.S;
      const drive = q * k.S * (cf.CL * Math.sin(g) - CDt * Math.cos(g));
      const heel = q * k.S * Math.abs(cf.CL * Math.cos(g) + CDt * Math.sin(g));
      if (d > 0 && (heel > k.Hmax || heel > keelMax)) continue;
      const di = k.b ? heel * heel / (Math.max(qw, 1) * Math.PI * k.b * k.b) : 0;
      if (!best || drive - di > best.net) best = { net: drive - di, drive, heel, di, al, CL: cf.CL, CD: CDt };
    }
    return best;
  }
  const apparentWind = (VT, beta, VB) => { const x = VT * Math.cos(beta) + VB, y = VT * Math.sin(beta); return { VA: Math.hypot(x, y), g: Math.atan2(y, x) }; };
  // the boat speed where the best drive equals the resistance: the highest crossing (at very low speed the keel
  // cannot yet hold the side force, so the lower crossings are not the sailing state)
  function sailSpeed(k, VT, beta, fast) {
    const f = VB => { const ap = apparentWind(VT, beta, VB); return sailForces(k, ap.g, ap.VA, VB, fast ? 2 : 1).net - k.res(VB); };
    const top = 6 * VT, n = fast ? 48 : 72;
    let last = -1;
    for (let i = 1; i <= n; i++) if (f(top * i / n) > 0) last = i;
    if (last < 0) return 0;
    if (last === n) return top;
    return bisect(f, top * last / n, top * (last + 1) / n, fast ? 28 : 36);
  }
  Hyper.sim('rot-sail', {
    title: 'Apparent wind and the sail',
    blurb: `A sailing craft seen from above, the true wind blowing from the top of the screen. The wind the crew feels — the **apparent wind** — is the true wind plus the headwind of the boat's own motion (the vector triangle at the mast). The sail is trimmed to the apparent wind for the most driving force the boat can hold upright; the boat settles at the speed where that force equals the water's (or ice's) resistance. The streaks show the air as felt on board. The graph is the craft's speed polar.

**Try this**
- On the keelboat, head up toward the wind (small course angle): the apparent wind swings forward and the boat stops in the no-go zone. Find the course with the best speed toward the wind (VMG).
- Bear away to a beam reach (90°) and a run (180°). Which is fastest? Why is the run slower though the wind is right behind?
- Take the iceboat to 100–120°: it sails at three times the wind speed, with the apparent wind almost dead ahead.
- Raise the wind on the dinghy: past a point it cannot go faster — it has to ease the sail to stay upright.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 280, maxH: 540 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'craft', type: 'select', label: 'Craft', options: [['Racing dinghy (7 m² sail)', 'dinghy'], ['30-foot keelboat (45 m²)', 'keel'], ['Iceboat (7 m²)', 'ice']], value: 'keel' },
        { id: 'VT', label: 'True wind speed', min: 1, max: 12, step: 0.1, value: 6, unit: 'm/s' },
        { id: 'beta', label: 'Course from the true wind', min: 0, max: 180, step: 1, value: 45, unit: '°' }
      ], (id) => { if (id !== 'beta') polar(); solve(); });
      const ro = kit.readout(box.side, [['vt', 'True wind'], ['vb', 'Boat speed'], ['ratio', 'Boat speed ÷ wind speed'], ['va', 'Apparent wind speed'], ['ga', 'Apparent wind angle (from the bow)'],
        ['al', 'Sail angle of attack'], ['Fd', 'Driving force'], ['Fh', 'Heeling (side) force'], ['vmg', 'Velocity made good'], ['note', '']]);
      const plot = kit.plot(gb, { x: { label: 'course from the true wind (°)', min: 0, max: 180 }, y: { label: 'speed (kt)' }, legend: true }, 170);
      const V = ctl.values;
      let eq = 0, vb = 0, polarPts = [], vmgPts = [], started = false;
      const parts = [], streaks = [];
      function polar() {
        const k = CRAFTS[V.craft] || CRAFTS.keel;
        polarPts = []; vmgPts = [];
        for (let d = 0; d <= 180; d += 4) { const s = sailSpeed(k, V.VT, d * D2R, true); polarPts.push([d, s / KT]); vmgPts.push([d, s * Math.cos(d * D2R) / KT]); }
      }
      function solve() {
        const k = CRAFTS[V.craft] || CRAFTS.keel;
        eq = sailSpeed(k, V.VT, V.beta * D2R);
        if (!started) { vb = eq; started = true; }
        plot.set({ series: [{ pts: polarPts, label: 'boat speed' }, { pts: vmgPts, label: 'VMG (+ upwind, − downwind)', dash: [5, 4] }],
          hlines: [{ y: V.VT / KT, label: 'wind speed' }, { y: 0 }], marks: [{ x: V.beta, y: eq / KT, label: (eq / KT).toFixed(1) + ' kt' }] });
        loop.once();
      }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), k = CRAFTS[V.craft] || CRAFTS.keel;
        vb += (eq - vb) * Math.min(1, dt / 1.2);
        const b = V.beta * D2R, VT = V.VT, ap = apparentWind(VT, b, vb), f = sailForces(k, ap.g, ap.VA, vb);
        const W = st.W, H = st.H, m = Math.min(W, H), cx = W * 0.42, cy = H * 0.54, Lb = m * 0.42;
        const hx = Math.sin(b), hy = -Math.cos(b), px = -hy, py = hx;             // heading and its right-hand normal (screen, y down)
        const wax = -vb * hx, way = VT - vb * hy;                                  // apparent wind: air motion relative to the boat
        // water (or ice) moving past, and streaks of the apparent wind
        while (parts.length < 70) parts.push({ x: Math.random() * W, y: Math.random() * H });
        while (streaks.length < 36) streaks.push({ x: Math.random() * W, y: Math.random() * H });
        c.fillStyle = C.faint;
        for (const q of parts) {
          q.x -= vb * hx * dt * 14; q.y -= vb * hy * dt * 14;
          if (q.x < 0) q.x += W; if (q.x > W) q.x -= W; if (q.y < 0) q.y += H; if (q.y > H) q.y -= H;
          c.fillRect(q.x - 1, q.y - 1, 2, 2);
        }
        const wl = Math.hypot(wax, way) || 1;
        c.strokeStyle = C.dark ? 'hsl(200 60% 70% / .35)' : 'hsl(205 60% 45% / .3)'; c.lineWidth = 1.2;
        for (const q of streaks) {
          q.x += wax * dt * 10; q.y += way * dt * 10;
          if (q.x < 0) q.x += W; if (q.x > W) q.x -= W; if (q.y < 0) q.y += H; if (q.y > H) q.y -= H;
          c.beginPath(); c.moveTo(q.x, q.y); c.lineTo(q.x - wax / wl * 14, q.y - way / wl * 14); c.stroke();
        }
        // the hull
        const P = (a, s) => [cx + hx * a * Lb + px * s * Lb, cy + hy * a * Lb + py * s * Lb];
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        if (k.ice) {
          const n = P(0.55, 0), l = P(-0.3, -0.32), r = P(-0.3, 0.32), tail = P(-0.45, 0);
          c.beginPath(); c.moveTo(n[0], n[1]); c.lineTo(tail[0], tail[1]); c.moveTo(l[0], l[1]); c.lineTo(r[0], r[1]); c.stroke();
          for (const p of [n, l, r]) { c.beginPath(); c.moveTo(p[0] - hx * 9, p[1] - hy * 9); c.lineTo(p[0] + hx * 9, p[1] + hy * 9); c.lineWidth = 3; c.stroke(); c.lineWidth = 1.6; }
        } else {
          c.beginPath();
          const hull = [[0.5, 0], [0.3, 0.12], [0, 0.16], [-0.45, 0.13], [-0.5, 0.1], [-0.5, -0.1], [-0.45, -0.13], [0, -0.16], [0.3, -0.12]];
          hull.forEach((p, i) => { const q = P(p[0], p[1]); i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]); });
          c.closePath(); c.fill(); c.stroke();
        }
        // the sail: from the mast, at angle α to the apparent wind, on the leeward side
        const mast = P(0.15, 0), wdx = wax / wl, wdy = way / wl;
        // lift is perpendicular to the apparent wind, on the side that pulls the boat forward (to leeward)
        let Lx = -wdy, Ly = wdx; if (Lx * hx + Ly * hy < 0) { Lx = -Lx; Ly = -Ly; }
        const aft = [-hx, -hy], angW = Math.atan2(wdy, wdx), angA = Math.atan2(aft[1], aft[0]);
        let diff = angA - angW; while (diff > Math.PI) diff -= 2 * Math.PI; while (diff < -Math.PI) diff += 2 * Math.PI;
        const rotA = Math.abs(diff) < f.al ? diff : Math.sign(diff) * f.al, sa = angW + rotA;
        const boom = Lb * (k.ice ? 0.5 : 0.55), luff = f.al === 0 && vb < 0.05 ? Math.sin(t * 14) * 0.12 : 0;
        const sx = Math.cos(sa + luff), sy = Math.sin(sa + luff), bulge = boom * 0.08 * (f.CL / 1.3);
        c.strokeStyle = C.accent; c.lineWidth = 4; c.beginPath(); c.moveTo(mast[0], mast[1]);
        c.quadraticCurveTo(mast[0] + sx * boom * 0.5 + Lx * bulge, mast[1] + sy * boom * 0.5 + Ly * bulge, mast[0] + sx * boom, mast[1] + sy * boom); c.stroke();
        kit.dot(c, mast[0], mast[1], 4, C.text);
        // force arrows from the centre of effort: total, drive (along the heading) and side force
        const ce = [mast[0] + sx * boom * 0.4, mast[1] + sy * boom * 0.4];
        const q = 0.5 * 1.225 * ap.VA * ap.VA * k.S, Fx = q * (f.CL * Lx + f.CD * wdx), Fy = q * (f.CL * Ly + f.CD * wdy);
        const Fm = Math.hypot(Fx, Fy) || 1, fs = m * 0.24 / Fm, drive = Fx * hx + Fy * hy, sideF = Fx * px + Fy * py;
        if (Fm > 1e-6 && ap.VA > 0.01) {
          kit.arrow(c, ce[0], ce[1], ce[0] + hx * drive * fs, ce[1] + hy * drive * fs, C.ok, 2.5);
          kit.arrow(c, ce[0], ce[1], ce[0] + px * sideF * fs, ce[1] + py * sideF * fs, C.bad, 2);
          kit.arrow(c, ce[0], ce[1], ce[0] + Fx * fs, ce[1] + Fy * fs, C.text, 1.5);
        }
        // the wind triangle ending at the mast: true wind + the boat's own wind = apparent wind
        const vs = m * 0.26 / Math.max(VT, ap.VA, vb, 0.5);
        const p0 = [mast[0] - wax * vs, mast[1] - way * vs], p1 = [p0[0], p0[1] + VT * vs];
        kit.arrow(c, p0[0], p0[1], p1[0], p1[1], C.series[0], 2);
        if (vb > 0.05) kit.arrow(c, p1[0], p1[1], mast[0], mast[1], C.muted, 2);
        kit.arrow(c, p0[0], p0[1], mast[0], mast[1], C.accent, 2.5);
        kit.label(c, 'true wind', p0[0] - 6, (p0[1] + p1[1]) / 2, { align: 'right', color: C.series[0], size: 11 });
        kit.label(c, 'apparent', (p0[0] + mast[0]) / 2 + 6, (p0[1] + mast[1]) / 2, { color: C.accent, size: 11, weight: 700 });
        kit.arrow(c, 16, 22, 16, 58, C.series[0], 2.5);
        kit.label(c, 'true wind ' + (VT / KT).toFixed(1) + ' kt', 26, 34, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'boat ' + (vb / KT).toFixed(1) + ' kt  (' + (vb / VT).toFixed(2) + ' × wind)', 26, 52, { color: C.text, size: 12 });
        kit.label(c, '→ drive', 12, H - 34, { color: C.ok, size: 11, weight: 700 });
        kit.label(c, '→ side force', 70, H - 34, { color: C.bad, size: 11, weight: 700 });
        kit.label(c, 'dots: water or ice passing; streaks: the wind as felt on board', 12, H - 14, { color: C.muted, size: 11 });
        ro.set('vt', (VT / KT).toFixed(1) + ' kt (' + VT.toFixed(1) + ' m/s)');
        ro.set('vb', (vb / KT).toFixed(1) + ' kt (' + vb.toFixed(2) + ' m/s)');
        ro.set('ratio', (vb / VT).toFixed(2));
        ro.set('va', (ap.VA / KT).toFixed(1) + ' kt');
        ro.set('ga', (ap.g / D2R).toFixed(1) + '°');
        ro.set('al', (f.al / D2R).toFixed(0) + '°');
        ro.set('Fd', drive.toFixed(0) + ' N');
        ro.set('Fh', Math.abs(sideF).toFixed(0) + ' N');
        ro.set('vmg', (vb * Math.cos(b) / KT).toFixed(1) + ' kt ' + (V.beta <= 90 ? 'toward the wind' : 'downwind (−)'));
        ro.set('note', eq < 0.01 ? 'No-go zone: the sail cannot drive this close to the wind' : f.heel >= k.Hmax * 0.98 ? 'Heel-limited: the sail is eased to stay upright' : eq > VT ? 'Faster than the wind!' : '');
      }, box.stage);
      polar(); solve();
      loop.start();
    }
  });

  /* ================================================================ rot-samara */
  // a samara as a one-bladed rotor in the wind of its own descent: blade-element momentum theory (as for a wind turbine),
  // with a low-Reynolds-number plate-like section. Without Reynolds effects the problem scales: the tip-speed ratio and
  // the thrust coefficient do not depend on the descent speed, which then follows from thrust = weight.
  function samaraModel(Rm, th) {
    const r0 = 0.2 * Rm, cmax = 0.275 * Rm, N = 24;
    const chord = x => cmax * (0.55 + 0.45 * Math.sin(Math.PI * x)) * Math.sqrt(Math.max(0, 1 - Math.pow(x, 6)));
    const polar = al => ({ cl: 1.6 * Math.sin(2 * al), cd: 0.1 + 1.7 * Math.sin(al) * Math.sin(al) });
    function coeffs(lam) {                                  // at V = 1 m/s, ρ = 1
      const Om = lam / Rm, dr = (Rm - r0) / N;
      let T = 0, Q = 0;
      for (let i = 0; i < N; i++) {
        const r = r0 + (i + 0.5) * dr, x = (r - r0) / (Rm - r0), c = chord(x);
        if (c <= 1e-9) continue;
        const sig = c / (2 * Math.PI * r);
        let a = 0.1, ap = 0, phi = 0, Cn = 0, Ct = 0;
        for (let k = 0; k < 120; k++) {
          phi = Math.atan2(1 - a, Om * r * (1 + ap));
          const p = polar(phi - th), sp = Math.max(1e-4, Math.abs(Math.sin(phi)));
          Cn = p.cl * Math.cos(phi) + p.cd * Math.sin(phi);
          Ct = p.cl * Math.sin(phi) - p.cd * Math.cos(phi);
          const Ft = Math.max(0.05, 2 / Math.PI * Math.acos(Math.exp(-(Rm - r) / (2 * r * sp))));
          const an = clamp(1 / (4 * Ft * sp * sp / (sig * Cn || 1e-9) + 1), -0.2, 0.45);
          const apn = clamp(1 / (4 * Ft * Math.sin(phi) * Math.cos(phi) / (sig * Ct || 1e-9) - 1), -0.4, 0.4);
          const na = a + 0.5 * (an - a), nap = ap + 0.5 * (apn - ap);
          const done = Math.abs(na - a) < 1e-6 && Math.abs(nap - ap) < 1e-6;
          a = na; ap = nap;
          if (done) break;
        }
        const W2 = (1 - a) * (1 - a) + Math.pow(Om * r * (1 + ap), 2);
        T += 0.5 * W2 * c * Cn * dr; Q += 0.5 * W2 * c * Ct * r * dr;
      }
      const A = Math.PI * Rm * Rm;
      return { CT: T / (0.5 * A), CQ: Q / (0.5 * A * Rm) };
    }
    let lam = null;
    if (coeffs(0.3).CQ > 0) lam = coeffs(20).CQ > 0 ? 20 : bisect(l => coeffs(l).CQ, 0.3, 20, 28);
    const eqc = lam ? coeffs(lam) : null;
    let Sw = 0; for (let i = 0; i < 40; i++) Sw += chord((i + 0.5) / 40) * (Rm - r0) / 40;
    return { lam, CT: eqc ? eqc.CT : 0, coeffs, chord, r0, Sw };
  }
  Hyper.sim('rot-samara', {
    title: 'A maple seed in autorotation',
    blurb: `A maple seed is a one-bladed rotor that drives itself: the air rising past it as it falls turns the wing, like the wind turning a turbine, and the spin settles where the torque on the wing is zero — autorotation. The spinning wing sweeps a whole disc, so the seed falls as slowly as a parachute the size of that disc. The model is blade-element momentum theory with a low-Reynolds-number wing section; the close-up is in slow motion, the height bar on the right in real time (the grey dot is the same wing falling flat without spinning).

**Try this**
- Note the descent speed (about 1 m/s) and the spin rate. Double the mass: the seed falls $\\sqrt2$ times faster and spins faster too, at the same tip-speed ratio.
- Lengthen the wing: the disc area grows with the square of the length, so the seed falls much more slowly.
- Change the wing pitch: the seed falls slowest near zero or slightly negative pitch; as the pitch rises it turns at a lower tip-speed ratio and falls faster. Watch the torque curve in the graph cross zero at a different place.
- Set the wind and release height to see how far a tree's seeds travel.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 270 });
      const gb = graphBox(box);
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Seed mass', min: 0.03, max: 0.4, step: 0.01, value: 0.1, unit: 'g' },
        { id: 'R', label: 'Wing length', min: 2, max: 6, step: 0.1, value: 4, unit: 'cm' },
        { id: 'th', label: 'Wing pitch', min: -4, max: 20, step: 0.5, value: 2, unit: '°' },
        { id: 'U', label: 'Wind', min: 0, max: 10, step: 0.5, value: 5, unit: 'm/s' },
        { id: 'H', label: 'Release height', min: 2, max: 30, step: 1, value: 15, unit: 'm' },
        { id: 'slow', type: 'select', label: 'Close-up speed', options: [['Slow motion × 1/10', 0.1], ['Slow motion × 1/30', 0.0333], ['Slow motion × 1/100', 0.01]], value: 0.0333 }
      ], (id) => { if (id === 'th') model(); show(); });
      const ro = kit.readout(box.side, [['V', 'Descent speed'], ['spin', 'Spin rate'], ['lam', 'Tip-speed ratio ΩR/V'], ['DL', 'Disc loading W/A'], ['CT', 'Disc drag coefficient C_T'],
        ['Re', 'Reynolds number at ¾ of the wing'], ['t', 'Time to the ground'], ['x', 'Carried by the wind'], ['plate', 'Same wing falling flat, not spinning'], ['note', '']]);
      const plot = kit.plot(gb, { x: { label: 'tip-speed ratio λ = ΩR/V', min: 0, max: 9 }, y: { label: 'coefficient' }, legend: true }, 160);
      const V = ctl.values, rho = 1.225, nu = 1.5e-5;
      let M = null, S = null, psi = 0, fallen = 0, hReal = 0, hPlate = 0, pause = 0;
      const trail = [];
      // the coefficients depend only on the pitch (the wing's shape scales with its length): solve once per pitch, radius 1
      function model() {
        M = samaraModel(1, V.th * D2R);
        const pts = [], ptq = [];
        for (let l = 0.4; l <= 9.001; l += 0.3) { const cf = M.coeffs(l); pts.push([l, cf.CT]); ptq.push([l, cf.CQ * 10]); }
        plot.set({ series: [{ pts, label: 'thrust coefficient C_T' }, { pts: ptq, label: 'torque coefficient C_Q × 10', dash: [5, 4] }], hlines: [{ y: 0 }],
          vlines: M.lam && M.lam <= 9 ? [{ x: M.lam, label: 'autorotation: torque = 0' }] : [] });
      }
      function show() {
        const Rm = V.R / 100, W = V.m / 1000 * G, A = Math.PI * Rm * Rm, r0 = M.r0 * Rm, chord = x => M.chord(x) * Rm;
        const Vp = Math.sqrt(2 * W / (rho * Math.max(M.Sw * Rm * Rm, 1e-9) * 1.2));
        const spins = !!M.lam && M.CT > 0.005;
        const Vd = spins ? Math.sqrt(2 * W / (rho * A * M.CT)) : Vp, Om = spins ? M.lam * Vd / Rm : 0;
        const xr = (0.75 * Rm - r0) / (Rm - r0), cr = chord(clamp(xr, 0, 1)), Re = Math.hypot(Vd, Om * 0.75 * Rm) * cr / nu;
        S = { Rm, W, A, Vd, Om, Vp, spins, r0, chord };
        ro.set('V', Vd.toFixed(2) + ' m/s');
        ro.set('spin', spins ? (Om / (2 * Math.PI)).toFixed(1) + ' turns/s (' + (Om * 60 / (2 * Math.PI)).toFixed(0) + ' rpm)' : 'none');
        ro.set('lam', spins ? M.lam.toFixed(2) : '—');
        ro.set('DL', (W / A).toFixed(3) + ' N/m²');
        ro.set('CT', spins ? M.CT.toFixed(3) : '—');
        ro.set('Re', Re.toFixed(0));
        ro.set('t', (V.H / Vd).toFixed(1) + ' s from ' + V.H + ' m');
        ro.set('x', (V.U * V.H / Vd).toFixed(0) + ' m in a ' + V.U + ' m/s wind');
        ro.set('plate', Vp.toFixed(2) + ' m/s');
        ro.set('note', spins ? 'Autorotating: the wing drives itself round' : 'No autorotation at this pitch: it would tumble and fall fast');
        hReal = V.H; hPlate = V.H; pause = 0; trail.length = 0;
        loop.once();
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const W = st.W, H = st.H, cx = W * 0.4, cy = H * 0.4, k = Math.min(W * 0.6, H) * 0.34 / S.Rm;   // px per metre
        const slow = +V.slow || 0.0333, dts = dt * slow;
        psi += S.Om * dts; fallen += S.Vd * dts;
        // height ticks (1 cm apart) scrolling up as the seed falls
        c.strokeStyle = C.grid; c.lineWidth = 1;
        const step = 0.01 * k, off = (fallen * k) % step;
        for (let y = -off; y < H; y += step) { c.beginPath(); c.moveTo(W * 0.08, y); c.lineTo(W * 0.14, y); c.stroke(); }
        kit.label(c, 'marks 1 cm apart', W * 0.08, H - 12, { color: C.muted, size: 10 });
        // the rotation axis
        c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(cx, 8); c.lineTo(cx, H - 8); c.stroke(); c.setLineDash([]);
        // wing geometry, projected with the eye 20° above the rotor plane
        const el = 20 * D2R, cone = 14 * D2R, th = V.th * D2R;
        const proj = (x, y, z) => [cx + x * k, cy - (z * Math.cos(el) + y * Math.sin(el)) * k, y];
        const at = (r, s, ps) => {
          const ex = Math.cos(ps) * Math.cos(cone), ey = Math.sin(ps) * Math.cos(cone), ez = Math.sin(cone);
          const tx = -Math.sin(ps) * Math.cos(th), ty = Math.cos(ps) * Math.cos(th), tz = Math.sin(th);
          return proj(r * ex + s * tx, r * ey + s * ty, r * ez + s * tz);
        };
        // the tip's helix, drawn behind
        const tip = at(S.Rm, 0, psi);
        for (const p of trail) p[1] -= S.Vd * dts * k;
        trail.push([tip[0], tip[1]]);
        while (trail.length > 160 || (trail.length && trail[0][1] < -20)) trail.shift();
        c.strokeStyle = C.accent; c.lineWidth = 1.2;
        for (let i = 1; i < trail.length; i++) { c.globalAlpha = i / trail.length * 0.7; c.beginPath(); c.moveTo(trail[i - 1][0], trail[i - 1][1]); c.lineTo(trail[i][0], trail[i][1]); c.stroke(); }
        c.globalAlpha = 1;
        // the wing: leading edge ahead (in the direction of rotation), trailing edge behind
        const n = 16, le = [], te = [];
        for (let i = 0; i <= n; i++) {
          const x = i / n, r = S.r0 + x * (S.Rm - S.r0), ch = S.chord(x);
          le.push(at(r, 0.3 * ch, psi)); te.push(at(r, -0.7 * ch, psi));
        }
        c.beginPath(); le.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); for (let i = te.length - 1; i >= 0; i--) c.lineTo(te[i][0], te[i][1]); c.closePath();
        c.fillStyle = C.dark ? 'hsl(32 45% 48% / .85)' : 'hsl(30 50% 62% / .85)'; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
        c.beginPath(); le.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.lineWidth = 2.2; c.stroke();
        // the seed (nut) near the axis
        const nut = at(S.r0 * 0.45, -0.1 * S.chord(0), psi);
        c.beginPath(); c.ellipse(nut[0], nut[1], Math.max(4, S.r0 * 0.7 * k), Math.max(3, S.r0 * 0.45 * k), 0, 0, Math.PI * 2);
        c.fillStyle = C.dark ? 'hsl(28 40% 35%)' : 'hsl(28 45% 42%)'; c.fill(); c.stroke();
        // air rising past the seed
        for (let i = 0; i < 3; i++) { const x = cx + (i - 1) * S.Rm * k * 1.4, y = H * 0.84; kit.arrow(c, x, y + 18, x, y - 10, C.faint, 1.5); }
        kit.label(c, 'air rising past at ' + S.Vd.toFixed(2) + ' m/s', cx, H - 12, { align: 'center', color: C.muted, size: 11 });
        kit.label(c, (S.spins ? (S.Om / (2 * Math.PI)).toFixed(1) + ' turns/s' : 'not spinning') + '  ·  ' + S.Vd.toFixed(2) + ' m/s', 12, 16, { color: C.text, size: 13, weight: 700 });
        kit.label(c, 'close-up × ' + (slow >= 0.1 ? '1/10' : slow >= 0.03 ? '1/30' : '1/100'), 12, 34, { color: C.muted, size: 11 });
        // the height bar, in real time: the spinning seed and a flat plate released together
        const bx = W - 70, by0 = 26, by1 = H - 30;
        if (pause > 0) { pause -= dt; if (pause <= 0) { hReal = V.H; hPlate = V.H; } }
        else { hReal = Math.max(0, hReal - S.Vd * dt); hPlate = Math.max(0, hPlate - S.Vp * dt); if (hReal <= 0) pause = 2; }
        c.strokeStyle = C.axis; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, by0); c.lineTo(bx, by1); c.stroke();
        c.beginPath(); c.moveTo(bx - 20, by1); c.lineTo(bx + 30, by1); c.stroke();
        const Yh = h => by1 - h / V.H * (by1 - by0);
        kit.dot(c, bx - 8, Yh(hPlate), 4, C.muted);
        kit.dot(c, bx + 8, Yh(hReal), 5, C.accent);
        kit.label(c, V.H + ' m', bx - 6, by0 - 12, { align: 'center', color: C.muted, size: 10 });
        kit.label(c, hReal.toFixed(1) + ' m', bx + 16, Yh(hReal), { color: C.text, size: 11 });
        kit.label(c, 'drift ' + (V.U * (V.H - hReal) / Math.max(S.Vd, 1e-6)).toFixed(0) + ' m', bx - 30, by1 + 16, { color: C.text, size: 11 });
      }, box.stage);
      model(); show();
      loop.start();
    }
  });
})();
