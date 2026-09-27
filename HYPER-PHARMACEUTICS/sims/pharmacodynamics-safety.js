/* HYPER-PHARMACEUTICS · sims/pharmacodynamics-safety.js — simulations for pharmacodynamics and safety.
 *   pd-schild       log concentration–response curves (kit.pharma.hill) with competitive, allosteric and
 *                   non-competitive antagonists, receptors binding on a membrane, an organ-bath experiment with
 *                   noise, curve fitting and a Schild plot
 *   pd-reserve      the operational model: occupancy against response, spare receptors and Furchgott's series
 *   pd-window       population efficacy and toxicity curves against concentration, the therapeutic window,
 *                   and a dosing regimen (kit.med.pk) moving through it
 *   pd-hysteresis   an effect compartment (ke0) and acute tolerance: plasma, effect site and the hysteresis loop
 *   pd-interaction  a victim drug given twice daily meets a reversible inhibitor, a mechanism-based inhibitor or
 *                   an inducer; enzyme turnover sets the onset and offset; the static fm–AUC ratio map
 *   pd-genotype     metaboliser phenotypes from allele frequencies (Hardy–Weinberg), exposure of an active drug
 *                   or of a prodrug's active metabolite in each phenotype
 *   pd-signal       detecting a rare adverse reaction: trial size, the rule of three, under-reporting
 *   pd-mic          antibiotic exposure against the MIC: fT>MIC, Cmax/MIC, AUC/MIC, bacterial killing and the
 *                   mutant selection window
 * All drugs are hypothetical; these are teaching models, not dosing tools.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  const logspace = (a, b, n) => Array.from({ length: n }, (_, i) => a * Math.pow(b / a, i / (n - 1)));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function plotGrid(box, n, min) {
    const gb = document.createElement('div');
    gb.style.cssText = 'padding:4px 10px 10px;display:grid;grid-template-columns:repeat(auto-fit,minmax(' + (min || 280) + 'px,1fr));gap:10px';
    box.stage.appendChild(gb);
    const out = [];
    for (let i = 0; i < n; i++) { const d = document.createElement('div'); gb.appendChild(d); out.push(d); }
    return out;
  }
  // a small seeded random generator (mulberry32) and a normal deviate
  function rng(seed) {
    let a = seed >>> 0;
    return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  }
  const gauss = r => { const u = Math.max(1e-12, r()), v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  // a Poisson count (Knuth for small means, normal approximation for large)
  function poisson(lambda, r) {
    if (!(lambda > 0)) return 0;
    if (lambda > 40) return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * gauss(r)));
    const L = Math.exp(-lambda); let k = 0, p = 1;
    do { k++; p *= r(); } while (p > L && k < 1000);
    return k - 1;
  }
  function nM(kit, v) {
    if (!Number.isFinite(v)) return '—';
    if (v >= 1e6) return kit.fmt(v / 1e6, 3) + ' mM';
    if (v >= 1e3) return kit.fmt(v / 1e3, 3) + ' µM';
    if (v >= 1) return kit.fmt(v, 3) + ' nM';
    return kit.fmt(v * 1e3, 3) + ' pM';
  }
  const pct = (v, d) => (Number.isFinite(v) ? v.toFixed(d == null ? 0 : d) : '—') + ' %';
  // the standard normal distribution function (Abramowitz and Stegun 7.1.26, error below 1e-7)
  function ncdf(z) {
    const x = Math.abs(z) / Math.SQRT2, t = 1 / (1 + 0.3275911 * x);
    const erf = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return z >= 0 ? 0.5 * (1 + erf) : 0.5 * (1 - erf);
  }
  // least-squares straight line through [[x, y], ...]
  function linfit(pts) {
    const n = pts.length; if (n < 2) return null;
    const mx = pts.reduce((s, p) => s + p[0], 0) / n, my = pts.reduce((s, p) => s + p[1], 0) / n;
    let sxy = 0, sxx = 0; for (const [x, y] of pts) { sxy += (x - mx) * (y - my); sxx += (x - mx) * (x - mx); }
    if (!(sxx > 0)) return null;
    const slope = sxy / sxx; return { slope, icpt: my - slope * mx };
  }

  /* ================================================================ pd-schild */
  Hyper.sim('pd-schild', {
    title: 'Agonist curves, antagonists and the Schild plot',
    blurb: `An agonist's log concentration–response curve (the Hill equation), alone and with an antagonist at three concentrations — [B], 10[B] and 100[B]. The strip above shows receptors on a membrane at the agonist concentration you choose: **green** agonist bound, **red** antagonist bound, with the response on the right. The lower plot is the **Schild plot**: log(DR − 1) against log[B], whose slope tells competition apart from everything else and whose intercept is the pA₂.

**Try this**
- With a competitive antagonist, the curves move right in parallel and keep their maximum. Read the dose ratios: each tenfold rise in [B] multiplies (DR − 1) by ten — a Schild slope of 1.
- Switch to the allosteric modulator: the shift stops growing at about 1/α = 33, and the Schild plot bends over.
- Switch to the non-competitive antagonist: the maximum falls instead, and a Schild plot is meaningless.
- Run the organ-bath experiment a few times: each curve is measured with noise and fitted, and the fitted Schild slope and pA₂ scatter around the truth.
- Make the agonist a partial one (maximum 40 %) or steepen it (n = 2): the dose ratios — and so pA₂ — do not change, because K_B belongs to the antagonist and the receptor.`,
    mount(box, kit, params) {
      params = params || {};
      const P = kit.pharma, ALPHA = 0.03;
      const st = kit.stage(box.stage, { aspect: 0.2, minH: 130 });
      const [g1, g2] = plotGrid(box, 2);
      let exp = null, seed = 7;
      const ctl = kit.controls(box.side, [
        { id: 'ant', type: 'select', label: 'Antagonist', options: [['None — the agonist alone', 'none'], ['Competitive (surmountable)', 'comp'], ['Negative allosteric modulator (α = 0.03)', 'allo'], ['Non-competitive (insurmountable)', 'noncomp']], value: params.ant || 'comp' },
        { id: 'ec50', label: 'Agonist EC₅₀', min: 1, max: 1000, value: 10, log: true, sig: 2, unit: 'nM' },
        { id: 'n', label: 'Hill slope n', min: 0.5, max: 3, step: 0.1, value: 1 },
        { id: 'emax', label: 'Agonist maximum (efficacy)', min: 20, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'kb', label: 'Antagonist K_B', min: 0.3, max: 300, value: 3, log: true, sig: 2, unit: 'nM' },
        { id: 'b', label: 'Antagonist [B] (also ×10 and ×100)', min: 0.3, max: 300, value: 3, log: true, sig: 2, unit: 'nM' },
        { id: 'A', label: 'Agonist concentration in the picture', min: 0.01, max: 100000, value: 30, log: true, sig: 2, unit: 'nM' },
        { type: 'buttons', items: [{ id: 'exp', label: 'Run an organ-bath experiment', primary: true }, { id: 'clear', label: 'Clear' }] }
      ], (id) => {
        if (id === 'exp') runExp(); else if (id === 'clear' || id !== 'A') exp = null;
        draw();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['dr', 'Dose ratios at [B], 10[B], 100[B]'], ['pa2', 'pA₂ = −log K_B (true)'], ['fit', 'Experiment: Schild slope, pA₂'], ['occ', 'Receptors: agonist / antagonist'], ['eff', 'Response: alone → with [B]']]);
      const pC = kit.plot(g1, { x: { label: 'agonist concentration (nM)', log: true }, y: { label: 'response (% of system maximum)', min: 0, max: 105 }, legend: true }, 230);
      const pS = kit.plot(g2, { x: { label: 'log [B] (mol/L)' }, y: { label: 'log (DR − 1)' }, legend: true }, 230);

      const shift = B => V.ant === 'comp' ? 1 + B / V.kb : V.ant === 'allo' ? (1 + B / V.kb) / (1 + ALPHA * B / V.kb) : 1;
      const ceil = B => V.ant === 'noncomp' ? 1 / (1 + B / V.kb) : 1;
      const resp = (A, B) => ceil(B) * P.hill(A, V.emax, V.ec50 * shift(B), V.n);
      const Bs = () => V.ant === 'none' ? [0] : [0, V.b, 10 * V.b, 100 * V.b];
      const Blabel = (B, i) => i === 0 ? 'agonist alone' : '+ ' + nM(kit, B) + ' antagonist';

      function runExp() {
        if (V.ant === 'none') { exp = null; return; }
        const r = rng(seed++);
        const curves = Bs().map(B => {
          const ec = V.ec50 * shift(B), c0 = Math.log10(ec);
          const pts = [];
          for (let lg = c0 - 2; lg <= c0 + 2.01; lg += 0.5) { const A = Math.pow(10, lg); pts.push([A, Math.max(0, resp(A, B) + 3 * gauss(r))]); }
          // fit log EC50 by a 1-D search, with the best maximum for each trial EC50 (linear least squares); n known
          let best = ec, bestS = Infinity, bestE = V.emax;
          for (let lg = c0 - 1.5; lg <= c0 + 1.5; lg += 0.005) {
            const e = Math.pow(10, lg); let sy = 0, sh = 0;
            const hs = pts.map(([A]) => P.hill(A, 1, e, V.n));
            pts.forEach(([, y], i) => { sy += y * hs[i]; sh += hs[i] * hs[i]; });
            const em = sh > 0 ? sy / sh : 0; let s = 0;
            pts.forEach(([, y], i) => { s += (em * hs[i] - y) * (em * hs[i] - y); });
            if (s < bestS) { bestS = s; best = e; bestE = em; }
          }
          return { B, pts, ec: best, em: bestE };
        });
        const schild = [];
        for (let i = 1; i < curves.length; i++) { const dr = curves[i].ec / curves[0].ec; if (dr > 1.05) schild.push([Math.log10(curves[i].B * 1e-9), Math.log10(dr - 1)]); }
        const f = linfit(schild);
        exp = { curves, schild, fit: f, pA2: f && Math.abs(f.slope) > 1e-6 ? f.icpt / f.slope : NaN };
      }

      function draw() {
        const bs = Bs(), top = V.ec50 * shift(bs[bs.length - 1]);
        const xmin = clamp(V.ec50 / 1000, 1e-3, 1e6), xmax = clamp(top * 1000, V.ec50 * 100, 1e9);
        const xs = logspace(xmin, xmax, 140);
        const series = bs.map((B, i) => ({ pts: xs.map(A => [A, resp(A, B)]), label: Blabel(B, i), width: i ? 2 : 2.8, dash: i ? [6, 3] : undefined }));
        if (exp) exp.curves.forEach((c, i) => series.push({ pts: c.pts, label: i ? undefined : 'measured (with noise)', line: false, dots: 3.5 }));
        pC.set({ x: { label: 'agonist concentration (nM)', log: true, min: xmin, max: xmax }, series, marks: [{ x: V.A, y: resp(V.A, V.ant === 'none' ? 0 : V.b), label: 'your [A]' }], hlines: [{ y: V.emax, label: 'agonist maximum' }] });

        // the Schild plot
        const pKB = -Math.log10(V.kb * 1e-9), sS = [];
        if (V.ant === 'comp' || V.ant === 'allo') {
          const line = logspace(V.b / 3, 300 * V.b, 60).map(B => [Math.log10(B * 1e-9), Math.log10(Math.max(1e-9, shift(B) - 1))]);
          sS.push({ pts: line, label: V.ant === 'comp' ? 'theory: slope 1' : 'theory: bends towards log(1/α − 1)' });
          sS.push({ pts: bs.slice(1).map(B => [Math.log10(B * 1e-9), Math.log10(shift(B) - 1)]), label: 'the three concentrations', line: false, dots: 4.5 });
          if (exp && exp.schild.length) {
            sS.push({ pts: exp.schild, label: 'measured', line: false, dots: 4 });
            if (exp.fit) { const x0 = exp.schild[0][0] - 0.5, x1 = exp.schild[exp.schild.length - 1][0] + 0.5; sS.push({ pts: [[x0, exp.fit.icpt + exp.fit.slope * x0], [x1, exp.fit.icpt + exp.fit.slope * x1]], label: 'fitted line', dash: [5, 4], width: 1.6 }); }
          }
          pS.set({ series: sS, hlines: [{ y: 0, label: 'DR = 2' }], vlines: [{ x: -pKB, label: 'log K_B' }] });
        } else pS.set({ series: [{ pts: [[-10, 0], [-6, 0]], label: V.ant === 'none' ? 'choose an antagonist' : 'no shift: DR = 1, log(DR − 1) undefined', dash: [2, 4], width: 1 }], hlines: [], vlines: [] });

        const drs = bs.slice(1).map(B => shift(B));
        ro.set('dr', V.ant === 'none' ? '—' : drs.map(d => kit.fmt(d, 3)).join(' / ') + (V.ant === 'noncomp' ? ' — the maximum falls instead' : ''));
        ro.set('pa2', V.ant === 'none' ? '—' : pKB.toFixed(2) + (V.ant === 'noncomp' ? ' (not measurable by Schild)' : ''));
        if (exp && exp.fit) ro.set('fit', 'slope ' + exp.fit.slope.toFixed(2) + ', pA₂ ' + (Number.isFinite(exp.pA2) ? exp.pA2.toFixed(2) : '—'));
        else ro.set('fit', V.ant === 'noncomp' && exp ? 'curves did not shift — maxima ' + exp.curves.map(c => c.em.toFixed(0)).join(' / ') + ' %' : 'run an experiment');
        const B = V.ant === 'none' ? 0 : V.b, xA = V.A / V.ec50, xB = B / V.kb;
        const occA = V.ant === 'comp' ? xA / (1 + xA + xB) : V.ant === 'allo' ? (xA + ALPHA * xA * xB) / (1 + xA + xB + ALPHA * xA * xB) : xA / (1 + xA);
        const occB = V.ant === 'comp' ? xB / (1 + xA + xB) : V.ant === 'allo' ? (xB + ALPHA * xA * xB) / (1 + xA + xB + ALPHA * xA * xB) : V.ant === 'noncomp' ? xB / (1 + xB) : 0;
        ro.set('occ', pct(100 * occA) + ' / ' + pct(100 * occB));
        ro.set('eff', pct(resp(V.A, 0)) + ' → ' + pct(resp(V.A, B)));
        weights = V.ant === 'comp' ? [1, xA, xB, 0] : V.ant === 'allo' ? [1, xA, xB, ALPHA * xA * xB] : V.ant === 'noncomp' ? [1, xA, xB, xA * xB] : [1, xA, 0, 0];
        loop.once();
      }

      // receptors on a membrane: each re-samples its state from the equilibrium distribution
      const NR = 24, rec = Array.from({ length: NR }, () => ({ a: false, b: false })), rr = rng(3);
      let weights = [1, 0, 0, 0];
      const sample = () => { const s = weights[0] + weights[1] + weights[2] + weights[3], u = rr() * s; return u < weights[0] ? 0 : u < weights[0] + weights[1] ? 1 : u < weights[0] + weights[1] + weights[2] ? 2 : 3; };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        for (const r of rec) if (rr() < 1 - Math.exp(-2 * dt) || dt === 0) { const k = sample(); r.a = k === 1 || k === 3; r.b = k === 2 || k === 3; }
        const barW = Math.min(150, W * 0.2), x0 = 16, x1 = W - barW - 30, my = Hh * 0.62;
        c.fillStyle = C.dark ? 'hsl(40 40% 30% / .5)' : 'hsl(40 60% 80% / .7)'; c.fillRect(x0, my - 6, x1 - x0, 20);
        kit.label(c, 'cell membrane', x0 + 4, my + 26, { align: 'left', size: 11, color: C.muted });
        const nShow = clamp(Math.floor((x1 - x0) / 24), 6, NR), step = (x1 - x0) / nShow, allo = V.ant === 'allo' || V.ant === 'noncomp';
        rec.slice(0, nShow).forEach((r, i) => {
          const cx = x0 + step * (i + 0.5), cy = my - 8;
          c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - 8, cy - 14); c.lineTo(cx - 8, cy + 4); c.lineTo(cx + 8, cy + 4); c.lineTo(cx + 8, cy - 14); c.stroke();
          const active = r.a && !(V.ant === 'noncomp' && r.b);
          if (r.a) kit.dot(c, cx, cy - 7, 5.5, active ? C.ok : C.faint);
          if (r.b && !allo) { c.fillStyle = C.bad; c.fillRect(cx - 5.5, cy - 12.5, 11, 11); }
          if (r.b && allo) { c.fillStyle = C.bad; c.beginPath(); c.moveTo(cx + 9, cy - 4); c.lineTo(cx + 17, cy - 10); c.lineTo(cx + 17, cy + 2); c.fill(); }
          if (active) { c.strokeStyle = C.ok; c.lineWidth = 1.5; c.beginPath(); c.moveTo(cx, cy + 6); c.lineTo(cx, cy + 20); c.stroke(); }
        });
        kit.label(c, 'agonist [A] = ' + nM(kit, V.A) + (V.ant !== 'none' ? ',  antagonist [B] = ' + nM(kit, V.b) : ''), x0, 14, { align: 'left', size: 12, weight: 700, color: C.text });
        // response bar
        const bx = W - barW - 14, by = 22, bh = Hh - 44, e = resp(V.A, V.ant === 'none' ? 0 : V.b), e0 = resp(V.A, 0);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(bx, by, 26, bh);
        c.fillStyle = C.accent; c.fillRect(bx + 1, by + bh * (1 - e / 100), 24, bh * e / 100);
        c.strokeStyle = C.text; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(bx - 4, by + bh * (1 - e0 / 100)); c.lineTo(bx + 30, by + bh * (1 - e0 / 100)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'response ' + e.toFixed(0) + ' %', bx + 34, by + bh * (1 - e / 100), { align: 'left', size: 12, weight: 700, color: C.text });
        kit.label(c, 'alone: ' + e0.toFixed(0) + ' %', bx + 34, by + bh * (1 - e0 / 100) + 15, { align: 'left', size: 11, color: C.muted });
      }, box.stage);
      draw();
      loop.start();
    }
  });

  /* ================================================================ pd-reserve */
  Hyper.sim('pd-reserve', {
    title: 'Receptor reserve: occupancy is not response',
    blurb: `The operational model of Black and Leff: an agonist occupies receptors according to its affinity K_A (dashed curve), but the response (solid) runs far ahead of occupancy when the signal is amplified — the transducer ratio τ combines the drug's efficacy with the number of receptors. The picture shows 100 receptors (grey crosses: destroyed by an irreversible antagonist; filled: occupied), the amplifying cascade and the response.

**Try this**
- With τ = 20, find the concentration giving half the maximal response: only about 5 % of the receptors are occupied — the rest are "spare".
- Lower τ below 1: the agonist becomes partial; its maximum falls and EC₅₀ moves towards K_A.
- Destroy receptors with the slider (or show Furchgott's series): with a big reserve the curve first shifts right with its maximum intact; only when few receptors remain does the maximum collapse.
- Keep τ fixed and change K_A: potency changes, the maximum does not.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 180 });
      const [g1] = plotGrid(box, 1);
      const ctl = kit.controls(box.side, [
        { id: 'KA', label: 'Agonist affinity K_A', min: 1, max: 10000, value: 1000, log: true, sig: 2, unit: 'nM' },
        { id: 'tau', label: 'Transducer ratio τ (efficacy × receptors)', min: 0.1, max: 100, value: 20, log: true, sig: 2 },
        { id: 'q', label: 'Receptors left (irreversible antagonist)', min: 1, max: 100, step: 1, value: 100, unit: '%' },
        { id: 'A', label: 'Agonist concentration', min: 0.1, max: 100000, value: 50, log: true, sig: 2, unit: 'nM' },
        { id: 'furch', type: 'check', label: 'Show Furchgott\'s series (100, 30, 10, 3 % left)', value: !!params.furch }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ec', 'EC₅₀ (and K_A ÷ EC₅₀)'], ['em', 'Maximal response'], ['p50', 'Occupancy needed for half-maximal response'], ['at', 'At your concentration: occupied → response'], ['kind', '']]);
      const plot = kit.plot(g1, { x: { label: 'agonist concentration (nM)', log: true }, y: { label: '% (of receptors / of system maximum)', min: 0, max: 102 }, legend: true }, 230);
      const E = (A, t) => 100 * t * A / (V.KA + (1 + t) * A);
      const occ = A => A / (A + V.KA);
      // a fixed shuffled order, so the same receptors stay destroyed as q changes
      const r0 = rng(11), order = Array.from({ length: 100 }, (_, i) => i);
      for (let i = 99; i > 0; i--) { const j = Math.floor(r0() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; }
      const dead = new Array(100).fill(false), bound = new Array(100).fill(false), rr = rng(5);
      let tq = 20;
      function draw() {
        tq = V.tau * V.q / 100;
        const xmin = V.KA / 1e4, xmax = V.KA * 100, xs = logspace(xmin, xmax, 140);
        const series = [{ pts: xs.map(A => [A, 100 * occ(A)]), label: 'receptors occupied', dash: [6, 4], width: 2 }, { pts: xs.map(A => [A, E(A, tq)]), label: 'response (' + V.q + ' % of receptors)', width: 2.8 }];
        if (V.furch) [100, 30, 10, 3].filter(q => q !== V.q).forEach(q => series.push({ pts: xs.map(A => [A, E(A, V.tau * q / 100)]), label: q + ' % left', width: 1.3, dash: [3, 3] }));
        const ec = V.KA / (1 + tq);
        plot.set({ x: { label: 'agonist concentration (nM)', log: true, min: xmin, max: xmax }, series, marks: [{ x: V.A, y: 100 * occ(V.A), label: 'occupied' }, { x: V.A, y: E(V.A, tq), label: 'response' }], vlines: [{ x: V.KA, label: 'K_A' }, { x: ec, label: 'EC₅₀' }] });
        const em = 100 * tq / (1 + tq);
        ro.set('ec', nM(kit, ec) + '  (' + kit.fmt(1 + tq, 3) + '× below K_A)');
        ro.set('em', pct(em, 1) + ' of the system maximum');
        ro.set('p50', pct(100 / (2 + tq), 1));
        ro.set('at', pct(100 * occ(V.A), 1) + ' → ' + pct(E(V.A, tq), 1));
        ro.set('kind', em >= 90 ? 'behaves as a full agonist here' : em >= 20 ? 'a partial agonist in this tissue' : 'barely active — nearly an antagonist of full agonists');
        for (let i = 0; i < 100; i++) dead[order[i]] = i >= V.q;
        loop.once();
      }
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const f = occ(V.A);
        for (let i = 0; i < 100; i++) if (rr() < 1 - Math.exp(-3 * dt) || dt === 0) bound[i] = !dead[i] && rr() < f;
        const cell = Math.max(8, Math.min(16, (Hh - 40) / 10)), gx = 16, gy = 26;
        let nb = 0;
        for (let i = 0; i < 100; i++) {
          const x = gx + (i % 10) * cell + cell / 2, y = gy + Math.floor(i / 10) * cell + cell / 2;
          if (dead[i]) { c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x - 3, y - 3); c.lineTo(x + 3, y + 3); c.moveTo(x + 3, y - 3); c.lineTo(x - 3, y + 3); c.stroke(); continue; }
          if (bound[i]) { nb++; kit.dot(c, x, y, cell * 0.36, C.accent); } else { c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.arc(x, y, cell * 0.33, 0, 6.283); c.stroke(); }
        }
        kit.label(c, nb + ' of ' + V.q + ' receptors occupied', gx, 12, { align: 'left', size: 12, weight: 700, color: C.text });
        // the amplifying cascade: G-proteins and second messengers
        const e = E(V.A, tq), mx = gx + cell * 10 + 30, mw = Math.max(60, W - mx - 150);
        kit.arrow(c, mx, Hh / 2, mx + mw * 0.25, Hh / 2, C.muted, 2);
        const nG = Math.round(Math.min(40, nb * 4)), nM2 = Math.round(e * 0.6);
        c.fillStyle = C.series[1]; for (let i = 0; i < nG; i++) { const x = mx + mw * 0.3 + (i % 5) * 7, y = Hh / 2 - 30 + Math.floor(i / 5) * 7; c.fillRect(x, y, 5, 5); }
        c.fillStyle = C.series[2]; for (let i = 0; i < nM2; i++) { const x = mx + mw * 0.55 + (i % 10) * 5, y = Hh / 2 - 28 + Math.floor(i / 10) * 8; c.beginPath(); c.arc(x, y, 1.8, 0, 6.283); c.fill(); }
        kit.label(c, 'G-proteins', mx + mw * 0.3, Hh / 2 + 40, { align: 'left', size: 11, color: C.muted });
        kit.label(c, 'second messengers', mx + mw * 0.55, Hh / 2 + 40, { align: 'left', size: 11, color: C.muted });
        const bx = W - 60, by = 20, bh = Hh - 40;
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(bx, by, 22, bh);
        c.fillStyle = C.ok; c.fillRect(bx + 1, by + bh * (1 - e / 100), 20, bh * e / 100);
        kit.label(c, e.toFixed(0) + ' %', bx + 11, by - 8, { align: 'center', size: 12, weight: 700, color: C.text });
        kit.label(c, 'response', bx + 11, by + bh + 12, { align: 'center', size: 11, color: C.muted });
      }, box.stage);
      draw();
      loop.start();
    }
  });

  /* ================================================================ pd-window */
  Hyper.sim('pd-window', {
    title: 'The therapeutic window',
    blurb: `A hypothetical medicine seen two ways. **Left:** across a population, the share of people helped (green) and harmed (red) at each plasma concentration — log-normal sensitivities with the spread σ you choose. The window runs from the level that helps 80 % of people to the level that harms 5 %. **Right:** one person's level over six days of a dosing regimen (kit.med.pk, volume of distribution 40 L), against that window. The strip above follows the level through time.

**Try this**
- Keep the medians (and so the therapeutic index) fixed and widen the spread σ: the window shrinks and then vanishes — toxicity begins before most people are helped.
- Give the same daily dose as one large dose every 24 h, then as small doses every 6 h, then as a continuous infusion: the average level is the same, but the swings leave the window.
- Shorten the half-life to 3 h with 12-hourly dosing: the trough falls out of the window. The longest interval that fits is t½ · log₂(MTC/MEC).
- Double the dose: the level doubles — and time above the toxic line appears.`,
    mount(box, kit) {
      const P = kit.pharma, M = kit.med, VD = 40;
      const st = kit.stage(box.stage, { aspect: 0.18, minH: 120 });
      const [g1, g2] = plotGrid(box, 2);
      const ctl = kit.controls(box.side, [
        { id: 'ec50', label: 'Median effective concentration', min: 1, max: 50, value: 5, log: true, sig: 2, unit: 'mg/L' },
        { id: 'tc50', label: 'Median toxic concentration', min: 5, max: 500, value: 60, log: true, sig: 2, unit: 'mg/L' },
        { id: 's', label: 'Spread between people σ (log₁₀ units)', min: 0.05, max: 0.5, step: 0.01, value: 0.2 },
        { id: 'dose', label: 'Dose', min: 25, max: 2000, value: 400, log: true, sig: 2, unit: 'mg' },
        { id: 'tau', label: 'Dosing interval', min: 4, max: 48, step: 1, value: 12, unit: 'h' },
        { id: 'th', label: 'Half-life', min: 1, max: 48, value: 10, log: true, sig: 2, unit: 'h' },
        { id: 'route', type: 'select', label: 'How it is given', options: [['Oral doses (absorbed within about an hour)', 'oral'], ['IV bolus doses', 'iv'], ['Continuous infusion, same daily dose', 'inf']], value: 'oral' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ti', 'Therapeutic index TC₅₀/EC₅₀'], ['csf', 'Certain safety factor TC₁/EC₉₉'], ['win', 'Window (80 % helped → 5 % harmed)'], ['pt', 'Day 6: peak / trough'], ['in', 'Day 6: time in / below / above window'], ['tmax', 'Longest interval that fits the window']]);
      const pQ = kit.plot(g1, { x: { label: 'plasma concentration (mg/L)', log: true }, y: { label: 'people (%)', min: 0, max: 100 }, legend: true }, 220);
      const pT = kit.plot(g2, { x: { label: 'time (days)', min: 0, max: 6 }, y: { label: 'concentration (mg/L)', min: 0 }, legend: true }, 220);
      const helped = C => 100 * ncdf(Math.log10(Math.max(C, 1e-9) / V.ec50) / V.s);
      const harmed = C => 100 * ncdf(Math.log10(Math.max(C, 1e-9) / V.tc50) / V.s);
      let prof = [], MEC = 1, MTC = 2;
      function draw() {
        const C = kit.colors();
        MEC = V.ec50 * Math.pow(10, 0.8416 * V.s); MTC = V.tc50 * Math.pow(10, -1.6449 * V.s);
        const lo = Math.min(V.ec50, V.tc50) / 30, hi = Math.max(V.ec50, V.tc50) * 30, xs = logspace(lo, hi, 160);
        const ok = MEC < MTC;
        pQ.set({ x: { label: 'plasma concentration (mg/L)', log: true, min: lo, max: hi }, series: [{ pts: xs.map(c => [c, helped(c)]), label: 'helped', color: C.ok, width: 2.6 }, { pts: xs.map(c => [c, harmed(c)]), label: 'harmed', color: C.bad, width: 2.6 }],
          vlines: [{ x: MEC, label: 'MEC' }, { x: MTC, label: 'MTC' }], hlines: [{ y: 80 }, { y: 5 }] });
        const doses = [];
        for (let t = 0; t < 144 - 1e-9; t += V.tau) doses.push(V.route === 'inf' ? { t, amount: V.dose, route: 'infusion', duration: V.tau } : { t, amount: V.dose, route: V.route === 'oral' ? 'oral' : 'iv', ka: 1.5, F: 1 });
        const pk = M.pk({ halfLife: V.th, Vd: VD, doses });
        prof = []; for (let t = 0; t <= 144.0001; t += 0.25) prof.push([t, pk.at(t)]);
        pT.set({ series: [{ pts: prof.map(p => [p[0] / 24, p[1]]), label: 'plasma level', width: 2.4 }], hlines: [{ y: MEC, label: 'MEC', color: C.ok }, { y: MTC, label: 'MTC', color: C.bad }] });
        const last = prof.filter(p => p[0] >= 120);
        let pk6 = 0, tr6 = Infinity, nin = 0, nlo = 0, nhi = 0;
        for (const [, c] of last) { pk6 = Math.max(pk6, c); tr6 = Math.min(tr6, c); if (c < MEC) nlo++; else if (c > MTC) nhi++; else nin++; }
        const n = Math.max(1, last.length);
        ro.set('ti', kit.fmt(P.ti(V.tc50, V.ec50), 3));
        ro.set('csf', kit.fmt(P.ti(V.tc50, V.ec50) * Math.pow(10, -2 * 2.326 * V.s), 3));
        ro.set('win', ok ? kit.fmt(MEC, 3) + ' – ' + kit.fmt(MTC, 3) + ' mg/L (×' + kit.fmt(MTC / MEC, 2) + ')' : 'none — harm starts before 80 % are helped');
        ro.set('pt', kit.fmt(pk6, 3) + ' / ' + kit.fmt(tr6, 3) + ' mg/L');
        ro.set('in', ok ? pct(100 * nin / n) + ' / ' + pct(100 * nlo / n) + ' / ' + pct(100 * nhi / n) : '—');
        ro.set('tmax', ok ? kit.fmt(V.th * Math.log2(MTC / MEC), 3) + ' h (repeated IV doses)' : '—');
        loop.once();
      }
      let clock = 0;
      const loop = kit.loop((dt) => {
        clock = (clock + dt * 12) % 144;                               // half a day per second
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const i = Math.min(prof.length - 1, Math.round(clock / 0.25)), lev = prof.length ? prof[i][1] : 0;
        // a horizontal log concentration scale with the zones
        const x0 = 20, x1 = W - 20, y = Hh * 0.45, lo = Math.min(V.ec50, V.tc50) / 30, hi = Math.max(V.ec50, V.tc50) * 30;
        const X = v => x0 + (x1 - x0) * clamp(Math.log(v / lo) / Math.log(hi / lo), 0, 1);
        c.globalAlpha = 0.28;
        c.fillStyle = C.faint; c.fillRect(x0, y - 10, X(Math.min(MEC, MTC)) - x0, 20);
        if (MEC < MTC) { c.fillStyle = C.ok; c.fillRect(X(MEC), y - 10, X(MTC) - X(MEC), 20); }
        c.fillStyle = C.bad; c.fillRect(X(MTC), y - 10, x1 - X(MTC), 20);
        c.globalAlpha = 1;
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(x0, y - 10, x1 - x0, 20);
        const px = X(Math.max(lev, lo));
        c.fillStyle = C.text; c.beginPath(); c.moveTo(px, y - 12); c.lineTo(px - 7, y - 24); c.lineTo(px + 7, y - 24); c.fill();
        const zone = lev < MEC ? 'below the window' : lev > MTC ? 'above the window — toxicity likely' : 'inside the window';
        kit.label(c, 'day ' + (clock / 24).toFixed(1) + ':  ' + kit.fmt(lev, 3) + ' mg/L — ' + zone, x0, 14, { align: 'left', size: 12, weight: 700, color: lev > MTC ? C.bad : lev < MEC ? C.muted : C.ok });
        kit.label(c, 'at this level ' + helped(lev).toFixed(0) + ' % of people would be helped and ' + harmed(lev).toFixed(1) + ' % harmed', x0, y + 26, { align: 'left', size: 11.5, color: C.muted });
        kit.label(c, 'MEC', X(MEC), y + 14, { align: 'center', size: 10, color: C.muted, baseline: 'top' });
        kit.label(c, 'MTC', X(MTC), y + 14, { align: 'center', size: 10, color: C.muted, baseline: 'top' });
      }, box.stage);
      draw();
      loop.start();
    }
  });

  /* ================================================================ pd-hysteresis */
  Hyper.sim('pd-hysteresis', {
    title: 'Effect lags behind concentration: hysteresis',
    blurb: `A hypothetical intravenous drug. Its plasma level (blue tank) falls with the elimination half-life; a small effect compartment (right tank) fills from the plasma with the equilibration rate constant k_e0, and the effect follows the effect-site level through an Emax curve (EC₅₀ = 1 mg/L). The left plot shows both levels over time, the right plot the effect against the **plasma** level, joined in time order — the hysteresis loop. With acute tolerance switched on, the body raises the EC₅₀ as it is exposed.

**Try this**
- Lengthen the equilibration half-time from 1 to 20 minutes: the effect peaks later, and the loop opens **anticlockwise** — more effect on the way down than on the way up at the same plasma level.
- Make equilibration very fast (0.2 min): the loop collapses onto the dashed equilibrium curve — the effect now follows plasma directly.
- Switch on tolerance with fast equilibration: the loop turns **clockwise**. With both, the two effects fight.
- Give the dose as a 10-minute infusion instead of a bolus, and compare the time of peak effect.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.28, minH: 170 });
      const [g1, g2] = plotGrid(box, 2);
      const ctl = kit.controls(box.side, [
        { id: 'th', label: 'Plasma half-life', min: 10, max: 240, value: 60, log: true, sig: 2, unit: 'min' },
        { id: 'te', label: 'Effect-site equilibration half-time', min: 0.2, max: 60, value: params.tol ? 0.5 : 8, log: true, sig: 2, unit: 'min' },
        { id: 'n', label: 'Hill slope', min: 1, max: 4, step: 0.5, value: 2 },
        { id: 'route', type: 'select', label: 'Dose given as', options: [['IV bolus', 'bolus'], ['10-minute infusion', 'inf']], value: 'bolus' },
        { id: 'tol', type: 'check', label: 'Acute tolerance', value: !!params.tol },
        { id: 'ttol', label: 'Tolerance develops with half-time', min: 5, max: 120, value: 20, log: true, sig: 2, unit: 'min' }
      ], () => compute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['pk', 'Peak plasma / peak effect'], ['lag', 'Effect lags plasma by'], ['loop', 'Hysteresis loop'], ['ke0', 'k_e0'], ['now', 'Now: plasma / effect site / effect']]);
      const pT = kit.plot(g1, { x: { label: 'time (min)', min: 0 }, y: { label: 'concentration (mg/L)', min: 0 }, legend: true }, 220);
      const pL = kit.plot(g2, { x: { label: 'plasma concentration (mg/L)', min: 0 }, y: { label: 'effect (% of maximum)', min: 0, max: 100 }, legend: true }, 220);
      const C0 = 4, EC50 = 1, KTOL = 1;
      let sim = [], T = 300;
      function compute() {
        const k = Math.LN2 / V.th, ke0 = Math.LN2 / V.te, kt = Math.LN2 / V.ttol, dt = 0.02;
        T = clamp(5 * V.th, 120, 600);
        let Cp = V.route === 'bolus' ? C0 : 0, Ce = 0, Mo = 0, t = 0, next = 0, tpC = 0, tpE = 0, bestC = -1, bestE = -1;
        const every = T / 400; sim = [];
        const eff = (ce, m) => { const e50 = EC50 * (1 + (V.tol ? m / KTOL : 0)); return 100 * Math.pow(ce, V.n) / (Math.pow(e50, V.n) + Math.pow(ce, V.n)); };
        while (t <= T + 1e-9) {
          if (t >= next - 1e-9) { sim.push({ t, Cp, Ce, E: eff(Ce, Mo) }); next += every; }
          for (let s = 0; s < 5; s++) {                              // fixed sub-steps of dt (min)
            const input = V.route === 'inf' && t < 10 ? C0 / 10 : 0;
            const dCp = input - k * Cp, dCe = ke0 * (Cp - Ce), dM = kt * (Ce - Mo);
            Cp = Math.max(0, Cp + dCp * dt); Ce = Math.max(0, Ce + dCe * dt); Mo = Math.max(0, Mo + dM * dt); t += dt;
            const e = eff(Ce, Mo);
            if (Cp > bestC) { bestC = Cp; tpC = t; }
            if (e > bestE) { bestE = e; tpE = t; }
          }
        }
        if (V.route === 'bolus') tpC = 0;
        const cmax = Math.max(...sim.map(p => p.Cp), 1e-9);
        pT.set({ x: { label: 'time (min)', min: 0, max: T }, series: [{ pts: sim.map(p => [p.t, p.Cp]), label: 'plasma', width: 2.4 }, { pts: sim.map(p => [p.t, p.Ce]), label: 'effect site', width: 2.4, dash: [6, 3] }] });
        const cs = logspace(0.01, cmax, 80);
        pL.set({ x: { label: 'plasma concentration (mg/L)', min: 0, max: cmax * 1.05 }, series: [{ pts: sim.map(p => [p.Cp, p.E]), label: 'effect against plasma level' }, { pts: cs.map(c => [c, 100 * Math.pow(c, V.n) / (Math.pow(EC50, V.n) + Math.pow(c, V.n))]), label: 'if in equilibrium, no tolerance', dash: [4, 4], width: 1.3 }] });
        // after the peak effect, is the effect above (delay: anticlockwise) or below (tolerance: clockwise) the equilibrium curve?
        const eq = c => 100 * Math.pow(c, V.n) / (Math.pow(EC50, V.n) + Math.pow(c, V.n));
        const late = sim.filter(p => p.t >= tpE && p.E > 5);
        const dev = late.length ? late.reduce((s, p) => s + p.E - eq(p.Cp), 0) / late.length : 0;
        ro.set('pk', kit.fmt(tpC, 3) + ' min / ' + kit.fmt(tpE, 3) + ' min');
        ro.set('lag', kit.fmt(Math.max(0, tpE - tpC), 3) + ' min');
        ro.set('loop', Math.abs(dev) < 1.5 ? 'almost closed — the effect follows plasma' : dev > 0 ? 'anticlockwise — a delay (+' + dev.toFixed(0) + ' points on the way down)' : 'clockwise — adaptation (' + dev.toFixed(0) + ' points on the way down)');
        ro.set('ke0', kit.fmt(ke0, 3) + ' per min (t½ ' + kit.fmt(V.te, 2) + ' min)');
        clock = 0;
        loop.once();
      }
      let clock = 0;
      const loop = kit.loop((dt) => {
        clock = (clock + dt * T / 12) % (T + 1e-9);                     // the whole run in 12 s
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (!sim.length) return;
        const p = sim[Math.min(sim.length - 1, Math.round(clock / T * (sim.length - 1)))];
        ro.set('now', kit.fmt(p.Cp, 3) + ' / ' + kit.fmt(p.Ce, 3) + ' mg/L / ' + p.E.toFixed(0) + ' %');
        const tank = (x, y, w, h, lev, col, lab) => {
          const f = clamp(lev / C0, 0, 1);
          c.fillStyle = col; c.globalAlpha = 0.45; c.fillRect(x, y + h * (1 - f), w, h * f); c.globalAlpha = 1;
          c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(x, y, w, h);
          kit.label(c, lab, x + w / 2, y + h + 13, { align: 'center', size: 11.5, color: C.muted });
          kit.label(c, kit.fmt(lev, 2) + ' mg/L', x + w / 2, y - 9, { align: 'center', size: 12, weight: 700, color: C.text });
        };
        const h = Hh - 60, y = 26;
        tank(24, y, 70, h, p.Cp, C.series[0], 'plasma');
        kit.arrow(c, 102, y + h * 0.6, 142, y + h * 0.6, C.muted, 2);
        kit.label(c, 'k_e0', 122, y + h * 0.6 - 12, { align: 'center', size: 11, color: C.muted });
        tank(150, y + h * 0.35, 34, h * 0.65, p.Ce, C.series[1], 'effect site');
        kit.label(c, 't = ' + p.t.toFixed(0) + ' min', 24, 11, { align: 'left', size: 12, weight: 700, color: C.text });
        // an effect monitor: the effect trace so far
        const mx = 220, mw = W - mx - 20, my = y, mh = h;
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(mx, my, mw, mh);
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath();
        let first = true;
        for (const q of sim) { if (q.t > p.t) break; const X = mx + mw * q.t / T, Y = my + mh * (1 - q.E / 100); if (first) { c.moveTo(X, Y); first = false; } else c.lineTo(X, Y); }
        c.stroke();
        kit.label(c, 'effect ' + p.E.toFixed(0) + ' %', mx + 8, my + 14, { align: 'left', size: 12, weight: 700, color: C.ok });
      }, box.stage);
      compute();
      loop.start();
    }
  });

  /* ================================================================ pd-interaction */
  Hyper.sim('pd-interaction', {
    title: 'A drug interaction, day by day',
    blurb: `A hypothetical "victim" medicine is taken every 12 hours (100 mg, half-life 12 h, volume 50 L) and sits in its window (1.5–7 mg/L). On day 7 a second medicine — the perpetrator — is started and later stopped (grey lines). A **reversible inhibitor** blocks the enzyme while it is present; a **mechanism-based inhibitor** destroys enzyme, which must be re-made; an **inducer** makes the liver produce more enzyme (up to ninefold). Integrated in fixed 3-minute steps. The right-hand plot is the static model: the steady-state AUC ratio against the fraction f_m of the victim's clearance through the enzyme.

**Try this**
- With a reversible inhibitor, lower f_m from 90 % to 30 %: the same inhibitor that sent the level to toxic heights now barely matters — the ceiling is 1/(1 − f_m).
- Compare the timing: a reversible inhibitor acts and wears off with its own half-life; a mechanism-based inhibitor and an inducer follow the enzyme's turnover — change the enzyme half-life and watch the onset and the offset stretch.
- Switch to the inducer: the level sinks below the window over a week or two — the victim medicine silently stops working — and recovers just as slowly after the inducer is stopped.
- Shorten the perpetrator course to 3 days: an inducer barely gets going; a mechanism-based inhibitor still leaves the enzyme depleted after it has gone.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.2, minH: 130 });
      const [g1, g2, g3] = plotGrid(box, 3, 250);
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Perpetrator', options: [['Reversible inhibitor', 'rev'], ['Mechanism-based (time-dependent) inhibitor', 'mbi'], ['Inducer', 'ind']], value: 'rev' },
        { id: 'fm', label: 'Victim cleared by that enzyme (f_m)', min: 0, max: 99, step: 1, value: 90, unit: '%' },
        { id: 'r', label: 'Perpetrator strength [I]/K', min: 0.1, max: 30, value: 5, log: true, sig: 2 },
        { id: 'tI', label: 'Perpetrator half-life', min: 2, max: 72, value: 8, log: true, sig: 2, unit: 'h' },
        { id: 'tE', label: 'Enzyme turnover half-life', min: 12, max: 96, value: 36, log: true, sig: 2, unit: 'h' },
        { id: 'days', label: 'Perpetrator taken for', min: 3, max: 14, step: 1, value: 10, unit: 'days' }
      ], () => compute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['aucr', 'Victim AUC ratio (dynamic, last day on both)'], ['stat', 'Static model prediction'], ['cls', 'Classification'], ['on', 'Onset: 90 % of the change after'], ['off', 'Offset: back within 10 % after']]);
      const pV = kit.plot(g1, { x: { label: 'time (days)', min: 0, max: 28 }, y: { label: 'victim level (mg/L)', min: 0 }, legend: true }, 210);
      const pE = kit.plot(g2, { x: { label: 'time (days)', min: 0, max: 28 }, y: { label: '% of normal / of steady state', min: 0 }, legend: true }, 210);
      const pS = kit.plot(g3, { x: { label: 'f_m (%)', min: 0, max: 100 }, y: { label: 'AUC ratio (log scale)', log: true, min: 0.05, max: 100 }, legend: true }, 210);
      const DOSE = 100, VD = 50, K0 = Math.LN2 / 12, CL0 = K0 * VD, KA = 1, MEC = 1.5, MTC = 7, T0 = 7 * 24;
      let rec = [], tStop = 0;
      const staticR = (type, fm, r) => {
        const x = r / (1 + r);
        if (type === 'rev') return 1 / (fm / (1 + r) + 1 - fm);
        if (type === 'mbi') return 1 / (fm / (1 + 20 * x) + 1 - fm);         // k_inact = 20 k_deg
        return 1 / (fm * (1 + 8 * x) + 1 - fm);                            // maximal induction ninefold
      };
      function compute() {
        const C = kit.colors();
        const fm = V.fm / 100, kI = Math.LN2 / V.tI, kdeg = Math.LN2 / V.tE, dt = 0.05;
        tStop = T0 + V.days * 24;
        let Ag = 0, Cv = 0, I = 0, E = 1, t = 0, nextDose = 0, nextRec = 0;
        rec = [];
        while (t <= 672 + 1e-9) {
          if (t >= nextDose - 1e-9) { Ag += DOSE; nextDose += 12; }
          const x = V.r * I, on = t >= T0 && t < tStop ? 1 : 0;
          const act = V.type === 'rev' ? E / (1 + x) : E;
          const clf = fm * act + 1 - fm;
          if (t >= nextRec - 1e-9) { rec.push({ t, Cv, I, E, act, clf }); nextRec += 0.5; }
          const dE = V.type === 'mbi' ? kdeg * (1 - E) - 20 * kdeg * x / (1 + x) * E : V.type === 'ind' ? kdeg * (1 + 8 * x / (1 + x) - E) : kdeg * (1 - E);
          const dAg = -KA * Ag, dCv = KA * Ag / VD - CL0 * clf / VD * Cv, dI = kI * (on - I);
          Ag += dAg * dt; Cv = Math.max(0, Cv + dCv * dt); I = Math.max(0, I + dI * dt); E = Math.max(0, E + dE * dt); t += dt;
        }
        const auc = (a, b) => { let s = 0; for (const p of rec) if (p.t >= a && p.t < b) s += p.Cv * 0.5; return s; };
        const base = auc(144, 168), during = auc(tStop - 24, tStop), R = base > 0 ? during / base : NaN;
        const days = rec.map(p => p.t / 24);
        pV.set({ series: [{ pts: rec.map((p, i) => [days[i], p.Cv]), label: 'victim level', width: 1.8 }], hlines: [{ y: MEC, label: 'MEC', color: C.ok }, { y: MTC, label: 'MTC', color: C.bad }], vlines: [{ x: T0 / 24, label: 'start' }, { x: tStop / 24, label: 'stop' }] });
        pE.set({ series: [{ pts: rec.map((p, i) => [days[i], 100 * p.act]), label: 'enzyme activity', width: 2.2 }, { pts: rec.map((p, i) => [days[i], 100 * p.I]), label: 'perpetrator level', dash: [5, 4], width: 1.5 }], vlines: [{ x: T0 / 24 }, { x: tStop / 24 }] });
        const fms = Array.from({ length: 100 }, (_, i) => i / 100);
        const S = [];
        for (const [r, lab, w] of [[V.r, 'your [I]/K = ' + kit.fmt(V.r, 2), 2.6], [V.r / 10, '[I]/K ÷ 10', 1.2], [V.r * 10, '[I]/K × 10', 1.2]]) S.push({ pts: fms.map(f => [f * 100, staticR(V.type, f, Math.min(300, r))]), label: lab, width: w, dash: w < 2 ? [4, 3] : undefined });
        const Rs = staticR(V.type, fm, V.r);
        pS.set({ series: S, marks: [{ x: V.fm, y: Rs, label: kit.fmt(Rs, 3) + '×' }], hlines: V.type === 'ind' ? [{ y: 0.2, label: 'strong (−80 %)' }, { y: 0.5, label: 'moderate' }] : [{ y: 5, label: 'strong (×5)' }, { y: 2, label: 'moderate' }] });
        // onset and offset of the change in clearance
        const atStop = rec.filter(p => p.t <= tStop).pop(), full = atStop ? atStop.clf - 1 : 0;
        let on90 = NaN, off10 = NaN;
        if (Math.abs(full) > 1e-3) {
          const a = rec.find(p => p.t >= T0 && Math.abs(p.clf - 1) >= 0.9 * Math.abs(full)); if (a) on90 = (a.t - T0) / 24;
          const b = rec.find(p => p.t >= tStop && Math.abs(p.clf - 1) <= 0.1 * Math.abs(full)); if (b) off10 = (b.t - tStop) / 24;
        }
        ro.set('aucr', Number.isFinite(R) ? kit.fmt(R, 3) + '×' : '—');
        ro.set('stat', kit.fmt(Rs, 3) + '×  (ceiling ' + (V.type === 'ind' ? '—' : kit.fmt(1 / Math.max(0.01, 1 - fm), 3) + '×') + ')');
        ro.set('cls', V.type === 'ind' ? (R <= 0.2 ? 'strong inducer' : R <= 0.5 ? 'moderate inducer' : R <= 0.8 ? 'weak inducer' : 'no meaningful induction') : (R >= 5 ? 'strong inhibitor' : R >= 2 ? 'moderate inhibitor' : R >= 1.25 ? 'weak inhibitor' : 'no meaningful inhibition') + ' (with this victim)');
        ro.set('on', Number.isFinite(on90) ? kit.fmt(on90, 2) + ' days' : 'not reached while taken');
        ro.set('off', Number.isFinite(off10) ? kit.fmt(off10, 2) + ' days' : 'beyond day 28');
        loop.once();
      }
      let clock = 0;
      const loop = kit.loop((dt) => {
        clock = (clock + dt * 48) % 672;                               // two days a second
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (!rec.length) return;
        const p = rec[Math.min(rec.length - 1, Math.round(clock / 0.5))];
        const x0 = 16, x1 = W - 16, X = t => x0 + (x1 - x0) * t / 672, ty = 22;
        c.fillStyle = C.faint; c.globalAlpha = 0.35; c.fillRect(X(T0), ty - 6, X(tStop) - X(T0), 12); c.globalAlpha = 1;
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(x0, ty - 6, x1 - x0, 12);
        kit.dot(c, X(clock), ty, 6, C.accent);
        kit.label(c, 'day ' + (clock / 24).toFixed(1) + (clock >= T0 && clock < tStop ? ' — perpetrator taken' : ''), x0, ty + 20, { align: 'left', size: 12, weight: 700, color: C.text });
        // enzymes in a liver cell: 20 at normal; inhibited ones marked, destroyed ones faint, induced ones extra
        const total = V.type === 'ind' ? Math.round(20 * p.E) : 20, alive = V.type === 'mbi' ? Math.round(20 * p.E) : total;
        const occ = V.type === 'rev' ? Math.round(alive * (V.r * p.I) / (1 + V.r * p.I)) : 0;
        const cx0 = x0, cy = Hh * 0.6, sz = Math.max(4, Math.min(14, (x1 - x0 - 16) / 66));
        for (let i = 0; i < Math.min(total, 180); i++) {
          const x = cx0 + 8 + (i % 60) * sz * 1.1, y = cy + Math.floor(i / 60) * sz * 1.1;
          if (i >= alive) { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(x, y, sz * 0.4, 0, 6.283); c.stroke(); continue; }
          kit.dot(c, x, y, sz * 0.4, C.series[2]);
          if (i < occ) kit.dot(c, x + sz * 0.3, y - sz * 0.3, sz * 0.2, C.bad);
        }
        kit.label(c, 'enzyme activity ' + (100 * p.act).toFixed(0) + ' % of normal · victim level ' + kit.fmt(p.Cv, 3) + ' mg/L' + (p.Cv > MTC ? ' — above the window' : p.Cv < MEC && clock > 48 ? ' — below the window' : ''), x0, Hh - 10, { align: 'left', size: 11.5, color: p.Cv > MTC ? C.bad : C.muted });
      }, box.stage);
      compute();
      loop.start();
    }
  });

  /* ================================================================ pd-genotype */
  Hyper.sim('pd-genotype', {
    title: 'Metaboliser phenotypes: one dose, four exposures',
    blurb: `A drug-metabolising enzyme with three kinds of allele: normal, **no function** and a **duplicated** gene (extra function). Hardy–Weinberg proportions turn the allele frequencies into the share of poor (PM), intermediate (IM), normal (NM) and ultrarapid (UM) metabolisers — the 100 people above. The plot shows one day at steady state of the same regimen (100 mg every 12 h, kit.med.pk) in a typical person of each phenotype, for an active drug the enzyme inactivates, or for a prodrug the enzyme activates (then the curves are the active metabolite). The band is a hypothetical window set around normal metabolisers.

**Try this**
- Raise the no-function allele frequency from 10 % to 30 %: poor metabolisers go from 1 in 100 to about 1 in 11 (q²).
- Lower f_m, the share of clearance through the enzyme: the four curves close up — genotype matters only for drugs that depend on the pathway.
- Switch to a prodrug: now the poor metabolisers get almost nothing and the ultrarapid metabolisers the most — the reverse of the active drug.
- Raise the duplication frequency, as in some North African and Middle Eastern populations: ultrarapid metabolisers become common.`,
    mount(box, kit) {
      const M = kit.med;
      const st = kit.stage(box.stage, { aspect: 0.2, minH: 140 });
      const [g1] = plotGrid(box, 1);
      const ctl = kit.controls(box.side, [
        { id: 'qn', label: 'No-function allele frequency', min: 0, max: 50, step: 1, value: 20, unit: '%' },
        { id: 'qd', label: 'Duplicated-gene frequency', min: 0, max: 15, step: 0.5, value: 3, unit: '%' },
        { id: 'fm', label: 'Clearance through the enzyme (in NM)', min: 0, max: 99, step: 1, value: 80, unit: '%' },
        { id: 'kind', type: 'select', label: 'The medicine is', options: [['An active drug, inactivated by the enzyme', 'active'], ['A prodrug, activated by the enzyme', 'prodrug']], value: 'active' }
      ], () => draw());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['freq', 'PM / IM / NM / UM'], ['carr', 'Carry a no-function allele'], ['exp', 'Exposure vs normal: PM / IM / UM'], ['out', 'People below / above the window']]);
      const plot = kit.plot(g1, { x: { label: 'time over one day at steady state (h)', min: 0, max: 24 }, y: { label: 'concentration (mg/L)', min: 0 }, legend: true }, 230);
      const PH = [['PM', 0], ['IM', 0.5], ['NM', 1], ['UM', 1.5]], VD = 60, TH = 8, CLNM = Math.LN2 * VD / TH, TMET = 3, DOSE = 100;
      let freqs = [0, 0, 1, 0];
      function draw() {
        const C = kit.colors(), cols = [C.bad, C.warn, C.ok, C.series[0]];
        const qn = V.qn / 100, qd = Math.min(V.qd / 100, 1 - qn), p = Math.max(0, 1 - qn - qd), fm = V.fm / 100;
        freqs = [qn * qn, 2 * qn * p, p * p + 2 * qn * qd, 2 * p * qd + qd * qd];
        const series = [], avgs = [];
        PH.forEach(([name, a], i) => {
          const clf = fm * a + 1 - fm, CL = CLNM * Math.max(clf, 1e-3), half = Math.LN2 * VD / CL, kpar = CL / VD;
          // enough doses to reach steady state (seven half-lives), then one day is shown
          const nd = Math.min(400, Math.ceil(7 * Math.max(half, TMET) / 12) + 2), t0 = (nd - 2) * 12;
          const doses = []; for (let j = 0; j < nd; j++) doses.push({ t: j * 12, amount: DOSE, route: 'oral', ka: 1.2, F: 1 });
          let at;
          if (V.kind === 'active') at = M.pk({ halfLife: half, Vd: VD, doses }).at;
          else {
            // the active metabolite: formed at the rate the parent is cleared through the enzyme (formation-limited)
            const fconv = clf > 0 ? fm * a / clf : 0;
            at = M.pk({ halfLife: TMET, Vd: VD, doses: doses.map(d => ({ t: d.t, amount: fconv * DOSE, route: 'oral', ka: kpar, F: 1 })) }).at;
          }
          const pts = []; let s = 0;
          for (let t = 0; t <= 24.0001; t += 0.25) { const v = at(t0 + t); pts.push([t, v]); if (t < 24) s += v * 0.25; }
          avgs.push(s / 24);
          series.push({ pts, label: name + ' (' + (100 * freqs[i]).toFixed(1) + ' %)', color: cols[i], width: name === 'NM' ? 2.8 : 2 });
        });
        const ref = avgs[2] || 1e-9, MEC = 0.4 * ref, MTC = 2.5 * ref;
        plot.set({ series, hlines: [{ y: MEC, label: 'MEC' }, { y: MTC, label: 'MTC' }] });
        ro.set('freq', freqs.map(f => (100 * f).toFixed(1)).join(' / ') + ' %');
        ro.set('carr', pct(100 * (1 - (1 - qn) * (1 - qn)), 1));
        ro.set('exp', [0, 1, 3].map(i => kit.fmt(avgs[i] / ref, 3) + '×').join(' / '));
        let lo = 0, hi = 0; avgs.forEach((a, i) => { if (a < MEC) lo += freqs[i]; else if (a > MTC) hi += freqs[i]; });
        ro.set('out', pct(100 * lo, 1) + ' / ' + pct(100 * hi, 1));
        loop.once();
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, cols = [C.bad, C.warn, C.ok, C.series[0]];
        // 100 people by largest remainder
        const raw = freqs.map(f => f * 100), n = raw.map(Math.floor); let left = 100 - n.reduce((a, b) => a + b, 0);
        raw.map((r, i) => [r - Math.floor(r), i]).sort((a, b) => b[0] - a[0]).forEach(([, i]) => { if (left > 0) { n[i]++; left--; } });
        const cols20 = 25, sz = Math.min(18, (W * 0.62) / cols20), x0 = 16, y0 = 18;
        let k = 0;
        n.forEach((cnt, i) => { for (let j = 0; j < cnt; j++, k++) { const x = x0 + (k % cols20) * sz + sz / 2, y = y0 + Math.floor(k / cols20) * sz * 1.25 + sz / 2; kit.dot(c, x, y - sz * 0.22, sz * 0.2, cols[i]); c.fillStyle = cols[i]; c.fillRect(x - sz * 0.22, y - sz * 0.02, sz * 0.44, sz * 0.42); } });
        const lx = x0 + cols20 * sz + 24;
        PH.forEach(([name], i) => kit.label(c, name + ': ' + (100 * freqs[i]).toFixed(1) + ' %', lx, y0 + 8 + i * 20, { align: 'left', size: 12.5, weight: 700, color: cols[i] }));
        kit.label(c, V.kind === 'active' ? 'same dose — levels of the drug' : 'same dose — levels of the active metabolite', lx, y0 + 8 + 4 * 20 + 4, { align: 'left', size: 11.5, color: C.muted });
      }, box.stage);
      draw();
      loop.start();
    }
  });

  /* ================================================================ pd-signal */
  Hyper.sim('pd-signal', {
    title: 'Finding a rare adverse reaction',
    blurb: `A hypothetical medicine causes a serious reaction in 1 patient in N. The dots are the patients of its whole development programme (each dot may stand for several); **run the trials** to see how many cases turn up by chance — often none. The curve is the probability of seeing at least one case, $1 - (1 - p)^n$, for this reaction and for ones ten times commoner and rarer. After approval many more people are treated, but only a fraction of cases is ever reported.

**Try this**
- With 1 in 10 000 and 3000 patients, run the trials several times: most programmes see no case at all. Then run 100 programmes and count.
- Find the trial size that gives a 95 % chance of one case: it is close to 3 × N — the rule of three read backwards.
- Make the reaction commoner (1 in 500): now the trials nearly always catch it.
- After approval, lower the reporting rate to 2 %: a real problem produces only a trickle of reports — which is why signals are judged by disproportionality, not raw counts.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 190 });
      const [g1] = plotGrid(box, 1);
      let cases = null, many = null, seed = 21;
      const ctl = kit.controls(box.side, [
        { id: 'inc', label: 'True incidence: 1 patient in', min: 100, max: 100000, value: params.inc || 10000, log: true, sig: 2 },
        { id: 'n', label: 'Patients in the trials', min: 100, max: 100000, value: 3000, log: true, sig: 2 },
        { id: 'post', label: 'Patients treated after approval', min: 10000, max: 10000000, value: 1000000, log: true, sig: 2 },
        { id: 'rep', label: 'Share of cases reported', min: 1, max: 100, step: 1, value: 5, unit: '%' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run the trials', primary: true }, { id: 'many', label: 'Run 100 programmes' }] }
      ], (id) => { if (id === 'run') runOne(); else if (id === 'many') runMany(); else { cases = null; many = null; } draw(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['e', 'Expected cases in the trials'], ['p', 'Chance of seeing at least one'], ['r3', 'If none is seen, the rate could still be up to'], ['after', 'After approval: true cases / reports'], ['run', 'Your runs']]);
      const plot = kit.plot(g1, { x: { label: 'patients treated', log: true, min: 10, max: 1e7 }, y: { label: 'chance of at least one case (%)', min: 0, max: 100 }, legend: true }, 220);
      const perDot = () => Math.max(1, Math.ceil(V.n / 1200)), nDots = () => Math.ceil(V.n / perDot());
      function runOne() {
        const r = rng(seed++), k = poisson(V.n / V.inc, r), nd = nDots();
        cases = Array.from({ length: k }, () => Math.floor(r() * nd));
        many = null;
      }
      function runMany() {
        const r = rng(seed++); let none = 0, tot = 0;
        for (let i = 0; i < 100; i++) { const k = poisson(V.n / V.inc, r); if (!k) none++; tot += k; }
        many = { none, mean: tot / 100 }; cases = null;
      }
      function draw() {
        const xs = logspace(10, 1e7, 160), P = (p, n) => 100 * (1 - Math.pow(1 - p, n));
        plot.set({ series: [{ pts: xs.map(n => [n, P(1 / V.inc, n)]), label: '1 in ' + kit.fmt(V.inc, 2), width: 2.6 }, { pts: xs.map(n => [n, P(10 / V.inc, n)]), label: 'ten times commoner', dash: [5, 4], width: 1.3 }, { pts: xs.map(n => [n, P(Math.min(1, 0.1 / V.inc), n)]), label: 'ten times rarer', dash: [2, 3], width: 1.3 }],
          marks: [{ x: V.n, y: P(1 / V.inc, V.n), label: 'your trials' }], vlines: [{ x: 3 * V.inc, label: '3 × N' }], hlines: [{ y: 95, label: '95 %' }] });
        ro.set('e', kit.fmt(V.n / V.inc, 3));
        ro.set('p', pct(P(1 / V.inc, V.n), 1));
        ro.set('r3', '1 in ' + kit.fmt(V.n / 3, 3) + ' (3/n)');
        const tc = V.post / V.inc;
        ro.set('after', kit.fmt(tc, 3) + ' / ' + kit.fmt(tc * V.rep / 100, 3));
        ro.set('run', many ? many.none + ' of 100 programmes saw no case (average ' + kit.fmt(many.mean, 2) + ')' : cases ? cases.length + (cases.length === 1 ? ' case' : ' cases') + ' seen' : 'press Run');
        loop.once();
      }
      let pulse = 0;
      const loop = kit.loop((dt) => {
        pulse = (pulse + dt * 3) % (2 * Math.PI);
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const nd = nDots(), gw = W * 0.62 - 20, cols = Math.max(10, Math.round(Math.sqrt(nd * gw / (Hh - 40)))), cell = Math.min(14, gw / cols);
        const rows = Math.ceil(nd / cols), x0 = 14, y0 = 26 + Math.max(0, (Hh - 36 - rows * cell) / 2);
        c.fillStyle = C.faint;
        for (let i = 0; i < nd; i++) { const x = x0 + (i % cols) * cell + cell / 2, y = y0 + Math.floor(i / cols) * cell + cell / 2; c.fillRect(x - cell * 0.28, y - cell * 0.28, cell * 0.56, cell * 0.56); }
        if (cases) for (const i of cases) { const x = x0 + (i % cols) * cell + cell / 2, y = y0 + Math.floor(i / cols) * cell + cell / 2; kit.dot(c, x, y, Math.max(3, cell * 0.6) + 1.5 * Math.sin(pulse), C.bad); }
        kit.label(c, kit.fmt(V.n, 3) + ' patients in the trials' + (perDot() > 1 ? ' (each square = ' + perDot() + ')' : ''), x0, 12, { align: 'left', size: 12, weight: 700, color: C.text });
        const tx = W * 0.64 + 10;
        kit.label(c, cases ? (cases.length ? cases.length + ' case' + (cases.length > 1 ? 's' : '') + ' found' : 'no case found') : many ? many.none + ' % of programmes: no case' : 'run the trials', tx, Hh * 0.3, { align: 'left', size: 15, weight: 700, color: cases && cases.length ? C.bad : C.text });
        kit.label(c, 'expected ' + kit.fmt(V.n / V.inc, 2) + ' — chance of ≥ 1: ' + (100 * (1 - Math.pow(1 - 1 / V.inc, V.n))).toFixed(0) + ' %', tx, Hh * 0.3 + 22, { align: 'left', size: 12, color: C.muted });
        kit.label(c, 'after approval: ~' + kit.fmt(V.post / V.inc, 2) + ' cases, ~' + kit.fmt(V.post / V.inc * V.rep / 100, 2) + ' reports', tx, Hh * 0.3 + 42, { align: 'left', size: 12, color: C.muted });
      }, box.stage);
      draw();
      loop.start();
    }
  });

  /* ================================================================ pd-mic */
  Hyper.sim('pd-mic', {
    title: 'Antibiotic exposure against the MIC',
    blurb: `A hypothetical antibiotic given as 30-minute infusions (or continuously) to a patient with a volume of distribution of 20 L, all of it unbound, against 10⁶ bacteria per mL. The bacteria grow (doubling in under an hour, up to 10⁹ per mL) and are killed by an Emax function of the concentration, tuned so that the population is static at the MIC. With **mutants** switched on, one cell in a million starts with an MIC eight times higher — the top of the **mutant selection window** (MPC). Integrated in fixed 36-second steps over three days. There is no immune system in this model; in a patient, host defences help to clear small numbers of survivors.

**Try this**
- Time-dependent killing: give the same daily dose every 8 h, then once daily, then continuously. The time above the MIC — and the result — changes although the daily dose does not.
- Concentration-dependent killing: now once daily wins, because a high peak kills fast.
- Raise the MIC until the level spends most of its time between MIC and MPC: the susceptible cells die, the resistant ones take over — selection in action.
- Raise the dose so that the level stays above the MPC: the mutants are suppressed too.`,
    mount(box, kit) {
      const M = kit.med, VD = 20, KG = 0.8, NMAX = 1e9;
      const st = kit.stage(box.stage, { aspect: 0.2, minH: 130 });
      const [g1, g2] = plotGrid(box, 2);
      const ctl = kit.controls(box.side, [
        { id: 'pat', type: 'select', label: 'Killing pattern', options: [['Time-dependent (β-lactam-like)', 'time'], ['Concentration-dependent (aminoglycoside-like)', 'conc']], value: 'time' },
        { id: 'daily', label: 'Daily dose', min: 250, max: 8000, value: 3000, log: true, sig: 2, unit: 'mg' },
        { id: 'reg', type: 'select', label: 'Given', options: [['once daily', 24], ['every 12 h', 12], ['every 8 h', 8], ['every 6 h', 6], ['as a continuous infusion', 0]], value: 8 },
        { id: 'th', label: 'Half-life', min: 0.5, max: 12, value: 1.5, log: true, sig: 2, unit: 'h' },
        { id: 'mic', label: 'MIC of the bacterium', min: 0.03, max: 32, value: 1, log: true, sig: 2, unit: 'mg/L' },
        { id: 'mut', type: 'check', label: 'Resistant mutants present (1 in 10⁶, MIC × 8)', value: true }
      ], () => compute());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ft', 'fT>MIC (day 2)'], ['cm', 'fCmax/MIC'], ['auc', 'fAUC₂₄/MIC'], ['msw', 'Time between MIC and MPC'], ['out', 'After 3 days']]);
      const pC = kit.plot(g1, { x: { label: 'time (h)', min: 0, max: 72 }, y: { label: 'free concentration (mg/L)', log: true }, legend: true }, 220);
      const pN = kit.plot(g2, { x: { label: 'time (h)', min: 0, max: 72 }, y: { label: 'log₁₀ bacteria per mL', min: -2, max: 9.5 }, legend: true }, 220);
      let rec = [];
      function compute() {
        const C = kit.colors();
        const conc = V.pat === 'conc', kmax = conc ? 6 : 2, n = conc ? 1 : 4, ec = V.mic / Math.pow(KG / (kmax - KG), 1 / n), ecR = 8 * ec, MPC = 8 * V.mic;
        const doses = [];
        if (V.reg === 0) for (let t = 0; t < 72; t += 24) doses.push({ t, amount: V.daily, route: 'infusion', duration: 24 });
        else for (let t = 0; t < 72 - 1e-9; t += V.reg) doses.push({ t, amount: V.daily * V.reg / 24, route: 'infusion', duration: 0.5 });
        const pk = M.pk({ halfLife: V.th, Vd: VD, doses });
        const kill = (c, e50) => kmax * Math.pow(c, n) / (Math.pow(e50, n) + Math.pow(c, n));
        let lS = Math.log(1e6), lR = V.mut ? 0 : -Infinity, t = 0, next = 0; const dt = 0.01, FLOOR = Math.log(1e-2);
        rec = [];
        while (t <= 72 + 1e-9) {
          const c = pk.at(t);
          if (t >= next - 1e-9) { rec.push({ t, c, S: lS / Math.LN10, R: lR / Math.LN10 }); next += 0.25; }
          const Ntot = Math.exp(lS) + (Number.isFinite(lR) ? Math.exp(lR) : 0), g = KG * (1 - Ntot / NMAX);
          if (Number.isFinite(lS)) { lS += (g - kill(c, ec)) * dt; if (lS < FLOOR) lS = -Infinity; }
          if (Number.isFinite(lR)) { lR += (g - kill(c, ecR)) * dt; if (lR < FLOOR) lR = -Infinity; }
          t += dt;
        }
        const tot = p => { const a = Number.isFinite(p.S) ? Math.pow(10, p.S) : 0, b = Number.isFinite(p.R) ? Math.pow(10, p.R) : 0; return a + b > 0 ? Math.log10(a + b) : -Infinity; };
        const cmin = Math.max(1e-3, Math.min(V.mic / 30, ...rec.filter(p => p.t > 1).map(p => p.c)));
        pC.set({ y: { label: 'free concentration (mg/L)', log: true, min: cmin, max: Math.max(...rec.map(p => p.c), MPC) * 1.5 }, series: [{ pts: rec.map(p => [p.t, Math.max(p.c, cmin)]), label: 'free level', width: 2.2 }], hlines: [{ y: V.mic, label: 'MIC', color: C.warn }, { y: MPC, label: 'MPC (MIC × 8)', color: C.bad }] });
        const lg = v => Number.isFinite(v) ? v : NaN;
        const sS = [{ pts: rec.map(p => [p.t, lg(tot(p))]).filter(p => Number.isFinite(p[1])), label: 'all bacteria', width: 2.4 }, { pts: rec.map(p => [p.t, lg(p.S)]).filter(p => Number.isFinite(p[1])), label: 'susceptible', dash: [5, 3], width: 1.5, color: C.ok }];
        if (V.mut) sS.push({ pts: rec.map(p => [p.t, lg(p.R)]).filter(p => Number.isFinite(p[1])), label: 'resistant mutants', dash: [5, 3], width: 1.5, color: C.bad });
        pN.set({ series: sS, hlines: [{ y: 6, label: 'start' }, { y: -2, label: 'cleared' }] });
        const day2 = rec.filter(p => p.t >= 24 && p.t < 48), nd = Math.max(1, day2.length);
        const above = day2.filter(p => p.c > V.mic).length, inw = day2.filter(p => p.c > V.mic && p.c < MPC).length;
        const cmax = Math.max(...day2.map(p => p.c), 0), auc = day2.reduce((s, p) => s + p.c * 0.25, 0);
        ro.set('ft', pct(100 * above / nd));
        ro.set('cm', kit.fmt(cmax / V.mic, 3));
        ro.set('auc', kit.fmt(auc / V.mic, 3));
        ro.set('msw', pct(100 * inw / nd) + ' of day 2');
        const end = rec[rec.length - 1], T = tot(end);
        const resShare = Number.isFinite(end.R) && Number.isFinite(T) ? 100 * Math.pow(10, end.R - T) : 0;
        ro.set('out', !Number.isFinite(T) ? 'cleared (below 0.01 per mL)' : 'log₁₀ ' + T.toFixed(1) + ' per mL, ' + resShare.toFixed(resShare < 1 ? 3 : 0) + ' % resistant');
        loop.once();
      }
      let clock = 0;
      const loop = kit.loop((dt) => {
        clock = (clock + dt * 6) % 72;                                   // six hours a second
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        if (!rec.length) return;
        const p = rec[Math.min(rec.length - 1, Math.round(clock / 0.25))];
        const MPC = 8 * V.mic, zone = p.c < V.mic ? 'below the MIC — bacteria grow' : p.c < MPC ? 'in the mutant selection window' : 'above the MPC — mutants suppressed too';
        kit.label(c, 'hour ' + clock.toFixed(0) + ':  ' + kit.fmt(p.c, 3) + ' mg/L — ' + zone, 16, 14, { align: 'left', size: 12, weight: 700, color: p.c < V.mic ? C.bad : p.c < MPC ? C.warn : C.ok });
        // a culture: dots for each tenfold of bacteria
        const nS = Number.isFinite(p.S) ? Math.max(0, Math.round((p.S + 2) * 6)) : 0, nR = Number.isFinite(p.R) ? Math.max(0, Math.round((p.R + 2) * 6)) : 0;
        const bx = 16, by = 30, bw = W - 32, bh = Hh - 40, r0 = rng(99);
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(bx, by, bw, bh);
        for (let i = 0; i < nS; i++) kit.dot(c, bx + 6 + r0() * (bw - 12), by + 6 + r0() * (bh - 12), 2.6, C.ok);
        for (let i = 0; i < nR; i++) kit.dot(c, bx + 6 + r0() * (bw - 12), by + 6 + r0() * (bh - 12), 3.2, C.bad);
        kit.label(c, 'six dots for each tenfold step in numbers: green susceptible, red resistant', bx + bw - 6, by + bh - 8, { align: 'right', size: 11, color: C.muted });
      }, box.stage);
      compute();
      loop.start();
    }
  });

})();
