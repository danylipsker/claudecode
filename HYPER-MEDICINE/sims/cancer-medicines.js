/* HYPER-MEDICINE · sims/cancer-medicines.js — simulations for Cancer and for Medicines and
 * Treatment: hits accumulating with age, tumour growth and detection, chemotherapy cycles,
 * screening biases, survival curves, drug levels, dose–response, an interaction and a trial.
 * All drugs and patients are hypothetical; the models are schematic and say so. */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fmtInt = n => Math.round(n).toLocaleString('en-US');
  // 1.2e9 -> "1.2 billion"; small numbers in words the public reads easily
  function cellsText(n) {
    if (!(n > 0)) return '0';
    if (n < 1) return n < 0.01 ? 'less than 0.01 (on average)' : n.toFixed(2) + ' (on average)';
    if (n < 1e6) return fmtInt(n);
    const units = [[1e12, 'trillion'], [1e9, 'billion'], [1e6, 'million']];
    for (const [v, w] of units) if (n >= v) return (n / v >= 100 ? Math.round(n / v) : (n / v).toPrecision(2)) + ' ' + w;
    return fmtInt(n);
  }
  // diameter of a sphere holding n cells at 10^9 cells per cm³, as text
  function diamText(n) {
    const dcm = Math.cbrt(6 * n / (Math.PI * 1e9));
    if (dcm < 0.01) return (dcm * 1e4).toFixed(0) + ' µm';
    if (dcm < 1) return (dcm * 10).toFixed(dcm < 0.1 ? 2 : 1) + ' mm';
    return dcm.toFixed(dcm < 10 ? 1 : 0) + ' cm';
  }
  const cellsAt = dcm => 1e9 * Math.PI / 6 * dcm * dcm * dcm;

  /* ================================================================ multi-hit model */
  // one lineage needs k hits at rate v per year: P(Gamma(k) <= x), x = v·t, summed as a series (small x safe)
  function gammaCdf(k, x) {
    if (x <= 0) return 0;
    if (k <= 0) return 1;
    if (x > 30) { let s = 0, term = 1; for (let j = 0; j < k; j++) { if (j) term *= x / j; s += term; } return clamp(1 - Math.exp(-x) * s, 0, 1); }
    let term = 1; for (let j = 1; j <= k; j++) term *= x / j;       // x^k / k!
    let s = 0;
    for (let j = k; j < k + 200; j++) { s += term; term *= x / (j + 1); if (term < s * 1e-16) break; }
    return clamp(Math.exp(-x) * s, 0, 1);
  }
  function gammaPdf(k, x) {   // d/dx of gammaCdf: e^-x x^(k-1)/(k-1)!
    if (x <= 0 || k <= 0) return 0;
    let t = 1; for (let j = 1; j <= k - 1; j++) t *= x / j;
    return Math.exp(-x) * t;
  }

  Hyper.sim('cm-multihit', {
    title: 'Hits accumulating with age',
    blurb: `Each square is a person. Inside each body, millions of cell lineages collect rare, random driver mutations ("hits"); a cancer starts when any one lineage has collected **all the hits it needs**. The model is set so that, with the normal mutation rate, about 15 in 100 people develop this cancer by 85. The graph shows the yearly rate of new cases at each age.

- Watch the first 40 years: almost nothing happens, then cases pile up. With **log–log axes** the rate is a straight line whose slope is the number of hits minus one.
- Change the **hits needed** from 6 to 2: the curve flattens — cancers of childhood need few hits.
- Tick **inherited first hit**: every lineage starts one hit down, as in a family with a faulty tumour suppressor gene. The risk soars and the cancers come decades earlier.
- Raise the **mutation rate** a little (as tobacco or sunlight does): the risk grows roughly as the rate to the power of the hits.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const ctl = kit.controls(box.side, [
        { id: 'k', label: 'Hits needed', min: 2, max: 8, step: 1, value: 6 },
        { id: 'm', label: 'Mutation rate (× normal)', min: 0.5, max: 1.5, step: 0.05, value: params && params.rate ? clamp(params.rate, 0.5, 1.5) : 1 },
        { id: 'inh', type: 'check', label: 'Inherited first hit (a carrier)', value: !!(params && params.inherited) },
        { id: 'speed', label: 'Speed', min: 2, max: 20, step: 1, value: 8, unit: 'years/s' },
        { id: 'loglog', type: 'check', label: 'Log–log axes', value: true },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }, { id: 'new', label: 'New people' }] }
      ], id => {
        if (id === 'restart') age = 0;
        else if (id === 'new') { seed++; age = 0; }
        if (id !== 'speed') build();
        loop.once();
      });
      const ro = kit.readout(box.side, [['age', 'Age'], ['n', 'Diagnosed so far'], ['risk', 'Risk by age 85 (model)'], ['ratio', 'Rate at 70 ÷ rate at 35'], ['med', 'Median age at diagnosis']]);
      const plot = kit.plot(box.stage, {}, 210);
      const V = ctl.values;
      const NP = 400, V85 = 0.5, vRate = V85 / 85, BASE = 0.15;
      let age = 0, seed = 3, onset = [], Mlin = 1, sinceSet = 0, lastAge = -1;
      // cumulative hazard of a person: M lineages each needing kk hits at rate v·mult
      const cum = (t, kk, mult) => Mlin * gammaCdf(kk, vRate * mult * t);
      const haz = (t, kk, mult) => Mlin * vRate * mult * gammaPdf(kk, vRate * mult * t);   // per year
      function build() {
        const k = Math.round(V.k);
        Mlin = -Math.log(1 - BASE) / Math.max(1e-300, gammaCdf(k, V85));
        const kk = V.inh ? k - 1 : k, mult = V.m;
        const U = kit.fin.uniforms(seed);
        onset = [];
        for (let i = 0; i < NP; i++) {
          const target = -Math.log(1 - U() * 0.999999);        // the cumulative hazard at which this person is diagnosed
          if (cum(120, kk, mult) < target) { onset.push(Infinity); continue; }
          let lo = 0, hi = 120;
          for (let it = 0; it < 50; it++) { const mid = (lo + hi) / 2; if (cum(mid, kk, mult) < target) lo = mid; else hi = mid; }
          onset.push(hi);
        }
        const risk85 = 1 - Math.exp(-cum(85, kk, mult));
        ro.set('risk', (risk85 * 100).toFixed(risk85 < 0.1 ? 1 : 0) + ' %' + (V.inh || Math.abs(mult - 1) > 1e-9 ? ' (normal: 15 %)' : ''));
        const r = haz(70, kk, mult) / Math.max(1e-300, haz(35, kk, mult));
        ro.set('ratio', r >= 100 ? Math.round(r) + ' ×' : r.toFixed(1) + ' ×');
        const diag = onset.filter(x => x <= 90).sort((a, b) => a - b);
        ro.set('med', diag.length ? Math.round(diag[Math.floor(diag.length / 2)]) + ' years (of those diagnosed by 90)' : '—');
        // the graph: yearly rate per 100,000 against age
        // among people still free of this cancer, the yearly rate of new cases is the hazard
        const pts = (kk2, mult2) => { const out = []; for (let a = 5; a <= 90; a += 0.5) out.push([a, Math.max(1e-3, haz(a, kk2, mult2) * 1e5)]); return out; };
        const series = [{ pts: pts(kk, mult), label: V.inh ? 'carrier' : 'this population', width: 2.5 }];
        if (V.inh || Math.abs(mult - 1) > 1e-9) series.push({ pts: pts(k, 1), label: 'normal', dash: [5, 4], color: kit.colors().muted });
        plot.set({
          x: { label: 'age (years)', min: V.loglog ? 5 : 0, max: 90, log: V.loglog, name: 'age' },
          y: { label: 'new cases per 100,000 per year', log: true, min: 0.01, max: 1e5, name: 'rate' },
          series, fmtX: v => v.toFixed(0) + ' years', fmtY: v => kit.fmt(v, 3) + ' per 100,000',
          vlines: [{ x: Math.max(V.loglog ? 5 : 0, Math.min(90, age)), label: 'now' }]
        });
      }
      function draw(dt) {
        if (age < 90) age = Math.min(90, age + (dt || 0) * V.speed);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const cols = 40, rows = NP / cols, gap = 2;
        const cell = Math.max(3, Math.min((W - 24) / cols, (Hh - 50) / rows) - gap);
        const gw = cols * (cell + gap), x0 = (W - gw) / 2, y0 = 34;
        let n = 0, recent = 0;
        for (let i = 0; i < NP; i++) {
          const x = x0 + (i % cols) * (cell + gap), y = y0 + Math.floor(i / cols) * (cell + gap);
          const o = onset[i];
          if (o <= age) { n++; const fresh = age - o < 3; if (fresh) recent++; c.fillStyle = fresh ? C.warn : C.bad; }
          else c.fillStyle = C.faint;
          c.globalAlpha = o <= age ? 1 : 0.45;
          c.fillRect(x, y, cell, cell);
        }
        c.globalAlpha = 1;
        kit.label(c, 'Age ' + Math.floor(age) + ' · ' + n + ' of ' + NP + ' people diagnosed', x0, 16, { size: 13, weight: 650 });
        kit.label(c, '■ diagnosed in the last 3 years', x0 + gw, 16, { size: 11.5, color: C.warn, align: 'right' });
        ro.set('age', Math.floor(age) + ' years');
        ro.set('n', n + ' of ' + NP + ' (' + Math.round(100 * n / NP) + ' %)' + (recent ? ', ' + recent + ' recently' : ''));
        sinceSet += dt || 0;
        if (sinceSet > 0.15 && age < 90 + 1e-9 && age !== lastAge) { sinceSet = 0; lastAge = age; plot.set({ vlines: [{ x: Math.max(V.loglog ? 5 : 0, Math.min(90, age)), label: 'now' }] }); }
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      build();
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ tumour growth */
  const DETECT = [['a scan or mammogram (about 1 cm)', 1], ['feeling a lump (about 2 cm)', 2], ['a very sensitive future test (about 3 mm)', 0.3]];
  Hyper.sim('cm-tumour-growth', {
    title: 'Growing a tumour from one cell',
    blurb: `The number of cells in a tumour, on a logarithmic scale, from the first cancer cell. Each step up the scale is ten times more cells; a steady doubling is a straight line. The dashed line marks when the tumour becomes big enough to be found, the top line about a kilogram of tumour. Illustrative: real tumours vary enormously.

- Press **Grow from one cell** and watch how long the tumour stays invisible — usually years.
- Compare **steady doubling** with **Gompertz** growth, which is fast while the tumour is tiny and slows as it grows.
- Switch the detection method: finding a tumour at 3 mm instead of 2 cm moves detection earlier by several doublings — the promise of screening.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'Td', label: 'Doubling time at 1 cm', min: 20, max: 400, step: 5, value: 100, unit: 'days' },
        { id: 'model', type: 'select', label: 'Growth', options: [['Gompertz (slows as it grows)', 'gompertz'], ['Steady doubling (exponential)', 'exp']], value: 'gompertz' },
        { id: 'det', type: 'select', label: 'Found by', options: DETECT, value: 1 },
        { type: 'buttons', items: [{ id: 'grow', label: 'Grow from one cell', primary: true }, { id: 'pause', label: 'Pause / resume' }] }
      ], id => {
        if (id === 'grow') { tNow = 0; paused = false; }
        else if (id === 'pause') paused = !paused;
        loop.once();
      });
      const ro = kit.readout(box.side, [['t', 'Time since the first cell'], ['n', 'Cells now'], ['d', 'Diameter now'], ['dbl', 'Doublings so far'], ['det', 'Could be found after'], ['share', 'Doublings before it can be found']]);
      const V = ctl.values;
      const K = 3e12, N1 = cellsAt(1), LETHAL = 1e12;
      let tNow = 0, paused = false;
      // growth laws, time in days
      const b = () => Math.LN2 / (V.Td * Math.log(K / N1));
      const N = (t, model) => model === 'exp' ? Math.pow(2, t / V.Td) : K * Math.exp(-Math.log(K) * Math.exp(-b() * t));
      const tOf = (n, model) => model === 'exp' ? V.Td * Math.log2(n) : -Math.log(Math.log(K / n) / Math.log(K)) / b();
      function draw(dt) {
        const tEnd = Math.max(tOf(LETHAL, 'exp'), tOf(LETHAL, 'gompertz')) * 1.06;
        if (!paused) tNow = Math.min(tEnd, tNow + (dt || 0) * tEnd / 14);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const x0 = 70, x1 = W - 96, y0 = 22, y1 = Hh - 40, ymax = 13;
        const X = t => x0 + t / tEnd * (x1 - x0), Y = lg => y1 - clamp(lg, 0, ymax) / ymax * (y1 - y0);
        const nDet = cellsAt(V.det);
        const tDet = tOf(nDet, V.model), other = V.model === 'exp' ? 'gompertz' : 'exp';
        // the invisible years
        c.fillStyle = C.bg2; c.fillRect(x0, y0, X(tDet) - x0, y1 - y0);
        kit.label(c, 'too small to find', (x0 + X(tDet)) / 2, y0 + 12, { size: 11.5, color: C.muted, align: 'center' });
        // grid: powers of ten (cells) and years
        c.font = '11px system-ui, sans-serif'; c.textBaseline = 'middle';
        const names = { 0: '1 cell', 3: '1,000', 6: '1 million', 9: '1 billion', 12: '1 trillion' };
        for (let e = 0; e <= ymax; e++) {
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, Y(e)); c.lineTo(x1, Y(e)); c.stroke();
          if (names[e] != null) { c.fillStyle = C.muted; c.textAlign = 'right'; c.fillText(names[e], x0 - 6, Y(e)); }
        }
        for (const [dcm, lab] of [[0.1, '1 mm'], [1, '1 cm'], [10, '10 cm']]) {
          c.fillStyle = C.muted; c.textAlign = 'left'; c.fillText('⌀ ' + lab, x1 + 6, Y(Math.log10(cellsAt(dcm))));
        }
        const years = tEnd / 365.25, ys = Hyper.niceStep(years, 7);
        c.textAlign = 'center'; c.textBaseline = 'top';
        for (let yv = 0; yv <= years + 1e-9; yv += ys) { const x = X(yv * 365.25); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y1); c.stroke(); c.fillStyle = C.muted; c.fillText(String(+yv.toFixed(1)), x, y1 + 5); }
        kit.label(c, 'years since the first cancer cell', (x0 + x1) / 2, y1 + 26, { size: 11.5, color: C.muted, align: 'center' });
        // thresholds
        const hline = (lg, col, text) => { c.setLineDash([6, 4]); c.strokeStyle = col; c.lineWidth = 1.3; c.beginPath(); c.moveTo(x0, Y(lg)); c.lineTo(x1, Y(lg)); c.stroke(); c.setLineDash([]); kit.label(c, text, x0 + 6, Y(lg) - 9, { size: 11, color: col }); };
        hline(Math.log10(nDet), C.accent, 'can be found (' + DETECT.find(d => d[1] === V.det)[0].replace(/^a |^an /, '') + ')');
        hline(12, C.bad, 'about 1 kg: life-threatening');
        // the other model, faint, for comparison
        const curve = (model, col, w, dash, upTo) => {
          c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash || []); c.beginPath();
          const n = 240;
          for (let i = 0; i <= n; i++) { const t = upTo * i / n, x = X(t), y = Y(Math.log10(Math.max(1, N(t, model)))); i ? c.lineTo(x, y) : c.moveTo(x, y); }
          c.stroke(); c.setLineDash([]);
        };
        curve(other, C.faint, 1.5, [4, 4], tEnd);
        curve(V.model, C.bad, 2.6, null, tNow);
        const nNow = N(tNow, V.model);
        kit.dot(c, X(tNow), Y(Math.log10(Math.max(1, nNow))), 5, C.bad, C.bg2);
        if (tNow >= tDet) kit.dot(c, X(tDet), Y(Math.log10(nDet)), 5, C.accent, C.bg2);
        // the tumour itself, drawn to a (log) size in the corner
        const dcm = Math.cbrt(6 * nNow / (Math.PI * 1e9));
        const rpx = clamp(4 + 9 * Math.log10(1 + dcm * 10), 1.5, 34);
        kit.dot(c, x1 - 40, y1 - 40, rpx, C.bad);
        kit.label(c, diamText(nNow), x1 - 40, y1 - 40 + rpx + 10, { size: 11, color: C.text2, align: 'center' });
        // read-outs
        const tYears = tNow / 365.25;
        ro.set('t', tYears < 1 ? Math.round(tNow) + ' days' : tYears.toFixed(1) + ' years');
        ro.set('n', cellsText(nNow));
        ro.set('d', diamText(nNow));
        ro.set('dbl', Math.log2(Math.max(1, nNow)).toFixed(1));
        ro.set('det', (tDet / 365.25).toFixed(1) + ' years, at ' + cellsText(nDet) + ' cells');
        ro.set('share', Math.log2(nDet).toFixed(0) + ' of the ' + Math.log2(LETHAL).toFixed(0) + ' doublings to 1 kg (' + Math.round(100 * Math.log2(nDet) / Math.log2(LETHAL)) + ' %)');
      }
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ log-kill chemotherapy */
  // the fall and recovery of the neutrophil count after one dose: 0 at the dose, 1 at the low point (day 10)
  const nadir = s => s <= 0 ? 0 : Math.pow(s / 10, 5) * Math.exp(5 * (1 - s / 10));
  Hyper.sim('cm-log-kill', {
    title: 'Chemotherapy cycles and log-kill',
    blurb: `Top: the number of cancer cells on a logarithmic scale — each dose kills a fixed *fraction* (two "logs" = 99 %), and the survivors regrow until the next cycle. Bottom: the neutrophils, the white cells that fight infection, which fall about ten days after each dose and recover over about three weeks. A schematic model with a hypothetical treatment.

- With the defaults, count the cycles until the tumour drops below one cell. Notice that it becomes invisible (below about a billion cells, the dashed line) long before that: **remission is not yet cure**.
- Shorten the gap between cycles to 7 days: the tumour falls faster, but the blood count never recovers — why cycles are usually 2–4 weeks apart.
- Tick **a resistant minority**: one cell in a million shrugs off the drug. The tumour shrinks, then grows back despite treatment — the reason combinations of drugs are used.
- Make the cancer fast-growing (doubling every 5–10 days): regrowth between cycles eats most of the kill.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'L', label: 'Kill per cycle', min: 0.5, max: 4, step: 0.1, value: 2, fmt: v => v.toFixed(1) + ' logs (' + (100 * (1 - Math.pow(10, -v))).toPrecision(v >= 3 ? 4 : 3) + ' %)' },
        { id: 'tau', label: 'Days between cycles', min: 7, max: 35, step: 1, value: 21, unit: 'days' },
        { id: 'Td', label: 'Cancer doubling time', min: 5, max: 120, step: 1, value: 30, unit: 'days' },
        { id: 'n', label: 'Number of cycles', min: 1, max: 12, step: 1, value: 6 },
        { id: 'res', type: 'check', label: 'A resistant minority (1 cell in a million)', value: !!(params && params.resistant) },
        { type: 'buttons', items: [{ id: 'run', label: 'Give the treatment', primary: true }] }
      ], id => { if (id === 'run') shown = 0; solve(); loop.once(); });
      const ro = kit.readout(box.side, [['end', 'Cancer cells at the end'], ['min', 'Lowest point'], ['cure', 'Chance no cancer cell survives'], ['net', 'Net change per cycle'], ['anc', 'Lowest neutrophil count']]);
      const V = ctl.values;
      const N0 = 1e10, CAP = 3e12, BASE = 5;
      let rows = [], days = 0, shown = 0, minN = N0, minAnc = BASE;
      function solve() {
        const n = Math.round(V.n), tau = V.tau, L = V.L, g = Math.pow(2, 1 / V.Td);
        days = n * tau + 70;
        let S = N0 * (V.res ? 1 - 1e-6 : 1), R = V.res ? N0 * 1e-6 : 0, U = N0;
        rows = []; minN = N0; minAnc = BASE;
        const doses = []; for (let i = 0; i < n; i++) doses.push(i * tau);
        for (let d = 0; d <= days; d++) {
          if (doses.includes(d)) { S *= Math.pow(10, -L); R *= Math.pow(10, -0.1); }
          const tot = S + R;
          let hit = 0; for (const t0 of doses) hit += 0.75 * L * nadir(d - t0);
          const anc = BASE * Math.exp(-hit);
          rows.push({ d, tot, untreated: U, anc });
          if (tot < minN) minN = tot;
          if (anc < minAnc) minAnc = anc;
          // regrowth over the next day (capped: the model is not meant for huge tumours)
          S = Math.min(CAP, S * g); R = Math.min(CAP, R * g); U = Math.min(CAP, U * g);
        }
        const lastKill = rows[(n - 1) * tau];
        ro.set('end', cellsText(rows[rows.length - 1].tot) + ' (day ' + days + ')');
        ro.set('min', cellsText(minN) + (minN < 5e8 ? ' — too few to see on a scan' : ''));
        ro.set('cure', minN > 50 ? 'essentially none' : (100 * Math.exp(-minN)).toFixed(minN < 0.001 ? 1 : 0) + ' % (if every cell is equally sensitive)');
        const net = -L + Math.log10(2) * tau / V.Td;
        ro.set('net', (net < 0 ? '−' : '+') + Math.abs(net).toFixed(2) + ' logs' + (net >= 0 ? ' — regrowth beats the kill' : ''));
        ro.set('anc', minAnc.toFixed(2) + ' ×10⁹/L' + (minAnc < 0.5 ? ' — severe: high infection risk' : minAnc < 1 ? ' — low' : ''));
        if (lastKill && V.res && rows[rows.length - 1].tot > minN * 5) ro.set('end', cellsText(rows[rows.length - 1].tot) + ' — regrowing from resistant cells');
      }
      function draw(dt) {
        shown = Math.min(days, shown + (dt || 0) * days / 6);
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const x0 = 72, x1 = W - 18, top0 = 20, top1 = Hh * 0.62, bot0 = Hh * 0.7, bot1 = Hh - 34;
        const X = d => x0 + d / Math.max(1, days) * (x1 - x0);
        const lmin = -2, lmax = 12.5;
        const Y = n => top1 - (clamp(Math.log10(Math.max(1e-3, n)), lmin, lmax) - lmin) / (lmax - lmin) * (top1 - top0);
        const ancMax = 6, YA = a => bot1 - clamp(a, 0, ancMax) / ancMax * (bot1 - bot0);
        c.font = '11px system-ui, sans-serif'; c.textBaseline = 'middle'; c.textAlign = 'right';
        for (let e = lmin; e <= 12; e += 2) {
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, Y(Math.pow(10, e))); c.lineTo(x1, Y(Math.pow(10, e))); c.stroke();
          c.fillStyle = C.muted; c.fillText(e === 0 ? '1 cell' : '10' + String(e).replace('-', '⁻').replace(/\d/g, x => '⁰¹²³⁴⁵⁶⁷⁸⁹'[x]), x0 - 6, Y(Math.pow(10, e)));
        }
        kit.label(c, 'cancer cells', x0, top0 - 10, { size: 11.5, color: C.muted });
        // thresholds: visible on a scan, one cell
        const hl = (n, col, text) => { c.setLineDash([6, 4]); c.strokeStyle = col; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, Y(n)); c.lineTo(x1, Y(n)); c.stroke(); c.setLineDash([]); kit.label(c, text, x1 - 4, Y(n) - 9, { size: 10.5, color: col, align: 'right' }); };
        hl(5e8, C.accent, 'visible on a scan (about 1 cm)');
        hl(1, C.ok, 'one cell');
        // dose markers
        for (let i = 0; i < Math.round(V.n); i++) { const x = X(i * V.tau); c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(x, top0); c.lineTo(x, bot1); c.stroke(); }
        // untreated, dashed
        c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.lineWidth = 1.5; c.beginPath();
        rows.forEach((r, i) => i ? c.lineTo(X(r.d), Y(r.untreated)) : c.moveTo(X(r.d), Y(r.untreated))); c.stroke(); c.setLineDash([]);
        kit.label(c, 'untreated', X(Math.min(days, 40)), Y(rows[Math.min(rows.length - 1, 40)] ? rows[Math.min(rows.length - 1, 40)].untreated : 1) - 10, { size: 10.5, color: C.muted });
        // the treated tumour, drawn with the vertical drop at each dose
        c.strokeStyle = C.bad; c.lineWidth = 2.4; c.beginPath();
        let started = false;
        for (let i = 0; i < rows.length && rows[i].d <= shown; i++) {
          const r = rows[i], prev = rows[i - 1];
          const before = prev ? prev.tot * Math.pow(2, 1 / V.Td) : N0;
          if (!started) { c.moveTo(X(r.d), Y(before)); started = true; }
          else c.lineTo(X(r.d), Y(before));
          c.lineTo(X(r.d), Y(r.tot));
        }
        c.stroke();
        // neutrophils
        c.fillStyle = C.dark ? 'rgba(255,90,90,0.12)' : 'rgba(220,40,40,0.08)'; c.fillRect(x0, YA(0.5), x1 - x0, YA(0) - YA(0.5));
        c.fillStyle = C.muted; c.textAlign = 'right';
        for (const a of [0, 2, 4, 6]) { c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x0, YA(a)); c.lineTo(x1, YA(a)); c.stroke(); c.fillText(String(a), x0 - 6, YA(a)); }
        kit.label(c, 'neutrophils (×10⁹/L)', x0, bot0 - 10, { size: 11.5, color: C.muted });
        kit.label(c, 'danger of infection', x1 - 4, YA(0.25), { size: 10.5, color: C.bad, align: 'right' });
        c.strokeStyle = kit.hue(215); c.lineWidth = 2; c.beginPath();
        rows.filter(r => r.d <= shown).forEach((r, i) => i ? c.lineTo(X(r.d), YA(r.anc)) : c.moveTo(X(r.d), YA(r.anc))); c.stroke();
        // x axis
        c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top';
        const step = Hyper.niceStep(days, 8);
        for (let d = 0; d <= days; d += step) c.fillText(String(d), X(d), bot1 + 5);
        kit.label(c, 'days from the first dose (grey lines: doses)', (x0 + x1) / 2, bot1 + 22, { size: 11.5, color: C.muted, align: 'center' });
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ screening biases */
  Hyper.sim('cm-screening', {
    title: 'Screening: lead time, length bias and overdiagnosis',
    blurb: `A simulated group of 10,000 people aged 55, followed for 20 years; about 8 % develop a cancer. Each timeline is one of them: the **amber** band is the time the cancer could be found by a test before it causes symptoms, the **red dot** is when symptoms would bring the diagnosis, **×** is death from the cancer, **†** death from something else. Screening tests (ticks) can find the cancer inside the amber band (**◆**). A schematic model, not a real programme.

- Start with **no extra cure from finding it early**. Screening still raises five-year survival — yet deaths from the cancer do not change. That is **lead-time bias**.
- Look at which cancers the screens catch: mostly the long amber bands, the slow ones — **length bias**. Fast cancers often surface between screens.
- Raise **cancers that never progress**: screening finds them, "survival" soars, and all of them are **overdiagnosis**.
- Now give early treatment a real benefit: only then do cancer deaths fall.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'I', label: 'Screen every', min: 1, max: 5, step: 1, value: 2, unit: 'years' },
        { id: 'sens', label: 'Test sensitivity (each screen)', min: 50, max: 100, step: 5, value: 80, unit: '%' },
        { id: 'b', label: 'Extra cure from finding it early', min: 0, max: 60, step: 5, value: params && params.benefit != null ? params.benefit : 0, unit: '%' },
        { id: 'ind', label: 'Cancers that never progress', min: 0, max: 50, step: 5, value: 20, unit: '%' },
        { id: 'view', type: 'select', label: 'Timelines show', options: [['life with screening', 'screen'], ['life without screening', 'none']], value: 'screen' },
        { type: 'buttons', items: [{ id: 'new', label: 'New population', primary: true }] }
      ], id => { if (id === 'new') seed++; solve(); loop.once(); });
      const ro = kit.readout(box.side, [['dx', 'Cancers diagnosed per 1,000'], ['od', 'Overdiagnosed per 1,000'], ['s5', 'Five-year survival after diagnosis'], ['dead', 'Deaths from the cancer per 1,000'], ['lead', 'Average lead time'], ['how', 'Screen-detected / between screens']]);
      const V = ctl.values;
      const NPOP = 10000, H = 20, PC = 0.08, CURE0 = 0.35;
      let seed = 11, people = [], sample = [];
      function solve() {
        const U = kit.fin.uniforms(seed), Z = kit.fin.normals(seed + 1000);
        const screens = []; for (let t = 0; t < H; t += V.I) screens.push(t);
        people = [];
        const nCancer = Math.round(NPOP * PC);
        for (let i = 0; i < nCancer; i++) {
          const p = { t0: U() * H, ind: U() < V.ind / 100, uc: U(), tO: -22 * Math.log(1 - U() * 0.999999), us: screens.map(() => U()) };
          const S = 2.5 * Math.exp(0.6 * Z()), D = 1.2 * S * Math.exp(0.4 * Z());
          p.S = p.ind ? Infinity : S;
          p.D = D;
          // without screening
          p.tSym = p.t0 + p.S;
          p.dx0 = p.tSym < Math.min(p.tO, H) ? p.tSym : null;
          p.cured0 = p.uc < CURE0;
          p.death = !p.ind && !p.cured0 ? p.tSym + D : Infinity;         // death from the cancer, if nothing else intervenes
          // with screening: the first positive screen inside the detectable window
          p.ts = null;
          screens.forEach((t, j) => { if (p.ts == null && t >= p.t0 && t < Math.min(p.tSym, p.tO, H) && p.us[j] < V.sens / 100) p.ts = t; });
          p.dx1 = p.ts != null ? p.ts : p.dx0;
          const cure1 = p.ts != null ? p.uc < CURE0 + V.b / 100 * (1 - CURE0) : p.cured0;
          p.death1 = !p.ind && !cure1 ? p.tSym + D : Infinity;
          p.over = p.ts != null && (p.ind || p.tSym >= p.tO);
          people.push(p);
        }
        const per = x => (x * 1000 / NPOP).toFixed(1);
        const dx0 = people.filter(p => p.dx0 != null), dx1 = people.filter(p => p.dx1 != null);
        const surv = (list, dxKey, deathKey) => list.length ? list.filter(p => !(p[deathKey] - p[dxKey] <= 5)).length / list.length : 0;
        const dead0 = people.filter(p => p.death < Math.min(p.tO, H)).length, dead1 = people.filter(p => p.death1 < Math.min(p.tO, H)).length;
        const scr = people.filter(p => p.ts != null), inter = dx1.filter(p => p.ts == null);
        const leads = scr.filter(p => !p.over).map(p => p.tSym - p.ts);
        ro.set('dx', per(dx0.length) + ' without → ' + per(dx1.length) + ' with screening');
        ro.set('od', per(people.filter(p => p.over).length) + ' (never would have caused symptoms in life)');
        ro.set('s5', Math.round(100 * surv(dx0, 'dx0', 'death')) + ' % without → ' + Math.round(100 * surv(dx1, 'dx1', 'death1')) + ' % with');
        ro.set('dead', per(dead0) + ' without → ' + per(dead1) + ' with' + (dead1 >= dead0 ? ' (no lives saved)' : ' (' + per(dead0 - dead1) + ' saved)'));
        ro.set('lead', leads.length ? (leads.reduce((a, b) => a + b, 0) / leads.length).toFixed(1) + ' years' : '—');
        ro.set('how', per(scr.length) + ' / ' + per(inter.length) + ' per 1,000');
        // timelines: a spread of cases, sorted by when the cancer became detectable
        const pick = people.filter(p => p.t0 < H - 2 && p.tO > p.t0 + 1);
        sample = [];
        const want = [p => p.ind, p => !p.ind && p.S < 1.5, p => !p.ind && p.S > 4, p => !p.ind];
        for (let k = 0; sample.length < 12 && k < 200; k++) {
          const f = want[k % want.length], cand = pick.find(p => f(p) && !sample.includes(p));
          if (cand) sample.push(cand);
        }
        sample.sort((a, b) => a.t0 - b.t0);
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const x0 = 16, x1 = W - 16, y0 = 30, y1 = Hh - 30;
        const X = t => x0 + clamp(t, 0, H) / H * (x1 - x0);
        const scr = V.view === 'screen';
        c.font = '11px system-ui, sans-serif'; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillStyle = C.muted;
        for (let t = 0; t <= H; t += 5) { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(X(t), y0 - 6); c.lineTo(X(t), y1); c.stroke(); c.fillText(t + ' y', X(t), y1 + 4); }
        if (scr) for (let t = 0; t < H; t += V.I) { c.strokeStyle = C.accent; c.globalAlpha = 0.25; c.beginPath(); c.moveTo(X(t), y0 - 6); c.lineTo(X(t), y1); c.stroke(); c.globalAlpha = 1; }
        kit.label(c, scr ? 'with screening every ' + V.I + ' year' + (V.I > 1 ? 's' : '') + ' (blue lines)' : 'without screening', x0, 12, { size: 12, weight: 650 });
        const rowH = (y1 - y0) / Math.max(1, sample.length);
        sample.forEach((p, i) => {
          const y = y0 + rowH * (i + 0.5), end = Math.min(p.tO, H);
          c.strokeStyle = C.faint; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(0), y); c.lineTo(X(end), y); c.stroke();
          // the detectable window
          const wEnd = Math.min(p.tSym, end);
          c.fillStyle = p.ind ? (C.dark ? 'rgba(255,200,80,0.25)' : 'rgba(210,150,20,0.22)') : (C.dark ? 'rgba(255,190,60,0.55)' : 'rgba(230,150,20,0.55)');
          c.fillRect(X(p.t0), y - rowH * 0.2, Math.max(1.5, X(wEnd) - X(p.t0)), rowH * 0.4);
          if (p.ind) kit.label(c, 'never progresses', X(p.t0) + 4, y - rowH * 0.2 - 7, { size: 9.5, color: C.muted });
          if (p.tSym < end) kit.dot(c, X(p.tSym), y, 4.5, C.bad, C.bg2);
          const dth = scr ? p.death1 : p.death;
          if (dth < end) kit.label(c, '×', X(dth), y, { size: 15, weight: 700, color: C.text, align: 'center', baseline: 'middle' });
          else if (scr && p.death < end && p.death1 === Infinity) kit.label(c, '× prevented', X(p.death), y, { size: 10.5, color: C.ok, align: 'center', baseline: 'middle' });
          if (p.tO < H && !(dth < p.tO)) kit.label(c, '†', X(p.tO), y, { size: 13, color: C.muted, align: 'center', baseline: 'middle' });
          if (scr && p.ts != null) {
            const xs = X(p.ts);
            c.fillStyle = C.accent; c.beginPath(); c.moveTo(xs, y - 6); c.lineTo(xs + 6, y); c.lineTo(xs, y + 6); c.lineTo(xs - 6, y); c.closePath(); c.fill();
            if (p.tSym < end) { c.strokeStyle = C.accent; c.lineWidth = 1; c.beginPath(); c.moveTo(xs, y + rowH * 0.28); c.lineTo(X(p.tSym), y + rowH * 0.28); c.stroke(); }
            if (p.over) kit.label(c, 'overdiagnosed', xs + 8, y + rowH * 0.28, { size: 9.5, color: C.warn, baseline: 'middle' });
          }
        });
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ survival curves */
  function kaplanMeier(list) {                    // list of { t, event }; -> steps [[t, S]], censor marks, median
    const s = list.slice().sort((a, b) => a.t - b.t);
    let atRisk = s.length, S = 1, i = 0, median = null;
    const steps = [[0, 1]], cens = [];
    while (i < s.length) {
      const t = s[i].t; let d = 0, c = 0;
      while (i < s.length && s[i].t === t) { if (s[i].event) d++; else c++; i++; }
      if (d) { steps.push([t, S]); S *= 1 - d / atRisk; steps.push([t, S]); if (median == null && S <= 0.5) median = t; }
      if (c) cens.push([t, S]);
      atRisk -= d + c;
    }
    return { steps, cens, median, at: t => { let v = 1; for (const [tt, ss] of steps) if (tt <= t) v = ss; return v; } };
  }
  Hyper.sim('cm-survival', {
    title: 'Survival curves from a trial',
    blurb: `A simulated randomised trial: patients join over two years and are followed until six years after the start. Each curve is a **Kaplan–Meier** estimate — the share still alive over time; a tick marks a patient still alive when the follow-up ended. Schematic numbers, not a real trial.

- A **hazard ratio** of 0.7 means 30 % less risk of dying at every moment: the curves separate steadily and the median moves out.
- Add **lasting responders** (as with some immunotherapies): the new curve flattens into a tail — little change at the median, a big change at five years.
- Make the trial small (40 patients per arm) and press **Run the trial again** a few times: chance alone moves the curves, and the p-value tells you how surprising the difference would be if the treatments were equal.
- Set the hazard ratio to 1: the treatments are the same, yet some runs still look different.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'm0', label: 'Median survival, standard', min: 3, max: 60, step: 1, value: 12, unit: 'months' },
        { id: 'hr', label: 'Hazard ratio, new treatment', min: 0.3, max: 1.3, step: 0.05, value: params && params.hr != null ? params.hr : 0.7 },
        { id: 'cure', label: 'Lasting responders (new)', min: 0, max: 50, step: 5, value: params && params.cure != null ? params.cure : 0, unit: '%' },
        { id: 'n', label: 'Patients per arm', min: 20, max: 600, step: 10, value: 200 },
        { id: 'truth', type: 'check', label: 'Show the true curves', value: false },
        { type: 'buttons', items: [{ id: 'again', label: 'Run the trial again', primary: true }] }
      ], id => { if (id === 'again') seed++; solve(); loop.once(); });
      const ro = kit.readout(box.side, [['med', 'Median survival (standard / new)'], ['y2', 'Alive at 2 years'], ['y5', 'Alive at 5 years'], ['hrE', 'Hazard ratio estimated'], ['p', 'Log-rank test']]);
      const V = ctl.values;
      const FU = 72, ACCRUAL = 24;
      let seed = 5, arms = [];
      function solve() {
        const U = kit.fin.uniforms(seed);
        const lam0 = Math.LN2 / V.m0;
        arms = [0, 1].map(a => {
          const list = [];
          for (let i = 0; i < Math.round(V.n); i++) {
            const entry = U() * ACCRUAL, avail = FU - entry;
            const lost = -Math.log(1 - U() * 0.999999) / (0.02 / 12);      // 2 % a year lost to follow-up
            const cured = a === 1 && U() < V.cure / 100;
            const T = cured ? Infinity : -Math.log(1 - U() * 0.999999) / (lam0 * (a ? V.hr : 1));
            const cut = Math.min(avail, lost);
            list.push(T <= cut ? { t: T, event: true } : { t: cut, event: false });
          }
          return { list, km: kaplanMeier(list) };
        });
        // log-rank test
        const all = arms[0].list.map(x => ({ ...x, g: 0 })).concat(arms[1].list.map(x => ({ ...x, g: 1 }))).sort((a, b) => a.t - b.t);
        let n0 = arms[0].list.length, n1 = arms[1].list.length, O1 = 0, E1 = 0, Vv = 0, O0 = 0, E0 = 0, i = 0;
        while (i < all.length) {
          const t = all[i].t; let d0 = 0, d1 = 0, c0 = 0, c1 = 0;
          while (i < all.length && all[i].t === t) { const x = all[i]; if (x.event) { if (x.g) d1++; else d0++; } else { if (x.g) c1++; else c0++; } i++; }
          const d = d0 + d1, n = n0 + n1;
          if (d && n > 1) { E1 += d * n1 / n; E0 += d * n0 / n; Vv += d * (n0 / n) * (n1 / n) * (n - d) / (n - 1); }
          O1 += d1; O0 += d0; n0 -= d0 + c0; n1 -= d1 + c1;
        }
        const chi = Vv > 0 ? (O1 - E1) * (O1 - E1) / Vv : 0;
        const p = 2 * (1 - kit.fin.ncdf(Math.sqrt(chi)));
        const med = km => km.median != null ? km.median.toFixed(1) + ' mo' : 'not reached';
        // the true median of the new arm: cf + (1 − cf)·2^(−t/m1) = 1/2
        const cf = V.cure / 100, m1 = V.m0 / V.hr;
        const trueMed = cf >= 0.5 ? 'not reached' : (m1 * Math.log2((1 - cf) / (0.5 - cf))).toFixed(1);
        ro.set('med', med(arms[0].km) + ' / ' + med(arms[1].km) + ' (true: ' + V.m0 + ' / ' + trueMed + ')');
        const pc = v => Math.round(100 * v) + ' %';
        ro.set('y2', pc(arms[0].km.at(24)) + ' / ' + pc(arms[1].km.at(24)));
        ro.set('y5', pc(arms[0].km.at(59.9)) + ' / ' + pc(arms[1].km.at(59.9)));
        ro.set('hrE', E1 > 0 && E0 > 0 && O0 > 0 ? ((O1 / E1) / (O0 / E0)).toFixed(2) : '—');
        ro.set('p', (p < 0.001 ? 'p < 0.001' : 'p = ' + p.toFixed(3)) + (p < 0.05 ? ' — unlikely to be chance alone' : ' — could easily be chance'));
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const x0 = 56, x1 = W - 16, y0 = 24, y1 = Hh - 38;
        const X = t => x0 + Math.min(t, FU) / FU * (x1 - x0), Y = s => y1 - s * (y1 - y0);
        c.font = '11px system-ui, sans-serif';
        c.textAlign = 'right'; c.textBaseline = 'middle';
        for (let s = 0; s <= 1.0001; s += 0.25) { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, Y(s)); c.lineTo(x1, Y(s)); c.stroke(); c.fillStyle = C.muted; c.fillText(Math.round(s * 100) + ' %', x0 - 6, Y(s)); }
        c.textAlign = 'center'; c.textBaseline = 'top';
        for (let m = 0; m <= FU; m += 12) { c.strokeStyle = C.grid; c.beginPath(); c.moveTo(X(m), y0); c.lineTo(X(m), y1); c.stroke(); c.fillStyle = C.muted; c.fillText(m + '', X(m), y1 + 5); }
        kit.label(c, 'months since joining the trial', (x0 + x1) / 2, y1 + 22, { size: 11.5, color: C.muted, align: 'center' });
        kit.label(c, 'alive', x0, y0 - 12, { size: 11.5, color: C.muted });
        const cols = [kit.hue(215), C.bad];
        if (V.truth) {
          const lam0 = Math.LN2 / V.m0, cf = V.cure / 100;
          [t => Math.exp(-lam0 * t), t => cf + (1 - cf) * Math.exp(-lam0 * V.hr * t)].forEach((f, a) => {
            c.strokeStyle = cols[a]; c.globalAlpha = 0.55; c.setLineDash([5, 4]); c.lineWidth = 1.5; c.beginPath();
            for (let t = 0; t <= FU; t += 0.5) t ? c.lineTo(X(t), Y(f(t))) : c.moveTo(X(t), Y(f(t)));
            c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
          });
        }
        arms.forEach((arm, a) => {
          c.strokeStyle = cols[a]; c.lineWidth = 2.2; c.beginPath();
          const s = arm.km.steps;
          s.forEach(([t, v], i) => i ? c.lineTo(X(t), Y(v)) : c.moveTo(X(t), Y(v)));
          const last = s[s.length - 1];
          const tMax = Math.max(last[0], ...arm.list.map(x => x.t));
          c.lineTo(X(tMax), Y(last[1]));
          c.stroke();
          c.lineWidth = 1.2;
          for (const [t, v] of arm.km.cens) { c.beginPath(); c.moveTo(X(t), Y(v) - 4); c.lineTo(X(t), Y(v) + 4); c.stroke(); }
          if (arm.km.median != null) { c.setLineDash([3, 3]); c.strokeStyle = cols[a]; c.globalAlpha = 0.6; c.beginPath(); c.moveTo(X(arm.km.median), Y(0.5)); c.lineTo(X(arm.km.median), y1); c.stroke(); c.setLineDash([]); c.globalAlpha = 1; }
        });
        c.setLineDash([2, 3]); c.strokeStyle = C.faint; c.beginPath(); c.moveTo(x0, Y(0.5)); c.lineTo(x1, Y(0.5)); c.stroke(); c.setLineDash([]);
        kit.label(c, '— standard', x1 - 190, y0 + 4, { size: 12, color: cols[0], weight: 600 });
        kit.label(c, '— new treatment', x1 - 100, y0 + 4, { size: 12, color: cols[1], weight: 600 });
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ drug levels over time */
  // hypothetical drug X: volume of distribution 40 L, 80 % absorbed from a tablet, window 6–18 mg/L
  const DRUG_X = { Vd: 40, F: 0.8, ka: 1, low: 6, high: 18 };
  const EVENTS = [['nothing — every dose on time', 'none'], ['dose 5 is missed', 'miss'], ['dose 5 is missed, dose 6 doubled', 'double'], ['dose 5 is taken twice by mistake', 'twice']];
  Hyper.sim('cm-drug-levels', {
    title: 'Drug levels over time',
    blurb: `The level in the blood of **drug X**, a hypothetical medicine (volume of distribution 40 L, 80 % absorbed from a tablet). It works above 6 mg/L and causes toxic effects above 18 mg/L; the green band is the **therapeutic window**. These numbers are invented for teaching — they are not dosing advice for any real medicine.

- Give one **injection**: the level jumps, then halves every half-life. Switch to a **tablet**: the peak is lower and later, because the drug must first be absorbed.
- Give repeated doses: each adds to what is left, and the level climbs to a **steady state** in about four to five half-lives. Set a half-life of 36 hours and a dose of 100 mg: the level takes about two days to enter the window — then tick **loading dose**.
- Make the doses far apart compared with the half-life: the level swings out of the window between doses.
- Try the **missed** dose (the level sinks below the window), the missed dose made up with a double one (the peak nears the toxic line), and a dose **taken twice by mistake** (it crosses it).`,
    mount(box, kit, params) {
      const ctl = kit.controls(box.side, [
        { id: 'route', type: 'select', label: 'Given as', options: [['a tablet (by mouth)', 'oral'], ['an injection into a vein', 'iv'], ['a continuous drip', 'infusion']], value: params && params.route || 'oral' },
        { id: 'th', label: 'Half-life', min: 1, max: 48, step: 0.5, value: 12, unit: 'h' },
        { id: 'dose', label: 'Dose', min: 50, max: 800, step: 25, value: 400, unit: 'mg' },
        { id: 'tau', label: 'Every', min: 4, max: 48, step: 1, value: 12, unit: 'h' },
        { id: 'n', label: 'Number of doses', min: 1, max: 20, step: 1, value: params && params.n || 14 },
        { id: 'ev', type: 'select', label: 'What happens', options: EVENTS, value: 'none' },
        { id: 'load', type: 'check', label: 'Start with a loading dose', value: false }
      ], () => { solve(); tp = 0; loop.once(); });
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 170 });
      const ro = kit.readout(box.side, [['avg', 'Average level at steady state'], ['pt', 'Peak / trough at steady state'], ['t90', 'Time to reach 90 % of steady state'], ['acc', 'Accumulation factor'], ['win', 'Time in the window'], ['tox', 'Time above the toxic level']]);
      const plot = kit.plot(box.stage, {}, 280);
      const V = ctl.values, X = DRUG_X;
      let pk = null, doses = [], end = 48, yMax = 25, CLnow = 1, baseVlines = [], tp = 0, sinceSet = 0;
      function solve() {
        const n = Math.round(V.n), tau = V.tau, th = V.th, oral = V.route === 'oral', inf = V.route === 'infusion';
        const F = oral ? X.F : 1, k = Math.LN2 / th, CL = k * X.Vd;
        CLnow = CL;
        const avg = F * V.dose / (CL * tau);
        doses = [];
        for (let i = 0; i < n; i++) {
          let amt = V.dose;
          if (i === 4 && (V.ev === 'miss' || V.ev === 'double')) amt = 0;
          if (i === 5 && V.ev === 'double') amt *= 2;
          if (i === 4 && V.ev === 'twice') amt *= 2;
          if (amt > 0) doses.push(inf ? { t: i * tau, amount: amt, route: 'infusion', duration: tau } : { t: i * tau, amount: amt, route: oral ? 'oral' : 'iv', F, ka: X.ka });
        }
        if (V.load && n > 1) {
          // a loading dose that fills the volume of distribution to the average steady-state level
          const LD = kit.med.loadingDose(avg, X.Vd, F);
          if (inf) doses.push({ t: 0, amount: avg * X.Vd, route: 'iv' });
          else if (doses.length && doses[0].t === 0) doses[0].amount = LD;
        }
        pk = kit.med.pk({ halfLife: th, Vd: X.Vd, doses });
        end = Math.min(480, Math.max(24, (n - 1) * tau + Math.max(tau, 4 * th)));
        const pts = [], N = 700;
        let inWin = 0, above = 0, total = 0;
        const tLast = (n - 1) * tau + tau;
        for (let i = 0; i <= N; i++) {
          const t = end * i / N, c = pk.at(t);
          pts.push([t, c]);
          if (t > 0 && t <= tLast) { total++; if (c >= X.low && c <= X.high) inWin++; if (c > X.high) above++; }
        }
        // steady-state peak and trough from a long, regular course of the same doses
        const reg = []; for (let i = 0; i < 60; i++) reg.push(inf ? { t: i * tau, amount: V.dose, route: 'infusion', duration: tau } : { t: i * tau, amount: V.dose, route: oral ? 'oral' : 'iv', F, ka: X.ka });
        const pkR = kit.med.pk({ halfLife: th, Vd: X.Vd, doses: reg });
        let pk0 = 0, tr0 = Infinity; const t0 = 58 * tau;
        for (let t = t0; t <= t0 + tau; t += tau / 200) { const c = pkR.at(t); pk0 = Math.max(pk0, c); tr0 = Math.min(tr0, c); }
        const acc = 1 / (1 - Math.pow(2, -tau / th));
        ro.set('avg', kit.fmt(avg, 3) + ' mg/L' + (avg < X.low ? ' — below the window' : avg > X.high ? ' — above the window' : ''));
        ro.set('pt', kit.fmt(pk0, 3) + ' / ' + kit.fmt(tr0, 3) + ' mg/L');
        ro.set('t90', kit.fmt(3.32 * th, 3) + ' h (' + kit.fmt(3.32 * th / 24, 2) + ' days)' + (V.load && n > 1 ? ' — the loading dose skips the wait' : ''));
        ro.set('acc', inf ? 'continuous: rises to steady state' : kit.fmt(acc, 3) + ' ×');
        ro.set('win', total ? Math.round(100 * inWin / total) + ' % of the course' : '—');
        ro.set('tox', total && above ? Math.round(100 * above / total) + ' % of the course' : 'none');
        const C = kit.colors();
        yMax = Math.max(X.high * 1.3, ...pts.map(p => p[1])) * 1.05;
        baseVlines = V.ev !== 'none' && n > 4 ? [{ x: 4 * tau, label: V.ev === 'twice' ? 'double dose' : 'missed dose' }] : [];
        plot.set({
          x: { label: 'hours after the first dose', min: 0, max: end, name: 'time' },
          y: { label: 'drug X in the blood (mg/L)', min: 0, max: yMax, name: 'level' },
          series: [
            { pts: [[0, X.high], [end, X.high], [end, X.low], [0, X.low]], color: C.ok, fill: true, width: 0.1, hover: false },
            { pts, label: 'drug X', color: C.bad, width: 2.4 }
          ],
          hlines: [{ y: X.high, label: 'toxic above 18 mg/L', color: C.bad }, { y: X.low, label: 'works above 6 mg/L', color: C.ok }],
          vlines: baseVlines,
          fmtX: v => kit.fmt(v, 3) + ' h', fmtY: v => kit.fmt(v, 3) + ' mg/L'
        });
      }
      // the body as a tank: the gut (for tablets) drains into the blood, the liver and kidneys drain it away
      function draw(dt) {
        tp += (dt || 0) * end / 12;
        if (tp > end * 1.08) tp = 0;
        const t = Math.min(tp, end);
        sinceSet += dt || 0;
        if (sinceSet > 0.12) { sinceSet = 0; plot.set({ vlines: baseVlines.concat([{ x: t, label: 'now' }]) }); }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const conc = pk ? pk.at(t) : 0;
        let gut = 0;
        for (const d of doses) if (d.route === 'oral' && t >= d.t) gut += d.amount * Math.exp(-X.ka * (t - d.t));
        const y0 = 34, y1 = Hh - 22, tw = Math.min(150, W * 0.22), tx = W * 0.5 - tw / 2;
        const Yc = v => y1 - clamp(v / yMax, 0, 1) * (y1 - y0);
        // the tank: bands for the window and the toxic range
        c.fillStyle = C.dark ? 'rgba(80,200,120,0.14)' : 'rgba(40,160,80,0.12)'; c.fillRect(tx, Yc(X.high), tw, Yc(X.low) - Yc(X.high));
        c.fillStyle = C.dark ? 'rgba(255,90,90,0.12)' : 'rgba(220,40,40,0.08)'; c.fillRect(tx, y0, tw, Yc(X.high) - y0);
        c.fillStyle = C.bad; c.globalAlpha = 0.55; c.fillRect(tx + 3, Yc(conc), tw - 6, y1 - Yc(conc)); c.globalAlpha = 1;
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(tx, y0, tw, y1 - y0);
        kit.label(c, 'blood and tissues (40 L)', tx + tw / 2, y0 - 10, { size: 11.5, color: C.muted, align: 'center' });
        kit.label(c, kit.fmt(conc, 3) + ' mg/L', tx + tw / 2, Math.min(y1 - 12, Yc(conc) - 10), { size: 14, weight: 700, align: 'center', bg: C.bg2 });
        kit.label(c, 'toxic', tx + tw + 6, (y0 + Yc(X.high)) / 2, { size: 10.5, color: C.bad, baseline: 'middle' });
        kit.label(c, 'works', tx + tw + 6, (Yc(X.high) + Yc(X.low)) / 2, { size: 10.5, color: C.ok, baseline: 'middle' });
        // in: from the gut, or straight into a vein
        if (V.route === 'oral') {
          const gw = Math.min(90, W * 0.14), gx = tx - gw - 60, gh = (y1 - y0) * 0.6, gy = y1 - gh;
          const frac = clamp(gut / (2 * V.dose), 0, 1);
          c.fillStyle = C.warn; c.globalAlpha = 0.6; c.fillRect(gx + 3, gy + gh * (1 - frac), gw - 6, gh * frac); c.globalAlpha = 1;
          c.strokeStyle = C.text2; c.lineWidth = 1.5; c.strokeRect(gx, gy, gw, gh);
          kit.label(c, 'gut: ' + Math.round(gut) + ' mg', gx + gw / 2, gy - 10, { size: 11, color: C.muted, align: 'center' });
          kit.arrow(c, gx + gw + 4, gy + gh / 2, tx - 4, gy + gh / 2, C.warn, 2);
          kit.label(c, 'absorbed', (gx + gw + tx) / 2, gy + gh / 2 - 10, { size: 10.5, color: C.muted, align: 'center' });
        } else {
          kit.arrow(c, tx - 70, y0 + 20, tx - 4, y0 + 20, C.accent, 2);
          kit.label(c, V.route === 'iv' ? 'injection' : 'drip', tx - 72, y0 + 20, { size: 11, color: C.muted, align: 'right', baseline: 'middle' });
        }
        // out: cleared by the liver and kidneys at a rate proportional to the level (first order)
        const out = CLnow * conc;
        kit.arrow(c, tx + tw + 4, y1 - 20, tx + tw + 80, y1 - 20, C.muted, 1 + Math.min(5, out / 20));
        kit.label(c, 'cleared: ' + kit.fmt(out, 2) + ' mg/h', tx + tw + 84, y1 - 20, { size: 11, color: C.muted, baseline: 'middle' });
        kit.label(c, 'hour ' + Math.round(t) + (t >= 48 ? ' (day ' + (t / 24).toFixed(1) + ')' : ''), 10, 14, { size: 12.5, weight: 650 });
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ dose–response and the therapeutic index */
  const hill = (x, x50, n) => x <= 0 ? 0 : 1 / (1 + Math.pow(x50 / x, n));
  Hyper.sim('cm-dose-response', {
    title: 'Dose, response and the therapeutic index',
    blurb: `The share of people who benefit from a hypothetical medicine at each dose (green), and the share who suffer a toxic effect (red), on a logarithmic dose axis. The grid shows 100 people at the chosen dose: **green** helped, **red** harmed, **amber** both, grey neither.

- The therapeutic index is TD₅₀ ÷ ED₅₀. Keep it at 10 and make the curves shallower (slope 1): some people are harmed before others are helped. Make them steep (slope 4) and the same index is much safer.
- Move the dose up the benefit curve: near the top, each step helps few more people but harms more.
- Compare with **a more potent drug** (the same curve moved left), **a partial agonist** (a lower ceiling) and the same drug **with a competitive antagonist** (moved right, same ceiling).`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 150 });
      const ctl = kit.controls(box.side, [
        { id: 'ed', label: 'ED₅₀ (half the people helped)', min: 1, max: 100, value: 20, log: true, sig: 2, unit: 'mg/kg' },
        { id: 'td', label: 'TD₅₀ (half the people harmed)', min: 10, max: 1000, value: 200, log: true, sig: 2, unit: 'mg/kg' },
        { id: 'n', label: 'Steepness (Hill slope)', min: 0.5, max: 5, step: 0.1, value: 2 },
        { id: 'dose', label: 'Dose given', min: 0.5, max: 1000, value: 40, log: true, sig: 2, unit: 'mg/kg' },
        { id: 'cmp', type: 'select', label: 'Compare with', options: [['nothing', 'none'], ['a more potent drug', 'potent'], ['a partial agonist', 'partial'], ['the same drug with an antagonist', 'antagonist']], value: params && params.compare || 'none' },
        { id: 'tox', type: 'check', label: 'Show the toxic effects', value: !(params && params.tox === false) }
      ], () => { solve(); loop.once(); });
      const ro = kit.readout(box.side, [['ti', 'Therapeutic index (TD₅₀ ÷ ED₅₀)'], ['at', 'At the chosen dose'], ['m', 'ED₉₉ and TD₁'], ['cmp', 'The comparison']]);
      const plot = kit.plot(box.stage, {}, 260);
      const V = ctl.values;
      // 100 people: each with a dose at which they are helped and one at which they are harmed (independent)
      const U = kit.fin.uniforms(17);
      const qa = [], qb = [];
      for (let i = 0; i < 100; i++) { qa.push((i + 0.5) / 100); qb.push((i + 0.5) / 100); }
      for (let i = 99; i > 0; i--) { const j = Math.floor(U() * (i + 1)); [qb[i], qb[j]] = [qb[j], qb[i]]; }
      for (let i = 99; i > 0; i--) { const j = Math.floor(U() * (i + 1)); [qa[i], qa[j]] = [qa[j], qa[i]]; }
      const thr = (x50, n, q) => x50 * Math.pow(q / (1 - q), 1 / n);
      function solve() {
        const C = kit.colors(), n = V.n;
        const xs = []; for (let i = 0; i <= 240; i++) xs.push(0.1 * Math.pow(1e4, i / 240));
        const series = [{ pts: xs.map(x => [x, 100 * hill(x, V.ed, n)]), label: 'helped', color: C.ok, width: 2.6 }];
        if (V.tox) series.push({ pts: xs.map(x => [x, 100 * hill(x, V.td, n)]), label: 'harmed', color: C.bad, width: 2.6 });
        let note = '—';
        if (V.cmp === 'potent') { series.push({ pts: xs.map(x => [x, 100 * hill(x, V.ed / 10, n)]), label: 'more potent (ED₅₀ ÷ 10)', color: C.ok, dash: [6, 4] }); note = 'same ceiling, ten times less drug needed'; }
        if (V.cmp === 'partial') { series.push({ pts: xs.map(x => [x, 60 * hill(x, V.ed, n)]), label: 'partial agonist', color: C.ok, dash: [6, 4] }); note = 'a lower ceiling: more drug never reaches the full effect'; }
        if (V.cmp === 'antagonist') { series.push({ pts: xs.map(x => [x, 100 * hill(x, V.ed * 10, n)]), label: 'with an antagonist', color: C.ok, dash: [6, 4] }); note = 'moved right tenfold; enough drug still reaches the full effect'; }
        const helped = 100 * hill(V.dose, V.ed, n), harmed = 100 * hill(V.dose, V.td, n);
        const ed99 = thr(V.ed, n, 0.99), td1 = thr(V.td, n, 0.01);
        ro.set('ti', kit.fmt(V.td / V.ed, 3));
        ro.set('at', Math.round(helped) + ' % helped' + (V.tox ? ', ' + (harmed < 1 && harmed > 0 ? harmed.toFixed(1) : Math.round(harmed)) + ' % harmed' : ''));
        ro.set('m', kit.fmt(ed99, 3) + ' and ' + kit.fmt(td1, 3) + ' mg/kg — ' + (td1 > ed99 ? 'a safety margin of ' + kit.fmt(td1 / ed99, 2) + ' ×' : 'they overlap: some are harmed before all are helped'));
        ro.set('cmp', note);
        plot.set({
          x: { label: 'dose (mg/kg, log scale)', min: 0.1, max: 1000, log: true, name: 'dose' },
          y: { label: '% of people', min: 0, max: 100, name: '%' },
          series, vlines: [{ x: V.dose, label: 'dose given' }],
          marks: [{ x: V.ed, y: 50, label: 'ED₅₀', color: C.ok }].concat(V.tox ? [{ x: V.td, y: 50, label: 'TD₅₀', color: C.bad }] : []),
          fmtX: v => kit.fmt(v, 3) + ' mg/kg', fmtY: v => kit.fmt(v, 3) + ' %'
        });
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const cols = 20, rows = 5, r = Math.max(3, Math.min((W - 40) / cols, (Hh - 36) / rows) * 0.38);
        const gx = (W - cols * r * 2.6) / 2, gy = 30;
        let nh = 0, nb = 0, nx = 0;
        for (let i = 0; i < 100; i++) {
          const h = V.dose >= thr(V.ed, V.n, qa[i]), b = V.tox && V.dose >= thr(V.td, V.n, qb[i]);
          const col = h && b ? C.warn : h ? C.ok : b ? C.bad : C.faint;
          if (h && !b) nh++; else if (b && !h) nx++; else if (h && b) nb++;
          kit.dot(c, gx + (i % cols) * r * 2.6 + r, gy + Math.floor(i / cols) * r * 2.6 + r, r, col);
        }
        kit.label(c, 'At ' + kit.fmt(V.dose, 3) + ' mg/kg: ' + nh + ' helped only · ' + nb + ' helped and harmed · ' + nx + ' harmed only · ' + (100 - nh - nb - nx) + ' neither', W / 2, 14, { size: 12, align: 'center', weight: 600 });
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ an interaction */
  Hyper.sim('cm-interaction', {
    title: 'When one medicine changes another',
    blurb: `Someone takes a hypothetical medicine every 12 hours; its level sits in the green window. Then a second medicine is started, and later stopped (grey lines). An **enzyme inhibitor** blocks the liver enzyme that clears the first medicine; an **enzyme inducer** makes the liver produce more of it. Schematic numbers, not a real pair of drugs.

- With an inhibitor, the level climbs over a few days into the toxic range, then falls back after the inhibitor is stopped.
- Lower the **share cleared by that enzyme**: even a strong inhibitor then matters much less.
- With an inducer, the level sinks below the window — the medicine silently stops working — and the change builds and fades over one to two weeks, because the liver must make (and later remove) the extra enzyme.`,
    mount(box, kit, params) {
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Second medicine', options: [['an enzyme inhibitor', 'inh'], ['an enzyme inducer', 'ind'], ['none', 'none']], value: params && params.kind || 'inh' },
        { id: 's', label: 'Strength (I/Ki, or times more enzyme)', min: 1, max: 10, step: 0.5, value: 4 },
        { id: 'fm', label: 'Share cleared by that enzyme', min: 0, max: 100, step: 5, value: 90, unit: '%' },
        { id: 'on', label: 'Started on day', min: 2, max: 12, step: 1, value: 6 },
        { id: 'off', label: 'Stopped on day', min: 8, max: 26, step: 1, value: 18 },
        { id: 'th', label: 'Half-life of the regular medicine', min: 4, max: 24, step: 1, value: 8, unit: 'h' }
      ], () => { solve(); tp = 0; loop.once(); });
      const st = kit.stage(box.stage, { aspect: 0.26, minH: 150 });
      const ro = kit.readout(box.side, [['before', 'Average level before'], ['during', 'Average level at the most'], ['fold', 'Change'], ['hl', 'Half-life during the interaction'], ['out', 'Time outside the window']]);
      const plot = kit.plot(box.stage, {}, 280);
      const V = ctl.values;
      const Vd = 40, F = 0.8, ka = 1, DOSE = 400, TAU = 12, LOW = 4, HIGH = 16, DAYS = 32;
      let pts = [], acts = [], yMax = 25, baseV = [], tp = 0, sinceSet = 0;
      function solve() {
        const k0 = Math.LN2 / V.th, CL0 = k0 * Vd, fm = V.fm / 100;
        const tOn = V.on * 24, tOff = Math.max(V.off, V.on + 1) * 24;
        const kOn = V.kind === 'inh' ? Math.LN2 / 24 : Math.LN2 / 72;     // inhibitor builds with its own half-life; induction with enzyme turnover
        let A = 0, Cc = 0, e = 0, t = 0, nextDose = 0;
        const dt = 0.05, daily = [];
        pts = []; acts = [];
        let clMin = CL0, clMax = CL0, sum = 0, cnt = 0, out = 0, tot = 0;
        while (t <= DAYS * 24 + 1e-9) {
          if (t >= nextDose - 1e-9) { A += DOSE; nextDose += TAU; }
          const target = V.kind !== 'none' && t >= tOn && t < tOff ? 1 : 0;
          e += (target - e) * (1 - Math.exp(-kOn * dt));
          // inhibition: the enzyme's share of clearance is divided by (1 + I/Ki); induction multiplies it
          const CL = V.kind === 'inh' ? CL0 * (fm / (1 + e * V.s) + 1 - fm) : V.kind === 'ind' ? CL0 * (fm * (1 + e * (V.s - 1)) + 1 - fm) : CL0;
          clMin = Math.min(clMin, CL); clMax = Math.max(clMax, CL);
          const k = CL / Vd;
          const absorbed = A * (1 - Math.exp(-ka * dt));
          A -= absorbed;
          Cc = Cc * Math.exp(-k * dt) + F * absorbed / Vd;
          if (Math.round(t / dt) % 10 === 0) { pts.push([t / 24, Cc]); acts.push([CL / CL0, e]); }
          sum += Cc; cnt++;
          if (cnt * dt >= 24 - 1e-9) { daily.push(sum / cnt); sum = 0; cnt = 0; }
          if (t >= 48) { tot++; if (Cc < LOW || Cc > HIGH) out++; }
          t += dt;
        }
        const before = daily[Math.max(0, V.on - 1)] || daily[0];
        const ext = V.kind === 'ind' ? Math.min(...daily.slice(V.on)) : Math.max(...daily.slice(V.on));
        ro.set('before', kit.fmt(before, 3) + ' mg/L');
        ro.set('during', V.kind === 'none' ? '—' : kit.fmt(ext, 3) + ' mg/L' + (ext > HIGH ? ' — toxic' : ext < LOW ? ' — no longer works' : ''));
        ro.set('fold', V.kind === 'none' ? '—' : kit.fmt(ext / before, 2) + ' ×');
        const clX = V.kind === 'inh' ? clMin : clMax;
        ro.set('hl', kit.fmt(Math.LN2 * Vd / clX, 3) + ' h (normally ' + V.th + ' h)');
        ro.set('out', tot ? Math.round(100 * out / tot) + ' % of the time after day 2' : '—');
        const C = kit.colors();
        yMax = Math.max(HIGH * 1.3, ...pts.map(p => p[1])) * 1.05;
        baseV = V.kind === 'none' ? [] : [{ x: V.on, label: 'second medicine started' }, { x: Math.max(V.off, V.on + 1), label: 'stopped' }];
        plot.set({
          x: { label: 'days', min: 0, max: DAYS, name: 'day' },
          y: { label: 'level of the regular medicine (mg/L)', min: 0, max: yMax, name: 'level' },
          series: [
            { pts: [[0, HIGH], [DAYS, HIGH], [DAYS, LOW], [0, LOW]], color: C.ok, fill: true, width: 0.1, hover: false },
            { pts, label: 'regular medicine', color: C.bad, width: 1.8 }
          ],
          hlines: [{ y: HIGH, label: 'toxic', color: C.bad }, { y: LOW, label: 'works', color: C.ok }],
          vlines: baseV,
          fmtX: v => 'day ' + kit.fmt(v, 3), fmtY: v => kit.fmt(v, 3) + ' mg/L'
        });
      }
      // the liver's clearing enzyme and the level, day by day
      function draw(dt) {
        tp += (dt || 0) * DAYS / 14;
        if (tp > DAYS * 1.06) tp = 0;
        const day = Math.min(tp, DAYS);
        sinceSet += dt || 0;
        if (sinceSet > 0.12) { sinceSet = 0; plot.set({ vlines: baseV.concat([{ x: day, label: 'now' }]) }); }
        const i = clamp(Math.round(day / DAYS * (pts.length - 1)), 0, Math.max(0, pts.length - 1));
        const conc = pts[i] ? pts[i][1] : 0, act = acts[i] ? acts[i][0] : 1, on = acts[i] ? acts[i][1] : 0;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        kit.label(c, 'day ' + day.toFixed(1), 10, 14, { size: 12.5, weight: 650 });
        // the liver's clearing capacity as a bar: 100 % normal
        const bx = 20, by = 44, bw = Math.min(W * 0.45, 300), bh = 18, full = 3;
        c.fillStyle = C.bg2; c.fillRect(bx, by, bw, bh);
        c.fillStyle = act < 0.95 ? C.warn : act > 1.05 ? kit.hue(215) : C.ok;
        c.fillRect(bx, by, bw * clamp(act / full, 0, 1), bh);
        c.strokeStyle = C.text2; c.lineWidth = 1; c.strokeRect(bx, by, bw, bh);
        c.strokeStyle = C.text; c.beginPath(); c.moveTo(bx + bw / full, by - 4); c.lineTo(bx + bw / full, by + bh + 4); c.stroke();
        kit.label(c, 'clearing capacity of the liver: ' + Math.round(act * 100) + ' % of normal', bx, by - 10, { size: 11.5, color: C.text2 });
        kit.label(c, V.kind === 'none' ? 'no second medicine' : on > 0.02 ? (V.kind === 'inh' ? 'enzyme blocked by the inhibitor' : 'extra enzyme made by the inducer') + ' (' + Math.round(on * 100) + ' % of its full effect)' : 'second medicine not active', bx, by + bh + 14, { size: 11, color: C.muted });
        // the level as a gauge
        const gx = W * 0.62, gw = W * 0.34, gy = Hh * 0.52, gh = 16;
        const Xg = v => gx + clamp(v / yMax, 0, 1) * gw;
        c.fillStyle = C.dark ? 'rgba(80,200,120,0.25)' : 'rgba(40,160,80,0.2)'; c.fillRect(Xg(LOW), gy, Xg(HIGH) - Xg(LOW), gh);
        c.fillStyle = C.dark ? 'rgba(255,90,90,0.22)' : 'rgba(220,40,40,0.15)'; c.fillRect(Xg(HIGH), gy, gx + gw - Xg(HIGH), gh);
        c.strokeStyle = C.text2; c.strokeRect(gx, gy, gw, gh);
        kit.dot(c, Xg(conc), gy + gh / 2, 7, C.bad, C.bg2);
        kit.label(c, 'level: ' + kit.fmt(conc, 3) + ' mg/L' + (conc > HIGH ? ' — toxic' : conc < LOW ? ' — too low to work' : ''), gx, gy - 12, { size: 12, weight: 600, color: conc > HIGH || conc < LOW ? C.bad : C.text });
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ why trials randomise */
  const DESIGNS = [['Before and after, no comparison', 'prepost'], ['Takers vs people who chose not to', 'chose'], ['Randomised, blinded, placebo-controlled', 'rct']];
  Hyper.sim('cm-trial', {
    title: 'Why trials randomise',
    blurb: `A simulated study of a hypothetical medicine for a symptom scored 0–100 (higher is worse). People join when their symptoms are bad (a score of 60 or more), and are scored again six weeks later; each dot is one person's **improvement**. The bar on the right splits the estimate into what really caused it. Invented numbers, for teaching.

- **Before and after**: even a drug with **no effect** seems to work — people improve by themselves, return towards their usual level (**regression to the mean**) and feel the **placebo effect**.
- **Takers vs those who chose not to**: the people who choose a treatment differ (here they also exercise and sleep more), so the comparison is **confounded**.
- **Randomised with placebo**: everything except the drug is shared by both groups, so the difference estimates the drug alone — give or take **chance**. Make the groups small and run it again several times.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'design', type: 'select', label: 'Study design', options: DESIGNS, value: params && params.design || 'rct' },
        { id: 'drug', label: 'True effect of the drug', min: 0, max: 15, step: 0.5, value: 0, unit: 'points' },
        { id: 'plac', label: 'Placebo effect', min: 0, max: 15, step: 0.5, value: 6, unit: 'points' },
        { id: 'n', label: 'People per group', min: 10, max: 400, step: 10, value: 60 },
        { type: 'buttons', items: [{ id: 'again', label: 'Run the study again', primary: true }] }
      ], id => { if (id === 'again') seed++; solve(); loop.once(); });
      const ro = kit.readout(box.side, [['est', 'Apparent benefit of the drug'], ['truth', 'True effect of the drug'], ['p', 'Could it be chance?'], ['what', 'What the estimate contains']]);
      const V = ctl.values;
      const NATURAL = 4, HEALTHY = 5;
      let seed = 21, groups = [], parts = [], est = 0, lo = 0, hi = 0;
      function person(Z, U, drug, pill, extra) {
        // a usual level, a bad day that brought them in, and a score six weeks later
        let mu, base;
        do { mu = 50 + 12 * Z(); base = mu + 10 * Z(); } while (base < 60);
        const later = mu - NATURAL - (pill ? V.plac : 0) - (drug ? V.drug : 0) - extra + 10 * Z();
        return { mu, base, imp: base - later };
      }
      const mean = a => a.reduce((s, x) => s + x, 0) / Math.max(1, a.length);
      const sd = a => { const m = mean(a); return Math.sqrt(a.reduce((s, x) => s + (x - m) * (x - m), 0) / Math.max(1, a.length - 1)); };
      function solve() {
        const Z = kit.fin.normals(seed), U = kit.fin.uniforms(seed + 500), n = Math.round(V.n);
        groups = []; parts = [];
        let se = 1;
        if (V.design === 'prepost') {
          const g = []; for (let i = 0; i < n; i++) g.push(person(Z, U, true, true, 0));
          groups = [{ label: 'everyone, on the drug', pts: g.map(p => p.imp), col: 'bad' }];
          est = mean(groups[0].pts); se = sd(groups[0].pts) / Math.sqrt(n);
          const rtm = mean(g.map(p => p.base - p.mu));
          parts = [['drug', V.drug], ['placebo', V.plac], ['natural recovery', NATURAL], ['regression to the mean', rtm]];
        } else {
          const a = [], b = [];
          if (V.design === 'chose') {
            // everyone who joined decides for themselves; those who choose the drug also exercise and sleep more
            for (let i = 0; i < 2 * n; i++) { const takes = U() < 0.5; (takes ? a : b).push(person(Z, U, takes, takes, takes ? HEALTHY : 0)); }
          } else {
            for (let i = 0; i < n; i++) { a.push(person(Z, U, true, true, 0)); b.push(person(Z, U, false, true, 0)); }
          }
          groups = [{ label: V.design === 'chose' ? 'chose the drug' : 'drug', pts: a.map(p => p.imp), col: 'bad' }, { label: V.design === 'chose' ? 'chose not to' : 'placebo', pts: b.map(p => p.imp), col: 'blue' }];
          est = mean(groups[0].pts) - mean(groups[1].pts);
          se = Math.sqrt(sd(groups[0].pts) ** 2 / Math.max(1, a.length) + sd(groups[1].pts) ** 2 / Math.max(1, b.length));
          parts = V.design === 'chose' ? [['drug', V.drug], ['placebo', V.plac], ['healthier choosers', HEALTHY]] : [['drug', V.drug]];
        }
        const expected = parts.reduce((s, x) => s + x[1], 0);
        parts.push(['chance', est - expected]);
        lo = est - 1.96 * se; hi = est + 1.96 * se;
        const z = se > 0 ? Math.abs(est) / se : 0, p = 2 * (1 - kit.fin.ncdf(z));
        ro.set('est', kit.fmt(est, 2) + ' points (95 % CI ' + kit.fmt(lo, 2) + ' to ' + kit.fmt(hi, 2) + ')');
        ro.set('truth', kit.fmt(V.drug, 2) + ' points');
        ro.set('p', (p < 0.001 ? 'p < 0.001' : 'p = ' + p.toFixed(3)) + (V.design === 'rct' ? (p < 0.05 ? ' — unlikely to be chance alone' : ' — could easily be chance') : ' — but the comparison itself is biased'));
        ro.set('what', parts.filter(x => x[0] !== 'chance').map(x => x[0]).join(' + ') + ' + chance');
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const x0 = 56, x1 = W - 170, y0 = 26, y1 = Hh - 36;
        const all = groups.flatMap(g => g.pts);
        const lim = Math.max(30, ...all.map(Math.abs)) * 1.05;
        const Y = v => y0 + (lim - v) / (2 * lim) * (y1 - y0);
        c.font = '11px system-ui, sans-serif'; c.textAlign = 'right'; c.textBaseline = 'middle';
        const step = Hyper.niceStep(2 * lim, 6);
        for (let v = -Math.floor(lim / step) * step; v <= lim; v += step) { c.strokeStyle = Math.abs(v) < 1e-9 ? C.axis : C.grid; c.lineWidth = Math.abs(v) < 1e-9 ? 1.5 : 1; c.beginPath(); c.moveTo(x0, Y(v)); c.lineTo(x1, Y(v)); c.stroke(); c.fillStyle = C.muted; c.fillText(String(Math.round(v)), x0 - 6, Y(v)); }
        kit.label(c, 'improvement after six weeks (points; below 0 = worse)', x0, y0 - 14, { size: 11.5, color: C.muted });
        const R = kit.fin.uniforms(3);
        const colW = (x1 - x0) / Math.max(1, groups.length);
        groups.forEach((g, gi) => {
          const cx = x0 + colW * (gi + 0.5), col = g.col === 'blue' ? kit.hue(215) : C.bad;
          c.globalAlpha = 0.45;
          for (const v of g.pts) kit.dot(c, cx + (R() - 0.5) * colW * 0.5, Y(v), 2.6, col);
          c.globalAlpha = 1;
          const m = mean(g.pts);
          c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(cx - colW * 0.3, Y(m)); c.lineTo(cx + colW * 0.3, Y(m)); c.stroke();
          kit.label(c, g.label + ': ' + kit.fmt(m, 2), cx, y1 + 16, { size: 12, color: col, align: 'center', weight: 600 });
        });
        // the estimate, split into its causes
        const bx = W - 140, bw = 34, zero = Y(0);
        kit.label(c, 'what the estimate', bx + bw / 2, y0 - 14, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'is made of', bx + bw / 2, y0, { size: 11, color: C.muted, align: 'center' });
        const palette = { drug: C.bad, placebo: C.warn, 'natural recovery': C.faint, 'regression to the mean': C.muted, 'healthier choosers': kit.hue(280), chance: kit.hue(215) };
        let up = 0, down = 0;
        for (const [name, v] of parts) {
          if (Math.abs(v) < 1e-9) continue;
          const from = v >= 0 ? up : down, to = from + v;
          c.fillStyle = palette[name] || C.accent;
          c.fillRect(bx, Math.min(Y(from), Y(to)), bw, Math.abs(Y(to) - Y(from)));
          kit.label(c, name + ' ' + (v >= 0 ? '+' : '−') + kit.fmt(Math.abs(v), 2), bx + bw + 6, (Y(from) + Y(to)) / 2, { size: 10.5, color: C.text2, baseline: 'middle' });
          if (v >= 0) up = to; else down = to;
        }
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx - 6, Y(est)); c.lineTo(bx + bw + 4, Y(est)); c.stroke();
        c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.moveTo(bx - 3, Y(lo)); c.lineTo(bx - 3, Y(hi)); c.stroke();
        kit.label(c, 'estimate', bx - 8, Y(est), { size: 10.5, color: C.text, align: 'right', baseline: 'middle' });
        c.strokeStyle = C.axis; c.beginPath(); c.moveTo(bx - 10, zero); c.lineTo(bx + bw + 10, zero); c.stroke();
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.once();
      st.onResize(() => loop.once());
    }
  });

})();
