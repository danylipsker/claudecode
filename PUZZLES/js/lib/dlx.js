/* The Puzzle Cabinet · js/lib/dlx.js
 *
 * Exact cover by Knuth's Algorithm X with dancing links. Many puzzles are
 * exact cover in disguise: tangram and polyomino packing (every cell covered
 * once, every piece used once), Soma figures, Sudoku, Latin squares.
 *
 *   const sols = Cabinet.DLX.solve({
 *     primary: 10,            columns 0..9 must be covered exactly once
 *     secondary: 3,           columns 10..12 at most once (optional)
 *     rows: [[0, 3, 7], ...], each row lists the columns it covers
 *     max: 1,                 stop after this many solutions (default 1)
 *     nodeLimit: 5e6          give up after this many steps (result.aborted)
 *   });
 *   sols            -> [[rowIndex, ...], ...]
 *   sols.aborted    -> true when the node limit was hit
 */
(function (root) {
  'use strict';
  const C = root.Cabinet = root.Cabinet || {};

  function solve(spec) {
    const P = spec.primary, S = spec.secondary || 0, N = P + S;
    const rowsIn = spec.rows;
    const max = spec.max == null ? 1 : spec.max;
    const nodeLimit = spec.nodeLimit || 5e7;
    // node arrays: 0 is the root, 1..N the column headers
    let cap = N + 1 + rowsIn.reduce((s, r) => s + r.length, 0);
    const L = new Int32Array(cap), R = new Int32Array(cap), U = new Int32Array(cap), D = new Int32Array(cap);
    const COL = new Int32Array(cap), ROW = new Int32Array(cap), SIZE = new Int32Array(N + 1);
    // header list: only primary columns are linked into the root's row
    L[0] = P; R[0] = P ? 1 : 0;
    for (let c = 1; c <= N; c++) {
      U[c] = D[c] = c; COL[c] = c; SIZE[c] = 0;
      if (c <= P) { L[c] = c - 1; R[c] = c === P ? 0 : c + 1; }
      else { L[c] = R[c] = c; }
    }
    if (!P) { L[0] = R[0] = 0; }
    let n = N + 1;
    rowsIn.forEach((cols, ri) => {
      let first = -1;
      const seen = new Set();
      cols.forEach((c0) => {
        if (seen.has(c0)) return;
        seen.add(c0);
        const c = c0 + 1;
        const x = n++;
        COL[x] = c; ROW[x] = ri;
        U[x] = U[c]; D[x] = c; D[U[c]] = x; U[c] = x; SIZE[c]++;
        if (first < 0) { first = x; L[x] = R[x] = x; }
        else { L[x] = L[first]; R[x] = first; R[L[first]] = x; L[first] = x; }
      });
    });
    function cover(c) {
      R[L[c]] = R[c]; L[R[c]] = L[c];
      for (let i = D[c]; i !== c; i = D[i]) {
        for (let j = R[i]; j !== i; j = R[j]) { D[U[j]] = D[j]; U[D[j]] = U[j]; SIZE[COL[j]]--; }
      }
    }
    function uncover(c) {
      for (let i = U[c]; i !== c; i = U[i]) {
        for (let j = L[i]; j !== i; j = L[j]) { SIZE[COL[j]]++; D[U[j]] = j; U[D[j]] = j; }
      }
      R[L[c]] = c; L[R[c]] = c;
    }
    const out = [];
    const stack = [];
    let nodes = 0, aborted = false;
    const order = spec.shuffle; // an optional random function to vary which solution is found
    function search() {
      if (R[0] === 0) { out.push(stack.map((x) => ROW[x])); return out.length >= max; }
      if (++nodes > nodeLimit) { aborted = true; return true; }
      // the column with the fewest choices
      let c = R[0], best = SIZE[c];
      for (let j = R[c]; j !== 0; j = R[j]) if (SIZE[j] < best) { best = SIZE[j]; c = j; }
      if (best === 0) return false;
      cover(c);
      let cand = [];
      for (let r = D[c]; r !== c; r = D[r]) cand.push(r);
      if (order) for (let i = cand.length - 1; i > 0; i--) { const k = Math.floor(order() * (i + 1)); const t = cand[i]; cand[i] = cand[k]; cand[k] = t; }
      for (const r of cand) {
        stack.push(r);
        for (let j = R[r]; j !== r; j = R[j]) cover(COL[j]);
        const stop = search();
        for (let j = L[r]; j !== r; j = L[j]) uncover(COL[j]);
        stack.pop();
        if (stop) { uncover(c); return true; }
      }
      uncover(c);
      return false;
    }
    search();
    out.aborted = aborted;
    out.nodes = nodes;
    return out;
  }

  C.DLX = { solve, count: (spec, limit) => solve(Object.assign({}, spec, { max: limit || 1e9 })).length };
})(typeof window !== 'undefined' ? window : globalThis);
