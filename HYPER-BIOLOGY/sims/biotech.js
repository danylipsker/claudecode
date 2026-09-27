/* HYPER-BIOLOGY · sims/biotech.js — simulations for Biotechnology and Genomics.
 *
 *   tech-digest    cut a molecule with chosen restriction enzymes; map of the sites and a virtual gel against a ladder
 *   tech-pcr       PCR cycle by cycle: strands, exponential growth, efficiency, plateau, and Ct in real-time PCR
 *   tech-crispr    find PAM sites, design a guide, see the cut position, count off-targets, and repair the break
 *   tech-dotplot   a dot plot of two sequences and their best alignment by dynamic programming
 *   tech-assembly  scatter sequencing reads over a genome and join the overlaps into contigs
 *
 * kit.bio supplies the biology (sites, ENZYMES, pcr, gelDistance, tm, gc, revComp, rng). The cut
 * positions of the enzymes are not in the engine, so they are tabulated here (CUTS).
 */
(function () {
  'use strict';

  /* Where each enzyme cuts the top strand, counted from the start of its recognition site, and what
     kind of end that leaves. The recognition sequences themselves come from kit.bio.ENZYMES. */
  const CUTS = {
    EcoRI: { cut: 1, end: "5' overhang" }, BamHI: { cut: 1, end: "5' overhang" }, HindIII: { cut: 1, end: "5' overhang" },
    PstI: { cut: 5, end: "3' overhang" }, SmaI: { cut: 3, end: 'blunt' }, NotI: { cut: 2, end: "5' overhang" },
    XhoI: { cut: 1, end: "5' overhang" }, SalI: { cut: 1, end: "5' overhang" }, KpnI: { cut: 5, end: "3' overhang" },
    XbaI: { cut: 1, end: "5' overhang" }, NdeI: { cut: 2, end: "5' overhang" }, SacI: { cut: 5, end: "3' overhang" }
  };

  /* a seeded random DNA sequence with known sites written into it */
  function makeDNA(L, plant, ENZ, R) {
    const b = 'ACGT', s = new Array(L);
    for (let i = 0; i < L; i++) s[i] = b[Math.floor(R() * 4) & 3];
    for (const [name, at] of plant) {
      const site = ENZ[name];
      if (!site) continue;
      for (let i = 0; i < site.length && at + i < L; i++) s[at + i] = site[i];
    }
    return s.join('');
  }

  Hyper.sim('tech-digest', {
    title: 'Restriction digest and a virtual gel',
    blurb: `Choose enzymes and cut the molecule. The map shows where each recognition site falls and where the cuts land; the gel shows what you would see — one lane per enzyme on its own, one for all of them together, and a ladder of known sizes to read them against.

Bands are placed by the calibration \`d = a − b·log10(bp)\`, so equal *ratios* of size are equally far apart. Fragments that land within a fraction of a millimetre of each other merge into one brighter band, exactly as they do on a real gel.

**Try this**
- Cut with one 6-cutter, then add a second: the fragments subdivide, and the sizes still add up to the whole molecule (check the read-out).
- Switch to the 2 % gel: the small fragments spread out and the large ones pile up unresolved at the well. The 0.7 % gel does the opposite.
- Select NotI, an 8-cutter: usually no site at all in 3 kb, because 4⁸ = 65 536 bp is the expected spacing.
- Press *New sequence*: the planted sites stay, but stray sites appear and disappear — a digest is a property of one particular molecule, not of its length.
- Watch the end type: PstI and KpnI leave 3′ overhangs, SmaI leaves blunt ends that will join to any other blunt end.`,
    mount(box, kit) {
      const B = kit.bio, ENZ = B.ENZYMES;
      const NAMES = ['EcoRI', 'BamHI', 'HindIII', 'PstI', 'SmaI', 'NotI'];
      const MOL = {
        plasmid: { L: 3000, circular: true, title: 'plasmid, 3000 bp, circular',
          plant: [['EcoRI', 120], ['PstI', 560], ['BamHI', 980], ['SmaI', 1520], ['EcoRI', 1880], ['HindIII', 2410], ['PstI', 2730]] },
        linear6: { L: 6000, circular: false, title: 'linear fragment, 6000 bp',
          plant: [['EcoRI', 400], ['EcoRI', 1600], ['HindIII', 2900], ['BamHI', 4300], ['NotI', 5200], ['PstI', 5600]] },
        phage: { L: 12000, circular: false, title: 'phage-like, 12 000 bp, linear',
          plant: [['HindIII', 560], ['EcoRI', 2100], ['BamHI', 4800], ['HindIII', 6400], ['PstI', 8300], ['EcoRI', 9100], ['SmaI', 11200]] }
      };
      const GEL = { 0.7: [7.5, 1.5], 1: [9, 2.2], 2: [11.5, 3] };
      const LADDER = [10000, 8000, 6000, 5000, 4000, 3000, 2500, 2000, 1500, 1000, 750, 500, 250, 100];

      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const defs = [{ id: 'mol', type: 'select', label: 'Molecule', value: 'plasmid',
        options: [['Plasmid, 3 kb, circular', 'plasmid'], ['Linear fragment, 6 kb', 'linear6'], ['Phage-like, 12 kb', 'phage']] }];
      NAMES.forEach((n, i) => defs.push({ id: n, type: 'check', label: n + '  (' + ENZ[n] + ', ' + CUTS[n].end + ')', value: i === 0 }));
      defs.push({ id: 'gel', type: 'select', label: 'Gel', value: 1, options: [['0.7 % agarose', 0.7], ['1.0 % agarose', 1], ['2.0 % agarose', 2]] });
      defs.push({ id: 'run', label: 'Run time', min: 15, max: 120, step: 5, value: 75, unit: 'min' });
      defs.push({ type: 'buttons', items: [{ id: 'newseq', label: 'New sequence', primary: true }, { id: 'all', label: 'All enzymes' }, { id: 'none', label: 'None' }] });

      const ctl = kit.controls(box.side, defs, (id) => {
        if (id === 'newseq') { seed = (seed * 1103515245 + 12345) & 0x7fffffff; build(); }
        else if (id === 'all') { NAMES.forEach(n => ctl.set(n, true)); }
        else if (id === 'none') { NAMES.forEach(n => ctl.set(n, false)); }
        recompute();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sites', 'Sites found'], ['frag', 'Fragments (bp)'], ['ends', 'Ends produced'], ['sum', 'Sizes add up to']]);

      let seed = 20260927, seq = '', lanes = [], siteList = [];

      function build() {
        const m = MOL[V.mol] || MOL.plasmid;
        seq = makeDNA(m.L, m.plant, ENZ, B.rng(seed));
      }

      function cutsOf(names) {
        const out = [];
        for (const n of names) for (const p of B.sites(seq, n)) out.push((p - 1 + CUTS[n].cut) % seq.length);
        return out;
      }
      function fragmentsOf(cuts) {
        const m = MOL[V.mol] || MOL.plasmid, L = seq.length;
        const c = Array.from(new Set(cuts)).sort((a, b) => a - b);
        if (!c.length) return [{ start: 0, len: L, whole: true }];
        const out = [];
        if (m.circular) for (let i = 0; i < c.length; i++) { const a = c[i], b = c[(i + 1) % c.length]; out.push({ start: a, len: ((b - a) % L + L) % L || L }); }
        else {
          out.push({ start: 0, len: c[0] });
          for (let i = 0; i < c.length - 1; i++) out.push({ start: c[i], len: c[i + 1] - c[i] });
          out.push({ start: c[c.length - 1], len: L - c[c.length - 1] });
        }
        return out.filter(f => f.len > 0);
      }

      function recompute() {
        const chosen = NAMES.filter(n => V[n]);
        siteList = NAMES.map(n => ({ name: n, at: B.sites(seq, n), on: !!V[n] }));
        lanes = [{ label: 'ladder', sizes: LADDER.slice(), ladder: true }];
        lanes.push({ label: 'uncut', sizes: [seq.length], uncut: true });
        for (const n of chosen) lanes.push({ label: n, sizes: fragmentsOf(cutsOf([n])).map(f => f.len), enz: n });
        if (chosen.length > 1) lanes.push({ label: 'all', sizes: fragmentsOf(cutsOf(chosen)).map(f => f.len) });
        const all = chosen.length ? fragmentsOf(cutsOf(chosen)) : [];
        const total = all.reduce((a, f) => a + f.len, 0);
        ro.set('sites', siteList.filter(s => s.on).map(s => s.name + ': ' + s.at.length).join(', ') || 'no enzyme selected');
        ro.set('frag', chosen.length ? all.map(f => f.len).sort((a, b) => b - a).join(', ') : 'uncut, ' + seq.length + ' bp');
        const ends = Array.from(new Set(chosen.map(n => CUTS[n].end)));
        ro.set('ends', chosen.length ? ends.join(' + ') : '—');
        ro.set('sum', chosen.length ? total + ' bp of ' + seq.length + ' bp' + (total === seq.length ? '  ✓' : '') : seq.length + ' bp');
      }
      build(); recompute();

      /* ---------------------------------------------------------------- drawing */
      function drawMap(c, C, x0, y0, w, h) {
        const m = MOL[V.mol] || MOL.plasmid, L = seq.length;
        kit.label(c, m.title, x0 + w / 2, y0 + 2, { align: 'center', size: 12, weight: '600', color: C.text2 });
        const on = siteList.filter(s => s.on);
        if (m.circular) {
          const cx = x0 + w / 2, cy = y0 + h / 2 + 6, r = Math.min(w, h) * 0.3;
          c.strokeStyle = C.faint; c.lineWidth = 7; c.beginPath(); c.arc(cx, cy, r, 0, kit.TAU); c.stroke();
          const cuts = [];
          on.forEach((s, i) => s.at.forEach(p => cuts.push({ p: (p - 1 + CUTS[s.name].cut) % L, name: s.name, i })));
          cuts.sort((a, b) => a.p - b.p);
          // fragments as coloured arcs between consecutive cuts
          if (cuts.length) for (let k = 0; k < cuts.length; k++) {
            const a = cuts[k].p / L * kit.TAU - Math.PI / 2, b = cuts[(k + 1) % cuts.length].p / L * kit.TAU - Math.PI / 2;
            c.strokeStyle = C.series[k % C.series.length]; c.lineWidth = 7;
            c.beginPath(); c.arc(cx, cy, r, a, b > a ? b : b + kit.TAU); c.stroke();
          }
          for (const cu of cuts) {
            const a = cu.p / L * kit.TAU - Math.PI / 2;
            const x1 = cx + Math.cos(a) * (r - 9), y1 = cy + Math.sin(a) * (r - 9);
            const x2 = cx + Math.cos(a) * (r + 9), y2 = cy + Math.sin(a) * (r + 9);
            c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
            kit.label(c, cu.name + ' ' + (cu.p + 1), cx + Math.cos(a) * (r + 22), cy + Math.sin(a) * (r + 22),
              { align: 'center', size: 10.5, color: C.muted });
          }
          kit.label(c, L + ' bp', cx, cy, { align: 'center', baseline: 'middle', size: 13, weight: '600', color: C.text2 });
        } else {
          const x1 = x0 + 26, x2 = x0 + w - 26, y = y0 + h / 2 + 6;
          const cuts = [];
          on.forEach((s, i) => s.at.forEach(p => cuts.push({ p: (p - 1 + CUTS[s.name].cut) % L, name: s.name })));
          cuts.sort((a, b) => a.p - b.p);
          const bounds = [0].concat(cuts.map(q => q.p), [L]);
          for (let k = 0; k < bounds.length - 1; k++) {
            c.strokeStyle = cuts.length ? C.series[k % C.series.length] : C.faint; c.lineWidth = 9;
            c.beginPath(); c.moveTo(x1 + (x2 - x1) * bounds[k] / L, y); c.lineTo(x1 + (x2 - x1) * bounds[k + 1] / L, y); c.stroke();
          }
          cuts.forEach((cu, i) => {
            const x = x1 + (x2 - x1) * cu.p / L;
            c.strokeStyle = C.text; c.lineWidth = 1.6; c.beginPath(); c.moveTo(x, y - 12); c.lineTo(x, y + 12); c.stroke();
            kit.label(c, cu.name, x, y - 16 - (i % 2) * 13, { align: 'center', size: 10.5, color: C.muted });
            kit.label(c, String(cu.p + 1), x, y + 16 + (i % 2) * 13, { align: 'center', baseline: 'top', size: 10, color: C.faint });
          });
          kit.label(c, '1', x1, y + 40, { align: 'center', baseline: 'top', size: 10.5, color: C.muted });
          kit.label(c, L + ' bp', x2, y + 40, { align: 'center', baseline: 'top', size: 10.5, color: C.muted });
        }
      }

      function drawGel(c, C, x0, y0, w, h) {
        const [a, b] = GEL[V.gel] || GEL[1], scale = V.run / 75;
        const top = y0 + 26, bottom = y0 + h - 16, cmPx = (bottom - top) / 6.2;
        c.fillStyle = C.bg2; c.fillRect(x0, top - 12, w, bottom - top + 14);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x0 + 0.5, top - 11.5, w - 1, bottom - top + 13);
        kit.label(c, 'gel: ' + (V.gel === 1 ? '1.0' : V.gel) + ' % agarose, ' + V.run + ' min', x0 + w / 2, y0 + 2,
          { align: 'center', size: 12, weight: '600', color: C.text2 });
        const n = Math.max(1, lanes.length), lw = (w - 16) / n;
        lanes.forEach((ln, i) => {
          const lx = x0 + 8 + i * lw, cx = lx + lw / 2, bw = Math.min(lw - 10, 46);
          c.fillStyle = C.surface; c.fillRect(cx - bw / 2, top - 9, bw, 6);        // the well
          kit.label(c, ln.label, cx, bottom + 3, { align: 'center', baseline: 'top', size: 10.5, color: C.muted });
          // merge co-migrating fragments
          const bands = [];
          for (const bp of ln.sizes) {
            const d = Math.max(0, B.gelDistance(bp, a, b)) * scale;
            const hit = bands.find(q => Math.abs(q.d - d) < 0.055);
            if (hit) { hit.n++; hit.mass += bp; hit.sizes.push(bp); }
            else bands.push({ d, n: 1, mass: bp, sizes: [bp] });
          }
          const maxMass = Math.max.apply(null, bands.map(q => q.mass).concat([1]));
          for (const q of bands) {
            const y = top + Math.min(6.2, q.d) * cmPx;
            const al = ln.ladder ? 0.75 : 0.3 + 0.65 * Math.min(1, q.mass / maxMass);
            c.fillStyle = ln.ladder ? kit.hue(200, al) : (ln.uncut ? kit.hue(30, al) : kit.hue(150, al));
            c.fillRect(cx - bw / 2, y - 2, bw, 4);
            if (ln.ladder) kit.label(c, String(q.sizes[0]), lx + 2, y, { align: 'left', baseline: 'middle', size: 9.5, color: C.muted });
            else if (q.n > 1) kit.label(c, '×' + q.n, cx + bw / 2 + 3, y, { align: 'left', baseline: 'middle', size: 9.5, color: C.faint });
            if (q.d <= 0.02) kit.label(c, 'unresolved', cx, y - 8, { align: 'center', baseline: 'bottom', size: 9.5, color: C.warn });
          }
        });
        c.strokeStyle = C.faint; c.setLineDash([4, 4]); c.lineWidth = 1;
        c.beginPath(); c.moveTo(x0 + 2, bottom); c.lineTo(x0 + w - 2, bottom); c.stroke(); c.setLineDash([]);
        kit.label(c, '− well', x0 + 4, top - 22, { align: 'left', size: 10, color: C.faint });
        kit.label(c, '+', x0 + 4, bottom - 12, { align: 'left', size: 11, color: C.faint });
      }

      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const split = Math.round(st.W * 0.46);
        drawMap(c, C, 6, 6, split - 12, st.H - 12);
        drawGel(c, C, split + 4, 6, st.W - split - 10, st.H - 12);
      }, box.stage);
      loop.start();
    }
  });

  Hyper.sim('tech-pcr', {
    title: 'PCR, cycle by cycle',
    blurb: `Each cycle melts the strands, lets the primers anneal and copies what lies between them. The picture shows the molecules for the first few cycles — grey is the original template, blue a product defined by a primer at one end only, green the exact amplicon with both ends fixed. The graph counts copies on a logarithmic scale, so perfect doubling is a straight line.

**Try this**
- Run from one copy with perfect efficiency: 30 cycles reach about a billion — the straight line on a log axis.
- Drop the efficiency to 80 % and run again: the line tilts, and after 30 cycles you have well under a tenth of the yield. Small differences compound.
- Turn the reagent limit on and keep going: the curve bends over into a plateau. Two very different starting amounts finish in the same place, which is why an end-point band cannot measure the starting amount.
- Switch on the 10× dilution and read the two Ct values: they differ by about 3.3 cycles at perfect efficiency, because log₂10 = 3.32.
- Watch the green fraction: by cycle 10 almost everything is the exact amplicon, even though the first cycles make almost none of it.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.26, minH: 130 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'N0', label: 'Starting copies', min: 1, max: 1e6, value: 100, log: true, sig: 2 },
        { id: 'E', label: 'Efficiency per cycle', min: 0.5, max: 1, step: 0.01, value: 1, fmt: v => (100 * v).toFixed(0) + ' %' },
        { id: 'plateau', type: 'check', label: 'Reagents run out (plateau)', value: true },
        { id: 'dilute', type: 'check', label: 'Compare a 10× dilution', value: false },
        { id: 'thr', label: 'Detection threshold', min: 1e7, max: 1e11, value: 1e9, log: true, sig: 2, fmt: v => v.toExponential(1) + ' copies' },
        { id: 'speed', label: 'Cycles per second', min: 0.5, max: 8, step: 0.5, value: 3 },
        { type: 'buttons', items: [{ id: 'run', label: 'Run / pause', primary: true }, { id: 'step', label: 'One cycle' }, { id: 'reset', label: 'Reset' }] }
      ], (id) => {
        if (id === 'run') running = !running;
        else if (id === 'step') { running = false; cycle(); }
        else if (id === 'reset') reset();
        else if (id !== 'speed' && id !== 'thr') reset();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['n', 'Cycle'], ['N', 'Copies'], ['fold', 'Grew this cycle by'], ['amp', 'Exact amplicon'], ['ct', 'Ct (threshold crossed at)']]);
      const plot = kit.plot(gb, { x: { label: 'cycle', min: 0, max: 40 }, y: { label: 'copies', log: true }, legend: true, fmtY: v => v.toExponential(2) }, 180);

      const MAXC = 40, NMAX = 1e12;
      let n = 0, series = [], dil = [], running = false, acc = 0, last = 1;

      function reset() {
        n = 0; acc = 0; last = 1;
        series = [[0, Math.max(1, V.N0)]];
        dil = [[0, Math.max(0.1, V.N0 / 10)]];
      }
      function grow(N) {
        const cap = V.plateau ? Math.max(0, 1 - N / NMAX) : 1;
        return N * (1 + V.E * cap);
      }
      function cycle() {
        if (n >= MAXC) return;
        n++;
        series.push([n, grow(series[series.length - 1][1])]);
        dil.push([n, grow(dil[dil.length - 1][1])]);
      }
      function ctOf(arr) {
        const thr = V.thr;
        for (let i = 1; i < arr.length; i++) {
          if (arr[i][1] >= thr && arr[i - 1][1] < thr) {
            const a = arr[i - 1][1], b = arr[i][1];
            if (!(b > a)) return arr[i][0];
            return arr[i - 1][0] + Math.log(thr / a) / Math.log(b / a);
          }
        }
        return null;
      }
      reset();

      const loop = kit.loop((dt) => {
        if (running && n < MAXC) { acc += dt * V.speed; while (acc >= 1) { cycle(); acc -= 1; } }
        if (n >= MAXC) running = false;
        const N = series[series.length - 1][1];
        const prev = series.length > 1 ? series[series.length - 2][1] : N;
        const ampFrac = n < 2 ? 0 : Math.max(0, (Math.pow(2, n) - n - 1) / Math.pow(2, n));
        const ct = ctOf(series), ctd = ctOf(dil);
        ro.set('n', n + ' of ' + MAXC);
        ro.set('N', N.toExponential(2));
        ro.set('fold', n === 0 ? '—' : '×' + (N / Math.max(1e-300, prev)).toFixed(3));
        ro.set('amp', n < 2 ? 'none yet' : (100 * ampFrac).toFixed(n > 8 ? 3 : 1) + ' % of the molecules');
        ro.set('ct', ct == null ? 'not reached' : ct.toFixed(2) + (V.dilute && ctd != null ? '   ·   dilution ' + ctd.toFixed(2) + '  (ΔCt ' + (ctd - ct).toFixed(2) + ')' : ''));
        const ser = [{ pts: series, label: 'sample' }];
        if (V.dilute) ser.push({ pts: dil, label: '10× dilution', dash: [6, 4] });
        plot.set({
          series: ser,
          hlines: [{ y: V.thr, label: 'threshold' }],
          vlines: ct == null ? [] : [{ x: ct, label: 'Ct' }].concat(V.dilute && ctd != null ? [{ x: ctd, label: 'Ct (dil)' }] : [])
        });
        // the molecules of the first few cycles
        const c = st.begin(), C = kit.colors();
        const total = Math.pow(2, Math.min(n, 4)), longs = Math.min(n, 4), shorts = Math.max(0, total - longs - 1);
        const cols = 4, rows = Math.ceil(total / cols), bw = Math.min(120, (st.W - 40) / cols), bh = Math.min(20, (st.H - 46) / Math.max(1, rows));
        kit.label(c, n <= 4 ? 'cycle ' + n + ': ' + total + ' molecules' : 'cycle ' + n + ': ' + N.toExponential(2) + ' molecules — ' + (100 * ampFrac).toFixed(1) + ' % exact amplicon',
          st.W / 2, 4, { align: 'center', size: 12, weight: '600', color: C.text2 });
        if (n <= 4) {
          for (let i = 0; i < total; i++) {
            const x = 20 + (i % cols) * ((st.W - 40) / cols), y = 30 + Math.floor(i / cols) * (bh + 6);
            const kind = i === 0 ? 0 : i <= longs ? 1 : 2;              // 0 original, 1 one end fixed, 2 exact amplicon
            const w = kind === 0 ? bw : kind === 1 ? bw * 0.78 : bw * 0.55;
            const col = kind === 0 ? C.muted : kind === 1 ? kit.hue(210) : kit.hue(145);
            c.strokeStyle = col; c.lineWidth = 2.4;
            c.beginPath(); c.moveTo(x, y); c.lineTo(x + w, y); c.moveTo(x, y + 6); c.lineTo(x + w, y + 6); c.stroke();
            if (kind > 0) { kit.arrow(c, x, y + 12, x + 14, y + 12, col, 1.6); }
          }
          kit.label(c, 'grey: original template   ·   blue: one end fixed by a primer   ·   green: the exact amplicon',
            st.W / 2, st.H - 4, { align: 'center', baseline: 'bottom', size: 10.5, color: C.faint });
        } else {
          // a bar of the three pools, by the ideal accounting
          const x0 = 24, w = st.W - 48, y = st.H / 2 - 6, oneF = 1 / Math.pow(2, n), longF = n / Math.pow(2, n);
          const parts = [[Math.max(0.0005, oneF), C.muted, 'original'], [Math.max(0.0005, longF), kit.hue(210), 'one end fixed'], [ampFrac, kit.hue(145), 'exact amplicon']];
          let x = x0;
          for (const [f, col] of parts) { c.fillStyle = col; c.fillRect(x, y, Math.max(1.5, w * f), 22); x += w * f; }
          c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x0 + 0.5, y + 0.5, w - 1, 22);
          kit.label(c, 'what the tube contains, by number of molecules', st.W / 2, y + 30, { align: 'center', baseline: 'top', size: 10.5, color: C.faint });
        }
      }, box.stage);
      loop.start();
      return () => { running = false; };
    }
  });

  Hyper.sim('tech-crispr', {
    title: 'CRISPR: PAM sites, guides and the cut',
    blurb: `Cas9 can only cut next to a PAM — the three bases NGG. Every usable site in the target is ticked; pick one and its 20-base guide lights up, with the cut falling 3 bp from the PAM. The guide is then searched against a small "genome" that contains the true locus and three diverged copies of it, of the sort a real gene family provides — which is where off-targets usually come from.

**Try this**
- Count the PAM sites: with equal base frequencies you expect one every 8 bp counting both strands, and that is roughly what you find.
- Turn off the bottom strand: about half the sites disappear, and some regions are suddenly out of reach.
- Raise the mismatches allowed from 0 to 3: the off-target count climbs steeply — a 20-base guide is unique, but a 20-base guide *with three mistakes allowed* is not.
- Look at the near-matches without a PAM: they are not cut, which is why the PAM matters as much as the guide.
- Cut, then repair by end joining: most outcomes shift the reading frame, which is how a gene is knocked out. Template repair writes the sequence you chose instead.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.54, minH: 280 });
      const ctl = kit.controls(box.side, [
        { id: 'target', type: 'select', label: 'Target region', value: 0, options: [['Exon 2 of a model gene', 0], ['A promoter region', 1], ['A GC-rich exon', 2]] },
        { id: 'pick', label: 'Guide (PAM site number)', min: 1, max: 60, step: 1, value: 4 },
        { id: 'both', type: 'check', label: 'Search both strands', value: true },
        { id: 'mm', label: 'Mismatches allowed off-target', min: 0, max: 4, step: 1, value: 2 },
        { id: 'repair', type: 'select', label: 'Repair pathway', value: 'none',
          options: [['— show the cut only —', 'none'], ['End joining (knock-out)', 'nhej'], ['Template repair (precise)', 'hdr']] },
        { type: 'buttons', items: [{ id: 'newseq', label: 'New sequence', primary: true }] }
      ], (id) => { if (id === 'newseq') { seed = (seed * 1103515245 + 12345) & 0x7fffffff; build(); } recompute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['guide', 'Guide (5′→3′)'], ['prop', 'GC and melting temperature'], ['cut', 'Blunt cut at'], ['pams', 'PAM sites in the target'], ['off', 'Matches in the genome'], ['out', 'Repair outcome']]);

      const LEN = 300, PER = 60;
      let seed = 7042026, target = '', genome = '', sites = [], sel = null, off = null, repair = null;

      const randDNA = (n, R) => { const b = 'ACGT', s = []; for (let i = 0; i < n; i++) s.push(b[Math.floor(R() * 4) & 3]); return s.join(''); };
      function diverge(s, p, R) {
        const b = 'ACGT', out = s.split('');
        for (let i = 0; i < out.length; i++) if (R() < p) { let c = b[Math.floor(R() * 4) & 3]; if (c === out[i]) c = b[(b.indexOf(c) + 1) & 3]; out[i] = c; }
        return out.join('');
      }
      function build() {
        const R = B.rng(seed + V.target * 977);
        if (V.target === 2) {                                   // a GC-rich region: more PAMs
          const b = 'GCGCAT', s = []; for (let i = 0; i < LEN; i++) s.push(b[Math.floor(R() * 6) % 6]); target = s.join('');
        } else target = randDNA(LEN, R);
        const R2 = B.rng(seed + 31);
        genome = randDNA(12000, R2) + target + randDNA(8000, R2) + diverge(target, 0.04, R2) +
                 randDNA(8000, R2) + diverge(target, 0.09, R2) + randDNA(6000, R2) + diverge(target, 0.16, R2) + randDNA(6000, R2);
      }
      function pamSites() {
        const s = target, out = [];
        for (let i = 20; i + 3 <= s.length; i++) if (s[i + 1] === 'G' && s[i + 2] === 'G') out.push({ strand: '+', pam: i, a: i - 20, b: i, cut: i - 3 });
        if (V.both) for (let i = 0; i + 23 <= s.length; i++) if (s[i] === 'C' && s[i + 1] === 'C') out.push({ strand: '−', pam: i, a: i + 3, b: i + 23, cut: i + 3 });
        return out.sort((x, y) => x.pam - y.pam);
      }
      function scan(T, guide, maxMM, strand, out) {
        const L = guide.length;
        for (let j = 0; j + L + 3 <= T.length; j++) {
          let mm = 0, k = 0;
          for (; k < L; k++) if (T[j + k] !== guide[k]) { if (++mm > maxMM) break; }
          if (k < L) continue;
          out.push({ mm, strand, pam: T[j + L + 1] === 'G' && T[j + L + 2] === 'G' });
        }
      }
      function recompute() {
        sites = pamSites();
        if (!sites.length) { sel = null; off = null; repair = null; ro.set('guide', 'no PAM site in this region'); ro.set('prop', '—'); ro.set('cut', '—'); ro.set('pams', '0'); ro.set('off', '—'); ro.set('out', '—'); return; }
        const idx = (Math.round(V.pick) - 1) % sites.length;
        sel = sites[idx];
        const seg = target.slice(sel.a, sel.b);
        sel.guide = sel.strand === '+' ? seg : B.revComp(seg);
        sel.pamSeq = sel.strand === '+' ? target.slice(sel.pam, sel.pam + 3) : B.revComp(target.slice(sel.pam, sel.pam + 3));
        // off-target search, both strands of the small genome
        const hits = [];
        scan(genome, sel.guide, Math.round(V.mm), '+', hits);
        scan(B.revComp(genome), sel.guide, Math.round(V.mm), '−', hits);
        const withPam = hits.filter(h => h.pam), byMM = [0, 0, 0, 0, 0];
        for (const h of withPam) byMM[h.mm]++;
        off = { byMM, noPam: hits.length - withPam.length, total: withPam.length };
        // repair
        const R = B.rng(seed + sel.cut * 13 + Math.round(V.mm));
        if (V.repair === 'nhej') {
          const del = R() < 0.72, k = 1 + Math.floor(R() * (del ? 8 : 3));
          repair = { kind: 'nhej', del, k, frame: (k % 3) !== 0 };
        } else if (V.repair === 'hdr') repair = { kind: 'hdr' };
        else repair = null;

        const top = sites.filter(s => s.strand === '+').length, bot = sites.length - top;
        ro.set('guide', sel.guide + '  ' + sel.pamSeq + '   (' + (sel.strand === '+' ? 'top' : 'bottom') + ' strand)');
        ro.set('prop', (100 * B.gc(sel.guide)).toFixed(0) + ' % GC  ·  Tm ' + B.tm(sel.guide).toFixed(1) + ' °C');
        ro.set('cut', 'between bases ' + sel.cut + ' and ' + (sel.cut + 1) + ' of ' + LEN + ', 3 bp from the PAM');
        ro.set('pams', sites.length + ' (' + top + ' top, ' + bot + ' bottom) — one every ' + (LEN / Math.max(1, sites.length)).toFixed(1) + ' bp');
        ro.set('off', 'exact ' + byMM[0] + ' (the target itself is one)  ·  ' +
          byMM.slice(1, Math.round(V.mm) + 1).map((v, i) => (i + 1) + ' mm: ' + v).join('  ·  ') +
          (off.noPam ? '  ·  ' + off.noPam + ' near-matches with no PAM (not cut)' : ''));
        ro.set('out', !repair ? '—' : repair.kind === 'hdr'
          ? 'the supplied template is copied in: the chosen sequence, no indel'
          : (repair.del ? 'deletion' : 'insertion') + ' of ' + repair.k + ' base' + (repair.k > 1 ? 's' : '') +
            (repair.frame ? ' — frameshift, the protein is destroyed' : ' — in frame, the protein loses or gains ' + (repair.k / 3) + ' residue(s)'));
      }
      build(); recompute();

      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const cw = Math.max(5.5, Math.min(11, (st.W - 70) / PER)), fs = Math.max(9, Math.min(15, cw * 1.55));
        const rows = Math.ceil(LEN / PER), x0 = 46, top = 26, rh = Math.max(20, Math.min(30, (st.H - 96) / rows));
        c.font = fs + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
        c.textBaseline = 'middle'; c.textAlign = 'center';
        kit.label(c, 'target region, ' + LEN + ' bp — ticks mark a usable PAM', st.W / 2, 4, { align: 'center', size: 12, weight: '600', color: C.text2 });
        const inGuide = new Array(LEN).fill(false), inPam = new Array(LEN).fill(false);
        if (sel) { for (let i = sel.a; i < sel.b; i++) inGuide[i] = true; for (let i = sel.pam; i < sel.pam + 3; i++) inPam[i] = true; }
        for (let r = 0; r < rows; r++) {
          const y = top + r * rh + rh / 2;
          c.fillStyle = C.faint; c.font = Math.max(8, fs - 3) + 'px ' + 'ui-monospace, monospace'; c.textAlign = 'right';
          c.fillText(String(r * PER + 1), x0 - 8, y);
          c.font = fs + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'; c.textAlign = 'center';
          for (let k = 0; k < PER; k++) {
            const i = r * PER + k; if (i >= LEN) break;
            const x = x0 + (k + 0.5) * cw;
            if (inGuide[i]) { c.fillStyle = kit.hue(145, 0.28); c.fillRect(x - cw / 2, y - rh * 0.34, cw, rh * 0.68); }
            if (inPam[i]) { c.fillStyle = kit.hue(30, 0.45); c.fillRect(x - cw / 2, y - rh * 0.34, cw, rh * 0.68); }
            c.fillStyle = inPam[i] ? C.text : inGuide[i] ? C.text : C.muted;
            c.fillText(target[i], x, y);
          }
          // PAM ticks under the row
          c.strokeStyle = C.faint; c.lineWidth = 1;
          for (const s of sites) {
            if (s.pam < r * PER || s.pam >= (r + 1) * PER) continue;
            const x = x0 + ((s.pam % PER) + 0.5) * cw, yy = y + rh * 0.4;
            c.beginPath(); c.moveTo(x, yy); c.lineTo(x, yy + (s.strand === '+' ? 4 : -rh * 0.82)); c.stroke();
          }
          if (sel && sel.cut >= r * PER && sel.cut < (r + 1) * PER) {
            const x = x0 + (sel.cut - r * PER) * cw;
            c.strokeStyle = C.bad; c.lineWidth = 2;
            c.beginPath(); c.moveTo(x, y - rh * 0.44); c.lineTo(x, y + rh * 0.44); c.stroke();
            kit.label(c, 'cut', x, y - rh * 0.5, { align: 'center', baseline: 'bottom', size: 10, color: C.bad });
          }
        }
        // the repair panel
        const py = top + rows * rh + 10;
        if (sel && py < st.H - 24) {
          const a = Math.max(0, sel.cut - 14), before = target.slice(a, sel.cut), after = target.slice(sel.cut, sel.cut + 14);
          c.textAlign = 'left'; c.font = Math.max(9, fs - 1) + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
          c.fillStyle = C.muted; c.fillText('before  ' + before + '|' + after, x0 - 30, py + 8);
          let txt = '', col = C.muted;
          if (repair && repair.kind === 'nhej') {
            txt = repair.del ? before + after.slice(repair.k) : before + 'nnnnnnn'.slice(0, repair.k).toUpperCase() + after;
            col = repair.frame ? C.bad : C.warn;
          } else if (repair && repair.kind === 'hdr') { txt = before + 'GAT' + after.slice(3); col = C.ok; }
          if (txt) { c.fillStyle = col; c.fillText('after   ' + txt, x0 - 30, py + 26); }
          c.fillStyle = C.faint; c.font = '11px ' + getComputedStyle(document.body).fontFamily;
          c.fillText(repair ? (repair.kind === 'nhej' ? 'end joining: the ends are rejoined, usually losing or gaining a few bases'
            : 'template repair: the supplied sequence is copied in at the break')
            : 'choose a repair pathway to see what the cell does with the break', x0 - 30, py + 44);
        }
        c.textAlign = 'left'; c.textBaseline = 'alphabetic';
      }, box.stage);
      loop.start();
    }
  });

  Hyper.sim('tech-dotplot', {
    title: 'Dot plot and alignment',
    blurb: `Two sequences, one on each axis. A dot is drawn wherever a window of bases matches, so a shared stretch appears as a diagonal line — and the shape of the line tells you what happened: a clean diagonal is similarity, a step is an insertion or deletion, a line the other way is an inversion, several parallel lines are a repeat. Underneath, the best alignment found by dynamic programming, scored with the values you choose.

**Try this**
- Set the window to 1: a quarter of all cells match by chance and the plot is a haze. Raise it to 4 or 5 and the diagonal appears out of the noise — that is what a word size does in a database search.
- Compare *an insertion* with *a deletion*: the diagonal steps sideways in one and downwards in the other.
- Try *an inversion*: the second diagonal runs the other way, and the alignment below copes badly — alignment assumes order is preserved, which is exactly why dot plots are still drawn.
- Try *a repeat*: parallel diagonals, and the alignment cannot tell you which copy is which.
- Make the gap penalty very large: the alignment stops using gaps and forces mismatches instead. Check the score against nm·sm + nx·sx + ng·sg in the read-out.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 360 });
      const ctl = kit.controls(box.side, [
        { id: 'pair', type: 'select', label: 'The two sequences', value: 'sub',
          options: [['Point mutations only', 'sub'], ['An insertion', 'ins'], ['A deletion', 'del'], ['An inversion', 'inv'], ['A repeated segment', 'rep'], ['Unrelated', 'none']] },
        { id: 'win', label: 'Dot-plot window', min: 1, max: 9, step: 1, value: 4, unit: 'bases' },
        { id: 'sm', label: 'Score per match', min: 1, max: 5, step: 1, value: 2 },
        { id: 'sx', label: 'Score per mismatch', min: -6, max: 0, step: 1, value: -1 },
        { id: 'sg', label: 'Score per gap position', min: -10, max: -1, step: 1, value: -3 },
        { type: 'buttons', items: [{ id: 'newseq', label: 'New pair', primary: true }] }
      ], (id) => { if (id === 'newseq') seed = (seed * 1103515245 + 12345) & 0x7fffffff; recompute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['len', 'Alignment length'], ['id', 'Identity'], ['counts', 'Matches / mismatches / gaps'], ['score', 'Score'], ['check', 'Check: nm·sm + nx·sx + ng·sg']]);

      const N = 72;
      let seed = 515, A = '', Bq = '', al = null;

      function makePair(kind, R) {
        const rand = n => { let s = ''; for (let i = 0; i < n; i++) s += 'ACGT'[Math.floor(R() * 4) & 3]; return s; };
        const mut = (s, p) => s.split('').map(ch => R() < p ? 'ACGT'[Math.floor(R() * 4) & 3] : ch).join('');
        const a = rand(N);
        if (kind === 'sub') return [a, mut(a, 0.12)];
        if (kind === 'ins') return [a, mut(a.slice(0, 36) + rand(12) + a.slice(36), 0.04)];
        if (kind === 'del') return [a, mut(a.slice(0, 30) + a.slice(44), 0.04)];
        if (kind === 'inv') return [a, mut(a.slice(0, 24) + B.revComp(a.slice(24, 52)) + a.slice(52), 0.04)];
        if (kind === 'rep') { const u = rand(18); const s = rand(12) + u + rand(10) + u + rand(14); return [s, mut(s, 0.06)]; }
        return [a, rand(N)];
      }
      /* Needleman–Wunsch, global, with a linear gap penalty */
      function align(a, b, sm, sx, sg) {
        const n = a.length, m = b.length, W = m + 1;
        const M = new Float64Array((n + 1) * W), P = new Uint8Array((n + 1) * W);
        for (let i = 1; i <= n; i++) { M[i * W] = i * sg; P[i * W] = 1; }
        for (let j = 1; j <= m; j++) { M[j] = j * sg; P[j] = 2; }
        for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++) {
          const d = M[(i - 1) * W + j - 1] + (a[i - 1] === b[j - 1] ? sm : sx);
          const u = M[(i - 1) * W + j] + sg, l = M[i * W + j - 1] + sg;
          let best = d, p = 0;
          if (u > best) { best = u; p = 1; }
          if (l > best) { best = l; p = 2; }
          M[i * W + j] = best; P[i * W + j] = p;
        }
        let i = n, j = m, ra = '', rb = '', nm = 0, nx = 0, ng = 0;
        while (i > 0 || j > 0) {
          const p = i === 0 ? 2 : j === 0 ? 1 : P[i * W + j];
          if (p === 0) { ra = a[i - 1] + ra; rb = b[j - 1] + rb; if (a[i - 1] === b[j - 1]) nm++; else nx++; i--; j--; }
          else if (p === 1) { ra = a[i - 1] + ra; rb = '-' + rb; ng++; i--; }
          else { ra = '-' + ra; rb = b[j - 1] + rb; ng++; j--; }
        }
        return { a: ra, b: rb, nm, nx, ng, score: M[n * W + m] };
      }
      function recompute() {
        const R = B.rng(seed + String(V.pair).length * 131 + (V.pair === 'sub' ? 1 : V.pair === 'ins' ? 2 : V.pair === 'del' ? 3 : V.pair === 'inv' ? 4 : V.pair === 'rep' ? 5 : 6) * 7919);
        const p = makePair(V.pair, R); A = p[0]; Bq = p[1];
        al = align(A, Bq, V.sm, V.sx, V.sg);
        const L = al.a.length;
        ro.set('len', L + ' columns  (' + A.length + ' vs ' + Bq.length + ' bases)');
        ro.set('id', (100 * al.nm / Math.max(1, L)).toFixed(1) + ' % of aligned columns match');
        ro.set('counts', al.nm + ' / ' + al.nx + ' / ' + al.ng);
        ro.set('score', String(al.score));
        ro.set('check', al.nm + '×' + V.sm + ' + ' + al.nx + '×' + V.sx + ' + ' + al.ng + '×' + V.sg + ' = ' +
          (al.nm * V.sm + al.nx * V.sx + al.ng * V.sg) + (al.nm * V.sm + al.nx * V.sx + al.ng * V.sg === al.score ? '  ✓' : ''));
      }
      recompute();

      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const side = Math.max(90, Math.min(st.H * 0.62, st.W * 0.46));
        const px = 44, py = 24, w = Math.round(V.win);
        // the dot plot
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(px + 0.5, py + 0.5, side, side);
        const sx = side / Math.max(1, A.length), sy = side / Math.max(1, Bq.length);
        c.fillStyle = C.accent;
        for (let i = 0; i + w <= A.length; i++) for (let j = 0; j + w <= Bq.length; j++) {
          let ok = true;
          for (let k = 0; k < w; k++) if (A[i + k] !== Bq[j + k]) { ok = false; break; }
          if (ok) c.fillRect(px + i * sx, py + j * sy, Math.max(1.4, sx), Math.max(1.4, sy));
        }
        kit.label(c, 'sequence 1 →', px + side / 2, py - 6, { align: 'center', baseline: 'bottom', size: 11, color: C.muted });
        c.save(); c.translate(px - 10, py + side / 2); c.rotate(-Math.PI / 2);
        kit.label(c, 'sequence 2 →', 0, 0, { align: 'center', baseline: 'bottom', size: 11, color: C.muted });
        c.restore();
        kit.label(c, 'window ' + w + ' base' + (w > 1 ? 's' : ''), px + side + 12, py + 4, { align: 'left', size: 11.5, weight: '600', color: C.text2 });
        kit.label(c, w === 1 ? 'one base in four matches by chance' : 'chance dots: 1 in ' + Math.pow(4, w).toLocaleString('en'),
          px + side + 12, py + 22, { align: 'left', size: 11, color: C.muted });
        if (al) kit.label(c, 'score ' + al.score + '  ·  ' + (100 * al.nm / Math.max(1, al.a.length)).toFixed(0) + ' % identity',
          px + side + 12, py + 44, { align: 'left', size: 11.5, color: C.text2 });
        // the alignment
        if (!al) return;
        const PER = 48, rows = Math.ceil(al.a.length / PER), ay = py + side + 18;
        const cw = Math.max(5, Math.min(11, (st.W - 60) / PER)), fs = Math.max(9, Math.min(14, cw * 1.5));
        c.textBaseline = 'middle'; c.textAlign = 'center';
        for (let r = 0; r < rows; r++) {
          const y = ay + r * (fs * 3.4);
          if (y + fs * 3 > st.H) break;
          for (let k = 0; k < PER; k++) {
            const i = r * PER + k; if (i >= al.a.length) break;
            const x = 46 + (k + 0.5) * cw, same = al.a[i] === al.b[i] && al.a[i] !== '-';
            c.font = fs + 'px ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
            c.fillStyle = same ? C.text : al.a[i] === '-' || al.b[i] === '-' ? C.bad : C.warn;
            c.fillText(al.a[i], x, y);
            c.fillText(al.b[i], x, y + fs * 2.1);
            if (same) { c.fillStyle = C.faint; c.fillText('|', x, y + fs * 1.05); }
          }
          c.textAlign = 'right'; c.font = Math.max(8, fs - 3) + 'px ui-monospace, monospace'; c.fillStyle = C.faint;
          c.fillText('1', 42, y); c.fillText('2', 42, y + fs * 2.1);
          c.textAlign = 'center';
        }
        c.textAlign = 'left'; c.textBaseline = 'alphabetic';
      }, box.stage);
      loop.start();
    }
  });

  Hyper.sim('tech-assembly', {
    title: 'From reads to contigs',
    blurb: `Sequencing scatters short reads at random over a genome. Where reads overlap, the assembly joins them into a **contig**; where no read happens to fall, the assembly breaks. The top band shows the reads, the middle the depth at each base, the bottom the contigs that result — with the gaps in red.

Watch the two numbers in the read-out: the fraction of the genome with no read at all, and the value $e^{-C}$ that random placement predicts. They track each other closely, which is the whole content of the Lander–Waterman relation.

**Try this**
- Set the coverage to 1×: about a third of the genome is missing, because reads land at random rather than tidily side by side.
- Raise it to 5×: gaps fall to under a per cent. At 10× they are nearly gone — the exponential is unforgiving in both directions.
- Halve the read length and keep the coverage the same: the same number of bases is read, but the assembly is more fragmented, because gaps depend on how many *reads* there are.
- Switch the repeat on and make it longer than the reads: the two copies are indistinguishable, so the assembly collapses them and everything between them is lost. Make the reads longer than the repeat and it is resolved — the argument for long reads in one picture.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'G', label: 'Genome length', min: 500, max: 5000, step: 100, value: 2000, unit: 'bp' },
        { id: 'L', label: 'Read length', min: 25, max: 400, step: 5, value: 100, unit: 'b' },
        { id: 'C', label: 'Target coverage', min: 0.5, max: 20, step: 0.5, value: 5, unit: '×' },
        { id: 'rep', type: 'check', label: 'Include a repeated segment', value: false },
        { id: 'rlen', label: 'Repeat length', min: 40, max: 500, step: 10, value: 200, unit: 'bp' },
        { type: 'buttons', items: [{ id: 'newseq', label: 'New reads', primary: true }] }
      ], (id) => { if (id === 'newseq') seed = (seed * 1103515245 + 12345) & 0x7fffffff; recompute(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['reads', 'Reads'], ['cov', 'Mean coverage'], ['gap', 'Bases with no read'], ['pred', 'Predicted by e^(−C)'], ['contigs', 'Contigs'], ['n50', 'Longest / N50'], ['rep', 'Repeat']]);

      let seed = 90210, reads = [], cover = null, contigs = [], stats = {};

      function recompute() {
        const G = Math.round(V.G), L = Math.min(Math.round(V.L), G), n = Math.max(1, Math.round(V.C * G / L));
        const R = B.rng(seed);
        reads = [];
        for (let i = 0; i < Math.min(n, 900); i++) {
          const s = Math.floor(R() * (G - L + 1));
          reads.push({ s, e: s + L, strand: R() < 0.5 ? 1 : -1 });
        }
        cover = new Uint16Array(G);
        for (const r of reads) for (let i = r.s; i < r.e; i++) cover[i]++;
        contigs = [];
        let start = -1;
        for (let i = 0; i < G; i++) {
          if (cover[i] > 0 && start < 0) start = i;
          if ((cover[i] === 0 || i === G - 1) && start >= 0) { const end = cover[i] === 0 ? i : G; contigs.push([start, end]); start = -1; }
        }
        let covered = 0; for (let i = 0; i < G; i++) if (cover[i]) covered++;
        const lens = contigs.map(c => c[1] - c[0]).sort((a, b) => b - a);
        let acc = 0, n50 = 0;
        for (const l of lens) { acc += l; if (acc >= covered / 2) { n50 = l; break; } }
        const meanC = reads.length * L / G;
        stats = { G, L, n: reads.length, meanC, covered, lens, n50 };
        // the repeat: two identical copies, each of rlen, placed a third and two thirds of the way along
        stats.repeat = V.rep ? { len: Math.min(Math.round(V.rlen), Math.floor(G / 3)), a: Math.floor(G * 0.22), b: Math.floor(G * 0.62) } : null;
        if (stats.repeat) {
          const rl = stats.repeat.len;
          stats.inside = reads.filter(r => (r.s >= stats.repeat.a && r.e <= stats.repeat.a + rl) || (r.s >= stats.repeat.b && r.e <= stats.repeat.b + rl)).length;
          stats.resolved = L > rl;
        }
        ro.set('reads', stats.n + ' reads of ' + L + ' b' + (stats.n >= 900 ? ' (drawing capped at 900)' : ''));
        ro.set('cov', meanC.toFixed(2) + '×');
        ro.set('gap', (100 * (G - covered) / G).toFixed(2) + ' %  (' + (G - covered) + ' bases)');
        ro.set('pred', (100 * Math.exp(-meanC)).toFixed(2) + ' %');
        ro.set('contigs', String(contigs.length));
        ro.set('n50', (lens[0] || 0) + ' bp / ' + n50 + ' bp');
        ro.set('rep', !stats.repeat ? 'none' : stats.repeat.len + ' bp, twice — ' +
          (stats.resolved ? 'reads span it, so it is resolved' : 'reads are shorter than it: the copies collapse and the segment between them is lost') +
          '  (' + stats.inside + ' reads fall entirely inside a copy)');
      }
      recompute();

      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const G = stats.G, x0 = 12, w = st.W - 24, sx = w / G;
        const readsTop = 26, readsH = Math.max(40, st.H * 0.36), covTop = readsTop + readsH + 12, covH = Math.max(28, st.H * 0.2);
        const conTop = covTop + covH + 18;
        kit.label(c, stats.n + ' reads of ' + stats.L + ' b over ' + G + ' bp  ·  ' + stats.meanC.toFixed(1) + '× mean coverage',
          st.W / 2, 4, { align: 'center', size: 12, weight: '600', color: C.text2 });
        // the repeat, behind everything
        if (stats.repeat) {
          c.fillStyle = kit.hue(48, 0.18);
          c.fillRect(x0 + stats.repeat.a * sx, readsTop - 4, stats.repeat.len * sx, conTop - readsTop + 26);
          c.fillRect(x0 + stats.repeat.b * sx, readsTop - 4, stats.repeat.len * sx, conTop - readsTop + 26);
        }
        // reads, packed into rows
        const ROWS = Math.max(4, Math.floor(readsH / 6)), ends = new Array(ROWS).fill(-1), rh = readsH / ROWS;
        reads.forEach((r, i) => {
          let row = -1;
          for (let k = 0; k < ROWS; k++) if (ends[k] < r.s) { row = k; break; }
          if (row < 0) row = i % ROWS; else ends[row] = r.e + 2;
          const y = readsTop + row * rh;
          c.fillStyle = r.strand > 0 ? kit.hue(210, 0.85) : kit.hue(150, 0.85);
          c.fillRect(x0 + r.s * sx, y, Math.max(1, (r.e - r.s) * sx), Math.max(1.5, rh - 1.6));
        });
        kit.label(c, 'reads (blue and green: the two strands)', x0, readsTop - 6, { align: 'left', baseline: 'bottom', size: 10.5, color: C.faint });
        // coverage
        const maxC = Math.max(1, Math.max.apply(null, Array.from(cover)));
        c.fillStyle = kit.hue(265, 0.6);
        for (let i = 0; i < G; i++) if (cover[i]) c.fillRect(x0 + i * sx, covTop + covH - cover[i] / maxC * covH, Math.max(0.6, sx), cover[i] / maxC * covH);
        c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.moveTo(x0, covTop + covH + 0.5); c.lineTo(x0 + w, covTop + covH + 0.5); c.stroke();
        kit.label(c, 'depth (peak ' + maxC + '×)', x0, covTop - 2, { align: 'left', baseline: 'bottom', size: 10.5, color: C.faint });
        // contigs
        c.fillStyle = C.bad; c.fillRect(x0, conTop, w, 12);
        c.fillStyle = C.ok;
        for (const [a, b] of contigs) c.fillRect(x0 + a * sx, conTop, Math.max(1, (b - a) * sx), 12);
        kit.label(c, contigs.length + ' contig' + (contigs.length === 1 ? '' : 's') + '  ·  red = no read covers these bases',
          x0, conTop + 16, { align: 'left', baseline: 'top', size: 10.5, color: C.muted });
        if (stats.repeat && !stats.resolved) {
          kit.label(c, 'the repeat (shaded) is longer than a read: its two copies cannot be told apart',
            x0 + w, conTop + 16, { align: 'right', baseline: 'top', size: 10.5, color: C.warn });
        }
      }, box.stage);
      loop.start();
    }
  });
})();
