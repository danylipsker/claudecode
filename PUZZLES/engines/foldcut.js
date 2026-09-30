/* The Puzzle Cabinet · engines/foldcut.js
 *
 * Fold and cut: fold a sheet of paper flat as often as you like, make one
 * straight cut through every layer, and unfold. The pieces on one side of the
 * cut must make the shape in the picture.
 *
 * The paper is a Cabinet.Paper (js/paper.js): facets that remember where they
 * lie on the flat sheet, so unfolding after the cut is free. The engine keeps
 * the list of folds and cuts as its state and rebuilds the paper from it; the
 * animations (a flap turning over its crease, the sheet opening fold by fold)
 * are drawn from the same list, stage by stage.
 *
 * data: {
 *   sheet: [10, 10],                   the sheet, w × h (default 10 × 10)
 *   target: [[x, y, x, y, …], …],      the outline of the shape (loops, even-odd: holes allowed)
 *   sol: [[ax, ay, bx, by, side], …],  a fold sequence that works (side +1/-1 = which side of a→b
 *                                      moves, 0 = the side with less paper)
 *   cut: [ax, ay, bx, by] | [[…], …],  the cut (or cuts) after those folds
 *   keep: '+' | '-' | '+-' …           which side of the cut(s) is the shape
 *   cuts: 1,                           how many cuts are allowed (default 1)
 *   color: '#d9483b'                   the colour of the paper (the back is white)
 * }
 */
(function (root) {
  'use strict';
  const C = root.Cabinet;
  const G = C.geom;
  const M = G.M;

  /* ---------- pure geometry (node and browser) ---------- */

  const COLORS = ['#d9483b', '#2f7fc1', '#e59a2f', '#3a9d6a', '#8e5bc8', '#d45d8c', '#1f9aa3', '#c9a227'];
  const BACK = '#f7f2e6';
  const r5 = (v) => Math.round(v * 1e5) / 1e5;

  function sheetOf(p) { return (p && p.data && p.data.sheet) || [10, 10]; }
  function sheetPoly(s) { return [[0, 0], [s[0], 0], [s[0], s[1]], [0, s[1]]]; }
  function mkPaper(s) { return new C.Paper(sheetPoly(s)); }
  function foldPaper(pp, f) { return pp.fold([f[0], f[1]], [f[2], f[3]], { side: f[4] || 0 }); }
  function cutPaper(pp, c) { return pp.cut([c[0], c[1]], [c[2], c[3]]); }
  function cutsOf(d) { if (!d.cut) return []; return typeof d.cut[0] === 'number' ? [d.cut] : d.cut; }
  function loopsOf(flat) { return (flat || []).map((l) => { const out = []; for (let i = 0; i + 1 < l.length; i += 2) out.push([l[i], l[i + 1]]); return out; }); }
  function flatOf(loops, k) { k = k || 1000; return loops.map((l) => { const out = []; l.forEach((q) => out.push(Math.round(q[0] * k) / k, Math.round(q[1] * k) / k)); return out; }); }

  // a paper with these folds (and cuts) made
  function build(s, folds, cuts) {
    const pp = mkPaper(s);
    let bad = -1;
    (folds || []).forEach((f, i) => { if (!foldPaper(pp, f) && bad < 0) bad = i; });
    (cuts || []).forEach((c) => cutPaper(pp, c));
    return { pp, bad };
  }

  // is q inside (or on the edge of) a convex polygon wound counter-clockwise in maths axes?
  function inConvex(q, poly, eps) {
    eps = eps == null ? 1e-7 : eps;
    const n = poly.length;
    let sgn = 0;
    for (let i = 0; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % n];
      const c = G.cross(G.sub(b, a), G.sub(q, a));
      const l = G.dist(a, b) || 1;
      if (Math.abs(c) / l <= eps) continue;
      const s = c > 0 ? 1 : -1;
      if (!sgn) sgn = s; else if (s !== sgn) return false;
    }
    return true;
  }

  // which side of every cut a facet lies on: '+-' …
  function codeOf(f, cuts) {
    const c = M.apply(f.m, G.centroid(f.poly));
    return cuts.map((k) => (G.side(c, [k[0], k[1]], [k[2], k[3]]) > 0 ? '+' : '-')).join('');
  }
  function regionsOf(pp, cuts) {
    const map = {};
    pp.facets.forEach((f) => { const k = codeOf(f, cuts); (map[k] = map[k] || []).push(f); });
    return map;
  }

  /* The outline of a union of facets (all in sheet coordinates, from one
   * partition of the sheet): split every edge where another vertex lies on it,
   * cancel the edges two facets share, chain what is left into loops. Outer
   * loops keep the facets' winding, holes run the other way. */
  function outlineOf(polys, tol) {
    tol = tol || 2e-5; // js/paper.js nudges lines by ~1e-6 where they pass through corners
    const V = [];
    const vid = (p) => {
      for (let i = 0; i < V.length; i++) if (Math.abs(V[i][0] - p[0]) < tol && Math.abs(V[i][1] - p[1]) < tol) return i;
      V.push(p);
      return V.length - 1;
    };
    const E = [];
    polys.forEach((poly) => poly.forEach((p, i) => { E.push([vid(p), vid(poly[(i + 1) % poly.length])]); }));
    const sub = [];
    E.forEach((e) => {
      const a = e[0], b = e[1];
      if (a === b) return;
      const A = V[a], B = V[b], d = G.sub(B, A), L2 = G.dot(d, d);
      const on = [];
      for (let k = 0; k < V.length; k++) {
        if (k === a || k === b) continue;
        const t = G.dot(G.sub(V[k], A), d) / L2;
        if (t <= 1e-9 || t >= 1 - 1e-9) continue;
        if (G.dist(G.add(A, G.mul(d, t)), V[k]) < tol * 5) on.push([t, k]);
      }
      on.sort((x, y) => x[0] - y[0]);
      let prev = a;
      on.forEach((o) => { if (o[1] !== prev) sub.push([prev, o[1]]); prev = o[1]; });
      if (prev !== b) sub.push([prev, b]);
    });
    const cnt = new Map();
    sub.forEach((e) => { const k = e[0] + ',' + e[1]; cnt.set(k, (cnt.get(k) || 0) + 1); });
    const out = new Map(); // start -> [end, ...]
    let left = 0;
    cnt.forEach((n, k) => {
      const ab = k.split(',').map(Number);
      const net = n - (cnt.get(ab[1] + ',' + ab[0]) || 0);
      for (let i = 0; i < net; i++) { (out.get(ab[0]) || out.set(ab[0], []).get(ab[0])).push(ab[1]); left++; }
    });
    const loops = [];
    let guard = 0;
    while (left > 0 && guard++ < 10000) {
      let s = -1;
      for (const [k, v] of out) if (v.length) { s = k; break; }
      if (s < 0) break;
      const loop = [s];
      let cur = s, steps = 0;
      while (steps++ < 100000) {
        const nx = out.get(cur);
        if (!nx || !nx.length) break;
        const n = nx.pop();
        left--;
        if (n === s) break;
        loop.push(n);
        cur = n;
      }
      const pts = G.clean(loop.map((i) => V[i]), 1e-5);
      if (pts.length >= 3 && G.absArea(pts) > 1e-6) loops.push(pts);
    }
    return loops;
  }

  // fill loops with the even-odd rule into a mask
  function rasterEO(loops, box, W, H) {
    const out = new Uint8Array(W * H);
    loops.forEach((l) => {
      const m = G.raster([l], box, W, H);
      for (let i = 0; i < out.length; i++) out[i] ^= m[i];
    });
    return out;
  }

  // the symmetries of the sheet (as matrices)
  function symmetries(s) {
    const w = s[0], h = s[1], cx = w / 2, cy = h / 2;
    const list = [[1, 0, 0, 1, 0, 0], [-1, 0, 0, 1, w, 0], [1, 0, 0, -1, 0, h], [-1, 0, 0, -1, w, h]];
    if (Math.abs(w - h) < 1e-9) list.push([0, 1, -1, 0, cx + cy, cy - cx], [0, -1, 1, 0, cx - cy, cx + cy], [0, 1, 1, 0, 0, 0], [0, -1, -1, 0, w, h]);
    return list;
  }

  function sheetBox(s) {
    const pad = Math.max(s[0], s[1]) * 0.02;
    return { x0: -pad, y0: -pad, w: s[0] + 2 * pad, h: s[1] + 2 * pad };
  }

  /* How well do these facets (sheet coordinates) make the target?
   * Best IoU over the symmetries of the sheet. */
  function scoreAgainst(targetMask, polys, s, res, syms) {
    const box = sheetBox(s);
    const W = res, H = Math.max(8, Math.round(res * box.h / box.w));
    let best = { iou: 0, sym: 0 };
    (syms || symmetries(s)).forEach((m, si) => {
      const moved = polys.map((q) => q.map((v) => M.apply(m, v)));
      const mask = G.raster(moved, box, W, H);
      let both = 0, any = 0;
      for (let i = 0; i < mask.length; i++) { const a = mask[i], b = targetMask[i]; if (a && b) both++; if (a || b) any++; }
      const iou = both / Math.max(1, any);
      if (iou > best.iou) best = { iou, sym: si };
    });
    return best;
  }
  function targetMaskOf(loops, s, res) {
    const box = sheetBox(s);
    const W = res, H = Math.max(8, Math.round(res * box.h / box.w));
    return rasterEO(loops, box, W, H);
  }

  /* Compare what was cut with the target: each region (a side of the cut, or
   * with several cuts a cell between them) and, with more than two regions,
   * everything but one region. Returns the best { iou, code, polys, sym }. */
  function judge(pp, cuts, targetMask, s, res, syms) {
    const regs = regionsOf(pp, cuts);
    const codes = Object.keys(regs);
    const cands = codes.map((k) => ({ code: k, polys: regs[k].map((f) => f.poly) }));
    if (codes.length > 2) codes.forEach((k) => cands.push({ code: '!' + k, polys: pp.facets.filter((f) => codeOf(f, cuts) !== k).map((f) => f.poly) }));
    let best = { iou: 0, code: null, polys: [], sym: 0 };
    cands.forEach((c) => {
      const r = scoreAgainst(targetMask, c.polys, s, res, syms);
      if (r.iou > best.iou) best = { iou: r.iou, code: c.code, polys: c.polys, sym: r.sym };
    });
    return best;
  }

  // the facets of one region code ('+', '-+', or '!+-' = all but that one)
  function regionPolys(pp, cuts, code) {
    if (code && code[0] === '!') return pp.facets.filter((f) => codeOf(f, cuts) !== code.slice(1)).map((f) => f.poly);
    return pp.facets.filter((f) => codeOf(f, cuts) === code).map((f) => f.poly);
  }

  /* Points the fold and the knife snap to: the corners of every facet where
   * it lies now, the middles and quarter points of its edges, the centre of
   * the sheet, and any extra sheet points (the pencil outline) carried along
   * with the paper. */
  function landmarks(pp, s, extra) {
    const pts = [];
    const add = (q) => {
      for (let i = 0; i < pts.length; i++) if (Math.abs(pts[i][0] - q[0]) < 1e-5 && Math.abs(pts[i][1] - q[1]) < 1e-5) return;
      pts.push(q);
    };
    pp.current().forEach((c) => c.poly.forEach((p, i) => {
      const q = c.poly[(i + 1) % c.poly.length];
      add(p); add(G.mid(p, q));
      if (G.dist(p, q) > Math.max(s[0], s[1]) * 0.08) { add(G.lerp(p, q, 0.25)); add(G.lerp(p, q, 0.75)); }
    }));
    const marks = [[s[0] / 2, s[1] / 2]].concat(extra || []);
    marks.forEach((v) => pp.facets.forEach((f) => { if (inConvex(v, f.poly, 1e-5)) add(M.apply(f.m, v)); }));
    return pts;
  }

  // where each sheet point lies now (the first facet that holds it)
  function landMap(pp, pts) {
    return pts.map((v) => {
      for (const f of pp.facets) if (inConvex(v, f.poly, 1e-9)) return M.apply(f.m, v);
      return null;
    });
  }

  // an isometry (turn, move, maybe mirror) taking the points src onto dst, or null
  function fitIso(src, dst, tol) {
    tol = tol || 1e-3;
    const idx = [];
    for (let i = 0; i < src.length; i++) if (src[i] && dst[i]) idx.push(i);
    if (idx.length < 2) return null;
    let i0 = idx[0], i1 = idx[1], best = -1;
    for (const i of idx) for (const j of idx) { const d = G.dist(src[i], src[j]); if (d > best) { best = d; i0 = i; i1 = j; } }
    if (best < 1e-6) return null;
    if (Math.abs(G.dist(dst[i0], dst[i1]) - best) > tol * 10) return null;
    const a0 = src[i0], a1 = src[i1], b0 = dst[i0], b1 = dst[i1];
    const da = G.sub(a1, a0), db = G.sub(b1, b0);
    for (const mir of [false, true]) {
      let m = M.translate(-a0[0], -a0[1]);
      m = M.mul(M.rotate(-G.angle(da)), m);
      if (mir) m = M.mul([1, 0, 0, -1, 0, 0], m);
      m = M.mul(M.rotate(G.angle(db)), m);
      m = M.mul(M.translate(b0[0], b0[1]), m);
      let ok = true;
      for (const i of idx) if (G.dist(M.apply(m, src[i]), dst[i]) > tol * 10) { ok = false; break; }
      if (ok) return m;
    }
    return null;
  }

  // sample points of the sheet (irrational offsets keep them off the creases)
  function samples(s) {
    const out = [];
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) out.push([s[0] * ((i + 0.3183) / 6.0137), s[1] * ((j + 0.5772) / 6.0419)]);
    return out;
  }

  /* Is paper A folded "the same" as paper B, up to a symmetry of the sheet
   * and a motion of the whole packet? Returns { T, sym } with
   * where-A-puts(p) = T(where-B-puts(sym p)), or null. */
  function sameFolding(A, B, s) {
    const pts = samples(s);
    const la = landMap(A, pts);
    const syms = symmetries(s);
    for (let k = 0; k < syms.length; k++) {
      const lb = landMap(B, pts.map((q) => M.apply(syms[k], q)));
      const T = fitIso(lb, la, 2e-3 * Math.max(s[0], s[1]));
      if (T) return { T, sym: k };
    }
    return null;
  }

  // where a fold line and its moving side end up after the motion T
  function moveFold(f, T, pp) {
    const a = M.apply(T, [f[0], f[1]]), b = M.apply(T, [f[2], f[3]]);
    let side = f[4] || 0;
    if (!side && pp) { const ar = pp.sideAreas([f[0], f[1]], [f[2], f[3]]); side = ar.left <= ar.right ? 1 : -1; }
    if (M.det(T) < 0) side = -side;
    return [a[0], a[1], b[0], b[1], side];
  }

  // a line clipped to a box: the two points where it enters and leaves, or null
  function clipLine(a, b, box, extra) {
    extra = extra || 0;
    const x0 = box.x0 - extra, y0 = box.y0 - extra, x1 = box.x1 + extra, y1 = box.y1 + extra;
    const d = G.sub(b, a);
    let t0 = -Infinity, t1 = Infinity;
    const p = [-d[0], d[0], -d[1], d[1]], q = [a[0] - x0, x1 - a[0], a[1] - y0, y1 - a[1]];
    for (let i = 0; i < 4; i++) {
      if (Math.abs(p[i]) < 1e-12) { if (q[i] < 0) return null; continue; }
      const t = q[i] / p[i];
      if (p[i] < 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
    }
    if (t0 > t1) return null;
    return [G.add(a, G.mul(d, t0)), G.add(a, G.mul(d, t1))];
  }

  // a segment clipped to a convex polygon (counter-clockwise), or null
  function clipSeg(a, b, poly) {
    let t0 = 0, t1 = 1;
    const d = G.sub(b, a);
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i], q = poly[(i + 1) % poly.length];
      const e = G.sub(q, p);
      // inside = left of p->q (cross >= 0)
      const num = G.cross(e, G.sub(a, p)), den = G.cross(e, d);
      if (Math.abs(den) < 1e-12) { if (num < -1e-9) return null; continue; }
      const t = -num / den;
      if (den > 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
      if (t0 > t1 + 1e-12) return null;
    }
    if (t1 - t0 < 1e-9) return null;
    return [G.lerp(a, b, t0), G.lerp(a, b, t1)];
  }

  function clipSegAny(a, b, poly) { return clipSeg(a, b, G.area(poly) < 0 ? poly.slice().reverse() : poly); }

  // connected pieces of a set of facets (sharing a stretch of edge)
  function components(facets) {
    const n = facets.length, par = facets.map((_, i) => i);
    const find = (i) => (par[i] === i ? i : (par[i] = find(par[i])));
    const touch = (P, Q) => {
      for (let i = 0; i < P.length; i++) {
        const a = P[i], b = P[(i + 1) % P.length], d = G.sub(b, a), L = G.len(d);
        if (L < 1e-9) continue;
        const u = G.mul(d, 1 / L);
        for (let j = 0; j < Q.length; j++) {
          const c = Q[j], e = Q[(j + 1) % Q.length];
          if (Math.abs(G.cross(u, G.sub(c, a))) > 1e-6 || Math.abs(G.cross(u, G.sub(e, a))) > 1e-6) continue;
          const t1 = G.dot(G.sub(c, a), u), t2 = G.dot(G.sub(e, a), u);
          const lo = Math.max(0, Math.min(t1, t2)), hi = Math.min(L, Math.max(t1, t2));
          if (hi - lo > 1e-6) return true;
        }
      }
      return false;
    };
    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
      if (find(i) === find(j)) continue;
      if (touch(facets[i].poly || facets[i], facets[j].poly || facets[j])) par[find(i)] = find(j);
    }
    const groups = new Map();
    for (let i = 0; i < n; i++) { const r = find(i); (groups.get(r) || groups.set(r, []).get(r)).push(i); }
    return Array.from(groups.values());
  }

  function loopsPath(loops) { return loops.map((l) => C.pathOf ? C.pathOf(l) : '').join(''); }

  /* ---------- checking a puzzle in node ---------- */

  function verifyPuzzle(p) {
    const d = p.data || {};
    const s = sheetOf(p);
    if (!d.target || !d.target.length) return { ok: false, err: 'no target' };
    if (!d.sol || !Array.isArray(d.sol)) return { ok: false, err: 'no solution folds' };
    const cuts = cutsOf(d);
    if (!cuts.length) return { ok: false, err: 'no cut in the solution' };
    if (cuts.length > (d.cuts || 1)) return { ok: false, err: 'the solution uses more cuts than allowed' };
    const pp = mkPaper(s);
    for (let i = 0; i < d.sol.length; i++) if (!foldPaper(pp, d.sol[i])) return { ok: false, err: 'fold ' + (i + 1) + ' moves no paper' };
    for (let i = 0; i < cuts.length; i++) if (!cutPaper(pp, cuts[i])) return { ok: false, err: 'cut ' + (i + 1) + ' misses the paper' };
    const loops = loopsOf(d.target);
    const tArea = loops.reduce((a, l) => a + G.area(l), 0);
    if (Math.abs(tArea) < s[0] * s[1] * 0.01) return { ok: false, err: 'target too small' };
    const keep = d.keep || '+';
    const polys = regionPolys(pp, cuts, keep);
    if (!polys.length) return { ok: false, err: 'the kept side is empty' };
    const mask = targetMaskOf(loops, s, 200);
    const r = scoreAgainst(mask, polys, s, 200, [symmetries(s)[0]]);
    if (r.iou < 0.97) return { ok: false, err: 'the solution makes a different shape (IoU ' + r.iou.toFixed(3) + ')' };
    const area = polys.reduce((a, q) => a + G.absArea(q), 0);
    if (Math.abs(area - Math.abs(tArea)) > s[0] * s[1] * 0.01) return { ok: false, err: 'area differs: ' + area.toFixed(3) + ' vs ' + Math.abs(tArea).toFixed(3) };
    return { ok: true };
  }

  /* ---------- making new puzzles (tools/gen/foldcut.js and the Endless drawer) ---------- */

  const rad = (dg) => dg * Math.PI / 180;
  const ANGLES = [];
  [15, 18, 22.5].forEach((stp) => { for (let a = 0; a < 180; a += stp) if (!ANGLES.some((x) => Math.abs(x - a) < 1e-9)) ANGLES.push(a); });

  // fold lines: [ax, ay, bx, by, side]; side = which side of a->b moves
  function lineAt(P, deg, Q) {
    const d = [Math.cos(rad(deg)), Math.sin(rad(deg))];
    const a = G.add(P, G.mul(d, -12)), b = G.add(P, G.mul(d, 12));
    return [a[0], a[1], b[0], b[1], Q ? (G.side(Q, a, b) > 0 ? 1 : -1) : 1];
  }
  function lineThrough(P, Q, R) {
    const d = G.norm(G.sub(Q, P));
    const a = G.add(P, G.mul(d, -12)), b = G.add(P, G.mul(d, 12));
    return [a[0], a[1], b[0], b[1], R ? (G.side(R, a, b) > 0 ? 1 : -1) : 1];
  }
  function lineOnto(P, Q) { // bring P onto Q
    const m = G.mid(P, Q), d = G.perp(G.norm(G.sub(Q, P)));
    const a = G.add(m, G.mul(d, -12)), b = G.add(m, G.mul(d, 12));
    return [a[0], a[1], b[0], b[1], G.side(P, a, b) > 0 ? 1 : -1];
  }
  function paperArea(pp) { return pp.facets.reduce((a, f) => a + G.absArea(f.poly), 0); }

  // a fold a player can find with the snapping tool; balanced ones (near halves) are preferred
  function randomFold(pp, s, rng) {
    const marks = landmarks(pp, s);
    const total = paperArea(pp);
    const cands = [];
    for (let tries = 0; tries < 36; tries++) {
      const kind = rng();
      let f;
      if (kind < 0.5) {
        const P = rng.pick(marks), Q = rng.pick(marks);
        if (G.dist(P, Q) < 1) continue;
        f = lineThrough(P, Q);
        f[4] = rng() < 0.5 ? 1 : -1;
      } else if (kind < 0.75) {
        f = lineAt(rng.pick(marks), rng.pick(ANGLES));
        f[4] = rng() < 0.5 ? 1 : -1;
      } else {
        const P = rng.pick(marks), Q = rng.pick(marks);
        if (G.dist(P, Q) < 1) continue;
        f = lineOnto(P, Q);
      }
      const ar = pp.sideAreas([f[0], f[1]], [f[2], f[3]]);
      const fr = (f[4] > 0 ? ar.left : ar.right) / total;
      if (fr < 0.12 || fr > 0.88) continue;
      cands.push({ f, bal: Math.abs(fr - 0.5) < 0.08 });
    }
    if (!cands.length) return null;
    const bal = cands.filter((c) => c.bal);
    const pick = bal.length && rng() < 0.7 ? rng.pick(bal) : rng.pick(cands);
    const q = pp.clone();
    if (!foldPaper(q, pick.f)) return null;
    return { f: pick.f, pp: q };
  }

  function angleAt(l, i) {
    const n = l.length, a = l[(i + n - 1) % n], b = l[i], c = l[(i + 1) % n];
    const u = G.norm(G.sub(a, b)), v = G.norm(G.sub(c, b));
    return Math.acos(Math.max(-1, Math.min(1, G.dot(u, v)))) * 180 / Math.PI;
  }
  function onBorder(q, r, s) {
    return [0, 1].some((ax) => [0, s[ax]].some((v) => Math.abs(q[ax] - v) < 1e-6 && Math.abs(r[ax] - v) < 1e-6));
  }
  // the shape's measurements, for judging and naming
  function features(loops, s) {
    const area = loops.reduce((a, l) => a + G.area(l), 0);
    let minEdge = Infinity, minAng = 180, per = 0, border = 0, cutEdges = 0, verts = 0;
    loops.forEach((l) => l.forEach((q, i) => {
      const r = l[(i + 1) % l.length], e = G.dist(q, r);
      minEdge = Math.min(minEdge, e); per += e; verts++;
      minAng = Math.min(minAng, angleAt(l, i));
      if (onBorder(q, r, s)) border += e; else cutEdges++;
    }));
    return { area, minEdge, minAng, per, border, cutEdges, verts, compact: 4 * Math.PI * area / Math.max(1e-9, per * per) };
  }
  // mirror lines and turns of a shape about its own centre
  function shapeSyms(loops, s) {
    const res = 56;
    const mask0 = targetMaskOf(loops, s, res);
    const ctr = G.areaCentroid(loops.filter((l) => G.area(l) > 0));
    const about = (m) => M.mul(M.translate(ctr[0], ctr[1]), M.mul(m, M.translate(-ctr[0], -ctr[1])));
    const mats = {
      v: about([-1, 0, 0, 1, 0, 0]), h: about([1, 0, 0, -1, 0, 0]), d1: about([0, 1, 1, 0, 0, 0]), d2: about([0, -1, -1, 0, 0, 0]),
      r90: M.rotate(90, ctr), r180: M.rotate(180, ctr)
    };
    const out = {};
    for (const k in mats) {
      const m = targetMaskOf(loops.map((l) => l.map((q) => M.apply(mats[k], q))), s, res);
      let both = 0, any = 0;
      for (let i = 0; i < m.length; i++) { if (m[i] && mask0[i]) both++; if (m[i] || mask0[i]) any++; }
      out[k] = both / Math.max(1, any) > 0.95;
    }
    out.mirrors = ['v', 'h', 'd1', 'd2'].filter((k) => out[k]).length;
    out.any = out.mirrors > 0 || out.r90 || out.r180;
    return out;
  }

  // fold and cut lines clipped to the paper as it lies at that moment (short, tidy numbers)
  function tidyFolds(s, folds, cut) {
    const pp = mkPaper(s);
    const out = [];
    for (const f of folds) {
      const seg = clipLine([f[0], f[1]], [f[2], f[3]], pp.bounds(), 1);
      if (!seg) return null;
      const rec = [r5(seg[0][0]), r5(seg[0][1]), r5(seg[1][0]), r5(seg[1][1]), f[4]]; // clipLine keeps a -> b
      if (!foldPaper(pp, rec)) return null;
      out.push(rec);
    }
    const cuts = [];
    for (const c of (typeof cut[0] === 'number' ? [cut] : cut)) {
      const seg = clipLine([c[0], c[1]], [c[2], c[3]], pp.bounds(), 1);
      if (!seg) return null;
      cuts.push([r5(seg[0][0]), r5(seg[0][1]), r5(seg[1][0]), r5(seg[1][1])]);
    }
    return { folds: out, cut: cuts[0], cuts, pp };
  }
  // the puzzle data for these folds and this cut; the shape is the side holding keepAt
  function makeData(s, folds, cut, keepAt) {
    const t = tidyFolds(s, folds, cut);
    if (!t) return null;
    const pp = t.pp;
    for (const c of t.cuts) if (!cutPaper(pp, c)) return null;
    let code = typeof keepAt === 'string' ? keepAt : null;
    if (!code) {
      const f = pp.facets.find((x) => inConvex(keepAt, x.poly, -1e-9));
      if (!f) return null;
      code = codeOf(f, t.cuts);
    }
    const polys = regionPolys(pp, t.cuts, code);
    const loops = outlineOf(polys);
    const data = { target: flatOf(loops), sol: t.folds, cut: t.cuts.length > 1 ? t.cuts : t.cut, keep: code };
    if (t.cuts.length > 1) data.cuts = t.cuts.length;
    if (s[0] !== 10 || s[1] !== 10) data.sheet = s.slice();
    const lp = loopsOf(data.target);
    return { data, loops: lp, snips: features(lp, s).cutEdges, comps: components(polys).length };
  }
  // drop folds that make no difference to the shape
  function simplifyFolds(s, folds, cut, loops) {
    const mask = targetMaskOf(loops, s, 110);
    let cur = folds.slice(), changed = true;
    while (changed && cur.length > 1) {
      changed = false;
      for (let i = 0; i < cur.length; i++) {
        const trial = cur.slice(0, i).concat(cur.slice(i + 1));
        const b = build(s, trial, [cut]);
        if (b.bad >= 0) continue;
        if (judge(b.pp, [cut], mask, s, 110, [symmetries(s)[0]]).iou > 0.985) { cur = trial; changed = true; break; }
      }
    }
    return cur;
  }
  // a point well inside the shape
  function pointInside(loops) {
    const outer = loops.filter((l) => G.area(l) > 0);
    if (!outer.length) return null;
    const inside = (q) => { let n = 0; loops.forEach((l) => { if (G.pointInPoly(q, l)) n++; }); return n % 2 === 1; };
    const box = G.bbox(outer[0]);
    let best = null, bd = -1;
    for (let i = 1; i < 20; i++) for (let j = 1; j < 20; j++) {
      const q = [box.x0 + box.w * (i + 0.137) / 20, box.y0 + box.h * (j + 0.291) / 20];
      if (!inside(q)) continue;
      let dmin = Infinity;
      loops.forEach((l) => l.forEach((a, k) => { dmin = Math.min(dmin, G.segDist(q, a, l[(k + 1) % l.length])); }));
      if (dmin > bd) { bd = dmin; best = q; }
    }
    return best;
  }

  /* One random attempt: fold nf times, cut through two snap points, and keep
   * the side that looks like a figure cut from the sheet. Returns null when
   * the result is tiny, thin, spiky, lopsided and stuck to the edge, or
   * something a single cut of the flat sheet would give. */
  function candidate(rng, s, nf) {
    let pp = mkPaper(s);
    const folds = [];
    for (let i = 0; i < nf; i++) {
      const r = randomFold(pp, s, rng);
      if (!r) return null;
      folds.push(r.f);
      pp = r.pp;
    }
    const marks = landmarks(pp, s);
    const P = rng.pick(marks), Q = rng.pick(marks);
    if (G.dist(P, Q) < 1.5) return null;
    const cut = [P[0], P[1], Q[0], Q[1]];
    const pc = pp.clone();
    if (!cutPaper(pc, cut)) return null;
    const regs = regionsOf(pc, [cut]);
    const opts = [];
    for (const code in regs) {
      const polys = regs[code].map((f) => f.poly);
      const loops = outlineOf(polys);
      opts.push({ code, polys, loops, comps: components(polys).length, ft: features(loops, s) });
    }
    if (opts.length < 2) return null;
    opts.sort((a, b) => a.comps - b.comps || (a.ft.border / a.ft.per) - (b.ft.border / b.ft.per) || a.ft.area - b.ft.area);
    const k = opts[0], ft = k.ft, A = s[0] * s[1];
    if (k.comps > 2 || ft.area < A * 0.08 || ft.area > A * 0.72) return null;
    if (ft.minEdge < 0.04 * Math.max(s[0], s[1]) || ft.minAng < 17 || ft.compact < 0.18 || ft.cutEdges < 2) return null;
    const sy = shapeSyms(k.loops, s);
    const bf = ft.border / ft.per;
    if (sy.any ? bf > 0.34 : (bf > 0.1 || nf < 3)) return null;
    const lean = simplifyFolds(s, folds, cut, k.loops);
    const md = makeData(s, lean, cut, pointInside(k.loops));
    if (!md) return null;
    if (!verifyPuzzle({ data: md.data }).ok) return null;
    const odd = lean.some((f) => { const a = G.normDeg(G.angle([f[2] - f[0], f[3] - f[1]])) % 45; return a > 0.5 && a < 44.5; });
    return { md, nf: lean.length, sy: shapeSyms(md.loops, s), ft: features(md.loops, s), odd };
  }
  // difficulty from the folds needed and the figure's looks
  function grade(c) {
    let dg = c.nf;
    if (c.odd) dg += 1;
    if (!c.sy.any && c.nf >= 2) dg += 1;
    if (c.ft.verts <= 4 && c.nf <= 2) dg -= 1;
    if (c.ft.verts >= 14) dg += 1;
    return Math.max(1, Math.min(5, dg));
  }
  const FOLDS_FOR = [null, [1, 1, 2], [1, 2, 2], [2, 3, 3], [3, 4, 4], [4, 4, 3]];

  /* ----- names for shapes ----- */
  const NUM = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve'];
  const POLY = { 3: 'Triangle', 4: 'Quadrilateral', 5: 'Pentagon', 6: 'Hexagon', 7: 'Heptagon', 8: 'Octagon', 9: 'Nonagon', 10: 'Decagon', 12: 'Dodecagon' };
  const polyName = (n) => POLY[n] || (n + '-Sided Figure');
  const nearEq = (a, b, t) => Math.abs(a - b) <= (t || 0.04) * Math.max(a, b);
  const parallel = (a, b, c, e) => Math.abs(G.cross(G.norm(G.sub(b, a)), G.norm(G.sub(e, c)))) < 0.03;
  function convexName(l) {
    const n = l.length, sd = l.map((q, i) => G.dist(q, l[(i + 1) % n])), angs = l.map((_, i) => angleAt(l, i));
    const allSides = sd.every((x) => nearEq(x, sd[0], 0.03)), allAngs = angs.every((x) => Math.abs(x - angs[0]) < 2);
    if (n === 3) {
      if (allSides) return 'Equilateral Triangle';
      if (angs.some((a) => Math.abs(a - 90) < 1.5)) return 'Right Triangle';
      if (nearEq(sd[0], sd[1]) || nearEq(sd[1], sd[2]) || nearEq(sd[0], sd[2])) return 'Isosceles Triangle';
      return 'Triangle';
    }
    if (n === 4) {
      const right = angs.every((a) => Math.abs(a - 90) < 1.5);
      const axis = l.every((q, i) => { const r = l[(i + 1) % n]; return Math.abs(q[0] - r[0]) < 1e-3 || Math.abs(q[1] - r[1]) < 1e-3; });
      if (right && allSides) return axis ? 'Square' : 'Diamond';
      if (right) return 'Rectangle';
      if (allSides) return 'Rhombus';
      const p1 = parallel(l[0], l[1], l[3], l[2]), p2 = parallel(l[1], l[2], l[0], l[3]);
      if (p1 && p2) return 'Parallelogram';
      if (p1 || p2) return 'Trapezoid';
      if ((nearEq(sd[0], sd[1]) && nearEq(sd[2], sd[3])) || (nearEq(sd[1], sd[2]) && nearEq(sd[3], sd[0]))) return 'Kite';
      return 'Quadrilateral';
    }
    if (allSides && allAngs) return 'Regular ' + polyName(n);
    return polyName(n);
  }
  function loopName(l) {
    const n = l.length, reflex = [];
    l.forEach((q, i) => { const a = l[(i + n - 1) % n], b = l[(i + 1) % n]; if (G.cross(G.sub(q, a), G.sub(b, q)) < -1e-9) reflex.push(i); });
    if (!reflex.length) return convexName(l);
    const r = reflex.length;
    const alternating = r * 2 === n && reflex.every((i) => reflex.includes((i + 2) % n));
    if (alternating && r >= 3) return NUM[r] + '-Pointed Star';
    if (alternating && r === 2) return 'Bow Tie';
    if (n === 12 && r === 4) return 'Cross';
    if (n === 4 && r === 1) return 'Arrowhead';
    if (n === 6 && r === 1) return 'Chevron';
    if (r === 1) return 'Notched ' + polyName(n - 1).replace('Quadrilateral', 'Square');
    if (r === 2) return 'Twice-Notched ' + polyName(n - 2).replace('Quadrilateral', 'Square');
    return 'Jagged ' + polyName(n);
  }
  function pluralName(w) {
    if (/Cross$/.test(w)) return w + 'es';
    if (/Rhombus$/.test(w)) return w.replace(/Rhombus$/, 'Rhombi');
    if (/Figure$/.test(w)) return w + 's';
    return w + 's';
  }
  // corners the eye sees: drop those that bend by less than 4°
  function visible(l) {
    let cur = l.slice(), changed = true;
    while (changed && cur.length > 3) {
      changed = false;
      for (let i = 0; i < cur.length; i++) if (angleAt(cur, i) > 176) { cur.splice(i, 1); changed = true; break; }
    }
    return cur;
  }
  function shapeName(loops) {
    loops = loops.map(visible);
    const outer = loops.filter((l) => G.area(l) > 0), holes = loops.filter((l) => G.area(l) < 0);
    if (outer.length >= 2) {
      const names = outer.map(loopName);
      if (names.every((x) => x === names[0])) return NUM[outer.length] + ' ' + pluralName(names[0]);
      return NUM[outer.length] + ' Pieces';
    }
    const b = loopName(outer[0]);
    if (holes.length === 1) return b + ' with a ' + loopName(holes[0].slice().reverse()).replace(/^Regular /, '') + ' Hole';
    if (holes.length > 1) return b + ' with ' + NUM[holes.length] + ' Holes';
    return b;
  }
  const ADJ = ['Little', 'Plain', 'Neat', 'Bold', 'Crisp', 'Sharp', 'Blunt', 'Quiet', 'Bright', 'Paper', 'Folded', 'Snipped', 'Pocket', 'Proud', 'Lucky', 'Humble', 'Dapper', 'Jaunty', 'Sturdy', 'Tidy', 'Secret', 'Curious', 'Patient', 'Sly', 'Brave', 'Gentle', 'Nimble', 'Stately'];
  function describe(c, s) {
    const loops = c.md.loops, holes = loops.filter((l) => G.area(l) < 0).length, outerN = loops.filter((l) => G.area(l) > 0).length;
    const sheetWord = Math.abs(s[0] - s[1]) < 1e-9 ? 'square' : 'sheet';
    let text;
    if (outerN > 1) text = 'Fold the ' + sheetWord + ', then make one straight cut, so that the pieces on one side of the cut are these ' + NUM[outerN].toLowerCase() + ' shapes, just where the picture shows them.';
    else if (holes) text = 'Fold the ' + sheetWord + ', then make one straight cut, so that one side of the cut leaves this shape — hole and all.';
    else text = 'Fold the ' + sheetWord + ', then make one straight cut, so that the pieces on one side of the cut make this shape.';
    text += ' ' + (c.nf === 1 ? 'One fold is enough.' : 'It can be done with ' + NUM[c.nf].toLowerCase() + ' folds.');
    const hints = [];
    if (c.sy.mirrors >= 2) hints.push('The shape has ' + NUM[c.sy.mirrors].toLowerCase() + ' mirror lines. A mirror line of the shape is always a good crease.');
    else if (c.sy.mirrors === 1) hints.push('The shape has one mirror line. Fold along it first, and half the work is done.');
    else if (c.sy.any) hints.push('The shape has no mirror line, but it looks the same turned half way round. Look for a fold that lays one pencil edge on its twin.');
    else hints.push('The shape has no mirror line, so watch the pencil lines instead: fold so that two of them come to lie on one line.');
    const explain = 'One way: ' + C.plural(c.nf, 'fold') + ' stack the paper so that every edge of the shape lies on one straight line; one cut along it, and the sheet opens with ' + C.plural(c.md.snips, 'snip') + ' that together draw the outline. Every fold is a mirror, which is why the shape repeats itself across each crease.';
    return { name: shapeName(loops), text, hints, explain, holes, outerN };
  }

  /* A new puzzle at a level (1..5), or null after a fair number of tries. */
  function generateOne(rng, level, s) {
    s = s || [10, 10];
    const opts = FOLDS_FOR[level] || FOLDS_FOR[3];
    for (let tries = 0; tries < 400; tries++) {
      const c = candidate(rng, s, rng.pick(opts));
      if (!c || grade(c) !== level) continue;
      const ds = describe(c, s);
      const box = G.bbox(c.md.loops);
      const adj = box.h > box.w * 1.6 ? 'Tall' : box.w > box.h * 1.6 ? 'Wide' : !c.sy.any ? 'Lopsided' : rng.pick(ADJ);
      c.md.data.color = rng.pick(COLORS);
      return {
        title: 'The ' + adj + ' ' + ds.name, diff: level, text: ds.text, hints: ds.hints, explain: ds.explain,
        concepts: ['folding', 'symmetry'], data: c.md.data
      };
    }
    return null;
  }

  const API = {
    COLORS, BACK, sheetOf, sheetPoly, mkPaper, foldPaper, cutPaper, cutsOf, loopsOf, flatOf, build, inConvex,
    codeOf, regionsOf, regionPolys, outlineOf, rasterEO, symmetries, sheetBox, scoreAgainst, targetMaskOf, judge,
    landmarks, landMap, fitIso, samples, sameFolding, moveFold, clipLine, clipSeg, components, verifyPuzzle, r5,
    lineAt, lineThrough, lineOnto, features, shapeSyms, tidyFolds, makeData, simplifyFolds, pointInside,
    candidate, grade, describe, shapeName, generateOne, FOLDS_FOR, ADJ, NUM
  };
  C.foldcut = API;

  /* ---------- drawing helpers (browser) ---------- */

  const MAX_FOLDS = 8;
  const f3 = (v) => Math.round(v * 1000) / 1000;
  function pathPts(pts) {
    let d = '';
    for (let i = 0; i < pts.length; i++) d += (i ? 'L' : 'M') + f3(pts[i][0]) + ' ' + f3(pts[i][1]);
    return d + 'Z';
  }
  function segsPath(segs) {
    let d = '';
    segs.forEach((sg) => { d += 'M' + f3(sg[0][0]) + ' ' + f3(sg[0][1]) + 'L' + f3(sg[1][0]) + ' ' + f3(sg[1][1]); });
    return d;
  }
  // the matrix that flattens the plane towards a line: c = 1 keeps it, -1 mirrors it,
  // values between show a flap turning about the line, seen from above
  function squash(a, b, c) {
    const u = G.norm(G.sub(b, a)), n = [-u[1], u[0]];
    const l00 = u[0] * u[0] + c * n[0] * n[0], l01 = u[0] * u[1] + c * n[0] * n[1], l11 = u[1] * u[1] + c * n[1] * n[1];
    return [l00, l01, l01, l11, a[0] - (l00 * a[0] + l01 * a[1]), a[1] - (l01 * a[0] + l11 * a[1])];
  }
  const sameM = (m, n) => m.every((v, i) => Math.abs(v - n[i]) < 1e-6);
  const ease = (t) => 0.5 - Math.cos(Math.PI * t) / 2;

  C.engine({
    id: 'foldcut',
    name: 'Fold and cut',
    tools: ['fold', 'cut', 'pan', 'pen', 'marker', 'eraser', 'note', 'xray', 'loupe'],
    workbench: { snapPx: 12, cutMode: 'line' },
    noMoves: true,
    about: '**Fold** (F): press on the paper and drag that point to where it should land. The crease appears halfway between, and the part you picked up turns over on top of the rest — the ghost shows where it will lie. Hold **Shift** as you start to draw the crease itself instead: its angle snaps to steps of 15°, 18° and 22.5°, and the smaller part folds over. Points snap to corners, the middles and quarters of edges, the centre of the sheet and the pencil outline.\n\n**Cut** (C): one straight stroke of the knife goes through every layer. Then the paper opens by itself, and the pieces on one side of the cut must make the shape in the picture (turned or mirrored with the sheet is fine).\n\nThe **pencil outline** is the shape drawn on the paper; it folds with it. Fold until all its lines lie along one straight line, then cut there. The label by the pointer counts the layers under it. **Undo** takes back folds and the cut; **Peek** opens the paper for a moment without cutting.',

    verify: verifyPuzzle,

    // Endless: a new random shape at this level (the same code made the stored ones)
    generate(rng, level) { return generateOne(rng, level, [10, 10]); },

    mount(ctx, p) {
      const wb = ctx.wb, d = p.data, s = sheetOf(p);
      const cutsAllowed = d.cuts || 1;
      const front = d.color || COLORS[C.hash(p.id) % COLORS.length];
      const tLoops = loopsOf(d.target);
      const tMask = targetMaskOf(tLoops, s, 160);
      const tEdges = [];
      tLoops.forEach((l) => l.forEach((q, i) => tEdges.push([q, l[(i + 1) % l.length]])));
      const tVerts = [];
      tLoops.forEach((l) => l.forEach((q) => tVerts.push(q)));
      const size = Math.max(s[0], s[1]), U = size / 10; // one "unit" of decoration
      const solCuts = cutsOf(d);
      const tSnips = features(tLoops, s).cutEdges;

      let st = { f: [], c: [], o: 0 };
      let stages = [], pp = null, marks = null, layout = null, penCache = new Map();
      let busy = false, token = 0, raf = 0, timers = [];
      let result = null;       // judge() after the cut
      let pencil = C.store.get('fc-pencil', true) !== false;
      let hintShow = null;     // what the last hint drew
      let peeking = false;

      wb.host.classList.add('fc-host');
      wb.setMode('fold');

      /* ----- the table: where the sheet lay, and the picture of the goal ----- */
      const narrow = wb.size().w < 620;
      const bg = wb.layer('bg');
      ctx.s('rect', { x: 0, y: 0, width: s[0], height: s[1], class: 'fc-ghost', rx: 0.04 * U }, bg);
      const cardW = size * 0.42, cardPad = 0.35 * U;
      const cardX = narrow ? (s[0] - cardW) / 2 : s[0] + 1.1 * U, cardY = narrow ? s[1] + 1.0 * U : 0;
      const k = (cardW - 2 * cardPad) / size;
      const cardH = s[1] * k + 2 * cardPad + 0.8 * U;
      const card = ctx.s('g', { class: 'fc-card' }, bg);
      ctx.s('rect', { x: cardX, y: cardY, width: cardW, height: cardH, rx: 0.25 * U, class: 'fc-cardbg' }, card);
      ctx.s('text', { x: cardX + cardW / 2, y: cardY + 0.55 * U, class: 'fc-cardt', 'text-anchor': 'middle', 'font-size': 0.36 * U, text: cutsAllowed > 1 ? 'Cut out this (' + cutsAllowed + ' cuts)' : 'Cut out this' }, card);
      const mini = ctx.s('g', { transform: 'translate(' + (cardX + cardPad + (size - s[0]) * k / 2) + ' ' + (cardY + 0.8 * U + cardPad) + ') scale(' + k + ')' }, card);
      ctx.s('rect', { x: 0, y: 0, width: s[0], height: s[1], class: 'fc-minisheet' }, mini);
      ctx.s('path', { d: tLoops.map(pathPts).join(''), 'fill-rule': 'evenodd', fill: front, class: 'fc-minishape' }, mini);
      const x1 = narrow ? s[0] : cardX + cardW, y1 = narrow ? cardY + cardH : s[1];
      wb.setBounds({ x0: -1.2 * U, y0: -1.2 * U, x1: x1 + 1.0 * U, y1: y1 + 1.2 * U }, 0.04);

      const gPaper = ctx.s('g', { class: 'fc-paper' }, wb.layer('board'));
      const gMarks = ctx.s('g', { class: 'fc-marks' }, wb.layer('board'));
      const gTop = ctx.s('g', { class: 'fc-top' }, wb.layer('top'));
      const gDots = ctx.s('g', { class: 'fc-dots' }, gTop);
      const gHint = ctx.s('g', { class: 'fc-hint' }, gTop);
      const gHover = ctx.s('g', { class: 'fc-hover' }, gTop);

      /* ----- the state ----- */
      function rebuild() {
        stages = [mkPaper(s)];
        let cur = stages[0];
        st.f.forEach((f) => { cur = cur.clone(); foldPaper(cur, f); stages.push(cur); });
        pp = cur.clone();
        st.c.forEach((c) => cutPaper(pp, c));
        marks = null;
        layout = null;
        penCache = new Map();
        result = st.c.length ? judge(pp, st.c, tMask, s, 160) : null;
        stats();
      }
      const opened = () => !!st.o;
      const cutDone = () => st.c.length > 0;
      function stats() {
        ctx.stat('Folds', st.f.length);
        ctx.stat('Cuts', st.c.length + ' / ' + cutsAllowed);
        let most = 1;
        const cur = stages[stages.length - 1].current();
        cur.forEach((c) => { const q = G.centroid(c.poly); let n = 0; cur.forEach((o) => { if (inConvex(q, o.poly, -1e-7)) n++; }); most = Math.max(most, n); });
        ctx.stat('Layers', most);
      }
      function penOf(poly) {
        let v = penCache.get(poly);
        if (v) return v;
        v = [];
        tEdges.forEach((e) => { const sg = clipSeg(e[0], e[1], poly); if (sg) v.push(sg); });
        penCache.set(poly, v);
        return v;
      }
      function snapPoints() {
        if (!marks) marks = cutDone() && opened() ? [] : landmarks(stages[stages.length - 1], s, pencil ? tVerts : null);
        return marks;
      }

      /* ----- drawing the paper ----- */
      function itemsSVG(items) {
        const sh = 0.05 * U;
        let out = '';
        items.forEach((it) => {
          const m = it.m;
          const pts = it.poly.map((q) => { const r = M.apply(m, q); return it.off ? [r[0] + it.off[0], r[1] + it.off[1]] : r; });
          const flipped = M.det(m) < 0;
          const lift = it.lift || 1;
          out += '<g class="fc-f' + (flipped ? ' back' : '') + (it.cls ? ' ' + it.cls : '') + '"' + (it.op != null && it.op < 0.999 ? ' opacity="' + f3(it.op) + '"' : '') + '>';
          out += '<path class="fc-sh" d="' + pathPts(pts.map((q) => [q[0] + sh * lift, q[1] + sh * 1.4 * lift])) + '"' + (lift > 1 ? ' fill-opacity="' + f3(0.22 / Math.sqrt(lift)) + '"' : '') + '/>';
          const dd = pathPts(pts);
          out += '<path class="fc-face" fill="' + (flipped ? BACK : front) + '" d="' + dd + '"/>';
          if (it.dark > 0.01) out += '<path class="fc-dark" fill-opacity="' + f3(it.dark) + '" d="' + dd + '"/>';
          if (pencil) {
            const pen = penOf(it.poly);
            if (pen.length) {
              const segs = pen.map((sg) => sg.map((q) => { const r = M.apply(m, q); return it.off ? [r[0] + it.off[0], r[1] + it.off[1]] : r; }));
              out += '<path class="fc-pen" d="' + segsPath(segs) + '"/>';
            }
          }
          out += '</g>';
        });
        gPaper.innerHTML = out;
      }

      function foldedItems() {
        return pp.current().map((c) => {
          let off = null;
          if (st.c.length) { // cut but not opened: the parts part a little
            off = [0, 0];
            st.c.forEach((k) => {
              const n = G.perp(G.norm([k[2] - k[0], k[3] - k[1]]));
              const sd = G.side(M.apply(c.facet.m, G.centroid(c.facet.poly)), [k[0], k[1]], [k[2], k[3]]) > 0 ? 1 : -1;
              off[0] += n[0] * sd * 0.09 * U; off[1] += n[1] * sd * 0.09 * U;
            });
          }
          return { poly: c.facet.poly, m: c.facet.m, off };
        });
      }

      // after opening: the shape stays, the scraps slide away
      function openLayout() {
        if (layout) return layout;
        const r = result || { code: null };
        const shape = r.code ? new Set(regionPolys(pp, st.c, r.code)) : new Set();
        const keepF = [], scrapF = [];
        pp.facets.forEach((f) => (shape.has(f.poly) ? keepF : scrapF).push(f));
        const sc = G.areaCentroid(keepF.length ? keepF.map((f) => f.poly) : [sheetPoly(s)]);
        const drift = new Map();
        components(scrapF.map((f) => f.poly)).forEach((grp) => {
          const polys = grp.map((i) => scrapF[i].poly);
          const cc = G.areaCentroid(polys);
          let v = G.sub(cc, sc);
          if (G.len(v) < 0.4 * U) v = [0.45, 0.9];
          v = G.mul(G.norm(v), 0.55 * U);
          grp.forEach((i) => drift.set(scrapF[i], v));
        });
        layout = { keepF, scrapF, drift, solved: r.iou >= 0.93 };
        return layout;
      }
      function openItems(t) {
        const L = openLayout();
        const items = [];
        L.keepF.forEach((f) => items.push({ poly: f.poly, m: M.id(), cls: 'keep' + (L.solved ? ' good' : '') }));
        L.scrapF.forEach((f) => {
          const v = L.drift.get(f) || [0, 0];
          items.push({ poly: f.poly, m: M.id(), off: [v[0] * t, v[1] * t], op: 1 - 0.55 * t, cls: 'scrap' });
        });
        // scraps first (under), the shape on top
        return items.slice(L.keepF.length).concat(items.slice(0, L.keepF.length));
      }

      function drawStatic() {
        gMarks.innerHTML = '';
        if (cutDone() && opened()) {
          itemsSVG(openItems(1));
          const L = openLayout();
          if (!L.solved) ctx.s('path', { d: tLoops.map(pathPts).join(''), class: 'fc-target', 'fill-rule': 'evenodd' }, gMarks);
        } else itemsSVG(foldedItems());
        drawDots();
        syncButtons();
      }

      /* ----- snap dots and the layer count under the pointer ----- */
      function drawDots() {
        gDots.innerHTML = '';
        if (busy || !(wb.mode === 'fold' || wb.mode === 'cut') || (cutDone() && (opened() || wb.mode === 'fold'))) return;
        const r = wb.px(2.1);
        let out = '';
        snapPoints().forEach((q) => { out += '<circle cx="' + f3(q[0]) + '" cy="' + f3(q[1]) + '" r="' + f3(r) + '"/>'; });
        gDots.innerHTML = out;
      }
      function layersAt(pt) {
        let n = 0;
        pp.facets.forEach((f) => { if (inConvex(M.apply(M.inv(f.m), pt), f.poly, -1e-9)) n++; });
        return n;
      }
      function label(g, pt, text, cls) {
        const fs = wb.px(12), padX = wb.px(6);
        const w = text.length * fs * 0.56 + 2 * padX, h = fs * 1.7;
        const x = pt[0] + wb.px(14), y = pt[1] + wb.px(14);
        ctx.s('rect', { x, y, width: w, height: h, rx: h / 2, class: 'fc-pill' + (cls ? ' ' + cls : '') }, g);
        ctx.s('text', { x: x + w / 2, y: y + h / 2, 'font-size': fs, 'text-anchor': 'middle', 'dominant-baseline': 'central', class: 'fc-pillt', text }, g);
      }
      function nearestMark(pt) {
        const tol = wb.px(12);
        let best = null, bd = tol * tol;
        snapPoints().forEach((q) => { const dd = G.dist2(q, pt); if (dd < bd) { bd = dd; best = q; } });
        return best;
      }
      function onHover(ev) {
        gHover.innerHTML = '';
        if (busy || wb.gesture || !(wb.mode === 'fold' || wb.mode === 'cut') || (cutDone() && opened())) return;
        const pt = wb.toWorld(ev.clientX, ev.clientY);
        const q = nearestMark(pt);
        if (q) ctx.s('circle', { cx: q[0], cy: q[1], r: wb.px(6.5), class: 'fc-snapring' }, gHover);
        const n = layersAt(pt);
        if (n) label(gHover, pt, n === 1 ? '1 layer' : n + ' layers');
      }
      const onLeave = () => { gHover.innerHTML = ''; };
      wb.svg.addEventListener('pointermove', onHover);
      wb.svg.addEventListener('pointerleave', onLeave);
      wb.on('mode', () => { gHover.innerHTML = ''; drawDots(); });
      wb.on('view', () => { if (!busy) drawDots(); });

      /* ----- previews while the fold or the knife is dragged ----- */
      const baseDraw = wb.drawToolLine;
      const isMark = (q) => snapPoints().some((m) => Math.abs(m[0] - q[0]) < 1e-9 && Math.abs(m[1] - q[1]) < 1e-9);
      const STEPS = [15, 18, 22.5];
      function snapAngle(g) {
        const v = G.sub(g.b, g.a), L = G.len(v);
        if (L < 1e-9 || isMark(g.b)) return null;
        const ang = G.angle(v);
        let best = null, bd = 2.6;
        STEPS.forEach((st2) => { const a2 = Math.round(ang / st2) * st2; const dd = Math.abs(a2 - ang); if (dd < bd) { bd = dd; best = a2; } });
        if (best == null) return null;
        const r = best * Math.PI / 180;
        g.b = [g.a[0] + Math.cos(r) * L, g.a[1] + Math.sin(r) * L];
        return best;
      }
      wb.drawToolLine = function (g) {
        let snapped = null;
        if (g.kind === 'fold' && g.crease) snapped = snapAngle(g);
        baseDraw.call(wb, g);
        gHover.innerHTML = '';
        try {
          if (g.kind === 'fold') previewFold(g, snapped);
          else if (g.kind === 'cut') previewCut(g);
        } catch (e) { console.error(e); }
      };

      function movingSide(f) {
        let side = f.side;
        if (!side) { const ar = pp.sideAreas(f.a, f.b); side = ar.left <= ar.right ? 1 : -1; }
        return side;
      }
      // the parts of the paper (as it lies now) on one side of a line
      function partsOn(a, b, side) {
        const out = [];
        pp.current().forEach((c) => {
          const parts = G.splitPoly(c.poly, a, b) || [{ poly: c.poly, side: G.side(G.centroid(c.poly), a, b) > 0 ? 1 : -1 }];
          parts.forEach((pc) => { if (pc.side === side) out.push({ poly: pc.poly, c }); });
        });
        return out;
      }
      function previewFold(g, snapped) {
        const live = wb.layer('live');
        if (busy || cutDone() || G.dist(g.a, g.b) < wb.px(8)) return;
        const f = wb.foldLine(g);
        const side = movingSide(f);
        const mov = partsOn(f.a, f.b, side), stay = partsOn(f.a, f.b, -side);
        const at = g.b;
        if (!mov.length || !stay.length) {
          label(live, at, mov.length ? 'All the paper is on one side' : 'No paper on that side', 'warn');
          return;
        }
        const R = M.reflect(f.a, f.b);
        let hi = '', ghost = '', pens = '';
        mov.forEach((mp) => {
          hi += pathPts(mp.poly);
          ghost += pathPts(mp.poly.map((q) => M.apply(R, q)));
          if (pencil) {
            penOf(mp.c.facet.poly).forEach((sg) => {
              const a = M.apply(mp.c.facet.m, sg[0]), b = M.apply(mp.c.facet.m, sg[1]);
              const cl = clipSegAny(a, b, mp.poly);
              if (cl) pens += segsPath([[M.apply(R, cl[0]), M.apply(R, cl[1])]]);
            });
          }
        });
        ctx.s('path', { d: hi, class: 'fc-pv-lift' }, live);
        ctx.s('path', { d: ghost, class: 'fc-pv-ghost' }, live);
        if (pens) ctx.s('path', { d: pens, class: 'fc-pv-pen' }, live);
        // an arrow from the flap to where it lands
        const c0 = G.areaCentroid(mov.map((mp) => mp.poly)), c1 = M.apply(R, c0);
        const mid = G.mid(c0, c1), n = G.perp(G.norm(G.sub(c1, c0))), bend = G.dist(c0, c1) * 0.28;
        const cp = G.add(mid, G.mul(n, bend));
        ctx.s('path', { d: 'M' + f3(c0[0]) + ' ' + f3(c0[1]) + 'Q' + f3(cp[0]) + ' ' + f3(cp[1]) + ' ' + f3(c1[0]) + ' ' + f3(c1[1]), class: 'fc-pv-arrow', 'marker-end': 'url(#fc-arrowhead)' }, live);
        if (g.crease) {
          const vis = G.normDeg(-G.angle(G.sub(f.b, f.a))) % 180;
          label(live, at, Math.round(vis * 10) / 10 + '°' + (snapped != null ? ' ✓' : ''), snapped != null ? 'good' : '');
        } else {
          // the thickest point of the flap
          let lay = 1;
          mov.forEach((mp) => { const q = G.centroid(mp.poly); let n2 = 0; mov.forEach((o) => { if (inConvex(q, o.poly, -1e-7)) n2++; }); lay = Math.max(lay, n2); });
          label(live, at, lay === 1 ? '1 layer turns over' : lay + ' layers turn over');
        }
      }
      function previewCut(g) {
        const live = wb.layer('live');
        if (busy) return;
        if (st.c.length >= cutsAllowed || opened()) { label(live, g.b, 'No cuts left — Undo to try again', 'warn'); return; }
        if (G.dist(g.a, g.b) < 1e-6) return;
        const bb = pp.bounds();
        const seg = clipLine(g.a, g.b, bb, 0.6 * U);
        if (!seg) return;
        ctx.s('line', { x1: seg[0][0], y1: seg[0][1], x2: seg[1][0], y2: seg[1][1], class: 'fc-pv-knife' }, live);
        let n = 0;
        pp.current().forEach((c) => { if (G.splitPoly(c.poly, g.a, g.b)) n++; });
        label(live, g.b, n ? '✂ through ' + n + (n === 1 ? ' layer' : ' layers') : 'misses the paper', n ? '' : 'warn');
      }

      /* ----- animations ----- */
      function stopAnim() {
        token++;
        if (raf) cancelAnimationFrame(raf);
        raf = 0;
        timers.forEach(clearTimeout);
        timers = [];
        busy = false;
        peeking = false;
      }
      function play(ms, frame, done) {
        const my = token, t0 = performance.now();
        busy = true;
        gDots.innerHTML = '';
        gHover.innerHTML = '';
        const tick = (now) => {
          if (my !== token) return;
          const t = Math.min(1, (now - t0) / Math.max(1, ms));
          frame(t);
          if (t < 1) raf = requestAnimationFrame(tick);
          else { raf = 0; if (done) done(); }
        };
        raf = requestAnimationFrame(tick);
      }
      function later(ms, fn) { const my = token; timers.push(setTimeout(() => { if (my === token) fn(); }, ms)); }
      function seq(steps, done) {
        const my = token;
        let i = 0;
        const next = () => {
          if (my !== token) return;
          if (i >= steps.length) { busy = false; if (done) done(); return; }
          steps[i++](next);
        };
        next();
      }

      // for every facet of `fin`, where it lay and in which layer at each stage
      function track(fin) {
        return fin.map((f) => {
          const c = G.centroid(f.poly);
          const per = stages.map((sp) => {
            const sf = sp.facets.find((g) => inConvex(c, g.poly, -1e-9)) || sp.facets.find((g) => G.pointInPoly(c, g.poly));
            return sf ? { m: sf.m, layer: sf.layer } : { m: f.m, layer: f.layer };
          });
          return { f, per };
        });
      }
      // one fold j (1-based), turning from open (u = 0) to done (u = 1)
      function foldFrame(tr, j, u) {
        const fl = st.f[j - 1], a = [fl[0], fl[1]], b = [fl[2], fl[3]];
        const cz = Math.cos(Math.PI * u);
        const S = squash(a, b, cz);
        const items = tr.map((x) => {
          const before = x.per[j - 1], after = x.per[j];
          const moved = !sameM(before.m, after.m);
          if (!moved) return { poly: x.f.poly, m: before.m, z: before.layer };
          return {
            poly: x.f.poly, m: M.mul(S, before.m),
            z: u < 0.5 ? 1000 + before.layer : 2000 + after.layer,
            dark: 0.42 * (1 - Math.abs(cz)), lift: 1 + 2.2 * Math.sin(Math.PI * u)
          };
        });
        items.sort((p1, p2) => p1.z - p2.z);
        return items;
      }
      function animFold(j, done) {
        const tr = track(stages[j].facets);
        play(C.anim(560), (t) => itemsSVG(foldFrame(tr, j, ease(t))), done);
      }
      function unfoldSteps(fin, keepOff) {
        const tr = track(fin);
        const steps = [];
        for (let j = st.f.length; j >= 1; j--) {
          const jj = j;
          steps.push((next) => play(C.anim(420), (t) => itemsSVG(foldFrame(tr, jj, 1 - ease(t)).map((it) => Object.assign(it, keepOff ? { off: keepOff(it) } : {}))), next));
          steps.push((next) => later(C.anim(70), next));
        }
        return steps;
      }
      function refoldSteps(fin) {
        const tr = track(fin);
        const steps = [];
        for (let j = 1; j <= st.f.length; j++) {
          const jj = j;
          steps.push((next) => play(C.anim(360), (t) => itemsSVG(foldFrame(tr, jj, ease(t))), next));
        }
        return steps;
      }
      function flashCut(c, done) {
        const bb = pp.bounds();
        const seg = clipLine([c[0], c[1]], [c[2], c[3]], bb, 0.4 * U);
        gMarks.innerHTML = '';
        if (seg) {
          const ln = ctx.s('line', { x1: seg[0][0], y1: seg[0][1], x2: seg[0][0], y2: seg[0][1], class: 'fc-slash' }, gMarks);
          play(C.anim(260), (t) => { const q = G.lerp(seg[0], seg[1], ease(t)); ln.setAttribute('x2', q[0]); ln.setAttribute('y2', q[1]); }, () => later(C.anim(120), () => { gMarks.innerHTML = ''; done(); }));
        } else done();
      }
      function openUp(done) {
        const steps = unfoldSteps(pp.facets);
        steps.push((next) => play(C.anim(480), (t) => itemsSVG(openItems(ease(t))), next));
        seq(steps, () => {
          st.o = 1;
          drawStatic();
          if (done) done();
        });
      }

      /* ----- what the tools do ----- */
      function lineRec(a, b, side) {
        const bb = pp ? stages[stages.length - 1].bounds() : { x0: 0, y0: 0, x1: s[0], y1: s[1] };
        const seg = clipLine(a, b, bb, 1.0 * U);
        if (!seg) return null;
        return [r5(seg[0][0]), r5(seg[0][1]), r5(seg[1][0]), r5(seg[1][1])].concat(side == null ? [] : [side]);
      }
      wb.handlers.toolSnap = () => (cutDone() && opened() ? [] : snapPoints());
      wb.handlers.fold = (f) => {
        if (busy) return true;
        clearHint();
        if (cutDone()) { ctx.toast(opened() ? 'The paper is in pieces now — Undo to put it back together.' : 'Once cut, the paper cannot be folded again — Undo the cut first.'); return true; }
        if (st.f.length >= MAX_FOLDS) { ctx.toast('It is too thick to fold again. (The record is twelve folds, with a very long roll of paper.)'); return true; }
        const side = movingSide(f);
        if (!partsOn(f.a, f.b, side).length || !partsOn(f.a, f.b, -side).length) return false;
        const rec = lineRec(f.a, f.b, side);
        if (!rec) return false;
        const test = stages[stages.length - 1].clone();
        if (!foldPaper(test, rec)) return false;
        st.f.push(rec);
        rebuild();
        animFold(st.f.length, () => { busy = false; drawStatic(); });
        sayProgress();
        ctx.changed('fold');
        return true;
      };
      function sayProgress() {
        const n = st.f.length;
        if (!n) { ctx.say('Fold the paper (F), then cut it once (C).'); return; }
        const cur = stages[n].current();
        let most = 1;
        cur.forEach((c) => { const q = G.centroid(c.poly); let m2 = 0; cur.forEach((o) => { if (inConvex(q, o.poly, -1e-7)) m2++; }); most = Math.max(most, m2); });
        ctx.say(C.plural(n, 'fold') + ', ' + most + ' layers at the thickest. Fold again, or cut (C).');
      }
      wb.handlers.cut = (a, b) => {
        if (busy) return true;
        clearHint();
        if (opened() || st.c.length >= cutsAllowed) { ctx.toast('No cuts left — Undo to try again.'); return true; }
        const test = pp.clone();
        if (!test.cut(a, b)) { ctx.toast('The knife missed the paper.'); return true; }
        const rec = lineRec(a, b);
        if (!rec) return true;
        st.c.push(rec);
        rebuild();
        ctx.sfx('cut');
        const last = st.c.length >= cutsAllowed || (result && result.iou >= 0.93);
        if (last) st.o = 1;
        itemsSVG(foldedItems());
        flashCut(rec, () => {
          if (last) openUp(() => { report(true); });
          else { busy = false; drawStatic(); ctx.say('Cut. You have ' + C.plural(cutsAllowed - st.c.length, 'cut') + ' left — or press Unfold (U).'); }
        });
        ctx.changed('cut');
        return true;
      };
      function unfoldNow() {
        if (busy || !cutDone() || opened()) return;
        openUp(() => { report(true); ctx.changed('open'); });
      }
      function report(fresh) {
        const r = result;
        if (!r) return;
        if (r.iou >= 0.93) {
          ctx.say('Unfolded: **' + Math.round(r.iou * 100) + '%** like the picture.', 'good');
          if (fresh) { const c = check(false); if (c.solved) ctx.solved({ msg: c.msg }); }
        } else if (r.iou > 0.7) ctx.say('Close — the best side matches **' + Math.round(r.iou * 100) + '%** (the dashed line is the goal). Undo to refold.', 'warn');
        else ctx.say('That makes a different shape (the dashed line is the goal). Undo (Ctrl+Z) to put the paper back together.', 'warn');
      }

      /* ----- panel ----- */
      const btnPencil = ctx.button('', () => { pencil = !pencil; C.store.set('fc-pencil', pencil); marks = null; penCache = new Map(); if (!busy) drawStatic(); syncButtons(); }, 'small');
      const btnPeek = ctx.button('Peek', () => peek(), 'small');
      const btnOpen = ctx.button('Unfold (U)', () => unfoldNow(), 'small');
      const btnReplay = ctx.button('Replay', () => replay(), 'small');
      btnPencil.title = 'Show or hide the shape drawn in pencil on the paper (O)';
      btnPeek.title = 'Open the paper for a moment to see the creases, then fold it back';
      btnReplay.title = 'Watch your folds and the cut again';
      function syncButtons() {
        btnPencil.textContent = pencil ? 'Pencil outline: on' : 'Pencil outline: off';
        btnPeek.hidden = !st.f.length || cutDone();
        btnOpen.hidden = !(cutDone() && !opened());
        btnReplay.hidden = !(cutDone() && opened());
      }
      function peek() {
        if (busy || !st.f.length || cutDone()) return;
        peeking = true;
        const fin = stages[stages.length - 1].facets;
        const steps = unfoldSteps(fin);
        steps.push((next) => later(C.anim(900), next));
        seq(steps.concat(refoldSteps(fin)), () => { peeking = false; drawStatic(); });
      }
      function replay() {
        if (busy || !cutDone() || !opened()) return;
        const fin = pp.facets;
        const steps = [];
        steps.push((next) => { itemsSVG(foldFrame(track(fin), 1, 0)); later(C.anim(300), next); });
        steps.push(...refoldSteps(fin));
        steps.push((next) => flashCut(st.c[st.c.length - 1], next));
        steps.push(...unfoldSteps(fin));
        steps.push((next) => play(C.anim(480), (t) => itemsSVG(openItems(ease(t))), next));
        seq(steps, () => drawStatic());
      }

      /* ----- checking ----- */
      function check(manual) {
        if (busy && !peeking) return { solved: false, msg: 'Wait for the paper to settle…' };
        if (!st.c.length) return { solved: false, msg: st.f.length ? 'Now make the cut: pick up the knife (C) and cut straight across.' : 'Fold the paper first (F), then cut it (C).' };
        const r = result;
        if (r && r.iou >= 0.93) {
          return { solved: true, msg: (st.c.length > 1 ? C.plural(st.c.length, 'cut') : 'One cut') + ', ' + C.plural(tSnips, 'straight edge') + ' in the open sheet.' };
        }
        if (!opened() && manual) return { solved: false, msg: 'Unfold the paper (U) to see what you cut.' };
        return { solved: false, msg: r && r.iou > 0.7 ? 'Close, but not the shape: ' + Math.round(r.iou * 100) + '% alike.' : 'That is not the shape in the picture yet.' };
      }

      /* ----- hints: the next crease, dashed ----- */
      function clearHint() { gHint.innerHTML = ''; if (hintShow) { clearTimeout(hintShow); hintShow = null; } }
      function solStage(k) {
        const q = mkPaper(s);
        for (let i = 0; i < k; i++) foldPaper(q, d.sol[i]);
        return q;
      }
      function showLine(a, b, cls) {
        const bb = pp.bounds();
        const seg = clipLine(a, b, bb, 0.7 * U);
        if (seg) ctx.s('line', { x1: seg[0][0], y1: seg[0][1], x2: seg[1][0], y2: seg[1][1], class: cls }, gHint);
      }
      function hint() {
        if (busy) return 'Let the paper settle first.';
        const K = d.sol.length;
        const cur = stages[stages.length - 1];
        if (cutDone() && result && result.iou >= 0.93) return 'It is done — that is the shape!';
        const pre = cutDone() ? 'Undo the cut first (Ctrl+Z). ' : '';
        // where is the user on the way to the solution?
        let match = null, k = -1;
        for (let kk = K; kk >= 0 && !match; kk--) { const m = sameFolding(cur, solStage(kk), s); if (m) { match = m; k = kk; } }
        if (!match) {
          // how many of the user's folds to take back
          for (let j = st.f.length - 1; j >= 0; j--) {
            for (let kk = Math.min(j, K); kk >= 0; kk--) {
              if (sameFolding(stages[j], solStage(kk), s)) {
                const back = st.f.length - j;
                return pre + 'Your last ' + (back === 1 ? 'fold leads' : back + ' folds lead') + ' away from the way I know. Undo ' + (back === 1 ? 'it' : 'them') + ' and ask again.';
              }
            }
          }
          return pre + 'Start again from the flat sheet (Reset) and ask for a hint.';
        }
        if (k === K) {
          const lines = solCuts.map((c) => [M.apply(match.T, [c[0], c[1]]), M.apply(match.T, [c[2], c[3]])]);
          const many = lines.length > 1;
          return {
            text: (cutDone() ? 'The folds are right — the ' + (many ? 'cuts go' : 'cut goes') + ' along the dashed red ' + (many ? 'lines' : 'line') + '. Undo yours if it is not on ' + (many ? 'one of them' : 'it') + '.' : 'The folds are right. Now cut along the dashed red ' + (many ? 'lines' : 'line') + '.'),
            show() { clearHint(); lines.forEach((ln) => showLine(ln[0], ln[1], 'fc-hint-cut')); hintShow = setTimeout(clearHint, 7000); }
          };
        }
        const nf = moveFold(d.sol[k], match.T, solStage(k));
        const a = [nf[0], nf[1]], b = [nf[2], nf[3]];
        return {
          text: pre + 'Fold ' + (k + 1) + ' of ' + K + ': fold along the dashed line, bringing the shaded part over.',
          show() {
            clearHint();
            if (cutDone()) return;
            const mov = partsOn(a, b, nf[4]);
            let hi = '';
            mov.forEach((mp) => { hi += pathPts(mp.poly); });
            if (hi) ctx.s('path', { d: hi, class: 'fc-hint-lift' }, gHint);
            showLine(a, b, 'fc-hint-fold');
            if (mov.length) {
              const R = M.reflect(a, b), c0 = G.areaCentroid(mov.map((mp) => mp.poly)), c1 = M.apply(R, c0);
              const mid = G.mid(c0, c1), n = G.perp(G.norm(G.sub(c1, c0))), cp = G.add(mid, G.mul(n, G.dist(c0, c1) * 0.28));
              ctx.s('path', { d: 'M' + f3(c0[0]) + ' ' + f3(c0[1]) + 'Q' + f3(cp[0]) + ' ' + f3(cp[1]) + ' ' + f3(c1[0]) + ' ' + f3(c1[1]), class: 'fc-pv-arrow', 'marker-end': 'url(#fc-arrowhead)' }, gHint);
            }
            hintShow = setTimeout(clearHint, 9000);
          }
        };
      }

      /* ----- showing the solution ----- */
      function solve() {
        stopAnim();
        clearHint();
        st = { f: [], c: [], o: 0 };
        rebuild();
        drawStatic();
        const steps = [(next) => later(C.anim(250), next)];
        d.sol.forEach((f, i) => {
          steps.push((next) => { st.f.push(f.slice()); rebuild(); ctx.say('The solution: fold ' + (i + 1) + ' of ' + d.sol.length + '…', 'info'); animFold(st.f.length, next); });
          steps.push((next) => later(C.anim(160), next));
        });
        steps.push((next) => {
          st.c = solCuts.map((c) => c.slice());
          rebuild();
          ctx.say(solCuts.length > 1 ? 'The cuts…' : 'The cut…', 'info');
          ctx.sfx('cut');
          itemsSVG(foldedItems());
          flashCut(st.c[st.c.length - 1], next);
        });
        steps.push((next) => openUp(next));
        seq(steps, () => { report(false); ctx.changed('solve'); });
      }

      // an arrow head for previews and hints
      const defs = wb.svg.querySelector('defs');
      if (defs && !defs.querySelector('#fc-arrowhead')) {
        const mk = ctx.s('marker', { id: 'fc-arrowhead', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
        ctx.s('path', { d: 'M0 0L10 5L0 10z', class: 'fc-arrowhead' }, mk);
      }

      rebuild();
      drawStatic();
      ctx.setGoal(cutsAllowed > 1 ? 'Fold, then cut ' + cutsAllowed + ' times at most, so that the pieces on one side make the shape.' : 'Fold, then make one straight cut, so that the pieces on one side make the shape.');
      sayProgress();

      return {
        check,
        hint() { return hint(); },
        solve,
        explain() {
          const K = d.sol.length;
          return 'One way: ' + C.plural(K, 'fold') + ', then one straight cut. Every fold is a mirror: the cut goes through all the layers at once, and when the paper opens each layer shows its own copy of the cut, reflected in every crease. That is how one stroke of the knife draws a whole outline.';
        },
        getState() { return { f: st.f.map((x) => x.slice()), c: st.c.map((x) => x.slice()), o: st.o ? 1 : 0 }; },
        setState(x) {
          stopAnim();
          clearHint();
          st = { f: (x && x.f || []).map((q) => q.slice()), c: (x && x.c || []).map((q) => q.slice()), o: x && x.o ? 1 : 0 };
          if (st.c.length >= cutsAllowed) st.o = 1;
          rebuild();
          drawStatic();
          if (cutDone() && opened()) report(false); else sayProgress();
        },
        reset() { stopAnim(); clearHint(); },
        key(ev) {
          if (ev.type !== 'keydown' || ev.ctrlKey || ev.metaKey || ev.altKey) return false;
          const k2 = ev.key.toLowerCase();
          if (k2 === 'u') { unfoldNow(); return true; }
          if (k2 === 'o') { btnPencil.click(); return true; }
          if (ev.key === 'Escape') { wb.cancelGesture(); gHover.innerHTML = ''; return true; }
          return false;
        },
        destroy() {
          stopAnim();
          wb.svg.removeEventListener('pointermove', onHover);
          wb.svg.removeEventListener('pointerleave', onLeave);
          wb.host.classList.remove('fc-host');
          delete wb.drawToolLine;
          wb.handlers.fold = null; wb.handlers.cut = null; wb.handlers.toolSnap = null;
        }
      };
    },

    thumb(p) {
      const s = sheetOf(p), d = p.data;
      const front = d.color || COLORS[C.hash(p.id) % COLORS.length];
      const pad = Math.max(s[0], s[1]) * 0.06;
      return '<svg viewBox="' + (-pad) + ' ' + (-pad) + ' ' + (s[0] + 2 * pad) + ' ' + (s[1] + 2 * pad) + '" preserveAspectRatio="xMidYMid meet">' +
        '<rect x="0" y="0" width="' + s[0] + '" height="' + s[1] + '" fill="none" stroke="var(--faint)" stroke-width="' + (s[0] * 0.012) + '" stroke-dasharray="' + (s[0] * 0.03) + ' ' + (s[0] * 0.025) + '"/>' +
        '<path fill-rule="evenodd" fill="' + front + '" stroke="rgba(0,0,0,.25)" stroke-width="' + (s[0] * 0.008) + '" d="' + loopsOf(d.target).map(pathPts).join('') + '"/></svg>';
    }
  });

  C.css('foldcut', `
    .fc-host .wb-foldshade { display: none; }
    .fc-ghost { fill: none; stroke: var(--faint); stroke-width: 1px; vector-effect: non-scaling-stroke; stroke-dasharray: 6 5; }
    .fc-cardbg { fill: var(--panel-2); stroke: var(--line); stroke-width: 1px; vector-effect: non-scaling-stroke; }
    .fc-cardt { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 700; fill: var(--muted); letter-spacing: .02em; }
    .fc-minisheet { fill: none; stroke: var(--faint); stroke-width: 1px; vector-effect: non-scaling-stroke; stroke-dasharray: 4 3; }
    .fc-minishape { stroke: rgba(0,0,0,.35); stroke-width: 1px; vector-effect: non-scaling-stroke; }
    .fc-f .fc-sh { fill: #000; fill-opacity: .22; }
    .fc-face { stroke: rgba(0,0,0,.3); stroke-width: 1px; vector-effect: non-scaling-stroke; stroke-linejoin: round; }
    .fc-dark { fill: #000; }
    .fc-pen { fill: none; stroke: #2b2f45; stroke-width: 1.5px; vector-effect: non-scaling-stroke; stroke-linecap: round; opacity: .8; }
    .fc-f.back .fc-pen { opacity: .55; }
    .fc-f.scrap .fc-face { stroke-dasharray: 3 2; }
    .fc-f.keep.good .fc-face { stroke: rgba(0,0,0,.45); }
    .xray .fc-face { fill-opacity: .5; }
    .xray .fc-sh { display: none; }
    .fc-target { fill: none; stroke: var(--gold); stroke-width: 2.2px; vector-effect: non-scaling-stroke; stroke-dasharray: 7 5; }
    .fc-dots circle { fill: var(--gold); opacity: .6; pointer-events: none; }
    .fc-snapring { fill: none; stroke: var(--gold); stroke-width: 2px; vector-effect: non-scaling-stroke; pointer-events: none; }
    .fc-pill { fill: var(--panel); stroke: var(--line); stroke-width: 1px; vector-effect: non-scaling-stroke; opacity: .94; pointer-events: none; }
    .fc-pill.warn { stroke: var(--red); }
    .fc-pill.good { stroke: var(--green); }
    .fc-pillt { font-family: "Segoe UI", system-ui, sans-serif; font-weight: 700; fill: var(--text); pointer-events: none; }
    .fc-pv-lift { fill: var(--accent); fill-opacity: .22; pointer-events: none; }
    .fc-pv-ghost { fill: var(--gold); fill-opacity: .16; stroke: var(--gold); stroke-width: 1.6px; vector-effect: non-scaling-stroke; stroke-dasharray: 5 4; pointer-events: none; }
    .fc-pv-pen { fill: none; stroke: var(--gold); stroke-width: 2px; vector-effect: non-scaling-stroke; pointer-events: none; }
    .fc-pv-arrow { fill: none; stroke: var(--gold); stroke-width: 2px; vector-effect: non-scaling-stroke; pointer-events: none; }
    .fc-arrowhead { fill: var(--gold); }
    .fc-pv-knife { stroke: var(--red); stroke-width: 1.4px; vector-effect: non-scaling-stroke; opacity: .85; pointer-events: none; }
    .fc-slash { stroke: #fff; stroke-width: 3px; vector-effect: non-scaling-stroke; stroke-linecap: round; filter: drop-shadow(0 0 4px var(--red)); }
    .fc-hint-fold { stroke: var(--gold); stroke-width: 2.4px; vector-effect: non-scaling-stroke; stroke-dasharray: 10 4 2 4; animation: fcpulse 1s ease-in-out infinite; }
    .fc-hint-cut { stroke: var(--red); stroke-width: 2.4px; vector-effect: non-scaling-stroke; stroke-dasharray: 9 5; animation: fcpulse 1s ease-in-out infinite; }
    .fc-hint-lift { fill: var(--gold); fill-opacity: .32; pointer-events: none; }
    @keyframes fcpulse { 50% { opacity: .4; } }
  `);
})(typeof window !== 'undefined' ? window : globalThis);
