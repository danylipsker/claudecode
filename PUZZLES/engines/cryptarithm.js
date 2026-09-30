/* The Puzzle Cabinet · engines/cryptarithm.js
 *
 * Alphametics (letter sums: SEND + MORE = MONEY), differences, long
 * multiplications written in letters, and skeleton multiplications with the
 * digits hidden as stars. Every letter stands for a different digit; a star
 * hides a digit of its own. The rules, the exact solver, the human-style
 * reasoner behind the hints and the puzzle maker live in js/lib/alphametic.js
 * (Cabinet.Alpha); see it for p.data.
 *
 * The engine state: { v: a digit per letter (-1 none), s: a digit per star,
 * m: pencil marks per letter then per star (bit d = digit d), c: carry notes per column }.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;

  const T = 54, PX = 60, PY = 64, OPW = 52, CARRY = 24;
  const SOLVED = ['Every column adds up.', 'Sums like clockwork.', 'Dudeney would tip his hat.', 'Letters decoded, digits delivered.', 'The arithmetic is airtight.'];

  /* ---------- layout (shared by the board and the thumbnails) ---------- */

  function layout(P) {
    const items = [];      // { kind: 'row', r, shift, y, op } | { kind: 'rule', y, from, to }
    const len = P.rows.map((r) => r.length);
    const carries = P.op === '+' || P.op === '-';
    let y = carries ? CARRY + 14 : 0;
    const push = (r, shift, op) => { items.push({ kind: 'row', r, shift, y, op }); y += PY; };
    const rule = () => { items.push({ kind: 'rule', y: y - PY + T + 6 }); y += 14; };
    if (P.op === '+') {
      for (let r = 0; r < P.rows.length - 1; r++) push(r, 0, r === P.rows.length - 2 ? '+' : '');
      rule();
      push(P.rows.length - 1, 0, '');
    } else if (P.op === '-') {
      push(0, 0, ''); push(1, 0, '−'); rule(); push(2, 0, '');
    } else {
      push(0, 0, ''); push(1, 0, '×'); rule();
      if (P.parts) {
        P.parts.forEach((_, j) => push(2 + j, j, j === P.parts.length - 1 && P.parts.length > 1 ? '+' : ''));
        rule();
      }
      push(P.rows.length - 1, 0, '');
    }
    let W = 0;
    items.forEach((it) => { if (it.kind === 'row') W = Math.max(W, len[it.r] + it.shift); });
    const width = OPW + W * PX;
    items.forEach((it) => { if (it.kind === 'rule') { it.x0 = OPW - 30; it.x1 = width; } });
    return { items, W, width, height: y - PY + T, carries, colX: (col) => OPW + (W - 1 - col) * PX };
  }

  /* ---------- the engine ---------- */

  C.engine({
    id: 'cryptarithm',
    name: 'Alphametics',
    deps: ['js/lib/alphametic.js'],
    noMoves: true,
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: 'Each **letter** stands for a digit — different letters, different digits — and no number begins with 0. A **star** hides a digit of its own (stars may repeat).\n\n' +
      'Click a letter (or just **type it**), then type its digit: every copy fills in at once. Type the digit again, or press **Backspace**, to rub it out. In the table beside the sum, click a digit in a letter\'s row to give it that digit.\n\n' +
      '**Pencil marks**: press **Space** (or ✎) to switch to notes, or hold **Shift** while you type — the table then shows which digits you still allow each letter. *Fill notes* writes every digit not already ruled out. The small boxes above the columns are for **carries**: click to cycle 1, 2, 0, blank.\n\n' +
      'Digits used twice turn red; the ✓ under a column means it adds up with your digits. **Hints** name the next letter that can be worked out, and why.',

    generate(rng, level, meta) {
      const A = C.Alpha;
      if (!A) return null;
      const roll = rng();
      let x = null, kind = 'sum';
      if (level >= 2 && roll < 0.2) { x = A.makeMul(rng, level, { stars: rng() < 0.5, budget: 600 }); kind = 'mul'; }
      else {
        x = A.makeSum(rng, level, { budget: 900 });
        if (x && level >= 2 && x.d.rows.length === 3 && rng() < 0.25) { kind = 'sub'; x.d = asDifference(x.d); }
      }
      if (!x) return null;
      const w = words(x.d, kind, x.theme);
      return { title: w.title, text: w.text, diff: level, tags: w.tags, data: x.d };
    },

    verify(p) {
      const A = C.Alpha;
      if (!A) return { ok: false, err: 'js/lib/alphametic.js is not loaded' };
      const d = p.data;
      const e = A.shapeErr(d);
      if (e) return { ok: false, err: e };
      const P = A.build(d);
      const bad = A.checkFull(P, P.sol.L, P.sol.S);
      if (bad) return { ok: false, err: 'the stored solution fails: ' + bad };
      const r = A.count(P, { limit: 2, nodeLimit: 5e6 });
      if (r.aborted) return { ok: false, err: 'the solver gave up' };
      if (r.n !== 1) return { ok: false, err: r.n ? 'more than one solution' : 'no solution' };
      if (A.rowsWith(P, r.first.L, r.first.S).join(',') !== d.sol.join(',')) return { ok: false, err: 'the one solution is not the stored one' };
      return { ok: true };
    },

    thumb(p) {
      const A = C.Alpha;
      if (!A) return '';
      const P = A.build(p.data), Lo = layout(P);
      const pad = 10, W = Lo.width + 2 * pad, H = Lo.height + 2 * pad;
      let s = '<svg viewBox="' + (-pad) + ' ' + (-pad + (Lo.carries ? CARRY + 10 : 0)) + ' ' + W + ' ' + (H - (Lo.carries ? CARRY + 10 : 0)) + '" preserveAspectRatio="xMidYMid meet">';
      const font = ' font-family="Segoe UI, system-ui, sans-serif" text-anchor="middle" font-weight="700"';
      Lo.items.forEach((it) => {
        if (it.kind === 'rule') { s += '<path d="M' + it.x0 + ' ' + it.y + 'H' + it.x1 + '" stroke="var(--ink)" stroke-width="4" stroke-linecap="round"/>'; return; }
        const row = P.rows[it.r];
        for (let k = 0; k < row.length; k++) {
          const ch = row.charAt(row.length - 1 - k), x = Lo.colX(k + it.shift);
          const given = /[0-9]/.test(ch);
          s += '<rect x="' + (x + 2) + '" y="' + (it.y + 2) + '" width="' + (T - 4) + '" height="' + (T - 4) + '" rx="9" fill="' + (ch === '*' ? 'var(--board-2)' : 'var(--cell)') + '" stroke="var(--ink-2)" stroke-opacity=".5" stroke-width="2"/>';
          s += '<text x="' + (x + T / 2) + '" y="' + (it.y + T / 2 + 12) + '" font-size="32" fill="' + (given ? 'var(--ink)' : ch === '*' ? 'var(--muted)' : 'var(--accent)') + '"' + font + '>' + (ch === '*' ? '∗' : ch) + '</text>';
        }
        if (it.op) s += '<text x="' + (OPW - 26) + '" y="' + (it.y + T / 2 + 12) + '" font-size="36" fill="var(--ink)"' + font + '>' + it.op + '</text>';
      });
      return s + '</svg>';
    },

    mount(ctx, p) { return mountSum(ctx, p); }
  });

  // a sum shown as a difference: T1 + T2 = R becomes R − T2 = T1
  function asDifference(d) {
    return { op: '-', rows: [d.rows[2], d.rows[1], d.rows[0]], sol: [d.sol[2], d.sol[1], d.sol[0]], given: d.given };
  }

  // titles and statements for made puzzles (the generator uses the same words)
  function words(d, kind, theme) {
    const A = C.Alpha;
    const P = A.build(d);
    const nG = Object.keys(P.given).length;
    const start = nG ? ' ' + (nG === 1 ? 'One letter is' : C.plural(nG, 'letter').replace(/^\d+/, (m) => ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six'][+m] || m) + ' are') + ' given to start you off.' : '';
    const th = theme && A.THEMES[theme] ? ' *' + A.THEMES[theme].name + '.*' : '';
    if (kind === 'mul' || d.op === '*') {
      if (P.nS) {
        const shown = d.rows.join('').replace(/[*]/g, '').length;
        return { title: 'Hidden digits: ' + d.rows[0].length + ' × ' + d.rows[1].length, tags: ['stars', 'multiplication'],
          text: 'A long multiplication with its digits hidden under stars. Each star is a digit (any digit, repeats allowed), no number begins with 0, and ' + (shown ? (shown === 1 ? 'one digit is' : shown + ' digits are') + ' left showing.' : 'nothing is left showing.') + ' Put the digits back.' };
      }
      return { title: 'Multiplication in letters: ' + d.rows[0] + ' × ' + d.rows[1], tags: ['multiplication', 'letters'],
        text: 'A multiplication written in letters: each letter is a different digit, and no number begins with 0.' + start + (d.key ? ' When you are done, read the letters in order from 0 to 9.' : '') };
    }
    const eq = d.op === '-' ? d.rows[0] + ' − ' + d.rows[1] + ' = ' + d.rows[2] : d.rows.slice(0, -1).join(' + ') + ' = ' + d.rows[d.rows.length - 1];
    return { title: eq, tags: [d.op === '-' ? 'subtraction' : 'addition'],
      text: (d.op === '-' ? 'A subtraction in letters.' : 'A sum in letters.') + th + ' Each letter stands for a different digit, and no number begins with 0.' + start + ' Find the digits.' };
  }
  C.cryptWords = words;
  C.cryptAsDifference = asDifference;

  /* ---------- playing ---------- */

  function mountSum(ctx, p) {
    const A = C.Alpha, d = p.data, wb = ctx.wb, s = ctx.s, h = ctx.h;
    const P = A.build(d), Lo = layout(P);
    const nL = P.nL, nS = P.nS, isSum = P.op === '+' || P.op === '-';
    const givenL = new Int8Array(nL).fill(-1);
    for (const k in P.given) givenL[k] = P.given[k];
    let vals = new Int8Array(nL).fill(-1), stars = new Int8Array(nS).fill(-1);
    let marks = new Int16Array(nL + nS), carries = new Int8Array(Lo.W + 1).fill(-1);
    let sel = null;        // { kind: 'L', i } | { kind: 'S', i }
    let pencil = false, busy = false, dead = false, timer = null, lastHint = null, hintEls = [];
    const opts = Object.assign({ conflicts: true, checks: true, tidy: true }, C.store.get('crypt-opts', {}) || {});
    const narrow = !!(root.matchMedia && root.matchMedia('(max-width: 980px)').matches);

    ctx.setGoal(P.op === '*' ? (nS ? 'Every star becomes a digit and the multiplication works.' : 'Every letter gets its own digit and the multiplication works.')
      : 'Every letter gets its own digit, and the ' + (P.op === '-' ? 'subtraction' : 'sum') + ' works.');

    /* the board */
    const board = wb.layer('board'), topL = wb.layer('top');
    const g0 = s('g', { class: 'cr' }, board);
    const gRows = s('g', null, g0), gDeco = s('g', { class: 'cr-nohit' }, g0), gTable = s('g', null, g0);

    // the table of letters and digits: beside the sum, or under it on a narrow screen
    const TB = { cell: 31, gap: 3, rowH: 36 };
    const hasTable = nL > 0;
    const tableW = 36 + 10 * (TB.cell + TB.gap) + 44;
    const side = !narrow;
    const tx0 = side ? Lo.width + 46 : Math.max(0, (Lo.width - tableW) / 2);
    const ty0 = side ? (Lo.carries ? CARRY + 14 : 0) : Lo.height + 46;
    const tableH = hasTable ? nL * TB.rowH : 0;
    const x1 = hasTable ? Math.max(Lo.width, tx0 + tableW) : Lo.width;
    const y1 = hasTable ? Math.max(Lo.height + 30, ty0 + tableH) : Lo.height + 30;
    wb.setBounds({ x0: -8, y0: -8, x1: x1 + 8, y1: y1 + (narrow ? 20 : 40) }, 0.05);

    // tiles: every cell of every row
    const tiles = [];      // { r, k, cell, g, rect, big, small, notes }
    const carryEls = [], checkEls = [];
    Lo.items.forEach((it) => {
      if (it.kind === 'rule') { s('path', { d: 'M' + it.x0 + ' ' + it.y + 'H' + it.x1, class: 'cr-rule' }, gDeco); return; }
      const row = P.cells[it.r];
      row.forEach((cell, k) => {
        const x = Lo.colX(k + it.shift), y = it.y;
        const g = s('g', { class: 'cr-tile', 'data-r': it.r, 'data-k': k }, gRows);
        const rect = s('rect', { x: x + 2, y: y + 2, width: T - 4, height: T - 4, rx: 9, class: 'cr-box', 'data-key': 't' + it.r + '-' + k }, g);
        const big = s('text', { x: x + T / 2, y: y + T / 2 + 1, class: 'cr-big', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
        const small = s('text', { x: x + 9, y: y + 13, class: 'cr-small', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
        const notes = s('text', { x: x + T / 2, y: y + T - 12, class: 'cr-notes', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
        tiles.push({ r: it.r, k, col: k + it.shift, cell, g, rect, big, small, notes, x, y });
      });
      if (it.op) s('text', { x: OPW - 26, y: it.y + T / 2 + 1, class: 'cr-op', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: it.op }, gDeco);
    });
    const firstY = Lo.items.find((it) => it.kind === 'row').y;
    const lastRow = Lo.items.filter((it) => it.kind === 'row').pop();
    if (isSum) {
      // carries (borrows in a difference) above the columns
      s('text', { x: OPW - 26, y: CARRY / 2 + 2, class: 'cr-carrylbl', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: P.op === '-' ? 'borrow' : 'carry' }, gDeco);
      for (let c = 1; c < Lo.W; c++) {
        const x = Lo.colX(c) + T / 2;
        const g = s('g', { class: 'cr-carry' }, gRows);
        const rect = s('rect', { x: x - CARRY / 2, y: 2, width: CARRY, height: CARRY, rx: 6 }, g);
        const t = s('text', { x, y: CARRY / 2 + 3, 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
        carryEls[c] = { g, rect, t, x };
      }
      for (let c = 0; c < Lo.W; c++) {
        checkEls[c] = s('text', { x: Lo.colX(c) + T / 2, y: lastRow.y + T + 16, class: 'cr-check', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, gDeco);
      }
    } else {
      Lo.items.forEach((it) => {
        if (it.kind !== 'row' || it.r < 2) return;
        checkEls[it.r] = s('text', { x: Lo.width + 16, y: it.y + T / 2, class: 'cr-check', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, gDeco);
      });
    }
    void firstY;

    // the table: one row per letter, a cell per digit
    const tRows = [];
    if (hasTable) {
      s('text', { x: tx0 + 15, y: ty0 - 12, class: 'cr-thead', 'text-anchor': 'middle', text: '' }, gTable);
      for (let d0 = 0; d0 < 10; d0++) s('text', { x: tx0 + 36 + d0 * (TB.cell + TB.gap) + TB.cell / 2, y: ty0 - 9, class: 'cr-thead', 'text-anchor': 'middle', text: String(d0) }, gTable);
      for (let i = 0; i < nL; i++) {
        const y = ty0 + i * TB.rowH;
        const g = s('g', { class: 'cr-trow' }, gTable);
        const bg = s('rect', { x: tx0 - 4, y: y - 2, width: tableW + 4, height: TB.cell + 4, rx: 8, class: 'cr-trbg' }, g);
        const lt = s('rect', { x: tx0, y, width: TB.cell, height: TB.cell, rx: 7, class: 'cr-tlet', 'data-key': 'L' + P.letters[i] }, g);
        s('text', { x: tx0 + TB.cell / 2, y: y + TB.cell / 2 + 1, class: 'cr-tlettxt', 'text-anchor': 'middle', 'dominant-baseline': 'central', text: P.letters[i] }, g);
        const cells = [];
        for (let v = 0; v < 10; v++) {
          const x = tx0 + 36 + v * (TB.cell + TB.gap);
          const cg = s('g', { class: 'cr-tc' }, g);
          const r = s('rect', { x, y, width: TB.cell, height: TB.cell, rx: 7 }, cg);
          const t = s('text', { x: x + TB.cell / 2, y: y + TB.cell / 2 + 1, 'text-anchor': 'middle', 'dominant-baseline': 'central', text: String(v) }, cg);
          const who = s('text', { x: x + TB.cell - 5, y: y + TB.cell - 6, class: 'cr-who', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, cg);
          cells.push({ g: cg, r, t, who, x, y });
        }
        const res = s('text', { x: tx0 + 36 + 10 * (TB.cell + TB.gap) + 18, y: y + TB.cell / 2 + 1, class: 'cr-tres', 'text-anchor': 'middle', 'dominant-baseline': 'central' }, g);
        tRows.push({ g, bg, lt, cells, res, y });
      }
    }

    /* the panel: a number pad, pencil and notes, a live read-out, three switches */
    const btn = (label, title, fn, cls) => {
      const b = h('button.cr-b' + (cls ? '.' + cls : ''), { type: 'button', tabindex: '-1', title, 'aria-label': title });
      b.innerHTML = label;
      b.addEventListener('mousedown', (e) => e.preventDefault());
      b.addEventListener('click', (e) => { e.preventDefault(); fn(); });
      return b;
    };
    const keysEl = h('div.cr-keys');
    const keys = [];
    for (let v = 0; v < 10; v++) {
      const b = btn('<b>' + v + '</b><small></small>', 'Digit ' + v + ' (Shift+' + v + ' for a pencil mark)', () => input(v, false), 'cr-key');
      keys.push(b);
      keysEl.appendChild(b);
    }
    const penBtn = btn(C.icon('pen') + '<span>Pencil</span>', 'Pencil marks on / off (Space)', () => togglePencil(), 'cr-pen');
    const row2 = h('div.cr-row', penBtn,
      btn(C.icon('eraser') + '<span>Erase</span>', 'Rub out the selected letter\'s digit, or its notes (Backspace)', () => erase()),
      btn('<span>Fill notes</span>', 'Pencil in every digit not ruled out by the digits already written (and no 0 at the front of a number)', () => fillNotes()),
      btn('<span>Clear notes</span>', 'Rub out the pencil marks (of the selected letter, or all of them)', () => clearNotes()));
    const optBtns = {};
    const opt = (key, label, title) => { optBtns[key] = btn('<i></i><span>' + label + '</span>', title, () => { opts[key] = !opts[key]; C.store.set('crypt-opts', opts); draw(); }, 'cr-opt'); return optBtns[key]; };
    const row3 = h('div.cr-row.cr-opts',
      opt('conflicts', 'Clashes', 'Show a digit used by two letters (or a 0 at the front) in red'),
      opt('checks', 'Column checks', 'Tick every column (or row) that works out with your digits'),
      opt('tidy', 'Tidy notes', 'When you give a letter a digit, rub that digit out of the other letters\' notes'));
    const readout = h('div.cr-readout');
    ctx.panel.appendChild(h('div.cr-panel', readout, keysEl, row2, row3));

    /* reading the state */
    const valL = (i) => givenL[i] >= 0 ? givenL[i] : vals[i];
    const cellVal = (c) => c.t === 2 ? c.i : c.t === 0 ? valL(c.i) : stars[c.i];
    const symOf = (c) => c.t === 0 ? { kind: 'L', i: c.i } : c.t === 1 ? { kind: 'S', i: c.i } : null;
    const same = (a, b) => a && b && a.kind === b.kind && a.i === b.i;
    const markIdx = (sy) => sy.kind === 'L' ? sy.i : nL + sy.i;
    const isGivenSym = (sy) => sy.kind === 'L' && givenL[sy.i] >= 0;
    function allL() { const out = new Array(nL); for (let i = 0; i < nL; i++) out[i] = valL(i); return out; }

    function problems() {
      const badL = new Uint8Array(nL), badS = new Uint8Array(nS);
      const byDigit = {};
      for (let i = 0; i < nL; i++) {
        const v = valL(i);
        if (v < 0) continue;
        (byDigit[v] = byDigit[v] || []).push(i);
        if (!(P.allowL[i] >> v & 1)) badL[i] = P.lead[i] && v === 0 ? 2 : 3;
      }
      for (const v in byDigit) if (byDigit[v].length > 1) byDigit[v].forEach((i) => { badL[i] = 1; });
      for (let i = 0; i < nS; i++) if (stars[i] >= 0 && !(P.allowS[i] >> stars[i] & 1)) badS[i] = P.d.digits ? 3 : 2;
      return { badL, badS, byDigit };
    }

    // columns (sums) or rows (products) that work out with the digits written so far
    function checks() {
      const out = { col: [], row: {}, carry: [] };
      if (isSum) {
        let carry = 0;
        for (let c = 0; c < Lo.W; c++) {
          const cells = P.terms.filter((t) => t.length > c).map((t) => t[c]);
          const vs = cells.map(cellVal), r = cellVal(P.res[c]);
          if (vs.some((v) => v < 0) || r < 0) break;
          out.carry[c] = carry;
          const sum = vs.reduce((a, b) => a + b, 0) + carry;
          if (sum % 10 !== r || (c === Lo.W - 1 && sum >= 10)) { out.col[c] = 'bad'; break; }
          out.col[c] = 'ok';
          carry = Math.floor(sum / 10);
          out.carry[c + 1] = carry;
        }
      } else {
        const num = (cells) => { let x = 0; for (let k = cells.length - 1; k >= 0; k--) { const v = cellVal(cells[k]); if (v < 0) return null; x = x * 10 + v; } return x; };
        const Av = num(P.A), Bv = num(P.B), Rv = num(P.R);
        const bd = (j) => cellVal(P.B[j]);
        if (P.parts) {
          const pv = P.parts.map(num);
          P.parts.forEach((cells, j) => {
            if (Av == null || !(bd(j) >= 0) || pv[j] == null) return;
            out.row[2 + j] = Av * bd(j) === pv[j] ? 'ok' : 'bad';
          });
          if (Rv != null && pv.every((x) => x != null)) out.row[P.rows.length - 1] = pv.reduce((a, x, j) => a + x * Math.pow(10, j), 0) === Rv ? 'ok' : 'bad';
        } else if (Av != null && Bv != null && Rv != null) out.row[P.rows.length - 1] = Av * Bv === Rv ? 'ok' : 'bad';
      }
      return out;
    }

    function readoutText() {
      const rs = A.rowsWith(P, allL(), Array.from(stars)).map((x) => x.replace(/\?/g, '·'));
      let eq;
      if (P.op === '+') eq = rs.slice(0, -1).join(' + ') + ' = ' + rs[rs.length - 1];
      else if (P.op === '-') eq = rs[0] + ' − ' + rs[1] + ' = ' + rs[2];
      else eq = rs[0] + ' × ' + rs[1] + ' = ' + rs[rs.length - 1];
      const known = rs.slice(0, P.op === '*' ? 2 : rs.length - 1).every((x) => x.indexOf('·') < 0);
      let tail = '';
      if (known) {
        const n = rs.map(Number);
        const want = P.op === '+' ? n.slice(0, -1).reduce((a, b) => a + b, 0) : P.op === '-' ? n[0] - n[1] : n[0] * n[1];
        const got = P.op === '-' ? n[2] : n[n.length - 1];
        const whole = rs[P.op === '-' ? 2 : rs.length - 1].indexOf('·') < 0;
        tail = whole && want === got ? ' <b class="ok">✓</b>' : ' <span class="want">(makes ' + want + ')</span>';
      }
      return '<small>Your digits</small><div class="eq">' + C.esc(eq) + tail + '</div>';
    }

    /* drawing the state */
    function draw() {
      const pr = problems(), ck = opts.checks ? checks() : { col: [], row: {}, carry: [] };
      const selM = sel ? marks[markIdx(sel)] : 0;
      tiles.forEach((t) => {
        const c = t.cell, sy = symOf(c), v = cellVal(c);
        const on = sy && same(sy, sel);
        const bad = opts.conflicts && ((c.t === 0 && pr.badL[c.i]) || (c.t === 1 && pr.badS[c.i]));
        const hl = !on && sel && sel.kind === 'L' && v >= 0 && c.t === 0 && valL(sel.i) === v && valL(sel.i) >= 0;
        t.g.setAttribute('class', 'cr-tile' + (c.t === 2 ? ' given' : c.t === 1 ? ' star' : ' letter') + (c.t === 0 && givenL[c.i] >= 0 ? ' given' : '') + (on ? (pencil ? ' sel pen' : ' sel') : '') + (bad ? ' bad' : '') + (hl ? ' same' : '') + (v >= 0 ? ' has' : ''));
        const label = c.t === 0 ? P.letters[c.i] : '';
        const m = sy ? marks[markIdx(sy)] : 0;
        if (v >= 0) {
          t.big.textContent = String(v);
          t.small.textContent = label;
          t.notes.textContent = '';
          t.big.setAttribute('class', 'cr-big' + (c.t === 2 || (c.t === 0 && givenL[c.i] >= 0) ? ' fixed' : ' user'));
        } else if (m) {
          t.big.textContent = c.t === 0 ? label : '';
          t.big.setAttribute('class', 'cr-big letter' + (c.t === 0 ? ' up' : ''));
          t.small.textContent = '';
          t.notes.textContent = A.digitsOf(m).join('');
          t.notes.setAttribute('class', 'cr-notes' + (A.pc(m) > 5 ? ' many' : '') + (c.t === 1 ? ' mid' : ''));
        } else {
          t.big.textContent = c.t === 0 ? label : '∗';
          t.big.setAttribute('class', 'cr-big' + (c.t === 0 ? ' letter' : ' starmark'));
          t.small.textContent = '';
          t.notes.textContent = '';
        }
      });
      // carries
      for (let c = 1; c < Lo.W && isSum; c++) {
        const e = carryEls[c], v = carries[c], truth = ck.carry[c];
        e.t.textContent = v >= 0 ? String(v) : '';
        e.g.setAttribute('class', 'cr-carry' + (v >= 0 ? ' has' : '') + (v >= 0 && truth != null && opts.checks ? (truth === v ? ' ok' : ' bad') : ''));
      }
      if (isSum) checkEls.forEach((el, c) => { const st = ck.col[c]; el.textContent = st === 'ok' ? '✓' : st === 'bad' ? '✗' : ''; el.setAttribute('class', 'cr-check' + (st ? ' ' + st : '')); });
      else checkEls.forEach((el, r) => { if (!el) return; const st = ck.row[r]; el.textContent = st === 'ok' ? '✓' : st === 'bad' ? '✗' : ''; el.setAttribute('class', 'cr-check' + (st ? ' ' + st : '')); });
      // the table
      tRows.forEach((tr, i) => {
        const v = valL(i), m = marks[i];
        const on = sel && sel.kind === 'L' && sel.i === i;
        tr.g.setAttribute('class', 'cr-trow' + (on ? (pencil ? ' sel pen' : ' sel') : '') + (givenL[i] >= 0 ? ' given' : '') + (opts.conflicts && pr.badL[i] ? ' bad' : ''));
        tr.res.textContent = v >= 0 ? '= ' + v : '';
        tr.cells.forEach((cc, dg) => {
          const users = pr.byDigit[dg] || [];
          const other = users.filter((j) => j !== i);
          let cls = 'cr-tc';
          if (v === dg) cls += ' mine';
          else if (other.length) cls += ' taken';
          if (m) cls += (m >> dg & 1) ? ' cand' : ' out';
          if (!(P.allowL[i] >> dg & 1)) cls += ' never';
          if (v === dg && opts.conflicts && pr.badL[i]) cls += ' bad';
          cc.g.setAttribute('class', cls);
          cc.who.textContent = v !== dg && other.length ? P.letters[other[0]] : '';
        });
      });
      // the pad
      const used = {};
      for (let i = 0; i < nL; i++) { const v = valL(i); if (v >= 0) (used[v] = used[v] || []).push(P.letters[i]); }
      keys.forEach((b, v) => {
        const u = used[v] || [];
        b.classList.toggle('full', !!u.length && nL > 0);
        b.classList.toggle('on', !!sel && (sel.kind === 'L' ? valL(sel.i) === v : stars[sel.i] === v));
        b.classList.toggle('cand', !!sel && !!(selM >> v & 1));
        b.querySelector('small').textContent = u.join('');
      });
      penBtn.classList.toggle('on', pencil);
      for (const k in optBtns) optBtns[k].classList.toggle('on', !!opts[k]);
      readout.innerHTML = readoutText();
      wb.applyPaints();
    }

    /* choosing */
    function tileAt(pt) {
      for (const t of tiles) if (pt[0] >= t.x && pt[0] <= t.x + T && pt[1] >= t.y && pt[1] <= t.y + T) return t;
      return null;
    }
    function carryAt(pt) {
      for (let c = 1; c < carryEls.length; c++) {
        const e = carryEls[c];
        if (e && Math.abs(pt[0] - e.x) <= CARRY / 2 + 4 && pt[1] >= 0 && pt[1] <= CARRY + 6) return c;
      }
      return -1;
    }
    function tableAt(pt) {
      if (!hasTable) return null;
      const i = Math.floor((pt[1] - ty0 + TB.gap / 2) / TB.rowH);
      if (i < 0 || i >= nL) return null;
      const y = ty0 + i * TB.rowH;
      if (pt[1] < y - 3 || pt[1] > y + TB.cell + 3) return null;
      if (pt[0] >= tx0 - 4 && pt[0] < tx0 + TB.cell + 3) return { i, d: -1 };
      const dx = pt[0] - (tx0 + 36);
      const dg = Math.floor(dx / (TB.cell + TB.gap));
      if (dx >= 0 && dg >= 0 && dg < 10 && dx - dg * (TB.cell + TB.gap) <= TB.cell + 1) return { i, d: dg };
      if (pt[0] >= tx0 - 4 && pt[0] <= tx0 + tableW) return { i, d: -1 };
      return null;
    }
    function pick(sy) {
      sel = sy;
      clearHint();
      draw();
    }
    wb.handlers.board = {
      down(pt, ev) {
        if (busy) return true;
        const t = tileAt(pt);
        if (t) {
          const sy = symOf(t.cell);
          if (!sy) { ctx.toast('That digit is printed in the puzzle.'); return true; }
          pick(sy);
          ctx.sfx('tap');
          return true;
        }
        const c = carryAt(pt);
        if (c > 0) {
          // blank → 1 → 2 (when a column can carry that much) → 0 → blank
          const mx = Math.max(1, A.sumModel(P).maxC[c] || 1);
          const cur = carries[c];
          carries[c] = cur < 0 ? 1 : cur === 0 ? -1 : cur >= mx ? 0 : cur + 1;
          commit('carry');
          return true;
        }
        const tc = tableAt(pt);
        if (tc) {
          const sy = { kind: 'L', i: tc.i };
          if (tc.d < 0) { pick(sy); return true; }
          sel = sy;
          input(tc.d, ev.shiftKey);
          return true;
        }
        if (sel) { sel = null; clearHint(); draw(); }
        return false;
      }
    };

    // every symbol in reading order (for the arrow keys)
    const order = [];
    tiles.forEach((t) => { const sy = symOf(t.cell); if (sy && !order.some((q) => same(q, sy))) order.push(sy); });
    function moveSel(dir) {
      if (!order.length) return;
      if (nL && !nS) {
        const i = sel && sel.kind === 'L' ? sel.i : -1;
        pick({ kind: 'L', i: i < 0 ? 0 : (i + dir + nL) % nL });
        return;
      }
      const at = sel ? order.findIndex((q) => same(q, sel)) : -1;
      pick(order[at < 0 ? 0 : (at + dir + order.length) % order.length]);
    }

    /* writing */
    function commit(why) {
      clearHint();
      draw();
      ctx.changed(why);
    }
    function input(v, asMark) {
      if (busy) return;
      if (!sel) { ctx.toast(nL ? 'Pick a letter first: click it, or type it.' : 'Pick a star first: click one.'); return; }
      if (isGivenSym(sel)) { ctx.say('The digit of ' + P.letters[sel.i] + ' is given, so it stays.'); return; }
      const mi = markIdx(sel);
      const cur = sel.kind === 'L' ? vals[sel.i] : stars[sel.i];
      if (asMark || pencil) {
        if (cur >= 0) { ctx.say('Notes are for a ' + (sel.kind === 'L' ? 'letter' : 'star') + ' without a digit: rub the digit out first.'); return; }
        marks[mi] ^= 1 << v;
        commit('pencil');
        return;
      }
      if (sel.kind === 'L') {
        if (vals[sel.i] === v) vals[sel.i] = -1;
        else {
          vals[sel.i] = v;
          if (opts.tidy) for (let j = 0; j < nL; j++) if (j !== sel.i) marks[j] &= ~(1 << v);
        }
      } else stars[sel.i] = stars[sel.i] === v ? -1 : v;
      ctx.sfx('tap');
      commit('digit');
    }
    function erase() {
      if (busy || !sel || isGivenSym(sel)) return;
      const mi = markIdx(sel);
      if (sel.kind === 'L' && vals[sel.i] >= 0) vals[sel.i] = -1;
      else if (sel.kind === 'S' && stars[sel.i] >= 0) stars[sel.i] = -1;
      else if (marks[mi]) marks[mi] = 0;
      else return;
      commit('erase');
    }
    function fillNotes() {
      if (busy) return;
      let used = 0;
      for (let i = 0; i < nL; i++) if (valL(i) >= 0) used |= 1 << valL(i);
      let any = false;
      for (let i = 0; i < nL; i++) {
        if (valL(i) >= 0) continue;
        const m = P.allowL[i] & ~used;
        if (marks[i] !== m) { marks[i] = m; any = true; }
      }
      for (let i = 0; i < nS; i++) {
        if (stars[i] >= 0) continue;
        if (marks[nL + i] !== P.allowS[i]) { marks[nL + i] = P.allowS[i]; any = true; }
      }
      if (any) commit('notes'); else ctx.say('Your notes already hold every digit still possible.');
    }
    function clearNotes() {
      if (busy) return;
      if (sel && marks[markIdx(sel)]) { marks[markIdx(sel)] = 0; commit('notes'); return; }
      if (!marks.some((m) => m)) return;
      marks.fill(0);
      commit('notes');
    }
    function togglePencil() {
      pencil = !pencil;
      ctx.toast(pencil ? 'Pencil marks: notes for the selected letter' : 'Digits');
      draw();
    }

    /* hints */
    function clearHint() {
      hintEls.forEach((el) => el.remove());
      hintEls = [];
    }
    function markTiles(pred, cls) {
      tiles.forEach((t) => { if (pred(t)) hintEls.push(s('rect', { x: t.x, y: t.y, width: T, height: T, rx: 11, class: 'cr-hint ' + cls }, topL)); });
    }
    function markCols(cols) {
      const rowsY = tiles.map((t) => t.y);
      const y0 = Math.min.apply(null, rowsY) - 4, y1 = Math.max.apply(null, rowsY) + T + 4;
      cols.forEach((c) => hintEls.push(s('rect', { x: Lo.colX(c) - 3, y: y0, width: T + 6, height: y1 - y0, rx: 12, class: 'cr-hint col' }, topL)));
    }
    function markRow(i) {
      if (!hasTable) return;
      hintEls.push(s('rect', { x: tx0 - 5, y: tRows[i].y - 3, width: tableW + 6, height: TB.cell + 6, rx: 9, class: 'cr-hint target' }, topL));
    }
    function showTarget(sy) {
      markTiles((t) => { const q = symOf(t.cell); return q && same(q, sy); }, 'target');
      if (sy.kind === 'L') markRow(sy.i);
    }
    const nameOf = (sy) => sy.kind === 'L' ? '**' + P.letters[sy.i] + '**' : 'the gold star';
    const again = ' *Ask again and I will write it in.*';

    function hint() {
      if (busy) return null;
      const pr = problems();
      for (const v in pr.byDigit) {
        const ls = pr.byDigit[v];
        if (ls.length > 1) return { text: A.listAnd(ls.map((i) => '**' + P.letters[i] + '**')) + ' all have the digit ' + v + ' — but different letters need different digits.', show() { ls.forEach((i) => showTarget({ kind: 'L', i })); } };
      }
      for (let i = 0; i < nL; i++) if (pr.badL[i] === 2) return { text: '**' + P.letters[i] + '** begins a number, so it cannot be 0.', show() { showTarget({ kind: 'L', i }); } };
      for (let i = 0; i < nL; i++) if (pr.badL[i] === 3) return { text: 'Only the digits ' + A.listAnd(A.digitsOf(P.allow)) + ' are allowed in this puzzle.', show() { showTarget({ kind: 'L', i }); } };
      for (let i = 0; i < nS; i++) if (pr.badS[i]) return { text: pr.badS[i] === 2 ? 'A number cannot begin with 0.' : 'Only the digits ' + A.listAnd(A.digitsOf(P.allow)) + ' are allowed in this puzzle.', show() { showTarget({ kind: 'S', i }); } };
      const sol = P.sol;
      const wrong = [];
      for (let i = 0; i < nL; i++) if (vals[i] >= 0 && vals[i] !== sol.L[i]) wrong.push({ kind: 'L', i, v: vals[i] });
      for (let i = 0; i < nS; i++) if (stars[i] >= 0 && stars[i] !== sol.S[i]) wrong.push({ kind: 'S', i, v: stars[i] });
      if (wrong.length) {
        const w = wrong[0];
        return { text: 'Nothing clashes yet, but the **' + w.v + '** for ' + nameOf(w) + ' is not right' + (wrong.length > 1 ? ' (and ' + C.plural(wrong.length - 1, 'other digit') + ' too)' : '') + '. Rub it out and look again.', show() { pick(w); showTarget(w); } };
      }
      for (let i = 0; i < nL + nS; i++) {
        const sy = i < nL ? { kind: 'L', i } : { kind: 'S', i: i - nL };
        const v = sy.kind === 'L' ? valL(sy.i) : stars[sy.i];
        const truth = sy.kind === 'L' ? sol.L[sy.i] : sol.S[sy.i];
        if (v < 0 && marks[i] && !(marks[i] >> truth & 1)) return { text: 'Careful with your notes for ' + nameOf(sy) + ': its digit is not among them.', show() { pick(sy); showTarget(sy); } };
      }
      const cur = (sy) => sy.kind === 'L' ? valL(sy.i) : stars[sy.i];
      if (lastHint && cur(lastHint) < 0) {
        const q = lastHint;
        if (q.kind === 'L') vals[q.i] = q.v; else stars[q.i] = q.v;
        if (q.kind === 'L' && opts.tidy) for (let j = 0; j < nL; j++) if (j !== q.i) marks[j] &= ~(1 << q.v);
        sel = { kind: q.kind, i: q.i };
        lastHint = null;
        commit('hint');
        return { text: 'Written in: ' + nameOf(q) + ' = **' + q.v + '**.', show() { showTarget(q); } };
      }
      let left = 0;
      for (let i = 0; i < nL; i++) if (valL(i) < 0) left++;
      for (let i = 0; i < nS; i++) if (stars[i] < 0) left++;
      if (!left) return 'Every letter has its digit and nothing clashes. Press Check!';
      const knownL = allL(), knownS = Array.from(stars);
      // sums: the reasoner
      if (isSum && !nS) {
        const res = A.hintStep(P, knownL);
        if (res && res.i != null) {
          const sy = { kind: 'L', i: res.i };
          lastHint = { kind: 'L', i: res.i, v: res.v };
          let t = P.op === '-' ? 'Read the subtraction as the addition that checks it: ' + P.rows[1] + ' + ' + P.rows[2] + ' = ' + P.rows[0] + '. ' : '';
          if (res.earlier.length) t += 'First: ' + res.earlier.map((q) => q.text).join(' ') + ' Then: ';
          t += res.step.text + again;
          return { text: t, show() { pick(sy); markCols(res.cols); showTarget(sy); } };
        }
      }
      // products: plain arithmetic, then what the last digits force
      if (P.op === '*') {
        // a partial product spelled exactly like the top number: that digit of the multiplier is 1
        if (P.parts && nL) {
          for (let j = 0; j < P.parts.length; j++) {
            const c = P.B[j];
            if (P.rows[2 + j] !== P.rows[0] || c.t !== 0 || valL(c.i) >= 0) continue;
            const sy = { kind: 'L', i: c.i };
            lastHint = { kind: 'L', i: c.i, v: 1 };
            const place = ['units', 'tens', 'hundreds', 'thousands'][j] || 'next';
            return { text: 'Look at the partial products: the one for the ' + place + ' digit of the multiplier is **' + P.rows[0] + '** again — the top number itself. Only multiplying by 1 does that, so ' + nameOf(sy) + ' = **1**.' + again,
              show() { pick(sy); markTiles((t) => t.r === 0 || t.r === 2 + j, 'col'); showTarget(sy); } };
          }
        }
        const ar = A.arithHint(P, knownL, knownS);
        if (ar) {
          const sy = symOf(ar.cell);
          lastHint = { kind: sy.kind, i: sy.i, v: ar.v };
          return { text: ar.text + ' So ' + nameOf(sy) + ' is **' + ar.v + '**.' + again, show() { pick(sy); markTiles((t) => t.r === ar.row, 'col'); showTarget(sy); } };
        }
        const w = A.windowHint(P, knownL, knownS, knownL, knownS);
        if (w && w.forced) {
          const f = w.forced[0], sy = { kind: f.kind, i: f.i };
          lastHint = { kind: f.kind, i: f.i, v: f.v };
          const span = w.k === 0 ? 'the last digit of every row' : 'the last ' + (w.k + 1) + ' digits of every row';
          const text = 'Work from the right: the last digits of the two numbers being multiplied decide the last digits of everything below them. Look only at ' + span + ' (shaded): ' +
            (w.n === 1 ? 'there is just one way to fill them in, and it has ' : 'there are ' + w.n + ' ways to fill them in, and every one has ') + nameOf(sy) + ' = **' + f.v + '**.' + again;
          return { text, show() { pick(sy); markTiles((t) => t.k <= w.k, 'col'); showTarget(sy); } };
        }
      }
      // when the short cuts run out: the whole puzzle decides
      let sy = null;
      for (let i = 0; i < nL && !sy; i++) if (valL(i) < 0) sy = { kind: 'L', i };
      for (let i = 0; i < nS && !sy; i++) if (stars[i] < 0) sy = { kind: 'S', i };
      const v = sy.kind === 'L' ? sol.L[sy.i] : sol.S[sy.i];
      lastHint = { kind: sy.kind, i: sy.i, v };
      return { text: 'The short cuts have run out here: only the whole ' + (P.op === '*' ? 'multiplication — the lengths of the rows included —' : 'sum') + ' pins it down. Just one way works, and in it ' + nameOf(sy) + ' is **' + v + '**.' + again, show() { pick(sy); showTarget(sy); } };
    }

    /* the solution, letter by letter (in the order reasoning finds them) */
    function solve() {
      if (busy) return;
      clearHint();
      lastHint = null;
      const todo = [];
      const path = isSum && !nS ? A.reason(P) : null;
      const seen = new Set();
      if (path) path.steps.forEach((st) => st.ch.forEach((x) => { if (x.kind === 'L' && A.pc(x.after) === 1 && !seen.has(x.i)) { seen.add(x.i); todo.push({ kind: 'L', i: x.i }); } }));
      for (let i = 0; i < nL; i++) if (!seen.has(i)) todo.push({ kind: 'L', i });
      order.forEach((sy) => { if (sy.kind === 'S') todo.push(sy); });
      const need = todo.filter((sy) => sy.kind === 'L' ? givenL[sy.i] < 0 && vals[sy.i] !== P.sol.L[sy.i] : stars[sy.i] !== P.sol.S[sy.i]);
      if (!need.length) { ctx.changed('solve'); return; }
      busy = true;
      let k = 0;
      const step = () => {
        if (dead) return;
        const sy = need[k++];
        if (sy.kind === 'L') vals[sy.i] = P.sol.L[sy.i]; else stars[sy.i] = P.sol.S[sy.i];
        sel = sy;
        draw();
        if (k < need.length) timer = setTimeout(step, C.anim(nS > 12 ? 45 : 110));
        else { busy = false; timer = null; sel = null; draw(); ctx.changed('solve'); }
      };
      step();
    }

    function explainText() {
      const rs = P.d.sol;
      let t;
      if (P.op === '+') t = 'The answer: ' + rs.slice(0, -1).join(' + ') + ' = ' + rs[rs.length - 1] + '.';
      else if (P.op === '-') t = 'The answer: ' + rs[0] + ' − ' + rs[1] + ' = ' + rs[2] + '.';
      else t = 'The answer: ' + rs[0] + ' × ' + rs[1] + ' = ' + rs[rs.length - 1] + (P.parts ? ' (the partial products are ' + A.listAnd(rs.slice(2, -1)) + ')' : '') + '.';
      if (nL) t += ' ' + P.letters.map((ch, i) => ch + ' = ' + P.sol.L[i]).join(', ') + '.';
      if (P.d.key) t += ' Read from 0 to 9, the letters spell **' + P.d.key + '**.';
      if (isSum && !nS) {
        const r = A.reason(P);
        if (r && r.solved) {
          const seq = [];
          const kinds = { lead: 'the carry at the front', trial: 'a what-if', trial2: 'a longer what-if', hidden: 'the last digit left', pair: 'a pair', single: 'the only digit left' };
          const seen = new Set();
          r.steps.forEach((st) => st.ch.forEach((x) => {
            if (x.kind !== 'L' || A.pc(x.after) !== 1 || seen.has(x.i) || P.given[x.i] != null) return;
            seen.add(x.i);
            seq.push(P.letters[x.i] + ' = ' + A.lowBit(x.after) + ' (' + (st.kind === 'column' ? A.colName(st.c) + ' column' : kinds[st.kind]) + ')');
          }));
          if (seq.length) t += '\n\nOne path by reasoning alone: ' + seq.join(', ') + '.';
        }
      }
      return t;
    }

    draw();

    return {
      noMoves: true,
      check() {
        let left = 0;
        for (let i = 0; i < nL; i++) if (valL(i) < 0) left++;
        for (let i = 0; i < nS; i++) if (stars[i] < 0) left++;
        if (left) return { solved: false, msg: left === 1 ? (nL ? 'One letter still needs its digit.' : 'One star is still hidden.') : left + (nL ? ' letters still need their digits.' : ' stars are still hidden.') };
        const bad = A.checkFull(P, allL(), Array.from(stars));
        if (!bad) return { solved: true, msg: SOLVED[(C.hash(p.id) >>> 3) % SOLVED.length] };
        return { solved: false, msg: 'Not yet: ' + bad + '.' };
      },
      hint,
      solve,
      explain: explainText,
      getState() {
        const m = Array.from(marks);
        while (m.length && !m[m.length - 1]) m.pop();
        const c = Array.from(carries);
        while (c.length && c[c.length - 1] < 0) c.pop();
        return { v: Array.from(vals), s: Array.from(stars), m, c };
      },
      setState(st) {
        if (!st) return;
        if (timer) { clearTimeout(timer); timer = null; busy = false; }
        vals = new Int8Array(nL).fill(-1); (st.v || []).forEach((v, i) => { if (i < nL) vals[i] = v; });
        stars = new Int8Array(nS).fill(-1); (st.s || []).forEach((v, i) => { if (i < nS) stars[i] = v; });
        marks = new Int16Array(nL + nS); (st.m || []).forEach((v, i) => { if (i < nL + nS) marks[i] = v; });
        carries = new Int8Array(Lo.W + 1).fill(-1); (st.c || []).forEach((v, i) => { if (i <= Lo.W) carries[i] = v; });
        lastHint = null;
        clearHint();
        draw();
      },
      reset() { sel = null; pencil = false; lastHint = null; clearHint(); draw(); },
      key(ev) {
        if (ev.type !== 'keydown') return false;
        if (ev.ctrlKey || ev.metaKey || ev.altKey) return false;
        const k = ev.key;
        const m = /^(?:Digit|Numpad)([0-9])$/.exec(ev.code || '');
        const dg = m ? +m[1] : /^[0-9]$/.test(k) ? +k : -1;
        if (dg >= 0) { input(dg, ev.shiftKey && !/^[0-9]$/.test(k)); return true; }
        if (/^[a-zA-Z]$/.test(k) && P.li[k.toUpperCase()] != null) { pick({ kind: 'L', i: P.li[k.toUpperCase()] }); return true; }
        if (k === ' ' || k === 'Spacebar') { togglePencil(); return true; }
        if (k === 'Backspace' || k === 'Delete') { erase(); return true; }
        if (k === 'ArrowRight' || k === 'ArrowDown') { moveSel(1); return true; }
        if (k === 'ArrowLeft' || k === 'ArrowUp') { moveSel(-1); return true; }
        if (k === 'Escape' && sel) { sel = null; clearHint(); draw(); return false; }
        return false;
      },
      destroy() { dead = true; if (timer) clearTimeout(timer); }
    };
  }

  C.css('cryptarithm', `
    .cr-nohit, .cr-hint { pointer-events: none; }
    .cr-tile { cursor: pointer; }
    .cr-box { fill: var(--cell); stroke: var(--ink-2); stroke-opacity: .45; stroke-width: 2; transition: fill .12s; }
    .cr-tile.star .cr-box { fill: var(--board-2); stroke-dasharray: 5 4; }
    .cr-tile.star.has .cr-box { fill: var(--cell); stroke-dasharray: none; }
    .cr-tile.given .cr-box { fill: var(--board-2); stroke-opacity: .7; }
    .cr-tile:hover .cr-box { stroke: var(--accent); stroke-opacity: 1; }
    .cr-tile.same .cr-box { fill: var(--accent); fill-opacity: .14; }
    .cr-tile.sel .cr-box { fill: var(--accent); fill-opacity: .3; stroke: var(--accent); stroke-opacity: 1; stroke-width: 3; }
    .cr-tile.sel.pen .cr-box { fill: var(--teal); fill-opacity: .25; stroke: var(--teal); stroke-dasharray: 6 3; }
    .cr-tile.bad .cr-box { fill: var(--red); fill-opacity: .22; stroke: var(--red); stroke-opacity: 1; }
    .cr-big { font: 700 31px "Segoe UI", system-ui, sans-serif; fill: var(--ink); pointer-events: none; }
    .cr-big.letter { fill: var(--accent); }
    [data-theme="dark"] .cr-big.letter { fill: #a3adff; }
    .cr-big.letter.up { font-size: 21px; transform: translateY(-9px); transform-box: fill-box; }
    .cr-big.user { fill: #3a4bd8; font-weight: 600; }
    [data-theme="dark"] .cr-big.user { fill: #8f9bff; }
    .cr-big.fixed { fill: var(--ink); }
    .cr-big.starmark { fill: var(--muted); font-size: 28px; opacity: .55; }
    .cr-tile.bad .cr-big { fill: var(--red); }
    .cr-small { font: 700 11px "Segoe UI", system-ui, sans-serif; fill: var(--accent); opacity: .85; pointer-events: none; }
    [data-theme="dark"] .cr-small { fill: #a3adff; }
    .cr-notes { font: 700 12px "Segoe UI", system-ui, sans-serif; fill: var(--teal); letter-spacing: .5px; pointer-events: none; }
    .cr-notes.many { font-size: 9.5px; letter-spacing: 0; }
    .cr-notes.mid { transform: translateY(-12px); transform-box: fill-box; font-size: 14px; }
    .cr-notes.mid.many { font-size: 10px; }
    .cr-op { font: 600 34px "Segoe UI", system-ui, sans-serif; fill: var(--ink-2); }
    .cr-rule { stroke: var(--ink); stroke-width: 3.5; stroke-linecap: round; }
    .cr-carrylbl { font: 600 11px "Segoe UI", system-ui, sans-serif; fill: var(--faint); }
    .cr-carry { cursor: pointer; }
    .cr-carry rect { fill: transparent; stroke: var(--ink-2); stroke-opacity: .35; stroke-width: 1.4; stroke-dasharray: 3 3; }
    .cr-carry:hover rect { stroke: var(--accent); stroke-opacity: 1; }
    .cr-carry.has rect { stroke-dasharray: none; fill: var(--panel-2); }
    .cr-carry text { font: 700 15px "Segoe UI", system-ui, sans-serif; fill: var(--ink-2); pointer-events: none; }
    .cr-carry.ok text { fill: var(--green); }
    .cr-carry.bad text { fill: var(--red); }
    .cr-carry.bad rect { stroke: var(--red); }
    .cr-check { font: 800 18px "Segoe UI", system-ui, sans-serif; }
    .cr-check.ok { fill: var(--green); }
    .cr-check.bad { fill: var(--red); }
    .cr-thead { font: 600 11px "Segoe UI", system-ui, sans-serif; fill: var(--faint); }
    .cr-trow { cursor: pointer; }
    .cr-trbg { fill: transparent; }
    .cr-trow.sel .cr-trbg { fill: var(--accent); fill-opacity: .12; }
    .cr-trow.sel.pen .cr-trbg { fill: var(--teal); fill-opacity: .14; }
    .cr-tlet { fill: var(--accent); fill-opacity: .18; stroke: var(--accent); stroke-width: 1.5; }
    .cr-trow.given .cr-tlet { fill: var(--board-2); stroke: var(--ink-2); }
    .cr-trow.bad .cr-tlet { fill: var(--red); fill-opacity: .25; stroke: var(--red); }
    .cr-tlettxt { font: 700 17px "Segoe UI", system-ui, sans-serif; fill: var(--ink); pointer-events: none; }
    .cr-tc rect { fill: var(--cell); stroke: var(--line); stroke-width: 1; }
    .cr-tc:hover rect { stroke: var(--accent); }
    .cr-tc text { font: 600 14px "Segoe UI", system-ui, sans-serif; fill: var(--ink-2); pointer-events: none; }
    .cr-tc .cr-who { font-size: 8.5px; font-weight: 800; fill: var(--muted); }
    .cr-tc.taken text { opacity: .35; }
    .cr-tc.taken .cr-who { opacity: .9; }
    .cr-tc.taken rect { fill: var(--board-2); }
    .cr-tc.never text { opacity: .2; }
    .cr-tc.cand rect { fill: var(--teal); fill-opacity: .22; stroke: var(--teal); }
    .cr-tc.cand text { fill: var(--ink); font-weight: 800; }
    .cr-tc.out text { opacity: .22; }
    .cr-tc.mine rect { fill: var(--accent); stroke: var(--accent); fill-opacity: 1; }
    .cr-tc.mine text { fill: #fff; font-weight: 800; opacity: 1; }
    .cr-tc.mine.bad rect { fill: var(--red); stroke: var(--red); }
    .cr-tres { font: 700 15px "Segoe UI", system-ui, sans-serif; fill: var(--ink); }
    .cr-hint { fill: none; }
    .cr-hint.col { fill: var(--gold); fill-opacity: .14; stroke: var(--gold); stroke-opacity: .5; stroke-width: 1.5; stroke-dasharray: 5 4; }
    .cr-hint.target { stroke: var(--gold); stroke-width: 3.5; animation: crpulse 1.1s ease-in-out infinite; }
    @keyframes crpulse { 50% { stroke-opacity: .3; } }
    .cr-panel { width: 100%; display: flex; flex-direction: column; gap: 8px; }
    .cr-readout { font-size: .74rem; color: var(--muted); background: var(--panel-2); border: 1px solid var(--line); border-radius: 10px; padding: 6px 10px; }
    .cr-readout .eq { font: 600 1rem "Segoe UI", system-ui, sans-serif; color: var(--text); letter-spacing: .5px; word-break: break-word; }
    .cr-readout .ok { color: var(--green); }
    .cr-readout .want { color: var(--gold); font-size: .82rem; letter-spacing: 0; }
    .cr-keys { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 6px; }
    .cr-b { display: inline-flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 10px; border-radius: 10px;
      border: 1px solid var(--line); background: var(--panel-2); color: var(--text); font: 600 .82rem "Segoe UI", system-ui, sans-serif;
      cursor: pointer; user-select: none; -webkit-user-select: none; touch-action: manipulation; }
    .cr-b:hover { border-color: var(--accent); }
    .cr-b:active { transform: translateY(1px); }
    .cr-b .ico { width: 17px; height: 17px; }
    .cr-b.on { background: var(--accent); border-color: var(--accent); color: #fff; }
    .cr-key { flex-direction: column; gap: 0; padding: 5px 0 3px; min-height: 46px; }
    .cr-key b { font-size: 1.3rem; line-height: 1.1; font-weight: 700; }
    .cr-key small { font-size: .62rem; color: var(--muted); font-weight: 700; min-height: .8rem; letter-spacing: 1px; }
    .cr-key.full b { opacity: .38; }
    .cr-key.on { background: rgba(108, 123, 255, .25); color: var(--text); }
    .cr-key.cand { border-color: var(--teal); box-shadow: inset 0 0 0 1px var(--teal); }
    .cr-row { display: flex; flex-wrap: wrap; gap: 6px; }
    .cr-row .cr-b { flex: 1 1 auto; }
    .cr-pen.on { background: var(--teal); border-color: var(--teal); color: #0b1a1a; }
    .cr-opts .cr-b { background: transparent; font-weight: 500; font-size: .76rem; padding: 5px 8px; color: var(--muted); }
    .cr-opts .cr-b i { width: 10px; height: 10px; border-radius: 3px; border: 1.5px solid var(--muted); }
    .cr-opts .cr-b.on { background: transparent; color: var(--text); border-color: var(--line); }
    .cr-opts .cr-b.on i { background: var(--accent); border-color: var(--accent); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);

