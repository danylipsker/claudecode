/* HYPER-CORE · ui/biotools.js
 *
 * The Tools pages of Hyper Biology.
 *
 *   #/tools/sequence/<analyse|translate|digest|primers>
 *                     a DNA workbench: composition, GC along the sequence, reverse complement; the six
 *                     reading frames, open reading frames and the genetic code; a restriction digest with
 *                     its map and a virtual gel; primers checked against the template, and PCR growth
 *   #/tools/genetics/<cross|hardy|drift|linkage|chi>
 *                     crosses and Punnett squares, Hardy–Weinberg, genetic drift, linkage mapping, χ²
 *   #/tools/cell/<explorer|growth|enzyme|populations|ecology|scale>
 *                     a cell explorer (animal, plant, bacterium), microbial growth and plate counts,
 *                     enzyme kinetics with inhibitors, predator–prey and competition, diversity indices
 *                     and mark–recapture, size and metabolic scaling
 *
 * The science is HYPER-CORE/js/bio.js (tested by tools/test-bio.js). The demo DNA is made up.
 */
(function () {
  'use strict';
  const H = window.Hyper;
  const ui = H.ui, U = H.util, esc = U.esc, B = () => H.bio;
  const n3 = (x, d) => Number.isFinite(x) ? U.fmt(x, d || 4) : '—';
  const f1 = (x, d) => Number.isFinite(x) ? x.toFixed(d == null ? 1 : d) : '—';
  const pc = (x, d) => Number.isFinite(x) ? (100 * x).toFixed(d == null ? 1 : d) + ' %' : '—';
  const font = () => getComputedStyle(document.body).fontFamily;

  /* ---------------------------------------------------------------- form, layout, plots */
  // fields: [id, label, value, kind, extra]; kind 'q' (extra = [quantity, unit]: value read in the quantity's base unit),
  // 'n' (a plain number, extra = unit label), 't' (text), 'sel' (extra = [[value, text], …]), 'check', 'sep'
  function form(el, fields, onChange) {
    el.innerHTML = fields.map(([id, label, value, kind, extra]) => {
      if (kind === 'sep') return '<div class="msep">' + esc(label) + '</div>';
      if (kind === 'check') return '<label class="mfield mcheck"><input type="checkbox" data-f="' + id + '"' + (value ? ' checked' : '') + '><span>' + esc(label) + '</span></label>';
      if (kind === 'sel') return '<label class="mfield"><span>' + esc(label) + '</span><select class="inp" data-f="' + id + '">' + extra.map(([v, t]) => '<option value="' + esc(String(v)) + '"' + (String(v) === String(value) ? ' selected' : '') + '>' + esc(t) + '</option>').join('') + '</select></label>';
      if (kind === 't') return '<label class="mfield"><span>' + esc(label) + '</span><input class="inp" spellcheck="false" data-f="' + id + '" value="' + esc(String(value)) + '"' + (extra ? ' style="font-family:var(--font-mono)"' : '') + '></label>';
      const q = kind === 'q' ? H.units.Q[extra[0]] : null;
      const unit = q ? '<select class="munit" data-u="' + id + '">' + q.units.map(u => '<option' + (u[0] === extra[1] ? ' selected' : '') + '>' + esc(u[0]) + '</option>').join('') + '</select>' : (extra ? '<i>' + esc(extra) + '</i>' : '');
      return '<label class="mfield"><span>' + esc(label) + '</span><span class="minp"><input class="inp" inputmode="decimal" data-f="' + id + '" value="' + esc(String(value)) + '">' + unit + '</span></label>';
    }).join('');
    const defs = Object.fromEntries(fields.map(f => [f[0], f]));
    const read = () => {
      const v = {};
      el.querySelectorAll('[data-f]').forEach(inp => {
        const id = inp.dataset.f, d = defs[id];
        if (d[3] === 'sel' || d[3] === 't') { v[id] = inp.value; return; }
        if (d[3] === 'check') { v[id] = inp.checked; return; }
        let x = NaN;
        try { x = H.expr.evaluate(H.expr.parse(U.cleanNum(inp.value) || 'nan'), {}); } catch (e) { x = NaN; }
        inp.classList.toggle('bad', !Number.isFinite(x));
        if (d[3] === 'q') x = H.units.toSI(x, d[4][0], el.querySelector('[data-u="' + id + '"]').value);
        v[id] = x;
      });
      return v;
    };
    el.querySelectorAll('[data-u]').forEach(sel => {
      let prev = sel.value;
      sel.addEventListener('change', () => {
        const id = sel.dataset.u, q = defs[id][4][0], inp = el.querySelector('[data-f="' + id + '"]');
        const x = parseFloat(U.cleanNum(inp.value));
        if (Number.isFinite(x)) inp.value = String(Number(H.units.convert(x, q, prev, sel.value).toPrecision(5)));
        prev = sel.value;
        onChange(read());
      });
    });
    el.addEventListener('input', () => onChange(read()));
    el.addEventListener('change', e => { if (!e.target.dataset.u) onChange(read()); });
    return read;
  }
  const stat = (label, value, sub, cls) => '<div class="mstat' + (cls ? ' ' + cls : '') + '"><span>' + esc(label) + '</span><b>' + value + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</div>';
  function layout(el, intro) {
    el.innerHTML = (intro ? '<p class="muted" style="margin:0 0 12px">' + intro + '</p>' : '') +
      '<div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mplot"></div><div class="mextra"></div></div></div>';
    return { form: ui.$('.mform', el), stats: ui.$('.mstats', el), plot: ui.$('.mplot', el), extra: ui.$('.mextra', el) };
  }
  function plotIn(el, opts, h) {
    const box = document.createElement('div'); box.className = 'boxy'; box.style.padding = '8px';
    const cv = document.createElement('canvas'); cv.className = 'plot'; cv.style.height = (h || 240) + 'px';
    box.appendChild(cv); el.appendChild(box);
    const p = new H.Plot(cv, opts || {});
    ui.onLeave(() => p.destroy());
    return p;
  }
  // a plain canvas that redraws itself with draw(ctx, w, h) on demand and on resize
  function canvasIn(el, h, draw) {
    const box = document.createElement('div'); box.className = 'boxy'; box.style.padding = '6px';
    const cv = document.createElement('canvas'); cv.style.cssText = 'display:block;width:100%;height:' + h + 'px';
    box.appendChild(cv); el.appendChild(box);
    const paint = () => {
      const w = cv.clientWidth || 600, dpr = window.devicePixelRatio || 1;
      if (cv.width !== Math.round(w * dpr) || cv.height !== Math.round(h * dpr)) { cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr); }
      const c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, w, h);
      draw(c, w, h);
    };
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(() => paint()); ro.observe(cv); ui.onLeave(() => ro.disconnect()); }
    return { cv, paint };
  }
  function subtabs(el, base, TABS, sub, note) {
    const tab = TABS.some(t => t[0] === sub) ? sub : TABS[0][0];
    el.innerHTML = '<nav class="subtabs" style="margin-bottom:12px">' + TABS.map(([k, t]) => '<a href="#/tools/' + base + '/' + k + '" class="' + (k === tab ? 'on' : '') + '">' + t + '</a>').join('') + '</nav><div class="mbody"></div>' +
      (note ? '<p class="small faint mt">' + note + '</p>' : '');
    return { tab, body: ui.$('.mbody', el) };
  }
  // a text box of numbers, one row per line ("1, 12.5" or "1 12.5"); onChange(rows)
  function dataBox(el, label, text, rows, onChange) {
    const wrap = document.createElement('label'); wrap.className = 'mfield';
    wrap.innerHTML = '<span>' + esc(label) + '</span><textarea class="inp" rows="' + (rows || 8) + '" spellcheck="false" style="width:100%;height:auto;font-family:var(--font-mono);font-size:13px;resize:vertical">' + esc(text) + '</textarea>';
    el.appendChild(wrap);
    const ta = ui.$('textarea', wrap);
    const parse = () => ta.value.split(/\n/).map(l => l.trim()).filter(l => l && !/^[#a-z]/i.test(l))
      .map(l => l.split(/[\s,;\t]+/).map(s => parseFloat(U.cleanNum(s)))).filter(r => r.length && r.every(Number.isFinite));
    ta.addEventListener('input', () => onChange(parse()));
    return parse;
  }
  const link = (id, t) => H.nodes.has(id) ? ' <a href="#/c/' + id + '">' + esc(t || H.titleOf(id)) + '</a>' : '';

  /* ================================================================ SEQUENCES */
  // a made-up 380 bp sequence: an EcoRI site, one open reading frame of 91 codons with a BamHI site, then HindIII and EcoRI
  const DEMO = 'CTCGGCTCTTGAATTCTGTGTACCCCAAGAAAATAGAGTAATGGACGAATATACATATAAACTGGTCAAGTGCACGGTTGTCAGAGACGCATCCTGTACCGATGCAGGGTTCTCCGTAAGCGCGCACTGCACCC' +
    'ATACCTGTAACCACAGCGACCTTCTCCCGGTAACACTAACTGGATCCTCACCTCTACGCCGATCAGCCCGAGATCCGCGTATCACGCAGAAACGTTCTAGTAGAACTGTTTGTAGTGGAGTAGCCACCGCCCTAAACAGTCG' +
    'CGATTATGGTCACTTTGCTGAGCCAGCCGGCTGCCCGTAACCACGACAGTGTAAATCCGACTAAGCTTCGGATCAGTGTGTGAAAGGAATTCTCAGGCCGTCCG';
  const store = { text: '>demo | a made-up sequence for trying the tools\n' + DEMO.match(/.{1,60}/g).join('\n'), F: 'CTCGGCTCTTGAATTCTGTG', R: 'CTGATCCGAAGCTTAGTCGG' };
  // the sequence box shared by the four sequence tools; FASTA header lines are skipped
  function seqBox(el, onChange) {
    const wrap = document.createElement('div');
    wrap.innerHTML = '<label class="mfield"><span>DNA or RNA sequence (FASTA headers are skipped)</span><textarea class="inp seqta" rows="7" spellcheck="false" style="width:100%;height:auto;font-family:var(--font-mono);font-size:12.5px;resize:vertical"></textarea></label>' +
      '<div class="row" style="gap:6px;margin-top:6px;flex-wrap:wrap"><button class="btn sm" data-a="demo">Demo sequence</button><button class="btn sm" data-a="rc">Reverse complement it</button><button class="btn sm" data-a="clear">Clear</button><span class="small faint seqinfo"></span></div>';
    el.appendChild(wrap);
    const ta = ui.$('.seqta', wrap), info = ui.$('.seqinfo', wrap);
    ta.value = store.text;
    const get = () => {
      const body = ta.value.split(/\n/).filter(l => !/^\s*[>;]/.test(l)).join('');
      const letters = body.replace(/[\s\d]/g, ''), s = B().clean(letters);
      info.textContent = s.length + ' nt' + (letters.length > s.length ? ' · ' + (letters.length - s.length) + ' other characters ignored' : '');
      return s;
    };
    const fire = () => { store.text = ta.value; onChange(get()); };
    ta.addEventListener('input', fire);
    wrap.addEventListener('click', e => {
      const a = e.target.closest('[data-a]'); if (!a) return;
      if (a.dataset.a === 'demo') ta.value = '>demo | a made-up sequence for trying the tools\n' + DEMO.match(/.{1,60}/g).join('\n');
      if (a.dataset.a === 'rc') { const s = B().revComp(get()); ta.value = '>reverse complement\n' + (s.match(/.{1,60}/g) || []).join('\n'); }
      if (a.dataset.a === 'clear') ta.value = '';
      fire();
    });
    return get;
  }
  // numbered blocks of ten, sixty to a line
  const blocks = (s, mark) => (s.match(/.{1,60}/g) || []).map((line, i) => '<span class="faint">' + String(i * 60 + 1).padStart(6, ' ') + '</span>  ' +
    (line.match(/.{1,10}/g) || []).map(b => mark ? mark(b) : esc(b)).join(' ')).join('<br>');
  const seqStyle = 'font-family:var(--font-mono);font-size:12.5px;line-height:1.7;overflow-x:auto;white-space:nowrap;padding:10px 12px';
  const SEQ = [['analyse', 'Composition'], ['translate', 'Reading frames & ORFs'], ['digest', 'Restriction digest'], ['primers', 'Primers & PCR']];
  function sequence(el, params, sub) {
    const T = subtabs(el, 'sequence', SEQ, sub, 'A teaching workbench: simple models of melting temperature and gel migration, the standard genetic code and a few common restriction enzymes.');
    ({ analyse: sAnalyse, translate: sTranslate, digest: sDigest, primers: sPrimers })[T.tab](T.body);
  }
  function sAnalyse(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Paste a sequence to see what it is made of: base counts, GC content (G–C pairs have three hydrogen bonds and stack more strongly, so GC-rich DNA melts at a higher temperature), molar mass, the reverse complement and the messenger RNA it would give.' +
      link('dna-structure') + link('nucleic-acids') + link('bioinformatics') + '</p><div class="sform"></div><div class="mstats mt"></div><div class="splot"></div><div class="sout"></div>';
    const stats = ui.$('.mstats', el), out = ui.$('.sout', el);
    const pl = plotIn(ui.$('.splot', el), { x: { label: 'position (nt)', min: 0 }, y: { label: 'GC in a sliding window (%)', min: 0, max: 100 } }, 200);
    const get = seqBox(ui.$('.sform', el), s => calc(s));
    function calc(s) {
      if (!s.length) { stats.innerHTML = '<p class="muted">Paste a sequence of A, C, G and T (or U).</p>'; out.innerHTML = ''; pl.set({ series: [] }); return; }
      const cnt = b => (s.match(new RegExp(b, 'g')) || []).length, gc = B().gc(s), long = s.length > 60;
      stats.innerHTML = stat('Length', s.length + ' nt', 'A ' + cnt('A') + ' · C ' + cnt('C') + ' · G ' + cnt('G') + ' · T ' + cnt('T') + (cnt('N') ? ' · N ' + cnt('N') : '')) +
        stat('GC content', pc(gc, 1), 'A = T and G = C pair across the strands', 'big') +
        stat('Melting temperature', f1(long ? 69.3 + 41 * gc : B().tm(s)) + ' °C', long ? 'Marmur–Doty for long DNA in about 0.2 M Na⁺: 69.3 + 0.41 × %GC' : s.length < 14 ? 'Wallace rule 2(A+T) + 4(G+C), for short oligos' : '64.9 + 41(G + C − 16.4)/N, for primers') +
        stat('Molar mass', n3(B().mwDNA(s, false) / 1000, 4) + ' kDa', 'one strand; double-stranded ' + n3(B().mwDNA(s, true) / 1000, 4) + ' kDa') +
        stat('1 µg of it (double-stranded)', n3(1e-6 / B().mwDNA(s, true) * 6.02214076e23, 3) + ' molecules', n3(1e-6 / B().mwDNA(s, true) * 1e12, 4) + ' pmol');
      const w = Math.max(5, Math.min(50, Math.round(s.length / 8))), pts = [];
      for (let i = 0; i + w <= s.length; i += Math.max(1, Math.round(s.length / 400))) pts.push([i + w / 2, 100 * B().gc(s.slice(i, i + w))]);
      pl.set({ series: [{ pts, label: 'GC, window of ' + w + ' nt', fill: true }], hlines: [{ y: 100 * gc, label: 'overall' }] });
      const colour = b => b.replace(/[GC]+/g, m => '<span style="color:var(--accent)">' + m + '</span>');
      out.innerHTML = '<div class="msep mt">The sequence, 5′ → 3′ (G and C coloured)</div><div class="boxy" style="' + seqStyle + '">' + blocks(s, colour) + '</div>' +
        '<div class="msep mt">Reverse complement, 5′ → 3′ (the other strand)</div><div class="boxy" style="' + seqStyle + '">' + blocks(B().revComp(s)) + '</div>' +
        '<div class="msep mt">mRNA, if this is the coding strand</div><div class="boxy" style="' + seqStyle + '">' + blocks(B().transcribe(s)) + '</div>';
    }
    calc(get());
  }
  // amino acids by side chain: hydrophobic, polar, positive, negative, special
  const AACLASS = { A: 0, V: 0, L: 0, I: 0, M: 0, F: 0, W: 0, P: 4, G: 4, C: 4, S: 1, T: 1, N: 1, Q: 1, Y: 1, K: 2, R: 2, H: 2, D: 3, E: 3, '*': 5 };
  const CLASSNAME = ['hydrophobic', 'polar', 'positive', 'negative', 'special (G, P, C)', 'stop'], CLASSHUE = [40, 160, 220, 350, 280, 0];
  const aaColour = a => 'hsl(' + CLASSHUE[AACLASS[a] != null ? AACLASS[a] : 4] + ' 70% ' + (ui.colors().dark ? '32%' : '86%') + ')';
  function sTranslate(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Every DNA sequence can be read in six frames: three on each strand. An open reading frame runs from a start codon (ATG, methionine) to the next stop (TAA, TAG or TGA); a long one is a candidate gene, because stops turn up by chance about once in 21 codons.' +
      link('genetic-code') + link('translation') + link('bioinformatics') + '</p><div class="sform"></div><div class="row mt" style="gap:10px;align-items:center"><label class="small muted">Shortest ORF to report</label><input class="inp minaa" inputmode="decimal" value="30" style="width:80px"><span class="small muted">codons</span></div>' +
      '<div class="mstats mt"></div><div class="sframes"></div><div class="sorfs"></div><div class="scode"></div>';
    const stats = ui.$('.mstats', el), frames = ui.$('.sframes', el), orfsEl = ui.$('.sorfs', el), minEl = ui.$('.minaa', el);
    const get = seqBox(ui.$('.sform', el), () => calc());
    minEl.addEventListener('input', () => calc());
    function calc() {
      const s = get(), min = Math.max(5, parseInt(minEl.value, 10) || 30);
      if (s.length < 3) { stats.innerHTML = '<p class="muted">Paste a sequence of at least one codon.</p>'; frames.innerHTML = orfsEl.innerHTML = ''; return; }
      const orfs = B().orfs(s, min), rc = B().revComp(s);
      stats.innerHTML = stat('Open reading frames', String(orfs.length), 'of at least ' + min + ' codons, both strands', 'big') +
        (orfs.length ? stat('Longest', orfs[0].protein.length + ' amino acids', 'strand ' + orfs[0].strand + ', frame ' + orfs[0].frame + ', nt ' + orfs[0].start + '–' + orfs[0].end) +
          stat('Its protein', n3(B().mwProtein(orfs[0].protein) / 1000, 4) + ' kDa', 'average residue masses plus one water') : '');
      const row = (label, prot, strand, f) => {
        const hits = orfs.filter(o => o.strand === strand && o.frame === f);
        let html = '';
        for (let i = 0; i < prot.length; i++) {
          const a = prot[i], inOrf = hits.some(o => i >= (o.start - f) / 3 && i <= (o.end - f - 2) / 3);
          html += '<span style="' + (inOrf ? 'background:' + aaColour(a) + ';' : '') + (a === '*' ? 'color:var(--bad);font-weight:700' : a === 'M' ? 'color:var(--ok);font-weight:700' : '') + '">' + a + '</span>';
        }
        return '<div style="display:flex;gap:10px"><span class="faint" style="min-width:74px">' + label + '</span><span style="white-space:nowrap">' + html + '</span></div>';
      };
      frames.innerHTML = '<div class="msep mt">Six-frame translation (ORFs shaded by amino-acid class, M green, stops red)</div><div class="boxy" style="' + seqStyle + '">' +
        [0, 1, 2].map(f => row('+' + (f + 1), B().translate(s, f), '+', f + 1)).join('') + [0, 1, 2].map(f => row('−' + (f + 1), B().translate(rc, f), '−', f + 1)).join('') + '</div>' +
        '<div class="small faint" style="margin-top:4px">Frames on the − strand are read on the reverse complement, and their positions count along it.</div>';
      orfsEl.innerHTML = orfs.length ? '<div class="msep mt">Open reading frames</div><div class="simtable"><table class="ftable"><thead><tr><th style="text-align:left">Strand, frame</th><th>From–to (nt)</th><th>Codons</th><th>Mass (kDa)</th><th style="text-align:left">Protein (one-letter code)</th></tr></thead><tbody>' +
        orfs.slice(0, 20).map(o => '<tr><td style="text-align:left">' + o.strand + o.frame + '</td><td>' + o.start + '–' + o.end + '</td><td>' + o.protein.length + '</td><td>' + n3(B().mwProtein(o.protein) / 1000, 4) + '</td><td style="text-align:left;font-family:var(--font-mono);font-size:12px;word-break:break-all;white-space:normal">' + esc(o.protein) + '</td></tr>').join('') +
        '</tbody></table></div>' : '';
    }
    ui.$('.scode', el).innerHTML = codeTable();
    calc();
  }
  // the standard genetic code as the usual 16 × 4 table: first base down, second base across, third base within each cell
  function codeTable() {
    const N = 'TCAG', A = B().AA, C = B().CODE;
    let h = '<div class="msep mt">The standard genetic code (DNA codons; in mRNA read U for T)</div><div class="simtable"><table class="ftable" style="font-size:12.5px"><thead><tr><th>1st</th>' + [...N].map(b => '<th style="text-align:left">2nd ' + b + '</th>').join('') + '</tr></thead><tbody>';
    for (const a of N) for (const c of N) {
      h += '<tr>' + (c === 'T' ? '<td rowspan="4" style="font-weight:700;vertical-align:middle">' + a + '</td>' : '') +
        [...N].map(b => { const cod = a + b + c, x = C[cod]; return '<td style="text-align:left;background:' + aaColour(x) + '"><span style="font-family:var(--font-mono)">' + cod + '</span> ' + (x === '*' ? '<b>stop</b>' : A[x][1] + ' (' + x + ')') + (cod === 'ATG' ? ' <b>start</b>' : '') + '</td>'; }).join('') + '</tr>';
    }
    return h + '</tbody></table></div><div class="small muted" style="margin-top:6px">' + CLASSNAME.map((t, i) => '<span style="display:inline-block;padding:1px 6px;margin:2px;border-radius:5px;background:hsl(' + CLASSHUE[i] + ' 70% ' + (ui.colors().dark ? '32%' : '86%') + ')">' + t + '</span>').join('') + '</div>';
  }
  const LADDERS = [[1500, 1000, 750, 500, 400, 300, 200, 150, 100, 75, 50, 25], [10000, 8000, 6000, 5000, 4000, 3000, 2000, 1500, 1000, 750, 500, 250]];
  // fragments from cut positions (the base before each cut) for a linear or circular molecule
  function fragments(len, cuts, circular) {
    const c = [...new Set(cuts)].filter(x => x > 0 && x < len).sort((a, b) => a - b);
    if (!c.length) return [{ from: 1, to: len, bp: len }];
    if (circular) return c.map((x, i) => { const y = c[(i + 1) % c.length]; return { from: x + 1, to: y, bp: i + 1 < c.length ? y - x : len - x + y }; });
    return c.concat([len]).map((x, i) => { const prev = i ? c[i - 1] : 0; return { from: prev + 1, to: x, bp: x - prev }; });
  }
  function sDigest(el) {
    const names = Object.keys(B().ENZYMES), chosen = new Set(['EcoRI', 'BamHI', 'HindIII']);
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Restriction enzymes cut DNA at short palindromic sites. Choose enzymes to see where they cut, the fragments they leave, and how those fragments would run on an agarose gel: small pieces travel farther, roughly in proportion to the logarithm of their length.' +
      link('restriction-cloning') + link('gel-electrophoresis') + '</p><div class="sform"></div>' +
      '<div class="toolbar mt" style="flex-wrap:wrap">' + names.map(n => '<label class="chip" style="cursor:pointer"><input type="checkbox" data-e="' + n + '"' + (chosen.has(n) ? ' checked' : '') + '> ' + n + ' <span class="faint" style="font-family:var(--font-mono);font-size:11px">' + B().ENZYMES[n].slice(0, B().CUT[n]) + '^' + B().ENZYMES[n].slice(B().CUT[n]) + '</span></label>').join('') +
      '<select class="inp topo" style="width:auto"><option value="linear">linear DNA</option><option value="circular">circular (a plasmid)</option></select></div>' +
      '<div class="mstats mt"></div><div class="smap"></div><div class="sgel"></div><div class="sfrag"></div>';
    const stats = ui.$('.mstats', el), fragEl = ui.$('.sfrag', el), topo = ui.$('.topo', el);
    let S = { s: '', circ: false, cuts: [], per: {} };
    const map = canvasIn(ui.$('.smap', el), 92, (c, w) => {
      const len = S.s.length; if (!len) return;
      const C = ui.colors(), x0 = 20, x1 = w - 20, X = p => x0 + (x1 - x0) * p / len, y = 50;
      c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
      c.font = '11px ' + font(); c.fillStyle = C.muted; c.textAlign = 'center'; c.textBaseline = 'top'; c.fillText('1', x0, y + 8); c.fillText(len + ' bp' + (S.circ ? ' (joins back to 1)' : ''), x1 - 30, y + 8);
      let k = 0;
      for (const [n, cuts] of Object.entries(S.per)) {
        const col = C.series[k++ % C.series.length];
        cuts.forEach((p, i) => { c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(X(p), y - 12); c.lineTo(X(p), y + 5); c.stroke(); c.fillStyle = col; c.textBaseline = 'bottom'; c.fillText(n + ' ' + p, X(p), y - 14 - (i % 2) * 12); });
      }
    });
    const gel = canvasIn(ui.$('.sgel', el), 300, (c, w, h) => {
      const len = S.s.length; if (!len) return;
      const C = ui.colors(), ladder = LADDERS[len <= 1500 ? 0 : 1], lanes = [['ladder', ladder.map(bp => [bp, 1])], ['uncut', [[len, 1]]]]
        .concat(Object.keys(S.per).slice(0, 4).map(n => [n, fragments(len, S.per[n], S.circ).map(f => [f.bp, 1])]));
      if (Object.keys(S.per).length > 1) lanes.push(['all chosen', fragments(len, S.cuts, S.circ).map(f => [f.bp, 1])]);
      const bps = [].concat(...lanes.map(l => l[1].map(b => b[0]))), dTop = B().gelDistance(Math.max(...bps) * 1.15), dBot = B().gelDistance(Math.max(10, Math.min(...bps) / 1.15));
      const top = 34, bot = h - 16, Y = bp => top + (bot - top) * Math.max(0, Math.min(1, (B().gelDistance(bp) - dTop) / (dBot - dTop)));
      let lastLabel = -99;
      const lw = Math.min(90, (w - 60) / lanes.length), gx = 50;
      c.fillStyle = C.dark ? '#16202a' : '#e7edf2'; c.fillRect(gx - 6, top - 12, lw * lanes.length + 12, bot - top + 18);
      c.font = '11px ' + font(); c.textAlign = 'center';
      lanes.forEach(([name, bands], i) => {
        const x = gx + i * lw + lw / 2;
        c.fillStyle = C.muted; c.textBaseline = 'bottom'; c.fillText(name, x, top - 14);
        c.fillStyle = C.dark ? '#050a0f' : '#9aa7b3'; c.fillRect(x - lw * 0.32, top - 10, lw * 0.64, 5);
        const mass = bands.reduce((s, b) => s + b[0], 0);
        for (const [bp] of bands) {
          const a = name === 'ladder' ? 0.75 : Math.max(0.25, Math.min(1, 0.35 + 2 * bp / mass));
          c.fillStyle = 'rgba(' + (C.dark ? '120,255,170,' : '30,140,90,') + a + ')'; c.fillRect(x - lw * 0.32, Y(bp) - 2, lw * 0.64, 4);
          if (name === 'ladder' && Y(bp) - lastLabel >= 11) { lastLabel = Y(bp); c.fillStyle = C.faint; c.textAlign = 'right'; c.textBaseline = 'middle'; c.fillText(bp, gx - 8, Y(bp)); c.textAlign = 'center'; }
        }
      });
      if (S.circ) { c.fillStyle = C.faint; c.textAlign = 'left'; c.textBaseline = 'bottom'; c.fillText('Uncut plasmid is drawn as linear DNA; a real supercoiled plasmid runs differently.', gx, h); }
    });
    const get = seqBox(ui.$('.sform', el), () => calc());
    el.addEventListener('change', e => { if (e.target.dataset.e) { e.target.checked ? chosen.add(e.target.dataset.e) : chosen.delete(e.target.dataset.e); calc(); } });
    topo.addEventListener('change', () => calc());
    function calc() {
      const s = get(), circ = topo.value === 'circular', per = {};
      for (const n of names) if (chosen.has(n)) per[n] = B().sites(s, n).map(p => p - 1 + B().CUT[n]);
      const cuts = [].concat(...Object.values(per)), fr = fragments(s.length, cuts, circ);
      S = { s, circ, cuts, per };
      stats.innerHTML = Object.entries(per).map(([n, c]) => { const e = B().ends(n); return stat(n, c.length + (c.length === 1 ? ' cut' : ' cuts'), (c.length ? 'after nt ' + c.join(', ') : 'no site') + ' · ' + (e.overhang ? e.overhang + '-nt ' : '') + e.type); }).join('') +
        stat('Fragments', String(fr.length), fr.map(f => f.bp).sort((a, b) => b - a).join(', ') + ' bp', 'big');
      fragEl.innerHTML = '<div class="simtable mt"><table class="ftable"><thead><tr><th>Fragment</th><th>From</th><th>To</th><th>Length (bp)</th><th>Distance run (cm)</th></tr></thead><tbody>' +
        fr.map((f, i) => '<tr><td>' + (i + 1) + '</td><td>' + f.from + '</td><td>' + f.to + '</td><td>' + f.bp + '</td><td>' + f1(B().gelDistance(f.bp), 2) + '</td></tr>').join('') + '</tbody></table></div>' +
        '<div class="small faint" style="margin-top:4px">Distances use a typical 1 % agarose calibration, d = 9 − 2.2 log₁₀(bp) cm; sticky ends are counted on the top strand.</div>';
      map.paint(); gel.paint();
    }
    calc();
  }
  const comp = { A: 'T', T: 'A', G: 'C', C: 'G', N: 'N' };
  // the longest run of Watson–Crick pairs between a and b laid antiparallel at any offset (a crude dimer and hairpin check)
  function maxPairing(a, b) {
    const r = b.split('').reverse().join(''); let best = 0;
    for (let off = -r.length + 1; off < a.length; off++) {
      let run = 0;
      for (let i = 0; i < a.length; i++) { const j = i - off; if (j < 0 || j >= r.length) { run = 0; continue; } if (comp[a[i]] === r[j]) { run++; best = Math.max(best, run); } else run = 0; }
    }
    return best;
  }
  function sPrimers(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Two primers, written 5′ → 3′, define a PCR product: the forward one matches the top strand, the reverse one the bottom strand. Good primers are 18–25 nt long with 40–60 % GC, melting temperatures within a few degrees of each other, a G or C at the 3′ end, and no stretch that pairs with itself or its partner.' +
      link('pcr') + link('dna-replication') + '</p><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mplot"></div><div class="mextra"></div></div></div>';
    const fEl = ui.$('.mform', el), stats = ui.$('.mstats', el), extra = ui.$('.mextra', el);
    const pr = document.createElement('div'); pr.className = 'mform'; fEl.appendChild(pr);
    const read = form(pr, [['F', 'Forward primer 5′→3′', store.F, 't', true], ['R', 'Reverse primer 5′→3′', store.R, 't', true],
      ['s1', 'Amplification', 0, 'sep'], ['N0', 'Starting copies', 1000, 'n'], ['cyc', 'Cycles', 30, 'n'], ['eff', 'Efficiency per cycle', 95, 'n', '%']], () => calc());
    const tBox = document.createElement('div'); fEl.appendChild(tBox);
    const get = seqBox(tBox, () => calc());
    const pl = plotIn(ui.$('.mplot', el), { x: { label: 'cycle', min: 0 }, y: { label: 'copies of the product', log: true } }, 220);
    function calc() {
      const v = read(), F = B().clean(v.F), R = B().clean(v.R), s = get();
      store.F = v.F; store.R = v.R;
      const info = p => {
        const g = B().gc(p), tm = B().tm(p), clamp = (p.slice(-5).match(/[GC]/g) || []).length, run = (p.match(/(A+|C+|G+|T+)/g) || []).reduce((m, x) => Math.max(m, x.length), 0), self = maxPairing(p, p);
        const warn = [p.length < 18 || p.length > 25 ? 'length outside 18–25' : '', g < 0.4 || g > 0.6 ? 'GC outside 40–60 %' : '', clamp < 1 || clamp > 3 ? '3′ end: ' + clamp + ' G/C in the last five' : '', run >= 4 ? 'a run of ' + run + ' identical bases' : '', self >= 5 ? 'self-pairing over ' + self + ' nt' : ''].filter(Boolean);
        return { g, tm, clamp, run, self, warn };
      };
      if (!F.length || !R.length) { stats.innerHTML = '<p class="muted">Enter both primers.</p>'; return; }
      const a = info(F), b = info(R), cross = maxPairing(F, R), fAt = s.indexOf(F), rAt = s.indexOf(B().revComp(R));
      const size = fAt >= 0 && rAt >= 0 && rAt + R.length > fAt ? rAt + R.length - fAt : NaN;
      const one = (n, p, x) => stat(n + ' primer', f1(x.tm) + ' °C', p.length + ' nt · GC ' + pc(x.g, 0) + ' · ' + (x.warn.length ? x.warn.join('; ') : 'looks fine'), x.warn.length ? 'bad' : 'good');
      stats.innerHTML = one('Forward', F, a) + one('Reverse', R, b) + stat('Tm difference', f1(Math.abs(a.tm - b.tm)) + ' °C', 'keep it within about 5 °C; anneal near ' + f1(Math.min(a.tm, b.tm) - 5, 0) + ' °C to start with') +
        stat('Primer-dimer', cross + ' nt', 'longest stretch where the two primers pair', cross >= 5 ? 'bad' : '') +
        stat('On the template', Number.isFinite(size) ? size + ' bp product' : fAt < 0 && rAt < 0 ? 'neither primer matches' : fAt < 0 ? 'the forward primer does not match' : rAt < 0 ? 'the reverse primer does not match' : 'the primers face away from each other', Number.isFinite(size) ? 'from nt ' + (fAt + 1) + ' to ' + (rAt + R.length) : 'exact matches only', Number.isFinite(size) ? 'big' : 'bad');
      const E = v.eff / 100, cyc = Math.max(1, Math.min(60, Math.round(v.cyc))), ideal = [], real = [];
      let N = v.N0; const Nmax = 1e12;
      for (let k = 0; k <= cyc; k++) { ideal.push([k, B().pcr(v.N0, k, E)]); real.push([k, N]); N = N * (1 + E * Math.max(0, 1 - N / Nmax)); }
      const bp = Number.isFinite(size) ? size : 300, ng = real[cyc][1] * bp * 650 / 6.02214076e23 * 1e9;
      extra.innerHTML = '<div class="mstats">' + stat('After ' + cyc + ' cycles', n3(real[cyc][1], 3) + ' copies', 'ideal ' + n3(ideal[cyc][1], 3) + '; primers and nucleotides run short near 10¹² copies in a typical reaction') +
        stat('Mass of product', n3(ng, 3) + ' ng', 'a ' + bp + ' bp product at about 650 g/mol per base pair') + '</div>' +
        (Number.isFinite(size) ? '<div class="msep mt">The product</div><div class="boxy" style="' + seqStyle + '">' + blocks(s.slice(fAt, rAt + R.length)) + '</div>' : '');
      pl.set({ series: [{ pts: ideal, label: 'doubling × (1 + E) each cycle', dash: [6, 4] }, { pts: real, label: 'with a plateau (simple model)' }] });
    }
    calc();
  }

  /* ================================================================ GENETICS */
  const GEN = [['cross', 'Crosses'], ['hardy', 'Hardy–Weinberg'], ['drift', 'Genetic drift'], ['linkage', 'Linkage'], ['chi', 'χ² test']];
  function genetics(el, params, sub) {
    const T = subtabs(el, 'genetics', GEN, sub, 'Textbook models: independent assortment unless linkage is asked for, random mating, and alleles written as letters (capital = dominant).');
    ({ cross: gCross, hardy: gHardy, drift: gDrift, linkage: gLinkage, chi: gChi })[T.tab](T.body);
  }
  // 'AaBb' -> ['Aa', 'Bb'] if every pair is one gene's two alleles; null otherwise
  const loci = g => { const s = String(g || '').replace(/\s+/g, ''); if (!s || s.length % 2) return null; const p = s.match(/../g); return p.every(x => /^[A-Za-z]{2}$/.test(x) && x[0].toLowerCase() === x[1].toLowerCase()) ? p : null; };
  const gcd = (a, b) => b ? gcd(b, a % b) : a;
  const critical = df => { let lo = 0, hi = 200; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (B().chiP(m, df) > 0.05) lo = m; else hi = m; } return (lo + hi) / 2; };
  function chiTable(obs, exp, names) {
    return '<div class="simtable mt"><table class="ftable"><thead><tr><th style="text-align:left">Class</th><th>Observed O</th><th>Expected E</th><th>(O − E)²/E</th></tr></thead><tbody>' +
      obs.map((o, i) => '<tr><td style="text-align:left">' + esc(names[i]) + '</td><td>' + o + '</td><td>' + f1(exp[i], 2) + '</td><td>' + f1(exp[i] > 0 ? (o - exp[i]) ** 2 / exp[i] : 0, 3) + '</td></tr>').join('') + '</tbody></table></div>';
  }
  const verdict = p => p >= 0.05 ? 'p ≥ 0.05: the data fit the expected ratio (no significant difference)' : 'p < 0.05: the data differ significantly from the expected ratio';
  function gCross(el) {
    const L = layout(el, 'Write each parent\'s genotype gene by gene — AaBb, a capital letter for the dominant allele. Each parent\'s alleles separate into gametes (the law of segregation), different genes assort independently, and the Punnett square pairs every gamete of one parent with every gamete of the other.' + link('punnett-squares') + link('dihybrid-crosses') + link('mendels-laws'));
    const read = form(L.form, [['p1', 'Parent 1', 'AaBb', 't', true], ['p2', 'Parent 2', 'AaBb', 't', true], ['dom', 'Dominance', 'complete', 'sel', [['complete', 'complete (capital letter dominant)'], ['incomplete', 'incomplete or codominant (each genotype shows)']]],
      ['n', 'Offspring counted', 160, 'n'], ['obs', 'Observed counts, in the order of the phenotypes (optional)', '', 't', true]], v => calc(v));
    function calc(v) {
      const a = loci(v.p1), b = loci(v.p2);
      if (!a || !b) { L.stats.innerHTML = '<p class="muted">Write each genotype as pairs of the same letter, such as Aa, AaBb or AABbcc.</p>'; L.plot.innerHTML = L.extra.innerHTML = ''; return; }
      if (a.length !== b.length || a.some((x, i) => x[0].toLowerCase() !== b[i][0].toLowerCase())) { L.stats.innerHTML = '<p class="muted">Both parents need the same genes in the same order.</p>'; L.plot.innerHTML = L.extra.innerHTML = ''; return; }
      if (a.length > 4) { L.stats.innerHTML = '<p class="muted">Up to four genes at a time.</p>'; return; }
      const r = B().punnett(a.join(''), b.join('')), inc = v.dom === 'incomplete';
      const phenoOf = g => inc ? g : (g.match(/../g) || []).map(p => /[A-Z]/.test(p) ? p[0].toUpperCase() + '_' : p).join(' ');
      const ph = {}; Object.entries(r.genotypes).forEach(([g, n]) => { const k = phenoOf(g); ph[k] = (ph[k] || 0) + n; });
      const phen = Object.entries(ph).sort((x, y) => y[1] - x[1]), gens = Object.entries(r.genotypes).sort((x, y) => y[1] - x[1]);
      const g1 = phen.reduce((m, [, n]) => gcd(m, n), 0), g2 = gens.reduce((m, [, n]) => gcd(m, n), 0), N = v.n > 0 ? v.n : 0;
      const hue = Object.fromEntries(phen.map(([k], i) => [k, (i * 67 + 20) % 360]));
      L.stats.innerHTML = stat('Phenotype ratio', phen.map(([, n]) => n / g1).join(' : '), phen.map(([k]) => k).join(' : '), 'big') +
        stat('Genotype ratio', gens.length <= 9 ? gens.map(([, n]) => n / g2).join(' : ') : gens.length + ' genotypes', gens.length <= 9 ? gens.map(([k]) => k).join(' : ') : 'see the table below') +
        stat('Gametes', r.gametes1.length + ' × ' + r.gametes2.length, r.total + ' equally likely combinations');
      const show = r.total <= 64;
      L.plot.innerHTML = show ? '<div class="simtable"><table class="ftable" style="font-family:var(--font-mono);font-size:12.5px"><thead><tr><th>♀ \\ ♂</th>' + r.gametes2.map(x => '<th>' + x + '</th>').join('') + '</tr></thead><tbody>' +
        r.grid.map((row, i) => '<tr><th>' + r.gametes1[i] + '</th>' + row.map(g => '<td style="background:hsl(' + hue[phenoOf(g)] + ' 65% ' + (ui.colors().dark ? '30%' : '86%') + ')">' + g + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>'
        : '<p class="muted">The square has ' + r.total + ' cells — too many to draw; the ratios are complete.</p>';
      const obs = (v.obs || '').split(/[\s,;]+/).map(Number).filter(Number.isFinite);
      let chi = '';
      if (obs.length === phen.length && obs.every(x => x >= 0) && obs.some(x => x > 0)) {
        const tot = obs.reduce((s, x) => s + x, 0), exp = phen.map(([, n]) => tot * n / r.total), t = B().chiSquare(obs, exp);
        chi = '<div class="mstats mt">' + stat('χ²', f1(t.chi2, 3), t.df + ' degrees of freedom; 5 % critical value ' + f1(critical(t.df), 2)) + stat('p', n3(t.p, 3), verdict(t.p), t.p >= 0.05 ? 'good' : 'bad') + '</div>' + chiTable(obs, exp, phen.map(([k]) => k));
      } else if (obs.length) chi = '<p class="small muted mt">Give ' + phen.length + ' observed counts, one per phenotype in the order above.</p>';
      L.extra.innerHTML = '<div class="simtable mt"><table class="ftable"><thead><tr><th style="text-align:left">Phenotype</th><th>Fraction</th><th>Expected of ' + N + '</th></tr></thead><tbody>' +
        phen.map(([k, n]) => '<tr><td style="text-align:left"><i class="sdot" style="background:hsl(' + hue[k] + ' 65% 55%)"></i> ' + k + '</td><td>' + (n / g1) + '/' + (r.total / g1) + ' = ' + pc(n / r.total, 2) + '</td><td>' + f1(N * n / r.total, 1) + '</td></tr>').join('') + '</tbody></table></div>' + chi;
    }
    calc(read());
  }
  function gHardy(el) {
    const L = layout(el, 'In a large, randomly mating population with no selection, migration or mutation, allele frequencies p and q stay put and genotypes settle at p², 2pq and q² in one generation. Count genotypes to test it, or start from how common a recessive condition is to find how many people carry it.' + link('hardy-weinberg') + link('human-genetics'));
    const pl = plotIn(L.plot, { x: { label: 'frequency p of allele A', min: 0, max: 1 }, y: { label: 'genotype frequency', min: 0, max: 1 } }, 230);
    const read = form(L.form, [['AA', 'AA counted', 38, 'n'], ['Aa', 'Aa counted', 44, 'n'], ['aa', 'aa counted', 18, 'n'],
      ['s1', 'A recessive condition', 0, 'sep'], ['inc', 'It affects 1 in', 2500, 'n', 'people']], v => calc(v));
    function calc(v) {
      const n = v.AA + v.Aa + v.aa;
      if (!(n > 0 && v.AA >= 0 && v.Aa >= 0 && v.aa >= 0)) { L.stats.innerHTML = '<p class="muted">Enter genotype counts.</p>'; return; }
      const t = B().hwTest(v.AA, v.Aa, v.aa), q2 = v.inc > 0 ? 1 / v.inc : NaN, q = Math.sqrt(q2), car = 2 * q * (1 - q);
      L.stats.innerHTML = stat('Allele frequencies', 'p = ' + f1(t.p, 3) + ', q = ' + f1(t.q, 3), 'p = (2·AA + Aa)/2N from ' + n + ' individuals', 'big') +
        stat('Expected', t.expected.map(x => f1(x, 1)).join(' : '), 'p²N : 2pqN : q²N') + stat('χ²', f1(t.chi2, 3), '1 degree of freedom (3 classes − 1 − 1 estimated)') +
        stat('p-value', n3(t.pValue, 3), t.pValue >= 0.05 ? 'consistent with Hardy–Weinberg' : 'a significant departure: look for inbreeding, selection, mixing or a typing error', t.pValue >= 0.05 ? 'good' : 'bad') +
        stat('Carriers of the recessive allele', Number.isFinite(car) ? '1 in ' + n3(1 / car, 3) : '—', 'q = √(1/' + n3(v.inc, 4) + ') = ' + n3(q, 3) + '; carriers 2pq = ' + pc(car, 2) + ' — far more than the affected');
      const pts = k => { const o = []; for (let i = 0; i <= 100; i++) { const p = i / 100, h = B().hardyWeinberg(p); o.push([p, h[k]]); } return o; };
      pl.set({ series: [{ pts: pts('AA'), label: 'AA = p²' }, { pts: pts('Aa'), label: 'Aa = 2pq' }, { pts: pts('aa'), label: 'aa = q²' }], vlines: [{ x: t.p, label: 'this sample' }],
        marks: [{ x: t.p, y: v.AA / n, label: 'AA' }, { x: t.p, y: v.Aa / n, label: 'Aa' }, { x: t.p, y: v.aa / n, label: 'aa' }] });
    }
    calc(read());
  }
  function gDrift(el) {
    const L = layout(el, 'Each line is a population of N diploid individuals: every generation, 2N gene copies are drawn at random from the last one (the Wright–Fisher model). Allele frequencies wander, and each line ends up fixed or lost — faster in small populations. Selection s gives the allele fitness 1 + s as AA and 1 + hs as Aa.' + link('genetic-drift') + link('natural-selection'));
    const pP = plotIn(L.plot, { x: { label: 'generation', min: 0 }, y: { label: 'allele frequency p', min: 0, max: 1 } }, 250);
    const pH = plotIn(L.plot, { x: { label: 'generation', min: 0 }, y: { label: 'mean heterozygosity 2pq', min: 0 } }, 170);
    const read = form(L.form, [['N', 'Population size N', 50, 'n', 'individuals'], ['p0', 'Starting frequency p₀', 0.5, 'n'], ['s', 'Selection coefficient s', 0, 'n'], ['h', 'Dominance h', 0.5, 'n'],
      ['g', 'Generations', 200, 'n'], ['lines', 'Populations', 20, 'n'], ['seed', 'Random seed', 1, 'n']], v => calc(v));
    function calc(v) {
      const N = Math.round(v.N), g = Math.round(v.g), k = Math.round(v.lines);
      if (!(N >= 1 && N <= 1e6 && Number.isFinite(v.h) && v.p0 >= 0 && v.p0 <= 1 && g >= 1 && g <= 5000 && k >= 1 && k <= 100 && v.s > -1)) { L.stats.innerHTML = '<p class="muted">N from 1 to a million, p₀ from 0 to 1, up to 5000 generations and 100 populations, s above −1.</p>'; return; }
      const runs = []; for (let i = 0; i < k; i++) runs.push(B().wrightFisher({ N, p0: v.p0, gens: g, s: v.s, h: v.h, seed: Math.round(v.seed) * 1000 + i + 1 }));
      const fixed = runs.filter(r => r[g] >= 1).length, lost = runs.filter(r => r[g] <= 0).length, step = Math.max(1, Math.round(g / 400));
      const Hm = [], He = []; for (let t = 0; t <= g; t += step) { Hm.push([t, runs.reduce((s, r) => s + 2 * r[t] * (1 - r[t]), 0) / k]); He.push([t, 2 * v.p0 * (1 - v.p0) * Math.pow(1 - 1 / (2 * N), t)]); }
      const u = v.s === 0 ? v.p0 : Math.abs(v.h - 0.5) < 1e-9 ? (1 - Math.exp(-2 * N * v.s * v.p0)) / (1 - Math.exp(-2 * N * v.s)) : NaN;
      const tfix = v.p0 > 0 && v.p0 < 1 ? -4 * N * (1 - v.p0) * Math.log(1 - v.p0) / v.p0 : NaN;
      L.stats.innerHTML = stat('Fixed / lost / still varying', fixed + ' / ' + lost + ' / ' + (k - fixed - lost), 'of ' + k + ' populations after ' + g + ' generations', 'big') +
        stat('Chance of fixation, theory', Number.isFinite(u) ? pc(u, 1) : '—', v.s === 0 ? 'neutral: equal to p₀' : Number.isFinite(u) ? 'Kimura (additive, h = 0.5): (1 − e^(−2Nsp₀))/(1 − e^(−2Ns))' : 'the formula shown is for h = 0.5') +
        stat('Heterozygosity falls', '× ' + f1(1 - 1 / (2 * N), 4) + ' per generation', 'halves in about ' + n3(Math.LN2 * 2 * N, 3) + ' generations without selection') +
        (v.s === 0 && Number.isFinite(tfix) ? stat('Mean time to fixation', n3(tfix, 3) + ' generations', 'for the lines that fix: −4N(1 − p₀) ln(1 − p₀)/p₀') : '');
      const C = ui.colors();
      pP.set({ series: runs.map((r, i) => ({ pts: r.filter((_, t) => t % step === 0).map((p, j) => [j * step, p]), color: C.hue((i * 47) % 360, 0.75), width: 1.3 })) });
      pH.set({ series: [{ pts: Hm, label: 'mean of the populations' }, { pts: He, label: 'H₀(1 − 1/2N)ᵗ', dash: [6, 4] }] });
    }
    calc(read());
  }
  function gLinkage(el) {
    const L = layout(el, 'Genes close together on a chromosome are inherited together unless a crossover falls between them. In a test cross (AaBb × aabb) the recombinant offspring show how often that happens: the recombination frequency. Map functions turn it into a distance in centimorgans, allowing for double crossovers that go unseen.' + link('linkage-mapping') + link('meiosis'));
    const pl = plotIn(L.plot, { x: { label: 'recombination frequency r', min: 0, max: 0.5 }, y: { label: 'map distance (cM)', min: 0 } }, 240);
    const read = form(L.form, [['p1', 'Parental class AB', 420, 'n'], ['p2', 'Parental class ab', 410, 'n'], ['r1', 'Recombinant Ab', 85, 'n'], ['r2', 'Recombinant aB', 85, 'n']], v => calc(v));
    function calc(v) {
      const n = v.p1 + v.p2 + v.r1 + v.r2, r = (v.r1 + v.r2) / n;
      if (!(n > 0) || [v.p1, v.p2, v.r1, v.r2].some(x => x < 0)) { L.stats.innerHTML = '<p class="muted">Enter the four counts.</p>'; return; }
      const ind = B().chiSquare([v.p1, v.p2, v.r1, v.r2], [n / 4, n / 4, n / 4, n / 4]), ok = r < 0.5;
      L.stats.innerHTML = stat('Recombination frequency', f1(r, 4), (v.r1 + v.r2) + ' recombinants of ' + n, 'big') + stat('Simple map distance', f1(100 * r, 1) + ' cM', '1 % recombinants = 1 cM; good below about 10 cM') +
        stat('Haldane', ok ? f1(B().haldane(r), 1) + ' cM' : '—', 'crossovers at random: d = −½ ln(1 − 2r)') + stat('Kosambi', ok ? f1(B().kosambi(r), 1) + ' cM' : '—', 'allows for interference: d = ¼ ln((1 + 2r)/(1 − 2r))') +
        stat('Independent assortment?', 'χ² = ' + f1(ind.chi2, 1), 'p = ' + n3(ind.p, 3) + (ind.p < 0.05 ? ': the 1:1:1:1 of unlinked genes is rejected — they are linked' : ': no evidence of linkage'), ind.p < 0.05 ? '' : 'good');
      const pts = f => { const o = []; for (let i = 0; i < 100; i++) { const x = 0.495 * i / 99; o.push([x, f(x)]); } return o; };
      pl.set({ series: [{ pts: pts(x => 100 * x), label: 'd = 100 r', dash: [6, 4] }, { pts: pts(B().haldane), label: 'Haldane' }, { pts: pts(B().kosambi), label: 'Kosambi' }], vlines: [{ x: Math.min(0.5, r), label: 'this cross' }], y: { label: 'map distance (cM)', min: 0, max: 150 } });
    }
    calc(read());
  }
  function gChi(el) {
    const L = layout(el, 'Are the counts you observed close enough to a ratio you expected? χ² adds up (O − E)²/E over the classes; the p-value is the chance of a deviation at least this big if the ratio were true. The default data are the seed shapes and colours from one of Mendel\'s dihybrid crosses (1866).' + link('chi-square-genetics') + link('statistics-bio'));
    const pl = plotIn(L.plot, { x: { label: 'χ²', min: 0 }, y: { label: 'probability density', min: 0 } }, 220);
    const read = form(L.form, [['o', 'Observed counts', '315, 108, 101, 32', 't', true], ['e', 'Expected ratio', '9, 3, 3, 1', 't', true], ['names', 'Class names (optional)', 'round yellow, round green, wrinkled yellow, wrinkled green', 't']], v => calc(v));
    function calc(v) {
      const O = v.o.split(/[\s,;]+/).map(Number).filter(Number.isFinite), R = v.e.split(/[\s,;:]+/).map(Number).filter(Number.isFinite), names = v.names.split(',').map(s => s.trim());
      if (O.length < 2 || O.length !== R.length || R.some(x => x < 0) || !(R.reduce((a, b) => a + b, 0) > 0)) { L.stats.innerHTML = '<p class="muted">Give at least two observed counts and a ratio with the same number of parts.</p>'; L.extra.innerHTML = ''; return; }
      const tot = O.reduce((a, b) => a + b, 0), rs = R.reduce((a, b) => a + b, 0), E = R.map(x => tot * x / rs), t = B().chiSquare(O, E), crit = critical(t.df);
      L.stats.innerHTML = stat('χ²', f1(t.chi2, 3), t.df + ' degrees of freedom (classes − 1)', 'big') + stat('p-value', n3(t.p, 3), verdict(t.p), t.p >= 0.05 ? 'good' : 'bad') +
        stat('5 % critical value', f1(crit, 3), 'reject the ratio if χ² is larger') + (E.some(x => x < 5) ? stat('Caution', 'small expected counts', 'χ² is unreliable when any expected count is below 5', 'bad') : '');
      L.extra.innerHTML = chiTable(O, E, O.map((_, i) => names[i] || 'class ' + (i + 1)));
      const k = t.df, lg = B().lgamma(k / 2), pdf = x => x <= 0 ? (k === 2 ? 0.5 : k < 2 ? NaN : 0) : Math.exp((k / 2 - 1) * Math.log(x) - x / 2 - (k / 2) * Math.LN2 - lg);
      const xmax = Math.max(crit * 1.6, t.chi2 * 1.2, 4), pts = [], tail = [];
      for (let i = 1; i <= 300; i++) { const x = xmax * i / 300; pts.push([x, pdf(x)]); if (x >= crit) tail.push([x, pdf(x)]); }
      pl.set({ series: [{ pts, label: 'χ² distribution, ' + k + ' df' }, { pts: tail, fill: true, label: '5 % tail', color: ui.colors().bad, width: 1 }], vlines: [{ x: t.chi2, label: 'your χ²' }], y: { label: 'probability density', min: 0, max: Math.min(1, Math.max(...pts.map(p => p[1]).filter(Number.isFinite)) * 1.1) } });
    }
    calc(read());
  }

  /* ================================================================ CELLS AND LIFE */
  // [id, name, colour, svg, text, [concept ids]] per cell type; shapes drawn in a 420 × 300 box (a scale bar below), the first part lowest
  const RIB = pts => pts.map(([x, y]) => '<circle cx="' + x + '" cy="' + y + '" r="1.8"/>').join('');
  const CELLS = {
    animal: { name: 'Animal cell', scale: [300, 310, 98, '5 µm'], parts: [
      ['cytoplasm', 'Cytoplasm and cytosol', '#e9dcb4', '<ellipse cx="210" cy="150" rx="195" ry="134"/>', 'Everything between the membrane and the nucleus. The cytosol, its watery gel, is about 20–30 % protein by weight — so crowded that molecules jostle rather than drift — and it is where glycolysis and most protein synthesis happen.', ['eukaryotic-cells', 'glycolysis', 'metabolism-overview']],
      ['cytoskeleton', 'Cytoskeleton', '#9a9a9a', '<path style="fill:none;stroke:var(--c);stroke-width:2.2" d="M40 120C120 90 180 60 300 70M60 200C150 230 260 240 380 170M110 230L150 40M260 260L330 50M30 160C100 160 250 130 390 130"/>', 'A scaffold of protein filaments: actin (about 7 nm thick) for shape and crawling, intermediate filaments (about 10 nm) for strength, and microtubules (25 nm tubes) as tracks for motor proteins and for the spindle that separates chromosomes.', ['cytoskeleton', 'mitosis']],
      ['membrane', 'Plasma membrane', '#c9803c', '<ellipse cx="210" cy="150" rx="195" ry="134" style="fill:none;stroke:var(--c);stroke-width:5"/>', 'A phospholipid bilayer only 7–8 nm thick, studded with proteins. It lets small uncharged molecules through, and controls everything else with channels, carriers and pumps; the sodium–potassium pump alone can use a fifth or more of a resting animal\'s energy.', ['membrane-structure', 'diffusion-osmosis', 'active-transport', 'endocytosis']],
      ['er', 'Endoplasmic reticulum', '#4f9fc9', '<path style="fill:none;stroke:var(--c);stroke-width:4;stroke-linecap:round" d="M252 108C268 128 268 162 252 184M264 96C286 124 286 168 264 196M276 86C304 120 304 172 276 206"/><g style="fill:#2d5f7a">' + RIB([[256, 118], [259, 146], [256, 172], [270, 110], [274, 140], [272, 170], [269, 188], [283, 98], [290, 130], [291, 160], [284, 192]]) + '</g><path style="fill:none;stroke:#69c0b0;stroke-width:4;stroke-linecap:round" d="M240 226c10-8 20 8 30 0s20 8 30 0M250 244c10-8 20 8 30 0"/>',
        'A maze of membrane sacs and tubes continuous with the nuclear envelope. The rough ER, dotted with ribosomes, makes proteins for membranes and for export; the smooth ER (green-blue) makes lipids, stores calcium and, in the liver, helps break down drugs.', ['endomembrane', 'translation', 'lipids']],
      ['golgi', 'Golgi apparatus', '#e0a33a', '<path style="fill:none;stroke:var(--c);stroke-width:6;stroke-linecap:round" d="M318 70C334 84 336 110 322 128M330 62C350 80 352 114 334 136M342 58C364 78 366 118 346 142"/><circle cx="360" cy="104" r="5"/><circle cx="312" cy="136" r="4.5"/>',
        'A stack of four to eight flattened sacs that receives proteins from the ER, trims and adds sugars to them, and sorts them into vesicles by destination: the membrane, lysosomes or secretion.', ['endomembrane']],
      ['mito', 'Mitochondria', '#e06a5a', '<g transform="rotate(-25 110 90)"><ellipse cx="110" cy="90" rx="30" ry="13"/><path class="fold" d="M88 90l6-9 6 18 6-18 6 18 6-18 6 18 6-9"/></g><g transform="rotate(20 120 210)"><ellipse cx="120" cy="210" rx="28" ry="12"/><path class="fold" d="M100 210l6-8 6 16 6-16 6 16 6-16 6 16 4-8"/></g><g transform="rotate(70 340 210)"><ellipse cx="340" cy="210" rx="24" ry="11"/><path class="fold" d="M322 210l6-8 6 16 6-16 6 16 6-8"/></g>',
        'The cell\'s power stations: the Krebs cycle runs in the matrix and the electron transport chain on the folded inner membrane (the cristae), making most of the ATP. About 0.5–1 µm wide; a liver cell has one to two thousand. They carry their own small circular genome — a trace of their bacterial ancestry.', ['mitochondria-chloroplasts', 'krebs-cycle', 'oxidative-phosphorylation', 'atp-energy']],
      ['nucleus', 'Nucleus', '#8f7fd0', '<circle cx="190" cy="145" r="52"/><path class="fold" d="M160 130c10 6 16-6 26 2s18-4 26 4M158 160c12-6 20 8 30 0s18 6 28-2M176 180c8-4 16 4 24 0"/>', 'Holds the chromosomes — in a human cell about two metres of DNA folded into a sphere some 6 µm across — inside a double membrane pierced by thousands of nuclear pores. Genes are transcribed here and the RNA is processed before export.', ['nucleus-ribosomes', 'dna-structure', 'transcription', 'rna-processing']],
      ['nucleolus', 'Nucleolus', '#5a4aa0', '<circle cx="178" cy="138" r="14"/>', 'A dense region of the nucleus, not bounded by a membrane, where ribosomal RNA is transcribed and joined with proteins into ribosome subunits.', ['nucleus-ribosomes']],
      ['lyso', 'Lysosomes', '#c64f8e', '<circle cx="78" cy="150" r="10"/><circle cx="360" cy="170" r="8"/>', 'Small sacs of digestive enzymes that work best at about pH 4.5–5, kept acidic by proton pumps. They break down worn-out parts and whatever the cell engulfs; the enzymes are fairly harmless if they leak into the near-neutral cytosol.', ['endomembrane', 'endocytosis', 'apoptosis']],
      ['perox', 'Peroxisome', '#9bc25a', '<circle cx="80" cy="190" r="8"/><rect x="77" y="187" width="6" height="6" style="fill:#5d7f2c"/>', 'Oxidises very-long-chain fatty acids and other molecules, making hydrogen peroxide as a by-product and destroying it at once with the enzyme catalase.', ['metabolism-overview', 'enzymes']],
      ['vesicles', 'Vesicles', '#f0c860', '<circle cx="372" cy="120" r="5"/><circle cx="384" cy="140" r="4"/><circle cx="46" cy="110" r="5"/><circle cx="224" cy="40" r="5"/>', 'Membrane bubbles that carry cargo between compartments and to the surface, where they fuse to release it (exocytosis); others bud inwards to bring material in (endocytosis).', ['endocytosis', 'endomembrane']],
      ['centro', 'Centrosome', '#6c6c6c', '<rect x="210" y="236" width="14" height="5"/><rect x="226" y="230" width="5" height="14"/>', 'The main organising centre for microtubules, with a pair of centrioles set at right angles. It duplicates once per cell cycle, and the two copies organise the poles of the mitotic spindle.', ['cytoskeleton', 'cell-cycle', 'mitosis']],
      ['ribo', 'Free ribosomes', '#2d5f7a', RIB([[150, 230], [162, 236], [95, 125], [100, 170], [300, 240], [312, 232], [235, 70], [245, 62], [60, 145], [146, 60]]), 'Protein-making machines about 25–30 nm across, built of RNA and protein. Free ones make proteins that stay in the cytosol; a busy cell has millions.', ['nucleus-ribosomes', 'translation']]
    ] },
    plant: { name: 'Plant cell', scale: [320, 310, 81, '10 µm'], parts: [
      ['wall', 'Cell wall', '#9ccf6a', '<path fill-rule="evenodd" d="M8 8h404v284h-404zM22 22v256h376v-256z"/><path style="fill:none;stroke:#557f2e;stroke-width:3" d="M8 90h14M8 150h14M8 210h14M398 80h14M398 200h14"/>', 'A tough layer of cellulose fibres in a gel of other polysaccharides, laid down outside the membrane. It resists the water pressure (turgor) pushing out from inside, which is what keeps soft plant parts rigid. Narrow channels through it, the plasmodesmata (darker marks, about 50 nm wide), link neighbouring cells.', ['plant-tissues', 'carbohydrates', 'water-potential']],
      ['cytoplasm', 'Cytoplasm', '#ece6bd', '<rect x="24" y="24" width="372" height="252" rx="10"/>', 'In a mature plant cell the cytoplasm is a thin layer pressed against the wall by the vacuole, and it streams round the cell carrying the chloroplasts.', ['eukaryotic-cells', 'cytoskeleton']],
      ['membrane', 'Plasma membrane', '#c9803c', '<rect x="24" y="24" width="372" height="252" rx="10" style="fill:none;stroke:var(--c);stroke-width:3"/>', 'The same kind of lipid bilayer as in animal cells, pressed against the wall. Its water channels (aquaporins) and pumps set how water and solutes move in and out.', ['membrane-structure', 'diffusion-osmosis', 'water-potential']],
      ['vacuole', 'Central vacuole', '#9fd0ec', '<path d="M70 70C120 44 250 50 300 76C330 92 336 130 330 170C324 214 290 238 230 240C160 244 90 236 66 200C46 166 46 96 70 70Z"/>', 'A large sac of water, salts, sugars and pigments bounded by its own membrane, the tonoplast. It can fill 80–90 % of the cell, so the cell grows big cheaply, and its pressure keeps the cell turgid.', ['water-potential', 'plant-tissues', 'transpiration']],
      ['chloro', 'Chloroplasts', '#3f9f4f', ['M30 60', 'M40 200', 'M140 256', 'M280 258', 'M370 150', 'M200 34'].map((m, i) => { const [x, y] = m.slice(1).split(' ').map(Number); return '<g transform="rotate(' + [70, 100, 0, 10, 90, 0][i] + ' ' + x + ' ' + y + ')"><ellipse cx="' + x + '" cy="' + y + '" rx="20" ry="9"/><path class="fold" d="M' + (x - 11) + ' ' + (y - 3) + 'h6M' + (x - 3) + ' ' + (y + 2) + 'h6M' + (x + 5) + ' ' + (y - 3) + 'h6"/></g>'; }).join(''),
        'Where photosynthesis happens: light is captured by chlorophyll in stacked thylakoid membranes, and carbon dioxide is fixed into sugar in the surrounding stroma. A leaf mesophyll cell holds dozens, each 5–10 µm long, with its own DNA — once a free-living cyanobacterium.', ['mitochondria-chloroplasts', 'photosynthesis', 'light-reactions', 'calvin-cycle']],
      ['nucleus', 'Nucleus', '#8f7fd0', '<circle cx="352" cy="62" r="28"/><circle cx="346" cy="58" r="8" style="fill:#5a4aa0"/>', 'The same role as in any eukaryote; in a mature plant cell it is often pushed to one side by the vacuole.', ['nucleus-ribosomes', 'transcription']],
      ['mito', 'Mitochondria', '#e06a5a', '<ellipse cx="96" cy="258" rx="14" ry="6"/><ellipse cx="380" cy="240" rx="6" ry="14"/>', 'Plant cells need mitochondria too: photosynthesis makes sugar, respiration turns it into ATP, day and night.', ['mitochondria-chloroplasts', 'oxidative-phosphorylation']],
      ['golgi', 'Golgi and ER', '#e0a33a', '<path style="fill:none;stroke:var(--c);stroke-width:4;stroke-linecap:round" d="M318 104c8 8 8 20 0 28M326 100c10 10 10 26 0 36"/><path style="fill:none;stroke:#4f9fc9;stroke-width:3;stroke-linecap:round" d="M330 30c14 4 22 12 26 0M310 92c6-8 14-8 20-4"/>', 'The Golgi of a plant cell also makes the non-cellulose polysaccharides of the wall and ships them out in vesicles; the ER runs through the plasmodesmata into neighbouring cells.', ['endomembrane', 'plant-tissues']],
      ['ribo', 'Ribosomes', '#2d5f7a', RIB([[60, 40], [72, 46], [120, 262], [230, 262], [386, 110], [300, 36], [34, 130]]), 'Protein factories, as in every cell; chloroplasts and mitochondria also carry smaller ribosomes of their own, like those of bacteria.', ['nucleus-ribosomes', 'translation']]
    ] },
    bacterium: { name: 'Bacterium', scale: [290, 262, 80, '0.5 µm'], parts: [
      ['capsule', 'Capsule', '#e7dcb8', '<rect x="36" y="82" width="328" height="136" rx="68" style="opacity:.75"/>', 'A slimy outer layer of polysaccharide in many species. It helps the cell stick to surfaces, resist drying, and escape being eaten by immune cells.', ['bacteria-archaea', 'biofilms']],
      ['pili', 'Pili and fimbriae', '#8a6a4a', '<path style="fill:none;stroke:var(--c);stroke-width:1.6" d="M110 90l-8-18M150 86l-3-20M200 84l0-20M250 86l4-20M290 90l8-18M110 210l-8 18M160 214l-3 20M220 216l2 20M280 212l8 18"/>', 'Thin protein hairs for clinging to surfaces and to host cells; a special sex pilus pulls two cells together for conjugation, the transfer of a plasmid.', ['bacteria-archaea', 'antibiotic-resistance']],
      ['flag', 'Flagellum', '#8a6a4a', '<path style="fill:none;stroke:var(--c);stroke-width:3" d="M362 150c12-14 22 14 34 0s22-14 22 0"/>', 'A rigid helical filament turned by a rotary motor in the membrane, driven by protons flowing into the cell. It can spin at about a hundred turns a second, pushing the cell some tens of body lengths each second.', ['prokaryotic-cells', 'bacteria-archaea']],
      ['wall', 'Cell wall', '#b8864a', '<rect x="50" y="96" width="300" height="108" rx="54" style="fill:none;stroke:var(--c);stroke-width:7"/>', 'A mesh of peptidoglycan — sugar chains cross-linked by short peptides — that stops the cell bursting. It is thick in Gram-positive bacteria and thin, under an outer membrane, in Gram-negative ones. Penicillins and cephalosporins block the enzymes that build it.', ['prokaryotic-cells', 'antibiotic-resistance', 'microscopy']],
      ['membrane', 'Plasma membrane', '#c9803c', '<rect x="58" y="104" width="284" height="92" rx="46"/>', 'A bacterium has no mitochondria: respiration and photosynthesis run on this membrane, which also holds the flagellar motors and the transporters that feed the cell.', ['membrane-structure', 'microbial-metabolism']],
      ['cyto', 'Cytoplasm', '#f2ead0', '<rect x="62" y="108" width="276" height="84" rx="42"/>', 'No membrane-bound compartments: transcription and translation happen side by side, and ribosomes can start reading a message before it is finished.', ['prokaryotic-cells', 'transcription', 'translation']],
      ['nucleoid', 'Nucleoid', '#6a5acd', '<path style="fill-opacity:.25;stroke:var(--c);stroke-width:2.5" d="M150 140c20-24 40 16 60-6s40 18 50 4c10-12 20 20 0 26s-30-14-50 4-40-16-56 2-24-16-4-30z"/>', 'The single circular chromosome, packed into a region without a membrane. In a typical gut bacterium it is about 4.6 million base pairs — over a millimetre of DNA in a cell 2 µm long.', ['prokaryotic-cells', 'dna-structure', 'dna-replication']],
      ['plasmid', 'Plasmids', '#b04f9a', '<circle cx="104" cy="150" r="8" style="fill:none;stroke:var(--c);stroke-width:2.5"/><circle cx="300" cy="136" r="6" style="fill:none;stroke:var(--c);stroke-width:2.5"/>', 'Small extra rings of DNA that copy themselves independently and can pass between cells. They often carry genes for antibiotic resistance, and they are the workhorses of gene cloning.', ['antibiotic-resistance', 'restriction-cloning', 'gmos']],
      ['ribo', 'Ribosomes (70S)', '#2d5f7a', RIB([[90, 130], [96, 172], [130, 120], [132, 178], [200, 118], [236, 180], [276, 120], [284, 174], [320, 160], [180, 176]]), 'Smaller than the 80S ribosomes of eukaryotes and built differently — which is why antibiotics such as tetracyclines and macrolides can block them without stopping ours.', ['nucleus-ribosomes', 'translation', 'antibiotic-resistance']]
    ] }
  };
  function cExplorer(el) {
    let kind = 'animal';
    el.innerHTML = '<div class="toolbar">' + Object.entries(CELLS).map(([k, c]) => '<button class="chip' + (k === kind ? ' on' : '') + '" data-k="' + k + '">' + c.name + '</button>').join('') +
      '<span class="small muted">Click a part for what it does.</span></div><div class="bodygrid"><div class="bodyfig boxy"></div><div class="bodycard boxy"></div></div>';
    const fig = ui.$('.bodyfig', el), card = ui.$('.bodycard', el);
    const known = id => H.nodes.has(id) || (H.catalogs && H.catalogs.biology && H.catalogs.biology.has(id));
    const draw = () => {
      const c = CELLS[kind], [sx, sy, sw, st] = c.scale;
      fig.innerHTML = '<svg viewBox="0 0 420 318" role="img" aria-label="' + esc(c.name) + '">' + c.parts.map(p => '<g class="organ" data-o="' + p[0] + '" style="--c:' + p[2] + ';fill:var(--c)" tabindex="0" role="button" aria-label="' + esc(p[1]) + '"><title>' + esc(p[1]) + '</title>' + p[3] + '</g>').join('') +
        '<g style="stroke:var(--text,#333);stroke-width:2"><path d="M' + sx + ' ' + sy + 'h' + sw + '"/></g><text x="' + (sx + sw / 2) + '" y="' + (sy - 5) + '" text-anchor="middle" style="font-size:11px;fill:currentColor">' + st + '</text></svg>' +
        '<div class="small faint" style="text-align:center">A diagram, not to scale; the bar gives the rough size of the whole.</div>';
      show(c.parts.find(p => p[0] === 'nucleus' || p[0] === 'nucleoid')[0]);
    };
    const show = id => {
      const p = CELLS[kind].parts.find(x => x[0] === id); if (!p) return;
      fig.querySelectorAll('[data-o]').forEach(g => g.classList.toggle('sel', g.dataset.o === id));
      const links = p[5].filter(known).map(c => '<a class="chip" href="#/c/' + c + '">' + esc(H.titleOf(c)) + '</a>').join(' ');
      card.innerHTML = '<div class="small muted"><i class="sdot" style="background:' + p[2] + '"></i>' + esc(CELLS[kind].name) + '</div><h3 style="margin:4px 0 8px;font:650 24px var(--font-display)">' + esc(p[1]) + '</h3><p>' + esc(p[4]) + '</p>' +
        (links ? '<div class="small muted mt">Read more</div><div class="row" style="flex-wrap:wrap;gap:6px;margin-top:6px">' + links + '</div>' : '');
    };
    fig.addEventListener('click', e => { const g = e.target.closest('[data-o]'); if (g) show(g.dataset.o); });
    fig.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { const g = e.target.closest('[data-o]'); if (g) { e.preventDefault(); show(g.dataset.o); } } });
    el.querySelectorAll('[data-k]').forEach(b => b.onclick = () => { kind = b.dataset.k; el.querySelectorAll('[data-k]').forEach(x => x.classList.toggle('on', x === b)); draw(); });
    draw();
  }
  const CELL = [['explorer', 'Cell explorer'], ['growth', 'Microbial growth'], ['enzyme', 'Enzyme kinetics'], ['predator', 'Predator & prey'], ['competition', 'Competition'], ['ecology', 'Diversity & sampling'], ['scale', 'Size & metabolism']];
  function cell(el, params, sub) {
    const T = subtabs(el, 'cell', CELL, sub, 'Simple models for learning: real cells, microbes and ecosystems are messier, and that is part of what makes them interesting.');
    ({ explorer: cExplorer, growth: cGrowth, enzyme: cEnzyme, predator: cPredator, competition: cCompete, ecology: cEcology, scale: cScale })[T.tab](T.body);
  }
  function cGrowth(el) {
    const L = layout(el, 'A culture of bacteria in fresh medium: a lag while the cells adjust, exponential growth at a fixed doubling time, a stationary phase when food runs short or waste builds up, then death. On a log scale the exponential phase is a straight line.' + link('bacterial-growth') + link('population-growth') + link('aseptic-technique'));
    const pl = plotIn(L.plot, { x: { label: 'time (h)', min: 0 }, y: { label: 'cells per mL', log: true } }, 260);
    const read = form(L.form, [['N0', 'Starting density', 1e4, 'q', ['numberdensity', '1/mL']], ['td', 'Doubling time', 20, 'q', ['time', 'min']], ['lag', 'Lag phase', 1.5, 'q', ['time', 'h']],
      ['K', 'Maximum density', 2e9, 'q', ['numberdensity', '1/mL']], ['stat', 'Stationary phase lasts', 8, 'q', ['time', 'h']], ['kd', 'Death rate afterwards', 0.3, 'q', ['rate', '1/h']], ['T', 'Show', 36, 'q', ['time', 'h']],
      ['s1', 'Plate count', 0, 'sep'], ['col', 'Colonies on the plate', 156, 'n'], ['dil', 'Dilution of the sample plated', '1e-6', 'n'], ['vol', 'Volume spread', 0.1, 'q', ['volume', 'mL']]], v => calc(v));
    function calc(v) {
      const N0 = v.N0 / 1e6, K = v.K / 1e6, mu = Math.LN2 / (v.td / 3600), lag = v.lag / 3600, T = v.T / 3600, st = v.stat / 3600, kd = v.kd * 3600;
      if (!(N0 > 0 && K > N0 && mu > 0 && lag >= 0 && T > 0 && st >= 0 && kd >= 0)) { L.stats.innerHTML = '<p class="muted">Enter positive values, with the maximum above the start.</p>'; return; }
      const g = t => B().growthCurve({ N0, mu, K, lag, t });
      const t99 = lag + Math.log(99 * (K - N0) / N0) / mu;                         // logistic growth reaches 99 % of K
      const N = t => t < t99 + st ? g(t) : g(t99 + st) * Math.exp(-kd * (t - t99 - st)), pts = [];
      for (let i = 0; i <= 600; i++) { const t = T * i / 600; pts.push([t, N(t)]); }
      const cfu = B().cfu(v.col, v.dil, v.vol * 1e6);
      L.stats.innerHTML = stat('Growth rate μ', n3(mu, 3) + ' per hour', 'ln 2 / doubling time; ' + n3(60 / (v.td / 60), 3) + ' generations an hour') +
        stat('Doublings to the maximum', n3(Math.log2(K / N0), 3), 'log₂(maximum/start)') + stat('Stationary phase from', n3(t99, 3) + ' h', 'the time to reach 99 % of the maximum', 'big') +
        stat('Plate count', n3(cfu, 3) + ' CFU/mL', 'colonies ÷ (dilution × volume)' + (v.col < 30 || v.col > 300 ? '; counts outside 30–300 are less reliable' : ''), v.col < 30 || v.col > 300 ? 'bad' : '');
      pl.set({ series: [{ pts, label: 'viable cells', fill: true }], vlines: [{ x: lag, label: 'lag ends' }, { x: t99, label: 'stationary' }, { x: t99 + st, label: 'death' }].filter(x => x.x <= T), y: { label: 'cells per mL', log: true, min: Math.min(N0, pts[pts.length - 1][1]) / 3, max: K * 3 } });
    }
    calc(read());
  }
  const INHIB = [['none', 'no inhibitor'], ['competitive', 'competitive (binds the free enzyme at the active site)'], ['uncompetitive', 'uncompetitive (binds only the enzyme–substrate complex)'], ['noncompetitive', 'non-competitive (binds either, equally)'], ['mixed', 'mixed (binds either, unequally)']];
  function cEnzyme(el) {
    const L = layout(el, 'Michaelis–Menten kinetics: the rate rises with substrate and levels off at V_max, reaching half of it at [S] = K_m. Inhibitors change the curve in tell-tale ways that the double-reciprocal (Lineweaver–Burk) plot makes easy to see: competitive lines meet on the y-axis, uncompetitive ones run parallel, non-competitive ones meet on the x-axis.' + link('enzyme-kinetics') + link('enzyme-inhibition') + link('enzyme-regulation'));
    const pv = plotIn(L.plot, { x: { label: '[S] (mM)', min: 0 }, y: { label: 'rate v (µM/s)', min: 0 } }, 230);
    const pl = plotIn(L.plot, { x: { label: '1/[S] (1/mM)' }, y: { label: '1/v (s/µM)' } }, 210);
    const read = form(L.form, [['Vmax', 'V_max', 50, 'n', 'µM/s'], ['Km', 'K_m', 2, 'q', ['concentration', 'mM']], ['E0', 'Enzyme concentration', 10, 'q', ['concentration', 'nM']],
      ['type', 'Inhibitor', 'competitive', 'sel', INHIB], ['I', 'Inhibitor concentration', 1, 'q', ['concentration', 'mM']], ['Ki', 'Kᵢ (free enzyme)', 0.5, 'q', ['concentration', 'mM']], ['Kii', 'Kᵢ′ (enzyme–substrate, mixed only)', 2, 'q', ['concentration', 'mM']],
      ['n', 'Hill coefficient, for comparison', 2.5, 'n']], v => calc(v));
    function calc(v) {
      if (!(v.Vmax > 0 && v.Km > 0 && v.Ki > 0 && v.I >= 0)) { L.stats.innerHTML = '<p class="muted">Enter positive values.</p>'; return; }
      const o = { type: v.type, I: v.type === 'none' ? 0 : v.I, Ki: v.Ki, Kii: v.type === 'mixed' ? v.Kii : undefined };
      const a = 1 + o.I / v.Ki, b = 1 + o.I / (o.Kii || v.Ki);
      const app = { none: [v.Vmax, v.Km], competitive: [v.Vmax, v.Km * a], uncompetitive: [v.Vmax / b, v.Km / b], noncompetitive: [v.Vmax / a, v.Km], mixed: [v.Vmax / b, v.Km * a / b] }[v.type];
      const kcat = v.Vmax * 1e-3 / v.E0, eff = kcat / (v.Km * 1e-3);
      L.stats.innerHTML = stat('Apparent V_max', n3(app[0], 4) + ' µM/s', v.type === 'none' ? '' : 'without inhibitor ' + n3(v.Vmax, 4)) + stat('Apparent K_m', n3(app[1], 4) + ' mM', v.type === 'none' ? '' : 'without inhibitor ' + n3(v.Km, 4), 'big') +
        stat('Turnover number k_cat', n3(kcat, 4) + ' per second', 'V_max / [E]₀: substrate molecules per enzyme per second') + stat('Catalytic efficiency', n3(eff, 3) + ' M⁻¹s⁻¹', 'k_cat/K_m; diffusion limits it to about 10⁸–10⁹');
      const Smax = 10 * Math.max(v.Km, app[1]), S = [], without = [], withI = [], hill = [];
      for (let i = 1; i <= 200; i++) { const s = Smax * i / 200; without.push([s, B().mm(s, v.Vmax, v.Km)]); withI.push([s, B().mm(s, v.Vmax, v.Km, o)]); hill.push([s, B().hill(s, v.Vmax, v.Km, v.n > 0 ? v.n : 1)]); }
      pv.set({ series: [{ pts: without, label: 'no inhibitor' }].concat(v.type === 'none' ? [] : [{ pts: withI, label: 'with inhibitor', dash: [6, 4] }]).concat([{ pts: hill, label: 'cooperative, n = ' + n3(v.n, 3), dash: [2, 3] }]),
        hlines: [{ y: v.Vmax, label: 'V_max' }], vlines: [{ x: v.Km, label: 'K_m' }] });
      const lb = (Vm, Km) => { const xs = [-1.2 / Km, 4 / Math.min(v.Km, app[1])]; return xs.map(x => [x, (Km * x + 1) / Vm]); };
      pl.set({ series: [{ pts: lb(v.Vmax, v.Km), label: 'no inhibitor' }].concat(v.type === 'none' ? [] : [{ pts: lb(app[0], app[1]), label: 'with inhibitor', dash: [6, 4] }]), vlines: [{ x: 0 }], hlines: [{ y: 0 }] });
    }
    calc(read());
  }
  function cPredator(el) {
    const L = layout(el, 'The Lotka–Volterra model: prey grow when predators are scarce, predators multiply when prey are plentiful, and the two cycle with the predator peak lagging behind the prey. In the phase plane each cycle is a closed loop around the balance point.' + link('predator-prey') + link('population-growth'));
    const pt = plotIn(L.plot, { x: { label: 'time (years)', min: 0 }, y: { label: 'population', min: 0 } }, 230);
    const pp = plotIn(L.plot, { x: { label: 'prey', min: 0 }, y: { label: 'predators', min: 0 } }, 230);
    const read = form(L.form, [['x', 'Prey at the start', 40, 'n'], ['y', 'Predators at the start', 9, 'n'], ['a', 'Prey growth rate a', 1, 'n', '1/yr'], ['b', 'Predation rate b', 0.1, 'n'], ['c', 'Conversion into predators c', 0.075, 'n'], ['d', 'Predator death rate d', 1.5, 'n', '1/yr'], ['T', 'Years', 30, 'n']], v => calc(v));
    function calc(v) {
      if (![v.x, v.y, v.a, v.b, v.c, v.d, v.T].every(x => x > 0) || v.T > 500) { L.stats.innerHTML = '<p class="muted">Enter positive values (up to 500 years).</p>'; return; }
      const r = B().lotkaVolterra({ x: v.x, y: v.y, a: v.a, b: v.b, c: v.c, d: v.d, T: v.T, dt: Math.min(0.01, v.T / 5000) }), step = Math.max(1, Math.floor(r.length / 1500)), s = r.filter((_, i) => i % step === 0);
      const xs = v.d / v.c, ys = v.a / v.b, prey = s.map(p => p[1]);
      L.stats.innerHTML = stat('Balance point', f1(xs, 1) + ' prey, ' + f1(ys, 1) + ' predators', 'prey* = d/c, predators* = a/b') + stat('Period of small cycles', n3(2 * Math.PI / Math.sqrt(v.a * v.d), 3) + ' years', '2π/√(ad)', 'big') +
        stat('Prey range', f1(Math.min(...prey), 1) + ' – ' + f1(Math.max(...prey), 1), 'larger swings the further the start from the balance');
      pt.set({ series: [{ pts: s.map(p => [p[0], p[1]]), label: 'prey' }, { pts: s.map(p => [p[0], p[2]]), label: 'predators' }] });
      pp.set({ series: [{ pts: s.map(p => [p[1], p[2]]), label: 'orbit' }], marks: [{ x: xs, y: ys, label: 'balance' }, { x: v.x, y: v.y, label: 'start' }] });
    }
    calc(read());
  }
  function cCompete(el) {
    const L = layout(el, 'Two species share a resource, each growing logistically but held back by the other as well as by itself. The competition coefficients α say how much one individual of the other species counts against the carrying capacity. Stable coexistence needs each species to limit itself more than it limits the other.' + link('competition-niches') + link('population-growth'));
    const pt = plotIn(L.plot, { x: { label: 'time', min: 0 }, y: { label: 'population', min: 0 } }, 230);
    const read = form(L.form, [['x', 'Species 1 at the start', 10, 'n'], ['y', 'Species 2 at the start', 10, 'n'], ['r1', 'Growth rate r₁', 0.9, 'n'], ['r2', 'Growth rate r₂', 0.6, 'n'],
      ['K1', 'Carrying capacity K₁', 500, 'n'], ['K2', 'Carrying capacity K₂', 400, 'n'], ['a12', 'Effect of species 2 on 1, α₁₂', 0.7, 'n'], ['a21', 'Effect of species 1 on 2, α₂₁', 0.6, 'n'], ['T', 'Time', 60, 'n']], v => calc(v));
    function calc(v) {
      if (![v.x, v.y, v.r1, v.r2, v.K1, v.K2, v.T].every(x => x > 0) || v.a12 < 0 || v.a21 < 0 || v.T > 2000) { L.stats.innerHTML = '<p class="muted">Enter positive values.</p>'; return; }
      const r = B().competition({ x: v.x, y: v.y, r1: v.r1, r2: v.r2, K1: v.K1, K2: v.K2, a12: v.a12, a21: v.a21, T: v.T, dt: Math.min(0.01, v.T / 5000) }), step = Math.max(1, Math.floor(r.length / 1500)), s = r.filter((_, i) => i % step === 0);
      const c1 = v.a12 < v.K1 / v.K2, c2 = v.a21 < v.K2 / v.K1, den = 1 - v.a12 * v.a21;
      const out = c1 && c2 ? 'stable coexistence' : !c1 && !c2 ? 'one wins, depending on the start' : c1 ? 'species 1 wins' : 'species 2 wins';
      L.stats.innerHTML = stat('Prediction', out, 'α₁₂ ' + (c1 ? '<' : '≥') + ' K₁/K₂ = ' + n3(v.K1 / v.K2, 3) + ' and α₂₁ ' + (c2 ? '<' : '≥') + ' K₂/K₁ = ' + n3(v.K2 / v.K1, 3), 'big') +
        (c1 && c2 ? stat('Coexistence point', f1((v.K1 - v.a12 * v.K2) / den, 0) + ' and ' + f1((v.K2 - v.a21 * v.K1) / den, 0), 'N₁* = (K₁ − α₁₂K₂)/(1 − α₁₂α₂₁), and likewise N₂*') : '') +
        stat('At the end', f1(s[s.length - 1][1], 0) + ' and ' + f1(s[s.length - 1][2], 0), 'species 1 and species 2');
      pt.set({ series: [{ pts: s.map(p => [p[0], p[1]]), label: 'species 1' }, { pts: s.map(p => [p[0], p[2]]), label: 'species 2' }], hlines: [{ y: v.K1, label: 'K₁' }, { y: v.K2, label: 'K₂' }] });
    }
    calc(read());
  }
  function cEcology(el) {
    el.innerHTML = '<p class="muted" style="margin:0 0 12px">Two communities with the same species can differ in diversity: the Shannon index H counts both how many species there are and how evenly the individuals are shared among them; Simpson\'s index is the chance that two individuals picked at random belong to different species. Below, estimating a population by marking and recapturing.' +
      link('biodiversity') + link('statistics-bio') + '</p><div class="mgrid"><div class="boxy mform"></div><div class="mout"><div class="mstats"></div><div class="mplot"></div><div class="mextra"></div></div></div>';
    const fEl = ui.$('.mform', el), stats = ui.$('.mstats', el), extra = ui.$('.mextra', el);
    const readA = dataBox(fEl, 'Community A: individuals per species', '25\n25\n25\n25', 6, () => calc());
    const readB = dataBox(fEl, 'Community B: individuals per species', '85\n5\n5\n5', 6, () => calc());
    const mr = document.createElement('div'); mr.className = 'mform'; fEl.appendChild(mr);
    const read = form(mr, [['s1', 'Mark and recapture', 0, 'sep'], ['M', 'Marked and released', 50, 'n'], ['C', 'Caught the second time', 60, 'n'], ['R', 'Of them already marked', 12, 'n']], () => calc());
    const pl = plotIn(ui.$('.mplot', el), { x: { label: 'species rank', min: 0.5 }, y: { label: 'share of individuals (%)', min: 0 } }, 200);
    function calc() {
      const one = (name, rows) => { const c = rows.map(r => r[0]).filter(x => x >= 0); if (!c.some(x => x > 0)) return ['', null]; const s = B().shannon(c); return [stat(name, 'H = ' + f1(s.H, 3), s.S + ' species · evenness ' + f1(s.E, 3) + ' · Simpson 1 − D = ' + f1(B().simpson(c), 3)), c]; };
      const [ha, ca] = one('Community A', readA()), [hb, cb] = one('Community B', readB()), v = read();
      const lp = v.R > 0 ? v.M * v.C / v.R : NaN, ch = (v.M + 1) * (v.C + 1) / (v.R + 1) - 1, se = Math.sqrt((v.M + 1) * (v.C + 1) * (v.M - v.R) * (v.C - v.R) / ((v.R + 1) ** 2 * (v.R + 2)));
      stats.innerHTML = ha + hb;
      extra.innerHTML = '<div class="mstats">' + (v.R <= v.C && v.R <= v.M && v.M > 0 && v.C > 0 ? stat('Lincoln–Petersen', n3(lp, 4), 'N = M·C/R') + stat('Chapman estimate', f1(ch, 0) + ' ± ' + f1(1.96 * se, 0), 'less biased when R is small; ± about 95 %', 'big') : stat('Mark and recapture', '—', 'the recaptured marked animals cannot outnumber the marked or the caught', 'bad')) + '</div>';
      const rank = c => c ? c.slice().sort((x, y) => y - x).map((x, i, a) => [i + 1, 100 * x / a.reduce((s, y) => s + y, 0)]) : [];
      pl.set({ series: [{ pts: rank(ca), label: 'A', dots: 4 }, { pts: rank(cb), label: 'B', dots: 4 }] });
    }
    calc();
  }
  // [name, mass kg] for the metabolic-scaling plot; [name, size m] for the scale of life
  const ANIMALS = [['mouse', 0.02], ['rat', 0.3], ['cat', 4], ['dog', 20], ['human', 70], ['horse', 500], ['elephant', 4000]];
  const SIZES = [['water molecule', 3e-10], ['glucose', 1e-9], ['a protein', 5e-9], ['ribosome', 2.5e-8], ['a virus', 1e-7], ['bacterium', 2e-6], ['red blood cell', 8e-6], ['animal cell', 2e-5], ['plant cell', 5e-5], ['human egg', 1.2e-4], ['amoeba', 5e-4], ['ant', 5e-3], ['mouse', 8e-2], ['human', 1.7], ['blue whale', 30], ['giant sequoia', 90]];
  function cScale(el) {
    const L = layout(el, 'Why cells are small and elephants are frugal. Diffusion time grows with the square of distance, so it is quick across a cell and hopeless across a hand; and an animal\'s resting metabolic rate grows only as its mass to the ¾ power (Kleiber\'s law), so a gram of mouse burns far more than a gram of elephant.' + link('scaling-allometry') + link('diffusion-osmosis') + link('microscopy'));
    let last = null;
    const bar = canvasIn(L.plot, 170, (c, w) => {
      const C = ui.colors(), x0 = 16, x1 = w - 16, lo = -10, hi = 2.3, X = m => x0 + (x1 - x0) * (Math.log10(m) - lo) / (hi - lo), y = 100;
      [['electron microscope', 1e-10, 2e-7], ['light microscope', 2e-7, 1e-4], ['the naked eye', 1e-4, 200]].forEach(([t, a, b], i) => { c.fillStyle = C.hue([200, 140, 40][i], 0.18); c.fillRect(X(a), y + 16, X(b) - X(a), 16); c.fillStyle = C.muted; c.font = '10.5px ' + font(); c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(t, (X(a) + X(b)) / 2, y + 24); });
      c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
      c.textBaseline = 'top'; c.fillStyle = C.faint; c.font = '10.5px ' + font();
      [['1 nm', 1e-9], ['1 µm', 1e-6], ['1 mm', 1e-3], ['1 m', 1]].forEach(([t, m]) => { c.fillText(t, X(m), y + 36); c.beginPath(); c.moveTo(X(m), y - 3); c.lineTo(X(m), y + 3); c.stroke(); });
      SIZES.forEach(([t, m], i) => { c.fillStyle = C.series[i % C.series.length]; c.beginPath(); c.arc(X(m), y, 3.5, 0, 7); c.fill(); c.save(); c.translate(X(m), y - 8); c.rotate(-Math.PI / 3); c.textAlign = 'left'; c.textBaseline = 'middle'; c.fillStyle = C.text; c.fillText(t, 0, 0); c.restore(); });
      if (last) { c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(X(last), y - 10); c.lineTo(X(last), y + 10); c.stroke(); }
    });
    const pk = plotIn(L.plot, { x: { label: 'body mass (kg)', log: true }, y: { label: 'resting metabolic rate (W)', log: true } }, 230);
    const read = form(L.form, [['x', 'Distance', 10, 'q', ['length', 'µm']], ['D', 'Diffusion coefficient', 1000, 'n', 'µm²/s'], ['s1', 'Kleiber\'s law', 0, 'sep'], ['m', 'Body mass', 70, 'q', ['mass', 'kg']]], v => calc(v));
    function calc(v) {
      if (!(v.x > 0 && v.D > 0 && v.m > 0)) { L.stats.innerHTML = '<p class="muted">Enter positive values.</p>'; return; }
      const t = B().diffusionTime(v.x, v.D * 1e-12, 3), P = B().kleiber(v.m);
      last = v.x; bar.paint();
      L.stats.innerHTML = stat('Diffusion time', t < 60 ? n3(t, 3) + ' s' : t < 86400 ? n3(t / 3600, 3) + ' h' : n3(t / 86400, 3) + ' days', 'x²/6D in three dimensions; a small molecule in water has D ≈ 1000 µm²/s, a protein about 100', 'big') +
        stat('Surface to volume', n3(6 / (v.x * 1e6), 3) + ' per µm', 'for a sphere of this diameter: 6/d — it falls as cells grow') +
        stat('Resting metabolic rate', n3(P, 4) + ' W', '3.4 M^0.75 (M in kg), ≈ ' + n3(P * 86.4, 4) + ' kJ a day') + stat('Per kilogram', n3(P / v.m, 3) + ' W/kg', 'a mouse runs at ' + n3(B().kleiber(0.02) / 0.02, 3) + ' W/kg, an elephant at ' + n3(B().kleiber(4000) / 4000, 3));
      const line = [], iso = []; for (let i = 0; i <= 60; i++) { const m = Math.pow(10, -2 + 6 * i / 60); line.push([m, B().kleiber(m)]); iso.push([m, B().kleiber(70) * m / 70]); }
      pk.set({ series: [{ pts: line, label: 'Kleiber: ∝ M^¾' }, { pts: iso, label: 'if it grew in proportion to mass', dash: [6, 4] }, { pts: ANIMALS.map(([, m]) => [m, B().kleiber(m)]), line: false, dots: 4, label: 'mouse → elephant' }],
        marks: [{ x: v.m, y: P, label: 'this animal' }] });
    }
    calc(read());
  }

  H.bioTools = { sequence, genetics, cell, CELLS, fragments, maxPairing };
})();
