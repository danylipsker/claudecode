/* The Puzzle Cabinet · js/lib/loops-logic.js
 *
 * The reasoning behind the loop and region puzzles of engines/loops.js,
 * node-safe so that verify(), the generator (tools/gen/loops.js), the Endless
 * drawers and the live hints all use the same code:
 *
 *   slither   Slitherlink: one loop along the grid lines, clues count sides
 *   masyu     one loop through cell centres, black and white pearls
 *   hashi     Hashiwokakero (Bridges): islands joined by single and double bridges
 *   nurikabe  numbered islands in a connected sea without 2×2 pools
 *   kakuro    cross sums: runs of distinct digits 1–9 with given totals
 *
 * For every kind: a propagator (the rules a person uses, applied until
 * nothing changes), a counter (backtracking on top of the propagator, to
 * prove there is exactly one solution), graded steps with explanations (the
 * hints), a grader and a maker. Levels of reasoning, the same everywhere:
 *   1  the plain rules, one clue or one dot at a time
 *   2  well-known patterns and whole-run / whole-island reasoning
 *   3  "suppose…": try one mark, follow levels 1–2 to a contradiction
 *   4  anything deeper
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const L = {};
  C.loopsLogic = L;

  /* ---------- words and small helpers ---------- */

  const ORD = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
  const word = (n) => ORD[n] || String(n);
  const Word = (n) => { const s = word(n); return s.charAt(0).toUpperCase() + s.slice(1); };
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : (many || one + 's'));
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const now = () => (root.performance && root.performance.now ? root.performance.now() : Date.now());
  const cellName = (i, w) => 'row ' + (Math.floor(i / w) + 1) + ', column ' + (i % w + 1);
  L.word = word; L.cellName = cellName; L.now = now;
  function toRows(arr, w, f) {
    const rows = [];
    for (let r = 0; r < arr.length / w; r++) { let s = ''; for (let c = 0; c < w; c++) s += f(arr[r * w + c], r * w + c); rows.push(s); }
    return rows;
  }
  L.toRows = toRows;
  const DR = [-1, 0, 1, 0], DC = [0, 1, 0, -1];
  const DIRNAME = ['up', 'right', 'down', 'left'];
  L.DIRNAME = DIRNAME;

  /* =====================================================================
   *  LOOPS — Slitherlink and Masyu share one solver.
   *  A loop puzzle is a graph (nodes, edges) where every node ends with 0 or
   *  2 lines and the lines form one single closed loop, plus the kind's own
   *  constraints: clue cells (slither) or pearls (masyu).
   *  Edge values: -1 unknown, 0 crossed out (no line), 1 line.
   *  Directions: 0 up, 1 right, 2 down, 3 left.
   * ===================================================================== */

  // Slitherlink: nodes are the (h+1)×(w+1) dots; edge r*w+c is the horizontal
  // edge right of dot (r,c); edge HE + r*(w+1)+c the vertical edge below it.
  L.slPrep = function (w, h, clues) {
    const NW = w + 1, N = (h + 1) * NW, HE = (h + 1) * w, E = HE + h * NW;
    const ea = new Int32Array(E), eb = new Int32Array(E);
    const nbrE = new Int32Array(N * 4).fill(-1), nbrN = new Int32Array(N * 4).fill(-1);
    for (let r = 0; r <= h; r++) for (let c = 0; c < w; c++) {
      const e = r * w + c, a = r * NW + c, b = a + 1;
      ea[e] = a; eb[e] = b; nbrE[a * 4 + 1] = e; nbrN[a * 4 + 1] = b; nbrE[b * 4 + 3] = e; nbrN[b * 4 + 3] = a;
    }
    for (let r = 0; r < h; r++) for (let c = 0; c <= w; c++) {
      const e = HE + r * NW + c, a = r * NW + c, b = a + NW;
      ea[e] = a; eb[e] = b; nbrE[a * 4 + 2] = e; nbrN[a * 4 + 2] = b; nbrE[b * 4] = e; nbrN[b * 4] = a;
    }
    const nodeE = [];
    for (let n = 0; n < N; n++) { const a = []; for (let d = 0; d < 4; d++) if (nbrE[n * 4 + d] >= 0) a.push(nbrE[n * 4 + d]); nodeE.push(a); }
    const NC = w * h, cellE = new Int32Array(NC * 4), clue = new Int8Array(NC).fill(-1), edgeCells = [];
    for (let e = 0; e < E; e++) edgeCells.push([]);
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
      const i = r * w + c;
      const t = r * w + c, b = (r + 1) * w + c, l = HE + r * NW + c, rt = l + 1;
      cellE[i * 4] = t; cellE[i * 4 + 1] = rt; cellE[i * 4 + 2] = b; cellE[i * 4 + 3] = l;
      edgeCells[t].push(i); edgeCells[rt].push(i); edgeCells[b].push(i); edgeCells[l].push(i);
      const ch = clues ? (typeof clues[0] === 'string' ? clues[r][c] : clues[i]) : '.';
      if (typeof ch === 'number') { if (ch >= 0 && ch <= 3) clue[i] = ch; } else if (ch >= '0' && ch <= '3') clue[i] = +ch;
    }
    const clueCells = [];
    for (let i = 0; i < NC; i++) if (clue[i] >= 0) clueCells.push(i);
    return { kind: 'slither', w, h, N, E, HE, NW, NC, ea, eb, nbrE, nbrN, nodeE, cellE, edgeCells, clue, clueCells, pearl: null, pearls: [] };
  };
  // the dot at corner q (0 top-left, 1 top-right, 2 bottom-right, 3 bottom-left) of cell i
  const slCorner = (P, i, q) => { const r = Math.floor(i / P.w), c = i % P.w; return (r + (q >= 2 ? 1 : 0)) * P.NW + c + (q === 1 || q === 2 ? 1 : 0); };
  // the two sides of a cell that meet at corner q (indexes into cellE: 0 top, 1 right, 2 bottom, 3 left)
  const PAIR = [[0, 3], [0, 1], [2, 1], [2, 3]];
  L.slCorner = slCorner;

  // Masyu: nodes are the cells; edge r*(w-1)+c joins (r,c)-(r,c+1), edge HE + r*w+c joins (r,c)-(r+1,c).
  L.maPrep = function (w, h, grid) {
    const N = w * h, HE = h * (w - 1), E = HE + (h - 1) * w;
    const ea = new Int32Array(E), eb = new Int32Array(E);
    const nbrE = new Int32Array(N * 4).fill(-1), nbrN = new Int32Array(N * 4).fill(-1);
    for (let r = 0; r < h; r++) for (let c = 0; c < w - 1; c++) {
      const e = r * (w - 1) + c, a = r * w + c, b = a + 1;
      ea[e] = a; eb[e] = b; nbrE[a * 4 + 1] = e; nbrN[a * 4 + 1] = b; nbrE[b * 4 + 3] = e; nbrN[b * 4 + 3] = a;
    }
    for (let r = 0; r < h - 1; r++) for (let c = 0; c < w; c++) {
      const e = HE + r * w + c, a = r * w + c, b = a + w;
      ea[e] = a; eb[e] = b; nbrE[a * 4 + 2] = e; nbrN[a * 4 + 2] = b; nbrE[b * 4] = e; nbrN[b * 4] = a;
    }
    const nodeE = [];
    for (let n = 0; n < N; n++) { const a = []; for (let d = 0; d < 4; d++) if (nbrE[n * 4 + d] >= 0) a.push(nbrE[n * 4 + d]); nodeE.push(a); }
    const pearl = new Int8Array(N), pearls = [];
    for (let i = 0; i < N; i++) {
      const ch = grid ? (typeof grid[0] === 'string' ? grid[Math.floor(i / w)][i % w] : grid[i]) : '.';
      pearl[i] = ch === 'w' || ch === 1 ? 1 : ch === 'b' || ch === 2 ? 2 : 0;
      if (pearl[i]) pearls.push(i);
    }
    return { kind: 'masyu', w, h, N, E, HE, NW: w, NC: 0, ea, eb, nbrE, nbrN, nodeE, cellE: null, edgeCells: null, clue: null, clueCells: [], pearl, pearls };
  };

  /* ---------- state ---------- */

  function newState(P) {
    const S = { v: new Int8Array(P.E).fill(-1), on: new Uint8Array(P.N), un: new Uint8Array(P.N), pt: new Int32Array(P.N), ln: new Int32Array(P.N), onCount: 0, closed: 0, loopLen: 0, why: null, nset: 0, p2: 0 };
    for (let n = 0; n < P.N; n++) { S.un[n] = P.nodeE[n].length; S.pt[n] = n; }
    return S;
  }
  function cloneState(S) {
    return { v: S.v.slice(), on: S.on.slice(), un: S.un.slice(), pt: S.pt.slice(), ln: S.ln.slice(), onCount: S.onCount, closed: S.closed, loopLen: S.loopLen, why: null, nset: 0, p2: 0 };
  }
  function newQueue(P) {
    const size = P.N + P.NC;
    return { a: new Int32Array(size + 1), inq: new Uint8Array(size), h: 0, t: 0, size: size + 1 };
  }
  function qpush(Q, x) { if (Q.inq[x]) return; Q.inq[x] = 1; Q.a[Q.t] = x; Q.t = (Q.t + 1) % Q.size; }
  function qpop(Q) { const x = Q.a[Q.h]; Q.h = (Q.h + 1) % Q.size; Q.inq[x] = 0; return x; }
  function enq(P, Q, e) {
    const a = P.ea[e], b = P.eb[e];
    qpush(Q, a); qpush(Q, b);
    if (P.kind === 'slither') { const cs = P.edgeCells[e]; for (let k = 0; k < cs.length; k++) if (P.clue[cs[k]] >= 0) qpush(Q, P.N + cs[k]); }
    else {
      for (let d = 0; d < 4; d++) {
        const x = P.nbrN[a * 4 + d], y = P.nbrN[b * 4 + d];
        if (x >= 0 && P.pearl[x]) qpush(Q, x);
        if (y >= 0 && P.pearl[y]) qpush(Q, y);
      }
    }
  }

  // put a value on an edge; false (and S.why) on a contradiction
  function lset(P, S, e, val, Q) {
    const cur = S.v[e];
    if (cur === val) return true;
    if (cur !== -1) { S.why = { t: 'conflict', e }; return false; }
    if (val === 1 && S.closed) { S.why = { t: 'extra', e }; return false; }
    const a = P.ea[e], b = P.eb[e];
    if (val === 1) {
      if (S.on[a] >= 2) { S.why = { t: 'node3', n: a }; return false; }
      if (S.on[b] >= 2) { S.why = { t: 'node3', n: b }; return false; }
      const pa = S.on[a] ? S.pt[a] : a, la = S.on[a] ? S.ln[a] : 0;
      const pb = S.on[b] ? S.pt[b] : b, lb = S.on[b] ? S.ln[b] : 0;
      S.v[e] = 1; S.on[a]++; S.on[b]++; S.onCount++; S.un[a]--; S.un[b]--; S.nset++;
      if (pa === b) {
        S.closed = 1; S.loopLen = la + 1;
        if (S.onCount !== S.loopLen) { S.why = { t: 'loop', e }; return false; }
      } else { S.pt[pa] = pb; S.pt[pb] = pa; S.ln[pa] = S.ln[pb] = la + lb + 1; }
    } else { S.v[e] = 0; S.un[a]--; S.un[b]--; S.nset++; }
    if (Q) enq(P, Q, e);
    return true;
  }
  L.lset = lset;

  // a state from a list of edge values (-1/0/1); null if they contradict each other
  function stateFrom(P, v0) {
    const S = newState(P);
    if (v0) for (let e = 0; e < P.E; e++) if (v0[e] >= 0 && !lset(P, S, e, v0[e], null)) return null;
    return S;
  }
  L.lstateFrom = stateFrom;

  /* ---------- the rules ---------- */

  function nodeRule(P, S, n, Q) {
    const on = S.on[n], un = S.un[n];
    const pearl = P.pearl ? P.pearl[n] : 0;
    if (on > 2) return (S.why = { t: 'node3', n });
    if (pearl && on + un < 2) return (S.why = { t: 'pearlcut', n });
    if (!un) { if (on === 1) return (S.why = { t: 'dead', n }); return null; }
    let want = -1;
    if (on === 2) want = 0;
    else if (on === 1 && un === 1) want = 1;
    else if (on === 0 && un === 1) want = 0;
    else if (pearl && on + un === 2) want = 1;
    if (want < 0) return null;
    const es = P.nodeE[n];
    for (let k = 0; k < es.length; k++) if (S.v[es[k]] === -1 && !lset(P, S, es[k], want, Q)) return S.why;
    return null;
  }

  function clueRule(P, S, c, Q) {
    const k = P.clue[c];
    let on = 0, un = 0;
    for (let q = 0; q < 4; q++) { const x = S.v[P.cellE[c * 4 + q]]; if (x === 1) on++; else if (x < 0) un++; }
    if (on > k) return (S.why = { t: 'clue', c, over: 1 });
    if (on + un < k) return (S.why = { t: 'clue', c, over: 0 });
    if (!un) return null;
    const want = on === k ? 0 : on + un === k ? 1 : -1;
    if (want < 0) return null;
    for (let q = 0; q < 4; q++) { const e = P.cellE[c * 4 + q]; if (S.v[e] === -1 && !lset(P, S, e, want, Q)) return S.why; }
    return null;
  }

  // edge value, with a missing edge (off the grid) counting as crossed out
  const ev = (S, e) => (e < 0 ? 0 : S.v[e]);

  function pearlRule(P, S, n, Q) {
    const pl = P.pearl[n], v = S.v;
    const E4 = n * 4;
    if (pl === 2) {
      // black: turn here, and run straight through the next cell on both legs
      for (let d = 0; d < 4; d++) {
        const e1 = P.nbrE[E4 + d];
        if (e1 < 0) continue;
        const m = P.nbrN[E4 + d], e2 = P.nbrE[m * 4 + d];
        const x1 = v[e1], x2 = e2 < 0 ? 0 : v[e2];
        if (x2 === 0) {
          if (x1 === 1) return (S.why = { t: 'black-leg', n, d });
          if (x1 === -1 && !lset(P, S, e1, 0, Q)) return S.why;
        } else if (x1 === 1) {
          if (x2 === -1 && !lset(P, S, e2, 1, Q)) return S.why;
          const eo = P.nbrE[E4 + (d + 2) % 4];
          if (eo >= 0) { if (v[eo] === 1) return (S.why = { t: 'black-straight', n }); if (v[eo] === -1 && !lset(P, S, eo, 0, Q)) return S.why; }
        }
      }
      for (let ax = 0; ax < 2; ax++) {
        const da = ax ? 1 : 0, db = ax ? 3 : 2;
        const ea = P.nbrE[E4 + da], eb = P.nbrE[E4 + db];
        const xa = ev(S, ea), xb = ev(S, eb);
        if (xa === 0 && xb === 0) return (S.why = { t: 'black-axis', n, ax });
        if (xa === 1 && xb === 1) return (S.why = { t: 'black-straight', n });
        if (xa === 0 && xb === -1 && !lset(P, S, eb, 1, Q)) return S.why;
        if (xb === 0 && xa === -1 && !lset(P, S, ea, 1, Q)) return S.why;
      }
      return null;
    }
    // white: straight through, and a turn in at least one of the two neighbours
    const eU = P.nbrE[E4], eR = P.nbrE[E4 + 1], eD = P.nbrE[E4 + 2], eL = P.nbrE[E4 + 3];
    const xu = ev(S, eU), xr = ev(S, eR), xd = ev(S, eD), xl = ev(S, eL);
    const hNo = xl === 0 || xr === 0 || xu === 1 || xd === 1;   // cannot run left-right
    const vNo = xu === 0 || xd === 0 || xl === 1 || xr === 1;   // cannot run up-down
    if (hNo && vNo) return (S.why = { t: 'white-straight', n });
    let ax = -1;
    if (hNo) ax = 0; else if (vNo) ax = 1;
    if (ax === 0) {
      if (xu === -1 && !lset(P, S, eU, 1, Q)) return S.why;
      if (xd === -1 && !lset(P, S, eD, 1, Q)) return S.why;
      if (xl === -1 && !lset(P, S, eL, 0, Q)) return S.why;
      if (xr === -1 && !lset(P, S, eR, 0, Q)) return S.why;
    } else if (ax === 1) {
      if (xl === -1 && !lset(P, S, eL, 1, Q)) return S.why;
      if (xr === -1 && !lset(P, S, eR, 1, Q)) return S.why;
      if (xu === -1 && !lset(P, S, eU, 0, Q)) return S.why;
      if (xd === -1 && !lset(P, S, eD, 0, Q)) return S.why;
    } else return null;
    // the turn: along axis (ax 0 = vertical run through the pearl, 1 = horizontal)
    const d1 = ax === 0 ? 0 : 3, d2 = ax === 0 ? 2 : 1;
    const m1 = P.nbrN[E4 + d1], m2 = P.nbrN[E4 + d2];
    const c1 = m1 < 0 ? -1 : P.nbrE[m1 * 4 + d1], c2 = m2 < 0 ? -1 : P.nbrE[m2 * 4 + d2];
    const s1 = ev(S, c1), s2 = ev(S, c2);
    if (s1 === 1 && s2 === 1) return (S.why = { t: 'white-turn', n });
    if (s1 === 1 && s2 === -1 && !lset(P, S, c2, 0, Q)) return S.why;
    if (s2 === 1 && s1 === -1 && !lset(P, S, c1, 0, Q)) return S.why;
    return null;
  }

  // closing the loop now must give the whole answer: every clue / pearl satisfied
  function closeOk(P, S, e) {
    const v = S.v.slice();
    v[e] = 1;
    for (let k = 0; k < v.length; k++) if (v[k] < 0) v[k] = 0;
    return kindOk(P, v);
  }
  function kindOk(P, v) {
    if (P.kind === 'slither') {
      for (const c of P.clueCells) {
        let on = 0;
        for (let q = 0; q < 4; q++) if (v[P.cellE[c * 4 + q]] === 1) on++;
        if (on !== P.clue[c]) return false;
      }
      return true;
    }
    for (const n of P.pearls) if (!pearlOk(P, v, n)) return false;
    return true;
  }
  function pearlOk(P, v, n) {
    const E4 = n * 4, x = [0, 0, 0, 0];
    for (let d = 0; d < 4; d++) { const e = P.nbrE[E4 + d]; x[d] = e >= 0 && v[e] === 1 ? 1 : 0; }
    if (x[0] + x[1] + x[2] + x[3] !== 2) return false;
    const straightAt = (m, d) => { const e = P.nbrE[m * 4 + d]; return e >= 0 && v[e] === 1; };
    if (P.pearl[n] === 2) {
      if (x[0] === x[2]) return false;            // not a turn
      for (let d = 0; d < 4; d++) if (x[d] && !straightAt(P.nbrN[E4 + d], d)) return false;
      return true;
    }
    if (x[0] !== x[2] || x[1] !== x[3]) return false;   // not straight
    const d1 = x[0] ? 0 : 3, d2 = x[0] ? 2 : 1;
    return !(straightAt(P.nbrN[E4 + d1], d1) && straightAt(P.nbrN[E4 + d2], d2));
  }
  L.pearlOk = pearlOk;

  function loopPass(P, S, Q) {
    if (S.closed) {
      for (let e = 0; e < P.E; e++) if (S.v[e] === -1 && !lset(P, S, e, 0, Q)) return S.why;
      return null;
    }
    for (let n = 0; n < P.N; n++) {
      if (S.on[n] !== 1 || !S.un[n]) continue;
      const m = S.pt[n];
      if (m < n) continue;
      for (let d = 0; d < 4; d++) {
        const e = P.nbrE[n * 4 + d];
        if (e < 0 || S.v[e] !== -1 || P.nbrN[n * 4 + d] !== m) continue;
        if (S.onCount !== S.ln[n] || !closeOk(P, S, e)) { if (!lset(P, S, e, 0, Q)) return S.why; }
      }
    }
    return null;
  }

  /* ---------- level 2: well-known patterns ---------- */

  // Slitherlink: what a clue's corner can say, and pairs of 3s. Returns deductions
  // { set: [[e, v]…], t, c, n?, c2? }; only ones that change something.
  function slPatterns(P, S, one) {
    const out = [], v = S.v, w = P.w, h = P.h;
    // a deduction is kept if it adds something — or if it contradicts what is there
    // (so that the rules stay monotone: more knowledge never hides a contradiction)
    const push = (set, t, c, extra) => {
      let unk = false, bad = false;
      for (const [e, x] of set) { if (v[e] === -1) unk = true; else if (v[e] !== x) bad = true; }
      if (!unk && !bad) return false;
      out.push(Object.assign({ set, t, c }, extra || {}));
      return one;
    };
    for (const c of P.clueCells) {
      const k = P.clue[c];
      if (k === 0) continue;
      for (let q = 0; q < 4; q++) {
        const n = slCorner(P, c, q);
        const ea = P.cellE[c * 4 + PAIR[q][0]], eb = P.cellE[c * 4 + PAIR[q][1]];
        const q2 = (q + 2) % 4;
        const fa = P.cellE[c * 4 + PAIR[q2][0]], fb = P.cellE[c * 4 + PAIR[q2][1]];
        let oOn = 0, oUn = 0;
        for (const e of P.nodeE[n]) if (e !== ea && e !== eb) { if (v[e] === 1) oOn++; else if (v[e] < 0) oUn++; }
        if (k === 3) {
          if (oOn === 0 && oUn === 0 && push([[ea, 1], [eb, 1]], '3corner', c, { n })) return out;
          if (oOn === 1 && push([[fa, 1], [fb, 1]], '3enter', c, { n })) return out;
        } else if (k === 1) {
          if (oOn === 0 && oUn === 0 && push([[ea, 0], [eb, 0]], '1corner', c, { n })) return out;
          if (oOn === 1 && oUn === 0 && push([[fa, 0], [fb, 0]], '1enter', c, { n })) return out;
        } else if (k === 2 && oOn === 1 && oUn === 0) {
          const n2 = slCorner(P, c, q2);
          let o2On = 0;
          const o2Un = [];
          for (const e of P.nodeE[n2]) if (e !== fa && e !== fb) { if (v[e] === 1) o2On++; else if (v[e] < 0) o2Un.push(e); }
          if ((o2On === 0 && !o2Un.length) || o2On >= 2) { out.push({ set: [], t: '2pass', c, n, n2, contra: true }); if (one) return out; continue; }
          if (o2On === 0 && o2Un.length === 1 && push([[o2Un[0], 1]], '2pass', c, { n, n2 })) return out;
          if (o2On === 1 && o2Un.length && push(o2Un.map((e) => [e, 0]), '2pass', c, { n, n2 })) return out;
        }
      }
      if (k !== 3) continue;
      const r = Math.floor(c / w), col = c % w;
      if (col + 1 < w && P.clue[c + 1] === 3) {
        const sh = P.cellE[c * 4 + 1], top = P.ea[sh], bot = P.eb[sh];
        const set = [[sh, 1], [P.cellE[c * 4 + 3], 1], [P.cellE[(c + 1) * 4 + 1], 1]];
        if (P.nbrE[top * 4] >= 0) set.push([P.nbrE[top * 4], 0]);
        if (P.nbrE[bot * 4 + 2] >= 0) set.push([P.nbrE[bot * 4 + 2], 0]);
        if (push(set, '33', c, { c2: c + 1 })) return out;
      }
      if (r + 1 < h && P.clue[c + w] === 3) {
        const sh = P.cellE[c * 4 + 2], lft = P.ea[sh], rgt = P.eb[sh];
        const set = [[sh, 1], [P.cellE[c * 4], 1], [P.cellE[(c + w) * 4 + 2], 1]];
        if (P.nbrE[lft * 4 + 3] >= 0) set.push([P.nbrE[lft * 4 + 3], 0]);
        if (P.nbrE[rgt * 4 + 1] >= 0) set.push([P.nbrE[rgt * 4 + 1], 0]);
        if (push(set, '33', c, { c2: c + w })) return out;
      }
      if (r + 1 < h && col + 1 < w && P.clue[c + w + 1] === 3) {
        const d = c + w + 1;
        if (push([[P.cellE[c * 4], 1], [P.cellE[c * 4 + 3], 1], [P.cellE[d * 4 + 2], 1], [P.cellE[d * 4 + 1], 1]], '3diag', c, { c2: d })) return out;
      }
      if (r + 1 < h && col > 0 && P.clue[c + w - 1] === 3) {
        const d = c + w - 1;
        if (push([[P.cellE[c * 4], 1], [P.cellE[c * 4 + 1], 1], [P.cellE[d * 4 + 2], 1], [P.cellE[d * 4 + 3], 1]], '3diag', c, { c2: d })) return out;
      }
    }
    return out;
  }

  // Masyu: a black pearl never heads for a black neighbour; a white pearl between two whites runs across them
  function maPatterns(P, S, one) {
    const out = [], v = S.v;
    for (const n of P.pearls) {
      if (P.pearl[n] === 2) {
        for (let d = 0; d < 4; d++) {
          const e = P.nbrE[n * 4 + d];
          if (e < 0 || v[e] === 0) continue;
          const m = P.nbrN[n * 4 + d];
          if (P.pearl[m] === 2) { out.push({ set: [[e, 0]], t: 'bb', n, m }); if (one) return out; }
        }
      } else {
        for (let ax = 0; ax < 2; ax++) {
          const d1 = ax ? 3 : 0, d2 = ax ? 1 : 2;   // ax 1: left/right neighbours
          const a = P.nbrN[n * 4 + d1], b = P.nbrN[n * 4 + d2];
          if (a < 0 || b < 0 || P.pearl[a] !== 1 || P.pearl[b] !== 1) continue;
          const along = [P.nbrE[n * 4 + d1], P.nbrE[n * 4 + d2]], across = [P.nbrE[n * 4 + (d1 + 1) % 4], P.nbrE[n * 4 + (d2 + 1) % 4]];
          const set = along.map((e) => [e, 0]).concat(across.filter((e) => e >= 0).map((e) => [e, 1]));
          if (across.some((e) => e < 0) || set.some(([e, x]) => v[e] !== x)) { out.push({ set, t: 'www', n, a, b, contra: across.some((e) => e < 0) }); if (one) return out; }
        }
      }
    }
    return out;
  }
  function patterns(P, S, one) { return P.kind === 'slither' ? slPatterns(P, S, one) : maPatterns(P, S, one); }

  /* ---------- propagation ---------- */

  // apply the rules until nothing changes: level 1 plain rules and the loop rule,
  // level 2 also the patterns. Q: a queue already seeded by lset (else: everything)
  function propagate(P, S, level, Q) {
    if (!Q) {
      Q = newQueue(P);
      for (let n = 0; n < P.N; n++) qpush(Q, n);
      for (const c of P.clueCells) qpush(Q, P.N + c);
    }
    for (;;) {
      while (Q.h !== Q.t) {
        const it = qpop(Q);
        let r;
        if (it < P.N) {
          r = nodeRule(P, S, it, Q);
          if (!r && P.pearl && P.pearl[it]) r = pearlRule(P, S, it, Q);
        } else r = clueRule(P, S, it - P.N, Q);
        if (r) return r;
      }
      const r = loopPass(P, S, Q);
      if (r) return r;
      if (Q.h !== Q.t) continue;
      if (level >= 2) {
        const found = patterns(P, S, false);
        if (found.length) {
          S.p2++;
          for (const f of found) {
            if (f.contra) return (S.why = P.kind === 'slither' ? { t: 'clue', c: f.c, over: 0 } : { t: 'white-straight', n: f.n });
            for (const [e, x] of f.set) if (!lset(P, S, e, x, Q)) return S.why;
          }
          continue;
        }
      }
      return null;
    }
  }
  L.lpropagate = propagate;
  L.lclone = (S) => cloneState(S);
  L.lqueue = (P) => newQueue(P);
  L.ltrialOrder = (P, S) => trialOrder(P, S);

  function openEdges(S) { let k = 0; for (let e = 0; e < S.v.length; e++) if (S.v[e] < 0) k++; return k; }

  // the edges worth supposing first: at the loose ends of lines, then near clues and pearls
  function trialOrder(P, S) {
    const pri = new Int8Array(P.E).fill(3);
    for (let e = 0; e < P.E; e++) {
      if (S.v[e] !== -1) continue;
      const a = P.ea[e], b = P.eb[e];
      if (S.on[a] === 1 || S.on[b] === 1) pri[e] = 0;
      else if (S.un[a] < P.nodeE[a].length || S.un[b] < P.nodeE[b].length) pri[e] = 1;
    }
    if (P.kind === 'slither') for (const c of P.clueCells) for (let q = 0; q < 4; q++) { const e = P.cellE[c * 4 + q]; if (pri[e] > 2) pri[e] = 2; }
    else for (const n of P.pearls) for (const e of P.nodeE[n]) if (pri[e] > 2) pri[e] = 2;
    const out = [];
    for (let p = 0; p <= 3; p++) for (let e = 0; e < P.E; e++) if (S.v[e] === -1 && pri[e] === p) out.push(e);
    return out;
  }

  // one "suppose" step: an edge value that leads to a contradiction (level-2 rules)
  function findTrial(P, S, best) {
    let found = null;
    for (const e of trialOrder(P, S)) {
      for (const val of [1, 0]) {
        const T = cloneState(S), Q = newQueue(P);
        if (!lset(P, T, e, val, Q)) { const res = { e, val: 1 - val, why: T.why, T, len: 0 }; if (!best) return res; if (!found || res.len < found.len) found = res; continue; }
        const c = propagate(P, T, 2, Q);
        if (c) {
          const res = { e, val: 1 - val, why: c, T, len: T.nset };
          if (!best) return res;
          if (!found || res.len < found.len) found = res;
          break;
        }
      }
      if (found && best && found.len <= 3) break;
    }
    return found;
  }

  /* How far logic of a level gets from an empty grid (or from v0).
   * Returns { ok (no contradiction), done, v, l2 (pattern rounds), l3 (suppositions), l4 }. */
  L.loopSolve = function (P, level, v0, budgetMs) {
    const S = v0 ? stateFrom(P, v0) : newState(P);
    const res = { ok: false, done: false, v: null, l2: 0, l3: 0, l4: 0, timeout: false };
    if (!S) return res;
    const t0 = budgetMs ? now() : 0;
    let c = propagate(P, S, Math.min(level, 2), null);
    for (let guard = 0; !c && guard < 5000; guard++) {
      if (!openEdges(S)) break;
      if (level < 3) break;
      if (budgetMs && now() - t0 > budgetMs) { res.timeout = true; break; }
      const tr = findTrial(P, S, false);
      if (!tr) {
        if (level < 4) break;
        // level 4: a supposition that level 3 refutes
        const deep = deepTrial(P, S);
        if (!deep) break;
        res.l4++;
        const Q = newQueue(P);
        if (!lset(P, S, deep.e, deep.val, Q)) { c = S.why; break; }
        c = propagate(P, S, 2, Q);
        continue;
      }
      res.l3++;
      const Q = newQueue(P);
      if (!lset(P, S, tr.e, tr.val, Q)) { c = S.why; break; }
      c = propagate(P, S, 2, Q);
    }
    res.l2 = S.p2;
    res.ok = !c;
    res.v = S.v;
    res.done = res.ok && !openEdges(S) && S.closed === 1 && validFinal(P, S.v);
    return res;
  };
  function deepTrial(P, S) {
    for (const e of trialOrder(P, S)) {
      for (const val of [1, 0]) {
        const T = cloneState(S), Q = newQueue(P);
        if (!lset(P, T, e, val, Q)) return { e, val: 1 - val };
        let c = propagate(P, T, 2, Q);
        for (let g = 0; !c && g < 200 && openEdges(T); g++) {
          const tr = findTrial(P, T, false);
          if (!tr) break;
          const Q2 = newQueue(P);
          if (!lset(P, T, tr.e, tr.val, Q2)) { c = T.why; break; }
          c = propagate(P, T, 2, Q2);
        }
        if (c) return { e, val: 1 - val };
      }
    }
    return null;
  }

  // a complete answer: one single loop, every clue or pearl satisfied
  function validFinal(P, v) {
    const deg = new Uint8Array(P.N);
    let total = 0, start = -1;
    for (let e = 0; e < P.E; e++) if (v[e] === 1) { deg[P.ea[e]]++; deg[P.eb[e]]++; total++; start = P.ea[e]; }
    if (!total) return false;
    for (let n = 0; n < P.N; n++) if (deg[n] !== 0 && deg[n] !== 2) return false;
    // walk the loop from start
    let n = start, prev = -1, steps = 0;
    for (;;) {
      let next = -1, via = -1;
      for (let d = 0; d < 4; d++) {
        const e = P.nbrE[n * 4 + d];
        if (e >= 0 && v[e] === 1 && e !== prev) { next = P.nbrN[n * 4 + d]; via = e; break; }
      }
      if (next < 0) return false;
      steps++;
      prev = via;
      n = next;
      if (n === start) break;
      if (steps > total) return false;
    }
    if (steps !== total) return false;
    return kindOk(P, v);
  }
  L.loopValid = validFinal;

  /* Count solutions (up to limit) by backtracking over the level-1 rules.
   * Returns { count, sol, nodes, aborted }. */
  L.loopCount = function (P, v0, limit, nodeLimit) {
    limit = limit || 2;
    nodeLimit = nodeLimit || 200000;
    let count = 0, sol = null, nodes = 0, aborted = false;
    const rec = (S, Q) => {
      if (count >= limit || aborted) return;
      if (++nodes > nodeLimit) { aborted = true; return; }
      if (propagate(P, S, 1, Q)) return;
      // the next edge to try: a loose end with the fewest ways on
      let e = -1, best = 9;
      for (let n = 0; n < P.N; n++) {
        if (S.on[n] !== 1 || !S.un[n] || S.un[n] >= best) continue;
        best = S.un[n];
        for (const x of P.nodeE[n]) if (S.v[x] === -1) { e = x; break; }
      }
      if (e < 0) {
        if (P.kind === 'slither') {
          let bk = -1;
          for (const c of P.clueCells) {
            let un = 0, first = -1;
            for (let q = 0; q < 4; q++) { const x = P.cellE[c * 4 + q]; if (S.v[x] === -1) { un++; if (first < 0) first = x; } }
            if (un && P.clue[c] > bk) { bk = P.clue[c]; e = first; }
          }
        } else {
          for (const n of P.pearls) { for (const x of P.nodeE[n]) if (S.v[x] === -1) { e = x; break; } if (e >= 0) break; }
        }
      }
      if (e < 0) for (let x = 0; x < P.E; x++) if (S.v[x] === -1) { e = x; break; }
      if (e < 0) {
        if (S.closed && validFinal(P, S.v)) { count++; if (!sol) sol = S.v.slice(); }
        return;
      }
      for (const val of [1, 0]) {
        const T = cloneState(S), Q2 = newQueue(P);
        if (lset(P, T, e, val, Q2)) rec(T, Q2);
        if (count >= limit || aborted) return;
      }
    };
    const S = v0 ? stateFrom(P, v0) : newState(P);
    if (S) rec(S, null);
    return { count, sol, nodes, aborted };
  };

  /* ---------- hints: the next step, explained ---------- */

  const clueAt = (P, c) => 'the **' + P.clue[c] + '** at ' + cellName(c, P.w);
  const pearlAt = (P, n) => 'the ' + (P.pearl[n] === 2 ? 'black' : 'white') + ' pearl at ' + cellName(n, P.w);
  const sides = (k) => (k === 1 ? 'side' : 'sides');

  // what a contradiction looks like, in words, and where
  function whyText(P, why) {
    if (!why) return { text: 'the rules would break', focus: {} };
    const t = why.t;
    if (t === 'node3') return { text: 'three lines would meet at one dot', focus: { nodes: [why.n] } };
    if (t === 'dead') return { text: 'a line would run into a dead end', focus: { nodes: [why.n] } };
    if (t === 'clue') return { text: clueAt(P, why.c) + (why.over ? ' would get too many lines' : ' could not get its ' + plural(P.clue[why.c], 'line')), focus: { cells: [why.c] } };
    if (t === 'loop' || t === 'extra') return { text: 'a loop would close with other lines left outside it', focus: { edges: [why.e] } };
    if (t === 'pearlcut') return { text: 'the loop could no longer pass through ' + pearlAt(P, why.n), focus: { cells: [why.n] } };
    if (t === 'black-leg' || t === 'black-axis' || t === 'black-straight') return { text: pearlAt(P, why.n) + ' could not turn with a straight leg on each side', focus: { cells: [why.n] } };
    if (t === 'white-straight') return { text: pearlAt(P, why.n) + ' could not be passed straight through', focus: { cells: [why.n] } };
    if (t === 'white-turn') return { text: 'the loop would not turn on either side of ' + pearlAt(P, why.n), focus: { cells: [why.n] } };
    return { text: 'one edge would have to be both a line and not a line', focus: why.e != null ? { edges: [why.e] } : {} };
  }

  function pearlStepOf(P, S, n) {
    const v = S.v, E4 = n * 4, where = pearlAt(P, n);
    const unk = (e) => e >= 0 && v[e] === -1;
    if (P.pearl[n] === 2) {
      for (let d = 0; d < 4; d++) {
        const e1 = P.nbrE[E4 + d];
        if (e1 < 0) continue;
        const m = P.nbrN[E4 + d], e2 = P.nbrE[m * 4 + d];
        const x2 = e2 < 0 ? 0 : v[e2];
        if (x2 === 0 && v[e1] === -1) {
          return { set: [[e1, 0]], text: 'A black pearl\'s line runs straight on through the next cell. From ' + where + ', a line going ' + DIRNAME[d] + ' would ' + (e2 < 0 ? 'run off the grid' : 'meet a crossed-out edge') + ' at once: cross that way out.' };
        }
        if (v[e1] === 1) {
          const set = [];
          const eo = P.nbrE[E4 + (d + 2) % 4];
          if (unk(e2)) set.push([e2, 1]);
          if (unk(eo)) set.push([eo, 0]);
          if (set.length) return { set, text: 'The loop leaves ' + where + ' going ' + DIRNAME[d] + '. ' + (unk(e2) ? 'A black pearl\'s leg carries straight on through the next cell' : '') + (unk(e2) && unk(eo) ? ', and ' : '') + (unk(eo) ? 'the pearl must turn, so it cannot also go ' + DIRNAME[(d + 2) % 4] : '') + '.' };
        }
      }
      for (let ax = 0; ax < 2; ax++) {
        const da = ax ? 1 : 0, db = ax ? 3 : 2;
        const ea = P.nbrE[E4 + da], eb = P.nbrE[E4 + db];
        const xa = ev(S, ea), xb = ev(S, eb);
        if (xa === 0 && xb === -1) return { set: [[eb, 1]], text: 'A black pearl turns: the loop uses one of its ' + (ax ? 'left and right' : 'up and down') + ' sides. ' + where.charAt(0).toUpperCase() + where.slice(1) + ' cannot go ' + DIRNAME[da] + ', so it goes ' + DIRNAME[db] + '.' };
        if (xb === 0 && xa === -1) return { set: [[ea, 1]], text: 'A black pearl turns: the loop uses one of its ' + (ax ? 'left and right' : 'up and down') + ' sides. ' + where.charAt(0).toUpperCase() + where.slice(1) + ' cannot go ' + DIRNAME[db] + ', so it goes ' + DIRNAME[da] + '.' };
      }
      return null;
    }
    const eU = P.nbrE[E4], eR = P.nbrE[E4 + 1], eD = P.nbrE[E4 + 2], eL = P.nbrE[E4 + 3];
    const xu = ev(S, eU), xr = ev(S, eR), xd = ev(S, eD), xl = ev(S, eL);
    const hNo = xl === 0 || xr === 0 || xu === 1 || xd === 1;
    const vNo = xu === 0 || xd === 0 || xl === 1 || xr === 1;
    if (hNo !== vNo) {
      const ax = hNo ? 0 : 1;
      const set = [];
      const add = (e, x) => { if (unk(e)) set.push([e, x]); };
      if (ax === 0) { add(eU, 1); add(eD, 1); add(eL, 0); add(eR, 0); } else { add(eL, 1); add(eR, 1); add(eU, 0); add(eD, 0); }
      if (set.length) {
        const why = ax === 0 ? (xl === 1 || xr === 1 ? '' : xu === 1 || xd === 1 ? 'a line already runs up or down from it' : 'it cannot run left–right')
          : (xu === 1 || xd === 1 ? '' : xl === 1 || xr === 1 ? 'a line already runs sideways from it' : 'it cannot run up–down');
        return { set, text: 'A white pearl is passed straight through. ' + where.charAt(0).toUpperCase() + where.slice(1) + (why ? ': ' + why + ', so the loop' : ' already has a line, so the loop') + ' runs ' + (ax === 0 ? 'up and down' : 'left and right') + ' through it.' };
      }
    }
    if (hNo === vNo) return null;
    const ax = hNo ? 0 : 1;
    const d1 = ax === 0 ? 0 : 3, d2 = ax === 0 ? 2 : 1;
    const m1 = P.nbrN[E4 + d1], m2 = P.nbrN[E4 + d2];
    const c1 = m1 < 0 ? -1 : P.nbrE[m1 * 4 + d1], c2 = m2 < 0 ? -1 : P.nbrE[m2 * 4 + d2];
    const s1 = ev(S, c1), s2 = ev(S, c2);
    if (s1 === 1 && unk(c2)) return { set: [[c2, 0]], text: 'The loop must turn in a cell right next to ' + where + ', on one side or the other. It goes straight on ' + (ax === 0 ? 'above' : 'to the left of') + ' the pearl, so it has to turn ' + (ax === 0 ? 'below' : 'to the right') + ': it cannot carry straight on there.' };
    if (s2 === 1 && unk(c1)) return { set: [[c1, 0]], text: 'The loop must turn in a cell right next to ' + where + ', on one side or the other. It goes straight on ' + (ax === 0 ? 'below' : 'to the right of') + ' the pearl, so it has to turn ' + (ax === 0 ? 'above' : 'to the left') + ': it cannot carry straight on there.' };
    return null;
  }

  const PAT_TEXT = {
    '3corner': (P, f) => (P.nodeE[f.n].length === 2 ? 'A **3** in a corner of the grid: the loop has no way to get round that corner except along both of its outer sides. Draw them.'
      : 'At one corner of ' + clueAt(P, f.c) + ' every other way out of the dot is crossed out, so the loop either turns round that corner using both of the 3\'s sides there, or stays away from both. A 3 cannot lose two sides: draw both.'),
    '3enter': (P, f) => 'A line arrives at a corner of ' + clueAt(P, f.c) + ' from outside. It must carry on along exactly one of the 3\'s two sides at that corner, so the 3 needs both of its other sides. Draw them.',
    '1corner': (P, f) => 'At one corner of ' + clueAt(P, f.c) + ' the dot has no other way out, so the loop would have to use both of the 1\'s sides there to pass — one too many. Cross both out.',
    '1enter': (P, f) => 'A line comes into a corner of ' + clueAt(P, f.c) + ' and can only go on along one of the 1\'s two sides there. That uses up the 1: cross out its other two sides.',
    '2pass': (P, f) => 'A line comes into a corner of ' + clueAt(P, f.c) + ' and must go on along exactly one of its sides there. So the 2 uses exactly one of its other two sides as well, and the loop leaves by the opposite corner: ' + (f.set[0][1] === 1 ? 'there is only one way out of that dot.' : 'the other ways out of that dot are closed.'),
    '33': (P, f) => 'Two **3**s side by side (' + cellName(f.c, P.w) + ' and next door): the line between them and the two outer sides always belong to the loop, and the loop cannot run straight on past the middle line.',
    '3diag': (P, f) => 'Two **3**s touching at a corner: the loop always wraps round both of their far corners. Draw those four sides.',
    bb: (P, f) => 'Two black pearls side by side (' + cellName(f.n, P.w) + ' and ' + cellName(f.m, P.w) + '): a black pearl\'s line must run straight through the next cell, but the neighbouring black pearl has to turn. So neither pearl can head for the other.',
    www: (P, f) => 'Three white pearls in a row, the middle one at ' + cellName(f.n, P.w) + ': if it ran along the row, both neighbours would go straight too and the loop would not turn beside it. So it runs across the row.'
  };

  /* The next step from the position v0 (all marks right). Returns
   * { level, set: [[edge, value]…], text, focus: { cells, nodes, edges },
   *   ghost: [[edge, value]…] (what a supposition leads to), bad: focus } or null. */
  L.loopStep = function (P, v0, maxLevel, sol) {
    maxLevel = maxLevel || 4;
    const S = stateFrom(P, v0);
    if (!S) return null;
    const v = S.v, w = P.w;
    const unknownOf = (es) => es.filter((e) => v[e] === -1);
    // level 1: clues
    if (P.kind === 'slither') {
      const order = P.clueCells.slice().sort((a, b) => (P.clue[a] === 0 ? 0 : 1) - (P.clue[b] === 0 ? 0 : 1));
      for (const c of order) {
        const k = P.clue[c], es = [0, 1, 2, 3].map((q) => P.cellE[c * 4 + q]);
        const un = unknownOf(es), on = es.filter((e) => v[e] === 1).length;
        if (!un.length) continue;
        if (on === k) return { level: 1, set: un.map((e) => [e, 0]), focus: { cells: [c] }, text: k === 0 ? 'A **0** means the loop never touches its square: cross out all four sides of the 0 at ' + cellName(c, w) + '.' : clueAt(P, c).charAt(0).toUpperCase() + clueAt(P, c).slice(1) + ' already has its ' + plural(k, 'line') + ': cross out its other ' + sides(un.length) + '.' };
        if (on + un.length === k) return { level: 1, set: un.map((e) => [e, 1]), focus: { cells: [c] }, text: clueAt(P, c).charAt(0).toUpperCase() + clueAt(P, c).slice(1) + (on ? ' still needs ' + plural(k - on, 'line') + ', and only ' + word(un.length) + ' of its sides ' + (un.length === 1 ? 'is' : 'are') + ' left: draw ' + (un.length === 1 ? 'it' : 'them') + '.' : ' has only ' + word(un.length) + ' ' + sides(un.length) + ' that can still be used: draw ' + (un.length === 1 ? 'it' : 'them all') + '.') };
      }
    }
    // level 1: dots (and pearls)
    for (let n = 0; n < P.N; n++) {
      const on = S.on[n], un = S.un[n];
      if (!un) continue;
      const es = unknownOf(P.nodeE[n]);
      const pl = P.pearl ? P.pearl[n] : 0;
      const dot = P.kind === 'slither' ? 'the highlighted dot' : 'the highlighted cell';
      if (on === 1 && un === 1) return { level: 1, set: [[es[0], 1]], focus: { nodes: [n] }, text: 'The line that ends at ' + dot + ' can only go on one way: draw it.' };
      if (on === 2) return { level: 1, set: es.map((e) => [e, 0]), focus: { nodes: [n] }, text: 'The loop already passes through ' + dot + ', and never branches: cross out ' + (es.length === 1 ? 'the other edge there' : 'the other edges there') + '.' };
      if (pl && on + un === 2) return { level: 1, set: es.map((e) => [e, 1]), focus: { nodes: [n] }, text: 'The loop must pass through ' + pearlAt(P, n) + ', and only two ways in and out are left: use both.' };
      if (!pl && on === 0 && un === 1) return { level: 1, set: [[es[0], 0]], focus: { nodes: [n] }, text: 'Only one edge is left at ' + dot + ', so a line along it would be a dead end: cross it out.' };
    }
    if (P.kind === 'masyu') {
      for (const n of P.pearls) {
        const st = pearlStepOf(P, S, n);
        if (st) return { level: 1, set: st.set, focus: { nodes: [n] }, text: st.text };
      }
    }
    // level 1: the loop must be one loop
    if (S.closed) {
      const rest = [];
      for (let e = 0; e < P.E; e++) if (v[e] === -1) rest.push([e, 0]);
      if (rest.length) return { level: 1, set: rest, focus: {}, text: 'The loop is closed, so every edge left over is empty.' };
    }
    for (let n = 0; n < P.N; n++) {
      if (S.on[n] !== 1 || !S.un[n]) continue;
      const m = S.pt[n];
      for (let d = 0; d < 4; d++) {
        const e = P.nbrE[n * 4 + d];
        if (e < 0 || v[e] !== -1 || P.nbrN[n * 4 + d] !== m) continue;
        if (S.onCount !== S.ln[n]) return { level: 1, set: [[e, 0]], focus: { edges: [e] }, text: 'The highlighted edge would join the two ends of a line into a small loop, with other lines left outside it. There must be one single loop: cross it out.' };
        if (!closeOk(P, S, e)) return { level: 1, set: [[e, 0]], focus: { edges: [e] }, text: 'The highlighted edge would close the loop now — but ' + (P.kind === 'slither' ? 'some clues would be left without their lines' : 'some pearls would be left off the loop, or unhappy') + '. Cross it out.' };
      }
    }
    if (maxLevel < 2) return null;
    const pat = patterns(P, S, true).filter((f) => !f.contra && f.set.some(([e]) => v[e] === -1))[0];
    if (pat) {
      const cells = P.kind === 'slither' ? [pat.c].concat(pat.c2 != null ? [pat.c2] : []) : [pat.n].concat(pat.m != null ? [pat.m] : [], pat.a != null ? [pat.a, pat.b] : []);
      return { level: 2, set: pat.set.filter(([e]) => v[e] === -1), focus: { cells, nodes: P.kind === 'slither' && pat.n != null ? [pat.n].concat(pat.n2 != null ? [pat.n2] : []) : [] }, text: PAT_TEXT[pat.t](P, pat) };
    }
    if (maxLevel < 3) return null;
    const tr = findTrial(P, S, true);
    if (tr) {
      const ghost = [];
      if (tr.T) for (let e = 0; e < P.E; e++) if (tr.T.v[e] !== -1 && v[e] === -1) ghost.push([e, tr.T.v[e]]);
      if (!ghost.some(([e]) => e === tr.e)) ghost.unshift([tr.e, 1 - tr.val]);
      const wt = whyText(P, tr.why);
      const was = tr.val === 0 ? 'a line' : 'crossed out';
      return { level: 3, set: [[tr.e, tr.val]], focus: { edges: [tr.e] }, ghost, bad: wt.focus,
        text: 'Suppose the highlighted edge were ' + was + '. Follow the rules from there (the dashed marks) and ' + wt.text + '. So it must be ' + (tr.val === 1 ? 'a line' : 'crossed out') + '.' };
    }
    if (maxLevel < 4 || !sol) return null;
    let pick = -1;
    for (let e = 0; e < P.E; e++) if (v[e] === -1 && sol[e] === 1) { const a = P.ea[e], b = P.eb[e]; if (pick < 0 || S.on[a] + S.on[b] > 0) { pick = e; if (S.on[a] + S.on[b] > 0) break; } }
    if (pick < 0) for (let e = 0; e < P.E; e++) if (v[e] === -1) { pick = e; break; }
    if (pick < 0) return null;
    return { level: 4, set: [[pick, sol[pick]]], focus: { edges: [pick] }, text: 'This one needs a long chain of reasoning. The highlighted edge is ' + (sol[pick] ? 'part of the loop' : 'empty') + ' — can you see why?' };
  };

  // the reasoning an empty grid needs
  L.loopGrade = function (P, maxLevel) {
    const r = L.loopSolve(P, maxLevel || 3);
    const top = r.l4 ? 4 : r.l3 ? 3 : r.l2 ? 2 : 1;
    return { done: r.done, top, l2: r.l2, l3: r.l3, l4: r.l4 };
  };

  /* ---------- making loop puzzles ---------- */

  /* A random region of cells whose outline is one simple loop: the region is
   * connected, the cells outside all reach the border, and no two region cells
   * touch only at a corner. frac: the share of cells inside. */
  L.randomRegion = function (w, h, rng, frac, branchy) {
    const N = w * h, inR = new Uint8Array(N);
    const at = (r, c) => (r < 0 || c < 0 || r >= h || c >= w ? 0 : inR[r * w + c]);
    const vertexBad = (r, c) => { const a = at(r - 1, c - 1), b = at(r - 1, c), d = at(r, c - 1), e = at(r, c); return a === e && b === d && a !== b; };
    const cellBad = (i) => { const r = Math.floor(i / w), c = i % w; return vertexBad(r, c) || vertexBad(r, c + 1) || vertexBad(r + 1, c) || vertexBad(r + 1, c + 1); };
    const seen = new Uint8Array(N), stack = new Int32Array(N);
    const outOk = (outCount) => {
      seen.fill(0);
      let sp = 0, got = 0;
      for (let i = 0; i < N; i++) {
        const r = Math.floor(i / w), c = i % w;
        if (!inR[i] && (r === 0 || c === 0 || r === h - 1 || c === w - 1)) { seen[i] = 1; stack[sp++] = i; got++; }
      }
      while (sp) {
        const i = stack[--sp], r = Math.floor(i / w), c = i % w;
        for (let d = 0; d < 4; d++) {
          const rr = r + DR[d], cc = c + DC[d];
          if (rr < 0 || cc < 0 || rr >= h || cc >= w) continue;
          const j = rr * w + cc;
          if (!inR[j] && !seen[j]) { seen[j] = 1; stack[sp++] = j; got++; }
        }
      }
      return got === outCount;
    };
    const r0 = 1 + rng.int(Math.max(1, h - 2)), c0 = 1 + rng.int(Math.max(1, w - 2));
    inR[Math.min(h - 1, r0) * w + Math.min(w - 1, c0)] = 1;
    let size = 1;
    const target = Math.max(2, Math.round(N * frac));
    const bp = branchy == null ? 0.5 : branchy;
    for (let it = 0; it < N * 80 && size < target; it++) {
      const i = rng.int(N);
      if (inR[i]) continue;
      const r = Math.floor(i / w), c = i % w;
      let k = 0;
      for (let d = 0; d < 4; d++) k += at(r + DR[d], c + DC[d]);
      if (!k) continue;
      if (k === 2 && rng() < bp) continue;
      if (k === 3 && rng() < 0.3 + bp) continue;
      inR[i] = 1;
      if (cellBad(i) || !outOk(N - size - 1)) { inR[i] = 0; continue; }
      size++;
    }
    return size >= 2 ? inR : null;
  };

  // the loop around a region, as edge values of a Slitherlink grid
  L.slLoopOf = function (P, inR) {
    const w = P.w, h = P.h, v = new Int8Array(P.E);
    const at = (r, c) => (r < 0 || c < 0 || r >= h || c >= w ? 0 : inR[r * w + c]);
    for (let r = 0; r <= h; r++) for (let c = 0; c < w; c++) v[r * w + c] = at(r - 1, c) !== at(r, c) ? 1 : 0;
    for (let r = 0; r < h; r++) for (let c = 0; c <= w; c++) v[P.HE + r * P.NW + c] = at(r, c - 1) !== at(r, c) ? 1 : 0;
    return v;
  };
  // the loop around a region of the (w-1)×(h-1) squares between cell centres, as Masyu edges
  L.maLoopOf = function (P, faces) {
    const w = P.w, h = P.h, fw = w - 1, fh = h - 1, v = new Int8Array(P.E);
    const at = (r, c) => (r < 0 || c < 0 || r >= fh || c >= fw ? 0 : faces[r * fw + c]);
    for (let r = 0; r < h; r++) for (let c = 0; c < w - 1; c++) v[r * (w - 1) + c] = at(r - 1, c) !== at(r, c) ? 1 : 0;
    for (let r = 0; r < h - 1; r++) for (let c = 0; c < w; c++) v[P.HE + r * w + c] = at(r, c - 1) !== at(r, c) ? 1 : 0;
    return v;
  };
  function setClues(P, clue) {
    P.clue = clue;
    P.clueCells = [];
    for (let i = 0; i < P.NC; i++) if (clue[i] >= 0) P.clueCells.push(i);
  }
  function setPearls(P, pearl) {
    P.pearl = pearl;
    P.pearls = [];
    for (let i = 0; i < P.N; i++) if (pearl[i]) P.pearls.push(i);
  }

  L.slDiff = function (w, h, g) {
    const a = w * h;
    const size = a <= 25 ? 0 : a <= 36 ? 0.25 : a <= 49 ? 0.55 : a <= 64 ? 0.85 : a <= 100 ? 1.25 : 1.7;
    const lv = g.l4 ? 2.6 : g.l3 ? 1.5 + Math.min(0.9, g.l3 * 0.12) : g.l2 ? 0.45 + Math.min(0.5, g.l2 * 0.04) : 0;
    return clamp(Math.round(1 + size + lv), 1, 5);
  };
  L.maDiff = function (w, h, g) {
    const a = w * h;
    const size = a <= 36 ? 0 : a <= 49 ? 0.3 : a <= 64 ? 0.6 : a <= 100 ? 1.1 : 1.6;
    const lv = g.l4 ? 2.6 : g.l3 ? 1.5 + Math.min(0.9, g.l3 * 0.15) : g.l2 ? 0.4 + Math.min(0.4, g.l2 * 0.1) : 0;
    return clamp(Math.round(1 + size + lv), 1, 5);
  };

  /* A Slitherlink: a random loop, every clue written in, then clues taken away
   * (in random order) while logic of `level` still finishes the grid. */
  L.slMake = function (w, h, rng, level, opts) {
    opts = opts || {};
    const inR = L.randomRegion(w, h, rng, opts.frac || (0.45 + rng() * 0.2), opts.branchy);
    if (!inR) return null;
    const P = L.slPrep(w, h, null);
    const sol = L.slLoopOf(P, inR);
    const clue = new Int8Array(w * h);
    for (let i = 0; i < w * h; i++) { let k = 0; for (let q = 0; q < 4; q++) k += sol[P.cellE[i * 4 + q]]; clue[i] = k; }
    if (clue.some((k) => k === 4)) return null;
    setClues(P, clue);
    const t0 = now(), budget = opts.budget || 1e9;
    const solves = () => L.loopSolve(P, level).done;
    if (!solves()) return null;
    const order = rng.shuffle(Array.from({ length: w * h }, (_, i) => i));
    const keepFrac = opts.keep || 0;
    let left = w * h;
    for (const i of order) {
      if (now() - t0 > budget) return null;
      if (left <= w * h * keepFrac) break;
      const keep = clue[i];
      clue[i] = -1;
      setClues(P, clue);
      if (!solves()) { clue[i] = keep; setClues(P, clue); } else left--;
    }
    const g = L.loopGrade(P, 3);
    if (!g.done) return null;
    return { w, h, clues: toRows(clue, w, (x) => (x < 0 ? '.' : String(x))), sol: toRows(inR, w, (x) => (x ? '#' : '.')), grade: g, diff: L.slDiff(w, h, g), P };
  };

  // is a region's outline one simple loop? (connected, no holes, no corner-only touching)
  L.regionValid = function (inR, w, h) {
    const N = w * h;
    const at = (r, c) => (r < 0 || c < 0 || r >= h || c >= w ? 0 : inR[r * w + c]);
    for (let r = 0; r <= h; r++) for (let c = 0; c <= w; c++) {
      const a = at(r - 1, c - 1), b = at(r - 1, c), d = at(r, c - 1), e = at(r, c);
      if (a === e && b === d && a !== b) return false;
    }
    let start = -1, tot = 0;
    for (let i = 0; i < N; i++) if (inR[i]) { tot++; if (start < 0) start = i; }
    if (tot < 2) return false;
    const seen = new Uint8Array(N), st = [start];
    seen[start] = 1;
    let got = 1;
    while (st.length) {
      const i = st.pop(), r = Math.floor(i / w), c = i % w;
      for (let d = 0; d < 4; d++) {
        const rr = r + DR[d], cc = c + DC[d];
        if (rr < 0 || cc < 0 || rr >= h || cc >= w) continue;
        const j = rr * w + cc;
        if (inR[j] && !seen[j]) { seen[j] = 1; got++; st.push(j); }
      }
    }
    if (got !== tot) return false;
    const s2 = new Uint8Array(N), q = [];
    let g2 = 0;
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / w), c = i % w;
      if (!inR[i] && (r === 0 || c === 0 || r === h - 1 || c === w - 1)) { s2[i] = 1; q.push(i); g2++; }
    }
    while (q.length) {
      const i = q.pop(), r = Math.floor(i / w), c = i % w;
      for (let d = 0; d < 4; d++) {
        const rr = r + DR[d], cc = c + DC[d];
        if (rr < 0 || cc < 0 || rr >= h || cc >= w) continue;
        const j = rr * w + cc;
        if (!inR[j] && !s2[j]) { s2[j] = 1; g2++; q.push(j); }
      }
    }
    return g2 === N - tot;
  };

  // every pearl a loop allows: black on turns with straight legs, white on straights beside a turn
  L.maPearlsOf = function (P, sol) {
    const w = P.w, h = P.h;
    const on = (n, d) => { const e = P.nbrE[n * 4 + d]; return e >= 0 && sol[e] === 1; };
    const pearl = new Int8Array(w * h);
    const turn = (n) => (on(n, 0) || on(n, 2)) && (on(n, 1) || on(n, 3));
    for (let n = 0; n < w * h; n++) {
      const ds = [0, 1, 2, 3].filter((d) => on(n, d));
      if (!ds.length) continue;
      if (turn(n)) { if (ds.every((d) => on(P.nbrN[n * 4 + d], d))) pearl[n] = 2; }
      else if (ds.some((d) => turn(P.nbrN[n * 4 + d]))) pearl[n] = 1;
    }
    return pearl;
  };

  /* A Masyu: a random loop through cell centres with every pearl it allows,
   * reshaped square by square until logic of `level` pins it down; then pearls
   * taken away while that logic still finishes it. */
  L.maMake = function (w, h, rng, level, opts) {
    opts = opts || {};
    const fw = w - 1, fh = h - 1;
    let faces = L.randomRegion(fw, fh, rng, opts.frac || (0.45 + rng() * 0.15), opts.branchy);
    if (!faces) return null;
    const P = L.maPrep(w, h, null);
    const t0 = now(), budget = opts.budget || 1e9;
    let pearl = null;
    const openAfter = (f) => {
      const sol = L.maLoopOf(P, f);
      const pl = L.maPearlsOf(P, sol);
      setPearls(P, pl);
      const r = L.loopSolve(P, level);
      let open = 0;
      for (let e = 0; e < P.E; e++) if (r.v[e] < 0) open++;
      return { open: r.ok ? open : 1e9, pl };
    };
    let cur = openAfter(faces);
    for (let it = 0; it < (opts.iters || 60 * w) && cur.open > 0; it++) {
      if (now() - t0 > budget) return null;
      const i = rng.int(fw * fh);
      const r = Math.floor(i / fw), c = i % fw;
      let diff = 0;
      for (let d = 0; d < 4; d++) {
        const rr = r + DR[d], cc = c + DC[d];
        const x = rr < 0 || cc < 0 || rr >= fh || cc >= fw ? 0 : faces[rr * fw + cc];
        if (x !== faces[i]) diff++;
      }
      if (!diff) continue;
      const f2 = faces.slice();
      f2[i] ^= 1;
      if (!L.regionValid(f2, fw, fh)) continue;
      const nx = openAfter(f2);
      if (nx.open <= cur.open || rng() < 0.03) { faces = f2; cur = nx; }
    }
    if (cur.open > 0) return null;
    pearl = cur.pl;
    setPearls(P, pearl);
    const solves = () => L.loopSolve(P, level).done;
    if (!solves()) return null;
    const order = rng.shuffle(P.pearls.slice());
    for (const i of order) {
      if (now() - t0 > budget) return null;
      const keep = pearl[i];
      pearl[i] = 0;
      setPearls(P, pearl);
      if (!solves()) { pearl[i] = keep; setPearls(P, pearl); }
    }
    const g = L.loopGrade(P, 3);
    if (!g.done) return null;
    return { w, h, grid: toRows(pearl, w, (x) => '.wb'[x]), sol: toRows(faces, w - 1, (x) => (x ? '#' : '.')), grade: g, diff: L.maDiff(w, h, g), P };
  };

  /* =====================================================================
   *  BRIDGES (HASHIWOKAKERO)
   *  grid rows: '.' water, '1'-'8' an island needing that many bridges.
   *  Every possible bridge joins two islands that see each other along a row
   *  or column; state per bridge: lo..hi (0..2) bridges.
   * ===================================================================== */

  L.hsPrep = function (w, h, grid) {
    const N = w * h, cellIsl = new Int32Array(N).fill(-1), isl = [];
    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
      const ch = grid[r][c];
      if (ch >= '1' && ch <= '8') { cellIsl[r * w + c] = isl.length; isl.push({ i: r * w + c, r, c, k: +ch }); }
    }
    const B = [], islB = isl.map(() => []), through = Array.from({ length: N }, () => []);
    const islDir = new Int32Array(isl.length * 4).fill(-1);
    const add = (a, b, dir, cells) => {
      const id = B.length;
      B.push({ a, b, dir, cells });
      islB[a].push(id); islB[b].push(id);
      cells.forEach((x) => through[x].push(id));
      islDir[a * 4 + (dir ? 2 : 1)] = id; islDir[b * 4 + (dir ? 0 : 3)] = id;
    };
    isl.forEach((I, a) => {
      let cells = [];
      for (let c = I.c + 1; c < w; c++) { const j = I.r * w + c; if (cellIsl[j] >= 0) { add(a, cellIsl[j], 0, cells); break; } cells.push(j); }
      cells = [];
      for (let r = I.r + 1; r < h; r++) { const j = r * w + I.c; if (cellIsl[j] >= 0) { add(a, cellIsl[j], 1, cells); break; } cells.push(j); }
    });
    const cross = B.map(() => []);
    for (let x = 0; x < N; x++) {
      const t = through[x];
      for (let p = 0; p < t.length; p++) for (let q = p + 1; q < t.length; q++) if (B[t[p]].dir !== B[t[q]].dir) { cross[t[p]].push(t[q]); cross[t[q]].push(t[p]); }
    }
    return { kind: 'hashi', w, h, N, K: isl.length, isl, cellIsl, B, NB: B.length, islB, cross, through, islDir };
  };
  const islAt = (P, a) => 'the **' + P.isl[a].k + '** at ' + cellName(P.isl[a].i, P.w);
  L.islAt = islAt;

  function hsState(P) {
    const lo = new Int8Array(P.NB), hi = new Int8Array(P.NB);
    for (let b = 0; b < P.NB; b++) hi[b] = Math.min(2, P.isl[P.B[b].a].k, P.isl[P.B[b].b].k);
    return { lo, hi, why: null, nset: 0, p2: 0 };
  }
  const hsClone = (S) => ({ lo: S.lo.slice(), hi: S.hi.slice(), why: null, nset: 0, p2: 0 });

  // components joined by certain bridges (lo ≥ 1)
  function hsComps(P, S) {
    const par = new Int32Array(P.K);
    for (let i = 0; i < P.K; i++) par[i] = i;
    const find = (x) => { while (par[x] !== x) { par[x] = par[par[x]]; x = par[x]; } return x; };
    for (let b = 0; b < P.NB; b++) if (S.lo[b] >= 1) { const x = find(P.B[b].a), y = find(P.B[b].b); if (x !== y) par[x] = y; }
    const comp = new Int32Array(P.K);
    for (let i = 0; i < P.K; i++) comp[i] = find(i);
    return comp;
  }
  function needOf(P, S, i) { let s = 0; for (const b of P.islB[i]) s += S.lo[b]; return P.isl[i].k - s; }

  /* The rules until nothing changes. Level 1: island counts and crossings;
   * level 2 also: no group may close itself off, and a group with one way out takes it. */
  function hsProp(P, S, level) {
    const lo = S.lo, hi = S.hi;
    for (let guard = 0; guard < 1000; guard++) {
      let changed = false;
      for (let i = 0; i < P.K; i++) {
        let sl = 0, sh = 0;
        const bs = P.islB[i], k = P.isl[i].k;
        for (const b of bs) { sl += lo[b]; sh += hi[b]; }
        if (sl > k || sh < k) return (S.why = { t: 'island', i, over: sl > k });
        for (const b of bs) {
          const nl = Math.max(lo[b], k - (sh - hi[b])), nh = Math.min(hi[b], k - (sl - lo[b]));
          if (nl > nh) return (S.why = { t: 'island', i, over: true });
          if (nl !== lo[b] || nh !== hi[b]) { sl += nl - lo[b]; sh += nh - hi[b]; lo[b] = nl; hi[b] = nh; changed = true; S.nset++; }
        }
      }
      for (let b = 0; b < P.NB; b++) {
        if (lo[b] < 1) continue;
        for (const x of P.cross[b]) {
          if (lo[x] >= 1) return (S.why = { t: 'cross', b, x });
          if (hi[x]) { hi[x] = 0; changed = true; S.nset++; }
        }
      }
      if (changed) continue;
      // groups
      const comp = hsComps(P, S);
      const size = new Int32Array(P.K), needs = new Int32Array(P.K), exits = new Int32Array(P.K), exitB = new Int32Array(P.K).fill(-1);
      for (let i = 0; i < P.K; i++) { size[comp[i]]++; needs[comp[i]] += needOf(P, S, i); }
      for (let b = 0; b < P.NB; b++) {
        const ca = comp[P.B[b].a], cb = comp[P.B[b].b];
        if (ca === cb || hi[b] < 1) continue;
        exits[ca]++; exits[cb]++; exitB[ca] = b; exitB[cb] = b;
      }
      for (let i = 0; i < P.K; i++) {
        if (comp[i] !== i || size[i] === P.K) continue;
        if (!exits[i]) return (S.why = { t: needs[i] ? 'stuck' : 'closed', i });
        if (level >= 2 && exits[i] === 1 && lo[exitB[i]] === 0) { lo[exitB[i]] = 1; changed = true; S.nset++; S.p2++; }
      }
      if (changed) continue;
      if (level >= 2) {
        for (let b = 0; b < P.NB && !changed; b++) {
          if (hi[b] <= lo[b]) continue;
          const a1 = P.B[b].a, a2 = P.B[b].b;
          for (let x = hi[b]; x > lo[b]; x--) {
            const ca = comp[a1], cb = comp[a2];
            const tot = ca === cb ? size[ca] : size[ca] + size[cb];
            if (tot >= P.K) break;
            const left = (ca === cb ? needs[ca] : needs[ca] + needs[cb]) - 2 * (x - lo[b]);
            if (left !== 0) break;
            hi[b] = x - 1; changed = true; S.nset++; S.p2++;
          }
        }
        if (changed) continue;
      }
      return null;
    }
    return null;
  }
  L.hsProp = hsProp;

  function hsDone(P, S) { for (let b = 0; b < P.NB; b++) if (S.lo[b] !== S.hi[b]) return false; return true; }
  L.hsValid = function (P, cnt) {
    for (let i = 0; i < P.K; i++) { let s = 0; for (const b of P.islB[i]) s += cnt[b]; if (s !== P.isl[i].k) return false; }
    for (let b = 0; b < P.NB; b++) if (cnt[b]) for (const x of P.cross[b]) if (cnt[x]) return false;
    const seen = new Uint8Array(P.K), st = [0];
    seen[0] = 1;
    let got = 1;
    while (st.length) { const i = st.pop(); for (const b of P.islB[i]) if (cnt[b]) { const j = P.B[b].a === i ? P.B[b].b : P.B[b].a; if (!seen[j]) { seen[j] = 1; got++; st.push(j); } } }
    return got === P.K;
  };

  L.hsSolve = function (P, level, S0) {
    const S = S0 ? hsClone(S0) : hsState(P);
    let c = hsProp(P, S, Math.min(level, 2));
    let l3 = 0;
    for (let guard = 0; !c && guard < 2000 && !hsDone(P, S) && level >= 3; guard++) {
      const tr = hsTrial(P, S, false);
      if (!tr) break;
      l3++;
      if (tr.side === 'lo') S.lo[tr.b] = tr.x + 1; else S.hi[tr.b] = tr.x - 1;
      c = hsProp(P, S, 2);
    }
    const done = !c && hsDone(P, S) && L.hsValid(P, S.lo);
    return { ok: !c, done, S, l2: S.p2, l3 };
  };
  // one supposition that fails: bridge b cannot take the value x (its lowest or highest)
  function hsTrial(P, S, best) {
    let found = null;
    for (let b = 0; b < P.NB; b++) {
      if (S.lo[b] === S.hi[b]) continue;
      for (const side of ['lo', 'hi']) {
        const x = side === 'lo' ? S.lo[b] : S.hi[b];
        const T = hsClone(S);
        T.lo[b] = T.hi[b] = x;
        const c = hsProp(P, T, 2);
        if (c) {
          const r = { b, x, side, why: c, T, len: T.nset };
          if (!best) return r;
          if (!found || r.len < found.len) found = r;
        }
      }
    }
    return found;
  }

  L.hsCount = function (P, limit, nodeLimit) {
    limit = limit || 2;
    nodeLimit = nodeLimit || 100000;
    let count = 0, sol = null, nodes = 0, aborted = false;
    const rec = (S) => {
      if (count >= limit || aborted) return;
      if (++nodes > nodeLimit) { aborted = true; return; }
      if (hsProp(P, S, 1)) return;
      let pick = -1, bestW = 99;
      for (let b = 0; b < P.NB; b++) {
        if (S.lo[b] === S.hi[b]) continue;
        const wgt = S.hi[b] - S.lo[b] + Math.min(P.islB[P.B[b].a].length, P.islB[P.B[b].b].length);
        if (wgt < bestW) { bestW = wgt; pick = b; }
      }
      if (pick < 0) { if (L.hsValid(P, S.lo)) { count++; if (!sol) sol = S.lo.slice(); } return; }
      for (let x = S.hi[pick]; x >= S.lo[pick]; x--) {
        const T = hsClone(S);
        T.lo[pick] = T.hi[pick] = x;
        rec(T);
        if (count >= limit || aborted) return;
      }
    };
    rec(hsState(P));
    return { count, sol, nodes, aborted };
  };

  L.hsGrade = function (P) {
    const r = L.hsSolve(P, 3);
    return { done: r.done, top: r.l3 ? 3 : r.l2 ? 2 : 1, l2: r.l2, l3: r.l3 };
  };
  L.hsDiff = function (w, h, K, g) {
    const size = K <= 10 ? 0 : K <= 16 ? 0.4 : K <= 24 ? 0.9 : K <= 34 ? 1.4 : 1.9;
    const lv = g.l3 ? 1.4 + Math.min(1, g.l3 * 0.2) : g.l2 ? 0.5 + Math.min(0.6, g.l2 * 0.08) : 0;
    return clamp(Math.round(1 + size + lv), 1, 5);
  };

  /* hints: the player's bridges (cnt) and "no bridge" marks (no) as a state:
   * what is drawn is a lower bound; the obvious upper bounds follow from the
   * numbers and the crossings. */
  function hsFromMarks(P, cnt, no) {
    const S = hsState(P);
    for (let b = 0; b < P.NB; b++) { S.lo[b] = Math.min(2, cnt[b] || 0); if (no && no[b]) S.hi[b] = 0; if (S.hi[b] < S.lo[b]) S.hi[b] = S.lo[b]; }
    // upper bounds only
    for (let guard = 0; guard < 100; guard++) {
      let changed = false;
      for (let i = 0; i < P.K; i++) {
        let sl = 0;
        for (const b of P.islB[i]) sl += S.lo[b];
        for (const b of P.islB[i]) { const nh = Math.max(S.lo[b], Math.min(S.hi[b], P.isl[i].k - (sl - S.lo[b]))); if (nh !== S.hi[b]) { S.hi[b] = nh; changed = true; } }
      }
      for (let b = 0; b < P.NB; b++) if (S.lo[b] >= 1) for (const x of P.cross[b]) if (S.hi[x] && !S.lo[x]) { S.hi[x] = 0; changed = true; }
      if (!changed) break;
    }
    return S;
  }
  L.hsFromMarks = hsFromMarks;

  function hsWhy(P, why) {
    if (!why) return { text: 'the rules would break', focus: {} };
    if (why.t === 'island') return { text: islAt(P, why.i) + (why.over ? ' would get too many bridges' : ' could not get enough bridges'), focus: { isl: [why.i] } };
    if (why.t === 'cross') return { text: 'two bridges would have to cross', focus: { bridges: [why.b, why.x] } };
    if (why.t === 'closed') return { text: 'a group of islands would be finished and cut off from the rest', focus: { group: why.i } };
    return { text: 'a group of islands would be left with no way to reach the others', focus: { group: why.i } };
  }
  const bridgeWords = (n) => (n === 2 ? 'a double bridge' : n === 1 ? 'a bridge' : 'no bridge');

  /* The next step from the player's bridges. Returns { level, lo: [[b, n]…]
   * (bridges to draw), no: [b…] (lanes to mark empty), text, focus: { isl, bridges, group } } or null. */
  L.hsStep = function (P, cnt, no, maxLevel, sol) {
    maxLevel = maxLevel || 4;
    const S = hsFromMarks(P, cnt, no);
    const notes = [];
    for (let round = 0; round < 12; round++) {
      // level 1: an island that can only be finished one way, or needs some bridges to one neighbour
      let best = null;
      for (let i = 0; i < P.K; i++) {
        let sl = 0, sh = 0;
        for (const b of P.islB[i]) { sl += S.lo[b]; sh += S.hi[b]; }
        const k = P.isl[i].k, need = k - sl;
        if (!need) continue;
        const raise = [];
        for (const b of P.islB[i]) { const ml = k - (sh - S.hi[b]); if (ml > S.lo[b]) raise.push([b, ml]); }
        if (!raise.length) continue;
        const all = sh === k;
        const score = (all ? 0 : 10) + P.islB[i].length;
        if (!best || score < best.score) best = { i, raise, all, need, sh, sl, score };
      }
      if (best) {
        const i = best.i, where = islAt(P, i), open = P.islB[i].filter((b) => S.hi[b] > 0);
        let text;
        const Where = where.charAt(0).toUpperCase() + where.slice(1);
        const needs = (best.sl ? ' still needs ' : ' needs ') + word(best.need) + (best.sl ? ' more' : '') + (best.need === 1 ? ' bridge' : ' bridges');
        if (best.all && open.length === 1) {
          const b = open[0], other = P.B[b].a === i ? P.B[b].b : P.B[b].a;
          text = Where + needs + ', and the only neighbour it can still reach is ' + islAt(P, other) + ': ' + bridgeWords(S.hi[b]) + ' there.';
        } else if (best.all) {
          text = Where + needs + ', and its ' + word(open.length) + ' reachable neighbours can take exactly that many between them: build every bridge they can take.';
        } else {
          const [b, ml] = best.raise[0];
          const other = P.B[b].a === i ? P.B[b].b : P.B[b].a;
          const rest = best.sh - S.hi[b];
          text = where.charAt(0).toUpperCase() + where.slice(1) + (best.sl ? ' still needs ' : ' needs ') + plural(best.need, 'bridge') + '. ' + (best.raise.length > 1
            ? 'Leave out any one neighbour and the others could not supply enough, so it needs at least ' + (best.raise.every(([, x]) => x === 1) ? 'one bridge to each of them.' : 'the highlighted bridges.')
            : 'Its other neighbours can take at most ' + rest + ', so at least ' + word(ml) + ' must go to ' + islAt(P, other) + '.');
        }
        return { level: Math.max(1, notes.length ? notes[notes.length - 1].level : 1), lo: best.raise, no: [], focus: { isl: [i], bridges: best.raise.map((x) => x[0]) }, text: notes.length ? notes.map((n) => n.text).join(' ') + ' With that, ' + text.charAt(0).toLowerCase() + text.slice(1) : text };
      }
      if (maxLevel < 2) return null;
      // level 2: groups
      const comp = hsComps(P, S);
      const size = new Int32Array(P.K), needs = new Int32Array(P.K), exits = new Int32Array(P.K), exitB = new Int32Array(P.K).fill(-1);
      for (let i = 0; i < P.K; i++) { size[comp[i]]++; needs[comp[i]] += needOf(P, S, i); }
      for (let b = 0; b < P.NB; b++) {
        const ca = comp[P.B[b].a], cb = comp[P.B[b].b];
        if (ca === cb || S.hi[b] < 1) continue;
        exits[ca]++; exits[cb]++; exitB[ca] = b; exitB[cb] = b;
      }
      let g2 = null;
      for (let i = 0; i < P.K && !g2; i++) {
        if (comp[i] !== i || size[i] === P.K || size[i] < 2 || exits[i] !== 1 || S.lo[exitB[i]]) continue;
        const b = exitB[i], members = [];
        for (let j = 0; j < P.K; j++) if (comp[j] === i) members.push(j);
        g2 = { level: 2, lo: [[b, 1]], no: [], focus: { isl: members, bridges: [b] }, text: 'The highlighted group of islands must join the rest, and it has only one way out left: build the bridge from ' + islAt(P, P.B[b].a) + ' to ' + islAt(P, P.B[b].b) + '.' };
      }
      if (!g2) {
        for (let b = 0; b < P.NB && !g2; b++) {
          if (S.hi[b] <= S.lo[b]) continue;
          const a1 = P.B[b].a, a2 = P.B[b].b, ca = comp[a1], cb = comp[a2], x = S.hi[b];
          const tot = ca === cb ? size[ca] : size[ca] + size[cb];
          if (tot >= P.K) continue;
          const left = (ca === cb ? needs[ca] : needs[ca] + needs[cb]) - 2 * (x - S.lo[b]);
          if (left !== 0) continue;
          const pair = size[ca] === 1 && size[cb] === 1;
          const what = x === 2 ? 'A double bridge' : S.lo[b] ? 'Another bridge' : 'A bridge';
          const text = what + ' between ' + islAt(P, a1) + ' and ' + islAt(P, a2) + ' would finish ' + (pair ? 'both islands' : 'their whole group') + ' and cut ' + (pair ? 'them' : 'it') + ' off from the other islands. So ' + (x - 1 ? 'at most a single bridge goes there.' : S.lo[b] ? 'that bridge stays single.' : 'no bridge goes there.');
          g2 = { level: 2, b, newHi: x - 1, focus: { isl: [a1, a2], bridges: [b] }, text };
        }
      }
      let fact = g2;
      if (!fact && maxLevel >= 3) {
        const tr = hsTrial(P, S, true);
        if (tr) {
          const b = tr.b, a1 = P.B[b].a, a2 = P.B[b].b;
          const wy = hsWhy(P, tr.why);
          const supp = tr.x === 0 ? 'no bridge joined' : tr.x === 2 ? 'a double bridge joined' : 'just one bridge joined';
          const concl = tr.side === 'lo' ? (tr.x === 0 ? 'there is at least one bridge there' : 'it must be a double bridge') : (tr.x === 2 ? 'at most a single bridge goes there' : 'no bridge goes there');
          fact = { level: 3, b, newHi: tr.side === 'hi' ? tr.x - 1 : null, newLo: tr.side === 'lo' ? tr.x + 1 : null, focus: Object.assign({ bridges: [b] }, wy.focus, { isl: [a1, a2].concat(wy.focus.isl || []) }), text: 'Suppose ' + supp + ' ' + islAt(P, a1) + ' and ' + islAt(P, a2) + '. Follow the rules and ' + wy.text + '. So ' + concl + '.' };
        }
      }
      if (!fact) break;
      if (fact.lo) return fact;
      // a fact that changes what can be drawn: visible if a lane closes or a bridge appears
      const b = fact.b;
      if (fact.newLo != null) {
        return { level: fact.level, lo: [[b, fact.newLo]], no: [], focus: fact.focus, text: notes.map((n) => n.text).join(' ') + (notes.length ? ' ' : '') + fact.text };
      }
      if (fact.newHi === 0) return { level: fact.level, lo: [], no: [b], focus: fact.focus, text: notes.map((n) => n.text).join(' ') + (notes.length ? ' ' : '') + fact.text };
      // invisible (at most one): remember it, and look for what follows
      S.hi[b] = fact.newHi;
      notes.push(fact);
      // spread the new upper bound
      const T = hsFromMarks(P, S.lo, null);
      for (let x = 0; x < P.NB; x++) S.hi[x] = Math.min(S.hi[x], T.hi[x]);
    }
    if (maxLevel < 4 || !sol) return null;
    for (let b = 0; b < P.NB; b++) {
      if ((cnt[b] || 0) < sol[b]) return { level: 4, lo: [[b, sol[b]]], no: [], focus: { bridges: [b] }, text: 'This one needs a long chain of reasoning. ' + bridgeWords(sol[b]).charAt(0).toUpperCase() + bridgeWords(sol[b]).slice(1) + ' joins ' + islAt(P, P.B[b].a) + ' and ' + islAt(P, P.B[b].b) + ' — can you see why?' };
    }
    return null;
  };

  /* A Bridges puzzle: islands dropped one by one, each joined to an earlier
   * one by a random bridge (sometimes to a second one too), the numbers read
   * off; kept if logic of `level` finishes it. */
  L.hsMake = function (w, h, rng, level, opts) {
    opts = opts || {};
    const N = w * h, want = opts.islands || Math.round(N * (0.2 + rng() * 0.06));
    const isl = new Int32Array(N).fill(-1), used = new Int8Array(N);   // used: 1 horizontal bridge passes, 2 vertical
    const list = [], bridges = [];
    const start = rng.int(N);
    isl[start] = 0; list.push(start);
    const free = (x) => isl[x] < 0 && !used[x];
    const nearIsland = (x) => { const r = Math.floor(x / w), c = x % w; for (let d = 0; d < 4; d++) { const rr = r + DR[d], cc = c + DC[d]; if (rr >= 0 && cc >= 0 && rr < h && cc < w && isl[rr * w + cc] >= 0) return true; } return false; };
    for (let guard = 0; guard < N * 40 && list.length < want; guard++) {
      const from = list[rng.int(list.length)], d = rng.int(4);
      const r0 = Math.floor(from / w), c0 = from % w;
      const maxLen = Math.max(2, Math.min(opts.maxLen || 6, d % 2 ? w : h));
      const len = 2 + rng.int(maxLen - 1);
      const r1 = r0 + DR[d] * len, c1 = c0 + DC[d] * len;
      if (r1 < 0 || c1 < 0 || r1 >= h || c1 >= w) continue;
      const to = r1 * w + c1;
      if (!free(to) || nearIsland(to)) continue;
      let ok = true;
      const path = [];
      for (let t = 1; t < len; t++) { const x = (r0 + DR[d] * t) * w + c0 + DC[d] * t; if (!free(x)) { ok = false; break; } path.push(x); }
      if (!ok) continue;
      // the new island must not sit on the line of sight between two islands in a way that splits an existing bridge (it is free, so no bridge passes it)
      isl[to] = list.length; list.push(to);
      path.forEach((x) => { used[x] = d % 2 ? 1 : 2; });
      bridges.push([from, to, rng() < (opts.doubles || 0.35) ? 2 : 1]);
    }
    if (list.length < Math.max(4, want * 0.7)) return null;
    // extra bridges between islands that see each other with a clear lane (loops in the network)
    const P0 = L.hsPrep(w, h, toRows(isl, w, (x) => (x >= 0 ? '1' : '.')));
    const have = new Map();
    const key = (x, y) => (x < y ? x + ',' + y : y + ',' + x);
    bridges.forEach(([a, b, n]) => have.set(key(a, b), n));
    const cnt = new Int8Array(P0.NB);
    P0.B.forEach((B, id) => { const n = have.get(key(P0.isl[B.a].i, P0.isl[B.b].i)); if (n) cnt[id] = n; });
    // a laid bridge must be one of the possible bridges (an island dropped later may sit between two old ones: then that bridge is gone)
    let laid = 0;
    for (const n of have.values()) if (n) laid++;
    let found = 0;
    for (let id = 0; id < P0.NB; id++) if (cnt[id]) found++;
    if (found !== laid) return null;
    for (const id of rng.shuffle(Array.from({ length: P0.NB }, (_, i) => i))) {
      if (cnt[id] || rng() > (opts.extra || 0.3)) continue;
      if (P0.cross[id].some((x) => cnt[x])) continue;
      cnt[id] = rng() < 0.3 ? 2 : 1;
    }
    const k = new Int32Array(P0.K);
    P0.B.forEach((B, id) => { k[B.a] += cnt[id]; k[B.b] += cnt[id]; });
    if (k.some((x) => x < 1 || x > 8)) return null;
    const grid = toRows(isl, w, (x, i) => (x >= 0 ? String(k[P0.cellIsl[i]]) : '.'));
    const P = L.hsPrep(w, h, grid);
    if (!L.hsValid(P, cnt)) return null;
    const r = L.hsSolve(P, level);
    if (!r.done) return null;
    for (let b = 0; b < P.NB; b++) if (r.S.lo[b] !== cnt[b]) return null;
    const g = L.hsGrade(P);
    return { w, h, grid, sol: P.B.map((B, id) => [B.a, B.b, cnt[id]]).filter((x) => x[2]), grade: g, diff: L.hsDiff(w, h, P.K, g), P };
  };

  /* =====================================================================
   *  NURIKABE
   *  grid rows: '.' blank, '1'-'9' and 'a'-'z' (10-35) numbers. Cell values:
   *  -1 unknown, 0 land (island), 1 sea (shaded).
   * ===================================================================== */

  const numOf = (ch) => (ch >= '1' && ch <= '9' ? +ch : ch >= 'a' && ch <= 'z' ? ch.charCodeAt(0) - 87 : 0);
  const numCh = (n) => (n <= 9 ? String(n) : String.fromCharCode(87 + n));
  L.nkNumCh = numCh;
  L.nkPrep = function (w, h, grid) {
    const N = w * h, num = new Int16Array(N), nums = [];
    let totalWhite = 0;
    for (let i = 0; i < N; i++) {
      const n = numOf(grid[Math.floor(i / w)][i % w]);
      if (n) { num[i] = n; nums.push(i); totalWhite += n; }
    }
    const nb = new Int32Array(N * 4).fill(-1);
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / w), c = i % w;
      for (let d = 0; d < 4; d++) { const rr = r + DR[d], cc = c + DC[d]; if (rr >= 0 && cc >= 0 && rr < h && cc < w) nb[i * 4 + d] = rr * w + cc; }
    }
    return { kind: 'nurikabe', w, h, N, num, nums, totalWhite, totalBlack: N - totalWhite, nb };
  };
  const numAt = (P, i) => 'the **' + P.num[i] + '** at ' + cellName(i, P.w);
  L.numAt = numAt;

  function nkState(P) {
    const v = new Int8Array(P.N).fill(-1);
    for (const i of P.nums) v[i] = 0;
    return { v, why: null, nset: 0, p2: 0 };
  }
  const nkClone = (S) => ({ v: S.v.slice(), why: null, nset: 0, p2: 0 });

  // connected groups of one colour: id per cell (-1 elsewhere) and a list of groups
  function groups(P, v, col) {
    const id = new Int32Array(P.N).fill(-1), list = [];
    for (let s = 0; s < P.N; s++) {
      if (v[s] !== col || id[s] >= 0) continue;
      const g = { cells: [s], num: 0, numCell: -1, nums: 0, adj: [] };
      id[s] = list.length;
      for (let k = 0; k < g.cells.length; k++) {
        const i = g.cells[k];
        if (col === 0 && P.num[i]) { g.nums++; g.num = P.num[i]; g.numCell = i; }
        for (let d = 0; d < 4; d++) { const j = P.nb[i * 4 + d]; if (j >= 0 && v[j] === col && id[j] < 0) { id[j] = list.length; g.cells.push(j); } }
      }
      const seen = new Set();
      for (const i of g.cells) for (let d = 0; d < 4; d++) { const j = P.nb[i * 4 + d]; if (j >= 0 && v[j] === -1 && !seen.has(j)) { seen.add(j); g.adj.push(j); } }
      list.push(g);
    }
    return { id, list };
  }

  // how far each unfinished numbered island could still reach (cells it could take)
  function nkReach(P, v, W) {
    const reach = new Uint8Array(P.N), N = P.N;
    const dist = new Int32Array(N);
    for (let g = 0; g < W.list.length; g++) {
      const G = W.list[g];
      if (G.nums !== 1 || G.cells.length >= G.num) continue;
      const budget = G.num - G.cells.length;
      dist.fill(-1);
      const q = [];
      for (const i of G.cells) { dist[i] = 0; q.push(i); }
      for (let k = 0; k < q.length; k++) {
        const i = q[k];
        if (dist[i] >= budget) continue;
        for (let d = 0; d < 4; d++) {
          const j = P.nb[i * 4 + d];
          if (j < 0 || dist[j] >= 0 || v[j] === 1) continue;
          if (v[j] === 0 && W.list[W.id[j]].nums) continue;
          // j may not touch another numbered island
          let bad = false;
          for (let e = 0; e < 4; e++) { const x = P.nb[j * 4 + e]; if (x >= 0 && v[x] === 0 && W.id[x] !== g && W.list[W.id[x]].nums) { bad = true; break; } }
          if (bad) continue;
          dist[j] = dist[i] + 1;
          reach[j] = 1;
          q.push(j);
        }
      }
    }
    return reach;
  }

  /* Every way to finish the island G (need more cells), as lists of cells; null
   * if there are more than cap. A way is kept only if no land touches it from outside. */
  function nkWays(P, v, W, g, cap) {
    const G = W.list[g], need = G.num - G.cells.length, N = P.N;
    const inA = new Uint8Array(N), blocked = new Uint8Array(N);
    for (const i of G.cells) inA[i] = 1;
    const ok = (j) => {
      if (v[j] === 1 || inA[j]) return false;
      if (v[j] === 0 && W.list[W.id[j]].nums) return false;
      for (let e = 0; e < 4; e++) { const x = P.nb[j * 4 + e]; if (x >= 0 && v[x] === 0 && W.id[x] !== g && W.list[W.id[x]].nums) return false; }
      return true;
    };
    const out = [];
    let over = false;
    const X = [];
    const inX = new Uint8Array(N);
    const valid = () => {
      // the finished island may not touch other land
      for (const i of G.cells.concat(X)) for (let d = 0; d < 4; d++) { const j = P.nb[i * 4 + d]; if (j >= 0 && v[j] === 0 && !inA[j] && !inX[j]) return false; }
      return true;
    };
    const rec = (cand) => {
      if (over) return;
      if (X.length === need) { if (valid()) { out.push(X.slice()); if (out.length > cap) over = true; } return; }
      const mark = [];
      for (let k = 0; k < cand.length; k++) {
        const c = cand[k];
        const next = cand.slice(k + 1);
        const added = [];
        for (let d = 0; d < 4; d++) {
          const j = P.nb[c * 4 + d];
          if (j < 0 || blocked[j] || inX[j] || !ok(j) || next.includes(j)) continue;
          next.push(j); added.push(j);
        }
        X.push(c); inX[c] = 1;
        rec(next);
        X.pop(); inX[c] = 0;
        blocked[c] = 1; mark.push(c);
        if (over) break;
      }
      mark.forEach((c) => { blocked[c] = 0; });
    };
    const start = [];
    for (const i of G.cells) for (let d = 0; d < 4; d++) { const j = P.nb[i * 4 + d]; if (j >= 0 && ok(j) && !start.includes(j)) start.push(j); }
    rec(start);
    return over ? null : out;
  }

  function nkSet(S, i, x) {
    if (S.v[i] === x) return true;
    if (S.v[i] !== -1) { S.why = { t: 'conflict', i }; return false; }
    S.v[i] = x; S.nset++;
    return true;
  }

  /* The rules until nothing changes. Level 1: finished islands, cells between
   * islands, one way out, pools, the sea's connection, counts, reach. Level 2:
   * every way to finish an island, and pools only one island can break up. */
  function nkProp(P, S, level) {
    const v = S.v, N = P.N, w = P.w, h = P.h;
    for (let guard = 0; guard < 4 * N + 20; guard++) {
      let changed = false;
      const W = groups(P, v, 0);
      for (const G of W.list) {
        if (G.nums >= 2) return (S.why = { t: 'twonums', cells: G.cells });
        if (G.nums === 1 && G.cells.length > G.num) return (S.why = { t: 'big', n: G.numCell });
        if (G.nums === 1 && G.cells.length === G.num) { for (const j of G.adj) { if (!nkSet(S, j, 1)) return S.why; changed = true; } continue; }
        if (!G.adj.length) return (S.why = G.nums ? { t: 'small', n: G.numCell } : { t: 'orphan', cells: G.cells });
        if (G.adj.length === 1) { if (!nkSet(S, G.adj[0], 0)) return S.why; changed = true; }
      }
      if (changed) continue;
      for (let i = 0; i < N; i++) {
        if (v[i] !== -1) continue;
        let nums = 0, size = 1, num = 0;
        const seen = [];
        for (let d = 0; d < 4; d++) {
          const j = P.nb[i * 4 + d];
          if (j < 0 || v[j] !== 0) continue;
          const g = W.id[j];
          if (seen.includes(g)) continue;
          seen.push(g);
          const G = W.list[g];
          nums += G.nums; size += G.cells.length; if (G.nums) num = G.num;
        }
        if (nums >= 2 || (nums === 1 && size > num)) { v[i] = 1; S.nset++; changed = true; }
      }
      if (changed) continue;
      for (let r = 0; r + 1 < h; r++) for (let c = 0; c + 1 < w; c++) {
        const q = [r * w + c, r * w + c + 1, (r + 1) * w + c, (r + 1) * w + c + 1];
        let b = 0, u = -1, nu = 0;
        for (const i of q) { if (v[i] === 1) b++; else if (v[i] === -1) { nu++; u = i; } }
        if (b === 4) return (S.why = { t: 'pool', cells: q });
        if (b === 3 && nu === 1) { v[u] = 0; S.nset++; changed = true; }
      }
      if (changed) continue;
      let blacks = 0, whites = 0;
      for (let i = 0; i < N; i++) { if (v[i] === 1) blacks++; else if (v[i] === 0) whites++; }
      if (whites > P.totalWhite) return (S.why = { t: 'toomuchland' });
      if (blacks > P.totalBlack) return (S.why = { t: 'toomuchsea' });
      const Bk = groups(P, v, 1);
      for (const G of Bk.list) {
        if (G.cells.length >= P.totalBlack) continue;
        if (!G.adj.length) return (S.why = { t: 'seacut', cells: G.cells });
        if (G.adj.length === 1) { if (!nkSet(S, G.adj[0], 1)) return S.why; changed = true; }
      }
      if (changed) continue;
      if (whites === P.totalWhite || blacks === P.totalBlack) {
        const x = whites === P.totalWhite ? 1 : 0;
        for (let i = 0; i < N; i++) if (v[i] === -1) { v[i] = x; S.nset++; changed = true; }
        if (changed) continue;
      }
      const reach = nkReach(P, v, W);
      for (let i = 0; i < N; i++) {
        if (reach[i]) continue;
        if (v[i] === -1) { v[i] = 1; S.nset++; changed = true; }
        else if (v[i] === 0 && !W.list[W.id[i]].nums) return (S.why = { t: 'orphan', cells: W.list[W.id[i]].cells });
      }
      if (changed) continue;
      if (level < 2) return null;
      const r2 = nkLevel2(P, S, W, reach, false);
      if (r2 && r2.contra) return (S.why = r2.contra);
      if (r2 && r2.set.length) {
        for (const [i, x] of r2.set) if (!nkSet(S, i, x)) return S.why;
        S.p2++;
        continue;
      }
      return null;
    }
    return null;
  }
  L.nkProp = nkProp;

  // level 2 deductions: { set, t, g?, cells? } (one == true: the first only), or { contra }
  L.nkCap = 400;             // the most ways to finish one island that level 2 will weigh
  function nkLevel2(P, S, W, reach, one) {
    const v = S.v, N = P.N, w = P.w, h = P.h;
    const canLand = new Uint8Array(N);
    let allKnown = true;
    for (let g = 0; g < W.list.length; g++) {
      const G = W.list[g];
      if (G.nums !== 1 || G.cells.length >= G.num) continue;
      const ways = nkWays(P, v, W, g, L.nkCap);
      if (!ways) { allKnown = false; continue; }
      if (!ways.length) return { contra: { t: 'nogrow', n: G.numCell } };
      const cnt = new Int32Array(N), bord = new Int32Array(N);
      const inG = new Uint8Array(N);
      for (const i of G.cells) inG[i] = 1;
      for (const way of ways) {
        const mark = new Uint8Array(N);
        for (const i of way) { cnt[i]++; canLand[i] = 1; mark[i] = 1; }
        const bm = new Uint8Array(N);
        for (const i of G.cells.concat(way)) for (let d = 0; d < 4; d++) { const j = P.nb[i * 4 + d]; if (j >= 0 && v[j] === -1 && !mark[j] && !bm[j]) { bm[j] = 1; bord[j]++; } }
      }
      const set = [];
      for (let i = 0; i < N; i++) {
        if (v[i] !== -1) continue;
        if (cnt[i] === ways.length) set.push([i, 0]);
        else if (bord[i] === ways.length) set.push([i, 1]);
      }
      if (set.length) { const res = { set, t: 'ways', g, n: G.numCell, count: ways.length }; if (one) return res; return res; }
    }
    // cells no island could take
    if (allKnown) {
      const set = [];
      for (let i = 0; i < N; i++) if (v[i] === -1 && !canLand[i]) set.push([i, 1]);
      if (set.length) return { set, t: 'noway' };
    }
    // a 2×2 block that only one island can break up
    const can = allKnown ? canLand : reach;
    for (let r = 0; r + 1 < h; r++) for (let c = 0; c + 1 < w; c++) {
      const q = [r * w + c, r * w + c + 1, (r + 1) * w + c, (r + 1) * w + c + 1];
      if (q.some((i) => v[i] === 0)) continue;
      const opts = q.filter((i) => v[i] === -1 && can[i]);
      if (!opts.length && q.some((i) => v[i] === -1)) return { contra: { t: 'pool', cells: q } };
      if (opts.length === 1) return { set: [[opts[0], 0]], t: 'pool2', cells: q };
    }
    return null;
  }

  L.nkValid = function (P, v) {
    for (let i = 0; i < P.N; i++) if (v[i] !== 0 && v[i] !== 1) return false;
    for (const i of P.nums) if (v[i] !== 0) return false;
    const W = groups(P, v, 0);
    for (const G of W.list) if (G.nums !== 1 || G.cells.length !== G.num) return false;
    const Bk = groups(P, v, 1);
    if (Bk.list.length > 1) return false;
    for (let r = 0; r + 1 < P.h; r++) for (let c = 0; c + 1 < P.w; c++) {
      const i = r * P.w + c;
      if (v[i] === 1 && v[i + 1] === 1 && v[i + P.w] === 1 && v[i + P.w + 1] === 1) return false;
    }
    return true;
  };
  const nkOpen = (S) => { let k = 0; for (let i = 0; i < S.v.length; i++) if (S.v[i] < 0) k++; return k; };

  function nkTrial(P, S, best, deadline) {
    let found = null;
    // cells beside land first
    const order = [];
    for (let i = 0; i < P.N; i++) if (S.v[i] === -1) order.push(i);
    const near = (i) => { for (let d = 0; d < 4; d++) { const j = P.nb[i * 4 + d]; if (j >= 0 && S.v[j] >= 0) return 0; } return 1; };
    order.sort((a, b) => near(a) - near(b));
    for (const i of order) {
      if (deadline && now() > deadline) return found;
      for (const x of [0, 1]) {
        const T = nkClone(S);
        T.v[i] = x;
        const c = nkProp(P, T, 2);
        if (c) {
          const r = { i, x: 1 - x, why: c, T, len: T.nset };
          if (!best) return r;
          if (!found || r.len < found.len) found = r;
          break;
        }
      }
      if (found && best && found.len <= 2) break;
    }
    return found;
  }

  // (deadline: give up on suppositions after this time — only for the maker)
  L.nkSolve = function (P, level, v0, deadline) {
    const S = nkState(P);
    if (v0) for (let i = 0; i < P.N; i++) if (v0[i] >= 0) S.v[i] = v0[i];
    let c = nkProp(P, S, Math.min(level, 2));
    let l3 = 0;
    for (let guard = 0; !c && guard < 1000 && nkOpen(S) && level >= 3; guard++) {
      if (deadline && now() > deadline) break;
      const tr = nkTrial(P, S, false, deadline);
      if (!tr) break;
      l3++;
      S.v[tr.i] = tr.x;
      c = nkProp(P, S, 2);
    }
    return { ok: !c, done: !c && !nkOpen(S) && L.nkValid(P, S.v), v: S.v, l2: S.p2, l3 };
  };
  L.nkCount = function (P, limit, nodeLimit) {
    limit = limit || 2;
    nodeLimit = nodeLimit || 50000;
    let count = 0, sol = null, nodes = 0, aborted = false;
    const rec = (S) => {
      if (count >= limit || aborted) return;
      if (++nodes > nodeLimit) { aborted = true; return; }
      if (nkProp(P, S, 1)) return;
      let pick = -1, best = 99;
      for (let i = 0; i < P.N; i++) {
        if (S.v[i] !== -1) continue;
        let k = 0;
        for (let d = 0; d < 4; d++) { const j = P.nb[i * 4 + d]; if (j >= 0 && S.v[j] === 0) k++; }
        const score = 4 - k;
        if (score < best) { best = score; pick = i; }
      }
      if (pick < 0) { if (L.nkValid(P, S.v)) { count++; if (!sol) sol = S.v.slice(); } return; }
      for (const x of [0, 1]) {
        const T = nkClone(S);
        T.v[pick] = x;
        rec(T);
        if (count >= limit || aborted) return;
      }
    };
    rec(nkState(P));
    return { count, sol, nodes, aborted };
  };
  L.nkGrade = function (P) {
    const r = L.nkSolve(P, 3);
    return { done: r.done, top: r.l3 ? 3 : r.l2 ? 2 : 1, l2: r.l2, l3: r.l3 };
  };
  L.nkDiff = function (w, h, g) {
    const a = w * h;
    const size = a <= 30 ? 0 : a <= 49 ? 0.35 : a <= 64 ? 0.7 : a <= 100 ? 1.1 : 1.6;
    const lv = g.l3 ? 1.5 + Math.min(1, g.l3 * 0.2) : g.l2 ? 0.5 + Math.min(0.7, g.l2 * 0.1) : 0;
    return clamp(Math.round(1 + size + lv), 1, 5);
  };

  function nkWhy(P, why) {
    if (!why) return { text: 'the rules would break', focus: {} };
    const t = why.t;
    if (t === 'twonums') return { text: 'two numbers would end up on one island', focus: { cells: why.cells } };
    if (t === 'big') return { text: 'the island of ' + numAt(P, why.n) + ' would be too big', focus: { cells: [why.n] } };
    if (t === 'small' || t === 'nogrow') return { text: 'the island of ' + numAt(P, why.n) + ' would have no room to grow', focus: { cells: [why.n] } };
    if (t === 'orphan') return { text: 'some land could never join a numbered island', focus: { cells: why.cells } };
    if (t === 'pool') return { text: 'a 2×2 pool of sea would appear', focus: { cells: why.cells } };
    if (t === 'seacut') return { text: 'part of the sea would be cut off from the rest', focus: { cells: why.cells } };
    if (t === 'toomuchland') return { text: 'there would be more land than the numbers allow', focus: {} };
    if (t === 'toomuchsea') return { text: 'there would be too little land for the numbers', focus: {} };
    return { text: 'one cell would have to be both land and sea', focus: why.i != null ? { cells: [why.i] } : {} };
  }

  /* The next step from the player's marks (v: -1 unknown, 0 land/dot, 1 sea),
   * all right. Returns { level, set: [[cell, 0|1]…], text, focus: { cells }, ghost, bad } or null. */
  L.nkStep = function (P, v0, maxLevel, sol) {
    maxLevel = maxLevel || 4;
    const S = nkState(P);
    for (let i = 0; i < P.N; i++) if (v0[i] >= 0 && !P.num[i]) S.v[i] = v0[i];
    const v = S.v, w = P.w, h = P.h, N = P.N;
    const W = groups(P, v, 0);
    const Cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    // finished islands
    for (const G of W.list) {
      if (G.nums === 1 && G.cells.length === G.num && G.adj.length) return { level: 1, set: G.adj.map((j) => [j, 1]), focus: { cells: G.cells }, text: 'The island of ' + numAt(P, G.numCell) + (G.num === 1 ? ' is just that one cell' : ' already has all ' + G.num + ' cells') + ': every cell around it is sea.' };
    }
    // three sea cells of a square
    for (let r = 0; r + 1 < h; r++) for (let c = 0; c + 1 < w; c++) {
      const q = [r * w + c, r * w + c + 1, (r + 1) * w + c, (r + 1) * w + c + 1];
      const b = q.filter((i) => v[i] === 1).length, u = q.filter((i) => v[i] === -1);
      if (b === 3 && u.length === 1) return { level: 1, set: [[u[0], 0]], focus: { cells: q }, text: 'Three cells of this 2×2 square are sea already. The sea may not form a 2×2 pool, so the fourth is land.' };
    }
    // one way out
    for (const G of W.list) {
      if (G.adj.length !== 1 || (G.nums === 1 && G.cells.length >= G.num)) continue;
      return { level: 1, set: [[G.adj[0], 0]], focus: { cells: G.cells }, text: G.nums ? 'The island of ' + numAt(P, G.numCell) + ' still needs ' + plural(G.num - G.cells.length, 'cell') + ' and can only grow one way: the highlighted cell is land.' : 'This land has to join a numbered island, and it has only one way out: the highlighted cell is land too.' };
    }
    // between two islands
    for (let i = 0; i < N; i++) {
      if (v[i] !== -1) continue;
      const gs = [];
      for (let d = 0; d < 4; d++) { const j = P.nb[i * 4 + d]; if (j >= 0 && v[j] === 0 && !gs.includes(W.id[j])) gs.push(W.id[j]); }
      const numbered = gs.filter((g) => W.list[g].nums);
      if (numbered.length >= 2) {
        const a = W.list[numbered[0]], b = W.list[numbered[1]];
        return { level: 1, set: [[i, 1]], focus: { cells: [i, a.numCell, b.numCell] }, text: 'The highlighted cell touches the islands of ' + numAt(P, a.numCell) + ' and ' + numAt(P, b.numCell) + '. As land it would join them, so it is sea.' };
      }
      if (numbered.length === 1) {
        let size = 1;
        gs.forEach((g) => { size += W.list[g].cells.length; });
        const G = W.list[numbered[0]];
        if (size > G.num) return { level: 1, set: [[i, 1]], focus: { cells: [i].concat(G.cells) }, text: 'As land, the highlighted cell would make the island of ' + numAt(P, G.numCell) + ' too big (' + size + ' cells). It is sea.' };
      }
    }
    // the sea stays in one piece
    const Bk = groups(P, v, 1);
    for (const G of Bk.list) {
      if (G.cells.length >= P.totalBlack || G.adj.length !== 1) continue;
      return { level: 1, set: [[G.adj[0], 1]], focus: { cells: G.cells }, text: 'All the sea is connected. This stretch of sea has only one way to reach the rest: the highlighted cell is sea too.' };
    }
    let blacks = 0, whites = 0;
    for (let i = 0; i < N; i++) { if (v[i] === 1) blacks++; else if (v[i] === 0) whites++; }
    if (whites === P.totalWhite || blacks === P.totalBlack) {
      const x = whites === P.totalWhite ? 1 : 0, set = [];
      for (let i = 0; i < N; i++) if (v[i] === -1) set.push([i, x]);
      if (set.length) return { level: 1, set, focus: {}, text: x ? 'Every island has all its land already: the rest is sea.' : 'The sea already has every cell the numbers leave for it: the rest is land.' };
    }
    // unreachable
    const reach = nkReach(P, v, W);
    const far = [];
    for (let i = 0; i < N; i++) if (v[i] === -1 && !reach[i]) far.push([i, 1]);
    if (far.length) return { level: 1, set: far, focus: {}, text: 'No island can reach ' + (far.length === 1 ? 'the highlighted cell' : 'the highlighted cells') + ': ' + (far.length === 1 ? 'it is' : 'they are') + ' too far from every number that still has room to grow. Sea.' };
    if (maxLevel < 2) return null;
    const l2 = nkLevel2(P, S, W, reach, true);
    if (l2 && l2.set && l2.set.length) {
      if (l2.t === 'ways') {
        const land = l2.set.filter((x) => x[1] === 0), sea = l2.set.filter((x) => x[1] === 1);
        const G = W.list[l2.g];
        const k = l2.count;
        return { level: 2, set: land.length ? land : sea, focus: { cells: G.cells }, text: 'The island of ' + numAt(P, G.numCell) + ' still needs ' + plural(G.num - G.cells.length, 'cell') + '. ' + (k === 1 ? 'There is only one way to grow it' : 'There are ' + k + ' ways to grow it') + (land.length ? ', and ' + (k === 1 ? 'it uses' : 'every one uses') + ' the highlighted ' + (land.length === 1 ? 'cell: land.' : 'cells: land.') : ', and ' + (k === 1 ? 'it touches' : 'every one touches') + ' the highlighted ' + (sea.length === 1 ? 'cell, which must therefore be sea.' : 'cells, which must therefore be sea.')) };
      }
      if (l2.t === 'noway') return { level: 2, set: l2.set, focus: {}, text: 'Try every way each unfinished island could grow: none of them ever uses ' + (l2.set.length === 1 ? 'the highlighted cell. It is sea.' : 'the highlighted cells. They are sea.') };
      if (l2.t === 'pool2') return { level: 2, set: l2.set, focus: { cells: l2.cells }, text: 'This 2×2 square needs at least one land cell, or it becomes a pool. Only the highlighted cell can still be reached by an island: it is land.' };
    }
    if (maxLevel < 3) return null;
    const tr = nkTrial(P, S, true);
    if (tr) {
      const ghost = [];
      for (let i = 0; i < N; i++) if (tr.T.v[i] !== -1 && v[i] === -1) ghost.push([i, tr.T.v[i]]);
      const wy = nkWhy(P, tr.why);
      return { level: 3, set: [[tr.i, tr.x]], focus: { cells: [tr.i] }, ghost, bad: wy.focus, text: 'Suppose the highlighted cell were ' + (tr.x ? 'land' : 'sea') + '. Follow the rules (the faint marks) and ' + wy.text + '. So it is ' + (tr.x ? 'sea' : 'land') + '.' };
    }
    if (maxLevel < 4 || !sol) return null;
    for (let i = 0; i < N; i++) if (v[i] === -1) return { level: 4, set: [[i, sol[i]]], focus: { cells: [i] }, text: 'This needs a long chain of reasoning. The highlighted cell is ' + (sol[i] ? 'sea' : 'land') + ' — can you see why?' };
    return null;
  };

  /* A Nurikabe: islands grown at random in an all-sea grid (keeping the sea in
   * one piece), pools broken up, a number dropped in every island; kept when
   * logic of `level` finishes it (numbers are moved around a few times first). */
  L.nkMake = function (w, h, rng, level, opts) {
    opts = opts || {};
    const N = w * h, v = new Int8Array(N).fill(1), own = new Int32Array(N).fill(-1);
    const nbs = (i) => { const r = Math.floor(i / w), c = i % w, a = []; for (let d = 0; d < 4; d++) { const rr = r + DR[d], cc = c + DC[d]; if (rr >= 0 && cc >= 0 && rr < h && cc < w) a.push(rr * w + cc); } return a; };
    const seaOk = () => {
      let s = -1, tot = 0;
      for (let i = 0; i < N; i++) if (v[i] === 1) { tot++; if (s < 0) s = i; }
      if (!tot) return false;
      const seen = new Uint8Array(N), st = [s];
      seen[s] = 1;
      let got = 1;
      while (st.length) { const i = st.pop(); for (const j of nbs(i)) if (v[j] === 1 && !seen[j]) { seen[j] = 1; got++; st.push(j); } }
      return got === tot;
    };
    const islands = [];
    const maxSize = opts.maxSize || 6, landFrac = opts.land || 0.4;
    const makeLayout = () => {
      v.fill(1); own.fill(-1); islands.length = 0;
      let land = 0;
      for (let guard = 0; guard < N * 6 && land < N * landFrac; guard++) {
        const s = rng.int(N);
        if (v[s] !== 1 || nbs(s).some((j) => v[j] === 0)) continue;
        const id = islands.length, cells = [s];
        v[s] = 0; own[s] = id;
        if (!seaOk()) { v[s] = 1; own[s] = -1; continue; }
        const want = 1 + Math.floor(Math.pow(rng(), opts.skew || 1.3) * maxSize);
        for (let g2 = 0; g2 < 30 && cells.length < want; g2++) {
          const from = cells[rng.int(cells.length)], cand = nbs(from).filter((j) => v[j] === 1 && nbs(j).every((x) => v[x] === 1 || own[x] === id));
          if (!cand.length) continue;
          const x = cand[rng.int(cand.length)];
          v[x] = 0; own[x] = id;
          if (!seaOk()) { v[x] = 1; own[x] = -1; continue; }
          cells.push(x);
        }
        islands.push(cells);
        land += cells.length;
      }
      // break up pools: a new one-cell island, or a neighbouring island grows
      for (let pass = 0; pass < 3; pass++) {
        for (let r = 0; r + 1 < h; r++) for (let c = 0; c + 1 < w; c++) {
          const q = [r * w + c, r * w + c + 1, (r + 1) * w + c, (r + 1) * w + c + 1];
          if (q.some((i) => v[i] !== 1)) continue;
          let fixed = false;
          for (const x of rng.shuffle(q.slice())) {
            const owners = new Set(nbs(x).filter((j) => v[j] === 0).map((j) => own[j]));
            if (owners.size > 1) continue;
            v[x] = 0;
            if (!seaOk()) { v[x] = 1; continue; }
            if (owners.size === 1) { const id = owners.values().next().value; own[x] = id; islands[id].push(x); } else { own[x] = islands.length; islands.push([x]); }
            fixed = true;
            break;
          }
          if (!fixed && pass === 2) return false;
        }
      }
      return !islands.some((c) => c.length > 35);
    };
    let laid = false;
    for (let t = 0; t < 12 && !laid; t++) laid = makeLayout();
    if (!laid) return null;
    // a number in every island
    const hasNum = new Uint8Array(N);
    islands.forEach((cells) => { hasNum[cells[rng.int(cells.length)]] = 1; });
    // then reshape (move numbers, grow, shrink, add islands) while logic leaves fewer cells open
    const t0 = now(), budget = opts.budget || 1e9;
    const evalLevel = Math.min(level, 2), genCap = opts.cap || 150;
    const layout = (vv, hn) => {
      // each land group has one number; returns the grid rows or null
      const g = groups({ N, nb: nbArr, num: hn }, vv, 0);
      const grid = new Array(N).fill('.');
      for (const G of g.list) {
        let k = 0, at = -1;
        for (const i of G.cells) if (hn[i]) { k++; at = i; }
        if (k !== 1 || G.cells.length > 35) return null;
        grid[at] = numCh(G.cells.length);
      }
      return toRows(grid, w, (x) => x);
    };
    const nbArr = new Int32Array(N * 4).fill(-1);
    for (let i = 0; i < N; i++) { const a = nbs(i); for (let d = 0; d < a.length; d++) nbArr[i * 4 + d] = a[d]; }
    const poolAt = (vv, i) => {
      const r = Math.floor(i / w), c = i % w;
      for (let dr = -1; dr <= 0; dr++) for (let dc = -1; dc <= 0; dc++) {
        const r0 = r + dr, c0 = c + dc;
        if (r0 < 0 || c0 < 0 || r0 + 1 >= h || c0 + 1 >= w) continue;
        const a = r0 * w + c0;
        if (vv[a] && vv[a + 1] && vv[a + w] && vv[a + w + 1]) return true;
      }
      return false;
    };
    const score = (vv, hn) => {
      const rows = layout(vv, hn);
      if (!rows) return null;
      const P = L.nkPrep(w, h, rows);
      const keep = L.nkCap;
      L.nkCap = genCap;
      let r;
      try { r = L.nkSolve(P, evalLevel); } finally { L.nkCap = keep; }
      if (!r.ok) return null;
      let open = 0;
      const near = [];
      for (let i = 0; i < N; i++) if (r.v[i] < 0) { open++; near.push(i); for (const j of nbs(i)) near.push(j); }
      return { open, rows, P, near };
    };
    let cur = score(v, hasNum);
    if (!cur) return null;
    let vv = v, hn = hasNum, deepOk = false, lastDeep = -1;
    const maxIt = opts.iters || 300 * w;
    for (let it = 0; it < maxIt && cur.open > 0; it++) {
      if (now() - t0 > budget) return null;
      // for the hardest levels: stop as soon as suppositions finish what the patterns leave
      if (level >= 3 && cur.open <= N * 0.4 && lastDeep !== cur.open) {
        lastDeep = cur.open;
        const keep = L.nkCap;
        L.nkCap = genCap;
        let ok = false;
        try { ok = L.nkSolve(cur.P, level, null, t0 + budget).done; } finally { L.nkCap = keep; }
        if (ok) { deepOk = true; break; }
      }
      const v2 = vv.slice(), h2 = hn.slice();
      const op = rng();
      const pool = [];
      const want = op < 0.3 ? 'num' : op < 0.6 ? 'sea' : 'land';
      const src = rng() < 0.75 ? cur.near : null;
      if (src) { for (const i of src) if (want === 'num' ? h2[i] : want === 'sea' ? v2[i] === 1 : v2[i] === 0) pool.push(i); }
      if (!pool.length) for (let i = 0; i < N; i++) if (want === 'num' ? h2[i] : want === 'sea' ? v2[i] === 1 : v2[i] === 0) pool.push(i);
      if (!pool.length) continue;
      const x = pool[rng.int(pool.length)];
      if (op < 0.3) {
        // move a number within its island
        if (!h2[x]) continue;
        const g = groups({ N, nb: nbArr, num: h2 }, v2, 0);
        const G = g.list[g.id[x]], y = G.cells[rng.int(G.cells.length)];
        if (y === x) continue;
        h2[x] = 0; h2[y] = 1;
      } else if (op < 0.6) {
        // grow an island into the sea
        if (v2[x] !== 1) continue;
        const land = nbs(x).filter((j) => v2[j] === 0);
        if (!land.length) { if (rng() < 0.5) { v2[x] = 0; h2[x] = 1; } else continue; }
        else v2[x] = 0;
        if (!seaOkOf(v2)) continue;
      } else {
        // give a land cell back to the sea
        if (v2[x] !== 0) continue;
        v2[x] = 1;
        if (h2[x]) {
          h2[x] = 0;
          const nbLand = nbs(x).filter((j) => v2[j] === 0);
          if (nbLand.length) h2[nbLand[rng.int(nbLand.length)]] = 1;
        }
        if (poolAt(v2, x)) continue;
        if (!seaOkOf(v2)) continue;
      }
      const nx = score(v2, h2);
      if (!nx) continue;
      if (nx.open <= cur.open || rng() < 0.02) { vv = v2; hn = h2; cur = nx; }
    }
    if (cur.open > 0 && !deepOk) return null;
    function seaOkOf(arr) {
      let s = -1, tot = 0;
      for (let i = 0; i < N; i++) if (arr[i] === 1) { tot++; if (s < 0) s = i; }
      if (!tot) return false;
      const seen = new Uint8Array(N), st = [s];
      seen[s] = 1;
      let got = 1;
      while (st.length) { const i = st.pop(); for (const j of nbs(i)) if (arr[j] === 1 && !seen[j]) { seen[j] = 1; got++; st.push(j); } }
      return got === tot;
    }
    const P = cur.P;
    const fin = L.nkSolve(P, level);
    if (!fin.done) return null;
    const g = L.nkGrade(P);
    return { w, h, grid: cur.rows, sol: toRows(fin.v, w, (x) => (x ? '#' : '.')), grade: g, diff: L.nkDiff(w, h, g), P };
  };

  /* =====================================================================
   *  KAKURO (CROSS SUMS)
   *  grid rows: '#' a black cell, '.' a white cell; clues: [[cell, down, across]…]
   *  on black cells (0 = none). Candidates are bit masks, bit d-1 for digit d.
   * ===================================================================== */

  const POP = new Uint8Array(512), SUMM = new Uint8Array(512);
  for (let m = 1; m < 512; m++) { POP[m] = POP[m >> 1] + (m & 1); SUMM[m] = SUMM[m & (m - 1)] + (Math.log2(m & -m) + 1); }
  const COMBOS = [];
  for (let len = 0; len <= 9; len++) { COMBOS.push([]); for (let s = 0; s <= 45; s++) COMBOS[len].push([]); }
  for (let m = 1; m < 512; m++) COMBOS[POP[m]][SUMM[m]].push(m);
  L.kkCombos = (len, sum) => (len >= 1 && len <= 9 && sum >= 0 && sum <= 45 ? COMBOS[len][sum] : []);
  const digitsOf = (m) => { const a = []; for (let d = 1; d <= 9; d++) if (m & (1 << (d - 1))) a.push(d); return a; };
  L.digitsOf = digitsOf;
  const bit = (d) => 1 << (d - 1);
  const single = (m) => (m && !(m & (m - 1)) ? Math.log2(m) + 1 : 0);
  L.kkSingle = single;

  L.kkPrep = function (w, h, grid, clues) {
    const N = w * h, white = new Uint8Array(N);
    for (let i = 0; i < N; i++) white[i] = grid[Math.floor(i / w)][i % w] === '#' ? 0 : 1;
    const runs = [], runOf = new Int32Array(N * 2).fill(-1);
    const clueAt = {};
    (clues || []).forEach(([cell, down, across]) => { clueAt[cell] = [down, across]; });
    for (let i = 0; i < N; i++) {
      if (white[i] || !clueAt[i]) continue;
      const [down, across] = clueAt[i];
      const r = Math.floor(i / w), c = i % w;
      if (across) {
        const cells = [];
        for (let cc = c + 1; cc < w && white[r * w + cc]; cc++) cells.push(r * w + cc);
        const id = runs.length;
        runs.push({ cells, sum: across, dir: 0, clue: i, combos: L.kkCombos(cells.length, across) });
        cells.forEach((x) => { runOf[x * 2] = id; });
      }
      if (down) {
        const cells = [];
        for (let rr = r + 1; rr < h && white[rr * w + c]; rr++) cells.push(rr * w + c);
        const id = runs.length;
        runs.push({ cells, sum: down, dir: 1, clue: i, combos: L.kkCombos(cells.length, down) });
        cells.forEach((x) => { runOf[x * 2 + 1] = id; });
      }
    }
    const whites = [];
    for (let i = 0; i < N; i++) if (white[i]) whites.push(i);
    return { kind: 'kakuro', w, h, N, white, whites, runs, runOf, clueAt };
  };
  const runName = (P, k) => { const R = P.runs[k]; return 'the ' + (R.dir ? 'down' : 'across') + ' run of ' + plural(R.cells.length, 'cell') + ' adding up to **' + R.sum + '**'; };
  L.kkRunName = runName;
  const comboText = (m) => digitsOf(m).join('+');
  L.kkComboText = comboText;

  function kkState(P) {
    const cand = new Uint16Array(P.N);
    for (const i of P.whites) cand[i] = 511;
    return { cand, why: null, nset: 0, p2: 0 };
  }
  const kkClone = (S) => ({ cand: S.cand.slice(), why: null, nset: 0, p2: 0 });

  // level 1 for one run: the digits its sums allow (given the digits placed), minus those placed elsewhere in it
  function kkRun1(P, S, k) {
    const R = P.runs[k], cand = S.cand;
    let placed = 0;
    for (const x of R.cells) {
      const d = single(cand[x]);
      if (!d) continue;
      if (placed & bit(d)) return (S.why = { t: 'dup', run: k, d });
      placed |= bit(d);
    }
    let U = 0;
    for (const m of R.combos) if ((m & placed) === placed) U |= m;
    if (!U) return (S.why = { t: 'sum', run: k });
    let changed = false;
    for (const x of R.cells) {
      const c0 = cand[x];
      if (single(c0)) { if (!(c0 & U)) return (S.why = { t: 'sum', run: k }); continue; }
      const c1 = c0 & U & ~placed;
      if (!c1) return (S.why = { t: 'empty', cell: x, run: k });
      if (c1 !== c0) { cand[x] = c1; changed = true; S.nset++; }
    }
    return changed;
  }

  // level 2 for one run: every combination that can really be placed, and which digit each cell can take in one
  const FW = new Uint8Array(10 * 512), BW = new Uint8Array(11 * 512);
  function kkSupport(P, cand, R, M) {
    const cells = R.cells, n = cells.length;
    FW.fill(0, 0, (n + 1) * 512); BW.fill(0, 0, (n + 2) * 512);
    FW[0] = 1;
    for (let k = 0; k < n; k++) {
      const cm = cand[cells[k]] & M;
      if (!cm) return null;
      for (let s = M; ; s = (s - 1) & M) {
        if (FW[k * 512 + s] && POP[s] === k) { let t = cm & ~s; while (t) { const b = t & -t; FW[(k + 1) * 512 + (s | b)] = 1; t ^= b; } }
        if (s === 0) break;
      }
    }
    if (!FW[n * 512 + M]) return null;
    BW[n * 512] = 1;
    for (let k = n - 1; k >= 0; k--) {
      const cm = cand[cells[k]] & M;
      for (let s = M; ; s = (s - 1) & M) {
        if (BW[(k + 1) * 512 + s] && POP[s] === n - k - 1) { let t = cm & ~s; while (t) { const b = t & -t; BW[k * 512 + (s | b)] = 1; t ^= b; } }
        if (s === 0) break;
      }
    }
    const sup = new Uint16Array(n);
    for (let k = 0; k < n; k++) {
      const cm = cand[cells[k]] & M;
      for (let s = M; ; s = (s - 1) & M) {
        if (FW[k * 512 + s] && POP[s] === k) { let t = cm & ~s; while (t) { const b = t & -t; if (BW[(k + 1) * 512 + (M & ~(s | b))]) sup[k] |= b; t ^= b; } }
        if (s === 0) break;
      }
    }
    return sup;
  }
  function kkRun2(P, S, k, info) {
    const R = P.runs[k], cand = S.cand, n = R.cells.length;
    const union = new Uint16Array(n);
    const live = [];
    for (const M of R.combos) {
      const sup = kkSupport(P, cand, R, M);
      if (!sup) continue;
      live.push(M);
      for (let t = 0; t < n; t++) union[t] |= sup[t];
    }
    if (info) info.live = live;
    if (!live.length) return (S.why = { t: 'sum', run: k });
    let changed = false;
    for (let t = 0; t < n; t++) {
      const x = R.cells[t];
      if (!union[t]) return (S.why = { t: 'empty', cell: x, run: k });
      if (union[t] !== cand[x]) { cand[x] = union[t]; changed = true; S.nset++; }
    }
    return changed;
  }

  function kkProp(P, S, level) {
    for (let guard = 0; guard < 2000; guard++) {
      let changed = false;
      for (let k = 0; k < P.runs.length; k++) {
        const r = kkRun1(P, S, k);
        if (r === true) changed = true; else if (r) return r;
      }
      if (changed) continue;
      if (level < 2) return null;
      for (let k = 0; k < P.runs.length; k++) {
        const r = kkRun2(P, S, k);
        if (r === true) { changed = true; S.p2++; } else if (r) return r;
      }
      if (!changed) return null;
    }
    return null;
  }
  L.kkProp = kkProp;
  const kkOpen = (P, S) => { let k = 0; for (const i of P.whites) if (!single(S.cand[i])) k++; return k; };

  L.kkValid = function (P, digits) {
    for (const i of P.whites) if (!(digits[i] >= 1 && digits[i] <= 9)) return false;
    for (const R of P.runs) {
      let s = 0, seen = 0;
      for (const x of R.cells) { if (seen & bit(digits[x])) return false; seen |= bit(digits[x]); s += digits[x]; }
      if (s !== R.sum) return false;
    }
    return true;
  };

  function kkTrial(P, S, best, deadline) {
    let found = null;
    const order = P.whites.filter((i) => !single(S.cand[i])).sort((a, b) => POP[S.cand[a]] - POP[S.cand[b]]);
    for (const i of order) {
      if (deadline && now() > deadline) return found;
      for (const d of digitsOf(S.cand[i])) {
        const T = kkClone(S);
        T.cand[i] = bit(d);
        const c = kkProp(P, T, 2);
        if (c) {
          const r = { i, d, why: c, T, len: T.nset };
          if (!best) return r;
          if (!found || r.len < found.len) found = r;
        }
      }
      if (found && best && found.len <= 4) break;
    }
    return found;
  }

  L.kkSolve = function (P, level, deadline) {
    const S = kkState(P);
    let c = kkProp(P, S, Math.min(level, 2));
    let l3 = 0;
    for (let guard = 0; !c && guard < 2000 && kkOpen(P, S) && level >= 3; guard++) {
      if (deadline && now() > deadline) break;
      const tr = kkTrial(P, S, false, deadline);
      if (!tr) break;
      l3++;
      S.cand[tr.i] &= ~bit(tr.d);
      c = kkProp(P, S, 2);
    }
    const digits = new Int8Array(P.N);
    for (const i of P.whites) digits[i] = single(S.cand[i]);
    return { ok: !c, done: !c && !kkOpen(P, S) && L.kkValid(P, digits), digits, S, l2: S.p2, l3 };
  };
  L.kkCount = function (P, limit, nodeLimit) {
    limit = limit || 2;
    nodeLimit = nodeLimit || 50000;
    let count = 0, sol = null, nodes = 0, aborted = false;
    const rec = (S) => {
      if (count >= limit || aborted) return;
      if (++nodes > nodeLimit) { aborted = true; return; }
      if (kkProp(P, S, 2)) return;
      let pick = -1, best = 99;
      for (const i of P.whites) { const p = POP[S.cand[i]]; if (p > 1 && p < best) { best = p; pick = i; } }
      if (pick < 0) {
        const digits = new Int8Array(P.N);
        for (const i of P.whites) digits[i] = single(S.cand[i]);
        if (L.kkValid(P, digits)) { count++; if (!sol) sol = digits; }
        return;
      }
      for (const d of digitsOf(S.cand[pick])) {
        const T = kkClone(S);
        T.cand[pick] = bit(d);
        rec(T);
        if (count >= limit || aborted) return;
      }
    };
    rec(kkState(P));
    return { count, sol, nodes, aborted };
  };
  L.kkGrade = function (P) {
    const r = L.kkSolve(P, 3);
    return { done: r.done, top: r.l3 ? 3 : r.l2 ? 2 : 1, l2: r.l2, l3: r.l3 };
  };
  L.kkDiff = function (w, h, nWhite, g) {
    const size = nWhite <= 16 ? 0 : nWhite <= 30 ? 0.4 : nWhite <= 45 ? 0.8 : nWhite <= 65 ? 1.2 : nWhite <= 80 ? 1.6 : 2;
    const lv = g.l3 ? 1.7 + Math.min(1, g.l3 * 0.2) : g.l2 ? 0.5 + Math.min(1.2, g.l2 * 0.035) : 0;
    return clamp(Math.round(1 + size + lv), 1, 5);
  };

  function kkWhy(P, why) {
    if (!why) return { text: 'the sums would not work out', focus: {} };
    if (why.t === 'dup') return { text: runName(P, why.run) + ' would hold two **' + why.d + '**s', focus: { cells: P.runs[why.run].cells } };
    if (why.t === 'sum') return { text: runName(P, why.run) + ' could no longer make its total', focus: { cells: P.runs[why.run].cells } };
    return { text: 'the cell at ' + cellName(why.cell, P.w) + ' would have no digit left', focus: { cells: [why.cell] } };
  }

  /* The next step from the player's digits (0 = empty), all right. Returns
   * { level, cell, d, text, focus: { cells, runs } } or null. */
  L.kkStep = function (P, digits, maxLevel, sol) {
    maxLevel = maxLevel || 4;
    const S = kkState(P);
    for (const i of P.whites) if (digits[i]) S.cand[i] = bit(digits[i]);
    const notes = [];
    const w = P.w;
    const describe = (i, lvl) => {
      // why cell i holds one digit: the two runs' combinations as they stand
      const parts = [];
      for (const k of [P.runOf[i * 2], P.runOf[i * 2 + 1]]) {
        if (k < 0) continue;
        const R = P.runs[k];
        let placed = 0;
        for (const x of R.cells) if (x !== i && single(S.cand[x])) placed |= S.cand[x];
        const live = R.combos.filter((m) => (m & placed) === placed && (m & S.cand[i] & ~placed));
        parts.push(runName(P, k).replace(/^the/, 'The') + (live.length === 1 ? ' can only be ' + comboText(live[0]) : live.length <= 4 ? ' can be ' + live.map(comboText).join(', ') : ' has ' + live.length + ' combinations') + (placed ? ' (' + digitsOf(placed).join(', ') + ' already placed)' : ''));
      }
      return parts.join('. ');
    };
    for (let round = 0; round < 30; round++) {
      // level 1: a cell whose two runs leave one digit
      const T = kkClone(S);
      const c1 = kkProp(P, T, 1);
      if (!c1) {
        // prefer a cell decided directly by its own two runs
        let pick = -1;
        for (const i of P.whites) {
          if (single(S.cand[i]) || !single(T.cand[i])) continue;
          const U = kkClone(S);
          kkRun1(P, U, P.runOf[i * 2]); kkRun1(P, U, P.runOf[i * 2 + 1]);
          if (single(U.cand[i])) { pick = i; break; }
          if (pick < 0) pick = i;
        }
        if (pick >= 0) {
          const d = single(T.cand[pick]);
          return { level: notes.length ? notes[notes.length - 1].level : 1, cell: pick, d, focus: { cells: [pick], runs: [P.runOf[pick * 2], P.runOf[pick * 2 + 1]] },
            text: notes.map((n) => n.text).join(' ') + (notes.length ? ' So: ' : '') + '**' + d + '** at ' + cellName(pick, w) + '. ' + describe(pick, 1) + '. Together they leave only ' + d + '.' };
        }
      }
      if (maxLevel < 2) return null;
      // level 2a: one run weighed as a whole, given what its other cells can hold
      if (!c1) {
        for (let k = 0; k < P.runs.length; k++) {
          const R = P.runs[k], U = kkClone(T), info = {};
          if (kkRun2(P, U, k, info) !== true) continue;
          const x = R.cells.find((y) => !single(T.cand[y]) && single(U.cand[y]));
          if (x == null) continue;
          const d = single(U.cand[x]);
          const others = R.cells.filter((y) => y !== x && !single(T.cand[y]));
          const list = others.slice(0, 4).map((y) => digitsOf(T.cand[y]).join('/')).join(', ') + (others.length > 4 ? '…' : '');
          const Rn = runName(P, k).replace(/^the/, 'The');
          const text = '**' + d + '** at ' + cellName(x, w) + '. ' + Rn + (info.live.length === 1 ? ' can only be made as ' + comboText(info.live[0]) : ' can only be made as ' + info.live.map(comboText).join(' or ')) + ' once you weigh what its cells can hold' + (others.length ? ' (the other open ' + (others.length === 1 ? 'cell takes ' : 'cells take ') + list + ', from their crossing runs)' : '') + '. That leaves only **' + d + '** here.';
          return { level: notes.length ? notes[notes.length - 1].level : 2, cell: x, d, focus: { cells: [x], runs: [k, P.runOf[x * 2] === k ? P.runOf[x * 2 + 1] : P.runOf[x * 2]] }, text: notes.map((n) => n.text).join(' ') + (notes.length ? ' So: ' : '') + text };
        }
      }
      // level 2: whole-run reasoning
      const T2 = kkClone(S);
      const c2 = kkProp(P, T2, 2);
      if (!c2) {
        let pick = -1;
        for (const i of P.whites) if (!single(S.cand[i]) && single(T2.cand[i])) { pick = i; break; }
        if (pick >= 0) {
          const d = single(T2.cand[pick]);
          // a hidden single? a digit every combination needs, with one place for it
          let why = '';
          for (const k of [P.runOf[pick * 2], P.runOf[pick * 2 + 1]]) {
            if (k < 0) continue;
            const info = {};
            const U = kkClone(T);
            kkRun2(P, U, k, info);
            if (info.live && info.live.length && info.live.every((m) => m & bit(d))) {
              const R = P.runs[k];
              const spots = R.cells.filter((x) => U.cand[x] & bit(d));
              if (spots.length === 1) { why = runName(P, k).replace(/^the/, 'The') + ' needs a **' + d + '**: ' + (info.live.length === 1 ? 'its only combination is ' + comboText(info.live[0]) : 'every combination that still fits (' + info.live.map(comboText).join(', ') + ') has one') + ', and no other cell of the run can take it.'; break; }
            }
          }
          if (!why) {
            // what each run allows here, weighing what its other cells can take
            const ks = [P.runOf[pick * 2], P.runOf[pick * 2 + 1]];
            const sup = ks.map((k) => { const U = kkClone(T); kkRun2(P, U, k); return U.cand[pick]; });
            const say = (m) => { const a = digitsOf(m); return a.length === 1 ? String(a[0]) : a.slice(0, -1).join(', ') + ' or ' + a[a.length - 1]; };
            if (single(sup[0] & sup[1]) === d && sup[0] && sup[1]) {
              why = describe(pick, 2) + '. Weighing what the other cells of each run can take, the across run allows only ' + say(sup[0]) + ' here, and the down run only ' + say(sup[1]) + ': **' + d + '** is the one digit in both.';
            } else why = describe(pick, 2) + '. Working through which combinations can really be placed, given what the crossing runs allow, leaves only **' + d + '** here.';
          }
          return { level: 2, cell: pick, d, focus: { cells: [pick], runs: [P.runOf[pick * 2], P.runOf[pick * 2 + 1]] }, text: notes.map((n) => n.text).join(' ') + (notes.length ? ' So: ' : '') + '**' + d + '** at ' + cellName(pick, w) + '. ' + why };
        }
      }
      if (maxLevel < 3) break;
      // level 3: rule a digit out by supposing it
      const tr = kkTrial(P, T2, true);
      if (!tr) break;
      const wy = kkWhy(P, tr.why);
      notes.push({ level: 3, text: 'Suppose the cell at ' + cellName(tr.i, w) + ' were **' + tr.d + '**: then ' + wy.text + '. So it is not ' + tr.d + '.' });
      for (const i of P.whites) S.cand[i] = T2.cand[i];
      S.cand[tr.i] &= ~bit(tr.d);
    }
    if (maxLevel < 4 || !sol) return null;
    for (const i of P.whites) if (!digits[i]) return { level: 4, cell: i, d: sol[i], focus: { cells: [i] }, text: 'This needs a long chain of reasoning. The cell at ' + cellName(i, w) + ' is **' + sol[i] + '** — can you see why?' };
    return null;
  };

  /* A Kakuro: a symmetric pattern of black cells (no one-cell runs, none longer
   * than 9), filled with random digits, then digits changed one at a time while
   * logic of `level` leaves fewer cells open, until it finishes the grid. */
  L.kkMake = function (w, h, rng, level, opts) {
    opts = opts || {};
    const N = w * h, t0 = now(), budget = opts.budget || 1e9;
    const black = new Uint8Array(N);
    for (let i = 0; i < N; i++) if (i < w || i % w === 0) black[i] = 1;
    const runsOk = (strict) => {
      for (let r = 1; r < h; r++) {
        let len = 0;
        for (let c = 1; c <= w; c++) {
          if (c < w && !black[r * w + c]) { len++; continue; }
          if (len === 1 || (strict && len > 9)) return false;
          len = 0;
        }
      }
      for (let c = 1; c < w; c++) {
        let len = 0;
        for (let r = 1; r <= h; r++) {
          if (r < h && !black[r * w + c]) { len++; continue; }
          if (len === 1 || (strict && len > 9)) return false;
          len = 0;
        }
      }
      return true;
    };
    const connected = () => {
      let s = -1, tot = 0;
      for (let i = 0; i < N; i++) if (!black[i]) { tot++; if (s < 0) s = i; }
      if (tot < 4) return false;
      const seen = new Uint8Array(N), st = [s];
      seen[s] = 1;
      let got = 1;
      while (st.length) {
        const i = st.pop(), r = Math.floor(i / w), c = i % w;
        for (let d = 0; d < 4; d++) { const rr = r + DR[d], cc = c + DC[d]; if (rr < 0 || cc < 0 || rr >= h || cc >= w) continue; const j = rr * w + cc; if (!black[j] && !seen[j]) { seen[j] = 1; got++; st.push(j); } }
      }
      return got === tot;
    };
    const mirror = (i) => { const r = Math.floor(i / w), c = i % w; return (h - r) * w + (w - c); };
    const inner = (w - 1) * (h - 1), want = Math.round(inner * (opts.black || (w >= 11 ? 0.26 + rng() * 0.06 : 0.22 + rng() * 0.08)));
    let nb = 0;
    for (let guard = 0; guard < inner * 20 && nb < want; guard++) {
      const r = 1 + rng.int(h - 1), c = 1 + rng.int(w - 1), i = r * w + c, j = mirror(i);
      if (black[i]) continue;
      black[i] = 1; black[j] = 1;
      if (!runsOk(false) || !connected()) { black[i] = 0; black[j] = 0; continue; }
      nb += i === j ? 1 : 2;
    }
    // break up runs longer than nine
    const longRun = () => {
      for (let r = 1; r < h; r++) for (let c = 1, len = 0; c <= w; c++) { if (c < w && !black[r * w + c]) { len++; continue; } if (len > 9) { const out = []; for (let k = c - len; k < c; k++) out.push(r * w + k); return out; } len = 0; }
      for (let c = 1; c < w; c++) for (let r = 1, len = 0; r <= h; r++) { if (r < h && !black[r * w + c]) { len++; continue; } if (len > 9) { const out = []; for (let k = r - len; k < r; k++) out.push(k * w + c); return out; } len = 0; }
      return null;
    };
    for (let guard = 0; guard < 40; guard++) {
      const run = longRun();
      if (!run) break;
      let fixed = false;
      for (const i of rng.shuffle(run.slice(1, -1))) {
        const j = mirror(i);
        black[i] = 1; black[j] = 1;
        if (runsOk(false) && connected()) { fixed = true; break; }
        black[i] = 0; black[j] = 0;
      }
      if (!fixed) return null;
    }
    if (!runsOk(true)) return null;
    // every white cell needs an across and a down run of two or more: guaranteed by runsOk (no length 1)
    const whites = [];
    for (let i = 0; i < N; i++) if (!black[i]) whites.push(i);
    // fill with digits, no repeats in a run
    const digits = new Int8Array(N);
    const rowRun = new Int32Array(N).fill(-1), colRun = new Int32Array(N).fill(-1);
    let nr = 0;
    for (let r = 1; r < h; r++) for (let c = 1; c < w; c++) { const i = r * w + c; if (black[i]) continue; rowRun[i] = black[i - 1] ? nr++ : rowRun[i - 1]; }
    for (let c = 1; c < w; c++) for (let r = 1; r < h; r++) { const i = r * w + c; if (black[i]) continue; colRun[i] = black[i - w] ? nr++ : colRun[i - w]; }
    const used = new Uint16Array(nr);
    let nodes = 0;
    const fill = (k) => {
      if (k === whites.length) return true;
      if (++nodes > 20000) return false;
      const i = whites[k], ban = used[rowRun[i]] | used[colRun[i]];
      for (const d of rng.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
        if (ban & bit(d)) continue;
        digits[i] = d; used[rowRun[i]] |= bit(d); used[colRun[i]] |= bit(d);
        if (fill(k + 1)) return true;
        used[rowRun[i]] &= ~bit(d); used[colRun[i]] &= ~bit(d); digits[i] = 0;
      }
      return false;
    };
    if (!fill(0)) return null;
    const cluesOf = (dg) => {
      const out = [];
      for (let i = 0; i < N; i++) {
        if (!black[i]) continue;
        const r = Math.floor(i / w), c = i % w;
        let down = 0, across = 0;
        if (c + 1 < w && !black[i + 1]) for (let cc = c + 1; cc < w && !black[r * w + cc]; cc++) across += dg[r * w + cc];
        if (r + 1 < h && !black[i + w]) for (let rr = r + 1; rr < h && !black[rr * w + c]; rr++) down += dg[rr * w + c];
        if (down || across) out.push([i, down, across]);
      }
      return out;
    };
    const grid = toRows(black, w, (b) => (b ? '#' : '.'));
    const evalLevel = Math.min(level, 2);
    const score = (dg) => {
      const P = L.kkPrep(w, h, grid, cluesOf(dg));
      const r = L.kkSolve(P, evalLevel);
      const near = [];
      let open = 0;
      for (const i of P.whites) if (!single(r.S.cand[i])) { open++; near.push(i); }
      return { open: r.ok ? open : 1e9, P, near };
    };
    let cur = score(digits);
    let deepOk = false, lastDeep = -1;
    for (let it = 0; it < (opts.iters || (w >= 10 ? 110 : 60) * w) && cur.open > 0; it++) {
      if (now() - t0 > budget) return null;
      if (level >= 3 && cur.open <= whites.length * 0.4 && lastDeep !== cur.open) {
        lastDeep = cur.open;
        if (L.kkSolve(cur.P, level, t0 + budget).done) { deepOk = true; break; }
      }
      const src = rng() < 0.8 && cur.near.length ? cur.near : whites;
      const i = src[rng.int(src.length)];
      const ban = used[rowRun[i]] | used[colRun[i]];
      const opt = [];
      for (let d = 1; d <= 9; d++) if (!(ban & bit(d))) opt.push(d);
      if (!opt.length) continue;
      const d = opt[rng.int(opt.length)], old = digits[i];
      used[rowRun[i]] &= ~bit(old); used[colRun[i]] &= ~bit(old);
      digits[i] = d; used[rowRun[i]] |= bit(d); used[colRun[i]] |= bit(d);
      const nx = score(digits);
      if (nx.open <= cur.open || rng() < 0.02) cur = nx;
      else { used[rowRun[i]] &= ~bit(d); used[colRun[i]] &= ~bit(d); digits[i] = old; used[rowRun[i]] |= bit(old); used[colRun[i]] |= bit(old); }
    }
    if (cur.open > 0 && !deepOk) return null;
    const P = cur.P;
    const fin = L.kkSolve(P, level);
    if (!fin.done) return null;
    for (const i of whites) if (fin.digits[i] !== digits[i]) return null;
    const g = L.kkGrade(P);
    return { w, h, grid, clues: cluesOf(digits), sol: toRows(digits, w, (x, i) => (black[i] ? '#' : String(x))), grade: g, diff: L.kkDiff(w, h, whites.length, g), P };
  };

  /* @@END@@ */
})(typeof window !== 'undefined' ? window : globalThis);
