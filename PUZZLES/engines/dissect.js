/* The Puzzle Cabinet · engines/dissect.js
 *
 * Dissections, two ways.
 *
 *  1. CUT AND REARRANGE (data.kind 'cut'): a shape lies on the table. Cut it
 *     with the knife (straight strokes, or bent ones: stop inside the shape and
 *     carry on from there), then move, turn and turn over the pieces until they
 *     make the target shape. Only so many cuts (or pieces) are allowed.
 *
 *  2. GIVEN PIECES (data.kind 'pieces'): a set of pieces (the T-puzzle,
 *     Archimedes' Stomachion, the Egg of Columbus …) is laid out in a tray;
 *     cover the silhouette with all of them, like a tangram.
 *
 * Coordinates are "source" units (a unit square, a grid step). Every cut
 * piece remembers its outline in source coordinates (data.orig) and the source
 * point its pivot stands for (data.c), so its local shape is orig − c and it is
 * always a rigid motion of a part of the original shape.
 *
 * data (cut): {
 *   kind: 'cut',
 *   shape: [poly, ...],          the starting shape(s), source coordinates
 *   target: [poly, ...],         the goal (in its own coordinates; the engine lays it beside the shape)
 *   show: 'silhouette' | 'name', draw the goal, or only describe it in words (goalName)
 *   goalName: 'a square',
 *   maxCuts, maxPieces,          the limits (either or both)
 *   grid: 1 | 0.5,               knife snap points on this lattice (inside the shape, they travel with the pieces)
 *   lines: 1,                    draw faint grid lines at this step on the pieces (default: grid)
 *   quarters: true,              knife snaps to quarter points of edges too
 *   snaps: [[x, y], ...],        pencil marks: extra knife snap points (irrational construction points)
 *   rot: 45,                     turning step for the pieces (degrees)
 *   noFlip: true,                pieces may not be turned over
 *   colors: ['#...'],            colour of each starting shape
 *   sol: { cuts: [[[x, y], ...], ...],                    each cut a polyline, in order
 *          place: [[ax, ay, x, y, rot, flip], ...] }      for the piece holding (ax, ay): the placement
 *                                                         (G.place: flip, turn, move) taking it to the target
 * }
 * data (pieces): {
 *   kind: 'pieces',
 *   set: 'T' | 'stomachion' | 'egg' | ...   or  pieces: [{ poly, color, name }, ...] inline
 *   sol: [[i, x, y, rot, flip], ...]        where each piece goes (G.place on the set's polygon)
 *   given: [i, ...]                         pieces already in place (fixed)
 *   show: 'silhouette' | 'outline', rot: 45 | 90
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;

  const COLORS = ['#ffb057', '#38d9d3', '#b388ff', '#ff7eb6', '#4ecb8d', '#ffd166', '#7f8cff', '#ff6b6b', '#9be15d', '#f7a5d0', '#5ec8f2', '#e8a87c', '#c5a3ff', '#ffe08a'];

  /* ======================================================================
   * Geometry: cutting a polygon along a polyline
   * ==================================================================== */

  function scaleOf(poly) { const b = G.bbox([poly]); return Math.max(1e-9, b.w + b.h); }

  // strictly inside (not on the boundary, within tol)
  function insideStrict(p, poly, tol) {
    if (!G.pointInPoly(p, poly)) return false;
    for (let i = 0; i < poly.length; i++) if (G.segDist(p, poly[i], poly[(i + 1) % poly.length]) < tol) return false;
    return true;
  }
  function onBoundary(p, poly, tol) {
    for (let i = 0; i < poly.length; i++) if (G.segDist(p, poly[i], poly[(i + 1) % poly.length]) < tol) return true;
    return false;
  }

  // points where the path crosses or touches the polygon's boundary, ordered along the path
  function crossings(poly, path, tol) {
    const out = [];
    const N = poly.length;
    for (let s = 0; s + 1 < path.length; s++) {
      const a = path[s], b = path[s + 1];
      const ab = G.sub(b, a), L = G.len(ab);
      if (L < tol) continue;
      for (let i = 0; i < N; i++) {
        const p = poly[i], q = poly[(i + 1) % N];
        const pq = G.sub(q, p);
        const den = G.cross(ab, pq);
        if (Math.abs(den) < 1e-12 * L * (G.len(pq) + 1e-12)) continue; // parallel: running along an edge never cuts
        const ap = G.sub(p, a);
        const t = G.cross(ap, pq) / den, u = G.cross(ap, ab) / den;
        const et = tol / L, eu = tol / Math.max(G.len(pq), 1e-12);
        if (t < -et || t > 1 + et || u < -eu || u > 1 + eu) continue;
        const tt = Math.max(0, Math.min(1, t));
        out.push({ s: s + tt, pt: G.lerp(a, b, tt) });
      }
      // path vertices lying on the boundary (a bent cut touching an edge)
    }
    for (let s = 0; s < path.length; s++) if (onBoundary(path[s], poly, tol)) out.push({ s, pt: path[s].slice() });
    out.sort((x, y) => x.s - y.s);
    const merged = [];
    out.forEach((c) => {
      const last = merged[merged.length - 1];
      if (last && (G.dist(last.pt, c.pt) < tol * 4 || Math.abs(last.s - c.s) < 1e-9)) return;
      merged.push(c);
    });
    return merged;
  }

  function pathPoint(path, s) {
    const i = Math.min(path.length - 2, Math.max(0, Math.floor(s)));
    return G.lerp(path[i], path[i + 1], Math.max(0, Math.min(1, s - i)));
  }
  // the path between parameters s0 and s1 (both ends included)
  function subPath(path, s0, s1) {
    const pts = [pathPoint(path, s0)];
    for (let k = Math.floor(s0) + 1; k <= Math.ceil(s1) - 1 && k < path.length; k++) if (k > s0 + 1e-9 && k < s1 - 1e-9) pts.push(path[k].slice());
    pts.push(pathPoint(path, s1));
    return pts;
  }

  // insert point x into the ring (on an edge, or at a vertex); returns its index in the new ring
  function insertOnRing(ring, x, tol) {
    for (let i = 0; i < ring.length; i++) if (G.dist(ring[i], x) < tol) return i;
    let best = -1, bd = Infinity;
    for (let i = 0; i < ring.length; i++) {
      const d = G.segDist(x, ring[i], ring[(i + 1) % ring.length]);
      if (d < bd) { bd = d; best = i; }
    }
    if (best < 0 || bd > tol * 50) return -1;
    ring.splice(best + 1, 0, x.slice());
    return best + 1;
  }

  // split one polygon by a chord (x .. y along 'mid' interior points); returns [A, B] or null
  function splitByChord(poly, chord, tol) {
    const ring = poly.map((p) => p.slice());
    const x = chord[0], y = chord[chord.length - 1];
    if (insertOnRing(ring, x, tol) < 0 || insertOnRing(ring, y, tol) < 0) return null;
    const nearest = (q) => { let bi = -1, bd = Infinity; ring.forEach((p, i) => { const dd = G.dist(p, q); if (dd < bd) { bd = dd; bi = i; } }); return bi; };
    const ix = nearest(x), iy = nearest(y);
    if (ix < 0 || iy < 0 || ix === iy) return null;
    const n = ring.length;
    const mid = chord.slice(1, -1);
    const A = [], B = [];
    for (let i = ix; ; i = (i + 1) % n) { A.push(ring[i]); if (i === iy) break; }
    for (let k = mid.length - 1; k >= 0; k--) A.push(mid[k]);
    for (let i = iy; ; i = (i + 1) % n) { B.push(ring[i]); if (i === ix) break; }
    for (let k = 0; k < mid.length; k++) B.push(mid[k]);
    const a = G.clean(A, tol * 0.01), b = G.clean(B, tol * 0.01);
    const s2 = scaleOf(poly) * scaleOf(poly) * 1e-7;
    if (a.length < 3 || b.length < 3 || G.absArea(a) < s2 || G.absArea(b) < s2) return null;
    return [a, b];
  }

  /* Cut a polygon along a polyline. Only the stretches of the path that run
   * through the inside from one point of the boundary to another cut; a path
   * that ends inside leaves that stretch uncut. Returns the pieces, or null. */
  function cutPoly(poly, path, opts) {
    opts = opts || {};
    const sc = scaleOf(poly);
    const tol = opts.tol || sc * 1e-7;
    const runs = runsOf(poly, path, tol);
    if (!runs.length) return null;
    let pieces = [poly.map((p) => p.slice())];
    let cut = false;
    runs.forEach((chord) => {
      const probe = G.mid(chord[0], chord[1]);
      const i = pieces.findIndex((pc) => insideStrict(probe, pc, tol * 10));
      if (i < 0) return;
      const r = splitByChord(pieces[i], chord, tol * 10);
      if (!r) return;
      pieces.splice(i, 1, r[0], r[1]);
      cut = true;
    });
    return cut ? pieces : null;
  }

  // the stretches of a path that would cut a polygon (each from boundary to boundary through the inside)
  function runsOf(poly, path, tol) {
    tol = tol || scaleOf(poly) * 1e-7;
    const xs = crossings(poly, path, tol);
    if (xs.length < 2) return [];
    const runs = [];
    for (let k = 0; k + 1 < xs.length; k++) {
      const s0 = xs[k].s, s1 = xs[k + 1].s;
      if (s1 - s0 < 1e-9) continue;
      // the stretch is inside if points along it are strictly inside
      const probes = [0.5, 0.25, 0.75].map((f) => pathPoint(path, s0 + (s1 - s0) * f));
      if (!probes.every((q) => insideStrict(q, poly, tol * 10))) continue;
      const chord = subPath(path, s0, s1);
      chord[0] = xs[k].pt; chord[chord.length - 1] = xs[k + 1].pt;
      runs.push(chord);
    }
    return runs;
  }

  // cut every polygon of a list; returns { polys, made } (made = how many were cut)
  function cutAll(polys, path) {
    const out = [];
    let made = 0;
    polys.forEach((pl) => {
      const r = cutPoly(pl, path);
      if (r) { made++; r.forEach((q) => out.push(q)); } else out.push(pl);
    });
    return { polys: out, made };
  }

  /* ======================================================================
   * Comparing an arrangement with the goal: anywhere, any way round
   * ==================================================================== */

  function unionArea(polys) { return polys.reduce((s, q) => s + G.absArea(q), 0); }

  function edgeDirs(polys, minLen) {
    const dirs = [];
    polys.forEach((pl) => pl.forEach((p, i) => {
      const q = pl[(i + 1) % pl.length];
      if (G.dist(p, q) < minLen) return;
      const a = ((G.angle(G.sub(q, p)) % 180) + 180) % 180;
      if (!dirs.some((b) => Math.abs(b - a) < 0.05 || Math.abs(Math.abs(b - a) - 180) < 0.05)) dirs.push(a);
    }));
    return dirs;
  }

  function movePolys(polys, m) { return polys.map((pl) => pl.map((p) => G.M.apply(m, p))); }

  /* Does the arrangement U make the shape T? T may be moved, turned (when any)
   * and mirrored (when mirror). Returns the best { iou, missing, extra, m }. */
  function matchShape(U, T, opts) {
    opts = opts || {};
    const res = opts.res || 200;
    const cu = G.areaCentroid(U), ct = G.areaCentroid(T);
    const tryM = (m, r) => {
      const TT = movePolys(T, m);
      const out = G.compareShapes(U, TT, { res: r || res });
      out.m = m;
      return out;
    };
    const baseM = (deg, mir) => {
      let m = G.M.translate(-ct[0], -ct[1]);
      if (mir) m = G.M.mul([-1, 0, 0, 1, 0, 0], m);
      if (deg) m = G.M.mul(G.M.rotate(deg), m);
      return G.M.mul(G.M.translate(cu[0], cu[1]), m);
    };
    // first: as drawn, moved only
    let best = tryM(baseM(0, false));
    if (best.iou >= (opts.good || 0.97) || opts.any === false) return best;
    const sz = Math.sqrt(unionArea(U)) || 1;
    const du = edgeDirs(U, sz * 0.08).slice(0, 40);
    const cands = [];
    [false, true].forEach((mir) => {
      if (mir && opts.mirror === false) return;
      const dt = edgeDirs(T, sz * 0.08).map((a) => (mir ? (180 - a) % 180 : a));
      du.forEach((a) => dt.forEach((b) => {
        const d0 = a - b;
        [d0, d0 + 180].forEach((d) => {
          const dd = G.normDeg(d);
          if (!cands.some((c) => c.mir === mir && Math.abs(c.d - dd) < 0.05)) cands.push({ d: dd, mir });
        });
      }));
    });
    const scored = cands.map((c) => ({ c, r: tryM(baseM(c.d, c.mir), 90) })).sort((x, y) => y.r.iou - x.r.iou);
    scored.slice(0, 4).forEach((s) => {
      const r = tryM(baseM(s.c.d, s.c.mir));
      if (r.iou > best.iou) best = r;
    });
    return best;
  }

  /* ======================================================================
   * Piece sets
   * ==================================================================== */

  function arc(cx, cy, r, a0, a1, n) { // points on an arc, a0 -> a1 in degrees (y down), both ends included
    const out = [];
    for (let i = 0; i <= n; i++) {
      const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180;
      out.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
    }
    return out;
  }
  function eggPieces() {
    // the egg of radius 1 (Moss's construction): lower half a semicircle about O, sides arcs of
    // radius 2 about the ends of the diameter, the top an arc of radius 2 − √2 about C = (0, −1)
    const s2 = Math.SQRT2, rt = 2 - s2;
    const P = [s2 - 1, -s2];
    const aP = Math.atan2(P[1], P[0] + 1) * 180 / Math.PI; // angle of P seen from (−1, 0)
    const red = [[0, -1], [0, -1 - rt]].concat(arc(0, -1, rt, -90, -45, 6).slice(1));
    const teal = [[0, -1], [1, 0]].concat(arc(-1, 0, 2, 0, aP, 12).slice(1, -1)).concat([P]);
    const blue = [[0, -1], [1, 0], [0, 0]];
    const pink = [[s2 - 1, 0], [1, 0]].concat(arc(0, 0, 1, 0, 90, 16).slice(1)).concat([[0, s2 - 1]]);
    const white = [[-(s2 - 1), 0], [s2 - 1, 0], [0, s2 - 1]];
    const mir = (pl) => pl.map((p) => [-p[0], p[1]]).reverse();
    return [
      { poly: white, color: '#f4f1e8', name: 'small triangle' },
      { poly: blue, color: '#6c7bff', name: 'right triangle' }, { poly: mir(blue), color: '#6c7bff', name: 'right triangle' },
      { poly: pink, color: '#ff7eb6', name: 'quarter round' }, { poly: mir(pink), color: '#ff7eb6', name: 'quarter round' },
      { poly: teal, color: '#38d9d3', name: 'curved wing' }, { poly: mir(teal), color: '#38d9d3', name: 'curved wing' },
      { poly: red, color: '#ff6b6b', name: 'small sector' }, { poly: mir(red), color: '#ff6b6b', name: 'small sector' }
    ];
  }

  const SETS = {
    // a common version of the T: a 3 × 1 bar over a 1 × 3 stem
    T: {
      name: 'T-puzzle', rot: 45,
      pieces: [
        { poly: [[0, 0], [0, 1], [1, 1]], color: '#ffd166', name: 'triangle' },
        { poly: [[1.5, 0], [3, 0], [3, 1], [2.5, 1]], color: '#38d9d3', name: 'short trapezoid' },
        { poly: [[1, 1], [2, 2], [2, 4], [1, 4]], color: '#b388ff', name: 'long trapezoid' },
        { poly: [[0, 0], [1.5, 0], [2.5, 1], [2, 1], [2, 2]], color: '#ff6b6b', name: 'pentagon' }
      ]
    },
    // Archimedes' Stomachion on a 12 × 12 grid (areas 3, 3, 6, 6, 6, 6, 9, 12, 12, 12, 12, 12, 21, 24)
    stomachion: {
      name: 'Stomachion', rot: 90,
      pieces: [
        [[0, 0], [6, 0], [4, 4]], [[0, 0], [2, 2], [0, 12]], [[6, 0], [12, 0], [12, 4], [9, 6]], [[6, 0], [9, 6], [8, 8], [6, 6]],
        [[6, 0], [6, 6], [4, 4]], [[12, 4], [12, 6], [9, 6]], [[12, 6], [12, 12], [9, 6]], [[12, 12], [8, 8], [9, 6]],
        [[12, 12], [6, 12], [8, 8]], [[6, 12], [6, 6], [8, 8]], [[6, 12], [3, 12], [3, 6], [4, 4], [6, 6]], [[3, 12], [2, 8], [3, 6]],
        [[3, 12], [0, 12], [2, 8]], [[0, 12], [2, 2], [4, 4]]
      ].map((poly, i) => ({ poly, color: COLORS[i % COLORS.length], name: 'piece ' + String.fromCharCode(65 + i) }))
    },
    egg: { name: 'Egg of Columbus', rot: 45, pieces: eggPieces() }
  };

  function setOf(d) {
    if (d.pieces) return { name: d.setName || 'pieces', rot: d.rot || 45, pieces: d.pieces.map((q, i) => Array.isArray(q) ? { poly: q, color: COLORS[i % COLORS.length], name: 'piece ' + (i + 1) } : Object.assign({ color: COLORS[i % COLORS.length], name: 'piece ' + (i + 1) }, q)) };
    return SETS[d.set];
  }

  function placed(set, pl) { return G.placePoly(set.pieces[pl[0]].poly, { x: pl[1], y: pl[2], rot: pl[3], flip: !!pl[4] }); }
  function silhouetteOf(p) {
    const d = p.data;
    if (d.kind === 'cut') return d.target;
    const set = setOf(d);
    return d.sol.map((pl) => placed(set, pl));
  }

  // corners on the outline of a union of polygons (a piece may snap there without giving the inside away)
  function outlinePoints(polys) {
    const pts = [], seen = new Set();
    const sc = Math.sqrt(unionArea(polys)) || 1;
    const r = sc * 0.012;
    const inside = (q) => polys.some((pl) => G.pointInPoly(q, pl));
    polys.forEach((pl) => pl.forEach((v) => {
      const k = Math.round(v[0] * 1000) + ',' + Math.round(v[1] * 1000);
      if (seen.has(k)) return;
      seen.add(k);
      for (let a = 0; a < 12; a++) {
        const q = [v[0] + Math.cos(a * Math.PI / 6 + 0.13) * r, v[1] + Math.sin(a * Math.PI / 6 + 0.13) * r];
        if (!inside(q)) { pts.push(v); return; }
      }
    }));
    return pts;
  }

  // polar second moment about the centroid (a cheap, turn-proof fingerprint of an arrangement)
  function polarMoment(polys) {
    let A = 0, cx = 0, cy = 0, J = 0;
    polys.forEach((pl) => {
      const s = G.area(pl) < 0 ? -1 : 1;
      for (let i = 0, n = pl.length; i < n; i++) {
        const p = pl[i], q = pl[(i + 1) % n], k = (p[0] * q[1] - q[0] * p[1]) * s;
        A += k / 2;
        cx += (p[0] + q[0]) * k / 6; cy += (p[1] + q[1]) * k / 6;
        J += k * (p[0] * p[0] + p[0] * q[0] + q[0] * q[0] + p[1] * p[1] + p[1] * q[1] + q[1] * q[1]) / 12;
      }
    });
    if (!A) return 0;
    cx /= A; cy /= A;
    return J - A * (cx * cx + cy * cy);
  }

  /* ======================================================================
   * Knife snap points (source frame of one piece)
   * ==================================================================== */

  function fractionsOf(d) { return d.quarters ? [0.25, 1 / 3, 0.5, 2 / 3, 0.75] : [1 / 3, 0.5, 2 / 3]; }

  // every point a knife may snap to on or in one piece, in the piece's source coordinates
  function snapPointsSrc(d, orig) {
    const pts = [];
    orig.forEach((p, i) => {
      const q = orig[(i + 1) % orig.length];
      pts.push(p);
      fractionsOf(d).forEach((f) => pts.push(G.lerp(p, q, f)));
    });
    const sc = scaleOf(orig), tol = sc * 1e-6;
    if (d.grid) {
      const b = G.bbox([orig]), g = d.grid;
      for (let x = Math.ceil(b.x0 / g - 1e-9) * g; x <= b.x1 + 1e-9; x += g) {
        for (let y = Math.ceil(b.y0 / g - 1e-9) * g; y <= b.y1 + 1e-9; y += g) {
          const q = [Math.round(x / g) * g, Math.round(y / g) * g];
          if (G.pointInPoly(q, orig) || onBoundary(q, orig, tol)) pts.push(q);
        }
      }
    }
    (d.snaps || []).forEach((q) => { if (G.pointInPoly(q, orig) || onBoundary(q, orig, tol)) pts.push(q); });
    return pts;
  }

  // replay the stored cuts on the starting shape (source coordinates)
  function replayCuts(d, strict) {
    let polys = d.shape.map((pl) => pl.map((p) => p.slice()));
    for (let k = 0; k < d.sol.cuts.length; k++) {
      const path = d.sol.cuts[k];
      if (!path || path.length < 2) return { err: 'cut ' + (k + 1) + ' has fewer than two points' };
      if (strict) {
        const cands = [];
        polys.forEach((pl) => snapPointsSrc(d, pl).forEach((q) => cands.push(q)));
        for (let i = 0; i < path.length; i++) {
          const v = path[i];
          const sc = scaleOf(d.shape[0]);
          if (!cands.some((q) => G.dist(q, v) < sc * 1e-6)) return { err: 'cut ' + (k + 1) + ' point ' + (i + 1) + ' (' + v.map((x) => +x.toFixed(4)).join(', ') + ') is not a snap point' };
        }
      }
      const r = cutAll(polys, path);
      if (!r.made) return { err: 'cut ' + (k + 1) + ' cuts nothing' };
      polys = r.polys;
    }
    return { polys };
  }

  // the solution pieces: [{ src, pl (placement), fin (target coordinates) }]
  function solutionPieces(d) {
    const r = replayCuts(d, false);
    if (r.err) return { err: r.err };
    const used = new Set();
    const out = [];
    for (const poly of r.polys) {
      const ks = [];
      d.sol.place.forEach((pl, k) => { if (G.pointInPoly([pl[0], pl[1]], poly)) ks.push(k); });
      if (ks.length !== 1) return { err: 'a piece holds ' + ks.length + ' anchors (' + G.centroid(poly).map((x) => x.toFixed(3)).join(', ') + ')' };
      if (used.has(ks[0])) return { err: 'anchor used twice' };
      used.add(ks[0]);
      const pl = d.sol.place[ks[0]];
      const t = { x: pl[2], y: pl[3], rot: pl[4] || 0, flip: !!pl[5] };
      out.push({ src: poly, t, k: ks[0], fin: G.placePoly(poly, t) });
    }
    if (used.size !== d.sol.place.length) return { err: 'an anchor lies in no piece' };
    return { pieces: out };
  }

  function stepOk(rot, step) {
    if (!step) return true;
    const k = G.normDeg(rot) / step;
    return Math.abs(k - Math.round(k)) < 1e-6;
  }

  function connected(polys) {
    const box = G.bbox(polys);
    const W = 160, H = Math.max(8, Math.round(W * box.h / Math.max(box.w, 1e-9)));
    const pad = { x0: box.x0 - box.w * 0.02, y0: box.y0 - box.h * 0.02, w: box.w * 1.04, h: box.h * 1.04 };
    const m = G.raster(polys, pad, W, H);
    // pieces that only touch at a corner count as joined: close tiny cracks first
    const g = new Uint8Array(W * H);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      let on = 0;
      for (let dy = -1; dy <= 1 && !on; dy++) for (let dx = -1; dx <= 1 && !on; dx++) {
        const X = x + dx, Y = y + dy;
        if (X >= 0 && Y >= 0 && X < W && Y < H && m[Y * W + X]) on = 1;
      }
      g[y * W + x] = on;
    }
    let comps = 0;
    const seen = new Uint8Array(W * H);
    for (let i = 0; i < g.length; i++) {
      if (!g[i] || seen[i]) continue;
      comps++;
      const st = [i];
      seen[i] = 1;
      while (st.length) {
        const j = st.pop(), x = j % W, y = (j - x) / W;
        [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => {
          const X = x + dx, Y = y + dy;
          if (X < 0 || Y < 0 || X >= W || Y >= H) return;
          const k = Y * W + X;
          if (g[k] && !seen[k]) { seen[k] = 1; st.push(k); }
        });
      }
    }
    return comps;
  }

  function verifyCut(p) {
    const d = p.data;
    if (!d.shape || !d.shape.length || !d.target || !d.target.length || !d.sol) return { ok: false, err: 'shape, target and sol are needed' };
    const r = replayCuts(d, true);
    if (r.err) return { ok: false, err: r.err };
    if (d.maxCuts != null && d.sol.cuts.length > d.maxCuts) return { ok: false, err: d.sol.cuts.length + ' cuts, but only ' + d.maxCuts + ' allowed' };
    if (d.maxPieces != null && r.polys.length > d.maxPieces) return { ok: false, err: r.polys.length + ' pieces, but only ' + d.maxPieces + ' allowed' };
    if (d.maxCuts == null && d.maxPieces == null) return { ok: false, err: 'no limit on cuts or pieces' };
    const sp = solutionPieces(d);
    if (sp.err) return { ok: false, err: sp.err };
    const step = d.rot == null ? 45 : d.rot;
    for (const s of sp.pieces) {
      if (!stepOk(s.t.rot, step)) return { ok: false, err: 'a piece turns by ' + s.t.rot + '°, not a multiple of ' + step + '°' };
      if (s.t.flip && d.noFlip) return { ok: false, err: 'a piece is turned over but noFlip is set' };
    }
    const fin = sp.pieces.map((s) => s.fin);
    const a0 = unionArea(d.shape), a1 = unionArea(d.target), a2 = unionArea(fin);
    if (Math.abs(a0 - a1) > a1 * 1e-6 || Math.abs(a2 - a1) > a1 * 1e-6) return { ok: false, err: 'areas differ: ' + a0 + ' / ' + a1 + ' / ' + a2 };
    const over = G.overlapArea(fin, 300);
    if (over > a1 * 0.003) return { ok: false, err: 'placed pieces overlap (' + over.toFixed(4) + ')' };
    const cmp = G.compareShapes(fin, d.target, { res: 300 });
    if (cmp.iou < 0.985) return { ok: false, err: 'the placed pieces do not make the target (IoU ' + cmp.iou.toFixed(4) + ')' };
    const start = matchShape(d.shape, d.target, { res: 160 });
    if (start.iou > 0.95) return { ok: false, err: 'the shape is already the target' };
    return { ok: true };
  }

  function verifyPieces(p) {
    const d = p.data;
    const set = setOf(d);
    if (!set) return { ok: false, err: 'unknown set ' + d.set };
    if (!d.sol || d.sol.length !== set.pieces.length) return { ok: false, err: 'the solution must place every piece once' };
    const seen = new Set();
    for (const pl of d.sol) {
      if (!set.pieces[pl[0]] || seen.has(pl[0])) return { ok: false, err: 'bad or repeated piece ' + pl[0] };
      seen.add(pl[0]);
      if (!stepOk(pl[3] || 0, d.rot || set.rot)) return { ok: false, err: 'piece ' + pl[0] + ' turns by ' + pl[3] + '°' };
    }
    (d.given || []).forEach((i) => { if (!set.pieces[i]) seen.add('bad'); });
    if (seen.has('bad')) return { ok: false, err: 'bad given piece' };
    if (d.given && d.given.length >= set.pieces.length) return { ok: false, err: 'every piece is given' };
    const polys = d.sol.map((pl) => placed(set, pl));
    const total = unionArea(polys);
    const over = G.overlapArea(polys, 320);
    if (over > total * 0.003) return { ok: false, err: 'pieces overlap (' + over.toFixed(4) + ')' };
    if (connected(polys) !== 1) return { ok: false, err: 'the silhouette falls apart' };
    return { ok: true };
  }

  /* ======================================================================
   * Shared stage bits
   * ==================================================================== */

  // the piece drawing: its outline, faint grid lines (cut puzzles on squared paper) and pencil marks
  function registerType(wb, d, ctx) {
    let clipN = 0;
    wb.type('dsp', {
      poly(o) { return o.shape.poly; },
      draw(g, o) {
        const lp = o.shape.poly;
        const dPath = C.pathOf(lp);
        ctx.s('path', { class: 'wb-shape ds-body', d: dPath, fill: o.fill || '#8f9bff' }, g);
        const orig = o.data.orig, c = o.data.c;
        if (orig && c) {
          const step = d.lines != null ? d.lines : d.grid;
          if (step && d.kind === 'cut') {
            const id = 'dsc-' + wb.id + '-' + o.id + '-' + (++clipN);
            const defs = ctx.s('defs', null, g);
            ctx.s('path', { d: dPath }, ctx.s('clipPath', { id }, defs));
            const b = G.bbox([orig]);
            let s = '';
            for (let x = Math.ceil(b.x0 / step - 1e-9) * step; x < b.x1 - 1e-9; x += step) if (x > b.x0 + 1e-9) s += 'M' + C.fmtNum(x - c[0]) + ' ' + C.fmtNum(b.y0 - c[1]) + 'V' + C.fmtNum(b.y1 - c[1]);
            for (let y = Math.ceil(b.y0 / step - 1e-9) * step; y < b.y1 - 1e-9; y += step) if (y > b.y0 + 1e-9) s += 'M' + C.fmtNum(b.x0 - c[0]) + ' ' + C.fmtNum(y - c[1]) + 'H' + C.fmtNum(b.x1 - c[0]);
            if (s) ctx.s('path', { class: 'ds-grid', d: s, 'clip-path': 'url(#' + id + ')' }, g);
          }
          if (d.snaps && d.snaps.length) {
            const sc = scaleOf(d.shape ? d.shape[0] : orig), r = sc * 0.012, tol = sc * 1e-6;
            let s = '';
            d.snaps.forEach((q) => {
              if (!(G.pointInPoly(q, orig) || onBoundary(q, orig, tol))) return;
              const x = q[0] - c[0], y = q[1] - c[1];
              s += 'M' + C.fmtNum(x - r) + ' ' + C.fmtNum(y - r) + 'L' + C.fmtNum(x + r) + ' ' + C.fmtNum(y + r) + 'M' + C.fmtNum(x - r) + ' ' + C.fmtNum(y + r) + 'L' + C.fmtNum(x + r) + ' ' + C.fmtNum(y - r);
            });
            if (s) ctx.s('path', { class: 'ds-mark', d: s }, g);
          }
        }
        ctx.s('path', { class: 'ds-edge', d: dPath }, g);
      }
    });
  }

  function glide(ctx, moves, ms, done) {
    // moves: [{ o, x, y, rot, flip }] — turn over first, then slide and turn home
    const wb = ctx.wb;
    moves.forEach((m) => {
      if (!!m.o.flip !== !!m.flip) { m.o.flip = !!m.flip; m.o.rot = G.normDeg(-(m.o.rot || 0)); wb.renderObj(m.o); }
    });
    const from = moves.map((m) => ({ x: m.o.x, y: m.o.y, rot: m.o.rot || 0 }));
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / Math.max(1, ms)), e = 0.5 - Math.cos(k * Math.PI) / 2;
      moves.forEach((m, i) => {
        let dr = G.normDeg(m.rot - from[i].rot); if (dr > 180) dr -= 360;
        wb.update(m.o, { x: from[i].x + (m.x - from[i].x) * e, y: from[i].y + (m.y - from[i].y) * e, rot: k < 1 ? from[i].rot + dr * e : G.normDeg(m.rot) });
      });
      if (k < 1) requestAnimationFrame(step);
      else done();
    };
    requestAnimationFrame(step);
  }

  const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const NUMW = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen'];
  const numw = (n) => NUMW[n] || String(n);

  function checkArrangement(U, T, d) {
    const total = unionArea(U), want = unionArea(T);
    if (Math.abs(total - want) > want * 0.01) return { solved: false, msg: 'Some of the pieces are missing.' };
    const over = G.overlapArea(U, 200);
    if (over > total * 0.012) return { solved: false, msg: 'Two pieces overlap.' };
    const ju = polarMoment(U), jt = polarMoment(T);
    if (Math.abs(ju - jt) > jt * 0.05) {
      // far from any arrangement of the goal: skip the search, but say how close
      return { solved: false, msg: ju > jt ? 'The pieces are not together yet.' : 'Not that shape.' };
    }
    const r = matchShape(U, T, { any: d.any !== false, mirror: !d.noFlip });
    if (r.iou >= 0.955 && r.missing < 0.035) return { solved: true, r };
    return { solved: false, msg: r.iou > 0.85 ? 'Nearly: ' + Math.round((1 - r.iou) * 100) + '% out of place.' : 'The pieces do not make the shape yet.' };
  }

  /* ======================================================================
   * Endless: a shape cut at random along lattice lines, to be put together
   * ==================================================================== */

  const BASES = [
    { name: 'square', a: 'a square', poly: (s) => [[0, 0], [s, 0], [s, s], [0, s]] },
    { name: 'rectangle', a: 'a rectangle', poly: (s) => [[0, 0], [s + 2, 0], [s + 2, s - 1], [0, s - 1]] },
    { name: 'octagon', a: 'an octagon', poly: (s) => { const c = Math.max(1, Math.round(s / 4)); return [[c, 0], [s - c, 0], [s, c], [s, s - c], [s - c, s], [c, s], [0, s - c], [0, c]]; } },
    { name: 'hexagon', a: 'a long hexagon', poly: (s) => { const h = Math.max(2, s - 2 + (s % 2)), k = h / 2; return [[k, 0], [s + 2 - k, 0], [s + 2, k], [s + 2 - k, h], [k, h], [0, k]]; } },
    { name: 'house', a: 'a house', poly: (s) => { const k = Math.floor(s / 2); return [[0, k], [k, 0], [2 * k, k], [2 * k, k + s - 1], [0, k + s - 1]]; } },
    { name: 'cross', a: 'a Greek cross', poly: (s) => { const t = Math.max(1, Math.floor(s / 3)), w = 3 * t; return [[t, 0], [2 * t, 0], [2 * t, t], [w, t], [w, 2 * t], [2 * t, 2 * t], [2 * t, w], [t, w], [t, 2 * t], [0, 2 * t], [0, t], [t, t]]; } },
    { name: 'parallelogram', a: 'a parallelogram', poly: (s) => [[0, s - 1], [s, s - 1], [s + s - 1, 0], [s - 1, 0]] }
  ];

  function randomDissection(rng, level) {
    const n = [0, 3, 4, 5, 6, 7][level] || 4;
    const size = level <= 2 ? 4 : 6;
    const dirs = [[1, 0], [0, 1], [1, 1], [1, -1]].concat(level >= 3 ? [[2, 1], [1, 2], [2, -1], [1, -2]] : []).concat(level >= 5 ? [[3, 1], [1, 3]] : []);
    const bases = level <= 1 ? BASES.slice(0, 3) : level <= 3 ? BASES.slice(0, 6) : BASES;
    const base = rng.pick(bases);
    const shape = base.poly(size);
    const area = G.absArea(shape);
    const minA = Math.max(1, area / (n * 2.4));
    let polys = [shape];
    for (let tries = 0; tries < 400 && polys.length < n; tries++) {
      const weights = polys.map((q) => G.absArea(q));
      let r = rng() * weights.reduce((s, w) => s + w, 0), k = 0;
      while (r > weights[k] && k < weights.length - 1) { r -= weights[k]; k++; }
      const pc = polys[k], b = G.bbox([pc]);
      const pt = [Math.round(b.x0 + rng() * b.w), Math.round(b.y0 + rng() * b.h)];
      if (!insideStrict(pt, pc, 1e-6) && !onBoundary(pt, pc, 1e-6)) continue;
      const dv = rng.pick(dirs);
      const L = (b.w + b.h) * 2;
      const u = G.norm(dv);
      const cut = cutPoly(pc, [G.sub(pt, G.mul(u, L)), G.add(pt, G.mul(u, L))]);
      if (!cut || polys.length - 1 + cut.length > n) continue;
      if (cut.some((q) => G.absArea(q) < minA - 1e-9)) continue;
      // no slivers: every piece at least a little thick
      if (cut.some((q) => { const bb = G.bbox([q]); return Math.min(bb.w, bb.h) < 0.99; })) continue;
      if (cut.some((q) => { let per = 0; q.forEach((a, i) => { per += G.dist(a, q[(i + 1) % q.length]); }); return 4 * Math.PI * G.absArea(q) / (per * per) < 0.3; })) continue;
      polys.splice(k, 1, ...cut);
    }
    if (polys.length !== n) return null;
    // tidy coordinates (lattice cuts meet at lattice or half points)
    polys = polys.map((q) => G.clean(q.map((p) => [Math.round(p[0] * 1e6) / 1e6, Math.round(p[1] * 1e6) / 1e6]), 1e-9));
    return { base, polys };
  }

  function generatePieces(rng, level) {
    const r = randomDissection(rng, level);
    if (!r) return null;
    const n = r.polys.length;
    const cols = rng.shuffle(COLORS.slice());
    return {
      title: cap(r.base.name) + ' in ' + cap(numw(n)) + ' Pieces',
      text: 'Someone has cut ' + r.base.a + ' into ' + numw(n) + ' pieces along straight lines. Put it back together.',
      goal: 'Cover the silhouette with all ' + numw(n) + ' pieces.',
      diff: level,
      data: { kind: 'pieces', setName: r.base.name, rot: 45, pieces: r.polys.map((poly, i) => ({ poly, color: cols[i % cols.length], name: 'piece ' + (i + 1) })), sol: r.polys.map((q, i) => [i, 0, 0, 0, 0]) }
    };
  }

  /* ======================================================================
   * The engine
   * ==================================================================== */

  C.engine({
    id: 'dissect',
    name: 'Dissections',
    tools: ['select', 'pan', 'paint', 'pen', 'marker', 'eraser', 'note', 'xray', 'loupe'],
    workbench: { vertexSnap: true, rotStep: 45, snapPx: 13 },
    about: '**Cutting puzzles:** take the **knife** (C) and drag it across a piece, from edge to edge. The knife snaps to corners, to the middle and the thirds of every edge and to pencil marks — the gold dots show where, as you come near. To make a **bent** cut, let go inside the piece and carry on: each click (or drag) adds a corner, and the cut is made when it reaches an edge again; Esc drops it. Shift keeps a stroke to 15° steps. Mind the limit on cuts.\n\n' +
      '**Then** switch to the hand (V) and move the pieces: drag to move (corners snap together), turn with the round handle or **R** / Shift+R, turn over with **X**. Make the goal shape anywhere on the table and any way round.\n\n' +
      '**Piece puzzles:** cover the dark silhouette with all the pieces from the tray, without overlaps — on the silhouette or beside it.',
    noMoves: true,
    generates: ['piece-sets'],

    // endless: a shape cut at random into 3 (Easy) to 7 (Fiendish) pieces, turned and shuffled in the tray
    generate(rng, level) { return generatePieces(rng, level); },

    verify(p) {
      const d = p.data;
      if (!d) return { ok: false, err: 'no data' };
      if (d.kind === 'cut') return verifyCut(p);
      if (d.kind === 'pieces') return verifyPieces(p);
      return { ok: false, err: 'unknown kind ' + d.kind };
    },

    mount(ctx, p) {
      registerType(ctx.wb, p.data, ctx);
      return p.data.kind === 'cut' ? mountCut(ctx, p) : mountPieces(ctx, p);
    },

    thumb(p) {
      const d = p.data;
      const polysPath = (polys, attrs) => '<g ' + attrs + '>' + polys.map((pl) => '<path d="' + C.pathOf(pl) + '"/>').join('') + '</g>';
      if (d.kind !== 'cut') {
        const polys = silhouetteOf(p);
        const b = G.bbox(polys), pad = Math.max(b.w, b.h) * 0.08;
        return '<svg viewBox="' + [b.x0 - pad, b.y0 - pad, b.w + 2 * pad, b.h + 2 * pad].map(C.fmtNum).join(' ') + '" preserveAspectRatio="xMidYMid meet">' +
          polysPath(polys, 'fill="var(--ink-2)" stroke="var(--ink-2)" stroke-width="' + C.fmtNum(Math.max(b.w, b.h) * 0.01) + '" stroke-linejoin="round"') + '</svg>';
      }
      const sb = G.bbox(d.shape), tb = G.bbox(d.target);
      const size = Math.max(sb.w, sb.h, tb.w, tb.h);
      const gap = size * 0.55;
      const dx = sb.x1 + gap - tb.x0, dy = sb.cy - tb.cy;
      const T = d.target.map((pl) => pl.map((q) => [q[0] + dx, q[1] + dy]));
      const all = G.bbox(d.shape.concat(T)), pad = size * 0.1;
      const sw = size * 0.022;
      const ax = sb.x1 + gap * 0.18, bx = sb.x1 + gap * 0.82, ay = sb.cy;
      return '<svg viewBox="' + [all.x0 - pad, all.y0 - pad, all.w + 2 * pad, all.h + 2 * pad].map(C.fmtNum).join(' ') + '" preserveAspectRatio="xMidYMid meet">' +
        polysPath(d.shape, 'fill="var(--ink-2)" stroke="var(--ink-2)" stroke-width="' + C.fmtNum(sw * 0.5) + '" stroke-linejoin="round"') +
        '<path d="M' + C.fmtNum(ax) + ' ' + C.fmtNum(ay) + 'H' + C.fmtNum(bx) + 'M' + C.fmtNum(bx - gap * 0.16) + ' ' + C.fmtNum(ay - gap * 0.14) + 'L' + C.fmtNum(bx) + ' ' + C.fmtNum(ay) + 'L' + C.fmtNum(bx - gap * 0.16) + ' ' + C.fmtNum(ay + gap * 0.14) + '" fill="none" stroke="var(--gold)" stroke-width="' + C.fmtNum(sw) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
        polysPath(T, 'fill="none" stroke="var(--ink-2)" stroke-width="' + C.fmtNum(sw) + '" stroke-dasharray="' + C.fmtNum(sw * 2.2) + ' ' + C.fmtNum(sw * 1.6) + '" stroke-linejoin="round"') + '</svg>';
    }
  });

  /* ======================================================================
   * Cut and rearrange
   * ==================================================================== */

  function mountCut(ctx, p) {
    const wb = ctx.wb, d = p.data;
    const step = d.rot == null ? 45 : d.rot;
    const sb = G.bbox(d.shape), tb = G.bbox(d.target);
    const size = Math.max(sb.w, sb.h, tb.w, tb.h);
    const narrow = wb.size().w < 600;
    const gap = size * 0.4;
    const offT = narrow ? [sb.cx - tb.cx, sb.y1 + gap - tb.y0] : [sb.x1 + gap - tb.x0, sb.cy - tb.cy];
    const T = d.target.map((pl) => pl.map((q) => [q[0] + offT[0], q[1] + offT[1]]));
    const Tb = G.bbox(T);
    const named = d.show === 'name';
    const sol = solutionPieces(d);
    const nSol = sol.pieces ? sol.pieces.length : 0;
    let dead = false, busy = false, cuts = 0, pend = null, press = null, cache = null, hintT = 0, pieceN = d.shape.length;

    const all = G.bbox(d.shape.concat(T));
    const mg = size * 0.3;
    wb.setBounds({ x0: all.x0 - mg, y0: all.y0 - mg, x1: all.x1 + mg, y1: all.y1 + mg }, 0.04);

    const bg = wb.layer('bg'), top = wb.layer('top');
    const silG = ctx.s('g', { class: 'ds-sil' + (named ? ' ghost' : '') }, bg);
    let showGoal = !named;
    function drawGoal() {
      silG.innerHTML = '';
      if (showGoal) T.forEach((pl) => ctx.s('path', { d: C.pathOf(pl) }, silG));
      else if (d.goalName) {
        const lines = ['make ' + d.goalName, 'here — or anywhere'];
        const chars = Math.max(...lines.map((l) => l.length));
        const fs = Math.min(size * 0.08, Math.max(Tb.w, size * 0.6) * 1.8 / chars);
        lines.forEach((l, i) => {
          const t = ctx.s('text', { x: Tb.cx, y: Tb.cy + (i - 0.5) * fs * 1.35, class: 'ds-goaltext' + (i ? ' small' : ''), 'text-anchor': 'middle', 'dominant-baseline': 'central', 'font-size': C.fmtNum(i ? fs * 0.8 : fs) }, silG);
          t.textContent = l;
        });
      }
    }
    drawGoal();
    const hintG = ctx.s('g', { class: 'ds-hint' }, top);
    const flashG = ctx.s('g', { class: 'ds-flash' }, top);
    const liveG = ctx.s('g', { class: 'ds-live' }, top);

    const color = (i) => (d.colors && d.colors[i]) || COLORS[i % COLORS.length];
    function addSource() {
      d.shape.forEach((poly, i) => {
        const c = G.centroid(poly);
        wb.add({
          id: 'sh' + i, type: 'dsp', kind: 'piece',
          name: (d.names && d.names[i]) || (d.shape.length > 1 ? 'Shape ' + (i + 1) : 'The shape'),
          shape: { poly: poly.map((q) => [q[0] - c[0], q[1] - c[1]]) }, x: c[0], y: c[1], rot: 0, flip: false,
          fill: color(i), rotate: step || true, flipable: !d.noFlip, snap: true,
          data: { orig: poly.map((q) => q.slice()), c }
        });
      });
    }
    addSource();
    const pieces = () => wb.all().filter((o) => o.data && o.data.orig);
    wb.handlers.snapTargets = () => (showGoal ? outlinePoints(T) : []);

    function showStats() {
      ctx.stat('Cuts', cuts + (d.maxCuts != null ? ' of ' + d.maxCuts : ''));
      const n = pieces().length;
      ctx.stat('Pieces', n + (d.maxPieces != null ? ' of ' + d.maxPieces : ''));
    }
    const cutsLeft = () => (d.maxCuts == null ? Infinity : d.maxCuts - cuts);
    const piecesLeft = () => (d.maxPieces == null ? Infinity : d.maxPieces - pieces().length);

    /* ----- the knife ----- */
    function candidates() {
      if (cache) return cache;
      const pts = [];
      pieces().forEach((o) => {
        if (o.visible === false) return;
        snapPointsSrc(d, o.data.orig).forEach((q) => pts.push(G.place(G.sub(q, o.data.c), o)));
      });
      cache = pts;
      return pts;
    }
    wb.on('change', () => { cache = null; });
    wb.on('restore', () => { cache = null; pend = null; press = null; liveG.innerHTML = ''; showStats(); });

    function projSeg(pt, a, b) {
      const ab = G.sub(b, a), l2 = G.dot(ab, ab);
      const t = l2 ? Math.max(0, Math.min(1, G.dot(G.sub(pt, a), ab) / l2)) : 0;
      return G.lerp(a, b, t);
    }
    function snapPt(pt, from, shift) {
      if (shift && from) {
        const L = G.dist(from, pt), a = G.snapDeg(G.angle(G.sub(pt, from)), 15) * Math.PI / 180;
        return { p: [from[0] + Math.cos(a) * L, from[1] + Math.sin(a) * L], snapped: false };
      }
      let best = null, bd = wb.px(14);
      for (const q of candidates()) { const dd = G.dist(pt, q); if (dd < bd) { bd = dd; best = q; } }
      if (best) return { p: best.slice(), snapped: true };
      let eb = null, ed = wb.px(7);
      pieces().forEach((o) => {
        const w = wb.worldPoly(o);
        w.forEach((a, i) => { const pr = projSeg(pt, a, w[(i + 1) % w.length]); const dd = G.dist(pt, pr); if (dd < ed) { ed = dd; eb = pr; } });
      });
      if (eb) return { p: eb, snapped: false, edge: true };
      return { p: pt.slice(), snapped: false };
    }

    function drawLive(cursor, s) {
      liveG.innerHTML = '';
      if (dead) return;
      const px = wb.px(1);
      if (cursor && wb.mode === 'knife') {
        const R = px * 80;
        candidates().forEach((q) => {
          const dd = G.dist(q, cursor);
          if (dd > R) return;
          ctx.s('circle', { cx: C.fmtNum(q[0]), cy: C.fmtNum(q[1]), r: C.fmtNum(px * 2.8), class: 'ds-dot', opacity: (0.2 + 0.8 * (1 - dd / R)).toFixed(2) }, liveG);
        });
      }
      const path = pend ? pend.map((q) => q.slice()) : [];
      if (press && !pend && press.moved) path.push(press.a);
      if (s && path.length) path.push(s.p);
      if (path.length >= 2) {
        ctx.s('path', { d: C.pathOf(path, false), class: 'ds-knife', 'stroke-width': 2 * px, 'stroke-dasharray': (7 * px) + ' ' + (5 * px) }, liveG);
        let n = 0;
        pieces().forEach((o) => {
          const runs = runsOf(wb.worldPoly(o), path);
          if (runs.length) n += runs.length;
          runs.forEach((r) => ctx.s('path', { d: C.pathOf(r, false), class: 'ds-knife-cut', 'stroke-width': 3.2 * px }, liveG));
        });
        const e = path[path.length - 1];
        if (n) {
          const t = ctx.s('text', { x: e[0] + 10 * px, y: e[1] - 10 * px, class: 'ds-knife-n', 'font-size': 13 * px }, liveG);
          t.textContent = '+' + n + (n === 1 ? ' piece' : ' pieces');
        }
      }
      path.forEach((q, i) => { if (!s || i < path.length - 1 || !press) ctx.s('circle', { cx: q[0], cy: q[1], r: 3.4 * px, class: 'ds-knife-pt' }, liveG); });
      if (s && s.snapped) ctx.s('circle', { cx: s.p[0], cy: s.p[1], r: 7.5 * px, class: 'ds-snapring', 'stroke-width': 2 * px }, liveG);
    }

    // a stroke that stops just short of an edge (or starts just inside one) reaches it
    function extendEnds(path) {
      const reach = wb.px(10);
      const fix = (pa, pb) => { // extend from pb through pa to the nearest boundary within reach
        let hit = null, hd = Infinity;
        pieces().forEach((o) => {
          const w = wb.worldPoly(o);
          if (!insideStrict(pa, w, wb.px(0.3))) return;
          const dir = G.norm(G.sub(pa, pb));
          const far = G.add(pa, G.mul(dir, reach));
          w.forEach((a, i) => {
            const x = G.segCross(pa, far, a, w[(i + 1) % w.length]);
            if (x && x.t * reach < hd) { hd = x.t * reach; hit = x.pt; }
          });
        });
        return hit;
      };
      const n = path.length;
      const e = fix(path[n - 1], path[n - 2]);
      if (e) path[n - 1] = e;
      const s = fix(path[0], path[1]);
      if (s) path[0] = s;
      return path;
    }

    function addLeg(b) {
      const last = pend[pend.length - 1];
      if (G.dist(b, last) < wb.px(3)) { drawLive(b, null); return; }
      pend.push(b.slice());
      const inPiece = pieces().map((o) => wb.worldPoly(o)).find((w) => insideStrict(b, w, wb.px(0.3)));
      const nearEdge = inPiece && inPiece.some((a, i) => G.segDist(b, a, inPiece[(i + 1) % inPiece.length]) < wb.px(10));
      if (inPiece && !nearEdge && pend.length < 24) {
        ctx.say('The cut bends here. Click (or drag) to the next corner and finish on an edge — **Esc** lets go.', 'info');
        drawLive(b, null);
        return;
      }
      const path = extendEnds(pend);
      pend = null;
      drawLive(null, null);
      doCut(path, false);
    }

    function refuse(msg, path) {
      ctx.sfx('wrong');
      ctx.toast(msg);
      ctx.say(msg, 'warn');
      if (path) flash(path, 'ds-flash-bad');
    }

    function flash(path, cls) {
      const el = ctx.s('path', { d: C.pathOf(path, false), class: cls || 'ds-flashline' }, flashG);
      setTimeout(() => el.remove(), C.anim(900) + 50);
    }

    function doCut(path, auto) {
      if (!auto && cutsLeft() <= 0) { refuse('No cuts left (' + d.maxCuts + ' allowed). Undo (Ctrl+Z) to take one back.', path); return false; }
      const res = [];
      pieces().forEach((o) => {
        if (o.locked || o.visible === false) return;
        const r = cutPoly(wb.worldPoly(o), path);
        if (r) res.push({ o, r });
      });
      if (!res.length) {
        if (!auto) refuse(path.length > 2 ? 'That cut does not run from edge to edge of a piece, so nothing was cut.' : 'The knife met nothing to cut: stroke across a piece, from edge to edge.');
        return false;
      }
      const after = pieces().length + res.reduce((s, x) => s + x.r.length - 1, 0);
      if (!auto && d.maxPieces != null && after > d.maxPieces) { refuse('That would make ' + after + ' pieces, and only ' + d.maxPieces + ' are allowed.', path); return false; }
      res.forEach((x) => replacePiece(x.o, x.r));
      cuts++;
      cache = null;
      showStats();
      ctx.sfx('cut');
      flash(path);
      if (!auto) {
        const n = pieces().length;
        if (cutsLeft() <= 0 || piecesLeft() <= 0) {
          ctx.say('Cut! ' + cap(numw(n)) + ' pieces — that is all the cutting allowed. Now arrange them (the hand tool, **V**, is ready).', 'good');
          wb.setMode('select');
        } else {
          const left = Math.min(cutsLeft(), piecesLeft() === Infinity ? Infinity : piecesLeft());
          ctx.say('Cut! ' + cap(numw(n)) + ' pieces' + (left < Infinity ? '; ' + (cutsLeft() < Infinity ? C.plural(cutsLeft(), 'cut') + ' left' : piecesLeft() + ' more piece' + (piecesLeft() === 1 ? '' : 's') + ' allowed') : '') + '. Keep cutting, or switch to the hand (**V**) to move pieces.', 'good');
        }
        ctx.changed('cut');
      }
      return true;
    }

    function replacePiece(o, polys) {
      const idx = wb.order.indexOf(o.id);
      const c0 = o.data.c;
      const t = { x: o.x, y: o.y, rot: o.rot || 0, flip: !!o.flip };
      const used = new Set(pieces().filter((q) => q !== o).map((q) => q.fill));
      wb.remove(o);
      polys.forEach((wpoly, i) => {
        const src = wpoly.map((q) => G.round(G.add(G.unplace(q, t), c0), 1e10));
        const c = G.centroid(src);
        const pos = G.place(G.sub(c, c0), t);
        let fill = o.fill;
        if (i > 0 || used.has(fill)) { fill = COLORS.find((col) => !used.has(col)) || COLORS[(pieceN + i) % COLORS.length]; }
        used.add(fill);
        pieceN++;
        const no = wb.add({
          type: 'dsp', kind: 'piece', name: 'Piece ' + pieceN,
          shape: { poly: src.map((q) => [q[0] - c[0], q[1] - c[1]]) }, x: pos[0], y: pos[1], rot: t.rot, flip: t.flip,
          fill, rotate: o.rotate, flipable: o.flipable, snap: true, data: { orig: src, c }
        });
        wb.order = wb.order.filter((id) => id !== no.id);
        wb.order.splice(Math.max(0, Math.min(idx + i, wb.order.length)), 0, no.id);
      });
      wb.restack();
    }

    // a shorter tool bar, so the knife sits near the top where it is easy to find
    wb.opts.tools = ['select', 'pan', 'pen', 'eraser', 'note', 'xray'];
    wb.addMode({
      id: 'knife', icon: 'cut', key: 'C',
      title: 'Knife: drag across a piece to cut it; let go inside it to bend the cut',
      down(pt, ev) {
        if (busy || dead) return false;
        clearHint();
        const from = pend ? pend[pend.length - 1] : null;
        const s = snapPt(pt, from, ev.shiftKey);
        press = { a: from || s.p, p0: pt, moved: false, s };
        drawLive(pt, from ? s : null);
        return true;
      },
      move(pt, ev) {
        if (!press) return;
        if (!press.moved && G.dist(pt, press.p0) > wb.px(5)) press.moved = true;
        const s = snapPt(pt, press.a, ev.shiftKey);
        drawLive(pt, press.moved || pend ? s : null);
      },
      up(pt, ev) {
        const pr = press;
        press = null;
        if (!pr || busy) return;
        const s = pr.moved ? snapPt(pt, pr.a, ev.shiftKey) : pr.s;
        if (!pend) {
          if (!pr.moved) {
            pend = [s.p];
            ctx.say('Knife in. Click (or drag) to the next corner of the cut and finish on an edge — **Esc** lets go.', 'info');
            drawLive(pt, null);
            return;
          }
          pend = [pr.a];
        }
        addLeg(s.p);
      },
      hover(pt, ev) {
        if (busy || dead) return;
        const s = snapPt(pt, pend ? pend[pend.length - 1] : null, ev && ev.shiftKey);
        drawLive(pt, pend || s.snapped ? s : null);
      }
    });
    wb.on('mode', (id) => {
      if (id !== 'knife') { pend = null; press = null; liveG.innerHTML = ''; }
      else ctx.say('Knife: drag across a piece from edge to edge. The gold dots are the places it snaps to.', 'info');
    });

    /* ----- hints ----- */
    function clearHint() { hintG.innerHTML = ''; clearTimeout(hintT); if (named) { showGoal = false; drawGoal(); } }
    function hintLater() { clearTimeout(hintT); hintT = setTimeout(() => { if (!dead) clearHint(); }, 6000); }
    function toWorld(o, q) { return G.place(G.sub(q, o.data.c), o); }

    function analyse() {
      if (!sol.pieces) return null;
      const S = sol.pieces;
      return pieces().map((o) => {
        const u = o.data.orig, au = G.absArea(u), bu = G.bbox([u]);
        const rel = S.map((s) => {
          const bs = G.bbox([s.src]);
          if (bu.x1 <= bs.x0 + 1e-9 || bs.x1 <= bu.x0 + 1e-9 || bu.y1 <= bs.y0 + 1e-9 || bs.y1 <= bu.y0 + 1e-9) return { fu: 0, fs: 0 };
          const r = G.compareShapes([u], [s.src], { res: 110 });
          const as = G.absArea(s.src), inter = (1 - r.missing) * as;
          return { fu: inter / au, fs: inter / as };
        });
        const inOne = rel.findIndex((r) => r.fu > 0.94);
        const whole = [];
        rel.forEach((r, i) => { if (r.fs > 0.94) whole.push(i); });
        const wa = whole.reduce((s, i) => s + G.absArea(S[i].src), 0);
        const union = inOne < 0 && whole.length > 1 && Math.abs(wa - au) < au * 0.05;
        return { o, u, au, rel, inOne, union, bad: inOne < 0 && !union };
      });
    }

    function hint() {
      if (busy || !sol.pieces) return null;
      clearHint();
      const info = analyse();
      const S = sol.pieces;
      if (info.some((x) => x.bad)) {
        return {
          text: 'Your cut is not one of the cuts I know for this puzzle — it may still work, but for a hint go back (Undo) to the whole shape. The dashed line shows where the first cut of the known solution goes.',
          show() {
            d.shape.forEach((pl) => ctx.s('path', { d: C.pathOf(pl), class: 'ds-hintghost' }, hintG));
            ctx.s('path', { d: C.pathOf(d.sol.cuts[0], false), class: 'ds-hintcut' }, hintG);
            hintLater();
          }
        };
      }
      for (let k = 0; k < d.sol.cuts.length; k++) {
        const path = d.sol.cuts[k];
        const hits = info.filter((x) => x.union && runsOf(x.u, path).length);
        if (!hits.length) continue;
        return {
          text: (k === 0 && cuts === 0 ? 'The first cut runs along the dashed line.' : 'Next, cut along the dashed line.') + (d.sol.cuts.length > 1 ? ' (Cut ' + (k + 1) + ' of ' + d.sol.cuts.length + ' in the known solution.)' : '') + (hits.length > 1 ? ' One stroke can go through several pieces if they lie in line.' : ''),
          show() {
            hits.forEach((x) => runsOf(x.u, path).forEach((r) => ctx.s('path', { d: C.pathOf(r.map((q) => toWorld(x.o, q)), false), class: 'ds-hintcut' }, hintG)));
            if (wb.mode !== 'knife') wb.setMode('knife');
            hintLater();
          }
        };
      }
      const cnt = S.map(() => 0);
      info.forEach((x) => { if (x.inOne >= 0) cnt[x.inOne]++; });
      if (cnt.some((c) => c > 1)) return 'You have cut a piece that the known solution keeps whole — undo the last cut (Ctrl+Z).';
      // every piece is one of the solution's: where does one go?
      const want = (x) => S[x.inOne].fin.map((q) => [q[0] + offT[0], q[1] + offT[1]]);
      const todo = info.filter((x) => G.compareShapes([wb.worldPoly(x.o)], [want(x)], { res: 70 }).iou < 0.88);
      if (!todo.length) return 'Every piece is where it belongs — press Check.';
      todo.sort((a, b) => b.au - a.au);
      const x = todo[0], t = S[x.inOne].t;
      const turnOver = !!x.o.flip !== !!t.flip;
      const turn = !turnOver && Math.abs(((G.normDeg((x.o.rot || 0) - t.rot) + 180) % 360) - 180) > 0.5;
      return {
        text: 'The highlighted piece goes where the dashed outline shows' + (turnOver ? ' — turned over (X)' : turn ? ' — turned (R)' : ', just slid across') + '.',
        show() {
          if (named) { showGoal = true; drawGoal(); }
          ctx.s('path', { d: C.pathOf(want(x)), class: 'ds-hintpoly' }, hintG);
          if (x.o.el) { x.o.el.classList.remove('wb-flash'); void x.o.el.getBBox; x.o.el.classList.add('wb-flash'); }
          hintLater();
        }
      };
    }

    /* ----- the solution, acted out ----- */
    function knifeAnim(path, ms, done) {
      const el = ctx.s('path', { class: 'ds-knife-cut', 'stroke-width': wb.px(3.2) }, liveG);
      const lens = [0];
      for (let i = 1; i < path.length; i++) lens.push(lens[i - 1] + G.dist(path[i - 1], path[i]));
      const L = lens[lens.length - 1];
      const t0 = performance.now();
      const stepF = (now) => {
        if (dead) return;
        const k = Math.min(1, (now - t0) / Math.max(1, ms)), want = L * k;
        const pts = [path[0]];
        for (let i = 1; i < path.length; i++) {
          if (lens[i] <= want) pts.push(path[i]);
          else { pts.push(G.lerp(path[i - 1], path[i], (want - lens[i - 1]) / Math.max(1e-9, lens[i] - lens[i - 1]))); break; }
        }
        el.setAttribute('d', C.pathOf(pts, false));
        if (k < 1) requestAnimationFrame(stepF);
        else { el.remove(); done(); }
      };
      requestAnimationFrame(stepF);
    }

    function solve() {
      if (busy || !sol.pieces) return;
      busy = true;
      pend = null; press = null;
      clearHint();
      liveG.innerHTML = '';
      wb.setMode('select');
      pieces().forEach((o) => wb.remove(o));
      addSource();
      cuts = 0; cache = null; pieceN = d.shape.length;
      showStats();
      if (named) { showGoal = true; drawGoal(); }
      let k = 0;
      const home = () => {
        if (dead) return;
        const moves = pieces().map((o) => {
          const s = sol.pieces.find((sp) => G.pointInPoly([d.sol.place[sp.k][0], d.sol.place[sp.k][1]], o.data.orig));
          const pos = G.add(G.place(o.data.c, s.t), offT);
          return { o, x: pos[0], y: pos[1], rot: s.t.rot, flip: s.t.flip };
        });
        glide(ctx, moves, C.anim(1100), () => {
          if (dead) return;
          busy = false;
          if (named) { showGoal = false; drawGoal(); }
          ctx.changed('solve');
        });
      };
      const next = () => {
        if (dead) return;
        if (k >= d.sol.cuts.length) { setTimeout(home, C.anim(300)); return; }
        const path = d.sol.cuts[k++];
        knifeAnim(path, C.anim(520), () => { doCut(path, true); setTimeout(next, C.anim(320)); });
      };
      setTimeout(next, C.anim(250));
    }

    showStats();
    wb.setMode('knife');
    ctx.say('Knife ready (C): drag across the shape from edge to edge. Gold dots show where it snaps.', 'info');

    return {
      check() {
        if (busy) return { solved: false, msg: 'Just a moment…' };
        const U = pieces().map((o) => wb.worldPoly(o));
        const r = checkArrangement(U, T, d);
        if (!r.solved) return r;
        const n = U.length;
        let msg = cap(numw(n)) + ' pieces, ' + C.plural(cuts, 'cut') + '.';
        if (nSol && n < nSol) msg += ' Fewer pieces than the classic answer — splendid!';
        return { solved: true, msg };
      },
      hint,
      solve,
      getState() { return { cuts }; },
      setState(s) { cuts = (s && s.cuts) || 0; pend = null; press = null; cache = null; liveG.innerHTML = ''; hintG.innerHTML = ''; showStats(); },
      reset() { cuts = 0; showStats(); wb.setMode('knife'); },
      key(ev) {
        if (ev.type === 'keydown' && ev.key === 'Escape' && pend) { pend = null; press = null; drawLive(null, null); ctx.say('Knife lifted.', ''); return true; }
        return false;
      },
      destroy() { dead = true; clearTimeout(hintT); wb.handlers.snapTargets = null; }
    };
  }

  /* ======================================================================
   * Given pieces
   * ==================================================================== */

  function mountPieces(ctx, p) {
    const wb = ctx.wb, d = p.data;
    const set = setOf(d);
    const step = d.rot || set.rot || 45;
    const raw = d.sol.map((pl) => placed(set, pl));
    const b0 = G.bbox(raw);
    const off = [-b0.cx, -b0.cy];
    const T = raw.map((pl) => pl.map((q) => [q[0] + off[0], q[1] + off[1]]));
    const tb = G.bbox(T);
    const size = Math.max(tb.w, tb.h);
    let dead = false, busy = false, hintT = 0;

    const bg = wb.layer('bg');
    const silG = ctx.s('g', { class: 'ds-sil' + (d.show === 'outline' ? ' outline' : '') }, bg);
    T.forEach((pl) => ctx.s('path', { d: C.pathOf(pl) }, silG));
    const hintG = ctx.s('g', { class: 'ds-hint' }, wb.layer('top'));
    const outline = outlinePoints(T);
    const slots = d.sol.map((pl, k) => ({ i: pl[0], pl, world: T[k], t: { x: pl[1], y: pl[2], rot: pl[3] || 0, flip: !!pl[4] } }));
    const slotOf = (i) => slots.find((s) => s.i === i);
    const given = new Set(d.given || []);

    // pieces of the same shape can stand in for each other
    const cls = set.pieces.map((pc, i) => i);
    set.pieces.forEach((a, i) => {
      for (let j = 0; j < i; j++) {
        const b = set.pieces[j];
        if (cls[j] === j && a.poly.length === b.poly.length && Math.abs(G.absArea(a.poly) - G.absArea(b.poly)) < 1e-6 && G.pointsCongruent(a.poly, b.poly, { tol: 1e-4 })) { cls[i] = j; break; }
      }
    });

    // the tray: loose pieces beside the silhouette (below it on narrow screens), each turned a little differently
    const narrow = wb.size().w < 600;
    const rng = C.rng(p.id + ':tray');
    const loose = set.pieces.map((pc, i) => i).filter((i) => !given.has(i));
    rng.shuffle(loose);
    const areaAll = unionArea(loose.map((i) => set.pieces[i].poly));
    const trayW = narrow ? Math.max(tb.w, size * 0.9) : Math.max(size * 0.8, Math.sqrt(areaAll) * 1.7);
    const gp = size * 0.07;
    let cx = 0, cy = 0, rowH = 0;
    const place = [];
    loose.forEach((i) => {
      const pc = set.pieces[i];
      const c = G.centroid(pc.poly);
      const local = pc.poly.map((q) => [q[0] - c[0], q[1] - c[1]]);
      const rot = rng.int(Math.round(360 / step)) * step;
      const flip = rng() < 0.5;
      const b = G.bbox([G.placePoly(local, { x: 0, y: 0, rot, flip })]);
      if (cx > 0 && cx + b.w > trayW) { cx = 0; cy += rowH + gp; rowH = 0; }
      place.push({ i, local, c, rot, flip, x: cx - b.x0, y: cy - b.y0 });
      cx += b.w + gp;
      rowH = Math.max(rowH, b.h);
    });
    const trayH = cy + rowH;
    const trayX = narrow ? tb.cx - trayW / 2 : tb.x1 + size * 0.28;
    const trayY = narrow ? tb.y1 + size * 0.25 : tb.cy - trayH / 2;
    ctx.s('rect', { x: trayX - gp, y: trayY - gp, width: trayW + 2 * gp, height: trayH + 2 * gp, rx: gp, class: 'ds-tray' }, bg);

    const pieces = [];
    set.pieces.forEach((pc, i) => {
      if (!given.has(i)) return;
      const c = G.centroid(pc.poly);
      const s = slotOf(i);
      const pos = G.add(G.place(c, s.t), off);
      pieces.push(wb.add({
        id: 'pc' + i, type: 'dsp', kind: 'piece', cls: 'ds-given', name: cap(pc.name) + ' (given)', shape: { poly: pc.poly.map((q) => [q[0] - c[0], q[1] - c[1]]) },
        x: pos[0], y: pos[1], rot: s.t.rot, flip: s.t.flip, fill: pc.color, move: false, rotate: false, flipable: false, data: { i, c }
      }));
    });
    place.sort((u, v) => u.i - v.i).forEach((q) => {
      const pc = set.pieces[q.i];
      pieces.push(wb.add({
        id: 'pc' + q.i, type: 'dsp', kind: 'piece', name: cap(pc.name), shape: { poly: q.local },
        x: trayX + q.x, y: trayY + q.y, rot: q.rot, flip: q.flip, fill: pc.color,
        rotate: step, flipable: true, snap: true, data: { i: q.i, c: q.c }
      }));
    });
    const all = G.bbox(T.concat([[[trayX - gp, trayY - gp], [trayX + trayW + gp, trayY + trayH + gp]]]));
    const mg = size * 0.12;
    wb.setBounds({ x0: all.x0 - mg, y0: all.y0 - mg, x1: all.x1 + mg, y1: all.y1 + mg }, 0.05);
    wb.handlers.snapTargets = () => outline;

    const objs = () => wb.all().filter((o) => o.data && o.data.i != null);
    const iouOf = (o, s) => G.compareShapes([wb.worldPoly(o)], [s.world], { res: 60 }).iou;

    return {
      check() {
        if (busy) return { solved: false, msg: 'Just a moment…' };
        const r = checkArrangement(objs().map((o) => wb.worldPoly(o)), T, d);
        return r.solved ? { solved: true, msg: 'Every piece in place.' } : r;
      },
      hint() {
        hintG.innerHTML = '';
        const os = objs();
        const filled = slots.map((s) => os.find((o) => cls[o.data.i] === cls[s.i] && iouOf(o, s) > 0.88) || null);
        const todo = slots.filter((s, k) => !filled[k]);
        if (!todo.length) return 'Every piece is where it belongs — press Check.';
        todo.sort((a, b) => G.absArea(b.world) - G.absArea(a.world));
        const s = todo[0];
        const taken = new Set(filled.filter(Boolean).map((o) => o.id));
        const o = os.find((q) => q.data.i === s.i && !taken.has(q.id)) || os.find((q) => cls[q.data.i] === cls[s.i] && !taken.has(q.id));
        const pc = set.pieces[s.i];
        const turnOver = o && o.data.i === s.i && !!o.flip !== s.t.flip;
        return {
          text: 'The ' + pc.name + ' goes where the dashed outline shows' + (turnOver ? ' — turned over (X)' : '') + '.',
          show() {
            ctx.s('path', { d: C.pathOf(s.world), class: 'ds-hintpoly' }, hintG);
            if (o && o.el) { o.el.classList.remove('wb-flash'); void o.el.getBBox; o.el.classList.add('wb-flash'); }
            clearTimeout(hintT);
            hintT = setTimeout(() => { if (!dead) hintG.innerHTML = ''; }, 6000);
          }
        };
      },
      solve() {
        if (busy) return;
        busy = true;
        hintG.innerHTML = '';
        const moves = objs().filter((o) => !given.has(o.data.i)).map((o) => {
          const s = slotOf(o.data.i);
          const pos = G.add(G.place(o.data.c, s.t), off);
          return { o, x: pos[0], y: pos[1], rot: s.t.rot, flip: s.t.flip };
        });
        glide(ctx, moves, C.anim(1000), () => { if (dead) return; busy = false; ctx.changed('solve'); });
      },
      destroy() { dead = true; clearTimeout(hintT); wb.handlers.snapTargets = null; }
    };
  }

  C.dissect = { generatePieces, randomDissection, cutPoly, runsOf, cutAll, matchShape, replayCuts, solutionPieces, SETS, setOf, placed, silhouetteOf, polarMoment, snapPointsSrc, connected, COLORS };

  C.css('dissect', `
    .ds-sil { opacity: .3; }
    .ds-sil path { fill: var(--ink-2); stroke: var(--ink-2); stroke-width: 1.4px; vector-effect: non-scaling-stroke; stroke-linejoin: round; }
    [data-theme="light"] .ds-sil { opacity: .42; }
    .ds-sil.outline { opacity: .75; }
    .ds-sil.outline path { fill: none; stroke-width: 2px; }
    .ds-sil.ghost { opacity: .85; }
    .ds-sil.ghost path { fill: rgba(255, 209, 102, .06); stroke: var(--gold); stroke-width: 1.8px; stroke-dasharray: 7 5; }
    .ds-goaltext { fill: var(--muted); font-weight: 700; font-family: "Segoe UI", system-ui, sans-serif; opacity: .85; }
    .ds-goaltext.small { font-weight: 500; opacity: .6; }
    .ds-tray { fill: none; stroke: var(--line); stroke-width: 1.4px; vector-effect: non-scaling-stroke; stroke-dasharray: 6 5; }
    .ds-body { stroke: none; }
    .ds-edge { fill: none; stroke: rgba(0, 0, 0, .5); stroke-width: 1.3px; vector-effect: non-scaling-stroke; stroke-linejoin: round; pointer-events: none; }
    .ds-grid { fill: none; stroke: rgba(0, 0, 0, .17); stroke-width: 1px; vector-effect: non-scaling-stroke; pointer-events: none; }
    .ds-mark { fill: none; stroke: rgba(25, 22, 50, .8); stroke-width: 1.6px; vector-effect: non-scaling-stroke; stroke-linecap: round; pointer-events: none; }
    .k-piece.ds-given .ds-body { filter: saturate(.55) brightness(.92); }
    .wb[data-mode="knife"] .wb-svg { cursor: crosshair; }
    .ds-dot { fill: var(--gold); pointer-events: none; }
    .ds-snapring { fill: rgba(255, 209, 102, .18); stroke: var(--gold); pointer-events: none; }
    .ds-knife { fill: none; stroke: var(--red); stroke-linecap: round; stroke-linejoin: round; pointer-events: none; opacity: .8; }
    .ds-knife-cut { fill: none; stroke: #fff4d6; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; filter: drop-shadow(0 0 2px var(--red)) drop-shadow(0 0 5px var(--red)); }
    .ds-knife-pt { fill: var(--red); pointer-events: none; }
    .ds-knife-n { fill: var(--text); font-weight: 700; font-family: "Segoe UI", system-ui, sans-serif; paint-order: stroke; stroke: var(--stage); stroke-width: 3px; vector-effect: non-scaling-stroke; pointer-events: none; }
    .ds-flashline, .ds-flash-bad { fill: none; stroke-width: 4px; vector-effect: non-scaling-stroke; stroke-linecap: round; stroke-linejoin: round; pointer-events: none; animation: dsflash .9s ease-out forwards; }
    .ds-flashline { stroke: #fffbe8; filter: drop-shadow(0 0 3px var(--gold)) drop-shadow(0 0 8px var(--gold)); }
    .ds-flash-bad { stroke: var(--red); stroke-dasharray: 6 5; }
    @keyframes dsflash { 0% { opacity: 1; } 100% { opacity: 0; } }
    .ds-hintpoly { fill: rgba(255, 209, 102, .16); stroke: var(--gold); stroke-width: 2.2px; vector-effect: non-scaling-stroke; stroke-dasharray: 7 5; stroke-linejoin: round; animation: dspulse 1s ease-in-out infinite; pointer-events: none; }
    .ds-hintcut { fill: none; stroke: var(--gold); stroke-width: 3.2px; vector-effect: non-scaling-stroke; stroke-dasharray: 9 6; stroke-linecap: round; stroke-linejoin: round; animation: dspulse 1s ease-in-out infinite; pointer-events: none; }
    .ds-hintghost { fill: none; stroke: var(--gold); stroke-width: 1.4px; vector-effect: non-scaling-stroke; stroke-dasharray: 3 4; opacity: .7; pointer-events: none; }
    @keyframes dspulse { 50% { opacity: .45; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
