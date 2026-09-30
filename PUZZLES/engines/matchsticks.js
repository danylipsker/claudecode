/* The Puzzle Cabinet · engines/matchsticks.js
 *
 * Matchstick figures: matches lie on the edges of a lattice and the player
 * moves, takes away or adds matches until the figure has exactly the squares
 * or triangles asked for, or has become another figure (the fish that turns
 * round, the glass with the cherry outside).
 *
 * data: {
 *   lattice: 'sq'   square lattice, integer points          (default)
 *          | 'sq2'  square lattice in half steps (matches still 1 long, so they can slide by half)
 *          | 'tri'  triangular lattice, one side horizontal; points [a, b] = a·(1,0) + b·(½,√3/2)
 *          | 'trv'  the same turned a quarter turn (one side vertical)
 *          | 'roof' square lattice plus the apexes of equilateral roofs over it; points in world units
 *   start: [[x1, y1, x2, y2], …]    the matches (lattice points; the head is at the second point)
 *   goal:  { squares: n, sizes: 'any' | 'unit', noLoose: true }
 *        | { triangles: n, sizes: 'any' | 'unit', noLoose: true }
 *        | { shape: [[x1, y1, x2, y2], …], motions: 'translate' | 'rigid' | 'any', outside: [x, y] }
 *   move: k | remove: k | add: k     exactly k matches (moves are counted as matches no longer where they began)
 *   sol:   { off: [start indices], on: [[x1, y1, x2, y2], …] }   one solution, checked by verify()
 *   deco:  [{ t: 'cherry', at: [x, y] }]     things on the table that are not matches
 *   margin: 1                                 free lattice around the figure
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;
  const R3 = Math.sqrt(3) / 2;

  /* ---------- lattices ---------- */

  const dirsAt = (degs) => degs.map((a) => [Math.round(Math.cos(a * Math.PI / 180) * 1e9) / 1e9, Math.round(Math.sin(a * Math.PI / 180) * 1e9) / 1e9]);
  const SQ_DIRS = dirsAt([0, 90, 180, 270]);
  const LAT = {
    sq: {
      name: 'square', world: (a, b) => [a, b], dirs: SQ_DIRS, rots: [0, 90, 180, 270],
      points(r) { const out = []; for (let y = Math.ceil(r.y0 - 1e-9); y <= r.y1 + 1e-9; y++) for (let x = Math.ceil(r.x0 - 1e-9); x <= r.x1 + 1e-9; x++) out.push([x, y]); return out; }
    },
    sq2: {
      name: 'square (half steps)', world: (a, b) => [a, b], dirs: SQ_DIRS, rots: [0, 90, 180, 270], conflicts: true, turn: 90,
      points(r) { const out = []; for (let y = Math.ceil(r.y0 * 2 - 1e-9); y <= r.y1 * 2 + 1e-9; y++) for (let x = Math.ceil(r.x0 * 2 - 1e-9); x <= r.x1 * 2 + 1e-9; x++) out.push([x / 2, y / 2]); return out; }
    },
    tri: {
      name: 'triangular', world: (a, b) => [a + b / 2, b * R3], dirs: dirsAt([0, 60, 120, 180, 240, 300]), rots: [0, 60, 120, 180, 240, 300],
      points(r) {
        const out = [];
        for (let b = Math.ceil(r.y0 / R3 - 1e-9); b * R3 <= r.y1 + 1e-9; b++) for (let a = Math.ceil(r.x0 - b / 2 - 1e-9); a + b / 2 <= r.x1 + 1e-9; a++) out.push([a + b / 2, b * R3]);
        return out;
      }
    },
    trv: {
      name: 'triangular', world: (a, b) => [b * R3, a + b / 2], dirs: dirsAt([30, 90, 150, 210, 270, 330]), rots: [0, 60, 120, 180, 240, 300],
      points(r) {
        const out = [];
        for (let b = Math.ceil(r.x0 / R3 - 1e-9); b * R3 <= r.x1 + 1e-9; b++) for (let a = Math.ceil(r.y0 - b / 2 - 1e-9); a + b / 2 <= r.y1 + 1e-9; a++) out.push([b * R3, a + b / 2]);
        return out;
      }
    },
    roof: {
      name: 'square with roofs', world: (a, b) => [a, b], dirs: SQ_DIRS.concat(dirsAt([60, 120, 240, 300])), rots: [0], mirrorOnly: true, conflicts: true,
      points(r) {
        const out = LAT.sq.points(r);
        for (let j = Math.ceil(r.y0 + R3 - 1e-9); j - R3 <= r.y1 + 1e-9; j++) for (let i = Math.ceil(r.x0 - 0.5 - 1e-9); i + 0.5 <= r.x1 + 1e-9; i++) out.push([i + 0.5, j - R3]);
        return out;
      }
    }
  };

  const pk = (p) => Math.round(p[0] * 1000) + ',' + Math.round(p[1] * 1000);
  const ek = (a, b) => { const x = pk(a), y = pk(b); return x < y ? x + '|' + y : y + '|' + x; };

  function ruleOf(d) {
    if (d.move != null) return { kind: 'move', k: d.move };
    if (d.remove != null) return { kind: 'remove', k: d.remove };
    if (d.add != null) return { kind: 'add', k: d.add };
    return null;
  }

  // does segment e cross or overlap segment f (touching at an end is fine)?
  function clash(e, f) {
    const r = G.sub(e.b, e.a), s = G.sub(f.b, f.a);
    const den = G.cross(r, s), q = G.sub(f.a, e.a);
    if (Math.abs(den) < 1e-9) {
      if (Math.abs(G.cross(q, r)) > 1e-6) return false; // parallel, apart
      const rr = G.dot(r, r);
      const t0 = G.dot(q, r) / rr, t1 = G.dot(G.sub(f.b, e.a), r) / rr;
      const lo = Math.max(0, Math.min(t0, t1)), hi = Math.min(1, Math.max(t0, t1));
      return hi - lo > 1e-6;
    }
    const t = G.cross(q, s) / den, u = G.cross(q, r) / den;
    return t > 1e-6 && t < 1 - 1e-6 && u > 1e-6 && u < 1 - 1e-6;
  }

  /* ---------- the model of one puzzle: lattice points, edges, squares and triangles ---------- */

  function build(d, opts) {
    opts = opts || {};
    const lat = LAT[d.lattice || 'sq'];
    if (!lat) return { err: 'unknown lattice ' + d.lattice };
    const W = (a, b) => { const p = lat.world(a, b); return [Math.round(p[0] * 1e9) / 1e9, Math.round(p[1] * 1e9) / 1e9]; };
    const seg = (e) => [W(e[0], e[1]), W(e[2], e[3])];
    const startSegs = (d.start || []).map(seg);
    const onSegs = ((d.sol && d.sol.on) || []).map(seg);
    const pts0 = [];
    startSegs.concat(onSegs).forEach((s) => pts0.push(s[0], s[1]));
    (d.deco || []).forEach((x) => pts0.push(W(x.at[0], x.at[1])));
    if (d.goal && d.goal.outside) pts0.push(W(d.goal.outside[0], d.goal.outside[1]));
    if (!pts0.length) return { err: 'no matches' };
    const bb = G.bbox([pts0]);
    const m = opts.margin != null ? opts.margin : (d.margin != null ? d.margin : 1);
    const rect = { x0: bb.x0 - m, y0: bb.y0 - m, x1: bb.x1 + m, y1: bb.y1 + m };
    const pts = lat.points(rect);
    const pidx = new Map();
    pts.forEach((p, i) => pidx.set(pk(p), i));
    const edges = [], eidx = new Map();
    pts.forEach((p) => {
      lat.dirs.forEach((u) => {
        const q = [p[0] + u[0], p[1] + u[1]];
        if (!pidx.has(pk(q))) return;
        const key = ek(p, q);
        if (eidx.has(key)) return;
        const q0 = pts[pidx.get(pk(q))];
        const a = pk(p) < pk(q0) ? p : q0, b = a === p ? q0 : p;
        let ang = G.normDeg(G.angle(G.sub(b, a)));
        if (ang >= 180 - 1e-6) ang -= 180;
        eidx.set(key, edges.length);
        edges.push({ i: edges.length, a, b, mid: G.mid(a, b), ang, key });
      });
    });
    // crossings and overlaps (only possible on the half-step and roof lattices)
    let conf = null;
    if (lat.conflicts) {
      conf = edges.map(() => null);
      for (let i = 0; i < edges.length; i++) {
        for (let j = i + 1; j < edges.length; j++) {
          if (G.dist2(edges[i].mid, edges[j].mid) > 1.02) continue;
          if (clash(edges[i], edges[j])) { (conf[i] = conf[i] || []).push(j); (conf[j] = conf[j] || []).push(i); }
        }
      }
    }
    // squares (two directions at 90°) and triangles (60°) with sides of whole matches
    const shapes = [], seen = new Set();
    const maxS = Math.ceil(Math.max(rect.x1 - rect.x0, rect.y1 - rect.y0)) + 1;
    const sideEdges = (c, u, s, out) => {
      for (let i = 0; i < s; i++) {
        const k = eidx.get(ek([c[0] + u[0] * i, c[1] + u[1] * i], [c[0] + u[0] * (i + 1), c[1] + u[1] * (i + 1)]));
        if (k == null) return false;
        out.push(k);
      }
      return true;
    };
    pts.forEach((p) => {
      lat.dirs.forEach((u) => {
        lat.dirs.forEach((w) => {
          const dt = G.dot(u, w), cr = G.cross(u, w);
          if (cr <= 1e-9) return; // each corner once, turning one way
          const kind = Math.abs(dt) < 1e-6 ? 'sq' : Math.abs(dt - 0.5) < 1e-6 ? 'tri' : null;
          if (!kind) return;
          for (let s = 1; s <= maxS; s++) {
            const c1 = [p[0] + u[0] * s, p[1] + u[1] * s], c3 = [p[0] + w[0] * s, p[1] + w[1] * s];
            const corners = kind === 'sq' ? [p, c1, [c1[0] + w[0] * s, c1[1] + w[1] * s], c3] : [p, c1, c3];
            if (!corners.every((c) => pidx.has(pk(c)))) break;
            const key = kind + ':' + corners.map(pk).sort().join(';');
            if (seen.has(key)) continue;
            const es = [];
            let ok = true;
            for (let k = 0; k < corners.length && ok; k++) {
              const a = corners[k], b = corners[(k + 1) % corners.length];
              const dir = [(b[0] - a[0]) / s, (b[1] - a[1]) / s];
              ok = sideEdges(a, dir, s, es);
            }
            if (!ok) continue;
            seen.add(key);
            shapes.push({ kind, size: s, edges: es, poly: corners });
          }
        });
      });
    });
    const M = { lat, latName: d.lattice || 'sq', W, seg, pts, pidx, edges, eidx, conf, shapes, rect, bb };
    M.edgeShapes = edges.map(() => []);
    shapes.forEach((s, i) => s.edges.forEach((e) => M.edgeShapes[e].push(i)));
    M.start = [];
    for (const s of startSegs) {
      const k = eidx.get(ek(s[0], s[1]));
      if (k == null) return { err: 'a match is not on a lattice edge: ' + JSON.stringify(s) };
      if (M.start.includes(k)) return { err: 'two matches on one edge' };
      M.start.push(k);
    }
    M.startSegs = startSegs;
    M.onSegs = onSegs;
    if (d.goal && d.goal.shape) M.target = d.goal.shape.map(seg);
    if (d.goal && d.goal.outside) M.outside = W(d.goal.outside[0], d.goal.outside[1]);
    return M;
  }

  const edgeOf = (M, s) => M.eidx.get(ek(s[0], s[1]));
  const occOf = (M, list) => { const o = new Uint8Array(M.edges.length); list.forEach((e) => { o[e] = 1; }); return o; };
  function freeFor(M, occ, e) {
    if (occ[e]) return false;
    const cf = M.conf && M.conf[e];
    if (cf) for (const f of cf) if (occ[f]) return false;
    return true;
  }
  // does any pair in the list clash?
  function clashFree(M, list) {
    if (!M.conf) return true;
    const set = new Set(list);
    for (const e of list) { const cf = M.conf[e]; if (cf) for (const f of cf) if (set.has(f)) return false; }
    return true;
  }

  /* ---------- goals ---------- */

  function goalKind(goal) { return goal.squares != null ? 'sq' : goal.triangles != null ? 'tri' : null; }
  function goalShapes(M, goal) {
    const kind = goalKind(goal), unit = goal.sizes === 'unit';
    const out = [];
    M.shapes.forEach((s, i) => { if (s.kind === kind && (!unit || s.size === 1)) out.push(i); });
    return out;
  }

  // the complete shapes of the goal's kind, the loose matches, and whether the goal is met
  function evalState(M, occ, goal, gsIdx) {
    if (goal.shape) return evalShape(M, occ, goal);
    const gs = gsIdx || goalShapes(M, goal);
    const want = goal.squares != null ? goal.squares : goal.triangles;
    const done = [];
    let covered = null;
    if (goal.noLoose) covered = new Uint8Array(M.edges.length);
    for (const si of gs) {
      const s = M.shapes[si];
      let all = true;
      for (const e of s.edges) if (!occ[e]) { all = false; break; }
      if (!all) continue;
      done.push(si);
      if (covered) for (const e of s.edges) covered[e] = 1;
    }
    let loose = 0;
    if (covered) for (let e = 0; e < occ.length; e++) if (occ[e] && !covered[e]) loose++;
    return { ok: done.length === want && loose === 0, n: done.length, want, loose, done };
  }

  function segsOf(M, occ) {
    const out = [];
    for (let e = 0; e < occ.length; e++) if (occ[e]) out.push([M.edges[e].a, M.edges[e].b]);
    return out;
  }
  function normKeys(segs) {
    const b = G.bbox(segs.map((s) => s[0]).concat(segs.map((s) => s[1])));
    return segs.map((s) => ek([s[0][0] - b.x0, s[0][1] - b.y0], [s[1][0] - b.x0, s[1][1] - b.y0])).sort().join(' ');
  }
  function insideHull(pt, segs) {
    const pts = [];
    segs.forEach((s) => pts.push(s[0], s[1]));
    const hull = G.convexHull(pts);
    if (hull.length < 3) return false;
    // strictly inside, by a small margin
    for (let i = 0; i < hull.length; i++) {
      const a = hull[i], b = hull[(i + 1) % hull.length];
      const sd = G.cross(G.sub(b, a), G.sub(pt, a)) / (G.dist(a, b) || 1);
      if (sd < 0.02) return false;
    }
    return true;
  }
  function evalShape(M, occ, goal) {
    const segs = segsOf(M, occ);
    const T = M.target;
    let same = false;
    if (segs.length === T.length) {
      if (goal.motions === 'translate') same = normKeys(segs) === normKeys(T);
      else same = G.segmentsCongruent(segs, T, { tol: 0.05, allowMirror: goal.motions !== 'rigid' });
    }
    const out = M.outside ? !insideHull(M.outside, segs) : true;
    return { ok: same && out, same, out };
  }

  /* ---------- search ---------- */

  // every final set within the rule's budget of exactly j changes: { sols: [{ off: [edges], on: [edges] }], nodes, capped }
  function solveAll(M, S, goal, kind, j, opts) {
    opts = opts || {};
    const cap = opts.cap || 3e6, max = opts.max || 1e9;
    const res = { sols: [], nodes: 0, capped: false };
    const seen = new Set();
    const record = (off, on) => {
      const key = off.slice().sort((a, b) => a - b).join(',') + '/' + on.slice().sort((a, b) => a - b).join(',');
      if (seen.has(key)) return;
      seen.add(key);
      res.sols.push({ off: off.slice(), on: on.slice() });
      if (res.sols.length >= max) res.capped = true;
    };
    if (goal.shape) { placements(M, S, goal, kind, j, record, res); return res; }
    const gs = goalShapes(M, goal);
    if (kind === 'remove') { removeSearch(M, S, goal, gs, j, record, res, cap); return res; }
    if (kind === 'add') { addSearch(M, S, [], goal, gs, j, record, res, cap); return res; }
    // move: lift j matches, then add j where they complete shapes
    const n = S.length;
    const idx = [];
    const rec = (from) => {
      if (res.capped) return;
      if (idx.length === j) {
        const R = idx.map((i) => S[i]);
        const Sp = S.filter((e) => !R.includes(e));
        addSearch(M, Sp, R, goal, gs, j, (off, on) => record(R, on), res, cap);
        return;
      }
      for (let i = from; i <= n - (j - idx.length); i++) { idx.push(i); rec(i + 1); idx.pop(); }
    };
    rec(0);
    return res;
  }

  // add exactly j matches to Sp (not on the edges in R) so that the goal holds; every added match must complete a shape
  function addSearch(M, Sp, R, goal, gs, j, record, res, cap) {
    const occ = occOf(M, Sp);
    const banned = new Set(R);
    const cands = [], ck = new Set();
    for (const si of gs) {
      const s = M.shapes[si];
      const miss = [];
      let ok = true;
      for (const e of s.edges) {
        if (occ[e]) continue;
        if (banned.has(e) || !freeFor(M, occ, e)) { ok = false; break; }
        miss.push(e);
        if (miss.length > j) { ok = false; break; }
      }
      if (!ok || !miss.length) continue;
      miss.sort((a, b) => a - b);
      const key = miss.join(',');
      if (ck.has(key)) continue;
      ck.add(key);
      cands.push(miss);
    }
    const tried = new Set();
    const A = [];
    const inA = new Set();
    const dfs = (from) => {
      if (res.capped || res.nodes > cap) { res.capped = true; return; }
      res.nodes++;
      if (A.length === j) {
        const key = A.slice().sort((a, b) => a - b).join(',');
        if (tried.has(key)) return;
        tried.add(key);
        if (!clashFree(M, A)) return;
        A.forEach((e) => { occ[e] = 1; });
        const r = evalState(M, occ, goal, gs);
        A.forEach((e) => { occ[e] = 0; });
        if (r.ok) record([], A.slice());
        return;
      }
      for (let i = from; i < cands.length; i++) {
        const add = cands[i].filter((e) => !inA.has(e));
        if (!add.length || A.length + add.length > j) continue;
        add.forEach((e) => { A.push(e); inA.add(e); });
        dfs(i + 1);
        add.forEach((e) => { A.pop(); inA.delete(e); });
      }
    };
    dfs(0);
  }

  // take away exactly j of the matches S so that the goal holds
  function removeSearch(M, S, goal, gs0, j, record, res, cap) {
    const inS = occOf(M, S);
    const gs = gs0.filter((si) => M.shapes[si].edges.every((e) => inS[e]));
    const want = goal.squares != null ? goal.squares : goal.triangles;
    const order = S.slice().sort((a, b) => a - b);
    const pos = new Map(order.map((e, i) => [e, i]));
    const shapesOf = order.map(() => []);
    const byLast = order.map(() => []);
    const missing = new Int32Array(M.shapes.length);
    gs.forEach((si) => {
      let last = 0;
      M.shapes[si].edges.forEach((e) => { const p = pos.get(e); shapesOf[p].push(si); if (p > last) last = p; });
      byLast[last].push(si);
    });
    let count = gs.length;
    const removed = [];
    const kept = new Uint8Array(order.length);
    const looseOK = () => {
      if (!goal.noLoose) return true;
      for (let p = 0; p < order.length; p++) {
        if (!kept[p]) continue;
        if (!shapesOf[p].some((si) => missing[si] === 0)) return false;
      }
      return true;
    };
    const dfs = (i, left, locked) => {
      if (res.capped) return;
      if (++res.nodes > cap) { res.capped = true; return; }
      if (count < want || locked > want) return;
      if (left === 0) {
        for (let p = i; p < order.length; p++) kept[p] = 1;
        if (count === want && looseOK()) record(removed.map((p) => order[p]), []);
        for (let p = i; p < order.length; p++) kept[p] = 0;
        return;
      }
      if (order.length - i < left) return;
      // take it away
      shapesOf[i].forEach((si) => { if (missing[si]++ === 0) count--; });
      removed.push(i);
      let l1 = locked;
      byLast[i].forEach((si) => { if (missing[si] === 0) l1++; });
      dfs(i + 1, left - 1, l1);
      removed.pop();
      shapesOf[i].forEach((si) => { if (--missing[si] === 0) count++; });
      // keep it
      kept[i] = 1;
      let l2 = locked;
      byLast[i].forEach((si) => { if (missing[si] === 0) l2++; });
      dfs(i + 1, left, l2);
      kept[i] = 0;
    };
    dfs(0, j, 0);
  }

  // shape goals: every placement of the target figure the motions allow, and what it costs to get there
  function linearMaps(M, motions) {
    const out = [];
    const rots = motions === 'translate' ? [0] : M.lat.rots;
    const mirrors = motions === 'any' ? [false, true] : [false];
    rots.forEach((r) => mirrors.forEach((mi) => {
      const rad = r * Math.PI / 180, c = Math.cos(rad), s = Math.sin(rad);
      out.push((p) => { const x = mi ? -p[0] : p[0]; return [x * c - p[1] * s, x * s + p[1] * c]; });
    }));
    return out;
  }
  function placements(M, S, goal, kind, j, record, res) {
    const Sset = new Set(S);
    const seen = new Set();
    linearMaps(M, goal.motions || 'any').forEach((L) => {
      const T = M.target.map((s) => [L(s[0]), L(s[1])]);
      S.forEach((se) => {
        const e = M.edges[se];
        T.forEach((t) => {
          [[t[0], t[1]], [t[1], t[0]]].forEach((tt) => {
            const v = G.sub(e.a, tt[0]);
            if (G.dist(G.add(tt[1], v), e.b) > 1e-6) return;
            const placed = [];
            for (const s2 of T) {
              const k = M.eidx.get(ek(G.add(s2[0], v), G.add(s2[1], v)));
              if (k == null) return;
              placed.push(k);
            }
            const key = placed.slice().sort((a, b) => a - b).join(',');
            if (seen.has(key)) return;
            seen.add(key);
            res.nodes++;
            if (new Set(placed).size !== placed.length || !clashFree(M, placed)) return;
            const off = S.filter((x) => !placed.includes(x));
            const on = placed.filter((x) => !Sset.has(x));
            if (kind === 'move' && (off.length !== j || on.length !== j)) return;
            if (kind === 'remove' && (on.length || off.length !== j)) return;
            if (kind === 'add' && (off.length || on.length !== j)) return;
            const occ = occOf(M, placed);
            if (evalState(M, occ, goal).ok) record(off, on);
          });
        });
      });
    });
  }

  // the turns and mirrors of the plane that carry the starting figure onto itself
  function symmetries(M, S) {
    const pts = [];
    S.forEach((e) => pts.push(M.edges[e].a, M.edges[e].b));
    const c = [pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length];
    const Sk = new Set(S);
    const out = [];
    const rots = M.lat.mirrorOnly ? [0] : M.lat.rots;
    rots.forEach((r) => [false, true].forEach((mi) => {
      const rad = r * Math.PI / 180, cs = Math.cos(rad), sn = Math.sin(rad);
      const f = (p) => { let x = p[0] - c[0]; const y = p[1] - c[1]; if (mi) x = -x; return [x * cs - y * sn + c[0], x * sn + y * cs + c[1]]; };
      const mapE = (e) => M.eidx.get(ek(f(M.edges[e].a), f(M.edges[e].b)));
      if (S.every((e) => { const k = mapE(e); return k != null && Sk.has(k); })) out.push(mapE);
    }));
    return out;
  }

  // the stored solution as edge lists
  function storedSol(M, d) {
    const sol = d.sol || {};
    const off = (sol.off || []).map((i) => M.start[i]);
    const on = (sol.on || []).map((s) => edgeOf(M, M.seg(s)));
    return { off, on };
  }
  function finalOf(S, sol) {
    const set = new Set(S);
    sol.off.forEach((e) => set.delete(e));
    sol.on.forEach((e) => set.add(e));
    return set;
  }

  /* ---------- making puzzles: figures, grading, the Endless drawer ---------- */

  // data coordinates of a world point
  function toData(latName, p) {
    if (latName === 'tri') { const b = Math.round(p[1] / R3); return [Math.round(p[0] - b / 2), b]; }
    if (latName === 'trv') { const b = Math.round(p[0] / R3); return [Math.round(p[1] - b / 2), b]; }
    return [Math.round(p[0] * 1000) / 1000, Math.round(p[1] * 1000) / 1000];
  }
  function dedupeSegs(list) {
    const m = new Map();
    list.forEach((s) => { const k = [s[0] + ',' + s[1], s[2] + ',' + s[3]].sort().join('|'); if (!m.has(k)) m.set(k, s); });
    return Array.from(m.values());
  }
  function gridSegs(w, h) {
    const s = [];
    for (let y = 0; y <= h; y++) for (let x = 0; x < w; x++) s.push([x, y, x + 1, y]);
    for (let x = 0; x <= w; x++) for (let y = 0; y < h; y++) s.push([x, y, x, y + 1]);
    return s;
  }
  function cellSegs(cells) {
    const s = [];
    cells.forEach(([x, y]) => s.push([x, y, x + 1, y], [x, y + 1, x + 1, y + 1], [x, y, x, y + 1], [x + 1, y, x + 1, y + 1]));
    return dedupeSegs(s);
  }
  // triangles [a, b, up] of the 'tri' lattice: up = (a,b)(a+1,b)(a,b+1), down = (a+1,b)(a,b+1)(a+1,b+1)
  function triSegs(tris) {
    const s = [];
    tris.forEach(([a, b, up]) => {
      const P = up ? [[a, b], [a + 1, b], [a, b + 1]] : [[a + 1, b], [a, b + 1], [a + 1, b + 1]];
      for (let i = 0; i < 3; i++) s.push([P[i][0], P[i][1], P[(i + 1) % 3][0], P[(i + 1) % 3][1]]);
    });
    return dedupeSegs(s);
  }
  function bigTriangle(n) {
    const t = [];
    for (let b = 0; b < n; b++) for (let a = 0; a < n - b; a++) { t.push([a, b, 1]); if (a + b < n - 1) t.push([a, b, 0]); }
    return t;
  }
  const HEX = [[1, 1, 1], [0, 1, 1], [1, 0, 1], [0, 1, 0], [1, 0, 0], [0, 0, 0]]; // the six triangles round the point (1, 1)
  function triNeighbours(t) {
    const [a, b, up] = t;
    return up ? [[a, b, 0], [a - 1, b, 0], [a, b - 1, 0]] : [[a, b, 1], [a + 1, b, 1], [a, b + 1, 1]];
  }
  function growCells(rng, n) {
    const cells = [[0, 0]], has = new Set(['0,0']);
    let guard = 0;
    while (cells.length < n && guard++ < 500) {
      const c = cells[rng.int(cells.length)], d = [[1, 0], [-1, 0], [0, 1], [0, -1]][rng.int(4)];
      const q = [c[0] + d[0], c[1] + d[1]];
      if (has.has(q.join(','))) continue;
      const xs = cells.map((p) => p[0]).concat(q[0]), ys = cells.map((p) => p[1]).concat(q[1]);
      if (Math.max(...xs) - Math.min(...xs) > 3 || Math.max(...ys) - Math.min(...ys) > 3) continue;
      cells.push(q); has.add(q.join(','));
    }
    const x0 = Math.min(...cells.map((p) => p[0])), y0 = Math.min(...cells.map((p) => p[1]));
    return cells.map((p) => [p[0] - x0, p[1] - y0]);
  }
  function growTris(rng, n) {
    const tris = [[0, 0, 1]], has = new Set(['0,0,1']);
    let guard = 0;
    while (tris.length < n && guard++ < 500) {
      const nb = triNeighbours(tris[rng.int(tris.length)]);
      const q = nb[rng.int(3)];
      if (has.has(q.join(','))) continue;
      tris.push(q); has.add(q.join(','));
    }
    const a0 = Math.min(...tris.map((p) => p[0])), b0 = Math.min(...tris.map((p) => p[1]));
    return tris.map((p) => [p[0] - a0, p[1] - b0, p[2]]);
  }

  // the figures the drawer is made from: [id, lattice, segments, name, words]
  const FIGS = {
    domino: ['sq', () => gridSegs(2, 1), 'The Domino', 'make two squares side by side'],
    row3: ['sq', () => gridSegs(3, 1), 'The Row of Three', 'make a row of three squares'],
    row4: ['sq', () => gridSegs(4, 1), 'The Row of Four', 'make a row of four squares'],
    window: ['sq', () => gridSegs(2, 2), 'The Window', 'make a window of four panes'],
    six: ['sq', () => gridSegs(3, 2), 'The Six Panes', 'make a window of six panes, three by two'],
    long: ['sq', () => gridSegs(4, 2), 'The Long Window', 'make a long window of eight panes'],
    noughts: ['sq', () => gridSegs(3, 3), 'The Noughts Board', 'make a noughts-and-crosses board of nine squares'],
    twelve: ['sq', () => gridSegs(4, 3), 'The Twelve Panes', 'make a board of twelve squares, four by three'],
    sixteen: ['sq', () => gridSegs(4, 4), 'The Sixteen', 'make a board of sixteen squares'],
    cross: ['sq', () => cellSegs([[1, 0], [0, 1], [1, 1], [2, 1], [1, 2]]), 'The Cross', 'make a cross of five squares'],
    tee: ['sq', () => cellSegs([[0, 0], [1, 0], [2, 0], [1, 1], [1, 2]]), 'The Tee', 'make a T of five squares'],
    ell: ['sq', () => cellSegs([[0, 0], [0, 1], [0, 2], [1, 2]]), 'The Ell', 'make an L of four squares'],
    stairs: ['sq', () => cellSegs([[0, 0], [0, 1], [1, 1], [0, 2], [1, 2], [2, 2]]), 'The Staircase', 'make a staircase of six squares'],
    zigzag: ['sq', () => cellSegs([[0, 0], [1, 0], [1, 1], [2, 1]]), 'The Zigzag', 'make a zigzag of four squares'],
    pyramid: ['tri', () => triSegs(bigTriangle(2)), 'The Pyramid', 'make a triangle of four small triangles'],
    great: ['tri', () => triSegs(bigTriangle(3)), 'The Great Pyramid', 'make a large triangle of nine small ones'],
    tall: ['tri', () => triSegs(bigTriangle(4)), 'The Tall Pyramid', 'make a large triangle of sixteen small ones'],
    hexagon: ['tri', () => triSegs(HEX), 'The Hexagon', 'make a hexagon of six triangles'],
    diamond: ['tri', () => triSegs([[0, 0, 1], [0, 0, 0]]), 'The Diamond', 'make a diamond of two triangles'],
    trapezoid: ['tri', () => triSegs([[0, 0, 1], [0, 0, 0], [1, 0, 1]]), 'The Trapezoid', 'make a trapezoid of three triangles'],
    ribbon: ['tri', () => triSegs([[0, 0, 1], [0, 0, 0], [1, 0, 1], [1, 0, 0]]), 'The Ribbon', 'make a ribbon of four triangles'],
    ribbon5: ['tri', () => triSegs([[0, 0, 1], [0, 0, 0], [1, 0, 1], [1, 0, 0], [2, 0, 1]]), 'The Long Ribbon', 'make a ribbon of five triangles'],
    bigdiamond: ['tri', () => triSegs([[0, 0, 1], [0, 0, 0], [1, 0, 1], [1, 0, 0], [0, 1, 1], [0, 1, 0], [1, 1, 1], [1, 1, 0]]), 'The Big Diamond', 'make a diamond of eight triangles']
  };
  function figure(id, rng) {
    if (FIGS[id]) { const f = FIGS[id]; return { id, lattice: f[0], segs: f[1](), name: f[2], words: f[3] }; }
    const m = /^(poly|iamond)(\d)$/.exec(id);
    if (!m) return null;
    const n = +m[2];
    if (m[1] === 'poly') return { id, lattice: 'sq', segs: cellSegs(growCells(rng, n)), name: cap(num(n)) + ' Panes', words: 'make a figure of ' + num(n) + ' small squares' };
    return { id, lattice: 'tri', segs: triSegs(growTris(rng, n)), name: cap(num(n)) + ' Triangles', words: 'make a figure of ' + num(n) + ' small triangles' };
  }

  const choose = (n, k) => { let r = 1; for (let i = 0; i < k; i++) r = r * (n - i) / (i + 1); return r; };
  const NOW = () => (root.performance ? root.performance.now() : Date.now());

  /* How hard is it? The rarer the answers among all the ways of taking, moving or adding
   * k matches, the harder the puzzle; moving is harder to see than taking away, and
   * squares of mixed sizes are harder to count than small ones. Returns null if the
   * goal cannot be met with exactly k (or could be met with fewer). */
  function assess(fig, op, k, goal, opts) {
    opts = opts || {};
    const d = { lattice: fig.lattice, start: fig.segs, goal, margin: 1 };
    d[op] = k;
    const M = build(d);
    if (M.err) return null;
    const occ0 = occOf(M, M.start);
    const r0 = evalState(M, occ0, goal);
    if (op !== 'remove' && r0.ok) return null;
    const cap0 = opts.cap || 400000;
    const res = solveAll(M, M.start, goal, op, k, { cap: cap0 });
    if (!res.sols.length || res.capped) return null;
    if (op !== 'remove' || goal.squares === 0 || goal.triangles === 0) {
      for (let j = 1; j < k; j++) {
        const s = solveAll(M, M.start, goal, op, j, { cap: cap0, max: 1 });
        if (s.sols.length || s.capped) return null;
      }
    }
    const N = M.start.length, F = M.edges.length - N;
    const space = op === 'remove' ? choose(N, k) : op === 'add' ? choose(F, k) : choose(N, k) * choose(F, k);
    let score = Math.log10(Math.max(space, 1)) - Math.log10(res.sols.length);
    if (op === 'move') score *= 0.55; // most places a match could go are plainly useless
    const want0 = goal.squares != null ? goal.squares : goal.triangles;
    if (op === 'remove' && want0 > 0) {
      // a solver may think instead about which shapes to keep: that view is often much easier
      const inside = goalShapes(M, goal).filter((si) => M.shapes[si].edges.every((e) => occ0[e])).length;
      score = Math.min(score, Math.log10(Math.max(1, choose(inside, want0))) - Math.log10(res.sols.length) + 1);
    }
    const kind = goalKind(goal);
    const big = M.shapes.some((s) => s.kind === kind && s.size > 1 && s.edges.every((e) => occ0[e]));
    if (goal.sizes !== 'unit' && big) score += 0.4;
    if (kind === 'tri') score += 0.2;
    score += Math.max(0, N - 14) * 0.02;
    const diff = score < 1.4 ? 1 : score < 2.4 ? 2 : score < 3.5 ? 3 : score < 4.7 ? 4 : 5;
    // the stored answer: the one that keeps the table smallest
    let best = null, bestA = Infinity;
    res.sols.forEach((s) => {
      const pts = [];
      M.start.concat(s.on).forEach((e) => pts.push(M.edges[e].a, M.edges[e].b));
      const b = G.bbox([pts]);
      const a = (b.w + 1) * (b.h + 1) + (b.w > b.h ? 0.1 : 0);
      if (a < bestA - 1e-9) { bestA = a; best = s; }
    });
    return { M, d, sols: res.sols.length, sol: best, score, diff, start0: r0.n };
  }

  // the puzzle for the drawer: data with the stored solution, a title and a statement
  function puzzleFrom(fig, op, k, goal, a, rng, diff) {
    const M = a.M;
    const start = fig.segs.map((s) => (rng() < 0.5 ? s.slice() : [s[2], s[3], s[0], s[1]]));
    const off = a.sol.off.map((e) => M.start.indexOf(e));
    const on = a.sol.on.map((e) => toData(fig.lattice, M.edges[e].a).concat(toData(fig.lattice, M.edges[e].b)));
    const data = { lattice: fig.lattice, start, goal };
    if (fig.lattice === 'sq') delete data.lattice;
    data[op] = k;
    data.sol = { off, on };
    const kind = goalKind(goal), noun = kind === 'sq' ? 'square' : 'triangle';
    const n = goal.squares != null ? goal.squares : goal.triangles;
    const verb = op === 'move' ? 'Move' : op === 'remove' ? 'Take' : 'Add';
    const res = n === 0 ? 'No ' + cap(noun) + 's' : (op === 'remove' ? 'Leave ' : 'Make ') + cap(num(n)) + (goal.sizes === 'unit' ? ' Small' : '');
    const title = fig.name + ': ' + verb + ' ' + cap(num(k)) + ', ' + res;
    const occ0 = occOf(M, M.start);
    const all = evalState(M, occ0, { [kind === 'sq' ? 'squares' : 'triangles']: 0 }).n;
    const units = evalState(M, occ0, { [kind === 'sq' ? 'squares' : 'triangles']: 0, sizes: 'unit' }).n;
    let text = cap(num(M.start.length)) + ' matches ' + fig.words;
    if (all > units) text += ' — ' + num(all) + ' ' + noun + 's in all, counting the big ' + (all - units === 1 ? 'one' : 'ones');
    text += '.';
    const p = { title, text, diff: diff || a.diff, data };
    if ((diff || a.diff) >= 3) {
      p.hints = [goal.sizes === 'unit' || n === 0
        ? (n === 0 ? 'Each match you take away can break more than one ' + noun + ': the ones inside the figure are worth most.' : 'Only the small ' + noun + 's count here, but every match you keep must still be the side of one.')
        : 'Big ' + noun + 's count too: a ' + noun + ' is any ' + noun + ' whose sides are all matches, whatever lies inside it.'];
    }
    return p;
  }

  // one attempt at an Endless puzzle of the given level (or null)
  const POOLS = [null,
    ['domino', 'row3', 'window', 'pyramid', 'diamond', 'trapezoid', 'ribbon', 'row4', 'cross'],
    ['row3', 'row4', 'window', 'six', 'ell', 'tee', 'cross', 'zigzag', 'hexagon', 'ribbon5', 'pyramid', 'poly4', 'iamond4'],
    ['six', 'noughts', 'long', 'stairs', 'zigzag', 'tee', 'cross', 'great', 'hexagon', 'bigdiamond', 'poly5', 'poly6', 'iamond5', 'iamond6'],
    ['noughts', 'long', 'twelve', 'stairs', 'great', 'bigdiamond', 'hexagon', 'poly6', 'poly7', 'iamond6', 'iamond7'],
    ['noughts', 'twelve', 'long', 'great', 'tall', 'bigdiamond', 'hexagon', 'poly7', 'iamond7', 'iamond8']];
  // what each level is usually made of: [rule, fewest k, most k]
  const RECIPES = [null,
    [['remove', 1, 3], ['remove', 1, 4], ['move', 1, 2]],
    [['remove', 2, 5], ['move', 1, 2], ['move', 2, 3], ['add', 1, 3]],
    [['remove', 3, 6], ['move', 2, 3], ['move', 3, 3], ['add', 2, 3]],
    [['remove', 4, 7], ['move', 3, 4], ['move', 3, 4], ['add', 3, 4]],
    [['remove', 5, 10], ['remove', 5, 8], ['move', 4, 4], ['add', 4, 4]]];
  function attempt(rng, level) {
    const fig = figure(rng.pick(POOLS[level]), rng);
    if (!fig) return null;
    const kind = fig.lattice === 'sq' ? 'squares' : 'triangles';
    const rec = rng.pick(RECIPES[level]);
    const op = rec[0];
    const N = fig.segs.length;
    if (op === 'move' && rec[2] >= 4 && N > 18) return null;
    const k = Math.min(rng.range(rec[1], rec[2]), op === 'remove' ? N - 3 : 4);
    if (k < 1) return null;
    const M = build({ lattice: fig.lattice, start: fig.segs, goal: { [kind]: 0 } });
    if (M.err) return null;
    const n0 = evalState(M, occOf(M, M.start), { [kind]: 0 }).n;
    const n = op === 'remove' ? rng.range(0, Math.max(0, n0 - 1)) : op === 'add' ? rng.range(n0 + 1, n0 + 1 + k * 2) : rng.range(1, n0 + 2);
    const goal = { [kind]: n };
    if (n > 0) { if (rng() < 0.35) goal.sizes = 'unit'; goal.noLoose = true; }
    const a = assess(fig, op, k, goal, { cap: 120000 });
    if (!a || a.diff !== level) return null;
    return puzzleFrom(fig, op, k, goal, a, rng, level);
  }

  C.matchsticks = { LAT, build, ruleOf, evalState, solveAll, symmetries, storedSol, finalOf, occOf, freeFor, clashFree, goalShapes, ek, pk, R3,
    toData, gridSegs, cellSegs, triSegs, bigTriangle, HEX, growCells, growTris, FIGS, figure, assess, puzzleFrom, attempt };

  /* ---------- words ---------- */

  const NUM = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
  const num = (n) => (n <= 20 ? NUM[n] : n < 100 ? TENS[Math.floor(n / 10)] + (n % 10 ? '-' + NUM[n % 10] : '') : String(n));
  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const matches = (n) => num(n) + ' ' + (n === 1 ? 'match' : 'matches');

  function goalText(d) {
    const R = ruleOf(d), g = d.goal;
    const verb = R.kind === 'move' ? 'Move' : R.kind === 'remove' ? 'Take away' : 'Add';
    const head = verb + ' exactly **' + matches(R.k) + '**';
    if (g.shape) {
      if (g.outside) return head + ' so that the figure has the same shape again (turned or mirrored is fine) and the ' + (((d.deco || [])[0] || {}).t || 'cherry') + ' is outside it.';
      if (g.motions === 'translate') return head + ' so that the figure looks like the picture beside the table.';
      return head + ' to make the figure in the picture.';
    }
    const n = g.squares != null ? g.squares : g.triangles;
    const noun = g.squares != null ? 'square' : 'triangle';
    if (n === 0) return head + ' so that not a single ' + noun + ' of any size is left.';
    const what = '**' + num(n) + (g.sizes === 'unit' ? ' small ' : ' ') + noun + (n === 1 ? '' : 's') + '**';
    return head + (R.kind === 'remove' ? ' to leave exactly ' : ' to make exactly ') + what + (g.sizes === 'unit' ? ' (one match to a side)' : ' (of any size)') +
      (g.noLoose ? ', with every match part of a ' + noun + '.' : '.');
  }

  function sizeWords(M, done, noun) {
    const by = {};
    done.forEach((si) => { const s = M.shapes[si].size; by[s] = (by[s] || 0) + 1; });
    const ks = Object.keys(by).map(Number).sort((a, b) => a - b);
    if (!ks.length) return 'no ' + noun + 's';
    return ks.map((k, i) => num(by[k]) + (k === 1 ? ' small ' + noun + (by[k] === 1 ? '' : 's') : (i === 0 ? ' ' + noun + (by[k] === 1 ? '' : 's') : '') + ' of side ' + k))
      .join(', ').replace(/, ([^,]*)$/, ' and $1');
  }

  /* ---------- the engine ---------- */

  C.engine({
    id: 'matchsticks',
    name: 'Matchsticks',
    deps: ['js/lib/matches.js'],
    noMoves: true,
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'xray', 'loupe'],
    workbench: { snapPx: 12 },
    generates: ['matchstick-shapes'],
    generate(rng, level) {
      const t0 = NOW();
      for (let tries = 0; tries < 200 && NOW() - t0 < 900; tries++) {
        const p = attempt(rng, level);
        if (p) return p;
      }
      return null;
    },
    about: '**Drag** a match to move it: it settles on the nearest free place between two dots, and a dashed outline shows where it will land. Drop a match in the **matchbox** beside the table to take it away; drag it back out to put it back. Where matches may only be taken away, a **click** takes one away (and a click in the box puts it back). Where you may add matches, the spares wait in the box. With a match selected, the **arrow keys** slide it to the next place and **Delete** puts it in the box; on the half-step board **R** turns a match where it lies.\n\nA square or triangle counts when all its sides are made of matches, whatever lies inside it — so a 2 × 2 block of small squares holds five squares, not four. The counters under the table show how many matches you have moved and how many squares or triangles there are; **Count them** points out each one.',

    verify(p) {
      const d = p.data;
      if (!d || !d.start || !d.goal) return { ok: false, err: 'start and goal are needed' };
      const R = ruleOf(d);
      if (!R || !(R.k >= 1)) return { ok: false, err: 'say how many matches to move, remove or add' };
      const M = build(d);
      if (M.err) return { ok: false, err: M.err };
      const g = d.goal;
      if (!g.shape && goalKind(g) == null) return { ok: false, err: 'unknown goal' };
      if (goalKind(g) && !M.shapes.some((s) => s.kind === goalKind(g))) return { ok: false, err: 'this lattice has no ' + (goalKind(g) === 'sq' ? 'squares' : 'triangles') };
      if (g.shape && !M.target.every((s) => M.eidx.has(ek(s[0], s[1])) || true)) return { ok: false, err: 'bad target' };
      if (!d.sol) return { ok: false, err: 'no stored solution' };
      const sol = storedSol(M, d);
      if (sol.off.some((e) => e == null)) return { ok: false, err: 'sol.off points at no match' };
      if (sol.on.some((e) => e == null)) return { ok: false, err: 'a match of the solution is off the lattice' };
      if (new Set(sol.off).size !== sol.off.length || new Set(sol.on).size !== sol.on.length) return { ok: false, err: 'the solution repeats a match' };
      const S0 = new Set(M.start);
      if (sol.on.some((e) => S0.has(e))) return { ok: false, err: 'the solution puts a match where one already lies' };
      if (R.kind === 'move' && (sol.off.length !== R.k || sol.on.length !== R.k)) return { ok: false, err: 'the solution does not move exactly ' + R.k };
      if (R.kind === 'remove' && (sol.off.length !== R.k || sol.on.length)) return { ok: false, err: 'the solution does not take away exactly ' + R.k };
      if (R.kind === 'add' && (sol.off.length || sol.on.length !== R.k)) return { ok: false, err: 'the solution does not add exactly ' + R.k };
      if (!clashFree(M, M.start)) return { ok: false, err: 'matches cross at the start' };
      const F = Array.from(finalOf(M.start, sol));
      if (!clashFree(M, F)) return { ok: false, err: 'matches cross in the solution' };
      const r = evalState(M, occOf(M, F), g);
      if (!r.ok) return { ok: false, err: 'the stored solution misses the goal (' + (g.shape ? JSON.stringify(r) : r.n + ' shapes, ' + r.loose + ' loose') + ')' };
      if (R.kind !== 'remove' && evalState(M, occOf(M, M.start), g).ok) return { ok: false, err: 'the start already meets the goal' };
      // no easier way on this board: fewer moves or fewer additions do not do it
      if (R.kind !== 'remove') {
        for (let j = 1; j < R.k; j++) {
          const s = solveAll(M, M.start, g, R.kind, j, { cap: 80000, max: 1 });
          if (s.sols.length) return { ok: false, err: 'it can be done with ' + matches(j) };
        }
      }
      return { ok: true };
    },

    mount(ctx, p) {
      const wb = ctx.wb, d = p.data;
      const kit = C.matchKit;
      const M = build(d);
      if (M.err) { ctx.say('This puzzle is broken: ' + M.err, 'warn'); return {}; }
      const R = ruleOf(d), goal = d.goal;
      kit.install(wb);
      const S0 = M.start, S0set = new Set(S0);
      const gs = goal.shape ? null : goalShapes(M, goal);
      const noun = goal.squares != null ? 'square' : goal.triangles != null ? 'triangle' : null;
      const want = goal.squares != null ? goal.squares : goal.triangles;
      if (!p.goal) ctx.setGoal(goalText(d));
      const timers = [];
      const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
      let busy = false;

      /* the table, the dots, the matchbox */
      const r = M.rect;
      const bg = wb.layer('bg'), board = wb.layer('board'), top = wb.layer('top');
      ctx.s('rect', { x: r.x0 - 0.45, y: r.y0 - 0.45, width: r.x1 - r.x0 + 0.9, height: r.y1 - r.y0 + 0.9, rx: 0.28, class: 'ms-table' }, bg);
      const dots = ctx.s('g', { class: 'ms-dots' }, bg);
      M.pts.forEach((q) => {
        const whole = Math.abs(q[0] - Math.round(q[0])) < 1e-6 && Math.abs(q[1] - Math.round(q[1])) < 1e-6;
        ctx.s('circle', { cx: C.fmtNum(q[0]), cy: C.fmtNum(q[1]), r: M.latName === 'sq2' && !whole ? 0.022 : 0.036 }, dots);
      });
      (d.deco || []).forEach((x) => drawDeco(ctx, board, x.t, M.W(x.at[0], x.at[1])));
      const marksG = ctx.s('g', { class: 'ms-marks' }, board);
      const countG = ctx.s('g', { class: 'ms-count' }, top);
      const hintG = ctx.s('g', { class: 'ms-hintg' }, top);
      const ghostG = ctx.s('g', { class: 'ms-ghostg' }, top);

      const narrow = wb.size().w < 560;
      const trayCap = R.kind === 'add' ? R.k : Math.max(2, R.k);
      const th = Math.max(1.25, Math.min(Math.max(2.6, r.y1 - r.y0), 0.55 + 0.21 * (trayCap + 1)));
      const colX = narrow ? (r.x0 + r.x1) / 2 - 0.8 : r.x1 + 1.05;
      let colY = narrow ? r.y1 + 1.1 : r.y0;
      let card = null;
      if (goal.shape && goal.motions === 'translate' && d.card !== false) {
        card = { x: colX, y: colY - 0.2, w: 1.6, h: 1.6 };
        drawCard(ctx, board, card, M.target);
        colY = card.y + card.h + 0.9;
      }
      const tray = { x: colX, y: narrow || card ? colY : (r.y0 + r.y1) / 2 - th / 2, w: 1.6, h: th };
      const trayEl = kit.tray(board, tray, R.kind === 'remove' ? 'taken away' : R.kind === 'add' ? 'spare matches' : 'set aside');
      const all = [[r.x0 - 0.45, r.y0 - 0.45], [r.x1 + 0.45, r.y1 + 0.45], [tray.x, tray.y - 0.5], [tray.x + tray.w, tray.y + tray.h + 0.2]];
      if (card) all.push([card.x, card.y - 0.4]);
      const bb = G.bbox([all]);
      wb.setBounds({ x0: bb.x0 - 0.3, y0: bb.y0 - 0.3, x1: bb.x1 + 0.3, y1: bb.y1 + 0.3 }, 0.05);

      /* the matches */
      const add = (spec) => wb.add(Object.assign({ type: 'match', kind: 'match', snap: false, rotate: M.lat.turn || false }, spec));
      S0.forEach((e, i) => {
        const s = M.startSegs[i], E = M.edges[e];
        add({ id: 'm' + i, name: 'Match ' + (i + 1), x: E.mid[0], y: E.mid[1], rot: G.normDeg(G.angle(G.sub(s[1], s[0]))),
          move: R.kind !== 'add', remove: R.kind !== 'add', data: { e: E.key, home: E.key } });
      });
      if (R.kind === 'add') {
        for (let j = 0; j < R.k; j++) add({ id: 's' + j, name: 'Spare match ' + (j + 1), x: tray.x, y: tray.y, rot: j % 2 ? 180 : 0, move: true, remove: true, data: { e: null, spare: true, t: j + 1 } });
      }

      const pieces = () => wb.all().filter((o) => o.type === 'match');
      const eOf = (o) => (o.data.e == null ? null : M.eidx.get(o.data.e));
      function occNow(except) {
        const occ = new Uint8Array(M.edges.length);
        pieces().forEach((o) => { if (o !== except) { const e = eOf(o); if (e != null) occ[e] = 1; } });
        return occ;
      }
      function whoOn() { const m = new Map(); pieces().forEach((o) => { const e = eOf(o); if (e != null) m.set(e, o); }); return m; }
      let tseq = 100;

      function putOn(o, E) {
        o.x = E.mid[0]; o.y = E.mid[1];
        o.rot = kit.facing(E.ang, o.rot);
        o.data.e = E.key;
        delete o.data.t;
        wb.renderObj(o);
      }
      function toTray(o) { o.data.e = null; o.data.t = ++tseq; }
      function layoutTray(glide) {
        const inTray = pieces().filter((o) => o.data.e == null).sort((a, b) => (a.data.t || 0) - (b.data.t || 0) || (a.id < b.id ? -1 : 1));
        inTray.forEach((o, i) => {
          const s = kit.traySpot(tray, i, inTray.length);
          const from = { x: o.x, y: o.y, rot: o.rot };
          const rot = kit.facing(0, o.rot);
          if (Math.abs(o.x - s.x) < 1e-6 && Math.abs(o.y - s.y) < 1e-6 && Math.abs(G.normDeg(o.rot) - rot) < 1e-6) return;
          o.x = s.x; o.y = s.y; o.rot = rot;
          wb.renderObj(o);
          if (glide && glide !== o) kit.glide(wb, o, from, 200);
        });
      }
      function drawMarks() {
        marksG.innerHTML = '';
        if (R.kind === 'add') return;
        const occ = occNow();
        S0.forEach((e) => { if (!occ[e]) kit.ghost(marksG, M.edges[e].a, M.edges[e].b, 'back'); });
      }
      function stats() {
        const occ = occNow();
        let vac = 0;
        S0.forEach((e) => { if (!occ[e]) vac++; });
        const spOn = pieces().filter((o) => o.data.spare && o.data.e != null).length;
        if (R.kind === 'move') ctx.stat('Moved', vac + ' of ' + R.k);
        else if (R.kind === 'remove') ctx.stat('Taken away', vac + ' of ' + R.k);
        else ctx.stat('Added', spOn + ' of ' + R.k);
        if (noun) ctx.stat(cap(noun) + 's', evalState(M, occ, goal, gs).n);
      }
      function sync(glide) { layoutTray(glide); drawMarks(); stats(); }

      /* where a dragged match would land */
      const canTray = (o) => (R.kind === 'add' ? !!o.data.spare : true);
      function allowed(o) {
        if (R.kind === 'remove') { const h = M.eidx.get(o.data.home); return h == null ? [] : [h]; }
        if (R.kind === 'add' && !o.data.spare) return [];
        return null; // anywhere
      }
      const inTrayBox = (pt) => pt[0] > tray.x - 0.3 && pt[0] < tray.x + tray.w + 0.3 && pt[1] > tray.y - 0.35 && pt[1] < tray.y + tray.h + 0.3;
      function target(o, pt) {
        if (inTrayBox(pt)) return canTray(o) ? { tray: true } : null;
        const occ = occNow(o);
        const list = allowed(o);
        let best = null, bd = 0.62;
        const test = (E) => {
          const dd = G.dist(E.mid, pt);
          if (dd >= bd + 0.15 || !freeFor(M, occ, E.i)) return;
          let score = dd;
          if (M.lat.turn) {
            let da = Math.abs(E.ang - G.normDeg(o.rot) % 180);
            da = Math.min(da, 180 - da);
            if (da > 45) score += 0.14;
          }
          if (score < bd) { bd = score; best = E; }
        };
        if (list) list.forEach((i) => test(M.edges[i])); else M.edges.forEach(test);
        return best ? { e: best } : null;
      }

      /* dragging */
      let drag = null;
      wb.handlers.pick = (o, objs) => {
        if (o.type !== 'match') return;
        if (objs.length > 1) { objs.length = 0; if (o.move !== false) objs.push(o); wb.select([o]); }
        kit.stop(o.id);
        clearHint();
        drag = { o, from: { x: o.x, y: o.y, rot: o.rot, e: o.data.e }, last: undefined };
        if (o.move === false) ctx.toast('The matches on the table stay put here: add spares from the box.');
      };
      wb.handlers.dragging = (objs) => {
        const o = objs[0];
        if (!o || !drag || drag.o !== o || busy) return;
        const tg = target(o, [o.x, o.y]);
        const key = tg ? (tg.tray ? 'tray' : tg.e.key) : '';
        if (key === drag.last) return;
        drag.last = key;
        ghostG.innerHTML = '';
        trayEl.classList.toggle('hot', !!(tg && tg.tray));
        if (tg && tg.e) {
          kit.ghost(ghostG, tg.e.a, tg.e.b);
          const nr = kit.facing(tg.e.ang, o.rot);
          if (Math.abs(nr - G.normDeg(o.rot)) > 0.5) { o.rot = nr; wb.renderObj(o); o.el.classList.add('drag'); }
        }
      };
      wb.handlers.settle = (objs, why) => {
        const o = objs.find((q) => q.type === 'match');
        ghostG.innerHTML = '';
        trayEl.classList.remove('hot');
        if (!o) return;
        const from = { x: o.x, y: o.y, rot: o.rot };
        if (why === 'rotate' || why === 'flip') { turnInPlace(o); drag = null; sync(); kit.glide(wb, o, from, 150); return; }
        const tg = target(o, [o.x, o.y]);
        let landed = true;
        if (tg && tg.e) putOn(o, tg.e);
        else if (tg && tg.tray) toTray(o);
        else {
          landed = false;
          const f = drag && drag.o === o ? drag.from : { e: o.data.e };
          const E = f.e != null ? M.edges[M.eidx.get(f.e)] : null;
          if (E) putOn(o, E); else toTray(o);
          if (R.kind === 'remove' && !(tg && tg.tray)) ctx.toast('Here matches are only taken away: drop it in the box.');
          else if (R.kind === 'add' && !o.data.spare) ctx.toast('The matches on the table stay put: add spares from the box.');
          else ctx.toast('No free place there.');
        }
        drag = null;
        sync(o);
        kit.glide(wb, o, from, landed ? 150 : 260);
        ctx.sfx(landed ? 'snap' : 'tap');
      };
      function turnInPlace(o) {
        const E0 = eOf(o) != null ? M.edges[eOf(o)] : null;
        if (!E0) { o.rot = kit.facing(0, o.rot); wb.renderObj(o); return; }
        const u = [Math.cos(o.rot * Math.PI / 180) / 2, Math.sin(o.rot * Math.PI / 180) / 2];
        const k = M.eidx.get(ek(G.sub(E0.mid, u), G.add(E0.mid, u)));
        const list = allowed(o);
        if (k != null && k !== E0.i && (!list || list.includes(k)) && freeFor(M, occNow(o), k)) { putOn(o, M.edges[k]); return; }
        putOn(o, E0);
        ctx.toast('No room to turn it there.');
      }
      wb.handlers.remove = (objs) => {
        const ok = objs.filter((o) => o.type === 'match' && canTray(o) && o.data.e != null);
        if (!ok.length || busy) return true;
        const from = ok.map((o) => ({ o, t: { x: o.x, y: o.y, rot: o.rot } }));
        ok.forEach(toTray);
        wb.select([]);
        sync();
        from.forEach((f) => kit.glide(wb, f.o, f.t, 240));
        ctx.sfx('tap');
        ctx.changed('remove');
        return true;
      };
      wb.on('tap', (ev) => {
        const o = ev && ev.obj;
        drag = null;
        if (!o || o.type !== 'match' || busy) return;
        if (R.kind === 'remove') {
          const from = { x: o.x, y: o.y, rot: o.rot };
          if (o.data.e != null) toTray(o);
          else {
            const h = M.eidx.get(o.data.home);
            if (h == null || !freeFor(M, occNow(o), h)) { ctx.toast('Its place is taken.'); return; }
            putOn(o, M.edges[h]);
          }
          wb.select([]);
          sync();
          kit.glide(wb, o, from, 240);
          ctx.sfx('tap');
          ctx.changed('take');
        } else if (R.kind === 'add' && !o.data.spare) ctx.toast('The matches on the table stay put: add spares from the box.');
      });
      const onRestore = () => { drag = null; clearHint(); sync(); };
      wb.on('restore', onRestore);

      /* counting aloud */
      let countRun = 0;
      function countThem() {
        const run = ++countRun;
        countG.innerHTML = '';
        const ev = evalState(M, occNow(), goal, gs);
        const list = ev.done.slice().sort((a, b) => M.shapes[a].size - M.shapes[b].size || G.centroid(M.shapes[a].poly)[1] - G.centroid(M.shapes[b].poly)[1] || G.centroid(M.shapes[a].poly)[0] - G.centroid(M.shapes[b].poly)[0]);
        if (!list.length) { ctx.say('I count no ' + noun + 's at all.', 'info'); return; }
        let i = 0;
        const step = () => {
          if (run !== countRun) return;
          if (i >= list.length) {
            ctx.say('I count **' + list.length + '** ' + noun + (list.length === 1 ? '' : 's') + ': ' + sizeWords(M, list, noun) + '.' + (ev.loose ? ' ' + cap(matches(ev.loose)) + ' belong to none.' : ''), 'info');
            later(() => { if (run === countRun) countG.innerHTML = ''; }, C.anim(1600));
            return;
          }
          const s = M.shapes[list[i]];
          const c = G.centroid(s.poly);
          const inset = s.poly.map((q) => G.lerp(q, c, Math.min(0.3, 0.14 / s.size + 0.02 * (i % 3))));
          const g = ctx.s('g', { class: 'ms-counted' }, countG);
          ctx.s('path', { d: C.pathOf(inset) }, g);
          kit.text(g, c[0], c[1] + 0.13, String(i + 1), 0.36, 'ms-count-n');
          i++;
          ctx.sfx('tap');
          later(step, C.anim(Math.max(160, 520 - list.length * 12)));
        };
        step();
      }
      if (noun) ctx.button('Count them', countThem, 'small');

      /* hints and the solution */
      let hintTimer = null;
      function clearHint() {
        clearTimeout(hintTimer);
        hintG.innerHTML = '';
        pieces().forEach((o) => o.el && o.el.classList.remove('mk-hint'));
      }
      let solCache = null, variants = null;
      const keyOf = (F) => Array.from(F).sort((a, b) => a - b).join(',');
      function pushSol(list, seen, s) {
        if (s.on.some((e) => e == null) || s.off.some((e) => e == null)) return;
        const F = finalOf(S0, s);
        const k = keyOf(F);
        if (seen.has(k)) return;
        seen.add(k);
        list.push({ F, off: s.off, on: s.on });
      }
      function solVariants() {
        if (variants) return variants;
        const out = [], seen = new Set();
        const st = storedSol(M, d);
        pushSol(out, seen, st);
        symmetries(M, S0).forEach((f) => pushSol(out, seen, { off: st.off.map(f), on: st.on.map(f) }));
        return (variants = out);
      }
      function allSols() {
        if (solCache) return solCache;
        const out = solVariants().slice(), seen = new Set(out.map((s) => keyOf(s.F)));
        try { solveAll(M, S0, goal, R.kind, R.k, { cap: 250000, max: 300 }).sols.forEach((s) => pushSol(out, seen, s)); } catch (e) { /* the variants will do */ }
        return (solCache = out);
      }
      function bestPlan() {
        const occ = occNow();
        const now = new Set();
        for (let e = 0; e < occ.length; e++) if (occ[e]) now.add(e);
        const score = (s) => {
          let wrong = 0, cost = 0;
          now.forEach((e) => { if (!s.F.has(e)) { cost++; if (!S0set.has(e)) wrong++; } });
          s.F.forEach((e) => { if (!now.has(e)) { cost++; if (S0set.has(e)) wrong++; } });
          return { wrong, cost };
        };
        const pick = (list) => {
          let best = null, bs = null;
          list.forEach((s) => { const sc = score(s); if (!bs || sc.wrong < bs.wrong || (sc.wrong === bs.wrong && sc.cost < bs.cost)) { best = s; bs = sc; } });
          return best ? { sol: best, sc: bs, now } : null;
        };
        let P = pick(solVariants());
        if (!P || P.sc.wrong) { const Q = pick(allSols()); if (Q) P = Q; }
        return P;
      }
      function nearestFirst(movers, E) {
        let bi = 0, bd = Infinity;
        movers.forEach((o, i) => { const dd = G.dist([o.x, o.y], E.mid); if (dd < bd) { bd = dd; bi = i; } });
        return movers.splice(bi, 1)[0];
      }
      function stepsTo(P) {
        const { sol, now } = P;
        const who = whoOn();
        const needOff = Array.from(now).filter((e) => !sol.F.has(e));
        const needOn = Array.from(sol.F).filter((e) => !now.has(e));
        const trayPcs = pieces().filter((o) => o.data.e == null);
        const steps = [];
        if (R.kind === 'remove') {
          needOn.forEach((e) => { const o = trayPcs.find((q) => q.data.home === M.edges[e].key); if (o) steps.push({ o, to: M.edges[e], back: true }); });
          needOff.forEach((e) => steps.push({ o: who.get(e), to: null }));
        } else {
          const movers = needOff.map((e) => who.get(e)).filter((o) => R.kind !== 'add' || o.data.spare);
          const spare = trayPcs.filter((o) => canTray(o));
          needOn.forEach((e) => {
            const E = M.edges[e];
            const o = movers.length ? nearestFirst(movers, E) : spare.shift();
            if (o) steps.push({ o, to: E, wrong: o.data.e != null && !S0set.has(eOf(o)) });
          });
          movers.forEach((o) => steps.push({ o, to: null }));
        }
        return steps.filter((s) => s.o);
      }
      function showHint(o, E) {
        clearHint();
        if (o && o.el) o.el.classList.add('mk-hint');
        if (E) kit.ghost(hintG, E.a, E.b, 'hint');
        hintTimer = setTimeout(clearHint, 5000);
      }

      function check() {
        const occ = occNow();
        const trayOrig = pieces().filter((o) => o.data.e == null && !o.data.spare).length;
        let vac = 0;
        S0.forEach((e) => { if (!occ[e]) vac++; });
        const spOn = pieces().filter((o) => o.data.spare && o.data.e != null).length;
        const now = [];
        for (let e = 0; e < occ.length; e++) if (occ[e]) now.push(e);
        if (!clashFree(M, now)) return { solved: false, msg: 'Two matches cross or lie on top of each other.' };
        if (R.kind === 'move') {
          if (trayOrig) return { solved: false, msg: cap(C.plural(trayOrig, 'match is', 'matches are')) + ' still in the box: in this puzzle every match stays on the table.' };
          if (vac > R.k) return { solved: false, msg: 'That is ' + matches(vac) + ' moved; the puzzle allows ' + R.k + '.' };
        } else if (R.kind === 'remove') {
          if (vac !== R.k) return { solved: false, msg: vac < R.k ? 'Take away ' + (R.k - vac) + ' more.' : 'That is too many: take away exactly ' + matches(R.k) + '.' };
        } else if (spOn !== R.k) return { solved: false, msg: 'Add ' + (R.k - spOn) + ' more.' };
        const ev = evalState(M, occ, goal, gs);
        if (goal.shape) {
          if (ev.ok) return { solved: true, msg: goal.outside ? 'Same shape, and the ' + (((d.deco || [])[0] || {}).t || 'cherry') + ' is out.' : 'That is the figure.' };
          if (ev.same && !ev.out) return { solved: false, msg: 'The same shape — but the ' + (((d.deco || [])[0] || {}).t || 'cherry') + ' is still inside.' };
          return { solved: false, msg: 'That is not the figure yet.' };
        }
        if (ev.ok) return { solved: true, msg: want === 0 ? 'Not a ' + noun + ' left standing.' : cap(sizeWords(M, ev.done, noun)) + (new Set(ev.done.map((si) => M.shapes[si].size)).size > 1 ? ' — ' + num(ev.n) + ' in all.' : '.') };
        if (ev.n !== want) return { solved: false, msg: 'I count ' + num(ev.n) + ' ' + noun + (ev.n === 1 ? '' : 's') + ' (' + sizeWords(M, ev.done, noun) + '); the puzzle wants ' + num(want) + '.' };
        return { solved: false, msg: 'Exactly ' + num(want) + ' ' + noun + (want === 1 ? '' : 's') + ' — but ' + matches(ev.loose) + (ev.loose === 1 ? ' belongs' : ' belong') + ' to none of them.' };
      }

      sync();

      return {
        check,
        hint() {
          const P = bestPlan();
          if (!P) return null;
          const steps = stepsTo(P);
          if (!steps.length) return 'Every match is where it should be: press Check.';
          const st = steps[0];
          const left = R.kind === 'remove' ? steps.filter((s) => !s.back).length : steps.length;
          const more = left > 1 ? ' (' + cap(num(left)) + ' changes to go.)' : ' (That is the last one.)';
          let text;
          if (R.kind === 'remove') text = st.back ? 'The glowing match should not have been taken away: put it back on the dashed outline.' : 'Take away the glowing match.' + more;
          else if (st.to == null) text = 'The glowing match is not needed: put it in the box.';
          else if (st.o.data.e == null) text = 'Take the glowing match from the box and lay it on the dashed outline.' + more;
          else if (st.wrong) text = 'The glowing match is not where the solution needs it: move it to the dashed outline.' + more;
          else text = 'Move the glowing match to the dashed outline.' + more;
          return { text, show() { showHint(st.o, st.to); } };
        },
        solve() {
          const P = bestPlan();
          if (!P) return;
          clearHint();
          wb.select([]);
          busy = true;
          const steps = stepsTo(P);
          let i = 0;
          const next = () => {
            if (i >= steps.length) { busy = false; sync(); ctx.changed('solve'); return; }
            const st = steps[i++];
            const o = wb.get(st.o.id);
            if (o) {
              const from = { x: o.x, y: o.y, rot: o.rot };
              if (st.to) putOn(o, st.to); else toTray(o);
              sync(o);
              kit.glide(wb, o, from, 420);
              ctx.sfx('snap');
            }
            later(next, C.anim(500));
          };
          next();
        },
        explain() {
          if (goal.shape) return '';
          const st = storedSol(M, d);
          const F = Array.from(finalOf(S0, st));
          const ev = evalState(M, occOf(M, F), goal, gs);
          const verb = R.kind === 'move' ? 'After moving ' : R.kind === 'remove' ? 'After taking away ' : 'After adding ';
          if (want === 0) return verb + matches(R.k) + ' not one ' + noun + ' is left: every square the full figure had has lost at least one side. Fewer matches cannot do it.';
          return verb + matches(R.k) + ' the figure has ' + sizeWords(M, ev.done, noun) + ' — ' + num(ev.n) + ' in all' + (goal.noLoose ? ', and every match is a side of at least one of them' : '') + '. Squares hiding inside bigger ones (and big ones made of small ones) are the usual trap.'.replace('Squares', noun === 'square' ? 'Squares' : 'Triangles');
        },
        getState() { return { v: 1 }; },
        setState() { busy = false; countRun++; countG.innerHTML = ''; ghostG.innerHTML = ''; onRestore(); },
        key(ev) {
          if (ev.type !== 'keydown') return false;
          const dir = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }[ev.key];
          if (!dir) return false;
          const sel = wb.selected().filter((o) => o.type === 'match');
          if (sel.length !== 1) return false;
          const o = sel[0];
          if (busy || o.move === false || R.kind === 'remove' || eOf(o) == null) return true;
          const cur = [o.x, o.y], occ = occNow(o), list = allowed(o);
          let best = null, bd = Infinity;
          (list ? list.map((i) => M.edges[i]) : M.edges).forEach((E) => {
            const v = G.sub(E.mid, cur), l = G.len(v);
            if (l < 0.2 || G.dot(v, dir) / l < 0.64 || !freeFor(M, occ, E.i)) return;
            if (l < bd) { bd = l; best = E; }
          });
          if (!best) return true;
          const from = { x: o.x, y: o.y, rot: o.rot };
          putOn(o, best);
          sync();
          kit.glide(wb, o, from, 120);
          wb.drawSel();
          ctx.changed('move');
          return true;
        },
        destroy() {
          timers.forEach(clearTimeout);
          clearTimeout(hintTimer);
          countRun++;
          pieces().forEach((o) => kit.stop(o.id));
          wb.off('restore', onRestore);
          ['pick', 'dragging', 'settle', 'remove'].forEach((h) => { wb.handlers[h] = null; });
        }
      };
    },

    thumb(p) {
      const d = p.data, kit = C.matchKit;
      const lat = LAT[d.lattice || 'sq'];
      if (!lat || !kit) return '';
      const segs = d.start.map((e) => [lat.world(e[0], e[1]), lat.world(e[2], e[3])]);
      const pts = [];
      segs.forEach((s) => pts.push(s[0], s[1]));
      const deco = (d.deco || []).map((x) => ({ t: x.t, at: lat.world(x.at[0], x.at[1]) }));
      deco.forEach((x) => pts.push(x.at));
      const b = G.bbox([pts]);
      const pad = 0.5 + Math.max(b.w, b.h) * 0.06;
      let s = kit.svgOpen(b, pad);
      deco.forEach((x) => { s += '<circle cx="' + C.fmtNum(x.at[0]) + '" cy="' + C.fmtNum(x.at[1]) + '" r=".17" fill="' + (x.t === 'olive' ? '#7c9a3a' : '#d62839') + '"/>'; });
      segs.forEach((sg) => { s += kit.svgMatch(sg[0], sg[1], Math.max(1, Math.max(b.w, b.h) / 5)); });
      return s + '</svg>';
    }
  });

  /* ---------- things on the table ---------- */

  function drawDeco(ctx, parent, t, at) {
    const g = ctx.s('g', { class: 'ms-deco ms-' + t, transform: 'translate(' + C.fmtNum(at[0]) + ' ' + C.fmtNum(at[1]) + ')' }, parent);
    if (t === 'olive') {
      ctx.s('ellipse', { cx: 0, cy: 0, rx: 0.2, ry: 0.15, class: 'ms-olive' }, g);
      ctx.s('circle', { cx: 0.08, cy: 0, r: 0.055, class: 'ms-pimento' }, g);
      return;
    }
    ctx.s('path', { d: 'M0.02 -0.12 Q0.06 -0.36 0.26 -0.44', class: 'ms-stem' }, g);
    ctx.s('circle', { cx: 0, cy: 0, r: 0.16, class: 'ms-cherry' }, g);
    ctx.s('ellipse', { cx: -0.06, cy: -0.06, rx: 0.05, ry: 0.03, class: 'ms-cherry-glint' }, g);
  }
  function drawCard(ctx, parent, box, target) {
    const kit = C.matchKit;
    const g = ctx.s('g', { class: 'ms-card' }, parent);
    ctx.s('rect', { x: box.x, y: box.y, width: box.w, height: box.h, rx: 0.1 }, g);
    const pts = [];
    target.forEach((s) => pts.push(s[0], s[1]));
    const b = G.bbox([pts]);
    const k = Math.min((box.w - 0.4) / Math.max(b.w, 0.5), (box.h - 0.4) / Math.max(b.h, 0.5), 0.5);
    const ox = box.x + box.w / 2 - (b.x0 + b.w / 2) * k, oy = box.y + box.h / 2 - (b.y0 + b.h / 2) * k;
    const f = (q) => [C.fmtNum(q[0] * k + ox), C.fmtNum(q[1] * k + oy)];
    target.forEach((s) => { const a = f(s[0]), c = f(s[1]); ctx.s('line', { x1: a[0], y1: a[1], x2: c[0], y2: c[1] }, g); });
    kit.text(g, box.x + box.w / 2, box.y - 0.14, 'make it face this way', 0.22, 'mk-tray-label');
  }

  C.css('matchsticks', `
    .ms-table { fill: var(--board); stroke: var(--line); stroke-width: .03; }
    .ms-dots circle { fill: var(--grid-2); }
    .ms-cherry { fill: #d62839; stroke: #7d0f1c; stroke-width: .02; }
    .ms-cherry-glint { fill: rgba(255, 255, 255, .55); }
    .ms-stem { fill: none; stroke: #5b7f2a; stroke-width: .035; stroke-linecap: round; }
    .ms-olive { fill: #7c9a3a; stroke: #3f5418; stroke-width: .02; }
    .ms-pimento { fill: #d62839; }
    .ms-card rect { fill: var(--panel-2); stroke: var(--line); stroke-width: .025; }
    .ms-card line { stroke: var(--wood); stroke-width: .07; stroke-linecap: round; }
    .ms-counted path { fill: rgba(255, 209, 102, .16); stroke: var(--gold); stroke-width: .045; stroke-linejoin: round; }
    .ms-count-n { font-weight: 800; font-family: "Segoe UI", system-ui, sans-serif; fill: var(--gold); paint-order: stroke; stroke: var(--board); stroke-width: 3px; }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
