/* The Puzzle Cabinet · engines/visual.js
 *
 * Visual reasoning: complete the matrix, what comes next, odd one out,
 * fold and punch (with mirror images), spot the difference. The figures,
 * rules, scenes and checks live in js/lib/visual-gen.js; this file puts them
 * on the table, takes the answers and explains them afterwards.
 *
 * data (one of):
 *   { kind: 'matrix', lay, grid: [8 figures], rules: { attr: rule }, opts: [figures], ans }
 *   { kind: 'next',   lay, seq: [figures], rules, opts, ans }
 *   { kind: 'odd',    type, figs: [...], ans }
 *   { kind: 'fold',   folds: [[px, py, qx, qy, side]], punch: [[x, y, shape, angle]], opts: [hole lists], ans }
 *   { kind: 'mirror', n, cells: [[row, col, colour]], axis: 'v' | 'h', opts: [cell lists], ans }
 *   { kind: 'spot',   theme, seed, k, lv }      (the scene is rebuilt from its seed)
 * verify() re-derives the one answer every time.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const LET = 'ABCDEFGHIJ';
  const VG = () => C.Visual;
  const TXT = 'font: 600 11px "Segoe UI", system-ui, sans-serif';

  /* ---------- small svg helpers (strings) ---------- */
  const n1 = (v) => Math.round(v * 10) / 10;
  const at = (x, y, inner, sc) => '<g transform="translate(' + n1(x) + ' ' + n1(y) + ')' + (sc ? ' scale(' + sc + ')' : '') + '">' + inner + '</g>';
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ARROW = /^[←-↙]$/;
  const text = (x, y, s, cls, anchor, fill) => '<text x="' + n1(x) + '" y="' + n1(y + (ARROW.test(s) ? 2 : 0)) + '" class="' + (cls || 'vis-t') + (ARROW.test(s) ? ' vis-big' : '') + '" text-anchor="' + (anchor || 'middle') + '"' + (fill ? ' style="fill:' + fill + '"' : '') + '>' + esc(s) + '</text>';
  function cellBox(x, y, key, size) {
    const w = size || 100;
    return '<rect x="' + n1(x) + '" y="' + n1(y) + '" width="' + w + '" height="' + w + '" rx="11" class="vis-cell"' + (key ? ' data-key="' + key + '"' : '') + '/>';
  }
  function qBox(x, y, size) {
    const w = size || 100;
    return '<rect x="' + n1(x + 2) + '" y="' + n1(y + 2) + '" width="' + (w - 4) + '" height="' + (w - 4) + '" rx="10" class="vis-q"/>' + '<text x="' + n1(x + w / 2) + '" y="' + n1(y + w / 2 + 16) + '" class="vis-qm" text-anchor="middle">?</text>';
  }
  function ansBox(x, y) { return '<rect x="' + n1(x - 3) + '" y="' + n1(y - 3) + '" width="106" height="106" rx="13" class="vis-glow"/>'; }

  /* ---------- the picture of one option (answer box, and the '?' once solved) ---------- */
  function optionInner(d, i) {
    const V = VG();
    switch (d.kind) {
      case 'matrix': case 'next': return V.LAY[d.lay].draw(d.opts[i], {});
      case 'odd': return V.oddDraw(d.type, d.figs[i]);
      case 'fold': return V.sheetSVG(d.opts[i], V.creasesOf(d.folds));
      case 'mirror': return V.cellsSVG(d.n, d.opts[i]);
    }
    return '';
  }
  const optionCount = (d) => (d.kind === 'odd' ? d.figs.length : d.opts.length);
  function optionSVG(d, i) { return VG().svgWrap(optionInner(d, i), d.kind === 'fold' ? '-6 -6 112 112' : '-4 -4 108 108'); }

  /* ---------- the stage for each kind: returns { svg, box, cards } ----------
   * st: { narrow, solved, rules (matrix/next: the rows of rules), hl } */

  function stageMatrix(d, st) {
    const V = VG(), lay = V.LAY[d.lay], rows = V.matrixRows(d), act = rows.filter((r) => r.rule.t !== 'const');
    const gx = 12, gy = st.solved ? 18 + 13 * act.length : 12;
    const g9 = d.grid.concat([d.opts[d.ans]]);
    const w = 300 + 2 * gx, h = 300 + 2 * gy + (st.solved ? 13 * act.length + 4 : 0);
    let s = '<rect x="-16" y="-16" width="' + (w + 32) + '" height="' + (h + 32) + '" rx="20" class="vis-card"/>';
    for (let i = 0; i < 9; i++) {
      const x = (i % 3) * (100 + gx), y = Math.floor(i / 3) * (100 + gy);
      if (i === 8 && !st.solved) { s += qBox(x, y); continue; }
      if (i === 8) s += ansBox(x, y);
      s += cellBox(x, y, 'cell' + i);
      const elem = st.solved && act.some((r) => r.at.t === 'set') ? setColours(d, g9, i, act.find((r) => r.at.t === 'set')) : null;
      s += at(x, y, lay.draw(g9[i], elem ? { elem } : {}));
      if (st.solved) act.forEach((r, j) => { if (r.at.t !== 'set') s += text(x + 50, y + 100 + 13 + j * 13, V.capOf(r.at, g9[i][r.at.k]), 'vis-cap', 'middle', V.RCOL[j % V.RCOL.length]); else s += text(x + 50, y + 100 + 13 + j * 13, setCap(r, i), 'vis-cap', 'middle', V.RCOL[j % V.RCOL.length]); });
    }
    return { svg: s, box: { x0: -18, y0: -18, x1: w + 18, y1: h + 18 } };
  }
  // XOR, OR, AND, minus: colour each line or place by where it comes from
  function setColours(d, g9, i, r) {
    const row = Math.floor(i / 3), col = i % 3, k = r.at.k;
    const a = g9[row * 3][k], b = g9[row * 3 + 1][k];
    const t = r.rule.t;
    if (!['xor', 'or', 'and', 'diff'].includes(t)) return null;
    return (e) => {
      const bit = 1 << e, inA = !!(a & bit), inB = !!(b & bit);
      if (col === 0) return inA && inB ? 'var(--purple)' : 'var(--teal)';
      if (col === 1) return inA && inB ? 'var(--purple)' : 'var(--pink)';
      return inA && inB ? 'var(--purple)' : inA ? 'var(--teal)' : 'var(--pink)';
    };
  }
  function setCap(r, i) {
    const col = i % 3;
    if (!['xor', 'or', 'and', 'diff'].includes(r.rule.t)) return col ? '↻' : '';
    return ['first', 'second', { xor: 'only one', or: 'both together', and: 'shared', diff: 'first − second' }[r.rule.t]][col];
  }

  function stageNext(d, st) {
    const V = VG(), lay = V.LAY[d.lay], rows = V.seqRows(d), act = rows.filter((r) => r.rule.t !== 'const');
    const all = d.seq.concat([d.opts[d.ans]]), n = all.length;
    const per = st.narrow ? 3 : n, gx = 30, capH = st.solved ? 13 * act.length + 8 : 0, gy = 26 + capH;
    let s = '';
    const rowsN = Math.ceil(n / per), w = per * 100 + (per - 1) * gx, h = rowsN * 100 + (rowsN - 1) * gy + capH;
    s += '<rect x="-16" y="-16" width="' + (w + 32) + '" height="' + (h + 32) + '" rx="20" class="vis-card"/>';
    for (let i = 0; i < n; i++) {
      const x = (i % per) * (100 + gx), y = Math.floor(i / per) * (100 + gy);
      if (i % per) s += '<path d="M' + n1(x - gx + 9) + ' ' + n1(y + 42) + 'l9 8l-9 8" class="vis-arrow"/>';
      if (i === n - 1 && !st.solved) { s += qBox(x, y); continue; }
      if (i === n - 1) s += ansBox(x, y);
      s += cellBox(x, y, 'frame' + i) + at(x, y, lay.draw(all[i], {}));
      if (st.solved) act.forEach((r, j) => { s += text(x + 50, y + 113 + j * 13, V.seqCap(r.at, all.map((c) => c[r.at.k]), i), 'vis-cap', 'middle', V.RCOL[j % V.RCOL.length]); });
    }
    return { svg: s, box: { x0: -18, y0: -18, x1: w + 18, y1: h + 18 } };
  }

  function stageOdd(d, st) {
    const V = VG(), n = d.figs.length, gx = 22, gy = st.solved ? 40 : 26;
    let s = '';
    const cards = [];
    const w = 3 * 100 + 2 * gx, rowsN = Math.ceil(n / 3), h = rowsN * 100 + (rowsN - 1) * gy + (st.solved ? 18 : 0);
    s += '<rect x="-16" y="-16" width="' + (w + 32) + '" height="' + (h + 32) + '" rx="20" class="vis-card"/>';
    for (let i = 0; i < n; i++) {
      const row = Math.floor(i / 3), inRow = Math.min(3, n - row * 3), off = (3 - inRow) * (100 + gx) / 2;
      const x = off + (i % 3) * (100 + gx), y = row * (100 + gy);
      cards.push([x, y, 100, 100]);
      if (st.solved && i === d.ans) s += ansBox(x, y);
      s += '<g class="vis-pick' + (st.wrong.includes(i) ? ' no' : '') + (st.out.includes(i) ? ' out' : '') + '" data-i="' + i + '">' + cellBox(x, y, 'fig' + i) + at(x, y, V.oddDraw(d.type, d.figs[i], st.solved && d.type === 'sym' && i !== d.ans ? { axis: true } : null)) + '</g>';
      s += '<circle cx="' + n1(x + 13) + '" cy="' + n1(y + 13) + '" r="9" class="vis-badge"/>' + text(x + 13, y + 17, LET[i], 'vis-badget');
      if (st.wrong.includes(i)) s += '<path d="M' + n1(x + 30) + ' ' + n1(y + 30) + 'l40 40m0 -40l-40 40" class="vis-x"/>';
      if (st.solved) s += text(x + 50, y + 115, V.oddCaption(d, i), 'vis-cap', 'middle', i === d.ans ? 'var(--gold)' : 'var(--muted)');
    }
    return { svg: s, box: { x0: -18, y0: -18, x1: w + 18, y1: h + 18 }, cards };
  }

  function stageFold(d, st) {
    const V = VG(), states = V.paperStates(d.folds), nf = d.folds.length;
    const frames = [];
    for (let i = 0; i < nf; i++) frames.push({ svg: V.stateSVG(states[i], null, { fold: d.folds[i] }), cap: nf > 1 ? 'Fold ' + (i + 1) : 'Fold' });
    const punched = d.punch.map((h) => [h[0], h[1], h[2], h[3]]);
    frames.push({ svg: V.stateSVG(states[nf], punched), cap: 'Punch' });
    frames.push(st.solved ? { svg: V.sheetSVG(d.opts[d.ans], V.creasesOf(d.folds)), cap: 'Unfolded', ans: true } : { q: true, cap: 'Unfold?' });
    const per = st.narrow ? 3 : frames.length, gx = 30, gy = 40;
    const rowsN = Math.ceil(frames.length / per);
    let s = '';
    const w = per * 100 + (per - 1) * gx;
    let h = rowsN * 100 + (rowsN - 1) * gy + 18;
    // once solved, the unfolding step by step underneath
    let extra = '';
    if (st.solved) {
      const holes = V.unfoldHoles(d.folds, d.punch);
      const y0 = h + 34;
      extra += text(0, y0 - 12, 'Unfolding, one fold at a time:', 'vis-cap', 'start', 'var(--accent)');
      const steps = [];
      for (let i = nf; i >= 0; i--) steps.push(V.stateSVG(states[i], V.holesAtState(states[i], holes)));
      const per2 = st.narrow ? 3 : steps.length;
      steps.forEach((sv, i) => {
        const x = (i % per2) * (100 + gx), y = y0 + Math.floor(i / per2) * (100 + gy);
        if (i % per2) extra += '<path d="M' + n1(x - gx + 9) + ' ' + n1(y + 42) + 'l9 8l-9 8" class="vis-arrow"/>';
        extra += cellBox(x - 6, y - 6, null, 112) + at(x, y, sv);
      });
      h = y0 + Math.ceil(steps.length / per2) * (100 + gy) - gy;
    }
    s += '<rect x="-20" y="-20" width="' + (w + 40) + '" height="' + (h + 40) + '" rx="20" class="vis-card"/>';
    frames.forEach((f, i) => {
      const x = (i % per) * (100 + gx), y = Math.floor(i / per) * (100 + gy);
      if (i % per) s += '<path d="M' + n1(x - gx + 9) + ' ' + n1(y + 42) + 'l9 8l-9 8" class="vis-arrow"/>';
      if (f.q) s += qBox(x - 6, y - 6, 112);
      else { if (f.ans) s += ansBox(x - 6, y - 6).replace('width="106" height="106"', 'width="118" height="118"'); s += cellBox(x - 6, y - 6, 'frame' + i, 112) + at(x, y, f.svg); }
      s += text(x + 50, y + 122, f.cap, 'vis-cap', 'middle', 'var(--muted)');
    });
    return { svg: s + extra, box: { x0: -22, y0: -22, x1: w + 22, y1: h + 22 } };
  }

  function stageMirror(d, st) {
    const V = VG(), vert = d.axis === 'v';
    let s = '';
    const A = [0, 0], B = vert ? [150, 0] : [0, 150];
    const w = vert ? 250 : 100, h = vert ? 100 : 250;
    s += '<rect x="-18" y="-18" width="' + (w + 36) + '" height="' + (h + 36) + '" rx="20" class="vis-card"/>';
    s += cellBox(A[0], A[1], 'fig') + at(A[0], A[1], V.cellsSVG(d.n, d.cells));
    // the mirror: a silver strip with a shine
    s += vert ? '<rect x="119" y="-10" width="12" height="120" rx="4" class="vis-mirror"/><path d="M123 -4L123 104" class="vis-shine"/>' : '<rect x="-10" y="119" width="120" height="12" rx="4" class="vis-mirror"/><path d="M-4 123L104 123" class="vis-shine"/>';
    if (st.solved) s += ansBox(B[0], B[1]) + cellBox(B[0], B[1]) + at(B[0], B[1], V.cellsSVG(d.n, d.opts[d.ans]));
    else s += qBox(B[0], B[1]);
    return { svg: s, box: { x0: -20, y0: -20, x1: w + 20, y1: h + 20 } };
  }
  const STAGE = { matrix: stageMatrix, next: stageNext, odd: stageOdd, fold: stageFold, mirror: stageMirror };

  /* ---------- hints for the choice kinds: { text, out: [options to cross out] } ---------- */
  function hintList(d) {
    const V = VG();
    const wrongs = range(optionCount(d)).filter((i) => i !== d.ans);
    const half = (seed) => { const r = C.rng(seed); return r.shuffle(wrongs.slice()).slice(0, Math.max(1, Math.floor(wrongs.length / 2))); };
    if (d.kind === 'matrix') return V.ruleHints(d, V.matrixRows(d), (names) => 'Look along the top row: what changes from picture to picture, and what stays the same? Here ' + (names.length ? V.andList(names) + (names.length > 1 ? ' change.' : ' changes.') : 'nothing changes.') + ' Then check that the same thing happens in the second row.');
    if (d.kind === 'next') return V.ruleHints(d, V.seqRows(d), (names) => 'Follow one part of the picture at a time. Here ' + (names.length ? V.andList(names) + (names.length > 1 ? ' change' : ' changes') : 'nothing changes') + ' from each picture to the next.');
    if (d.kind === 'odd') return V.OHINT[d.type].map((t) => ({ text: t, out: [] })).concat([{ text: 'Some of the figures that fit in with the others are crossed out.', out: half('o' + JSON.stringify(d.figs[0])) }]);
    if (d.kind === 'fold') {
      const layers = V.paperStates(d.folds)[d.folds.length].length, want = layers * d.punch.length;
      const bad = range(d.opts.length).filter((i) => d.opts[i].length !== want);
      return [
        { text: 'Count the layers: every fold doubles them, so after ' + d.folds.length + ' fold' + (d.folds.length > 1 ? 's' : '') + ' there are ' + layers + ', and the sheet must have ' + want + ' holes.' + (bad.length ? ' The sheets with another number are crossed out.' : ''), out: bad },
        { text: 'Unfold the last fold first: its crease is a mirror, and every hole gets a twin on the other side of it. Then the fold before that.', out: [] },
        { text: 'Two more wrong sheets are crossed out.', out: half('f' + d.punch.join()) }
      ];
    }
    if (d.kind === 'mirror') return [
      { text: 'A mirror ' + (d.axis === 'v' ? 'swaps left and right, but top stays top' : 'swaps top and bottom, but left stays left') + '. The squares nearest the mirror stay nearest to it.', out: [] },
      { text: 'Some wrong ones are crossed out: they are turned, not reflected.', out: half('m' + d.cells.join()) }
    ];
    return [];
  }
  const range = (n) => Array.from({ length: n }, (_, i) => i);

  // why a wrong pick is wrong, gently
  function whyWrong(d, v) {
    const V = VG();
    if (d.kind === 'matrix' || d.kind === 'next') {
      const lay = V.LAY[d.lay], a = d.opts[d.ans], o = d.opts[v];
      const bad = lay.attrs.filter((x) => o[x.k] !== a[x.k]).map((x) => '**' + x.name + '**');
      return 'Not ' + LET[v] + ': it breaks the rule for the ' + V.andList(bad) + '.';
    }
    if (d.kind === 'odd') return 'Not ' + LET[v] + ': it has what most of the others have. Look for the one that lacks it.';
    if (d.kind === 'fold') {
      const layers = V.paperStates(d.folds)[d.folds.length].length;
      if (d.opts[v].length !== layers * d.punch.length) return 'Not ' + LET[v] + ': count the holes. The paper was ' + layers + ' layers thick when it was punched.';
      return 'Not ' + LET[v] + ': the number of holes is right, but not where they are. Each crease is a mirror.';
    }
    if (d.kind === 'mirror') return 'Not ' + LET[v] + '. Check the square nearest the mirror: it should still be nearest.';
    return 'Not that one.';
  }

  const LABEL = {
    matrix: 'Which picture belongs in the empty square?', next: 'Which picture comes next?', odd: 'Which is the odd one out?',
    fold: 'Which is the sheet when it is unfolded?', mirror: 'Which is the mirror image?'
  };
  const GOAL = {
    matrix: 'Pick the picture that fits the empty square: it must obey every rule of the rows.',
    next: 'Pick the picture that comes next in the sequence.',
    odd: 'Pick the figure that does not belong — on the table or in the panel.',
    fold: 'Pick the unfolded sheet with its holes in the right places.',
    mirror: 'Pick the true mirror image.'
  };

  function mountChoice(ctx, p) {
    const d = p.data, wb = ctx.wb, V = VG();
    const g = ctx.s('g', { class: 'vis vis-' + d.kind }, wb.layer('board'));
    let solved = false, wrong = [], out = [], lastNarrow = wb.isNarrow(), first = true;
    if (!p.goal) ctx.setGoal(GOAL[d.kind]);
    function draw(keep) {
      const L = STAGE[d.kind](d, { narrow: wb.isNarrow(), solved, wrong, out });
      g.innerHTML = L.svg;
      g._cards = L.cards || null;
      wb.setBounds(L.box, 0.05, keep && !first ? { keepView: true } : undefined);
      first = false;
      wb.applyPaints();
    }
    const n = optionCount(d);
    const box = ctx.answer({
      kind: 'choice',
      choices: range(n).map((i) => optionSVG(d, i)),
      label: LABEL[d.kind],
      check: (v) => pick(v)
    });
    box.el.classList.add('vis-ans', 'vis-n' + n);
    const buttons = () => Array.from(box.el.querySelectorAll('.ans-choice'));
    function marks() {
      buttons().forEach((b, i) => {
        b.classList.toggle('vis-no', wrong.includes(i));
        b.classList.toggle('vis-out', out.includes(i) && !wrong.includes(i));
        b.classList.toggle('vis-yes', solved && i === d.ans);
      });
    }
    function pick(v) {
      if (solved) return v === d.ans ? { ok: true } : { ok: false, msg: 'The answer is ' + LET[d.ans] + '.' };
      if (v === d.ans) {
        solved = true;
        draw(true);
        marks();
        const msg = 'Yes, **' + LET[d.ans] + '**!' + (wrong.length ? ' (after ' + wrong.length + ' wrong ' + (wrong.length === 1 ? 'guess' : 'guesses') + ')' : '');
        // each wrong guess costs a star: tell the player before the answer box does
        if (wrong.length) ctx.solved({ msg, stars: Math.max(1, 3 - wrong.length) });
        return { ok: true, msg };
      }
      if (!wrong.includes(v)) wrong.push(v);
      draw(true);
      marks();
      ctx.changed('pick');
      return { ok: false, msg: whyWrong(d, v) + (wrong.length === 1 ? ' Each wrong guess costs a star.' : '') };
    }
    const hints = hintList(d);
    if (d.kind === 'odd') {
      wb.handlers.board = {
        tap(pt) {
          const cards = g._cards || [];
          const i = cards.findIndex(([x, y, w, h]) => pt[0] >= x && pt[0] <= x + w && pt[1] >= y && pt[1] <= y + h);
          if (i >= 0 && buttons()[i]) buttons()[i].click();
        },
        hover(pt) {
          const cards = g._cards || [];
          const i = cards.findIndex(([x, y, w, h]) => pt[0] >= x && pt[0] <= x + w && pt[1] >= y && pt[1] <= y + h);
          g.querySelectorAll('.vis-pick').forEach((el) => el.classList.toggle('hover', +el.dataset.i === i));
        }
      };
    }
    wb.on('layout', () => { if (wb.isNarrow() !== lastNarrow) { lastNarrow = wb.isNarrow(); draw(false); } });
    draw(false);
    marks();

    return {
      noMoves: true,
      hint(k) {
        const h = hints[k];
        if (!h) return null;
        return {
          text: h.text,
          show() { if (h.out && h.out.length) { h.out.forEach((i) => { if (!out.includes(i) && i !== d.ans) out.push(i); }); draw(true); marks(); ctx.changed('hint'); } }
        };
      },
      solve() {
        solved = true;
        draw(true);
        marks();
        box.el.classList.add('done');
        box.feedback('The answer is <b>' + LET[d.ans] + '</b>.', 'good');
      },
      explain() {
        switch (d.kind) {
          case 'matrix': return V.explainMatrix(d);
          case 'next': return V.explainNext(d);
          case 'odd': return V.explainOdd(d);
          case 'fold': return V.explainFold(d);
          case 'mirror': return V.explainMirror(d);
        }
        return '';
      },
      getState() { return { wrong: wrong.slice(), out: out.slice(), solved }; },
      setState(s) {
        // wrong guesses and crossed-out options stay (undo does not buy stars back)
        (s && s.wrong || []).forEach((i) => { if (!wrong.includes(i)) wrong.push(i); });
        (s && s.out || []).forEach((i) => { if (!out.includes(i)) out.push(i); });
        solved = solved || !!(s && s.solved);
        draw(true);
        marks();
      },
      reset() { wrong = []; out = []; solved = false; box.el.classList.remove('done'); box.feedback('', ''); buttons().forEach((b) => b.classList.remove('on')); draw(true); marks(); },
      destroy() { wb.handlers.board = null; }
    };
  }

  /* ---------- spot the difference ---------- */

  let clipSeq = 0;
  function mountSpot(ctx, p) {
    const d = p.data, wb = ctx.wb, V = VG();
    const S = V.buildSpot(d);
    if (!S) { ctx.say('This scene could not be built.', 'warn'); return {}; }
    const W = V.SW, H = V.SH, GAP = 22, cid = 'vis-clip-' + (++clipSeq);
    const allow = 3 + Math.ceil(d.k / 2);
    let found = [], miss = 0, hint = null, first = true, lastNarrow = wb.isNarrow(), fresh = -1;
    if (!p.goal) ctx.setGoal('Find all **' + d.k + '** differences: click each one on either picture.');
    const g = ctx.s('g', { class: 'vis-spot' }, wb.layer('board'));
    const rg = ctx.s('g', { class: 'vis-rings' }, wb.layer('top'));
    const fx = ctx.s('g', { class: 'vis-fx' }, wb.layer('top'));
    const picA = V.sceneSVG(S.A), picB = V.sceneSVG(S.B);
    const offs = () => (wb.isNarrow() ? [[0, 0], [0, H + GAP]] : [[0, 0], [W + GAP, 0]]);
    function draw() {
      const O = offs();
      let s = '';
      [picA, picB].forEach((pic, j) => {
        const [x, y] = O[j];
        s += '<rect x="' + (x - 5) + '" y="' + (y - 5) + '" width="' + (W + 10) + '" height="' + (H + 10) + '" rx="16" class="vis-scenebg"/>';
        s += '<svg x="' + x + '" y="' + y + '" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '">' +
          (j ? '' : '<defs><clipPath id="' + cid + '"><rect width="' + W + '" height="' + H + '" rx="12"/></clipPath></defs>') +
          '<g clip-path="url(#' + cid + ')">' + pic + '</g></svg>';
        s += '<rect x="' + x + '" y="' + y + '" width="' + W + '" height="' + H + '" rx="12" class="vis-sceneframe"/>';
      });
      g.innerHTML = s;
      const b = O[1];
      wb.setBounds({ x0: -8, y0: -8, x1: b[0] + W + 8, y1: b[1] + H + 8 }, 0.03, first ? undefined : { keepView: true });
      first = false;
      rings();
    }
    function rings() {
      const O = offs();
      let s = '';
      if (hint && !found.includes(hint.i)) O.forEach(([x, y]) => { s += '<circle cx="' + n1(x + hint.x) + '" cy="' + n1(y + hint.y) + '" r="' + n1(hint.r) + '" class="vis-hintc"/>'; });
      found.forEach((i) => {
        const c = S.diffs[i].c;
        O.forEach(([x, y]) => { s += '<g class="vis-ring' + (i === fresh ? ' new' : '') + '"><circle cx="' + n1(x + c[0]) + '" cy="' + n1(y + c[1]) + '" r="' + n1(c[2] + 3) + '" class="halo"/><circle cx="' + n1(x + c[0]) + '" cy="' + n1(y + c[1]) + '" r="' + n1(c[2] + 3) + '" class="ring"/></g>'; });
      });
      rg.innerHTML = s;
      fresh = -1;
      ctx.stat('Found', found.length + ' of ' + d.k);
      ctx.stat('Misses', miss > allow ? miss + ' (costing stars)' : miss + ' of ' + allow + ' free');
    }
    function missAt(pt) {
      const r = wb.px(9);
      const el = ctx.s('path', { d: 'M' + n1(pt[0] - r) + ' ' + n1(pt[1] - r) + 'L' + n1(pt[0] + r) + ' ' + n1(pt[1] + r) + 'M' + n1(pt[0] + r) + ' ' + n1(pt[1] - r) + 'L' + n1(pt[0] - r) + ' ' + n1(pt[1] + r), class: 'vis-miss', 'stroke-width': n1(wb.px(3.5)) }, fx);
      setTimeout(() => el.remove(), 1100);
    }
    wb.handlers.board = {
      tap(pt) {
        if (found.length >= d.k) return;
        const O = offs();
        let lp = null;
        O.forEach(([x, y]) => { if (pt[0] >= x && pt[0] <= x + W && pt[1] >= y && pt[1] <= y + H) lp = [pt[0] - x, pt[1] - y]; });
        if (!lp) return;
        let hit = -1, best = Infinity;
        S.diffs.forEach((df, i) => { const dd = Math.hypot(lp[0] - df.c[0], lp[1] - df.c[1]); if (dd <= df.c[2] + wb.px(6) && dd < best) { best = dd; hit = i; } });
        if (hit >= 0 && found.includes(hit)) { ctx.toast('Already found — it has a ring.'); return; }
        if (hit >= 0) {
          found.push(hit);
          fresh = hit;
          if (hint && hint.i === hit) hint = null;
          ctx.sfx('snap');
          rings();
          ctx.say(S.diffs[hit].what + (found.length < d.k ? ' ' + (d.k - found.length) + ' to go.' : ''), 'good');
          ctx.changed('found');
          return;
        }
        miss++;
        ctx.sfx('wrong');
        missAt(pt);
        if (miss === allow + 1) ctx.toast('Careful: from now on misses cost stars.');
        rings();
        ctx.changed('miss');
      }
    };
    wb.on('layout', () => { if (wb.isNarrow() !== lastNarrow) { lastNarrow = wb.isNarrow(); first = true; draw(); } });
    draw();

    return {
      noMoves: true,
      checkLabel: 'How many left?',
      check() {
        if (found.length >= d.k) {
          const stars = miss <= allow ? 3 : miss <= 2 * allow ? 2 : 1;
          return { solved: true, stars, msg: 'All ' + d.k + ' differences found' + (miss ? ', with ' + miss + ' miss' + (miss === 1 ? '' : 'es') + '.' : ' without a single miss!'), perfect: !miss };
        }
        return { solved: false, msg: (d.k - found.length) + ' difference' + (d.k - found.length === 1 ? '' : 's') + ' still to find.' };
      },
      hint(k) {
        const left = S.diffs.map((_, i) => i).filter((i) => !found.includes(i));
        if (!left.length) return null;
        const i = left[k % left.length], c = S.diffs[i].c, rng = C.rng(p.id + ':h' + k);
        const R = Math.max(c[2] * 2.3, 44), off = (R - c[2] - 4) * rng(), a = rng() * Math.PI * 2;
        const hx = Math.max(R * .4, Math.min(W - R * .4, c[0] + Math.cos(a) * off)), hy = Math.max(R * .4, Math.min(H - R * .4, c[1] + Math.sin(a) * off));
        return {
          text: k < d.k ? 'There is a difference inside the dashed circle (on both pictures).' : 'Still hunting? Another circle: look there.',
          show() { hint = { i, x: n1(hx), y: n1(hy), r: n1(R) }; rings(); ctx.changed('hint'); }
        };
      },
      solve() {
        const left = S.diffs.map((_, i) => i).filter((i) => !found.includes(i));
        let j = 0;
        const step = () => {
          if (j >= left.length) { ctx.changed('solve'); return; }
          fresh = left[j];
          found.push(left[j++]);
          rings();
          setTimeout(step, C.anim(380));
        };
        step();
      },
      explain() { return V.explainSpot(d, S); },
      getState() { return { found: found.slice(), miss, hint }; },
      setState(s) {
        (s && s.found || []).forEach((i) => { if (!found.includes(i) && i < d.k) found.push(i); });
        miss = Math.max(miss, (s && s.miss) || 0);
        if (s && s.hint) hint = s.hint;
        rings();
      },
      reset() { found = []; miss = 0; hint = null; rings(); },
      destroy() { wb.handlers.board = null; }
    };
  }

  /* ---------- titles and statements ---------- */

  const TITLES = {
    matrix: {
      many: ['Counting Rows', 'In Good Order', 'A Growing Crowd', 'Heads and Tallies', 'The Tally Grid', 'Dots and Dashes', 'Crowds of Shapes', 'Sums in Shapes', 'The Head Count', 'Many Hands'],
      one: ['Shapes and Shades', 'Three of a Kind', 'The Shape Sorter', 'Grey Areas', 'Small, Medium, Large', 'Black and White', 'The Wardrobe', 'Dress Rehearsal', 'Mixed Company', 'The Lineup'],
      poly: ['Counting Corners', 'One More Side', 'Polygon Parade', 'Corners and Colours', 'The Side Show', 'Edges Up', 'The Polygon Ladder', 'Sides Story'],
      nest: ['Nesting Boxes', 'Inside Out', 'Shape in a Shape', 'Russian Dolls', 'The Inner Circle', 'Snug Fits', 'Framed', 'Boxed In'],
      dotsin: ['Dots in Frames', 'Spots and Outlines', 'Pips and Frames', 'The Dotted Box', 'Seeds in Pods', 'Buttons', 'Freckles'],
      glyph: ['Turning Arrows', 'Which Way Now?', 'The Weathervane', 'Pointing the Way', 'Signposts', 'Compass Points', 'The Spinner', 'About Turn'],
      clock: ['Clockwork', 'Two Hands', 'Hands of Time', 'Tick Tock', 'The Dial', 'Round the Clock', 'Time and Again'],
      grid: ['Places, Please', 'Musical Chairs', 'The Seating Plan', 'Noughts and Shapes', 'Who Sits Where', 'Shifting Seats', 'Pattern of Places', 'The Guest List'],
      lines: ['Lines That Cancel', 'Crossed Lines', 'Strokes of Luck', 'Line by Line', 'Overlays', 'Tracing Paper', 'The Stencil', 'Ghost Lines']
    },
    next: {
      many: ['Growing Crowd', 'Counting On', 'More or Less', 'The Tally', 'Headcount'],
      one: ['Round and Round', 'Taking Turns', 'The Parade', 'Changing Shape', 'Costume Change'],
      poly: ['One More Corner', 'Side by Side', 'Sides Up', 'Corner Shop', 'The Next Polygon'],
      glyph: ['Turn, Turn, Turn', 'The Spinning Arrow', 'Which Way Next?', 'Pirouette', 'The Weathercock'],
      clock: ['What Time Next?', 'Racing Hands', 'Two Speeds', 'The Odd Clock', 'Clock Watching'],
      ring1: ['The Wandering Dot', 'Round the Edge', 'Laps', 'The Patrol', 'Hopscotch'],
      ring2: ['Chase', 'Two Runners', 'Cat and Mouse', 'The Relay', 'Dodgems'],
      grid: ['Quarter Turns', 'The Turning Pattern', 'Spin Cycle', 'Revolving Door'],
      lines: ['Turning Lines', 'The Windmill', 'Rotor', 'Spokes']
    },
    odd: {
      same: ['Odd Couple', 'Not Like the Others', 'Mismatched', 'The Stranger Inside', 'Wrong Filling'],
      sides: ['Count the Corners', 'The Extra Side', 'Side Issue', 'Cornered', 'Shape Shifters'],
      sidepar: ['Odd Sides', 'Evens and Odds', 'An Odd Number', 'Side Parity'],
      sym: ['Mirror, Mirror', 'Fold in Half', 'The Lopsided One', 'Balance', 'Out of True'],
      count: ['Head Count', 'Squares Shaded', 'Filling In', 'Count the Squares', 'Patchwork'],
      parity: ['Odd One, Oddly', 'Even Stevens', 'Pairs and Spares', 'Shades of Even'],
      pie: ['Slices', 'Pie Chart', 'Pizza Night', 'Cake Share', 'Portions'],
      chiral: ['Left or Right?', 'Flipped', 'The Wrong Hand', 'Turned or Flipped?', 'Looking-Glass Piece'],
      dotsides: ['Dots and Sides', 'Hidden Count', 'Counting Twice', 'Pips and Corners', 'The Tally Mark']
    },
    spot: {
      village: ['A Walk in the Village', 'Sunday Afternoon', 'Down the Lane', 'Apple Time', 'The Green', 'Village Gossip', 'Sheep May Safely Graze', 'Letters Home'],
      harbour: ['The Harbour', 'Sails at Noon', 'By the Lighthouse', 'Gone Fishing', 'Harbour Lights', 'Plain Sailing', 'Seagull Watch'],
      room: ['The Sitting Room', 'Tea Time', 'The Cat\'s Chair', 'Quiet Afternoon', 'Fruit Bowl', 'Reading Corner', 'Tick Tock Room'],
      tiles: ['The Tiled Floor', 'Mosaic', 'Tile Trouble', 'The Tiler\'s Slip', 'Checkerboard', 'Pattern Book']
    },
    fold: ['Fold and Punch', 'Paper Snowflake', 'The Hole Story', 'Through and Through', 'Holes in One', 'Punch Line', 'Fold, Punch, Open', 'Mirror Folds', 'Pinholes', 'Paper Lace'],
    mirror: ['In the Looking-Glass', 'Mirror Image', 'The Reflection', 'Pond Picture', 'Looking-Glass Tiles', 'Reversed']
  };
  function titlePool(d) {
    if (d.kind === 'matrix' || d.kind === 'next') return TITLES[d.kind][d.lay] || ['Puzzle'];
    if (d.kind === 'odd') return TITLES.odd[d.type];
    if (d.kind === 'spot') return TITLES.spot[d.theme];
    return TITLES[d.kind];
  }
  function textFor(d) {
    const V = VG();
    switch (d.kind) {
      case 'matrix': return 'Every row of the grid follows the same rules. Which picture belongs in the empty square?';
      case 'next': return 'The pictures change by a rule, one step at a time. Which picture comes next?';
      case 'odd': return 'All of these figures but one have something in common. Which is the odd one out?';
      case 'spot': return 'Two pictures of ' + V.THEMEW[d.theme] + ' — the same, except for **' + d.k + '** differences. Find them and click them, on either picture.';
      case 'fold': return 'A square of paper is folded as shown' + (d.folds.length > 1 ? ', one fold after another,' : '') + ' then punched right through all its layers. What does it look like when it is opened out flat?';
      case 'mirror': return 'The figure stands in front of a mirror. Which picture shows its reflection?';
    }
    return '';
  }

  const ABOUT = {
    matrix: 'Nine pictures in three rows; the last one is missing. **Every row follows the same rules**: something stays the same, something goes up, lines cancel out… Work out the rules and pick the picture that obeys all of them (in the panel). Each wrong guess costs a star. A hint names one rule at a time and crosses out the pictures that break it; once solved, the rules are written under the grid.',
    next: 'A row of pictures that change by a rule. Follow each part — the direction, the number, the shading, the moving dot — on its own, and pick the picture that comes next (in the panel). Each wrong guess costs a star.',
    odd: 'All the figures but one share a property: a count, a mirror line, a relation between parts. **Click the odd one out** on the table or in the panel. Colours, sizes and turns are only there to mislead — unless the puzzle says otherwise. Each wrong guess costs a star.',
    spot: 'Two pictures that look alike, with a few differences: something missing, a colour changed, a thing turned the other way, grown or moved. **Click a difference on either picture** and it gets a ring on both. A few misses are free; after that they cost stars. Zoom in with the wheel, or use the magnifying glass (L).',
    fold: 'A square of paper is folded along the dashed lines (the pink arrow shows which half moves), then punched through every layer. Picture it opened out flat and pick the right sheet in the panel. Every crease is a mirror: each hole gets a twin reflected across it. Each wrong guess costs a star.',
    mirror: 'Pick the true reflection of the figure in the mirror. A mirror swaps sides across its line and keeps everything else. Each wrong guess costs a star.'
  };
  const FAMKIND = { matrices: 'matrix', 'what-next': 'next', 'odd-one-out': 'odd', 'spot-difference': 'spot', 'punched-paper': 'fold' };

  function makeFor(rng, level, fid) {
    const V = VG();
    switch (fid) {
      case 'matrices': return V.genMatrix(rng, level);
      case 'what-next': return V.genNext(rng, level);
      case 'odd-one-out': return V.genOdd(rng, level);
      case 'spot-difference': return V.genSpot(rng, level);
      case 'punched-paper': return (level === 1 && rng() < .4) || (level === 2 && rng() < .25) ? V.genMirror(rng, level) : V.genFold(rng, level);
    }
    return null;
  }

  C.engine({
    id: 'visual',
    name: 'Visual reasoning',
    noMoves: true,
    stateVersion: 1,
    deps: ['js/lib/visual-gen.js'],
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about(p, fam) { return ABOUT[(p && p.data && p.data.kind) || FAMKIND[fam && fam.id]] || ABOUT.matrix; },

    verify(p) {
      const V = VG(), d = p.data;
      if (!V) return { ok: false, err: 'js/lib/visual-gen.js is not loaded' };
      if (!d || !d.kind) return { ok: false, err: 'no data.kind' };
      switch (d.kind) {
        case 'matrix': return V.verifyMatrix(d);
        case 'next': return V.verifyNext(d);
        case 'odd': return V.verifyOdd(d);
        case 'spot': return V.verifySpot(d);
        case 'fold': return V.verifyFold(d);
        case 'mirror': return V.verifyMirror(d);
      }
      return { ok: false, err: 'unknown kind ' + d.kind };
    },

    answerKey(p) { return p.data.kind === 'spot' ? null : p.data.ans; },

    generate(rng, level, fam) {
      const d = makeFor(rng, level, fam && fam.id);
      if (!d) return null;
      const pool = titlePool(d);
      return { title: pool[rng.int(pool.length)], text: textFor(d), diff: level, data: d };
    },

    mount(ctx, p) {
      if (!VG()) { ctx.say('The visual puzzle library did not load.', 'warn'); return {}; }
      return p.data.kind === 'spot' ? mountSpot(ctx, p) : mountChoice(ctx, p);
    },

    thumb(p) {
      const V = VG(), d = p.data;
      if (!V || !d) return '';
      const wrap = (inner, x0, y0, w, h) => { const W = Math.max(w, h * 4 / 3), H = W * 3 / 4; return '<svg viewBox="' + n1(x0 - (W - w) / 2) + ' ' + n1(y0 - (H - h) / 2) + ' ' + n1(W) + ' ' + n1(H) + '" preserveAspectRatio="xMidYMid meet">' + inner + '</svg>'; };
      const cell = (x, y, inner) => '<rect x="' + x + '" y="' + y + '" width="100" height="100" rx="12" fill="var(--cell)"/>' + at(x, y, inner);
      const q = (x, y) => '<rect x="' + (x + 3) + '" y="' + (y + 3) + '" width="94" height="94" rx="11" fill="none" stroke="var(--gold)" stroke-width="3" stroke-dasharray="8 6"/><text x="' + (x + 50) + '" y="' + (y + 68) + '" text-anchor="middle" font-size="50" font-weight="800" fill="var(--gold)" font-family="Segoe UI, sans-serif">?</text>';
      let s = '';
      switch (d.kind) {
        case 'matrix':
          d.grid.forEach((f, i) => { s += cell((i % 3) * 110, Math.floor(i / 3) * 110, V.LAY[d.lay].draw(f, {})); });
          return wrap(s + q(220, 220), -10, -10, 340, 340);
        case 'next': {
          const shown = d.seq.slice(-3);
          shown.forEach((f, i) => { s += cell(i * 115, 0, V.LAY[d.lay].draw(f, {})); });
          return wrap(s + q(345, 0), -10, -10, 465, 120);
        }
        case 'odd':
          d.figs.forEach((f, i) => { s += cell((i % 3) * 110 + (d.figs.length === 5 && i >= 3 ? 55 : 0), Math.floor(i / 3) * 110, V.oddDraw(d.type, f)); });
          return wrap(s, -10, -10, 340, 230);
        case 'spot': {
          const S = V.buildSpot(d);
          return S ? '<svg viewBox="0 0 ' + V.SW + ' ' + V.SH + '" preserveAspectRatio="xMidYMid slice">' + V.sceneSVG(S.A) + '</svg>' : '';
        }
        case 'fold': {
          const st = V.paperStates(d.folds);
          s = cell(0, 0, at(6, 6, V.stateSVG(st[d.folds.length], d.punch), .88)) + '<path d="M118 42l14 8l-14 8" fill="none" stroke="var(--faint)" stroke-width="4" stroke-linecap="round"/>' + q(150, 0);
          return wrap(s, -10, -10, 270, 120);
        }
        case 'mirror':
          s = cell(0, 0, V.cellsSVG(d.n, d.cells)) + (d.axis === 'v' ? '<rect x="119" y="-6" width="12" height="112" rx="4" fill="#c9d3e6"/>' + q(150, 0) : '<rect x="-6" y="119" width="112" height="12" rx="4" fill="#c9d3e6"/>' + q(0, 150));
          return d.axis === 'v' ? wrap(s, -10, -10, 270, 120) : wrap(s, -10, -10, 120, 270);
      }
      return '';
    }
  });

  C.visualTitles = TITLES;
  C.visualTitlePool = titlePool;
  C.visualText = textFor;

  C.css('visual', `
    .vis .vis-card, .vis-card { fill: var(--board-2); stroke: var(--line); stroke-width: 1.2; }
    .vis-cell { fill: var(--cell); stroke: var(--grid-2); stroke-width: 1.2; }
    .vis-q { fill: none; stroke: var(--gold); stroke-width: 2.6; stroke-dasharray: 8 6; }
    .vis-qm { font: 800 48px "Segoe UI", system-ui, sans-serif; fill: var(--gold); }
    .vis-glow { fill: none; stroke: var(--green); stroke-width: 3.5; animation: vis-in .6s ease-out; }
    .vis-t, .vis-cap { font: 600 11px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .vis-cap { font-size: 11.5px; font-weight: 700; }
    .vis-cap.vis-big { font-size: 17px; font-weight: 800; }
    .vis-arrow { fill: none; stroke: var(--faint); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
    .vis-badge { fill: var(--panel-3); stroke: var(--line); stroke-width: 1; }
    .vis-badget { font: 800 11px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .vis-pick { cursor: pointer; transition: opacity .2s; }
    .vis-pick.hover .vis-cell { stroke: var(--accent); stroke-width: 2.6; }
    .vis-pick.no { opacity: .42; }
    .vis-pick.out { opacity: .3; }
    .vis-x { fill: none; stroke: var(--red); stroke-width: 5; stroke-linecap: round; opacity: .85; }
    .vis-mirror { fill: #c9d3e6; stroke: #8e9ab3; stroke-width: 1.5; }
    .vis-shine { stroke: #ffffff; stroke-width: 2; opacity: .8; }
    .vis-ans .ans-choices.pics { grid-template-columns: repeat(auto-fill, minmax(92px, 1fr)); gap: 6px; }
    .vis-ans.vis-n4 .ans-choices.pics { grid-template-columns: repeat(2, 1fr); }
    .vis-ans .ans-choices.pics .ans-choice { padding: 5px 5px 7px; gap: 2px; }
    .vis-ans .ans-choices.pics .ans-choice b { font-size: .78rem; }
    .vis-ans .ans-choices.pics .ans-choice svg { max-height: 104px; }
    .vis-ans.vis-n4 .ans-choices.pics .ans-choice svg { max-height: 130px; }
    .ans-choice.vis-no { opacity: .4; position: relative; }
    .ans-choice.vis-no::after { content: '✕'; position: absolute; right: 9px; top: 6px; color: var(--red); font-weight: 900; }
    .ans-choice.vis-out { opacity: .3; }
    .ans-choice.vis-yes { border-color: var(--green); box-shadow: 0 0 0 2px rgba(78, 203, 141, .35); }
    .vis-scenebg { fill: var(--board-2); stroke: var(--line); stroke-width: 1; }
    .vis-sceneframe { fill: none; stroke: rgba(0, 0, 0, .25); stroke-width: 1.5; }
    .vis-ring .halo { fill: none; stroke: #ffffff; stroke-width: 7; opacity: .75; }
    .vis-ring .ring { fill: none; stroke: #1faa59; stroke-width: 3.4; }
    .vis-ring.new { transform-box: fill-box; transform-origin: center; animation: vis-pop .4s cubic-bezier(.3, 1.6, .5, 1); }
    .vis-hintc { fill: rgba(255, 209, 102, .1); stroke: #f0a500; stroke-width: 2.6; stroke-dasharray: 9 6; animation: vis-pulse 1.3s ease-in-out infinite; }
    .vis-miss { fill: none; stroke: #ff4d4d; stroke-linecap: round; animation: vis-fade 1.1s ease-in forwards; }
    @keyframes vis-pop { from { transform: scale(.3); opacity: 0; } }
    @keyframes vis-fade { to { opacity: 0; } }
    @keyframes vis-pulse { 50% { opacity: .45; } }
    @keyframes vis-in { from { opacity: 0; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
