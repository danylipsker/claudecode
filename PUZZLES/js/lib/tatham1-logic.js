/* The Puzzle Cabinet · js/lib/tatham1-logic.js
 *
 * The reasoning behind engines/tatham1.js, five puzzles from the family of
 * Simon Tatham's Portable Puzzle Collection. Node-safe, so that verify(), the
 * generator (tools/gen/tatham1.js), the Endless drawers and the live hints all
 * use the same code:
 *
 *   tents      trees and tents: rule propagation with a tree–tent matching,
 *              solution counting, graded steps
 *   dominosa   a full set of dominoes: exact cover (dancing links) to count,
 *              placement logic for the steps
 *   hitori     Singles: black out repeats; propagation with connectivity
 *              (articulation points), counting, graded steps
 *   fillomino  Filling: sizes per cell as candidate sets; regions that must
 *              grow, reach and articulation; trials
 *   shikaku    Rectangles: every rectangle a clue can make; exact cover to
 *              count, elimination for the steps
 *
 * Every step function returns { level, set, focus, text } (or null): `set` is
 * what the hint fills in, `focus` the cells to light up, `text` the reason.
 * Levels: 1 a rule seen at a glance, 2 a pattern or a whole line weighed,
 * 3 "suppose…" (one step of trial), 4 deeper.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const T = {};
  C.tatham1 = T;

  /* ---------- words and small helpers ---------- */

  const ORD = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const word = (n) => ORD[n] || String(n);
  T.word = word;
  const plural = (n, one, many) => word(n) + ' ' + (n === 1 ? one : (many || one + 's'));
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const now = () => (root.performance && root.performance.now ? root.performance.now() : Date.now());
  T.now = now;
  const cellName = (i, w) => 'row ' + (Math.floor(i / w) + 1) + ', column ' + (i % w + 1);
  T.cellName = cellName;
  function listNums(nums) {
    const a = nums.slice().sort((x, y) => x - y);
    const parts = [];
    for (let i = 0; i < a.length;) {
      let j = i;
      while (j + 1 < a.length && a[j + 1] === a[j] + 1) j++;
      if (j - i >= 2) parts.push(a[i] + '–' + a[j]);
      else for (let k = i; k <= j; k++) parts.push(String(a[k]));
      i = j + 1;
    }
    return andList(parts);
  }
  T.listNums = listNums;
  function andList(parts) {
    if (parts.length <= 1) return parts.join('');
    return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
  }
  T.andList = andList;
  const lineName = (li, h) => (li < h ? 'row ' : 'column ') + ((li < h ? li : li - h) + 1);
  const LineName = (li, h) => (li < h ? 'Row ' : 'Column ') + ((li < h ? li : li - h) + 1);

  function toRows(arr, w, f) {
    const rows = [];
    for (let r = 0; r < arr.length / w; r++) { let s = ''; for (let c = 0; c < w; c++) s += f(arr[r * w + c], r * w + c); rows.push(s); }
    return rows;
  }
  T.toRows = toRows;

  const nbCache = {};
  function nbrs(w, h) {
    const key = w + 'x' + h;
    if (nbCache[key]) return nbCache[key];
    const N = w * h, n4 = [], n8 = [];
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / w), c = i % w, a = [], b = [];
      if (r > 0) a.push(i - w);
      if (c > 0) a.push(i - 1);
      if (c < w - 1) a.push(i + 1);
      if (r < h - 1) a.push(i + w);
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const rr = r + dr, cc = c + dc;
        if (rr >= 0 && rr < h && cc >= 0 && cc < w) b.push(rr * w + cc);
      }
      n4.push(a); n8.push(b);
    }
    return (nbCache[key] = { n4, n8 });
  }
  T.nbrs = nbrs;
  function linesOf(w, h) {
    const lines = [];
    for (let r = 0; r < h; r++) { const a = []; for (let c = 0; c < w; c++) a.push(r * w + c); lines.push(a); }
    for (let c = 0; c < w; c++) { const a = []; for (let r = 0; r < h; r++) a.push(r * w + c); lines.push(a); }
    return lines;
  }
  T.linesOf = linesOf;

  /* =====================================================================
   *  TENTS
   *  grid rows: '.' ground, 'T' a tree; rows[r], cols[c]: tents per line.
   *  A tent sits next to its own tree (up, down, left, right), one tent per
   *  tree; no two tents touch, not even at a corner.
   *  Values: -1 unknown, 0 grass (no tent), 1 tent.
   * ===================================================================== */

  T.tnPrep = function (grid, rows, cols) {
    const h = grid.length, w = grid[0].length, N = w * h;
    const { n4, n8 } = nbrs(w, h);
    const tree = new Uint8Array(N), cand = new Uint8Array(N);
    const trees = [], treeNb = [], cellTrees = [];
    for (let i = 0; i < N; i++) { cellTrees.push([]); if (grid[Math.floor(i / w)][i % w] === 'T') tree[i] = 1; }
    for (let i = 0; i < N; i++) {
      if (!tree[i]) continue;
      const t = trees.length;
      trees.push(i);
      const nb = n4[i].filter((j) => !tree[j]);
      treeNb.push(nb);
      nb.forEach((j) => { cand[j] = 1; cellTrees[j].push(t); });
    }
    const lines = linesOf(w, h), need = rows.concat(cols);
    const lineOf = [];
    for (let i = 0; i < N; i++) lineOf.push([Math.floor(i / w), h + i % w]);
    return { w, h, N, tree, trees, treeNb, cellTrees, cand, n4, n8, lines, need, lineOf, rows, cols };
  };

  // the starting knowledge: trees and cells beside no tree hold no tent
  T.tnInit = function (P) {
    const v = new Int8Array(P.N).fill(-1);
    for (let i = 0; i < P.N; i++) if (P.tree[i] || !P.cand[i]) v[i] = 0;
    return v;
  };

  /* Match trees to tents. Every tent needs a tree of its own, and every tree a
   * tent (or a cell that may still become one). Returns { ok, mt, mc } or
   * { ok: false, t: 'tent' | 'tree', at }. */
  function tnMatch(P, v) {
    const nT = P.trees.length, N = P.N;
    const mt = new Int32Array(nT).fill(-1), mc = new Int32Array(N).fill(-1);
    let seenT = new Uint8Array(nT), seenC = new Uint8Array(N);
    const fromCell = (cell) => {
      for (const t of P.cellTrees[cell]) {
        if (seenT[t]) continue;
        seenT[t] = 1;
        if (mt[t] < 0 || fromCell(mt[t])) { mt[t] = cell; mc[cell] = t; return true; }
      }
      return false;
    };
    for (let i = 0; i < N; i++) {
      if (v[i] !== 1) continue;
      seenT.fill(0);
      if (!fromCell(i)) return { ok: false, t: 'tent', at: i };
    }
    const fromTree = (t) => {
      for (const cell of P.treeNb[t]) {
        if (v[cell] === 0 || seenC[cell]) continue;
        seenC[cell] = 1;
        if (mc[cell] < 0 || fromTree(mc[cell])) { mc[cell] = t; mt[t] = cell; return true; }
      }
      return false;
    };
    for (let t = 0; t < nT; t++) {
      if (mt[t] >= 0) continue;
      seenC.fill(0);
      if (!fromTree(t)) return { ok: false, t: 'tree', at: P.trees[t] };
    }
    return { ok: true, mt, mc };
  }
  T.tnMatch = tnMatch;

  // the rules until nothing changes; null, or the contradiction met
  function tnProp(P, v) {
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < P.N; i++) {
        if (v[i] !== 1) continue;
        for (const j of P.n8[i]) {
          if (v[j] === 1) return { t: 'touch', cell: i, other: j };
          if (v[j] < 0) { v[j] = 0; changed = true; }
        }
      }
      for (let li = 0; li < P.lines.length; li++) {
        let t = 0, u = 0;
        for (const i of P.lines[li]) { if (v[i] === 1) t++; else if (v[i] < 0) u++; }
        const need = P.need[li];
        if (t > need) return { t: 'over', li };
        if (t + u < need) return { t: 'under', li };
        if (!u) continue;
        if (t === need) { for (const i of P.lines[li]) if (v[i] < 0) v[i] = 0; changed = true; }
        else if (t + u === need) { for (const i of P.lines[li]) if (v[i] < 0) v[i] = 1; changed = true; }
      }
      if (changed) continue;
      const m = tnMatch(P, v);
      if (!m.ok) return m;
      for (let t = 0; t < P.trees.length; t++) {
        let only = -1, k = 0;
        for (const j of P.treeNb[t]) if (v[j] !== 0) { k++; only = j; }
        if (k === 1 && v[only] < 0) { v[only] = 1; changed = true; }
      }
    }
    return null;
  }
  T.tnProp = tnProp;

  T.tnCount = function (P, v0, limit, nodeCap) {
    limit = limit || 2;
    nodeCap = nodeCap || 200000;
    let count = 0, sol = null, nodes = 0, aborted = false;
    const rec = (v) => {
      if (count >= limit) return;
      if (++nodes > nodeCap) { aborted = true; return; }
      if (tnProp(P, v)) return;
      // branch in the line with the fewest open cells
      let best = -1, bu = 1e9;
      for (let li = 0; li < P.lines.length; li++) {
        let u = 0, first = -1;
        for (const i of P.lines[li]) if (v[i] < 0) { u++; if (first < 0) first = i; }
        if (u && u < bu) { bu = u; best = first; }
      }
      if (best < 0) { count++; sol = Int8Array.from(v); return; }
      for (const val of [1, 0]) {
        const v2 = Int8Array.from(v);
        v2[best] = val;
        rec(v2);
        if (count >= limit || aborted) return;
      }
    };
    rec(v0 ? Int8Array.from(v0) : T.tnInit(P));
    return { count, sol, nodes, aborted };
  };

  // does a set of tents obey every rule?
  T.tnValid = function (P, tents) {
    const v = new Int8Array(P.N);
    for (let i = 0; i < P.N; i++) {
      if (tents[i] && (P.tree[i] || !P.cand[i])) return false;
      v[i] = tents[i] ? 1 : 0;
    }
    for (let li = 0; li < P.lines.length; li++) { let t = 0; for (const i of P.lines[li]) t += v[i]; if (t !== P.need[li]) return false; }
    for (let i = 0; i < P.N; i++) if (v[i]) for (const j of P.n8[i]) if (v[j]) return false;
    let nt = 0;
    for (let i = 0; i < P.N; i++) nt += v[i];
    if (nt !== P.trees.length) return false;
    return tnMatch(P, v).ok;
  };

  // what the rules rule out at a glance: trees, cells beside no tree, the ring around every tent
  T.tnImplied = function (P, v) {
    const out = new Uint8Array(P.N);
    for (let i = 0; i < P.N; i++) if (v[i] === 1) for (const j of P.n8[i]) if (v[j] !== 1) out[j] = 1;
    return out;
  };

  function tnWhy(P, c) {
    if (!c) return '';
    const w = P.w;
    if (c.t === 'touch') return 'two tents would touch';
    if (c.t === 'over') return lineName(c.li, P.h) + ' would get more than its ' + plural(P.need[c.li], 'tent');
    if (c.t === 'under') return lineName(c.li, P.h) + ' could no longer get its ' + plural(P.need[c.li], 'tent');
    if (c.t === 'tree') return 'the tree at ' + cellName(c.at, w) + ' would be left without a tent of its own';
    if (c.t === 'tent') return 'the tent at ' + cellName(c.at, w) + ' would have no tree of its own';
    return 'the rules would break';
  }

  // ways to put k tents among the open cells of a line, no two side by side
  function tnLinePlacements(cells, k, cap) {
    const out = [], cur = [];
    const dfs = (j) => {
      if (out.length >= cap) return;
      if (cur.length === k) { out.push(cur.slice()); return; }
      if (cells.length - j < k - cur.length) return;
      for (let t = j; t < cells.length; t++) {
        if (cur.length && cells[t].pos - cur[cur.length - 1].pos < 2) continue;
        cur.push(cells[t]);
        dfs(t + 1);
        cur.pop();
      }
    };
    dfs(0);
    return out;
  }

  /* The next step from position v (every mark right). Level 1: the count of a
   * line, a tree with one free spot; 2: every way to fill a line; 3: suppose…;
   * 4: deeper. */
  T.tnStep = function (P, v0, maxLevel) {
    maxLevel = maxLevel || 4;
    const w = P.w, h = P.h;
    const v = Int8Array.from(v0);
    for (let i = 0; i < P.N; i++) if (P.tree[i] || !P.cand[i]) v[i] = 0;
    const imp = T.tnImplied(P, v);
    for (let i = 0; i < P.N; i++) if (imp[i] && v[i] < 0) v[i] = 0;
    const open = (li) => P.lines[li].filter((i) => v[i] < 0);
    const tentsIn = (li) => P.lines[li].reduce((a, i) => a + (v[i] === 1 ? 1 : 0), 0);
    // 1a a line with all its tents
    for (let li = 0; li < P.lines.length; li++) {
      const o = open(li);
      if (!o.length) continue;
      const t = tentsIn(li), need = P.need[li];
      if (t === need) {
        return { level: 1, set: o.map((i) => [i, 0]), focus: P.lines[li], line: li, text: need === 0
          ? LineName(li, h) + ' has the count **0**: no tent at all goes in it, so its open cells are grass.'
          : LineName(li, h) + ' already has its ' + plural(need, 'tent') + ': the rest of it is grass.' };
      }
    }
    // 1b a line with exactly enough room
    for (let li = 0; li < P.lines.length; li++) {
      const o = open(li);
      if (!o.length) continue;
      const t = tentsIn(li), need = P.need[li];
      if (t + o.length === need) {
        return { level: 1, set: o.map((i) => [i, 1]), focus: P.lines[li], line: li, text: LineName(li, h) + ' needs ' + (t ? plural(need - t, 'more tent') : plural(need, 'tent')) + ' and has only ' + (o.length === 1 ? 'one cell' : word(o.length) + ' cells') + ' left that could hold ' + (o.length === 1 ? 'one' : 'them') + ': ' + (o.length === 1 ? 'it is a tent.' : 'each is a tent.') };
      }
    }
    // 1c a tree with one free spot
    for (let t = 0; t < P.trees.length; t++) {
      const av = P.treeNb[t].filter((j) => v[j] !== 0);
      if (av.length === 1 && v[av[0]] < 0) {
        return { level: 1, set: [[av[0], 1]], focus: [P.trees[t]], text: 'The tree at ' + cellName(P.trees[t], w) + ' has only one spot left beside it where a tent could go: its tent is at ' + cellName(av[0], w) + '.' };
      }
    }
    if (maxLevel < 2) return null;
    // 2 every way to place the tents a line still needs
    let best = null;
    for (let li = 0; li < P.lines.length; li++) {
      const o = open(li);
      if (!o.length) continue;
      const k = P.need[li] - tentsIn(li);
      if (k <= 0) continue;
      const isRow = li < h;
      const cells = o.map((i) => ({ i, pos: isRow ? i % w : Math.floor(i / w) }));
      const pl = tnLinePlacements(cells, k, 3000);
      if (!pl.length || pl.length >= 3000) continue;
      const tents = o.filter((i) => pl.every((p) => p.some((c) => c.i === i)));
      const grass = o.filter((i) => !pl.some((p) => p.some((c) => c.i === i)));
      const beside = [];
      const seen = new Set(o);
      const around = new Set();
      o.forEach((i) => P.n8[i].forEach((j) => { if (!seen.has(j) && v[j] < 0) around.add(j); }));
      around.forEach((j) => { if (pl.every((p) => p.some((c) => P.n8[j].includes(c.i)))) beside.push(j); });
      let set, kind;
      if (tents.length) { set = tents.map((i) => [i, 1]); kind = 'tents'; }
      else if (beside.length) { set = beside.map((i) => [i, 0]); kind = 'beside'; }
      else if (grass.length) { set = grass.map((i) => [i, 0]); kind = 'grass'; }
      else continue;
      const score = pl.length * 10 - set.length + (kind === 'grass' ? 3 : 0);
      if (!best || score < best.score) best = { li, pl, set, kind, score, k, o };
    }
    if (best) {
      const li = best.li, cells = best.set.map((x) => x[0]);
      const at = cells.length === 1 ? 'the cell at ' + cellName(cells[0], w) : cells.length <= 3 ? 'the cells at ' + cells.map((i) => cellName(i, w)).join(' and ') : word(cells.length) + ' cells (outlined)';
      const spots = cells.length <= 3 ? cells.map((i) => cellName(i, w)).join(' and ') : word(cells.length) + ' cells (outlined)';
      const intro = LineName(li, h) + ' needs ' + plural(best.k, 'more tent') + ' among its ' + word(best.o.length) + ' open cells, and tents may not touch. ';
      const ways = best.pl.length === 1 ? 'There is only one way to place ' + (best.k === 1 ? 'it' : 'them') + ', and it ' : 'Of the ' + best.pl.length + ' ways to place ' + (best.k === 1 ? 'it' : 'them') + ', every one ';
      let text;
      if (best.kind === 'tents') text = intro + ways + (cells.length === 1 ? 'puts a tent at ' : 'puts tents at ') + spots + '.';
      else if (best.kind === 'beside') text = intro + ways + 'puts a tent right next to ' + at + ' (in the ' + (li < h ? 'row' : 'column') + ' alongside): ' + (cells.length === 1 ? 'that cell is grass.' : 'those cells are grass.');
      else text = intro + (best.pl.length === 1 ? 'The only way to place them leaves ' : 'No way of placing them uses ') + at + ': grass.';
      return { level: 2, set: best.set, focus: P.lines[li], line: li, text };
    }
    if (maxLevel < 3) return null;
    // 3 suppose…
    for (const val of [1, 0]) {
      for (let x = 0; x < P.N; x++) {
        if (v[x] >= 0) continue;
        const t = Int8Array.from(v);
        t[x] = val;
        const c = tnProp(P, t);
        if (!c) continue;
        const focus = c.li != null ? P.lines[c.li] : c.at != null ? [c.at] : c.cell != null ? [c.cell, c.other] : [];
        return { level: 3, set: [[x, 1 - val]], focus: focus.filter((i) => i != null), text: (val === 1 ? 'Suppose a tent went at ' + cellName(x, w) : 'Suppose the cell at ' + cellName(x, w) + ' were grass') + '. Follow the rules from there and ' + tnWhy(P, c) + '. So ' + (val === 1 ? 'it is grass.' : 'it holds a tent.') };
      }
    }
    if (maxLevel < 4) return null;
    const res = T.tnCount(P, v, 1);
    if (!res.sol) return null;
    for (let x = 0; x < P.N; x++) if (v[x] < 0 && res.sol[x] === 1) return { level: 4, set: [[x, 1]], focus: [x], text: 'This one needs a long chain of reasoning. There is a tent at ' + cellName(x, w) + ' — can you see why?' };
    return null;
  };

  T.tnGrade = function (P, maxLevel) {
    const v = T.tnInit(P);
    const count = [0, 0, 0, 0, 0];
    for (let guard = 0; guard < 3000; guard++) {
      const st = T.tnStep(P, v, maxLevel || 4);
      if (!st) break;
      count[st.level]++;
      st.set.forEach(([i, x]) => { v[i] = x; });
      const imp = T.tnImplied(P, v);
      for (let i = 0; i < P.N; i++) if (imp[i] && v[i] < 0) v[i] = 0;
    }
    let open = 0;
    for (let i = 0; i < P.N; i++) if (v[i] < 0) open++;
    let top = 0;
    for (let k = 4; k >= 1; k--) if (count[k]) { top = k; break; }
    return { count, top, open };
  };

  T.tnDiff = (w, h, g) => clamp(Math.round((w * h <= 36 ? 0.6 : w * h <= 64 ? 1.2 : w * h <= 100 ? 1.9 : w * h <= 144 ? 2.6 : 3.1) + [0, 0, 0.9, 1.9, 2.6][g.top] + Math.min(0.6, (g.count[2] + 2 * g.count[3]) * 0.05) - 0.3), 1, 5);

  // a random camp: tents that do not touch, each with a tree beside it; kept if the counts pin it down
  T.tnMake = function (w, h, rng, density, maxLevel) {
    const N = w * h, { n4, n8 } = nbrs(w, h);
    const tent = new Uint8Array(N), tree = new Uint8Array(N);
    const target = Math.round(N * density);
    let placed = 0;
    for (const c of rng.shuffle(Array.from({ length: N }, (_, i) => i))) {
      if (placed >= target) break;
      if (tent[c] || tree[c]) continue;
      if (n8[c].some((j) => tent[j])) continue;
      const spots = n4[c].filter((j) => !tent[j] && !tree[j]);
      if (!spots.length) continue;
      tent[c] = 1;
      tree[spots[rng.int(spots.length)]] = 1;
      placed++;
    }
    if (placed < target * 0.8) return null;
    const grid = toRows(tree, w, (x) => (x ? 'T' : '.'));
    const rows = [], cols = [];
    for (let r = 0; r < h; r++) { let k = 0; for (let c = 0; c < w; c++) k += tent[r * w + c]; rows.push(k); }
    for (let c = 0; c < w; c++) { let k = 0; for (let r = 0; r < h; r++) k += tent[r * w + c]; cols.push(k); }
    const P = T.tnPrep(grid, rows, cols);
    const cnt = T.tnCount(P, null, 2, 60000);
    if (cnt.count !== 1 || cnt.aborted) return null;
    const g = T.tnGrade(P, maxLevel || 3);
    if (g.open) return null;
    return { w, h, grid, rows, cols, sol: toRows(tent, w, (x) => (x ? '*' : '.')), grade: g, diff: T.tnDiff(w, h, g), trees: placed };
  };

  /* =====================================================================
   *  DOMINOSA
   *  grid: n + 1 rows of n + 2 digits 0..n, a full set of double-n dominoes.
   *  An edge is a pair of neighbouring cells; edge values: -1 open,
   *  0 not a domino (a line drawn between them), 1 a domino.
   *  sol: one letter per cell, where its partner is: l r u d.
   * ===================================================================== */

  T.dmType = (n, a, b) => { if (a > b) { const t = a; a = b; b = t; } return a * (n + 1) - (a * (a - 1)) / 2 + (b - a); };

  T.dmPrep = function (grid) {
    const h = grid.length, w = grid[0].length, N = w * h, n = h - 1;
    const num = new Int8Array(N);
    for (let i = 0; i < N; i++) num[i] = +grid[Math.floor(i / w)][i % w];
    const nT = (n + 1) * (n + 2) / 2;
    const E = [], cellEdges = [], typeEdges = [], types = [];
    for (let i = 0; i < N; i++) cellEdges.push([]);
    for (let t = 0; t < nT; t++) typeEdges.push([]);
    for (let a = 0; a <= n; a++) for (let b = a; b <= n; b++) types[T.dmType(n, a, b)] = [a, b];
    const right = new Int32Array(N).fill(-1), down = new Int32Array(N).fill(-1);
    const add = (a, b, hz) => {
      const t = T.dmType(n, num[a], num[b]), e = E.length;
      E.push({ a, b, t, hz });
      cellEdges[a].push(e); cellEdges[b].push(e); typeEdges[t].push(e);
      if (hz) right[a] = e; else down[a] = e;
    };
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / w), c = i % w;
      if (c + 1 < w) add(i, i + 1, true);
      if (r + 1 < h) add(i, i + w, false);
    }
    return { n, w, h, N, num, E, nE: E.length, cellEdges, typeEdges, nT, types, right, down };
  };
  // the edge between two neighbouring cells
  T.dmEdge = (P, a, b) => { if (a > b) { const t = a; a = b; b = t; } return b === a + 1 ? P.right[a] : b === a + P.w ? P.down[a] : -1; };
  T.dmTypeName = (P, t) => P.types[t][0] + '–' + P.types[t][1];
  const dmWhere = (P, e) => {
    const E = P.E[e], r = Math.floor(E.a / P.w), c = E.a % P.w;
    return E.hz ? 'row ' + (r + 1) + ', columns ' + (c + 1) + '–' + (c + 2) : 'column ' + (c + 1) + ', rows ' + (r + 1) + '–' + (r + 2);
  };
  T.dmWhere = dmWhere;

  // the edges a solution's letters describe
  T.dmSolEdges = function (P, sol) {
    const out = [];
    for (let i = 0; i < P.N; i++) {
      const ch = sol[Math.floor(i / P.w)][i % P.w];
      if (ch === 'r') out.push(P.right[i]);
      else if (ch === 'd') out.push(P.down[i]);
    }
    return out;
  };
  T.dmSolString = function (P, edges) {
    const s = new Array(P.N).fill('?');
    edges.forEach((e) => { const E = P.E[e]; if (E.hz) { s[E.a] = 'r'; s[E.b] = 'l'; } else { s[E.a] = 'd'; s[E.b] = 'u'; } });
    return toRows(s, P.w, (x) => x);
  };

  // cells covered and dominoes used by the placed edges
  function dmCover(P, s) {
    const cov = new Int32Array(P.N).fill(-1), used = new Int32Array(P.nT).fill(-1);
    let clash = null;
    for (let e = 0; e < P.nE; e++) {
      if (s[e] !== 1) continue;
      const E = P.E[e];
      if (cov[E.a] >= 0 || cov[E.b] >= 0) clash = clash || { t: 'overlap', e, other: cov[E.a] >= 0 ? cov[E.a] : cov[E.b] };
      if (used[E.t] >= 0) clash = clash || { t: 'twice', type: E.t, e, other: used[E.t] };
      cov[E.a] = cov[E.b] = e;
      used[E.t] = e;
    }
    return { cov, used, clash };
  }
  T.dmCover = dmCover;

  // rule out everything a placed domino excludes (its cells' other edges, its twins)
  function dmImply(P, s) {
    let any = false;
    for (let e = 0; e < P.nE; e++) {
      if (s[e] !== 1) continue;
      const E = P.E[e];
      for (const f of P.cellEdges[E.a]) if (f !== e && s[f] < 0) { s[f] = 0; any = true; }
      for (const f of P.cellEdges[E.b]) if (f !== e && s[f] < 0) { s[f] = 0; any = true; }
      for (const f of P.typeEdges[E.t]) if (f !== e && s[f] < 0) { s[f] = 0; any = true; }
    }
    return any;
  }

  function dmProp(P, s) {
    for (let guard = 0; guard < 1000; guard++) {
      const k = dmCover(P, s);
      if (k.clash) return k.clash;
      if (dmImply(P, s)) continue;
      let changed = false;
      for (let i = 0; i < P.N && !changed; i++) {
        if (k.cov[i] >= 0) continue;
        let one = -1, cnt = 0;
        for (const e of P.cellEdges[i]) if (s[e] < 0) { cnt++; one = e; }
        if (!cnt) return { t: 'cell', cell: i };
        if (cnt === 1) { s[one] = 1; changed = true; }
      }
      for (let t = 0; t < P.nT && !changed; t++) {
        if (k.used[t] >= 0) continue;
        let one = -1, cnt = 0;
        for (const e of P.typeEdges[t]) if (s[e] < 0) { cnt++; one = e; }
        if (!cnt) return { t: 'type', type: t };
        if (cnt === 1) { s[one] = 1; changed = true; }
      }
      if (!changed) return null;
    }
    return null;
  }
  T.dmProp = dmProp;

  // count solutions by exact cover: every cell once, every domino once
  T.dmCount = function (P, s0, limit, nodeLimit) {
    const s = s0 ? Int8Array.from(s0) : new Int8Array(P.nE).fill(-1);
    if (s0 && dmProp(P, s)) return { count: 0, sols: [] };
    const rows = [], rowEdge = [];
    for (let e = 0; e < P.nE; e++) {
      if (s[e] === 0) continue;
      const E = P.E[e];
      rows.push([E.a, E.b, P.N + E.t]);
      rowEdge.push(e);
    }
    const res = C.DLX.solve({ primary: P.N + P.nT, rows, max: limit || 2, nodeLimit: nodeLimit || 2e6 });
    return { count: res.length, sols: res.map((sol) => sol.map((ri) => rowEdge[ri])), aborted: !!res.aborted };
  };

  T.dmValid = function (P, edges) {
    const s = new Int8Array(P.nE);
    edges.forEach((e) => { s[e] = 1; });
    const k = dmCover(P, s);
    if (k.clash) return false;
    for (let i = 0; i < P.N; i++) if (k.cov[i] < 0) return false;
    return true;
  };

  function dmWhy(P, c) {
    if (c.t === 'overlap') return 'two dominoes would need the same cell';
    if (c.t === 'twice') return 'the **' + T.dmTypeName(P, c.type) + '** would turn up twice';
    if (c.t === 'cell') return 'the **' + P.num[c.cell] + '** at ' + cellName(c.cell, P.w) + ' would be left with no partner';
    if (c.t === 'type') return 'there would be no place left for the **' + T.dmTypeName(P, c.type) + '**';
    return 'the set would not work out';
  }

  /* The next step. Level 1: a domino with one place left, a number with one
   * partner left; 2: every place of a domino uses one cell, every partner of
   * a cell makes the same domino; 3: suppose…; 4: deeper. */
  T.dmStep = function (P, s0, maxLevel) {
    maxLevel = maxLevel || 4;
    const s = Int8Array.from(s0);
    dmImply(P, s);
    const k = dmCover(P, s);
    const openAt = (i) => P.cellEdges[i].filter((e) => s[e] < 0);
    const openOf = (t) => P.typeEdges[t].filter((e) => s[e] < 0);
    const nm = (t) => '**' + T.dmTypeName(P, t) + '**';
    const cellsOf = (es) => { const out = []; es.forEach((e) => { out.push(P.E[e].a, P.E[e].b); }); return out; };
    // 1a a domino with one place left
    for (let t = 0; t < P.nT; t++) {
      if (k.used[t] >= 0) continue;
      const o = openOf(t);
      if (o.length !== 1) continue;
      return { level: 1, set: [[o[0], 1]], focus: cellsOf([o[0]]), text: 'There is only one place left for the ' + nm(t) + ': ' + dmWhere(P, o[0]) + '.' };
    }
    // 1b a number with one partner left
    for (let i = 0; i < P.N; i++) {
      if (k.cov[i] >= 0) continue;
      const o = openAt(i);
      if (o.length !== 1) continue;
      const E = P.E[o[0]], j = E.a === i ? E.b : E.a;
      return { level: 1, set: [[o[0], 1]], focus: [i], text: 'The **' + P.num[i] + '** at ' + cellName(i, P.w) + ' has only one neighbour left to pair with, the **' + P.num[j] + '** ' + (j === i + 1 ? 'to its right' : j === i - 1 ? 'to its left' : j > i ? 'below it' : 'above it') + ': that makes a ' + nm(E.t) + '.' };
    }
    if (maxLevel < 2) return null;
    // 2a every place a domino can go uses one cell
    for (let t = 0; t < P.nT; t++) {
      if (k.used[t] >= 0) continue;
      const o = openOf(t);
      if (o.length < 2) continue;
      let common = [P.E[o[0]].a, P.E[o[0]].b];
      for (const e of o) common = common.filter((x) => x === P.E[e].a || x === P.E[e].b);
      for (const x of common) {
        const others = openAt(x).filter((e) => !o.includes(e));
        if (!others.length) continue;
        return { level: 2, set: others.map((e) => [e, 0]), focus: cellsOf(o), text: 'The ' + nm(t) + ' can still go in ' + word(o.length) + ' places, and every one of them uses the **' + P.num[x] + '** at ' + cellName(x, P.w) + '. So that cell belongs to the ' + nm(t) + ' and cannot pair with any other neighbour: draw ' + (others.length === 1 ? 'a line' : 'lines') + ' there.' };
      }
    }
    // 2b every partner of a cell makes the same domino
    for (let i = 0; i < P.N; i++) {
      if (k.cov[i] >= 0) continue;
      const o = openAt(i);
      if (o.length < 2) continue;
      const t = P.E[o[0]].t;
      if (!o.every((e) => P.E[e].t === t)) continue;
      const others = openOf(t).filter((e) => !o.includes(e));
      if (!others.length) continue;
      return { level: 2, set: others.map((e) => [e, 0]), focus: [i].concat(cellsOf(others)), text: 'Whichever neighbour the **' + P.num[i] + '** at ' + cellName(i, P.w) + ' pairs with, it makes a ' + nm(t) + '. So the ' + nm(t) + ' is used up there, and its other possible places (outlined) are not dominoes.' };
    }
    if (maxLevel < 3) return null;
    // 3 suppose…
    for (let e = 0; e < P.nE; e++) {
      if (s[e] >= 0) continue;
      const t = Int8Array.from(s);
      t[e] = 1;
      const c = dmProp(P, t);
      if (!c) continue;
      const focus = c.cell != null ? [c.cell] : c.type != null ? cellsOf(P.typeEdges[c.type]) : [];
      return { level: 3, set: [[e, 0]], focus: focus.concat(cellsOf([e])), text: 'Suppose ' + dmWhere(P, e) + ' held a domino (a ' + nm(P.E[e].t) + '). Follow the rules from there and ' + dmWhy(P, c) + '. So those two cells are not one domino: draw a line between them.' };
    }
    if (maxLevel < 4) return null;
    const res = T.dmCount(P, s, 1);
    if (!res.count) return null;
    const e = res.sols[0].find((x) => s[x] < 0);
    if (e == null) return null;
    return { level: 4, set: [[e, 1]], focus: cellsOf([e]), text: 'This needs a long chain of reasoning. The ' + nm(P.E[e].t) + ' lies at ' + dmWhere(P, e) + ' — can you see why?' };
  };

  T.dmGrade = function (P, maxLevel) {
    const s = new Int8Array(P.nE).fill(-1);
    const count = [0, 0, 0, 0, 0];
    for (let guard = 0; guard < 4000; guard++) {
      const st = T.dmStep(P, s, maxLevel || 4);
      if (!st) break;
      count[st.level]++;
      st.set.forEach(([e, x]) => { s[e] = x; });
      dmImply(P, s);
    }
    const k = dmCover(P, s);
    let open = 0;
    for (let i = 0; i < P.N; i++) if (k.cov[i] < 0) open++;
    let top = 0;
    for (let q = 4; q >= 1; q--) if (count[q]) { top = q; break; }
    return { count, top, open };
  };

  T.dmDiff = (n, g) => clamp(Math.round(({ 2: 0.4, 3: 0.7, 4: 1.2, 5: 1.8, 6: 2.3, 7: 2.8, 8: 3.2, 9: 3.5 }[n] || 3) + [0, 0, 0.8, 1.5, 2.2][g.top] + Math.min(0.5, (g.count[2] + 2 * g.count[3]) * 0.04) - 0.2), 1, 5);

  // a random tiling of the rectangle by dominoes: mate[i] = the other half
  function dmTiling(w, h, rng) {
    const N = w * h, mate = new Int32Array(N).fill(-1);
    let nodes = 0;
    const rec = (i) => {
      while (i < N && mate[i] >= 0) i++;
      if (i >= N) return true;
      if (++nodes > 20000) return false;
      const opts = [];
      if (i % w + 1 < w && mate[i + 1] < 0) opts.push(i + 1);
      if (i + w < N && mate[i + w] < 0) opts.push(i + w);
      rng.shuffle(opts);
      for (const j of opts) {
        mate[i] = j; mate[j] = i;
        if (rec(i + 1)) return true;
        mate[i] = mate[j] = -1;
      }
      return false;
    };
    if (!rec(0)) return null;
    // stir: turn pairs of parallel dominoes filling a 2 × 2 square, many times over
    for (let k = 0; k < N * 40; k++) {
      const i = rng.int(N), c = i % w;
      if (c + 1 >= w || i + w >= N) continue;
      const a = i, b = i + 1, d = i + w, e = i + w + 1;
      if (mate[a] === b && mate[d] === e) { mate[a] = d; mate[d] = a; mate[b] = e; mate[e] = b; }
      else if (mate[a] === d && mate[b] === e) { mate[a] = b; mate[b] = a; mate[d] = e; mate[e] = d; }
    }
    return mate;
  }

  // a random set laid out at random, then numbers swapped until only one layout fits
  T.dmMake = function (n, rng, maxLevel, budgetMs) {
    const h = n + 1, w = n + 2, N = w * h;
    const t0 = now(), budget = budgetMs || 1500;
    const mate = dmTiling(w, h, rng);
    if (!mate) return null;
    const doms = [];
    for (let i = 0; i < N; i++) if (mate[i] > i) doms.push([i, mate[i]]);
    const types = [];
    for (let a = 0; a <= n; a++) for (let b = a; b <= n; b++) types.push([a, b]);
    rng.shuffle(types);
    const num = new Int8Array(N);
    const put = (k, ty) => { const flip = rng() < 0.5; num[doms[k][0]] = flip ? ty[1] : ty[0]; num[doms[k][1]] = flip ? ty[0] : ty[1]; };
    doms.forEach((d, k) => put(k, types[k]));
    const gridOf = () => toRows(num, w, String);
    const key = (a, b) => (a < b ? a * N + b : b * N + a);
    const mine = new Set(doms.map(([a, b]) => key(a, b)));
    const LIM = 12;
    let P = T.dmPrep(gridOf()), cnt = T.dmCount(P, null, LIM);
    for (let it = 0; cnt.count > 1 && it < 600 && now() - t0 < budget; it++) {
      // dominoes of ours that another layout does not use
      const alt = cnt.sols.find((sol) => sol.some((e) => !mine.has(key(P.E[e].a, P.E[e].b))));
      if (!alt) break;
      const altSet = new Set(alt.map((e) => key(P.E[e].a, P.E[e].b)));
      const diff = [];
      doms.forEach((d, k) => { if (!altSet.has(key(d[0], d[1]))) diff.push(k); });
      const k1 = diff[rng.int(diff.length)];
      const save = Int8Array.from(num);
      if (rng() < 0.35) { const a = doms[k1][0], b = doms[k1][1]; const x = num[a]; num[a] = num[b]; num[b] = x; }
      else {
        let k2 = rng.int(doms.length);
        if (k2 === k1) k2 = (k2 + 1) % doms.length;
        const ta = [num[doms[k1][0]], num[doms[k1][1]]], tb = [num[doms[k2][0]], num[doms[k2][1]]];
        put(k1, tb); put(k2, ta);
      }
      const P2 = T.dmPrep(gridOf()), c2 = T.dmCount(P2, null, LIM);
      if (c2.count >= 1 && (c2.count < cnt.count || (c2.count === cnt.count && rng() < 0.4))) { P = P2; cnt = c2; }
      else num.set(save);
    }
    if (cnt.count !== 1) return null;
    const g = T.dmGrade(P, maxLevel || 3);
    if (g.open) return null;
    const edges = doms.map(([a, b]) => T.dmEdge(P, a, b));
    return { n, grid: gridOf(), sol: T.dmSolString(P, edges), grade: g, diff: T.dmDiff(n, g) };
  };

  /* =====================================================================
   *  SINGLES (HITORI)
   *  grid rows: one base-36 digit per cell (1–9, a = 10, b = 11 …).
   *  Black out cells so that no number repeats among the white cells of a
   *  row or column, no two black cells touch, and the white cells stay in
   *  one piece. Values: -1 unknown, 0 white, 1 black. sol rows: '#' black.
   * ===================================================================== */

  T.htPrep = function (grid) {
    const h = grid.length, w = grid[0].length, N = w * h;
    const num = new Int8Array(N);
    for (let i = 0; i < N; i++) num[i] = parseInt(grid[Math.floor(i / w)][i % w], 36);
    const { n4 } = nbrs(w, h);
    const lines = linesOf(w, h);
    const same = [], sameRow = [], sameCol = [];
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / w), c = i % w;
      const a = lines[r].filter((j) => j !== i && num[j] === num[i]);
      const b = lines[h + c].filter((j) => j !== i && num[j] === num[i]);
      sameRow.push(a); sameCol.push(b); same.push(a.concat(b));
    }
    return { w, h, N, num, n4, lines, same, sameRow, sameCol };
  };

  // cut vertices of the graph of cells that are not black (Tarjan)
  function htArtic(P, v) {
    const N = P.N, disc = new Int32Array(N).fill(-1), low = new Int32Array(N), ap = new Uint8Array(N);
    let time = 0;
    const dfs = (u, parent) => {
      disc[u] = low[u] = time++;
      let children = 0;
      for (const x of P.n4[u]) {
        if (v[x] === 1) continue;
        if (disc[x] < 0) {
          children++;
          dfs(x, u);
          if (low[x] < low[u]) low[u] = low[x];
          if (parent >= 0 && low[x] >= disc[u]) ap[u] = 1;
        } else if (x !== parent && disc[x] < low[u]) low[u] = disc[x];
      }
      if (parent < 0 && children > 1) ap[u] = 1;
    };
    for (let u = 0; u < N; u++) if (v[u] !== 1 && disc[u] < 0) dfs(u, -1);
    return ap;
  }
  T.htArtic = htArtic;

  // the pieces the cells that are not black fall into
  function htPieces(P, v) {
    const id = new Int32Array(P.N).fill(-1), pieces = [];
    for (let s = 0; s < P.N; s++) {
      if (v[s] === 1 || id[s] >= 0) continue;
      const cells = [s];
      id[s] = pieces.length;
      for (let k = 0; k < cells.length; k++) for (const x of P.n4[cells[k]]) if (v[x] !== 1 && id[x] < 0) { id[x] = pieces.length; cells.push(x); }
      pieces.push(cells);
    }
    return { id, pieces };
  }
  T.htPieces = htPieces;

  /* The rules until nothing changes: black -> its neighbours white, white ->
   * its twins in the row and column black, and a cell whose blacking would
   * cut the rest apart white (its white neighbours could never meet). */
  function htProp(P, v, deep) {
    for (let guard = 0; guard < 2000; guard++) {
      let changed = false;
      for (let i = 0; i < P.N; i++) {
        if (v[i] === 1) {
          for (const j of P.n4[i]) {
            if (v[j] === 1) return { t: 'adj', cell: i, other: j };
            if (v[j] < 0) { v[j] = 0; changed = true; }
          }
        } else if (v[i] === 0) {
          for (const j of P.same[i]) {
            if (v[j] === 0) return { t: 'dup', cell: i, other: j };
            if (v[j] < 0) { v[j] = 1; changed = true; }
          }
        }
      }
      if (changed) continue;
      const pc = htPieces(P, v);
      if (pc.pieces.length > 1) return { t: 'split', cells: pc.pieces[pc.pieces.length - 1] };
      if (deep === false) return null;
      const ap = htArtic(P, v);
      for (let i = 0; i < P.N; i++) if (ap[i] && v[i] < 0) { v[i] = 0; changed = true; }
      if (!changed) return null;
    }
    return null;
  }
  T.htProp = htProp;

  T.htCount = function (P, v0, limit, nodeCap) {
    limit = limit || 2;
    nodeCap = nodeCap || 100000;
    let count = 0, sol = null, nodes = 0, aborted = false;
    const rec = (v) => {
      if (count >= limit) return;
      if (++nodes > nodeCap) { aborted = true; return; }
      if (htProp(P, v, true)) return;
      let best = -1, bs = -1;
      for (let i = 0; i < P.N; i++) {
        if (v[i] >= 0) continue;
        let k = 0;
        for (const j of P.same[i]) if (v[j] < 0) k++;
        if (k > bs) { bs = k; best = i; }
      }
      if (best < 0) { count++; sol = Int8Array.from(v); return; }
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

  T.htValid = function (P, black) {
    const v = new Int8Array(P.N);
    for (let i = 0; i < P.N; i++) v[i] = black[i] ? 1 : 0;
    for (let i = 0; i < P.N; i++) {
      if (v[i] === 1) { for (const j of P.n4[i]) if (v[j] === 1) return false; }
      else for (const j of P.same[i]) if (v[j] === 0) return false;
    }
    return htPieces(P, v).pieces.length <= 1;
  };

  const htD = (P, i) => '**' + P.num[i] + '**';
  function htWhy(P, c) {
    if (c.t === 'adj') return 'two black cells would touch';
    if (c.t === 'dup') {
      const inRow = Math.floor(c.cell / P.w) === Math.floor(c.other / P.w);
      return 'two ' + htD(P, c.cell) + 's would stay white in ' + (inRow ? 'row ' + (Math.floor(c.cell / P.w) + 1) : 'column ' + (c.cell % P.w + 1));
    }
    if (c.t === 'split') return 'the white cells would be cut into separate parts';
    return 'the rules would break';
  }

  /* The next step. The cells beside a black cell count as white. Level 1: a
   * white number blacks out its twins; 2: two twins side by side, a number
   * between twins, a cell that holds the white area together; 3: suppose…;
   * 4: deeper. */
  T.htStep = function (P, v0, maxLevel) {
    maxLevel = maxLevel || 4;
    const w = P.w, h = P.h;
    const v = Int8Array.from(v0);
    const implied = new Uint8Array(P.N);
    for (let i = 0; i < P.N; i++) if (v[i] === 1) for (const j of P.n4[i]) if (v[j] < 0) { v[j] = 0; implied[j] = 1; }
    // 1 a white number and its twins
    for (let i = 0; i < P.N; i++) {
      if (v[i] !== 0) continue;
      const twins = P.same[i].filter((j) => v[j] < 0);
      if (!twins.length) continue;
      const rowT = P.sameRow[i].filter((j) => v[j] < 0), colT = P.sameCol[i].filter((j) => v[j] < 0);
      const where = [];
      if (rowT.length) where.push('row ' + (Math.floor(i / w) + 1));
      if (colT.length) where.push('column ' + (i % w + 1));
      const why = implied[i] ? ' sits next to a black cell, so it stays white' : ' is circled (white)';
      return { level: 1, set: twins.map((j) => [j, 1]), focus: [i], text: 'The ' + htD(P, i) + ' at ' + cellName(i, w) + why + '. Then the other ' + htD(P, i) + (twins.length === 1 ? '' : 's') + ' in ' + andList(where) + ' must be black.' };
    }
    if (maxLevel < 2) return null;
    // 2a twins side by side
    for (let li = 0; li < P.lines.length; li++) {
      const cells = P.lines[li];
      for (let t = 0; t + 1 < cells.length; t++) {
        const a = cells[t], b = cells[t + 1];
        if (P.num[a] !== P.num[b] || v[a] !== -1 || v[b] !== -1) continue;
        const others = cells.filter((j) => j !== a && j !== b && P.num[j] === P.num[a] && v[j] < 0);
        if (!others.length) continue;
        return { level: 2, set: others.map((j) => [j, 1]), focus: [a, b], text: LineName(li, h) + ' has two ' + htD(P, a) + 's side by side. They cannot both be white, and they cannot both be black (black cells never touch), so exactly one of them stays white — and every other ' + htD(P, a) + ' in ' + lineName(li, h) + ' must be black.' };
      }
    }
    // 2b a number between twins
    for (let li = 0; li < P.lines.length; li++) {
      const cells = P.lines[li];
      for (let t = 0; t + 2 < cells.length; t++) {
        const a = cells[t], m = cells[t + 1], b = cells[t + 2];
        if (P.num[a] !== P.num[b] || v[m] !== -1 || v[a] === 1 || v[b] === 1) continue;
        return { level: 2, set: [[m, 0]], focus: [a, b], text: 'The ' + htD(P, m) + ' at ' + cellName(m, w) + ' sits between two ' + htD(P, a) + 's. One of those has to be black, and either one would touch it: it stays white.' };
      }
    }
    // 2c a cell that holds the white area together
    const ap = htArtic(P, v);
    for (let i = 0; i < P.N; i++) {
      if (!ap[i] || v[i] !== -1) continue;
      return { level: 2, set: [[i, 0]], focus: P.n4[i].filter((j) => v[j] !== 1), text: 'If the cell at ' + cellName(i, w) + ' were black, the white cells around it could never meet again (it is the only link between two parts of the grid): it stays white.' };
    }
    if (maxLevel < 3) return null;
    // 3 suppose…
    for (const val of [1, 0]) {
      for (let x = 0; x < P.N; x++) {
        if (v[x] >= 0) continue;
        const t = Int8Array.from(v);
        t[x] = val;
        const c = htProp(P, t, true);
        if (!c) continue;
        const focus = c.cell != null ? [c.cell, c.other] : [];
        return { level: 3, set: [[x, 1 - val]], focus, text: 'Suppose the ' + htD(P, x) + ' at ' + cellName(x, w) + ' were ' + (val ? 'black' : 'white') + '. Follow the rules from there and ' + htWhy(P, c) + '. So it is ' + (val ? 'white.' : 'black.') };
      }
    }
    if (maxLevel < 4) return null;
    const res = T.htCount(P, v, 1);
    if (!res.sol) return null;
    for (let x = 0; x < P.N; x++) if (v[x] < 0 && res.sol[x] === 1) return { level: 4, set: [[x, 1]], focus: [x], text: 'This needs a long chain of reasoning. The ' + htD(P, x) + ' at ' + cellName(x, w) + ' is black — can you see why?' };
    return null;
  };

  T.htGrade = function (P, maxLevel) {
    const v = new Int8Array(P.N).fill(-1);
    const count = [0, 0, 0, 0, 0];
    for (let guard = 0; guard < 3000; guard++) {
      const st = T.htStep(P, v, maxLevel || 4);
      if (!st) break;
      count[st.level]++;
      st.set.forEach(([i, x]) => { v[i] = x; });
      for (let i = 0; i < P.N; i++) if (v[i] === 1) for (const j of P.n4[i]) if (v[j] < 0) v[j] = 0;
    }
    let open = 0;
    for (let i = 0; i < P.N; i++) if (v[i] < 0) open++;
    let top = 0;
    for (let q = 4; q >= 1; q--) if (count[q]) { top = q; break; }
    return { count, top, open };
  };

  T.htDiff = (n, g) => clamp(Math.round((n <= 5 ? 0.5 : n <= 6 ? 1 : n <= 7 ? 1.5 : n <= 8 ? 2 : n <= 9 ? 2.6 : 3.2) + [0, 0, 0.7, 1.6, 2.3][g.top] + Math.min(0.6, (g.count[2] + 2 * g.count[3]) * 0.04) - 0.2), 1, 5);

  // a random Latin square (rows of 1..n, every number once per row and column)
  function randLatin(n, rng) {
    for (let attempt = 0; attempt < 40; attempt++) {
      const g = new Int8Array(n * n), rowU = new Int32Array(n), colU = new Int32Array(n);
      let nodes = 0;
      const rec = (i) => {
        if (i === n * n) return true;
        if (++nodes > 20000) return false;
        const r = Math.floor(i / n), c = i % n;
        const opts = rng.shuffle(Array.from({ length: n }, (_, k) => k + 1));
        for (const x of opts) {
          const b = 1 << x;
          if ((rowU[r] & b) || (colU[c] & b)) continue;
          g[i] = x; rowU[r] |= b; colU[c] |= b;
          if (rec(i + 1)) return true;
          rowU[r] &= ~b; colU[c] &= ~b;
        }
        return false;
      };
      if (rec(0)) return g;
    }
    return null;
  }
  T.randLatin = randLatin;

  /* A random Latin square; black cells that never touch, keep the white area
   * in one piece and leave no white cell free to be blacked as well; each
   * black cell then copies a white number of its row or column. Kept when
   * exactly one shading works. */
  T.htMake = function (n, rng, maxLevel, budgetMs) {
    const t0 = now(), budget = budgetMs || 1000;
    const lat = randLatin(n, rng);
    if (!lat) return null;
    const N = n * n, { n4 } = nbrs(n, n);
    const P0 = { N, n4 };
    const v = new Int8Array(N);   // 1 black, 0 white
    const whitesJoined = () => htPieces(P0, v).pieces.length <= 1;
    const canBlack = (c) => {
      if (v[c] || n4[c].some((j) => v[j])) return false;
      v[c] = 1;
      const ok = whitesJoined();
      v[c] = 0;
      return ok;
    };
    for (const c of rng.shuffle(Array.from({ length: N }, (_, i) => i))) if (rng() < 0.45 && canBlack(c)) v[c] = 1;
    // every white cell must be pinned: beside a black cell, or holding the white area together
    for (let pass = 0; pass < 6; pass++) {
      const ap = htArtic(P0, v);
      const loose = [];
      for (let i = 0; i < N; i++) if (!v[i] && !ap[i] && !n4[i].some((j) => v[j])) loose.push(i);
      if (!loose.length) break;
      for (const u of rng.shuffle(loose)) {
        if (v[u] || n4[u].some((j) => v[j])) continue;
        for (const x of rng.shuffle([u].concat(n4[u]))) if (canBlack(x)) { v[x] = 1; break; }
      }
    }
    {
      const ap = htArtic(P0, v);
      for (let i = 0; i < N; i++) if (!v[i] && !ap[i] && !n4[i].some((j) => v[j])) return null;
    }
    const num = Int8Array.from(lat);
    const blacks = [];
    for (let i = 0; i < N; i++) if (v[i]) blacks.push(i);
    const lines = linesOf(n, n);
    const pickNum = (b) => {
      const r = Math.floor(b / n), c = b % n;
      const pool = lines[r].concat(lines[n + c]).filter((j) => !v[j]);
      num[b] = lat[pool[rng.int(pool.length)]];
    };
    blacks.forEach(pickNum);
    const gridOf = () => toRows(num, n, (x) => x.toString(36));
    const solStr = toRows(v, n, (x) => (x ? '#' : '.'));
    for (let it = 0; it < 60 && now() - t0 < budget; it++) {
      const P = T.htPrep(gridOf());
      const cnt = T.htCount(P, null, 2, 40000);
      if (cnt.aborted) return null;
      if (cnt.count === 1) {
        const g = T.htGrade(P, maxLevel || 3);
        if (g.open) return null;
        return { n, grid: gridOf(), sol: solStr, grade: g, diff: T.htDiff(n, g), blacks: blacks.length };
      }
      // another shading exists: change the numbers of a few black cells where the two differ
      const other = cnt.sol;
      const diff = blacks.filter((b) => !other || other[b] !== 1);
      const pool = diff.length ? diff : blacks;
      for (let k = 0; k < 2; k++) pickNum(pool[rng.int(pool.length)]);
    }
    return null;
  };

  /* =====================================================================
   *  FILLING (FILLOMINO)
   *  grid rows: a digit 1–9 given, '.' empty; sol rows: every digit.
   *  Every group of equal digits joined side to side has exactly that many
   *  cells. Values: 0 empty, 1–9; candidates: bit d of a mask.
   * ===================================================================== */

  const FULL = 0x3FE;
  const pop = (m) => { let k = 0; while (m) { m &= m - 1; k++; } return k; };
  const lowDigit = (m) => { for (let d = 1; d <= 9; d++) if (m & (1 << d)) return d; return 0; };
  const digitsOf = (m) => { const a = []; for (let d = 1; d <= 9; d++) if (m & (1 << d)) a.push(d); return a; };
  T.digitsOf = digitsOf;

  T.flPrep = function (grid) {
    const h = grid.length, w = grid[0].length, N = w * h;
    const given = new Int8Array(N);
    for (let i = 0; i < N; i++) { const ch = grid[Math.floor(i / w)][i % w]; given[i] = ch >= '1' && ch <= '9' ? +ch : 0; }
    const { n4 } = nbrs(w, h);
    return { w, h, N, given, n4 };
  };

  // the groups of equal digits
  function flRegions(P, v) {
    const id = new Int32Array(P.N).fill(-1), regs = [];
    for (let s = 0; s < P.N; s++) {
      if (!v[s] || id[s] >= 0) continue;
      const d = v[s], cells = [s];
      id[s] = regs.length;
      for (let k = 0; k < cells.length; k++) for (const x of P.n4[cells[k]]) if (v[x] === d && id[x] < 0) { id[x] = regs.length; cells.push(x); }
      regs.push({ d, cells, size: cells.length });
    }
    return { id, regs };
  }
  T.flRegions = flRegions;

  // cells a region of digit d could still take, within `m` steps of the region (m = cells it lacks)
  function flReach(P, v, cand, R, skip) {
    const d = R.d, bit = 1 << d, m = d - R.size;
    const dist = new Int32Array(P.N).fill(-1);
    const q = [];
    R.cells.forEach((c) => { dist[c] = 0; q.push(c); });
    let got = 0;
    for (let k = 0; k < q.length; k++) {
      const c = q[k];
      if (dist[c] >= m) continue;
      for (const x of P.n4[c]) {
        if (dist[x] >= 0 || x === skip) continue;
        if (v[x] ? v[x] !== d : !(cand[x] & bit)) continue;
        dist[x] = dist[c] + 1;
        got++;
        q.push(x);
      }
    }
    return got;
  }

  /* Rule out digits, placing nothing: next to a finished group, joining
   * groups into too many cells, no room for that many. `why` (optional)
   * records the reason per cell and digit: 1 finished, 2 join, 3 room.
   * Returns null or the contradiction met. */
  function flElim(P, v, cand, why) {
    const N = P.N;
    for (let guard = 0; guard < 50; guard++) {
      let changed = false;
      const drop = (c, d, code) => { const b = 1 << d; if (cand[c] & b) { cand[c] &= ~b; changed = true; if (why) why[c * 10 + d] = code; } };
      const { id, regs } = flRegions(P, v);
      for (const R of regs) {
        if (R.size > R.d) return { t: 'big', cells: R.cells, d: R.d };
        if (R.size === R.d) for (const c of R.cells) for (const x of P.n4[c]) if (!v[x]) drop(x, R.d, 1);
      }
      for (let c = 0; c < N; c++) {
        if (v[c]) continue;
        for (let d = 1; d <= 9; d++) {
          if (!(cand[c] & (1 << d))) continue;
          let total = 1;
          const seen = [];
          for (const x of P.n4[c]) if (v[x] === d && !seen.includes(id[x])) { seen.push(id[x]); total += regs[id[x]].size; }
          if (total > d) drop(c, d, 2);
        }
      }
      // room: the cells that could share a digit with each other
      for (let d = 2; d <= 9; d++) {
        const bit = 1 << d, comp = new Int32Array(N).fill(-1);
        for (let s = 0; s < N; s++) {
          if (comp[s] >= 0 || (v[s] ? v[s] !== d : !(cand[s] & bit))) continue;
          const cells = [s];
          comp[s] = s;
          for (let k = 0; k < cells.length; k++) for (const x of P.n4[cells[k]]) {
            if (comp[x] >= 0 || (v[x] ? v[x] !== d : !(cand[x] & bit))) continue;
            comp[x] = s; cells.push(x);
          }
          if (cells.length >= d) continue;
          for (const c of cells) {
            if (v[c]) return { t: 'trapped', cells: regs[id[c]].cells, d };
            drop(c, d, 3);
          }
        }
      }
      for (const R of regs) {
        if (R.size >= R.d) continue;
        if (flReach(P, v, cand, R, -1) < R.d - R.size) return { t: 'trapped', cells: R.cells, d: R.d };
      }
      for (let c = 0; c < N; c++) if (!v[c] && !cand[c]) return { t: 'none', cell: c };
      if (!changed) return null;
    }
    return null;
  }
  T.flElim = flElim;

  function flCandsOf(P, v) {
    const cand = new Uint16Array(P.N);
    for (let i = 0; i < P.N; i++) cand[i] = v[i] ? 1 << v[i] : FULL;
    return cand;
  }

  // an incomplete group must pass through x if without x it cannot reach its size
  function flMustPass(P, v, cand, regs) {
    for (const R of regs) {
      if (R.size >= R.d) continue;
      const need = R.d - R.size, bit = 1 << R.d;
      const front = new Set();
      R.cells.forEach((c) => P.n4[c].forEach((x) => { if (!v[x] && (cand[x] & bit)) front.add(x); }));
      // every cell within reach is a suspect; test the nearest ones first
      const dist = new Int32Array(P.N).fill(-1), q = [];
      R.cells.forEach((c) => { dist[c] = 0; q.push(c); });
      const suspects = [];
      for (let k = 0; k < q.length; k++) {
        const c = q[k];
        if (dist[c] >= need) continue;
        for (const x of P.n4[c]) {
          if (dist[x] >= 0) continue;
          if (v[x] ? v[x] !== R.d : !(cand[x] & bit)) continue;
          dist[x] = dist[c] + 1;
          q.push(x);
          if (!v[x]) suspects.push(x);
        }
      }
      for (const x of suspects) if (flReach(P, v, cand, R, x) < need) return { R, x };
    }
    return null;
  }

  /* Solve by rules alone. level 1: eliminations, cells with one digit left,
   * groups with one way out; 2: + cells a group must pass through; 3: +
   * trying each digit of a cell one step deep. Returns { ok, done, v }. */
  function flProp(P, v, cand, level) {
    for (let guard = 0; guard < 4 * P.N + 20; guard++) {
      const c = flElim(P, v, cand, null);
      if (c) return c;
      let placed = false;
      for (let i = 0; i < P.N; i++) if (!v[i] && pop(cand[i]) === 1) { v[i] = lowDigit(cand[i]); placed = true; }
      if (placed) continue;
      const { regs } = flRegions(P, v);
      for (const R of regs) {
        if (R.size >= R.d) continue;
        const bit = 1 << R.d;
        const exits = new Set();
        R.cells.forEach((c0) => P.n4[c0].forEach((x) => { if (!v[x] && (cand[x] & bit)) exits.add(x); }));
        if (exits.size === 1) { const x = exits.values().next().value; v[x] = R.d; cand[x] = bit; placed = true; break; }
      }
      if (placed) continue;
      if (level >= 2) {
        const mp = flMustPass(P, v, cand, regs);
        if (mp) { v[mp.x] = mp.R.d; cand[mp.x] = 1 << mp.R.d; continue; }
      }
      if (level >= 3) {
        let cut = false;
        for (let i = 0; i < P.N && !cut; i++) {
          if (v[i] || pop(cand[i]) > 3) continue;
          for (const d of digitsOf(cand[i])) {
            const v2 = Int8Array.from(v), c2 = Uint16Array.from(cand);
            v2[i] = d; c2[i] = 1 << d;
            if (flProp(P, v2, c2, 2)) { cand[i] &= ~(1 << d); cut = true; }
          }
        }
        if (cut) continue;
      }
      return null;
    }
    return null;
  }
  T.flProp = flProp;

  T.flSolve = function (P, level, v0) {
    const v = v0 ? Int8Array.from(v0) : Int8Array.from(P.given);
    const cand = flCandsOf(P, v);
    const c = flProp(P, v, cand, level || 2);
    let open = 0;
    for (let i = 0; i < P.N; i++) if (!v[i]) open++;
    return { ok: !c, contra: c, done: !c && !open, open, v, cand };
  };

  // every group the right size?
  T.flValid = function (P, v) {
    for (let i = 0; i < P.N; i++) if (!(v[i] >= 1 && v[i] <= 9)) return false;
    return flRegions(P, v).regs.every((R) => R.size === R.d);
  };

  function flWhy(P, c) {
    if (c.t === 'big') return 'a group of ' + c.d + 's would grow past ' + c.d + ' cells';
    if (c.t === 'trapped') return 'a group of ' + c.d + 's would be shut in before reaching ' + c.d + ' cells';
    if (c.t === 'none') return 'the cell at ' + cellName(c.cell, P.w) + ' would have no size left that fits';
    return 'the sizes would not add up';
  }
  T.flWhy = flWhy;

  // why an empty cell can only take digit d
  const an = (d) => (d === 8 || d === 11 ? 'an ' : 'a ');
  T.an = an;
  function flSingleText(P, c, d, why) {
    const done = [], join = [], room = [], other = [];
    for (let e = 1; e <= 9; e++) {
      if (e === d) continue;
      const k = why[c * 10 + e];
      (k === 1 ? done : k === 2 ? join : k === 3 ? room : other).push(e);
    }
    const parts = [];
    if (done.length) parts.push(done.length > 1 ? 'it touches finished groups of ' + listNums(done) : 'it touches a finished group of ' + done[0]);
    if (join.length) parts.push((join.length === 1 ? an(join[0]) + '**' + join[0] + '**' : 'a ' + listNums(join)) + ' would merge with the group' + (join.length > 1 ? 's' : '') + ' beside it into too many cells');
    if (room.length) {
      const lo = Math.min(...room);
      const run = room.every((e, k) => e === lo + k) && room[room.length - 1] === 9;
      parts.push(run ? 'there is no room around it for a group of ' + lo + ' or more' : 'there is no room for a group of ' + listNums(room).replace(/ and ([^ ]+)$/, ' or $1'));
    }
    if (other.length) parts.push('the rest (' + listNums(other) + ') are ruled out by the same kind of reasoning one step on');
    return 'The empty cell at ' + cellName(c, P.w) + ' can only be ' + an(d) + '**' + d + '**: ' + andList(parts) + '.';
  }

  /* The next step from position v (every digit right). Level 1: a group with
   * one way out, a cell with one size left; 2: a cell a group must pass
   * through; 3: every other size at a cell leads to a dead end; 4: deeper.
   * `sol` (optional) is the answer, for the explanations of levels 3–4. */
  T.flStep = function (P, v0, maxLevel, sol) {
    maxLevel = maxLevel || 4;
    const v = Int8Array.from(v0);
    const cand = flCandsOf(P, v);
    const why = new Uint8Array(P.N * 10);
    if (flElim(P, v, cand, why)) return null;
    const { regs } = flRegions(P, v);
    const D = (d) => '**' + d + '**';
    // 1a a group with one way out
    let best = null;
    for (const R of regs) {
      if (R.size >= R.d) continue;
      const bit = 1 << R.d, exits = new Set();
      R.cells.forEach((c0) => P.n4[c0].forEach((x) => { if (!v[x] && (cand[x] & bit)) exits.add(x); }));
      if (exits.size !== 1) continue;
      const x = exits.values().next().value;
      if (!best || R.size > best.R.size) best = { R, x };
    }
    if (best) {
      const R = best.R, x = best.x;
      const lack = R.d - R.size;
      return { level: 1, set: [[x, R.d]], focus: R.cells, text: (R.size === 1 ? 'The ' + D(R.d) + ' at ' + cellName(R.cells[0], P.w) : 'The group of ' + D(R.d) + 's (' + plural(R.size, 'cell') + ' so far)') + ' needs ' + plural(lack, 'more cell') + ', and the only way it can grow is into ' + cellName(x, P.w) + '.' };
    }
    // 1b a cell with one size left
    for (let c = 0; c < P.N; c++) {
      if (v[c] || pop(cand[c]) !== 1) continue;
      const d = lowDigit(cand[c]);
      return { level: 1, set: [[c, d]], focus: [c], text: flSingleText(P, c, d, why) };
    }
    if (maxLevel < 2) return null;
    // 2 a cell a group must pass through
    const mp = flMustPass(P, v, cand, regs);
    if (mp) {
      const R = mp.R;
      return { level: 2, set: [[mp.x, R.d]], focus: R.cells, text: (R.size === 1 ? 'The ' + D(R.d) + ' at ' + cellName(R.cells[0], P.w) : 'The group of ' + D(R.d) + 's') + ' still needs ' + plural(R.d - R.size, 'more cell') + '. Without the cell at ' + cellName(mp.x, P.w) + ' it could never gather them — there is not room enough within reach — so it must grow through it.' };
    }
    if (maxLevel < 3) return null;
    // 3 every other size at one cell leads to a dead end
    let answer = sol;
    if (!answer) { const s = T.flSolve(P, 3, v); answer = s.done ? s.v : null; }
    if (!answer) return null;
    const order = [];
    for (let c = 0; c < P.N; c++) if (!v[c]) order.push(c);
    order.sort((a, b) => pop(cand[a]) - pop(cand[b]));
    for (const c of order) {
      const d = answer[c];
      if (!(cand[c] & (1 << d))) continue;
      const fails = [];
      let all = true;
      for (const e of digitsOf(cand[c])) {
        if (e === d) continue;
        const v2 = Int8Array.from(v), c2 = Uint16Array.from(cand);
        v2[c] = e; c2[c] = 1 << e;
        const k = flProp(P, v2, c2, 2);
        if (!k) { all = false; break; }
        fails.push(an(e) + D(e) + ' there, and ' + flWhy(P, k));
        if (fails.length > 4) break;
      }
      if (!all || !fails.length) continue;
      return { level: 3, set: [[c, d]], focus: [c], text: 'Try the other sizes at ' + cellName(c, P.w) + '. ' + fails.slice(0, 3).map((f) => 'Put ' + f + '.').join(' ') + (fails.length > 3 ? ' (The others fail the same way.)' : '') + ' Only ' + an(d) + D(d) + ' survives.' };
    }
    if (maxLevel < 4) return null;
    for (const c of order) return { level: 4, set: [[c, answer[c]]], focus: [c], text: 'This needs a long chain of reasoning. The cell at ' + cellName(c, P.w) + ' is ' + an(answer[c]) + D(answer[c]) + ' — can you see why?' };
    return null;
  };

  // the lowest level of rules that finishes the grid (0: none does)
  T.flGrade = function (P) {
    for (let lv = 1; lv <= 3; lv++) if (T.flSolve(P, lv).done) return lv;
    return 0;
  };
  T.flDiff = (w, h, top, clueFrac) => clamp(Math.round((w * h <= 30 ? 0.3 : w * h <= 49 ? 0.9 : w * h <= 64 ? 1.5 : w * h <= 90 ? 2 : w * h <= 120 ? 2.6 : 3.1) + [0, 0, 0.9, 1.8][top] + (clueFrac < 0.3 ? 0.4 : 0) + 0.2), 1, 5);

  // a random cut of the grid into groups of 1–9 cells, no two equal groups touching
  const FL_WEIGHTS = [0, 10, 16, 18, 14, 10, 7, 5, 3, 3];
  function flPartition(w, h, rng, weights) {
    const N = w * h, { n4 } = nbrs(w, h);
    const W = weights || FL_WEIGHTS, tot = W.reduce((a, b) => a + b, 0);
    const pick = () => { let x = rng() * tot; for (let d = 1; d <= 9; d++) { x -= W[d]; if (x < 0) return d; } return 9; };
    const reg = new Int32Array(N).fill(-1);
    let nReg = 0;
    for (const s of rng.shuffle(Array.from({ length: N }, (_, i) => i))) {
      if (reg[s] >= 0) continue;
      const target = pick(), cells = [s];
      reg[s] = nReg;
      while (cells.length < target) {
        const front = [];
        cells.forEach((c) => n4[c].forEach((x) => { if (reg[x] < 0 && !front.includes(x)) front.push(x); }));
        if (!front.length) break;
        const x = front[rng.int(front.length)];
        reg[x] = nReg;
        cells.push(x);
      }
      nReg++;
    }
    const sizeOf = () => { const s = new Int32Array(nReg); for (let i = 0; i < N; i++) s[reg[i]]++; return s; };
    const connectedWithout = (k, skip) => {
      let start = -1, total = 0;
      for (let i = 0; i < N; i++) if (reg[i] === k && i !== skip) { total++; if (start < 0) start = i; }
      if (!total) return false;
      const seen = new Set([start]), st = [start];
      while (st.length) { const i = st.pop(); for (const x of n4[i]) if (reg[x] === k && x !== skip && !seen.has(x)) { seen.add(x); st.push(x); } }
      return seen.size === total;
    };
    for (let guard = 0; guard < 400; guard++) {
      const size = sizeOf();
      let clash = null;
      for (let i = 0; i < N && !clash; i++) for (const x of n4[i]) if (reg[x] !== reg[i] && size[reg[x]] === size[reg[i]]) { clash = [reg[i], reg[x]]; break; }
      if (!clash) {
        const sol = new Int8Array(N);
        for (let i = 0; i < N; i++) sol[i] = size[reg[i]];
        if (Array.from(sol).some((x) => x > 9)) return null;
        return sol;
      }
      const [a, b] = clash;
      if (size[a] * 2 <= 9 && rng() < 0.7) { for (let i = 0; i < N; i++) if (reg[i] === b) reg[i] = a; continue; }
      // move a border cell of a (or b) to a third neighbour
      let moved = false;
      for (const k of rng.shuffle([a, b])) {
        const cells = rng.shuffle(Array.from({ length: N }, (_, i) => i).filter((i) => reg[i] === k));
        for (const c of cells) {
          if (cells.length === 1) break;
          const others = n4[c].map((x) => reg[x]).filter((r) => r !== k && size[r] < 9);
          if (!others.length || !connectedWithout(k, c)) continue;
          reg[c] = others[rng.int(others.length)];
          moved = true;
          break;
        }
        if (moved) break;
      }
      if (!moved) return null;
    }
    return null;
  }
  T.flPartition = flPartition;

  /* A random cut, then clues taken away one by one while rules of `level`
   * still finish the grid (so the answer is the only one). */
  T.flMake = function (w, h, rng, level, budgetMs, weights) {
    const t0 = now(), budget = budgetMs || 1500;
    const sol = flPartition(w, h, rng, weights);
    if (!sol) return null;
    const N = w * h;
    const giv = Int8Array.from(sol);
    const gridOf = () => toRows(giv, w, (x) => (x ? String(x) : '.'));
    const lv0 = Math.min(level, 2);
    for (const pass of level >= 3 ? [lv0, 3] : [lv0]) {
      for (const i of rng.shuffle(Array.from({ length: N }, (_, k) => k))) {
        if (!giv[i]) continue;
        if (now() - t0 > budget) return null;
        const keep = giv[i];
        giv[i] = 0;
        if (!T.flSolve(T.flPrep(gridOf()), pass).done) giv[i] = keep;
      }
    }
    const P = T.flPrep(gridOf());
    const top = T.flGrade(P);
    if (!top) return null;
    let clues = 0;
    for (let i = 0; i < N; i++) if (giv[i]) clues++;
    return { w, h, grid: gridOf(), sol: toRows(sol, w, String), top, clues, diff: T.flDiff(w, h, top, clues / N), ms: now() - t0 };
  };

  /* =====================================================================
   *  RECTANGLES (SHIKAKU)
   *  data: w, h, clues [[row, col, n], …]; sol [[row, col, rows, cols], …]
   *  in the order of the clues. Every rectangle holds exactly one number,
   *  equal to its area. A clue's candidates: every rectangle that could be
   *  its own (the right area, on the grid, no other number inside).
   * ===================================================================== */

  T.skPrep = function (w, h, clues) {
    const N = w * h, K = clues.length;
    const clueAt = new Int32Array(N).fill(-1);
    clues.forEach(([r, c], k) => { clueAt[r * w + c] = k; });
    // how many numbers in a rectangle, by a summed table
    const S = new Int32Array((w + 1) * (h + 1));
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) S[(r + 1) * (w + 1) + c + 1] = S[r * (w + 1) + c + 1] + S[(r + 1) * (w + 1) + c] - S[r * (w + 1) + c] + (clueAt[r * w + c] >= 0 ? 1 : 0);
    const inRect = (r0, c0, rh, rw) => S[(r0 + rh) * (w + 1) + c0 + rw] - S[r0 * (w + 1) + c0 + rw] - S[(r0 + rh) * (w + 1) + c0] + S[r0 * (w + 1) + c0];
    const cands = [], cover = [];
    for (let i = 0; i < N; i++) cover.push([]);
    clues.forEach(([r, c, n], k) => {
      const list = [];
      for (let rh = 1; rh <= Math.min(n, h); rh++) {
        if (n % rh) continue;
        const rw = n / rh;
        if (rw > w) continue;
        for (let r0 = Math.max(0, r - rh + 1); r0 <= Math.min(r, h - rh); r0++) {
          for (let c0 = Math.max(0, c - rw + 1); c0 <= Math.min(c, w - rw); c0++) {
            if (inRect(r0, c0, rh, rw) !== 1) continue;
            const cells = [];
            for (let rr = r0; rr < r0 + rh; rr++) for (let cc = c0; cc < c0 + rw; cc++) cells.push(rr * w + cc);
            list.push({ r: r0, c: c0, rh, rw, cells });
          }
        }
      }
      list.forEach((q, j) => q.cells.forEach((i) => cover[i].push(k * 4096 + j)));
      cands.push(list);
    });
    return { w, h, N, K, clues, clueAt, cands, cover, cell: clues.map(([r, c]) => r * w + c), num: clues.map((q) => q[2]) };
  };
  const skShape = (q) => (q.rw === q.rh ? q.rw + ' by ' + q.rh + ' square' : q.rw + ' wide and ' + q.rh + ' tall');
  const skFrom = (P, q) => (q.rw * q.rh === 1 ? 'just its own cell' : 'the ' + skShape(q) + (q.rw === q.rh ? '' : ' rectangle') + ' from ' + cellName(q.r * P.w + q.c, P.w));
  T.skShape = skShape;
  T.skFind = (P, k, r, c, rh, rw) => P.cands[k].findIndex((q) => q.r === r && q.c === c && q.rh === rh && q.rw === rw);

  // count by exact cover: every cell exactly once (each candidate holds one number)
  T.skCount = function (P, limit, alive) {
    const rows = [], who = [];
    P.cands.forEach((list, k) => list.forEach((q, j) => { if (alive && !alive[k][j]) return; rows.push(q.cells); who.push([k, j]); }));
    const res = C.DLX.solve({ primary: P.N, rows, max: limit || 2, nodeLimit: 3e6 });
    return { count: res.length, sols: res.map((s) => { const pick = new Int32Array(P.K).fill(-1); s.forEach((ri) => { pick[who[ri][0]] = who[ri][1]; }); return pick; }), aborted: !!res.aborted };
  };

  T.skValid = function (P, pick) {
    const cov = new Uint8Array(P.N);
    for (let k = 0; k < P.K; k++) {
      const q = P.cands[k][pick[k]];
      if (!q) return false;
      for (const i of q.cells) { if (cov[i]) return false; cov[i] = 1; }
    }
    return cov.every((x) => x);
  };

  function skAliveOf(P, placed) {
    const alive = P.cands.map((list) => new Uint8Array(list.length).fill(1));
    placed.forEach((j, k) => { if (j >= 0) { alive[k].fill(0); alive[k][j] = 1; } });
    return alive;
  }

  /* Knock out candidates that cross placed rectangles; with deep, also: a
   * cell only one number can reach, cells every shape of a number covers.
   * `log` collects what each deep move did. Returns null or a contradiction. */
  function skElim(P, alive, placed, deep, log, once) {
    for (let guard = 0; guard < 200; guard++) {
      let changed = false;
      const covered = new Int32Array(P.N).fill(-1);
      for (let k = 0; k < P.K; k++) {
        if (placed[k] < 0) continue;
        for (const i of P.cands[k][placed[k]].cells) { if (covered[i] >= 0) return { t: 'overlap', cell: i }; covered[i] = k; }
      }
      for (let k = 0; k < P.K; k++) {
        if (placed[k] >= 0) continue;
        let n = 0;
        P.cands[k].forEach((q, j) => { if (alive[k][j] && q.cells.some((i) => covered[i] >= 0)) { alive[k][j] = 0; changed = true; } if (alive[k][j]) n++; });
        if (!n) return { t: 'clue', k };
      }
      for (let i = 0; i < P.N; i++) {
        if (covered[i] >= 0) continue;
        if (!P.cover[i].some((x) => alive[x >> 12][x & 4095] && placed[x >> 12] < 0)) return { t: 'cell', cell: i };
      }
      if (changed) continue;
      if (!deep) return null;
      // a cell only one number can reach
      for (let i = 0; i < P.N && !changed; i++) {
        if (covered[i] >= 0) continue;
        const ks = new Set();
        P.cover[i].forEach((x) => { if (alive[x >> 12][x & 4095]) ks.add(x >> 12); });
        if (ks.size !== 1) continue;
        const k = ks.values().next().value;
        let cut = 0;
        P.cands[k].forEach((q, j) => { if (alive[k][j] && !q.cells.includes(i)) { alive[k][j] = 0; cut++; } });
        if (cut) { changed = true; if (log) log.push({ t: 'reach', k, cell: i }); }
      }
      // cells every shape of a number covers
      for (let k = 0; k < P.K && !changed; k++) {
        if (placed[k] >= 0) continue;
        let common = null;
        P.cands[k].forEach((q, j) => { if (!alive[k][j]) return; common = common ? common.filter((i) => q.cells.includes(i)) : q.cells.slice(); });
        if (!common || !common.length) continue;
        const hit = [];
        for (let k2 = 0; k2 < P.K; k2++) {
          if (k2 === k || placed[k2] >= 0) continue;
          P.cands[k2].forEach((q, j) => { if (alive[k2][j] && q.cells.some((i) => common.includes(i))) { alive[k2][j] = 0; if (!hit.includes(k2)) hit.push(k2); } });
        }
        if (hit.length) { changed = true; if (log) log.push({ t: 'claim', k, cells: common, hit }); }
      }
      if (!changed || once) return null;
    }
    return null;
  }

  // rules and placements until stuck; level 1 plain, 2 deep eliminations, 3 + trials
  function skProp(P, alive, placed, level) {
    for (let guard = 0; guard < 4 * P.K + 20; guard++) {
      const c = skElim(P, alive, placed, level >= 2);
      if (c) return c;
      let did = false;
      for (let k = 0; k < P.K; k++) {
        if (placed[k] >= 0) continue;
        let n = 0, one = -1;
        alive[k].forEach((a, j) => { if (a) { n++; one = j; } });
        if (n === 1) { placed[k] = one; did = true; }
      }
      if (did) continue;
      const covered = new Uint8Array(P.N);
      placed.forEach((j, k) => { if (j >= 0) P.cands[k][j].cells.forEach((i) => { covered[i] = 1; }); });
      for (let i = 0; i < P.N && !did; i++) {
        if (covered[i]) continue;
        const xs = P.cover[i].filter((x) => alive[x >> 12][x & 4095] && placed[x >> 12] < 0);
        if (xs.length === 1) { const k = xs[0] >> 12, j = xs[0] & 4095; alive[k].fill(0); alive[k][j] = 1; placed[k] = j; did = true; }
      }
      if (did) continue;
      if (level >= 3) {
        let cut = false;
        for (let k = 0; k < P.K && !cut; k++) {
          if (placed[k] >= 0) continue;
          alive[k].forEach((a, j) => {
            if (!a || cut) return;
            const al2 = alive.map((x) => Uint8Array.from(x)), pl2 = placed.slice();
            al2[k].fill(0); al2[k][j] = 1; pl2[k] = j;
            if (skProp(P, al2, pl2, 2)) { alive[k][j] = 0; cut = true; }
          });
        }
        if (cut) continue;
      }
      return null;
    }
    return null;
  }

  T.skSolve = function (P, level, placed0) {
    const placed = placed0 ? placed0.slice() : new Array(P.K).fill(-1);
    const alive = skAliveOf(P, placed);
    const c = skProp(P, alive, placed, level || 2);
    return { ok: !c, contra: c, done: !c && placed.every((j) => j >= 0), placed };
  };

  function skWhy(P, c) {
    if (c.t === 'clue') return 'the **' + P.num[c.k] + '** at ' + cellName(P.cell[c.k], P.w) + ' would have no room left for its rectangle';
    if (c.t === 'cell') return 'no rectangle could cover the cell at ' + cellName(c.cell, P.w);
    return 'two rectangles would overlap';
  }
  const skClue = (P, k) => 'the **' + P.num[k] + '** at ' + cellName(P.cell[k], P.w);

  /* The next step: which rectangle to draw, and why. placed[k] = candidate
   * index or -1 (every placed rectangle right). Level 1: a number with one
   * shape left, a cell only one shape covers; 2: narrowing down by cells
   * only one number reaches and cells a number must cover; 3: trying each
   * shape one step deep; 4: deeper. `sol` (optional) the answer. */
  T.skStep = function (P, placed0, maxLevel, sol) {
    maxLevel = maxLevel || 4;
    const placed = placed0.slice();
    const alive = skAliveOf(P, placed);
    if (skElim(P, alive, placed, false)) return null;
    const rectCells = (k, j) => P.cands[k][j].cells;
    const lonely = () => {
      for (let k = 0; k < P.K; k++) {
        if (placed[k] >= 0) continue;
        let n = 0, one = -1;
        alive[k].forEach((a, j) => { if (a) { n++; one = j; } });
        if (n === 1) return { k, j: one };
      }
      return null;
    };
    const onlyCover = () => {
      const covered = new Uint8Array(P.N);
      placed.forEach((j, k) => { if (j >= 0) P.cands[k][j].cells.forEach((i) => { covered[i] = 1; }); });
      for (let i = 0; i < P.N; i++) {
        if (covered[i]) continue;
        const xs = P.cover[i].filter((x) => alive[x >> 12][x & 4095] && placed[x >> 12] < 0);
        if (xs.length === 1) return { k: xs[0] >> 12, j: xs[0] & 4095, cell: i };
      }
      return null;
    };
    let a = lonely();
    if (a) {
      const q = P.cands[a.k][a.j];
      const many = P.cands[a.k].length > 1;
      return { level: 1, set: [[a.k, a.j]], focus: [P.cell[a.k]], rect: q, text: 'The ' + P.num[a.k] + ' at ' + cellName(P.cell[a.k], P.w) + ' has only one rectangle left that fits: ' + skFrom(P, q) + '.' + (many ? ' Every other shape would run off the grid, take in another number or cross a rectangle already drawn.' : '') };
    }
    a = onlyCover();
    if (a) {
      const q = P.cands[a.k][a.j];
      return { level: 1, set: [[a.k, a.j]], focus: [a.cell], rect: q, text: 'Only one rectangle can still cover the cell at ' + cellName(a.cell, P.w) + ': ' + skClue(P, a.k) + ' as ' + skFrom(P, q) + '.' };
    }
    if (maxLevel < 2) return null;
    const log = [];
    for (let round = 0; round < 60; round++) {
      const n0 = log.length;
      if (skElim(P, alive, placed, true, log, true)) return null;
      a = lonely() || onlyCover();
      if (a) {
        const q = P.cands[a.k][a.j], last = log[log.length - 1];
        let text;
        if (last && last.t === 'reach') text = 'Only ' + skClue(P, last.k) + ' can reach the cell at ' + cellName(last.cell, P.w) + ', so its rectangle must cover that cell.';
        else if (last) text = 'Every shape ' + skClue(P, last.k) + ' can still take covers the outlined cells, so no other rectangle may use them.';
        else text = 'Weigh up the shapes that still fit.';
        if (log.length > 1) text = 'Narrow the shapes down step by step: some cells can be reached by only one number, and some are covered by every shape a number can still take. The last step: ' + text.charAt(0).toLowerCase() + text.slice(1);
        text += ' That leaves ' + skClue(P, a.k) + ' just one shape: ' + skFrom(P, q) + '.';
        const focus = last ? (last.t === 'reach' ? [last.cell, P.cell[last.k]] : last.cells) : [];
        return { level: 2, set: [[a.k, a.j]], focus, rect: q, text };
      }
      if (log.length === n0) break;
    }
    if (maxLevel < 3) return null;
    let answer = sol;
    if (!answer) { const r = T.skCount(P, 1, alive); answer = r.count ? r.sols[0] : null; }
    if (!answer) return null;
    const order = [];
    for (let k = 0; k < P.K; k++) if (placed[k] < 0) order.push(k);
    order.sort((x, y) => alive[x].reduce((s, v) => s + v, 0) - alive[y].reduce((s, v) => s + v, 0));
    for (const k of order) {
      const good = answer[k];
      if (!alive[k][good]) continue;
      const fails = [];
      let all = true;
      alive[k].forEach((on, j) => {
        if (!on || j === good || !all) return;
        const al2 = alive.map((x) => Uint8Array.from(x)), pl2 = placed.slice();
        al2[k].fill(0); al2[k][j] = 1; pl2[k] = j;
        const c = skProp(P, al2, pl2, 2);
        if (!c) { all = false; return; }
        fails.push('as ' + skFrom(P, P.cands[k][j]) + ', ' + skWhy(P, c));
      });
      if (!all || !fails.length) continue;
      const q = P.cands[k][good];
      return { level: 3, set: [[k, good]], focus: [P.cell[k]], rect: q, text: 'Try the other shapes of ' + skClue(P, k) + '. ' + fails.slice(0, 2).map((f) => f.charAt(0).toUpperCase() + f.slice(1) + '.').join(' ') + (fails.length > 2 ? ' (The ' + (fails.length - 2 === 1 ? 'last one fails' : 'others fail') + ' the same way.)' : '') + ' Only ' + skFrom(P, q) + ' works.' };
    }
    if (maxLevel < 4) return null;
    const k = order[0];
    if (k == null) return null;
    return { level: 4, set: [[k, answer[k]]], focus: [P.cell[k]], rect: P.cands[k][answer[k]], text: 'This needs a long chain of reasoning. ' + skClue(P, k).charAt(0).toUpperCase() + skClue(P, k).slice(1) + ' is ' + skFrom(P, P.cands[k][answer[k]]) + ' — can you see why?' };
  };

  T.skGrade = function (P, maxLevel, sol) {
    const placed = new Array(P.K).fill(-1);
    const count = [0, 0, 0, 0, 0];
    for (let guard = 0; guard < 2 * P.K + 5; guard++) {
      const st = T.skStep(P, placed, maxLevel || 3, sol);
      if (!st) break;
      count[st.level]++;
      st.set.forEach(([k, j]) => { placed[k] = j; });
    }
    const open = placed.filter((j) => j < 0).length;
    let top = 0;
    for (let q = 4; q >= 1; q--) if (count[q]) { top = q; break; }
    return { count, top, open };
  };
  // Rectangles is mostly a matter of size: a big grid is a long hunt even when every step is plain
  T.skDiff = (w, h, g) => clamp(Math.round((w * h <= 36 ? 0.4 : w * h <= 64 ? 1 : w * h <= 100 ? 1.7 : w * h <= 144 ? 2.7 : w * h <= 196 ? 3.3 : 4.1) + [0, 0, 0.7, 1.5, 2.2][g.top] + Math.min(0.6, (g.count[2] + 2 * g.count[3]) * 0.05) - 0.2), 1, 5);

  // cut the grid into random rectangles, reading order; then a number in each, moved until only one cut fits
  T.skMake = function (w, h, rng, maxArea, maxLevel, budgetMs) {
    const t0 = now(), budget = budgetMs || 1200;
    const N = w * h, cov = new Int32Array(N).fill(-1), rects = [];
    for (let i = 0; i < N; i++) {
      if (cov[i] >= 0) continue;
      const r = Math.floor(i / w), c = i % w;
      const opts = [];
      for (let rh = 1; rh <= h - r; rh++) {
        for (let rw = 1; c + rw <= w; rw++) {
          const area = rh * rw;
          if (area > maxArea) break;
          let free = true;
          for (let rr = r; rr < r + rh && free; rr++) for (let cc = c; cc < c + rw; cc++) if (cov[rr * w + cc] >= 0) { free = false; break; }
          if (!free) break;
          const skinny = Math.max(rh, rw) / Math.min(rh, rw);
          opts.push({ rh, rw, wt: (area === 1 ? 0.15 : area === 2 ? 0.7 : 1) * (skinny > 4 ? 0.35 : 1) });
        }
      }
      let x = rng() * opts.reduce((s, o) => s + o.wt, 0), pick = opts[0];
      for (const o of opts) { x -= o.wt; if (x < 0) { pick = o; break; } }
      for (let rr = r; rr < r + pick.rh; rr++) for (let cc = c; cc < c + pick.rw; cc++) cov[rr * w + cc] = rects.length;
      rects.push({ r, c, rh: pick.rh, rw: pick.rw });
    }
    // grow the single cells into a neighbour when the two make a rectangle
    for (let pass = 0; pass < 3; pass++) {
      for (let k = 0; k < rects.length; k++) {
        const q = rects[k];
        if (!q || q.rh * q.rw !== 1 || rng() < 0.15) continue;
        const opts = [];
        rects.forEach((o, j) => {
          if (!o || j === k || o.rh * o.rw + 1 > maxArea) return;
          if (o.rh === 1 && o.r === q.r && (o.c + o.rw === q.c || q.c + 1 === o.c)) opts.push(j);
          else if (o.rw === 1 && o.c === q.c && (o.r + o.rh === q.r || q.r + 1 === o.r)) opts.push(j);
        });
        if (!opts.length) continue;
        const j = opts[rng.int(opts.length)], o = rects[j];
        rects[j] = { r: Math.min(o.r, q.r), c: Math.min(o.c, q.c), rh: o.rh === 1 && o.r === q.r ? 1 : o.rh + 1, rw: o.rh === 1 && o.r === q.r ? o.rw + 1 : 1 };
        rects[k] = null;
      }
    }
    for (let k = rects.length - 1; k >= 0; k--) if (!rects[k]) rects.splice(k, 1);
    // turn the cut over at random, so that the reading-order leftovers do not always sit at the bottom
    const flipV = rng() < 0.5, flipH = rng() < 0.5;
    rects.forEach((q) => { if (flipV) q.r = h - q.r - q.rh; if (flipH) q.c = w - q.c - q.rw; });
    const clueCell = rects.map((q) => (q.r + rng.int(q.rh)) * w + q.c + rng.int(q.rw));
    const cluesOf = () => rects.map((q, k) => [Math.floor(clueCell[k] / w), clueCell[k] % w, q.rh * q.rw]);
    for (let it = 0; it < 80 && now() - t0 < budget; it++) {
      const clues = cluesOf(), P = T.skPrep(w, h, clues);
      const mine = rects.map((q, k) => T.skFind(P, k, q.r, q.c, q.rh, q.rw));
      const cnt = T.skCount(P, 2);
      if (cnt.aborted) return null;
      if (cnt.count === 1) {
        const g = T.skGrade(P, maxLevel || 3, mine);
        if (g.open) return null;
        const order = clues.map((q, k) => k).sort((a, b) => clueCell[a] - clueCell[b]);
        return { w, h, clues: order.map((k) => clues[k]), sol: order.map((k) => [rects[k].r, rects[k].c, rects[k].rh, rects[k].rw]), grade: g, diff: T.skDiff(w, h, g) };
      }
      const alt = cnt.sols.find((s) => s.some((j, k) => j !== mine[k]));
      const diff = [];
      rects.forEach((q, k) => { if (alt && alt[k] !== mine[k]) diff.push(k); });
      const k = diff.length ? diff[rng.int(diff.length)] : rng.int(rects.length);
      const q = rects[k];
      clueCell[k] = (q.r + rng.int(q.rh)) * w + q.c + rng.int(q.rw);
    }
    return null;
  };
})(typeof window !== 'undefined' ? window : globalThis);

