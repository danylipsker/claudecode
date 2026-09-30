/* The Puzzle Cabinet · js/lib/graphgen.js
 *
 * Makers of graph puzzles, shared by engines/graphs.js (its Endless drawers)
 * and the generators in tools/gen/. Node-safe; every random choice comes
 * from the rng passed in, so the same seed gives the same puzzle.
 *
 *   Cabinet.GraphGen.build(shapes, opt)     segments, circles and arcs -> { v, e }
 *   .analyse(fig, seed)                     odd corners, a stored stroke, how often a careless stroke fails
 *   .strokeDiff(a)                          difficulty 1..5 from that analysis
 *   .star(rng, o) .rings(rng, o) .lattice(rng, o)       figures to draw in one stroke
 *   .makeStroke(rng, level)                 a one-stroke puzzle of the level (or null)
 *   .lines(rng, k) .scatter(rng, n)         untangle puzzles (from k crossing lines / a random planar net)
 *   .makeUntangle(rng, level)
 *   .roundTrip(rng, n) .makeRoundTrip(rng, level)       planar graphs with a hidden Hamilton cycle
 */
(function (root) {
  'use strict';
  const C = root.Cabinet = root.Cabinet || {};
  const GL = () => C.GraphLib;

  const TAU = Math.PI * 2;
  const r2 = (v) => Math.round(v * 100) / 100;
  const normA = (a) => ((a % TAU) + TAU) % TAU;
  const rad = (d) => d * Math.PI / 180;

  /* ---------- the figure builder ---------- */

  // shapes: { segs: [[x1, y1, x2, y2]], circles: [[cx, cy, r]], arcs: [[cx, cy, r, fromDeg, toDeg]] (clockwise on screen) }
  // opt.cross === false: lines crossing in their middles do not make a corner there
  function build(shapes, opt) {
    opt = opt || {};
    const cross = opt.cross !== false;
    const curves = [];
    (shapes.segs || []).forEach((s) => curves.push({ t: 's', a: [s[0], s[1]], b: [s[2], s[3]], hits: [] }));
    (shapes.circles || []).forEach((c) => curves.push({ t: 'c', c: [c[0], c[1]], r: c[2], hits: [] }));
    (shapes.arcs || []).forEach((c) => {
      const a0 = normA(rad(c[3]));
      let span = normA(rad(c[4]) - a0);
      if (span < 1e-9) span = TAU;
      curves.push({ t: 'a', c: [c[0], c[1]], r: c[2], a0, span, hits: [] });
    });
    const P = [];
    const vid = (p) => {
      for (let i = 0; i < P.length; i++) if (Math.hypot(P[i][0] - p[0], P[i][1] - p[1]) < 0.05) return i;
      P.push([p[0], p[1]]);
      return P.length - 1;
    };
    const paramOf = (cv, p) => {
      if (cv.t === 's') {
        const dx = cv.b[0] - cv.a[0], dy = cv.b[1] - cv.a[1];
        return ((p[0] - cv.a[0]) * dx + (p[1] - cv.a[1]) * dy) / (dx * dx + dy * dy);
      }
      const ang = normA(Math.atan2(p[1] - cv.c[1], p[0] - cv.c[0]));
      return cv.t === 'c' ? ang : normA(ang - cv.a0);
    };
    const inArc = (cv, p) => { if (cv.t !== 'a') return true; const t = paramOf(cv, p); return t <= cv.span + 1e-7 || t >= TAU - 1e-7; };
    const onCurve = (cv, p) => {
      if (cv.t === 's') {
        const t = paramOf(cv, p);
        if (t < -1e-7 || t > 1 + 1e-7) return false;
        const q = [cv.a[0] + (cv.b[0] - cv.a[0]) * t, cv.a[1] + (cv.b[1] - cv.a[1]) * t];
        return Math.hypot(q[0] - p[0], q[1] - p[1]) < 1e-4;
      }
      if (Math.abs(Math.hypot(p[0] - cv.c[0], p[1] - cv.c[1]) - cv.r) > 1e-4) return false;
      return inArc(cv, p);
    };
    const ends = (cv) => cv.t === 's' ? [cv.a, cv.b] : cv.t === 'a' ? [[cv.c[0] + cv.r * Math.cos(cv.a0), cv.c[1] + cv.r * Math.sin(cv.a0)], [cv.c[0] + cv.r * Math.cos(cv.a0 + cv.span), cv.c[1] + cv.r * Math.sin(cv.a0 + cv.span)]] : [];
    const isEnd = (cv, p) => ends(cv).some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 1e-4);
    function meet(A, B) {
      const out = [];
      if (A.t === 's' && B.t === 's') {
        const r = [A.b[0] - A.a[0], A.b[1] - A.a[1]], s = [B.b[0] - B.a[0], B.b[1] - B.a[1]];
        const den = r[0] * s[1] - r[1] * s[0];
        if (Math.abs(den) < 1e-12) {
          [A.a, A.b].forEach((p) => { if (onCurve(B, p)) out.push(p); });
          [B.a, B.b].forEach((p) => { if (onCurve(A, p)) out.push(p); });
          return out;
        }
        const q = [B.a[0] - A.a[0], B.a[1] - A.a[1]];
        const t = (q[0] * s[1] - q[1] * s[0]) / den, u = (q[0] * r[1] - q[1] * r[0]) / den;
        if (t >= -1e-9 && t <= 1 + 1e-9 && u >= -1e-9 && u <= 1 + 1e-9) out.push([A.a[0] + r[0] * t, A.a[1] + r[1] * t]);
        return out;
      }
      if (A.t !== 's' && B.t === 's') return meet(B, A);
      if (A.t === 's') {
        const d = [A.b[0] - A.a[0], A.b[1] - A.a[1]], f = [A.a[0] - B.c[0], A.a[1] - B.c[1]];
        const a = d[0] * d[0] + d[1] * d[1], b = 2 * (f[0] * d[0] + f[1] * d[1]), c = f[0] * f[0] + f[1] * f[1] - B.r * B.r;
        let disc = b * b - 4 * a * c;
        if (disc < -1e-9) return out;
        const sq = Math.sqrt(Math.max(0, disc));
        [(-b - sq) / (2 * a), (-b + sq) / (2 * a)].forEach((t, k) => {
          if (k === 1 && sq < 1e-9) return;
          if (t >= -1e-9 && t <= 1 + 1e-9) { const p = [A.a[0] + d[0] * t, A.a[1] + d[1] * t]; if (inArc(B, p)) out.push(p); }
        });
        return out;
      }
      const dx = B.c[0] - A.c[0], dy = B.c[1] - A.c[1], dd = Math.hypot(dx, dy);
      if (dd < 1e-9 || dd > A.r + B.r + 1e-7 || dd < Math.abs(A.r - B.r) - 1e-7) return out;
      const a = (A.r * A.r - B.r * B.r + dd * dd) / (2 * dd);
      const h = Math.sqrt(Math.max(0, A.r * A.r - a * a));
      const m = [A.c[0] + dx * a / dd, A.c[1] + dy * a / dd];
      const pts = h < 1e-7 ? [m] : [[m[0] + h * dy / dd, m[1] - h * dx / dd], [m[0] - h * dy / dd, m[1] + h * dx / dd]];
      pts.forEach((p) => { if (inArc(A, p) && inArc(B, p)) out.push(p); });
      return out;
    }
    curves.forEach((cv) => {
      if (cv.t === 's') { cv.hits.push(vid(cv.a)); cv.hits.push(vid(cv.b)); }
      if (cv.t === 'a') { const e = ends(cv); cv.hits.push(vid(e[0])); if (cv.span < TAU - 1e-9) cv.hits.push(vid(e[1])); }
    });
    for (let i = 0; i < curves.length; i++) {
      for (let j = i + 1; j < curves.length; j++) {
        meet(curves[i], curves[j]).forEach((p) => {
          if (!cross && !isEnd(curves[i], p) && !isEnd(curves[j], p) && !P.some((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) < 0.05)) return;
          const v = vid(p);
          curves[i].hits.push(v); curves[j].hits.push(v);
        });
      }
    }
    curves.forEach((cv) => P.forEach((p, v) => { if (!cv.hits.includes(v) && onCurve(cv, p)) cv.hits.push(v); }));
    const E = [];
    curves.forEach((cv) => {
      let hs = Array.from(new Set(cv.hits));
      if (cv.t === 'c' && !hs.length) hs = [vid([cv.c[0], cv.c[1] - cv.r])];
      if (cv.t === 's') {
        hs.sort((x, y) => paramOf(cv, P[x]) - paramOf(cv, P[y]));
        for (let k = 1; k < hs.length; k++) E.push([hs[k - 1], hs[k]]);
        return;
      }
      if (cv.t === 'a') {
        const tp = (v) => { const t = paramOf(cv, P[v]); return t > cv.span + 1e-6 ? t - TAU : t; };
        hs.sort((x, y) => tp(x) - tp(y));
        for (let k = 1; k < hs.length; k++) E.push([hs[k - 1], hs[k], cv.c[0], cv.c[1], 1]);
        if (cv.span >= TAU - 1e-9) E.push([hs[hs.length - 1], hs[0], cv.c[0], cv.c[1], 1]);
        return;
      }
      hs.sort((x, y) => paramOf(cv, P[x]) - paramOf(cv, P[y]));
      for (let k = 0; k < hs.length; k++) E.push([hs[k], hs[(k + 1) % hs.length], cv.c[0], cv.c[1], 1]);
    });
    return tidy(P, E);
  }

  // scale into a 100-unit box around (50, 50), round, drop zero-length lines
  function tidy(P, E) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const add = (p) => { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); };
    P.forEach(add);
    E.forEach((e) => {
      if (e.length < 5) return;
      // the extremes of an arc
      const c = [e[2], e[3]], r = Math.hypot(P[e[0]][0] - c[0], P[e[0]][1] - c[1]);
      const t0 = Math.atan2(P[e[0]][1] - c[1], P[e[0]][0] - c[0]);
      let span = e[0] === e[1] ? TAU : normA(Math.atan2(P[e[1]][1] - c[1], P[e[1]][0] - c[0]) - t0);
      if (span < 1e-9) span = TAU;
      for (let k = 0; k <= 24; k++) { const t = t0 + span * k / 24; add([c[0] + r * Math.cos(t), c[1] + r * Math.sin(t)]); }
    });
    const k = 100 / Math.max(x1 - x0, y1 - y0, 1e-9), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
    const f = (p) => [r2(50 + (p[0] - cx) * k), r2(50 + (p[1] - cy) * k)];
    const V = P.map(f);
    const Eo = [];
    E.forEach((e) => {
      if (e.length === 2) { if (e[0] !== e[1]) Eo.push([e[0], e[1]]); return; }
      const c = f([e[2], e[3]]);
      Eo.push([e[0], e[1], c[0], c[1], e[4]]);
    });
    return { v: V, e: Eo };
  }

  /* ---------- shapes ---------- */

  function polyPts(n, r, cx, cy, rot) {
    const out = [];
    for (let i = 0; i < n; i++) { const a = rad((rot == null ? -90 : rot) + 360 * i / n); out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]); }
    return out;
  }
  const seg = (a, b) => [a[0], a[1], b[0], b[1]];
  const closedSegs = (pts) => pts.map((p, i) => seg(p, pts[(i + 1) % pts.length]));
  function chords(pts, step) {
    const n = pts.length, out = [], seen = new Set();
    for (let i = 0; i < n; i++) {
      const j = (i + step) % n, key = Math.min(i, j) + ',' + Math.max(i, j);
      if (seen.has(key) || i === j) continue;
      seen.add(key);
      out.push(seg(pts[i], pts[j]));
    }
    return out;
  }

  /* ---------- analysis ---------- */

  function analyse(fig, seed) {
    const L = GL();
    const n = fig.v.length, m = fig.e.length;
    const od = L.odd(n, fig.e);
    const adj = [];
    for (let i = 0; i < n; i++) adj.push([]);
    fig.e.forEach((e) => { adj[e[0]].push(e[1]); adj[e[1]].push(e[0]); });
    const conn = L.connected(n, adj, new Uint8Array(n).fill(1));
    const out = { odd: od.length, conn, n, m, drawable: false };
    if (!conn || (od.length !== 0 && od.length !== 2)) return out;
    const s = od.length ? od[0] : 0;
    out.start = s;
    out.trail = L.eulerFrom(n, fig.e, [], s);
    out.drawable = !!out.trail;
    // how often a careless stroke from a right start gets stranded
    const rng = C.rng(seed == null ? n * 131 + m * 7 + 3 : seed);
    const inc = [];
    for (let i = 0; i < n; i++) inc.push([]);
    fig.e.forEach((e, i) => { inc[e[0]].push(i); if (e[1] !== e[0]) inc[e[1]].push(i); });
    let ok = 0;
    const T = 240;
    const starts = od.length ? od : Array.from({ length: n }, (x, i) => i);
    const used = new Uint8Array(m);
    for (let t = 0; t < T; t++) {
      used.fill(0);
      let cur = starts[rng.int(starts.length)], k = 0;
      for (;;) {
        const c = inc[cur].filter((i) => !used[i]);
        if (!c.length) break;
        const i = c[rng.int(c.length)];
        used[i] = 1; k++;
        cur = fig.e[i][0] === cur ? fig.e[i][1] : fig.e[i][0];
      }
      if (k === m) ok++;
    }
    out.luck = ok / T;
    return out;
  }

  function strokeDiff(a) {
    let d = a.m <= 9 ? 1 : a.m <= 17 ? 2 : a.m <= 28 ? 3 : a.m <= 42 ? 4 : 5;
    if (a.luck < 0.12 && d < 5) d++;
    if (a.luck > 0.75 && d > 1) d--;
    return d;
  }

  /* ---------- figures to draw in one stroke ---------- */

  const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
  const POLY = ['', '', '', 'triangle', 'square', 'pentagon', 'hexagon', 'heptagon', 'octagon'];
  const SMALL = new Set(['a', 'an', 'and', 'in', 'of', 'on', 'the', 'with', 'by', 'to']);
  function titleCase(s) { return s.split(' ').map((w, i) => (i && SMALL.has(w) ? w : w.charAt(0).toUpperCase() + w.slice(1))).join(' '); }
  const gcd = (a, b) => (b ? gcd(b, a % b) : a);

  // a star: n points on a circle joined by chords of the given steps (a "circulant")
  function star(rng, o) {
    o = o || {};
    const n = o.n || rng.range(5, 12);
    const half = Math.floor(n / 2);
    let steps = o.steps;
    if (!steps) {
      const k = o.k || rng.range(1, Math.min(3, half));
      const pool = [];
      for (let s = 1; s <= half; s++) if (!(n % 2 === 0 && s === half)) pool.push(s);
      rng.shuffle(pool);
      steps = pool.slice(0, k).sort((a, b) => a - b);
      if (steps.length === 1 && steps[0] === 1) steps = [pool.find((s) => s > 1) || 2];
    }
    const pts = polyPts(n, 50, 50, 50);
    let segs = [];
    steps.forEach((s) => { segs = segs.concat(chords(pts, s)); });
    let drop = null;
    if (o.path) { drop = rng.int(segs.length); segs.splice(drop, 1); }
    const fig = build({ segs }, { cross: false });
    const name = (o.path ? 'open ' : '') + (steps.length === 1 && steps[0] > 1 && gcd(n, steps[0]) === 1 ? 'star of ' + NUM[n] : 'web of ' + NUM[n]);
    return { fig, name, kind: 'star', n, steps, path: !!o.path };
  }

  // rings: a chain, a necklace, a grid, or a rosette of circles, perhaps with a straight line or two
  function rings(rng, o) {
    o = o || {};
    const kind = o.kind || rng.pick(['chain', 'necklace', 'grid', 'rosette', 'polygon']);
    const circles = [], segs = [];
    let name = '';
    if (kind === 'chain') {
      const k = o.k || rng.range(2, 7);
      const r = 16, gap = rng.pick([18, 20, 22]), bend = rng.pick([0, 0, 6, 10]);
      for (let i = 0; i < k; i++) circles.push([i * gap, bend && i % 2 ? bend : 0, r]);
      name = 'chain of ' + NUM[k] + ' rings';
    } else if (kind === 'necklace') {
      const k = o.k || rng.range(4, 8);
      const R = 34, r = R * Math.sin(Math.PI / k) * rng.pick([1.25, 1.4, 1.6]);
      for (let i = 0; i < k; i++) { const a = TAU * i / k - Math.PI / 2; circles.push([50 + R * Math.cos(a), 50 + R * Math.sin(a), r]); }
      if (o.centre || rng() < 0.4) circles.push([50, 50, R * rng.pick([0.45, 0.62, 0.75])]);
      name = 'necklace of ' + NUM[k];
    } else if (kind === 'grid') {
      const a = o.a || rng.range(2, 3), b = o.b || rng.range(2, 4);
      const r = 16, gap = rng.pick([20, 22, 24]);
      for (let i = 0; i < a; i++) for (let j = 0; j < b; j++) circles.push([j * gap, i * gap, r]);
      name = 'grid of ' + a + ' × ' + b + ' rings';
    } else if (kind === 'rosette') {
      const k = o.k || rng.range(3, 8);
      const r = 25;
      for (let i = 0; i < k; i++) { const a = TAU * i / k; circles.push([50 + r * Math.cos(a), 50 + r * Math.sin(a), r]); }
      if (o.frame || rng() < 0.5) circles.push([50, 50, 2 * r]);
      name = 'rosette of ' + NUM[k];
    } else {
      const k = o.k || rng.range(3, 8);
      const pts = polyPts(k, 50, 50, 50);
      circles.push([50, 50, 50]);
      segs.push(...closedSegs(pts));
      const withStar = k >= 5 && rng() < 0.6;
      if (withStar) segs.push(...chords(pts, 2));
      const inner = rng() < 0.5;
      if (inner) circles.push([50, 50, 50 * Math.cos(Math.PI / k)]);
      name = POLY[k] + (withStar ? ' and star' : '') + ' in ' + (inner ? 'two rings' : 'a ring');
    }
    if (o.path) {
      // one straight stroke through the middle gives the figure two odd ends
      let x0 = Infinity, x1 = -Infinity, cy = 0;
      circles.forEach((c) => { x0 = Math.min(x0, c[0] - c[2]); x1 = Math.max(x1, c[0] + c[2]); cy += c[1]; });
      cy /= circles.length;
      const yy = cy + rng.pick([0, 3.3, -4.1]);
      segs.push([x0 + 3, yy, x1 - 3, yy]);
    }
    const fig = build({ circles, segs }, { cross: true });
    return { fig, name, kind: 'rings', sub: kind, path: !!o.path };
  }

  /* lattice pictures: shapes on a square or triangular grid, combined so that
   * where two shapes share a line the line disappears (XOR). Every shape is a
   * closed loop, so every corner stays even; one extra open path makes two
   * odd corners. */
  const SQ_SHAPES = [
    [[0, 0], [1, 0], [1, 1], [0, 1]], [[0, 0], [2, 0], [2, 1], [0, 1]], [[0, 0], [1, 0], [1, 2], [0, 2]],
    [[0, 0], [2, 0], [2, 2], [0, 2]], [[1, 0], [2, 1], [1, 2], [0, 1]], [[2, 0], [4, 2], [2, 4], [0, 2]],
    [[0, 0], [1, 0], [1, 1]], [[0, 0], [1, 1], [0, 1]], [[0, 0], [2, 0], [1, 1]], [[0, 1], [1, 0], [2, 1], [1, 2]],
    [[0, 0], [2, 0], [2, 2]], [[1, 0], [3, 0], [3, 2], [2, 3], [0, 3], [0, 1]], [[0, 0], [3, 0], [3, 1], [0, 1]],
    [[1, 0], [2, 1], [1, 2], [0, 1]], [[0, 0], [1, 1], [2, 0], [2, 2], [0, 2]]
  ];
  const TRI_SHAPES = [
    [[0, 0], [1, 0], [0, 1]], [[1, 0], [1, 1], [0, 1]], [[0, 0], [2, 0], [0, 2]], [[0, 0], [1, 0], [1, 1], [0, 1]],
    [[1, 0], [2, 0], [2, 1], [1, 2], [0, 2], [0, 1]], [[0, 0], [2, 0], [1, 1], [0, 1]], [[0, 0], [3, 0], [0, 3]],
    [[1, 0], [1, 1], [0, 1]], [[2, 0], [2, 2], [0, 2]]
  ];
  function latticeUnits(a, b, tri) {
    // split a lattice line into unit steps
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const k = Math.max(Math.abs(dx), Math.abs(dy));
    if (!k) return [];
    const sx = dx / k, sy = dy / k;
    const okDir = tri ? ((sy === 0 && Math.abs(sx) === 1) || (sx === 0 && Math.abs(sy) === 1) || (sx === -sy && Math.abs(sx) === 1)) : (Math.abs(sx) <= 1 && Math.abs(sy) <= 1 && Number.isInteger(sx) && Number.isInteger(sy));
    if (!okDir) return null;
    const out = [];
    for (let i = 0; i < k; i++) out.push([[a[0] + sx * i, a[1] + sy * i], [a[0] + sx * (i + 1), a[1] + sy * (i + 1)]]);
    return out;
  }
  function lattice(rng, o) {
    o = o || {};
    const tri = !!o.tri;
    const N = o.N || rng.range(3, 5);
    const shapes = o.count || rng.range(2, 2 + N);
    // mirror symmetry only: turning a lopsided shape about the centre makes pinwheels, and some of those look like hooked crosses
    const sym = o.sym || (tri ? rng.pick(['mirror', 'mirror', 'none']) : rng.pick(['mirror', 'mirror', 'both', 'none']));
    const E = new Map();
    const inside = (p) => (tri ? p[1] >= 0 && p[1] <= N && p[0] + p[1] / 2 <= N && p[0] + p[1] / 2 >= 0 : p[0] >= 0 && p[1] >= 0 && p[0] <= N && p[1] <= N);
    const lo = tri ? -Math.floor(N / 2) : 0;
    // symmetry maps in lattice coordinates
    const mirror = (p) => (tri ? [N - p[0] - p[1], p[1]] : [N - p[0], p[1]]);
    const flipV = (p) => [p[0], N - p[1]];
    const key = (a, b) => { const s = a[0] + ',' + a[1], t = b[0] + ',' + b[1]; return s < t ? s + '|' + t : t + '|' + s; };
    const toggle = (a, b) => { const k = key(a, b); if (E.has(k)) E.delete(k); else E.set(k, [a, b]); };
    function addLoop(pts) {
      for (let i = 0; i < pts.length; i++) {
        const u = latticeUnits(pts[i], pts[(i + 1) % pts.length], tri);
        if (!u) return false;
        u.forEach(([a, b]) => toggle(a, b));
      }
      return true;
    }
    const canon = (pts) => pts.map((p) => p[0] + ',' + p[1]).sort().join(';');
    let placed = 0, guard = 0;
    while (placed < shapes && guard++ < 200) {
      const sh = rng.pick(tri ? TRI_SHAPES : SQ_SHAPES);
      const dx = lo + rng.int(N + 1 - lo), dy = rng.int(N + 1);
      const pts = sh.map((p) => [p[0] + dx, p[1] + dy]);
      if (!pts.every(inside)) continue;
      const orbit = [pts];
      if (sym === 'mirror' || sym === 'both') orbit.push(pts.map(mirror));
      if (sym === 'both' && !tri) { orbit.push(pts.map(flipV)); orbit.push(pts.map((q) => flipV(mirror(q)))); }
      const seen = new Set();
      orbit.forEach((q) => { const c = canon(q); if (seen.has(c)) return; seen.add(c); addLoop(q); });
      placed++;
    }
    for (let pth = 0; pth < (o.paths || (o.path ? 1 : 0)); pth++) {
      // an open path from a point to its mirror image (or anywhere) adds two odd corners
      const dirs = tri ? [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]] : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]];
      let p = [lo + rng.int(N + 1 - lo), rng.int(N + 1)];
      let tries = 0;
      while (!inside(p) && tries++ < 50) p = [lo + rng.int(N + 1 - lo), rng.int(N + 1)];
      const walk = [p];
      const len = rng.range(2, 2 + N);
      for (let i = 0; i < len; i++) {
        const cand = dirs.map((d) => [walk[walk.length - 1][0] + d[0], walk[walk.length - 1][1] + d[1]]).filter(inside);
        walk.push(rng.pick(cand));
      }
      if (sym !== 'none') {
        // keep the picture symmetric: walk, a straight line across the mirror, the walk mirrored back
        const e = walk[walk.length - 1], m = mirror(e);
        const across = latticeUnits(e, m, tri) || [];
        const back = walk.map(mirror).reverse();
        for (let i = 1; i < walk.length; i++) toggle(walk[i - 1], walk[i]);
        across.forEach(([a, b]) => toggle(a, b));
        for (let i = 1; i < back.length; i++) toggle(back[i - 1], back[i]);
      } else for (let i = 1; i < walk.length; i++) toggle(walk[i - 1], walk[i]);
    }
    if (!E.size) return null;
    // merge straight runs through corners that only pass a line on
    const deg = new Map();
    const pk = (p) => p[0] + ',' + p[1];
    E.forEach(([a, b]) => { deg.set(pk(a), (deg.get(pk(a)) || 0) + 1); deg.set(pk(b), (deg.get(pk(b)) || 0) + 1); });
    const segsL = [];
    const used = new Set();
    E.forEach(([a, b], k) => {
      if (used.has(k)) return;
      used.add(k);
      let s = a, t = b;
      const dir = [b[0] - a[0], b[1] - a[1]];
      const extend = (from, sign) => {
        let cur = from;
        for (;;) {
          if (deg.get(pk(cur)) !== 2) return cur;
          const nx = [cur[0] + sign * dir[0], cur[1] + sign * dir[1]];
          const k2 = key(cur, nx);
          if (!E.has(k2) || used.has(k2)) return cur;
          used.add(k2);
          cur = nx;
        }
      };
      t = extend(b, 1);
      s = extend(a, -1);
      segsL.push([s, t]);
    });
    const h = Math.sqrt(3) / 2;
    const world = (p) => (tri ? [(p[0] + p[1] / 2) * 20, -p[1] * h * 20] : [p[0] * 20, p[1] * 20]);
    const segs = segsL.map(([a, b]) => seg(world(a), world(b)));
    const fig = build({ segs }, { cross: true });
    return { fig, name: tri ? 'triangle-grid pattern' : 'tiled pattern', kind: tri ? 'tri' : 'square', sym, path: !!o.path };
  }

  const STROKE_TEXT = {
    star: ['Join the points of this {name} without lifting the pen or going over a line twice. Lines may cross — turn only at the points.', 'A {name}. Draw every chord once, in a single stroke; where chords cross you simply carry straight on.'],
    rings: ['A {name}. Trace every arc once without lifting the pen.', 'Draw the {name} in one unbroken line. You may change from one circle to another only where they meet.'],
    square: ['A pattern from a tiled floor. Trace every line once without lifting the pen — turn wherever lines meet.', 'A lattice figure. Every line once, one stroke, no jumping.'],
    tri: ['A pattern on a triangular grid. Draw every line once in a single stroke.', 'Triangles and hexagons, one stroke. Every line exactly once.']
  };

  function strokePuzzle(rng, made) {
    const a = analyse(made.fig);
    if (!a.drawable) return null;
    const tx = rng.pick(STROKE_TEXT[made.kind]).replace('{name}', made.name);
    const title = made.kind === 'square' ? 'The ' + rng.pick(['Parquet', 'Trellis', 'Mosaic', 'Grille', 'Fretwork', 'Garden Gate', 'Lattice Window', 'Tile Border', 'Quilt', 'Monogram', 'Cloister', 'Rug'])
      : made.kind === 'tri' ? 'The ' + rng.pick(['Honeycomb', 'Pyramid', 'Snowflake', 'Beehive', 'Crystal', 'Chevron', 'Pinnacle', 'Tent', 'Prism', 'Rooftops'])
        : titleCase(made.name);
    return {
      title,
      text: tx,
      diff: strokeDiff(a),
      data: { kind: 'stroke', v: made.fig.v, e: made.fig.e, start: a.start, trail: a.trail },
      a
    };
  }

  // a one-stroke puzzle of the wanted level (endless drawers)
  function makeStroke(rng, level) {
    for (let tries = 0; tries < 40; tries++) {
      const pick = rng();
      const path = rng() < 0.45;
      let made = null;
      if (pick < 0.25) made = star(rng, { n: 5 + rng.int(level * 2 + 1), k: 1 + rng.int(Math.min(3, 1 + Math.floor(level / 2))), path });
      else if (pick < 0.5) made = rings(rng, { path });
      else made = lattice(rng, { tri: pick > 0.8, N: 2 + Math.min(4, level), count: 1 + level + rng.int(3), path });
      if (!made || !made.fig) continue;
      if (made.fig.e.length > 70) continue;
      const pz = strokePuzzle(rng, made);
      if (!pz || pz.diff !== level) continue;
      delete pz.a;
      return pz;
    }
    return null;
  }

  /* ---------- untangle ---------- */

  const cross2 = (a, b) => a[0] * b[1] - a[1] * b[0];

  // fit points into the box [lo, hi]²
  function fitBox(P, lo, hi) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    P.forEach((p) => { x0 = Math.min(x0, p[0]); y0 = Math.min(y0, p[1]); x1 = Math.max(x1, p[0]); y1 = Math.max(y1, p[1]); });
    const k = (hi - lo) / Math.max(x1 - x0, y1 - y0, 1e-9), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, m = (lo + hi) / 2;
    return P.map((p) => [r2(m + (p[0] - cx) * k), r2(m + (p[1] - cy) * k)]);
  }
  function minGap(P) {
    let best = Infinity;
    for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) best = Math.min(best, Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]));
    return best;
  }
  // push crowded dots apart, a little at a time, never letting a line cross another
  function relax(P, E, want, iters) {
    const L = GL();
    P = P.map((p) => p.slice());
    const n = P.length;
    const inc = P.map(() => []);
    E.forEach((e, i) => { inc[e[0]].push(i); inc[e[1]].push(i); });
    const okAt = (v) => {
      for (const i of inc[v]) {
        const a = E[i];
        for (let j = 0; j < E.length; j++) {
          if (j === i) continue;
          const b = E[j];
          if (b[0] === a[0] || b[0] === a[1] || b[1] === a[0] || b[1] === a[1]) continue;
          if (L.segCross(P[a[0]], P[a[1]], P[b[0]], P[b[1]])) return false;
        }
      }
      // keep dots off other lines
      for (let j = 0; j < E.length; j++) {
        const b = E[j];
        if (b[0] === v || b[1] === v) continue;
        const ab = [P[b[1]][0] - P[b[0]][0], P[b[1]][1] - P[b[0]][1]], ak = [P[v][0] - P[b[0]][0], P[v][1] - P[b[0]][1]];
        const t = (ab[0] * ak[0] + ab[1] * ak[1]) / (ab[0] * ab[0] + ab[1] * ab[1]);
        if (t > 0 && t < 1 && Math.abs(cross2(ab, ak)) / Math.hypot(ab[0], ab[1]) < want * 0.35) return false;
      }
      return true;
    };
    for (let it = 0; it < iters; it++) {
      let moved = false;
      for (let v = 0; v < n; v++) {
        let fx = 0, fy = 0;
        for (let w = 0; w < n; w++) {
          if (w === v) continue;
          const dx = P[v][0] - P[w][0], dy = P[v][1] - P[w][1], d = Math.hypot(dx, dy) || 1e-6;
          if (d < want) { fx += dx / d * (want - d); fy += dy / d * (want - d); }
        }
        if (!fx && !fy) continue;
        const old = P[v];
        const s = 0.5;
        P[v] = [Math.max(4, Math.min(96, old[0] + fx * s)), Math.max(4, Math.min(96, old[1] + fy * s))];
        if (okAt(v)) moved = true; else P[v] = old;
      }
      if (!moved) break;
    }
    return P.map((p) => [r2(p[0]), r2(p[1])]);
  }

  // the dots start on a circle, in a shuffled order
  function scramble(rng, n, E, emb) {
    for (let t = 0; t < 30; t++) {
      const perm = rng.shuffle(Array.from({ length: n }, (x, i) => i));
      const v = new Array(n);
      perm.forEach((vi, i) => { const a = TAU * i / n - Math.PI / 2; v[vi] = [r2(50 + 45 * Math.cos(a)), r2(50 + 45 * Math.sin(a))]; });
      const x = GL().crossings(v, E).length;
      if (x >= Math.max(1, Math.round(E.length / 3))) return v;
    }
    return null;
  }

  // the planar net made by k straight lines crossing each other (every pair crosses once)
  function lines(rng, k) {
    for (let tries = 0; tries < 300; tries++) {
      // chords of a circle whose ends interleave (i joins i + k): every pair crosses inside the circle
      const ang = [];
      for (let j = 0; j < 2 * k; j++) ang.push(TAU * (j + (rng() - 0.5) * 0.7) / (2 * k));
      ang.sort((a, b) => a - b);
      const Ls = [];
      for (let i = 0; i < k; i++) {
        const a = [50 + 50 * Math.cos(ang[i]), 50 + 50 * Math.sin(ang[i])], b = [50 + 50 * Math.cos(ang[i + k]), 50 + 50 * Math.sin(ang[i + k])];
        const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
        Ls.push({ p: a, d: [(b[0] - a[0]) / len, (b[1] - a[1]) / len] });
      }
      let bad = false;
      const P = [], at = Ls.map(() => []);
      for (let i = 0; i < k && !bad; i++) for (let j = i + 1; j < k; j++) {
        const den = cross2(Ls[i].d, Ls[j].d);
        const w = [Ls[j].p[0] - Ls[i].p[0], Ls[j].p[1] - Ls[i].p[1]];
        const t = cross2(w, Ls[j].d) / den, u = cross2(w, Ls[i].d) / den;
        const q = [Ls[i].p[0] + Ls[i].d[0] * t, Ls[i].p[1] + Ls[i].d[1] * t];
        if (Math.hypot(q[0] - 50, q[1] - 50) > 75) { bad = true; break; }
        at[i].push({ t, v: P.length }); at[j].push({ t: u, v: P.length });
        P.push(q);
      }
      if (bad) continue;
      const E = [];
      at.forEach((list) => {
        list.sort((a, b) => a.t - b.t);
        for (let m = 1; m < list.length; m++) E.push([list[m - 1].v, list[m].v]);
      });
      let emb = fitBox(P, 6, 94);
      const want = k <= 7 ? 3.6 : 3.0;
      if (minGap(emb) < want) emb = relax(emb, E, want * 1.25, 40);
      if (minGap(emb) < want) continue;
      if (GL().crossings(emb, E).length) continue;
      const v = scramble(rng, P.length, E, emb);
      if (!v) continue;
      return { v, e: E, emb, lines: k };
    }
    return null;
  }

  function spread(rng, n, lo, hi) {
    const d0 = (hi - lo) * 0.78 / Math.sqrt(n);
    for (let t = 0; t < 50; t++) {
      const P = [];
      let guard = 0;
      while (P.length < n && guard++ < 5000) {
        const q = [lo + rng() * (hi - lo), lo + rng() * (hi - lo)];
        if (P.every((p) => Math.hypot(p[0] - q[0], p[1] - q[1]) >= d0)) P.push(q);
      }
      if (P.length === n) return P;
    }
    return null;
  }
  // a planar net: join nearest pairs first, never crossing (a greedy triangulation)
  function greedyNet(P) {
    const n = P.length, pairs = [];
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) pairs.push([Math.hypot(P[i][0] - P[j][0], P[i][1] - P[j][1]), i, j]);
    pairs.sort((a, b) => a[0] - b[0]);
    const E = [];
    const L = GL();
    pairs.forEach(([d, i, j]) => {
      for (const e of E) {
        if (e[0] === i || e[0] === j || e[1] === i || e[1] === j) continue;
        if (L.segCross(P[i], P[j], P[e[0]], P[e[1]])) return;
      }
      // no dot lying on the new line
      for (let k = 0; k < n; k++) {
        if (k === i || k === j) continue;
        const ab = [P[j][0] - P[i][0], P[j][1] - P[i][1]], ak = [P[k][0] - P[i][0], P[k][1] - P[i][1]];
        const t = (ab[0] * ak[0] + ab[1] * ak[1]) / (ab[0] * ab[0] + ab[1] * ab[1]);
        if (t > 0 && t < 1 && Math.abs(cross2(ab, ak)) / Math.hypot(ab[0], ab[1]) < 1.2) return;
      }
      E.push([i, j]);
    });
    return E;
  }
  function thin(rng, n, E, target, minDeg, keep) {
    const L = GL();
    E = E.slice();
    const deg = new Array(n).fill(0);
    E.forEach((e) => { deg[e[0]]++; deg[e[1]]++; });
    const order = rng.shuffle(E.map((e, i) => i));
    const drop = new Set();
    for (const i of order) {
      if (E.length - drop.size <= target) break;
      const e = E[i];
      if (keep && keep.has(Math.min(e[0], e[1]) + ',' + Math.max(e[0], e[1]))) continue;
      if (deg[e[0]] <= minDeg || deg[e[1]] <= minDeg) continue;
      drop.add(i);
      const adj = L.adjacency(n, E.filter((x, k) => !drop.has(k)));
      if (!L.connected(n, adj, new Uint8Array(n).fill(1))) { drop.delete(i); continue; }
      deg[e[0]]--; deg[e[1]]--;
    }
    return E.filter((x, k) => !drop.has(k));
  }
  // a random planar net of n dots
  function scatter(rng, n, avgDeg) {
    for (let t = 0; t < 20; t++) {
      const P = spread(rng, n, 6, 94);
      if (!P) continue;
      let E = greedyNet(P);
      E = thin(rng, n, E, Math.round(n * (avgDeg || 3.4) / 2), 2);
      const emb = P.map((p) => [r2(p[0]), r2(p[1])]);
      if (GL().crossings(emb, E).length) continue;
      const v = scramble(rng, n, E, emb);
      if (!v) continue;
      return { v, e: E, emb };
    }
    return null;
  }
  function untangleDiff(n) { return n <= 7 ? 1 : n <= 11 ? 2 : n <= 16 ? 3 : n <= 28 ? 4 : 5; }
  const TANGLE_A = ['Loose', 'Knotted', 'Twisted', 'Snarled', 'Crossed', 'Woven', 'Matted', 'Ravelled', 'Braided', 'Crumpled', 'Wiry', 'Tousled', 'Kinked', 'Muddled', 'Scrambled', 'Wound'];
  const TANGLE_N = ['Net', 'Web', 'Skein', 'Knot', 'Cradle', 'Mesh', 'Snarl', 'Yarn', 'Nest', 'Trellis', 'Hammock', 'Cobweb', 'Fishnet', 'Lattice', 'Ball of String', 'Macramé'];
  function makeUntangle(rng, level) {
    const opts = [null, [['lines', 4]], [['lines', 5], ['scatter', 9]], [['lines', 6], ['scatter', 13]], [['lines', 7], ['scatter', 18], ['lines', 8]], [['lines', 9], ['scatter', 26], ['lines', 10]]][level];
    const [kind, k] = rng.pick(opts);
    const g = kind === 'lines' ? lines(rng, k) : scatter(rng, k, 3.3 + rng() * 0.8);
    if (!g) return null;
    const n = g.v.length;
    const title = 'The ' + rng.pick(TANGLE_A) + ' ' + rng.pick(TANGLE_N);
    return {
      title,
      text: C.plural ? C.plural(n, 'dot') + ' and ' + C.plural(g.e.length, 'line') + ', all in a muddle. Drag the dots until no two lines cross.' : '',
      diff: level,
      explain: kind === 'lines' ? 'The dots are the points where ' + NUM[k] + ' straight lines cross one another, and each line joins neighbouring crossings — so one untangled drawing is simply those ' + NUM[k] + ' straight lines. Any drawing without a crossing counts.' : undefined,
      data: { kind: 'untangle', v: g.v, e: g.e, emb: g.emb }
    };
  }

  /* ---------- round trips (Hamilton cycles) on planar nets ---------- */

  function roundTrip(rng, n, extra) {
    const L = GL();
    for (let t = 0; t < 30; t++) {
      const P = spread(rng, n, 6, 94);
      if (!P) continue;
      const full = greedyNet(P);
      const adj = L.adjacency(n, full);
      const r = L.hamilton(n, adj, { closed: true, from: rng.int(n), limit: 60000 });
      if (!r.sols.length) continue;
      const cyc = r.sols[0];
      const keep = new Set();
      for (let i = 0; i < n; i++) { const a = cyc[i], b = cyc[(i + 1) % n]; keep.add(Math.min(a, b) + ',' + Math.max(a, b)); }
      const E = thin(rng, n, full, n + Math.round(n * (extra == null ? 0.7 : extra)), 3, keep);
      const V = P.map((p) => [r2(p[0]), r2(p[1])]);
      // start the stored cycle at its first vertex
      return { v: V, e: E, cycle: cyc };
    }
    return null;
  }
  function makeRoundTrip(rng, level) {
    const n = [0, 8, 12, 16, 21, 27][level] + rng.int(3);
    const g = roundTrip(rng, n, [0, 0.55, 0.65, 0.7, 0.72, 0.75][level]);
    if (!g) return null;
    return {
      title: 'A Journey through ' + (NUM[n] ? NUM[n].charAt(0).toUpperCase() + NUM[n].slice(1) : n) + ' Towns',
      text: n + ' towns joined by roads. Plan a round trip along the roads that calls at every town exactly once and comes home again.',
      diff: level,
      data: { kind: 'hamilton', v: g.v, e: g.e, closed: true, cycle: g.cycle }
    };
  }

  C.GraphGen = { build, tidy, polyPts, seg, closedSegs, chords, analyse, strokeDiff, star, rings, lattice, strokePuzzle, makeStroke, NUM, titleCase,
    fitBox, scramble, lines, scatter, greedyNet, thin, spread, untangleDiff, makeUntangle, roundTrip, makeRoundTrip, TANGLE_A, TANGLE_N };
})(typeof window !== 'undefined' ? window : globalThis);
