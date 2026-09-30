/* The Puzzle Cabinet · js/lib/pencil3-logic.js
 *
 * The reasoning behind engines/pencil3.js, node-safe so that verify(), the
 * generator (tools/gen/pencil3.js), the Endless drawers and the live hints all
 * use the same code:
 *
 *   numpath   a chain of numbers 1…n through every cell, each next to the one
 *             before (king-wise or side by side)
 *   norinori  two shaded cells per region, every shaded cell in a domino
 *   lits      one tetromino per region, all connected, no 2×2, no twins touching
 *   heyawake  room counts, shaded cells apart, white cells connected, no white
 *             line through three rooms
 *   yajilin   arrow counts, shaded cells apart, one loop through the rest
 *
 * Every kind has the same parts:
 *   prep      the puzzle as arrays
 *   prop      rule propagation (the plain rules); returns null or the contradiction met
 *   count     solutions by propagation and branching (verify: exactly one)
 *   solveTo   how far logic of a given level gets from the start (grading, making)
 *   step      the next deduction from a player's position, explained in words:
 *             { level, set: [[cell, value]], focus: [cells], text } (level 1 plain
 *             rules … 4 "suppose…", 5 a long chain)
 *   make      a random puzzle whose one solution logic of a chosen level can reach
 * Cell values in the shading solvers: -1 unknown, 0 white, 1 shaded.
 * All deterministic for a given rng.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const L = {};
  C.pencil3Logic = L;

  /* ---------- words and small helpers ---------- */

  const ORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const word = (n) => ORD[n] || String(n);
  const Word = (n) => { const s = word(n); return s.charAt(0).toUpperCase() + s.slice(1); };
  const cellName = (i, w) => 'row ' + (Math.floor(i / w) + 1) + ', column ' + (i % w + 1);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const now = () => (root.performance && root.performance.now ? root.performance.now() : Date.now());
  L.word = word;
  L.cellName = cellName;

  // neighbour lists (4: side by side, 8: king-wise), only between cells that are `on`
  function nbList(w, h, on, adj) {
    const N = w * h, nb = [];
    for (let i = 0; i < N; i++) {
      const a = [];
      nb.push(a);
      if (on && !on[i]) continue;
      const r = Math.floor(i / w), c = i % w;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          if ((!dr && !dc) || (adj === 4 && dr && dc)) continue;
          const rr = r + dr, cc = c + dc;
          if (rr < 0 || rr >= h || cc < 0 || cc >= w) continue;
          const j = rr * w + cc;
          if (on && !on[j]) continue;
          a.push(j);
        }
      }
    }
    return nb;
  }
  L.nbList = nbList;

  // rows of characters from a flat array
  function toRows(arr, w, f) {
    const rows = [];
    for (let r = 0; r < arr.length / w; r++) { let s = ''; for (let c = 0; c < w; c++) s += f(arr[r * w + c], r * w + c); rows.push(s); }
    return rows;
  }
  L.toRows = toRows;

  // region letters: a-z, then A-Z
  const REG = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  L.regLetter = (k) => REG.charAt(k);
  function regionsOf(rows) {
    const h = rows.length, w = rows[0].length, reg = new Int32Array(w * h);
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) reg[r * w + c] = REG.indexOf(rows[r][c]);
    return reg;
  }
  L.regionsOf = regionsOf;

  // is a set of cells (array) connected by sides?
  function connectedSet(cells, w) {
    if (!cells.length) return true;
    const set = new Set(cells), seen = new Set([cells[0]]), stack = [cells[0]];
    while (stack.length) {
      const i = stack.pop(), r = Math.floor(i / w), c = i % w;
      const nbs = [];
      if (r > 0) nbs.push(i - w);
      nbs.push(i + w);
      if (c > 0) nbs.push(i - 1);
      if (c < w - 1) nbs.push(i + 1);
      for (const j of nbs) if (set.has(j) && !seen.has(j)) { seen.add(j); stack.push(j); }
    }
    return seen.size === cells.length;
  }
  L.connectedSet = connectedSet;

  /* =====================================================================
   *  NUMBER PATH
   *  data: { kind: 'numpath', w, h, adj: 8 | 4, given: [..w*h], sol: [..w*h] }
   *  sol[i] = the number in cell i (0 = no cell there: a hole in the shape);
   *  given[i] = a printed number (0 = empty).
   * ===================================================================== */

  function npBase(w, h, on, adj) {
    const N = w * h, cells = [];
    for (let i = 0; i < N; i++) if (on[i]) cells.push(i);
    const nb = nbList(w, h, on, adj);
    const adjM = new Uint8Array(N * N);
    for (const i of cells) for (const j of nb[i]) adjM[i * N + j] = 1;
    const col = new Uint8Array(N);
    for (let i = 0; i < N; i++) col[i] = (Math.floor(i / w) + i % w) & 1;
    return { w, h, N, n: cells.length, adj, on, cells, nb, adjM, col };
  }
  L.npBase = npBase;

  L.npPrep = function (d) {
    const w = d.w, h = d.h, N = w * h, on = new Uint8Array(N);
    for (let i = 0; i < N; i++) if (d.sol[i] > 0) on[i] = 1;
    const P = npBase(w, h, on, d.adj === 4 ? 4 : 8);
    P.sol = Int16Array.from(d.sol);
    P.given = new Int16Array(N);
    if (d.given) for (let i = 0; i < N; i++) P.given[i] = d.given[i] > 0 ? d.given[i] : 0;
    return P;
  };

  function npPosOf(P, val) {
    const pos = new Int32Array(P.n + 2).fill(-1);
    for (const i of P.cells) {
      const k = val[i];
      if (k > 0) { if (k > P.n || pos[k] >= 0) return null; pos[k] = i; }
    }
    return pos;
  }
  L.npPosOf = npPosOf;

  // steps from src to every cell through empty cells
  function npBfs(P, val, src) {
    const d = new Int16Array(P.N).fill(-1);
    d[src] = 0;
    const q = [src];
    for (let t = 0; t < q.length; t++) {
      const x = q[t];
      for (const j of P.nb[x]) if (!val[j] && d[j] < 0) { d[j] = d[x] + 1; q.push(j); }
    }
    return d;
  }

  /* Where can each missing number go?
   *   mode 1  next to the numbers before and after it, where those are placed
   *   mode 2  within reach of the nearest placed numbers below and above it
   *           (counting steps through empty cells; with side-by-side steps,
   *           also the chessboard colour)
   *   mode 3  and with room beside it for both its neighbours in the chain
   * Returns { pos, cand[k] (cells), lo[k], hi[k], cover[c], who[c], free } or
   * { contra: {t, k | c} }. */
  function npCands(P, val, mode, noParity) {
    const n = P.n, N = P.N;
    const pos = npPosOf(P, val);
    if (!pos) return { contra: { t: 'dup' } };
    const lo = new Int32Array(n + 2), hi = new Int32Array(n + 2);
    let last = 0;
    for (let k = 1; k <= n; k++) { lo[k] = last; if (pos[k] >= 0) last = k; }
    let nxt = n + 1;
    for (let k = n; k >= 1; k--) { hi[k] = nxt; if (pos[k] >= 0) nxt = k; }
    for (let k = 1; k < n; k++) if (pos[k] >= 0 && pos[k + 1] >= 0 && !P.adjM[pos[k] * N + pos[k + 1]]) return { contra: { t: 'gap', k }, pos };
    const free = [];
    for (const i of P.cells) if (!val[i]) free.push(i);
    const cand = new Array(n + 2).fill(null);
    const mark = new Uint8Array((n + 2) * N);
    const dist = {};
    const D = (k) => dist[k] || (dist[k] = npBfs(P, val, pos[k]));
    for (let k = 1; k <= n; k++) {
      if (pos[k] >= 0) { mark[k * N + pos[k]] = 1; continue; }
      const a = lo[k], b = hi[k], out = [];
      if (mode === 1) {
        const pa = k > 1 ? pos[k - 1] : -1, pb = k < n ? pos[k + 1] : -1;
        for (const c of free) {
          if (pa >= 0 && !P.adjM[pa * N + c]) continue;
          if (pb >= 0 && !P.adjM[pb * N + c]) continue;
          out.push(c);
        }
      } else {
        const da = a ? D(a) : null, db = b <= n ? D(b) : null;
        const par = P.adj === 4 && !noParity;
        for (const c of free) {
          if (da && (da[c] < 0 || da[c] > k - a)) continue;
          if (db && (db[c] < 0 || db[c] > b - k)) continue;
          if (par) {
            if (a && ((P.col[c] ^ P.col[pos[a]]) !== ((k - a) & 1))) continue;
            if (b <= n && ((P.col[c] ^ P.col[pos[b]]) !== ((b - k) & 1))) continue;
          }
          out.push(c);
        }
      }
      if (!out.length) return { contra: { t: 'num', k }, pos };
      for (const c of out) mark[k * N + c] = 1;
      cand[k] = out;
    }
    if (mode >= 3) {
      // a number needs room beside it for the numbers before and after it
      const supported = (c, k) => {
        let s1 = null, s2 = null;
        if (k > 1) {
          if (pos[k - 1] >= 0) { if (!P.adjM[pos[k - 1] * N + c]) return false; s1 = [pos[k - 1]]; }
          else { s1 = P.nb[c].filter((x) => mark[(k - 1) * N + x]); if (!s1.length) return false; }
        }
        if (k < n) {
          if (pos[k + 1] >= 0) { if (!P.adjM[pos[k + 1] * N + c]) return false; s2 = [pos[k + 1]]; }
          else { s2 = P.nb[c].filter((x) => mark[(k + 1) * N + x]); if (!s2.length) return false; }
        }
        if (s1 && s2 && s1.length === 1 && s2.length === 1 && s1[0] === s2[0]) return false;
        return true;
      };
      let changed = true;
      while (changed) {
        changed = false;
        for (let k = 1; k <= n; k++) {
          const cs = cand[k];
          if (!cs) continue;
          const keep = [];
          for (const c of cs) { if (supported(c, k)) keep.push(c); else { mark[k * N + c] = 0; changed = true; } }
          if (!keep.length) return { contra: { t: 'num', k }, pos };
          cand[k] = keep;
        }
      }
    }
    const cover = new Int32Array(N), who = new Int32Array(N).fill(-1);
    for (let k = 1; k <= n; k++) if (cand[k]) for (const c of cand[k]) { cover[c]++; who[c] = k; }
    if (mode >= 2) for (const c of free) if (!cover[c]) return { contra: { t: 'cell', c }, pos };
    return { pos, cand, lo, hi, cover, who, free, mark };
  }
  L.npCands = npCands;

  // [cell, number, 'num' | 'cell'] that are forced
  function npSingles(P, r, cells) {
    const out = [];
    for (let k = 1; k <= P.n; k++) if (r.cand[k] && r.cand[k].length === 1) out.push([r.cand[k][0], k, 'num']);
    if (cells) for (const c of r.free) if (r.cover[c] === 1 && !out.some((x) => x[0] === c)) out.push([c, r.who[c], 'cell']);
    return out;
  }

  // propagate singles of a mode until nothing changes; null or the contradiction
  function npProp(P, val, mode) {
    for (let guard = 0; guard < 500; guard++) {
      const r = npCands(P, val, mode);
      if (r.contra) return r.contra;
      const s = npSingles(P, r, mode >= 2);
      if (!s.length) return null;
      for (const [c, k] of s) {
        if (val[c] && val[c] !== k) return { t: 'clash', c };
        val[c] = k;
      }
    }
    return null;
  }
  L.npProp = npProp;

  // is a full grid a valid chain?
  L.npValid = function (P, val) {
    const pos = npPosOf(P, val);
    if (!pos) return false;
    for (let k = 1; k <= P.n; k++) if (pos[k] < 0) return false;
    for (let k = 1; k < P.n; k++) if (!P.adjM[pos[k] * P.N + pos[k + 1]]) return false;
    return true;
  };

  L.npCount = function (P, val0, limit, nodeCap) {
    limit = limit || 2;
    nodeCap = nodeCap || 60000;
    let count = 0, sol = null, nodes = 0, aborted = false;
    const rec = (val) => {
      if (count >= limit || aborted) return;
      if (++nodes > nodeCap) { aborted = true; return; }
      if (npProp(P, val, 3)) return;
      const r = npCands(P, val, 3);
      if (r.contra) return;
      let best = -1, bs = 1e9;
      for (let k = 1; k <= P.n; k++) if (r.cand[k] && r.cand[k].length < bs) { bs = r.cand[k].length; best = k; }
      if (best < 0) {
        if (L.npValid(P, val)) { count++; sol = Int16Array.from(val); }
        return;
      }
      for (const c of r.cand[best]) {
        const v2 = Int16Array.from(val);
        v2[c] = best;
        rec(v2);
        if (count >= limit || aborted) return;
      }
    };
    rec(Int16Array.from(val0 || P.given));
    return { count, sol, nodes, aborted };
  };

  /* How far logic of a level gets: 1 next-door steps, 2 reach, 3 room for
   * both neighbours, 4 short trials. Returns { open, count[level], top, val }
   * (open -1: a contradiction). */
  L.npSolveTo = function (P, val0, level) {
    const val = Int16Array.from(val0);
    const count = [0, 0, 0, 0, 0, 0];
    const top = () => { for (let k = 5; k >= 1; k--) if (count[k]) return k; return 0; };
    for (let guard = 0; guard < 2000; guard++) {
      let open = 0;
      for (const i of P.cells) if (!val[i]) open++;
      if (!open) return { open: 0, count, top: top(), val };
      let got = false;
      for (let lv = 1; lv <= Math.min(3, level) && !got; lv++) {
        const r = npCands(P, val, lv);
        if (r.contra) return { open: -1, count, top: top(), val };
        const s = npSingles(P, r, lv >= 2);
        if (s.length) {
          for (const [c, k] of s) val[c] = k;
          count[lv]++;
          got = true;
        }
      }
      if (!got && level >= 4) {
        const r = npCands(P, val, 3);
        const ks = [];
        for (let k = 1; k <= P.n; k++) if (r.cand[k] && r.cand[k].length === 2) ks.push(k);
        for (let t = 0; t < ks.length && t < 24 && !got; t++) {
          const k = ks[t];
          for (let q = 0; q < 2 && !got; q++) {
            const v2 = Int16Array.from(val);
            v2[r.cand[k][q]] = k;
            if (npProp(P, v2, 3)) { val[r.cand[k][1 - q]] = k; got = true; }
          }
        }
        if (got) count[4]++;
      }
      if (!got) return { open, count, top: top(), val };
    }
    return { open: -1, count, top: top(), val };
  };

  /* The next step from a player's numbers (all right), explained. */
  L.npStep = function (P, val, maxLevel, sol) {
    maxLevel = maxLevel || 5;
    const n = P.n, w = P.w;
    const B = (k) => '**' + k + '**';
    const r1 = npCands(P, val, 1);
    if (r1.contra) return null;
    const pos = r1.pos;
    // 1: next door
    let best = null;
    for (let k = 1; k <= n; k++) {
      const cs = r1.cand[k];
      if (!cs || cs.length !== 1) continue;
      const pa = k > 1 ? pos[k - 1] : -1, pb = k < n ? pos[k + 1] : -1;
      if (pa < 0 && pb < 0) continue;
      const c = cs[0];
      let text;
      if (pa >= 0 && pb >= 0) text = 'Only one empty cell touches both ' + B(k - 1) + ' and ' + B(k + 1) + ', so ' + B(k) + ' goes there.';
      else if (pa >= 0) text = B(k - 1) + ' has just one empty neighbour left, and ' + B(k) + ' has to sit next to it: it goes there.';
      else text = B(k + 1) + ' has just one empty neighbour left, and ' + B(k) + ' has to sit next to it: it goes there.';
      const score = (pa >= 0 && pb >= 0 ? 0 : 1);
      if (!best || score < best.score) best = { score, level: 1, set: [[c, k]], focus: [pa, pb].filter((x) => x >= 0), text };
      if (score === 0) break;
    }
    if (best) return best;
    if (maxLevel < 2) return null;
    // 2: reach
    const r2 = npCands(P, val, 2);
    if (r2.contra) return null;
    const reach = (k, r) => {
      const a = r.lo[k], b = r.hi[k], parts = [];
      if (a) parts.push(k - a === 1 ? 'next to ' + B(a) : 'within ' + word(k - a) + ' steps of ' + B(a));
      if (b <= n) parts.push(b - k === 1 ? 'next to ' + B(b) : 'within ' + word(b - k) + ' steps of ' + B(b));
      return parts;
    };
    const s2 = npSingles(P, r2, true);
    if (s2.length) {
      // prefer a number single with the tightest gap
      s2.sort((x, y) => (x[2] === y[2] ? 0 : x[2] === 'num' ? -1 : 1) || ((r2.hi[x[1]] - r2.lo[x[1]]) - (r2.hi[y[1]] - r2.lo[y[1]])));
      const [c, k, how] = s2[0];
      const a = r2.lo[k], b = r2.hi[k];
      const focus = [a ? pos[a] : -1, b <= n ? pos[b] : -1].filter((x) => x >= 0);
      let text;
      if (how === 'num') {
        const parts = reach(k, r2);
        text = B(k) + ' has to be ' + parts.join(' and ') + ' (counting steps through empty cells). Only one cell is.';
        if (P.adj === 4) {
          const np = npCands(P, val, 2, true);
          if (!np.contra && np.cand[k] && np.cand[k].length > 1) {
            text += ' Colour the grid like a chessboard: every step changes colour, so ' + B(k) + ' must be on the same colour as ' + B(a || b) + ' ' + ((Math.abs(k - (a || b)) & 1) ? 'after an odd number of steps — the other colour' : 'after an even number of steps — the same colour') + '. That rules out the rest.';
          }
        }
      } else {
        text = 'Something has to go in the cell at ' + cellName(c, w) + ', but every missing number except ' + B(k) + ' is too far away from its neighbours in the chain to reach it. So it is ' + B(k) + '.';
      }
      return { level: 2, set: [[c, k]], focus, zone: how === 'num' ? [] : [c], text };
    }
    if (maxLevel < 3) return null;
    // 3: room for both neighbours
    const r3 = npCands(P, val, 3);
    if (r3.contra) return null;
    const s3 = npSingles(P, r3, true);
    if (s3.length) {
      const [c, k, how] = s3[0];
      const a = r3.lo[k], b = r3.hi[k];
      const focus = [a ? pos[a] : -1, b <= n ? pos[b] : -1].filter((x) => x >= 0);
      let text;
      if (how === 'num') {
        const zone = r2.cand[k] ? r2.cand[k].filter((x) => x !== c) : [];
        const nbWords = k === 1 ? B(2) : k === n ? B(n - 1) : 'both ' + B(k - 1) + ' and ' + B(k + 1);
        text = 'Several cells are within reach for ' + B(k) + ' (shaded), but a number needs room beside it for ' + nbWords + '. Only one of those cells still has it, so ' + B(k) + ' goes there.';
        return { level: 3, set: [[c, k]], focus, zone, text };
      }
      text = 'Every number is in a chain, so the cell at ' + cellName(c, w) + ' needs neighbours for the numbers just before and after its own. Of the numbers that can reach it, only ' + B(k) + ' has them.';
      return { level: 3, set: [[c, k]], focus, zone: [c], text };
    }
    if (maxLevel < 4) return null;
    // 4: suppose…
    for (let k = 1; k <= n; k++) {
      const cs = r3.cand[k];
      if (!cs || cs.length !== 2) continue;
      for (let q = 0; q < 2; q++) {
        const v2 = Int16Array.from(val);
        v2[cs[q]] = k;
        if (npProp(P, v2, 3)) {
          return { level: 4, set: [[cs[1 - q], k]], focus: [], zone: [cs[q]], text: B(k) + ' can only be in one of two cells. Suppose it went in the shaded one, at ' + cellName(cs[q], w) + ': follow the chain on from there and it runs into a dead end (some number finds no cell). So ' + B(k) + ' goes in the other one.' };
        }
      }
    }
    if (maxLevel < 5 || !sol) return null;
    // 5: a long chain — take the number with the fewest places
    let bk = -1, bs = 1e9;
    for (let k = 1; k <= n; k++) if (r3.cand[k] && r3.cand[k].length < bs) { bs = r3.cand[k].length; bk = k; }
    if (bk < 0) return null;
    let c = -1;
    for (const i of P.cells) if (sol[i] === bk) c = i;
    return { level: 5, set: [[c, bk]], focus: [], zone: r3.cand[bk].filter((x) => x !== c), text: 'This one needs a long chain of trial and error. ' + B(bk) + ' has ' + word(bs) + ' possible cells (shaded), and it belongs at ' + cellName(c, w) + ' — can you see why?' };
  };

  /* ---- making number paths ---- */

  // a random path through every cell: a first path, then many "backbite" moves
  L.npPath = function (P, rng) {
    const n = P.n, N = P.N;
    let path = null;
    const full = n === N;
    if (full) {
      path = [];
      for (let r = 0; r < P.h; r++) for (let c = 0; c < P.w; c++) path.push(r * P.w + (r % 2 ? P.w - 1 - c : c));
    } else {
      for (let attempt = 0; attempt < 400 && !path; attempt++) {
        const used = new Uint8Array(N);
        const start = P.cells[rng.int(n)];
        const p = [start];
        used[start] = 1;
        while (p.length < n) {
          const cur = p[p.length - 1];
          let best = [], bd = 99;
          for (const j of P.nb[cur]) {
            if (used[j]) continue;
            let d = 0;
            for (const x of P.nb[j]) if (!used[x]) d++;
            if (d < bd) { bd = d; best = [j]; } else if (d === bd) best.push(j);
          }
          if (!best.length) break;
          const j = best[rng.int(best.length)];
          used[j] = 1;
          p.push(j);
        }
        if (p.length === n) path = p;
      }
      if (!path) return null;
    }
    const at = new Int32Array(N).fill(-1);
    path.forEach((c, t) => { at[c] = t; });
    const moves = n * 30;
    for (let m = 0; m < moves; m++) {
      if (rng() < 0.5) {
        // the head bites: a neighbour p[j] of p[0]; the path becomes p[j-1] … p[0], p[j] …
        const nbs = P.nb[path[0]];
        const x = nbs[rng.int(nbs.length)], j = at[x];
        if (j <= 1) continue;
        for (let a = 0, b = j - 1; a < b; a++, b--) { const t = path[a]; path[a] = path[b]; path[b] = t; }
        for (let t = 0; t < j; t++) at[path[t]] = t;
      } else {
        const last = n - 1, nbs = P.nb[path[last]];
        const x = nbs[rng.int(nbs.length)], j = at[x];
        if (j >= last - 1) continue;
        for (let a = j + 1, b = last; a < b; a++, b--) { const t = path[a]; path[a] = path[b]; path[b] = t; }
        for (let t = j + 1; t <= last; t++) at[path[t]] = t;
      }
    }
    const sol = new Int16Array(N);
    path.forEach((c, t) => { sol[c] = t + 1; });
    return sol;
  };

  L.npDiff = (n, adj, g) => {
    const size = n <= 25 ? 0 : n <= 36 ? 0.4 : n <= 49 ? 0.8 : n <= 64 ? 1.2 : n <= 81 ? 1.6 : 2;
    const lv = [0, 0.6, 1.2, 1.8, 2.6, 3.2][g.top] + Math.min(0.6, (g.count[3] + g.count[4] * 2) * 0.06);
    return clamp(Math.round(size + lv), 1, 5);
  };

  /* A puzzle on the cells of base P: a random chain, then numbers taken away
   * while logic of `level` still finishes it. opts.ends keeps 1 and n printed. */
  L.npMake = function (P, rng, level, opts) {
    opts = opts || {};
    const sol = L.npPath(P, rng);
    if (!sol) return null;
    const n = P.n;
    const val = Int16Array.from(sol);
    const order = rng.shuffle(P.cells.slice());
    const keep = (c) => opts.ends && (sol[c] === 1 || sol[c] === n);
    // take numbers away in small batches first, then one at a time
    const t0 = now();
    for (let t = 0; t < order.length; t++) {
      const c = order[t];
      if (keep(c)) continue;
      val[c] = 0;
      if (L.npSolveTo(P, val, level).open !== 0) val[c] = sol[c];
      if (opts.budget && now() - t0 > opts.budget) return null;
    }
    // a few numbers back on the easiest levels, so they start gently
    if (opts.extra) {
      const empty = order.filter((c) => !val[c]);
      for (let t = 0; t < opts.extra && t < empty.length; t++) val[empty[t]] = sol[empty[t]];
    }
    const g = L.npSolveTo(P, val, 4);
    if (g.open) return null;
    let givens = 0;
    for (const c of P.cells) if (val[c]) givens++;
    return { sol: Array.from(sol), given: Array.from(val), grade: g, givens, diff: L.npDiff(n, P.adj, g) };
  };

  /* =====================================================================
   *  SHARED: region grids (Norinori, LITS, Heyawake)
   * ===================================================================== */

  function regPrep(regions) {
    const h = regions.length, w = regions[0].length, N = w * h;
    const reg = regionsOf(regions);
    let R = 0;
    for (let i = 0; i < N; i++) R = Math.max(R, reg[i] + 1);
    const units = Array.from({ length: R }, () => []);
    for (let i = 0; i < N; i++) units[reg[i]].push(i);
    const nb = nbList(w, h, null, 4);
    return { w, h, N, R, reg, units, nb };
  }
  L.regPrep = regPrep;

  // is region k (of reg) in one piece?
  function regConnected(reg, w, h, k, skip) {
    let start = -1, total = 0;
    const N = w * h;
    for (let i = 0; i < N; i++) if (reg[i] === k && i !== skip) { total++; if (start < 0) start = i; }
    if (!total) return false;
    const seen = new Uint8Array(N), stack = [start];
    seen[start] = 1;
    let got = 1;
    while (stack.length) {
      const i = stack.pop(), r = Math.floor(i / w), c = i % w;
      const nbs = [r > 0 ? i - w : -1, r < h - 1 ? i + w : -1, c > 0 ? i - 1 : -1, c < w - 1 ? i + 1 : -1];
      for (const j of nbs) if (j >= 0 && j !== skip && reg[j] === k && !seen[j]) { seen[j] = 1; got++; stack.push(j); }
    }
    return got === total;
  }
  L.regConnected = regConnected;

  // grow regions from seeds (reg[i] >= 0) over the unassigned cells (-1), smaller regions first more often
  function growRegions(reg, w, h, rng, bias) {
    const N = w * h;
    let R = 0;
    for (let i = 0; i < N; i++) R = Math.max(R, reg[i] + 1);
    const size = new Array(R).fill(0);
    for (let i = 0; i < N; i++) if (reg[i] >= 0) size[reg[i]]++;
    let left = 0;
    for (let i = 0; i < N; i++) if (reg[i] < 0) left++;
    const nb = nbList(w, h, null, 4);
    for (let guard = 0; left > 0 && guard < 50 * N; guard++) {
      // a random unassigned cell next to a region
      const opts = [];
      for (let i = 0; i < N; i++) {
        if (reg[i] >= 0) continue;
        for (const j of nb[i]) if (reg[j] >= 0) { opts.push([i, reg[j]]); }
      }
      if (!opts.length) return null;
      let pick = opts[rng.int(opts.length)];
      if (rng() < (bias == null ? 0.6 : bias)) {
        let best = 1e9;
        for (const o of opts) if (size[o[1]] < best) { best = size[o[1]]; pick = o; }
        const tied = opts.filter((o) => size[o[1]] === best);
        pick = tied[rng.int(tied.length)];
      }
      reg[pick[0]] = pick[1];
      size[pick[1]]++;
      left--;
    }
    return left ? null : reg;
  }
  L.growRegions = growRegions;

  // hill-climb: move cells allowed by `movable` between regions until scoreOf (cells logic leaves open) is 0
  function nudgeRegions(reg, w, h, rng, movable, scoreOf, maxIter, deadline) {
    const N = w * h;
    const sc = (rg) => { const x = scoreOf(rg); return typeof x === 'number' ? { s: x, hot: null } : x; };
    let cur = sc(reg);
    for (let guard = 0; cur.s !== 0 && guard < maxIter; guard++) {
      if (deadline && now() > deadline) return null;
      // mostly a cell next to what logic could not settle
      let i;
      if (cur.hot && cur.hot.length && rng() < 0.8) {
        const x = cur.hot[rng.int(cur.hot.length)], r0 = Math.floor(x / w), c0 = x % w;
        const dr = rng.int(5) - 2, dc = rng.int(5) - 2;
        i = clamp(r0 + dr, 0, h - 1) * w + clamp(c0 + dc, 0, w - 1);
      } else i = rng.int(N);
      if (!movable(i)) continue;
      const r = Math.floor(i / w), c = i % w;
      const others = [];
      if (r > 0 && reg[i - w] !== reg[i]) others.push(reg[i - w]);
      if (r < h - 1 && reg[i + w] !== reg[i]) others.push(reg[i + w]);
      if (c > 0 && reg[i - 1] !== reg[i]) others.push(reg[i - 1]);
      if (c < w - 1 && reg[i + 1] !== reg[i]) others.push(reg[i + 1]);
      if (!others.length) continue;
      const from = reg[i], to = others[rng.int(others.length)];
      if (!regConnected(reg, w, h, from, i)) continue;
      const trial = Int32Array.from(reg);
      trial[i] = to;
      const c2 = sc(trial);
      // mostly downhill, now and then a step up to get out of a dip
      const T = 0.9 * (1 - guard / maxIter);
      if (c2.s <= cur.s || (c2.s < 1e8 && T > 0 && rng() < Math.exp(-(c2.s - cur.s) / T))) { reg = trial; cur = c2; }
    }
    return cur.s === 0 ? reg : null;
  }

  // hill-climb the other way: keep ok(reg), make effort(reg) (what easier logic leaves open) grow
  function hardenRegions(reg, w, h, rng, movable, ok, effort, iters, deadline) {
    const N = w * h;
    let cur = effort(reg);
    for (let guard = 0; guard < iters; guard++) {
      if (deadline && now() > deadline) break;
      const i = rng.int(N);
      if (!movable(i)) continue;
      const r = Math.floor(i / w), c = i % w;
      const others = [];
      if (r > 0 && reg[i - w] !== reg[i]) others.push(reg[i - w]);
      if (r < h - 1 && reg[i + w] !== reg[i]) others.push(reg[i + w]);
      if (c > 0 && reg[i - 1] !== reg[i]) others.push(reg[i - 1]);
      if (c < w - 1 && reg[i + 1] !== reg[i]) others.push(reg[i + 1]);
      if (!others.length) continue;
      const from = reg[i], to = others[rng.int(others.length)];
      if (!regConnected(reg, w, h, from, i)) continue;
      const trial = Int32Array.from(reg);
      trial[i] = to;
      if (!ok(trial)) continue;
      const e = effort(trial);
      if (e >= cur) { reg = trial; cur = e; }
    }
    return reg;
  }

  // renumber regions in reading order (so letters look tidy)
  function tidyRegions(reg) {
    const map = new Map(), out = new Int32Array(reg.length);
    for (let i = 0; i < reg.length; i++) {
      if (!map.has(reg[i])) map.set(reg[i], map.size);
      out[i] = map.get(reg[i]);
    }
    return out;
  }
  L.tidyRegions = tidyRegions;

  function fail(opts, why) { if (opts && opts.why) opts.why[why] = (opts.why[why] || 0) + 1; return null; }
  L.fail = fail;
  const openCount = (v) => { let k = 0; for (let i = 0; i < v.length; i++) if (v[i] < 0) k++; return k; };

  /* =====================================================================
   *  NORINORI
   *  data: { kind: 'norinori', regions: ['aab…', …], sol: ['#..#', …] }
   *  every region holds exactly two shaded cells; every shaded cell touches
   *  exactly one other shaded cell (they come in dominoes)
   * ===================================================================== */

  L.nrPrep = function (regions) { return regPrep(regions); };

  // the plain rules until nothing changes; null or the contradiction met
  function nrProp(P, v) {
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < P.N; i++) {
        if (v[i] !== 1) continue;
        let s = 0, o = 0, oc = -1;
        for (const j of P.nb[i]) { if (v[j] === 1) s++; else if (v[j] < 0) { o++; oc = j; } }
        if (s >= 2) return { t: 'three', c: i };
        if (s === 1) { if (o) { for (const j of P.nb[i]) if (v[j] < 0) v[j] = 0; changed = true; } }
        else if (!o) return { t: 'alone', c: i };
        else if (o === 1) { v[oc] = 1; changed = true; }
      }
      for (let i = 0; i < P.N; i++) {
        if (v[i] >= 0) continue;
        let s = 0;
        for (const j of P.nb[i]) if (v[j] === 1) s++;
        if (s >= 2) { v[i] = 0; changed = true; }
      }
      for (let k = 0; k < P.R; k++) {
        let s = 0, o = 0;
        for (const i of P.units[k]) { if (v[i] === 1) s++; else if (v[i] < 0) o++; }
        if (s > 2 || s + o < 2) return { t: 'region', k };
        if (!o) continue;
        if (s === 2) { for (const i of P.units[k]) if (v[i] < 0) v[i] = 0; changed = true; }
        else if (s + o === 2) { for (const i of P.units[k]) if (v[i] < 0) v[i] = 1; changed = true; }
      }
    }
    return null;
  }
  L.nrProp = nrProp;

  L.nrValid = function (P, v) {
    for (let i = 0; i < P.N; i++) {
      if (v[i] !== 1) continue;
      let s = 0;
      for (const j of P.nb[i]) if (v[j] === 1) s++;
      if (s !== 1) return false;
    }
    for (const u of P.units) { let s = 0; for (const i of u) if (v[i] === 1) s++; if (s !== 2) return false; }
    return true;
  };

  L.nrCount = function (P, v0, limit, nodeCap) {
    limit = limit || 2;
    nodeCap = nodeCap || 200000;
    let count = 0, sol = null, nodes = 0, aborted = false;
    const rec = (v) => {
      if (count >= limit || aborted) return;
      if (++nodes > nodeCap) { aborted = true; return; }
      if (nrProp(P, v)) return;
      let best = -1, bo = 1e9;
      for (let k = 0; k < P.R; k++) {
        let s = 0, o = 0, first = -1;
        for (const i of P.units[k]) { if (v[i] === 1) s++; else if (v[i] < 0) { o++; if (first < 0) first = i; } }
        if (s < 2 && o < bo) { bo = o; best = first; }
      }
      if (best < 0) {
        const t = Int8Array.from(v);
        for (let i = 0; i < P.N; i++) if (t[i] < 0) t[i] = 0;
        if (L.nrValid(P, t)) { count++; sol = t; }
        return;
      }
      for (const val of [1, 0]) {
        const v2 = Int8Array.from(v);
        v2[best] = val;
        rec(v2);
        if (count >= limit || aborted) return;
      }
    };
    rec(v0 ? Int8Array.from(v0) : new Int8Array(P.N).fill(-1));
    return { count, sol, nodes, aborted };
  };

  // every way to finish region k that breaks no rule near it (deep: follow the plain rules)
  function nrPlacements(P, v, k, deep) {
    const u = P.units[k];
    let s = 0;
    const open = [];
    for (const i of u) { if (v[i] === 1) s++; else if (v[i] < 0) open.push(i); }
    const need = 2 - s, out = [];
    if (need <= 0 || need > open.length) return { need, open, out };
    const tryIt = (pick) => {
      const t = Int8Array.from(v);
      for (const i of open) t[i] = pick.includes(i) ? 1 : 0;
      if (deep) { if (nrProp(P, t)) return; }
      else {
        // the shaded cells in and next to the region: no line of three, and a partner still possible
        const near = new Set();
        for (const i of u) { near.add(i); for (const j of P.nb[i]) near.add(j); }
        for (const i of near) {
          if (t[i] !== 1) continue;
          let sh = 0, op = 0;
          for (const j of P.nb[i]) { if (t[j] === 1) sh++; else if (t[j] < 0) op++; }
          if (sh >= 2 || (!sh && !op)) return;
        }
      }
      out.push(pick);
    };
    if (need === 1) for (const a of open) tryIt([a]);
    else for (let x = 0; x < open.length; x++) for (let y = x + 1; y < open.length; y++) tryIt([open[x], open[y]]);
    return { need, open, out };
  }

  /* The next step from a position (every mark right). Levels: 1 the plain
   * rules, 2 every way to finish a region, 3 the same followed through,
   * 4 "suppose…", 5 a long chain. */
  L.nrStep = function (P, v0, maxLevel, sol) {
    maxLevel = maxLevel || 5;
    const v = Int8Array.from(v0), w = P.w;
    // 1a: a finished domino, or a full region
    for (let i = 0; i < P.N; i++) {
      if (v[i] !== 1) continue;
      const mate = P.nb[i].find((j) => v[j] === 1);
      if (mate == null) continue;
      const set = [];
      for (const x of [i, mate]) for (const j of P.nb[x]) if (v[j] < 0 && !set.some((q) => q[0] === j)) set.push([j, 0]);
      if (set.length) return { level: 1, set, focus: [i, mate], text: 'These two shaded cells make a finished domino. No other shaded cell may touch it, so the cells around it stay white.' };
    }
    for (let k = 0; k < P.R; k++) {
      let s = 0;
      const open = [];
      for (const i of P.units[k]) { if (v[i] === 1) s++; else if (v[i] < 0) open.push(i); }
      if (!open.length) continue;
      if (s === 2) return { level: 1, set: open.map((i) => [i, 0]), focus: P.units[k], text: 'The highlighted region already has its two shaded cells: the rest of it stays white.' };
      if (s + open.length === 2) return { level: 1, set: open.map((i) => [i, 1]), focus: P.units[k], text: 'The highlighted region has only ' + (open.length === 1 ? 'one cell' : 'two cells') + ' left for ' + (s ? 'its second shaded cell' : 'its two shaded cells') + ': shade ' + (open.length === 1 ? 'it' : 'them') + '.' };
    }
    // 1b: a lonely shaded cell with one way out; a cell between two shaded cells
    for (let i = 0; i < P.N; i++) {
      if (v[i] !== 1) continue;
      let s = 0;
      const o = [];
      for (const j of P.nb[i]) { if (v[j] === 1) s++; else if (v[j] < 0) o.push(j); }
      if (!s && o.length === 1) return { level: 1, set: [[o[0], 1]], focus: [i], text: 'The shaded cell at ' + cellName(i, w) + ' needs a partner to make a domino, and only one of its neighbours is still free: shade it.' };
    }
    for (let i = 0; i < P.N; i++) {
      if (v[i] >= 0) continue;
      const sh = P.nb[i].filter((j) => v[j] === 1);
      if (sh.length >= 2) return { level: 1, set: [[i, 0]], focus: sh, text: 'The cell at ' + cellName(i, w) + ' touches two shaded cells. Shading it would join them into a line of three, so it stays white.' };
    }
    if (maxLevel < 2) return null;
    // 2 / 3: every way to finish a region
    for (const deep of [false, true]) {
      if (deep && maxLevel < 3) break;
      let best = null;
      for (let k = 0; k < P.R; k++) {
        const pl = nrPlacements(P, v, k, deep);
        if (pl.need <= 0) continue;
        if (!pl.out.length) continue;
        const shade = pl.open.filter((i) => pl.out.every((p) => p.includes(i)));
        const white = pl.open.filter((i) => !pl.out.some((p) => p.includes(i)));
        if (!shade.length && !white.length) continue;
        const set = shade.length ? shade.map((i) => [i, 1]) : white.map((i) => [i, 0]);
        const score = pl.out.length * 10 - set.length;
        if (!best || score < best.score) best = { k, pl, set, score, shade: shade.length > 0 };
      }
      if (best) {
        const n = best.pl.out.length, need = best.pl.need;
        const them = need === 1 ? 'its last shaded cell' : 'its two shaded cells';
        const ways = n === 1 ? 'only one way' : word(n) + ' ways';
        const cells = best.set.length === 1 ? 'the cell at ' + cellName(best.set[0][0], w) : word(best.set.length) + ' cells (outlined)';
        let text = 'Try every way to give the highlighted region ' + them + (deep ? ', following the rules a step or two beyond the region' : ' without making a line of three or stranding a shaded cell') + ': there ' + (n === 1 ? 'is ' : 'are ') + ways + ', and ';
        text += best.shade ? (n === 1 ? 'it shades ' : 'every one shades ') + cells + '.' : (n === 1 ? 'it leaves ' : 'none of them uses ') + cells + (n === 1 ? ' white.' : ': white.');
        return { level: deep ? 3 : 2, set: best.set, focus: P.units[best.k], text };
      }
    }
    if (maxLevel < 4) return null;
    // 4: suppose…
    for (let i = 0; i < P.N; i++) {
      if (v[i] >= 0) continue;
      for (const val of [1, 0]) {
        const t = Int8Array.from(v);
        t[i] = val;
        const c = nrProp(P, t);
        if (!c) continue;
        const why = c.t === 'three' ? 'three shaded cells would end up in a line or an L' : c.t === 'alone' ? 'a shaded cell would be left with no partner' : 'a region would end up with the wrong number of shaded cells';
        return { level: 4, set: [[i, 1 - val]], focus: c.k != null ? P.units[c.k] : c.c != null ? [c.c] : [], zone: [i], text: 'Suppose the cell at ' + cellName(i, w) + ' were ' + (val ? 'shaded' : 'white') + '. Follow the rules from there and ' + why + '. So it is ' + (val ? 'white' : 'shaded') + '.' };
      }
    }
    if (maxLevel < 5 || !sol) return null;
    for (let i = 0; i < P.N; i++) if (v[i] < 0 && sol[i] === 1) return { level: 5, set: [[i, 1]], focus: [], text: 'This needs a long chain of reasoning. The cell at ' + cellName(i, w) + ' is shaded — can you see why?' };
    return null;
  };

  // how far logic of a level gets (batch deductions, for grading and making)
  L.nrSolveTo = function (P, level, v0) {
    const v = v0 ? Int8Array.from(v0) : new Int8Array(P.N).fill(-1);
    const count = [0, 0, 0, 0, 0, 0];
    for (let guard = 0; guard < 500; guard++) {
      if (nrProp(P, v)) return { open: -1, count, v };
      count[1]++;
      const open = openCount(v);
      if (!open || level < 2) return { open, count, v, top: topOf(count) };
      let got = false;
      for (const deep of [false, true]) {
        if (got || (deep && level < 3)) break;
        for (let k = 0; k < P.R; k++) {
          const pl = nrPlacements(P, v, k, deep);
          if (pl.need <= 0 || !pl.out.length) continue;
          for (const i of pl.open) {
            if (pl.out.every((p) => p.includes(i))) { v[i] = 1; got = true; }
            else if (!pl.out.some((p) => p.includes(i))) { v[i] = 0; got = true; }
          }
        }
        if (got) count[deep ? 3 : 2]++;
      }
      if (!got && level >= 4) {
        for (let i = 0; i < P.N && !got; i++) {
          if (v[i] >= 0) continue;
          for (const val of [1, 0]) {
            const t = Int8Array.from(v);
            t[i] = val;
            if (nrProp(P, t)) { v[i] = 1 - val; got = true; break; }
          }
        }
        if (got) count[4]++;
      }
      if (!got) return { open, count, v, top: topOf(count) };
    }
    return { open: -1, count, v };
  };
  // difficulty 1..5 from the size and the hardest logic needed (and how often)
  function gradeOf(N, g) {
    const size = N <= 36 ? 0.3 : N <= 49 ? 0.8 : N <= 64 ? 1.3 : N <= 81 ? 1.9 : N <= 100 ? 2.5 : 3;
    const top = [0, 0, 0.5, 1.2, 2.2, 3][g.top || 0];
    const bonus = Math.min(1, 0.3 * (g.count[3] || 0) + 0.35 * (g.count[4] || 0));
    return clamp(Math.round(size + top + bonus), 1, 5);
  }
  L.gradeOf = gradeOf;
  function topOf(count) { for (let k = 5; k >= 1; k--) if (count[k]) return k; return 0; }

  L.nrDiff = (w, h, g) => gradeOf(w * h, g);

  /* A random Norinori: dominoes that never touch side to side, each shaded
   * cell paired with a partner (its own domino-mate or a nearby cell of
   * another domino) into a region, the white cells shared out, then white
   * cells moved between regions until the dominoes are the only answer. */
  L.nrMake = function (w, h, rng, opts) {
    opts = opts || {};
    const N = w * h, nb = nbList(w, h, null, 4);
    const t0 = now(), deadline = opts.budget ? t0 + opts.budget : 0;
    const sh = new Uint8Array(N), mate = new Int32Array(N).fill(-1);
    const free = (i) => !sh[i] && nb[i].every((j) => !sh[j]);
    for (const i of rng.shuffle(Array.from({ length: N }, (_, k) => k))) {
      if (!free(i)) continue;
      const js = rng.shuffle(nb[i].slice()).filter((j) => nb[j].every((x) => x === i || !sh[x]) && !sh[j]);
      if (!js.length) continue;
      const j = js[0];
      sh[i] = sh[j] = 1;
      mate[i] = j; mate[j] = i;
    }
    // pair shaded cells into regions (a few tries: an orphan may find no partner)
    const cells = [];
    for (let i = 0; i < N; i++) if (sh[i]) cells.push(i);
    const split = opts.split == null ? 0.45 : opts.split;
    let reg = null;
    for (let attempt = 0; attempt < 12 && !reg; attempt++) {
      const rg = new Int32Array(N).fill(-1);
      let R = 0, bad = false;
      const order = rng.shuffle(cells.slice());
      for (;;) {
        // orphans (whose domino-mate went elsewhere) first
        let s = order.find((x) => rg[x] < 0 && rg[mate[x]] >= 0);
        const orphan = s != null;
        if (s == null) s = order.find((x) => rg[x] < 0);
        if (s == null) break;
        // cells of other dominoes reachable through unclaimed white cells
        let partner = -1;
        const path = [];
        if (orphan || rng() < split) {
          const reach = orphan ? 6 : 3;
          const prev = new Int32Array(N).fill(-2), dist = new Int32Array(N).fill(-1);
          prev[s] = -1; dist[s] = 0;
          const q = [s], found = [];
          for (let t = 0; t < q.length; t++) {
            const x = q[t];
            if (dist[x] >= reach) continue;
            for (const j of nb[x]) {
              if (prev[j] !== -2) continue;
              if (sh[j]) { if (rg[j] < 0 && j !== mate[s] && x !== s) { prev[j] = x; found.push(j); } continue; }
              if (rg[j] >= 0) continue;
              prev[j] = x; dist[j] = dist[x] + 1; q.push(j);
            }
          }
          if (found.length) {
            partner = found[rng.int(found.length)];
            for (let x = prev[partner]; x !== s; x = prev[x]) path.push(x);
          }
        }
        if (partner < 0) {
          partner = mate[s];
          if (rg[partner] >= 0) { bad = true; break; }
        }
        rg[s] = R; rg[partner] = R;
        for (const x of path) rg[x] = R;
        R++;
      }
      if (!bad) reg = rg;
    }
    if (!reg) return fail(opts, 'pair');
    // a lone cell whose mate went elsewhere must find a region: pairing above guarantees two per region
    if (!growRegions(reg, w, h, rng, 0.55)) return fail(opts, 'grow');
    const regionRows = (rg) => toRows(tidyRegions(rg), w, (x) => REG.charAt(x));
    const level = opts.level || 3, lv = Math.min(level, 3);
    const openAt = (rg, l) => {
      const g = L.nrSolveTo(regPrep(regionRows(rg)), l);
      return g.open < 0 ? 1e9 : g.open;
    };
    const scoreOf = (rg) => {
      const g = L.nrSolveTo(regPrep(regionRows(rg)), lv);
      if (g.open < 0) return 1e9;
      const hot = [];
      for (let i = 0; i < N; i++) if (g.v[i] < 0) hot.push(i);
      return { s: g.open, hot };
    };
    let out = nudgeRegions(reg, w, h, rng, () => true, scoreOf, opts.maxIter || 3000, deadline);
    if (!out) return fail(opts, 'nudge');
    if (opts.harden && lv >= 2) out = hardenRegions(out, w, h, rng, () => true, (rg) => openAt(rg, lv) === 0, (rg) => openAt(rg, lv - 1), opts.harden, deadline);
    const regions = regionRows(out), P = regPrep(regions);
    const g = L.nrSolveTo(P, opts.level || 4);
    if (g.open) return fail(opts, 'level');
    const c = L.nrCount(P, null, 2);
    if (c.count !== 1) return fail(opts, 'count');
    return { w, h, regions, sol: toRows(c.sol, w, (x) => (x === 1 ? '#' : '.')), grade: g, diff: L.nrDiff(w, h, g) };
  };

  /* =====================================================================
   *  LITS
   *  data: { kind: 'lits', regions: [...], sol: ['#..#', …] }
   *  one tetromino in every region; all shaded cells connected; no 2×2
   *  shaded; two identical tetrominoes (turns and mirror images count as
   *  identical) never touch along a side
   * ===================================================================== */

  // the 18 fixed tetrominoes of the four LITS shapes: [letter, [[r, c] ×4]]
  const TETRO = (function () {
    const base = { L: [[0, 0], [1, 0], [2, 0], [2, 1]], I: [[0, 0], [1, 0], [2, 0], [3, 0]], T: [[0, 0], [0, 1], [0, 2], [1, 1]], S: [[0, 1], [0, 2], [1, 0], [1, 1]] };
    const out = [], seen = new Set();
    for (const k of Object.keys(base)) {
      let cells = base[k];
      for (let f = 0; f < 2; f++) {
        for (let r = 0; r < 4; r++) {
          const mr = Math.min(...cells.map((p) => p[0])), mc = Math.min(...cells.map((p) => p[1]));
          const norm = cells.map((p) => [p[0] - mr, p[1] - mc]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
          const key = JSON.stringify(norm);
          if (!seen.has(key)) { seen.add(key); out.push([k, norm]); }
          cells = cells.map((p) => [p[1], -p[0]]);
        }
        cells = cells.map((p) => [p[0], -p[1]]);
      }
    }
    return out;
  })();
  L.TETRO = TETRO;
  const SHAPE_NAME = { L: 'L', I: 'I', T: 'T', S: 'S' };

  // the letter of four cells (or null if they are not an L, I, T or S)
  // four cells as a 4×4 bit mask after moving them to the corner
  const TMASK = new Map();
  TETRO.forEach(([k, t]) => { let m = 0; for (const [r, c] of t) m |= 1 << (r * 4 + c); TMASK.set(m, k); });
  function shapeOf(cells, w) {
    let mr = 99, mc = 99;
    for (const i of cells) { const r = Math.floor(i / w), c = i % w; if (r < mr) mr = r; if (c < mc) mc = c; }
    let m = 0;
    for (const i of cells) {
      const r = Math.floor(i / w) - mr, c = i % w - mc;
      if (r > 3 || c > 3) return null;
      m |= 1 << (r * 4 + c);
    }
    return TMASK.get(m) || null;
  }
  L.shapeOf = shapeOf;

  L.ltPrep = function (regions) {
    const P = regPrep(regions), w = P.w, h = P.h;
    P.pl = Array.from({ length: P.R }, () => []);
    for (const [k, t] of TETRO) {
      const th = Math.max(...t.map((p) => p[0])) + 1, tw = Math.max(...t.map((p) => p[1])) + 1;
      for (let r = 0; r + th <= h; r++) {
        for (let c = 0; c + tw <= w; c++) {
          const cells = t.map((p) => (r + p[0]) * w + c + p[1]);
          const g = P.reg[cells[0]];
          if (cells.every((i) => P.reg[i] === g)) P.pl[g].push({ cells: cells.sort((a, b) => a - b), shape: k });
        }
      }
    }
    // the 2×2 blocks each cell belongs to
    P.blocks = [];
    for (let r = 0; r + 1 < h; r++) for (let c = 0; c + 1 < w; c++) { const i = r * w + c; P.blocks.push([i, i + 1, i + w, i + w + 1]); }
    P.blocksOf = Array.from({ length: P.N }, () => []);
    P.blocks.forEach((b, k) => b.forEach((i) => P.blocksOf[i].push(k)));
    // for each placement: the 2×2 blocks it touches and its neighbours in other regions
    for (let k = 0; k < P.R; k++) {
      for (const p of P.pl[k]) {
        const bl = new Set(), nb = new Set();
        for (const i of p.cells) { for (const b of P.blocksOf[i]) bl.add(b); for (const j of P.nb[i]) if (P.reg[j] !== k) nb.add(j); }
        p.blocks = Array.from(bl);
        p.nbrs = Array.from(nb);
      }
    }
    return P;
  };

  // the letter of region k's tetromino when its four shaded cells are known, else null
  function ltDecided(P, v, k) {
    const sh = P.units[k].filter((i) => v[i] === 1);
    return sh.length === 4 ? shapeOf(sh, P.w) : null;
  }

  // can shaded cells still join up through cells that are not white?
  function ltJoinable(P, v) {
    let start = -1, total = 0;
    for (let i = 0; i < P.N; i++) if (v[i] === 1) { total++; if (start < 0) start = i; }
    if (total <= 1) return true;
    const seen = new Uint8Array(P.N), stack = [start];
    seen[start] = 1;
    let got = 1;
    while (stack.length) {
      const i = stack.pop();
      for (const j of P.nb[i]) if (!seen[j] && v[j] !== 0) { seen[j] = 1; if (v[j] === 1) got++; stack.push(j); }
    }
    return got === total;
  }

  /* The placements of region k that fit the board. check: 0 cells only,
   * 1 + no 2×2 and no identical neighbour, 2 + the shaded cells can still join. */
  // the letters of the regions whose four shaded cells are known
  function ltDecAll(P, v) {
    const dec = new Array(P.R).fill(null);
    for (let k = 0; k < P.R; k++) dec[k] = ltDecided(P, v, k);
    return dec;
  }
  function ltAlive(P, v, k, check, dec) {
    const u = P.units[k], reg = P.reg;
    const out = [];
    if (check >= 1 && !dec) dec = ltDecAll(P, v);
    let t = null;
    for (const p of P.pl[k]) {
      const pc = p.cells, a = pc[0], b = pc[1], c = pc[2], d = pc[3];
      if (v[a] === 0 || v[b] === 0 || v[c] === 0 || v[d] === 0) continue;
      let ok = true;
      for (const i of u) if (v[i] === 1 && i !== a && i !== b && i !== c && i !== d) { ok = false; break; }
      if (!ok) continue;
      if (check >= 1) {
        for (const bk of p.blocks) {
          const B = P.blocks[bk];
          let on = 0;
          for (const x of B) { if (x === a || x === b || x === c || x === d) on++; else if (reg[x] !== k && v[x] === 1) on++; }
          if (on === 4) { ok = false; break; }
        }
        if (!ok) continue;
        for (const j of p.nbrs) if (v[j] === 1 && dec[reg[j]] === p.shape) { ok = false; break; }
        if (!ok) continue;
        if (check >= 2) {
          if (!t) t = new Int8Array(v.length);
          t.set(v);
          for (const i of u) t[i] = 0;
          for (const i of pc) t[i] = 1;
          if (!ltJoinable(P, t)) continue;
        }
      }
      out.push(p);
    }
    return out;
  }
  L.ltAlive = ltAlive;

  // the plain rules until nothing changes; null or the contradiction met
  function ltProp(P, v, check) {
    if (check == null) check = 2;
    let changed = true;
    while (changed) {
      changed = false;
      for (const B of P.blocks) {
        let s = 0, o = -1, no = 0;
        for (const i of B) { if (v[i] === 1) s++; else if (v[i] < 0) { no++; o = i; } }
        if (s === 4) return { t: 'pool' };
        if (s === 3 && no === 1) { v[o] = 0; changed = true; }
      }
      const dec = check >= 1 ? ltDecAll(P, v) : null;
      for (let k = 0; k < P.R; k++) {
        if (P.units[k].every((i) => v[i] >= 0) && dec && dec[k]) continue;
        const al = ltAlive(P, v, k, check, dec);
        if (!al.length) return { t: 'region', k };
        for (const i of P.units[k]) {
          if (v[i] >= 0) continue;
          const inAll = al.every((p) => p.cells.includes(i)), inNone = !al.some((p) => p.cells.includes(i));
          if (inAll) { v[i] = 1; changed = true; } else if (inNone) { v[i] = 0; changed = true; }
        }
      }
      if (!ltJoinable(P, v)) return { t: 'split' };
    }
    return null;
  }
  L.ltProp = ltProp;

  L.ltValid = function (P, v) {
    for (let k = 0; k < P.R; k++) if (!ltDecided(P, v, k)) return false;
    for (const B of P.blocks) if (B.every((i) => v[i] === 1)) return false;
    for (let i = 0; i < P.N; i++) {
      if (v[i] !== 1) continue;
      for (const j of P.nb[i]) if (v[j] === 1 && P.reg[j] !== P.reg[i] && ltDecided(P, v, P.reg[i]) === ltDecided(P, v, P.reg[j])) return false;
    }
    const t = Int8Array.from(v, (x) => (x === 1 ? 1 : 0));
    return ltJoinable(P, t);
  };

  L.ltCount = function (P, v0, limit, nodeCap) {
    limit = limit || 2;
    nodeCap = nodeCap || 100000;
    let count = 0, sol = null, nodes = 0, aborted = false;
    const rec = (v) => {
      if (count >= limit || aborted) return;
      if (++nodes > nodeCap) { aborted = true; return; }
      if (ltProp(P, v, 1)) return;
      let best = -1, bl = null;
      for (let k = 0; k < P.R; k++) {
        if (ltDecided(P, v, k) && P.units[k].every((i) => v[i] >= 0)) continue;
        const al = ltAlive(P, v, k, 1);
        if (!bl || al.length < bl.length) { bl = al; best = k; }
      }
      if (best < 0) {
        const t = Int8Array.from(v, (x) => (x === 1 ? 1 : 0));
        if (L.ltValid(P, t)) { count++; sol = t; }
        return;
      }
      for (const p of bl) {
        const v2 = Int8Array.from(v);
        for (const i of P.units[best]) v2[i] = 0;
        for (const i of p.cells) v2[i] = 1;
        rec(v2);
        if (count >= limit || aborted) return;
      }
    };
    rec(v0 ? Int8Array.from(v0) : new Int8Array(P.N).fill(-1));
    return { count, sol, nodes, aborted };
  };

  // a cell whose whiteness would cut the shaded cells apart must be shaded
  function ltCutCells(P, v) {
    const out = [];
    for (let x = 0; x < P.N; x++) {
      if (v[x] >= 0) continue;
      const t = Int8Array.from(v);
      t[x] = 0;
      if (!ltJoinable(P, t)) out.push(x);
    }
    return out;
  }

  /* The next step. Levels: 1 what every tetromino of a region covers (or
   * cannot), and the 2×2 rule; 2 the same without 2×2 blocks or identical
   * neighbours; 3 keeping the shaded cells joinable; 4 "suppose…"; 5 long. */
  L.ltStep = function (P, v0, maxLevel, sol) {
    maxLevel = maxLevel || 5;
    const v = Int8Array.from(v0), w = P.w;
    for (const B of P.blocks) {
      let s = 0, o = -1, no = 0;
      for (const i of B) { if (v[i] === 1) s++; else if (v[i] < 0) { no++; o = i; } }
      if (s === 3 && no === 1) return { level: 1, set: [[o, 0]], focus: B.filter((i) => i !== o), text: 'Three cells of this 2×2 square are shaded. The fourth would make a solid 2×2 block, which is not allowed: it stays white.' };
    }
    const why = [
      'Whatever tetromino the highlighted region holds',
      'The highlighted region\'s tetromino may not make a 2×2 block or touch an identical tetromino in the next region, so',
      'The highlighted region\'s tetromino must also leave the shaded cells able to join up (and make no 2×2 block, and not touch its twin), so'
    ];
    for (let check = 0; check <= 2; check++) {
      const level = check + 1;
      if (level > maxLevel) break;
      let best = null;
      for (let k = 0; k < P.R; k++) {
        if (P.units[k].every((i) => v[i] >= 0)) continue;
        const al = ltAlive(P, v, k, check);
        if (!al.length) continue;
        const set = [];
        for (const i of P.units[k]) {
          if (v[i] >= 0) continue;
          if (al.every((p) => p.cells.includes(i))) set.push([i, 1]);
          else if (!al.some((p) => p.cells.includes(i))) set.push([i, 0]);
        }
        if (!set.length) continue;
        const score = al.length * 10 - set.length;
        if (!best || score < best.score) best = { k, al, set, score };
      }
      if (best) {
        const n = best.al.length, sh = best.set.filter((x) => x[1] === 1).length, wh = best.set.length - sh;
        const shapes = Array.from(new Set(best.al.map((p) => SHAPE_NAME[p.shape])));
        let text;
        if (check === 0 && P.units[best.k].length === 4) text = 'The highlighted region has exactly four cells, so they are its tetromino: shade them all.';
        else {
          const lead = check === 0 ? why[0] + ' (' + (n === 1 ? 'there is only one way to fit one' : word(n) + ' ways to fit one') + ')' : why[check] + ' ' + (n === 1 ? 'only one way is left' : word(n) + ' ways are left') + (shapes.length === 1 ? ' (all ' + shapes[0] + '-shaped)' : '');
          const parts = [];
          if (sh) parts.push((n === 1 ? 'it covers ' : 'every one covers ') + (sh === 1 ? 'the outlined cell' : word(sh) + ' outlined cells'));
          if (wh) parts.push((n === 1 ? 'it leaves ' : 'none of them uses ') + (wh === 1 ? 'the dotted cell' : 'the ' + word(wh) + ' dotted cells') + (n === 1 ? ' white' : ''));
          text = lead + (check === 0 ? ', ' : ': ') + parts.join(', and ') + '.';
        }
        return { level, set: best.set, focus: P.units[best.k], text };
      }
    }
    if (maxLevel < 3) return null;
    const cuts = ltCutCells(P, v);
    if (cuts.length) return { level: 3, set: [[cuts[0], 1]], focus: [], zone: [cuts[0]], text: 'All shaded cells must join up. If the cell at ' + cellName(cuts[0], w) + ' were white, the shaded cells could no longer reach each other: it is shaded.' };
    if (maxLevel < 4) return null;
    for (let i = 0; i < P.N; i++) {
      if (v[i] >= 0) continue;
      for (const val of [1, 0]) {
        const t = Int8Array.from(v);
        t[i] = val;
        const c = ltProp(P, t, 2);
        if (!c) continue;
        const reason = c.t === 'pool' ? 'a 2×2 block would appear' : c.t === 'split' ? 'the shaded cells would be cut apart' : 'a region would have no room left for its tetromino';
        return { level: 4, set: [[i, 1 - val]], focus: c.k != null ? P.units[c.k] : [], zone: [i], text: 'Suppose the cell at ' + cellName(i, w) + ' were ' + (val ? 'shaded' : 'white') + '. Follow the rules from there and ' + reason + '. So it is ' + (val ? 'white' : 'shaded') + '.' };
      }
    }
    if (maxLevel < 5 || !sol) return null;
    for (let i = 0; i < P.N; i++) if (v[i] < 0 && sol[i] === 1) return { level: 5, set: [[i, 1]], focus: [], text: 'This needs a long chain of reasoning. The cell at ' + cellName(i, w) + ' is shaded — can you see why?' };
    return null;
  };

  L.ltSolveTo = function (P, level, v0) {
    const v = v0 ? Int8Array.from(v0) : new Int8Array(P.N).fill(-1);
    const count = [0, 0, 0, 0, 0, 0];
    for (let guard = 0; guard < 500; guard++) {
      let got = false;
      for (let check = 0; check <= Math.min(2, level - 1) && !got; check++) {
        for (const B of P.blocks) {
          let s = 0, o = -1, no = 0;
          for (const i of B) { if (v[i] === 1) s++; else if (v[i] < 0) { no++; o = i; } }
          if (s === 4) return { open: -1, count, v };
          if (s === 3 && no === 1) { v[o] = 0; got = true; }
        }
        const dec = check >= 1 ? ltDecAll(P, v) : null;
        for (let k = 0; k < P.R; k++) {
          if (P.units[k].every((i) => v[i] >= 0)) continue;
          const al = ltAlive(P, v, k, check, dec);
          if (!al.length) return { open: -1, count, v };
          for (const i of P.units[k]) {
            if (v[i] >= 0) continue;
            if (al.every((p) => p.cells.includes(i))) { v[i] = 1; got = true; }
            else if (!al.some((p) => p.cells.includes(i))) { v[i] = 0; got = true; }
          }
        }
        if (got) count[check + 1]++;
      }
      if (!got && level >= 3) {
        const cuts = ltCutCells(P, v);
        if (cuts.length) { cuts.forEach((i) => { v[i] = 1; }); got = true; count[3]++; }
      }
      if (!got && level >= 4) {
        for (let i = 0; i < P.N && !got; i++) {
          if (v[i] >= 0) continue;
          for (const val of [1, 0]) {
            const t = Int8Array.from(v);
            t[i] = val;
            if (ltProp(P, t, 2)) { v[i] = 1 - val; got = true; break; }
          }
        }
        if (got) count[4]++;
      }
      const open = openCount(v);
      if (!open) return L.ltValid(P, v) ? { open: 0, count, v, top: topOf(count) } : { open: -1, count, v };
      if (!got) return { open, count, v, top: topOf(count) };
    }
    return { open: -1, count, v };
  };

  L.ltDiff = (w, h, g) => gradeOf(w * h, g);

  /* A random LITS: a connected chain of tetrominoes (no 2×2, no identical
   * neighbours), a region grown round each, then cells moved between
   * regions until logic of the level finds the one answer. */
  L.ltMake = function (w, h, rng, opts) {
    opts = opts || {};
    const N = w * h, nb = nbList(w, h, null, 4);
    const t0 = now(), deadline = opts.budget ? t0 + opts.budget : 0;
    const owner = new Int32Array(N).fill(-1), shapes = [];
    const fill = opts.fill || 0.6;
    let shaded = 0;
    const fits = (cells, letter) => {
      for (const i of cells) if (owner[i] >= 0) return false;
      const t = new Set(cells);
      const on = (i) => owner[i] >= 0 || t.has(i);
      for (const i of cells) {
        const r = Math.floor(i / w), c = i % w;
        for (const [dr, dc] of [[0, 0], [0, -1], [-1, 0], [-1, -1]]) {
          const rr = r + dr, cc = c + dc;
          if (rr < 0 || cc < 0 || rr + 1 >= h || cc + 1 >= w) continue;
          const a = rr * w + cc;
          if (on(a) && on(a + 1) && on(a + w) && on(a + w + 1)) return false;
        }
        for (const j of nb[i]) if (owner[j] >= 0 && shapes[owner[j]] === letter) return false;
      }
      return true;
    };
    const place = (cells, letter) => { const k = shapes.length; shapes.push(letter); for (const i of cells) owner[i] = k; shaded += 4; };
    const at = (t, r, c) => {
      const cells = [];
      for (const [dr, dc] of t) { const rr = r + dr, cc = c + dc; if (rr < 0 || cc < 0 || rr >= h || cc >= w) return null; cells.push(rr * w + cc); }
      return cells;
    };
    for (let guard = 0; guard < 60 && !shapes.length; guard++) {
      const [k, t] = TETRO[rng.int(TETRO.length)];
      const cells = at(t, rng.int(h), rng.int(w));
      if (cells && fits(cells, k)) place(cells, k);
    }
    let fails = 0;
    while (shaded < fill * N && fails < 400) {
      // a free cell next to the chain, and a tetromino through it
      const edge = [];
      for (let i = 0; i < N; i++) if (owner[i] < 0 && nb[i].some((j) => owner[j] >= 0)) edge.push(i);
      if (!edge.length) break;
      const e = edge[rng.int(edge.length)];
      const [k, t] = TETRO[rng.int(TETRO.length)];
      const [pr, pc] = t[rng.int(4)];
      const cells = at(t, Math.floor(e / w) - pr, e % w - pc);
      if (cells && fits(cells, k)) { place(cells, k); fails = 0; } else fails++;
    }
    if (shaded < (fill - 0.12) * N) return fail(opts, 'fill');
    const reg = Int32Array.from(owner);
    if (!growRegions(reg, w, h, rng, 0.5)) return fail(opts, 'grow');
    const regionRows = (rg) => toRows(tidyRegions(rg), w, (x) => REG.charAt(x));
    const lv = 3;
    const openAt = (rg, l) => { const g = L.ltSolveTo(L.ltPrep(regionRows(rg)), l); return g.open < 0 ? 1e9 : g.open; };
    const anyMove = opts.anyMove !== false;
    const scoreOf = (rg) => {
      const P = L.ltPrep(regionRows(rg));
      const g = L.ltSolveTo(P, lv);
      if (g.open < 0) return 1e9;
      // with shaded cells moving, keep only layouts that still have an answer
      if (anyMove && g.open) { const c = L.ltCount(P, g.v, 1, 4000); if (!c.count && !c.aborted) return 1e9; }
      const hot = [];
      for (let i = 0; i < N; i++) if (g.v[i] < 0) hot.push(i);
      return { s: g.open, hot };
    };
    // white cells move (so the planted tetrominoes stay an answer), or any cell
    const white = anyMove ? () => true : (i) => owner[i] < 0;
    let out = nudgeRegions(reg, w, h, rng, white, scoreOf, opts.maxIter || 2000, deadline);
    if (!out) return fail(opts, 'nudge');
    // then easier (soften) or harder (harden): what logic one level down leaves open
    if (opts.soften) out = hardenRegions(out, w, h, rng, white, (rg) => openAt(rg, 3) === 0, (rg) => -openAt(rg, 2), opts.soften, deadline);
    if (opts.harden) out = hardenRegions(out, w, h, rng, white, (rg) => openAt(rg, 3) === 0, (rg) => openAt(rg, 2), opts.harden, deadline);
    const regions = regionRows(out), P = L.ltPrep(regions);
    const g = L.ltSolveTo(P, 4);
    if (g.open) return fail(opts, 'level');
    const c = L.ltCount(P, null, 2);
    if (c.count !== 1) return fail(opts, 'count');
    return { w, h, regions, sol: toRows(c.sol, w, (x) => (x === 1 ? '#' : '.')), grade: g, diff: L.ltDiff(w, h, g) };
  };

  /* =====================================================================
   *  HEYAWAKE
   *  data: { kind: 'heyawake', w, h, rooms: [[r, c, rows, cols, n], …], sol: [...] }
   *  rooms are rectangles; n = shaded cells in the room (-1: no number).
   *  Shaded cells never touch side by side; the white cells are all
   *  connected; no straight line of white cells crosses two room borders.
   * ===================================================================== */

  L.hyPrep = function (d) {
    const w = d.w, h = d.h, N = w * h;
    const reg = new Int32Array(N).fill(-1);
    d.rooms.forEach((rm, k) => {
      for (let r = rm[0]; r < rm[0] + rm[2]; r++) for (let c = rm[1]; c < rm[1] + rm[3]; c++) if (r < h && c < w) reg[r * w + c] = k;
    });
    const R = d.rooms.length;
    const units = Array.from({ length: R }, () => []);
    for (let i = 0; i < N; i++) if (reg[i] >= 0) units[reg[i]].push(i);
    const clue = d.rooms.map((rm) => (rm[4] == null ? -1 : rm[4]));
    // straight lines of cells that cross two room borders: at least one must be shaded
    const segs = [];
    const lineSegs = (cells) => {
      const runs = [];
      for (const i of cells) { if (runs.length && reg[runs[runs.length - 1][0]] === reg[i]) runs[runs.length - 1].push(i); else runs.push([i]); }
      for (let t = 0; t + 2 < runs.length; t++) segs.push([runs[t][runs[t].length - 1]].concat(runs[t + 1], [runs[t + 2][0]]));
    };
    for (let r = 0; r < h; r++) { const a = []; for (let c = 0; c < w; c++) a.push(r * w + c); lineSegs(a); }
    for (let c = 0; c < w; c++) { const a = []; for (let r = 0; r < h; r++) a.push(r * w + c); lineSegs(a); }
    const segsOf = Array.from({ length: N }, () => []);
    segs.forEach((s, k) => s.forEach((i) => segsOf[i].push(k)));
    const nb = nbList(w, h, null, 4);
    return { w, h, N, R, reg, units, clue, segs, segsOf, nb, rooms: d.rooms };
  };

  // is every cell that is not shaded connected (through cells that are not shaded)?
  function hyWhiteOk(P, v) {
    let start = -1, total = 0;
    for (let i = 0; i < P.N; i++) if (v[i] !== 1) { total++; if (start < 0) start = i; }
    if (!total) return false;
    const seen = new Uint8Array(P.N), stack = [start];
    seen[start] = 1;
    let got = 1;
    while (stack.length) {
      const i = stack.pop();
      for (const j of P.nb[i]) if (!seen[j] && v[j] !== 1) { seen[j] = 1; got++; stack.push(j); }
    }
    return got === total;
  }

  function hyProp(P, v) {
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < P.N; i++) {
        if (v[i] === 1) {
          for (const j of P.nb[i]) { if (v[j] === 1) return { t: 'touch', c: i }; if (v[j] < 0) { v[j] = 0; changed = true; } }
        } else if (v[i] === 0) {
          // a white cell needs a way out
          let out = 0, o = -1;
          for (const j of P.nb[i]) if (v[j] !== 1) { out++; o = j; }
          if (!out && P.N > 1) return { t: 'shut', c: i };
          if (out === 1 && v[o] < 0) { v[o] = 0; changed = true; }
        }
      }
      for (let k = 0; k < P.R; k++) {
        const n = P.clue[k];
        if (n < 0) continue;
        let s = 0, o = 0;
        for (const i of P.units[k]) { if (v[i] === 1) s++; else if (v[i] < 0) o++; }
        if (s > n || s + o < n) return { t: 'room', k };
        if (!o) continue;
        if (s === n) { for (const i of P.units[k]) if (v[i] < 0) v[i] = 0; changed = true; }
        else if (s + o === n) { for (const i of P.units[k]) if (v[i] < 0) v[i] = 1; changed = true; }
      }
      for (let k = 0; k < P.segs.length; k++) {
        let s = 0, o = 0, oc = -1;
        for (const i of P.segs[k]) { if (v[i] === 1) s++; else if (v[i] < 0) { o++; oc = i; } }
        if (s) continue;
        if (!o) return { t: 'line', k };
        if (o === 1) { v[oc] = 1; changed = true; }
      }
      if (!hyWhiteOk(P, v)) return { t: 'split' };
    }
    return null;
  }
  L.hyProp = hyProp;

  L.hyValid = function (P, v) {
    for (let i = 0; i < P.N; i++) if (v[i] === 1) for (const j of P.nb[i]) if (v[j] === 1) return false;
    for (let k = 0; k < P.R; k++) { if (P.clue[k] < 0) continue; let s = 0; for (const i of P.units[k]) if (v[i] === 1) s++; if (s !== P.clue[k]) return false; }
    for (const sg of P.segs) if (!sg.some((i) => v[i] === 1)) return false;
    return hyWhiteOk(P, v);
  };

  L.hyCount = function (P, v0, limit, nodeCap) {
    limit = limit || 2;
    nodeCap = nodeCap || 150000;
    let count = 0, sol = null, nodes = 0, aborted = false;
    const rec = (v) => {
      if (count >= limit || aborted) return;
      if (++nodes > nodeCap) { aborted = true; return; }
      if (hyProp(P, v)) return;
      // branch in the tightest numbered room, else on a cell of the tightest line
      let best = -1, bs = 1e9;
      for (let k = 0; k < P.R; k++) {
        if (P.clue[k] < 0) continue;
        let s = 0, o = 0, first = -1;
        for (const i of P.units[k]) { if (v[i] === 1) s++; else if (v[i] < 0) { o++; if (first < 0) first = i; } }
        if (o && o < bs) { bs = o; best = first; }
      }
      if (best < 0) for (const sg of P.segs) {
        if (sg.some((i) => v[i] === 1)) continue;
        const o = sg.filter((i) => v[i] < 0);
        if (o.length && o.length < bs) { bs = o.length; best = o[0]; }
      }
      if (best < 0) for (let i = 0; i < P.N; i++) if (v[i] < 0) { best = i; break; }
      if (best < 0) {
        if (L.hyValid(P, v)) { count++; sol = Int8Array.from(v); }
        return;
      }
      for (const val of [1, 0]) {
        const v2 = Int8Array.from(v);
        v2[best] = val;
        rec(v2);
        if (count >= limit || aborted) return;
      }
    };
    rec(v0 ? Int8Array.from(v0) : new Int8Array(P.N).fill(-1));
    // cells no rule touches are white in the answer
    if (sol) for (let i = 0; i < P.N; i++) if (sol[i] < 0) sol[i] = 0;
    return { count, sol, nodes, aborted };
  };

  // ways to shade `need` more cells of a room among its free cells, none touching (each other or a shaded cell)
  function hyPlacements(P, v, k, cap, deep) {
    const open = P.units[k].filter((i) => v[i] < 0 && !P.nb[i].some((j) => v[j] === 1));
    let s = 0;
    for (const i of P.units[k]) if (v[i] === 1) s++;
    const need = P.clue[k] - s, out = [], cur = [];
    if (P.clue[k] < 0 || need <= 0) return { need, open, out };
    const dfs = (j) => {
      if (out.length >= cap) return;
      if (cur.length === need) { out.push(cur.slice()); return; }
      if (open.length - j < need - cur.length) return;
      for (let x = j; x < open.length; x++) {
        if (cur.some((y) => P.nb[y].includes(open[x]))) continue;
        cur.push(open[x]);
        dfs(x + 1);
        cur.pop();
      }
    };
    dfs(0);
    if (deep && out.length < cap) {
      // follow each way through the plain rules; drop those that break one
      const keep = out.filter((pick) => {
        const t = Int8Array.from(v);
        for (const i of P.units[k]) if (t[i] < 0) t[i] = pick.includes(i) ? 1 : 0;
        return !hyProp(P, t);
      });
      return { need, open, out: keep };
    }
    return { need, open, out };
  }

  // cells whose shading would cut white cells apart
  function hyCutCells(P, v) {
    const out = [];
    for (let x = 0; x < P.N; x++) {
      if (v[x] >= 0) continue;
      if (P.nb[x].some((j) => v[j] === 1)) continue;
      const t = Int8Array.from(v);
      t[x] = 1;
      if (!hyWhiteOk(P, t)) out.push(x);
    }
    return out;
  }

  /* The next step. Levels: 1 the plain rules (neighbours of shaded cells,
   * full rooms, a line through three rooms, a white cell's last way out),
   * 2 every way to shade a room, 3 not cutting the white cells apart,
   * 4 "suppose…", 5 a long chain. */
  L.hyStep = function (P, v0, maxLevel, sol) {
    maxLevel = maxLevel || 5;
    const v = Int8Array.from(v0), w = P.w;
    for (let i = 0; i < P.N; i++) {
      if (v[i] !== 1) continue;
      const set = P.nb[i].filter((j) => v[j] < 0).map((j) => [j, 0]);
      if (set.length) return { level: 1, set, focus: [i], text: 'Shaded cells never touch side by side, so the cells next to the shaded one at ' + cellName(i, w) + ' are white.' };
    }
    for (let k = 0; k < P.R; k++) {
      const n = P.clue[k];
      if (n < 0) continue;
      let s = 0;
      const open = [];
      for (const i of P.units[k]) { if (v[i] === 1) s++; else if (v[i] < 0) open.push(i); }
      if (!open.length) continue;
      if (s === n) return { level: 1, set: open.map((i) => [i, 0]), focus: P.units[k], text: n === 0 ? 'The room with **0** has no shaded cells: all of it is white.' : 'The highlighted room already has its **' + n + '** shaded cell' + (n === 1 ? '' : 's') + ': the rest of it is white.' };
      if (s + open.length === n) return { level: 1, set: open.map((i) => [i, 1]), focus: P.units[k], text: P.units[k].length === n ? 'The highlighted room has just ' + word(n) + ' cell' + (n === 1 ? '' : 's') + ', and its number asks for ' + word(n) + ' shaded: shade ' + (n === 1 ? 'it' : 'them all') + '.' : 'The highlighted room needs ' + word(n - s) + ' more shaded cell' + (n - s === 1 ? '' : 's') + ' and has just that many free: shade ' + (open.length === 1 ? 'it' : 'them') + '.' };
    }
    for (const sg of P.segs) {
      let s = 0;
      const o = [];
      for (const i of sg) { if (v[i] === 1) s++; else if (v[i] < 0) o.push(i); }
      if (!s && o.length === 1) return { level: 1, set: [[o[0], 1]], focus: sg, text: 'A straight line of white cells may not cross two room borders. The highlighted cells run from one room, right across the next, into a third, so one of them must be shaded — and only one is still free.' };
    }
    for (let i = 0; i < P.N; i++) {
      if (v[i] !== 0) continue;
      const out = P.nb[i].filter((j) => v[j] !== 1);
      if (out.length === 1 && v[out[0]] < 0) return { level: 1, set: [[out[0], 0]], focus: [i], text: 'All the white cells must be connected. The white cell at ' + cellName(i, w) + ' has only one way out, so that neighbour is white too.' };
    }
    if (maxLevel < 2) return null;
    let best = null;
    for (let k = 0; k < P.R; k++) {
      const pl = hyPlacements(P, v, k, 300);
      if (pl.need <= 0 || !pl.out.length || pl.out.length >= 300) continue;
      const all = P.units[k].filter((i) => v[i] < 0);
      const shade = all.filter((i) => pl.out.every((p) => p.includes(i)));
      const white = all.filter((i) => !pl.out.some((p) => p.includes(i)));
      if (!shade.length && !white.length) continue;
      const set = shade.length ? shade.map((i) => [i, 1]) : white.map((i) => [i, 0]);
      const score = pl.out.length * 10 - set.length;
      if (!best || score < best.score) best = { k, pl, set, score, shade: shade.length > 0 };
    }
    if (best) {
      const n = best.pl.out.length, need = best.pl.need;
      const cells = best.set.length === 1 ? 'the cell at ' + cellName(best.set[0][0], w) : word(best.set.length) + ' cells (outlined)';
      const text = 'The highlighted room needs ' + word(need) + ' more shaded cell' + (need === 1 ? '' : 's') + ', never touching each other or another shaded cell. There ' + (n === 1 ? 'is only one way' : 'are ' + word(n) + ' ways') + ', and ' + (best.shade ? (n === 1 ? 'it shades ' : 'every one shades ') + cells + '.' : (n === 1 ? 'it leaves ' : 'none of them uses ') + cells + (n === 1 ? ' white.' : ': white.'));
      return { level: 2, set: best.set, focus: P.units[best.k], text };
    }
    if (maxLevel < 3) return null;
    const cuts = hyCutCells(P, v);
    if (cuts.length) return { level: 3, set: [[cuts[0], 0]], focus: [], zone: [cuts[0]], text: 'All the white cells must stay connected. Shading the cell at ' + cellName(cuts[0], w) + ' would wall some of them off from the rest, so it is white.' };
    best = null;
    for (let k = 0; k < P.R; k++) {
      const pl = hyPlacements(P, v, k, 120, true);
      if (pl.need <= 0 || !pl.out.length || pl.out.length >= 120) continue;
      const all = P.units[k].filter((i) => v[i] < 0);
      const shade = all.filter((i) => pl.out.every((p) => p.includes(i)));
      const white = all.filter((i) => !pl.out.some((p) => p.includes(i)));
      if (!shade.length && !white.length) continue;
      const set = shade.length ? shade.map((i) => [i, 1]) : white.map((i) => [i, 0]);
      const score = pl.out.length * 10 - set.length;
      if (!best || score < best.score) best = { k, pl, set, score, shade: shade.length > 0 };
    }
    if (best) {
      const n = best.pl.out.length, need = best.pl.need;
      const cells = best.set.length === 1 ? 'the cell at ' + cellName(best.set[0][0], w) : word(best.set.length) + ' cells (outlined)';
      const text = 'Try each way to shade the ' + word(need) + ' missing cell' + (need === 1 ? '' : 's') + ' of the highlighted room, and follow the rules a few steps on from each: the ways that end in trouble (touching shaded cells, a line through three rooms, cut-off white cells, a wrong count next door) drop out. ' + (n === 1 ? 'One way survives, and it ' + (best.shade ? 'shades ' : 'leaves ') : 'The ' + word(n) + ' ways left all ' + (best.shade ? 'shade ' : 'leave ')) + cells + (best.shade ? '.' : ' white.');
      return { level: 3, set: best.set, focus: P.units[best.k], text };
    }
    if (maxLevel < 4) return null;
    for (let i = 0; i < P.N; i++) {
      if (v[i] >= 0) continue;
      for (const val of [1, 0]) {
        const t = Int8Array.from(v);
        t[i] = val;
        const c = hyProp(P, t);
        if (!c) continue;
        const reason = c.t === 'touch' ? 'two shaded cells would have to touch' : c.t === 'room' ? 'a room would get the wrong number of shaded cells' : c.t === 'line' ? 'a white line would cross two room borders' : 'the white cells would be cut apart';
        return { level: 4, set: [[i, 1 - val]], focus: c.k != null && c.t === 'room' ? P.units[c.k] : c.k != null ? P.segs[c.k] : [], zone: [i], text: 'Suppose the cell at ' + cellName(i, w) + ' were ' + (val ? 'shaded' : 'white') + '. Follow the rules from there and ' + reason + '. So it is ' + (val ? 'white' : 'shaded') + '.' };
      }
    }
    if (maxLevel < 5 || !sol) return null;
    for (let i = 0; i < P.N; i++) if (v[i] < 0 && sol[i] === 1) return { level: 5, set: [[i, 1]], focus: [], text: 'This needs a long chain of reasoning. The cell at ' + cellName(i, w) + ' is shaded — can you see why?' };
    return null;
  };

  L.hySolveTo = function (P, level, v0) {
    const v = v0 ? Int8Array.from(v0) : new Int8Array(P.N).fill(-1);
    const count = [0, 0, 0, 0, 0, 0];
    for (let guard = 0; guard < 500; guard++) {
      if (hyProp(P, v)) return { open: -1, count, v };
      count[1]++;
      let open = openCount(v);
      if (!open || level < 2) break;
      let got = false;
      for (let k = 0; k < P.R; k++) {
        const pl = hyPlacements(P, v, k, 300);
        if (pl.need <= 0 || !pl.out.length || pl.out.length >= 300) continue;
        for (const i of P.units[k]) {
          if (v[i] >= 0) continue;
          if (pl.out.every((p) => p.includes(i))) { v[i] = 1; got = true; }
          else if (!pl.out.some((p) => p.includes(i))) { v[i] = 0; got = true; }
        }
      }
      if (got) { count[2]++; continue; }
      if (level >= 3) {
        const cuts = hyCutCells(P, v);
        if (cuts.length) { cuts.forEach((i) => { v[i] = 0; }); count[3]++; continue; }
        for (let k = 0; k < P.R; k++) {
          const pl = hyPlacements(P, v, k, 120, true);
          if (pl.need <= 0 || !pl.out.length || pl.out.length >= 120) continue;
          for (const i of P.units[k]) {
            if (v[i] >= 0) continue;
            if (pl.out.every((p) => p.includes(i))) { v[i] = 1; got = true; }
            else if (!pl.out.some((p) => p.includes(i))) { v[i] = 0; got = true; }
          }
        }
        if (got) { count[3]++; continue; }
      }
      if (level >= 4) {
        for (let i = 0; i < P.N && !got; i++) {
          if (v[i] >= 0) continue;
          for (const val of [1, 0]) {
            const t = Int8Array.from(v);
            t[i] = val;
            if (hyProp(P, t)) { v[i] = 1 - val; got = true; break; }
          }
        }
        if (got) { count[4]++; continue; }
      }
      break;
    }
    // cells no rule can shade (away from numbers and lines) are white
    const open = openCount(v);
    return { open, count, v, top: topOf(count) };
  };

  L.hyDiff = (w, h, g) => gradeOf(w * h, g);

  // random rectangular rooms: split rectangles until small
  function hyRooms(w, h, rng, maxArea) {
    const out = [], stack = [[0, 0, h, w]];
    while (stack.length) {
      const [r, c, hh, ww] = stack.pop();
      const area = hh * ww;
      const stop = area <= 2 || (area <= maxArea && rng() < (area <= maxArea / 2 ? 0.75 : 0.35)) || (hh === 1 && ww <= 3) || (ww === 1 && hh <= 3);
      if (stop) { out.push([r, c, hh, ww]); continue; }
      const horiz = hh > ww ? true : ww > hh ? false : rng() < 0.5;
      if (horiz && hh >= 2) { const k = 1 + rng.int(hh - 1); stack.push([r, c, k, ww], [r + k, c, hh - k, ww]); }
      else if (ww >= 2) { const k = 1 + rng.int(ww - 1); stack.push([r, c, hh, k], [r, c + k, hh, ww - k]); }
      else out.push([r, c, hh, ww]);
    }
    return out;
  }

  /* A random Heyawake: rectangular rooms, a random legal shading, every room
   * numbered; then numbers taken away while logic of the level still
   * finishes it. If even all numbers are not enough, shaded cells move. */
  L.hyMake = function (w, h, rng, opts) {
    opts = opts || {};
    const N = w * h, level = opts.level || 3;
    const t0 = now(), deadline = opts.budget ? t0 + opts.budget : 0;
    const rooms = hyRooms(w, h, rng, opts.maxArea || 8);
    const d = { w, h, rooms: rooms.map((rm) => rm.concat([-1])) };
    const P = L.hyPrep(d);
    const sh = new Int8Array(N);
    const canShade = (i) => !sh[i] && P.nb[i].every((j) => !sh[j]) && (() => { sh[i] = 1; const ok = hyWhiteOk(P, sh); sh[i] = 0; return ok; })();
    // every line through three rooms needs a shaded cell: shade one (moving a neighbour out of the way if need be)
    for (let guard = 0; guard < 400; guard++) {
      const bad = P.segs.filter((sg) => !sg.some((i) => sh[i]));
      if (!bad.length) break;
      const sg = bad[rng.int(bad.length)];
      let c = rng.shuffle(sg.slice()).find(canShade);
      if (c == null) {
        c = sg[rng.int(sg.length)];
        for (const j of P.nb[c]) sh[j] = 0;
        if (canShade(c)) sh[c] = 1;
      } else sh[c] = 1;
    }
    if (P.segs.some((sg) => !sg.some((i) => sh[i]))) return fail(opts, 'line');
    // then some more shading, as long as every rule still holds
    const dens = opts.density == null ? 0.35 : opts.density;
    for (const i of rng.shuffle(Array.from({ length: N }, (_, k) => k))) if (rng() < dens && canShade(i)) sh[i] = 1;
    if (P.segs.some((sg) => !sg.some((i) => sh[i]))) return fail(opts, 'line');
    const setClues = () => { P.units.forEach((u, k) => { let s = 0; for (const i of u) s += sh[i]; P.clue[k] = s; }); };
    setClues();
    // with every room numbered, logic must finish; else nudge the shading
    const openNow = () => { const g = L.hySolveTo(P, level); return g.open < 0 ? 1e9 : g.open; };
    let open = openNow();
    for (let guard = 0; open && guard < 300; guard++) {
      if (deadline && now() > deadline) return fail(opts, 'time');
      const i = rng.int(N);
      const was = sh[i];
      if (was) sh[i] = 0; else if (canShade(i)) sh[i] = 1; else continue;
      if (P.segs.some((sg) => !sg.some((x) => sh[x])) || !hyWhiteOk(P, sh)) { sh[i] = was; continue; }
      setClues();
      const o2 = openNow();
      if (o2 <= open) open = o2; else { sh[i] = was; setClues(); }
    }
    if (open) return fail(opts, 'full');
    // take numbers away
    for (const k of rng.shuffle(Array.from({ length: P.R }, (_, x) => x))) {
      if (deadline && now() > deadline) return fail(opts, 'time');
      const keep = P.clue[k];
      P.clue[k] = -1;
      if (L.hySolveTo(P, level).open !== 0) P.clue[k] = keep;
    }
    const g = L.hySolveTo(P, 4);
    if (g.open) return fail(opts, 'level');
    for (let i = 0; i < N; i++) if (g.v[i] !== sh[i]) return fail(opts, 'differs');
    const c = L.hyCount(P, null, 2);
    if (c.count !== 1) return fail(opts, 'count');
    const outRooms = rooms.map((rm, k) => rm.concat([P.clue[k]]));
    return { w, h, rooms: outRooms, sol: toRows(sh, w, (x) => (x ? '#' : '.')), grade: g, diff: L.hyDiff(w, h, g) };
  };

  /* =====================================================================
   *  YAJILIN
   *  data: { kind: 'yajilin', w, h, clues: [[cell, 'u'|'r'|'d'|'l', n], …], sol: [...] }
   *  sol letters: '#' shaded, '*' a clue cell, else a hex digit of the loop's
   *  exits from the cell (1 up, 2 right, 4 down, 8 left: 3 5 6 9 a c).
   *  A clue counts the shaded cells in its direction up to the edge; shaded
   *  cells never touch side by side; one loop runs through every other cell.
   * ===================================================================== */

  const YDIR = { u: 0, r: 1, d: 2, l: 3 };
  const YDR = [-1, 0, 1, 0], YDC = [0, 1, 0, -1];
  L.YDIR = YDIR;

  L.yjPrep = function (d) {
    const w = d.w, h = d.h, N = w * h;
    const isClue = new Uint8Array(N);
    const clues = d.clues.map(([c, dir, n]) => { isClue[c] = 1; return { c, dir: YDIR[dir], n }; });
    const cells = [];
    for (let i = 0; i < N; i++) if (!isClue[i]) cells.push(i);
    const cellE = new Int32Array(N * 4).fill(-1), ea = [], eb = [];
    for (const i of cells) {
      const r = Math.floor(i / w), c = i % w;
      if (c + 1 < w && !isClue[i + 1]) { cellE[i * 4 + 1] = ea.length; cellE[(i + 1) * 4 + 3] = ea.length; ea.push(i); eb.push(i + 1); }
      if (r + 1 < h && !isClue[i + w]) { cellE[i * 4 + 2] = ea.length; cellE[(i + w) * 4 + 0] = ea.length; ea.push(i); eb.push(i + w); }
    }
    const nbc = [];
    for (let i = 0; i < N; i++) {
      const a = [];
      if (!isClue[i]) {
        const r = Math.floor(i / w), c = i % w;
        for (let q = 0; q < 4; q++) {
          const rr = r + YDR[q], cc = c + YDC[q];
          if (rr >= 0 && rr < h && cc >= 0 && cc < w && !isClue[rr * w + cc]) a.push(rr * w + cc);
        }
      }
      nbc.push(a);
    }
    // the cells each clue looks at, and whether consecutive ones touch
    clues.forEach((cl) => {
      const r0 = Math.floor(cl.c / w), c0 = cl.c % w, ray = [], adj = [];
      let prev = -1;
      for (let t = 1; ; t++) {
        const rr = r0 + YDR[cl.dir] * t, cc = c0 + YDC[cl.dir] * t;
        if (rr < 0 || rr >= h || cc < 0 || cc >= w) break;
        const i = rr * w + cc;
        if (isClue[i]) { prev = -1; continue; }
        if (ray.length) adj.push(prev >= 0 ? 1 : 0);
        ray.push(i);
        prev = i;
      }
      cl.ray = ray;
      cl.adj = adj;
    });
    return { w, h, N, E: ea.length, isClue, clues, cells, cellE, ea, eb, nbc };
  };

  // the other end of edge x from cell i
  const yjOther = (P, x, i) => (P.ea[x] === i ? P.eb[x] : P.ea[x]);

  /* A clue's ray: which cells can be shaded / white with exactly n shaded,
   * none of them touching. Returns null (impossible) or { sh[], wh[] } flags. */
  function yjRay(P, v, cl) {
    const ray = cl.ray, m = ray.length, n = cl.n, adj = cl.adj;
    // F[t][c][s]: the first t cells can hold c shaded, the last one shaded (s)
    const F = [], B = [];
    for (let t = 0; t <= m; t++) { F.push([]); B.push([]); for (let c = 0; c <= n + 1; c++) { F[t].push([0, 0]); B[t].push([0, 0]); } }
    F[0][0][0] = 1;
    const allow = (t, x) => (v[ray[t]] < 0 || v[ray[t]] === x);
    for (let t = 0; t < m; t++) {
      for (let c = 0; c <= n; c++) {
        for (let s = 0; s < 2; s++) {
          if (!F[t][c][s]) continue;
          if (allow(t, 0)) F[t + 1][c][0] = 1;
          if (allow(t, 1) && c + 1 <= n && !(s && t > 0 && adj[t - 1])) F[t + 1][c + 1][1] = 1;
        }
      }
    }
    if (!F[m][n][0] && !F[m][n][1]) return null;
    // B[t][r][s]: cells t… can hold r shaded, given cell t-1 shaded (s)
    for (let s = 0; s < 2; s++) B[m][0][s] = 1;
    for (let t = m - 1; t >= 0; t--) {
      for (let r = 0; r <= n; r++) {
        for (let s = 0; s < 2; s++) {
          let ok = 0;
          if (allow(t, 0) && B[t + 1][r][0]) ok = 1;
          if (!ok && r >= 1 && allow(t, 1) && !(s && t > 0 && adj[t - 1]) && B[t + 1][r - 1][1]) ok = 1;
          B[t][r][s] = ok;
        }
      }
    }
    const sh = new Uint8Array(m), wh = new Uint8Array(m);
    for (let t = 0; t < m; t++) {
      for (let c = 0; c <= n; c++) {
        for (let s = 0; s < 2; s++) {
          if (!F[t][c][s]) continue;
          if (allow(t, 0) && B[t + 1][n - c] && B[t + 1][n - c][0]) wh[t] = 1;
          if (allow(t, 1) && c + 1 <= n && !(s && t > 0 && adj[t - 1]) && B[t + 1][n - c - 1] && B[t + 1][n - c - 1][1]) sh[t] = 1;
        }
      }
    }
    return { sh, wh };
  }

  // the loop pieces drawn so far: comp[i] for cells with lines, and per piece: closed?, edges
  function yjPieces(P, v, e) {
    const N = P.N, comp = new Int32Array(N).fill(-1), deg = new Uint8Array(N), pieces = [];
    for (let x = 0; x < P.E; x++) if (e[x] === 1) { deg[P.ea[x]]++; deg[P.eb[x]]++; }
    for (const i of P.cells) {
      if (!deg[i] || comp[i] >= 0) continue;
      const pc = { cells: [], closed: true, edges: 0 };
      const stack = [i];
      comp[i] = pieces.length;
      while (stack.length) {
        const x = stack.pop();
        pc.cells.push(x);
        if (deg[x] !== 2) pc.closed = false;
        for (let q = 0; q < 4; q++) {
          const ed = P.cellE[x * 4 + q];
          if (ed < 0 || e[ed] !== 1) continue;
          pc.edges++;
          const y = yjOther(P, ed, x);
          if (comp[y] < 0) { comp[y] = pieces.length; stack.push(y); }
        }
      }
      pc.edges /= 2;
      pieces.push(pc);
    }
    return { comp, deg, pieces };
  }

  // can every white cell still be reached from every other along edges that are not crossed?
  function yjReach(P, v, e) {
    let start = -1, total = 0;
    for (const i of P.cells) if (v[i] === 0) { total++; if (start < 0) start = i; }
    if (total <= 1) return true;
    const seen = new Uint8Array(P.N), stack = [start];
    seen[start] = 1;
    let got = 1;
    while (stack.length) {
      const x = stack.pop();
      for (let q = 0; q < 4; q++) {
        const ed = P.cellE[x * 4 + q];
        if (ed < 0 || e[ed] === 0) continue;
        const y = yjOther(P, ed, x);
        if (seen[y] || v[y] === 1) continue;
        seen[y] = 1;
        if (v[y] === 0) got++;
        stack.push(y);
      }
    }
    return got === total;
  }

  /* The rules until nothing changes. level 1: shaded cells and their
   * neighbours, cells with two exits, dead ends, finished clues; level 2:
   * every way to fill a clue's line, and no small loops. Always: a
   * contradiction check (null or { t, … }). */
  function yjProp(P, v, e, level) {
    if (level == null) level = 2;
    let changed = true;
    while (changed) {
      changed = false;
      for (const i of P.cells) {
        if (v[i] === 1) {
          for (const j of P.nbc[i]) { if (v[j] === 1) return { t: 'touch', c: i }; if (v[j] < 0) { v[j] = 0; changed = true; } }
          for (let q = 0; q < 4; q++) { const x = P.cellE[i * 4 + q]; if (x < 0) continue; if (e[x] === 1) return { t: 'shadedline', c: i }; if (e[x] < 0) { e[x] = 0; changed = true; } }
          continue;
        }
        let on = 0, poss = 0;
        for (let q = 0; q < 4; q++) {
          const x = P.cellE[i * 4 + q];
          if (x < 0) continue;
          if (e[x] === 1) on++;
          if (e[x] !== 0 && v[yjOther(P, x, i)] !== 1) poss++;
        }
        if (on > 2) return { t: 'branch', c: i };
        if (on && v[i] < 0) { v[i] = 0; changed = true; }
        if (v[i] === 0) {
          if (poss < 2) return { t: 'dead', c: i };
          if (on === 2 && poss > 2) { for (let q = 0; q < 4; q++) { const x = P.cellE[i * 4 + q]; if (x >= 0 && e[x] < 0) e[x] = 0; } changed = true; }
          else if (poss === 2 && on < 2) { for (let q = 0; q < 4; q++) { const x = P.cellE[i * 4 + q]; if (x >= 0 && e[x] < 0 && v[yjOther(P, x, i)] !== 1) { e[x] = 1; } } changed = true; }
        } else if (v[i] < 0 && poss < 2) { v[i] = 1; changed = true; }
      }
      for (let k = 0; k < P.clues.length; k++) {
        const cl = P.clues[k];
        let s = 0, o = 0;
        for (const i of cl.ray) { if (v[i] === 1) s++; else if (v[i] < 0) o++; }
        if (s > cl.n) return { t: 'clue', k };
        if (!o) { if (s !== cl.n) return { t: 'clue', k }; continue; }
        if (s === cl.n) { for (const i of cl.ray) if (v[i] < 0) v[i] = 0; changed = true; continue; }
        if (level >= 2) {
          const r = yjRay(P, v, cl);
          if (!r) return { t: 'clue', k };
          cl.ray.forEach((i, t) => {
            if (v[i] >= 0) return;
            if (r.sh[t] && !r.wh[t]) { v[i] = 1; changed = true; } else if (r.wh[t] && !r.sh[t]) { v[i] = 0; changed = true; }
          });
        }
      }
      if (changed) continue;
      const pcs = yjPieces(P, v, e);
      const closed = pcs.pieces.filter((pc) => pc.closed);
      if (closed.length) {
        if (pcs.pieces.length > 1) return { t: 'loops' };
        for (const i of P.cells) if (v[i] === 0 && !pcs.deg[i]) return { t: 'loops' };
        // the loop is finished: everything else is shaded
        for (const i of P.cells) if (v[i] < 0) { v[i] = 1; changed = true; }
        for (let x = 0; x < P.E; x++) if (e[x] < 0) { e[x] = 0; changed = true; }
        if (changed) continue;
      }
      if (level >= 2) {
        let whitesOut = 0;
        for (const i of P.cells) if (v[i] === 0 && !pcs.deg[i]) whitesOut++;
        for (let x = 0; x < P.E; x++) {
          if (e[x] >= 0) continue;
          const a = P.ea[x], b = P.eb[x];
          if (pcs.comp[a] < 0 || pcs.comp[a] !== pcs.comp[b]) continue;
          // joining the two ends of one piece closes a loop: only the last move may do that
          if (pcs.pieces.length > 1 || whitesOut) { e[x] = 0; changed = true; }
        }
      }
      if (!changed && !yjReach(P, v, e)) return { t: 'reach' };
    }
    return null;
  }
  L.yjProp = yjProp;

  L.yjValid = function (P, v, e) {
    for (const i of P.cells) {
      if (v[i] !== 0 && v[i] !== 1) return false;
      let on = 0;
      for (let q = 0; q < 4; q++) { const x = P.cellE[i * 4 + q]; if (x >= 0 && e[x] === 1) on++; }
      if (v[i] === 1) { if (on) return false; for (const j of P.nbc[i]) if (v[j] === 1) return false; }
      else if (on !== 2) return false;
    }
    for (const cl of P.clues) { let s = 0; for (const i of cl.ray) if (v[i] === 1) s++; if (s !== cl.n) return false; }
    const pcs = yjPieces(P, v, e);
    return pcs.pieces.length === 1 && pcs.pieces[0].closed;
  };

  L.yjCount = function (P, s0, limit, nodeCap) {
    limit = limit || 2;
    nodeCap = nodeCap || 150000;
    let count = 0, sol = null, nodes = 0, aborted = false;
    const rec = (v, e) => {
      if (count >= limit || aborted) return;
      if (++nodes > nodeCap) { aborted = true; return; }
      if (yjProp(P, v, e, 2)) return;
      // a loop end with the fewest ways on
      let bi = -1, bx = null;
      for (const i of P.cells) {
        if (v[i] !== 0) continue;
        let on = 0;
        const un = [];
        for (let q = 0; q < 4; q++) { const x = P.cellE[i * 4 + q]; if (x < 0) continue; if (e[x] === 1) on++; else if (e[x] < 0) un.push(x); }
        if (on === 1 && un.length && (!bx || un.length < bx.length)) { bi = i; bx = un; }
      }
      if (bx) {
        for (const x of bx) {
          const v2 = Int8Array.from(v), e2 = Int8Array.from(e);
          for (const y of bx) e2[y] = y === x ? 1 : 0;
          rec(v2, e2);
          if (count >= limit || aborted) return;
        }
        return;
      }
      let cell = -1;
      for (const cl of P.clues) { for (const i of cl.ray) if (v[i] < 0) { cell = i; break; } if (cell >= 0) break; }
      if (cell < 0) for (const i of P.cells) if (v[i] < 0) { cell = i; break; }
      if (cell >= 0) {
        for (const val of [1, 0]) {
          const v2 = Int8Array.from(v), e2 = Int8Array.from(e);
          v2[cell] = val;
          rec(v2, e2);
          if (count >= limit || aborted) return;
        }
        return;
      }
      let ed = -1;
      for (let x = 0; x < P.E; x++) if (e[x] < 0) { ed = x; break; }
      if (ed >= 0) {
        for (const val of [1, 0]) {
          const v2 = Int8Array.from(v), e2 = Int8Array.from(e);
          e2[ed] = val;
          rec(v2, e2);
          if (count >= limit || aborted) return;
        }
        return;
      }
      if (L.yjValid(P, v, e)) { count++; sol = { v: Int8Array.from(v), e: Int8Array.from(e) }; }
    };
    const v = s0 ? Int8Array.from(s0.v) : new Int8Array(P.N).fill(-1);
    const e = s0 ? Int8Array.from(s0.e) : new Int8Array(P.E).fill(-1);
    for (let i = 0; i < P.N; i++) if (P.isClue[i]) v[i] = 2;
    rec(v, e);
    return { count, sol, nodes, aborted };
  };

  // solution letters <-> arrays
  L.yjSolRows = function (P, v, e) {
    const out = [];
    for (let r = 0; r < P.h; r++) {
      let s = '';
      for (let c = 0; c < P.w; c++) {
        const i = r * P.w + c;
        if (P.isClue[i]) s += '*';
        else if (v[i] === 1) s += '#';
        else { let m = 0; for (let q = 0; q < 4; q++) { const x = P.cellE[i * 4 + q]; if (x >= 0 && e[x] === 1) m |= 1 << q; } s += m.toString(16); }
      }
      out.push(s);
    }
    return out;
  };
  L.yjSolParse = function (P, rows) {
    const v = new Int8Array(P.N).fill(-1), e = new Int8Array(P.E).fill(0);
    for (let i = 0; i < P.N; i++) {
      const ch = rows[Math.floor(i / P.w)][i % P.w];
      if (P.isClue[i]) { v[i] = 2; continue; }
      if (ch === '#') { v[i] = 1; continue; }
      v[i] = 0;
      const m = parseInt(ch, 16);
      for (let q = 0; q < 4; q++) if (m & (1 << q)) { const x = P.cellE[i * 4 + q]; if (x >= 0) e[x] = 1; }
    }
    return { v, e };
  };

  // cells that, shaded, would cut the white cells apart
  function yjCutCells(P, v, e) {
    const out = [];
    for (const x of P.cells) {
      if (v[x] >= 0 || P.nbc[x].some((j) => v[j] === 1)) continue;
      const t = Int8Array.from(v);
      t[x] = 1;
      if (!yjReach(P, t, e)) out.push(x);
    }
    return out;
  }

  // the obvious marks: lines make white cells, shaded cells and full cells cross their other edges
  function yjImplied(P, v, e) {
    for (const i of P.cells) {
      let on = 0;
      for (let q = 0; q < 4; q++) { const x = P.cellE[i * 4 + q]; if (x >= 0 && e[x] === 1) on++; }
      if (on && v[i] < 0) v[i] = 0;
    }
    for (const i of P.cells) {
      let on = 0;
      for (let q = 0; q < 4; q++) { const x = P.cellE[i * 4 + q]; if (x >= 0 && e[x] === 1) on++; }
      for (let q = 0; q < 4; q++) {
        const x = P.cellE[i * 4 + q];
        if (x < 0 || e[x] >= 0) continue;
        if (v[i] === 1 || v[yjOther(P, x, i)] === 1 || on >= 2) e[x] = 0;
      }
    }
  }
  L.yjImplied = yjImplied;

  const ARROW = ['↑', '→', '↓', '←'];
  const DIRWORD = ['above', 'to the right of', 'below', 'to the left of'];
  L.yjArrow = ARROW;

  /* The next step from a position ({v, e}, every mark right). Levels: 1 the
   * plain rules, 2 every way to fill a clue's line and no small loops,
   * 3 not cutting the loop's cells apart, 4 "suppose…", 5 a long chain.
   * Returns { level, set: [[cell, 0|1]], eset: [[edge, 0|1]], focus, text }. */
  L.yjStep = function (P, v0, e0, maxLevel, sol) {
    maxLevel = maxLevel || 5;
    const v = Int8Array.from(v0), e = Int8Array.from(e0), w = P.w;
    for (let i = 0; i < P.N; i++) if (P.isClue[i]) v[i] = 2;
    yjImplied(P, v, e);
    const clueName = (cl) => 'the clue **' + cl.n + ARROW[cl.dir] + '** at ' + cellName(cl.c, w);
    // 1a: next to a shaded cell
    for (const i of P.cells) {
      if (v[i] !== 1) continue;
      const set = P.nbc[i].filter((j) => v[j] < 0).map((j) => [j, 0]);
      if (set.length) return { level: 1, set, eset: [], focus: [i], text: 'Shaded cells never touch side by side, so the cells next to the shaded one at ' + cellName(i, w) + ' are on the loop (dot them).' };
    }
    // 1b: finished clues
    for (const cl of P.clues) {
      let s = 0;
      const o = [];
      for (const i of cl.ray) { if (v[i] === 1) s++; else if (v[i] < 0) o.push(i); }
      if (o.length && s === cl.n) return { level: 1, set: o.map((i) => [i, 0]), eset: [], focus: [cl.c].concat(cl.ray), text: cl.n === 0 ? 'No shaded cells at all ' + DIRWORD[cl.dir] + ' ' + clueName(cl) + ': every cell it points at is on the loop.' : clueName(cl).replace(/^t/, 'T') + ' already sees ' + (cl.n === 1 ? 'its shaded cell' : 'all ' + word(cl.n) + ' of its shaded cells') + ': the other cells it points at are on the loop.' };
    }
    // 1c: dead ends and cells with two exits
    for (const i of P.cells) {
      if (v[i] === 1 || v[i] === 2) continue;
      let on = 0;
      const ex = [];
      for (let q = 0; q < 4; q++) {
        const x = P.cellE[i * 4 + q];
        if (x < 0) continue;
        if (e[x] === 1) on++;
        if (e[x] !== 0 && v[yjOther(P, x, i)] !== 1) ex.push(x);
      }
      if (v[i] < 0 && ex.length < 2) return { level: 1, set: [[i, 1]], eset: [], focus: [], zone: [i], text: 'The loop cannot pass through the cell at ' + cellName(i, w) + ': it has ' + (ex.length ? 'only one way in or out' : 'no way in or out') + '. Every cell off the loop is shaded (or a clue), so it is shaded.' };
      if (v[i] === 0 && ex.length === 2 && on < 2) return { level: 1, set: [], eset: ex.filter((x) => e[x] < 0).map((x) => [x, 1]), focus: [], zone: [i], text: 'The loop passes through the cell at ' + cellName(i, w) + ', and ' + (on ? 'the line there has only one way to go on' : 'it has only two ways in and out') + ': draw ' + (on ? 'it' : 'both') + '.' };
    }
    if (maxLevel < 2) return null;
    // 2a: every way to fill a clue's line
    for (const cl of P.clues) {
      let s = 0;
      for (const i of cl.ray) if (v[i] === 1) s++;
      if (s >= cl.n) continue;
      const r = yjRay(P, v, cl);
      if (!r) continue;
      const set = [];
      cl.ray.forEach((i, t) => { if (v[i] >= 0) return; if (r.sh[t] && !r.wh[t]) set.push([i, 1]); else if (r.wh[t] && !r.sh[t]) set.push([i, 0]); });
      if (!set.length) continue;
      const sh = set.filter((x) => x[1] === 1).length;
      const need = cl.n - s;
      const parts = [];
      if (sh) parts.push('shades ' + (sh === 1 ? 'the outlined cell' : word(sh) + ' outlined cells'));
      if (set.length > sh) parts.push('leaves ' + (set.length - sh === 1 ? 'the dotted cell' : word(set.length - sh) + ' dotted cells') + ' on the loop');
      const text = Word(need) + ' more shaded cell' + (need === 1 ? '' : 's') + ' must fit ' + DIRWORD[cl.dir] + ' ' + clueName(cl) + ', never two side by side. Every way to place ' + (need === 1 ? 'it ' : 'them ') + parts.join(' and ') + '.';
      return { level: 2, set, eset: [], focus: [cl.c].concat(cl.ray), text };
    }
    // 2b: no small loops
    const pcs = yjPieces(P, v, e);
    let whitesOut = 0;
    for (const i of P.cells) if (v[i] === 0 && !pcs.deg[i]) whitesOut++;
    if (pcs.pieces.length > 1 || whitesOut) {
      for (let x = 0; x < P.E; x++) {
        if (e[x] >= 0) continue;
        const a = P.ea[x], b = P.eb[x];
        if (pcs.comp[a] < 0 || pcs.comp[a] !== pcs.comp[b]) continue;
        return { level: 2, set: [], eset: [[x, 0]], focus: pcs.pieces[pcs.comp[a]].cells, text: 'Joining the cells at ' + cellName(a, w) + ' and ' + cellName(b, w) + ' would close the highlighted line into a small loop, leaving other cells of the loop outside it. There is only one loop, so that step is crossed out.' };
      }
    }
    if (maxLevel < 3) return null;
    const cuts = yjCutCells(P, v, e);
    if (cuts.length) return { level: 3, set: [[cuts[0], 0]], eset: [], focus: [], zone: [cuts[0]], text: 'If the cell at ' + cellName(cuts[0], w) + ' were shaded, the loop could no longer reach all of its cells: some would be walled off. So it is on the loop.' };
    if (maxLevel < 4) return null;
    const why = { touch: 'two shaded cells would touch', shadedline: 'the loop would run into a shaded cell', branch: 'the loop would have to branch', dead: 'the loop would run into a dead end', clue: 'a clue would get the wrong count', loops: 'the loop would close too early', reach: 'part of the loop would be walled off' };
    for (const i of P.cells) {
      if (v[i] >= 0) continue;
      for (const val of [1, 0]) {
        const t = Int8Array.from(v), te = Int8Array.from(e);
        t[i] = val;
        const c = yjProp(P, t, te, 2);
        if (!c) continue;
        return { level: 4, set: [[i, 1 - val]], eset: [], focus: c.c != null ? [c.c] : c.k != null ? [P.clues[c.k].c] : [], zone: [i], text: 'Suppose the cell at ' + cellName(i, w) + ' were ' + (val ? 'shaded' : 'on the loop') + '. Follow the rules from there and ' + (why[c.t] || 'something breaks') + '. So it is ' + (val ? 'on the loop' : 'shaded') + '.' };
      }
    }
    for (let x = 0; x < P.E; x++) {
      if (e[x] >= 0) continue;
      const t = Int8Array.from(v), te = Int8Array.from(e);
      te[x] = 1;
      const c = yjProp(P, t, te, 2);
      if (c) return { level: 4, set: [], eset: [[x, 0]], focus: [], zone: [P.ea[x], P.eb[x]], text: 'Suppose the loop stepped between the cells at ' + cellName(P.ea[x], w) + ' and ' + cellName(P.eb[x], w) + '. Follow the rules from there and ' + (why[c.t] || 'something breaks') + '. So that step is crossed out.' };
    }
    if (maxLevel < 5 || !sol) return null;
    for (const i of P.cells) if (v[i] < 0) return { level: 5, set: [[i, sol.v[i]]], eset: [], focus: [], zone: [i], text: 'This needs a long chain of reasoning. The cell at ' + cellName(i, w) + ' is ' + (sol.v[i] ? 'shaded' : 'on the loop') + ' — can you see why?' };
    for (let x = 0; x < P.E; x++) if (e[x] < 0) return { level: 5, set: [], eset: [[x, sol.e[x]]], focus: [], zone: [P.ea[x], P.eb[x]], text: 'This needs a long chain of reasoning: look at the step between the cells at ' + cellName(P.ea[x], w) + ' and ' + cellName(P.eb[x], w) + '.' };
    return null;
  };

  L.yjSolveTo = function (P, level, s0) {
    const v = s0 ? Int8Array.from(s0.v) : new Int8Array(P.N).fill(-1);
    const e = s0 ? Int8Array.from(s0.e) : new Int8Array(P.E).fill(-1);
    for (let i = 0; i < P.N; i++) if (P.isClue[i]) v[i] = 2;
    const count = [0, 0, 0, 0, 0, 0];
    const openOf = () => { let k = 0; for (const i of P.cells) if (v[i] < 0) k++; for (let x = 0; x < P.E; x++) if (e[x] < 0) k++; return k; };
    for (let guard = 0; guard < 400; guard++) {
      const before = openOf();
      if (yjProp(P, v, e, 1)) return { open: -1, count, v, e };
      if (openOf() < before) count[1]++;
      let open = openOf();
      if (!open || level < 2) return { open, count, v, e, top: topOf(count) };
      if (yjProp(P, v, e, 2)) return { open: -1, count, v, e };
      if (openOf() < open) { count[2]++; continue; }
      let got = false;
      if (level >= 3) {
        const cuts = yjCutCells(P, v, e);
        if (cuts.length) { cuts.forEach((i) => { v[i] = 0; }); count[3]++; continue; }
      }
      if (level >= 4) {
        for (const i of P.cells) {
          if (v[i] >= 0) continue;
          for (const val of [1, 0]) {
            const t = Int8Array.from(v), te = Int8Array.from(e);
            t[i] = val;
            if (yjProp(P, t, te, 2)) { v[i] = 1 - val; got = true; break; }
          }
          if (got) break;
        }
        if (!got) {
          for (let x = 0; x < P.E && !got; x++) {
            if (e[x] >= 0) continue;
            const t = Int8Array.from(v), te = Int8Array.from(e);
            te[x] = 1;
            if (yjProp(P, t, te, 2)) { e[x] = 0; got = true; }
          }
        }
        if (got) { count[4]++; continue; }
      }
      return { open, count, v, e, top: topOf(count) };
    }
    return { open: -1, count, v, e };
  };

  L.yjDiff = (w, h, g) => gradeOf(w * h, g);

  /* A random Yajilin: a loop grown by bumps from a small square, the cells
   * it misses shaded (never two touching) or made clue cells; then a
   * hill-climb where logic of the level gets stuck: clues turn, shaded cells
   * become clues and back, and bumps of the loop are pressed flat, until
   * logic finishes it. Then clues that say nothing new are taken away. */
  L.yjMake = function (w, h, rng, opts) {
    opts = opts || {};
    const N = w * h, level = opts.level || 3, lv = Math.min(level, 4);
    const t0 = now(), deadline = opts.budget ? t0 + opts.budget : 0;
    const nb4 = nbList(w, h, null, 4);
    // 1. the loop
    const on = new Uint8Array(N);
    const r0 = rng.int(h - 1), c0 = rng.int(w - 1);
    let loop = [r0 * w + c0, r0 * w + c0 + 1, (r0 + 1) * w + c0 + 1, (r0 + 1) * w + c0];
    loop.forEach((i) => { on[i] = 1; });
    const cover = opts.cover || 0.72;
    for (let fails = 0; loop.length < cover * N && fails < 300;) {
      const t = rng.int(loop.length), a = loop[t], b = loop[(t + 1) % loop.length];
      const ar = Math.floor(a / w), ac = a % w, br = Math.floor(b / w), bc = b % w;
      const horiz = ar === br;
      const side = rng() < 0.5 ? 1 : -1;
      const dr = horiz ? side : 0, dc = horiz ? 0 : side;
      const a2r = ar + dr, a2c = ac + dc, b2r = br + dr, b2c = bc + dc;
      if (a2r < 0 || a2r >= h || a2c < 0 || a2c >= w || b2r < 0 || b2r >= h || b2c < 0 || b2c >= w) { fails++; continue; }
      const a2 = a2r * w + a2c, b2 = b2r * w + b2c;
      if (on[a2] || on[b2]) { fails++; continue; }
      loop.splice(t + 1, 0, a2, b2);
      on[a2] = on[b2] = 1;
      fails = 0;
    }
    // 2. the rest: shaded where possible, else clue cells
    const shaded = new Uint8Array(N), clueCell = new Uint8Array(N), dirOf = new Int8Array(N).fill(-1);
    const rayLen = (i, q) => { let k = 0, r = Math.floor(i / w) + YDR[q], c = i % w + YDC[q]; while (r >= 0 && r < h && c >= 0 && c < w) { k++; r += YDR[q]; c += YDC[q]; } return k; };
    const pickDir = (i) => { const qs = [0, 1, 2, 3].filter((q) => rayLen(i, q) >= 2); return qs.length ? qs[rng.int(qs.length)] : [0, 1, 2, 3].find((q) => rayLen(i, q) >= 1); };
    const free = (i) => {
      if (nb4[i].some((j) => shaded[j])) { clueCell[i] = 1; dirOf[i] = pickDir(i); } else shaded[i] = 1;
    };
    for (const i of rng.shuffle(Array.from({ length: N }, (_, k) => k))) if (!on[i]) free(i);
    const extra = opts.extraClues == null ? Math.round(N / 18) : opts.extraClues;
    for (let k = 0; k < extra; k++) {
      const sh = [];
      for (let i = 0; i < N; i++) if (shaded[i]) sh.push(i);
      if (sh.length < 3) break;
      const i = sh[rng.int(sh.length)];
      shaded[i] = 0; clueCell[i] = 1; dirOf[i] = pickDir(i);
    }
    const build = () => {
      const clues = [];
      for (let i = 0; i < N; i++) {
        if (!clueCell[i]) continue;
        const q = dirOf[i];
        let n = 0, r = Math.floor(i / w) + YDR[q], c = i % w + YDC[q];
        while (r >= 0 && r < h && c >= 0 && c < w) { if (shaded[r * w + c]) n++; r += YDR[q]; c += YDC[q]; }
        clues.push([i, 'urdl'[q], n]);
      }
      return { kind: 'yajilin', w, h, clues };
    };
    const score = () => {
      const P = L.yjPrep(build());
      const g = L.yjSolveTo(P, lv);
      if (g.open < 0) return { s: 1e9, hot: [] };
      let ncl = 0;
      for (let i = 0; i < N; i++) if (clueCell[i]) ncl++;
      const hot = new Set();
      for (const i of P.cells) if (g.v[i] < 0) hot.add(i);
      for (let x = 0; x < P.E; x++) if (g.e[x] < 0) { hot.add(P.ea[x]); hot.add(P.eb[x]); }
      return { s: g.open, ncl, hot: Array.from(hot) };
    };
    // a U-turn of the loop through two cells next to hot cells: press it flat
    const unbump = (near) => {
      const L0 = loop.length;
      if (L0 <= 4) return false;
      const starts = [];
      for (let t = 0; t < L0; t++) {
        const a = loop[t], x = loop[(t + 1) % L0], y = loop[(t + 2) % L0], b = loop[(t + 3) % L0];
        if (!nb4[a].includes(b)) continue;
        if (near && !near.has(x) && !near.has(y)) continue;
        starts.push(t);
      }
      if (!starts.length) return false;
      const t = starts[rng.int(starts.length)];
      const x = loop[(t + 1) % L0], y = loop[(t + 2) % L0];
      loop = loop.filter((c) => c !== x && c !== y);
      on[x] = on[y] = 0;
      for (const c of rng() < 0.5 ? [x, y] : [y, x]) free(c);
      return true;
    };
    let cur = score();
    const iters = opts.maxIter || 500;
    for (let guard = 0; cur.s && guard < iters; guard++) {
      if (deadline && now() > deadline) return fail(opts, 'time');
      const snap = { sh: Uint8Array.from(shaded), cl: Uint8Array.from(clueCell), d: Int8Array.from(dirOf), on: Uint8Array.from(on), loop: loop.slice() };
      const roll = rng();
      let moved = false;
      if (roll < 0.25) {
        const near = new Set();
        for (const i of cur.hot) { near.add(i); for (const j of nb4[i]) near.add(j); }
        moved = unbump(near);
      } else {
        // a cell near the trouble, mostly
        let i;
        if (cur.hot.length && rng() < 0.75) { const x = cur.hot[rng.int(cur.hot.length)]; const nx = nb4[x].concat([x]); i = nx[rng.int(nx.length)]; }
        else i = rng.int(N);
        // or one on the line of sight of the trouble, for a clue
        if (on[i]) {
          const r = Math.floor(i / w), c = i % w, cand = [];
          for (let k = 0; k < N; k++) if (!on[k] && (Math.floor(k / w) === r || k % w === c)) cand.push(k);
          if (!cand.length) continue;
          i = cand[rng.int(cand.length)];
        }
        if (clueCell[i] && roll < 0.7) { dirOf[i] = pickDir(i); moved = true; }
        else if (shaded[i]) { shaded[i] = 0; clueCell[i] = 1; dirOf[i] = pickDir(i); moved = true; }
        else if (clueCell[i] && !nb4[i].some((j) => shaded[j])) { clueCell[i] = 0; shaded[i] = 1; dirOf[i] = -1; moved = true; }
      }
      if (!moved) continue;
      const nx = score();
      if (nx.s < cur.s || (nx.s === cur.s && nx.ncl <= cur.ncl)) cur = nx;
      else { shaded.set(snap.sh); clueCell.set(snap.cl); dirOf.set(snap.d); on.set(snap.on); loop = snap.loop; }
    }
    if (cur.s) return fail(opts, 'nudge');
    // 3. clues that say nothing new go (as shaded cells where they may), logic still finishing
    for (const i of rng.shuffle(Array.from({ length: N }, (_, k) => k))) {
      if (!clueCell[i] || nb4[i].some((j) => shaded[j])) continue;
      if (deadline && now() > deadline) break;
      clueCell[i] = 0; shaded[i] = 1;
      if (score().s) { clueCell[i] = 1; shaded[i] = 0; }
    }
    if (loop.length < N * 0.4) return fail(opts, 'small');
    const d = build(), P = L.yjPrep(d);
    const g = L.yjSolveTo(P, 4);
    if (g.open) return fail(opts, 'level');
    const c = L.yjCount(P, null, 2);
    if (c.count !== 1) return fail(opts, 'count');
    return { w, h, clues: d.clues, sol: L.yjSolRows(P, c.sol.v, c.sol.e), grade: g, diff: L.yjDiff(w, h, g) };
  };

  /* @@END@@ */
})(typeof window !== 'undefined' ? window : globalThis);
