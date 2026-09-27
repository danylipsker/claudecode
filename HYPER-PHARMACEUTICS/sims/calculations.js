/* HYPER-PHARMACEUTICS · sims/calculations.js — simulations for pharmaceutical calculations (calc-topic).
 *   calc-cylinder    measuring a stock with a syringe or cylinder and making it up to volume (C1V1 = C2V2),
 *                    with the reading uncertainty of the measure you choose
 *   calc-serial      a rack of tubes diluted step by step, colour fading; random pipetting errors compound (repeat runs)
 *   calc-alligation  the alligation grid as a see-saw: strengths are positions, amounts are weights; drag the fulcrum
 *   calc-isotonic    eye drops made isotonic with sodium chloride equivalents, and red cells that swell, shrink or burst
 *   calc-paeds       one hypothetical drug scaled from an adult dose across ages: by weight, surface area, allometry, maturation
 *   calc-drip        a drip chamber and a clock: set a gravity infusion with the roller clamp and count drops for 15 s
 *   calc-tenfold     the classic slips (trailing zero, naked decimal, mg/µg, per minute/per hour...) on a log dose ruler
 *   calc-ions        a salt dissolving into ions: millimoles, milliequivalents and milliosmoles counted side by side
 * Every drug and patient is hypothetical; these are teaching models, never dosing tools.
 */
(function () {
  'use strict';
  const clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  const ease = s => { s = clamp(s, 0, 1); return s * s * (3 - 2 * s); };
  const lerp = (a, b, s) => a + (b - a) * s;
  // concentration (mg/mL) -> a fill colour whose strength follows the logarithm of the concentration
  const drugAlpha = c => clamp(0.1 + 0.78 * (Math.log10(Math.max(c, 1e-9)) + 1) / 3.4, 0.05, 0.9);
  const WATER = kit => kit.hue(200, 0.14);
  // whole numbers from 10 000 up with spaces between the thousands ("1 in 10 000"); anything else to 3 figures
  const big = (kit, v) => v >= 1e4 && v < 1e12 && Math.abs(v - Math.round(v)) < 1e-6 * v ? String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : kit.fmt(v, 3);
  // a concentration in mg/mL shown in the unit that suits it
  function fmtConc(kit, c) {
    if (!(c > 0)) return '0 mg/mL';
    if (c >= 1) return kit.fmt(c, 3) + ' mg/mL';
    if (c >= 1e-3) return kit.fmt(c * 1e3, 3) + ' µg/mL';
    if (c >= 1e-6) return kit.fmt(c * 1e6, 3) + ' ng/mL';
    return kit.fmt(c * 1e9, 3) + ' pg/mL';
  }
  // a graduated vessel: x, top, w, h in px, capacity (mL), fill (mL), colour; syringe or cylinder
  function vessel(c, kit, o) {
    const C = kit.colors(), { x, top, w, h, cap } = o;
    const fillH = h * clamp(o.fill / cap, 0, 1);
    if (o.layers) {                                  // [[mL, colour], ...] from the bottom up
      let y = top + h;
      for (const [v, col] of o.layers) { const hh = h * clamp(v / cap, 0, 1); c.fillStyle = col; c.fillRect(x + 1, y - hh, w - 2, hh); y -= hh; }
    } else if (fillH > 0) { c.fillStyle = o.color; c.fillRect(x + 1, top + h - fillH, w - 2, fillH); }
    c.strokeStyle = C.text; c.lineWidth = 1.6;
    if (o.syringe) {
      c.strokeRect(x, top, w, h);
      c.beginPath(); c.moveTo(x + w * 0.35, top + h); c.lineTo(x + w * 0.42, top + h + 10); c.lineTo(x + w * 0.58, top + h + 10); c.lineTo(x + w * 0.65, top + h); c.stroke();
      c.beginPath(); c.moveTo(x + w / 2, top + h + 10); c.lineTo(x + w / 2, top + h + 22); c.stroke();
      const py = top + h - fillH;                     // the plunger sits on the liquid
      c.fillStyle = C.muted; c.fillRect(x + 2, py - 5, w - 4, 5);
      c.fillRect(x + w / 2 - 2, top - 14, 4, Math.max(0, py - top + 9));
      c.fillRect(x + w / 2 - 12, top - 17, 24, 4);
    } else {
      c.beginPath(); c.moveTo(x, top - 4); c.lineTo(x, top + h); c.lineTo(x + w, top + h); c.lineTo(x + w, top - 4); c.stroke();
      c.fillStyle = C.muted; c.fillRect(x - 8, top + h, w + 16, 5);
      c.beginPath(); c.moveTo(x, top - 4); c.lineTo(x - 5, top - 8); c.stroke();
    }
    // graduations: major ticks with numbers, minor ticks at the graduation if there are not too many
    const major = Hyper.niceStep(cap, 5), minor = o.grad && cap / o.grad <= 60 ? o.grad : major / 5;
    c.lineWidth = 1; c.strokeStyle = C.muted;
    for (let v = minor; v <= cap + 1e-9; v += minor) {
      const y = top + h - h * v / cap, isMaj = Math.abs(v / major - Math.round(v / major)) < 1e-6;
      c.beginPath(); c.moveTo(x + w, y); c.lineTo(x + w - (isMaj ? 10 : 5), y); c.stroke();
      if (isMaj) kit.label(c, kit.fmt(v, 3), x + w + 3, y, { size: 9.5, color: C.muted });
    }
  }

  /* ================================================================ calc-cylinder */
  Hyper.sim('calc-cylinder', {
    title: 'Measuring and making a dilution',
    blurb: `A stock solution of a hypothetical drug is diluted by the rule $C_1V_1 = C_2V_2$: the stock is measured, transferred and **made up to** the final volume, then mixed. The colour shows the strength. The measure you choose sets how well the volume can be read — about half a graduation either way — and that uncertainty goes straight into the final strength.

**Try this**
- Make 250 mL of 2 mg/mL from a 50 mg/mL stock: 10 mL of stock. Then force the 100 mL or 250 mL cylinder: how uncertain is the result now?
- Lower the wanted strength to 0.2 mg/mL: the stock volume shrinks to 1 mL — which measure can still read it?
- Push the wanted strength above the stock: dilution cannot concentrate.
- Watch the readout of % w/v and ratio strength while you move the sliders: 1 % w/v is always 10 mg/mL.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const DEV = {
        s1: { cap: 1, grad: 0.01, name: '1 mL syringe', syr: true }, s2: { cap: 2, grad: 0.1, name: '2 mL syringe', syr: true }, s5: { cap: 5, grad: 0.2, name: '5 mL syringe', syr: true },
        c10: { cap: 10, grad: 0.2, name: '10 mL cylinder' }, c25: { cap: 25, grad: 0.5, name: '25 mL cylinder' },
        c100: { cap: 100, grad: 1, name: '100 mL cylinder' }, c250: { cap: 250, grad: 2, name: '250 mL cylinder' }
      };
      const ORDER = ['s1', 's2', 's5', 'c10', 'c25', 'c100', 'c250'];
      const FINAL = [[10, 0.2], [25, 0.5], [50, 1], [100, 1], [250, 2], [500, 5]];
      const ctl = kit.controls(box.side, [
        { id: 'C1', label: 'Stock strength C₁', min: 1, max: 200, value: 50, unit: 'mg/mL', log: true, sig: 2 },
        { id: 'C2', label: 'Strength wanted C₂', min: 0.1, max: 100, value: 2, unit: 'mg/mL', log: true, sig: 2 },
        { id: 'V2', label: 'Final volume V₂', min: 10, max: 500, step: 10, value: 250, unit: 'mL' },
        { id: 'dev', type: 'select', label: 'Measure the stock with', options: [['the smallest measure that holds it', 'auto'], ['a 1 mL syringe (0.01 mL marks)', 's1'], ['a 2 mL syringe (0.1 mL marks)', 's2'], ['a 5 mL syringe (0.2 mL marks)', 's5'], ['a 10 mL cylinder (0.2 mL marks)', 'c10'], ['a 25 mL cylinder (0.5 mL marks)', 'c25'], ['a 100 mL cylinder (1 mL marks)', 'c100'], ['a 250 mL cylinder (2 mL marks)', 'c250']], value: 'auto' },
        { type: 'buttons', items: [{ id: 'make', label: 'Make it again', primary: true }] }
      ], () => restart());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['v1', 'Stock to measure V₁'], ['dil', 'Diluent'], ['df', 'Dilution'], ['str', 'Strength, stock → final'], ['amt', 'Drug in the final volume'], ['err', 'Reading uncertainty'], ['msg', '']]);
      let R = null, clock = 0;
      function compute() {
        const C1 = V.C1, C2 = V.C2, V2 = V.V2, ok = C2 < C1;
        const V1 = ok ? C2 * V2 / C1 : 0;
        let key = V.dev;
        if (key === 'auto') key = ORDER.find(k => DEV[k].cap >= V1 - 1e-9) || 'c250';
        const d = DEV[key], fills = ok ? Math.max(1, Math.ceil(V1 / d.cap - 1e-9)) : 1;
        const fin = FINAL.find(f => f[0] >= V2 - 1e-9) || FINAL[FINAL.length - 1];
        const rel1 = ok && V1 > 0 ? Math.sqrt(fills) * d.grad / 2 / V1 : 0, rel2 = fin[1] / 2 / V2;
        R = { C1, C2, V2, ok, V1, d, fills, fin, rel1, rel2, rel: Math.sqrt(rel1 * rel1 + rel2 * rel2) };
        if (!ok) {
          ['v1', 'dil', 'df', 'amt', 'err'].forEach(k => ro.set(k, '—'));
          ro.set('str', kit.fmt(C1 / 10, 3) + ' % w/v → —');
          ro.set('msg', 'The strength wanted must be weaker than the stock: dilution cannot concentrate.');
          return;
        }
        ro.set('v1', kit.fmt(V1, 3) + ' mL' + (fills > 1 ? ' (' + fills + ' fills of the ' + d.name + ')' : ' with the ' + d.name));
        ro.set('dil', 'make up to ' + kit.fmt(V2, 3) + ' mL (about ' + kit.fmt(V2 - V1, 3) + ' mL)');
        ro.set('df', '1 in ' + kit.fmt(C1 / C2, 3));
        ro.set('str', kit.fmt(C1 / 10, 3) + ' → ' + kit.fmt(C2 / 10, 3) + ' % w/v (1 in ' + kit.fmt(1000 / C2, 3) + ')');
        ro.set('amt', kit.fmt(C2 * V2, 4) + ' mg = ' + kit.fmt(V1, 3) + ' mL × ' + kit.fmt(C1, 3) + ' mg/mL');
        ro.set('err', 'measure ±' + kit.fmt(100 * rel1, 2) + ' %, make-up ±' + kit.fmt(100 * rel2, 2) + ' % → C₂ ±' + kit.fmt(100 * R.rel, 2) + ' %');
        ro.set('msg', V1 < d.grad ? 'Less than one graduation: this measure cannot read it — dilute in two steps.' :
          R.rel > 0.05 ? 'Too uncertain: choose a smaller measure.' :
          V1 < 0.2 * d.cap && fills === 1 ? 'Less than a fifth of the measure\'s capacity: a smaller one would be better.' : 'A sensible choice of measure.');
      }
      function restart() { compute(); clock = 0; loop.start(); }
      const P1 = 2.2, P2 = 1.6, P3 = 2.6, P4 = 1.2, TOT = P1 + P2 + P3 + P4;
      const loop = kit.loop((dt) => {
        clock = Math.min(TOT + 0.5, clock + dt);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (!R) compute();
        const top = Hh * 0.15, h = Hh * 0.62, base = top + h;
        const stockCol = kit.hue(325, drugAlpha(R.C1));
        // the stock bottle
        const bx = W * 0.05, bw = Math.min(70, W * 0.1), bh = h * 0.7;
        c.fillStyle = stockCol; c.fillRect(bx, base - bh * 0.8, bw, bh * 0.8);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(bx, base - bh, bw, bh); c.strokeRect(bx + bw * 0.3, base - bh - 12, bw * 0.4, 12);
        kit.label(c, 'stock', bx + bw / 2, base + 16, { align: 'center', size: 12, weight: 700 });
        kit.label(c, kit.fmt(R.C1, 3) + ' mg/mL', bx + bw / 2, base + 31, { align: 'center', size: 11.5, color: C.muted });
        if (!R.ok) {
          kit.label(c, 'C₂ must be below C₁ — a dilution can only make a solution weaker.', W * 0.25, Hh * 0.45, { size: 14, weight: 700, color: C.bad });
          loop.stop(); return;
        }
        const s1 = ease(clock / P1), s2 = ease((clock - P1) / P2), s3 = ease((clock - P1 - P2) / P3), s4 = ease((clock - P1 - P2 - P3) / P4);
        // the measure
        const d = R.d, mx = W * 0.27, mw = d.syr ? 26 : 34, perFill = R.V1 / R.fills;
        const inMeas = perFill * s1 * (1 - s2);
        vessel(c, kit, { x: mx, top, w: mw, h, cap: d.cap, fill: inMeas, color: stockCol, syringe: d.syr, grad: d.grad });
        // reading uncertainty: half a graduation either side of the mark
        const yMark = base - h * clamp(perFill / d.cap, 0, 1), eh = Math.max(1.5, h * d.grad / 2 / d.cap);
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath();
        c.moveTo(mx - 8, yMark - eh); c.lineTo(mx - 12, yMark - eh); c.lineTo(mx - 12, yMark + eh); c.lineTo(mx - 8, yMark + eh); c.stroke();
        c.strokeStyle = C.accent; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(mx - 6, yMark); c.lineTo(mx + mw + 6, yMark); c.stroke(); c.setLineDash([]);
        kit.label(c, d.name, mx + mw / 2, base + 16 + (d.syr ? 22 : 0), { align: 'center', size: 12, weight: 700 });
        kit.label(c, kit.fmt(perFill, 3) + ' mL ± ' + kit.fmt(d.grad / 2, 2) + (R.fills > 1 ? ' (×' + R.fills + ')' : '') + ' = ±' + kit.fmt(100 * R.rel1, 2) + ' %', mx + mw / 2, base + 31 + (d.syr ? 22 : 0), { align: 'center', size: 11.5, color: R.rel1 > 0.05 ? C.bad : C.warn });
        // the final vessel: stock layer, diluent layer, then mixed
        const fx = W * 0.5, fw = Math.min(64, W * 0.09), fcap = R.fin[0];
        const vStock = R.V1 * s2, vDil = (R.V2 - R.V1) * s3;
        const mixCol = kit.hue(325, drugAlpha(R.C2));
        if (s4 < 1) vessel(c, kit, { x: fx, top, w: fw, h, cap: fcap, fill: vStock + vDil, layers: [[vStock, stockCol], [vDil, WATER(kit)]], grad: R.fin[1] });
        if (s4 > 0) { c.save(); c.globalAlpha = s4; vessel(c, kit, { x: fx, top, w: fw, h, cap: fcap, fill: R.V2, color: mixCol, grad: R.fin[1] }); c.restore(); }
        const yV2 = base - h * R.V2 / fcap;
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(fx - 8, yV2); c.lineTo(fx + fw + 8, yV2); c.stroke();
        kit.label(c, fcap + ' mL cylinder', fx + fw / 2, base + 16, { align: 'center', size: 12, weight: 700 });
        kit.label(c, 'make up to ' + kit.fmt(R.V2, 3) + ' mL', fx + fw / 2, base + 31, { align: 'center', size: 11.5, color: C.ok });
        // pouring streams
        if (clock > P1 && clock < P1 + P2) { c.strokeStyle = stockCol; c.lineWidth = 3; c.beginPath(); c.moveTo(mx + mw, top - 2); c.quadraticCurveTo(fx - 10, top - 30, fx + fw / 2, base - h * vStock / fcap); c.stroke(); }
        if (clock > P1 + P2 && clock < P1 + P2 + P3) {
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(fx + fw + 26, top - 40, 22, 34);
          kit.label(c, 'diluent', fx + fw + 37, top - 48, { align: 'center', size: 11, color: C.muted });
          c.strokeStyle = kit.hue(200, 0.5); c.lineWidth = 2.5; c.beginPath(); c.moveTo(fx + fw + 26, top - 30); c.quadraticCurveTo(fx + fw / 2 + 10, top - 34, fx + fw / 2, base - h * (vStock + vDil) / fcap); c.stroke();
        }
        // the summary at the right (on a narrow screen, only the phase and the result)
        const tx = fx + fw + 64, narrow = tx > W - 170;
        const phase = clock < P1 ? 'measuring the stock' : clock < P1 + P2 ? 'transferring it' : clock < P1 + P2 + P3 ? 'making up to volume' : clock < TOT ? 'mixing' : 'done';
        const sx = narrow ? fx + fw + 34 : tx, fs = narrow ? 10.5 : 12;
        kit.label(c, phase, sx, top + 4 + (narrow ? 30 : 0), { size: fs + 1, weight: 700, color: C.accent });
        if (!narrow) {
          kit.label(c, 'C₁V₁ = C₂V₂', tx, top + 30, { size: 13, weight: 700 });
          kit.label(c, kit.fmt(R.C1, 3) + ' × ' + kit.fmt(R.V1, 3) + ' = ' + kit.fmt(R.C2, 3) + ' × ' + kit.fmt(R.V2, 3), tx, top + 50, { size: 12, color: C.muted });
          kit.label(c, 'drug: ' + kit.fmt(R.C2 * R.V2, 4) + ' mg, before and after', tx, top + 70, { size: 12, color: C.muted });
        }
        if (clock >= TOT) {
          kit.label(c, 'C₂ = ' + kit.fmt(R.C2, 3) + ' mg/mL ± ' + kit.fmt(100 * R.rel, 2) + ' %', sx, top + 100, { size: fs + 1, weight: 700, color: R.rel > 0.05 ? C.bad : C.ok });
          kit.label(c, '= ' + kit.fmt(R.C2 / 10, 3) + ' % w/v', sx, top + 120, { size: fs, color: C.muted });
        }
        if (clock >= TOT + 0.5) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      restart();
    }
  });

  /* ================================================================ calc-serial */
  Hyper.sim('calc-serial', {
    title: 'Serial dilution: a rack of tubes',
    blurb: `A pipette carries a fixed volume from each tube into the next, which already holds diluent, so every step divides the concentration by the same factor and the colour fades step by step. Each transfer and each volume of diluent carries a small random pipetting error; the graph collects the error of every run, so you can watch it spread as the steps add up.

**Try this**
- Run four 1 in 10 steps from 10 mg/mL: you reach 1 µg/mL. Compare with the single-step readout — how small a volume would one step need?
- Press *Repeat 20 times*: the errors fan out roughly as the square root of the number of steps (the dashed lines are ±2 standard deviations).
- Switch to 1 in 2 steps and then to 1 in 100: which spreads faster per step, and why? (Hint: in a 1 in 2 step each measured volume is only half the total, so each error moves the concentration half as much.)
- Set the pipetting error to zero: every run lands exactly on the nominal line.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'C0', label: 'Stock concentration', min: 1, max: 1000, value: 10, unit: 'mg/mL', log: true, sig: 2 },
        { id: 'f', type: 'select', label: 'Dilution per step', options: [['1 in 2', 2], ['1 in 5', 5], ['1 in 10', 10], ['1 in 100', 100]], value: 10 },
        { id: 'n', label: 'Number of steps', min: 1, max: 8, step: 1, value: 4 },
        { id: 'vt', label: 'Volume carried each step', min: 0.5, max: 5, step: 0.5, value: 1, unit: 'mL' },
        { id: 'sd', label: 'Pipetting error (1 SD)', min: 0, max: 5, step: 0.25, value: 1, unit: '%' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run again', primary: true }, { id: 'many', label: 'Repeat 20 times' }, { id: 'clear', label: 'Clear the runs' }] }
      ], (id) => {
        if (id === 'many') { for (let i = 0; i < 20; i++) runs.push(simulate()); trim(); }
        else if (id === 'clear') runs = [];
        else { if (id !== 'run' && id !== 'C0') runs = []; runs.push(simulate()); trim(); }
        clock = 0; update(); loop.start();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['fin', 'Final concentration (nominal)'], ['all', 'Overall dilution'], ['run', 'This run'], ['spread', 'Expected spread (±2 SD)'], ['one', 'In a single step (to 10 mL)']]);
      const plot = kit.plot(gb, { x: { label: 'step', min: 0, max: 8 }, y: { label: 'error in concentration (%)' }, legend: true }, 180);
      let runs = [], seed = 11, clock = 0;
      const trim = () => { if (runs.length > 40) runs = runs.slice(runs.length - 40); };
      function simulate() {
        const rng = kit.bio.rng(seed++), n = Math.round(V.n), f = V.f, vt = V.vt, vd = vt * (f - 1), s = V.sd / 100;
        const z = () => { const u = Math.max(1e-12, rng()), w = rng(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * w); };
        const out = [V.C0]; let cc = V.C0;
        for (let k = 1; k <= n; k++) {
          const a = vt * Math.max(0.5, 1 + s * z()), b = vd * Math.max(0.5, 1 + s * z());
          cc = cc * a / (a + b); out.push(cc);
        }
        return { n, f, C0: V.C0, c: out };
      }
      const perStep = () => Math.SQRT2 * (V.sd / 100) * (V.f - 1) / V.f;          // relative SD of one step
      function update() {
        const n = Math.round(V.n), f = V.f, fin = V.C0 / Math.pow(f, n);
        const last = runs[runs.length - 1];
        ro.set('fin', fmtConc(kit, fin));
        ro.set('all', '1 in ' + big(kit, Math.pow(f, n)) + ' (' + n + ' × 1 in ' + f + ')');
        if (last && last.n === n && last.f === f) {
          const dev = (last.c[n] / (last.C0 / Math.pow(f, n)) - 1) * 100;
          ro.set('run', fmtConc(kit, last.c[n]) + ' (' + (dev >= 0 ? '+' : '') + kit.fmt(dev, 2) + ' %)');
        } else ro.set('run', '—');
        ro.set('spread', '±' + kit.fmt(200 * perStep() * Math.sqrt(n), 2) + ' % after ' + n + ' steps');
        const v1 = 10 / Math.pow(f, n);
        ro.set('one', kit.fmt(v1, 3) + ' mL of stock in 10 mL' + (v1 < 0.05 ? ' — far too small to measure' : v1 < 0.5 ? ' — hard to measure well' : ''));
        const series = [], ps = perStep(), C = kit.colors();
        series.push({ pts: Array.from({ length: n + 1 }, (_, k) => [k, 200 * ps * Math.sqrt(k)]), label: '±2 SD', dash: [5, 4], color: C.muted });
        series.push({ pts: Array.from({ length: n + 1 }, (_, k) => [k, -200 * ps * Math.sqrt(k)]), dash: [5, 4], color: C.muted });
        runs.filter(r => r.n === n && r.f === f).forEach((r, i, arr) => {
          series.push({ pts: r.c.map((x, k) => [k, (x / (r.C0 / Math.pow(f, k)) - 1) * 100]), label: i === arr.length - 1 ? 'runs' : undefined, dots: i === arr.length - 1 ? 3.5 : 2, width: i === arr.length - 1 ? 1.8 : 0.6, color: kit.hue(325, i === arr.length - 1 ? 1 : 0.4) });
        });
        const lim = Math.max(1, 300 * ps * Math.sqrt(n));
        plot.set({ series, x: { label: 'step', min: 0, max: n }, y: { label: 'error in concentration (%)', min: -lim, max: lim }, hlines: [{ y: 0, label: 'nominal' }] });
      }
      const STEP = 1.3;
      const loop = kit.loop((dt) => {
        const last = runs[runs.length - 1], n = last ? last.n : Math.round(V.n), f = last ? last.f : V.f;
        clock = Math.min(n * STEP + 0.4, clock + dt);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const k = Math.floor(clock / STEP), s = (clock - k * STEP) / STEP;
        const gap = W / (n + 2), tw = Math.min(40, gap * 0.55), top = Math.max(Hh * 0.3, 78), th = Hh * 0.42;
        const xOf = i => gap * (i + 1) - tw / 2;
        const c0 = last ? last.C0 : V.C0, cEnd = c0 / Math.pow(f, n) / 3;
        const tint = cc => clamp(0.1 + 0.8 * Math.log(Math.max(cc, cEnd) / cEnd) / Math.log(c0 / cEnd), 0.06, 0.9);
        for (let i = 0; i <= n; i++) {
          const x = xOf(i), done = i === 0 || i < k || (i === k && s > 0.75) || clock >= n * STEP;
          const conc = last ? last.c[Math.min(i, last.c.length - 1)] : V.C0 / Math.pow(f, i);
          // the liquid: diluent, tinted once the transfer has arrived (colour on a log scale from the stock to the last tube)
          c.beginPath(); c.moveTo(x + 1, top + th * 0.3); c.lineTo(x + 1, top + th - tw / 2); c.arc(x + tw / 2, top + th - tw / 2, tw / 2 - 1, Math.PI, 0, true); c.lineTo(x + tw - 1, top + th * 0.3); c.closePath();
          c.fillStyle = WATER(kit); c.fill();
          if (done) { c.fillStyle = kit.hue(325, tint(conc)); c.fill(); }
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x, top); c.lineTo(x, top + th - tw / 2); c.arc(x + tw / 2, top + th - tw / 2, tw / 2, Math.PI, 0, true); c.lineTo(x + tw, top); c.stroke();
          kit.label(c, i === 0 ? 'stock' : '1 in ' + big(kit, Math.pow(f, i)), x + tw / 2, top + th + 14, { align: 'center', size: 10.5, color: C.muted });
          kit.label(c, fmtConc(kit, V.C0 / Math.pow(f, i)), x + tw / 2, top + th + 29, { align: 'center', size: 10.5, weight: 700 });
        }
        // the pipette, carrying from tube k to tube k + 1
        if (clock < n * STEP) {
          const from = xOf(k) + tw / 2, to = xOf(k + 1) + tw / 2;
          const px = s < 0.3 ? from : s < 0.6 ? lerp(from, to, ease((s - 0.3) / 0.3)) : to;
          const dip = s < 0.15 ? ease(s / 0.15) : s < 0.3 ? 1 - ease((s - 0.15) / 0.15) : s < 0.6 ? 0 : s < 0.72 ? ease((s - 0.6) / 0.12) : 1 - ease((s - 0.72) / 0.28);
          const py = top - 22 + dip * th * 0.45, carrying = s > 0.12 && s < 0.7;
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(px - 5, py - 40, 10, 40);
          c.beginPath(); c.moveTo(px - 5, py); c.lineTo(px, py + 12); c.lineTo(px + 5, py); c.stroke();
          if (carrying) { const conc = last ? last.c[k] : V.C0 / Math.pow(f, k); c.fillStyle = kit.hue(325, tint(conc)); c.fillRect(px - 4, py - 16, 8, 16); }
          c.fillStyle = C.muted; c.beginPath(); c.ellipse(px, py - 46, 9, 7, 0, 0, Math.PI * 2); c.fill();
          kit.label(c, kit.fmt(V.vt, 2) + ' mL + ' + kit.fmt(V.vt * (f - 1), 3) + ' mL diluent', W / 2, Hh - 12, { align: 'center', size: 12, weight: 700, color: C.accent });
        } else kit.label(c, n + ' steps of 1 in ' + f + ': overall 1 in ' + big(kit, Math.pow(f, n)), W / 2, Hh - 12, { align: 'center', size: 12, weight: 700, color: C.accent });
        if (clock >= n * STEP + 0.4) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      runs.push(simulate()); update(); loop.start();
    }
  });

  /* ================================================================ calc-alligation */
  Hyper.sim('calc-alligation', {
    title: 'The alligation see-saw',
    blurb: `Alligation drawn as a lever. The beam is a scale of strength; the two preparations hang at their strengths, as weights proportional to how much of each is in your mix; the fulcrum sits at the strength you want. The beam balances exactly when the mix has the wanted strength — when $m_H(H - W) = m_L(W - L)$ — and the grid below does the same sum by crossing the differences.

**Try this**
- With 2.5 % and 0.5 % ointments and 1 % wanted, move *Your mix* until the beam balances. Then press *Solve by alligation*: 25 g and 75 g.
- Drag the fulcrum towards the stronger preparation: you need more of it — the lever arms swap sides in the grid.
- Set the weaker strength to 0 (a plain base) and the stronger to 100 % (pure drug): the same see-saw adds pure drug to a base.
- Put the wanted strength outside the two: no mix can balance.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 330 });
      const ctl = kit.controls(box.side, [
        { id: 'H', label: 'Stronger preparation H', min: 0.5, max: 100, step: 0.5, value: 2.5, unit: '%' },
        { id: 'L', label: 'Weaker preparation L (0 = base)', min: 0, max: 50, step: 0.1, value: 0.5, unit: '%' },
        { id: 'W', label: 'Strength wanted W (or drag the fulcrum)', min: 0, max: 100, step: 0.05, value: 1, unit: '%' },
        { id: 'T', label: 'Total to make', min: 10, max: 500, step: 10, value: 100, unit: 'g' },
        { id: 'mH', label: 'Your mix: grams of the stronger', min: 0, max: 500, step: 0.5, value: 50, unit: 'g' },
        { type: 'buttons', items: [{ id: 'solve', label: 'Solve by alligation', primary: true }] }
      ], (id) => {
        if (id === 'solve') solve(); else if (id !== 'mH') anim = null;
        if (V.mH > V.T) ctl.set('mH', V.T);
        update(); loop.start();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['parts', 'Parts, stronger : weaker'], ['amt', 'Alligation says'], ['mix', 'Your mix gives'], ['bal', 'The beam']]);
      let theta = 0, anim = null, S = null, idle = 0;
      const valid = () => V.H > V.L && V.W > V.L && V.W < V.H;
      function solve() { if (!valid()) return; anim = { to: V.T * (V.W - V.L) / (V.H - V.L) }; }
      function scale() {
        const lo = Math.min(V.L, V.W), hi = Math.max(V.H, V.W), span = Math.max(hi - lo, 0.5);
        return { sMin: Math.max(0, lo - 0.14 * span), sMax: hi + 0.14 * span };
      }
      function update() {
        const T = V.T, mH = clamp(V.mH, 0, T), mL = T - mH, H = V.H, L = V.L, Wt = V.W;
        const mix = (mH * H + mL * L) / T;
        S = Object.assign(scale(), { T, mH, mL, H, L, Wt, mix, ok: valid() });
        if (!(H > L)) { ro.set('parts', '—'); ro.set('amt', 'the stronger must be stronger than the weaker'); }
        else if (!S.ok) { ro.set('parts', '—'); ro.set('amt', 'no mix of ' + kit.fmt(L, 3) + ' % and ' + kit.fmt(H, 3) + ' % makes ' + kit.fmt(Wt, 3) + ' %'); }
        else {
          const ph = Wt - L, pl = H - Wt, gH = T * ph / (ph + pl);
          ro.set('parts', kit.fmt(ph, 3) + ' : ' + kit.fmt(pl, 3) + ' (1 : ' + kit.fmt(pl / ph, 3) + ')');
          ro.set('amt', kit.fmt(gH, 4) + ' g of ' + kit.fmt(H, 3) + ' % + ' + kit.fmt(T - gH, 4) + ' g of ' + kit.fmt(L, 3) + ' %');
        }
        ro.set('mix', kit.fmt(mH, 4) + ' g + ' + kit.fmt(mL, 4) + ' g → ' + kit.fmt(mix, 4) + ' %');
        const off = mix - Wt, tol = 0.002 * Math.max(H - L, 0.5);
        ro.set('bal', !S.ok ? '—' : Math.abs(off) <= tol ? 'balanced: the mix is ' + kit.fmt(Wt, 3) + ' %' : off > 0 ? 'tips to the stronger side: the mix is too strong' : 'tips to the weaker side: the mix is too weak');
      }
      kit.drag(st, {
        hit: p => S && S.ok && Math.abs(p.x - S.px) < 20 && p.y > S.py - 8 && p.y < S.py + 40 ? 'W' : null,
        move: (_, p) => {
          const s = S.sMin + (p.x - S.x0) / Math.max(1, S.x1 - S.x0) * (S.sMax - S.sMin), gap = 0.01 * (V.H - V.L);
          ctl.set('W', Math.round(clamp(s, V.L + gap, V.H - gap) * 100) / 100); anim = null; update(); loop.start();
        },
        hover: true
      });
      const loop = kit.loop((dt) => {
        if (!S) update();
        // the solve animation walks the slider to the answer
        if (anim) {
          const cur = V.mH, nx = cur + (anim.to - cur) * (1 - Math.exp(-dt / 0.15));
          if (Math.abs(nx - anim.to) < 0.01) { ctl.set('mH', anim.to); anim = null; } else ctl.set('mH', nx);
          update();
        }
        // torque about the fulcrum, normalised; the beam relaxes towards its tilt in fixed sub-steps
        const tq = S.ok ? (S.mH * (S.H - S.Wt) - S.mL * (S.Wt - S.L)) / (S.T * Math.max(S.H - S.L, 1e-6)) : 0;
        const target = clamp(1.4 * tq, -0.14, 0.14);
        for (let i = 0; i < 4; i++) theta += (target - theta) * (1 - Math.exp(-(dt / 4) / 0.2));
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const x0 = W * 0.08, x1 = W * 0.92, k = (x1 - x0) / (S.sMax - S.sMin), pivY = Math.max(Hh * 0.42, 150), ground = pivY + 40;
        const pivX = x0 + (clamp(S.Wt, S.sMin, S.sMax) - S.sMin) * k;
        S.x0 = x0; S.x1 = x1; S.px = pivX; S.py = pivY;
        const P = s => [pivX + Math.cos(theta) * (s - S.Wt) * k, pivY + Math.sin(theta) * (s - S.Wt) * k];
        // ground and fulcrum
        c.fillStyle = C.faint; c.fillRect(pivX - 34, ground, 68, 4);
        c.fillStyle = S.ok ? C.accent : C.bad; c.beginPath(); c.moveTo(pivX, pivY + 3); c.lineTo(pivX - 15, ground); c.lineTo(pivX + 15, ground); c.closePath(); c.fill();
        kit.label(c, 'W = ' + kit.fmt(S.Wt, 3) + ' % (drag me)', pivX, ground + 14, { align: 'center', size: 12, weight: 700, color: S.ok ? C.accent : C.bad });
        // the beam with its strength scale (numbers under it)
        const a = P(S.sMin), b = P(S.sMax);
        c.strokeStyle = C.text; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke(); c.lineCap = 'butt';
        const step = Hyper.niceStep(S.sMax - S.sMin, 6);
        for (let s = Math.ceil(S.sMin / step) * step; s <= S.sMax + 1e-9; s += step) {
          const q = P(s); c.strokeStyle = C.bg2; c.lineWidth = 1.5; c.beginPath(); c.moveTo(q[0], q[1] - 2.5); c.lineTo(q[0], q[1] + 2.5); c.stroke();
          if (Math.abs(q[0] - pivX) > 22) kit.label(c, kit.fmt(s, 3) + ' %', q[0], q[1] + 20, { align: 'center', size: 10, color: C.muted });
        }
        // lever arms, just under the beam
        if (S.ok) {
          const pw = P(S.Wt), ph = P(S.H), pl = P(S.L);
          c.lineWidth = 3; c.strokeStyle = kit.hue(20, 0.8); c.beginPath(); c.moveTo(pw[0], pw[1] + 7); c.lineTo(ph[0], ph[1] + 7); c.stroke();
          c.strokeStyle = kit.hue(210, 0.8); c.beginPath(); c.moveTo(pw[0], pw[1] + 7); c.lineTo(pl[0], pl[1] + 7); c.stroke();
        }
        // the two weights, sitting on the beam at their strengths
        const load = (s, m, col, name) => {
          const q = P(s), side = 14 + 42 * Math.sqrt(clamp(m / S.T, 0, 1));
          c.save(); c.translate(q[0], q[1]); c.rotate(theta);
          c.fillStyle = col; c.fillRect(-side / 2, -side - 3, side, side); c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(-side / 2, -side - 3, side, side);
          c.restore();
          kit.label(c, kit.fmt(m, 3) + ' g', q[0], q[1] - side - 14, { align: 'center', size: 11.5, weight: 700 });
          kit.label(c, name + ' ' + kit.fmt(s, 3) + ' %', q[0], q[1] - side - 28, { align: 'center', size: 10.5, color: C.muted });
        };
        if (S.H > S.L) { load(S.L, S.mL, kit.hue(325, drugAlpha(Math.max(S.L, 0.01) * 10) * 0.8 + 0.1), 'weaker'); load(S.H, S.mH, kit.hue(325, drugAlpha(S.H * 10)), 'stronger'); }
        // where your mix lies on the scale
        const pm = P(clamp(S.mix, S.sMin, S.sMax));
        c.fillStyle = C.warn; c.beginPath(); c.moveTo(pm[0], pm[1] - 4); c.lineTo(pm[0] - 6, pm[1] - 14); c.lineTo(pm[0] + 6, pm[1] - 14); c.closePath(); c.fill();
        kit.label(c, 'your mix ' + kit.fmt(S.mix, 3) + ' %', pm[0], pm[1] - 26, { align: 'center', size: 11.5, weight: 700, color: C.warn, bg: C.bg2 });
        // the alligation grid
        const gx = W * 0.1, gy = Hh * 0.72, gw = Math.min(260, W * 0.4), gh = Hh * 0.22;
        const cell = (t, x, y, col, size, w8) => kit.label(c, t, x, y, { align: 'center', size: size || 13, color: col || C.text, weight: w8 || 500 });
        c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath();
        c.moveTo(gx + 36, gy + 8); c.lineTo(gx + gw - 36, gy + gh - 8); c.moveTo(gx + 36, gy + gh - 8); c.lineTo(gx + gw - 36, gy + 8); c.stroke();
        cell('H ' + kit.fmt(S.H, 3) + ' %', gx, gy, C.text, 12.5, 700); cell('L ' + kit.fmt(S.L, 3) + ' %', gx, gy + gh, C.text, 12.5, 700);
        kit.label(c, kit.fmt(S.Wt, 3) + ' %', gx + gw / 2, gy + gh / 2, { align: 'center', size: 14, weight: 700, color: C.accent, bg: C.bg2 });
        cell(S.ok ? kit.fmt(S.Wt - S.L, 3) + ' parts' : '—', gx + gw, gy, kit.hue(210, 1), 12.5, 700);
        cell(S.ok ? kit.fmt(S.H - S.Wt, 3) + ' parts' : '—', gx + gw, gy + gh, kit.hue(20, 1), 12.5, 700);
        cell('W − L', gx + gw, gy + 16, C.muted, 10.5); cell('H − W', gx + gw, gy + gh + 16, C.muted, 10.5);
        const tx = gx + gw + 70;
        if (tx < W - 120) {
          kit.label(c, 'balance: stronger × (H − W) = weaker × (W − L)', tx, gy, { size: 12, weight: 700 });
          kit.label(c, kit.fmt(S.mH, 3) + ' g × ' + kit.fmt(S.H - S.Wt, 3) + ' = ' + kit.fmt(S.mH * (S.H - S.Wt), 4), tx, gy + 22, { size: 12, color: kit.hue(20, 1) });
          kit.label(c, kit.fmt(S.mL, 3) + ' g × ' + kit.fmt(S.Wt - S.L, 3) + ' = ' + kit.fmt(S.mL * (S.Wt - S.L), 4), tx, gy + 42, { size: 12, color: kit.hue(210, 1) });
          if (!S.ok) kit.label(c, S.H > S.L ? 'W must lie between L and H' : 'H must be above L', tx, gy + 68, { size: 12, weight: 700, color: C.bad });
        }
        idle = Math.abs(target - theta) < 1e-4 && !anim ? idle + dt : 0;
        if (idle > 0.5) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      update(); loop.start();
    }
  });

  /* ================================================================ calc-isotonic */
  Hyper.sim('calc-isotonic', {
    title: 'Red cells in eye drops',
    blurb: `Eye drops of a hypothetical drug, and red blood cells seen under a microscope in the finished solution. Each gram of drug counts as $E$ grams of sodium chloride; an isotonic solution needs 0.009 g of NaCl-equivalent per mL. Below isotonic the cells take up water and swell into spheres, and below about 0.45 % NaCl-equivalent they begin to burst (haemolysis) — each cell at its own threshold, and a burst cell stays burst. Above isotonic they lose water and crenate.

**Try this**
- The drops start with too little salt (0.05 g): the cells swell into spheres. Press *Add the calculated NaCl* — 0.15 g in all for 30 mL — and they return to normal discs.
- Press *No salt*: the drug alone is only 0.4 % NaCl-equivalent, and the most fragile cells burst.
- Raise the drug strength until the solution is hypertonic without any salt: the calculator says none is needed, and the cells shrink.
- Tick *The drug crosses cell membranes*: the solution is still iso-osmotic, but the cells swell and burst — iso-osmotic is not isotonic.
- Once cells have burst, adding salt cannot mend them: press *Fresh red cells*.`,
    mount(box, kit) {
      const P = kit.pharma;
      const st = kit.stage(box.stage, { aspect: 0.54, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Final volume', min: 10, max: 100, step: 5, value: 30, unit: 'mL' },
        { id: 'pct', label: 'Drug strength', min: 0, max: 10, step: 0.1, value: 2, unit: '% w/v' },
        { id: 'E', label: 'NaCl equivalent E of the drug', min: 0.05, max: 1, step: 0.01, value: 0.2 },
        { id: 'nacl', label: 'Sodium chloride added', min: 0, max: 1.5, step: 0.005, value: 0.05, unit: 'g' },
        { id: 'perm', type: 'check', label: 'The drug crosses cell membranes (as boric acid or urea do)', value: false },
        { type: 'buttons', items: [{ id: 'add', label: 'Add the calculated NaCl', primary: true }, { id: 'none', label: 'No salt' }, { id: 'fresh', label: 'Fresh red cells' }] }
      ], (id) => {
        if (id === 'add') ctl.set('nacl', Math.min(1.5, Math.max(0, calc().need)));
        if (id === 'none') ctl.set('nacl', 0);
        if (id === 'fresh') makeCells();
        report(); loop.start();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eq', 'Drug as NaCl-equivalent'], ['need', 'NaCl for an isotonic solution'], ['wv', 'White–Vincent volume'], ['ton', 'Tonicity (effective)'], ['osm', 'Osmolality (all solutes)'], ['cells', 'Red cells']]);
      let cells = [], seed = 5, idle = 0, tt = 0;
      function makeCells() {
        const rng = kit.bio.rng(seed++);
        cells = Array.from({ length: 18 }, (_, i) => ({ a: (i * 2.39996) % (2 * Math.PI), r: Math.sqrt((i + 0.5) / 18) * 0.78, ph: rng() * 6.28, thr: 0.3 + 0.16 * rng(), v: 1, lysed: false, tilt: rng() * 3.14 }));
      }
      function calc() {
        const w = V.pct / 100 * V.V, eq = w * V.E, need = P.naclToAdd({ volume: V.V, drugs: [[w, V.E]] });
        const all = (V.nacl + eq) / V.V * 100, eff = (V.nacl + (V.perm ? 0 : eq)) / V.V * 100;
        return { w, eq, need, all, eff };
      }
      const osm = pct => pct / 0.9 * 290;
      function report() {
        const k = calc();
        ro.set('eq', kit.fmt(k.w, 3) + ' g × ' + kit.fmt(V.E, 2) + ' = ' + kit.fmt(k.eq, 3) + ' g');
        ro.set('need', k.need >= 0 ? kit.fmt(k.need, 3) + ' g  (0.009 × ' + kit.fmt(V.V, 3) + ' − ' + kit.fmt(k.eq, 3) + ')' : 'none: already hypertonic by ' + kit.fmt(-k.need, 3) + ' g of NaCl-equivalent');
        ro.set('wv', kit.fmt(k.w * V.E * 111.1, 3) + ' mL of water makes the drug isotonic');
        ro.set('ton', kit.fmt(k.eff, 3) + ' % NaCl-eq. ≈ ' + kit.fmt(osm(k.eff), 3) + ' mOsm/kg — ' + (k.eff < 0.45 ? 'haemolytic' : k.eff < 0.8 ? 'hypotonic' : k.eff <= 1.0 ? 'about isotonic' : k.eff <= 2 ? 'hypertonic, tolerable in the eye' : 'strongly hypertonic'));
        ro.set('osm', kit.fmt(k.all, 3) + ' % NaCl-eq. ≈ ' + kit.fmt(osm(k.all), 3) + ' mOsm/kg' + (V.perm && Math.abs(k.all - k.eff) > 1e-9 ? ' (the drug counts here, not in tonicity)' : ''));
      }
      makeCells();
      const loop = kit.loop((dt) => {
        tt += dt;
        const k = calc(), b = 0.4, target = clamp(b + (1 - b) * 0.9 / Math.max(k.eff, 0.02), 0.5, 2.2);
        let moving = false, lysed = 0;
        for (const cl of cells) {
          if (cl.lysed) { lysed++; continue; }
          for (let i = 0; i < 4; i++) cl.v += (target - cl.v) * (1 - Math.exp(-(dt / 4) / 0.45));
          if (Math.abs(target - cl.v) > 1e-3) moving = true;
          if (k.eff < cl.thr && cl.v > 0.97 * target) { cl.lysed = true; lysed++; }
        }
        ro.set('cells', lysed ? lysed + ' of ' + cells.length + ' burst (haemolysis)' : target > 1.08 ? 'swelling (water flows in)' : target < 0.93 ? 'shrinking and crenated (water flows out)' : 'normal biconcave discs');
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // the dropper bottle
        const bx = W * 0.07, bw = Math.min(70, W * 0.11), bh = Hh * 0.42, by = Hh * 0.14;
        c.fillStyle = kit.hue(200, 0.12 + 0.06 * clamp(k.all / 2, 0, 1)); c.fillRect(bx, by + bh * 0.25, bw, bh * 0.75);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(bx, by + bh * 0.12, bw, bh * 0.88);
        c.beginPath(); c.moveTo(bx + bw * 0.3, by + bh * 0.12); c.lineTo(bx + bw * 0.42, by - 12); c.lineTo(bx + bw * 0.58, by - 12); c.lineTo(bx + bw * 0.7, by + bh * 0.12); c.stroke();
        kit.label(c, kit.fmt(V.V, 3) + ' mL', bx + bw / 2, by + bh + 16, { align: 'center', size: 12, weight: 700 });
        kit.label(c, 'drug ' + kit.fmt(k.w, 3) + ' g', bx + bw / 2, by + bh + 31, { align: 'center', size: 11, color: C.muted });
        kit.label(c, 'NaCl ' + kit.fmt(V.nacl, 3) + ' g', bx + bw / 2, by + bh + 45, { align: 'center', size: 11, color: C.muted });
        // the microscope field
        const cx = W * 0.56, cy = Hh * 0.38, R = Math.min(W * 0.24, Hh * 0.32);
        c.save(); c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.clip();
        c.fillStyle = C.surface || C.bg2; c.fillRect(cx - R, cy - R, 2 * R, 2 * R);
        if (lysed) { c.fillStyle = 'hsl(0 70% 50% / ' + (0.3 * lysed / cells.length) + ')'; c.fillRect(cx - R, cy - R, 2 * R, 2 * R); }
        const r0 = R * 0.12;
        for (const cl of cells) {
          const x = cx + R * cl.r * Math.cos(cl.a) + 3 * Math.sin(tt * 0.4 + cl.ph), y = cy + R * cl.r * Math.sin(cl.a) + 3 * Math.cos(tt * 0.33 + cl.ph);
          if (cl.lysed) { c.strokeStyle = 'hsl(0 50% 60% / .45)'; c.lineWidth = 1.2; c.setLineDash([3, 3]); c.beginPath(); c.arc(x, y, r0 * 1.15, 0, Math.PI * 2); c.stroke(); c.setLineDash([]); continue; }
          const r = r0 * Math.cbrt(cl.v), cren = clamp((0.95 - cl.v) / 0.35, 0, 1), sph = clamp((cl.v - 1.02) / 0.45, 0, 1);
          c.beginPath();
          for (let i = 0; i <= 72; i++) {
            const th = i / 72 * Math.PI * 2, bump = cren * 0.22 * Math.pow(Math.max(0, Math.cos(12 * th + cl.tilt)), 3);
            const rr = r * (1 - 0.12 * cren + bump);
            if (i) c.lineTo(x + rr * Math.cos(th), y + rr * Math.sin(th)); else c.moveTo(x + rr * Math.cos(th), y + rr * Math.sin(th));
          }
          c.closePath(); c.fillStyle = 'hsl(0 68% ' + (C.dark ? 48 : 52) + '%)'; c.fill();
          const pal = 0.45 * (1 - sph) * (1 - 0.5 * cren);
          if (pal > 0.02) { c.fillStyle = 'hsl(0 60% ' + (C.dark ? 66 : 76) + '% / .8)'; c.beginPath(); c.arc(x, y, r * pal, 0, Math.PI * 2); c.fill(); }
        }
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.stroke();
        kit.label(c, 'red cells in the drops (schematic)', cx, cy + R + 14, { align: 'center', size: 11.5, color: C.muted });
        const wide = cx + R + 190 < W, lx = wide ? cx + R + 14 : cx, ly = wide ? cy - 10 : cy - R + 14, la = wide ? 'left' : 'center';
        kit.label(c, 'cell volume ' + kit.fmt(target * 100, 3) + ' % of normal', lx, ly, { align: la, size: 12, weight: 700, color: target > 1.08 || target < 0.93 ? C.warn : C.ok, bg: wide ? undefined : C.bg2 });
        if (lysed) kit.label(c, lysed + ' burst', lx, ly + 20, { align: la, size: 12, weight: 700, color: C.bad, bg: wide ? undefined : C.bg2 });
        // the tonicity bar
        const x0 = W * 0.07, x1 = W * 0.93, yb = Hh * 0.86, X = p => x0 + (x1 - x0) * clamp(p / 3, 0, 1);
        const band = (a, b2, col) => { c.fillStyle = col; c.fillRect(X(a), yb - 8, X(b2) - X(a), 16); };
        band(0, 0.45, kit.hue(0, 0.35)); band(0.45, 0.6, kit.hue(40, 0.3)); band(0.6, 2, kit.hue(140, 0.25)); band(2, 3, kit.hue(40, 0.3));
        [0, 0.45, 0.9, 2, 3].forEach(p => kit.label(c, p + ' %', X(p), yb + 18, { align: 'center', size: 10, color: C.muted }));
        kit.label(c, 'NaCl-equivalent: haemolysis · hypotonic · tolerated by the eye (0.6–2 %) · hypertonic', (x0 + x1) / 2, yb - 32, { align: 'center', size: 10.5, color: C.muted });
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(0.9), yb - 11); c.lineTo(X(0.9), yb + 11); c.stroke();
        const mark = (p, col) => { c.fillStyle = col; c.beginPath(); c.moveTo(X(p), yb - 9); c.lineTo(X(p) - 6, yb - 19); c.lineTo(X(p) + 6, yb - 19); c.closePath(); c.fill(); };
        if (V.perm && Math.abs(k.all - k.eff) > 1e-6) mark(k.all, C.muted);
        mark(k.eff, C.accent);
        idle = moving ? 0 : idle + dt;
        if (idle > 1.5) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      report(); loop.start();
    }
  });

  /* ================================================================ calc-paeds */
  // typical (approximate median, sexes pooled) weight and height by age, for illustration only
  const AGE = [0, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
  const WT = [3.5, 6.0, 7.8, 9.8, 12.3, 14.3, 16.3, 18.3, 20.6, 23.0, 25.6, 28.5, 31.9, 35.6, 39.9, 45.0, 50.1, 54.6, 58.2, 60.8, 62.6];
  const HT = [50, 61, 67, 75, 87, 95, 102, 109, 115, 122, 128, 133, 139, 144, 150, 156, 162, 167, 170, 172, 173];
  const interp = (xs, ys, x) => {
    if (x <= xs[0]) return ys[0];
    for (let i = 1; i < xs.length; i++) if (x <= xs[i]) return ys[i - 1] + (ys[i] - ys[i - 1]) * (x - xs[i - 1]) / (xs[i] - xs[i - 1]);
    return ys[ys.length - 1];
  };
  Hyper.sim('calc-paeds', {
    title: 'One hypothetical drug, many ages',
    blurb: `A hypothetical drug with an adult reference dose (for 70 kg, 175 cm, 1.84 m²) scaled to a child in four ways: in proportion to **weight** (mg/kg), to **body-surface area** (Mosteller), **allometrically** as $(W/70)^{0.75}$ — the way clearance tends to scale with size — and, for a drug cleared by the kidneys, allometrically **with maturation** of kidney function in infancy (a published model with half-maturity at about 48 weeks after conception). Weights and heights are typical values, for illustration. This is a picture of the arithmetic, not a dosing tool: real paediatric doses come from paediatric studies and formularies.

**Try this**
- Compare a 1-year-old by weight and by surface area: the surface-area dose is almost twice the weight-based one.
- Look at the second graph: per kilogram, surface-area and allometric doses are highest in toddlers, while maturation pulls the newborn's dose down again.
- Make the child heavier than typical (150 %): the weight-based dose climbs fastest, and the cap at the adult dose starts to matter.
- Young's rule (age ÷ (age + 12)) is shown for history: see how far it drifts from the others.`,
    mount(box, kit) {
      const M = kit.med;
      const st = kit.stage(box.stage, { aspect: 0.38, minH: 240 });
      const gb = document.createElement('div'); gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:10px'; box.stage.appendChild(gb);
      const g1 = document.createElement('div'), g2 = document.createElement('div'); gb.appendChild(g1); gb.appendChild(g2);
      const ctl = kit.controls(box.side, [
        { id: 'age', label: 'Age', min: 0, max: 18, step: 0.25, value: 5, unit: 'years' },
        { id: 'wp', label: 'Weight compared with typical', min: 50, max: 200, step: 5, value: 100, unit: '%' },
        { id: 'A', label: 'Adult reference dose', min: 50, max: 1000, step: 10, value: 500, unit: 'mg' },
        { id: 'cap', type: 'check', label: 'Cap at the adult dose', value: true },
        { id: 'mat', type: 'check', label: 'Show kidney maturation (renally cleared drug)', value: true }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['wt', 'Weight · height'], ['bsa', 'Body-surface area'], ['dW', 'By weight'], ['dB', 'By surface area'], ['dA', 'Allometric (W/70)^0.75'], ['dM', 'With maturation'], ['dY', 'Young\'s rule (history)']]);
      const pD = kit.plot(g1, { x: { label: 'age (years)', min: 0, max: 18 }, y: { label: 'dose (mg)', min: 0 }, legend: true }, 200);
      const pK = kit.plot(g2, { x: { label: 'age (years)', min: 0, max: 18 }, y: { label: 'dose per kg (mg/kg)', min: 0 }, legend: true }, 200);
      const BSA70 = M.bsa(70, 175);
      const mf = age => { const pma = 40 + age * 52.18; return Math.pow(pma, 3.4) / (Math.pow(47.7, 3.4) + Math.pow(pma, 3.4)); };
      const MF_ADULT = mf(30);
      function doses(age) {
        const W = interp(AGE, WT, age) * V.wp / 100, h = interp(AGE, HT, age), A = V.A, bsa = M.bsa(W, h);
        const cap = x => V.cap ? Math.min(x, A) : x;
        return { W, h, bsa, w: cap(A * W / 70), b: cap(A * bsa / BSA70), a: cap(A * Math.pow(W / 70, 0.75)), m: cap(A * Math.pow(W / 70, 0.75) * mf(age) / MF_ADULT), y: age >= 1 ? cap(A * age / (age + 12)) : NaN };
      }
      const COL = { w: kit.hue(210, 1), b: kit.hue(30, 1), a: kit.hue(140, 1), m: kit.hue(290, 1), y: kit.hue(0, 0.8) };
      let now = null;
      function draw() {
        now = doses(V.age);
        const ages = Array.from({ length: 145 }, (_, i) => i / 8), rows = ages.map(doses);
        const ser = (key, label, dash) => ({ pts: rows.map((r, i) => [ages[i], r[key]]).filter(p => Number.isFinite(p[1])), label, dash, color: COL[key] });
        const perKg = (key, label, dash) => ({ pts: rows.map((r, i) => [ages[i], r[key] / r.W]).filter(p => Number.isFinite(p[1])), label, dash, color: COL[key] });
        const S1 = [ser('w', 'by weight'), ser('b', 'by surface area'), ser('a', 'allometric')], S2 = [perKg('w', 'by weight'), perKg('b', 'by surface area'), perKg('a', 'allometric')];
        if (V.mat) { S1.push(ser('m', 'with maturation')); S2.push(perKg('m', 'with maturation')); }
        S1.push(ser('y', 'Young\'s rule', [4, 3]));
        pD.set({ series: S1, vlines: [{ x: V.age, label: 'age ' + kit.fmt(V.age, 3) }], hlines: [{ y: V.A, label: 'adult dose' }] });
        pK.set({ series: S2, vlines: [{ x: V.age }], hlines: [{ y: V.A / 70, label: 'adult mg/kg' }] });
        const f = x => Number.isFinite(x) ? kit.fmt(x, 3) + ' mg (' + kit.fmt(x / now.W, 3) + ' mg/kg, ' + kit.fmt(100 * x / V.A, 3) + ' % of adult)' : '— (for ages 1 and over)';
        ro.set('wt', kit.fmt(now.W, 3) + ' kg · ' + kit.fmt(now.h, 3) + ' cm');
        ro.set('bsa', kit.fmt(now.bsa, 3) + ' m² (' + kit.fmt(100 * now.bsa / BSA70, 3) + ' % of adult)');
        ro.set('dW', f(now.w)); ro.set('dB', f(now.b)); ro.set('dA', f(now.a)); ro.set('dM', V.mat ? f(now.m) : 'hidden'); ro.set('dY', f(now.y));
        loop.once();
      }
      function person(c, C, x, foot, hPx, wkg, hcm, age, col, scale) {
        const head = hPx * lerp(0.125, 0.066, clamp(age / 16, 0, 1)), girth = clamp(Math.sqrt((wkg / hcm) / (70 / 175)), 0.2, 1.8);
        const bodyH = hPx - 2 * head, torso = bodyH * lerp(0.55, 0.45, clamp(age / 16, 0, 1)), legs = bodyH - torso, bw = 175 * scale * 0.19 * girth;
        c.fillStyle = col; c.beginPath(); c.arc(x, foot - hPx + head, head, 0, Math.PI * 2); c.fill();
        c.beginPath(); if (c.roundRect) c.roundRect(x - bw / 2, foot - legs - torso, bw, torso, bw * 0.3); else c.rect(x - bw / 2, foot - legs - torso, bw, torso); c.fill();
        c.fillRect(x - bw * 0.42, foot - legs, bw * 0.36, legs); c.fillRect(x + bw * 0.06, foot - legs, bw * 0.36, legs);
        c.fillRect(x - bw / 2 - bw * 0.2, foot - legs - torso + 3, bw * 0.17, torso * 0.85); c.fillRect(x + bw / 2 + bw * 0.03, foot - legs - torso + 3, bw * 0.17, torso * 0.85);
      }
      const loop = kit.loop(() => {
        if (!now) return;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const foot = Hh - 26, scale = (Hh - 50) / 180;
        person(c, C, W * 0.08, foot, 175 * scale, 70, 175, 30, C.faint, scale);
        person(c, C, W * 0.21, foot, now.h * scale, now.W, now.h, V.age, kit.hue(210, 0.55), scale);
        kit.label(c, 'adult', W * 0.08, foot + 14, { align: 'center', size: 11, color: C.muted });
        kit.label(c, kit.fmt(V.age, 3) + ' y, ' + kit.fmt(now.W, 3) + ' kg', W * 0.21, foot + 14, { align: 'center', size: 11, weight: 700 });
        // dose bars as a fraction of the adult dose
        const x0 = W * 0.36, x1 = W * 0.94, rows = [['by weight', now.w, COL.w], ['by surface area', now.b, COL.b], ['allometric', now.a, COL.a]];
        if (V.mat) rows.push(['with maturation', now.m, COL.m]);
        rows.push(['Young\'s rule', now.y, COL.y]);
        const top = 20, gap = Math.min(34, (Hh - 60) / rows.length), maxD = V.cap ? V.A : Math.max(V.A, ...rows.map(r => Number.isFinite(r[1]) ? r[1] : 0));
        const X = d => x0 + 118 + (x1 - x0 - 118) * clamp(d / maxD, 0, 1);
        c.strokeStyle = C.faint; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(V.A), top - 6); c.lineTo(X(V.A), top + gap * rows.length); c.stroke(); c.setLineDash([]);
        kit.label(c, 'adult ' + kit.fmt(V.A, 3) + ' mg', X(V.A), top - 12, { align: 'center', size: 10.5, color: C.muted });
        rows.forEach(([name, d, col], i) => {
          const y = top + i * gap + gap / 2;
          kit.label(c, name, x0 + 110, y, { align: 'right', size: 12 });
          if (!Number.isFinite(d)) { kit.label(c, 'not defined under 1 year', X(0) + 4, y, { size: 11, color: C.muted }); return; }
          c.fillStyle = col; c.fillRect(X(0), y - gap * 0.3, X(d) - X(0), gap * 0.6);
          kit.label(c, kit.fmt(d, 3) + ' mg', X(d) + 6, y, { size: 11.5, weight: 700 });
        });
        kit.label(c, 'hypothetical drug · typical sizes · not a dosing tool', x0 + 118, Hh - 12, { size: 10.5, color: C.muted });
      }, box.stage);
      st.onResize(() => loop.once());
      draw();
    }
  });

  /* ================================================================ calc-drip */
  Hyper.sim('calc-drip', {
    title: 'Counting drops against the clock',
    blurb: `A gravity infusion: the roller clamp squeezes the tube, and the drip chamber turns the flow into drops of a fixed size — 20 to the mL in a standard set, 60 in a microdrip set. The target is $n = V f / t$ drops per minute. Set it the way it is done at the bedside: adjust the clamp, count the drops for 15 seconds on the clock, multiply by four. Gravity flow also falls a little as the bag empties, because the height of fluid above the patient drops.

**Try this**
- 1000 mL over 8 h with a 20 drops/mL set needs 42 drops/min. Move the clamp and count for 15 s until you are within one drop of 10 or 11.
- Switch to the microdrip set: at the same clamp the drops come three times as often — and drops per minute now equal mL per hour.
- Speed the clock up 60 times and watch the bag: does the infusion finish on time, and why does it lag at the end?
- Press *Set the clamp to the target*, then change the set without touching the clamp: the flow is the same, the drop count is not.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'V', label: 'Volume to give', min: 50, max: 1000, step: 50, value: 1000, unit: 'mL' },
        { id: 'hrs', label: 'Over', min: 0.5, max: 24, step: 0.5, value: 8, unit: 'h' },
        { id: 'f', type: 'select', label: 'Giving set', options: [['standard, 20 drops/mL', 20], ['blood set, 15 drops/mL', 15], ['microdrip, 60 drops/mL', 60], ['10 drops/mL', 10]], value: 20 },
        { id: 'cl', label: 'Roller clamp opening', min: 0, max: 100, step: 0.5, value: 30, unit: '%' },
        { id: 'spd', type: 'select', label: 'Clock', options: [['real time', 1], ['10 × faster', 10], ['60 × faster (a minute a second)', 60]], value: 1 },
        { type: 'buttons', items: [{ id: 'count', label: 'Count drops for 15 s', primary: true }, { id: 'set', label: 'Set the clamp to the target' }, { id: 'new', label: 'Hang a new bag' }] }
      ], (id) => {
        if (id === 'set') ctl.set('cl', clampFor(target().R));
        if (id === 'count') { counting = { t0: tSim, n: 0 }; lastCount = null; }
        if (id === 'new' || id === 'V' || id === 'hrs') reset();
        report(); loop.start();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['tgt', 'Target'], ['act', 'The clamp gives now'], ['cnt', '15-second count'], ['bag', 'Given so far'], ['end', 'At this rate the bag lasts']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)', min: 0 }, y: { label: 'volume given (mL)', min: 0 }, legend: true }, 170);
      const QMAX = 600;                                             // mL/h with the clamp wide open and a full bag
      let tSim = 0, vol = 0, phase = 0, drops = [], counting = null, lastCount = null, hist = [[0, 0]], nextLog = 60, pool = 0.4;
      const head = () => 0.85 + 0.15 * clamp(1 - vol / V.V, 0, 1);  // the fluid column shortens as the bag empties
      const flow = () => vol >= V.V ? 0 : QMAX * Math.pow(V.cl / 100, 1.6) * head();
      const target = () => ({ R: V.V / V.hrs, n: V.V * V.f / (V.hrs * 60) });
      const clampFor = R => clamp(100 * Math.pow(R / (QMAX * head()), 1 / 1.6), 0, 100);
      function reset() { tSim = 0; vol = 0; phase = 0; drops = []; counting = null; lastCount = null; hist = [[0, 0]]; nextLog = 60; }
      function report() {
        const tg = target(), Q = flow(), n = Q * V.f / 60;
        ro.set('tgt', kit.fmt(tg.R, 3) + ' mL/h = ' + kit.fmt(tg.n, 3) + ' drops/min (' + kit.fmt(tg.n / 4, 3) + ' in 15 s)');
        const dev = tg.R > 0 ? 100 * (Q / tg.R - 1) : 0;
        ro.set('act', kit.fmt(Q, 3) + ' mL/h = ' + kit.fmt(n, 3) + ' drops/min' + (Q > 0 ? Math.abs(dev) < 0.5 ? ' (on target)' : ' (' + (dev > 0 ? '+' : '') + kit.fmt(dev, 2) + ' %)' : ''));
        ro.set('cnt', counting ? 'counting… ' + counting.n + ' drops' : lastCount != null ? lastCount + ' drops × 4 = ' + lastCount * 4 + ' drops/min (target ' + kit.fmt(tg.n, 3) + ')' : 'press "Count drops for 15 s"');
        const el = tSim < 60 ? Math.floor(tSim) + ' s' : tSim < 3600 ? kit.fmt(tSim / 60, 3) + ' min' : kit.fmt(tSim / 3600, 3) + ' h';
        ro.set('bag', kit.fmt(vol, 3) + ' of ' + kit.fmt(V.V, 4) + ' mL after ' + el);
        ro.set('end', Q > 0 ? kit.fmt((V.V - vol) / Q + tSim / 3600, 3) + ' h in all (planned ' + kit.fmt(V.hrs, 3) + ' h)' : vol >= V.V ? 'the bag is empty' : 'the clamp is shut: nothing flows');
        const tg2 = [[0, 0], [V.hrs, V.V]];
        plot.set({ series: [{ pts: tg2, label: 'as prescribed', dash: [5, 4] }, { pts: hist.concat([[tSim / 3600, vol]]), label: 'this infusion' }], x: { label: 'time (h)', min: 0, max: Math.max(V.hrs * 1.3, tSim / 3600) }, y: { label: 'volume given (mL)', min: 0, max: V.V * 1.05 }, vlines: [{ x: tSim / 3600, label: 'now' }] });
      }
      let repT = 0;
      const loop = kit.loop((dt) => {
        const spd = V.spd, hsub = dt / 4;
        for (let i = 0; i < 4; i++) {
          const Q = flow(), rate = Q * V.f / 3600;                  // drops per simulated second
          tSim += hsub * spd; vol = Math.min(V.V, vol + Q / 3600 * hsub * spd);
          phase += rate * hsub * spd;
          while (phase >= 1) {
            phase -= 1;
            if (counting) counting.n++;
            if (rate * spd < 6 && drops.length < 30) drops.push({ y: 0, v: 0 });
          }
          if (counting && tSim - counting.t0 >= 15) { lastCount = counting.n; counting = null; }
          for (const d of drops) { d.v += 1400 * hsub; d.y += d.v * hsub; }
          if (tSim >= nextLog) { hist.push([tSim / 3600, vol]); nextLog += 60 * Math.max(1, spd / 4); if (hist.length > 600) hist.splice(1, 1); }
        }
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const Q = flow(), rate = Q * V.f / 3600;
        // the bag
        const bx = W * 0.07, bw = Math.min(80, W * 0.12), by = 16, bh = Hh * 0.34, lev = clamp(1 - vol / V.V, 0, 1);
        c.fillStyle = WATER(kit); c.fillRect(bx, by + bh * (1 - lev), bw, bh * lev);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); if (c.roundRect) c.roundRect(bx, by, bw, bh, 8); else c.rect(bx, by, bw, bh); c.stroke();
        kit.label(c, kit.fmt(V.V - vol, 4) + ' mL left', bx + bw + 8, by + bh * 0.5, { size: 12, weight: 700 });
        // the drip chamber
        const cx = bx + bw / 2, cTop = by + bh + 26, cH = Hh * 0.3, cW = 34, orifice = cTop + 8, poolY = cTop + cH * (1 - pool);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, by + bh); c.lineTo(cx, cTop); c.stroke();
        c.fillStyle = WATER(kit); c.fillRect(cx - cW / 2 + 1, poolY, cW - 2, cTop + cH - poolY);
        c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(cx - cW / 2, cTop, cW, cH);
        if (Q > 0 && rate * V.spd >= 6) { c.strokeStyle = kit.hue(200, 0.7); c.lineWidth = 2.5; c.beginPath(); c.moveTo(cx, orifice); c.lineTo(cx, poolY); c.stroke(); kit.label(c, V.spd > 1 ? 'a stream (clock sped up)' : 'a stream: too fast to count', cx + cW / 2 + 8, cTop + cH / 2, { size: 11, color: C.warn }); }
        else if (Q > 0) {
          const rf = 2 + 3.2 * Math.cbrt(clamp(phase, 0, 1)) * (V.f === 60 ? 0.6 : 1);
          c.fillStyle = kit.hue(200, 0.8); c.beginPath(); c.arc(cx, orifice + rf, rf, 0, Math.PI * 2); c.fill();
          drops = drops.filter(d => orifice + 6 + d.y < poolY);
          for (const d of drops) { c.beginPath(); c.arc(cx, orifice + 6 + d.y, V.f === 60 ? 2.4 : 4, 0, Math.PI * 2); c.fill(); }
        }
        // tube and roller clamp
        const tubeBot = Hh - 14;
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, cTop + cH); c.lineTo(cx, tubeBot); c.stroke();
        const ry = cTop + cH + (tubeBot - cTop - cH) * 0.45;
        c.fillStyle = C.muted; c.fillRect(cx - 12, ry - 14, 24, 28);
        c.fillStyle = C.bg2; c.beginPath(); c.arc(cx + 2, ry - 8 + 16 * (1 - V.cl / 100), 6, 0, Math.PI * 2); c.fill();
        kit.label(c, 'clamp ' + kit.fmt(V.cl, 3) + ' % open', cx + 18, ry, { size: 11, color: C.muted });
        // the clock
        const kx = W * 0.52, ky = Hh * 0.42, kr = Math.min(W * 0.14, Hh * 0.3);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(kx, ky, kr, 0, Math.PI * 2); c.stroke();
        for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, r1 = i % 5 ? kr * 0.92 : kr * 0.82; c.lineWidth = i % 5 ? 1 : 2; c.beginPath(); c.moveTo(kx + r1 * Math.sin(a), ky - r1 * Math.cos(a)); c.lineTo(kx + kr * Math.sin(a), ky - kr * Math.cos(a)); c.stroke(); }
        if (counting) { const a0 = ((counting.t0 % 60) / 60) * Math.PI * 2 - Math.PI / 2, a1 = a0 + clamp((tSim - counting.t0) / 60, 0, 0.25) * Math.PI * 2; c.fillStyle = kit.hue(140, 0.25); c.beginPath(); c.moveTo(kx, ky); c.arc(kx, ky, kr * 0.8, a0, a1); c.closePath(); c.fill(); }
        const secA = (tSim % 60) / 60 * Math.PI * 2, minA = (tSim % 3600) / 3600 * Math.PI * 2;
        c.strokeStyle = C.text; c.lineWidth = 3; c.beginPath(); c.moveTo(kx, ky); c.lineTo(kx + kr * 0.6 * Math.sin(minA), ky - kr * 0.6 * Math.cos(minA)); c.stroke();
        c.strokeStyle = C.bad; c.lineWidth = 1.5; c.beginPath(); c.moveTo(kx, ky); c.lineTo(kx + kr * 0.85 * Math.sin(secA), ky - kr * 0.85 * Math.cos(secA)); c.stroke();
        kit.dot(c, kx, ky, 3, C.text);
        kit.label(c, V.spd > 1 ? 'clock × ' + V.spd : 'real time', kx, ky + kr + 14, { align: 'center', size: 11, color: C.muted });
        // the count and the numbers
        const tx = kx + kr + 24, tg = target();
        kit.label(c, 'target ' + kit.fmt(tg.n, 3) + ' drops/min', tx, Hh * 0.2, { size: 13, weight: 700 });
        kit.label(c, '= ' + kit.fmt(V.V, 4) + ' mL × ' + V.f + ' ÷ ' + kit.fmt(V.hrs * 60, 4) + ' min', tx, Hh * 0.2 + 18, { size: 11.5, color: C.muted });
        kit.label(c, 'now ' + kit.fmt(Q * V.f / 60, 3) + ' drops/min', tx, Hh * 0.2 + 44, { size: 13, weight: 700, color: Math.abs(Q / tg.R - 1) <= 0.1 ? C.ok : C.warn });
        if (counting) kit.label(c, 'counting: ' + counting.n + ' drops in ' + kit.fmt(Math.min(15, tSim - counting.t0), 2) + ' s', tx, Hh * 0.2 + 72, { size: 13, weight: 700, color: C.accent });
        else if (lastCount != null) kit.label(c, lastCount + ' drops in 15 s → ' + lastCount * 4 + ' drops/min', tx, Hh * 0.2 + 72, { size: 13, weight: 700, color: Math.abs(lastCount * 4 - tg.n) <= 4 ? C.ok : C.warn });
        repT += dt; if (repT > 0.25) { repT = 0; report(); }
        if (vol >= V.V && !counting) { report(); loop.stop(); }
      }, box.stage);
      st.onResize(() => loop.once());
      report(); loop.start();
    }
  });

  /* ================================================================ calc-tenfold */
  // the dose as a plain number string, as it might be written on an order
  const plain = v => { let s = Number(v.toPrecision(3)).toString(); if (/e/.test(s)) s = v.toFixed(6).replace(/0+$/, ''); return s; };
  const SLIPS = {
    none: { label: 'no slip', make: d => ({ written: plain(d) + ' mg', read: plain(d) + ' mg', factor: 1, safe: plain(d) + ' mg', check: 'Nothing to catch — but the independent check is still done, every time.' }) },
    trail: { label: 'a trailing zero: "5.0 mg" read without its point', make: d => {
      const w = plain(d).indexOf('.') >= 0 ? plain(d) + '0' : plain(d) + '.0', r = parseFloat(w.replace('.', ''));
      return { written: w + ' mg', read: plain(r) + ' mg', factor: r / d, safe: plain(d) + ' mg — never a trailing zero', check: 'The order itself is ambiguous: a checker can misread it too. The defence is writing it without the trailing zero.' };
    } },
    naked: { label: 'a naked decimal: ".5 mg" with the point missed', make: d => {
      if (d >= 1) return { written: plain(d) + ' mg', read: plain(d) + ' mg', factor: 1, safe: plain(d) + ' mg', check: 'Doses of 1 mg or more have no leading zero to lose: set the dose below 1 mg to see this slip.' };
      const w = plain(d).replace(/^0/, ''), r = parseFloat(w.replace('.', ''));
      return { written: w + ' mg', read: plain(r) + ' mg', factor: r / d, safe: plain(d) + ' mg — always a leading zero', check: 'A point before a digit is easy to miss on a crease or a fax. Always write the leading zero.' };
    } },
    dec: { label: 'the decimal point slipped one place', make: d => ({ written: plain(d) + ' mg', read: plain(d * 10) + ' mg', factor: 10, safe: plain(d) + ' mg, checked against the usual dose', check: 'A reasonableness check catches it: the volume is ten times what this dose usually needs.' }) },
    ug: { label: 'micrograms read as milligrams', make: d => ({ written: plain(d * 1000) + ' µg', read: plain(d * 1000) + ' mg', factor: 1000, safe: plain(d * 1000) + ' micrograms (written in full) or ' + plain(d) + ' mg', check: 'A handwritten µ looks like m. The volume is a thousand times too large — vials by the dozen — and should stop anyone.' }) },
    mg: { label: 'milligrams read as micrograms', make: d => ({ written: plain(d) + ' mg', read: plain(d) + ' µg', factor: 0.001, safe: plain(d) + ' mg', check: 'An under-dose of a thousand times: the drug simply fails. Under-dosing is an error too.' }) },
    min: { label: 'a rate per hour run per minute', make: d => ({ written: plain(d) + ' mg/h', read: plain(d) + ' mg/min', factor: 60, safe: plain(d) + ' mg/h, with the pump\'s drug-library limits on', check: 'A smart pump\'s drug library with a hard limit would refuse a rate sixty times the usual.' }) },
    day: { label: 'a daily dose given at each of three doses', make: d => ({ written: plain(3 * d) + ' mg/day in 3 doses', read: plain(3 * d) + ' mg per dose', factor: 3, safe: plain(3 * d) + ' mg/day = ' + plain(d) + ' mg three times a day', check: 'Only three-fold: a volume check may not flag it. Always read the "/day" and divide.' }) },
    lb: { label: 'a weight in pounds taken as kilograms', make: d => ({ written: 'weight: 44 lb', read: 'weight: 44 kg', factor: 44 / 19.96, safe: 'weigh in kilograms and record the unit', check: '2.2 times too much: easy to miss. Weigh in kg, and compare the weight with what is typical for the age.' }) },
    ratio: { label: '1 in 1000 drawn up for a 1 in 10 000 volume', make: d => ({ written: plain(d) + ' mg = ' + plain(d / 0.1) + ' mL of 1 in 10 000', read: plain(d / 0.1) + ' mL of 1 in 1000', factor: 10, safe: plain(d) + ' mg of a product labelled in mg/mL', check: 'The two strengths differ by one zero. Labels in mg/mL and a second check of the product make it hard to do.' }) }
  };
  Hyper.sim('calc-tenfold', {
    title: 'The ten-fold error visualiser',
    blurb: `A hypothetical medicine with a narrow margin, and the classic slips that turn a dose into ten, sixty or a thousand times itself — or a thousandth. The ruler is logarithmic: every step is a factor of ten. The syringes show the volume that would be drawn up, as intended and as actually given; below them, which check would catch the slip and how the order should have been written.

**Try this**
- Set 5 mg and choose the trailing zero: "5.0 mg" becomes 50 mg. Then set 0.5 mg and choose the naked decimal: ".5 mg" becomes 5 mg.
- Micrograms read as milligrams: look at the syringes. How many would it take?
- The three-fold and 2.2-fold slips (per day as per dose, pounds as kilograms) land just outside the green band — why are they the hardest to spot?
- Change the product strength: the error factor never changes, but the volume that should look "wrong" does.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Intended dose', min: 0.05, max: 500, value: 5, unit: 'mg', log: true, sig: 2 },
        { id: 'c', type: 'select', label: 'Product strength', options: [['0.1 mg/mL', 0.1], ['1 mg/mL', 1], ['5 mg/mL', 5], ['10 mg/mL', 10], ['50 mg/mL', 50]], value: 1 },
        { id: 'slip', type: 'select', label: 'The slip', options: Object.keys(SLIPS).map(k => [SLIPS[k].label, k]), value: 'trail' }
      ], () => { R = null; loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['int', 'Intended'], ['giv', 'Given'], ['fac', 'Factor'], ['chk', 'Would a check catch it?'], ['safe', 'Write it as']]);
      let R = null;
      const vol = mg => mg / V.c;
      const fmtV = v => v < 0.01 ? kit.fmt(v, 2) + ' mL — too small to measure' : kit.fmt(v, 3) + ' mL';
      function compute() {
        const d = V.d, s = SLIPS[V.slip].make(d), given = d * s.factor, ratio = V.slip === 'ratio';
        // the ratio slip: the volume meant for 1 in 10 000 (0.1 mg/mL) is drawn from 1 in 1000 (1 mg/mL) — same volume, ten times the drug
        R = Object.assign({ d, given, vI: ratio ? d / 0.1 : vol(d), vG: ratio ? d / 0.1 : vol(given), ratio }, s);
        ro.set('int', kit.fmt(d, 3) + ' mg = ' + fmtV(R.vI));
        ro.set('giv', kit.fmt(given, 3) + ' mg = ' + fmtV(R.vG) + (ratio ? ' — the same volume, of the stronger product' : ''));
        ro.set('fac', s.factor === 1 ? '× 1 — as intended' : s.factor > 1 ? '× ' + kit.fmt(s.factor, 3) + ' (an overdose)' : '÷ ' + kit.fmt(1 / s.factor, 3) + ' (an under-dose)');
        ro.set('chk', s.check); ro.set('safe', s.safe);
      }
      function syringe(c, C, x, y, w, vmL, col, label) {
        const caps = [1, 3, 5, 10, 20, 50], cap = caps.find(k => k >= vmL) || 50, n = vmL > 50 ? Math.ceil(vmL / 50) : 1, show = Math.min(n, 6);
        const h = 18, each = Math.min(w, (w - 8 * (show - 1)) / show + (show > 1 ? 0 : 0));
        kit.label(c, label, x, y - 12, { size: 12, weight: 700, color: col });
        for (let i = 0; i < show; i++) {
          const sx = x + i * (each + 8), bw = each - 16, fill = n > 1 ? (i < n - 1 ? 1 : (vmL - 50 * (n - 1)) / 50) : clamp(vmL / cap, 0, 1);
          c.fillStyle = col; c.globalAlpha = 0.55; c.fillRect(sx + 10, y, Math.max(0, bw * fill), h); c.globalAlpha = 1;
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(sx + 10, y, bw, h);
          c.beginPath(); c.moveTo(sx + 10, y + h / 2); c.lineTo(sx, y + h / 2); c.stroke();
          c.fillStyle = C.muted; c.fillRect(sx + 10 + bw * clamp(fill, 0, 1), y + 2, 3, h - 4);
        }
        const note = n > 6 ? ' — ' + n + ' syringes of 50 mL' : n > 1 ? ' — ' + n + ' syringes of 50 mL' : ' in a ' + cap + ' mL syringe';
        kit.label(c, fmtV(vmL) + note, x, y + h + 13, { size: 11.5, color: C.muted });
      }
      const loop = kit.loop(() => {
        if (!R) compute();
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        // the order as written and as read
        const cx = 16, cw = W - 32;
        c.fillStyle = C.surface || C.bg2; c.strokeStyle = C.faint; c.lineWidth = 1; c.fillRect(cx, 12, cw, 64); c.strokeRect(cx, 12, cw, 64);
        kit.label(c, 'Order (hypothetical drug):', cx + 12, 30, { size: 11.5, color: C.muted });
        const big = Math.max(R.written.length, R.read.length) > 16 ? 15 : 22;
        kit.label(c, R.written, cx + 12, 56, { size: big, weight: 700, font: 'Georgia, serif' });
        if (R.factor !== 1) {
          kit.label(c, 'read as:', cx + cw * 0.55, 30, { size: 11.5, color: C.muted });
          kit.label(c, R.read, cx + cw * 0.55, 56, { size: big, weight: 700, color: C.bad, font: 'Georgia, serif' });
        }
        // the logarithmic dose ruler, from a thousandth to a thousand times the intended dose
        const x0 = 40, x1 = W - 40, y = Math.max(Hh * 0.38, 136), X = f => x0 + (x1 - x0) * (Math.log10(clamp(f, 1e-3, 1e3)) + 3) / 6;
        const band = (a, b, col) => { c.fillStyle = col; c.fillRect(X(a), y - 10, X(b) - X(a), 20); };
        band(1e-3, 0.5, kit.hue(40, 0.25)); band(0.5, 0.8, kit.hue(60, 0.2)); band(0.8, 1.25, kit.hue(140, 0.35)); band(1.25, 2, kit.hue(40, 0.3)); band(2, 1e3, kit.hue(0, 0.3));
        [1e-3, 1e-2, 0.1, 1, 10, 100, 1e3].forEach(f => { c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(X(f), y + 10); c.lineTo(X(f), y + 16); c.stroke(); kit.label(c, f >= 1 ? '× ' + f : '÷ ' + Math.round(1 / f), X(f), y + 26, { align: 'center', size: 10.5, color: C.muted }); });
        kit.label(c, 'too little: may not work', X(0.02), y - 32, { align: 'center', size: 10.5, color: C.muted });
        kit.label(c, 'as intended', X(1), y - 32, { align: 'center', size: 10.5, color: C.ok });
        kit.label(c, 'overdose: harm likely', X(30), y - 32, { align: 'center', size: 10.5, color: C.bad });
        const pin = (f, col, text, up) => { c.fillStyle = col; c.beginPath(); c.moveTo(X(f), y + (up ? -12 : 12)); c.lineTo(X(f) - 7, y + (up ? -24 : 24)); c.lineTo(X(f) + 7, y + (up ? -24 : 24)); c.closePath(); c.fill(); if (text) kit.label(c, text, X(f), y + (up ? -34 : 44), { align: 'center', size: 11.5, weight: 700, color: col, bg: C.bg2 }); };
        pin(1, C.ok, '', true);
        if (R.factor !== 1) {
          kit.arrow(c, X(1), y, X(R.factor), y, C.bad, 2.5);
          pin(R.factor, C.bad, (R.factor > 1 ? '× ' : '÷ ') + kit.fmt(R.factor > 1 ? R.factor : 1 / R.factor, 3), false);
        }
        // the syringes
        const sy = Hh * 0.62;
        syringe(c, C, 24, sy, Math.min(W * 0.4, 260), R.vI, C.ok, 'intended: ' + kit.fmt(R.d, 3) + ' mg');
        syringe(c, C, W * 0.5, sy, Math.min(W * 0.46, 330), R.vG, R.factor === 1 ? C.ok : C.bad, 'given: ' + kit.fmt(R.given, 3) + ' mg');
        // which check would catch it, and the safe way to write it (wrapped to the width)
        const wrap = (text, maxW, size) => {
          c.save(); c.font = '500 ' + size + 'px ' + getComputedStyle(document.body).fontFamily;
          const lines = []; let cur = '';
          for (const w of text.split(' ')) { const t = cur ? cur + ' ' + w : w; if (c.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }
          if (cur) lines.push(cur); c.restore(); return lines;
        };
        let ty = sy + 66;
        wrap('Would a check catch it? ' + R.check, W - 48, 12).forEach(l => { if (ty < Hh - 40) kit.label(c, l, 24, ty, { size: 12 }); ty += 17; });
        wrap('Write it as: ' + R.safe, W - 48, 12).forEach(l => { if (ty < Hh - 30) kit.label(c, l, 24, ty + 4, { size: 12, weight: 700, color: C.ok }); ty += 17; });
        kit.label(c, (R.ratio ? 'Products: 1 in 10 000 (0.1 mg/mL) meant, 1 in 1000 (1 mg/mL) used' : 'Product: ' + kit.fmt(V.c, 3) + ' mg/mL') + ' · every dose here is hypothetical', 24, Hh - 14, { size: 11, color: C.muted });
      }, box.stage);
      st.onResize(() => loop.once());
      compute(); loop.once();
    }
  });

  /* ================================================================ calc-ions */
  // [symbol, particles per formula unit, charge, hue]
  const SALTS = {
    nacl: { name: 'sodium chloride', M: 58.44, ions: [['Na⁺', 1, 1, 210], ['Cl⁻', 1, -1, 140]] },
    kcl: { name: 'potassium chloride', M: 74.55, ions: [['K⁺', 1, 1, 280], ['Cl⁻', 1, -1, 140]] },
    cacl: { name: 'calcium chloride dihydrate', M: 147.01, ions: [['Ca²⁺', 1, 2, 30], ['Cl⁻', 2, -1, 140]] },
    cagl: { name: 'calcium gluconate (monohydrate)', M: 448.39, ions: [['Ca²⁺', 1, 2, 30], ['gluconate⁻', 2, -1, 255]] },
    mgso: { name: 'magnesium sulfate heptahydrate', M: 246.47, ions: [['Mg²⁺', 1, 2, 330], ['SO₄²⁻', 1, -2, 180]] },
    bicarb: { name: 'sodium bicarbonate', M: 84.01, ions: [['Na⁺', 1, 1, 210], ['HCO₃⁻', 1, -1, 165]] },
    glu: { name: 'glucose (anhydrous)', M: 180.16, ions: [['glucose', 1, 0, 60]] }
  };
  const SALT_OPTS = Object.keys(SALTS).map(k => [SALTS[k].name + ' (' + SALTS[k].M + ' g/mol)', k]);
  Hyper.sim('calc-ions', {
    title: 'Counting ions: mmol, mEq and mOsm',
    blurb: `The same mass of two salts dissolved side by side. Each dot is a fixed number of millimoles of one kind of particle; bigger dots carry two charges. Millimoles count formula units ($m/M$), milliequivalents count the charge of the named ion (mmol × charge), and milliosmoles count every particle in solution (mmol × particles, ideal).

**Try this**
- Compare a gram of calcium chloride dihydrate with a gram of calcium gluconate: about three times as much calcium in the chloride.
- Sodium chloride against glucose, gram for gram: which gives more osmoles, and why is 5 % glucose close to isotonic while 5 % salt is not?
- Magnesium sulfate: the mEq of Mg²⁺ are twice its mmol, and each formula unit gives only two particles.
- Change the volume: the amounts stay the same, the concentrations (mmol/L) change.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'a', type: 'select', label: 'Left beaker', options: SALT_OPTS, value: 'cacl' },
        { id: 'b', type: 'select', label: 'Right beaker', options: SALT_OPTS, value: 'cagl' },
        { id: 'm', label: 'Mass of each', min: 0.1, max: 5, step: 0.1, value: 1, unit: 'g' },
        { id: 'vol', label: 'Dissolved in', min: 50, max: 1000, step: 50, value: 100, unit: 'mL' }
      ], () => { build(); report(); loop.start(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['A', 'Left'], ['B', 'Right'], ['cA', 'Left, per litre'], ['cB', 'Right, per litre'], ['cmp', 'Compared']]);
      let dots = [], unit = 1, t = 0;
      const count = k => { const s = SALTS[k], n = V.m * 1000 / s.M, cat = s.ions[0]; return { s, n, meq: n * Math.abs(cat[2]), mosm: n * s.ions.reduce((a, i) => a + i[1], 0), cat }; };
      function build() {
        const A = count(V.a), B = count(V.b), maxP = Math.max(A.mosm, B.mosm);
        unit = [0.1, 0.2, 0.5, 1, 2, 5, 10, 20].find(u => maxP / u <= 220) || 20;
        const rng = kit.bio.rng(7);
        dots = [A, B].map(X => {
          const list = [];
          for (const [sym, per, ch, hue] of X.s.ions) { const k = Math.round(X.n * per / unit); for (let i = 0; i < k; i++) list.push({ sym, ch, hue, x: rng(), y: rng(), ph: rng() * 6.28 }); }
          return list;
        });
      }
      const fmtRow = X => kit.fmt(X.n, 3) + ' mmol · ' + (X.cat[2] ? kit.fmt(X.meq, 3) + ' mEq ' + X.cat[0] : 'no charge') + ' · ' + kit.fmt(X.mosm, 3) + ' mOsm';
      function report() {
        const A = count(V.a), B = count(V.b), L = V.vol / 1000;
        ro.set('A', fmtRow(A)); ro.set('B', fmtRow(B));
        ro.set('cA', kit.fmt(A.n / L, 3) + ' mmol/L · ' + kit.fmt(A.mosm / L, 3) + ' mOsm/L (ideal) · ' + kit.fmt(V.m / V.vol * 100, 3) + ' % w/v');
        ro.set('cB', kit.fmt(B.n / L, 3) + ' mmol/L · ' + kit.fmt(B.mosm / L, 3) + ' mOsm/L (ideal)');
        const same = A.cat[0] === B.cat[0] && A.cat[2];
        ro.set('cmp', same ? 'left gives ' + kit.fmt(A.n / B.n, 3) + ' × the ' + A.cat[0] + ' of the right, gram for gram' : 'left has ' + kit.fmt(A.mosm / B.mosm, 3) + ' × the particles of the right');
      }
      const loop = kit.loop((dt) => {
        t += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, A = count(V.a), B = count(V.b);
        const bw = W * 0.34, bh = Hh * 0.5, top = 34;
        [[A, dots[0], W * 0.08], [B, dots[1], W * 0.58]].forEach(([X, list, bx]) => {
          c.fillStyle = WATER(kit); c.fillRect(bx, top + bh * 0.08, bw, bh * 0.92);
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, top); c.lineTo(bx, top + bh); c.lineTo(bx + bw, top + bh); c.lineTo(bx + bw, top); c.stroke();
          kit.label(c, V.m + ' g ' + X.s.name, bx + bw / 2, top - 14, { align: 'center', size: 12, weight: 700 });
          for (const d of list) {
            const x = bx + 8 + (bw - 16) * d.x + 3 * Math.sin(t * 1.3 + d.ph), y = top + bh * 0.12 + (bh * 0.84) * d.y + 3 * Math.cos(t * 1.1 + d.ph);
            const r = Math.abs(d.ch) === 2 ? 5.2 : 3.4;
            if (d.ch > 0) { c.fillStyle = kit.hue(d.hue, 0.9); c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }
            else if (d.ch < 0) { c.strokeStyle = kit.hue(d.hue, 0.95); c.lineWidth = 1.6; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.stroke(); }
            else { c.fillStyle = kit.hue(d.hue, 0.6); c.fillRect(x - r, y - r, 2 * r, 2 * r); }
          }
          // legend and bars under the beaker
          let ly = top + bh + 16;
          X.s.ions.forEach(([sym, per, ch, hue]) => {
            const r = Math.abs(ch) === 2 ? 5.2 : 3.4;
            if (ch > 0) { c.fillStyle = kit.hue(hue, 0.9); c.beginPath(); c.arc(bx + 8, ly, r, 0, Math.PI * 2); c.fill(); }
            else if (ch < 0) { c.strokeStyle = kit.hue(hue, 0.95); c.lineWidth = 1.6; c.beginPath(); c.arc(bx + 8, ly, r, 0, Math.PI * 2); c.stroke(); }
            else { c.fillStyle = kit.hue(hue, 0.6); c.fillRect(bx + 8 - r, ly - r, 2 * r, 2 * r); }
            kit.label(c, sym + ': ' + kit.fmt(X.n * per, 3) + ' mmol', bx + 18, ly, { size: 11.5 });
            ly += 16;
          });
          const maxV = Math.max(A.mosm, B.mosm, 1e-9), bars = [['mmol', X.n, C.muted], ['mEq ' + X.cat[0], X.meq, C.accent], ['mOsm', X.mosm, C.warn]];
          bars.forEach(([name, v, col], i) => {
            const yy = ly + 6 + i * 17, len = (bw - 90) * v / maxV;
            kit.label(c, name, bx, yy, { size: 11, color: C.muted });
            c.fillStyle = col; c.fillRect(bx + 72, yy - 6, Math.max(0, len), 12);
            kit.label(c, kit.fmt(v, 3), bx + 76 + Math.max(0, len), yy, { size: 11, weight: 700 });
          });
        });
        kit.label(c, 'each dot = ' + unit + ' mmol of that particle · filled = cation, ring = anion, square = uncharged · big = two charges', W / 2, Hh - 10, { align: 'center', size: 10.5, color: C.muted });
      }, box.stage);
      st.onResize(() => loop.once());
      build(); report(); loop.start();
    }
  });

})();
