/* HYPER-MEDICINE · sims/respiratory.js — lungs and breathing:
 * the mechanics of a breath (Boyle, compliance, resistance, pneumothorax), a spirometer
 * (volume–time and flow–volume curves), oxygen crossing an alveolar capillary, matching
 * ventilation to perfusion (shunt, low V/Q, dead space), the oxygen–haemoglobin curve with
 * content and delivery, the chemical control of breathing (CO2, sedation, altitude),
 * an asthmatic airway (resistance ∝ 1/r⁴) and lung function across a lifetime of smoking.
 * All the physiology is simplified and schematic; the oxygen chemistry comes from kit.med. */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, u) => a + (b - a) * u;
  const r0 = (v, d) => { const k = Math.pow(10, d || 0); return Math.round(v * k) / k; };

  /* a root of fn on [lo, hi] (fn changes sign there) */
  function bisect(fn, lo, hi, n) {
    let flo = fn(lo);
    for (let i = 0; i < (n || 50); i++) {
      const m = (lo + hi) / 2, fm = fn(m);
      if ((fm > 0) === (flo > 0)) { lo = m; flo = fm; } else hi = m;
    }
    return (lo + hi) / 2;
  }

  /* the colour of blood from its saturation (0–1): dark purplish-red to bright red */
  function blood(C, s) {
    const u = clamp((s - 0.35) / 0.63, 0, 1);
    const L = C.dark ? lerp(36, 58, u) : lerp(27, 47, u);
    return 'hsl(' + lerp(328, 357, u).toFixed(0) + ' ' + lerp(42, 85, u).toFixed(0) + '% ' + L.toFixed(0) + '%)';
  }

  /* a hand-drawn graph frame on the stage; returns the mapping X(v), Y(v) */
  function frame(c, kit, C, b, xr, yr, o) {
    o = o || {};
    const X = v => b.x + (v - xr[0]) / (xr[1] - xr[0]) * b.w;
    const Y = v => b.y + b.h - (v - yr[0]) / (yr[1] - yr[0]) * b.h;
    c.save();
    c.strokeStyle = C.grid; c.lineWidth = 1; c.fillStyle = C.muted;
    c.font = '10.5px system-ui, sans-serif';
    const xs = o.xstep || Hyper.niceStep(xr[1] - xr[0], o.xn || 5), ys = o.ystep || Hyper.niceStep(yr[1] - yr[0], o.yn || 5);
    c.textAlign = 'center'; c.textBaseline = 'top';
    if (xs > 0) for (let k = Math.ceil(xr[0] / xs - 1e-9); k * xs <= xr[1] + 1e-9; k++) {
      const v = k * xs; c.beginPath(); c.moveTo(X(v), b.y); c.lineTo(X(v), b.y + b.h); c.stroke();
      c.fillText(o.xfmt ? o.xfmt(v) : String(r0(v, 3)), X(v), b.y + b.h + 4);
    }
    c.textAlign = 'right'; c.textBaseline = 'middle';
    if (ys > 0) for (let k = Math.ceil(yr[0] / ys - 1e-9); k * ys <= yr[1] + 1e-9; k++) {
      const v = k * ys; c.beginPath(); c.moveTo(b.x, Y(v)); c.lineTo(b.x + b.w, Y(v)); c.stroke();
      c.fillText(o.yfmt ? o.yfmt(v) : String(r0(v, 3)).replace('-', '−'), b.x - 5, Y(v));
    }
    c.strokeStyle = C.axis; c.lineWidth = 1.2;
    const zy = yr[0] < 0 && yr[1] > 0 ? Y(0) : b.y + b.h;
    c.beginPath(); c.moveTo(b.x, zy); c.lineTo(b.x + b.w, zy); c.moveTo(b.x, b.y); c.lineTo(b.x, b.y + b.h); c.stroke();
    c.restore();
    if (o.xlabel) kit.label(c, o.xlabel, b.x + b.w, b.y + b.h + 25, { size: 11, color: C.text2, align: 'right' });
    if (o.ylabel) kit.label(c, o.ylabel, b.x - 2, b.y - 11, { size: 11, color: C.text2 });
    return { X, Y };
  }
  function polyline(c, pts, X, Y, col, w, dash) {
    if (pts.length < 2) return;
    c.save(); c.strokeStyle = col; c.lineWidth = w || 2; c.setLineDash(dash || []); c.lineJoin = 'round';
    c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke(); c.restore();
  }
  function graphBox(box) {
    const g = document.createElement('div');
    g.style.padding = '4px 10px 10px';
    box.stage.appendChild(g);
    return g;
  }

  /* ================================================================ 1. the mechanics of a breath */
  Hyper.sim('resp-breath', {
    title: 'A breath, step by step',
    blurb: `The diaphragm and rib muscles enlarge the chest; the pleural pressure (orange) becomes more negative, the lungs follow, the gas inside expands and its pressure (blue) dips just below the air outside — **Boyle's law** — so air flows in. Breathing out at rest is the stretched lung springing back. Pressures are in cmH₂O relative to the atmosphere.

- Watch how small the alveolar pressure swing is: about 1 cmH₂O, a thousandth of an atmosphere.
- **Stiff lungs** (low compliance, as in fibrosis): the same effort moves far less air, so breathing becomes fast and shallow.
- **Narrow airways** (high resistance, as in an asthma attack): the lungs cannot empty before the next breath, and air is trapped — the baseline creeps up.
- Tick **pneumothorax**: with air in the pleural space, the right lung's own recoil collapses it and it no longer follows the chest.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'effort', label: 'Breathing effort (muscle pressure)', min: 0, max: 20, step: 0.5, value: 5, unit: 'cmH₂O' },
        { id: 'rate', label: 'Breathing rate', min: 6, max: 40, step: 1, value: 12, unit: '/min' },
        { id: 'cl', label: 'Lung compliance (stretchiness)', min: 40, max: 400, value: 200, unit: 'mL/cmH₂O', log: true, sig: 2 },
        { id: 'raw', label: 'Airway resistance', min: 0.5, max: 25, value: 2, unit: 'cmH₂O·s/L', log: true, sig: 2 },
        { id: 'ptx', type: 'check', label: 'Air in the right pleural space (pneumothorax)', value: false },
        { type: 'buttons', items: [{ id: 'healthy', label: 'Healthy', primary: true }, { id: 'stiff', label: 'Stiff lungs' }, { id: 'narrow', label: 'Narrow airways' }] }
      ], id => {
        if (id === 'healthy') { ctl.set('cl', 200); ctl.set('raw', 2); ctl.set('effort', 5); ctl.set('rate', 12); ctl.set('ptx', false); }
        else if (id === 'stiff') { ctl.set('cl', 60); ctl.set('raw', 2); ctl.set('effort', 9); ctl.set('rate', 24); }
        else if (id === 'narrow') { ctl.set('cl', 200); ctl.set('raw', 15); ctl.set('effort', 9); ctl.set('rate', 22); }
      });
      const ro = kit.readout(box.side, [['vt', 'Tidal volume'], ['ve', 'Minute ventilation'], ['palv', 'Alveolar pressure'], ['ppl', 'Pleural pressure'], ['flow', 'Peak flow in'], ['tau', 'Time constant R × C'], ['trap', 'Air trapped at the end of a breath']]);
      const V = ctl.values;
      const CCW = 0.2, PTP0 = 5;                 // chest wall compliance (L/cmH2O); lung recoil at FRC (cmH2O)
      let t = 0, vol = 0, flow = 0, palv = 0, ppl = -PTP0, pm = 0, collapse = 0, hist = [], acc = 0;
      let cyc = { vmax: -1e9, vmin: 1e9, amin: 0, amax: 0, pmin: 0, pmax: 0, fmax: 0, v0: 0 }, last = null, prevPh = 0;
      function step(dt) {
        const h = 0.002;
        const cl = V.cl / 1000, crs = 1 / (1 / cl + 1 / CCW), R = V.raw, T = 60 / V.rate, Ti = 0.38 * T;
        for (let s = 0; s < dt - 1e-9; s += h) {
          t += h;
          const ph = t % T;
          if (ph < prevPh) {                        // a new breath starts: close the books on the last one
            last = { vt: cyc.vmax - cyc.vmin, amin: cyc.amin, amax: cyc.amax, pmin: cyc.pmin, pmax: cyc.pmax, fmax: cyc.fmax, trap: vol };
            cyc = { vmax: vol, vmin: vol, amin: palv, amax: palv, pmin: ppl, pmax: ppl, fmax: 0 };
          }
          prevPh = ph;
          pm = ph < Ti ? V.effort * (1 - Math.cos(Math.PI * ph / Ti)) / 2 : V.effort * Math.exp(-(ph - Ti) / 0.45);
          const vn = (vol + h * pm / R) / (1 + h / (R * crs));   // R dV/dt = Pmus − V/Crs, semi-implicit
          flow = (vn - vol) / h; vol = vn;
          palv = -R * flow;
          ppl = palv - (PTP0 + vol / cl);
          collapse += ((V.ptx ? 1 : 0) - collapse) * Math.min(1, h / 0.8);
          const mouth = V.ptx ? vol / 2 : vol;
          cyc.vmax = Math.max(cyc.vmax, mouth); cyc.vmin = Math.min(cyc.vmin, mouth);
          cyc.amin = Math.min(cyc.amin, palv); cyc.amax = Math.max(cyc.amax, palv);
          cyc.pmin = Math.min(cyc.pmin, ppl); cyc.pmax = Math.max(cyc.pmax, ppl);
          cyc.fmax = Math.max(cyc.fmax, V.ptx ? flow / 2 : flow);
          acc += h;
          if (acc >= 0.02) { acc = 0; hist.push([t, mouth * 1000, palv, ppl]); }
        }
        hist = hist.filter(p => p[0] > t - 10);
      }
      function report() {
        const L = last;
        if (!L) { ['vt', 've', 'palv', 'ppl', 'flow', 'trap'].forEach(k => ro.set(k, '…')); }
        else {
          ro.set('vt', Math.round(L.vt * 1000) + ' mL' + (V.ptx ? ' (left lung only)' : ''));
          ro.set('ve', kit.fmt(L.vt * V.rate, 3) + ' L/min');
          ro.set('palv', kit.fmt(L.amin, 2) + ' to +' + kit.fmt(Math.max(0, L.amax), 2) + ' cmH₂O');
          ro.set('ppl', kit.fmt(L.pmin, 3) + ' to ' + kit.fmt(L.pmax, 3) + ' cmH₂O');
          ro.set('flow', kit.fmt(L.fmax, 2) + ' L/s');
          ro.set('trap', L.trap > 0.02 ? Math.round(L.trap * 1000) + ' mL — not enough time to empty' : 'none');
        }
        const cl = V.cl / 1000, crs = 1 / (1 / cl + 1 / CCW);
        ro.set('tau', kit.fmt(V.raw * crs, 2) + ' s (breathing out takes about 3 of these)');
      }
      function lungPath(c, x0, y0, w, hgt, side) {
        // a lung: flat inner edge by the heart, rounded outer edge, a dome at the base
        const xi = side < 0 ? x0 + w : x0, xo = side < 0 ? x0 : x0 + w;
        c.beginPath();
        c.moveTo(xi, y0 + hgt * 0.15);
        c.quadraticCurveTo(xi - side * w * 0.05, y0, (xi + xo) / 2, y0);
        c.quadraticCurveTo(xo, y0 + hgt * 0.05, xo, y0 + hgt * 0.55);
        c.quadraticCurveTo(xo, y0 + hgt, (xi + xo) / 2 + side * w * 0.1, y0 + hgt * 0.97);
        c.quadraticCurveTo(xi + side * w * 0.05, y0 + hgt * 0.9, xi, y0 + hgt * 0.8);
        c.closePath();
      }
      function draw(dt) {
        step(Math.min(dt || 0, 0.05));
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const wide = W > 520;
        const LW = wide ? Math.min(W * 0.46, 380) : W, cx = LW / 2;
        const lungH = wide ? Hh * 0.9 : Hh * 0.52;
        // the chest: grows a little with the volume (exaggerated so it can be seen)
        const ex = clamp(vol / 0.5, -1.5, 3);
        const top = lungH * 0.2, base = lungH * 0.9, halfW = Math.min(LW * 0.4, lungH * 0.5) * (1 + 0.035 * ex);
        const domeTop = base - lungH * 0.2 * (1 - 0.22 * ex);
        // chest wall
        c.strokeStyle = C.text2; c.lineWidth = 3;
        c.beginPath();
        c.moveTo(cx - halfW * 0.55, top);
        c.quadraticCurveTo(cx - halfW * 1.05, top + (base - top) * 0.25, cx - halfW, base);
        c.moveTo(cx + halfW * 0.55, top);
        c.quadraticCurveTo(cx + halfW * 1.05, top + (base - top) * 0.25, cx + halfW, base);
        c.stroke();
        c.strokeStyle = C.faint; c.lineWidth = 1.5;               // ribs
        for (let k = 1; k <= 5; k++) {
          const y = top + (base - top) * k / 6.3, w0 = halfW * (0.72 + 0.28 * Math.min(1, k / 3));
          c.beginPath(); c.moveTo(cx - w0, y); c.quadraticCurveTo(cx, y + 10 + 3 * ex, cx + w0, y); c.stroke();
        }
        // diaphragm
        c.strokeStyle = kit.hue(28); c.lineWidth = 4;
        c.beginPath(); c.moveTo(cx - halfW, base); c.quadraticCurveTo(cx, 2 * domeTop - base, cx + halfW, base); c.stroke();
        kit.label(c, 'diaphragm', cx + halfW + 4, base - 4, { size: 11, color: kit.hue(28) });
        // lungs
        const gap = 5, lw = halfW * 0.86, lh = domeTop - top - 6;
        const pleuraFill = C.dark ? 'rgba(120,180,255,0.10)' : 'rgba(40,110,200,0.08)';
        for (const side of [-1, 1]) {
          const x0 = side < 0 ? cx - lw - 6 : cx + 6;
          c.fillStyle = pleuraFill;
          lungPath(c, x0 - (side < 0 ? gap : 0), top + 10 - gap, lw + gap, lh + gap * 2, side); c.fill();
          const k = side > 0 ? collapse : 0;                       // the right lung collapses towards its root
          const w1 = lw * (1 - 0.5 * k), h1 = lh * (1 - 0.45 * k);
          lungPath(c, x0, top + 10 + (lh - h1) * 0.45, w1, h1, side);
          c.fillStyle = C.dark ? 'hsl(350 45% 36%)' : 'hsl(350 60% 80%)'; c.fill();
          c.strokeStyle = C.dark ? 'hsl(350 50% 60%)' : 'hsl(350 45% 55%)'; c.lineWidth = 1.5; c.stroke();
          if (side > 0 && collapse > 0.05) {
            c.globalAlpha = collapse; kit.label(c, 'air', x0 + lw * 0.75, top + lh * 0.55, { size: 12, weight: 650, color: C.warn, align: 'center' }); c.globalAlpha = 1;
          }
        }
        // the airway
        const ty0 = 4, ty1 = top + 14;
        c.strokeStyle = C.muted; c.lineWidth = 7; c.lineCap = 'round';
        c.beginPath(); c.moveTo(cx, ty0); c.lineTo(cx, ty1); c.moveTo(cx, ty1); c.lineTo(cx - lw * 0.35, top + lh * 0.3); c.moveTo(cx, ty1); c.lineTo(cx + lw * 0.35 * (1 - 0.4 * collapse), top + lh * 0.3); c.stroke();
        c.lineCap = 'butt';
        const fl = V.ptx ? flow / 2 : flow;
        if (Math.abs(fl) > 0.02) {
          const len = clamp(Math.abs(fl) * 40, 6, 44), col = fl > 0 ? kit.hue(215) : C.muted;
          const ya = ty0 + 4, yb = ya + len;
          if (fl > 0) kit.arrow(c, cx + 14, ya, cx + 14, yb, col, 2.5); else kit.arrow(c, cx + 14, yb, cx + 14, ya, col, 2.5);
          kit.label(c, fl > 0 ? 'air in' : 'air out', cx + 22, ya + len / 2, { size: 11, color: col });
        }
        // pressures written on the picture
        kit.label(c, 'P alveolar ' + (palv >= 0 ? '+' : '−') + Math.abs(palv).toFixed(1), cx - lw * 0.5 - 6, top + lh * 0.55, { size: 11.5, weight: 600, color: kit.hue(215), align: 'center', bg: C.bg2 });
        kit.label(c, 'P pleural ' + (ppl >= 0 ? '+' : '−') + Math.abs(ppl).toFixed(1), cx - halfW - 2, top + (base - top) * 0.08, { size: 11.5, weight: 600, color: C.warn, align: 'center', bg: C.bg2 });
        if (V.ptx) kit.label(c, 'right pleura: 0 (open)', cx + halfW * 0.6, top + (base - top) * 0.08, { size: 11, color: C.warn, align: 'center', bg: C.bg2 });
        kit.label(c, 'muscle ' + pm.toFixed(1) + ' cmH₂O', cx, base + 16, { size: 11, color: C.muted, align: 'center' });
        // strip charts: the last 10 seconds
        const gx = wide ? LW + 44 : 44, gw = W - gx - 12;
        const gy0 = wide ? 18 : lungH + 16, gh = wide ? (Hh - 70) / 2 : (Hh - gy0 - 56) / 2;
        const vmax = Math.max(800, ...hist.map(p => p[1] + 50)), vmin = Math.min(0, ...hist.map(p => p[1] - 20));
        const f1 = frame(c, kit, C, { x: gx, y: gy0, w: gw, h: gh }, [t - 10, t], [vmin, vmax], { ylabel: 'volume in (mL)', xfmt: () => '' });
        polyline(c, hist.map(p => [p[0], p[1]]), f1.X, f1.Y, C.ok, 2.2);
        const pmin = Math.min(-10, ...hist.map(p => p[3] - 1)), pmax = Math.max(3, ...hist.map(p => p[2] + 1));
        const f2 = frame(c, kit, C, { x: gx, y: gy0 + gh + 30, w: gw, h: gh }, [t - 10, t], [pmin, pmax], { ylabel: 'pressure (cmH₂O)', xfmt: v => String(Math.round(v - t)) + ' s', xstep: 2 });
        polyline(c, hist.map(p => [p[0], p[2]]), f2.X, f2.Y, kit.hue(215), 2.2);
        polyline(c, hist.map(p => [p[0], p[3]]), f2.X, f2.Y, C.warn, 2.2);
        kit.label(c, 'alveolar', gx + gw - 4, f2.Y(pmax) + 8, { size: 11, color: kit.hue(215), align: 'right' });
        kit.label(c, 'pleural', gx + gw - 60, f2.Y(pmax) + 8, { size: 11, color: C.warn, align: 'right' });
        report();
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 2. a spirometer */
  const SPIRO = [
    ['Healthy adult', 'healthy', { pre: [[0.8, 3.95], [0.13, 0.66]] }],
    ['Asthma, during symptoms', 'asthma', { pre: [[0.45, 2.1, 2.1], [0.13, 0.6, 2.4]], post: [[0.7, 3.2, 0.8], [0.13, 0.62, 1.4]] }],
    ['COPD, moderate', 'copd', { pre: [[0.35, 1.75, 2.0], [0.12, 0.55, 3.0]], post: [[0.38, 1.9, 1.95], [0.12, 0.55, 2.7]] }],
    ['COPD, severe', 'copd-severe', { pre: [[0.18, 0.95, 2.3], [0.12, 0.5, 4.2]], post: [[0.2, 1.05, 2.25], [0.12, 0.5, 3.9]] }],
    ['Stiff lungs (pulmonary fibrosis)', 'restrictive', { pre: [[0.6, 2.1], [0.1, 0.42]] }],
    ['Narrowed windpipe', 'trachea', { pre: [[0.8, 3.95], [0.13, 0.66]], cap: 3.2 }],
    ['A poor blow (slow start, stopped early)', 'effort', { pre: [[0.8, 3.95], [0.13, 0.66]], rise: 0.35, gmax: 0.8, stop: 2.5 }]
  ];
  const PRED = { fev1: 3.9, fvc: 4.8, pef: 9.0 };   // an illustrative reference adult
  /* a forced expiration: each lung region empties exponentially (volume F, time constant tau) */
  function blow(F, tau, o) {
    o = o || {};
    const rise = o.rise || 0.035, stop = o.stop || 6, gmax = o.gmax || 1, cap = o.cap || Infinity, dt = 0.005;
    const rem = F.slice(), pts = [[0, 0, 0]];
    let t = 0, v = 0, pef = 0, tpef = 0, fev1 = null;
    while (t < stop - 1e-9) {
      const g = gmax * (1 - Math.exp(-(t + dt / 2) / rise));
      const q = rem.map((r, i) => r / tau[i] * g);
      let fl = q.reduce((a, b) => a + b, 0);
      const k = fl > cap ? cap / fl : 1;
      fl *= k;
      q.forEach((qi, i) => { rem[i] = Math.max(0, rem[i] - qi * k * dt); });
      v += fl * dt; t += dt;
      if (fl > pef) { pef = fl; tpef = t; }
      if (fev1 == null && t >= 1 - 1e-9) fev1 = v;
      pts.push([t, v, fl]);
    }
    if (fev1 == null) fev1 = v;
    const pif = Math.min(cap, 1.3 * v);                 // the breath back in, drawn below the axis
    const insp = [];
    for (let k = 0; k <= 40; k++) { const x = k / 40; insp.push([v * (1 - x), -Math.min(cap, pif * Math.pow(Math.sin(Math.PI * x), 0.7))]); }
    return { pts, insp, fev1, fvc: v, pef, tpef, stop };
  }
  Hyper.sim('resp-spirometer', {
    title: 'Spirometry: blowing out hard',
    blurb: `A forced breath out, drawn two ways: **volume against time** (left; FEV₁ is the volume at 1 second, FVC the total) and **flow against volume** (right; the peak is the peak expiratory flow, and the loop below the axis is the breath back in). The model empties the lung as a few regions, each like a leaky balloon with its own time constant. The dashed curve is a healthy lung of the same size and age.

- **Asthma**: tick **After a bronchodilator** — the curve largely recovers (reversible obstruction).
- **COPD**: the flow–volume curve is scooped and hardly changes after a bronchodilator; FEV₁/FVC stays below 0.70.
- **Stiff lungs**: a small but normally shaped curve — FEV₁/FVC is normal or high.
- **Narrowed windpipe**: the peak is cut off flat, breathing out *and* in.
- **A poor blow** can mimic disease; the rounded, late peak gives it away.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const p0 = params && SPIRO.some(s => s[1] === params.pattern) ? params.pattern : 'healthy';
      const ctl = kit.controls(box.side, [
        { id: 'pattern', type: 'select', label: 'Lungs', options: SPIRO.map(s => [s[0], s[1]]), value: p0 },
        { id: 'bd', type: 'check', label: 'After a bronchodilator', value: false },
        { id: 'ref', type: 'check', label: 'Show a healthy curve', value: true },
        { type: 'buttons', items: [{ id: 'go', label: 'Blow again', primary: true }] }
      ], () => build());
      const ro = kit.readout(box.side, [['fev1', 'FEV₁'], ['fvc', 'FVC'], ['ratio', 'FEV₁/FVC'], ['pef', 'Peak expiratory flow'], ['bd', 'Bronchodilator response'], ['read', 'Reading it']]);
      const V = ctl.values;
      const healthy = blow(SPIRO[0][2].pre[0], SPIRO[0][2].pre[1]);
      let cur = null, pre = null, ta = 0;
      function run(def, post) {
        const d = post && def.post ? def.post : def.pre;
        return blow(d[0], d[1], { cap: def.cap, rise: def.rise, gmax: def.gmax, stop: def.stop });
      }
      function build() {
        const s = SPIRO.find(x => x[1] === V.pattern) || SPIRO[0], def = s[2];
        pre = run(def, false); cur = run(def, V.bd); ta = 0;
        const pct = (a, b) => Math.round(100 * a / b) + ' %';
        ro.set('fev1', cur.fev1.toFixed(2) + ' L (' + pct(cur.fev1, PRED.fev1) + ' of predicted)');
        ro.set('fvc', cur.fvc.toFixed(2) + ' L (' + pct(cur.fvc, PRED.fvc) + ' of predicted)');
        const ratio = cur.fev1 / cur.fvc;
        ro.set('ratio', ratio.toFixed(2) + (ratio < 0.7 ? ' — below 0.70' : ''));
        ro.set('pef', Math.round(cur.pef * 60) + ' L/min (' + cur.pef.toFixed(1) + ' L/s)');
        if (V.bd && def.post) {
          const d = cur.fev1 - pre.fev1, rel = d / PRED.fev1;
          ro.set('bd', 'FEV₁ +' + Math.round(d * 1000) + ' mL = ' + (100 * rel).toFixed(1) + ' % of predicted: ' + (rel > 0.1 ? 'a significant response' : 'not significant (10 % needed)'));
        } else ro.set('bd', V.bd ? 'no change expected' : '— (tick "After a bronchodilator")');
        let read;
        if (V.pattern === 'effort') read = 'Peak reached late (' + cur.tpef.toFixed(2) + ' s) and the blow stopped early: not a valid test — repeat it.';
        else if (V.pattern === 'trachea') read = 'Flat top and flat bottom: flow is limited by one fixed narrowing, such as the windpipe or larynx.';
        else if (ratio < 0.7) read = 'Obstruction: air comes out too slowly for the volume.' + (V.bd && def.post ? ' Still obstructed after the bronchodilator (persistent, as in COPD).' : '');
        else if (V.bd && def.post && pre.fev1 / pre.fvc < 0.7) read = 'The obstruction has largely gone after the bronchodilator: reversible, as in asthma.';
        else if (cur.fvc < 0.8 * PRED.fvc) read = 'Low FVC with a normal ratio: restriction is possible — full lung volumes are needed to confirm it.';
        else read = 'Within the normal range.';
        ro.set('read', read);
      }
      function draw(dt) {
        if (cur) ta = Math.min(ta + (dt || 0), cur.stop + 1.6);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!cur) return;
        const gap = 58, gw = (W - 3 * gap / 2 - 24) / 2, gh = Hh - 70;
        const b1 = { x: 44, y: 24, w: gw, h: gh }, b2 = { x: 44 + gw + gap, y: 24, w: gw, h: gh };
        const f1 = frame(c, kit, C, b1, [0, 6], [0, 6], { xlabel: 'time (s)', ylabel: 'volume out (L)', xstep: 1, ystep: 1 });
        const f2 = frame(c, kit, C, b2, [0, 6], [-8, 11], { xlabel: 'volume out (L)', ylabel: 'flow (L/s)', xstep: 1, ystep: 2 });
        if (V.ref) {
          polyline(c, healthy.pts.map(p => [p[0], p[1]]), f1.X, f1.Y, C.faint, 1.6, [5, 4]);
          polyline(c, healthy.pts.map(p => [p[1], p[2]]), f2.X, f2.Y, C.faint, 1.6, [5, 4]);
          polyline(c, healthy.insp, f2.X, f2.Y, C.faint, 1.6, [5, 4]);
        }
        const shown = cur.pts.filter(p => p[0] <= ta);
        polyline(c, shown.map(p => [p[0], p[1]]), f1.X, f1.Y, C.accent, 2.4);
        polyline(c, shown.map(p => [p[1], p[2]]), f2.X, f2.Y, C.accent, 2.4);
        if (ta > cur.stop) {
          const n = Math.round(clamp((ta - cur.stop) / 1.5, 0, 1) * (cur.insp.length - 1));
          polyline(c, cur.insp.slice(0, n + 1), f2.X, f2.Y, C.accent, 2.4);
        }
        if (ta >= 1) {
          c.save(); c.setLineDash([3, 3]); c.strokeStyle = C.warn; c.lineWidth = 1.2;
          c.beginPath(); c.moveTo(f1.X(1), f1.Y(0)); c.lineTo(f1.X(1), f1.Y(cur.fev1)); c.lineTo(f1.X(0), f1.Y(cur.fev1)); c.stroke(); c.restore();
          kit.dot(c, f1.X(1), f1.Y(cur.fev1), 4, C.warn);
          kit.label(c, 'FEV₁ ' + cur.fev1.toFixed(2) + ' L', f1.X(1) + 6, f1.Y(cur.fev1) + 10, { size: 11.5, color: C.warn, weight: 600 });
        }
        if (ta >= cur.stop) kit.label(c, 'FVC ' + cur.fvc.toFixed(2) + ' L', f1.X(6) - 2, f1.Y(cur.fvc) - 10, { size: 11.5, color: C.accent, weight: 600, align: 'right' });
        if (ta >= cur.tpef) {
          const pk = cur.pts.find(p => p[2] >= cur.pef - 1e-9) || cur.pts[0];
          kit.dot(c, f2.X(pk[1]), f2.Y(pk[2]), 4, C.warn);
          kit.label(c, 'PEF', f2.X(pk[1]) + 7, f2.Y(pk[2]) - 8, { size: 11.5, color: C.warn, weight: 600 });
        }
        kit.label(c, 'breath out ↑   breath in ↓', b2.x + b2.w - 4, f2.Y(-7), { size: 10.5, color: C.muted, align: 'right' });
      }
      build();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 3. oxygen crossing into a capillary */
  Hyper.sim('resp-diffusion', {
    title: 'Oxygen crossing into a capillary',
    blurb: `Red cells enter an alveolar capillary with venous blood (PO₂ about 40 mmHg) and have well under a second to load oxygen from the alveolus above. The graph follows one cell: its PO₂ (red) climbs towards the alveolar value, its PCO₂ (blue) falls to 40. The model uses Fick's law across the membrane and the real oxygen–haemoglobin curve.

- At rest a healthy lung finishes the job in about a quarter of the transit time: a large reserve.
- **Running** shortens the transit time to about 0.25 s — still just enough in health.
- **Fibrosis, walking**: a membrane three times thicker copes at rest but not on exertion — why people with lung fibrosis desaturate when they walk.
- **Mountain, climbing**: with a low alveolar PO₂ the pressure difference is small and loading is slow.
- Extra oxygen (a higher alveolar PO₂) overcomes a diffusion problem.`,
    mount(box, kit) {
      const M = kit.med;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200 });
      const plot = kit.plot(graphBox(box), { x: { label: 'time in the capillary (s)', min: 0, max: 0.8, name: 'time' }, y: { label: 'partial pressure (mmHg)', min: 0 }, fmtX: v => v.toFixed(2) + ' s', fmtY: v => v.toFixed(0) + ' mmHg' }, 220);
      const ctl = kit.controls(box.side, [
        { id: 'co', label: 'Cardiac output (exercise)', min: 5, max: 25, step: 0.5, value: 5, unit: 'L/min' },
        { id: 'thick', label: 'Membrane thickness', min: 1, max: 5, step: 0.1, value: 1, unit: '× normal' },
        { id: 'pa', label: 'Alveolar PO₂', min: 35, max: 300, step: 1, value: 100, unit: 'mmHg' },
        { type: 'buttons', items: [{ id: 'rest', label: 'Healthy, rest', primary: true }, { id: 'run', label: 'Healthy, running' }, { id: 'fib', label: 'Fibrosis, walking' }, { id: 'alt', label: 'Mountain, climbing' }, { id: 'o2', label: 'Fibrosis + oxygen' }] }
      ], id => {
        const P = { rest: [5, 1, 100], run: [20, 1, 100], fib: [12, 3, 100], alt: [15, 1, 50], o2: [12, 3, 220] }[id];
        if (P) { ctl.set('co', P[0]); ctl.set('thick', P[1]); ctl.set('pa', P[2]); }
        compute();
      });
      const ro = kit.readout(box.side, [['tt', 'Transit time'], ['eq', 'Oxygen equilibrated after'], ['po2', 'PO₂ leaving'], ['sat', 'Saturation leaving'], ['pco2', 'PCO₂ leaving']]);
      const V = ctl.values;
      const HB = 15, cO2 = p => M.o2content(HB, M.sat(p), p);
      let res = null, cells = [];
      for (let k = 0; k < 9; k++) cells.push(k / 9);
      function compute() {
        // exercise: more flow shortens the transit (partly offset by recruiting capillaries, which also
        // raises the uptake rate) and returns more deoxygenated venous blood
        const tt = 0.75 * Math.pow(5 / V.co, 0.8), pv = 40 - 12 * (V.co - 5) / 20, pvc = 46 + 8 * (V.co - 5) / 20, PA = V.pa;
        const K = 0.6 * (1 + 0.5 * (V.co - 5) / 20) / V.thick, KC = 12 / V.thick, SC = 0.56;
        let c = cO2(pv), p = pv, pc = pvc, t = 0, teq = null;
        const O = [[0, pv]], Cc = [[0, pvc]];
        while (t < tt - 1e-9) {
          const h = Math.min(0.002, tt - t);
          c += K * (PA - p) * h;
          p = bisect(x => cO2(x) - c, 0, 800, 36);
          pc += -KC * (pc - 40) / SC * h;
          t += h;
          O.push([t, p]); Cc.push([t, pc]);
          if (teq == null && PA - p < 0.03 * (PA - pv)) teq = t;
        }
        res = { tt, pv, PA, O, Cc, teq, pe: p, pce: pc };
        ro.set('tt', tt.toFixed(2) + ' s');
        ro.set('eq', teq != null ? teq.toFixed(2) + ' s — ' + Math.round(100 * teq / tt) + ' % of the way along' : 'never: the blood leaves first');
        ro.set('po2', Math.round(p) + ' mmHg (alveolus ' + Math.round(PA) + ')');
        ro.set('sat', (100 * M.sat(p)).toFixed(1) + ' %');
        ro.set('pco2', pc.toFixed(1) + ' mmHg (alveolus 40)');
        const C = kit.colors();
        plot.set({
          y: { label: 'partial pressure (mmHg)', min: 0, max: Math.max(120, PA + 15) },
          series: [{ pts: O, label: 'PO₂ in the blood', color: C.bad, width: 2.6 }, { pts: Cc, label: 'PCO₂ in the blood', color: kit.hue(215), width: 2.2 }],
          hlines: [{ y: PA, label: 'alveolar PO₂', color: C.bad }, { y: 40, label: 'alveolar PCO₂', color: kit.hue(215) }],
          vlines: [{ x: tt, label: 'blood leaves' }].concat(teq != null ? [{ x: teq, label: 'equilibrium', color: C.ok }] : []),
          marks: [{ x: tt, y: p, color: C.bad }]
        });
      }
      function draw(dt) {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!res) return;
        const x0 = 30, x1 = W - 30, cy = Hh * 0.72, r = Math.min(16, Hh * 0.08);
        const th = 3 + 3.2 * V.thick;
        // the alveolus above
        c.fillStyle = C.dark ? 'rgba(120,180,255,0.10)' : 'rgba(40,110,200,0.07)';
        c.beginPath(); c.moveTo(x0, cy - r - th - 4); c.bezierCurveTo(x0 + 10, 8, x1 - 10, 8, x1, cy - r - th - 4); c.closePath(); c.fill();
        kit.label(c, 'alveolus — PO₂ ' + Math.round(res.PA) + ' mmHg, PCO₂ 40', (x0 + x1) / 2, Hh * 0.2, { size: 12, color: C.text2, align: 'center' });
        // the membrane
        c.fillStyle = C.dark ? 'hsl(40 30% 40%)' : 'hsl(40 45% 75%)';
        c.fillRect(x0, cy - r - th - 3, x1 - x0, th);
        kit.label(c, 'membrane ' + (0.5 * V.thick).toFixed(1) + ' µm', x0 + 4, cy - r - th - 12, { size: 10.5, color: C.muted });
        // the capillary
        c.strokeStyle = C.border2; c.lineWidth = 2;
        c.beginPath(); c.moveTo(x0, cy - r - 2); c.lineTo(x1, cy - r - 2); c.moveTo(x0, cy + r + 2); c.lineTo(x1, cy + r + 2); c.stroke();
        kit.label(c, 'from the body', x0, cy + r + 14, { size: 10.5, color: C.muted });
        kit.label(c, 'to the heart →', x1, cy + r + 14, { size: 10.5, color: C.muted, align: 'right' });
        // oxygen arrows, thicker where the gradient is large
        for (let k = 0; k < 7; k++) {
          const u = (k + 0.5) / 7, i = Math.min(res.O.length - 1, Math.round(u * (res.O.length - 1)));
          const g = clamp((res.PA - res.O[i][1]) / 60, 0, 1.5);
          if (g < 0.02) continue;
          const x = x0 + u * (x1 - x0);
          kit.arrow(c, x, cy - r - th - 22, x, cy - r - th + 2 + 4, C.ok, 1 + 2.5 * g);
        }
        // red cells moving along, coloured by their saturation (slow motion: ×4)
        const slow = 4;
        cells = cells.map(u => { let v = u + (dt || 0) / (res.tt * slow); if (v >= 1) v -= 1; return v; });
        for (const u of cells) {
          const i = Math.min(res.O.length - 1, Math.round(u * (res.O.length - 1)));
          const x = x0 + u * (x1 - x0);
          c.beginPath(); c.ellipse(x, cy, r * 0.9, r * 0.75, 0, 0, Math.PI * 2); c.fillStyle = blood(C, kit.med.sat(res.O[i][1])); c.fill();
        }
        kit.label(c, 'slow motion ×' + slow, x1, 12, { size: 10.5, color: C.muted, align: 'right' });
      }
      compute();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 4. ventilation and perfusion */
  /* two lung units, each with its own ventilation (L/min) and blood flow (L/min); mixed
     venous blood is found by iterating with a fixed oxygen use and CO2 production */
  function vqModel(M, o) {
    const HB = 15, CO = 5, VO2 = 250, VCO2 = 200;
    const cO2 = p => M.o2content(HB, M.sat(p), p);
    const cCO2 = p => 90 * p / (p + 35);              // a simple CO2 dissociation curve, mL/dL
    const pO2of = c => bisect(p => cO2(p) - c, 0, 800, 44);
    const pCO2of = c => Math.min(400, c >= 89.9 ? 400 : 35 * c / (90 - c));
    const pio2 = o.fio2 * (760 - 47);
    function unit(va, q, cvO, cvC) {
      if (q < 1e-6) return { dead: true, po2: pio2, pco2: 0, q: 0, va };
      if (va < 1e-6) return { po2: pO2of(cvO), pco2: pCO2of(cvC), cO: cvO, cC: cvC, q, va };
      const po2 = bisect(p => va * (pio2 - p) / 0.863 - 10 * q * (cO2(p) - cvO), 0, pio2, 40);
      const pco2 = bisect(p => va * p / 0.863 - 10 * q * (cvC - cCO2(p)), 0, 400, 44);
      return { po2, pco2, cO: cO2(po2), cC: cCO2(pco2), q, va };
    }
    let cvO = 15, cvC = 52, A = null, B = null, ca = 20, cc = 48;
    for (let it = 0; it < 70; it++) {
      A = unit(o.va * (1 - o.vB), CO * (1 - o.qB), cvO, cvC);
      B = unit(o.va * o.vB, CO * o.qB, cvO, cvC);
      const us = [A, B].filter(u => !u.dead), qs = us.reduce((s, u) => s + u.q, 0) || 1;
      ca = us.reduce((s, u) => s + u.cO * u.q, 0) / qs;
      cc = us.reduce((s, u) => s + u.cC * u.q, 0) / qs;
      cvO += 0.5 * (Math.max(1, ca - VO2 / (10 * CO)) - cvO);
      cvC += 0.5 * (cc + VCO2 / (10 * CO) - cvC);
    }
    const pa = pO2of(ca), pac = pCO2of(cc);
    return { A, B, pao2: pa, sao2: M.sat(pa), paco2: pac, pvo2: pO2of(cvO), pAO2: M.alveolarO2({ fio2: o.fio2, paco2: pac }) };
  }
  const VQ = {
    healthy: { qB: 0.5, vB: 0.5, va: 4.2, fio2: 0.21 },
    pneumonia: { qB: 0.3, vB: 0, va: 5, fio2: 0.21 },
    lowvq: { qB: 0.5, vB: 0.1, va: 4.2, fio2: 0.21 },
    pe: { qB: 0.05, vB: 0.4, va: 6.5, fio2: 0.21 },
    hypo: { qB: 0.5, vB: 0.5, va: 2.1, fio2: 0.21 }
  };
  Hyper.sim('resp-vq', {
    title: 'Matching air to blood',
    blurb: `Two groups of alveoli share the breathing and the blood flow. The widths of the airways and vessels show how much air and blood each receives; the blood's colour shows its saturation. Mixed together, they make the arterial blood on the right. The graph below shows what raising the inspired oxygen does for the arterial PO₂ of this lung (the dashed line is a healthy lung).

- **Pneumonia (shunt)**: blood flows past alveoli full of fluid. Extra oxygen hardly helps — the curve below is almost flat.
- **Asthma or COPD (low V/Q)**: unit B gets some air, but too little. The arterial PO₂ is as low as in the shunt, yet a little extra oxygen fixes it.
- **Pulmonary embolism (dead space)**: unit B is ventilated but gets almost no blood; breathing harder keeps the PCO₂ down, and the PO₂ can look nearly normal.
- **Hypoventilation**: both units get too little air — the A–a gradient stays normal, the sign that the lungs themselves are fine.`,
    mount(box, kit, params) {
      const M = kit.med;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const plot = kit.plot(graphBox(box), { x: { label: 'inspired oxygen (%)', min: 21, max: 100, name: 'FiO₂' }, y: { label: 'arterial PO₂ (mmHg)', min: 0 }, fmtX: v => v.toFixed(0) + ' %', fmtY: v => v.toFixed(0) + ' mmHg' }, 190);
      const pre0 = params && VQ[params.preset] ? params.preset : 'healthy';
      const ctl = kit.controls(box.side, [
        { id: 'preset', type: 'select', label: 'Lung', options: [['Healthy (well matched)', 'healthy'], ['Pneumonia (shunt)', 'pneumonia'], ['Asthma or COPD (low V/Q)', 'lowvq'], ['Pulmonary embolism (dead space)', 'pe'], ['Hypoventilation (e.g. opioids)', 'hypo'], ['Your own settings', 'custom']], value: pre0 },
        { id: 'qB', label: 'Unit B: share of the blood flow', min: 0, max: 80, step: 1, value: 50, unit: '%' },
        { id: 'vB', label: 'Unit B: share of the air', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'va', label: 'Alveolar ventilation (both units)', min: 1.5, max: 12, step: 0.1, value: 4.2, unit: 'L/min' },
        { id: 'fio2', label: 'Inspired oxygen', min: 21, max: 100, step: 1, value: 21, unit: '%' }
      ], id => {
        if (id === 'preset') applyPreset(); else if (id !== 'fio2') ctl.set('preset', 'custom');
        compute();
      });
      const ro = kit.readout(box.side, [['pao2', 'Arterial PO₂'], ['sao2', 'Arterial saturation'], ['paco2', 'Arterial PCO₂'], ['aa', 'A–a gradient'], ['a', 'Unit A'], ['b', 'Unit B'], ['what', 'What it shows']]);
      const V = ctl.values;
      const FIS = [21, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100];
      const healthyCurve = FIS.map(f => [f, vqModel(M, Object.assign({}, VQ.healthy, { fio2: f / 100 })).pao2]);
      let res = null, phase = 0;
      function applyPreset() {
        const p = VQ[V.preset];
        if (!p) return;
        ctl.set('qB', Math.round(p.qB * 100)); ctl.set('vB', Math.round(p.vB * 100)); ctl.set('va', p.va);
      }
      function opts(fio2) { return { qB: V.qB / 100, vB: V.vB / 100, va: V.va, fio2: fio2 }; }
      function compute() {
        res = vqModel(M, opts(V.fio2 / 100));
        const curve = FIS.map(f => [f, vqModel(M, opts(f / 100)).pao2]);
        const C = kit.colors();
        plot.set({ series: [{ pts: healthyCurve, label: 'healthy lung', color: C.faint, dash: [5, 4], width: 1.8 }, { pts: curve, label: 'this lung', color: C.accent, width: 2.6 }], marks: [{ x: V.fio2, y: res.pao2, color: C.accent }], y: { label: 'arterial PO₂ (mmHg)', min: 0, max: 700 } });
        const vq = u => u.dead ? '∞ (no blood)' : u.va < 1e-6 ? '0 (no air)' : (u.va / u.q).toFixed(2);
        ro.set('pao2', Math.round(res.pao2) + ' mmHg (' + (res.pao2 / 7.5).toFixed(1) + ' kPa)');
        ro.set('sao2', (100 * res.sao2).toFixed(1) + ' %');
        ro.set('paco2', Math.round(res.paco2) + ' mmHg (' + (res.paco2 / 7.5).toFixed(1) + ' kPa)');
        ro.set('aa', Math.round(Math.max(0, res.pAO2 - res.pao2)) + ' mmHg' + (res.pAO2 - res.pao2 > 20 ? ' — wide: a problem in the lung' : ' — normal'));
        ro.set('a', 'V/Q ' + vq(res.A) + ', PO₂ ' + Math.round(res.A.po2) + ' mmHg');
        ro.set('b', 'V/Q ' + vq(res.B) + (res.B.dead ? ', no gas exchange' : ', PO₂ ' + Math.round(res.B.po2) + ' mmHg'));
        const what = {
          healthy: 'Air and blood well matched: V/Q about 0.8 everywhere.',
          pneumonia: 'Shunt: blood passes alveoli with no air. Oxygen cannot reach it, so extra oxygen helps little.',
          lowvq: 'Low V/Q: unit B gets too little air for its blood. A little extra oxygen raises its PO₂ and fixes the problem.',
          pe: 'Dead space: unit B is ventilated but not perfused; the extra breathing is wasted, and blood crowds into unit A.',
          hypo: 'Too little air overall: PCO₂ rises and PO₂ falls, but the A–a gradient is normal. Oxygen corrects the PO₂, not the PCO₂.'
        }[V.preset] || 'Your own mixture: compare the V/Q of the two units.';
        ro.set('what', what);
      }
      function draw(dt) {
        phase += (dt || 0);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!res) return;
        const xA = W * 0.3, xB = W * 0.62, ya = Hh * 0.42, R = Math.min(Hh * 0.16, W * 0.1), yT = 14, yS = Hh * 0.14;
        const yv = Hh * 0.8;
        // the airways: widths follow the ventilation
        const aw = f => 2 + 14 * Math.min(1, f);
        c.lineCap = 'round';
        c.strokeStyle = C.muted; c.lineWidth = aw(V.va / 6);
        c.beginPath(); c.moveTo(W * 0.46, yT); c.lineTo(W * 0.46, yS); c.stroke();
        for (const [u, x] of [[res.A, xA], [res.B, xB]]) {
          c.strokeStyle = C.muted; c.lineWidth = u.va < 1e-6 ? 1.5 : aw(u.va / 3.5);
          c.setLineDash(u.va < 1e-6 ? [3, 3] : []);
          c.beginPath(); c.moveTo(W * 0.46, yS); c.lineTo(x, ya - R); c.stroke(); c.setLineDash([]);
          // air puffs moving down the airway
          if (u.va > 0.05) {
            const n = 3;
            for (let k = 0; k < n; k++) {
              const s = ((phase * (0.25 + u.va / 6)) + k / n) % 1;
              kit.dot(c, lerp(W * 0.46, x, s), lerp(yS, ya - R, s), 2.5, kit.hue(215));
            }
          }
          // the alveolus
          c.beginPath(); c.arc(x, ya, R, 0, Math.PI * 2);
          c.fillStyle = u.va < 1e-6 && !u.dead ? (C.dark ? 'hsl(45 45% 35%)' : 'hsl(45 70% 80%)') : (C.dark ? 'rgba(120,180,255,0.14)' : 'rgba(40,110,200,0.10)');
          c.fill(); c.strokeStyle = C.border2; c.lineWidth = 1.5; c.stroke();
          const lab = u.dead ? ['no blood flow', 'PO₂ ' + Math.round(u.po2)] : u.va < 1e-6 ? ['filled with fluid', 'no air'] : ['PO₂ ' + Math.round(u.po2), 'PCO₂ ' + Math.round(u.pco2)];
          kit.label(c, lab[0], x, ya - 8, { size: 11.5, weight: 600, align: 'center' });
          kit.label(c, lab[1], x, ya + 9, { size: 11.5, color: C.text2, align: 'center' });
        }
        c.lineCap = 'butt';
        kit.label(c, 'A', xA - R - 12, ya - R + 4, { size: 13, weight: 700, color: C.muted, align: 'center' });
        kit.label(c, 'B', xB + R + 12, ya - R + 4, { size: 13, weight: 700, color: C.muted, align: 'center' });
        // the blood: venous in from the left, arterial out to the right; widths follow the perfusion
        const bw = q => q < 1e-6 ? 1.5 : 2 + 12 * Math.min(1, q / 3.5);
        const venous = blood(C, M.sat(res.pvo2)), arterial = blood(C, res.sao2);
        const xin = 12, xout = W - 12, xR = xB + R * 1.6;
        c.strokeStyle = venous; c.lineWidth = bw(5);
        c.beginPath(); c.moveTo(xin, yv); c.lineTo(W * 0.14, yv); c.stroke();
        for (const [u, x] of [[res.A, xA], [res.B, xB]]) {
          const pts = [[W * 0.14, yv], [x - R, ya + R + 8], [x + R, ya + R + 8], [xR + 20, yv]];
          c.lineWidth = bw(u.q);
          const grad = c.createLinearGradient(x - R, 0, x + R, 0);
          const out = u.dead ? venous : blood(C, M.sat(u.po2));
          grad.addColorStop(0, venous); grad.addColorStop(1, out);
          c.strokeStyle = u.q < 1e-6 ? C.faint : grad;
          c.setLineDash(u.q < 1e-6 ? [3, 3] : []);
          c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.setLineDash([]);
          if (u.q < 0.3) { kit.dot(c, x - R * 0.6, ya + R + 8, 5, C.dark ? '#a33' : '#611'); }
          // blood cells moving
          if (u.q > 0.05) {
            for (let k = 0; k < 4; k++) {
              const s = ((phase * (0.12 + u.q / 12)) + k / 4) % 1, seg = Math.min(2, Math.floor(s * 3)), f = s * 3 - seg;
              const p = [lerp(pts[seg][0], pts[seg + 1][0], f), lerp(pts[seg][1], pts[seg + 1][1], f)];
              kit.dot(c, p[0], p[1], 2.2, '#fff');
            }
          }
        }
        c.strokeStyle = arterial; c.lineWidth = bw(5);
        c.beginPath(); c.moveTo(xR + 20, yv); c.lineTo(xout, yv); c.stroke();
        kit.label(c, 'from the body', xin, yv + 18, { size: 10.5, color: C.muted });
        kit.label(c, 'arterial: PO₂ ' + Math.round(res.pao2) + ', SaO₂ ' + Math.round(100 * res.sao2) + ' %', xout, yv + 18, { size: 11.5, weight: 600, align: 'right' });
        kit.label(c, 'inspired O₂ ' + Math.round(V.fio2) + ' %', W * 0.46 + 10, yT + 4, { size: 11, color: C.muted });
      }
      applyPreset();
      compute();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 5. the oxygen–haemoglobin curve */
  Hyper.sim('resp-o2-curve', {
    title: 'The oxygen–haemoglobin curve',
    blurb: `The S-shaped curve of haemoglobin saturation against PO₂ (the dashed curve is the standard one, at pH 7.4 and 37 °C). The filled dot is arterial blood — drag it — and the open dot the venous blood returning from the body, found from the oxygen the body uses and the cardiac output (the Fick principle). The bars on the right compare the oxygen delivered each minute with what is used.

- **Hard exercise**: warm, acidic blood shifts the curve right, so working muscle can take most of the oxygen while the PO₂ in its capillaries stays high enough to drive it into the cells — the Bohr effect.
- **Anaemia**: switch the view to oxygen content. The saturation stays normal, but each decilitre carries half the oxygen.
- **Carbon monoxide**: it takes places on haemoglobin and shifts the curve left. A pulse oximeter still reads nearly normal.
- Slide the arterial PO₂ from 100 to 60 mmHg: on the flat top, saturation barely changes; below 60 it falls fast.`,
    mount(box, kit) {
      const M = kit.med;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'Show', options: [['Saturation (%)', 'sat'], ['Oxygen content (mL per dL)', 'content']], value: 'sat' },
        { id: 'po2', label: 'Arterial PO₂', min: 15, max: 150, step: 1, value: 95, unit: 'mmHg' },
        { id: 'ph', label: 'Blood pH', min: 6.9, max: 7.7, step: 0.01, value: 7.4, fmt: v => v.toFixed(2) },
        { id: 'temp', label: 'Temperature', min: 33, max: 42, step: 0.1, value: 37, unit: '°C' },
        { id: 'bpg', type: 'select', label: '2,3-BPG in the red cells', options: [['Low (stored blood)', 0.85], ['Normal', 1], ['High (altitude, anaemia)', 1.12]], value: 1 },
        { id: 'hb', label: 'Haemoglobin', min: 4, max: 20, step: 0.1, value: 15, unit: 'g/dL' },
        { id: 'coh', label: 'Carbon monoxide (COHb)', min: 0, max: 60, step: 1, value: 0, unit: '%' },
        { id: 'co', label: 'Cardiac output', min: 2, max: 25, step: 0.5, value: 5, unit: 'L/min' },
        { id: 'vo2', type: 'select', label: 'Oxygen used by the body', options: [['At rest (250 mL/min)', 250], ['Walking (750 mL/min)', 750], ['Hard exercise (2,000 mL/min)', 2000]], value: 250 },
        { type: 'buttons', items: [{ id: 'normal', label: 'Normal', primary: true }, { id: 'anaemia', label: 'Anaemia' }, { id: 'carbon', label: 'Carbon monoxide' }, { id: 'muscle', label: 'Hard exercise' }, { id: 'altitude', label: 'High altitude' }] }
      ], id => {
        const P = {
          normal: { po2: 95, ph: 7.4, temp: 37, bpg: 1, hb: 15, coh: 0, co: 5, vo2: 250 },
          anaemia: { po2: 95, ph: 7.4, temp: 37, bpg: 1.12, hb: 7, coh: 0, co: 7.5, vo2: 250 },
          carbon: { po2: 95, ph: 7.4, temp: 37, bpg: 1, hb: 15, coh: 30, co: 5, vo2: 250 },
          muscle: { po2: 95, ph: 7.3, temp: 39, bpg: 1, hb: 15, coh: 0, co: 16, vo2: 2000 },
          altitude: { po2: 45, ph: 7.45, temp: 37, bpg: 1.12, hb: 16.5, coh: 0, co: 5, vo2: 250 }
        }[id];
        if (P) { for (const k in P) ctl.set(k, P[k]); if (id === 'anaemia' || id === 'carbon') ctl.set('view', 'content'); }
      });
      const ro = kit.readout(box.side, [['p50', 'P50 (half saturated at)'], ['sao2', 'Arterial saturation'], ['spo2', 'A pulse oximeter would show'], ['cao2', 'Arterial oxygen content'], ['do2', 'Oxygen delivered'], ['ven', 'Venous blood returning'], ['ext', 'Share of oxygen used']]);
      const V = ctl.values;
      const X0 = { pH: 7.4, T: 37 };
      function model() {
        const f = 1 - clamp(V.coh / 100, 0, 0.95);
        const p50 = M.p50({ pH: V.ph, T: V.temp }) * V.bpg * Math.pow(f, 0.9);
        const s = p => M.sat(p, { p50 });
        const content = p => 1.34 * V.hb * f * s(p) + 0.003 * p;
        const ca = content(V.po2), do2 = 10 * V.co * ca;
        const cv = ca - V.vo2 / (10 * V.co);
        const pv = cv > content(0.5) ? bisect(p => content(p) - cv, 0.5, V.po2, 40) : 0.5;
        return { f, p50, s, content, ca, do2, cv, pv };
      }
      let map = null;
      kit.drag(st, {
        hit: p => map && Math.abs(p.x - map.X(V.po2)) < 18 && p.y > map.b.y && p.y < map.b.y + map.b.h ? 'a' : null,
        move: (k, p) => { ctl.set('po2', Math.round(clamp(map.Xi(p.x), 15, 150))); },
        hover: true
      });
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const m = model(), sat = V.view === 'sat';
        const wide = W > 460, gw = wide ? W - 150 : W - 70;
        const b = { x: 52, y: 26, w: gw - 52, h: Hh - 76 };
        const ymax = sat ? 100 : 25;
        const fr = frame(c, kit, C, b, [0, 150], [0, ymax], { xlabel: 'PO₂ (mmHg)', ylabel: sat ? 'saturation (%)' : 'O₂ content (mL/dL)', xstep: 25, ystep: sat ? 20 : 5 });
        map = { X: fr.X, Xi: x => (x - b.x) / b.w * 150, b };
        const y = p => sat ? 100 * m.s(p) * m.f : m.content(p);
        const y0 = p => sat ? 100 * M.sat(p, X0) : M.o2content(15, M.sat(p, X0), p);
        const P = []; for (let p = 0; p <= 150; p += 1) P.push(p);
        polyline(c, P.map(p => [p, y0(p)]), fr.X, fr.Y, C.faint, 1.6, [5, 4]);
        polyline(c, P.map(p => [p, y(p)]), fr.X, fr.Y, C.bad, 2.6);
        // P50 marker
        if (sat) {
          c.save(); c.setLineDash([2, 3]); c.strokeStyle = C.muted; c.lineWidth = 1;
          c.beginPath(); c.moveTo(fr.X(0), fr.Y(50 * m.f)); c.lineTo(fr.X(m.p50), fr.Y(50 * m.f)); c.lineTo(fr.X(m.p50), fr.Y(0)); c.stroke(); c.restore();
          kit.label(c, 'P50 ' + m.p50.toFixed(1), fr.X(m.p50) + 4, fr.Y(0) - 10, { size: 10.5, color: C.muted });
        }
        // the unloading: arterial to venous
        const ya = y(V.po2), yv = y(m.pv);
        c.save(); c.strokeStyle = C.ok; c.lineWidth = 1.5; c.setLineDash([4, 3]);
        c.beginPath(); c.moveTo(fr.X(m.pv), fr.Y(yv)); c.lineTo(fr.X(m.pv), fr.Y(ya)); c.lineTo(fr.X(V.po2), fr.Y(ya)); c.stroke(); c.restore();
        kit.label(c, 'given to the tissues', fr.X(m.pv) + 5, (fr.Y(ya) + fr.Y(yv)) / 2, { size: 10.5, color: C.ok });
        kit.dot(c, fr.X(V.po2), fr.Y(ya), 6.5, C.bad, C.bg2);
        kit.label(c, 'arterial', fr.X(V.po2) + (V.po2 > 110 ? -10 : 10), fr.Y(ya) + 14, { size: 11, weight: 600, align: V.po2 > 110 ? 'right' : 'left' });
        c.beginPath(); c.arc(fr.X(m.pv), fr.Y(yv), 5.5, 0, Math.PI * 2); c.fillStyle = C.bg2; c.fill(); c.strokeStyle = C.bad; c.lineWidth = 2; c.stroke();
        kit.label(c, 'venous', fr.X(m.pv) + 8, fr.Y(yv) + 12, { size: 11, weight: 600 });
        // delivery bars
        if (wide) {
          const bx = W - 118, by = b.y, bh = b.h, full = Math.max(2000, 1.1 * m.do2, 1.1 * V.vo2);
          const hD = clamp(m.do2 / full, 0, 1) * bh, hU = V.vo2 / full * bh;
          c.fillStyle = C.bad; c.globalAlpha = 0.75; c.fillRect(bx, by + bh - hD, 34, hD); c.globalAlpha = 1;
          c.fillStyle = C.ok; c.fillRect(bx + 50, by + bh - hU, 34, hU);
          c.strokeStyle = C.axis; c.beginPath(); c.moveTo(bx - 6, by + bh); c.lineTo(bx + 92, by + bh); c.stroke();
          kit.label(c, Math.round(m.do2) + '', bx + 17, by + bh - hD - 9, { size: 11, weight: 600, align: 'center' });
          kit.label(c, V.vo2 + '', bx + 67, by + bh - hU - 9, { size: 11, weight: 600, align: 'center' });
          kit.label(c, 'delivered', bx + 17, by + bh + 12, { size: 10.5, color: C.muted, align: 'center' });
          kit.label(c, 'used', bx + 67, by + bh + 12, { size: 10.5, color: C.muted, align: 'center' });
          kit.label(c, 'O₂, mL/min', bx + 42, by - 10, { size: 10.5, color: C.muted, align: 'center' });
        }
        ro.set('p50', m.p50.toFixed(1) + ' mmHg (normal 26.8)');
        ro.set('sao2', (100 * m.s(V.po2) * m.f).toFixed(1) + ' %' + (V.coh > 0 ? ' of all haemoglobin' : ''));
        ro.set('spo2', 'about ' + Math.round(100 * (m.s(V.po2) * m.f + V.coh / 100)) + ' %' + (V.coh >= 5 ? ' — misleadingly high' : ''));
        ro.set('cao2', m.ca.toFixed(1) + ' mL O₂ per dL');
        ro.set('do2', Math.round(m.do2) + ' mL/min');
        ro.set('ven', m.cv > 0.6 ? 'PO₂ ' + Math.round(m.pv) + ' mmHg, ' + m.cv.toFixed(1) + ' mL/dL' + (m.pv < 25 ? (V.vo2 > 250 ? ' — working muscle takes most of it' : ' — tissues short of oxygen') : '') : 'almost empty: delivery is below use');
        ro.set('ext', Math.round(100 * clamp(V.vo2 / m.do2, 0, 1)) + ' %');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 6. the control of breathing */
  const STATES = {
    awake: { S: 1.6, T: 37.3, G: 0.25, name: 'Awake' },
    sleep: { S: 1.1, T: 38.5, G: 0.15, name: 'Asleep' },
    sedative: { S: 0.6, T: 40, G: 0.1, name: 'A sedative medicine' },
    overdose: { S: 0.2, T: 45, G: 0.03, name: 'Opioid overdose' }
  };
  const ALT = [['Sea level (760 mmHg)', 760], ['1,600 m (630 mmHg)', 630], ['2,400 m, an aircraft cabin (565 mmHg)', 565], ['3,600 m (490 mmHg)', 490], ['5,400 m, Everest base camp (400 mmHg)', 400], ['7,000 m (320 mmHg)', 320], ['8,850 m, Everest summit (253 mmHg)', 253]];
  function breathingModel(M, o) {
    const s = STATES[o.state] || STATES.awake;
    const hyp = clamp((760 - o.pb) / 270, 0, 1.4);             // how hypoxic this altitude is (0 at sea level)
    const T = s.T - (o.acc ? 7 * hyp : 0), G = s.G * (1 + (o.acc ? 1.2 * Math.min(1, hyp) : 0));
    const pao2 = P => Math.max(1, M.alveolarO2({ fio2: o.fio2, patm: o.pb, paco2: P }) - 5);
    const co2Drive = P => s.S * Math.max(0, P - T);
    const o2Drive = P => G * Math.max(0, 96 - 100 * M.sat(pao2(P)));
    const drive = P => co2Drive(P) + o2Drive(P) + o.extra;
    const P = bisect(x => 0.863 * o.vco2 / x - drive(x), 3, 200, 60);
    const hco3 = o.acc && hyp > 0 ? 24 - 0.5 * Math.max(0, 40 - P) * Math.min(1, hyp) - 0.2 * Math.max(0, 40 - P) * (1 - Math.min(1, hyp)) : (P < 40 ? 24 - 0.2 * (40 - P) : 24 + 0.1 * (P - 40));
    const po = pao2(P);
    return { P, va: 0.863 * o.vco2 / P, po, sa: M.sat(po), pH: 6.1 + Math.log10(hco3 / (0.03 * P)), co2: co2Drive(P), o2: o2Drive(P), drive, pao2, T, hco3 };
  }
  Hyper.sim('resp-control', {
    title: 'What drives breathing',
    blurb: `The brainstem sets the breathing so that the carbon dioxide made by the body is blown off. In the diagram below, the curve is the **metabolic hyperbola** (the PaCO₂ that a given alveolar ventilation produces: PaCO₂ = 0.863 × V̇CO₂ / V̇A) and the rising line is the brain's **response** to CO₂ (steeper when oxygen is low). Where they cross is where you breathe.

- **Asleep** and on **a sedative** the response line flattens: PaCO₂ drifts up. An **opioid overdose** flattens it so much that CO₂ climbs to dangerous levels.
- Now add oxygen: the saturation becomes normal while the CO₂ stays high — a normal oximeter reading does not mean the breathing is adequate.
- **Hyperventilate** on purpose: PaCO₂ falls, the blood turns alkaline (the tingling of a panic attack).
- Climb a **mountain**: low oxygen adds a drive of its own; tick **Acclimatised** to see weeks of adaptation lower the PaCO₂ and raise the PaO₂.`,
    mount(box, kit, params) {
      const M = kit.med;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 190 });
      const plot = kit.plot(graphBox(box), { x: { label: 'PaCO₂ (mmHg)', min: 10, max: 90, name: 'PaCO₂' }, y: { label: 'alveolar ventilation (L/min)', min: 0, max: 25 }, fmtX: v => v.toFixed(1) + ' mmHg', fmtY: v => v.toFixed(1) + ' L/min' }, 230);
      const s0 = params && STATES[params.state] ? params.state : 'awake';
      const ctl = kit.controls(box.side, [
        { id: 'state', type: 'select', label: 'State', options: Object.keys(STATES).map(k => [STATES[k].name, k]), value: s0 },
        { id: 'vco2', label: 'CO₂ produced by the body', min: 150, max: 500, step: 10, value: 200, unit: 'mL/min' },
        { id: 'extra', label: 'Extra breathing on purpose', min: 0, max: 12, step: 0.5, value: 0, unit: 'L/min' },
        { id: 'pb', type: 'select', label: 'Altitude', options: ALT, value: 760 },
        { id: 'acc', type: 'check', label: 'Acclimatised (weeks at this altitude)', value: false },
        { id: 'fio2', label: 'Inspired oxygen', min: 21, max: 60, step: 1, value: 21, unit: '%' }
      ], () => compute());
      const ro = kit.readout(box.side, [['va', 'Alveolar ventilation'], ['paco2', 'PaCO₂'], ['ph', 'Blood pH'], ['pao2', 'PaO₂'], ['sao2', 'Oxygen saturation'], ['drive', 'Drive from CO₂ / from low O₂'], ['feel', 'What it feels like']]);
      const V = ctl.values;
      let res = null, ph = 0;
      const normal = breathingModel(M, { state: 'awake', vco2: 200, extra: 0, pb: 760, acc: false, fio2: 0.21 });
      function compute() {
        const o = { state: V.state, vco2: V.vco2, extra: V.extra, pb: V.pb, acc: V.acc, fio2: V.fio2 / 100 };
        res = breathingModel(M, o);
        const C = kit.colors(), xs = [];
        for (let x = 10; x <= 90; x += 0.5) xs.push(x);
        plot.set({
          series: [
            { pts: xs.map(x => [x, 0.863 * V.vco2 / x]), label: 'metabolic hyperbola', color: C.muted, width: 2 },
            { pts: xs.map(x => [x, normal.drive(x)]), label: 'awake at sea level', color: C.faint, dash: [5, 4], width: 1.6 },
            { pts: xs.map(x => [x, res.drive(x)]), label: 'the response now', color: C.accent, width: 2.6 }
          ],
          marks: [{ x: res.P, y: res.va, color: C.accent, label: 'you breathe here' }],
          vlines: [{ x: 35, label: '35' }, { x: 45, label: '45' }]
        });
        ro.set('va', res.va.toFixed(1) + ' L/min (normal about 4.3)');
        ro.set('paco2', res.P.toFixed(0) + ' mmHg (' + (res.P / 7.5).toFixed(1) + ' kPa)');
        ro.set('ph', res.pH.toFixed(2) + (res.pH < 7.35 ? ' — acid (respiratory acidosis)' : res.pH > 7.45 ? ' — alkaline (respiratory alkalosis)' : ' — normal'));
        ro.set('pao2', Math.round(res.po) + ' mmHg (' + (res.po / 7.5).toFixed(1) + ' kPa)');
        ro.set('sao2', (100 * res.sa).toFixed(1) + ' %');
        ro.set('drive', res.co2.toFixed(1) + ' / ' + res.o2.toFixed(1) + ' L/min');
        let feel = 'Nothing: breathing is automatic.';
        if (res.P > 60) feel = 'Drowsy, confused, headache — dangerous CO₂ retention.' + (res.sa > 0.94 ? ' The oximeter looks fine.' : '');
        else if (res.P > 46) feel = 'Breathing is depressed: CO₂ is rising.';
        else if (res.sa < 0.8) feel = 'Breathless, headache, poor judgement: severe lack of oxygen.';
        else if (res.P < 25) feel = 'Light-headed, tingling lips and fingers, maybe cramps.';
        else if (res.P < 34) feel = 'Breathing deeper than usual; maybe light-headed.';
        ro.set('feel', feel);
      }
      function draw(dt) {
        ph += (dt || 0);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!res) return;
        // a feedback loop: blood gases -> sensors -> brainstem -> muscles -> lungs -> blood gases
        const bw = Math.min(150, W * 0.2), bh = 44, y1 = Hh * 0.3, y2 = Hh * 0.74;
        const boxes = [
          [W * 0.13, y1, 'Blood gases', 'CO₂ ' + Math.round(res.P) + ' · O₂ ' + Math.round(res.po)],
          [W * 0.5, y1, 'Sensors', 'brainstem (CO₂) · carotid (O₂)'],
          [W * 0.87, y1, 'Brainstem', 'rhythm generator'],
          [W * 0.87, y2, 'Diaphragm', 'and chest muscles'],
          [W * 0.5, y2, 'Lungs', res.va.toFixed(1) + ' L/min fresh air']
        ];
        const col = C.accent;
        const arr = (a, b2, w) => {
          const [ax, ay] = a, [bx, by] = b2, dx = bx - ax, dy = by - ay, L = Math.hypot(dx, dy) || 1;
          const sx = ax + dx / L * (Math.abs(dx) > 1 ? bw / 2 + 4 : bh / 2 + 4), sy = ay + dy / L * (Math.abs(dx) > 1 ? 0 : bh / 2 + 4);
          const ex = bx - dx / L * (Math.abs(dx) > 1 ? bw / 2 + 4 : bh / 2 + 4), ey = by - dy / L * (Math.abs(dx) > 1 ? 0 : bh / 2 + 4);
          kit.arrow(c, sx, sy, ex, ey, col, w);
        };
        const tot = res.drive(res.P);
        arr(boxes[0], boxes[1], 1.5 + 2 * clamp(tot / 8, 0, 2));
        arr(boxes[1], boxes[2], 1.5 + 2 * clamp(tot / 8, 0, 2));
        arr(boxes[2], boxes[3], 1.5 + 2 * clamp(tot / 8, 0, 2));
        arr(boxes[3], boxes[4], 1.5 + 2 * clamp(tot / 8, 0, 2));
        // lungs back to the blood
        c.save(); c.strokeStyle = col; c.lineWidth = 2; c.setLineDash([5, 4]);
        c.beginPath(); c.moveTo(W * 0.5 - bw / 2 - 4, y2); c.lineTo(W * 0.13, y2); c.lineTo(W * 0.13, y1 + bh / 2 + 6); c.stroke(); c.restore();
        kit.arrow(c, W * 0.13, y1 + bh / 2 + 14, W * 0.13, y1 + bh / 2 + 3, col, 2);
        kit.label(c, 'CO₂ blown off', W * 0.13 + 6, (y1 + y2) / 2 + 10, { size: 10.5, color: C.muted });
        for (const [x, y, t1, t2] of boxes) {
          c.fillStyle = C.surface; c.strokeStyle = C.border2; c.lineWidth = 1.2;
          c.beginPath(); c.roundRect ? c.roundRect(x - bw / 2, y - bh / 2, bw, bh, 8) : c.rect(x - bw / 2, y - bh / 2, bw, bh); c.fill(); c.stroke();
          kit.label(c, t1, x, y - 8, { size: 12, weight: 650, align: 'center' });
          kit.label(c, t2, x, y + 9, { size: 10.5, color: C.text2, align: 'center' });
        }
        // a breathing lung icon beside the lungs box: its rate follows the ventilation
        const vt = 0.5 * Math.sqrt(clamp(res.va / 4.3, 0.2, 9)), rate = res.va / Math.max(0.2, vt - 0.15);
        const s = 0.5 + 0.5 * Math.sin(ph * 2 * Math.PI * rate / 60);
        const lx = W * 0.5, ly = (y1 + y2) / 2 - 6, lr = 8 + 6 * s * clamp(vt, 0.2, 1.2);
        c.fillStyle = C.dark ? 'hsl(350 45% 45%)' : 'hsl(350 60% 75%)';
        c.beginPath(); c.ellipse(lx - lr * 0.55, ly, lr * 0.5, lr, 0, 0, Math.PI * 2); c.ellipse(lx + lr * 0.55, ly, lr * 0.5, lr, 0, 0, Math.PI * 2); c.fill();
        kit.label(c, Math.round(rate) + ' breaths/min', lx + 30, ly, { size: 10.5, color: C.muted });
      }
      compute();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 7. an asthmatic airway */
  Hyper.sim('resp-airway', {
    title: 'Inside a narrowing airway',
    blurb: `A small airway in cross-section: a ring of smooth muscle outside, the lining inside, and the open lumen air must pass through. In asthma the lining is inflamed and swollen, mucus collects, and the muscle over-reacts to triggers. Air flow through a tube follows Poiseuille's law: resistance rises as **1/radius⁴**. Time runs at one minute per second.

- **Breathe in a trigger**: the muscle tightens within minutes. Try it at low and at high inflammation — inflamed airways over-react.
- **Take a reliever**: a bronchodilator relaxes the muscle within minutes, but the swelling stays.
- Lower the **inflammation** (what regular anti-inflammatory treatment does over weeks): the same trigger now hardly narrows the airway.
- Notice the graph: a 20 % smaller radius more than doubles the resistance; half the radius means sixteen times.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 260 });
      const plot = kit.plot(graphBox(box), { x: { label: 'time (minutes)', name: 'time' }, y: { label: '% of normal', min: 0, max: 105 }, fmtX: v => v.toFixed(0) + ' min', fmtY: v => v.toFixed(0) + ' %' }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'infl', label: 'Airway inflammation', min: 0, max: 100, step: 1, value: 40, unit: '%' },
        { type: 'buttons', items: [{ id: 'trigger', label: 'Breathe in a trigger', primary: true }, { id: 'reliever', label: 'Take a reliever' }, { id: 'reset', label: 'Start again' }] }
      ], id => {
        if (id === 'trigger') trig = Math.min(1.4, trig + 0.8);
        else if (id === 'reliever') bd = 1;
        else if (id === 'reset') { con = 0; trig = 0; bd = 0; hist = []; tm = 0; }
      });
      const ro = kit.readout(box.side, [['r', 'Airway radius'], ['area', 'Open area'], ['res', 'Resistance'], ['flow', 'Air flow at the same effort'], ['muscle', 'Muscle tightening'], ['state', 'Symptoms (schematic)']]);
      const V = ctl.values;
      let tm = 0, con = 0, trig = 0, bd = 0, hist = [], acc = 0;
      function radius() {
        const I = V.infl / 100;
        const ce = con * (0.35 + I) * (1 - 0.9 * bd);         // inflamed airways over-react; a reliever relaxes the muscle
        const r = (1 - 0.18 * I) * (1 - 0.45 * clamp(ce, 0, 1.2)) - 0.05 * I;
        return { r: clamp(r, 0.12, 1), ce: clamp(ce, 0, 1.2), I };
      }
      function step(dt) {
        const m = dt;                                          // minutes of simulated time
        tm += m;
        con += (trig - con) * Math.min(1, m / 3);             // the muscle follows the trigger within minutes
        trig *= Math.exp(-m / 40);                             // the trigger's effect fades over the hour
        bd *= Math.exp(-m * Math.LN2 / 120);                   // the reliever wears off over hours
        acc += m;
        if (acc >= 0.25) { acc = 0; const q = radius(); hist.push([tm, 100 * q.r, 100 * Math.pow(q.r, 4)]); }
        hist = hist.filter(p => p[0] > tm - 60);
      }
      function draw(dt) {
        step(Math.min(dt || 0, 0.05));
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const q = radius();
        // the airway in cross-section
        const cx = Math.min(W * 0.27, Hh * 0.55), cy = Hh / 2, Rout = Math.min(Hh * 0.44, W * 0.24);
        const Rm = Rout * (1 - 0.1 * q.ce), wall = Rout * 0.62;
        const lumen = wall * q.r;
        // smooth muscle ring
        c.beginPath(); c.arc(cx, cy, Rm, 0, Math.PI * 2); c.fillStyle = C.dark ? 'hsl(10 40% 38%)' : 'hsl(10 55% 72%)'; c.fill();
        c.strokeStyle = C.dark ? 'hsl(10 45% 55%)' : 'hsl(10 45% 50%)'; c.lineWidth = 1;
        for (let k = 0; k < 28; k++) { const a = k / 28 * Math.PI * 2; c.beginPath(); c.arc(cx, cy, Rm * (0.86 + 0.08 * (k % 2)), a, a + 0.18); c.stroke(); }
        // the lining (mucosa), swollen with inflammation
        c.beginPath(); c.arc(cx, cy, Rm * 0.8, 0, Math.PI * 2); c.fillStyle = C.dark ? 'hsl(345 35% 42%)' : 'hsl(345 60% 84%)'; c.fill();
        // the lumen: folded when the muscle is tight
        const folds = 10, amp = lumen * 0.18 * clamp(q.ce, 0, 1);
        c.beginPath();
        for (let k = 0; k <= 120; k++) {
          const a = k / 120 * Math.PI * 2, rr = lumen + amp * Math.cos(folds * a);
          const x = cx + rr * Math.cos(a), y = cy + rr * Math.sin(a);
          k ? c.lineTo(x, y) : c.moveTo(x, y);
        }
        c.closePath(); c.fillStyle = C.bg2; c.fill(); c.strokeStyle = C.border2; c.lineWidth = 1.2; c.stroke();
        // mucus
        if (q.I > 0.2) {
          c.fillStyle = C.dark ? 'hsl(60 35% 55%)' : 'hsl(60 55% 70%)';
          const n = Math.round(q.I * 5);
          for (let k = 0; k < n; k++) { const a = k / n * Math.PI * 2 + 0.6; kit.dot(c, cx + lumen * 0.85 * Math.cos(a), cy + lumen * 0.85 * Math.sin(a), 3 + 4 * q.I, c.fillStyle); }
        }
        kit.label(c, 'smooth muscle', cx, cy - Rm - 9, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'air', cx, cy, { size: 11, color: C.muted, align: 'center' });
        // resistance against radius: 1/r^4
        const gx = cx + Rout + 60, gw = W - gx - 16;
        if (gw > 90) {
          const fr = frame(c, kit, C, { x: gx, y: 20, w: gw, h: Hh - 70 }, [0.3, 1], [0, 20], { xlabel: 'radius (fraction of normal)', ylabel: 'resistance (× normal)', xstep: 0.1, ystep: 5, xfmt: v => v.toFixed(1) });
          const pts = []; for (let x = 0.3; x <= 1.0001; x += 0.01) pts.push([x, Math.min(21, Math.pow(x, -4))]);
          polyline(c, pts, fr.X, fr.Y, C.accent, 2.4);
          const rr = clamp(q.r, 0.3, 1), R = Math.pow(q.r, -4);
          if (R <= 20) kit.dot(c, fr.X(rr), fr.Y(R), 6, C.bad, C.bg2);
          else kit.label(c, '↑ ' + R.toFixed(0) + '×', fr.X(rr), fr.Y(20) + 10, { size: 11.5, weight: 650, color: C.bad, align: 'center' });
        }
        const R = Math.pow(q.r, -4);
        ro.set('r', Math.round(100 * q.r) + ' % of normal');
        ro.set('area', Math.round(100 * q.r * q.r) + ' %');
        ro.set('res', R.toFixed(R < 10 ? 1 : 0) + ' × normal');
        ro.set('flow', Math.round(100 / R) + ' % of normal');
        ro.set('muscle', Math.round(100 * q.ce / 1.2) + ' %' + (bd > 0.1 ? ' (reliever acting: ' + Math.round(100 * bd) + ' %)' : ''));
        ro.set('state', q.r > 0.88 ? 'none or mild' : q.r > 0.75 ? 'tight chest, cough, wheeze' : q.r > 0.6 ? 'breathless, wheezing: an attack' : 'severe attack: emergency help');
        if (hist.length > 1) {
          plot.set({ x: { label: 'time (minutes)', min: Math.max(0, tm - 60), max: Math.max(60, tm) }, series: [{ pts: hist.map(p => [p[0], p[1]]), label: 'radius', color: C.accent }, { pts: hist.map(p => [p[0], p[2]]), label: 'air flow at the same effort', color: C.bad }] });
        }
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 8. lung function across a lifetime */
  const SUSC = [['Resistant (little extra loss)', 0.1], ['Typical', 0.35], ['Susceptible', 0.9]];
  function lifeCurve(o) {
    // FEV1 as % of a typical healthy peak; growth to age 22, a plateau, then a decline of
    // 0.75 %/yr (about 30 mL/yr), plus extra loss while smoking (per pack a day)
    const pts = [];
    for (let age = 10; age <= 90; age += 0.5) {
      let v;
      if (age <= 22) v = o.peak * (0.45 + 0.55 * (age - 10) / 12);
      else {
        v = o.peak;
        const decl = a0 => Math.max(0, a0 - 25) * 0.75;
        v -= decl(age);
        if (o.cpd > 0 && age > o.start) {
          const end = Math.min(age, o.quit);
          const yrs = Math.max(0, end - Math.max(o.start, 22));
          v -= yrs * o.k * o.cpd / 20;
          if (age > o.quit && o.quit > o.start) v += Math.min(1.5, (age - o.quit) * 1.5);
        }
      }
      pts.push([age, Math.max(0, v)]);
    }
    return pts;
  }
  const NORMAL = lifeCurve({ peak: 100, cpd: 0, start: 99, quit: 999, k: 0 });
  // the first age (after 30) at which FEV1 falls below a share of the value predicted for that age
  const crossAge = (pts, share) => { const i = pts.findIndex((q, j) => q[0] > 30 && q[1] < share * NORMAL[j][1]); return i >= 0 ? pts[i][0] : null; };
  Hyper.sim('resp-lung-decline', {
    title: 'Lung function across a lifetime',
    blurb: `FEV₁ grows until the early twenties and then declines slowly all life — about 30 mL a year. Smoking adds an extra loss that differs a great deal between people. Stopping does not bring the lost function back, but the decline returns to the ordinary rate, which is why stopping at any age helps. The dashed lines at half and at 30 % of the value predicted for each age mark, roughly, severe and very severe COPD (GOLD grades 3 and 4). The curves are schematic, after the classic observations of Fletcher and Peto (1977).

- Compare stopping at 45 with never stopping, for a **susceptible** smoker.
- Lower the **peak reached in early adulthood** (prematurity, childhood infections, smoke and pollution): COPD can follow even without a fast decline.
- Pack-years = packs a day × years smoked. Drag the grey age line to read the chart.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'peak', label: 'Peak reached in early adulthood', min: 60, max: 110, step: 1, value: 100, unit: '%' },
        { id: 'cpd', label: 'Cigarettes a day', min: 0, max: 40, step: 1, value: 20 },
        { id: 'start', label: 'Started smoking at', min: 12, max: 40, step: 1, value: 17, unit: 'yr' },
        { id: 'quit', label: 'Stopped at (90 = never)', min: 20, max: 90, step: 1, value: 45, unit: 'yr' },
        { id: 'k', type: 'select', label: 'Susceptibility of the lungs to smoke', options: SUSC, value: 0.9 }
      ], () => compute());
      const ro = kit.readout(box.side, [['py', 'Pack-years'], ['at', 'FEV₁ at the age line'], ['sev', 'Below 50 % of predicted (severe) from'], ['vsev', 'Below 30 % of predicted (very severe) from'], ['gain', 'Stopping at this age gives']]);
      const V = ctl.values;
      let data = null, ageMark = 65, map = null;
      const never = NORMAL;
      function compute() {
        const quit = V.quit >= 90 ? 999 : Math.max(V.quit, V.start);
        const o = { peak: V.peak, cpd: V.cpd, start: V.start, quit, k: V.k };
        const you = lifeCurve(o), cont = lifeCurve(Object.assign({}, o, { quit: 999 }));
        data = { you, cont, quit, stops: V.quit < 90 && V.cpd > 0 };
        const yrs = V.cpd > 0 ? Math.max(0, Math.min(quit, 90) - V.start) : 0;
        ro.set('py', (V.cpd / 20 * yrs).toFixed(1));
        const a50 = crossAge(you, 0.5), a30 = crossAge(you, 0.3);
        ro.set('sev', a50 ? 'age ' + Math.round(a50) : 'not before 90');
        ro.set('vsev', a30 ? 'age ' + Math.round(a30) : 'not before 90');
        if (data.stops) {
          const c50 = crossAge(cont, 0.5);
          ro.set('gain', c50 ? (a50 ? Math.round(a50 - c50) + ' more years before severe COPD' : 'severe COPD avoided (it came at ' + Math.round(c50) + ' if smoking on)') : 'little difference on this chart');
        } else ro.set('gain', V.cpd > 0 ? '— (choose an age to stop)' : '—');
      }
      kit.drag(st, {
        hit: p => map && Math.abs(p.x - map.X(ageMark)) < 14 ? 'age' : null,
        move: (k, p) => { ageMark = clamp(Math.round(map.Xi(p.x)), 12, 90); },
        hover: true
      });
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!data) return;
        const b = { x: 50, y: 24, w: W - 66, h: Hh - 74 };
        const fr = frame(c, kit, C, b, [10, 90], [0, 110], { xlabel: 'age (years)', ylabel: 'FEV₁, % of a typical healthy peak', xstep: 10, ystep: 10 });
        map = { X: fr.X, Xi: x => 10 + (x - b.x) / b.w * 80 };
        for (const [sh, lab, col] of [[0.5, 'severe: half of predicted', C.warn], [0.3, 'very severe: 30 % of predicted', C.bad]]) {
          const pts = never.filter(q => q[0] >= 22).map(q => [q[0], sh * q[1]]);
          polyline(c, pts, fr.X, fr.Y, col, 1.2, [6, 4]);
          kit.label(c, lab, fr.X(90) - 4, fr.Y(pts[pts.length - 1][1]) - 9, { size: 11, color: col, align: 'right' });
        }
        polyline(c, never, fr.X, fr.Y, C.faint, 1.8, [5, 4]);
        if (data.stops) polyline(c, data.cont, fr.X, fr.Y, C.bad, 1.8, [2, 3]);
        polyline(c, data.you, fr.X, fr.Y, C.accent, 2.8);
        if (data.stops) { kit.dot(c, fr.X(data.quit), fr.Y(data.you.find(p => p[0] >= data.quit)[1]), 5, C.ok, C.bg2); kit.label(c, 'stops', fr.X(data.quit) + 8, fr.Y(data.you.find(p => p[0] >= data.quit)[1]) - 10, { size: 11, weight: 600, color: C.ok }); }
        // legend
        const lg = [['never smoked, normal peak', C.faint, [5, 4]], [V.cpd > 0 ? (data.stops ? 'stopping at ' + data.quit : 'never stopping') : 'not smoking', C.accent, []]];
        if (data.stops) lg.push(['if still smoking', C.bad, [2, 3]]);
        lg.forEach(([t2, col, d], i) => {
          const y = b.y + 12 + i * 17, x = b.x + b.w * 0.45;
          c.save(); c.strokeStyle = col; c.lineWidth = 3; c.setLineDash(d); c.beginPath(); c.moveTo(x, y); c.lineTo(x + 20, y); c.stroke(); c.restore();
          kit.label(c, t2, x + 26, y, { size: 11.5, color: C.text2 });
        });
        // the draggable age line
        const yv = (data.you.find(p => p[0] >= ageMark) || data.you[data.you.length - 1])[1];
        c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(fr.X(ageMark), b.y); c.lineTo(fr.X(ageMark), b.y + b.h); c.stroke(); c.restore();
        kit.dot(c, fr.X(ageMark), fr.Y(yv), 5, C.accent, C.bg2);
        kit.label(c, 'age ' + ageMark, fr.X(ageMark), b.y - 6, { size: 11, weight: 600, color: C.muted, align: 'center' });
        const pred = (never.find(p => p[0] >= ageMark) || never[never.length - 1])[1];
        ro.set('at', Math.round(yv) + ' % of a typical peak at age ' + ageMark + ' — ' + Math.round(100 * yv / Math.max(1, pred)) + ' % of predicted for that age');
      }
      compute();
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
