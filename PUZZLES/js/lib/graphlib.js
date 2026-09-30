/* The Puzzle Cabinet · js/lib/graphlib.js
 *
 * Small graph tools shared by the graphs and chessmen engines and their
 * generators. Node-safe: no DOM.
 *
 *   Cabinet.GraphLib.degrees(n, E)             degree of every vertex (a loop counts 2)
 *   .odd(n, E)                                  vertices of odd degree
 *   .eulerFrom(n, E, used, s)                   an Euler trail of the unused edges starting at s, or null
 *   .trailEnd(E, start, trail)                  where a trail ends (or -1 if it breaks the rules)
 *   .connected(n, adj, keep)                    are the kept vertices connected?
 *   .adjacency(n, E)                            neighbour lists (simple graph)
 *   .hamilton(n, adj, opts)                     Hamilton cycle / path search (see below)
 *   .crossings(P, E)                            pairs of straight edges that cross
 *   .fitSimilarity(S, P, allowMirror)           the turn + scale + shift (and mirror) laying S over P
 *
 * Edges are arrays [a, b, ...extra]; only a and b matter here.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet = root.Cabinet || {};

  function degrees(n, E, used) {
    const d = new Array(n).fill(0);
    for (let i = 0; i < E.length; i++) {
      if (used && used[i]) continue;
      d[E[i][0]]++; d[E[i][1]]++;
    }
    return d;
  }

  function odd(n, E, used) {
    const d = degrees(n, E, used), out = [];
    for (let i = 0; i < n; i++) if (d[i] % 2) out.push(i);
    return out;
  }

  function other(e, v) { return e[0] === v ? e[1] : e[0]; }

  // where a trail from `start` along the edge list ends; -1 if an edge is used twice or does not continue
  function trailEnd(E, start, trail) {
    const seen = new Set();
    let cur = start;
    for (const i of trail) {
      const e = E[i];
      if (!e || seen.has(i)) return -1;
      seen.add(i);
      if (e[0] === cur) cur = e[1];
      else if (e[1] === cur) cur = e[0];
      else return -1;
    }
    return cur;
  }

  /* Hierholzer: an Euler trail through every edge not marked in `used`,
   * starting at s. Returns the list of edge indices, [] when nothing is left,
   * or null when no such trail exists. */
  function eulerFrom(n, E, used, s) {
    used = used || [];
    const rem = [];
    for (let i = 0; i < E.length; i++) if (!used[i]) rem.push(i);
    if (!rem.length) return [];
    const d = new Array(n).fill(0);
    rem.forEach((i) => { d[E[i][0]]++; d[E[i][1]]++; });
    const od = [];
    for (let i = 0; i < n; i++) if (d[i] % 2) od.push(i);
    if (!((od.length === 0 && d[s] > 0) || (od.length === 2 && (od[0] === s || od[1] === s)))) return null;
    const adj = [];
    for (let i = 0; i < n; i++) adj.push([]);
    rem.forEach((i) => { adj[E[i][0]].push(i); if (E[i][1] !== E[i][0]) adj[E[i][1]].push(i); });
    // every vertex with an edge left must be reachable from s
    const seen = new Uint8Array(n);
    const q = [s];
    seen[s] = 1;
    while (q.length) {
      const v = q.pop();
      for (const i of adj[v]) { const w = other(E[i], v); if (!seen[w]) { seen[w] = 1; q.push(w); } }
    }
    for (let i = 0; i < n; i++) if (d[i] > 0 && !seen[i]) return null;
    const ptr = new Int32Array(n);
    const taken = new Uint8Array(E.length);
    const stack = [[s, -1]];
    const out = [];
    while (stack.length) {
      const top = stack[stack.length - 1], v = top[0];
      while (ptr[v] < adj[v].length && taken[adj[v][ptr[v]]]) ptr[v]++;
      if (ptr[v] === adj[v].length) { out.push(top[1]); stack.pop(); }
      else {
        const i = adj[v][ptr[v]];
        taken[i] = 1;
        stack.push([other(E[i], v), i]);
      }
    }
    out.reverse();
    out.shift();
    return out.length === rem.length ? out : null;
  }

  function adjacency(n, E) {
    const adj = [];
    for (let i = 0; i < n; i++) adj.push([]);
    E.forEach((e) => {
      if (e[0] === e[1]) return;
      if (!adj[e[0]].includes(e[1])) adj[e[0]].push(e[1]);
      if (!adj[e[1]].includes(e[0])) adj[e[1]].push(e[0]);
    });
    return adj;
  }

  function connected(n, adj, keep) {
    let s = -1, count = 0;
    for (let i = 0; i < n; i++) if (keep[i]) { count++; if (s < 0) s = i; }
    if (count <= 1) return true;
    const seen = new Uint8Array(n);
    const q = [s];
    seen[s] = 1;
    let got = 1;
    while (q.length) {
      const v = q.pop();
      for (const w of adj[v]) if (keep[w] && !seen[w]) { seen[w] = 1; got++; q.push(w); }
    }
    return got === count;
  }

  /* Hamilton search on a simple graph given as neighbour lists.
   *   opts.closed   true: a round trip (cycle); false: a path
   *   opts.prefix   the path must begin with these vertices (default: [opts.from] or [0] for cycles)
   *   opts.to       for paths: the last vertex
   *   opts.skip     vertices that need not (must not) be visited
   *   opts.max      stop after this many solutions (default 1)
   *   opts.limit    give up after this many search steps (result.aborted)
   * Returns { sols: [[v...], ...], aborted, nodes }. A cycle is returned without repeating its start. */
  function hamilton(n, adj, opts) {
    opts = opts || {};
    const closed = opts.closed !== false;
    const max = opts.max || 1;
    const limit = opts.limit || 2e6;
    const skip = new Uint8Array(n);
    (opts.skip || []).forEach((v) => { skip[v] = 1; });
    let total = 0;
    for (let i = 0; i < n; i++) if (!skip[i]) total++;
    let prefix = opts.prefix && opts.prefix.length ? opts.prefix.slice() : null;
    if (!prefix) {
      if (opts.from != null) prefix = [opts.from];
      else if (closed) { let s = 0; while (s < n && skip[s]) s++; prefix = [s]; }
    }
    const res = { sols: [], aborted: false, nodes: 0 };
    const starts = prefix ? [prefix] : [];
    if (!prefix) for (let s = 0; s < n; s++) if (!skip[s]) starts.push([s]);
    const to = opts.to == null ? -1 : opts.to;

    const vis = new Uint8Array(n);
    const path = [];

    function avail(x, end, start) {
      // how many ways x can still be entered or left
      let k = 0;
      for (const w of adj[x]) {
        if (skip[w]) continue;
        if (!vis[w] || w === end || (closed && w === start)) k++;
      }
      return k;
    }

    function prune(end, start) {
      // every unvisited vertex needs two free sides (one if it may be the last)
      const keep = new Uint8Array(n);
      let rest = 0;
      for (let x = 0; x < n; x++) {
        if (skip[x] || vis[x]) continue;
        rest++;
        keep[x] = 1;
        const a = avail(x, end, start);
        const need = (!closed && (to < 0 || x === to)) ? 1 : 2;
        if (a < need) return true;
      }
      if (!rest) return false;
      if (!closed && to >= 0 && vis[to]) return true;
      keep[end] = 1;
      if (closed) keep[start] = 1;
      return !connected(n, adj, keep);
    }

    function done() {
      const s = path[0], e = path[path.length - 1];
      if (closed) return adj[e].includes(s);
      return to < 0 || e === to;
    }

    function dfs() {
      if (res.sols.length >= max) return;
      if (++res.nodes > limit) { res.aborted = true; return; }
      if (path.length === total) { if (done()) res.sols.push(path.slice()); return; }
      const end = path[path.length - 1], start = path[0];
      const cand = [];
      for (const w of adj[end]) {
        if (skip[w] || vis[w]) continue;
        if (!closed && to >= 0 && w === to && path.length !== total - 1) continue;
        cand.push(w);
      }
      // fewest onward moves first (Warnsdorff's rule)
      if (cand.length > 1) {
        const sc = cand.map((w) => { let k = 0; for (const x of adj[w]) if (!vis[x] && !skip[x]) k++; return k; });
        const idx = cand.map((w, i) => i).sort((a, b) => sc[a] - sc[b]);
        const c2 = idx.map((i) => cand[i]);
        cand.length = 0;
        c2.forEach((w) => cand.push(w));
      }
      for (const w of cand) {
        vis[w] = 1; path.push(w);
        if (!prune(w, start)) dfs();
        path.pop(); vis[w] = 0;
        if (res.sols.length >= max || res.aborted) return;
      }
    }

    for (const pre of starts) {
      // the prefix must be a legal path
      let ok = true;
      vis.fill(0);
      path.length = 0;
      for (let i = 0; i < pre.length; i++) {
        const v = pre[i];
        if (skip[v] || vis[v] || (i > 0 && !adj[pre[i - 1]].includes(v))) { ok = false; break; }
        vis[v] = 1;
        path.push(v);
      }
      if (!ok) continue;
      if (path.length === total) { if (done()) res.sols.push(path.slice()); }
      else if (!prune(path[path.length - 1], path[0])) dfs();
      if (res.sols.length >= max || res.aborted) break;
    }
    return res;
  }

  function segCross(p1, p2, p3, p4) {
    const rx = p2[0] - p1[0], ry = p2[1] - p1[1], sx = p4[0] - p3[0], sy = p4[1] - p3[1];
    const den = rx * sy - ry * sx;
    if (Math.abs(den) < 1e-12) {
      // parallel: only collinear overlaps count
      const qx = p3[0] - p1[0], qy = p3[1] - p1[1];
      if (Math.abs(qx * ry - qy * rx) > 1e-9 * (Math.abs(rx) + Math.abs(ry) + 1)) return false;
      const l2 = rx * rx + ry * ry || 1;
      const t0 = (qx * rx + qy * ry) / l2, t1 = ((p4[0] - p1[0]) * rx + (p4[1] - p1[1]) * ry) / l2;
      const lo = Math.min(t0, t1), hi = Math.max(t0, t1);
      return hi > 1e-6 && lo < 1 - 1e-6;
    }
    const qx = p3[0] - p1[0], qy = p3[1] - p1[1];
    const t = (qx * sy - qy * sx) / den, u = (qx * ry - qy * rx) / den;
    const eps = 1e-9;
    return t > eps && t < 1 - eps && u > eps && u < 1 - eps;
  }

  // pairs [i, j] of straight edges that cross (edges sharing a vertex only count when they overlap)
  function crossings(P, E) {
    const out = [];
    for (let i = 0; i < E.length; i++) {
      const a = E[i];
      for (let j = i + 1; j < E.length; j++) {
        const b = E[j];
        const share = a[0] === b[0] || a[0] === b[1] || a[1] === b[0] || a[1] === b[1];
        if (share) {
          // two edges from one vertex overlap only if they point the same way
          const s = a[0] === b[0] || a[0] === b[1] ? a[0] : a[1];
          const x = a[0] === s ? a[1] : a[0], y = b[0] === s ? b[1] : b[0];
          const ux = P[x][0] - P[s][0], uy = P[x][1] - P[s][1], vx = P[y][0] - P[s][0], vy = P[y][1] - P[s][1];
          const cr = ux * vy - uy * vx, dt = ux * vx + uy * vy;
          if (Math.abs(cr) < 1e-9 * (Math.hypot(ux, uy) * Math.hypot(vx, vy) + 1e-12) && dt > 0) out.push([i, j]);
          continue;
        }
        if (segCross(P[a[0]], P[a[1]], P[b[0]], P[b[1]])) out.push([i, j]);
      }
    }
    return out;
  }

  /* The similarity (turn, uniform scale, shift, and a mirror if allowed)
   * that best lays the points S over the points P (least squares).
   * Returns { apply(p), err, mirror, scale, angle }. */
  function fitSimilarity(S, P, allowMirror) {
    const n = S.length;
    const cs = [0, 0], cp = [0, 0];
    for (let i = 0; i < n; i++) { cs[0] += S[i][0]; cs[1] += S[i][1]; cp[0] += P[i][0]; cp[1] += P[i][1]; }
    cs[0] /= n; cs[1] /= n; cp[0] /= n; cp[1] /= n;
    function tryFit(m) {
      let a = 0, b = 0, ss = 0;
      for (let i = 0; i < n; i++) {
        const sx = m * (S[i][0] - cs[0]), sy = S[i][1] - cs[1];
        const px = P[i][0] - cp[0], py = P[i][1] - cp[1];
        a += sx * px + sy * py;
        b += sx * py - sy * px;
        ss += sx * sx + sy * sy;
      }
      const k = ss ? Math.hypot(a, b) / ss : 1;
      const th = Math.atan2(b, a), co = Math.cos(th), si = Math.sin(th);
      const apply = (p) => {
        const sx = m * (p[0] - cs[0]), sy = p[1] - cs[1];
        return [cp[0] + k * (co * sx - si * sy), cp[1] + k * (si * sx + co * sy)];
      };
      let err = 0;
      for (let i = 0; i < n; i++) { const q = apply(S[i]); err += (q[0] - P[i][0]) ** 2 + (q[1] - P[i][1]) ** 2; }
      return { apply, err, mirror: m < 0, scale: k, angle: th * 180 / Math.PI };
    }
    const f1 = tryFit(1);
    if (!allowMirror) return f1;
    const f2 = tryFit(-1);
    return f2.err < f1.err ? f2 : f1;
  }

  C.GraphLib = { degrees, odd, other, trailEnd, eulerFrom, adjacency, connected, hamilton, segCross, crossings, fitSimilarity };
})(typeof window !== 'undefined' ? window : globalThis);
