/* HYPER-BIOLOGY · sims/genetics.js — simulations for the Genetics branch (prefix gen-).
 *   gen-punnett    a Punnett square for 1–3 genes: grid of gamete combinations, genotype and phenotype ratios,
 *                  a random sample of offspring with its χ² against expectation (kit.bio.punnett, chiSquare)
 *   gen-peas       counting offspring of real crosses (peas, snapdragons, mice, linked genes) and testing them
 *                  with χ²; repeated experiments build the χ² distribution and show how often chance rejects
 *   gen-meiosis    meiosis of two chromosome pairs with crossing over (no interference): recombinant gametes,
 *                  the recombination frequency against map distance (Haldane, Kosambi), and nondisjunction
 *   gen-pedigree   a pedigree puzzle: a family generated under a hidden mode of inheritance; the likelihood of the
 *                  family under each mode is computed exactly by peeling
 *   gen-xlinked    X-linked inheritance in a three-generation family, its Punnett square, and allele frequencies in
 *                  men and women converging over generations
 *   gen-polygenic  a polygenic trait: n additive genes plus environment give a bell curve; heritability; selection
 *                  and the breeder's equation R = h²S
 *   gen-abo        ABO and Rh blood groups in a family: parents' likely genotypes from population frequencies and
 *                  the chances for their children
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared helpers */
  const gcd = (a, b) => { a = Math.round(a); b = Math.round(b); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  function ratioText(pairs) {                      // [[label, count], …] → "9 A– B– : 3 A– bb : …"
    const g = pairs.reduce((m, p) => gcd(m, p[1]), 0) || 1;
    return pairs.map(p => Math.round(p[1] / g) + ' ' + p[0]).join(' : ');
  }
  const fmtP = p => !Number.isFinite(p) ? '—' : p < 0.001 ? '< 0.001' : p < 0.01 ? p.toFixed(4) : p.toFixed(3);
  function poisson(lam, R) {                       // Knuth's method; lam is small here
    const L = Math.exp(-lam); let k = 0, p = 1;
    do { k++; p *= R(); } while (p > L && k < 60);
    return k - 1;
  }
  function gauss(R) { const u = Math.max(1e-12, R()), v = R(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
  function chiCrit(B, df, alpha) {                 // the χ² with upper-tail probability alpha
    let lo = 0, hi = 100;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (B.chiP(m, df) > alpha) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  const chiPdf = (B, x, k) => x <= 0 ? 0 : Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.LN2 - B.lgamma(k / 2));
  const shuffle = (a, R) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  /* a pedigree symbol: square (male) or circle (female); filled when affected, a dot for a carrier */
  function person(c, x, y, s, male, affected, carrier, C, hl) {
    c.save();
    c.lineWidth = hl ? 2.6 : 1.6; c.strokeStyle = hl ? C.accent : C.text;
    c.beginPath();
    if (male) c.rect(x - s / 2, y - s / 2, s, s); else c.arc(x, y, s / 2, 0, 2 * Math.PI);
    c.fillStyle = affected ? C.text : C.bg2; c.fill(); c.stroke();
    if (carrier && !affected) { c.fillStyle = C.text; c.beginPath(); c.arc(x, y, Math.max(2, s * 0.17), 0, 2 * Math.PI); c.fill(); }
    c.restore();
  }

  /* ================================================================ gen-punnett */
  Hyper.sim('gen-punnett', {
    title: 'Punnett square lab',
    blurb: `Choose two parents' genotypes at one, two or three genes. The square crosses every gamete of parent 1 (rows) with every gamete of parent 2 (columns); each cell is equally likely and is coloured by the offspring's phenotype. The bars compare the expected share of each phenotype (outlines) with a random sample of offspring (filled). Click a cell to highlight every cell of its phenotype.

**Try this**
- Press *Self the F₁* with one gene: 3 : 1. With two genes: 9 : 3 : 3 : 1 — click a cell of the largest class and count its nine cells.
- Switch to incomplete dominance with one gene: all three genotypes look different and the ratio becomes 1 : 2 : 1 (red, pink, white).
- Press *Test cross*: the offspring reveal the gametes of the heterozygous parent directly — 1 : 1, or 1 : 1 : 1 : 1 for two genes.
- Draw samples of 20 offspring again and again and watch the ratio wobble; then try 2 000. The χ² read-out flags a sample that is further from expectation than chance usually allows — which still happens about once in twenty samples.`,
    mount(box, kit, params) {
      params = params || {};
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300, maxH: 560 });
      const LET = ['A', 'B', 'C'];
      const opt = l => { const u = l, w = l.toLowerCase(); return [[u + u + ' (homozygous dominant)', u + u], [u + w + ' (heterozygous)', u + w], [w + w + ' (homozygous recessive)', w + w]]; };
      const pick = (s, i, def) => { const g = typeof s === 'string' ? s.substr(2 * i, 2) : ''; return opt(LET[i]).some(o => o[1] === g) ? g : def; };
      const defs = [
        { id: 'loci', type: 'select', label: 'Genes followed', options: [['one gene', 1], ['two genes', 2], ['three genes', 3]], value: [1, 2, 3].includes(params.loci) ? params.loci : 1 },
        { id: 'dom', type: 'select', label: 'Dominance', options: [['complete dominance', 'complete'], ['incomplete dominance', 'incomplete']], value: params.dom === 'incomplete' ? 'incomplete' : 'complete' }
      ];
      for (const who of [1, 2]) for (let i = 0; i < 3; i++) {
        const l = LET[i];
        defs.push({ id: 'p' + who + l, type: 'select', label: 'Parent ' + who + ' — gene ' + l, options: opt(l), value: pick(params['p' + who], i, l + l.toLowerCase()) });
      }
      defs.push({ id: 'N', label: 'Offspring in the sample', min: 10, max: 2000, value: 100, log: true, fmt: v => String(Math.round(v)) });
      defs.push({ type: 'buttons', items: [{ id: 'sample', label: 'New sample', primary: true }, { id: 'f1', label: 'Self the F₁' }, { id: 'test', label: 'Test cross' }] });
      let seed = 1, sel = null, t0 = 0, tNow = 0, M = null, geo = null;
      const ctl = kit.controls(box.side, defs, (id) => {
        if (id === 'f1' || id === 'test') for (const l of LET) {
          ctl.set('p1' + l, l + l.toLowerCase());
          ctl.set('p2' + l, id === 'f1' ? l + l.toLowerCase() : l.toLowerCase() + l.toLowerCase());
        }
        if (id === 'sample') seed++;
        update();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gam', 'Gametes: parent 1 | parent 2'], ['geno', 'Genotype ratio'], ['phen', 'Phenotype ratio'], ['sel', 'Highlighted phenotype'], ['obs', 'Sample (observed)'], ['chi', 'Sample against expectation']]);
      const pair = (a, b) => a === a.toUpperCase() ? a + b : b + a;
      const geno = who => { let s = ''; for (let i = 0; i < V.loci; i++) s += V['p' + who + LET[i]]; return s; };
      function phen(g) {
        if (V.dom === 'incomplete') return g;
        const out = [];
        for (let i = 0; i < g.length; i += 2) out.push(g[i] === g[i].toUpperCase() ? g[i] + '–' : g.substr(i, 2));
        return out.join(' ');
      }
      const dose = p => (p.match(/[A-Z]/g) || []).length;
      function colOf(j, C) {
        const p = M.classes[j];
        if (V.dom === 'incomplete') { const f = dose(p) / (2 * V.loci); return 'hsl(350 72% ' + Math.round(92 - 44 * f) + '%)'; }
        if (V.loci === 1) return /[A-Z]/.test(p) ? 'hsl(350 72% 50%)' : 'hsl(45 35% 90%)';
        return C.series[j % C.series.length];
      }
      function update() {
        for (let i = 1; i < 3; i++) for (const w of [1, 2]) ctl.show('p' + w + LET[i], V.loci > i);
        const g1 = geno(1), g2 = geno(2), res = B.punnett(g1, g2);
        const uniq = a => a.filter((x, i) => a.indexOf(x) === i);
        const ga = uniq(res.gametes1), gb = uniq(res.gametes2);   // every distinct gamete is equally likely
        const cls = {};
        for (const g of Object.keys(res.genotypes)) { const p = phen(g); cls[p] = (cls[p] || 0) + res.genotypes[g]; }
        const classes = Object.keys(cls).sort(V.dom === 'incomplete' ? undefined : (a, b) => cls[b] - cls[a] || (a < b ? -1 : 1));
        const grid = ga.map(x => gb.map(y => { let g = ''; for (let i = 0; i < x.length; i++) g += pair(x[i], y[i]); return g; }));
        const R = B.rng(seed * 7919 + 17), N = Math.round(V.N), obs = classes.map(() => 0), dots = [];
        for (let k = 0; k < N; k++) {
          let g = '';
          for (let i = 0; i < V.loci; i++) g += pair(g1[2 * i + (R() < 0.5 ? 0 : 1)], g2[2 * i + (R() < 0.5 ? 0 : 1)]);
          const j = classes.indexOf(phen(g));
          obs[j]++;
          if (dots.length < 160) dots.push(j);
        }
        const exp = classes.map(p => N * cls[p] / res.total);
        const chi = classes.length > 1 ? B.chiSquare(obs, exp) : null;
        M = { g1, g2, res, ga, gb, grid, cls, classes, obs, exp, chi, N, dots };
        if (sel && !classes.includes(sel)) sel = null;
        t0 = tNow;
        const gens = Object.keys(res.genotypes).sort();          // AABB, AABb, AAbb, AaBB, … (capitals sort first)
        ro.set('gam', ga.join(' ') + '  |  ' + gb.join(' '));
        ro.set('geno', gens.length <= 9 ? ratioText(gens.map(g => [g, res.genotypes[g]])) : gens.length + ' genotypes (see the square)');
        ro.set('phen', classes.length <= 9 ? ratioText(classes.map(p => [p, cls[p]])) : classes.length + ' phenotypes, one per genotype');
        const top = classes.slice(0, 8).map((p, j) => p + ' ' + obs[j]).join(' · ') + (classes.length > 8 ? ' · …' : '');
        ro.set('obs', N + ' offspring: ' + top);
        ro.set('chi', chi ? 'χ² = ' + chi.chi2.toFixed(2) + ', df = ' + chi.df + ', p = ' + fmtP(chi.p) + (chi.p < 0.05 ? ' — further off than chance usually allows' : ' — within the play of chance') : 'only one phenotype: nothing to test');
        setSel();
      }
      function setSel() {
        if (!sel) { ro.set('sel', 'click a cell of the square'); return; }
        let n = 0; for (const row of M.grid) for (const g of row) if (phen(g) === sel) n++;
        const tot = M.ga.length * M.gb.length;
        ro.set('sel', sel + ': ' + n + ' of ' + tot + ' cells (' + (100 * n / tot).toFixed(1) + ' %)');
      }
      function hitCell(p) {
        if (!geo) return null;
        const j = Math.floor((p.x - geo.x0 - geo.hdr) / geo.cw), i = Math.floor((p.y - geo.y0 - geo.hdr) / geo.ch);
        return i >= 0 && j >= 0 && i < geo.n1 && j < geo.n2 ? { i, j } : null;
      }
      kit.click(st, p => { const h = hitCell(p); if (!h) return; const k = phen(M.grid[h.i][h.j]); sel = sel === k ? null : k; setSel(); }, p => !!hitCell(p));
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const n1 = M.ga.length, n2 = M.gb.length;
        const side = Math.max(120, Math.min(H - 16, W * 0.58)), hdr = Math.max(24, Math.min(40, side * 0.09));
        const x0 = 8, y0 = 8, cw = (side - hdr) / n2, ch = (side - hdr) / n1;
        geo = { x0, y0, hdr, cw, ch, n1, n2 };
        const fs = Math.max(8, Math.min(15, cw / (V.loci * 1.25 + 0.8)));
        c.fillStyle = C.surface;
        c.fillRect(x0, y0 + hdr, hdr - 2, side - hdr); c.fillRect(x0 + hdr, y0, side - hdr, hdr - 2);
        kit.label(c, '1 ↓ 2 →', x0 + hdr / 2, y0 + hdr / 2, { align: 'center', size: 9.5, color: C.muted });
        for (let j = 0; j < n2; j++) kit.label(c, M.gb[j], x0 + hdr + (j + 0.5) * cw, y0 + hdr / 2, { align: 'center', size: fs, weight: 700, color: C.series[1] });
        for (let i = 0; i < n1; i++) kit.label(c, M.ga[i], x0 + hdr / 2, y0 + hdr + (i + 0.5) * ch, { align: 'center', size: Math.min(fs, hdr / (V.loci * 0.75)), weight: 700, color: C.accent });
        for (let i = 0; i < n1; i++) for (let j = 0; j < n2; j++) {
          const g = M.grid[i][j], k = M.classes.indexOf(phen(g)), x = x0 + hdr + j * cw, y = y0 + hdr + i * ch;
          const on = !sel || M.classes[k] === sel;
          c.globalAlpha = on ? 0.55 : 0.15; c.fillStyle = colOf(k, C); c.fillRect(x + 1, y + 1, cw - 2, ch - 2); c.globalAlpha = 1;
          if (sel && on) { c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(x + 2, y + 2, cw - 4, ch - 4); }
          kit.label(c, g, x + cw / 2, y + ch / 2, { align: 'center', size: fs, weight: 600, color: on ? C.text : C.muted });
        }
        // bars: expected (outline) and observed (filled) share of each phenotype
        const xR = x0 + side + 18, wR = W - xR - 10, K = M.classes.length;
        if (wR < 60) return;
        const yb = 30, hb = Math.max(60, H * 0.42), bw = wR / K;
        const fe = M.exp.map(e => e / M.N), fo = M.obs.map(o => o / M.N), top = Math.max(0.05, ...fe, ...fo);
        kit.label(c, 'phenotypes: expected ▭  sample ■', xR, 14, { size: 11, color: C.muted });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(xR, yb + hb + 0.5); c.lineTo(xR + wR, yb + hb + 0.5); c.stroke();
        for (let j = 0; j < K; j++) {
          const x = xR + j * bw, w = Math.max(2, bw * 0.62), he = hb * fe[j] / top, hobs = hb * fo[j] / top;
          c.globalAlpha = 0.85; c.fillStyle = colOf(j, C); c.fillRect(x + (bw - w) / 2, yb + hb - hobs, w, hobs); c.globalAlpha = 1;
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(x + (bw - w) / 2, yb + hb - he, w, he);
          if (bw >= 7 * M.classes[j].length + 4) kit.label(c, M.classes[j], x + bw / 2, yb + hb + 12, { align: 'center', size: 10.5, color: C.text2 });
          if (bw >= 30) kit.label(c, (100 * fe[j]).toFixed(0) + ' %', x + bw / 2, yb + hb - he - 9, { align: 'center', size: 10, color: C.muted });
        }
        // the first offspring of the sample, appearing one by one
        const nShow = Math.min(M.dots.length, Math.floor((tNow - t0) * 90) + 1), cols = Math.max(4, Math.floor(wR / 13));
        const ys = yb + hb + 34;
        kit.label(c, 'the first ' + nShow + ' offspring of the sample', xR, ys - 8, { size: 10.5, color: C.muted });
        for (let k = 0; k < nShow; k++) {
          const x = xR + 6 + (k % cols) * 13, y = ys + 6 + Math.floor(k / cols) * 13;
          if (y > H - 4) break;
          kit.dot(c, x, y, 5, colOf(M.dots[k], C), C.faint);
        }
      }
      update();
      const loop = kit.loop((dt) => { tNow += dt; draw(); }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ gen-peas */
  Hyper.sim('gen-peas', {
    title: 'Counting offspring: the chi-square test',
    blurb: `Grow a cross and count the offspring, as Mendel did. Each offspring is drawn at random with the chances nature really uses; the χ² test then compares the counts with the ratio of the hypothesis. The graph collects the χ² of every experiment you run and draws the χ² distribution that theory predicts when the hypothesis is true.

**Try this**
- With the monohybrid F₂, harvest a few crosses of 100 peas: the ratio is never exactly 3 : 1, yet p is usually well above 0.05.
- Press *Repeat 200 times*: the histogram follows the theoretical curve, and about 5 % of honest experiments land beyond the 5 % line — rejected by bad luck alone.
- Choose the yellow mice, whose true ratio is 2 : 1, tested against 3 : 1. With 20 pups the test rarely notices; with 500 it almost always does. That is statistical power.
- Linked genes tested against 1 : 1 : 1 : 1 are rejected at almost any sample size: too many parental types.
- Pick Mendel's own seed-shape count: χ² = 0.26 and p = 0.61 — an unremarkable deviation.`,
    mount(box, kit, params) {
      params = params || {};
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 220 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const Y = 'hsl(50 85% 55%)', G = 'hsl(100 48% 42%)';
      const pea = (shape, col) => ({ shape, col });
      const EXP = {
        mono: { name: 'Monohybrid F₂: round × wrinkled, F₁ selfed', classes: ['round', 'wrinkled'], truth: [3, 1], hyp: [3, 1], hypText: '3 : 1', look: [pea('round', Y), pea('wrinkled', Y)] },
        test: { name: 'Test cross Rr × rr', classes: ['round', 'wrinkled'], truth: [1, 1], hyp: [1, 1], hypText: '1 : 1', look: [pea('round', Y), pea('wrinkled', Y)] },
        di: { name: 'Dihybrid F₂: round yellow × wrinkled green', classes: ['round yellow', 'round green', 'wrinkled yellow', 'wrinkled green'], truth: [9, 3, 3, 1], hyp: [9, 3, 3, 1], hypText: '9 : 3 : 3 : 1', look: [pea('round', Y), pea('round', G), pea('wrinkled', Y), pea('wrinkled', G)] },
        snap: { name: 'Snapdragon F₂: incomplete dominance', classes: ['red', 'pink', 'white'], truth: [1, 2, 1], hyp: [1, 2, 1], hypText: '1 : 2 : 1', look: [pea('flower', 'hsl(350 72% 50%)'), pea('flower', 'hsl(340 75% 78%)'), pea('flower', 'hsl(45 30% 94%)')] },
        yellow: { name: 'Yellow mice, tested against 3 : 1 (truly 2 : 1)', classes: ['yellow', 'not yellow'], truth: [2, 1], hyp: [3, 1], hypText: '3 : 1', look: [pea('mouse', 'hsl(44 85% 60%)'), pea('mouse', 'hsl(28 30% 42%)')] },
        linked: { name: 'Linked genes, 20 % recombination, tested against 1 : 1 : 1 : 1', classes: ['AB', 'ab', 'Ab', 'aB'], truth: [4, 4, 1, 1], hyp: [1, 1, 1, 1], hypText: '1 : 1 : 1 : 1', look: [pea('dot', 0), pea('dot', 1), pea('dot', 2), pea('dot', 3)] },
        mendel: { name: 'Mendel\'s seed-shape count (5474 : 1850)', classes: ['round', 'wrinkled'], truth: [3, 1], hyp: [3, 1], hypText: '3 : 1', fixed: [5474, 1850], look: [pea('round', Y), pea('wrinkled', Y)] }
      };
      const ctl = kit.controls(box.side, [
        { id: 'exp', type: 'select', label: 'Experiment', options: Object.keys(EXP).map(k => [EXP[k].name, k]), value: EXP[params.exp] ? params.exp : 'mono' },
        { id: 'N', label: 'Offspring per experiment', min: 8, max: 2000, value: 100, log: true, fmt: v => String(Math.round(v)) },
        { id: 'anim', type: 'check', label: 'Animate the counting', value: true },
        { type: 'buttons', items: [{ id: 'harvest', label: 'Harvest a new cross', primary: true }, { id: 'rep', label: 'Repeat 200 times' }, { id: 'clear', label: 'Clear the tally' }] }
      ], (id) => {
        if (id === 'exp' || id === 'clear') { chis = []; rej = 0; plotDirty = true; }
        if (id === 'exp' || id === 'harvest' || id === 'N') harvest();
        if (id === 'rep') repeat(200);
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['obs', 'Observed'], ['exp', 'Expected under the hypothesis'], ['chi', 'χ² (degrees of freedom)'], ['p', 'p-value'], ['verdict', 'At the 5 % level'], ['reps', 'Experiments so far · rejected']]);
      const plot = kit.plot(gb, { x: { label: 'χ² of each experiment', min: 0, max: 12 }, y: { label: 'density', min: 0 }, legend: true }, 170);
      const R = B.rng(20240917);
      let cur = null, chis = [], rej = 0, plotDirty = true;
      const norm = a => { const s = a.reduce((x, y) => x + y, 0); return a.map(x => x / s); };
      function draw1(pr) { const u = R(); let acc = 0; for (let k = 0; k < pr.length; k++) { acc += pr[k]; if (u < acc) return k; } return pr.length - 1; }
      const test = counts => { const N = counts.reduce((a, b) => a + b, 0); return B.chiSquare(counts, norm(EXP[V.exp].hyp).map(x => x * N)); };
      function harvest() {
        const e = EXP[V.exp];
        let seq;
        if (e.fixed) { seq = []; e.fixed.forEach((n, k) => { for (let i = 0; i < n; i++) seq.push(k); }); shuffle(seq, R); }
        else { const pr = norm(e.truth), N = Math.round(V.N); seq = []; for (let i = 0; i < N; i++) seq.push(draw1(pr)); }
        cur = { seq, N: seq.length, shown: 0, counts: e.classes.map(() => 0), done: false, res: null };
        plotDirty = true;
      }
      function finish() {
        cur.done = true; cur.res = test(cur.counts);
        if (!EXP[V.exp].fixed) { chis.push(cur.res.chi2); if (cur.res.p < 0.05) rej++; }
        plotDirty = true;
      }
      function repeat(n) {
        const e = EXP[V.exp], pr = norm(e.truth), N = e.fixed ? e.fixed[0] + e.fixed[1] : Math.round(V.N);
        for (let r = 0; r < n; r++) {
          const cnt = pr.map(() => 0);
          for (let i = 0; i < N; i++) cnt[draw1(pr)]++;
          const t = test(cnt); chis.push(t.chi2); if (t.p < 0.05) rej++;
        }
        plotDirty = true;
      }
      function updatePlot() {
        const e = EXP[V.exp], df = e.classes.length - 1, crit = chiCrit(B, df, 0.05), xmax = Math.max(10, Math.ceil(crit * 2.2));
        const bw = xmax / 30, bins = new Array(30).fill(0);
        for (const x of chis) bins[Math.min(29, Math.floor(x / bw))]++;
        const hist = [[0, 0]];
        bins.forEach((n, i) => { const h = chis.length ? n / (chis.length * bw) : 0; hist.push([i * bw, h], [(i + 1) * bw, h]); });
        hist.push([xmax, 0]);
        const theo = [];
        for (let i = 1; i <= 200; i++) { const x = i * xmax / 200; theo.push([x, chiPdf(B, x, df)]); }
        const hmax = Math.max(...hist.map(p => p[1]));
        const ymax = Math.max(0.2, 1.15 * hmax, 1.15 * chiPdf(B, Math.max(0.6, df - 2), df));
        const marks = cur && cur.done ? [{ x: Math.min(cur.res.chi2, xmax), y: 0, label: 'this experiment' }] : [];
        plot.set({
          x: { label: 'χ² of each experiment (df = ' + df + ')', min: 0, max: xmax }, y: { label: 'density', min: 0, max: ymax },
          series: [{ pts: hist, fill: true, width: 1.4, label: chis.length + ' experiments' }, { pts: theo, dash: [6, 4], label: 'χ² distribution if the hypothesis is true' }],
          vlines: [{ x: crit, label: 'p = 0.05 (χ² = ' + crit.toFixed(2) + ')' }], marks
        });
        plotDirty = false;
      }
      function icon(c, look, x, y, r, C) {
        c.save(); c.lineWidth = 1; c.strokeStyle = C.faint;
        if (look.shape === 'flower') {
          c.fillStyle = look.col;
          for (let k = 0; k < 5; k++) { const a = k * 1.2566; c.beginPath(); c.arc(x + 0.45 * r * Math.cos(a), y + 0.45 * r * Math.sin(a), 0.5 * r, 0, 6.283); c.fill(); c.stroke(); }
          c.fillStyle = 'hsl(50 90% 55%)'; c.beginPath(); c.arc(x, y, 0.22 * r, 0, 6.283); c.fill();
        } else if (look.shape === 'mouse') {
          c.fillStyle = look.col;
          c.beginPath(); c.ellipse(x, y + 0.1 * r, 0.95 * r, 0.62 * r, 0, 0, 6.283); c.fill(); c.stroke();
          c.beginPath(); c.arc(x + 0.55 * r, y - 0.45 * r, 0.3 * r, 0, 6.283); c.fill(); c.stroke();
        } else if (look.shape === 'dot') {
          c.fillStyle = C.series[look.col % C.series.length]; c.beginPath(); c.arc(x, y, 0.85 * r, 0, 6.283); c.fill();
        } else {
          c.fillStyle = look.col; c.beginPath();
          if (look.shape === 'wrinkled') for (let a = 0; a <= 28; a++) { const t = a / 28 * 6.283, rr = r * (0.8 + 0.13 * Math.sin(7 * t + x * 0.37) + 0.05 * Math.sin(13 * t)); a ? c.lineTo(x + rr * Math.cos(t), y + rr * Math.sin(t)) : c.moveTo(x + rr * Math.cos(t), y + rr * Math.sin(t)); }
          else c.arc(x, y, 0.92 * r, 0, 6.283);
          c.closePath(); c.fill(); c.stroke();
          c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.arc(x - 0.3 * r, y - 0.3 * r, 0.22 * r, 0, 6.283); c.fill();
        }
        c.restore();
      }
      harvest();
      const loop = kit.loop((dt) => {
        const e = EXP[V.exp];
        if (!cur.done) {
          const target = V.anim ? Math.min(cur.N, cur.shown + Math.max(1, dt * Math.max(40, cur.N / 2.5))) : cur.N;
          while (cur.shown < Math.floor(target) || (target >= cur.N && cur.shown < cur.N)) cur.counts[cur.seq[cur.shown++]]++;
          if (cur.shown >= cur.N) finish();
        }
        if (plotDirty) updatePlot();
        // read-outs
        const N = cur.shown, hp = norm(e.hyp);
        ro.set('obs', e.classes.map((n, k) => n + ' ' + cur.counts[k]).join(' · ') + (e.fixed ? '' : '  (' + N + ' of ' + cur.N + ')'));
        ro.set('exp', e.hypText + ': ' + hp.map(x => (x * N).toFixed(1)).join(' · '));
        if (cur.done) {
          const r = cur.res, ok = r.p >= 0.05;
          ro.set('chi', r.chi2.toFixed(3) + ' (df = ' + r.df + ')'); ro.set('p', fmtP(r.p));
          ro.set('verdict', ok ? 'consistent with ' + e.hypText : 'reject ' + e.hypText + (e.truth.join() === e.hyp.join() ? ' — though it is true here (bad luck)' : ' — correctly: the true ratio is ' + e.truth.join(' : ')));
        } else { ro.set('chi', 'counting…'); ro.set('p', '—'); ro.set('verdict', '—'); }
        ro.set('reps', chis.length ? chis.length + ' · ' + rej + ' (' + (100 * rej / chis.length).toFixed(1) + ' %)' : 'none yet');
        // the field of offspring and the bars
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const aw = W * 0.6 - 16, ah = H - 34, MAX = 300, n = Math.min(N, MAX);
        const cols = Math.max(1, Math.ceil(Math.sqrt(MAX * aw / ah))), rows = Math.ceil(MAX / cols), s = Math.min(aw / cols, ah / rows);
        kit.label(c, (e.fixed ? 'Mendel\'s F₂ seeds' : 'offspring') + (cur.N > MAX ? ' — the first ' + MAX + ' of ' + cur.N + ' shown' : ''), 10, 12, { size: 11, color: C.muted });
        for (let i = 0; i < n; i++) icon(c, e.look[cur.seq[i]], 10 + (i % cols + 0.5) * s, 26 + (Math.floor(i / cols) + 0.5) * s, s * 0.42, C);
        const xR = W * 0.6 + 10, wR = W - xR - 10, K = e.classes.length, bw = wR / K, yb = 30, hb = H - 70;
        const top = Math.max(1, ...cur.counts, ...hp.map(x => x * Math.max(N, 1)));
        kit.label(c, 'counts: expected ▭  observed ■', xR, 12, { size: 11, color: C.muted });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(xR, yb + hb + 0.5); c.lineTo(xR + wR, yb + hb + 0.5); c.stroke();
        for (let k = 0; k < K; k++) {
          const x = xR + k * bw, w = bw * 0.55, ho = hb * cur.counts[k] / top, he = hb * hp[k] * N / top;
          const look = e.look[k];
          c.globalAlpha = 0.85; c.fillStyle = look.shape === 'dot' ? C.series[look.col] : look.col; c.fillRect(x + (bw - w) / 2, yb + hb - ho, w, ho); c.globalAlpha = 1;
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(x + (bw - w) / 2, yb + hb - he, w, he);
          kit.label(c, String(cur.counts[k]), x + bw / 2, yb + hb - Math.max(ho, he) - 9, { align: 'center', size: 11, weight: 600 });
          icon(c, look, x + bw / 2, yb + hb + 14, 7, C);
          if (bw > 64) kit.label(c, e.classes[k], x + bw / 2, yb + hb + 30, { align: 'center', size: 10, color: C.text2 });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ gen-meiosis */
  Hyper.sim('gen-meiosis', {
    title: 'Meiosis with crossing over',
    blurb: `Follow one cell through meiosis. It has two pairs of chromosomes: the long pair carries genes A and B, the short pair gene D. The chromosomes inherited from the mother are orange (alleles A, B, D), those from the father blue (a, b, d). In prophase I the homologues pair and cross over (× marks each chiasma); in anaphase I the homologues separate; in meiosis II the sister chromatids separate, leaving four haploid gametes. Crossovers are placed at random and independently of one another (no interference), so recombination follows Haldane's mapping function.

**Try this**
- Watch a few meioses at 30 cM: most gametes are parental (A B or a b), some recombinant (A b or a B). Press *Run 1 000 meioses* and compare the recombinant share with the curve.
- Measure at 5, 50, 100 and 150 cM (1 000 meioses each): the points climb along the Haldane curve and level off at 50 % however far apart the genes are.
- A and D lie on different chromosomes: at any distance, half of the gametes combine them in new ways — independent assortment.
- Make chromosome 2 fail to separate in meiosis I: two gametes get both homologues (D and d), two get none. In meiosis II: one gamete gets two identical sister copies, one gets none, two are normal.`,
    mount(box, kit, params) {
      params = params || {};
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 280, maxH: 540 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const d0 = Number.isFinite(params.d) ? Math.max(0, Math.min(150, params.d)) : 30;
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Map distance between A and B', min: 0, max: 150, step: 1, value: d0, unit: 'cM' },
        { id: 'nd', type: 'select', label: 'Chromosome 2 (gene D)', options: [['separates normally', 0], ['nondisjunction in meiosis I', 1], ['nondisjunction in meiosis II', 2]], value: [0, 1, 2].includes(params.nd) ? params.nd : 0 },
        { id: 'speed', label: 'Animation speed', min: 0.25, max: 4, value: 1, log: true, fmt: v => v.toFixed(2) + '×' },
        { id: 'auto', type: 'check', label: 'Keep going, one meiosis after another', value: true },
        { type: 'buttons', items: [{ id: 'next', label: 'Next meiosis', primary: true }, { id: 'run', label: 'Run 1 000 meioses' }, { id: 'clear', label: 'Clear all measurements' }] }
      ], (id) => {
        if (id === 'clear') points = {};
        if (id === 'nd') delete points[key(V.d)];
        if (id === 'd' || id === 'nd' || id === 'next') start();
        if (id === 'run') for (let i = 0; i < 1000; i++) tally(model());
        plotDirty = true;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['stage', 'Stage'], ['k', 'Chiasmata between A and B (this meiosis)'], ['rab', 'A–B recombinant gametes'], ['hal', 'Expected: Haldane · Kosambi'], ['rad', 'A–D recombinant (different chromosomes)'], ['aneu', 'Gametes with two / no chromosome 2']]);
      const plot = kit.plot(gb, { x: { label: 'map distance between A and B (cM)', min: 0, max: 150 }, y: { label: 'recombinant gametes (%)', min: 0, max: 60 }, legend: true }, 180);
      const rng = B.rng(31415);
      const MAT = 'hsl(16 80% 57%)', PAT = 'hsl(212 72% 56%)';
      const POS_A = 0.12, CEN1 = 0.5, CEN2 = 0.08, POS_D = 0.24, L1 = 200, L2 = 96, X1 = 175, X2 = 365, T = 10, SS = 11, HS = 26;
      const ROWS = [62, 118, 222, 278], DUR = [0.9, 1.0, 1.9, 1.3, 1.3, 1.0, 1.3, 1.9], HOLD = 1.8;
      const NAMES = ['G₁: two chromosome pairs, one of each pair from each parent', 'S phase: every chromosome is copied into two sister chromatids', 'Prophase I: homologues pair and cross over', 'Metaphase I: the pairs line up; each pair faces the poles at random',
        'Anaphase I: homologues move to opposite poles', 'Telophase I: two haploid cells', 'Meiosis II: sister chromatids separate', 'Four haploid gametes'];
      const posB = () => POS_A + 0.05 + 0.73 * Math.min(V.d, 100) / 100;
      const key = d => String(Math.round(d));
      let points = {}, m = null, stage = 0, tIn = 0, plotDirty = true, tallied = false;
      /* chromatids as lists of segments [from, to, 'M' | 'P'] along the chromosome (0–1) */
      function splitSegs(segs, x) { const a = [], b = []; for (const s of segs) { if (s[1] <= x) a.push(s); else if (s[0] >= x) b.push(s); else { a.push([s[0], x, s[2]]); b.push([x, s[1], s[2]]); } } return [a, b]; }
      function merge(segs) { const out = []; for (const s of segs) { const p = out[out.length - 1]; if (p && p[2] === s[2] && Math.abs(p[1] - s[0]) < 1e-9) p[1] = s[1]; else out.push(s.slice()); } return out; }
      function cross(ch, a, b, x) { const [la, ra] = splitSegs(ch[a], x), [lb, rb] = splitSegs(ch[b], x); ch[a] = merge(la.concat(rb)); ch[b] = merge(lb.concat(ra)); }
      const at = (segs, x) => { for (const s of segs) if (x >= s[0] && x <= s[1]) return s[2]; return segs[0][2]; };
      const fresh = () => ({ M0: [[0, 1, 'M']], M1: [[0, 1, 'M']], P0: [[0, 1, 'P']], P1: [[0, 1, 'P']] });
      function model() {
        const R = rng, pB = posB(), chi1 = [], k = poisson(2 * V.d / 100, R);
        for (let i = 0; i < k; i++) chi1.push({ x: POS_A + (pB - POS_A) * (0.06 + 0.88 * R()), m: R() < 0.5 ? 0 : 1, p: R() < 0.5 ? 0 : 1 });
        if (!k) {   // every pair has at least one chiasma; with none between A and B it lies outside that interval
          const left = POS_A - 0.05, right = Math.max(0, 0.96 - pB - 0.04), u = R() * (left + right);
          chi1.push({ x: u < left ? 0.03 + u : pB + 0.04 + (u - left), m: R() < 0.5 ? 0 : 1, p: R() < 0.5 ? 0 : 1 });
        }
        chi1.sort((a, b) => a.x - b.x);
        const c1 = fresh(), c2 = fresh();
        // Each chiasma joins one chromatid lying in the maternal axis of the pair with one in the paternal axis at that
        // point. After a crossover the two chromatids continue in the other axis, so track which axis each occupies.
        function crossAll(ch, list) {
          const axis = { M0: 'M', M1: 'M', P0: 'P', P1: 'P' }, ids = ['M0', 'M1', 'P0', 'P1'];
          for (const q of list) {
            const u = ids.filter(i => axis[i] === 'M')[q.m], v = ids.filter(i => axis[i] === 'P')[q.p];
            cross(ch, u, v, q.x); axis[u] = 'P'; axis[v] = 'M'; q.u = u; q.v = v;
          }
        }
        crossAll(c1, chi1);
        const q2 = { x: 0.45 + 0.45 * R(), m: R() < 0.5 ? 0 : 1, p: R() < 0.5 ? 0 : 1 };
        crossAll(c2, [q2]);
        const or1 = R() < 0.5, or2 = R() < 0.5, ndTop = R() < 0.5;
        const up1 = or1 ? ['M0', 'M1'] : ['P0', 'P1'], dn1 = or1 ? ['P0', 'P1'] : ['M0', 'M1'];
        let up2 = or2 ? ['M0', 'M1'] : ['P0', 'P1'], dn2 = or2 ? ['P0', 'P1'] : ['M0', 'M1'];
        if (V.nd === 1) { up2 = ndTop ? ['M0', 'M1', 'P0', 'P1'] : []; dn2 = ndTop ? [] : ['M0', 'M1', 'P0', 'P1']; }
        // meiosis II in each cell: two daughters
        function divide(list, ndHere) {
          const flip = R() < 0.5;
          if (list.length === 4) { const a = R() < 0.5 ? 0 : 1, b = R() < 0.5 ? 0 : 1; return [['M' + a, 'P' + b], ['M' + (1 - a), 'P' + (1 - b)]]; }
          if (list.length === 0) return [[], []];
          if (ndHere) return flip ? [list.slice(), []] : [[], list.slice()];
          return flip ? [[list[0]], [list[1]]] : [[list[1]], [list[0]]];
        }
        const dA = divide(up1, false), dB = divide(dn1, false);
        const eA = divide(up2, V.nd === 2 && ndTop), eB = divide(dn2, V.nd === 2 && !ndTop);
        const gam = [[dA[0], eA[0]], [dA[1], eA[1]], [dB[0], eB[0]], [dB[1], eB[1]]].map(([a, b]) => {
          const id = a[0], A = at(c1[id], POS_A) === 'M', Bb = at(c1[id], pB) === 'M', D = b.map(x => at(c2[x], POS_D) === 'M');
          return { c1: id, c2: b, A, B: Bb, D, recAB: A !== Bb, recAD: b.length === 1 && A !== D[0] };
        });
        const where = {};
        gam.forEach((g, r) => { where['1' + g.c1] = { row: r, idx: 0, cnt: 1 }; g.c2.forEach((x, j) => { where['2' + x] = { row: r, idx: j, cnt: g.c2.length }; }); });
        return { k, chi1, q2, c1, c2, or1, or2, ndTop, gam, where, pB };
      }
      function tally(mm) {
        const t = points[key(V.d)] || (points[key(V.d)] = { d: Math.round(V.d), n: 0, rec: 0, nAD: 0, recAD: 0, plus: 0, minus: 0 });
        for (const g of mm.gam) { t.n++; if (g.recAB) t.rec++; if (g.c2.length === 1) { t.nAD++; if (g.recAD) t.recAD++; } else if (g.c2.length === 2) t.plus++; else t.minus++; }
        plotDirty = true;
      }
      function start() { m = model(); stage = 0; tIn = 0; tallied = false; }
      function pos(s) {
        const P = {}, top1 = m.or1 ? 'M' : 'P', top2 = m.or2 ? 'M' : 'P';
        for (const chr of [1, 2]) for (const h of ['M', 'P']) for (const i of [0, 1]) {
          const k = chr + h + i, sg = i ? 1 : -1;
          let x = chr === 1 ? X1 : X2, y;
          if (s <= 1) {
            x += chr === 1 ? (h === 'M' ? -12 : 10) : (h === 'M' ? 8 : -8);
            y = (chr === 1 ? (h === 'M' ? 95 : 245) : (h === 'M' ? 232 : 108)) + (s === 1 ? sg * SS / 2 : 0);
          } else if (s === 2) y = (chr === 1 ? 118 : 222) + (h === 'M' ? -HS / 2 : HS / 2) + sg * SS / 2;
          else if (s === 3) y = 170 + (h === (chr === 1 ? top1 : top2) ? -HS / 2 : HS / 2) + sg * SS / 2;
          else if (s <= 5) {
            if (chr === 2 && V.nd === 1) y = (m.ndTop ? 90 : 250) + (['M0', 'M1', 'P0', 'P1'].indexOf(h + i) - 1.5) * SS;
            else y = (h === (chr === 1 ? top1 : top2) ? 90 : 250) + sg * SS / 2;
          } else { const w = m.where[k]; y = ROWS[w.row] + (w.idx - (w.cnt - 1) / 2) * SS; }
          P[k] = { x, y };
        }
        return P;
      }
      const ease = f => f * f * (3 - 2 * f);
      function bar(c, C, x, y, L, segs, cen, genes) {
        const x0 = x - L / 2;
        c.save(); c.beginPath();
        if (c.roundRect) c.roundRect(x0, y - T / 2, L, T, T / 2); else c.rect(x0, y - T / 2, L, T);
        c.clip();
        for (const s of segs) { c.fillStyle = s[2] === 'M' ? MAT : PAT; c.fillRect(x0 + s[0] * L, y - T / 2, (s[1] - s[0]) * L + 0.6, T); }
        c.restore();
        c.fillStyle = C.text; c.globalAlpha = 0.6; c.beginPath(); c.arc(x0 + cen * L, y, 2.8, 0, 6.283); c.fill(); c.globalAlpha = 1;
        for (const [p, U] of genes) {
          const up = at(segs, p) === 'M', gx = x0 + p * L;
          c.fillStyle = C.bg2; c.beginPath(); c.arc(gx, y, 5.6, 0, 6.283); c.fill();
          kit.label(c, up ? U : U.toLowerCase(), gx, y + 0.5, { align: 'center', size: 9, weight: 700, color: C.text });
        }
      }
      function gametesText(g) {
        const a = (g.A ? 'A' : 'a') + ' ' + (g.B ? 'B' : 'b'), d = g.D.length ? g.D.map(x => x ? 'D' : 'd').join('') : '–';
        return a + ' ' + d;
      }
      start();
      const loop = kit.loop((dt) => {
        tIn += dt * V.speed;
        if (stage <= 7 && tIn >= DUR[stage]) { tIn -= DUR[stage]; stage++; }
        if (stage === 8 && !tallied) { tally(m); tallied = true; }
        if (stage === 8 && tIn >= HOLD && V.auto) start();
        const s = Math.min(stage, 7), f = stage >= 8 ? 1 : Math.min(1, tIn / DUR[stage]), e = ease(f);
        const P0 = pos(Math.max(0, s - 1)), P1 = pos(s), P = {};
        for (const k in P1) P[k] = s === 0 ? P1[k] : { x: P0[k].x + (P1[k].x - P0[k].x) * e, y: P0[k].y + (P1[k].y - P0[k].y) * e };
        const crossed = s > 2 || (s === 2 && f > 0.55);
        // read-outs and the graph
        const t = points[key(V.d)], dd = V.d / 100;
        ro.set('stage', (s + 1) + ' of 8 — ' + NAMES[s] + (V.nd === 1 && (s === 4 || s === 5) ? ' (chromosome 2 fails to separate)' : V.nd === 2 && s >= 6 ? ' (chromosome 2 fails in one cell)' : ''));
        ro.set('k', String(m.k) + (m.k ? '' : ' (the pair crosses over elsewhere)'));
        ro.set('rab', t && t.n ? t.rec + ' of ' + t.n + ' (' + (100 * t.rec / t.n).toFixed(1) + ' %)' : 'none counted yet at ' + Math.round(V.d) + ' cM');
        ro.set('hal', (50 * (1 - Math.exp(-2 * dd))).toFixed(1) + ' % · ' + (50 * Math.tanh(2 * dd)).toFixed(1) + ' %');
        ro.set('rad', t && t.nAD ? (100 * t.recAD / t.nAD).toFixed(1) + ' % of ' + t.nAD : '—');
        ro.set('aneu', t ? t.plus + ' / ' + t.minus : '0 / 0');
        if (plotDirty) {
          const hal = [], kos = [];
          for (let x = 0; x <= 150; x += 2) { hal.push([x, 50 * (1 - Math.exp(-2 * x / 100))]); kos.push([x, 50 * Math.tanh(2 * x / 100)]); }
          const meas = Object.values(points).filter(q => q.n >= 20).map(q => [q.d, 100 * q.rec / q.n]).sort((a, b) => a[0] - b[0]);
          plot.set({ series: [{ pts: hal, label: 'Haldane: no interference' }, { pts: kos, dash: [6, 4], label: 'Kosambi: with interference' }, { pts: [[0, 0], [50, 50]], dash: [2, 4], label: 'recombination = map distance' }, { pts: meas, line: false, dots: 4.5, label: 'measured here (≥ 20 gametes)' }],
            vlines: [{ x: V.d, label: Math.round(V.d) + ' cM' }], marks: t && t.n ? [{ x: t.d, y: 100 * t.rec / t.n }] : [] });
          plotDirty = false;
        }
        // drawing
        const c = st.begin(), C = kit.colors();
        kit.label(c, NAMES[s], 10, 11, { size: 11.5, color: C.muted });
        const k = Math.min(st.W / 600, (st.H - 22) / 340), ox = (st.W - 600 * k) / 2, oy = 22 + (st.H - 22 - 340 * k) / 2;
        c.save(); c.translate(ox, oy); c.scale(k, k);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.fillStyle = C.surface;
        const ell = (cx, cy, rx, ry) => { c.beginPath(); c.ellipse(cx, cy, rx, ry, 0, 0, 6.283); c.fill(); c.stroke(); };
        if (s < 5 || (s === 5 && f < 0.35)) ell(220, 170, 212, 158);
        else if (s < 7 || f < 0.35) { ell(220, 90, 208, 74); ell(220, 250, 208, 74); }
        else for (const y of ROWS) { c.beginPath(); if (c.roundRect) c.roundRect(18, y - 24, 404, 48, 22); else c.rect(18, y - 24, 404, 48); c.fill(); c.stroke(); }
        if (s === 3 || s === 4) {       // the spindle of meiosis I
          c.strokeStyle = C.faint; c.lineWidth = 1;
          for (const kk in P) { const chr = kk[0], cx = (chr === '1' ? X1 - L1 / 2 + CEN1 * L1 : X2 - L2 / 2 + CEN2 * L2); for (const py of [16, 324]) if ((P[kk].y < 170) === (py < 170)) { c.beginPath(); c.moveTo(220, py); c.lineTo(cx, P[kk].y); c.stroke(); } }
        }
        for (const kk in P) {
          const chr = kk[0], id = kk.slice(1), segs = crossed ? (chr === '1' ? m.c1[id] : m.c2[id]) : [[0, 1, id[0]]];
          bar(c, C, P[kk].x, P[kk].y, chr === '1' ? L1 : L2, segs, chr === '1' ? CEN1 : CEN2, chr === '1' ? [[POS_A, 'A'], [m.pB, 'B']] : [[POS_D, 'D']]);
        }
        if (s === 2 && f > 0.55 || s === 3) {       // chiasmata
          const all = m.chi1.map(q => ({ q, chr: '1' })).concat([{ q: m.q2, chr: '2' }]);
          for (const { q, chr } of all) {
            const a = P[chr + q.u], b = P[chr + q.v], L = chr === '1' ? L1 : L2, X = chr === '1' ? X1 : X2;
            const x = X - L / 2 + q.x * L;
            c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(x - 4, a.y); c.lineTo(x + 4, b.y); c.moveTo(x + 4, a.y); c.lineTo(x - 4, b.y); c.stroke();
          }
        }
        if (stage >= 8 || (s === 7 && f > 0.5)) {
          kit.label(c, 'gametes', 440, 30, { size: 12, weight: 700, color: C.text2 });
          m.gam.forEach((g, r) => {
            const tag = g.c2.length === 2 ? 'n + 1' : g.c2.length === 0 ? 'n − 1' : g.recAB ? 'recombinant' : 'parental';
            kit.label(c, gametesText(g), 440, ROWS[r] - 7, { size: 14, weight: 700, color: C.text });
            kit.label(c, tag, 440, ROWS[r] + 11, { size: 11, color: g.c2.length !== 1 ? C.bad : g.recAB ? C.warn : C.muted });
          });
        } else if (s >= 2) kit.label(c, m.k + ' chiasma' + (m.k === 1 ? '' : 'ta') + ' between A and B', 440, 30, { size: 11.5, color: C.muted });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ gen-pedigree */
  const MODES = [['AD', 'Autosomal dominant'], ['AR', 'Autosomal recessive'], ['XD', 'X-linked dominant'], ['XR', 'X-linked recessive'], ['YL', 'Y-linked'], ['MT', 'Mitochondrial']];
  Hyper.sim('gen-pedigree', {
    title: 'Pedigree detective',
    blurb: `A family has been generated under one hidden mode of inheritance (full penetrance, no new mutations; people who marry into the family carry the allele only rarely). Filled symbols are affected; squares are males, circles females. Decide how the trait is inherited and press your answer. The verdict shows every mode that could have produced this family and how likely each is — computed exactly, by adding up all the genotypes the family members could have.

**Try this**
- Look for decisive clues first: unaffected parents with an affected child (recessive); a father passing the trait to his son (not X-linked); an affected man whose daughters are all affected and sons all unaffected (X-linked dominant); a trait passed only through mothers, to all their children (mitochondrial).
- Often more than one mode fits. Compare the likelihoods: a rare recessive allele would need several unrelated partners to be carriers, so a dominant explanation may be far more likely.
- After answering, tick *Show carriers* to see who carried the allele without showing it.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { type: 'html', html: 'How is the trait inherited?' },
        { type: 'buttons', items: MODES.slice(0, 2).map(m => ({ id: m[0], label: m[1] })) },
        { type: 'buttons', items: MODES.slice(2, 4).map(m => ({ id: m[0], label: m[1] })) },
        { type: 'buttons', items: MODES.slice(4).map(m => ({ id: m[0], label: m[1] })) },
        { id: 'carriers', type: 'check', label: 'Show carriers (a spoiler before you answer)', value: false },
        { id: 'size', type: 'select', label: 'Family size', options: [['smaller', 0], ['larger', 1]], value: 1 },
        { type: 'buttons', items: [{ id: 'new', label: 'New family', primary: true }] }
      ], (id) => {
        if (id === 'new' || id === 'size') newFamily();
        else if (MODES.some(m => m[0] === id)) answer(id);
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['verdict', 'Your answer'], ['fits', 'Modes that can explain this family'], ['score', 'Right first time · consistent · families']]);
      const Q = 0.05;          // allele frequency among founders and people marrying in (the likelihoods assume it too)
      const R = B.rng(4242);
      let fam = null, answered = null, lik = null;
      const score = { right: 0, fit: 0, n: 0 };
      const name = id => { const t = MODES.find(m => m[0] === id)[1]; return /^[XY]-/.test(t) ? t : t[0].toLowerCase() + t.slice(1); };
      const cap = t => t[0].toUpperCase() + t.slice(1);
      const share = f => f >= 0.995 ? '> 99 %' : f < 0.0001 ? '< 0.01 %' : (100 * f).toFixed(f < 0.01 ? 2 : 0) + ' %';
      /* genetics of each mode: g = copies of the allele (males carry one X; the Y and mitochondria count as one) */
      const states = (mode, sex) => mode === 'AD' || mode === 'AR' ? [0, 1, 2] : mode === 'XD' || mode === 'XR' ? (sex === 'M' ? [0, 1] : [0, 1, 2]) : mode === 'YL' ? (sex === 'M' ? [0, 1] : [0]) : [0, 1];
      function prior(mode, sex, g) {
        const q = Q, p = 1 - q;
        if (states(mode, sex).length === 3) return g === 0 ? p * p : g === 1 ? 2 * p * q : q * q;
        if (mode === 'YL' && sex === 'F') return 1;
        return g ? q : p;
      }
      function affected(mode, sex, g) {
        if (mode === 'AR') return g === 2;
        if (mode === 'XR') return sex === 'M' ? g === 1 : g === 2;
        return g >= 1;
      }
      const carrier = (mode, sex, g) => (mode === 'AR' || (mode === 'XR' && sex === 'F')) && g === 1;
      function trans(mode, sex, gc, gf, gm) {
        const pair = (pf, pm) => gc === 0 ? (1 - pf) * (1 - pm) : gc === 1 ? pf * (1 - pm) + (1 - pf) * pm : pf * pm;
        if (mode === 'AD' || mode === 'AR') return pair(gf / 2, gm / 2);
        if (mode === 'XD' || mode === 'XR') return sex === 'F' ? pair(gf, gm / 2) : (gc === 1 ? gm / 2 : 1 - gm / 2);
        if (mode === 'YL') return sex === 'M' ? (gc === gf ? 1 : 0) : (gc === 0 ? 1 : 0);
        return gc === gm ? 1 : 0;
      }
      /* draw a child's genotype from its parents' (for generating a family) */
      function child(mode, sex, gf, gm) {
        const u = R(); let acc = 0;
        for (const g of states(mode, sex)) { acc += trans(mode, sex, g, gf, gm); if (u < acc) return g; }
        return states(mode, sex)[0];
      }
      function generate(mode) {
        const big = V.size === 1, P = [];
        const add = (sex, g, gen, parents, inlaw) => { P.push({ sex, g, gen, parents, inlaw, spouse: null, kids: [], x: 0 }); return P.length - 1; };
        let gF = 0, gM = 0;
        if (mode === 'AD') { if (R() < 0.5) gF = 1; else gM = 1; }
        else if (mode === 'AR') { gF = 1; gM = 1; }
        else if (mode === 'XR') gM = 1;
        else if (mode === 'XD') { if (R() < 0.5) gF = 1; else gM = 1; }
        else if (mode === 'YL') gF = 1;
        else gM = 1;
        const f = add('M', gF, 0, null, false), m = add('F', gM, 0, null, false);
        P[f].spouse = m; P[m].spouse = f;
        const n2 = big ? 4 + Math.floor(R() * 2) : 3;
        let married = 0;
        for (let i = 0; i < n2; i++) {
          const sex = R() < 0.5 ? 'M' : 'F', c = add(sex, child(mode, sex, gF, gM), 1, [f, m], false);
          P[f].kids.push(c);
          if (R() < (big ? 0.8 : 0.65) || (i === n2 - 1 && married < 2)) {
            married++;
            const ss = sex === 'M' ? 'F' : 'M', carrierIn = (mode === 'AR' || (mode === 'XR' && ss === 'F')) && R() < 2 * Q * (1 - Q) ? 1 : 0;
            const s = add(ss, carrierIn, 1, null, true);
            P[c].spouse = s; P[s].spouse = c;
            const nk = big ? 2 + Math.floor(R() * 3) : 1 + Math.floor(R() * 3);
            for (let k = 0; k < nk; k++) {
              const ks = R() < 0.5 ? 'M' : 'F', dad = sex === 'M' ? c : s, mum = sex === 'M' ? s : c;
              P[c].kids.push(add(ks, child(mode, ks, P[dad].g, P[mum].g), 2, [dad, mum], false));
            }
          }
        }
        for (const p of P) p.affected = affected(mode, p.sex, p.g);
        return { mode, P };
      }
      function likelihood(mode) {
        const P = fam.P, pe = (i, g) => (affected(mode, P[i].sex, g) === P[i].affected ? 1 : 0);
        function down(i, g) {             // the probability of person i's descendants, given i's genotype
          const p = P[i];
          if (p.spouse == null || !p.kids.length) return 1;
          const s = P[p.spouse];
          let tot = 0;
          for (const gs of states(mode, s.sex)) {
            let prod = prior(mode, s.sex, gs) * pe(p.spouse, gs);
            if (!prod) continue;
            const gf = p.sex === 'M' ? g : gs, gm = p.sex === 'M' ? gs : g;
            for (const k of p.kids) {
              let sk = 0;
              for (const gk of states(mode, P[k].sex)) sk += trans(mode, P[k].sex, gk, gf, gm) * pe(k, gk) * down(k, gk);
              prod *= sk;
              if (!prod) break;
            }
            tot += prod;
          }
          return tot;
        }
        let L = 0;
        for (const g of states(mode, P[0].sex)) L += prior(mode, P[0].sex, g) * pe(0, g) * down(0, g);
        return L;
      }
      function reason(mode) {
        const P = fam.P;
        if (mode === 'YL' && P.some(p => p.affected && p.sex === 'F')) return 'a woman is affected';
        for (const p of P) {
          if (!p.parents) continue;
          const f = P[p.parents[0]], m = P[p.parents[1]];
          if ((mode === 'AD' || mode === 'XD') && p.affected && !f.affected && !m.affected) return 'an affected child has two unaffected parents';
          if (mode === 'AR' && !p.affected && f.affected && m.affected) return 'two affected parents have an unaffected child';
          if (mode === 'XD' && p.sex === 'F' && f.affected && !p.affected) return 'an affected man has an unaffected daughter';
          if (mode === 'XD' && p.sex === 'M' && p.affected && !m.affected) return 'an affected son has an unaffected mother';
          if (mode === 'XR' && p.sex === 'M' && !p.affected && m.affected) return 'an affected woman has an unaffected son';
          if (mode === 'XR' && p.sex === 'F' && p.affected && !f.affected) return 'an affected daughter has an unaffected father';
          if (mode === 'YL' && p.sex === 'M' && p.affected !== f.affected) return 'a son differs from his father';
          if (mode === 'MT' && p.affected !== m.affected) return 'a child differs from the mother';
        }
        return 'no combination of genotypes fits';
      }
      function newFamily() {
        let f = null;
        const mode = MODES[Math.floor(R() * MODES.length)][0];     // every mode equally often
        for (let t = 0; t < 300; t++) {
          f = generate(mode);
          const na = f.P.filter(p => p.affected).length;
          if (na >= 2 && na < f.P.length - 2 && f.P.some(p => p.gen > 0 && p.affected)) break;
        }
        fam = f; answered = null;
        lik = {}; for (const [id] of MODES) lik[id] = likelihood(id);
        layout();
        ro.set('verdict', 'study the family, then choose a mode');
        ro.set('fits', 'shown after you answer');
      }
      function answer(id) {
        if (answered) { ro.set('verdict', 'already answered — press New family'); return; }
        answered = id; score.n++;
        const tot = Object.values(lik).reduce((a, b) => a + b, 0) || 1;
        if (id === fam.mode) { score.right++; score.fit++; ro.set('verdict', 'Right: the family was generated as ' + name(id) + '.'); }
        else if (lik[id] > 0) {
          score.fit++;
          const rel = lik[id] / (lik[fam.mode] || 1);
          ro.set('verdict', 'Possible, but the family was generated as ' + name(fam.mode) + '. ' + cap(name(id)) + (rel < 1 ? ' makes this family about ' + kit.fmt(1 / rel, 2) + ' times less likely.' : ' fits it even better (× ' + kit.fmt(rel, 2) + '): this family happens to point the other way.'));
        }
        else ro.set('verdict', 'Impossible here: under ' + name(id) + ' inheritance, ' + reason(id) + '. It was generated as ' + name(fam.mode) + '.');
        const fits = MODES.filter(m => lik[m[0]] > 0).sort((a, b) => lik[b[0]] - lik[a[0]]);
        ro.set('fits', fits.map(m => m[1] + ' ' + share(lik[m[0]] / tot)).join(' · ') + ' (equal odds beforehand)');
        ro.set('score', score.right + ' · ' + score.fit + ' · ' + score.n);
      }
      function layout() {
        const P = fam.P, gen2 = P[0].kids;
        let x = 0;
        for (const ci of gen2) {
          const p = P[ci];
          if (p.spouse != null && p.kids.length) {
            const w = Math.max(2, p.kids.length);
            p.kids.forEach((k, j) => { P[k].x = x + (w - p.kids.length) / 2 + j + 0.5; });
            p.x = x + w / 2 - 0.5; P[p.spouse].x = x + w / 2 + 0.5;
            x += w + 0.7;
          } else { p.x = x + 0.5; x += 1.7; }
        }
        const xs = gen2.map(i => P[i].x), mid = (Math.min(...xs) + Math.max(...xs)) / 2;
        P[0].x = mid - 0.6; P[1].x = mid + 0.6;
        fam.width = Math.max(1, x - 0.7);
        // numbering within each generation, left to right
        for (let g = 0; g < 3; g++) P.filter(p => p.gen === g).sort((a, b) => a.x - b.x).forEach((p, i) => { p.label = ['I', 'II', 'III'][g] + '-' + (i + 1); });
      }
      newFamily();
      ro.set('score', '0 · 0 · 0');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, P = fam.P;
        const slot = Math.min(58, (W - 64) / Math.max(4, fam.width)), s = Math.max(10, Math.min(26, slot * 0.52));
        const left = 40 + (W - 50 - fam.width * slot) / 2, Y = [0.16, 0.5, 0.84].map(f => f * H);
        const X = i => left + P[i].x * slot;
        ['I', 'II', 'III'].forEach((t, g) => kit.label(c, t, 12, Y[g], { size: 13, weight: 700, color: C.muted }));
        c.strokeStyle = C.text; c.lineWidth = 1.5;
        for (let i = 0; i < P.length; i++) {
          const p = P[i];
          if (p.spouse == null || !p.kids.length) continue;
          const j = p.spouse, y = Y[p.gen], xa = Math.min(X(i), X(j)), xb = Math.max(X(i), X(j)), xm = (xa + xb) / 2;
          c.beginPath(); c.moveTo(xa + s / 2, y); c.lineTo(xb - s / 2, y); c.stroke();
          const ys = Y[p.gen + 1] - s / 2 - Math.min(18, (Y[1] - Y[0]) * 0.22), kx = p.kids.map(X);
          c.beginPath(); c.moveTo(xm, y); c.lineTo(xm, ys);
          c.moveTo(Math.min(xm, ...kx), ys); c.lineTo(Math.max(xm, ...kx), ys);
          for (const k of kx) { c.moveTo(k, ys); c.lineTo(k, Y[p.gen + 1] - s / 2); }
          c.stroke();
        }
        const showC = V.carriers;
        for (let i = 0; i < P.length; i++) {
          const p = P[i];
          person(c, X(i), Y[p.gen], s, p.sex === 'M', p.affected, showC && carrier(fam.mode, p.sex, p.g), C, false);
          if (slot > 30) kit.label(c, p.label, X(i), Y[p.gen] + s / 2 + 9, { align: 'center', size: 9.5, color: C.muted });
        }
        if (showC && !answered) kit.label(c, 'carriers shown', W - 10, 12, { align: 'right', size: 10.5, color: C.warn });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ gen-xlinked */
  Hyper.sim('gen-xlinked', {
    title: 'X-linked inheritance across generations',
    blurb: `Choose the parents of generation I. The Punnett square crosses the mother's two X chromosomes with the father's X and Y, and the family below follows the allele for three generations: every child of generation II has children with a partner who does not carry it. Filled symbols are affected; a dot marks a woman who carries one copy of a recessive allele. The graph shows the allele in a whole population, where men and women start with different frequencies.

**Try this**
- A carrier mother (Xᴬ Xᵃ) and an unaffected father: half the sons are affected, half the daughters carriers, no daughter affected. Press *Simulate 2 000 families* to check the shares.
- An affected father (Xᵃ Y) and a non-carrier mother: no child is affected, every daughter is a carrier — and a quarter of his daughters' sons are affected. The trait skips a generation and never passes from father to son.
- Switch to a dominant allele: an affected father now has every daughter affected and no son.
- In the graph the frequency in men always copies last generation's women, while women average the two sexes; the difference halves and flips sign each generation, settling at (qₘ + 2q_f)/3.`,
    mount(box, kit, params) {
      params = params || {};
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300, maxH: 560 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'dom', type: 'select', label: 'The allele a is', options: [['recessive (haemophilia A, colour vision deficiency)', 'R'], ['dominant (X-linked hypophosphataemia)', 'D']], value: params.dom === 'D' ? 'D' : 'R' },
        { id: 'mum', type: 'select', label: 'Mother in generation I', options: [['Xᴬ Xᴬ — no copy', 0], ['Xᴬ Xᵃ — one copy', 1], ['Xᵃ Xᵃ — two copies', 2]], value: 1 },
        { id: 'dad', type: 'select', label: 'Father in generation I', options: [['Xᴬ Y — no copy', 0], ['Xᵃ Y — one copy', 1]], value: 0 },
        { id: 'kids', label: 'Children per couple', min: 1, max: 5, step: 1, value: 4 },
        { id: 'qm', label: 'Population: allele frequency in men at the start', min: 0, max: 1, step: 0.01, value: 0.3 },
        { id: 'qf', label: 'Population: allele frequency in women at the start', min: 0, max: 1, step: 0.01, value: 0 },
        { type: 'buttons', items: [{ id: 'new', label: 'New family', primary: true }, { id: 'many', label: 'Simulate 2 000 families' }] }
      ], (id) => {
        if (id === 'qm' || id === 'qf') { popDirty = true; return; }
        if (id === 'many') { many(); return; }
        if (id !== 'new') stats = null;
        newFamily();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Each child of generation I'], ['fam', 'This family, generation II'], ['gs', 'Generation III: affected grandsons'], ['many', 'Over many families'], ['pop', 'Population']]);
      const plot = kit.plot(gb, { x: { label: 'generation', min: 0, max: 12 }, y: { label: 'allele frequency', min: 0, max: 1 }, legend: true }, 160);
      const R = B.rng(1910);
      let fam = null, stats = null, popDirty = true;
      const aff = (sex, g) => V.dom === 'D' ? g >= 1 : sex === 'M' ? g === 1 : g === 2;
      const car = (sex, g) => V.dom === 'R' && sex === 'F' && g === 1;
      const fromMum = g => (g === 2 || (g === 1 && R() < 0.5)) ? 1 : 0;
      const kid = (sex, gf, gm) => sex === 'M' ? fromMum(gm) : gf + fromMum(gm);
      function makeFamily() {
        const K = Math.round(V.kids), I = [{ sex: 'M', g: V.dad }, { sex: 'F', g: V.mum }], II = [], III = [];
        for (let i = 0; i < K; i++) {
          const sex = R() < 0.5 ? 'M' : 'F', p = { sex, g: kid(sex, V.dad, V.mum), kids: [] };
          const nk = Math.min(K, 3);
          for (let j = 0; j < nk; j++) {
            const ks = R() < 0.5 ? 'M' : 'F';
            p.kids.push({ sex: ks, g: sex === 'M' ? kid(ks, p.g, 0) : kid(ks, 0, p.g), via: sex });
          }
          II.push(p); III.push(...p.kids);
        }
        return { I, II, III };
      }
      function newFamily() { fam = makeFamily(); }
      function many() {
        const t = { sons: 0, sonsA: 0, dau: 0, dauA: 0, dauC: 0, gsD: 0, gsDA: 0, gsS: 0, gsSA: 0 };
        for (let n = 0; n < 2000; n++) {
          const f = makeFamily();
          for (const p of f.II) { if (p.sex === 'M') { t.sons++; if (aff('M', p.g)) t.sonsA++; } else { t.dau++; if (aff('F', p.g)) t.dauA++; if (car('F', p.g)) t.dauC++; } }
          for (const k of f.III) if (k.sex === 'M') { if (k.via === 'F') { t.gsD++; if (aff('M', k.g)) t.gsDA++; } else { t.gsS++; if (aff('M', k.g)) t.gsSA++; } }
        }
        stats = t;
      }
      const pc = (a, b) => b ? (100 * a / b).toFixed(1) + ' %' : '—';
      newFamily();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        // expected shares for one child of generation I
        const pa = V.mum / 2, sonA = pa, dauG = [(1 - V.dad) * (1 - pa), V.dad * (1 - pa) + (1 - V.dad) * pa, V.dad * pa];
        const dauA = V.dom === 'D' ? dauG[1] + dauG[2] : dauG[2], dauC = V.dom === 'R' ? dauG[1] : 0;
        ro.set('p', 'son affected ' + (100 * sonA).toFixed(0) + ' % · daughter affected ' + (100 * dauA).toFixed(0) + ' %' + (V.dom === 'R' ? ', carrier ' + (100 * dauC).toFixed(0) + ' %' : ''));
        const sons = fam.II.filter(p => p.sex === 'M'), daus = fam.II.filter(p => p.sex === 'F');
        ro.set('fam', 'sons affected ' + sons.filter(p => aff('M', p.g)).length + ' of ' + sons.length + ' · daughters affected ' + daus.filter(p => aff('F', p.g)).length + ' of ' + daus.length + (V.dom === 'R' ? ', carriers ' + daus.filter(p => car('F', p.g)).length : ''));
        const gd = fam.III.filter(k => k.sex === 'M' && k.via === 'F'), gs = fam.III.filter(k => k.sex === 'M' && k.via === 'M');
        ro.set('gs', 'through daughters ' + gd.filter(k => aff('M', k.g)).length + ' of ' + gd.length + ' · through sons ' + gs.filter(k => aff('M', k.g)).length + ' of ' + gs.length);
        ro.set('many', stats ? 'sons ' + pc(stats.sonsA, stats.sons) + ' · daughters ' + pc(stats.dauA, stats.dau) + (V.dom === 'R' ? ' (carriers ' + pc(stats.dauC, stats.dau) + ')' : '') + ' · grandsons via daughters ' + pc(stats.gsDA, stats.gsD) + ', via sons ' + pc(stats.gsSA, stats.gsS) : 'press Simulate 2 000 families');
        if (popDirty) {
          const men = [[0, V.qm]], women = [[0, V.qf]];
          let qm = V.qm, qf = V.qf;
          for (let t = 1; t <= 12; t++) { const nm = qf, nf = (qm + qf) / 2; qm = nm; qf = nf; men.push([t, qm]); women.push([t, qf]); }
          const eq = (V.qm + 2 * V.qf) / 3;
          plot.set({ series: [{ pts: men, dots: 3.5, label: 'men (qₘ)' }, { pts: women, dots: 3.5, label: 'women (q_f)' }], hlines: [{ y: eq, label: 'equilibrium (qₘ + 2q_f)/3 = ' + eq.toFixed(3) }] });
          ro.set('pop', 'men ' + V.qm.toFixed(2) + ' → ' + qm.toFixed(3) + ', women ' + V.qf.toFixed(2) + ' → ' + qf.toFixed(3) + ' after 12 generations');
          popDirty = false;
        }
        // Punnett square of generation I
        const Xa = 'Xᵃ', XA = 'Xᴬ', mg = [V.mum >= 1 ? (V.mum === 2 ? Xa : XA) : XA, V.mum >= 1 ? Xa : XA], fg = [V.dad ? Xa : XA, 'Y'];
        const sq = Math.min(H * 0.34, W * 0.42), cell = (sq - 26) / 2, px = 10, py = 22;
        kit.label(c, 'generation I: mother ↓ × father →', px, 10, { size: 11, color: C.muted });
        for (let j = 0; j < 2; j++) kit.label(c, fg[j], px + 26 + (j + 0.5) * cell, py + 10, { align: 'center', size: 13, weight: 700, color: C.series[0] });
        for (let i = 0; i < 2; i++) {
          kit.label(c, mg[i], px + 12, py + 26 + (i + 0.5) * cell, { align: 'center', size: 13, weight: 700, color: C.series[3] });
          for (let j = 0; j < 2; j++) {
            const son = j === 1, g = (mg[i] === Xa ? 1 : 0) + (son ? 0 : (V.dad ? 1 : 0)), sx = son ? 'M' : 'F';
            const x = px + 26 + j * cell, y = py + 26 + i * cell;
            c.fillStyle = aff(sx, g) ? C.bad : car(sx, g) ? C.warn : C.surface; c.globalAlpha = aff(sx, g) || car(sx, g) ? 0.35 : 1;
            c.fillRect(x + 1, y + 1, cell - 2, cell - 2); c.globalAlpha = 1;
            kit.label(c, mg[i] + ' ' + fg[j], x + cell / 2, y + cell / 2 - 7, { align: 'center', size: 12, weight: 600 });
            kit.label(c, (son ? 'son' : 'daughter') + (aff(sx, g) ? ', affected' : car(sx, g) ? ', carrier' : ''), x + cell / 2, y + cell / 2 + 9, { align: 'center', size: 10, color: C.muted });
          }
        }
        // the three-generation family
        const II = fam.II, blocks = II.map(p => Math.max(2, p.kids.length)), total = blocks.reduce((a, b) => a + b, 0) + 0.7 * (II.length - 1);
        const slot = Math.min(50, (W - 60) / Math.max(4, total)), s = Math.max(9, Math.min(22, slot * 0.5));
        const y1 = py + sq + 22, y2 = y1 + (H - y1) * 0.42, y3 = H - s / 2 - 16, left = 40 + (W - 50 - total * slot) / 2;
        ['I', 'II', 'III'].forEach((t, g) => kit.label(c, t, 12, [y1, y2, y3][g], { size: 12, weight: 700, color: C.muted }));
        let x = left; const pos = [];
        II.forEach((p, i) => {
          const w = blocks[i] * slot, xm = x + w / 2, xp = xm - slot / 2, xs = xm + slot / 2;
          pos.push(xp);
          c.strokeStyle = C.text; c.lineWidth = 1.4;
          c.beginPath(); c.moveTo(xp + s / 2, y2); c.lineTo(xs - s / 2, y2); c.stroke();
          const kx = p.kids.map((k, j) => x + (blocks[i] - p.kids.length) * slot / 2 + (j + 0.5) * slot), ys = y3 - s / 2 - 10;
          c.beginPath(); c.moveTo(xm, y2); c.lineTo(xm, ys); c.moveTo(Math.min(xm, ...kx), ys); c.lineTo(Math.max(xm, ...kx), ys);
          for (const k of kx) { c.moveTo(k, ys); c.lineTo(k, y3 - s / 2); }
          c.stroke();
          person(c, xs, y2, s, p.sex !== 'M', false, false, C, false);
          p.kids.forEach((k, j) => person(c, kx[j], y3, s, k.sex === 'M', aff(k.sex, k.g), car(k.sex, k.g), C, false));
          x += w + 0.7 * slot;
        });
        const xI = (Math.min(...pos) + Math.max(...pos)) / 2, ysI = y2 - s / 2 - 10;
        c.strokeStyle = C.text; c.lineWidth = 1.4;
        c.beginPath(); c.moveTo(xI - slot * 0.6 + s / 2, y1); c.lineTo(xI + slot * 0.6 - s / 2, y1); c.moveTo(xI, y1); c.lineTo(xI, ysI);
        c.moveTo(Math.min(xI, ...pos), ysI); c.lineTo(Math.max(xI, ...pos), ysI);
        for (const p of pos) { c.moveTo(p, ysI); c.lineTo(p, y2 - s / 2); }
        c.stroke();
        person(c, xI - slot * 0.6, y1, s, true, aff('M', V.dad), false, C, false);
        person(c, xI + slot * 0.6, y1, s, false, aff('F', V.mum), car('F', V.mum), C, false);
        II.forEach((p, i) => person(c, pos[i], y2, s, p.sex === 'M', aff(p.sex, p.g), car(p.sex, p.g), C, false));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ gen-polygenic */
  Hyper.sim('gen-polygenic', {
    title: 'A polygenic trait and selection',
    blurb: `A trait like height controlled by several genes. Each gene has a "tall" and a "short" allele; every tall allele adds the same amount, so that the genetic values span 150–190 cm whatever the number of genes. The environment then adds a random amount to each person. The histogram shows a whole population, with a normal curve of the same mean and variance; the green bars are the tallest, chosen as parents.

**Try this**
- With one gene and no environment there are three classes, 1 : 2 : 1. Add genes one at a time: 2n + 1 classes, and the outline turns into a bell curve.
- Now add environmental spread: the steps blur into a smooth distribution, and the heritability H² = V_G/V_P falls.
- Select the tallest 20 % and press *Breed from the selected*: the next generation's mean rises by about h²·S — the breeder's equation. With no environment (h² = 1) the response equals the selection; with a lot, it is small.
- Keep breeding from the tallest: the mean climbs generation after generation until the tall alleles are nearly fixed and the genetic variation runs out.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Genes affecting the trait', min: 1, max: 20, step: 1, value: 3 },
        { id: 've', label: 'Environmental spread (SD)', min: 0, max: 10, step: 0.5, value: 0, unit: 'cm' },
        { id: 'p', label: 'Starting frequency of the tall alleles', min: 0.1, max: 0.9, step: 0.05, value: 0.5 },
        { id: 'N', label: 'Population size', min: 200, max: 20000, value: 5000, log: true, fmt: v => String(Math.round(v)) },
        { id: 'sel', label: 'Select the tallest as parents', min: 5, max: 100, step: 5, value: 20, unit: '%' },
        { type: 'buttons', items: [{ id: 'new', label: 'New population', primary: true }, { id: 'breed', label: 'Breed from the selected' }] }
      ], (id) => {
        if (id === 'breed') breed();
        else if (id === 've') { environment(); gens = [{ g: 0, mean: stats.mean, pred: null }]; last = null; }
        else if (id !== 'sel') newPop();
        summarise();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['cls', 'Genotype classes'], ['mean', 'Mean · standard deviation'], ['var', 'Variances V_G · V_E · V_P'], ['h2', 'Heritability H² = V_G / V_P'], ['sel', 'Selection differential S · predicted R = h²S'], ['resp', 'Last response']]);
      const plot = kit.plot(gb, { x: { label: 'generation', min: 0 }, y: { label: 'mean height (cm)' }, legend: true }, 150);
      const R = B.rng(1918);
      let n = 0, N = 0, geno = null, G = null, P = null, gens = [], stats = null, last = null, hist = null;
      const a = () => 40 / (2 * n);
      function newPop() {
        n = Math.round(V.n); N = Math.round(V.N);
        geno = new Uint8Array(N * n); G = new Float64Array(N); P = new Float64Array(N);
        for (let i = 0; i < N; i++) { let s = 0; for (let l = 0; l < n; l++) { const g = (R() < V.p ? 1 : 0) + (R() < V.p ? 1 : 0); geno[i * n + l] = g; s += g; } G[i] = 150 + a() * s; }
        environment();
        gens = [{ g: 0, mean: stats.mean, pred: null }]; last = null;
      }
      function environment() { for (let i = 0; i < N; i++) P[i] = G[i] + V.ve * gauss(R); summarise(); }
      function summarise() {
        let mP = 0, mG = 0; for (let i = 0; i < N; i++) { mP += P[i]; mG += G[i]; } mP /= N; mG /= N;
        let vP = 0, vG = 0, vE = 0; for (let i = 0; i < N; i++) { vP += (P[i] - mP) ** 2; vG += (G[i] - mG) ** 2; vE += (P[i] - G[i]) ** 2; } vP /= N; vG /= N; vE /= N;
        let tall = 0; for (let i = 0; i < geno.length; i++) tall += geno[i];
        const pbar = tall / (2 * n * N);
        const sorted = Array.from(P).sort((x, y) => x - y), cut = sorted[Math.min(N - 1, Math.floor(N * (1 - V.sel / 100)))];
        let ms = 0, ns = 0; for (let i = 0; i < N; i++) if (P[i] >= cut) { ms += P[i]; ns++; }
        ms = ns ? ms / ns : mP;
        stats = { mean: mP, vP, vG, vE, H2: vP > 1e-9 ? vG / vP : 1, pbar, cut, S: ms - mP };
        // histogram in 1 cm bins from 130 to 210 cm, split into selected and not
        const lo = 130, nb = 80, hs = new Array(nb).fill(0), hsel = new Array(nb).fill(0);
        for (let i = 0; i < N; i++) { const b = Math.max(0, Math.min(nb - 1, Math.floor(P[i] - lo))); hs[b]++; if (P[i] >= cut) hsel[b]++; }
        hist = { lo, nb, hs, hsel };
        const ext = Math.pow(Math.round(pbar * 100) / 100, 2 * n);
        ro.set('cls', (2 * n + 1) + ' (2n + 1 with n = ' + n + '); the tallest class holds 1 in ' + (ext > 0 ? kit.fmt(1 / ext, 3) : '∞') + ' at allele frequency ' + pbar.toFixed(2));
        ro.set('mean', mP.toFixed(1) + ' cm · ' + Math.sqrt(vP).toFixed(2) + ' cm');
        ro.set('var', vG.toFixed(1) + ' · ' + vE.toFixed(1) + ' · ' + vP.toFixed(1) + ' cm²');
        const vGth = 2 * n * pbar * (1 - pbar) * a() * a();
        ro.set('h2', stats.H2.toFixed(3) + ' (theory ' + (vGth + V.ve * V.ve > 0 ? (vGth / (vGth + V.ve * V.ve)).toFixed(3) : '—') + ')');
        ro.set('sel', stats.S.toFixed(2) + ' cm · ' + (stats.H2 * stats.S).toFixed(2) + ' cm');
        ro.set('resp', last ? 'generation ' + last.g + ': R = ' + last.R.toFixed(2) + ' cm, predicted ' + last.pred.toFixed(2) + ' cm' : 'breed to see one');
        plot.set({ x: { label: 'generation', min: 0, max: Math.max(5, gens.length - 1) },
          series: [{ pts: gens.map(q => [q.g, q.mean]), dots: 3.5, label: 'observed mean' }, { pts: gens.filter(q => q.pred != null).map(q => [q.g, q.pred]), line: false, dots: 3.5, label: 'predicted by R = h²S' }] });
      }
      function breed() {
        const par = []; for (let i = 0; i < N; i++) if (P[i] >= stats.cut) par.push(i);
        if (par.length < 2) return;
        const old = stats, g2 = new Uint8Array(N * n), G2 = new Float64Array(N);
        for (let i = 0; i < N; i++) {
          const f = par[Math.floor(R() * par.length)]; let m = par[Math.floor(R() * par.length)];
          if (m === f) m = par[(par.indexOf(f) + 1) % par.length];
          let s = 0;
          for (let l = 0; l < n; l++) { const g = (R() < geno[f * n + l] / 2 ? 1 : 0) + (R() < geno[m * n + l] / 2 ? 1 : 0); g2[i * n + l] = g; s += g; }
          G2[i] = 150 + a() * s;
        }
        geno = g2; G = G2; environment();
        const g = gens.length, pred = old.mean + old.H2 * old.S;
        gens.push({ g, mean: stats.mean, pred });
        last = { g, R: stats.mean - old.mean, pred: old.H2 * old.S };
      }
      newPop(); summarise();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, h = hist;
        const x0 = 44, x1 = W - 12, y0 = 20, y1 = H - 28, bw = (x1 - x0) / h.nb, top = Math.max(1, ...h.hs);
        const X = v => x0 + (v - h.lo) * bw;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y1 + 0.5); c.lineTo(x1, y1 + 0.5); c.stroke();
        for (let v = 130; v <= 210; v += 10) { c.beginPath(); c.moveTo(X(v), y1); c.lineTo(X(v), y1 + 4); c.stroke(); kit.label(c, String(v), X(v), y1 + 13, { align: 'center', size: 10.5, color: C.muted }); }
        kit.label(c, 'height (cm)', x1, H - 6, { align: 'right', size: 10.5, color: C.muted });
        kit.label(c, N + ' individuals', x0, 10, { size: 10.5, color: C.muted });
        for (let b = 0; b < h.nb; b++) {
          if (!h.hs[b]) continue;
          const ht = (y1 - y0) * h.hs[b] / top, hsel = (y1 - y0) * h.hsel[b] / top;
          c.fillStyle = kit.hue(215, 0.75); c.fillRect(x0 + b * bw + 0.5, y1 - ht, Math.max(1, bw - 1), ht);
          if (hsel) { c.fillStyle = C.ok; c.fillRect(x0 + b * bw + 0.5, y1 - hsel, Math.max(1, bw - 1), hsel); }
        }
        // a normal curve with the same mean and variance, scaled to the counts per 1 cm bin
        const sd = Math.sqrt(stats.vP);
        if (sd > 0.3) {
          c.strokeStyle = C.warn; c.lineWidth = 2; c.setLineDash([6, 4]); c.beginPath();
          for (let k = 0; k <= 200; k++) { const v = 130 + 0.4 * k, y = y1 - (y1 - y0) * N * Math.exp(-0.5 * ((v + 0.5 - stats.mean) / sd) ** 2) / (sd * Math.sqrt(2 * Math.PI)) / top; k ? c.lineTo(X(v), Math.max(y0 - 10, y)) : c.moveTo(X(v), Math.max(y0 - 10, y)); }
          c.stroke(); c.setLineDash([]);
        }
        c.strokeStyle = C.ok; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(stats.cut), y0); c.lineTo(X(stats.cut), y1); c.stroke();
        kit.label(c, 'tallest ' + V.sel + ' %', Math.min(X(stats.cut) + 4, x1 - 70), y0 + 6, { size: 10.5, color: C.ok });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ gen-abo */
  Hyper.sim('gen-abo', {
    title: 'Blood groups in a family',
    blurb: `Choose the parents' ABO groups and RhD types. A group A parent may be IᴬIᴬ or Iᴬi, and which is more likely depends on how common each allele is in the population, so the sliders set the allele frequencies (the starting values are typical of much of Europe). The chances for each child combine every genotype the parents could have. The small cells show the antigens on red cells: triangles for A, circles for B.

**Try this**
- A group O parent and a group AB parent: every child is A or B, never O or AB.
- Two group A parents can have a group O child — but only if both carry i. Make i rare (raise the Iᴬ and Iᴮ frequencies) and watch O children become rarer.
- Group A × group B can give all four groups.
- An RhD-negative mother and an RhD-positive father: this is the situation in which anti-D immunoglobulin protects later pregnancies.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 260 });
      const GR = [['A', 'A'], ['B', 'B'], ['AB', 'AB'], ['O', 'O']], RH = [['RhD positive', '+'], ['RhD negative', '−']];
      const ctl = kit.controls(box.side, [
        { id: 'm', type: 'select', label: 'Mother\'s ABO group', options: GR, value: 'A' },
        { id: 'mr', type: 'select', label: 'Mother\'s RhD type', options: RH, value: '−' },
        { id: 'f', type: 'select', label: 'Father\'s ABO group', options: GR, value: 'B' },
        { id: 'fr', type: 'select', label: 'Father\'s RhD type', options: RH, value: '+' },
        { id: 'p', label: 'Population frequency of Iᴬ', min: 0.02, max: 0.6, step: 0.01, value: 0.26 },
        { id: 'q', label: 'Population frequency of Iᴮ', min: 0.02, max: 0.4, step: 0.01, value: 0.08 },
        { id: 'dn', label: 'Population frequency of the RhD-negative allele', min: 0.02, max: 0.7, step: 0.01, value: 0.39 }
      ], () => update());
      const V = ctl.values;
      const ro = kit.readout(box.side, [['mg', 'Mother: likely genotypes'], ['fg', 'Father: likely genotypes'], ['kids', 'Each child: ABO group'], ['rh', 'Each child: RhD type'], ['pop', 'The population'], ['note', '']]);
      let out = null;
      const pc = x => (100 * x).toFixed(x > 0 && x < 0.01 ? 2 : 1) + ' %';
      function freqs() { let p = V.p, q = V.q; if (p + q > 0.98) { const s = 0.98 / (p + q); p *= s; q *= s; } return { p, q, r: 1 - p - q }; }
      function genotypes(group, F) {       // [[alleles, probability]] given the blood group, by Hardy–Weinberg odds
        const { p, q, r } = F;
        const L = group === 'A' ? [['AA', p * p], ['AO', 2 * p * r]] : group === 'B' ? [['BB', q * q], ['BO', 2 * q * r]] : group === 'AB' ? [['AB', 1]] : [['OO', 1]];
        const s = L.reduce((t, x) => t + x[1], 0);
        return L.map(x => [x[0], x[1] / s]);
      }
      function rhGenotypes(t, d) { if (t === '−') return [['dd', 1]]; const DD = (1 - d) * (1 - d), Dd = 2 * d * (1 - d); return [['DD', DD / (DD + Dd)], ['Dd', Dd / (DD + Dd)]]; }
      function gam(list) { const g = {}; for (const [al, w] of list) for (const x of al) g[x] = (g[x] || 0) + w / 2; return g; }
      const TXT = { AA: 'IᴬIᴬ', AO: 'Iᴬi', BB: 'IᴮIᴮ', BO: 'Iᴮi', AB: 'IᴬIᴮ', OO: 'ii', DD: 'DD', Dd: 'Dd', dd: 'dd' };
      function update() {
        const F = freqs(), mg = genotypes(V.m, F), fg = genotypes(V.f, F), mrg = rhGenotypes(V.mr, V.dn), frg = rhGenotypes(V.fr, V.dn);
        const a = gam(mg), b = gam(fg), kids = { A: 0, B: 0, AB: 0, O: 0 };
        for (const x in a) for (const y in b) { const s = [x, y].sort().join(''), grp = s === 'AB' ? 'AB' : s.includes('A') ? 'A' : s.includes('B') ? 'B' : 'O'; kids[grp] += a[x] * b[y]; }
        const ra = gam(mrg), rb = gam(frg), neg = (ra.d || 0) * (rb.d || 0);
        const { p, q, r } = F, d = V.dn;
        out = { kids, neg, F };
        ro.set('mg', mg.map(x => TXT[x[0]] + ' ' + pc(x[1])).join(' · ') + '; ' + mrg.map(x => TXT[x[0]] + ' ' + pc(x[1])).join(' · '));
        ro.set('fg', fg.map(x => TXT[x[0]] + ' ' + pc(x[1])).join(' · ') + '; ' + frg.map(x => TXT[x[0]] + ' ' + pc(x[1])).join(' · '));
        ro.set('kids', ['A', 'B', 'AB', 'O'].map(k => k + ' ' + pc(kids[k])).join(' · '));
        ro.set('rh', 'positive ' + pc(1 - neg) + ' · negative ' + pc(neg));
        ro.set('pop', 'i = ' + r.toFixed(2) + ' → O ' + pc(r * r) + ' · A ' + pc(p * p + 2 * p * r) + ' · B ' + pc(q * q + 2 * q * r) + ' · AB ' + pc(2 * p * q) + ' · RhD-negative ' + pc(d * d));
        ro.set('note', V.mr === '−' && neg < 1 ? 'An RhD-negative mother may carry an RhD-positive baby (' + pc(1 - neg) + '): anti-D immunoglobulin is used in pregnancy care to stop her forming anti-D antibodies.' : '');
      }
      function cell(c, C, x, y, r, grp, label, sub) {
        c.save();
        c.fillStyle = 'hsl(356 70% 52%)'; c.strokeStyle = 'hsl(356 60% 38%)'; c.lineWidth = 1.5;
        c.beginPath(); c.arc(x, y, r, 0, 6.283); c.fill(); c.stroke();
        c.fillStyle = 'hsl(356 65% 62%)'; c.beginPath(); c.arc(x, y, r * 0.55, 0, 6.283); c.fill();
        const hasA = grp === 'A' || grp === 'AB', hasB = grp === 'B' || grp === 'AB';
        for (let k = 0; k < 12; k++) {
          const t = k / 12 * 6.283, ex = x + (r + 5) * Math.cos(t), ey = y + (r + 5) * Math.sin(t), useA = hasA && (!hasB || k % 2 === 0), useB = hasB && (!hasA || k % 2 === 1);
          if (useA) { c.fillStyle = C.series[4]; c.beginPath(); c.moveTo(ex + 4.5 * Math.cos(t), ey + 4.5 * Math.sin(t)); c.lineTo(ex + 4 * Math.cos(t + 2.1), ey + 4 * Math.sin(t + 2.1)); c.lineTo(ex + 4 * Math.cos(t - 2.1), ey + 4 * Math.sin(t - 2.1)); c.closePath(); c.fill(); }
          else if (useB) { c.fillStyle = C.series[2]; c.beginPath(); c.arc(ex, ey, 3.2, 0, 6.283); c.fill(); }
          else { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(x + r * Math.cos(t), y + r * Math.sin(t)); c.lineTo(ex, ey); c.stroke(); }
        }
        c.restore();
        kit.label(c, label, x, y, { align: 'center', size: Math.max(11, r * 0.55), weight: 700, color: '#fff' });
        if (sub) kit.label(c, sub, x, y + r + 16, { align: 'center', size: 10.5, color: C.muted });
      }
      update();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const r1 = Math.max(16, Math.min(30, H * 0.09));
        cell(c, C, W * 0.3, r1 + 16, r1, V.m, V.m + (V.mr === '+' ? '+' : '−'), 'mother');
        cell(c, C, W * 0.7, r1 + 16, r1, V.f, V.f + (V.fr === '+' ? '+' : '−'), 'father');
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(W * 0.3 + r1 + 10, r1 + 16); c.lineTo(W * 0.7 - r1 - 10, r1 + 16); c.moveTo(W / 2, r1 + 16); c.lineTo(W / 2, r1 * 2 + 40); c.stroke();
        kit.label(c, 'each child', W / 2, r1 * 2 + 52, { align: 'center', size: 11, color: C.muted });
        const groups = ['A', 'B', 'AB', 'O'], anti = { A: 'plasma: anti-B', B: 'plasma: anti-A', AB: 'neither antibody', O: 'anti-A, anti-B' };
        const r2 = Math.max(13, Math.min(24, W / 26)), yb = H - 34, hb = Math.max(30, yb - (r1 * 2 + 70) - 2 * r2 - 20);
        for (let k = 0; k < 4; k++) {
          const x = W * (0.14 + 0.2 * k), pr = out.kids[groups[k]], ht = hb * pr;
          c.fillStyle = pr > 0 ? C.accent : C.faint; c.globalAlpha = 0.8; c.fillRect(x - 14, yb - ht, 28, ht); c.globalAlpha = 1;
          c.strokeStyle = C.axis; c.beginPath(); c.moveTo(x - 20, yb + 0.5); c.lineTo(x + 20, yb + 0.5); c.stroke();
          kit.label(c, pc(pr), x, yb - ht - 9, { align: 'center', size: 11.5, weight: 600, color: pr > 0 ? C.text : C.muted });
          kit.label(c, anti[groups[k]], x, yb + 12, { align: 'center', size: 9.5, color: C.muted });
          c.globalAlpha = pr > 0 ? 1 : 0.3; cell(c, C, x, yb - hb - r2 - 22, r2, groups[k], groups[k], ''); c.globalAlpha = 1;
        }
        const xr = W * 0.94, htp = hb * (1 - out.neg);
        c.fillStyle = C.series[1]; c.globalAlpha = 0.8; c.fillRect(xr - 10, yb - htp, 20, htp); c.globalAlpha = 1;
        kit.label(c, 'RhD+ ' + pc(1 - out.neg), xr, yb - htp - 9, { align: 'right', size: 10.5 });
      }, box.stage);
      loop.start();
    }
  });

})();
