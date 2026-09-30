/* The Puzzle Cabinet · js/lib/shade-logic.js
 *
 * The reasoning behind the shading puzzles of engines/shade.js, node-safe so
 * that verify(), the generator (tools/gen/shade.js) and the live hints all use
 * the same code:
 *
 *   nonogram   a line solver (every way to fit a clue into a line, counted by
 *              dynamic programming), a whole-grid solver by line logic, and
 *              hints that explain one line's deduction
 *   akari      rule propagation, solution counting, graded logical steps
 *   takuzu     the same, with pairs, sandwiches, counting and line enumeration
 *   starbattle the same, with unit enumeration and confinement
 *
 * Cell values in every solver: -1 unknown, 0 empty (no bulb, no star, a 0 in
 * takuzu), 1 filled (bulb, star, a 1 in takuzu).
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const L = {};
  C.shadeLogic = L;

  /* ---------- words ---------- */

  const ORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const word = (n) => ORD[n] || String(n);
  const cellName = (i, w) => 'row ' + (Math.floor(i / w) + 1) + ', column ' + (i % w + 1);
  L.cellName = cellName;
  // "3", "3 and 5", "3–6 and 9"
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
    if (parts.length === 1) return parts[0];
    return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
  }
  L.listNums = listNums;
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : (many || one + 's'));

  /* =====================================================================
   *  NONOGRAMS
   * ===================================================================== */

  function runsOf(arr) {
    const out = [];
    let r = 0;
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === 1) r++;
      else if (r) { out.push(r); r = 0; }
    }
    if (r) out.push(r);
    return out;
  }
  L.runsOf = runsOf;

  // clues of a picture given as strings ('.' empty, anything else filled)
  L.nonoClues = function (sol) {
    const h = sol.length, w = sol[0].length;
    const rows = [], cols = [];
    for (let r = 0; r < h; r++) { const a = []; for (let c = 0; c < w; c++) a.push(sol[r][c] !== '.' ? 1 : 0); rows.push(runsOf(a)); }
    for (let c = 0; c < w; c++) { const a = []; for (let r = 0; r < h; r++) a.push(sol[r][c] !== '.' ? 1 : 0); cols.push(runsOf(a)); }
    return { rows, cols };
  };

  /* Every way to fit the blocks of `clue` into a line whose cells are known
   * (-1 unknown, 0 empty, 1 filled). Returns null if there is none, else
   * { fill[i]: some arrangement fills cell i, empty[i]: some leaves it empty,
   *   total: the number of arrangements }. */
  function nonoLine(clue, known) {
    const n = known.length, k = clue.length, W = k + 1;
    const z = new Int32Array(n + 1);
    for (let i = 0; i < n; i++) z[i + 1] = z[i] + (known[i] === 0 ? 1 : 0);
    const fits = (a, b) => a >= 0 && b <= n && z[b] - z[a] === 0;
    const pre = new Float64Array((n + 1) * W);
    pre[0] = 1;
    for (let i = 1; i <= n; i++) {
      for (let j = 0; j <= k; j++) {
        let v = 0;
        if (known[i - 1] !== 1) v += pre[(i - 1) * W + j];
        if (j > 0) {
          const s = i - clue[j - 1];
          if (s >= 0 && fits(s, i)) {
            if (s === 0) { if (j === 1) v += 1; }
            else if (known[s - 1] !== 1) v += pre[(s - 1) * W + j - 1];
          }
        }
        pre[i * W + j] = v;
      }
    }
    const total = pre[n * W + k];
    if (!(total > 0)) return null;
    const suf = new Float64Array((n + 2) * W);
    suf[n * W + k] = 1;
    for (let i = n - 1; i >= 0; i--) {
      for (let j = k; j >= 0; j--) {
        let v = 0;
        if (known[i] !== 1) v += suf[(i + 1) * W + j];
        if (j < k) {
          const e = i + clue[j];
          if (e <= n && fits(i, e)) {
            if (e === n) { if (j === k - 1) v += 1; }
            else if (known[e] !== 1) v += suf[(e + 1) * W + j + 1];
          }
        }
        suf[i * W + j] = v;
      }
    }
    const empty = new Uint8Array(n), fill = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      if (known[i] === 1) continue;
      for (let j = 0; j <= k; j++) if (pre[i * W + j] > 0 && suf[(i + 1) * W + j] > 0) { empty[i] = 1; break; }
    }
    const diff = new Int32Array(n + 1);
    for (let j = 0; j < k; j++) {
      const len = clue[j];
      for (let s = 0; s + len <= n; s++) {
        if (!fits(s, s + len)) continue;
        const left = s === 0 ? (j === 0 ? 1 : 0) : (known[s - 1] !== 1 ? pre[(s - 1) * W + j] : 0);
        if (!left) continue;
        const e = s + len;
        const right = e === n ? (j === k - 1 ? 1 : 0) : (known[e] !== 1 ? suf[(e + 1) * W + j + 1] : 0);
        if (!right) continue;
        diff[s]++; diff[e]--;
      }
    }
    let run = 0;
    for (let i = 0; i < n; i++) { run += diff[i]; if (run > 0) fill[i] = 1; }
    return { fill, empty, total };
  }
  L.nonoLine = nonoLine;

  function nonoLines(w, h) {
    const lines = [];
    for (let r = 0; r < h; r++) { const a = []; for (let c = 0; c < w; c++) a.push(r * w + c); lines.push(a); }
    for (let c = 0; c < w; c++) { const a = []; for (let r = 0; r < h; r++) a.push(r * w + c); lines.push(a); }
    return lines;
  }
  L.nonoLines = nonoLines;

  /* Solve by line logic alone. Returns { ok, done, g, sweeps, calls, steps }:
   * ok false = a contradiction; done = every cell decided. `steps` counts
   * line deductions, `hard` those that needed the full line search (not just
   * the overlap of an empty line or finishing a complete line). */
  L.nonoSolve = function (w, h, rows, cols, g0) {
    const lines = nonoLines(w, h), clues = rows.concat(cols);
    const g = g0 ? Int8Array.from(g0) : new Int8Array(w * h).fill(-1);
    let dirty = new Uint8Array(lines.length).fill(1);
    let sweeps = 0, calls = 0, steps = 0, wide = 0;
    for (;;) {
      const next = new Uint8Array(lines.length);
      let any = false;
      for (let li = 0; li < lines.length; li++) {
        if (!dirty[li]) continue;
        const cells = lines[li];
        const known = new Int8Array(cells.length);
        for (let t = 0; t < cells.length; t++) known[t] = g[cells[t]];
        calls++;
        const r = nonoLine(clues[li], known);
        if (!r) return { ok: false, done: false, g, sweeps, calls, steps };
        let got = 0;
        for (let t = 0; t < cells.length; t++) {
          if (known[t] >= 0) continue;
          let v = -1;
          if (!r.empty[t]) v = 1; else if (!r.fill[t]) v = 0;
          if (v < 0) continue;
          const i = cells[t];
          g[i] = v; got++;
          next[li < h ? h + (i % w) : Math.floor(i / w)] = 1;
        }
        if (got) { any = true; steps++; if (r.total > 40) wide++; }
      }
      sweeps++;
      if (!any) break;
      dirty = next;
    }
    let unknown = 0;
    for (let i = 0; i < g.length; i++) if (g[i] < 0) unknown++;
    return { ok: true, done: unknown === 0, unknown, g, sweeps, calls, steps, wide };
  };

  /* The next deduction a person could make on one line, explained.
   * g: the cells decided so far (all of them right). Returns
   * { li, isRow, index, fill: [cells], empty: [cells], text } or null. */
  L.nonoHint = function (w, h, rows, cols, g) {
    const lines = nonoLines(w, h), clues = rows.concat(cols);
    let best = null;
    for (let li = 0; li < lines.length; li++) {
      const cells = lines[li], n = cells.length;
      const known = new Int8Array(n);
      let unk = 0, filled = 0;
      for (let t = 0; t < n; t++) { known[t] = g[cells[t]]; if (known[t] < 0) unk++; else if (known[t] === 1) filled++; }
      if (!unk) continue;
      const r = nonoLine(clues[li], known);
      if (!r) continue;
      const fill = [], empty = [];
      for (let t = 0; t < n; t++) {
        if (known[t] >= 0) continue;
        if (!r.empty[t]) fill.push(t); else if (!r.fill[t]) empty.push(t);
      }
      if (!fill.length && !empty.length) continue;
      const clue = clues[li];
      const asEmpty = Array.from(known, (x) => (x === 1 ? 1 : 0));
      let kind, score;
      if (!clue.length) { kind = 'blank'; score = 0; }
      else if (!fill.length && runsOf(asEmpty).join() === clue.join()) { kind = 'done'; score = 1; }
      else if (unk === n) { kind = 'slack'; score = 2 - fill.length / 100; }
      else if (r.total === 1) { kind = 'one'; score = 3 - (fill.length + empty.length) / 100; }
      else { kind = 'some'; score = 4 + Math.log(r.total) - (fill.length + empty.length) / 100; }
      if (!best || score < best.score) best = { li, kind, score, fill, empty, r, clue, n };
    }
    if (!best) return null;
    const isRow = best.li < h, index = isRow ? best.li : best.li - h;
    const lineName = (isRow ? 'Row ' : 'Column ') + (index + 1);
    const across = isRow ? 'column' : 'row';
    const cellsTxt = (ts) => (ts.length === 1 ? across + ' ' : across + 's ') + listNums(ts.map((t) => t + 1));
    const clueTxt = best.clue.length ? best.clue.join(' ') : '0';
    const sum = best.clue.reduce((a, b) => a + b, 0), k = best.clue.length;
    let text;
    if (best.kind === 'blank') text = '**' + lineName + '** has the clue 0: nothing in it is filled. Cross out the whole line.';
    else if (best.kind === 'done') text = '**' + lineName + '** already shows its whole clue (' + clueTxt + '), so every other cell in it is empty: cross out ' + cellsTxt(best.empty) + '.';
    else if (best.kind === 'slack') {
      const need = sum + k - 1, slack = best.n - need;
      if (slack === 0) text = k === 1 ? '**' + lineName + '** has the clue ' + clueTxt + ': it is filled from end to end.' : '**' + lineName + '** (clue ' + clueTxt + ') fits exactly: the blocks with single gaps between them take all ' + best.n + ' cells.';
      else {
        text = '**' + lineName + '** (clue ' + clueTxt + ') needs at least ' + need + ' of its ' + best.n + ' cells, so each block can slide by at most ' + slack + '. ' +
          (k === 1 ? 'The block of ' + best.clue[0] + ' covers its middle wherever it goes' : 'Every block longer than ' + slack + ' covers its middle cells wherever it goes') +
          ': fill ' + cellsTxt(best.fill) + '.';
      }
    } else {
      const ways = best.r.total;
      const parts = [];
      if (best.fill.length) parts.push('fill ' + cellsTxt(best.fill));
      if (best.empty.length) parts.push((best.fill.length ? 'leave ' : 'leave ') + cellsTxt(best.empty) + ' empty');
      text = '**' + lineName + '** (clue ' + clueTxt + '): ' +
        (ways === 1 ? 'with the cells already decided there is only one way to fit the blocks, and it must ' : 'try every way to fit the blocks around the cells already decided. There are ' + (ways > 999 ? 'many' : ways) + ', and all of them ') +
        parts.join(' and ') + '.';
    }
    const cells = lines[best.li];
    return { li: best.li, isRow, index, fill: best.fill.map((t) => cells[t]), empty: best.empty.map((t) => cells[t]), text, kind: best.kind };
  };

  /* =====================================================================
   *  LIGHT UP (AKARI)
   *  grid rows: '.' white, '#' black, '0'-'4' numbered black
   * ===================================================================== */

  L.akPrep = function (grid) {
    const h = grid.length, w = grid[0].length, N = w * h;
    const black = new Uint8Array(N), num = new Int8Array(N).fill(-1);
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
      const ch = grid[r][c], i = r * w + c;
      if (ch !== '.') { black[i] = 1; if (ch >= '0' && ch <= '4') num[i] = +ch; }
    }
    const hseg = new Int32Array(N).fill(-1), vseg = new Int32Array(N).fill(-1), segs = [];
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
      const i = r * w + c;
      if (black[i] || hseg[i] >= 0) continue;
      const s = [];
      for (let cc = c; cc < w && !black[r * w + cc]; cc++) { hseg[r * w + cc] = segs.length; s.push(r * w + cc); }
      segs.push(s);
    }
    for (let c = 0; c < w; c++) for (let r = 0; r < h; r++) {
      const i = r * w + c;
      if (black[i] || vseg[i] >= 0) continue;
      const s = [];
      for (let rr = r; rr < h && !black[rr * w + c]; rr++) { vseg[rr * w + c] = segs.length; s.push(rr * w + c); }
      segs.push(s);
    }
    const whites = [], nums = [], nbr = [];
    for (let i = 0; i < N; i++) {
      nbr.push([]);
      if (!black[i]) whites.push(i);
      else if (num[i] >= 0) nums.push(i);
    }
    nums.forEach((b) => {
      const r = Math.floor(b / w), c = b % w;
      [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([rr, cc]) => {
        if (rr >= 0 && rr < h && cc >= 0 && cc < w && !black[rr * w + cc]) nbr[b].push(rr * w + cc);
      });
    });
    return { w, h, N, black, num, hseg, vseg, segs, whites, nums, nbr };
  };

  // bulbs in each segment
  function akSegBulbs(P, v) {
    const sb = new Int32Array(P.segs.length);
    for (const i of P.whites) if (v[i] === 1) { sb[P.hseg[i]]++; sb[P.vseg[i]]++; }
    return sb;
  }
  L.akLit = function (P, v) {
    const sb = akSegBulbs(P, v), lit = new Uint8Array(P.N);
    for (const i of P.whites) if (sb[P.hseg[i]] || sb[P.vseg[i]]) lit[i] = 1;
    return lit;
  };

  /* Apply the three basic rules until nothing changes. Returns null, or the
   * contradiction met: { t: 'clash', seg } two bulbs see each other,
   * { t: 'num', cell } a number cannot be satisfied, { t: 'dark', cell } a cell
   * can no longer be lit. When `log` is given, records the reasons. */
  function akProp(P, v, log) {
    let changed = true;
    while (changed) {
      changed = false;
      const sb = akSegBulbs(P, v);
      for (let s = 0; s < P.segs.length; s++) {
        if (sb[s] > 1) return { t: 'clash', seg: s };
        if (sb[s] === 1) for (const i of P.segs[s]) if (v[i] < 0) { v[i] = 0; changed = true; }
      }
      for (const b of P.nums) {
        let nb = 0, nu = 0;
        for (const i of P.nbr[b]) { if (v[i] === 1) nb++; else if (v[i] < 0) nu++; }
        const want = P.num[b];
        if (nb > want || nb + nu < want) return { t: 'num', cell: b };
        if (!nu) continue;
        if (nb === want) { for (const i of P.nbr[b]) if (v[i] < 0) v[i] = 0; changed = true; if (log) log.push({ t: 'numfull', cell: b }); }
        else if (nb + nu === want) { for (const i of P.nbr[b]) if (v[i] < 0) v[i] = 1; changed = true; if (log) log.push({ t: 'numall', cell: b }); break; }
      }
      if (changed) continue;
      for (const c of P.whites) {
        if (sb[P.hseg[c]] || sb[P.vseg[c]]) continue;
        let cand = -1, nc = 0;
        for (const i of P.segs[P.hseg[c]]) if (v[i] < 0) { nc++; cand = i; }
        for (const i of P.segs[P.vseg[c]]) if (v[i] < 0 && i !== c) { nc++; cand = i; }
        if (!nc) return { t: 'dark', cell: c };
        if (nc === 1) { v[cand] = 1; changed = true; if (log) log.push({ t: 'only', cell: c, bulb: cand }); break; }
      }
    }
    return null;
  }
  L.akProp = akProp;

  L.akCount = function (P, v0, limit) {
    limit = limit || 2;
    let count = 0, sol = null, nodes = 0;
    const rec = (v) => {
      if (count >= limit || nodes > 200000) return;
      nodes++;
      if (akProp(P, v)) return;
      const sb = akSegBulbs(P, v);
      let best = -1, bc = 1e9;
      for (const c of P.whites) {
        if (sb[P.hseg[c]] || sb[P.vseg[c]]) continue;
        let nc = 0;
        for (const i of P.segs[P.hseg[c]]) if (v[i] < 0) nc++;
        for (const i of P.segs[P.vseg[c]]) if (v[i] < 0 && i !== c) nc++;
        if (nc < bc) { bc = nc; best = c; }
      }
      if (best < 0) {
        for (const i of P.whites) if (v[i] < 0) v[i] = 0;
        if (akProp(P, v)) return;
        count++; sol = Int8Array.from(v);
        return;
      }
      let cand = -1;
      for (const i of P.segs[P.hseg[best]]) if (v[i] < 0) { cand = i; break; }
      if (cand < 0) for (const i of P.segs[P.vseg[best]]) if (v[i] < 0) { cand = i; break; }
      for (const val of [1, 0]) {
        const v2 = Int8Array.from(v);
        v2[cand] = val;
        rec(v2);
        if (count >= limit) return;
      }
    };
    const v = v0 ? Int8Array.from(v0) : new Int8Array(P.N).fill(-1);
    for (let i = 0; i < P.N; i++) if (P.black[i]) v[i] = 0;
    rec(v);
    return { count, sol, nodes };
  };

  // does a finished grid of bulbs satisfy every rule?
  L.akValid = function (P, bulbs) {
    const v = new Int8Array(P.N);
    for (const i of P.whites) v[i] = bulbs[i] ? 1 : 0;
    const sb = akSegBulbs(P, v);
    for (let s = 0; s < P.segs.length; s++) if (sb[s] > 1) return false;
    for (const i of P.whites) if (!sb[P.hseg[i]] && !sb[P.vseg[i]]) return false;
    for (const b of P.nums) { let nb = 0; for (const i of P.nbr[b]) if (v[i]) nb++; if (nb !== P.num[b]) return false; }
    return true;
  };

  function akWhy(P, contra) {
    if (!contra) return '';
    const w = P.w;
    if (contra.t === 'clash') return 'two bulbs would end up shining on each other';
    if (contra.t === 'num') return 'the **' + P.num[contra.cell] + '** at ' + cellName(contra.cell, w) + ' could not get the right number of bulbs';
    return 'the cell at ' + cellName(contra.cell, w) + ' could never be lit';
  }

  /* The next step from position v (bulbs 1, dots 0, unknown -1; every mark
   * right). Level 1: the basic rules; level 2: "if a bulb went here…"
   * contradictions; level 3: anything deeper. Returns
   * { level, set: [[cell, value]], text, focus: [cells] } or null. */
  L.akStep = function (P, v0, maxLevel) {
    maxLevel = maxLevel || 3;
    const w = P.w;
    const v = Int8Array.from(v0);
    for (let i = 0; i < P.N; i++) if (P.black[i]) v[i] = 0;
    // cells lit by a bulb cannot hold one: that is just the picture, not a step
    const sb = akSegBulbs(P, v);
    for (const i of P.whites) if (v[i] < 0 && (sb[P.hseg[i]] || sb[P.vseg[i]])) v[i] = 0;
    const lit = L.akLit(P, v);
    // numbers that are full, or need every free neighbour
    for (const b of P.nums) {
      let nb = 0;
      const free = [];
      for (const i of P.nbr[b]) { if (v[i] === 1) nb++; else if (v[i] < 0) free.push(i); }
      if (!free.length) continue;
      const want = P.num[b];
      if (nb === want) {
        const dots = free.filter((i) => !lit[i]);
        if (!dots.length) continue;
        return { level: 1, set: dots.map((i) => [i, 0]), focus: [b], text: want === 0
          ? 'The **0** at ' + cellName(b, w) + ' touches no bulbs, so none of its neighbours may hold one: mark ' + (dots.length === 1 ? 'it' : 'them') + ' with a dot.'
          : 'The **' + want + '** at ' + cellName(b, w) + ' already touches ' + plural(want, 'bulb') + ': its other neighbours stay dark.' };
      }
      if (nb + free.length === want) {
        return { level: 1, set: free.map((i) => [i, 1]), focus: [b], text: 'The **' + want + '** at ' + cellName(b, w) + ' has exactly ' + word(want - nb) + ' free neighbour' + (want - nb === 1 ? '' : 's') + ' left' + (nb ? ' for its missing bulbs' : '') + ': ' + (want - nb === 1 ? 'it needs' : 'each needs') + ' a bulb.' };
      }
    }
    // a dark cell that can be lit from one place only
    for (const c of P.whites) {
      if (lit[c]) continue;
      const cands = [];
      for (const i of P.segs[P.hseg[c]]) if (v[i] < 0) cands.push(i);
      for (const i of P.segs[P.vseg[c]]) if (v[i] < 0 && i !== c) cands.push(i);
      if (cands.length !== 1) continue;
      const x = cands[0];
      return { level: 1, set: [[x, 1]], focus: [c], text: x === c
        ? 'Nothing else can light the cell at ' + cellName(c, w) + ': it needs a bulb of its own.'
        : 'The cell at ' + cellName(c, w) + ' can only be lit from one place: put a bulb at ' + cellName(x, w) + '.' };
    }
    if (maxLevel < 2) return null;
    // what if…
    const trial = (x, val) => { const t = Int8Array.from(v); t[x] = val; return akProp(P, t); };
    for (const x of P.whites) {
      if (v[x] >= 0) continue;
      const c1 = trial(x, 1);
      if (c1) return { level: 2, set: [[x, 0]], focus: c1.cell != null ? [c1.cell] : [], text: 'Suppose a bulb went at ' + cellName(x, w) + '. Follow the rules from there and ' + akWhy(P, c1) + '. So that cell stays dark.' };
    }
    for (const x of P.whites) {
      if (v[x] >= 0) continue;
      const c0 = trial(x, 0);
      if (c0) return { level: 2, set: [[x, 1]], focus: c0.cell != null ? [c0.cell] : [], text: 'Suppose the cell at ' + cellName(x, w) + ' stayed dark. Follow the rules from there and ' + akWhy(P, c0) + '. So it needs a bulb.' };
    }
    if (maxLevel < 3) return null;
    const res = L.akCount(P, v, 1);
    if (!res.sol) return null;
    for (const x of P.whites) if (v[x] < 0 && res.sol[x] === 1) {
      return { level: 3, set: [[x, 1]], focus: [], text: 'This one needs a long chain of reasoning. The bulb at ' + cellName(x, w) + ' is part of the answer — see if you can work out why.' };
    }
    return null;
  };

  // grade: run the steps from an empty grid
  L.akGrade = function (P, maxLevel) {
    const v = new Int8Array(P.N).fill(-1);
    for (let i = 0; i < P.N; i++) if (P.black[i]) v[i] = 0;
    const count = [0, 0, 0, 0];
    for (let guard = 0; guard < 5000; guard++) {
      const st = L.akStep(P, v, maxLevel || 3);
      if (!st) break;
      count[st.level]++;
      st.set.forEach(([i, val]) => { v[i] = val; });
      // the lit cells follow from bulbs
      const sb = akSegBulbs(P, v);
      for (const i of P.whites) if (v[i] < 0 && (sb[P.hseg[i]] || sb[P.vseg[i]])) v[i] = 0;
    }
    let open = 0;
    for (const i of P.whites) if (v[i] < 0) open++;
    return { l1: count[1], l2: count[2], l3: count[3], open };
  };

  /* =====================================================================
   *  TAKUZU (BINAIRO)
   *  n × n, n even; no three alike in a line, n/2 of each digit in every
   *  row and column, no two rows (or two columns) the same
   * ===================================================================== */

  const tkLinesCache = {};
  function tkLines(n) { return tkLinesCache[n] || (tkLinesCache[n] = nonoLines(n, n)); }
  L.tkLines = tkLines;
  const lineName = (li, n) => (li < n ? 'row ' : 'column ') + ((li < n ? li : li - n) + 1);
  const LineName = (li, n) => (li < n ? 'Row ' : 'Column ') + ((li < n ? li : li - n) + 1);
  const posName = (li, n, t) => (li < n ? 'column ' : 'row ') + (t + 1);

  // the basic rules until nothing changes; null, or the contradiction met
  function tkProp(n, v) {
    const lines = tkLines(n), half = n / 2;
    let changed = true;
    while (changed) {
      changed = false;
      for (let li = 0; li < lines.length; li++) {
        const cells = lines[li];
        let c0 = 0, c1 = 0;
        for (let t = 0; t < n; t++) { const x = v[cells[t]]; if (x === 0) c0++; else if (x === 1) c1++; }
        if (c0 > half || c1 > half) return { t: 'count', li };
        for (let t = 0; t + 2 < n; t++) {
          const a = v[cells[t]];
          if (a >= 0 && a === v[cells[t + 1]] && a === v[cells[t + 2]]) return { t: 'triple', li, at: t };
        }
        if (c0 + c1 === n) continue;
        if (c0 === half || c1 === half) {
          const val = c0 === half ? 1 : 0;
          for (const i of cells) if (v[i] < 0) v[i] = val;
          changed = true;
          continue;
        }
        for (let t = 0; t + 2 < n; t++) {
          const i0 = cells[t], i1 = cells[t + 1], i2 = cells[t + 2];
          const a = v[i0], b = v[i1], c = v[i2];
          if (a >= 0 && a === b && c < 0) { v[i2] = 1 - a; changed = true; }
          else if (b >= 0 && b === c && a < 0) { v[i0] = 1 - b; changed = true; }
          else if (a >= 0 && a === c && b < 0) { v[i1] = 1 - a; changed = true; }
        }
      }
    }
    // no two complete rows (columns) alike
    for (let pass = 0; pass < 2; pass++) {
      const seen = new Map();
      for (let k = 0; k < n; k++) {
        const li = pass * n + k, cells = lines[li];
        let s = '';
        for (const i of cells) { if (v[i] < 0) { s = null; break; } s += v[i]; }
        if (s == null) continue;
        if (seen.has(s)) return { t: 'twin', li, other: seen.get(s) };
        seen.set(s, li);
      }
    }
    return null;
  }
  L.tkProp = tkProp;

  L.tkCount = function (n, v0, limit) {
    limit = limit || 2;
    const lines = tkLines(n);
    let count = 0, sol = null, nodes = 0;
    const rec = (v) => {
      if (count >= limit || nodes > 400000) return;
      nodes++;
      if (tkProp(n, v)) return;
      let best = -1, bu = 1e9;
      for (const cells of lines) {
        let u = 0, first = -1;
        for (const i of cells) if (v[i] < 0) { u++; if (first < 0) first = i; }
        if (u && u < bu) { bu = u; best = first; }
      }
      if (best < 0) { count++; sol = Int8Array.from(v); return; }
      for (const val of [0, 1]) {
        const v2 = Int8Array.from(v);
        v2[best] = val;
        rec(v2);
        if (count >= limit) return;
      }
    };
    rec(v0 ? Int8Array.from(v0) : new Int8Array(n * n).fill(-1));
    return { count, sol, nodes };
  };

  L.tkValid = function (n, v) {
    for (let i = 0; i < n * n; i++) if (v[i] !== 0 && v[i] !== 1) return false;
    return !tkProp(n, Int8Array.from(v));
  };

  // every way to finish one line (no three alike, n/2 of each), avoiding `forbid`
  function tkLineOptions(n, vals, forbid) {
    const half = n / 2, out = [], cur = Array.from(vals);
    let c0 = 0, c1 = 0;
    for (const x of cur) { if (x === 0) c0++; else if (x === 1) c1++; }
    if (c0 > half || c1 > half) return out;
    const dfs = (pos) => {
      if (out.length > 5000) return;
      if (pos === n) {
        if (forbid && forbid.has(cur.join(''))) return;
        out.push(cur.slice());
        return;
      }
      const fixed = vals[pos] >= 0;
      for (const val of fixed ? [vals[pos]] : [0, 1]) {
        if (!fixed) {
          if (val === 0 ? c0 >= half : c1 >= half) continue;
          cur[pos] = val;
          if (val === 0) c0++; else c1++;
        }
        const ok = pos < 2 || !(cur[pos - 2] === val && cur[pos - 1] === val);
        if (ok) dfs(pos + 1);
        if (!fixed) { if (val === 0) c0--; else c1--; cur[pos] = -1; }
      }
    };
    dfs(0);
    return out;
  }
  L.tkLineOptions = tkLineOptions;

  /* The next step from position v (all marks right). Levels: 1 pairs,
   * sandwiches and full counts; 2 trying every way to finish a line; 3 the
   * same, remembering that no two lines may be alike; 4 "suppose…"
   * contradictions; 5 anything deeper. */
  L.tkStep = function (n, v, maxLevel) {
    maxLevel = maxLevel || 5;
    const lines = tkLines(n), half = n / 2;
    const D = (x) => '**' + x + '**';
    // 1a pairs and 1b sandwiches (across all lines, pairs first)
    for (let li = 0; li < lines.length; li++) {
      const cells = lines[li];
      for (let t = 0; t + 1 < n; t++) {
        const a = v[cells[t]];
        if (a < 0 || v[cells[t + 1]] !== a) continue;
        const set = [];
        if (t > 0 && v[cells[t - 1]] < 0) set.push([cells[t - 1], 1 - a]);
        if (t + 2 < n && v[cells[t + 2]] < 0) set.push([cells[t + 2], 1 - a]);
        if (!set.length) continue;
        return { level: 1, set, focus: [cells[t], cells[t + 1]], text: 'Two ' + D(a) + 's side by side in ' + lineName(li, n) + ': ' + (set.length === 2 ? 'the cells on either side must be ' : 'the cell next to them must be ') + D(1 - a) + ', or there would be three in a row.' };
      }
    }
    for (let li = 0; li < lines.length; li++) {
      const cells = lines[li];
      for (let t = 0; t + 2 < n; t++) {
        const a = v[cells[t]];
        if (a < 0 || v[cells[t + 2]] !== a || v[cells[t + 1]] >= 0) continue;
        return { level: 1, set: [[cells[t + 1], 1 - a]], focus: [cells[t], cells[t + 2]], text: 'In ' + lineName(li, n) + ' there is a ' + D(a) + ' on both sides of ' + posName(li, n, t + 1) + ': the cell between them must be ' + D(1 - a) + '.' };
      }
    }
    for (let li = 0; li < lines.length; li++) {
      const cells = lines[li];
      let c0 = 0, c1 = 0;
      const open = [];
      for (const i of cells) { if (v[i] === 0) c0++; else if (v[i] === 1) c1++; else open.push(i); }
      if (!open.length) continue;
      if (c0 === half || c1 === half) {
        const full = c0 === half ? 0 : 1;
        return { level: 1, set: open.map((i) => [i, 1 - full]), focus: cells, text: LineName(li, n) + ' already has its ' + word(half) + ' ' + D(full) + 's: the rest of it is ' + D(1 - full) + 's.' };
      }
    }
    if (maxLevel < 2) return null;
    // 2 and 3: every way to finish a line
    const complete = (li) => { let s = ''; for (const i of lines[li]) { if (v[i] < 0) return null; s += v[i]; } return s; };
    const done = lines.map((_, li) => complete(li));
    for (const level of [2, 3]) {
      if (level > maxLevel) break;
      let best = null;
      for (let li = 0; li < lines.length; li++) {
        if (done[li] != null) continue;
        const cells = lines[li];
        const vals = cells.map((i) => v[i]);
        let forbid = null;
        const twins = [];
        if (level === 3) {
          forbid = new Set();
          const base = li < n ? 0 : n;
          for (let k = base; k < base + n; k++) if (k !== li && done[k] != null) { forbid.add(done[k]); twins.push(k); }
          if (!forbid.size) continue;
        }
        const opts = tkLineOptions(n, vals, forbid);
        if (!opts.length) continue;
        const set = [];
        for (let t = 0; t < n; t++) {
          if (vals[t] >= 0) continue;
          const x = opts[0][t];
          if (opts.every((o) => o[t] === x)) set.push([cells[t], x]);
        }
        if (!set.length) continue;
        // (at level 3 no line gives anything without the twin rule, so it was needed)
        const score = opts.length * 10 - set.length;
        if (!best || score < best.score) best = { li, set, score, opts, twins, vals };
      }
      if (best) {
        const li = best.li, cells = lines[li];
        let c0 = 0, c1 = 0;
        best.vals.forEach((x) => { if (x === 0) c0++; else if (x === 1) c1++; });
        const need = [];
        if (half - c0) need.push(word(half - c0) + ' more ' + D(0) + (half - c0 === 1 ? '' : 's'));
        if (half - c1) need.push(word(half - c1) + ' more ' + D(1) + (half - c1 === 1 ? '' : 's'));
        const sets = [0, 1].map((x) => best.set.filter((s) => s[1] === x).map((s) => cells.indexOf(s[0])));
        const says = [];
        sets.forEach((ts, x) => { if (ts.length) says.push(D(x) + ' in ' + (ts.length === 1 ? posName(li, n, ts[0]) : (li < n ? 'columns ' : 'rows ') + listNums(ts.map((t) => t + 1)))); });
        let text = LineName(li, n) + ' still needs ' + need.join(' and ') + '. ';
        if (level === 2) text += (best.opts.length === 1 ? 'Only one way to place them avoids three in a row, and it puts ' : 'Of the ' + best.opts.length + ' ways to place them without three in a row, every one puts ') + says.join(' and ') + '.';
        else {
          const tw = best.twins.map((k) => lineName(k, n));
          text += 'It must not end up the same as ' + (tw.length === 1 ? tw[0] : tw.slice(0, -1).join(', ') + ' or ' + tw[tw.length - 1]) + ', which ' + (tw.length === 1 ? 'is' : 'are') + ' already finished. ' + (best.opts.length === 1 ? 'Only one way is left, and it puts ' : 'Every way that is left puts ') + says.join(' and ') + '.';
        }
        return { level, set: best.set, focus: cells, text };
      }
    }
    if (maxLevel < 4) return null;
    // 4: suppose…
    for (let i = 0; i < n * n; i++) {
      if (v[i] >= 0) continue;
      for (const val of [0, 1]) {
        const t = Int8Array.from(v);
        t[i] = val;
        const c = tkProp(n, t);
        if (!c) continue;
        const why = c.t === 'count' ? LineName(c.li, n).toLowerCase() + ' would get too many of one digit'
          : c.t === 'triple' ? lineName(c.li, n) + ' would get three alike in a row'
            : lineName(c.li, n) + ' would end up the same as ' + lineName(c.other, n);
        return { level: 4, set: [[i, 1 - val]], focus: [i].concat(lines[c.li]), text: 'Suppose the cell at ' + cellName(i, n) + ' were a ' + D(val) + '. Follow the rules and ' + why + '. So it is a ' + D(1 - val) + '.' };
      }
    }
    if (maxLevel < 5) return null;
    const res = L.tkCount(n, v, 1);
    if (!res.sol) return null;
    for (let i = 0; i < n * n; i++) if (v[i] < 0) return { level: 5, set: [[i, res.sol[i]]], focus: [i], text: 'This needs a long chain of reasoning. The cell at ' + cellName(i, n) + ' is a ' + D(res.sol[i]) + ' — can you see why?' };
    return null;
  };

  L.tkGrade = function (n, givens, maxLevel) {
    const v = Int8Array.from(givens);
    const count = [0, 0, 0, 0, 0, 0];
    for (let guard = 0; guard < 2000; guard++) {
      const st = L.tkStep(n, v, maxLevel || 5);
      if (!st) break;
      count[st.level]++;
      st.set.forEach(([i, x]) => { v[i] = x; });
    }
    let open = 0;
    for (let i = 0; i < v.length; i++) if (v[i] < 0) open++;
    let top = 0;
    for (let k = 5; k >= 1; k--) if (count[k]) { top = k; break; }
    return { count, top, open };
  };

  /* =====================================================================
   *  STAR BATTLE
   *  regions: strings of letters a, b, c …; s stars in every row, column
   *  and region; no two stars touch, not even at a corner
   * ===================================================================== */

  L.sbPrep = function (regions, s) {
    const n = regions.length, N = n * n;
    const reg = new Int32Array(N);
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) reg[r * n + c] = regions[r].charCodeAt(c) - 97;
    const units = [];
    for (let r = 0; r < n; r++) { const a = []; for (let c = 0; c < n; c++) a.push(r * n + c); units.push(a); }
    for (let c = 0; c < n; c++) { const a = []; for (let r = 0; r < n; r++) a.push(r * n + c); units.push(a); }
    for (let k = 0; k < n; k++) units.push([]);
    for (let i = 0; i < N; i++) units[2 * n + reg[i]].push(i);
    const nb8 = [];
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / n), c = i % n, a = [];
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const rr = r + dr, cc = c + dc;
        if (rr >= 0 && rr < n && cc >= 0 && cc < n) a.push(rr * n + cc);
      }
      nb8.push(a);
    }
    return { n, N, s, reg, units, nb8 };
  };
  const touch = (n, a, b) => Math.abs(Math.floor(a / n) - Math.floor(b / n)) <= 1 && Math.abs(a % n - b % n) <= 1;
  const unitName = (P, u) => u < P.n ? 'row ' + (u + 1) : u < 2 * P.n ? 'column ' + (u - P.n + 1) : 'the highlighted region';
  const UnitName = (P, u) => { const s = unitName(P, u); return s.charAt(0).toUpperCase() + s.slice(1); };

  function sbProp(P, v) {
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < P.N; i++) {
        if (v[i] !== 1) continue;
        for (const j of P.nb8[i]) {
          if (v[j] === 1) return { t: 'touch', cell: i };
          if (v[j] < 0) { v[j] = 0; changed = true; }
        }
      }
      for (let u = 0; u < P.units.length; u++) {
        let st = 0, un = 0;
        for (const i of P.units[u]) { if (v[i] === 1) st++; else if (v[i] < 0) un++; }
        if (st > P.s || st + un < P.s) return { t: 'unit', u };
        if (!un) continue;
        if (st === P.s) { for (const i of P.units[u]) if (v[i] < 0) v[i] = 0; changed = true; }
        else if (st + un === P.s) { for (const i of P.units[u]) if (v[i] < 0) v[i] = 1; changed = true; break; }
      }
    }
    return null;
  }
  L.sbProp = sbProp;

  L.sbCount = function (P, v0, limit) {
    limit = limit || 2;
    let count = 0, sol = null, nodes = 0;
    const rec = (v) => {
      if (count >= limit || nodes > 300000) return;
      nodes++;
      if (sbProp(P, v)) return;
      let best = -1, bu = 1e9;
      for (let u = 0; u < P.units.length; u++) {
        let st = 0, un = 0, first = -1;
        for (const i of P.units[u]) { if (v[i] === 1) st++; else if (v[i] < 0) { un++; if (first < 0) first = i; } }
        if (st < P.s && un < bu) { bu = un; best = first; }
      }
      if (best < 0) { count++; sol = Int8Array.from(v); for (let i = 0; i < P.N; i++) if (sol[i] < 0) sol[i] = 0; return; }
      for (const val of [1, 0]) {
        const v2 = Int8Array.from(v);
        v2[best] = val;
        rec(v2);
        if (count >= limit) return;
      }
    };
    rec(v0 ? Int8Array.from(v0) : new Int8Array(P.N).fill(-1));
    return { count, sol, nodes };
  };

  L.sbValid = function (P, stars) {
    for (let i = 0; i < P.N; i++) if (stars[i] === 1) for (const j of P.nb8[i]) if (stars[j] === 1) return false;
    for (const u of P.units) { let st = 0; for (const i of u) if (stars[i] === 1) st++; if (st !== P.s) return false; }
    return true;
  };

  // the cells ruled out by what is on the board: around stars, and full units
  L.sbImplied = function (P, v) {
    const out = new Uint8Array(P.N);
    for (let i = 0; i < P.N; i++) if (v[i] === 1) for (const j of P.nb8[i]) if (v[j] !== 1) out[j] = 1;
    for (const u of P.units) {
      let st = 0;
      for (const i of u) if (v[i] === 1) st++;
      if (st >= P.s) for (const i of u) if (v[i] !== 1) out[i] = 1;
    }
    return out;
  };

  // ways to put `need` more stars among `cells`, none touching each other
  function sbPlacements(P, cells, need, cap) {
    const out = [], cur = [];
    const dfs = (k) => {
      if (out.length >= cap) return;
      if (cur.length === need) { out.push(cur.slice()); return; }
      for (let j = k; j < cells.length; j++) {
        if (cur.some((x) => touch(P.n, x, cells[j]))) continue;
        cur.push(cells[j]);
        dfs(j + 1);
        cur.pop();
      }
    };
    dfs(0);
    return out;
  }

  /* The next step. Levels: 1 a unit with exactly enough room; 2 every way to
   * fill a unit, and one region shut in one row or column; 3 two or three
   * regions shut in as many rows or columns; 4 "suppose…"; 5 deeper. The
   * cells ruled out by stars already placed are taken as marked. */
  L.sbStep = function (P, v0, maxLevel) {
    maxLevel = maxLevel || 5;
    const n = P.n, s = P.s;
    const v = Int8Array.from(v0);
    const imp = L.sbImplied(P, v);
    for (let i = 0; i < P.N; i++) if (imp[i] && v[i] < 0) v[i] = 0;
    const info = P.units.map((u) => {
      let st = 0;
      const open = [];
      for (const i of u) { if (v[i] === 1) st++; else if (v[i] < 0) open.push(i); }
      return { st, open, need: s - st };
    });
    const starWord = (k) => (k === 1 ? 'star' : 'stars');
    // 1: exactly enough room
    for (let u = 0; u < P.units.length; u++) {
      const I = info[u];
      if (I.need <= 0 || I.open.length !== I.need) continue;
      return { level: 1, set: I.open.map((i) => [i, 1]), focus: P.units[u], unit: u, text: UnitName(P, u) + ' has only ' + (I.need === 1 ? 'one place' : word(I.need) + ' places') + ' left for its ' + (I.need === 1 && s === 2 ? 'second star' : starWord(I.need)) + ': ' + (I.need === 1 ? 'put a star there.' : 'a star in each.') };
    }
    if (maxLevel < 2) return null;
    // 2a: every way to fill one unit
    let best = null;
    for (let u = 0; u < P.units.length; u++) {
      const I = info[u];
      if (I.need <= 0) continue;
      const pl = sbPlacements(P, I.open, I.need, 400);
      if (!pl.length || pl.length >= 400) continue;
      const stars = I.open.filter((i) => pl.every((p) => p.includes(i)));
      const inUnit = I.open.filter((i) => !pl.some((p) => p.includes(i)));
      const outside = [];
      for (let i = 0; i < P.N; i++) {
        if (v[i] >= 0 || I.open.includes(i)) continue;
        if (pl.every((p) => p.some((x) => touch(n, x, i)))) outside.push(i);
      }
      // explain one kind of consequence at a time: stars first
      let set, kind;
      if (stars.length) { set = stars.map((i) => [i, 1]); kind = 'stars'; }
      else if (outside.length) { set = outside.map((i) => [i, 0]); kind = 'outside'; }
      else if (inUnit.length) { set = inUnit.map((i) => [i, 0]); kind = 'inside'; }
      else continue;
      const score = pl.length * 10 - set.length + (u >= 2 * n ? 0 : 1) + (kind === 'inside' ? 5 : 0);
      if (!best || score < best.score) best = { u, pl, set, kind, score };
    }
    if (best) {
      const u = best.u, I = info[u];
      const where = unitName(P, u);
      const cells = best.set.map((x) => x[0]);
      const at = cells.length === 1 ? 'the cell at ' + cellName(cells[0], n) : cells.length <= 3 ? 'the cells at ' + cells.map((i) => cellName(i, n)).join(' and ') : word(cells.length) + ' cells (outlined)';
      const them = I.need === 1 ? 'the ' + (s === 2 && I.st ? 'second ' : '') + 'star of ' + where : 'the ' + word(I.need) + ' stars of ' + where;
      let text;
      if (best.kind === 'stars') text = 'There are ' + best.pl.length + ' ways to fit ' + them + ' without stars touching, and every one uses ' + at + ': ' + (cells.length === 1 ? 'it is a star.' : 'they are stars.');
      else if (best.kind === 'outside') text = 'Wherever ' + them + (I.need === 1 ? ' goes' : ' go') + ' (' + (best.pl.length === 1 ? 'there is only one way' : 'there are ' + best.pl.length + ' ways') + '), ' + (I.need === 1 ? 'it touches ' : 'they touch ') + at + ': ' + (cells.length === 1 ? 'that cell stays empty.' : 'those cells stay empty.');
      else text = 'The ' + word(I.need) + ' stars of ' + where + ' must not touch each other, and no way of placing them uses ' + at + ': ' + (cells.length === 1 ? 'it stays empty.' : 'they stay empty.');
      return { level: 2, set: best.set, focus: P.units[u], unit: u, text };
    }
    // 2b / 3: regions shut in rows or columns, and rows or columns shut in regions
    const regs = [], lines = [];
    for (let k = 0; k < n; k++) regs.push(2 * n + k);
    for (let k = 0; k < 2 * n; k++) lines.push(k);
    const spanOf = (u, axis) => { // which rows (axis 0) / columns (axis 1) the open cells and stars of unit u lie in
      const set = new Set();
      for (const i of P.units[u]) if (v[i] !== 0) set.add(axis === 0 ? Math.floor(i / n) : i % n);
      return set;
    };
    const regSpan = (u) => { const set = new Set(); for (const i of P.units[u]) if (v[i] !== 0) set.add(P.reg[i]); return set; };
    for (let k = 1; k <= 3; k++) {
      const level = k === 1 ? 2 : 3;
      if (level > maxLevel) break;
      const combos = [];
      const pick = (start, acc) => {
        if (acc.length === k) { combos.push(acc.slice()); return; }
        for (let j = start; j < n; j++) { acc.push(j); pick(j + 1, acc); acc.pop(); }
      };
      pick(0, []);
      for (const axis of [0, 1]) {
        for (const combo of combos) {
          // k regions inside k rows/columns
          const rs = combo.map((j) => 2 * n + j);
          {
            const span = new Set();
            rs.forEach((u) => spanOf(u, axis).forEach((x) => span.add(x)));
            if (span.size === k) {
              const set = [];
              span.forEach((x) => {
                const line = axis === 0 ? x : n + x;
                for (const i of P.units[line]) if (v[i] < 0 && !combo.includes(P.reg[i])) set.push([i, 0]);
              });
              if (set.length) {
                const names = Array.from(span).sort((a, b) => a - b).map((x) => x + 1);
                const what = (axis === 0 ? (k === 1 ? 'row ' : 'rows ') : (k === 1 ? 'column ' : 'columns ')) + listNums(names);
                return { level, set, focus: [].concat(...rs.map((u) => P.units[u])), text: (k === 1 ? 'The highlighted region fits only in ' + what + ', so it takes ' : 'The ' + word(k) + ' highlighted regions fit only in ' + what + ', so they take ') + (k * s === 1 ? 'that line\'s star' : 'all ' + word(k * s) + ' stars there') + ': every other cell of ' + what + ' is empty.' };
              }
            }
          }
          // k rows/columns inside k regions
          const ls = combo.map((j) => (axis === 0 ? j : n + j));
          const rspan = new Set();
          ls.forEach((u) => regSpan(u).forEach((x) => rspan.add(x)));
          if (rspan.size === k) {
            const set = [];
            rspan.forEach((rg) => {
              for (const i of P.units[2 * n + rg]) {
                const line = axis === 0 ? Math.floor(i / n) : i % n;
                if (v[i] < 0 && !combo.includes(line)) set.push([i, 0]);
              }
            });
            if (set.length) {
              const what = (axis === 0 ? (k === 1 ? 'Row ' : 'Rows ') : (k === 1 ? 'Column ' : 'Columns ')) + listNums(combo.map((x) => x + 1));
              return { level, set, focus: [].concat(...Array.from(rspan).map((rg) => P.units[2 * n + rg])), text: what + (k === 1 ? ' can only get its stars from the highlighted region' : ' can only get their stars from the ' + word(k) + ' highlighted regions') + ', which then have no stars to spare: the rest of ' + (k === 1 ? 'that region' : 'those regions') + ' is empty.' };
            }
          }
        }
      }
    }
    if (maxLevel < 4) return null;
    // 4: suppose a star went here
    for (let i = 0; i < P.N; i++) {
      if (v[i] >= 0) continue;
      const t = Int8Array.from(v);
      t[i] = 1;
      const c = sbProp(P, t);
      if (!c) continue;
      let why = 'two stars would have to touch';
      if (c.t === 'unit') {
        let st = 0;
        for (const j of P.units[c.u]) if (t[j] === 1) st++;
        why = unitName(P, c.u) + ' would ' + (st > s ? 'get too many stars' : 'have no room left for its ' + (s === 1 ? 'star' : 'stars'));
      }
      return { level: 4, set: [[i, 0]], focus: c.u != null ? P.units[c.u] : [], text: 'Suppose a star went at ' + cellName(i, n) + '. Follow the rules from there and ' + why + '. So that cell is empty.' };
    }
    if (maxLevel < 5) return null;
    const res = L.sbCount(P, v, 1);
    if (!res.sol) return null;
    for (let i = 0; i < P.N; i++) if (v[i] < 0 && res.sol[i] === 1) return { level: 5, set: [[i, 1]], focus: [], text: 'This needs a long chain of reasoning. There is a star at ' + cellName(i, n) + ' — can you see why?' };
    return null;
  };

  L.sbGrade = function (P, maxLevel) {
    const v = new Int8Array(P.N).fill(-1);
    const count = [0, 0, 0, 0, 0, 0];
    for (let guard = 0; guard < 2000; guard++) {
      const st = L.sbStep(P, v, maxLevel || 5);
      if (!st) break;
      count[st.level]++;
      st.set.forEach(([i, x]) => { v[i] = x; });
      const imp = L.sbImplied(P, v);
      for (let i = 0; i < P.N; i++) if (imp[i] && v[i] < 0) v[i] = 0;
    }
    let open = 0;
    for (let i = 0; i < P.N; i++) if (v[i] < 0) open++;
    let top = 0;
    for (let k = 5; k >= 1; k--) if (count[k]) { top = k; break; }
    return { count, top, open };
  };

  /* =====================================================================
   *  MAKING PUZZLES — used by tools/gen/shade.js (fixed seeds) and by the
   *  Endless drawers (engines/shade.js generate). All deterministic for rng.
   * ===================================================================== */

  function toRows(arr, w, f) {
    const rows = [];
    for (let r = 0; r < arr.length / w; r++) { let s = ''; for (let c = 0; c < w; c++) s += f(arr[r * w + c], r * w + c); rows.push(s); }
    return rows;
  }
  L.toRows = toRows;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));

  /* ---- takuzu ---- */

  const tkRowCache = {};
  function tkRows(n) {
    if (tkRowCache[n]) return tkRowCache[n];
    const out = [], cur = [];
    const dfs = (k, c0, c1) => {
      if (k === n) { out.push(cur.slice()); return; }
      for (const v of [0, 1]) {
        if (v === 0 ? c0 >= n / 2 : c1 >= n / 2) continue;
        if (k >= 2 && cur[k - 1] === v && cur[k - 2] === v) continue;
        cur.push(v);
        dfs(k + 1, c0 + (v === 0 ? 1 : 0), c1 + (v === 1 ? 1 : 0));
        cur.pop();
      }
    };
    dfs(0, 0, 0);
    return (tkRowCache[n] = out);
  }

  // a random finished grid
  L.tkFull = function (n, rng) {
    const rows = tkRows(n);
    for (let attempt = 0; attempt < 50; attempt++) {
      const grid = [], used = new Set();
      const ok = (row) => {
        if (used.has(row.join(''))) return false;
        const k = grid.length;
        for (let c = 0; c < n; c++) {
          let c1 = row[c];
          for (let r = 0; r < k; r++) c1 += grid[r][c];
          if (c1 > n / 2 || (k + 1 - c1) > n / 2) return false;
          if (k >= 2 && grid[k - 1][c] === row[c] && grid[k - 2][c] === row[c]) return false;
        }
        return true;
      };
      let nodes = 0;
      const dfs = () => {
        if (grid.length === n) return true;
        if (++nodes > 3000) return false;
        const start = rng.int(rows.length);
        for (let t = 0; t < rows.length; t++) {
          const row = rows[(start + t * 7919) % rows.length];
          if (!ok(row)) continue;
          grid.push(row); used.add(row.join(''));
          if (dfs()) return true;
          grid.pop(); used.delete(row.join(''));
        }
        return false;
      };
      if (!dfs()) continue;
      const cols = new Set();
      let fine = true;
      for (let c = 0; c < n; c++) { const s = grid.map((r) => r[c]).join(''); if (cols.has(s)) fine = false; cols.add(s); }
      if (fine) return Int8Array.from([].concat(...grid));
    }
    return null;
  };

  // how far logic of a given level gets (1 rules, 2 line enumeration, 3 + no twins, 4 + trials)
  L.tkSolveTo = function (n, giv, level) {
    const v = Int8Array.from(giv), lines = tkLines(n);
    for (let guard = 0; guard < 500; guard++) {
      if (tkProp(n, v)) return { open: -1, v };
      let open = 0;
      for (let i = 0; i < v.length; i++) if (v[i] < 0) open++;
      if (!open || level < 2) return { open, v };
      let found = false;
      const done = lines.map((cells) => { let s = ''; for (const i of cells) { if (v[i] < 0) return null; s += v[i]; } return s; });
      for (let li = 0; li < lines.length; li++) {
        if (done[li] != null) continue;
        const cells = lines[li], vals = cells.map((i) => v[i]);
        let forbid = null;
        if (level >= 3) {
          forbid = new Set();
          const base = li < n ? 0 : n;
          for (let k = base; k < base + n; k++) if (k !== li && done[k] != null) forbid.add(done[k]);
        }
        const opts = tkLineOptions(n, vals, forbid);
        if (!opts.length) return { open: -1, v };
        for (let t = 0; t < n; t++) {
          if (vals[t] >= 0) continue;
          const x = opts[0][t];
          if (opts.every((o) => o[t] === x)) { v[cells[t]] = x; found = true; }
        }
      }
      if (!found && level >= 4) {
        for (let i = 0; i < v.length && !found; i++) {
          if (v[i] >= 0) continue;
          for (const val of [0, 1]) {
            const t = Int8Array.from(v);
            t[i] = val;
            if (tkProp(n, t)) { v[i] = 1 - val; found = true; break; }
          }
        }
      }
      if (!found) return { open, v };
    }
    return { open: -1, v };
  };

  L.tkDiff = (n, top) => clamp(Math.round((n <= 6 ? 0 : n <= 8 ? 1 : n <= 10 ? 2 : n <= 12 ? 3 : 3.4) + [0, 1, 1.5, 2.2, 2.8, 3.5][top] - 0.4), 1, 5);

  // a puzzle: a full grid, digits taken away while logic of `level` still solves it
  L.tkMake = function (n, level, rng) {
    const sol = L.tkFull(n, rng);
    if (!sol) return null;
    const giv = Int8Array.from(sol);
    const order = rng.shuffle(Array.from({ length: n * n }, (_, i) => i));
    for (const i of order) {
      const keep = giv[i];
      giv[i] = -1;
      if (L.tkSolveTo(n, giv, level).open !== 0) giv[i] = keep;
    }
    const g = L.tkGrade(n, giv, 4);
    if (g.open) return null;
    return { n, top: g.top, count: g.count, diff: L.tkDiff(n, g.top), grid: toRows(giv, n, (x) => (x < 0 ? '.' : String(x))), sol: toRows(sol, n, String) };
  };

  /* ---- light up ---- */

  // how far the basic rules (level 1) or rules plus one-step trials (level 2) get
  L.akSolveTo = function (P, level) {
    const v = new Int8Array(P.N).fill(-1);
    for (let i = 0; i < P.N; i++) if (P.black[i]) v[i] = 0;
    let trials = 0;
    for (let guard = 0; guard < 500; guard++) {
      if (akProp(P, v)) return { open: -1, trials };
      let open = 0;
      for (const i of P.whites) if (v[i] < 0) open++;
      if (!open || level < 2) return { open, trials };
      let found = false;
      for (const x of P.whites) {
        if (v[x] >= 0) continue;
        for (const val of [1, 0]) {
          const t = Int8Array.from(v);
          t[x] = val;
          if (akProp(P, t)) { v[x] = 1 - val; found = true; trials++; break; }
        }
      }
      if (!found) return { open, trials };
    }
    return { open: -1, trials };
  };

  L.akDiff = (w, h, g) => clamp(Math.round(1 + (w * h <= 49 ? 0 : w * h <= 64 ? 0.6 : w * h <= 100 ? 1.4 : w * h <= 144 ? 2 : 2.6) + Math.min(2, g.l2 * 0.25)), 1, 5);

  L.akMake = function (w, h, rng, density, level) {
    const N = w * h, black = new Uint8Array(N);
    for (let i = 0; i < N; i++) {
      const j = N - 1 - i;
      if (j < i) break;
      if (rng() < density) { black[i] = 1; black[j] = 1; }
    }
    const P0 = L.akPrep(toRows(black, w, (b) => (b ? '#' : '.')));
    if (P0.whites.length < N * 0.6) return null;
    const v = new Int8Array(N);
    for (let guard = 0; guard < 400; guard++) {
      const lit = L.akLit(P0, v);
      const dark = P0.whites.filter((i) => !lit[i]);
      if (!dark.length) break;
      const c = dark[rng.int(dark.length)];
      const cands = P0.segs[P0.hseg[c]].concat(P0.segs[P0.vseg[c]]).filter((i) => !lit[i]);
      if (!cands.length) return null;
      v[cands[rng.int(cands.length)]] = 1;
    }
    const lit = L.akLit(P0, v);
    if (P0.whites.some((i) => !lit[i])) return null;
    const num = new Int8Array(N).fill(-1), blacks = [];
    for (let i = 0; i < N; i++) {
      if (!black[i]) continue;
      const r = Math.floor(i / w), c = i % w;
      let k = 0;
      [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([rr, cc]) => { if (rr >= 0 && rr < h && cc >= 0 && cc < w && v[rr * w + cc] === 1) k++; });
      num[i] = k;
      blacks.push(i);
    }
    const gridOf = () => toRows(black, w, (b, i) => (!b ? '.' : num[i] >= 0 ? String(num[i]) : '#'));
    const solves = (lvl) => L.akSolveTo(L.akPrep(gridOf()), lvl).open === 0;
    if (!solves(level)) return null;
    for (const i of rng.shuffle(blacks.slice())) {
      const keep = num[i];
      num[i] = -1;
      if (!solves(level)) num[i] = keep;
    }
    const grid = gridOf(), P = L.akPrep(grid);
    const g = L.akGrade(P, 2);
    if (g.open) return null;
    return { w, h, grid, sol: toRows(v, w, (x) => (x === 1 ? '*' : '.')), grade: g, diff: L.akDiff(w, h, g) };
  };

  /* ---- star battle ---- */

  const nb4 = (i, n) => { const r = Math.floor(i / n), c = i % n, a = []; if (r) a.push(i - n); if (r < n - 1) a.push(i + n); if (c) a.push(i - 1); if (c < n - 1) a.push(i + 1); return a; };
  function sbPartition(n, rng) {
    const N = n * n, reg = new Int32Array(N).fill(-1), size = new Array(n).fill(1);
    rng.shuffle(Array.from({ length: N }, (_, i) => i)).slice(0, n).forEach((s, k) => { reg[s] = k; });
    let left = N - n;
    const frontier = (k) => { const out = []; for (let i = 0; i < N; i++) if (reg[i] === k) for (const j of nb4(i, n)) if (reg[j] < 0) out.push(j); return out; };
    for (let guard = 0; left > 0 && guard < 20 * N; guard++) {
      let k = rng.int(n);
      if (rng() < 0.6) { let best = 1e9; for (let j = 0; j < n; j++) if (size[j] < best && frontier(j).length) { best = size[j]; k = j; } }
      const f = frontier(k);
      if (!f.length) continue;
      reg[f[rng.int(f.length)]] = k; size[k]++; left--;
    }
    return left ? null : reg;
  }
  function connected(reg, n, k) {
    let start = -1, total = 0;
    for (let i = 0; i < n * n; i++) if (reg[i] === k) { total++; if (start < 0) start = i; }
    if (!total) return false;
    const seen = new Set([start]), stack = [start];
    while (stack.length) { const i = stack.pop(); for (const j of nb4(i, n)) if (reg[j] === k && !seen.has(j)) { seen.add(j); stack.push(j); } }
    return seen.size === total;
  }
  L.sbDiff = (n, top) => clamp(Math.round(({ 5: 0.6, 6: 1, 7: 1.6, 8: 2.2, 9: 3, 10: 3.4 }[n] || 3) + [0, 0, 0.4, 1, 1.6, 2][top]), 1, 5);

  // random regions, then boundary cells moved until exactly one placement fits
  L.sbMake = function (n, s, rng, maxIter) {
    let reg = sbPartition(n, rng);
    if (!reg) return null;
    const regionsOf = (rg) => toRows(rg, n, (x) => String.fromCharCode(97 + x));
    const countOf = (rg) => L.sbCount(L.sbPrep(regionsOf(rg), s), null, 12).count;
    let cnt = countOf(reg);
    for (let guard = 0; cnt !== 1 && guard < (maxIter || 1200); guard++) {
      const i = rng.int(n * n);
      const others = nb4(i, n).map((j) => reg[j]).filter((k) => k !== reg[i]);
      if (!others.length) continue;
      const to = others[rng.int(others.length)], from = reg[i];
      const trial = Int32Array.from(reg);
      trial[i] = to;
      if (!connected(trial, n, from)) continue;
      const c2 = countOf(trial);
      if (c2 === 0 && cnt > 0) continue;
      if (cnt === 0 || c2 <= cnt) { reg = trial; cnt = c2; }
    }
    if (cnt !== 1) return null;
    const regions = regionsOf(reg), P = L.sbPrep(regions, s);
    const g = L.sbGrade(P, 4);
    if (g.open) return null;
    const c = L.sbCount(P, null, 2);
    if (c.count !== 1) return null;
    return { n, s, regions, sol: toRows(c.sol, n, (x) => (x === 1 ? '*' : '.')), grade: g, diff: L.sbDiff(n, g.top) };
  };

  /* ---- nonograms ---- */

  L.nonoCluesOf = function (bits, w, h) {
    const rows = [], cols = [];
    for (let r = 0; r < h; r++) { const a = []; for (let c = 0; c < w; c++) a.push(bits[r * w + c]); rows.push(runsOf(a)); }
    for (let c = 0; c < w; c++) { const a = []; for (let r = 0; r < h; r++) a.push(bits[r * w + c]); cols.push(runsOf(a)); }
    return { rows, cols };
  };

  // change as few pixels as possible until line logic alone finishes the picture
  // (sample, rng: try only that many of the open cells as flips — for speed)
  L.nonoFix = function (bits, w, h, maxFlips, sample, rng) {
    const b = Uint8Array.from(bits), flips = [];
    for (let k = 0; ; k++) {
      const cl = L.nonoCluesOf(b, w, h);
      const r = L.nonoSolve(w, h, cl.rows, cl.cols);
      if (r.done) return { bits: b, flips, solve: r };
      if (k >= maxFlips) return null;
      let best = -1, bu = r.unknown;
      let open = [];
      for (let i = 0; i < w * h; i++) if (r.g[i] < 0) open.push(i);
      if (sample && rng && open.length > sample) open = rng.shuffle(open).slice(0, sample);
      for (const i of open) {
        b[i] ^= 1;
        const c2 = L.nonoCluesOf(b, w, h);
        const r2 = L.nonoSolve(w, h, c2.rows, c2.cols);
        b[i] ^= 1;
        if (r2.ok && r2.unknown < bu) { bu = r2.unknown; best = i; }
      }
      if (best < 0) return null;
      b[best] ^= 1;
      flips.push(best);
    }
  };

  /* How a careful person would fare: at every step take the line that is
   * easiest to see through (the fewest ways to fit its clue) among those that
   * give something new. Returns { steps, hardest: the most ways weighed at a
   * single step, heavy: steps that weighed more than 12 ways } or null. */
  L.nonoEffort = function (w, h, rows, cols) {
    const lines = nonoLines(w, h), clues = rows.concat(cols);
    const g = new Int8Array(w * h).fill(-1);
    let steps = 0, hardest = 1, heavy = 0;
    for (let guard = 0; guard < 4 * (w + h) * Math.max(w, h); guard++) {
      let best = null;
      for (let li = 0; li < lines.length; li++) {
        const cells = lines[li], n = cells.length;
        const known = new Int8Array(n);
        let unk = 0;
        for (let t = 0; t < n; t++) { known[t] = g[cells[t]]; if (known[t] < 0) unk++; }
        if (!unk) continue;
        const r = nonoLine(clues[li], known);
        if (!r) return null;
        let gain = 0;
        for (let t = 0; t < n; t++) if (known[t] < 0 && (!r.empty[t] || !r.fill[t])) gain++;
        if (!gain) continue;
        // an empty line is judged by its slack, which is what a person looks at
        const ways = unk === n ? Math.min(r.total, 1 + n - clues[li].reduce((a, b) => a + b + 1, -1)) : r.total;
        if (!best || ways < best.ways || (ways === best.ways && gain > best.gain)) best = { li, r, ways, gain };
      }
      if (!best) break;
      const cells = lines[best.li];
      for (let t = 0; t < cells.length; t++) {
        if (g[cells[t]] >= 0) continue;
        if (!best.r.empty[t]) g[cells[t]] = 1; else if (!best.r.fill[t]) g[cells[t]] = 0;
      }
      steps++;
      hardest = Math.max(hardest, best.ways);
      if (best.ways > 12) heavy++;
    }
    for (let i = 0; i < g.length; i++) if (g[i] < 0) return null;
    return { steps, hardest, heavy };
  };

  // effort -> 1..5
  L.nonoDiff = function (w, h, e) {
    const area = w * h;
    const size = area <= 30 ? 0 : area <= 110 ? 0.9 : area <= 180 ? 1.5 : area <= 260 ? 2 : area <= 330 ? 2.5 : 2.9;
    const effort = Math.log2(Math.max(1, e.hardest)) * 0.45 + Math.min(1, e.heavy * 0.12);
    return clamp(Math.round(1 + size + effort), 1, 5);
  };

  // a symmetric inkblot: noise, smoothed, mirrored
  L.nonoBlot = function (w, h, rng, fill) {
    let a = new Uint8Array(w * h);
    const half = Math.ceil(w / 2);
    for (let r = 0; r < h; r++) for (let c = 0; c < half; c++) a[r * w + c] = rng() < (fill || 0.5) ? 1 : 0;
    const mirror = () => { for (let r = 0; r < h; r++) for (let c = 0; c < half; c++) a[r * w + (w - 1 - c)] = a[r * w + c]; };
    mirror();
    for (let it = 0; it < 3; it++) {
      const b = Uint8Array.from(a);
      for (let r = 0; r < h; r++) for (let c = 0; c < half; c++) {
        let k = 0;
        for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
          const rr = r + dr, cc = c + dc;
          if (rr >= 0 && rr < h && cc >= 0 && cc < w) k += a[rr * w + cc];
        }
        b[r * w + c] = k >= 5 ? 1 : k <= 3 ? 0 : a[r * w + c];
      }
      a = b;
      mirror();
    }
    return a;
  };

  // colour a bitmap for the reveal: edge cells in one colour, inner cells in a deeper one
  L.nonoPaint = function (bits, w, h, edge, inner) {
    return toRows(bits, w, (x, i) => {
      if (!x) return '.';
      const r = Math.floor(i / w), c = i % w;
      const on = (rr, cc) => rr >= 0 && rr < h && cc >= 0 && cc < w && bits[rr * w + cc];
      return on(r - 1, c) && on(r + 1, c) && on(r, c - 1) && on(r, c + 1) ? inner : edge;
    });
  };
})(typeof window !== 'undefined' ? window : globalThis);
