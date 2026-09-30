/* The Puzzle Cabinet · paper.js
 *
 * A sheet of paper that folds flat and can be cut through all its layers.
 *
 * The sheet is kept as facets. Each facet is a polygon in the coordinates of
 * the flat, unfolded sheet, with a matrix that carries it to where it lies
 * now, and a layer number (higher = nearer the viewer). A fold reflects every
 * facet (or part of a facet) on one side of the fold line; a cut splits every
 * facet along the cut line. Because facets remember their unfolded
 * coordinates, unfolding after a cut is free: just draw each piece with the
 * identity matrix.
 *
 *   const p = new Cabinet.Paper([[0,0],[10,0],[10,10],[0,10]]);
 *   p.fold([5,0], [5,10], { side: -1 });  // fold the part right of the line over
 *   p.cut([2,2], [8,8]);                  // one straight cut through all layers
 *   p.pieces()  -> unfolded pieces [{ poly, side }]
 */
(function (root) {
  'use strict';

  const C = root.Cabinet = root.Cabinet || {};
  const G = C.geom;

  function Paper(outline, opts) {
    opts = opts || {};
    this.facets = [{ poly: outline.map((p) => p.slice()), m: G.M.id(), layer: 0, side: 0, id: 0 }];
    this.nextId = 1;
    this.creases = []; // [{ a, b }] fold lines in unfolded coordinates, for drawing
    this.cuts = [];    // cut segments in current coordinates at the time of cutting
    this.folds = 0;
    this.cutDone = false;
    this.outline = outline.map((p) => p.slice());
    this.front = opts.front || '#f4efe1';
    this.back = opts.back || '#d9cfb6';
  }

  Paper.prototype.clone = function () {
    const p = new Paper(this.outline);
    p.facets = this.facets.map((f) => ({ poly: f.poly.map((q) => q.slice()), m: f.m.slice(), layer: f.layer, side: f.side, id: f.id }));
    p.nextId = this.nextId;
    p.creases = this.creases.map((c) => ({ a: c.a.slice(), b: c.b.slice() }));
    p.cuts = this.cuts.map((c) => ({ a: c.a.slice(), b: c.b.slice() }));
    p.folds = this.folds;
    p.cutDone = this.cutDone;
    return p;
  };

  Paper.prototype.toJSON = function () {
    return { f: this.facets.map((f) => [f.poly.map((q) => G.round(q, 1e5)), f.m.map((v) => Math.round(v * 1e6) / 1e6), f.layer, f.side]), c: this.creases, x: this.cuts, n: this.folds, k: this.cutDone ? 1 : 0, o: this.outline };
  };
  Paper.fromJSON = function (j) {
    const p = new Paper(j.o);
    p.facets = j.f.map((f, i) => ({ poly: f[0], m: f[1], layer: f[2], side: f[3] || 0, id: i }));
    p.nextId = p.facets.length;
    p.creases = j.c || [];
    p.cuts = j.x || [];
    p.folds = j.n || 0;
    p.cutDone = !!j.k;
    return p;
  };

  // each facet where it lies now: [{ poly, layer, flipped, facet }] sorted bottom to top
  Paper.prototype.current = function () {
    return this.facets.map((f) => ({
      poly: f.poly.map((q) => G.M.apply(f.m, q)),
      layer: f.layer,
      flipped: G.M.det(f.m) < 0,
      facet: f
    })).sort((a, b) => a.layer - b.layer);
  };

  Paper.prototype.bounds = function () {
    return G.bbox(this.current().map((c) => c.poly));
  };

  // area of paper on each side of a line (in current coordinates)
  Paper.prototype.sideAreas = function (a, b) {
    let left = 0, right = 0;
    this.current().forEach((c) => {
      const parts = G.splitPoly(c.poly, a, b);
      if (!parts) {
        const s = G.side(G.centroid(c.poly), a, b);
        if (s > 0) left += G.absArea(c.poly); else right += G.absArea(c.poly);
      } else parts.forEach((pc) => { if (pc.side > 0) left += G.absArea(pc.poly); else right += G.absArea(pc.poly); });
    });
    return { left, right };
  };

  /* Fold along the line a-b (current coordinates).
   *   opts.side:  +1 moves the paper left of a->b, -1 the paper right of it,
   *               0 or missing moves the side with less paper
   *   opts.mountain: fold behind (the moving part goes under every layer)
   * Returns false when no paper lies on the moving side. */
  Paper.prototype.fold = function (a, b, opts) {
    opts = opts || {};
    let side = opts.side;
    if (!side) {
      const ar = this.sideAreas(a, b);
      side = ar.left <= ar.right ? 1 : -1;
    }
    const R = G.M.reflect(a, b);
    const stay = [], move = [];
    let maxLayer = -Infinity, minLayer = Infinity;
    this.facets.forEach((f) => {
      maxLayer = Math.max(maxLayer, f.layer);
      minLayer = Math.min(minLayer, f.layer);
      const inv = G.M.inv(f.m);
      const la = G.M.apply(inv, a), lb = G.M.apply(inv, b);
      // the facet's own orientation decides which local side is "left"
      const flipped = G.M.det(f.m) < 0;
      const parts = G.splitPoly(f.poly, la, lb);
      if (!parts) {
        const c = G.M.apply(f.m, G.centroid(f.poly));
        const s = G.side(c, a, b) > 0 ? 1 : -1;
        (s === side ? move : stay).push(f);
      } else {
        parts.forEach((pc) => {
          const s = (flipped ? -pc.side : pc.side);
          const nf = { poly: pc.poly, m: f.m.slice(), layer: f.layer, side: f.side, id: this.nextId++ };
          (s === side ? move : stay).push(nf);
        });
      }
    });
    if (!move.length) return false;
    const top = maxLayer, bottom = minLayer;
    move.forEach((f) => {
      f.m = G.M.mul(R, f.m);
      // the moving stack turns over: its top becomes its bottom
      f.layer = opts.mountain ? bottom - 1 - (f.layer - bottom) : top + 1 + (top - f.layer);
    });
    this.facets = stay.concat(move);
    this.normLayers();
    // record the crease on the unfolded sheet (for each facet the line crossed)
    this.facets.forEach((f) => {
      const inv = G.M.inv(f.m);
      const la = G.M.apply(inv, a), lb = G.M.apply(inv, b);
      const seg = clipLineToPoly(la, lb, f.poly);
      if (seg) this.creases.push({ a: G.round(seg[0], 1e5), b: G.round(seg[1], 1e5) });
    });
    this.folds++;
    return true;
  };

  Paper.prototype.normLayers = function () {
    const ls = Array.from(new Set(this.facets.map((f) => f.layer))).sort((x, y) => x - y);
    const map = new Map(ls.map((l, i) => [l, i]));
    this.facets.forEach((f) => { f.layer = map.get(f.layer); });
  };

  /* One straight cut along the line a-b through every layer.
   * Each facet is split; each piece remembers which side of the cut it fell
   * on (side +1 / -1, in current coordinates). */
  Paper.prototype.cut = function (a, b) {
    const out = [];
    let any = false;
    this.facets.forEach((f) => {
      const inv = G.M.inv(f.m);
      const la = G.M.apply(inv, a), lb = G.M.apply(inv, b);
      const flipped = G.M.det(f.m) < 0;
      const parts = G.splitPoly(f.poly, la, lb);
      if (!parts) {
        const c = G.M.apply(f.m, G.centroid(f.poly));
        out.push(Object.assign({}, f, { side: G.side(c, a, b) > 0 ? 1 : -1 }));
      } else {
        any = true;
        parts.forEach((pc) => out.push({ poly: pc.poly, m: f.m.slice(), layer: f.layer, side: flipped ? -pc.side : pc.side, id: this.nextId++ }));
      }
    });
    this.facets = out;
    this.cuts.push({ a: a.slice(), b: b.slice() });
    this.cutDone = true;
    return any;
  };

  // the unfolded pieces: facets in sheet coordinates with their cut side
  Paper.prototype.pieces = function () {
    return this.facets.map((f) => ({ poly: f.poly, side: f.side }));
  };

  // the unfolded sheet split by side: { plus: [polys], minus: [polys] }
  Paper.prototype.sides = function () {
    const plus = [], minus = [];
    this.facets.forEach((f) => (f.side > 0 ? plus : minus).push(f.poly));
    return { plus, minus };
  };

  function clipLineToPoly(a, b, poly) {
    // the part of the infinite line a-b inside a convex-ish polygon (first and last crossing)
    const ts = [];
    const d = G.sub(b, a);
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length];
      const e = G.sub(q, p), den = G.cross(d, e);
      if (Math.abs(den) < 1e-12) continue;
      const w = G.sub(p, a);
      const t = G.cross(w, e) / den, u = G.cross(w, d) / den;
      if (u >= -1e-9 && u <= 1 + 1e-9) ts.push(t);
    }
    if (ts.length < 2) return null;
    ts.sort((x, y) => x - y);
    const p0 = G.add(a, G.mul(d, ts[0])), p1 = G.add(a, G.mul(d, ts[ts.length - 1]));
    if (G.dist(p0, p1) < 1e-7) return null;
    return [p0, p1];
  }

  C.Paper = Paper;
})(typeof window !== 'undefined' ? window : globalThis);
