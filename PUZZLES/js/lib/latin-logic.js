/* The Puzzle Cabinet · js/lib/latin-logic.js
 *
 * Number-in-cell puzzles on an n × n Latin square: Sudoku (boxes, jigsaw
 * regions, diagonals), KenKen cages, Futoshiki signs and Skyscraper clues.
 * Node-safe: the engine (engines/latin.js), its verify() and the generator
 * (tools/gen/latin.js) all use it.
 *
 *   const P = Cabinet.Latin.build(data)        the model: units, peers, cages …
 *   Latin.count(P, grid, limit)                 solutions up to limit: { n, first, nodes, aborted }
 *   Latin.problems(P, grid)                     rules broken by a (partial) grid
 *   Latin.logic(P, grid, opts)                  a human-style solver that never guesses:
 *                                               { solved, stuck, bad, level, steps, counts, g, cand }
 *   Latin.hintStep(P, grid)                     the next forced cell with its reasons (for live hints)
 *   Latin.say(S, step)                          a step in words
 *
 * data: { kind: 'sudoku' | 'kenken' | 'futoshiki' | 'skyscrapers', n,
 *         givens: '..3.1…' (row by row, '.' = empty),  sol: '4231…',
 *         box: [2, 3]              Sudoku box height × width
 *         regions: 'aabbb…'        jigsaw: a region letter for every cell
 *         diag: true               both long diagonals hold every digit once
 *         cages: [[target, op, cell, cell …]]   KenKen; op is one of + - * / =
 *         lt: [[a, b] …]           Futoshiki: the number in cell a is less than in cell b
 *         clues: { t: [], b: [], l: [], r: [] }   Skyscrapers, 0 = no clue }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet = root.Cabinet || {};

  /* ---------- bits: a set of digits is a bit mask, digit v is bit v ---------- */

  const B = (v) => 1 << v;
  function pop(m) { let c = 0; while (m) { m &= m - 1; c++; } return c; }
  function low(m) { return 31 - Math.clz32(m & -m); }
  function high(m) { return 31 - Math.clz32(m); }
  function list(m) { const out = []; for (let v = 1; v < 16 && (m >> v); v++) if (m & (1 << v)) out.push(v); return out; }
  const seq = (n) => Array.from({ length: n }, (_, i) => i);

  function parseGrid(s, N) {
    const g = new Int8Array(N);
    if (!s) return g;
    for (let i = 0; i < N; i++) {
      const ch = s.charAt(i);
      g[i] = ch >= '1' && ch <= '9' ? ch.charCodeAt(0) - 48 : 0;
    }
    return g;
  }
  const gridStr = (g) => Array.from(g, (v) => (v ? String(v) : '.')).join('');

  const OPS = { '+': '+', '-': '−', '*': '×', '/': '÷', '=': '' };

  /* ---------- the model ---------- */

  function regionMap(d) {
    const n = d.n, N = n * n, reg = new Int8Array(N);
    if (d.regions) {
      const ids = {};
      let k = 0;
      for (let i = 0; i < N; i++) {
        const ch = d.regions.charAt(i);
        if (ids[ch] == null) ids[ch] = k++;
        reg[i] = ids[ch];
      }
      return reg;
    }
    const bh = d.box[0], bw = d.box[1], perRow = n / bw;
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / n), c = i % n;
      reg[i] = Math.floor(r / bh) * perRow + Math.floor(c / bw);
    }
    return reg;
  }

  function boxNames(d, reg) {
    const n = d.n;
    if (d.regions) {
      // a jigsaw region is named by the cell nearest its middle
      return seq(n).map((k) => {
        const cells = seq(n * n).filter((i) => reg[i] === k);
        const cr = cells.reduce((s, i) => s + Math.floor(i / n), 0) / cells.length;
        const cc = cells.reduce((s, i) => s + (i % n), 0) / cells.length;
        let best = cells[0], bd = 1e9;
        cells.forEach((i) => { const dd = (Math.floor(i / n) - cr) ** 2 + ((i % n) - cc) ** 2; if (dd < bd) { bd = dd; best = i; } });
        return 'the region around row ' + (Math.floor(best / n) + 1) + ', column ' + (best % n + 1);
      });
    }
    const bh = d.box[0], bw = d.box[1], rows = n / bh, cols = n / bw;
    const V = rows === 3 ? ['top', 'middle', 'bottom'] : rows === 2 ? ['top', 'bottom'] : seq(rows).map((r) => 'band ' + (r + 1));
    const H = cols === 3 ? ['left', 'centre', 'right'] : cols === 2 ? ['left', 'right'] : seq(cols).map((c) => 'stack ' + (c + 1));
    const out = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const nm = V[r] === 'middle' && H[c] === 'centre' ? 'centre' : V[r] + '-' + H[c];
      out.push('the ' + nm + ' box');
    }
    return out;
  }

  function build(d) {
    const n = d.n, N = n * n;
    const P = { d, n, N, kind: d.kind, full: (1 << (n + 1)) - 2 };
    P.givens = parseGrid(d.givens, N);
    P.sol = d.sol ? parseGrid(d.sol, N) : null;
    const units = [];
    const add = (type, i, cells, name) => { units.push({ type, i, cells, name, k: units.length }); };
    for (let r = 0; r < n; r++) add('row', r, seq(n).map((c) => r * n + c), 'row ' + (r + 1));
    for (let c = 0; c < n; c++) add('col', c, seq(n).map((r) => r * n + c), 'column ' + (c + 1));
    if (d.kind === 'sudoku') {
      const reg = regionMap(d);
      P.region = reg;
      const names = boxNames(d, reg);
      for (let k = 0; k < n; k++) add('box', k, seq(N).filter((i) => reg[i] === k), names[k]);
      if (d.diag) {
        add('diag', 0, seq(n).map((k) => k * n + k), 'the ↘ diagonal');
        add('diag', 1, seq(n).map((k) => k * n + (n - 1 - k)), 'the ↙ diagonal');
      }
    }
    P.units = units;
    // hidden singles are easiest to see in boxes, then rows and columns
    P.scan = units.filter((u) => u.type === 'box').concat(units.filter((u) => u.type === 'row' || u.type === 'col'), units.filter((u) => u.type === 'diag'));
    P.unitsOf = seq(N).map(() => []);
    units.forEach((u) => u.cells.forEach((i) => P.unitsOf[i].push(u.k)));
    P.peer = new Uint8Array(N * N);
    P.peers = seq(N).map((i) => {
      const s = new Set();
      P.unitsOf[i].forEach((k) => units[k].cells.forEach((j) => { if (j !== i) s.add(j); }));
      const arr = Array.from(s).sort((a, b) => a - b);
      arr.forEach((j) => { P.peer[i * N + j] = 1; });
      return arr;
    });
    P.lt = d.lt || [];
    if (d.cages) {
      P.cages = d.cages.map((cg, k) => {
        const cells = cg.slice(2);
        const cage = { k, t: cg[0], op: cg[1], cells };
        // which earlier cells of the cage each cell must differ from (same row or column)
        cage.diff = cells.map((a, j) => cells.slice(0, j).map((b, q) => (sameLine(n, a, b) ? q : -1)).filter((q) => q >= 0));
        // the label goes in the top cell (then the leftmost)
        cage.anchor = cells.slice().sort((a, b) => a - b)[0];
        return cage;
      });
      P.cageOf = new Int16Array(N).fill(-1);
      P.cages.forEach((cg) => cg.cells.forEach((i) => { P.cageOf[i] = cg.k; }));
    }
    if (d.clues) {
      const cl = d.clues;
      P.lines = [];
      for (let r = 0; r < n; r++) P.lines.push({ type: 'row', idx: r, cells: seq(n).map((c) => r * n + c), a: cl.l[r] || 0, b: cl.r[r] || 0, sa: 'l', sb: 'r', name: 'row ' + (r + 1) });
      for (let c = 0; c < n; c++) P.lines.push({ type: 'col', idx: c, cells: seq(n).map((r) => r * n + c), a: cl.t[c] || 0, b: cl.b[c] || 0, sa: 't', sb: 'b', name: 'column ' + (c + 1) });
    }
    return P;
  }

  function sameLine(n, a, b) { return Math.floor(a / n) === Math.floor(b / n) || a % n === b % n; }

  /* ---------- rules ---------- */

  function seen(vs) { let m = 0, c = 0; for (const v of vs) if (v > m) { m = v; c++; } return c; }

  function cageValue(op, vs) {
    switch (op) {
      case '+': return vs.reduce((s, v) => s + v, 0);
      case '*': return vs.reduce((s, v) => s * v, 1);
      case '-': return Math.abs(vs[0] - vs[1]);
      case '/': { const a = Math.max(vs[0], vs[1]), b = Math.min(vs[0], vs[1]); return a % b === 0 ? a / b : -1; }
      default: return vs[0];
    }
  }
  function cageLabel(cg) { return cg.t + (OPS[cg.op] || ''); }

  /* Every rule a grid breaks, as far as it is filled in:
   * [{ type: 'dup', unit, v, cells } | { type: 'cage', cage, cells } | { type: 'lt', k, cells }
   *  | { type: 'clue', side, idx, cells }] */
  function problems(P, g) {
    const out = [];
    const n = P.n;
    P.units.forEach((u) => {
      const at = {};
      u.cells.forEach((i) => { const v = g[i]; if (v) (at[v] = at[v] || []).push(i); });
      for (const v in at) if (at[v].length > 1) out.push({ type: 'dup', unit: u.k, v: +v, cells: at[v] });
    });
    if (P.cages) {
      P.cages.forEach((cg) => {
        const vs = cg.cells.map((i) => g[i]);
        const filled = vs.filter((v) => v);
        if (!filled.length) return;
        let bad = false;
        if (filled.length === vs.length) bad = cageValue(cg.op, vs) !== cg.t;
        else if (cg.op === '+') bad = filled.reduce((s, v) => s + v, 0) + (vs.length - filled.length) > cg.t;
        else if (cg.op === '*') bad = cg.t % filled.reduce((s, v) => s * v, 1) !== 0;
        else if (cg.op === '/' && filled.length === 1) bad = !(cg.t * filled[0] <= n || filled[0] % cg.t === 0);
        else if (cg.op === '-' && filled.length === 1) bad = !(filled[0] + cg.t <= n || filled[0] - cg.t >= 1);
        if (bad) out.push({ type: 'cage', cage: cg.k, cells: cg.cells.slice() });
      });
    }
    P.lt.forEach((pr, k) => {
      const a = g[pr[0]], b = g[pr[1]];
      if (a && b && !(a < b)) out.push({ type: 'lt', k, cells: pr.slice() });
    });
    if (P.lines) {
      P.lines.forEach((ln) => {
        [[ln.a, ln.sa, ln.cells], [ln.b, ln.sb, ln.cells.slice().reverse()]].forEach(([clue, side, cells]) => {
          if (!clue) return;
          // judge as soon as everything up to the tallest building is known
          const vs = [];
          let ok = null;
          for (const i of cells) {
            if (!g[i]) break;
            vs.push(g[i]);
            if (g[i] === n) { ok = seen(vs) === clue; break; }
          }
          if (ok === null) {
            // not finished: only complain when too many are visible already
            if (seen(vs) > clue) ok = false;
          }
          if (ok === false) out.push({ type: 'clue', side, idx: ln.idx, cells: ln.cells.slice() });
        });
      });
    }
    return out;
  }

  /* ---------- candidates shared by both solvers ---------- */

  // every way to fill a cage from the candidates: arrays of values in cage order (at most `cap`)
  function cageFills(P, cg, cand, cap) {
    const cells = cg.cells, m = cells.length, n = P.n, t = cg.t, op = cg.op;
    const out = [];
    const cur = new Array(m);
    cap = cap || 1e5;
    function rec(j, acc) {
      if (out.length >= cap) return;
      if (j === m) {
        let ok;
        if (op === '+' || op === '*') ok = acc === t;
        else if (op === '=') ok = cur[0] === t;
        else ok = cageValue(op, cur) === t;
        if (ok) out.push(cur.slice());
        return;
      }
      let mask = cand[cells[j]];
      const df = cg.diff[j];
      for (let q = 0; q < df.length; q++) mask &= ~B(cur[df[q]]);
      const rest = m - j - 1;
      for (let v = 1; v <= n; v++) {
        if (!(mask & B(v))) continue;
        let a2 = acc;
        if (op === '+') { a2 = acc + v; if (a2 + rest > t || a2 + rest * n < t) continue; }
        else if (op === '*') { a2 = acc * v; if (t % a2 !== 0) continue; if (!rest && a2 !== t) continue; }
        cur[j] = v;
        rec(j + 1, a2);
      }
    }
    rec(0, op === '*' ? 1 : 0);
    return out;
  }

  // every order of a skyscraper line that fits the candidates and its clues
  function lineFills(P, ln, cand, wantList) {
    const n = P.n, cells = ln.cells, a = ln.a, b = ln.b;
    const union = new Int32Array(n);
    const found = wantList ? [] : null;
    let count = 0;
    const cur = new Int8Array(n);
    const full = P.full;
    function rec(j, used, max, vis) {
      if (a) {
        if (vis > a) return;
        const rest = full & ~used & ~((2 << max) - 1);
        if (vis + pop(rest) < a) return;
      }
      if (j === n) {
        if (a && vis !== a) return;
        if (b) {
          let m = 0, c = 0;
          for (let k = n - 1; k >= 0; k--) if (cur[k] > m) { m = cur[k]; c++; }
          if (c !== b) return;
        }
        count++;
        for (let k = 0; k < n; k++) union[k] |= B(cur[k]);
        if (found && found.length < 50) found.push(Array.from(cur));
        return;
      }
      const mask = cand[cells[j]] & ~used;
      for (let v = 1; v <= n; v++) {
        if (!(mask & B(v))) continue;
        cur[j] = v;
        rec(j + 1, used | B(v), v > max ? v : max, v > max ? vis + 1 : vis);
      }
    }
    rec(0, 0, 0, 0);
    return { union, count, found };
  }

  /* ---------- counting solutions: propagation and search ---------- */

  function propagate(P, cand) {
    const N = P.N, units = P.units, peers = P.peers, full = P.full;
    const done = new Uint8Array(N);
    let changed = true;
    while (changed) {
      changed = false;
      for (let i = 0; i < N; i++) {
        const m = cand[i];
        if (!m) return false;
        if (!done[i] && (m & (m - 1)) === 0) {
          done[i] = 1;
          const pp = peers[i];
          for (let k = 0; k < pp.length; k++) {
            const j = pp[k];
            if (cand[j] & m) { cand[j] &= ~m; if (!cand[j]) return false; changed = true; }
          }
        }
      }
      for (let u = 0; u < units.length; u++) {
        const cells = units[u].cells;
        let once = 0, twice = 0;
        for (let k = 0; k < cells.length; k++) { const m = cand[cells[k]]; twice |= once & m; once |= m; }
        if ((once & full) !== full) return false;
        const only = once & ~twice;
        if (!only) continue;
        for (let k = 0; k < cells.length; k++) {
          const i = cells[k], m = cand[i] & only;
          if (m && cand[i] !== m) {
            if (m & (m - 1)) return false;
            cand[i] = m; changed = true;
          }
        }
      }
      if (changed) continue;
      if (P.cages) {
        for (const cg of P.cages) {
          const fills = cageFills(P, cg, cand);
          if (!fills.length) return false;
          cg.cells.forEach((i, j) => {
            let u = 0;
            for (const f of fills) u |= B(f[j]);
            if ((cand[i] & u) !== cand[i]) { cand[i] &= u; changed = true; }
          });
        }
      }
      for (const pr of P.lt) {
        const a = pr[0], b = pr[1], ma = cand[a], mb = cand[b];
        const na = ma & ((1 << high(mb)) - 1);
        const nb = mb & ~((2 << low(ma)) - 1);
        if (!na || !nb) return false;
        if (na !== ma || nb !== mb) { cand[a] = na; cand[b] = nb; changed = true; }
      }
      if (P.lines) {
        for (const ln of P.lines) {
          if (!ln.a && !ln.b) continue;
          const r = lineFills(P, ln, cand);
          if (!r.count) return false;
          ln.cells.forEach((i, k) => { if ((cand[i] & r.union[k]) !== cand[i]) { cand[i] &= r.union[k]; changed = true; } });
        }
      }
    }
    return true;
  }

  function initCand(P, grid) {
    const cand = new Int32Array(P.N).fill(P.full);
    const g = grid || P.givens;
    for (let i = 0; i < P.N; i++) if (g[i]) cand[i] = B(g[i]);
    return cand;
  }

  function count(P, grid, limit, nodeLimit) {
    limit = limit || 2;
    nodeLimit = nodeLimit || 200000;
    const out = { n: 0, first: null, nodes: 0, aborted: false };
    const N = P.N;
    function rec(cand) {
      if (out.n >= limit) return;
      if (++out.nodes > nodeLimit) { out.aborted = true; return; }
      if (!propagate(P, cand)) return;
      let best = -1, bc = 99;
      for (let i = 0; i < N; i++) {
        const c = pop(cand[i]);
        if (c > 1 && c < bc) { bc = c; best = i; if (c === 2) break; }
      }
      if (best < 0) { out.n++; if (!out.first) out.first = Array.from(cand, low); return; }
      const vs = list(cand[best]);
      for (const v of vs) {
        const c2 = cand.slice();
        c2[best] = B(v);
        rec(c2);
        if (out.n >= limit || out.aborted) return;
      }
    }
    rec(initCand(P, grid));
    return out;
  }

  // a Sudoku as exact cover, for a second opinion from dancing links
  function dlxCount(P, limit) {
    if (!C.DLX) return null;
    const n = P.n, N = P.N;
    const boxes = P.units.filter((u) => u.type === 'box' || u.type === 'diag');
    const colOf = { cell: 0, row: N, col: 2 * N, unit: 3 * N };
    const rows = [], meta = [];
    const unitIdx = new Map();
    boxes.forEach((u, k) => unitIdx.set(u.k, k));
    for (let i = 0; i < N; i++) {
      const r = Math.floor(i / n), c = i % n;
      for (let v = 1; v <= n; v++) {
        if (P.givens[i] && P.givens[i] !== v) continue;
        const cols = [colOf.cell + i, colOf.row + r * n + v - 1, colOf.col + c * n + v - 1];
        P.unitsOf[i].forEach((uk) => { if (unitIdx.has(uk)) cols.push(colOf.unit + unitIdx.get(uk) * n + v - 1); });
        rows.push(cols);
        meta.push([i, v]);
      }
    }
    const sols = C.DLX.solve({ primary: 3 * N + boxes.length * n, rows, max: limit || 2, nodeLimit: 2e6 });
    return { n: sols.length, aborted: sols.aborted, first: sols[0] ? (() => { const g = new Array(N).fill(0); sols[0].forEach((ri) => { g[meta[ri][0]] = meta[ri][1]; }); return g; })() : null };
  }

  /* ---------- the human solver ----------
   * Candidates are crossed out by digits in plain sight (why = -1) or by a
   * named step (why = its index), so a hint can say what a placement needs.
   * Levels: 1 singles and the plain rule of each kind (inequality signs, edge
   * clues, small cages); 2 pairs, pointing, cage and line analysis; 3 triples,
   * X-wings, longer analysis; 4 quads, swordfish, XY-wings. */

  function start(P, grid) {
    const N = P.N;
    const S = { P, g: new Int8Array(N), cand: new Int32Array(N).fill(P.full), why: new Int16Array(N * 16).fill(-2), steps: [], bad: false, left: N };
    for (let i = 0; i < N; i++) if (grid[i]) place(S, i, grid[i]);
    return S;
  }

  function place(S, i, v) {
    const P = S.P;
    if (S.g[i]) { if (S.g[i] !== v) S.bad = true; return; }
    if (!(S.cand[i] & B(v))) S.bad = true;
    S.g[i] = v;
    S.cand[i] = B(v);
    S.left--;
    const pp = P.peers[i];
    for (let k = 0; k < pp.length; k++) {
      const j = pp[k];
      if (S.g[j]) { if (S.g[j] === v) S.bad = true; continue; }
      if (S.cand[j] & B(v)) {
        S.cand[j] &= ~B(v);
        S.why[j * 16 + v] = -1;
        if (!S.cand[j]) S.bad = true;
      }
    }
  }

  function apply(S, st) {
    const k = S.steps.length;
    S.steps.push(st);
    if (st.elims) {
      for (const e of st.elims) {
        const i = e[0], v = e[1];
        if (S.cand[i] & B(v)) {
          S.cand[i] &= ~B(v);
          S.why[i * 16 + v] = k;
          if (!S.cand[i]) S.bad = true;
        }
      }
    }
    if (st.place) place(S, st.place[0], st.place[1]);
  }

  function combos(arr, k, from, acc, out) {
    if (acc.length === k) { out.push(acc.slice()); return out; }
    for (let i = from; i <= arr.length - (k - acc.length); i++) { acc.push(arr[i]); combos(arr, k, i + 1, acc, out); acc.pop(); }
    return out;
  }

  function findHidden(S, all, boxOnly) {
    const P = S.P, out = [];
    for (const u of P.scan) {
      if (boxOnly && u.type !== 'box') break;
      let have = 0;
      for (const i of u.cells) if (S.g[i]) have |= B(S.g[i]);
      let miss = P.full & ~have;
      while (miss) {
        const v = low(miss);
        miss &= miss - 1;
        let pos = -1, cnt = 0;
        for (const i of u.cells) if (!S.g[i] && (S.cand[i] & B(v))) { cnt++; pos = i; }
        if (cnt === 0) { S.bad = true; return []; }
        if (cnt === 1) { out.push({ tech: 'hidden', level: 1, place: [pos, v], unit: u.k }); if (!all) return out; }
      }
    }
    return out;
  }

  function findSingle(S, all) {
    const out = [];
    for (let i = 0; i < S.P.N; i++) {
      if (S.g[i]) continue;
      const m = S.cand[i];
      if (!m) { S.bad = true; return []; }
      if ((m & (m - 1)) === 0) { out.push({ tech: 'single', level: 1, place: [i, low(m)] }); if (!all) return out; }
    }
    return out;
  }

  function findNaked(S, all, k) {
    const P = S.P, out = [];
    for (const u of P.units) {
      const E = u.cells.filter((i) => !S.g[i]);
      if (E.length <= k) continue;
      const small = E.filter((i) => pop(S.cand[i]) <= k);
      if (small.length < k) continue;
      for (const cs of combos(small, k, 0, [], [])) {
        let m = 0;
        for (const i of cs) m |= S.cand[i];
        if (pop(m) !== k) continue;
        const elims = [];
        for (const j of E) if (cs.indexOf(j) < 0) for (const v of list(S.cand[j] & m)) elims.push([j, v]);
        if (elims.length) { out.push({ tech: 'naked' + k, level: k === 2 ? 2 : k === 3 ? 3 : 4, unit: u.k, cells: cs, mask: m, elims }); if (!all) return out; }
      }
    }
    return out;
  }

  function findHiddenSet(S, all, k) {
    const P = S.P, out = [];
    for (const u of P.units) {
      const E = u.cells.filter((i) => !S.g[i]);
      if (E.length <= k) continue;
      let have = 0;
      for (const i of u.cells) if (S.g[i]) have |= B(S.g[i]);
      const digits = list(P.full & ~have).filter((v) => {
        const c = E.filter((i) => S.cand[i] & B(v)).length;
        return c >= 2 && c <= k;
      });
      if (digits.length < k) continue;
      for (const ds of combos(digits, k, 0, [], [])) {
        const dm = ds.reduce((m, v) => m | B(v), 0);
        const cells = E.filter((i) => S.cand[i] & dm);
        if (cells.length !== k) continue;
        const elims = [];
        for (const i of cells) for (const v of list(S.cand[i] & ~dm)) elims.push([i, v]);
        if (elims.length) { out.push({ tech: 'hidden' + k, level: k === 2 ? 2 : k === 3 ? 3 : 4, unit: u.k, cells, mask: dm, elims }); if (!all) return out; }
      }
    }
    return out;
  }

  function findPointing(S, all) {
    const P = S.P, out = [];
    if (!P.units.some((u) => u.type === 'box' || u.type === 'diag')) return out;
    for (const u1 of P.units) {
      let have = 0;
      for (const i of u1.cells) if (S.g[i]) have |= B(S.g[i]);
      for (const v of list(P.full & ~have)) {
        const cs = u1.cells.filter((i) => !S.g[i] && (S.cand[i] & B(v)));
        if (cs.length < 2) continue;
        for (const k2 of P.unitsOf[cs[0]]) {
          if (k2 === u1.k) continue;
          if (!cs.every((i) => P.unitsOf[i].indexOf(k2) >= 0)) continue;
          const elims = P.units[k2].cells.filter((j) => !S.g[j] && (S.cand[j] & B(v)) && u1.cells.indexOf(j) < 0).map((j) => [j, v]);
          if (elims.length) { out.push({ tech: 'pointing', level: 2, v, unit: u1.k, unit2: k2, cells: cs, elims }); if (!all) return out; }
        }
      }
    }
    return out;
  }

  function findFish(S, all, k) {
    const P = S.P, n = P.n, out = [];
    for (let v = 1; v <= n; v++) {
      for (const base of ['row', 'col']) {
        const lines = [];
        for (let a = 0; a < n; a++) {
          let pos = 0, placed = false;
          for (let b = 0; b < n; b++) {
            const i = base === 'row' ? a * n + b : b * n + a;
            if (S.g[i] === v) { placed = true; break; }
            if (!S.g[i] && (S.cand[i] & B(v))) pos |= 1 << b;
          }
          if (placed) continue;
          const c = pop(pos);
          if (c >= 2 && c <= k) lines.push({ a, pos });
        }
        if (lines.length < k) continue;
        for (const ls of combos(lines, k, 0, [], [])) {
          let m = 0;
          for (const l of ls) m |= l.pos;
          if (pop(m) !== k) continue;
          const baseSet = ls.map((l) => l.a);
          const covers = [];
          for (let b = 0; b < n; b++) if (m & (1 << b)) covers.push(b);
          const elims = [];
          for (const b of covers) {
            for (let a = 0; a < n; a++) {
              if (baseSet.indexOf(a) >= 0) continue;
              const i = base === 'row' ? a * n + b : b * n + a;
              if (!S.g[i] && (S.cand[i] & B(v))) elims.push([i, v]);
            }
          }
          if (elims.length) { out.push({ tech: 'fish' + k, level: k === 2 ? 3 : 4, v, base, lines: baseSet, covers, elims }); if (!all) return out; }
        }
      }
    }
    return out;
  }

  function findXY(S, all) {
    const P = S.P, N = P.N, out = [];
    const bi = [];
    for (let i = 0; i < N; i++) if (!S.g[i] && pop(S.cand[i]) === 2) bi.push(i);
    for (const p of bi) {
      const pm = S.cand[p];
      const wings = bi.filter((a) => a !== p && P.peer[p * N + a] && pop(S.cand[a] & pm) === 1);
      for (let x = 0; x < wings.length; x++) {
        for (let y = x + 1; y < wings.length; y++) {
          const a = wings[x], b = wings[y];
          const za = S.cand[a] & ~pm, zb = S.cand[b] & ~pm;
          if (za !== zb || !za || (S.cand[a] & pm) === (S.cand[b] & pm)) continue;
          const z = low(za);
          const elims = [];
          for (let j = 0; j < N; j++) {
            if (j === a || j === b || j === p || S.g[j]) continue;
            if (P.peer[a * N + j] && P.peer[b * N + j] && (S.cand[j] & B(z))) elims.push([j, z]);
          }
          if (elims.length) { out.push({ tech: 'xywing', level: 4, pivot: p, wings: [a, b], v: z, elims }); if (!all) return out; }
        }
      }
    }
    return out;
  }

  function comboSets(cg, fills) {
    const seenSet = {};
    const out = [];
    for (const f of fills) {
      const key = f.slice().sort((a, b) => a - b).join(',');
      if (!seenSet[key]) { seenSet[key] = 1; out.push(f.slice().sort((a, b) => a - b)); }
    }
    return out;
  }

  function cageLevel(cg, sets) {
    if (cg.op === '=' || cg.cells.length <= 2 || sets.length === 1) return 1;
    if (sets.length <= 3) return 2;
    return 3;
  }

  function findCage(S, all, lvl) {
    const P = S.P, out = [];
    if (!P.cages) return out;
    for (const cg of P.cages) {
      if (cg.cells.every((i) => S.g[i])) continue;
      const fills = cageFills(P, cg, S.cand);
      if (!fills.length) { S.bad = true; return []; }
      const elims = [];
      cg.cells.forEach((i, j) => {
        if (S.g[i]) return;
        let u = 0;
        for (const f of fills) u |= B(f[j]);
        for (const v of list(S.cand[i] & ~u)) elims.push([i, v]);
      });
      if (!elims.length) continue;
      const sets = comboSets(cg, fills);
      const level = cageLevel(cg, sets);
      if (level > lvl) continue;
      out.push({ tech: 'cage', level, cage: cg.k, sets, fills: fills.length, elims });
      if (!all) return out;
    }
    return out;
  }

  function findCageMust(S, all) {
    const P = S.P, n = P.n, out = [];
    if (!P.cages) return out;
    for (const cg of P.cages) {
      if (cg.cells.length < 2 || cg.cells.every((i) => S.g[i])) continue;
      const fills = cageFills(P, cg, S.cand);
      if (!fills.length) { S.bad = true; return []; }
      const lines = [];
      cg.cells.forEach((i) => {
        const r = Math.floor(i / n), c = i % n;
        if (!lines.some((l) => l.t === 'row' && l.i === r)) lines.push({ t: 'row', i: r, k: r });
        if (!lines.some((l) => l.t === 'col' && l.i === c)) lines.push({ t: 'col', i: c, k: n + c });
      });
      for (let v = 1; v <= n; v++) {
        for (const l of lines) {
          const inLine = cg.cells.map((i) => (l.t === 'row' ? Math.floor(i / n) : i % n) === l.i);
          if (!fills.every((f) => f.some((x, j) => x === v && inLine[j]))) continue;
          const elims = P.units[l.k].cells.filter((j) => P.cageOf[j] !== cg.k && !S.g[j] && (S.cand[j] & B(v))).map((j) => [j, v]);
          if (elims.length) { out.push({ tech: 'cagemust', level: 2, cage: cg.k, v, unit: l.k, elims }); if (!all) return out; }
        }
      }
    }
    return out;
  }

  function findLt(S, all) {
    const P = S.P, out = [];
    P.lt.forEach((pr, k) => {
      if (out.length && !all) return;
      const a = pr[0], b = pr[1], ma = S.cand[a], mb = S.cand[b];
      if (!ma || !mb) return;
      const ea = ma & ~((1 << high(mb)) - 1);
      if (ea && !S.g[a]) { out.push({ tech: 'lt', level: 1, k, side: 'a', cell: a, other: b, bound: high(mb), elims: list(ea).map((v) => [a, v]) }); if (!all) return; }
      const eb = mb & ((2 << low(ma)) - 1);
      if (eb && !S.g[b]) { out.push({ tech: 'lt', level: 1, k, side: 'b', cell: b, other: a, bound: low(ma), elims: list(eb).map((v) => [b, v]) }); }
    });
    return all ? out : out.slice(0, 1);
  }

  function findEdge(S, all) {
    const P = S.P, n = P.n, out = [];
    if (!P.lines) return out;
    for (const ln of P.lines) {
      for (const [clue, side, cells] of [[ln.a, ln.sa, ln.cells], [ln.b, ln.sb, ln.cells.slice().reverse()]]) {
        if (!clue) continue;
        const elims = [];
        cells.forEach((i, k) => {
          if (S.g[i]) return;
          let allow;
          if (clue === 1) allow = k === 0 ? B(n) : P.full & ~B(n);
          else allow = P.full & ((2 << Math.min(n, n - clue + 1 + k)) - 1);
          for (const v of list(S.cand[i] & ~allow)) elims.push([i, v]);
        });
        if (elims.length) { out.push({ tech: 'edge', level: 1, line: P.lines.indexOf(ln), side, clue, elims }); if (!all) return out; }
      }
    }
    return out;
  }

  function lineLevel(cnt) { return cnt <= 6 ? 2 : cnt <= 30 ? 3 : 4; }

  function findLine(S, all, lvl) {
    const P = S.P, out = [];
    if (!P.lines) return out;
    P.lines.forEach((ln, li) => {
      if ((!ln.a && !ln.b) || (out.length && !all)) return;
      if (ln.cells.every((i) => S.g[i])) return;
      const r = lineFills(P, ln, S.cand, true);
      if (!r.count) { S.bad = true; return; }
      const elims = [];
      ln.cells.forEach((i, k) => { if (!S.g[i]) for (const v of list(S.cand[i] & ~r.union[k])) elims.push([i, v]); });
      if (!elims.length) return;
      const level = lineLevel(r.count);
      if (level > lvl) return;
      out.push({ tech: 'line', level, line: li, count: r.count, only: r.count === 1 ? r.found[0] : null, elims });
    });
    if (S.bad) return [];
    return all ? out : out.slice(0, 1);
  }

  /* The techniques, easiest first. lv = [level in Sudoku, level elsewhere].
   * Sudoku follows the familiar ladder: hidden singles in boxes (1), every
   * single (2), intersections and pairs (3), then the advanced ones —
   * triples, X-wings, XY-wings, quads, swordfish (4); needing two or more
   * advanced steps makes a Sudoku fiendish (see diffOf). The other kinds
   * have no boxes, so singles and their own plain rule are level 1, and so
   * on up to 4. */
  const TECHS = [
    { id: 'hiddenbox', lv: [1, 9], place: true, f: (S, a) => findHidden(S, a, true) },
    { id: 'hidden', lv: [2, 1], place: true, f: findHidden },
    { id: 'single', lv: [2, 1], place: true, f: findSingle },
    { id: 'lt', lv: [9, 1], f: findLt },
    { id: 'edge', lv: [9, 1], f: findEdge },
    { id: 'cage1', lv: [9, 1], f: (S, a) => findCage(S, a, 1) },
    { id: 'pointing', lv: [3, 2], f: findPointing },
    { id: 'naked2', lv: [3, 2], f: (S, a) => findNaked(S, a, 2) },
    { id: 'hidden2', lv: [3, 2], f: (S, a) => findHiddenSet(S, a, 2) },
    { id: 'cage2', lv: [9, 2], f: (S, a) => findCage(S, a, 2) },
    { id: 'cagemust', lv: [9, 2], f: findCageMust },
    { id: 'line2', lv: [9, 2], f: (S, a) => findLine(S, a, 2) },
    { id: 'naked3', lv: [4, 3], f: (S, a) => findNaked(S, a, 3) },
    { id: 'hidden3', lv: [4, 3], f: (S, a) => findHiddenSet(S, a, 3) },
    { id: 'fish2', lv: [4, 3], f: (S, a) => findFish(S, a, 2) },
    { id: 'cage3', lv: [9, 3], f: (S, a) => findCage(S, a, 3) },
    { id: 'line3', lv: [9, 3], f: (S, a) => findLine(S, a, 3) },
    { id: 'xywing', lv: [4, 4], f: findXY },
    { id: 'naked4', lv: [4, 4], f: (S, a) => findNaked(S, a, 4) },
    { id: 'hidden4', lv: [4, 4], f: (S, a) => findHiddenSet(S, a, 4) },
    { id: 'fish3', lv: [4, 4], f: (S, a) => findFish(S, a, 3) },
    { id: 'line4', lv: [9, 4], f: (S, a) => findLine(S, a, 4) }
  ];
  function techsFor(P) {
    if (P.techs) return P.techs;
    const k = P.kind === 'sudoku' ? 0 : 1;
    P.techs = TECHS.map((T) => ({ id: T.id, level: T.lv[k], place: T.place, f: T.f })).filter((T) => T.level < 9)
      .sort((a, b) => a.level - b.level || (b.place ? 1 : 0) - (a.place ? 1 : 0));
    return P.techs;
  }

  function nextStep(S, maxLevel, skipPlace) {
    for (const T of techsFor(S.P)) {
      if (T.level > maxLevel) break;
      if (skipPlace && T.place) continue;
      const r = T.f(S, false);
      if (S.bad) return null;
      if (r.length) { r[0].level = T.level; return r[0]; }
    }
    return null;
  }

  /* Solve without guessing. opts.maxLevel limits the techniques.
   * -> { solved, stuck, bad, level, counts: { tech: n }, hard: steps of level >= 2, S } */
  function logic(P, grid, opts) {
    opts = opts || {};
    const maxLevel = opts.maxLevel || 5;
    const S = start(P, grid || P.givens);
    const counts = {};
    let level = 0, hard = 0;
    const byLevel = [0, 0, 0, 0, 0, 0];
    while (!S.bad && S.left > 0) {
      const st = nextStep(S, maxLevel);
      if (!st) break;
      apply(S, st);
      counts[st.tech] = (counts[st.tech] || 0) + 1;
      byLevel[st.level]++;
      if (st.level > level) level = st.level;
      if (st.level >= 2) hard++;
    }
    return { solved: !S.bad && S.left === 0, stuck: !S.bad && S.left > 0, bad: S.bad, level: Math.max(1, level), counts, byLevel, hard, S };
  }

  /* The difficulty 1..5 from a logic() result. Sudoku: the level of the
   * hardest step, and 5 when two or more advanced steps are needed. The
   * others: the level, plus one for a 6 × 6 or 7 × 7 grid (plus two for a
   * 7 × 7 that needs level-3 steps): a big grid is more work. */
  function diffOf(P, r) {
    if (P.kind === 'sudoku') return r.level >= 4 ? (r.byLevel[4] >= 2 ? 5 : 4) : r.level;
    const n = P.n, bonus = n <= 5 ? 0 : n === 6 ? 1 : r.level >= 3 ? 2 : 1;
    return Math.min(5, r.level + bonus);
  }

  // the non-trivial steps a placement leans on directly
  function reasonsFor(S, st) {
    const i = st.place[0], v = st.place[1], out = new Set();
    let plain = 0;
    if (st.tech === 'single') {
      for (let u = 1; u <= S.P.n; u++) {
        if (u === v) continue;
        const w = S.why[i * 16 + u];
        if (w >= 0) out.add(w); else plain++;
      }
    } else {
      for (const j of S.P.units[st.unit].cells) {
        if (j === i || S.g[j]) continue;
        const w = S.why[j * 16 + v];
        if (w >= 0) out.add(w); else plain++;
      }
    }
    return { steps: Array.from(out).sort((a, b) => a - b), plain };
  }

  /* The next forced cell from a (correct) position, with the steps it needs.
   * -> { step, reasons, S } | { solved } | { stuck, S } | { bad, S } */
  function hintStep(P, grid) {
    const S = start(P, grid);
    if (S.bad) return { bad: true, S };
    let guard = 0;
    while (!S.bad && S.left > 0 && guard++ < 2000) {
      const places = findHidden(S, true).concat(findSingle(S, true));
      if (S.bad) return { bad: true, S };
      if (places.length) {
        let best = null, bestCost = 1e9, bestR = null;
        for (const st of places) {
          const r = reasonsFor(S, st);
          const u = st.unit != null ? P.units[st.unit] : null;
          let cost = r.steps.length * 10 + (st.tech === 'single' ? 3 : 0) + (u && u.type !== 'box' ? 1 : 0);
          // a one-cell cage is as plain as a printed digit
          if (r.steps.length === 1 && S.steps[r.steps[0]].tech === 'cage' && P.cages[S.steps[r.steps[0]].cage].op === '=') cost = 0.5;
          if (cost < bestCost) { bestCost = cost; best = st; bestR = r; }
        }
        return { step: best, reasons: bestR, S };
      }
      const st = nextStep(S, 5, true);
      if (!st) return S.bad ? { bad: true, S } : { stuck: true, S };
      apply(S, st);
    }
    if (S.bad) return { bad: true, S };
    return { solved: true, S };
  }

  /* ---------- steps in words ---------- */

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const an = (v) => (v === 8 || v === 11 || v === 18 ? 'an' : 'a');
  function cn(P, i) { return 'row ' + (Math.floor(i / P.n) + 1) + ', column ' + (i % P.n + 1); }
  function andList(a, word) {
    word = word || 'and';
    if (a.length <= 1) return a.join('');
    return a.slice(0, -1).join(', ') + ' ' + word + ' ' + a[a.length - 1];
  }
  function cellsIn(P, u, cells) {
    const U = P.units[u];
    if (U.type === 'row') return (cells.length > 1 ? 'columns ' : 'column ') + andList(cells.map((i) => String(i % P.n + 1)));
    if (U.type === 'col') return (cells.length > 1 ? 'rows ' : 'row ') + andList(cells.map((i) => String(Math.floor(i / P.n) + 1)));
    return andList(cells.map((i) => cn(P, i)));
  }
  function dirOf(P, from, to) {
    const n = P.n;
    if (to === from + 1) return 'to its right';
    if (to === from - 1) return 'to its left';
    if (to === from - n) return 'above it';
    if (to === from + n) return 'below it';
    return 'next to it';
  }
  function sideName(P, side, idx) {
    return { l: 'on the left of row ', r: 'on the right of row ', t: 'above column ', b: 'below column ' }[side] + (idx + 1);
  }
  function kindUnits(P) {
    const hasBox = P.units.some((u) => u.type === 'box'), hasDiag = P.units.some((u) => u.type === 'diag');
    return hasDiag ? 'row, column, box or diagonal' : hasBox ? 'row, column or box' : 'row or column';
  }
  function comboText(cg, set) {
    const s = cg.op === '-' || cg.op === '/' ? set.slice().reverse() : set;
    return s.join(OPS[cg.op] || '');
  }
  function cageName(P, cg) {
    return 'the **' + cageLabel(cg) + '** cage' + (cg.cells.length > 1 ? ' at ' + cn(P, cg.anchor) : '');
  }
  // what a step crosses out, in words
  function elimText(P, elims) {
    const by = new Map();
    elims.forEach((e) => { if (!by.has(e[0])) by.set(e[0], []); by.get(e[0]).push(e[1]); });
    const cells = Array.from(by.keys());
    const vs = new Set(elims.map((e) => e[1]));
    if (vs.size === 1 && cells.length > 1) {
      const v = elims[0][1];
      const units = P.units.filter((u) => u.type === 'row' || u.type === 'col');
      const same = units.find((u) => cells.every((i) => u.cells.indexOf(i) >= 0));
      if (same) return cellsIn(P, same.k, cells) + ' of ' + same.name + ' can\'t be ' + v;
      if (cells.length <= 3) return andList(cells.map((i) => cn(P, i))) + ' can\'t be ' + v;
      return cells.length + ' cells can\'t be ' + v;
    }
    const parts = cells.slice(0, 3).map((i) => cn(P, i) + ' can\'t be ' + andList(by.get(i).map(String), 'or'));
    if (cells.length > 3) parts.push('a few more candidates go too');
    return parts.join('; ');
  }

  function say(S, st) {
    const P = S.P, n = P.n;
    switch (st.tech) {
      case 'hidden': {
        const u = P.units[st.unit], i = st.place[0], v = st.place[1];
        const where = u.type === 'row' ? 'column ' + (i % n + 1) : u.type === 'col' ? 'row ' + (Math.floor(i / n) + 1) : cn(P, i);
        return 'In **' + u.name + '** the only place left for ' + an(v) + ' **' + v + '** is ' + where + '.';
      }
      case 'single': {
        const i = st.place[0], v = st.place[1];
        return '**' + cap(cn(P, i)) + '** can only be **' + v + '**.';
      }
      case 'naked2': case 'naked3': case 'naked4': {
        const u = P.units[st.unit], k = st.cells.length;
        const word = ['', '', 'a pair', 'a triple', 'a quad'][k];
        return 'In **' + u.name + '**, ' + cellsIn(P, st.unit, st.cells) + ' can only hold ' + andList(list(st.mask).map(String), 'or') +
          ' between them — *' + word + '* — so no other cell of ' + u.name + ' can be ' + andList(list(st.mask).map(String), 'or') + '.';
      }
      case 'hidden2': case 'hidden3': case 'hidden4': {
        const u = P.units[st.unit], k = st.cells.length;
        const word = ['', '', 'hidden pair', 'hidden triple', 'hidden quad'][k];
        return 'In **' + u.name + '** the digits ' + andList(list(st.mask).map(String)) + ' fit only in ' + cellsIn(P, st.unit, st.cells) +
          ' — a *' + word + '* — so those cells can hold nothing else.';
      }
      case 'pointing': {
        const u1 = P.units[st.unit], u2 = P.units[st.unit2];
        return 'In **' + u1.name + '** every place for ' + an(st.v) + ' **' + st.v + '** lies in ' + u2.name + ', so the rest of ' + u2.name + ' can\'t have ' + an(st.v) + ' ' + st.v + '.';
      }
      case 'fish2': case 'fish3': {
        const name = st.tech === 'fish2' ? 'X-wing' : 'Swordfish';
        const bw = st.base === 'row' ? 'rows' : 'columns', cw = st.base === 'row' ? 'columns' : 'rows';
        return '*' + name + '* on **' + st.v + '**: in ' + bw + ' ' + andList(st.lines.map((a) => String(a + 1))) + ' the ' + st.v + 's can only go in ' + cw + ' ' +
          andList(st.covers.map((b) => String(b + 1))) + ', so no other cell of those ' + cw + ' can be ' + st.v + '.';
      }
      case 'xywing': {
        const p = st.pivot, a = st.wings[0], b = st.wings[1], z = st.v;
        const pm = list(S.cand[p]);
        const xa = low(S.cand[a] & S.cand[p]), xb = low(S.cand[b] & S.cand[p]);
        return '*XY-wing*: ' + cn(P, p) + ' is ' + pm[0] + ' or ' + pm[1] + '. If it is ' + xa + ', then ' + cn(P, a) + ' is ' + z + '; if it is ' + xb + ', then ' + cn(P, b) +
          ' is ' + z + '. Either way one of them is ' + z + ', so ' + elimText(P, st.elims) + '.';
      }
      case 'cage': {
        const cg = P.cages[st.cage];
        if (cg.op === '=') return 'The one-cell cage at ' + cn(P, cg.cells[0]) + ' says **' + cg.t + '**.';
        const sets = st.sets;
        const what = sets.length <= 4 ? 'can only be ' + andList(sets.map((s) => comboText(cg, s)), 'or') : 'has only a few ways to make ' + cageLabel(cg);
        return cap(cageName(P, cg)) + ' ' + what + ' — so ' + elimText(P, st.elims) + '.';
      }
      case 'cagemust': {
        const cg = P.cages[st.cage], u = P.units[st.unit];
        return 'Every way to fill ' + cageName(P, cg) + ' puts ' + an(st.v) + ' **' + st.v + '** in ' + u.name + ', so no other cell of ' + u.name + ' can be ' + st.v + '.';
      }
      case 'lt': {
        const vs = andList(st.elims.map((e) => String(e[1])), 'or');
        const o = st.other, known = S.g[o];
        if (st.side === 'a') return '**' + cap(cn(P, st.cell)) + '** is smaller than the cell ' + dirOf(P, st.cell, o) + (known ? ', which is ' + known : ', which is at most ' + st.bound) + ' — so it can\'t be ' + vs + '.';
        return '**' + cap(cn(P, st.cell)) + '** is bigger than the cell ' + dirOf(P, st.cell, o) + (known ? ', which is ' + known : ', which is at least ' + st.bound) + ' — so it can\'t be ' + vs + '.';
      }
      case 'edge': {
        const ln = P.lines[st.line], c = st.clue, where = 'The clue **' + c + '** ' + sideName(P, st.side, ln.idx);
        if (c === 1) return where + ': only one building is in view, so the tallest, **' + n + '**, stands right next to it.';
        if (c === n) return where + ': all ' + n + ' are in view, so they rise 1, 2, 3 … from that side.';
        const lim = [];
        for (let k = 0; k < n && n - c + 1 + k < n && lim.length < 3; k++) lim.push((k === 0 ? 'the first can be at most ' : k === 1 ? 'the second at most ' : 'the third at most ') + (n - c + 1 + k));
        return where + ': with ' + c + ' buildings in view, the tall ones can\'t stand too near that edge — ' + andList(lim) + '.';
      }
      case 'line': {
        const ln = P.lines[st.line];
        const clues = [ln.a, ln.b].filter(Boolean).length;
        const intro = st.count === 1 ? 'Only one way to fill **' + ln.name + '** fits' : 'Only ' + st.count + ' ways to fill **' + ln.name + '** fit';
        const tail = st.only ? ': ' + st.only.join(' ') + '.' : ', and in all of them ' + elimText(P, st.elims) + '.';
        return intro + ' ' + (clues > 1 ? 'its clues' : 'its clue') + ' and the digits already there' + tail;
      }
      default: return '';
    }
  }

  C.Latin = Object.assign(C.Latin || {}, { B, pop, low, high, list, seq, parseGrid, gridStr, OPS, build, seen, cageValue, cageLabel, problems, cageFills, lineFills, propagate, count, dlxCount, initCand,
    start, place, apply, logic, hintStep, reasonsFor, say, cn, andList, cellsIn, kindUnits, an, TECHS, diffOf });
})(typeof window !== 'undefined' ? window : globalThis);
