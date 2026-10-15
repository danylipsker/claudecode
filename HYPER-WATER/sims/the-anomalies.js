/* HYPER-WATER · sims/the-anomalies.js — simulations for the topic "The liquid no one can fully describe".
 *   anom-property-vs-normal   a chosen property of water beside the straight-line expectation of a normal liquid
 *   anom-two-state-density    a two-structure mixture model, fitted here to the density of H₂O and of D₂O
 *   anom-divergence           the apparent power-law divergence of heat capacity and compressibility, and a finite-peak rival
 *   anom-viscosity-pressure   viscosity against pressure at chosen temperatures: a dip below about 33 °C
 *   anom-supercool-timeline   droplets cooled through the nucleation window: the probability of freezing
 *   anom-llcp-phase-diagram   a schematic phase diagram with a movable liquid–liquid critical point and Widom line
 *   anom-lda-hda              compressing low-density amorphous ice into high-density amorphous ice
 *   anom-toy-liquid           a schematic liquid with a tunable directional bond: when a density maximum appears
 *   anom-zero-point           a proton and a deuteron in the O–H bond well: zero-point energy and tunnelling
 *   anom-bond-dial            if the hydrogen bond were stronger or weaker: where the liquid range sits
 * Numbers for water come from the engine (kit.water); each model written here is said to be a model in its blurb.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const Rg = 8.314462618;
  const fmtN = (v, d) => Number.isFinite(v) ? v.toFixed(d) : '—';

  /* a plot in a div under the stage canvas */
  function graphBox(box, kit, opts, h) {
    const g = document.createElement('div');
    g.style.padding = '6px 10px 10px';
    box.stage.appendChild(g);
    return kit.plot(g, opts, h);
  }

  /* ---- the picture of "open" and "dense" molecules, shared by three simulations ---- */
  function makeCells(n, seed) {
    let s = (seed >>> 0) || 1;
    const rnd = () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; };
    const cells = [];
    for (let i = 0; i < n; i++) cells.push({ u: rnd(), jx: rnd() - 0.5, jy: rnd() - 0.5, ph: rnd() * TAU });
    return { cells, rnd };
  }
  function stepCells(set, dt) { for (const c of set.cells) if (set.rnd() < dt * 1.5) c.u = set.rnd(); }
  function drawCells(kit, c, set, bx, xOpen, cols, tt, label) {
    const C = kit.colors(), n = set.cells.length, rows = Math.ceil(n / cols);
    const cw = bx.w / cols, ch = bx.h / rows, r = Math.min(cw, ch) * 0.36;
    const pos = [], open = [];
    set.cells.forEach((q, i) => {
      const gx = i % cols, gy = Math.floor(i / cols);
      pos[i] = [bx.x + (gx + 0.5 + 0.3 * q.jx + 0.05 * Math.sin(tt * 1.7 + q.ph)) * cw, bx.y + (gy + 0.5 + 0.3 * q.jy + 0.05 * Math.cos(tt * 1.3 + q.ph)) * ch];
      open[i] = q.u < xOpen;
    });
    c.save();
    c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(bx.x, bx.y, bx.w, bx.h);
    c.setLineDash([3, 3]); c.strokeStyle = C.accent; c.lineWidth = 1.2; c.globalAlpha = 0.7;
    for (let i = 0; i < n; i++) {
      if (!open[i]) continue;
      if ((i % cols) < cols - 1 && open[i + 1]) { c.beginPath(); c.moveTo(pos[i][0], pos[i][1]); c.lineTo(pos[i + 1][0], pos[i + 1][1]); c.stroke(); }
      if (i + cols < n && open[i + cols]) { c.beginPath(); c.moveTo(pos[i][0], pos[i][1]); c.lineTo(pos[i + cols][0], pos[i + cols][1]); c.stroke(); }
    }
    c.setLineDash([]); c.globalAlpha = 1;
    for (let i = 0; i < n; i++) {
      const [x, y] = pos[i];
      if (open[i]) {
        c.beginPath();
        for (let k = 0; k < 6; k++) { const a = k * TAU / 6 + 0.5; const px = x + r * 1.25 * Math.cos(a), py = y + r * 1.25 * Math.sin(a); if (k) c.lineTo(px, py); else c.moveTo(px, py); }
        c.closePath(); c.fillStyle = 'rgba(120,170,255,0.18)'; c.fill(); c.strokeStyle = C.accent; c.lineWidth = 1.4; c.stroke();
      } else {
        c.beginPath(); c.arc(x, y, Math.max(1, r * 0.62), 0, TAU); c.fillStyle = C.warn; c.globalAlpha = 0.85; c.fill(); c.globalAlpha = 1;
      }
    }
    c.restore();
    if (label) kit.label(c, label, bx.x + bx.w / 2, bx.y + bx.h + 14, { color: C.muted, size: 11.5, align: 'center' });
  }

  /* ================================================================ a property beside a normal liquid */
  Hyper.sim('anom-property-vs-normal', {
    title: 'Water beside a normal liquid',
    blurb: `Pick one property of water. The solid line is the measured (tabulated) value; the dashed line is what a *normal* liquid would do — the hot liquid's own behaviour between 60 and 100 °C, carried on in a straight line to lower temperatures. The gap between them is the anomaly. This is a schematic yardstick, not a theory of a normal liquid.

**Try this**
- *Density*: the straight line keeps climbing on cooling; water turns round at 3.98 °C.
- *Heat capacity* and *compressibility*: a normal liquid becomes slightly less responsive on cooling; water becomes more, and the gap grows fastest below 0 °C.
- *Thermal expansion*: the dashed line stays positive; water's crosses zero and goes negative.
- Slide the probe down to −30 °C and watch the percentage difference. For the full set of properties see [the anomalies lab](#/tools/anomalies).`,
    mount(box, kit, params) {
      const W = kit.water;
      const P = {
        density: { label: 'Density', unit: 'kg/m³', f: T => W.density(T), lo: -30, hi: 100, kind: 'max', d: 1, norm: 'A normal liquid grows steadily denser as it cools.', what: 'Densest at 3.98 °C, then lighter again on cooling towards the freezing point.' },
        expansion: { label: 'Thermal expansion coefficient', unit: '10⁻⁶ /K', f: T => W.expansion(T) * 1e6, lo: -30, hi: 100, kind: 'zero', d: 0, norm: 'A normal liquid always expands on warming: the coefficient stays positive.', what: 'Negative below 3.98 °C: warming makes the liquid shrink.' },
        cp: { label: 'Specific heat capacity', unit: 'J/(kg·K)', f: T => W.heatCapacity(T), lo: -30, hi: 100, kind: 'min', d: 0, norm: 'A normal liquid has a gently falling heat capacity as it cools.', what: 'A shallow minimum near 35 °C, then a steep rise on cooling.' },
        kappa: { label: 'Isothermal compressibility', unit: '10⁻¹⁰ /Pa', f: T => W.compressibility(T) * 1e10, lo: -30, hi: 100, kind: 'min', d: 2, norm: 'A normal liquid becomes stiffer as it cools.', what: 'Stiffest at about 46 °C; easier to squeeze on cooling below that.' },
        sound: { label: 'Speed of sound', unit: 'm/s', f: T => W.speedOfSound(T), lo: -20, hi: 100, kind: 'max', d: 1, norm: 'In a normal liquid sound travels faster the colder it is.', what: 'Fastest at about 74 °C; slower in colder water.' }
      };
      const graph = document.createElement('div');
      graph.style.padding = '6px 10px 10px';
      box.stage.appendChild(graph);
      const ctl = kit.controls(box.side, [
        { id: 'prop', type: 'select', label: 'Property', options: [['Density', 'density'], ['Thermal expansion', 'expansion'], ['Heat capacity', 'cp'], ['Compressibility', 'kappa'], ['Speed of sound', 'sound']], value: params.prop || 'density' },
        { id: 'T', label: 'Probe temperature', min: -30, max: 100, step: 1, value: params.T != null ? params.T : 0, unit: '°C' },
        { id: 'norm', type: 'check', label: 'Show the normal-liquid expectation', value: true }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['w', 'Water at the probe'], ['n', 'A normal liquid would give'], ['d', 'Difference'], ['x', 'Turning point'], ['say', 'What water does']]);
      const plot = kit.plot(graph, { x: { label: 'temperature (°C)' }, y: { label: '' }, legend: true }, 330);
      function draw() {
        const p = P[V.prop] || P.density;
        const f60 = p.f(60), f100 = p.f(100), slope = (f100 - f60) / 40;
        const norm = T => f60 + slope * (T - 60);
        const wpts = [], npts = [];
        for (let T = p.lo; T <= p.hi + 1e-9; T += 1) { wpts.push([T, p.f(T)]); npts.push([T, norm(T)]); }
        // the turning point
        let tx = null, ty = null;
        if (p.kind === 'zero') {
          for (let T = p.lo; T < p.hi; T += 0.05) { const a = p.f(T), b = p.f(T + 0.05); if (a < 0 && b >= 0) { tx = T + 0.05 * (-a) / (b - a); ty = 0; break; } }
        } else {
          let best = p.f(p.lo), bt = p.lo;
          for (let T = p.lo; T <= p.hi; T += 0.1) { const v = p.f(T); if (p.kind === 'max' ? v > best : v < best) { best = v; bt = T; } }
          if (bt > p.lo + 0.5 && bt < p.hi - 0.5) { tx = bt; ty = best; }
        }
        const T0 = clamp(V.T, p.lo, p.hi), w0 = p.f(T0), n0 = norm(T0);
        const series = [{ pts: wpts, label: 'water' }];
        if (V.norm) series.push({ pts: npts, label: 'normal liquid (straight-line expectation)', dash: [6, 4] });
        const marks = [{ x: T0, y: w0, label: '' }];
        if (tx != null) marks.push({ x: tx, y: ty, label: tx.toFixed(1) + ' °C', color: kit.colors().warn });
        plot.set({ series, marks, x: { label: 'temperature (°C)', min: p.lo, max: p.hi }, y: { label: p.label + ' (' + p.unit + ')' } });
        ro.set('w', fmtN(w0, p.d) + ' ' + p.unit);
        ro.set('n', fmtN(n0, p.d) + ' ' + p.unit);
        const diff = Math.abs(n0) > 1e-9 ? (w0 - n0) / Math.abs(n0) * 100 : NaN;
        ro.set('d', Number.isFinite(diff) ? (diff >= 0 ? '+' : '') + diff.toFixed(1) + ' %' : '—');
        ro.set('x', tx != null ? (p.kind === 'zero' ? 'zero at ' : p.kind === 'max' ? 'maximum at ' : 'minimum at ') + tx.toFixed(1) + ' °C' : 'none in range');
        ro.set('say', p.what);
      }
      draw();
    }
  });

  /* ================================================================ the two-structure density model */
  Hyper.sim('anom-two-state-density', {
    title: 'Two structures, one density curve',
    blurb: `A **model**, not a measurement: water is treated as a mixture of two kinds of local arrangement — an *open*, ice-like one (large volume, favoured at low temperature) and a *dense*, collapsed one (small volume, favoured at high temperature) — with a free-energy difference between them. The density follows from how the mixture shifts with temperature. The model has four numbers (an enthalpy, a crossover temperature, the dense state's volume and its ordinary thermal expansion); the best-fit values below were found by least squares against the tabulated density.

**Try this**
- Look at the picture: open patches (hexagons, bonded) against dense molecules (dots). The open share falls as the water warms.
- Press *Best fit* for H₂O, then for D₂O: the fitted crossover temperature and enthalpy both rise for heavy water — stronger bonds, a density maximum at 11.2 °C.
- Drag the enthalpy to 10 kJ/mol: the maximum moves to the wrong temperature and the error grows.
- Set the dense state's expansion to zero: all the warming-induced expansion disappears and only the structural change is left.`,
    mount(box, kit, params) {
      const W = kit.water, st = kit.stage(box.stage, { aspect: 0.3, minH: 150, maxH: 210 });
      const plot = graphBox(box, kit, { x: { label: 'temperature (°C)' }, y: { label: 'density (kg/m³)' }, legend: true }, 250);
      const plot2 = graphBox(box, kit, { x: { label: 'temperature (°C)', min: -30, max: 100 }, y: { label: 'open share (%)', min: 0, max: 100 } }, 130);
      const FIT = { H2O: { dH: 24.2, Ts: 238, vD: 0.9804, bD: 6.03 }, D2O: { dH: 28.0, Ts: 246, vD: 0.8854, bD: 5.745 } };
      const VO = { H2O: 1 / 0.9167, D2O: 1 / 1.017 };    // specific volume of the open (ice-like) state, cm³/g
      const ctl = kit.controls(box.side, [
        { id: 'liq', type: 'select', label: 'Compare the model with', options: [['Light water, H₂O', 'H2O'], ['Heavy water, D₂O', 'D2O']], value: params.liq || 'H2O' },
        { id: 'dH', label: 'Enthalpy, open → dense', min: 5, max: 45, step: 0.1, value: FIT.H2O.dH, unit: 'kJ/mol' },
        { id: 'Ts', label: 'Crossover temperature (half open)', min: 180, max: 320, step: 1, value: FIT.H2O.Ts, unit: 'K' },
        { id: 'vD', label: 'Volume of the dense state at 0 °C', min: 0.8, max: 1.05, step: 0.002, value: FIT.H2O.vD, unit: 'cm³/g' },
        { id: 'bD', label: 'Ordinary expansion of the dense state', min: 0, max: 12, step: 0.05, value: FIT.H2O.bD, unit: '10⁻⁴/K' },
        { id: 'T', label: 'Probe temperature', min: -30, max: 100, step: 1, value: 20, unit: '°C' },
        { id: 'wide', type: 'check', label: 'Show up to 100 °C', value: false },
        { type: 'buttons', items: [{ id: 'fit', label: 'Best fit for this liquid', primary: true }] }
      ], (id) => { if (id === 'fit' || id === 'liq') setFit(); draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['open', 'Open share at the probe'], ['rho', 'Density: tabulated / model'], ['tm', 'Maximum density: tabulated / model'], ['rms', 'Typical error, −30 to 100 °C']]);
      const set = makeCells(60, 7);
      function setFit() { const f = FIT[V.liq] || FIT.H2O; ctl.set('dH', f.dH); ctl.set('Ts', f.Ts); ctl.set('vD', f.vD); ctl.set('bD', f.bD); }
      const data = T => V.liq === 'D2O' ? W.densityD2O(T) : W.density(T);
      const xDense = T => { const Tk = T + 273.15; return 1 / (1 + Math.exp(clamp(V.dH * 1000 * (1 - Tk / V.Ts) / (Rg * Tk), -60, 60))); };
      const model = T => {
        const xd = xDense(T), vo = (VO[V.liq] || VO.H2O) * (1 + 1.6e-4 * T), vd = V.vD * (1 + V.bD * 1e-4 * T);
        return 1000 / (xd * vd + (1 - xd) * vo);
      };
      function draw() {
        const hi = V.wide ? 100 : 40;
        const a = [], b = [], o = [];
        for (let T = -30; T <= hi + 1e-9; T += 1) { a.push([T, data(T)]); b.push([T, model(T)]); }
        for (let T = -30; T <= 100 + 1e-9; T += 2) o.push([T, 100 * (1 - xDense(T))]);
        let tmM = -30, vM = 0, tmD = -30, vD = 0, se = 0, n = 0;
        for (let T = -30; T <= 60; T += 0.05) { const m = model(T), d = data(T); if (m > vM) { vM = m; tmM = T; } if (d > vD) { vD = d; tmD = T; } }
        for (let T = -30; T <= 100; T += 2) { const e = model(T) - data(T); se += e * e; n++; }
        const T0 = V.T;
        plot.set({ series: [{ pts: a, label: V.liq === 'D2O' ? 'D₂O tabulated' : 'H₂O tabulated' }, { pts: b, label: 'two-structure model', dash: [6, 4] }], marks: [{ x: T0, y: data(T0) }, { x: tmD, y: vD, label: tmD.toFixed(2) + ' °C', color: kit.colors().warn }], x: { label: 'temperature (°C)', min: -30, max: hi }, y: { label: 'density (kg/m³)' } });
        plot2.set({ series: [{ pts: o, label: 'open, ice-like share' }], marks: [{ x: T0, y: 100 * (1 - xDense(T0)) }], x: { label: 'temperature (°C)', min: -30, max: 100 }, y: { label: 'open share (%)', min: 0, max: 100 } });
        ro.set('open', (100 * (1 - xDense(T0))).toFixed(1) + ' %');
        ro.set('rho', data(T0).toFixed(1) + ' / ' + model(T0).toFixed(1) + ' kg/m³');
        ro.set('tm', tmD.toFixed(2) + ' / ' + tmM.toFixed(2) + ' °C');
        ro.set('rms', Math.sqrt(se / Math.max(1, n)).toFixed(2) + ' kg/m³ (' + (100 * Math.sqrt(se / Math.max(1, n)) / 1000).toFixed(2) + ' %)');
      }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors();
        stepCells(set, Math.min(dt, 0.05));
        const xo = 1 - xDense(V.T);
        drawCells(kit, c, set, { x: 14, y: 12, w: Math.min(st.W * 0.55, 330), h: st.H - 40 }, xo, 12, t || 0, 'a sample of 60 molecules at ' + V.T.toFixed(0) + ' °C — hexagon: open patch, dot: dense');
        const bx = Math.min(st.W * 0.55, 330) + 40, bw = st.W - bx - 18;
        if (bw > 60) {
          kit.label(c, 'open share', bx, 24, { color: C.muted, size: 12 });
          c.fillStyle = C.grid; c.fillRect(bx, 36, bw, 16);
          c.fillStyle = C.accent; c.fillRect(bx, 36, bw * xo, 16);
          kit.label(c, (100 * xo).toFixed(0) + ' %', bx + bw * xo + 6, 44, { color: C.text, size: 12, baseline: 'middle' });
          kit.label(c, 'model volume ' + (1000 / model(V.T)).toFixed(4) + ' cm³/g', bx, 78, { color: C.muted, size: 11.5 });
        }
      }, box.stage);
      draw(); loop.start();
    }
  });

  /* ================================================================ the apparent divergence */
  Hyper.sim('anom-divergence', {
    title: 'The apparent divergence',
    blurb: `The dots are tabulated values of a response function of water from −30 °C upward. The solid curve is the Speedy–Angell power law, y = a + b (T/Ts − 1)^(−γ), with Ts near 228 K, fitted here to the dots; it climbs without limit as T approaches Ts. The dashed curve is a **rival**: a finite peak (a Lorentzian, standing in for the crossing of a Widom line) fitted to the *same* dots. Both are models; they agree with the data you can reach and disagree below it.

**Try this**
- Switch between *heat capacity* and *compressibility*: the fitted exponent differs.
- Move the singular temperature between 215 and 235 K: the exponent compensates, and the fit hardly notices.
- Tick *show the finite-peak rival*: both curves describe the data to the same few per cent. Only measurements below about −38 °C, where droplets freeze, could choose between them.
- Fit only up to 10 °C, or up to 60 °C, and see how much the exponent depends on the range used.`,
    mount(box, kit, params) {
      const W = kit.water;
      const plot = graphBox(box, kit, { x: { label: 'temperature (°C)' }, y: { label: '' }, legend: true }, 340);
      const ctl = kit.controls(box.side, [
        { id: 'prop', type: 'select', label: 'Response function', options: [['Heat capacity', 'cp'], ['Compressibility', 'kappa']], value: params.prop || 'cp' },
        { id: 'Ts', label: 'Singular temperature Ts', min: 205, max: 238, step: 0.5, value: 228, unit: 'K' },
        { id: 'hi', label: 'Fit data up to', min: 5, max: 70, step: 1, value: 40, unit: '°C' },
        { id: 'peak', type: 'check', label: 'Show the finite-peak rival', value: !!params.peak },
        { id: 'Tw', label: 'Peak position (rival)', min: 215, max: 240, step: 0.5, value: 229, unit: 'K' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['g', 'Fitted exponent γ'], ['e1', 'Power-law error'], ['e2', 'Finite-peak error'], ['p1', 'Power law at −40 °C'], ['p2', 'Finite peak at −40 °C'], ['d', 'Data at −30 °C']]);
      function draw() {
        const isCp = V.prop === 'cp';
        const f = T => isCp ? W.heatCapacity(T) : W.compressibility(T) * 1e10;
        const unit = isCp ? 'J/(kg·K)' : '10⁻¹⁰ /Pa';
        const pts = [];
        for (let T = -30; T <= V.hi + 1e-9; T += 1) pts.push([T + 273.15, f(T)]);
        // power law y = a + b u, u = (T/Ts - 1)^-gamma: linear least squares in (a, b) for each gamma on a grid
        const lsq = us => {
          let su = 0, suu = 0, sy = 0, suy = 0; const n = pts.length;
          for (let i = 0; i < n; i++) { su += us[i]; suu += us[i] * us[i]; sy += pts[i][1]; suy += us[i] * pts[i][1]; }
          const det = n * suu - su * su;
          if (Math.abs(det) < 1e-18) return { a: sy / n, b: 0, sse: Infinity };
          const b = (n * suy - su * sy) / det, a = (sy - b * su) / n;
          let sse = 0; for (let i = 0; i < n; i++) { const e = a + b * us[i] - pts[i][1]; sse += e * e; }
          return { a, b, sse };
        };
        let best = null;
        for (let g = 0.05; g <= 4.0001; g += 0.01) {
          const us = pts.map(p => Math.pow(Math.max(1e-6, p[0] / V.Ts - 1), -g));
          const r = lsq(us); r.g = g;
          if (r.sse < Infinity && (!best || r.sse < best.sse)) best = r;
        }
        best = best || { a: 0, b: 0, g: 1, sse: 0 };
        const pl = Tk => best.a + best.b * Math.pow(Math.max(1e-6, Tk / V.Ts - 1), -best.g);
        // finite Lorentzian peak with fixed position, width by grid
        let bp = null;
        for (let w = 2; w <= 80; w += 0.5) {
          const us = pts.map(p => 1 / (1 + Math.pow((p[0] - V.Tw) / w, 2)));
          const r = lsq(us); r.w = w;
          if (r.sse < Infinity && (!bp || r.sse < bp.sse)) bp = r;
        }
        bp = bp || { a: 0, b: 0, w: 10, sse: 0 };
        const fp = Tk => bp.a + bp.b / (1 + Math.pow((Tk - V.Tw) / bp.w, 2));
        const ymax = f(-30) * 2.4, a1 = [], a2 = [];
        for (let T = V.Ts - 273.15 + 0.4; T <= V.hi + 1e-9; T += 0.25) { const y = pl(T + 273.15); if (y <= ymax) a1.push([T, y]); }
        for (let T = -52; T <= V.hi + 1e-9; T += 0.5) a2.push([T, fp(T + 273.15)]);
        const rms = fn => Math.sqrt(pts.reduce((s, p) => s + Math.pow(fn(p[0]) - p[1], 2), 0) / pts.length);
        const series = [{ pts: pts.map(p => [p[0] - 273.15, p[1]]), label: 'tabulated', line: false, dots: 3 }, { pts: a1, label: 'power law, Ts = ' + V.Ts.toFixed(0) + ' K, γ = ' + best.g.toFixed(2) }];
        if (V.peak) series.push({ pts: a2, label: 'finite peak (rival)', dash: [6, 4] });
        plot.set({ series, vlines: [{ x: V.Ts - 273.15, label: 'Ts' }, { x: -38.15, label: 'ice forms (−38 °C)' }], x: { label: 'temperature (°C)', min: -52, max: V.hi + 2 }, y: { label: (isCp ? 'specific heat capacity' : 'isothermal compressibility') + ' (' + unit + ')', min: 0, max: ymax } });
        const dd = isCp ? 0 : 2;
        ro.set('g', best.g.toFixed(2) + (best.g < 0.07 || best.g > 3.95 ? ' (edge of the search)' : ''));
        ro.set('e1', fmtN(rms(Tk => pl(Tk)) / Math.abs(f(0)) * 100, 2) + ' % rms');
        ro.set('e2', V.peak ? fmtN(rms(Tk => fp(Tk)) / Math.abs(f(0)) * 100, 2) + ' % rms' : '(rival hidden)');
        ro.set('p1', fmtN(pl(233.15), dd) + ' ' + unit);
        ro.set('p2', V.peak ? fmtN(fp(233.15), dd) + ' ' + unit : '(rival hidden)');
        ro.set('d', fmtN(f(-30), dd) + ' ' + unit);
      }
      draw();
    }
  });

  /* ================================================================ viscosity under pressure */
  Hyper.sim('anom-viscosity-pressure', {
    title: 'Squeeze it and it flows',
    blurb: `Viscosity against pressure, as a ratio to the value at one atmosphere. For every ordinary liquid the curve rises. For cold water it first *falls*: pressure breaks the open, bonded structure that holds molecules back. The curves here come from a **local model** built to reproduce the textbook pattern — about −8 % at 1 kbar (100 MPa) at 0 °C, the dip shrinking with temperature and gone by about 33 °C — with the absolute scale taken from the tabulated viscosity at one atmosphere. It is a sketch of the pattern, not a fit to the measurements.

**Try this**
- At 0 °C, drag the pressure axis out to 3 kbar: the viscosity dips near 1 kbar, crosses its starting value near 2 kbar and then climbs like any liquid.
- Raise the temperature: the dip becomes shallower and moves to lower pressure; above 33 °C there is none.
- In the picture, pressure turns open patches into dense molecules (a two-structure estimate), so fewer bonds hold molecules in place.
- Diffusion should speed up where viscosity falls: the read-out gives the crude inverse estimate.`,
    mount(box, kit, params) {
      const W = kit.water, st = kit.stage(box.stage, { aspect: 0.26, minH: 130, maxH: 190 });
      const plot = graphBox(box, kit, { x: { label: 'pressure (kbar)' }, y: { label: 'viscosity ÷ viscosity at 1 atm' }, legend: true }, 300);
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature', min: 0, max: 80, step: 1, value: params.T != null ? params.T : 0, unit: '°C' },
        { id: 'pmax', label: 'Pressure range', min: 0.5, max: 3, step: 0.1, value: 2.5, unit: 'kbar' },
        { id: 'p', label: 'Probe pressure', min: 0, max: 3, step: 0.05, value: 1, unit: 'kbar' },
        { id: 'ref', type: 'check', label: 'Show other temperatures', value: true }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eta0', 'Viscosity at 1 atm'], ['eta', 'Viscosity at the probe pressure'], ['r', 'Ratio'], ['pm', 'Lowest point'], ['D', 'Diffusion, crude estimate (÷ ratio)'], ['open', 'Open share at the probe']]);
      const set = makeCells(48, 11);
      const alpha = T => T < 33 ? -0.166 * (33 - T) / 33 : 0.0020 * (T - 33);        // per kbar
      const beta = T => T <= 33 ? 0.083 : 0.083 * (1 - (T - 33) / 134);               // per kbar²
      const ratio = (T, p) => Math.exp(alpha(T) * p + beta(T) * p * p);
      const xOpen = (T, p) => {      // two-structure estimate: pressure favours the dense state through p·ΔV, ΔV ≈ 2 cm³/mol
        const Tk = T + 273.15, arg = (24200 * (1 - Tk / 238) - p * 1e8 * 2.0e-6) / (Rg * Tk);
        return 1 - 1 / (1 + Math.exp(clamp(arg, -60, 60)));
      };
      function draw() {
        const pm = V.pmax, curves = [];
        const mk = T => { const a = []; for (let i = 0; i <= 60; i++) { const p = pm * i / 60; a.push([p, ratio(T, p)]); } return a; };
        const series = [{ pts: mk(V.T), label: V.T.toFixed(0) + ' °C (chosen)' }];
        if (V.ref) for (const T of [0, 20, 33, 50, 80]) if (Math.abs(T - V.T) > 1) series.push({ pts: mk(T), label: T + ' °C', dash: [4, 4] });
        // the lowest point of the chosen curve
        let pmin = 0, rmin = 1;
        for (let i = 0; i <= 300; i++) { const p = 3 * i / 300, r = ratio(V.T, p); if (r < rmin) { rmin = r; pmin = p; } }
        const marks = [{ x: Math.min(V.p, pm), y: ratio(V.T, Math.min(V.p, pm)) }];
        if (rmin < 0.9995 && pmin <= pm) marks.push({ x: pmin, y: rmin, label: 'dip ' + (100 * (rmin - 1)).toFixed(1) + ' %', color: kit.colors().warn });
        plot.set({ series, marks, hlines: [{ y: 1 }], x: { label: 'pressure (kbar)', min: 0, max: pm }, y: { label: 'viscosity ÷ viscosity at 1 atm' } });
        const eta0 = W.viscosity(V.T) * 1000, r = ratio(V.T, V.p);
        ro.set('eta0', eta0.toFixed(3) + ' mPa·s');
        ro.set('eta', (eta0 * r).toFixed(3) + ' mPa·s');
        ro.set('r', r.toFixed(3) + (r < 1 ? ' (flows more easily)' : ' (more viscous)'));
        ro.set('pm', rmin < 0.9995 ? pmin.toFixed(2) + ' kbar, ' + (100 * (rmin - 1)).toFixed(1) + ' %' : 'none: viscosity only rises');
        ro.set('D', (100 * (1 / r - 1)).toFixed(1) + ' % change');
        ro.set('open', (100 * xOpen(V.T, V.p)).toFixed(1) + ' %');
      }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors();
        stepCells(set, Math.min(dt, 0.05));
        const x0 = xOpen(V.T, 0), x1 = xOpen(V.T, V.p);
        const w = Math.min(st.W * 0.42, 240);
        drawCells(kit, c, set, { x: 14, y: 12, w: w, h: st.H - 40 }, x0, 12, t || 0, '1 atm: ' + (100 * x0).toFixed(0) + ' % open');
        drawCells(kit, c, set, { x: 14 + w + 40, y: 12, w: w, h: st.H - 40 }, x1, 12, t || 0, (V.p).toFixed(2) + ' kbar: ' + (100 * x1).toFixed(0) + ' % open');
        kit.arrow(c, 14 + w + 6, st.H / 2 - 6, 14 + w + 34, st.H / 2 - 6, C.accent, 2);
      }, box.stage);
      draw(); loop.start();
    }
  });

  /* ================================================================ droplets cooled through no man's land */
  Hyper.sim('anom-supercool-timeline', {
    title: 'Droplets cooled through no man\'s land',
    blurb: `Ninety-six identical droplets are cooled from 0 °C. Each one freezes when its own random "ticket" is used up by the nucleation rate integrated over the cooling: the chance of freezing grows as the water gets colder and the droplet gets bigger, and shrinks as the cooling gets faster. The rate is a **schematic model** — about ten orders of magnitude per cubic centimetre per second at −38 °C, rising to a peak near −68 °C and dying away towards the glass transition at 136 K (−137 °C) — chosen to freeze 10 µm drops near −38 °C. Specks of dust add a second, easier route.

**Try this**
- Ultrapure water, 10 µm, 1 K/s: the curve switches on near −38 °C, the textbook limit of supercooling.
- Make the droplet smaller: it supercools further, because there is less volume for a nucleus to appear in.
- Add specks (tap water) in a 1 mm drop: freezing starts near −11 °C.
- Raise the cooling rate towards 10⁷ K/s with a micrometre droplet: the water crosses no man's land faster than ice can form and survives to the glass.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230, maxH: 330 });
      const plot = graphBox(box, kit, { x: { label: 'temperature (°C)', min: -150, max: 0, reverse: true }, y: { label: 'share frozen', min: 0, max: 1 } }, 190);
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Droplet diameter', min: 0.1, max: 1000, value: params.d || 10, unit: 'µm', log: true },
        { id: 'q', label: 'Cooling rate', min: 0.01, max: 1e7, value: params.q || 1, unit: 'K/s', log: true },
        { id: 'pure', type: 'select', label: 'The water', options: [['Ultrapure', 0], ['Clean (10 specks per µL)', 10], ['Tap water (10,000 per µL)', 10000]], value: params.pure != null ? params.pure : 0 },
        { type: 'buttons', items: [{ id: 'go', label: 'Cool again', primary: true }] }
      ], (id) => { if (id === 'go') rollE(); rebuild(); Tnow = 273.15; hold = 0; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Temperature now'], ['n', 'Frozen so far'], ['t10', 'Ten per cent frozen at'], ['t50', 'Half frozen at'], ['cross', 'Time to cross −38 to −137 °C'], ['vol', 'Droplet volume']]);
      const N = 96;
      let E = [], Tf = [], Hc = [], Tnow = 273.15, hold = 0, seed = 5;
      const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
      function rollE() { E = []; for (let i = 0; i < N; i++) E.push(-Math.log(1 - rnd() * 0.999999)); }
      /* the model: log10 of the homogeneous rate per cm³ per second */
      function logJ(Tk) { if (Tk >= 205) { const u = (Tk - 205) / 30; return 17 - 7 * Math.pow(u, 3.4); } const v = (205 - Tk) / 50; return 17 - 12 * Math.pow(v, 1.2); }
      function rate(Tk) {
        const dcm = V.d * 1e-4, Vcm3 = Math.PI / 6 * dcm * dcm * dcm, dmm = V.d / 1000, Vmm3 = Math.PI / 6 * dmm * dmm * dmm;
        const hom = Math.pow(10, clamp(logJ(Tk), -60, 40)) * Vcm3;
        const het = V.pure * Vmm3 * Math.pow(10, clamp(0.9 * (258 - Tk), -60, 40));
        return hom + het;
      }
      function rebuild() {
        Hc = []; let h = 0;
        for (let Tk = 273.15; Tk >= 120; Tk -= 0.25) { h += rate(Tk) * 0.25 / Math.max(1e-9, V.q); h = Math.min(h, 1e6); Hc.push([Tk, h]); }
        Tf = E.map(e => { for (const p of Hc) if (p[1] >= e) return p[0]; return null; });
      }
      const atP = pr => { const need = -Math.log(1 - pr); for (const p of Hc) if (p[1] >= need) return p[0] - 273.15; return null; };
      const volText = fL => fL < 1e3 ? fL.toFixed(fL < 10 ? 2 : 0) + ' fL' : fL < 1e6 ? (fL / 1e3).toFixed(1) + ' pL' : fL < 1e9 ? (fL / 1e6).toFixed(1) + ' nL' : (fL / 1e9).toFixed(2) + ' µL';
      const timeText = s => s < 1e-6 ? (s * 1e9).toFixed(0) + ' ns' : s < 1e-3 ? (s * 1e6).toFixed(1) + ' µs' : s < 1 ? (s * 1e3).toFixed(1) + ' ms' : s.toFixed(1) + ' s';
      rollE(); rebuild();
      function drawPlot() {
        const pts = []; for (let i = 0; i < Hc.length; i += 4) pts.push([Hc[i][0] - 273.15, 1 - Math.exp(-Hc[i][1])]);
        plot.set({ series: [{ pts, label: 'probability of freezing' }], vlines: [{ x: -38.15, label: '−38 °C' }, { x: -137.15, label: 'glass ≈ 136 K' }], x: { label: 'temperature (°C)', min: -150, max: 0, reverse: true }, y: { label: 'share frozen', min: 0, max: 1 } });
      }
      drawPlot();
      let lastKey = '';
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        const key = V.d + '|' + V.q + '|' + V.pure;
        if (key !== lastKey) { lastKey = key; rebuild(); drawPlot(); }
        if (Tnow > 120) Tnow = Math.max(120, Tnow - 9 * Math.min(dt, 0.05)); else { hold += dt; if (hold > 2.5) { Tnow = 273.15; hold = 0; } }
        const cols = 12, rows = Math.ceil(N / cols), gw = st.W - 120, cw = gw / cols, ch = (st.H - 50) / rows, r = Math.min(cw, ch) * 0.38;
        let frozen = 0;
        for (let i = 0; i < N; i++) {
          const x = 16 + (i % cols + 0.5) * cw, y = 14 + (Math.floor(i / cols) + 0.5) * ch;
          const fz = Tf[i] != null && Tnow <= Tf[i];
          if (fz) frozen++;
          c.beginPath(); c.arc(x, y, Math.max(2, r), 0, TAU);
          if (fz) { c.fillStyle = 'rgba(225,240,255,0.95)'; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1; c.stroke(); for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; c.beginPath(); c.moveTo(x + r * 0.8 * Math.cos(a), y + r * 0.8 * Math.sin(a)); c.lineTo(x - r * 0.8 * Math.cos(a), y - r * 0.8 * Math.sin(a)); c.strokeStyle = C.accent; c.stroke(); } }
          else if (Tnow < 136) { c.fillStyle = 'rgba(170,110,230,0.7)'; c.fill(); }
          else { c.fillStyle = Tnow > 273.15 - 0.01 ? 'rgba(70,150,235,0.55)' : 'rgba(40,190,230,0.55)'; c.fill(); }
        }
        S.thermometer(c, st.W - 56, 12, st.H - 56, clamp(Tnow - 273.15, -160, 20), { min: -160, max: 20 });
        const zone = Tnow > 273.15 ? 'liquid above 0 °C' : Tnow > 235 ? 'supercooled: below freezing, still liquid' : Tnow > 136 ? 'no man\'s land: ice nearly always wins' : 'below the glass transition';
        kit.label(c, zone, 16, st.H - 14, { color: C.muted, size: 12 });
        ro.set('T', (Tnow - 273.15).toFixed(1) + ' °C (' + Tnow.toFixed(0) + ' K)');
        ro.set('n', frozen + ' of ' + N);
        const a10 = atP(0.1), a50 = atP(0.5);
        ro.set('t10', a10 == null ? 'never (survives to the glass)' : a10.toFixed(1) + ' °C');
        ro.set('t50', a50 == null ? 'never (most survive)' : a50.toFixed(1) + ' °C');
        ro.set('cross', timeText(99 / Math.max(1e-9, V.q)));
        ro.set('vol', volText(Math.PI / 6 * V.d * V.d * V.d));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the liquid–liquid critical point */
  Hyper.sim('anom-llcp-phase-diagram', {
    title: 'Where the two liquids would meet',
    blurb: `A **schematic** pressure–temperature map of supercooled water. The real melting line of ice Ih (and of ice III and V at higher pressures) is drawn from the tabulated curves; the homogeneous-nucleation line and the glass transition are rough. If the two-liquid picture is right, the thick line is a first-order boundary between two liquids — the low-density one (blue) on its cold side, the high-density one (amber) on its warm, high-pressure side — and it ends at the liquid–liquid critical point. Beyond it the line continues as the Widom line, where the response functions peak. The position of the critical point is **not** known — drag it, or use the sliders.

**Try this**
- Drag the white circle: different simulations and different water models put the critical point at quite different temperatures and pressures, and no experiment has yet located it.
- Hide the colours and look at the shape: the whole critical region lies inside no man's land, between the nucleation line and the glass.
- Move the probe along 1 atm (0 MPa) from warm to cold: it crosses the Widom line near 230 K and the water turns from high-density-like to low-density-like.
- Go to 4 °C (277 K, 0.1 MPa): far from everything, an ordinary liquid with a hint of both.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'Tc', label: 'Critical temperature', min: 190, max: 240, step: 1, value: 220, unit: 'K' },
        { id: 'pc', label: 'Critical pressure', min: 20, max: 250, step: 5, value: 100, unit: 'MPa' },
        { id: 'slope', label: 'Slope of the two-liquid line', min: 0.03, max: 0.3, step: 0.01, value: 0.09, unit: 'K/MPa' },
        { id: 'Tp', label: 'Probe temperature', min: 130, max: 300, step: 1, value: params.Tp || 215, unit: 'K' },
        { id: 'pp', label: 'Probe pressure', min: 0, max: 400, step: 5, value: params.pp != null ? params.pp : 50, unit: 'MPa' },
        { id: 'widom', type: 'check', label: 'Show the Widom line', value: true },
        { id: 'map', type: 'check', label: 'Colour by liquid character', value: true }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['state', 'At the probe'], ['ldl', 'Low-density character'], ['mix', 'Mixing of the two liquids'], ['wid', 'Distance from the line'], ['tm', 'Melting point at this pressure'], ['th', 'Nucleation limit at this pressure']]);
      const TL = 120, TH = 300, PL = 0, PH = 400;
      const M = { l: 54, r: 14, t: 14, b: 40 };
      const tx = T => M.l + (T - TL) / (TH - TL) * (st.W - M.l - M.r);
      const py = p => st.H - M.b - (p - PL) / (PH - PL) * (st.H - M.t - M.b);
      const fx = x => TL + (x - M.l) / (st.W - M.l - M.r) * (TH - TL);
      const fy = y => PL + (st.H - M.b - y) / (st.H - M.t - M.b) * (PH - PL);
      const lineT = p => V.Tc - V.slope * (p - V.pc);
      const wT = p => p >= V.pc ? 0.6 : 0.6 + 0.045 * (V.pc - p) * (100 / Math.max(20, V.pc));
      const xLDL = (T, p) => 1 / (1 + Math.exp(-clamp((lineT(p) - T) / wT(p), -50, 50)));
      const THp = p => p <= 200 ? 235 - 0.27 * p : 181 + 0.2 * (p - 200);
      const Tmelt = p => { const m = W.meltingPoint(Math.max(p, 0.1) * 1e6); return Number.isFinite(m.T) ? m.T : 273.15; };
      kit.drag(st, {
        hit(p) { if (Math.hypot(p.x - tx(V.Tc), p.y - py(V.pc)) < 14) return 'c'; if (Math.hypot(p.x - tx(V.Tp), p.y - py(V.pp)) < 12) return 'p'; return null; },
        move(thing, p) {
          if (thing === 'c') { ctl.set('Tc', clamp(Math.round(fx(p.x)), 190, 240)); ctl.set('pc', clamp(Math.round(fy(p.y) / 5) * 5, 20, 250)); }
          else { ctl.set('Tp', clamp(Math.round(fx(p.x)), 130, 300)); ctl.set('pp', clamp(Math.round(fy(p.y) / 5) * 5, 0, 400)); }
        }, hover: true
      });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const x0 = M.l, x1 = st.W - M.r, y0 = M.t, y1 = st.H - M.b;
        if (V.map) {
          const bs = 9;
          for (let X = x0; X < x1; X += bs) for (let Y = y0; Y < y1; Y += bs) {
            const T = fx(X + bs / 2), p = fy(Y + bs / 2);
            const x = xLDL(T, p);
            c.fillStyle = 'rgba(' + Math.round(70 + 170 * (1 - x)) + ',' + Math.round(150 + 10 * (1 - x)) + ',' + Math.round(235 - 170 * (1 - x)) + ',0.28)';
            c.fillRect(X, Y, bs, bs);
          }
        }
        // axes
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x0, y0, x1 - x0, y1 - y0);
        for (let T = 150; T <= 300; T += 50) { kit.label(c, T + '', tx(T), y1 + 6, { color: C.muted, size: 11, align: 'center', baseline: 'top' }); c.beginPath(); c.moveTo(tx(T), y1); c.lineTo(tx(T), y1 + 4); c.stroke(); }
        for (let p = 0; p <= 400; p += 100) { kit.label(c, p + '', x0 - 6, py(p), { color: C.muted, size: 11, align: 'right', baseline: 'middle' }); }
        kit.label(c, 'temperature (K)', x1, st.H - 4, { color: C.muted, size: 11.5, align: 'right', baseline: 'bottom' });
        kit.label(c, 'pressure (MPa)', 6, y0 + 2, { color: C.muted, size: 11.5, baseline: 'top' });
        // no man's land, between the nucleation line and the glass transition
        c.save(); c.beginPath(); c.rect(x0, y0, x1 - x0, y1 - y0); c.clip();
        c.beginPath(); c.moveTo(tx(136), py(0)); for (let p = 0; p <= 400; p += 10) c.lineTo(tx(THp(p)), py(p)); c.lineTo(tx(136), py(400)); c.closePath();
        c.fillStyle = 'rgba(150,150,170,0.20)'; c.fill();
        // ice Ih / III / V melting line
        c.beginPath(); let first = true;
        for (let p = 0.2; p <= 400; p += 2) { const T = Tmelt(p); if (first) { c.moveTo(tx(T), py(p)); first = false; } else c.lineTo(tx(T), py(p)); }
        c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        // nucleation limit
        c.beginPath(); for (let p = 0; p <= 400; p += 10) { if (p === 0) c.moveTo(tx(THp(p)), py(p)); else c.lineTo(tx(THp(p)), py(p)); }
        c.setLineDash([5, 4]); c.strokeStyle = C.bad; c.lineWidth = 1.6; c.stroke(); c.setLineDash([]);
        // glass transition
        c.beginPath(); c.moveTo(tx(136), py(0)); c.lineTo(tx(136), py(400)); c.strokeStyle = C.faint; c.lineWidth = 1.6; c.stroke();
        // the two-liquid line: solid below the critical point, dashed Widom line above it
        c.beginPath(); c.moveTo(tx(V.Tc), py(V.pc)); c.lineTo(tx(lineT(PH)), py(PH)); c.strokeStyle = C.text; c.lineWidth = 3; c.stroke();
        if (V.widom) { c.beginPath(); c.moveTo(tx(V.Tc), py(V.pc)); c.lineTo(tx(lineT(0)), py(0)); c.setLineDash([6, 5]); c.strokeStyle = C.warn; c.lineWidth = 2.4; c.stroke(); c.setLineDash([]); }
        c.restore();
        kit.label(c, 'ice Ih melts', tx(272), py(10) + 16, { color: C.text, size: 11.5, align: 'right' });
        kit.label(c, 'homogeneous nucleation (~235 K at 1 atm)', tx(THp(0)) - 4, py(20) - 14, { color: C.bad, size: 11, align: 'right' });
        kit.label(c, 'glass ≈ 136 K', tx(136) + 4, py(380), { color: C.muted, size: 11 });
        kit.label(c, 'no man\'s land', tx(172), py(150), { color: C.muted, size: 12, align: 'center', weight: 650 });
        kit.label(c, 'LDL', tx(155), py(60), { color: C.accent, size: 14, align: 'center', weight: 700 });
        kit.label(c, 'HDL', tx(268), py(300), { color: C.warn, size: 14, align: 'center', weight: 700 });
        if (V.widom) kit.label(c, 'Widom line', tx(lineT(10)) + 6, py(20), { color: C.warn, size: 11.5 });
        // the critical point and the probe
        c.beginPath(); c.arc(tx(V.Tc), py(V.pc), 7, 0, TAU); c.fillStyle = '#fff'; c.fill(); c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        kit.label(c, 'critical point?', tx(V.Tc) + 11, py(V.pc) - 8, { color: C.text, size: 11.5, weight: 650 });
        c.beginPath(); c.arc(tx(V.Tp), py(V.pp), 5.5, 0, TAU); c.fillStyle = C.ok; c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
        // read-outs
        const T = V.Tp, p = V.pp, x = xLDL(T, p), tm = Tmelt(p), th = THp(p);
        const state = T > tm ? 'stable liquid' : T > th ? 'supercooled liquid (ice can nucleate)' : T > 136 ? 'no man\'s land: ice in microseconds' : 'glass (amorphous ice)';
        ro.set('state', state);
        ro.set('ldl', (100 * x).toFixed(0) + ' % low-density-like');
        ro.set('mix', (4 * x * (1 - x)).toFixed(2) + ' (1 = equal mix)');
        ro.set('wid', (lineT(p) - T >= 0 ? '+' : '') + (lineT(p) - T).toFixed(1) + ' K ' + ((p >= V.pc) ? 'from the first-order line' : 'from the Widom line'));
        ro.set('tm', tm.toFixed(1) + ' K (' + (tm - 273.15).toFixed(1) + ' °C)');
        ro.set('th', th.toFixed(0) + ' K (' + (th - 273.15).toFixed(0) + ' °C)');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ amorphous ices under pressure */
  Hyper.sim('anom-lda-hda', {
    title: 'Squeezing a glass into another glass',
    blurb: `A **schematic** of Mishima's experiments: amorphous ice squeezed in a piston at low temperature. Low-density amorphous ice (LDA, 0.94 g/cm³) compressed at 77 K jumps to high-density amorphous ice (HDA, about 1.17 g/cm³) near 0.5 GPa — a sudden collapse, not a smooth squeeze — and stays HDA when the pressure is released. At about 135 K the change runs both ways within a narrow pressure window, as a first-order transition between two liquid-like glasses should. Transition pressures here are approximate, from the published pattern; the density curves are sketches.

**Try this**
- *Compress ice Ih at 77 K* to 1.0 GPa: the crystal collapses to HDA (Mishima 1984).
- *Compress LDA at 77 K*: the jump comes at lower pressure, then release it: HDA remains.
- Press *Warm to 130 K* with HDA at low pressure: it relaxes back to LDA.
- *Cycle at 135 K*: ramp the pressure up and down across 0.2 GPa and watch the density flip back and forth with a small hysteresis. At high pressure, *Anneal* turns HDA into very-high-density amorphous ice (1.25 g/cm³).`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230, maxH: 330 });
      const plot = graphBox(box, kit, { x: { label: 'pressure (GPa)', min: 0, max: 1.4 }, y: { label: 'density (g/cm³)', min: 0.8, max: 1.5 }, legend: true }, 210);
      const RHO = { Ih: 0.92, LDA: 0.94, HDA: 1.17, VHDA: 1.25 };
      const KB = { Ih: 9, LDA: 9, HDA: 11, VHDA: 12 };       // GPa, rough stiffness within each state
      const NAME = { Ih: 'crystalline ice Ih', LDA: 'low-density amorphous ice (LDA)', HDA: 'high-density amorphous ice (HDA)', VHDA: 'very-high-density amorphous ice (VHDA)' };
      const ctl = kit.controls(box.side, [
        { id: 'exp', type: 'select', label: 'Experiment', options: [['Compress ice Ih at 77 K', 'ih'], ['Compress LDA at 77 K', 'lda77'], ['Cycle LDA ↔ HDA at 135 K', 'cyc']], value: params.exp || 'lda77' },
        { id: 'p', label: 'Pressure', min: 0, max: 1.4, step: 0.01, value: 0, unit: 'GPa' },
        { type: 'buttons', items: [{ id: 'warm', label: 'Warm to 130 K' }, { id: 'anneal', label: 'Anneal at high pressure' }, { id: 'reset', label: 'Reset', primary: true }] }
      ], (id) => {
        if (id === 'reset' || id === 'exp') { reset(); return; }
        if (id === 'warm') { if (state === 'HDA' && V.p < 0.15) { state = 'LDA'; note = 'warmed to 130 K at low pressure: HDA relaxed to LDA'; } else note = 'warming only relaxes HDA near 1 atm'; push(); return; }
        if (id === 'anneal') { if (state === 'HDA' && V.p >= 0.9) { state = 'VHDA'; note = 'annealed under pressure: very-high-density amorphous ice'; } else note = 'annealing needs HDA held at about 1 GPa or more'; push(); return; }
        apply(); push();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['state', 'The ice'], ['rho', 'Density'], ['jump', 'Last density jump'], ['note', 'What happened']]);
      let state = 'LDA', note = 'at rest', jump = '—', rhoDisp = RHO.LDA, trace = [], pPrev = 0;
      const T77 = () => V.exp !== 'cyc';
      function reset() { state = V.exp === 'ih' ? 'Ih' : 'LDA'; note = 'at rest'; jump = '—'; trace = []; ctl.set('p', 0); pPrev = 0; rhoDisp = RHO[state]; push(); }
      const target = () => RHO[state] * (1 + V.p / KB[state]);
      function apply() {
        const p = V.p, before = state, r0 = target();
        if (V.exp === 'cyc') {
          if (state === 'LDA' && p >= 0.22) { state = 'HDA'; note = 'LDA → HDA at about 0.2 GPa (135 K)'; }
          else if (state === 'HDA' && p <= 0.17) { state = 'LDA'; note = 'HDA → LDA on decompression at about 0.17 GPa'; }
        } else {
          if (state === 'Ih' && p >= 1.0) { state = 'HDA'; note = 'the crystal collapsed to HDA near 1 GPa'; }
          else if (state === 'LDA' && p >= 0.55) { state = 'HDA'; note = 'LDA → HDA near 0.5 GPa at 77 K'; }
          else if (state === 'HDA' && p < 0.55 && pPrev >= 0.55) note = 'released: HDA stays HDA at 77 K (metastable)';
        }
        if (state !== before) { const r1 = target(); jump = (r1 >= r0 ? '+' : '') + (100 * (r1 / r0 - 1)).toFixed(0) + ' % (' + r0.toFixed(2) + ' → ' + r1.toFixed(2) + ' g/cm³)'; }
        pPrev = p;
      }
      function push() { trace.push([V.p, target()]); if (trace.length > 400) trace.shift(); drawPlot(); }
      function drawPlot() {
        const marks = [{ x: V.p, y: target() }];
        plot.set({ series: [{ pts: trace.length ? trace : [[0, RHO[state]]], label: 'your path', line: true, dots: 2 }], marks, hlines: [{ y: 0.94, label: 'LDA 0.94' }, { y: 1.17, label: 'HDA 1.17' }, { y: 1.25, label: 'VHDA 1.25' }, { y: W.density(0) / 1000, label: 'liquid water 1.00' }], x: { label: 'pressure (GPa)', min: 0, max: 1.4 }, y: { label: 'density (g/cm³)', min: 0.8, max: 1.5 } });
      }
      // a fixed disordered set of points, scaled with the box
      let s0 = 21; const rr = () => { s0 = (Math.imul(s0, 1664525) + 1013904223) >>> 0; return s0 / 4294967296; };
      const pts = []; for (let i = 0; i < 64; i++) pts.push([(i % 8 + 0.5 + 0.55 * (rr() - 0.5)) / 8, (Math.floor(i / 8) + 0.5 + 0.55 * (rr() - 0.5)) / 8]);
      reset();
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors();
        rhoDisp += (target() - rhoDisp) * Math.min(1, dt * 7);
        const side = Math.min(st.H - 60, st.W * 0.38) * Math.sqrt(RHO.LDA / rhoDisp) * 0.98;
        const bx = 40, by = 30 + (Math.min(st.H - 60, st.W * 0.38) - side);
        // the piston and the cell
        c.fillStyle = C.faint; c.fillRect(bx - 12, 14, side + 24, by - 14 + 0); c.fillRect(bx - 12, by, 8, side + 8); c.fillRect(bx + side + 4, by, 8, side + 8); c.fillRect(bx - 12, by + side, side + 24, 8);
        kit.arrow(c, bx + side / 2, 2, bx + side / 2, 14, C.warn, 2);
        c.fillStyle = state === 'HDA' || state === 'VHDA' ? 'rgba(240,170,80,0.16)' : 'rgba(110,170,255,0.16)'; c.fillRect(bx, by, side, side);
        let nb = 0;
        const px = pts.map(q => [bx + q[0] * side, by + q[1] * side]);
        const cut = (Math.min(st.H - 60, st.W * 0.38) * 0.98 / 8) * 1.32;
        c.strokeStyle = state === 'Ih' ? C.accent : (state === 'LDA' ? C.accent : C.warn); c.lineWidth = 1; c.globalAlpha = 0.65;
        for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(px[i][0] - px[j][0], px[i][1] - px[j][1]);
          if (d < cut) { nb += 2; c.beginPath(); c.moveTo(px[i][0], px[i][1]); c.lineTo(px[j][0], px[j][1]); c.stroke(); }
        }
        c.globalAlpha = 1;
        for (const q of px) { c.beginPath(); c.arc(q[0], q[1], 3.2, 0, TAU); c.fillStyle = C.text; c.fill(); }
        kit.label(c, NAME[state], bx + side + 40, 36, { color: C.text, size: 13, weight: 650 });
        kit.label(c, 'density ' + rhoDisp.toFixed(3) + ' g/cm³', bx + side + 40, 58, { color: C.muted, size: 12.5 });
        kit.label(c, 'neighbours within a fixed distance, in this picture: ' + (nb / pts.length).toFixed(1), bx + side + 40, 78, { color: C.muted, size: 11.5 });
        kit.label(c, (T77() ? '77 K' : '135 K') + ' · ' + V.p.toFixed(2) + ' GPa', bx + side + 40, 100, { color: C.muted, size: 12 });
        ro.set('state', NAME[state]);
        ro.set('rho', rhoDisp.toFixed(3) + ' g/cm³ (' + (rhoDisp * 1000).toFixed(0) + ' kg/m³)');
        ro.set('jump', jump);
        ro.set('note', note);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a toy liquid with a tunable directional bond */
  Hyper.sim('anom-toy-liquid', {
    title: 'A toy liquid: when does a density maximum appear?',
    blurb: `A **schematic** liquid in reduced units. Its molecules are round and sticky (a Lennard–Jones well of depth 1) and can also form a *directional* bond of strength ε, which pins them into open, ring-like patches. The open patches are bulkier but lower in energy; the dense arrangement is compact but has more ways to be arranged. Mixing the two gives a density curve. The melting and boiling points rise with ε too, so the liquid occupies a window of temperature that slides upwards. This is a mean-field sketch of the idea behind full 2-D "Mercedes-Benz" and dipole-liquid simulations, not a simulation of them.

**Try this**
- Start at ε = 1.0: the density curve has a maximum inside the liquid range — the water-like case.
- Slide ε down to 0.3: the open structure would only win below freezing, so the liquid is ordinary: its density only rises on cooling.
- Slide ε up to 3: the bond is so strong that the open network never really melts; the anomaly leaves the liquid range and the "liquid" is a viscous network.
- In the picture, hexagons are the open, bonded patches and dots are the compact molecules; watch the share of hexagons change with temperature.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 150, maxH: 210 });
      const plot = graphBox(box, kit, { x: { label: 'temperature (reduced units)' }, y: { label: 'density (reduced units)' }, legend: true }, 270);
      const ctl = kit.controls(box.side, [
        { id: 'e', label: 'Strength of the directional bond ε', min: 0, max: 4, step: 0.05, value: params.e != null ? params.e : 1, unit: '× the LJ well' },
        { id: 'T', label: 'Temperature for the picture', min: 0.2, max: 3.5, step: 0.05, value: 1.0 }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rng', 'Liquid range'], ['max', 'Density maximum'], ['say', 'Verdict'], ['open', 'Open patches at the picture\'s temperature']]);
      const set = makeCells(60, 3);
      const S1 = 1.0;
      const xO = (T, e) => 1 / (1 + Math.exp(clamp((T * S1 - e) / Math.max(1e-6, T), -60, 60)));
      const vol = (T, e) => { const x = xO(T, e); return (1 - x) * (1 + 0.1 * T) + x * (1.40 + 0.01 * T); };
      const Tm = e => 0.43 + 0.55 * e, Tb = e => 0.95 + 0.85 * e;
      let dirty = true;
      function draw() {
        const e = V.e, a = Tm(e), b = Tb(e), liq = [], hot = [], cold = [];
        for (let T = 0.25; T <= 4.2; T += 0.05) {
          const r = 1 / vol(T, e);
          if (T < a - 1e-9) cold.push([T, r]); else if (T <= b + 1e-9) liq.push([T, r]); else hot.push([T, r]);
        }
        if (cold.length && liq.length) cold.push(liq[0]);
        if (hot.length && liq.length) hot.unshift(liq[liq.length - 1]);
        let best = 0, bt = null;
        for (let T = a; T <= b; T += 0.002) { const r = 1 / vol(T, e); if (r > best) { best = r; bt = T; } }
        const inside = bt != null && bt > a + 0.02 && bt < b - 0.02;
        const series = [{ pts: liq, label: 'liquid' }];
        if (cold.length > 1) series.push({ pts: cold, label: 'below freezing (solid in reality)', dash: [4, 4] });
        if (hot.length > 1) series.push({ pts: hot, label: 'above boiling (gas in reality)', dash: [4, 4] });
        plot.set({ series, marks: inside ? [{ x: bt, y: best, label: 'maximum at T = ' + bt.toFixed(2), color: kit.colors().warn }] : [], vlines: [{ x: a, label: 'freezes' }, { x: b, label: 'boils' }], x: { label: 'temperature (reduced units)', min: 0.2, max: 4.2 }, y: { label: 'density (reduced units)' } });
        ro.set('rng', a.toFixed(2) + ' to ' + b.toFixed(2));
        ro.set('max', inside ? 'at T = ' + bt.toFixed(2) + ' (' + ((bt - a) / (b - a) * 100).toFixed(0) + ' % of the way up the liquid range)' : 'none inside the liquid range');
        ro.set('say', inside ? 'water-like: a density maximum' : e < 1 ? 'bond too weak: ordinary liquid' : 'bond too strong: viscous network liquid');
      }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors();
        stepCells(set, Math.min(dt, 0.05));
        const xo = xO(V.T, V.e);
        drawCells(kit, c, set, { x: 14, y: 12, w: Math.min(st.W * 0.55, 330), h: st.H - 40 }, xo, 12, t || 0, 'T = ' + V.T.toFixed(2) + ', ε = ' + V.e.toFixed(2));
        const bx = Math.min(st.W * 0.55, 330) + 40, bw = st.W - bx - 18;
        if (bw > 60) {
          kit.label(c, 'open share', bx, 24, { color: C.muted, size: 12 });
          c.fillStyle = C.grid; c.fillRect(bx, 36, bw, 16);
          c.fillStyle = C.accent; c.fillRect(bx, 36, bw * xo, 16);
          kit.label(c, (100 * xo).toFixed(0) + ' %', bx + bw * xo + 6, 44, { color: C.text, size: 12, baseline: 'middle' });
        }
        ro.set('open', (100 * xo).toFixed(0) + ' %');
      }, box.stage);
      draw(); loop.start();
    }
  });

  /* ================================================================ a proton and a deuteron in the O–H well */
  Hyper.sim('anom-zero-point', {
    title: 'Zero-point energy: H against D',
    blurb: `The O–H bond as a **Morse** well (depth 515 kJ/mol, stiffness set so that ordinary hydrogen vibrates at the water-molecule stretch of about 3,650 cm⁻¹). A quantum oscillator can never sit at the bottom: its lowest level lies a half-quantum above it. Heavier deuterium vibrates more slowly, so its lowest level is lower and its position is sharper. Hydrogen bonding softens the O–H stretch, which is why the bond in liquid water absorbs near 3,400 cm⁻¹ rather than 3,650.

**Try this**
- Switch from H to D: the zero-point energy falls from about 22.6 to about 16.5 kJ/mol, and the frequency by a factor of 1.37 (the square root of the mass ratio, nearly).
- Soften the bond by 14 %: the frequency drops towards 3,400 cm⁻¹ and the zero-point energy by about 1.5 kJ/mol — the H-bonded proton is less confined.
- Read the tunnelling line: through the same 0.3 Å, 30 kJ/mol barrier a proton goes some twenty times more easily than a deuteron (a rough WKB estimate with a rectangular barrier).
- Tritium continues the trend: lower again.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'iso', type: 'select', label: 'Hydrogen isotope', options: [['Hydrogen, H', 1], ['Deuterium, D', 2], ['Tritium, T', 3]], value: params.iso || 1 },
        { id: 'soft', label: 'Softening of the bond by hydrogen bonding', min: 0, max: 25, step: 0.5, value: params.soft || 0, unit: '% of stiffness' },
        { id: 'cmp', type: 'check', label: 'Show ordinary hydrogen for comparison', value: true }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['nu', 'Fundamental frequency'], ['zpe', 'Zero-point energy'], ['dz', 'Compared with ordinary H'], ['sig', 'Spread of the proton position'], ['tun', 'Tunnelling rate, relative to H']]);
      const amu = 1.66053907e-27, hbar = 1.054571817e-34, cc = 2.99792458e10, NA = 6.02214076e23, h = 6.62607015e-34;
      const mO = 15.9949, MASS = { 1: 1.00783, 2: 2.01410, 3: 3.01605 };
      const De = 515e3 / NA, re = 0.9584;
      const kH = (() => { const mu = mO * MASS[1] / (mO + MASS[1]) * amu, w = 2 * Math.PI * cc * 3828; return mu * w * w; })();
      function levels(iso, soft) {
        const m = MASS[iso], mu = mO * m / (mO + m) * amu, k = kH * (1 - soft / 100), w = Math.sqrt(k / mu);
        const a = Math.sqrt(k / (2 * De)) * 1e-10;    // per Å
        const E = n => { const q = hbar * w * (n + 0.5); return q - q * q / (4 * De); };
        const sig = Math.sqrt(hbar / (2 * mu * w)) * 1e10;
        return { E, a, sig, mu, w, k, m, nu: (E(1) - E(0)) / (h * cc), zpe: E(0) * NA / 1000 };
      }
      const tunnel = (m, soft) => { const V0 = 30e3 / NA, wd = 0.3e-10; return Math.exp(-2 / hbar * wd * Math.sqrt(2 * m * amu * V0)); };
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors();
        const L = levels(V.iso, V.soft), H = levels(1, V.soft);
        const x0 = 56, x1 = st.W - 20, y0 = 20, y1 = st.H - 40, r0 = 0.78, r1 = 1.9, EM = 140;
        const X = r => x0 + (r - r0) / (r1 - r0) * (x1 - x0), Y = e => y1 - clamp(e, 0, EM) / EM * (y1 - y0);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, y1); c.lineTo(x1, y1); c.stroke();
        kit.label(c, 'O–H distance (Å)', x1, st.H - 4, { color: C.muted, size: 11.5, align: 'right', baseline: 'bottom' });
        kit.label(c, 'energy (kJ/mol)', 6, y0 - 6, { color: C.muted, size: 11.5, baseline: 'top' });
        for (let r = 1; r <= 1.8; r += 0.2) { kit.label(c, r.toFixed(1), X(r), y1 + 5, { color: C.muted, size: 10.5, align: 'center', baseline: 'top' }); }
        for (let e = 0; e <= EM; e += 40) kit.label(c, String(e), x0 - 5, Y(e), { color: C.muted, size: 10.5, align: 'right', baseline: 'middle' });
        // the well, for the chosen stiffness
        c.beginPath();
        for (let r = r0; r <= r1; r += 0.01) { const e = De * NA / 1000 * Math.pow(1 - Math.exp(-L.a * (r - re)), 2); if (r === r0) c.moveTo(X(r), Y(e)); else c.lineTo(X(r), Y(e)); }
        c.strokeStyle = C.text; c.lineWidth = 2; c.stroke();
        const drawLevels = (Lv, col, dash, wide) => {
          for (let n = 0; n < 4; n++) {
            const e = Lv.E(n) * NA / 1000; if (e > EM) break;
            // the classical turning points of this level in the Morse well
            const q = Math.sqrt(Math.max(0, e * 1000 / NA / De)), a = Lv.a;
            const rl = re - Math.log(1 + q) / a, rr = re - Math.log(Math.max(1e-6, 1 - q)) / a;
            c.beginPath(); c.moveTo(X(clamp(rl, r0, r1)), Y(e)); c.lineTo(X(clamp(rr, r0, r1)), Y(e));
            c.setLineDash(dash); c.strokeStyle = col; c.lineWidth = wide && n === 0 ? 3 : 1.5; c.stroke(); c.setLineDash([]);
            if (!dash.length) kit.label(c, 'n = ' + n, X(clamp(rr, r0, r1)) + 6, Y(e), { color: col, size: 10.5, baseline: 'middle' });
          }
        };
        if (V.cmp && V.iso !== 1) drawLevels(H, C.faint, [5, 4], false);
        drawLevels(L, C.accent, [], true);
        // the ground-state probability of the position, a Gaussian
        const e0 = L.E(0) * NA / 1000;
        c.beginPath();
        for (let r = r0; r <= r1; r += 0.005) { const g = Math.exp(-Math.pow(r - re, 2) / (2 * L.sig * L.sig)); const y = Y(e0) - g * 34; if (r === r0) c.moveTo(X(r), y); else c.lineTo(X(r), y); }
        c.lineTo(X(r1), Y(e0)); c.lineTo(X(r0), Y(e0)); c.closePath(); c.fillStyle = 'rgba(120,150,255,0.30)'; c.fill();
        // the zero-point energy: the gap between the bottom of the well and level 0
        kit.arrow(c, X(r0) + 30, Y(0), X(r0) + 30, Y(e0), C.warn, 2);
        kit.label(c, 'zero-point energy ' + L.zpe.toFixed(1) + ' kJ/mol', X(r0) + 38, Y(e0 / 2), { color: C.warn, size: 12, baseline: 'middle' });
        kit.label(c, 'ground-state position (schematic Gaussian)', X(re) + 6, Y(e0) - 40, { color: C.muted, size: 11 });
        ro.set('nu', L.nu.toFixed(0) + ' cm⁻¹');
        ro.set('zpe', L.zpe.toFixed(2) + ' kJ/mol');
        ro.set('dz', (L.zpe - H.zpe >= 0 ? '+' : '') + (L.zpe - H.zpe).toFixed(2) + ' kJ/mol, frequency × ' + (L.nu / H.nu).toFixed(3));
        ro.set('sig', L.sig.toFixed(3) + ' Å (H: ' + H.sig.toFixed(3) + ')');
        const tr = tunnel(L.m, V.soft) / tunnel(MASS[1], V.soft);
        ro.set('tun', (tr >= 0.01 ? tr.toFixed(3) : tr.toExponential(1)) + ' × (0.3 Å, 30 kJ/mol barrier)');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ if the hydrogen bond were stronger or weaker */
  Hyper.sim('anom-bond-dial', {
    title: 'Turn the hydrogen bond up or down',
    blurb: `A **scaling argument**, not a calculation. Hold the molecule and the planet fixed and multiply the strength of the hydrogen bond by a factor. If nothing else changes, every temperature that marks a change of state — freezing, boiling, the density maximum — scales with it, because they are all set by the ratio of the bond energy to the thermal energy. The dial shows where the liquid range of such a "water" would fall, against the temperatures of our own planet. In reality other things shift too; the point is how narrow the window is.

**Try this**
- At 1.00 the liquid range is 273–373 K and Earth's mean surface (288 K) sits in it.
- Weaken the bond by a quarter (0.75): the "water" would boil at 280 K and the average surface would be steam.
- Strengthen it by 6 % (1.06): it melts at 290 K, and the average surface is ice.
- Read the lifetime of a bond at 15 °C: at 0.6 it is far shorter than a picosecond (a thin, runny, short-ranged liquid); at 1.5 it is ten times longer (a thick, glassy one).`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 's', label: 'Hydrogen-bond strength, relative to water\'s', min: 0.5, max: 1.6, step: 0.01, value: params.s || 1, unit: '×' }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['E', 'Bond energy'], ['r', 'Liquid range'], ['tau', 'Bond lifetime at 15 °C'], ['ratio', 'Bond energy ÷ thermal energy at 15 °C'], ['earth', 'Earth\'s mean surface, 15 °C'], ['sea', 'The oceans, −2 to 30 °C'], ['life', 'Share of life\'s range (−20 to 122 °C) in the liquid range']]);
      const T0 = 273.15, T1 = 373.15;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const x0 = 56, x1 = st.W - 130, y0 = 18, y1 = st.H - 42, s0 = 0.5, s1 = 1.6, TL = 100, TH = 650;
        const X = s => x0 + (s - s0) / (s1 - s0) * (x1 - x0), Y = T => y1 - (T - TL) / (TH - TL) * (y1 - y0);
        // the liquid range for every strength
        c.beginPath(); c.moveTo(X(s0), Y(T0 * s0)); c.lineTo(X(s1), Y(T0 * s1)); c.lineTo(X(s1), Y(T1 * s1)); c.lineTo(X(s0), Y(T1 * s0)); c.closePath();
        c.fillStyle = 'rgba(80,150,235,0.22)'; c.fill();
        c.strokeStyle = C.accent; c.lineWidth = 1.8;
        c.beginPath(); c.moveTo(X(s0), Y(T0 * s0)); c.lineTo(X(s1), Y(T0 * s1)); c.stroke();
        c.beginPath(); c.moveTo(X(s0), Y(T1 * s0)); c.lineTo(X(s1), Y(T1 * s1)); c.stroke();
        // Earth's temperatures
        c.fillStyle = 'rgba(60,190,120,0.22)'; c.fillRect(x0, Y(303.15), x1 - x0, Y(271.3) - Y(303.15));
        c.setLineDash([5, 4]); c.strokeStyle = C.ok; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, Y(288.15)); c.lineTo(x1, Y(288.15)); c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, y1); c.lineTo(x1, y1); c.stroke();
        for (let s = 0.6; s <= 1.6; s += 0.2) kit.label(c, s.toFixed(1), X(s), y1 + 5, { color: C.muted, size: 11, align: 'center', baseline: 'top' });
        for (let T = 200; T <= 600; T += 100) kit.label(c, String(T), x0 - 5, Y(T), { color: C.muted, size: 11, align: 'right', baseline: 'middle' });
        kit.label(c, 'bond strength ×', x1, st.H - 4, { color: C.muted, size: 11.5, align: 'right', baseline: 'bottom' });
        kit.label(c, 'temperature (K)', 6, y0 - 8, { color: C.muted, size: 11.5, baseline: 'top' });
        kit.label(c, 'freezing', x1 + 6, Y(T0 * s1), { color: C.accent, size: 11.5, baseline: 'middle' });
        kit.label(c, 'boiling', x1 + 6, Y(T1 * s1), { color: C.accent, size: 11.5, baseline: 'middle' });
        kit.label(c, 'liquid', X(1.35), Y((T0 + T1) / 2 * 1.35), { color: C.accent, size: 13, align: 'center', weight: 650 });
        kit.label(c, 'Earth: 288 K mean, oceans 271–303 K', x0 + 8, Y(303.15) - 8, { color: C.ok, size: 11.5 });
        // the chosen strength
        const s = V.s, Tm = T0 * s, Tb = T1 * s;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X(s), y0); c.lineTo(X(s), y1); c.stroke();
        for (const T of [Tm, Tb]) { c.beginPath(); c.arc(X(s), Y(T), 5, 0, TAU); c.fillStyle = C.text; c.fill(); }
        kit.label(c, 'actual water', X(1), y0 + 4, { color: C.muted, size: 11, align: 'center' });
        // read-outs
        const mean = 288.15;
        ro.set('E', (20 * s).toFixed(1) + ' kJ/mol');
        ro.set('r', Tm.toFixed(0) + ' to ' + Tb.toFixed(0) + ' K  (' + (Tm - T0).toFixed(0) + ' to ' + (Tb - T0).toFixed(0) + ' °C)');
        const tau15 = W.hbondLifetime(15) * 1e12 * Math.exp((s - 1) * 10000 / (Rg * mean));
        ro.set('tau', (tau15 >= 0.01 ? tau15.toFixed(2) : tau15.toExponential(1)) + ' ps (scaled by an Arrhenius estimate)');
        ro.set('ratio', (20000 * s / (Rg * mean)).toFixed(1));
        ro.set('earth', mean < Tm ? 'frozen: an ice world' : mean > Tb ? 'boiled: a vapour world' : 'liquid');
        const polar = 271.3, tropic = 303.15;
        ro.set('sea', Tm > tropic ? 'frozen solid everywhere' : Tb < polar ? 'vapour everywhere' : (Tm > polar ? 'frozen towards the poles' : 'liquid at the poles') + (Tb < tropic ? ', boiling in the tropics' : ', liquid in the tropics'));
        const lo = Math.max(Tm, 253.15), hi = Math.min(Tb, 395.15);
        ro.set('life', (100 * Math.max(0, hi - lo) / (395.15 - 253.15)).toFixed(0) + ' %');
      }, box.stage);
      loop.start();
    }
  });
})();
