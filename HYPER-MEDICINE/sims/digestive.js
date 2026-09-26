/* HYPER-MEDICINE · sims/digestive.js — simulations for Digestion, Liver and Nutrition:
 * the journey of a meal, the folded surface of the small intestine, alcohol against a
 * medicine in the liver, the gut microbiome, a plate builder, energy balance over the years
 * and the stages of liver disease. All are schematic, with typical average numbers. */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const hm = h => { const m = Math.max(0, Math.round(h * 60)); return Math.floor(m / 60) + ' h ' + String(m % 60).padStart(2, '0') + ' min'; };
  const f1 = (v, d) => (Number.isFinite(v) ? v : 0).toFixed(d == null ? 1 : d);

  /* ================================================================ the journey of a meal */
  const MEALS = {
    mixed: { carb: 60, prot: 25, fat: 20, fib: 7, lag: 0.25, half: 1.4, si: 4, colon: 30 },
    fatty: { carb: 70, prot: 35, fat: 45, fib: 5, lag: 0.4, half: 2.4, si: 4.5, colon: 32 },
    drink: { carb: 40, prot: 0, fat: 0, fib: 0, lag: 0, half: 0.3, si: 3, colon: 30 },
    fibre: { carb: 70, prot: 25, fat: 12, fib: 18, lag: 0.3, half: 1.7, si: 4, colon: 22 }
  };
  // [digested, absorbed] fractions reached at the END of: mouth, oesophagus, stomach, small intestine, colon
  const PROG = {
    carb: [[0.05, 0], [0.06, 0], [0.15, 0], [0.97, 0.95], [0.99, 0.98]],
    prot: [[0, 0], [0, 0], [0.2, 0], [0.95, 0.92], [0.97, 0.94]],
    fat: [[0, 0], [0, 0], [0.1, 0], [0.96, 0.95], [0.96, 0.95]],
    fib: [[0, 0], [0, 0], [0, 0], [0.03, 0], [0.6, 0.55]]
  };
  const NUTR = [['carb', 'Carbohydrate', 4], ['prot', 'Protein', 4], ['fat', 'Fat', 9], ['fib', 'Fibre', 2]];
  const PLACE = ['the mouth', 'the oesophagus', 'the stomach', 'the small intestine', 'the colon', 'out of the body'];
  const WORK = [
    'chewing; saliva\'s amylase starts on starch',
    'peristalsis carries each swallow down',
    'acid and pepsin start on protein; churning into chyme',
    'pancreatic enzymes and bile finish digestion; nutrients absorbed',
    'water and salt taken back; bacteria ferment fibre',
    'the meal has left'
  ];
  // the centre line of the tube, in unit coordinates, part by part
  const PATH = [
    [[0.50, 0.03], [0.50, 0.06]],
    [[0.50, 0.06], [0.50, 0.14], [0.51, 0.22]],
    [[0.51, 0.22], [0.575, 0.225], [0.625, 0.275], [0.615, 0.335], [0.555, 0.365], [0.47, 0.352]],
    [[0.47, 0.352], [0.41, 0.37], [0.395, 0.43], [0.43, 0.47], [0.36, 0.51], [0.64, 0.51], [0.67, 0.54], [0.64, 0.57], [0.36, 0.57], [0.33, 0.60], [0.36, 0.63], [0.64, 0.63],
     [0.67, 0.66], [0.64, 0.69], [0.36, 0.69], [0.33, 0.72], [0.36, 0.75], [0.64, 0.75], [0.70, 0.78], [0.77, 0.80]],
    [[0.77, 0.80], [0.80, 0.78], [0.80, 0.49], [0.76, 0.445], [0.24, 0.445], [0.20, 0.49], [0.20, 0.80], [0.26, 0.86], [0.40, 0.86], [0.47, 0.90], [0.50, 0.965]]
  ];
  // the stomach is a bag, not a tube: its outline (greater curvature, then lesser curvature back)
  const STOMACH = [[0.505, 0.215], [0.55, 0.188], [0.61, 0.188], [0.655, 0.228], [0.672, 0.29], [0.652, 0.35], [0.60, 0.39], [0.53, 0.398], [0.48, 0.382], [0.455, 0.366],
    [0.462, 0.338], [0.51, 0.345], [0.555, 0.335], [0.583, 0.305], [0.576, 0.262], [0.54, 0.238], [0.515, 0.232]];
  const PANCREAS = [[0.43, 0.405], [0.47, 0.395], [0.56, 0.41], [0.63, 0.40], [0.66, 0.41], [0.63, 0.422], [0.56, 0.428], [0.47, 0.426], [0.43, 0.425]];
  const TUBE_W = [9, 7, 30, 8, 17];
  const LENS = PATH.map(pts => { const c = [0]; for (let i = 1; i < pts.length; i++) c.push(c[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return c; });
  function pathAt(seg, f) {
    const pts = PATH[seg], cum = LENS[seg], L = cum[cum.length - 1] * clamp(f, 0, 1);
    for (let i = 1; i < pts.length; i++) {
      if (cum[i] >= L) { const u = (L - cum[i - 1]) / Math.max(1e-9, cum[i] - cum[i - 1]); return [lerp(pts[i - 1][0], pts[i][0], u), lerp(pts[i - 1][1], pts[i][1], u)]; }
    }
    return pts[pts.length - 1];
  }
  function progress(key, seg, f) {
    const P = PROG[key];
    if (seg >= 5) return P[4];
    const a = seg ? P[seg - 1] : [0, 0], b = P[seg];
    const sd = seg === 3 ? 1 - Math.pow(1 - f, 3) : f, sa = seg === 3 ? 1 - Math.pow(1 - f, 2) : f;
    return [lerp(a[0], b[0], sd), lerp(a[1], b[1], sa)];
  }

  Hyper.sim('gi-journey', {
    title: 'The journey of a meal',
    blurb: `A meal is shown as small pieces travelling through the gut; each shrinks as its nutrients are absorbed. The bars count what has happened to the carbohydrate, protein, fat and fibre: still intact, cut into small molecules, or absorbed into the body.

- Watch the stomach release the meal a little at a time: the small intestine never receives it all at once.
- Compare the **fatty meal** with the **sugary drink**: fat slows the stomach down, while a drink reaches the small intestine within minutes — one reason sugary drinks raise blood sugar so fast.
- Most of the energy is absorbed within about six to eight hours, but the leftovers take a day or more to leave.
- In the **high-fibre meal**, fibre reaches the colon untouched, where bacteria ferment it — and moves through the colon faster.

Times are typical averages; they vary a lot between people and from day to day.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const ctl = kit.controls(box.side, [
        { id: 'meal', type: 'select', label: 'Meal', options: [['Mixed meal (sandwich and an apple)', 'mixed'], ['Fatty meal (burger and fries)', 'fatty'], ['Sugary drink', 'drink'], ['High-fibre meal (lentils, vegetables, wholegrain bread)', 'fibre']], value: (params && params.meal) || 'mixed' },
        { id: 'speed', type: 'select', label: 'Speed', options: [['1 second = 5 minutes', 5 / 60], ['1 second = 20 minutes', 1 / 3], ['1 second = 1 hour', 1], ['1 second = 3 hours', 3]], value: 1 / 3 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Serve again', primary: true }, { id: 'pause', label: 'Pause / play' }] }
      ], id => {
        if (id === 'meal' || id === 'restart') build();
        else if (id === 'pause') paused = !paused;
        loop.once();
      });
      const ro = kit.readout(box.side, [['time', 'Time since the meal'], ['where', 'Most of it is in'], ['work', 'What is happening there'], ['kcal', 'Energy absorbed'], ['left', 'Left the body']]);
      const V = ctl.values;
      const N = 40;
      let parts = [], t = 0, paused = false, wig = 0, meal = MEALS.mixed, tEnd = 1, total = 1;
      function build() {
        meal = MEALS[V.meal] || MEALS.mixed;
        const R = kit.fin.uniforms(11);
        const tau = meal.half / Math.LN2;
        parts = [];
        for (let i = 0; i < N; i++) {
          const u0 = R(), u1 = R(), u2 = R(), u3 = R(), ph = R();
          const eat = V.meal === 'drink' ? 0.08 * u0 : 0.25 * u0;
          const oes = eat + 0.003;
          // liquids leave the stomach exponentially; solids after a lag, at a roughly steady rate
          const empt = V.meal === 'drink' ? tau * -Math.log(1 - 0.95 * u1) : meal.lag + 2 * meal.half * u1;
          const sto = oes + Math.max(0.05, empt);
          const si = sto + meal.si * (0.75 + 0.5 * u2);
          const col = si + meal.colon * (0.6 + 0.8 * u3);
          parts.push({ times: [eat, oes, sto, si, col], ph, jig: R() });
        }
        tEnd = Math.max(...parts.map(p => p.times[4])) + 0.5;
        total = NUTR.reduce((s, n) => s + meal[n[0]] * n[2] * (n[0] === 'fib' ? 0.6 : 1), 0);
        t = 0; paused = false;
      }
      // where a piece is: part of the gut (0–5) and the fraction through it
      function locate(p) {
        const T = p.times;
        if (t < T[0]) return [0, 0];
        for (let s = 1; s <= 4; s++) if (t < T[s]) return [s, (t - T[s - 1]) / Math.max(1e-9, T[s] - T[s - 1])];
        return [5, 1];
      }
      function draw(dt) {
        if (!paused && t < tEnd) t = Math.min(tEnd, t + (dt || 0) * V.speed);
        wig += dt || 0;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const gw = Math.min(W * 0.56, (Hh - 16) * 1.25);
        const X = u => 6 + (u - 0.14) / 0.72 * gw, Y = u => 8 + u * (Hh - 16);
        // the liver and gallbladder, beside the tube
        c.fillStyle = kit.hue(18, 0.35);
        c.beginPath(); c.ellipse(X(0.36), Y(0.27), gw * 0.14, (Hh - 16) * 0.075, -0.2, 0, Math.PI * 2); c.fill();
        kit.dot(c, X(0.43), Y(0.33), 4, kit.hue(95, 0.8));
        kit.label(c, 'liver', X(0.30), Y(0.23), { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'gallbladder', X(0.35), Y(0.345), { size: 10, color: C.muted, align: 'center' });
        // the tube: colon first, then the pancreas, small intestine, stomach and oesophagus on top
        const wall = kit.hue(350, 0.55), lumen = C.dark ? '#2a1c24' : '#fff6f4';
        const tube = seg => {
          const pts = PATH[seg];
          for (const [col, extra] of [[wall, 4], [lumen, 0]]) {
            c.strokeStyle = col; c.lineWidth = TUBE_W[seg] + extra; c.lineCap = 'round'; c.lineJoin = 'round';
            c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(X(q[0]), Y(q[1])) : c.moveTo(X(q[0]), Y(q[1]))); c.stroke();
          }
        };
        const poly = (pts, fill, stroke) => { c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(X(q[0]), Y(q[1])) : c.moveTo(X(q[0]), Y(q[1]))); c.closePath(); c.fillStyle = fill; c.fill(); if (stroke) { c.strokeStyle = stroke; c.lineWidth = 2; c.stroke(); } };
        tube(4);
        poly(PANCREAS, kit.hue(40, 0.55));
        tube(3); tube(1); tube(0);
        poly(STOMACH, lumen, wall);
        kit.label(c, 'mouth', X(0.56), Y(0.035), { size: 11, color: C.muted });
        kit.label(c, 'oesophagus', X(0.53), Y(0.13), { size: 11, color: C.muted });
        kit.label(c, 'stomach', X(0.69), Y(0.24), { size: 11, color: C.muted });
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(X(0.35), Y(0.40)); c.lineTo(X(0.435), Y(0.412)); c.stroke();
        kit.label(c, 'pancreas', X(0.345), Y(0.40), { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'small intestine', X(0.50), Y(0.805), { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'colon', X(0.775), Y(0.62), { size: 11, color: C.muted, align: 'right' });
        kit.label(c, 'rectum', X(0.55), Y(0.93), { size: 11, color: C.muted });
        // the pieces of the meal
        const tally = {}; NUTR.forEach(n => { tally[n[0]] = [0, 0]; });
        const where = [0, 0, 0, 0, 0, 0];
        let eaten = 0;
        for (const p of parts) {
          const [seg, fr] = locate(p);
          let rem = 0, mass = 0;
          for (const [k] of NUTR) {
            const g = meal[k] / N, pr = t < p.times[0] ? [0, 0] : progress(k, seg, fr);
            tally[k][0] += g * pr[0]; tally[k][1] += g * pr[1];
            rem += g * (1 - pr[1]); mass += g;
          }
          if (t < p.times[0]) continue;
          eaten++;
          where[seg]++;
          if (seg >= 5) continue;
          let f = fr;
          if (seg === 2) f = 0.12 + 0.76 * (0.5 + 0.5 * Math.sin(2 * Math.PI * (wig * 0.35 + p.ph)));
          const q = pathAt(seg, f);
          const off = (p.jig - 0.5) * TUBE_W[seg] * 0.6;
          const r = 1.8 + 3.8 * Math.sqrt(mass > 0 ? rem / mass : 0);
          kit.dot(c, X(q[0]) + off * 0.7, Y(q[1]) + off * 0.5, r, C.series[1], C.bg2);
        }
        // the bars
        const bx = gw + 22, bw = W - bx - 14;
        if (bw > 60) {
          kit.label(c, 'What has happened to the meal', bx, 16, { size: 12.5, weight: 650 });
          const rowH = Math.min(46, (Hh - 120) / 4);
          NUTR.forEach(([k, name], i) => {
            const y = 40 + i * rowH, g = meal[k];
            kit.label(c, name + (g ? ' · ' + g + ' g' : ''), bx, y, { size: 11.5, color: C.text2 });
            const yb = y + 9, hb = Math.max(8, rowH * 0.34);
            if (!g) { kit.label(c, 'none in this meal', bx, yb + hb / 2, { size: 11, color: C.faint }); return; }
            const ab = clamp(tally[k][1] / g, 0, 1), dg = clamp(tally[k][0] / g, 0, 1);
            c.fillStyle = kit.hue(215, 0.35); c.fillRect(bx, yb, bw, hb);
            c.fillStyle = C.warn; c.fillRect(bx, yb, bw * dg, hb);
            c.fillStyle = C.ok; c.fillRect(bx, yb, bw * ab, hb);
          });
          const ly = 40 + 4 * rowH + 4;
          [[C.ok, 'absorbed'], [C.warn, 'digested, not yet absorbed'], [kit.hue(215, 0.35), 'intact']].forEach(([col, txt], i) => {
            c.fillStyle = col; c.fillRect(bx, ly + i * 16, 10, 10);
            kit.label(c, txt, bx + 16, ly + 5 + i * 16, { size: 11, color: C.muted });
          });
          // where the pieces are now
          const wy = ly + 62, wRow = Math.min(18, (Hh - 60 - wy) / 5);
          if (wRow > 10) {
            kit.label(c, 'Where the pieces are', bx, wy, { size: 12, weight: 650 });
            [['stomach', where[2]], ['small intestine', where[3]], ['colon', where[4]], ['left the body', where[5]]].forEach(([name, n], i) => {
              const y = wy + 16 + i * wRow;
              kit.label(c, name, bx, y, { size: 10.5, color: C.muted });
              c.fillStyle = C.grid; c.fillRect(bx + 96, y - 4, bw - 126, 8);
              c.fillStyle = C.series[1]; c.fillRect(bx + 96, y - 4, (bw - 126) * n / N, 8);
              kit.label(c, Math.round(100 * n / N) + '%', bx + bw - 26, y, { size: 10.5, color: C.muted });
            });
          }
          // a timeline
          const ty = Hh - 26, span = Math.max(24, Math.ceil(tEnd / 12) * 12);
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(bx, ty); c.lineTo(bx + bw, ty); c.stroke();
          for (let h = 0; h <= span; h += span > 48 ? 24 : 12) {
            const xx = bx + h / span * bw;
            c.beginPath(); c.moveTo(xx, ty - 3); c.lineTo(xx, ty + 3); c.stroke();
            kit.label(c, h + ' h', xx, ty + 12, { size: 10, color: C.muted, align: 'center' });
          }
          kit.dot(c, bx + clamp(t / span, 0, 1) * bw, ty, 5, C.accent);
        }
        // read-outs
        let mode = 0;
        for (let s = 0; s < 6; s++) if (where[s] > where[mode]) mode = s;
        const kcal = NUTR.reduce((s, n) => s + tally[n[0]][1] * n[2] * (n[0] === 'fib' ? 0.6 / 0.55 : 1), 0);
        ro.set('time', hm(t) + (paused ? ' (paused)' : t >= tEnd ? ' (done)' : ''));
        ro.set('where', eaten ? PLACE[mode] : 'not eaten yet');
        ro.set('work', eaten ? WORK[mode] : '—');
        ro.set('kcal', Math.round(kcal) + ' of about ' + Math.round(total) + ' kcal');
        ro.set('left', Math.round(100 * where[5] / N) + ' % of the pieces');
      }
      build();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ folds, villi and microvilli */
  const REFS = [[0.0624, 'A4 sheet'], [1.8, 'a door'], [12.5, 'a parking space'], [30, 'a studio flat'], [261, 'a tennis court']];
  Hyper.sim('gi-surface', {
    title: 'A surface folded three times',
    blurb: `The small intestine absorbs through its lining, and three levels of folding multiply the area: circular folds of the wall, finger-like villi on the folds, and a brush of microvilli on every lining cell. The bars below compare the area at each step with everyday surfaces (logarithmic scale: each step to the right is ten times more).

- Set every factor to 1: a smooth pipe a few metres long has about the area of a few sheets of paper.
- Put the factors back one at a time and watch the area jump.
- Tick **Coeliac disease**: flattened villi and damaged microvilli shrink the surface several-fold, which is why untreated coeliac disease can cause poor absorption, anaemia and weight loss.

The factors are textbook round numbers; careful measurements (2014) put the lining of the whole gut at about 30 m².`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Length of small intestine', min: 2, max: 7, step: 0.1, value: 4, unit: 'm' },
        { id: 'd', label: 'Diameter', min: 1.5, max: 4, step: 0.1, value: 2.5, unit: 'cm' },
        { id: 'f1', label: 'Circular folds multiply by', min: 1, max: 4, step: 0.1, value: 3, unit: '×' },
        { id: 'f2', label: 'Villi multiply by', min: 1, max: 15, step: 0.5, value: 10, unit: '×' },
        { id: 'f3', label: 'Microvilli multiply by', min: 1, max: 30, step: 1, value: 20, unit: '×' },
        { id: 'cd', type: 'check', label: 'Coeliac disease: flattened villi', value: !!(params && params.atrophy) }
      ], id => {
        if (id === 'cd') {
          if (V.cd) { saved = [V.f2, V.f3]; ctl.set('f2', 1.5); ctl.set('f3', 12); }
          else { ctl.set('f2', saved[0]); ctl.set('f3', saved[1]); }
        }
        loop.once();
      });
      const ro = kit.readout(box.side, [['pipe', 'Smooth pipe'], ['folds', '+ circular folds'], ['villi', '+ villi'], ['micro', '+ microvilli (total)'], ['gain', 'Gain over the pipe'], ['like', 'About the size of']]);
      const V = ctl.values;
      let saved = [10, 20];
      if (V.cd) { ctl.set('f2', 1.5); ctl.set('f3', 12); }
      function panelFrame(c, x, y, w, h, title, C) {
        c.fillStyle = C.surface; c.strokeStyle = C.border2; c.lineWidth = 1;
        c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, 8) : c.rect(x, y, w, h); c.fill(); c.stroke();
        kit.label(c, title, x + w / 2, y + h - 12, { size: 11, color: C.muted, align: 'center' });
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const tissue = kit.hue(350, 0.5), tissue2 = kit.hue(350, 0.8), lumen = C.bg2;
        const pw = (W - 40) / 3, ph = Math.max(120, Hh * 0.52), py = 10;
        const k1 = clamp((V.f1 - 1) / 3, 0, 1), k2 = clamp((V.f2 - 1) / 14, 0, 1), k3 = clamp((V.f3 - 1) / 29, 0, 1);
        // 1: the tube in cross-section
        let x = 10;
        panelFrame(c, x, py, pw, ph, 'the tube · ' + f1(V.d) + ' cm across', C);
        {
          const cx = x + pw / 2, cy = py + (ph - 20) / 2 + 4, R = Math.min(pw, ph - 26) * 0.42, r0 = R * 0.66, a = R * 0.3 * k1;
          c.fillStyle = tissue; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fill();
          c.fillStyle = lumen; c.beginPath();
          for (let i = 0; i <= 240; i++) {
            const th = i / 240 * Math.PI * 2, r = r0 - a * Math.pow(0.5 + 0.5 * Math.cos(12 * th), 3);
            i ? c.lineTo(cx + r * Math.cos(th), cy + r * Math.sin(th)) : c.moveTo(cx + r * Math.cos(th), cy + r * Math.sin(th));
          }
          c.closePath(); c.fill(); c.strokeStyle = tissue2; c.lineWidth = 1.5; c.stroke();
          kit.label(c, 'folds ×' + f1(V.f1), cx, cy, { size: 11.5, color: C.text2, align: 'center' });
        }
        // 2: villi on the surface of a fold
        x += pw + 10;
        panelFrame(c, x, py, pw, ph, V.f2 < 2.5 ? 'villi flattened' : 'villi · about 1 mm tall', C);
        {
          const base = py + ph - 34, n = 7, sp = (pw - 20) / n, vw = sp * 0.62, vh = 6 + (ph - 70) * k2;
          c.fillStyle = tissue; c.fillRect(x + 8, base, pw - 16, 12);
          for (let i = 0; i < n; i++) {
            const vx = x + 10 + sp * (i + 0.5) - vw / 2;
            c.beginPath(); c.roundRect ? c.roundRect(vx, base - vh, vw, vh + 4, [vw / 2, vw / 2, 0, 0]) : c.rect(vx, base - vh, vw, vh + 4); c.fill();
          }
          kit.label(c, 'villi ×' + f1(V.f2), x + pw / 2, py + 14, { size: 11.5, color: C.text2, align: 'center' });
        }
        // 3: one lining cell with its brush border
        x += pw + 10;
        panelFrame(c, x, py, pw, ph, 'a lining cell · microvilli ~1 µm', C);
        {
          const cw = pw * 0.5, chh = (ph - 40) * 0.5, cx0 = x + (pw - cw) / 2, cy0 = py + ph - 30 - chh;
          c.fillStyle = tissue; c.fillRect(cx0, cy0, cw, chh);
          c.fillStyle = kit.hue(265, 0.55); c.beginPath(); c.ellipse(cx0 + cw / 2, cy0 + chh * 0.62, cw * 0.18, chh * 0.2, 0, 0, Math.PI * 2); c.fill();
          const nm = 13, lm = 2 + (ph - 40) * 0.36 * k3;
          c.strokeStyle = tissue2; c.lineWidth = Math.max(2, cw / nm * 0.5); c.lineCap = 'round';
          for (let i = 0; i < nm; i++) {
            const mx = cx0 + cw * (i + 0.5) / nm;
            c.beginPath(); c.moveTo(mx, cy0); c.lineTo(mx, cy0 - lm); c.stroke();
          }
          kit.label(c, 'microvilli ×' + f1(V.f3, 0), x + pw / 2, py + 14, { size: 11.5, color: C.text2, align: 'center' });
        }
        // areas
        const pipe = Math.PI * V.d / 100 * V.L;
        const steps = [['smooth pipe', pipe], ['+ folds', pipe * V.f1], ['+ villi', pipe * V.f1 * V.f2], ['+ microvilli', pipe * V.f1 * V.f2 * V.f3]];
        // log bars
        const bx = 96, bw = W - bx - 16, top = py + ph + 40, rowH = Math.max(16, (Hh - top - 26) / 4);
        const lo = Math.log10(0.02), hi = Math.log10(1000);
        const XL = a => bx + (Math.log10(clamp(a, 0.02, 1000)) - lo) / (hi - lo) * bw;
        REFS.forEach(([a, name], i) => {
          const xx = XL(a);
          c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.lineWidth = 1;
          c.beginPath(); c.moveTo(xx, top - 12 - (i % 2) * 14); c.lineTo(xx, top + rowH * 4); c.stroke(); c.setLineDash([]);
          kit.label(c, name, xx + 3, top - 12 - (i % 2) * 14, { size: 10, color: C.muted });
        });
        steps.forEach(([name, a], i) => {
          const y = top + i * rowH + 4, h = rowH * 0.62;
          kit.label(c, name, bx - 8, y + h / 2, { size: 11, color: C.text2, align: 'right' });
          c.fillStyle = i === 3 ? C.accent : kit.hue(350, 0.4 + 0.12 * i);
          c.fillRect(bx, y, Math.max(2, XL(a) - bx), h);
          kit.label(c, (a < 10 ? f1(a, 2) : Math.round(a)) + ' m²', Math.min(XL(a) + 6, W - 60), y + h / 2, { size: 11, weight: 600 });
        });
        kit.label(c, 'area (m², logarithmic)', bx, Hh - 10, { size: 10.5, color: C.muted });
        const tot = steps[3][1];
        ro.set('pipe', f1(pipe, 2) + ' m²');
        ro.set('folds', f1(steps[1][1], 2) + ' m²');
        ro.set('villi', f1(steps[2][1], 1) + ' m²');
        ro.set('micro', Math.round(tot) + ' m²');
        ro.set('gain', '×' + Math.round(V.f1 * V.f2 * V.f3));
        let best = REFS[0];
        for (const r of REFS) if (Math.abs(Math.log(tot / r[0])) < Math.abs(Math.log(tot / best[0]))) best = r;
        const ratio = tot / best[0];
        ro.set('like', (ratio >= 0.9 && ratio <= 1.1 ? '' : f1(ratio, ratio < 10 ? 1 : 0) + ' × ') + best[1]);
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ alcohol against a medicine */
  Hyper.sim('gi-clearance', {
    title: 'The liver at work: a fixed amount or a fixed fraction',
    blurb: `Two tanks stand for the body. Alcohol (left) is removed by an enzyme that is already working flat out, so the same **amount** leaves every hour: its level falls in a straight line. A typical medicine (right) leaves in proportion to how much is there, so the same **fraction** leaves every hour and the level halves every half-life.

- Double the drinks: the medicine would still halve in one half-life, but the alcohol takes twice as long to clear.
- Tick **Drinking with a meal**: the alcohol is absorbed more slowly and the peak is lower — though the total still has to be cleared at the same rate.
- Raise **Removed on the first pass**: less of a swallowed medicine reaches the blood than of the same dose injected (dashed).

Averages only: a real person's level can differ a lot, and no estimate says whether it is safe to drive. The dashed lines on the alcohol graph mark two common legal limits for drivers; many countries set lower limits, and zero is the only safe level for driving.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 190 });
      const pA = kit.plot(box.stage, { x: { label: 'hours after the first drink', name: 'time', min: 0, max: 24 }, y: { label: 'blood alcohol (g/L)', name: 'alcohol' }, fmtX: v => v.toFixed(1) + ' h', fmtY: v => v.toFixed(2) + ' g/L' }, 170);
      const pM = kit.plot(box.stage, { x: { label: 'hours after the dose', name: 'time', min: 0, max: 24 }, y: { label: 'medicine (mg/L)', name: 'medicine' }, fmtX: v => v.toFixed(1) + ' h', fmtY: v => v.toFixed(2) + ' mg/L' }, 150);
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Standard drinks', min: 0, max: 10, step: 1, value: 4 },
        { id: 'g', type: 'select', label: 'A standard drink holds', options: [['8 g of alcohol (UK unit)', 8], ['10 g (WHO; Australia and much of Europe)', 10], ['14 g (US)', 14]], value: 10 },
        { id: 'W', label: 'Body weight', min: 40, max: 130, step: 1, value: 70, unit: 'kg' },
        { id: 'r', type: 'select', label: 'Body water (Widmark factor)', options: [['0.68 (average for men)', 0.68], ['0.55 (average for women)', 0.55]], value: 0.68 },
        { id: 'D', label: 'Drunk over', min: 0.25, max: 6, step: 0.25, value: 2, unit: 'h' },
        { id: 'food', type: 'check', label: 'Drinking with a meal', value: false },
        { id: 'th', label: 'Medicine: half-life', min: 1, max: 24, step: 0.5, value: 4, unit: 'h' },
        { id: 'EH', label: 'Medicine: removed on the first pass', min: 0, max: 95, step: 5, value: 60, unit: '%' },
        { type: 'buttons', items: [{ id: 'play', label: 'Replay', primary: true }] }
      ], id => { if (id === 'play') tc = 0; else solve(); loop.once(); });
      const ro = kit.readout(box.side, [['now', 'Time'], ['bac', 'Blood alcohol now'], ['peak', 'Alcohol peak'], ['zero', 'Back to zero after'], ['rate', 'Alcohol removed'], ['F', 'Medicine reaching the blood'], ['med', 'Medicine now']]);
      const V = ctl.values;
      const BETA = 0.15, KM = 0.02, VD = 40, DOSE = 500;
      let bac = [], gut = [], peak = 0, tPeak = 0, tZero = 0, med = null, iv = null, medPeak = 1, tc = 0;
      function solve() {
        const A = V.n * V.g, rW = V.r * V.W, vmax = BETA * rW, ka = V.food ? 1.5 : 5, dt = 0.005;
        let G = 0, B = 0; bac = []; gut = []; peak = 0; tPeak = 0; tZero = 0;
        for (let k = 0; k <= 24 / dt; k++) {
          const t = k * dt;
          if (k % 10 === 0) { bac.push([t, B / rW]); gut.push(ka * G); }
          const inflow = t < V.D ? A / V.D : 0, C = B / rW;
          const abs = ka * G, out = vmax * C / (KM + C);
          G = Math.max(0, G + (inflow - abs) * dt);
          B = Math.max(0, B + (abs - out) * dt);
          if (C > peak) { peak = C; tPeak = t; }
          if (A > 0 && t > V.D && B / rW < 0.005 && !tZero) tZero = t;
        }
        const F = 0.9 * (1 - V.EH / 100);
        med = kit.med.pk({ halfLife: V.th, Vd: VD, doses: [{ t: 0, amount: DOSE, route: 'oral', F, ka: 1.5 }] });
        iv = kit.med.pk({ halfLife: V.th, Vd: VD, doses: [{ t: 0, amount: DOSE, route: 'iv' }] });
        medPeak = 0;
        for (let t = 0; t <= 24; t += 0.05) medPeak = Math.max(medPeak, med.at(t));
        ro.set('peak', A > 0 ? f1(peak, 2) + ' g/L at ' + f1(tPeak) + ' h' + (peak >= 3 ? ' — alcohol poisoning range: an emergency' : '') : '—');
        ro.set('zero', !A ? '—' : tZero ? f1(tZero) + ' h' : 'more than 24 h');
        ro.set('rate', f1(vmax) + ' g an hour (' + f1(BETA, 2) + ' g/L an hour)');
        ro.set('F', Math.round(F * 100) + ' % of the dose');
      }
      const bacAt = t => { const i = clamp(Math.round(t / 0.05), 0, bac.length - 1); return bac.length ? bac[i][1] : 0; };
      const gutAt = t => { const i = clamp(Math.round(t / 0.05), 0, gut.length - 1); return gut.length ? gut[i] : 0; };
      function tank(c, x, y, w, h, level, title, value, outW, outLabel, inW, col, C) {
        c.strokeStyle = C.text2; c.lineWidth = 2;
        c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + h); c.lineTo(x + w, y + h); c.lineTo(x + w, y); c.stroke();
        const lv = clamp(level, 0, 1);
        c.fillStyle = col; c.globalAlpha = 0.55; c.fillRect(x + 2, y + h - lv * (h - 2), w - 4, lv * (h - 2)); c.globalAlpha = 1;
        if (inW > 0.3) { c.fillStyle = col; c.globalAlpha = 0.45; c.fillRect(x + w * 0.3 - inW / 2, y - 20, inW, 20 + h - lv * h); c.globalAlpha = 1; kit.label(c, 'from the gut', x + w * 0.3 + inW / 2 + 6, y - 12, { size: 10, color: C.muted }); }
        const ox = x + w * 0.72, oy = y + h;
        if (outW > 0.3) { c.fillStyle = col; c.fillRect(ox - outW / 2, oy, outW, 18); kit.arrow(c, ox, oy + 12, ox, oy + 26, col, 2); }
        kit.label(c, title, x + w / 2, y - 28, { size: 12, weight: 650, align: 'center' });
        kit.label(c, value, x + w / 2, y + h / 2, { size: 13, weight: 650, align: 'center', bg: C.surface });
        kit.label(c, outLabel, ox + 10, oy + 16, { size: 10.5, color: C.muted });
      }
      function draw(dt) {
        if (tc < 24) tc = Math.min(24, tc + (dt || 0) * 1.5);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const b = bacAt(tc), m = med ? med.at(tc) : 0, k = Math.LN2 / V.th;
        const top = 42, th = Hh - top - 40, tw = Math.min(170, W * 0.26);
        const scaleA = Math.max(1.2, peak * 1.1), scaleM = Math.max(1e-6, medPeak * 1.15);
        const rW = V.r * V.W;
        tank(c, W * 0.25 - tw / 2, top, tw, th, b / scaleA, 'Alcohol in the blood', f1(b, 2) + ' g/L', b > 0.01 ? 8 : 0, b > 0.01 ? 'a fixed amount: ' + f1(BETA * rW, 1) + ' g an hour' : 'cleared', clamp(gutAt(tc) * 0.8, 0, 26), C.series[0], C);
        tank(c, W * 0.72 - tw / 2, top, tw, th, m / scaleM, 'Medicine in the blood', f1(m, 2) + ' mg/L', 16 * m / scaleM, 'a fixed fraction: ' + Math.round((1 - Math.exp(-k)) * 100) + ' % an hour', clamp(0.9 * (1 - V.EH / 100) * DOSE * 1.5 * Math.exp(-1.5 * tc) / 12, 0, 26), C.series[2], C);
        kit.label(c, f1(tc) + ' h', W / 2, Hh - 12, { size: 12, color: C.muted, align: 'center' });
        pA.set({
          y: { label: 'blood alcohol (g/L)', name: 'alcohol', min: 0, max: Math.max(1, peak * 1.15) },
          series: [{ pts: bac, label: 'blood alcohol', color: C.series[0], fill: true }],
          hlines: [{ y: 0.5, label: '0.5 g/L' }, { y: 0.8, label: '0.8 g/L' }],
          vlines: [{ x: tc }]
        });
        const pts = [], ptsIv = [];
        for (let t = 0; t <= 24.001; t += 0.1) { pts.push([t, med ? med.at(t) : 0]); ptsIv.push([t, iv ? iv.at(t) : 0]); }
        pM.set({ series: [{ pts, label: 'swallowed', color: C.series[2] }, { pts: ptsIv, label: 'same dose injected', color: C.muted, dash: [5, 4] }], vlines: [{ x: tc }] });
        ro.set('now', f1(tc) + ' h');
        ro.set('bac', f1(b, 2) + ' g/L (' + f1(b / 10, 3) + ' %)');
        ro.set('med', f1(m, 2) + ' mg/L (' + Math.round(100 * m / Math.max(1e-9, medPeak)) + ' % of its peak)');
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ the gut microbiome */
  const GROUPS = [
    ['Butyrate makers', 140, 0.35, 3.0, 0], ['Resistant-starch fermenters', 100, 0.35, 2.2, 2e-5], ['Bacteroides-like generalists', 205, 0.5, 1.5, 1e-4],
    ['Fruit-fibre fermenters', 170, 0.4, 2.0, 1e-4], ['Bran fermenters', 70, 0.3, 2.5, 0], ['Mucus foragers', 280, 0.45, 1.4, 1e-4],
    ['Protein fermenters', 30, 0.45, 1.2, 1e-4], ['Lactic acid bacteria', 320, 0.5, 2.0, 2e-4], ['Opportunists', 48, 0.9, 0.2, 2e-4], ['C. difficile', -1, 1.1, 0, 1e-6]
  ];   // name, hue, growth per day, kill rate on antibiotics per day, arrival from food and surroundings
  const DIETS = { high: [1, 1], typ: [0.45, 0.4], low: [0.15, 0.1] };
  const nicheOf = (F, Vr) => [1.2 * F * Vr, 0.9 * F, 0.5 + 0.8 * F, 0.8 * F * Vr, 0.6 * F * Vr, 0.5 + 0.4 * (1 - F), 0.3 + 0.6 * (1 - F), 0.2, 0.3, 0.25];
  function shannon(x) {
    const N = x.reduce((a, b) => a + b, 0);
    if (!(N > 0)) return 0;
    let H = 0;
    for (const v of x) if (v > 0) { const p = v / N; H -= p * Math.log(p); }
    return H;
  }
  Hyper.sim('gi-microbiome', {
    title: 'A community in the colon',
    blurb: `A toy model of ten groups of gut bacteria competing for food and space. Each dot in the drop is a bacterium, coloured by its group; the graph tracks diversity (the Shannon index). Groups that live on fibre need it in the diet — and different fibres feed different groups.

- Switch between the diets and wait a few weeks: a varied, high-fibre diet supports more fibre fermenters and a more even, diverse community.
- Give a **course of antibiotics**: diversity collapses, resistant opportunists bloom, and with the spores present *C. difficile* may take hold. Over the following weeks most groups return — but a group with no source of new arrivals can stay lost.
- Then try a **stool transplant** and see the missing groups come back.

Schematic: the groups, rates and numbers are illustrative, not measurements.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const plot = kit.plot(box.stage, { x: { label: 'day', name: 'day' }, y: { label: 'Shannon index', name: 'H', min: 0, max: 2.4 }, fmtX: v => 'day ' + Math.round(v), fmtY: v => v.toFixed(2) }, 160);
      const ctl = kit.controls(box.side, [
        { id: 'diet', type: 'select', label: 'Diet', options: [['Varied plants, plenty of fibre', 'high'], ['Typical, low in fibre', 'typ'], ['Very little fibre, highly processed', 'low']], value: (params && params.diet) || 'high' },
        { id: 'spores', type: 'check', label: 'C. difficile spores present', value: true },
        { id: 'speed', label: 'Speed', min: 1, max: 10, step: 1, value: 3, unit: 'days/s' },
        { type: 'buttons', items: [{ id: 'abx', label: 'Course of antibiotics', primary: true }, { id: 'fmt', label: 'Stool transplant' }, { id: 'reset', label: 'Start again' }] }
      ], id => {
        if (id === 'abx') { abStart = day; courses.push(day); }
        else if (id === 'fmt') { const K = niche(); x = x.map((v, i) => i < 8 ? Math.max(v, 0.4 * K[i]) : v); }
        else if (id === 'reset') init();
        loop.once();
      });
      const ro = kit.readout(box.side, [['day', 'Day'], ['H', 'Shannon index'], ['D', 'Effective number of groups'], ['but', 'Fibre fermentation (butyrate)'], ['cd', 'C. difficile'], ['lost', 'Groups lost']]);
      const V = ctl.values;
      const R = kit.fin.uniforms(5);
      const DOTS = [];
      for (let i = 0; i < 260; i++) { const a = R() * Math.PI * 2, rr = Math.sqrt(R()); DOTS.push({ x: Math.cos(a) * rr, y: Math.sin(a) * rr, q: R(), s: R() }); }
      let x = [], day = 0, abStart = -1e9, courses = [], hist = [], acc = 0;
      const ALPHA = 0.5, AIN = 2.2, KT = 5;
      const niche = () => { const d = DIETS[V.diet] || DIETS.high; return nicheOf(d[0], d[1]); };
      const BASE = (() => { const K = nicheOf(1, 1); return K[0] + K[1] + 0.3 * K[2]; })();
      function init() {
        const K = niche();
        x = K.map((k, i) => i < 8 ? 0.8 * k : i === 8 ? 1e-4 : 0);
        for (let s = 0; s < 3000; s++) stepDay(0.02, false);
        day = 0; abStart = -1e9; courses = []; hist = [[0, shannon(x)]]; acc = 0;
      }
      function stepDay(dt, useAbx) {
        const K = niche(), N = x.reduce((a, b) => a + b, 0);
        const on = useAbx && day >= abStart && day < abStart + 7;
        x = x.map((xi, i) => {
          const g = GROUPS[i], others = N - xi, a = i >= 8 ? AIN : ALPHA;
          let arrive = g[4];
          if (i === 9) arrive = V.spores ? g[4] : 0;
          let d = g[2] * xi * (1 - xi / Math.max(1e-6, K[i]) - a * others / KT) + arrive;
          if (on) d -= g[3] * xi;
          let v = xi + d * dt;
          if (v < 1e-7 && g[4] === 0) v = 0;
          if (i === 9 && !V.spores && v < 1e-6) v = 0;
          return clamp(v, 0, 10);
        });
      }
      function draw(dt) {
        const days = (dt || 0) * V.speed, nSub = Math.ceil(days / 0.02 - 1e-9);
        for (let s = 0; s < nSub; s++) { stepDay(days / nSub, true); day += days / nSub; }
        acc += days;
        if (acc >= 0.5 || !hist.length) { acc = 0; hist.push([day, shannon(x)]); if (hist.length > 400) hist.shift(); }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const N = x.reduce((a, b) => a + b, 0), cum = [];
        let s = 0;
        for (const v of x) { s += N > 0 ? v / N : 0; cum.push(s); }
        const col = i => GROUPS[i][1] < 0 ? C.bad : kit.hue(GROUPS[i][1]);
        // the drop
        const rD = Math.min(Hh * 0.44, W * 0.2), cx = rD + 16, cy = Hh / 2;
        c.fillStyle = C.surface; c.beginPath(); c.arc(cx, cy, rD + 6, 0, Math.PI * 2); c.fill();
        c.strokeStyle = C.border2; c.lineWidth = 1; c.stroke();
        const shown = Math.round(DOTS.length * clamp(N / 4.2, 0, 1));
        for (let k = 0; k < shown; k++) {
          const d = DOTS[k];
          let g = cum.findIndex(v => v >= d.q);
          if (g < 0) g = x.length - 1;
          const ang = d.s * 6.283;
          c.save(); c.translate(cx + d.x * rD, cy + d.y * rD); c.rotate(ang);
          c.fillStyle = col(g); c.beginPath(); c.ellipse(0, 0, 4.2, 2.2, 0, 0, Math.PI * 2); c.fill(); c.restore();
        }
        kit.label(c, 'a drop of colon contents', cx, cy + rD + 14 > Hh - 4 ? Hh - 6 : cy + rD + 14, { size: 10.5, color: C.muted, align: 'center' });
        // the groups
        const bx = cx + rD + 30, bw = W - bx - 60, rowH = (Hh - 20) / GROUPS.length;
        GROUPS.forEach((g, i) => {
          const y = 10 + i * rowH, share = N > 0 ? x[i] / N : 0;
          c.fillStyle = col(i); c.fillRect(bx, y + 3, 10, rowH - 6);
          kit.label(c, g[0], bx + 16, y + rowH / 2, { size: 11, color: x[i] > 0 ? C.text2 : C.faint });
          const bx2 = bx + Math.min(190, bw * 0.55), bw2 = Math.max(10, W - bx2 - 58);
          c.fillStyle = C.grid; c.fillRect(bx2, y + rowH * 0.3, bw2, rowH * 0.4);
          c.fillStyle = col(i); c.fillRect(bx2, y + rowH * 0.3, bw2 * clamp(share / 0.4, 0, 1), rowH * 0.4);
          kit.label(c, x[i] > 0 ? Math.round(share * 1000) / 10 + ' %' : 'lost', bx2 + bw2 + 6, y + rowH / 2, { size: 10.5, color: C.muted });
        });
        if (day >= abStart && day < abStart + 7) kit.label(c, 'antibiotics: day ' + (Math.floor(day - abStart) + 1) + ' of 7', cx, 14, { size: 11.5, weight: 650, color: C.warn, align: 'center' });
        const H = shannon(x), t0 = Math.max(0, day - 180);
        plot.set({ x: { label: 'day', name: 'day', min: t0, max: Math.max(t0 + 30, day) }, series: [{ pts: hist, label: 'diversity (Shannon index)', color: C.accent }], vlines: courses.filter(d => d >= t0).map(d => ({ x: d, label: 'antibiotics' })) });
        const F = (DIETS[V.diet] || DIETS.high)[0];
        ro.set('day', String(Math.floor(day)));
        ro.set('H', f1(H, 2));
        ro.set('D', f1(Math.exp(H), 1) + ' of 10');
        ro.set('but', Math.round(100 * (x[0] + x[1] + 0.3 * x[2]) * F / BASE) + ' % of a high-fibre gut');
        ro.set('cd', N > 0 ? f1(100 * x[9] / N, 1) + ' % of bacteria' : '—');
        ro.set('lost', String(x.slice(0, 8).filter(v => v <= 0).length));
      }
      init();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ a plate builder */
  // per 100 g (drinks per 100 mL): available carbohydrate, fibre, protein, fat, saturated fat, free sugars (g)
  const FOODS = [
    ['rice', 'Rice, cooked', 40, [28, 0.4, 2.7, 0.3, 0.1, 0], 400],
    ['bread', 'Wholegrain bread', 20, [41, 7, 11, 3.5, 0.7, 3], 200],
    ['beans', 'Lentils or beans, cooked', 280, [20, 8, 9, 0.4, 0.1, 0], 300],
    ['chicken', 'Chicken, cooked', 355, [0, 0, 31, 3.6, 1, 0], 300],
    ['veg', 'Vegetables', 130, [5, 3, 2, 0.3, 0.05, 0], 400],
    ['fruit', 'Fruit', 320, [12, 2.4, 0.3, 0.2, 0, 0], 300],
    ['cheese', 'Hard cheese', 230, [1, 0, 25, 33, 21, 0], 150],
    ['oil', 'Olive oil', 62, [0, 0, 0, 100, 14, 0], 40],
    ['drink', 'Sugary drink (mL)', 190, [10.6, 0, 0, 0, 0, 10.6], 1000]
  ];   // id, name, hue, composition, slider maximum
  const PLATES = {
    balanced: { rice: 150, bread: 0, beans: 0, chicken: 110, veg: 200, fruit: 150, cheese: 0, oil: 10, drink: 0 },
    fast: { rice: 0, bread: 100, beans: 0, chicken: 150, veg: 30, fruit: 0, cheese: 40, oil: 30, drink: 500 },
    lowcarb: { rice: 0, bread: 0, beans: 0, chicken: 200, veg: 250, fruit: 0, cheese: 60, oil: 25, drink: 0 },
    veggie: { rice: 120, bread: 50, beans: 200, chicken: 0, veg: 200, fruit: 150, cheese: 0, oil: 10, drink: 0 }
  };
  Hyper.sim('gi-plate', {
    title: 'Build a plate',
    blurb: `Choose portions and see where the energy comes from. The left circle shows the plate by **weight**, the right one by **energy**: the same food can be a small slice of one and a large slice of the other. The bar compares the split of energy with the ranges many guidelines accept (US National Academies: carbohydrate 45–65 %, fat 20–35 %, protein 10–35 %).

- Add 20 g of olive oil: barely visible by weight, but about 180 kcal.
- Compare the **fast-food** and **vegetarian** plates for fibre, free sugars and saturated fat.
- The **low-carbohydrate** plate can still fall inside the protein range but far outside the carbohydrate one — ranges are guides, and food quality matters as much as the split.

Energy uses the Atwater factors (4 kcal/g for carbohydrate and protein, 9 for fat, 2 for fibre); compositions are typical values, and real foods vary.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const start = PLATES[(params && params.plate) || 'balanced'] || PLATES.balanced;
      const defs = [{ id: 'preset', type: 'select', label: 'Start from', options: [['A balanced plate', 'balanced'], ['Fast-food style', 'fast'], ['Low-carbohydrate', 'lowcarb'], ['Vegetarian', 'veggie']], value: (params && params.plate) || 'balanced' }];
      for (const f of FOODS) defs.push({ id: f[0], label: f[1], min: 0, max: f[4], step: 5, value: start[f[0]] || 0, unit: f[0] === 'drink' ? 'mL' : 'g' });
      const ctl = kit.controls(box.side, defs, id => {
        if (id === 'preset') { const P = PLATES[V.preset] || PLATES.balanced; for (const f of FOODS) ctl.set(f[0], P[f[0]] || 0); }
        loop.once();
      });
      const ro = kit.readout(box.side, [['kcal', 'Energy'], ['split', 'Carbohydrate / fat / protein'], ['fib', 'Fibre'], ['sug', 'Free sugars'], ['sat', 'Saturated fat'], ['note', 'Worth noticing']]);
      const V = ctl.values;
      function totals() {
        const t = { carb: 0, fib: 0, prot: 0, fat: 0, sat: 0, sug: 0, kcal: 0, mass: 0, per: [] };
        for (const f of FOODS) {
          const g = Math.max(0, +V[f[0]] || 0), c = f[3], k = g / 100;
          const e = k * (4 * c[0] + 2 * c[1] + 4 * c[2] + 9 * c[3]);
          t.carb += k * c[0]; t.fib += k * c[1]; t.prot += k * c[2]; t.fat += k * c[3]; t.sat += k * c[4]; t.sug += k * c[5];
          t.kcal += e; t.mass += g; t.per.push([f, g, e]);
        }
        return t;
      }
      function pie(c, cx, cy, r, items, total, C, title) {
        let a0 = -Math.PI / 2;
        c.fillStyle = C.surface; c.beginPath(); c.arc(cx, cy, r + 6, 0, Math.PI * 2); c.fill();
        c.strokeStyle = C.border2; c.lineWidth = 1; c.stroke();
        if (total > 0) for (const [f, v] of items) {
          if (v <= 0) continue;
          const a1 = a0 + v / total * Math.PI * 2;
          c.fillStyle = kit.hue(f[2], 0.85); c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r, a0, a1); c.closePath(); c.fill();
          c.strokeStyle = C.bg2; c.lineWidth = 1.5; c.stroke();
          if (v / total > 0.07) {
            const am = (a0 + a1) / 2;
            kit.label(c, Math.round(100 * v / total) + '%', cx + Math.cos(am) * r * 0.66, cy + Math.sin(am) * r * 0.66, { size: 10.5, weight: 650, align: 'center', color: C.dark ? '#111' : '#fff' });
          }
          a0 = a1;
        }
        else kit.label(c, 'empty plate', cx, cy, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, title, cx, cy - r - 16, { size: 12, weight: 650, align: 'center' });
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const t = totals();
        const r = Math.max(30, Math.min(W * 0.16, Hh * 0.26));
        pie(c, W * 0.25, 30 + r, r, t.per.map(p => [p[0], p[1]]), t.mass, C, 'by weight · ' + Math.round(t.mass) + ' g');
        pie(c, W * 0.62, 30 + r, r, t.per.map(p => [p[0], p[2]]), t.kcal, C, 'by energy · ' + Math.round(t.kcal) + ' kcal');
        // legend
        const lx = W * 0.62 + r + 22;
        if (lx < W - 60) FOODS.forEach((f, i) => {
          const y = 18 + i * 15;
          if (y > 30 + 2 * r) return;
          c.fillStyle = kit.hue(f[2], 0.85); c.fillRect(lx, y - 5, 10, 10);
          kit.label(c, f[1].replace(' (mL)', ''), lx + 15, y, { size: 10, color: V[f[0]] > 0 ? C.text2 : C.faint });
        });
        // energy split with guideline ranges
        const e = t.kcal || 1, parts = [['carbohydrate', 4 * t.carb / e, kit.hue(40), [0.45, 0.65]], ['fat', 9 * t.fat / e, kit.hue(12), [0.2, 0.35]], ['protein', 4 * t.prot / e, kit.hue(210), [0.1, 0.35]], ['fibre', 2 * t.fib / e, kit.hue(120), null]];
        const bx = 18, bw = W - 36, by = 30 + 2 * r + 34, bh = 20;
        kit.label(c, 'where the energy comes from', bx, by - 12, { size: 11.5, weight: 600 });
        let x = bx;
        for (const [name, s, col] of parts) {
          const w = bw * (t.kcal > 0 ? s : 0);
          c.fillStyle = col; c.fillRect(x, by, w, bh);
          if (w > 60) kit.label(c, name + ' ' + Math.round(s * 100) + '%', x + 5, by + bh / 2, { size: 10.5, weight: 600, color: C.dark ? '#111' : '#fff' });
          x += w;
        }
        // the accepted ranges, one row each
        const ry = by + bh + 14;
        parts.slice(0, 3).forEach(([name, s, col, rg], i) => {
          const y = ry + i * 16;
          c.fillStyle = C.grid; c.fillRect(bx + 120, y - 4, bw - 120, 8);
          c.fillStyle = col; c.globalAlpha = 0.35; c.fillRect(bx + 120 + (bw - 120) * rg[0], y - 4, (bw - 120) * (rg[1] - rg[0]), 8); c.globalAlpha = 1;
          const ok = s >= rg[0] && s <= rg[1];
          if (t.kcal > 0) kit.dot(c, bx + 120 + (bw - 120) * clamp(s, 0, 1), y, 5, ok ? C.ok : C.warn, C.bg2);
          kit.label(c, name + ' ' + Math.round(rg[0] * 100) + '–' + Math.round(rg[1] * 100) + ' %', bx, y, { size: 10.5, color: C.muted });
        });
        const has = t.kcal > 0;
        ro.set('kcal', Math.round(t.kcal) + ' kcal (' + Math.round(t.kcal * 4.184) + ' kJ)');
        ro.set('split', has ? parts.slice(0, 3).map(p => Math.round(p[1] * 100) + ' %').join(' / ') : '—');
        ro.set('fib', f1(t.fib) + ' g');
        ro.set('sug', has ? f1(t.sug) + ' g (' + Math.round(400 * t.sug / e) + ' % of energy)' : '—');
        ro.set('sat', has ? f1(t.sat) + ' g (' + Math.round(900 * t.sat / e) + ' % of energy)' : '—');
        const notes = [];
        if (has && 400 * t.sug / e > 10) notes.push('free sugars above 10 % of energy');
        if (has && 900 * t.sat / e > 10) notes.push('saturated fat above 10 % of energy');
        if (has && t.fib < 8 && t.kcal > 400) notes.push('little fibre for a main meal');
        if (has && !notes.length) notes.push('within the usual guidance');
        ro.set('note', has ? notes.join('; ') : 'add some food');
      }
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ energy balance over the years */
  const SCEN = { perm: -140, diet: -800, medicine: -500 };
  Hyper.sim('gi-energy-balance', {
    title: 'Energy balance over the years',
    blurb: `The dashed line is the old rule of 7 700 kcal per kilogram (3 500 kcal per pound): it assumes the gap between intake and energy use never changes. The solid line is a body that adapts — as weight falls, it uses less energy, so the gap closes and weight levels off. The lower graph shows the two sides of the balance.

- **A small permanent change**: the static rule loses weight for ever; the adapting body settles at about change ÷ 22 kcal per kg.
- **A diet for six months, then old habits**: most of the loss returns within two years, even though nothing "went wrong".
- **An appetite-lowering medicine, then stopped**: weight falls while it is taken and much of it returns after — as happened in the trials.
- Raise **Appetite pushes back** to see why losses are smaller and regain faster than energy use alone would predict.

A one-compartment simplification of research models; individual bodies vary widely. Weight changes are shown as changes, not as a target.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 180 });
      const pW = kit.plot(box.stage, { x: { label: 'years', name: 'time' }, y: { label: 'change in weight (kg)', name: 'weight' }, fmtX: v => v.toFixed(1) + ' years', fmtY: v => v.toFixed(1) + ' kg' }, 190);
      const pE = kit.plot(box.stage, { x: { label: 'years', name: 'time' }, y: { label: 'change from the start (kcal/day)', name: 'energy' }, fmtX: v => v.toFixed(1) + ' years', fmtY: v => Math.round(v) + ' kcal/day' }, 150);
      const sc0 = (params && params.scenario) || 'perm';
      const ctl = kit.controls(box.side, [
        { id: 'sc', type: 'select', label: 'Scenario', options: [['A small permanent change', 'perm'], ['A diet for six months, then old habits', 'diet'], ['An appetite-lowering medicine for 18 months, then stopped', 'medicine']], value: sc0 },
        { id: 'dI', label: 'Change in daily intake', min: -1000, max: 500, step: 10, value: SCEN[sc0] != null ? SCEN[sc0] : -140, unit: 'kcal/day' },
        { id: 'eps', label: 'Energy use changes by', min: 15, max: 35, step: 1, value: 22, unit: 'kcal/day per kg' },
        { id: 'push', label: 'Appetite pushes back', min: 0, max: 100, step: 5, value: 0, unit: 'kcal/day per kg lost' },
        { id: 'yrs', label: 'Years shown', min: 1, max: 10, step: 1, value: 4, unit: 'years' },
        { type: 'buttons', items: [{ id: 'play', label: 'Replay', primary: true }] }
      ], id => {
        if (id === 'sc') ctl.set('dI', SCEN[V.sc]);
        if (id === 'play') cur = 0;
        solve(); loop.once();
      });
      const ro = kit.readout(box.side, [['now', 'Time'], ['wA', 'Adapting body'], ['wS', 'Static 7 700 kcal/kg rule'], ['gap', 'Energy gap now'], ['plat', 'Where it levels off']]);
      const V = ctl.values;
      const RHO = 7700, BASE = 2500;
      let W = [], S = [], U = [], E = [], cur = 0, stopDay = null;
      function solve() {
        const days = Math.round(V.yrs * 365);
        stopDay = V.sc === 'diet' ? 182 : V.sc === 'medicine' ? 548 : null;
        W = []; S = []; U = []; E = [];
        let w = 0, s = 0;
        for (let d = 0; d <= days; d++) {
          const u = stopDay == null || d < stopDay ? V.dI : 0;
          const intake = u + V.push * Math.max(0, -w), use = V.eps * w;
          if (d % 3 === 0 || d === days) { const y = d / 365; W.push([y, w]); S.push([y, s]); U.push([y, intake]); E.push([y, use]); }
          w += (intake - use) / RHO;
          s += u / RHO;
        }
      }
      const at = (arr, y) => { if (!arr.length) return 0; const i = clamp(Math.round(y * 365 / 3), 0, arr.length - 1); return arr[i][1]; };
      function draw(dt) {
        if (cur < V.yrs) cur = Math.min(V.yrs, cur + (dt || 0) * V.yrs / 8);
        const C = kit.colors(), c = st.begin(), Wd = st.W, Hh = st.H;
        const inn = BASE + at(U, cur), out = BASE + at(E, cur), gap = inn - out;
        // a balance: the heavier side goes down
        const cx = Wd / 2, cy = Hh * 0.36, L = Math.min(Wd * 0.3, 220);
        const tilt = clamp(gap / 600, -1, 1) * 0.28;
        c.strokeStyle = C.text2; c.lineWidth = 3;
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx, Hh - 18); c.stroke();
        c.beginPath(); c.moveTo(cx - 40, Hh - 18); c.lineTo(cx + 40, Hh - 18); c.stroke();
        const lx = cx - L * Math.cos(tilt), ly = cy + L * Math.sin(tilt), rx = cx + L * Math.cos(tilt), ry = cy - L * Math.sin(tilt);
        c.beginPath(); c.moveTo(lx, ly); c.lineTo(rx, ry); c.stroke();
        kit.dot(c, cx, cy, 5, C.text);
        const pan = (x, y, col, title, v) => {
          c.strokeStyle = C.muted; c.lineWidth = 1;
          c.beginPath(); c.moveTo(x, y); c.lineTo(x - 36, y + 34); c.moveTo(x, y); c.lineTo(x + 36, y + 34); c.stroke();
          c.fillStyle = col; c.beginPath(); c.ellipse(x, y + 36, 46, 8, 0, 0, Math.PI * 2); c.fill();
          kit.label(c, title, x, y + 56, { size: 11.5, weight: 650, align: 'center' });
          kit.label(c, Math.round(v) + ' kcal/day', x, y + 72, { size: 11, color: C.muted, align: 'center' });
        };
        pan(lx, ly, C.series[1], 'energy in', inn);
        pan(rx, ry, C.ok, 'energy out', out);
        const msg = Math.abs(gap) < 10 ? 'in balance: weight steady' : gap < 0 ? 'using more than eating: weight falling' : 'eating more than using: weight rising';
        kit.label(c, msg, cx, 14, { size: 12, weight: 600, align: 'center', color: Math.abs(gap) < 10 ? C.ok : C.text2 });
        kit.label(c, 'for someone who used ' + BASE + ' kcal a day at the start', cx, 30, { size: 10.5, color: C.muted, align: 'center' });
        const vl = [{ x: cur }].concat(stopDay != null && stopDay / 365 <= V.yrs ? [{ x: stopDay / 365, label: V.sc === 'diet' ? 'old habits' : 'medicine stopped', color: C.warn }] : []);
        pW.set({ x: { label: 'years', name: 'time', min: 0, max: V.yrs }, series: [{ pts: S, label: 'static rule (7 700 kcal/kg)', dash: [6, 4], color: C.bad }, { pts: W, label: 'adapting body', color: C.accent, width: 2.6 }], vlines: vl, hlines: [{ y: 0 }] });
        pE.set({ x: { label: 'years', name: 'time', min: 0, max: V.yrs }, series: [{ pts: U, label: 'intake', color: C.series[1] }, { pts: E, label: 'energy use', color: C.ok }], vlines: vl });
        const w = at(W, cur), s = at(S, cur);
        const yr = Math.floor(cur + 1e-9), mo = Math.round((cur - yr) * 12);
        ro.set('now', yr + ' y ' + mo + ' m');
        ro.set('wA', (w >= 0 ? '+' : '') + f1(w) + ' kg');
        ro.set('wS', (s >= 0 ? '+' : '') + f1(s) + ' kg');
        ro.set('gap', Math.round(gap) + ' kcal/day');
        const plat = stopDay != null ? 0 : V.dI < 0 ? V.dI / (V.eps + V.push) : V.dI / V.eps;
        ro.set('plat', stopDay != null ? 'back towards the start' : (plat >= 0 ? '+' : '') + f1(plat) + ' kg');
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ liver disease: progression and recovery */
  const CAUSES = {
    masld: { name: 'fatty liver disease', fat: 0.75, infl: 0.45, rate: 0.12, fix: 'weight loss of about 10 % and treating diabetes' },
    alcohol: { name: 'heavy alcohol use', fat: 0.7, infl: 0.6, rate: 0.18, fix: 'stopping alcohol' },
    hcv: { name: 'chronic hepatitis C', fat: 0.15, infl: 0.6, rate: 0.12, fix: 'curing the infection' }
  };
  const LADDER = ['Healthy', 'Fatty liver', 'Inflammation', 'Fibrosis F1–F3', 'Cirrhosis F4'];
  Hyper.sim('gi-liver-stages', {
    title: 'The liver over the decades',
    blurb: `A schematic liver under a long-lasting injury. Yellow drops are fat, red specks inflammation, pale lines scar tissue (fibrosis), and in cirrhosis the scars wall off nodules. The graph follows the fibrosis stage, F0 to F4.

- Let the injury run without removing the cause: the scarring advances slowly, over decades, usually without symptoms.
- Remove the cause early (at 5–10 years): fat and inflammation clear within months and the scar regresses.
- Remove it late, after years of cirrhosis: the liver improves, but some scarring remains — and so does the need for cancer surveillance.
- Change the **pace**: progression varies hugely between people.

Rates are illustrative averages from long-term studies; no one's liver follows a curve exactly.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const plot = kit.plot(box.stage, { x: { label: 'years', name: 'years', min: 0, max: 40 }, y: { label: 'fibrosis stage', name: 'stage', min: 0, max: 4.2 }, fmtX: v => v.toFixed(1) + ' years', fmtY: v => 'F' + v.toFixed(1) }, 170);
      const ctl = kit.controls(box.side, [
        { id: 'cause', type: 'select', label: 'Cause of injury', options: [['Fatty liver disease (metabolic)', 'masld'], ['Heavy alcohol use', 'alcohol'], ['Chronic hepatitis C', 'hcv']], value: (params && params.cause) || 'masld' },
        { id: 'pace', type: 'select', label: 'Pace', options: [['Slower than average', 0.6], ['Average', 1], ['Faster than average', 1.8]], value: 1 },
        { id: 'fix', type: 'check', label: 'Remove the cause', value: true },
        { id: 'when', label: 'Cause removed after', min: 1, max: 39, step: 1, value: 25, unit: 'years' },
        { type: 'buttons', items: [{ id: 'play', label: 'Replay', primary: true }] }
      ], id => { if (id === 'play') cur = 0; solve(); loop.once(); });
      const ro = kit.readout(box.side, [['yr', 'Year'], ['stage', 'Stage'], ['fib', 'Fibrosis'], ['fat', 'Fat in the liver'], ['what', 'Removing the cause means']]);
      const V = ctl.values;
      const R = kit.fin.uniforms(23);
      // a liver seen from the front, in a unit box: the big right lobe on the viewer's left
      const OUT = [[0.04, 0.34], [0.12, 0.13], [0.32, 0.03], [0.58, 0.04], [0.80, 0.12], [0.98, 0.30], [0.84, 0.40], [0.64, 0.50], [0.52, 0.55], [0.44, 0.61], [0.33, 0.79], [0.20, 0.94], [0.09, 0.91], [0.02, 0.66]];
      const inside = (u, v) => { let a = false; for (let i = 0, j = OUT.length - 1; i < OUT.length; j = i++) { const [xi, yi] = OUT[i], [xj, yj] = OUT[j]; if ((yi > v) !== (yj > v) && u < (xj - xi) * (v - yi) / (yj - yi) + xi) a = !a; } return a; };
      const SMOOTH = [];
      for (let i = 0; i < OUT.length; i++) {
        const a = OUT[(i - 1 + OUT.length) % OUT.length], b = OUT[i], cc = OUT[(i + 1) % OUT.length];
        const m0 = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], m1 = [(b[0] + cc[0]) / 2, (b[1] + cc[1]) / 2];
        for (let k = 0; k < 8; k++) { const t = k / 8, w = 1 - t; SMOOTH.push([w * w * m0[0] + 2 * w * t * b[0] + t * t * m1[0], w * w * m0[1] + 2 * w * t * b[1] + t * t * m1[1]]); }
      }
      // a lattice of lobules (hexagons): portal tracts at the corners, a central vein in each middle
      const HR = 0.07, HRY = HR / 0.62, CELLS = [], EDGES = new Map(), PORT = new Map(), FAT = [], INF = [];
      const key = q => Math.round(q[0] * 1000) + ',' + Math.round(q[1] * 1000);
      for (let j = 0; j < 9; j++) for (let i = 0; i < 12; i++) {
        const cx = 0.02 + i * Math.sqrt(3) * HR + (j % 2) * Math.sqrt(3) * HR / 2, cy = 0.03 + j * 1.5 * HRY;
        const vs = [];
        for (let k = 0; k < 6; k++) { const a = (-90 + 60 * k) * Math.PI / 180; vs.push([cx + HR * Math.cos(a), cy + HRY * Math.sin(a)]); }
        if (!inside(cx, cy) && !vs.some(q => inside(q[0], q[1]))) continue;
        CELLS.push({ c: [cx, cy], vs, tone: R() });
        vs.forEach((q, k) => {
          const q2 = vs[(k + 1) % 6], ek = [key(q), key(q2)].sort().join('|');
          if (!EDGES.has(ek)) EDGES.set(ek, { a: q, b: q2, u: R() });
          if (!PORT.has(key(q))) PORT.set(key(q), q);
        });
        for (let k = 0; k < 3; k++) { const a = R() * Math.PI * 2, rr = 0.55 * Math.sqrt(R()); FAT.push({ p: [cx + HR * rr * Math.cos(a), cy + HRY * rr * Math.sin(a)], r: 0.5 + R(), q: R() }); }
      }
      for (const q of PORT.values()) for (let k = 0; k < 2; k++) INF.push({ p: [q[0] + (R() - 0.5) * HR * 0.7, q[1] + (R() - 0.5) * HRY * 0.7], q: R() });
      let traj = [], cur = 0;
      function solve() {
        const K = CAUSES[V.cause] || CAUSES.masld, dt = 0.02;
        let fat = 0.02, inf = 0.02, fib = 0, cy = 0;
        traj = [];
        for (let k = 0; k <= 40 / dt; k++) {
          const t = k * dt, active = !(V.fix && t >= V.when);
          if (k % 5 === 0) traj.push({ t, fat, inf, fib });
          if (active) {
            fat += (K.fat - fat) * Math.min(1, 1.0 * dt);
            inf += (K.infl - inf) * Math.min(1, 0.8 * dt);
            fib = Math.min(4, fib + K.rate * V.pace * (inf / K.infl) * dt);
          } else {
            fat += (0.03 - fat) * Math.min(1, 3 * dt);
            inf += (0.02 - inf) * Math.min(1, 3 * dt);
            const floor = cy > 3 ? 3.2 : 0;
            fib = Math.max(floor, fib - (fib > 3.5 ? 0.1 : 0.25) * dt);
          }
          if (fib >= 3.95) cy += dt;
        }
      }
      const stateAt = t => traj.length ? traj[clamp(Math.round(t / 0.1), 0, traj.length - 1)] : { t: 0, fat: 0, inf: 0, fib: 0 };
      function stageOf(s) {
        if (s.fib >= 3.9) return 4;
        if (s.fib >= 0.8) return 3;
        if (s.inf > 0.25) return 2;
        if (s.fat > 0.2) return 1;
        return 0;
      }
      function draw(dt) {
        if (cur < 40) cur = Math.min(40, cur + (dt || 0) * 2.5);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const s = stateAt(cur), stg = stageOf(s);
        // the liver, clipped to its outline
        const lw = Math.min(W * 0.56, (Hh - 24) / 0.62), lh = lw * 0.62, x0 = 12, y0 = (Hh - lh) / 2;
        const P = q => [x0 + lw * q[0], y0 + lh * q[1]];
        const cirr = clamp((s.fib - 3.4) / 0.6, 0, 1);
        const shape = () => {
          c.beginPath();
          SMOOTH.forEach((q, k) => {
            const wob = cirr * 0.014 * Math.sin(k * 0.62), dx = q[0] - 0.45, dy = q[1] - 0.45, d = Math.hypot(dx, dy) || 1;
            const [px, py] = P([q[0] + wob * dx / d, q[1] + wob * dy / d]);
            k ? c.lineTo(px, py) : c.moveTo(px, py);
          });
          c.closePath();
        };
        c.save();
        shape();
        c.fillStyle = kit.hue(12 + 14 * cirr, 0.62 - 0.12 * cirr); c.fill();
        c.clip();
        // lobules and their central veins
        c.strokeStyle = 'rgba(255,255,255,0.14)'; c.lineWidth = 1;
        for (const e of EDGES.values()) { const [ax, ay] = P(e.a), [bx2, by2] = P(e.b); c.beginPath(); c.moveTo(ax, ay); c.lineTo(bx2, by2); c.stroke(); }
        // regenerating nodules in cirrhosis
        if (cirr > 0) for (const cell of CELLS) {
          const [cx, cy] = P(cell.c);
          c.globalAlpha = cirr * 0.55; c.fillStyle = kit.hue(24 + 10 * cell.tone, 0.7);
          c.beginPath(); c.ellipse(cx, cy, lw * HR * 0.72, lh * HRY * 0.72, 0, 0, Math.PI * 2); c.fill(); c.globalAlpha = 1;
        }
        for (const cell of CELLS) { const [cx, cy] = P(cell.c); kit.dot(c, cx, cy, 2, kit.hue(350, 0.45)); }
        // fat droplets
        const fatShare = clamp(s.fat / 0.75, 0, 1);
        for (const f of FAT) if (f.q < fatShare) { const [px, py] = P(f.p); kit.dot(c, px, py, 1.5 + 3.5 * f.r * clamp(s.fat / 0.4, 0.4, 1.3), kit.hue(52, 0.9)); }
        // inflammation around the portal tracts
        const infShare = clamp(s.inf / 0.6, 0, 1);
        for (const f of INF) if (f.q < infShare) { const [px, py] = P(f.p); kit.dot(c, px, py, 2.2, C.bad); }
        // scar: portal tracts enlarge (F1), send out spurs (F2), bridge (F3) and wall off nodules (F4)
        const scar = C.dark ? 'rgba(236,236,246,0.85)' : 'rgba(255,255,255,0.95)';
        c.strokeStyle = scar; c.lineCap = 'round'; c.lineWidth = 1 + 0.9 * Math.max(0, s.fib - 1);
        for (const e of EDGES.values()) {
          const L = clamp((s.fib - 1.2 - e.u) / 1.6, 0, 0.5);
          if (L <= 0) continue;
          const [ax, ay] = P(e.a), [bx2, by2] = P(e.b);
          c.beginPath(); c.moveTo(ax, ay); c.lineTo(ax + (bx2 - ax) * L, ay + (by2 - ay) * L);
          c.moveTo(bx2, by2); c.lineTo(bx2 + (ax - bx2) * L, by2 + (ay - by2) * L); c.stroke();
        }
        const pr = 1.2 + 2.2 * clamp(s.fib, 0, 1.5);
        for (const q of PORT.values()) { const [px, py] = P(q); kit.dot(c, px, py, pr, s.fib > 0.3 ? scar : kit.hue(215, 0.5)); }
        c.restore();
        shape(); c.strokeStyle = kit.hue(12, 0.9); c.lineWidth = 2; c.stroke();
        // a key
        const ky = y0 + lh + 4;
        if (ky < Hh - 8) {
          [[kit.hue(52, 0.9), 'fat'], [C.bad, 'inflammation'], [scar, 'scar (fibrosis)'], [kit.hue(350, 0.45), 'central vein']].forEach(([col, txt], i) => {
            const kx = x0 + i * 100;
            kit.dot(c, kx + 5, ky + 6, 4, col, C.border2);
            kit.label(c, txt, kx + 13, ky + 6, { size: 10.5, color: C.muted });
          });
        }
        // the ladder of stages
        const lx = x0 + lw + 26, lwid = W - lx - 12, rowH = Math.min(34, (Hh - 20) / 5);
        if (lwid > 70) LADDER.forEach((name, i) => {
          const y = 10 + i * rowH, on = i === stg;
          c.fillStyle = on ? (i >= 3 ? C.bad : i >= 1 ? C.warn : C.ok) : C.surface;
          c.globalAlpha = on ? 0.85 : 1;
          c.beginPath(); c.roundRect ? c.roundRect(lx, y, lwid, rowH - 6, 6) : c.rect(lx, y, lwid, rowH - 6); c.fill(); c.globalAlpha = 1;
          c.strokeStyle = C.border2; c.lineWidth = 1; c.stroke();
          kit.label(c, name, lx + 10, y + (rowH - 6) / 2, { size: 11.5, weight: on ? 700 : 500, color: on ? (C.dark ? '#111' : '#fff') : C.muted });
        });
        const K = CAUSES[V.cause] || CAUSES.masld;
        const pts = traj.map(q => [q.t, q.fib]);
        plot.set({ series: [{ pts, label: 'fibrosis stage', color: C.accent, fill: true }], hlines: [{ y: 4, label: 'cirrhosis', color: C.bad }], vlines: [{ x: cur }].concat(V.fix ? [{ x: V.when, label: 'cause removed', color: C.ok }] : []) });
        ro.set('yr', f1(cur, 0));
        ro.set('stage', LADDER[stg] + (stg === 2 ? (V.cause === 'hcv' ? ' (chronic hepatitis)' : V.cause === 'alcohol' ? ' (alcohol-related hepatitis)' : ' (MASH)') : ''));
        ro.set('fib', 'F' + f1(s.fib) + (s.fib >= 3.9 ? ' — surveillance for liver cancer' : ''));
        ro.set('fat', Math.round(s.fat * 80) + ' % of liver cells (schematic)');
        ro.set('what', K.fix);
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

})();
