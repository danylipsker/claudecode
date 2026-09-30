/* The Puzzle Cabinet · engines/chessmen.js
 *
 * Puzzles with chess pieces on small boards, chosen by data.kind:
 *
 *   swap   knights change places (Guarini, 1512): drag a knight (or click it,
 *          then its square); the fewest moves is found by breadth-first search.
 *          data: { rows, cols, holes: [sq], start: { w: [sq], b: [sq] }, goal: { w, b }, alt?: true }
 *   tour   a knight visits every square once: click the next square.
 *          data: { rows, cols, holes, start?, end?, closed?, given?: { sq: n }, sol: [sq...] | none: true, ask? }
 *   place  put pieces on the board: none attacking another ('indep'), every square
 *          guarded ('dom'), or both ('both').
 *          data: { rows, cols, holes, pawns: [sq] (blockers), piece: 'Q'|'R'|'B'|'N'|'K', need: k,
 *                  goal, fixed: [sq], forbid: [sq], sol: [sq...], unique?: true,
 *                  most?: [[sq...]...] (a cover by groups that attack each other: no more pieces fit),
 *                  fewest?: true (no solution with one piece fewer: checked by search) }
 * Squares are numbered row by row from the top left: sq = row * cols + col.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;

  /* ---------- the board ---------- */

  const KNIGHT = [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]];
  const KING = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  const ORTHO = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  const DIAG = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
  const NAMES = { Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', K: 'king', P: 'pawn' };

  function board(d) {
    const R = d.rows, W = d.cols, N = R * W;
    const hole = new Uint8Array(N), pawn = new Uint8Array(N);
    (d.holes || []).forEach((s) => { hole[s] = 1; });
    (d.pawns || []).forEach((s) => { pawn[s] = 1; });
    const on = (r, c) => r >= 0 && c >= 0 && r < R && c < W && !hole[r * W + c];
    const b = { R, W, N, hole, pawn, on, rc: (s) => [Math.floor(s / W), s % W], sq: (r, c) => r * W + c };
    b.squares = [];
    for (let s = 0; s < N; s++) if (!hole[s]) b.squares.push(s);
    b.knight = [];
    for (let s = 0; s < N; s++) {
      const out = [];
      if (!hole[s]) { const [r, c] = b.rc(s); KNIGHT.forEach(([dr, dc]) => { if (on(r + dr, c + dc)) out.push((r + dr) * W + c + dc); }); }
      b.knight.push(out);
    }
    return b;
  }
  const colourOf = (b, s) => { const [r, c] = b.rc(s); return (r + c) & 1; };
  function sqName(b, s) { const [r, c] = b.rc(s); return 'abcdefghijklmnop'[c] + (b.R - r); }

  // squares a piece on s attacks; lines stop at the first pawn or occupied square (which is attacked)
  function attacks(b, type, s, occ) {
    const [r, c] = b.rc(s), out = [];
    if (type === 'N' || type === 'K') {
      (type === 'N' ? KNIGHT : KING).forEach(([dr, dc]) => { if (b.on(r + dr, c + dc)) out.push((r + dr) * b.W + c + dc); });
      return out;
    }
    const dirs = type === 'Q' ? ORTHO.concat(DIAG) : type === 'R' ? ORTHO : DIAG;
    dirs.forEach(([dr, dc]) => {
      let rr = r + dr, cc = c + dc;
      while (b.on(rr, cc)) {
        const t = rr * b.W + cc;
        if (b.pawn[t]) break;
        out.push(t);
        if (occ && occ[t]) break;
        rr += dr; cc += dc;
      }
    });
    return out;
  }
  // attack lists with only the pawns blocking (enough for pieces of one kind)
  function coverTable(b, type) {
    const t = [];
    for (let s = 0; s < b.N; s++) t.push(b.hole[s] || b.pawn[s] ? [] : attacks(b, type, s, null));
    return t;
  }

  /* ---------- knights changing places: breadth-first search ---------- */

  function swapStart(d) {
    const b = board(d), a = new Array(b.N).fill('.');
    for (let s = 0; s < b.N; s++) if (b.hole[s]) a[s] = '#';
    d.start.w.forEach((s) => { a[s] = 'w'; });
    d.start.b.forEach((s) => { a[s] = 'b'; });
    return a.join('');
  }
  function swapGoal(d, st) { return d.goal.w.every((s) => st[s] === 'w') && d.goal.b.every((s) => st[s] === 'b'); }
  function swapMoves(b, st, turn) {
    const out = [];
    for (let s = 0; s < b.N; s++) {
      const ch = st[s];
      if (ch !== 'w' && ch !== 'b') continue;
      if (turn && ch !== turn) continue;
      for (const t of b.knight[s]) if (st[t] === '.') out.push([s, t]);
    }
    return out;
  }
  const applyMove = (st, m) => { const a = st.split(''); a[m[1]] = a[m[0]]; a[m[0]] = '.'; return a.join(''); };
  // the fewest moves from a position (st, with whose turn it is when colours alternate); null if none
  function swapSolve(d, st, turn, limit) {
    const b = board(d);
    const alt = !!d.alt;
    const key0 = st + (alt ? turn : '');
    if (swapGoal(d, st)) return { path: [], states: 1 };
    const prev = new Map([[key0, null]]);
    let front = [[st, turn]];
    limit = limit || 400000;
    while (front.length) {
      const next = [];
      for (const [s0, t0] of front) {
        for (const m of swapMoves(b, s0, alt ? t0 : null)) {
          const s1 = applyMove(s0, m), t1 = alt ? (t0 === 'w' ? 'b' : 'w') : '';
          const k = s1 + t1;
          if (prev.has(k)) continue;
          prev.set(k, [s0 + (alt ? t0 : ''), m]);
          if (swapGoal(d, s1)) {
            const path = [];
            let cur = k;
            while (prev.get(cur)) { const e = prev.get(cur); path.unshift(e[1]); cur = e[0]; }
            return { path, states: prev.size };
          }
          next.push([s1, t1]);
        }
      }
      front = next;
      if (prev.size > limit) return { path: null, states: prev.size, aborted: true };
    }
    return { path: null, states: prev.size };
  }

  /* ---------- knight's tours: search with Warnsdorff's rule ---------- */

  function knightDist(b) {
    const D = [];
    for (let s = 0; s < b.N; s++) {
      const d = new Int16Array(b.N).fill(-1);
      if (!b.hole[s]) {
        d[s] = 0;
        const q = [s];
        for (let i = 0; i < q.length; i++) for (const t of b.knight[q[i]]) if (d[t] < 0) { d[t] = d[q[i]] + 1; q.push(t); }
      }
      D.push(d);
    }
    return D;
  }
  /* opts: { start, end, closed, given: { sq: n }, prefix: [sq], max, limit }
   * returns { sols, aborted, nodes } */
  function tourSearch(d, opts) {
    const b = board(d);
    opts = opts || {};
    const n = b.squares.length, N = b.N;
    const max = opts.max || 1, limit = opts.limit || 3e6;
    const given = opts.given || d.given || {};
    const numOf = new Int16Array(N).fill(0), atNum = new Int16Array(n + 2).fill(-1);
    for (const k in given) { numOf[+k] = given[k]; atNum[given[k]] = +k; }
    const end = opts.end != null ? opts.end : d.end != null ? d.end : -1;
    const closed = opts.closed != null ? opts.closed : !!d.closed;
    const D = Object.keys(given).length ? knightDist(b) : null;
    const res = { sols: [], aborted: false, nodes: 0 };
    const vis = new Uint8Array(N);
    const path = [];
    let start = opts.start != null ? opts.start : d.start != null ? d.start : (atNum[1] >= 0 ? atNum[1] : -1);
    const free = (x) => !vis[x] && !b.hole[x];
    const canVisit = (x, step) => free(x) && (numOf[x] === 0 || numOf[x] === step) && (atNum[step] < 0 || atNum[step] === x) && (x !== end || step === n);
    function dead() {
      const last = path[path.length - 1], first = path[0];
      const step = path.length;
      let ones = 0;
      for (const x of b.squares) {
        if (vis[x]) continue;
        let a = 0;
        for (const y of b.knight[x]) if (!vis[y] || y === last || (closed && y === first)) a++;
        if (a === 0) return true;
        if (a === 1 && !closed) { ones++; if (ones > 1 || (end >= 0 && x !== end)) return true; }
        if (closed && a < 2) return true;
      }
      if (D) {
        for (let k = step + 1; k <= n; k++) {
          const g = atNum[k];
          if (g < 0) continue;
          if (vis[g]) { if (path[k - 1] !== g) return true; continue; }
          const dist = D[last][g];
          if (dist < 0 || dist > k - step || ((k - step - dist) & 1)) return true;
          break;
        }
      }
      return false;
    }
    function go() {
      if (res.sols.length >= max || res.aborted) return;
      if (++res.nodes > limit) { res.aborted = true; return; }
      const step = path.length;
      if (step === n) {
        const last = path[n - 1];
        if (closed && !b.knight[last].includes(path[0])) return;
        if (end >= 0 && last !== end) return;
        res.sols.push(path.slice());
        return;
      }
      const last = path[step - 1];
      const cand = b.knight[last].filter((x) => canVisit(x, step + 1));
      if (opts.rng && cand.length > 1) opts.rng.shuffle(cand);
      if (cand.length > 1) {
        const sc = cand.map((x) => { let k = 0; for (const y of b.knight[x]) if (!vis[y]) k++; return k * 16 + (closed && b.knight[x].includes(path[0]) ? 8 : 0); });
        const idx = cand.map((x, i) => i).sort((i, j) => sc[i] - sc[j] || i - j);
        const c2 = idx.map((i) => cand[i]);
        cand.length = 0;
        c2.forEach((x) => cand.push(x));
      }
      for (const x of cand) {
        vis[x] = 1; path.push(x);
        if (!dead()) go();
        path.pop(); vis[x] = 0;
        if (res.sols.length >= max || res.aborted) return;
      }
    }
    // colours: a knight always changes colour, so the counts of light and dark squares decide a lot
    let light = 0;
    b.squares.forEach((x) => { if (!colourOf(b, x)) light++; });
    const dark = n - light;
    const major = light > dark ? 0 : 1;
    if (Math.abs(light - dark) > 1 || (closed && light !== dark)) return res;
    const colourOk = (s0) => {
      // the colour square k must have, given the first square s0
      const want = (k) => colourOf(b, s0) ^ ((k - 1) & 1);
      if (n % 2 === 1 && colourOf(b, s0) !== major) return false;
      if (end >= 0 && colourOf(b, end) !== want(n)) return false;
      for (const k in given) if (colourOf(b, +k) !== want(given[k])) return false;
      return true;
    };
    let starts = opts.prefix && opts.prefix.length ? [null] : start >= 0 ? [start] : b.squares.slice();
    starts = starts.filter((s0) => colourOk(s0 == null ? opts.prefix[0] : s0));
    for (const s of starts) {
      vis.fill(0); path.length = 0;
      let ok = true;
      const pre = opts.prefix && opts.prefix.length ? opts.prefix : [s];
      for (let i = 0; i < pre.length; i++) {
        const x = pre[i];
        if (!canVisit(x, i + 1) || (i > 0 && !b.knight[pre[i - 1]].includes(x))) { ok = false; break; }
        vis[x] = 1; path.push(x);
      }
      if (!ok) continue;
      if (path.length === n) { go(); } else if (!dead()) go();
      if (res.sols.length >= max || res.aborted) break;
    }
    return res;
  }
  function tourValid(d, t) {
    const b = board(d), n = b.squares.length;
    if (!t || t.length !== n || new Set(t).size !== n) return 'the tour must visit every square once';
    for (let i = 0; i < n; i++) {
      if (b.hole[t[i]] || t[i] < 0 || t[i] >= b.N) return 'the tour uses a missing square';
      if (i && !b.knight[t[i - 1]].includes(t[i])) return 'step ' + (i + 1) + ' is not a knight\'s move';
    }
    if (d.closed && !b.knight[t[n - 1]].includes(t[0])) return 'the tour does not close';
    if (d.start != null && t[0] !== d.start) return 'the tour starts on the wrong square';
    if (d.end != null && t[n - 1] !== d.end) return 'the tour ends on the wrong square';
    for (const k in d.given || {}) if (t[d.given[k] - 1] !== +k) return 'the tour misses the given number ' + d.given[k];
    return null;
  }

  /* ---------- placing pieces ---------- */

  function placeInfo(d) {
    const b = board(d);
    const cov = coverTable(b, d.piece);
    const forbid = new Uint8Array(b.N);
    (d.forbid || []).forEach((s) => { forbid[s] = 1; });
    const fixed = (d.fixed || []).slice();
    return { b, cov, forbid, fixed };
  }
  const allowed = (I, s) => !I.b.hole[s] && !I.b.pawn[s] && !I.forbid[s];
  // pairs of pieces on these squares that attack each other
  function pairsAttacking(I, type, sqs) {
    const occ = new Uint8Array(I.b.N);
    sqs.forEach((s) => { occ[s] = 1; });
    const out = [];
    sqs.forEach((s) => { attacks(I.b, type, s, occ).forEach((t) => { if (occ[t] && s < t) out.push([s, t]); }); });
    return out;
  }
  function guarded(I, type, sqs) {
    const g = new Uint8Array(I.b.N), occ = new Uint8Array(I.b.N);
    sqs.forEach((s) => { occ[s] = 1; });
    sqs.forEach((s) => { g[s] = 1; attacks(I.b, type, s, occ).forEach((t) => { g[t] = 1; }); });
    return g;
  }
  function unguarded(I, type, sqs) {
    const g = guarded(I, type, sqs), out = [];
    for (const s of I.b.squares) if (!I.b.pawn[s] && !g[s]) out.push(s);
    return out;
  }

  // pieces that never attack each other: choose `need` squares (fixed ones included); count up to max
  function indepSearch(d, opts) {
    opts = opts || {};
    const I = placeInfo(d), b = I.b, cov = I.cov;
    const need = d.need, max = opts.max || 1, limit = opts.limit || 4e6;
    const res = { sols: [], nodes: 0, aborted: false };
    const blocked = new Int16Array(b.N);
    const chosen = I.fixed.slice().concat(opts.with || []);
    for (const s of chosen) { if (!allowed(I, s) && !I.fixed.includes(s)) return res; }
    for (let i = 0; i < chosen.length; i++) for (let j = i + 1; j < chosen.length; j++) if (cov[chosen[i]].includes(chosen[j])) return res;
    const mark = (s, k) => { blocked[s] += k; cov[s].forEach((t) => { blocked[t] += k; }); };
    chosen.forEach((s) => mark(s, 1));
    const cand = b.squares.filter((s) => allowed(I, s) && !chosen.includes(s));
    // rooks and queens: at most one piece in each stretch of a row between pawns
    const rowSeg = new Int16Array(b.N).fill(-1);
    let nseg = 0;
    if (d.piece === 'Q' || d.piece === 'R') {
      for (let r = 0; r < b.R; r++) {
        let open = false;
        for (let c = 0; c < b.W; c++) {
          const s = r * b.W + c;
          if (b.hole[s] || b.pawn[s]) { open = false; continue; }
          if (!open) { nseg++; open = true; }
          rowSeg[s] = nseg - 1;
        }
      }
    }
    const segUsed = new Uint8Array(nseg + 1);
    chosen.forEach((s) => { if (rowSeg[s] >= 0) segUsed[rowSeg[s]] = 1; });
    function bound(from) {
      if (!nseg) { let k = 0; for (let i = from; i < cand.length; i++) if (!blocked[cand[i]]) k++; return k; }
      const seen = new Uint8Array(nseg);
      let k = 0;
      for (let i = from; i < cand.length; i++) { const s = cand[i]; if (blocked[s]) continue; const g = rowSeg[s]; if (!segUsed[g] && !seen[g]) { seen[g] = 1; k++; } }
      return k;
    }
    function go(from) {
      if (res.sols.length >= max || res.aborted) return;
      if (++res.nodes > limit) { res.aborted = true; return; }
      if (chosen.length === need) { res.sols.push(chosen.slice().sort((x, y) => x - y)); return; }
      if (bound(from) < need - chosen.length) return;
      for (let i = from; i < cand.length; i++) {
        const s = cand[i];
        if (blocked[s] || (nseg && segUsed[rowSeg[s]])) continue;
        chosen.push(s); mark(s, 1); if (nseg) segUsed[rowSeg[s]] = 1;
        go(i + 1);
        chosen.pop(); mark(s, -1); if (nseg) segUsed[rowSeg[s]] = 0;
        if (res.sols.length >= max || res.aborted) return;
      }
    }
    go(0);
    return res;
  }

  // guard every square with at most k pieces (independent too when opts.indep)
  function domSearch(d, k, opts) {
    opts = opts || {};
    const I = placeInfo(d), b = I.b, cov = I.cov;
    const max = opts.max || 1, limit = opts.limit || 6e6;
    const res = { sols: [], nodes: 0, aborted: false };
    const cnt = new Int16Array(b.N);
    const targets = b.squares.filter((s) => !b.pawn[s]);
    const chosen = I.fixed.slice().concat(opts.with || []);
    const hit = (s, x) => { cnt[s] += x; cov[s].forEach((t) => { cnt[t] += x; }); };
    chosen.forEach((s) => hit(s, 1));
    const indep = !!opts.indep;
    const tried = new Set();
    function go() {
      if (res.sols.length >= max || res.aborted) return;
      if (++res.nodes > limit) { res.aborted = true; return; }
      let t = -1;
      for (const s of targets) if (!cnt[s]) { t = s; break; }
      if (t < 0) {
        const key = chosen.slice().sort((x, y) => x - y);
        if (!tried.has(key.join())) { tried.add(key.join()); res.sols.push(key); }
        return;
      }
      if (chosen.length >= k) return;
      const cands = [t].concat(cov[t]);
      for (const s of cands) {
        if (!allowed(I, s) || chosen.includes(s)) continue;
        if (indep && chosen.some((c) => cov[c].includes(s))) continue;
        chosen.push(s); hit(s, 1);
        go();
        chosen.pop(); hit(s, -1);
        if (res.sols.length >= max || res.aborted) return;
      }
    }
    go();
    return res;
  }

  function placeCheck(d, sqs) {
    // { ok, pairs, unguarded }
    const I = placeInfo(d);
    const all = I.fixed.concat(sqs.filter((s) => !I.fixed.includes(s)));
    const pairs = d.goal === 'dom' ? [] : pairsAttacking(I, d.piece, all);
    const ung = d.goal === 'indep' ? [] : unguarded(I, d.piece, all);
    const ok = all.length === d.need && !pairs.length && !ung.length && all.every((s) => I.fixed.includes(s) || allowed(I, s));
    return { ok, pairs, ung, count: all.length, I };
  }

  /* ---------- drawing the pieces (on a 100 × 100 square, standing on y = 91) ---------- */

  const BASE = 'M22 91V86Q22 81 28 81H72Q78 81 78 86V91Z';
  const SHAPES = {
    N: { body: ['M32 81C32 70 37 63 45 57C39 58 33 61 27 63C21 65 16 61 17 55C18 50 23 46 29 42L33 33C35 28 38 24 41 22L41 12L48 20C63 20 76 33 74 55C73 67 68 74 70 81Z'], lines: ['M52 25C63 31 68 44 65 60'], dots: [[37.5, 34, 2.8], [22, 56, 1.4]] },
    Q: { body: ['M31 81L37 50H63L69 81Z', 'M30 51L20 25L35 38L34 18L45 34L50 13L55 34L66 18L65 38L80 25L70 51Z'], balls: [[20, 23, 4.5], [34, 16, 4.5], [50, 11, 5], [66, 16, 4.5], [80, 23, 4.5]], lines: ['M33 58H67'] },
    K: { body: ['M31 81L37 52H63L69 81Z', 'M33 53C27 42 35 31 50 33C65 31 73 42 67 53Z', 'M46 9H54V16H61V23H54V33H46V23H39V16H46Z'], lines: ['M34 60H66'] },
    R: { body: ['M29 81L33 74L36 41L30 37V20H39V27H46V20H54V27H61V20H70V37L64 41L67 74L71 81Z'], lines: ['M36 41H64M34 74H66'] },
    B: { body: ['M33 81C37 71 41 64 43 58H57C59 64 63 71 67 81Z', 'M38 51H62V58H38Z', 'M50 16C63 26 67 39 61 51H39C33 39 37 26 50 16Z'], balls: [[50, 12, 4.5]], lines: ['M52 28L59 37'] },
    P: { body: ['M34 81C38 70 42 62 44 56H56C58 62 62 70 66 81Z', 'M38 50H62V56H38Z'], balls: [[50, 38, 12]] }
  };
  function pieceSVG(type, colour) {
    const sh = SHAPES[type];
    const cls = 'cm-p ' + (colour === 'b' ? 'blk' : colour === 'g' ? 'grey' : 'wht');
    let s = '<g class="' + cls + '"><path class="cm-pb" d="' + BASE + '"/>';
    sh.body.forEach((d) => { s += '<path class="cm-pb" d="' + d + '"/>'; });
    (sh.balls || []).forEach((c) => { s += '<circle class="cm-pb" cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '"/>'; });
    (sh.lines || []).forEach((d) => { s += '<path class="cm-pl" d="' + d + '"/>'; });
    (sh.dots || []).forEach((c) => { s += '<circle class="cm-pd" cx="' + c[0] + '" cy="' + c[1] + '" r="' + c[2] + '"/>'; });
    return s + '</g>';
  }
  function drawPiece(ctx, parent, type, colour, x, y, extra) {
    const g = ctx.s('g', { class: 'cm-piece' + (extra ? ' ' + extra : ''), transform: 'translate(' + x + ' ' + y + ') scale(.01)' }, parent);
    g.innerHTML = pieceSVG(type, colour);
    return g;
  }
  const placeEl = (el, x, y) => el.setAttribute('transform', 'translate(' + x + ' ' + y + ') scale(.01)');

  // the board with its frame, squares and letters; returns helpers
  function drawBoard(ctx, parent, b) {
    const m = 0.36;
    ctx.s('rect', { x: -m, y: -m, width: b.W + 2 * m, height: b.R + 2 * m, rx: 0.14, class: 'cm-frame' }, parent);
    for (let s = 0; s < b.N; s++) {
      const [r, c] = b.rc(s);
      if (b.hole[s]) { ctx.s('rect', { x: c + 0.06, y: r + 0.06, width: 0.88, height: 0.88, rx: 0.08, class: 'cm-hole' }, parent); continue; }
      ctx.s('rect', { x: c, y: r, width: 1, height: 1, class: 'cm-sq ' + ((r + c) % 2 ? 'dark' : 'light'), 'data-key': 'sq' + s }, parent);
    }
    for (let c = 0; c < b.W; c++) ctx.s('text', { x: c + 0.5, y: b.R + m / 2 + 0.01, class: 'cm-coord', text: 'abcdefghijklmnop'[c] }, parent);
    for (let r = 0; r < b.R; r++) ctx.s('text', { x: -m / 2, y: r + 0.5, class: 'cm-coord', text: String(b.R - r) }, parent);
  }
  function squareAt(b, pt) {
    const c = Math.floor(pt[0]), r = Math.floor(pt[1]);
    if (!b.on(r, c)) return -1;
    return r * b.W + c;
  }
  function hop(el, from, to, ms, done) {
    const t0 = performance.now();
    const dur = C.anim(ms || 280);
    const lift = Math.min(0.9, 0.25 + 0.2 * G.dist(from, to));
    const step = (now) => {
      const k = Math.min(1, (now - t0) / (dur || 1)), e = 0.5 - Math.cos(k * Math.PI) / 2;
      placeEl(el, from[0] + (to[0] - from[0]) * e, from[1] + (to[1] - from[1]) * e - lift * Math.sin(k * Math.PI));
      if (k < 1) root.requestAnimationFrame(step);
      else if (done) done();
    };
    root.requestAnimationFrame(step);
  }
  function pulseSq(ctx, parent, b, s, cls, ms) {
    const [r, c] = b.rc(s);
    const el = ctx.s('rect', { x: c + 0.04, y: r + 0.04, width: 0.92, height: 0.92, rx: 0.1, class: 'cm-pulse' + (cls ? ' ' + cls : '') }, parent);
    setTimeout(() => el.remove(), ms || 3200);
  }
  function arrow(ctx, parent, b, s, t, cls, ms) {
    const [r1, c1] = b.rc(s), [r2, c2] = b.rc(t);
    const el = ctx.s('path', { d: 'M' + (c1 + 0.5) + ' ' + (r1 + 0.5) + 'L' + (c2 + 0.5) + ' ' + (r2 + 0.5), class: 'cm-arrow' + (cls ? ' ' + cls : '') }, parent);
    if (ms) setTimeout(() => el.remove(), ms);
    return el;
  }

  /* ---------- knights changing places ---------- */

  function mountSwap(ctx, p) {
    const d = p.data, wb = ctx.wb, b = board(d);
    let st = swapStart(d), moves = 0, sel = -1, busy = false, graphOn = false;
    const turnOf = () => (d.alt ? (moves % 2 ? 'b' : 'w') : null);
    const bg = wb.layer('board'), top = wb.layer('top');
    drawBoard(ctx, bg, b);
    const goalG = ctx.s('g', { class: 'cm-goals' }, bg);
    d.goal.w.forEach((s) => { const [r, c] = b.rc(s); ctx.s('path', { d: 'M' + c + ' ' + r + 'h.3l-.3 .3z', class: 'cm-goal w' }, goalG); });
    d.goal.b.forEach((s) => { const [r, c] = b.rc(s); ctx.s('path', { d: 'M' + c + ' ' + r + 'h.3l-.3 .3z', class: 'cm-goal b' }, goalG); });
    const graphG = ctx.s('g', { class: 'cm-graph' }, bg);
    const dotG = ctx.s('g', { class: 'cm-dots' }, bg);
    const pieceG = ctx.s('g', { class: 'cm-pieces' }, bg);
    const flashG = ctx.s('g', { class: 'cm-flash' }, top);
    wb.setBounds({ x0: -0.5, y0: -0.5, x1: b.W + 0.5, y1: b.R + 0.5 }, 0.08);
    let els = {};

    function render() {
      pieceG.innerHTML = '';
      els = {};
      for (let s = 0; s < b.N; s++) {
        const ch = st[s];
        if (ch !== 'w' && ch !== 'b') continue;
        const [r, c] = b.rc(s);
        els[s] = drawPiece(ctx, pieceG, 'N', ch, c, r, (s === sel ? 'sel' : '') + (turnOf() && ch !== turnOf() ? ' wait' : ''));
      }
      dotG.innerHTML = '';
      if (sel >= 0) targets(sel).forEach((t) => { const [r, c] = b.rc(t); ctx.s('circle', { cx: c + 0.5, cy: r + 0.5, r: 0.14, class: 'cm-dot' }, dotG); });
      graphG.innerHTML = '';
      if (graphOn) {
        const seen = new Set();
        b.squares.forEach((s) => b.knight[s].forEach((t) => {
          const k = Math.min(s, t) + ',' + Math.max(s, t);
          if (seen.has(k)) return;
          seen.add(k);
          const [r1, c1] = b.rc(s), [r2, c2] = b.rc(t);
          ctx.s('line', { x1: c1 + 0.5, y1: r1 + 0.5, x2: c2 + 0.5, y2: r2 + 0.5 }, graphG);
        }));
      }
      ctx.stat('Moves', moves);
    }
    const targets = (s) => b.knight[s].filter((t) => st[t] === '.');
    const centre = (s) => { const [r, c] = b.rc(s); return [c, r]; };

    function doMove(from, to, animate, after) {
      const el = els[from];
      const fin = () => {
        st = applyMove(st, [from, to]);
        moves++;
        ctx.move();
        sel = -1;
        render();
        ctx.sfx('snap');
        if (d.alt && !swapGoal(d, st)) ctx.say((turnOf() === 'w' ? 'White' : 'Black') + ' to move.');
        else if (!swapGoal(d, st)) ctx.say('Knight ' + sqName(b, from) + '–' + sqName(b, to) + '.');
        if (after) after(); else ctx.changed('move');
      };
      if (animate && el) { busy = true; pieceG.appendChild(el); hop(el, centre(from), centre(to), 300, () => { busy = false; fin(); }); }
      else fin();
    }

    let g = null;
    wb.handlers.board = {
      down(pt) {
        if (busy) return false;
        const s = squareAt(b, pt);
        if (s < 0) { if (sel >= 0) { sel = -1; render(); } return false; }
        const ch = st[s];
        if (ch === 'w' || ch === 'b') {
          if (turnOf() && ch !== turnOf()) { ctx.say('It is ' + (turnOf() === 'w' ? 'white' : 'black') + '\'s turn.', 'warn'); return false; }
          g = { from: s, p0: pt, moved: false };
          return true;
        }
        if (sel >= 0 && targets(sel).includes(s)) { g = { to: s }; return true; }
        if (sel >= 0) { sel = -1; render(); }
        return false;
      },
      move(pt) {
        if (!g || g.from == null) return;
        if (!g.moved && G.dist(pt, g.p0) < 0.12) return;
        if (!g.moved) { g.moved = true; sel = g.from; render(); top.appendChild(els[g.from]); }
        placeEl(els[g.from], pt[0] - 0.5, pt[1] - 0.55);
      },
      up(pt) {
        const gg = g;
        g = null;
        if (!gg) return;
        if (gg.to != null) { doMove(sel, gg.to, true); return; }
        if (!gg.moved) { sel = sel === gg.from ? -1 : gg.from; render(); if (sel >= 0 && !targets(sel).length) ctx.say('That knight has nowhere to go just now.', 'warn'); return; }
        const t = squareAt(b, pt);
        if (t >= 0 && targets(gg.from).includes(t)) { els[gg.from].remove(); doMove(gg.from, t, false); return; }
        const el = els[gg.from];
        if (t !== gg.from) ctx.say(t >= 0 && st[t] === '.' ? 'A knight moves in an L: two squares one way and one square to the side.' : 'That square is taken.', 'warn');
        busy = true;
        hop(el, [pt[0] - 0.5, pt[1] - 0.55], centre(gg.from), 180, () => { busy = false; sel = -1; el.remove(); render(); });
      }
    };

    ctx.setGoal(p.goal || ('Move the knights so that ' + goalWords(d) + (d.alt ? ', white and black moving in turn' : '') + '.'));
    const gBtn = ctx.button('Show the knight\'s paths', () => { graphOn = !graphOn; gBtn.classList.toggle('on', graphOn); render(); }, 'small');
    render();
    if (d.alt) ctx.say('White to move.');

    return {
      check() {
        if (swapGoal(d, st)) return { solved: true, msg: 'Every knight is home' + (p.par && moves <= p.par ? ' — in the fewest possible moves!' : p.par ? ' (it can be done in ' + p.par + ')' : '') + '.', perfect: p.par != null && moves <= p.par };
        return { solved: false, msg: 'Not there yet: the corner tabs show where each colour must end.' };
      },
      hint() {
        const r = swapSolve(d, st, turnOf() || 'w', 300000);
        if (!r.path) return 'From here there is no way to finish — press Undo a few times.';
        if (!r.path.length) return 'You are there!';
        const m = r.path[0];
        return {
          text: 'Move the knight on ' + sqName(b, m[0]) + ' to ' + sqName(b, m[1]) + '. (From here it takes ' + C.plural(r.path.length, 'more move') + '.)',
          show() { pulseSq(ctx, flashG, b, m[0]); pulseSq(ctx, flashG, b, m[1]); arrow(ctx, flashG, b, m[0], m[1], '', 3200); }
        };
      },
      solve() {
        let r = swapSolve(d, st, turnOf() || 'w', 400000);
        if (!r.path) { st = swapStart(d); moves = 0; render(); r = swapSolve(d, st, 'w', 400000); }
        const path = r.path || [];
        let k = 0;
        const next = () => {
          if (k >= path.length) { ctx.changed('solve'); return; }
          const m = path[k++];
          doMove(m[0], m[1], true, () => setTimeout(next, C.anim(60)));
        };
        next();
      },
      explain() {
        const r = swapSolve(d, swapStart(d), 'w', 400000);
        if (!r.path) return '';
        return 'One shortest way (' + C.plural(r.path.length, 'move') + '): ' + r.path.map((m) => sqName(b, m[0]) + '–' + sqName(b, m[1])).join(', ') + '.';
      },
      getState() { return { st, m: moves }; },
      setState(s) { if (s && s.st) { st = s.st; moves = s.m || 0; sel = -1; render(); } },
      destroy() { busy = true; }
    };
  }
  /* ---------- knight's tours ---------- */

  function mountTour(ctx, p) {
    const d = p.data, wb = ctx.wb, b = board(d), n = b.squares.length;
    const given = d.given || {};
    const numOf = {}, atNum = {};
    for (const k in given) { numOf[k] = given[k]; atNum[given[k]] = +k; }
    const fixedStart = d.start != null ? d.start : (atNum[1] != null ? atNum[1] : -1);
    let path = fixedStart >= 0 ? [fixedStart] : [], claimed = false, wrong = 0, busy = false, lines = true;
    const bg = wb.layer('board'), top = wb.layer('top');
    drawBoard(ctx, bg, b);
    const markG = ctx.s('g', { class: 'cm-marks' }, bg);
    const lineG = ctx.s('g', { class: 'cm-tourlines' }, bg);
    const numG = ctx.s('g', { class: 'cm-nums' }, bg);
    const dotG = ctx.s('g', { class: 'cm-dots' }, bg);
    const pieceG = ctx.s('g', { class: 'cm-pieces' }, bg);
    const flashG = ctx.s('g', { class: 'cm-flash' }, top);
    wb.setBounds({ x0: -0.5, y0: -0.5, x1: b.W + 0.5, y1: b.R + 0.5 }, 0.08);
    if (d.end != null) { const [r, c] = b.rc(d.end); ctx.s('rect', { x: c + 0.07, y: r + 0.07, width: 0.86, height: 0.86, rx: 0.1, class: 'cm-endmark' }, markG); }
    let knight = null;
    const centre = (s) => { const [r, c] = b.rc(s); return [c, r]; };

    const canVisit = (x, step) => !b.hole[x] && !path.includes(x) && (numOf[x] == null || numOf[x] === step) && (atNum[step] == null || atNum[step] === x) && (d.end == null || x !== d.end || step === n);
    const nextSquares = () => {
      if (!path.length) return atNum[1] != null ? [atNum[1]] : b.squares.slice();
      const step = path.length + 1;
      return b.knight[path[path.length - 1]].filter((x) => canVisit(x, step));
    };
    const complete = () => {
      if (d.none) return claimed;
      if (path.length !== n) return false;
      if (d.closed && !b.knight[path[n - 1]].includes(path[0])) return false;
      if (d.end != null && path[n - 1] !== d.end) return false;
      return true;
    };

    function render() {
      numG.innerHTML = '';
      lineG.innerHTML = '';
      dotG.innerHTML = '';
      path.forEach((s, i) => {
        const [r, c] = b.rc(s);
        const isGiven = numOf[s] != null;
        ctx.s('rect', { x: c + 0.04, y: r + 0.04, width: 0.92, height: 0.92, rx: 0.08, class: 'cm-visited', style: '--h:' + Math.round(200 - 160 * i / Math.max(1, n - 1)) }, numG);
        if (i < path.length - 1) ctx.s('text', { x: c + 0.5, y: r + 0.53, class: 'cm-num' + (isGiven ? ' given' : ''), text: String(i + 1) }, numG);
      });
      for (const k in numOf) {
        if (path.includes(+k)) continue;
        const [r, c] = b.rc(+k);
        ctx.s('text', { x: c + 0.5, y: r + 0.53, class: 'cm-num given', text: String(numOf[k]) }, numG);
      }
      if (lines && path.length > 1) {
        let dd = '';
        path.forEach((s, i) => { const [r, c] = b.rc(s); dd += (i ? 'L' : 'M') + (c + 0.5) + ' ' + (r + 0.5); });
        if (complete() && d.closed) { const [r, c] = b.rc(path[0]); dd += 'L' + (c + 0.5) + ' ' + (r + 0.5); }
        ctx.s('path', { d: dd, class: 'cm-tour' }, lineG);
      }
      if (path.length) { const [r, c] = b.rc(path[0]); ctx.s('circle', { cx: c + 0.5, cy: r + 0.5, r: 0.42, class: 'cm-startring' }, lineG); }
      if (!busy && !claimed) nextSquares().forEach((x) => { const [r, c] = b.rc(x); ctx.s('circle', { cx: c + 0.5, cy: r + 0.5, r: path.length ? 0.13 : 0.07, class: 'cm-dot' + (path.length ? '' : ' faint') }, dotG); });
      if (!busy) {
        pieceG.innerHTML = '';
        knight = null;
        if (path.length) { const pc = centre(path[path.length - 1]); knight = drawPiece(ctx, pieceG, 'N', 'w', pc[0], pc[1]); }
      }
      ctx.stat('Visited', path.length + ' / ' + n);
    }
    function news() {
      if (d.none || claimed) return;
      if (complete()) return;
      if (path.length === n) {
        if (d.closed) ctx.say('Every square visited — but the last is not a knight\'s move from the first, so the tour does not close.', 'warn');
        else if (d.end != null) ctx.say('Every square visited, but the tour must end on the marked square.', 'warn');
        return;
      }
      if (path.length && !nextSquares().length) ctx.say('Stuck after ' + path.length + ' squares: no unvisited square is a knight\'s move away. Click an earlier square to go back to it.', 'warn');
      else if (path.length) ctx.say(path.length + ' of ' + n + ' squares.');
    }
    function step(x, why) {
      const from = path.length ? path[path.length - 1] : -1;
      path.push(x);
      ctx.sfx('tap');
      if (from >= 0 && knight && root.requestAnimationFrame) {
        busy = true;
        render();
        const el = knight;
        hop(el, centre(from), centre(x), 220, () => { busy = false; render(); news(); ctx.changed(why || 'step'); });
        return;
      }
      render(); news(); ctx.changed(why || 'step');
    }
    function tap(s) {
      if (busy || claimed) return;
      if (!path.length) {
        if (atNum[1] != null && s !== atNum[1]) { ctx.say('The tour must start on the square numbered 1.', 'warn'); return; }
        if (numOf[s] != null && numOf[s] !== 1) { ctx.say('That square is number ' + numOf[s] + ', not the start.', 'warn'); return; }
        step(s, 'start'); return;
      }
      if (nextSquares().includes(s)) { step(s); return; }
      const k = path.indexOf(s);
      const keep = fixedStart >= 0 ? 1 : 0;
      if (k === path.length - 1) {
        if (path.length > keep) { path.pop(); render(); news(); ctx.changed('back'); }
        return;
      }
      if (k >= 0) { path = path.slice(0, Math.max(k + 1, keep)); render(); ctx.say('Back to square ' + path.length + '.'); ctx.changed('back'); return; }
      const last = path[path.length - 1];
      if (!b.knight[last].includes(s)) ctx.say('Not a knight\'s move from ' + sqName(b, last) + ': two squares one way, one to the side.', 'warn');
      else if (numOf[s] != null) ctx.say('That square must be number ' + numOf[s] + ', not ' + (path.length + 1) + '.', 'warn');
      else if (atNum[path.length + 1] != null) ctx.say('Square ' + (path.length + 1) + ' is already fixed on the board.', 'warn');
      else if (d.end === s) ctx.say('The marked square must be the last one.', 'warn');
    }

    let g = null;
    wb.handlers.board = {
      down(pt) {
        if (busy) return false;
        const s = squareAt(b, pt);
        if (s < 0) return false;
        g = { s, p0: pt, moved: false, drag: path.length && s === path[path.length - 1] };
        return true;
      },
      move(pt) {
        if (!g || !g.drag || !knight) return;
        if (!g.moved && G.dist(pt, g.p0) < 0.12) return;
        g.moved = true;
        placeEl(knight, pt[0] - 0.5, pt[1] - 0.55);
      },
      up(pt) {
        const gg = g;
        g = null;
        if (!gg) return;
        if (!gg.moved) { tap(gg.s); return; }
        const t = squareAt(b, pt);
        if (t >= 0 && nextSquares().includes(t)) { path.push(t); ctx.sfx('tap'); render(); news(); ctx.changed('step'); return; }
        render();
      }
    };

    ctx.setGoal(p.goal || (d.none ? 'Find the tour — or decide that there is none.' : 'Move the knight so that it visits every square exactly once' + (d.closed ? ', ending a knight\'s move from where it started' : '') + (d.end != null ? ', ending on the marked square' : '') + '.'));
    if (d.ask || d.none) {
      ctx.button('There is no such tour', () => {
        if (busy || claimed) return;
        if (d.none) { claimed = true; render(); ctx.say('Right: no such tour exists.', 'good'); ctx.changed('claim'); }
        else { wrong++; ctx.sfx('wrong'); ctx.say('There is one — keep going.', 'warn'); ctx.changed('claim'); }
      }, 'small');
    }
    const lBtn = ctx.button('Hide the path', () => { lines = !lines; lBtn.textContent = lines ? 'Hide the path' : 'Show the path'; render(); }, 'small.ghost');
    render();
    if (!path.length) ctx.say('Click a square to put the knight down.');

    function search(prefix, limit) { return tourSearch(d, { prefix: prefix && prefix.length ? prefix : null, limit: limit || 250000 }); }
    return {
      noMoves: true,
      check() {
        if (complete()) { const r = { solved: true, msg: d.none ? 'No such tour exists.' : 'The knight has been everywhere, once.' }; if (wrong) r.stars = Math.max(1, 3 - wrong); return r; }
        if (d.none) return { solved: false, msg: 'Decide whether the tour exists at all.' };
        return { solved: false, msg: path.length + ' of ' + n + ' squares visited.' };
      },
      hint(k) {
        if (d.none) return k === 0 ? 'Try a few different starts and watch where every attempt gets stuck — the same squares each time?' : 'The cabinet tried every route from every square: none exists. Press the button.';
        if (!path.length) {
          const r = search(null, 200000);
          return r.sols.length ? { text: 'Start in the pulsing square.', show() { pulseSq(ctx, flashG, b, r.sols[0][0]); } } : 'Start in a corner.';
        }
        const r = search(path, 250000);
        if (r.sols.length) {
          const nx = r.sols[0][path.length];
          if (nx == null) return 'Every square visited!';
          return { text: 'Jump to the pulsing square. (Warnsdorff\'s rule of 1823: go where the knight will have the fewest ways on — corners and edges first.)', show() { pulseSq(ctx, flashG, b, nx); } };
        }
        if (r.aborted) return 'Warnsdorff\'s rule: jump to the square with the fewest onward moves.';
        for (let m = path.length - 1; m >= Math.max(1, fixedStart >= 0 ? 1 : 1); m--) {
          const r2 = search(path.slice(0, m), 120000);
          if (r2.sols.length) return { text: 'This tour cannot be finished. Go back to square ' + m + ' — the jump to the red square was the mistake.', show() { pulseSq(ctx, flashG, b, path[m], 'bad'); } };
          if (r2.aborted) break;
        }
        return 'Start again from another square.';
      },
      solve() {
        if (d.none) { claimed = true; render(); ctx.changed('solve'); return; }
        let target = null;
        if (path.length) { const r = search(path, 300000); if (r.sols.length) target = r.sols[0]; }
        if (!target) { path = fixedStart >= 0 ? [fixedStart] : []; target = d.sol.slice(); }
        busy = true;
        const next = () => {
          if (path.length < target.length) { path.push(target[path.length]); render(); setTimeout(next, C.anim(90)); return; }
          busy = false;
          render();
          ctx.changed('solve');
        };
        next();
      },
      getState() { return { p: path.slice(), c: claimed, w: wrong }; },
      setState(s) { if (!s) return; path = (s.p || []).slice(); claimed = !!s.c; wrong = s.w || 0; busy = false; render(); },
      destroy() { busy = true; }
    };
  }

  /* ---------- queens and friends ---------- */

  function mountPlace(ctx, p) {
    const d = p.data, wb = ctx.wb;
    const I = placeInfo(d), b = I.b, T = d.piece, name = NAMES[T];
    const fixed = I.fixed;
    let placed = [], showAtt = false, busy = false;
    const bg = wb.layer('board'), top = wb.layer('top');
    drawBoard(ctx, bg, b);
    const attG = ctx.s('g', { class: 'cm-att' }, bg);
    const markG = ctx.s('g', { class: 'cm-marks' }, bg);
    (d.forbid || []).forEach((s) => { const [r, c] = b.rc(s); ctx.s('path', { d: 'M' + (c + 0.25) + ' ' + (r + 0.25) + 'l.5 .5m0 -.5l-.5 .5', class: 'cm-forbid' }, markG); });
    const pieceG = ctx.s('g', { class: 'cm-pieces' }, bg);
    const lineG = ctx.s('g', { class: 'cm-hits' }, top);
    const flashG = ctx.s('g', { class: 'cm-flash' }, top);
    wb.setBounds({ x0: -0.5, y0: -0.5, x1: b.W + 0.5, y1: b.R + 0.5 }, 0.08);
    const all = () => fixed.concat(placed);
    const plural = cap(name) + 's';

    function render() {
      pieceG.innerHTML = '';
      attG.innerHTML = '';
      lineG.innerHTML = '';
      const sq = all();
      const res = placeCheck(d, placed);
      const bad = new Set();
      res.pairs.forEach(([s, t]) => { bad.add(s); bad.add(t); const [r1, c1] = b.rc(s), [r2, c2] = b.rc(t); ctx.s('line', { x1: c1 + 0.5, y1: r1 + 0.5, x2: c2 + 0.5, y2: r2 + 0.5, class: 'cm-hitline' }, lineG); });
      if (showAtt) {
        const g2 = guarded(I, T, sq);
        b.squares.forEach((s) => {
          if (b.pawn[s] || sq.includes(s)) return;
          const [r, c] = b.rc(s);
          if (g2[s]) ctx.s('rect', { x: c, y: r, width: 1, height: 1, class: 'cm-guarded' }, attG);
          else if (d.goal !== 'indep') ctx.s('rect', { x: c + 0.05, y: r + 0.05, width: 0.9, height: 0.9, rx: 0.08, class: 'cm-open' }, attG);
        });
      }
      (d.pawns || []).forEach((s) => { const [r, c] = b.rc(s); drawPiece(ctx, pieceG, 'P', 'g', c, r, 'pawn'); });
      sq.forEach((s) => {
        const [r, c] = b.rc(s);
        const el = drawPiece(ctx, pieceG, T, 'w', c, r, (fixed.includes(s) ? 'fixed' : '') + (bad.has(s) ? ' hit' : ''));
        if (fixed.includes(s)) ctx.s('circle', { cx: 86, cy: 14, r: 9, class: 'cm-pin' }, el);
      });
      ctx.stat(plural, sq.length + ' / ' + d.need);
      if (d.goal !== 'indep') ctx.stat('Unguarded', res.ung.length);
      return res;
    }
    function news(res) {
      if (res.ok) return;
      if (res.pairs.length) ctx.say(res.pairs.length === 1 ? 'Two ' + name + 's attack each other (red line).' : res.pairs.length + ' pairs of ' + name + 's attack each other.', 'warn');
      else if (res.count > d.need) ctx.say('That is more than ' + d.need + '.', 'warn');
      else if (d.goal !== 'indep' && res.count === d.need && res.ung.length) ctx.say(C.plural(res.ung.length, 'square is', 'squares are') + ' still unguarded' + (showAtt ? ' (ringed).' : ' — press “Show attacks” to see which.'), 'warn');
      else ctx.say(res.count + ' of ' + d.need + ' ' + name + 's placed.');
    }
    const act = (why) => { const r = render(); news(r); ctx.changed(why); };
    function canPut(s) { return s >= 0 && !b.hole[s] && !b.pawn[s] && !I.forbid[s] && !all().includes(s); }
    function tapSquare(s) {
      if (busy) return;
      if (fixed.includes(s)) { ctx.say('That ' + name + ' is fixed in place.', 'warn'); return; }
      const k = placed.indexOf(s);
      if (k >= 0) { placed.splice(k, 1); ctx.sfx('tap'); act('remove'); return; }
      if (b.pawn[s]) { ctx.say('A pawn stands there — it blocks lines but guards nothing.', 'info'); return; }
      if (I.forbid[s]) { ctx.say('That square is off limits.', 'warn'); return; }
      if (all().length >= d.need) { ctx.say('All ' + d.need + ' ' + name + 's are out. Click one to take it back.', 'warn'); return; }
      placed.push(s);
      ctx.sfx('snap');
      act('place');
    }
    let g = null, ghost = null;
    wb.handlers.board = {
      down(pt) {
        if (busy) return false;
        const s = squareAt(b, pt);
        if (s < 0) return false;
        g = { s, p0: pt, moved: false, piece: placed.includes(s) };
        return true;
      },
      move(pt) {
        if (!g || !g.piece) return;
        if (!g.moved && G.dist(pt, g.p0) < 0.15) return;
        if (!g.moved) { g.moved = true; ghost = drawPiece(ctx, top, T, 'w', 0, 0, 'ghost'); }
        placeEl(ghost, pt[0] - 0.5, pt[1] - 0.55);
      },
      up(pt) {
        const gg = g;
        g = null;
        if (ghost) { ghost.remove(); ghost = null; }
        if (!gg) return;
        if (!gg.moved) { tapSquare(gg.s); return; }
        const t = squareAt(b, pt);
        if (t === gg.s) return;
        if (!canPut(t)) { if (t < 0) { placed = placed.filter((x) => x !== gg.s); ctx.sfx('tap'); act('remove'); } else ctx.say('It cannot go there.', 'warn'); return; }
        placed = placed.map((x) => (x === gg.s ? t : x));
        ctx.sfx('snap');
        act('move');
      }
    };

    ctx.setGoal(p.goal || goalText(d));
    const aBtn = ctx.button('Show attacks', () => { showAtt = !showAtt; aBtn.classList.toggle('on', showAtt); render(); }, 'small');
    ctx.button('Clear the board', () => { if (!placed.length) return; placed = []; act('clear'); }, 'small.ghost');
    render();

    function completion(limit) {
      const opts = { with: placed.slice(), limit: limit || 200000 };
      const r = d.goal === 'indep' ? indepSearch(d, opts) : domSearch(d, d.need, Object.assign({ indep: d.goal === 'both' }, opts));
      if (!r.sols.length) return null;
      let sol = r.sols[0];
      if (sol.length < d.need) {
        // guarding with fewer: fill up with any free squares (keeping the rules)
        sol = sol.slice();
        for (const s of b.squares) {
          if (sol.length >= d.need) break;
          if (!sol.includes(s) && allowed(I, s) && (d.goal !== 'both' || !placeCheck(d, sol.concat([s]).filter((x) => !fixed.includes(x))).pairs.length)) sol.push(s);
        }
      }
      return sol.filter((s) => !fixed.includes(s));
    }
    return {
      noMoves: true,
      check() {
        const res = placeCheck(d, placed);
        if (res.ok) return { solved: true, msg: d.goal === 'indep' ? 'No ' + name + ' attacks another.' : d.goal === 'dom' ? 'Every square is guarded.' : 'Every square guarded, and no ' + name + ' attacks another.' };
        if (res.count < d.need) return { solved: false, msg: res.count + ' of ' + d.need + ' ' + name + 's placed.' };
        if (res.pairs.length) return { solved: false, msg: 'Some ' + name + 's attack each other.' };
        return { solved: false, msg: C.plural(res.ung.length, 'square is', 'squares are') + ' unguarded.' };
      },
      hint() {
        const res = placeCheck(d, placed);
        if (res.pairs.length) {
          const [s, t] = res.pairs[0];
          return { text: 'The ' + name + 's on ' + sqName(b, s) + ' and ' + sqName(b, t) + ' attack each other: one of them has to move.', show() { pulseSq(ctx, flashG, b, s, 'bad'); pulseSq(ctx, flashG, b, t, 'bad'); } };
        }
        const sol = (d.sol || []).filter((s) => !fixed.includes(s));
        let target = placed.every((s) => sol.includes(s)) ? sol : completion(150000);
        if (!target) {
          const wrongOne = placed.find((s) => !sol.includes(s));
          if (wrongOne != null) return { text: 'The ' + name + ' on ' + sqName(b, wrongOne) + ' is in the way: take it off.', show() { pulseSq(ctx, flashG, b, wrongOne, 'bad'); } };
          target = sol;
        }
        const nx = target.find((s) => !placed.includes(s));
        if (nx == null) return 'Everything is in place — check!';
        return { text: 'Put a ' + name + ' on ' + sqName(b, nx) + '.', show() { pulseSq(ctx, flashG, b, nx); } };
      },
      solve() {
        const sol = (d.sol || []).filter((s) => !fixed.includes(s));
        let target = placed.every((s) => sol.includes(s)) ? sol : (completion(250000) || sol);
        placed = placed.filter((s) => target.includes(s));
        render();
        busy = true;
        const rest = target.filter((s) => !placed.includes(s));
        let k = 0;
        const next = () => {
          if (k < rest.length) { placed.push(rest[k++]); render(); ctx.sfx('snap'); setTimeout(next, C.anim(140)); return; }
          busy = false;
          render();
          ctx.changed('solve');
        };
        next();
      },
      getState() { return { p: placed.slice(), a: showAtt }; },
      setState(s) { if (!s) return; placed = (s.p || []).slice(); showAtt = !!s.a; aBtn.classList.toggle('on', showAtt); busy = false; render(); },
      destroy() { busy = true; }
    };
  }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function goalText(d) {
    const nm = NAMES[d.piece] + (d.need === 1 ? '' : 's');
    if (d.goal === 'indep') return 'Place ' + d.need + ' ' + nm + ' so that no two attack each other.';
    if (d.goal === 'dom') return 'Place ' + d.need + ' ' + nm + ' so that every square is occupied or attacked.';
    return 'Place ' + d.need + ' ' + nm + ' that guard every square without attacking each other.';
  }

  function goalWords(d) {
    const same = (a, b2) => a.length === b2.length && a.slice().sort().join() === b2.slice().sort().join();
    if (same(d.goal.w, d.start.b) && same(d.goal.b, d.start.w)) return 'the white and black knights change places';
    return 'the white knights end on the squares with white tabs and the black knights on the squares with black tabs';
  }

  /* ---------- checking the data ---------- */

  function verifyData(p) {
    const d = p.data;
    if (!(d.rows >= 1 && d.cols >= 1 && d.rows <= 12 && d.cols <= 12)) return 'bad board size';
    const b = board(d);
    const inB = (s) => s >= 0 && s < b.N && !b.hole[s];
    if (d.kind === 'swap') {
      const sq = d.start.w.concat(d.start.b), gq = d.goal.w.concat(d.goal.b);
      if (!sq.every(inB) || !gq.every(inB)) return 'a knight is off the board';
      if (new Set(sq).size !== sq.length || new Set(gq).size !== gq.length) return 'two knights on one square';
      if (d.start.w.length !== d.goal.w.length || d.start.b.length !== d.goal.b.length) return 'start and goal have different knights';
      const r = swapSolve(d, swapStart(d), 'w', 600000);
      if (r.aborted) return 'too many positions to search (' + r.states + ')';
      if (!r.path) return 'the knights can never reach the goal';
      if (!r.path.length) return 'already solved';
      if (p.par != null && p.par !== r.path.length) return 'par is ' + p.par + ' but the fewest moves is ' + r.path.length;
      return null;
    }
    if (d.kind === 'tour') {
      if (d.none) {
        const r = tourSearch(d, { limit: 8e6 });
        if (r.aborted) return 'the search gave up: cannot prove there is no tour';
        if (r.sols.length) return 'marked impossible, but a tour exists';
        return null;
      }
      const e = tourValid(d, d.sol);
      if (e) return e;
      if (d.unique) {
        const r = tourSearch(d, { max: 2, limit: 8e6 });
        if (r.aborted) return 'the uniqueness search gave up';
        if (r.sols.length !== 1) return r.sols.length + ' tours fit the given numbers';
      }
      return null;
    }
    if (d.kind === 'place') {
      if (!NAMES[d.piece] || d.piece === 'P') return 'unknown piece';
      if (!['indep', 'dom', 'both'].includes(d.goal)) return 'unknown goal';
      const I = placeInfo(d);
      if (!(d.fixed || []).every((s) => allowed(I, s) || inB(s))) return 'a fixed piece is off the board';
      const sol = (d.sol || []).filter((s) => !(d.fixed || []).includes(s));
      const res = placeCheck(d, sol);
      if (!res.ok) return 'the stored solution does not work (' + res.count + ' pieces, ' + res.pairs.length + ' attacks, ' + res.ung.length + ' unguarded)';
      if (d.unique) {
        const r = d.goal === 'indep' ? indepSearch(d, { max: 2, limit: 6e6 }) : domSearch(d, d.need, { max: 2, indep: d.goal === 'both', limit: 6e6 });
        if (r.aborted) return 'the uniqueness search gave up';
        if (r.sols.length !== 1) return r.sols.length + ' solutions';
      }
      if (d.most) {
        const cov = I.cov, seen = new Set();
        for (const grp of d.most) {
          for (let i = 0; i < grp.length; i++) {
            if (seen.has(grp[i])) return 'square ' + grp[i] + ' is in two groups';
            seen.add(grp[i]);
            for (let j = i + 1; j < grp.length; j++) if (!cov[grp[i]].includes(grp[j])) return 'squares ' + grp[i] + ' and ' + grp[j] + ' do not attack each other';
          }
        }
        for (const s of b.squares) if ((allowed(I, s) || (d.fixed || []).includes(s)) && !seen.has(s)) return 'square ' + s + ' is in no group';
        if (d.most.length !== d.need) return 'the groups prove at most ' + d.most.length + ', not ' + d.need;
      }
      if (d.far) {
        // squares so far apart that no single piece guards two of them: at least that many pieces are needed
        if (d.far.length !== d.need) return 'the far-apart squares prove at least ' + d.far.length + ', not ' + d.need;
        for (const s of b.squares) {
          if (b.pawn[s]) continue;
          const seen = [s].concat(I.cov[s]).filter((t) => d.far.includes(t));
          if (seen.length > 1) return 'a piece on ' + s + ' guards two of the far-apart squares';
        }
      }
      if (d.fewest) {
        const r = domSearch(d, d.need - 1, { indep: d.goal === 'both', limit: 2e7 });
        if (r.aborted) return 'the search for fewer pieces gave up';
        if (r.sols.length) return 'it can be done with fewer: ' + r.sols[0].join(',');
      }
      return null;
    }
    return 'unknown kind ' + d.kind;
  }

  /* ---------- small pictures ---------- */

  function thumbBoard(d, inner) {
    const b = board(d);
    let s = '<svg viewBox="-0.3 -0.3 ' + (b.W + 0.6) + ' ' + (b.R + 0.6) + '" preserveAspectRatio="xMidYMid meet">';
    s += '<rect x="-0.2" y="-0.2" width="' + (b.W + 0.4) + '" height="' + (b.R + 0.4) + '" rx=".12" fill="#6b4a2b"/>';
    for (let q = 0; q < b.N; q++) {
      const [r, c] = b.rc(q);
      if (b.hole[q]) continue;
      s += '<rect x="' + c + '" y="' + r + '" width="1.01" height="1.01" fill="' + ((r + c) % 2 ? '#b88a5a' : '#ecd9b5') + '"/>';
    }
    return s + inner + '</svg>';
  }
  const thumbPiece = (type, col, s, b) => { const [r, c] = b.rc(s); return '<g transform="translate(' + c + ' ' + r + ') scale(.01)">' + pieceSVG(type, col).replace('class="cm-p ' + (col === 'b' ? 'blk' : col === 'g' ? 'grey' : 'wht') + '"', 'fill="' + (col === 'b' ? '#2f2d36' : col === 'g' ? '#8d8f98' : '#f7f2e7') + '" stroke="' + (col === 'b' ? '#0f0e12' : '#3a3228') + '" stroke-width="3" stroke-linejoin="round"') + '</g>'; };

  /* ---------- endless drawers ---------- */

  const WORDS = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const word = (n) => WORDS[n] || String(n);

  function genSwap(rng, level) {
    const band = [null, [3, 6], [7, 10], [11, 15], [16, 22], [23, 60]][level];
    const t0 = Date.now();
    for (let t = 0; t < 400 && Date.now() - t0 < 450; t++) {
      const rows = rng.range(level >= 4 ? 3 : 2, level >= 3 ? 4 : 3), cols = rng.range(3, level >= 4 ? 5 : 4);
      const N = rows * cols;
      if (N < 8) continue;
      const cells = rng.shuffle(Array.from({ length: N }, (x, i) => i));
      const nh = level >= 4 ? 1 + rng.int(Math.min(5, N - 8)) : rng.int(Math.min(3, N - 7));
      const holes = cells.slice(0, nh).sort((a, b) => a - b), free = cells.slice(nh);
      // long solutions come from sparse boards, where the knights file along narrow paths
      if (level >= 4) {
        const bb = board({ rows, cols, holes });
        const deg = free.reduce((s, x) => s + bb.knight[x].length, 0) / free.length;
        if (deg > 2.4 || free.some((x) => !bb.knight[x].length)) continue;
      }
      const k = rng.range(level >= 4 ? 2 : 1, Math.min(level >= 3 ? 3 : 2, Math.floor((free.length - 1) / 2)));
      const d = { kind: 'swap', rows, cols, start: { w: free.slice(0, k).sort((a, b) => a - b), b: free.slice(k, 2 * k).sort((a, b) => a - b) } };
      if (holes.length) d.holes = holes;
      d.goal = { w: d.start.b.slice(), b: d.start.w.slice() };
      const r = swapSolve(d, swapStart(d), 'w', 40000);
      if (!r.path || r.aborted || r.path.length < band[0] || r.path.length > band[1]) continue;
      const who = k === 1 ? 'a white knight and a black knight' : word(k) + ' white knights and ' + word(k) + ' black knights';
      return { title: 'Knights on a ' + rows + ' × ' + cols + ' Board', text: 'A ' + rows + ' × ' + cols + ' board' + (holes.length ? ' with ' + word(holes.length) + ' square' + (holes.length > 1 ? 's' : '') + ' missing' : '') + ', and ' + who + '. Make them change places.', par: r.path.length, diff: level, data: d };
    }
    return null;
  }
  function genTour(rng, level) {
    const sizes = [null, [[3, 4], [4, 5], [3, 7], [4, 6]], [[5, 5], [5, 6], [4, 7], [3, 9]], [[6, 6], [5, 7], [5, 8], [6, 7]], [[7, 7], [6, 8], [7, 8], [8, 8]], [[8, 8], [7, 8], [8, 8]]][level];
    for (let t = 0; t < 12; t++) {
      const [R, W] = rng.pick(sizes);
      const d = { kind: 'tour', rows: R, cols: W };
      const closed = level >= 3 && (R * W) % 2 === 0 && R >= 5 && rng() < (level >= 4 ? 0.6 : 0.35);
      if (closed) d.closed = true;
      // a few missing squares, as many of each colour
      const nh = level >= 3 ? rng.int(3) * 2 : 0;
      if (nh) {
        const light = [], dark = [];
        for (let s = 0; s < R * W; s++) (((Math.floor(s / W) + s % W) & 1) ? dark : light).push(s);
        rng.shuffle(light); rng.shuffle(dark);
        d.holes = light.slice(0, nh / 2).concat(dark.slice(0, nh / 2)).sort((a, b) => a - b);
      }
      if (!closed && level <= 2 && rng() < 0.5) d.start = 0;
      const r = tourSearch(d, { rng, limit: 120000 });
      if (!r.sols.length) continue;
      d.sol = r.sols[0];
      const n = board(d).squares.length;
      return { title: (closed ? 'A Closed Tour of ' : 'A Tour of ') + R + ' × ' + W + (nh ? ' with ' + word(nh) + ' Holes' : ''), text: 'Take the knight to every one of the ' + n + ' squares exactly once' + (d.start != null ? ', starting in the top-left corner' : '') + (closed ? ', and finish a knight\'s jump from where you began' : '') + '.' + (nh ? ' The missing squares are holes in the board.' : ''), diff: level, data: d };
    }
    return null;
  }
  function genQueens(rng, level) {
    const n = [0, 5, 6, 8, 8, 9][level] + (level === 5 ? rng.int(2) : level === 2 ? rng.int(2) : 0);
    const d0 = { kind: 'place', rows: n, cols: n, piece: 'Q', need: n, goal: 'indep' };
    const all = indepSearch(d0, { max: 2000, limit: 2e6 }).sols;
    if (!all.length) return null;
    for (let t = 0; t < 40; t++) {
      const sol = rng.pick(all);
      const fixed = [];
      const order = rng.shuffle(sol.slice());
      for (const s of order) { fixed.push(s); if (all.filter((x) => fixed.every((f) => x.includes(f))).length === 1) break; }
      for (let i = fixed.length - 1; i >= 0; i--) { const f = fixed.splice(i, 1)[0]; if (all.filter((x) => fixed.every((q) => x.includes(q))).length !== 1) fixed.splice(i, 0, f); }
      if (level === 4 && fixed.length > 2) continue;
      if (level === 3 && fixed.length < 3) continue;
      const d = Object.assign({}, d0, { fixed: fixed.sort((a, b) => a - b), sol: sol.slice().sort((a, b) => a - b), unique: true });
      return { title: word(n).replace(/^./, (c) => c.toUpperCase()) + ' Queens, ' + word(fixed.length).replace(/^./, (c) => c.toUpperCase()) + ' Given', text: word(fixed.length).replace(/^./, (c) => c.toUpperCase()) + (fixed.length === 1 ? ' queen stands' : ' queens stand') + ' on the ' + n + ' × ' + n + ' board already (blue pins). Add the rest so that ' + word(n) + ' queens stand there, none attacking another. Only one way works.', diff: level, data: d };
    }
    return null;
  }

  C.engine({
    id: 'chessmen',
    name: 'Chessmen',
    noMoves: false,

    // endless drawers: a fresh board of the asked level
    generate(rng, level, meta) {
      const id = meta && meta.id;
      if (id === 'knight-swaps') return genSwap(rng, level);
      if (id === 'knights-tour') return genTour(rng, level);
      if (id === 'queens') return genQueens(rng, level);
      return null;
    },
    tools: ['select', 'pan', 'pen', 'marker', 'eraser', 'note', 'paint', 'loupe'],
    about: '**Knights changing places:** drag a knight to a free square a knight\'s move away — two squares one way and one to the side — or click it and then its new square. The corner tabs show where each colour must end. *Show the knight\'s paths* draws every possible jump.\n\n' +
      '**Knight\'s tours:** click the squares the knight visits, in order (the first click puts it down). Click the last square to step back, an earlier one to go back to it. Numbers already on the board are fixed stops.\n\n' +
      '**Queens and guards:** click a square to place a piece, click it again to take it away, drag to move it. Red lines join pieces that attack each other; *Show attacks* shades every square under attack.',

    verify(p) {
      let err = null;
      try { err = verifyData(p); } catch (e) { err = 'threw ' + e.message; }
      return err ? { ok: false, err } : { ok: true };
    },

    mount(ctx, p) {
      const k = p.data.kind;
      if (k === 'swap') return mountSwap(ctx, p);
      if (k === 'tour') return mountTour(ctx, p);
      if (k === 'place') return mountPlace(ctx, p);
      ctx.say('Unknown puzzle kind: ' + k, 'warn');
      return {};
    },

    thumb(p) {
      const d = p.data, b = board(d);
      if (d.kind === 'swap') return thumbBoard(d, d.start.w.map((s) => thumbPiece('N', 'w', s, b)).join('') + d.start.b.map((s) => thumbPiece('N', 'b', s, b)).join(''));
      if (d.kind === 'tour') {
        // the knight where it starts (or in a corner) and the jumps it could make first — never the tour itself
        const given = d.given || {};
        let s0 = d.start != null ? d.start : Object.keys(given).find((k) => given[k] === 1);
        s0 = s0 != null ? +s0 : b.squares[0];
        let inner = '';
        for (const k in given) { const [r, c] = b.rc(+k); inner += '<text x="' + (c + 0.5) + '" y="' + (r + 0.68) + '" text-anchor="middle" font-size=".5" font-weight="800" fill="#8a1c1c">' + given[k] + '</text>'; }
        const [r0, c0] = b.rc(s0);
        b.knight[s0].forEach((t) => { const [r, c] = b.rc(t); inner += '<path d="M' + (c0 + 0.5) + ' ' + (r0 + 0.5) + 'L' + (c + 0.5) + ' ' + (r + 0.5) + '" stroke="#3d5a80" stroke-width=".06" stroke-dasharray=".12 .1" opacity=".8"/><circle cx="' + (c + 0.5) + '" cy="' + (r + 0.5) + '" r=".13" fill="#2e7d4f"/>'; });
        if (d.end != null) { const [r, c] = b.rc(d.end); inner += '<rect x="' + (c + 0.08) + '" y="' + (r + 0.08) + '" width=".84" height=".84" fill="none" stroke="#b3261e" stroke-width=".07" stroke-dasharray=".12 .08"/>'; }
        inner += thumbPiece('N', 'w', s0, b);
        if (d.none) inner += '<text x="' + b.W / 2 + '" y="' + (b.R / 2 + 0.4) + '" text-anchor="middle" font-size="' + Math.min(b.W, b.R) * 0.35 + '" font-weight="800" fill="#7a2e2e" opacity=".75">?</text>';
        return thumbBoard(d, inner);
      }
      // placing: what is given (pins, pawns, crossed squares) and the piece to place, never the answer
      let inner = (d.pawns || []).map((s) => thumbPiece('P', 'g', s, b)).join('') + (d.fixed || []).map((s) => thumbPiece(d.piece, 'w', s, b)).join('');
      (d.forbid || []).forEach((s) => { const [r, c] = b.rc(s); inner += '<path d="M' + (c + 0.25) + ' ' + (r + 0.25) + 'l.5 .5m0 -.5l-.5 .5" stroke="#a02828" stroke-width=".08" stroke-linecap="round"/>'; });
      const k = Math.min(b.W, b.R) * 0.55;
      inner += '<g opacity=".82" transform="translate(' + (b.W / 2 - k / 2) + ' ' + (b.R / 2 - k / 2 - k * 0.08) + ') scale(' + k / 100 + ')">' + pieceSVG(d.piece, 'b') + '</g>';
      inner += '<text x="' + (b.W / 2) + '" y="' + (b.R / 2 + k * 0.62) + '" text-anchor="middle" font-size="' + k * 0.32 + '" font-weight="800" fill="#fff" stroke="#2b2118" stroke-width="' + k * 0.03 + '" paint-order="stroke">× ' + d.need + '</text>';
      return thumbBoard(d, inner);
    }
  });

  C.chessKit = { board, attacks, coverTable, swapStart, swapSolve, swapGoal, tourSearch, tourValid, indepSearch, domSearch, placeCheck, placeInfo, sqName, knightDist };

  C.css('chessmen', `
    .cm-frame { fill: #6b4a2b; stroke: rgba(0,0,0,.4); stroke-width: .03; }
    .cm-sq.light { fill: #ecd9b5; }
    .cm-sq.dark { fill: #b88a5a; }
    .cm-hole { fill: none; stroke: rgba(255,255,255,.25); stroke-width: .03; stroke-dasharray: .08 .06; }
    [data-theme="light"] .cm-hole { stroke: rgba(0,0,0,.25); }
    .cm-coord { font: 700 .2px "Segoe UI", system-ui, sans-serif; fill: #e9d7b6; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
    .cm-piece { cursor: grab; }
    .cm-piece.pawn { cursor: default; }
    .cm-p .cm-pb { stroke-width: 3; stroke-linejoin: round; }
    .cm-p.wht .cm-pb { fill: #f7f2e7; stroke: #3a3228; }
    .cm-p.blk .cm-pb { fill: #33313b; stroke: #0d0c10; }
    .cm-p.grey .cm-pb { fill: #9a9ca6; stroke: #3d3f47; }
    .cm-p .cm-pl { fill: none; stroke-width: 2.4; stroke-linecap: round; }
    .cm-p.wht .cm-pl { stroke: #3a3228; }
    .cm-p.blk .cm-pl { stroke: #cfcac0; }
    .cm-p.wht .cm-pd { fill: #3a3228; }
    .cm-p.blk .cm-pd { fill: #e8e2d6; }
    .cm-piece.sel .cm-pb { filter: drop-shadow(0 0 4px #ffd166); }
    .cm-piece.wait { opacity: .75; }
    .cm-piece.hit .cm-pb { stroke: #d8443f; }
    .cm-piece.fixed .cm-pb { stroke: #1d4f91; }
    .cm-piece.ghost { opacity: .7; pointer-events: none; }
    .cm-pin { fill: #3d7bd9; stroke: #fff; stroke-width: 2.5; }
    .cm-dot { fill: rgba(40, 120, 70, .75); pointer-events: none; }
    .cm-dot.faint { fill: rgba(40, 90, 60, .3); }
    .cm-goal.w { fill: #fbf7ec; stroke: #3a3228; stroke-width: .02; }
    .cm-goal.b { fill: #2b2a33; stroke: #0d0c10; stroke-width: .02; }
    .cm-graph line { stroke: rgba(40, 90, 160, .55); stroke-width: .035; stroke-linecap: round; }
    .cm-pulse { fill: rgba(255, 209, 102, .35); stroke: #e0a100; stroke-width: .06; pointer-events: none; animation: cmpulse .8s ease-in-out infinite alternate; }
    .cm-pulse.bad { fill: rgba(216, 68, 63, .3); stroke: #d8443f; }
    @keyframes cmpulse { to { opacity: .35; } }
    .cm-arrow { fill: none; stroke: #e0a100; stroke-width: .09; stroke-linecap: round; stroke-dasharray: .12 .1; pointer-events: none; }
    .cm-visited { fill: hsl(var(--h, 200) 70% 55% / .35); pointer-events: none; }
    .cm-num { font: 700 .36px "Segoe UI", system-ui, sans-serif; fill: #2b2118; text-anchor: middle; dominant-baseline: central; pointer-events: none; }
    .cm-num.given { fill: #8a1c1c; font-weight: 800; }
    .cm-tour { fill: none; stroke: rgba(30, 60, 110, .55); stroke-width: .05; stroke-linejoin: round; stroke-linecap: round; pointer-events: none; }
    .cm-startring { fill: none; stroke: rgba(30, 110, 60, .8); stroke-width: .05; pointer-events: none; }
    .cm-endmark { fill: none; stroke: #b3261e; stroke-width: .06; stroke-dasharray: .1 .07; pointer-events: none; }
    .cm-forbid { stroke: rgba(160, 40, 40, .55); stroke-width: .06; stroke-linecap: round; pointer-events: none; }
    .cm-guarded { fill: rgba(205, 45, 45, .36); pointer-events: none; }
    .cm-open { fill: none; stroke: #2a8c55; stroke-width: .05; stroke-dasharray: .09 .06; pointer-events: none; }
    .cm-hitline { stroke: #d8443f; stroke-width: .06; stroke-linecap: round; opacity: .85; pointer-events: none; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
