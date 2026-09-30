/* The Puzzle Cabinet · tools/gen/tangram-figures.js
 *
 *   node tools/gen/tangram-figures.js        writes data/tangram-figures.js
 *
 * Tangram figures for the lead's tangram engine (engines/tangram.js). Every
 * figure is built so that it is solvable by construction:
 *
 *  - outline figures: a silhouette drawn on the lattice (edges horizontal,
 *    vertical or at 45°) is filled by exact cover (js/lib/dlx.js) over sample
 *    points in the quarter-cells. Frame 'A' uses the engine's own units (the
 *    square piece is a diamond, the big triangles' long sides lie flat);
 *    frame 'B' is the same lattice turned 45° and drawn in units of √2/2 (the
 *    square piece stands upright, the big triangles' short sides lie flat).
 *  - built figures: pieces placed one by one, corner to corner (45° turns
 *    allowed, so the two frames can mix).
 *
 * Each figure is checked: all seven pieces, no overlaps, one connected
 * silhouette. The thirteen convex figures come from a search over convex
 * lattice polygons of area 16 (Wang & Hsiung, 1942, proved there are 13).
 */
'use strict';
const fs = require('fs');
const path = require('path');
const { core, ROOT } = require('../load');
const C = core();
require(path.join(ROOT, 'js/lib/dlx.js'));
require(path.join(ROOT, 'engines/tangram.js'));
require(path.join(ROOT, 'engines/dissect.js'));
const H = require('./dissect.js');
const G = C.geom;
const SET = C.tangramSets.tangram;
const TYPES = SET.types;
const ENG = C.engines.tangram;
const s = Math.SQRT1_2; // √2 / 2

const LIST = [];
for (const t in TYPES) for (let n = 0; n < TYPES[t].n; n++) LIST.push(t);
const POLYS = LIST.map((t) => TYPES[t].poly);
const QO = [[0.5, 1 / 6], [5 / 6, 0.5], [0.5, 5 / 6], [1 / 6, 0.5]];
const r9 = (v) => Math.round(v * 1e9) / 1e9;

/* ---------- placements ---------- */

// the engine placement [type, x, y, rot, flip] of a world polygon (engine units)
function fitTangram(poly, type) {
  const types = type ? [type] : Object.keys(TYPES);
  for (const t of types) {
    const lp = TYPES[t].poly;
    if (lp.length !== poly.length || Math.abs(G.absArea(lp) - G.absArea(poly)) > 1e-6) continue;
    for (const flip of [0, 1]) for (let rot = 0; rot < 360; rot += 45) {
      const m = G.placePoly(lp, { x: 0, y: 0, rot, flip: !!flip });
      for (const q of poly) {
        const tx = q[0] - m[0][0], ty = q[1] - m[0][1];
        const fin = m.map((p) => [p[0] + tx, p[1] + ty]);
        if (fin.every((p) => poly.some((r) => G.dist(p, r) < 1e-6))) return [t, r9(tx), r9(ty), rot, flip];
      }
    }
  }
  return null;
}

// fill a lattice outline with the seven pieces; frame B outlines are in units of √2/2, turned 45°
function solveOutline(outline, frame, seed) {
  const pts = outline.map((p) => p.slice());
  if (Math.abs(G.absArea(pts) - (frame === 'B' ? 32 : 16)) > 1e-9) return { err: 'area ' + G.absArea(pts) };
  let polys;
  if (frame === 'B') {
    // in frame B the pieces are: ST legs 2, LT legs 4, MT hypotenuse 4, SQ 2 × 2, PA sides 2 and 2√2
    const B = { LT: [[0, 0], [4, 0], [0, 4]], MT: [[0, 0], [4, 0], [2, 2]], ST: [[0, 0], [2, 0], [0, 2]], SQ: [[0, 0], [2, 0], [2, 2], [0, 2]], PA: [[0, 0], [2, 0], [4, 2], [2, 2]] };
    const r = H.tileRegion(pts, LIST.map((t) => B[t]), { max: 1, offs: QO, nodeLimit: 3e6, shuffle: seed ? C.rng(seed) : null });
    if (!r.length) return { err: r.aborted ? 'search gave up' : 'not tileable' };
    // back to engine units: scale by √2/2 (the pieces stand at 45° to the engine's own lattice)
    polys = r[0].map((m) => G.placePoly(B[LIST[m[0]]], { x: m[1], y: m[2], rot: m[3], flip: !!m[4] }).map((p) => [p[0] * s, p[1] * s]));
  } else {
    const r = H.tileRegion(pts, POLYS, { max: 1, offs: QO, nodeLimit: 3e6, shuffle: seed ? C.rng(seed) : null });
    if (!r.length) return { err: r.aborted ? 'search gave up' : 'not tileable' };
    polys = r[0].map((m) => G.placePoly(POLYS[m[0]], { x: m[1], y: m[2], rot: m[3], flip: !!m[4] }));
  }
  return { pieces: polys.map((pl, i) => fitTangram(pl, null)) };
}

/* ---------- built figures: corner to corner ---------- */
function builder() {
  const placed = [];
  const api = {
    // put piece `type` turned by rot (multiple of 45) and flipped, so that its corner k lands on point P
    put(type, rot, flip, k, P) {
      const lp = TYPES[type].poly;
      const m = G.placePoly(lp, { x: 0, y: 0, rot, flip: !!flip });
      const x = P[0] - m[k][0], y = P[1] - m[k][1];
      const h = { type, pl: [type, r9(x), r9(y), rot, flip ? 1 : 0], poly: m.map((p) => [p[0] + x, p[1] + y]) };
      h.v = (i) => h.poly[((i % h.poly.length) + h.poly.length) % h.poly.length].slice();
      h.mid = (i, j) => G.mid(h.v(i), h.v(j));
      placed.push(h);
      return h;
    },
    /* glue piece `type` with its edge e (corner e to corner e+1) along the segment A→B,
     * on whichever side is free. opts.at: 'A' (default) | 'B' | 'mid' | a distance from A;
     * opts.flip: force 0 or 1 */
    glue(type, e, A, B, opts) {
      opts = opts || {};
      const lp = TYPES[type].poly;
      const AB = G.sub(B, A), LAB = G.len(AB), dir = G.mul(AB, 1 / LAB);
      const L = G.dist(lp[e], lp[(e + 1) % lp.length]);
      const at = opts.at == null ? 'A' : opts.at;
      const s0 = at === 'A' ? 0 : at === 'B' ? LAB - L : at === 'mid' ? (LAB - L) / 2 : at;
      const P0 = G.add(A, G.mul(dir, s0)), P1 = G.add(P0, G.mul(dir, L));
      const tries = [];
      for (const flip of (opts.flip == null ? [0, 1] : [opts.flip])) {
        for (const rev of [false, true]) {
          const m0 = G.placePoly(lp, { x: 0, y: 0, rot: 0, flip: !!flip });
          const a = m0[e], b = m0[(e + 1) % lp.length];
          const want = rev ? G.sub(P0, P1) : G.sub(P1, P0);
          let rot = G.normDeg(G.angle(want) - G.angle(G.sub(b, a)));
          const r45 = Math.round(rot / 45) * 45;
          if (Math.abs(r45 - rot) > 1e-6 && Math.abs(Math.abs(r45 - rot) - 360) > 1e-6) continue;
          rot = G.normDeg(r45);
          const m = G.placePoly(lp, { x: 0, y: 0, rot, flip: !!flip });
          const start = rev ? P1 : P0;
          const x = start[0] - m[e][0], y = start[1] - m[e][1];
          const poly = m.map((p) => [p[0] + x, p[1] + y]);
          const free = !placed.some((h) => H.polysOverlap(poly, h.poly, 1e-6));
          tries.push({ rot, flip, x, y, poly, free });
        }
      }
      const pick = tries.find((t) => t.free && (opts.side == null || sideOf(t.poly, A, B) === opts.side));
      if (!pick) throw new Error('no room to glue ' + type + ' edge ' + e);
      const h = { type, pl: [type, r9(pick.x), r9(pick.y), pick.rot, pick.flip ? 1 : 0], poly: pick.poly };
      h.v = (i) => h.poly[((i % h.poly.length) + h.poly.length) % h.poly.length].slice();
      h.mid = (i, j) => G.mid(h.v(i), h.v(j));
      placed.push(h);
      return h;
    },
    // a piece given by its corners (any order, any of the seven shapes): its type and placement are found
    poly(pts) {
      const pl = fitTangram(pts.map((p) => [p[0], p[1]]), null) || fitTangram(pts.slice().reverse(), null);
      if (!pl) throw new Error('not a tangram piece: ' + JSON.stringify(pts.map((p) => p.map((v) => +v.toFixed(3)))));
      const poly = G.placePoly(TYPES[pl[0]].poly, { x: pl[1], y: pl[2], rot: pl[3], flip: !!pl[4] });
      const h = { type: pl[0], pl, poly };
      h.v = (i) => h.poly[((i % h.poly.length) + h.poly.length) % h.poly.length].slice();
      placed.push(h);
      return h;
    },
    pieces() { return placed.map((h) => h.pl); }
  };
  return api;
}
function sideOf(poly, A, B) { return G.side(G.centroid(poly), A, B) > 0 ? 1 : -1; }
const add = (p, dx, dy) => [p[0] + dx, p[1] + dy];

/* ---------- checks ---------- */
function check(pieces) {
  if (!pieces || pieces.length !== 7 || pieces.some((pl) => !pl)) return 'not seven pieces';
  const need = { LT: 2, MT: 1, ST: 2, SQ: 1, PA: 1 };
  pieces.forEach((pl) => { need[pl[0]]--; });
  if (Object.values(need).some((v) => v !== 0)) return 'wrong pieces ' + JSON.stringify(need);
  const polys = pieces.map((pl) => G.placePoly(TYPES[pl[0]].poly, { x: pl[1], y: pl[2], rot: pl[3], flip: !!pl[4] }));
  for (let i = 0; i < 7; i++) for (let j = i + 1; j < 7; j++) if (H.polysOverlap(polys[i], polys[j], 1e-6)) return 'pieces ' + i + ' and ' + j + ' overlap';
  if (C.dissect.connected(polys) !== 1) return 'falls apart';
  const v = ENG.verify({ data: { pieces } });
  if (!v.ok) return v.err;
  return null;
}

/* ---------- from a sketch: the seven pieces that best cover a rough drawing ----------
 * The drawing is a list of shapes (their union counts). The pieces are laid on
 * the lattice one by one (large first) by a beam search that scores each
 * arrangement by the quarter-cells it covers inside the drawing, minus a
 * penalty for those outside. frame 'B' turns the drawing 45° first and the
 * result back again, so the pieces stand the other way. */
const QCELL = (i, j) => [[i + 0.5, j + 1 / 6], [i + 5 / 6, j + 0.5], [i + 0.5, j + 5 / 6], [i + 1 / 6, j + 0.5]];
function sketchSolve(shapes, opts) {
  opts = opts || {};
  const penalty = opts.penalty == null ? 1.3 : opts.penalty;
  const width = opts.beam || 400;
  const inside = (q) => shapes.some((pl) => G.pointInPoly(q, pl));
  const b = G.bbox(shapes);
  const x0 = Math.floor(b.x0) - 2, y0 = Math.floor(b.y0) - 2, x1 = Math.ceil(b.x1) + 2, y1 = Math.ceil(b.y1) + 2;
  const W = x1 - x0, Hh = y1 - y0;
  const NQ = W * Hh * 4;
  const wgt = new Float32Array(NQ);
  const qc = [];
  for (let i = 0; i < W; i++) for (let j = 0; j < Hh; j++) QCELL(x0 + i, y0 + j).forEach((q, k) => { const id = (i * Hh + j) * 4 + k; qc[id] = q; wgt[id] = inside(q) ? 1 : -penalty; });
  // every placement of every type: the quarter-cells it covers
  const cands = {};
  Object.keys(TYPES).forEach((t) => {
    const seen = new Set();
    const list = [];
    for (const flip of [0, 1]) for (let rot = 0; rot < 360; rot += 90) {
      const base = G.placePoly(TYPES[t].poly, { x: 0, y: 0, rot, flip: !!flip });
      const bb = G.bbox([base]);
      for (let dx = x0 - Math.floor(bb.x0); dx + bb.x1 <= x1; dx++) for (let dy = y0 - Math.floor(bb.y0); dy + bb.y1 <= y1; dy++) {
        const poly = base.map((p) => [p[0] + dx, p[1] + dy]);
        const pb = G.bbox([poly]);
        const cov = [];
        for (let i = Math.floor(pb.x0) - x0; i < Math.ceil(pb.x1) - x0; i++) for (let j = Math.floor(pb.y0) - y0; j < Math.ceil(pb.y1) - y0; j++) for (let k = 0; k < 4; k++) {
          const id = (i * Hh + j) * 4 + k;
          if (G.pointInPoly(qc[id], poly)) cov.push(id);
        }
        const key = cov.join(',');
        if (seen.has(key)) continue;
        seen.add(key);
        const sc = cov.reduce((s2, id) => s2 + wgt[id], 0);
        if (sc < cov.length * 0.25) continue; // mostly outside the drawing: never useful
        list.push({ t, cov, sc, pl: [t, dx, dy, rot, flip] });
      }
    }
    cands[t] = list;
  });
  const order = ['LT', 'LT', 'MT', 'PA', 'SQ', 'ST', 'ST'];
  let beam = [{ occ: new Uint8Array(NQ), sc: 0, pls: [], last: {} }];
  order.forEach((t, step) => {
    const next = [];
    const keys = new Set();
    beam.forEach((st) => {
      const start = step > 0 && order[step - 1] === t ? st.last[t] + 1 : 0; // twins in order
      for (let ci = start; ci < cands[t].length; ci++) {
        const c = cands[t][ci];
        let ok = true;
        for (const id of c.cov) if (st.occ[id]) { ok = false; break; }
        if (!ok) continue;
        next.push({ st, c, ci, sc: st.sc + c.sc });
      }
    });
    next.sort((a, b2) => b2.sc - a.sc);
    const nb = [];
    for (const n of next) {
      if (nb.length >= width) break;
      const occ = n.st.occ.slice();
      n.c.cov.forEach((id) => { occ[id] = 1; });
      // the same set of covered cells reached another way: keep one
      let h = 0;
      for (let id = 0; id < NQ; id++) if (occ[id]) h = (h * 31 + id) | 0;
      if (keys.has(h)) continue;
      keys.add(h);
      const last = Object.assign({}, n.st.last); last[t] = n.ci;
      nb.push({ occ, sc: n.sc, pls: n.st.pls.concat([n.c.pl]), last });
    }
    beam = nb;
  });
  // the best arrangement that holds together
  for (const st of beam) {
    const polys = st.pls.map((pl) => G.placePoly(TYPES[pl[0]].poly, { x: pl[1], y: pl[2], rot: pl[3], flip: !!pl[4] }));
    if (C.dissect.connected(polys) === 1) return { pieces: st.pls, score: st.sc };
  }
  return { err: 'nothing connected' };
}

// a sketch at the right size (area 16), tried in both frames and a few offsets
function fromSketch(shapes, opts) {
  opts = opts || {};
  const area = C.dissect.connected ? rasterArea(shapes) : 16;
  const k = Math.sqrt(16 / area) * (opts.scale || 1);
  let best = null;
  (opts.frames || ['A', 'B']).forEach((fr) => {
    [[0, 0], [0.5, 0], [0, 0.5], [0.5, 0.5]].forEach((off) => {
      const sh = shapes.map((pl) => pl.map((p) => {
        const q = [p[0] * k, p[1] * k];
        const r = fr === 'B' ? G.rot(q, 45) : q;
        return [r[0] + off[0], r[1] + off[1]];
      }));
      const r = sketchSolve(sh, opts);
      if (r.err) return;
      let pieces = r.pieces;
      if (fr === 'B') pieces = pieces.map(([t, x, y, rot, flip]) => { const p = G.rot([x, y], -45); return [t, r9(p[0]), r9(p[1]), G.normDeg(rot - 45), flip]; });
      if (!best || r.score > best.score) best = { score: r.score, pieces, frame: fr };
    });
  });
  return best || { err: 'no arrangement' };
}
function rasterArea(shapes) { return G.rasterArea(shapes, 400); }

/* ---------- from a sketch, pieces joined edge to edge (any 45° turn: the frames mix) ----------
 * A beam search: the first large triangle anywhere over the drawing, then each
 * next piece with one corner on a corner already placed and an edge along an
 * edge already placed. Score: pixels inside the drawing, minus a penalty
 * for pixels outside. */
function orient16(t) {
  const out = [], seen = new Set();
  for (const flip of [0, 1]) for (let rot = 0; rot < 360; rot += 45) {
    const m = G.placePoly(TYPES[t].poly, { x: 0, y: 0, rot, flip: !!flip });
    const k = m.map((p) => G.sub(p, m[0])).map((p) => p.map((v) => v.toFixed(4)).join(',')).sort().join(';');
    const c0 = G.centroid(m);
    const key = m.map((p) => G.sub(p, c0)).map((p) => p.map((v) => String(Math.round(v * 1e4))).join(',')).sort().join(';');
    if (seen.has(key)) continue;
    seen.add(key); void k;
    out.push({ m, rot, flip });
  }
  return out;
}
const ORIENT = {};
Object.keys(TYPES).forEach((t) => { ORIENT[t] = orient16(t); });

function sharedEdge(pl, placed) {
  let L = 0;
  for (let i = 0; i < pl.length; i++) {
    const a = pl[i], b = pl[(i + 1) % pl.length];
    const ab = G.sub(b, a), lab = G.len(ab), u = G.mul(ab, 1 / lab);
    for (const q of placed) for (let j = 0; j < q.length; j++) {
      const c = q[j], d = q[(j + 1) % q.length];
      if (Math.abs(G.cross(ab, G.sub(c, a))) > 1e-6 * lab || Math.abs(G.cross(ab, G.sub(d, a))) > 1e-6 * lab) continue;
      const t0 = G.dot(G.sub(c, a), u), t1 = G.dot(G.sub(d, a), u);
      const lo = Math.max(0, Math.min(t0, t1)), hi = Math.min(lab, Math.max(t0, t1));
      if (hi - lo > 1e-6) L += hi - lo;
    }
  }
  return L;
}

function attachSolve(shapes, opts) {
  opts = opts || {};
  const penalty = opts.penalty == null ? 1.4 : opts.penalty;
  const width = opts.beam || 60;
  const R = opts.res || 8; // pixels per unit
  const b = G.bbox(shapes);
  const gx0 = b.x0 - 2.5, gy0 = b.y0 - 2.5;
  const GW = Math.ceil((b.w + 5) * R), GH = Math.ceil((b.h + 5) * R);
  const inMask = G.raster(shapes, { x0: gx0, y0: gy0, w: GW / R, h: GH / R }, GW, GH);
  const Wt = new Float32Array(GW * GH);
  for (let i = 0; i < Wt.length; i++) Wt[i] = inMask[i] ? 1 : -penalty;
  // pixel score of one polygon (pixel centres)
  function pscore(pl) {
    const pts = pl.map((p) => [(p[0] - gx0) * R, (p[1] - gy0) * R]);
    let y0 = Infinity, y1 = -Infinity;
    pts.forEach((p) => { y0 = Math.min(y0, p[1]); y1 = Math.max(y1, p[1]); });
    let sc = 0;
    const r0 = Math.max(0, Math.floor(y0)), r1 = Math.min(GH - 1, Math.ceil(y1));
    for (let r = r0; r <= r1; r++) {
      const y = r + 0.5;
      const xs = [];
      for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const a = pts[i], c = pts[j]; if ((a[1] > y) !== (c[1] > y)) xs.push(a[0] + (y - a[1]) * (c[0] - a[0]) / (c[1] - a[1])); }
      xs.sort((p, q) => p - q);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        const c0 = Math.ceil(xs[k] - 0.5), c1 = Math.floor(xs[k + 1] - 0.5);
        for (let c = c0; c <= c1; c++) sc += (c < 0 || c >= GW) ? -penalty : Wt[r * GW + c];
      }
    }
    return sc / (R * R);
  }
  const order = opts.order || ['LT', 'LT', 'MT', 'PA', 'SQ', 'ST', 'ST'];
  // first piece: anywhere on a fine grid
  const first = [];
  ORIENT[order[0]].forEach((o) => {
    const ob = G.bbox([o.m]);
    for (let x = b.x0 - ob.x0 - 1; x <= b.x1 - ob.x1 + 1; x += 0.25) for (let y = b.y0 - ob.y0 - 1; y <= b.y1 - ob.y1 + 1; y += 0.25) {
      const poly = o.m.map((p) => [p[0] + x, p[1] + y]);
      first.push({ polys: [poly], pls: [[order[0], x, y, o.rot, o.flip]], sc: pscore(poly) });
    }
  });
  first.sort((a, c) => c.sc - a.sc);
  // keep the first pieces varied: the best one per orientation and half-unit cell
  const fseen = new Set();
  let beam = [];
  for (const st of first) {
    const pl = st.pls[0];
    const k = pl[3] + ':' + pl[4] + ':' + Math.round(pl[1] * 2) + ':' + Math.round(pl[2] * 2);
    if (fseen.has(k)) continue;
    fseen.add(k);
    beam.push(st);
    if (beam.length >= width) break;
  }
  for (let step = 1; step < order.length; step++) {
    const t = order[step];
    const next = [];
    const seenKeys = new Set();
    beam.forEach((st) => {
      const verts = [];
      st.polys.forEach((q) => q.forEach((p) => { if (!verts.some((v) => G.dist(v, p) < 1e-6)) verts.push(p); }));
      ORIENT[t].forEach((o) => o.m.forEach((v) => verts.forEach((w) => {
        const dx = w[0] - v[0], dy = w[1] - v[1];
        const poly = o.m.map((p) => [p[0] + dx, p[1] + dy]);
        for (const q of st.polys) if (H.polysOverlap(poly, q, 1e-6)) return;
        if (sharedEdge(poly, st.polys) < 0.3) return;
        const pl = [t, r9(dx - 0), r9(dy - 0), o.rot, o.flip];
        const key = st.pls.concat([pl]).map((x) => x.join(':')).sort().join('|');
        if (seenKeys.has(key)) return;
        seenKeys.add(key);
        next.push({ polys: st.polys.concat([poly]), pls: st.pls.concat([pl]), sc: st.sc + pscore(poly) });
      })));
    });
    next.sort((a, c) => c.sc - a.sc);
    beam = next.slice(0, width);
    if (!beam.length) return { err: 'dead end at step ' + step };
  }
  const best = beam[0];
  // placements from the polygons (the translations above used the orientation's own origin)
  const pieces = best.polys.map((pl, i) => fitTangram(pl, order[i]));
  return { pieces, score: best.sc };
}

/* ---------- from hints: each piece's rough place and its way round ----------
 * hints: [[type, orient, [cx, cy], opts], ...] in the order they are laid.
 * orient: triangles by where the right angle points: N E S W (long side
 *   flat or upright) or NE NW SE SW (short sides flat and upright);
 *   the square: 'D' (diamond) or 'U' (upright);
 *   the parallelogram by its long sides, then its short ones, each h (level),
 *   v (upright), r (rising to the right, /) or f (falling to the right, \):
 *   'hr' 'hf' 'vr' 'vf' (long sides level or upright) and 'rh' 'rv' 'fh' 'fv'
 *   (long sides at 45°); '*' = any.
 * The first piece goes exactly on its hint; each later one is laid with a
 * corner on a corner (or the middle of an edge) of what is there, touching
 * along an edge, as near to its hint as it can. */
const COMPASS = ['E', 'SE', 'S', 'SW', 'W', 'NW', 'N', 'NE'];
function orientName(t, m) {
  if (t === 'SQ') return Math.abs(m[0][1] - m[1][1]) < 1e-6 || Math.abs(m[0][0] - m[1][0]) < 1e-6 ? 'U' : 'D';
  if (t === 'PA') {
    let L = null, Sh = null;
    for (let i = 0; i < 4; i++) { const d = G.sub(m[(i + 1) % 4], m[i]); if (G.len(d) > 1.7) L = L || d; else Sh = Sh || d; }
    const cls = (d) => (Math.abs(d[1]) < 1e-6 ? 'h' : Math.abs(d[0]) < 1e-6 ? 'v' : (d[0] * d[1] < 0 ? 'r' : 'f'));
    const a = cls(L), b = cls(Sh);
    if (a === 'h' || a === 'v') return a + b;
    return a + (b === 'h' ? 'h' : 'v');
  }
  // triangles: the right-angle corner is the one opposite the longest side
  let k = 0, best = -1;
  for (let i = 0; i < 3; i++) { const dd = G.dist(m[(i + 1) % 3], m[(i + 2) % 3]); if (dd > best) { best = dd; k = i; } }
  const hm = G.mid(m[(k + 1) % 3], m[(k + 2) % 3]);
  const a = G.normDeg(G.angle(G.sub(m[k], hm)));
  return COMPASS[Math.round(a / 45) % 8];
}
function hinted(hints, opts) {
  opts = opts || {};
  const width = opts.beam || 40;
  const cands = (t, o) => ORIENT[t].filter((x) => o === '*' || orientName(t, x.m) === o);
  const [t0, o0, c0] = hints[0];
  const f0 = cands(t0, o0);
  if (!f0.length) throw new Error('hint 1: no ' + t0 + ' faces ' + o0);
  const m0 = f0[0].m, cc = G.centroid(m0);
  const poly0 = m0.map((p) => [p[0] - cc[0] + c0[0], p[1] - cc[1] + c0[1]]);
  let beam = [{ polys: [poly0], types: [t0], sc: 0 }];
  for (let k = 1; k < hints.length; k++) {
    const [t, o, c, ho] = hints[k];
    const os = cands(t, o);
    if (!os.length) throw new Error('hint ' + (k + 1) + ': no ' + t + ' faces ' + o);
    const next = [], seen = new Set();
    beam.forEach((st) => {
      const pts = [];
      const addPt = (p) => { if (!pts.some((v) => G.dist(v, p) < 1e-6)) pts.push(p); };
      st.polys.forEach((pl) => pl.forEach((p, i) => { addPt(p); addPt(G.mid(p, pl[(i + 1) % pl.length])); }));
      os.forEach((ox) => ox.m.forEach((v) => pts.forEach((w) => {
        const dx = w[0] - v[0], dy = w[1] - v[1];
        const poly = ox.m.map((p) => [p[0] + dx, p[1] + dy]);
        const cen = G.centroid(poly);
        const d = G.dist(cen, c);
        if (d > (ho && ho.far || 3)) return;
        for (const q2 of st.polys) if (H.polysOverlap(poly, q2, 1e-6)) return;
        if (!(ho && ho.point) && sharedEdge(poly, st.polys) < 0.3) return;
        const key = cen.map((v) => v.toFixed(3)).join(',') + ':' + st.polys.length + ':' + st.sc.toFixed(4);
        if (seen.has(key)) return;
        seen.add(key);
        next.push({ polys: st.polys.concat([poly]), types: st.types.concat([t]), sc: st.sc + d });
      })));
    });
    if (!next.length) throw new Error('hint ' + (k + 1) + ' (' + t + ' ' + o + ' near ' + c.join(',') + '): no place touching the others');
    next.sort((a, b) => a.sc - b.sc);
    beam = next.slice(0, width);
  }
  const best = beam[0];
  return best.polys.map((pl, i) => fitTangram(pl, best.types[i]));
}

/* ---------- from rough pieces: each piece sketched by its corners, snapped exact ----------
 * sketch: [[type, [[x, y], ...]], ...] (type may be omitted: found from the corners and
 * the area). Each piece takes the way round that best fits its sketch and, after
 * the first, the place touching the pieces before it (corner to corner or corner
 * to mid-edge, along an edge) nearest its sketch. */
function roughType(pts) {
  const A = G.absArea(pts);
  if (pts.length === 3) return A < 1.5 ? 'ST' : A < 3 ? 'MT' : 'LT';
  const d = [0, 1, 2, 3].map((i) => G.dist(pts[i], pts[(i + 1) % 4]));
  return Math.max(...d) / Math.min(...d) > 1.2 ? 'PA' : 'SQ';
}
function setDist(A, B) { // symmetric sum of nearest-corner distances
  let s = 0;
  A.forEach((p) => { s += Math.min(...B.map((q) => G.dist(p, q))); });
  B.forEach((p) => { s += Math.min(...A.map((q) => G.dist(p, q))); });
  return s / (A.length + B.length);
}
function snapPieces(sketch, opts) {
  opts = opts || {};
  const width = opts.beam || 30;
  const items = sketch.map((it) => (typeof it[0] === 'string' ? { t: it[0], pts: it[1], o: it[2] || {} } : { t: roughType(it), pts: it, o: {} }));
  // the ways round that fit each sketch best
  items.forEach((it) => {
    const c = G.centroid(it.pts);
    const rel = it.pts.map((p) => G.sub(p, c));
    const scored = ORIENT[it.t].map((o) => { const cm = G.centroid(o.m); return { o, sc: setDist(o.m.map((p) => G.sub(p, cm)), rel) }; }).sort((a, b) => a.sc - b.sc);
    it.os = scored.filter((x, i) => i === 0 || x.sc < scored[0].sc + (it.o.loose ? 0.6 : 0.15)).map((x) => x.o);
  });
  const i0 = items[0], cc0 = G.centroid(i0.pts), m0 = i0.os[0].m, cm0 = G.centroid(m0);
  let beam = [{ polys: [m0.map((p) => [p[0] - cm0[0] + cc0[0], p[1] - cm0[1] + cc0[1]])], sc: 0 }];
  for (let k = 1; k < items.length; k++) {
    const it = items[k];
    const next = [], seen = new Set();
    beam.forEach((st) => {
      const pts = [];
      const addPt = (p) => { if (!pts.some((v) => G.dist(v, p) < 1e-6)) pts.push(p); };
      st.polys.forEach((pl) => pl.forEach((p, i) => { addPt(p); addPt(G.mid(p, pl[(i + 1) % pl.length])); }));
      it.os.forEach((ox) => ox.m.forEach((v) => pts.forEach((w) => {
        const dx = w[0] - v[0], dy = w[1] - v[1];
        const poly = ox.m.map((p) => [p[0] + dx, p[1] + dy]);
        const d = setDist(poly, it.pts);
        if (d > (it.o.far || 1.6)) return;
        for (const q2 of st.polys) if (H.polysOverlap(poly, q2, 1e-6)) return;
        if (!it.o.point && sharedEdge(poly, st.polys) < 0.3) return;
        const key = G.centroid(poly).map((v) => v.toFixed(3)).join(',') + '#' + st.sc.toFixed(5);
        if (seen.has(key)) return;
        seen.add(key);
        next.push({ polys: st.polys.concat([poly]), sc: st.sc + d });
      })));
    });
    if (!next.length) { const e = new Error('piece ' + (k + 1) + ' (' + it.t + '): nowhere to put it near its sketch'); e.partial = beam[0].polys; throw e; }
    next.sort((a, b) => a.sc - b.sc);
    beam = next.slice(0, width);
  }
  return beam[0].polys.map((pl, i) => fitTangram(pl, items[i].t));
}

// the sketch at the right size, tried at a few scales
function fromSketchJoined(shapes, opts) {
  opts = opts || {};
  const area = rasterArea(shapes);
  let best = null;
  (opts.scales || [1]).forEach((sc) => {
    const k = Math.sqrt(16 / area) * sc;
    const sh = shapes.map((pl) => pl.map((p) => [p[0] * k, p[1] * k]));
    const r = attachSolve(sh, opts);
    if (!r.err && (!best || r.score > best.score)) best = r;
  });
  return best || { err: 'no arrangement' };
}

module.exports = { solveOutline, builder, fitTangram, check, add, s, sketchSolve, fromSketch, attachSolve, fromSketchJoined, hinted, orientName, ORIENT, snapPieces };
if (require.main !== module) return;

/* =====================================================================
 * THE FIGURES
 * =================================================================== */

const OUT = [];
const FAILED = [];
function keep(o, pieces) {
  const err = check(pieces);
  if (err) { FAILED.push(o.id + ': ' + err); return; }
  OUT.push(Object.assign({}, o, { pieces }));
}
// an outline figure: [id, title, diff, frame, outline, text, extra]
function outlineFig(o) {
  const r = solveOutline(o.outline, o.frame || 'A', o.seed);
  if (r.err) { FAILED.push(o.id + ': ' + r.err); return; }
  let pieces = r.pieces;
  if (o.turn) pieces = turnAll(pieces, o.turn, o.mirror);
  keep(o, pieces);
}
function builtFig(o) {
  const b = builder();
  try { o.build(b, b.put); } catch (e) { FAILED.push(o.id + ': ' + e.message); return; }
  let pieces = b.pieces();
  if (o.turn || o.mirror) pieces = turnAll(pieces, o.turn || 0, o.mirror);
  keep(o, pieces);
}
// turn a whole figure (multiple of 45°) and maybe mirror it
function turnAll(pieces, A, mir) {
  return pieces.map(([t, x, y, rot, flip]) => {
    let tt = { x, y, rot, flip: !!flip };
    if (mir) tt = { x: -tt.x, y: tt.y, rot: -tt.rot, flip: !tt.flip };
    const p = G.rot([tt.x, tt.y], A);
    return [t, r9(p[0]), r9(p[1]), G.normDeg(Math.round(tt.rot + A)), tt.flip ? 1 : 0];
  });
}

/* ----- the thirteen convex figures ----- */
{
  const DIRS = [[1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1], [0, -1], [1, -1]];
  const canonKey = (pl) => {
    const vs = [];
    for (let f = 0; f < 2; f++) for (let r = 0; r < 4; r++) {
      let q = pl.map(([x, y]) => (f ? [-x, y] : [x, y]));
      for (let k = 0; k < r; k++) q = q.map(([x, y]) => [-y, x]);
      const mx = Math.min(...q.map((p) => p[0])), my = Math.min(...q.map((p) => p[1]));
      vs.push(q.map(([x, y]) => (x - mx) + ',' + (y - my)).sort().join(';'));
    }
    return vs.sort()[0];
  };
  const found = [], keys = new Set();
  const M = 8;
  for (let n0 = 0; n0 <= M; n0++) for (let n1 = 0; n1 <= M; n1++) for (let n2 = 0; n2 <= M; n2++) for (let n3 = 0; n3 <= M; n3++) for (let n5 = 0; n5 <= M; n5++) for (let n7 = 0; n7 <= M; n7++) {
    const n4 = n0 + n1 - n3 - n5 + n7, n6 = n1 + n2 + n3 - n5 - n7;
    if (n4 < 0 || n6 < 0) continue;
    const ns = [n0, n1, n2, n3, n4, n5, n6, n7];
    if (ns.filter((v) => v > 0).length < 3) continue;
    let p = [0, 0];
    const pl = [];
    ns.forEach((n, i) => { if (!n) return; pl.push(p); p = [p[0] + DIRS[i][0] * n, p[1] + DIRS[i][1] * n]; });
    if (Math.abs(G.absArea(pl) - 16) > 1e-9) continue;
    const k = canonKey(pl);
    if (keys.has(k)) continue;
    keys.add(k);
    const r = solveOutline(pl, 'A');
    if (!r.err) found.push({ pl, pieces: r.pieces });
  }
  if (found.length !== 13) throw new Error('expected 13 convex figures, found ' + found.length);
  CONVEX = found;
}
var CONVEX;

/* ----- the figures -----
 * Found with the tools above: a core (a head and a body, a cat's head with its ears,
 * a hull and its sails …) with the other pieces laid edge to edge around it in
 * thousands of ways, a matcher for drawn silhouettes (letters, tools), and a few
 * placed by hand; then picked by eye, keeping only those that look like their
 * names. Each is stored with its placements and checked again here. */
const TEXT = {
  // people
  skater: ['people', 'A skater on one leg, arms out for balance.'],
  hurdler: ['people', 'Over the hurdle, back leg trailing.'],
  runner: ['people', 'A runner in full stride.'],
  stride: ['people', 'One enormous stride.'],
  'sitting-floor': ['people', 'Someone sitting on the floor, legs out in front.'],
  'long-jump': ['people', 'Flying through the air at the long jump.'],
  kneeling: ['people', 'A figure kneeling in a long robe.'],
  squatting: ['people', 'Squatting down, arms out.'],
  kick: ['people', 'A kick at the ball.'],
  walker: ['people', 'Out for a walk in a hat.'],
  standing: ['people', 'Standing tall, hands on hips.'],
  tightrope: ['people', 'Arms out on the tightrope.'],
  sprinter: ['people', 'A sprinter leaning into the race.'],
  seated: ['people', 'Seated, knees up.'],
  hooray: ['people', 'Arms in the air: hooray!'],
  thinker: ['people', 'Sitting deep in thought.'],
  dancer: ['people', 'A dancer, arms raised, one foot kicked back.'],
  mermaid: ['people', 'A mermaid, her tail curling away.'],
  skier: ['people', 'A skier leaning into the slope.'],
  guardsman: ['people', 'A guardsman in a tall hat, standing to attention.'],
  queen: ['people', 'A queen in her crown.'],
  bonnet: ['people', 'A lady in a bonnet and a long dress.'],
  waiter: ['people', 'A waiter carrying a tray.'],
  'chair-sitter': ['people', 'Sitting on a chair.'],
  // cats
  'cat-sitting': ['cats', 'A cat sitting with its tail out behind.'],
  'cat-curled': ['cats', 'A cat curled up, tail round its paws.'],
  'cat-crouching': ['cats', 'A cat crouching low, watching something.'],
  'cat-stretching': ['cats', 'A long, lazy stretch.'],
  kitten: ['cats', 'A kitten on long legs.'],
  'cat-pouncing': ['cats', 'A cat about to pounce.'],
  'cat-prowling': ['cats', 'A cat on the prowl.'],
  'cat-lying': ['cats', 'A cat lying down, head up.'],
  'cat-leaping': ['cats', 'A cat in mid-leap.'],
  'arching-cat': ['cats', 'A cat with its back arched.'],
  // other animals
  greyhound: ['animals', 'A greyhound at full stretch.'],
  horse: ['animals', 'A horse, head held high.'],
  dachshund: ['animals', 'A long, low dachshund.'],
  terrier: ['animals', 'A square-headed terrier.'],
  'sitting-dog': ['animals', 'A dog sitting up.'],
  llama: ['animals', 'A llama with its long neck.'],
  watchdog: ['animals', 'A dog standing guard.'],
  deer: ['animals', 'A deer lifting its head.'],
  fox: ['animals', 'A fox with its brush out behind.'],
  weasel: ['animals', 'A weasel slipping along.'],
  hare: ['animals', 'A hare sitting up.'],
  rabbit: ['animals', 'A rabbit, ears up.'],
  bunny: ['animals', 'A round little bunny.'],
  'rabbit-hopping': ['animals', 'A rabbit hopping away.'],
  tortoise: ['animals', 'A tortoise under its shell.'],
  // birds
  swan: ['birds', 'A swan with its curved neck.'],
  goose: ['birds', 'A goose, neck stretched up.'],
  duck: ['birds', 'A duck on the pond.'],
  hen: ['birds', 'A hen sitting on her eggs.'],
  rooster: ['birds', 'A rooster, tail up.'],
  owl: ['birds', 'An owl on its perch.'],
  penguin: ['birds', 'A penguin standing up straight.'],
  parrot: ['birds', 'A parrot on its perch.'],
  toucan: ['birds', 'A toucan with its great beak.'],
  sparrow: ['birds', 'A sparrow on the ground.'],
  pelican: ['birds', 'A pelican, beak open.'],
  // in the water
  whale: ['water', 'A whale, tail up.'],
  fish: ['water', 'A fish with a forked tail.'],
  carp: ['water', 'A fat carp.'],
  sailboat: ['water', 'A sailing boat with a flag at the masthead.'],
  // things
  house: ['things', 'A house with a chimney and a shed.'],
  pagoda: ['things', 'A pagoda roof.'],
  'fir-tree': ['things', 'A fir tree in its pot.'],
  'pot-plant': ['things', 'A plant in a pot.'],
  teapot: ['things', 'A teapot: lid, spout and handle.'],
  teacup: ['things', 'A teacup on its saucer.'],
  goblet: ['things', 'A goblet on a stem.'],
  trophy: ['things', 'A cup with two handles — a trophy.'],
  armchair: ['things', 'An armchair.'],
  chair: ['things', 'A kitchen chair.'],
  boot: ['things', 'A boot.'],
  umbrella: ['things', 'An umbrella, open.'],
  key: ['things', 'An old key.'],
  hammer: ['things', 'A hammer.'],
  anvil: ['things', 'A blacksmith\'s anvil.'],
  kite: ['things', 'A kite with its tail.'],
  aeroplane: ['things', 'An aeroplane.'],
  glider: ['things', 'A glider.'],
  arrow: ['things', 'An arrow pointing right, with a notched tail.'],
  // letters and figures
  'letter-l': ['letters', 'The letter L.'], 'letter-t': ['letters', 'The letter T.'], 'letter-n': ['letters', 'The letter N.'],
  'letter-m': ['letters', 'The letter M.'], 'letter-a': ['letters', 'The letter A.'], 'letter-e': ['letters', 'The letter E.'],
  'letter-f': ['letters', 'The letter F.'], 'letter-c': ['letters', 'The letter C.'], 'letter-k': ['letters', 'The letter K.'],
  'digit-one': ['letters', 'The figure 1.'], 'digit-four': ['letters', 'The figure 4.'], 'digit-seven': ['letters', 'The figure 7.']
};
const THEME_ORDER = ['people', 'cats', 'animals', 'birds', 'water', 'things', 'letters'];

// how hard: a compact outline with few corners gives little away; pieces turned both ways are harder
function hardness(pieces) {
  const polys = pieces.map((pl) => G.placePoly(TYPES[pl[0]].poly, { x: pl[1], y: pl[2], rot: pl[3], flip: !!pl[4] }));
  const loops = H.unionOutline(polys, 1e-6);
  const outline = loops.sort((a, b) => G.absArea(b) - G.absArea(a))[0];
  const corners = outline.length;
  const hull = G.convexHull([].concat(...polys));
  const compact = 16 / G.absArea(hull);
  let a = 0, b = 0;
  pieces.forEach((pl) => { if (pl[3] % 90 === 0) a++; else b++; });
  const mixed = Math.min(a, b);
  return { score: compact * 4 + mixed * 0.6 - corners * 0.12, corners, compact, mixed };
}

// the convex figures, turned to stand nicely: most edge length level or upright, a flat base
function standNicely(pieces) {
  let best = null;
  for (const mir of [false, true]) for (let A = 0; A < 360; A += 45) {
    const pc = turnAll(pieces, A, mir);
    const polys = pc.map((pl) => G.placePoly(TYPES[pl[0]].poly, { x: pl[1], y: pl[2], rot: pl[3], flip: !!pl[4] }));
    const ol = H.unionOutline(polys, 1e-6)[0];
    const bb = G.bbox([ol]);
    let sc = 0;
    ol.forEach((p, i) => {
      const q = ol[(i + 1) % ol.length], d = G.sub(q, p);
      if (Math.abs(d[1]) < 1e-6) sc += G.len(d) * 1.2 + (Math.abs(p[1] - bb.y1) < 1e-6 ? G.len(d) * 2 : 0);
      else if (Math.abs(d[0]) < 1e-6) sc += G.len(d);
    });
    sc -= bb.h * 0.3; // rather lying than standing
    if (!best || sc > best.sc + 1e-9) best = { sc, pc };
  }
  return best.pc;
}
function convexName(pieces) {
  const polys = pieces.map((pl) => G.placePoly(TYPES[pl[0]].poly, { x: pl[1], y: pl[2], rot: pl[3], flip: !!pl[4] }));
  const ol = G.clean(H.unionOutline(polys, 1e-6)[0], 1e-6);
  const n = ol.length;
  const sides = ol.map((p, i) => G.dist(p, ol[(i + 1) % n]));
  const par = (i, j) => Math.abs(G.cross(G.sub(ol[(i + 1) % n], ol[i]), G.sub(ol[(j + 1) % n], ol[j]))) < 1e-6;
  if (n === 3) return 'triangle';
  if (n === 4) {
    const right = ol.every((p, i) => Math.abs(G.dot(G.sub(ol[(i + 1) % n], p), G.sub(ol[(i + 2) % n], ol[(i + 1) % n]))) < 1e-6);
    if (right) return Math.abs(sides[0] - sides[1]) < 1e-6 ? 'square' : 'rectangle';
    if (par(0, 2) && par(1, 3)) return 'parallelogram';
    return 'trapezoid';
  }
  return n === 5 ? 'pentagon' : 'hexagon';
}

function main() {
  const OUTF = [];
  Object.keys(FIG).forEach((slug) => {
    const [title, pieces] = FIG[slug];
    const err = check(pieces);
    if (err) { FAILED.push(slug + ': ' + err); return; }
    if (!TEXT[slug]) throw new Error('no text for ' + slug);
    OUTF.push({ slug, title, pieces, theme: TEXT[slug][0], text: TEXT[slug][1], h: hardness(pieces) });
  });
  // difficulty by rank of hardness: 1..4 for figures (5 kept for the hardest convex ones)
  const sorted = OUTF.slice().sort((a, b) => a.h.score - b.h.score);
  sorted.forEach((f, i) => { f.diff = 1 + Math.min(3, Math.floor(i / sorted.length * 4)); });
  const puzzles = [];
  OUTF.sort((a, b) => a.diff - b.diff || THEME_ORDER.indexOf(a.theme) - THEME_ORDER.indexOf(b.theme)).forEach((f) => {
    puzzles.push({
      id: 'tgf-' + f.slug, title: f.title, diff: f.diff, text: f.text,
      goal: 'Cover the silhouette with all seven pieces.',
      tags: ['tangram', f.theme], data: { pieces: f.pieces }
    });
  });
  // the convex thirteen
  const names = {};
  const conv = CONVEX.map((c) => {
    const pieces = standNicely(c.pieces);
    const kind = convexName(pieces);
    names[kind] = (names[kind] || 0) + 1;
    return { pieces, kind, h: hardness(pieces) };
  });
  const count = {};
  const ORD = ['', 'I', 'II', 'III', 'IV', 'V'];
  const KIND_ORDER = ['triangle', 'square', 'rectangle', 'parallelogram', 'trapezoid', 'pentagon', 'hexagon'];
  conv.sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind) || a.h.score - b.h.score);
  const WH = 'Fu Traing Wang and Chuan-Chih Hsiung, "A theorem on the tangram", *American Mathematical Monthly* (1942).';
  conv.forEach((c, i) => {
    count[c.kind] = (count[c.kind] || 0) + 1;
    const title = 'Convex ' + c.kind.charAt(0).toUpperCase() + c.kind.slice(1) + (names[c.kind] > 1 ? ' ' + ORD[count[c.kind]] : '');
    const diff = c.kind === 'square' ? 4 : c.kind === 'triangle' ? 3 : Math.min(5, 3 + Math.round((c.h.compact - 0.9) * 10) + (c.kind === 'hexagon' || c.kind === 'pentagon' ? 1 : 0));
    puzzles.push({
      id: 'tgf-convex-' + String(i + 1).padStart(2, '0'), title, diff: Math.max(3, Math.min(5, diff)), year: 1942, source: WH,
      text: 'Only thirteen convex shapes — no dents anywhere in the outline — can be made from the seven tangram pieces. This is one of them' + (c.kind === 'square' ? ': the box the set comes in.' : ', a ' + c.kind + '.'),
      goal: 'Cover the silhouette with all seven pieces.',
      explain: 'Wang and Hsiung proved in 1942 that there are exactly thirteen. The idea: cut every piece into the small triangle\'s size (the set makes sixteen of them); in a convex figure the sixteen triangles must line up on one grid, and there are only so many convex outlines of that area on it — thirteen of which the pieces can actually fill.',
      concepts: ['exact-cover', 'dissection'], tags: ['tangram', 'convex', c.kind], data: { pieces: c.pieces }
    });
  });
  const fam = puzzles.slice().map((p, i) => [p, i]).sort((a, b) => a[0].diff - b[0].diff || a[1] - b[1]).map((x) => x[0]);
  const lines = ['/* The Puzzle Cabinet · data/tangram-figures.js — made by tools/gen/tangram-figures.js */', 'Cabinet.family({'];
  lines.push("  id: 'tangram-figures', engine: 'tangram', cat: 'shapes', name: 'Tangram figures', order: 2,");
  lines.push("  blurb: 'People, cats, birds, boats, tools and letters — and the thirteen convex shapes — all made with the same seven pieces.',");
  lines.push("  origin: { year: 1817, who: 'The tangram books', note: 'Since the tangram craze of 1817, puzzle books have printed hundreds of figures to be made with the seven pieces. These were made for the cabinet in the same spirit; the thirteen convex ones are all there are.' },");
  lines.push("  concepts: ['dissection', 'symmetry']");
  lines.push('}, [');
  lines.push(fam.map((p) => {
    const keys = Object.keys(p).filter((k) => k !== 'data');
    return '  {' + keys.map((k) => ' ' + k + ': ' + JSON.stringify(p[k])).join(',') + ',\n    data: ' + JSON.stringify(p.data) + ' }';
  }).join(',\n'));
  lines.push(']);');
  const text = lines.join('\n') + '\n';
  fs.writeFileSync(path.join(ROOT, 'data/tangram-figures.js'), text);
  const spread = [0, 0, 0, 0, 0, 0];
  fam.forEach((p) => spread[p.diff]++);
  console.log('data/tangram-figures.js: ' + fam.length + ' figures (' + OUTF.length + ' pictures + ' + conv.length + ' convex), ' + Math.round(text.length / 1024) + ' KB; by difficulty ' + spread.slice(1).join('/'));
  if (FAILED.length) console.log('left out: ' + FAILED.join('; '));
}
setImmediate(main);

/* the figures: [title, placements [type, x, y, turn, flipped]] */
const FIG = {
  "skater": ["The Skater", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",4,3,180,0],["ST",2,1,180,0],["ST",6,1,180,0],["MT",3.414213562,4.414213562,225,0],["PA",2.707106781,3.707106781,45,0]]],
  "hurdler": ["The Hurdler", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",1.171572875,3.828427125,315,0],["ST",1,2,270,0],["ST",4,1,315,0],["MT",4,3.828427125,90,0],["PA",2.171572875,2.828427125,0,1]]],
  "runner": ["The Runner", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",2,1,45,0],["ST",2,1,180,0],["ST",4,1,315,0],["MT",4.828427125,5.242640687,225,0],["PA",2,1.828427125,90,0]]],
  "stride": ["The Great Stride", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",6,3,180,0],["ST",0.585786438,-0.414213562,45,0],["ST",4,1,0,0],["MT",5.414213562,4.414213562,225,0],["PA",3.414213562,3,135,0]]],
  "sitting-floor": ["Sitting on the Floor", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",4,1,90,0],["ST",3,0,180,0],["ST",4,1,315,0],["MT",3,4,45,0],["PA",2.585786438,4.414213562,0,1]]],
  "long-jump": ["The Long Jump", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",6,3,180,0],["ST",2,1,180,0],["ST",6,1,180,0],["MT",4.585786438,4.414213562,225,0],["PA",3,2,135,0]]],
  "kneeling": ["Kneeling", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",1.171572875,3.828427125,315,0],["ST",2.5,-0.5,180,0],["ST",5,0,90,0],["MT",4,3.828427125,270,0],["PA",3,2,135,0]]],
  "squatting": ["Squatting Down", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",4,3,180,0],["ST",0,1,0,0],["ST",3.585786438,1.414213562,315,0],["MT",3.414213562,4.414213562,225,0],["PA",3.414213562,4.414213562,45,1]]],
  "kick": ["The Kick", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",2,5,270,0],["ST",2,1,180,0],["ST",4,1,315,0],["MT",4,5,180,0],["PA",0.585786438,5.828427125,135,1]]],
  "walker": ["Out for a Walk", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",6,3,180,0],["ST",2.414213562,-1.414213562,135,0],["ST",4,1,0,0],["MT",2,3,0,0],["PA",4,3,90,0]]],
  "standing": ["Standing Tall", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",2,5,270,0],["ST",0.585786438,-0.414213562,45,0],["ST",5,0,90,0],["MT",2.585786438,4.414213562,315,0],["PA",2.585786438,4.414213562,90,0]]],
  "tightrope": ["The Tightrope Walker", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",4,1,90,0],["ST",2,1,180,0],["ST",4,1,315,0],["MT",4,5,270,0],["PA",2.585786438,3.585786438,45,0]]],
  "sprinter": ["The Sprinter", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",1.171572875,3.828427125,315,0],["ST",1,0,45,0],["ST",5,0,180,0],["MT",4,5.242640687,225,0],["PA",2.585786438,3.828427125,135,0]]],
  "seated": ["Seated", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",1.171572875,3.828427125,315,0],["ST",2,1,180,0],["ST",5,0,90,0],["MT",2.585786438,5.242640687,225,0],["PA",2.585786438,2.414213562,135,0]]],
  "hooray": ["Hooray!", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",2,1,45,0],["ST",1,-1.414213562,45,0],["ST",5,0,225,0],["MT",4.828427125,3.828427125,225,0],["PA",4,3.828427125,0,1]]],
  "thinker": ["Deep in Thought", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",4,1,90,0],["ST",0.585786438,-0.414213562,45,0],["ST",5,0,180,0],["MT",4,5,270,0],["PA",1,4,0,0]]],
  "greyhound": ["The Greyhound", [["LT",0,0,0,0],["LT",6,2,180,0],["PA",4,0,0,0],["SQ",6.5,-0.5,0,0],["MT",2.414213562,2.414213562,135,0],["ST",6,3.414213562,225,0],["ST",2,0,180,0]]],
  "horse": ["The Horse", [["LT",0,0,0,0],["LT",6,2,180,0],["PA",4.585786438,-0.828427125,45,0],["SQ",4.292893219,-2.121320344,0,0],["MT",2.414213562,2.414213562,135,0],["ST",4,3.414213562,225,0],["ST",-0.414213562,-0.414213562,45,0]]],
  "dachshund": ["The Dachshund", [["LT",0,0,0,0],["LT",6,2,180,0],["PA",6.828427125,1.414213562,45,1],["SQ",5.414213562,-1,0,0],["MT",1,3,270,0],["ST",6.828427125,2.828427125,225,0],["ST",-0.414213562,-0.414213562,45,0]]],
  "terrier": ["The Terrier", [["LT",0,0,0,0],["LT",6,2,180,0],["PA",4,-1.414213562,45,0],["SQ",6.121320344,-1.414213562,45,0],["MT",2.414213562,2.414213562,135,0],["ST",4,2,0,0],["ST",0,-1.414213562,45,0]]],
  "sitting-dog": ["The Sitting Dog", [["LT",0,0,0,0],["LT",6,2,180,0],["PA",4,-1.414213562,45,0],["SQ",3.707106781,-2.707106781,0,0],["MT",1.414213562,1.414213562,135,0],["ST",6,2,135,0],["ST",0,-1.414213562,45,0]]],
  "llama": ["The Llama", [["LT",0,0,0,0],["LT",6,2,180,0],["PA",5,1,90,1],["SQ",3.5,-3.5,0,0],["MT",2.414213562,2.414213562,135,0],["ST",6,2,135,0],["ST",0,-1.414213562,45,0]]],
  "watchdog": ["The Watchdog", [["LT",0,0,0,0],["LT",6,2,180,0],["PA",4.585786438,-0.828427125,45,0],["SQ",4.292893219,-2.121320344,0,0],["MT",2,2,135,0],["ST",6,3.414213562,225,0],["ST",-0.414213562,1.585786438,270,0]]],
  "deer": ["The Deer", [["LT",0,0,0,0],["LT",6,2,180,0],["PA",5,1,90,1],["SQ",3.5,-3.5,0,0],["MT",2,2,135,0],["ST",4,2,0,0],["ST",0.585786438,2,225,0]]],
  "fox": ["The Fox", [["LT",0,0,0,0],["LT",6,2,180,0],["PA",4,-1.414213562,45,0],["SQ",3.707106781,-2.707106781,0,0],["MT",2.414213562,2.414213562,135,0],["ST",6.414213562,0.414213562,90,0],["ST",-0.414213562,-0.414213562,45,0]]],
  "weasel": ["The Weasel", [["LT",0,0,0,0],["LT",6,2,180,0],["PA",5,1,0,0],["SQ",6.707106781,-1.121320344,45,0],["MT",2,2,135,0],["ST",6,3.414213562,225,0],["ST",-0.414213562,1.585786438,270,0]]],
  "whale": ["The Whale", [["LT",0,0,0,0],["LT",6,2,180,0],["SQ",4,-1,0,0],["MT",4.585786438,3.414213562,225,0],["PA",-1,1,0,0],["ST",5.5,-0.5,225,0],["ST",1,1,180,0]]],
  "arching-cat": ["The Arching Cat", [["LT",0,0,0,0],["LT",6,2,180,0],["SQ",4,-1,0,0],["MT",6,2,90,0],["PA",2,4,90,1],["ST",4.5,-1.5,0,0],["ST",0,0,315,0]]],
  "teapot": ["The Teapot", [["SQ",1,-2,0,0],["LT",4,2,180,0],["LT",2.828427125,2,135,0],["MT",1.414213562,3.414213562,45,0],["PA",0,4.828427125,90,1],["ST",0,2.828427125,225,0],["ST",4.242640687,3.414213562,225,0]]],
  "trophy": ["The Trophy", [["SQ",1,-2,0,0],["LT",4,2,180,0],["LT",0,2,0,0],["MT",1,5,270,0],["PA",5.414213562,2,135,0],["ST",-0.414213562,1.585786438,45,0],["ST",4,2,315,0]]],
  "guardsman": ["The Guardsman", [["SQ",1,-2,0,0],["LT",4,2,180,0],["LT",4,4.828427125,225,0],["MT",2.585786438,3.414213562,135,0],["PA",2.585786438,3.414213562,90,0],["ST",0.585786438,-1.414213562,45,0],["ST",2,0,315,0]]],
  "queen": ["The Queen", [["SQ",1,-2,0,0],["LT",4,2,180,0],["LT",4,2,135,0],["MT",3.171572875,4.828427125,180,0],["PA",2,0,0,0],["ST",0.585786438,-1.414213562,45,0],["ST",2,0,315,0]]],
  "bonnet": ["The Lady in a Bonnet", [["SQ",1,-2,0,0],["LT",4,2,180,0],["LT",4,2,135,0],["MT",3.171572875,4.828427125,180,0],["PA",2,0,135,0],["ST",1.171572875,3.414213562,225,0],["ST",4,0,180,0]]],
  "waiter": ["The Waiter", [["SQ",1,-2,0,0],["LT",4,2,180,0],["LT",2,4.828427125,225,0],["MT",0.585786438,5.414213562,270,0],["PA",1.414213562,0.585786438,135,0],["ST",0,-0.828427125,45,0],["ST",3,1,0,0]]],
  "chair-sitter": ["On a Chair", [["SQ",1,-2,0,0],["LT",4,2,180,0],["LT",2.828427125,2,135,0],["MT",2,4.828427125,180,0],["PA",4.828427125,1.414213562,45,1],["ST",2,0,135,0],["ST",4.242640687,3.414213562,225,0]]],
  "hen": ["The Hen", [["LT",0,4,270,0],["LT",4,4,180,0],["SQ",0,-1,0,0],["ST",1,-1,135,0],["ST",1.585786438,-1,180,0],["MT",4,4,225,0],["PA",3,1.585786438,0,0]]],
  "owl": ["The Owl", [["LT",0,4,270,0],["LT",4,4,180,0],["SQ",0,-1,0,0],["ST",0,0,270,0],["ST",2,0,225,0],["MT",1,1,315,0],["PA",3.414213562,5.414213562,45,1]]],
  "swan": ["The Swan", [["LT",0,4,270,0],["LT",4,4,180,0],["SQ",0,-1,0,0],["ST",1.5,-0.5,225,0],["ST",1.5,-1.914213562,180,0],["MT",3,3,315,0],["PA",5,1,0,1]]],
  "penguin": ["The Penguin", [["LT",0,4,270,0],["LT",4,4,180,0],["SQ",0,-1,0,0],["ST",1.914213562,-1.914213562,135,0],["ST",-0.914213562,-0.5,315,0],["MT",1.414213562,5.414213562,225,0],["PA",4.242640687,4,135,0]]],
  "armchair": ["The Armchair", [["LT",0,4,270,0],["LT",4,4,180,0],["SQ",0,-1,0,0],["ST",1.914213562,-1.914213562,135,0],["ST",2,-2,90,0],["MT",4,2,90,0],["PA",4,4,135,1]]],
  "rooster": ["The Rooster", [["LT",0,4,270,0],["LT",4,4,180,0],["SQ",0,-1,0,0],["ST",1,-1,135,0],["ST",1.5,-0.5,225,0],["MT",3.414213562,3.414213562,225,0],["PA",6.242640687,0.585786438,135,0]]],
  "boot": ["The Boot", [["LT",0,4,270,0],["LT",4,4,180,0],["SQ",0,-1,0,0],["ST",0,0,270,0],["ST",2,0,225,0],["MT",3.414213562,3.414213562,225,0],["PA",2.414213562,1,0,0]]],
  "duck": ["The Duck", [["LT",0,4,270,0],["LT",4,4,180,0],["SQ",0,-1,0,0],["ST",1.5,-2.5,90,0],["ST",1.5,-2.5,45,0],["MT",4,4,225,0],["PA",7.414213562,2.585786438,0,1]]],
  "hare": ["The Hare", [["LT",0,4,270,0],["LT",4,4,180,0],["SQ",0,-1,0,0],["ST",-0.5,0.5,270,0],["ST",0.5,-2.5,90,0],["MT",3,3,225,0],["PA",5.414213562,0.585786438,0,1]]],
  "glider": ["The Glider", [["LT",4,2,180,0],["LT",4,-2,90,0],["SQ",4.707106781,-0.707106781,45,0],["ST",5.414213562,2,270,0],["PA",1,1,0,1],["MT",0,2,0,0],["ST",3.414213562,2,135,0]]],
  "parrot": ["The Parrot", [["LT",4,2,180,0],["LT",4,-2,90,0],["SQ",4.707106781,-2.707106781,45,0],["ST",4,2,270,0],["PA",2.828427125,3.414213562,45,1],["MT",0,4,270,0],["ST",4.5,1.5,90,0]]],
  "toucan": ["The Toucan", [["LT",4,2,180,0],["LT",4,-2,90,0],["SQ",4.707106781,-2.121320344,45,0],["ST",5.414213562,-1.414213562,45,0],["PA",2,2,0,1],["MT",2,2,0,0],["ST",-1,3,0,0]]],
  "sparrow": ["The Sparrow", [["LT",4,2,180,0],["LT",4,-2,90,0],["SQ",4.707106781,-2.707106781,45,0],["ST",5.414213562,-1.292893219,45,0],["PA",2.414213562,-0.414213562,135,0],["MT",2,2,0,0],["ST",3,3,315,0]]],
  "pelican": ["The Pelican", [["LT",4,2,180,0],["LT",4,-2,90,0],["SQ",4.707106781,-2.121320344,45,0],["ST",5.414213562,0.585786438,270,0],["PA",2,2,135,0],["MT",0.585786438,4.828427125,225,0],["ST",3.414213562,2,135,0]]],
  "pagoda": ["The Pagoda", [["LT",2.828427125,0,135,0],["LT",0,2.828427125,315,0],["MT",1.414213562,-1.414213562,45,0],["SQ",1.414213562,-2.414213562,0,0],["PA",2.414213562,-2.414213562,0,1],["ST",-1.414213562,1.414213562,315,0],["ST",4.414213562,-0.414213562,180,0]]],
  "pot-plant": ["The Pot Plant", [["LT",2.828427125,0,135,0],["LT",0,2.828427125,315,0],["MT",-0.585786438,0,270,0],["SQ",0.414213562,-2,0,0],["PA",0.414213562,-1,135,1],["ST",2.414213562,-3,90,0],["ST",3.828427125,-2,135,0]]],
  "cat-curled": ["The Cat Curled Up", [["SQ",-1,-2,0,0],["ST",-1,-1,270,0],["ST",1,-3,90,0],["LT",2,-2,90,0],["LT",2,2,180,0],["MT",0.585786438,3.414213562,225,0],["PA",0.585786438,3.414213562,45,1]]],
  "cat-crouching": ["The Cat Crouching", [["SQ",-1,-2,0,0],["ST",-1,-1,270,0],["ST",1,-3,90,0],["LT",3,1,180,0],["LT",-1,1,0,0],["MT",2.414213562,1.585786438,45,0],["PA",3.121320344,2.292893219,0,0]]],
  "cat-stretching": ["The Cat Stretching", [["SQ",-1,-2,0,0],["ST",-1,-1,270,0],["ST",1,-3,90,0],["LT",3,1,180,0],["LT",3.828427125,3.828427125,225,0],["MT",5.242640687,2.414213562,135,0],["PA",6.656854249,2.414213562,135,0]]],
  "kitten": ["The Kitten", [["SQ",-1,-2,0,0],["ST",-1,-1,270,0],["ST",1,-3,90,0],["LT",-0.5,3.5,270,0],["LT",0.5,0.5,0,0],["MT",2.085786438,2.914213562,315,0],["PA",1.5,1.5,90,0]]],
  "cat-pouncing": ["The Cat Pouncing", [["SQ",-1,-2,0,0],["ST",-1,-1,270,0],["ST",1,-3,90,0],["LT",2.5,1.5,180,0],["LT",3.328427125,2.328427125,225,0],["MT",3.328427125,2.328427125,270,0],["PA",4.742640687,2.328427125,135,0]]],
  "cat-prowling": ["The Cat on the Prowl", [["SQ",-1,-2,0,0],["ST",-1,-1,270,0],["ST",1,-3,90,0],["LT",-2.328427125,2.328427125,315,0],["LT",3.328427125,0.914213562,135,0],["MT",-0.328427125,2.328427125,90,0],["PA",3.328427125,0.914213562,90,0]]],
  "cat-lying": ["The Cat Lying Down", [["SQ",-1,-2,0,0],["ST",-1,-1,270,0],["ST",1,-3,90,0],["LT",-1,3,270,0],["LT",4,2,180,0],["MT",2.585786438,3.414213562,225,0],["PA",6,2,0,1]]],
  "cat-leaping": ["The Cat Leaping", [["SQ",-1,-2,0,0],["ST",-1,-1,270,0],["ST",1,-3,90,0],["LT",3,1,180,0],["LT",3.828427125,3.828427125,225,0],["MT",-1,1,0,0],["PA",5.828427125,-0.414213562,135,0]]],
  "tortoise": ["The Tortoise", [["LT",4,2,180,0],["LT",0,2,0,0],["MT",4,2,45,0],["PA",2,0,135,0],["SQ",-1,2,0,0],["ST",3.414213562,3.414213562,0,0],["ST",-0.121320344,1.414213562,135,0]]],
  "fish": ["The Fish", [["LT",4,2,180,0],["LT",0,2,0,0],["MT",4.414213562,1.585786438,45,0],["PA",1.414213562,0.585786438,135,0],["SQ",3.707106781,2.292893219,45,0],["ST",4.121320344,1.292893219,0,0],["ST",-1.707106781,2.292893219,270,0]]],
  "carp": ["The Carp", [["LT",4,2,180,0],["LT",0,2,0,0],["MT",5,1,90,0],["PA",2,0,0,1],["SQ",-1,2,0,0],["ST",4,1,315,0],["ST",1,1,135,0]]],
  "letter-l": ["The Letter L", [["LT",4.25,8,180,0],["LT",0.25,8,270,0],["MT",0.25,4,315,0],["PA",1.25,1,90,0],["SQ",3.25,6,0,0],["ST",0.25,2,270,0],["ST",1.664213562,1.414213562,225,0]]],
  "letter-t": ["The Letter T", [["LT",2.25,0,0,0],["LT",2.25,4,270,0],["MT",2.25,4,315,0],["PA",3.664213562,7.414213562,90,1],["SQ",1.542893219,-0.707106781,45,0],["ST",2.25,6,45,0],["ST",4.835786438,1.414213562,315,0]]],
  "letter-n": ["The Letter N", [["LT",0,2,0,0],["LT",4,2,90,0],["MT",0,2,270,0],["PA",1,5,90,1],["SQ",3.292893219,-0.121320344,45,0],["ST",0,6,270,0],["ST",2.585786438,4.585786438,45,0]]],
  "letter-m": ["The Letter M", [["LT",0,0.25,45,0],["LT",0.828427125,1.078427125,0,0],["MT",3.414213562,2.492640687,315,0],["PA",4.828427125,5.906854249,90,1],["SQ",0.707106781,2.371320344,45,0],["ST",4.828427125,1.078427125,180,0],["ST",1.414213562,4.492640687,135,0]]],
  "letter-a": ["The Letter A", [["LT",6,5,180,0],["LT",4,3,135,0],["MT",6,5,90,0],["PA",4,1.585786438,135,0],["SQ",3.292893219,-0.535533906,45,0],["ST",4,3,270,0],["ST",5,2,90,0]]],
  "letter-e": ["The Letter E", [["LT",2,0,90,0],["LT",0,6,270,0],["MT",0,0,0,0],["PA",3,5,0,1],["SQ",2.707106781,-0.707106781,45,0],["ST",4,6,180,0],["ST",3.414213562,2.585786438,135,0]]],
  "letter-f": ["The Letter F", [["LT",2,0,90,0],["LT",0,6,270,0],["MT",0,0,0,0],["PA",0,7.414213562,135,1],["SQ",2.707106781,-0.707106781,45,0],["ST",3.414213562,0,45,0],["ST",2,2.585786438,45,0]]],
  "letter-c": ["The Letter C", [["LT",0,6.75,270,0],["LT",4,6.75,180,0],["MT",0,2.75,315,0],["PA",0,2.75,135,1],["SQ",2.121320344,-0.785533906,45,0],["ST",2.828427125,-0.078427125,45,0],["ST",4,6.75,225,0]]],
  "letter-k": ["The Letter K", [["LT",0,1.5,0,0],["LT",0,5.5,270,0],["MT",0,5.5,315,0],["PA",5.414213562,0.085786438,135,0],["SQ",0.707106781,-0.621320344,45,0],["ST",0,5.5,45,0],["ST",1.414213562,4.085786438,315,0]]],
  "digit-one": ["The Figure 1", [["LT",1.5,5,45,0],["LT",3.5,3,90,0],["MT",3.5,3,135,0],["PA",3.5,3,90,1],["SQ",3.5,6,0,0],["ST",2.5,0,90,0],["ST",0.085786438,7.828427125,315,0]]],
  "digit-four": ["The Figure 4", [["LT",4.5,5.5,180,0],["LT",4.5,1.5,90,0],["MT",4.5,1.5,135,0],["PA",0.5,5.5,135,1],["SQ",3.792893219,4.792893219,45,0],["ST",4.5,1.5,225,0],["ST",4.5,4.085786438,45,0]]],
  "digit-seven": ["The Figure 7", [["LT",4.078427125,2.828427125,225,0],["LT",4.078427125,4,270,0],["MT",2.664213562,4.242640687,315,0],["PA",2.664213562,1.414213562,45,1],["SQ",2.078427125,4.656854249,0,0],["ST",5.492640687,1.414213562,225,0],["ST",2.078427125,7.656854249,270,0]]],
  "umbrella": ["The Umbrella", [["LT",2,1.75,0,0],["LT",6,1.75,180,0],["MT",6,1.75,45,0],["PA",4.585786438,3.164213562,90,0],["SQ",1,1.75,0,0],["ST",4.585786438,5.164213562,90,0],["ST",3.585786438,8.164213562,270,0]]],
  "key": ["The Key", [["LT",0,0,45,0],["LT",2.828427125,2.828427125,225,0],["MT",2.828427125,0.828427125,0,0],["PA",6.828427125,0.828427125,0,1],["SQ",5.828427125,0.828427125,0,0],["ST",8.242640687,2.242640687,225,0],["ST",7.828427125,3.828427125,270,0]]],
  "hammer": ["The Hammer", [["LT",1.75,0,0,0],["LT",1.75,4,270,0],["MT",1.75,4,315,0],["PA",1.75,4,45,0],["SQ",1.042893219,-0.707106781,45,0],["ST",1.75,5.414213562,45,0],["ST",1.75,6.828427125,0,0]]],
  "anvil": ["The Anvil", [["LT",0.75,0,0,0],["LT",4.75,0,90,0],["MT",4.75,0,0,0],["PA",2.164213562,1.414213562,45,1],["SQ",2.75,3,0,0],["ST",2.75,4,270,0],["ST",5.335786438,1.414213562,315,0]]],
  "teacup": ["The Teacup", [["LT",0.25,0,0,0],["LT",0.25,0,45,0],["MT",2.25,2,315,0],["PA",1.078427125,2.828427125,0,0],["SQ",4.371320344,-0.121320344,45,0],["ST",2.078427125,3.828427125,180,0],["ST",5.078427125,2,135,0]]],
  "goblet": ["The Goblet", [["LT",3,0.75,90,0],["LT",3.828427125,-0.078427125,135,0],["MT",4.414213562,2.164213562,135,0],["PA",3,6.75,90,1],["SQ",3,-0.25,0,0],["ST",2,7.75,270,0],["ST",4,7.75,180,0]]],
  "chair": ["The Chair", [["LT",0,2.5,45,0],["LT",2.828427125,5.328427125,135,0],["MT",0,2.5,315,0],["PA",1.828427125,4.328427125,0,0],["SQ",4.121320344,4.621320344,45,0],["ST",0.414213562,2.085786438,270,0],["ST",4.828427125,8.156854249,225,0]]],
  "aeroplane": ["The Aeroplane", [["LT",2.75,1.68850603,0,0],["LT",2.75,5.68850603,270,0],["MT",2.75,1.68850603,270,0],["PA",8.164213562,1.68850603,135,0],["SQ",2.042893219,0.981399248,45,0],["ST",-0.078427125,3.102719592,315,0],["ST",6.75,3.102719592,315,0]]],
  "kite": ["The Kite", [["LT",4,2.75,180,0],["LT",0,2.75,0,0],["MT",4,4.75,180,0],["PA",2.585786438,-0.078427125,45,0],["SQ",2.707106781,4.042893219,45,0],["ST",4,1.335786438,45,0],["ST",5.414213562,2.75,135,0]]],
  "sailboat": ["The Sailing Boat", [["LT",2,1.171572875,45,0],["MT",2,4,180,0],["LT",0,4,0,0],["ST",4,4,90,0],["ST",0,6,270,0],["PA",3,2.171572875,90,1],["SQ",3.707106781,-0.535533906,45,0]]],
  "cat-sitting": ["The Sitting Cat", [["LT",0,4,270,0],["LT",4,4,180,0],["SQ",-1,-2,0,0],["ST",-1,-1,270,0],["ST",1,-3,90,0],["MT",4,2,90,0],["PA",7,3,0,1]]],
  "house": ["The House", [["LT",4,2,180,0],["LT",0,2,0,0],["MT",0,4,270,0],["ST",4,2,90,0],["ST",4,4,180,0],["PA",3.5,1.5,90,1],["SQ",-0.707106781,1.878679656,45,0]]],
  "fir-tree": ["The Fir Tree", [["ST",1,0,180,0],["MT",0,0,45,0],["LT",2,3.414213562,180,0],["LT",2,5.414213562,180,0],["SQ",0,4.707106781,45,0],["ST",0,6.828427125,0,0],["PA",-2,6.828427125,0,0]]],
  "dancer": ["The Dancer", [["SQ",2,-2,0,0],["LT",1,0,0,0],["LT",5,4,180,0],["MT",5,6,270,0],["PA",1,4,0,1],["ST",7,0,180,0],["ST",-1,0,0,0]]],
  "goose": ["The Goose", [["LT",4,4,180,0],["LT",2,2,0,0],["ST",6,2,180,0],["PA",2,0,90,0],["SQ",0,-1,0,0],["ST",1.5,-2.5,90,0],["MT",3.414213562,5.414213562,225,0]]],
  "arrow": ["The Arrow", [["LT",0,1,0,0],["LT",6,3,180,0],["MT",4,3,0,0],["ST",2,3,180,0],["ST",5,2,270,0],["SQ",5,1,0,0],["PA",5,2,90,1]]],
  "rabbit": ["The Rabbit", [["SQ",2,0,0,0],["PA",4,-3,90,0],["ST",3,-2,90,0],["LT",1,4,270,0],["LT",5,4,180,0],["MT",3.585786438,5.414213562,225,0],["ST",3.171572875,5,180,0]]],
  "bunny": ["The Bunny", [["SQ",2,0,0,0],["PA",4,-3,90,0],["ST",3,-2,90,0],["LT",6,3,180,0],["LT",2,3,0,0],["MT",3,2,135,0],["ST",2,3,90,0]]],
  "rabbit-hopping": ["The Rabbit Hopping", [["SQ",2,0,0,0],["PA",4,-3,90,0],["ST",3,-2,90,0],["LT",4,1,90,0],["LT",1.171572875,2.171572875,45,0],["MT",4,3,270,0],["ST",1.171572875,2.171572875,90,0]]],
  "mermaid": ["The Mermaid", [["SQ",1,-2,0,0],["LT",4,2,180,0],["LT",0,2,0,0],["MT",3.414213562,2.585786438,45,0],["PA",3.414213562,4,0,0],["ST",2,0,135,0],["ST",3.414213562,1.414213562,225,0]]],
  "skier": ["The Skier", [["SQ",1,-2,0,0],["LT",4,2,180,0],["LT",0,2,0,0],["MT",0.585786438,2.585786438,45,0],["PA",0.585786438,4,135,0],["ST",0.585786438,2.585786438,135,0],["ST",3,1,0,0]]]
};
