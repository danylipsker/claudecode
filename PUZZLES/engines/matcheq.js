/* The Puzzle Cabinet · engines/matcheq.js
 *
 * Matchstick equations. Digits are drawn with matches in the seven places of
 * a seven-segment figure; + − × = are made of matches too; in Roman mode the
 * numbers are I, V, X and L made of matches. A match may be moved from any
 * place to any empty place (in any symbol), or taken away, or added, as the
 * puzzle says; the equation must end up true.
 *
 * data: {
 *   mode: 'roman'             (default: digits)
 *   eq:  '6+4=4'              the start, one character per place: 0-9, + - x =, Roman I V X L, and _ for an empty Roman place
 *   sol: '0+4=4'              an answer (checked by verify: true, and reached with exactly k)
 *   move: 1 | remove: 1 | add: 1
 * }
 *
 * The places of a digit: a top, b upper right, c lower right, d bottom, e lower left, f upper left, g middle.
 * The places of an operator: h middle bar, v upright, u upper bar, l lower bar, x and y the two diagonals.
 * The places of a Roman letter: i upright, p and q the two strokes of V, r and s the two strokes of X, t the foot of L.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;

  /* ---------- symbols ---------- */

  const DIG = [63, 6, 91, 79, 102, 109, 125, 7, 127, 111];            // a=1 b=2 c=4 d=8 e=16 f=32 g=64
  const DIGINV = new Map(DIG.map((m, i) => [m, String(i)]));
  const OPS = { '-': 1, '+': 3, '=': 12, 'x': 48 };                   // h=1 v=2 u=4 l=8 x=16 y=32
  const OPSINV = new Map(Object.keys(OPS).map((k) => [OPS[k], k]));
  const ROM = { I: 1, V: 6, X: 24, L: 33, _: 0 };                     // i=1 p=2 q=4 r=8 s=16 t=32
  const ROMINV = new Map(Object.keys(ROM).map((k) => [ROM[k], k]));
  const NAMES = { d: 'abcdefg', o: 'hvulxy', r: 'ipqrst' };
  const BITS = { d: 7, o: 6, r: 6 };

  // canonical Roman numerals up to 89 (I, V, X, L)
  const ROMVAL = new Map();
  function roman(n) {
    const t = [['L', 50], ['XL', 40], ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]];
    let s = '';
    for (const [r, v] of t) while (n >= v) { s += r; n -= v; }
    return s;
  }
  for (let n = 1; n < 90; n++) ROMVAL.set(roman(n), n);

  function kindOf(ch, mode) {
    if (mode === 'roman') return 'IVXL_'.includes(ch) ? 'r' : '+-=x'.includes(ch) ? 'o' : null;
    return /[0-9]/.test(ch) ? 'd' : '+-=x'.includes(ch) ? 'o' : null;
  }
  function maskOf(ch, kind) { return kind === 'd' ? DIG[+ch] : kind === 'o' ? OPS[ch] : ROM[ch]; }
  function cellsOf(eq, mode) {
    const cells = [];
    for (const ch of eq) {
      const k = kindOf(ch, mode);
      if (!k) return null;
      cells.push(k);
    }
    return cells;
  }
  const masksOf = (eq, cells) => Array.from(eq).map((ch, i) => maskOf(ch, cells[i]));
  const popcount = (m) => { let n = 0; while (m) { n += m & 1; m >>= 1; } return n; };

  // the characters an arrangement shows ('?' where a place holds no symbol)
  function show(cells, masks) {
    return cells.map((k, i) => {
      const m = masks[i];
      const s = k === 'd' ? DIGINV.get(m) : k === 'o' ? OPSINV.get(m) : ROMINV.get(m);
      return s == null ? '?' : s;
    }).join('');
  }

  // read and judge: { valid, bad: index of the first bad place, true, lhs, rhs, text }
  function judge(cells, masks, mode) {
    const chars = show(cells, masks);
    const bad = chars.indexOf('?');
    if (bad >= 0) return { valid: false, bad, chars };
    const toks = [];
    let cur = null;
    for (let i = 0; i < cells.length; i++) {
      const ch = chars[i];
      if (cells[i] === 'o') {
        if (cur == null) return { valid: false, bad: i, chars, why: 'op' };
        toks.push(cur, ch); cur = null;
      } else {
        if (ch === '_') { if (cur == null) cur = ''; continue; }
        cur = (cur == null ? '' : cur) + ch;
      }
    }
    if (cur == null) return { valid: false, bad: cells.length - 1, chars, why: 'op' };
    toks.push(cur);
    const nums = [];
    for (let i = 0; i < toks.length; i += 2) {
      const s = toks[i];
      let v;
      if (mode === 'roman') { v = ROMVAL.get(s); if (v == null) return { valid: false, bad: numStart(cells, i / 2), chars, why: s ? 'roman' : 'empty', num: s }; }
      else { if (s.length > 1 && s[0] === '0') return { valid: false, bad: numStart(cells, i / 2), chars, why: 'zero' }; v = +s; }
      nums.push(v);
    }
    const ops = [];
    for (let i = 1; i < toks.length; i += 2) ops.push(toks[i]);
    const eqs = ops.filter((o) => o === '=').length;
    if (eqs !== 1) return { valid: false, chars, why: eqs ? 'twoeq' : 'noeq' };
    const at = ops.indexOf('=');
    const lhs = calc(nums.slice(0, at + 1), ops.slice(0, at)), rhs = calc(nums.slice(at + 1), ops.slice(at + 1));
    const text = toks.map((t, i) => (i % 2 ? ({ '-': '−', x: '×', '+': '+', '=': '=' })[t] : t)).join(' ');
    return { valid: true, true: lhs === rhs, lhs, rhs, chars, text };
  }
  function numStart(cells, n) {
    let k = 0;
    for (let i = 0; i < cells.length; i++) { if (cells[i] === 'o') { k++; continue; } if (k === n) return i; }
    return 0;
  }
  function calc(nums, ops) {
    // × first, then + and − from the left
    const n = [nums[0]], o = [];
    for (let i = 0; i < ops.length; i++) {
      if (ops[i] === 'x') n[n.length - 1] = n[n.length - 1] * nums[i + 1];
      else { o.push(ops[i]); n.push(nums[i + 1]); }
    }
    let v = n[0];
    for (let i = 0; i < o.length; i++) v = o[i] === '+' ? v + n[i + 1] : v - n[i + 1];
    return v;
  }
  const isTrue = (cells, masks, mode) => { const r = judge(cells, masks, mode); return r.valid && r.true; };

  /* ---------- search ---------- */

  function slots(cells, masks) {
    const full = [], empty = [];
    cells.forEach((k, i) => { for (let b = 0; b < BITS[k]; b++) ((masks[i] >> b) & 1 ? full : empty).push(i * 8 + b); });
    return { full, empty };
  }
  const toggle = (masks, s) => { masks[s >> 3] ^= 1 << (s & 7); };
  function combos(list, k, fn) {
    const idx = [];
    const rec = (from) => {
      if (idx.length === k) { fn(idx.map((i) => list[i])); return; }
      for (let i = from; i <= list.length - (k - idx.length); i++) { idx.push(i); rec(i + 1); idx.pop(); }
    };
    rec(0);
  }
  // every true arrangement reached by exactly j changes of the kind: [{ masks, off: [slots], on: [slots] }]
  function solveEq(cells, masks0, mode, kind, j, max) {
    const out = [], seen = new Set();
    const { full, empty } = slots(cells, masks0);
    const m = masks0.slice();
    const test = (off, on) => {
      if (out.length >= (max || 1e9)) return;
      off.forEach((s) => toggle(m, s)); on.forEach((s) => toggle(m, s));
      if (isTrue(cells, m, mode)) {
        const key = m.join(',');
        if (!seen.has(key)) { seen.add(key); out.push({ masks: m.slice(), off: off.slice(), on: on.slice() }); }
      }
      off.forEach((s) => toggle(m, s)); on.forEach((s) => toggle(m, s));
    };
    if (kind === 'remove') combos(full, j, (off) => test(off, []));
    else if (kind === 'add') combos(empty, j, (on) => test([], on));
    else combos(full, j, (off) => combos(empty, j, (on) => test(off, on)));
    return out;
  }
  function ruleOf(d) {
    if (d.move != null) return { kind: 'move', k: d.move };
    if (d.remove != null) return { kind: 'remove', k: d.remove };
    if (d.add != null) return { kind: 'add', k: d.add };
    return null;
  }
  function diffSlots(a, b) {
    const off = [], on = [];
    a.forEach((m, i) => {
      const x = m ^ b[i];
      for (let bit = 0; bit < 8; bit++) if ((x >> bit) & 1) ((m >> bit) & 1 ? off : on).push(i * 8 + bit);
    });
    return { off, on };
  }

  /* ---------- the table: where every place is ---------- */

  const R = 0.3536;
  const GEO = {
    d: [[[0, 0], [1, 0]], [[1, 0], [1, 1]], [[1, 1], [1, 2]], [[0, 2], [1, 2]], [[0, 1], [0, 2]], [[0, 0], [0, 1]], [[0, 1], [1, 1]]],
    o: [[[0, 1], [1, 1]], [[0.5, 0.5], [0.5, 1.5]], [[0, 0.72], [1, 0.72]], [[0, 1.28], [1, 1.28]], [[0.5 - R, 1 - R], [0.5 + R, 1 + R]], [[0.5 - R, 1 + R], [0.5 + R, 1 - R]]],
    r: [[[0.3, 0.5], [0.3, 1.5]], [[0.26, 0.56], [0.6, 1.5]], [[0.94, 0.56], [0.6, 1.5]], [[0.3, 0.6], [0.9, 1.4]], [[0.3, 1.4], [0.9, 0.6]], [[0.3, 1.5], [1.3, 1.5]]]
  };
  const WIDTH = { d: 1, o: 1, r: 1.15 };
  function layout(cells) {
    const xs = [];
    let x = 0;
    cells.forEach((k, i) => {
      if (i) {
        const p = cells[i - 1];
        x += p === 'o' || k === 'o' ? (k === 'r' || p === 'r' ? 0.45 : 0.62) : (k === 'd' ? 0.5 : 0);
      }
      xs.push(x);
      x += WIDTH[k];
    });
    const S = [];
    cells.forEach((k, i) => {
      GEO[k].forEach((g, b) => {
        const a = [xs[i] + g[0][0], g[0][1]], c = [xs[i] + g[1][0], g[1][1]];
        let ang = G.normDeg(G.angle(G.sub(c, a)));
        if (ang >= 180) ang -= 180;
        S[i * 8 + b] = { id: i * 8 + b, cell: i, bit: b, a, b: c, mid: G.mid(a, c), ang };
      });
    });
    return { xs, width: x, slots: S };
  }

  /* ---------- making puzzles ---------- */

  const choose = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return r; };
  // grade a puzzle: how rare are the answers among all the changes of k matches, and how surprising is the answer
  function grade(eq, sol, mode, kind, k, nsols) {
    const cells = cellsOf(eq, mode), m0 = masksOf(eq, cells);
    const { full, empty } = slots(cells, m0);
    // red herrings: single changes of the puzzle's kind that still read as an equation
    let V = 0;
    const m = m0.slice();
    const t = (list) => { list.forEach((x) => toggle(m, x)); if (judge(cells, m, mode).valid) V++; list.forEach((x) => toggle(m, x)); };
    if (kind === 'remove') full.forEach((a) => t([a]));
    else if (kind === 'add') empty.forEach((b) => t([b]));
    else full.forEach((a) => empty.forEach((b) => t([a, b])));
    let s = 1.4 * Math.log10(1 + V / nsols) - 0.2;
    const ch = [];
    for (let i = 0; i < eq.length; i++) if (eq[i] !== sol[i]) ch.push(i);
    const opCh = ch.filter((i) => cells[i] === 'o');
    if (opCh.length) s += 0.5;
    if (eq.indexOf('=') !== sol.indexOf('=')) s += 0.6;
    if (ch.length === 1 && kind === 'move') s -= 0.3;       // a match moved inside one symbol is easier to spot
    if (/x/.test(eq + sol)) s += 0.3;
    if (eq.length > 5) s += 0.25 * (eq.length - 5) / 2;
    if (mode === 'roman') s += 0.2;
    if (k >= 2) s += 0.9;
    return { score: s, diff: s < 1.0 ? 1 : s < 1.5 ? 2 : s < 2.0 ? 3 : s < 2.5 ? 4 : 5 };
  }

  // a random true equation of a form ('d+d=d', 'dd-d=dd', 'r+r=r', …)
  function trueEquation(rng, form, mode) {
    const parts = form.split(/([+\-x=])/);
    for (let t = 0; t < 200; t++) {
      if (mode === 'roman') {
        const a = rng.range(1, 30), b = rng.range(1, 30);
        const op = parts[1] === '=' ? parts[3] : parts[1];
        const c = op === '+' ? a + b : a - b;
        if (c < 1 || c > 40) continue;
        const [x, y, z] = [roman(a), roman(b), roman(c)];
        return parts[1] === '=' ? z + '=' + x + op + y : x + op + y + '=' + z;
      }
      // the number alone on its side of '=' is worked out from the others, chosen at random
      const numParts = [], opsList = [];
      parts.forEach((p, i) => (i % 2 ? opsList : numParts).push(p));
      const eqIdx = opsList.indexOf('=');
      const range = numParts.map((p) => (p.length === 1 ? [0, 9] : [10, 99]));
      const lone = numParts.length - (eqIdx + 1) === 1 ? numParts.length - 1 : eqIdx === 0 ? 0 : -1;
      if (lone < 0) return null;
      const nums = numParts.map((p, i) => (i === lone ? 0 : rng.range(range[i][0], range[i][1])));
      const v = calc(nums.filter((x, i) => i !== lone), opsList.filter((o) => o !== '='));
      if (v < range[lone][0] || v > range[lone][1]) continue;
      nums[lone] = v;
      let s = '';
      numParts.forEach((p, i) => { s += String(nums[i]); if (i < opsList.length) s += opsList[i]; });
      if (s.length === form.length) return s;
    }
    return null;
  }

  // Roman equations keep an empty place on each side of every number, then trim places empty in both start and answer
  function padRoman(eq) { return eq.split(/([+\-=])/).map((p, i) => (i % 2 ? p : '_' + p + '_')).join(''); }
  function trimRoman(a, b) {
    let x = '', y = '';
    for (let i = 0; i < a.length; i++) if (!(a[i] === '_' && b[i] === '_')) { x += a[i]; y += b[i]; }
    return [x, y];
  }

  // one attempt at a puzzle from a true equation: undo k changes at random, keep it if it is false, readable and has one answer
  function fromTrue(rng, T, mode, kind, k, opts) {
    opts = opts || {};
    let eqT = mode === 'roman' ? padRoman(T) : T;
    const cells = cellsOf(eqT, mode);
    if (!cells) return null;
    const mT = masksOf(eqT, cells);
    const { full, empty } = slots(cells, mT);
    const m = mT.slice();
    // the reverse of the rule: to make a 'remove' puzzle, add matches to a true equation, and so on
    const pickN = (list, n) => { const l = list.slice(); rng.shuffle(l); return l.slice(0, n); };
    if (kind === 'move') { pickN(full, k).forEach((s) => toggle(m, s)); pickN(empty, k).forEach((s) => toggle(m, s)); }
    else if (kind === 'remove') pickN(empty, k).forEach((s) => toggle(m, s));
    else pickN(full, k).forEach((s) => toggle(m, s));
    const J = judge(cells, m, mode);
    if (!J.valid || J.true) return null;
    let eq = show(cells, m), sol = eqT;
    if (mode === 'roman') [eq, sol] = trimRoman(eq, sol);
    return checkPuzzle(eq, sol, mode, kind, k, opts);
  }
  // the facts verify() and the generators need: answers with exactly k, none with fewer
  function checkPuzzle(eq, sol, mode, kind, k, opts) {
    opts = opts || {};
    const cells = cellsOf(eq, mode);
    if (!cells) return null;
    const m = masksOf(eq, cells);
    for (let j = 1; j < k; j++) if (solveEq(cells, m, mode, kind, j, 1).length) return null;
    const sols = solveEq(cells, m, mode, kind, k);
    if (!sols.length) return null;
    if (opts.unique && sols.length > 1) return null;
    const g = grade(eq, sol, mode, kind, k, sols.length);
    return { eq, sol, mode, kind, k, sols: sols.length, score: g.score, diff: g.diff };
  }

  const FORMS = {
    digits: [null, ['d+d=d', 'd-d=d'], ['d+d=d', 'd-d=d', 'd=d+d', 'd+d=dd'], ['d+d=dd', 'dd-d=d', 'dd+d=dd', 'dxd=d', 'd=d-d'], ['dd+d=dd', 'dd-d=dd', 'dxd=dd', 'd+d+d=d', 'dd=d+dd'], ['dd+dd=dd', 'dd-dd=d', 'dxd=dd', 'd+d-d=d', 'dd-d=dd']],
    roman: [null, ['r+r=r', 'r-r=r'], ['r+r=r', 'r-r=r', 'r=r+r'], ['r+r=r', 'r-r=r', 'r=r-r', 'r=r+r'], ['r+r=r', 'r-r=r', 'r=r-r'], ['r+r=r', 'r-r=r', 'r=r-r', 'r=r+r']]
  };
  function sayRule(kind, k) {
    const m = k === 1 ? 'one match' : ['', 'one', 'two', 'three'][k] + ' matches';
    return kind === 'move' ? 'Move ' + m : kind === 'remove' ? 'Take away ' + m : 'Add ' + m;
  }
  const TEXTS = {
    move: ['This sum is wrong. {R} to mend it.', 'Somebody has been careless with the matches. {R} so that the sum comes out right.', '{R} to make the equation true.', 'Not true as it stands. {R} to put it right.'],
    remove: ['This sum is wrong. {R} to make it right.', 'One match too many: {r} so that the equation is true.', '{R} to make the equation true.'],
    add: ['This sum is wrong. {R} to make it right.', 'A match is missing somewhere: {r} so that the equation is true.', '{R} to make the equation true.']
  };
  function puzzleOf(P, rng, diff) {
    const J = judge(cellsOf(P.eq, P.mode), masksOf(P.eq, cellsOf(P.eq, P.mode)), P.mode);
    const title = J.text.replace(/_/g, '');
    const t = rng.pick(TEXTS[P.kind]);
    const R0 = sayRule(P.kind, P.k);
    const text = t.replace('{R}', R0).replace('{r}', R0.charAt(0).toLowerCase() + R0.slice(1)) + (P.mode === 'roman' ? ' The numbers are Roman.' : '');
    const data = { eq: P.eq, sol: P.sol };
    if (P.mode === 'roman') data.mode = 'roman';
    data[P.kind] = P.k;
    return { title, text, diff: diff || P.diff, data };
  }

  function attempt(rng, level, mode) {
    const form = rng.pick(FORMS[mode][level]);
    const T = trueEquation(rng, form, mode);
    if (!T) return null;
    const r = rng();
    const kind = level <= 2 ? (r < 0.8 ? 'move' : r < 0.9 ? 'remove' : 'add') : (r < 0.85 ? 'move' : r < 0.93 ? 'remove' : 'add');
    const k = kind === 'move' && level >= 4 && rng() < 0.5 ? 2 : 1;
    const P = fromTrue(rng, T, mode, kind, k, { unique: true });
    if (!P || P.diff !== level) return null;
    return puzzleOf(P, rng, level);
  }

  C.matcheq = { DIG, OPS, ROM, ROMVAL, roman, cellsOf, masksOf, show, judge, solveEq, slots, diffSlots, ruleOf, layout, grade, trueEquation, fromTrue, checkPuzzle, puzzleOf, padRoman, trimRoman, FORMS, attempt };

  /* ---------- words ---------- */

  const ORD = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth'];
  const OPNAME = { '+': 'the plus sign', '-': 'the minus sign', '=': 'the equals sign', x: 'the times sign' };
  const validMask = (kind, m) => (kind === 'd' ? DIGINV.has(m) : kind === 'o' ? OPSINV.has(m) : ROMINV.has(m));
  function describe(cells, masks, i) {
    const chars = show(cells, masks);
    const ch = chars[i], kind = cells[i];
    if (kind === 'o') return ch === '?' ? 'the ' + ORD[opIndex(cells, i)] + ' sign' : OPNAME[ch];
    if (ch === '?') return 'the ' + ORD[i] + ' symbol';
    if (kind === 'r' && ch === '_') return 'the empty place ' + (i && cells[i - 1] === 'r' && chars[i - 1] !== '_' ? 'after the ' + chars[i - 1] : 'in the ' + ORD[numIndex(cells, i)] + ' number');
    const same = [];
    for (let j = 0; j < cells.length; j++) if (cells[j] === kind && chars[j] === ch) same.push(j);
    return 'the ' + (same.length > 1 ? ORD[same.indexOf(i)] + ' ' : '') + ch;
  }
  function opIndex(cells, i) { let n = 0; for (let j = 0; j < i; j++) if (cells[j] === 'o') n++; return n; }
  function numIndex(cells, i) { let n = 0; for (let j = 0; j < i; j++) if (cells[j] === 'o') n++; return n; }
  const plural = (n) => (n === 1 ? 'one match' : ['', 'one', 'two', 'three'][n] + ' matches');

  /* ---------- the engine ---------- */

  C.engine({
    id: 'matcheq',
    name: 'Matchstick equations',
    deps: ['js/lib/matches.js'],
    noMoves: true,
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    workbench: { snapPx: 12 },
    about: '**Drag** a match to any empty place, in the same symbol or another; a dashed outline shows where it will land, and the faint dots show every place a match can go. **Click** a match to turn it where it lies (a minus bar can become the upright of a plus). Taken-away matches go in the matchbox; spare matches wait there.\n\nDigits have the usual seven-stroke shapes: 6 with its top bar, 9 with its bottom bar, 7 with three matches, 1 with two on the right. No number starts with 0, × comes before + and −, and there is exactly one equals sign. The line under the sum says how it reads now.',
    generates: ['matchstick-equations', 'roman-matches'],
    generate(rng, level, meta) {
      const mode = meta && meta.id === 'roman-matches' ? 'roman' : 'digits';
      const t0 = Date.now();
      for (let tries = 0; tries < 6000 && Date.now() - t0 < 500; tries++) {
        const p = attempt(rng, level, mode);
        if (p) return p;
      }
      return null;
    },

    verify(p) {
      const d = p.data;
      if (!d || !d.eq || !d.sol) return { ok: false, err: 'eq and sol are needed' };
      const mode = d.mode === 'roman' ? 'roman' : 'digits';
      const cells = cellsOf(d.eq, mode), cells2 = cellsOf(d.sol, mode);
      if (!cells || !cells2) return { ok: false, err: 'unknown symbol' };
      if (cells.length !== cells2.length || cells.some((k, i) => k !== cells2[i])) return { ok: false, err: 'eq and sol must have the same places' };
      const R = ruleOf(d);
      if (!R || !(R.k >= 1 && R.k <= 3)) return { ok: false, err: 'say how many matches to move, remove or add' };
      const m0 = masksOf(d.eq, cells), m1 = masksOf(d.sol, cells);
      const J0 = judge(cells, m0, mode);
      if (!J0.valid) return { ok: false, err: 'the start does not read as an equation' };
      if (J0.true) return { ok: false, err: 'the start is already true' };
      const J1 = judge(cells, m1, mode);
      if (!J1.valid || !J1.true) return { ok: false, err: 'the answer ' + d.sol + ' is not a true equation' };
      const { off, on } = diffSlots(m0, m1);
      if (R.kind === 'move' && (off.length !== R.k || on.length !== R.k)) return { ok: false, err: 'the answer does not move exactly ' + R.k };
      if (R.kind === 'remove' && (off.length !== R.k || on.length)) return { ok: false, err: 'the answer does not take away exactly ' + R.k };
      if (R.kind === 'add' && (on.length !== R.k || off.length)) return { ok: false, err: 'the answer does not add exactly ' + R.k };
      for (let j = 1; j < R.k; j++) if (solveEq(cells, m0, mode, R.kind, j, 1).length) return { ok: false, err: 'it can be done with ' + plural(j) };
      return { ok: true };
    },

    mount(ctx, p) {
      const wb = ctx.wb, d = p.data, kit = C.matchKit;
      const mode = d.mode === 'roman' ? 'roman' : 'digits';
      const cells = cellsOf(d.eq, mode);
      const R = ruleOf(d);
      if (!cells || !R) { ctx.say('This puzzle is broken.', 'warn'); return {}; }
      kit.install(wb);
      const L = layout(cells), SL = L.slots;
      const m0 = masksOf(d.eq, cells);
      const S0 = slots(cells, m0).full, S0set = new Set(S0);
      if (!p.goal) ctx.setGoal(({ move: 'Move', remove: 'Take away', add: 'Add' })[R.kind] + ' exactly **' + plural(R.k) + '** so that the equation is true.');
      const timers = [];
      const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
      let busy = false;
      const hasX = /x/.test(d.eq + d.sol);

      /* the slate, the faint places, the reading line, the matchbox */
      const W = L.width;
      const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
      const YT = mode === 'roman' ? 0.45 : 0, YB = mode === 'roman' ? 1.55 : 2; // the tops and bottoms of the symbols
      ctx.s('rect', { x: -0.75, y: YT - 0.6, width: W + 1.5, height: YB - YT + 1.75, rx: 0.3, class: 'me-slate' }, bg);
      const places = ctx.s('g', { class: 'me-places' }, bg);
      cells.forEach((k, i) => {
        for (let b = 0; b < BITS[k]; b++) {
          if (k === 'o' && b >= 4 && !hasX) continue;
          if (k === 'r' && b === 5 && !/L/.test(d.eq + d.sol)) continue;
          const s = SL[i * 8 + b];
          const u = G.norm(G.sub(s.b, s.a));
          const a = G.add(s.a, G.mul(u, 0.12)), c = G.sub(s.b, G.mul(u, 0.12));
          ctx.s('line', { x1: C.fmtNum(a[0]), y1: C.fmtNum(a[1]), x2: C.fmtNum(c[0]), y2: C.fmtNum(c[1]), class: 'me-place' + (k === 'o' ? ' op' : '') }, places);
        }
      });
      const badG = ctx.s('g', { class: 'me-bad' }, board);
      const readG = ctx.s('g', { class: 'me-readg' }, board);
      const hintG = ctx.s('g', { class: 'me-hintg' }, top);
      const ghostG = ctx.s('g', { class: 'me-ghostg' }, top);
      const narrow = wb.size().w < 560;
      const trayCap = R.kind === 'add' ? R.k : Math.max(2, R.k);
      const th = Math.max(1.25, 0.55 + 0.21 * (trayCap + 1));
      const tray = narrow ? { x: W / 2 - 0.8, y: YB + 1.7, w: 1.6, h: th } : { x: W + 1.35, y: 1.05 - th / 2, w: 1.6, h: th };
      const trayEl = kit.tray(board, tray, R.kind === 'remove' ? 'taken away' : R.kind === 'add' ? 'spare matches' : 'set aside');
      const bb = G.bbox([[[-0.75, YT - 0.6], [W + 0.75, YB + 1.15], [tray.x, tray.y - 0.5], [tray.x + tray.w, tray.y + tray.h + 0.2]]]);
      wb.setBounds({ x0: bb.x0 - 0.3, y0: bb.y0 - 0.3, x1: bb.x1 + 0.3, y1: bb.y1 + 0.3 }, 0.05);

      /* the matches */
      const add = (spec) => wb.add(Object.assign({ type: 'match', kind: 'match', snap: false }, spec));
      S0.forEach((s, i) => {
        const g = SL[s];
        add({ id: 'm' + i, name: 'Match ' + (i + 1), x: g.mid[0], y: g.mid[1], rot: G.normDeg(g.ang + (ctx.rng() < 0.5 ? 180 : 0)),
          move: R.kind !== 'add', remove: R.kind !== 'add', data: { s, home: s } });
      });
      if (R.kind === 'add') for (let j = 0; j < R.k; j++) add({ id: 's' + j, name: 'Spare match ' + (j + 1), x: tray.x, y: tray.y, rot: j % 2 ? 180 : 0, move: true, remove: true, data: { s: null, spare: true, t: j + 1 } });

      const pieces = () => wb.all().filter((o) => o.type === 'match');
      function masksNow(except) {
        const m = cells.map(() => 0);
        pieces().forEach((o) => { if (o !== except && o.data.s != null) m[o.data.s >> 3] |= 1 << (o.data.s & 7); });
        return m;
      }
      function whoOn() { const w = new Map(); pieces().forEach((o) => { if (o.data.s != null) w.set(o.data.s, o); }); return w; }
      let tseq = 100;
      function putOn(o, s) {
        const g = SL[s];
        o.x = g.mid[0]; o.y = g.mid[1];
        o.rot = kit.facing(g.ang, o.rot);
        o.data.s = s;
        delete o.data.t;
        wb.renderObj(o);
      }
      function toTray(o) { o.data.s = null; o.data.t = ++tseq; }
      function layoutTray(glide) {
        const inTray = pieces().filter((o) => o.data.s == null).sort((a, b) => (a.data.t || 0) - (b.data.t || 0) || (a.id < b.id ? -1 : 1));
        inTray.forEach((o, i) => {
          const sp = kit.traySpot(tray, i, inTray.length);
          const rot = kit.facing(0, o.rot);
          if (Math.abs(o.x - sp.x) < 1e-6 && Math.abs(o.y - sp.y) < 1e-6 && Math.abs(G.normDeg(o.rot) - rot) < 1e-6) return;
          const from = { x: o.x, y: o.y, rot: o.rot };
          o.x = sp.x; o.y = sp.y; o.rot = rot;
          wb.renderObj(o);
          if (glide && glide !== o) kit.glide(wb, o, from, 200);
        });
      }
      function reading() {
        const m = masksNow();
        const J = judge(cells, m, mode);
        readG.innerHTML = '';
        badG.innerHTML = '';
        const chars = show(cells, m);
        for (let i = 0; i < cells.length; i++) {
          if (chars[i] !== '?') continue;
          const x0 = L.xs[i], w = cells[i] === 'r' ? 1.15 : 1;
          ctx.s('rect', { x: x0 - 0.18, y: YT - 0.22, width: w + 0.36, height: YB - YT + 0.44, rx: 0.14 }, badG);
        }
        let text, cls;
        if (J.valid) {
          text = J.text + (J.true ? '   ✓ true' : '   ✗ ' + J.lhs + ' is not ' + J.rhs);
          cls = J.true ? 'good' : 'bad';
        } else {
          const i = J.bad;
          text = J.why === 'twoeq' ? 'two equals signs' : J.why === 'noeq' ? 'no equals sign' : J.why === 'zero' ? 'a number cannot start with 0' : J.why === 'roman' ? '“' + J.num + '” is not a Roman number' :
            i != null ? 'the ' + ORD[i] + ' place shows no ' + (cells[i] === 'd' ? 'digit' : cells[i] === 'o' ? 'sign' : 'letter') : 'not an equation';
          cls = 'warn';
        }
        kit.text(readG, W / 2, YB + 0.8, text, 0.34, 'me-read ' + cls);
        return J;
      }
      function stats() {
        const m = masksNow();
        const now = slots(cells, m).full;
        const nowSet = new Set(now);
        let vac = 0;
        S0.forEach((s) => { if (!nowSet.has(s)) vac++; });
        const spOn = pieces().filter((o) => o.data.spare && o.data.s != null).length;
        if (R.kind === 'move') ctx.stat('Moved', vac + ' of ' + R.k);
        else if (R.kind === 'remove') ctx.stat('Taken away', vac + ' of ' + R.k);
        else ctx.stat('Added', spOn + ' of ' + R.k);
      }
      function sync(glide) { layoutTray(glide); reading(); stats(); }

      /* where a dragged match would land */
      const canTray = (o) => (R.kind === 'add' ? !!o.data.spare : true);
      const allowed = (o) => (R.kind === 'remove' ? [o.data.home] : R.kind === 'add' && !o.data.spare ? [] : null);
      const inTrayBox = (pt) => pt[0] > tray.x - 0.3 && pt[0] < tray.x + tray.w + 0.3 && pt[1] > tray.y - 0.35 && pt[1] < tray.y + tray.h + 0.3;
      function target(o, pt) {
        if (inTrayBox(pt)) return canTray(o) ? { tray: true } : null;
        const m = masksNow(o);
        const list = allowed(o);
        let best = null, bd = 0.62;
        const test = (s) => {
          const g = SL[s];
          if (!g || ((m[g.cell] >> g.bit) & 1)) return;
          const dd = G.dist(g.mid, pt);
          if (dd >= bd + 0.4) return;
          let da = Math.abs(g.ang - G.normDeg(o.rot) % 180);
          da = Math.min(da, 180 - da);
          let score = dd + 0.16 * da / 90;
          if (!validMask(cells[g.cell], m[g.cell] | (1 << g.bit))) score += 0.22;
          if (score < bd) { bd = score; best = s; }
        };
        if (list) list.forEach(test); else SL.forEach((g) => g && test(g.id));
        return best != null ? { s: best } : null;
      }

      /* dragging, tapping, taking away */
      let drag = null;
      wb.handlers.pick = (o, objs) => {
        if (o.type !== 'match') return;
        if (objs.length > 1) { objs.length = 0; if (o.move !== false) objs.push(o); wb.select([o]); }
        kit.stop(o.id);
        clearHint();
        drag = { o, from: { s: o.data.s }, last: undefined };
        if (o.move === false) ctx.toast('The matches of the equation stay put here: add spares from the box.');
      };
      wb.handlers.dragging = (objs) => {
        const o = objs[0];
        if (!o || !drag || drag.o !== o || busy) return;
        const tg = target(o, [o.x, o.y]);
        const key = tg ? (tg.tray ? 'tray' : tg.s) : '';
        if (key === drag.last) return;
        drag.last = key;
        ghostG.innerHTML = '';
        trayEl.classList.toggle('hot', !!(tg && tg.tray));
        if (tg && tg.s != null) {
          const g = SL[tg.s];
          kit.ghost(ghostG, g.a, g.b);
          const nr = kit.facing(g.ang, o.rot);
          if (Math.abs(nr - G.normDeg(o.rot)) > 0.5) { o.rot = nr; wb.renderObj(o); o.el.classList.add('drag'); }
        }
      };
      wb.handlers.settle = (objs) => {
        const o = objs.find((q) => q.type === 'match');
        ghostG.innerHTML = '';
        trayEl.classList.remove('hot');
        if (!o) return;
        const from = { x: o.x, y: o.y, rot: o.rot };
        const tg = target(o, [o.x, o.y]);
        let landed = true;
        if (tg && tg.s != null) putOn(o, tg.s);
        else if (tg && tg.tray) toTray(o);
        else {
          landed = false;
          const f = drag && drag.o === o ? drag.from.s : o.data.s;
          if (f != null) putOn(o, f); else toTray(o);
          ctx.toast(R.kind === 'remove' ? 'Here matches are only taken away: drop it in the box.' : 'No free place there.');
        }
        drag = null;
        sync(o);
        kit.glide(wb, o, from, landed ? 150 : 260);
        ctx.sfx(landed ? 'snap' : 'tap');
      };
      wb.handlers.remove = (objs) => {
        const ok = objs.filter((o) => o.type === 'match' && canTray(o) && o.data.s != null);
        if (!ok.length || busy) return true;
        const from = ok.map((o) => ({ o, t: { x: o.x, y: o.y, rot: o.rot } }));
        ok.forEach(toTray);
        wb.select([]);
        sync();
        from.forEach((f) => kit.glide(wb, f.o, f.t, 240));
        ctx.sfx('tap');
        ctx.changed('remove');
        return true;
      };
      wb.on('tap', (ev) => {
        const o = ev && ev.obj;
        drag = null;
        if (!o || o.type !== 'match' || busy) return;
        const from = { x: o.x, y: o.y, rot: o.rot };
        if (R.kind === 'remove') {
          if (o.data.s != null) toTray(o);
          else if (!whoOn().has(o.data.home)) putOn(o, o.data.home);
          else return;
        } else {
          if (o.move === false) { ctx.toast('The matches of the equation stay put here: add spares from the box.'); return; }
          if (o.data.s == null) return;
          // turn it where it lies: the other empty places at the same spot, in turn
          const g0 = SL[o.data.s], m = masksNow(o);
          const alts = SL.filter((g) => g && g.cell === g0.cell && G.dist(g.mid, g0.mid) < 0.2 && !((m[g.cell] >> g.bit) & 1)).sort((a, b) => a.ang - b.ang);
          if (alts.length < 2) return;
          const i = alts.findIndex((g) => g.id === o.data.s);
          putOn(o, alts[(i + 1) % alts.length].id);
        }
        wb.select([]);
        sync();
        kit.glide(wb, o, from, 200);
        ctx.sfx('tap');
        ctx.changed('turn');
      });
      const onRestore = () => { drag = null; clearHint(); sync(); };
      wb.on('restore', onRestore);

      /* hints and the answer */
      let hintTimer = null;
      function clearHint() {
        clearTimeout(hintTimer);
        hintG.innerHTML = '';
        pieces().forEach((o) => o.el && o.el.classList.remove('mk-hint'));
      }
      let answers = null;
      function allAnswers() {
        if (answers) return answers;
        answers = solveEq(cells, m0, mode, R.kind, R.k).map((a) => a.masks);
        if (!answers.length) answers = [masksOf(d.sol, cells)];
        return answers;
      }
      function bestPlan() {
        const m = masksNow();
        let best = null, bd = Infinity;
        allAnswers().forEach((a) => {
          const { off, on } = diffSlots(m, a);
          const cost = off.length + on.length;
          if (cost < bd) { bd = cost; best = { a, off, on }; }
        });
        return best;
      }
      function steps(P) {
        const who = whoOn();
        const trayPcs = pieces().filter((o) => o.data.s == null);
        const out = [];
        if (R.kind === 'remove') {
          P.on.forEach((s) => { const o = trayPcs.find((q) => q.data.home === s); if (o) out.push({ o, to: s, back: true }); });
          P.off.forEach((s) => out.push({ o: who.get(s), to: null }));
        } else {
          const movers = P.off.map((s) => who.get(s)).filter((o) => o && (R.kind !== 'add' || o.data.spare));
          const spare = trayPcs.filter(canTray);
          P.on.forEach((s) => {
            let o = null;
            if (movers.length) {
              let bi = 0, bdd = Infinity;
              movers.forEach((q, i) => { const dd = G.dist([q.x, q.y], SL[s].mid); if (dd < bdd) { bdd = dd; bi = i; } });
              o = movers.splice(bi, 1)[0];
            } else o = spare.shift();
            if (o) out.push({ o, to: s });
          });
          movers.forEach((o) => out.push({ o, to: null }));
        }
        return out.filter((s) => s.o);
      }
      function cellBox(i, cls) {
        const x0 = L.xs[i], w = cells[i] === 'r' ? 1.15 : 1;
        ctx.s('rect', { x: x0 - 0.22, y: YT - 0.26, width: w + 0.44, height: YB - YT + 0.52, rx: 0.16, class: 'me-cellhint ' + (cls || '') }, hintG);
      }

      function check() {
        const m = masksNow();
        const nowSet = new Set(slots(cells, m).full);
        let vac = 0;
        S0.forEach((s) => { if (!nowSet.has(s)) vac++; });
        const trayOrig = pieces().filter((o) => o.data.s == null && !o.data.spare).length;
        const spOn = pieces().filter((o) => o.data.spare && o.data.s != null).length;
        if (R.kind === 'move') {
          if (trayOrig) return { solved: false, msg: (trayOrig === 1 ? 'A match is' : trayOrig + ' matches are') + ' still in the box: every match must be back in the equation.' };
          if (vac > R.k) return { solved: false, msg: 'That is ' + plural(vac) + ' moved; the puzzle allows ' + R.k + '.' };
        } else if (R.kind === 'remove') {
          if (vac !== R.k) return { solved: false, msg: vac < R.k ? 'Take away ' + plural(R.k - vac) + ' more.' : 'Too many taken away: exactly ' + plural(R.k) + ', please.' };
        } else if (spOn !== R.k) return { solved: false, msg: 'Add ' + plural(R.k - spOn) + ' more.' };
        const J = judge(cells, m, mode);
        if (!J.valid) return { solved: false, msg: 'That does not read as an equation yet.' };
        if (!J.true) return { solved: false, msg: 'It reads ' + J.text + ' — but ' + J.lhs + ' is not ' + J.rhs + '.' };
        return { solved: true, msg: J.text + ' — true.' };
      }

      sync();

      return {
        check,
        hint(n) {
          const P = bestPlan();
          if (!P) return null;
          const st = steps(P);
          if (!st.length) return 'The equation is true now: press Check.';
          const s0 = st[0];
          const m = masksNow();
          const src = s0.o.data.s != null ? s0.o.data.s >> 3 : -1, dst = s0.to != null ? s0.to >> 3 : -1;
          const srcName = src >= 0 ? describe(cells, m, src) : 'the box';
          const dstName = dst >= 0 ? describe(cells, m, dst) : 'the box';
          if (n === 0 && !s0.back) {
            const text = R.kind === 'add' ? cap(dstName) + ' needs another match.' : R.kind === 'remove' ? 'One match of ' + srcName + ' has to go.' : 'Look at ' + srcName + ': one of its matches belongs somewhere else.';
            return { text, show() { clearHint(); cellBox(dst >= 0 && R.kind === 'add' ? dst : src); hintTimer = setTimeout(clearHint, 4000); } };
          }
          if (n === 1 && R.kind === 'move' && !s0.back && src >= 0) {
            return { text: 'The match from ' + srcName + ' goes to ' + (dst === src ? 'another place in the same symbol' : dstName) + '.', show() { clearHint(); cellBox(src); if (dst !== src) cellBox(dst, 'to'); hintTimer = setTimeout(clearHint, 4000); } };
          }
          const text = s0.back ? 'The glowing match should not have been taken away: put it back.' : s0.to == null ? 'Take away the glowing match.' : s0.o.data.s == null ? 'Lay the glowing match from the box on the dashed outline.' : 'Move the glowing match to the dashed outline.';
          return { text: text + (st.length > 1 ? ' (Then one more.)' : ''), show() { clearHint(); if (s0.o.el) s0.o.el.classList.add('mk-hint'); if (s0.to != null) kit.ghost(hintG, SL[s0.to].a, SL[s0.to].b, 'hint'); hintTimer = setTimeout(clearHint, 5000); } };
        },
        solve() {
          const P = bestPlan();
          if (!P) return;
          clearHint();
          wb.select([]);
          busy = true;
          const st = steps(P);
          let i = 0;
          const next = () => {
            if (i >= st.length) { busy = false; sync(); ctx.changed('solve'); return; }
            const s = st[i++];
            const o = wb.get(s.o.id);
            if (o) {
              const from = { x: o.x, y: o.y, rot: o.rot };
              if (s.to != null) putOn(o, s.to); else toTray(o);
              sync(o);
              kit.glide(wb, o, from, 450);
              ctx.sfx('snap');
            }
            later(next, C.anim(560));
          };
          next();
        },
        explain() {
          const J0 = judge(cells, m0, mode), J1 = judge(cells, masksOf(d.sol, cells), mode);
          const n = allAnswers().length;
          return J0.text + ' becomes **' + J1.text + '**.' + (n > 1 ? ' (There ' + (n === 2 ? 'is one other answer' : 'are ' + (n - 1) + ' other answers') + ' as well, and they count too.)' : ' It is the only answer.');
        },
        getState() { return { v: 1 }; },
        setState() { busy = false; ghostG.innerHTML = ''; onRestore(); },
        destroy() {
          timers.forEach(clearTimeout);
          clearTimeout(hintTimer);
          pieces().forEach((o) => kit.stop(o.id));
          wb.off('restore', onRestore);
          ['pick', 'dragging', 'settle', 'remove'].forEach((h) => { wb.handlers[h] = null; });
        }
      };
    },

    thumb(p) {
      const d = p.data, kit = C.matchKit;
      const mode = d.mode === 'roman' ? 'roman' : 'digits';
      const cells = cellsOf(d.eq, mode);
      if (!cells || !kit) return '';
      const L = layout(cells);
      const m = masksOf(d.eq, cells);
      let s = kit.svgOpen({ x0: 0, y0: mode === 'roman' ? 0.4 : 0, w: L.width, h: mode === 'roman' ? 1.2 : 2 }, 0.45);
      slots(cells, m).full.forEach((id) => { const g = L.slots[id]; s += kit.svgMatch(g.a, g.b, 1.3); });
      return s + '</svg>';
    }
  });

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  C.css('matcheq', `
    .me-slate { fill: var(--board); stroke: var(--line); stroke-width: .03; }
    .me-place { stroke: var(--grid-2); stroke-width: .05; stroke-linecap: round; stroke-dasharray: .001 .09; }
    .me-place.op { stroke-dasharray: .001 .12; }
    .me-bad rect { fill: rgba(255, 107, 107, .08); stroke: var(--red); stroke-width: .03; stroke-dasharray: .1 .07; }
    .me-read { font-weight: 700; font-family: "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .me-read.good { fill: var(--green); }
    .me-read.bad { fill: var(--muted); }
    .me-read.warn { fill: var(--warn); }
    .me-cellhint { fill: rgba(255, 209, 102, .1); stroke: var(--gold); stroke-width: .05; stroke-dasharray: .12 .08; animation: mkpulse .8s ease-in-out infinite; }
    .me-cellhint.to { fill: rgba(78, 203, 141, .1); stroke: var(--green); }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
