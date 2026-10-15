/* HYPER-WATER · sims/trees-and-the-tallest.js — How a tree lifts water.
 *   tree-pressure-profile   the pressure up a tree against height, sap speed and conduit radius, and the meniscus at the top
 *   tree-embolism-lab       a cross-section of wood: conduits embolise as the tension rises (air seeding) or after a freeze
 *   tree-pump-vs-tree       a suction pump and a tree lifting water to the same height: the vacuum limit and the tension limit
 *   tree-height-limit       leaf water potential against height; where a leaf runs out of turgor (Koch et al. 2004)
 *   tree-stoma              a stoma opening with guard-cell turgor, and the water lost per carbon gained
 *   tree-root-pressure      an osmotic root against the salt of the soil and the transpiration of the leaves
 *   tree-transpiration-day  a tree's water use through a day: sunlight, air humidity, soil water
 * Numbers that a function can give come from kit.water (density, viscosity, surface tension, vapour pressure, dew point,
 * latent heat, osmotic pressure). Local models are schematic and labelled so in the blurbs.
 */
(function () {
  'use strict';
  const MPa = 1e6;
  const cl = (v, a, b) => Math.min(b, Math.max(a, v));
  const fx = (v, d) => (Number.isFinite(v) ? v.toFixed(d == null ? 1 : d) : '—').replace('-', '−');
  function rng(seed) {
    let s = seed >>> 0;
    return () => { s = (s + 0x6D2B79F5) >>> 0; let t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  function gauss(r) { return Math.sqrt(-2 * Math.log(r() + 1e-12)) * Math.cos(6.283185307 * r()); }
  const graphDiv = box => { const d = document.createElement('div'); d.style.padding = '6px 10px 10px'; box.stage.appendChild(d); return d; };
  /* a colour for a tension as a fraction of a limit: blue (relaxed) to red (at the limit and beyond) */
  const hot = (f, dark) => 'hsl(' + Math.round(215 - 215 * cl(f, 0, 1)) + ',' + (dark ? 70 : 72) + '%,' + (dark ? 55 : 50) + '%)';

  /* a simple tree: a tapering trunk coloured by colourAt(fraction of height) and a crown */
  function tree(c, x, gy, hpx, o) {
    o = o || {};
    if (!(hpx > 2)) return;
    const w0 = Math.max(3, hpx * 0.034), w1 = Math.max(1.5, w0 * 0.3);
    const n = Math.max(6, Math.min(80, Math.round(hpx / 5)));
    for (let i = 0; i < n; i++) {
      const f0 = i / n, f1 = (i + 1) / n;
      const wa = w0 + (w1 - w0) * f0, wb = w0 + (w1 - w0) * f1;
      c.fillStyle = o.colorAt ? o.colorAt((f0 + f1) / 2) : '#8a6a46';
      c.beginPath();
      c.moveTo(x - wa / 2, gy - f0 * hpx); c.lineTo(x + wa / 2, gy - f0 * hpx);
      c.lineTo(x + wb / 2, gy - f1 * hpx - 0.6); c.lineTo(x - wb / 2, gy - f1 * hpx - 0.6);
      c.closePath(); c.fill();
    }
    if (o.crown !== false) {
      c.fillStyle = o.crownColor || 'rgba(70,165,85,0.55)';
      const rx = Math.max(5, hpx * 0.13), ry = Math.max(7, hpx * 0.2);
      for (const [dx, f] of [[0, 0.8], [-0.5, 0.68], [0.5, 0.68], [0, 0.93]]) {
        c.beginPath(); c.ellipse(x + dx * rx, gy - hpx * f, rx, ry * (f > 0.9 ? 0.7 : 1), 0, 0, 6.2832); c.fill();
      }
    }
  }
  function ruler(c, C, x, gy, pxPerM, hmax, kit) {
    const step = Hyper.niceStep(hmax, 6) || 10;
    c.strokeStyle = C.faint; c.lineWidth = 1;
    c.beginPath(); c.moveTo(x, gy); c.lineTo(x, gy - hmax * pxPerM); c.stroke();
    for (let m = 0; m <= hmax + 1e-6; m += step) {
      const y = gy - m * pxPerM;
      c.beginPath(); c.moveTo(x - 4, y); c.lineTo(x, y); c.stroke();
      kit.label(c, m + ' m', x - 7, y, { color: C.muted, size: 10.5, align: 'right', baseline: 'middle' });
    }
  }

  /* ================================================================ the pressure up a tree */
  Hyper.sim('tree-pressure-profile', {
    title: 'The pressure up a tree',
    blurb: `The pressure of the sap at every height of a tree, from the wet soil at the foot to a leaf in the crown. The trunk is coloured by the tension: blue where the sap is nearly relaxed, red where it is at the wood's P₅₀, the tension at which half its conduits would have failed. The graph below plots the same thing: pressure against height, with the line for sap at rest and the line for sap in motion. In the top corner, the meniscus in a pore of a leaf cell wall: the smaller its radius, the harder it pulls. Friction is Hagen–Poiseuille flow with a factor of 1.5 for the pits and end walls (schematic).

**Try this**
- Set the sap speed to 0 (night): the line is straight, losing 0.0098 MPa for every metre. Raise the speed: friction steepens it, and more so in narrow conduits.
- Make the conduits wider (radius 60 µm): friction almost vanishes, but real wide-vessel trees pay for it in embolism ([[cavitation-and-embolism]]).
- Make the tree 120 m tall: the top approaches the wood's P₅₀ — see [[the-height-limit-of-trees]].
- Lower the humidity: the pull of the air goes from −1.4 MPa near saturation to −221 MPa in dry air, far more than the tree uses.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320, maxH: 430 });
      const gd = graphDiv(box);
      const rho = W.density(20), g = W.g, eta = W.viscosity(20), sig = W.surfaceTension(20);
      let V;
      const ctl = kit.controls(box.side, [
        { id: 'h', label: 'Height of the tree', min: 5, max: 130, step: 1, value: params.h || 60, unit: 'm' },
        { id: 'u', label: 'Sap speed in the conduits', min: 0, max: 10, step: 0.05, value: params.u != null ? params.u : 0.5, unit: 'm/h' },
        { id: 'r', label: 'Conduit radius', min: 5, max: 150, value: params.r || 20, unit: 'µm', log: true, sig: 3 },
        { id: 'Ps', label: 'Soil water potential', min: -1.5, max: 0, step: 0.01, value: -0.1, unit: 'MPa' },
        { id: 'P50', label: 'P₅₀ of the wood (tension)', min: 1, max: 12, step: 0.1, value: 4.5, unit: 'MPa' },
        { id: 'RH', label: 'Humidity of the air', min: 10, max: 100, step: 1, value: params.RH || 50, unit: '%' }
      ], () => upd());
      V = ctl.values;
      const ro = kit.readout(box.side, [['air', 'Water potential of the air'], ['G', 'Friction gradient'], ['grav', 'Tension from gravity at the top'], ['fric', 'Tension from friction at the top'], ['top', 'Pressure at the top (gauge)'], ['rm', 'Meniscus radius needed at the top'], ['plc', 'Conductivity lost at the top (estimate)']]);
      const plot = kit.plot(gd, { x: { label: 'xylem pressure (MPa, gauge)' }, y: { label: 'height (m)', min: 0 }, legend: true }, 230);
      let M = null;
      function model() {
        const u = V.u / 3600, r = V.r * 1e-6;
        const Gf = 1.5 * 8 * eta * u / (r * r);                 // Pa/m
        const grav = rho * g;                                  // Pa/m
        const top = V.Ps - (grav + Gf) * V.h / MPa;            // MPa at the top
        const air = W.R * 298.15 / 18.07e-6 * Math.log(Math.max(1e-3, V.RH / 100)) / MPa;   // MPa
        const T = Math.max(0, -top);
        const plc = 1 - Math.pow(2, -Math.pow(T / V.P50, 4));
        return { Gf, grav, top, air, T, plc, topGrav: grav * V.h / MPa, topFric: Gf * V.h / MPa };
      }
      function upd() {
        M = model();
        const pts0 = [], pts1 = [], n = 40;
        for (let i = 0; i <= n; i++) {
          const z = V.h * i / n;
          pts0.push([V.Ps - M.grav * z / MPa, z]);
          pts1.push([V.Ps - (M.grav + M.Gf) * z / MPa, z]);
        }
        const xmin = Math.max(-16, Math.min(-V.P50 * 1.3, M.top * 1.12 - 0.1)), C = kit.colors();
        plot.set({
          series: [{ pts: pts0, label: 'sap at rest (gravity only)', color: C.accent, dash: true }, { pts: pts1, label: 'sap flowing (gravity + friction)', color: C.warn }],
          x: { label: 'xylem pressure (MPa, relative to the atmosphere)', min: xmin, max: Math.min(0.3, Math.max(0.1, V.Ps + 0.1)) },
          y: { label: 'height (m)', min: 0, max: Math.max(10, V.h) },
          vlines: [{ x: -V.P50, label: 'P₅₀', color: C.bad }],
          marks: [{ x: M.top, y: V.h, label: 'top ' + fx(M.top, 2) + ' MPa', color: C.warn }]
        });
        ro.set('air', fx(M.air, Math.abs(M.air) < 10 ? 1 : 0) + ' MPa at 25 °C');
        ro.set('G', fx(M.Gf / 1000, 2) + ' kPa/m (gravity 9.79)');
        ro.set('grav', fx(M.topGrav, 2) + ' MPa');
        ro.set('fric', fx(M.topFric, 2) + ' MPa');
        ro.set('top', fx(M.top, 2) + ' MPa');
        ro.set('rm', M.top < -1e-3 ? fx(2 * sig / (-M.top * MPa) * 1e9, 0) + ' nm (2σ/P)' : 'flat — no pull');
        ro.set('plc', fx(M.plc * 100, 0) + ' %');
      }
      upd();
      const dots = [];
      for (let i = 0; i < 40; i++) dots.push(Math.random());
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (!M) upd();
        const gy = Hh - 24, hmaxM = 135, pxm = (gy - 20) / hmaxM, hp = V.h * pxm;
        ruler(c, C, 46, gy, pxm, hmaxM, kit);
        const tx = 108;
        c.fillStyle = C.faint; c.fillRect(tx - 44, gy, 88, 4);
        // the trunk, coloured by the tension at each height
        tree(c, tx, gy, hp, { colorAt: f => hot(Math.max(0, -(V.Ps - (M.grav + M.Gf) * f * V.h / MPa)) / V.P50, C.dark) });
        // sap moving: dots rising with a speed proportional to the sap speed
        const sp = V.u / 3600 * 60;
        c.fillStyle = C.dark ? 'rgba(255,255,255,0.8)' : 'rgba(20,40,70,0.7)';
        for (let i = 0; i < dots.length; i++) {
          dots[i] = (dots[i] + dt * sp / Math.max(1, V.h) * 6) % 1;
          const yy = gy - dots[i] * hp, off = ((i * 7) % 5 - 2) * 0.8;
          c.beginPath(); c.arc(tx + off, yy, 1.4, 0, 6.2832); c.fill();
        }
        kit.label(c, fx(V.h, 0) + ' m', tx, Math.max(12, gy - hp - 12 - Math.max(7, hp * 0.2)),{ color: C.text, size: 11.5, align: 'center', weight: 600 });
        kit.label(c, 'soil ' + fx(V.Ps, 2) + ' MPa', tx, gy + 16, { color: C.muted, size: 10.5, align: 'center' });
        // the leaf pore at the top (inset)
        const ix = Math.max(170, Wd * 0.4), iw = Wd - ix - 12, iy = 12, ih = Math.min(Hh - 30, 290);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(ix, iy, iw, ih);
        const pcx = ix + iw / 2, pa = Math.min(26, iw * 0.12), pbase = iy + ih - 52;   // pore half-width (px) stands for 30 nm
        kit.label(c, 'A 30 nm pore in a leaf cell wall (top)', pcx, iy + 14, { color: C.muted, size: 11, align: 'center' });
        c.fillStyle = C.faint;
        c.fillRect(pcx - pa - 22, iy + 70, 22, pbase - iy - 70); c.fillRect(pcx + pa, iy + 70, 22, pbase - iy - 70);
        const Rm = M.top < -1e-3 ? 2 * sig / (-M.top * MPa) * 1e9 : Infinity;     // nm
        const Rpx = Math.max(pa, Math.min(4000, Rm / 30 * pa));
        const depth = Number.isFinite(Rm) ? Rpx - Math.sqrt(Math.max(0, Rpx * Rpx - pa * pa)) : 0;
        const my = iy + 110;                                   // the meniscus edge at the pore mouth
        c.fillStyle = 'rgba(70,150,235,0.55)';
        c.beginPath(); c.moveTo(pcx - pa, pbase); c.lineTo(pcx - pa, my);
        if (depth > 0.5) c.quadraticCurveTo(pcx, my + 2 * depth, pcx + pa, my); else c.lineTo(pcx + pa, my);
        c.lineTo(pcx + pa, pbase); c.closePath(); c.fill();
        c.strokeStyle = C.accent; c.lineWidth = 2;
        c.beginPath(); c.moveTo(pcx - pa, my);
        if (depth > 0.5) c.quadraticCurveTo(pcx, my + 2 * depth, pcx + pa, my); else c.lineTo(pcx + pa, my);
        c.stroke();
        const ev = V.RH < 100 ? 1 : 0;
        for (let i = 0; i < 4; i++) {
          const ph = ((performance.now() / 1000) * 0.6 + i * 0.25) % 1;
          kit.arrow(c, pcx - 18 + i * 12, my - 8 - ph * 26, pcx - 18 + i * 12, my - 24 - ph * 26, ev ? C.muted : 'transparent', 1.2, 5);
        }
        kit.label(c, 'air pulls: ' + fx(M.air, Math.abs(M.air) < 10 ? 1 : 0) + ' MPa', pcx, iy + 36, { color: C.muted, size: 11, align: 'center' });
        kit.label(c, 'sap at the top: ' + fx(M.top, 2) + ' MPa', pcx, iy + ih - 34, { color: C.accent, size: 11, align: 'center', weight: 600 });
        kit.label(c, M.top < -1e-3 ? 'meniscus radius ' + fx(Rm, 0) + ' nm' + (Rm < 30 ? ' (retreats)' : '') : 'no tension: flat surface', pcx, iy + ih - 16, { color: C.text, size: 11, align: 'center' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the embolism lab */
  Hyper.sim('tree-embolism-lab', {
    title: 'When the thread snaps',
    blurb: `A cross-section of wood: every circle is a conduit, drawn with its relative width. Blue conduits carry water; a pale one has embolised — air was pulled through the largest pore of a pit membrane when the tension exceeded 2σ/r, and the conduit emptied with a click. Each conduit has its own largest pore, spread about the value you set (a schematic, log-normal spread). The graph is the vulnerability curve of the same wood: the percentage loss of conductivity, weighted by r⁴, against the tension.

**Try this**
- Raise the tension slowly: the first conduits fail at about half the median air-seeding tension and the last at about double. The curve is S-shaped, and the tension at 50 % is the wood's P₅₀.
- Press *Dry out slowly* and watch the clicks accumulate. Press *Refill* (a new ring, or refilling after rain) and the wood recovers.
- Choose *Oak or vine* and press *Freeze and thaw*: the wide vessels (diameter above about 35 µm) empty, while in *Conifer* the narrow tracheids are untouched.
- Make the pit pores smaller (20 nm): the wood stands 7 MPa before it fails, but such small pores slow the flow.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280, maxH: 380 });
      const gd = graphDiv(box);
      const sig = W.surfaceTension(20);
      const TYPES = [
        { name: 'Conifer: many narrow tracheids (radius 10 µm)', N: 260, rMed: 10, sd: 0.25 },
        { name: 'Maple: medium vessels (radius 25 µm)', N: 120, rMed: 25, sd: 0.35 },
        { name: 'Oak or vine: few wide vessels (radius 60 µm)', N: 50, rMed: 60, sd: 0.3 }
      ];
      let vs = [], cur = -1, clicks = 0, flashT = 0, drying = false, curve = [];
      let V;
      function build(k) {
        const T = TYPES[k], r = rng(7 + k * 13), N = T.N;
        const s = Math.sqrt(2 * Math.PI / (Math.sqrt(3) * N));
        vs = [];
        const rows = Math.ceil(2 / (s * 0.866)) + 2;
        for (let j = -rows; j <= rows; j++) for (let i = -rows; i <= rows; i++) {
          const x = (i + (j & 1 ? 0.5 : 0)) * s, y = j * s * 0.866;
          if (Math.hypot(x, y) > 1 - s * 0.3) continue;
          const rr = T.rMed * Math.exp(T.sd * gauss(r));
          vs.push({ x: x + (r() - 0.5) * s * 0.12, y: y + (r() - 0.5) * s * 0.12, r: rr, z: gauss(r), frac: cl(rr / (T.rMed * 1.7), 0.3, 1), emb: false, flash: 0, s });
        }
        cur = k; clicks = 0;
      }
      const thr = v => 2 * sig / (V.pore * 1e-9 * Math.exp(0.4 * v.z)) / MPa;   // MPa
      function weights() { let t = 0; for (const v of vs) t += v.r ** 4; return t; }
      function makeCurve() {
        const tot = weights(), items = vs.map(v => [thr(v), v.r ** 4]).sort((a, b) => a[0] - b[0]);
        curve = []; let acc = 0, idx = 0;
        for (let T = 0; T <= 10.001; T += 0.1) {
          while (idx < items.length && items[idx][0] <= T) { acc += items[idx][1]; idx++; }
          curve.push([T, 100 * acc / tot]);
        }
      }
      function embolise(v) { v.emb = true; v.flash = 1; clicks++; flashT = 0.5; }
      function apply() { for (const v of vs) if (!v.emb && V.T >= thr(v)) embolise(v); }
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Kind of wood', options: TYPES.map((t, i) => [t.name, i]), value: params.type != null ? params.type : 1 },
        { id: 'T', label: 'Xylem tension', min: 0, max: 10, step: 0.05, value: params.T != null ? params.T : 0.5, unit: 'MPa' },
        { id: 'pore', label: 'Largest pit-membrane pore, typical', min: 15, max: 150, value: params.pore || 45, unit: 'nm', log: true, sig: 3 },
        { id: 'refill', type: 'check', label: 'Refill when the tension is below 0.3 MPa (night, spring)', value: false },
        { type: 'buttons', items: [{ id: 'dry', label: 'Dry out slowly', primary: true }, { id: 'freeze', label: 'Freeze and thaw' }, { id: 'reset', label: 'Refill everything' }] }
      ], (id) => {
        if (id === 'type') { build(V.type); makeCurve(); apply(); }
        else if (id === 'pore') { makeCurve(); apply(); }
        else if (id === 'T') apply();
        else if (id === 'dry') drying = !drying;
        else if (id === 'freeze') {
          const r = rng(Math.floor(performance.now()));
          for (const v of vs) if (!v.emb) { const d = 2 * v.r, p = cl((d - 25) / 30, 0, 1) * 0.9; if (r() < p) embolise(v); }
        } else if (id === 'reset') { for (const v of vs) { v.emb = false; v.flash = 0; } clicks = 0; drying = false; ctl.set('T', 0.5); apply(); }
      });
      V = ctl.values;
      build(V.type); makeCurve(); apply();
      const ro = kit.readout(box.side, [['T', 'Tension in the sap'], ['thr', 'Air-seeding tension, median pore'], ['n', 'Conduits emptied'], ['plc', 'Flow lost (weighted by r⁴)'], ['clicks', 'Clicks heard'], ['fz', 'Conduits wider than 35 µm']]);
      const plot = kit.plot(gd, { x: { label: 'xylem tension (MPa)', min: 0, max: 10 }, y: { label: 'loss of conductivity (%)', min: 0, max: 100 }, legend: true }, 200);
      let acc = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (drying) { V.T = Math.min(10, V.T + 0.35 * dt); ctl.set('T', V.T); apply(); if (V.T >= 10) drying = false; }
        if (V.refill && V.T < 0.3) { const r = Math.random; for (const v of vs) if (v.emb && r() < dt * 0.6) v.emb = false; }
        flashT = Math.max(0, flashT - dt);
        const R = Math.min(Hh * 0.46, Wd * 0.32), cx = R + 24, cy = Hh / 2;
        c.fillStyle = C.surface; c.strokeStyle = C.axis; c.lineWidth = 2;
        c.beginPath(); c.arc(cx, cy, R + 8, 0, 6.2832); c.fill(); c.stroke();
        let nE = 0, tot = 0, ew = 0, wide = 0;
        for (const v of vs) {
          const rr = v.s * R * 0.5 * 0.92 * v.frac * 1.08;
          tot += v.r ** 4; if (v.emb) { nE++; ew += v.r ** 4; } if (2 * v.r > 35) wide++;
          v.flash = Math.max(0, v.flash - dt * 2.5);
          const X = cx + v.x * R, Y = cy + v.y * R;
          c.beginPath(); c.arc(X, Y, rr, 0, 6.2832);
          if (v.emb) { c.fillStyle = C.dark ? '#dbe7f2' : '#f4f7fa'; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1; c.stroke(); c.fillStyle = 'rgba(120,130,150,0.35)'; c.beginPath(); c.arc(X - rr * 0.25, Y - rr * 0.25, rr * 0.28, 0, 6.2832); c.fill(); }
          else { c.fillStyle = 'rgba(70,150,235,0.72)'; c.fill(); c.strokeStyle = 'rgba(20,80,170,0.7)'; c.lineWidth = 1; c.stroke(); }
          if (v.flash > 0) { c.strokeStyle = 'rgba(255,200,40,' + v.flash.toFixed(2) + ')'; c.lineWidth = 2; c.beginPath(); c.arc(X, Y, rr + (1 - v.flash) * 10, 0, 6.2832); c.stroke(); }
        }
        // the tension scale, with the median air-seeding tension marked
        const bx = cx + R + 50, bw = Math.max(40, Wd - bx - 24), by = Hh - 46;
        c.fillStyle = C.bg2; c.strokeStyle = C.axis; c.lineWidth = 1; c.fillRect(bx, by, bw, 12); c.strokeRect(bx, by, bw, 12);
        c.fillStyle = hot(V.T / 7, C.dark); c.fillRect(bx, by, bw * V.T / 10, 12);
        const tm = 2 * sig / (V.pore * 1e-9) / MPa;
        c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(bx + bw * Math.min(10, tm) / 10, by - 6); c.lineTo(bx + bw * Math.min(10, tm) / 10, by + 18); c.stroke();
        kit.label(c, 'tension 0 → 10 MPa', bx, by + 30, { color: C.muted, size: 10.5 });
        kit.label(c, 'median air-seeding ' + fx(tm, 1) + ' MPa', bx + bw, by - 12, { color: C.bad, size: 10.5, align: 'right' });
        kit.label(c, flashT > 0 ? 'click!' : '', bx + bw / 2, 34, { color: C.warn, size: 18, align: 'center', weight: 700 });
        kit.label(c, TYPES[V.type].name.split(':')[0] + ': ' + vs.length + ' conduits', bx, 20, { color: C.muted, size: 11 });
        ro.set('T', fx(V.T, 2) + ' MPa'); ro.set('thr', fx(tm, 1) + ' MPa');
        ro.set('n', nE + ' of ' + vs.length + ' (' + Math.round(100 * nE / Math.max(1, vs.length)) + ' %)');
        const plc = 100 * ew / Math.max(1e-9, tot);
        ro.set('plc', fx(plc, 0) + ' %'); ro.set('clicks', String(clicks)); ro.set('fz', Math.round(100 * wide / Math.max(1, vs.length)) + ' % (vulnerable to frost)');
        acc += dt;
        if (acc > 0.1) { acc = 0; plot.set({ series: [{ pts: curve, label: 'vulnerability curve of this wood', color: C.accent }], marks: [{ x: V.T, y: plc, label: fx(plc, 0) + ' % lost', color: C.warn }], vlines: [{ x: tm, label: 'median pore', color: C.bad }] }); }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a pump and a tree */
  Hyper.sim('tree-pump-vs-tree', {
    title: 'A pump and a tree',
    blurb: `Two ways of lifting water to the same height. Left: a suction pump at the top of a pipe. The atmosphere pushes water up the pipe, but only as far as its weight allows — and when the pressure at the top falls to the vapour pressure of the water, the water boils and the column stops. Right: a tree, which has no vacuum at the top but a continuous thread of sap under tension: its absolute pressure goes below zero, and the column holds until the tension reaches what the wood can bear. The dashed line marks the height of the pump's limit.

**Try this**
- Raise the height from 5 m to 40 m: the pump's column stops at 10.1 m, and the tree carries on.
- Move to the summit of Everest, or heat the water to 80 °C: the pump's limit drops to 3 m and 6 m. The tree is unaffected by the weather.
- Weaken the tree's wood (lower the tension it withstands): at some height the thread breaks and the trunk above empties.
- Add friction: it makes no difference to the pump (no flow in the idealisation), and costs the tree height.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 360, maxH: 500 });
      const PL = [['Sea level (101.3 kPa)', 101325], ['Denver, 1,600 m (83 kPa)', 83400], ['La Paz, 3,640 m (65 kPa)', 65000], ['Everest summit, 8,849 m (34 kPa)', 33700]];
      let V;
      const ctl = kit.controls(box.side, [
        { id: 'h', label: 'Height to lift the water', min: 2, max: 150, value: params.h || 40, unit: 'm', log: true, sig: 3 },
        { id: 'p', type: 'select', label: 'Where', options: PL, value: params.p || 101325 },
        { id: 'Tw', label: 'Temperature of the water', min: 0, max: 95, step: 1, value: params.Tw != null ? params.Tw : 15, unit: '°C' },
        { id: 'Tc', label: 'Tension the tree\'s wood can bear', min: 0.5, max: 8, step: 0.1, value: 3, unit: 'MPa' },
        { id: 'G', label: 'Friction in the tree', min: 0, max: 15, step: 0.5, value: 5, unit: 'kPa/m' }
      ], () => {});
      V = ctl.values;
      const ro = kit.readout(box.side, [['hp', 'Highest a pump can lift here'], ['pump', 'The pump at this height'], ['ptop', 'Pressure at the top of the pump pipe'], ['ttop', 'Pressure at the top of the tree (absolute)'], ['tlim', 'Highest the tree\'s wood can hold'], ['tree', 'The tree at this height']]);
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const rho = W.density(V.Tw), g = W.g, pv = W.vapourPressure(V.Tw);
        const hp = Math.max(0, (V.p - pv) / (rho * g));
        const grad = W.density(20) * g + V.G * 1000;          // Pa/m, tree
        const hTree = (V.p + V.Tc * MPa) / grad;               // height where the tension reaches the wood's limit
        const pumpOK = V.h <= hp, treeOK = V.h <= hTree;
        const ptopP = pumpOK ? V.p - rho * g * V.h : pv;
        const ptopT = V.p - grad * V.h;
        const hmax = Math.max(V.h * 1.12, 14), gy = Hh - 34, pxm = (gy - 36) / hmax;
        ruler(c, C, 44, gy, pxm, hmax, kit);
        // the limit lines
        const ly = gy - hp * pxm;
        c.setLineDash([5, 4]); c.strokeStyle = C.bad; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(48, ly); c.lineTo(Wd - 10, ly); c.stroke(); c.setLineDash([]);
        kit.label(c, 'pump limit ' + fx(hp, 1) + ' m', Wd - 12, ly - 8, { color: C.bad, size: 11, align: 'right' });
        // ground
        c.fillStyle = C.faint; c.fillRect(48, gy, Wd - 58, 3);
        /* ---- the pump */
        const px = Math.round(Wd * 0.25), pipeW = 16, topY = gy - V.h * pxm, colTop = gy - Math.min(V.h, hp) * pxm;
        c.fillStyle = 'rgba(70,150,235,0.45)'; c.fillRect(px - 50, gy, 100, 24);   // the well
        c.strokeStyle = C.axis; c.lineWidth = 2; c.strokeRect(px - pipeW / 2, topY, pipeW, gy + 24 - topY);
        c.fillStyle = 'rgba(70,150,235,0.7)'; c.fillRect(px - pipeW / 2 + 1, colTop, pipeW - 2, gy + 24 - colTop);
        if (!pumpOK) {   // vapour (boiling) above the stopped column
          c.fillStyle = C.dark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.06)'; c.fillRect(px - pipeW / 2 + 1, topY + 1, pipeW - 2, colTop - topY - 1);
          c.fillStyle = C.muted;
          for (let i = 0; i < 6; i++) { const yy = topY + 6 + ((t * 20 + i * 31) % Math.max(10, colTop - topY - 8)); c.beginPath(); c.arc(px + ((i * 5) % 7 - 3), yy, 1.6, 0, 6.2832); c.fill(); }
        }
        c.fillStyle = C.text; c.fillRect(px - 20, topY - 16, 40, 16);
        kit.label(c, 'pump', px, topY - 24, { color: C.text, size: 11, align: 'center', weight: 600 });
        for (let i = 0; i < 3; i++) kit.arrow(c, px - 40 + i * 40, gy - 14, px - 40 + i * 40, gy - 2, C.muted, 1.5, 6);
        kit.label(c, 'air pushes down on the well', px, gy + 40, { color: C.muted, size: 10.5, align: 'center' });
        kit.label(c, pumpOK ? 'lifts ' + fx(V.h, 1) + ' m' : 'water stops at ' + fx(hp, 1) + ' m', px, Math.max(12, topY - 40), { color: pumpOK ? C.ok : C.bad, size: 12, align: 'center', weight: 650 });
        /* ---- the tree */
        const tx = Math.round(Wd * 0.62), hpx = V.h * pxm, failH = Math.max(0, Math.min(V.h, hTree));
        tree(c, tx, gy, hpx, { colorAt: f => {
          const z = f * V.h;
          if (z > hTree) return C.dark ? '#555' : '#bbb';
          const ten = Math.max(0, grad * z - V.p) / MPa;       // tension below zero absolute
          return f < 0 ? '#888' : hot(ten / V.Tc, C.dark);
        } });
        if (!treeOK) { const fy = gy - failH * pxm; c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(tx - 14, fy - 5); c.lineTo(tx + 14, fy + 5); c.moveTo(tx - 14, fy + 5); c.lineTo(tx + 14, fy - 5); c.stroke(); }
        kit.label(c, treeOK ? 'lifts ' + fx(V.h, 1) + ' m' : 'thread breaks at ' + fx(hTree, 0) + ' m', tx, Math.max(12, gy - hpx - Math.max(7, hpx * 0.2) - 18), { color: treeOK ? C.ok : C.bad, size: 12, align: 'center', weight: 650 });
        kit.label(c, 'tension in the wood: blue = low, red = at its limit', tx, gy + 20, { color: C.muted, size: 10.5, align: 'center' });
        ro.set('hp', fx(hp, 1) + ' m');
        ro.set('pump', pumpOK ? 'lifts it (column to the top)' : 'stops at ' + fx(hp, 1) + ' m; vapour above');
        ro.set('ptop', pumpOK ? fx(ptopP / 1000, 1) + ' kPa' : fx(pv / 1000, 1) + ' kPa (vapour pressure: the water boils)');
        ro.set('ttop', fx(ptopT / MPa, 2) + ' MPa' + (ptopT < 0 ? ' (below a vacuum: tension)' : ''));
        ro.set('tlim', fx(hTree, 0) + ' m (wood only; leaves limit it earlier)');
        ro.set('tree', treeOK ? 'carries the water to the top' : 'cavitates above ' + fx(hTree, 0) + ' m');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the height limit */
  Hyper.sim('tree-height-limit', {
    title: 'Where the top leaf runs out of water',
    blurb: `The water potential of a leaf against its height above the ground. Before dawn, with no flow, it falls by 0.0098 MPa per metre (gravity alone). At midday friction in the conduits steepens it. The leaf can work only above a floor — below it the cells lose turgor, the stomata shut and photosynthesis stops — and where the midday line meets the floor is the height limit of a tree: the account of Koch, Sillett, Jennings and Davis (*Nature*, 2004), which predicted 122–130 m for coast redwoods. The tree icons are drawn to scale; the leaf on the right shows the relative growth capacity at the height you choose (a schematic: the margin above the floor, relative to the margin at the ground).

**Try this**
- With the defaults the limit is 126 m, inside Koch's range; Hyperion (115.9 m) is below it.
- Double the friction: the limit falls to about 96 m. Halve it: 145 m, not 250 m, because gravity cannot be reduced.
- Make the soil drier (−0.5 MPa): the limit falls by about 28 m.
- Slide the height of the leaf up to 120 m: the leaf becomes smaller and its growth capacity falls to zero where the lines cross.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320, maxH: 420 });
      const gd = graphDiv(box);
      let V;
      const ctl = kit.controls(box.side, [
        { id: 'Ps', label: 'Soil water potential', min: -1, max: 0, step: 0.01, value: -0.1, unit: 'MPa' },
        { id: 'G', label: 'Friction in the conduits', min: 0, max: 15, step: 0.5, value: params.G != null ? params.G : 4.5, unit: 'kPa/m' },
        { id: 'Pmin', label: 'Lowest leaf water potential that still works', min: -4, max: -0.5, step: 0.05, value: params.Pmin || -1.9, unit: 'MPa' },
        { id: 'dl', label: 'Extra drop across the leaf at midday', min: 0, max: 1, step: 0.05, value: 0, unit: 'MPa' },
        { id: 'z', label: 'Height of the leaf to examine', min: 5, max: 140, step: 1, value: params.z || 110, unit: 'm' }
      ], () => upd());
      V = ctl.values;
      const ro = kit.readout(box.side, [['lim', 'Height limit of the tree'], ['mid', 'Leaf water potential at midday'], ['pre', 'Leaf water potential before dawn'], ['cap', 'Growth capacity of that leaf'], ['grav', 'Share of the gradient due to gravity']]);
      const plot = kit.plot(gd, { x: { label: 'height above the ground (m)', min: 0, max: 150 }, y: { label: 'leaf water potential (MPa)' }, legend: true }, 230);
      const rg = W.hydrostaticHead(1) / MPa;                         // MPa per metre
      const mid = z => V.Ps - (rg + V.G / 1000) * z - V.dl, pre = z => V.Ps - rg * z;
      const hmax = () => { const d = V.Ps - V.dl - V.Pmin; return d > 0 ? d / (rg + V.G / 1000) : 0; };
      const cap = z => { const d0 = V.Ps - V.dl - V.Pmin; return d0 > 0 ? cl((mid(z) - V.Pmin) / d0, 0, 1) : 0; };
      function upd() {
        const C = kit.colors(), a = [], b = [];
        for (let z = 0; z <= 150; z += 5) { a.push([z, pre(z)]); b.push([z, mid(z)]); }
        plot.set({
          series: [{ pts: a, label: 'before dawn (gravity only)', color: C.accent, dash: true }, { pts: b, label: 'midday (gravity + friction)', color: C.warn }],
          y: { label: 'leaf water potential (MPa)', min: Math.min(V.Pmin - 0.4, mid(150) - 0.1), max: 0.2 },
          hlines: [{ y: V.Pmin, label: 'floor: the leaf stops working', color: C.bad }],
          vlines: [{ x: hmax(), label: 'limit ' + fx(hmax(), 0) + ' m', color: C.ok }, { x: 115.9, label: 'Hyperion', color: C.faint }],
          marks: [{ x: V.z, y: mid(V.z), label: fx(mid(V.z), 2) + ' MPa', color: C.warn }]
        });
        ro.set('lim', fx(hmax(), 0) + ' m (Koch et al.: 122–130 m)');
        ro.set('mid', fx(mid(V.z), 2) + ' MPa at ' + fx(V.z, 0) + ' m');
        ro.set('pre', fx(pre(V.z), 2) + ' MPa');
        ro.set('cap', fx(cap(V.z) * 100, 0) + ' % of a ground-level leaf');
        ro.set('grav', fx(rg / (rg + V.G / 1000) * 100, 0) + ' %');
      }
      upd();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const gy = Hh - 28, pxm = (gy - 24) / 150;
        ruler(c, C, 44, gy, pxm, 150, kit);
        c.fillStyle = C.faint; c.fillRect(48, gy, Wd * 0.62, 3);
        const lim = hmax(), ly = gy - lim * pxm;
        const items = [['Centurion, mountain ash', 100.5, 0.12], ['Hyperion, redwood', 115.9, 0.27], ['your leaf at ' + fx(V.z, 0) + ' m', V.z, 0.44]];
        for (const [name, hh, fxp] of items) {
          const x = Wd * fxp + 30, cp = cap(hh);
          tree(c, x, gy, hh * pxm, { crownColor: 'hsla(' + Math.round(cp * 110) + ',62%,' + (C.dark ? 50 : 42) + '%,0.6)' });
          kit.label(c, fx(hh, 1) + ' m', x, gy + 14, { color: C.text, size: 10.5, align: 'center', weight: 600 });
          kit.label(c, name, x, gy - hh * pxm - Math.max(8, hh * pxm * 0.2) - 10, { color: C.muted, size: 10, align: 'center' });
        }
        c.setLineDash([5, 4]); c.strokeStyle = C.ok; c.lineWidth = 1.5; c.beginPath(); c.moveTo(48, ly); c.lineTo(Wd * 0.64, ly); c.stroke(); c.setLineDash([]);
        kit.label(c, 'limit ' + fx(lim, 0) + ' m', Wd * 0.64 - 4, ly - 8, { color: C.ok, size: 11, align: 'right', weight: 650 });
        // the leaf at the chosen height
        const lx = Wd * 0.82, ly0 = Hh * 0.42, f = cap(V.z);
        kit.label(c, 'a leaf at ' + fx(V.z, 0) + ' m', lx, 28, { color: C.muted, size: 11.5, align: 'center' });
        c.fillStyle = 'hsla(' + Math.round(f * 110) + ',62%,' + (C.dark ? 50 : 42) + '%,0.75)';
        c.strokeStyle = C.text; c.lineWidth = 1.2;
        const half = 14 + 26 * f, len = 60 + 34 * f;
        c.beginPath(); c.moveTo(lx, ly0 + len); c.quadraticCurveTo(lx - half * 1.6, ly0 + len * 0.3, lx, ly0 - len * 0.4); c.quadraticCurveTo(lx + half * 1.6, ly0 + len * 0.3, lx, ly0 + len); c.fill(); c.stroke();
        c.beginPath(); c.moveTo(lx, ly0 + len); c.lineTo(lx, ly0 - len * 0.35); c.stroke();
        kit.label(c, f > 0.02 ? 'size and growth capacity ' + Math.round(f * 100) + ' %' : 'no turgor: cannot grow', lx, ly0 + len + 22, { color: f > 0.02 ? C.text : C.bad, size: 11.5, align: 'center', weight: 600 });
        kit.label(c, 'water potential ' + fx(mid(V.z), 2) + ' MPa', lx, ly0 + len + 40, { color: C.muted, size: 11, align: 'center' });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a stoma opening */
  function photo(g, vpd, type) {
    const ca = 400, gc = g / 1.6;
    const Am = type === 4 ? 45 : 35, G0 = type === 4 ? 5 : 40, K = type === 4 ? 20 : 160;
    const A = ci => Am * Math.max(0, ci - G0) / (ci - G0 + K);
    let lo = G0, hi = ca;
    for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (gc * (ca - m) - A(m) > 0) lo = m; else hi = m; }
    const ci = (lo + hi) / 2, a = A(ci), E = g * vpd / 101.325 * 1000;
    return { A: a, ci, E, ratio: a > 0.05 ? E * 1000 / a : NaN };
  }
  Hyper.sim('tree-stoma', {
    title: 'A stoma opening',
    blurb: `A stoma seen from above: two guard cells around a pore. In blue light the guard cells take up potassium (the yellow dots) and its anions, their sap becomes more concentrated, water enters by osmosis, and the turgor bows the cells apart. The time scale is speeded up (a real stoma takes a quarter of an hour). The aperture sets the conductance, and the conductance sets both the carbon dioxide gained (grey) and the water lost (blue). The graph shows why the bargain is poor when the pore is wide: carbon gain levels off (the leaf runs out of CO₂ demand) but water loss keeps rising in proportion. A local model, schematic in its leaf biochemistry.

**Try this**
- Switch off the light: the potassium leaves, the cells go flaccid and the pore shuts.
- Raise the drought hormone (ABA): the guard cells lose solute even in the light.
- Lower the leaf water potential to −2 MPa: the same solute gives much less turgor, and the pore narrows.
- Raise the vapour-pressure deficit to 4 kPa: the water lost per CO₂ doubles. Switch to C4: the same pore gains more carbon and the price falls to about a third.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320, maxH: 420 });
      const gd = graphDiv(box);
      let V, cg = 120, parts = [], spawnW = 0, spawnC = 0, nowG = 0.01;
      const ctl = kit.controls(box.side, [
        { id: 'light', type: 'check', label: 'Blue light on the leaf', value: params.light !== false },
        { id: 'ABA', label: 'Drought hormone (abscisic acid)', min: 0, max: 100, step: 1, value: params.ABA || 0, unit: '%' },
        { id: 'psi', label: 'Water potential of the leaf', min: -2.5, max: -0.2, step: 0.05, value: -0.6, unit: 'MPa' },
        { id: 'VPD', label: 'Vapour-pressure deficit of the air', min: 0.2, max: 5, step: 0.1, value: params.VPD || 2, unit: 'kPa' },
        { id: 'type', type: 'select', label: 'Photosynthesis', options: [['C3 (trees, wheat, rice)', 3], ['C4 (maize, sugar cane)', 4]], value: params.type || 3 }
      ], () => curve());
      V = ctl.values;
      const ro = kit.readout(box.side, [['c', 'Solute in the guard cells'], ['Pi', 'Osmotic pressure of the guard cell'], ['Pg', 'Turgor of the guard cell'], ['a', 'Width of the pore'], ['g', 'Stomatal conductance'], ['A', 'CO₂ taken in'], ['E', 'Water lost'], ['n', 'Water molecules lost per CO₂']]);
      const plot = kit.plot(gd, { x: { label: 'stomatal conductance (mol m⁻² s⁻¹)', min: 0, max: 0.4 }, y: { label: 'fraction of the fully-open value', min: 0, max: 1.05 }, legend: true }, 200);
      let a1 = [], a2 = [];
      function curve() {
        a1 = []; a2 = [];
        const top = photo(0.4, V.VPD, V.type);
        for (let g = 0.01; g <= 0.4001; g += 0.01) { const p = photo(g, V.VPD, V.type); a1.push([g, p.A / Math.max(1e-9, top.A)]); a2.push([g, p.E / Math.max(1e-9, top.E)]); }
      }
      curve();
      let acc = 0;
      const rngq = rng(5), pts = [];
      for (let i = 0; i < 90; i++) pts.push([rngq(), rngq()]);
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const target = 100 + (V.light ? 350 * (1 - 0.9 * V.ABA / 100) : 0);
        cg += (target - cg) * (1 - Math.exp(-dt / 3));
        const Pi = W.osmoticPressure(cg / 1000, 2, 298.15) / MPa;
        const Pg = Math.max(0, Pi + V.psi), a = cl((Pg - 0.3) / 1.3, 0, 1);
        const g = 0.01 + 0.39 * a, ph = photo(g, V.VPD, V.type);
        nowG = g;
        // the stoma
        const cx = Wd * 0.36, cy = Hh * 0.52, L = Math.min(Hh * 0.66, Wd * 0.5), wmax = L * 0.17, bow = L * 0.12 * a;
        c.fillStyle = C.surface; c.strokeStyle = C.axis; c.lineWidth = 1;
        c.beginPath(); c.roundRect ? c.roundRect(cx - L * 0.62, cy - L * 0.58, L * 1.24, L * 1.16, 14) : c.rect(cx - L * 0.62, cy - L * 0.58, L * 1.24, L * 1.16); c.fill(); c.stroke();
        kit.label(c, 'leaf surface, seen from above', cx, cy - L * 0.58 - 10, { color: C.muted, size: 11, align: 'center' });
        const inner = (side, t) => side * bow * Math.pow(Math.sin(Math.PI * t), 0.8);
        const outer = (side, t) => inner(side, t) + side * wmax * (0.25 + 0.75 * Math.sin(Math.PI * t)) * (0.55 + 0.45 * (1 - a * 0.2));
        for (const side of [-1, 1]) {
          c.beginPath();
          for (let i = 0; i <= 24; i++) { const t = i / 24; const x = cx + inner(side, t), y = cy + (t - 0.5) * L; i ? c.lineTo(x, y) : c.moveTo(x, y); }
          for (let i = 24; i >= 0; i--) { const t = i / 24; c.lineTo(cx + outer(side, t), cy + (t - 0.5) * L); }
          c.closePath();
          c.fillStyle = 'hsla(' + Math.round(95 + 25 * a) + ',55%,' + (C.dark ? 38 : 58) + '%,0.9)'; c.fill();
          c.strokeStyle = C.text; c.lineWidth = 1.4; c.stroke();
          // potassium: yellow dots in the cell, as many as the concentration
          c.fillStyle = 'rgba(245,200,40,0.95)';
          const n = Math.round(cg / 6);
          for (let k = 0; k < n && k < pts.length; k++) {
            const t = 0.06 + 0.88 * pts[k][0], x0 = inner(side, t), x1 = outer(side, t);
            c.beginPath(); c.arc(cx + x0 + (x1 - x0) * (0.2 + 0.6 * pts[k][1]), cy + (t - 0.5) * L, 2.2, 0, 6.2832); c.fill();
          }
        }
        // gas particles through the pore: water out (blue), CO2 in (grey)
        spawnW += dt * ph.E * 2.2; spawnC += dt * ph.A * 0.5;
        const half = Math.max(1.5, bow * 0.85);
        while (spawnW >= 1) { spawnW -= 1; parts.push({ x: cx + (Math.random() - 0.5) * 2 * half, y: cy + L * 0.12, v: -1, k: 0 }); }
        while (spawnC >= 1) { spawnC -= 1; parts.push({ x: cx + (Math.random() - 0.5) * 2 * half, y: cy - L * 0.56, v: 1, k: 1 }); }
        if (parts.length > 220) parts.splice(0, parts.length - 220);
        for (let i = parts.length - 1; i >= 0; i--) {
          const p = parts[i]; p.y += p.v * dt * 70;
          if (p.y < cy - L * 0.6 || p.y > cy + L * 0.5) { parts.splice(i, 1); continue; }
          c.fillStyle = p.k ? C.muted : C.accent; c.beginPath(); c.arc(p.x, p.y, 2.6, 0, 6.2832); c.fill();
        }
        // legend
        const lx = Wd - 10;
        kit.label(c, 'potassium in the guard cell ●', lx, 30, { color: '#d9a400', size: 11, align: 'right' });
        kit.label(c, 'water vapour out ●', lx, 48, { color: C.accent, size: 11, align: 'right' });
        kit.label(c, 'carbon dioxide in ●', lx, 66, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'time-lapse: 3 s here is about 10 min', lx, Hh - 14, { color: C.faint, size: 10, align: 'right' });
        ro.set('c', fx(cg, 0) + ' mmol/L (target ' + fx(target, 0) + ')');
        ro.set('Pi', fx(Pi, 2) + ' MPa'); ro.set('Pg', fx(Pg, 2) + ' MPa'); ro.set('a', fx(a * 8, 1) + ' µm');
        ro.set('g', fx(g, 2) + ' mol m⁻² s⁻¹'); ro.set('A', fx(ph.A, 1) + ' µmol m⁻² s⁻¹'); ro.set('E', fx(ph.E, 2) + ' mmol m⁻² s⁻¹');
        ro.set('n', Number.isFinite(ph.ratio) ? fx(ph.ratio, 0) : 'no carbon gained');
        acc += dt;
        if (acc > 0.15) {
          acc = 0; const top = photo(0.4, V.VPD, V.type);
          plot.set({ series: [{ pts: a1, label: 'carbon dioxide gained', color: C.muted }, { pts: a2, label: 'water lost', color: C.accent }], marks: [{ x: g, y: ph.A / Math.max(1e-9, top.A), color: C.muted }, { x: g, y: ph.E / Math.max(1e-9, top.E), color: C.accent }] });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ root pressure */
  Hyper.sim('tree-root-pressure', {
    title: 'The root as an osmotic pump',
    blurb: `A cross-section of a root, soil on the left, the xylem on the right. The Casparian strip (brown) seals the walls between the cells of the endodermis, so water has to cross their membranes and the ions pumped into the sap cannot leak back. Blue dots are water, yellow dots are dissolved solute. The sap's extra solute draws water in by osmosis and builds a pressure σ·ΔΠ; at night this pushes sap up the stem and drops form at the leaf tip (guttation). By day the leaves pull and the pressure at the base turns negative. The column on the right is the height of static water the root pressure could hold. The model is the van 't Hoff osmotic pressure with the strip's selectivity σ; the pull of the leaves is a flat 0.6 MPa at full demand (schematic).

**Try this**
- At night (transpiration 0, soil 10 mmol/L): root pressure about 0.1 MPa, a few metres to ten of sap and a growing drop at the tip.
- Raise the soil's salt to 100, then 400 mmol/L: the pressure falls to zero and below; the root loses water to the soil. Sea water is about 1,100 mmol/L of dissolved particles.
- Raise the transpiration: the pressure at the base turns negative and the drops stop.
- Compare the column with the 100 m of a redwood.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320, maxH: 420 });
      const gd = graphDiv(box);
      let V;
      const ctl = kit.controls(box.side, [
        { id: 'sap', label: 'Solutes in the xylem sap', min: 5, max: 200, step: 1, value: params.sap || 60, unit: 'mmol/L' },
        { id: 'soil', label: 'Solutes in the soil water', min: 1, max: 1200, value: params.soil || 10, unit: 'mmol/L', log: true, sig: 3 },
        { id: 'sigma', label: 'Selectivity of the root (σ)', min: 0.3, max: 1, step: 0.01, value: 0.9 },
        { id: 'E', label: 'Transpiration (share of the midday rate)', min: 0, max: 100, step: 1, value: params.E || 0, unit: '%' },
        { id: 'T', label: 'Soil temperature', min: 2, max: 35, step: 1, value: 15, unit: '°C' }
      ], () => upd());
      V = ctl.values;
      const ro = kit.readout(box.side, [['dPi', 'Osmotic difference ΔΠ'], ['Pr', 'Root pressure σΔΠ'], ['h', 'Static column it could hold'], ['Pb', 'Pressure at the base of the stem'], ['reg', 'What happens']]);
      const plot = kit.plot(gd, { x: { label: 'solutes in the soil water (mmol/L)', log: true, min: 1, max: 1200 }, y: { label: 'pressure (kPa)', min: -700, max: 520 }, legend: true }, 200);
      const rho = W.density(15), g = W.g;
      const Pr = (sap, soil) => V.sigma * (sap - soil) * W.R * (V.T + 273.15) / 1000;      // kPa
      const Pb = (sap, soil) => Pr(sap, soil) - 600 * V.E / 100;
      function upd() {
        const C = kit.colors(), a = [], b = [];
        for (let i = 0; i <= 60; i++) { const s = Math.exp(Math.log(1200) * i / 60); a.push([s, Pr(V.sap, s)]); b.push([s, Pb(V.sap, s)]); }
        plot.set({ series: [{ pts: a, label: 'root pressure', color: C.accent }, { pts: b, label: 'at the base of the stem, with the leaves pulling', color: C.warn, dash: true }], hlines: [{ y: 0, label: '0' }], marks: [{ x: V.soil, y: Pr(V.sap, V.soil), color: C.accent }], vlines: [{ x: 1100, label: 'sea water', color: C.faint }] });
      }
      upd();
      const R0 = rng(11), soilPts = [], sapPts = [], wat = [];
      for (let i = 0; i < 60; i++) soilPts.push([R0(), R0()]);
      for (let i = 0; i < 40; i++) sapPts.push([R0(), R0()]);
      for (let i = 0; i < 42; i++) wat.push([R0(), R0()]);
      let drop = 0, fall = 0, t0 = 0, acc = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const pr = Pr(V.sap, V.soil), pb = Pb(V.sap, V.soil), hcol = Math.max(0, pr * 1000) / (rho * g);
        const dPi = (V.sap - V.soil) * W.R * (V.T + 273.15) / 1000;
        // the root
        const x0 = 14, x1 = Wd * 0.56, y0 = 34, y1 = Hh - 20, bw = x1 - x0, bh = y1 - y0;
        const bands = [['soil', 0, 0.2, 'rgba(160,120,70,0.28)'], ['cortex', 0.2, 0.56, 'rgba(120,180,110,0.22)'], ['endodermis', 0.56, 0.64, 'rgba(180,140,60,0.2)'], ['xylem', 0.64, 1, 'rgba(70,150,235,0.22)']];
        for (const [nm, a, b, col] of bands) {
          c.fillStyle = col; c.fillRect(x0 + bw * a, y0, bw * (b - a), bh);
          kit.label(c, nm, x0 + bw * (a + b) / 2, y0 - 10, { color: C.muted, size: 10.5, align: 'center' });
        }
        // the endodermal cells, the Casparian strip on their side walls
        const ex0 = x0 + bw * 0.56, ew = bw * 0.08, nCell = 7;
        for (let i = 0; i < nCell; i++) {
          const yy = y0 + bh * i / nCell;
          c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(ex0, yy + 2, ew, bh / nCell - 4);
          c.strokeStyle = '#8a5a2b'; c.lineWidth = 3.5;
          c.beginPath(); c.moveTo(ex0, yy); c.lineTo(ex0 + ew, yy); c.stroke();
        }
        kit.label(c, 'Casparian strip', ex0 + ew / 2, y1 + 12, { color: '#8a5a2b', size: 10.5, align: 'center', weight: 600 });
        // solutes: soil (more as the soil gets salty) and sap
        c.fillStyle = 'rgba(245,200,40,0.95)';
        const ns = Math.round(3 + 40 * Math.log(1 + V.soil) / Math.log(1201)), nx = Math.round(V.sap / 5);
        for (let i = 0; i < ns && i < soilPts.length; i++) { c.beginPath(); c.arc(x0 + 6 + soilPts[i][0] * (bw * 0.2 - 12), y0 + 8 + soilPts[i][1] * (bh - 16), 2.4, 0, 6.2832); c.fill(); }
        for (let i = 0; i < nx && i < sapPts.length; i++) { c.beginPath(); c.arc(x0 + bw * 0.64 + 6 + sapPts[i][0] * (bw * 0.36 - 12), y0 + 8 + sapPts[i][1] * (bh - 16), 2.4, 0, 6.2832); c.fill(); }
        // water: drifts in when the root draws water, out when the soil is saltier
        const q = pr / 150 * 0.5 + V.E / 100;
        t0 += dt * q * 0.12;
        c.fillStyle = C.accent;
        for (let i = 0; i < wat.length; i++) {
          let u = (wat[i][0] + t0) % 1; if (u < 0) u += 1;
          const jx = Math.sin(performance.now() / 300 + i) * 1.2;
          c.beginPath(); c.arc(x0 + 4 + u * (bw - 8) + jx, y0 + 6 + wat[i][1] * (bh - 12), 2.4, 0, 6.2832); c.fill();
        }
        // the stem, the leaf tip and the drop
        const sx = Wd * 0.7, sy0 = y1, sy1 = y0 + 40;
        c.strokeStyle = C.axis; c.lineWidth = 8; c.lineCap = 'round'; c.beginPath(); c.moveTo(sx, sy0); c.lineTo(sx, sy1); c.stroke();
        c.strokeStyle = 'rgba(70,150,235,0.8)'; c.lineWidth = 4; c.beginPath(); c.moveTo(sx, sy0); c.lineTo(sx, sy1); c.stroke(); c.lineCap = 'butt';
        c.fillStyle = 'rgba(70,170,90,0.6)'; c.beginPath(); c.ellipse(sx + 22, sy1 - 10, 36, 11, -0.35, 0, 6.2832); c.fill();
        kit.label(c, 'leaf tip', sx + 14, sy1 - 34, { color: C.muted, size: 10.5 });
        const tipX = sx + 56, tipY = sy1 - 24;
        if (pb > 0 && V.E < 25) drop = Math.min(1.15, drop + dt * pb / 90 * 0.4); else drop = Math.max(0, drop - dt * 0.8);
        if (drop >= 1.1) { fall = 0.001; drop = 0; }
        if (fall > 0) { fall += dt * 3; if (fall > 1.4) fall = 0; }
        if (drop > 0.03) S.drop(c, tipX, tipY + 4 + 5 * drop, 2 + 6 * Math.min(1, drop));
        if (fall > 0) S.drop(c, tipX, tipY + 18 + fall * 60, 7 * (1 - fall * 0.2));
        kit.label(c, pb > 0 ? 'xylem pressure positive: ' + fx(pb, 0) + ' kPa' : 'xylem under tension: ' + fx(pb, 0) + ' kPa', sx, sy0 + 12, { color: pb > 0 ? C.ok : C.warn, size: 10.5, align: 'center', weight: 600 });
        // the column bar
        const bx = Wd - 34, bt = y0 + 6, bb = y1 - 8, hm = 120;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx, bt, 14, bb - bt);
        c.fillStyle = 'rgba(70,150,235,0.7)'; c.fillRect(bx + 1, bb - (bb - bt) * Math.min(1, hcol / hm), 12, (bb - bt) * Math.min(1, hcol / hm));
        for (const [m, nm] of [[25, '25 m'], [100, '100 m']]) {
          const yy = bb - (bb - bt) * m / hm; c.strokeStyle = C.faint; c.beginPath(); c.moveTo(bx - 4, yy); c.lineTo(bx + 18, yy); c.stroke();
          kit.label(c, nm, bx - 6, yy, { color: C.muted, size: 10, align: 'right', baseline: 'middle' });
        }
        kit.label(c, 'column held', bx + 7, y0 - 10, { color: C.muted, size: 10.5, align: 'center' });
        kit.label(c, fx(hcol, 1) + ' m', bx + 7, bb + 12, { color: C.text, size: 11, align: 'center', weight: 600 });
        ro.set('dPi', fx(dPi, 0) + ' kPa'); ro.set('Pr', fx(pr, 0) + ' kPa'); ro.set('h', fx(hcol, 1) + ' m of water (static)'); ro.set('Pb', fx(pb, 0) + ' kPa');
        ro.set('reg', pr < 0 ? 'the soil is saltier than the sap: the root loses water' : pb > 0 ? 'root pressure wins: sap rises, drops form at the leaf tip' : 'the leaves pull: xylem under tension, root pressure just softens it');
        acc += dt; if (acc > 0.25) { acc = 0; upd(); }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a day of transpiration */
  Hyper.sim('tree-transpiration-day', {
    title: 'A day in the life of a big tree',
    blurb: `The water a large tree moves through a day, modelled from sunlight, the temperature and humidity of the air, and the soil. The leaf is warmed by the Sun; the driving force is the vapour-pressure deficit between the saturated air at leaf temperature and the air outside, whose dew point stays at what it was in the cool of the night. The stomata open with light, narrow as the deficit grows, and close in dry soil. The rate is conductance times deficit, and the heat taken by the evaporation is the latent heat of the water. A local model, schematic in the stomatal response (a saturating light function with a quadratic deficit penalty).

**Try this**
- Run the day at the defaults: the flow rises through the morning, peaks in the early afternoon (not at solar noon) and the stomata throttle at midday.
- Make the air drier (humidity at night 50 %): the deficit is much larger and the flow dips at midday as the stomata close.
- Dry the soil (20 %): the whole curve is cut to a third.
- Cloud (sunlight 300 W/m²) halves the day's water; a heat wave (warming 15 °C) raises the deficit and the cooling power.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280, maxH: 380 });
      const gd = graphDiv(box);
      let V, tnow = 6, D = null;
      const ctl = kit.controls(box.side, [
        { id: 'Smax', label: 'Midday sunlight', min: 100, max: 1000, step: 10, value: params.Smax || 800, unit: 'W/m²' },
        { id: 'Tmin', label: 'Coolest night temperature', min: 2, max: 30, step: 1, value: params.Tmin != null ? params.Tmin : 14, unit: '°C' },
        { id: 'dT', label: 'Daytime warming', min: 2, max: 20, step: 1, value: params.dT || 10, unit: '°C' },
        { id: 'RH0', label: 'Humidity at the night minimum', min: 30, max: 100, step: 1, value: params.RH0 || 85, unit: '%' },
        { id: 'LA', label: 'Leaf area of the tree', min: 20, max: 2000, value: params.LA || 600, unit: 'm²', log: true, sig: 3 },
        { id: 'soil', label: 'Soil moisture', min: 0, max: 100, step: 1, value: params.soil != null ? params.soil : 70, unit: '%' },
        { id: 'day', label: 'Length of the day', min: 8, max: 16, step: 0.5, value: 14, unit: 'h' },
        { id: 'hour', label: 'Time of day', min: 0, max: 24, step: 0.1, value: 6, unit: 'h' },
        { id: 'play', type: 'check', label: 'Run the day', value: true }
      ], (id, v) => { if (id === 'hour') tnow = v; else if (id !== 'play') { D = null; upd(); } });
      V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['S', 'Sunlight'], ['Ta', 'Air temperature'], ['vpd', 'Vapour-pressure deficit'], ['gs', 'Stomatal conductance'], ['L', 'Water moving now'], ['kW', 'Cooling power now'], ['so', 'Moved so far today'], ['tot', 'Total for the day'], ['avg', 'Average cooling by day']]);
      const p1 = kit.plot(gd, { x: { label: 'hour of the day', min: 0, max: 24 }, y: { label: 'water moved (L/h)', min: 0 }, legend: true }, 150);
      const gd2 = graphDiv(box);
      const p2 = kit.plot(gd2, { x: { label: 'hour of the day', min: 0, max: 24 }, y: { label: 'deficit (kPa) and conductance (×10)', min: 0 }, legend: true }, 130);
      function day() {
        const rise = 12 - V.day / 2, set = 12 + V.day / 2, Tm = V.Tmin + V.dT / 2;
        const Td0 = W.dewPoint(V.Tmin, V.RH0 / 100), ea = W.vapourPressure(Td0), fs = 0.15 + 0.85 * V.soil / 100;
        const rows = []; let tot = 0, pk = 0, kd = 0, nd = 0;
        for (let i = 0; i <= 96; i++) {
          const t = i * 0.25;
          const S0 = t > rise && t < set ? V.Smax * Math.pow(Math.sin(Math.PI * (t - rise) / V.day), 1.3) : 0;
          const Ta = Tm - V.dT / 2 * Math.cos(2 * Math.PI * (t - 15) / 24), Tl = Ta + 4 * S0 / 1000;
          const vpd = Math.max(0, W.vapourPressure(Tl) - ea);
          const gs = 0.01 + 0.35 * S0 / (S0 + 150) / (1 + Math.pow(vpd / 1000 / 2.5, 2)) * fs;
          const E = gs * vpd / 101325;                                   // mol m-2 s-1
          const L = E * V.LA * 0.018015 * 3600;                           // kg/h = L/h
          const kW = L / 3600 * W.latentVaporisation(Tl) / 1000;
          rows.push({ t, S: S0, Ta, Tl, vpd, gs, L, kW });
          tot += L * 0.25; pk = Math.max(pk, L); if (S0 > 0) { kd += kW; nd++; }
        }
        return { rows, tot, pk, avg: nd ? kd / nd : 0 };
      }
      function at(t) {
        const r = D.rows, i = cl(t / 0.25, 0, 95.999), k = Math.floor(i), f = i - k, a = r[k], b = r[k + 1], o = {};
        for (const key of ['S', 'Ta', 'Tl', 'vpd', 'gs', 'L', 'kW']) o[key] = a[key] + (b[key] - a[key]) * f;
        let so = 0; for (let j = 0; j < k; j++) so += r[j].L * 0.25; so += a.L * 0.25 * f;
        o.so = so; return o;
      }
      function upd() {
        if (!D) D = day();
        const C = kit.colors();
        p1.set({ series: [{ pts: D.rows.map(r => [r.t, r.L]), label: 'water moved', color: C.accent, fill: true }], vlines: [{ x: tnow, color: C.warn }], y: { label: 'water moved (L/h)', min: 0, max: Math.max(10, D.pk * 1.1) } });
        p2.set({ series: [{ pts: D.rows.map(r => [r.t, r.vpd / 1000]), label: 'vapour-pressure deficit (kPa)', color: C.bad }, { pts: D.rows.map(r => [r.t, r.gs * 10]), label: 'stomatal conductance (mol m⁻² s⁻¹ × 10)', color: C.ok }], vlines: [{ x: tnow, color: C.warn }] });
      }
      D = day(); upd();
      let acc = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        if (V.play) { tnow = (tnow + dt * 1.2) % 24; ctl.set('hour', tnow); }
        const o = at(tnow), rise = 12 - V.day / 2, set = 12 + V.day / 2;
        // sky and sun
        const lum = cl(o.S / Math.max(1, V.Smax), 0, 1);
        c.fillStyle = C.dark ? 'rgba(' + Math.round(20 + 60 * lum) + ',' + Math.round(30 + 90 * lum) + ',' + Math.round(55 + 110 * lum) + ',1)' : 'rgba(' + Math.round(150 + 70 * lum) + ',' + Math.round(170 + 55 * lum) + ',' + Math.round(210 + 30 * lum) + ',1)';
        c.fillRect(0, 0, Wd, Hh);
        const gy = Hh - 26, ph = (tnow - rise) / (set - rise);
        if (ph > 0 && ph < 1) { const sx = 30 + ph * (Wd * 0.5), sy = gy - 20 - Math.sin(Math.PI * ph) * (Hh * 0.55); c.fillStyle = '#ffd24a'; c.beginPath(); c.arc(sx, sy, 14, 0, 6.2832); c.fill(); }
        c.fillStyle = C.dark ? '#2a3a2a' : '#8bb46b'; c.fillRect(0, gy, Wd, Hh - gy);
        const tx = Wd * 0.3, th = Hh * 0.62;
        tree(c, tx, gy, th, { crownColor: 'rgba(40,140,60,0.75)' });
        // vapour leaving the crown
        const nv = Math.round(Math.min(14, o.L / Math.max(5, D.pk) * 14));
        for (let i = 0; i < nv; i++) {
          const u = ((performance.now() / 1800) + i * 0.137) % 1, xx = tx - 40 + ((i * 53) % 80), yy = gy - th * 0.95 - u * 60;
          c.fillStyle = 'rgba(255,255,255,' + (0.8 * (1 - u)).toFixed(2) + ')'; c.beginPath(); c.arc(xx, yy, 2.6, 0, 6.2832); c.fill();
        }
        kit.label(c, 'tree with ' + fx(V.LA, 0) + ' m² of leaves', tx, gy + 14, { color: C.text, size: 10.5, align: 'center' });
        // the tank of water moved so far, and the leaf thermometer
        const bx = Wd * 0.64, bw = Math.min(90, Wd * 0.14), bh = Hh * 0.6;
        S.beaker(c, bx, 20, bw, bh, cl(o.so / Math.max(1, D.tot), 0, 1) * 0.92, { liquid: 'rgba(70,150,235,0.55)', label: 'moved so far' });
        kit.label(c, fx(o.so, 0) + ' L', bx + bw / 2, 20 + bh + 12, { color: C.text, size: 12, align: 'center', weight: 650 });
        S.thermometer(c, bx + bw + 40, 20, bh, o.Tl, { min: 0, max: 50, label: 'leaf' });
        ro.set('t', fx(Math.floor(tnow), 0) + ':' + String(Math.floor((tnow % 1) * 60)).padStart(2, '0'));
        ro.set('S', fx(o.S, 0) + ' W/m²'); ro.set('Ta', fx(o.Ta, 1) + ' °C (leaf ' + fx(o.Tl, 1) + ')'); ro.set('vpd', fx(o.vpd / 1000, 2) + ' kPa');
        ro.set('gs', fx(o.gs, 2) + ' mol m⁻² s⁻¹'); ro.set('L', fx(o.L, 0) + ' L/h'); ro.set('kW', fx(o.kW, 1) + ' kW');
        ro.set('so', fx(o.so, 0) + ' L'); ro.set('tot', fx(D.tot, 0) + ' L (peak ' + fx(D.pk, 0) + ' L/h)'); ro.set('avg', fx(D.avg, 0) + ' kW while the Sun is up');
        acc += dt; if (acc > 0.3) { acc = 0; upd(); }
      }, box.stage);
      loop.start();
    }
  });
})();
