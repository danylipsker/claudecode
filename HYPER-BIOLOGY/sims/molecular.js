/* HYPER-BIOLOGY · sims/molecular.js — simulations for Molecular Biology (content/molecular.js).
 *   molb-helix     the double helix: base pairing, Chargaff counts, turns and melting (Marmur–Doty, pair by pair)
 *   molb-fork      a replication bubble: two forks, leading and lagging strands, primers, Okazaki fragments, ligase
 *   molb-meselson  the Meselson–Stahl experiment: CsCl bands for semiconservative, conservative and dispersive copying
 *   molb-express   transcription and translation in real time: RNA polymerase, ribosomes, codon table, the growing protein
 *   molb-mutation  a mutation lab: substitute, insert or delete a base and classify the effect; random-mutation statistics
 *   molb-lac       the lac operon as a logic circuit (lactose, glucose, IPTG, mutants) and diauxic growth of a culture
 *   molb-phage     a phage and its hosts: lytic or lysogenic, induction, and the populations over time
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared helpers */
  const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  const COMP = { A: 'T', T: 'A', G: 'C', C: 'G', U: 'A', N: 'N' };
  const BASE_HUE = { A: 135, T: 0, U: 0, G: 42, C: 215, N: 270 };
  const baseCol = (kit, b, a) => kit.hue(BASE_HUE[b] != null ? BASE_HUE[b] : 270, a);
  // amino acids by the property of their side chain (textbook grouping)
  const AA_CLASS = {};
  for (const a of 'GAVLIMFWP') AA_CLASS[a] = 'nonpolar';
  for (const a of 'STCYNQ') AA_CLASS[a] = 'polar';
  for (const a of 'DE') AA_CLASS[a] = 'acidic';
  for (const a of 'KRH') AA_CLASS[a] = 'basic';
  const CLASS_HUE = { nonpolar: 40, polar: 165, acidic: 0, basic: 225 };
  const aaCol = (kit, a, alpha) => AA_CLASS[a] ? kit.hue(CLASS_HUE[AA_CLASS[a]], alpha) : kit.colors().muted;
  // common codons, for writing a protein back as DNA ("codon-optimised" style)
  const PREF = { A: 'GCC', R: 'CGC', N: 'AAC', D: 'GAC', C: 'TGC', Q: 'CAG', E: 'GAG', G: 'GGC', H: 'CAC', I: 'ATC', L: 'CTG', K: 'AAG', M: 'ATG', F: 'TTC', P: 'CCC', S: 'AGC', T: 'ACC', W: 'TGG', Y: 'TAC', V: 'GTG', '*': 'TAA' };
  const backTranslate = p => p.split('').map(a => PREF[a] || '').join('');
  const three = (B, a) => a === '*' ? 'Stop' : (B.AA[a] ? B.AA[a][1] : '???');
  const SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sup = n => String(n).replace(/-/g, '⁻').replace(/\d/g, d => SUP[+d]);
  // 1.2 × 10⁶ style numbers for populations and counts
  function sci(v, d) {
    if (!Number.isFinite(v) || v <= 0) return '0';
    const e = Math.floor(Math.log10(v));
    if (e >= 0 && e < 4) return String(Math.round(v));
    if (e < 0 && e > -3) return v.toFixed(2 - e > 4 ? 4 : 2 - e);
    let m = v / Math.pow(10, e), ee = e;
    if (+m.toFixed(d == null ? 1 : d) >= 10) { m /= 10; ee++; }
    return m.toFixed(d == null ? 1 : d) + ' × 10' + sup(ee);
  }
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  // a text box in the side panel (the simulation kit has sliders, checkboxes and menus only)
  function textBox(side, label, value, onInput) {
    const row = document.createElement('div'); row.className = 'ctl';
    const lab = document.createElement('div'); lab.className = 'cl'; lab.textContent = label;
    const inp = document.createElement('input'); inp.className = 'inp'; inp.type = 'text'; inp.value = value;
    inp.spellcheck = false; inp.setAttribute('autocomplete', 'off');
    row.appendChild(lab); row.appendChild(inp); side.appendChild(row);
    inp.addEventListener('input', () => onInput(inp.value));
    return inp;
  }
  /* the standard codon table as a 4 × 4 grid (first base: rows, second base: columns, third base: lines in a cell);
     `hi` is an RNA codon to highlight */
  function drawCodonTable(c, kit, B, x, y, w, h, hi) {
    const C = kit.colors(), L = 'UCAG', hw = 16, cw = (w - hw) / 4, ch = (h - hw) / 4;
    const fs = Math.max(7, Math.min(11, ch / 4.7, cw / 6.6));
    c.save();
    for (let j = 0; j < 4; j++) kit.label(c, L[j], x + hw + (j + 0.5) * cw, y + hw / 2, { size: 11, align: 'center', color: baseCol(kit, L[j]), weight: 700, font: MONO });
    for (let i = 0; i < 4; i++) {
      kit.label(c, L[i], x + hw / 2, y + hw + (i + 0.5) * ch, { size: 11, align: 'center', color: baseCol(kit, L[i]), weight: 700, font: MONO });
      for (let j = 0; j < 4; j++) {
        const cx = x + hw + j * cw, cy = y + hw + i * ch;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.strokeRect(cx + 0.5, cy + 0.5, cw - 1, ch - 1);
        for (let k = 0; k < 4; k++) {
          const cod = L[i] + L[j] + L[k], aa = B.CODE[cod.replace(/U/g, 'T')], ly = cy + (k + 0.5) * ch / 4;
          c.fillStyle = aa === '*' ? kit.hue(0, 0.13) : aaCol(kit, aa, 0.13);
          c.fillRect(cx + 1, cy + k * ch / 4 + 0.5, cw - 2, ch / 4 - 1);
          if (cod === hi) { c.strokeStyle = C.accent; c.lineWidth = 2; c.strokeRect(cx + 1.5, cy + k * ch / 4 + 1, cw - 3, ch / 4 - 2); }
          kit.label(c, cod + ' ' + three(B, aa), cx + 4, ly, { size: fs, color: cod === hi ? C.text : C.text2 || C.text, weight: cod === hi ? 700 : 500, font: MONO });
        }
      }
    }
    c.restore();
  }

  /* ================================================================ the double helix */
  Hyper.sim('molb-helix', {
    title: 'The double helix: pairing, Chargaff and melting',
    blurb: `A stretch of double-stranded DNA drawn as a turning helix. The top strand runs 5′ → 3′ from left to right and its partner 3′ → 5′; the letters above and below spell both strands. Every A faces a T (two hydrogen bonds, the dots in the middle) and every G faces a C (three). The temperature slider melts the helix pair by pair: each pair opens near the Marmur–Doty temperature of its local GC content, and the ends fray first. The graph is the melting curve of this sequence.

**Try this**
- Compare the base counts of one strand with those of both: a single strand can have any composition, but in the double helix A = T and G = C.
- Press *Heat slowly*. AT-rich stretches and the ends open first; GC-rich parts hold on 10–20 °C longer.
- Move the GC content of the random sequence from 30 % to 70 %: the melting curve shifts by about 16 °C (0.41 °C per per cent GC).
- Pick the promoter with a TATA box: the AT-rich box is where the helix opens most easily — one reason promoters carry one.
- Count the turns: one full turn every 10.5 base pairs, 3.6 nm. Type your own sequence (up to 60 bases) in the box.

Temperatures are for long DNA in about 0.2 M salt; a short piece like this one would really melt somewhat lower.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 250 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const TATA = 'GCGCGGCCGCTATAAAAGGGCGCGCCGCCGGCGCAGCC';
      let seed = 11, seq = 'ATGC', own = 'ATGGCGTATAAAGCGCCGATTACAGGC', open = [], tmLoc = [], curve = [], heating = false, phi = 0;
      let cTop = {}, cBot = {};
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Sequence', options: [['Random', 'rand'], ['GC-rich with an AT-rich middle', 'atmid'], ['Promoter with a TATA box', 'tata'], ['Your own (type below)', 'own']], value: 'rand' },
        { id: 'n', label: 'Length of random sequence', min: 12, max: 60, step: 1, value: 36, unit: 'bp' },
        { id: 'gcr', label: 'GC content of random sequence', min: 0.1, max: 0.9, step: 0.05, value: 0.5, fmt: v => Math.round(v * 100) + ' %' },
        { id: 'T', label: 'Temperature', min: 20, max: 110, step: 0.5, value: 37, unit: '°C' },
        { id: 'spin', type: 'check', label: 'Turn the helix', value: true },
        { type: 'buttons', items: [{ id: 'new', label: 'New random sequence', primary: true }, { id: 'heat', label: 'Heat slowly' }, { id: 'cool', label: 'Back to 37 °C' }] }
      ], (id) => {
        if (id === 'new') { seed++; ctl.set('kind', 'rand'); build(); }
        else if (id === 'heat') { if (V.T >= 104) ctl.set('T', 37); heating = true; }
        else if (id === 'cool') { heating = false; ctl.set('T', 37); }
        else if (id === 'T') heating = false;
        else if (id === 'kind' || id === 'n' || id === 'gcr') build();
      });
      const V = ctl.values;
      textBox(box.side, 'Your sequence (top strand, 5′ → 3′)', own, v => { own = B.clean(v).replace(/N/g, '').slice(0, 60); ctl.set('kind', 'own'); build(); });
      const ro = kit.readout(box.side, [['top', 'Top strand A · T · G · C'], ['bot', 'Bottom strand A · T · G · C'], ['both', 'Both strands'], ['gc', 'GC content'], ['len', 'Length'], ['tm', 'Tm of long DNA with this GC'], ['melt', 'Melted now']]);
      const plot = kit.plot(gb, { x: { label: 'temperature (°C)', min: 40, max: 115 }, y: { label: 'fraction melted', min: 0, max: 1 } }, 150);
      const count = s => ({ A: (s.match(/A/g) || []).length, T: (s.match(/T/g) || []).length, G: (s.match(/G/g) || []).length, C: (s.match(/C/g) || []).length });
      const pOpen = (tm, T) => 1 / (1 + Math.exp(-(T - tm) / 1.5));
      function build() {
        const R = B.rng(seed * 7919 + 13), n = Math.round(V.n);
        const pick = f => R() < f ? (R() < 0.5 ? 'G' : 'C') : (R() < 0.5 ? 'A' : 'T');
        if (V.kind === 'tata') seq = TATA;
        else if (V.kind === 'own') seq = own.length ? own : 'ATGC';
        else if (V.kind === 'atmid') { seq = ''; for (let i = 0; i < n; i++) seq += pick(i >= n / 3 && i < 2 * n / 3 ? 0.1 : 0.75); }
        else { seq = ''; for (let i = 0; i < n; i++) seq += pick(V.gcr); }
        const N = seq.length;
        open = new Array(N).fill(0);
        // Marmur–Doty on a 7-bp window; pairs near the ends open more easily (fraying)
        tmLoc = [];
        for (let i = 0; i < N; i++) {
          let g = 0, k = 0;
          for (let j = Math.max(0, i - 3); j <= Math.min(N - 1, i + 3); j++) { k++; if (seq[j] === 'G' || seq[j] === 'C') g++; }
          tmLoc.push(69.3 + 41 * g / k - 10 * Math.exp(-Math.min(i, N - 1 - i) / 1.5));
        }
        curve = [];
        for (let T = 40; T <= 115; T += 0.5) { let s = 0; for (const tm of tmLoc) s += pOpen(tm, T); curve.push([T, s / N]); }
        cTop = count(seq); cBot = count(seq.split('').map(b => COMP[b]).join(''));
        for (let i = 0; i < N; i++) open[i] = pOpen(tmLoc[i], V.T);
      }
      build();

      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, N = seq.length;
        const dx = N > 1 ? Math.min(24, (W - 96) / (N - 1)) : 0, xs = (W - dx * (N - 1)) / 2;
        const yc = Hh * 0.5, A = Math.min(Hh * 0.2, 50), delta = 0.75 * Math.PI;
        const fs = Math.max(8, Math.min(13, dx * 0.95 || 13));
        // the two strands spelled out
        for (let i = 0; i < N; i++) {
          const x = xs + i * dx;
          kit.label(c, seq[i], x, 15, { size: fs, align: 'center', color: baseCol(kit, seq[i]), weight: 700, font: MONO });
          kit.label(c, COMP[seq[i]], x, Hh - 15, { size: fs, align: 'center', color: baseCol(kit, COMP[seq[i]]), weight: 700, font: MONO });
        }
        kit.label(c, '5′', xs - 20, 15, { size: 12, align: 'center', color: C.muted });
        kit.label(c, '3′', xs + dx * (N - 1) + 20, 15, { size: 12, align: 'center', color: C.muted });
        kit.label(c, '3′', xs - 20, Hh - 15, { size: 12, align: 'center', color: C.muted });
        kit.label(c, '5′', xs + dx * (N - 1) + 20, Hh - 15, { size: 12, align: 'center', color: C.muted });
        // positions: each strand moves from its place on the helix to its own track as the pair opens
        const P = [];
        for (let i = 0; i < N; i++) {
          const th = 2 * Math.PI * i / 10.5 + phi, o = clamp(open[i], 0, 1);
          const y1c = yc - A * Math.sin(th), y2c = yc - A * Math.sin(th + delta);
          const y1o = yc - A * 1.3 + 4 * Math.sin(th), y2o = yc + A * 1.3 - 4 * Math.sin(th + delta);
          P.push({ x: xs + i * dx, o, y1: y1c + (y1o - y1c) * o, y2: y2c + (y2o - y2c) * o, half: (y2c - y1c) / 2,
            z1: Math.cos(th) * (1 - o) + o, z2: Math.cos(th + delta) * (1 - o) + o });
        }
        // painter's order: backbone segments and base pairs sorted by depth
        const items = [];
        for (let i = 0; i + 1 < N; i++) {
          items.push({ z: (P[i].z1 + P[i + 1].z1) / 2, f: (a) => { c.strokeStyle = kit.hue(275, a); c.lineWidth = 3.2; c.beginPath(); c.moveTo(P[i].x, P[i].y1); c.lineTo(P[i + 1].x, P[i + 1].y1); c.stroke(); } });
          items.push({ z: (P[i].z2 + P[i + 1].z2) / 2, f: (a) => { c.strokeStyle = kit.hue(190, a); c.lineWidth = 3.2; c.beginPath(); c.moveTo(P[i].x, P[i].y2); c.lineTo(P[i + 1].x, P[i + 1].y2); c.stroke(); } });
        }
        const rw = Math.max(2, Math.min(7, dx * 0.45));
        for (let i = 0; i < N; i++) {
          const p = P[i], b1 = seq[i], b2 = COMP[b1];
          items.push({ z: (p.z1 + p.z2) / 2 - 0.05, f: (a) => {
            const e1 = p.y1 + p.half * (1 - p.o) + 9 * p.o, e2 = p.y2 - p.half * (1 - p.o) - 9 * p.o;
            c.lineCap = 'butt'; c.lineWidth = rw;
            c.strokeStyle = baseCol(kit, b1, a); c.beginPath(); c.moveTo(p.x, p.y1); c.lineTo(p.x, e1); c.stroke();
            c.strokeStyle = baseCol(kit, b2, a); c.beginPath(); c.moveTo(p.x, p.y2); c.lineTo(p.x, e2); c.stroke();
            if (p.o < 0.35 && Math.abs(p.half) > 5) {
              const nb = (b1 === 'G' || b1 === 'C') ? 3 : 2, ym = (e1 + e2) / 2;
              c.fillStyle = C.text; c.globalAlpha = a * (1 - p.o / 0.35);
              for (let k = 0; k < nb; k++) { c.beginPath(); c.arc(p.x + (k - (nb - 1) / 2) * Math.min(3.2, rw * 0.8 + 0.6), ym, 1.2, 0, 6.283); c.fill(); }
              c.globalAlpha = 1;
            }
          } });
        }
        items.sort((a, b) => a.z - b.z);
        for (const it of items) it.f(0.35 + 0.65 * (it.z + 1) / 2);
        // one turn of the helix
        if (N > 11) {
          const yb = yc + A * 1.3 + 20, xa = xs, xb = xs + 10.5 * dx;
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(xa, yb - 4); c.lineTo(xa, yb); c.lineTo(xb, yb); c.lineTo(xb, yb - 4); c.stroke();
          kit.label(c, 'one turn: 10.5 bp = 3.6 nm', (xa + xb) / 2, yb + 10, { size: 11, align: 'center', color: C.muted });
        }
      }

      const loop = kit.loop(dt => {
        if (heating) { const T = Math.min(105, V.T + 2.5 * dt); ctl.set('T', T); if (T >= 105) heating = false; }
        if (V.spin) phi += dt * 0.7;
        const N = seq.length;
        let fm = 0;
        for (let i = 0; i < N; i++) { const p = pOpen(tmLoc[i], V.T); open[i] += (p - open[i]) * Math.min(1, dt * 5); fm += p; }
        fm = N ? fm / N : 0;
        const gc = B.gc(seq);
        ro.set('top', cTop.A + ' · ' + cTop.T + ' · ' + cTop.G + ' · ' + cTop.C);
        ro.set('bot', cBot.A + ' · ' + cBot.T + ' · ' + cBot.G + ' · ' + cBot.C);
        ro.set('both', 'A ' + (cTop.A + cBot.A) + ' = T ' + (cTop.T + cBot.T) + ', G ' + (cTop.G + cBot.G) + ' = C ' + (cTop.C + cBot.C));
        ro.set('gc', (100 * gc).toFixed(1) + ' %');
        ro.set('len', N + ' bp = ' + (N * 0.34).toFixed(1) + ' nm, ' + (N / 10.5).toFixed(1) + ' turns');
        ro.set('tm', (69.3 + 41 * gc).toFixed(1) + ' °C (Marmur–Doty)');
        ro.set('melt', (100 * fm).toFixed(0) + ' % of pairs; A260 up ' + (37 * fm).toFixed(0) + ' %');
        plot.set({ series: [{ pts: curve, label: 'fraction of pairs open' }], vlines: [{ x: V.T, label: V.T.toFixed(0) + ' °C' }], marks: [{ x: V.T, y: fm }] });
        draw();
      }, box.stage);
      loop.start();
    }
  });
  /* ================================================================ a replication bubble */
  Hyper.sim('molb-fork', {
    title: 'A replication bubble: leading and lagging strands',
    blurb: `Replication starts at an origin and runs both ways, opening a bubble with a fork at each end. Grey lines are the two old (parental) strands; blue is new DNA. Polymerase (green dot) can only extend a 3′ end, so each new strand grows in one direction only: towards one fork it keeps up continuously (the **leading strand**), towards the other it must restart again and again behind the fork, making **Okazaki fragments** (orange and yellow), each begun with a short RNA primer (red). The primers are replaced with DNA and DNA ligase seals the nicks (black ticks). Distances are to scale; primers are drawn wider than life so you can see them.

**Try this**
- Follow one parental strand across the origin: on one side of the origin it is copied continuously, on the other in fragments.
- Switch to a human cell: forks 20 times slower and fragments ten times shorter (100–200 nt). The readouts show why human cells need tens of thousands of origins.
- Switch ligase off (like the temperature-sensitive mutants that revealed the fragments in 1968): the fragments pile up unjoined.
- Make the Okazaki fragments very short and count the primers the cell must lay down.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const ORG = { eco: { v: 1000, ok: 1500, side: 15000, delay: 1.2 }, hum: { v: 50, ok: 180, side: 2000, delay: 2.5 } };
      const PR = 10;                                   // RNA primer, nt
      let running = true, t, d, Ls, O, top, bot, lastTop, lastBot, nextTop, nextBot, endTop, endBot, nFrag, done, R;
      const ctl = kit.controls(box.side, [
        { id: 'org', type: 'select', label: 'Cell', options: [['E. coli (bacterium)', 'eco'], ['Human cell', 'hum']], value: 'eco' },
        { id: 'v', label: 'Fork speed', min: 10, max: 1500, step: 5, value: 1000, unit: 'nt/s' },
        { id: 'ok', label: 'Okazaki fragment length', min: 50, max: 3000, value: 1500, log: true, sig: 2, unit: 'nt' },
        { id: 'speed', label: 'Playback speed', min: 0.1, max: 4, step: 0.05, value: 1, fmt: v => '×' + v.toFixed(2) },
        { id: 'lig', type: 'check', label: 'DNA ligase working', value: true },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => {
        if (id === 'org') { const o = ORG[V.org]; ctl.set('v', o.v); ctl.set('ok', o.ok); restart(); }
        else if (id === 'restart') restart();
        else if (id === 'pause') running = !running;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['rep', 'Replicated'], ['frag', 'Okazaki fragments started'], ['nick', 'Waiting to be finished'], ['eco', 'E. coli genome, one origin, this speed'], ['hum', 'Human genome, 30 000 origins at once, this speed'], ['msg', '']]);
      const okLen = () => V.ok * (0.75 + 0.5 * R());
      /* New strands are lists of pieces [a, b] in nucleotides. On the top new strand DNA grows leftwards (its 5′ end, with the
         primer, is at b); on the bottom new strand it grows rightwards (5′ end at a). Each lagging piece grows until it
         reaches `stop`, the 5′ end of the piece made before it. */
      function restart() {
        const o = ORG[V.org];
        Ls = o.side; O = Ls; t = 0; d = 0; nFrag = 0; done = false; endTop = endBot = false; R = B.rng(5);
        top = [{ a: O, b: O, lead: true, grow: true, primer: true, joined: true, matured: true }];
        bot = [{ a: O, b: O, lead: true, grow: true, primer: true, joined: true, matured: true }];
        lastTop = O; lastBot = O; nextTop = okLen(); nextBot = okLen();
      }
      restart();
      function step(h) {
        t += h;
        const v = V.v, delay = ORG[V.org].delay;
        d = Math.min(Ls, d + v * h);
        const xL = O - d, xR = O + d;
        top[0].a = xL; bot[0].b = xR; top[0].grow = bot[0].grow = d < Ls;
        // primase lays a primer just behind each fork on the lagging strand
        if (d < Ls) {
          if (xR - lastTop >= nextTop) { const b = xR - 5; top.push({ a: b, b, stop: lastTop, grow: true, primer: true, joined: false, idx: ++nFrag, tDone: 0 }); lastTop = b; nextTop = okLen(); }
          if (lastBot - xL >= nextBot) { const a = xL + 5; bot.push({ a, b: a, stop: lastBot, grow: true, primer: true, joined: false, idx: ++nFrag, tDone: 0 }); lastBot = a; nextBot = okLen(); }
        } else {
          if (!endTop) { if (xR - lastTop > PR) { top.push({ a: xR, b: xR, stop: lastTop, grow: true, primer: true, joined: false, idx: ++nFrag, tDone: 0 }); lastTop = xR; } endTop = true; }
          if (!endBot) { if (lastBot - xL > PR) { bot.push({ a: xL, b: xL, stop: lastBot, grow: true, primer: true, joined: false, idx: ++nFrag, tDone: 0 }); lastBot = xL; } endBot = true; }
        }
        for (const p of top) if (!p.lead && p.grow) { p.a -= v * h; if (p.a <= p.stop) { p.a = p.stop; p.grow = false; p.tDone = t; } }
        for (const p of bot) if (!p.lead && p.grow) { p.b += v * h; if (p.b >= p.stop) { p.b = p.stop; p.grow = false; p.tDone = t; } }
        // a finished fragment: the primer of the piece it ran into is replaced by DNA, then ligase seals the nick
        for (const [arr, key] of [[top, 'b'], [bot, 'a']]) for (const p of arr) {
          if (!p.lead && !p.grow && !p.matured && t - p.tDone >= delay) {
            p.matured = true;
            const nb = arr.find(q => q !== p && q[key] === p.stop);
            if (nb) nb.primer = false;
          }
          if (p.matured && !p.joined && V.lig && t - p.tDone >= 1.6 * delay) p.joined = true;
          // primers at the edges of the drawing are removed when the forks of the neighbouring replicons arrive
          if (d >= Ls && p.primer && !p.lead && p.matured && (p[key] <= 0 || p[key] >= 2 * Ls)) p.primer = false;
        }
        done = d >= Ls && endTop && endBot && top.every(p => p.lead || (p.matured && p.joined)) && bot.every(p => p.lead || (p.matured && p.joined));
      }
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const mx = 34, X = p => mx + p / (2 * Ls) * (W - 2 * mx);
        const yc = Hh * 0.4, sep = 36, nw = 23, dup = 5;
        const XL = X(O - d), XR = X(O + d), w = Math.min(16, Math.max(0, (XR - XL) / 2));
        // parental strands, opening at the forks
        c.lineCap = 'round'; c.lineJoin = 'round'; c.lineWidth = 3; c.strokeStyle = C.muted;
        for (const s of [-1, 1]) {
          c.beginPath(); c.moveTo(X(0), yc + s * dup);
          if (d > 0) { c.lineTo(XL, yc + s * dup); c.lineTo(XL + w, yc + s * sep); c.lineTo(XR - w, yc + s * sep); c.lineTo(XR, yc + s * dup); }
          c.lineTo(X(2 * Ls), yc + s * dup); c.stroke();
        }
        kit.label(c, '5′', X(0) - 14, yc - dup - 2, { size: 11, align: 'center', color: C.muted });
        kit.label(c, '3′', X(2 * Ls) + 14, yc - dup - 2, { size: 11, align: 'center', color: C.muted });
        kit.label(c, '3′', X(0) - 14, yc + dup + 2, { size: 11, align: 'center', color: C.muted });
        kit.label(c, '5′', X(2 * Ls) + 14, yc + dup + 2, { size: 11, align: 'center', color: C.muted });
        // new strands
        const pw = Math.max(4, X(PR) - X(0));
        const piece = (p, y, isTop) => {
          const x1 = X(p.a), x2 = X(p.b);
          c.lineCap = 'butt'; c.lineWidth = 4;
          c.strokeStyle = p.lead || (p.joined && !p.primer) ? kit.hue(212) : kit.hue(p.idx % 2 ? 28 : 50);
          if (x2 - x1 > 0.3) { c.beginPath(); c.moveTo(x1, y); c.lineTo(x2, y); c.stroke(); }
          if (p.primer) { c.fillStyle = kit.hue(355); if (isTop) c.fillRect(x2 - pw, y - 3.5, pw, 7); else c.fillRect(x1, y - 3.5, pw, 7); }
          if (!p.lead && !p.grow && !p.joined) { const xn = isTop ? x1 : x2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(xn, y - 7); c.lineTo(xn, y + 7); c.stroke(); }
          if (p.grow && (p.lead ? d > 0 : true)) kit.dot(c, isTop ? x1 : x2, y, 4.5, kit.hue(140));
        };
        for (const p of top) piece(p, yc - nw, true);
        for (const p of bot) piece(p, yc + nw, false);
        // helicases and the direction the forks move
        c.strokeStyle = kit.hue(285); c.lineWidth = 2;
        if (d < Ls && d > 0) for (const x of [XL, XR]) { c.beginPath(); c.ellipse(x, yc, 7, 13, 0, 0, 6.283); c.stroke(); }
        if (d < Ls) {
          kit.arrow(c, XR + 8, yc - sep - 16, XR + 34, yc - sep - 16, C.muted, 1.5);
          kit.arrow(c, XL - 8, yc - sep - 16, XL - 34, yc - sep - 16, C.muted, 1.5);
          kit.label(c, 'helicase', XR + 10, yc + 2, { size: 11, color: kit.hue(285) });
        }
        // the origin
        const xo = X(O);
        c.fillStyle = C.text; c.beginPath(); c.moveTo(xo, yc + sep + 8); c.lineTo(xo - 6, yc + sep + 18); c.lineTo(xo + 6, yc + sep + 18); c.closePath(); c.fill();
        kit.label(c, 'origin', xo, yc + sep + 28, { size: 11, align: 'center', color: C.muted });
        // which strand is which
        if (XR - xo > 150) {
          kit.label(c, 'lagging strand ←', (xo + XR) / 2, yc - 9, { size: 11, align: 'center', color: kit.hue(35) });
          kit.label(c, 'leading strand →', (xo + XR) / 2, yc + 9, { size: 11, align: 'center', color: kit.hue(212) });
          kit.label(c, '← leading strand', (XL + xo) / 2, yc - 9, { size: 11, align: 'center', color: kit.hue(212) });
          kit.label(c, '→ lagging strand', (XL + xo) / 2, yc + 9, { size: 11, align: 'center', color: kit.hue(35) });
        }
        // scale
        const ya = Hh - 58, span = 2 * Ls, stp = Hyper.niceStep ? Hyper.niceStep(span, 6) : span / 6;
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(X(0), ya); c.lineTo(X(span), ya); c.stroke();
        for (let v = 0; v <= span + 1e-9; v += stp) {
          c.beginPath(); c.moveTo(X(v), ya); c.lineTo(X(v), ya + 4); c.stroke();
          kit.label(c, (v - O) / 1000 + ' kb', X(v), ya + 13, { size: 10, align: 'center', color: C.muted });
        }
        // legend
        const lg = [[C.muted, 'parental DNA'], [kit.hue(212), 'new DNA'], [kit.hue(28), 'Okazaki fragment'], [kit.hue(355), 'RNA primer'], [kit.hue(140), 'DNA polymerase']];
        let lx = 12; const ly = Hh - 18;
        for (const [col, txt] of lg) {
          c.fillStyle = col; c.fillRect(lx, ly - 3, 16, 6);
          kit.label(c, txt, lx + 21, ly, { size: 11, color: C.text2 || C.text });
          lx += 30 + txt.length * 6.2;
          if (lx > W - 80) break;
        }
      }
      const loop = kit.loop(dt => {
        if (running && !done) {
          const tot = dt * V.speed, n = Math.max(1, Math.ceil(tot / 0.01)), h = tot / n;
          for (let k = 0; k < n; k++) step(h);
        }
        const all = top.concat(bot);
        const primers = all.filter(p => p.primer).length, nicks = all.filter(p => !p.lead && !p.grow && !p.joined).length;
        ro.set('t', t.toFixed(2) + ' s');
        ro.set('rep', Math.round(2 * d) + ' of ' + 2 * Ls + ' bp (' + (100 * d / Ls).toFixed(0) + ' %)');
        ro.set('frag', String(nFrag));
        ro.set('nick', primers + ' primers, ' + nicks + ' nicks');
        ro.set('eco', (4.64e6 / (2 * V.v) / 60).toFixed(1) + ' min');
        const hm = 6.2e9 / (2 * 30000 * V.v) / 60;
        ro.set('hum', hm < 120 ? hm.toFixed(0) + ' min' : (hm / 60).toFixed(1) + ' h');
        ro.set('msg', done ? 'Finished: each daughter helix has one old and one new strand.' : !V.lig && d >= Ls ? 'Without ligase the fragments stay unjoined.' : running ? '' : 'Paused');
        draw();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ Meselson and Stahl */
  Hyper.sim('molb-meselson', {
    title: 'Meselson and Stahl: heavy, hybrid and light DNA',
    blurb: `Bacteria grown for many generations on heavy nitrogen (¹⁵N) have heavy DNA. They are moved to ordinary ¹⁴N and a sample is taken after each generation; spun in a caesium chloride gradient, DNA collects in a band where its density matches the salt (denser DNA lower in the tube). Pick a model of copying and see what the tubes would show; the molecules on the right are the copies of one original heavy molecule (dark: heavy strand, pale: light strand).

**Try this**
- Semiconservative: after one generation a single band exactly halfway between heavy and light; after two, hybrid and light in equal amounts. This is what Meselson and Stahl saw in 1958.
- Conservative: heavy and light bands after one generation and never a hybrid — ruled out by the first sample.
- Dispersive: one band creeping upwards generation by generation. The generation-one tube alone cannot tell it from semiconservative; tick *Heat-denature* — separated strands are either fully heavy or fully light only if copying is semiconservative.
- Check the hybrid fraction against $2^{1-g}$.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 290 });
      let anim = 1;
      const ctl = kit.controls(box.side, [
        { id: 'model', type: 'select', label: 'Suppose copying is…', options: [['semiconservative', 'semi'], ['conservative', 'cons'], ['dispersive', 'disp']], value: 'semi' },
        { id: 'g', label: 'Generations in ¹⁴N medium', min: 0, max: 5, step: 1, value: 0 },
        { id: 'den', type: 'check', label: 'Heat-denature the DNA before spinning', value: false },
        { type: 'buttons', items: [{ id: 'grow', label: 'Grow one generation', primary: true }, { id: 'reset', label: 'Back to heavy DNA' }] }
      ], (id) => {
        if (id === 'grow') { if (V.g < 5) { ctl.set('g', Math.round(V.g) + 1); anim = 0; } }
        else if (id === 'reset') { ctl.set('g', 0); anim = 1; }
        else anim = 1;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['gen', 'Generation'], ['mol', 'Molecules from one heavy molecule'], ['h', 'Heavy (¹⁵N/¹⁵N)'], ['y', 'Hybrid (¹⁵N/¹⁴N)'], ['l', 'Light (¹⁴N/¹⁴N)'], ['th', 'Semiconservative hybrid fraction 2^(1−g)']]);
      const RHO = { heavy: 1.724, hybrid: 1.717, light: 1.710, ssH: 1.739, ssL: 1.725 };
      function bands(model, g, den) {
        const f = Math.pow(2, -g);
        if (den) {
          if (model === 'disp') return [{ rho: RHO.ssL + (RHO.ssH - RHO.ssL) * f, amt: 1 }];
          return [{ rho: RHO.ssH, amt: f }, { rho: RHO.ssL, amt: 1 - f }].filter(b => b.amt > 0);
        }
        if (model === 'disp') return [{ rho: RHO.light + (RHO.heavy - RHO.light) * f, amt: 1 }];
        if (g === 0) return [{ rho: RHO.heavy, amt: 1 }];
        if (model === 'semi') return [{ rho: RHO.hybrid, amt: 2 * f }, { rho: RHO.light, amt: 1 - 2 * f }].filter(b => b.amt > 0);
        return [{ rho: RHO.heavy, amt: f }, { rho: RHO.light, amt: 1 - f }];
      }
      // the strands of every molecule descended from one heavy molecule: each strand is 8 segments, 1 = heavy
      function molecules(model, g) {
        const M = Math.pow(2, g), out = [], R = B.rng(97 + g);
        for (let m = 0; m < M; m++) {
          let s1, s2;
          if (model === 'semi') { s1 = new Array(8).fill(m === 0 ? 1 : 0); s2 = new Array(8).fill(m === M - 1 ? 1 : 0); if (M === 1) s2 = new Array(8).fill(1); }
          else if (model === 'cons') { const h = m === 0 ? 1 : 0; s1 = new Array(8).fill(h); s2 = new Array(8).fill(h); }
          else { const f = Math.pow(2, -g); s1 = Array.from({ length: 8 }, () => (g === 0 || R() < f) ? 1 : 0); s2 = Array.from({ length: 8 }, () => (g === 0 || R() < f) ? 1 : 0); }
          out.push([s1, s2]);
        }
        return out;
      }
      const pct = x => (100 * x).toFixed(x > 0 && x < 0.1 ? 2 : 1) + ' %';
      const loop = kit.loop(dt => {
        anim = Math.min(1, anim + dt * 1.2);
        const g = Math.round(V.g), c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        const narrow = W < 600, labW = narrow ? 70 : 150;
        const lw = W * (narrow ? 0.64 : 0.56), y0 = 38, y1 = Hh - 34, yR = r => y0 + (r - 1.700) / 0.045 * (y1 - y0);
        // density scale
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(44, y0); c.lineTo(44, y1); c.stroke();
        for (let r = 1.700; r <= 1.745 + 1e-9; r += 0.01) { const y = yR(r); c.beginPath(); c.moveTo(40, y); c.lineTo(44, y); c.stroke(); kit.label(c, r.toFixed(2), 36, y, { size: 10, align: 'right', color: C.muted }); }
        kit.label(c, 'density (g/mL)', 8, 16, { size: 11, color: C.muted });
        // reference lines
        const refs = V.den ? [[RHO.ssL, narrow ? 'light ss' : 'light single strands'], [RHO.ssH, narrow ? 'heavy ss' : 'heavy single strands']] : [[RHO.light, narrow ? '¹⁴N/¹⁴N' : '¹⁴N/¹⁴N light'], [RHO.hybrid, 'hybrid'], [RHO.heavy, narrow ? '¹⁵N/¹⁵N' : '¹⁵N/¹⁵N heavy']];
        c.setLineDash([3, 4]); c.strokeStyle = C.faint;
        for (const [r] of refs) { c.beginPath(); c.moveTo(48, yR(r)); c.lineTo(lw, yR(r)); c.stroke(); }
        c.setLineDash([]);
        for (const [r, txt] of refs) kit.label(c, txt, lw - 2, yR(r) - 7, { size: 10, align: 'right', color: C.muted });
        // one tube per generation sampled so far
        const nt = 6, tw = Math.max(6, Math.min(46, (lw - 58 - labW) / nt - 3)), gapx = Math.max(2, (lw - 58 - labW - nt * tw) / nt);
        for (let k = 0; k <= g; k++) {
          const x = 58 + k * (tw + gapx), a = k === g ? anim : 1;
          c.fillStyle = kit.hue(200, 0.06); c.strokeStyle = C.border2 || C.muted; c.lineWidth = 1.2;
          c.beginPath(); if (c.roundRect) c.roundRect(x, y0 - 6, tw, y1 - y0 + 14, [3, 3, tw / 2, tw / 2]); else c.rect(x, y0 - 6, tw, y1 - y0 + 14); c.fill(); c.stroke();
          for (const b of bands(V.model, k, V.den)) {
            const y = yR(b.rho), al = a * (0.18 + 0.82 * b.amt);
            c.fillStyle = kit.hue(222, al); c.fillRect(x + 3, y - 3.5, tw - 6, 7);
            c.fillStyle = kit.hue(222, al * 0.35); c.fillRect(x + 3, y - 6.5, tw - 6, 13);
          }
          kit.label(c, 'gen ' + k, x + tw / 2, y1 + 18, { size: 11, align: 'center', color: k === g ? C.text : C.muted, weight: k === g ? 700 : 500 });
        }
        // the molecules of the current generation
        const mols = molecules(V.model, g), M = mols.length, rx = lw + 16, rw = W - rx - 12, rh = Hh - 70;
        const cols = Math.max(1, Math.ceil(Math.sqrt(M * rw / Math.max(1, rh) / 3))), rows = Math.ceil(M / cols);
        const cw = rw / cols, chh = Math.min(34, rh / rows), segW = Math.max(2, (cw - 14) / 8);
        kit.label(c, V.den ? 'single strands after heating' : 'copies of one heavy molecule', rx, 16, { size: 11, color: C.muted });
        for (let m = 0; m < M; m++) {
          const col = m % cols, row = Math.floor(m / cols), x = rx + col * cw + 4, y = 40 + row * chh;
          const split = V.den ? Math.min(9, chh * 0.3) : 2.5;
          for (let s = 0; s < 2; s++) {
            const yy = y + (s ? split : -split);
            for (let k = 0; k < 8; k++) {
              c.fillStyle = mols[m][s][k] ? kit.hue(222, anim) : kit.hue(45, 0.55 * anim);
              c.fillRect(x + k * segW, yy - 1.8, segW - 0.6, 3.6);
            }
          }
        }
        c.fillStyle = kit.hue(222); c.fillRect(rx, Hh - 22, 16, 5); kit.label(c, 'heavy ¹⁵N strand', rx + 21, Hh - 19, { size: 11, color: C.text2 || C.text });
        c.fillStyle = kit.hue(45, 0.55); c.fillRect(rx + 130, Hh - 22, 16, 5); kit.label(c, 'light ¹⁴N', rx + 151, Hh - 19, { size: 11, color: C.text2 || C.text });
        // numbers (native bands)
        const nb = bands(V.model, g, false);
        let hv = 0, hy = 0, li = 0;
        for (const b of nb) { if (Math.abs(b.rho - RHO.heavy) < 1e-6) hv += b.amt; else if (Math.abs(b.rho - RHO.hybrid) < 1e-6) hy += b.amt; else if (Math.abs(b.rho - RHO.light) < 1e-6) li += b.amt; }
        ro.set('gen', String(g));
        ro.set('mol', String(M));
        if (V.model === 'disp' && g > 0) { ro.set('h', '—'); ro.set('y', 'one band at ' + nb[0].rho.toFixed(4) + ' g/mL'); ro.set('l', '—'); }
        else { ro.set('h', pct(hv)); ro.set('y', pct(hy)); ro.set('l', pct(li)); }
        ro.set('th', g === 0 ? '— (all heavy)' : pct(Math.pow(2, 1 - g)));
      }, box.stage);
      loop.start();
    }
  });
  /* ================================================================ genes used by the next two simulations */
  // proteins written back as DNA with common codons, and two real coding sequences
  const GFP = 'MSKGEELFTGVVPILVELDGDVNGHKFSVSGEGEGDATYGKLTLKFICTTGKLPVPWPTLVTTFSYGVQCFSRYPDHMKQHDFFKSAMPEGYVQERTIFFKDDGNYKTRAEVKFEGDTLVNRIELKGIDFKEDGNILGHKLEYNYNSHNVYIMADKQKNGIKVNFKIRHNIEDGSVQLADHYQQNTPIGDGPVLLPDNHYLSTQSALSKDPNEKRDHMVLLEFVTAAGITHGMDELYK';
  const PREPROINS = 'MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKTRREAEDLQVGQVELGGGPGAGSLQPLALEGSLQKRGIVEQCCTSICSLYQLENYCN';
  const INS_B = 'FVNQHLCGSHLVEALYLVCGERGFFYTPKT';
  const HBB31 = 'ATGGTGCACCTGACTCCTGAGGAGAAGTCTGCCGTTACTGCCCTGTGGGGCAAGGTGAACGTGGATGAAGTTGGTGGTGAGGCCCTGGGCAGG';   // human β-globin, codons 1–31
  const TRPL = 'ATGAAAGCAATTTTCGTACTGAAAGGTTGGTGGCGCACTTCCTGA';   // E. coli trp leader peptide MKAIFVLKGWWRTS

  /* ================================================================ transcription and translation in real time */
  Hyper.sim('molb-express', {
    title: 'From gene to protein, in real time',
    blurb: `Top: RNA polymerase moves along the gene, opening a bubble and reading the template strand; the mRNA (same sequence as the coding strand, U for T) peels off behind it. Middle: the first ribosome on that mRNA, with its E, P and A sites; the tRNA in the A site brings the amino acid that matches the codon, and the chain hangs from the tRNA in the P site. Bottom: the protein so far, coloured by the kind of side chain, and the codon table with the codon being read. The bar at the very top is the whole gene, with the polymerase (triangle) and every ribosome on it. Speeds are real: about 40 nucleotides a second for the polymerase, 15 amino acids a second for a bacterial ribosome and 5 for ours.

**Try this**
- In a bacterium, watch the first ribosome start while the mRNA is still being made, and then ride right behind the polymerase — it cannot go faster than the mRNA appears.
- Switch to a eukaryotic cell: the mRNA must first be capped, spliced, given a poly(A) tail and exported from the nucleus (a few minutes, fast-forwarded here), and our ribosomes are slower.
- Time GFP (238 amino acids) from the first nucleotide to the last amino acid, and compare with the formulas: $t = L/v$.
- Pick β-globin: the sickle-cell codon (GAG, the 7th counting ATG) is read about half a second after the start.
- Type any coding sequence: translation starts at the first ATG and stops at the first stop codon in that frame.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 380, maxH: 620 });
      const GENES = {
        gfp: { cds: backTranslate(GFP) + 'TAA' }, ins: { cds: backTranslate(PREPROINS) + 'TAG' },
        trp: { cds: TRPL }, hbb: { cds: HBB31, open: true }
      };
      const LEAD = { bac: 'TTTAAGAAGGAGATATACC', euk: 'ACAGCTTGCCGCCACC' }, TRAIL = 'GGATCCAATAAAGCGC';
      const PROC = 300, LOAD = 3, FOOT = 10, MAXR = 8;   // processing + export (s), seconds between ribosomes, footprint (codons)
      let own = 'ATGGCTAGCAAAGGAGAAGAACTTTTCACTGGAGTTGTCCCAATTCTTGTTGAATTAGATGGTTAA';
      let dna = '', mrna = '', start = -1, prot = '', ncod = 0, Ltx = 0, tau = 0, ptx = 0, ribos = [], nextLoad = 0, finished = 0, procEnd = -1, running = true, open = false;
      const ctl = kit.controls(box.side, [
        { id: 'gene', type: 'select', label: 'Gene', options: [['Green fluorescent protein (238 aa)', 'gfp'], ['Human preproinsulin (110 aa)', 'ins'], ['E. coli trp leader peptide (14 aa)', 'trp'], ['Human β-globin, first 31 codons', 'hbb'], ['Your own sequence (type below)', 'own']], value: 'gfp' },
        { id: 'org', type: 'select', label: 'Cell', options: [['Bacterium (no nucleus)', 'bac'], ['Eukaryotic cell (nucleus)', 'euk']], value: 'bac' },
        { id: 'vtx', label: 'RNA polymerase speed', min: 10, max: 100, step: 1, value: 40, unit: 'nt/s' },
        { id: 'vtl', label: 'Ribosome speed', min: 1, max: 25, step: 0.5, value: 15, unit: 'aa/s' },
        { id: 'speed', label: 'Playback speed', min: 0.25, max: 20, value: 1, log: true, sig: 2, fmt: v => '×' + v },
        { id: 'table', type: 'check', label: 'Show the codon table', value: true },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => {
        if (id === 'org') { ctl.set('vtl', V.org === 'bac' ? 15 : 5); restart(); }
        else if (id === 'gene' || id === 'restart') restart();
        else if (id === 'pause') running = !running;
      });
      const V = ctl.values;
      textBox(box.side, 'Your sequence (coding strand 5′ → 3′; read from the first ATG)', own, v => { own = B.clean(v).replace(/N/g, '').slice(0, 1500); ctl.set('gene', 'own'); restart(); });
      const ro = kit.readout(box.side, [['t', 'Time'], ['mrna', 'mRNA made'], ['codon', 'Codon being read'], ['prot', 'Protein on the ribosome shown'], ['ribo', 'Ribosomes on the mRNA / proteins finished'], ['exp', 'Expected'], ['msg', '']]);
      function restart() {
        const org = V.org;
        if (V.gene === 'own') { dna = own.length ? own : 'ATG'; start = dna.indexOf('ATG'); open = false; }
        else { dna = LEAD[org] + GENES[V.gene].cds + TRAIL; start = LEAD[org].length; open = !!GENES[V.gene].open; }
        mrna = B.transcribe(dna);
        const tr = start < 0 ? '' : B.translate(V.gene === 'own' ? dna.slice(start) : GENES[V.gene].cds), si = tr.indexOf('*');
        prot = si >= 0 ? tr.slice(0, si) : tr;
        ncod = start >= 0 ? prot.length + (si >= 0 ? 1 : 0) : 0;
        Ltx = dna.length; tau = 0; ptx = 0; ribos = []; finished = 0; procEnd = -1; nextLoad = 0;
      }
      restart();
      function step(h) {
        tau += h;
        const euk = V.org === 'euk';
        if (ptx < Ltx) ptx = Math.min(Ltx, ptx + V.vtx * h);
        if (euk && ptx >= Ltx && procEnd < 0) procEnd = tau + PROC;
        const ready = start >= 0 && ncod > 0 && (euk ? procEnd >= 0 && tau >= procEnd : ptx >= start + 15);
        if (ready && tau >= nextLoad && ribos.length < MAXR) {
          const last = ribos[ribos.length - 1];
          if (!last || last.done || last.c >= FOOT) { ribos.push({ c: 0, done: false }); nextLoad = tau + LOAD; }
        }
        const avail = (ptx - start) / 3 - 1;
        let ahead = Infinity;
        for (const r of ribos) {
          if (r.done) continue;
          let lim = Math.min(ncod, ahead - FOOT);
          if (!euk) lim = Math.min(lim, avail);
          r.c = Math.max(r.c, Math.min(r.c + V.vtl * h, lim));
          if (r.c >= ncod - 1e-9) { r.c = ncod; r.done = true; finished++; }
          else ahead = r.c;
        }
      }
      const fmtT = s => s < 120 ? s.toFixed(1) + ' s' : (s / 60).toFixed(1) + ' min';
      // the ribosome followed on screen: the first one still working (or the last one to finish)
      const shown = () => ribos.find(r => !r.done) || ribos[ribos.length - 1];
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, euk = V.org === 'euk';
        const lead = shown(), c0 = lead ? lead.c : 0;
        const inProc = euk && procEnd >= 0 && tau < procEnd;
        // --- phase line and the whole gene
        const phase = !euk ? (W >= 520 ? 'Bacterium: transcription and translation together in the cytoplasm' : 'Bacterium: both at once')
          : ptx < Ltx ? 'Nucleus: transcription' : inProc ? (W >= 520 ? 'Nucleus: cap, splicing, poly(A) tail, export — fast-forwarded' : 'Nucleus: processing, export') : 'Cytoplasm: translation';
        kit.label(c, phase, 12, 12, { size: 12, color: C.text, weight: 600 });
        const gx0 = 16, gx1 = W - 16, gy = 32, GX = p => gx0 + p / Math.max(1, Ltx) * (gx1 - gx0);
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(gx0, gy); c.lineTo(gx1, gy); c.stroke();
        if (start >= 0) { c.strokeStyle = kit.hue(270); c.lineWidth = 5; c.beginPath(); c.moveTo(GX(start), gy); c.lineTo(GX(Math.min(Ltx, start + 3 * ncod)), gy); c.stroke(); }
        c.strokeStyle = kit.hue(212); c.lineWidth = 2.5; c.beginPath(); c.moveTo(gx0, gy + 7); c.lineTo(GX(ptx), gy + 7); c.stroke();
        if (euk && procEnd >= 0 && !inProc) { kit.dot(c, gx0, gy + 7, 3.5, kit.hue(330)); kit.label(c, 'AAAA…', GX(Ltx) + 2, gy + 7, { size: 9, color: kit.hue(330), align: 'right', font: MONO }); }
        if (ptx < Ltx) { c.fillStyle = kit.hue(140); c.beginPath(); c.moveTo(GX(ptx), gy - 3); c.lineTo(GX(ptx) - 5, gy - 11); c.lineTo(GX(ptx) + 5, gy - 11); c.closePath(); c.fill(); }
        for (const r of ribos) if (!r.done) { c.fillStyle = kit.hue(285, 0.8); c.beginPath(); c.ellipse(GX(start + 3 * r.c), gy + 7, 4, 6, 0, 0, 6.283); c.fill(); }
        if (W >= 640) kit.label(c, Ltx + ' nt' + (start >= 0 ? ', coding region ' + (3 * ncod) + ' nt' : ', no ATG'), gx1, gy - 9, { size: 10, align: 'right', color: C.muted });
        // --- the DNA around the polymerase
        const cw = 11, nwin = Math.max(10, Math.floor((W - 90) / cw)), p0 = Math.floor(ptx), ws = clamp(p0 - Math.floor(nwin * 0.62), 0, Math.max(0, Ltx - nwin));
        const xb = 82, yCod = 68, yTem = 100, yRna = 124, busy = ptx < Ltx;
        kit.label(c, 'coding 5′', 6, yCod, { size: 10, color: C.muted }); kit.label(c, 'template 3′', 6, yTem, { size: 10, color: C.muted }); kit.label(c, 'mRNA 5′', 6, yRna, { size: 10, color: kit.hue(212) });
        if (busy) {
          const xp = xb + (ptx - ws) * cw;
          c.fillStyle = kit.hue(140, 0.16); c.strokeStyle = kit.hue(140, 0.7); c.lineWidth = 1.5;
          c.beginPath(); if (c.roundRect) c.roundRect(xp - 10 * cw, yCod - 20, 13 * cw, yRna - yCod + 32, 14); else c.rect(xp - 10 * cw, yCod - 20, 13 * cw, yRna - yCod + 32); c.fill(); c.stroke();
          kit.label(c, 'RNA polymerase →', xp - 9.5 * cw, yCod - 12, { size: 10, color: kit.hue(140) });
        }
        for (let i = ws; i < Math.min(Ltx, ws + nwin); i++) {
          const x = xb + (i - ws) * cw + cw / 2, b = dna[i], inBub = busy && Math.abs(i + 0.5 - ptx) < 7;
          const cod = start >= 0 && i >= start && i < start + 3 * ncod;
          kit.label(c, b, x, yCod - (inBub ? 7 : 0), { size: 11, align: 'center', color: baseCol(kit, b), weight: cod ? 700 : 500, font: MONO });
          kit.label(c, COMP[b], x, yTem + (inBub ? 6 : 0), { size: 11, align: 'center', color: baseCol(kit, COMP[b], 0.85), font: MONO });
          if (i < ptx) kit.label(c, mrna[i], x, yRna, { size: 11, align: 'center', color: baseCol(kit, mrna[i]), weight: 600, font: MONO });
          if (start >= 0 && (i === start || i === start + 3 * (ncod - 1)) && ncod > 0) { c.strokeStyle = i === start ? C.ok : C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(x - cw / 2, yCod + 8); c.lineTo(x + 2.5 * cw, yCod + 8); c.stroke(); }
        }
        if (!busy) kit.label(c, 'transcription finished (' + fmtT(Ltx / V.vtx) + ')', W - 12, yCod - 12, { size: 10, align: 'right', color: C.muted });
        // --- translation: the mRNA under the first ribosome
        const yM = 214, codW = 3 * cw + 7, ncw = Math.max(5, Math.floor((W - 24) / codW)), xc = W / 2;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(0, 150); c.lineTo(W, 150); c.stroke();
        if (!lead) {
          const why = start < 0 ? 'No ATG in this sequence: nothing to translate.'
            : euk ? (ptx < Ltx ? 'In a eukaryote the mRNA is finished and processed in the nucleus before any ribosome sees it.' : 'Processing and export: about ' + (PROC / 60) + ' min (fast-forwarded).')
              : 'Waiting for the ribosome-binding site and the start codon to be transcribed…';
          kit.label(c, why, W / 2, yM - 10, { size: 12, align: 'center', color: C.muted });
        } else {
          const a = Math.min(Math.floor(c0), ncod - 1);
          const xA = xc - codW / 2, X = k => xA + (k - c0) * codW;   // codon k's left edge: the ribosome stays put, the mRNA slides through
          for (let k = Math.floor(c0) - Math.ceil(ncw / 2) - 1; k <= Math.floor(c0) + Math.ceil(ncw / 2) + 1; k++) {
            const n0 = start + 3 * k;
            if (n0 + 3 <= 0 || n0 >= Ltx) continue;
            const x = X(k), coding = k >= 0 && k < ncod;
            if (x + codW < 0 || x > W) continue;
            c.fillStyle = coding ? kit.hue(212, 0.1) : C.grid; c.fillRect(x + 1, yM - 10, codW - 3, 20);
            for (let j = 0; j < 3; j++) { const n = n0 + j; if (n >= 0 && n < Ltx) kit.label(c, mrna[n], x + 5 + j * cw + cw / 2, yM, { size: 11, align: 'center', color: baseCol(kit, mrna[n]), weight: 600, font: MONO }); }
            if (coding && k % 5 === 0) kit.label(c, String(k + 1), x + codW / 2, yM + 20, { size: 9, align: 'center', color: C.faint });
          }
          // other ribosomes on the stretch shown
          for (const r of ribos) if (r !== lead && !r.done) { const xr = X(r.c - 1); if (xr > -80 && xr < W + 80) { c.strokeStyle = kit.hue(285, 0.6); c.lineWidth = 1.5; c.beginPath(); c.ellipse(xr + codW / 2, yM - 2, codW * 1.6, 20, 0, 0, 6.283); c.stroke(); } }
          // the ribosome: small subunit under, large subunit over the E, P and A sites
          const xs = xA - 2 * codW, xe = xA + codW;
          c.fillStyle = kit.hue(285, 0.2); c.strokeStyle = kit.hue(285, 0.8); c.lineWidth = 1.5;
          c.beginPath(); c.ellipse((xs + xe) / 2, yM + 17, 1.65 * codW, 13, 0, 0, 6.283); c.fill(); c.stroke();
          c.beginPath(); c.ellipse((xs + xe) / 2, yM - 34, 1.8 * codW, 27, 0, 0, 6.283); c.fill(); c.stroke();
          ['E', 'P', 'A'].forEach((s, j) => kit.label(c, s, xs + (j + 0.5) * codW, yM + 19, { size: 10, align: 'center', color: kit.hue(285), weight: 700 }));
          // tRNAs in P and A with their amino acids; the chain hangs from the P-site tRNA
          const trna = (k, x, withChain) => {
            if (k < 0 || k >= ncod) return;
            const cod = mrna.substr(start + 3 * k, 3), aa = B.CODE[cod.replace(/U/g, 'T')];
            if (aa === '*') { c.fillStyle = C.bad; c.fillRect(x + 6, yM - 44, codW - 12, 22); kit.label(c, 'release factor', x + codW / 2, yM - 52, { size: 9, align: 'center', color: C.bad }); return; }
            const anti = cod.split('').map(b => COMP[b] === 'T' ? 'U' : COMP[b]).join('');
            c.fillStyle = C.surface || C.bg2 || '#fff'; c.strokeStyle = C.muted; c.lineWidth = 1.2;
            c.beginPath(); c.rect(x + 4, yM - 30, codW - 8, 17); c.fill(); c.stroke();
            kit.label(c, anti, x + codW / 2, yM - 21.5, { size: 10, align: 'center', color: C.text2 || C.text, font: MONO });
            c.strokeStyle = C.muted; c.beginPath(); c.moveTo(x + codW / 2, yM - 30); c.lineTo(x + codW / 2, yM - 44); c.stroke();
            kit.dot(c, x + codW / 2, yM - 50, 7, aaCol(kit, aa), C.surface);
            kit.label(c, aa, x + codW / 2, yM - 50, { size: 9, align: 'center', color: '#fff', weight: 700 });
            if (withChain) {   // the last few residues already joined, curling up to the left
              const n = Math.min(k, 9);
              let px = x + codW / 2, py = yM - 50;
              for (let q = 1; q <= n; q++) {
                const nx = px - 9 * Math.cos(0.35 * q), ny = py - 9 * Math.sin(0.25 + 0.3 * q) - 2;
                c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(px, py); c.lineTo(nx, ny); c.stroke();
                kit.dot(c, nx, ny, 5, aaCol(kit, prot[k - q]));
                px = nx; py = ny;
              }
            }
          };
          trna(a, X(a), false);          // the incoming aminoacyl-tRNA (A site), sliding to P as the ribosome moves on
          trna(a - 1, X(a - 1), true);   // the tRNA holding the chain
        }
        // --- the protein so far and the codon table
        const yP = 272, showT = V.table && W >= 560, pw = showT ? W * 0.5 - 16 : W - 24, n = Math.max(0, Math.min(Math.floor(c0), prot.length));
        c.strokeStyle = C.grid; c.beginPath(); c.moveTo(0, yP - 22); c.lineTo(W, yP - 22); c.stroke();
        kit.label(c, 'Protein so far: ' + n + (open ? '' : ' of ' + prot.length) + ' amino acids (N-terminus first)', 12, yP - 10, { size: 11, color: C.muted });
        const s = 15, cols = Math.max(1, Math.floor(pw / s)), rows = Math.max(1, Math.floor((Hh - yP - 26) / s)), cap = cols * rows;
        const skip = n > cap ? n - cap + 1 : 0;
        for (let q = 0; q < Math.min(n, cap); q++) {
          const idx = skip ? (q === 0 ? -1 : skip + q) : q, x = 12 + (q % cols) * s + s / 2, y = yP + 6 + Math.floor(q / cols) * s + s / 2;
          if (idx < 0) { kit.label(c, '…', x, y, { size: 11, align: 'center', color: C.muted }); continue; }
          kit.dot(c, x, y, s / 2 - 1, aaCol(kit, prot[idx]));
          kit.label(c, prot[idx], x, y, { size: 8.5, align: 'center', color: '#fff', weight: 700, font: MONO });
        }
        const lg = [['nonpolar', 'G A V L I M F W P'], ['polar', 'S T C Y N Q'], ['acidic', 'D E (−)'], ['basic', 'K R H (+)']];
        lg.forEach(([k, t2], j) => { const x = 12 + j * Math.min(120, pw / 4); c.fillStyle = kit.hue(CLASS_HUE[k]); c.fillRect(x, Hh - 13, 9, 9); kit.label(c, k, x + 13, Hh - 8.5, { size: 10, color: C.text2 || C.text }); });
        if (showT) {
          const cod = lead && Math.floor(c0) < ncod ? mrna.substr(start + 3 * Math.floor(c0), 3) : '';
          drawCodonTable(c, kit, B, W * 0.5 + 4, yP - 16, W * 0.5 - 12, Hh - yP + 10, cod);
        }
      }
      const loop = kit.loop(dt => {
        if (running) {
          const inProc = V.org === 'euk' && procEnd >= 0 && tau < procEnd;
          const tot = dt * V.speed * (inProc ? 60 : 1), nS = Math.max(1, Math.ceil(tot / 0.02)), h = tot / nS;
          for (let k = 0; k < nS; k++) step(h);
        }
        const lead = shown(), c0 = lead ? lead.c : 0, a = Math.floor(c0), euk = V.org === 'euk';
        ro.set('t', fmtT(tau));
        ro.set('mrna', Math.floor(ptx) + ' of ' + Ltx + ' nt' + (euk && ptx >= Ltx ? (procEnd >= 0 && tau < procEnd ? ' — being processed' : ' — in the cytoplasm') : ''));
        if (lead && a < ncod) {
          const cod = mrna.substr(start + 3 * a, 3), aa = B.CODE[cod.replace(/U/g, 'T')];
          ro.set('codon', 'codon ' + (a + 1) + ': ' + cod + ' → ' + (aa === '*' ? 'stop' : three(B, aa) + ' (' + B.AA[aa][0] + ')'));
        } else ro.set('codon', lead ? 'released' : '—');
        const n = Math.max(0, Math.min(a, prot.length));
        ro.set('prot', n + ' aa, ' + (n ? (B.mwProtein(prot.slice(0, n)) / 1000).toFixed(1) : '0.0') + ' kDa' + (open && n >= prot.length ? ' (the gene continues)' : ''));
        ro.set('ribo', ribos.filter(r => !r.done).length + ' / ' + finished);
        const ttx = Ltx / V.vtx, ttl = ncod / V.vtl;
        ro.set('exp', 'transcription ' + fmtT(ttx) + (euk ? ' + processing ' + PROC / 60 + ' min' : '') + ' + translation ' + fmtT(ttl) + (euk ? '' : ' (overlapping)'));
        ro.set('msg', running ? '' : 'Paused');
        draw();
      }, box.stage);
      loop.start();
    }
  });
  /* ================================================================ the mutation lab */
  Hyper.sim('molb-mutation', {
    title: 'Mutation lab',
    blurb: `The coding strand of a short gene, codon by codon, with the amino acid each codon specifies. Click a base (or use the position slider), choose a new base and substitute, insert or delete it; the original and the mutant protein are compared underneath and the change is classified and written in the standard notation (c. for the DNA, p. for the protein, counting the start methionine as 1). The random test makes many single-base substitutions at random places in the coding sequence and counts what they do.

**Try this**
- β-globin: change the A in codon 7 (GAG, position 20) to T. Glutamate becomes valine — the sickle-cell variant, traditionally called Glu6Val because the first methionine is removed from the finished protein.
- Change the third base of a few codons: most changes there are silent. Then change first or second bases.
- Delete one base near the start: every codon after it changes and a stop codon soon appears. Then delete two more bases next to it — the frame is restored and only one or two amino acids are lost.
- Run the random test several times: about a quarter of substitutions are silent, seven in ten missense and one in twenty-five nonsense — the proportions set by the genetic code (dashed marks).
- Take the trp leader peptide and change its stop codon TGA (positions 43–45) to TCA: the ribosome reads on. TGA → TAA is still a stop.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 330, maxH: 560 });
      const GENES = {
        hbb: { dna: HBB31, name: 'human β-globin (HBB), codons 1–31 — the gene continues' },
        trp: { dna: TRPL, name: 'E. coli trp leader peptide (MKAIFVLKGWWRTS)' },
        insb: { dna: 'ATG' + backTranslate(INS_B) + 'TAA', name: 'insulin B chain (30 aa), with a start and a stop codon added' }
      };
      let orig = '', mut = '', changed = [], sel = 19, last = null, edits = 0, stats = { n: 0, silent: 0, missense: 0, nonsense: 0, other: 0 }, R = B.rng(2024), cells = [], msg = '';
      const ctl = kit.controls(box.side, [
        { id: 'gene', type: 'select', label: 'Gene', options: [['Human β-globin (start)', 'hbb'], ['E. coli trp leader peptide', 'trp'], ['Insulin B chain', 'insb']], value: 'hbb' },
        { id: 'pos', label: 'Selected position', min: 1, max: 120, step: 1, value: 20 },
        { id: 'nb', type: 'select', label: 'New base', options: [['A', 'A'], ['C', 'C'], ['G', 'G'], ['T', 'T']], value: 'T' },
        { type: 'buttons', items: [{ id: 'sub', label: 'Substitute', primary: true }, { id: 'ins', label: 'Insert before' }, { id: 'del', label: 'Delete' }] },
        { type: 'buttons', items: [{ id: 'rand', label: 'Random substitution' }, { id: 'undo', label: 'Undo all' }, { id: 'test', label: 'Test 1000 at random' }] }
      ], (id) => {
        if (id === 'gene') { reset(); stats = { n: 0, silent: 0, missense: 0, nonsense: 0, other: 0 }; }
        else if (id === 'pos') sel = clamp(Math.round(V.pos) - 1, 0, mut.length - 1);
        else if (id === 'sub') edit('sub', sel, V.nb);
        else if (id === 'ins') edit('ins', sel, V.nb);
        else if (id === 'del') edit('del', sel);
        else if (id === 'rand') { const p = Math.floor(R() * codingEnd(mut)); const bs = 'ACGT'.replace(mut[p], ''); sel = p; ctl.set('pos', p + 1); edit('sub', p, bs[Math.floor(R() * 3)]); }
        else if (id === 'undo') reset();
        else if (id === 'test') randomTest(1000);
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['sel', 'Selected base'], ['chg', 'Last change (DNA)'], ['cod', 'Codon'], ['pch', 'Protein change'], ['eff', 'Effect'], ['len', 'Protein length'], ['stat', 'Random test']]);
      function reset() { orig = GENES[V.gene].dna; mut = orig; changed = new Array(mut.length).fill(false); last = null; edits = 0; msg = ''; sel = clamp(sel, 0, mut.length - 1); }
      function readProt(s) { let aa = ''; for (let i = 0; i + 3 <= s.length; i += 3) { const x = B.CODE[s.slice(i, i + 3)] || 'X'; if (x === '*') return { aa, stop: true }; aa += x; } return { aa, stop: false }; }
      const codingEnd = s => { const p = readProt(s); return Math.min(s.length, 3 * (p.aa.length + (p.stop ? 1 : 0))); };
      function edit(type, p, b) {
        p = clamp(p, 0, mut.length - 1);
        if (type === 'sub') {
          if (mut[p] === b) { msg = 'That base is already ' + b + ': pick another new base.'; return; }
          last = { type, p, from: mut[p], to: b, codon0: mut.substr(p - p % 3, 3) };
          mut = mut.slice(0, p) + b + mut.slice(p + 1); changed[p] = true;
          last.codon1 = mut.substr(p - p % 3, 3);
        } else if (type === 'ins') {
          if (mut.length >= 120) { msg = 'The sequence is long enough.'; return; }
          last = { type, p, to: b }; mut = mut.slice(0, p) + b + mut.slice(p); changed.splice(p, 0, true);
        } else {
          if (mut.length <= 3) { msg = 'Too short to delete more.'; return; }
          last = { type, p, from: mut[p] }; mut = mut.slice(0, p) + mut.slice(p + 1); changed.splice(p, 1);
          if (p < changed.length) changed[p] = true;
        }
        edits++; msg = ''; sel = clamp(sel, 0, mut.length - 1);
      }
      // what a set of changes does to the protein
      function classify(o, m) {
        const po = readProt(o), pm = readProt(m), dl = m.length - o.length;
        let i = 0; while (i < o.length && i < m.length && o[i] === m[i]) i++;
        if (i >= o.length && i >= m.length) return { cls: 'none', text: 'no change', p: '' };
        const end = codingEnd(o);
        if (i >= end) return { cls: 'utr', text: 'after the stop codon: protein unchanged', p: 'p.(=)' };
        let k = 0; while (k < po.aa.length && k < pm.aa.length && po.aa[k] === pm.aa[k]) k++;
        const a = po.aa[k], b = pm.aa[k];
        if (dl % 3 !== 0) {
          const ter = pm.stop ? 'Ter' + (pm.aa.length - k + 1) : '';
          return { cls: 'frameshift', p: 'p.' + (a ? three(B, a) + (k + 1) : '') + (b ? three(B, b) + 'fs' + ter : 'Ter'),
            text: 'frameshift from codon ' + (k + 1) + (pm.stop ? ': a new stop codon ' + (pm.aa.length - k + 1) + ' codons later' : ': no stop codon in the part shown') };
        }
        if (dl !== 0) return { cls: 'inframe', p: 'p.' + (a ? three(B, a) + (k + 1) : '') + (dl > 0 ? 'ins' : 'del'), text: 'in-frame ' + (dl > 0 ? 'insertion' : 'deletion') + ' of ' + Math.abs(dl) / 3 + ' codon' + (Math.abs(dl) > 3 ? 's' : '') + ': the frame is kept' };
        if (po.aa === pm.aa && po.stop === pm.stop) return { cls: 'silent', text: 'silent: the same amino acids', p: 'p.(=)' };
        if (i < 3 && po.aa[0] === 'M' && pm.aa[0] !== 'M') return { cls: 'start', text: 'start codon lost: translation cannot begin here', p: 'p.Met1?' };
        if (pm.stop && pm.aa.length < po.aa.length) return { cls: 'nonsense', text: 'nonsense: premature stop at codon ' + (pm.aa.length + 1) + ' (' + pm.aa.length + ' of ' + po.aa.length + ' aa made)', p: 'p.' + three(B, a) + (k + 1) + 'Ter' };
        if (po.stop && (!pm.stop || pm.aa.length > po.aa.length)) return { cls: 'stoploss', text: 'stop codon lost: the ribosome reads on', p: 'p.Ter' + (po.aa.length + 1) + (b ? three(B, b) : '') + 'ext' };
        const diffs = []; for (let q = 0; q < po.aa.length; q++) if (po.aa[q] !== pm.aa[q]) diffs.push(q);
        if (diffs.length === 1) {
          const cons = AA_CLASS[a] === AA_CLASS[b];
          return { cls: 'missense', p: 'p.' + three(B, a) + (k + 1) + three(B, b),
            text: 'missense: ' + B.AA[a][0] + ' → ' + B.AA[b][0] + (cons ? ' — conservative (both ' + AA_CLASS[a] + ')' : ' — non-conservative (' + AA_CLASS[a] + ' → ' + AA_CLASS[b] + ')') };
        }
        return { cls: 'multi', text: diffs.length + ' amino acids changed', p: diffs.length + ' changes' };
      }
      function randomTest(n) {
        const end = codingEnd(orig);
        for (let q = 0; q < n; q++) {
          const p = Math.floor(R() * end), bs = 'ACGT'.replace(orig[p], ''), b = bs[Math.floor(R() * 3)];
          const r = classify(orig, orig.slice(0, p) + b + orig.slice(p + 1)).cls;
          stats.n++;
          if (r === 'silent' || r === 'none') stats.silent++; else if (r === 'missense' || r === 'multi') stats.missense++; else if (r === 'nonsense') stats.nonsense++; else stats.other++;
        }
      }
      reset();
      function beads(c, C, prot, ref, x0, y, s, label, stop) {
        kit.label(c, label, x0, y - s * 0.9, { size: 11, color: C.muted });
        for (let q = 0; q < prot.length; q++) {
          const x = x0 + q * s + s / 2, diff = ref != null && ref[q] !== prot[q];
          kit.dot(c, x, y, s / 2 - 1, aaCol(kit, prot[q]), diff ? C.text : null);
          if (s >= 11) kit.label(c, prot[q], x, y, { size: Math.min(10, s * 0.6), align: 'center', color: '#fff', weight: 700, font: MONO });
        }
        const xe = x0 + prot.length * s + 4;
        if (stop) { c.fillStyle = C.bad; c.fillRect(xe, y - s / 2 + 2, s - 4, s - 4); kit.label(c, 'stop', xe + s, y, { size: 10, color: C.bad }); }
        else kit.label(c, '…', xe + 2, y, { size: 12, color: C.muted });
      }
      function draw() {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H;
        kit.label(c, GENES[V.gene].name + ' — coding strand 5′ → 3′; click a base', 12, 12, { size: 11, color: C.muted });
        const bw = 11, codW = 3 * bw + 7, perRow = Math.max(4, Math.floor((W - 24) / codW)), rowH = 42, y0 = 40;
        const po = readProt(orig), pm = readProt(mut), endM = codingEnd(mut);
        cells = [];
        const nCod = Math.ceil(mut.length / 3);
        for (let k = 0; k < nCod; k++) {
          const col = k % perRow, row = Math.floor(k / perRow), x = 12 + col * codW, y = y0 + row * rowH;
          const inCds = 3 * k < endM, cod = mut.substr(3 * k, 3), aa = cod.length === 3 ? B.CODE[cod] : null;
          c.fillStyle = inCds ? (aa === '*' ? kit.hue(0, 0.12) : C.grid) : 'rgba(128,128,128,0.05)'; c.fillRect(x, y - 10, codW - 5, 20);
          for (let j = 0; j < 3; j++) {
            const i = 3 * k + j; if (i >= mut.length) break;
            const bx = x + 2 + j * bw;
            cells.push({ i, x: bx, y: y - 10, w: bw, h: 20 });
            if (i === sel) { c.strokeStyle = C.accent; c.lineWidth = 2; c.strokeRect(bx - 0.5, y - 10.5, bw + 1, 21); }
            if (changed[i]) { c.fillStyle = C.warn; c.fillRect(bx + 1, y + 8, bw - 2, 2.5); }
            kit.label(c, mut[i], bx + bw / 2, y, { size: 12, align: 'center', color: baseCol(kit, mut[i]), weight: 700, font: MONO });
          }
          if (aa && inCds) kit.label(c, three(B, aa), x + (codW - 5) / 2, y + 19, { size: 10, align: 'center', color: aa === '*' ? C.bad : aaCol(kit, aa), weight: 600 });
          if ((k + 1) % 5 === 0 || k === 0) kit.label(c, String(k + 1), x + (codW - 5) / 2, y - 17, { size: 9, align: 'center', color: C.faint });
        }
        const rows = Math.ceil(nCod / perRow), yp = y0 + rows * rowH + 20;
        const L = Math.max(po.aa.length, pm.aa.length) + 2, s = clamp((W - 70) / L, 6, 18);
        beads(c, C, po.aa, null, 12, yp + 12, s, 'original protein', po.stop);
        beads(c, C, pm.aa, po.aa, 12, yp + 12 + 2.3 * s + 8, s, 'mutant protein', pm.stop);
        // random-test bars against the proportions of the whole genetic code
        const yb = yp + 12 + 4.6 * s + 30;
        if (stats.n && yb + 70 < Hh + 20) {
          const cats = [['silent', stats.silent, 0.244, kit.hue(140)], ['missense', stats.missense, 0.714, kit.hue(40)], ['nonsense', stats.nonsense, 0.042, C.bad], ['start/stop lost', stats.other, null, C.muted]];
          const bx0 = 110, bwid = W - bx0 - 70, bh = Math.min(13, (Hh - yb) / 5);
          kit.label(c, 'random substitutions in this gene (n = ' + stats.n + '); dashed: the whole genetic code', 12, yb - 12, { size: 11, color: C.muted });
          cats.forEach(([name, v, ref, col], j) => {
            const y = yb + j * (bh + 5), f = v / stats.n;
            kit.label(c, name, bx0 - 8, y + bh / 2, { size: 11, align: 'right', color: C.text2 || C.text });
            c.fillStyle = col; c.fillRect(bx0, y, bwid * f, bh);
            kit.label(c, (100 * f).toFixed(1) + ' %', bx0 + bwid * f + 5, y + bh / 2, { size: 10, color: C.text2 || C.text });
            if (ref != null) { c.strokeStyle = C.text; c.setLineDash([3, 2]); c.lineWidth = 1.2; c.beginPath(); c.moveTo(bx0 + bwid * ref, y - 2); c.lineTo(bx0 + bwid * ref, y + bh + 2); c.stroke(); c.setLineDash([]); }
          });
        }
      }
      kit.click(st, p => {
        const hit = cells.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h);
        if (hit) { sel = hit.i; ctl.set('pos', sel + 1); loop.once(); }
      }, p => cells.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      const loop = kit.loop(() => {
        sel = clamp(sel, 0, mut.length - 1);
        const k = Math.floor(sel / 3), cod = mut.substr(3 * k, 3), aa = cod.length === 3 ? B.CODE[cod] : null;
        ro.set('sel', 'position ' + (sel + 1) + ' (codon ' + (k + 1) + ', base ' + (sel % 3 + 1) + '): ' + mut[sel]);
        let dtext = '—';
        if (last) {
          const n = last.p + 1;
          dtext = last.type === 'sub' ? 'c.' + n + last.from + '>' + last.to + (last.from.match(/[AG]/) && last.to.match(/[AG]/) || last.from.match(/[CT]/) && last.to.match(/[CT]/) ? ' (transition)' : ' (transversion)')
            : last.type === 'ins' ? 'c.' + (n - 1) + '_' + n + 'ins' + last.to : 'c.' + n + 'del' + last.from;
          if (edits > 1) dtext += ' — ' + edits + ' edits in all';
        }
        ro.set('chg', msg || dtext);
        ro.set('cod', last && last.type === 'sub' ? last.codon0 + ' → ' + last.codon1 : cod + (aa ? ' = ' + three(B, aa) : ''));
        const r = classify(orig, mut), po = readProt(orig), pm = readProt(mut);
        ro.set('pch', r.p || '—');
        ro.set('eff', r.text);
        ro.set('len', po.aa.length + ' → ' + pm.aa.length + ' aa' + (!pm.stop ? ' (no stop codon in the part shown)' : ''));
        ro.set('stat', stats.n ? 'silent ' + (100 * stats.silent / stats.n).toFixed(0) + ' %, missense ' + (100 * stats.missense / stats.n).toFixed(0) + ' %, nonsense ' + (100 * stats.nonsense / stats.n).toFixed(1) + ' %' : 'not run yet');
        draw();
      }, box.stage);
      loop.start();
    }
  });
  /* ================================================================ the lac operon */
  Hyper.sim('molb-lac', {
    title: 'The lac operon: a genetic AND gate',
    blurb: `The lac operon of *E. coli* with its two switches. The **repressor** (red, four subunits) sits on the operator unless an inducer — allolactose made from lactose, or the laboratory look-alike IPTG — pulls it off. **CAP** (green) with cyclic AMP helps RNA polymerase onto the weak promoter, but only when glucose is scarce; glucose also blocks lactose uptake. The table shows the output for all four sugar combinations in the strain chosen, and the graph how the mRNA (fast) and β-galactosidase (slow, diluted by growth) follow the switches. In culture mode the bacteria grow on a mixture of glucose and lactose and you can watch diauxie. Levels come from a simple thermodynamic model with illustrative constants.

**Try this**
- Add lactose with no glucose: the repressor lets go, CAP is on, expression jumps about a thousandfold. Now add glucose as well: expression drops to a few per cent.
- Try the mutants: *lacI⁻* (no repressor) and *lacOᶜ* (operator the repressor cannot bind) are on without lactose; *lacIˢ* (repressor deaf to allolactose) never switches on; without CAP (*crp⁻*) the operon only whispers.
- Give IPTG instead of lactose: it induces too, and is not used up.
- Culture mode: growth on glucose first, then a pause while the lac enzymes are made, then growth on lactose — Monod's diauxic curve. Remove the glucose and the pause disappears.`,
    mount(box, kit) {
      const B = kit.bio;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Mode', options: [['Switch the sugars yourself', 'sw'], ['Grow a culture on glucose + lactose', 'cul']], value: 'sw' },
        { id: 'glu', type: 'check', label: 'Glucose in the medium', value: false },
        { id: 'lac', type: 'check', label: 'Lactose in the medium', value: false },
        { id: 'iptg', type: 'check', label: 'IPTG (gratuitous inducer)', value: false },
        { id: 'strain', type: 'select', label: 'Strain', options: [['wild type', 'wt'], ['lacI⁻ (no repressor)', 'I-'], ['lacIˢ (super-repressor)', 'Is'], ['lacOᶜ (operator mutant)', 'Oc'], ['crp⁻ (no CAP)', 'crp']], value: 'wt' },
        { id: 'G0', label: 'Glucose at the start', min: 0, max: 4, step: 0.1, value: 1, unit: 'mM' },
        { id: 'L0', label: 'Lactose at the start', min: 0, max: 4, step: 0.1, value: 1, unit: 'mM' },
        { id: 'speed', label: 'Playback speed', min: 0.25, max: 4, step: 0.05, value: 1, fmt: v => '×' + v.toFixed(2) },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => {
        if (id === 'mode' || id === 'restart' || id === 'G0' || id === 'L0') restart();
        else if (id === 'pause') running = !running;
        showControls();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['rep', 'Repressor on the operator'], ['cap', 'CAP–cAMP on its site'], ['x', 'lacZYA transcription'], ['m', 'lac mRNA'], ['e', 'β-galactosidase'], ['t', 'Time'], ['od', 'Cells (OD₆₀₀)'], ['sug', 'Glucose / lactose left'], ['mu', 'Growth rate']]);
      const plot = kit.plot(gb, { x: { label: 'time (min)', min: 0 }, y: { label: 'per cent of the fully induced level', log: true, min: 0.01, max: 100 } }, 170);
      function showControls() {
        const cul = V.mode === 'cul';
        ctl.show('glu', !cul); ctl.show('lac', !cul); ctl.show('G0', cul); ctl.show('L0', cul);
        for (const k of ['t', 'od', 'sug', 'mu']) ro.show(k, cul);
      }
      // the model: inducer inside the cell -> active repressor -> free operator; glucose -> cAMP -> CAP; output = operator free × promoter
      function lac(G, L, iptg, strain) {
        const excl = 1 - 0.7 * G / (G + 0.05);                              // inducer exclusion by glucose uptake
        const I = (L / (L + 0.05)) * excl + (iptg ? 1 : 0);
        const rAct = strain === 'I-' ? 0 : strain === 'Is' ? 1 : 1 / (1 + Math.pow(I / 0.01, 2));
        const free = strain === 'Oc' ? 1 : 1 / (1 + 1000 * rAct);
        const cap = strain === 'crp' ? 0 : 1 - 0.95 * G / (G + 0.05);       // cAMP is high when glucose is scarce
        return { rAct, free, cap, X: free * (0.04 + 0.96 * cap) };
      }
      let running = true, t, E, M, hist, N, G, L, gDone, polys, R = B.rng(4);
      function restart() {
        t = 0; hist = []; polys = []; gDone = null;
        N = 0.02; G = V.G0; L = V.L0;
        const s0 = V.mode === 'cul' ? lac(G, L, V.iptg, V.strain) : lac(V.glu ? 5 : 0, V.lac ? 5 : 0, V.iptg, V.strain);
        E = s0.X; M = s0.X;
      }
      restart(); showControls();
      function state() { return V.mode === 'cul' ? lac(G, L, V.iptg, V.strain) : lac(V.glu ? 5 : 0, V.lac ? 5 : 0, V.iptg, V.strain); }
      function step(h) {            // h in minutes
        const s = state();
        if (V.mode === 'cul') {
          const muG = 0.9 / 60 * G / (G + 0.05), muL = 0.65 / 60 * E * (L / (L + 0.05)) * (1 - 0.7 * G / (G + 0.05)), mu = muG + muL;
          N *= Math.exp(mu * h);
          G = Math.max(0, G - muG * N / 0.2 * h); L = Math.max(0, L - muL * N / 0.4 * h);
          if (G < 0.005 && gDone == null && V.G0 > 0) gDone = t;
          E += (s.X - E) * (1 - Math.exp(-(mu + 1.2 / 60) * h));          // synthesis and dilution by growth
        } else E += (s.X - E) * (1 - Math.exp(-Math.LN2 / 30 * h));      // enzyme: diluted by growth (doubling about 30 min)
        M += (s.X - M) * (1 - Math.exp(-Math.LN2 / 2 * h));                 // mRNA half-life about 2 min
        t += h;
      }
      function drawMol(c, kit, C, s, dt) {
        const W = st.W, Hh = st.H, yD = Hh * 0.5, X = f => W * f;
        // the cell membrane and what is in the medium
        c.strokeStyle = C.muted; c.lineWidth = 2; c.setLineDash([6, 4]); c.beginPath(); c.moveTo(0, Hh * 0.2); c.lineTo(W, Hh * 0.2); c.stroke(); c.setLineDash([]);
        kit.label(c, 'medium', 10, 12, { size: 11, color: C.muted }); kit.label(c, 'cell', 10, Hh * 0.2 + 12, { size: 11, color: C.muted });
        const gPres = V.mode === 'cul' ? G > 0.02 : V.glu, lPres = V.mode === 'cul' ? L > 0.02 : V.lac;
        const hex = (x, y, r, col) => { c.fillStyle = col; c.beginPath(); for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3; c[k ? 'lineTo' : 'moveTo'](x + r * Math.cos(a), y + r * Math.sin(a)); } c.closePath(); c.fill(); };
        for (let k = 0; k < 7; k++) {
          const x = 90 + k * (W - 140) / 7;
          if (gPres) hex(x, Hh * 0.09, 6, kit.hue(45));
          if (lPres) { hex(x + 30, Hh * 0.13, 5, kit.hue(200)); hex(x + 39, Hh * 0.13, 5, kit.hue(48)); }
          if (V.iptg && k % 2 === 0) { c.fillStyle = C.muted; c.fillRect(x + 50, Hh * 0.07, 6, 6); }
        }
        kit.label(c, (gPres ? 'glucose ' : '') + (lPres ? 'lactose ' : '') + (V.iptg ? 'IPTG' : '') || '—', W - 10, 12, { size: 11, align: 'right', color: C.muted });
        // the DNA
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X(0.02), yD); c.lineTo(X(0.98), yD); c.stroke();
        const boxes = [[0.04, 0.14, 'lacI', 300], [0.2, 0.25, 'CAP site', 140], [0.25, 0.3, 'promoter', 0], [0.3, 0.345, 'operator', 0], [0.35, 0.63, 'lacZ', 270], [0.635, 0.8, 'lacY', 250], [0.805, 0.93, 'lacA', 230]];
        for (const [a, b, name, hu] of boxes) {
          c.fillStyle = name === 'promoter' || name === 'operator' || name === 'CAP site' ? C.grid : kit.hue(hu, 0.35);
          c.fillRect(X(a), yD - 8, X(b) - X(a) - 2, 16);
          kit.label(c, name, (X(a) + X(b)) / 2, yD + 20, { size: 10.5, align: 'center', color: C.text2 || C.text, weight: name.startsWith('lac') ? 700 : 500 });
        }
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(0.275), yD - 8); c.lineTo(X(0.275), yD - 18); c.lineTo(X(0.305), yD - 18); c.stroke();
        kit.arrow(c, X(0.295), yD - 18, X(0.31), yD - 18, C.text, 1.5);
        // the repressor: on the operator, or floating with inducer bound
        const bound = V.strain !== 'Oc' && s.free < 0.5;
        const rx = bound ? X(0.3225) : X(0.36) + 10 * Math.sin(t * 0.05), ry = bound ? yD - 16 : Hh * 0.3;
        if (V.strain !== 'I-') {
          for (const [dx, dy] of [[-5, -5], [5, -5], [-5, 5], [5, 5]]) kit.dot(c, rx + dx, ry + dy, 5.5, kit.hue(0, 0.85));
          if (!bound) { kit.dot(c, rx + 13, ry - 6, 3, V.iptg ? C.muted : kit.hue(200)); kit.label(c, 'repressor + inducer', rx + 20, ry, { size: 10, color: kit.hue(0) }); }
          else kit.label(c, 'repressor', rx, ry - 17, { size: 10, align: 'center', color: kit.hue(0) });
        } else kit.label(c, 'no working repressor', X(0.09), Hh * 0.3, { size: 10, align: 'center', color: kit.hue(0) });
        // CAP with cAMP
        if (V.strain !== 'crp') {
          const on = s.cap > 0.5, cx = on ? X(0.225) : X(0.2), cy = on ? yD - 16 : Hh * 0.33;
          c.fillStyle = kit.hue(140, 0.8); c.beginPath(); c.ellipse(cx - 5, cy, 6, 8, 0, 0, 6.283); c.ellipse(cx + 5, cy, 6, 8, 0, 0, 6.283); c.fill();
          if (on) { kit.dot(c, cx - 5, cy - 11, 2.5, kit.hue(60)); kit.dot(c, cx + 5, cy - 11, 2.5, kit.hue(60)); }
          kit.label(c, on ? 'CAP–cAMP' : 'CAP (little cAMP)', cx, on ? cy - 22 : cy - 16, { size: 10, align: 'center', color: kit.hue(140) });
        }
        // RNA polymerases firing from the promoter, at a rate set by the output
        if (running && Math.random() < s.X * dt * 4) polys.push({ x: 0.3 });
        for (const p of polys) {
          if (running) p.x += dt * 0.09;
          const px = X(p.x);
          c.strokeStyle = kit.hue(212); c.lineWidth = 1.5; c.beginPath();
          for (let x = X(0.3); x <= px; x += 4) c.lineTo(x, yD + 36 + 3 * Math.sin(x * 0.4));
          c.stroke();
          c.fillStyle = kit.hue(140, 0.5); c.beginPath(); c.ellipse(px, yD, 9, 12, 0, 0, 6.283); c.fill();
        }
        polys = polys.filter(p => p.x < 0.93);
        // β-galactosidase in the cell (one symbol for about 3 % of the fully induced amount), left of the truth table
        const tx = Math.max(10, W - 196), ty = Hh * 0.72, rowsT = [[1, 0], [1, 1], [0, 0], [0, 1]];
        const nE = Math.round(clamp(E, 0, 1) * 32), ex0 = X(0.04), perRow = Math.max(4, Math.floor((tx - ex0 - 14) / 16));
        for (let k = 0; k < nE; k++) { const x = ex0 + (k % perRow) * 16, y = ty + 2 + Math.floor(k / perRow) * 15; c.fillStyle = kit.hue(270, 0.8); c.fillRect(x, y, 5, 5); c.fillRect(x + 6, y, 5, 5); c.fillRect(x, y + 6, 5, 5); c.fillRect(x + 6, y + 6, 5, 5); }
        kit.label(c, 'β-galactosidase in the cell', ex0, ty - 4, { size: 10, color: kit.hue(270) });
        // the truth table for this strain
        kit.label(c, 'glucose  lactose   output', tx, ty - 4, { size: 10, color: C.muted, font: MONO });
        rowsT.forEach(([g, l], j) => {
          const o = lac(g ? 5 : 0, l ? 5 : 0, V.iptg, V.strain).X, y = ty + 12 + j * 15, cur = V.mode === 'sw' && !!V.glu === !!g && !!V.lac === !!l;
          if (cur) { c.fillStyle = kit.hue(212, 0.15); c.fillRect(tx - 4, y - 7, 175, 14); }
          kit.label(c, (g ? '  +' : '  −') + '       ' + (l ? '+' : '−'), tx, y, { size: 10.5, color: C.text, font: MONO });
          c.fillStyle = kit.hue(212); c.fillRect(tx + 100, y - 4, Math.max(1, 60 * (Math.log10(Math.max(o, 1e-4)) + 4) / 4), 8);
          kit.label(c, (100 * o).toFixed(o < 0.01 ? 2 : 0) + ' %', tx + 166, y, { size: 10, color: C.text2 || C.text });
        });
      }
      const loop = kit.loop(dt => {
        const cul = V.mode === 'cul';
        if (running) {
          const mins = dt * V.speed * (cul ? 20 : 5), n = Math.max(1, Math.ceil(mins / 0.25)), h = mins / n;   // switches: 5 min per second; culture: 20
          for (let k = 0; k < n; k++) step(h);
          if (!hist.length || t - hist[hist.length - 1][0] >= (cul ? 2 : 0.5)) hist.push([t, cul ? N : M, E, G, L]);
          if (!cul && t > 240) { hist = hist.filter(p => p[0] > t - 240); }
          if (cul && t > 12 * 60) running = false;
        }
        const s = state(), C = kit.colors(), c = st.begin();
        drawMol(c, kit, C, s, dt);
        ro.set('rep', V.strain === 'I-' ? 'no repressor' : V.strain === 'Oc' ? 'cannot bind (operator mutant)' : (100 * (1 - s.free)).toFixed(1) + ' % of the time');
        ro.set('cap', V.strain === 'crp' ? 'no CAP' : (100 * s.cap).toFixed(0) + ' %');
        ro.set('x', (100 * s.X).toFixed(s.X < 0.01 ? 2 : 1) + ' % of maximum');
        ro.set('m', (100 * M).toFixed(M < 0.01 ? 2 : 1) + ' %');
        ro.set('e', (100 * E).toFixed(E < 0.01 ? 2 : 1) + ' % of fully induced');
        if (cul) {
          const mu = 0.9 * G / (G + 0.05) + 0.65 * E * (L / (L + 0.05)) * (1 - 0.7 * G / (G + 0.05));
          ro.set('t', (t / 60).toFixed(2) + ' h');
          ro.set('od', N.toFixed(3));
          ro.set('sug', G.toFixed(2) + ' mM / ' + L.toFixed(2) + ' mM');
          ro.set('mu', mu.toFixed(2) + ' per hour' + (mu > 0.01 ? ' (doubling ' + (60 * Math.LN2 / mu).toFixed(0) + ' min)' : ''));
          const pts = k => hist.map(p => [p[0] / 60, Math.max(0.01, p[k])]);
          plot.set({ x: { label: 'time (h)', min: 0, max: Math.max(6, t / 60) }, y: { label: 'OD₆₀₀ and fractions', log: true, min: 0.01, max: 2 },
            series: [{ pts: pts(1), label: 'cells (OD₆₀₀)', width: 2.6 }, { pts: pts(2), label: 'β-galactosidase (fraction of full)', dash: [5, 3] },
              { pts: hist.map(p => [p[0] / 60, Math.max(0.01, V.G0 > 0 ? p[3] / V.G0 : 0.01)]), label: 'glucose left (fraction)' }, { pts: hist.map(p => [p[0] / 60, Math.max(0.01, V.L0 > 0 ? p[4] / V.L0 : 0.01)]), label: 'lactose left (fraction)' }],
            vlines: gDone != null ? [{ x: gDone / 60, label: 'glucose used up' }] : [] });
        } else {
          const t0 = Math.max(0, t - 240);
          plot.set({ x: { label: 'time (min)', min: t0, max: Math.max(t0 + 60, t) }, y: { label: 'per cent of fully induced', log: true, min: 0.01, max: 100 },
            series: [{ pts: hist.map(p => [p[0], Math.max(0.01, 100 * p[1])]), label: 'lac mRNA' }, { pts: hist.map(p => [p[0], Math.max(0.01, 100 * p[2])]), label: 'β-galactosidase', dash: [5, 3] }], vlines: [] });
        }
      }, box.stage);
      loop.start();
    }
  });
  /* ================================================================ a phage and its hosts */
  Hyper.sim('molb-phage', {
    title: 'Lytic or lysogenic: a phage and its hosts',
    blurb: `A culture of bacteria meets a bacteriophage. The diagram is the life cycle: a phage attaches and injects its DNA; then either the **lytic** path — copy the DNA, build new phages, burst the cell after the latent period — or, for a temperate phage, the **lysogenic** path — integrate as a prophage and be copied quietly each time the cell divides. The thickness of each arrow shows how much traffic takes it right now. The graph follows the populations (per millilitre, log scale). In this model, as for phage λ, the chance of lysogeny rises when phages outnumber bacteria; lysogens are immune to further infection, and DNA damage induces their prophages. Typical numbers: T4 bursts after about 25 minutes with 100–200 phages; λ after about 45 minutes with about 100.

**Try this**
- A virulent phage: phages multiply about a hundredfold every latent period until the bacteria collapse. (In a real flask, rare resistant mutants would then take over.)
- A temperate phage: early infections are mostly lytic, but as phages come to outnumber bacteria more cells choose lysogeny, and the immune lysogens grow to fill the culture — why λ plaques are cloudy.
- Press *DNA damage*: the prophages are induced, the lysogens burst, and a wave of new phages follows.
- Change the burst size and the latent period: which speeds the spread of the phage more?`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 270 });
      const gb = document.createElement('div'); gb.style.padding = '4px 10px 10px'; box.stage.appendChild(gb);
      const MU = Math.LN2 / 30, K = 1e9, KADS = 2e-9, IND = 1e-4 * Math.LN2 / 30, DECAY = 2e-4;   // per minute; per mL
      const ctl = kit.controls(box.side, [
        { id: 'type', type: 'select', label: 'Phage', options: [['Temperate (like λ): lytic or lysogenic', 'temp'], ['Virulent (like T4): always lytic', 'vir']], value: 'temp' },
        { id: 'b', label: 'Burst size', min: 10, max: 300, step: 10, value: 100, unit: 'phages' },
        { id: 'tau', label: 'Latent period', min: 15, max: 90, step: 1, value: 40, unit: 'min' },
        { id: 'moi0', label: 'Phages per bacterium at the start', min: 0.001, max: 10, value: 0.01, log: true, sig: 2 },
        { id: 'speed', label: 'Playback speed', min: 0.25, max: 5, step: 0.05, value: 1, fmt: v => '×' + v.toFixed(2) },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }, { id: 'uv', label: 'DNA damage (UV)' }, { id: 'pause', label: 'Pause / run' }] }
      ], (id) => {
        if (id === 'restart' || id === 'type' || id === 'moi0') restart();
        else if (id === 'uv') { const n = 0.9 * Lg; if (n > 0) { coh.push({ age: 0, n }); Lg -= n; flash = 1.5; } }
        else if (id === 'pause') running = !running;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['S', 'Uninfected bacteria (per mL)'], ['L', 'Lysogens (per mL)'], ['I', 'Infected, lytic (per mL)'], ['P', 'Free phages (per mL)'], ['moi', 'Phages landing on each cell per 10 min'], ['pl', 'Chance of lysogeny now']]);
      const plot = kit.plot(gb, { x: { label: 'time (h)', min: 0 }, y: { label: 'per mL', log: true, min: 1, max: 1e12 } }, 180);
      let S, Lg, P, coh, t, hist, running = true, fl, flash = 0, anim = 0;
      function restart() { S = 1e6; Lg = 0; P = 1e6 * V.moi0; coh = []; t = 0; hist = []; fl = { inf: 0, lyt: 0, lys: 0, burst: 0, ind: 0, div: 0 }; running = true; }
      restart();
      const isum = () => coh.reduce((a, q) => a + q.n, 0);
      // co-infection: the phages that land on one cell within about ten minutes; more of them favour lysogeny (as for λ)
      const coinf = () => KADS * P * 10;
      const plys = () => { const m = coinf(); return V.type === 'temp' ? 0.02 + 0.78 * m * m / (4 + m * m) : 0; };
      function step(h) {
        const I = isum(), Bt = S + Lg + I, g = Math.max(0, MU * (1 - Bt / K));
        const inf = S * (1 - Math.exp(-KADS * P * h)), pl = plys();
        S = Math.max(0, S * Math.exp(g * h) - inf);
        const born = Lg * (Math.exp(g * h) - 1);
        Lg = Lg * Math.exp(g * h) + pl * inf;
        const ind = Lg * (1 - Math.exp(-IND * h)); Lg -= ind;
        P -= P * (1 - Math.exp(-KADS * Bt * h));                   // phages lost by sticking to any cell
        let burst = 0;
        for (const q of coh) q.age += h;
        coh = coh.filter(q => { if (q.age >= V.tau) { burst += q.n; return false; } return q.n > 1e-9; });
        const lyt = (1 - pl) * inf + ind;
        if (lyt > 0) coh.push({ age: 0, n: lyt });
        P = (P + V.b * burst) * Math.exp(-DECAY * h);
        if (S < 1e-3) S = 0; if (Lg < 1e-3) Lg = 0; if (P < 1e-3) P = 0;
        const a = Math.min(1, h / 5), mix = (k, v) => { fl[k] += (v / h - fl[k]) * a; };
        mix('inf', inf); mix('lyt', (1 - pl) * inf); mix('lys', pl * inf); mix('burst', burst); mix('ind', ind); mix('div', born);
        t += h;
      }
      // drawing helpers
      const phage = (c, x, y, s, col) => {
        c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 1.3; c.beginPath();
        for (let k = 0; k < 6; k++) { const a = k * Math.PI / 3 + Math.PI / 6; c[k ? 'lineTo' : 'moveTo'](x + s * Math.cos(a), y - s + s * Math.sin(a)); }
        c.closePath(); c.fill();
        c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 1.6 * s); c.moveTo(x - s, y + 2.3 * s); c.lineTo(x, y + 1.6 * s); c.lineTo(x + s, y + 2.3 * s); c.stroke();
      };
      const bact = (c, C, x, y, w, h, pro, burst) => {
        c.fillStyle = kit.hue(30, 0.22); c.strokeStyle = kit.hue(30, 0.9); c.lineWidth = 1.5;
        c.setLineDash(burst ? [4, 3] : []);
        c.beginPath(); if (c.roundRect) c.roundRect(x - w / 2, y - h / 2, w, h, h / 2); else c.rect(x - w / 2, y - h / 2, w, h); c.fill(); c.stroke();
        c.setLineDash([]);
        c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.ellipse(x, y, w * 0.28, h * 0.25, 0, 0, 6.283); c.stroke();
        if (pro) { c.strokeStyle = kit.hue(300); c.lineWidth = 3; c.beginPath(); c.ellipse(x, y, w * 0.28, h * 0.25, 0, -0.7, 0.3); c.stroke(); }
      };
      const width = f => 1 + 5 * clamp(Math.log10(1 + f) / 9, 0, 1);
      function path(c, pts, f, col, label, lpos) {
        const w = width(f);
        c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath();
        pts.forEach((p, i) => c[i ? 'lineTo' : 'moveTo'](p[0], p[1])); c.stroke();
        const n = pts.length; kit.arrow(c, pts[n - 2][0], pts[n - 2][1], pts[n - 1][0], pts[n - 1][1], col, w);
        // traffic: dots moving along the path, more when the flux is larger
        if (f > 1e-6) {
          let L = 0; const seg = []; for (let i = 1; i < n; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(l); L += l; }
          const nd = Math.max(1, Math.round(w));
          for (let k = 0; k < nd; k++) {
            let s = ((anim * 60 + k * L / nd) % L), i = 0; while (i < seg.length - 1 && s > seg[i]) { s -= seg[i]; i++; }
            const u = seg[i] > 0 ? s / seg[i] : 0;
            kit.dot(c, pts[i][0] + (pts[i + 1][0] - pts[i][0]) * u, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * u, 2.2, C_.text);
          }
        }
        if (label) kit.label(c, label, lpos[0], lpos[1], { size: 10.5, align: 'center', color: col });
      }
      let C_ = kit.colors();
      function draw(dt) {
        const c = st.begin(), C = kit.colors(), W = st.W, Hh = st.H, X = f => W * f, Y = f => Hh * f;
        C_ = C; anim += dt;
        const lyt = kit.hue(10), lys = kit.hue(300), neu = C.muted, pl = plys();
        // arrows first
        path(c, [[X(0.14), Y(0.5)], [X(0.23), Y(0.5)]], fl.inf, neu);
        path(c, [[X(0.33), Y(0.5)], [X(0.4), Y(0.5)]], fl.inf, neu);
        path(c, [[X(0.46), Y(0.43)], [X(0.52), Y(0.25)], [X(0.55), Y(0.25)]], fl.lyt, lyt, 'lytic', [X(0.45), Y(0.3)]);
        path(c, [[X(0.66), Y(0.25)], [X(0.75), Y(0.25)]], fl.lyt + fl.ind, lyt);
        path(c, [[X(0.84), Y(0.17)], [X(0.84), Y(0.06)], [X(0.1), Y(0.06)], [X(0.1), Y(0.38)]], fl.burst, lyt, 'phages released', [X(0.47), Y(0.06) - 8]);
        if (V.type === 'temp') {
          path(c, [[X(0.46), Y(0.57)], [X(0.52), Y(0.76)], [X(0.55), Y(0.76)]], fl.lys, lys, 'lysogenic', [X(0.44), Y(0.72)]);
          path(c, [[X(0.66), Y(0.76)], [X(0.75), Y(0.76)]], fl.div, lys);
          path(c, [[X(0.84), Y(0.66)], [X(0.66), Y(0.36)]], fl.ind, lys, 'induction', [X(0.8), Y(0.5)]);
        }
        // nodes
        phage(c, X(0.1), Y(0.47), 7, C.text);
        kit.label(c, 'free phages', X(0.1), Y(0.62), { size: 11, align: 'center', color: C.text, weight: 600 });
        kit.label(c, sci(P), X(0.1), Y(0.62) + 14, { size: 11, align: 'center', color: C.muted });
        bact(c, C, X(0.28), Y(0.5), 60, 28, false, false); phage(c, X(0.28), Y(0.5) - 30, 5, C.text);
        kit.label(c, 'attach, inject DNA', X(0.28), Y(0.5) + 26, { size: 10.5, align: 'center', color: C.text2 || C.text });
        c.fillStyle = C.surface || C.bg2; c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(0.43), Y(0.5) - 14); c.lineTo(X(0.43) + 16, Y(0.5)); c.lineTo(X(0.43), Y(0.5) + 14); c.lineTo(X(0.43) - 16, Y(0.5)); c.closePath(); c.fill(); c.stroke();
        kit.label(c, '?', X(0.43), Y(0.5), { size: 12, align: 'center', color: C.text, weight: 700 });
        kit.label(c, 'lysogeny ' + (100 * pl).toFixed(0) + ' %', X(0.43), Y(0.5) + 26, { size: 10.5, align: 'center', color: lys });
        bact(c, C, X(0.605), Y(0.25), 64, 30, false, false);
        for (let k = 0; k < 4; k++) phage(c, X(0.605) - 21 + k * 14, Y(0.25) - 2, 3, lyt);
        kit.label(c, 'copy DNA, build phages', X(0.605), Y(0.25) + 26, { size: 10.5, align: 'center', color: C.text2 || C.text });
        kit.label(c, sci(isum()) + ' infected cells', X(0.605), Y(0.25) + 40, { size: 10.5, align: 'center', color: C.muted });
        bact(c, C, X(0.84), Y(0.25), 60, 28, false, true);
        for (let k = 0; k < 6; k++) { const a = k * 1.05 + anim; phage(c, X(0.84) + 34 * Math.cos(a), Y(0.25) + 18 * Math.sin(a), 3, lyt); }
        const wide = W >= 600;
        kit.label(c, 'lysis: ' + V.b + ' phages' + (wide ? ' after ' + V.tau + ' min' : ''), X(0.84), Y(0.25) + 34, { size: 10.5, align: 'center', color: C.text2 || C.text });
        if (V.type === 'temp') {
          bact(c, C, X(0.605), Y(0.76), 64, 30, true, false);
          kit.label(c, wide ? 'integrate: prophage' : 'prophage', X(0.605), Y(0.76) + 26, { size: 10.5, align: 'center', color: C.text2 || C.text });
          bact(c, C, X(0.84) - 18, Y(0.76), 40, 24, true, false); bact(c, C, X(0.84) + 26, Y(0.76), 40, 24, true, false);
          kit.label(c, (wide ? 'lysogens divide: ' : 'lysogens: ') + sci(Lg), X(0.84), Y(0.76) + 26, { size: 10.5, align: 'center', color: C.text2 || C.text });
        } else kit.label(c, wide ? 'a virulent phage cannot integrate: every infection is lytic' : 'virulent: always lytic', X(0.7), Y(0.76), { size: 11, align: 'center', color: C.muted });
        if (flash > 0) { kit.label(c, 'DNA damage: prophages induced', W / 2, Hh - 12, { size: 12, align: 'center', color: C.warn, weight: 700 }); flash -= dt; }
      }
      const loop = kit.loop(dt => {
        if (running) {
          const mins = dt * V.speed * 20, n = Math.max(1, Math.ceil(mins / 0.25)), h = mins / n;
          for (let k = 0; k < n; k++) step(h);
          if (!hist.length || t - hist[hist.length - 1][0] >= 2) hist.push([t, S, Lg, isum(), P]);
          if (t > 16 * 60) running = false;
        }
        draw(running ? dt : 0);
        const hh = Math.floor(t / 60), mm = Math.floor(t % 60);
        ro.set('t', hh + ' h ' + (mm < 10 ? '0' : '') + mm + ' min');
        ro.set('S', sci(S)); ro.set('L', sci(Lg)); ro.set('I', sci(isum())); ro.set('P', sci(P));
        const m = coinf();
        ro.set('moi', m < 0.01 ? '< 0.01' : m < 100 ? m.toPrecision(2) : sci(m));
        ro.set('pl', V.type === 'temp' ? (100 * plys()).toFixed(0) + ' %' : '0 % (virulent)');
        const col = k => hist.map(p => [p[0] / 60, Math.max(1, p[k])]);
        plot.set({ x: { label: 'time (h)', min: 0, max: Math.max(4, t / 60) }, y: { label: 'per mL', log: true, min: 1, max: 1e12 },
          series: [{ pts: col(1), label: 'uninfected bacteria', color: kit.hue(30) }, { pts: col(2), label: 'lysogens', color: kit.hue(300) }, { pts: col(3), label: 'infected (lytic)', color: kit.hue(10), dash: [4, 3] }, { pts: col(4), label: 'free phages', color: C_.text }] });
      }, box.stage);
      loop.start();
    }
  });
})();
