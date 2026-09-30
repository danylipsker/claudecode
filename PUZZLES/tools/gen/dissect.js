/* The Puzzle Cabinet · tools/gen/dissect.js
 *
 *   node tools/gen/dissect.js          writes data/dissections.js and data/piece-sets.js
 *
 * Cut and rearrange: every puzzle is stored with a solution — the cuts, in
 * order, and where each piece goes — which engines/dissect.js replays in
 * verify(). Some are classics set down by hand (Dudeney's haberdasher,
 * the staircase cut); many come from the lattice trick: when a shape and a
 * square both tile the plane with the same lattice of translations, laying one
 * tiling over the other cuts the shape into pieces that slide into the square.
 *
 * Given pieces: the Stomachion's squares and figures are found by exact cover
 * (js/lib/dlx.js) over sample points; T-puzzle figures by a constructive
 * search; the rest are placed by hand and checked.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/dlx.js'));
require(path.join(ROOT, 'engines/dissect.js'));
const G = C.geom;
const D = C.dissect;
const ENG = C.engines.dissect;

const S2 = Math.SQRT2, S3 = Math.sqrt(3);
const r9 = (v) => Math.round(v * 1e9) / 1e9;
const rp = (p) => [r9(p[0]), r9(p[1])];
const rpoly = (pl) => pl.map(rp);

/* ---------------------------------------------------------------------
 * polygons from unit cells, union outlines, interior points
 * ------------------------------------------------------------------- */

// outline of a set of unit cells [[x, y], ...] (simply connected), counter-clockwise on screen
function cellsOutline(cells) {
  const has = new Set(cells.map((c) => c[0] + ',' + c[1]));
  const edges = new Map(); // start -> end, boundary edges with the inside on the left (y down)
  cells.forEach(([x, y]) => {
    if (!has.has(x + ',' + (y - 1))) edges.set(x + ',' + y, [x + 1, y]);
    if (!has.has((x + 1) + ',' + y)) edges.set((x + 1) + ',' + y, [x + 1, y + 1]);
    if (!has.has(x + ',' + (y + 1))) edges.set((x + 1) + ',' + (y + 1), [x, y + 1]);
    if (!has.has((x - 1) + ',' + y)) edges.set(x + ',' + (y + 1), [x, y]);
  });
  const start = edges.keys().next().value;
  const out = [];
  let k = start, guard = 0;
  do {
    const p = k.split(',').map(Number);
    out.push(p);
    const q = edges.get(k);
    k = q[0] + ',' + q[1];
  } while (k !== start && guard++ < 10000);
  return G.clean(out);
}

function parseCells(rows) {
  const cells = [];
  rows.forEach((r, y) => r.split('').forEach((ch, x) => { if (ch !== '.' && ch !== ' ') cells.push([x, y]); }));
  return cells;
}

// the union of polygons that meet edge to edge: the outline loops (shared edges cancel)
function unionOutline(polys, tol) {
  tol = tol || 1e-7;
  const key = (p) => Math.round(p[0] / tol / 10) + ',' + Math.round(p[1] / tol / 10);
  // split every edge at the vertices of other polygons lying on it
  const verts = [];
  polys.forEach((pl) => pl.forEach((p) => verts.push(p)));
  const segs = [];
  polys.forEach((pl) => {
    const s = G.area(pl) > 0 ? pl : pl.slice().reverse(); // same winding for all
    s.forEach((a, i) => {
      const b = s[(i + 1) % s.length];
      const L = G.dist(a, b);
      const ts = [];
      verts.forEach((v) => {
        if (G.segDist(v, a, b) > tol) return;
        const t = G.dot(G.sub(v, a), G.sub(b, a)) / (L * L);
        if (t > tol / L && t < 1 - tol / L) ts.push(t);
      });
      ts.sort((x, y) => x - y);
      let prev = a;
      ts.concat([1]).forEach((t) => { const q = t === 1 ? b : G.lerp(a, b, t); if (G.dist(prev, q) > tol) segs.push([prev, q]); prev = q; });
    });
  });
  const count = new Map();
  segs.forEach(([a, b]) => { const k = key(a) + '>' + key(b); count.set(k, (count.get(k) || 0) + 1); });
  const outer = segs.filter(([a, b]) => !count.has(key(b) + '>' + key(a)));
  const next = new Map();
  outer.forEach((s) => { const k = key(s[0]); if (!next.has(k)) next.set(k, []); next.get(k).push(s); });
  const used = new Set();
  const loops = [];
  outer.forEach((s0) => {
    if (used.has(s0)) return;
    const loop = [];
    let s = s0, guard = 0;
    while (s && !used.has(s) && guard++ < 5000) {
      used.add(s);
      loop.push(s[0]);
      const cand = (next.get(key(s[1])) || []).filter((q) => !used.has(q));
      if (cand.length > 1) { // at a pinch point take the sharpest left turn
        const din = G.angle(G.sub(s[1], s[0]));
        cand.sort((p, q) => turnOf(din, G.angle(G.sub(p[1], p[0]))) - turnOf(din, G.angle(G.sub(q[1], q[0]))));
      }
      s = cand[0];
    }
    loops.push(G.clean(loop, tol));
  });
  return loops.filter((l) => l.length >= 3);
}
function turnOf(a, b) { let d = G.normDeg(b - a); if (d > 180) d -= 360; return d; }

// a point well inside a polygon
function interiorPoint(poly) {
  const c = G.centroid(poly);
  const b = G.bbox([poly]);
  const depth = (q) => { if (!G.pointInPoly(q, poly)) return -1; let m = Infinity; poly.forEach((a, i) => { m = Math.min(m, G.segDist(q, a, poly[(i + 1) % poly.length])); }); return m; };
  let best = c, bd = depth(c);
  const n = 24;
  for (let i = 1; i < n; i++) for (let j = 1; j < n; j++) {
    const q = [b.x0 + b.w * i / n, b.y0 + b.h * j / n];
    const dd = depth(q);
    if (dd > bd + 1e-9) { bd = dd; best = q; }
  }
  return rp(best);
}

/* ---------------------------------------------------------------------
 * fitting a piece onto its place: a turn (in steps), maybe a flip, a slide
 * ------------------------------------------------------------------- */
function fitPiece(src, tgt, step, flipOk) {
  if (src.length !== tgt.length) return null;
  const cs = G.centroid(src), ct = G.centroid(tgt);
  for (const flip of flipOk === false ? [false] : [false, true]) {
    for (let rot = 0; rot < 360; rot += step || 45) {
      const moved = G.placePoly(src, { x: 0, y: 0, rot, flip });
      const cm = G.centroid(moved);
      const t = [ct[0] - cm[0], ct[1] - cm[1]];
      const fin = moved.map((p) => [p[0] + t[0], p[1] + t[1]]);
      if (fin.every((p) => tgt.some((q) => G.dist(p, q) < 1e-6))) return { x: r9(t[0]), y: r9(t[1]), rot, flip };
    }
  }
  return null;
}

// solution record for cuts (replayed with the engine) and target pieces
function solveByTargets(shape, cuts, targets, step, flipOk) {
  const r = D.cutAll(shape, cuts[0]);
  let polys = shape.map((pl) => pl.slice());
  for (const c of cuts) { const q = D.cutAll(polys, c); if (!q.made) throw new Error('cut cuts nothing ' + JSON.stringify(c)); polys = q.polys; }
  if (polys.length !== targets.length) throw new Error('pieces ' + polys.length + ' vs targets ' + targets.length);
  const left = targets.slice();
  const place = polys.map((pc) => {
    const cl = G.clean(pc, 1e-7);
    for (let i = 0; i < left.length; i++) {
      const f = fitPiece(cl, G.clean(left[i], 1e-7), step, flipOk);
      if (f) { left.splice(i, 1); const a = interiorPoint(cl); return [a[0], a[1], f.x, f.y, f.rot, f.flip ? 1 : 0]; }
    }
    throw new Error('no target fits piece ' + JSON.stringify(cl.map(rp)));
  });
  void r;
  return place;
}

/* ---------------------------------------------------------------------
 * the lattice trick
 * ------------------------------------------------------------------- */

// are these unit cells one of each class modulo the lattice <u, v> (so they tile by it)?
function isFundamental(cells, u, v) {
  const det = u[0] * v[1] - u[1] * v[0];
  if (Math.abs(det) !== cells.length) return false;
  const seen = new Set();
  for (const c of cells) {
    // reduce c modulo the lattice: coordinates a, b with c = a u + b v, keep the fractional parts
    const a = (c[0] * v[1] - c[1] * v[0]) / det, b = (u[0] * c[1] - u[1] * c[0]) / det;
    const fa = a - Math.floor(a + 1e-9), fb = b - Math.floor(b + 1e-9);
    const k = Math.round(fa * Math.abs(det)) + ',' + Math.round(fb * Math.abs(det));
    if (seen.has(k)) return false;
    seen.add(k);
  }
  return true;
}

// the straight cuts along the lines of the lattice grid through O, each spanning every shape it meets
function latticeCuts(shapes, u, v, O) {
  const bb = G.bbox(shapes);
  const corners = [[bb.x0, bb.y0], [bb.x1, bb.y0], [bb.x1, bb.y1], [bb.x0, bb.y1]];
  const cuts = [];
  const fam = (dir, stepV) => {
    const dn = G.norm(dir), n = G.perp(dn);
    const sn = G.dot(stepV, n);
    const ks = corners.map((c) => G.dot(G.sub(c, O), n) / sn);
    const L = (bb.w + bb.h) * 3;
    for (let k = Math.ceil(Math.min(...ks) - 1e-9); k <= Math.floor(Math.max(...ks) + 1e-9); k++) {
      const P0 = G.add(O, G.mul(stepV, k));
      const A = G.sub(P0, G.mul(dn, L)), B = G.add(P0, G.mul(dn, L));
      const runs = [];
      shapes.forEach((s) => D.runsOf(s, [A, B]).forEach((r) => runs.push(r)));
      if (!runs.length) continue;
      const pts = [];
      runs.forEach((r) => { pts.push(r[0], r[r.length - 1]); });
      pts.sort((p, q) => G.dot(G.sub(p, A), dn) - G.dot(G.sub(q, A), dn));
      cuts.push([rp(pts[0]), rp(pts[pts.length - 1])]);
    }
  };
  fam(u, v);
  fam(v, u);
  return cuts;
}

function latticeSolution(shapes, u, v, O) {
  const cuts = latticeCuts(shapes, u, v, O);
  let polys = shapes.map((pl) => pl.slice());
  const kept = [];
  cuts.forEach((c) => { const r = D.cutAll(polys, c); if (r.made) { polys = r.polys; kept.push(c); } });
  const det = u[0] * v[1] - u[1] * v[0];
  const place = [];
  for (const pc of polys) {
    const a0 = interiorPoint(pc);
    const w = G.sub(a0, O);
    const a = (w[0] * v[1] - w[1] * v[0]) / det, b = (u[0] * w[1] - u[1] * w[0]) / det;
    const i = Math.floor(a), j = Math.floor(b);
    const t = [-(i * u[0] + j * v[0]), -(i * u[1] + j * v[1])];
    place.push([a0[0], a0[1], r9(t[0]), r9(t[1]), 0, 0]);
  }
  const target = [[O, G.add(O, u), G.add(G.add(O, u), v), G.add(O, v)].map(rp)];
  return { cuts: kept, place, target, pieces: polys.length };
}

// try the knife-snap settings a puzzle needs, coarsest first
function snapSettings(base) {
  const opts = [{}, { quarters: true }, { grid: 1 }, { grid: 0.5 }, { grid: 0.5, quarters: true }, { grid: 0.25 }];
  for (const o of opts) {
    const d = Object.assign({}, base, o);
    const r = D.replayCuts(d, true);
    if (!r.err) return o;
  }
  return null;
}

/* ---------------------------------------------------------------------
 * tiling a region with lattice pieces (turned by quarter turns, maybe
 * flipped, moved by whole steps): exact cover over sample points
 * ------------------------------------------------------------------- */

function properCross(a, b, c, d, eps) {
  const d1 = G.cross(G.sub(b, a), G.sub(c, a)), d2 = G.cross(G.sub(b, a), G.sub(d, a));
  const d3 = G.cross(G.sub(d, c), G.sub(a, c)), d4 = G.cross(G.sub(d, c), G.sub(b, c));
  return ((d1 > eps && d2 < -eps) || (d1 < -eps && d2 > eps)) && ((d3 > eps && d4 < -eps) || (d3 < -eps && d4 > eps));
}
function onEdge(p, poly, eps) { return poly.some((a, i) => G.segDist(p, a, poly[(i + 1) % poly.length]) < eps); }
function strictlyIn(p, poly, eps) { return G.pointInPoly(p, poly) && !onEdge(p, poly, eps); }
// is polygon a inside polygon b (touching allowed)?
function polyInside(a, b, eps) {
  eps = eps || 1e-7;
  if (!a.every((p) => G.pointInPoly(p, b) || onEdge(p, b, eps))) return false;
  if (b.some((p) => strictlyIn(p, a, eps))) return false;
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) if (properCross(a[i], a[(i + 1) % a.length], b[j], b[(j + 1) % b.length], eps)) return false;
  for (let i = 0; i < a.length; i++) { const m = G.mid(a[i], a[(i + 1) % a.length]); if (!(G.pointInPoly(m, b) || onEdge(m, b, eps))) return false; }
  return true;
}
// do two polygons overlap by more than touching?
function polysOverlap(a, b, eps) {
  eps = eps || 1e-7;
  const ba = G.bbox([a]), bb = G.bbox([b]);
  if (ba.x1 <= bb.x0 + eps || bb.x1 <= ba.x0 + eps || ba.y1 <= bb.y0 + eps || bb.y1 <= ba.y0 + eps) return false;
  for (let i = 0; i < a.length; i++) for (let j = 0; j < b.length; j++) if (properCross(a[i], a[(i + 1) % a.length], b[j], b[(j + 1) % b.length], eps)) return true;
  if (a.some((p) => strictlyIn(p, b, eps)) || b.some((p) => strictlyIn(p, a, eps))) return true;
  for (let i = 0; i < a.length; i++) { const m = G.mid(a[i], a[(i + 1) % a.length]); if (strictlyIn(m, b, eps)) return true; }
  for (let i = 0; i < b.length; i++) { const m = G.mid(b[i], b[(i + 1) % b.length]); if (strictlyIn(m, a, eps)) return true; }
  if (strictlyIn(G.centroid(a), b, eps) || strictlyIn(G.centroid(b), a, eps)) return true;
  return false;
}

const SAMPLE_OFFS = [[0.3183, 0.5772], [0.7071, 0.2718], [0.1414, 0.1732], [0.8660, 0.8284]];
/* region: polygon; pieces: [poly] with integer vertices; opts: { max, rotSteps (90), flip, unit, nodeLimit, shuffle }
 * returns [[pieceIndex, x, y, rot, flip] ...] placements (G.place on the piece's own polygon) per solution */
function tileRegion(region, pieces, opts) {
  opts = opts || {};
  const unit = opts.unit || 1;
  const rb = G.bbox([region]);
  const samples = [];
  for (let x = Math.floor(rb.x0 / unit) * unit; x < rb.x1; x += unit) for (let y = Math.floor(rb.y0 / unit) * unit; y < rb.y1; y += unit) {
    (opts.offs || SAMPLE_OFFS.slice(0, opts.samples || 2)).forEach(([dx, dy]) => { const q = [x + dx * unit, y + dy * unit]; if (strictlyIn(q, region, 1e-9)) samples.push(q); });
  }
  const P = samples.length;
  const rows = [], meta = [];
  pieces.forEach((pc, pi) => {
    const seen = new Set();
    const rots = opts.rots || [0, 90, 180, 270];
    (opts.flip === false ? [false] : [false, true]).forEach((flip) => rots.forEach((rot) => {
      const base = G.placePoly(pc, { x: 0, y: 0, rot, flip }).map((p) => [Math.round(p[0] * 1e9) / 1e9, Math.round(p[1] * 1e9) / 1e9]);
      const bb = G.bbox([base]);
      for (let dx = Math.ceil((rb.x0 - bb.x0) / unit - 1e-9) * unit; dx <= rb.x1 - bb.x1 + 1e-9; dx += unit) {
        for (let dy = Math.ceil((rb.y0 - bb.y0) / unit - 1e-9) * unit; dy <= rb.y1 - bb.y1 + 1e-9; dy += unit) {
          const poly = base.map((p) => [p[0] + dx, p[1] + dy]);
          if (!polyInside(poly, region)) continue;
          const pb = G.bbox([poly]);
          const cov = [];
          samples.forEach((q, si) => { if (q[0] > pb.x0 && q[0] < pb.x1 && q[1] > pb.y0 && q[1] < pb.y1 && G.pointInPoly(q, poly)) cov.push(si); });
          if (!cov.length) continue;
          const key = cov.join(',');
          if (seen.has(key)) continue;
          seen.add(key);
          rows.push(cov.concat([P + pi]));
          meta.push([pi, r9(dx), r9(dy), rot, flip ? 1 : 0]);
        }
      }
    }));
  });
  const sols = C.DLX.solve({ primary: P + pieces.length, rows, max: opts.max || 1, nodeLimit: opts.nodeLimit || 2e7, shuffle: opts.shuffle });
  const out = [];
  sols.forEach((s) => {
    const pl = s.map((ri) => meta[ri]).sort((a, b) => a[0] - b[0]);
    const polys = pl.map((m) => G.placePoly(pieces[m[0]], { x: m[1], y: m[2], rot: m[3], flip: !!m[4] }));
    // the samples can miss a sliver: check properly
    for (let i = 0; i < polys.length; i++) for (let j = i + 1; j < polys.length; j++) if (polysOverlap(polys[i], polys[j])) return;
    out.push(pl);
  });
  out.aborted = sols.aborted;
  return out;
}

/* ---------------------------------------------------------------------
 * the knife cuts that take a shape apart into given pieces: walk along the
 * edges the pieces share, from edge to edge of the part being cut,
 * preferring straight runs and few bends
 * ------------------------------------------------------------------- */
function cutsFromArrangement(shape, pieces, opts) {
  opts = opts || {};
  const tol = 1e-6;
  const K = (p) => Math.round(p[0] * 1e5) + ',' + Math.round(p[1] * 1e5);
  const verts = [];
  const vIndex = new Map();
  const vid = (p) => { const k = K(p); if (!vIndex.has(k)) { vIndex.set(k, verts.length); verts.push(p); } return vIndex.get(k); };
  // all edges of all pieces, split at every vertex lying on them
  const allV = [];
  pieces.forEach((pl) => pl.forEach((p) => allV.push(p)));
  shape.forEach((pl) => pl.forEach((p) => allV.push(p)));
  const segCount = new Map();
  pieces.forEach((pl) => pl.forEach((a, i) => {
    const b = pl[(i + 1) % pl.length];
    const L = G.dist(a, b);
    const ts = [0, 1];
    allV.forEach((v) => { if (G.segDist(v, a, b) < tol) { const t = G.dot(G.sub(v, a), G.sub(b, a)) / (L * L); if (t > 1e-9 && t < 1 - 1e-9) ts.push(t); } });
    ts.sort((x, y) => x - y);
    for (let k = 0; k + 1 < ts.length; k++) {
      const p = G.lerp(a, b, ts[k]), q = G.lerp(a, b, ts[k + 1]);
      if (G.dist(p, q) < tol) continue;
      const u = vid(p), w = vid(q);
      const key = Math.min(u, w) + '-' + Math.max(u, w);
      segCount.set(key, (segCount.get(key) || 0) + 1);
    }
  }));
  // internal edges: shared by two pieces
  const adj = new Map();
  segCount.forEach((n, key) => {
    if (n < 2) return;
    const [u, w] = key.split('-').map(Number);
    if (!adj.has(u)) adj.set(u, []); if (!adj.has(w)) adj.set(w, []);
    adj.get(u).push(w); adj.get(w).push(u);
  });
  const within = (part, pc) => G.pointInPoly(interiorPointQuick(pc), part);
  let parts = shape.map((pl) => pl.map((p) => p.slice()));
  const cuts = [];
  for (let guard = 0; guard < 40; guard++) {
    const busy = parts.map((pt) => pieces.filter((pc) => within(pt, pc)).length);
    const k = busy.findIndex((n) => n > 1);
    if (k < 0) break;
    const part = parts[k];
    // boundary vertices of this part that start an unused internal edge
    const onB = (i) => part.some((a, j) => G.segDist(verts[i], a, part[(j + 1) % part.length]) < tol);
    let best = null;
    adj.forEach((nb, s) => {
      if (!onB(s)) return;
      // search paths from s along internal edges inside the part to another boundary vertex
      const stack = [[s, [s], null, 0]];
      let steps = 0;
      while (stack.length && steps++ < 20000) {
        const [v, pathV, dir, bends] = stack.pop();
        (adj.get(v) || []).forEach((w) => {
          if (pathV.includes(w)) return;
          const m = G.mid(verts[v], verts[w]);
          if (!G.pointInPoly(m, part) || part.some((a, j) => G.segDist(m, a, part[(j + 1) % part.length]) < tol)) return;
          const d = G.norm(G.sub(verts[w], verts[v]));
          const nb2 = bends + (dir && Math.abs(G.cross(dir, d)) > 1e-6 ? 1 : 0);
          if (nb2 > (opts.maxBends == null ? 6 : opts.maxBends)) return;
          const np = pathV.concat([w]);
          if (onB(w)) {
            const pts = G.clean(np.map((i) => verts[i]).concat([]), 1e-9);
            const path = np.map((i) => verts[i]);
            const r = C.dissect.cutPoly(part, path);
            if (r && r.every((q) => pieces.some((pc) => within(q, pc)))) {
              const score = nb2 * 10 + np.length * 0.01;
              if (!best || score < best.score) best = { score, path: simplify(path), r };
            }
            void pts;
            return;
          }
          stack.push([w, np, d, nb2]);
        });
      }
    });
    if (!best) throw new Error('no cut path found');
    cuts.push(best.path);
    parts.splice(k, 1, ...best.r);
  }
  return cuts;
  function simplify(path) { // drop points where the path runs straight on
    const out = [path[0]];
    for (let i = 1; i + 1 < path.length; i++) {
      const a = out[out.length - 1], b = path[i], c = path[i + 1];
      if (Math.abs(G.cross(G.sub(b, a), G.sub(c, b))) > 1e-9) out.push(b);
    }
    out.push(path[path.length - 1]);
    return out.map(rp);
  }
}
function interiorPointQuick(pl) { const c = G.centroid(pl); return G.pointInPoly(c, pl) ? c : interiorPoint(pl); }

module.exports = { cellsOutline, parseCells, unionOutline, interiorPoint, fitPiece, solveByTargets, isFundamental, latticeCuts, latticeSolution, snapSettings, tileRegion, polysOverlap, polyInside, cutsFromArrangement };
if (require.main !== module) return;

/* =====================================================================
 * CUT AND REARRANGE
 * =================================================================== */

const CUT = [];
function cutPuzzle(o) {
  const data = { kind: 'cut', shape: o.shape.map(rpoly), target: o.target.map(rpoly) };
  if (o.show) data.show = o.show;
  if (o.goalName) data.goalName = o.goalName;
  if (o.maxCuts != null) data.maxCuts = o.maxCuts;
  if (o.maxPieces != null) data.maxPieces = o.maxPieces;
  ['grid', 'lines', 'quarters', 'snaps', 'rot', 'noFlip', 'colors', 'names', 'any'].forEach((k) => { if (o[k] != null) data[k] = o[k]; });
  if (data.snaps) data.snaps = data.snaps.map(rp);
  data.sol = { cuts: o.cuts.map(rpoly), place: o.place };
  // the knife snaps the puzzle needs, if not given
  if (o.autoSnap !== false && data.grid == null && !data.quarters) {
    const sn = snapSettings(data);
    if (!sn) throw new Error(o.id + ': the cuts cannot be snapped');
    Object.assign(data, sn);
  }
  const p = { id: o.id, title: o.title, diff: o.diff };
  ['year', 'source'].forEach((k) => { if (o[k] != null) p[k] = o[k]; });
  p.text = o.text;
  p.goal = o.goal;
  ['hints', 'explain', 'links', 'concepts', 'tags'].forEach((k) => { if (o[k] != null) p[k] = o[k]; });
  p.data = data;
  const v = ENG.verify(p);
  if (!v.ok) throw new Error(o.id + ': ' + v.err);
  CUT.push(p);
  return p;
}

// pieces and targets written out: the generator fits each piece to its target
function byTargets(o) {
  o.place = solveByTargets(o.shape, o.cuts, o.targets, o.rot || 45, !o.noFlip);
  return cutPuzzle(o);
}

function lattice(o) {
  const sol = latticeSolution(o.shape, o.u, o.v, o.O);
  o.cuts = sol.cuts;
  o.place = sol.place;
  o.target = sol.target;
  if (o.expectPieces && sol.pieces !== o.expectPieces) throw new Error(o.id + ': ' + sol.pieces + ' pieces, expected ' + o.expectPieces);
  if (o.maxPieces === 'sol') o.maxPieces = sol.pieces;
  if (o.maxCuts === 'sol') o.maxCuts = sol.cuts.length;
  return cutPuzzle(o);
}
function polyomino(rows) { return cellsOutline(parseCells(rows)); }
function orientCells(cells, k) { // k: 0-7
  let cs = cells.map(([x, y]) => (k >= 4 ? [-x, y] : [x, y]));
  for (let r = 0; r < k % 4; r++) cs = cs.map(([x, y]) => [-y, x]);
  const mx = Math.min(...cs.map((c) => c[0])), my = Math.min(...cs.map((c) => c[1]));
  return cs.map(([x, y]) => [x - mx, y - my]);
}
// the best way to lay a square lattice over a polyomino: fewest pieces, then fewest cuts, then the simplest snaps
function bestLattice(rows, opts) {
  opts = opts || {};
  const cells0 = parseCells(rows), n = cells0.length;
  let best = null;
  for (let k = 0; k < (opts.orients || 1); k++) {
    const cells = orientCells(cells0, k);
    const poly = cellsOutline(cells);
    for (let a = 0; a * a <= n; a++) for (let b = 1; b * b <= n; b++) {
      if (a * a + b * b !== n) continue;
      [[[a, b], [-b, a]], [[b, a], [-a, b]]].forEach(([u, v]) => {
        if (!isFundamental(cells, u, v)) return;
        const span = Math.abs(u[0]) + Math.abs(v[0]) + Math.abs(u[1]) + Math.abs(v[1]);
        for (let x = 0; x <= span + 1e-9; x += 0.5) for (let y = 0; y <= span + 1e-9; y += 0.5) {
          const sol = latticeSolution([poly], u, v, [x, y]);
          const base = { shape: [poly], sol: { cuts: sol.cuts, place: sol.place }, target: sol.target };
          const sn = snapSettings(base);
          if (!sn) continue;
          const score = sol.pieces * 100 + sol.cuts.length * 10 + (sn.grid ? (sn.grid < 0.5 ? 3 : sn.grid < 1 ? 2 : 1) : 0) + (sn.quarters ? 1 : 0);
          if (!best || score < best.score) best = { score, poly, u, v, O: [x, y], pieces: sol.pieces };
        }
      });
    }
  }
  return best;
}

const GOAL_SQ = (n, k) => (k ? C.plural(k, 'straight cut') + ', ' : '') + 'at most ' + n + ' pieces, one square.';

/* ----- first steps: school dissections ----- */

byTargets({
  id: 'dis-tri-para', title: 'Half a Triangle Turned', diff: 1,
  shape: [[[0, 4], [6, 4], [2, 0]]],
  cuts: [[[1, 2], [4, 2]]],
  targets: [[[0, 4], [6, 4], [4, 2], [1, 2]], [[4, 2], [7, 2], [6, 4]]],
  target: [[[0, 4], [6, 4], [7, 2], [1, 2]]],
  maxCuts: 1, maxPieces: 2,
  text: 'One straight cut across this triangle, and the two pieces make the parallelogram beside it.',
  goal: 'One cut, two pieces: make the parallelogram.',
  hints: ['Cut halfway up, parallel to the base: the knife snaps to the middle of each slanting side.', 'Turn the small top triangle half a turn (R twice… four times at 45°) and fit it against the right-hand end.'],
  explain: 'The line joining the midpoints of two sides is parallel to the third and half as long. The little triangle above it, turned about the midpoint of its side, lands exactly on the other side of the cut — so a triangle is a parallelogram of the same base and half the height, which is why its area is half base × height.',
  concepts: ['dissection', 'area'], tags: ['triangle', 'parallelogram', 'midline', 'school']
});

byTargets({
  id: 'dis-para-rect', title: 'Straighten the Slope', diff: 1,
  shape: [[[0, 3], [5, 3], [7, 0], [2, 0]]],
  cuts: [[[2, 0], [2, 3]]],
  targets: [[[2, 3], [5, 3], [7, 0], [2, 0]], [[5, 3], [7, 3], [7, 0]]],
  target: [[[2, 3], [7, 3], [7, 0], [2, 0]]],
  maxCuts: 1, maxPieces: 2, lines: 1,
  text: 'A leaning parallelogram on squared paper. Make it stand up straight — a rectangle — with a single cut.',
  goal: 'One cut: turn the parallelogram into a rectangle.',
  hints: ['Cut straight down from the top-left corner.', 'Slide the triangle you cut off across to the other end.'],
  explain: 'Cutting along a height and sliding the triangle across shows why a parallelogram has the same area as the rectangle on the same base and height.',
  concepts: ['dissection', 'area'], tags: ['parallelogram', 'rectangle', 'school']
});

byTargets({
  id: 'dis-trap-tri', title: 'Trapezoid to Triangle', diff: 1,
  shape: [[[0, 4], [6, 4], [4, 0], [2, 0]]],
  cuts: [[[2, 0], [5, 2]]],
  targets: [[[0, 4], [6, 4], [5, 2], [2, 0]], [[5, 2], [6, 4], [8, 4]]],
  target: [[[0, 4], [8, 4], [2, 0]]],
  maxCuts: 1, maxPieces: 2,
  text: 'One cut turns this trapezoid into the triangle beside it.',
  goal: 'One cut, two pieces: make the triangle.',
  hints: ['Start the cut at the top-left corner and aim for the middle of the right-hand side.', 'Give the small piece a half turn about that midpoint.'],
  explain: 'Turning the corner triangle half a turn about the midpoint of the slanting side carries the short top edge down onto the line of the base, which is why the area of a trapezoid is the average of its parallel sides times its height.',
  concepts: ['dissection', 'area'], tags: ['trapezoid', 'triangle', 'school']
});

byTargets({
  id: 'dis-trap-para', title: 'Trapezoid to Parallelogram', diff: 1,
  shape: [[[0, 4], [8, 4], [6, 0], [2, 0]]],
  cuts: [[[1, 2], [7, 2]]],
  targets: [[[0, 4], [8, 4], [7, 2], [1, 2]], [[7, 2], [13, 2], [12, 4], [8, 4]]],
  target: [[[0, 4], [12, 4], [13, 2], [1, 2]]],
  maxCuts: 1, maxPieces: 2,
  text: 'Cut the trapezoid once and make a long parallelogram, half as tall.',
  goal: 'One cut, two pieces: make the parallelogram.',
  hints: ['Cut across at half height.', 'The top half turns upside down and goes on the end of the bottom half.'],
  explain: 'The two halves have the same slanting sides; turned over end to end they make a strip as long as both parallel sides together and half the height — the trapezoid-area formula, cut out of card.',
  concepts: ['dissection', 'area'], tags: ['trapezoid', 'parallelogram', 'school']
});

byTargets({
  id: 'dis-tri-rect', title: 'The Folded-Down Roof', diff: 2,
  shape: [[[0, 4], [6, 4], [3, 0]]],
  cuts: [[[1.5, 2], [4.5, 2]], [[3, 0], [3, 2]]],
  targets: [[[0, 4], [6, 4], [4.5, 2], [1.5, 2]], [[1.5, 2], [0, 2], [0, 4]], [[4.5, 2], [6, 2], [6, 4]]],
  target: [[[0, 4], [6, 4], [6, 2], [0, 2]]],
  maxCuts: 2, maxPieces: 3,
  text: 'Two cuts, three pieces: make this triangle into the rectangle beside it — as wide as the triangle, half as tall.',
  goal: 'Two cuts, three pieces: make the rectangle.',
  hints: ['First cut across at half height.', 'Then cut the little top triangle down the middle, and turn each half down beside the base like a flap.'],
  explain: 'Each half of the top triangle turns half a turn about the midpoint of its slanting side and fills a corner. A triangle is a rectangle with the same base and half the height: area = ½ × base × height.',
  concepts: ['dissection', 'area'], tags: ['triangle', 'rectangle', 'school']
});

byTargets({
  id: 'dis-rhombus', title: 'The Diamond Laid Flat', diff: 2,
  shape: [[[0, 2], [3, 0], [6, 2], [3, 4]]],
  cuts: [[[0, 2], [6, 2]], [[3, 2], [3, 4]]],
  targets: [[[0, 2], [3, 0], [6, 2]], [[3, 0], [6, 0], [6, 2]], [[0, 0], [3, 0], [0, 2]]],
  target: [[[0, 0], [6, 0], [6, 2], [0, 2]]],
  maxCuts: 2, maxPieces: 3,
  text: 'Cut the diamond into three pieces that make the long, flat rectangle.',
  goal: 'Two cuts, three pieces: make the rectangle.',
  hints: ['The rectangle is exactly as wide as the diamond and half as tall. Cut the diamond across its middle.', 'Cut the lower half down the middle too; each quarter fills a corner above.'],
  explain: 'A rhombus is half of the rectangle drawn round it: its area is half the product of its diagonals.',
  concepts: ['dissection', 'area'], tags: ['rhombus', 'rectangle', 'school']
});

byTargets({
  id: 'dis-hexagon', title: 'The Honeycomb Cell', diff: 2,
  shape: [[[-2, 0], [-1, -S3], [1, -S3], [2, 0], [1, S3], [-1, S3]]],
  cuts: [[[-1, -S3], [-1, S3]], [[-2, 0], [-1, 0]]],
  targets: [[[-1, -S3], [1, -S3], [2, 0], [1, S3], [-1, S3]], [[1, -S3], [2, -S3], [2, 0]], [[1, S3], [2, S3], [2, 0]]],
  target: [[[-1, -S3], [2, -S3], [2, S3], [-1, S3]]],
  maxCuts: 2, maxPieces: 3,
  text: 'A regular hexagon, like a cell of honeycomb. Cut it into three pieces that make a rectangle.',
  goal: 'Two cuts, three pieces: make the rectangle.',
  hints: ['Cut off the left-hand point with a cut from corner to corner.', 'Halve that triangle, and send the two halves round to fill the corners beside the right-hand point.'],
  explain: 'The left point is a triangle with a 120° angle; its halves are right triangles whose short sides fit the notches either side of the right point exactly. The rectangle is 3 by 2√3 — the hexagon\'s area, 6√3 for sides of 2.',
  concepts: ['dissection', 'area', 'symmetry'], tags: ['hexagon', 'rectangle']
});

cutPuzzle({
  id: 'dis-plank', title: 'The Plank', diff: 1,
  shape: [[[0, 0], [8, 0], [8, 2], [0, 2]]],
  cuts: [[[4, 0], [4, 2]]],
  place: [[1, 1, 0, 0, 0, 0], [6, 1, -4, 2, 0, 0]],
  target: [[[0, 0], [4, 0], [4, 4], [0, 4]]],
  maxCuts: 1, maxPieces: 2, grid: 1, lines: 1, show: 'name', goalName: 'a square',
  text: 'A plank 8 long and 2 wide. With one cut, make a square.',
  goal: 'One cut, two pieces, one square.',
  hints: ['The square has the same area, 16, so its side is 4.'],
  explain: 'Area decides the square: 8 × 2 = 16 = 4 × 4. Most dissections start with that sum.',
  concepts: ['dissection', 'area'], tags: ['rectangle', 'square', 'warm-up']
});

/* ----- two equal squares ----- */
{
  const h = S2, c = [h, h];
  byTargets({
    id: 'dis-two-equal', title: 'Two Tiles, One Tile', diff: 2,
    shape: [[[0, 0], [2, 0], [2, 2], [0, 2]], [[3, 0], [5, 0], [5, 2], [3, 2]]],
    cuts: [[[0, 0], [2, 2]], [[3, 0], [5, 2]]],
    targets: [[[0, 0], [2 * h, 0], c], [[2 * h, 0], [2 * h, 2 * h], c], [[2 * h, 2 * h], [0, 2 * h], c], [[0, 2 * h], [0, 0], c]],
    target: [[[0, 0], [2 * h, 0], [2 * h, 2 * h], [0, 2 * h]]],
    maxCuts: 2, maxPieces: 4, show: 'name', goalName: 'one square',
    colors: ['#ffb057', '#38d9d3'],
    text: 'Two equal square tiles. Cut them so that the pieces make one big square tile, twice the area.',
    goal: 'Two cuts, four pieces, one square.',
    hints: ['The big square\'s side is the diagonal of a small one.', 'Cut each tile along a diagonal, and put the four right angles together in the middle.'],
    explain: 'Four half-tiles meet at their right angles in the centre, and their long sides make the edges. This is the oldest dissection of all — the figure Socrates draws in the sand in Plato\'s *Meno* to double a square.',
    concepts: ['dissection', 'area'], tags: ['squares', 'meno', 'doubling']
  });
}

/* ----- the staircase cut ----- */
function staircase(o) {
  const { W, H, n } = o;
  const w = W / (n + 1), hh = H / n;
  const pts = [[w, 0]];
  for (let k = 1; k <= n; k++) { pts.push([k * w, k * hh]); if (k < n) pts.push([(k + 1) * w, k * hh]); }
  o.shape = [[[0, 0], [W, 0], [W, H], [0, H]]];
  o.cuts = [pts];
  o.place = [[w * 0.5, H - hh * 0.5, 0, 0, 0, 0], [W - w * 0.5, hh * 0.5, -w, -hh, 0, 0]];
  o.target = [[[0, -hh], [n * w, -hh], [n * w, H], [0, H]]];
  o.maxCuts = 1; o.maxPieces = 2; o.grid = 1; o.lines = 1;
  o.concepts = ['dissection', 'area'];
  return cutPuzzle(o);
}
staircase({
  id: 'dis-stair-9x4', title: 'The Staircase Cut', diff: 2, W: 9, H: 4, n: 2, show: 'name', goalName: 'a 6 × 6 square',
  text: 'A rug 9 long and 4 wide is to become a square rug 6 by 6 — with one cut, in two pieces. The cut may turn corners (click at each corner, or drag leg by leg).',
  goal: 'One cut (it may bend), two pieces, a 6 × 6 square.',
  hints: ['9 × 4 = 36 = 6 × 6, so the rug loses 3 in length and gains 2 in width.', 'Cut a staircase with steps 3 wide and 2 high, then slide one piece up one step.'],
  explain: 'Sliding one half of a staircase up by one step shortens the rug by the width of a step and widens it by the height of a step: 9 − 3 = 6 and 4 + 2 = 6. The same trick turns any rectangle (n + 1)w × nh into nw × (n + 1)h.',
  source: 'A traditional trick of the old puzzle books.',
  tags: ['staircase', 'rug', 'rectangle', 'square', 'bent cut']
});
staircase({
  id: 'dis-stair-12x3', title: 'Three Steps Down', diff: 3, W: 12, H: 3, n: 3, show: 'name', goalName: 'a 9 × 4 rectangle',
  text: 'A runner 12 long and 3 wide. Cut it once — the cut may bend — and make a rectangle 9 by 4.',
  goal: 'One (bent) cut, two pieces, a 9 × 4 rectangle.',
  hints: ['The rectangle is 3 shorter and 1 wider. How many steps?', 'Three steps, each 3 wide and 1 high.'],
  explain: 'With n steps, each w wide and h high, a rectangle (n + 1)w by nh becomes nw by (n + 1)h. Here w = 3, h = 1 and n = 3: 12 × 3 becomes 9 × 4. Do it again on the 9 × 4 and you reach a square: [[dis-stair-9x4]].',
  links: ['dis-stair-9x4'],
  tags: ['staircase', 'rug', 'rectangle', 'bent cut']
});
staircase({
  id: 'dis-stair-16x9', title: 'The Long Carpet', diff: 3, W: 16, H: 9, n: 3, show: 'name', goalName: 'a 12 × 12 square',
  text: 'A carpet 16 by 9 must cover a square room 12 by 12. One cut (it may turn corners), two pieces.',
  goal: 'One (bent) cut, two pieces, a 12 × 12 square.',
  hints: ['16 − 12 = 4 and 12 − 9 = 3.', 'A staircase with steps 4 wide and 3 high — three of them.'],
  explain: 'Three steps of 4 by 3: the carpet loses one step\'s width (16 − 4 = 12) and gains one step\'s height (9 + 3 = 12).',
  links: ['dis-stair-9x4'],
  tags: ['staircase', 'carpet', 'square', 'bent cut']
});
staircase({
  id: 'dis-stair-18x8', title: 'The Hall Runner', diff: 3, W: 18, H: 8, n: 2, show: 'name', goalName: 'a 12 × 12 square',
  text: 'A hall runner 18 by 8 is to be cut once, along a line that may turn corners, into two pieces that make a 12 × 12 square.',
  goal: 'One (bent) cut, two pieces, a 12 × 12 square.',
  hints: ['18 × 8 = 144 = 12 × 12.', 'Two steps, each 6 wide and 4 high.'],
  explain: 'Two steps of 6 by 4: 18 − 6 = 12 and 8 + 4 = 12.',
  links: ['dis-stair-16x9'],
  tags: ['staircase', 'carpet', 'square', 'bent cut']
});
staircase({
  id: 'dis-stair-25x16', title: 'The Great Carpet', diff: 4, W: 25, H: 16, n: 4, show: 'name', goalName: 'a 20 × 20 square',
  text: 'A carpet 25 by 16. One cut, two pieces, a 20 × 20 square.',
  goal: 'One (bent) cut, two pieces, a 20 × 20 square.',
  hints: ['Lose 5 in length, gain 4 in width.', 'Four steps, each 5 wide and 4 high.'],
  explain: 'Four steps of 5 by 4: 25 − 5 = 20 and 16 + 4 = 20.',
  links: ['dis-stair-16x9'],
  tags: ['staircase', 'carpet', 'square', 'bent cut']
});

/* ----- the lattice trick: polyominoes into squares ----- */

const LATTICE_WHY = (n, a, b) => 'The square has the area of the shape, ' + n + ' little squares, so its side is √' + n + ' — the diagonal of a ' + a + ' × ' + b + ' rectangle, since ' + a + '² + ' + b + '² = ' + n + '. ' +
  'Copies of the shape tile the whole plane, repeating along the steps (' + a + ', ' + b + ') and (−' + b + ', ' + a + '); squares of side √' + n + ' tile it with the very same repeats. Lay the grid of squares over the tiling of shapes and every shape is cut into pieces that slide, without turning, into one square. The cuts are the grid lines — which is why they run ' + a + ' across for every ' + b + ' along.';

function latticePuzzle(o) {
  const b = o.O ? null : bestLattice(o.rows, { orients: o.orients || 1 });
  if (!o.O && !b) throw new Error(o.id + ': no lattice dissection');
  const poly = b ? b.poly : polyomino(o.rows);
  const n = parseCells(o.rows).length;
  const q = Object.assign({ show: 'name', goalName: 'a square', lines: 1 }, o, {
    shape: [poly], u: b ? b.u : o.u, v: b ? b.v : o.v, O: b ? b.O : o.O
  });
  const ab = [Math.abs(q.u[0]), Math.abs(q.u[1])].sort((x, y) => x - y);
  q.maxPieces = q.maxPieces || 'sol';
  if (!q.explain) q.explain = LATTICE_WHY(n, ab[0], ab[1]);
  q.concepts = q.concepts || ['dissection', 'area'];
  const p = lattice(q);
  if (!p.goal) p.goal = 'At most ' + p.data.maxPieces + ' pieces' + (p.data.maxCuts ? ' (' + C.plural(p.data.maxCuts, 'cut') + ')' : '') + ', one square.';
  return p;
}

latticePuzzle({
  id: 'dis-s-tetromino', title: 'The Skew Four', diff: 1, rows: ['.##', '##.'],
  text: 'Four squares in a skew row, like the S of the falling-block game. One straight cut, two pieces, a 2 × 2 square.',
  goal: 'One cut, two pieces, a 2 × 2 square.', maxCuts: 1, grid: 1,
  hints: ['The cut runs along a grid line.'],
  explain: 'Cut down the middle and slide one half along: the overhangs fill each other\'s gaps. The skew tetromino tiles the plane in the same pattern as 2 × 2 squares, which is why one cut is enough.',
  tags: ['tetromino', 'square', 'warm-up']
});

latticePuzzle({
  id: 'dis-domino', title: 'The Double Square', diff: 2, rows: ['##'],
  text: 'A domino: a rectangle twice as long as it is wide. Cut it into three pieces that make a square.',
  goal: 'Two straight cuts, three pieces, one square.', maxCuts: 2,
  hints: ['The square\'s area is 2, so its side is √2: the diagonal of one half of the domino.', 'Cut along both diagonals of the halves that meet in the middle of the long side — a V.'],
  explain: 'The square of side √2 is made of the middle triangle (half the square) and the two corner triangles, which together make the other half. Rectangles 1 × 2 tile the plane in a brick pattern, and so do squares of side √2 set at 45°: that shared pattern is the reason it works.',
  tags: ['domino', 'rectangle', 'square']
});

// the Greek cross, with both cuts through its centre (the classic arrangement)
latticePuzzle({
  id: 'dis-greek-cross', title: 'The Greek Cross', diff: 3, rows: ['.#.', '###', '.#.'],
  u: [2, 1], v: [-1, 2], O: [1.5, 1.5], expectPieces: 4,
  text: 'Five equal squares make a Greek cross. Cut it with two straight cuts into four pieces that fit together to make one square.',
  goal: 'Two straight cuts, four pieces, one square.', maxCuts: 2, maxPieces: 4,
  hints: ['The square has the area of five little squares, so its side is √5 — the diagonal of a 1 × 2 rectangle.', 'Both cuts pass through the centre of the cross, each from the midpoint of one arm\'s edge to the midpoint of an edge on the opposite arm. They cross at right angles.'],
  source: 'A favourite of the Victorian puzzle books; Henry Dudeney gave a whole chapter to Greek-cross dissections in *Amusements in Mathematics* (1917).',
  tags: ['greek cross', 'cross', 'square', 'classic']
});

latticePuzzle({
  id: 'dis-pentomino-p', title: 'The P into a Square', diff: 3, rows: ['##', '##', '#.'],
  text: 'Five squares in the shape of a P. Cut it into just three pieces that make a square.',
  goal: 'Two straight cuts, three pieces, one square.', maxCuts: 2,
  hints: ['Area 5 again: the side of the square is the diagonal of a 1 × 2 rectangle.', 'One cut starts at a corner of the P.'],
  links: ['dis-greek-cross'],
  tags: ['pentomino', 'square']
});

latticePuzzle({
  id: 'dis-pentomino-y', title: 'The Y into a Square', diff: 3, rows: ['.#', '##', '.#', '.#'],
  text: 'The Y pentomino: four in a row and one to the side. Three pieces, one square.',
  goal: 'Two straight cuts, three pieces, one square.', maxCuts: 2,
  hints: ['The cuts run 2 along for every 1 across.'],
  links: ['dis-pentomino-p'],
  tags: ['pentomino', 'square']
});

latticePuzzle({
  id: 'dis-pentomino-z', title: 'The Z into a Square', diff: 3, rows: ['##.', '.#.', '.##'],
  text: 'The Z pentomino. Cut it into three pieces that make a square.',
  goal: 'Two straight cuts, three pieces, one square.', maxCuts: 2,
  hints: ['Side √5 again. The Z has a centre of symmetry — the cuts may use it.'],
  links: ['dis-pentomino-p'],
  tags: ['pentomino', 'square']
});

latticePuzzle({
  id: 'dis-diamond-13', title: 'The Stepped Diamond', diff: 3, rows: ['..#..', '.###.', '#####', '.###.', '..#..'],
  text: 'Thirteen squares stacked into a stepped diamond. Cut it into four pieces that make a square.',
  goal: 'Two straight cuts, four pieces, one square.', maxCuts: 2,
  hints: ['13 = 2² + 3²: the side of the square is the diagonal of a 2 × 3 rectangle.', 'The two cuts cross at right angles.'],
  tags: ['diamond', 'square']
});

latticePuzzle({
  id: 'dis-pentomino-i', title: 'Five in a Row', diff: 4, rows: ['#####'],
  text: 'A strip of five squares. Cut it into four pieces that make a square.',
  goal: 'Three straight cuts, four pieces, one square.', maxCuts: 3,
  hints: ['The square\'s side is √5, the diagonal of a 1 × 2 rectangle — but a strip is only 1 wide.', 'Two cuts are parallel; the third crosses them at right angles. Use the half-way marks.'],
  links: ['dis-greek-cross'],
  tags: ['pentomino', 'strip', 'square']
});

latticePuzzle({
  id: 'dis-diamond-25', title: 'The Great Diamond', diff: 4, rows: ['...#...', '..###..', '.#####.', '#######', '.#####.', '..###..', '...#...'],
  text: 'Twenty-five squares in a stepped diamond. Make a 5 × 5 square — in four pieces.',
  goal: 'Two straight cuts, four pieces, a 5 × 5 square.', maxCuts: 2, goalName: 'a 5 × 5 square',
  hints: ['The square need not stand upright: 25 = 3² + 4², and a square of side 5 can lean along a 3-4-5 diagonal.', 'Two cuts at right angles, each running 4 along for every 3 across.'],
  links: ['dis-diamond-13'],
  tags: ['diamond', 'square', '3-4-5']
});

/* ----- two squares into one ----- */

function chairShapes(a, b, top) {
  const B = [[0, 0], [b, 0], [b, b], [0, b]];
  const A = top ? [[b, 0], [b + a, 0], [b + a, a], [b, a]] : [[b, b - a], [b + a, b - a], [b + a, b], [b, b]];
  const cells = [];
  for (let x = 0; x < b; x++) for (let y = 0; y < b; y++) cells.push([x, y]);
  for (let x = b; x < b + a; x++) for (let y = top ? 0 : b - a; y < (top ? a : b); y++) cells.push([x, y]);
  return { shapes: [B, A], cells, joined: [cellsOutline(cells)] };
}

function twoSquares(o) {
  const { a, b } = o;
  let best = null;
  [false, true].forEach((top) => {
    const ch = chairShapes(a, b, top);
    [[[a, b], [-b, a]], [[b, a], [-a, b]]].forEach(([u, v]) => {
      if (!isFundamental(ch.cells, u, v)) return;
      const Os = o.perigal ? [[b / 2, b / 2]] : [];
      if (!o.perigal) for (let x = 0; x <= a + b; x += 0.5) for (let y = 0; y <= a + b; y += 0.5) Os.push([x, y]);
      Os.forEach((O) => {
        const shapes = o.perigal ? ch.shapes : ch.joined;
        const sol = latticeSolution(shapes, u, v, O);
        if (o.perigal && sol.pieces !== 5) return;
        const base = { shape: shapes, sol: { cuts: sol.cuts, place: sol.place }, target: sol.target };
        const sn = snapSettings(base);
        if (!sn) return;
        const score = sol.pieces * 100 + sol.cuts.length * 10 + (sn.grid ? (sn.grid < 0.5 ? 3 : sn.grid < 1 ? 2 : 1) : 0) + (sn.quarters ? 1 : 0) + (top ? 0.5 : 0);
        if (!best || score < best.score) best = { score, shapes, u, v, O, pieces: sol.pieces, cuts: sol.cuts.length };
      });
    });
  });
  if (!best) throw new Error(o.id + ': no two-squares dissection');
  const q = Object.assign({ show: 'name', goalName: 'one square', lines: 1, colors: ['#ffb057', '#38d9d3'], names: o.perigal ? ['Big square', 'Small square'] : ['Two squares'], concepts: ['dissection', 'area'] }, o, { shape: best.shapes, u: best.u, v: best.v, O: best.O });
  q.maxPieces = best.pieces;
  if (!o.perigal && best.pieces !== 3) throw new Error(o.id + ': ' + best.pieces + ' pieces');
  if (o.cutsLimit) q.maxCuts = best.cuts;
  return lattice(q);
}

twoSquares({
  id: 'dis-squares-1-2', title: 'Two Squares, One Square', diff: 3, a: 1, b: 2,
  text: 'A 2 × 2 square and a 1 × 1 square, cut from one card so that they stand side by side. Cut the card into three pieces that make a single square.',
  goal: 'Two straight cuts, three pieces, one square.', cutsLimit: true,
  hints: ['4 + 1 = 5: the new square\'s side is √5, the diagonal of a 1 × 2 rectangle.', 'One cut starts at the far corner of the big square; the other crosses it at a right angle.'],
  explain: 'This is Pythagoras\'s theorem cut out of card: the squares on the two short sides of a right triangle (sides 1 and 2) make the square on its long side (√5). Pairs of squares tile the plane, and so do the big squares, with the same repeats — lay one tiling on the other and the cuts appear.',
  tags: ['pythagoras', 'squares', 'square']
});
twoSquares({
  id: 'dis-squares-2-3', title: 'Pythagoras in Three Pieces', diff: 3, a: 2, b: 3,
  text: 'Squares of 3 × 3 and 2 × 2, side by side on one card. Three pieces, one square.',
  goal: 'Two straight cuts, three pieces, one square.', cutsLimit: true,
  hints: ['9 + 4 = 13, so the side is √13: the diagonal of a 2 × 3 rectangle.', 'The two cuts meet at a right angle on the edge between the squares.'],
  explain: 'The squares on the sides 2 and 3 of a right triangle make the square on its hypotenuse, √13. This three-piece cut works for any two squares.',
  links: ['dis-squares-1-2'],
  tags: ['pythagoras', 'squares', 'square']
});
twoSquares({
  id: 'dis-squares-3-4', title: 'Three, Four, Five', diff: 4, a: 3, b: 4,
  text: 'A 4 × 4 square and a 3 × 3 square on one card, side by side. Cut the card into three pieces that make a 5 × 5 square.',
  goal: 'Two straight cuts, three pieces, a 5 × 5 square.', cutsLimit: true, goalName: 'a 5 × 5 square',
  hints: ['16 + 9 = 25: the 3-4-5 triangle.', 'The 5 × 5 square leans: its sides run 4 along and 3 across.'],
  explain: 'The 3-4-5 right triangle, known to Babylonian scribes, in card: 3² + 4² = 5².',
  links: ['dis-squares-2-3'],
  tags: ['pythagoras', 'squares', '3-4-5']
});
twoSquares({
  id: 'dis-squares-1-3', title: 'The Little and the Large', diff: 5, a: 1, b: 3,
  text: 'A 3 × 3 square with a 1 × 1 square beside it, all one card. Three pieces, one square.',
  goal: 'Two straight cuts, three pieces, one square.', cutsLimit: true,
  hints: ['9 + 1 = 10: the side is the diagonal of a 1 × 3 rectangle.', 'The cuts land on quarter marks of the edges.'],
  links: ['dis-squares-1-2'],
  tags: ['pythagoras', 'squares']
});
twoSquares({
  id: 'dis-squares-2-5', title: 'Twenty-Nine', diff: 5, a: 2, b: 5,
  text: 'Squares of 5 × 5 and 2 × 2 on one card. Three pieces, one square.',
  goal: 'Two straight cuts, three pieces, one square.', cutsLimit: true,
  hints: ['25 + 4 = 29 = 2² + 5².'],
  links: ['dis-squares-2-3'],
  tags: ['pythagoras', 'squares']
});

const PERIGAL_SRC = 'Henry Perigal, an amateur mathematician of London, published this dissection in 1873.';
twoSquares({
  id: 'dis-perigal-3-4', title: 'Perigal\'s Pinwheel', diff: 3, a: 3, b: 4, perigal: true, year: 1873, source: PERIGAL_SRC,
  text: 'The big square may be cut into four pieces; the small one stays whole. The five pieces make one square.',
  goal: 'Cut only the big square: five pieces, one square.',
  hints: ['Both cuts go through the centre of the big square.', 'The cuts are at right angles, and each runs 4 along for every 3 across — parallel to the sides of the square you want.', 'The four pieces go round the small square like the sails of a windmill.'],
  explain: 'Perigal\'s proof of Pythagoras\'s theorem: two lines through the centre of the larger square, parallel to the sides of the square on the hypotenuse, cut it into four equal quarters. They slide out to the corners of the big square, and the small square drops into the hole in the middle. It works for any right triangle.',
  tags: ['pythagoras', 'perigal', 'squares', 'classic']
});
twoSquares({
  id: 'dis-perigal-2-3', title: 'Perigal Again', diff: 4, a: 2, b: 3, perigal: true, year: 1873, source: PERIGAL_SRC,
  text: 'Perigal\'s way with a 3 × 3 and a 2 × 2 square: cut the big one into four, keep the small one whole, and make one square.',
  goal: 'Cut only the big square: five pieces, one square.',
  hints: ['Two cuts through the centre of the big square, at right angles.', 'They run 3 along for every 2 across.'],
  explain: 'The same windmill as in [[dis-perigal-3-4]]: the quarters of the big square frame the small one.',
  links: ['dis-perigal-3-4'],
  tags: ['pythagoras', 'perigal', 'squares']
});
twoSquares({
  id: 'dis-perigal-1-2', title: 'The Smallest Windmill', diff: 4, a: 1, b: 2, perigal: true, year: 1873, source: PERIGAL_SRC,
  text: 'A 2 × 2 and a 1 × 1 square. Perigal\'s way: cut only the big square, into four, and make one square with all five pieces.',
  goal: 'Cut only the big square: five pieces, one square.',
  hints: ['Two cuts through the centre of the big square; each runs 2 along for every 1 across.'],
  links: ['dis-perigal-3-4', 'dis-squares-1-2'],
  tags: ['pythagoras', 'perigal', 'squares']
});

/* ----- Dudeney's haberdasher's puzzle ----- */
{
  const A = [2, 0], B = [0, 2 * S3], Cc = [4, 2 * S3];
  const Dm = G.mid(A, B), E = G.mid(B, Cc);
  const s = 2 * Math.pow(3, 0.25); // the square's side, the mean proportional of AE and EB
  // J on AC with EJ = s
  const dir = G.sub(Cc, A);
  const qa = G.dot(dir, dir), qb = 2 * G.dot(dir, G.sub(A, E)), qc = G.dot(G.sub(A, E), G.sub(A, E)) - s * s;
  const t = (-qb - Math.sqrt(qb * qb - 4 * qa * qc)) / (2 * qa);
  const J = G.add(A, G.mul(dir, t));
  const K = G.add(J, G.mul(G.norm(dir), 2)); // JK = EB = half the side of the triangle
  const foot = (P) => { const e = G.norm(G.sub(J, E)); return G.add(E, G.mul(e, G.dot(G.sub(P, E), e))); };
  const L = foot(Dm), M = foot(K);
  const shape = [[A, B, Cc]];
  const cuts = [[E, J], [Dm, L], [K, M]];
  let polys = shape;
  cuts.forEach((c) => { polys = D.cutAll(polys, c).polys; });
  const find = (pt) => polys.find((pl) => G.pointInPoly(pt, pl));
  const cen = G.centroid([A, B, Cc]);
  const pB = find(G.lerp(B, cen, 0.1)), pA = find(G.lerp(A, cen, 0.1)), pC = find(G.lerp(Cc, cen, 0.1)), pJ = find(G.lerp(G.mid(J, K), M, 0.2));
  const half = (P) => ({ x: 2 * P[0], y: 2 * P[1], rot: 180, flip: false });
  const moves = [[pB, { x: 0, y: 0, rot: 0 }], [pA, half(Dm)], [pC, half(E)], [pJ, { x: 2 * (E[0] - K[0]), y: 2 * (E[1] - K[1]), rot: 0 }]];
  const fin = moves.map(([pl, tt]) => G.placePoly(pl, tt));
  const hull = G.convexHull([].concat(...fin));
  cutPuzzle({
    id: 'dis-haberdasher', title: 'The Haberdasher\'s Puzzle', diff: 5, year: 1902,
    source: 'Henry Dudeney, first set in 1902; in *The Canterbury Puzzles* (1907). Dudeney later showed a hinged model of it to the Royal Society.',
    shape, cuts, target: [G.clean(hull, 1e-7)],
    place: moves.map(([pl, tt]) => { const a = interiorPoint(pl); return [a[0], a[1], r9(tt.x), r9(tt.y), tt.rot, 0]; }),
    snaps: [J, K, L, M], maxCuts: 3, maxPieces: 4, show: 'name', goalName: 'a square',
    text: 'The haberdasher had a piece of cloth in the shape of an equilateral triangle and wanted it cut into four pieces that would fit together into a perfect square. The pencil marks (×) on the cloth show where the cuts meet the edges.',
    goal: 'Three straight cuts, four pieces, one square.',
    hints: ['The first cut starts at the midpoint of the bottom edge and runs up to the pencil mark near the top of the right-hand side.', 'The other two cuts are short, and each meets the first cut at a right angle: one from the midpoint of the left-hand side, one from the lower pencil mark on the right.', 'Keep the piece with the bottom-left corner still. Swing the other pieces half a turn about the points where they touch it — like a chain of hinges.'],
    explain: 'Dudeney\'s cuts make a chain: the four pieces can be hinged at three points (the two midpoints and one pencil mark) and swung one way into the triangle and the other way into the square. The side of the square must be √(√3 / 4) times the side of the triangle; Dudeney found it as the mean proportional between the triangle\'s height and half its side, with a compass. In 2024 it was proved that three pieces can never do it.',
    concepts: ['dissection', 'area'], tags: ['dudeney', 'triangle', 'square', 'hinged', 'classic']
  });
}

/* ----- the other way round: cut the goal back into the start ----- */

// join straight cuts that continue each other, so one stroke does the work of two
function mergeCuts(shape, fin, cuts) {
  const same = (list) => {
    let polys = shape.map((pl) => pl.slice());
    for (const c of list) { const r = D.cutAll(polys, c); if (!r.made) return false; polys = r.polys; }
    return polys.length === fin.length && polys.every((q) => fin.some((f) => Math.abs(G.absArea(f) - G.absArea(q)) < 1e-6 && G.pointInPoly(interiorPoint(q), f)));
  };
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < cuts.length && !changed; i++) for (let j = 0; j < cuts.length && !changed; j++) {
      if (i === j || cuts[i].length !== 2 || cuts[j].length !== 2) continue;
      const [a, b] = cuts[i], [c, e] = cuts[j];
      if (Math.abs(G.cross(G.sub(b, a), G.sub(c, a))) > 1e-7 || Math.abs(G.cross(G.sub(b, a), G.sub(e, a))) > 1e-7) continue;
      const dir = G.norm(G.sub(b, a));
      const pts = [a, b, c, e].sort((p, q) => G.dot(G.sub(p, a), dir) - G.dot(G.sub(q, a), dir));
      const merged = [pts[0], pts[3]];
      const list = cuts.slice();
      list[Math.min(i, j)] = merged.map(rp);
      list.splice(Math.max(i, j), 1);
      if (same(list)) { cuts = list; changed = true; }
    }
  }
  return cuts;
}

function reverseOf(fwdId, o) {
  const f = CUT.find((q) => q.id === fwdId);
  const d = f.data;
  const sp = D.solutionPieces(d);
  const fin = sp.pieces.map((s) => s.fin);
  const cuts = mergeCuts(d.target, fin, cutsFromArrangement(d.target, fin, o));
  const place = sp.pieces.map((s) => {
    const a = interiorPoint(s.fin);
    const t = fitPiece(G.clean(s.fin, 1e-7), G.clean(s.src, 1e-7), d.rot || 45, !d.noFlip);
    if (!t) throw new Error(o.id + ': no way back for a piece');
    return [a[0], a[1], t.x, t.y, t.rot, t.flip ? 1 : 0];
  });
  const q = Object.assign({ shape: d.target, target: d.shape, cuts, place, maxPieces: fin.length, lines: d.lines, concepts: ['dissection', 'area'], links: [fwdId] }, o);
  if (o.marks) {
    const base = { kind: 'cut', shape: q.shape, target: q.target, sol: { cuts, place } };
    if (!snapSettings(base)) { const pts = []; cuts.forEach((c) => c.forEach((p) => { if (!pts.some((r) => G.dist(r, p) < 1e-7)) pts.push(p); })); q.snaps = pts; q.autoSnap = false; }
  }
  if (q.maxCuts === 'sol') q.maxCuts = cuts.length;
  const p = cutPuzzle(q);
  return p;
}

reverseOf('dis-s-tetromino', {
  id: 'dis-rev-s-tetromino', title: 'Square to Skew', diff: 1, show: 'silhouette', maxCuts: 'sol',
  text: 'Now the other way: one cut (it may turn a corner) makes this 2 × 2 square into the skew four beside it.',
  goal: 'One bent cut, two pieces: make the skew shape.',
  hints: ['The cut runs along the grid lines and turns once, in the middle.'],
  tags: ['tetromino', 'square', 'bent cut', 'reverse']
});
reverseOf('dis-hexagon', {
  id: 'dis-rev-hexagon', title: 'Rectangle to Honeycomb', diff: 2, show: 'silhouette', maxCuts: 'sol',
  text: 'Cut the rectangle into three pieces that make a regular hexagon.',
  goal: 'Two cuts, three pieces: make the hexagon.',
  hints: ['The hexagon has a point on each side; this rectangle already has one of them.', 'Cut off the two corner triangles beside the point on the right.'],
  explain: 'The reverse of [[dis-hexagon]]: the two corner triangles meet to make the missing point.',
  tags: ['hexagon', 'rectangle', 'reverse']
});
reverseOf('dis-tri-rect', {
  id: 'dis-rev-tri-rect', title: 'Put Up the Roof', diff: 2, show: 'silhouette', maxCuts: 'sol',
  text: 'Cut the rectangle into three pieces that make the triangle beside it: as wide as the rectangle and twice as tall.',
  goal: 'Two cuts, three pieces: make the triangle.',
  hints: ['Two slanting cuts from the middle of the top edge.', 'They reach the sides a quarter of the way along.'],
  explain: 'The reverse of [[dis-tri-rect]].',
  tags: ['triangle', 'rectangle', 'reverse']
});
reverseOf('dis-domino', {
  id: 'dis-rev-domino', title: 'Square to Domino', diff: 2, show: 'name', goalName: 'a rectangle twice as long as it is wide', maxCuts: 'sol',
  text: 'Cut this square into three pieces that make a rectangle twice as long as it is wide.',
  goal: 'Three pieces: a 2 : 1 rectangle.',
  hints: ['The rectangle\'s long side is the square\'s diagonal.', 'Cut along one diagonal, then cut one of the halves in two.'],
  tags: ['domino', 'square', 'reverse']
});
reverseOf('dis-pentomino-p', {
  id: 'dis-rev-pentomino-p', title: 'Square to P', diff: 3, show: 'silhouette', maxCuts: 'sol',
  text: 'A square drawn on squared paper, leaning. Cut it along the grid into three pieces that make the letter P beside it. Cuts may turn corners.',
  goal: 'Three pieces: make the P.',
  hints: ['Every cut runs along the grid lines of the paper.', 'Each cut turns one corner.'],
  tags: ['pentomino', 'square', 'bent cut', 'reverse']
});
reverseOf('dis-greek-cross', {
  id: 'dis-rev-greek-cross', title: 'Square to Greek Cross', diff: 4, show: 'name', goalName: 'a Greek cross of five squares', maxCuts: 'sol',
  text: 'A square leaning on squared paper. Cut it along the grid lines — cuts may turn corners — into four pieces that make a Greek cross: a plus sign of five equal squares.',
  goal: 'Four pieces: make a Greek cross.',
  hints: ['The cross\'s arms are one grid square wide, so every cut runs along grid lines.', 'The four pieces are all the same shape, set round the centre like a pinwheel.', 'Each piece carries one arm of the cross.'],
  explain: 'The reverse of [[dis-greek-cross]]: the same four pieces, taken out of the square instead of the cross.',
  tags: ['greek cross', 'square', 'bent cut', 'reverse']
});
reverseOf('dis-pentomino-i', {
  id: 'dis-rev-pentomino-i', title: 'Square to Strip', diff: 4, show: 'name', goalName: 'a strip of five squares', maxCuts: 'sol',
  text: 'Cut this leaning square into four pieces that make a strip five squares long and one wide.',
  goal: 'Four pieces: a 5 × 1 strip.',
  hints: ['The grid lines of the paper show you the strip\'s width.', 'Two of the cuts are parallel.'],
  tags: ['strip', 'square', 'reverse']
});
reverseOf('dis-perigal-3-4', {
  id: 'dis-rev-perigal', title: 'One Square into Two', diff: 4, show: 'silhouette', maxCuts: 'sol', year: 1873, source: PERIGAL_SRC,
  text: 'The square of side 5 is to become the 4 × 4 and 3 × 3 squares shown beside it, standing side by side — in five pieces.',
  goal: 'Five pieces: the two squares.',
  hints: ['The 3 × 3 square is already in the middle, waiting to be cut out.', 'Free the middle square first; the four pieces round it make the 4 × 4 square.'],
  explain: 'Perigal\'s dissection run backwards: the four pieces round the middle square are the quarters of the 4 × 4 square.',
  tags: ['pythagoras', 'perigal', 'squares', 'reverse']
});
reverseOf('dis-squares-1-2', {
  id: 'dis-rev-squares-1-2', title: 'One Square, Two Squares', diff: 4, show: 'silhouette', maxCuts: 'sol',
  text: 'Cut this leaning square into three pieces that make the 2 × 2 and 1 × 1 squares standing side by side.',
  goal: 'Three pieces: the two squares side by side.',
  hints: ['The cuts follow the grid.'],
  tags: ['pythagoras', 'squares', 'reverse']
});
reverseOf('dis-haberdasher', {
  id: 'dis-rev-haberdasher', title: 'The Square to the Triangle', diff: 5, show: 'name', goalName: 'an equilateral triangle', maxCuts: 'sol', marks: true, year: 1902,
  source: 'The reverse of Henry Dudeney\'s haberdasher\'s puzzle (1902).',
  text: 'Dudeney\'s famous dissection backwards: cut this square into four pieces that make an equilateral triangle. The pencil marks show where the cuts begin, end and cross.',
  goal: 'Four pieces: an equilateral triangle.',
  hints: ['One long cut crosses the square between two marks on opposite sides.', 'The two short cuts meet the long one at right angles.'],
  tags: ['dudeney', 'triangle', 'square', 'hinged', 'reverse']
});

/* =====================================================================
 * writing the files
 * =================================================================== */

function puzzleText(p) {
  const keys = Object.keys(p).filter((k) => k !== 'data');
  let s = '  {';
  s += keys.map((k) => ' ' + k + ': ' + JSON.stringify(p[k])).join(',');
  s += ',\n    data: ' + JSON.stringify(p.data) + ' }';
  return s;
}

function writeFamily(file, meta, list) {
  const lines = ['/* The Puzzle Cabinet · ' + file + ' — made by tools/gen/dissect.js */', 'Cabinet.family(' + JSON.stringify(meta, null, 1).replace(/\n\s*/g, ' ') + ', ['];
  lines.push(list.map(puzzleText).join(',\n'));
  lines.push(']);');
  const text = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, file), text);
  const spread = [0, 0, 0, 0, 0, 0];
  list.forEach((p) => spread[p.diff]++);
  console.log(file + ': ' + list.length + ' puzzles, ' + Math.round(text.length / 1024) + ' KB; by difficulty ' + spread.slice(1).join('/'));
}

const byDiff = (list) => list.map((p, i) => [p, i]).sort((a, b) => a[0].diff - b[0].diff || a[1] - b[1]).map((x) => x[0]);

writeFamily('data/dissections.js', {
  id: 'dissections', engine: 'dissect', cat: 'shapes', name: 'Cut and rearrange', order: 3,
  blurb: 'Cut a shape with the knife — straight cuts, or bent ones — and make another shape from the pieces: a square from a cross, one square from two, a square from a triangle.',
  origin: { year: 1873, who: 'From Euclid to Perigal and Dudeney', note: 'Cutting one figure into pieces that make another is as old as geometry — it is how the Greeks, the Chinese and the Indians showed that areas are equal. Victorian amateurs such as Henry Perigal turned it into an art, and Henry Dudeney made it a newspaper sensation.' },
  concepts: ['dissection', 'area']
}, byDiff(CUT));

/* =====================================================================
 * GIVEN PIECES
 * =================================================================== */

const PS = [];
function piecePuzzle(o) {
  const data = { kind: 'pieces' };
  if (o.set) data.set = o.set;
  if (o.pieces) data.pieces = o.pieces.map((q) => Object.assign({}, q, { poly: rpoly(q.poly) }));
  if (o.setName) data.setName = o.setName;
  data.sol = o.sol.map((pl) => [pl[0], r9(pl[1]), r9(pl[2]), G.normDeg(Math.round(pl[3] || 0)), pl[4] ? 1 : 0]);
  ['given', 'show', 'rot', 'any'].forEach((k) => { if (o[k] != null) data[k] = o[k]; });
  const p = { id: o.id, title: o.title, diff: o.diff };
  ['year', 'source'].forEach((k) => { if (o[k] != null) p[k] = o[k]; });
  p.text = o.text;
  p.goal = o.goal || ('Cover the silhouette with all ' + (o.nPieces || '') + ' pieces.').replace('all  pieces', 'all the pieces');
  ['hints', 'explain', 'links', 'concepts', 'tags'].forEach((k) => { if (o[k] != null) p[k] = o[k]; });
  p.data = data;
  const v = ENG.verify(p);
  if (!v.ok) throw new Error(o.id + ': ' + v.err);
  PS.push(p);
  return p;
}

/* ----- the T-puzzle: figures found by a search over edge-to-edge assemblies (45° turns) ----- */
const T_SRC = 'The T-puzzle was a popular advertising give-away around 1900; the earliest known version, from Lash\'s Bitters, dates from 1898.';
const TFIG = {
  T: [[3, 0, 0, 0, 0], [0, 0, 0, 0, 0], [1, 0, 0, 0, 0], [2, 0, 0, 0, 0]],
  arrow: [[3, 0, 0, 0, 0], [2, -1, -1, 0, 0], [1, -3, 1, 180, 1], [0, 0, 1, 90, 0]],
  house: [[3, 0, 0, 315, 0], [0, 2.828427125, -1.414213562, 45, 0], [1, 0, 0, 315, 0], [2, 0, 1.414213562, 225, 0]],
  hexagon: [[3, 0, 0, 315, 0], [0, 2.828427125, -1.414213562, 45, 0], [1, 0, 0, 315, 0], [2, 3.535533906, -2.121320344, 45, 1]],
  parallelogram: [[3, 0, 0, 0, 0], [0, 2.5, 1, 180, 0], [1, 5.5, 1, 180, 0], [2, 6, 3, 90, 1]],
  hourglass: [[3, 0, 0, 180, 0], [0, -1, -1, 180, 0], [1, 0, 0, 180, 0], [2, 1, -4, 90, 0]],
  stairs: [[3, 0, 0, 180, 0], [0, -1, -1, 180, 0], [1, 0, 0, 180, 0], [2, 1, 1, 180, 0]],
  tree: [[3, 0, 0, 315, 0], [0, 3.535533906, -0.707106781, 135, 0], [1, 0, 0, 315, 0], [2, -2.121320344, -0.707106781, 225, 1]],
  cottage: [[3, 0, 0, 0, 0], [0, 0, 0, 0, 0], [1, -3, 1, 180, 1], [2, 3, 3, 90, 1]],
  cat: [[3, 0, 0, 270, 0], [0, 1, -1, 270, 0], [1, 2, -4, 270, 1], [2, -1, 1, 270, 0]],
  funnel: [[3, 0, 0, 0, 0], [0, 2.5, 1, 180, 0], [1, 5.5, 0, 0, 1], [2, 1, 5, 180, 1]],
  seven: [[3, 0, 0, 0, 0], [0, 3, 1, 90, 0], [1, 0, 0, 0, 0], [2, 4, 0, 0, 1]],
  tick: [[3, 0, 0, 0, 0], [0, 3, 1, 90, 0], [1, 0, 0, 0, 0], [2, 3, 2.414213562, 225, 0]],
  arrowhead: [[3, 0, 0, 0, 0], [1, 0, 0, 0, 0], [2, -1, 1, 270, 0], [0, 1, -1, 270, 0]],
  corner: [[3, 0, 0, 0, 0], [0, 3, 1, 90, 0], [1, 0, 0, 0, 0], [2, -1, -1, 0, 0]],
  signpost: [[3, 0, 0, 270, 0], [0, 1, -3, 0, 0], [1, 0, -5.5, 270, 1], [2, 2, -3.5, 90, 0]],
  hat: [[3, 0, 0, 180, 0], [0, 0, 0, 180, 0], [1, -5, -1, 180, 1], [2, -0.5, 1, 90, 1]],
  boomerang: [[3, 0, 0, 90, 0], [2, 0, 6, 180, 0], [1, 0, 7.5, 90, 1], [0, -1, 3.5, 0, 0]],
  boat: [[3, 0, 0, 180, 0], [1, 0, 0, 180, 0], [2, -7, 1, 270, 0], [0, -5, -1, 270, 0]],
  flag: [[3, 0, 0, 0, 0], [0, 1, 1, 0, 0], [1, 5, 2, 180, 0], [2, -1, -1, 0, 0]]
};
// exact values for the √2 positions
Object.values(TFIG).forEach((sol) => sol.forEach((pl) => { for (let k = 1; k <= 2; k++) { const v = pl[k], m = Math.round(v / (S2 / 2)); if (Math.abs(v - m * S2 / 2) < 1e-6 && Math.abs(v - Math.round(v * 2) / 2) > 1e-6) pl[k] = m * S2 / 2; } }));
function tFigure(key, o) {
  return piecePuzzle(Object.assign({ set: 'T', sol: TFIG[key], nPieces: 'four', concepts: ['dissection'], tags: ['t-puzzle'] }, o));
}
tFigure('T', {
  id: 'ps-t-the-t', title: 'The T', diff: 4, source: T_SRC,
  text: 'Four pieces: a triangle, two trapezoids and a pentagon with a notch. Make the capital T. It looks like a minute\'s work.',
  goal: 'Make the T with all four pieces.',
  hints: ['The awkward pentagon is the key: it does not sit square with the T. Turn it so that its long slanting edge runs across the T.', 'The pentagon\'s notch holds the corner where the bar meets the stem.', 'The long trapezoid is the bottom of the stem; the short trapezoid and the triangle finish the two ends of the bar.'],
  explain: 'The trap is that everyone tries to lay the pentagon along the bar or the stem. It belongs diagonally across the join, with its notch making the inside corner of the T — the one placement nobody tries first.',
  tags: ['t-puzzle', 'classic', 'letter']
});
tFigure('parallelogram', { id: 'ps-t-parallelogram', title: 'The Long Lozenge', diff: 2, text: 'With the four pieces of the T-puzzle, make this long parallelogram.', hints: ['Every slanting edge of the pieces runs at 45°, and so do the ends of the parallelogram.'] });
tFigure('house', { id: 'ps-t-house', title: 'The House', diff: 2, text: 'The T-puzzle pieces make a house with a pointed roof.', hints: ['The roof is made of the slanting edges of two pieces.'] });
tFigure('stairs', { id: 'ps-t-stairs', title: 'The Staircase', diff: 2, text: 'Three steps up.' });
tFigure('corner', { id: 'ps-t-corner', title: 'The Set Square', diff: 2, text: 'A carpenter\'s corner, square outside and slanted inside.' });
tFigure('seven', { id: 'ps-t-seven', title: 'The Seven', diff: 2, text: 'The figure 7.' });
tFigure('hat', { id: 'ps-t-hat', title: 'The Hat', diff: 2, text: 'A hat with a wide brim.' });
tFigure('flag', { id: 'ps-t-flag', title: 'The Pennant', diff: 2, text: 'A flag on its pole.' });
tFigure('hexagon', { id: 'ps-t-hexagon', title: 'The Gem', diff: 3, text: 'A cut stone with six sides.' });
tFigure('arrow', { id: 'ps-t-arrow', title: 'The Arrow', diff: 3, text: 'An arrow pointing up, with a feathered head.' });
tFigure('cottage', { id: 'ps-t-cottage', title: 'The Cottage', diff: 3, text: 'A cottage with deep eaves.' });
tFigure('tick', { id: 'ps-t-tick', title: 'The Tick', diff: 3, text: 'A tick, as the teacher makes it.' });
tFigure('funnel', { id: 'ps-t-funnel', title: 'The Funnel', diff: 3, text: 'A kitchen funnel.' });
tFigure('arrowhead', { id: 'ps-t-arrowhead', title: 'The Arrowhead', diff: 3, text: 'An arrowhead pointing left.' });
tFigure('signpost', { id: 'ps-t-signpost', title: 'The Signpost', diff: 3, text: 'This way →' });
tFigure('boat', { id: 'ps-t-boat', title: 'The Barge', diff: 3, text: 'A flat barge with a sunken deck.' });
tFigure('hourglass', { id: 'ps-t-hourglass', title: 'The Hourglass', diff: 4, text: 'An hourglass — or a letter H lying down, if you tilt your head.' });
tFigure('tree', { id: 'ps-t-tree', title: 'The Fir Tree', diff: 4, text: 'A little fir tree.' });
tFigure('cat', { id: 'ps-t-cat', title: 'The Cat\'s Head', diff: 4, text: 'A cat\'s head, ears up.' });
tFigure('boomerang', { id: 'ps-t-boomerang', title: 'The Boomerang', diff: 4, text: 'A boomerang in flight.' });

/* ----- the Stomachion ----- */
const STO = D.SETS.stomachion.pieces.map((q) => q.poly);
const STO_SRC = 'Archimedes, the Stomachion (3rd century BC), known from a fragment in the Archimedes Palimpsest and an Arabic manuscript.';
const STO_WHY = 'Archimedes seems to have asked how many ways the fourteen pieces make the square. Bill Cutler counted them by computer in 2003: 536, not counting turns and reflections of the whole square.';
const stoId = STO.map((pl, i) => [i, 0, 0, 0, 0]);
function stoTile(region, seed) {
  for (let k = 0; k < 4; k++) {
    const r = tileRegion(region, STO, { max: 1, nodeLimit: 3e5, shuffle: C.rng(seed + k * 1001) });
    if (r.length) return r[0];
  }
  const r = tileRegion(region, STO, { max: 1, nodeLimit: 3e6 });
  if (!r.length) throw new Error('no stomachion tiling for seed ' + seed);
  return r[0];
}
piecePuzzle({
  id: 'ps-sto-half', title: 'Half a Stomachion', diff: 1, set: 'stomachion', sol: stoId, given: [0, 1, 4, 10, 11, 12, 13], source: STO_SRC,
  text: 'Archimedes\' square puzzle of fourteen pieces. The left half is already in the box; fit the other seven pieces into the right half.',
  goal: 'Fill the square: the seven loose pieces go in the right half.',
  hints: ['The biggest loose piece (a quadrilateral) fills the top-right corner.'],
  tags: ['stomachion', 'archimedes', 'square'], concepts: ['dissection', 'exact-cover']
});
piecePuzzle({
  id: 'ps-sto-right', title: 'The Right-Hand Half', diff: 2, set: 'stomachion', sol: stoId, given: [2, 3, 5, 6, 7, 8, 9], source: STO_SRC,
  text: 'This time the right half is done. Fill the left half with the other seven pieces.',
  goal: 'Fill the square: seven pieces in the left half.',
  hints: ['The long thin triangle stands along the left edge.', 'The five-sided piece sits at the bottom, against the middle line.'],
  tags: ['stomachion', 'archimedes', 'square'], concepts: ['dissection', 'exact-cover'], links: ['ps-sto-half']
});
piecePuzzle({
  id: 'ps-sto-four', title: 'Four Pieces Placed', diff: 3, set: 'stomachion', sol: stoId, given: [2, 10, 13, 8], source: STO_SRC,
  text: 'Four of the fourteen pieces are in their places. Put in the other ten.',
  goal: 'Fill the square with the ten loose pieces.',
  tags: ['stomachion', 'archimedes', 'square'], concepts: ['dissection', 'exact-cover'], links: ['ps-sto-right']
});
piecePuzzle({
  id: 'ps-sto-square', title: 'The Stomachion', diff: 4, set: 'stomachion', sol: stoId, year: -250, source: STO_SRC,
  text: 'Fourteen pieces cut from a square — triangles, quadrilaterals and one pentagon. Put the square back together. (There are 536 ways; any one will do.)',
  goal: 'Make the square with all fourteen pieces.',
  hints: ['The square splits into two halves down the middle: each half is made of seven pieces.', 'The two long thin triangles stand along opposite edges.'],
  explain: STO_WHY,
  tags: ['stomachion', 'archimedes', 'square', 'classic'], concepts: ['dissection', 'exact-cover'], links: ['ps-sto-four']
});
// other ways to make the square: pieces fixed where Archimedes did not put them
{
  const box = [[0, 0], [12, 0], [12, 12], [0, 12]];
  const idKey = JSON.stringify(stoId);
  const found = [];
  for (let s = 1; s < 400 && found.length < 3; s++) {
    const sol = stoTile(box, 101 + s * 7);
    // skip Archimedes' own arrangement and its turns (many pieces unmoved)
    const same = sol.filter((pl) => pl[1] === 0 && pl[2] === 0 && !pl[3] && !pl[4]).length;
    if (same > 6 || JSON.stringify(sol) === idKey) continue;
    if (found.some((f) => f.filter((pl, i) => JSON.stringify(pl) === JSON.stringify(sol[i])).length > 8)) continue;
    found.push(sol);
  }
  const titles = ['Another of the 536', 'A Third Square', 'A Fourth Square'];
  found.forEach((sol, k) => {
    // fix the three largest pieces where this solution puts them
    const big = sol.map((pl) => pl[0]).sort((a, b) => G.absArea(STO[b]) - G.absArea(STO[a])).slice(0, 3);
    piecePuzzle({
      id: 'ps-sto-other-' + (k + 1), title: titles[k], diff: k === 0 ? 3 : 4, set: 'stomachion', sol, given: big, source: STO_SRC,
      text: 'The square can be made in 536 ways. Here the three largest pieces have been put down in one of the others — finish that square.',
      goal: 'Complete the square around the three fixed pieces.',
      explain: STO_WHY,
      tags: ['stomachion', 'archimedes', 'square'], concepts: ['dissection', 'exact-cover'], links: ['ps-sto-square']
    });
  });
}
const STO_FIGS = [
  ['strip', 'The Long Strip', 3, [[0, 0], [24, 0], [24, 6], [0, 6]], 'A strip 24 long and 6 wide — the square\'s area stretched out.'],
  ['triangle', 'The Great Triangle', 4, [[0, 12], [24, 12], [12, 0]], 'A triangle with a base of 24 and a height of 12.'],
  ['rhombus', 'The Rhombus', 4, [[0, 6], [12, 0], [24, 6], [12, 12]], 'A rhombus twice as wide as it is tall.'],
  ['parallelogram', 'The Leaning Square', 4, [[0, 0], [12, 0], [18, 12], [6, 12]], 'A parallelogram: the square, pushed over.'],
  ['lean', 'Pushed Over Further', 5, [[0, 12], [12, 12], [24, 0], [12, 0]], 'A parallelogram leaning at 45°.'],
  ['slab', 'The Slanted Slab', 4, [[0, 6], [24, 6], [30, 0], [6, 0]], 'A long, flat parallelogram.'],
  ['trapezoid', 'The Trapezoid', 4, [[0, 0], [18, 0], [12, 12], [6, 12]], 'A trapezoid, 18 across the top and 6 across the bottom.'],
  ['ramp', 'The Ramp', 4, [[0, 0], [6, 0], [18, 12], [0, 12]], 'A ramp: square on the left, sloping on the right.'],
  ['house', 'The Stone House', 5, [[0, 6], [6, 0], [12, 6], [12, 15], [0, 15]], 'A tall house with a pointed roof.'],
  ['arrow', 'The Arrow', 5, [[0, 6], [12, 0], [12, 3], [24, 3], [24, 9], [12, 9], [12, 12]], 'An arrow pointing left.'],
  ['step', 'The Step', 5, [[0, 0], [12, 0], [12, 6], [18, 6], [18, 12], [6, 12], [6, 6], [0, 6]], 'Two blocks, stepped.'],
  ['ell', 'The Letter L', 5, [[0, 0], [6, 0], [6, 12], [12, 12], [12, 18], [0, 18]], 'A capital L.']
];
STO_FIGS.forEach(([slug, title, diff, region, text], k) => {
  piecePuzzle({
    id: 'ps-sto-' + slug, title, diff, set: 'stomachion', sol: stoTile(region, 900 + k * 13), source: STO_SRC,
    text: text + ' Use all fourteen pieces of the Stomachion.', goal: 'Cover the silhouette with all fourteen pieces.',
    tags: ['stomachion', 'archimedes'], concepts: ['dissection', 'exact-cover'], links: ['ps-sto-square']
  });
});

/* ----- the Egg of Columbus ----- */
const EGG_SRC = 'The Egg of Columbus puzzle: the earliest known sets were made by the German toy maker Richter.';
const eggId = D.SETS.egg.pieces.map((q, i) => [i, 0, 0, 0, 0]);
piecePuzzle({
  id: 'ps-egg-half', title: 'The Egg, Half Done', diff: 2, set: 'egg', sol: eggId, given: [0, 1, 3, 5, 7], source: EGG_SRC,
  text: 'Nine pieces cut from an egg — with curves! The right-hand side is still in its place. Finish the egg.',
  goal: 'Complete the egg.',
  hints: ['Each loose piece is the mirror image of one already in place.'],
  tags: ['egg', 'curves'], concepts: ['dissection', 'symmetry']
});
piecePuzzle({
  id: 'ps-egg-three', title: 'Three in Place', diff: 3, set: 'egg', sol: eggId, given: [0, 3, 4], source: EGG_SRC,
  text: 'The round bottom of the egg is done. Build the top half from the six loose pieces.',
  goal: 'Complete the egg.',
  hints: ['The two right triangles meet along the middle, making a larger triangle with its point up.', 'The curved wings lean on the triangles; the small sectors make the tip.'],
  tags: ['egg', 'curves'], concepts: ['dissection', 'symmetry'], links: ['ps-egg-half']
});
piecePuzzle({
  id: 'ps-egg', title: 'The Egg of Columbus', diff: 4, set: 'egg', sol: eggId, source: EGG_SRC,
  text: 'Put the egg together: nine pieces, straight edges and curved ones. Some pieces must be turned over.',
  goal: 'Make the egg with all nine pieces.',
  hints: ['The egg is symmetrical: the pieces come in mirror pairs, with one small triangle on the middle line.', 'The lower half is a half-disc: two quarter rounds and the small triangle in the middle.'],
  explain: 'The egg is drawn with compasses: a half-circle below, two big arcs for the sides (each centred at the far end of the diameter) and a small arc for the tip. The straight cuts follow the construction lines, which is why the pieces fit so neatly.',
  tags: ['egg', 'curves', 'classic'], concepts: ['dissection', 'symmetry'], links: ['ps-egg-three']
});

/* ----- Bhaskara's "Behold!" ----- */
function bhaskara(a, b) {
  const tri = [[0, 0], [b, 0], [0, a]];
  const sq = [[0, 0], [b - a, 0], [b - a, b - a], [0, b - a]];
  const pieces = [tri, tri, tri, tri, sq].map((poly, i) => ({ poly, color: i < 4 ? ['#ffb057', '#38d9d3', '#b388ff', '#ff7eb6'][i] : '#ffd166', name: i < 4 ? 'right triangle' : 'little square' }));
  const big = [[0, a], [b, 0], [a + b, b], [a, a + b]];
  const chair = [[0, 0], [b, 0], [b, b - a], [a + b, b - a], [a + b, b], [0, b]];
  const s1 = tileRegion(big, pieces.map((q) => q.poly), { max: 1, samples: 4 });
  const s2 = tileRegion(chair, pieces.map((q) => q.poly), { max: 1, samples: 4 });
  if (!s1.length || !s2.length) throw new Error('bhaskara ' + a + ',' + b);
  return { pieces, big: s1[0], chair: s2[0] };
}
{
  const BH_SRC = 'A figure traditionally linked with Bhaskara, the Indian mathematician of the 12th century, who is said to have written under it just one word: "Behold!"';
  const b12 = bhaskara(1, 2), b34 = bhaskara(3, 4);
  piecePuzzle({
    id: 'ps-bhaskara-square', title: 'Behold! (the big square)', diff: 1, pieces: b12.pieces, sol: b12.big, setName: 'Bhaskara', source: BH_SRC, rot: 90,
    text: 'Four right triangles and a little square make a leaning square. Build it.', goal: 'Make the square with all five pieces.',
    hints: ['The triangles go round the little square like the sails of a windmill.'],
    tags: ['bhaskara', 'pythagoras'], concepts: ['dissection', 'area']
  });
  piecePuzzle({
    id: 'ps-bhaskara-chair', title: 'Behold! (the two squares)', diff: 2, pieces: b12.pieces, sol: b12.chair, setName: 'Bhaskara', source: BH_SRC, rot: 90,
    text: 'The same five pieces now make a 2 × 2 and a 1 × 1 square side by side.', goal: 'Make the two squares with all five pieces.',
    hints: ['Two triangles make a 1 × 2 rectangle.'],
    explain: 'The same pieces make the square on the long side of the triangle and the two squares on its short sides — so those areas are equal: Pythagoras\'s theorem, with no words at all.',
    tags: ['bhaskara', 'pythagoras'], concepts: ['dissection', 'area'], links: ['ps-bhaskara-square']
  });
  piecePuzzle({
    id: 'ps-bhaskara-square-5', title: 'Behold! Three, Four, Five', diff: 2, pieces: b34.pieces, sol: b34.big, setName: 'Bhaskara', source: BH_SRC, rot: 90,
    text: 'Four 3-4-5 triangles and a unit square: make the 5 × 5 square, leaning.', goal: 'Make the square with all five pieces.',
    tags: ['bhaskara', 'pythagoras', '3-4-5'], concepts: ['dissection', 'area'], links: ['ps-bhaskara-chair']
  });
  piecePuzzle({
    id: 'ps-bhaskara-chair-5', title: 'Behold! Nine and Sixteen', diff: 3, pieces: b34.pieces, sol: b34.chair, setName: 'Bhaskara', source: BH_SRC, rot: 90,
    text: 'With the same five pieces, make a 4 × 4 square and a 3 × 3 square side by side.', goal: 'Make the two squares with all five pieces.',
    hints: ['Pairs of triangles make 3 × 4 rectangles.', 'The little square fills the gap where the two rectangles overlap the corner.'],
    explain: '25 = 16 + 9, cut and rearranged: the proof of Pythagoras\'s theorem for the 3-4-5 triangle.',
    tags: ['bhaskara', 'pythagoras', '3-4-5'], concepts: ['dissection', 'area'], links: ['ps-bhaskara-square-5']
  });
}

/* ----- the pieces of famous dissections, ready cut ----- */
function precut(fwdId, o) {
  const f = CUT.find((q) => q.id === fwdId);
  const sp = D.solutionPieces(f.data);
  const pieces = sp.pieces.map((s, i) => ({ poly: s.src, color: D.COLORS[i % D.COLORS.length], name: 'piece ' + (i + 1) }));
  const solA = sp.pieces.map((s, i) => [i, 0, 0, 0, 0]);
  const solB = sp.pieces.map((s, i) => [i, s.t.x, s.t.y, s.t.rot, s.t.flip ? 1 : 0]);
  return { pieces, solA, solB, rot: f.data.rot || 45 };
}
{
  const gc = precut('dis-greek-cross');
  piecePuzzle({ id: 'ps-cross-square', title: 'Four Pieces: the Square', diff: 2, pieces: gc.pieces, sol: gc.solB, setName: 'Greek cross pieces', rot: gc.rot, text: 'These four equal pieces were cut from a Greek cross. Make them into a square.', goal: 'Make the square with all four pieces.', hints: ['The pieces only slide — no turning needed. Their right angles become the corners of the square.'], links: ['dis-greek-cross'], tags: ['greek cross', 'square'], concepts: ['dissection'] });
  piecePuzzle({ id: 'ps-cross-cross', title: 'Four Pieces: the Cross', diff: 2, pieces: gc.pieces, sol: gc.solA, setName: 'Greek cross pieces', rot: gc.rot, text: 'The same four pieces make a Greek cross, too.', goal: 'Make the cross with all four pieces.', hints: ['The four right angles meet in the middle of the cross.'], links: ['ps-cross-square'], tags: ['greek cross'], concepts: ['dissection'] });
  const hb = precut('dis-haberdasher');
  piecePuzzle({ id: 'ps-haber-square', title: 'The Haberdasher\'s Square', diff: 3, pieces: hb.pieces, sol: hb.solB, setName: 'Dudeney\'s pieces', rot: hb.rot, year: 1902, source: 'Henry Dudeney\'s haberdasher\'s puzzle (1902).', text: 'Dudeney\'s four pieces, cut from an equilateral triangle. Make them into a square.', goal: 'Make the square with all four pieces.', hints: ['Two pieces keep the way they were cut; the other two turn half a turn.'], links: ['dis-haberdasher'], tags: ['dudeney', 'square'], concepts: ['dissection'] });
  piecePuzzle({ id: 'ps-haber-triangle', title: 'The Haberdasher\'s Triangle', diff: 3, pieces: hb.pieces, sol: hb.solA, setName: 'Dudeney\'s pieces', rot: hb.rot, year: 1902, source: 'Henry Dudeney\'s haberdasher\'s puzzle (1902).', text: 'And back: make the four pieces into an equilateral triangle.', goal: 'Make the triangle with all four pieces.', links: ['ps-haber-square'], tags: ['dudeney', 'triangle'], concepts: ['dissection'] });
  const pg = precut('dis-perigal-3-4');
  piecePuzzle({ id: 'ps-perigal-square', title: 'Perigal\'s Pieces', diff: 2, pieces: pg.pieces, sol: pg.solB, setName: 'Perigal\'s pieces', rot: pg.rot, year: 1873, source: PERIGAL_SRC, text: 'Four quarters of a 4 × 4 square and a whole 3 × 3 square. Make one square of side 5.', goal: 'Make the square with all five pieces.', hints: ['The 3 × 3 square goes in the middle, set at an angle.'], links: ['dis-perigal-3-4'], tags: ['perigal', 'pythagoras'], concepts: ['dissection', 'area'] });
}

/* ----- shapes cut at random, to put back together (the endless drawer's kind) ----- */
{
  const seeds = [[1, 11], [1, 23], [2, 5], [2, 17], [3, 8], [3, 31], [4, 2], [4, 19], [5, 7], [5, 13]];
  const seen = new Set();
  seeds.forEach(([lv, seed], k) => {
    let g = null;
    for (let s = seed; !g && s < seed + 50; s++) { g = ENG.generate(C.rng('ps-cut:' + lv + ':' + s), lv); if (g && seen.has(g.title)) g = null; }
    seen.add(g.title);
    piecePuzzle(Object.assign({ id: 'ps-cut-' + (k + 1), pieces: g.data.pieces, sol: g.data.sol, setName: g.data.setName, rot: 45, tags: ['cut', 'random'], concepts: ['dissection'] }, { title: g.title, diff: g.diff, text: g.text, goal: g.goal }));
  });
}

writeFamily('data/piece-sets.js', {
  id: 'piece-sets', engine: 'dissect', cat: 'shapes', name: 'Classic piece puzzles', order: 8,
  blurb: 'The T-puzzle, Archimedes\' Stomachion, the Egg of Columbus and other sets of pieces: cover each silhouette with all of them.',
  origin: { year: -250, who: 'From Archimedes to the advertising give-aways of 1900', note: 'The oldest dissection puzzle known is the Stomachion, fourteen pieces of a square discussed by Archimedes. Two thousand years later, sets of card or wooden pieces — the T, the Egg — were given away by the thousand as advertisements.' },
  concepts: ['dissection', 'exact-cover']
}, byDiff(PS));
