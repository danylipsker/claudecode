/* The Puzzle Cabinet · engines/pegs.js
 *
 * Peg solitaire. A peg jumps over a neighbouring peg into the empty hole
 * straight beyond it, and the peg jumped over is taken off the board. On
 * square boards pegs jump across and up or down (and diagonally where the
 * puzzle says so); on triangular boards along the six directions of the
 * triangle's lines.
 *
 * data: {
 *   geo:   'sq' | 'tri'
 *   board: ['  ooo  ', ...]   'o' a peg, '.' an empty hole, ' ' no hole. On a
 *                             triangle, row r (from the top) has r + 1 holes.
 *   diag:  true               square boards: diagonal jumps allowed
 *   round: true               draw the board as a round wooden board
 *   goal:  { one: true }      one peg left, anywhere
 *        | { one: 'd4' }      one peg left, in that hole
 *        | { pegs: ['c3', ...] }   exactly these pegs left
 *   sol:   [from, to, from, to, ...]   hole indices (reading order) of a solution
 * }
 * Holes are named like a chessboard on square boards — columns a, b, c … from
 * the left, rows 1, 2, 3 … from the top, so the centre of the English board
 * is d4 — and numbered 1, 2, 3 … in reading order on triangles.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const H3 = Math.sqrt(3) / 2;

  /* ---------- the board ---------- */

  const cache = new Map();
  function parse(d) {
    const ck = d.geo + '|' + d.board.join('/') .replace(/o/g, '.') + '|' + (d.diag ? 1 : 0);
    if (cache.has(ck)) return cache.get(ck);
    const tri = d.geo === 'tri';
    const holes = [], at = new Map();
    d.board.forEach((row, r) => {
      for (let c = 0; c < row.length; c++) {
        const ch = row[c];
        if (ch !== 'o' && ch !== '.' && ch !== 'x') continue;
        const i = holes.length;
        const x = tri ? c - r / 2 : c, y = tri ? r * H3 : r;
        holes.push({ r, c, x, y, name: tri ? String(i + 1) : colName(c) + (r + 1) });
        at.set(r + ',' + c, i);
      }
    });
    const dirs = tri ? [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [-1, -1]]
      : d.diag ? [[0, 1], [1, 0], [0, -1], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]] : [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const jumps = holes.map((h) => {
      const out = [];
      dirs.forEach(([dr, dc]) => {
        const o = at.get((h.r + dr) + ',' + (h.c + dc)), t = at.get((h.r + 2 * dr) + ',' + (h.c + 2 * dc));
        if (o != null && t != null) out.push([o, t]);
      });
      return out;
    });
    const byName = new Map(holes.map((h, i) => [h.name, i]));
    const B = { holes, jumps, at, byName, n: holes.length, tri, syms: symmetries(holes, at, tri) };
    cache.set(ck, B);
    return B;
  }
  function colName(c) { return c < 26 ? String.fromCharCode(97 + c) : 'z' + (c - 25); }

  // the board's symmetries, as permutations of the holes
  function symmetries(holes, at, tri) {
    const out = [];
    if (tri) {
      // a full triangle of rows: (r, c) with c <= r; the six symmetries in barycentric form
      const n = Math.max.apply(null, holes.map((h) => h.r)) + 1;
      const maps = [
        (r, c) => [r, c], (r, c) => [r, r - c],
        (r, c) => [n - 1 - c, r - c], (r, c) => [n - 1 - c, n - 1 - r],
        (r, c) => [n - 1 - r + c, c], (r, c) => [n - 1 - r + c, n - 1 - r]
      ];
      maps.forEach((f) => { const p = perm(holes, at, f); if (p) out.push(p); });
    } else {
      let r0 = Infinity, r1 = -Infinity, c0 = Infinity, c1 = -Infinity;
      holes.forEach((h) => { r0 = Math.min(r0, h.r); r1 = Math.max(r1, h.r); c0 = Math.min(c0, h.c); c1 = Math.max(c1, h.c); });
      const R = r0 + r1, Cc = c0 + c1;
      const maps = [
        (r, c) => [r, c], (r, c) => [R - r, c], (r, c) => [r, Cc - c], (r, c) => [R - r, Cc - c]
      ];
      if (r1 - r0 === c1 - c0) maps.push((r, c) => [c - c0 + r0, r - r0 + c0], (r, c) => [R - (c - c0 + r0), r - r0 + c0], (r, c) => [c - c0 + r0, Cc - (r - r0 + c0)], (r, c) => [R - (c - c0 + r0), Cc - (r - r0 + c0)]);
      maps.forEach((f) => { const p = perm(holes, at, f); if (p) out.push(p); });
    }
    return out;
  }
  function perm(holes, at, f) {
    const p = [];
    for (const h of holes) {
      const q = f(h.r, h.c), i = at.get(q[0] + ',' + q[1]);
      if (i == null) return null;
      p.push(i);
    }
    return p;
  }

  function startOf(d, B) {
    const s = new Uint8Array(B.n);
    let i = 0;
    d.board.forEach((row) => { for (const ch of row) { if (ch === 'o') s[i++] = 1; else if (ch === '.' || ch === 'x') s[i++] = 0; } });
    return s;
  }
  const count = (s) => { let n = 0; for (let i = 0; i < s.length; i++) n += s[i]; return n; };

  function goalOf(d, B) {
    const g = d.goal || { one: true };
    if (g.pegs) {
      const want = new Uint8Array(B.n);
      g.pegs.forEach((nm) => { const i = B.byName.get(nm); if (i != null) want[i] = 1; });
      const k = g.pegs.length;
      return { k, want, test: (s, n) => n === k && want.every((v, i) => v === s[i]) };
    }
    if (typeof g.one === 'string') {
      const h = B.byName.get(g.one);
      return { k: 1, hole: h, test: (s, n) => n === 1 && s[h] === 1 };
    }
    return { k: 1, test: (s, n) => n === 1 };
  }
  function goalBad(d, B) {
    const g = d.goal || { one: true };
    if (g.pegs && g.pegs.some((nm) => !B.byName.has(nm))) return 'unknown hole in goal';
    if (typeof g.one === 'string' && !B.byName.has(g.one)) return 'unknown goal hole ' + g.one;
    return null;
  }

  function legal(B, s, from, to) {
    if (!s[from] || s[to]) return -1;
    for (const [o, t] of B.jumps[from]) if (t === to) return s[o] ? o : -1;
    return -1;
  }
  function movesOf(B, s) {
    const out = [];
    for (let i = 0; i < B.n; i++) {
      if (!s[i]) continue;
      for (const [o, t] of B.jumps[i]) if (s[o] && !s[t]) out.push([i, o, t]);
    }
    return out;
  }

  /* ---------- search: depth first, remembering positions that lead nowhere ---------- */

  const POW = []; for (let i = 0; i < 54; i++) POW.push(Math.pow(2, i));
  function keyOf(s) { let k = 0; for (let i = 0; i < s.length; i++) if (s[i]) k += POW[i]; return k; }

  /* opts: { limit: nodes in all, rng: for restarts in shuffled order }
   * -> { path: [[from, to], ...] } | { none: true } | { aborted: true }
   * Jumps are tried landing nearest the middle of the board first; with an rng,
   * the search restarts with growing budgets in shuffled orders, keeping what it
   * learned about dead positions (dead is dead in any order). */
  function search(B, start, goal, opts) {
    opts = opts || {};
    if (!opts.rng) return search1(B, start, goal, opts.limit || 2e6, null, opts.dead || null);
    const dead = new Set();
    let spent = 0, budget = 2000;
    const total = opts.limit || 2e6;
    for (let round = 0; spent < total; round++) {
      const lim = Math.min(budget, total - spent);
      const r = search1(B, start, goal, lim, round ? opts.rng : null, dead);
      spent += r.nodes;
      if (!r.aborted) { r.nodes = spent; return r; }
      budget = Math.floor(budget * 1.6);
    }
    return { aborted: true, nodes: spent };
  }
  function centreOrder(B) {
    if (B.order) return B.order;
    let cx = 0, cy = 0;
    B.holes.forEach((h) => { cx += h.x; cy += h.y; });
    cx /= B.n; cy /= B.n;
    const dist = B.holes.map((h) => Math.hypot(h.x - cx, h.y - cy));
    B.order = B.jumps.map((js) => js.slice().sort((a, b) => dist[a[1]] - dist[b[1]]));
    return B.order;
  }
  function search1(B, start, goal, limit, rng, deadIn) {
    const jumpsOf = rng ? B.jumps.map((js) => { const c = js.slice(); for (let i = c.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = c[i]; c[i] = c[j]; c[j] = t; } return c; }) : centreOrder(B);
    const holeOrder = Array.from({ length: B.n }, (_, i) => i);
    if (rng) for (let i = holeOrder.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = holeOrder[i]; holeOrder[i] = holeOrder[j]; holeOrder[j] = t; }
    const s = Uint8Array.from(start);
    // symmetries that keep the goal
    const syms = B.syms.filter((p) => {
      if (goal.hole != null) return p[goal.hole] === goal.hole;
      if (goal.want) return goal.want.every((v, i) => v === goal.want[p[i]]);
      return true;
    });
    const canon = (st) => {
      let best = Infinity;
      for (const p of syms) {
        let k = 0;
        for (let i = 0; i < st.length; i++) if (st[i]) k += POW[p[i]];
        if (k < best) best = k;
      }
      return best;
    };
    const dead = deadIn || new Set();
    const path = [];
    let nodes = 0;
    const ABORT = {};
    const n = B.n;
    function rec(cnt) {
      if (goal.test(s, cnt)) return true;
      if (cnt <= goal.k) return false;
      const key = canon(s);
      if (dead.has(key)) return false;
      if (++nodes > limit) throw ABORT;
      for (let hi = 0; hi < n; hi++) {
        const i = holeOrder[hi];
        if (!s[i]) continue;
        const js = jumpsOf[i];
        for (let j = 0; j < js.length; j++) {
          const o = js[j][0], t = js[j][1];
          if (!s[o] || s[t]) continue;
          s[i] = 0; s[o] = 0; s[t] = 1;
          path.push([i, t]);
          if (rec(cnt - 1)) return true;
          path.pop();
          s[i] = 1; s[o] = 1; s[t] = 0;
        }
      }
      dead.add(key);
      return false;
    }
    try {
      if (rec(count(s))) return { path: path.slice(), nodes };
      return { none: true, nodes };
    } catch (e) {
      if (e === ABORT) return { aborted: true, nodes };
      throw e;
    }
  }

  // replay a solution; returns { ok, err, s }
  function replay(B, d, sol) {
    const s = startOf(d, B);
    for (let k = 0; k + 1 < sol.length; k += 2) {
      const f = sol[k], t = sol[k + 1];
      if (f < 0 || f >= B.n || t < 0 || t >= B.n) return { ok: false, err: 'jump ' + (k / 2 + 1) + ': no such hole' };
      const o = legal(B, s, f, t);
      if (o < 0) return { ok: false, err: 'jump ' + (k / 2 + 1) + ' (' + B.holes[f].name + '→' + B.holes[t].name + ') is not legal' };
      s[f] = 0; s[o] = 0; s[t] = 1;
    }
    return { ok: true, s };
  }

  /* ---------- making puzzles: play backwards from the goal ---------- */

  // undo-jumps from a position: a peg at t with o and f empty goes back to f, and o gets a peg
  function unmoves(B, s) {
    const out = [];
    for (let t = 0; t < B.n; t++) {
      if (!s[t]) continue;
      // t was reached from f over o: f -> o -> t in a line, so from t the jump list has [o, f]
      for (const [o, f] of B.jumps[t]) if (!s[o] && !s[f]) out.push([f, o, t]);
    }
    return out;
  }
  // random playouts: the share of games played at random that reach the goal
  function luck(B, start, goal, rng, tries) {
    let win = 0;
    const s = new Uint8Array(B.n);
    for (let k = 0; k < tries; k++) {
      s.set(start);
      let cnt = count(s);
      for (;;) {
        if (goal.test(s, cnt)) { win++; break; }
        const ms = movesOf(B, s);
        if (!ms.length) break;
        const m = ms[Math.floor(rng() * ms.length)];
        s[m[0]] = 0; s[m[1]] = 0; s[m[2]] = 1; cnt--;
      }
    }
    return win / tries;
  }
  /* a puzzle by playing backwards `len` jumps from the goal position `end`
   * (Uint8Array); returns { board, sol } or null */
  function backwards(B, d, end, len, rng) {
    const s = Uint8Array.from(end);
    const rev = [];
    for (let k = 0; k < len; k++) {
      const ms = unmoves(B, s);
      if (!ms.length) return null;
      // prefer undo-jumps that keep the pegs together (less sprawl, more interplay)
      const scored = ms.map((m) => { let nb = 0; for (const [o] of B.jumps[m[0]]) nb += s[o]; return { m, w: 1 + nb * nb + rng() * 2 }; });
      let tot = 0; scored.forEach((x) => { tot += x.w; });
      let r = rng() * tot, pick = scored[0].m;
      for (const x of scored) { r -= x.w; if (r <= 0) { pick = x.m; break; } }
      const [f, o, t] = pick;
      s[t] = 0; s[o] = 1; s[f] = 1;
      rev.push([f, t]);
    }
    const sol = [];
    for (let k = rev.length - 1; k >= 0; k--) sol.push(rev[k][0], rev[k][1]);
    return { board: boardOf(d, B, s), sol };
  }
  function boardOf(d, B, s) {
    let i = 0;
    return d.board.map((row) => row.replace(/[o.x]/g, () => (s[i++] ? 'o' : '.')));
  }

  C.pegsLogic = { parse, startOf, goalOf, search, replay, movesOf, unmoves, luck, backwards, boardOf, count, keyOf, legal };

  /* ---------- the boards ---------- */

  function crossBoard(n, arm) { // an n × n cross with arms `arm` wide
    const a = (n - arm) / 2, out = [];
    for (let r = 0; r < n; r++) { let row = ''; for (let c = 0; c < n; c++) row += (r >= a && r < a + arm) || (c >= a && c < a + arm) ? '.' : ' '; out.push(row); }
    return out;
  }
  function diamondBoard(k) { const out = []; for (let r = -k; r <= k; r++) { let row = ''; for (let c = -k; c <= k; c++) row += Math.abs(r) + Math.abs(c) <= k ? '.' : ' '; out.push(row); } return out; }
  const rect = (w, h) => Array.from({ length: h }, () => '.'.repeat(w));
  const tri = (n) => Array.from({ length: n }, (_, r) => '.'.repeat(r + 1));
  const BOARDS = {
    english: { name: 'English board', the: 'the English board', geo: 'sq', round: true, rows: crossBoard(7, 3) },
    french: { name: 'French board', the: 'the French board', geo: 'sq', round: true, rows: ['  ...  ', ' ..... ', '.......', '.......', '.......', ' ..... ', '  ...  '] },
    bigcross: { name: 'Great cross', the: 'the great cross', geo: 'sq', round: true, rows: crossBoard(9, 3) },
    tri15: { name: 'Triangle of 15', the: 'the triangle of 15 holes', geo: 'tri', rows: tri(5) },
    tri21: { name: 'Triangle of 21', the: 'the triangle of 21 holes', geo: 'tri', rows: tri(6) },
    tri28: { name: 'Triangle of 28', the: 'the triangle of 28 holes', geo: 'tri', rows: tri(7) },
    hex19: { name: 'Hexagon', the: 'the hexagonal board', geo: 'tri', rows: ['', '', '...', '....', '.....', ' .... ', '  ...  '] },
    sq6: { name: 'Six by six', the: 'the six-by-six board', geo: 'sq', rows: rect(6, 6) },
    sq5: { name: 'Five by five', the: 'the five-by-five board', geo: 'sq', rows: rect(5, 5) },
    rect45: { name: 'Four by five', the: 'the four-by-five board', geo: 'sq', rows: rect(5, 4) },
    plus21: { name: 'Little cross', the: 'the little cross', geo: 'sq', rows: [' ... ', '.....', '.....', '.....', ' ... '] },
    diamond25: { name: 'Small diamond', the: 'the small diamond', geo: 'sq', rows: diamondBoard(3) },
    diamond41: { name: 'Diamond', the: 'the diamond board', geo: 'sq', rows: diamondBoard(4) },
    heart: { name: 'Heart', the: 'the heart', geo: 'sq', rows: [' .. .. ', '.......', '.......', ' ..... ', '  ...  ', '   .   '] },
    house: { name: 'House', the: 'the house', geo: 'sq', rows: ['  .  ', ' ... ', '.....', '.....', '.. ..', '.. ..'] },
    ring: { name: 'Ring', the: 'the ring', geo: 'sq', rows: [' .... ', '......', '..  ..', '..  ..', '......', ' .... '] }
  };
  C.pegsBoards = BOARDS;

  // difficulty: mostly the length of the game; a short game that random play
  // hardly ever wins (few right moves among many wrong ones) counts one harder
  function gradeOf(len, lk) {
    let g = len <= 5 ? 1 : len <= 9 ? 2 : len <= 15 ? 3 : len <= 23 ? 4 : 5;
    if (g <= 2 && lk < 0.02) g++;
    return g;
  }
  const LEVEL = [null,
    { boards: ['tri15', 'plus21', 'rect45', 'hex19', 'english'], len: [3, 5] },
    { boards: ['tri15', 'tri21', 'plus21', 'hex19', 'english', 'sq5', 'diamond25', 'house'], len: [5, 9] },
    { boards: ['english', 'french', 'tri21', 'sq6', 'diamond25', 'hex19', 'heart', 'ring', 'sq5'], len: [8, 15] },
    { boards: ['english', 'french', 'sq6', 'diamond41', 'tri28', 'bigcross', 'heart', 'ring'], len: [16, 23] },
    { boards: ['english', 'french', 'bigcross', 'diamond41', 'sq6'], len: [24, 34] }
  ];
  const WORD = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  const word = (n) => WORD[n] || String(n);

  /* one puzzle made by playing backwards from a finished position; opts.kind
   * 'any' | 'at' | 'pattern', opts.board a key of BOARDS */
  function makeOne(rng, level, opts) {
    opts = opts || {};
    const L = LEVEL[level];
    const bk = opts.board || rng.pick(L.boards), bd = BOARDS[bk];
    const d0 = { geo: bd.geo, board: bd.rows };
    if (bd.round) d0.round = true;
    const B = parse(d0);
    const kind = opts.kind || (level <= 1 ? rng.pick(['any', 'any', 'at']) : rng.pick(['any', 'at', 'at', 'pattern']));
    const end = new Uint8Array(B.n);
    const h = rng.int(B.n);
    end[h] = 1;
    if (kind === 'pattern') {
      const extra = 1 + rng.int(2);
      for (let k = 0; k < extra; k++) {
        const near = [];
        for (let i = 0; i < B.n; i++) if (!end[i] && B.holes.some((q, j) => end[j] && Math.hypot(q.x - B.holes[i].x, q.y - B.holes[i].y) < 2.3)) near.push(i);
        if (near.length) end[rng.pick(near)] = 1;
      }
    }
    const len = opts.len || rng.range(L.len[0], L.len[1]);
    const r = backwards(B, d0, end, len, rng);
    if (!r) return null;
    const goal = kind === 'any' ? { one: true } : kind === 'at' ? { one: B.holes[h].name } : { pegs: B.holes.filter((q, i) => end[i]).map((q) => q.name) };
    const d = { geo: bd.geo, board: r.board };
    if (bd.round) d.round = true;
    d.goal = goal;
    d.sol = r.sol;
    const lk = luck(B, startOf(d, B), goalOf(d, B), rng, opts.tries || 150);
    const pegs = count(startOf(d, B));
    const text = word(pegs).replace(/^./, (c) => c.toUpperCase()) + ' pegs on ' + bd.the + '. ' +
      (kind === 'any' ? 'Jump until only one peg is left — anywhere will do.' : kind === 'at' ? 'Jump until only one peg is left, and make it finish in the ringed hole, **' + goal.one + '**.' : 'Jump until exactly the ringed pegs are left: ' + goal.pegs.join(', ') + '.');
    return { title: bd.name + ', ' + word(pegs) + ' pegs', text, diff: gradeOf(len, lk), data: d, luck: lk, len, board: bk, key: keyOf(startOf(d, B)) };
  }
  C.pegsMake = makeOne;

  /* ---------- words ---------- */

  const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  function goalText(d, B) {
    const g = d.goal || { one: true };
    if (g.pegs) return 'Leave exactly ' + (NUM[g.pegs.length] || g.pegs.length) + ' pegs, in the ringed holes (' + g.pegs.join(', ') + ').';
    if (typeof g.one === 'string') return 'Leave **one peg**, in the ringed hole **' + g.one + '**.';
    return 'Leave **one peg** — anywhere on the board.';
  }
  function jumpText(B, f, t) {
    const o = mid(B, f, t);
    const H = B.holes, pre = B.tri ? 'hole ' : '';
    return 'Jump the peg in ' + pre + H[f].name + ' over ' + H[o].name + ' into ' + H[t].name + '.';
  }
  function mid(B, f, t) { for (const [o, tt] of B.jumps[f]) if (tt === t) return o; return -1; }

  let uid = 0;

  C.engine({
    id: 'pegs',
    name: 'Peg solitaire',
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'loupe'],
    about: 'A peg jumps over a neighbouring peg into the empty hole straight beyond it, and the peg it jumped over comes off the board. **Drag** a peg to its landing hole, or **click** a peg and then the hole. The holes it can reach glow. A peg that has just jumped stays picked up if it can jump again, so chains of jumps are quick. Jumps go across and up or down on square boards (diagonally too where the puzzle says so), and along the three directions of the lines on triangular boards. **Undo** freely; the **hint** shows the next jump of a winning line from wherever you are — or how far back to go if the game can no longer be won.',

    generate(rng, level) {
      for (let tries = 0; tries < 24; tries++) {
        const p = makeOne(rng, level, { tries: 100 });
        if (!p || p.diff !== level) continue;
        return { title: p.title, text: p.text, diff: level, data: p.data };
      }
      return null;
    },

    verify(p) {
      const d = p.data;
      if (!d || !Array.isArray(d.board) || !d.board.length) return { ok: false, err: 'no board' };
      if (d.geo !== 'sq' && d.geo !== 'tri') return { ok: false, err: 'geo must be sq or tri' };
      if (d.geo === 'tri' && d.board.some((row, r) => row.length > r + 1)) return { ok: false, err: 'a triangle row r has at most r + 1 holes' };
      const B = parse(d);
      if (B.n < 3) return { ok: false, err: 'too few holes' };
      const bad = goalBad(d, B);
      if (bad) return { ok: false, err: bad };
      const goal = goalOf(d, B), s0 = startOf(d, B);
      if (goal.test(s0, count(s0))) return { ok: false, err: 'already solved at the start' };
      if (!d.sol) {
        const r = search(B, s0, goal, { limit: 300000 });
        return r.path ? { ok: true, warn: 'no stored solution' } : { ok: false, err: r.none ? 'no solution' : 'search too big and no stored solution' };
      }
      const r = replay(B, d, d.sol);
      if (!r.ok) return { ok: false, err: r.err };
      if (!goal.test(r.s, count(r.s))) return { ok: false, err: 'the stored solution does not reach the goal' };
      return { ok: true };
    },

    mount(ctx, p) {
      const d = p.data, wb = ctx.wb, B = parse(d), goal = goalOf(d, B);
      const H = B.holes;
      const S = (tag, attrs, parent) => ctx.s(tag, attrs, parent);
      let s = startOf(d, B), hist = [], sel = -1, busy = false, solving = false, drag = null, names = false;
      const dead = new Set();   // positions proved hopeless, remembered between hints
      let anims = [], timers = [], hintT = null;
      const pre = 'pg' + (++uid);
      const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
      ctx.setGoal(goalText(d, B));

      /* the board */
      const defs = S('defs', null, bg);
      defs.innerHTML =
        '<radialGradient id="' + pre + '-ball" cx=".36" cy=".32" r=".72"><stop offset="0" stop-color="#ffd9b8"/><stop offset=".22" stop-color="#f2804e"/><stop offset=".7" stop-color="#b73a1c"/><stop offset="1" stop-color="#6e1d0b"/></radialGradient>' +
        '<linearGradient id="' + pre + '-wood" x1="0" y1="0" x2=".35" y2="1"><stop offset="0" stop-color="#d9a263"/><stop offset=".55" stop-color="#b87a3c"/><stop offset="1" stop-color="#8f5a26"/></linearGradient>' +
        '<radialGradient id="' + pre + '-hole" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="#1a0f06"/><stop offset=".75" stop-color="#2e1c0c"/><stop offset="1" stop-color="#5a3a1c"/></radialGradient>';
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      H.forEach((h) => { x0 = Math.min(x0, h.x); x1 = Math.max(x1, h.x); y0 = Math.min(y0, h.y); y1 = Math.max(y1, h.y); });
      const cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
      const surf = S('g', { class: 'peg-board' }, bg);
      const wood = 'url(#' + pre + '-wood)';
      if (d.round) {
        let R = 0;
        H.forEach((h) => { R = Math.max(R, Math.hypot(h.x - cx, h.y - cy)); });
        S('circle', { cx: cx + 0.06, cy: cy + 0.12, r: R + 0.85, class: 'peg-shadow' }, surf);
        S('circle', { cx, cy, r: R + 0.85, fill: '#6e4219' }, surf);
        S('circle', { cx, cy, r: R + 0.72, fill: wood }, surf);
        S('circle', { cx, cy, r: R + 0.72, class: 'peg-groove' }, surf);
      } else {
        const hull = C.geom.convexHull(H.map((h) => [h.x, h.y]));
        const full = convexFull(B, hull);
        const shape = [full ? C.pathOf(hull) : H.map((h) => B.tri ? circlePath(h.x, h.y, 0.62) : 'M' + (h.x - 0.5) + ' ' + (h.y - 0.5) + 'h1v1h-1z').join('')];
        const lay = (cls, extra, dx, dy) => shape.forEach((dd) => S('path', { d: dd, transform: dx ? 'translate(' + dx + ' ' + dy + ')' : null, class: cls, 'stroke-width': (full ? 1.25 : 0.5) + extra, 'stroke-linejoin': 'round' }, surf));
        lay('peg-shadow peg-outline', 0.25, 0.06, 0.12);
        lay('peg-rim peg-outline', 0.25);
        const g = S('g', null, surf);
        shape.forEach((dd) => S('path', { d: dd, fill: wood, stroke: wood, 'stroke-width': full ? 1.25 : 0.5, 'stroke-linejoin': 'round' }, g));
      }
      const holeG = S('g', { class: 'peg-holes' }, board);
      const goalG = S('g', { class: 'peg-goal' }, board);
      const targG = S('g', { class: 'peg-targets' }, board);
      const pegG = S('g', { class: 'peg-pegs' }, board);
      const nameG = S('g', { class: 'peg-names' }, board);
      const liveG = S('g', { class: 'peg-live' }, top);
      const hintG = S('g', { class: 'peg-hint' }, top);
      H.forEach((h, i) => {
        S('circle', { cx: h.x, cy: h.y, r: 0.44, class: 'peg-mark', 'data-key': 'h' + i }, holeG);
        S('circle', { cx: h.x, cy: h.y, r: 0.2, fill: 'url(#' + pre + '-hole)', class: 'peg-hole' }, holeG);
        S('path', { d: 'M' + (h.x - 0.17) + ' ' + (h.y + 0.08) + 'A.19 .19 0 0 0 ' + (h.x + 0.17) + ' ' + (h.y + 0.08), class: 'peg-holelip' }, holeG);
        S('text', { x: h.x + 0.3, y: h.y + 0.46, 'text-anchor': 'middle', class: 'peg-name', text: h.name }, nameG);
      });
      nameG.style.display = 'none';
      if (d.goal && d.goal.pegs) d.goal.pegs.forEach((nm) => { const h = H[B.byName.get(nm)]; S('circle', { cx: h.x, cy: h.y, r: 0.42, class: 'peg-goalring' }, goalG); });
      else if (goal.hole != null) { const h = H[goal.hole]; S('circle', { cx: h.x, cy: h.y, r: 0.42, class: 'peg-goalring' }, goalG); }
      wb.setBounds({ x0: x0 - 1.1, y0: y0 - 1.1, x1: x1 + 1.1, y1: y1 + 1.1 }, 0.05);
      wb.applyPaints();

      function pegEl(x, y, parent, cls) {
        const g = S('g', { class: 'peg' + (cls ? ' ' + cls : ''), transform: 'translate(' + x + ' ' + y + ')' }, parent);
        S('ellipse', { cx: 0.05, cy: 0.1, rx: 0.33, ry: 0.3, class: 'peg-ballshadow' }, g);
        S('circle', { r: 0.33, fill: 'url(#' + pre + '-ball)', class: 'peg-ball' }, g);
        S('ellipse', { cx: -0.1, cy: -0.13, rx: 0.1, ry: 0.065, transform: 'rotate(-35 -.1 -.13)', class: 'peg-gloss' }, g);
        return g;
      }
      const pegEls = new Array(B.n).fill(null);
      function drawPegs() {
        pegG.innerHTML = '';
        pegEls.fill(null);
        for (let i = 0; i < B.n; i++) {
          if (!s[i]) continue;
          if (drag && drag.from === i && drag.moved) continue;
          pegEls[i] = pegEl(H[i].x, H[i].y, pegG, i === sel ? 'sel' : '');
        }
        drawTargets();
        const n = count(s);
        ctx.stat('Pegs', n);
      }
      function targetsOf(i) { return i < 0 || !s[i] ? [] : B.jumps[i].filter(([o, t]) => s[o] && !s[t]).map(([o, t]) => t); }
      function drawTargets() {
        targG.innerHTML = '';
        targetsOf(sel).forEach((t) => S('circle', { cx: H[t].x, cy: H[t].y, r: 0.36, class: 'peg-target' + (drag && drag.over === t ? ' on' : '') }, targG));
      }
      function status() {
        const n = count(s);
        if (goal.test(s, n)) return;
        if (!movesOf(B, s).length) ctx.say('No jumps left — ' + C.plural(n, 'peg') + ' on the board. Undo, or ask for a hint.', 'warn');
        else ctx.say('');
      }

      /* animation */
      // an animation that always finishes: frames when the page is shown, a timer otherwise
      function tween(ms, step, done) {
        const t0 = performance.now(), a = { raf: 0, to: 0, over: false };
        a.end = () => {
          if (a.over) return;
          a.over = true;
          cancelAnimationFrame(a.raf); clearTimeout(a.to);
          step(1);
          anims = anims.filter((x) => x !== a);
          if (done) done();
        };
        const f = (now) => {
          if (a.over) return;
          const k = Math.min(1, (now - t0) / ms);
          if (k < 1) { step(k); a.raf = requestAnimationFrame(f); } else a.end();
        };
        a.raf = requestAnimationFrame(f);
        a.to = setTimeout(a.end, ms + 150);
        anims.push(a);
      }
      function flush() { anims.slice().forEach((a) => a.end()); }
      function stopAnims() { anims.forEach((a) => { a.over = true; cancelAnimationFrame(a.raf); clearTimeout(a.to); }); anims = []; timers.forEach(clearTimeout); timers = []; liveG.innerHTML = ''; busy = false; solving = false; }
      function animateJump(f, o, t, from, done) {
        busy = true;
        const a = from || [H[f].x, H[f].y], b = [H[t].x, H[t].y];
        const g = pegEl(a[0], a[1], liveG, 'flying');
        const victim = pegEl(H[o].x, H[o].y, liveG, 'victim');
        const ms = C.anim(from ? 180 : 300);
        tween(ms, (k) => {
          const e = 0.5 - Math.cos(k * Math.PI) / 2, lift = from ? 0 : Math.sin(k * Math.PI) * 0.55;
          const sc = 1 + Math.sin(k * Math.PI) * (from ? 0.04 : 0.14);
          g.setAttribute('transform', 'translate(' + (a[0] + (b[0] - a[0]) * e) + ' ' + (a[1] + (b[1] - a[1]) * e - lift) + ') scale(' + sc + ')');
        }, () => {
          g.remove();
          ctx.sfx('tap');
          busy = false;
          if (done) done();
        });
        const ring = S('circle', { cx: H[o].x, cy: H[o].y, r: 0.3, class: 'peg-pop' }, liveG);
        tween(C.anim(360), (k) => {
          const e = Math.min(1, k * 1.25);
          victim.setAttribute('transform', 'translate(' + H[o].x + ' ' + (H[o].y - e * 0.25) + ') scale(' + (1 - e * 0.85) + ')');
          victim.style.opacity = String(1 - e);
          ring.setAttribute('r', String(0.3 + k * 0.35));
          ring.style.opacity = String(1 - k);
        }, () => { victim.remove(); ring.remove(); });
      }

      function jump(f, t, fromPt) {
        const o = C.pegsLogic.legal(B, s, f, t);
        if (o < 0) return false;
        clearHint();
        s[f] = 0; s[o] = 0; s[t] = 1;
        hist.push(f, t);
        sel = targetsOf(t).length ? t : -1;
        drag = null;
        drawPegs();
        if (pegEls[t]) pegEls[t].style.visibility = 'hidden';
        animateJump(f, o, t, fromPt, () => { if (pegEls[t]) pegEls[t].style.visibility = ''; });
        ctx.move();
        status();
        ctx.changed('move');
        return true;
      }

      /* pointer */
      function holeAt(pt, within) {
        let best = -1, bd = within || 0.46;
        H.forEach((h, i) => { const dd = Math.hypot(h.x - pt[0], h.y - pt[1]); if (dd < bd) { bd = dd; best = i; } });
        return best;
      }
      wb.handlers.board = {
        down(pt) {
          if (solving) return true;
          if (busy) flush();
          const i = holeAt(pt);
          if (i < 0) { if (sel >= 0) { sel = -1; drawPegs(); } return false; }
          if (!s[i]) {
            if (sel >= 0 && targetsOf(sel).includes(i)) { jump(sel, i); return true; }
            if (sel >= 0) { sel = -1; drawPegs(); }
            return true;
          }
          clearHint();
          const was = sel;
          sel = i;
          drag = { from: i, p0: pt, moved: false, was, el: null, over: -1 };
          drawPegs();
          if (!targetsOf(i).length) ctx.toast('This peg has nothing to jump over.');
          return true;
        },
        move(pt) {
          if (!drag) return;
          if (!drag.moved && Math.hypot(pt[0] - drag.p0[0], pt[1] - drag.p0[1]) < 0.18) return;
          if (!drag.moved) { drag.moved = true; drawPegs(); drag.el = pegEl(pt[0], pt[1], liveG, 'lifted'); }
          drag.el.setAttribute('transform', 'translate(' + pt[0] + ' ' + (pt[1] - 0.08) + ') scale(1.12)');
          const t = holeAt(pt, 0.55);
          const ov = targetsOf(drag.from).includes(t) ? t : -1;
          if (ov !== drag.over) { drag.over = ov; drawTargets(); }
        },
        up(pt) {
          if (!drag) return;
          const dg = drag;
          if (dg.moved) {
            if (dg.el) dg.el.remove();
            const t = holeAt(pt, 0.6);
            if (t >= 0 && targetsOf(dg.from).includes(t)) { jump(dg.from, t, [pt[0], pt[1] - 0.08]); return; }
            // back into its hole
            drag = null;
            drawPegs();
            const back = pegEl(pt[0], pt[1], liveG, 'lifted');
            const a = pt, b = [H[dg.from].x, H[dg.from].y];
            if (pegEls[dg.from]) pegEls[dg.from].style.visibility = 'hidden';
            tween(C.anim(160), (k) => { const e = 1 - (1 - k) * (1 - k); back.setAttribute('transform', 'translate(' + (a[0] + (b[0] - a[0]) * e) + ' ' + (a[1] + (b[1] - a[1]) * e) + ')'); }, () => { back.remove(); if (pegEls[dg.from]) pegEls[dg.from].style.visibility = ''; });
            return;
          }
          drag = null;
          if (dg.was === dg.from) sel = -1;   // a second click on the same peg puts it down
          drawPegs();
        }
      };

      /* the known solution, and searching */
      const solMoves = d.sol ? d.sol.length / 2 : 0;
      function onPath() {
        // how many jumps of the stored solution the current position is along, or -1
        if (!d.sol) return -1;
        const k0 = keyOf(s);
        const t = startOf(d, B);
        for (let k = 0; k <= solMoves; k++) {
          if (keyOf(t) === k0) return k;
          if (k === solMoves) break;
          const f = d.sol[2 * k], to = d.sol[2 * k + 1], o = C.pegsLogic.legal(B, t, f, to);
          if (o < 0) break;
          t[f] = 0; t[o] = 0; t[to] = 1;
        }
        return -1;
      }
      function stateAfter(k) {
        const t = startOf(d, B);
        for (let j = 0; j < k; j++) { const f = hist[2 * j], to = hist[2 * j + 1], o = C.pegsLogic.legal(B, t, f, to); t[f] = 0; t[o] = 0; t[to] = 1; }
        return t;
      }
      function clearHint() { clearTimeout(hintT); hintG.innerHTML = ''; }
      function showJump(f, t) {
        clearHint();
        const o = mid(B, f, t);
        [f, t].forEach((i, k) => S('circle', { cx: H[i].x, cy: H[i].y, r: 0.46, class: k ? 'peg-hintspot' : 'peg-hintring' }, hintG));
        const a = [H[f].x, H[f].y], b = [H[t].x, H[t].y], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - 0.55];
        S('path', { d: 'M' + a[0] + ' ' + (a[1] - 0.4) + 'Q' + m[0] + ' ' + (m[1] - 0.2) + ' ' + b[0] + ' ' + (b[1] - 0.4), class: 'peg-hintarc' }, hintG);
        S('circle', { cx: H[o].x, cy: H[o].y, r: 0.12, class: 'peg-hintover' }, hintG);
        hintT = setTimeout(clearHint, 6000);
      }

      function solve() {
        stopAnims();
        clearHint();
        sel = -1; drag = null;
        let plan = null, restart = false;
        const k = onPath();
        if (k >= 0) { plan = []; for (let j = k; j < solMoves; j++) plan.push([d.sol[2 * j], d.sol[2 * j + 1]]); }
        else {
          const r = search(B, s, goal, { limit: 60000, dead });
          if (r.path) plan = r.path;
          else { restart = true; plan = []; for (let j = 0; j < solMoves; j++) plan.push([d.sol[2 * j], d.sol[2 * j + 1]]); }
        }
        if (restart) { s = startOf(d, B); hist = []; ctx.move(0); ctx.say('Starting again from the beginning…', 'info'); }
        drawPegs();
        let j = 0;
        const step = () => {
          if (j >= plan.length) { solving = false; busy = false; drawPegs(); status(); ctx.changed('solve'); return; }
          const [f, t] = plan[j++];
          const o = C.pegsLogic.legal(B, s, f, t);
          if (o < 0) { solving = false; busy = false; drawPegs(); ctx.changed('solve'); return; }
          s[f] = 0; s[o] = 0; s[t] = 1;
          hist.push(f, t);
          ctx.move();
          drawPegs();
          if (pegEls[t]) pegEls[t].style.visibility = 'hidden';
          animateJump(f, o, t, null, () => { if (pegEls[t]) pegEls[t].style.visibility = ''; timers.push(setTimeout(step, C.anim(120))); });
        };
        solving = true;
        timers.push(setTimeout(step, C.anim(restart ? 500 : 150)));
      }

      ctx.button('Hole names', () => { names = !names; nameG.style.display = names ? '' : 'none'; }, 'small ghost');
      drawPegs();
      status();

      return {
        check() {
          const n = count(s);
          if (goal.test(s, n)) return { solved: true, msg: n === 1 ? 'One peg left' + (goal.hole != null ? ', right in ' + H[goal.hole].name : '') + '.' : 'Exactly the pattern.' };
          if (!movesOf(B, s).length) return { solved: false, msg: 'No jumps left, and ' + C.plural(n, 'peg') + ' remain.' };
          return { solved: false, msg: C.plural(n, 'peg') + ' still on the board.' };
        },
        hint() {
          const n = count(s);
          if (goal.test(s, n)) return 'Solved — nothing left to jump.';
          const k = onPath();
          if (k >= 0 && k < solMoves) {
            const f = d.sol[2 * k], t = d.sol[2 * k + 1];
            return { text: jumpText(B, f, t) + ' (' + C.plural(solMoves - k, 'jump') + ' to go.)', show: () => showJump(f, t) };
          }
          const r = search(B, s, goal, { limit: 70000, dead });
          if (r.path && r.path.length) {
            const [f, t] = r.path[0];
            return { text: jumpText(B, f, t) + ' From here it can still be done.', show: () => showJump(f, t) };
          }
          const jumps = hist.length / 2;
          if (r.none) {
            // walk back through the game for the last position that could still win
            let budget = 6;
            for (let j = jumps - 1; j >= 0 && budget > 0; j--, budget--) {
              const rr = search(B, stateAfter(j), goal, { limit: 20000, dead });
              if (rr.path) {
                const back = jumps - j;
                return 'This position can no longer be won. Undo ' + C.plural(back, 'jump') + ' — back to before ' + jumpText(B, hist[2 * j], hist[2 * j + 1]).replace(/^Jump/, 'jumping').replace(/\.$/, '') + ' — and from there it can still be done.';
              }
            }
          }
          // fall back on the known winning line: how much of the game follows it
          if (d.sol) {
            let agree = 0;
            while (agree < jumps && agree < solMoves && hist[2 * agree] === d.sol[2 * agree] && hist[2 * agree + 1] === d.sol[2 * agree + 1]) agree++;
            const next = jumpText(B, d.sol[2 * agree], d.sol[2 * agree + 1]);
            const lead = r.none ? 'This position can no longer be won.' : 'From here the game is too open for me to see to the end quickly.';
            const show = () => { if (jumps === agree) showJump(d.sol[2 * agree], d.sol[2 * agree + 1]); };
            if (agree === 0) return { text: lead + ' Press **Reset** and begin like this: ' + next, show };
            return { text: lead + ' Your first ' + C.plural(agree, 'jump') + ' follow a winning line I know: undo ' + C.plural(jumps - agree, 'jump') + ', then ' + next.charAt(0).toLowerCase() + next.slice(1), show };
          }
          return 'Undo a few jumps and try another way.';
        },
        solve,
        getState() { return { s: Array.from(s).join(''), h: hist.slice() }; },
        setState(st) {
          stopAnims();
          clearHint();
          if (st && st.s) { s = Uint8Array.from(st.s.split('').map(Number)); hist = (st.h || []).slice(); }
          sel = -1; drag = null;
          drawPegs();
          status();
        },
        reset() { stopAnims(); },
        destroy() { stopAnims(); clearHint(); }
      };
    },

    thumb(p) {
      const d = p.data, B = parse(d), s = startOf(d, B), goal = goalOf(d, B);
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      B.holes.forEach((h) => { x0 = Math.min(x0, h.x); x1 = Math.max(x1, h.x); y0 = Math.min(y0, h.y); y1 = Math.max(y1, h.y); });
      let out = '<svg viewBox="' + r3(x0 - 0.8) + ' ' + r3(y0 - 0.8) + ' ' + r3(x1 - x0 + 1.6) + ' ' + r3(y1 - y0 + 1.6) + '" preserveAspectRatio="xMidYMid meet">';
      B.holes.forEach((h, i) => {
        if (s[i]) out += '<circle cx="' + r3(h.x) + '" cy="' + r3(h.y) + '" r=".34" fill="#d0572c"/>';
        else out += '<circle cx="' + r3(h.x) + '" cy="' + r3(h.y) + '" r=".16" fill="var(--ink-2)" opacity=".6"/>';
        if (goal.hole === i || (goal.want && goal.want[i])) out += '<circle cx="' + r3(h.x) + '" cy="' + r3(h.y) + '" r=".44" fill="none" stroke="var(--gold)" stroke-width=".08"/>';
      });
      return out + '</svg>';
    }
  });

  // is the hull of a board's holes filled with holes (so the board can be drawn as one rounded shape)?
  function convexFull(B, hull) {
    if (B.tri) return true;
    let r0 = Infinity, r1 = -Infinity, c0 = Infinity, c1 = -Infinity;
    B.holes.forEach((h) => { r0 = Math.min(r0, h.r); r1 = Math.max(r1, h.r); c0 = Math.min(c0, h.c); c1 = Math.max(c1, h.c); });
    for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) {
      if (B.at.has(r + ',' + c)) continue;
      if (C.geom.pointInPoly([c, r], hull) || onEdge([c, r], hull)) return false;
    }
    return true;
  }
  function onEdge(p, hull) { for (let i = 0; i < hull.length; i++) if (C.geom.segDist(p, hull[i], hull[(i + 1) % hull.length]) < 1e-6) return true; return false; }
  function circlePath(x, y, r) { return 'M' + (x - r) + ' ' + y + 'a' + r + ' ' + r + ' 0 1 0 ' + (2 * r) + ' 0a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0z'; }
  function r3(v) { return Math.round(v * 1000) / 1000; }

  C.css('pegs', `
    .peg-shadow { fill: rgba(0, 0, 0, .35); stroke: none; }
    .peg-shadow.peg-outline { stroke: rgba(0, 0, 0, .35); }
    [data-theme="light"] .peg-shadow { fill: rgba(60, 40, 10, .25); }
    [data-theme="light"] .peg-shadow.peg-outline { stroke: rgba(60, 40, 10, .25); }
    .peg-rim { fill: #6e4219; stroke: #6e4219; }
    .peg-groove { fill: none; stroke: rgba(255, 230, 190, .25); stroke-width: .05; }
    .peg-mark { fill: transparent; pointer-events: all; }
    .peg-holelip { fill: none; stroke: rgba(255, 225, 180, .35); stroke-width: .035; stroke-linecap: round; }
    .peg-ballshadow { fill: rgba(40, 18, 4, .45); }
    .peg-gloss { fill: rgba(255, 255, 255, .75); }
    .peg { cursor: grab; }
    .peg.sel .peg-ball { stroke: var(--gold); stroke-width: .06; }
    .peg.sel { filter: drop-shadow(0 0 .08px var(--gold)); }
    .peg.lifted .peg-ballshadow { transform: translate(.08px, .16px); opacity: .7; }
    .peg.flying, .peg.lifted, .peg.victim { pointer-events: none; }
    .peg-target { fill: rgba(255, 209, 102, .18); stroke: var(--gold); stroke-width: .05; stroke-dasharray: .1 .07; animation: pegpulse 1.1s ease-in-out infinite; }
    .peg-target.on { fill: rgba(255, 209, 102, .45); stroke-dasharray: none; stroke-width: .07; animation: none; }
    .peg-goalring { fill: none; stroke: var(--gold); stroke-width: .06; stroke-dasharray: .16 .09; opacity: .9; }
    .peg-pop { fill: none; stroke: #ffd9b8; stroke-width: .05; }
    .peg-name { font: 700 .2px "Segoe UI", system-ui, sans-serif; fill: rgba(255, 240, 220, .8); }
    .peg-hintring { fill: none; stroke: var(--gold); stroke-width: .08; animation: pegpulse 1s ease-in-out infinite; }
    .peg-hintspot { fill: rgba(255, 209, 102, .2); stroke: var(--gold); stroke-width: .06; stroke-dasharray: .14 .1; animation: pegpulse 1s ease-in-out infinite; }
    .peg-hintarc { fill: none; stroke: var(--gold); stroke-width: .06; stroke-dasharray: .14 .1; }
    .peg-hintover { fill: var(--gold); opacity: .8; }
    @keyframes pegpulse { 50% { opacity: .45; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
