/* The Puzzle Cabinet · engines/coins.js
 *
 * Coins on the table. The coins are loose pieces: drag one and on release it
 * settles into place — snug against one or two others (the spots of the
 * honeycomb packing), on a lattice, onto a line through two other coins, or
 * on top of another coin to make a stack (a stack counts, with all its coins,
 * in every row through it).
 *
 * Units: a coin is 1 across. With data.grid 'hex' or 'square' every position
 * in the data is a lattice point: hex (q, r) sits at x = q + r/2, y = r·√3/2;
 * square (i, j) at (i, j)·step. Without a grid, positions are table units.
 *
 * data: {
 *   coins: [[x, y], ...]            where the coins start (repeat a point to stack)
 *   metal: 'gold' | 'silver' | 'copper' | ['gold', 'silver', ...]
 *   grid:  'hex' | 'square'         (optional) the lattice the positions are on
 *   step:  1                        square lattice spacing
 *   snap:  'lattice' | 'contact' | 'rows' | 'free'
 *                                   how a dropped coin settles (default: lattice with a grid, else contact)
 *   stack: true | false             may coins be stacked (default: true for rows and square goals)
 *   goal:  { shape: [[x, y], ...], turn: 'translate' | 'rigid' | 'mirror' }
 *                                   the centres make this figure (moved; turned; or also turned over)
 *        | { rows: 5, perRow: 4 }   at least 5 straight rows of exactly 4 coins (a row has 3 or more places)
 *        | { touch: 2 }             every coin touches exactly 2 others
 *        | { square: 5 }            the coins outline a square with 5 on each side
 *   rules: { moves: 3,              at most 3 moves (a move lifts one coin; moving the same coin again
 *                                   straight away is still the same move)
 *            slide: true,           coins only slide on the table, never over others (every slide is a move)
 *            touch2: true }         a moved coin must come to rest touching at least two others
 *   sol:   [[[x, y], [x, y]], ...]  the stored solution: move the top coin at the first point to the second
 *   fin:   [[x, y], ...]            or the final positions (puzzles without a move limit)
 * }
 * p.par = the fewest moves, for puzzles with a move limit.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;

  const H3 = Math.sqrt(3) / 2;
  const SAME = 0.12;     // two coins this close share a place (a stack)
  const TOUCH = 0.05;    // |distance − 1| below this: touching
  const ROWTOL = 0.12;   // how far off a line a coin may sit and still be in the row
  const FIG = 0.14;      // tolerance when comparing figures

  /* ---------- positions ---------- */

  function W(d, p) {
    if (d.grid === 'hex') return [p[0] + p[1] / 2, p[1] * H3];
    if (d.grid === 'square') { const s = d.step || 1; return [p[0] * s, p[1] * s]; }
    return [p[0], p[1]];
  }
  const Wall = (d, pts) => pts.map((p) => W(d, p));
  // world -> lattice (rounded), or null when the point is not on the lattice
  function toLat(d, p, loose) {
    let q;
    if (d.grid === 'hex') { const r = Math.round(p[1] / H3); q = [Math.round(p[0] - r / 2), r]; }
    else if (d.grid === 'square') { const s = d.step || 1; q = [Math.round(p[0] / s), Math.round(p[1] / s)]; }
    else return null;
    if (!loose && G.dist(W(d, q), p) > SAME) return null;
    return q;
  }
  const key = (p) => p[0] + ',' + p[1];

  // group points into places: [{ p, n, idx: [...] }]
  function stacksOf(pts) {
    const out = [];
    pts.forEach((p, i) => {
      const s = out.find((q) => G.dist(q.p, p) < SAME);
      if (s) { s.n++; s.idx.push(i); } else out.push({ p: p.slice(), n: 1, idx: [i] });
    });
    return out;
  }
  function overlapPair(st) {
    for (let i = 0; i < st.length; i++) for (let j = i + 1; j < st.length; j++) {
      if (G.dist(st[i].p, st[j].p) < 1 - TOUCH) return [i, j];
    }
    return null;
  }
  function touchCount(p, others) {
    let n = 0;
    others.forEach((q) => { if (Math.abs(G.dist(p, q) - 1) < TOUCH) n++; });
    return n;
  }

  /* ---------- the goals ---------- */

  function matchAll(A, B, tol) {
    const used = new Array(B.length).fill(false);
    for (const a of A) {
      let f = -1;
      for (let k = 0; k < B.length; k++) if (!used[k] && G.dist(a, B[k]) < tol) { f = k; break; }
      if (f < 0) return false;
      used[f] = true;
    }
    return true;
  }
  function sameFigure(A, B, turn) {
    if (A.length !== B.length) return false;
    if (!A.length) return true;
    if (turn === 'translate') {
      const a0 = A[0];
      for (const b of B) {
        const dx = b[0] - a0[0], dy = b[1] - a0[1];
        if (matchAll(A.map((p) => [p[0] + dx, p[1] + dy]), B, FIG)) return true;
      }
      return false;
    }
    return G.pointsCongruent(A, B, { tol: FIG, allowMirror: turn === 'mirror' });
  }

  // straight rows through three or more places: [{ m: [place indices], count, a, b }]
  function rowsOf(st) {
    const n = st.length, seen = new Map();
    const members = (a, b) => {
      const u = G.norm(G.sub(b, a)), nv = [-u[1], u[0]];
      const m = [];
      for (let k = 0; k < n; k++) if (Math.abs(G.dot(G.sub(st[k].p, a), nv)) < ROWTOL) m.push(k);
      return m;
    };
    const far = (m) => {
      let fa = m[0], fb = m[1], best = -1;
      for (let x = 0; x < m.length; x++) for (let y = x + 1; y < m.length; y++) {
        const dd = G.dist(st[m[x]].p, st[m[y]].p);
        if (dd > best) { best = dd; fa = m[x]; fb = m[y]; }
      }
      return [fa, fb];
    };
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      let m = members(st[i].p, st[j].p);
      let ends = far(m);
      for (let it = 0; it < 3; it++) {
        const m2 = members(st[ends[0]].p, st[ends[1]].p);
        if (m2.join() === m.join()) break;
        m = m2;
        ends = far(m);
      }
      if (m.length < 3) continue;
      const k = m.join(',');
      if (seen.has(k)) continue;
      seen.set(k, { m, count: m.reduce((s, x) => s + st[x].n, 0), a: st[ends[0]].p, b: st[ends[1]].p });
    }
    const list = Array.from(seen.values());
    return list.filter((r) => !list.some((q) => q !== r && q.m.length > r.m.length && r.m.every((x) => q.m.includes(x))));
  }

  function squareInfo(st) {
    if (st.length < 4) return null;
    const hull = G.convexHull(st.map((s) => s.p));
    if (hull.length !== 4) return null;
    const e = hull.map((p, i) => G.sub(hull[(i + 1) % 4], p));
    const L = e.map(G.len);
    const s = (L[0] + L[1] + L[2] + L[3]) / 4;
    if (s < 0.9 || L.some((l) => Math.abs(l - s) > FIG)) return null;
    for (let i = 0; i < 4; i++) if (Math.abs(G.dot(e[i], e[(i + 1) % 4])) / (s * s) > 0.04) return null;
    const counts = [0, 0, 0, 0];
    for (const t of st) {
      let on = false;
      for (let i = 0; i < 4; i++) {
        if (G.segDist(t.p, hull[i], hull[(i + 1) % 4]) < ROWTOL) { counts[i] += t.n; on = true; }
      }
      if (!on) return { hull, counts, inside: true };
    }
    return { hull, counts, inside: false };
  }

  // does this arrangement (world points) meet the goal?  { ok, msg, ... }
  function testGoal(d, pts) {
    const g = d.goal;
    const st = stacksOf(pts);
    const ov = overlapPair(st);
    if (ov) return { ok: false, msg: 'Two coins overlap.', ov, st };
    if (g.shape) {
      const ok = sameFigure(pts, Wall(d, g.shape), g.turn || 'rigid');
      return { ok, st, msg: ok ? 'That is the figure.' : 'Not the figure on the card yet.' };
    }
    if (g.rows) {
      const all = rowsOf(st);
      const rows = all.filter((r) => r.count === g.perRow);
      return { ok: rows.length >= g.rows, st, rows, all, msg: 'Rows of ' + g.perRow + ': ' + rows.length + ' of ' + g.rows + '.' };
    }
    if (g.touch != null) {
      if (st.some((s) => s.n > 1)) return { ok: false, st, msg: 'No stacking in this one: every coin lies flat on the table.' };
      const deg = st.map((s, i) => touchCount(s.p, st.filter((t, j) => j !== i).map((t) => t.p)));
      const good = deg.filter((v) => v === g.touch).length;
      return { ok: good === st.length, st, deg, msg: good + ' of ' + st.length + ' coins touch exactly ' + C.plural(g.touch, 'other') + '.' };
    }
    if (g.square) {
      const sq = squareInfo(st);
      if (!sq) return { ok: false, st, msg: 'The coins do not outline a square yet.' };
      if (sq.inside) return { ok: false, st, sq, msg: 'Every coin must lie on the sides of the square.' };
      const ok = sq.counts.every((c) => c === g.square);
      return { ok, st, sq, msg: ok ? '' : 'Coins on the sides: ' + sq.counts.join(', ') + ' — each side needs ' + g.square + '.' };
    }
    return { ok: false, st, msg: 'This puzzle has no goal.' };
  }

  /* ---------- lattices: symmetries and the best placement of a figure ---------- */

  const NB = {
    hex: [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]],
    square: [[1, 0], [-1, 0], [0, 1], [0, -1]]
  };
  const ROT = { hex: (p) => [-p[1], p[0] + p[1]], square: (p) => [-p[1], p[0]] };
  const MIR = (p) => [p[1], p[0]];
  function symmetries(grid, turn) {
    if (turn === 'translate' || !grid) return [(p) => p];
    const n = grid === 'hex' ? 6 : 4, out = [];
    for (let m = 0; m < (turn === 'mirror' ? 2 : 1); m++) {
      for (let k = 0; k < n; k++) {
        out.push((p) => { let q = m ? MIR(p) : p; for (let i = 0; i < k; i++) q = ROT[grid](q); return q; });
      }
    }
    return out;
  }
  // the placement of figure T (lattice points) that leaves most of S (lattice points) where it is
  function bestPlacement(S, T, grid, turn) {
    const sc = new Map();
    S.forEach((p) => sc.set(key(p), (sc.get(key(p)) || 0) + 1));
    let best = { n: -1, placed: null };
    for (const f of symmetries(grid, turn)) {
      const T2 = T.map(f);
      const tried = new Set();
      for (const t of T2) for (const s of S) {
        const dx = s[0] - t[0], dy = s[1] - t[1], k = dx + ',' + dy;
        if (tried.has(k)) continue;
        tried.add(k);
        const placed = T2.map((p) => [p[0] + dx, p[1] + dy]);
        const tc = new Map();
        placed.forEach((p) => tc.set(key(p), (tc.get(key(p)) || 0) + 1));
        let n = 0;
        tc.forEach((c, kk) => { n += Math.min(c, sc.get(kk) || 0); });
        if (n > best.n) best = { n, placed };
      }
    }
    return best;
  }

  /* ---------- sliding: where can a coin get to without disturbing the others? ---------- */

  /* A fine lattice (eighth steps of the puzzle's own lattice) over the coins and a
   * margin, each node knowing which coins it lies under. A coin slides along
   * nodes clear of every other coin; the fine lattice contains the exact middle
   * of a gap one coin wide (two coins two apart) and the step straight through
   * it, while no step is long enough to cross a real wall between coins. */
  function fineGrid(d, pts, extra) {
    const Q = 8, hex = d.grid !== 'square', s = hex ? 1 : (d.step || 1);
    const bh = hex ? H3 / Q : s / Q;
    const bb = G.bbox([pts.concat(extra || [])]);
    const x0 = bb.x0 - 1.25, x1 = bb.x1 + 1.25, y0 = bb.y0 - 1.25, y1 = bb.y1 + 1.25;
    const b0 = Math.ceil(y0 / bh), b1 = Math.floor(y1 / bh);
    const rowA = [], rowStart = [];
    let n = 0;
    for (let b = b0; b <= b1; b++) {
      const lo = hex ? Math.ceil(x0 * Q - b / 2) : Math.ceil(x0 * Q / s), hi = hex ? Math.floor(x1 * Q - b / 2) : Math.floor(x1 * Q / s);
      rowA.push([lo, hi]); rowStart.push(n); n += Math.max(0, hi - lo + 1);
    }
    const toW = hex ? (a, b) => [(a + b / 2) / Q, b * bh] : (a, b) => [a * s / Q, b * bh];
    const idx = (a, b) => {
      if (b < b0 || b > b1) return -1;
      const r = rowA[b - b0];
      return a < r[0] || a > r[1] ? -1 : rowStart[b - b0] + a - r[0];
    };
    const toF = hex ? (p) => { const b = Math.round(p[1] / bh); return [Math.round(p[0] * Q - b / 2), b]; } : (p) => [Math.round(p[0] * Q / s), Math.round(p[1] / bh)];
    const mask = new Int32Array(n), A = new Int32Array(n), B = new Int32Array(n);
    for (let b = b0; b <= b1; b++) {
      const r = rowA[b - b0];
      for (let a = r[0]; a <= r[1]; a++) {
        const k = idx(a, b), w = toW(a, b);
        A[k] = a; B[k] = b;
        let m = 0;
        for (let j = 0; j < pts.length && j < 31; j++) {
          const dx = w[0] - pts[j][0], dy = w[1] - pts[j][1];
          if (dx * dx + dy * dy < 1 - 1e-6) m |= 1 << j;
        }
        mask[k] = m;
      }
    }
    const dirs = hex ? [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1], [1, 1], [-1, -1], [2, -1], [-2, 1], [1, -2], [-1, 2]]
      : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
    // the nodes coin i can reach without touching any other coin
    function reach(i) {
      const seen = new Uint8Array(n), f = toF(pts[i]), s0 = idx(f[0], f[1]);
      const other = ~(1 << i);
      if (s0 < 0) return seen;
      seen[s0] = 1;
      const queue = [s0];
      for (let h = 0; h < queue.length; h++) {
        const k = queue[h], a = A[k], b = B[k];
        for (const dv of dirs) {
          const k2 = idx(a + dv[0], b + dv[1]);
          if (k2 < 0 || seen[k2] || (mask[k2] & other)) continue;
          seen[k2] = 1;
          queue.push(k2);
        }
      }
      return seen;
    }
    const at = (seen, p) => { const f = toF(p), k = idx(f[0], f[1]); return k >= 0 && seen[k] === 1 && G.dist(toW(f[0], f[1]), p) < 0.02; };
    return { reach, at };
  }
  // can the coin at `from` slide to `to` without disturbing the coins at `others`?
  function canSlide(d, from, to, others) {
    const fg = fineGrid(d, others.concat([from]), [to]);
    return fg.at(fg.reach(others.length), to);
  }
  function slideRegion(d, from, others) {
    const fg = fineGrid(d, others.concat([from]));
    const seen = fg.reach(others.length);
    return { has: (p) => fg.at(seen, p) };
  }

  /* Breadth-first search over lattice positions for puzzles with slides (or any
   * lattice puzzle): the shortest list of moves [[from, to], ...] in lattice
   * coordinates, or null. opts: { depth, cap } */
  function latticeSolve(d, startLat, opts) {
    opts = opts || {};
    const rules = d.rules || {};
    const grid = d.grid, nb = NB[grid];
    const maxDepth = opts.depth != null ? opts.depth : 6;
    const cap = opts.cap || 60000;
    const sk = (s) => s.map(key).sort().join(';');
    const isGoal = (s) => testGoal(d, Wall(d, s)).ok;
    if (isGoal(startLat)) return [];
    const prev = new Map([[sk(startLat), null]]);
    let frontier = [startLat];
    for (let depth = 1; depth <= maxDepth; depth++) {
      const next = [];
      for (const s of frontier) {
        const occ = new Set(s.map(key));
        const fg = rules.slide ? fineGrid(d, Wall(d, s)) : null;
        for (let i = 0; i < s.length; i++) {
          const others = s.filter((p, j) => j !== i);
          const ow = Wall(d, others);
          const cand = new Map();
          others.forEach((p) => nb.forEach((v) => {
            const q = [p[0] + v[0], p[1] + v[1]], k = key(q);
            if (!occ.has(k)) cand.set(k, q);
          }));
          let region = null;
          for (const q of cand.values()) {
            const qw = W(d, q);
            const t = touchCount(qw, ow);
            if (rules.touch2 && t < 2) continue;
            if (rules.slide) {
              if (!region) region = fg.reach(i);
              if (!fg.at(region, qw)) continue;
            }
            const ns = others.concat([q]);
            const k = sk(ns);
            if (prev.has(k)) continue;
            prev.set(k, { from: sk(s), m: [s[i], q] });
            if (isGoal(ns)) {
              const path = [];
              let cur = k;
              while (prev.get(cur)) { const e = prev.get(cur); path.unshift(e.m); cur = e.from; }
              return path;
            }
            next.push(ns);
            if (prev.size > cap) return undefined;
          }
        }
      }
      frontier = next;
    }
    return null;
  }

  /* ---------- replaying a stored solution under the rules ---------- */

  // returns { ok, err, pts (world, bottom to top), moves }
  function replay(d, sol) {
    const rules = d.rules || {};
    const stackOK = stackAllowed(d);
    const coins = Wall(d, d.coins).map((p, i) => ({ p, i }));
    let moves = 0, last = -1;
    for (let k = 0; k < (sol || []).length; k++) {
      const A = W(d, sol[k][0]), B = W(d, sol[k][1]);
      let at = -1;
      for (let j = coins.length - 1; j >= 0; j--) if (G.dist(coins[j].p, A) < SAME) { at = j; break; }
      if (at < 0) return { ok: false, err: 'move ' + (k + 1) + ': no coin at ' + sol[k][0] };
      const c = coins[at];
      const others = coins.filter((x) => x !== c).map((x) => x.p);
      for (const q of others) {
        const dd = G.dist(q, B);
        if (dd < SAME && !stackOK) return { ok: false, err: 'move ' + (k + 1) + ': stacking is not allowed' };
        if (dd >= SAME && dd < 1 - TOUCH) return { ok: false, err: 'move ' + (k + 1) + ': the coin would overlap another' };
      }
      if (rules.slide && !canSlide(d, c.p, B, others)) return { ok: false, err: 'move ' + (k + 1) + ': the coin cannot slide there' };
      if (rules.touch2 && touchCount(B, others) < 2) return { ok: false, err: 'move ' + (k + 1) + ': the coin does not touch two others' };
      coins.splice(at, 1);
      coins.push({ p: B, i: c.i });
      if (rules.slide || c.i !== last) moves++;
      last = c.i;
    }
    return { ok: true, pts: coins.map((x) => x.p), moves };
  }

  function stackAllowed(d) { return d.stack != null ? !!d.stack : !!(d.goal && (d.goal.rows || d.goal.square)); }

  // the final arrangement the stored solution reaches (world)
  function finalOf(d) {
    if (d.fin) return Wall(d, d.fin);
    const r = replay(d, d.sol);
    return r.ok ? r.pts : null;
  }

  // lifting coins on a lattice: keep the best placement of the target figure and
  // move every other coin straight to a free place of it (nearest first)
  function liftPlan(d, goalShape, turn) {
    const bp = bestPlacement(d.coins, goalShape || d.goal.shape, d.grid, turn || d.goal.turn || 'rigid');
    const need = new Map();
    bp.placed.forEach((p) => need.set(key(p), (need.get(key(p)) || 0) + 1));
    const movers = [];
    d.coins.forEach((p) => { const k = key(p); if ((need.get(k) || 0) > 0) need.set(k, need.get(k) - 1); else movers.push(p); });
    const spots = [];
    need.forEach((c, k) => { for (let i = 0; i < c; i++) spots.push(k.split(',').map(Number)); });
    const pairs = [];
    movers.forEach((m, i) => spots.forEach((s, j) => pairs.push([G.dist(W(d, m), W(d, s)), i, j])));
    pairs.sort((a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2]);
    const ui = new Set(), uj = new Set(), sol = [];
    pairs.forEach(([, i, j]) => { if (ui.has(i) || uj.has(j)) return; ui.add(i); uj.add(j); sol.push([movers[i], spots[j]]); });
    return sol;
  }

  C.coinsLogic = { W, Wall, toLat, stacksOf, rowsOf, squareInfo, testGoal, sameFigure, bestPlacement, symmetries, slideRegion, canSlide, latticeSolve, replay, finalOf, stackAllowed, touchCount, liftPlan, NB, H3 };

  /* ---------- words ---------- */

  const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const num = (n) => NUM[n] || String(n);
  function rulesText(d) {
    const r = d.rules || {}, out = [];
    if (r.moves) out.push('in ' + C.plural(r.moves, 'move'));
    if (r.slide) out.push('sliding coins along the table (no lifting over others)');
    if (r.touch2) out.push('each moved coin coming to rest against at least two others');
    return out.length ? ' ' + out.join(', ').replace(/, ([^,]*)$/, ' and $1') : '';
  }
  function goalText(d) {
    const g = d.goal;
    if (g.shape) return 'Make the figure on the card' + (g.turn === 'translate' ? ', **the way it is drawn**' : g.turn === 'mirror' ? ' (turned or turned over is fine)' : ' (turned is fine)') + rulesText(d) + '.';
    if (g.rows) return 'Make **' + num(g.rows) + ' straight rows** with **exactly ' + num(g.perRow) + ' coins** in each' + rulesText(d) + '.' + (stackAllowed(d) ? ' A stack counts, with all its coins, in every row through it.' : '');
    if (g.touch != null) return 'Every coin must touch **exactly ' + num(g.touch) + '** other' + (g.touch === 1 ? '' : 's') + rulesText(d) + '.';
    if (g.square) return 'Outline a square with **' + num(g.square) + ' coins on each side**' + rulesText(d) + '. Corner coins count for both their sides; a stack counts all its coins.';
    return '';
  }

  /* ---------- the look of a coin ---------- */

  const METALS = {
    gold: { hi: '#fff4bd', mid: '#f0bf45', lo: '#9c6a0c', f0: '#ffe79a', f1: '#d9a12a', line: '#7d5304', shine: 'rgba(255,252,225,.8)' },
    silver: { hi: '#ffffff', mid: '#d3d9e3', lo: '#788191', f0: '#f9fbfe', f1: '#b4bcca', line: '#58616f', shine: 'rgba(255,255,255,.9)' },
    copper: { hi: '#ffd6b8', mid: '#d88550', lo: '#6f3313', f0: '#f5b288', f1: '#b75f2e', line: '#56260c', shine: 'rgba(255,232,214,.75)' }
  };
  const MOTIF = {
    gold: 'M-.21 .09L-.235 -.12L-.12 -.02L0 -.19L.12 -.02L.235 -.12L.21 .09ZM-.21 .125H.21V.19H-.21Z',
    silver: 'M0 -.23L.058 -.1L.2 -.115L.116 0L.2 .115L.058 .1L0 .23L-.058 .1L-.2 .115L-.116 0L-.2 -.115L-.058 -.1Z',
    copper: 'M0 -.24C.17 -.12 .17 .1 0 .22C-.17 .1 -.17 -.12 0 -.24ZM0 .22V.27'
  };
  const CIRCLE = (() => { const out = []; for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2; out.push([Math.cos(a) * 0.5, Math.sin(a) * 0.5]); } return out; })();

  function coinDefs(pre, parent) {
    let s = '';
    for (const m in METALS) {
      const M = METALS[m];
      s += '<linearGradient id="' + pre + '-rim-' + m + '" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + M.hi + '"/><stop offset=".45" stop-color="' + M.mid + '"/><stop offset="1" stop-color="' + M.lo + '"/></linearGradient>';
      s += '<radialGradient id="' + pre + '-face-' + m + '" cx=".38" cy=".34" r=".75"><stop offset="0" stop-color="' + M.f0 + '"/><stop offset="1" stop-color="' + M.f1 + '"/></radialGradient>';
    }
    const defs = C.s('defs', null, parent);
    defs.innerHTML = s;
    return defs;
  }

  function drawCoin(g, o, pre) {
    const m = METALS[o.data.metal] ? o.data.metal : 'gold', M = METALS[m];
    const lvl = o.data.lvl || 0;
    const S = C.s;
    const t = S('g', { transform: 'translate(' + (-0.035 * lvl) + ' ' + (-0.075 * lvl) + ')' }, g);
    S('ellipse', { cx: 0.045, cy: 0.075, rx: 0.5, ry: 0.49, class: 'coin-shadow' }, t);
    S('circle', { cy: 0.06, r: 0.5, fill: M.lo }, t);
    S('circle', { r: 0.5, fill: 'url(#' + pre + '-rim-' + m + ')', stroke: M.line, 'stroke-width': 0.02 }, t);
    S('circle', { r: 0.425, fill: 'url(#' + pre + '-face-' + m + ')', stroke: M.line, 'stroke-opacity': 0.55, 'stroke-width': 0.014 }, t);
    S('circle', { r: 0.462, fill: 'none', stroke: M.line, 'stroke-opacity': 0.5, 'stroke-width': 0.026, 'stroke-dasharray': '0 0.0726', 'stroke-linecap': 'round' }, t);
    const mo = MOTIF[m];
    S('path', { d: mo, fill: M.shine, transform: 'translate(-.014 -.014)', stroke: 'none' }, t);
    S('path', { d: mo, fill: M.line, 'fill-opacity': 0.45, transform: 'translate(.012 .012)', stroke: 'none' }, t);
    S('path', { d: mo, fill: M.f1, stroke: 'none' }, t);
    if (m === 'copper') S('path', { d: 'M0 -.18V.2', stroke: M.line, 'stroke-opacity': 0.45, 'stroke-width': 0.02, fill: 'none' }, t);
    S('path', { d: 'M-.36 -.13A.38 .38 0 0 1 -.13 -.36', fill: 'none', stroke: M.shine, 'stroke-width': 0.045, 'stroke-linecap': 'round', opacity: 0.85 }, t);
    if (o.fill) S('circle', { r: 0.5, fill: o.fill, opacity: 0.5 }, t);
    if (o.data.h > 1) {
      const b = S('g', { class: 'coin-badge', transform: 'translate(.4 -.4)' }, t);
      S('circle', { r: 0.19 }, b);
      S('text', { y: 0.075, 'text-anchor': 'middle', text: '×' + o.data.h }, b);
    }
  }

  let uid = 0;

  C.engine({
    id: 'coins',
    name: 'Coins on the table',
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'xray', 'loupe'],
    about: '**Drag** a coin to move it. When you let go it settles: snug against one or two neighbours, on the lattice, or on a line through two other coins, whichever the puzzle uses. In puzzles that allow **stacking**, drop a coin on another to pile it up — a stack counts, with all its coins, in every row through it. A **move** is lifting one coin and putting it down; moving the same coin again straight away still counts as one move. Where coins must **slide**, a coin may not pass over or push others, and every slide is a move. Rows, touches and stacks are counted live as you play.',

    // Endless: a random figure on the honeycomb or the square lattice, to be turned
    // upside down or mirrored by lifting as few coins as possible
    generate(rng, level) {
      const band = [null, [1, 2], [3, 3], [4, 4], [5, 5], [6, 8]][level];
      for (let t = 0; t < 60; t++) {
        const grid = rng() < 0.6 ? 'hex' : 'square', nb = NB[grid];
        const N = rng.range(3 + level, 5 + 2 * level);
        const pts = [[0, 0]], has = new Set(['0,0']);
        for (let guard = 0; pts.length < N && guard < 500; guard++) {
          const q = rng.pick(pts), v = rng.pick(nb), r = [q[0] + v[0], q[1] + v[1]];
          if (!has.has(key(r))) { has.add(key(r)); pts.push(r); }
        }
        const mirror = rng() < 0.4;
        const T = mirror ? pts.map((q) => (grid === 'hex' ? [-q[0] - q[1], q[1]] : [-q[0], q[1]])) : pts.map((q) => [-q[0], -q[1]]);
        const d = { coins: pts, grid, goal: { shape: T, turn: 'translate' } };
        if (sameFigure(Wall(d, pts), Wall(d, T), 'translate')) continue;
        const sol = liftPlan(d);
        if (sol.length < band[0] || sol.length > band[1]) continue;
        d.rules = { moves: sol.length };
        d.sol = sol;
        const n = NUM[N] || String(N);
        return {
          title: (mirror ? 'Mirror image' : 'Upside down') + ', ' + n + ' coins',
          text: 'Make the figure on the card — this figure ' + (mirror ? 'reflected left to right' : 'turned upside down') + ', drawn the way it must lie — in ' + C.plural(sol.length, 'move') + '. Lift a coin and put it down anywhere on the ' + (grid === 'hex' ? 'honeycomb' : 'square lattice') + '.',
          par: sol.length, diff: level, data: d
        };
      }
      return null;
    },

    verify(p) {
      const d = p.data;
      if (!d || !d.coins || !d.coins.length || !d.goal) return { ok: false, err: 'coins and goal are needed' };
      const rules = d.rules || {};
      if (d.grid && d.grid !== 'hex' && d.grid !== 'square') return { ok: false, err: 'unknown grid ' + d.grid };
      if (d.goal.shape && d.goal.shape.length !== d.coins.length) return { ok: false, err: 'the figure has ' + d.goal.shape.length + ' coins, the table ' + d.coins.length };
      const start = Wall(d, d.coins), st0 = stacksOf(start);
      if (overlapPair(st0)) return { ok: false, err: 'coins overlap at the start' };
      if (!stackAllowed(d) && st0.some((s) => s.n > 1)) return { ok: false, err: 'a stack at the start but stacking is off' };
      if (testGoal(d, start).ok) return { ok: false, err: 'already solved at the start' };
      if ((rules.slide || rules.touch2) && !d.grid) return { ok: false, err: 'slide puzzles need a lattice' };
      let pts, moves = null;
      if (d.sol) {
        const r = replay(d, d.sol);
        if (!r.ok) return { ok: false, err: r.err };
        pts = r.pts; moves = r.moves;
        if (rules.moves && r.moves > rules.moves) return { ok: false, err: 'the stored solution takes ' + r.moves + ' moves, the limit is ' + rules.moves };
      } else if (d.fin) {
        if (rules.moves) return { ok: false, err: 'a move limit needs a stored move list (sol)' };
        pts = Wall(d, d.fin);
        if (pts.length !== start.length) return { ok: false, err: 'fin has ' + pts.length + ' coins' };
      } else return { ok: false, err: 'no solution stored (sol or fin)' };
      const g = testGoal(d, pts);
      if (!g.ok) return { ok: false, err: 'the stored solution misses the goal: ' + g.msg };
      if (p.par != null) {
        if (moves !== p.par) return { ok: false, err: 'par is ' + p.par + ' but the stored solution takes ' + moves };
        if (d.goal.shape && d.grid && !rules.slide && !rules.touch2) {
          const least = d.coins.length - bestPlacement(d.coins, d.goal.shape, d.grid, d.goal.turn || 'rigid').n;
          if (least !== p.par) return { ok: false, err: 'par is ' + p.par + ' but the fewest moves is ' + least };
        } else if (d.grid && p.par > 1) {
          // a quick search for anything shorter (tools/gen/coins.js searched them all)
          const path = latticeSolve(d, d.coins, { depth: p.par - 1, cap: 3000 });
          if (path) return { ok: false, err: 'par is ' + p.par + ' but ' + path.length + ' moves will do' };
        }
      }
      return { ok: true };
    },

    mount(ctx, p) {
      const d = p.data, wb = ctx.wb, g = d.goal;
      const rules = d.rules || {};
      const grid = d.grid || null;
      const mode = d.snap || (grid ? 'lattice' : 'contact');
      const stackOK = stackAllowed(d);
      const pre = 'coin' + (++uid);
      const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
      coinDefs(pre, bg);
      ctx.setGoal(goalText(d));

      const start = Wall(d, d.coins);
      const metals = Array.isArray(d.metal) ? d.metal : start.map(() => d.metal || 'gold');
      wb.type('coin', { poly: () => CIRCLE, draw: (el, o) => drawCoin(el, o, pre) });
      start.forEach((pt, i) => {
        const m = metals[i] || 'gold';
        wb.add({ id: 'c' + i, type: 'coin', kind: 'coin', name: cap(m) + ' coin ' + (i + 1), x: pt[0], y: pt[1], snap: true, data: { metal: m, lvl: 0 } });
      });
      const coins = () => wb.all().filter((o) => o.type === 'coin');
      const coinPts = () => coins().map((o) => [o.x, o.y]);

      /* the table: lattice dots, the card with the figure to make */
      const fin = finalOf(d) || start;
      const work = G.bbox([start.concat(fin)]);
      const narrow = wb.size().w < 600;
      const area = { x0: work.x0 - 1.8, y0: work.y0 - 1.8, x1: work.x1 + 1.8, y1: work.y1 + 1.8 };
      let bounds = Object.assign({}, area);
      if (g.shape) {
        const T = Wall(d, g.shape), tb = G.bbox([T]);
        const k = Math.min(0.55, 3.6 / Math.max(tb.w + 1, tb.h + 1));
        const rt = [g.turn === 'translate' ? 'this way up' : null, rules.moves ? C.plural(rules.moves, 'move') : null, rules.slide ? 'slide' : null, rules.touch2 ? 'touch two' : null].filter(Boolean).join(' · ');
        const cw = Math.max(3.2, (tb.w + 1) * k + 0.9, rt.length * 0.13 + 0.6), ch = (tb.h + 1) * k + 1.55;
        const cx = narrow ? (area.x0 + area.x1) / 2 - cw / 2 : area.x1 + 0.3;
        const cy = narrow ? area.y1 + 0.3 : (area.y0 + area.y1) / 2 - ch / 2;
        const card = ctx.s('g', { class: 'coin-card' }, bg);
        ctx.s('rect', { x: cx, y: cy, width: cw, height: ch, rx: 0.22, class: 'coin-cardbg' }, card);
        ctx.s('text', { x: cx + cw / 2, y: cy + 0.48, 'text-anchor': 'middle', class: 'coin-cardt', text: 'Make this' }, card);
        const ox = cx + cw / 2 - (tb.cx) * k, oy = cy + 0.75 + 0.5 * k - tb.y0 * k;
        T.forEach((q) => ctx.s('circle', { cx: ox + q[0] * k, cy: oy + q[1] * k, r: 0.46 * k, class: 'coin-ghost' }, card));
        if (rt) ctx.s('text', { x: cx + cw / 2, y: cy + ch - 0.22, 'text-anchor': 'middle', class: 'coin-cardr', text: rt }, card);
        bounds = { x0: Math.min(area.x0, cx - 0.3), y0: Math.min(area.y0, cy - 0.3), x1: Math.max(area.x1, cx + cw + 0.3), y1: Math.max(area.y1, cy + ch + 0.3) };
      }
      if (grid) {
        const dots = ctx.s('g', { class: 'coin-dots' }, bg);
        const a = toLat(d, [area.x0, area.y0], true), b = toLat(d, [area.x1, area.y1], true);
        for (let r = a[1] - 1; r <= b[1] + 1; r++) {
          for (let q = a[0] - Math.ceil((b[1] - a[1]) / 2) - 2; q <= b[0] + 2; q++) {
            const w = W(d, [q, r]);
            if (w[0] < area.x0 || w[0] > area.x1 || w[1] < area.y0 || w[1] > area.y1) continue;
            ctx.s('circle', { cx: w[0], cy: w[1], r: 0.045 }, dots);
          }
        }
      }
      wb.setBounds(bounds, 0.06);

      const rowsG = ctx.s('g', { class: 'coin-rows' }, board);
      const guideG = ctx.s('g', { class: 'coin-guide' }, board);
      const markG = ctx.s('g', { class: 'coin-marks' }, top);
      const hintG = ctx.s('g', { class: 'coin-hint' }, top);

      /* state */
      let lifts = 0, last = null, busy = false, dragged = false, hintT = null, anim = null, timer = null;
      let pos = new Map();
      const remember = () => { pos = new Map(coins().map((o) => [o.id, [o.x, o.y]])); };
      remember();

      function levels() {
        const cs = coins();
        const st = stacksOf(cs.map((o) => [o.x, o.y]));
        st.forEach((s) => s.idx.forEach((ix, k) => {
          const o = cs[ix], lvl = k, h = k === s.idx.length - 1 && s.n > 1 ? s.n : 0;
          if ((o.data.lvl || 0) !== lvl || (o.data.h || 0) !== h) { o.data.lvl = lvl; o.data.h = h; wb.renderObj(o); }
        }));
      }
      function raise(objs) {
        const ids = new Set(objs.map((o) => o.id));
        wb.order = wb.order.filter((id) => !ids.has(id)).concat(wb.order.filter((id) => ids.has(id)));
        wb.restack();
      }

      function refresh() {
        levels();
        const r = testGoal(d, coinPts());
        rowsG.innerHTML = '';
        markG.innerHTML = '';
        if (g.rows) {
          (r.all || []).forEach((row) => {
            const good = row.count === g.perRow;
            const u = G.norm(G.sub(row.b, row.a)), ext = 0.62;
            const a = G.sub(row.a, G.mul(u, ext)), b = G.add(row.b, G.mul(u, ext));
            ctx.s('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'coin-row' + (good ? ' good' : '') }, rowsG);
          });
          ctx.stat('Rows of ' + g.perRow, (r.rows ? r.rows.length : 0) + ' / ' + g.rows);
        }
        if (g.touch != null && r.deg) {
          r.st.forEach((s, i) => {
            const v = r.deg[i];
            const b = ctx.s('g', { class: 'coin-deg' + (v === g.touch ? ' good' : v > g.touch ? ' over' : ''), transform: 'translate(' + (s.p[0] + 0.36) + ' ' + (s.p[1] - 0.36) + ')' }, markG);
            ctx.s('circle', { r: 0.17 }, b);
            ctx.s('text', { y: 0.068, 'text-anchor': 'middle', text: String(v) }, b);
          });
          const st = r.st;
          for (let i = 0; i < st.length; i++) for (let j = i + 1; j < st.length; j++) {
            if (Math.abs(G.dist(st[i].p, st[j].p) - 1) < TOUCH) { const m = G.mid(st[i].p, st[j].p); ctx.s('circle', { cx: m[0], cy: m[1], r: 0.06, class: 'coin-contact' }, markG); }
          }
          ctx.stat('Touching right', r.deg.filter((v) => v === g.touch).length + ' / ' + r.st.length);
        }
        if (g.square && r.sq && !r.sq.inside) {
          const h = r.sq.hull;
          h.forEach((pt, i) => {
            const q = h[(i + 1) % 4];
            const good = r.sq.counts[i] === g.square;
            const u = G.norm(G.sub(q, pt));
            const a = G.sub(pt, G.mul(u, 0.6)), b = G.add(q, G.mul(u, 0.6));
            ctx.s('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'coin-row' + (good ? ' good' : '') }, rowsG);
            const c = G.centroid(h), m = G.mid(pt, q), out = G.norm(G.sub(m, c)), lb = G.add(m, G.mul(out, 0.9));
            ctx.s('text', { x: lb[0], y: lb[1] + 0.12, 'text-anchor': 'middle', class: 'coin-rowlab' + (good ? '' : ' off'), text: String(r.sq.counts[i]) }, markG);
          });
        }
        return r;
      }

      /* where a coin settles: while dragging (strict false) it is only pulled when
       * near a good spot; when dropped (strict true) it always lands somewhere legal */
      function snapPoint(P, others, strict) {
        const st = stacksOf(others);
        const free = (q) => st.every((s) => G.dist(s.p, q) >= 1 - 1e-3);
        if (stackOK) {
          let best = null, bd = 0.38;
          st.forEach((s) => { const dd = G.dist(P, s.p); if (dd < bd) { bd = dd; best = s.p; } });
          if (best) return best.slice();
        }
        if (mode === 'lattice' && grid) {
          const c = toLat(d, P, true), list = [];
          for (let a = -2; a <= 2; a++) for (let b = -2; b <= 2; b++) {
            const w = W(d, [c[0] + a, c[1] + b]);
            if (free(w)) list.push({ w, dd: G.dist(P, w), t: touchCount(w, st.map((s) => s.p)) });
          }
          if (rules.touch2) {
            const snug = list.filter((x) => x.t >= 2 && x.dd < (strict ? 0.8 : 0.4)).sort((x, y) => x.dd - y.dd);
            if (snug.length) return snug[0].w;
          }
          list.sort((x, y) => x.dd - y.dd);
          if (!strict) return list.length && list[0].dd < 0.3 ? list[0].w : P;
          return list.length ? list[0].w : P;
        }
        const cands = [];
        const tangentPull = mode === 'contact' ? 1 : 0.55;
        st.forEach((s) => {
          const dd = G.dist(P, s.p);
          if (dd > 1e-6 && dd < 1.7) cands.push([G.add(s.p, G.mul(G.sub(P, s.p), 1 / dd)), 0.3 * tangentPull, 1]);
        });
        for (let i = 0; i < st.length; i++) for (let j = i + 1; j < st.length; j++) {
          const a = st[i].p, b = st[j].p, D = G.dist(a, b);
          if (D < 1e-6 || D > 2 + 1e-6) continue;
          const m = G.mid(a, b), h = Math.sqrt(Math.max(0, 1 - D * D / 4)), u = G.perp(G.norm(G.sub(b, a)));
          cands.push([G.add(m, G.mul(u, h)), 0.45 * tangentPull, 2], [G.sub(m, G.mul(u, h)), 0.45 * tangentPull, 2]);
        }
        if (mode === 'rows') {
          const lines = [];
          for (let i = 0; i < st.length; i++) for (let j = i + 1; j < st.length; j++) {
            const a = st[i].p, b = st[j].p, u = G.norm(G.sub(b, a));
            const q = G.add(a, G.mul(u, G.dot(G.sub(P, a), u)));
            const dd = G.dist(P, q);
            if (dd < 0.4) { lines.push([a, b]); if (dd < 0.22) cands.push([q, 0.22, 1.5]); }
          }
          for (let i = 0; i < lines.length; i++) for (let j = i + 1; j < lines.length; j++) {
            const q = G.lineCross(lines[i][0], lines[i][1], lines[j][0], lines[j][1]);
            if (q && G.dist(P, q) < 0.36) cands.push([q, 0.36, 3]);
          }
        }
        const ok = cands.filter((c) => free(c[0]));
        let best = null, score = Infinity;
        ok.forEach((c) => { const dd = G.dist(P, c[0]); if (dd < c[1]) { const sc = dd - 0.12 * c[2]; if (sc < score) { score = sc; best = c[0]; } } });
        if (best) return best;
        if (free(P) || !strict) return P;
        score = Infinity;
        ok.forEach((c) => { const dd = G.dist(P, c[0]); if (dd < score) { score = dd; best = c[0]; } });
        if (best) return best;
        // pushed straight out of the coin it lands on
        let near = null, nd = Infinity;
        st.forEach((s) => { const dd = G.dist(P, s.p); if (dd < nd) { nd = dd; near = s.p; } });
        return near ? G.add(near, G.mul(G.norm(nd > 1e-6 ? G.sub(P, near) : [1, 0]), 1)) : P;
      }
      function othersOf(objs) {
        const ids = new Set(objs.map((o) => o.id));
        return coins().filter((o) => !ids.has(o.id)).map((o) => [o.x, o.y]);
      }

      wb.handlers.pick = () => { dragged = true; clearHint(); };
      wb.on('tap', () => { dragged = false; });
      let raised = false;
      // a short glide of the drawing only (the coin's real place is already set)
      function tween(o, from) {
        if (!o.el) return;
        const to = [o.x, o.y];
        if (G.dist(from, to) < 1e-3) return;
        const t0 = performance.now(), ms = C.anim(140);
        const step = (now) => {
          if (!o.el || o.x !== to[0] || o.y !== to[1]) return;
          const k = Math.min(1, (now - t0) / ms), e = 1 - (1 - k) * (1 - k);
          o.el.setAttribute('transform', G.svgTransform({ x: from[0] + (to[0] - from[0]) * e, y: from[1] + (to[1] - from[1]) * e }));
          if (k < 1) requestAnimationFrame(step); else wb.place(o);
        };
        requestAnimationFrame(step);
      }
      wb.handlers.dragging = (objs) => {
        if (!raised) {
          raised = true;
          raise(objs);
          objs.forEach((o) => { if (o.data.lvl || o.data.h) { o.data.lvl = 0; o.data.h = 0; wb.renderObj(o); o.el.classList.add('drag'); } });
        }
        guideG.innerHTML = '';
        if (mode !== 'rows' || objs.length !== 1) return;
        const P = [objs[0].x, objs[0].y];
        const st = stacksOf(othersOf(objs));
        for (let i = 0; i < st.length; i++) for (let j = i + 1; j < st.length; j++) {
          const a = st[i].p, b = st[j].p, u = G.norm(G.sub(b, a));
          if (Math.abs(G.dot(G.sub(P, a), [-u[1], u[0]])) > ROWTOL) continue;
          const ts = [0, G.dot(G.sub(b, a), u), G.dot(G.sub(P, a), u)];
          const lo = Math.min.apply(null, ts) - 0.7, hi = Math.max.apply(null, ts) + 0.7;
          const p1 = G.add(a, G.mul(u, lo)), p2 = G.add(a, G.mul(u, hi));
          ctx.s('line', { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], class: 'coin-guideline' }, guideG);
        }
      };
      wb.handlers.snap = (o, at, objs) => {
        const q = snapPoint([at.x, at.y], othersOf(objs), false);
        return { x: q[0], y: q[1] };
      };
      wb.handlers.settle = (objs, why) => {
        guideG.innerHTML = '';
        raised = false;
        dragged = false;
        if (why !== 'move' || busy) return;
        let moved = objs.filter((o) => o.type === 'coin' && pos.has(o.id) && G.dist(pos.get(o.id), [o.x, o.y]) > 1e-6);
        if (!moved.length) { levels(); return; }
        const drop = new Map();
        moved.forEach((o) => { drop.set(o.id, [o.x, o.y]); const q = snapPoint([o.x, o.y], othersOf([o]), true); o.x = q[0]; o.y = q[1]; });
        moved.forEach((o) => tween(o, drop.get(o.id)));
        moved = moved.filter((o) => G.dist(pos.get(o.id), [o.x, o.y]) > 1e-6);
        if (!moved.length) { levels(); return; }
        let bad = null;
        if (moved.length > 1 && (rules.slide || rules.touch2)) bad = 'Move one coin at a time in this puzzle.';
        const allPts = coins().map((o) => [o.x, o.y]);
        const st = stacksOf(allPts);
        if (!bad && overlapPair(st)) bad = 'Coins may not overlap.';
        if (!bad && !stackOK && st.some((s) => s.n > 1)) bad = 'No stacking in this puzzle: every coin lies flat on the table.';
        if (!bad && rules.slide) {
          const o = moved[0], others = othersOf([o]);
          if (!canSlide(d, pos.get(o.id), [o.x, o.y], others)) bad = 'That coin would have to jump over its neighbours — here coins only slide along the table.';
        }
        if (!bad && rules.touch2) {
          const o = moved[0];
          if (touchCount([o.x, o.y], othersOf([o])) < 2) bad = 'A moved coin must come to rest touching at least two others.';
        }
        if (bad) {
          moved.forEach((o) => { const q = pos.get(o.id); o.x = q[0]; o.y = q[1]; tween(o, drop.get(o.id)); });
          ctx.toast(bad);
          ctx.sfx('wrong');
          levels();
          return;
        }
        if (rules.slide) lifts += moved.length;
        else moved.forEach((o) => { if (o.id !== last || moved.length > 1) lifts++; });
        last = moved.length === 1 ? moved[0].id : null;
        raise(moved);
        remember();
        refresh();
        ctx.move(lifts);
        if (stackOK && moved.length === 1 && stacksOf(allPts).some((s) => s.n > 1 && G.dist(s.p, [moved[0].x, moved[0].y]) < SAME)) ctx.sfx('tap');
        if (rules.moves && lifts > rules.moves) ctx.say('That makes ' + C.plural(lifts, 'move') + ' — the puzzle allows ' + rules.moves + '. Undo, or Reset to start again.', 'warn');
        else ctx.say('');
      };
      const onRestore = () => { remember(); refresh(); };
      wb.on('restore', onRestore);

      /* hints */
      function clearHint() {
        clearTimeout(hintT);
        hintG.innerHTML = '';
        coins().forEach((o) => o.el && o.el.classList.remove('coin-hinted'));
      }
      function showMove(o, to, alsoGhost) {
        clearHint();
        if (alsoGhost) alsoGhost.forEach((q) => ctx.s('circle', { cx: q[0], cy: q[1], r: 0.47, class: 'coin-ghostfig' }, hintG));
        if (o) {
          ctx.s('circle', { cx: o.x, cy: o.y, r: 0.6, class: 'coin-hintring' }, hintG);
          if (o.el) o.el.classList.add('coin-hinted');
        }
        if (to) {
          ctx.s('circle', { cx: to[0], cy: to[1], r: 0.5, class: 'coin-hintspot' }, hintG);
          if (o) {
            const a = [o.x, o.y], v = G.sub(to, a), L = G.len(v);
            if (L > 1.1) {
              const u = G.mul(v, 1 / L), p1 = G.add(a, G.mul(u, 0.62)), p2 = G.sub(to, G.mul(u, 0.62));
              ctx.s('path', { d: 'M' + p1[0] + ' ' + p1[1] + 'L' + p2[0] + ' ' + p2[1], class: 'coin-hintarrow' }, hintG);
            }
          }
        }
        hintT = setTimeout(clearHint, 6000);
      }
      const topAt = (q) => { const cs = coins(); for (let i = cs.length - 1; i >= 0; i--) if (G.dist([cs[i].x, cs[i].y], q) < SAME) return cs[i]; return null; };

      // which coins stay and where the others should go, for a target (world points)
      function planFor(target) {
        const cs = coins();
        const need = target.map((q) => ({ q, used: false }));
        const stay = new Set();
        cs.forEach((o) => {
          const t = need.find((x) => !x.used && G.dist(x.q, [o.x, o.y]) < FIG);
          if (t) { t.used = true; stay.add(o.id); }
        });
        const movers = cs.filter((o) => !stay.has(o.id));
        const spots = need.filter((x) => !x.used).map((x) => x.q);
        let best = null, bd = Infinity;
        movers.forEach((o) => {
          if (topAt([o.x, o.y]) !== o) return;
          spots.forEach((q) => {
            if (!free(q, o)) return;
            const dd = G.dist([o.x, o.y], q);
            if (dd < bd) { bd = dd; best = { o, to: q }; }
          });
        });
        return { movers, spots, best, n: movers.length };
      }
      function free(q, o) {
        return coins().every((c) => {
          if (c === o) return true;
          const dd = G.dist([c.x, c.y], q);
          return dd < SAME ? stackOK : dd >= 1 - 1e-3;
        });
      }
      // the stored solution's figure, placed to keep as many coins as possible where they are
      function targetNearCoins() {
        const cur = coinPts();
        if (g.shape && grid) {
          const S = cur.map((q) => toLat(d, q, true));
          return Wall(d, bestPlacement(S, g.shape, grid, g.turn || 'rigid').placed);
        }
        const F = finalOf(d);
        let best = null, bn = -1;
        F.forEach((f) => cur.forEach((c) => {
          const dx = c[0] - f[0], dy = c[1] - f[1];
          const moved = F.map((q) => [q[0] + dx, q[1] + dy]);
          const used = new Array(cur.length).fill(false);
          let n = 0;
          moved.forEach((q) => { const k = cur.findIndex((x, i) => !used[i] && G.dist(x, q) < FIG); if (k >= 0) { used[k] = true; n++; } });
          if (n > bn) { bn = n; best = moved; }
        }));
        if (bn <= 1) {
          const cf = centroidOf(F), cc = centroidOf(cur);
          best = F.map((q) => [q[0] - cf[0] + cc[0], q[1] - cf[1] + cc[1]]);
        }
        return best;
      }

      function check() {
        const r = testGoal(d, coinPts());
        if (r.ok && rules.moves && lifts > rules.moves) return { solved: false, msg: 'The figure is right, but it took ' + C.plural(lifts, 'move') + ' — the puzzle asks for ' + rules.moves + '.' };
        if (r.ok) return { solved: true, msg: solvedMsg() };
        return { solved: false, msg: r.msg };
      }
      function solvedMsg() {
        if (g.rows) return num(g.rows).replace(/^./, (c) => c.toUpperCase()) + ' rows of ' + num(g.perRow) + '!';
        if (g.touch != null) return 'Every coin touches exactly ' + num(g.touch) + '.';
        if (g.square) return 'A square with ' + num(g.square) + ' on every side.';
        return rules.moves ? 'Done in ' + C.plural(lifts, 'move') + '.' : 'That is the figure.';
      }

      /* the solution, animated */
      // glide coins to new places; frames when the page is shown, and a timer makes sure it ends
      function glide(list, ms, done) {
        const from = list.map((m) => [m.o.x, m.o.y]);
        const t0 = performance.now();
        let over = false;
        const end = () => {
          if (over) return;
          over = true;
          if (anim) cancelAnimationFrame(anim);
          anim = null;
          clearTimeout(timer);
          list.forEach((m) => wb.update(m.o, { x: m.to[0], y: m.to[1] }));
          if (done) done();
        };
        const step = (now) => {
          if (over) return;
          const k = Math.min(1, (now - t0) / ms), e = 0.5 - Math.cos(k * Math.PI) / 2;
          if (k >= 1) { end(); return; }
          list.forEach((m, i) => wb.update(m.o, { x: from[i][0] + (m.to[0] - from[i][0]) * e, y: from[i][1] + (m.to[1] - from[i][1]) * e }));
          anim = requestAnimationFrame(step);
        };
        anim = requestAnimationFrame(step);
        timer = setTimeout(end, ms + 150);
      }
      function assign(targets) {
        const cs = coins(), pairs = [];
        cs.forEach((o, i) => targets.forEach((q, j) => pairs.push([G.dist([o.x, o.y], q), i, j])));
        pairs.sort((a, b) => a[0] - b[0]);
        const ui = new Set(), uj = new Set(), out = [];
        pairs.forEach(([, i, j]) => { if (ui.has(i) || uj.has(j)) return; ui.add(i); uj.add(j); out.push({ o: cs[i], to: targets[j], j }); });
        return out;
      }
      function finish(n) {
        busy = false;
        lifts = n; last = null;
        coins().forEach((o) => { if (o.el) o.el.classList.remove('drag'); });
        remember();
        refresh();
        ctx.move(lifts);
        ctx.changed('solve');
      }
      function solve() {
        if (busy) return;
        busy = true;
        clearHint();
        const ms = C.anim(520);
        if (d.fin || !d.sol) {
          const F = finalOf(d);
          const list = assign(F);
          const n = list.filter((m) => G.dist([m.o.x, m.o.y], m.to) > 1e-6).length;
          raise(list.sort((a, b) => a.j - b.j).map((m) => m.o));
          glide(list, C.anim(900), () => finish(lifts + n));
          return;
        }
        const sol = d.sol, total = replay(d, sol).moves;
        const back = assign(start);
        const atStart = back.every((m) => G.dist([m.o.x, m.o.y], m.to) < 1e-6);
        const play = (k) => {
          if (k >= sol.length) { finish(total); return; }
          const A = W(d, sol[k][0]), B = W(d, sol[k][1]);
          const o = topAt(A);
          if (!o) { finish(total); return; }
          raise([o]);
          if (o.data.lvl) { o.data.lvl = 0; o.data.h = 0; wb.renderObj(o); }
          ctx.sfx('tap');
          timer = setTimeout(() => glide([{ o, to: B }], ms, () => { levels(); timer = setTimeout(() => play(k + 1), C.anim(160)); }), C.anim(120));
        };
        if (atStart) { play(0); return; }
        raise(back.sort((a, b) => a.j - b.j).map((m) => m.o));
        glide(back, C.anim(700), () => { levels(); ctx.say('Back to the start; now the solution…', 'info'); play(0); });
      }

      refresh();

      return {
        check,
        hint() {
          const r = testGoal(d, coinPts());
          if (r.ok && rules.moves && lifts > rules.moves) return 'The figure is right but it took too many moves. Press Reset and look for a way that leaves more coins where they already are.';
          if (r.ok) return 'It is already done — press Check.';
          const left = rules.moves ? rules.moves - lifts : Infinity;
          if (rules.slide || rules.touch2) {
            const S = coinPts().map((q) => toLat(d, q));
            if (S.every(Boolean) && d.sol) {
              // still on the stored solution's path?
              const cur = S.map(key).sort().join(';');
              let st = d.coins.map(key);
              for (let k = 0; k < d.sol.length; k++) {
                if (st.slice().sort().join(';') === cur) {
                  const m = d.sol[k];
                  return { text: 'Slide the glowing coin to the ringed spot. From here it takes ' + C.plural(d.sol.length - k, 'more move') + '.', show: () => showMove(topAt(W(d, m[0])), W(d, m[1])) };
                }
                st.splice(st.indexOf(key(d.sol[k][0])), 1);
                st.push(key(d.sol[k][1]));
              }
            }
            if (S.every(Boolean)) {
              const path = latticeSolve(d, S, { depth: Math.min(5, left === Infinity ? 5 : Math.max(0, left)), cap: 2500 });
              if (path && path.length) {
                const o = topAt(W(d, path[0][0]));
                return { text: 'Slide the glowing coin to the ringed spot. From here it takes ' + C.plural(path.length, 'more move') + '.', show: () => showMove(o, W(d, path[0][1])) };
              }
            }
            const first = d.sol && d.sol[0];
            return { text: 'I cannot see a way from here within the moves left. Press Reset: from the start, the first slide goes from the glowing coin to the ringed spot.', show: () => { if (first && lifts === 0) showMove(topAt(W(d, first[0])), W(d, first[1])); } };
          }
          const target = targetNearCoins();
          const plan = planFor(target);
          if (plan.n > left) return 'From here the figure still needs ' + C.plural(plan.n, 'more move') + ' but only ' + left + ' remain' + (left === 1 ? 's' : '') + '. Undo a step or two, or Reset — and look for a placement of the figure that keeps more coins where they are.';
          if (!plan.best) return { text: 'One arrangement that works is drawn faintly on the table.', show: () => showMove(null, null, target) };
          const lead = g.shape ? 'Leave the other coins where they are. ' : 'The faint circles show one arrangement that works. ';
          return { text: lead + 'Move the glowing coin to the ringed spot' + (plan.n > 1 ? ' (' + C.plural(plan.n, 'coin') + ' still to place)' : '') + '.', show: () => showMove(plan.best.o, plan.best.to, g.shape ? null : target) };
        },
        solve,
        getState() { return { lifts, last }; },
        setState(s) {
          if (anim) { cancelAnimationFrame(anim); anim = null; }
          clearTimeout(timer);
          busy = false;
          lifts = (s && s.lifts) || 0;
          last = s ? s.last : null;
          clearHint();
          remember();
          refresh();
        },
        destroy() {
          if (anim) cancelAnimationFrame(anim);
          clearTimeout(timer);
          clearTimeout(hintT);
          wb.off('restore', onRestore);
        }
      };
    },

    thumb(p) {
      const d = p.data, g = d.goal;
      const A = Wall(d, d.coins);
      const T = g.shape ? Wall(d, g.shape) : null;
      const ba = G.bbox([A]);
      let s = '', x1 = ba.x1 + 0.6;
      const coin = (q, lvl, fill) => '<circle cx="' + r3(q[0] - 0.03 * lvl) + '" cy="' + r3(q[1] - 0.07 * lvl) + '" r=".46" fill="' + fill + '" stroke="#8a5d06" stroke-width=".06"/>';
      stacksOf(A).forEach((st) => { for (let k = 0; k < st.n; k++) s += coin(st.p, k, '#f0bf45'); });
      if (T) {
        const bt = G.bbox([T]);
        const dx = ba.x1 + 2.2 - bt.x0, dy = ba.cy - bt.cy;
        s += '<path d="M' + r3(ba.x1 + 0.75) + ' ' + r3(ba.cy) + 'h.8m-.25 -.25l.25 .25l-.25 .25" fill="none" stroke="var(--muted)" stroke-width=".1" stroke-linecap="round" stroke-linejoin="round"/>';
        T.forEach((q) => { s += '<circle cx="' + r3(q[0] + dx) + '" cy="' + r3(q[1] + dy) + '" r=".42" fill="none" stroke="var(--ink-2)" stroke-width=".07" stroke-dasharray=".16 .1"/>'; });
        x1 = bt.x1 + dx + 0.6;
      }
      const y0 = Math.min(ba.y0, T ? ba.cy - G.bbox([T]).h / 2 : ba.y0) - 0.8, y1 = Math.max(ba.y1, T ? ba.cy + G.bbox([T]).h / 2 : ba.y1) + 0.8;
      const x0 = ba.x0 - 0.8;
      return '<svg viewBox="' + r3(x0) + ' ' + r3(y0) + ' ' + r3(x1 - x0 + 0.2) + ' ' + r3(y1 - y0) + '" preserveAspectRatio="xMidYMid meet">' + s + '</svg>';
    }
  });

  function centroidOf(pts) { let x = 0, y = 0; pts.forEach((p) => { x += p[0]; y += p[1]; }); return [x / pts.length, y / pts.length]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function r3(v) { return Math.round(v * 1000) / 1000; }

  C.css('coins', `
    .coin-shadow { fill: rgba(0, 0, 0, .32); }
    [data-theme="light"] .coin-shadow { fill: rgba(60, 40, 10, .22); }
    .coin-badge circle { fill: var(--panel); stroke: var(--gold); stroke-width: .035; }
    .coin-badge text { font: 800 .2px "Segoe UI", system-ui, sans-serif; fill: var(--text); }
    .coin-dots circle { fill: var(--grid-2); }
    .coin-cardbg { fill: var(--panel); stroke: var(--line); stroke-width: .04; opacity: .92; }
    .coin-cardt { font: 700 .3px "Segoe UI", system-ui, sans-serif; fill: var(--muted); letter-spacing: .01px; }
    .coin-cardr { font: 600 .24px "Segoe UI", system-ui, sans-serif; fill: var(--gold); }
    .coin-ghost { fill: rgba(240, 191, 69, .5); stroke: #b8860b; stroke-width: .03; }
    .coin-row { stroke: var(--grid-2); stroke-width: .05; stroke-linecap: round; stroke-dasharray: .12 .12; }
    .coin-row.good { stroke: var(--gold); stroke-width: .08; stroke-dasharray: none; opacity: .85; }
    .coin-rowlab { font: 800 .3px "Segoe UI", system-ui, sans-serif; fill: var(--gold); }
    .coin-rowlab.off { fill: var(--muted); }
    .coin-guideline { stroke: var(--teal); stroke-width: .045; stroke-dasharray: .1 .08; opacity: .9; }
    .coin-deg circle { fill: var(--panel-2); stroke: var(--muted); stroke-width: .03; }
    .coin-deg text { font: 800 .2px "Segoe UI", system-ui, sans-serif; fill: var(--muted); }
    .coin-deg.good circle { stroke: var(--green); fill: var(--panel); }
    .coin-deg.good text { fill: var(--green); }
    .coin-deg.over circle { stroke: var(--red); }
    .coin-deg.over text { fill: var(--red); }
    .coin-contact { fill: var(--teal); }
    .coin-hintring { fill: none; stroke: var(--gold); stroke-width: .07; animation: coinpulse 1s ease-in-out infinite; }
    .coin-hintspot { fill: rgba(255, 209, 102, .16); stroke: var(--gold); stroke-width: .06; stroke-dasharray: .14 .1; animation: coinpulse 1s ease-in-out infinite; }
    .coin-hintarrow { fill: none; stroke: var(--gold); stroke-width: .06; stroke-dasharray: .12 .12; opacity: .8; }
    .coin-ghostfig { fill: none; stroke: var(--teal); stroke-width: .045; stroke-dasharray: .12 .09; opacity: .8; }
    @keyframes coinpulse { 50% { opacity: .4; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
