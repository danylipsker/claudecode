/* HYPER-AERODYNAMICS · sims/basics.js — simulations for the branch "Air and Flow Basics".
 *   basics-couette         shearing a layer between two plates: a fluid (start-up Couette flow) against an elastic solid
 *   basics-balloon         a hot-air balloon in a standard atmosphere: air density from the ideal-gas law, buoyancy
 *   basics-sound-race      sound pulses racing through air and another gas at chosen temperatures
 *   basics-cylinder-re     flow past a cylinder by the lattice-Boltzmann method, Re 1–1000, with the C_D–Re curve
 *   basics-dimensional     a dimensional-analysis explorer: the Buckingham Π groups of classic problems
 *   basics-pitot           a pitot-static tube and a U-tube manometer; the compressible pitot reading
 *   basics-speed-altitude  the speed–altitude chart with lines of constant Mach number and dynamic pressure
 */
(function () {
  'use strict';
  const R_AIR = 287.058, G0 = 9.80665, RU = 8.314462618, KT = 1852 / 3600;
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  function graphDiv(box) {
    const d = document.createElement('div');
    d.style.padding = '4px 10px 10px';
    box.stage.appendChild(d);
    return d;
  }
  // a theme colour string ('#rgb', '#rrggbb', 'rgb(…)') as [r, g, b], for image data
  function rgbOf(s, fallback) {
    s = String(s || '').trim();
    let m = /^#([0-9a-f]{3})$/i.exec(s);
    if (m) return m[1].split('').map(c => parseInt(c + c, 16));
    m = /^#([0-9a-f]{6})/i.exec(s);
    if (m) return [0, 2, 4].map(i => parseInt(m[1].substr(i, 2), 16));
    m = /rgba?\(\s*([\d.]+)[ ,]+([\d.]+)[ ,]+([\d.]+)/i.exec(s);
    if (m) return [+m[1], +m[2], +m[3]];
    return fallback;
  }
  const f0 = (v, d) => (Number.isFinite(v) ? v.toFixed(d) : '—');

  /* ================================================================ SHEARING A FLUID */
  Hyper.sim('basics-couette', {
    title: 'Shearing a fluid — and a solid',
    blurb: `A layer of material lies between two plates; the top plate is dragged to the right. Vertical dye lines show how the material deforms, the arrows on the left how fast each layer moves, and the graph the shear stress the material exerts on the moving plate.

**Try this**
- With air, watch the motion spread down from the plate until the velocity profile is a straight line; the stress then settles at Newton's value $\\tau = \\mu U/h$. The dye keeps tilting for as long as the plate moves — that is what makes it a fluid.
- Press *Hold it still*: the flow dies away, the stress briefly reverses, but the dye stays tilted. A fluid does not spring back.
- Choose the gel, an elastic solid: its stress grows with *how far* it has been sheared, not how fast — and when you *let go* it springs back.
- Compare water, oil and honey at the same plate speed: the steady stress follows the viscosity $\\mu$, while the time for the motion to spread, $h^2/\\nu$, follows the kinematic viscosity.
- Double the gap: the steady stress halves and the spreading time quadruples.

Time is sped up or slowed down so that the spreading can be seen (the factor is shown); the dye displacement in the fluids is drawn to a reduced scale.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'time (s)', min: 0 }, y: { label: 'stress on the plate (Pa)' } }, 160);
      const MATS = {
        air: { label: 'air, 20 °C', mu: 1.81e-5, rho: 1.204, hue: 200 },
        water: { label: 'water, 20 °C', mu: 1.0e-3, rho: 998, hue: 215 },
        oil: { label: 'olive oil, 20 °C', mu: 0.084, rho: 910, hue: 48 },
        honey: { label: 'honey', mu: 8, rho: 1420, hue: 32 },
        gel: { label: 'soft gel (elastic solid)', G: 1000, rho: 1000, hue: 320, solid: true }
      };
      const N = 40, dy = 1 / N, TANIM = 2.5, NL = 7, VPX = 36;
      let u = new Float64Array(N + 1), un = new Float64Array(N + 1), mode = 'move', tReal = 0, tStar = 0, gam = 0, gdot = 0, hist = [], dye = [], plateX = 0, note = '', noteT = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mat', type: 'select', label: 'Between the plates', options: [['Air (20 °C)', 'air'], ['Water (20 °C)', 'water'], ['Olive oil', 'oil'], ['Honey', 'honey'], ['Soft gel — an elastic solid', 'gel']], value: MATS[P.mat] ? P.mat : 'air' },
        { id: 'U', label: 'Plate speed U', min: 0.001, max: 1, value: 0.05, unit: 'm/s', log: true, sig: 2 },
        { id: 'h', label: 'Gap h', min: 0.5, max: 20, step: 0.5, value: 5, unit: 'mm' },
        { type: 'buttons', items: [{ id: 'go', label: 'Drag the plate', primary: true }, { id: 'hold', label: 'Hold it still' }, { id: 'free', label: 'Let go' }] },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'go') mode = 'move';
        else if (id === 'hold') mode = 'hold';
        else if (id === 'free') mode = 'free';
        else { reset(); mode = 'move'; }
        note = '';
        loop.once();
      });
      const ro = kit.readout(box.side, [['prop', 'Material'], ['rate', 'Shear rate U/h'], ['tau', 'Stress on the plate now'], ['newton', 'Steady value'], ['tdiff', 'Spreading time h²/ν'], ['clock', 'Time shown'], ['state', '']]);
      const V = ctl.values;
      function reset() {
        u = new Float64Array(N + 1); un = new Float64Array(N + 1);
        tReal = 0; tStar = 0; gam = 0; gdot = 0; hist = []; plateX = 0;
        dye = []; for (let k = 0; k < NL; k++) dye.push(new Float64Array(N + 1));
      }
      reset();
      const mat = () => MATS[V.mat] || MATS.air;
      const hM = () => V.h / 1000;
      // real seconds shown per animation second
      function timeScale() { const m = mat(); return m.solid ? hM() / V.U / 3 : hM() * hM() * m.rho / m.mu / TANIM; }
      function stepFluid(dtA) {
        const dts = dtA / TANIM, n = Math.max(1, Math.ceil(dts / (0.4 * dy * dy))), r = dts / n / (dy * dy);
        for (let s = 0; s < n; s++) {
          for (let j = 1; j < N; j++) un[j] = u[j] + r * (u[j + 1] - 2 * u[j] + u[j - 1]);
          un[0] = 0;
          un[N] = mode === 'move' ? 1 : mode === 'hold' ? 0 : (4 * un[N - 1] - un[N - 2]) / 3;   // free: no stress at the plate
          const t = u; u = un; un = t;
        }
        tStar += dts;
      }
      function stepGel(dtA) {
        if (mode === 'move') {
          gam += dtA / 3; gdot = 1 / 3;
          if (gam >= 1.5) { gam = 1.5; gdot = 0; mode = 'hold'; note = 'Sheared by 56°: the stress would keep rising, and a real gel would tear'; }
        } else if (mode === 'hold') gdot = 0;
        else {                                             // let go: the elastic gel springs back (a damped swing, drawn slowly)
          const w = 2 * Math.PI * 0.9, z = 0.18, n = Math.max(1, Math.ceil(dtA / 0.004)), h = dtA / n;
          for (let s = 0; s < n; s++) { const acc = -w * w * gam - 2 * z * w * gdot; gdot += acc * h; gam += gdot * h; }
        }
      }
      const loop = kit.loop((dt) => {
        const m = mat(), C = kit.colors();
        const steady = m.solid ? 0 : m.mu * V.U / hM();
        if (dt > 0) {
          if (m.solid) stepGel(dt); else stepFluid(dt);
          if (!m.solid) {
            for (let k = 0; k < NL; k++) for (let j = 0; j <= N; j++) dye[k][j] += u[j] * VPX * dt;
            plateX += u[N] * VPX * dt;
            // once the dye has been sheared right across the channel, lay down fresh lines (while dragging)
            if (mode === 'move' && dye[0][N] > 1.4 * (st.W - 32)) { for (const d of dye) d.fill(0); note = 'fresh dye lines'; noteT = 1.5; }
          } else plateX = gam;
          tReal += dt * timeScale();
          if (noteT > 0) { noteT -= dt; if (noteT <= 0) note = ''; }
        }
        const grad = (3 * u[N] - 4 * u[N - 1] + u[N - 2]) / (2 * dy);
        const tau = m.solid ? m.G * gam : steady * grad;
        if (dt > 0) { hist.push([tReal, tau]); if (hist.length > 700) hist.splice(0, hist.length - 700); }
        // ---- the scene
        const c = st.begin();
        const x0 = 16, x1 = st.W - 16, yTop = 46, yBot = st.H - 34, Wd = x1 - x0, Hg = yBot - yTop;
        c.fillStyle = kit.hue(m.hue, 0.14); c.fillRect(x0, yTop, Wd, Hg);
        // fixed plate
        c.fillStyle = C.surface2 || C.surface; c.fillRect(x0, yBot, Wd, 12);
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let x = x0; x < x1; x += 10) { c.beginPath(); c.moveTo(x, yBot + 12); c.lineTo(x + 8, yBot + 2); c.stroke(); }
        c.beginPath(); c.moveTo(x0, yBot); c.lineTo(x1, yBot); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        kit.label(c, 'fixed plate', x0 + 4, yBot + 22, { align: 'left', color: C.muted, size: 11.5 });
        // moving plate, with marks that travel with it
        c.fillStyle = C.surface; c.fillRect(x0, yTop - 14, Wd, 14);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(x0, yTop - 14, Wd, 14);
        const shift = m.solid ? gam * Hg : plateX;
        c.fillStyle = C.accent;
        for (let k = -1; k < 12; k++) { let x = x0 + (((k * Wd / 10 + shift) % Wd) + Wd) % Wd; c.fillRect(x - 1.5, yTop - 12, 3, 10); }
        const moving = mode === 'move';
        kit.label(c, moving ? 'moving plate  U = ' + kit.fmt(V.U, 2) + ' m/s  →' : mode === 'hold' ? 'plate held still' : 'plate let go', x0 + 4, yTop - 24, { align: 'left', color: moving ? C.text : C.muted, size: 12, weight: 700 });
        // dye lines
        c.lineWidth = 2.2; c.strokeStyle = kit.hue(m.solid ? 280 : 330, 0.9);
        for (let k = 0; k < NL; k++) {
          const bx = (k + 0.5) * Wd / NL;
          c.beginPath();
          let prev = null;
          for (let j = 0; j <= N; j++) {
            const d = m.solid ? gam * Hg * j / N : dye[k][j];
            const x = x0 + (((bx + d) % Wd) + Wd) % Wd, y = yBot - j / N * Hg;
            if (prev == null || Math.abs(x - prev) > Wd / 2) c.moveTo(x, y); else c.lineTo(x, y);
            prev = x;
          }
          c.stroke();
        }
        // velocity arrows
        const ax = x0 + 6;
        for (let j = 0; j <= N; j += 5) {
          const y = yBot - j / N * Hg, v = m.solid ? gdot * 3 * j / N : u[j];
          if (Math.abs(v) * 70 > 2) kit.arrow(c, ax, y, ax + v * 70, y, C.warn, 1.6);
        }
        kit.label(c, 'τ = ' + kit.fmt(tau, 3) + ' Pa on the plate', x1 - 4, yBot + 22, { align: 'right', color: C.text, size: 12, weight: 700 });
        if (note) kit.label(c, note, (x0 + x1) / 2, yTop + 16, { align: 'center', color: C.warn, size: 12, weight: 700, bg: C.bg2 });
        // ---- read-outs
        const nu = m.solid ? 0 : m.mu / m.rho, ts = timeScale();
        ro.set('prop', m.solid ? m.label + ': G = 1 kPa' : m.label + ': μ = ' + kit.fmt(m.mu, 3) + ' Pa·s, ν = ' + kit.fmt(nu, 3) + ' m²/s');
        ro.set('rate', kit.fmt(V.U / hM(), 3) + ' 1/s');
        ro.set('tau', kit.fmt(tau, 3) + ' Pa');
        ro.set('newton', m.solid ? 'none: τ = G·γ = ' + kit.fmt(m.G * gam, 3) + ' Pa grows with strain γ = ' + gam.toFixed(2) : 'τ = μU/h = ' + kit.fmt(steady, 3) + ' Pa');
        ro.set('tdiff', m.solid ? '— (a solid does not flow)' : kit.fmt(hM() * hM() / nu, 3) + ' s');
        ro.set('clock', kit.fmt(tReal, 3) + ' s  (' + (ts >= 1 ? 'time runs ' + kit.fmt(ts, 2) + '× faster' : 'slow motion, ' + kit.fmt(1 / ts, 2) + '× slower') + ')');
        let msg;
        if (m.solid) msg = mode === 'move' ? 'Dragged: the stress grows with how far the gel is sheared' : mode === 'hold' ? 'Held: the stress stays — a solid remembers its shape' : 'Let go: the gel springs back';
        else msg = mode === 'move' ? (tStar > 1.2 ? 'Steady: a straight-line profile, τ = μU/h' : 'Dragged: the motion is spreading into the fluid') : mode === 'hold' ? 'Held still: the flow dies away, the dye stays tilted' : 'Let go: nothing pulls the fluid back';
        ro.set('state', msg + (tau > 0 && Math.abs(tau) > 1e-3 * (steady || m.G || 1) ? ' (τ resists the plate)' : tau < 0 && Math.abs(tau) > 1e-3 * (steady || 1) ? ' (τ pushes the plate on)' : ''));
        // ---- the graph
        const yr = m.solid ? { min: 0, max: Math.max(m.G * 1.6, 1) } : { min: -1.2 * steady, max: 4 * steady };
        plot.set({ series: [{ pts: hist, label: 'stress on the plate' }], hlines: m.solid ? [] : [{ y: steady, label: 'μU/h' }, { y: 0 }],
          x: { label: 'time (s)', min: hist.length ? hist[0][0] : 0 }, y: Object.assign({ label: 'stress on the plate (Pa)' }, yr) });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ HOT-AIR BALLOON */
  Hyper.sim('basics-balloon', {
    title: 'A hot-air balloon',
    blurb: `A hot-air balloon flies because the air inside, at the same pressure but hotter, is less dense than the air outside: $\\rho = p/(RT)$. The lift is the difference in the weight of a balloonful of outside and inside air. The atmosphere follows the standard lapse rate from the sea-level temperature you choose; time runs 30 times faster than real.

**Try this**
- Find the envelope temperature that just lifts the balloon off the ground; the read-out tells you when it is close. Then add 5 °C and watch it climb and settle at its level of neutral buoyancy.
- The two magnifiers compare a litre of air inside and outside: the same pressure, but fewer, faster molecules inside.
- Raise the sea-level temperature to a hot summer day: the balloon lifts less, and the burner must work harder. Pilots fly early on summer mornings.
- Launch from a site at 2000 m: the thinner air costs lift at every envelope temperature.
- Watch the gross-lift curve: it falls slowly with height because pressure falls, while the colder outside air partly compensates.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'altitude (m)', min: 0, max: 8000 }, y: { label: 'gross lift (kg)', min: 0 } }, 160);
      const ctl = kit.controls(box.side, [
        { id: 'Tin', label: 'Air inside the envelope', min: 20, max: 120, step: 0.5, value: 85, unit: '°C' },
        { id: 'Tsl', label: 'Sea-level temperature (ISA 15 °C)', min: -10, max: 40, step: 1, value: 15, unit: '°C' },
        { id: 'elev', label: 'Launch-site elevation', min: 0, max: 2500, step: 50, value: 0, unit: 'm' },
        { id: 'V', label: 'Envelope volume', min: 1000, max: 6000, step: 100, value: 2800, unit: 'm³' },
        { id: 'm', label: 'Mass of envelope, basket, fuel and people', min: 300, max: 1000, step: 10, value: 650, unit: 'kg' },
        { type: 'buttons', items: [{ id: 'launch', label: 'Back to the launch site', primary: true }] }
      ], (id) => { if (id === 'launch' || id === 'elev') { z = V.elev; w = 0; } loop.once(); });
      const ro = kit.readout(box.side, [['alt', 'Altitude'], ['Tout', 'Outside air'], ['p', 'Pressure (inside = outside)'], ['rho', 'Density outside / inside'], ['lift', 'Gross lift'], ['vs', 'Vertical speed'], ['eq', 'Neutral buoyancy']]);
      const V = ctl.values, LAPSE = 0.0065, EXPO = G0 / (R_AIR * LAPSE), SPEED = 30, ZTOP = 6000;
      let z = V.elev, w = 0, tA = 0;
      function air(zm) {
        const T0 = V.Tsl + 273.15, T = T0 - LAPSE * Math.min(zm, 11000);
        let p = 101325 * Math.pow(T / T0, EXPO);
        if (zm > 11000) p *= Math.exp(-G0 * (zm - 11000) / (R_AIR * T));
        return { T, p, rho: p / (R_AIR * T) };
      }
      const rhoIn = zm => air(zm).p / (R_AIR * (V.Tin + 273.15));
      const liftKg = zm => (air(zm).rho - rhoIn(zm)) * V.V;
      function equilibrium() {
        const f = zz => liftKg(zz) - V.m;
        if (f(V.elev) < 0) return { ground: true };
        if (f(9500) > 0) return { above: true };
        let lo = V.elev, hi = 9500;
        for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (f(mid) > 0) lo = mid; else hi = mid; }
        return { z: (lo + hi) / 2 };
      }
      function step(dtS) {
        const n = Math.max(1, Math.ceil(dtS / 0.05)), h = dtS / n;
        const r = Math.cbrt(3 * V.V / (4 * Math.PI)), A = Math.PI * r * r, CD = 0.5;
        for (let i = 0; i < n; i++) {
          const a = air(z), rin = a.p / (R_AIR * (V.Tin + 273.15));
          const B = ((a.rho - rin) * V.V - V.m) * G0;
          const Dr = -0.5 * a.rho * CD * A * w * Math.abs(w);
          const M = V.m + rin * V.V + 0.5 * a.rho * V.V;         // the balloon, its hot air and the air it drags along
          w += (B + Dr) / M * h; z += w * h;
          if (z <= V.elev) { z = V.elev; if (w < 0) w = 0; }
          if (z >= 9500) { z = 9500; if (w > 0) w = 0; }
        }
      }
      // molecules for the two magnifiers (fixed positions, so the counts are easy to compare)
      const seedPts = []; let sd = 7;
      const rnd = () => { sd = (sd * 16807) % 2147483647; return sd / 2147483647; };
      for (let i = 0; i < 70; i++) { const rr = Math.sqrt(rnd()) * 0.86, th = rnd() * Math.PI * 2; seedPts.push([rr * Math.cos(th), rr * Math.sin(th), rnd() * 6.28]); }
      const loop = kit.loop((dt) => {
        if (dt > 0) { step(dt * SPEED); tA += dt; }
        const c = st.begin(), C = kit.colors();
        const a = air(z), rin = rhoIn(z), lift = liftKg(z), eq = equilibrium();
        const sc = Math.cbrt(V.V / 2800), R = clamp(st.H / 12, 18, 32) * sc;           // the envelope's size on screen
        const Ws = st.W * 0.66, yb = st.H - 26, yt = 22 + 2.6 * R, Y = zm => yb - (Math.min(zm, ZTOP) / ZTOP) * (yb - yt);
        // sky
        const g = c.createLinearGradient(0, 0, 0, st.H);
        g.addColorStop(0, C.dark ? 'hsl(215 45% 12%)' : 'hsl(208 70% 84%)'); g.addColorStop(1, C.dark ? 'hsl(210 35% 20%)' : 'hsl(200 60% 95%)');
        c.fillStyle = g; c.fillRect(0, 0, Ws, st.H);
        // altitude scale
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let k = 0; k <= ZTOP; k += 1000) {
          const y = Y(k); c.beginPath(); c.moveTo(46, y); c.lineTo(Ws, y); c.stroke();
          kit.label(c, k + ' m', 42, y, { align: 'right', color: C.muted, size: 10.5, baseline: 'middle' });
        }
        // ground and launch site
        c.fillStyle = C.dark ? 'hsl(120 22% 22%)' : 'hsl(110 30% 72%)';
        c.fillRect(46, Y(0), Ws - 46, st.H - Y(0));
        if (V.elev > 0) { c.beginPath(); c.moveTo(Ws * 0.2, Y(0)); c.lineTo(Ws * 0.35, Y(V.elev)); c.lineTo(Ws * 0.75, Y(V.elev)); c.lineTo(Ws * 0.92, Y(0)); c.closePath(); c.fill(); }
        // neutral-buoyancy level
        if (eq.z != null && eq.z <= ZTOP) {
          c.setLineDash([6, 4]); c.strokeStyle = C.ok; c.lineWidth = 1.4;
          c.beginPath(); c.moveTo(46, Y(eq.z)); c.lineTo(Ws, Y(eq.z)); c.stroke(); c.setLineDash([]);
          kit.label(c, 'neutral buoyancy', Ws - 6, Y(eq.z) - 8, { align: 'right', color: C.ok, size: 11, weight: 700 });
        }
        // the balloon
        const bx = Ws * 0.55, by = Y(z);
        const heat = clamp((V.Tin - 20) / 100, 0, 1);
        c.strokeStyle = C.text; c.lineWidth = 1;
        c.beginPath(); c.moveTo(bx - 6, by - 10); c.lineTo(bx - R * 0.45, by - 10 - R * 1.1); c.moveTo(bx + 6, by - 10); c.lineTo(bx + R * 0.45, by - 10 - R * 1.1); c.stroke();
        c.beginPath(); c.arc(bx, by - 12 - R * 1.55, R, Math.PI * 0.8, Math.PI * 2.2);
        c.lineTo(bx + R * 0.35, by - 12 - R * 0.55); c.lineTo(bx - R * 0.35, by - 12 - R * 0.55); c.closePath();
        c.fillStyle = 'hsl(' + (215 - 205 * heat) + ' 75% ' + (C.dark ? 52 : 58) + '%)'; c.fill(); c.stroke();
        c.fillStyle = C.surface; c.fillRect(bx - 6, by - 10, 12, 10); c.strokeRect(bx - 6, by - 10, 12, 10);
        if (z > ZTOP) kit.label(c, '↑ ' + Math.round(z) + ' m', bx - R - 14, by - 1.6 * R, { align: 'right', color: C.text, size: 12, weight: 700, bg: C.bg2 });
        kit.arrow(c, bx + R + 10, by - R, bx + R + 10, by - R - clamp(w * 12, -40, 40), w >= 0 ? C.ok : C.bad, 2);
        // magnifiers: a litre outside and inside
        const mx = Ws + (st.W - Ws) / 2, rM = Math.min((st.W - Ws) * 0.36, st.H * 0.17);
        const lens = (cy, rho, T, title) => {
          c.beginPath(); c.arc(mx, cy, rM, 0, Math.PI * 2); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
          const n = Math.round(clamp(rho / 1.225, 0, 1.4) * 44), jig = Math.sqrt(T / 288) * 2.2;
          c.fillStyle = C.accent;
          for (let i = 0; i < n && i < seedPts.length; i++) {
            const q = seedPts[i], jx = Math.sin(tA * 9 * Math.sqrt(T / 288) + q[2]) * jig, jy = Math.cos(tA * 7.3 * Math.sqrt(T / 288) + q[2] * 1.7) * jig;
            c.beginPath(); c.arc(mx + q[0] * rM + jx, cy + q[1] * rM + jy, 2.1, 0, 7); c.fill();
          }
          kit.label(c, title, mx, cy - rM - 9, { align: 'center', color: C.text, size: 11.5, weight: 700 });
          kit.label(c, rho.toFixed(3) + ' kg/m³, ' + (T - 273.15).toFixed(1) + ' °C', mx, cy + rM + 10, { align: 'center', color: C.muted, size: 11 });
        };
        lens(st.H * 0.27, a.rho, a.T, 'outside');
        lens(st.H * 0.73, rin, V.Tin + 273.15, 'inside the envelope');
        // read-outs
        ro.set('alt', Math.round(z) + ' m (' + Math.round(z / 0.3048) + ' ft)');
        ro.set('Tout', (a.T - 273.15).toFixed(1) + ' °C');
        ro.set('p', (a.p / 100).toFixed(0) + ' hPa');
        ro.set('rho', a.rho.toFixed(3) + ' / ' + rin.toFixed(3) + ' kg/m³');
        ro.set('lift', Math.round(lift) + ' kg against ' + V.m + ' kg to carry');
        ro.set('vs', (w >= 0 ? '+' : '') + w.toFixed(2) + ' m/s (' + Math.round(w / 0.00508) + ' ft/min)');
        if (eq.ground) {
          const a0 = air(V.elev), need0 = a0.rho - V.m / V.V;
          ro.set('eq', need0 > 0 ? 'stays down: needs ' + (a0.p / (R_AIR * need0) - 273.15).toFixed(1) + ' °C inside to lift off' : 'cannot lift this mass at any temperature');
        } else ro.set('eq', eq.above ? 'above 9500 m — a real pilot would let it cool' : Math.round(eq.z) + ' m (' + Math.round(eq.z / 0.3048) + ' ft)');
        const pts = []; for (let zz = 0; zz <= 8000; zz += 100) pts.push([zz, liftKg(zz)]);
        plot.set({ series: [{ pts, label: 'gross lift at this envelope temperature' }], hlines: [{ y: V.m, label: 'mass to carry' }], vlines: [{ x: z, label: 'now' }], marks: eq.z != null ? [{ x: eq.z, y: V.m, label: 'neutral', color: C.ok }] : [] });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ RACING SOUND */
  Hyper.sim('basics-sound-race', {
    title: 'Racing sound through gases',
    blurb: `Two tubes 100 m long, one filled with air, the other with a gas of your choice. A pressure pulse starts at the left end of each at the same moment; the dots are gas molecules, drawn jiggling faster when they move faster. The speed of sound is $a = \\sqrt{\\gamma R T/M}$.

**Try this**
- Race air against helium at the same temperature: helium wins by a factor of 2.9, because its atoms are seven times lighter.
- Race air against air at −56.5 °C (an airliner's cruising height) and at +40 °C: only the temperature matters.
- Try sulfur hexafluoride, the heavy gas that makes voices deep: sound in it is 2.5 times slower than in air.
- Compare the speed of sound with the mean speed of the molecules in the read-out: sound is carried by molecules and runs at about three quarters of their speed.`,
    mount(box, kit) {
      const GASES = { air: ['air', 1.4, 28.9647e-3, 'air'], helium: ['helium', 5 / 3, 4.003e-3, 'He'], hydrogen: ['hydrogen', 1.405, 2.016e-3, 'H₂'], methane: ['methane', 1.304, 16.04e-3, 'CH₄'], co2: ['carbon dioxide', 1.289, 44.01e-3, 'CO₂'], sf6: ['sulfur hexafluoride', 1.098, 146.06e-3, 'SF₆'] };
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 220 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'temperature (°C)', min: -80, max: 100 }, y: { label: 'speed of sound (m/s)', min: 0 } }, 160);
      const ctl = kit.controls(box.side, [
        { id: 'T1', label: 'Tube 1: air at', min: -60, max: 60, step: 0.5, value: 15, unit: '°C' },
        { id: 'gas', type: 'select', label: 'Tube 2: gas', options: [['Helium', 'helium'], ['Hydrogen', 'hydrogen'], ['Methane', 'methane'], ['Air', 'air'], ['Carbon dioxide', 'co2'], ['Sulfur hexafluoride', 'sf6']], value: 'helium' },
        { id: 'T2', label: 'Tube 2 temperature', min: -60, max: 60, step: 0.5, value: 15, unit: '°C' },
        { id: 'slow', type: 'select', label: 'Slow motion', options: [['10 times slower', 10], ['20 times slower', 20], ['50 times slower', 50]], value: 20 },
        { type: 'buttons', items: [{ id: 'fire', label: 'Fire both pulses', primary: true }] }
      ], () => { fire(); loop.once(); });
      const ro = kit.readout(box.side, [['a1', 'Speed of sound, tube 1'], ['a2', 'Speed of sound, tube 2'], ['ratio', 'Tube 2 ÷ tube 1'], ['t', 'Time to cover 100 m'], ['v1', 'Mean molecular speed, tube 1'], ['v2', 'Mean molecular speed, tube 2'], ['km', 'Tube 1: one kilometre takes']]);
      const V = ctl.values, LEN = 100;
      const sound = (g, TC) => Math.sqrt(g[1] * RU * (TC + 273.15) / g[2]);
      const vmean = (g, TC) => Math.sqrt(8 * RU * (TC + 273.15) / (Math.PI * g[2]));
      let tA = 0, tFire = 0, done = 0;
      function fire() { tFire = tA; done = 0; }
      const loop = kit.loop((dt) => {
        tA += dt;
        const c = st.begin(), C = kit.colors();
        const g1 = GASES.air, g2 = GASES[V.gas] || GASES.helium;
        const lanes = [{ g: g1, T: V.T1, a: sound(g1, V.T1), v: vmean(g1, V.T1), hue: 215 }, { g: g2, T: V.T2, a: sound(g2, V.T2), v: vmean(g2, V.T2), hue: 20 }];
        const tReal = (tA - tFire) / V.slow;
        const xL = 86, xR = st.W - 26, lh = (st.H - 58) / 2;
        lanes.forEach((ln, i) => {
          const y0 = 22 + i * (lh + 14), yc = y0 + lh / 2;
          c.fillStyle = C.surface; c.fillRect(xL, y0, xR - xL, lh);
          c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(xL, y0, xR - xL, lh);
          kit.label(c, i === 0 ? 'tube 1' : 'tube 2', xL - 8, yc - 8, { align: 'right', color: C.text, size: 12, weight: 700 });
          kit.label(c, ln.g[3] + ', ' + Math.round(ln.T) + ' °C', xL - 8, yc + 8, { align: 'right', color: C.muted, size: 11 });
          const xp = ln.a * tReal, px = xL + xp / LEN * (xR - xL), wP = 16;
          const jig = 1.3 * Math.sqrt(ln.v / 459), om = 18 * ln.v / 459;
          c.fillStyle = kit.hue(ln.hue, 0.9);
          for (let x = xL + 5, n = 0; x < xR - 3; x += 8, n++) {
            const d = 6 * Math.exp(-Math.pow((x - px) / wP, 2)) * (tReal >= 0 && xp <= LEN * 1.02 ? 1 : 0);
            for (let r = 0; r < 3; r++) {
              const ph = n * 1.7 + r * 2.9;
              c.beginPath(); c.arc(x + d + Math.sin(tA * om + ph) * jig, y0 + lh * (r + 1) / 4 + Math.cos(tA * om * 0.8 + ph * 1.3) * jig, 2, 0, 7); c.fill();
            }
          }
          if (xp <= LEN) {
            c.strokeStyle = kit.hue(ln.hue, 0.5); c.setLineDash([4, 3]); c.beginPath(); c.moveTo(px, y0); c.lineTo(px, y0 + lh); c.stroke(); c.setLineDash([]);
          } else {
            kit.label(c, 'arrived after ' + (LEN / ln.a * 1000).toFixed(1) + ' ms', xR - 6, y0 + 10, { align: 'right', color: C.ok, size: 11.5, weight: 700, bg: C.surface });
          }
        });
        // distance scale
        for (let d = 0; d <= LEN; d += 25) { const x = xL + d / LEN * (xR - xL); kit.label(c, d + ' m', x, st.H - 10, { align: 'center', color: C.muted, size: 10.5 }); }
        // repeat automatically once both pulses have arrived
        const slowest = Math.min(lanes[0].a, lanes[1].a);
        if (tReal > LEN / slowest) { if (!done) done = tA; if (tA - done > 1.5) fire(); }
        ro.set('a1', lanes[0].a.toFixed(1) + ' m/s (' + (lanes[0].a * 3.6).toFixed(0) + ' km/h, ' + (lanes[0].a / KT).toFixed(0) + ' kt)');
        ro.set('a2', lanes[1].a.toFixed(1) + ' m/s (' + (lanes[1].a * 3.6).toFixed(0) + ' km/h)');
        ro.set('ratio', (lanes[1].a / lanes[0].a).toFixed(2) + ' ×');
        ro.set('t', (LEN / lanes[0].a * 1000).toFixed(1) + ' ms and ' + (LEN / lanes[1].a * 1000).toFixed(1) + ' ms');
        ro.set('v1', lanes[0].v.toFixed(0) + ' m/s (a is ' + (lanes[0].a / lanes[0].v).toFixed(2) + ' of it)');
        ro.set('v2', lanes[1].v.toFixed(0) + ' m/s');
        ro.set('km', (1000 / lanes[0].a).toFixed(2) + ' s — the thunder rule');
        const curve = g => { const p = []; for (let T = -80; T <= 100; T += 2) p.push([T, sound(g, T)]); return p; };
        const series = [{ pts: curve(g1), label: 'air' }];
        if (g2 !== g1) series.push({ pts: curve(g2), label: g2[0] });
        plot.set({ series, marks: [{ x: V.T1, y: lanes[0].a, label: 'tube 1' }, { x: V.T2, y: lanes[1].a, label: 'tube 2', color: C.series[1] }] });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ FLOW PAST A CYLINDER (lattice Boltzmann) */
  Hyper.sim('basics-cylinder-re', {
    title: 'Flow past a cylinder: the Reynolds number',
    blurb: `A two-dimensional flow past a circular cylinder, computed as you watch by the lattice-Boltzmann method (populations of fluid particles streaming and colliding on a grid, a D2Q9 model with a small eddy-viscosity term for stability at high Re). Colour shows the spin of the fluid (vorticity: red anticlockwise, blue clockwise) or its speed; white smoke is released upstream.

**Try this**
- Re = 1: creeping flow. The flow closes up behind the cylinder almost as it opened in front, and the drag coefficient is large.
- Re = 20–40: the flow separates and two steady eddies sit behind the cylinder.
- Re = 100–200: the eddies break away in turn, a Kármán vortex street. The read-out measures the Strouhal number fD/V from the swinging side force — close to 0.2.
- Re = 1000: a busier wake. A real cylinder's wake is already three-dimensional and turbulent here, which this 2-D model cannot show; the graph carries the story on to the drag crisis near Re = 3 × 10⁵.
- The same Re is a 1 cm rod in a gentle breeze or in slow water (read-outs): the flow pattern depends on Re alone.

The cylinder sits in a channel only about five diameters wide and the model is two-dimensional, so the drag it measures is well above open-air values — about 40 % higher at Re = 100, twice as high at Re = 1, where the walls matter most, and at Re = 1000 — and its Strouhal number is a little high (0.20 against 0.16 at Re = 100). The graph gives the open-air values; the gap between the two marks is itself a lesson in why wind tunnels correct for their walls.`,
    mount(box, kit, params) {
      const P = params || {};
      const NX = 160, NY = 64, NN = NX * NY, D = 12, CX = 36, CY = NY / 2 - 0.35, RAD = D / 2;
      const st = kit.stage(box.stage, { aspect: NY / NX, minH: 180 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'Reynolds number (log scale)', log: true, min: 0.1, max: 1e7 }, y: { label: 'drag coefficient C_D', log: true, min: 0.1, max: 100 } }, 170);
      const ctl = kit.controls(box.side, [
        { id: 're', label: 'Reynolds number', min: 1, max: 1000, value: clamp(+P.re || 100, 1, 1000), log: true, sig: 2 },
        { id: 'view', type: 'select', label: 'Colour shows', options: [['Vorticity (spin)', 'vort'], ['Speed', 'speed']], value: 'vort' },
        { id: 'dye', type: 'check', label: 'Smoke tracers', value: true },
        { id: 'spf', type: 'select', label: 'Simulation speed', options: [['Normal', 8], ['Fast', 16]], value: 8 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart the flow', primary: true }] }
      ], (id) => { if (id === 're' || id === 'restart') init(); loop.once(); });
      const ro = kit.readout(box.side, [['re', 'Reynolds number'], ['regime', 'What the flow does'], ['st', 'Strouhal number fD/V (measured)'], ['cd', 'C_D here (narrow channel)'], ['cdref', 'C_D of a cylinder in open air'], ['air', 'Same Re in air: a 1 cm rod at'], ['water', '… or in water at']]);
      const V = ctl.values;
      // D2Q9 lattice
      const EX = [0, 1, 0, -1, 0, 1, -1, -1, 1], EY = [0, 0, 1, 0, -1, 1, 1, -1, -1];
      const W9 = [4 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 36, 1 / 36, 1 / 36, 1 / 36], OPP = [0, 3, 4, 1, 2, 7, 8, 5, 6];
      const OFF = EX.map((e, i) => e + EY[i] * NX);
      const solid = new Uint8Array(NN);
      for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) if ((x - CX) * (x - CX) + (y - CY) * (y - CY) <= RAD * RAD) solid[y * NX + x] = 1;
      let f = new Float64Array(9 * NN), f2 = new Float64Array(9 * NN);
      const ux = new Float32Array(NN), uy = new Float32Array(NN), fl = new Float64Array(9), fe = new Float64Array(9), feqIn = new Float64Array(9);
      let U0 = 0.08, tau0 = 0.6, steps = 0, warm = 0, cdAvg = NaN, clMean = 0, clAmp = 0, lastSign = 0, lastCross = -1, periods = [], stNum = NaN, parts = [], unstable = 0;
      const CS2 = 0.15 * 0.15;
      const eqInto = (arr, k, rho, u, v) => {
        const usq = 1.5 * (u * u + v * v);
        for (let i = 0; i < 9; i++) { const eu = 3 * (EX[i] * u + EY[i] * v); arr[i * NN + k] = W9[i] * rho * (1 + eu + 0.5 * eu * eu - usq); }
      };
      function init() {
        const Re = V.re;
        let nu = 0.08 * D / Re;
        U0 = 0.08;
        if (nu > 0.4) { nu = 0.4; U0 = Re * nu / D; }
        tau0 = 3 * nu + 0.5;
        for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
          const k = y * NX + x;
          if (solid[k]) { eqInto(f, k, 1, 0, 0); continue; }
          const kick = (x > CX && x < CX + 3 * D && y > CY && y < CY + D) ? 0.15 * U0 : 0;   // a small nudge that starts the shedding sooner
          eqInto(f, k, 1, U0, kick);
        }
        f2.set(f);
        const usq = 1.5 * U0 * U0;
        for (let i = 0; i < 9; i++) { const eu = 3 * EX[i] * U0; feqIn[i] = W9[i] * (1 + eu + 0.5 * eu * eu - usq); }
        steps = 0; warm = Math.round(1.6 * NX / U0); cdAvg = NaN; clMean = 0; clAmp = 0; lastSign = 0; lastCross = -1; periods = []; stNum = NaN; parts = [];
      }
      function lbmStep() {
        let Fx = 0, Fy = 0;
        for (let y = 1; y < NY - 1; y++) {
          for (let x = 1; x < NX - 1; x++) {
            const k = y * NX + x;
            if (solid[k]) continue;
            let rho = 0, jx = 0, jy = 0;
            for (let i = 0; i < 9; i++) {
              const src = k - OFF[i];
              let v;
              if (solid[src]) { v = f[OPP[i] * NN + k]; Fx -= 2 * v * EX[i]; Fy -= 2 * v * EY[i]; }   // bounce-back; momentum given to the body
              else v = f[i * NN + src];
              fl[i] = v; rho += v; jx += v * EX[i]; jy += v * EY[i];
            }
            const u = jx / rho, w = jy / rho, usq = 1.5 * (u * u + w * w);
            ux[k] = u; uy[k] = w;
            let pxx = 0, pyy = 0, pxy = 0;
            for (let i = 0; i < 9; i++) {
              const eu = 3 * (EX[i] * u + EY[i] * w), q = W9[i] * rho * (1 + eu + 0.5 * eu * eu - usq);
              fe[i] = q;
              const d = fl[i] - q;
              pxx += EX[i] * EX[i] * d; pyy += EY[i] * EY[i] * d; pxy += EX[i] * EY[i] * d;
            }
            const Q = Math.sqrt(pxx * pxx + pyy * pyy + 2 * pxy * pxy);
            const om = 2 / (tau0 + Math.sqrt(tau0 * tau0 + 25.456 * CS2 * Q / rho));   // Smagorinsky eddy viscosity (18√2 = 25.456)
            for (let i = 0; i < 9; i++) f2[i * NN + k] = fl[i] + om * (fe[i] - fl[i]);
          }
        }
        // free stream on the inflow side and the far-field sides; zero gradient at the outflow
        for (let x = 0, kt = (NY - 1) * NX; x < NX; x++) for (let i = 0; i < 9; i++) { f2[i * NN + x] = feqIn[i]; f2[i * NN + kt + x] = feqIn[i]; }
        for (let y = 1; y < NY - 1; y++) {
          const k0 = y * NX, kR = y * NX + NX - 1;
          for (let i = 0; i < 9; i++) { f2[i * NN + k0] = feqIn[i]; f2[i * NN + kR] = f2[i * NN + kR - 1]; }
        }
        const t = f; f = f2; f2 = t;
        steps++;
        return [Fx, Fy];
      }
      function measure(F) {
        const q = 0.5 * U0 * U0 * D, cd = F[0] / q, cl = F[1] / q;
        if (steps < warm) return;
        cdAvg = Number.isFinite(cdAvg) ? cdAvg + (cd - cdAvg) / 1500 : cd;
        clMean += (cl - clMean) / 1500;
        clAmp += (Math.abs(cl - clMean) - clAmp) / 800;
        const s = cl - clMean > 0 ? 1 : -1;
        if (s > 0 && lastSign < 0) {
          if (lastCross >= 0) { periods.push(steps - lastCross); if (periods.length > 4) periods.shift(); }
          lastCross = steps;
        }
        lastSign = s;
        if (clAmp > 0.01 && periods.length >= 2) { const T = periods.reduce((a, b) => a + b, 0) / periods.length; stNum = D / T / U0; } else stNum = NaN;
      }
      // the C_D–Re curve of a smooth cylinder in open air (typical measurements, rounded)
      const CDREF = [[0.1, 58], [0.3, 22], [1, 10.5], [2, 6.8], [5, 4.0], [10, 2.9], [20, 2.1], [40, 1.6], [100, 1.4], [200, 1.3], [400, 1.15], [1e3, 1.0], [3e3, 0.95], [1e4, 1.1], [3e4, 1.2], [1e5, 1.2], [2e5, 1.2], [3e5, 0.8], [4e5, 0.35], [5e5, 0.3], [1e6, 0.35], [3e6, 0.55], [1e7, 0.65]];
      const cdRef = Re => {
        if (Re <= CDREF[0][0]) return CDREF[0][1];
        for (let i = 1; i < CDREF.length; i++) if (Re <= CDREF[i][0]) {
          const [a, ca] = CDREF[i - 1], [b, cb] = CDREF[i], t = Math.log(Re / a) / Math.log(b / a);
          return Math.exp(Math.log(ca) + t * Math.log(cb / ca));
        }
        return CDREF[CDREF.length - 1][1];
      };
      const refCurve = []; for (let e = -1; e <= 7.001; e += 0.05) refCurve.push([Math.pow(10, e), cdRef(Math.pow(10, e))]);
      // image buffer
      const off = document.createElement('canvas'); off.width = NX; off.height = NY;
      const octx = off.getContext('2d'), img = octx.createImageData(NX, NY);
      const velAt = (X, Y) => {
        const x = Math.floor(X), y = Math.floor(Y);
        if (x < 0 || y < 0 || x >= NX - 1 || y >= NY - 1) return null;
        const k = y * NX + x, a = X - x, b = Y - y;
        if (solid[k] || solid[k + 1] || solid[k + NX] || solid[k + NX + 1]) return null;
        return [(1 - a) * (1 - b) * ux[k] + a * (1 - b) * ux[k + 1] + (1 - a) * b * ux[k + NX] + a * b * ux[k + NX + 1],
          (1 - a) * (1 - b) * uy[k] + a * (1 - b) * uy[k + 1] + (1 - a) * b * uy[k + NX] + a * b * uy[k + NX + 1]];
      };
      let frame = 0;
      init();
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        if (dt > 0) {
          const n = V.spf || 8;
          for (let s = 0; s < n; s++) measure(lbmStep());
          const kp = (NY >> 1) * NX + NX - 20;
          if (!Number.isFinite(ux[kp]) || Math.abs(ux[kp]) > 0.5) { unstable = 90; init(); }
          if (V.dye) {
            if (frame % 2 === 0) for (let j = 0; j < 11; j++) parts.push([1.5, 4 + j * (NY - 8) / 10]);
            for (const q of parts) { const v = velAt(q[0], q[1]); if (!v) { q[0] = -1; continue; } q[0] += v[0] * n; q[1] += v[1] * n; }
            parts = parts.filter(q => q[0] >= 0 && q[0] < NX - 1 && q[1] > 0 && q[1] < NY - 1);
            if (parts.length > 1600) parts.splice(0, parts.length - 1600);
          }
          frame++;
        }
        // colour field
        const bg = rgbOf(C.bg2, C.dark ? [22, 26, 32] : [246, 247, 249]);
        const pos = C.dark ? [255, 105, 85] : [215, 55, 40], neg = C.dark ? [90, 160, 255] : [40, 100, 215], sol = rgbOf(C.surface, bg);
        const data = img.data, vort = V.view !== 'speed';
        for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
          const k = y * NX + x, o = 4 * ((NY - 1 - y) * NX + x);
          let s = 0, col = bg;
          if (solid[k]) col = sol;
          else if (vort) {
            if (x > 0 && x < NX - 1 && y > 0 && y < NY - 1) s = ((uy[k + 1] - uy[k - 1]) - (ux[k + NX] - ux[k - NX])) * 0.5 * D / U0 / 3;
          } else s = (Math.hypot(ux[k], uy[k]) / U0 - 1) * 1.6;
          s = clamp(s, -1, 1);
          const t = Math.abs(s), tgt = s > 0 ? pos : neg;
          data[o] = col[0] + (tgt[0] - col[0]) * t * (col === bg ? 1 : 0);
          data[o + 1] = col[1] + (tgt[1] - col[1]) * t * (col === bg ? 1 : 0);
          data[o + 2] = col[2] + (tgt[2] - col[2]) * t * (col === bg ? 1 : 0);
          data[o + 3] = 255;
        }
        octx.putImageData(img, 0, 0);
        const c = st.begin(), sx = st.W / NX, sy = st.H / NY;
        c.imageSmoothingEnabled = true;
        c.drawImage(off, 0, 0, NX, NY, 0, 0, st.W, st.H);
        if (V.dye) {
          c.fillStyle = C.dark ? 'rgba(255,255,255,0.75)' : 'rgba(40,40,50,0.6)';
          for (const q of parts) c.fillRect(q[0] * sx - 1, (NY - 1 - q[1] + 0.5) * sy - 1, 2, 2);
        }
        c.beginPath(); c.arc((CX + 0.5) * sx, (NY - 1 - CY + 0.5) * sy, RAD * sx, 0, Math.PI * 2);
        c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        kit.label(c, 'flow →', 8, 12, { align: 'left', color: C.text, size: 12, weight: 700, bg: C.bg2 });
        kit.label(c, 'Re = ' + kit.fmt(V.re, 3), st.W - 8, 12, { align: 'right', color: C.text, size: 13, weight: 700, bg: C.bg2 });
        if (unstable > 0) { unstable--; kit.label(c, 'restarted', st.W / 2, st.H - 12, { align: 'center', color: C.warn, size: 12, bg: C.bg2 }); }
        // read-outs
        const Re = V.re;
        ro.set('re', kit.fmt(Re, 3) + ' (on the diameter)');
        ro.set('regime', Re < 5 ? 'creeping flow: no separation, nearly the same front and back' : Re < 47 ? 'separated: two steady eddies behind the cylinder' : Re < 190 ? 'a laminar vortex street (Kármán)' : 'vortex street; a real wake turns 3-D and turbulent here');
        ro.set('st', steps < warm ? 'waiting for the wake to develop…' : Number.isFinite(stNum) ? stNum.toFixed(3) : '— (steady wake, no shedding)');
        ro.set('cd', Number.isFinite(cdAvg) ? cdAvg.toFixed(2) : 'measuring…');
        ro.set('cdref', cdRef(Re).toFixed(2) + ' (typical measurements)');
        ro.set('air', kit.fmt(Re * 1.5e-5 / 0.01, 3) + ' m/s');
        ro.set('water', kit.fmt(Re * 1.0e-6 / 0.01, 3) + ' m/s');
        if (frame % 15 === 0 || dt === 0) {
          const marks = [{ x: Re, y: cdRef(Re), label: 'open air' }];
          if (Number.isFinite(cdAvg) && cdAvg > 0) marks.push({ x: Re, y: cdAvg, label: 'this simulation', color: C.warn });
          plot.set({ series: [{ pts: refCurve, label: 'smooth cylinder, open air' }], marks, vlines: [{ x: 3e5, label: 'drag crisis' }] });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ DIMENSIONAL ANALYSIS */
  const DIMN = ['M', 'L', 'T', 'Θ'];
  const PROBLEMS = {
    drag: { title: 'Drag on a body', ask: 'What can the drag F of a sphere, a car or a wing depend on?', reps: ['rho', 'V', 'D'],
      vars: [['F', 'F', 'drag force', [1, 1, -2, 0]], ['rho', 'ρ', 'fluid density', [1, -3, 0, 0]], ['V', 'V', 'speed', [0, 1, -1, 0]], ['D', 'D', 'size', [0, 1, 0, 0]],
        ['mu', 'μ', 'viscosity', [1, -1, -1, 0], 'visc'], ['a', 'a', 'speed of sound', [0, 1, -1, 0], 'comp'], ['g', 'g', 'gravity', [0, 1, -2, 0], 'grav'], ['k', 'k', 'roughness height', [0, 1, 0, 0], 'rough']],
      named: [[{ F: 1, rho: -1, V: -2, D: -2 }, 'C_F', 'force coefficient (C_D up to a constant)'], [{ rho: 1, V: 1, D: 1, mu: -1 }, 'Re', 'Reynolds number'], [{ V: 1, a: -1 }, 'M', 'Mach number'], [{ V: 1, g: -0.5, D: -0.5 }, 'Fr', 'Froude number'], [{ k: 1, D: -1 }, 'k/D', 'relative roughness']],
      defaults: { visc: true, comp: false, grav: false, rough: false } },
    pendulum: { title: 'Period of a pendulum', ask: 'What can the period t of a pendulum depend on?', reps: ['L', 'g', 'm'],
      vars: [['t', 't', 'period', [0, 0, 1, 0]], ['L', 'L', 'length', [0, 1, 0, 0]], ['g', 'g', 'gravity', [0, 1, -2, 0]], ['m', 'm', 'mass of the bob', [1, 0, 0, 0]], ['th', 'θ₀', 'release angle', [0, 0, 0, 0], 'amp']],
      named: [[{ t: 2, g: 1, L: -1 }, 'gt²/L', 'dimensionless period'], [{ th: 1 }, 'θ₀', 'release angle (already a pure number)']],
      defaults: { amp: true } },
    shed: { title: 'Vortex shedding from a cylinder', ask: 'What can the shedding frequency f behind a cylinder depend on?', reps: ['rho', 'V', 'D'],
      vars: [['f', 'f', 'shedding frequency', [0, 0, -1, 0]], ['rho', 'ρ', 'fluid density', [1, -3, 0, 0]], ['V', 'V', 'speed', [0, 1, -1, 0]], ['D', 'D', 'diameter', [0, 1, 0, 0]], ['mu', 'μ', 'viscosity', [1, -1, -1, 0], 'visc']],
      named: [[{ f: 1, D: 1, V: -1 }, 'St', 'Strouhal number'], [{ rho: 1, V: 1, D: 1, mu: -1 }, 'Re', 'Reynolds number']],
      defaults: { visc: true } },
    pipe: { title: 'Pressure drop in a pipe', ask: 'What can the pressure drop Δp along a pipe depend on?', reps: ['rho', 'V', 'D'],
      vars: [['dp', 'Δp', 'pressure drop', [1, -1, -2, 0]], ['rho', 'ρ', 'fluid density', [1, -3, 0, 0]], ['V', 'V', 'mean speed', [0, 1, -1, 0]], ['D', 'D', 'diameter', [0, 1, 0, 0]], ['L', 'L', 'pipe length', [0, 1, 0, 0]],
        ['mu', 'μ', 'viscosity', [1, -1, -1, 0], 'visc'], ['k', 'k', 'wall roughness', [0, 1, 0, 0], 'rough']],
      named: [[{ dp: 1, rho: -1, V: -2 }, 'Eu', 'pressure-drop coefficient (Euler number)'], [{ L: 1, D: -1 }, 'L/D', 'length in diameters'], [{ rho: 1, V: 1, D: 1, mu: -1 }, 'Re', 'Reynolds number'], [{ k: 1, D: -1 }, 'k/D', 'relative roughness']],
      defaults: { visc: true, rough: true } },
    ship: { title: 'Resistance of a ship', ask: 'What can the resistance F of a ship\'s hull depend on?', reps: ['rho', 'V', 'L'],
      vars: [['F', 'F', 'resistance', [1, 1, -2, 0]], ['rho', 'ρ', 'water density', [1, -3, 0, 0]], ['V', 'V', 'speed', [0, 1, -1, 0]], ['L', 'L', 'hull length', [0, 1, 0, 0]],
        ['g', 'g', 'gravity (waves)', [0, 1, -2, 0], 'grav'], ['mu', 'μ', 'viscosity', [1, -1, -1, 0], 'visc']],
      named: [[{ F: 1, rho: -1, V: -2, L: -2 }, 'C_F', 'resistance coefficient'], [{ V: 1, g: -0.5, L: -0.5 }, 'Fr', 'Froude number'], [{ rho: 1, V: 1, L: 1, mu: -1 }, 'Re', 'Reynolds number']],
      defaults: { grav: true, visc: true } },
    prop: { title: 'Thrust of a propeller', ask: 'What can the thrust T of a propeller depend on?', reps: ['rho', 'n', 'D'],
      vars: [['T', 'T', 'thrust', [1, 1, -2, 0]], ['rho', 'ρ', 'air density', [1, -3, 0, 0]], ['n', 'n', 'revolutions per second', [0, 0, -1, 0]], ['D', 'D', 'diameter', [0, 1, 0, 0]], ['V', 'V', 'flight speed', [0, 1, -1, 0]],
        ['mu', 'μ', 'viscosity', [1, -1, -1, 0], 'visc'], ['a', 'a', 'speed of sound', [0, 1, -1, 0], 'comp']],
      named: [[{ T: 1, rho: -1, n: -2, D: -4 }, 'C_T', 'thrust coefficient'], [{ V: 1, n: -1, D: -1 }, 'J', 'advance ratio'], [{ rho: 1, n: 1, D: 2, mu: -1 }, 'Re', 'Reynolds number of the blade tips'], [{ n: 1, D: 1, a: -1 }, 'M_tip', 'tip Mach number (up to π)']],
      defaults: { visc: true, comp: true } },
    wave: { title: 'Speed of water waves', ask: 'What can the speed c of waves on water depend on?', reps: ['rho', 'g', 'lam'],
      vars: [['c', 'c', 'wave speed', [0, 1, -1, 0]], ['g', 'g', 'gravity', [0, 1, -2, 0]], ['lam', 'λ', 'wavelength', [0, 1, 0, 0]], ['rho', 'ρ', 'water density', [1, -3, 0, 0]],
        ['sig', 'σ', 'surface tension', [1, 0, -2, 0], 'surf'], ['hd', 'h', 'water depth', [0, 1, 0, 0], 'depth']],
      named: [[{ c: 2, g: -1, lam: -1 }, 'c²/(gλ)', 'wave Froude number'], [{ sig: 1, rho: -1, g: -1, lam: -2 }, '1/Bo', 'surface tension against gravity (inverse Bond number)'], [{ hd: 1, lam: -1 }, 'h/λ', 'depth in wavelengths']],
      defaults: { surf: false, depth: false } },
    blast: { title: 'Radius of a blast wave', ask: 'What can the radius R of a strong blast wave depend on? (G. I. Taylor, 1950)', reps: ['E', 't', 'rho'],
      vars: [['R', 'R', 'radius of the blast', [0, 1, 0, 0]], ['E', 'E', 'energy released', [1, 2, -2, 0]], ['t', 't', 'time since the explosion', [0, 0, 1, 0]], ['rho', 'ρ', 'air density', [1, -3, 0, 0]],
        ['p0', 'p₀', 'ambient pressure', [1, -1, -2, 0], 'amb']],
      named: [[{ R: 5, rho: 1, E: -1, t: -2 }, 'R⁵ρ/(Et²)', 'Taylor\'s group'], [{ p0: 5, t: 6, E: -2, rho: -3 }, 'Π_p', 'ambient-pressure group']],
      defaults: { amb: false } }
  };
  const FLAGS = [['visc', 'Include viscosity μ'], ['comp', 'Include the speed of sound a'], ['grav', 'Include gravity g'], ['rough', 'Include roughness k'], ['surf', 'Include surface tension σ'], ['depth', 'Include the water depth h'], ['amp', 'Include the release angle θ₀'], ['amb', 'Include the ambient pressure p₀']];
  const SUPS = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '/': 'ᐟ' };
  const sup = n => String(n).split('').map(ch => SUPS[ch] || ch).join('');
  const powTxt = (s, e) => e === 1 ? s : s + sup(e);
  function rationalize(x) { for (let q = 1; q <= 12; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-6) return [p, q]; } return null; }
  const gcd = (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; };
  function rankOf(cols) {
    const M = [0, 1, 2, 3].map(r => cols.map(c => c[r]));
    let rank = 0;
    for (let c = 0; c < cols.length && rank < 4; c++) {
      let p = -1, best = 1e-9;
      for (let r = rank; r < 4; r++) if (Math.abs(M[r][c]) > best) { best = Math.abs(M[r][c]); p = r; }
      if (p < 0) continue;
      const tmp = M[rank]; M[rank] = M[p]; M[p] = tmp;
      for (let r = 0; r < 4; r++) if (r !== rank) { const fct = M[r][c] / M[rank][c]; for (let k = c; k < cols.length; k++) M[r][k] -= fct * M[rank][k]; }
      rank++;
    }
    return rank;
  }
  // least squares: columns A (k vectors of 4) times e = b
  function solveLS(A, b) {
    const k = A.length, dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2] + u[3] * v[3];
    const M = A.map(ai => A.map(aj => dot(ai, aj)).concat([dot(ai, b)]));
    for (let c = 0; c < k; c++) {
      let p = c; for (let r = c + 1; r < k; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
      const tmp = M[c]; M[c] = M[p]; M[p] = tmp;
      if (Math.abs(M[c][c]) < 1e-12) return null;
      for (let r = 0; r < k; r++) if (r !== c) { const fct = M[r][c] / M[c][c]; for (let j = c; j <= k; j++) M[r][j] -= fct * M[c][j]; }
    }
    const e = M.map((row, i) => row[k] / row[i]);
    for (let d = 0; d < 4; d++) { let s = 0; for (let i = 0; i < k; i++) s += e[i] * A[i][d]; if (Math.abs(s - b[d]) > 1e-9) return null; }
    return e;
  }
  function analyse(prob, flags) {
    const act = prob.vars.filter(v => !v[4] || flags[v[4]]);
    const target = act[0];
    const all = act.map(v => v[3]), k = rankOf(all);
    // repeating quantities: the preferred ones first, then any other that raises the rank (never the target)
    const reps = [];
    const tryAdd = v => { if (v === target || reps.includes(v)) return; if (rankOf(reps.concat([v]).map(r => r[3])) > reps.length) reps.push(v); };
    for (const id of prob.reps) { const v = act.find(a => a[0] === id); if (v && reps.length < k) tryAdd(v); }
    for (const v of act) if (reps.length < k) tryAdd(v);
    const groups = [], notes = [];
    for (const v of act) {
      if (reps.includes(v)) continue;
      const e = solveLS(reps.map(r => r[3]), v[3].map(x => -x));
      if (!e) { notes.push(v[1] + ' cannot be made dimensionless with the others: it cannot appear in the law'); continue; }
      const ex = { [v[0]]: 1 }; reps.forEach((r, i) => { if (Math.abs(e[i]) > 1e-9) ex[r[0]] = e[i]; });
      // integer powers: multiply by the common denominator, divide by the common factor
      let den = 1; const fr = {};
      for (const key in ex) { const q = rationalize(ex[key]); if (!q) return { error: true }; fr[key] = q; den = den * q[1] / gcd(den, q[1]); }
      const ints = {}; let gg = 0;
      for (const key in fr) { ints[key] = fr[key][0] * den / fr[key][1]; gg = gcd(gg, ints[key]); }
      for (const key in ints) ints[key] /= gg || 1;
      groups.push({ v, ex: ints });
    }
    for (const r of reps) if (!groups.some(gp => gp.ex[r[0]])) notes.push(r[1] + ' (' + r[2] + ') appears in no group: the result cannot depend on it');
    // recognise named groups
    for (const gp of groups) {
      for (const [ne, sym, name] of prob.named) {
        const keys = new Set(Object.keys(ne).concat(Object.keys(gp.ex)));
        let s = null, ok = true;
        for (const key of keys) {
          const a = gp.ex[key] || 0, b = ne[key] || 0;
          if (!a && !b) continue;
          if (!a || !b) { ok = false; break; }
          const r = a / b;
          if (s == null) s = r; else if (Math.abs(r - s) > 1e-9) { ok = false; break; }
        }
        if (ok && s != null) { gp.named = { sym, name, s }; break; }
      }
    }
    return { act, target, k, reps, groups, notes };
  }
  const symOf = (act, id) => { const v = act.find(a => a[0] === id); return v ? v[1] : id; };
  function groupText(act, ex) {
    const num = [], den = [];
    for (const v of act) { const e = ex[v[0]]; if (!e) continue; (e > 0 ? num : den).push(powTxt(v[1], Math.abs(e))); }
    const n = num.length ? num.join(' ') : '1';
    return den.length ? n + ' / ' + (den.length > 1 ? '(' + den.join(' ') + ')' : den[0]) : n;
  }
  const namedPow = nm => { const s = nm.s; if (s === 1) return nm.sym; const q = rationalize(s); return nm.sym + (q && q[1] === 1 ? sup(q[0]) : '^(' + (q ? q[0] + '/' + q[1] : s.toFixed(2)) + ')'); };

  Hyper.sim('basics-dimensional', {
    title: 'Dimensional analysis explorer',
    blurb: `Pick a problem and the quantities you think matter. The explorer writes each one's dimensions in mass, length, time and temperature, picks "repeating" quantities that between them contain every dimension, and combines each remaining quantity with them into a dimensionless group — the Buckingham Π theorem, done by solving a small linear system.

**Try this**
- *Drag on a body* with viscosity only: two groups, the force coefficient and the Reynolds number — $C_D = f(\\mathrm{Re})$. Add the speed of sound: the Mach number appears. Add gravity: the Froude number.
- *Period of a pendulum*: the mass of the bob appears in no group, so the period cannot depend on it. The release angle is already a pure number.
- *Water waves* without surface tension: the density drops out, and $c \\propto \\sqrt{g\\lambda}$. Add surface tension and a new group decides between ripples and swell.
- *Blast wave*: one group only, so $R \\propto (E t^2/\\rho)^{1/5}$ — the argument G. I. Taylor used to estimate a bomb's energy from photographs.
- Watch the "tests" read-out: each group removed divides the number of experiments needed by ten.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const defs = [{ id: 'prob', type: 'select', label: 'Problem', options: Object.keys(PROBLEMS).map(k => [PROBLEMS[k].title, k]), value: PROBLEMS[P.problem] ? P.problem : 'drag' }];
      for (const [id, label] of FLAGS) defs.push({ id, type: 'check', label, value: false });
      const ctl = kit.controls(box.side, defs, (id) => { if (id === 'prob') applyDefaults(); draw(); });
      const ro = kit.readout(box.side, [['n', 'Quantities n'], ['k', 'Independent dimensions k'], ['g', 'Dimensionless groups n − k'], ['tests', 'Tests, 10 values of each'], ['res', 'Result']]);
      const V = ctl.values;
      function applyDefaults() {
        const pr = PROBLEMS[V.prob] || PROBLEMS.drag, used = new Set(pr.vars.map(v => v[4]).filter(Boolean));
        for (const [id] of FLAGS) { ctl.set(id, !!pr.defaults[id]); ctl.show(id, used.has(id)); }
      }
      function draw() {
        const pr = PROBLEMS[V.prob] || PROBLEMS.drag, A = analyse(pr, V);
        const c = st.begin(), C = kit.colors();
        const fs = clamp(st.W / 56, 10.5, 14), lh = fs * 1.55;
        let y = 12 + fs;
        kit.label(c, pr.title, 14, y, { align: 'left', color: C.text, size: fs + 2, weight: 700 }); y += lh;
        kit.label(c, pr.ask, 14, y, { align: 'left', color: C.muted, size: fs }); y += lh * 1.2;
        if (A.error) { kit.label(c, 'These quantities do not give whole-number groups.', 14, y, { align: 'left', color: C.warn, size: fs }); return; }
        // the matrix of dimensions
        const rows = [0, 1, 2, 3].filter(d => A.act.some(v => v[3][d]));
        const cw = clamp((st.W - 110) / A.act.length, 34, 70), x0 = 96;
        const colFor = v => v === A.target ? C.warn : A.reps.includes(v) ? C.accent : C.text;
        A.act.forEach((v, i) => kit.label(c, v[1], x0 + cw * (i + 0.5), y, { align: 'center', color: colFor(v), size: fs + 1, weight: 700 }));
        kit.label(c, 'quantity', 14, y, { align: 'left', color: C.muted, size: fs - 1 });
        y += lh * 0.5;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(14, y); c.lineTo(x0 + cw * A.act.length, y); c.stroke();
        y += lh * 0.7;
        for (const d of rows) {
          kit.label(c, DIMN[d], 14, y, { align: 'left', color: C.muted, size: fs, weight: 700 });
          A.act.forEach((v, i) => { const e = v[3][d]; kit.label(c, e ? String(e).replace('-', '−') : '·', x0 + cw * (i + 0.5), y, { align: 'center', color: e ? C.text : C.faint, size: fs }); });
          y += lh;
        }
        y += lh * 0.3;
        kit.label(c, 'target', 14, y, { align: 'left', color: C.warn, size: fs - 1, weight: 700 });
        kit.label(c, 'repeating: ' + A.reps.map(r => r[1]).join(', '), 70, y, { align: 'left', color: C.accent, size: fs - 1, weight: 700 });
        y += lh * 1.3;
        // the groups
        A.groups.forEach((gp, i) => {
          const txt = 'Π' + '₁₂₃₄₅₆₇₈₉'[i] + ' = ' + groupText(A.act, gp.ex);
          kit.label(c, txt, 14, y, { align: 'left', color: C.text, size: fs + 1, weight: 600 });
          if (gp.named) {
            const nm = '= ' + namedPow(gp.named) + '   ' + gp.named.name, xn = 14 + Math.max(150, txt.length * fs * 0.62 + 16);
            if (xn + nm.length * fs * 0.52 < st.W - 8) kit.label(c, nm, xn, y, { align: 'left', color: C.muted, size: fs });
            else { y += lh * 0.9; kit.label(c, nm, 44, y, { align: 'left', color: C.muted, size: fs }); }
          }
          y += lh;
        });
        const lhs = A.groups[0] ? (A.groups[0].named && A.groups[0].named.s === 1 ? A.groups[0].named.sym : groupText(A.act, A.groups[0].ex)) : '';
        const rhs = A.groups.slice(1).map(gp => gp.named ? gp.named.sym : groupText(A.act, gp.ex));
        const result = A.groups.length ? (rhs.length ? lhs + ' = f(' + rhs.join(', ') + ')' : lhs + ' = constant') : '—';
        y += lh * 0.3;
        kit.label(c, '⇒  ' + result, 14, y, { align: 'left', color: C.accent, size: fs + 2, weight: 700 });
        y += lh * 1.2;
        for (const nt of A.notes) { kit.label(c, nt, 14, y, { align: 'left', color: C.warn, size: fs - 0.5 }); y += lh; }
        const n = A.act.length, ng = A.groups.length;
        ro.set('n', String(n)); ro.set('k', String(A.k)); ro.set('g', String(ng));
        ro.set('tests', '10' + sup(n - 1) + ' → ' + (ng > 1 ? '10' + sup(ng - 1) : '1') + ' (' + (n - 1) + ' → ' + Math.max(0, ng - 1) + ' free variables)');
        ro.set('res', result);
      }
      applyDefaults();
      st.onResize(() => draw());
      draw();
    }
  });

  /* ================================================================ PITOT TUBE AND MANOMETER */
  Hyper.sim('basics-pitot', {
    title: 'Pitot-static tube and manometer',
    blurb: `A pitot-static tube faces the wind. The hole in its nose feels the total pressure $p_0$, where the air is brought to rest; the holes in its side feel the static pressure $p$. The U-tube manometer shows the difference as a height of liquid: at low speed it is the dynamic pressure $\\tfrac12\\rho V^2$. The particles are coloured by pressure — blue where the air slows and the pressure rises, red where it speeds up round the shoulder.

**Try this**
- Find the speed that raises the water 100 mm (about 40 m/s at sea level). Doubling the speed raises it four times.
- Climb to 10 000 m at the same true airspeed: the reading falls to a third — the airspeed indicator shows the equivalent airspeed, not the true one.
- Go fast: above Mach 0.3 the true pressure rise exceeds ½ρV² (compare the curves), and a speed computed with the simple formula comes out too high. Above Mach 1 a shock stands in front of the nose.
- Switch to mercury, 13.6 times denser than water, to keep high speeds on the scale.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const plot = kit.plot(graphDiv(box), { x: { label: 'true airspeed (m/s)', min: 0, max: 400 }, y: { label: 'p₀ − p (kPa)', min: 0 } }, 160);
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'True airspeed', min: 0, max: 400, step: 1, value: 50, unit: 'm/s' },
        { id: 'h', label: 'Altitude (standard atmosphere)', min: 0, max: 15000, step: 100, value: 0, unit: 'm' },
        { id: 'liq', type: 'select', label: 'Manometer liquid', options: [['Water', 'water'], ['Mercury', 'hg']], value: 'water' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['spd', 'Airspeed'], ['M', 'Mach number'], ['air', 'Air'], ['q', 'Dynamic pressure ½ρV²'], ['dp', 'Measured p₀ − p'], ['vinc', 'Speed from √(2Δp/ρ)'], ['col', 'Manometer'], ['eas', 'Equivalent airspeed'], ['note', '']]);
      const V = ctl.values, FULL = 400;
      function reading(h, v) {
        const a = F.isa(h), M = v / a.a;
        let dp;
        if (M < 1) dp = a.p * (F.isentropic(M).p0p - 1);
        else dp = a.p * (F.isentropic(M).p0p * F.normalShock(M).p02p01 - 1);
        return { a, M, dp, q: 0.5 * a.rho * v * v };
      }
      const parts = [];
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        const r = reading(V.h, V.V), a = r.a;
        const rhoL = V.liq === 'hg' ? 13546 : 998, hmm = r.dp / (rhoL * G0) * 1000;
        // ---- the flow around the probe (a Rankine half-body in a uniform stream)
        const xf = st.W * 0.62, yc = st.H * 0.4, b = clamp(st.H * 0.042, 9, 17), xs = xf * 0.3, kk = b / Math.PI;
        const xStem = xf - 26;
        const inside = (x, y) => {
          const dx = x - xs, dy = yc - y, rr = Math.hypot(dx, dy), th = Math.abs(Math.atan2(dy, dx));
          if (x > xStem + 6) return false;
          if (th < 1e-6) return true;
          return rr < b * (Math.PI - th) / (Math.PI * Math.sin(th));
        };
        const vel = (x, y) => { const dx = x - xs, dy = yc - y, r2 = dx * dx + dy * dy + 1e-6; return [1 + kk * dx / r2, kk * dy / r2]; };
        const g = c.createLinearGradient(0, 0, 0, st.H);
        g.addColorStop(0, C.dark ? 'hsl(210 40% 14%)' : 'hsl(205 60% 93%)'); g.addColorStop(1, C.dark ? 'hsl(210 30% 18%)' : 'hsl(200 50% 97%)');
        c.fillStyle = g; c.fillRect(0, 0, xf, st.H);
        const vpx = clamp(40 + 0.6 * V.V, 40, 240);
        while (parts.length < 220) parts.push([Math.random() * xf, yc + (Math.random() - 0.5) * st.H * 0.75]);
        for (const p of parts) {
          const w = vel(p[0], p[1]);
          if (dt > 0 && V.V > 0) { p[0] += w[0] * vpx * dt; p[1] -= w[1] * vpx * dt; }
          if (p[0] > xStem - 4 || inside(p[0], p[1]) || Math.abs(p[1] - yc) > st.H * 0.42) { p[0] = Math.random() * 20; p[1] = yc + (Math.random() - 0.5) * st.H * 0.75; continue; }
          const cp = 1 - (w[0] * w[0] + w[1] * w[1]), f = clamp(cp * 1.6, -1, 1);
          c.fillStyle = f < 0 ? 'hsl(8 85% ' + (C.dark ? 62 : 48) + '% / ' + (0.35 - 0.6 * f) + ')' : 'hsl(215 85% ' + (C.dark ? 66 : 50) + '% / ' + (0.35 + 0.6 * f) + ')';
          c.fillRect(p[0] - 1.4, p[1] - 1.4, 2.8, 2.8);
        }
        // the probe body
        c.beginPath();
        for (let th = Math.PI - 0.002; th > 0.02; th -= 0.02) { const rr = b * (Math.PI - th) / (Math.PI * Math.sin(th)), x = xs + rr * Math.cos(th); if (x > xStem) break; c.lineTo(x, yc - rr * Math.sin(th)); }
        c.lineTo(xStem + 6, yc - b); c.lineTo(xStem + 6, st.H - 20); c.lineTo(xStem - 6, st.H - 20); c.lineTo(xStem - 6, yc + b);
        for (let th = 0.02; th < Math.PI - 0.002; th += 0.02) { const rr = b * (Math.PI - th) / (Math.PI * Math.sin(th)), x = xs + rr * Math.cos(th); if (x > xStem) continue; c.lineTo(x, yc + rr * Math.sin(th)); }
        c.closePath(); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.4; c.stroke();
        const red = kit.hue(8), blue = kit.hue(215), xn = xs - kk, xsh = xs + 7 * b;
        kit.dot(c, xn + 1, yc, 2.4, red);
        kit.dot(c, xsh, yc - b + 1, 2, blue); kit.dot(c, xsh, yc + b - 1, 2, blue);
        kit.label(c, 'total-pressure hole', xn - 4, yc - 16, { align: 'center', color: red, size: 11 });
        kit.label(c, 'static holes', xsh, yc + b + 14, { align: 'center', color: blue, size: 11 });
        kit.label(c, 'wind → ' + V.V + ' m/s', 10, 16, { align: 'left', color: C.text, size: 12, weight: 700 });
        if (r.M >= 1) kit.label(c, 'M > 1: a shock stands in front of the nose', 10, st.H - 12, { align: 'left', color: C.warn, size: 12, weight: 700 });
        // ---- the manometer
        const xm1 = xf + (st.W - xf) * 0.3, xm2 = xf + (st.W - xf) * 0.62, tw = 12, ytop = 26, ybot = st.H - 28, ymid = (ytop + ybot) / 2 + 10;
        const scale = (ybot - ytop - 60) / FULL, dh = Math.min(hmm, FULL), off = dh * scale / 2;
        // tubes from the probe
        c.lineWidth = 2.5;
        c.strokeStyle = red; c.beginPath(); c.moveTo(xStem - 2, st.H - 20); c.lineTo(xStem - 2, st.H - 10); c.lineTo(xm1 - 18, st.H - 10); c.lineTo(xm1 - 18, ytop - 10); c.lineTo(xm1, ytop - 10); c.lineTo(xm1, ytop); c.stroke();
        c.strokeStyle = blue; c.beginPath(); c.moveTo(xStem + 2, st.H - 20); c.lineTo(xStem + 2, st.H - 4); c.lineTo(xm2 + 22, st.H - 4); c.lineTo(xm2 + 22, ytop - 14); c.lineTo(xm2, ytop - 14); c.lineTo(xm2, ytop); c.stroke();
        // glass
        c.lineWidth = 1.4; c.strokeStyle = C.text;
        c.strokeRect(xm1 - tw / 2, ytop, tw, ybot - ytop); c.strokeRect(xm2 - tw / 2, ytop, tw, ybot - ytop);
        c.strokeRect(xm1 - tw / 2, ybot, xm2 - xm1 + tw, 12);
        const liqCol = V.liq === 'hg' ? (C.dark ? 'hsl(220 8% 70%)' : 'hsl(220 8% 55%)') : kit.hue(200, 0.6);
        c.fillStyle = liqCol;
        const yl = ymid + off, yr = ymid - off;
        c.fillRect(xm1 - tw / 2 + 1, yl, tw - 2, ybot - yl + 11); c.fillRect(xm2 - tw / 2 + 1, yr, tw - 2, ybot - yr + 11); c.fillRect(xm1, ybot + 1, xm2 - xm1, 10);
        // scale in millimetres from the rest level, between the limbs
        const xmid = (xm1 + xm2) / 2;
        for (let mm = -200; mm <= 200; mm += 50) {
          const yy = ymid - mm * scale;
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(xmid - (mm % 100 ? 3 : 6), yy); c.lineTo(xmid + (mm % 100 ? 3 : 6), yy); c.stroke();
          if (mm % 100 === 0) kit.label(c, String(mm).replace('-', '−'), xmid + 9, yy, { align: 'left', color: C.muted, size: 10, baseline: 'middle' });
        }
        kit.label(c, 'mm', xmid, ymid - 200 * scale - 12, { align: 'center', color: C.muted, size: 10 });
        c.setLineDash([3, 3]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(xm1 - 10, yr); c.lineTo(xm2 + 10, yr); c.moveTo(xm1 - 10, yl); c.lineTo(xm2 + 10, yl); c.stroke(); c.setLineDash([]);
        kit.label(c, 'p₀', xm1, ytop + 12, { align: 'center', color: red, size: 12, weight: 700 });
        kit.label(c, 'p', xm2, ytop + 12, { align: 'center', color: blue, size: 12, weight: 700 });
        kit.label(c, (hmm > FULL ? 'off scale: ' : 'Δh = ') + kit.fmt(hmm, 3) + ' mm', (xm1 + xm2) / 2, ybot + 26, { align: 'center', color: hmm > FULL ? C.warn : C.text, size: 12, weight: 700 });
        // ---- read-outs
        const vinc = Math.sqrt(2 * r.dp / a.rho);
        ro.set('spd', V.V + ' m/s = ' + (V.V / KT).toFixed(0) + ' kt = ' + (V.V * 3.6).toFixed(0) + ' km/h');
        ro.set('M', r.M.toFixed(3));
        ro.set('air', 'ρ = ' + a.rho.toFixed(3) + ' kg/m³, p = ' + (a.p / 100).toFixed(0) + ' hPa, ' + (a.T - 273.15).toFixed(1) + ' °C');
        ro.set('q', kit.fmt(r.q, 4) + ' Pa');
        ro.set('dp', kit.fmt(r.dp, 4) + ' Pa' + (r.q > 0 ? '  (' + (r.dp / r.q).toFixed(3) + ' × q)' : ''));
        ro.set('vinc', V.V > 0 ? vinc.toFixed(1) + ' m/s (' + ((vinc / V.V - 1) * 100).toFixed(1) + ' %)' : '0 m/s');
        ro.set('col', kit.fmt(hmm, 3) + ' mm of ' + (V.liq === 'hg' ? 'mercury' : 'water') + (hmm > FULL ? ' — off scale' : ''));
        ro.set('eas', (V.V * Math.sqrt(a.rho / 1.225) / KT).toFixed(0) + ' kt');
        ro.set('note', r.M >= 1 ? 'A normal shock sits ahead of the nose; the reading follows Rayleigh\'s pitot formula' : r.M > 0.3 ? 'Compressible: the pitot rise exceeds ½ρV²' : 'Below M 0.3: p₀ − p ≈ ½ρV²');
        // ---- graph
        const incomp = [], comp = [];
        for (let v = 0; v <= 400; v += 5) { const rr = reading(V.h, v); incomp.push([v, rr.q / 1000]); comp.push([v, rr.dp / 1000]); }
        plot.set({ series: [{ pts: comp, label: 'measured p₀ − p (compressible)' }, { pts: incomp, label: '½ρV²', dash: [6, 4] }], vlines: [{ x: a.a, label: 'M = 1' }], marks: [{ x: V.V, y: r.dp / 1000, label: 'now' }] });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ SPEED AND HEIGHT */
  Hyper.sim('basics-speed-altitude', {
    title: 'Speed and height: Mach number and dynamic pressure',
    blurb: `Every point on this chart is a true airspeed at a height in the standard atmosphere. The solid lines join points of equal **Mach number** — they lean left as the air cools up to 11 km, then stand straight through the isothermal stratosphere. The dashed lines join points of equal **dynamic pressure** $q = \\tfrac12\\rho V^2$; they sweep to the right, because thin air needs more speed for the same $q$. Drag the marker, or click one of the aircraft.

**Try this**
- Click the airliner: Mach 0.82 at 11 km, yet a dynamic pressure of only 10.7 kPa — what the same aircraft would meet at 132 m/s near the ground. Its airspeed indicator shows about 256 kt while its true airspeed is 470 kt.
- Follow the q = 10 kPa line upwards: to keep the same dynamic pressure (and so the same lift at the same angle of attack) an aircraft must fly faster and faster in true airspeed.
- Hold 250 m/s and climb from 0 to 11 km: the Mach number rises from 0.73 to 0.85 although the speed has not changed.
- Compare Concorde and the SR-71: both far above Mach 1, yet at dynamic pressures of only about 20–25 kPa, because the air up there is so thin. Their stagnation temperatures are another matter.

Aircraft positions are typical, rounded cruise conditions, not limits.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'True airspeed', min: 0, max: 1000, step: 1, value: 242, unit: 'm/s' },
        { id: 'h', label: 'Altitude', min: 0, max: 30000, step: 100, value: 11000, unit: 'm' },
        { id: 'unit', type: 'select', label: 'Speed unit', options: [['m/s', 'ms'], ['knots', 'kt'], ['km/h', 'kmh']], value: 'ms' },
        { id: 'show', type: 'select', label: 'Lines', options: [['Mach number and dynamic pressure', 'both'], ['Mach number only', 'mach'], ['Dynamic pressure only', 'q']], value: 'both' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['tas', 'True airspeed'], ['alt', 'Altitude'], ['T', 'Air temperature'], ['p', 'Pressure'], ['rho', 'Density (σ = ρ/ρ₀)'], ['a', 'Speed of sound'], ['M', 'Mach number'], ['q', 'Dynamic pressure'], ['eas', 'Equivalent airspeed'], ['re', 'Reynolds number per metre'], ['T0', 'Stagnation temperature']]);
      const V = ctl.values, VMAX = 1000, HMAX = 30000;
      const CRAFT = [[10, 1500, 'paraglider'], [60, 3000, 'light aircraft'], [92, 0, 'F1 car'], [140, 7000, 'turboprop'], [242, 11000, 'airliner'], [255, 13700, 'business jet'], [210, 21000, 'U-2'], [596, 17000, 'Concorde'], [953, 24000, 'SR-71']];
      const col = [];
      for (let h = 0; h <= HMAX; h += 250) col.push(F.isa(h));
      const MACHS = [0.3, 0.5, 0.8, 1, 1.5, 2, 3], QS = [1, 3, 10, 30, 100];
      const uf = () => V.unit === 'kt' ? 1 / KT : V.unit === 'kmh' ? 3.6 : 1;
      const un = () => V.unit === 'kt' ? 'kt' : V.unit === 'kmh' ? 'km/h' : 'm/s';
      let area = { x0: 56, x1: 600, y0: 12, y1: 300 };
      const X = v => area.x0 + v / VMAX * (area.x1 - area.x0), Y = h => area.y1 - h / HMAX * (area.y1 - area.y0);
      const fromXY = p => [clamp((p.x - area.x0) / (area.x1 - area.x0) * VMAX, 0, VMAX), clamp((area.y1 - p.y) / (area.y1 - area.y0) * HMAX, 0, HMAX)];
      const setFrom = (p, snap) => {
        const near = snap && CRAFT.find(cr => Math.hypot(X(cr[0]) - p.x, Y(cr[1]) - p.y) < 9);
        if (near) { ctl.set('V', near[0]); ctl.set('h', near[1]); }
        else { const [v, h] = fromXY(p); ctl.set('V', Math.round(v)); ctl.set('h', Math.round(h / 100) * 100); }
        loop.once();
      };
      kit.drag(st, {
        hit(p) { return p.x < area.x0 - 6 || p.x > area.x1 + 6 || p.y < area.y0 - 6 || p.y > area.y1 + 6 ? null : {}; },
        start(_, p) { setFrom(p, true); },
        move(_, p) { setFrom(p, false); },
        hover: true
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), k = uf();
        area = { x0: 58, x1: st.W - 14, y0: 12, y1: st.H - 34 };
        // supersonic region
        c.fillStyle = kit.hue(8, 0.07);
        c.beginPath(); col.forEach((s, i) => { const x = X(s.a), y = Y(s.h); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.lineTo(area.x1, area.y0); c.lineTo(area.x1, area.y1); c.closePath(); c.fill();
        // grid and axes
        const vstep = Hyper.niceStep(VMAX * k, 6);
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let v = 0; v <= VMAX * k + 1e-9; v += vstep) { const x = X(v / k); c.beginPath(); c.moveTo(x, area.y0); c.lineTo(x, area.y1); c.stroke(); kit.label(c, String(Math.round(v)), x, area.y1 + 12, { align: 'center', color: C.muted, size: 10.5 }); }
        for (let h = 0; h <= HMAX; h += 5000) { const y = Y(h); c.beginPath(); c.moveTo(area.x0, y); c.lineTo(area.x1, y); c.stroke(); kit.label(c, (h / 1000) + ' km', area.x0 - 6, y, { align: 'right', color: C.muted, size: 10.5, baseline: 'middle' }); }
        kit.label(c, 'true airspeed (' + un() + ')', area.x1, st.H - 6, { align: 'right', color: C.text, size: 11.5, weight: 600 });
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.strokeRect(area.x0, area.y0, area.x1 - area.x0, area.y1 - area.y0);
        c.save(); c.beginPath(); c.rect(area.x0, area.y0, area.x1 - area.x0, area.y1 - area.y0); c.clip();
        if (V.show !== 'q') {
          for (const M of MACHS) {
            c.strokeStyle = M === 1 ? C.bad : kit.hue(215, 0.75); c.lineWidth = M === 1 ? 2 : 1.3;
            c.beginPath(); col.forEach((s, i) => { const x = X(M * s.a), y = Y(s.h); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
            const top = col[col.length - 1];
            if (M * top.a < VMAX) kit.label(c, 'M ' + M, X(M * top.a) + 3, area.y0 + 10, { align: 'left', color: M === 1 ? C.bad : kit.hue(215), size: 11, weight: 700 });
          }
        }
        if (V.show !== 'mach') {
          c.setLineDash([6, 4]);
          for (const q of QS) {
            c.strokeStyle = kit.hue(28, 0.85); c.lineWidth = 1.3;
            c.beginPath(); col.forEach((s, i) => { const x = X(Math.sqrt(2 * q * 1000 / s.rho)), y = Y(s.h); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
            // label each line where it crosses 19 km, or where it leaves the chart
            let lab = col.find(s => s.h >= 19000);
            const vx = s => Math.sqrt(2 * q * 1000 / s.rho);
            if (vx(lab) > VMAX * 0.94) lab = col.slice().reverse().find(s => vx(s) <= VMAX * 0.94);
            if (lab) kit.label(c, 'q = ' + q + ' kPa', X(vx(lab)) + 4, Y(lab.h), { align: 'left', color: kit.hue(28), size: 10.5, weight: 700, bg: C.bg2 });
          }
          c.setLineDash([]);
        }
        // the tropopause
        c.strokeStyle = C.faint; c.setLineDash([2, 4]); c.beginPath(); c.moveTo(area.x0, Y(11000)); c.lineTo(area.x1, Y(11000)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'tropopause', area.x1 - 4, Y(11000) - 7, { align: 'right', color: C.muted, size: 10 });
        // aircraft (typical, rounded)
        for (const cr of CRAFT) {
          const x = X(cr[0]), y = Y(cr[1]), right = x < area.x1 - 90;
          kit.dot(c, x, y, 3.5, C.text);
          kit.label(c, cr[2], right ? x + 6 : x - 6, y - 7, { align: right ? 'left' : 'right', color: C.muted, size: 10.5 });
        }
        // the chosen point
        const px = X(V.V), py = Y(V.h);
        c.strokeStyle = C.warn; c.lineWidth = 1; c.setLineDash([3, 3]);
        c.beginPath(); c.moveTo(px, area.y1); c.lineTo(px, py); c.lineTo(area.x0, py); c.stroke(); c.setLineDash([]);
        kit.dot(c, px, py, 6.5, C.warn, C.surface);
        c.restore();
        // read-outs
        const air = F.isa(V.h), M = V.V / air.a, q = 0.5 * air.rho * V.V * V.V, T0 = air.T * (1 + 0.2 * M * M);
        ro.set('tas', V.V + ' m/s = ' + (V.V / KT).toFixed(0) + ' kt = ' + (V.V * 3.6).toFixed(0) + ' km/h');
        ro.set('alt', V.h + ' m (' + Math.round(V.h / 0.3048) + ' ft)');
        ro.set('T', (air.T - 273.15).toFixed(1) + ' °C');
        ro.set('p', (air.p / 100).toFixed(1) + ' hPa');
        ro.set('rho', air.rho.toFixed(4) + ' kg/m³ (σ = ' + (air.rho / 1.225).toFixed(3) + ')');
        ro.set('a', air.a.toFixed(1) + ' m/s (' + (air.a / KT).toFixed(0) + ' kt)');
        ro.set('M', M.toFixed(3) + ' — ' + (M < 0.3 ? 'incompressible' : M < 0.8 ? 'subsonic' : M < 1.2 ? 'transonic' : M < 5 ? 'supersonic' : 'hypersonic'));
        ro.set('q', kit.fmt(q / 1000, 3) + ' kPa');
        ro.set('eas', (V.V * Math.sqrt(air.rho / 1.225) / KT).toFixed(0) + ' kt');
        ro.set('re', kit.fmt(V.V / air.nu, 3) + ' per metre');
        ro.set('T0', (T0 - 273.15).toFixed(0) + ' °C (' + f0(T0 - air.T, 0) + ' K above the air)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
