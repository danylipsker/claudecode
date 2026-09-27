/* HYPER-AERODYNAMICS · sims/performance.js — Flight Performance simulations
 *   perf-drag-curve  thrust / power required against speed, with the engines' available thrust or power,
 *                    the best speeds marked, at any height (standard atmosphere) and weight
 *   perf-turn        a level turn from above and from behind: bank → load factor, radius, rate, stall speed
 *   perf-vn          the V–n diagram of a light aircraft with manoeuvre and gust lines, and a g-meter
 *   perf-glide       a sailplane's glide over the ground, its polar and the tangent that gives the speed to fly
 *   perf-climb       a climb to the ceiling: maximum rate of climb against height, V_y and V_x, hot days
 *   perf-breguet     a jet's cruise with the Breguet equation: range against fuel fraction, flown step by step
 *   perf-takeoff     a takeoff run integrated in time: density altitude, weight, wind and runway surface
 *   perf-energy      a point-mass light aircraft with throttle and elevator: energy height and the phugoid
 * The aircraft are those of content/performance.js (parabolic polar C_D = C_D0 + k C_L²). */
(function () {
  'use strict';
  const G = 9.80665, KT = 1852 / 3600, FPM = 0.00508, D2R = Math.PI / 180, RAIR = 287.058;

  /* ---------------------------------------------------------------- the example aircraft */
  // light aircraft: 160 hp normally aspirated piston engine, fixed-pitch propeller (efficiency rising to 0.75 at 70 m/s)
  const LIGHT = { id: 'light', m: 1100, S: 16.2, AR: 7.5, e: 0.8, CD0: 0.03, CLmax: 1.5, nmax: 3.8, kind: 'prop', P0: 119000, etaMax: 0.75, Veta: 70 };
  // airliner: two 120 kN turbofans; above Mach 0.72 a compressibility drag rise (Lock's fourth-power rule)
  const JET = { id: 'jet', m: 70000, S: 122.6, AR: 9.5, e: 0.8, CD0: 0.02, CLmax: 1.5, nmax: 2.5, kind: 'jet', T0: 240000, Mcr: 0.72 };
  const kOf = c => 1 / (Math.PI * c.e * c.AR);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  // the standard atmosphere, optionally warmer or colder than standard at the same pressure
  function airAt(F, h, dT) {
    const a = F.isa(clamp(h, -1000, 20000));
    if (!dT) return a;
    const T = a.T + dT, rho = a.p / (RAIR * T);
    return { T, p: a.p, rho, a: Math.sqrt(1.4 * RAIR * T), h };
  }
  function densityAltitude(F, rho) {
    let lo = -3000, hi = 20000;
    for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; if (F.isa(mid).rho > rho) lo = mid; else hi = mid; }
    return (lo + hi) / 2;
  }
  const lapse = sigma => Math.max(0, 1.132 * sigma - 0.132);           // piston power vs density ratio (Gagg–Ferrar)
  // full-throttle thrust (N) at true airspeed V (m/s) in air A
  function thrustAv(c, V, A) {
    V = Math.max(0, V);
    if (c.kind === 'prop') {
      const P = c.P0 * lapse(A.rho / 1.225);
      // efficiency η = η_max (1 − (1 − V/V_η)²) below V_η, so the thrust ηP/V stays finite at rest
      return V < c.Veta ? P * c.etaMax * (2 / c.Veta - V / (c.Veta * c.Veta)) : P * c.etaMax / V;
    }
    const M = V / A.a;                                                   // high-bypass turbofan thrust lapse
    return c.T0 * (A.p / 101325) * Math.pow(1 + 0.2 * M * M, 3.5) * Math.max(0, 1 - 0.49 * Math.sqrt(M));
  }
  // level-flight drag (or at load factor n) with the parabolic polar
  function dragAt(c, V, A, m, n) {
    V = Math.max(1, V);
    const W = m * G * (n == null ? 1 : n), q = 0.5 * A.rho * V * V, CL = W / (q * c.S);
    let cdw = 0;
    if (c.kind === 'jet') { const M = V / A.a; if (M > c.Mcr) cdw = 20 * Math.pow(M - c.Mcr, 4); }
    const Dp = q * c.S * (c.CD0 + cdw), Di = q * c.S * kOf(c) * CL * CL;
    return { q, CL, Dp, Di, D: Dp + Di, M: V / A.a };
  }
  const stallV = (c, m, rho, n) => Math.sqrt(2 * m * G * (n || 1) / (rho * c.S * c.CLmax));
  const fmtN = N => Math.abs(N) < 10000 ? N.toFixed(0) + ' N' : (N / 1000).toFixed(1) + ' kN';
  const fmtP = Pw => Math.abs(Pw) < 1e6 ? (Pw / 1000).toFixed(1) + ' kW' : (Pw / 1e6).toFixed(2) + ' MW';
  const fmtL = m => !isFinite(m) ? '—' : Math.abs(m) < 2000 ? m.toFixed(0) + ' m' : (m / 1000).toFixed(m < 20000 ? 2 : 1) + ' km';
  const fpm = v => (v / FPM).toFixed(0) + ' ft/min';

  /* ---------------------------------------------------------------- drawing helpers */
  function sky(c, st, C) {
    const g = c.createLinearGradient(0, 0, 0, st.H);
    g.addColorStop(0, C.dark ? 'hsl(210 45% 16%)' : 'hsl(205 70% 88%)');
    g.addColorStop(1, C.dark ? 'hsl(210 35% 10%)' : 'hsl(205 60% 96%)');
    c.fillStyle = g; c.fillRect(0, 0, st.W, st.H);
  }
  function cloud(c, x, y, r, C) {
    c.fillStyle = C.dark ? 'hsl(210 30% 40% / 0.35)' : 'hsl(0 0% 100% / 0.85)';
    c.beginPath(); c.arc(x, y, r, 0, 7); c.arc(x + r * 0.9, y + r * 0.2, r * 0.75, 0, 7); c.arc(x - r * 0.9, y + r * 0.25, r * 0.7, 0, 7); c.fill();
  }
  // an aircraft seen from the side, nose to the right, pitched up by ang (rad); s = 1 is about 240 px long
  function planeSide(c, x, y, ang, s, C, kind) {
    c.save(); c.translate(x, y); c.rotate(-ang); c.scale(s, s);
    c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6 / s;
    c.beginPath(); c.moveTo(-120, -4); c.bezierCurveTo(-100, -18, 60, -16, 110, -6); c.lineTo(118, 2); c.bezierCurveTo(60, 10, -90, 10, -120, 4); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-100, -4); c.lineTo(-122, -38); c.lineTo(-108, -38); c.lineTo(-86, -6); c.closePath(); c.fill(); c.stroke();
    c.fillStyle = C.accent;
    if (kind === 'glider') { c.beginPath(); c.ellipse(20, -9, 60, 3.5, 0, 0, Math.PI * 2); c.fill(); }
    else if (kind === 'jet') { c.beginPath(); c.ellipse(-5, 3, 46, 5, 0, 0, Math.PI * 2); c.fill(); c.fillStyle = C.muted; c.beginPath(); c.ellipse(8, 14, 22, 6.5, 0, 0, Math.PI * 2); c.fill(); }
    else { c.beginPath(); c.ellipse(10, -12, 44, 5, 0, 0, Math.PI * 2); c.fill(); c.strokeStyle = C.muted; c.lineWidth = 4 / s; c.beginPath(); c.moveTo(122, -24); c.lineTo(122, 26); c.stroke(); }
    c.restore();
  }
  // an aircraft seen from above, heading hdg (rad, canvas angle)
  function planeTop(c, x, y, hdg, s, C, col) {
    c.save(); c.translate(x, y); c.rotate(hdg); c.scale(s, s);
    c.fillStyle = col || C.accent; c.strokeStyle = C.text; c.lineWidth = 1 / s;
    c.beginPath(); c.moveTo(16, 0); c.lineTo(10, -2.5); c.lineTo(-14, -2); c.lineTo(-14, 2); c.lineTo(10, 2.5); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(4, -2); c.lineTo(0, -18); c.lineTo(-4, -18); c.lineTo(-3, -2); c.moveTo(4, 2); c.lineTo(0, 18); c.lineTo(-4, 18); c.lineTo(-3, 2); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-10, -1); c.lineTo(-13, -7); c.lineTo(-15, -7); c.lineTo(-14, 0); c.lineTo(-15, 7); c.lineTo(-13, 7); c.lineTo(-10, 1); c.fill();
    c.restore();
  }
  function graphDiv(box) { const d = document.createElement('div'); d.style.padding = '4px 10px 10px'; box.stage.appendChild(d); return d; }

  /* ================================================================ perf-drag-curve */
  Hyper.sim('perf-drag-curve', {
    title: 'Thrust and power required',
    blurb: `The drag of an aircraft in level flight, $D = \\tfrac12\\rho V^2 S C_{D,0} + 2kW^2/(\\rho V^2 S)$, against what its engines can give at full throttle, with the air from the standard atmosphere. The light aircraft has a 119 kW (160 hp) piston engine and a fixed-pitch propeller; the airliner two 120 kN turbofans whose thrust falls with height and Mach number. Above Mach 0.72 the airliner's drag also rises with compressibility (Lock's fourth-power rule), which the parabolic polar leaves out.

**Try this**
- Light aircraft at sea level: find the bottom of the drag curve (about 74 kt, the minimum-drag speed). 58 kt and 97 kt need almost the same thrust. Switch the plot to **Power**: its minimum is lower, near 56 kt.
- Raise the speed until the throttle reads 100 %: that is the maximum level speed, about 125 kt.
- Climb in steps to 5000 m and beyond. The thrust curve slides to the right without getting deeper, the engine weakens, and the gap between the curves — the climb — closes: the ceiling.
- Airliner at 11 000 m: the engines give only a little more than the minimum drag. Make it lighter and the margin grows; make it heavier and it cannot hold this height.
- Fly slower than the minimum-power speed: the scene says "back side" — there, slower needs more power.`,
    mount(box, kit, params) {
      params = params || {};
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190 });
      const gb = graphDiv(box);
      const jet0 = params.craft === 'jet';
      const ctl = kit.controls(box.side, [
        { id: 'craft', type: 'select', label: 'Aircraft', options: [['Light aircraft (1100 kg, 160 hp)', 'light'], ['Airliner (70 t, two turbofans)', 'jet']], value: jet0 ? 'jet' : 'light' },
        { id: 'show', type: 'select', label: 'Plot', options: [['Thrust and drag (force)', 'T'], ['Power', 'P']], value: params.show === 'P' ? 'P' : 'T' },
        { id: 'vl', label: 'True airspeed', min: 45, max: 150, step: 1, value: 90, unit: 'kt' },
        { id: 'vj', label: 'True airspeed', min: 150, max: 540, step: 2, value: 450, unit: 'kt' },
        { id: 'h', label: 'Altitude', min: 0, max: 13000, step: 100, value: jet0 ? 11000 : 0, unit: 'm' },
        { id: 'mp', label: 'Mass, % of the example aircraft', min: 60, max: 110, step: 1, value: 100, unit: '%' },
        { id: 'parts', type: 'check', label: 'Show the parasite and induced parts', value: true }
      ], (id, v) => { if (id === 'craft') { ctl.set('h', v === 'jet' ? 11000 : 0); modes(); } update(); });
      const ro = kit.readout(box.side, [['air', 'Air density'], ['cl', 'C_L needed at this speed'], ['d', 'Drag = thrust required'], ['p', 'Power required (thrust power)'], ['thr', 'Throttle for level flight'], ['roc', 'At full throttle'], ['vmd', 'Minimum-drag speed'], ['vmp', 'Minimum-power speed'], ['vmax', 'Level flight possible'], ['vs', 'Stall speed (flaps up)']]);
      const plot = kit.plot(gb, { x: { label: 'true airspeed (kt)' }, y: { label: 'kN', min: 0 }, legend: true }, 230);
      const V = ctl.values;
      let S = null;
      const clouds = Array.from({ length: 7 }, () => ({ x: Math.random() * 1.2, y: 0.08 + 0.8 * Math.random(), s: 0.6 + 0.8 * Math.random() }));
      function modes() { const j = V.craft === 'jet'; ctl.show('vl', !j); ctl.show('vj', j); }
      function update() {
        const c = V.craft === 'jet' ? JET : LIGHT, j = c === JET, Pm = V.show === 'P';
        const A = F.isa(V.h), m = c.m * V.mp / 100, W = m * G;
        const vs = stallV(c, m, A.rho);
        const x0 = j ? 150 : 45, x1 = j ? 540 : 150;
        const vkt = j ? V.vj : V.vl, v = vkt * KT;
        const fy = Pm ? (j ? 1e-6 : 1e-3) : 1e-3;                     // kN, kW or MW
        const req = [], av = [], par = [], ind = [];
        let dmin = Infinity, vmd = NaN, pmin = Infinity, vmp = NaN, vlo = NaN, vhi = NaN, avMax = 0, yMin = Infinity;
        const N = 300;
        for (let i = 0; i <= N; i++) {
          const vk = x0 + (x1 - x0) * i / N, u = vk * KT, ta = thrustAv(c, u, A);
          const ya = (Pm ? ta * u : ta) * fy;
          av.push([vk, ya]); avMax = Math.max(avMax, ya);
          if (u < vs) { req.push([vk, NaN]); par.push([vk, NaN]); ind.push([vk, NaN]); continue; }
          const d = dragAt(c, u, A, m), mult = (Pm ? u : 1) * fy;
          req.push([vk, d.D * mult]); par.push([vk, d.Dp * mult]); ind.push([vk, d.Di * mult]);
          yMin = Math.min(yMin, d.D * mult);
          if (d.D < dmin) { dmin = d.D; vmd = vk; }
          if (d.D * u < pmin) { pmin = d.D * u; vmp = vk; }
          if (ta >= d.D) { if (!isFinite(vlo)) vlo = vk; vhi = vk; }
        }
        const beyond = isFinite(vhi) && vhi >= x1 - 1e-9;
        // the speeds, finer
        const dNow = dragAt(c, Math.max(v, 1), A, m), tNow = thrustAv(c, v, A), stalled = v < vs;
        const yReqAt = vk => { const u = vk * KT, d = dragAt(c, u, A, m); return d.D * (Pm ? u : 1) * fy; };
        const ymax = isFinite(yMin) ? 1.1 * Math.max((Pm ? 3 : 2.2) * yMin, Math.min(avMax, (Pm ? 8 : 6) * yMin)) : undefined;
        const marks = [];
        if (isFinite(vmd)) marks.push({ x: vmd, y: yReqAt(vmd), label: 'V_md', color: kit.colors().ok });
        if (isFinite(vmp)) marks.push({ x: vmp, y: yReqAt(vmp), label: 'V_mp', color: kit.colors().warn });
        if (!stalled) marks.push({ x: vkt, y: yReqAt(vkt), label: 'now' });
        const series = [{ pts: req, label: Pm ? 'power required' : 'drag = thrust required', width: 2.6 }, { pts: av, label: Pm ? 'power available, full throttle' : 'thrust available, full throttle' }];
        if (V.parts) series.push({ pts: par, label: 'parasite part', dash: [6, 4], width: 1.6 }, { pts: ind, label: 'induced part', dash: [2, 4], width: 1.6 });
        const vl = [{ x: vs / KT, label: 'stall' }];
        if (isFinite(vhi) && !beyond) vl.push({ x: vhi, label: 'max level speed' });
        plot.set({ series, marks, vlines: vl, x: { label: 'true airspeed (kt)', min: x0, max: x1 }, y: { label: Pm ? (j ? 'power (MW)' : 'power (kW)') : 'thrust, drag (kN)', min: 0, max: ymax } });
        // read-outs
        const sig = A.rho / 1.225;
        ro.set('air', A.rho.toFixed(3) + ' kg/m³ (σ = ' + sig.toFixed(3) + ')');
        ro.set('cl', stalled ? 'more than C_L,max = 1.5: below the stall speed' : dNow.CL.toFixed(3) + (j ? '  (Mach ' + dNow.M.toFixed(2) + ')' : ''));
        ro.set('d', stalled ? '—' : fmtN(dNow.D) + ' = ' + fmtN(dNow.Dp) + ' parasite + ' + fmtN(dNow.Di) + ' induced');
        ro.set('p', stalled ? '—' : fmtP(dNow.D * v));
        const ratio = tNow > 0 ? dNow.D / tNow : Infinity;
        ro.set('thr', stalled ? '—' : !isFinite(ratio) ? 'no thrust available' : ratio <= 1 ? (100 * ratio).toFixed(0) + ' %' : 'over 100 % — not enough thrust');
        const roc = (tNow - dNow.D) * v / W;
        ro.set('roc', stalled ? '—' : roc >= 0 ? 'climbs at ' + fpm(roc) + ' (' + roc.toFixed(1) + ' m/s)' : 'sinks at ' + fpm(-roc) + ' — cannot hold height');
        const eas = vk => (vk * Math.sqrt(sig)).toFixed(0);
        ro.set('vmd', isFinite(vmd) ? vmd.toFixed(0) + ' kt TAS (' + eas(vmd) + ' kt EAS), drag ' + fmtN(dmin) : '—');
        ro.set('vmp', isFinite(vmp) ? vmp.toFixed(0) + ' kt TAS (' + eas(vmp) + ' kt EAS), ' + fmtP(pmin) : '—');
        ro.set('vmax', !isFinite(vlo) ? 'nowhere — above the ceiling at this weight' : (vlo <= vs / KT + 1 ? 'from the stall' : 'from ' + vlo.toFixed(0) + ' kt') + ' to ' + (beyond ? 'beyond ' + x1 + ' kt (in practice capped by V_MO)' : vhi.toFixed(0) + ' kt'));
        ro.set('vs', (vs / KT).toFixed(0) + ' kt TAS (' + eas(vs / KT) + ' kt EAS)');
        const a3d = 0.086, alpha = stalled ? 16 : clamp(dNow.CL / a3d - 2, -2, 16);
        S = { j, v, W, L: stalled ? W * 0.8 : W, D: dNow.D, Dp: dNow.Dp, Di: dNow.Di, T: Math.min(dNow.D, tNow), short: ratio > 1, stalled, alpha, back: !stalled && isFinite(vmp) && vkt < vmp - 0.5, Pm };
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors();
        sky(c, st, C);
        if (!S) return;
        for (const k of clouds) {
          k.x -= dt * S.v / (S.j ? 1400 : 380) * k.s;
          if (k.x < -0.15) { k.x = 1.15; k.y = 0.08 + 0.8 * Math.random(); }
          cloud(c, k.x * st.W, k.y * st.H, 14 * k.s, C);
        }
        const cx = st.W * 0.42, cy = st.H * 0.52, s = Math.min(st.W, st.H * 2.6) / 1000;
        planeSide(c, cx, cy, S.alpha * D2R, s, C, S.j ? 'jet' : 'prop');
        const u = Math.min(st.H * 0.32, 60), k = u / S.W, f = 8 * k;
        kit.arrow(c, cx, cy, cx, cy - S.L * k, S.stalled ? C.warn : C.ok, 2.6);
        kit.arrow(c, cx, cy, cx, cy + S.W * k, C.bad, 2.6);
        const yd = cy + 4, xp = cx - S.Dp * f, xi = xp - S.Di * f;
        c.lineCap = 'butt';
        c.strokeStyle = C.series[2]; c.lineWidth = 5; c.beginPath(); c.moveTo(cx, yd); c.lineTo(xp, yd); c.stroke();
        c.strokeStyle = C.series[4]; c.beginPath(); c.moveTo(xp, yd); c.lineTo(xi, yd); c.stroke();
        kit.arrow(c, xi + 2, yd, xi - 6, yd, C.warn, 3);
        const xt = cx + 30 * s * 4;
        kit.arrow(c, xt, cy - 2, xt + S.T * f, cy - 2, S.short ? C.bad : C.accent, 3);
        kit.label(c, 'lift', cx + 8, cy - S.L * k + 6, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'weight', cx + 8, cy + S.W * k - 6, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'drag: parasite + induced', Math.max(8, xi - 6), yd + 16, { color: C.text, size: 12 });
        kit.label(c, S.short ? 'thrust: all there is' : 'thrust', xt + S.T * f + 6, cy - 2, { color: S.short ? C.bad : C.text, size: 12, weight: 700 });
        kit.label(c, 'thrust and drag drawn 8 × larger than lift and weight', 10, st.H - 12, { color: C.muted, size: 11 });
        const msg = S.stalled ? 'below the stall speed — no level flight here' : S.short ? 'drag exceeds the thrust available: it slows or sinks' : S.back ? 'back side of the power curve: slower needs more power' : 'front side: faster needs more power';
        kit.label(c, msg, st.W - 10, 16, { align: 'right', color: S.stalled || S.short ? C.bad : S.back ? C.warn : C.text, size: 12.5, weight: 700 });
      }, box.stage);
      modes();
      update();
      loop.start();
    }
  });

  /* ================================================================ perf-turn */
  Hyper.sim('perf-turn', {
    title: 'Turning flight',
    blurb: `A level, coordinated turn of the light aircraft at sea level, seen from above (left, drawn to the scale bar) and from behind (right). The lift is tilted by the bank angle; its vertical part carries the weight and its horizontal part is the centripetal force. The aircraft circles at the true rate of turn.

**Try this**
- Bank 30°, then 60°: the load factor goes from 1.15 to 2, the stall speed rises by 41 %, and the radius shrinks to a third.
- At 60° of bank, slow down until the status says *stall*: the wing cannot make twice the weight in lift at that speed.
- Keep the bank and double the speed: the circle becomes four times larger and the turn half as fast.
- Change the mass: the radius and rate do not change at all — only the stall speed does.
- Find the tightest turn the aircraft can fly without stalling or exceeding +3.8 g: it is at the corner speed, about 102 kt.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const gb = graphDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'phi', label: 'Bank angle φ', min: 0, max: 80, step: 1, value: 30, unit: '°' },
        { id: 'v', label: 'True airspeed', min: 50, max: 160, step: 1, value: 100, unit: 'kt' },
        { id: 'm', label: 'Mass', min: 750, max: 1150, step: 10, value: 1100, unit: 'kg' }
      ], () => update());
      const ro = kit.readout(box.side, [['n', 'Load factor n = 1/cos φ'], ['r', 'Turn radius'], ['w', 'Rate of turn'], ['t', 'Time for 360°'], ['vs', 'Stall speed in this turn'], ['di', 'Induced drag'], ['r1', 'Bank for a rate-one turn here'], ['st', 'Status']]);
      const plot = kit.plot(gb, { x: { label: 'bank angle φ (°)', min: 0, max: 80 }, y: { label: 'load factor n', min: 0, max: 6 } }, 190);
      const V = ctl.values, c = LIGHT;
      let S = null, psi = -Math.PI / 2, sx = 0;
      function update() {
        const C = kit.colors();
        const phi = V.phi * D2R, v = V.v * KT, W = V.m * G;
        const n = 1 / Math.cos(phi), tp = Math.tan(phi);
        const r = tp > 1e-3 ? v * v / (G * tp) : Infinity, w = G * tp / v;
        const vs1 = stallV(c, V.m, 1.225), vsn = vs1 * Math.sqrt(n);
        const stalled = v < vsn, over = n > c.nmax;
        S = { phi, v, n, r, w, W, stalled, over };
        ro.set('n', n.toFixed(2) + ' — everyone on board feels ' + n.toFixed(2) + ' g');
        ro.set('r', isFinite(r) ? fmtL(r) : 'straight flight');
        ro.set('w', (w / D2R).toFixed(1) + ' °/s');
        ro.set('t', w > 1e-4 ? (2 * Math.PI / w).toFixed(0) + ' s' : '—');
        ro.set('vs', (vsn / KT).toFixed(0) + ' kt (wings level ' + (vs1 / KT).toFixed(0) + ' kt)');
        ro.set('di', '× ' + (n * n).toFixed(2) + ' of its wings-level value');
        ro.set('r1', (Math.atan(3 * D2R * v / G) / D2R).toFixed(1) + '° of bank');
        ro.set('st', stalled ? 'STALL — the wing cannot make ' + n.toFixed(2) + ' × the weight at this speed' : over ? 'over the +3.8 limit load factor' : 'flyable: ' + ((v / vsn - 1) * 100).toFixed(0) + ' % above the stall');
        const curve = [];
        for (let a = 0; a <= 80; a += 1) curve.push([a, 1 / Math.cos(a * D2R)]);
        const nst = (v / vs1) * (v / vs1);
        plot.set({ series: [{ pts: curve, label: 'n = 1/cos φ' }], hlines: [{ y: nst, label: 'stall limit at ' + V.v + ' kt: (V/V_s)² = ' + nst.toFixed(2), color: C.warn }, { y: c.nmax, label: 'limit load factor +3.8', color: C.bad }], marks: [{ x: V.phi, y: n, label: 'now', color: stalled || over ? C.bad : C.accent }] });
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        const W2 = st.W * 0.56, H = st.H;
        // ---- from above
        const cx = W2 / 2, cy = H / 2 + 6, R = Math.min(W2, H) * 0.36;
        kit.label(c, 'from above', 12, 14, { color: C.muted, size: 12 });
        if (isFinite(S.r)) {
          psi = (psi + S.w * dt) % (2 * Math.PI);
          c.strokeStyle = C.faint; c.lineWidth = 1.2; c.setLineDash([4, 5]); c.beginPath(); c.arc(cx, cy, R, 0, 2 * Math.PI); c.stroke(); c.setLineDash([]);
          c.strokeStyle = C.accent; c.lineWidth = 2.5; c.beginPath(); c.arc(cx, cy, R, psi - 1.6, psi); c.stroke();
          kit.dot(c, cx, cy, 3, C.muted);
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + R * Math.cos(psi), cy + R * Math.sin(psi)); c.stroke();
          kit.label(c, 'r = ' + fmtL(S.r), cx, cy + 14, { align: 'center', color: C.text, size: 12, weight: 700 });
          planeTop(c, cx + R * Math.cos(psi), cy + R * Math.sin(psi), psi + Math.PI / 2, Math.max(0.8, R / 90), C, S.stalled ? C.bad : C.accent);
          // scale bar
          const pxm = R / S.r, steps = [5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000, 10000, 20000];
          let len = steps[0];
          for (const sL of steps) if (sL * pxm <= W2 * 0.35) len = sL;
          const bx = 14, by = H - 16;
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, by - 4); c.lineTo(bx, by); c.lineTo(bx + len * pxm, by); c.lineTo(bx + len * pxm, by - 4); c.stroke();
          kit.label(c, fmtL(len), bx + len * pxm / 2, by - 10, { align: 'center', color: C.text, size: 11 });
        } else {
          sx = (sx + dt * S.v * 1.2) % (W2 + 60);
          c.strokeStyle = C.faint; c.setLineDash([4, 5]); c.beginPath(); c.moveTo(0, cy); c.lineTo(W2, cy); c.stroke(); c.setLineDash([]);
          planeTop(c, sx - 30, cy, 0, 1.2, C);
          kit.label(c, 'wings level: straight flight', cx, cy + 28, { align: 'center', color: C.text, size: 12 });
        }
        // ---- from behind
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(W2, 0); c.lineTo(W2, H); c.stroke();
        const rx = W2 + (st.W - W2) * 0.42, ry = H * 0.56, u = Math.min(H * 0.17, 44);
        kit.label(c, 'from behind', W2 + 10, 14, { color: C.muted, size: 12 });
        c.strokeStyle = C.faint; c.setLineDash([3, 5]); c.beginPath(); c.moveTo(W2 + 8, ry); c.lineTo(st.W - 8, ry); c.stroke(); c.setLineDash([]);
        c.save(); c.translate(rx, ry); c.rotate(S.phi);
        c.fillStyle = C.accent; c.fillRect(-u * 1.9, -2.5, u * 3.8, 5);
        c.fillStyle = C.muted; c.fillRect(-u * 0.6, -u * 0.34, u * 1.2, 3);
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.beginPath(); c.moveTo(0, -8); c.lineTo(0, -u * 0.62); c.stroke();
        c.fillStyle = C.surface; c.lineWidth = 1.6; c.beginPath(); c.arc(0, 0, 9, 0, 7); c.fill(); c.stroke();
        c.restore();
        const sp = Math.sin(S.phi), cp = Math.cos(S.phi), Lp = Math.min(u * S.n, (st.W - rx - 14) / Math.max(sp, 0.01), (ry - 12) / Math.max(cp, 0.01));
        kit.arrow(c, rx, ry, rx + Lp * sp, ry - Lp * cp, S.stalled ? C.warn : C.ok, 3);
        c.setLineDash([4, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.3;
        c.beginPath(); c.moveTo(rx + Lp * sp, ry - Lp * cp); c.lineTo(rx, ry - u); c.moveTo(rx + Lp * sp, ry - Lp * cp); c.lineTo(rx + Math.min(u * Math.tan(S.phi), st.W - rx - 12), ry); c.stroke(); c.setLineDash([]);
        kit.arrow(c, rx, ry, rx, ry - u, C.muted, 1.6);
        if (S.phi > 0.01) kit.arrow(c, rx, ry, rx + Math.min(u * Math.tan(S.phi), st.W - rx - 12), ry, C.accent, 1.8);
        kit.arrow(c, rx, ry, rx, ry + u, C.bad, 2.6);
        kit.label(c, 'lift = ' + S.n.toFixed(2) + ' W', rx + Lp * sp + 6, ry - Lp * cp - 8, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'weight', rx + 6, ry + u - 4, { color: C.text, size: 12 });
        if (S.phi > 0.05) kit.label(c, 'to the centre →', rx + 6, ry + 14, { color: C.accent, size: 11.5 });
        const msg = S.stalled ? 'STALL' : S.over ? 'over the limit load' : S.n.toFixed(2) + ' g';
        kit.label(c, msg, st.W - 10, H - 14, { align: 'right', color: S.stalled || S.over ? C.bad : C.text, size: 14, weight: 700 });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ perf-vn */
  Hyper.sim('perf-vn', {
    title: 'The V–n diagram',
    blurb: `The flight envelope of the light aircraft (16.2 m², $C_{L,\\max}$ = 1.5 up and about −0.8 inverted, design cruise speed $V_C$ = 128 kt, dive speed $V_D$ = 175 kt) with the certification gusts of 15.24 m/s at $V_C$ and 7.62 m/s at $V_D$. Move your own point — speed and load factor — and watch the wing and the g-meter.

**Try this**
- Put the point at 1 g and slide the speed down: the stall curve $n = (V/V_s)^2$ meets 1 g at the stall speed.
- At 90 kt, raise the load factor: the wing stalls before it reaches +3.8 g. At 120 kt it does not — the structure is the limit. The corner between is $V_A$.
- Lower the mass to 850 kg: $V_S$ and $V_A$ fall, and the gust lines get steeper — a light aircraft is shaken harder by the same gust.
- Compare the gust line at $V_C$ with the +3.8 line: for this lightly loaded aircraft the gust is the bigger load.
- Switch to the aerobatic category: +6 / −3, and the corner moves up to about 128 kt — the design cruising speed.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 170 });
      const gb = graphDiv(box);
      const CATS = { normal: [3.8, -1.52], utility: [4.4, -1.76], aerobatic: [6, -3] };
      const ctl = kit.controls(box.side, [
        { id: 'cat', type: 'select', label: 'Category', options: [['Normal (+3.8 / −1.52)', 'normal'], ['Utility (+4.4 / −1.76)', 'utility'], ['Aerobatic (+6 / −3)', 'aerobatic']], value: 'normal' },
        { id: 'm', label: 'Mass', min: 750, max: 1150, step: 10, value: 1100, unit: 'kg' },
        { id: 'h', label: 'Altitude (sets the gust factor)', min: 0, max: 4000, step: 100, value: 0, unit: 'm' },
        { id: 'gust', type: 'check', label: 'Show the gust lines', value: true },
        { id: 'v', label: 'Your equivalent airspeed', min: 0, max: 190, step: 1, value: 110, unit: 'kt' },
        { id: 'n', label: 'Your load factor', min: -3.5, max: 7, step: 0.05, value: 1 }
      ], () => update());
      const ro = kit.readout(box.side, [['vs', 'Stall speed V_S (1 g)'], ['va', 'Manoeuvring speed V_A'], ['vcd', 'Design speeds V_C / V_D / V_NE'], ['kg', 'Gust alleviation factor K_g'], ['gc', 'Gust load factor at V_C'], ['gd', 'Gust load factor at V_D'], ['nl', 'Most the wing can pull at your speed'], ['st', 'Your point']]);
      const plot = kit.plot(gb, { x: { label: 'equivalent airspeed (kt)', min: 0, max: 190 }, y: { label: 'load factor n', min: -4, max: 7.5 }, legend: true }, 280);
      const V = ctl.values, S0 = 16.2, CLmax = 1.5, CLneg = -0.8, VC = 128, VD = 175, a = 4.96, cbar = 1.47, rho0 = 1.225;
      let S = null, nd = 1;
      function update() {
        const C = kit.colors();
        const lim = CATS[V.cat] || CATS.normal, nmax = lim[0], nmin = lim[1];
        const ws = V.m * G / S0;
        const vs = Math.sqrt(2 * ws / (rho0 * CLmax)) / KT;
        const va = vs * Math.sqrt(nmax), vg = vs * Math.sqrt(nmin * CLmax / CLneg);
        const env = [];
        for (let i = 0; i <= 60; i++) { const v = va * i / 60; env.push([v, (v / vs) * (v / vs)]); }
        env.push([VD, nmax], [VD, 0], [VC, nmin], [vg, nmin]);
        for (let i = 50; i >= 0; i--) { const v = vg * i / 50; env.push([v, (CLneg / CLmax) * (v / vs) * (v / vs)]); }
        const rho = F.isa(V.h).rho, mu = 2 * ws / (rho * cbar * a * G), Kg = 0.88 * mu / (5.3 + mu);
        const dn = (U, vkt) => rho0 * U * vkt * KT * a * Kg / (2 * ws);
        const gC = dn(15.24, VC), gD = dn(7.62, VD);
        const series = [{ pts: env, label: 'manoeuvre envelope', width: 2.6 }];
        if (V.gust) series.push({ pts: [[0, 1], [VC, 1 + gC], [NaN, NaN], [0, 1], [VC, 1 - gC], [NaN, NaN], [0, 1], [VD, 1 + gD], [NaN, NaN], [0, 1], [VD, 1 - gD], [NaN, NaN], [VC, 1 + gC], [VD, 1 + gD], [VD, 1 - gD], [VC, 1 - gC]], label: 'gust lines', dash: [5, 4], width: 1.6 });
        // the point
        const v = V.v, n = V.n, q = (v / vs) * (v / vs);
        const nNeg = (CLneg / CLmax) * q, nNegS = v <= VC ? nmin : nmin * (VD - v) / (VD - VC);
        let status, bad = 0;
        if (v > VD) { status = 'faster than the design dive speed V_D'; bad = 2; }
        else if (n > q || n < nNeg) { status = 'beyond the stall: the wing cannot make this much lift at ' + v + ' kt'; bad = 1; }
        else if (n > nmax || n < nNegS) { status = 'beyond the limit load: the structure may be damaged'; bad = 2; }
        else status = 'inside the envelope';
        S = { n, nmax, nmin, bad };
        plot.set({ series, marks: [{ x: va, y: nmax, label: 'V_A', color: C.warn }, { x: v, y: n, label: 'you', color: bad ? C.bad : C.ok }],
          vlines: [{ x: vs, label: 'V_S' }, { x: VC, label: 'V_C' }, { x: VD, label: 'V_D' }], hlines: [{ y: 1 }] });
        ro.set('vs', vs.toFixed(0) + ' kt');
        ro.set('va', va.toFixed(0) + ' kt (V_S × √' + nmax + ')');
        ro.set('vcd', VC + ' / ' + VD + ' / ' + (0.9 * VD).toFixed(0) + ' kt');
        ro.set('kg', Kg.toFixed(2) + ' (mass ratio μ = ' + mu.toFixed(1) + ')');
        ro.set('gc', (1 + gC).toFixed(2) + ' up, ' + (1 - gC).toFixed(2) + ' down' + (1 + gC > nmax ? ' — beyond the manoeuvre limit' : ''));
        ro.set('gd', (1 + gD).toFixed(2) + ' up, ' + (1 - gD).toFixed(2) + ' down');
        ro.set('nl', v > 0 ? '+' + Math.min(q, 99).toFixed(2) + ' / ' + Math.max(nNeg, -99).toFixed(2) + ' before stalling' : '—');
        ro.set('st', status);
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        nd += (S.n - nd) * Math.min(1, dt * 6 + (dt === 0 ? 1 : 0));
        const H = st.H, cx = st.W * 0.33, cy = H * 0.55, span = Math.min(st.W * 0.28, 170);
        const col = S.bad === 2 ? C.bad : S.bad === 1 ? C.warn : C.accent;
        // the wing bends with the load
        const d = clamp(nd, -4, 8) * Math.min(6, H / 30);
        c.strokeStyle = col; c.lineWidth = 6; c.lineCap = 'round';
        c.beginPath(); c.moveTo(cx - span, cy - d); c.quadraticCurveTo(cx - span * 0.45, cy, cx, cy); c.quadraticCurveTo(cx + span * 0.45, cy, cx + span, cy - d); c.stroke();
        c.lineCap = 'butt';
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.arc(cx, cy + 4, 13, 0, 7); c.fill(); c.stroke();
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.beginPath(); c.moveTo(cx, cy - 8); c.lineTo(cx, cy - 36); c.stroke();
        kit.label(c, 'wing loaded to ' + nd.toFixed(2) + ' × its 1 g load', cx, H - 12, { align: 'center', color: C.muted, size: 11.5 });
        kit.arrow(c, cx, cy - 40, cx, cy - 40 - clamp(nd, -3, 7) * 7, col, 2.4);
        // g-meter
        const gx = st.W * 0.78, gy = H * 0.52, R = Math.min(H * 0.38, 70);
        const ang = n => (135 + (clamp(n, -4, 8) + 4) / 12 * 270) * D2R;
        c.lineWidth = 7;
        c.strokeStyle = C.ok; c.beginPath(); c.arc(gx, gy, R, ang(S.nmin), ang(S.nmax)); c.stroke();
        c.strokeStyle = C.bad; c.beginPath(); c.arc(gx, gy, R, ang(-4), ang(S.nmin)); c.stroke(); c.beginPath(); c.arc(gx, gy, R, ang(S.nmax), ang(8)); c.stroke();
        c.strokeStyle = C.text; c.lineWidth = 1.3;
        for (let k = -4; k <= 8; k++) {
          const t = ang(k), r1 = R - 12, r2 = R - (k % 2 === 0 ? 20 : 16);
          c.beginPath(); c.moveTo(gx + r1 * Math.cos(t), gy + r1 * Math.sin(t)); c.lineTo(gx + r2 * Math.cos(t), gy + r2 * Math.sin(t)); c.stroke();
          if (k % 2 === 0) kit.label(c, String(k), gx + (R - 30) * Math.cos(t), gy + (R - 30) * Math.sin(t), { align: 'center', color: C.muted, size: 10.5 });
        }
        const t = ang(nd);
        c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(gx, gy); c.lineTo(gx + (R - 8) * Math.cos(t), gy + (R - 8) * Math.sin(t)); c.stroke();
        kit.dot(c, gx, gy, 4, C.text);
        kit.label(c, nd.toFixed(2) + ' g', gx, gy + R * 0.55, { align: 'center', color: C.text, size: 13, weight: 700 });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ perf-glide */
  Hyper.sim('perf-glide', {
    title: 'Glide polar and speed to fly',
    blurb: `A standard-class sailplane (15 m span, 10.5 m², parabolic polar with a best glide of 42) glides from 1000 m. Above: its path over the ground. Below: its **glide polar** — sink rate against airspeed — with the tangent that gives the best speed to fly: drawn from the point on the speed axis shifted by the headwind, to the polar shifted down by the sinking air.

**Try this**
- Still air: press *Fly the best speed* — about 105 km/h, 42 km from 1000 m. Slower (80 km/h) sinks least but reaches less far.
- Add a 30 km/h headwind: the tangent starts at 30 km/h on the axis and touches the polar at about 115 km/h. Flying the still-air speed now costs distance.
- Make the air sink at 2 m/s: the polar drops and the best speed jumps above 150 km/h — get out of the bad air quickly.
- Add water ballast: the polar slides to higher speeds; the best glide ratio stays the same.
- Try a tailwind: the best speed falls and the glide over the ground gets longer.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 210 });
      const gb = graphDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'v', label: 'Airspeed', min: 70, max: 200, step: 1, value: 100, unit: 'km/h' },
        { id: 'u', label: 'Headwind (negative: tailwind)', min: -40, max: 60, step: 1, value: 0, unit: 'km/h' },
        { id: 'a', label: 'Air rising (+) or sinking (−)', min: -3, max: 0.5, step: 0.1, value: 0, unit: 'm/s' },
        { id: 'm', label: 'Mass with water ballast', min: 330, max: 525, step: 5, value: 400, unit: 'kg' },
        { type: 'buttons', items: [{ id: 'best', label: 'Fly the best speed', primary: true }, { id: 'go', label: 'Launch again' }] }
      ], id => { if (id === 'best' && S && isFinite(S.vb)) ctl.set('v', Math.round(S.vb)); if (id === 'best' || id === 'go') prog = 0; update(); });
      const ro = kit.readout(box.side, [['ld', 'Glide ratio through the air'], ['w', 'Sink rate'], ['gs', 'Ground speed'], ['gr', 'Glide ratio over the ground'], ['d', 'Reach from 1000 m'], ['t', 'Time to the ground'], ['best', 'Best speed to fly here'], ['still', 'Best glide in still air']]);
      const plot = kit.plot(gb, { x: { label: 'airspeed (km/h)' }, y: { label: 'vertical speed (m/s)' }, legend: true }, 220);
      const V = ctl.values, GL = { S: 10.5, AR: 21.4, e: 0.9, CD0: 0.0086 };
      const sink = (vk, m) => { const u = vk / 3.6, q = 0.5 * 1.225 * u * u, CL = m * G / (q * GL.S); return u * (GL.CD0 + CL * CL / (Math.PI * GL.e * GL.AR)) / CL; };
      let S = null, prog = 0, hold = 0;
      function update() {
        const C = kit.colors();
        const m = V.m, U = V.u, a = V.a, v = V.v;
        const w = sink(v, m), net = w - a;
        let vb = NaN, gbest = -Infinity, vmd = 0, ldmax = 0, wmin = Infinity, vms = 0;
        for (let vk = 60; vk <= 260; vk += 0.5) {
          const s = sink(vk, m), den = s - a, num = (vk - U) / 3.6;
          if (vk / 3.6 / s > ldmax) { ldmax = vk / 3.6 / s; vmd = vk; }
          if (s < wmin) { wmin = s; vms = vk; }
          if (den > 0 && num > 0 && num / den > gbest) { gbest = num / den; vb = vk; }
        }
        const climbs = a >= wmin;
        if (climbs) { vb = vms; gbest = Infinity; }
        const gr = net > 0 ? (v - U) / 3.6 / net : Infinity, d = 1000 * gr;
        S = { v, U, a, gr, d, db: 1000 * gbest, dstill: 1000 * ldmax, vb, net };
        ro.set('ld', (v / 3.6 / w).toFixed(1) + ' : 1');
        ro.set('w', w.toFixed(2) + ' m/s' + (a !== 0 ? ', ' + net.toFixed(2) + ' m/s relative to the ground' : ''));
        ro.set('gs', (v - U).toFixed(0) + ' km/h');
        ro.set('gr', isFinite(gr) ? gr.toFixed(1) + ' : 1' : 'the air rises faster than the glider sinks');
        ro.set('d', isFinite(d) ? fmtL(d) : 'as far as the rising air goes');
        ro.set('t', net > 0 ? (1000 / net / 60).toFixed(1) + ' min' : '—');
        ro.set('best', climbs ? 'circle at minimum sink (' + vms.toFixed(0) + ' km/h) and climb' : vb.toFixed(0) + ' km/h → ' + gbest.toFixed(1) + ' : 1, ' + fmtL(1000 * gbest));
        ro.set('still', ldmax.toFixed(1) + ' : 1 at ' + vmd.toFixed(0) + ' km/h; minimum sink ' + wmin.toFixed(2) + ' m/s at ' + vms.toFixed(0) + ' km/h');
        // the polar
        const pol = [], air = [];
        for (let vk = 60; vk <= 220; vk += 2) { const s = sink(vk, m); pol.push([vk, -s]); air.push([vk, a - s]); }
        const series = [{ pts: pol, label: 'glide polar (still air)', width: 2.4 }];
        if (a !== 0) series.push({ pts: air, label: 'polar in this air', dash: [6, 4] });
        if (!climbs && isFinite(vb)) {
          const yb = a - sink(vb, m), ext = 1.25;
          series.push({ pts: [[U, 0], [U + (vb - U) * ext, yb * ext]], label: 'tangent: best speed to fly', width: 1.6 });
        }
        series.push({ pts: [[U, 0], [v, a - w]], label: 'your glide', dash: [2, 4], width: 1.6 });
        const x0 = Math.min(50, U - 10);
        plot.set({ series, x: { label: 'airspeed (km/h)', min: x0, max: 220 }, y: { label: 'vertical speed (m/s)', min: Math.min(-3, a - sink(220, m) - 0.3), max: 1.2 },
          marks: [{ x: v, y: a - w, label: 'you' }].concat(!climbs && isFinite(vb) ? [{ x: vb, y: a - sink(vb, m), label: 'best', color: C.ok }] : []),
          hlines: [{ y: 0 }], vlines: U !== 0 ? [{ x: U, label: U > 0 ? 'headwind' : 'tailwind' }] : [] });
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors();
        sky(c, st, C);
        if (!S) return;
        const pl = 44, pr = 14, pt = 24, pb = 26, XM = 60;
        const X = km => pl + km / XM * (st.W - pl - pr), Y = hm => st.H - pb - hm / 1000 * (st.H - pt - pb);
        c.fillStyle = C.dark ? 'hsl(100 18% 17%)' : 'hsl(95 30% 80%)'; c.fillRect(0, Y(0), st.W, st.H - Y(0));
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.beginPath(); c.moveTo(pl, Y(0)); c.lineTo(st.W - pr, Y(0)); c.stroke();
        for (let k = 0; k <= XM; k += 10) { kit.label(c, k + ' km', X(k), st.H - 10, { align: 'center', color: C.muted, size: 10.5 }); c.beginPath(); c.moveTo(X(k), Y(0)); c.lineTo(X(k), Y(0) + 4); c.stroke(); }
        kit.label(c, '1000 m', 4, Y(1000), { color: C.muted, size: 10.5 });
        // moving air
        if (S.a !== 0) for (let i = 0; i < 9; i++) for (let j = 0; j < 3; j++) { const x = X(3 + i * 6.5), y = Y(200 + j * 300); kit.arrow(c, x, y, x, y - S.a * 9, C.faint, 1.2); }
        if (S.U !== 0) {
          for (let i = 0; i < 4; i++) { const x = X(20 + i * 10), y = pt + 14, L = clamp(Math.abs(S.U), 5, 60) * 0.6; kit.arrow(c, x + (S.U > 0 ? L / 2 : -L / 2), y, x - (S.U > 0 ? L / 2 : -L / 2), y, C.muted, 1.4); }
          kit.label(c, (S.U > 0 ? 'headwind ' : 'tailwind ') + Math.abs(S.U) + ' km/h', X(56), pt + 14, { align: 'right', color: C.muted, size: 11 });
        }
        const end = d => d / 1000 <= XM ? [X(d / 1000), Y(0)] : [X(XM), Y(1000 - XM * 1e6 / d)];
        const line = (d, col, dash, wid) => { const e = end(d); c.strokeStyle = col; c.lineWidth = wid; c.setLineDash(dash); c.beginPath(); c.moveTo(X(0), Y(1000)); c.lineTo(e[0], e[1]); c.stroke(); c.setLineDash([]); return e; };
        if (isFinite(S.dstill)) line(S.dstill, C.faint, [2, 5], 1.2);
        if (isFinite(S.db) && S.db > 0) line(S.db, C.ok, [6, 4], 1.5);
        const e = isFinite(S.d) ? line(S.d, C.accent, [], 2.2) : line(1e9, C.accent, [], 2.2);
        if (isFinite(S.d) && S.d / 1000 <= XM) kit.label(c, fmtL(S.d), e[0], e[1] - 12, { align: 'center', color: C.text, size: 12, weight: 700 });
        // the glider
        if (prog < 1) prog += dt / 9; else { hold += dt; if (hold > 1.5) { prog = 0; hold = 0; } }
        const p = clamp(prog, 0, 1), gx = X(0) + (e[0] - X(0)) * p, gy = Y(1000) + (e[1] - Y(1000)) * p;
        planeSide(c, gx, gy, -Math.atan2(e[1] - Y(1000), e[0] - X(0)), 0.14, C, 'glider');
        kit.label(c, 'heights exaggerated ×' + ((st.H - pt - pb) / 1000 / ((st.W - pl - pr) / (XM * 1000))).toFixed(0), st.W - pr, st.H - pb - 10, { align: 'right', color: C.muted, size: 10.5 });
        kit.label(c, 'your glide — best for these conditions (green dashes) — best in still air (dots)', pl, 12, { color: C.muted, size: 11 });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ perf-climb */
  Hyper.sim('perf-climb', {
    title: 'Climb to the ceiling',
    blurb: `The aircraft climbs at full power from sea level, always at its best-rate (or best-angle) speed for the height, with thrust and drag from the models of these pages and the air from the standard atmosphere — optionally warmer or colder at the same pressure. Time runs 40 times faster than real. The graph is the classic ceiling chart: the maximum rate of climb against height.

**Try this**
- Light aircraft: watch the climb flatten. The service ceiling (100 ft/min) is near 4700 m; the absolute ceiling, which it never quite reaches, near 5500 m.
- Make the day 30 °C hotter than standard: the whole curve moves down — the density-altitude effect.
- Climb at the best-angle speed instead: steeper, but less height per minute.
- Airliner: a fast climb low down, then the thrust lapse catches up near 11–12 km. Load it to 110 % and the ceiling drops; at 80 % it rises.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 210 });
      const gb = graphDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'craft', type: 'select', label: 'Aircraft', options: [['Light aircraft (160 hp piston)', 'light'], ['Airliner (two turbofans)', 'jet']], value: 'light' },
        { id: 'mp', label: 'Mass, % of the example aircraft', min: 70, max: 110, step: 1, value: 100, unit: '%' },
        { id: 'dT', label: 'Temperature above standard', min: -20, max: 30, step: 1, value: 0, unit: '°C' },
        { id: 'spd', type: 'select', label: 'Climb at', options: [['Best rate of climb, V_y', 'y'], ['Best angle of climb, V_x', 'x']], value: 'y' },
        { type: 'buttons', items: [{ id: 'go', label: 'Climb from sea level', primary: true }] }
      ], () => { build(); restart(); });
      const ro = kit.readout(box.side, [['h', 'Altitude'], ['roc', 'Rate of climb now'], ['v', 'Climb speed now'], ['g', 'Climb angle now'], ['t', 'Time since takeoff'], ['serv', 'Service ceiling (100 ft/min)'], ['abs', 'Absolute ceiling'], ['ts', 'Time to the service ceiling']]);
      const plot = kit.plot(gb, { x: { label: 'maximum rate of climb (ft/min)', min: 0 }, y: { label: 'altitude (m)', min: 0 }, legend: true }, 220);
      const V = ctl.values;
      let prof = [], P = null, fl = null, path = [];
      function crossing(key, level) {
        if (!prof.length || prof[0][key] < level) return 0;
        for (let i = 1; i < prof.length; i++) if (prof[i][key] < level) { const a = prof[i - 1], b = prof[i]; return a.h + (b.h - a.h) * (a[key] - level) / (a[key] - b[key]); }
        return Infinity;
      }
      function at(h) {
        const dh = prof[1].h - prof[0].h, i = clamp(Math.floor(h / dh), 0, prof.length - 2), f = clamp((h - prof[i].h) / dh, 0, 1), a = prof[i], b = prof[i + 1];
        const mix = k => a[k] + (b[k] - a[k]) * f;
        return V.spd === 'x' ? { roc: mix('rocX'), v: mix('vx') } : { roc: mix('rocY'), v: mix('vy') };
      }
      function build() {
        const c = V.craft === 'jet' ? JET : LIGHT, j = c === JET, m = c.m * V.mp / 100, W = m * G;
        const top = j ? 14000 : 8000, dh = j ? 200 : 100;
        prof = [];
        for (let h = 0; h <= top; h += dh) {
          const A = airAt(F, h, V.dT), vs = stallV(c, m, A.rho), v0 = vs * 1.08, v1 = j ? Math.min(0.9 * A.a, 330) : 85;
          let by = -1e9, vy = v0, bx = -1e9, vx = v0;
          for (let i = 0; i <= 160 && v1 > v0; i++) {
            const u = v0 + (v1 - v0) * i / 160, ex = thrustAv(c, u, A) - dragAt(c, u, A, m).D;
            if (ex * u > by) { by = ex * u; vy = u; }
            if (ex > bx) { bx = ex; vx = u; }
          }
          if (by < -1e8) { by = -W; bx = -W; }
          prof.push({ h, rocY: by / W, vy, rocX: bx * vx / W, vx, rho: A.rho, sig: A.rho / 1.225 });
        }
        const serv = crossing('rocY', 0.508), abs = crossing('rocY', 0), cru = crossing('rocY', 1.524);
        // time to the service ceiling, integrating dh / RC
        let ts = 0;
        if (isFinite(serv) && serv > 0) for (let h = 0; h < serv; h += 10) ts += 10 / Math.max(0.05, at(h + 5).roc);
        P = { c, j, top, serv, abs, cru, ts };
        const cy = [], cx = [];
        for (const p of prof) { if (p.rocY >= 0) cy.push([p.rocY / FPM, p.h]); if (p.rocX >= 0) cx.push([p.rocX / FPM, p.h]); }
        if (isFinite(abs)) { cy.push([0, abs]); }
        const C = kit.colors();
        const hl = [];
        if (isFinite(serv)) hl.push({ y: serv, label: 'service ceiling ' + fmtL(serv), color: C.warn });
        if (isFinite(abs)) hl.push({ y: abs, label: 'absolute ceiling ' + fmtL(abs), color: C.bad });
        const vl = [{ x: 100, label: '100 ft/min' }];
        if (j) vl.push({ x: 300, label: '300 ft/min' });
        plot.set({ series: [{ pts: cy, label: 'at the best-rate speed V_y', width: 2.4 }, { pts: cx, label: 'at the best-angle speed V_x', dash: [6, 4] }], hlines: hl, vlines: vl, y: { label: 'altitude (m)', min: 0, max: top } });
        ro.set('serv', isFinite(serv) ? fmtL(serv) + ' (' + (serv / 0.3048).toFixed(0) + ' ft)' + (j && isFinite(cru) ? '; 300 ft/min at ' + fmtL(cru) : '') : 'above ' + fmtL(top));
        ro.set('abs', isFinite(abs) ? fmtL(abs) + ' (' + (abs / 0.3048).toFixed(0) + ' ft)' : 'above ' + fmtL(top));
        ro.set('ts', ts > 0 ? (ts / 60).toFixed(0) + ' min' : '—');
      }
      function restart() { fl = { h: 0, x: 0, t: 0, done: false, roc: 0, v: 0, g: 0 }; path = [[0, 0]]; }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors();
        sky(c, st, C);
        if (!P || !fl) return;
        // climb, 40 × faster than real time
        let simT = dt * 40;
        while (simT > 0 && !fl.done) {
          const ds = Math.min(1, simT); simT -= ds;
          const r = at(fl.h);
          fl.roc = r.roc; fl.v = r.v;
          if (r.roc < 0.05) { fl.done = true; break; }
          fl.g = Math.asin(clamp(r.roc / r.v, -1, 1));
          fl.h += r.roc * ds; fl.x += r.v * Math.cos(fl.g) * ds; fl.t += ds;
          if (fl.t - (path.lastT || 0) >= 10) { path.push([fl.x, fl.h]); path.lastT = fl.t; }
        }
        const pl = 50, pr = 16, pt = 16, pb = 24;
        const xmax = Math.max(P.j ? 120000 : 30000, fl.x * 1.12), top = P.top;
        const X = x => pl + x / xmax * (st.W - pl - pr), Y = h => st.H - pb - h / top * (st.H - pt - pb);
        c.fillStyle = C.dark ? 'hsl(100 18% 17%)' : 'hsl(95 30% 80%)'; c.fillRect(0, Y(0), st.W, st.H - Y(0));
        const step = P.j ? 2000 : 1000;
        for (let h = step; h <= top; h += step) { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(pl, Y(h)); c.lineTo(st.W - pr, Y(h)); c.stroke(); kit.label(c, (h / 1000) + ' km', pl - 6, Y(h), { align: 'right', color: C.muted, size: 10.5 }); }
        const hline = (h, col, txt) => { if (!isFinite(h) || h > top) return; c.strokeStyle = col; c.setLineDash([6, 4]); c.lineWidth = 1.4; c.beginPath(); c.moveTo(pl, Y(h)); c.lineTo(st.W - pr, Y(h)); c.stroke(); c.setLineDash([]); kit.label(c, txt, st.W - pr - 4, Y(h) - 8, { align: 'right', color: col, size: 11 }); };
        hline(P.serv, C.warn, 'service ceiling'); hline(P.abs, C.bad, 'absolute ceiling');
        c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath();
        path.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1])));
        c.lineTo(X(fl.x), Y(fl.h)); c.stroke();
        const last = path[path.length - 1], ang = path.length > 1 || fl.x > 0 ? Math.atan2(Y(last[1]) - Y(fl.h), X(fl.x) - X(last[0]) || 1) : 0.3;
        planeSide(c, X(fl.x), Y(fl.h), clamp(ang, -0.2, 0.6), 0.12, C, P.j ? 'jet' : 'prop');
        kit.label(c, 'distance flown: ' + fmtL(fl.x) + ' — time × 40', pl, st.H - 9, { color: C.muted, size: 10.5 });
        if (fl.done) kit.label(c, fl.h < 1 ? 'cannot climb at all in these conditions' : 'practically at the absolute ceiling: the last metres would take for ever', st.W / 2, pt + 10, { align: 'center', color: C.warn, size: 12.5, weight: 700 });
        ro.set('h', fmtL(fl.h) + ' (' + (fl.h / 0.3048).toFixed(0) + ' ft)');
        ro.set('roc', fpm(fl.roc) + ' (' + fl.roc.toFixed(2) + ' m/s)');
        const rho = airAt(F, fl.h, V.dT).rho;
        ro.set('v', (fl.v / KT).toFixed(0) + ' kt TAS, ' + (fl.v * Math.sqrt(rho / 1.225) / KT).toFixed(0) + ' kt EAS');
        ro.set('g', (fl.g / D2R).toFixed(1) + '° (gradient ' + (100 * Math.tan(fl.g)).toFixed(1) + ' %)');
        ro.set('t', (fl.t / 60).toFixed(1) + ' min');
        plot.set({ marks: [{ x: Math.max(0, fl.roc / FPM), y: fl.h, label: 'now' }] });
      }, box.stage);
      build(); restart();
      loop.start();
    }
  });

  /* ================================================================ perf-breguet */
  Hyper.sim('perf-breguet', {
    title: 'Range with the Breguet equation',
    blurb: `A 70 t airliner cruises at constant Mach number, lift-to-drag ratio and fuel consumption, burning a chosen share of its starting mass. Press *Fly the cruise* to watch it: the fuel flow $c_T m/(L/D)$ falls as the aircraft grows lighter, and the distance reached is exactly Breguet's $R = \\dfrac{V}{c_T}\\,\\dfrac{L}{D}\\,\\ln\\dfrac{m_0}{m_1}$.

**Try this**
- With the defaults (Mach 0.78 at 11 km, L/D 17, 0.56 per hour) 15 % of fuel carries it about 4100 km. Find the fuel for London–New York.
- Compare the Breguet curve with the straight line "fuel flow frozen at the start": the aircraft goes further because it gets lighter.
- Raise L/D from 17 to 18.7 (+10 %), then instead cut the TSFC by 9 %: the same gain.
- Fly lower, at 9000 m, at the same Mach number: the speed of sound is higher so the true airspeed is too — but in reality the drag would change; here only the speed does.
- Push the fuel to 45 %: the range keeps growing, but the logarithm is bending the curve upward — the start of the ultra-long-range regime.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 180 });
      const gb = graphDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'ld', label: 'Lift-to-drag ratio L/D', min: 10, max: 22, step: 0.1, value: 17 },
        { id: 'ct', label: 'Thrust-specific fuel consumption c_T', min: 0.45, max: 0.9, step: 0.01, value: 0.56, unit: '1/h' },
        { id: 'M', label: 'Cruise Mach number', min: 0.6, max: 0.85, step: 0.01, value: 0.78 },
        { id: 'h', label: 'Cruise altitude', min: 8000, max: 13000, step: 100, value: 11000, unit: 'm' },
        { id: 'ff', label: 'Cruise fuel, share of the starting mass', min: 5, max: 45, step: 1, value: 15, unit: '%' },
        { type: 'buttons', items: [{ id: 'go', label: 'Fly the cruise', primary: true }] }
      ], id => { update(); if (id === 'go') start(); else fl = null; });
      const ro = kit.readout(box.side, [['v', 'True airspeed'], ['rf', 'Range factor V(L/D)/c_T'], ['fuel', 'Cruise fuel'], ['r', 'Breguet range'], ['time', 'Cruise time'], ['ff', 'Fuel flow at start / end'], ['now', 'In flight']]);
      const plot = kit.plot(gb, { x: { label: 'cruise fuel (% of starting mass)', min: 0, max: 50 }, y: { label: 'range (km)', min: 0 }, legend: true }, 200);
      const V = ctl.values, m0 = 70000;
      const PAIRS = [[3600, 'Tel Aviv–London'], [5600, 'London–New York'], [9700, 'Paris–Tokyo'], [12000, 'Sydney–Los Angeles']];
      let S = null, fl = null;
      function update() {
        const C = kit.colors();
        const A = F.isa(V.h), v = V.M * A.a, ct = V.ct / 3600, f = V.ff / 100;
        const RF = v * V.ld / ct, R = RF * Math.log(1 / (1 - f)), m1 = m0 * (1 - f);
        S = { v, ct, RF, R, m1, ld: V.ld, f };
        const br = [], lin = [];
        for (let p = 0; p <= 50; p += 1) { br.push([p, RF * Math.log(1 / (1 - p / 100)) / 1000]); lin.push([p, RF * p / 100 / 1000]); }
        plot.set({ series: [{ pts: br, label: 'Breguet: the aircraft grows lighter', width: 2.4 }, { pts: lin, label: 'fuel flow frozen at its starting value', dash: [6, 4] }],
          marks: [{ x: V.ff, y: R / 1000, label: (R / 1000).toFixed(0) + ' km', color: C.accent }], vlines: [{ x: V.ff }] });
        ro.set('v', (v * 3.6).toFixed(0) + ' km/h (' + (v / KT).toFixed(0) + ' kt, Mach ' + V.M.toFixed(2) + ')');
        ro.set('rf', (RF / 1000).toFixed(0) + ' km');
        ro.set('fuel', (f * m0 / 1000).toFixed(1) + ' t of ' + (m0 / 1000) + ' t');
        ro.set('r', (R / 1000).toFixed(0) + ' km');
        ro.set('time', (R / v / 3600).toFixed(1) + ' h');
        ro.set('ff', (V.ct * m0 / V.ld).toFixed(0) + ' / ' + (V.ct * S.m1 / V.ld).toFixed(0) + ' kg/h');
        if (!fl) ro.set('now', 'press "Fly the cruise"');
      }
      function start() { fl = { x: 0, m: m0, t: 0, on: true }; }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors();
        if (!S) return;
        // cruise, compressed so the whole flight takes about 9 s
        if (fl && fl.on) {
          const T = S.R / S.v, speed = T / 9;
          let rem = dt * speed; const n = 20, ds = rem / n;
          for (let i = 0; i < n && fl.on; i++) {
            const dm = S.ct * fl.m / S.ld * ds;                      // kg of fuel in ds
            if (fl.m - dm <= S.m1) { const frac = (fl.m - S.m1) / Math.max(dm, 1e-9); fl.x += S.v * ds * frac; fl.t += ds * frac; fl.m = S.m1; fl.on = false; break; }
            fl.m -= dm; fl.x += S.v * ds; fl.t += ds;
          }
          ro.set('now', fmtL(fl.x) + ' after ' + (fl.t / 3600).toFixed(1) + ' h; mass ' + (fl.m / 1000).toFixed(1) + ' t; burning ' + (S.ct * 3600 * fl.m / S.ld).toFixed(0) + ' kg/h' + (fl.on ? '' : ' — fuel for the cruise used up'));
        }
        const pl = 20, pr = 110, y = st.H * 0.55, xmax = Math.max(13000e3, S.R * 1.08);
        const X = x => pl + x / xmax * (st.W - pl - pr);
        c.strokeStyle = C.faint; c.lineWidth = 2; c.beginPath(); c.moveTo(X(0), y); c.lineTo(X(xmax), y); c.stroke();
        for (let k = 0; k <= xmax / 1000; k += 2000) { c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(X(k * 1000), y - 4); c.lineTo(X(k * 1000), y + 4); c.stroke(); kit.label(c, (k / 1000) + 'k', X(k * 1000), y + 16, { align: 'center', color: C.muted, size: 10.5 }); }
        kit.label(c, 'km', X(xmax) + 4, y + 16, { color: C.muted, size: 10.5 });
        PAIRS.forEach(([d, name], i) => { if (d * 1000 > xmax) return; const x = X(d * 1000), yy = y - 20 - (i % 2) * 16; c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(x, yy + 4); c.lineTo(x, y); c.stroke(); c.setLineDash([]); kit.label(c, name, x, yy, { align: 'center', color: C.muted, size: 10.5 }); });
        c.strokeStyle = C.accent; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(X(0), y); c.lineTo(X(S.R), y); c.stroke(); c.lineCap = 'butt';
        kit.label(c, 'range ' + (S.R / 1000).toFixed(0) + ' km', X(S.R), y + 32, { align: 'center', color: C.accent, size: 12, weight: 700 });
        const px = fl ? X(fl.x) : X(0);
        planeSide(c, px, y - 62, 0, 0.13, C, 'jet');
        // fuel gauge
        const fm = fl ? (fl.m - S.m1) / (m0 - S.m1) : 1, gx = st.W - pr + 30, gh = st.H * 0.6, gy = st.H * 0.2;
        c.strokeStyle = C.text; c.lineWidth = 1.4; c.strokeRect(gx, gy, 22, gh);
        c.fillStyle = fm > 0.15 ? C.ok : C.warn; c.fillRect(gx + 2, gy + 2 + (gh - 4) * (1 - clamp(fm, 0, 1)), 18, (gh - 4) * clamp(fm, 0, 1));
        kit.label(c, 'cruise', gx + 11, gy - 16, { align: 'center', color: C.muted, size: 10.5 });
        kit.label(c, 'fuel', gx + 11, gy - 4, { align: 'center', color: C.muted, size: 10.5 });
        kit.label(c, ((fl ? fl.m - S.m1 : m0 - S.m1) / 1000).toFixed(1) + ' t', gx + 11, gy + gh + 12, { align: 'center', color: C.text, size: 11, weight: 700 });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ perf-takeoff */
  Hyper.sim('perf-takeoff', {
    title: 'The takeoff run',
    blurb: `The light aircraft's takeoff integrated step by step: $m\\,dV/dt = T - D - \\mu(W - L)$ on the ground, with the propeller's thrust falling with speed and the engine's power with air density; liftoff at 1.2 times the stall speed (flaps 10°), then a steady climb over a 15 m (50 ft) screen. The run replays in 1.5 × real time.

**Try this**
- Sea level, 15 °C, 1100 kg, paved: about 300 m of ground roll. Compare 1000 kg with 1150 kg: 15 % more weight, nearly 40 % more runway — roughly the square law.
- An airfield at 1500 m on a 30 °C day: the density altitude is about 2350 m and the ground roll grows from about 300 m to more than 550 m — a little more than the simple estimate on the page, because the propeller's thrust also falls at the higher true liftoff speed.
- 10 kt of headwind shortens the roll by about 30 %; 5 kt of tailwind lengthens it by about 17 %.
- Long wet grass: the rolling friction eats the acceleration. At 3000 m and 45 °C the aircraft lifts off a paved runway only after more than a kilometre and then barely climbs; on long wet grass it never reaches its liftoff speed at all.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200 });
      const gb = graphDiv(box);
      const ctl = kit.controls(box.side, [
        { id: 'elev', label: 'Airfield elevation', min: 0, max: 3000, step: 50, value: 0, unit: 'm' },
        { id: 'temp', label: 'Air temperature', min: -10, max: 45, step: 1, value: 15, unit: '°C' },
        { id: 'm', label: 'Mass', min: 800, max: 1150, step: 10, value: 1100, unit: 'kg' },
        { id: 'wind', label: 'Headwind (negative: tailwind)', min: -10, max: 25, step: 1, value: 0, unit: 'kt' },
        { id: 'mu', type: 'select', label: 'Runway', options: [['Paved, dry (μ ≈ 0.02)', 0.02], ['Short dry grass (μ ≈ 0.05)', 0.05], ['Long wet grass (μ ≈ 0.10)', 0.1]], value: 0.02 },
        { type: 'buttons', items: [{ id: 'go', label: 'Take off again', primary: true }] }
      ], () => { run(); tp = 0; hold = 0; });
      const ro = kit.readout(box.side, [['rho', 'Air density'], ['da', 'Density altitude'], ['vlof', 'Liftoff speed (1.2 V_s)'], ['sg', 'Ground roll'], ['s15', 'Distance to 15 m (50 ft)'], ['t', 'Time to liftoff'], ['grad', 'Climb gradient after liftoff'], ['now', 'Now']]);
      const plot = kit.plot(gb, { x: { label: 'distance from brake release (m)', min: 0 }, y: { label: 'speed (kt)', min: 0 }, legend: true }, 190);
      const V = ctl.values, c = LIGHT, k = kOf(c), CD0to = 0.038, CLg = 0.4, ge = 0.6, CLmaxTO = 1.6;
      let R = null, tp = 0, hold = 0;
      function run() {
        const C = kit.colors();
        const isa = F.isa(V.elev), T = V.temp + 273.15, rho = isa.p / (RAIR * T);
        const A = { rho, p: isa.p, T, a: Math.sqrt(1.4 * RAIR * T) };
        const m = V.m, W = m * G, U = V.wind * KT, mu = V.mu;
        const vs = Math.sqrt(2 * W / (rho * c.S * CLmaxTO)), vlof = 1.2 * vs;
        const rec = [];
        let x = 0, vg = 0, t = 0, ok = false, stepN = 0, vbest = 0;
        const dt = 0.02;
        while (t < 120 && x < 4000) {
          const va = vg + U, q = 0.5 * rho * va * Math.abs(va);
          const L = va > 0 ? q * c.S * CLg : 0, D = q * c.S * (CD0to + ge * k * CLg * CLg);
          const Th = thrustAv(c, va, A), Fr = mu * Math.max(0, W - L), acc = (Th - D - Fr) / m;
          if (stepN++ % 5 === 0) rec.push({ t, x, h: 0, va, vg, Th, net: Th - D - Fr });
          if (va >= vlof) { ok = true; break; }
          vg = Math.max(0, vg + acc * dt); x += vg * dt; t += dt; vbest = Math.max(vbest, va);
          if (acc <= 0 && t > 2) break;                                 // the net force has run out: it will never get faster
        }
        const sg = x, tl = t;
        let s15 = NaN, grad = NaN;
        if (ok) {
          const va = vlof, q = 0.5 * rho * va * va, CL = W / (q * c.S), D = q * c.S * (CD0to + k * CL * CL), Th = thrustAv(c, va, A);
          const sg0 = (Th - D) / W;
          grad = sg0;
          if (sg0 > 0.003) {
            const gam = Math.asin(Math.min(0.5, sg0));
            let h = 0;
            while (h < 30 && t < 300) {
              h += va * Math.sin(gam) * dt; x += (va * Math.cos(gam) - U) * dt; t += dt;
              if (!isFinite(s15) && h >= 15) s15 = x;
              if (stepN++ % 5 === 0) rec.push({ t, x, h, va, vg: va * Math.cos(gam) - U, Th, net: Th - D });
            }
          }
        }
        rec.push({ t, x, h: rec.length ? rec[rec.length - 1].h : 0, va: rec.length ? rec[rec.length - 1].va : 0, vg: rec.length ? rec[rec.length - 1].vg : 0, Th: 0, net: 0 });
        R = { rec, ok, sg, s15, tl, vlof, grad, U, xEnd: x, rho };
        const da = densityAltitude(F, rho), sig = rho / 1.225;
        ro.set('rho', rho.toFixed(3) + ' kg/m³ (σ = ' + sig.toFixed(3) + ')');
        ro.set('da', fmtL(da) + ' (' + (da / 0.3048).toFixed(0) + ' ft)');
        ro.set('vlof', (vlof * Math.sqrt(sig) / KT).toFixed(0) + ' kt indicated, ' + (vlof / KT).toFixed(0) + ' kt true');
        ro.set('sg', ok ? fmtL(sg) : 'never lifts off: the net force runs out at ' + (vbest / KT).toFixed(0) + ' kt');
        ro.set('s15', isFinite(s15) ? fmtL(s15) : ok ? 'cannot climb in these conditions' : '—');
        ro.set('t', ok ? tl.toFixed(1) + ' s' : '—');
        ro.set('grad', ok ? (100 * grad).toFixed(1) + ' %' + (grad < 0.003 ? ' — no climb possible' : '') : '—');
        const air = rec.map(r => [r.x, r.va / KT]), gnd = rec.map(r => [r.x, r.vg / KT]);
        const series = [{ pts: air, label: 'airspeed (true)', width: 2.4 }];
        if (U !== 0) series.push({ pts: gnd, label: 'ground speed', dash: [6, 4] });
        const vl = [];
        if (ok) vl.push({ x: sg, label: 'liftoff' });
        if (isFinite(s15)) vl.push({ x: s15, label: '15 m', color: C.warn });
        plot.set({ series, hlines: [{ y: vlof / KT, label: 'liftoff speed' }], vlines: vl, x: { label: 'distance from brake release (m)', min: 0, max: Math.max(300, x * 1.05) } });
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors();
        sky(c, st, C);
        if (!R) return;
        const rec = R.rec, tEnd = rec[rec.length - 1].t;
        if (tp < tEnd) tp += dt * 1.5; else { hold += dt; if (hold > 2) { tp = 0; hold = 0; } }
        let i = 0;
        while (i < rec.length - 1 && rec[i + 1].t <= tp) i++;
        const r = rec[i];
        const pl = 40, pr = 16, gy = st.H * 0.78, span = Math.max(500, R.xEnd * 1.1);
        const X = x => pl + x / span * (st.W - pl - pr), px = (st.W - pl - pr) / span;
        const HX = Math.max(1, Math.round(Math.min(st.H * 0.3, 70) / (15 * px)));          // heights exaggerated so 15 m shows
        c.fillStyle = C.dark ? 'hsl(100 18% 17%)' : 'hsl(95 30% 78%)'; c.fillRect(0, gy, st.W, st.H - gy);
        if (V.mu < 0.04) { c.fillStyle = C.dark ? 'hsl(220 8% 28%)' : 'hsl(220 6% 55%)'; c.fillRect(X(0), gy, X(Math.min(span, 1200)) - X(0), 7); c.strokeStyle = C.surface; c.setLineDash([10, 10]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(0), gy + 3.5); c.lineTo(X(Math.min(span, 1200)), gy + 3.5); c.stroke(); c.setLineDash([]); }
        for (let d = 0; d <= span; d += span > 1500 ? 500 : 100) { c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(X(d), gy + 8); c.lineTo(X(d), gy + 13); c.stroke(); if (d % (span > 1500 ? 1000 : 200) === 0) kit.label(c, d + ' m', X(d), gy + 22, { align: 'center', color: C.muted, size: 10.5 }); }
        if (isFinite(R.s15)) { const x = X(R.s15), top = gy - 15 * px * HX; c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(x, gy); c.lineTo(x, top); c.stroke(); kit.label(c, '15 m screen', x, top - 9, { align: 'center', color: C.warn, size: 11 }); }
        if (R.ok) { c.strokeStyle = C.ok; c.setLineDash([3, 4]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(R.sg), gy); c.lineTo(X(R.sg), gy - 40); c.stroke(); c.setLineDash([]); kit.label(c, 'liftoff', X(R.sg), gy - 48, { align: 'center', color: C.ok, size: 11 }); }
        // the aircraft (heights exaggerated)
        const sc = clamp(st.W / 3000, 0.1, 0.22), pitch = r.h > 0 ? 8 * D2R + Math.asin(clamp(R.grad, 0, 0.5)) : (r.va > R.vlof * 0.93 ? 6 * D2R : 0);
        planeSide(c, X(r.x), gy - 26 * sc - r.h * px * HX, pitch, sc, C, 'prop');
        if (R.U !== 0) for (let j = 0; j < 4; j++) { const x = st.W * (0.2 + j * 0.2), y = 16, L = clamp(Math.abs(V.wind), 3, 25) * 1.4; kit.arrow(c, x + (R.U > 0 ? L / 2 : -L / 2), y, x - (R.U > 0 ? L / 2 : -L / 2), y, C.muted, 1.4); }
        kit.label(c, (R.U > 0 ? 'headwind ' : R.U < 0 ? 'tailwind ' : '') + (R.U !== 0 ? Math.abs(V.wind) + ' kt' : ''), st.W - 10, 16, { align: 'right', color: C.muted, size: 11 });
        kit.label(c, 'heights ×' + HX, 10, st.H - 8, { color: C.muted, size: 10.5 });
        ro.set('now', r.t.toFixed(1) + ' s: ' + fmtL(r.x) + ', ' + (r.va / KT).toFixed(0) + ' kt' + (r.h > 0 ? ', ' + r.h.toFixed(0) + ' m up' : ', net force ' + fmtN(r.net)));
        plot.set({ marks: [{ x: r.x, y: r.va / KT, label: 'now' }] });
      }, box.stage);
      run();
      loop.start();
    }
  });

  /* ================================================================ perf-energy */
  Hyper.sim('perf-energy', {
    title: 'Trading speed and height',
    blurb: `The light aircraft as a point mass in the vertical plane, with the four forces: $m\\,\\dot V = T - D - W\\sin\\gamma$ and $mV\\dot\\gamma = L - W\\cos\\gamma$. The elevator sets the lift coefficient, the throttle the thrust. The dashed line is the **energy height** $h + V^2/2g$; the bar from the aircraft up to it is the height stored in the speed.

**Try this**
- Press *Pull up*: speed turns into height and the aircraft zooms up to near the energy line — then it swings down again: the phugoid, a slow exchange of speed and height about 20 s long, with the energy height nearly constant.
- Raise the throttle: the energy line starts to climb ($P_s > 0$); cut it and the line sinks — that is a glide.
- Move the elevator to a higher $C_L$ and wait: the aircraft settles slower and, with the same throttle, climbs or descends differently — speed is set by the angle of attack, climb by the power.
- Watch the four arrows in a pull-up: the lift grows beyond the weight (the load factor), and the drag grows with it.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 230 });
      const gb = graphDiv(box);
      const c = LIGHT, m = c.m, W = m * G, k = kOf(c);
      const ctl = kit.controls(box.side, [
        { id: 'thr', label: 'Throttle', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'cl', label: 'Elevator: lift coefficient C_L', min: 0.2, max: 1.3, step: 0.01, value: 0.5 },
        { id: 'sp', type: 'select', label: 'Time', options: [['Real time', 1], ['3 × faster', 3]], value: 1 },
        { type: 'buttons', items: [{ id: 'pull', label: 'Pull up (3 s)', primary: true }, { id: 'push', label: 'Push over (2 s)' }, { id: 'trim', label: 'Trim for level flight' }] }
      ], id => { if (id === 'pull') pulse = { d: 0.55, t: 3 }; else if (id === 'push') pulse = { d: -0.35, t: 2 }; else if (id === 'trim') trim(s ? s.h : 1000, 'trimmed for level flight'); });
      const ro = kit.readout(box.side, [['v', 'Airspeed'], ['h', 'Height'], ['he', 'Energy height h + V²/2g'], ['ps', 'Specific excess power P_s'], ['g', 'Flight-path angle'], ['n', 'Load factor n = L/W'], ['f', 'Lift / drag / thrust'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'time (s)' }, y: { label: 'height (m)', noZero: true }, legend: true }, 170);
      const V = ctl.values;
      let s = null, pulse = null, hist = [], trail = [], frame = 0, yc = 1000, F0 = null, acc = 0;
      function trim(h, msg) {
        h = clamp(h, 300, 3500);
        const A = F.isa(h), v = Math.sqrt(2 * W / (A.rho * c.S * V.cl)), D = 0.5 * A.rho * v * v * c.S * (c.CD0 + k * V.cl * V.cl);
        const thr = clamp(100 * D / thrustAv(c, v, A), 0, 100);
        ctl.set('thr', Math.round(thr * 10) / 10);
        s = { v, g: 0, h, x: s ? s.x : 0, t: s ? s.t : 0 };
        pulse = null; yc = h; trail.length = 0; acc = 0;
        ro.set('msg', msg || '');
      }
      const loop = kit.loop(dt => {
        const cx2 = st.begin(), C = kit.colors();
        sky(cx2, st, C);
        if (!s) return;
        const ds = 0.01;
        acc = Math.min(acc + dt * (V.sp || 1), 0.5);
        while (acc >= ds) {
          acc -= ds;
          const A = F.isa(clamp(s.h, 0, 11000));
          const cl = clamp(V.cl + (pulse ? pulse.d : 0), -0.4, 1.45);
          const q = 0.5 * A.rho * s.v * s.v, L = q * c.S * cl, D = q * c.S * (c.CD0 + k * cl * cl), T = V.thr / 100 * thrustAv(c, s.v, A);
          s.v += ((T - D) / m - G * Math.sin(s.g)) * ds;
          s.g += (L - W * Math.cos(s.g)) / (m * Math.max(s.v, 5)) * ds;
          if (s.g > Math.PI) s.g -= 2 * Math.PI; else if (s.g < -Math.PI) s.g += 2 * Math.PI;
          s.h += s.v * Math.sin(s.g) * ds; s.x += s.v * Math.cos(s.g) * ds; s.t += ds;
          F0 = { L, D, T, cl };
          if (pulse) { pulse.t -= ds; if (pulse.t <= 0) pulse = null; }
          if (s.v < 23) { trim(s.h, 'too slow — the wing would have stalled; trimmed again'); break; }
          if (s.v > 85) { trim(s.h, 'too fast — beyond the never-exceed speed; trimmed again'); break; }
          if (s.h < 60) { trim(1000, 'too low — started again at 1000 m'); break; }
          if (s.h > 4500) { trim(1000, 'too high for this demonstration — started again at 1000 m'); break; }
        }
        if (!F0) { const A = F.isa(s.h), q = 0.5 * A.rho * s.v * s.v; F0 = { L: q * c.S * V.cl, D: q * c.S * (c.CD0 + k * V.cl * V.cl), T: V.thr / 100 * thrustAv(c, s.v, A), cl: V.cl }; }
        const hE = s.h + s.v * s.v / (2 * G), Ps = (F0.T - F0.D) * s.v / W, n = F0.L / W;
        if (!trail.length || s.x - trail[trail.length - 1][0] > 8) trail.push([s.x, s.h]);
        while (trail.length && s.x - trail[0][0] > 4000) trail.shift();
        if (!hist.length || s.t - hist[hist.length - 1][0] >= 0.25) hist.push([s.t, s.h, hE]);
        while (hist.length && s.t - hist[0][0] > 120) hist.shift();
        // the view: 3 km across, heights exaggerated ×3, following the aircraft
        yc += (s.h - yc) * Math.min(1, dt * 0.8);
        const pxm = st.W / 3000, vx = 3, ax = st.W * 0.42;
        const X = x => ax + (x - s.x) * pxm, Y = h => st.H * 0.6 - (h - yc) * pxm * vx;
        if (Y(0) < st.H) { cx2.fillStyle = C.dark ? 'hsl(100 18% 17%)' : 'hsl(95 30% 80%)'; cx2.fillRect(0, Y(0), st.W, st.H - Y(0)); }
        cx2.strokeStyle = C.warn; cx2.setLineDash([7, 5]); cx2.lineWidth = 1.5; cx2.beginPath(); cx2.moveTo(0, Y(hE)); cx2.lineTo(st.W, Y(hE)); cx2.stroke(); cx2.setLineDash([]);
        kit.label(cx2, 'energy height ' + hE.toFixed(0) + ' m', st.W - 10, Y(hE) - 9, { align: 'right', color: C.warn, size: 11.5, weight: 700 });
        cx2.strokeStyle = C.accent; cx2.lineWidth = 2; cx2.beginPath();
        trail.forEach((p, i) => i ? cx2.lineTo(X(p[0]), Y(p[1])) : cx2.moveTo(X(p[0]), Y(p[1])));
        cx2.lineTo(X(s.x), Y(s.h)); cx2.stroke();
        const ay = Y(s.h);
        cx2.strokeStyle = C.warn; cx2.lineWidth = 4; cx2.globalAlpha = 0.45; cx2.beginPath(); cx2.moveTo(ax, ay); cx2.lineTo(ax, Y(hE)); cx2.stroke(); cx2.globalAlpha = 1;
        kit.label(cx2, 'V²/2g = ' + (hE - s.h).toFixed(0) + ' m', ax + 8, (ay + Y(hE)) / 2, { color: C.text, size: 11 });
        // apparent path angle on the (exaggerated) screen
        const ga = Math.atan(Math.tan(s.g) * vx), alpha = (F0.cl / 0.086 - 2) * D2R;
        planeSide(cx2, ax, ay, clamp(ga + alpha, -1.4, 1.4), 0.16, C, 'prop');
        const u = 42, kF = u / W, f = 5 * kF;
        const tx = Math.cos(ga), ty = -Math.sin(ga);
        kit.arrow(cx2, ax, ay, ax + ty * F0.L * kF, ay - tx * F0.L * kF, C.ok, 2.4);   // lift: across the path
        kit.arrow(cx2, ax, ay, ax, ay + u, C.bad, 2.4);
        kit.arrow(cx2, ax, ay, ax - tx * F0.D * f, ay - ty * F0.D * f, C.warn, 2.4);
        kit.arrow(cx2, ax, ay, ax + tx * F0.T * f, ay + ty * F0.T * f, C.series[0], 2.4);
        kit.label(cx2, 'lift, weight; drag and thrust ×5', 10, st.H - 10, { color: C.muted, size: 10.5 });
        kit.label(cx2, 'heights ×3', st.W - 10, st.H - 10, { align: 'right', color: C.muted, size: 10.5 });
        ro.set('v', (s.v / KT).toFixed(0) + ' kt (' + s.v.toFixed(1) + ' m/s)');
        ro.set('h', s.h.toFixed(0) + ' m');
        ro.set('he', hE.toFixed(0) + ' m');
        ro.set('ps', (Ps >= 0 ? '+' : '') + Ps.toFixed(2) + ' m/s' + (Ps > 0.05 ? ' — gaining energy' : Ps < -0.05 ? ' — losing energy' : ' — steady'));
        ro.set('g', (s.g / D2R).toFixed(1) + '°');
        ro.set('n', n.toFixed(2) + (n > c.nmax ? ' — over the limit!' : ''));
        ro.set('f', (F0.L / 1000).toFixed(1) + ' / ' + (F0.D / 1000).toFixed(2) + ' / ' + (F0.T / 1000).toFixed(2) + ' kN');
        if (frame++ % 4 === 0 && hist.length > 1) plot.set({ series: [{ pts: hist.map(p => [p[0], p[1]]), label: 'height h' }, { pts: hist.map(p => [p[0], p[2]]), label: 'energy height h + V²/2g', dash: [6, 4] }], x: { label: 'time (s)', min: Math.max(0, s.t - 120), max: Math.max(20, s.t) } });
      }, box.stage);
      trim(1000, '');
      loop.start();
    }
  });
})();
