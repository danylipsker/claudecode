/* HYPER-BIOLOGY · sims/evolution.js — simulations for the Evolution branch (content/evolution.js).
 *   evo-camouflage   peppered moths on bark: birds take the moths that stand out, survivors breed (Mendelian, dark
 *                    allele dominant), and the frequencies follow the soot; or be the bird yourself
 *   evo-hw           Hardy–Weinberg explorer: p → genotype proportions, samples with a chi-square test (kit.bio.hwTest),
 *                    inbreeding, repeated samples (how often chance alone rejects), one generation of random mating
 *   evo-fixation     selection against drift: batches of Wright–Fisher populations started from one new mutant, the
 *                    fraction that fix against Kimura's formula, and the times they take
 *   evo-bottleneck   a bottleneck or a founder event in a population with ten alleles: alleles lost, heterozygosity
 *                    against H₀∏(1 − 1/2Nᵢ), the harmonic-mean effective size
 *   evo-tree         reading a phylogenetic tree: rotate nodes (nothing changes), find common ancestors, answer questions
 *                    (vertebrates with characters, or primates on a time axis: params { tree: 'primates' })
 *   evo-clock        a molecular clock: two sequences diverge by random substitutions; differences → time, saturation and
 *                    the Jukes–Cantor correction
 *   evo-earth-clock  the history of the Earth as a 24-hour day, with zooms into the last hour, minute and second
 *   evo-redqueen     host–parasite coevolution with matching alleles: cycling frequencies, the parasites one step behind
 *
 * The genetic drift reference simulation ref-drift (sims/reference.js) is used as it is, not repeated here.
 */
(function () {
  'use strict';

  /* Binomial draws that stay exact when n·p is small. kit.bio.binomial switches to a normal approximation above
     200 trials whatever n·p is, which misstates the fate of an allele present in only a few copies (for one copy
     among 200 it gives P(lost) ≈ 0.31 instead of 0.37, and a mean above one) — and that early phase is exactly
     what fixation probabilities depend on. Inversion below n·p = 30, normal approximation above. */
  function binom(n, p, R) {
    if (!(n > 0) || !(p > 0)) return 0;
    if (p >= 1) return n;
    if (p > 0.5) return n - binom(n, 1 - p, R);
    const np = n * p;
    if (np < 30) {
      const r = p / (1 - p), u = R();
      let pr = Math.pow(1 - p, n), F = pr, k = 0;
      while (u > F && k < n) { pr *= r * (n - k) / (k + 1); k++; F += pr; }
      return k;
    }
    const u = Math.max(1e-12, R()), z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * R());
    return Math.max(0, Math.min(n, Math.round(np + z * Math.sqrt(np * (1 - p)))));
  }
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const pct = (x, d) => (100 * x).toFixed(d == null ? 1 : d) + ' %';

  /* ================================================================ natural selection on moths */
  Hyper.sim('evo-camouflage', {
    title: 'Natural selection by sharp-eyed birds',
    blurb: `Peppered moths rest on tree bark. Pale moths (genotype cc) match lichen-covered bark; dark moths carry the dominant *carbonaria* allele C (CC or Cc). Birds hunt by sight: the more a moth contrasts with the bark, the likelier it is to be eaten. When the set share of moths has been taken, the survivors pair at random and each parent passes on one of its two alleles, as Mendel's rules say; the graph follows the dark moths and the dark allele over the generations. Red rings mark where the birds struck.

**Try this**
- Start on clean bark with the dark allele rare (5 %) and raise the soot to 90 %: now the pale moths stand out, and within twenty generations or so most moths are dark — as happened around Manchester between 1848 and 1895.
- Compare the two curves on sooty bark: the dark moths approach 100 % while the dark allele lags behind, because the recessive pale allele hides in dark-looking heterozygotes where the birds cannot find it. In a small population chance often removes those last hidden copies.
- Clean the air (soot back to 0) and watch the reverse, as after the Clean Air Act of 1956.
- Set the birds' reliance on contrast to 0: they eat at random, there is no selection, and the frequencies only drift.
- Tick *You are the bird* and click the moths you can see. Without trying, you select against the conspicuous ones.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      let running = true;
      const ctl = kit.controls(box.side, [
        { id: 'soot', label: 'Soot on the bark', min: 0, max: 100, step: 1, value: 0, unit: '%' },
        { id: 'eat', label: 'Moths eaten each generation', min: 10, max: 70, step: 5, value: 40, unit: '%' },
        { id: 'eye', label: 'How much the birds rely on contrast', min: 0, max: 6, step: 0.25, value: 1.5 },
        { id: 'N', label: 'Moths in the wood', min: 20, max: 150, step: 1, value: 60 },
        { id: 'p0', label: 'Starting frequency of the dark allele', min: 0.01, max: 0.9, step: 0.01, value: 0.05 },
        { id: 'speed', label: 'Birds\' pecks per second', min: 2, max: 80, step: 1, value: 15 },
        { id: 'you', type: 'check', label: 'You are the bird: click the moths you can see', value: false },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => {
        if (id === 'restart' || id === 'p0' || id === 'N') restart();
        else if (id === 'pause') running = !running;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gen', 'Generation'], ['dark', 'Dark moths now'], ['pC', 'Frequency of the dark allele C'], ['last', 'Last generation eaten: dark / pale'], ['sel', 'Selection, from survival'], ['msg', '']]);
      const plot = kit.plot(gb, { x: { label: 'generation', min: 0 }, y: { label: 'frequency', min: 0, max: 1 }, legend: true }, 170);
      const R = B.rng(1848);
      // the bark: blotches of lighter and darker tone, lichen patches, fixed for the whole run
      const blot = Array.from({ length: 170 }, () => ({ x: R(), y: R(), r: 0.015 + 0.05 * R(), d: (R() - 0.5) * 0.24, lich: R() }));
      let moths = [], gen = 0, eaten = 0, target = 1, acc = 0, hist = [], pecks = [], last = null;
      const barkTone = () => 0.82 - 0.68 * V.soot / 100;
      const newMoth = g => ({ x: 0.04 + 0.92 * R(), y: 0.07 + 0.86 * R(), g, a: (R() - 0.5) * 0.7, v: R() - 0.5, alive: true });
      const isDark = m => m.g > 0;
      const tone = m => isDark(m) ? 0.13 + 0.06 * m.v : 0.8 + 0.06 * m.v;
      // a bird finds a moth with a weight exp(k · contrast): k = 0 is random predation; the default k = 1.5 gives
      // s ≈ 0.4–0.5 between the forms on fully clean or fully sooty bark, close to Kettlewell's field estimates
      const vis = m => Math.abs(tone(m) - barkTone());
      function stats() {
        let d = 0, c = 0;
        for (const m of moths) { if (isDark(m)) d++; c += m.g; }
        return { fd: moths.length ? d / moths.length : 0, pC: moths.length ? c / (2 * moths.length) : 0 };
      }
      function record() { const s = stats(); hist.push([gen, s.fd, s.pC, V.soot / 100]); if (hist.length > 2000) hist.shift(); }
      function restart() {
        const N = Math.round(V.N);
        moths = [];
        for (let i = 0; i < N; i++) moths.push(newMoth((R() < V.p0 ? 1 : 0) + (R() < V.p0 ? 1 : 0)));
        gen = 0; eaten = 0; acc = 0; hist = []; pecks = []; last = null;
        target = Math.max(1, Math.round(V.eat / 100 * N));
        record();
      }
      function breed() {
        const surv = moths.filter(m => m.alive);
        if (!surv.length) { restart(); return; }
        const nd = moths.filter(isDark).length, np = moths.length - nd, sd = surv.filter(isDark).length, sp = surv.length - sd;
        last = { sd: nd ? sd / nd : null, sp: np ? sp / np : null, ed: nd - sd, ep: np - sp, nd, np };
        const allele = m => m.g === 2 ? 1 : m.g === 0 ? 0 : (R() < 0.5 ? 1 : 0);
        const N = Math.round(V.N), next = [];
        for (let i = 0; i < N; i++) {
          const a = surv[Math.floor(R() * surv.length)], b = surv[Math.floor(R() * surv.length)];
          next.push(newMoth(allele(a) + allele(b)));
        }
        moths = next; gen++; eaten = 0;
        target = Math.max(1, Math.round(V.eat / 100 * N));
        record();
      }
      function kill(m) {
        m.alive = false; eaten++;
        pecks.push({ x: m.x, y: m.y, t: 0 });
        if (eaten >= target) breed();
      }
      function peck() {
        const alive = moths.filter(m => m.alive);
        if (!alive.length) return;
        let tot = 0;
        const w = alive.map(m => { const x = Math.exp(V.eye * vis(m)); tot += x; return x; });
        let u = R() * tot, k = 0;
        while (k < alive.length - 1 && u > w[k]) { u -= w[k]; k++; }
        kill(alive[k]);
      }
      restart();
      // geometry of the bark on the canvas
      const geo = () => ({ bx: 8, by: 26, bw: st.W - 16, bh: st.H - 34 });
      function hit(p) {
        const g = geo(), size = clamp(st.W / 70, 7, 12);
        let best = null, bd = (size * 1.6) ** 2;
        for (const m of moths) {
          if (!m.alive) continue;
          const d = (g.bx + m.x * g.bw - p.x) ** 2 + (g.by + m.y * g.bh - p.y) ** 2;
          if (d < bd) { bd = d; best = m; }
        }
        return best;
      }
      kit.click(st, p => { if (V.you) { const m = hit(p); if (m) kill(m); } }, p => V.you && hit(p) != null);
      const barkCol = (t, f) => 'hsl(' + (78 - 48 * f).toFixed(0) + ' ' + (16 - 9 * f).toFixed(0) + '% ' + (8 + 80 * clamp(t, 0, 1)).toFixed(0) + '%)';
      const loop = kit.loop((dt) => {
        if (running && !V.you) { acc += dt * V.speed; let n = 0; while (acc >= 1 && n < 300) { peck(); acc -= 1; n++; } }
        else acc = 0;
        for (const p of pecks) p.t += dt;
        pecks = pecks.filter(p => p.t < 0.7);
        const s = stats();
        ro.set('gen', String(gen));
        ro.set('dark', pct(s.fd, 0) + ' of ' + moths.length);
        ro.set('pC', s.pC.toFixed(3));
        ro.set('last', last ? last.ed + ' / ' + last.ep : '—');
        if (last && last.nd >= 3 && last.np >= 3 && Math.max(last.sd, last.sp) > 0) {
          const pale = last.sp < last.sd, sv = pale ? 1 - last.sp / last.sd : 1 - last.sd / last.sp;
          ro.set('sel', sv < 0.005 ? 'none this generation' : 's ≈ ' + sv.toFixed(2) + ' against ' + (pale ? 'pale' : 'dark') + ' moths');
        } else ro.set('sel', !last ? '—' : last.nd && last.np ? 'too few of one form to measure' : 'only one form left');
        ro.set('msg', V.you ? 'Click moths: ' + (target - eaten) + ' more this generation' : running ? '' : 'paused');
        plot.set({
          series: [
            { pts: hist.map(h => [h[0], h[1]]), label: 'dark moths' },
            { pts: hist.map(h => [h[0], h[2]]), label: 'dark allele C', dash: [6, 4] },
            { pts: hist.map(h => [h[0], h[3]]), label: 'soot on the bark', dash: [2, 3], width: 1.4 }
          ],
          x: { label: 'generation', min: 0, max: Math.max(20, gen) }
        });
        // drawing
        const c = st.begin(), C = kit.colors(), g = geo(), f = V.soot / 100, bt = barkTone();
        c.fillStyle = barkCol(bt, f); c.fillRect(g.bx, g.by, g.bw, g.bh);
        c.save(); c.beginPath(); c.rect(g.bx, g.by, g.bw, g.bh); c.clip();
        for (const b of blot) {
          const lich = b.lich > 0.55 && f < 0.6;
          c.fillStyle = lich ? 'hsl(95 ' + (26 * (1 - f / 0.6)).toFixed(0) + '% ' + (70 + 14 * b.lich * (1 - f)).toFixed(0) + '% / ' + (0.65 * (1 - f / 0.6)).toFixed(2) + ')' : barkCol(bt + b.d, f);
          c.beginPath(); c.ellipse(g.bx + b.x * g.bw, g.by + b.y * g.bh, b.r * g.bw, b.r * g.bh * 0.55, 0.3, 0, Math.PI * 2); c.fill();
        }
        const size = clamp(st.W / 70, 7, 12);
        moths.forEach((m, i) => {
          if (!m.alive) return;
          const x = g.bx + m.x * g.bw, y = g.by + m.y * g.bh, t = tone(m);
          c.save(); c.translate(x, y); c.rotate(m.a);
          c.fillStyle = isDark(m) ? 'hsl(30 8% ' + (100 * t).toFixed(0) + '%)' : 'hsl(55 12% ' + (100 * t).toFixed(0) + '%)';
          c.beginPath(); c.moveTo(0, -size * 0.35); c.lineTo(-size * 1.25, size * 0.45); c.lineTo(-size * 0.2, size * 0.7); c.closePath(); c.fill();
          c.beginPath(); c.moveTo(0, -size * 0.35); c.lineTo(size * 1.25, size * 0.45); c.lineTo(size * 0.2, size * 0.7); c.closePath(); c.fill();
          if (!isDark(m)) { c.fillStyle = 'hsl(30 10% 25% / .7)'; for (let k = 0; k < 4; k++) { const sx = ((i * 7 + k * 13) % 11 - 5) / 5 * size * 0.8, sy = ((i * 5 + k * 3) % 5) / 5 * size * 0.5; c.fillRect(sx, sy, 1.4, 1.4); } }
          c.fillStyle = 'hsl(30 12% ' + (isDark(m) ? 9 : 45) + '%)';
          c.beginPath(); c.ellipse(0, size * 0.1, size * 0.18, size * 0.6, 0, 0, Math.PI * 2); c.fill();
          c.restore();
        });
        for (const p of pecks) {
          c.globalAlpha = clamp(1 - p.t / 0.7, 0, 1); c.strokeStyle = C.bad; c.lineWidth = 2;
          c.beginPath(); c.arc(g.bx + p.x * g.bw, g.by + p.y * g.bh, size * (1 + 2 * p.t), 0, Math.PI * 2); c.stroke();
        }
        c.globalAlpha = 1; c.restore();
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(g.bx + 0.5, g.by + 0.5, g.bw - 1, g.bh - 1);
        kit.label(c, 'generation ' + gen + ' · ' + moths.filter(m => m.alive).length + ' moths on the bark · ' + pct(s.fd, 0) + ' dark · soot ' + V.soot.toFixed(0) + ' %', 10, 13, { align: 'left', size: 12, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ Hardy–Weinberg */
  Hyper.sim('evo-hw', {
    title: 'Hardy–Weinberg explorer',
    blurb: `Set the frequency p of allele A and the population's genotypes settle at p² : 2pq : q² (the outlined bars and the curves below). Then draw a sample of individuals — each circle shows its two alleles, green A and orange a — and test it against the equilibrium with a chi-square test (one degree of freedom). Inbreeding removes heterozygotes without changing p.

**Try this**
- Move p and follow the curves: heterozygotes peak at 50 % when p = 0.5, and when an allele is rare almost all its copies sit in heterozygotes.
- Draw a few samples with no inbreeding: the observed bars scatter around the expected ones and χ² is usually below 3.84.
- Press *Draw 200 samples*: even in a perfect equilibrium about 5 % of samples fail the test at the 5 % level — that is what the 5 % means.
- Add inbreeding (F = 0.1) and test samples of 50 and of 1000: small samples often miss the deficit, large ones catch it.
- With a deficit present, press *One generation of random mating*: the new sample is back in equilibrium, at the same allele frequency.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const R = B.rng(1908);
      let sample = null, rej = 0, tests = 0;
      const ctl = kit.controls(box.side, [
        { id: 'p', label: 'Frequency of allele A (p)', min: 0.01, max: 0.99, step: 0.01, value: 0.6 },
        { id: 'F', label: 'Inbreeding: heterozygote deficit F', min: 0, max: 0.8, step: 0.02, value: 0 },
        { id: 'n', label: 'Sample size', min: 20, max: 2000, value: 200, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'draw', label: 'Draw a sample', primary: true }, { id: 'many', label: 'Draw 200 samples' }, { id: 'mate', label: 'One generation of random mating' }] }
      ], (id) => {
        if (id === 'draw') draw();
        else if (id === 'many') { for (let k = 0; k < 200; k++) draw(true); draw(); }
        else if (id === 'mate') { const ph = sample ? sample.t.p : V.p; ctl.set('F', 0); ctl.set('p', clamp(Math.round(ph * 100) / 100, 0.01, 0.99)); rej = 0; tests = 0; draw(); }
        else if (id === 'p' || id === 'F' || id === 'n') { rej = 0; tests = 0; draw(); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['exp', 'Expected AA / Aa / aa'], ['obs', 'Sample counts AA / Aa / aa'], ['ph', 'Allele frequency in the sample'], ['chi', 'χ² (1 df) and P'], ['verdict', 'Verdict at the 5 % level'], ['rej', 'Samples rejected so far']]);
      const plot = kit.plot(gb, { x: { label: 'frequency of allele A, p', min: 0, max: 1 }, y: { label: 'genotype frequency', min: 0, max: 1 }, legend: true }, 180);
      const curves = [0, 1, 2].map(k => Array.from({ length: 101 }, (_, i) => { const p = i / 100, h = B.hardyWeinberg(p); return [p, [h.AA, h.Aa, h.aa][k]]; }));
      const probs = () => { const p = V.p, q = 1 - p, F = V.F; return [p * p + F * p * q, 2 * p * q * (1 - F), q * q + F * p * q]; };
      function draw(quiet) {
        const n = Math.max(2, Math.round(V.n)), P = probs();
        const nAA = binom(n, P[0], R), nAa = binom(n - nAA, P[1] / Math.max(1e-12, P[1] + P[2]), R), naa = n - nAA - nAa;
        const t = B.hwTest(nAA, nAa, naa);
        tests++; if (t.pValue < 0.05) rej++;
        if (quiet) return;
        // the individuals, in a random order, for the picture
        const list = [];
        for (let i = 0; i < nAA; i++) list.push(2);
        for (let i = 0; i < nAa; i++) list.push(1);
        for (let i = 0; i < naa; i++) list.push(0);
        for (let i = list.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); const x = list[i]; list[i] = list[j]; list[j] = x; }
        sample = { n, c: [nAA, nAa, naa], t, list };
      }
      draw();
      const GC = ['hsl(140 55% 42%)', 'hsl(80 45% 48%)', 'hsl(30 85% 56%)'];
      const colA = 'hsl(140 55% 42%)', cola = 'hsl(30 85% 56%)';
      const loop = kit.loop(() => {
        const C = kit.colors(), c = st.begin(), h = B.hardyWeinberg(V.p), s = sample;
        ro.set('exp', pct(h.AA) + ' / ' + pct(h.Aa) + ' / ' + pct(h.aa));
        if (s) {
          ro.set('obs', s.c.join(' / ') + ' of ' + s.n);
          ro.set('ph', 'p̂ = ' + s.t.p.toFixed(3));
          ro.set('chi', s.t.chi2.toFixed(2) + ',  P = ' + (s.t.pValue < 0.001 ? s.t.pValue.toExponential(1) : s.t.pValue.toFixed(3)));
          ro.set('verdict', s.t.pValue < 0.05 ? 'departs from equilibrium' : 'consistent with equilibrium');
        }
        ro.set('rej', rej + ' of ' + tests + (tests ? ' (' + pct(rej / tests, 1) + ')' : ''));
        // left: the sample as individuals
        const W = st.W, H = st.H, lw = W * 0.5;
        kit.label(c, s ? 'a sample of ' + s.n + (s.n > 400 ? ' (400 shown)' : '') + ': green A, orange a' : '', 10, 12, { align: 'left', size: 12, color: C.muted });
        if (s) {
          const shown = Math.min(400, s.list.length), cols = Math.ceil(Math.sqrt(shown * (lw - 20) / (H - 34))), rows = Math.ceil(shown / cols);
          const cell = Math.min((lw - 20) / cols, (H - 34) / rows), r = Math.max(1.5, cell * 0.42);
          for (let i = 0; i < shown; i++) {
            const x = 10 + (i % cols + 0.5) * cell, y = 26 + (Math.floor(i / cols) + 0.5) * cell, gnt = s.list[i];
            c.fillStyle = gnt >= 1 ? colA : cola; c.beginPath(); c.arc(x, y, r, Math.PI / 2, Math.PI * 1.5); c.fill();
            c.fillStyle = gnt === 2 ? colA : cola; c.beginPath(); c.arc(x, y, r, -Math.PI / 2, Math.PI / 2); c.fill();
          }
        }
        // right: expected (outline) and observed (filled) bars
        const x0 = lw + 30, x1 = W - 12, y0 = 30, y1 = H - 26, bwid = (x1 - x0) / 3;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y1 + 0.5); c.lineTo(x1, y1 + 0.5); c.stroke();
        const names = ['AA', 'Aa', 'aa'], expd = [h.AA, h.Aa, h.aa], obs = s ? s.c.map(k => k / s.n) : [0, 0, 0];
        for (let k = 0; k < 3; k++) {
          const bx = x0 + k * bwid + bwid * 0.18, w = bwid * 0.3;
          const he = (y1 - y0) * expd[k], hoo = (y1 - y0) * obs[k];
          c.fillStyle = GC[k]; c.fillRect(bx + w + 2, y1 - hoo, w, hoo);
          c.strokeStyle = C.text; c.setLineDash([4, 3]); c.strokeRect(bx + 0.5, y1 - he + 0.5, w - 1, he); c.setLineDash([]);
          kit.label(c, names[k], bx + w, y1 + 12, { size: 12, color: C.text, weight: 600 });
          kit.label(c, (100 * expd[k]).toFixed(0) + ' %', bx + w / 2, y1 - he - 8, { size: 10.5, color: C.muted });
          if (s) kit.label(c, (100 * obs[k]).toFixed(0) + ' %', bx + w * 1.5 + 2, y1 - hoo - 8, { size: 10.5, color: C.text });
        }
        kit.label(c, 'dashed: expected p², 2pq, q²   filled: sample', x0, 12, { align: 'left', size: 11, color: C.muted });
        plot.set({
          series: [{ pts: curves[0], label: 'AA = p²', color: GC[0] }, { pts: curves[1], label: 'Aa = 2pq', color: GC[1] }, { pts: curves[2], label: 'aa = q²', color: GC[2] }],
          vlines: [{ x: V.p, label: 'p' }],
          marks: s ? names.map((nm, k) => ({ x: s.t.p, y: obs[k], label: nm + ' in sample', color: GC[k] })) : []
        });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ selection against drift: fixation probability */
  // Kimura's diffusion result for additive selection (AA 1 + s, Aa 1 + s/2, aa 1): u = (1 − e^(−2Nsp)) / (1 − e^(−2Ns))
  const kimura = (N, s, p) => Math.abs(2 * N * s) < 1e-9 ? p : (1 - Math.exp(-2 * N * s * p)) / (1 - Math.exp(-2 * N * s));
  Hyper.sim('evo-fixation', {
    title: 'Selection against drift: will the new mutation win?',
    blurb: `A batch of identical populations each starts with the same allele A — usually a single new mutant copy — and runs generation after generation (Wright–Fisher sampling of the 2N gene copies, with additive selection s for A) until A is either lost or fixed. Each square is one population: green fixed, grey lost, blue still undecided. Every finished batch adds a point to the graph: the fraction that fixed, against Kimura's formula (dashed).

**Try this**
- Run a neutral batch (s = 0): about 1 in 2N fix — for N = 50, 1 %. That is the neutral fixation probability, 1/(2N).
- Set s = 0.02 with N = 50 (2Ns = 2): the mutation fixes about twice as often as a neutral one — yet it is still lost over 97 % of the time.
- Press *Sweep s* and watch the points follow the curve: for 2Ns ≫ 1 the chance approaches s, whatever N.
- Try a slightly harmful mutation (s = −0.01) in a small population (N = 20): it still fixes now and then. In a population of 500 it practically never does.
- Compare the average time to fixation with 4N generations, the neutral expectation for a new mutation.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.36, minH: 200 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const R = B.rng(1962);
      let batch = null, results = [], sweep = null;
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Population size N', min: 10, max: 500, value: 50, log: true, sig: 2 },
        { id: 's', label: 'Selection coefficient s of A', min: -0.02, max: 0.1, step: 0.002, value: 0.02 },
        { id: 'start', type: 'select', label: 'A starts as', options: [['one new mutant copy, 1/2N', 0], ['10 % of the copies', 0.1], ['50 % of the copies', 0.5]], value: 0 },
        { id: 'reps', label: 'Populations per batch', min: 100, max: 5000, value: 1000, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'run', label: 'Run a batch', primary: true }, { id: 'sweep', label: 'Sweep s' }, { id: 'clear', label: 'Clear points' }] }
      ], (id) => {
        if (id === 'run') { sweep = null; start(V.s); }
        else if (id === 'sweep') { sweep = [-0.01, -0.005, 0, 0.005, 0.01, 0.02, 0.04, 0.07, 0.1]; start(sweep.shift()); }
        else if (id === 'clear') results = results.filter(r => !(r.N === N() && r.start === V.start));
        else if (id === 'N' || id === 'start' || id === 'reps') { sweep = null; start(V.s); }
      });
      const V = ctl.values;
      const N = () => Math.max(2, Math.round(V.N));
      const ro = kit.readout(box.side, [['batch', 'This batch'], ['sim', 'Fraction fixed (± 1 s.e.)'], ['theory', 'Kimura\'s formula'], ['neutral', 'Neutral expectation'], ['ns', '2Ns'], ['t', 'Mean time to fixation: simulated / neutral theory']]);
      const plot = kit.plot(gb, { x: { label: 'selection coefficient s', min: -0.02, max: 0.1 }, y: { label: 'probability of fixation', min: 0 }, legend: true }, 190);
      function start(s) {
        const n = N(), reps = Math.max(1, Math.round(V.reps)), k0 = V.start === 0 ? 1 : Math.max(1, Math.round(V.start * 2 * n));
        batch = { N: n, s, start: V.start, p0: k0 / (2 * n), k: new Int32Array(reps).fill(k0), done: new Uint8Array(reps), gen: 0, fixed: 0, lost: 0, tsum: 0, left: reps, reps };
      }
      start(V.s);
      function step(budget) {
        const b = batch; if (!b || !b.left) return;
        const n2 = 2 * b.N, s = b.s;
        let work = 0;
        while (b.left && work < budget) {
          b.gen++;
          for (let i = 0; i < b.reps; i++) {
            if (b.done[i]) continue;
            const p = b.k[i] / n2, w = 1 + s * p;                               // mean fitness 1 + sp under additive selection
            const pSel = (p * p * (1 + s) + p * (1 - p) * (1 + s / 2)) / w;
            const k = binom(n2, pSel, R);
            b.k[i] = k; work++;
            if (k === 0) { b.done[i] = 1; b.lost++; b.left--; }
            else if (k === n2) { b.done[i] = 2; b.fixed++; b.tsum += b.gen; b.left--; }
          }
          if (b.gen > 40 * b.N + 2000) break;                                  // a safety stop; never reached in practice
        }
        if (!b.left || b.gen > 40 * b.N + 2000) {
          const u = b.fixed / b.reps;
          results.push({ N: b.N, start: b.start, s: b.s, u, se: Math.sqrt(Math.max(u * (1 - u), 1e-12) / b.reps), t: b.fixed ? b.tsum / b.fixed : null });
          b.left = 0;
          if (sweep && sweep.length) { const ns = sweep.shift(); ctl.set('s', ns); start(ns); }
          else sweep = null;
        }
      }
      const loop = kit.loop(() => {
        step(40000);
        const b = batch, n = N(), p0 = V.start === 0 ? 1 / (2 * n) : Math.max(1, Math.round(V.start * 2 * n)) / (2 * n);
        const mine = results.filter(r => r.N === n && r.start === V.start);
        const lastR = mine.length ? mine[mine.length - 1] : null;
        ro.set('batch', b ? (b.left ? 'generation ' + b.gen + ': ' : 'done: ') + b.fixed + ' fixed, ' + b.lost + ' lost, ' + b.left + ' undecided' : '—');
        ro.set('sim', lastR ? pct(lastR.u, 2) + ' ± ' + pct(lastR.se, 2) + ' (s = ' + lastR.s.toFixed(3) + ')' : 'run a batch');
        const sRef = lastR ? lastR.s : V.s;
        ro.set('theory', pct(kimura(n, sRef, p0), 2));
        ro.set('neutral', pct(p0, 2) + (V.start === 0 ? ' = 1/2N' : ''));
        ro.set('ns', (2 * n * sRef).toFixed(1));
        const tNeutral = V.start === 0 ? 4 * n : -4 * n * (1 - p0) * Math.log(1 - p0) / p0;
        ro.set('t', (lastR && lastR.t ? lastR.t.toFixed(0) : '—') + ' / ' + tNeutral.toFixed(0) + ' generations');
        const curve = Array.from({ length: 121 }, (_, i) => { const s = -0.02 + i * 0.001; return [s, kimura(n, s, p0)]; });
        plot.set({
          series: [{ pts: curve, label: 'Kimura, N = ' + n, dash: [6, 4] }, { pts: mine.map(r => [r.s, r.u]).sort((a, c) => a[0] - c[0]), label: 'simulated batches', line: false, dots: 4.5 }]
            .concat(mine.map(r => ({ pts: [[r.s, Math.max(0, r.u - r.se)], [r.s, r.u + r.se]], width: 1.2, hover: false }))),
          hlines: [{ y: p0, label: 'neutral' }]
        });
        // the batch, one square per population
        const c = st.begin(), C = kit.colors();
        if (!b) return;
        const shown = Math.min(b.reps, 1200), cols = Math.ceil(Math.sqrt(shown * (st.W - 20) / (st.H - 34))), rows = Math.ceil(shown / cols);
        const cell = Math.min((st.W - 20) / cols, (st.H - 34) / rows);
        for (let i = 0; i < shown; i++) {
          const x = 10 + (i % cols) * cell, y = 26 + Math.floor(i / cols) * cell;
          if (b.done[i] === 2) c.fillStyle = C.ok;
          else if (b.done[i] === 1) c.fillStyle = C.faint;
          else { c.fillStyle = C.accent; c.globalAlpha = 0.35 + 0.65 * b.k[i] / (2 * b.N); }
          c.fillRect(x + 0.5, y + 0.5, Math.max(1, cell - 1.5), Math.max(1, cell - 1.5));
          c.globalAlpha = 1;
        }
        kit.label(c, 'N = ' + b.N + ', s = ' + b.s.toFixed(3) + ' — ' + b.reps + ' populations' + (b.reps > shown ? ' (' + shown + ' shown)' : '') + ': green fixed, grey lost, blue undecided', 10, 12, { align: 'left', size: 12, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ bottlenecks and founder events */
  const SOURCE = [0.30, 0.20, 0.12, 0.10, 0.08, 0.06, 0.05, 0.04, 0.03, 0.02];
  const ALLELE_HUE = [210, 30, 140, 280, 55, 0, 180, 320, 95, 250];
  Hyper.sim('evo-bottleneck', {
    title: 'Bottlenecks and founders',
    blurb: `A population carries ten alleles of one gene, from common (30 %) to rare (2 %). Squeeze it through a bottleneck — a few survivors for a few generations — or let a handful of founders start a new population. Each generation is a random sample of the last one's gene copies. The bars compare the gene pool before and now; the graph follows heterozygosity (the chance that two copies drawn at random differ) against the theory $H_0\\prod(1 - 1/2N_i)$, and the fraction of the ten alleles still present.

**Try this**
- A bottleneck of 10 survivors for 5 generations: heterozygosity drops by about a quarter, but several rare alleles vanish at once. Allelic variety suffers more than heterozygosity.
- After the crash the population is large again, yet nothing comes back: lost alleles return only by mutation or migration.
- Compare 2 founders with 20: with two founders (four gene copies) at most four alleles can survive.
- Lengthen the bottleneck and watch the effective size of the whole run (the harmonic mean) fall towards the bottleneck size.
- Let several runs accumulate and compare the average heterozygosity kept with the theory.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const R = B.rng(1890);
      let running = true, run = null, runs = [], pauseT = 0;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Event', options: [['a bottleneck', 'bottle'], ['a founder event', 'founder']], value: 'bottle' },
        { id: 'Nb', label: 'Survivors or founders', min: 2, max: 200, value: 10, log: true, sig: 2 },
        { id: 'Tb', label: 'Generations at the small size', min: 1, max: 40, step: 1, value: 5 },
        { id: 'K', label: 'Population size before and after', min: 100, max: 5000, value: 1000, log: true, sig: 2 },
        { id: 'speed', label: 'Generations per second', min: 1, max: 30, step: 1, value: 8 },
        { type: 'buttons', items: [{ id: 'again', label: 'Run again', primary: true }, { id: 'pause', label: 'Pause / run' }, { id: 'reset', label: 'Clear the averages' }] }
      ], (id) => {
        if (id === 'pause') running = !running;
        else if (id === 'reset') { runs = []; newRun(); }
        else if (id === 'mode') { ctl.show('Tb', V.mode === 'bottle'); runs = []; newRun(); }
        else if (id === 'again') newRun();
        else if (id !== 'speed') { runs = []; newRun(); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gen', 'Generation / population size'], ['al', 'Alleles present (of 10)'], ['exp', 'Alleles expected to survive the first small generation'], ['H', 'Heterozygosity: now / theory / start'], ['ne', 'Effective size of the run so far (harmonic mean)'], ['avg', 'Average over finished runs']]);
      const plot = kit.plot(gb, { x: { label: 'generation', min: 0, max: 60 }, y: { label: 'heterozygosity, or share of alleles kept', min: 0, max: 1 }, legend: true }, 180);
      const H0 = 1 - SOURCE.reduce((a, p) => a + p * p, 0), PRE = 10, TOTAL = 60;
      const Ksz = () => Math.round(V.K), Nb = () => Math.max(2, Math.round(V.Nb));
      function sizeAt(g) {
        if (g <= PRE) return Ksz();
        if (V.mode === 'bottle') return g <= PRE + Math.round(V.Tb) ? Nb() : Ksz();
        return Math.min(Ksz(), Nb() * Math.pow(2, g - PRE - 1));
      }
      function newRun() { run = { g: 0, f: SOURCE.slice(), hist: [[0, H0, H0, 1]], th: H0, inv: 1 / Ksz(), sizes: [Ksz()], done: false }; pauseT = 0; }
      newRun();
      function sampleGen() {
        const g = run.g + 1, n = Math.round(sizeAt(g)), n2 = 2 * n;
        let rem = n2, pr = 1;
        const f = run.f, nf = [];
        for (let i = 0; i < f.length; i++) {
          const k = i === f.length - 1 || pr <= 1e-12 ? rem : binom(rem, clamp(f[i] / pr, 0, 1), R);
          nf.push(k / n2); rem -= k; pr -= f[i];
        }
        run.f = nf; run.g = g; run.sizes.push(n);
        run.th *= 1 - 1 / n2; run.inv += 1 / n;
        const H = 1 - nf.reduce((a, p) => a + p * p, 0), al = nf.filter(p => p > 0).length;
        run.hist.push([g, H, run.th, al / 10]);
        if (g >= TOTAL) { run.done = true; runs.push({ al, Hr: H / H0, thr: run.th / H0 }); }
      }
      let acc = 0;
      const loop = kit.loop((dt) => {
        if (running) {
          if (!run.done) { acc += dt * V.speed; let k = 0; while (acc >= 1 && !run.done && k < 100) { sampleGen(); acc -= 1; k++; } }
          else { pauseT += dt; if (pauseT > 2) newRun(); }
        }
        const r = run, last = r.hist[r.hist.length - 1], al = r.f.filter(p => p > 0).length;
        const firstSmall = Nb();
        ro.set('gen', r.g + ' / ' + (r.sizes[r.sizes.length - 1]));
        ro.set('al', String(al));
        ro.set('exp', SOURCE.reduce((a, p) => a + 1 - Math.pow(1 - p, 2 * firstSmall), 0).toFixed(1) + ' (sample of ' + 2 * firstSmall + ' gene copies)');
        ro.set('H', last[1].toFixed(3) + ' / ' + last[2].toFixed(3) + ' / ' + H0.toFixed(3));
        ro.set('ne', (r.sizes.length / r.inv).toFixed(0) + ' over ' + r.sizes.length + ' generations');
        if (runs.length) {
          const m = k => runs.reduce((a, x) => a + x[k], 0) / runs.length;
          ro.set('avg', runs.length + ' runs: ' + m('al').toFixed(1) + ' alleles kept, heterozygosity kept ' + pct(m('Hr'), 0) + ' (theory ' + pct(m('thr'), 0) + ')');
        } else ro.set('avg', 'none yet');
        plot.set({ series: [
          { pts: r.hist.map(h => [h[0], h[1]]), label: 'heterozygosity' },
          { pts: r.hist.map(h => [h[0], h[2]]), label: 'theory H₀∏(1 − 1/2N)', dash: [6, 4] },
          { pts: r.hist.map(h => [h[0], h[3]]), label: 'share of the 10 alleles present' }
        ] });
        // drawing: the population size through time (log scale, as a bottle), then the gene pool before and now
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const x0 = 70, x1 = W - 14, yc = 52, hmax = 34, lmax = Math.log(5000), lmin = Math.log(1);
        const tx = g => x0 + (x1 - x0) * g / TOTAL, th = n => 3 + hmax * (Math.log(Math.max(1, n)) - lmin) / (lmax - lmin);
        c.fillStyle = C.accent; c.globalAlpha = 0.25; c.beginPath();
        for (let g = 0; g <= TOTAL; g++) { const y = yc - th(sizeAt(g)); g ? c.lineTo(tx(g), y) : c.moveTo(tx(g), y); }
        for (let g = TOTAL; g >= 0; g--) c.lineTo(tx(g), yc + th(sizeAt(g)));
        c.closePath(); c.fill(); c.globalAlpha = 1;
        c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(tx(r.g), yc - hmax - 6); c.lineTo(tx(r.g), yc + hmax + 6); c.stroke();
        kit.label(c, 'population size', 8, yc - 8, { align: 'left', size: 11, color: C.muted });
        kit.label(c, '(log scale)', 8, yc + 8, { align: 'left', size: 11, color: C.muted });
        kit.label(c, 'N = ' + sizeAt(r.g), tx(r.g), yc - hmax - 12, { size: 11, color: C.warn });
        const bars = [['before', SOURCE], ['now', r.f]], by0 = yc + hmax + 30, bh = Math.max(16, (Hh - by0 - 26) / 2 - 8);
        bars.forEach(([name, f], j) => {
          const y = by0 + j * (bh + 16);
          kit.label(c, name, 8, y + bh / 2, { align: 'left', size: 12, color: C.text });
          let x = x0;
          f.forEach((p, i) => {
            const w = (x1 - x0) * p;
            if (w > 0) { c.fillStyle = 'hsl(' + ALLELE_HUE[i] + ' 65% ' + (C.dark ? 58 : 50) + '%)'; c.fillRect(x, y, w, bh); if (w > 18) kit.label(c, String(i + 1), x + w / 2, y + bh / 2, { size: 10.5, color: '#fff' }); }
            x += w;
          });
          c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x0 + 0.5, y + 0.5, x1 - x0 - 1, bh - 1);
        });
        const lost = SOURCE.map((_, i) => i + 1).filter((_, i) => !(r.f[i] > 0));
        kit.label(c, lost.length ? 'lost: allele' + (lost.length > 1 ? 's ' : ' ') + lost.join(', ') : 'no alleles lost yet', x0, Hh - 10, { align: 'left', size: 11.5, color: lost.length ? C.bad : C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ reading a phylogenetic tree */
  // ages of the nodes in millions of years (rounded published estimates); chars: a shared derived character on the
  // branch leading to that node or tip
  const TREES = {
    vertebrates: { root: { t: 465, name: 'jawed vertebrates', chars: 'jaws', kids: [
      { tip: 'Shark' },
      { t: 430, name: 'bony vertebrates', chars: 'bony skeleton', kids: [
        { tip: 'Tuna' },
        { t: 350, name: 'tetrapods', chars: 'four limbs with digits', kids: [
          { tip: 'Frog' },
          { t: 320, name: 'amniotes', chars: 'amniotic egg', kids: [
            { t: 90, name: 'placental mammals', chars: 'hair, milk', kids: [{ tip: 'Mouse' }, { tip: 'Human' }] },
            { t: 280, name: 'reptiles, birds included', kids: [
              { tip: 'Lizard' },
              { t: 245, name: 'archosaurs', chars: '4-chambered heart (mammals: separately)', kids: [{ tip: 'Crocodile' }, { tip: 'Bird', chars: 'feathers, beak' }] }
            ] }
          ] }
        ] }
      ] }
    ] } },
    primates: { root: { t: 29, name: 'Old World monkeys and apes', kids: [
      { tip: 'Macaque' },
      { t: 19, name: 'apes', chars: 'no tail', kids: [
        { tip: 'Gibbon' },
        { t: 15, name: 'great apes', kids: [
          { tip: 'Orangutan' },
          { t: 9, name: 'African apes', kids: [
            { tip: 'Gorilla' },
            { t: 6.5, name: 'humans and chimpanzees', kids: [
              { tip: 'Human', chars: 'upright walking, large brain' },
              { t: 1.8, name: 'chimpanzees', kids: [{ tip: 'Chimpanzee' }, { tip: 'Bonobo' }] }
            ] }
          ] }
        ] }
      ] }
    ] } }
  };
  Hyper.sim('evo-tree', {
    title: 'Reading a phylogenetic tree',
    blurb: `A tree of real species on a time axis (millions of years ago). Click a **node** (a dot) to rotate it — its two branches swap places, and the order of the names changes, but every common ancestor stays exactly where it was: the tree means the same. Click two **names** to find their most recent common ancestor. *Ask me a question* tests tree reading, and often draws the wrong answer right next to the species in question.

**Try this**
- Rotate nodes until the frog sits next to the tuna. Is it now closer to the tuna? Click Frog and Tuna, then Frog and Human, and compare the ages of the common ancestors.
- Which is the crocodile's closer relative, the lizard or the bird? The branching point, not the page, decides.
- Show the characters: each is marked on the branch where it arose and is shared by everything beyond it. The four-chambered heart of crocodiles and birds evolved separately in mammals — similarity that misleads.
- Switch to the primates: humans and chimpanzees shared an ancestor about 6–7 million years ago; chimpanzees and bonobos are each other's closest relatives, not ours.`,
    mount(box, kit, params) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const R = B.rng(1837);
      let tree = null, nodes = [], tips = [], sel = [], quiz = null, score = [0, 0], msg = '', hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'tree', type: 'select', label: 'Tree', options: [['Vertebrates', 'vertebrates'], ['Apes and monkeys', 'primates']], value: params && params.tree === 'primates' ? 'primates' : 'vertebrates' },
        { id: 'style', type: 'select', label: 'Drawn as', options: [['rectangular branches', 'rect'], ['diagonal branches', 'diag']], value: 'rect' },
        { id: 'chars', type: 'check', label: 'Show characters on the branches', value: true },
        { type: 'buttons', items: [{ id: 'ask', label: 'Ask me a question', primary: true }, { id: 'shuffle', label: 'Rotate random nodes' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'tree' || id === 'reset') build();
        else if (id === 'shuffle') { for (const n of nodes) if (!n.tip && R() < 0.5) n.flip = !n.flip; relayout(); msg = 'Rotated at random: the names moved, the relationships did not.'; }
        else if (id === 'ask') ask();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['order', 'Names from top to bottom'], ['pair', 'Common ancestor'], ['sister', 'Sister group of the first name'], ['quiz', 'Question'], ['score', 'Score'], ['msg', '']]);
      function build() {
        nodes = []; tips = []; sel = []; quiz = null; msg = '';
        const walk = (d, parent) => {
          const n = { tip: d.tip || null, name: d.tip || d.name, t: d.tip ? 0 : d.t, chars: d.chars || '', parent, kids: [], flip: false, y: 0, yd: null };
          nodes.push(n);
          if (d.tip) tips.push(n);
          else n.kids = d.kids.map(k => walk(k, n));
          return n;
        };
        tree = walk(TREES[V.tree].root, null);
        relayout();
      }
      const order = () => { const out = []; const go = n => { if (n.tip) out.push(n); else (n.flip ? n.kids.slice().reverse() : n.kids).forEach(go); }; go(tree); return out; };
      function relayout() {
        order().forEach((n, i) => { n.y = i; });
        const up = n => { if (!n.tip) { n.kids.forEach(up); n.y = n.kids.reduce((a, k) => a + k.y, 0) / n.kids.length; } };
        up(tree);
        for (const n of nodes) if (n.yd == null) n.yd = n.y;
      }
      const ancestors = n => { const a = []; for (let x = n; x; x = x.parent) a.push(x); return a; };
      const mrca = (a, b) => { const A = new Set(ancestors(a)); for (let x = b; x; x = x.parent) if (A.has(x)) return x; return tree; };
      const tipsOf = n => n.tip ? [n] : n.kids.reduce((a, k) => a.concat(tipsOf(k)), []);
      const ago = t => t >= 10 ? Math.round(t) + ' million years ago' : t + ' million years ago';
      const lc = n => n.name.toLowerCase();
      function ask() {
        const x = tips[Math.floor(R() * tips.length)], others = tips.filter(t => t !== x), pairs = [];
        for (const y of others) for (const z of others) if (y !== z && mrca(x, y).t < mrca(x, z).t) pairs.push([y, z]);
        if (!pairs.length) return;
        const [y, z] = pairs[Math.floor(R() * pairs.length)];
        // tempt the misreading: rotate nodes until the more distant species is drawn next to the one asked about
        let best = null, bestScore = -1;
        for (let k = 0; k < 60; k++) {
          for (const n of nodes) if (!n.tip && R() < 0.5) n.flip = !n.flip;
          const o = order(), ix = o.indexOf(x), sc = (Math.abs(o.indexOf(z) - ix) === 1 ? 2 : 0) + (Math.abs(o.indexOf(y) - ix) > 1 ? 1 : 0);
          if (sc > bestScore) { bestScore = sc; best = nodes.map(n => n.flip); }
          if (sc === 3) break;
        }
        nodes.forEach((n, i) => { n.flip = best[i]; });
        relayout();
        const ab = R() < 0.5 ? [y, z] : [z, y];
        quiz = { x, y, z, text: 'Which is the closer relative of the ' + lc(x) + ': the ' + lc(ab[0]) + ' or the ' + lc(ab[1]) + '? Click its name.' };
        sel = [x]; msg = '';
      }
      function clickTip(n) {
        if (quiz && (n === quiz.y || n === quiz.z)) {
          const ok = n === quiz.y, a1 = mrca(quiz.x, quiz.y), a2 = mrca(quiz.x, quiz.z);
          score[1]++; if (ok) score[0]++;
          msg = (ok ? 'Right. ' : 'Not quite. ') + 'The ' + lc(quiz.x) + ' and the ' + lc(quiz.y) + ' share an ancestor (' + a1.name + ') about ' + ago(a1.t) + '; the ' + lc(quiz.x) + ' and the ' + lc(quiz.z) + ' only about ' + ago(a2.t) + ' (' + a2.name + ')' + (ok ? '.' : ', however close they are drawn.');
          sel = [quiz.x, quiz.y]; quiz = null;
          return;
        }
        if (sel.length >= 2 || sel.includes(n)) sel = [n]; else sel.push(n);
        msg = '';
      }
      kit.click(st, p => {
        let best = null, bd = 1e9;
        for (const h of hits) { const d = h.tip ? (p.x >= h.x - 4 && p.x <= h.x + h.w && Math.abs(p.y - h.y) < 11 ? 0 : 1e9) : (p.x - h.x) ** 2 + (p.y - h.y) ** 2; if (d < bd && d < (h.tip ? 1 : 150)) { bd = d; best = h; } }
        if (!best) return;
        if (best.tip) clickTip(best.n);
        else { best.n.flip = !best.n.flip; relayout(); msg = 'Rotated the node "' + best.n.name + '": same tree, different drawing.'; }
      }, p => hits.some(h => h.tip ? p.x >= h.x - 4 && p.x <= h.x + h.w && Math.abs(p.y - h.y) < 11 : (p.x - h.x) ** 2 + (p.y - h.y) ** 2 < 150));
      build();
      const loop = kit.loop((dt) => {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, T = tree.t;
        const X0 = 22, X1 = W - 118, Y0 = 30, Y1 = H - 44, nT = tips.length;
        const tx = t => X0 + (X1 - X0) * (1 - t / T), ty = y => Y0 + (Y1 - Y0) * y / Math.max(1, nT - 1);
        for (const n of nodes) n.yd += (n.y - n.yd) * Math.min(1, dt * 9);
        // the time axis
        const step = Hyper.niceStep(T, 6);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(X0, Y1 + 18.5); c.lineTo(X1, Y1 + 18.5); c.stroke();
        for (let v = 0; v <= T + 1e-9; v += step) {
          const x = tx(v);
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x + 0.5, Y0 - 8); c.lineTo(x + 0.5, Y1 + 18); c.stroke();
          kit.label(c, String(+v.toFixed(1)), x, Y1 + 30, { size: 10.5, color: C.muted });
        }
        kit.label(c, 'million years ago', X1 + 8, Y1 + 30, { align: 'left', size: 10.5, color: C.muted });
        // highlight: the path from each selected tip to their common ancestor
        const hl = new Set(), anc = sel.length === 2 ? mrca(sel[0], sel[1]) : null;
        for (const s of sel) for (let x = s; x && x !== (anc || null); x = x.parent) { hl.add(x); if (!anc) break; }
        const edge = (n, k) => {
          const on = hl.has(k);
          c.strokeStyle = on ? C.warn : C.text; c.lineWidth = on ? 3 : 1.6;
          c.beginPath();
          if (V.style === 'rect') { c.moveTo(tx(n.t), ty(n.yd)); c.lineTo(tx(n.t), ty(k.yd)); c.lineTo(tx(k.t), ty(k.yd)); }
          else { c.moveTo(tx(n.t), ty(n.yd)); c.lineTo(tx(k.t), ty(k.yd)); }
          c.stroke();
        };
        for (const n of nodes) for (const k of n.kids) edge(n, k);
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X0 - 12, ty(tree.yd)); c.lineTo(tx(tree.t), ty(tree.yd)); c.stroke();
        hits = [];
        // characters on the branches
        if (V.chars) for (const n of nodes) {
          if (!n.chars) continue;
          const pt = n.parent ? n.parent.t : T * 1.03, xa = tx(pt), xb = tx(n.t), xm = V.style === 'rect' ? (xa + xb) / 2 : xa + (xb - xa) * 0.5;
          const ym = V.style === 'rect' || !n.parent ? ty(n.yd) : ty((n.parent.yd + n.yd) / 2);
          c.fillStyle = C.accent; c.fillRect(xm - 2, ym - 7, 4, 14);
          kit.label(c, n.chars, xm, ym - 13, { size: 10, color: C.accent, bg: C.bg2 });
        }
        // nodes and names
        for (const n of nodes) {
          const x = tx(n.t), y = ty(n.yd);
          if (n.tip) {
            const on = sel.includes(n), q = quiz && (n === quiz.y || n === quiz.z);
            kit.label(c, n.name, x + 8, y, { align: 'left', size: 13, color: on ? C.warn : q ? C.accent : C.text, weight: on || q ? 700 : 500 });
            hits.push({ tip: true, n, x: x + 6, y, w: 9 + 7.4 * n.name.length });
          } else {
            kit.dot(c, x, y, n === anc ? 6.5 : 5, n === anc ? C.warn : C.accent, C.bg2);
            if (n === anc) kit.label(c, n.name + ', ' + ago(n.t), x + 8, y + 13, { align: 'left', size: 11, color: C.warn, bg: C.bg2 });
            hits.push({ tip: false, n, x, y });
          }
        }
        kit.label(c, 'click a dot to rotate it · click two names to find their common ancestor', 10, 12, { align: 'left', size: 11.5, color: C.muted });
        // readouts
        ro.set('order', order().map(n => n.name).join(', '));
        if (anc) ro.set('pair', sel[0].name + ' and ' + sel[1].name + ': ' + anc.name + ', about ' + ago(anc.t));
        else ro.set('pair', sel.length ? 'now click a second name' : 'click two names');
        if (sel.length && sel[0].parent) { const sis = sel[0].parent.kids.filter(k => k !== sel[0])[0]; ro.set('sister', sel[0].name + ' → ' + tipsOf(sis).map(t => t.name).join(' + ')); }
        else ro.set('sister', '—');
        ro.set('quiz', quiz ? quiz.text : '—');
        ro.set('score', score[0] + ' of ' + score[1]);
        ro.set('msg', msg);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a molecular clock */
  Hyper.sim('evo-clock', {
    title: 'A molecular clock',
    blurb: `Two species split from a common ancestor. Along each lineage every DNA site mutates now and then, at random (a Poisson process at the substitution rate), to one of the other three bases. Count the sites that now differ, divide by twice the rate, and you have the time since the split. In the squares below, one per site, orange sites differ (a red dot: changed more than once) and outlined sites changed but happen to match again — hidden changes. The graph shows why old splits need the Jukes–Cantor correction.

**Try this**
- Press *Play*: at first the differences grow in step with time (the straight line), and the estimate tracks the true time.
- Keep going past 300 million years (at 10⁻⁹ per year): hidden changes pile up, the raw count falls below the line and the naive estimate lags far behind; the corrected one keeps up — until the sequences approach 75 % different and nothing can be read.
- Shorten the sequence to 100 sites: the estimate jitters, because a clock counts random events. Long sequences give tighter estimates.
- Raise the rate to 5 × 10⁻⁹ (a fast gene, or a short-lived species): the same time gives five times the distance — the clock must be calibrated for each gene and lineage.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      let playing = false, seed = 1, trail = [];
      const ctl = kit.controls(box.side, [
        { id: 't', label: 'Time since the split', min: 0, max: 1500, step: 1, value: 50, unit: 'Myr' },
        { id: 'mu', label: 'Substitution rate (× 10⁻⁹ per site per year)', min: 0.2, max: 5, step: 0.1, value: 1 },
        { id: 'L', label: 'Sequence length (sites)', min: 100, max: 3000, value: 1000, log: true, sig: 2 },
        { id: 'speed', label: 'Clock speed (million years per second)', min: 5, max: 200, value: 40, log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'play', label: 'Play / pause', primary: true }, { id: 'zero', label: 'Back to the split' }, { id: 'new', label: 'New sequences' }] }
      ], (id) => {
        if (id === 'play') { playing = !playing; if (playing && V.t >= 1500) ctl.set('t', 0); }
        else if (id === 'zero') { playing = false; ctl.set('t', 0); trail = []; }
        else if (id === 'new') { seed++; make(); }
        else if (id === 'L') make();
        else if (id === 'mu') trail = [];
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'True time since the split'], ['p', 'Sites that differ'], ['subs', 'Substitutions that happened / hidden'], ['d', 'Jukes–Cantor distance d'], ['est', 'Estimated time: naive p/2r · corrected d/2r']]);
      const plot = kit.plot(gb, { x: { label: 'time since the split (million years)', min: 0 }, y: { label: 'fraction of sites that differ', min: 0, max: 0.8 }, legend: true }, 180);
      const TAUMAX = 5e-9 * 1.5e9 + 1;                        // expected substitutions per site at the fastest rate and longest time
      let L = 0, anc = null, start = null, times = null, offs = null;
      function make() {
        const R = B.rng(seed * 7919);
        L = Math.max(10, Math.round(V.L));
        anc = new Uint8Array(L); start = new Int32Array(2 * L + 1);
        const tt = [], oo = [];
        for (let i = 0; i < L; i++) anc[i] = Math.floor(R() * 4);
        for (let j = 0; j < 2 * L; j++) {
          start[j] = tt.length;
          for (let tau = -Math.log(Math.max(1e-12, R())); tau < TAUMAX; tau -= Math.log(Math.max(1e-12, R()))) { tt.push(tau); oo.push(Math.floor(R() * 3)); }
        }
        start[2 * L] = tt.length;
        times = Float64Array.from(tt); offs = Uint8Array.from(oo); trail = [];
      }
      make();
      function state(tMyr) {
        const tau = V.mu * 1e-9 * tMyr * 1e6;                 // expected substitutions per site along each lineage
        const a = new Uint8Array(L), b = new Uint8Array(L), nsub = new Uint8Array(L);
        let subs = 0, diff = 0;
        for (let i = 0; i < L; i++) {
          let x = anc[i], y = anc[i], k = 0;
          for (let e = start[i]; e < start[i + 1] && times[e] <= tau; e++) { x = (x + 1 + offs[e]) % 4; k++; }
          for (let e = start[L + i]; e < start[L + i + 1] && times[e] <= tau; e++) { y = (y + 1 + offs[e]) % 4; k++; }
          a[i] = x; b[i] = y; nsub[i] = Math.min(255, k); subs += k; if (x !== y) diff++;
        }
        return { a, b, nsub, subs, diff, p: diff / L };
      }
      const BASES = 'ACGT';
      const loop = kit.loop((dt) => {
        if (playing) { let t = V.t + dt * V.speed; if (t >= 1500) { t = 1500; playing = false; } ctl.set('t', t); }
        const s = state(V.t), r = V.mu * 1e-9, tY = V.t * 1e6;
        if (!trail.length || Math.abs(trail[trail.length - 1][0] - V.t) > 1) { trail.push([V.t, s.p]); if (trail.length > 600) trail.shift(); }
        const sat = s.p >= 0.745, d = sat ? Infinity : -0.75 * Math.log(1 - 4 * s.p / 3);
        const seD = sat ? 0 : Math.sqrt(s.p * (1 - s.p) / L) / (1 - 4 * s.p / 3);
        ro.set('T', V.t.toFixed(0) + ' million years');
        ro.set('p', s.diff + ' of ' + L + ' (' + pct(s.p) + ')');
        ro.set('subs', s.subs + ' / ' + (s.subs - s.diff) + ' hidden');
        ro.set('d', sat ? 'saturated: too many changes to count' : d.toFixed(4) + ' substitutions per site');
        ro.set('est', (s.p / (2 * r) / 1e6).toFixed(0) + ' Myr · ' + (sat ? 'cannot be read' : (d / (2 * r) / 1e6).toFixed(0) + ' ± ' + (seD / (2 * r) / 1e6).toFixed(0) + ' Myr'));
        const xmax = Math.max(100, Math.min(1500, V.t * 1.3 + 20));
        const theory = Array.from({ length: 101 }, (_, i) => { const t = xmax * i / 100; return [t, 0.75 * (1 - Math.exp(-8 * r * t * 1e6 / 3))]; });
        const line = [[0, 0], [Math.min(xmax, 0.8 / (2 * r) / 1e6), Math.min(0.8, 2 * r * xmax * 1e6)]];
        plot.set({ x: { label: 'time since the split (million years)', min: 0, max: xmax }, series: [
          { pts: line, label: 'if every change showed: 2rt', dash: [3, 4] },
          { pts: theory, label: 'expected with hidden changes', dash: [7, 4] },
          { pts: trail.slice().sort((u, w) => u[0] - w[0]), label: 'these two sequences', line: false, dots: 2.5 }
        ], marks: [{ x: V.t, y: s.p, label: 'now' }], hlines: [{ y: 0.75, label: '75 %: random sequences' }] });
        // drawing: the first sites as letters, then every site as a square
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H;
        const nl = Math.max(10, Math.min(L, Math.floor((W - 90) / 11)));
        kit.label(c, 'species 1', 8, 16, { align: 'left', size: 11.5, color: C.muted });
        kit.label(c, 'species 2', 8, 34, { align: 'left', size: 11.5, color: C.muted });
        for (let i = 0; i < nl; i++) {
          const x = 80 + i * 11, dif = s.a[i] !== s.b[i];
          if (dif) { c.fillStyle = C.warn; c.globalAlpha = 0.3; c.fillRect(x - 5, 7, 10, 36); c.globalAlpha = 1; }
          kit.label(c, BASES[s.a[i]], x, 16, { size: 11.5, color: dif ? C.warn : C.text, weight: 600 });
          kit.label(c, BASES[s.b[i]], x, 34, { size: 11.5, color: dif ? C.warn : C.text, weight: 600 });
        }
        const shown = Math.min(L, 1500), top = 54, cols = Math.ceil(Math.sqrt(shown * (W - 20) / Math.max(40, H - top - 24))), rows = Math.ceil(shown / cols);
        const cell = Math.min((W - 20) / cols, (H - top - 24) / rows);
        for (let i = 0; i < shown; i++) {
          const x = 10 + (i % cols) * cell, y = top + Math.floor(i / cols) * cell, dif = s.a[i] !== s.b[i], w = Math.max(1, cell - 1.5);
          if (dif) { c.fillStyle = C.warn; c.fillRect(x, y, w, w); }
          else if (s.nsub[i]) { c.strokeStyle = C.accent; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, w - 1, w - 1); }
          else { c.fillStyle = C.faint; c.globalAlpha = 0.35; c.fillRect(x, y, w, w); c.globalAlpha = 1; }
          if (dif && s.nsub[i] > 1) { c.fillStyle = C.bad; c.fillRect(x + w / 2 - 1, y + w / 2 - 1, 2, 2); }
        }
        kit.label(c, 'orange: differ · outlined: changed but match again · grey: never changed' + (L > shown ? ' (first ' + shown + ' sites)' : ''), 10, H - 10, { align: 'left', size: 11, color: C.muted });
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the history of the Earth as a day */
  const EARTH = 4540;                                              // million years
  // [age in million years, event] — rounded published dates
  const EVENTS = [
    [4540, 'The Earth forms'], [4510, 'The Moon-forming impact'], [4400, 'Oldest mineral grains (zircons)'], [4000, 'Oldest rocks'],
    [3700, 'Earliest traces of life'], [3480, 'Stromatolites built by microbes'], [2700, 'Cyanobacteria making oxygen'],
    [2400, 'Great Oxidation Event'], [1700, 'Cells with nuclei (eukaryotes)'], [1050, 'First multicellular algae'],
    [720, 'Snowball Earth begins'], [575, 'Ediacaran organisms'], [539, 'Cambrian explosion'], [470, 'Plants reach land'],
    [445, 'End-Ordovician mass extinction'], [375, 'Tiktaalik, a fish with legs'], [372, 'Late Devonian mass extinction'],
    [320, 'First amniotes: eggs on land'], [252, 'End-Permian mass extinction'], [233, 'First dinosaurs'], [225, 'First mammals'],
    [201, 'End-Triassic mass extinction'], [150, 'Archaeopteryx'], [130, 'Flowering plants'], [66, 'Asteroid: the dinosaurs\' end'],
    [56, 'Early primates'], [6.5, 'Our lineage splits from the chimpanzees\''], [3.2, 'Lucy, Australopithecus afarensis'],
    [2.6, 'Oldest Oldowan stone tools'], [1.9, 'Homo erectus'], [0.3, 'Homo sapiens'], [0.06, 'Modern humans spread beyond Africa'],
    [0.012, 'Farming begins'], [0.005, 'Writing'], [0.00025, 'The industrial revolution']
  ];
  const DIVS = [[4540, 4000, 'Hadean eon', 0], [4000, 2500, 'Archean eon', 25], [2500, 539, 'Proterozoic eon', 55], [539, 252, 'Paleozoic era', 195], [252, 66, 'Mesozoic era', 140], [66, 0, 'Cenozoic era', 40]];
  const PERIODS = [[539, 485, 'Cambrian'], [485, 444, 'Ordovician'], [444, 419, 'Silurian'], [419, 359, 'Devonian'], [359, 299, 'Carboniferous'], [299, 252, 'Permian'], [252, 201, 'Triassic'], [201, 145, 'Jurassic'], [145, 66, 'Cretaceous'], [66, 23, 'Paleogene'], [23, 2.58, 'Neogene'], [2.58, 0, 'Quaternary']];
  const SPANS = { day: EARTH, hour: EARTH / 24, minute: EARTH / 1440, second: EARTH / 86400 };
  function clockOf(age, dec) {
    const S = 86400 * (1 - age / EARTH), h = Math.floor(S / 3600 + 1e-9), m = Math.floor((S - 3600 * h) / 60 + 1e-9), s = S - 3600 * h - 60 * m;
    const ss = dec ? s.toFixed(dec).padStart(3 + dec, '0') : String(Math.min(59, Math.floor(s + 1e-9))).padStart(2, '0');
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + ss;
  }
  const grp = n => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  function ageText(a) {
    if (a >= 1000) return (a / 1000).toFixed(2) + ' billion years ago';
    if (a >= 1) return (a >= 10 ? a.toFixed(0) : a.toFixed(1)) + ' million years ago';
    if (a >= 0.001) return grp(a * 1000) + ' thousand years ago';
    return a * 1e6 < 0.5 ? 'now' : grp(a * 1e6) + ' years ago';
  }
  Hyper.sim('evo-earth-clock', {
    title: 'The Earth\'s history in one day',
    blurb: `Squeeze the 4.54 billion years of the Earth's history into 24 hours: midnight at the top is the Earth's formation, and the next midnight is now. One hour is 189 million years, one minute 3.2 million years, one second about 52 500 years. Move the hand, click the dial, or jump to an event; zoom in to see the last hour, minute and second.

**Try this**
- Press *Play the day* and watch how long the Earth is only microbes: animals do not appear until after 20:57.
- Jump to the Great Oxidation Event: oxygen fills the air at about 11:19, halfway through the day.
- Zoom to the last hour: the dinosaurs rise and fall between 22:46 and 23:39, and mammals take over.
- Zoom to the last minute: our lineage splits from the chimpanzees' about two minutes to midnight, and *Homo sapiens* appears only in the last six seconds.
- Zoom to the last second: farming, writing and the industrial revolution all fit in the final quarter of it.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 300, maxH: 560 });
      let zoom = 'day', playing = false;
      const decOf = z => z === 'second' ? 3 : z === 'minute' ? 1 : 0;
      const ctl = kit.controls(box.side, [
        { id: 'zoom', type: 'select', label: 'The dial shows', options: [['the whole day: 4.54 billion years', 'day'], ['the last hour: 189 million years', 'hour'], ['the last minute: 3.2 million years', 'minute'], ['the last second: 52 500 years', 'second']], value: 'day' },
        { id: 'pos', label: 'Hand', min: 0, max: 1, step: 0.0005, value: 1 - 539 / EARTH, fmt: v => clockOf(SPANS[zoom] * (1 - v), decOf(zoom)) },
        { id: 'go', type: 'select', label: 'Jump to', options: [['— choose an event —', -1]].concat(EVENTS.map((e, i) => [e[1], i])), value: -1 },
        { type: 'buttons', items: [{ id: 'play', label: 'Play the day', primary: true }, { id: 'stop', label: 'Stop' }] }
      ], (id, v) => {
        if (id === 'zoom') { const age = ageNow(); zoom = v; ctl.set('pos', age <= SPANS[zoom] ? 1 - age / SPANS[zoom] : 0); }
        else if (id === 'go' && v >= 0) {
          const a = EVENTS[v][0];
          zoom = a <= SPANS.second ? 'second' : a <= SPANS.minute ? 'minute' : a <= SPANS.hour ? 'hour' : 'day';
          ctl.set('zoom', zoom); ctl.set('pos', 1 - a / SPANS[zoom]); playing = false;
        }
        else if (id === 'play') { playing = true; if (V.pos >= 0.999) ctl.set('pos', 0); }
        else if (id === 'stop') playing = false;
      });
      const V = ctl.values;
      const ageNow = () => SPANS[zoom] * (1 - V.pos);
      const ro = kit.readout(box.side, [['clock', 'Time on the clock'], ['age', 'Real time'], ['div', 'Eon or era, period'], ['ev', 'Nearest event'], ['scale', 'One turn of this dial']]);
      let geo = { cx: 0, cy: 0, r: 1 };
      kit.click(st, p => {
        const dx = p.x - geo.cx, dy = p.y - geo.cy;
        if (dx * dx + dy * dy > geo.r * geo.r * 1.2) return;
        ctl.set('pos', ((Math.atan2(dx, -dy) / (2 * Math.PI)) + 1) % 1); playing = false;
      }, p => (p.x - geo.cx) ** 2 + (p.y - geo.cy) ** 2 < geo.r * geo.r * 1.2);
      const loop = kit.loop((dt) => {
        if (playing) { let v = V.pos + dt / 24; if (v >= 1) { v = 1; playing = false; } ctl.set('pos', v); }
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, span = SPANS[zoom], age = ageNow(), dec = decOf(zoom);
        const r = Math.max(60, Math.min(H / 2 - 26, W * 0.27)), cx = r + 22, cy = H / 2 + 4;
        geo = { cx, cy, r };
        const ang = a => -Math.PI / 2 + 2 * Math.PI * (1 - a / span);
        // eons and eras as coloured rings; periods in an inner ring (Phanerozoic)
        for (const [a0, a1, , hue] of DIVS) {
          if (a1 >= span) continue;
          const s0 = ang(Math.min(a0, span)), s1 = ang(a1);
          c.fillStyle = 'hsl(' + hue + ' 55% ' + (C.dark ? 34 : 78) + '%)';
          c.beginPath(); c.arc(cx, cy, r, s0, s1); c.arc(cx, cy, r * 0.8, s1, s0, true); c.closePath(); c.fill();
        }
        PERIODS.forEach(([a0, a1], i) => {
          if (a1 >= span) return;
          c.fillStyle = 'hsl(' + (i * 29 % 360) + ' 45% ' + (C.dark ? 28 : 84) + '%)';
          const s0 = ang(Math.min(a0, span)), s1 = ang(a1);
          c.beginPath(); c.arc(cx, cy, r * 0.8, s0, s1); c.arc(cx, cy, r * 0.7, s1, s0, true); c.closePath(); c.fill();
        });
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();
        // ticks: hours, minutes, seconds or tenths of a second
        const nt = zoom === 'day' ? 24 : zoom === 'second' ? 10 : 60, every = zoom === 'day' ? 3 : zoom === 'second' ? 1 : 5;
        for (let k = 0; k < nt; k++) {
          const a = -Math.PI / 2 + 2 * Math.PI * k / nt, big = k % every === 0;
          c.strokeStyle = C.text; c.lineWidth = big ? 2 : 1;
          c.beginPath(); c.moveTo(cx + Math.cos(a) * r * (big ? 0.62 : 0.66), cy + Math.sin(a) * r * (big ? 0.62 : 0.66)); c.lineTo(cx + Math.cos(a) * r * 0.7, cy + Math.sin(a) * r * 0.7); c.stroke();
          if (big) {
            const lab = zoom === 'day' ? String(k).padStart(2, '0') + ':00' : zoom === 'hour' ? '23:' + String(k).padStart(2, '0') : zoom === 'minute' ? ':' + String(k).padStart(2, '0') : '.' + k;
            kit.label(c, lab, cx + Math.cos(a) * r * 0.5, cy + Math.sin(a) * r * 0.5, { size: 10.5, color: C.muted });
          }
        }
        // events on the rim
        let near = null, nd = Infinity;
        for (const e of EVENTS) {
          if (e[0] > span * 1.0001) continue;
          const a = ang(e[0]), d = Math.abs(e[0] - age);
          if (d < nd) { nd = d; near = e; }
          kit.dot(c, cx + Math.cos(a) * r * 0.9, cy + Math.sin(a) * r * 0.9, 3.2, C.text, C.bg2);
        }
        // the hand
        const ah = ang(age);
        c.strokeStyle = C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(ah) * r * 1.02, cy + Math.sin(ah) * r * 1.02); c.stroke();
        kit.dot(c, cx, cy, 5, C.warn);
        kit.label(c, clockOf(age, dec), cx, cy + 18, { size: 13, color: C.text, weight: 700, bg: C.bg2 });
        kit.label(c, zoom === 'day' ? 'midnight: the Earth forms' : 'the last ' + zoom + ' of the day', cx, cy - r - 12, { size: 11, color: C.muted });
        // the events of this dial as a list, the nearest highlighted
        const list = EVENTS.filter(e => e[0] <= span * 1.0001), lx = cx + r + 24, rowH = 17, maxRows = Math.max(3, Math.floor((H - 20) / rowH));
        const ni = Math.max(0, list.indexOf(near)), first = Math.max(0, Math.min(list.length - maxRows, ni - Math.floor(maxRows / 2)));
        if (lx < W - 60) list.slice(first, first + maxRows).forEach((e, i) => {
          const on = e === near, y = 14 + i * rowH;
          kit.label(c, clockOf(e[0], dec) + '  ' + e[1], lx, y, { align: 'left', size: on ? 12.5 : 11.5, color: on ? C.warn : e[0] > age ? C.text : C.faint, weight: on ? 700 : 400 });
        });
        // readouts
        ro.set('clock', clockOf(age, dec));
        ro.set('age', ageText(age));
        const dv = DIVS.find(d => age <= d[0] && age >= d[1]) || DIVS[DIVS.length - 1], pd = PERIODS.find(p => age <= p[0] && age >= p[1]);
        ro.set('div', dv[2] + (pd ? ', ' + pd[2] + ' period' : ''));
        ro.set('ev', near ? near[1] + ' (' + ageText(near[0]) + ', ' + clockOf(near[0], dec) + ')' : '—');
        const turn = { day: '24 hours = 4.54 billion years', hour: '1 hour = 189 million years', minute: '1 minute = 3.15 million years', second: '1 second = ' + grp(EARTH * 1e6 / 86400) + ' years' }[zoom];
        ro.set('scale', turn);
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ the Red Queen: host–parasite coevolution */
  Hyper.sim('evo-redqueen', {
    title: 'The Red Queen: hosts and parasites',
    blurb: `Hosts come in two genetic types, and so do their parasites: a parasite of type 1 can infect only hosts of type 1, type 2 only type 2 (the matching-alleles model). Infection costs a host a fraction c of its fitness; a parasite that meets the wrong host loses a fraction b of its own. Whichever host type is common is the parasites' best target — so the rare host type is favoured, becomes common, and the parasites follow. Neither side ever wins. A little mutation keeps both types in play.

**Try this**
- Watch the graph: the parasite curve follows the host curve, a quarter of a cycle or so behind. The dot on the left circles for ever.
- Raise the cost of infection c: selection on hosts is stronger and the cycles get faster.
- Set mutation to zero: the swings grow until one type almost disappears — and in a finite population it can be lost for good.
- Tick *Finite populations*: chance adds jitter to the cycles, as in real host–parasite systems.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      let running = true, R = B.rng(1973), h, x, gen, hist, trail, ups, acc = 0;
      const ctl = kit.controls(box.side, [
        { id: 'c', label: 'Cost of infection to a host, c', min: 0.05, max: 0.9, step: 0.01, value: 0.3 },
        { id: 'b', label: 'Cost to a parasite of the wrong host, b', min: 0.05, max: 0.9, step: 0.01, value: 0.6 },
        { id: 'mu', label: 'Mutation between types per generation', min: 0, max: 0.02, step: 0.0005, value: 0.004 },
        { id: 'drift', type: 'check', label: 'Finite populations (1000 hosts, 1000 parasites)', value: false },
        { id: 'speed', label: 'Generations per second', min: 1, max: 60, step: 1, value: 12 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => { if (id === 'restart') restart(); else if (id === 'pause') running = !running; });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gen', 'Generation'], ['h', 'Hosts of type 1'], ['x', 'Parasites of type 1'], ['per', 'Length of a cycle'], ['lag', 'Parasites lag the hosts by']]);
      const plot = kit.plot(gb, { x: { label: 'generation' }, y: { label: 'frequency of type 1', min: 0, max: 1 }, legend: true }, 170);
      function restart() { R = B.rng(1973); h = 0.6; x = 0.35; gen = 0; hist = [[0, h, x]]; trail = [[h, x]]; ups = { h: [], x: [] }; acc = 0; }
      restart();
      function step() {
        const c = V.c, b = V.b, mu = V.mu;
        const wH1 = 1 - c * x, wH2 = 1 - c * (1 - x), wP1 = 1 - b * (1 - h), wP2 = 1 - b * h;
        let h2 = h * wH1 / (h * wH1 + (1 - h) * wH2), x2 = x * wP1 / (x * wP1 + (1 - x) * wP2);
        h2 = h2 * (1 - mu) + (1 - h2) * mu; x2 = x2 * (1 - mu) + (1 - x2) * mu;
        if (V.drift) { h2 = binom(1000, h2, R) / 1000; x2 = binom(1000, x2, R) / 1000; }
        if (!Number.isFinite(h2)) h2 = 0.5; if (!Number.isFinite(x2)) x2 = 0.5;
        gen++;
        if (h < 0.5 && h2 >= 0.5) ups.h.push(gen);
        if (x < 0.5 && x2 >= 0.5) ups.x.push(gen);
        h = h2; x = x2;
        hist.push([gen, h, x]); if (hist.length > 400) hist.shift();
        trail.push([h, x]); if (trail.length > 300) trail.shift();
      }
      const mean = a => a.reduce((s, v) => s + v, 0) / a.length;
      const loop = kit.loop((dt) => {
        if (running) { acc += dt * V.speed; let k = 0; while (acc >= 1 && k < 200) { step(); acc -= 1; k++; } }
        ro.set('gen', String(gen));
        ro.set('h', pct(h));
        ro.set('x', pct(x));
        const uh = ups.h.slice(-4), dh = uh.slice(1).map((v, i) => v - uh[i]);
        const per = dh.length ? mean(dh) : null;
        ro.set('per', per ? per.toFixed(0) + ' generations' : 'waiting for a full cycle');
        const lags = ups.x.slice(-3).map(tx => { const before = ups.h.filter(t => t <= tx); return before.length ? tx - before[before.length - 1] : null; }).filter(v => v != null);
        ro.set('lag', lags.length && per ? mean(lags).toFixed(0) + ' generations (' + (mean(lags) / per).toFixed(2) + ' of a cycle)' : '—');
        plot.set({ series: [{ pts: hist.map(p => [p[0], p[1]]), label: 'hosts of type 1' }, { pts: hist.map(p => [p[0], p[2]]), label: 'parasites of type 1', dash: [6, 4] }], x: { label: 'generation', min: hist[0][0], max: Math.max(hist[0][0] + 50, gen) } });
        // drawing: the phase plane, then the two populations
        const C = kit.colors(), cv = st.begin(), W = st.W, H = st.H, S = Math.min(H - 50, W * 0.42), px = 46, py = 18;
        cv.strokeStyle = C.axis; cv.lineWidth = 1; cv.strokeRect(px + 0.5, py + 0.5, S, S);
        cv.strokeStyle = C.grid; cv.beginPath(); cv.moveTo(px + S / 2, py); cv.lineTo(px + S / 2, py + S); cv.moveTo(px, py + S / 2); cv.lineTo(px + S, py + S / 2); cv.stroke();
        cv.strokeStyle = C.accent; cv.lineWidth = 1.6; cv.beginPath();
        trail.forEach(([a, bb], i) => { const X = px + a * S, Y = py + (1 - bb) * S; i ? cv.lineTo(X, Y) : cv.moveTo(X, Y); });
        cv.stroke();
        kit.dot(cv, px + h * S, py + (1 - x) * S, 5.5, C.warn, C.bg2);
        kit.label(cv, 'hosts of type 1 →', px + S / 2, py + S + 14, { size: 11, color: C.muted });
        kit.label(cv, 'parasites 1', px - 8, py + S / 2 - 7, { align: 'right', size: 11, color: C.muted });
        kit.label(cv, '↑', px - 8, py + S / 2 + 8, { align: 'right', size: 11, color: C.muted });
        const col1 = 'hsl(210 70% 55%)', col2 = 'hsl(30 85% 55%)', gx = px + S + 40, gw = W - gx - 12;
        if (gw > 60) {
          const draw = (label, f, y, shape) => {
            kit.label(cv, label, gx, y - 10, { align: 'left', size: 12, color: C.text, weight: 600 });
            const n = 40, cols = 20, cell = Math.min(gw / cols, 16), n1 = Math.round(f * n);
            for (let i = 0; i < n; i++) {
              const X = gx + (i % cols + 0.5) * cell, Y = y + (Math.floor(i / cols) + 0.5) * cell;
              cv.fillStyle = i < n1 ? col1 : col2;
              cv.beginPath();
              if (shape) { cv.moveTo(X, Y - cell * 0.4); cv.lineTo(X + cell * 0.35, Y); cv.lineTo(X, Y + cell * 0.4); cv.lineTo(X - cell * 0.35, Y); cv.closePath(); }
              else cv.arc(X, Y, cell * 0.38, 0, Math.PI * 2);
              cv.fill();
            }
          };
          draw('hosts (blue type 1, orange type 2)', h, py + 16, false);
          draw('parasites: each infects its own colour', x, py + 16 + Math.min(gw / 20, 16) * 2 + 34, true);
          kit.label(cv, 'the common host type pays for being common', gx, H - 14, { align: 'left', size: 11, color: C.muted });
        }
      }, box.stage);
      loop.start();
    }
  });

})();
