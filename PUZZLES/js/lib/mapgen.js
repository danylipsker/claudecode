/* The Puzzle Cabinet · js/lib/mapgen.js
 *
 * Maps to colour, and the reasoning about colouring them (no page code).
 *
 *   Maps are polygons that meet edge to edge: every stretch of border is an
 *   edge between two vertices that both neighbouring regions share, so two
 *   regions are neighbours exactly when they share an edge — touching at a
 *   corner does not count.
 *
 *   Data forms:  { g: [w, h, 'cells'] }                grid maps (one character per cell = region)
 *                { pts: [x0, y0, x1, y1, …], R: [[i, j, k, …, -1, …], …] }   polygon maps (-1 starts a hole)
 *
 *   Cabinet.MapGen.build(d)              -> { P, loops, edges, adj, n, bbox }
 *   Cabinet.MapGen.search(adj, k, fixed, limit)   colourings (count up to limit, first ones found)
 *   Cabinet.MapGen.grade(adj, k, fixed)  how hard it is to reason out (1 singles … 4 trial, 5 stuck)
 *   Cabinet.MapGen.oddWheel(adj)         a region ringed by an odd cycle of neighbours (needs 4 colours)
 *   generators: grid, voronoi, island, radial, glass, lines
 */
(function (root) {
  'use strict';
  const C = root.Cabinet = root.Cabinet || {};
  const B62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const GRID_CELL = 60;

  /* ---------- the map from its data ---------- */

  function build(d) {
    let P, loops;
    if (d.g) {
      const [w, h, cells] = d.g;
      const nReg = Math.max(...cells.split('').map((c) => B62.indexOf(c))) + 1;
      P = [];
      for (let y = 0; y <= h; y++) for (let x = 0; x <= w; x++) P.push([x * GRID_CELL, y * GRID_CELL]);
      const V = (x, y) => y * (w + 1) + x;
      const reg = (x, y) => (x < 0 || y < 0 || x >= w || y >= h ? -1 : B62.indexOf(cells[y * w + x]));
      loops = [];
      for (let r = 0; r < nReg; r++) {
        // the boundary edges of the region, clockwise on screen
        const out = new Map();
        const addE = (a, b) => { (out.get(a) || out.set(a, []).get(a)).push(b); };
        for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
          if (reg(x, y) !== r) continue;
          if (reg(x, y - 1) !== r) addE(V(x, y), V(x + 1, y));
          if (reg(x + 1, y) !== r) addE(V(x + 1, y), V(x + 1, y + 1));
          if (reg(x, y + 1) !== r) addE(V(x + 1, y + 1), V(x, y + 1));
          if (reg(x - 1, y) !== r) addE(V(x, y + 1), V(x, y));
        }
        const L = [];
        for (const [start] of out) {
          while (out.get(start) && out.get(start).length) {
            const loop = [];
            let v = start;
            do {
              loop.push(v);
              const nx = out.get(v);
              const u = nx.pop();
              if (!nx.length) out.delete(v);
              v = u;
            } while (v !== start && out.has(v));
            L.push(loop);
          }
        }
        loops.push(L);
      }
    } else {
      P = [];
      for (let i = 0; i + 1 < d.pts.length; i += 2) P.push([d.pts[i], d.pts[i + 1]]);
      loops = d.R.map((flat) => {
        const L = [[]];
        flat.forEach((v) => { if (v < 0) L.push([]); else L[L.length - 1].push(v); });
        return L.filter((l) => l.length >= 3);
      });
    }
    const n = loops.length;
    const emap = new Map();
    loops.forEach((L, r) => L.forEach((loop) => loop.forEach((a, i) => {
      const b = loop[(i + 1) % loop.length];
      if (a === b) return;
      const key = a < b ? a + ',' + b : b + ',' + a;
      let e = emap.get(key);
      if (!e) emap.set(key, e = { a: Math.min(a, b), b: Math.max(a, b), r: [] });
      if (!e.r.includes(r)) e.r.push(r);
    })));
    const edges = Array.from(emap.values());
    const adjS = loops.map(() => new Set());
    let bad = null;
    edges.forEach((e) => {
      if (e.r.length > 2) bad = 'an edge is shared by ' + e.r.length + ' regions';
      if (e.r.length === 2) { adjS[e.r[0]].add(e.r[1]); adjS[e.r[1]].add(e.r[0]); }
    });
    const adj = adjS.map((s) => Array.from(s).sort((x, y) => x - y));
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    P.forEach((p) => { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
    return { P, loops, edges, adj, n, bbox: { x0, y0, x1, y1 }, err: bad };
  }

  function connected(adj) {
    if (!adj.length) return true;
    const seen = new Uint8Array(adj.length);
    const st = [0];
    seen[0] = 1;
    let c = 1;
    while (st.length) { const v = st.pop(); for (const u of adj[v]) if (!seen[u]) { seen[u] = 1; c++; st.push(u); } }
    return c === adj.length;
  }

  /* ---------- colouring: search ---------- */

  const pop = (m) => { let c = 0; while (m) { m &= m - 1; c++; } return c; };

  /* every colouring with colours 0..k-1 that keeps `fixed` (array of colour or -1), up to `limit`.
   * opts.order: a permutation of the colours to try (for random solutions); opts.nodeLimit */
  function search(adj, k, fixed, limit, opts) {
    opts = opts || {};
    const n = adj.length, full = (1 << k) - 1;
    const col = new Int8Array(n).fill(-1), dom = new Uint8Array(n).fill(full);
    const sols = [];
    let nodes = 0, aborted = false;
    const order = opts.order || [0, 1, 2, 3, 4].slice(0, k);
    const assign = (v, c, trail) => {
      col[v] = c;
      for (const u of adj[v]) {
        if (col[u] < 0 && (dom[u] & (1 << c))) { dom[u] &= ~(1 << c); trail.push(u); if (!dom[u]) return false; }
        else if (col[u] === c) return false;
      }
      return true;
    };
    const init = [];
    for (let v = 0; v < n; v++) {
      const c = fixed ? fixed[v] : -1;
      if (c == null || c < 0) continue;
      if (c >= k || !(dom[v] & (1 << c))) return { count: 0, sols, nodes };
      if (!assign(v, c, init)) return { count: 0, sols, nodes };
    }
    const rr = opts.rng;
    // with a random source: random tie-breaks and a fresh colour order at every step (varied solutions)
    const deg = adj.map((a) => a.length + (rr ? rr() * 0.9 : 0));
    function rec() {
      if (++nodes > (opts.nodeLimit || 2e6)) { aborted = true; return true; }
      let best = -1, bs = 99, bd = -1;
      for (let v = 0; v < n; v++) {
        if (col[v] >= 0) continue;
        const s = pop(dom[v]);
        if (s === 0) return false;
        if (s < bs || (s === bs && deg[v] > bd)) { bs = s; bd = deg[v]; best = v; }
      }
      if (best < 0) { sols.push(Array.from(col)); return sols.length >= limit; }
      let ord = order;
      if (rr) { ord = order.slice(); for (let i = ord.length - 1; i > 0; i--) { const j = Math.floor(rr() * (i + 1)); const t = ord[i]; ord[i] = ord[j]; ord[j] = t; } }
      for (const c of ord) {
        if (!(dom[best] & (1 << c))) continue;
        const trail = [];
        const ok = assign(best, c, trail);
        if (ok && rec()) return true;
        trail.forEach((u) => { dom[u] |= 1 << c; });
        col[best] = -1;
      }
      return false;
    }
    rec();
    return { count: sols.length, sols, nodes, aborted };
  }

  const colourable = (adj, k, fixed) => search(adj, k, fixed, 1).count > 0;
  function unique(adj, k, fixed) {
    const r = search(adj, k, fixed, 2);
    return { unique: r.count === 1 && !r.aborted, count: r.count, sols: r.sols, aborted: r.aborted };
  }

  /* ---------- colouring: reasoning like a person ----------
   * 1 singles: a region with one colour left takes it
   * 2 pairs: two touching regions that can only be the same two colours rule those colours
   *   out of every region touching both (and three regions with three colours likewise)
   * 3 trial: suppose a colour, follow the singles; if something is left with no colour, it was wrong
   * returns { solved, level (highest used), trials, steps } */
  function grade(adj, k, fixed, opts) {
    opts = opts || {};
    const n = adj.length, full = (1 << k) - 1;
    let dom = new Uint8Array(n).fill(full);
    for (let v = 0; v < n; v++) if (fixed && fixed[v] >= 0) dom[v] = 1 << fixed[v];
    const steps = [];
    let level = 0, trials = 0;
    const adjSet = adj.map((a) => new Set(a));
    // settle: a decided region's colour is struck off all its neighbours, and so on (false: a contradiction)
    function settle(D, log) {
      const q = [];
      for (let v = 0; v < n; v++) { if (!D[v]) return false; if (pop(D[v]) === 1) q.push(v); }
      for (let qi = 0; qi < q.length; qi++) {
        const v = q[qi];
        for (const u of adj[v]) {
          if (!(D[u] & D[v])) continue;
          D[u] &= ~D[v];
          if (!D[u]) return false;
          if (pop(D[u]) === 1) { q.push(u); if (log) log.push({ t: 1, v: u, c: D[u] }); }
        }
      }
      return true;
    }
    function pairs(D) {
      // cliques of 2 or 3 whose colours are exactly as many as the clique
      let did = false;
      for (let u = 0; u < n; u++) {
        if (pop(D[u]) < 2) continue;
        for (const v of adj[u]) {
          if (v <= u || pop(D[v]) < 2) continue;
          const U2 = D[u] | D[v];
          if (pop(U2) === 2) {
            for (const w of adj[u]) if (w !== v && adjSet[v].has(w) && (D[w] & U2) && pop(D[w]) > 1) { D[w] &= ~U2; did = true; steps.push({ t: 2, v: w, by: [u, v] }); }
          }
          for (const w of adj[u]) {
            if (w <= v || !adjSet[v].has(w) || pop(D[w]) < 2) continue;
            const U3 = U2 | D[w];
            if (pop(U3) !== 3 || k <= 3) continue;
            for (const x of adj[u]) if (x !== v && x !== w && adjSet[v].has(x) && adjSet[w].has(x) && (D[x] & U3) && pop(D[x]) > 1) { D[x] &= ~U3; did = true; steps.push({ t: 2, v: x, by: [u, v, w] }); }
          }
        }
      }
      return did;
    }
    if (!settle(dom)) return { solved: false, level: 9, trials, steps, contradiction: true };
    for (let guard = 0; guard < 500; guard++) {
      if (dom.every((m) => pop(m) === 1)) return { solved: true, level: Math.max(1, level), trials, steps };
      const before = dom.join(',');
      const log = [];
      // singles are what settle() already did; pairs next
      if (pairs(dom)) { level = Math.max(level, 2); if (!settle(dom, log)) return { solved: false, level: 9, trials, steps }; continue; }
      // trial: one supposition, followed through with singles and pairs
      let did = false;
      for (let v = 0; v < n && !did; v++) {
        if (pop(dom[v]) < 2) continue;
        for (let c = 0; c < k; c++) {
          if (!(dom[v] & (1 << c))) continue;
          const D = Uint8Array.from(dom);
          D[v] = 1 << c;
          let ok = settle(D);
          if (ok) { for (let g2 = 0; g2 < 6 && ok; g2++) { if (!pairsQuiet(D)) break; ok = settle(D); } }
          if (!ok) { dom[v] &= ~(1 << c); did = true; trials++; steps.push({ t: 3, v, not: c }); break; }
        }
      }
      if (did) { level = Math.max(level, 3); if (!settle(dom)) return { solved: false, level: 9, trials, steps }; continue; }
      if (dom.join(',') === before) return { solved: false, level: 5, trials, steps };
    }
    return { solved: false, level: 5, trials, steps };
    function pairsQuiet(D) {
      let did = false;
      for (let u = 0; u < n; u++) {
        if (pop(D[u]) !== 2) continue;
        for (const v of adj[u]) {
          if (v <= u || D[v] !== D[u]) continue;
          for (const w of adj[u]) if (w !== v && adjSet[v].has(w) && (D[w] & D[u]) && pop(D[w]) > 1) { D[w] &= ~D[u]; did = true; }
        }
      }
      return did;
    }
  }

  /* ---------- odd wheels ----------
   * a region whose neighbours contain an odd cycle (each touching the next): the cycle needs three
   * colours and the hub touches all of them, so the map needs four. Returns the smallest found. */
  function oddWheel(adj) {
    let best = null;
    for (let h = 0; h < adj.length; h++) {
      const N = adj[h], inN = new Set(N);
      // breadth-first 2-colouring of the neighbourhood; an edge inside one layer parity closes an odd cycle
      const side = new Map(), par = new Map(), depth = new Map();
      for (const s0 of N) {
        if (side.has(s0)) continue;
        side.set(s0, 0); par.set(s0, -1); depth.set(s0, 0);
        const q = [s0];
        for (let qi = 0; qi < q.length; qi++) {
          const v = q[qi];
          for (const u of adj[v]) {
            if (!inN.has(u)) continue;
            if (!side.has(u)) { side.set(u, 1 - side.get(v)); par.set(u, v); depth.set(u, depth.get(v) + 1); q.push(u); }
            else if (side.get(u) === side.get(v)) {
              // the cycle: v up to the common ancestor, then down to u
              const pa = [], pb = [];
              let x = v, y = u;
              while (depth.get(x) > depth.get(y)) { pa.push(x); x = par.get(x); }
              while (depth.get(y) > depth.get(x)) { pb.push(y); y = par.get(y); }
              while (x !== y) { pa.push(x); pb.push(y); x = par.get(x); y = par.get(y); }
              const cyc = pa.concat([x], pb.reverse());
              if (cyc.length % 2 === 1 && (!best || cyc.length < best.ring.length || (cyc.length === best.ring.length && N.length < adj[best.hub].length))) best = { hub: h, ring: cyc };
            }
          }
        }
      }
    }
    return best;
  }

  /* ---------- making a puzzle: pre-coloured regions that leave one colouring ---------- */

  function randomColouring(adj, k, rng) {
    const r = search(adj, k, null, 1, { rng, nodeLimit: 2e5 });
    return r.count ? r.sols[0] : null;
  }

  // the best of several tries: a colouring and the fewest givens that pin it down
  function bestUnique(adj, k, rng, tries) {
    let best = null;
    for (let t = 0; t < (tries || 6); t++) {
      const sol = randomColouring(adj, k, rng);
      if (!sol) return null;
      const giv = makeUnique(adj, k, sol, rng);
      if (giv && (!best || giv.length < best.giv.length)) best = { sol, giv };
    }
    return best;
  }

  // givens [[region, colour]…] so that the colouring `sol` is the only one; then as few as possible
  function makeUnique(adj, k, sol, rng, opts) {
    opts = opts || {};
    const n = adj.length;
    const fixed = new Int8Array(n).fill(-1);
    const giv = [];
    for (let guard = 0; guard < n + 5; guard++) {
      const r = search(adj, k, fixed, 2, { nodeLimit: 4e5 });
      if (r.aborted) return null;
      if (r.count === 1) break;
      const other = r.sols.find((s) => s.some((c, v) => c !== sol[v]));
      if (!other) break;
      const diff = [];
      for (let v = 0; v < n; v++) if (other[v] !== sol[v] && fixed[v] < 0) diff.push(v);
      if (!diff.length) return null;
      // prefer a region with many neighbours among those that differ (it settles more)
      diff.sort((a, b) => adj[b].length - adj[a].length);
      const v = rng() < 0.6 ? diff[Math.floor(rng() * Math.min(3, diff.length))] : diff[Math.floor(rng() * diff.length)];
      fixed[v] = sol[v];
      giv.push(v);
    }
    // take away every given that is not needed
    const order = giv.slice();
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = order[i]; order[i] = order[j]; order[j] = t; }
    for (const v of order) {
      fixed[v] = -1;
      const r = search(adj, k, fixed, 2, { nodeLimit: 4e5 });
      if (r.aborted || r.count !== 1) fixed[v] = sol[v];
    }
    const out = [];
    for (let v = 0; v < n; v++) if (fixed[v] >= 0) out.push([v, fixed[v]]);
    return out;
  }

  /* ---------- map generators (all return data objects) ---------- */

  // polyomino countries on a w × h grid
  function gridMap(rng, w, h, nReg) {
    for (let tries = 0; tries < 40; tries++) {
      const cell = new Int16Array(w * h).fill(-1);
      const seeds = [];
      while (seeds.length < nReg) {
        const c = Math.floor(rng() * w * h);
        if (cell[c] >= 0) continue;
        cell[c] = seeds.length;
        seeds.push(c);
      }
      const size = new Array(nReg).fill(1);
      let left = w * h - nReg;
      let stall = 0;
      while (left > 0 && stall < 20000) {
        // grow a small region more often than a large one
        let r = Math.floor(rng() * nReg);
        const r2 = Math.floor(rng() * nReg);
        if (size[r2] < size[r]) r = r2;
        const frontier = [];
        for (let i = 0; i < w * h; i++) {
          if (cell[i] !== r) continue;
          const x = i % w, y = (i - x) / w;
          if (x > 0 && cell[i - 1] < 0) frontier.push(i - 1);
          if (x < w - 1 && cell[i + 1] < 0) frontier.push(i + 1);
          if (y > 0 && cell[i - w] < 0) frontier.push(i - w);
          if (y < h - 1 && cell[i + w] < 0) frontier.push(i + w);
        }
        if (!frontier.length) { stall++; continue; }
        const c = frontier[Math.floor(rng() * frontier.length)];
        cell[c] = r; size[r]++; left--;
      }
      if (left > 0 || size.some((s) => s < 2)) continue;
      const d = { g: [w, h, Array.from(cell, (c) => B62[c]).join('')] };
      const M = build(d);
      if (M.err || !connected(M.adj)) continue;
      return d;
    }
    return null;
  }

  // a grid map that three colours can colour: merge away odd wheels until none is left
  function gridMap3(rng, w, h, nStart, nMin) {
    for (let tries = 0; tries < 30; tries++) {
      let d = gridMap(rng, w, h, nStart);
      if (!d) continue;
      for (let guard = 0; guard < nStart; guard++) {
        const M = build(d);
        if (M.n < nMin) break;
        if (colourable(M.adj, 3)) return d;
        const wh = oddWheel(M.adj);
        let a, b;
        if (wh) { a = wh.hub; b = wh.ring[Math.floor(rng() * wh.ring.length)]; }
        else { a = Math.floor(rng() * M.n); if (!M.adj[a].length) break; b = M.adj[a][Math.floor(rng() * M.adj[a].length)]; }
        d = mergeGrid(d, Math.min(a, b), Math.max(a, b));
      }
    }
    return null;
  }
  function mergeGrid(d, a, b) {
    const [w, h, cells] = d.g;
    const out = cells.split('').map((ch) => {
      let r = B62.indexOf(ch);
      if (r === b) r = a;
      else if (r > b) r--;
      return B62[r];
    }).join('');
    return { g: [w, h, out] };
  }

  // Voronoi countries in a rectangle (optionally only those inside an island's coast)
  function clipHalf(poly, a, b, c) {
    // keep points with a*x + b*y <= c
    const out = [];
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length];
      const sp = a * p[0] + b * p[1] - c, sq = a * q[0] + b * q[1] - c;
      if (sp <= 0) out.push(p);
      if ((sp < 0 && sq > 0) || (sp > 0 && sq < 0)) {
        const t = sp / (sp - sq);
        out.push([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t]);
      }
    }
    return out;
  }
  function voronoiCells(sites, W, H) {
    return sites.map((s, i) => {
      let poly = [[0, 0], [W, 0], [W, H], [0, H]];
      for (let j = 0; j < sites.length && poly.length; j++) {
        if (j === i) continue;
        const t = sites[j];
        const a = t[0] - s[0], b = t[1] - s[1];
        const c = (t[0] * t[0] + t[1] * t[1] - s[0] * s[0] - s[1] * s[1]) / 2;
        poly = clipHalf(poly, a, b, c);
      }
      return poly;
    });
  }
  function centroid(poly) {
    let a = 0, cx = 0, cy = 0;
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length], cr = p[0] * q[1] - q[0] * p[1];
      a += cr; cx += (p[0] + q[0]) * cr; cy += (p[1] + q[1]) * cr;
    }
    if (Math.abs(a) < 1e-9) return poly[0].slice();
    return [cx / (3 * a), cy / (3 * a)];
  }
  // polygons (float) -> conforming integer data; keep: which polygons become regions
  function toData(polys, keep, tol) {
    tol = tol || 1.5;
    const pts = [], R = [];
    const grid = new Map();
    const key = (x, y) => Math.floor(x / 8) + ',' + Math.floor(y / 8);
    const idOf = (p) => {
      const gx = Math.floor(p[0] / 8), gy = Math.floor(p[1] / 8);
      for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) {
        const l = grid.get((gx + dx) + ',' + (gy + dy));
        if (l) for (const i of l) if (Math.hypot(pts[i][0] - p[0], pts[i][1] - p[1]) <= tol) return i;
      }
      pts.push([p[0], p[1]]);
      const k = key(p[0], p[1]);
      (grid.get(k) || grid.set(k, []).get(k)).push(pts.length - 1);
      return pts.length - 1;
    };
    polys.forEach((poly, i) => {
      if (keep && !keep[i]) return;
      const loop = [];
      poly.forEach((p) => { const id = idOf(p); if (loop[loop.length - 1] !== id) loop.push(id); });
      while (loop.length > 1 && loop[0] === loop[loop.length - 1]) loop.pop();
      R.push(loop);
    });
    const flat = [];
    pts.forEach((p) => flat.push(Math.round(p[0]), Math.round(p[1])));
    return { pts: flat, R };
  }
  function sitesIn(rng, n, W, H, minD) {
    const s = [];
    for (let t = 0; s.length < n && t < n * 400; t++) {
      const p = [W * (0.02 + 0.96 * rng()), H * (0.02 + 0.96 * rng())];
      if (s.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) >= minD)) s.push(p);
    }
    return s;
  }
  function relax(sites, W, H, times) {
    for (let t = 0; t < times; t++) sites = voronoiCells(sites, W, H).map((c) => (c.length ? centroid(c) : [W / 2, H / 2]));
    return sites;
  }
  function minEdge(d) {
    const M = build(d);
    let m = Infinity;
    M.edges.forEach((e) => { const p = M.P[e.a], q = M.P[e.b]; m = Math.min(m, Math.hypot(p[0] - q[0], p[1] - q[1])); });
    return { M, m };
  }
  function voronoiMap(rng, n, W, H) {
    W = W || 1000; H = H || 680;
    for (let tries = 0; tries < 30; tries++) {
      let sites = sitesIn(rng, n, W, H, Math.sqrt(W * H / n) * 0.5);
      if (sites.length < n) continue;
      sites = relax(sites, W, H, 2);
      const d = toData(voronoiCells(sites, W, H), null, 11);
      d.wob = 1;
      const { M, m } = minEdge(d);
      if (M.err || m < 10 || M.n !== n || M.loops.some((L) => !L.length) || !connected(M.adj)) continue;
      return d;
    }
    return null;
  }
  function islandMap(rng, n, W, H) {
    W = W || 1000; H = H || 700;
    for (let tries = 0; tries < 40; tries++) {
      const total = Math.round(n * 2.1);
      let sites = sitesIn(rng, total, W, H, Math.sqrt(W * H / total) * 0.55);
      sites = relax(sites, W, H, 2);
      const cells = voronoiCells(sites, W, H);
      const a1 = rng() * 6.3, a2 = rng() * 6.3, a3 = rng() * 6.3;
      const cx = W / 2, cy = H / 2, R0 = Math.min(W, H) * 0.44;
      const inside = (p) => {
        const dx = (p[0] - cx) / (W / H), dy = p[1] - cy, th = Math.atan2(dy, dx);
        const r = R0 * (1 + 0.16 * Math.sin(2 * th + a1) + 0.1 * Math.sin(3 * th + a2) + 0.07 * Math.sin(5 * th + a3));
        return Math.hypot(dx, dy) < r;
      };
      const keep = sites.map((s, i) => inside(s) && cells[i].every((p) => p[0] > 1 && p[1] > 1 && p[0] < W - 1 && p[1] < H - 1));
      // sort the kept cells by distance from the middle and keep n of them that hang together
      const order = sites.map((s, i) => i).filter((i) => keep[i]).sort((i, j) => Math.hypot(sites[i][0] - cx, sites[i][1] - cy) - Math.hypot(sites[j][0] - cx, sites[j][1] - cy));
      if (order.length < n) continue;
      const k2 = new Array(sites.length).fill(false);
      order.slice(0, n).forEach((i) => { k2[i] = true; });
      const d = toData(cells, k2, 11);
      d.wob = 1; d.sea = 1;
      const { M, m } = minEdge(d);
      if (M.err || m < 10 || M.n !== n || M.loops.some((L) => !L.length) || !connected(M.adj)) continue;
      return d;
    }
    return null;
  }

  // rings of sectors round a middle disc: rings = [{ n, off }], radii from the middle out
  function radialMap(rings, radii, opts) {
    opts = opts || {};
    const cx = opts.cx || 400, cy = opts.cy || 400;
    const pts = [], idx = new Map();
    const P = (r, a) => {
      const key = r + ':' + Math.round(a * 1000);
      if (idx.has(key)) return idx.get(key);
      const rad = (a - 90) * Math.PI / 180;
      pts.push([cx + r * Math.cos(rad), cy + r * Math.sin(rad)]);
      idx.set(key, pts.length - 1);
      return pts.length - 1;
    };
    // the angles used on each circle: the sector boundaries of the rings on both sides, and a fine step for roundness
    const circleAngles = radii.map((r, i) => {
      const set = new Set();
      for (let a = 0; a < 360; a += 7.5) set.add(Math.round(a * 1000) / 1000);
      [rings[i - 1], rings[i]].forEach((rg) => { if (rg) for (let s = 0; s < rg.n; s++) set.add(Math.round(((rg.off || 0) + s * 360 / rg.n) % 360 * 1000) / 1000); });
      return Array.from(set).sort((x, y) => x - y);
    });
    const R = [];
    // the middle disc (radii[0]) unless rings[0] is a full ring from the centre
    if (!opts.noCentre) R.push(circleAngles[0].map((a) => P(radii[0], a)));
    rings.forEach((rg, i) => {
      const rIn = radii[i], rOut = radii[i + 1];
      const r3 = (v) => Math.round(v * 1000) / 1000;
      for (let s = 0; s < rg.n; s++) {
        const raw = ((rg.off || 0) + s * 360 / rg.n) % 360;
        const a0 = r3(raw), a1 = r3(raw + 360 / rg.n);
        const lift = (a) => (a < a0 - 1e-6 ? a + 360 : a);
        const inRange = (list) => list.map(lift).filter((b) => b >= a0 - 1e-6 && b <= a1 + 1e-6).sort((x, y) => x - y);
        const outer = inRange(circleAngles[i + 1]).map((a) => P(rOut, a % 360));
        const inner = inRange(circleAngles[i]).reverse().map((a) => P(rIn, a % 360));
        R.push(outer.concat(inner));
      }
    });
    const flat = [];
    pts.forEach((p) => flat.push(Math.round(p[0]), Math.round(p[1])));
    return { pts: flat, R, round: 1 };
  }

  // convex regions cut by straight lines. whole: every line runs right across (a line arrangement: two colours do)
  function glassMap(rng, nCuts, whole, W, H, frame) {
    W = W || 900; H = H || 640;
    const P = [], regs = [];
    const add = (p) => { P.push(p); return P.length - 1; };
    if (frame === 'oct') {
      const c = 150;
      regs.push([add([c, 0]), add([W - c, 0]), add([W, c]), add([W, H - c]), add([W - c, H]), add([c, H]), add([0, H - c]), add([0, c])]);
    } else regs.push([add([0, 0]), add([W, 0]), add([W, H]), add([0, H])]);
    const area = (loop) => { let a = 0; loop.forEach((v, i) => { const p = P[v], q = P[loop[(i + 1) % loop.length]]; a += p[0] * q[1] - q[0] * p[1]; }); return Math.abs(a) / 2; };
    function insertInNeighbour(r, u, v, x) {
      // the region that has the edge v -> u (or u -> v) gets x between them
      for (let q = 0; q < regs.length; q++) {
        if (q === r) continue;
        const L = regs[q];
        for (let i = 0; i < L.length; i++) {
          const a = L[i], b = L[(i + 1) % L.length];
          if ((a === v && b === u) || (a === u && b === v)) { L.splice(i + 1, 0, x); return; }
        }
      }
    }
    function split(r, p0, dir) {
      const L = regs[r], eps = 1e-6;
      const sd = L.map((v) => dir[0] * (P[v][1] - p0[1]) - dir[1] * (P[v][0] - p0[0]));
      if (sd.every((s) => s >= -eps) || sd.every((s) => s <= eps)) return false;
      const A = [], Bv = [];
      for (let i = 0; i < L.length; i++) {
        const u = L[i], v = L[(i + 1) % L.length], su = sd[i], sv = sd[(i + 1) % L.length];
        if (su >= -eps) A.push(u);
        if (su <= eps) Bv.push(u);
        if ((su > eps && sv < -eps) || (su < -eps && sv > eps)) {
          const t = su / (su - sv);
          const x = add([P[u][0] + (P[v][0] - P[u][0]) * t, P[u][1] + (P[v][1] - P[u][1]) * t]);
          A.push(x); Bv.push(x);
          insertInNeighbour(r, u, v, x);
        }
      }
      if (A.length < 3 || Bv.length < 3) return false;
      regs[r] = A;
      regs.push(Bv);
      return true;
    }
    for (let c = 0; c < nCuts; c++) {
      const ang = rng() * Math.PI, dir = [Math.cos(ang), Math.sin(ang)];
      if (whole) {
        const p0 = [W * (0.15 + 0.7 * rng()), H * (0.15 + 0.7 * rng())];
        const n0 = regs.length;
        for (let r = 0; r < n0; r++) split(r, p0, dir);
      } else {
        // cut one of the largest regions near its middle
        const bySize = regs.map((L, i) => [area(L), i]).sort((x, y) => y[0] - x[0]);
        const r = bySize[Math.floor(rng() * Math.min(3, bySize.length))][1];
        const cc = centroid(regs[r].map((v) => P[v]));
        const p0 = [cc[0] + (rng() - 0.5) * 30, cc[1] + (rng() - 0.5) * 30];
        split(r, p0, dir);
      }
    }
    const pts = [];
    P.forEach((p) => pts.push(Math.round(p[0]), Math.round(p[1])));
    // drop repeated corners that rounding made equal
    const d = { pts, R: regs.map((L) => L.slice()) };
    return d;
  }

  /* ---------- invented names ---------- */

  const SYL1 = ['Al', 'Bran', 'Cor', 'Del', 'Ess', 'Fal', 'Gor', 'Hal', 'Is', 'Kel', 'Lor', 'Mar', 'Nor', 'Os', 'Pel', 'Quin', 'Ros', 'Sel', 'Tor', 'Ul', 'Val', 'Wen', 'Yr', 'Zan', 'Ard', 'Bel', 'Cal', 'Dun', 'Eld', 'Fen', 'Glen', 'Har', 'Ivel', 'Mor', 'Tam', 'Wil'];
  const SYL2 = ['ia', 'mark', 'land', 'wold', 'mere', 'shire', 'dale', 'holm', 'gard', 'ney', 'ford', 'moor', 'vale', 'stan', 'ria', 'ton', 'wick', 'by', 'ness', 'more', 'ay', 'ow'];
  function names(rng, n) {
    const out = [], seen = new Set();
    for (let t = 0; out.length < n && t < n * 50; t++) {
      const nm = SYL1[Math.floor(rng() * SYL1.length)] + SYL2[Math.floor(rng() * SYL2.length)];
      if (seen.has(nm)) continue;
      seen.add(nm);
      out.push(nm);
    }
    return out;
  }
  const ISLES = ['Wend', 'Morrow', 'Tarn', 'Quill', 'Brume', 'Selk', 'Harrow', 'Lune', 'Corve', 'Ashby', 'Fennick', 'Ormsay', 'Dunmere', 'Galt', 'Pellow', 'Rook'];

  C.MapGen = {
    B62, GRID_CELL, build, connected, search, colourable, unique, grade, oddWheel, randomColouring, makeUnique, bestUnique,
    gridMap, gridMap3, mergeGrid, voronoiMap, islandMap, radialMap, glassMap, centroid, names, ISLES, pop
  };
})(typeof window !== 'undefined' ? window : globalThis);
