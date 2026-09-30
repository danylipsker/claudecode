/* The Puzzle Cabinet · js/lib/knot.js
 *
 * The mathematics of ropes on a table.
 *
 *   A diagram is a polyline (a rope) whose two ends are joined "far away":
 *   the closing piece is lifted above everything, as if you held both ends up
 *   in the air. Where the rope crosses itself one strand lies over the other;
 *   a crossing is stored with the two places along the rope where it happens
 *   (a < b, as fractional point indices) and a bit: 1 = the strand at a is on
 *   top, 0 = the strand at b is on top.
 *
 *   crossings(pts)            every place the polyline crosses itself
 *   jones(pts, cr, bits)      the Jones polynomial (Kauffman bracket, normalised by the writhe)
 *   identify(V)               which knot of the table has this polynomial
 *   the table                 unknot … 7₇, granny and square knots, built from 4-plats
 *   Sim                       a bead-chain rope in 3D that can be pulled tight
 *
 * Everything here is plain arithmetic, so the same numbers come out in node
 * (the generators and validate.js) and in the browser.
 */
(function (root) {
  'use strict';
  const C = root.Cabinet = root.Cabinet || {};
  const K = C.Knot = {};

  /* ---------- Laurent polynomials: { exponent: coefficient } ---------- */

  const P = K.poly = {
    mono(e, c) { const o = {}; o[e] = c == null ? 1 : c; return o; },
    clean(a) { const o = {}; for (const k in a) if (a[k]) o[k] = a[k]; return o; },
    add(a, b) {
      const o = Object.assign({}, a);
      for (const k in b) o[k] = (o[k] || 0) + b[k];
      return P.clean(o);
    },
    addTo(a, b) { for (const k in b) { const v = (a[k] || 0) + b[k]; if (v) a[k] = v; else delete a[k]; } return a; },
    mul(a, b) {
      const o = {};
      for (const i in a) for (const j in b) { const k = +i + +j; o[k] = (o[k] || 0) + a[i] * b[j]; }
      return P.clean(o);
    },
    shift(a, s) { const o = {}; for (const k in a) o[+k + s] = a[k]; return o; },
    scale(a, c) { const o = {}; for (const k in a) o[k] = a[k] * c; return P.clean(o); },
    isZero(a) { for (const k in a) if (a[k]) return false; return true; },
    eq(a, b) { a = P.clean(a); b = P.clean(b); const ka = Object.keys(a), kb = Object.keys(b); return ka.length === kb.length && ka.every((k) => a[k] === b[k]); },
    // exact division by a polynomial that divides it
    div(a, d) {
      let r = P.clean(a);
      const q = {};
      const dl = Math.min.apply(null, Object.keys(d).map(Number)), dc = d[dl];
      for (let guard = 0; !P.isZero(r) && guard < 400; guard++) {
        const e = Math.min.apply(null, Object.keys(r).map(Number));
        const c = r[e] / dc;
        const qe = e - dl;
        q[qe] = (q[qe] || 0) + c;
        r = P.add(r, P.scale(P.shift(d, qe), -c));
      }
      return P.clean(q);
    },
    // t -> 1/t
    mirror(a) { const o = {}; for (const k in a) o[-k] = a[k]; return o; },
    // a canonical text key
    key(a) { return Object.keys(P.clean(a)).map(Number).sort((x, y) => x - y).map((k) => k + ':' + a[k]).join(',') || '0'; },
    evalAt(a, t) { let s = 0; for (const k in a) s += a[k] * Math.pow(t, +k); return s; },
    span(a) { const ks = Object.keys(P.clean(a)).map(Number); return ks.length ? Math.max.apply(null, ks) - Math.min.apply(null, ks) : 0; },
    // pretty text: t³ − t² + 1 − t⁻¹ (highest power first)
    str(a, v) {
      v = v || 't';
      const SUP = { '-': '⁻', 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
      const sup = (n) => String(n).split('').map((ch) => SUP[ch]).join('');
      const ks = Object.keys(P.clean(a)).map(Number).sort((x, y) => y - x);
      if (!ks.length) return '0';
      let s = '';
      ks.forEach((k, i) => {
        const c = a[k], ac = Math.abs(c);
        const term = k === 0 ? String(ac) : (ac === 1 ? '' : ac) + v + (k === 1 ? '' : sup(k));
        s += (i === 0 ? (c < 0 ? '−' : '') : (c < 0 ? ' − ' : ' + ')) + term;
      });
      return s;
    }
  };

  /* ---------- curves ---------- */

  // a closed uniform Catmull-Rom spline through the control points [x0, y0, x1, y1, ...]
  K.spline = function (flat, per) {
    per = per || 10;
    const n = flat.length / 2, out = [];
    const P0 = (i) => { i = ((i % n) + n) % n; return [flat[2 * i], flat[2 * i + 1]]; };
    for (let i = 0; i < n; i++) {
      const p0 = P0(i - 1), p1 = P0(i), p2 = P0(i + 1), p3 = P0(i + 2);
      for (let k = 0; k < per; k++) {
        const t = k / per, t2 = t * t, t3 = t2 * t;
        out.push([0, 1].map((d) => 0.5 * ((2 * p1[d]) + (-p0[d] + p2[d]) * t + (2 * p0[d] - 5 * p1[d] + 4 * p2[d] - p3[d]) * t2 + (-p0[d] + 3 * p1[d] - 3 * p2[d] + p3[d]) * t3)));
      }
    }
    return out;
  };

  K.length = function (pts, closed) {
    let s = 0;
    for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (closed) s += Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]);
    return s;
  };

  // cumulative arc length at every point
  K.arc = function (pts) {
    const s = [0];
    for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    return s;
  };

  // resample an open polyline (or closed, when closed) at even spacing
  K.resample = function (pts, step, closed) {
    const src = closed ? pts.concat([pts[0]]) : pts;
    const s = K.arc(src), L = s[s.length - 1];
    const n = Math.max(2, Math.round(L / step));
    const out = [];
    let j = 0;
    const m = closed ? n : n + 1;
    for (let k = 0; k < m; k++) {
      const want = L * k / n;
      while (j < s.length - 2 && s[j + 1] < want) j++;
      const seg = s[j + 1] - s[j] || 1, t = (want - s[j]) / seg;
      out.push([src[j][0] + (src[j + 1][0] - src[j][0]) * t, src[j][1] + (src[j + 1][1] - src[j][1]) * t]);
    }
    return out;
  };

  // the point and direction at fractional index u
  K.at = function (pts, u) {
    const n = pts.length;
    let i = Math.floor(u);
    if (i >= n - 1) i = n - 2;
    if (i < 0) i = 0;
    const t = u - i, a = pts[i], b = pts[i + 1];
    return { p: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], d: [b[0] - a[0], b[1] - a[1]] };
  };

  /* ---------- crossings ---------- */

  /* Every place the open polyline crosses itself. Returns crossings sorted
   * along the rope: { a, b, x, y, da, db, ang } with a < b fractional indices,
   * da / db the directions of the two strands there and ang the angle between
   * them (degrees, 0-90). Adjacent segments never count. */
  K.crossings = function (pts) {
    const n = pts.length - 1; // segments
    if (n < 3) return [];
    let minx = Infinity, miny = Infinity, maxx = -Infinity, maxy = -Infinity, tot = 0;
    for (const p of pts) { if (p[0] < minx) minx = p[0]; if (p[0] > maxx) maxx = p[0]; if (p[1] < miny) miny = p[1]; if (p[1] > maxy) maxy = p[1]; }
    for (let i = 0; i < n; i++) tot += Math.abs(pts[i + 1][0] - pts[i][0]) + Math.abs(pts[i + 1][1] - pts[i][1]);
    const cs = Math.max(1e-6, (tot / n) * 3);
    const nx = Math.max(1, Math.ceil((maxx - minx) / cs) + 1), ny = Math.max(1, Math.ceil((maxy - miny) / cs) + 1);
    const grid = new Map();
    for (let i = 0; i < n; i++) {
      const a = pts[i], b = pts[i + 1];
      const x0 = Math.floor((Math.min(a[0], b[0]) - minx) / cs), x1 = Math.floor((Math.max(a[0], b[0]) - minx) / cs);
      const y0 = Math.floor((Math.min(a[1], b[1]) - miny) / cs), y1 = Math.floor((Math.max(a[1], b[1]) - miny) / cs);
      for (let gx = x0; gx <= x1; gx++) for (let gy = y0; gy <= y1; gy++) {
        const k = gy * nx + gx;
        let l = grid.get(k);
        if (!l) grid.set(k, l = []);
        l.push(i);
      }
    }
    const seen = new Set(), out = [];
    grid.forEach((list) => {
      for (let u = 0; u < list.length; u++) {
        for (let v = u + 1; v < list.length; v++) {
          let i = list[u], j = list[v];
          if (i > j) { const t = i; i = j; j = t; }
          if (j - i < 2) continue;
          const key = i * (n + 1) + j;
          if (seen.has(key)) continue;
          seen.add(key);
          const p1 = pts[i], p2 = pts[i + 1], p3 = pts[j], p4 = pts[j + 1];
          const d1x = p2[0] - p1[0], d1y = p2[1] - p1[1], d2x = p4[0] - p3[0], d2y = p4[1] - p3[1];
          const den = d1x * d2y - d1y * d2x;
          if (Math.abs(den) < 1e-12) continue;
          const ex = p3[0] - p1[0], ey = p3[1] - p1[1];
          const t = (ex * d2y - ey * d2x) / den, s = (ex * d1y - ey * d1x) / den;
          if (t < -1e-9 || t >= 1 - 1e-9 || s < -1e-9 || s >= 1 - 1e-9) continue;
          const l1 = Math.hypot(d1x, d1y), l2 = Math.hypot(d2x, d2y);
          const cosang = Math.abs(d1x * d2x + d1y * d2y) / (l1 * l2 || 1);
          out.push({ a: i + t, b: j + s, x: p1[0] + d1x * t, y: p1[1] + d1y * t, da: [d1x / l1, d1y / l1], db: [d2x / l2, d2y / l2], ang: Math.acos(Math.min(1, cosang)) * 180 / Math.PI });
        }
      }
    });
    out.sort((p, q) => p.a - q.a || p.b - q.b);
    return out;
  };

  /* ---------- from a diagram to the Kauffman bracket ---------- */

  /* The planar-diagram code: walk along the rope; the 2n passes through
   * crossings cut it into 2n edges (edge k runs from pass k to pass k+1, the
   * last one closing over the top). At each crossing the four ends, taken
   * counter-clockwise (y up) starting with the incoming under-strand, are
   * ports [edge, 0 = the edge starts here | 1 = it ends here]. */
  K.pd = function (cr, bits) {
    const n = cr.length;
    const passes = [];
    cr.forEach((c, k) => { passes.push({ u: c.a, k, first: true }); passes.push({ u: c.b, k, first: false }); });
    passes.sort((p, q) => p.u - q.u);
    const at = cr.map(() => ({}));
    passes.forEach((ps, idx) => { at[ps.k][ps.first ? 'pa' : 'pb'] = idx; });
    const E = 2 * n;
    const xs = [];
    let writhe = 0;
    cr.forEach((c, k) => {
      const overA = bits[k] === 1 || bits[k] === '1' || bits[k] === true;
      const pu = overA ? at[k].pb : at[k].pa, po = overA ? at[k].pa : at[k].pb;
      const du = overA ? c.db : c.da, dov = overA ? c.da : c.db;
      // sign: positive when the over-strand turned anticlockwise (y up) meets the under-strand
      const cr2 = dov[0] * du[1] - dov[1] * du[0]; // screen axes (y down)
      const sign = cr2 < 0 ? 1 : -1;
      writhe += sign;
      // the four ends with their directions in maths axes (y up)
      const ends = [
        { port: [(pu - 1 + E) % E, 1], d: [-du[0], du[1]], ui: true },   // under, incoming: lies behind the crossing
        { port: [pu, 0], d: [du[0], -du[1]] },                         // under, outgoing
        { port: [(po - 1 + E) % E, 1], d: [-dov[0], dov[1]] },           // over, incoming
        { port: [po, 0], d: [dov[0], -dov[1]] }                        // over, outgoing
      ];
      ends.forEach((e) => { e.ang = Math.atan2(e.d[1], e.d[0]); });
      const a0 = ends[0].ang;
      ends.forEach((e) => { e.rel = ((e.ang - a0) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI); });
      ends.sort((p, q) => p.rel - q.rel);
      xs.push({ ports: ends.map((e) => e.port), sign, k });
    });
    return { xs, E, writhe, n };
  };

  const D_LOOP = { 2: -1, '-2': -1 }; // d = −A² − A⁻²

  // the Kauffman bracket <D> of a planar-diagram code (a polynomial in A)
  K.bracket = function (pd) {
    const n = pd.xs.length;
    if (!n) return { 0: 1 };
    // order: as the crossings are met along the rope keeps the frontier small
    const firstSeen = pd.xs.map((x) => Math.min.apply(null, x.ports.map((p) => p[0])));
    const order = pd.xs.map((x, i) => i).sort((i, j) => firstSeen[i] - firstSeen[j]);
    const done = new Set(); // processed crossing indices
    // which crossings hold each edge's two ends
    const edgeAt = [];
    pd.xs.forEach((x, xi) => x.ports.forEach((p) => { (edgeAt[p[0]] = edgeAt[p[0]] || []).push(xi); }));
    let states = new Map([['', { m: new Map(), poly: { 0: 1 } }]]);
    const SMOOTH = [[[0, 1], [2, 3], 1], [[1, 2], [3, 0], -1]]; // A-smoothing, then B-smoothing (A⁺¹, A⁻¹)
    for (const xi of order) {
      const X = pd.xs[xi];
      const edges = X.ports.map((p) => p[0]);
      const next = new Map();
      for (const st of states.values()) {
        for (const sm of SMOOTH) {
          const r = combine(st.m, edges, sm, edgeAt, done, xi);
          let poly = P.shift(st.poly, sm[2]);
          for (let l = 0; l < r.loops; l++) poly = P.mul(poly, D_LOOP);
          const key = matchKey(r.m);
          const old = next.get(key);
          if (old) P.addTo(old.poly, poly); else next.set(key, { m: r.m, poly: Object.assign({}, poly) });
        }
      }
      done.add(xi);
      states = next;
    }
    let total = {};
    for (const st of states.values()) total = P.add(total, st.poly);
    return P.div(total, D_LOOP);
  };

  function matchKey(m) {
    const pairs = [];
    m.forEach((v, k) => { if (k < v) pairs.push(k + '-' + v); });
    return pairs.sort().join(',');
  }

  /* Add one crossing with a smoothing to a partial state. m maps every
   * dangling edge (one end processed) to the dangling edge at the other end
   * of its path. */
  function combine(m, edges, sm, edgeAt, done, xi) {
    // what lies beyond each of the four ports
    const ext = [0, 1, 2, 3].map((q) => {
      const e = edges[q];
      const same = edges.findIndex((f, r) => r !== q && f === e);
      if (same >= 0) return { port: same };                   // a little loop at this crossing
      if (m.has(e)) {
        const partner = m.get(e);
        const r = edges.indexOf(partner);
        if (r >= 0 && r !== q) return { port: r };           // the path comes back to this crossing
        return { open: partner };                            // the path ends at an older dangling edge
      }
      return { open: e };                                    // a new dangling edge
    });
    const pairOf = [];
    pairOf[sm[0][0]] = sm[0][1]; pairOf[sm[0][1]] = sm[0][0];
    pairOf[sm[1][0]] = sm[1][1]; pairOf[sm[1][1]] = sm[1][0];
    const m2 = new Map(m);
    edges.forEach((e) => { if (m.has(e)) m2.delete(e); });
    const visited = [false, false, false, false];
    // paths start at ports that lead to an open end
    for (let q = 0; q < 4; q++) {
      if (visited[q] || ext[q].open == null) continue;
      const startOpen = ext[q].open;
      let cur = q;
      let endOpen = null;
      for (let guard = 0; guard < 10; guard++) {
        visited[cur] = true;
        const p2 = pairOf[cur];
        visited[p2] = true;
        const x = ext[p2];
        if (x.open != null) { endOpen = x.open; break; }
        cur = x.port;
      }
      m2.set(startOpen, endOpen);
      m2.set(endOpen, startOpen);
    }
    // what is left are closed loops
    let loops = 0;
    for (let q = 0; q < 4; q++) {
      if (visited[q]) continue;
      loops++;
      let cur = q;
      for (let guard = 0; guard < 10 && !visited[cur]; guard++) {
        visited[cur] = true;
        const p2 = pairOf[cur];
        visited[p2] = true;
        cur = ext[p2].port;
      }
    }
    return { m: m2, loops };
  }

  /* The Jones polynomial of a rope with crossing bits. Returns
   * { V, writhe, n, ok } with V a polynomial in t (exponents are whole numbers
   * for a knot). */
  K.jones = function (pts, cr, bits) {
    cr = cr || K.crossings(pts);
    if (!cr.length) return { V: { 0: 1 }, writhe: 0, n: 0, ok: true };
    const pd = K.pd(cr, bits);
    const br = K.bracket(pd);
    // f = (−A³)^(−w) <D>
    const w = pd.writhe;
    let f = P.shift(br, -3 * w);
    if (w % 2) f = P.scale(f, -1);
    const V = {};
    let ok = true;
    for (const k in f) {
      if (+k % 4) ok = false;
      V[-k / 4] = f[k];
    }
    return { V: P.clean(V), writhe: w, n: cr.length, ok };
  };

  K.isUnknot = function (V) { return P.eq(V, { 0: 1 }); };

  /* Bits that make a diagram alternating (over, under, over … along the rope);
   * flip = true for the mirror image. */
  K.alternating = function (cr, flip) {
    const passes = [];
    cr.forEach((c, k) => { passes.push({ u: c.a, k, first: 1 }); passes.push({ u: c.b, k, first: 0 }); });
    passes.sort((p, q) => p.u - q.u);
    const bits = cr.map(() => 0);
    passes.forEach((ps, i) => { if ((i % 2 === 0) !== !!flip) { if (ps.first) bits[ps.k] = 1; } else if (!ps.first) bits[ps.k] = 1; });
    return bits;
  };
  K.isAlternating = function (cr, bits) {
    const a = K.alternating(cr), b = K.alternating(cr, true);
    const s = bits.map(Number).join('');
    return s === a.join('') || s === b.join('');
  };

  /* ---------- 4-plats: every knot up to seven crossings is one ---------- */

  /* Conway's notation a1 a2 … an: twists between the middle strands, then the
   * top two, then the middle again … closed by caps at both ends. Returns a
   * closed curve (first point repeated at the end) with alternating bits. */
  K.plat = function (seq, opts) {
    opts = opts || {};
    let s = seq.slice();
    if (s.length % 2 === 0) { s[s.length - 1] -= 1; s.push(1); }
    const gens = [];
    s.forEach((a, i) => { for (let k = 0; k < a; k++) gens.push(i % 2 === 0 ? 1 : 0); }); // swap positions (g, g+1)
    const W = gens.length, per = opts.per || 12, dy = 1;
    // position of the strand that is at position p left of column c, while crossing column c
    const trackAt = [];
    let perm = [0, 1, 2, 3];
    for (let c = 0; c < W; c++) trackAt.push(perm.slice());
    const pts = [];
    // walk: start at the left cap between positions 0 and 1, going right along position 0
    let pos = 0, dir = 1, col = 0;
    const capPartner = (p) => (p % 2 === 0 ? p + 1 : p - 1);
    const visit = new Set();
    for (let guard = 0; guard < 8 * (W + 2); guard++) {
      const key = pos + ':' + dir + ':' + col;
      if (visit.has(key)) break;
      visit.add(key);
      if (dir === 1) {
        // cross columns col .. W-1 going right
        for (let c = 0; c < W; c++) {
          const g = gens[c];
          const swaps = pos === g || pos === g + 1;
          const to = swaps ? (pos === g ? g + 1 : g) : pos;
          for (let k = 0; k < per; k++) {
            const t = k / per;
            const y = pos + (to - pos) * (1 - Math.cos(Math.PI * t)) / 2;
            pts.push([c + t, y * dy]);
          }
          pos = to;
        }
        // right cap
        const q = capPartner(pos), yc = (pos + q) / 2 * dy;
        for (let k = 0; k < per; k++) {
          const a = -Math.PI / 2 + Math.PI * k / per; // from pos to q
          const sgn = q > pos ? 1 : -1;
          pts.push([W + 0.5 * Math.cos(a), yc + sgn * 0.5 * Math.sin(a)]);
        }
        pos = q; dir = -1;
      } else {
        for (let c = W - 1; c >= 0; c--) {
          const g = gens[c];
          const swaps = pos === g || pos === g + 1;
          const to = swaps ? (pos === g ? g + 1 : g) : pos;
          for (let k = 0; k < per; k++) {
            const t = k / per;
            const y = pos + (to - pos) * (1 - Math.cos(Math.PI * t)) / 2;
            pts.push([c + 1 - t, y * dy]);
          }
          pos = to;
        }
        const q = capPartner(pos), yc = (pos + q) / 2 * dy;
        for (let k = 0; k < per; k++) {
          const a = Math.PI / 2 + Math.PI * k / per;
          const sgn = q > pos ? 1 : -1;
          pts.push([0.5 * Math.cos(a), yc - sgn * 0.5 * Math.sin(a)]);
        }
        pos = q; dir = 1;
      }
      if (pos === 0 && dir === 1) break;
    }
    pts.push(pts[0].slice());
    const cr = K.crossings(pts);
    return { pts, cr, bits: K.alternating(cr, opts.flip), gens: W };
  };

  /* ---------- the table ---------- */

  // name, Conway notation, a nickname; V is worked out from the 4-plat at load time
  const TABLE = [
    { id: '3_1', c: 3, conway: [3], name: 'trefoil', nick: 'the overhand knot, closed up' },
    { id: '4_1', c: 4, conway: [2, 2], name: 'figure-eight knot', nick: 'the figure-eight knot of sailors, closed up' },
    { id: '5_1', c: 5, conway: [5], name: 'cinquefoil', nick: 'the pentafoil, a five-leaved star' },
    { id: '5_2', c: 5, conway: [3, 2], name: 'three-twist knot', nick: 'a twist knot with three half-twists' },
    { id: '6_1', c: 6, conway: [4, 2], name: 'stevedore knot', nick: 'named after the stevedore stopper knot' },
    { id: '6_2', c: 6, conway: [3, 1, 2], name: 'knot 6₂', nick: 'the Miller Institute knot' },
    { id: '6_3', c: 6, conway: [2, 1, 1, 2], name: 'knot 6₃', nick: 'the same as its mirror image' },
    { id: '7_1', c: 7, conway: [7], name: 'septafoil', nick: 'the seven-leaved star' },
    { id: '7_2', c: 7, conway: [5, 2], name: 'knot 7₂', nick: 'a twist knot with five half-twists' },
    { id: '7_3', c: 7, conway: [4, 3], name: 'knot 7₃', nick: '' },
    { id: '7_4', c: 7, conway: [3, 1, 3], name: 'knot 7₄', nick: 'the endless knot of Tibetan art' },
    { id: '7_5', c: 7, conway: [3, 2, 2], name: 'knot 7₅', nick: '' },
    { id: '7_6', c: 7, conway: [2, 2, 1, 2], name: 'knot 7₆', nick: '' },
    { id: '7_7', c: 7, conway: [2, 1, 1, 1, 2], name: 'knot 7₇', nick: '' }
  ];
  const DET = { '3_1': 3, '4_1': 5, '5_1': 5, '5_2': 7, '6_1': 9, '6_2': 11, '6_3': 13, '7_1': 7, '7_2': 11, '7_3': 13, '7_4': 15, '7_5': 17, '7_6': 19, '7_7': 21 };
  // published Jones polynomials (up to mirror image) to check our diagrams against
  const KNOWN = {
    '3_1': { '-1': 1, '-3': 1, '-4': -1 },
    '4_1': { '-2': 1, '-1': -1, 0: 1, 1: -1, 2: 1 },
    '5_1': { '-2': 1, '-4': 1, '-5': -1, '-6': 1, '-7': -1 },
    '5_2': { '-1': 1, '-2': -1, '-3': 2, '-4': -1, '-5': 1, '-6': -1 },
    '6_1': { 2: 1, 1: -1, 0: 2, '-1': -2, '-2': 1, '-3': -1, '-4': 1 },
    '6_2': { '-1': 1, 0: -1, 1: 2, 2: -2, 3: 2, 4: -2, 5: 1 },
    '6_3': { '-3': -1, '-2': 2, '-1': -2, 0: 3, 1: -2, 2: 2, 3: -1 },
    '7_1': { '-3': 1, '-5': 1, '-6': -1, '-7': 1, '-8': -1, '-9': 1, '-10': -1 },
    '7_2': { '-1': 1, '-2': -1, '-3': 2, '-4': -2, '-5': 2, '-6': -1, '-7': 1, '-8': -1 }
  };

  K.table = [];
  K.byId = {};
  K.problems = [];
  const U = { id: '0_1', c: 0, name: 'unknot', nick: 'no knot at all', V: { 0: 1 }, Vm: { 0: 1 }, amph: true, det: 1 };
  K.table.push(U);
  K.byId[U.id] = U;
  TABLE.forEach((t) => {
    const pl = K.plat(t.conway);
    const r = K.jones(pl.pts, pl.cr, pl.bits);
    const e = Object.assign({}, t, { V: r.V, Vm: P.mirror(r.V), writhe: r.writhe });
    e.amph = P.eq(e.V, e.Vm);
    e.det = Math.abs(P.evalAt(e.V, -1));
    if (pl.cr.length !== t.c) K.problems.push(t.id + ': the 4-plat has ' + pl.cr.length + ' crossings');
    if (e.det !== DET[t.id]) K.problems.push(t.id + ': determinant ' + e.det + ', expected ' + DET[t.id]);
    if (P.span(e.V) !== t.c) K.problems.push(t.id + ': span ' + P.span(e.V));
    if (KNOWN[t.id] && !P.eq(e.V, KNOWN[t.id]) && !P.eq(e.Vm, KNOWN[t.id])) K.problems.push(t.id + ': Jones polynomial ' + P.str(e.V) + ' does not match the published one');
    // our convention: the "right-handed" member has the larger exponents (the positive trefoil is t + t³ − t⁴)
    const sum = Object.keys(e.V).reduce((s, k) => s + (+k) * Math.abs(e.V[k]), 0);
    if (sum < 0) { const tmp = e.V; e.V = e.Vm; e.Vm = tmp; e.platFlip = true; }
    K.table.push(e);
    K.byId[e.id] = e;
  });
  // two trefoils tied one after the other: the same way (granny) or mirrored (square, or reef)
  (function () {
    const t = K.byId['3_1'];
    const granny = { id: 'granny', c: 6, name: 'granny knot', nick: 'two trefoils of the same hand', composite: ['3_1', '3_1'], V: P.mul(t.V, t.V) };
    granny.Vm = P.mirror(granny.V);
    const square = { id: 'square', c: 6, name: 'square knot', nick: 'the reef knot: a trefoil and its mirror image', composite: ['3_1', '3_1*'], V: P.mul(t.V, t.Vm) };
    square.Vm = P.mirror(square.V);
    [granny, square].forEach((e) => { e.amph = P.eq(e.V, e.Vm); e.det = Math.abs(P.evalAt(e.V, -1)); K.table.push(e); K.byId[e.id] = e; });
  })();

  /* Which knot of the table has this Jones polynomial? { id, mirror } or null.
   * (Up to 7 crossings, and the two composite knots of 6, the polynomial tells
   * them all apart, mirror images included, except that the amphichiral ones
   * are their own mirror images.) */
  K.identify = function (V) {
    for (const e of K.table) {
      if (P.eq(V, e.V)) return { id: e.id, mirror: false, e };
      if (P.eq(V, e.Vm)) return { id: e.id, mirror: true, e };
    }
    return null;
  };

  /* ---------- ropes with two ends ---------- */

  /* The Jones polynomial of an open rope: the ends are joined far away by a
   * piece lifted above everything (as when you hold both ends up in the air).
   * cr / bits are the rope's own crossings; the closing piece is always on top. */
  K.jonesRope = function (pts, cr, bits) {
    return K.prepare(pts, cr).jones(bits);
  };

  /* The closing piece worked out once, so that many choices of bits can be
   * tried quickly: prepare(pts, cr).jones(bits). */
  K.prepare = function (pts, cr) {
    cr = cr || K.crossings(pts);
    const n = pts.length;
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    for (const p of pts) { if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0]; if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
    const size = Math.max(x1 - x0, y1 - y0, 1);
    const M = [(x0 + x1) / 2 + size * 0.0137, y0 - size * 3];
    const ext = pts.concat([M, pts[0]]);
    const crE = K.crossings(ext);
    const key = (c) => Math.round(c.a * 1e6) + ':' + Math.round(c.b * 1e6);
    const idx = new Map();
    cr.forEach((c, k) => idx.set(key(c), k));
    const map = crE.map((c) => (c.b >= n - 1 ? -1 : (idx.has(key(c)) ? idx.get(key(c)) : -1)));
    return {
      cr, extra: map.filter((m) => m < 0).length,
      jones(bits) { return K.jones(ext, crE, map.map((m) => (m < 0 ? 0 : (bits[m] ? 1 : 0)))); }
    };
  };

  /* A rope from a closed curve: cut it open at its highest point and lead
   * the two ends up out of the tangle, like a rope held by both ends.
   * Returns the points (evenly spaced), right-hand tail first. */
  K.ropeFromCurve = function (curve, opts) {
    opts = opts || {};
    const w = opts.w || 13, step = opts.step || 3.5;
    let pts = K.resample(curve, step, true);
    let top = 0;
    pts.forEach((p, i) => { if (p[1] < pts[top][1]) top = i; });
    const n = pts.length, at = (i) => pts[((i % n) + n) % n];
    if (at(top + 1)[0] < at(top - 1)[0]) { pts = pts.slice().reverse(); top = n - 1 - top; }
    const delta = opts.gap || 5 * w;
    const k = Math.round(delta / step);
    const i1 = top + k, i0 = top - k;
    const core = [];
    for (let i = i1; i <= i0 + n; i++) core.push(at(i));
    const tan = (i) => { const a = at(i - 1), b = at(i + 1), l = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; return [(b[0] - a[0]) / l, (b[1] - a[1]) / l]; };
    const tailLen = opts.tail || 150, spread = opts.spread || 58, pt = at(top);
    const bez = (P0, P1, P2, P3, m) => {
      const out = [];
      for (let j = 0; j <= m; j++) {
        const t = j / m, u = 1 - t;
        out.push([0, 1].map((d) => u * u * u * P0[d] + 3 * u * u * t * P1[d] + 3 * u * t * t * P2[d] + t * t * t * P3[d]));
      }
      return out;
    };
    // each tail: a round bend (radius R) from the loop until it heads upwards, then a gentle curve to its tip
    const R = w * 3.2, rot = (v, a) => [v[0] * Math.cos(a) - v[1] * Math.sin(a), v[0] * Math.sin(a) + v[1] * Math.cos(a)];
    const tail = (p0, d0, want, tip) => {
      const out = [p0];
      let a = Math.atan2(d0[0] * want[1] - d0[1] * want[0], d0[0] * want[0] + d0[1] * want[1]);
      let p = p0, d = d0;
      const ds = 2, da = ds / R * Math.sign(a), steps = Math.floor(Math.abs(a) / Math.abs(da || 1));
      for (let k = 0; k < steps; k++) { p = [p[0] + d[0] * ds, p[1] + d[1] * ds]; d = rot(d, da); out.push(p); }
      d = want;
      const L = Math.hypot(tip[0] - p[0], tip[1] - p[1]);
      return out.concat(bez(p, [p[0] + d[0] * L * 0.35, p[1] + d[1] * L * 0.35], [tip[0] - want[0] * L * 0.3, tip[1] - want[1] * L * 0.3], tip, 30).slice(1));
    };
    const up = (sx) => { const l = Math.hypot(sx, 1); return [sx / l, -1 / l]; };
    const pR = at(i1), tR = tan(i1), TR = [pt[0] + spread, pt[1] - tailLen];
    const right = tail(pR, [-tR[0], -tR[1]], up(0.22), TR).reverse();
    const pL = at(i0), tL = tan(i0), TL = [pt[0] - spread, pt[1] - tailLen];
    const left = tail(pL, tL, up(-0.22), TL);
    void bez;
    const all = right.slice(0, -1).concat(core, left.slice(1));
    return K.resample(all, step, false);
  };

  // the rope of a puzzle: data { c: control points, per, bits: '0110…' }
  K.fromData = function (d, opts) {
    const curve = K.spline(d.c, d.per || 10);
    const pts = K.ropeFromCurve(curve, Object.assign({ w: d.w || 13 }, opts || {}));
    const cr = K.crossings(pts);
    const bits = String(d.bits || '').split('').map(Number);
    while (bits.length < cr.length) bits.push(0);
    return { pts, cr, bits: bits.slice(0, cr.length) };
  };

  // heights along the rope: over-strands lifted, under-strands pushed down near each crossing
  K.heights = function (pts, cr, bits, h, reach) {
    const s = K.arc(pts), z = new Float64Array(pts.length);
    const sAt = (u) => { const i = Math.min(pts.length - 2, Math.floor(u)); return s[i] + (s[i + 1] - s[i]) * (u - i); };
    cr.forEach((c, k) => {
      const over = bits[k] ? c.a : c.b, under = bits[k] ? c.b : c.a;
      [[sAt(over), h], [sAt(under), -h]].forEach(([s0, hh]) => {
        for (let i = 0; i < pts.length; i++) {
          const x = (s[i] - s0) / reach;
          if (x > -1 && x < 1) { const f = Math.cos(x * Math.PI / 2); z[i] += hh * f * f; }
        }
      });
    });
    return z;
  };

  // the over/under bits of a 3D rope, read off its heights at every crossing of the flat view
  K.bitsFrom3D = function (p3, cr) {
    const zAt = (u) => { const i = Math.min(p3.length - 2, Math.floor(u)), t = u - i; return p3[i][2] + (p3[i + 1][2] - p3[i][2]) * t; };
    return cr.map((c) => (zAt(c.a) >= zAt(c.b) ? 1 : 0));
  };

  /* ---------- a rope in 3D that can be pulled (position-based dynamics) ---------- */

  /* beads: [[x, y, z]] along the rope, about r apart (r = half the thickness).
   * hands: which beads are held ([0, n-1] by default) and which way they pull. */
  function Sim(beads, opts) {
    opts = opts || {};
    const n = this.n = beads.length;
    this.r = opts.r || 6.5;
    this.p = new Float64Array(3 * n);
    this.o = new Float64Array(3 * n);
    beads.forEach((b, i) => { for (let d = 0; d < 3; d++) { this.p[3 * i + d] = b[d] || 0; this.o[3 * i + d] = b[d] || 0; } });
    let L = 0;
    for (let i = 1; i < n; i++) L += Math.hypot(beads[i][0] - beads[i - 1][0], beads[i][1] - beads[i - 1][1], (beads[i][2] || 0) - (beads[i - 1][2] || 0));
    this.L = L;
    this.rest = L / (n - 1);
    this.skip = opts.skip || Math.max(3, Math.ceil(2.6 * this.r / this.rest));
    this.iters = opts.iters || 16;
    this.damp = opts.damp == null ? 0.95 : opts.damp;
    this.thr = opts.thr || 0.03;
    this.speed = opts.speed || this.r * 0.32;
    this.lift = opts.lift == null ? this.r * 4 : opts.lift;
    const a = beads[0], b = beads[n - 1];
    let dx = b[0] - a[0], dy = b[1] - a[1];
    const dl = Math.hypot(dx, dy);
    if (dl < this.r * 6) { dx = 1; dy = 0; } else { dx /= dl; dy /= dl; }
    if (opts.dir) { dx = opts.dir[0]; dy = opts.dir[1]; }
    this.hands = [
      { i: 0, pos: [a[0], a[1], a[2] || 0], dir: [-dx, -dy] },
      { i: n - 1, pos: [b[0], b[1], b[2] || 0], dir: [dx, dy] }
    ];
    this.phase = this.lift > 0 ? 'lift' : 'pull';
    this.hist = [];
    this.taut = 0;
    this.steps = 0;
    this.done = false;
    this.result = null;
    this.maxSteps = opts.maxSteps || 4000;
    this.pairs = [];
  }
  K.Sim = Sim;

  Sim.prototype.points = function () {
    const out = [];
    for (let i = 0; i < this.n; i++) out.push([this.p[3 * i], this.p[3 * i + 1], this.p[3 * i + 2]]);
    return out;
  };

  Sim.prototype.findPairs = function () {
    const p = this.p, n = this.n, r = this.r, cs = 2.6 * r;
    const grid = new Map();
    const cell = (i) => [Math.floor(p[3 * i] / cs), Math.floor(p[3 * i + 1] / cs), Math.floor(p[3 * i + 2] / cs)];
    const cells = [];
    for (let i = 0; i < n; i++) {
      const c = cell(i);
      cells.push(c);
      const k = c[0] + ',' + c[1] + ',' + c[2];
      let l = grid.get(k);
      if (!l) grid.set(k, l = []);
      l.push(i);
    }
    const pairs = [];
    const lim = (2.6 * r) * (2.6 * r);
    for (let i = 0; i < n; i++) {
      const c = cells[i];
      for (let ax = -1; ax <= 1; ax++) for (let ay = -1; ay <= 1; ay++) for (let az = -1; az <= 1; az++) {
        const l = grid.get((c[0] + ax) + ',' + (c[1] + ay) + ',' + (c[2] + az));
        if (!l) continue;
        for (const j of l) {
          if (j <= i + this.skip) continue;
          const dx = p[3 * j] - p[3 * i], dy = p[3 * j + 1] - p[3 * i + 1], dz = p[3 * j + 2] - p[3 * i + 2];
          if (dx * dx + dy * dy + dz * dz < lim) pairs.push(i, j);
        }
      }
    }
    this.pairs = pairs;
  };

  Sim.prototype.step = function () {
    if (this.done) return;
    const p = this.p, o = this.o, n = this.n, r = this.r, rest = this.rest;
    this.steps++;
    // move the hands: they give way when the rope pulls back
    for (const h of this.hands) {
      if (this.phase === 'lift') {
        h.pos[2] = Math.min(this.lift, h.pos[2] + this.speed);
      } else if (this.phase === 'pull') {
        const e = (this.stretch || 1) - 1;
        const thr = this.thr, k = Math.max(0, Math.min(1, 1 - (e - thr * 0.35) / (thr * 0.65)));
        h.pos[0] += h.dir[0] * this.speed * k;
        h.pos[1] += h.dir[1] * this.speed * k;
      }
    }
    if (this.phase === 'lift' && this.hands.every((h) => h.pos[2] >= this.lift - 1e-9)) this.phase = 'pull';
    // inertia, strongly damped (a rope in syrup: it moves only where it is pulled)
    for (let i = 0; i < 3 * n; i++) {
      const v = (p[i] - o[i]) * this.damp;
      o[i] = p[i];
      p[i] += v;
    }
    if (this.steps % 2 === 1 || !this.pairs.length) this.findPairs();
    const pairs = this.pairs, md = 2 * r, md2 = md * md, bend = 1.62 * rest;
    for (let it = 0; it < this.iters; it++) {
      for (const h of this.hands) { p[3 * h.i] = h.pos[0]; p[3 * h.i + 1] = h.pos[1]; p[3 * h.i + 2] = h.pos[2]; }
      // stiffness: keep i and i+2 apart (no sharp kinks)
      for (let i = 0; i + 2 < n; i++) {
        const a = 3 * i, b = 3 * (i + 2);
        const dx = p[b] - p[a], dy = p[b + 1] - p[a + 1], dz = p[b + 2] - p[a + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < bend && d > 1e-9) {
          const f = (bend - d) / d * 0.25;
          p[a] -= dx * f; p[a + 1] -= dy * f; p[a + 2] -= dz * f;
          p[b] += dx * f; p[b + 1] += dy * f; p[b + 2] += dz * f;
        }
      }
      // length: every link keeps its length (sweeping both ways in turn)
      const fwd = it % 2 === 0;
      for (let s = 0; s + 1 < n; s++) {
        const i = fwd ? s : n - 2 - s;
        const a = 3 * i, b = a + 3;
        const dx = p[b] - p[a], dy = p[b + 1] - p[a + 1], dz = p[b + 2] - p[a + 2];
        const d = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-9;
        const wa = i === 0 ? 0 : 1, wb = i + 1 === n - 1 ? 0 : 1;
        if (!wa && !wb) continue;
        const f = (d - rest) / d / (wa + wb);
        p[a] += dx * f * wa; p[a + 1] += dy * f * wa; p[a + 2] += dz * f * wa;
        p[b] -= dx * f * wb; p[b + 1] -= dy * f * wb; p[b + 2] -= dz * f * wb;
      }
      // the rope cannot pass through itself
      for (let k = 0; k < pairs.length; k += 2) {
        const a = 3 * pairs[k], b = 3 * pairs[k + 1];
        const dx = p[b] - p[a], dy = p[b + 1] - p[a + 1], dz = p[b + 2] - p[a + 2];
        const d2 = dx * dx + dy * dy + dz * dz;
        if (d2 >= md2) continue;
        const d = Math.sqrt(d2) || 1e-9;
        const wa = pairs[k] === 0 || pairs[k] === n - 1 ? 0 : 1, wb = pairs[k + 1] === 0 || pairs[k + 1] === n - 1 ? 0 : 1;
        if (!wa && !wb) continue;
        const f = (md - d) / d / (wa + wb);
        p[a] -= dx * f * wa; p[a + 1] -= dy * f * wa; p[a + 2] -= dz * f * wa;
        p[b] += dx * f * wb; p[b + 1] += dy * f * wb; p[b + 2] += dz * f * wb;
      }
    }
    for (const h of this.hands) { p[3 * h.i] = h.pos[0]; p[3 * h.i + 1] = h.pos[1]; p[3 * h.i + 2] = h.pos[2]; }
    // is the rope taut? (the links cannot all keep their length any more)
    let len = 0;
    for (let i = 0; i + 1 < n; i++) len += Math.hypot(p[3 * i + 3] - p[3 * i], p[3 * i + 4] - p[3 * i + 1], p[3 * i + 5] - p[3 * i + 2]);
    const stretch = len / this.L;
    const span = Math.hypot(this.hands[1].pos[0] - this.hands[0].pos[0], this.hands[1].pos[1] - this.hands[0].pos[1]);
    this.stretch = stretch;
    this.span = span;
    if (this.phase === 'pull') {
      this.hist.push(span);
      const back = this.hist.length > 80 ? this.hist[this.hist.length - 81] : -Infinity;
      this.taut = span - back < this.r * 0.5 ? this.taut + 1 : 0;
      if (this.steps % 10 === 0 && span > this.L * 0.94) {
        // straight when, seen from above, the rope no longer crosses itself
        const flat = [];
        for (let i = 0; i < n; i++) flat.push([p[3 * i], p[3 * i + 1]]);
        if (!K.crossings(flat).length) { this.done = true; this.result = 'straight'; }
      }
      if (!this.done && this.taut > 30) { this.done = true; this.result = 'tight'; }
    }
    if (this.steps >= this.maxSteps) { this.done = true; this.result = this.result || 'timeout'; }
  };

  // a rope's beads for the simulation: evenly spaced, lifted at the crossings
  K.beadsOf = function (pts, cr, bits, r) {
    const beads = K.resample(pts, r * 1.4, false);
    const bcr = K.crossings(beads);
    // carry the bits over by position
    // (both ropes run the same way, so the first strand of a crossing is the same strand)
    const bb = bcr.map((c) => {
      let best = 0, bd = Infinity;
      cr.forEach((c0, k) => { const d = Math.hypot(c0.x - c.x, c0.y - c.y); if (d < bd) { bd = d; best = k; } });
      return bits[best];
    });
    const z = K.heights(beads, bcr, bb, r * 1.45, r * 7);
    return beads.map((p, i) => [p[0], p[1], z[i]]);
  };

  // what knot a 3D rope is (flat view from above, ends joined over the top)
  K.jones3D = function (p3) {
    const flat = p3.map((q) => [q[0], q[1]]);
    const cr = K.crossings(flat);
    return K.jonesRope(flat, cr, K.bitsFrom3D(p3, cr));
  };

  /* ---------- drawing ---------- */

  /* Cut the rope where it passes under another strand. gap(c) = half the
   * length (along the rope) to leave out. Returns [{ pts, s0, s1 }] pieces;
   * closed: the polyline's last point is its first and the pieces may wrap. */
  K.pieces = function (pts, cr, bits, gap, closed) {
    const s = K.arc(pts), L = s[s.length - 1];
    const sAt = (u) => { const i = Math.min(pts.length - 2, Math.floor(u)); return s[i] + (s[i + 1] - s[i]) * (u - i); };
    let cuts = [];
    cr.forEach((c, k) => {
      const under = bits[k] ? c.b : c.a;
      const g = typeof gap === 'function' ? gap(c) : gap;
      const m = sAt(under);
      if (closed) {
        if (m - g < 0) cuts.push([m - g + L, L], [0, m + g]);
        else if (m + g > L) cuts.push([m - g, L], [0, m + g - L]);
        else cuts.push([m - g, m + g]);
      } else cuts.push([Math.max(0, m - g), Math.min(L, m + g)]);
    });
    cuts.sort((a, b) => a[0] - b[0]);
    const merged = [];
    cuts.forEach((c) => { const l = merged[merged.length - 1]; if (l && c[0] <= l[1]) l[1] = Math.max(l[1], c[1]); else merged.push(c.slice()); });
    const spans = [];
    let from = 0;
    merged.forEach((c) => { if (c[0] > from) spans.push([from, c[0]]); from = Math.max(from, c[1]); });
    if (from < L) spans.push([from, L]);
    const ptAt = (v) => {
      let i = 0, lo = 0, hi = s.length - 1;
      while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (s[mid] <= v) lo = mid; else hi = mid - 1; }
      i = Math.min(lo, pts.length - 2);
      const t = (v - s[i]) / ((s[i + 1] - s[i]) || 1);
      return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * t, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * t, i];
    };
    const out = spans.map(([a, b]) => {
      const pa = ptAt(a), pb = ptAt(b);
      const list = [[pa[0], pa[1]]];
      for (let i = pa[2] + 1; i <= pb[2]; i++) list.push(pts[i]);
      list.push([pb[0], pb[1]]);
      return { pts: list, s0: a, s1: b };
    });
    if (closed && out.length > 1 && out[0].s0 === 0 && out[out.length - 1].s1 === L) {
      const last = out.pop();
      out[0] = { pts: last.pts.concat(out[0].pts.slice(1)), s0: last.s0, s1: out[0].s1 + L };
    }
    return out;
  };

  /* For a rope in 3D seen from above: leave out what a higher strand covers.
   * Returns the visible runs as pieces, lowest first (draw them in order). */
  K.visiblePieces = function (p3, w) {
    const n = p3.length, cs = w;
    const s = [0];
    for (let i = 1; i < n; i++) s.push(s[i - 1] + Math.hypot(p3[i][0] - p3[i - 1][0], p3[i][1] - p3[i - 1][1], p3[i][2] - p3[i - 1][2]));
    const grid = new Map(), key = (x, y) => x + ',' + y;
    for (let i = 0; i < n; i++) {
      const k = key(Math.floor(p3[i][0] / cs), Math.floor(p3[i][1] / cs));
      let l = grid.get(k);
      if (!l) grid.set(k, l = []);
      l.push(i);
    }
    const hidden = new Uint8Array(n), lim = w * 0.98, lim2 = lim * lim;
    for (let i = 0; i < n; i++) {
      const gx = Math.floor(p3[i][0] / cs), gy = Math.floor(p3[i][1] / cs);
      for (let ax = -1; ax <= 1 && !hidden[i]; ax++) for (let ay = -1; ay <= 1 && !hidden[i]; ay++) {
        const l = grid.get(key(gx + ax, gy + ay));
        if (!l) continue;
        for (const j of l) {
          if (Math.abs(s[j] - s[i]) < 2.2 * w || p3[j][2] <= p3[i][2] + w * 0.05) continue;
          const dx = p3[j][0] - p3[i][0], dy = p3[j][1] - p3[i][1];
          if (dx * dx + dy * dy < lim2) { hidden[i] = 1; break; }
        }
      }
    }
    const out = [];
    let cur = null;
    for (let i = 0; i < n; i++) {
      if (hidden[i]) { if (cur) { out.push(cur); cur = null; } continue; }
      if (!cur) cur = { pts: [], s0: s[i], s1: s[i], z: 0 };
      cur.pts.push([p3[i][0], p3[i][1]]);
      cur.s1 = s[i];
      cur.z += p3[i][2];
    }
    if (cur) out.push(cur);
    const L = s[n - 1];
    out.forEach((pc) => { pc.z /= pc.pts.length; if (pc.s1 >= L - 1e-6) pc.s1 = L; });
    return { pieces: out.filter((pc) => pc.pts.length > 1).sort((a, b) => a.z - b.z), L };
  };

  K.pathOf = function (list) {
    const f = (v) => Math.round(v * 10) / 10;
    let d = 'M' + f(list[0][0]) + ' ' + f(list[0][1]);
    for (let i = 1; i < list.length; i++) d += 'L' + f(list[i][0]) + ' ' + f(list[i][1]);
    return d;
  };

  // a closed diagram of a table knot: { pts, cr, bits } (pts closed: last = first)
  K.picture = function (id, mirror) {
    const pic = K.PICS[id];
    if (!pic) return null;
    let c = pic.c;
    if (pic.compose) return K.composite(pic.compose.map((x) => (mirror ? x.replace(/\*$/, '') + (x.endsWith('*') ? '' : '*') : x)));
    const sp = K.spline(c, pic.per || 8);
    let pts = sp.concat([sp[0]]);
    if (mirror) pts = pts.map((q) => [100 - q[0], q[1]]);
    const cr = K.crossings(pts);
    return { pts, cr, bits: String(pic.bits).split('').map(Number), closed: true };
  };

  // two table knots tied one after the other: 'id' or 'id*' (the mirror image)
  K.composite = function (list) {
    const parts = list.map((x) => K.picture(x.replace(/\*$/, ''), x.endsWith('*')));
    // place them side by side, cut each open at the facing sides and join with two bridges
    const A = parts[0], B = parts[1];
    const a = A.pts.slice(0, -1), b = B.pts.slice(0, -1).map((q) => [q[0] + 128, q[1] + 6]);
    let ia = 0, ib = 0;
    a.forEach((q, i) => { if (q[0] > a[ia][0]) ia = i; });
    b.forEach((q, i) => { if (q[0] < b[ib][0]) ib = i; });
    const na = a.length, nb = b.length;
    const A2 = (i) => a[((i % na) + na) % na], B2 = (i) => b[((i % nb) + nb) % nb];
    // direction at the cut: a runs downwards there, b upwards (reverse if not)
    let aDown = A2(ia + 1)[1] > A2(ia - 1)[1], bUp = B2(ib + 1)[1] < B2(ib - 1)[1];
    const k = 5;
    const arcA = [], arcB = [];
    for (let j = k; j <= na - k; j++) arcA.push(A2(aDown ? ia + j : ia - j));
    for (let j = k; j <= nb - k; j++) arcB.push(B2(bUp ? ib + j : ib - j));
    // arcA runs from below the cut round to above it; arcB from above to below
    const pts = arcA.concat(arcB);
    pts.push(pts[0].slice());
    const cr = K.crossings(pts);
    // bits by position from the two parts: the strand that was on top stays on top
    const src = [];
    A.cr.forEach((c, i) => src.push({ x: c.x, y: c.y, over: A.bits[i] ? c.da : c.db }));
    B.cr.forEach((c, i) => src.push({ x: c.x + 128, y: c.y + 6, over: B.bits[i] ? c.da : c.db }));
    return { pts, cr, bits: K.bitsByOver(cr, src), closed: true };
  };

  /* Carry over/under from old crossings to new ones at the same places:
   * src [{ x, y, over: direction of the strand on top }]. */
  K.bitsByOver = function (cr, src) {
    return cr.map((c) => {
      let best = src[0], bd = Infinity;
      src.forEach((q) => { const d = Math.hypot(q.x - c.x, q.y - c.y); if (d < bd) { bd = d; best = q; } });
      if (!best) return 0;
      const ca = Math.abs(best.over[0] * c.da[0] + best.over[1] * c.da[1]);
      const cb = Math.abs(best.over[0] * c.db[0] + best.over[1] * c.db[1]);
      return ca >= cb ? 1 : 0;
    });
  };

  /* A small picture of a diagram as SVG markup (a thick rope with gaps).
   * o: { size, color, edge, pad } */
  K.svg = function (dg, o) {
    o = o || {};
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    dg.pts.forEach((q) => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
    const size = Math.max(x1 - x0, y1 - y0);
    const w = o.w || size * 0.06, pad = (o.pad == null ? 0.09 : o.pad) * size + w;
    const pieces = K.pieces(dg.pts, dg.cr, dg.bits, (c) => w * 0.5 / Math.max(0.35, Math.sin(c.ang * Math.PI / 180)) + w * 0.55, dg.closed);
    const d = pieces.map((pc) => K.pathOf(pc.pts)).join('');
    const vb = [x0 - pad, y0 - pad, x1 - x0 + 2 * pad, y1 - y0 + 2 * pad].map((v) => Math.round(v * 10) / 10).join(' ');
    const col = o.color || '#d9a05b', edge = o.edge || '#6e4a1c';
    return '<svg viewBox="' + vb + '" preserveAspectRatio="xMidYMid meet" class="' + (o.cls || 'kn-pic') + '"><g fill="none" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="' + d + '" stroke="' + edge + '" stroke-width="' + (w * 1.28).toFixed(2) + '"/>' +
      '<path d="' + d + '" stroke="' + col + '" stroke-width="' + w.toFixed(2) + '"/>' +
      '<path d="' + d + '" stroke="rgba(255,255,255,.35)" stroke-width="' + (w * 0.28).toFixed(2) + '" transform="translate(' + (-w * 0.16).toFixed(2) + ' ' + (-w * 0.16).toFixed(2) + ')"/>' +
      '</g></svg>';
  };

  K.PICS = {
    '0_1': { c: [50, 0, 85.4, 14.6, 100, 50, 85.4, 85.4, 50, 100, 14.6, 85.4, 0, 50, 14.6, 14.6], bits: '' },
    '3_1': { c: [50,0,63.2,3.1,73.8,11.4,79.8,23.5,80.4,37,75.4,49.6,66.6,60,61.5,72.6,54.6,84.2,43.6,92.1,30.4,94.8,17.2,91.8,6.6,83.3,0.8,71.1,0.8,57.6,6.5,45.4,16.8,36.6,29.8,32.9,43.3,34.2,56.7,34.2,70.2,32.9,83.2,36.6,93.5,45.4,99.2,57.6,99.2,71.1,93.4,83.3,82.8,91.8,69.6,94.8,56.4,92.1,45.4,84.2,38.5,72.6,33.4,60,24.6,49.6,19.6,37,20.2,23.5,26.2,11.4,36.8,3.1], bits: '101' },
    '4_1': { c: [6.8,92.1,15,98.1,24.9,100,34.8,97.9,43.6,92.8,51.1,85.9,57.6,78.1,63.4,69.7,68.8,61.1,73.4,52,76.3,42.3,77.1,32.2,75.3,22.2,70.6,13.3,63.3,6.2,54.3,1.7,44.3,0,34.2,1,24.6,4.5,16.3,10.3,9.6,17.9,5,26.9,3.1,36.9,4.4,46.9,9.4,55.6,18.7,57.8,27.7,53,36.9,49,46.8,50.1,55.7,55,63.9,61,71.6,67.7,78.5,75.1,82.6,84.2,74.1,86.8,64.4,83.8,55.1,79.5,46.2,74.6,37.6,69.1,30,62.4,23.4,54.6,15,49.7,6.4,54.5,1.6,63.4,0.1,73.4,1.7,83.3], bits: '0101' },
    '5_1': { c: [50,0,59.8,2.8,67,10,70.9,19.6,71.6,29.8,70.1,40,73.1,49.3,80.3,56.6,85.8,65.3,88.2,75.3,86.6,85.4,80.4,93.4,70.8,96.9,60.7,95.3,52,89.9,45.4,82,40.6,72.8,32.7,67.1,22.6,65.4,13,61.6,5.2,55,0.5,45.9,0.9,35.7,6.6,27.3,15.7,22.6,25.9,21.9,35.9,24.4,45.1,29,54.9,29,64.1,24.4,74.1,21.9,84.3,22.6,93.4,27.3,99.1,35.7,99.5,45.9,94.8,55,87,61.6,77.4,65.4,67.3,67.1,59.4,72.8,54.6,82,48,89.9,39.3,95.3,29.2,96.9,19.6,93.4,13.4,85.4,11.8,75.3,14.2,65.3,19.7,56.6,26.9,49.3,29.9,40,28.4,29.8,29.1,19.6,33,10,40.2,2.8], bits: '10101' },
    '5_2': { c: [36.4,1.9,43.3,6.3,49.4,11.5,55.1,17.3,60.4,23.4,65.4,29.8,70.1,36.5,74.6,43.2,79.6,49.6,82.6,57,79.9,64.5,73.9,69.9,66.6,73.4,58.7,75.1,50.6,75.6,42.5,75,34.6,73.4,26.8,71.1,19.3,67.9,12.2,64,5.8,59.1,1,52.6,0.8,44.8,5.6,38.4,12.2,33.7,19.4,30,26.9,26.8,34.7,25.7,39.1,32.3,46.8,33.2,54.6,30.8,62.3,28.2,70.2,26.4,78.3,26.1,86.1,28,93,32.2,97.9,38.6,99.9,46.4,98.8,54.4,95,61.5,88.9,66.8,81.3,69.4,73.3,69.1,65.9,65.8,60.1,60.3,55.7,53.4,52.3,46,49.1,38.6,45,31.6,37.9,29.4,30.6,28.1,26.2,21.3,23.9,13.6,23.5,5.5,28.6,0.1], bits: '10101' },
    '6_1': { c: [99.2,39.6,96.6,32.8,92.8,26.6,88.1,21.1,82.6,16.3,76.6,12.2,70.1,9,63.2,6.8,56,5.8,48.7,6.1,41.7,7.9,35,10.8,28.7,14.4,22.6,18.3,16.4,22.2,10.4,26.2,4.8,30.9,0.6,36.8,0.7,43.9,4.8,49.8,10.5,54.3,16.7,58.1,23.2,61.3,29.9,64.1,36.9,66.3,44,67.9,51.2,68.6,58.5,68.5,65.6,67.1,72.4,64.6,78.5,60.7,83.4,55.3,84.3,48.5,77.7,47.3,70.8,49.6,63.8,49.2,59.4,44.2,52.2,44.8,45,44.4,38.4,41.4,33,36.6,28.7,30.8,25,24.5,21.6,18.1,18.3,11.6,15.4,4.9,16.9,0.6,22.5,5.3,27.6,10.4,32.6,15.7,37.7,20.9,43,25.9,48.7,30.3,51.9,36.7,54.4,43.5,60.2,47,65.9,48.1,69.4,54.4,74.3,59.7,80.8,62.9,87.9,63,94.3,59.7,98.5,53.9,100,46.8], bits: '010101' },
    '6_2': { c: [7,74.7,15,75.1,22.9,73.8,30.7,71.5,38.2,68.6,45.5,65.2,52.6,61.5,59.7,57.6,66.5,53.4,72.8,48.3,78.4,42.5,85.1,38.2,92.8,39.3,98,45.4,99.9,53.2,99,61.1,95.6,68.4,90.2,74.3,83.1,78.1,75.2,79.5,67.3,78.6,59.7,75.8,52.9,71.5,46.9,66.1,41.6,60.1,36.6,53.8,31,48.1,23.5,49.2,16.2,49.1,10.6,43.4,6,36.7,2.5,29.5,0.9,21.7,2.4,13.8,7.4,7.7,14.5,3.8,22.2,1.6,30.2,0.4,38.2,0,46.2,0.3,54.3,1.1,62.2,2.6,69.9,5,77.2,8.2,84,12.6,89.8,18.1,94,25,96,32.7,94.6,40.6,89.2,46.1,81.8,43.9,75.3,39.1,68,36,60,36.1,52.6,39.2,45.8,43.4,39,47.9,31.8,51.3,24.7,49.2,17.9,46.1,10.8,49.8,5.1,55.4,1,62.3,0.6,70.1], bits: '101101' },
    '6_3': { c: [2.6,75.8,9.4,80,17.4,80.7,25.4,79.1,32.9,76,39.8,71.9,46.3,67,52.4,61.6,58.4,56.2,65.6,52.6,73.6,53,81,56.1,88,60.3,94.3,65.4,99.5,71.5,94.9,75.5,86.9,73.8,79.2,71.3,71.5,68.8,63.8,66.2,56.9,61.9,50.8,56.7,44.4,51.6,36.8,49.1,28.9,50.7,21.5,53.8,13.8,53.5,9.6,46.7,7.9,38.8,8.2,30.7,10.4,22.9,14.4,15.9,20,10,26.7,5.5,34.1,2.3,42,0.4,50.1,0,58.2,0.9,66,3,73.3,6.4,80,11.1,85.5,17,89.6,23.9,92.2,31.6,93,39.7,92.2,47.7,90,55.5,86.9,63,83.4,70.3,79.5,77.4,74.3,83.6,67.4,87.8,59.4,88.9,51.5,87,44.4,83.1,38.2,77.9,32.8,71.9,28.2,65.2,24.2,58.1,20.2,51.1,12.8,49.2,6.1,53.6,1.6,60.4,0,68.2], bits: '010110' },
    '7_1': { c: [50,0,57.9,2.8,63.4,9.3,66.3,17.4,67.3,25.9,67.9,34.4,74.8,38.8,83,41.2,90.7,45,96.9,50.8,99.9,58.7,97.7,66.8,91.1,72,82.8,74.2,74.3,74,65.8,72.5,58.2,74.7,54.1,82.2,49.3,89.3,43,95,35,98,26.8,96.3,21.4,89.8,19.8,81.5,21,73,24,65,26.7,56.9,21.4,50.5,15.2,44.6,10.2,37.7,7.5,29.6,8.8,21.3,15,15.5,23.4,14.2,31.6,16.3,39.2,20.4,46.1,25.4,53.9,25.4,60.8,20.4,68.4,16.3,76.6,14.2,85,15.5,91.2,21.3,92.5,29.6,89.8,37.7,84.8,44.6,78.6,50.5,73.3,56.9,76,65,79,73,80.2,81.5,78.6,89.8,73.2,96.3,65,98,57,95,50.7,89.3,45.9,82.2,41.8,74.7,34.2,72.5,25.7,74,17.2,74.2,8.9,72,2.3,66.8,0.1,58.7,3.1,50.8,9.3,45,17,41.2,25.2,38.8,32.1,34.4,32.7,25.9,33.7,17.4,36.6,9.3,42.1,2.8], bits: '1010101' },
    '7_2': { c: [23.1,0.4,28.6,1.5,34.1,2.8,39.6,4.5,45,6.3,50.3,8.3,55.5,10.5,60.7,12.9,65.8,15.3,70.9,17.9,75.9,20.6,81.2,22.7,83.1,24.1,78.8,27.8,73.9,30.6,68.7,32.9,63.3,34.7,57.8,36.1,52.2,37.1,46.5,37.7,40.9,38,35.2,38.1,29.5,38,23.8,37.8,18.1,37.5,12.5,37.1,6.8,36.6,1.2,35.5,2.3,31.3,6.8,27.8,11.4,24.5,15.9,20.9,20.2,17.2,24.8,14,29.8,16,34.6,19,39.6,16.9,44.3,18.9,49.5,21.2,55,20.6,60,17.8,64.5,14.4,69.2,11.1,74.2,8.4,79.6,6.9,85.3,6.8,90.7,8.4,95.3,11.7,98.6,16.3,99.9,21.8,99.1,27.3,96.2,32.2,91.6,35.5,86.2,36.9,80.6,36.5,75.3,34.5,70.5,31.4,66.4,27.5,62.6,23.3,58.8,19,54.5,15.3,49.2,14,44.4,16.9,39.3,17.6,34.3,17.2,29.5,20.3,24,21,18.7,19.1,14.5,15.4,11.1,10.9,9.2,5.6,11.9,1,17.4,0], bits: '1010101' },
    '7_3': { c: [0.3,40.7,2.1,34.6,5.1,29,8.9,23.9,13.4,19.4,18.5,15.6,24,12.4,30,10.1,36.2,8.8,42.5,8.7,48.8,9.9,54.6,12.3,60.2,15.5,66.2,16.8,71.6,13.6,76.2,9.2,80.5,4.5,85.1,0.1,83.7,5.5,80.9,11.2,77.9,16.8,74.8,22.4,71.5,27.8,67.8,33,63.4,37.6,58.2,41.3,52.3,43.6,46,44.2,39.7,43.3,35.4,46.3,30.3,49.1,24.1,47.7,18,46.1,14.8,50.4,17.8,55.9,22.6,60,28.4,62.7,34.5,64.4,40.8,65.1,47.2,64.8,53.5,63.8,59.6,62.2,65.6,60.1,71.5,57.7,77.3,55.1,83,52.2,88.5,49,93.7,45.3,98,40.7,99.9,34.7,97.4,29,92.8,24.6,87.6,21,82.3,17.5,77,14,71.5,10.7,65.4,9,59.4,10.5,54.5,14.5,50.8,19.7,47.8,25.3,45.5,31.2,44.1,37.4,41.6,43.2,36.3,45.7,31.2,47.1,28.2,52.7,23.9,57.4,18.2,60.1,11.9,60.4,6.2,57.9,2.1,53.1,0.2,47.1], bits: '0101010' },
    '7_4': { c: [93.3,78.1,87.4,82.2,80.4,83.6,73.3,82.7,66.4,80.4,60,77.2,53.9,73.4,48,69.1,42.5,64.5,37.3,59.5,32.5,54.1,27.7,48.7,21.3,48.9,14.4,50.3,8.2,46.9,3.6,41.4,0.8,34.8,0.1,27.6,1.8,20.6,5.6,14.6,10.9,9.7,17.1,6,23.8,3.4,30.8,1.7,38,0.6,45.2,0.1,52.4,0,59.6,0.4,66.7,1.3,73.8,2.8,80.6,5,87.1,8.3,92.7,12.7,97.1,18.4,99.6,25.2,99.8,32.4,97.6,39.2,93.5,45.1,87.9,49.5,81,50,74.4,47.7,69.2,52.4,64.5,57.9,59.5,63.1,54.1,67.9,48.4,72.3,42.4,76.3,36,79.7,29.3,82.3,22.2,83.6,15.1,83,8.7,79.7,4.5,73.9,3,66.9,3.8,59.8,6.4,53.1,10.7,47.4,17.2,45.1,22.8,49.4,29.4,49.6,35.6,46,41.9,42.5,48.8,40.5,55.9,41.6,62.3,44.8,68.5,48.6,75.2,50.8,80.7,46.4,87.3,46.1,92.4,51.2,95.7,57.6,97.2,64.6,96.5,71.8], bits: '1010101' },
    '7_5': { c: [94.6,3.2,87.9,1.6,81,2,74.2,3.4,67.6,5.5,61.1,8.1,54.7,10.7,47.9,12.4,41.5,10,35.8,6,29.8,2.6,23.2,0.4,16.3,0.1,9.7,2.2,4.3,6.5,1,12.5,0.1,19.4,1.7,26.1,6.1,31.4,12.6,33.2,18.6,30,22.9,24.5,26.7,18.7,30.7,13,35.3,7.8,40.9,3.8,47.7,2.6,54,5.1,59.1,9.9,63.3,15.4,67.2,21.2,71.7,26.4,78.2,26.9,84.7,25.9,89.5,30.8,93.1,36.8,95.7,43.2,96.7,50,95.6,56.8,91.9,62.7,86.4,66.8,80,69.4,73.2,71,66.3,71.7,59.3,72,52.4,71.7,45.5,71,38.6,69.8,31.9,68,25.5,65.5,19.4,62.1,14,57.7,9.5,52.5,6.3,46.3,5.1,39.5,6.1,32.6,10.1,27.1,16.5,28.3,22.2,32.2,28.4,35.4,35.1,37,42,36.6,48.7,34.7,55,31.8,61.1,28.5,67.3,25.2,73.8,23.2,79.3,27.1,85.4,29.3,91.4,26,96.2,21,99.4,14.8,99.4,8.1], bits: '1010101' },
    '7_6': { c: [97.6,9.8,91.3,6.6,84.1,6.6,77.1,8.2,70.3,10.4,63.3,11.5,56.6,9.2,50.4,5.5,44.1,2.2,37.2,0.3,30.1,0.6,23.8,3.8,19,9.1,15.7,15.5,13.2,22.2,10.7,28.9,8.6,35.8,7.5,42.9,7.7,50,9.4,57,12.5,63.4,16.9,69.1,22.2,73.9,28.3,77.7,34.9,80.4,41.8,82.3,48.9,83.2,56.1,83.2,63.2,82.3,70.1,80.5,76.7,77.6,82.7,73.8,87.9,68.8,92,62.9,94.6,56.3,95.7,49.2,95.1,42.1,92.8,35.3,88.4,29.8,81.4,29.3,74.9,32.2,68.3,35.1,61.4,36.8,54.5,35.2,48.4,31.5,42.6,27.3,36.5,23.4,29.9,20.7,22.9,19,15.9,17.4,8.9,16.2,1.8,16.7,1.7,22.7,6.9,27.5,13,31.3,19.6,34.1,26.7,35.3,33.4,33.1,38.6,28.2,43.2,22.7,47.6,17,52.1,11.5,57.2,6.4,63.7,4.2,69.4,8.2,73.1,14.3,76.2,20.7,79.1,27.3,82.9,33.3,89.6,34,95.1,29.5,98.7,23.3,100,16.3], bits: '0101010' },
    '7_7': { c: [97.8,74.6,91,76.6,83.8,75.6,76.9,73.4,70.3,70.5,63.7,67.3,57.4,63.7,51.6,59.4,46.1,54.7,40.1,50.6,33,50.1,26.3,52.8,19.8,56,12.8,56.4,8,51.2,5.3,44.5,4.1,37.4,4.5,30.1,6.6,23.2,10.3,17,15.2,11.7,21.1,7.4,27.6,4.1,34.5,1.9,41.6,0.5,48.9,0,56.1,0.3,63.3,1.4,70.2,3.5,76.9,6.4,82.9,10.4,88.1,15.5,92.2,21.5,94.8,28.2,95.8,35.4,95.1,42.6,92.8,49.5,88.8,55.5,82.2,57.1,75.6,54.2,69,51,62,50,55.6,53.3,50,58,44.4,62.5,38.2,66.4,31.8,69.7,25.2,72.8,18.3,75.2,11.2,76.6,4.1,75.7,0.1,70,1.3,62.9,5.3,56.8,11,52.5,17.5,53.6,21.3,59.8,24.7,66.2,28.6,72.3,33.2,78,38.6,82.8,45.1,86,52.3,86.6,59.1,84.3,65,80,69.8,74.7,73.9,68.7,77.5,62.3,80.9,56,86.6,52.3,92.9,55.6,97.4,61.1,99.9,67.9], bits: '1010100' },
    granny: { compose: ['3_1', '3_1'] },
    square: { compose: ['3_1', '3_1*'] }
  };

  /* ---------- reading a diagram: Gauss code and simple moves ---------- */

  // the passes along the rope: [{ k: crossing, over: bool }]
  K.gauss = function (cr, bits) {
    const passes = [];
    cr.forEach((c, k) => { passes.push({ u: c.a, k, over: !!bits[k] }); passes.push({ u: c.b, k, over: !bits[k] }); });
    passes.sort((p, q) => p.u - q.u);
    return passes.map((p) => ({ k: p.k, over: p.over }));
  };

  /* Undo what can be undone by the two easy moves, again and again: a curl
   * (a crossing whose two passes follow each other: Reidemeister I) and a
   * strand lying over another at two crossings in a row (Reidemeister II).
   * Returns { moves: [{ type: 1 | 2, k: [crossings] }], left: crossings that stay }. */
  K.reduce = function (cr, bits) {
    let seq = K.gauss(cr, bits);
    const moves = [];
    for (let guard = 0; guard < 60 && seq.length; guard++) {
      const n = seq.length;
      let found = null;
      for (let i = 0; i < n && !found; i++) {
        const a = seq[i], b = seq[(i + 1) % n];
        if (a.k === b.k) found = { type: 1, k: [a.k] };
      }
      for (let i = 0; i < n && !found; i++) {
        const a = seq[i], b = seq[(i + 1) % n];
        if (a.k === b.k || a.over !== b.over) continue;
        // the other passes of the same two crossings must also be neighbours
        for (let j = 0; j < n; j++) {
          if (j === i) continue;
          const c = seq[j], d = seq[(j + 1) % n];
          if (((c.k === a.k && d.k === b.k) || (c.k === b.k && d.k === a.k)) && c.over === d.over && c.over !== a.over) { found = { type: 2, k: [a.k, b.k] }; break; }
        }
      }
      if (!found) break;
      moves.push(found);
      seq = seq.filter((p) => !found.k.includes(p.k));
    }
    const left = Array.from(new Set(seq.map((p) => p.k)));
    return { moves, left };
  };

  // all the ways to choose m of n things, in order
  function* combos(n, m, start, acc) {
    start = start || 0; acc = acc || [];
    if (acc.length === m) { yield acc.slice(); return; }
    for (let i = start; i <= n - (m - acc.length); i++) { acc.push(i); yield* combos(n, m, i + 1, acc); acc.pop(); }
  }
  K.combos = combos;

  /* The fewest crossings to switch so that goal(V) holds (V the Jones polynomial).
   * Returns { k, set } or null when more than maxK would be needed. */
  K.fewestSwitches = function (prep, bits, goal, maxK, limit) {
    const n = bits.length;
    let tries = 0;
    for (let m = 0; m <= Math.min(maxK, n); m++) {
      for (const set of combos(n, m)) {
        const b = bits.slice();
        set.forEach((i) => { b[i] = b[i] ? 0 : 1; });
        if (goal(prep.jones(b).V)) return { k: m, set };
        if (limit && ++tries > limit) return null;
      }
    }
    return null;
  };

  /* ---------- making diagrams ---------- */

  K.W = 13;                          // the rope's thickness on the table
  K.BOX = [560, 400];                // the size a new diagram is fitted into

  function bbox(pts) {
    let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
    pts.forEach((q) => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
    return { x0, x1, y0, y1, w: x1 - x0, h: y1 - y0 };
  }
  K.bbox = bbox;

  K.fit = function (pts, W, H) {
    const b = bbox(pts);
    const s = Math.min(W / (b.w || 1), H / (b.h || 1));
    const ox = (W - b.w * s) / 2, oy = (H - b.h * s) / 2;
    return pts.map((q) => [(q[0] - b.x0) * s + ox, (q[1] - b.y0) * s + oy]);
  };

  // a gentle random bending of the plane (it never changes which strand crosses which)
  K.warp = function (pts, rng, amt) {
    const b = bbox(pts), S = Math.max(b.w, b.h) || 1;
    const A = (amt == null ? 0.05 : amt) * S;
    const f1 = (0.6 + rng() * 1.2) * 2 * Math.PI / S, f2 = (0.6 + rng() * 1.2) * 2 * Math.PI / S;
    const p1 = rng() * 7, p2 = rng() * 7;
    const a1 = A * (0.4 + rng() * 0.6), a2 = A * (0.4 + rng() * 0.6);
    // keep it one-to-one: |a1 f1 · a2 f2| < 1
    const k = Math.min(1, 0.8 / Math.sqrt(Math.max(1e-9, a1 * f1 * a2 * f2)));
    return pts.map((q) => {
      const x = q[0] + a1 * k * Math.sin(f1 * q[1] + p1);
      return [x, q[1] + a2 * k * Math.sin(f2 * x + p2)];
    });
  };

  function rotate(pts, ang, mirror) {
    const c = Math.cos(ang), s = Math.sin(ang);
    return pts.map((q) => { const x = mirror ? -q[0] : q[0]; return [x * c - q[1] * s, x * s + q[1] * c]; });
  }

  /* A closed curve of some kind (dense points). kinds:
   *   blob   a smoothed random polygon        torus  a star going round p times
   *   liss   a Lissajous figure               pic    a knot of the table, bent about
   *   spiro  a spirograph curve */
  K.randomCurve = function (rng, kind, opts) {
    opts = opts || {};
    let pts = [];
    if (kind === 'blob') {
      const turns = rng() < 0.55 ? 2 : (rng() < 0.3 ? 3 : 1);
      const n = rng.range(opts.nMin || (3 + 2 * turns), opts.nMax || (5 + 3 * turns));
      const noise = turns === 1 ? 1.6 + rng() * 1.6 : 0.3 + rng() * 0.9;
      const flat = [];
      for (let i = 0; i < n; i++) {
        const th = 2 * Math.PI * turns * i / n + (rng() - 0.5) * noise, r = 0.35 + rng() * 0.65;
        flat.push(Math.cos(th) * r * 100, Math.sin(th) * r * 100);
      }
      pts = K.spline(flat, 24);
      // round off the corners
      for (let pass = 0; pass < 4; pass++) {
        const m = pts.length, q = [];
        for (let i = 0; i < m; i++) {
          let sx = 0, sy = 0;
          for (let k = -6; k <= 6; k++) { const a = pts[(i + k + m) % m]; sx += a[0]; sy += a[1]; }
          q.push([sx / 13, sy / 13]);
        }
        pts = q;
      }
    } else if (kind === 'plat') {
      // a 4-plat: twists between the middle strands, then the top two, …
      const want = opts.n || rng.range(3, 9);
      let seq = [];
      let left = want;
      while (left > 0) { const a = Math.min(left, rng.range(1, 3)); seq.push(a); left -= a; }
      if (seq.length % 2 === 0) seq.push(1);
      if (opts.seq) seq = opts.seq.slice();
      const pl = K.plat(seq, { per: 16 });
      pts = pl.pts.slice(0, -1).map((q) => [q[0] * 60, q[1] * 60]);
    } else if (kind === 'torus') {
      const opt = opts.pq || rng.pick([[2, 3], [2, 5], [2, 7], [3, 2], [3, 4], [2, 9], [4, 3], [3, 5]]);
      const p = opt[0], q = opt[1], N = 120 * p;
      const A = Math.max(0.25, Math.min(0.62, 0.62 * p / q)) * (0.85 + rng() * 0.3);
      const ph = rng() * 6;
      for (let i = 0; i < N; i++) {
        const th = i / N * 2 * Math.PI * p, r = 1 + A * Math.cos(q * th / p + ph);
        pts.push([r * Math.cos(th) * 100, r * Math.sin(th) * 100]);
      }
    } else if (kind === 'liss') {
      const opt = opts.ab || rng.pick([[3, 2], [4, 1], [5, 1], [6, 1], [3, 1], [5, 2], [7, 1]]);
      const a = opt[0], b = opt[1], ph = 0.2 + rng() * 1.2, N = 360;
      for (let i = 0; i < N; i++) {
        const t = i / N * 2 * Math.PI;
        pts.push([Math.sin(a * t + ph) * 100, Math.sin(b * t) * 100]);
      }
    } else if (kind === 'spiro') {
      const opt = opts.spiro || rng.pick([[5, 2, 1.4], [5, 3, 1.3], [7, 2, 1.2], [4, 3, 1.6], [7, 3, 1.3], [7, 4, 1.4]]);
      const R = opt[0], r = opt[1], d = opt[2] * r, N = 150 * r;
      for (let i = 0; i < N; i++) {
        const t = i / N * 2 * Math.PI * r;
        pts.push([((R - r) * Math.cos(t) + d * Math.cos((R - r) / r * t)) * 20, ((R - r) * Math.sin(t) - d * Math.sin((R - r) / r * t)) * 20]);
      }
    } else if (kind === 'pic') {
      const id = opts.id || rng.pick(Object.keys(K.PICS).filter((k) => (K.PICS[k].c || K.PICS[k].compose) && k !== '0_1'));
      const pic = K.picture(id, !!opts.mirror);
      pts = pic.pts.slice(0, -1);
    }
    if (kind !== 'pic' || opts.spin !== false) pts = rotate(pts, rng() * 2 * Math.PI, false);
    if (opts.stretch !== false) { const sx = 0.8 + rng() * 0.4; pts = pts.map((q) => [q[0] * sx, q[1] / sx]); }
    pts = K.warp(pts, rng, opts.warp == null ? 0.06 : opts.warp);
    return K.fit(pts, K.BOX[0], K.BOX[1]);
  };

  // control points for the stored puzzle: whole numbers, about every 36 units
  K.curveData = function (curve, step) {
    const ctrl = K.resample(curve, step || 34, true);
    return { c: [].concat.apply([], ctrl.map((q) => [Math.round(q[0]), Math.round(q[1])])), per: 8 };
  };

  /* Is the diagram clean enough to read? Crossings well apart and at good
   * angles, strands never brushing past each other. */
  K.clean = function (pts, cr, o) {
    o = o || {};
    const w = o.w || K.W;
    let minA = 90, minD = Infinity;
    for (let i = 0; i < cr.length; i++) {
      minA = Math.min(minA, cr[i].ang);
      for (let j = i + 1; j < cr.length; j++) minD = Math.min(minD, Math.hypot(cr[i].x - cr[j].x, cr[i].y - cr[j].y));
    }
    if (minA < (o.minAng || 36)) return { ok: false, why: 'shallow crossing ' + minA.toFixed(0) + '°' };
    if (minD < (o.minSep || 3.3) * w) return { ok: false, why: 'crossings too close' };
    const s = K.arc(pts), n = pts.length, lim = (o.clear || 2.25) * w, near = 3.3 * w, gapS = 7 * w;
    for (let i = 0; i < n; i += 2) {
      for (let j = i + 2; j < n; j += 2) {
        if (s[j] - s[i] < gapS) continue;
        const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
        if (d >= lim) { if (d > lim * 3) j += Math.floor((d - lim * 3) / 3.5 / 2) * 2; continue; }
        const ok = cr.some((c) => Math.hypot(c.x - pts[i][0], c.y - pts[i][1]) < near && Math.hypot(c.x - pts[j][0], c.y - pts[j][1]) < near);
        if (!ok) return { ok: false, why: 'strands brush past each other' };
      }
    }
    return { ok: true, minA, minD };
  };

  // a rope diagram from stored data, checked: { d, pts, cr, prep } or null
  K.buildChecked = function (d, lo, hi) {
    const r = K.fromData(d);
    if (r.cr.length < lo || r.cr.length > hi) return null;
    // the tails must not cross anything: the closed curve has the same crossings
    const sp = K.spline(d.c, d.per || 10);
    if (K.crossings(sp.concat([sp[0]])).length !== r.cr.length) return null;
    if (!K.clean(r.pts, r.cr).ok) return null;
    return { d, pts: r.pts, cr: r.cr, prep: K.prepare(r.pts, r.cr) };
  };

  // "left-handed trefoil", "figure-eight knot", "knot 5₂ (mirror image)" …
  K.nameOf = function (id, mirror) {
    const e = K.byId[id];
    if (!e) return 'an unknown knot';
    if (id === '3_1') return (mirror ? 'left' : 'right') + '-handed trefoil';
    if (id === 'granny') return (mirror ? 'left' : 'right') + '-handed granny knot';
    if (e.amph || !mirror) return e.name;
    return e.name + ' (mirror image)';
  };
})(typeof window !== 'undefined' ? window : globalThis);
