/* HYPER-HYDRAULICS · sims/properties.js — simulations for the Fluid Properties branch.
 *   prop-visc-temp      viscosity against temperature for the ISO VG grades and a chosen viscosity index,
 *                       with a pump's viscosity window and three working temperatures
 *   prop-couette        a liquid sheared between two plates (Newton's law of viscosity), Newtonian and
 *                       non-Newtonian, driven by a set speed or a set force
 *   prop-pipe-rheology  laminar velocity profiles in a pipe for Newtonian, power-law, Bingham and
 *                       Herschel–Bulkley liquids at the same mean velocity
 *   prop-compress       squeezing a closed oil column: pure oil, entrained air, a swelling hose
 *   prop-capillary      capillary rise in tubes of different bores, liquids and contact angles
 *   prop-vapour         water heated in a pot at any altitude or under a pressure-cooker lid, on its
 *                       vapour-pressure curve
 *   prop-air-release    dissolved and free air in oil as the pressure changes (Henry's law, fast release,
 *                       slow re-solution), with the effective bulk modulus
 * Written here, not in the engine: the viscosity-index rule above VI 100 (ASTM D2270, with the VI-100
 * reference line taken through kit.fluid.VG) and the saturation pressure of water (IAPWS-IF97, region 4).
 */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const P0 = 101325, G0 = 9.80665;

  /* ---------------------------------------------------------------- shared helpers */
  // a design grid of DW × DH scaled into the stage
  function frame(st, DW, DH) {
    const c = st.begin(), k = Math.min(st.W / DW, st.H / DH);
    c.save(); c.translate((st.W - DW * k) / 2, (st.H - DH * k) / 2); c.scale(k, k);
    return c;
  }
  function plotBox(box) {
    const d = document.createElement('div');
    d.style.padding = '4px 10px 10px';
    box.stage.appendChild(d);
    return d;
  }

  // ISO VG oils. The VI-100 reference line (40 °C viscosity H against 100 °C viscosity Y) runs through kit.fluid.VG.
  const GRADES = [10, 15, 22, 32, 46, 68, 100, 150, 220];
  function refLine(F) {
    return Object.keys(F.VG).map(Number).sort((a, b) => a - b).map(k => [Math.log(F.VG[k]), Math.log(k)]);
  }
  function interp(pts, x) {
    let i = 0;
    while (i < pts.length - 2 && x > pts[i + 1][0]) i++;
    const a = pts[i], b = pts[i + 1];
    return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]);
  }
  const Hof = (pts, Y) => Math.exp(interp(pts, Math.log(Y)));
  const Y100of = (pts, U) => Math.exp(interp(pts.map(p => [p[1], p[0]]), Math.log(U)));
  // ASTM D2270 above VI 100: N = (log H − log U)/log Y, VI = (10^N − 1)/0.00715 + 100
  const viHigh = (pts, U, Y) => (Math.pow(10, (Math.log10(Hof(pts, Y)) - Math.log10(U)) / Math.log10(Y)) - 1) / 0.00715 + 100;
  function v100For(pts, U, VI) {
    const y0 = Y100of(pts, U);
    if (VI <= 100.01) return y0;
    let lo = y0, hi = y0 * 4;
    for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (viHigh(pts, U, m) < VI) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }

  // water: saturation pressure (IAPWS-IF97 region 4), Pa, from °C; and the temperature for a pressure
  const IF = [0, 1167.0521452767, -724213.16703206, -17.073846940092, 12020.82470247, -3232555.0322333, 14.91510861353, -4823.2657361591, 405113.40542057, -0.23855557567849, 650.17534844798];
  function psat(TC) {
    const T = clamp(TC, 0.01, 370) + 273.15, th = T + IF[9] / (T - IF[10]);
    const A = th * th + IF[1] * th + IF[2], B = IF[3] * th * th + IF[4] * th + IF[5], C = IF[6] * th * th + IF[7] * th + IF[8];
    return Math.pow(2 * C / (-B + Math.sqrt(B * B - 4 * A * C)), 4) * 1e6;
  }
  function tsat(p) {
    let lo = 0.01, hi = 370;
    for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (psat(m) < p) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  const rhoWater = TC => 1000 - 0.0178 * Math.pow(Math.abs(TC - 4), 1.7);

  /* ================================================================ viscosity against temperature */
  Hyper.sim('prop-visc-temp', {
    title: 'Oil viscosity against temperature',
    blurb: `Mineral hydraulic oils from −40 to 120 °C: each curve is Walther's equation through a grade's viscosities at 40 °C and 100 °C (VI 100); the bold one is your oil, with the viscosity index you choose. The bar shows where your oil sits at three temperatures against a typical pump's window — about **16–36 cSt** for the best life and efficiency, not below about **10 cSt** at the hottest, not above about **1000 cSt** at a cold start. The figures are typical; a pump maker's data rule.

**Try this**
- VG 46 with VI 100: read off where it crosses 1000, 36, 16 and 10 cSt. Step one grade up or down — each grade moves the whole window by about 8–10 K.
- Set a coldest start of −10 °C and a hottest temperature of 80 °C. No VI-100 grade covers both; raise the viscosity index to about 150 and VG 46 fits.
- At 40 °C the grades are evenly spaced on the log scale, each about 1.5 times the one before; at 0 °C the gaps are wider — thick oils thicken more in the cold.
- Look at how steep the curves are near a cold start: a few kelvin change the viscosity by hundreds of cSt.`,
    mount(box, kit, params) {
      const F = kit.fluid, pts = refLine(F);
      const P = Object.assign({ grade: 46, vi: 100, tcold: 0, trun: 50, thot: 70 }, params || {});
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 200, maxH: 260 });
      const gbox = plotBox(box);
      let dirty = true, dark = null;
      const ctl = kit.controls(box.side, [
        { id: 'grade', type: 'select', label: 'ISO VG grade (cSt at 40 °C)', options: GRADES.map(g => ['VG ' + g, g]), value: P.grade },
        { id: 'vi', label: 'Viscosity index', min: 100, max: 220, step: 5, value: P.vi },
        { id: 'tcold', label: 'Coldest start', min: -40, max: 30, step: 1, value: P.tcold, unit: '°C' },
        { id: 'trun', label: 'Normal running (bulk oil)', min: 10, max: 90, step: 1, value: P.trun, unit: '°C' },
        { id: 'thot', label: 'Hottest (case drain, hot day)', min: 20, max: 120, step: 1, value: P.thot, unit: '°C' }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['v', 'ν at 40 °C / 100 °C'], ['cold', 'At the coldest start'], ['run', 'Normal running'], ['hot', 'At the hottest'], ['opt', 'Optimum 36 → 16 cSt between'], ['use', 'Usable 1000 → 10 cSt between']]);
      const plot = kit.plot(gbox, { x: { label: 'temperature (°C)', name: 'T', min: -40, max: 120 }, y: { label: 'kinematic viscosity (cSt)', log: true, min: 3, max: 30000 }, legend: true, fmtX: v => v.toFixed(0) + ' °C', fmtY: v => kit.fmt(v, 3) + ' cSt' }, 290);
      const V = ctl.values;
      let out = null;
      const fmtNu = n => (n >= 100 ? n.toFixed(0) : n >= 10 ? n.toFixed(1) : n.toFixed(2)) + ' cSt';
      const fmtT = t => t <= -79.9 ? 'below −80' : t >= 249.9 ? 'above 250' : (t < -0.5 ? '−' : '') + Math.abs(t).toFixed(0);
      function verdict(n, where, C) {
        if (n > 1000) return ['too thick: the pump cannot fill', C.bad];
        if (n > 36) return [where === 'cold' ? 'start at low speed and pressure' : 'thicker than the optimum', where === 'cold' ? C.accent : C.warn];
        if (n >= 16) return ['optimum', C.ok];
        if (n >= 10) return ['thin: short periods only', C.warn];
        return ['too thin: films break down', C.bad];
      }
      function update() {
        const C = kit.colors();
        const U = +V.grade, y100 = v100For(pts, U, V.vi), oil = { v40: U, v100: y100 };
        const nu = T => F.oilViscosity(oil, T) * 1e6;
        const Tat = n => {
          let lo = -80, hi = 250;
          if (nu(lo) < n) return lo; if (nu(hi) > n) return hi;
          for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (nu(m) > n) lo = m; else hi = m; }
          return (lo + hi) / 2;
        };
        out = { U, y100, cold: nu(V.tcold), run: nu(V.trun), hot: nu(V.thot), t1000: Tat(1000), t36: Tat(36), t16: Tat(16), t10: Tat(10) };
        ro.set('v', U + ' cSt / ' + y100.toFixed(2) + ' cSt');
        ro.set('cold', fmtT(V.tcold) + ' °C: ' + fmtNu(out.cold) + ' — ' + verdict(out.cold, 'cold', C)[0]);
        ro.set('run', fmtT(V.trun) + ' °C: ' + fmtNu(out.run) + ' — ' + verdict(out.run, 'run', C)[0]);
        ro.set('hot', fmtT(V.thot) + ' °C: ' + fmtNu(out.hot) + ' — ' + verdict(out.hot, 'hot', C)[0]);
        ro.set('opt', fmtT(out.t36) + ' and ' + fmtT(out.t16) + ' °C');
        ro.set('use', fmtT(out.t1000) + ' and ' + fmtT(out.t10) + ' °C');
        const ts = []; for (let T = -40; T <= 120; T += 2) ts.push(T);
        const series = GRADES.map(g => ({ pts: ts.map(T => [T, F.oilViscosity(g, T) * 1e6]), color: C.muted, width: 1, hover: false }));
        series.push({ pts: ts.map(T => [T, nu(T)]), color: C.accent, width: 3.2, label: 'VG ' + U + ', VI ' + V.vi });
        // grade labels where each VI-100 curve crosses 3000 cSt
        const marks = [];
        for (const g of GRADES) {
          const o = { v40: g, v100: F.VG[g] };
          let lo = -80, hi = 250;
          for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (F.oilViscosity(o, m) * 1e6 > 3000) lo = m; else hi = m; }
          if (lo > -38 && lo < 118) marks.push({ x: lo, y: 3000, r: 1.5, color: C.muted, label: String(g) });
        }
        const pt = (T, n, where, name) => { const v = verdict(n, where, C); return { x: T, y: clamp(n, 3, 30000), color: v[1], r: 6, label: name }; };
        marks.push(pt(V.tcold, out.cold, 'cold', 'start'), pt(V.trun, out.run, 'run', 'running'), pt(V.thot, out.hot, 'hot', 'hottest'));
        plot.set({
          series, marks,
          hlines: [{ y: 1000, label: 'cold-start limit ≈ 1000 cSt', color: C.bad }, { y: 36, label: 'optimum 16–36 cSt', color: C.ok }, { y: 16, color: C.ok }, { y: 10, label: 'minimum ≈ 10 cSt', color: C.bad }],
          vlines: [{ x: V.tcold, color: C.faint }, { x: V.trun, color: C.faint }, { x: V.thot, color: C.faint }]
        });
      }
      function drawBar() {
        const C = kit.colors(), c = frame(st, 760, 200);
        const x0 = 40, x1 = 720, l0 = Math.log10(3), l1 = Math.log10(20000);
        const X = n => x0 + (x1 - x0) * (clamp(Math.log10(Math.max(n, 1e-6)), l0, l1) - l0) / (l1 - l0);
        const yb = 84, hb = 28;
        const zones = [[3, 10, C.bad, 'too thin'], [10, 16, C.warn, '10–16'], [16, 36, C.ok, 'optimum'], [36, 1000, C.accent, 'warm-up / light load'], [1000, 20000, C.bad, 'too thick to start']];
        for (const z of zones) {
          c.globalAlpha = 0.26; c.fillStyle = z[2]; c.fillRect(X(z[0]), yb, X(z[1]) - X(z[0]), hb); c.globalAlpha = 1;
          kit.label(c, z[3], (X(z[0]) + X(z[1])) / 2, yb + hb / 2, { size: 11, color: C.text, weight: 600 });
        }
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(x0, yb, x1 - x0, hb);
        for (const t of [3, 10, 16, 36, 100, 1000, 10000]) {
          c.beginPath(); c.moveTo(X(t), yb + hb); c.lineTo(X(t), yb + hb + 5); c.stroke();
          kit.label(c, String(t), X(t), yb + hb + 13, { size: 10, color: C.muted });
        }
        if (out) {
          const mark = (n, T, name, ly, up) => {
            const v = verdict(n, name === 'start' ? 'cold' : 'run', C), x = X(n);
            c.fillStyle = v[1]; c.strokeStyle = C.surface; c.lineWidth = 1.5;
            c.beginPath();
            if (up) { c.moveTo(x, yb - 1); c.lineTo(x - 7, yb - 12); c.lineTo(x + 7, yb - 12); }
            else { c.moveTo(x, yb + hb + 1); c.lineTo(x - 7, yb + hb + 12); c.lineTo(x + 7, yb + hb + 12); }
            c.closePath(); c.fill(); c.stroke();
            c.strokeStyle = v[1]; c.lineWidth = 1; c.beginPath(); c.moveTo(x, up ? yb - 12 : yb + hb + 12); c.lineTo(x, ly + (up ? 7 : -7)); c.stroke();
            kit.label(c, name + ' ' + fmtT(T) + ' °C: ' + fmtNu(n), clamp(x, x0 + 90, x1 - 90), ly, { size: 12, color: v[1], weight: 700, bg: C.bg2 });
          };
          mark(out.cold, V.tcold, 'start', 18, true);
          mark(out.hot, V.thot, 'hottest', 46, true);
          mark(out.run, V.trun, 'running', 150, false);
          kit.label(c, 'ISO VG ' + out.U + ', VI ' + V.vi + '  (ν₄₀ = ' + out.U + ' cSt, ν₁₀₀ = ' + out.y100.toFixed(2) + ' cSt)', x0, 186, { size: 12, color: C.text, align: 'left', weight: 600 });
          kit.label(c, 'viscosity, cSt (log scale)', x1, 186, { size: 11, color: C.muted, align: 'right' });
        }
        c.restore();
      }
      const loop = kit.loop(() => {
        const d = kit.colors().dark;
        if (d !== dark) { dark = d; dirty = true; }
        if (dirty) { update(); dirty = false; }
        drawBar();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ Couette shear */
  const FLUIDS = [
    ['Water, 20 °C', 'water'], ['Hydraulic oil, ISO VG 46', 'oil'], ['Glycerol, 20 °C', 'glycerol'],
    ['Paint (shear-thinning, n = 0.45)', 'paint'], ['Corn-starch suspension (shear-thickening)', 'starch'],
    ['Toothpaste-like paste (Bingham plastic)', 'paste'], ['Ketchup-like sauce (yield stress, thinning)', 'ketchup']
  ];
  // τ = τy + K·γ̇ⁿ (Pa, 1/s); illustrative values of the right order
  const RHEO = {
    water: { ty: 0, K: 1.0e-3, n: 1, rho: 998, hue: 210 },
    glycerol: { ty: 0, K: 1.41, n: 1, rho: 1261, hue: 280 },
    paint: { ty: 0, K: 8, n: 0.45, rho: 1300, hue: 160 },
    starch: { ty: 0, K: 0.05, n: 1.6, rho: 1400, hue: 50 },
    paste: { ty: 150, K: 2, n: 1, rho: 1300, hue: 190 },
    ketchup: { ty: 15, K: 7, n: 0.3, rho: 1100, hue: 5 }
  };
  const oilRheo = (F, T) => { const rho = 870 / (1 + 7e-4 * (T - 15)); return { ty: 0, K: F.oilViscosity(46, T) * rho, n: 1, rho, hue: 38 }; };

  Hyper.sim('prop-couette', {
    title: 'Shearing a liquid between plates',
    blurb: `A layer of liquid between a fixed plate and a 10 cm × 10 cm plate sliding over it. The liquid sticks to both plates, so it shears evenly across the gap: the dye lines lean over and the velocity grows in a straight line from 0 to the plate speed $U$. The force needed is the shear stress $\\tau$ times the plate area; for a Newtonian liquid $\\tau = \\mu U/h$. The graph is the liquid's **rheogram**, stress against shear rate, with the working point.

**Try this**
- Water, then oil, then glycerol at the same speed: the force scales with the viscosity. Halve the gap and the force doubles.
- Oil: cool it from 40 °C to 0 °C and watch the force rise more than tenfold.
- Paint: double the speed — the force rises by far less than double, because the paint thins as it is sheared (compare the dashed straight line).
- Corn starch: the faster you drive it, the harder it resists.
- Switch to **a pulling force** with the paste: below its yield stress (about 1.5 N here) nothing moves at all; just above it, it starts to flow.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const P = Object.assign({ fluid: 'oil', drive: 'speed' }, params || {});
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const gbox = plotBox(box);
      let dirty = true, themeDark = null;
      const ctl = kit.controls(box.side, [
        { id: 'fluid', type: 'select', label: 'Liquid', options: FLUIDS, value: P.fluid },
        { id: 'drive', type: 'select', label: 'Drive the top plate by', options: [['its speed', 'speed'], ['a pulling force', 'force']], value: P.drive },
        { id: 'U', label: 'Plate speed U', min: 0, max: 2, step: 0.01, value: 0.5, unit: 'm/s' },
        { id: 'F', label: 'Pulling force', min: 0.001, max: 50, value: 2, unit: 'N', log: true, sig: 3 },
        { id: 'h', label: 'Gap h', min: 0.05, max: 5, value: 1, unit: 'mm', log: true, sig: 2 },
        { id: 'T', label: 'Oil temperature', min: 0, max: 100, step: 1, value: 40, unit: '°C' }
      ], () => { vis(); dirty = true; });
      const V = ctl.values;
      function vis() { ctl.show('U', V.drive === 'speed'); ctl.show('F', V.drive === 'force'); ctl.show('T', V.fluid === 'oil'); }
      vis();
      const ro = kit.readout(box.side, [['gd', 'Shear rate γ̇ = U/h'], ['tau', 'Shear stress τ'], ['Fp', 'Force on the plate'], ['U', 'Plate speed'], ['mua', 'Apparent viscosity τ/γ̇'], ['pw', 'Power turned into heat'], ['Re', 'Reynolds number ρUh/μ']]);
      const plot = kit.plot(gbox, { x: { label: 'shear rate (1/s)', name: 'γ̇', min: 0 }, y: { label: 'shear stress (Pa)', min: 0 }, legend: true, fmtX: v => kit.fmt(v, 3) + ' 1/s', fmtY: v => kit.fmt(v, 3) + ' Pa' }, 220);
      const A = 0.01;
      function state() {
        const r = V.fluid === 'oil' ? oilRheo(F, V.T) : RHEO[V.fluid];
        const h = V.h / 1000;
        let U, gd, tau;
        if (V.drive === 'speed') { U = V.U; gd = U / h; tau = gd > 0 ? r.ty + r.K * Math.pow(gd, r.n) : 0; }
        else { tau = V.F / A; gd = tau > r.ty ? Math.pow((tau - r.ty) / r.K, 1 / r.n) : 0; U = gd * h; }
        const mua = gd > 0 ? tau / gd : null;
        const Re = gd > 0 && mua > 0 ? r.rho * U * h / mua : 0;
        return { r, h, U, gd, tau, Fp: tau * A, mua, Re, pw: tau * A * U };
      }
      const s = { off: 0, plate: 0, tPlot: 0 };
      let o = state();
      function updatePlot() {
        const C = kit.colors(), r = o.r;
        const gmax = Math.max(2 * o.gd, 0.5 / o.h, 1);
        const pts = [];
        for (let i = 0; i <= 80; i++) { const g = gmax * i / 80; pts.push([g, g > 0 ? r.ty + r.K * Math.pow(g, r.n) : (r.ty > 0 ? r.ty : 0)]); }
        const series = [{ pts, color: C.accent, width: 3, label: r.ty > 0 ? 'this liquid (flows above τ_y)' : 'this liquid' }];
        if (o.gd > 0) series.push({ pts: [[0, 0], [gmax, o.tau / o.gd * gmax]], color: C.muted, width: 1.5, dash: [6, 4], label: 'Newtonian with the same τ/γ̇' });
        plot.set({ series, x: { label: 'shear rate (1/s)', name: 'γ̇', min: 0, max: gmax }, marks: [{ x: o.gd, y: o.tau, color: C.warn, label: 'working point' }], hlines: r.ty > 0 ? [{ y: r.ty, label: 'yield stress τ_y', color: C.bad }] : [] });
      }
      const f3 = (v, u) => kit.fmt(v, 3) + ' ' + u;
      const loop = kit.loop((dt) => {
        o = state();
        if (kit.colors().dark !== themeDark) { themeDark = kit.colors().dark; dirty = true; }
        if (dirty) { updatePlot(); dirty = false; }
        const C = kit.colors(), r = o.r;
        ro.set('gd', f3(o.gd, '1/s'));
        ro.set('tau', f3(o.tau, 'Pa'));
        ro.set('Fp', f3(o.Fp, 'N'));
        ro.set('U', o.U > 50 ? '> 50 m/s (off the scale)' : f3(o.U, 'm/s'));
        ro.set('mua', o.mua == null ? (r.ty > 0 ? 'no flow: below the yield stress' : '—') : o.mua >= 1 ? f3(o.mua, 'Pa·s') : f3(o.mua * 1000, 'mPa·s'));
        ro.set('pw', f3(o.pw, 'W'));
        ro.set('Re', o.gd > 0 ? kit.fmt(o.Re, 3) + (o.Re > 1500 ? ' — no longer laminar' : ' — laminar') : '—');
        // animation: the top plate and the dye lines move at a compressed visual speed
        const Uv = Math.min(o.U, 50), vpx = 150 * Uv / (Uv + 0.3);
        const spacing = 680 / 6;
        s.off += vpx * dt; if (s.off > spacing) s.off -= spacing;
        s.plate = (s.plate + vpx * dt) % 20;
        const c = frame(st, 760, 300);
        const th = 40 + 110 * Math.log(o.h / 5e-5) / Math.log(100), yTop = 140 - th / 2, yBot = 140 + th / 2;
        const x0 = 40, x1 = 720;
        // liquid
        c.fillStyle = kit.hue(r.hue, 0.22); c.fillRect(x0, yTop, x1 - x0, yBot - yTop);
        // dye lines (fresh ones appear upright and lean over as the top plate moves)
        const fade = 1 - s.off / spacing;
        c.lineWidth = 2.2;
        for (let i = 0; i < 6; i++) {
          const xb = x0 + 20 + i * spacing;
          c.strokeStyle = kit.hue(r.hue, 0.35 + 0.6 * fade);
          c.beginPath(); c.moveTo(xb, yBot); c.lineTo(xb + s.off, yTop); c.stroke();
        }
        // plates
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(x0, yBot, x1 - x0, 16); c.strokeRect(x0, yBot, x1 - x0, 16);
        c.fillRect(x0 + 60, yTop - 18, x1 - x0 - 120, 18); c.strokeRect(x0 + 60, yTop - 18, x1 - x0 - 120, 18);
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let x = x0 + 6; x < x1; x += 14) { c.beginPath(); c.moveTo(x, yBot + 16); c.lineTo(x + 10, yBot + 2); c.stroke(); }
        for (let x = x0 + 62 + s.plate; x < x1 - 62; x += 20) { c.beginPath(); c.moveTo(x, yTop - 3); c.lineTo(x + 8, yTop - 15); c.stroke(); }
        // velocity profile: arrows growing linearly from the fixed plate
        const L = 190 * vpx / 150, xa = x0 + 30;
        if (L > 2) {
          for (let i = 1; i <= 5; i++) {
            const f = i / 5, y = yBot - f * (yBot - yTop);
            kit.arrow(c, xa, y, xa + L * f, y, C.accent, 2);
          }
          c.strokeStyle = C.accent; c.setLineDash([4, 3]); c.lineWidth = 1.2;
          c.beginPath(); c.moveTo(xa, yBot); c.lineTo(xa + L, yTop); c.stroke(); c.setLineDash([]);
        }
        // the pull on the plate
        const fl = clamp(25 + 30 * Math.log10(1 + o.Fp * 20), 25, 120);
        kit.arrow(c, x1 - 60, yTop - 9, x1 - 60 + fl * 0.6, yTop - 9, C.warn, 3);
        kit.label(c, 'F = ' + f3(o.Fp, 'N'), x1 - 60, yTop - 32, { size: 12, color: C.text, weight: 700 });
        kit.label(c, 'U = ' + (o.U > 50 ? '> 50 m/s' : f3(o.U, 'm/s')), x0 + 60, yTop - 32, { size: 12, color: C.text, weight: 700, align: 'left' });
        kit.label(c, 'h = ' + V.h.toPrecision(2) + ' mm', x1 - 8, (yTop + yBot) / 2, { size: 11, color: C.muted, align: 'right', bg: C.bg2 });
        kit.label(c, 'fixed plate', x0 + 8, yBot + 30, { size: 11, color: C.muted, align: 'left' });
        const name = FLUIDS.find(f => f[1] === V.fluid)[0];
        kit.label(c, name + (V.fluid === 'oil' ? ' at ' + V.T + ' °C' : ''), x0, 282, { size: 12, color: C.text, align: 'left', weight: 600 });
        if (o.gd === 0 && r.ty > 0 && V.drive === 'force') kit.label(c, 'below the yield stress: it holds like a solid', 380, 140, { size: 13, color: C.bad, weight: 700, bg: C.bg2 });
        else if (o.gd === 0) kit.label(c, 'plate at rest', 380, 140, { size: 12, color: C.muted, bg: C.bg2 });
        kit.label(c, 'motion drawn slowed down', x1, 282, { size: 11, color: C.muted, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ pipe profiles */
  // laminar flow of τ = τy + K·γ̇ⁿ in a pipe of radius R under a pressure gradient G (Pa/m)
  function hbPipe(ty, K, n, G, R) {
    const tw = G * R / 2;
    if (!(tw > ty)) return { u: () => 0, umax: 0, rp: R, Q: 0, tw, flows: false };
    const rp = ty > 0 ? 2 * ty / G : 0, m = (n + 1) / n, c = (2 / G) * Math.pow(K, -1 / n) * (n / (n + 1)), top = Math.pow(tw - ty, m);
    const u = r => c * (top - Math.pow(Math.max(0, G * Math.max(Math.abs(r), rp) / 2 - ty), m));
    const N = 200; let sum = 0;
    for (let i = 0; i <= N; i++) { const r = R * i / N, w = i === 0 || i === N ? 1 : i % 2 ? 4 : 2; sum += w * 2 * Math.PI * r * u(r); }
    return { u, umax: u(0), rp, Q: sum * R / N / 3, tw, flows: true };
  }
  function gradientFor(ty, K, n, R, Qt) {
    const Gmin = ty > 0 ? 2 * ty / R : 1e-9;
    let lo = Math.log(Gmin), hi = Math.log(Math.max(Gmin * 10, 1e12));
    for (let k = 0; k < 90; k++) { const mid = (lo + hi) / 2; if (hbPipe(ty, K, n, Math.exp(mid), R).Q < Qt) lo = mid; else hi = mid; }
    return Math.exp(hi);
  }

  Hyper.sim('prop-pipe-rheology', {
    title: 'Velocity profiles of non-Newtonian liquids in a pipe',
    blurb: `Laminar flow in a pipe at a chosen mean velocity. The solid curve is the velocity across the pipe for your liquid, the dashed one a Newtonian liquid at the same mean velocity (a parabola); the dots move with the flow. The pressure gradient the liquid needs is found for you. A Bingham or Herschel–Bulkley liquid moves as a solid **plug** wherever the shear stress, which grows from zero on the axis to its largest at the wall, is below the yield stress. The graph is the rheogram up to the wall's shear rate.

**Try this**
- Power law: lower *n* from 1 to 0.3 and watch the profile flatten into a blunt front; raise it to 1.8 and it sharpens into a point.
- Bingham: raise the yield stress — the plug widens, and the pressure needed just to start 100 m of line grows in proportion to the yield stress and inversely to the bore.
- Keep the Bingham liquid and lower the mean velocity: the plug fills more and more of the pipe.
- Compare the apparent viscosity at the wall with the consistency K: for shear-thinning liquids it is what really sets the pressure drop.`,
    mount(box, kit, params) {
      const P = Object.assign({ model: 'bingham' }, params || {});
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230 });
      const gbox = plotBox(box);
      let dirty = true, themeDark = null;
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Liquid model', options: [['Newtonian', 'newt'], ['Power law (thinning or thickening)', 'power'], ['Bingham plastic', 'bingham'], ['Herschel–Bulkley', 'hb']], value: P.model },
        { id: 'n', label: 'Flow index n', min: 0.2, max: 2, step: 0.05, value: 0.5 },
        { id: 'ty', label: 'Yield stress τ_y', min: 0, max: 100, step: 1, value: 20, unit: 'Pa' },
        { id: 'K', label: 'Consistency K (Newtonian: μ), Pa·sⁿ', min: 0.01, max: 10, value: 0.5, log: true, sig: 2 },
        { id: 'V', label: 'Mean velocity', min: 0.01, max: 2, value: 0.2, unit: 'm/s', log: true, sig: 2 },
        { id: 'D', label: 'Pipe bore', min: 10, max: 150, step: 1, value: 50, unit: 'mm' }
      ], () => { vis(); dirty = true; });
      const V = ctl.values;
      function vis() { ctl.show('n', V.model === 'power' || V.model === 'hb'); ctl.show('ty', V.model === 'bingham' || V.model === 'hb'); }
      vis();
      const ro = kit.readout(box.side, [['G', 'Pressure gradient needed'], ['tw', 'Wall shear stress τ_w'], ['plug', 'Plug (unsheared core)'], ['gw', 'Shear rate at the wall'], ['mw', 'Apparent viscosity at the wall'], ['uc', 'Centre / mean velocity'], ['start', 'Pressure to start 100 m of line'], ['Re', 'Reynolds number (μ at wall, ρ = 1000)']]);
      const plot = kit.plot(gbox, { x: { label: 'shear rate (1/s)', name: 'γ̇', min: 0 }, y: { label: 'shear stress (Pa)', min: 0 }, fmtX: v => kit.fmt(v, 3) + ' 1/s', fmtY: v => kit.fmt(v, 3) + ' Pa' }, 200);
      let o = null;
      const dots = [];
      for (let i = 0; i < 110; i++) dots.push({ f: -0.97 + 1.94 * ((i * 0.618034) % 1), x: 30 + 700 * ((i * 0.414214 + 0.13) % 1) });
      function solve() {
        const C = kit.colors();
        const ty = V.model === 'bingham' || V.model === 'hb' ? V.ty : 0, n = V.model === 'power' || V.model === 'hb' ? V.n : 1, K = V.K;
        const R = V.D / 2000, Qt = V.V * Math.PI * R * R;
        const G = gradientFor(ty, K, n, R, Qt), pr = hbPipe(ty, K, n, G, R);
        const gw = pr.flows ? Math.pow(Math.max(0, pr.tw - ty) / K, 1 / n) : 0;
        o = { ty, n, K, R, G, pr, gw, mw: gw > 0 ? pr.tw / gw : null };
        ro.set('G', kit.fmt(G * 100 / 1e5, 3) + ' bar per 100 m');
        ro.set('tw', kit.fmt(pr.tw, 3) + ' Pa');
        ro.set('plug', ty > 0 ? (2 * pr.rp * 1000).toFixed(1) + ' mm of ' + V.D + ' mm (' + (100 * pr.rp / R).toFixed(0) + ' %)' : 'none');
        ro.set('gw', kit.fmt(gw, 3) + ' 1/s');
        ro.set('mw', o.mw ? kit.fmt(o.mw, 3) + ' Pa·s' : '—');
        ro.set('uc', kit.fmt(pr.umax, 3) + ' / ' + kit.fmt(V.V, 3) + ' m/s (×' + (pr.umax / V.V).toFixed(2) + ')');
        ro.set('start', ty > 0 ? kit.fmt(4 * ty * 100 / (2 * R) / 1e5, 3) + ' bar' : 'none: no yield stress');
        const Re = o.mw ? 1000 * V.V * 2 * R / o.mw : 0;
        ro.set('Re', kit.fmt(Re, 3) + (Re > 2100 ? ' — would be turbulent' : ''));
        const gmax = Math.max(gw * 1.25, 1e-3), pts = [];
        for (let i = 0; i <= 80; i++) { const g = gmax * i / 80; pts.push([g, ty + K * Math.pow(g, n)]); }
        plot.set({ series: [{ pts, color: C.accent, width: 3, label: 'rheogram' }], x: { label: 'shear rate (1/s)', name: 'γ̇', min: 0, max: gmax },
          marks: [{ x: gw, y: pr.tw, color: C.warn, label: 'at the wall' }], hlines: ty > 0 ? [{ y: ty, label: 'yield stress', color: C.bad }] : [] });
      }
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        if (kit.colors().dark !== themeDark) { themeDark = kit.colors().dark; dirty = true; }
        if (dirty) { solve(); dirty = false; }
        const pr = o.pr, R = o.R, uref = Math.max(pr.umax, 2 * V.V, 1e-12);
        const c = frame(st, 760, 290);
        const x0 = 30, x1 = 730, yc = 140, Rp = 95, xb = 170, Lp = 380;
        c.fillStyle = kit.hue(200, 0.14); c.fillRect(x0, yc - Rp, x1 - x0, 2 * Rp);
        // plug
        if (o.ty > 0 && pr.rp > 0) {
          const hp = Rp * Math.min(1, pr.rp / R);
          c.fillStyle = kit.hue(40, 0.22); c.fillRect(x0, yc - hp, x1 - x0, 2 * hp);
          kit.label(c, 'plug', x1 - 30, yc, { size: 11, color: C.muted, bg: C.bg2 });
        }
        // tracer dots
        for (const d of dots) {
          const u = pr.u(d.f * R);
          d.x += 230 * u / uref * dt;
          if (d.x > x1) d.x -= (x1 - x0);
          kit.dot(c, d.x, yc - d.f * Rp, 2.4, kit.hue(200, 0.8));
        }
        // walls
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(x0, yc - Rp - 12, x1 - x0, 12); c.strokeRect(x0, yc - Rp - 12, x1 - x0, 12);
        c.fillRect(x0, yc + Rp, x1 - x0, 12); c.strokeRect(x0, yc + Rp, x1 - x0, 12);
        // profiles
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.setLineDash([6, 4]); c.beginPath();
        for (let i = 0; i <= 60; i++) { const f = -1 + 2 * i / 60, x = xb + Lp * 2 * V.V * (1 - f * f) / uref, y = yc - f * Rp; if (i) c.lineTo(x, y); else c.moveTo(x, y); }
        c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.moveTo(xb, yc - Rp); c.lineTo(xb, yc + Rp); c.stroke();
        for (let i = -4; i <= 4; i++) { const f = i / 4.6, u = pr.u(f * R); if (u > uref * 0.02) kit.arrow(c, xb, yc - f * Rp, xb + Lp * u / uref, yc - f * Rp, C.accent, 1.8); }
        c.strokeStyle = C.accent; c.lineWidth = 3; c.beginPath();
        for (let i = 0; i <= 80; i++) { const f = -1 + 2 * i / 80, x = xb + Lp * pr.u(f * R) / uref, y = yc - f * Rp; if (i) c.lineTo(x, y); else c.moveTo(x, y); }
        c.stroke();
        const names = { newt: 'Newtonian', power: V.n < 1 ? 'shear-thinning (n = ' + V.n.toFixed(2) + ')' : V.n > 1 ? 'shear-thickening (n = ' + V.n.toFixed(2) + ')' : 'power law, n = 1 (Newtonian)', bingham: 'Bingham plastic, τ_y = ' + V.ty + ' Pa', hb: 'Herschel–Bulkley, τ_y = ' + V.ty + ' Pa, n = ' + V.n.toFixed(2) };
        kit.label(c, names[V.model], x0, 270, { size: 12, color: C.text, align: 'left', weight: 600 });
        kit.label(c, '— this liquid   - - Newtonian, same mean velocity', x1, 270, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'flow →', x1 - 40, yc - Rp - 24, { size: 12, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ compressing oil */
  Hyper.sim('prop-compress', {
    title: 'Squeezing oil, with and without air',
    blurb: `A closed cylinder of 50 mm bore full of mineral oil (K = 1.6 GPa, steel barrel) is squeezed by its piston until the pressure reaches 400 bar. The graph shows pressure against piston travel: dashed for pure oil in the steel barrel, solid for what you set up — entrained air (as a percentage of the volume at atmospheric pressure) and, if you like, a hose that swells (taken as 0.5 GPa over its 0.25 L). The piston's travel is drawn enlarged.

**Try this**
- Pure oil: 400 bar takes only a few millimetres — under 3 % of the column, barrel stretch included. Double the column length and the travel doubles.
- Add 1 % of air: the first part of the stroke is spent squeezing bubbles at almost no pressure; the stiff part comes later. Compare the effective bulk modulus at 10 bar and at 300 bar.
- Try 5 % air and fast (adiabatic) compression: the bubbles heat as they shrink and push back harder at first.
- Add the hose: the whole curve leans over — hoses, not only air, are why real circuits are softer than the oil.
- Watch the stored energy: it is what a decompression shock releases.`,
    mount(box, kit, params) {
      const S = kit.fsym;
      const P = Object.assign({ air: 0 }, params || {});
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 220 });
      const gbox = plotBox(box);
      let dirty = true, auto = true, tAuto = 0.4 * 8, tPlot = 0;
      const ctl = kit.controls(box.side, [
        { id: 'air', label: 'Entrained air (volume %, at 1 bar)', min: 0, max: 10, step: 0.1, value: P.air, unit: '%' },
        { id: 'L', label: 'Oil column length', min: 50, max: 500, step: 10, value: 200, unit: 'mm' },
        { id: 'hose', type: 'check', label: 'Fed through 2 m of rubber hose', value: false },
        { id: 'n', type: 'select', label: 'Compression', options: [['slow (isothermal, n = 1)', 1], ['fast (adiabatic, n = 1.4)', 1.4]], value: 1 },
        { id: 'auto', type: 'check', label: 'Stroke the piston automatically', value: true },
        { id: 'sq', label: 'Squeeze (% of the travel to 400 bar)', min: 0, max: 100, step: 0.5, value: 40, unit: '%' }
      ], (id) => { if (id === 'sq') { ctl.set('auto', false); auto = false; } if (id === 'auto') auto = !!ctl.values.auto; dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['x', 'Piston travel'], ['p', 'Pressure (gauge)'], ['air', 'Air bubbles now'], ['K', 'Effective bulk modulus here'], ['k', 'Stiffness of the column'], ['E', 'Energy stored'], ['ref', 'Pure oil would need']]);
      const plot = kit.plot(gbox, { x: { label: 'piston travel (mm)', name: 'x', min: 0 }, y: { label: 'pressure (bar, gauge)', min: 0, max: 420 }, legend: true, fmtX: v => v.toFixed(2) + ' mm', fmtY: v => v.toFixed(0) + ' bar' }, 220);
      const D = 0.05, A = Math.PI * D * D / 4, Koil = 1.6e9, Ksteel = 25e9, Khose = 0.5e9, Vhose = 2 * Math.PI * 0.0127 * 0.0127 / 4, PMAX = P0 + 400e5;
      let m = null;
      function model() {
        const Vc = A * V.L / 1000, Va0 = Vc * V.air / 100, Vo = Vc - Va0, Vh = V.hose ? Vhose : 0, n = +V.n || 1;
        const dV = p => (Vo + Vh) * (p - P0) / Koil + Va0 * (1 - Math.pow(P0 / p, 1 / n)) + Vc * (p - P0) / Ksteel + Vh * (p - P0) / Khose;
        const dVdp = p => (Vo + Vh) / Koil + Va0 / n * Math.pow(P0, 1 / n) * Math.pow(p, -1 / n - 1) + Vc / Ksteel + Vh / Khose;
        const dVref = p => Vc * (p - P0) * (1 / Koil + 1 / Ksteel);
        return { Vc, Va0, Vh, n, dV, dVdp, dVref, xmax: dV(PMAX) / A };
      }
      function pAt(x) {
        const t = x * A; let lo = P0, hi = PMAX;
        for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (m.dV(mid) < t) lo = mid; else hi = mid; }
        return (lo + hi) / 2;
      }
      function curves() {
        const C = kit.colors(), a = [], b = [];
        for (let i = 0; i <= 120; i++) { const p = P0 + 400e5 * Math.pow(i / 120, 2); a.push([m.dV(p) / A * 1000, (p - P0) / 1e5]); b.push([m.dVref(p) / A * 1000, (p - P0) / 1e5]); }
        return [{ pts: a, color: C.accent, width: 3, label: 'your set-up' }, { pts: b, color: C.muted, width: 1.5, dash: [6, 4], label: 'pure oil, steel barrel' }];
      }
      const bub = [];
      for (let i = 0; i < 150; i++) bub.push({ fx: (i * 0.618034 + 0.05) % 1, fy: (i * 0.754877 + 0.3) % 1, s: 0.6 + 0.8 * ((i * 0.3819) % 1) });
      let series = [];
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        if (dirty) { m = model(); series = curves(); dirty = false; tPlot = 1; }
        if (auto) {
          tAuto = (tAuto + dt) % 8;
          const ph = tAuto / 8, sq = ph < 0.45 ? ph / 0.45 : ph < 0.55 ? 1 : ph < 0.95 ? 1 - (ph - 0.55) / 0.4 : 0;
          ctl.set('sq', Math.round(sq * 1000) / 10);
        }
        const x = V.sq / 100 * m.xmax, p = pAt(x), pg = p - P0;
        const Vnow = m.Vc + m.Vh - m.dV(p), comp = m.dVdp(p), Kt = Vnow / comp, kcol = A * A / comp;
        let E = 0; const N = 60;
        for (let i = 0; i <= N; i++) { const q = P0 + pg * i / N, w = i === 0 || i === N ? 1 : i % 2 ? 4 : 2; E += w * (q - P0) * m.dVdp(q); }
        E *= pg / N / 3;
        const Va = m.Va0 * Math.pow(P0 / p, 1 / m.n);
        ro.set('x', (x * 1000).toFixed(2) + ' mm');
        ro.set('p', (pg / 1e5).toFixed(1) + ' bar');
        ro.set('air', m.Va0 > 0 ? (100 * Va / Vnow).toPrecision(2) + ' % of the contents (from ' + V.air.toFixed(1) + ' %)' : 'none');
        ro.set('K', Kt >= 1e8 ? (Kt / 1e9).toFixed(3) + ' GPa' : kit.fmt(Kt / 1e6, 3) + ' MPa');
        ro.set('k', kit.fmt(kcol / 1000, 3) + ' N/mm');
        ro.set('E', kit.fmt(E, 3) + ' J');
        ro.set('ref', (m.dVref(p) / A * 1000).toFixed(2) + ' mm of travel for this pressure');
        tPlot += dt;
        if (tPlot > 0.1) { tPlot = 0; plot.set({ series, x: { label: 'piston travel (mm)', name: 'x', min: 0, max: m.xmax * 1000 * 1.04 }, marks: [{ x: x * 1000, y: pg / 1e5, color: C.warn }] }); }
        // ---- drawing on a 760 × 250 grid
        const c = frame(st, 760, 250);
        const bx0 = 170, Lpx = 180 + 280 * (V.L - 50) / 450, bx1 = bx0 + Lpx, yt = 80, yb = 170;
        const vscale = Math.min(12, 150 / Math.max(m.xmax * 1000, 0.05)), px = bx1 - x * 1000 * vscale;
        // contents, tinted by pressure
        c.fillStyle = kit.hue(38, 0.25); c.fillRect(bx0, yt, px - bx0, yb - yt);
        c.fillStyle = C.bad; c.globalAlpha = clamp(pg / 400e5, 0, 1) * 0.35; c.fillRect(bx0, yt, px - bx0, yb - yt); c.globalAlpha = 1;
        // bubbles
        const nb = Math.min(150, Math.round(V.air * 15)), rb = 7 * Math.pow(Va / Math.max(m.Va0, 1e-15), 1 / 3);
        c.strokeStyle = C.text; c.lineWidth = 1;
        for (let i = 0; i < nb; i++) {
          const b = bub[i], r = Math.max(0.6, rb * b.s), xx = bx0 + 8 + b.fx * (px - bx0 - 16), yy = yt + 8 + b.fy * (yb - yt - 16);
          c.fillStyle = C.surface; c.beginPath(); c.arc(xx, yy, r, 0, Math.PI * 2); c.fill(); c.stroke();
        }
        // barrel, piston and rod
        c.strokeStyle = C.text; c.lineWidth = 3;
        c.beginPath(); c.moveTo(bx1 + 40, yt); c.lineTo(bx0, yt); c.lineTo(bx0, yb); c.lineTo(bx1 + 40, yb); c.stroke();
        c.fillStyle = C.text; c.fillRect(px, yt + 2, 12, yb - yt - 4);
        c.fillStyle = C.surface; c.lineWidth = 1.5; c.fillRect(px + 12, (yt + yb) / 2 - 12, 70, 24); c.strokeRect(px + 12, (yt + yb) / 2 - 12, 70, 24);
        kit.arrow(c, px + 122, (yt + yb) / 2, px + 86, (yt + yb) / 2, C.warn, 3);
        // gauge and its line (a hose if chosen)
        const gx = 80, gy = 62;
        c.save(); c.translate(gx, gy); c.scale(2, 2); S.gauge(c, 0, 0, { frac: pg / 400e5 }); c.restore();
        const line = [[gx, gy + 42], [gx, 125], [bx0, 125]];
        if (V.hose) {
          c.strokeStyle = S.col(pg > 20e5 ? 'pressure' : 'idle'); c.lineWidth = 5; c.beginPath(); c.moveTo(gx, gy + 42);
          for (let i = 0; i <= 40; i++) { const t = i / 40, xx = gx + (bx0 - gx) * t, yy = gy + 42 + (125 - gy - 42) * Math.min(1, t * 3) + 8 * Math.sin(t * Math.PI * 4) * Math.min(1, t * 3); c.lineTo(xx, yy); }
          c.stroke(); kit.label(c, 'hose', (gx + bx0) / 2, 150, { size: 11, color: C.muted });
        } else S.line(c, line, { state: pg > 20e5 ? 'pressure' : 'idle' });
        kit.label(c, (pg / 1e5).toFixed(0) + ' bar', gx, gy - 34, { size: 13, color: C.text, weight: 700 });
        kit.label(c, 'piston travel ' + (x * 1000).toFixed(2) + ' mm (drawn ×' + vscale.toFixed(1) + ')', bx0, 210, { size: 12, color: C.muted, align: 'left' });
        kit.label(c, V.air > 0 ? 'air: ' + V.air.toFixed(1) + ' % at 1 bar → ' + (100 * Va / Vnow).toPrecision(2) + ' % now' : 'no air', bx0, 232, { size: 12, color: C.text, align: 'left', weight: 600 });
        kit.label(c, 'oil column ' + V.L + ' mm × Ø50 mm', bx0 + 4, yt - 14, { size: 11, color: C.muted, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ capillary rise */
  const LIQ = [
    ['Water, clean glass', 'water'], ['Water with detergent', 'soapy'], ['Water in a PTFE (plastic) tube', 'ptfe'],
    ['Ethanol', 'ethanol'], ['Mineral hydraulic oil', 'oil'], ['Glycerol', 'glycerol'], ['Mercury, glass', 'mercury']
  ];
  const LIQP = {
    water: { sigma: 72.8, theta: 0, rho: 998, hue: 210 }, soapy: { sigma: 30, theta: 0, rho: 998, hue: 200 },
    ptfe: { sigma: 72.8, theta: 110, rho: 998, hue: 210 }, ethanol: { sigma: 22.3, theta: 0, rho: 789, hue: 185 },
    oil: { sigma: 30, theta: 0, rho: 870, hue: 38 }, glycerol: { sigma: 63.4, theta: 0, rho: 1261, hue: 280 },
    mercury: { sigma: 485, theta: 140, rho: 13546, hue: 0, grey: true }
  };
  const BORES = [0.5, 1, 2, 4, 8];

  Hyper.sim('prop-capillary', {
    title: 'Capillary rise in narrow tubes',
    blurb: `Glass tubes of different bores stand in a dish of liquid; the last one is yours. Surface tension pulls on the liquid all round the rim of the meniscus, and the liquid climbs until the weight of the raised column balances that pull: $h = 4\\sigma\\cos\\theta/(\\rho g d)$. A liquid that does not wet the tube ($\\theta > 90°$) is pushed down instead. Tube widths are not drawn to scale; heights are, against the ruler.

**Try this**
- Water: halve the bore and the rise doubles. Take your tube down to 0.1 mm — the water climbs about 30 cm.
- Add detergent: the surface tension falls to about 30 mN/m and every column drops.
- Mercury: every tube shows a depression, largest in the narrowest tube.
- Water in a plastic (PTFE) tube, contact angle about 110°: now water is pushed down too.
- Compare the readouts: the pull of surface tension around the rim always equals the weight of the column it holds up.`,
    mount(box, kit, params) {
      const P = Object.assign({ liquid: 'water' }, params || {});
      const st = kit.stage(box.stage, { aspect: 0.45, minH: 260 });
      const gbox = plotBox(box);
      let dirty = true, themeDark = null;
      const ctl = kit.controls(box.side, [
        { id: 'liquid', type: 'select', label: 'Liquid and tube', options: LIQ, value: P.liquid },
        { id: 'd', label: 'Bore of your tube', min: 0.1, max: 10, value: 1.5, unit: 'mm', log: true, sig: 2 },
        { id: 'theta', label: 'Contact angle θ', min: 0, max: 180, step: 1, value: LIQP[P.liquid].theta, unit: '°' }
      ], (id, v) => { if (id === 'liquid') ctl.set('theta', LIQP[v].theta); dirty = true; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['h', 'Rise in your tube'], ['dp', 'Pressure step at the meniscus'], ['pull', 'Surface-tension pull round the rim'], ['wt', 'Weight of the raised column'], ['props', 'σ, ρ, θ']]);
      const plot = kit.plot(gbox, { x: { label: 'tube bore (mm)', name: 'd', log: true, min: 0.1, max: 10 }, y: { label: 'capillary rise (mm)' }, fmtX: v => kit.fmt(v, 3) + ' mm', fmtY: v => kit.fmt(v, 3) + ' mm' }, 200);
      const hOf = (L, th, d) => 4 * L.sigma * 1e-3 * Math.cos(th * Math.PI / 180) / (L.rho * G0 * d * 1e-3) * 1000;   // mm
      const shown = BORES.concat([0]).map(() => 0);
      let scale = 2;
      const loop = kit.loop((dt) => {
        const C = kit.colors(), L = LIQP[V.liquid], th = V.theta;
        const bores = BORES.concat([V.d]), hs = bores.map(d => hOf(L, th, d));
        if (C.dark !== themeDark) { themeDark = C.dark; dirty = true; }
        if (dirty) {
          dirty = false;
          const pts = []; for (let i = 0; i <= 80; i++) { const d = 0.1 * Math.pow(100, i / 80); pts.push([d, hOf(L, th, d)]); }
          plot.set({ series: [{ pts, color: C.accent, width: 3 }], marks: bores.map((d, i) => ({ x: d, y: hs[i], color: i === 5 ? C.warn : C.accent, label: i === 5 ? 'your tube' : undefined })) });
          const hy = hs[5], sig = L.sigma * 1e-3, d = V.d * 1e-3;
          ro.set('h', kit.fmt(hy, 3) + ' mm' + (hy < 0 ? ' (depression)' : ''));
          ro.set('dp', kit.fmt(Math.abs(4 * sig * Math.cos(th * Math.PI / 180) / d), 3) + ' Pa (= ρgh)');
          ro.set('pull', kit.fmt(Math.abs(sig * Math.cos(th * Math.PI / 180) * Math.PI * d) * 1000, 3) + ' mN');
          ro.set('wt', kit.fmt(Math.abs(L.rho * G0 * Math.PI * d * d / 4 * hy / 1000) * 1000, 3) + ' mN');
          ro.set('props', L.sigma + ' mN/m, ' + L.rho + ' kg/m³, ' + th + '°');
        }
        const maxUp = Math.max(1e-6, ...hs), maxDn = Math.max(1e-6, ...hs.map(h => -h));
        const want = Math.min(4, 200 / maxUp, 55 / maxDn);
        scale += (want - scale) * Math.min(1, dt * 4);
        for (let i = 0; i < 6; i++) shown[i] += (hs[i] - shown[i]) * Math.min(1, dt * 2.5);
        const c = frame(st, 760, 340);
        const ys = 255, fill = L.grey ? (C.dark ? 'rgba(190,195,210,.75)' : 'rgba(120,125,140,.7)') : kit.hue(L.hue, 0.45);
        // dish
        c.fillStyle = fill; c.fillRect(40, ys, 680, 60);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(40, ys - 12); c.lineTo(40, 316); c.lineTo(720, 316); c.lineTo(720, ys - 12); c.stroke();
        // ruler
        const step = Hyper.niceStep(200 / scale, 5) || 10;
        c.strokeStyle = C.muted; c.lineWidth = 1;
        for (let v = -Math.floor(55 / scale / step) * step; v * scale <= 215 && step > 0; v += step) {
          const y = ys - v * scale; if (y < 22 || y > 312) continue;
          c.beginPath(); c.moveTo(58, y); c.lineTo(66, y); c.stroke();
          kit.label(c, kit.fmt(v, 3), 54, y, { size: 10, color: C.muted, align: 'right' });
        }
        kit.label(c, 'mm', 62, 14, { size: 10, color: C.muted });
        // tubes
        for (let i = 0; i < 6; i++) {
          const d = bores[i], x = 120 + i * 105, w = 6 + 5 * Math.sqrt(d), top = 26, bot = 306, h = shown[i];
          const yl = clamp(ys - h * scale, top + 12, bot - 12);
          // the column, with its meniscus: hollow (climbing the wall) when the liquid wets the tube, domed when not;
          // yl is the height at the centre of the meniscus, which is where the rise is measured
          const a = th * Math.PI / 180, cth = Math.cos(a);
          const dm = Math.min(w / 2, (w / 2) * (1 - Math.sin(a)) / Math.max(Math.abs(cth), 0.05));
          c.fillStyle = fill;
          if (cth >= 0) {
            c.fillRect(x - w / 2, yl, w, Math.max(0, bot - yl));
            c.beginPath(); c.moveTo(x - w / 2, yl + 0.5); c.lineTo(x - w / 2, yl - dm); c.quadraticCurveTo(x, yl + dm, x + w / 2, yl - dm); c.lineTo(x + w / 2, yl + 0.5); c.closePath(); c.fill();
          } else {
            c.fillRect(x - w / 2, yl + dm, w, Math.max(0, bot - yl - dm));
            c.beginPath(); c.moveTo(x - w / 2, yl + dm + 0.5); c.quadraticCurveTo(x, yl - dm, x + w / 2, yl + dm + 0.5); c.closePath(); c.fill();
          }
          c.strokeStyle = i === 5 ? C.warn : C.text; c.lineWidth = i === 5 ? 2.4 : 1.6;
          c.beginPath(); c.moveTo(x - w / 2 - 1.5, top); c.lineTo(x - w / 2 - 1.5, bot); c.moveTo(x + w / 2 + 1.5, top); c.lineTo(x + w / 2 + 1.5, bot); c.stroke();
          kit.label(c, (i === 5 ? 'yours ' : '') + kit.fmt(d, 2) + ' mm', x, 330, { size: 11, color: i === 5 ? C.warn : C.muted, weight: i === 5 ? 700 : 500 });
          kit.label(c, kit.fmt(hs[i], 3) + ' mm', x, Math.max(14, Math.min(yl, ys) - 14), { size: 11, color: C.text, weight: 600, bg: C.bg2 });
        }
        c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(66, ys); c.lineTo(720, ys); c.stroke(); c.setLineDash([]);
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ boiling and altitude */
  Hyper.sim('prop-vapour', {
    title: 'Boiling point, altitude and pressure',
    blurb: `A pot of water on a stove at any altitude in the standard atmosphere. The water warms until its vapour pressure reaches the pressure on it; then it boils and stays at that temperature, however hard it is heated. The graph is water's vapour-pressure curve (IAPWS-IF97) with the pressure on the water: where they cross is the boiling point.

**Try this**
- Heat at sea level: boiling at 100 °C. Climb to 3000 m — it boils at 90 °C; at the top of Everest near 70 °C.
- Let the water boil at sea level, then climb quickly: the water is suddenly above its new boiling point and flashes into a burst of boiling until it has cooled to it.
- Put on the pressure-cooker lid (about 1 bar above the air outside): the water reaches about 120 °C at sea level.
- Watch the suction-lift readout: the hotter the water and the higher the site, the less a suction pump can lift — the link to cavitation and NPSH.`,
    mount(box, kit, params) {
      const F = kit.fluid;
      const P = Object.assign({ h: 0 }, params || {});
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 240 });
      const gbox = plotBox(box);
      let dirty = true, T = 20, tPlot = 1, flash = 0;
      const ctl = kit.controls(box.side, [
        { id: 'h', label: 'Altitude', min: 0, max: 9000, step: 50, value: P.h, unit: 'm' },
        { id: 'lid', type: 'check', label: 'Pressure-cooker lid (+1.0 bar)', value: false },
        { id: 'burner', type: 'check', label: 'Burner on', value: true },
        { type: 'buttons', items: [{ id: 'fresh', label: 'Fresh water at 20 °C' }, { id: 'sea', label: 'Sea level' }, { id: 'ev', label: 'Everest, 8849 m' }] }
      ], (id) => {
        if (id === 'fresh') T = 20;
        if (id === 'sea') ctl.set('h', 0);
        if (id === 'ev') ctl.set('h', 8849);
        dirty = true;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pa', 'Air pressure (standard atmosphere)'], ['pw', 'Pressure on the water (absolute)'], ['tb', 'Boiling point'], ['T', 'Water temperature'], ['pv', 'Vapour pressure of the water'], ['state', 'State'], ['lift', 'Suction-lift limit at this T']]);
      const plot = kit.plot(gbox, { x: { label: 'temperature (°C)', name: 'T', min: 0, max: 160 }, y: { label: 'pressure (kPa, absolute)', log: true, min: 0.5, max: 800 }, fmtX: v => v.toFixed(1) + ' °C', fmtY: v => kit.fmt(v, 3) + ' kPa' }, 220);
      const curve = []; for (let t = 0; t <= 160; t += 2) curve.push([t, psat(t) / 1000]);
      const bubbles = [];
      let seed = 1, spawn = 0, clock = 0;
      const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        clock += dt;
        const pa = F.isa(V.h).p, pw = pa + (V.lid ? 1e5 : 0), Tb = tsat(pw);
        // heating and cooling (compressed time: a real pot takes minutes)
        if (T > Tb + 0.05) { flash = 1; T -= (T - Tb) * Math.min(1, dt * 1.5); }
        else if (V.burner) T = Math.min(Tb, T + 7 * dt);
        else T -= (T - 20) * dt / 25;
        flash = Math.max(0, flash - dt * 0.6);
        const boiling = (V.burner && T >= Tb - 0.05) || flash > 0.05;
        const pv = psat(T);
        ro.set('pa', (pa / 1000).toFixed(1) + ' kPa');
        ro.set('pw', (pw / 1000).toFixed(1) + ' kPa' + (V.lid ? ' (lid)' : ''));
        ro.set('tb', Tb.toFixed(1) + ' °C');
        ro.set('T', T.toFixed(1) + ' °C');
        ro.set('pv', (pv / 1000).toFixed(2) + ' kPa');
        ro.set('state', flash > 0.05 ? 'flashing: above its boiling point, boiling hard' : boiling ? 'boiling' : V.burner ? (Tb - T < 6 ? 'nearly boiling: bubbles form and collapse' : 'heating') : 'cooling');
        ro.set('lift', Math.max(0, (pa - pv) / (rhoWater(T) * G0)).toFixed(2) + ' m of water');
        tPlot += dt;
        if (dirty || tPlot > 0.12) {
          tPlot = 0; dirty = false;
          plot.set({ series: [{ pts: curve, color: C.accent, width: 3, label: 'vapour pressure of water' }],
            hlines: [{ y: pw / 1000, label: 'pressure on the water ' + (pw / 1000).toFixed(1) + ' kPa', color: C.warn }],
            vlines: [{ x: Tb, label: 'boils at ' + Tb.toFixed(1) + ' °C', color: C.bad }],
            marks: [{ x: T, y: pv / 1000, color: boiling ? C.bad : C.ok, label: T.toFixed(0) + ' °C' }] });
        }
        // bubbles
        const nearly = V.burner && !boiling && Tb - T < 6;
        const rate = boiling ? 60 + 140 * flash : nearly ? 25 : 0;
        spawn = Math.min(spawn + rate * dt, 30);
        for (; spawn >= 1; spawn -= 1) if (bubbles.length < 220) bubbles.push({ x: 430 + 200 * rnd(), y: 244, r: boiling ? 2 + 4 * rnd() : 1.5 + 1.5 * rnd(), life: boiling ? 9 : 0.25 + 0.4 * rnd(), v: 40 + 60 * rnd() });
        for (const b of bubbles) { b.y -= b.v * dt * (boiling ? 1.6 : 0.6); b.life -= dt; if (boiling) b.r += dt * 2; }
        for (let i = bubbles.length - 1; i >= 0; i--) if (bubbles[i].y < 152 || bubbles[i].life <= 0) bubbles.splice(i, 1);
        // ---- drawing on a 760 × 300 grid
        const c = frame(st, 760, 300);
        // the mountain and the altitude marker
        const yA = h => 270 - 225 * h / 9000;
        c.fillStyle = kit.hue(140, 0.18); c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(20, 270); c.lineTo(90, yA(4200)); c.lineTo(120, yA(3600)); c.lineTo(180, yA(8849)); c.lineTo(230, yA(5200)); c.lineTo(260, yA(6100)); c.lineTo(310, 270); c.closePath(); c.fill(); c.stroke();
        for (const h of [0, 2000, 4000, 6000, 8000]) { kit.label(c, h + ' m', 330, yA(h), { size: 10, color: C.muted, align: 'left' }); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(310, yA(h)); c.lineTo(325, yA(h)); c.stroke(); }
        const my = yA(V.h);
        c.strokeStyle = C.warn; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(20, my); c.lineTo(325, my); c.stroke(); c.setLineDash([]);
        kit.dot(c, 22, my, 5, C.warn);
        kit.label(c, V.h + ' m · ' + (pa / 1000).toFixed(1) + ' kPa', 30, my - 12, { size: 12, color: C.text, weight: 700, align: 'left', bg: C.bg2 });
        // stove and pot
        const px0 = 420, px1 = 640, wy = 156, by = 250;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(395, 268, 270, 14); c.strokeRect(395, 268, 270, 14);
        if (V.burner) for (let i = 0; i < 9; i++) { const fx = 440 + i * 22, fh = 8 + 5 * Math.sin(clock * 13 + i * 1.7); c.fillStyle = kit.hue(i % 2 ? 25 : 45, 0.85); c.beginPath(); c.moveTo(fx - 6, 267); c.quadraticCurveTo(fx, 267 - 2 * fh, fx + 6, 267); c.fill(); }
        const warm = clamp((T - 20) / 100, 0, 1);
        c.fillStyle = kit.hue(210 - 190 * warm, 0.4); c.fillRect(px0, wy, px1 - px0, by - wy);
        for (const b of bubbles) { c.strokeStyle = C.text; c.lineWidth = 1; c.fillStyle = C.bg2; c.beginPath(); c.arc(b.x, b.y, b.r, 0, Math.PI * 2); c.fill(); c.stroke(); }
        c.strokeStyle = C.text; c.lineWidth = 3;
        c.beginPath(); c.moveTo(px0 - 4, 120); c.lineTo(px0 - 4, by + 4); c.lineTo(px1 + 4, by + 4); c.lineTo(px1 + 4, 120); c.stroke();
        c.beginPath(); c.moveTo(px0 - 4, 132); c.lineTo(px0 - 26, 132); c.moveTo(px1 + 4, 132); c.lineTo(px1 + 26, 132); c.stroke();
        if (V.lid) {
          c.fillStyle = C.surface; c.fillRect(px0 - 10, 110, px1 - px0 + 20, 10); c.strokeRect(px0 - 10, 110, px1 - px0 + 20, 10);
          c.fillStyle = C.text; c.fillRect((px0 + px1) / 2 - 6, 96, 12, 14);
          if (boiling) for (let i = 0; i < 3; i++) { const yy = 90 - ((clock * 40 + i * 14) % 42); c.strokeStyle = C.muted; c.globalAlpha = 0.6; c.beginPath(); c.moveTo((px0 + px1) / 2, yy + 8); c.quadraticCurveTo((px0 + px1) / 2 + 8, yy + 4, (px0 + px1) / 2, yy); c.stroke(); c.globalAlpha = 1; }
          kit.label(c, 'lid + weighted valve', (px0 + px1) / 2, 80 - 34, { size: 11, color: C.muted });
        } else if (boiling) {
          for (let i = 0; i < 5; i++) { const xx = 450 + i * 40, yy = 140 - ((clock * 30 + i * 11) % 60); c.strokeStyle = C.muted; c.globalAlpha = 0.5; c.lineWidth = 2; c.beginPath(); c.moveTo(xx, yy + 14); c.quadraticCurveTo(xx + 10, yy + 7, xx, yy); c.stroke(); c.globalAlpha = 1; }
        }
        // thermometer
        const tx = 700, t0 = 250, t1 = 60, ty = t => t0 - (t0 - t1) * clamp(t, 0, 130) / 130;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(tx - 5, t1, 10, t0 - t1);
        c.fillStyle = C.bad; c.fillRect(tx - 3, ty(T), 6, t0 - ty(T)); kit.dot(c, tx, t0 + 8, 8, C.bad);
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(tx - 12, ty(Tb)); c.lineTo(tx + 12, ty(Tb)); c.stroke();
        kit.label(c, 'boils ' + Tb.toFixed(1) + ' °C', tx - 16, ty(Tb) - 10, { size: 11, color: C.warn, align: 'right', weight: 700 });
        kit.label(c, T.toFixed(1) + ' °C', tx + 12, ty(T), { size: 12, color: C.text, align: 'left', weight: 700 });
        kit.label(c, boiling ? (flash > 0.05 ? 'flash boiling!' : 'boiling') : V.burner ? 'heating' : 'cooling', (px0 + px1) / 2, 292, { size: 13, color: boiling ? C.bad : C.text, weight: 700 });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ air in oil */
  Hyper.sim('prop-air-release', {
    title: 'Dissolved and entrained air in oil',
    blurb: `A litre of mineral oil in a sight glass whose absolute pressure you set. The oil can hold in solution about 9 % of its volume of air at atmospheric pressure (Henry's law, Bunsen coefficient 0.09), and in proportion to the pressure. When the pressure drops below the level at which the oil was saturated, air comes out quickly as bubbles; when it rises, the bubbles shrink at once but dissolve again only slowly. Faint specks stand for dissolved air, circles for bubbles. Time runs at about real speed.

**Try this**
- Start at 1 bar, then press **Pump inlet 0.7 bar**: bubbles appear within seconds. Go to **Starved inlet 0.4 bar** — far more, and much larger.
- Now press **Pressure line 150 bar**: the bubbles shrink to specks at once (Boyle), then slowly dissolve — watch "free air" fall over a minute.
- Tick **Suction leak** at a low pressure: air is drawn in and the effective bulk modulus collapses to a few megapascals.
- Keep that extra air, go to 150 bar for a minute or two until it has dissolved, then return to 1 bar: the oil now holds more than it can at 1 bar, and it fizzes — as oil returning from a high-pressure circuit does in the tank.
- Tick **Bubbles can rise out** to let a resting reservoir clear them.`,
    mount(box, kit, params) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 230 });
      const gbox = plotBox(box);
      const ALPHA = 0.09, KOIL = 1.6e9;
      const s = { D: ALPHA * 1.0 * 1e5 / P0, F: 0, t: 0 };
      const hist = [];
      let tPlot = 1;
      const ctl = kit.controls(box.side, [
        { id: 'p', label: 'Pressure (absolute)', min: 0.2, max: 200, value: 1.0, unit: 'bar', log: true, sig: 3 },
        { type: 'buttons', items: [{ id: 'tank', label: 'Reservoir 1 bar' }, { id: 'inlet', label: 'Pump inlet 0.7 bar' }, { id: 'starved', label: 'Starved inlet 0.4 bar' }, { id: 'line', label: 'Pressure line 150 bar' }] },
        { id: 'leak', type: 'check', label: 'Suction leak (air drawn in below 1 bar)', value: false },
        { id: 'rise', type: 'check', label: 'Bubbles can rise out (resting reservoir)', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Fresh oil, saturated at 1 bar' }] }
      ], (id) => {
        if (id === 'tank') ctl.set('p', 1.0);
        if (id === 'inlet') ctl.set('p', 0.7);
        if (id === 'starved') ctl.set('p', 0.4);
        if (id === 'line') ctl.set('p', 150);
        if (id === 'reset') { s.D = ALPHA * 1e5 / P0; s.F = 0; hist.length = 0; s.t = 0; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Pressure (absolute)'], ['S', 'Oil can dissolve'], ['D', 'Dissolved now'], ['F', 'Free air, counted at 1 bar'], ['phi', 'Bubbles at this pressure'], ['K', 'Effective bulk modulus'], ['state', 'What is happening']]);
      const plot = kit.plot(gbox, { x: { label: 'time (s)', name: 't' }, y: { label: 'air, % of the oil volume (at 1 bar)', min: 0 }, legend: true, fmtX: v => v.toFixed(1) + ' s', fmtY: v => v.toFixed(2) + ' %' }, 200);
      const bub = [], specks = [];
      for (let i = 0; i < 160; i++) bub.push({ fx: (i * 0.618034 + 0.11) % 1, y: (i * 0.754877) % 1, s: 0.6 + 0.8 * ((i * 0.3819 + 0.2) % 1) });
      for (let i = 0; i < 260; i++) specks.push([(i * 0.5698 + 0.03) % 1, (i * 0.8191 + 0.5) % 1]);
      function step(h) {
        const p = V.p * 1e5, Sat = ALPHA * p / P0;
        if (s.D > Sat) { const r = 0.8 * (s.D - Sat); s.D -= r * h; s.F += r * h; }
        else if (s.F > 0) { const r = Math.min(s.F, (Sat - s.D)) / 30; s.D += r * h; s.F -= r * h; }
        if (V.leak && p < P0) s.F += 0.004 * (P0 - p) / P0 * h;
        if (V.rise) s.F -= s.F * 0.12 * h;
        s.F = Math.max(0, s.F);
        s.t += h;
      }
      const pc = v => (v * 100).toFixed(2) + ' %';
      const loop = kit.loop((dt) => {
        for (let k = 0; k < 5; k++) step(dt / 5);
        const C = kit.colors(), p = V.p * 1e5, Sat = ALPHA * p / P0, phi = s.F * P0 / p;
        const Ke = 1 / (1 / KOIL + phi / p);
        const pgauge = V.p - P0 / 1e5;
        ro.set('p', V.p.toPrecision(3) + ' bar (' + (pgauge < -0.005 ? '−' : '') + Math.abs(pgauge).toFixed(2) + ' bar gauge)');
        ro.set('S', pc(Sat) + ' of its volume');
        ro.set('D', pc(s.D));
        ro.set('F', pc(s.F));
        ro.set('phi', pc(phi) + ' of the oil volume');
        ro.set('K', Ke >= 1e8 ? (Ke / 1e9).toFixed(3) + ' GPa' : kit.fmt(Ke / 1e6, 3) + ' MPa');
        ro.set('state', s.D > Sat * 1.01 ? 'supersaturated: air coming out as bubbles' : s.F > 1e-4 && s.D < Sat * 0.99 ? 'bubbles slowly dissolving' : s.F > 1e-4 ? 'bubbles in equilibrium' : 'all air dissolved');
        tPlot += dt;
        if (tPlot > 0.2) {
          tPlot = 0; hist.push([s.t, s.D * 100, Sat * 100, s.F * 100]); if (hist.length > 300) hist.shift();
          const ymax = Math.max(12, ...hist.map(q => Math.max(q[1], q[3]))) * 1.15;
          plot.set({ y: { label: 'air, % of the oil volume (at 1 bar)', min: 0, max: ymax },
            series: [{ pts: hist.map(q => [q[0], q[2]]), color: C.muted, dash: [6, 4], width: 1.5, label: 'can dissolve' }, { pts: hist.map(q => [q[0], q[1]]), color: C.accent, width: 2.5, label: 'dissolved' }, { pts: hist.map(q => [q[0], q[3]]), color: C.warn, width: 2.5, label: 'free (bubbles)' }] });
        }
        // ---- drawing on a 760 × 270 grid
        const c = frame(st, 760, 270);
        const gx0 = 300, gx1 = 500, gy0 = 30, gy1 = 240;
        c.fillStyle = kit.hue(38, 0.28); c.fillRect(gx0, gy0, gx1 - gx0, gy1 - gy0);
        // dissolved air as faint specks
        const nsp = Math.min(260, Math.round(s.D / (ALPHA * 3) * 260));
        c.fillStyle = C.muted;
        for (let i = 0; i < nsp; i++) c.fillRect(gx0 + 4 + specks[i][0] * (gx1 - gx0 - 8), gy0 + 4 + specks[i][1] * (gy1 - gy0 - 8), 1.6, 1.6);
        // bubbles: number from the free air, size from the pressure
        const nb = Math.min(160, Math.round(s.F * 100 * 25)), rb = clamp(3.5 * Math.pow(P0 / p, 1 / 3), 0.6, 9);
        c.strokeStyle = C.text; c.lineWidth = 1;
        for (let i = 0; i < nb; i++) {
          const b = bub[i], r = rb * b.s;
          b.y -= (0.02 + 0.012 * r * r) * dt; if (b.y < 0) b.y += 1;
          c.fillStyle = C.bg2; c.beginPath(); c.arc(gx0 + 8 + b.fx * (gx1 - gx0 - 16), gy0 + 8 + b.y * (gy1 - gy0 - 16), r, 0, Math.PI * 2); c.fill(); c.stroke();
        }
        if (V.rise && s.F > 0.002) { const fh = Math.min(26, s.F * 100 * 6); c.fillStyle = C.surface; for (let i = 0; i < 26; i++) { c.beginPath(); c.arc(gx0 + 6 + i * 7.5, gy0 + 3 + (i % 3) * 2, 3 + fh / 8, 0, Math.PI * 2); c.fill(); c.stroke(); } }
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.strokeRect(gx0, gy0, gx1 - gx0, gy1 - gy0);
        // gauge, logarithmic from 0.2 to 200 bar absolute
        const gxx = 600, gyy = 90;
        c.save(); c.translate(gxx, gyy); c.scale(2.2, 2.2); S.gauge(c, 0, 0, { frac: Math.log(V.p / 0.2) / Math.log(1000) }); c.restore();
        S.line(c, [[gxx, gyy + 46], [gxx, 170], [gx1, 170]], { state: p > 2e5 ? 'pressure' : p < P0 * 0.95 ? 'suction' : 'idle' });
        kit.label(c, V.p.toPrecision(3) + ' bar abs', gxx + 30, gyy - 14, { size: 13, color: C.text, weight: 700, align: 'left' });
        // bars: dissolved and free air against what the oil can hold
        const bx = 90, bw = 60, by1 = 240, bs = 150 / Math.max(ALPHA * 2, s.D + s.F);
        const hD = s.D * bs, hF = s.F * bs;
        c.fillStyle = C.accent; c.fillRect(bx, by1 - hD, bw, hD);
        c.fillStyle = C.warn; c.fillRect(bx, by1 - hD - hF, bw, hF);
        c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(bx, by1 - 150, bw, 150);
        const off = Sat * bs > 158, ySat = by1 - Math.min(Sat * bs, 158);
        c.strokeStyle = C.bad; c.lineWidth = 2; c.setLineDash([5, 3]); c.beginPath(); c.moveTo(bx - 10, ySat); c.lineTo(bx + bw + 10, ySat); c.stroke(); c.setLineDash([]);
        if (off) kit.label(c, 'can dissolve ' + (Sat * 100).toFixed(0) + ' % ↑', bx + bw / 2, ySat - 14, { size: 11, color: C.bad, weight: 600 });
        else kit.label(c, 'can dissolve', bx + bw + 14, ySat, { size: 11, color: C.bad, align: 'left', weight: 600 });
        kit.label(c, 'dissolved', bx - 8, by1 - Math.max(8, hD / 2), { size: 11, color: C.accent, align: 'right', weight: 600 });
        if (hF > 1) kit.label(c, 'free', bx - 8, by1 - hD - hF / 2, { size: 11, color: C.warn, align: 'right', weight: 600 });
        kit.label(c, 'air in 1 L of oil', bx + bw / 2, 262, { size: 11, color: C.muted });
        kit.label(c, 'sight glass', (gx0 + gx1) / 2, 256, { size: 11, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
