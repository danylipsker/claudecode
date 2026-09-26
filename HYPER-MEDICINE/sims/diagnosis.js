/* HYPER-MEDICINE · sims/diagnosis.js — simulations for Diagnosis and Evidence:
 * a test's cut-off with its ROC curve, the Fagan nomogram, reference ranges and many tests,
 * the NEWS2 early-warning score (as published by the Royal College of Physicians, 2017),
 * screening's lead time and overdiagnosis in a simulated population, confounding against
 * randomisation, many small trials and publication bias, and X-ray and ultrasound imaging. */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const pc = (x, d) => Number.isFinite(x) ? (x * 100).toFixed(d == null ? 1 : d) + ' %' : '—';
  const logit = p => Math.log(p / (1 - p));
  const expit = x => 1 / (1 + Math.exp(-x));
  const font = (size, weight) => (weight || 500) + ' ' + size + 'px system-ui, sans-serif';
  const sig2 = v => Number(v.toPrecision(2));
  // text wrapped into lines no wider than maxW; returns the y below the last line
  function wrap(c, s, x, y, maxW, lh) {
    const words = String(s).split(' ');
    let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxW && line) { c.fillText(line, x, y); y += lh; line = w; }
      else line = t;
    }
    if (line) { c.fillText(line, x, y); y += lh; }
    return y;
  }
  // a binomial draw: successes in n trials of probability p
  function binom(R, n, p) { let k = 0; for (let i = 0; i < n; i++) if (R() < p) k++; return k; }

  /* ================================================================ 1. the cut-off and the ROC curve */
  Hyper.sim('dx-threshold', {
    title: 'Where to draw the line',
    blurb: `A blood marker measured in two groups: healthy people (blue) and people with the disease (red). The groups overlap, so wherever the cut-off goes, someone lands on the wrong side. Drag the cut-off line — or a point on the ROC curve — and watch the four areas change.

- Move the cut-off to the left: sensitivity climbs towards 100 %, but specificity falls and the false positives (dark blue, right of the line) multiply.
- Set the separation to 0: the groups sit on top of each other, the ROC curve is the diagonal, and the area under it is 0.5 — a coin toss.
- Tick **Draw the groups to scale** and lower the prevalence to 1 %: the false positives swamp the true positives, and the chance that a positive result is right collapses.`,
    mount(box, kit, params) {
      const P0 = params || {};
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'cut', label: 'Cut-off (positive at or above)', min: 20, max: 120, step: 0.5, value: P0.cut || 62 },
        { id: 'sep', label: 'Separation of the two groups', min: 0, max: 4, step: 0.05, value: P0.sep != null ? P0.sep : 2, unit: 'SD' },
        { id: 'spread', label: 'Spread of the sick group', min: 0.5, max: 2, step: 0.05, value: 1.3, unit: '×' },
        { id: 'prev', label: 'Prevalence', min: 0.1, max: 50, value: P0.prev || 5, unit: '%', log: true, sig: 2 },
        { id: 'scale', type: 'check', label: 'Draw the groups to scale (by prevalence)', value: !!P0.scale }
      ]);
      const ro = kit.readout(box.side, [['se', 'Sensitivity'], ['sp', 'Specificity'], ['lr', 'LR⁺ / LR⁻'], ['ppv', 'If positive: chance of disease'], ['npv', 'If negative: chance of no disease'], ['auc', 'Area under the ROC curve']]);
      const V = ctl.values, Phi = kit.fin.ncdf;
      const m0 = 50, s0 = 10, X0 = 10, X1 = 130;
      const m1 = () => m0 + V.sep * s0, s1 = () => s0 * V.spread;
      const rates = cut => ({ se: 1 - Phi((cut - m1()) / s1()), sp: Phi((cut - m0) / s0) });
      let L = null;
      function layout() {
        const W = st.W, Hh = st.H;
        const rs = Math.max(90, Math.min(W * 0.4 - 60, Hh - 80));
        L = { dx0: 34, dx1: W - rs - 76, dy0: 44, dy1: Hh - 40, rx0: W - rs - 16, ry0: 34, rs };
        L.rx1 = L.rx0 + rs; L.ry1 = L.ry0 + rs;
      }
      const XS = v => L.dx0 + (v - X0) / (X1 - X0) * (L.dx1 - L.dx0);
      const XV = px => X0 + (px - L.dx0) / Math.max(1, L.dx1 - L.dx0) * (X1 - X0);
      kit.drag(st, {
        hit: p => {
          layout();
          if (Math.abs(p.x - XS(V.cut)) < 14 && p.y > L.dy0 - 20 && p.y < L.dy1 + 6) return 'cut';
          if (p.x >= L.rx0 - 6 && p.x <= L.rx1 + 6 && p.y >= L.ry0 - 6 && p.y <= L.ry1 + 6) return 'roc';
          return null;
        },
        move: (k, p) => {
          let v;
          if (k === 'cut') v = XV(p.x);
          else {
            const fx = clamp((p.x - L.rx0) / L.rs, 0, 1), fy = clamp((L.ry1 - p.y) / L.rs, 0, 1);
            let bd = Infinity; v = V.cut;
            for (let x = 20; x <= 120; x += 0.5) { const r = rates(x), d = (1 - r.sp - fx) * (1 - r.sp - fx) + (r.se - fy) * (r.se - fy); if (d < bd) { bd = d; v = x; } }
          }
          ctl.set('cut', clamp(Math.round(v * 2) / 2, 20, 120));
          loop.once();
        },
        hover: true
      });
      function draw() {
        layout();
        const C = kit.colors(), c = st.begin();
        const blue = kit.hue(215), red = C.bad, warn = C.warn;
        const p = V.prev / 100, cut = V.cut;
        const w0 = V.scale ? 1 - p : 0.5, w1 = V.scale ? p : 0.5;
        const f0 = x => w0 * Math.exp(-0.5 * ((x - m0) / s0) * ((x - m0) / s0)) / s0;
        const f1 = x => w1 * Math.exp(-0.5 * ((x - m1()) / s1()) * ((x - m1()) / s1())) / s1();
        const ymax = Math.max(f0(m0), f1(m1())) * 1.12 || 1;
        const Y = v => L.dy1 - v / ymax * (L.dy1 - L.dy0);
        // axis
        c.font = font(10.5); c.textAlign = 'center'; c.textBaseline = 'top'; c.lineWidth = 1;
        for (let v = 20; v <= 120; v += 20) {
          const x = XS(v);
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, L.dy0); c.lineTo(x, L.dy1); c.stroke();
          c.fillStyle = C.muted; c.fillText(String(v), x, L.dy1 + 4);
        }
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(L.dx0, L.dy1); c.lineTo(L.dx1, L.dy1); c.stroke();
        c.textAlign = 'right'; c.fillStyle = C.muted; c.fillText('test value (arbitrary units)', L.dx1, L.dy1 + 20);
        // the four areas
        const cx = clamp(cut, X0, X1);
        const area = (f, a, b, col, alpha) => {
          if (b <= a) return;
          c.beginPath(); c.moveTo(XS(a), L.dy1);
          for (let i = 0; i <= 120; i++) { const x = a + (b - a) * i / 120; c.lineTo(XS(x), Y(f(x))); }
          c.lineTo(XS(b), L.dy1); c.closePath();
          c.globalAlpha = alpha; c.fillStyle = col; c.fill(); c.globalAlpha = 1;
        };
        area(f0, X0, cx, blue, 0.16);
        area(f0, cx, X1, blue, 0.55);
        area(f1, X0, cx, warn, 0.5);
        area(f1, cx, X1, red, 0.45);
        const curve = (f, col) => {
          c.beginPath();
          for (let i = 0; i <= 240; i++) { const x = X0 + (X1 - X0) * i / 240; if (i) c.lineTo(XS(x), Y(f(x))); else c.moveTo(XS(x), Y(f(x))); }
          c.strokeStyle = col; c.lineWidth = 2; c.stroke();
        };
        curve(f0, blue); curve(f1, red);
        const close = Math.abs(V.sep) < 0.9;
        kit.label(c, 'healthy', XS(m0), Y(f0(m0)) - 10, { size: 11.5, color: blue, align: 'center', weight: 650 });
        kit.label(c, 'with the disease', XS(clamp(m1(), X0 + 12, X1 - 12)), Y(f1(m1())) - (close ? 26 : 10), { size: 11.5, color: red, align: 'center', weight: 650 });
        // the cut-off
        const xc = XS(cx);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(xc, L.dy0 - 12); c.lineTo(xc, L.dy1); c.stroke();
        kit.dot(c, xc, L.dy0 - 12, 6, C.accent, C.bg2);
        kit.label(c, '← negative', xc - 9, L.dy0 + 6, { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'positive →', xc + 9, L.dy0 + 6, { size: 11, color: C.muted });
        // legend
        const leg = [[blue, 0.3, 'true negative'], [blue, 0.7, 'false positive'], [warn, 0.7, 'missed'], [red, 0.65, 'true positive']];
        let lx = L.dx0, ly = 14;
        c.font = font(11); c.textAlign = 'left'; c.textBaseline = 'middle';
        for (const [col, a, t] of leg) {
          const w = 15 + c.measureText(t).width + 12;
          if (lx + w > L.dx1 + 20 && lx > L.dx0) { lx = L.dx0; ly += 15; }
          c.globalAlpha = a; c.fillStyle = col; c.fillRect(lx, ly - 6, 11, 11); c.globalAlpha = 1;
          c.fillStyle = C.text2; c.fillText(t, lx + 15, ly);
          lx += w;
        }
        // the ROC curve
        const { rx0, ry0, rs, rx1, ry1 } = L;
        c.fillStyle = C.surface; c.fillRect(rx0, ry0, rs, rs);
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let k = 1; k < 5; k++) { const g = k / 5 * rs; c.beginPath(); c.moveTo(rx0 + g, ry0); c.lineTo(rx0 + g, ry1); c.moveTo(rx0, ry1 - g); c.lineTo(rx1, ry1 - g); c.stroke(); }
        c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(rx0, ry1); c.lineTo(rx1, ry0); c.stroke(); c.setLineDash([]);
        const pts = [];
        for (let v = -60; v <= 220; v += 1) { const r = rates(v); pts.push([rx0 + (1 - r.sp) * rs, ry1 - r.se * rs]); }
        c.beginPath(); c.moveTo(rx1, ry1);
        for (const q of pts) c.lineTo(q[0], q[1]);
        c.closePath(); c.globalAlpha = 0.13; c.fillStyle = C.accent; c.fill(); c.globalAlpha = 1;
        c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]));
        c.strokeStyle = C.accent; c.lineWidth = 2.2; c.stroke();
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.strokeRect(rx0, ry0, rs, rs);
        const r = rates(cut);
        kit.dot(c, rx0 + (1 - r.sp) * rs, ry1 - r.se * rs, 6, C.accent, C.bg2);
        c.font = font(10.5); c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        c.fillText('0', rx0, ry1 + 4); c.fillText('50 %', rx0 + rs / 2, ry1 + 4); c.fillText('100 %', rx1, ry1 + 4);
        c.fillText('false-positive rate (1 − specificity)', rx0 + rs / 2, ry1 + 18);
        c.textAlign = 'right'; c.textBaseline = 'middle';
        c.fillText('100 %', rx0 - 4, ry0 + 4); c.fillText('50 %', rx0 - 4, ry0 + rs / 2); c.fillText('0', rx0 - 4, ry1 - 4);
        c.save(); c.translate(rx0 - 40, ry0 + rs / 2); c.rotate(-Math.PI / 2); c.textAlign = 'center'; c.fillText('sensitivity', 0, 0); c.restore();
        const auc = Phi((m1() - m0) / Math.sqrt(s0 * s0 + s1() * s1()));
        kit.label(c, 'ROC curve · area ' + auc.toFixed(2), rx0 + rs / 2, ry0 - 16, { size: 12, weight: 650, align: 'center' });
        // read-outs
        ro.set('se', pc(r.se)); ro.set('sp', pc(r.sp));
        const lrp = r.sp < 1 ? r.se / (1 - r.sp) : Infinity, lrn = r.sp > 0 ? (1 - r.se) / r.sp : Infinity;
        ro.set('lr', (Number.isFinite(lrp) && lrp < 1000 ? kit.fmt(lrp, 3) : 'over 1000') + ' / ' + (Number.isFinite(lrn) ? kit.fmt(lrn, 2) : '—'));
        const b = kit.med.bayes({ prevalence: p, sensitivity: r.se, specificity: r.sp });
        ro.set('ppv', Number.isFinite(b.ppv) ? pc(b.ppv) : '— (nobody tests positive)');
        ro.set('npv', Number.isFinite(b.npv) ? pc(b.npv, 2) : '—');
        ro.set('auc', auc.toFixed(3));
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 2. the Fagan nomogram */
  const PTICK = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 99, 99.5, 99.8, 99.9];
  const PLAB = [0.1, 0.5, 1, 2, 5, 10, 20, 30, 50, 70, 80, 90, 95, 98, 99, 99.5];
  const LTICK = [0.001, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20, 50, 100, 200, 500, 1000];
  const LLAB = [0.001, 0.01, 0.05, 0.2, 1, 5, 20, 100, 1000];
  Hyper.sim('dx-fagan', {
    title: 'From before to after: the Fagan nomogram',
    blurb: `The ruler on the left does Bayes' theorem with a straight line: from the probability **before** the test (left scale), through the result's **likelihood ratio** (middle), to the probability **after** it (right). The graph beside it shows the same update for every starting probability.

- Drag the point on the left scale: a positive result from the same test means little when the disease was unlikely, and a lot when it was already suspected.
- Switch the result to **Negative**: the line tips the other way. A negative result is most convincing when the probability was low to begin with.
- Add a **second, independent test**: its line starts where the first ended — how a screening test followed by a more specific confirmatory test approaches certainty.`,
    mount(box, kit, params) {
      const P0 = params || {};
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'pre', label: 'Probability before the test', min: 0.1, max: 99, value: P0.pre || 10, unit: '%', log: true, sig: 2 },
        { id: 'sens', label: 'Sensitivity', min: 50, max: 99.9, step: 0.1, value: P0.sens || 90, unit: '%' },
        { id: 'spec', label: 'Specificity', min: 50, max: 99.9, step: 0.1, value: P0.spec || 91, unit: '%' },
        { id: 'res', type: 'select', label: 'Result', options: [['Positive', 'pos'], ['Negative', 'neg']], value: 'pos' },
        { id: 'two', type: 'select', label: 'Then a second, independent test', options: [['None', 'none'], ['Positive', 'pos'], ['Negative', 'neg']], value: 'none' },
        { id: 'sens2', label: 'Second test: sensitivity', min: 50, max: 99.9, step: 0.1, value: 95, unit: '%' },
        { id: 'spec2', label: 'Second test: specificity', min: 50, max: 99.9, step: 0.1, value: 99, unit: '%' }
      ], id => { if (id === 'two') showTwo(); loop.once(); });
      const ro = kit.readout(box.side, [['odds', 'Odds before → after'], ['lr', 'Likelihood ratio of the result'], ['post', 'Probability after'], ['two', 'After the second test']]);
      const V = ctl.values;
      function showTwo() { const on = V.two !== 'none'; ctl.show('sens2', on); ctl.show('spec2', on); ro.show('two', on); }
      const lrOf = (se, sp, res) => res === 'pos' ? se / Math.max(1e-6, 1 - sp) : (1 - se) / Math.max(1e-6, sp);
      const cp = p => clamp(p, 0.0005, 0.9995);
      function geo() {
        const W = st.W, Hh = st.H, nw = W > 620 ? W * 0.5 : W * 0.56;
        const g = { W, Hh, xL: 58, xR: nw - 46, y0: 40, y1: Hh - 24 };
        g.xM = (g.xL + g.xR) / 2; g.cy = (g.y0 + g.y1) / 2; g.k = (g.y1 - g.y0) / 2 / 7.6;
        g.px0 = nw + 34; g.px1 = W - 14; g.py0 = 40; g.py1 = Hh - 44;
        return g;
      }
      kit.drag(st, {
        hit: p => {
          const g = geo();
          if (Math.abs(p.x - g.xL) < 18 && p.y > g.y0 - 8 && p.y < g.y1 + 8) return 'pre';
          if (p.x > g.px0 && p.x < g.px1 && p.y > g.py0 && p.y < g.py1) return 'plot';
          return null;
        },
        move: (k, p) => {
          const g = geo();
          let v = k === 'pre' ? expit((p.y - g.cy) / g.k) * 100 : (p.x - g.px0) / Math.max(1, g.px1 - g.px0) * 100;
          ctl.set('pre', sig2(clamp(v, 0.1, 99)));
          loop.once();
        },
        hover: true
      });
      function draw() {
        const g = geo(), C = kit.colors(), c = st.begin();
        const yL = p => g.cy + logit(cp(p)) * g.k, yR = p => g.cy - logit(cp(p)) * g.k, yM = lr => g.cy - Math.log(clamp(lr, 1e-3, 1e3)) * g.k / 2;
        const pre = V.pre / 100, se = V.sens / 100, sp = V.spec / 100;
        const lr1 = lrOf(se, sp, V.res), post1 = kit.med.postTest(pre, lr1);
        const two = V.two !== 'none', lr2 = lrOf(V.sens2 / 100, V.spec2 / 100, V.two), post2 = two ? kit.med.postTest(post1, lr2) : post1;
        // the three scales
        c.lineWidth = 1.4; c.strokeStyle = C.axis;
        for (const x of [g.xL, g.xM, g.xR]) { c.beginPath(); c.moveTo(x, g.y0); c.lineTo(x, g.y1); c.stroke(); }
        c.font = font(10); c.textBaseline = 'middle'; c.fillStyle = C.muted; c.lineWidth = 1;
        for (const t of PTICK) {
          const a = yL(t / 100), b = yR(t / 100), big = PLAB.includes(t);
          c.beginPath(); c.moveTo(g.xL - (big ? 6 : 3), a); c.lineTo(g.xL, a); c.moveTo(g.xR, b); c.lineTo(g.xR + (big ? 6 : 3), b); c.stroke();
          if (big) { c.textAlign = 'right'; c.fillText(String(t), g.xL - 8, a); c.textAlign = 'left'; c.fillText(String(t), g.xR + 8, b); }
        }
        for (const t of LTICK) {
          const y = yM(t), big = LLAB.includes(t);
          c.beginPath(); c.moveTo(g.xM - (big ? 5 : 3), y); c.lineTo(g.xM + (big ? 5 : 3), y); c.stroke();
          if (big) { c.textAlign = 'left'; c.fillText(String(t), g.xM + 7, y); }
        }
        c.font = font(11, 650); c.fillStyle = C.text2; c.textAlign = 'center'; c.textBaseline = 'bottom';
        c.fillText('before (%)', g.xL, g.y0 - 8); c.fillText('likelihood ratio', g.xM, g.y0 - 8); c.fillText('after (%)', g.xR, g.y0 - 8);
        // the first line
        const line = (pa, lr, pb, col) => {
          c.strokeStyle = col; c.lineWidth = 2.4; c.beginPath(); c.moveTo(g.xL, yL(pa)); c.lineTo(g.xR, yR(pb)); c.stroke();
          kit.dot(c, g.xM, yM(lr), 4.5, col, C.bg2); kit.dot(c, g.xR, yR(pb), 5, col, C.bg2);
        };
        line(pre, lr1, post1, C.accent);
        if (two) {
          line(post1, lr2, post2, C.warn);
          c.fillStyle = C.warn; c.beginPath(); c.moveTo(g.xL - 3, yL(post1)); c.lineTo(g.xL - 11, yL(post1) - 5); c.lineTo(g.xL - 11, yL(post1) + 5); c.closePath(); c.fill();
        }
        kit.dot(c, g.xL, yL(pre), 7, C.accent, C.bg2);
        kit.label(c, pc(post1, post1 < 0.01 || post1 > 0.99 ? 2 : 1), g.xR + 10, yR(post1) - 12, { size: 11.5, weight: 650, color: C.accent, bg: C.bg2 });
        if (two) kit.label(c, pc(post2, post2 < 0.01 || post2 > 0.99 ? 2 : 1), g.xR + 10, yR(post2) + 14, { size: 11.5, weight: 650, color: C.warn, bg: C.bg2 });
        // the update for every starting probability
        const { px0, px1, py0, py1 } = g, pw = px1 - px0, ph = py1 - py0;
        if (pw > 60) {
          const X = v => px0 + v * pw, Y = v => py1 - v * ph;
          c.fillStyle = C.surface; c.fillRect(px0, py0, pw, ph);
          c.strokeStyle = C.grid; c.lineWidth = 1;
          for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(X(k / 4), py0); c.lineTo(X(k / 4), py1); c.moveTo(px0, Y(k / 4)); c.lineTo(px1, Y(k / 4)); c.stroke(); }
          c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(1), Y(1)); c.stroke(); c.setLineDash([]);
          const lrP = lrOf(se, sp, 'pos'), lrN = lrOf(se, sp, 'neg');
          const curve = (lr, col, w) => { c.beginPath(); for (let i = 0; i <= 100; i++) { const q = i / 100, y = kit.med.postTest(cp(q), lr); if (i) c.lineTo(X(q), Y(y)); else c.moveTo(X(q), Y(y)); } c.strokeStyle = col; c.lineWidth = w; c.stroke(); };
          curve(lrP, C.bad, V.res === 'pos' ? 2.6 : 1.4); curve(lrN, C.ok, V.res === 'neg' ? 2.6 : 1.4);
          c.strokeStyle = C.axis; c.lineWidth = 1.2; c.strokeRect(px0, py0, pw, ph);
          c.setLineDash([3, 3]); c.strokeStyle = C.accent; c.beginPath(); c.moveTo(X(pre), py0); c.lineTo(X(pre), py1); c.stroke(); c.setLineDash([]);
          kit.dot(c, X(pre), Y(kit.med.postTest(pre, lrP)), 4.5, C.bad, C.bg2);
          kit.dot(c, X(pre), Y(kit.med.postTest(pre, lrN)), 4.5, C.ok, C.bg2);
          c.font = font(10.5); c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
          c.fillText('0', X(0), py1 + 4); c.fillText('50', X(0.5), py1 + 4); c.fillText('100', X(1), py1 + 4);
          c.fillText('probability before (%)', px0 + pw / 2, py1 + 18);
          c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText('100', px0 - 4, Y(1)); c.fillText('50', px0 - 4, Y(0.5)); c.fillText('0', px0 - 4, Y(0));
          kit.label(c, 'after a positive', px0 + 8, py0 + 12, { size: 11, color: C.bad, weight: 650 });
          kit.label(c, 'after a negative', px1 - 8, py1 - 12, { size: 11, color: C.ok, weight: 650, align: 'right' });
          kit.label(c, 'probability after (%)', px0 + pw / 2, py0 - 14, { size: 11, color: C.text2, weight: 650, align: 'center' });
        }
        // read-outs
        const o1 = pre / (1 - pre), o2 = post1 / (1 - post1);
        ro.set('odds', kit.fmt(o1, 3) + ' → ' + kit.fmt(o2, 3));
        ro.set('lr', kit.fmt(lr1, 3) + (V.res === 'pos' ? ' (positive)' : ' (negative)'));
        ro.set('post', pc(post1, post1 < 0.01 || post1 > 0.99 ? 2 : 1));
        ro.set('two', two ? pc(post2, post2 < 0.01 || post2 > 0.99 ? 2 : 1) + ' (LR ' + kit.fmt(lr2, 3) + ')' : '—');
      }
      showTwo();
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 3. reference ranges and many tests */
  const TESTS = ['Sodium', 'Potassium', 'Chloride', 'Bicarbonate', 'Urea', 'Creatinine', 'Glucose', 'Calcium', 'Phosphate', 'Magnesium',
    'Albumin', 'Total protein', 'Bilirubin', 'ALT', 'AST', 'ALP', 'GGT', 'Urate', 'Cholesterol', 'Triglycerides',
    'Haemoglobin', 'Haematocrit', 'Red cells', 'MCV', 'MCH', 'White cells', 'Neutrophils', 'Lymphocytes', 'Monocytes', 'Eosinophils',
    'Platelets', 'TSH', 'Free T4', 'Iron', 'Ferritin', 'Vitamin B12', 'Folate', 'CRP', 'Amylase', 'CK'];
  const ZC = { 0.9: 1.6449, 0.95: 1.96, 0.99: 2.5758 };
  Hyper.sim('dx-reference-range', {
    title: 'Many tests on a healthy person',
    blurb: `Each bar is one blood test on a perfectly healthy person, scaled to its own reference range (the green band). The values are drawn at random, the way healthy people really vary. A result outside the band is flagged **H** or **L**.

- Press **Next healthy person** a few times with 20 tests: most healthy people get at least one flag.
- Press **Test 100 more** and compare the bars (what happened) with the dashes (what $1 - 0.95^{n}$ and the binomial distribution predict).
- Set the panel to 1 test: 1 healthy person in 20 is flagged. Widen the range to 99 %: fewer false flags — but a real problem would also have to be more extreme to be caught.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Tests on the panel', min: 1, max: 40, step: 1, value: 20 },
        { id: 'cover', type: 'select', label: 'Each range covers', options: [['the middle 95 % (usual)', 0.95], ['the middle 99 %', 0.99], ['the middle 90 %', 0.9]], value: 0.95 },
        { id: 'auto', type: 'check', label: 'Keep testing healthy people', value: false },
        { type: 'buttons', items: [{ id: 'next', label: 'Next healthy person', primary: true }, { id: 'hundred', label: 'Test 100 more' }, { id: 'clear', label: 'Start the count again' }] }
      ], id => {
        if (id === 'next') person(true);
        else if (id === 'hundred') { for (let i = 0; i < 100; i++) person(i === 99); }
        else if (id === 'clear' || id === 'n' || id === 'cover') { reset(); person(true); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['this', 'This person'], ['theory', 'At least one flag (theory)'], ['sim', 'At least one flag (so far)'], ['mean', 'Average flags per person'], ['people', 'Healthy people tested']]);
      const V = ctl.values, G = kit.fin.normals(20260927);
      let z = [], people = 0, withFlag = 0, flagsTotal = 0, hist = [], acc = 0;
      const nT = () => Math.round(V.n), zc = () => ZC[V.cover] || 1.96;
      function reset() { people = 0; withFlag = 0; flagsTotal = 0; hist = new Array(10).fill(0); }
      function person(show) {
        const v = []; for (let i = 0; i < 40; i++) v.push(G());
        let f = 0; for (let i = 0; i < nT(); i++) if (Math.abs(v[i]) > zc()) f++;
        people++; flagsTotal += f; if (f) withFlag++; hist[Math.min(f, 9)]++;
        if (show) z = v;
      }
      function pmf(n, a) {
        const out = []; let p = Math.pow(1 - a, n);
        for (let k = 0; k <= n; k++) { out.push(p); p = p * (n - k) / (k + 1) * a / (1 - a); }
        return out;
      }
      function draw(dt) {
        if (V.auto) { acc += dt || 0; while (acc > 0.3) { acc -= 0.3; person(true); } }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const n = nT(), zlim = zc(), a = 1 - V.cover;
        const rw = W * 0.58, cols = n > 20 ? 2 : 1, per = Math.ceil(n / cols);
        const top = 36, rh = Math.min(24, (Hh - top - 10) / Math.max(per, 1));
        let flagged = 0;
        for (let i = 0; i < n; i++) if (Math.abs(z[i] || 0) > zlim) flagged++;
        kit.label(c, 'Healthy person ' + people + ': ' + flagged + ' of ' + n + (n === 1 ? ' result' : ' results') + ' flagged', 10, 16, { size: 12.5, weight: 650, color: flagged ? C.bad : C.ok });
        const cw = (rw - 16) / cols, nameW = Math.min(88, cw * 0.42);
        c.textBaseline = 'middle';
        for (let i = 0; i < n; i++) {
          const col = Math.floor(i / per), row = i % per;
          const x0 = 10 + col * cw, y = top + row * rh + rh / 2, bx0 = x0 + nameW, bx1 = x0 + cw - 26;
          const S = v => bx0 + (clamp(v, -4, 4) + 4) / 8 * (bx1 - bx0);
          let fs = Math.min(11, rh * 0.5 + 2);
          c.font = font(fs);
          while (fs > 7 && c.measureText(TESTS[i]).width > nameW - 4) { fs -= 0.5; c.font = font(fs); }
          c.fillStyle = C.text2; c.textAlign = 'left'; c.fillText(TESTS[i], x0, y);
          c.fillStyle = C.surface; c.fillRect(bx0, y - rh * 0.28, bx1 - bx0, rh * 0.56);
          c.globalAlpha = 0.28; c.fillStyle = C.ok; c.fillRect(S(-zlim), y - rh * 0.28, S(zlim) - S(-zlim), rh * 0.56); c.globalAlpha = 1;
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(S(0), y - rh * 0.28); c.lineTo(S(0), y + rh * 0.28); c.stroke();
          const v = z[i] || 0, out = Math.abs(v) > zlim;
          kit.dot(c, S(v), y, Math.max(2.5, Math.min(5, rh * 0.22)), out ? C.bad : C.text2);
          if (out) { c.font = font(11, 700); c.fillStyle = C.bad; c.textAlign = 'left'; c.fillText(v > 0 ? 'H' : 'L', bx1 + 6, y); }
        }
        // the tally
        const hx0 = rw + 34, hx1 = W - 12, hy0 = 40, hy1 = Hh - 44, K = Math.min(n, 8);
        const th = pmf(n, a), simS = hist.map(h => people ? h / people : 0);
        const bars = [];
        for (let k = 0; k <= K; k++) {
          const thK = k < K ? th[k] : th.slice(k).reduce((s, x) => s + x, 0);
          const sK = k < K ? simS[k] : simS.slice(k).reduce((s, x) => s + x, 0);
          bars.push([thK, sK]);
        }
        const ymax = Math.max(0.1, ...bars.map(b => Math.max(b[0], b[1]))) * 1.15;
        const bw = (hx1 - hx0) / (K + 1), Y = v => hy1 - v / ymax * (hy1 - hy0);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.font = font(10); c.fillStyle = C.muted; c.textAlign = 'right';
        const step = ymax > 0.5 ? 0.2 : ymax > 0.25 ? 0.1 : 0.05;
        for (let v = 0; v <= ymax + 1e-9; v += step) { c.beginPath(); c.moveTo(hx0, Y(v)); c.lineTo(hx1, Y(v)); c.stroke(); c.fillText(Math.round(v * 100) + ' %', hx0 - 4, Y(v)); }
        bars.forEach(([t, s], k) => {
          const x = hx0 + k * bw;
          if (people) { c.globalAlpha = 0.75; c.fillStyle = C.accent; c.fillRect(x + bw * 0.18, Y(s), bw * 0.64, hy1 - Y(s)); c.globalAlpha = 1; }
          c.strokeStyle = C.warn; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x + bw * 0.1, Y(t)); c.lineTo(x + bw * 0.9, Y(t)); c.stroke();
          c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillText(k < K || K === n ? String(k) : k + '+', x + bw / 2, hy1 + 4);
          c.textBaseline = 'middle';
        });
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(hx0, hy1); c.lineTo(hx1, hy1); c.stroke();
        c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillText('flagged results per healthy person', (hx0 + hx1) / 2, hy1 + 18);
        kit.label(c, '■ tested so far', hx0, 16, { size: 11, color: C.accent });
        kit.label(c, '— expected', hx0 + 100, 16, { size: 11, color: C.warn });
        // read-outs
        ro.set('this', flagged + ' of ' + n + ' flagged');
        ro.set('theory', pc(1 - Math.pow(V.cover, n)));
        ro.set('sim', people ? pc(withFlag / people) : '—');
        ro.set('mean', (people ? (flagsTotal / people).toFixed(2) : '—') + ' (expected ' + (n * a).toFixed(2) + ')');
        ro.set('people', String(people));
      }
      reset(); person(true);
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 4. NEWS2 */
  // National Early Warning Score 2 (Royal College of Physicians, London, 2017). Each entry is
  // [score, column], the columns running 3 2 1 0 1 2 3 from left to right as on the chart.
  function news2(v) {
    const out = {};
    const rr = Math.round(v.rr);
    out.rr = rr <= 8 ? [3, 0] : rr <= 11 ? [1, 2] : rr <= 20 ? [0, 3] : rr <= 24 ? [2, 5] : [3, 6];
    const s = Math.round(v.spo2);
    if (!v.scale2) out.spo2 = s <= 91 ? [3, 0] : s <= 93 ? [2, 1] : s <= 95 ? [1, 2] : [0, 3];
    else out.spo2 = s <= 83 ? [3, 0] : s <= 85 ? [2, 1] : s <= 87 ? [1, 2] : (s <= 92 || !v.o2) ? [0, 3] : s <= 94 ? [1, 4] : s <= 96 ? [2, 5] : [3, 6];
    out.air = v.o2 ? [2, 1] : [0, 3];
    const b = Math.round(v.sbp);
    out.sbp = b <= 90 ? [3, 0] : b <= 100 ? [2, 1] : b <= 110 ? [1, 2] : b <= 219 ? [0, 3] : [3, 6];
    const h = Math.round(v.hr);
    out.hr = h <= 40 ? [3, 0] : h <= 50 ? [1, 2] : h <= 90 ? [0, 3] : h <= 110 ? [1, 4] : h <= 130 ? [2, 5] : [3, 6];
    out.avpu = v.avpu === 'A' ? [0, 3] : [3, 6];
    const t = Math.round(v.temp * 10) / 10;
    out.temp = t <= 35.0 ? [3, 0] : t <= 36.0 ? [1, 2] : t <= 38.0 ? [0, 3] : t <= 39.0 ? [1, 4] : [2, 5];
    let total = 0, red = false;
    for (const k of Object.keys(out)) { total += out[k][0]; if (out[k][0] === 3) red = true; }
    return { rows: out, total, red };
  }
  function newsBand(r) {
    if (r.total >= 7) return { lv: 3, name: 'High', obs: 'Continuous monitoring', resp: 'Emergency response: immediate assessment by a team with critical-care skills; consider a move to a high-dependency unit or intensive care.' };
    if (r.total >= 5) return { lv: 2, name: 'Medium', obs: 'Observations at least every hour', resp: 'Urgent response: prompt review by a clinician skilled in caring for acutely ill patients, in a place with monitoring.' };
    if (r.red) return { lv: 1.5, name: 'Low–medium (a 3 in one parameter)', obs: 'Observations at least every hour', resp: 'The nurse informs the medical team, who review the patient and decide whether to escalate care.' };
    if (r.total >= 1) return { lv: 1, name: 'Low', obs: 'Observations at least every 4–6 hours', resp: 'A registered nurse assesses the patient and decides whether to observe more often or escalate.' };
    return { lv: 0, name: 'Low (score 0)', obs: 'Observations at least every 12 hours', resp: 'Routine monitoring.' };
  }
  const NEWS_ROWS = [
    { key: 'rr', name: 'Breathing rate', val: v => Math.round(v.rr) + '/min', bands: ['≤ 8', '', '9–11', '12–20', '', '21–24', '≥ 25'] },
    { key: 'spo2', name: 'SpO₂', val: v => Math.round(v.spo2) + ' %', bands: ['≤ 91', '92–93', '94–95', '≥ 96', '', '', ''], bands2: ['≤ 83', '84–85', '86–87', '88–92', '93–94', '95–96', '≥ 97'] },
    { key: 'air', name: 'Air or oxygen', val: v => v.o2 ? 'oxygen' : 'air', bands: ['', 'oxygen', '', 'air', '', '', ''] },
    { key: 'sbp', name: 'Systolic BP', val: v => Math.round(v.sbp) + '', bands: ['≤ 90', '91–100', '101–110', '111–219', '', '', '≥ 220'] },
    { key: 'hr', name: 'Pulse', val: v => Math.round(v.hr) + '/min', bands: ['≤ 40', '', '41–50', '51–90', '91–110', '111–130', '≥ 131'] },
    { key: 'avpu', name: 'Consciousness', val: v => ({ A: 'alert', C: 'confused', V: 'voice', P: 'pain', U: 'unresp.' })[v.avpu] || '', bands: ['', '', '', 'alert', '', '', 'C, V, P, U'] },
    { key: 'temp', name: 'Temperature', val: v => (Math.round(v.temp * 10) / 10).toFixed(1) + ' °C', bands: ['≤ 35.0', '', '35.1–36.0', '36.1–38.0', '38.1–39.0', '≥ 39.1', ''] }
  ];
  const COLSCORE = [3, 2, 1, 0, 1, 2, 3];
  // a patient developing sepsis, hour by hour: breathing rate, SpO2, oxygen, systolic, pulse, ACVPU, temperature
  const SCEN = [
    [16, 97, false, 128, 80, 'A', 37.2], [18, 97, false, 126, 88, 'A', 37.8], [20, 96, false, 124, 94, 'A', 38.3],
    [21, 96, false, 122, 98, 'A', 38.6], [22, 95, false, 118, 104, 'A', 38.9], [23, 95, false, 114, 110, 'A', 39.2],
    [24, 94, false, 110, 114, 'A', 39.3], [25, 93, false, 106, 118, 'A', 39.3], [26, 95, true, 100, 122, 'A', 39.1],
    [27, 94, true, 96, 126, 'C', 38.9], [28, 94, true, 88, 130, 'C', 38.8]];
  Hyper.sim('dx-news2', {
    title: 'NEWS2: an early-warning score',
    blurb: `The National Early Warning Score 2 chart (Royal College of Physicians, 2017), scored exactly as published. Each vital sign falls into a band worth 0–3 points; the total decides how often to observe and how fast a doctor must come.

- Press **Play: a patient becoming unwell** and watch hour by hour: the score passes 5 (urgent review) and 7 (emergency) hours before the blood pressure falls to 90 — the breathing rate and pulse give the early warning.
- Set everything normal, then raise only the breathing rate to 25: a single 3 triggers a prompt review even though the total is low.
- Tick **SpO₂ scale 2** (for people whose target is 88–92 %) and add oxygen: on this scale, a high saturation on oxygen scores points, because too much oxygen can harm them.

For learning only — scores are used by trained staff alongside clinical judgement, and NEWS2 is not for children or pregnancy.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 420 });
      const ctl = kit.controls(box.side, [
        { id: 'rr', label: 'Breathing rate', min: 4, max: 40, step: 1, value: 16, unit: '/min' },
        { id: 'spo2', label: 'Oxygen saturation (SpO₂)', min: 75, max: 100, step: 1, value: 97, unit: '%' },
        { id: 'o2', type: 'check', label: 'Breathing supplemental oxygen', value: false },
        { id: 'scale2', type: 'check', label: 'SpO₂ scale 2 (target 88–92 %)', value: false },
        { id: 'sbp', label: 'Systolic blood pressure', min: 60, max: 240, step: 1, value: 124, unit: 'mmHg' },
        { id: 'hr', label: 'Pulse', min: 30, max: 180, step: 1, value: 76, unit: '/min' },
        { id: 'avpu', type: 'select', label: 'Consciousness (ACVPU)', options: [['Alert', 'A'], ['New confusion', 'C'], ['Responds to voice', 'V'], ['Responds to pain', 'P'], ['Unresponsive', 'U']], value: 'A' },
        { id: 'temp', label: 'Temperature', min: 33, max: 42, step: 0.1, value: 36.8, unit: '°C' },
        { type: 'buttons', items: [{ id: 'play', label: 'Play: a patient becoming unwell', primary: true }, { id: 'normal', label: 'Healthy values' }] }
      ], id => {
        if (id === 'play') { playing = true; hour = 0; clock = 0; hist = []; apply(0); }
        else if (id === 'normal') { playing = false; hist = []; setAll(16, 97, false, 124, 76, 'A', 36.8); ctl.set('scale2', false); }
        else if (playing) playing = false;
        loop.once();
      });
      const ro = kit.readout(box.side, [['total', 'NEWS2 total'], ['risk', 'Clinical risk'], ['obs', 'Monitoring'], ['time', 'Scenario']]);
      const V = ctl.values;
      let playing = false, hour = 0, clock = 0, hist = [];
      function setAll(rr, s, o2, sbp, hr, avpu, t) { ctl.set('rr', rr); ctl.set('spo2', s); ctl.set('o2', o2); ctl.set('sbp', sbp); ctl.set('hr', hr); ctl.set('avpu', avpu); ctl.set('temp', t); }
      function apply(h) {
        const r = SCEN[h]; ctl.set('scale2', false); setAll(r[0], r[1], r[2], r[3], r[4], r[5], r[6]);
        hist.push({ h, total: news2(V).total, sbp: r[3] });
      }
      const tint = (C, s, strong) => s === 0 ? (strong ? C.ok : null) : s === 3 ? C.bad : C.warn;
      function draw(dt) {
        if (playing) {
          clock += dt || 0;
          if (clock > 1.3) { clock = 0; hour++; if (hour < SCEN.length) apply(hour); else playing = false; }
        }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const r = news2(V), band = newsBand(r);
        const narrow = W < 640, x0 = 8, nameW = narrow ? 96 : 128, scoreW = 30, panelW = narrow ? 0 : Math.min(200, W * 0.25);
        const cw = (W - x0 - nameW - scoreW - panelW - 18) / 7, y0 = 8, hh = 20, rh = 26;
        const bx = x0 + nameW;
        // header
        c.font = font(10.5, 650); c.textAlign = 'center'; c.textBaseline = 'middle';
        for (let j = 0; j < 7; j++) {
          const s = COLSCORE[j], col = tint(C, s, false);
          if (col) { c.globalAlpha = s === 1 ? 0.14 : s === 2 ? 0.28 : 0.3; c.fillStyle = col; c.fillRect(bx + j * cw + 1, y0, cw - 2, hh); c.globalAlpha = 1; }
          c.fillStyle = C.text2; c.fillText(String(s), bx + j * cw + cw / 2, y0 + hh / 2);
        }
        c.textAlign = 'left'; c.fillStyle = C.muted; c.fillText('points', x0, y0 + hh / 2);
        // rows
        NEWS_ROWS.forEach((row, i) => {
          const y = y0 + hh + i * rh, sc = r.rows[row.key], bands = row.key === 'spo2' && V.scale2 ? row.bands2 : row.bands;
          c.fillStyle = i % 2 ? C.surface : C.bg2; c.fillRect(x0, y, W - x0 - panelW - 12, rh);
          c.font = font(narrow ? 10 : 11, 600); c.fillStyle = C.text2; c.textAlign = 'left'; c.textBaseline = 'middle';
          c.fillText(row.name + (row.key === 'spo2' && V.scale2 ? ' (2)' : ''), x0 + 3, y + rh / 2 - 6);
          c.font = font(10); c.fillStyle = C.muted; c.fillText(row.val(V), x0 + 3, y + rh / 2 + 7);
          for (let j = 0; j < 7; j++) {
            const s = COLSCORE[j], cx = bx + j * cw, on = sc[1] === j, col = tint(C, s, true);
            if (bands[j]) {
              if (col && s > 0) { c.globalAlpha = on ? 0.8 : s === 1 ? 0.1 : 0.18; c.fillStyle = col; c.fillRect(cx + 1, y + 2, cw - 2, rh - 4); c.globalAlpha = 1; }
              else if (on) { c.globalAlpha = 0.45; c.fillStyle = C.ok; c.fillRect(cx + 1, y + 2, cw - 2, rh - 4); c.globalAlpha = 1; }
              if (on) { c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(cx + 1.5, y + 2.5, cw - 3, rh - 5); }
              if (cw >= 34) { c.font = font(cw < 50 ? 8.5 : 10, on ? 700 : 500); c.fillStyle = on ? C.text : C.text2; c.textAlign = 'center'; c.fillText(bands[j], cx + cw / 2, y + rh / 2); }
            }
          }
          c.font = font(13, 700); c.textAlign = 'center'; c.fillStyle = sc[0] === 0 ? C.muted : sc[0] === 3 ? C.bad : C.warn;
          c.fillText(String(sc[0]), bx + 7 * cw + scoreW / 2, y + rh / 2);
        });
        const tableBottom = y0 + hh + NEWS_ROWS.length * rh;
        if (V.scale2) { c.font = font(9.5); c.fillStyle = C.muted; c.textAlign = 'left'; c.fillText('Scale 2: 93 % or more scores 0 on air; on oxygen 93–94 scores 1, 95–96 scores 2, 97+ scores 3.', x0, tableBottom + 9); }
        // the total
        const bandCol = band.lv >= 3 ? C.bad : band.lv >= 2 ? C.warn : band.lv >= 1.5 ? C.warn : C.ok;
        if (panelW) {
          const px = W - panelW - 4, py = y0, pw = panelW - 4, ph = tableBottom - y0;
          c.fillStyle = C.surface; c.fillRect(px, py, pw, ph); c.strokeStyle = bandCol; c.lineWidth = 2; c.strokeRect(px + 1, py + 1, pw - 2, ph - 2);
          kit.label(c, 'NEWS2', px + pw / 2, py + 16, { size: 11.5, color: C.muted, align: 'center', weight: 600 });
          kit.label(c, String(r.total), px + pw / 2, py + 52, { size: 42, color: bandCol, align: 'center', weight: 750 });
          kit.label(c, band.name, px + pw / 2, py + 88, { size: 12, color: C.text, align: 'center', weight: 650 });
          c.font = font(10.5); c.fillStyle = C.text2; c.textAlign = 'center'; c.textBaseline = 'top';
          let yy = wrap(c, band.obs + '.', px + pw / 2, py + 102, pw - 16, 14);
          c.fillStyle = C.muted; wrap(c, band.resp, px + pw / 2, yy + 2, pw - 16, 13.5);
        }
        // the timeline
        const ty0 = tableBottom + (V.scale2 ? 30 : 24), ty1 = Hh - 34, tx0 = 40, tx1 = W - 12;
        kit.label(c, narrow ? 'NEWS2 (bars), systolic (below)' : 'Hour by hour: NEWS2 (bars) and systolic pressure (numbers below)', tx0, ty0 - 6, { size: 11.5, color: C.text2, weight: 650 });
        if (narrow) kit.label(c, 'Now: ' + r.total + ' — ' + band.name, tx1, ty0 - 6, { size: 11.5, color: bandCol, weight: 700, align: 'right' });
        const gy0 = ty0 + 12, Y = s => ty1 - s / 20 * (ty1 - gy0), slot = (tx1 - tx0) / SCEN.length;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.font = font(10); c.fillStyle = C.muted; c.textAlign = 'right'; c.textBaseline = 'middle';
        for (const s of [0, 5, 10, 15, 20]) { c.beginPath(); c.moveTo(tx0, Y(s)); c.lineTo(tx1, Y(s)); c.stroke(); c.fillText(String(s), tx0 - 5, Y(s)); }
        for (const [s, lab, col] of [[5, 'urgent (5)', C.warn], [7, 'emergency (7)', C.bad]]) {
          c.setLineDash([5, 4]); c.strokeStyle = col; c.beginPath(); c.moveTo(tx0, Y(s)); c.lineTo(tx1, Y(s)); c.stroke(); c.setLineDash([]);
          kit.label(c, lab, tx1 - 4, Y(s) - 7, { size: 10, color: col, align: 'right' });
        }
        if (!hist.length) kit.label(c, 'Press “Play: a patient becoming unwell” to watch the score hour by hour.', (tx0 + tx1) / 2, (gy0 + ty1) / 2, { size: 12, color: C.muted, align: 'center' });
        let firstUrgent = null, firstLow = null;
        hist.forEach(e => {
          const x = tx0 + e.h * slot, col = e.total >= 7 ? C.bad : e.total >= 5 ? C.warn : C.ok;
          c.globalAlpha = 0.8; c.fillStyle = col; c.fillRect(x + slot * 0.18, Y(e.total), slot * 0.64, ty1 - Y(e.total)); c.globalAlpha = 1;
          c.font = font(10, 650); c.fillStyle = C.text; c.textAlign = 'center'; c.textBaseline = 'bottom'; c.fillText(String(e.total), x + slot / 2, Y(e.total) - 2);
          c.textBaseline = 'top'; c.font = font(9.5); c.fillStyle = C.muted; c.fillText('h' + e.h, x + slot / 2, ty1 + 3);
          c.fillStyle = e.sbp <= 90 ? C.bad : C.text2; c.font = font(9.5, e.sbp <= 90 ? 700 : 500); c.fillText(String(e.sbp), x + slot / 2, ty1 + 15);
          if (firstUrgent == null && e.total >= 5) firstUrgent = e.h;
          if (firstLow == null && e.sbp <= 90) firstLow = e.h;
        });
        if (firstUrgent != null) kit.label(c, '▼ urgent review due', tx0 + firstUrgent * slot + slot / 2, gy0 + 2, { size: 10.5, color: C.warn, align: 'center', weight: 650, bg: C.bg2 });
        if (firstLow != null) kit.label(c, 'systolic ≤ 90 ▼', tx0 + firstLow * slot + slot / 2, gy0 + 18, { size: 10.5, color: C.bad, align: 'right', weight: 650, bg: C.bg2 });
        // read-outs
        ro.set('total', r.total + (r.red ? ' (includes a 3)' : ''));
        ro.set('risk', band.name);
        ro.set('obs', band.obs);
        ro.set('time', playing || hist.length ? 'hour ' + Math.min(hour, SCEN.length - 1) + ' of ' + (SCEN.length - 1) + (playing ? ' (playing)' : '') : '—');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 5. screening: lead time and overdiagnosis */
  // A cohort of 20 000 people aged 50, followed to 90. Some develop a lesion that can be found
  // before it causes symptoms; some lesions never progress. Every random number belongs to one
  // person and is drawn in a fixed order, so moving a slider changes the policy, not the people.
  function screenSim(o) {
    const R = o.R, N = 20000, END = 90, PC = 0.35, sample = [];
    const s = { d0: 0, d1: 0, dd0: 0, dd1: 0, surv0: 0, surv1: 0, over: 0, fpPeople: 0, fp: 0, det: 0 };
    for (let i = 0; i < N; i++) {
      const u = []; for (let j = 0; j < 33; j++) u.push(R());
      const other = 50 + Math.log(1 - 0.085 * Math.log(Math.max(u[0], 1e-12)) / 0.005) / 0.085;   // death from other causes (Gompertz)
      const onset = 40 + 50 * Math.sqrt(u[2]);
      const hasL = u[1] < 0.12 && onset < Math.min(other, END);
      const indolent = u[3] < o.indolent;
      const soj = 3 * Math.exp(0.7 * Math.sqrt(-2 * Math.log(Math.max(u[4], 1e-12))) * Math.cos(2 * Math.PI * u[5]));   // preclinical years
      const survT = -5 * Math.log(Math.max(u[6], 1e-12));                                                                   // years from symptoms to death, if not cured
      const uc = u[7];
      const sympt = hasL && !indolent ? onset + soj : Infinity;
      const dx0 = sympt < Math.min(other, END);
      const dd0 = dx0 && uc >= PC ? sympt + survT : Infinity;
      if (dx0) { s.d0++; if (!(dd0 <= sympt + 5 && dd0 < other)) s.surv0++; }
      if (dd0 < Math.min(other, END)) s.dd0++;
      let det = null, fpc = 0;
      for (let a = 50; a <= 74; a += o.interval) {
        if (a >= Math.min(other, END) || a >= sympt) break;
        const us = u[8 + (a - 50)];
        if (hasL && onset <= a) { if (us < o.sens) { det = a; break; } }
        else if (us > o.spec) fpc++;
      }
      if (fpc) { s.fpPeople++; s.fp += fpc; }
      let dx1 = dx0, age1 = sympt, dd1 = dd0, over = false, saved = false;
      if (det != null) {
        s.det++; dx1 = true; age1 = det;
        const cure1 = uc < PC + o.benefit * (1 - PC);
        dd1 = cure1 || indolent ? Infinity : sympt + survT;
        over = !dx0; if (over) s.over++;
        saved = dd0 < Math.min(other, END) && !(dd1 < Math.min(other, END));
      }
      if (dx1) { s.d1++; if (!(dd1 <= age1 + 5 && dd1 < other)) s.surv1++; }
      if (dd1 < Math.min(other, END)) s.dd1++;
      if ((dx0 || det != null) && sample.length < 12) sample.push({ onset, sympt, other: Math.min(other, END), indolent, dx0, det, dd0, dd1, over, saved, fpc });
    }
    return { s, sample, k: 10000 / N };
  }
  Hyper.sim('dx-screening', {
    title: 'Screening: survival rises, but do fewer people die?',
    blurb: `A simulated town of 20 000 people aged 50, followed to 90. Some develop a disease that has a silent, detectable phase (light bars) before symptoms (dark bars). Screening every few years from 50 to 74 finds some of it early (◆). The rows show twelve of the people affected; the bars on the right compare the whole town with and without screening.

- Start with **Deaths averted by earlier treatment** at 0: five-year survival jumps, yet deaths from the disease do not change at all. That is lead-time bias — the clock simply starts earlier.
- Raise the **harmless share**: more screen-detected cases are people who would never have known (overdiagnosed), and survival looks even better.
- Now give earlier treatment a real benefit: only then do deaths fall — the number a randomised trial would measure. Watch the false alarms too.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 380 });
      const ctl = kit.controls(box.side, [
        { id: 'interval', label: 'Screen every', min: 1, max: 5, step: 1, value: 2, unit: 'years' },
        { id: 'sens', label: 'Sensitivity of each screen', min: 30, max: 95, step: 1, value: 70, unit: '%' },
        { id: 'spec', label: 'Specificity of each screen', min: 80, max: 99.9, step: 0.1, value: 95, unit: '%' },
        { id: 'indolent', label: 'Harmless (never-progressing) share', min: 0, max: 60, step: 1, value: 25, unit: '%' },
        { id: 'benefit', label: 'Deaths averted by earlier treatment', min: 0, max: 100, step: 1, value: 0, unit: '%' },
        { type: 'buttons', items: [{ id: 'new', label: 'A new town', primary: true }] }
      ], id => { if (id === 'new') seed++; run(); loop.once(); });
      const ro = kit.readout(box.side, [['diag', 'Diagnosed per 10 000'], ['surv', 'Five-year survival'], ['deaths', 'Deaths from the disease'], ['saved', 'Lives saved per 10 000'], ['over', 'Overdiagnosed per 10 000'], ['fp', 'People with a false alarm']]);
      const V = ctl.values;
      let seed = 11, res = null;
      function run() {
        res = screenSim({ R: kit.fin.uniforms(seed), interval: Math.round(V.interval), sens: V.sens / 100, spec: V.spec / 100, indolent: V.indolent / 100, benefit: V.benefit / 100 });
        const s = res.s, k = res.k, f = x => String(Math.round(x * k));
        ro.set('diag', f(s.d0) + ' → ' + f(s.d1));
        ro.set('surv', pc(s.d0 ? s.surv0 / s.d0 : NaN, 0) + ' → ' + pc(s.d1 ? s.surv1 / s.d1 : NaN, 0));
        ro.set('deaths', f(s.dd0) + ' → ' + f(s.dd1));
        ro.set('saved', f(s.dd0 - s.dd1));
        ro.set('over', f(s.over));
        ro.set('fp', f(s.fpPeople) + ' per 10 000 (' + f(s.fp) + ' recalls)');
      }
      function draw() {
        if (!res) run();
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const narrow = W < 600, lx0 = narrow ? 12 : 16, lx1 = narrow ? W - 12 : W * 0.55, top = 42, bot = narrow ? Hh * 0.62 : Hh - 30;
        const A0 = 45, A1 = 90, X = a => lx0 + (clamp(a, A0, A1) - A0) / (A1 - A0) * (lx1 - lx0);
        // age axis and screening rounds
        c.font = font(10); c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top'; c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let a = 50; a <= 90; a += 10) { c.beginPath(); c.moveTo(X(a), top - 4); c.lineTo(X(a), bot); c.stroke(); c.fillText(String(a), X(a), bot + 3); }
        c.fillText('age', lx1 - 10, bot + 3);
        const iv = Math.round(V.interval);
        c.strokeStyle = C.accent; c.globalAlpha = 0.35; c.setLineDash([2, 3]);
        for (let a = 50; a <= 74; a += iv) { c.beginPath(); c.moveTo(X(a), top - 4); c.lineTo(X(a), bot); c.stroke(); }
        c.setLineDash([]); c.globalAlpha = 1;
        kit.label(c, 'screening rounds (dotted), ages 50–74', lx0, 12, { size: 11, color: C.accent });
        c.font = font(10.5); c.textAlign = 'left'; c.textBaseline = 'middle';
        let kx = lx0;
        for (const [t, col] of [['▮ silent', C.warn], ['▮ symptoms', C.bad], ['● found by symptoms', C.text2], ['◆ found by screening', C.accent], ['✕ death', C.muted]]) {
          c.fillStyle = col; c.fillText(t, kx, 28); kx += c.measureText(t).width + 10;
        }
        const rows = res.sample, rh = (bot - top) / Math.max(12, rows.length);
        rows.forEach((p, i) => {
          const y = top + i * rh + rh / 2;
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(X(50), y); c.lineTo(X(p.other), y); c.stroke();
          const endSilent = Math.min(p.sympt, p.other);
          c.globalAlpha = p.indolent ? 0.3 : 0.45; c.fillStyle = C.warn; c.fillRect(X(p.onset), y - 4, Math.max(1, X(endSilent) - X(p.onset)), 8); c.globalAlpha = 1;
          const death0 = Math.min(p.dd0, p.other), death1 = Math.min(p.dd1, p.other);
          if (p.dx0) { c.globalAlpha = 0.55; c.fillStyle = C.bad; c.fillRect(X(p.sympt), y - 4, Math.max(1, X(death0) - X(p.sympt)), 8); c.globalAlpha = 1; kit.dot(c, X(p.sympt), y, 4, C.bg2, C.text); }
          if (p.det != null) {
            const xd = X(p.det);
            c.fillStyle = C.accent; c.beginPath(); c.moveTo(xd, y - 6); c.lineTo(xd + 5, y); c.lineTo(xd, y + 6); c.lineTo(xd - 5, y); c.closePath(); c.fill();
          }
          const cross = (x, col) => { c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 4, y - 4); c.lineTo(x + 4, y + 4); c.moveTo(x + 4, y - 4); c.lineTo(x - 4, y + 4); c.stroke(); };
          if (p.saved) { c.globalAlpha = 0.35; cross(X(death0), C.bad); c.globalAlpha = 1; }
          if (death1 < 90) cross(X(death1), p.dd1 < p.other ? C.bad : C.muted);
          const tag = p.over ? ['overdiagnosed', C.warn] : p.saved ? ['saved', C.ok] : p.det != null && p.dx0 ? ['found ' + (p.sympt - p.det).toFixed(1) + ' y early', C.accent] : p.dx0 ? ['missed by screens', C.muted] : null;
          if (tag && !narrow) kit.label(c, tag[0], lx1 + 8, y, { size: 10, color: tag[1] });
        });
        // the whole town
        const s = res.s, k = res.k;
        const bx0 = narrow ? 40 : lx1 + 132, bx1 = W - 12, by0 = narrow ? bot + 40 : 64, by1 = Hh - 34;
        if (bx1 - bx0 > 80 && by1 - by0 > 60) {
          const groups = [['5-year survival', s.d0 ? s.surv0 / s.d0 : 0, s.d1 ? s.surv1 / s.d1 : 0, 1, v => Math.round(v * 100) + ' %'],
            ['diagnosed', s.d0 * k, s.d1 * k, null, v => String(Math.round(v))],
            ['deaths from it', s.dd0 * k, s.dd1 * k, null, v => String(Math.round(v))]];
          const gw = (bx1 - bx0) / 3;
          kit.label(c, 'Whole town: without / with screening', (bx0 + bx1) / 2, by0 - 22, { size: 11, weight: 650, color: C.text2, align: 'center' });
          groups.forEach(([name, a, b, max, fm], j) => {
            const m = max || Math.max(a, b, 1) * 1.15, gx = bx0 + j * gw, Yb = v => by1 - v / m * (by1 - by0 - 16);
            c.fillStyle = C.faint; c.fillRect(gx + gw * 0.12, Yb(a), gw * 0.34, by1 - Yb(a));
            c.fillStyle = C.accent; c.fillRect(gx + gw * 0.54, Yb(b), gw * 0.34, by1 - Yb(b));
            c.font = font(10, 650); c.textAlign = 'center'; c.textBaseline = 'bottom';
            c.fillStyle = C.muted; c.fillText(fm(a), gx + gw * 0.29, Yb(a) - 2);
            c.fillStyle = C.accent; c.fillText(fm(b), gx + gw * 0.71, Yb(b) - 2);
            c.font = font(10); c.fillStyle = C.text2; c.textBaseline = 'top'; c.fillText(name, gx + gw / 2, by1 + 4);
          });
          c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(bx0, by1); c.lineTo(bx1, by1); c.stroke();
          kit.label(c, 'per 10 000 people', (bx0 + bx1) / 2, by1 + 22, { size: 9.5, color: C.muted, align: 'center' });
        }
      }
      run();
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 6. confounding against randomisation */
  function rrCI(a, n1, b, n0) {
    // relative risk with a 95 % interval on the log scale (0.5 added to empty cells)
    const aa = a || 0.5, bb = b || 0.5, rr = (aa / n1) / (bb / n0);
    const se = Math.sqrt(Math.max(0, 1 / aa - 1 / n1 + 1 / bb - 1 / n0));
    return { rr, lo: rr * Math.exp(-1.96 * se), hi: rr * Math.exp(1.96 * se), se };
  }
  Hyper.sim('dx-confounding', {
    title: 'Coffee and a long life: association or cause?',
    blurb: `A simulated study follows people for ten years. Coffee has **no effect at all** on survival (unless you change the true effect). But a hidden factor — general good health — makes people both more likely to drink coffee (people who feel unwell often give it up) and less likely to die.

- In the **observational** study, coffee drinkers die less often: coffee looks protective. Tick **Show the hidden factor** to see why — the drinkers are mostly the healthy ones (green rings).
- Switch to a **randomised trial**: a coin decides who drinks coffee, the hidden factor is shared out evenly, and the "benefit" vanishes (apart from chance).
- Tick **Adjust for the hidden factor**: if it was measured, adjustment repairs the observational estimate. Real confounders are often unmeasured — which is why randomisation matters.`,
    mount(box, kit, params) {
      const P0 = params || {};
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'study', type: 'select', label: 'Study design', options: [['Observational: people choose', 'obs'], ['Randomised trial: a coin decides', 'rct']], value: P0.study || 'obs' },
        { id: 'link', label: 'Hidden factor’s pull on coffee drinking', min: 0, max: 0.8, step: 0.05, value: 0.5 },
        { id: 'effect', label: 'True effect of coffee (relative risk of death)', min: 0.5, max: 1.5, step: 0.05, value: 1, unit: '×' },
        { id: 'n', label: 'People in the study', min: 200, max: 20000, value: 2000, log: true, sig: 2 },
        { id: 'show', type: 'check', label: 'Show the hidden factor (good health)', value: false },
        { id: 'adjust', type: 'check', label: 'Adjust for the hidden factor', value: false },
        { type: 'buttons', items: [{ id: 'again', label: 'Run the study again', primary: true }] }
      ], id => { if (id === 'again') seed++; if (id !== 'show' && id !== 'adjust') run(); else summarise(); loop.once(); });
      const ro = kit.readout(box.side, [['r1', 'Died: coffee drinkers'], ['r0', 'Died: non-drinkers'], ['rr', 'Relative risk (95 % CI)'], ['adj', 'Adjusted for the hidden factor'], ['truth', 'The truth, built into the model'], ['verdict', 'What the study seems to say']]);
      const V = ctl.values;
      let seed = 5, P = null, S = null;
      function run() {
        const R = kit.fin.uniforms(seed), n = Math.round(V.n), H = new Uint8Array(n), K = new Uint8Array(n), D = new Uint8Array(n);
        for (let i = 0; i < n; i++) {
          const u1 = R(), u2 = R(), u3 = R();
          H[i] = u1 < 0.5 ? 1 : 0;
          const pk = V.study === 'rct' ? 0.5 : 0.5 + (H[i] ? 1 : -1) * V.link / 2;
          K[i] = u2 < pk ? 1 : 0;
          const risk = (H[i] ? 0.08 : 0.2) * (K[i] ? V.effect : 1);
          D[i] = u3 < Math.min(1, risk) ? 1 : 0;
        }
        P = { n, H, K, D };
        summarise();
      }
      function summarise() {
        const { n, H, K, D } = P;
        const t = [[[0, 0], [0, 0]], [[0, 0], [0, 0]]];   // t[h][k] = [deaths, people]
        for (let i = 0; i < n; i++) { const e = t[H[i]][K[i]]; e[1]++; e[0] += D[i]; }
        const a = t[0][1][0] + t[1][1][0], n1 = t[0][1][1] + t[1][1][1], b = t[0][0][0] + t[1][0][0], n0 = t[0][0][1] + t[1][0][1];
        const ci = n1 && n0 ? rrCI(a, n1, b, n0) : null;
        // Mantel–Haenszel relative risk across the two strata of the hidden factor
        let num = 0, den = 0;
        for (const h of [0, 1]) { const N = t[h][0][1] + t[h][1][1]; if (!N) continue; num += t[h][1][0] * t[h][0][1] / N; den += t[h][0][0] * t[h][1][1] / N; }
        const mh = den > 0 ? num / den : NaN;
        S = { a, n1, b, n0, ci, mh, t };
        ro.set('r1', n1 ? pc(a / n1) + ' of ' + n1 : '—');
        ro.set('r0', n0 ? pc(b / n0) + ' of ' + n0 : '—');
        ro.set('rr', ci ? ci.rr.toFixed(2) + ' (' + ci.lo.toFixed(2) + '–' + ci.hi.toFixed(2) + ')' : '—');
        ro.set('adj', V.adjust ? (Number.isFinite(mh) ? mh.toFixed(2) : '—') : 'tick “Adjust” to see');
        ro.set('truth', V.effect.toFixed(2) + (Math.abs(V.effect - 1) < 0.001 ? ' (no effect)' : ''));
        const est = V.adjust && Number.isFinite(mh) ? mh : ci ? ci.rr : 1;
        let verdict = '—';
        if (ci) {
          const sig = V.adjust ? null : (ci.hi < 1 ? 'lower' : ci.lo > 1 ? 'higher' : null);
          verdict = V.adjust ? 'after adjustment: relative risk ' + est.toFixed(2)
            : sig ? 'coffee drinkers ' + Math.round(Math.abs(1 - ci.rr) * 100) + ' % ' + sig + ' death rate' : 'no clear difference';
        }
        ro.set('verdict', verdict);
      }
      function draw() {
        if (!P) run();
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const { n, H, K, D } = P;
        const gw = W > 600 ? W * 0.64 : W, panels = [[1, 'Coffee drinkers'], [0, 'Non-drinkers']];
        const pw = (gw - 24) / 2, py0 = 44, py1 = Hh - 16;
        panels.forEach(([k, name], j) => {
          const x0 = 10 + j * (pw + 6), idx = [];
          for (let i = 0; i < n && idx.length < 400; i++) if (K[i] === k) idx.push(i);
          const tot = k ? S.n1 : S.n0, dead = k ? S.a : S.b;
          c.fillStyle = C.surface; c.fillRect(x0, py0 - 34, pw, py1 - py0 + 34);
          kit.label(c, name + ' (' + tot + ')', x0 + 8, py0 - 22, { size: 12, weight: 650 });
          kit.label(c, 'died within 10 years: ' + (tot ? pc(dead / tot) : '—'), x0 + 8, py0 - 7, { size: 11, color: C.bad });
          const cols = Math.max(4, Math.floor(Math.sqrt(400 * pw / Math.max(1, py1 - py0 - 8)))), cell = Math.min((pw - 12) / cols, 14);
          idx.forEach((i, m) => {
            const x = x0 + 6 + (m % cols) * cell + cell / 2, y = py0 + 6 + Math.floor(m / cols) * cell + cell / 2;
            if (y > py1 - 2) return;
            const r = Math.max(1.6, cell * 0.32);
            c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = D[i] ? C.bad : C.faint; c.fill();
            if (V.show) { c.strokeStyle = H[i] ? C.ok : C.warn; c.lineWidth = Math.max(1, cell * 0.12); c.beginPath(); c.arc(x, y, r + Math.max(1.2, cell * 0.14), 0, Math.PI * 2); c.stroke(); }
          });
          if (tot > idx.length) kit.label(c, 'first ' + idx.length + ' of ' + tot + ' shown', x0 + pw - 8, py1 - 6, { size: 9.5, color: C.muted, align: 'right', bg: C.surface });
        });
        // risks with their intervals
        if (W > 600) {
          const bx0 = gw + 34, bx1 = W - 14, by0 = 40, by1 = Hh - 70;
          const risks = [[S.n1 ? S.a / S.n1 : 0, S.n1, 'coffee', C.accent], [S.n0 ? S.b / S.n0 : 0, S.n0, 'no coffee', C.muted]];
          const Y = v => by1 - v / 0.3 * (by1 - by0);
          c.strokeStyle = C.grid; c.lineWidth = 1; c.font = font(10); c.fillStyle = C.muted; c.textAlign = 'right'; c.textBaseline = 'middle';
          for (let v = 0; v <= 0.3001; v += 0.1) { c.beginPath(); c.moveTo(bx0, Y(v)); c.lineTo(bx1, Y(v)); c.stroke(); c.fillText(Math.round(v * 100) + ' %', bx0 - 4, Y(v)); }
          const bw = (bx1 - bx0) / 2;
          risks.forEach(([r, nn, lab, col], j) => {
            const x = bx0 + j * bw + bw / 2;
            c.globalAlpha = 0.75; c.fillStyle = col; c.fillRect(x - bw * 0.28, Y(Math.min(r, 0.3)), bw * 0.56, by1 - Y(Math.min(r, 0.3))); c.globalAlpha = 1;
            if (nn) { const [lo, hi] = kit.med.wilson(Math.round(r * nn), nn); c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, Y(Math.min(lo, 0.3))); c.lineTo(x, Y(Math.min(hi, 0.3))); c.moveTo(x - 5, Y(Math.min(lo, 0.3))); c.lineTo(x + 5, Y(Math.min(lo, 0.3))); c.moveTo(x - 5, Y(Math.min(hi, 0.3))); c.lineTo(x + 5, Y(Math.min(hi, 0.3))); c.stroke(); }
            c.fillStyle = C.text2; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillText(lab, x, by1 + 4);
          });
          kit.label(c, '10-year death risk (95 % CI)', (bx0 + bx1) / 2, by0 - 20, { size: 11, weight: 650, color: C.text2, align: 'center' });
          const est = S.ci ? S.ci.rr : NaN;
          kit.label(c, 'relative risk ' + (Number.isFinite(est) ? est.toFixed(2) : '—'), (bx0 + bx1) / 2, by1 + 30, { size: 12, weight: 700, align: 'center', color: C.accent });
          if (V.adjust) kit.label(c, 'adjusted ' + (Number.isFinite(S.mh) ? S.mh.toFixed(2) : '—'), (bx0 + bx1) / 2, by1 + 48, { size: 11.5, weight: 650, align: 'center', color: C.ok });
          kit.label(c, 'truth ' + V.effect.toFixed(2), (bx0 + bx1) / 2, by1 + (V.adjust ? 64 : 48), { size: 11, align: 'center', color: C.muted });
        }
        if (V.show) kit.label(c, '○ green ring: good health   ○ amber ring: poorer health   ● red: died', 12, Hh - 6, { size: 10, color: C.muted, bg: C.bg2 });
      }
      run();
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 7. many small trials */
  Hyper.sim('dx-many-trials', {
    title: 'Twenty trials of a useless treatment',
    blurb: `Each row is one randomised trial: the square is its estimate of the relative risk (left of 1 means fewer events with treatment), the line its 95 % confidence interval. Highlighted trials are "statistically significant" (the interval misses 1). The diamonds pool the trials together.

- With the true effect at 0 %, run the trials a few times: about 1 in 20 comes out significant by chance — sometimes as "benefit", sometimes as "harm".
- Tick **Publish only the "significant" benefits**: the pooled estimate of what gets published now shows a benefit that does not exist — publication bias.
- Give the treatment a real 20 % effect with 100 patients per group: most trials still miss it (low power). Raise the group size and watch them converge on the truth.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 'k', label: 'Number of trials', min: 5, max: 100, step: 1, value: 20 },
        { id: 'n', label: 'Patients per group', min: 20, max: 2000, value: 100, log: true, sig: 2 },
        { id: 'cer', label: 'Event rate without treatment', min: 5, max: 60, step: 1, value: 20, unit: '%' },
        { id: 'rrr', label: 'True relative risk reduction', min: 0, max: 50, step: 1, value: 0, unit: '%' },
        { id: 'pub', type: 'check', label: 'Publish only the "significant" benefits', value: false },
        { type: 'buttons', items: [{ id: 'again', label: 'Run the trials again', primary: true }] }
      ], id => { if (id === 'again') seed++; if (id !== 'pub') run(); else summarise(); loop.once(); });
      const ro = kit.readout(box.side, [['sig', '"Significant" trials'], ['exp', 'Expected by chance alone'], ['any', 'Chance of at least one fluke'], ['all', 'Pooled, all trials'], ['pubd', 'Pooled, published only'], ['truth', 'True relative risk']]);
      const V = ctl.values;
      let seed = 3, T = [], S = {};
      function pool(list) {
        let sw = 0, swx = 0;
        for (const t of list) { const w = 1 / (t.se * t.se); sw += w; swx += w * Math.log(t.rr); }
        if (!sw) return null;
        const m = swx / sw, se = 1 / Math.sqrt(sw);
        return { rr: Math.exp(m), lo: Math.exp(m - 1.96 * se), hi: Math.exp(m + 1.96 * se) };
      }
      function run() {
        const R = kit.fin.uniforms(seed), k = Math.round(V.k), n = Math.round(V.n), p0 = V.cer / 100, p1 = p0 * (1 - V.rrr / 100);
        T = [];
        for (let i = 0; i < k; i++) {
          const b = binom(R, n, p0), a = binom(R, n, p1), ci = rrCI(a, n, b, n);
          const z = Math.log(ci.rr) / (ci.se || 1), p = 2 * (1 - kit.fin.ncdf(Math.abs(z)));
          T.push({ rr: ci.rr, lo: ci.lo, hi: ci.hi, se: ci.se || 1, p, sig: ci.hi < 1 || ci.lo > 1 });
        }
        summarise();
      }
      function summarise() {
        const k = T.length, sig = T.filter(t => t.sig);
        S = { all: pool(T), pub: pool(sig.filter(t => t.rr < 1)), nsig: sig.length };
        const fmt = q => q ? q.rr.toFixed(2) + ' (' + q.lo.toFixed(2) + '–' + q.hi.toFixed(2) + ')' : '— (none published)';
        ro.set('sig', sig.length + ' of ' + k + ' (' + sig.filter(t => t.rr < 1).length + ' "benefit", ' + sig.filter(t => t.rr > 1).length + ' "harm")');
        ro.set('exp', V.rrr > 0 ? 'more: there is a real effect' : (k * 0.05).toFixed(1));
        ro.set('any', V.rrr > 0 ? '—' : pc(1 - Math.pow(0.95, k), 0));
        ro.set('all', fmt(S.all));
        ro.set('pubd', fmt(S.pub));
        ro.set('truth', (1 - V.rrr / 100).toFixed(2));
      }
      function draw() {
        if (!T.length) run();
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const x0 = 70, x1 = W - 20, y0 = 34, y1 = Hh - 74, lmin = Math.log(0.25), lmax = Math.log(4);
        const X = v => x0 + (Math.log(clamp(v, 0.25, 4)) - lmin) / (lmax - lmin) * (x1 - x0);
        c.font = font(10.5); c.textAlign = 'center'; c.textBaseline = 'top'; c.lineWidth = 1;
        for (const v of [0.25, 0.5, 1, 2, 4]) { c.strokeStyle = v === 1 ? C.axis : C.grid; c.lineWidth = v === 1 ? 1.5 : 1; c.beginPath(); c.moveTo(X(v), y0 - 6); c.lineTo(X(v), Hh - 30); c.stroke(); c.fillStyle = C.muted; c.fillText(String(v), X(v), Hh - 26); }
        c.fillText('relative risk (log scale)', (x0 + x1) / 2, Hh - 13);
        kit.label(c, '← favours treatment', X(1) - 8, 14, { size: 11, color: C.ok, align: 'right' });
        kit.label(c, 'favours control →', X(1) + 8, 14, { size: 11, color: C.bad });
        const truth = 1 - V.rrr / 100;
        c.setLineDash([5, 4]); c.strokeStyle = C.ok; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(truth), y0 - 6); c.lineTo(X(truth), y1 + 4); c.stroke(); c.setLineDash([]);
        kit.label(c, 'truth', X(truth) + 4, y0 - 2, { size: 10, color: C.ok });
        const k = T.length, rh = (y1 - y0) / Math.max(k, 1);
        T.forEach((t, i) => {
          const y = y0 + i * rh + rh / 2, hidden = V.pub && !(t.sig && t.rr < 1);
          const col = t.sig ? (t.rr < 1 ? C.accent : C.bad) : C.muted;
          c.globalAlpha = hidden ? 0.15 : 1;
          c.strokeStyle = col; c.lineWidth = Math.max(1, Math.min(2, rh * 0.25));
          c.beginPath(); c.moveTo(X(t.lo), y); c.lineTo(X(t.hi), y); c.stroke();
          const sz = Math.max(2, Math.min(5, rh * 0.35));
          c.fillStyle = col; c.fillRect(X(t.rr) - sz, y - sz, 2 * sz, 2 * sz);
          if (rh >= 11) { c.font = font(Math.min(10, rh * 0.75)); c.fillStyle = C.muted; c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText('trial ' + (i + 1), x0 - 8, y); }
          c.globalAlpha = 1;
        });
        const diamond = (q, y, col, lab) => {
          if (!q) { kit.label(c, lab + ': none', x0 - 8, y, { size: 10.5, color: C.muted, align: 'right' }); return; }
          c.fillStyle = col; c.beginPath(); c.moveTo(X(q.lo), y); c.lineTo(X(q.rr), y - 6); c.lineTo(X(q.hi), y); c.lineTo(X(q.rr), y + 6); c.closePath(); c.fill();
          kit.label(c, lab, x0 - 8, y, { size: 10.5, color: col, align: 'right', weight: 650 });
        };
        diamond(S.all, y1 + 16, C.text2, 'all');
        if (V.pub) diamond(S.pub, y1 + 32, C.warn, 'published');
      }
      run();
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 8. imaging: X-rays and ultrasound */
  // mass attenuation coefficients (cm²/g), approximate values from standard tables, at these energies (keV)
  const XE = [20, 30, 40, 50, 60, 80, 100, 150];
  const XMU = {
    water: [0.8096, 0.3756, 0.2683, 0.2269, 0.2059, 0.1837, 0.1707, 0.1505],
    bone: [4.001, 1.331, 0.6655, 0.4242, 0.3148, 0.2229, 0.1855, 0.1480],
    fat: [0.5580, 0.2994, 0.2326, 0.2046, 0.1891, 0.1707, 0.1592, 0.1405]
  };
  function massAtt(tab, E) {
    E = clamp(E, XE[0], XE[XE.length - 1]);
    let i = 0; while (i < XE.length - 2 && E > XE[i + 1]) i++;
    const f = Math.log(E / XE[i]) / Math.log(XE[i + 1] / XE[i]);
    return Math.exp(Math.log(tab[i]) + f * (Math.log(tab[i + 1]) - Math.log(tab[i])));
  }
  // linear attenuation (1/cm) of each material at energy E; bone scaled by its mineral content
  function muOf(mat, E, boneFrac) {
    if (mat === 'soft') return 1.05 * massAtt(XMU.water, E);
    if (mat === 'lung') return 0.26 * massAtt(XMU.water, E);
    if (mat === 'fat') return 0.95 * massAtt(XMU.fat, E);
    // dense (cortical) bone at full mineral content; less mineral leaves more soft-tissue-like matrix
    if (mat === 'bone') return 1.92 * boneFrac * massAtt(XMU.bone, E) + 1.05 * Math.max(0, 1 - boneFrac) * massAtt(XMU.water, E);
    return 0;
  }
  // cross-sections: ellipses [cx, cy, rx, ry, material] in cm, drawn in order (later ones on top); y is depth from the front
  const PHANTOMS = {
    chest: { w: 36, d: 24, shapes: [[0, 11.5, 16.5, 11, 'fat'], [0, 11.5, 15.6, 10.2, 'soft'], [-7.4, 11, 6, 7.6, 'lung'], [7.4, 11, 6, 7.6, 'lung'],
      [2.6, 8.2, 5.2, 4.6, 'soft'], [-1.4, 15, 1.4, 1.4, 'soft'], [0, 18.6, 2.3, 2.1, 'bone'], [0, 1.9, 1.6, 0.7, 'bone'],
      [-13.4, 6.5, 1, 0.7, 'bone'], [13.4, 6.5, 1, 0.7, 'bone'], [-12.2, 16.5, 1, 0.7, 'bone'], [12.2, 16.5, 1, 0.7, 'bone'], [-8.5, 2.6, 1, 0.7, 'bone'], [8.5, 2.6, 1, 0.7, 'bone']],
      labels: [[-7.4, 12, 'lung'], [9.6, 14.5, 'lung'], [2.6, 8.2, 'heart'], [0, 21.8, 'spine']] },
    limb: { w: 22, d: 18, shapes: [[0, 9, 8.4, 8.4, 'fat'], [0, 9, 6.8, 6.8, 'soft'], [0.6, 9.4, 1.6, 1.6, 'bone'], [0.6, 9.4, 0.95, 0.95, 'fat']],
      labels: [[0.6, 12, 'femur'], [-4.2, 9, 'muscle'], [-7.6, 9, 'fat']] }
  };
  function matAt(ph, x, y) {
    const sh = ph.shapes;
    for (let i = sh.length - 1; i >= 0; i--) { const s = sh[i], dx = (x - s[0]) / s[2], dy = (y - s[1]) / s[3]; if (dx * dx + dy * dy <= 1) return s[4]; }
    return 'air';
  }
  // ultrasound tissues: speed (m/s), acoustic impedance (MRayl), attenuation (dB/cm/MHz), backscatter
  const TIS = {
    gel: { c: 1540, Z: 1.54, a: 0, s: 0 }, air: { c: 343, Z: 0.0004, a: 0, s: 0 },
    skin: { c: 1600, Z: 1.7, a: 1, s: 2e-5 }, fat: { c: 1450, Z: 1.38, a: 0.6, s: 0.5e-5 },
    muscle: { c: 1580, Z: 1.7, a: 1, s: 1.1e-5 }, liver: { c: 1550, Z: 1.65, a: 0.5, s: 1e-5 },
    fluid: { c: 1530, Z: 1.53, a: 0.002, s: 0 }, blood: { c: 1570, Z: 1.61, a: 0.2, s: 0.02e-5 },
    bone: { c: 3500, Z: 7.8, a: 20, s: 4e-5 }
  };
  const US_W = 6, US_D = 12, NL = 96, NB = 240;
  function usTissue(x, z, gel) {
    if (z < 0.12) return gel ? 'gel' : 'air';
    if (z < 0.32) return 'skin';
    const zf = 1.8 + 0.15 * Math.sin(x * 1.3), zm = 3.2 + 0.12 * Math.sin(x * 0.9 + 1);
    const dxr = (x - 5.0) / 0.95, dzr = (z - 2.5) / 0.6;
    if (dxr * dxr + dzr * dzr <= 1) return 'bone';
    if (z < zf) return 'fat';
    if (z < zm) return 'muscle';
    if ((x - 2.3) * (x - 2.3) + (z - 6.2) * (z - 6.2) <= 1.2 * 1.2) return 'fluid';
    if ((x - 4.4) * (x - 4.4) + (z - 8.6) * (z - 8.6) <= 0.42 * 0.42) return 'blood';
    return 'liver';
  }
  Hyper.sim('dx-imaging', {
    title: 'Seeing inside: X-rays and ultrasound',
    blurb: `Two ways of looking inside the body, computed from real physics with typical tissue properties (approximate values).

**X-rays**: photons stream down through a cross-section of the body; bone stops many, lungs let most through. The strip below is the image the detector records — bright where few X-rays arrived.
- Lower the photon energy: contrast between bone and soft tissue grows, but far fewer X-rays get through, so a much larger dose is needed. Raise it: the dose falls and the contrast fades.
- Reduce the bone mineral to 60 %: thinner, less dense bone lets more through — what osteoporosis does.

**Ultrasound**: each column of the picture is one pulse–echo line, placed by the machine at depth = speed × time ÷ 2. The dot on the highlighted line is the pulse; its echoes rise back to the probe.
- Raise the frequency: finer detail near the surface, but the deep liver fades into noise. Lower it to see deeper.
- Turn off time-gain compensation: deeper echoes are weaker, and the picture darkens with depth. Notice the black cyst with a bright band behind it, and the shadow under the rib.
- Remove the gel: the air gap reflects almost everything, and nothing is seen. Change the speed the machine assumes: every depth is misplaced.`,
    mount(box, kit, params) {
      const P0 = params || {};
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Imaging', options: [['X-rays', 'xray'], ['Ultrasound', 'ultrasound']], value: P0.mode === 'ultrasound' ? 'ultrasound' : 'xray' },
        { id: 'phantom', type: 'select', label: 'Body part', options: [['Chest (lungs, heart, spine)', 'chest'], ['Thigh (fat, muscle, bone)', 'limb']], value: 'chest' },
        { id: 'energy', label: 'Photon energy (effective)', min: 20, max: 120, step: 1, value: 50, unit: 'keV' },
        { id: 'bone', label: 'Bone mineral', min: 40, max: 120, step: 1, value: 100, unit: '%' },
        { id: 'freq', label: 'Frequency', min: 2, max: 15, step: 0.5, value: 5, unit: 'MHz' },
        { id: 'cset', label: 'Speed the machine assumes', min: 1400, max: 1700, step: 10, value: 1540, unit: 'm/s' },
        { id: 'tgc', type: 'check', label: 'Time-gain compensation', value: true },
        { id: 'gel', type: 'check', label: 'Gel between probe and skin', value: true },
        { id: 'line', label: 'Highlighted scan line', min: 0, max: 100, step: 1, value: 38, unit: '%' }
      ], id => { if (id === 'mode') modeUI(); if (id !== 'line') dirty = true; loop.once(); });
      const ro = kit.readout(box.side, [['tt', 'Transmitted beside the bone'], ['tb', 'Transmitted through the bone'], ['con', 'Bone contrast'], ['dose', 'Dose needed (vs 60 keV)'], ['hvl', 'Half-value layer, soft tissue'],
        ['lam', 'Wavelength'], ['loss', 'Round-trip loss, 10 cm of liver'], ['echo', 'Cyst front wall: echo time'], ['depth', 'Placed at / really at']]);
      const V = ctl.values, XR = ['phantom', 'energy', 'bone'], US = ['freq', 'cset', 'tgc', 'gel', 'line'], XRO = ['tt', 'tb', 'con', 'dose', 'hvl'], USO = ['lam', 'loss', 'echo', 'depth'];
      function modeUI() { const x = V.mode === 'xray'; XR.forEach(k => ctl.show(k, x)); US.forEach(k => ctl.show(k, !x)); XRO.forEach(k => ro.show(k, x)); USO.forEach(k => ro.show(k, !x)); }
      let dirty = true, xr = null, us = null, anim = 0, usCanvas = null;
      const photons = [], RND = kit.fin.uniforms(17);
      const NX = 200;
      /* ---------- X-rays: optical depth along each vertical ray */
      function computeX() {
        const ph = PHANTOMS[V.phantom] || PHANTOMS.chest, E = V.energy, bf = V.bone / 100, NY = 200;
        const mus = { air: 0, soft: muOf('soft', E, bf), lung: muOf('lung', E, bf), fat: muOf('fat', E, bf), bone: muOf('bone', E, bf) };
        const mus60 = { air: 0, soft: muOf('soft', 60, bf), lung: muOf('lung', 60, bf), fat: muOf('fat', 60, bf), bone: muOf('bone', 60, bf) };
        const dy = ph.d / NY, cols = [];
        for (let i = 0; i < NX; i++) {
          const x = -ph.w / 2 + (i + 0.5) / NX * ph.w, cum = new Float32Array(NY + 1);
          let tau = 0, tau60 = 0;
          for (let j = 0; j < NY; j++) { const m = matAt(ph, x, (j + 0.5) * dy); tau += mus[m] * dy; tau60 += mus60[m] * dy; cum[j + 1] = tau; }
          cols.push({ x, tau, tau60, cum, T: Math.exp(-tau) });
        }
        // reference paths: through the thickest soft tissue beside the bone, and through the bone
        const ref = V.phantom === 'limb' ? { tissue: -4.5, bone: -0.7 } : { tissue: 3, bone: 0 };
        const colAt = x => cols[clamp(Math.round((x + ph.w / 2) / ph.w * NX - 0.5), 0, NX - 1)];
        const ct = colAt(ref.tissue), cb = colAt(ref.bone);
        xr = { ph, E, mus, cols, NY, dy, ct, cb };
        const Tt = Math.exp(-ct.tau), Tb = Math.exp(-cb.tau);
        const frac = T => T >= 0.001 ? pc(T, 2) : T > 1e-300 ? '1 in ' + kit.fmt(1 / T, 2) : 'none';
        ro.set('tt', frac(Tt) + ' (as much as ' + kit.fmt(ct.tau / Math.max(mus.soft, 1e-9), 3) + ' cm of soft tissue)');
        ro.set('tb', frac(Tb));
        ro.set('con', pc(1 - Tb / Math.max(Tt, 1e-300), 0) + ' fewer X-rays behind bone');
        const doseRel = Math.exp(ct.tau - ct.tau60);
        ro.set('dose', doseRel >= 1000 ? 'over 1 000 ×' : kit.fmt(doseRel, 2) + ' ×');
        ro.set('hvl', kit.fmt(Math.LN2 / mus.soft, 2) + ' cm (μ = ' + kit.fmt(mus.soft, 3) + ' per cm)');
      }
      /* ---------- ultrasound: one pulse-echo line per column */
      function computeU() {
        const f = V.freq, cA = V.cset, R = kit.fin.uniforms(29), dz = 0.02, NZ = Math.round(US_D / dz);
        const img = new Float32Array(NL * NB), lines = [];
        const sigAx = Math.max(0.6, 4.6 / f / 2 / (US_D * 10 / NB));   // pulse length ≈ 3 wavelengths, in depth bins
        for (let l = 0; l < NL; l++) {
          const x = (l + 0.5) / NL * US_W, raw = new Float64Array(NB);
          let prev = null, T = 1, att = 0, t = 0;
          const tz = new Float32Array(NZ + 1), ifs = [];
          for (let k = 0; k < NZ; k++) {
            const z = (k + 0.5) * dz, name = usTissue(x, z, V.gel), m = TIS[name];
            const bin = Math.floor(cA * t / 2 * 100 / US_D * NB);
            if (prev && prev !== m) {
              const Rf = ((m.Z - prev.Z) / (m.Z + prev.Z)) * ((m.Z - prev.Z) / (m.Z + prev.Z));
              if (bin < NB) raw[bin] += T * Rf * Math.pow(10, -att / 10);
              if (Rf > 0.5) for (let r = 2; r <= 7; r++) { const b2 = bin * r; if (b2 < NB) raw[b2] += T * Math.pow(Rf, r) * 0.25; }   // reverberation
              if (Rf > 1e-3) ifs.push({ z, t, R: Rf });
              T *= (1 - Rf) * (1 - Rf);
            }
            if (m.s && bin < NB) {
              const stripe = name === 'muscle' ? 0.5 + 0.9 * Math.pow(Math.sin(z * 22 + x * 0.6), 2) : 1;
              raw[bin] += T * m.s * stripe * -Math.log(Math.max(R(), 1e-9)) * Math.pow(10, -att / 10);
            } else R();
            att += 2 * m.a * f * dz; t += 2 * dz / 100 / m.c; tz[k + 1] = t / 2;
            prev = m;
          }
          // the pulse length blurs along depth
          const sm = new Float64Array(NB), w = Math.ceil(sigAx * 2.5);
          for (let b = 0; b < NB; b++) { let s = 0, ws = 0; for (let d = -w; d <= w; d++) { const q = b + d; if (q < 0 || q >= NB) continue; const g = Math.exp(-0.5 * d * d / (sigAx * sigAx)); s += raw[q] * g; ws += g; } sm[b] = s / ws; }
          for (let b = 0; b < NB; b++) img[b * NL + l] = sm[b];
          lines.push({ x, tz, ifs, tEnd: t });
        }
        // the beam width blurs sideways; then noise, gain and log compression
        const sigLat = Math.max(0.5, 6 / f / (US_W * 10 / NL)), wl = Math.ceil(sigLat * 2.5), out = new Float32Array(NL * NB), db = new Float32Array(NL * NB);
        for (let b = 0; b < NB; b++) for (let l = 0; l < NL; l++) {
          let s = 0, ws = 0;
          for (let d = -wl; d <= wl; d++) { const q = l + d; if (q < 0 || q >= NL) continue; const g = Math.exp(-0.5 * d * d / (sigLat * sigLat)); s += img[b * NL + q] * g; ws += g; }
          const depth = (b + 0.5) / NB * US_D;
          const I = s / ws + Math.pow(10, -11.8) * -Math.log(Math.max(R(), 1e-9));   // the receiver's electronic noise
          // time-gain compensation assumes 0.5 dB/cm/MHz and, like a real machine, has a limited range
          const gain = 6 + (V.tgc ? Math.min(2 * 0.5 * f * depth, 45) : 0);
          const d = 10 * Math.log10(I) + gain;
          db[b * NL + l] = d;
          out[b * NL + l] = clamp((d + 80) / 60, 0, 1);
        }
        us = { out, db, lines, f, cA };
        // the cyst's front wall on the line through its centre
        const lc = lines[clamp(Math.round(2.3 / US_W * NL - 0.5), 0, NL - 1)], wall = lc.ifs.find(q => q.z > 4.7 && q.z < 5.3);
        ro.set('lam', kit.fmt(1540 / (f * 1e6) * 1000, 2) + ' mm (in soft tissue)');
        ro.set('loss', Math.round(2 * 0.5 * f * 10) + ' dB (' + (V.tgc ? 'compensated by the gain' : 'not compensated') + ')');
        if (wall && V.gel) {
          ro.set('echo', kit.fmt(wall.t * 1e6, 3) + ' µs');
          ro.set('depth', kit.fmt(cA * wall.t / 2 * 100, 3) + ' cm / ' + kit.fmt(wall.z, 3) + ' cm');
        } else { ro.set('echo', V.gel ? '—' : 'no echo: the air gap reflects it all'); ro.set('depth', '—'); }
        // the picture
        if (!usCanvas && typeof document !== 'undefined') { usCanvas = document.createElement('canvas'); usCanvas.width = NL; usCanvas.height = NB; }
        us.canvas = usCanvas;
        const cv = usCanvas, g = cv && cv.getContext ? cv.getContext('2d') : null;
        if (g) {
          const im = g.createImageData(NL, NB);
          for (let i = 0; i < NL * NB; i++) { const v = Math.round(255 * Math.pow(out[i], 0.9)); im.data[4 * i] = v; im.data[4 * i + 1] = v; im.data[4 * i + 2] = v; im.data[4 * i + 3] = 255; }
          g.putImageData(im, 0, 0);
        }
      }
      function drawX(c, C, W, Hh, dt) {
        const { ph, cols, NY, dy } = xr;
        const w = W - 30, sx = w / ph.w, secH = Math.min((Hh - 120) * 0.72, ph.d * sx * 0.62);
        const scale = Math.min(sx, secH / ph.d), bw = ph.w * scale, bx0 = (W - bw) / 2, by0 = 36, bh = ph.d * scale;
        const X = x => bx0 + (x + ph.w / 2) * scale, Y = y => by0 + y * scale;
        // source and beam
        c.fillStyle = C.surface; c.fillRect(bx0, 8, bw, 12);
        kit.label(c, 'X-ray beam (' + Math.round(V.energy) + ' keV) ↓', bx0 + 6, 14, { size: 10.5, color: C.muted });
        // the cross-section
        const fills = { fat: kit.hue(45, 0.45), soft: kit.hue(355, 0.38), lung: kit.hue(200, 0.14), bone: C.dark ? 'rgba(235,235,225,0.92)' : 'rgba(120,115,100,0.9)' };
        for (const s of ph.shapes) { c.beginPath(); c.ellipse(X(s[0]), Y(s[1]), s[2] * scale, s[3] * scale, 0, 0, Math.PI * 2); c.fillStyle = fills[s[4]] || 'transparent'; c.fill(); }
        for (const [x, y, t] of ph.labels) kit.label(c, t, X(x), Y(y), { size: 10.5, color: C.text2, align: 'center', weight: 600 });
        if (bx0 > 84) {
          c.font = font(10.5); c.textAlign = 'left'; c.textBaseline = 'middle';
          [['fat', 'fat'], ['soft tissue', 'soft'], ['lung', 'lung'], ['bone', 'bone']].forEach(([t, m], i) => {
            const ky = by0 + 10 + i * 18;
            c.fillStyle = fills[m]; c.fillRect(12, ky - 5, 10, 10); c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(12, ky - 5, 10, 10);
            c.fillStyle = C.text2; c.fillText(t, 27, ky);
          });
        }
        // photons: each travels down its column until the optical depth it can survive runs out
        const target = 70;
        while (photons.length < target) {
          const i = Math.floor(RND() * NX), stop = -Math.log(Math.max(RND(), 1e-9)), col = cols[i];
          let j = NY; for (let q = 1; q <= NY; q++) if (col.cum[q] > stop) { j = q; break; }
          photons.push({ i, y: -2 - RND() * 6, stopY: j < NY ? j * dy : Infinity, dead: 0 });
        }
        const v = (dt || 0) * ph.d * 0.9;
        for (let k = photons.length - 1; k >= 0; k--) {
          const p = photons[k], x = X(cols[p.i].x);
          if (p.dead) { p.dead -= dt || 0.016; if (p.dead <= 0) { photons.splice(k, 1); continue; } c.globalAlpha = clamp(p.dead / 0.4, 0, 1); kit.dot(c, x, Y(p.stopY), 2.6, C.bad); c.globalAlpha = 1; continue; }
          p.y += v;
          if (p.y >= p.stopY) { p.y = p.stopY; p.dead = 0.4; continue; }
          if (p.y > ph.d + 1) { photons.splice(k, 1); continue; }
          if (p.y > -1) kit.dot(c, x, Y(p.y), 1.8, C.warn);
        }
        // detector image and profile
        const iy0 = by0 + bh + 10, ih = Math.max(34, Math.min(60, Hh - iy0 - 50));
        const tRef = Math.exp(-xr.ct.tau), L1 = Math.log10(Math.max(tRef, 1e-300)) + 1.2, L0 = L1 - 2.4;
        const cw = bw / NX;
        for (let i = 0; i < NX; i++) {
          const l = Math.log10(Math.max(cols[i].T, 1e-300)), g = Math.round(255 * clamp((L1 - l) / (L1 - L0), 0, 1));
          c.fillStyle = 'rgb(' + g + ',' + g + ',' + g + ')'; c.fillRect(bx0 + i * cw, iy0, cw + 0.6, ih);
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx0, iy0, bw, ih);
        kit.label(c, 'detector image: bright = few X-rays arrived', bx0, iy0 + ih + 12, { size: 10.5, color: C.muted });
        const py0 = iy0 + ih + 22, py1 = Hh - 8;
        if (py1 - py0 > 24) {
          const Yp = t => py1 - clamp((Math.log10(Math.max(t, 1e-12)) + 12) / 12, 0, 1) * (py1 - py0);
          c.strokeStyle = C.grid; c.beginPath(); for (const e of [0, -4, -8, -12]) { c.moveTo(bx0, Yp(Math.pow(10, e))); c.lineTo(bx0 + bw, Yp(Math.pow(10, e))); } c.stroke();
          c.beginPath(); cols.forEach((q, i) => { const x = bx0 + (i + 0.5) * cw, y = Yp(q.T); if (i) c.lineTo(x, y); else c.moveTo(x, y); }); c.strokeStyle = C.accent; c.lineWidth = 1.8; c.stroke();
          c.font = font(9.5); c.fillStyle = C.muted; c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText('1', bx0 - 3, Yp(1)); c.fillText('10⁻⁴', bx0 - 3, Yp(1e-4)); c.fillText('10⁻⁸', bx0 - 3, Yp(1e-8));
          kit.label(c, 'fraction transmitted (log scale)', bx0 + bw, py0 + 4, { size: 10, color: C.accent, align: 'right' });
        }
      }
      // the picture keeps its true proportions: 6 cm across, 12 cm deep
      const usGeom = (W, Hh) => { const ih = Math.min(Hh - 40, W * 0.58 * US_D / US_W); return { ix0: 50, iy0: 26, ih, iw: ih * US_W / US_D }; };
      function drawU(c, C, W, Hh, dt) {
        const { iw, ih, ix0, iy0 } = usGeom(W, Hh), sx = iw / US_W, sz = ih / US_D;
        c.fillStyle = '#000'; c.fillRect(ix0, iy0, iw, ih);
        if (us.canvas) { c.imageSmoothingEnabled = true; c.drawImage(us.canvas, ix0, iy0, iw, ih); }
        c.fillStyle = C.surface; c.fillRect(ix0 - 2, 8, iw + 4, 16);
        kit.label(c, 'probe · ' + kit.fmt(V.freq, 3) + ' MHz', ix0 + 6, 16, { size: 10.5, color: C.muted });
        // depth scale as the machine computes it
        c.font = font(10); c.fillStyle = C.muted; c.textAlign = 'right'; c.textBaseline = 'middle'; c.strokeStyle = C.axis; c.lineWidth = 1;
        for (let d = 0; d <= US_D; d += 2) { const y = iy0 + d * sz; c.beginPath(); c.moveTo(ix0 - 5, y); c.lineTo(ix0, y); c.stroke(); c.fillText(d + ' cm', ix0 - 7, y); }
        // the highlighted line and its pulse
        const li = clamp(Math.round(V.line / 100 * (NL - 1)), 0, NL - 1), L = us.lines[li], lx = ix0 + L.x * sx;
        c.strokeStyle = 'rgba(255,200,60,0.55)'; c.lineWidth = 1; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(lx, iy0); c.lineTo(lx, iy0 + ih); c.stroke(); c.setLineDash([]);
        anim = (anim + (dt || 0) / 2.4) % 1;
        const tTot = L.tEnd, tau = anim * tTot, tz = L.tz;
        const depthAtOneWay = tt => { let lo = 0, hi = tz.length - 1; if (tt >= tz[hi]) return US_D; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (tz[m] < tt) lo = m; else hi = m; } return lo * 0.02; };
        const place = tRound => iy0 + clamp(V.cset * tRound / 2 * 100, 0, US_D) * sz;
        if (tau / 2 < tz[tz.length - 1] && V.gel) kit.dot(c, lx, iy0 + depthAtOneWay(tau / 2) * sz, 3.5, '#ffd24a');
        for (const q of L.ifs) {
          if (!V.gel && q.z > 0.2) break;
          const back = tau / 2 - q.t / 2;
          if (back > 0 && back < q.t / 2) { c.globalAlpha = clamp(Math.sqrt(q.R) * 3, 0.35, 1); kit.dot(c, lx + 4, iy0 + depthAtOneWay(q.t / 2 - back) * sz, 2.6, '#7fd4ff'); c.globalAlpha = 1; }
        }
        // the A-line: echo strength along the highlighted line, where the machine places it
        const ax0 = ix0 + iw + 30, ax1 = W - 12;
        if (ax1 - ax0 > 50) {
          c.fillStyle = C.surface; c.fillRect(ax0, iy0, ax1 - ax0, ih);
          c.beginPath();
          for (let b = 0; b < NB; b++) { const v = us.out[b * NL + li], x = ax0 + v * (ax1 - ax0), y = iy0 + (b + 0.5) / NB * ih; if (b) c.lineTo(x, y); else c.moveTo(x, y); }
          c.strokeStyle = C.accent; c.lineWidth = 1.4; c.stroke();
          kit.label(c, 'echo strength on the line', (ax0 + ax1) / 2, 16, { size: 10.5, color: C.accent, align: 'center' });
          const marks = [[1.8, 'fat | muscle'], [3.2, 'muscle | liver']];
          if (Math.abs(L.x - 2.3) < 1.2) { const h = Math.sqrt(Math.max(0, 1.44 - (L.x - 2.3) * (L.x - 2.3))); marks.push([6.2 - h, 'cyst wall'], [6.2 + h, 'cyst wall']); }
          if (Math.abs(L.x - 5.0) < 0.95) marks.push([2.5 - 0.6 * Math.sqrt(Math.max(0, 1 - Math.pow((L.x - 5) / 0.95, 2))), 'rib (then shadow)']);
          for (const [z, lab] of marks) {
            const k = Math.round(z / 0.02), y = k < tz.length ? place(2 * tz[k]) : iy0 + z * sz;
            c.strokeStyle = C.faint; c.setLineDash([2, 3]); c.beginPath(); c.moveTo(ax0, y); c.lineTo(ax1, y); c.stroke(); c.setLineDash([]);
            kit.label(c, lab, ax1 - 4, y - 7, { size: 9.5, color: C.muted, align: 'right' });
          }
        }
      }
      function draw(dt) {
        if (dirty) { if (V.mode === 'xray') computeX(); else computeU(); dirty = false; photons.length = 0; }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (V.mode === 'xray') { if (!xr) computeX(); drawX(c, C, W, Hh, dt); }
        else { if (!us) computeU(); drawU(c, C, W, Hh, dt); }
      }
      kit.drag(st, {
        hit: p => {
          if (V.mode !== 'ultrasound') return null;
          const g = usGeom(st.W, st.H);
          return p.x >= g.ix0 && p.x <= g.ix0 + g.iw && p.y >= g.iy0 && p.y <= g.iy0 + g.ih ? 'line' : null;
        },
        move: (k, p) => { const g = usGeom(st.W, st.H); ctl.set('line', Math.round(clamp((p.x - g.ix0) / g.iw, 0, 1) * 100)); loop.once(); },
        hover: true
      });
      modeUI();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
