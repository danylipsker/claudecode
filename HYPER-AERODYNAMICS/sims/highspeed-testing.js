/* HYPER-AERODYNAMICS · sims/highspeed-testing.js — simulations for "Flying fast" (high-speed flight)
 * and "Wind tunnels and experiments".
 *   hst-mcrit      an airfoil speeding up: its lowest pressure coefficient, corrected by Prandtl–Glauert or
 *                  Kármán–Tsien, meets the sonic value C_p* at the critical Mach number; the supersonic pocket
 *   hst-drag-rise  drag rise against Mach for straight, swept and supercritical wings (Korn equation, Lock's law)
 *   hst-area-rule  the cross-sectional area of an F-102-like delta, with and without a waisted fuselage, and its
 *                  slender-body wave drag against the Sears–Haack ideal
 *   hst-sweep      a swept wing: normal and spanwise components, the S-shaped streamlines and the Mach cone
 *   hst-diamond    a diamond airfoil at supersonic speed by shock-expansion theory, against Ackeret's linear
 *                  theory; the pressure field, a schlieren picture and a shadowgraph
 *   hst-reentry    a ballistic entry from 120 km: Sutton–Graves stagnation heating, deceleration, blunt and sharp noses
 *   hst-tunnel     a closed-return or open-circuit wind tunnel: the contraction, test-section conditions and
 *                  Reynolds-number matching with pressure and cold nitrogen
 *   hst-taps       pressure taps on an airfoil and a multitube manometer: how many taps give the right lift
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, G = 1.4;
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const num = (v, d) => (typeof v === 'number' && Number.isFinite(v)) ? v : d;
  const fx = (v, n) => Number.isFinite(v) ? v.toFixed(n) : '—';
  function plotBox(box) {
    const d = document.createElement('div');
    d.style.padding = '4px 10px 10px';
    box.stage.appendChild(d);
    return d;
  }
  // the pressure coefficient at which the local flow is exactly sonic
  const cpStar = M => 2 / (G * M * M) * (Math.pow((2 + (G - 1) * M * M) / (G + 1), G / (G - 1)) - 1);
  const pgCp = (cp0, M) => cp0 / Math.sqrt(1 - M * M);
  const ktDen = (cp0, M) => { const b = Math.sqrt(1 - M * M); return b + M * M / (1 + b) * cp0 / 2; };
  // Kármán–Tsien; past its singularity the flow is far beyond critical, and a floor stands in
  const ktCp = (cp0, M) => { const d = ktDen(cp0, M); return d > 0.02 ? cp0 / d : -50; };
  const corr = (rule, cp0, M) => rule === 'kt' ? ktCp(cp0, M) : pgCp(cp0, M);
  // the first Mach number at which the corrected C_p,min reaches C_p*
  function mCrit(cp0, rule) {
    if (!(cp0 < 0)) return null;
    const f = M => corr(rule, cp0, M) - cpStar(M);
    let lo = 0.05;
    for (let M = 0.051; M < 0.9995; M += 0.001) {
      if (f(M) < 0) {
        let a = lo, b = M;
        for (let k = 0; k < 40; k++) { const m = (a + b) / 2; if (f(m) < 0) b = m; else a = m; }
        return (a + b) / 2;
      }
      lo = M;
    }
    return null;
  }
  // local Mach number from a pressure coefficient, isentropic from the free stream
  function localMach(cp, M) {
    const pp = 1 + G / 2 * M * M * cp;
    if (!(pp > 0.02)) return 3;
    const p0p = Math.pow(1 + (G - 1) / 2 * M * M, G / (G - 1)) / pp;
    return p0p <= 1 ? 0 : Math.sqrt(2 / (G - 1) * (Math.pow(p0p, (G - 1) / G) - 1));
  }
  function machColour(ml, C) {
    if (ml < 1) { const t = clamp((ml - 0.3) / 0.7, 0, 1); return 'hsl(' + Math.round(215 - 170 * t) + ' 80% ' + (C.dark ? 60 : 45) + '%)'; }
    const t = clamp((ml - 1) / 0.4, 0, 1);
    return 'hsl(' + Math.round(8 - 8 * t) + ' ' + Math.round(80 + 15 * t) + '% ' + Math.round((C.dark ? 60 : 50) - 8 * t) + '%)';
  }

  /* ================================================================ critical Mach number */
  Hyper.sim('hst-mcrit', {
    title: 'Critical Mach number of an airfoil',
    blurb: `A NACA four-digit airfoil solved by the panel method at low speed, then speeded up. Each point of the pressure distribution is scaled by the Prandtl–Glauert rule $C_p = C_{p0}/\\sqrt{1-M_\\infty^2}$ (or the Kármán–Tsien rule), and the local Mach number follows from the isentropic relations. The surface is coloured by local Mach number: blue slow, amber near sonic, red supersonic. The upper graph is the classic construction — the critical Mach number is where the curve of $C_{p,\\min}$ meets the sonic curve $C_p^*$.

**Try this**
- Start at Mach 0.5 with the 0012 at 0°: the lowest $C_p$ is far from the sonic line. Push the Mach number up and watch the suction peak deepen until the colour turns red near 0.74.
- Thicken the airfoil to 18 %, or add angle of attack: $C_{p,\\min}$ at low speed is lower, and the critical Mach number falls — a 6 % section stays subcritical to about 0.82.
- Compare Prandtl–Glauert with Kármán–Tsien: the second grows the suction faster and gives a critical Mach number about 0.015 lower.
- Past $M_{crit}$ a supersonic pocket sits on the upper surface and ends in a shock. The linear corrections are no longer trustworthy there — this is where transonic flow begins.`,
    mount(box, kit, params) {
      const F = kit.fluid, P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190 });
      const p1 = kit.plot(plotBox(box), { x: { label: 'free-stream Mach number M∞', min: 0.3, max: 1 }, y: { label: 'C_p  (suction up)', reverse: true }, legend: true }, 200);
      const p2 = kit.plot(plotBox(box), { x: { label: 'x / c', min: 0, max: 1 }, y: { label: 'C_p at this Mach  (suction up)', reverse: true }, legend: true }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'M', label: 'Flight Mach number M∞', min: 0.3, max: 0.95, step: 0.005, value: num(P.M, 0.6) },
        { id: 'alpha', label: 'Angle of attack α', min: -2, max: 6, step: 0.25, value: num(P.alpha, 0), unit: '°' },
        { id: 't', label: 'Thickness', min: 6, max: 18, step: 1, value: num(P.t, 12), unit: '%' },
        { id: 'm', label: 'Camber (at 40 % chord)', min: 0, max: 4, step: 0.5, value: num(P.m, 0), unit: '%' },
        { id: 'rule', type: 'select', label: 'Compressibility correction', options: [['Prandtl–Glauert', 'pg'], ['Kármán–Tsien', 'kt']], value: P.rule === 'kt' ? 'kt' : 'pg' }
      ], id => (id === 'M' || id === 'rule') ? update() : solve());
      const ro = kit.readout(box.side, [['cp0', 'C_p,min at low speed (panel method)'], ['cp', 'C_p,min at this Mach'], ['cps', 'Sonic value C_p* at this Mach'], ['ml', 'Highest local Mach number'],
        ['mpg', 'M_crit, Prandtl–Glauert'], ['mkt', 'M_crit, Kármán–Tsien'], ['state', '']]);
      const V = ctl.values;
      let pts = null, sol = null, cp0min = -0.4, mc = { pg: null, kt: null }, surf = [], a = 0;
      function solve() {
        a = V.alpha * D2R;
        pts = F.naca4(V.m / 100, 0.4, V.t / 100, 60);
        sol = F.panel(pts, a);
        cp0min = Math.min(...sol.cp.map(c => c.cp));
        mc = { pg: mCrit(cp0min, 'pg'), kt: mCrit(cp0min, 'kt') };
        update();
      }
      function update() {
        if (!sol) return;
        const M = V.M, rule = V.rule, cps = cpStar(M);
        surf = sol.cp.map(c => { const cp = corr(rule, c.cp, M); return { x: c.x, cp0: c.cp, cp, ml: localMach(cp, M), upper: c.upper }; });
        const cpmin = corr(rule, cp0min, M), mlmax = Math.max(...surf.map(s => s.ml));
        const star = [], pgS = [], ktS = [];
        for (let m = 0.3; m <= 1.0001; m += 0.005) star.push([m, cpStar(Math.min(m, 1))]);
        for (let m = 0.3; m < 0.999; m += 0.003) { const v = pgCp(cp0min, m); pgS.push([m, v]); if (v < -8) break; }
        for (let m = 0.3; m < 0.999; m += 0.003) { if (ktDen(cp0min, m) <= 0.02) break; const v = ktCp(cp0min, m); ktS.push([m, v]); if (v < -8) break; }
        const mcr = mc[rule], marks = [];
        if (mcr) marks.push({ x: mcr, y: cpStar(mcr), label: 'M_crit = ' + mcr.toFixed(3) });
        marks.push({ x: M, y: cpmin < -8 ? -8 : cpmin, r: 4 });
        p1.set({ y: { label: 'C_p  (suction up)', reverse: true, min: Math.min(-1.2, 1.7 * cp0min), max: 0.3 },
          series: [{ pts: star, label: 'sonic: C_p*', dash: [7, 4] }, { pts: pgS, label: 'C_p,min Prandtl–Glauert' }, { pts: ktS, label: 'C_p,min Kármán–Tsien', dash: [3, 3] }],
          vlines: [{ x: M, label: 'M∞' }], marks });
        const up = surf.filter(s => s.upper).map(s => [s.x, s.cp]).sort((p, q) => p[0] - q[0]);
        const lo = surf.filter(s => !s.upper).map(s => [s.x, s.cp]).sort((p, q) => p[0] - q[0]);
        const minCp = Math.min(cps, ...surf.map(s => s.cp));
        p2.set({ y: { label: 'C_p at this Mach  (suction up)', reverse: true, min: Math.max(-6, Math.min(-1, 1.1 * minCp)), max: 1.1 },
          series: [{ pts: up, label: 'upper surface' }, { pts: lo, label: 'lower surface', dash: [5, 4] }], hlines: [{ y: cps, label: 'C_p* — beyond this line the flow is supersonic' }] });
        ro.set('cp0', cp0min.toFixed(3));
        ro.set('cp', cpmin < -8 ? 'below −8' : cpmin.toFixed(3));
        ro.set('cps', cps.toFixed(3));
        ro.set('ml', mlmax >= 2.99 ? 'above 3' : mlmax.toFixed(3) + (mlmax > 1 ? '  (supersonic pocket)' : ''));
        ro.set('mpg', mc.pg ? mc.pg.toFixed(3) : '—');
        ro.set('mkt', mc.kt ? mc.kt.toFixed(3) : '—');
        ro.set('state', !mcr ? '' : M < mcr - 0.02 ? 'Subcritical: subsonic everywhere' : M < mcr ? 'Just below critical' : M < mcr + 0.08 ? 'Supercritical: a supersonic pocket ending in a shock' : 'Well past critical: strong shocks — the linear corrections no longer hold');
        loop.once();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (!sol) return;
        const s = Math.min(st.W * 0.5, st.H * 2.3), ox = st.W * 0.22, oy = st.H * 0.58;
        const ca = Math.cos(a), sa = Math.sin(a);
        const toDisp = (x, y) => { const dx = x - 0.25; return [ox + (0.25 + dx * ca + y * sa) * s, oy - (-dx * sa + y * ca) * s]; };
        for (let i = 0; i < 4; i++) { const y = st.H * (0.2 + 0.2 * i); kit.arrow(c, 10, y, 46, y, C.faint, 1.2); }
        c.beginPath();
        pts.forEach((q, i) => { const [x, y] = toDisp(q[0], q[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); });
        c.closePath(); c.fillStyle = C.surface; c.fill();
        c.lineCap = 'round'; c.lineWidth = 6;
        for (let i = 0; i < surf.length; i++) {
          const [x1, y1] = toDisp(pts[i][0], pts[i][1]), [x2, y2] = toDisp(pts[i + 1][0], pts[i + 1][1]);
          c.strokeStyle = machColour(surf[i].ml, C); c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
        }
        c.lineCap = 'butt';
        c.beginPath();
        pts.forEach((q, i) => { const [x, y] = toDisp(q[0], q[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); });
        c.closePath(); c.strokeStyle = C.text; c.lineWidth = 1.2; c.stroke();
        // supersonic pockets (schematic heights) closed by a shock
        for (const upper of [true, false]) {
          const run = [];
          surf.forEach((q, i) => { if (q.upper === upper && q.ml > 1) run.push(i); });
          if (!run.length) continue;
          run.sort((i, j) => surf[i].x - surf[j].x);
          const xa = surf[run[0]].x, xb = surf[run[run.length - 1]].x, mx = Math.max(...run.map(i => surf[i].ml));
          const H = s * clamp(xb - xa, 0.05, 0.6) * 0.5 * clamp(0.35 + 3 * (mx - 1), 0.35, 1);
          const base = [], top = [];
          for (const i of run) {
            const p1q = pts[i], p2q = pts[i + 1], tx = p2q[0] - p1q[0], ty = p2q[1] - p1q[1], L = Math.hypot(tx, ty) || 1;
            const nx = -ty / L, ny = tx / L, ndx = nx * ca + ny * sa, ndy = -nx * sa + ny * ca;
            const [x, y] = toDisp((p1q[0] + p2q[0]) / 2, (p1q[1] + p2q[1]) / 2);
            const xi = xb > xa ? (surf[i].x - xa) / (xb - xa) : 1, h = H * Math.sqrt(Math.sin(Math.PI / 2 * xi));
            base.push([x, y]); top.push([x + ndx * h, y - ndy * h]);
          }
          c.beginPath(); base.forEach((q, k) => k ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); for (let k = top.length - 1; k >= 0; k--) c.lineTo(top[k][0], top[k][1]); c.closePath();
          c.fillStyle = C.dark ? 'hsl(8 85% 60% / .2)' : 'hsl(8 85% 50% / .16)'; c.fill();
          c.setLineDash([4, 3]); c.strokeStyle = C.bad; c.lineWidth = 1.2;
          c.beginPath(); top.forEach((q, k) => k ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke(); c.setLineDash([]);
          const b = base[base.length - 1], t = top[top.length - 1];
          c.strokeStyle = C.text; c.lineWidth = 2.4; c.beginPath(); c.moveTo(b[0], b[1]); c.lineTo(t[0] + (t[0] - b[0]) * 0.15, t[1] + (t[1] - b[1]) * 0.15); c.stroke();
          const tm = top[Math.floor(top.length / 2)];
          kit.label(c, 'supersonic pocket', tm[0], tm[1] + (upper ? -10 : 12), { size: 11.5, color: C.bad, weight: 700 });
          kit.label(c, 'shock', t[0] + 8, t[1] + (upper ? -6 : 8), { size: 11.5, color: C.text, align: 'left' });
        }
        // colour key
        const kx = st.W - 170, ky = 16;
        for (let i = 0; i < 50; i++) { c.fillStyle = machColour(0.4 + i / 49, C); c.fillRect(kx + i * 3, ky, 3, 8); }
        kit.label(c, '0.4', kx, ky + 18, { size: 10.5, color: C.muted }); kit.label(c, '1.0', kx + 88, ky + 18, { size: 10.5, color: C.muted }); kit.label(c, '1.4', kx + 150, ky + 18, { size: 10.5, color: C.muted });
        kit.label(c, 'local Mach number', kx + 75, ky - 7, { size: 10.5, color: C.muted });
        kit.label(c, 'M∞ = ' + V.M.toFixed(3), 12, 14, { align: 'left', size: 13, weight: 700, color: C.text });
        kit.label(c, 'α = ' + V.alpha.toFixed(2) + '°', 12, 32, { align: 'left', size: 12, color: C.muted });
      }, box.stage);
      solve();
      loop.start();
    }
  });

  /* ================================================================ drag rise */
  Hyper.sim('hst-drag-rise', {
    title: 'Drag rise: straight, swept and supercritical wings',
    blurb: `Four wings with the same thickness and lift coefficient, differing only in sweep and in the kind of section. The drag-divergence Mach number of each comes from the Korn equation, $M_{dd} = \\kappa_A/\\cos\\Lambda - (t/c)/\\cos^2\\Lambda - c_l/(10\\cos^3\\Lambda)$, with $\\kappa_A = 0.87$ for a conventional section and $0.95$ for a supercritical one. Above the critical Mach number, taken as $M_{dd} - 0.108$, the wave drag grows as Lock's fourth-power law $\\Delta C_D = 20\\,(M - M_{crit})^4$. Everything else is lumped into a fixed $C_D = 0.020$. One drag count is 0.0001.

**Try this**
- At Mach 0.70 the straight conventional wing is already at its drag divergence; the others are still clean.
- Sweep the swept wings from 0° to 35°: their curves move right. The normal Mach number $M\\cos\\Lambda$ is what the section feels.
- Compare "swept, conventional" with "straight, supercritical": a good section buys about as much as 25–30° of sweep.
- Make the wings thinner (8 %) or lower the lift coefficient — both delay the rise. Airliners combine all three: about 25–30° of sweep, 10–12 % supercritical sections and cruise just below $M_{dd}$.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.32, minH: 190 });
      const plot = kit.plot(plotBox(box), { x: { label: 'flight Mach number', min: 0.5, max: 0.98 }, y: { label: 'drag coefficient C_D', min: 0, max: 0.07 }, legend: true }, 220);
      const ctl = kit.controls(box.side, [
        { id: 'M', label: 'Flight Mach number', min: 0.5, max: 0.98, step: 0.005, value: num(P.M, 0.78) },
        { id: 'sweep', label: 'Sweep of the swept wings Λ', min: 0, max: 45, step: 1, value: num(P.sweep, 30), unit: '°' },
        { id: 'tc', label: 'Thickness t/c', min: 6, max: 16, step: 0.5, value: 12, unit: '%' },
        { id: 'cl', label: 'Lift coefficient c_l', min: 0, max: 0.8, step: 0.05, value: 0.5 }
      ], () => update());
      const ro = kit.readout(box.side, [['a', 'Straight, conventional'], ['b', 'Swept, conventional'], ['c', 'Straight, supercritical'], ['d', 'Swept, supercritical'], ['mn', 'Normal Mach number M cos Λ'], ['note', '']]);
      const V = ctl.values, CD0 = 0.02;
      const wings = [
        { key: 'a', name: 'Straight, conventional', kA: 0.87, swept: false, sc: false },
        { key: 'b', name: 'Swept, conventional', kA: 0.87, swept: true, sc: false },
        { key: 'c', name: 'Straight, supercritical', kA: 0.95, swept: false, sc: true },
        { key: 'd', name: 'Swept, supercritical', kA: 0.95, swept: true, sc: true }];
      const korn = (kA, L, tc, cl) => { const c = Math.cos(L); return kA / c - tc / (c * c) - cl / (10 * c * c * c); };
      const dCD = (M, Mcr) => M > Mcr ? 20 * Math.pow(M - Mcr, 4) : 0;
      const fm = v => v > 0.98 ? 'above 0.98' : v.toFixed(3);
      function update() {
        for (const w of wings) {
          w.L = w.swept ? V.sweep * D2R : 0;
          w.Mdd = korn(w.kA, w.L, V.tc / 100, V.cl); w.Mcr = w.Mdd - 0.1077;
          w.dcd = dCD(V.M, w.Mcr);
          w.state = V.M < w.Mcr ? 0 : V.M < w.Mdd ? 1 : 2;
        }
        const series = wings.map(w => {
          const pts = [];
          for (let m = 0.5; m <= 0.9801; m += 0.002) { const v = CD0 + dCD(m, w.Mcr); pts.push([m, v]); if (v > 0.08) break; }
          return { pts, label: w.name, width: 2.4 };
        });
        const marks = wings.filter(w => w.Mdd >= 0.5 && w.Mdd <= 0.98).map(w => ({ x: w.Mdd, y: CD0 + dCD(w.Mdd, w.Mcr), r: 4 }));
        plot.set({ series, vlines: [{ x: V.M, label: 'flight Mach' }], marks });
        for (const w of wings) ro.set(w.key, 'M_dd ' + fm(w.Mdd) + ' · now +' + Math.round(w.dcd * 1e4) + ' counts');
        ro.set('mn', (V.M * Math.cos(V.sweep * D2R)).toFixed(3) + ' at Λ = ' + V.sweep.toFixed(0) + '°');
        ro.set('note', V.cl === 0 && V.tc <= 7 ? 'The Korn equation is an empirical fit: trust it for about 0.6–0.9' : 'Dots on the curves mark each drag-divergence Mach number');
        loop.once();
      }
      const statusText = ['subcritical', 'shock on the wing', 'past drag divergence'];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (wings[0].Mdd == null) return;
        const pw = st.W / 4;
        wings.forEach((w, i) => {
          const col = C.series[i % C.series.length], sc = [C.ok, C.warn, C.bad][w.state];
          const cx = pw * (i + 0.5), cy = st.H * 0.4;
          const b = Math.min(st.H * 0.3, pw * 0.34), cr = Math.min(pw * 0.3, b * 0.95), ct = cr * 0.4, tl = Math.tan(w.L);
          const xr = cx - cr * 0.7;
          const half = sgn => [[xr, cy], [xr + b * tl, cy - sgn * b], [xr + b * tl + ct, cy - sgn * b], [xr + cr, cy]];
          for (const sgn of [1, -1]) {
            const q = half(sgn);
            c.beginPath(); q.forEach((p, k) => k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.closePath();
            c.globalAlpha = 0.28; c.fillStyle = sc; c.fill(); c.globalAlpha = 1;
            c.strokeStyle = col; c.lineWidth = 2; c.stroke();
            if (w.state > 0) {
              // the shock lies across the span and moves aft as the Mach number rises
              const f = clamp(0.35 + 0.5 * (V.M - w.Mcr) / Math.max(0.02, w.Mdd + 0.05 - w.Mcr), 0.35, 0.92);
              const r0 = [xr + f * cr, cy], r1 = [xr + b * tl + f * ct, cy - sgn * b * 0.92];
              if (w.state === 2) {
                c.beginPath(); c.moveTo(r0[0], r0[1]); c.lineTo(r1[0], r1[1]); c.lineTo(xr + b * tl + ct, cy - sgn * b * 0.92); c.lineTo(xr + cr, cy); c.closePath();
                c.globalAlpha = 0.3; c.fillStyle = C.bad; c.fill(); c.globalAlpha = 1;
              }
              c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(r0[0], r0[1]); c.lineTo(r1[0], r1[1]); c.stroke();
            }
          }
          c.strokeStyle = C.muted; c.lineWidth = 5; c.lineCap = 'round';
          c.beginPath(); c.moveTo(cx - pw * 0.4, cy); c.lineTo(cx + pw * 0.36, cy); c.stroke(); c.lineCap = 'butt';
          // section sketch: conventional (rounded, cambered) or supercritical (flat top, aft camber)
          const sx = cx - 26, sy = st.H * 0.86, sl = 52;
          c.beginPath();
          if (w.sc) { c.moveTo(sx, sy); c.bezierCurveTo(sx + 2, sy - 7, sx + sl * 0.2, sy - 7, sx + sl * 0.55, sy - 7); c.bezierCurveTo(sx + sl * 0.85, sy - 7, sx + sl * 0.95, sy - 3, sx + sl, sy - 1); c.bezierCurveTo(sx + sl * 0.8, sy + 1, sx + sl * 0.7, sy + 5, sx + sl * 0.5, sy + 5); c.bezierCurveTo(sx + sl * 0.2, sy + 5, sx + 2, sy + 5, sx, sy); }
          else { c.moveTo(sx, sy); c.bezierCurveTo(sx + 2, sy - 9, sx + sl * 0.35, sy - 9, sx + sl * 0.5, sy - 8); c.bezierCurveTo(sx + sl * 0.75, sy - 6, sx + sl * 0.9, sy - 2, sx + sl, sy); c.bezierCurveTo(sx + sl * 0.75, sy + 2, sx + sl * 0.35, sy + 5, sx + sl * 0.2, sy + 5); c.bezierCurveTo(sx + 4, sy + 5, sx, sy + 3, sx, sy); }
          c.closePath(); c.fillStyle = C.surface; c.fill(); c.strokeStyle = col; c.lineWidth = 1.4; c.stroke();
          kit.label(c, w.name, cx, 12, { size: 12, weight: 700, color: C.text });
          kit.label(c, 'M_dd ' + fm(w.Mdd), cx, st.H * 0.74, { size: 11.5, color: C.muted });
          kit.label(c, statusText[w.state], cx + 36, st.H * 0.86, { size: 11.5, weight: 700, color: sc, align: 'left' });
        });
        kit.label(c, 'M = ' + V.M.toFixed(3) + '  →', 8, st.H - 8, { align: 'left', size: 12, color: C.muted, baseline: 'bottom' });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ area rule */
  Hyper.sim('hst-area-rule', {
    title: 'The area rule: a delta fighter cut into slices',
    blurb: `An aircraft shaped like the Convair F-102A: a 20 m fuselage of 2 m diameter and a 60° delta wing. A plane sweeps along it; the graph shows the cross-sectional area $A(x)$ of every slice. Near Mach 1 the wave drag depends on that area distribution alone — slender-body theory gives $D/q = \\tfrac{\\pi}{4}\\sum n\\,a_n^2$ from the Fourier coefficients of $A'(x)$ — and the least drag for a given length and volume belongs to the smooth Sears–Haack body, $D/q = 128\\,V^2/(\\pi \\ell^4)$.

**Try this**
- With no waisting, the wing adds a hump to $A(x)$ and the wave drag is almost three times that of the fuselage alone.
- Waist the fuselage by 100 %: it loses exactly the area the wing and fin add, the total area becomes the fuselage's again, and so does the wave drag. That is Whitcomb's area rule — the "coke-bottle" fuselage of the F-102A.
- Thicken the wing to 8 %: the hump grows, and the drag grows faster still — nearly doubling.
- Compare with the Sears–Haack body of the same length and volume: even the plain fuselage is not ideal, because it gains and loses its area over a short nose and tail instead of gradually.`,
    mount(box, kit, params) {
      const F = kit.fluid, P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const plot = kit.plot(plotBox(box), { x: { label: 'station x from the nose (m)', min: 0, max: 20 }, y: { label: 'cross-sectional area A(x) (m²)', min: 0 }, legend: true }, 200);
      const ctl = kit.controls(box.side, [
        { id: 'waist', label: 'Fuselage waisting (share of wing and fin area removed)', min: 0, max: 100, step: 5, value: num(P.waist, 0), unit: '%' },
        { id: 'tau', label: 'Wing and fin thickness t/c', min: 3, max: 8, step: 0.5, value: 5, unit: '%' },
        { id: 'fin', type: 'check', label: 'Include the fin', value: true },
        { id: 'run', type: 'check', label: 'Sweep the cutting plane', value: true }
      ], () => build());
      const ro = kit.readout(box.side, [['dq', 'Wave-drag area D/q, whole aircraft'], ['fus', 'Fuselage alone'], ['sh', 'Sears–Haack body, same length and volume'], ['D', 'Wave drag near Mach 1 at 11 000 m'], ['vol', 'Volume · largest section'], ['cut', 'Section at the cutting plane']]);
      const V = ctl.values;
      const L = 20, Rf = 1.0, xn = 6, xb = 15, N = 400, h = L / N;
      const tanLE = Math.tan(60 * D2R), xle0 = 7.5, cr = 9, ct = 1, bs = (cr - ct) / tanLE, xte = xle0 + cr;
      const hf = 3, xfl = 13.5, cfr = 5, tFL = Math.tan(50 * D2R), tFT = Math.tan(20 * D2R);
      const qM1 = 0.7 * F.isa(11000).p;          // q = γpM²/2 at Mach 1
      const rf = x => x <= 0 || x >= L ? 0 : x < xn ? Rf * (1 - (1 - x / xn) ** 2) : x < xb ? Rf : Rf * (1 - ((x - xb) / (L - xb)) ** 2);
      const wingT = (x, y, tau) => { const xle = xle0 + y * tanLE, c = cr - y * tanLE; if (c <= 0 || x <= xle || x >= xle + c) return 0; const xi = (x - xle) / c; return 4 * tau * c * xi * (1 - xi); };
      const finT = (x, z, tau) => { const xle = xfl + z * tFL, xt = xfl + cfr + z * tFT, c = xt - xle; if (x <= xle || x >= xt) return 0; const xi = (x - xle) / c; return 4 * tau * c * xi * (1 - xi); };
      function wingA(x, tau) { let A = 0; const n = 80, dy = bs / n; for (let j = 0; j < n; j++) A += wingT(x, (j + 0.5) * dy, tau) * dy; return 2 * A; }
      function finA(x, tau) { let A = 0; const n = 50, dz = hf / n; for (let j = 0; j < n; j++) A += finT(x, (j + 0.5) * dz, tau) * dz; return A; }
      function waveDragArea(A) {
        const Sp = new Float64Array(N + 1);
        for (let i = 0; i <= N; i++) { const i0 = Math.max(0, i - 1), i1 = Math.min(N, i + 1); Sp[i] = (A[i1] - A[i0]) / ((i1 - i0) * h); }
        const K = 720, NM = 60, an = new Float64Array(NM + 1);
        for (let k = 0; k < K; k++) {
          const th = (k + 0.5) * Math.PI / K, x = L / 2 * (1 - Math.cos(th)), fi = x / h, i = Math.min(N - 1, Math.floor(fi)), u = fi - i;
          const s = Sp[i] * (1 - u) + Sp[i + 1] * u;
          for (let n = 1; n <= NM; n++) an[n] += s * Math.sin(n * th) * 2 / K;
        }
        let d = 0; for (let n = 1; n <= NM; n++) d += n * an[n] * an[n];
        return Math.PI / 4 * d;
      }
      let xs = [], Af0 = [], Af = [], Aw = [], Afi = [], tot = [], vol = 0, dq = 0, dq0 = 0, dqsh = 0, xcut = 11;
      function build() {
        const tau = V.tau / 100, w = V.waist / 100;
        xs = []; Af0 = []; Af = []; Aw = []; Afi = []; tot = [];
        for (let i = 0; i <= N; i++) {
          const x = i * h, a0 = Math.PI * rf(x) ** 2, aw = wingA(x, tau), afn = V.fin ? finA(x, tau) : 0;
          const af = Math.max(a0 - w * (aw + afn), 0.3 * a0);
          xs.push(x); Af0.push(a0); Aw.push(aw); Afi.push(afn); Af.push(af); tot.push(af + aw + afn);
        }
        vol = 0; for (let i = 0; i < N; i++) vol += (tot[i] + tot[i + 1]) / 2 * h;
        dq = waveDragArea(tot); dq0 = waveDragArea(Af0); dqsh = 128 * vol * vol / (Math.PI * L ** 4);
        ro.set('dq', dq.toFixed(2) + ' m²  (' + (dq / dq0).toFixed(2) + ' × fuselage alone)');
        ro.set('fus', dq0.toFixed(2) + ' m²');
        ro.set('sh', dqsh.toFixed(2) + ' m²');
        ro.set('D', (dq * qM1 / 1000).toFixed(1) + ' kN  (q = ' + (qM1 / 1000).toFixed(1) + ' kPa)');
        ro.set('vol', vol.toFixed(1) + ' m³ · ' + Math.max(...tot).toFixed(2) + ' m²');
        drawPlot();
        loop.once();
      }
      const at = (arr, x) => { const fi = clamp(x / h, 0, N), i = Math.min(N - 1, Math.floor(fi)), u = fi - i; return arr[i] * (1 - u) + arr[i + 1] * u; };
      function drawPlot() {
        const shA = xs.map(x => { const e = x / L; return 16 * vol / (3 * Math.PI * L) * Math.pow(Math.max(0, 4 * e * (1 - e)), 1.5); });
        const pick = arr => xs.map((x, i) => [x, arr[i]]).filter((p, i) => i % 2 === 0);
        plot.set({ series: [
          { pts: pick(tot), label: 'whole aircraft', width: 2.8 },
          { pts: pick(Af), label: V.waist > 0 ? 'fuselage (waisted)' : 'fuselage', dash: [6, 4] },
          { pts: pick(Aw.map((v, i) => v + Afi[i])), label: 'wing + fin', width: 1.6 },
          { pts: pick(shA), label: 'Sears–Haack, same volume', dash: [2, 3] }
        ], vlines: [{ x: xcut, label: 'cut' }] });
      }
      let last = 0;
      const loop = kit.loop((dt, t) => {
        if (V.run && dt > 0) { xcut += dt * 2.2; if (xcut > L) xcut = 0; if (t - last > 0.08) { last = t; drawPlot(); } }
        const c = st.begin(), C = kit.colors();
        if (!xs.length) return;
        const sc = Math.min(st.W * 0.66 / L, st.H * 0.86 / (2 * (Rf + bs))), x0 = st.W * 0.03, cy = st.H / 2;
        const X = x => x0 + x * sc;
        // wing (drawn from the centreline; the fuselage covers the root)
        c.beginPath();
        for (const sg of [1, -1]) {
          c.moveTo(X(xle0 - Rf * tanLE), cy); c.lineTo(X(xle0 + bs * tanLE), cy - sg * (Rf + bs) * sc); c.lineTo(X(xte), cy - sg * (Rf + bs) * sc); c.lineTo(X(xte), cy);
        }
        c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.4; c.stroke();
        // fuselage outline from its (waisted) area
        c.beginPath();
        for (let i = 0; i <= N; i += 2) { const r = Math.sqrt(Af[i] / Math.PI) * sc; i ? c.lineTo(X(xs[i]), cy - r) : c.moveTo(X(xs[i]), cy - r); }
        for (let i = N; i >= 0; i -= 2) { const r = Math.sqrt(Af[i] / Math.PI) * sc; c.lineTo(X(xs[i]), cy + r); }
        c.closePath(); c.fillStyle = C.bg2; c.fill(); c.globalAlpha = 0.5; c.fillStyle = C.surface; c.fill(); c.globalAlpha = 1; c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke();
        if (V.fin) { c.strokeStyle = C.muted; c.lineWidth = 3; c.beginPath(); c.moveTo(X(xfl), cy); c.lineTo(X(xfl + cfr + hf * tFT), cy); c.stroke(); }
        // the cutting plane
        c.strokeStyle = C.accent; c.lineWidth = 2; c.setLineDash([6, 4]);
        c.beginPath(); c.moveTo(X(xcut), 8); c.lineTo(X(xcut), st.H - 8); c.stroke(); c.setLineDash([]);
        // the section at the cut, seen from the front (thickness exaggerated ×3)
        const ix = st.W * 0.855, iy = st.H * 0.55, s2 = Math.min(st.W * 0.13 / (Rf + bs), st.H * 0.36 / (Rf + hf)), ex = 3;
        const rc = Math.sqrt(at(Af, xcut) / Math.PI), tau = V.tau / 100;
        c.fillStyle = C.accent; c.globalAlpha = 0.5;
        c.beginPath(); c.arc(ix, iy, Math.max(0.5, rc * s2), 0, 2 * Math.PI); c.fill();
        for (const sg of [1, -1]) {
          c.beginPath(); let started = false;
          const ys = []; for (let j = 0; j <= 60; j++) ys.push(Rf + bs * j / 60);
          const upper = ys.map(y => [ix + sg * y * s2, iy - wingT(xcut, y - Rf, tau) / 2 * ex * s2]);
          const lower = ys.map(y => [ix + sg * y * s2, iy + wingT(xcut, y - Rf, tau) / 2 * ex * s2]);
          upper.forEach(p => { if (!started) { c.moveTo(p[0], p[1]); started = true; } else c.lineTo(p[0], p[1]); });
          for (let j = lower.length - 1; j >= 0; j--) c.lineTo(lower[j][0], lower[j][1]);
          c.closePath(); c.fill();
        }
        if (V.fin) {
          c.beginPath();
          for (let j = 0; j <= 40; j++) { const z = hf * j / 40; c.lineTo(ix + finT(xcut, z, tau) / 2 * ex * s2, iy - (Rf + z) * s2); }
          for (let j = 40; j >= 0; j--) { const z = hf * j / 40; c.lineTo(ix - finT(xcut, z, tau) / 2 * ex * s2, iy - (Rf + z) * s2); }
          c.closePath(); c.fill();
        }
        c.globalAlpha = 1;
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(st.W * 0.72, 8, st.W * 0.27, st.H - 16);
        const Acut = at(tot, xcut);
        ro.set('cut', 'x = ' + xcut.toFixed(1) + ' m: ' + Acut.toFixed(2) + ' m²');
        kit.label(c, 'section at x = ' + xcut.toFixed(1) + ' m', st.W * 0.855, 20, { size: 11.5, color: C.text, weight: 700 });
        kit.label(c, 'A = ' + Acut.toFixed(2) + ' m²  (thickness ×3)', st.W * 0.855, st.H - 20, { size: 11, color: C.muted });
        kit.label(c, 'top view', 10, 14, { align: 'left', size: 11.5, color: C.muted });
        kit.label(c, V.waist > 0 ? 'waisted "coke-bottle" fuselage' : 'plain fuselage', 10, st.H - 12, { align: 'left', size: 11.5, color: V.waist > 0 ? C.ok : C.muted, weight: 700 });
      }, box.stage);
      build();
      loop.start();
    }
  });

  /* ================================================================ sweep */
  Hyper.sim('hst-sweep', {
    title: 'A swept wing and the Mach cone',
    blurb: `A swept wing seen from above, with the air coming from the left. The free stream splits into a part normal to the leading edge, $M\\cos\\Lambda$, which the airfoil sections feel, and a part along the span, $M\\sin\\Lambda$, which slides along the wing and does almost nothing. Particles show the streamlines curving outboard near the leading edge and back inboard further aft (exaggerated). Above Mach 1 the Mach cone from the apex appears.

**Try this**
- At Mach 0.85 and 30° of sweep the sections feel only Mach 0.74: an airfoil good to 0.75 stays subcritical.
- Raise the Mach number past 1. With 60° of sweep at Mach 1.6 the leading edge lies inside the Mach cone — a **subsonic leading edge**, which may be round like a subsonic wing's.
- Now unsweep the wing: the leading edge pokes out of the cone, becomes **supersonic**, and must be sharp. The boundary is $M\\cos\\Lambda = 1$.
- On the graph, follow the dot: below the lower curve the sections are subcritical; above the upper one the leading edge is supersonic.`,
    mount(box, kit, params) {
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 240 });
      const plot = kit.plot(plotBox(box), { x: { label: 'sweep angle Λ (°)', min: 0, max: 70 }, y: { label: 'free-stream Mach number', min: 0.5, max: 3 }, legend: true }, 180);
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Leading-edge sweep Λ', min: 0, max: 70, step: 1, value: num(P.sweep, 30), unit: '°' },
        { id: 'M', label: 'Mach number', min: 0.5, max: 2.5, step: 0.01, value: num(P.M, 0.85) },
        { id: 'm0', label: 'Critical Mach of the unswept section', min: 0.6, max: 0.8, step: 0.01, value: 0.7 }
      ], () => update());
      const ro = kit.readout(box.side, [['mn', 'Normal component M cos Λ'], ['mt', 'Spanwise component M sin Λ'], ['mu', 'Mach angle μ'], ['le', 'Leading edge'], ['mcr', 'Critical Mach, ideal swept wing'], ['note', '']]);
      const V = ctl.values;
      function update() {
        const L = V.L * D2R, mn = V.M * Math.cos(L), mcr = V.m0 / Math.cos(L);
        const sonic = [], crit = [];
        for (let d = 0; d <= 70.01; d += 1) { const cl = Math.cos(d * D2R); sonic.push([d, 1 / cl]); crit.push([d, V.m0 / cl]); }
        plot.set({ series: [{ pts: sonic, label: 'sonic leading edge: M cos Λ = 1' }, { pts: crit, label: 'ideal critical Mach: M_crit,0 / cos Λ', dash: [6, 4] }], marks: [{ x: V.L, y: V.M, label: 'this wing' }] });
        ro.set('mn', mn.toFixed(3));
        ro.set('mt', (V.M * Math.sin(L)).toFixed(3));
        ro.set('mu', V.M > 1 ? (Math.asin(1 / V.M) / D2R).toFixed(1) + '°' : 'no Mach cone below Mach 1');
        ro.set('le', mn < 1 ? (V.M > 1 ? 'subsonic (inside the Mach cone)' : 'subsonic') : 'supersonic (outside the Mach cone)');
        ro.set('mcr', mcr > 3 ? 'above 3' : mcr.toFixed(3));
        ro.set('note', mn < V.m0 ? 'Sections subcritical: no shocks on the wing' : mn < 1 ? 'Sections supercritical: shocks and drag rise' : 'Supersonic leading edge: wave drag from the edge itself');
      }
      const parts = [];
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        const L = V.L * D2R, cL = Math.cos(L), sL = Math.sin(L), tl = Math.tan(L);
        const cy = st.H / 2, ax = st.W * 0.2, chord = st.W * 0.16;
        const b = Math.min(st.H * 0.42, (st.W * 0.74 - chord) / Math.max(tl, 0.01));
        // Mach cone
        if (V.M > 1) {
          const mu = Math.asin(1 / V.M), len = st.W - ax, dy = len * Math.tan(mu);
          c.beginPath(); c.moveTo(ax, cy); c.lineTo(st.W, cy - dy); c.lineTo(st.W, cy + dy); c.closePath();
          c.globalAlpha = 0.1; c.fillStyle = C.warn; c.fill(); c.globalAlpha = 1;
          c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([7, 5]);
          c.beginPath(); c.moveTo(ax, cy); c.lineTo(st.W, cy - dy); c.moveTo(ax, cy); c.lineTo(st.W, cy + dy); c.stroke(); c.setLineDash([]);
          kit.label(c, 'Mach cone, μ = ' + (mu / D2R).toFixed(1) + '°', st.W - 10, Math.max(14, cy - dy + 14), { align: 'right', size: 11.5, color: C.warn, weight: 700 });
        }
        // the wing
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        for (const sg of [1, -1]) {
          c.beginPath(); c.moveTo(ax, cy); c.lineTo(ax + b * tl, cy - sg * b); c.lineTo(ax + b * tl + chord, cy - sg * b); c.lineTo(ax + chord, cy); c.closePath(); c.fill(); c.stroke();
        }
        c.strokeStyle = C.muted; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(ax - st.W * 0.1, cy); c.lineTo(ax + chord + b * tl * 0.2 + st.W * 0.05, cy); c.stroke(); c.lineCap = 'butt';
        const mn = V.M * cL;
        c.strokeStyle = mn < 1 ? C.ok : C.bad; c.lineWidth = 3;
        c.beginPath(); c.moveTo(ax, cy); c.lineTo(ax + b * tl, cy - b); c.moveTo(ax, cy); c.lineTo(ax + b * tl, cy + b); c.stroke();
        // particles, with the normal component slowed at the leading edge and speeded up over the chord
        const U = 70 + 30 * Math.min(V.M, 1.5);
        const f = xi => -0.55 * Math.exp(-Math.pow(xi / 0.1, 2)) + (xi > 0 && xi < 1 ? 0.45 * Math.sin(Math.PI * xi) * Math.exp(-1.2 * xi) : 0);
        while (parts.length < 150) parts.push({ x: Math.random() * st.W, y: cy + (Math.random() * 2 - 1) * b * 1.05 });
        const sub = 3, hstep = Math.min(dt, 0.05) / sub;
        c.fillStyle = C.dark ? 'hsl(200 80% 70% / .8)' : 'hsl(210 80% 42% / .75)';
        for (const q of parts) {
          for (let k = 0; k < sub; k++) {
            const sg = q.y <= cy ? 1 : -1, Xr = q.x - ax, Y = sg * (cy - q.y);
            const d = Xr * cL - Y * sL, spn = Xr * sL + Y * cL, cn = chord * cL;
            let du = 0;
            if (spn > 0 && spn < b / Math.max(cL, 0.05) && Y < b) { const fade = Math.pow(Math.sin(Math.PI * clamp(Y / b, 0, 1)), 0.4); du = 1.6 * U * cL * f(d / cn) * fade; }
            q.x += (U + du * cL) * hstep; q.y += sg * du * sL * hstep;
          }
          if (q.x > st.W || q.y < 0 || q.y > st.H) { q.x = Math.random() * 20; q.y = cy + (Math.random() * 2 - 1) * b * 1.05; }
          c.fillRect(q.x - 1.3, q.y - 1.3, 2.6, 2.6);
        }
        // the free stream split at the middle of the upper leading edge
        const Q = [ax + 0.55 * b * tl, cy - 0.55 * b], Lv = Math.min(110, st.W * 0.14), T = [Q[0] - Lv, Q[1]];
        const N1 = [T[0] + Lv * cL * cL, T[1] + Lv * cL * sL];
        kit.arrow(c, T[0], T[1], Q[0], Q[1], C.text, 2.4);
        kit.arrow(c, T[0], T[1], N1[0], N1[1], C.accent, 2.4);
        kit.arrow(c, N1[0], N1[1], Q[0], Q[1], C.muted, 2);
        kit.label(c, 'M = ' + V.M.toFixed(2), T[0] - 4, T[1] - 10, { align: 'right', size: 12, color: C.text, weight: 700 });
        kit.label(c, 'M cos Λ = ' + mn.toFixed(2), N1[0] - 6, N1[1] + 14, { align: 'right', size: 12, color: C.accent, weight: 700 });
        kit.label(c, 'M sin Λ', (N1[0] + Q[0]) / 2 + 8, (N1[1] + Q[1]) / 2, { align: 'left', size: 11.5, color: C.muted });
        kit.label(c, 'Λ = ' + V.L.toFixed(0) + '°', 10, 14, { align: 'left', size: 13, weight: 700, color: C.text });
        kit.label(c, mn < 1 ? 'subsonic leading edge' : 'supersonic leading edge', 10, 32, { align: 'left', size: 12, weight: 700, color: mn < 1 ? C.ok : C.bad });
      }, box.stage);
      update();
      loop.start();
    }
  });

  /* ================================================================ diamond airfoil */
  // turn a supersonic stream by a compression c > 0 (oblique shock) or an expansion c < 0 (Prandtl–Meyer fan)
  function turnFlow(F, M, p, c) {
    if (c > 1e-9) { const s = F.obliqueShock(M, c); if (s.detached) return null; return { M: s.M2, p: p * s.p2p1, kind: 'shock', beta: s.beta, thetaMax: s.thetaMax }; }
    if (c < -1e-9) { const M2 = F.machFromNu(F.prandtlMeyer(M) - c); return { M: M2, p: p * F.isentropic(M).p0p / F.isentropic(M2).p0p, kind: 'fan' }; }
    return { M, p, kind: 'none' };
  }
  Hyper.sim('hst-diamond', {
    title: 'A diamond airfoil at supersonic speed',
    blurb: `A symmetric double-wedge ("diamond") airfoil of half-angle $\\varepsilon$ at angle of attack $\\alpha$, solved by **shock-expansion theory**: an oblique shock or a Prandtl–Meyer fan at the leading edge, a fan at each shoulder, and trailing-edge waves that bring both streams to the same pressure along a slip line. Its lift and wave drag are compared with Ackeret's linear theory, $c_l = 4\\alpha/\\sqrt{M^2-1}$ and $c_d = 4(\\alpha^2 + \\tau^2)/\\sqrt{M^2-1}$ with $\\tau = t/c$. Wave interactions away from the airfoil are left out.

**Try this**
- At Mach 2, 2° and $\\varepsilon$ = 3°, the two theories agree to about 1 % — thin airfoils are linear.
- Raise $\\alpha$ above $\\varepsilon$: the upper leading edge now meets an expansion fan instead of a shock.
- Lower the Mach number towards 1.2 with a thick diamond: the nose needs more turning than an attached shock can give, and the shock detaches into a bow wave.
- Switch the view to **schlieren**: shocks are sharp dark lines, fans soft bright bands, as in a real tunnel photograph. The **shadowgraph** shows each shock as a dark-and-bright pair.
- Find the best $L/D$: at fixed thickness it comes at $\\alpha \\approx \\tau$ and equals about $1/(2\\tau)$.`,
    mount(box, kit, params) {
      const F = kit.fluid, P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'M', label: 'Mach number M∞', min: 1.2, max: 4, step: 0.05, value: num(P.M, 2) },
        { id: 'alpha', label: 'Angle of attack α', min: -4, max: 10, step: 0.25, value: num(P.alpha, 2), unit: '°' },
        { id: 'eps', label: 'Half-angle ε', min: 1, max: 10, step: 0.25, value: num(P.eps, 3), unit: '°' },
        { id: 'view', type: 'select', label: 'Show', options: [['Pressure field and waves', 'pressure'], ['Schlieren (vertical knife edge)', 'schlieren'], ['Shadowgraph', 'shadow']], value: ['pressure', 'schlieren', 'shadow'].includes(P.view) ? P.view : 'pressure' }
      ], id => { if (id === 'view') { paint(); loop.once(); } else solve(); });
      const ro = kit.readout(box.side, [['up', 'Upper surface, front → rear'], ['lo', 'Lower surface, front → rear'], ['cl', 'Lift c_l: shock-expansion · Ackeret'], ['cd', 'Wave drag c_d: shock-expansion · Ackeret'], ['ld', 'Lift-to-drag ratio'], ['beta', 'Leading-edge shock angles (upper · lower)'], ['tc', 'Thickness ratio t/c = tan ε'], ['note', '']]);
      const V = ctl.values;
      let S = null, grid = null, off = null, octx = null, gw = 0, gh = 0, cs = 4;
      const parts = [];
      const geom = () => ({ K: st.W * 0.34, ox: st.W * 0.42, oy: st.H * 0.5 });
      function solve() {
        const M = V.M, al = V.alpha * D2R, ep = V.eps * D2R, tE = Math.tan(ep), ca = Math.cos(al), sa = Math.sin(al);
        const rot = (x, y) => { const dx = x - 0.5; return [0.5 + dx * ca + y * sa, -dx * sa + y * ca]; };
        const fr = { M, p: 1, kind: 'none' };
        const phUF = ep - al, phUR = -ep - al, phLF = -ep - al, phLR = ep - al;
        const UF = turnFlow(F, M, 1, phUF), LF = turnFlow(F, M, 1, -phLF);
        const thMax = F.obliqueShock(M, 0.001).thetaMax;
        if (!UF || !LF) { S = { detached: true, M, al, ep, tE, rot, thMax, need: Math.max(phUF, -phLF) }; field(); return; }
        const UR = turnFlow(F, UF.M, UF.p, -2 * ep), LR = turnFlow(F, LF.M, LF.p, -2 * ep);
        const pAfter = (st0, c) => { const r = turnFlow(F, st0.M, st0.p, c); return r ? r.p : st0.p * F.normalShock(st0.M).p2p1 * (1 + c); };
        let lo = phUR - 0.4, hi = phLR + 0.4;
        for (let k = 0; k < 60; k++) { const d = (lo + hi) / 2; if (pAfter(UR, d - phUR) - pAfter(LR, -(d - phLR)) > 0) hi = d; else lo = d; }
        const delta = (lo + hi) / 2;
        const TU = turnFlow(F, UR.M, UR.p, delta - phUR) || UR, TL = turnFlow(F, LR.M, LR.p, -(delta - phLR)) || LR;
        const qf = G * M * M / 2, cp = s => (s.p - 1) / qf;
        const cUF = cp(UF), cUR = cp(UR), cLF = cp(LF), cLR = cp(LR);
        const cn = (cLF + cLR - cUF - cUR) / 2, cax = tE * (cUF + cLF - cUR - cLR) / 2;
        const cl = cn * ca - cax * sa, cd = cn * sa + cax * ca, bM = Math.sqrt(M * M - 1);
        const LE = rot(0, 0), SU = rot(0.5, 0.5 * tE), SL = rot(0.5, -0.5 * tE), TE = rot(1, 0);
        const mu = m => Math.asin(1 / Math.max(1.0001, m));
        // one wave: from vertex Vx, the stream turns from (Min, φin) to (Mout, φout); s = +1 upper, −1 lower
        const wave = (Vx, a0, b0, phin, phout, s) => {
          if (b0.kind === 'shock') return { V: Vx, kind: 'shock', a: phin + s * b0.beta, s, a0, b0, phin, phout };
          if (b0.kind === 'fan') return { V: Vx, kind: 'fan', a1: phin + s * mu(a0.M), a2: phout + s * mu(b0.M), s, a0, b0, phin, phout };
          return { V: Vx, kind: 'none', a: phin + s * mu(a0.M), s, a0, b0, phin, phout };
        };
        const upper = { states: [fr, UF, UR, TU], phis: [0, phUF, phUR, delta], waves: [wave(LE, fr, UF, 0, phUF, 1), wave(SU, UF, UR, phUF, phUR, 1), wave(TE, UR, TU, phUR, delta, 1)] };
        const lower = { states: [fr, LF, LR, TL], phis: [0, phLF, phLR, delta], waves: [wave(LE, fr, LF, 0, phLF, -1), wave(SL, LF, LR, phLF, phLR, -1), wave(TE, LR, TL, phLR, delta, -1)] };
        S = { detached: false, M, al, ep, tE, rot, ca, sa, UF, UR, LF, LR, TU, TL, delta, cl, cd, clA: 4 * al / bM, cdA: 4 * (al * al + tE * tE) / bM, cUF, cUR, cLF, cLR, LE, SU, SL, TE, upper, lower, thMax };
        field();
      }
      // which side of the airfoil (and its slip line) a point is on: 1 upper, −1 lower, 0 inside
      function sideOf(p) {
        const dx = p[0] - 0.5, dy = p[1];
        const xa = 0.5 + dx * S.ca - dy * S.sa, ya = dx * S.sa + dy * S.ca;
        if (xa <= 0) return p[1] >= S.LE[1] ? 1 : -1;
        if (xa < 1) { const yu = (xa < 0.5 ? xa : 1 - xa) * S.tE; return ya > yu ? 1 : ya < -yu ? -1 : 0; }
        return Math.cos(S.delta) * (p[1] - S.TE[1]) - Math.sin(S.delta) * (p[0] - S.TE[0]) >= 0 ? 1 : -1;
      }
      const downOf = (p, Vx, ang, s) => s * (Math.cos(ang) * (p[1] - Vx[1]) - Math.sin(ang) * (p[0] - Vx[0])) < 0;
      // the state at a point: { M, p, phi }
      function stateAt(p) {
        const sd = sideOf(p);
        if (sd === 0) return null;
        const side = sd > 0 ? S.upper : S.lower;
        let k = 0;
        for (let w = 0; w < 3; w++) {
          const wv = side.waves[w];
          if (wv.kind === 'fan') {
            if (!downOf(p, wv.V, wv.a1, wv.s)) break;
            if (!downOf(p, wv.V, wv.a2, wv.s)) {
              // inside a centred fan: the Mach number whose characteristic passes through the point
              const psi = Math.atan2(p[1] - wv.V[1], p[0] - wv.V[0]), s = wv.s, nu0 = F.prandtlMeyer(wv.a0.M);
              const ang = m => wv.phin - s * (F.prandtlMeyer(m) - nu0) + s * Math.asin(1 / m);
              let m0 = wv.a0.M, m1 = wv.b0.M;
              for (let it = 0; it < 26; it++) { const mm = (m0 + m1) / 2; if ((ang(mm) - psi) * s > 0) m0 = mm; else m1 = mm; }
              const mm = (m0 + m1) / 2;
              return { M: mm, p: wv.a0.p * F.isentropic(wv.a0.M).p0p / F.isentropic(mm).p0p, phi: wv.phin - s * (F.prandtlMeyer(mm) - nu0) };
            }
            k = w + 1;
          } else {
            if (!downOf(p, wv.V, wv.a, wv.s)) break;
            k = w + 1;
          }
        }
        const s0 = side.states[k];
        return { M: s0.M, p: s0.p, phi: side.phis[k] };
      }
      function field() {
        const g = geom();
        cs = Math.max(3, Math.round(st.W / 190));
        gw = Math.ceil(st.W / cs); gh = Math.ceil(st.H / cs);
        grid = { p: new Float32Array(gw * gh), rho: new Float32Array(gw * gh), u: new Float32Array(gw * gh), v: new Float32Array(gw * gh), ins: new Uint8Array(gw * gh) };
        if (!S) return;
        const T0inf = F.isentropic(S.M).T0T;
        for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
          const k = j * gw + i, X = (i + 0.5) * cs, Y = (j + 0.5) * cs, p = [(X - g.ox) / g.K + 0.5, (g.oy - Y) / g.K];
          let s0;
          if (S.detached) {
            const dx = p[0] - 0.5, dy = p[1], xa = 0.5 + dx * Math.cos(S.al) - dy * Math.sin(S.al), ya = dx * Math.sin(S.al) + dy * Math.cos(S.al);
            const yu = xa > 0 && xa < 1 ? (xa < 0.5 ? xa : 1 - xa) * S.tE : -1;
            s0 = Math.abs(ya) <= yu ? null : { M: S.M, p: 1, phi: 0 };
          } else s0 = stateAt(p);
          if (!s0) { grid.ins[k] = 1; grid.p[k] = 1; grid.rho[k] = 1; continue; }
          const TT = T0inf / F.isentropic(s0.M).T0T, q = s0.M / S.M * Math.sqrt(TT);
          grid.p[k] = s0.p; grid.rho[k] = s0.p / TT; grid.u[k] = q * Math.cos(s0.phi); grid.v[k] = q * Math.sin(s0.phi);
        }
        paint();
        report();
      }
      function paint() {
        if (!grid) return;
        const C = kit.colors();
        off = document.createElement('canvas'); off.width = gw; off.height = gh; octx = off.getContext('2d');
        const img = octx.createImageData(gw, gh), d = img.data;
        let gmax = 1e-6, lmax = 1e-6;
        const gx = new Float32Array(gw * gh), lap = new Float32Array(gw * gh);
        for (let j = 1; j < gh - 1; j++) for (let i = 1; i < gw - 1; i++) {
          const k = j * gw + i;
          if (grid.ins[k] || grid.ins[k - 1] || grid.ins[k + 1] || grid.ins[k - gw] || grid.ins[k + gw]) continue;
          gx[k] = (grid.rho[k + 1] - grid.rho[k - 1]) / 2;
          lap[k] = grid.rho[k + 1] + grid.rho[k - 1] + grid.rho[k + gw] + grid.rho[k - gw] - 4 * grid.rho[k];
          gmax = Math.max(gmax, Math.abs(gx[k])); lmax = Math.max(lmax, Math.abs(lap[k]));
        }
        for (let k = 0; k < gw * gh; k++) {
          const o = 4 * k;
          if (V.view === 'pressure') {
            if (grid.ins[k]) { d[o + 3] = 0; continue; }
            const t = clamp((grid.p[k] - 1) / 0.6, -1, 1);
            if (t >= 0) { d[o] = 235; d[o + 1] = 85; d[o + 2] = 55; } else { d[o] = 60; d[o + 1] = 125; d[o + 2] = 235; }
            d[o + 3] = Math.round((C.dark ? 30 : 20) + 190 * Math.abs(t));
          } else {
            const val = V.view === 'schlieren' ? -gx[k] / (0.35 * gmax) : -lap[k] / (0.35 * lmax);
            const L = grid.ins[k] ? 30 : clamp(128 + 110 * clamp(val, -1, 1), 10, 245);
            d[o] = d[o + 1] = d[o + 2] = L; d[o + 3] = 255;
          }
        }
        octx.putImageData(img, 0, 0);
      }
      function report() {
        if (!S) return;
        if (S.detached) {
          for (const k of ['up', 'lo', 'cl', 'cd', 'ld', 'beta']) ro.set(k, '—');
          ro.set('tc', (S.tE * 100).toFixed(2) + ' %');
          ro.set('note', 'Shock detached: the nose needs ' + (S.need / D2R).toFixed(1) + '° of turning, but at Mach ' + S.M.toFixed(2) + ' an attached shock turns at most ' + (S.thMax / D2R).toFixed(1) + '°');
          return;
        }
        const fs = x => 'M ' + x.M.toFixed(2) + ', p/p∞ ' + x.p.toFixed(3);
        ro.set('up', fs(S.UF) + ' → ' + fs(S.UR));
        ro.set('lo', fs(S.LF) + ' → ' + fs(S.LR));
        ro.set('cl', S.cl.toFixed(4) + ' · ' + S.clA.toFixed(4));
        ro.set('cd', S.cd.toFixed(5) + ' · ' + S.cdA.toFixed(5));
        ro.set('ld', Math.abs(S.cd) > 1e-9 ? (S.cl / S.cd).toFixed(2) : '—');
        const bt = x => x.kind === 'shock' ? (x.beta / D2R).toFixed(1) + '°' : x.kind === 'fan' ? 'expansion fan' : 'Mach wave';
        ro.set('beta', bt(S.UF) + ' · ' + bt(S.LF));
        ro.set('tc', (S.tE * 100).toFixed(2) + ' %');
        ro.set('note', 'Shock-expansion theory is exact here if the waves do not meet; Ackeret is its first-order approximation');
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), g = geom();
        if (!S || !grid) return;
        if (off) { c.imageSmoothingEnabled = true; c.drawImage(off, 0, 0, gw * cs, gh * cs); }
        const P2 = q => [g.ox + (q[0] - 0.5) * g.K, g.oy - q[1] * g.K];
        const pressure = V.view === 'pressure';
        // particles follow the local flow
        if (pressure) {
          while (parts.length < 220) parts.push({ x: Math.random() * st.W, y: Math.random() * st.H });
          c.fillStyle = C.dark ? 'hsl(0 0% 92% / .7)' : 'hsl(220 30% 20% / .6)';
          for (const q of parts) {
            const i = Math.floor(q.x / cs), j = Math.floor(q.y / cs), k = j * gw + i;
            if (i < 0 || j < 0 || i >= gw || j >= gh || grid.ins[k]) { q.x = Math.random() * 12; q.y = Math.random() * st.H; continue; }
            q.x += grid.u[k] * g.K * 0.45 * dt; q.y -= grid.v[k] * g.K * 0.45 * dt;
            if (q.x > st.W || q.y < 0 || q.y > st.H) { q.x = Math.random() * 12; q.y = Math.random() * st.H; }
            c.fillRect(q.x - 1.2, q.y - 1.2, 2.4, 2.4);
          }
        }
        // the airfoil
        const poly = [[0, 0], [0.5, 0.5 * S.tE], [1, 0], [0.5, -0.5 * S.tE]].map(q => P2(S.rot(q[0], q[1])));
        c.beginPath(); poly.forEach((q, k) => k ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath();
        c.fillStyle = pressure ? C.surface : (C.dark ? '#111' : '#222'); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.6; c.stroke();
        const far = st.W * 2;
        const ray = (Vx, ang) => { const a = P2(Vx); return [a, [a[0] + far * Math.cos(ang), a[1] - far * Math.sin(ang)]]; };
        if (S.detached) {
          // a bow shock standing off the nose (schematic)
          const le = P2(S.rot(0, 0)), sd = 0.06 * g.K;
          c.strokeStyle = C.text; c.lineWidth = 2.4; c.beginPath();
          for (let k = -40; k <= 40; k++) { const y = k / 40 * st.H * 0.55, x = le[0] - sd + y * y / (g.K * 0.9); k === -40 ? c.moveTo(x, le[1] + y) : c.lineTo(x, le[1] + y); }
          c.stroke();
          kit.label(c, 'detached bow shock', le[0] - sd - 6, le[1] - st.H * 0.3, { align: 'right', size: 12, weight: 700, color: C.bad });
        } else if (pressure) {
          for (const side of [S.upper, S.lower]) for (const wv of side.waves) {
            if (wv.kind === 'shock') { const [a, b] = ray(wv.V, wv.a); c.strokeStyle = C.text; c.lineWidth = 2.2; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
            else if (wv.kind === 'fan') { c.strokeStyle = C.muted; c.lineWidth = 1; for (let n = 0; n <= 4; n++) { const [a, b] = ray(wv.V, wv.a1 + (wv.a2 - wv.a1) * n / 4); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); } }
          }
          const [a, b] = ray(S.TE, S.delta); c.setLineDash([5, 4]); c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.setLineDash([]);
          // face labels
          const lab = (x, y, n, s0) => { const q = P2(S.rot(x, y)); kit.label(c, 'M ' + s0.M.toFixed(2) + '  p/p∞ ' + s0.p.toFixed(2), q[0], q[1] + n * 16, { size: 11, color: C.text, bg: C.bg2 }); };
          lab(0.2, 0.2 * S.tE, -1, S.UF); lab(0.82, 0.18 * S.tE, -1, S.UR); lab(0.2, -0.2 * S.tE, 1, S.LF); lab(0.82, -0.18 * S.tE, 1, S.LR);
        }
        kit.label(c, 'M∞ = ' + S.M.toFixed(2) + '  →', 10, 14, { align: 'left', size: 13, weight: 700, color: pressure ? C.text : '#eee' });
        kit.label(c, pressure ? 'red: pressure above p∞ · blue: below' : V.view === 'schlieren' ? 'schlieren: ∂ρ/∂x — compressions dark, expansions light' : 'shadowgraph: ∇²ρ — every shock a dark-and-bright pair', 10, st.H - 10, { align: 'left', size: 11.5, color: pressure ? C.muted : '#ddd' });
      }, box.stage);
      st.onResize(() => { if (S) field(); });
      solve();
      loop.start();
    }
  });

  /* ================================================================ re-entry heating */
  // the upper atmosphere (US Standard Atmosphere 1976, rounded): altitude m, temperature K, density kg/m³
  const UPPER = [[50000, 270.65, 1.027e-3], [60000, 247.02, 3.097e-4], [70000, 219.59, 8.283e-5], [80000, 198.64, 1.846e-5], [90000, 186.87, 3.416e-6],
    [100000, 195.08, 5.604e-7], [110000, 240, 9.708e-8], [120000, 360, 2.222e-8], [130000, 469, 8.15e-9]];
  let UPTAB = null;
  function atmos(F, h) {
    if (h <= 47000) { const a = F.isa(Math.max(0, h)); return { T: a.T, rho: a.rho }; }
    if (!UPTAB) { const a = F.isa(47000); UPTAB = [[47000, a.T, a.rho]].concat(UPPER); }
    const tab = UPTAB;
    for (let i = 0; i < tab.length - 1; i++) {
      if (h <= tab[i + 1][0] || i === tab.length - 2) {
        const [h0, T0, r0] = tab[i], [h1, T1, r1] = tab[i + 1], u = (h - h0) / (h1 - h0);
        return { T: Math.max(150, T0 + (T1 - T0) * u), rho: r0 * Math.pow(r1 / r0, u) };
      }
    }
    return { T: 469, rho: 8.15e-9 };
  }
  Hyper.sim('hst-reentry', {
    title: 'Coming home: heating on a ballistic entry',
    blurb: `A vehicle without lift enters the atmosphere at 120 km. Drag slows it according to its ballistic coefficient $\\beta = m/(C_D A)$; gravity and the curvature of the Earth bend its path. The heat flux at the stagnation point follows the Sutton–Graves correlation $\\dot q = k\\sqrt{\\rho/R_n}\\,V^3$ with $k = 1.74\\times10^{-4}$ (SI) for air, and the wall temperature is the one at which a surface of emissivity 0.85 radiates that flux away. The density above 47 km comes from the US Standard Atmosphere.

**Try this**
- Compare the sharp cone with the capsule: a nose radius of 5 cm instead of several metres multiplies the heat flux by about $\\sqrt{R_1/R_2}$ — here tenfold.
- Steepen the entry angle: peak deceleration and peak heating both grow, but the heat pulse is shorter, so the total heat load falls. Shallow entries are gentle but long and hot in total.
- Watch the two graphs: the heating peaks *before* the deceleration, higher up.
- On the steep cone, change the ballistic coefficient: the peak deceleration hardly moves (Allen and Eggers showed that on a straight path it depends only on speed and angle), but a light, draggy vehicle slows down higher up, in thinner air, and heats far less.
- On shallow entries from orbit the path is not straight: gravity steepens it as the vehicle slows, and the peak rises to 8–9 g, twice the straight-line estimate.
- Real capsules fly with a little lift, which they use to stretch the deceleration and keep it near 4–7 g.`,
    mount(box, kit, params) {
      const F = kit.fluid, P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const pq = kit.plot(plotBox(box), { x: { label: 'time from 120 km (s)', min: 0 }, y: { label: 'heat flux (W/cm²)', min: 0 } }, 145);
      const pn = kit.plot(plotBox(box), { x: { label: 'time from 120 km (s)', min: 0 }, y: { label: 'deceleration (g)', min: 0 } }, 145);
      const PRE = {
        lunar: { V: 11, gam: 6.5, beta: 370, Rn: 4.7 },
        orbit: { V: 7.8, gam: 1.5, beta: 500, Rn: 2.5 },
        cone: { V: 7, gam: 25, beta: 8000, Rn: 0.05 },
        probe: { V: 12.9, gam: 8.2, beta: 60, Rn: 0.23 } };
      const p0 = PRE[P.preset] || PRE.lunar;
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Vehicle', options: [['Capsule at lunar-return speed', 'lunar'], ['Capsule from low orbit', 'orbit'], ['Slender sharp cone', 'cone'], ['Small sample-return probe, 12.9 km/s', 'probe'], ['Custom', 'custom']], value: PRE[P.preset] ? P.preset : 'lunar' },
        { id: 'V', label: 'Entry speed', min: 5, max: 20, step: 0.1, value: p0.V, unit: 'km/s' },
        { id: 'gam', label: 'Entry angle below horizontal', min: 0.5, max: 60, step: 0.5, value: p0.gam, unit: '°' },
        { id: 'beta', label: 'Ballistic coefficient m/(C_D A)', min: 20, max: 20000, value: p0.beta, unit: 'kg/m²', log: true, sig: 3 },
        { id: 'Rn', label: 'Nose radius', min: 0.02, max: 6, value: p0.Rn, unit: 'm', log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'replay', label: 'Replay', primary: true }] }
      ], (id, v) => {
        if (id === 'replay') { tp = 0; hold = 0; return; }
        if (id === 'preset') { const q = PRE[v]; if (q) { ctl.set('V', q.V); ctl.set('gam', q.gam); ctl.set('beta', q.beta); ctl.set('Rn', q.Rn); } }
        else ctl.set('preset', 'custom');
        run();
      });
      const ro = kit.readout(box.side, [['h', 'Altitude · downrange'], ['v', 'Speed · Mach number'], ['q', 'Stagnation-point heat flux'], ['tw', 'Radiative-equilibrium wall temperature (ε = 0.85)'], ['n', 'Deceleration'],
        ['Q', 'Heat load so far'], ['pk', 'Peak heating · peak deceleration'], ['ae', 'Allen–Eggers peak deceleration'], ['note', '']]);
      const V = ctl.values, RE = 6.371e6, g0 = 9.80665, KSG = 1.7415e-4, SB = 5.670374e-8, EPS = 0.85;
      let tr = null, tp = 0, hold = 0, lastPlot = -1;
      function run() {
        const beta = V.beta, Rn = V.Rn;
        let v = V.V * 1000, gm = V.gam * D2R, h = 120000, x = 0, t = 0, Q = 0;
        const dt = 0.05, out = { t: [], h: [], v: [], q: [], n: [], x: [], M: [], Q: [], end: '' };
        const der = (v, gm, h) => {
          const a = atmos(F, h), g = g0 * (RE / (RE + h)) ** 2;
          return [-a.rho * v * v / (2 * beta) + g * Math.sin(gm), Math.cos(gm) * (g / v - v / (RE + h)), -v * Math.sin(gm), v * Math.cos(gm) * RE / (RE + h) / 1000];
        };
        let k = 0;
        for (; t < 4000; k++) {
          const a = atmos(F, h), qd = KSG * Math.sqrt(a.rho / Rn) * v * v * v, n = a.rho * v * v / (2 * beta * g0), M = v / Math.sqrt(G * 287.058 * a.T);
          if (k % 10 === 0) { out.t.push(t); out.h.push(h); out.v.push(v); out.q.push(qd); out.n.push(n); out.x.push(x); out.M.push(M); out.Q.push(Q); }
          if (h <= 0) { out.end = 'ground'; break; }
          if (M < 0.8) { out.end = 'subsonic'; break; }
          if (h > 125000 && gm < 0) { out.end = 'skip'; break; }
          const k1 = der(v, gm, h), k2 = der(v + dt / 2 * k1[0], gm + dt / 2 * k1[1], h + dt / 2 * k1[2]);
          const k3 = der(v + dt / 2 * k2[0], gm + dt / 2 * k2[1], h + dt / 2 * k2[2]), k4 = der(v + dt * k3[0], gm + dt * k3[1], h + dt * k3[2]);
          v += dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); gm += dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
          h += dt / 6 * (k1[2] + 2 * k2[2] + 2 * k3[2] + k4[2]); x += dt / 6 * (k1[3] + 2 * k2[3] + 2 * k3[3] + k4[3]);
          v = Math.max(v, 1); Q += qd * dt; t += dt;
        }
        if (!out.end) out.end = 'time';
        const last = out.t.length - 1;
        if (out.t[last] !== t) { const a = atmos(F, Math.max(0, h)); out.t.push(t); out.h.push(Math.max(0, h)); out.v.push(v); out.q.push(KSG * Math.sqrt(a.rho / Rn) * v * v * v); out.n.push(a.rho * v * v / (2 * beta * g0)); out.x.push(x); out.M.push(v / Math.sqrt(G * 287.058 * a.T)); out.Q.push(Q); }
        let iq = 0, iN = 0;
        out.q.forEach((q, i) => { if (q > out.q[iq]) iq = i; }); out.n.forEach((n, i) => { if (n > out.n[iN]) iN = i; });
        out.iq = iq; out.iN = iN; out.T = t; out.xmax = Math.max(1, ...out.x);
        tr = out; tp = 0; hold = 0; lastPlot = -1;
        const ae = (V.V * 1000) ** 2 * Math.sin(V.gam * D2R) / (2 * Math.E * g0 * 7200);
        ro.set('pk', (out.q[iq] / 1e4).toFixed(0) + ' W/cm² at ' + (out.h[iq] / 1000).toFixed(0) + ' km · ' + out.n[iN].toFixed(1) + ' g at ' + (out.h[iN] / 1000).toFixed(0) + ' km');
        ro.set('ae', ae.toFixed(1) + ' g (straight path, exponential air)');
        ro.set('note', out.end === 'skip' ? 'Too fast and too shallow: without lift it passes through the upper air and leaves again' : out.end === 'ground' ? 'Reaches the ground still at ' + out.v[out.v.length - 1].toFixed(0) + ' m/s' : out.end === 'subsonic' ? 'Subsonic at ' + (h / 1000).toFixed(1) + ' km after ' + t.toFixed(0) + ' s: parachute territory' : 'Still flying after 4000 s');
      }
      const idxAt = time => { if (!tr) return 0; let lo = 0, hi = tr.t.length - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (tr.t[m] <= time) lo = m; else hi = m; } return lo; };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!tr) return;
        const Tt = Math.max(tr.T, 1);
        if (dt > 0) { if (tp < Tt) tp = Math.min(Tt, tp + dt * Tt / 12); else { hold += dt; if (hold > 2.5) { tp = 0; hold = 0; } } }
        const i = idxAt(tp);
        // plots, a few times a second
        if (Math.abs(tp - lastPlot) > Tt / 60 || lastPlot < 0 || tp === 0) {
          lastPlot = tp;
          const step = Math.max(1, Math.floor(tr.t.length / 400)), qs = [], ns = [];
          for (let k = 0; k < tr.t.length; k += step) { qs.push([tr.t[k], tr.q[k] / 1e4]); ns.push([tr.t[k], tr.n[k]]); }
          pq.set({ x: { label: 'time from 120 km (s)', min: 0, max: Tt }, series: [{ pts: qs, label: 'heat flux' }], vlines: [{ x: tp }], marks: [{ x: tr.t[tr.iq], y: tr.q[tr.iq] / 1e4, label: 'peak ' + (tr.q[tr.iq] / 1e4).toFixed(0) + ' W/cm²' }] });
          pn.set({ x: { label: 'time from 120 km (s)', min: 0, max: Tt }, series: [{ pts: ns, label: 'deceleration', color: C.warn }], vlines: [{ x: tp }], marks: [{ x: tr.t[tr.iN], y: tr.n[tr.iN], label: 'peak ' + tr.n[tr.iN].toFixed(1) + ' g', color: C.warn }] });
        }
        // the scene: altitude against downrange distance
        const l = 46, r = st.W - 14, top = 12, bot = st.H - 24, hmax = 125;
        const X = xk => l + (r - l) * xk / tr.xmax, Y = hk => bot - (bot - top) * hk / 1000 / hmax;
        const gr = c.createLinearGradient(0, top, 0, bot);
        gr.addColorStop(0, C.dark ? 'hsl(230 40% 7%)' : 'hsl(225 40% 22%)'); gr.addColorStop(0.7, C.dark ? 'hsl(215 45% 16%)' : 'hsl(210 60% 60%)'); gr.addColorStop(1, C.dark ? 'hsl(205 45% 24%)' : 'hsl(200 70% 85%)');
        c.fillStyle = gr; c.fillRect(l, top, r - l, bot - top);
        c.strokeStyle = 'hsl(0 0% 100% / .12)'; c.lineWidth = 1;
        for (let hk = 20; hk <= 120; hk += 20) { c.beginPath(); c.moveTo(l, Y(hk * 1000)); c.lineTo(r, Y(hk * 1000)); c.stroke(); kit.label(c, hk + ' km', l - 4, Y(hk * 1000), { align: 'right', size: 10.5, color: C.muted }); }
        kit.label(c, '0', l - 4, bot, { align: 'right', size: 10.5, color: C.muted });
        kit.label(c, 'downrange ' + tr.xmax.toFixed(0) + ' km →', r, bot + 13, { align: 'right', size: 10.5, color: C.muted });
        c.strokeStyle = 'hsl(0 0% 100% / .35)'; c.lineWidth = 1.5; c.beginPath();
        tr.x.forEach((xk, k) => { const px = X(xk), py = Y(tr.h[k]); k ? c.lineTo(px, py) : c.moveTo(px, py); }); c.stroke();
        c.strokeStyle = C.warn; c.lineWidth = 2.5; c.beginPath();
        for (let k = 0; k <= i; k++) { const px = X(tr.x[k]), py = Y(tr.h[k]); k ? c.lineTo(px, py) : c.moveTo(px, py); } c.stroke();
        kit.dot(c, X(tr.x[tr.iq]), Y(tr.h[tr.iq]), 4, C.bad);
        kit.dot(c, X(tr.x[tr.iN]), Y(tr.h[tr.iN]), 4, C.warn);
        // the vehicle and its glowing shock layer
        const vx = X(tr.x[i]), vy = Y(tr.h[i]), glow = clamp(tr.q[i] / Math.max(tr.q[tr.iq], 1), 0, 1);
        const j2 = Math.min(i + 1, tr.t.length - 1), ang = Math.atan2(Y(tr.h[j2]) - Y(tr.h[i]) || 0.01, X(tr.x[j2]) - X(tr.x[i]) || 0.01);
        if (glow > 0.02) {
          const rg = c.createRadialGradient(vx, vy, 2, vx, vy, 10 + 38 * glow);
          rg.addColorStop(0, 'hsl(35 100% 75% / ' + (0.9 * glow).toFixed(2) + ')'); rg.addColorStop(0.5, 'hsl(15 100% 55% / ' + (0.5 * glow).toFixed(2) + ')'); rg.addColorStop(1, 'hsl(10 100% 50% / 0)');
          c.fillStyle = rg; c.beginPath(); c.arc(vx, vy, 10 + 38 * glow, 0, 2 * Math.PI); c.fill();
        }
        c.save(); c.translate(vx, vy); c.rotate(ang);
        c.fillStyle = '#ddd'; c.strokeStyle = '#333'; c.lineWidth = 1;
        const blunt = V.Rn > 0.4;
        c.beginPath();
        if (blunt) { c.moveTo(4, -7); c.quadraticCurveTo(9, 0, 4, 7); c.lineTo(-7, 3); c.lineTo(-7, -3); c.closePath(); }
        else { c.moveTo(10, 0); c.lineTo(-10, -4); c.lineTo(-10, 4); c.closePath(); }
        c.fill(); c.stroke(); c.restore();
        // read-outs for the moment shown
        const a = atmos(F, tr.h[i]), Tw = Math.pow(tr.q[i] / (EPS * SB), 0.25);
        ro.set('h', (tr.h[i] / 1000).toFixed(1) + ' km · ' + tr.x[i].toFixed(0) + ' km');
        ro.set('v', (tr.v[i] / 1000).toFixed(2) + ' km/s · M ' + tr.M[i].toFixed(1));
        ro.set('q', (tr.q[i] / 1e4).toFixed(1) + ' W/cm²');
        ro.set('tw', Tw.toFixed(0) + ' K (' + (Tw - 273.15).toFixed(0) + ' °C)');
        ro.set('n', tr.n[i].toFixed(2) + ' g');
        ro.set('Q', (tr.Q[i] / 1e7).toFixed(2) + ' kJ/cm²');
        kit.label(c, 't = ' + tp.toFixed(0) + ' s', l + 8, top + 12, { align: 'left', size: 12.5, weight: 700, color: '#fff' });
        kit.label(c, 'ρ = ' + a.rho.toExponential(2) + ' kg/m³', l + 8, top + 30, { align: 'left', size: 11.5, color: '#ddd' });
        kit.label(c, '● peak heating', r - 8, top + 12, { align: 'right', size: 11.5, color: C.bad, weight: 700 });
        kit.label(c, '● peak deceleration', r - 8, top + 30, { align: 'right', size: 11.5, color: C.warn, weight: 700 });
      }, box.stage);
      run();
      loop.start();
    }
  });

  /* ================================================================ wind tunnel */
  const muN2 = T => 1.781e-5 * Math.pow(T / 300.55, 1.5) * (300.55 + 111) / (T + 111);   // Sutherland, nitrogen
  Hyper.sim('hst-tunnel', {
    title: 'A wind tunnel and Reynolds-number matching',
    blurb: `A wind tunnel with a 2.5 m × 2.5 m test section. The stagnation pressure and temperature of the gas in the settling chamber, the contraction ratio and the test-section Mach number fix everything else through the isentropic relations: the test-section speed, density and dynamic pressure, the (slow) speed in the settling chamber, and the Reynolds number of the scale model. The bars compare it with the full-size vehicle.

**Try this**
- Contraction ratio 9: the air creeps through the screens at a ninth of the test-section speed, and speeds up in the contraction. Particles show it.
- Put a 1:30 airliner model in the atmospheric tunnel at Mach 0.82: its Reynolds number is about a fourteenth of the real aircraft's.
- Pressurise to 4 bar: density — and Reynolds number — fourfold. Now choose cryogenic nitrogen at 115 K: the gas is denser, less viscous and has a lower speed of sound, and the model reaches flight Reynolds number at the right Mach number.
- Choose the car and a 1:4 model. The Mach number hardly matters, but to match Reynolds number at atmospheric pressure the model would need four times the speed.
- The Eiffel layout draws air from the room and throws it away; the closed-return circuit reuses it and needs less power.`,
    mount(box, kit, params) {
      const F = kit.fluid, P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 260 });
      const TUN = {
        atm: { gas: 'air', p0: 1.0e5, T0: 300, open: false },
        eiffel: { gas: 'air', p0: 1.013e5, T0: 293, open: true },
        press: { gas: 'air', p0: 4e5, T0: 300, open: false },
        cryo: { gas: 'n2', p0: 4.5e5, T0: 115, open: false },
        cryomax: { gas: 'n2', p0: 9e5, T0: 120, open: false } };
      const OBJ = {
        airliner: { L: 6, what: 'mean chord', M: 0.82, h: 11000, span: 36, length: 38, front: 25, k: 30 },
        light: { L: 1.5, what: 'chord', V: 60, h: 0, span: 11, length: 8, front: 3, k: 6 },
        car: { L: 4.5, what: 'length', V: 30, h: 0, span: 1.8, length: 4.5, front: 2.2, k: 4 } };
      const tk = TUN[P.tunnel] ? P.tunnel : 'atm', ok0 = OBJ[P.obj] ? P.obj : 'airliner';
      const Mdef = o => { const O = OBJ[o], air = F.isa(O.h); return clamp(O.M || O.V / air.a, 0.05, 0.95); };
      const ctl = kit.controls(box.side, [
        { id: 'tunnel', type: 'select', label: 'Tunnel', options: [['Atmospheric air, closed return', 'atm'], ['Open circuit (Eiffel type)', 'eiffel'], ['Pressurised air, 4 bar', 'press'], ['Cryogenic nitrogen, 4.5 bar, 115 K', 'cryo'], ['Cryogenic nitrogen, 9 bar, 120 K', 'cryomax']], value: tk },
        { id: 'obj', type: 'select', label: 'Full-size vehicle', options: [['Airliner (6 m chord, Mach 0.82 at 11 km)', 'airliner'], ['Light aircraft (1.5 m chord, 60 m/s)', 'light'], ['Car (4.5 m long, 30 m/s)', 'car']], value: ok0 },
        { id: 'M', label: 'Test-section Mach number', min: 0.05, max: 0.95, step: 0.01, value: num(P.M, Mdef(ok0)) },
        { id: 'CR', label: 'Contraction ratio', min: 4, max: 16, step: 0.5, value: num(P.CR, 9) },
        { id: 'k', label: 'Model scale 1 :', min: 1, max: 60, value: num(P.k, OBJ[ok0].k), log: true, sig: 2 }
      ], (id, v) => {
        if (id === 'obj') { ctl.set('M', Mdef(v)); ctl.set('k', OBJ[v].k); }
        calc();
      });
      const ro = kit.readout(box.side, [['vts', 'Test section: speed · Mach'], ['sp', 'Static temperature · pressure'], ['q', 'Dynamic pressure'], ['vsc', 'Settling chamber: speed · Mach'], ['size', 'Model size'],
        ['rem', 'Reynolds number, model'], ['ref', 'Reynolds number, full size'], ['ratio', 'Model / full-size Reynolds number · Mach'], ['blk', 'Blockage (frontal area / test section)'], ['pw', 'Fan power (estimate)'], ['note', '']]);
      const V = ctl.values, WTS = 2.5, ATS = WTS * WTS;
      let R = null;
      const fRe = v => v >= 1e6 ? (v / 1e6).toFixed(v >= 1e7 ? 1 : 2) + ' million' : (v / 1e3).toFixed(0) + ' thousand';
      function calc() {
        const T = TUN[V.tunnel], O = OBJ[V.obj];
        const Rg = T.gas === 'n2' ? 296.8 : 287.058, mu = T.gas === 'n2' ? muN2 : F.sutherland;
        const is = F.isentropic(V.M), Ts = T.T0 / is.T0T, ps = T.p0 / is.p0p, rho = ps / (Rg * Ts), a = Math.sqrt(G * Rg * Ts), Vts = V.M * a, q = 0.5 * rho * Vts * Vts;
        const Msc = F.machFromArea(is.AAstar * V.CR, G, false), Vsc = Msc * Math.sqrt(G * Rg * T.T0 / F.isentropic(Msc).T0T);
        const Lm = O.L / V.k, Rem = rho * Vts * Lm / mu(Ts);
        const air = F.isa(O.h), Vf = O.M ? O.M * air.a : O.V, Mf = Vf / air.a, Ref = air.rho * Vf * O.L / air.mu;
        const block = O.front / (V.k * V.k) / ATS, power = q * Vts * ATS / (T.open ? 2.5 : 6);
        const Tsat = 1 / (1 / 77.35 - Math.log(ps / 101325) / 670);
        R = { T, O, Ts, ps, rho, Vts, q, Msc, Vsc, Lm, Rem, Ref, Mf, Vf, block, power, Tsat, span: O.span / V.k };
        ro.set('vts', Vts.toFixed(1) + ' m/s · M ' + V.M.toFixed(2));
        ro.set('sp', Ts.toFixed(1) + ' K (' + (Ts - 273.15).toFixed(0) + ' °C) · ' + (ps / 1e5).toFixed(2) + ' bar');
        ro.set('q', q >= 1e4 ? (q / 1000).toFixed(1) + ' kPa' : q.toFixed(0) + ' Pa');
        ro.set('vsc', Vsc.toFixed(2) + ' m/s · M ' + Msc.toFixed(3));
        ro.set('size', (Lm * 1000).toFixed(0) + ' mm ' + O.what + ', ' + R.span.toFixed(2) + ' m ' + (V.obj === 'car' ? 'wide' : 'span'));
        ro.set('rem', fRe(Rem));
        ro.set('ref', fRe(Ref));
        ro.set('ratio', (Rem / Ref).toFixed(3) + ' · ' + V.M.toFixed(2) + ' against ' + Mf.toFixed(2));
        ro.set('blk', (block * 100).toFixed(2) + ' %');
        ro.set('pw', power >= 1e6 ? (power / 1e6).toFixed(1) + ' MW' : (power / 1e3).toFixed(0) + ' kW');
        const notes = [];
        if (Ts < Tsat + 2) notes.push('the gas would condense in the test section — raise the temperature');
        if (R.span > 0.8 * WTS) notes.push('model too big for the test section');
        if (block > 0.075) notes.push('blockage above 7.5 %: large corrections');
        if (Math.abs(V.M - Mf) > 0.05 && Mf > 0.3) notes.push('Mach number not matched');
        if (T.open && V.M > 0.35) notes.push('open-circuit tunnels are low-speed tunnels in practice');
        notes.push(Rem / Ref > 0.9 && Rem / Ref < 1.15 ? 'Reynolds number matched' : 'Reynolds number ' + (Rem > Ref ? 'above' : 'short of') + ' flight by ×' + (Rem > Ref ? Rem / Ref : Ref / Rem).toFixed(1));
        ro.set('note', notes.join('; '));
      }
      // the circuit as straight legs: { x, y, dir, len, w(s) } in metres
      function layout() {
        const wsc = WTS * Math.sqrt(V.CR), cl = wsc * 1.0, lts = 6, sm = u => u * u * u * (10 - 15 * u + 6 * u * u);
        const contr = s0 => s => { const u = clamp((s - s0) / cl, 0, 1); return WTS + (wsc - WTS) * (1 - sm(u)); };
        if (TUN[V.tunnel].open) {
          const lin = 0.5 * wsc, lsc = 4, ld = 16, w2 = 1.9 * WTS;
          const c0 = contr(lin + lsc);
          const w = s => s < lin ? wsc * (1 + 0.35 * Math.pow(1 - s / lin, 2)) : s < lin + lsc ? wsc : s < lin + lsc + cl ? c0(s) : s < lin + lsc + cl + lts ? WTS : s < lin + lsc + cl + lts + ld ? WTS + (w2 - WTS) * (s - lin - lsc - cl - lts) / ld : w2;
          const len = lin + lsc + cl + lts + ld + 4;
          return { open: true, wsc, legs: [{ x: 0, y: 0, dx: 1, dy: 0, len, w }], marks: { screens: lin + 0.6, ts: lin + lsc + cl, tsEnd: lin + lsc + cl + lts, fan: len - 2.2 }, box: [-0.2, -wsc * 0.7 - 1.8, len + 0.5, wsc * 0.7] };
        }
        const lsc = Math.max(wsc, 5), ld1 = 13, w1 = 1.45 * WTS, w2 = 1.8 * WTS, w3 = Math.min(wsc, 2.2 * WTS);
        const Lx = lsc + cl + lts + ld1, Hl = wsc / 2 + w2 / 2 + 4.5, c0 = contr(lsc);
        const bottom = s => s < lsc ? wsc : s < lsc + cl ? c0(s) : s < lsc + cl + lts ? WTS : WTS + (w1 - WTS) * (s - lsc - cl - lts) / ld1;
        return { open: false, wsc, Lx, Hl, legs: [
          { x: 0, y: 0, dx: 1, dy: 0, len: Lx, w: bottom },
          { x: Lx, y: 0, dx: 0, dy: 1, len: Hl, w: s => w1 + (w2 - w1) * s / Hl },
          { x: Lx, y: Hl, dx: -1, dy: 0, len: Lx, w: s => w2 + (w3 - w2) * s / Lx },
          { x: 0, y: Hl, dx: 0, dy: -1, len: Hl, w: s => w3 + (wsc - w3) * s / Hl }],
          marks: { screens: wsc / 2 + 0.6, ts: lsc + cl, tsEnd: lsc + cl + lts, fan: 0.3 * Lx },
          re: [lsc + cl, Lx - w1 / 2 - 0.8, (WTS / 2 + Hl - w2 / 2) / 2],
          box: [-Math.max(wsc, w3) / 2 - 0.3, -wsc / 2 - 1.8, Lx + Math.max(w1, w2) / 2 + 0.3, Hl + Math.max(w2, w3) / 2 + 0.3] };
      }
      const parts = [];
      let fanAng = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        if (!R) return;
        const Lo = layout(), [bx0, by0, bx1, by1] = Lo.box;
        const reH = Lo.open ? st.H * 0.3 : 0;
        const sc = Math.min((st.W - 20) / (bx1 - bx0), (st.H - 20 - reH) / (by1 - by0));
        const ox = (st.W - (bx1 - bx0) * sc) / 2 - bx0 * sc, oy = st.H - 10 - ((st.H - 20 - reH) - (by1 - by0) * sc) / 2 + by0 * sc;
        const S = (x, y) => [ox + x * sc, oy - y * sc];
        const legPoly = (lg, ext) => {
          const n = 40, L = [], Rr = [], nx = -lg.dy, ny = lg.dx;
          for (let k = 0; k <= n; k++) {
            const s = lg.len * k / n, w = lg.w(s), e0 = k === 0 && ext ? -lg.w(0) / 2 : 0, e1 = k === n && ext ? lg.w(lg.len) / 2 : 0;
            const px = lg.x + lg.dx * (s + e0 + e1), py = lg.y + lg.dy * (s + e0 + e1);
            L.push(S(px + nx * w / 2, py + ny * w / 2)); Rr.push(S(px - nx * w / 2, py - ny * w / 2));
          }
          return L.concat(Rr.reverse());
        };
        const polys = Lo.legs.map(lg => legPoly(lg, !Lo.open));
        c.lineJoin = 'miter'; c.strokeStyle = C.text; c.lineWidth = 4;
        for (const p of polys) { c.beginPath(); p.forEach((q, k) => k ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.stroke(); }
        c.fillStyle = C.surface;
        for (const p of polys) { c.beginPath(); p.forEach((q, k) => k ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fill(); }
        c.lineJoin = 'round';
        const leg0 = Lo.legs[0], w0 = s => leg0.w(s);
        // honeycomb and screens in the settling chamber
        const s0 = Lo.marks.screens;
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let k = 0; k < 3; k++) { const s = s0 + k * 0.5, w = w0(s); const a = S(s, -w / 2), b = S(s, w / 2); c.setLineDash([2, 3]); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
        c.setLineDash([]);
        { const s = s0 + 1.8, w = w0(s); for (let k = 0; k <= 10; k++) { const y = -w / 2 + w * k / 10, a = S(s, y), b = S(s + 0.7, y); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); } }
        // corner vanes
        if (!Lo.open) {
          const corners = [[Lo.Lx, 0, 1, 1], [Lo.Lx, Lo.Hl, -1, 1], [0, Lo.Hl, -1, -1], [0, 0, 1, -1]];
          c.strokeStyle = C.faint; c.lineWidth = 1.2;
          corners.forEach(([x, y, sx, sy], ci) => {
            const w = [Lo.legs[1].w(0), Lo.legs[2].w(0), Lo.legs[3].w(0), Lo.legs[0].w(0)][ci];
            for (let k = -2; k <= 2; k++) { const d = k * w / 6, a = S(x - sx * w * 0.28 + d, y - sy * w * 0.28 - d), b = S(x + sx * w * 0.28 + d, y + sy * w * 0.28 - d); c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); }
          });
        }
        // fan
        fanAng += dt * (4 + 20 * V.M);
        {
          const lg = Lo.open ? Lo.legs[0] : Lo.legs[2], s = Lo.marks.fan, w = lg.w(s), px = lg.x + lg.dx * s, py = lg.y + lg.dy * s, a = S(px, py);
          const rr = w / 2 * sc * 0.85;
          c.strokeStyle = C.text; c.lineWidth = 2;
          c.beginPath(); c.moveTo(a[0], a[1] - rr); c.lineTo(a[0], a[1] + rr); c.stroke();
          c.fillStyle = C.accent;
          for (let k = 0; k < 6; k++) { const yy = Math.sin(fanAng + k * Math.PI / 3) * rr; c.beginPath(); c.ellipse(a[0], a[1] + yy, 4, 3, 0, 0, 2 * Math.PI); c.fill(); }
          kit.label(c, 'fan', a[0], a[1] + (Lo.open ? rr + 10 : -rr - 8), { size: 11, color: C.muted });
        }
        // the model in the test section, seen from above
        {
          const s1 = Lo.marks.ts, s2 = Lo.marks.tsEnd, mid = S((s1 + s2) / 2, 0), O = R.O, k = V.k;
          const a = S(s1, WTS / 2), b = S(s2, -WTS / 2);
          c.save(); c.beginPath(); c.rect(a[0], a[1], b[0] - a[0], b[1] - a[1]); c.clip();
          c.fillStyle = C.accent; c.strokeStyle = C.text; c.lineWidth = 1;
          const m = sc / k;
          if (V.obj === 'car') { const lx = O.length * m, wy = O.span * m; c.beginPath(); if (c.roundRect) c.roundRect(mid[0] - lx / 2, mid[1] - wy / 2, lx, wy, Math.min(lx, wy) * 0.3); else c.rect(mid[0] - lx / 2, mid[1] - wy / 2, lx, wy); c.fill(); c.stroke(); }
          else {
            const lx = O.length * m, sp = O.span * m, cr = (V.obj === 'airliner' ? 7 : 1.5) * m, sw = V.obj === 'airliner' ? Math.tan(25 * D2R) : 0;
            c.fillRect(mid[0] - lx / 2, mid[1] - Math.max(1.5, 2 * m), lx, Math.max(3, 4 * m));
            c.beginPath(); c.moveTo(mid[0] - cr * 0.6, mid[1]); c.lineTo(mid[0] - cr * 0.6 + sp / 2 * sw, mid[1] - sp / 2); c.lineTo(mid[0] - cr * 0.6 + sp / 2 * sw + cr * 0.3, mid[1] - sp / 2); c.lineTo(mid[0] + cr * 0.4, mid[1]);
            c.lineTo(mid[0] - cr * 0.6 + sp / 2 * sw + cr * 0.3, mid[1] + sp / 2); c.lineTo(mid[0] - cr * 0.6 + sp / 2 * sw, mid[1] + sp / 2); c.closePath(); c.fill(); c.stroke();
          }
          c.restore();
          kit.label(c, 'test section', mid[0], S(0, -Lo.wsc / 2)[1] + 11, { size: 11, color: C.text, weight: 700 });
        }
        const below = S(0, -Lo.wsc / 2)[1] + 11;
        kit.label(c, 'settling chamber', S(Lo.marks.screens + 1.2, 0)[0], below, { size: 11, color: C.muted });
        kit.label(c, 'contraction ' + V.CR.toFixed(1) + ' : 1', S(Lo.marks.ts - Lo.wsc * 0.5, 0)[0], S(0, w0(Lo.marks.ts - Lo.wsc * 0.5) / 2)[1] - 9, { size: 11, color: C.muted });
        kit.label(c, 'diffuser', S(Lo.marks.tsEnd + 5, 0)[0], below, { size: 11, color: C.muted });
        // particles: speed from continuity, (2.5 m / width)²
        const total = Lo.legs.reduce((a, lg) => a + lg.len, 0);
        while (parts.length < 170) parts.push({ s: Math.random() * total, u: Math.random() - 0.5 });
        const vis = 6 + 26 * V.M;
        for (const q of parts) {
          let s = q.s, li = 0;
          while (li < Lo.legs.length - 1 && s > Lo.legs[li].len) { s -= Lo.legs[li].len; li++; }
          const lg = Lo.legs[li], w = lg.w(Math.min(s, lg.len)), f = (WTS / w) ** 2;
          q.s += vis * f * dt;
          if (q.s > total) { q.s = Lo.open ? 0 : q.s - total; if (Lo.open) q.u = Math.random() - 0.5; }
          const px = lg.x + lg.dx * s - lg.dy * q.u * w * 0.9, py = lg.y + lg.dy * s + lg.dx * q.u * w * 0.9, a = S(px, py);
          const t = clamp(Math.sqrt(f), 0, 1);
          c.fillStyle = 'hsl(' + Math.round(215 - 205 * t) + ' 80% ' + (C.dark ? 62 : 48) + '% / .85)';
          c.fillRect(a[0] - 1.3, a[1] - 1.3, 2.6, 2.6);
        }
        // Reynolds-number bars (log scale 10^5 … 10^9)
        const bw = Lo.open ? st.W * 0.5 : Math.max(100, (Lo.re[1] - Lo.re[0]) * sc);
        const bxl = Lo.open ? st.W * 0.25 : S(Lo.re[0], 0)[0], byt = Lo.open ? 22 : S(0, Lo.re[2])[1] - 14;
        const lg10 = v => clamp((Math.log10(Math.max(v, 1)) - 5) / 4, 0, 1);
        kit.label(c, 'Reynolds number (10⁵ … 10⁹, log scale)', bxl, byt - 4, { align: 'left', size: 11, color: C.muted, baseline: 'bottom' });
        [['full size', R.Ref, C.ok], ['model', R.Rem, C.accent]].forEach(([nm, v, col], k) => {
          const y = byt + 4 + k * 20;
          c.fillStyle = C.bg2; c.fillRect(bxl, y, bw, 13);
          c.fillStyle = col; c.fillRect(bxl, y, bw * lg10(v), 13);
          kit.label(c, nm + ' ' + fRe(v), bxl + 4, y + 7, { align: 'left', size: 11, color: C.text, weight: 700 });
        });
      }, box.stage);
      calc();
      loop.start();
    }
  });

  /* ================================================================ pressure taps */
  Hyper.sim('hst-taps', {
    title: 'Pressure taps and a multitube manometer',
    blurb: `A tunnel model of an airfoil with a row of small holes (pressure taps) along its upper and lower surfaces and one at the nose, each piped to a tube of a multitube manometer. Suction draws the liquid up. Integrating the measured pressures — straight lines between taps, with the trailing-edge value taken as the mean of the last two — gives the normal and axial forces, and so $c_l$ and $c_m$. The "true" pressure distribution comes from the panel method.

**Try this**
- With 3 taps a side, evenly spread, $c_l$ is about 9 % out: straight lines between distant holes cannot follow the suction peak. Cluster the same 3 taps at the nose and the error drops below 1 %.
- Evenly spread taps never quite converge: even 30 a side leave $c_l$ 4–5 % low, because the first hole, at 3 % of the chord, is already behind the suction peak.
- Watch $c_m$: the moment needs the load's position as well as its size, and it converges more slowly than the lift.
- Add a scanner error of 1 % of $q$: the lift barely suffers (the errors average out), but single tubes jump about.
- Real models carry 30–60 taps a side on one chord, a few tenths of a millimetre across, drilled normal to the surface.`,
    mount(box, kit, params) {
      const F = kit.fluid, P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 230 });
      const plot = kit.plot(plotBox(box), { x: { label: 'x / c', min: 0, max: 1 }, y: { label: 'C_p  (suction up)', reverse: true }, legend: true }, 190);
      const FOILS = { '0012': [0, 0, 0.12], '2412': [0.02, 0.4, 0.12], '4415': [0.04, 0.4, 0.15] };
      const ctl = kit.controls(box.side, [
        { id: 'foil', type: 'select', label: 'Airfoil', options: [['NACA 0012', '0012'], ['NACA 2412', '2412'], ['NACA 4415', '4415']], value: '2412' },
        { id: 'alpha', label: 'Angle of attack α', min: -4, max: 12, step: 0.5, value: num(P.alpha, 4), unit: '°' },
        { id: 'n', label: 'Taps on each surface', min: 2, max: 30, step: 1, value: num(P.n, 5) },
        { id: 'dist', type: 'select', label: 'Tap spacing', options: [['Even along the chord', 'even'], ['Clustered at the nose', 'cos']], value: 'even' },
        { id: 'err', label: 'Scanner error (± % of q)', min: 0, max: 3, step: 0.1, value: 0, unit: '%' }
      ], () => solve());
      const ro = kit.readout(box.side, [['clt', 'c_l from the taps'], ['clf', 'c_l from the full pressure distribution'], ['clg', 'c_l from the circulation (panel method)'], ['e', 'Error of the taps'], ['cm', 'c_m about c/4: taps · full'], ['nt', 'Taps in use']]);
      const V = ctl.values;
      let pts = null, a = 0, up = [], lo = [], taps = null, fine = null;
      const interp = (arr, x, key) => {
        if (x <= arr[0].x) return arr[0][key];
        for (let i = 0; i < arr.length - 1; i++) if (x <= arr[i + 1].x) { const u = (x - arr[i].x) / (arr[i + 1].x - arr[i].x || 1); return arr[i][key] + (arr[i + 1][key] - arr[i][key]) * u; }
        return arr[arr.length - 1][key];
      };
      const hash = k => { const s = Math.sin(k * 12.9898 + 78.233) * 43758.5453; return s - Math.floor(s); };
      // integrate one surface, from the nose (x = 0) to the trailing edge (x = 1): ∫Cp dx, ∫Cp dy, ∫Cp (1/4 − x) dx
      function integ(poly) {
        let ix = 0, iy = 0, im = 0;
        for (let i = 0; i < poly.length - 1; i++) {
          const [x1, y1, c1] = poly[i], [x2, y2, c2] = poly[i + 1], cm = (c1 + c2) / 2;
          ix += cm * (x2 - x1); iy += cm * (y2 - y1); im += (c1 * (0.25 - x1) + c2 * (0.25 - x2)) / 2 * (x2 - x1);
        }
        return { ix, iy, im };
      }
      function coeffs(U, Lw, cpLE) {
        const te = (U[U.length - 1][2] + Lw[Lw.length - 1][2]) / 2;
        const pu = [[0, 0, cpLE]].concat(U, [[1, 0, te]]), pl = [[0, 0, cpLE]].concat(Lw, [[1, 0, te]]);
        const iu = integ(pu), il = integ(pl);
        const cn = il.ix - iu.ix, cax = iu.iy - il.iy;
        return { cl: cn * Math.cos(a) - cax * Math.sin(a), cm: il.im - iu.im };
      }
      function solve() {
        const f = FOILS[V.foil] || FOILS['2412'];
        a = V.alpha * D2R;
        pts = F.naca4(f[0], f[1], f[2], 70);
        const sol = F.panel(pts, a);
        up = sol.cp.filter(c => c.upper).map(c => ({ x: c.x, y: c.y, cp: c.cp })).sort((p, q) => p.x - q.x);
        lo = sol.cp.filter(c => !c.upper).map(c => ({ x: c.x, y: c.y, cp: c.cp })).sort((p, q) => p.x - q.x);
        const cpLE = (up[0].cp + lo[0].cp) / 2;
        fine = coeffs(up.map(q => [q.x, q.y, q.cp]), lo.map(q => [q.x, q.y, q.cp]), cpLE);
        fine.clg = sol.cl;
        const n = Math.round(V.n), xsT = [];
        // even: 3 % to 95 % of the chord; clustered: a half-cosine spacing, dense at the nose where the suction peak is
        for (let i = 0; i < n; i++) xsT.push(V.dist === 'cos' ? 0.003 + 0.95 * (1 - Math.cos(Math.PI / 2 * (i + 0.5) / n)) : 0.03 + 0.92 * (n > 1 ? i / (n - 1) : 0.5));
        const noise = k => V.err / 100 * (2 * hash(k) - 1);
        const tu = xsT.map((x, i) => [x, interp(up, x, 'y'), interp(up, x, 'cp') + noise(i + 1)]);
        const tl = xsT.map((x, i) => [x, interp(lo, x, 'y'), interp(lo, x, 'cp') + noise(i + 101)]);
        const le = cpLE + noise(0);
        const t = coeffs(tu, tl, le);
        taps = { tu, tl, le, cl: t.cl, cm: t.cm };
        ro.set('clt', t.cl.toFixed(3));
        ro.set('clf', fine.cl.toFixed(3));
        ro.set('clg', fine.clg.toFixed(3));
        ro.set('e', Math.abs(fine.cl) > 0.02 ? ((t.cl - fine.cl) / Math.abs(fine.cl) * 100).toFixed(1) + ' %' : (t.cl - fine.cl).toFixed(3) + ' (absolute)');
        ro.set('cm', t.cm.toFixed(3) + ' · ' + fine.cm.toFixed(3));
        ro.set('nt', (2 * n + 1) + ' (' + n + ' a side and one at the nose)');
        const C = kit.colors();
        plot.set({ series: [
          { pts: up.map(q => [q.x, q.cp]), label: 'upper (true)', width: 1.4, color: C.faint },
          { pts: lo.map(q => [q.x, q.cp]), label: 'lower (true)', width: 1.4, dash: [4, 3], color: C.faint },
          { pts: [[0, le]].concat(tu.map(q => [q[0], q[2]])), label: 'upper taps', dots: 3.5, color: C.series[0] },
          { pts: [[0, le]].concat(tl.map(q => [q[0], q[2]])), label: 'lower taps', dots: 3.5, dash: [5, 4], color: C.series[1] }] });
        loop.once();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        if (!taps) return;
        // the airfoil and its holes
        const s = Math.min(st.W * 0.4, st.H * 1.5), ox = st.W * 0.05, oy = st.H * 0.5, ca = Math.cos(a), sa = Math.sin(a);
        const D = (x, y) => { const dx = x - 0.25; return [ox + (0.25 + dx * ca + y * sa) * s, oy - (-dx * sa + y * ca) * s]; };
        c.beginPath(); pts.forEach((q, i) => { const [x, y] = D(q[0], q[1]); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.closePath();
        c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        const cu = C.series[0], cl = C.series[1];
        for (const q of taps.tu) { const [x, y] = D(q[0], q[1]); kit.dot(c, x, y, 3, cu); }
        for (const q of taps.tl) { const [x, y] = D(q[0], q[1]); kit.dot(c, x, y, 3, cl); }
        { const [x, y] = D(0, 0); kit.dot(c, x, y, 3.5, C.ok); }
        for (let i = 0; i < 4; i++) { const y = st.H * (0.15 + 0.23 * i); kit.arrow(c, 4, y, 26, y, C.faint, 1.2); }
        kit.label(c, 'α = ' + V.alpha.toFixed(1) + '°', 10, 14, { align: 'left', size: 12.5, weight: 700, color: C.text });
        // the multitube manometer: lower surface from the trailing edge, the nose, the upper surface to the trailing edge
        const tubes = taps.tl.slice().reverse().map(q => [q[2], cl]).concat([[taps.le, C.ok]], taps.tu.map(q => [q[2], cu]));
        const bx0 = st.W * 0.5, bx1 = st.W - 50, btop = 14, bbot = st.H - 26, y0 = btop + 0.62 * (bbot - btop), kk = (bbot - btop) * 0.26;
        const n = tubes.length, pitch = (bx1 - bx0) / n, tw = Math.max(2, Math.min(12, pitch * 0.6));
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (const cpv of [-2, -1, 0, 1]) { const y = y0 + cpv * kk; if (y < btop || y > bbot) continue; c.beginPath(); c.moveTo(bx0 - 4, y); c.lineTo(bx1 + 30, y); c.stroke(); kit.label(c, (cpv > 0 ? '+' : cpv < 0 ? '−' : '') + Math.abs(cpv), bx1 + 44, y, { size: 10.5, color: C.muted }); }
        kit.label(c, 'C_p', bx1 + 44, btop + 2, { size: 10.5, color: C.muted, baseline: 'top' });
        tubes.forEach(([cpv, col], k) => {
          const x = bx0 + pitch * (k + 0.5), ytop = clamp(y0 + cpv * kk, btop + 2, bbot);
          c.fillStyle = C.bg2; c.fillRect(x - tw / 2, btop, tw, bbot - btop);
          c.fillStyle = col; c.globalAlpha = 0.85; c.fillRect(x - tw / 2, ytop, tw, bbot - ytop); c.globalAlpha = 1;
          c.strokeStyle = C.faint; c.strokeRect(x - tw / 2, btop, tw, bbot - btop);
        });
        c.fillStyle = C.bg2; c.fillRect(bx1 + 6, y0 - 12, 18, bbot - y0 + 12); c.fillStyle = C.faint; c.fillRect(bx1 + 6, y0, 18, bbot - y0);
        kit.label(c, 'reservoir at p∞', bx1 + 15, bbot + 12, { size: 10, color: C.muted });
        kit.label(c, 'lower', bx0 + pitch * (taps.tl.length / 2), bbot + 12, { size: 10.5, color: cl, weight: 700 });
        kit.label(c, 'nose', bx0 + pitch * (taps.tl.length + 0.5), bbot + 12, { size: 10.5, color: C.ok, weight: 700 });
        kit.label(c, 'upper', bx0 + pitch * (taps.tl.length + 1 + taps.tu.length / 2), bbot + 12, { size: 10.5, color: cu, weight: 700 });
      }, box.stage);
      solve();
      loop.start();
    }
  });
})();
