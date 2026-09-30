/* The Puzzle Cabinet · geom.js
 *
 * Plane geometry shared by the engines: vectors, polygons, placements,
 * cutting a polygon along a line, reflecting across a line, and comparing
 * two shapes by rasterising them (so "does this arrangement fill that
 * silhouette?" needs no exact polygon union).
 *
 * Points are [x, y] arrays. A placement t = { x, y, rot, flip, scale } maps a
 * shape's local points to the world: mirror in x when flip, scale, rotate by
 * rot degrees (counter-clockwise in maths axes, clockwise on screen since y
 * points down), then move by (x, y). An affine matrix is [a, b, c, d, e, f]
 * as in SVG: x' = a x + c y + e, y' = b x + d y + f.
 */
(function (root) {
  'use strict';

  const G = {};
  (root.Cabinet = root.Cabinet || {}).geom = G;

  const EPS = 1e-9;
  G.EPS = EPS;
  const RAD = Math.PI / 180;

  /* ---------- vectors ---------- */

  G.add = (a, b) => [a[0] + b[0], a[1] + b[1]];
  G.sub = (a, b) => [a[0] - b[0], a[1] - b[1]];
  G.mul = (a, k) => [a[0] * k, a[1] * k];
  G.dot = (a, b) => a[0] * b[0] + a[1] * b[1];
  G.cross = (a, b) => a[0] * b[1] - a[1] * b[0];
  G.len = (a) => Math.hypot(a[0], a[1]);
  G.dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  G.dist2 = (a, b) => (a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]);
  G.norm = (a) => { const l = Math.hypot(a[0], a[1]) || 1; return [a[0] / l, a[1] / l]; };
  G.lerp = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
  G.mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
  G.perp = (a) => [-a[1], a[0]];
  G.rot = function (p, deg, c) {
    const r = deg * RAD, cs = Math.cos(r), sn = Math.sin(r);
    const x = p[0] - (c ? c[0] : 0), y = p[1] - (c ? c[1] : 0);
    return [x * cs - y * sn + (c ? c[0] : 0), x * sn + y * cs + (c ? c[1] : 0)];
  };
  G.angle = (a) => Math.atan2(a[1], a[0]) / RAD;
  G.normDeg = (d) => ((d % 360) + 360) % 360;
  G.snapDeg = (d, step) => step ? Math.round(d / step) * step : d;
  G.near = (a, b, tol) => G.dist2(a, b) <= (tol || 1e-6) * (tol || 1e-6);
  G.round = (p, k) => { k = k || 1e6; return [Math.round(p[0] * k) / k, Math.round(p[1] * k) / k]; };

  /* ---------- placements and matrices ---------- */

  G.place = function (p, t) {
    if (!t) return p.slice();
    let x = p[0], y = p[1];
    if (t.flip) x = -x;
    const s = t.scale == null ? 1 : t.scale;
    x *= s; y *= s;
    const r = (t.rot || 0) * RAD, cs = Math.cos(r), sn = Math.sin(r);
    return [x * cs - y * sn + (t.x || 0), x * sn + y * cs + (t.y || 0)];
  };
  G.placePoly = (poly, t) => poly.map((p) => G.place(p, t));
  G.unplace = function (p, t) {
    let x = p[0] - (t.x || 0), y = p[1] - (t.y || 0);
    const r = -(t.rot || 0) * RAD, cs = Math.cos(r), sn = Math.sin(r);
    let u = x * cs - y * sn, v = x * sn + y * cs;
    const s = t.scale == null ? 1 : t.scale;
    u /= s; v /= s;
    if (t.flip) u = -u;
    return [u, v];
  };
  G.matOf = function (t) {
    const s = t.scale == null ? 1 : t.scale, r = (t.rot || 0) * RAD, cs = Math.cos(r) * s, sn = Math.sin(r) * s;
    const f = t.flip ? -1 : 1;
    return [cs * f, sn * f, -sn, cs, t.x || 0, t.y || 0];
  };
  G.svgTransform = function (t) {
    let s = 'translate(' + r3(t.x || 0) + ' ' + r3(t.y || 0) + ')';
    if (t.rot) s += ' rotate(' + r3(t.rot) + ')';
    const sc = t.scale == null ? 1 : t.scale;
    if (t.flip || sc !== 1) s += ' scale(' + r3((t.flip ? -1 : 1) * sc) + ' ' + r3(sc) + ')';
    return s;
  };
  function r3(v) { return Math.round(v * 1000) / 1000; }

  G.M = {
    id: () => [1, 0, 0, 1, 0, 0],
    mul(m, n) { // m after n
      return [
        m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1],
        m[0] * n[2] + m[2] * n[3], m[1] * n[2] + m[3] * n[3],
        m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]
      ];
    },
    inv(m) {
      const det = m[0] * m[3] - m[1] * m[2];
      const a = m[3] / det, b = -m[1] / det, c = -m[2] / det, d = m[0] / det;
      return [a, b, c, d, -(a * m[4] + c * m[5]), -(b * m[4] + d * m[5])];
    },
    apply(m, p) { return [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]]; },
    det(m) { return m[0] * m[3] - m[1] * m[2]; },
    reflect(a, b) { // reflection across the line through a and b
      const d = G.norm(G.sub(b, a)), c2 = d[0] * d[0] - d[1] * d[1], s2 = 2 * d[0] * d[1];
      const m = [c2, s2, s2, -c2, 0, 0];
      const q = G.M.apply(m, a);
      m[4] = a[0] - q[0]; m[5] = a[1] - q[1];
      return m;
    },
    rotate(deg, c) {
      const r = deg * RAD, cs = Math.cos(r), sn = Math.sin(r);
      c = c || [0, 0];
      return [cs, sn, -sn, cs, c[0] - cs * c[0] + sn * c[1], c[1] - sn * c[0] - cs * c[1]];
    },
    translate: (x, y) => [1, 0, 0, 1, x, y],
    svg: (m) => 'matrix(' + m.map(r3).join(' ') + ')'
  };

  G.reflect = function (p, a, b) { return G.M.apply(G.M.reflect(a, b), p); };
  G.reflectPoly = function (poly, a, b) {
    const m = G.M.reflect(a, b);
    return poly.map((p) => G.M.apply(m, p)).reverse(); // keep the winding
  };

  /* ---------- polygons ---------- */

  G.area = function (poly) { // signed: > 0 counter-clockwise in maths axes
    let s = 0;
    for (let i = 0, n = poly.length; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % n];
      s += a[0] * b[1] - b[0] * a[1];
    }
    return s / 2;
  };
  G.absArea = (poly) => Math.abs(G.area(poly));

  G.centroid = function (poly) {
    let cx = 0, cy = 0, a = 0;
    for (let i = 0, n = poly.length; i < n; i++) {
      const p = poly[i], q = poly[(i + 1) % n], k = p[0] * q[1] - q[0] * p[1];
      a += k; cx += (p[0] + q[0]) * k; cy += (p[1] + q[1]) * k;
    }
    if (Math.abs(a) < EPS) {
      let sx = 0, sy = 0;
      poly.forEach((p) => { sx += p[0]; sy += p[1]; });
      return [sx / poly.length, sy / poly.length];
    }
    return [cx / (3 * a), cy / (3 * a)];
  };

  G.bbox = function (polys) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    const eat = (p) => {
      if (p[0] < x0) x0 = p[0]; if (p[0] > x1) x1 = p[0];
      if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1];
    };
    (polys || []).forEach((poly) => {
      if (poly.length && typeof poly[0] === 'number') eat(poly); else poly.forEach(eat);
    });
    return { x0, y0, x1, y1, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
  };

  G.pointInPoly = function (pt, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a[1] > pt[1]) !== (b[1] > pt[1]) && pt[0] < (b[0] - a[0]) * (pt[1] - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
    }
    return inside;
  };

  G.segDist = function (p, a, b) { // distance from p to segment ab
    const ab = G.sub(b, a), l2 = G.dot(ab, ab);
    let t = l2 ? G.dot(G.sub(p, a), ab) / l2 : 0;
    t = Math.max(0, Math.min(1, t));
    return G.dist(p, G.lerp(a, b, t));
  };

  // where segments p1p2 and p3p4 cross: { t, u, pt } with t, u in [0,1], or null
  G.segCross = function (p1, p2, p3, p4) {
    const r = G.sub(p2, p1), s = G.sub(p4, p3), den = G.cross(r, s);
    if (Math.abs(den) < EPS) return null;
    const q = G.sub(p3, p1), t = G.cross(q, s) / den, u = G.cross(q, r) / den;
    if (t < -EPS || t > 1 + EPS || u < -EPS || u > 1 + EPS) return null;
    return { t, u, pt: G.lerp(p1, p2, t) };
  };

  G.lineCross = function (p1, p2, p3, p4) { // infinite lines
    const r = G.sub(p2, p1), s = G.sub(p4, p3), den = G.cross(r, s);
    if (Math.abs(den) < EPS) return null;
    const t = G.cross(G.sub(p3, p1), s) / den;
    return G.lerp(p1, p2, t);
  };

  G.side = (p, a, b) => G.cross(G.sub(b, a), G.sub(p, a)); // > 0 left of a->b (maths axes)

  // drop repeated and collinear points
  G.clean = function (poly, tol) {
    tol = tol || 1e-7;
    let out = [];
    poly.forEach((p) => { if (!out.length || !G.near(out[out.length - 1], p, tol)) out.push(p); });
    if (out.length > 1 && G.near(out[0], out[out.length - 1], tol)) out.pop();
    let changed = true;
    while (changed && out.length > 3) {
      changed = false;
      for (let i = 0; i < out.length; i++) {
        const a = out[(i + out.length - 1) % out.length], b = out[i], c = out[(i + 1) % out.length];
        if (Math.abs(G.cross(G.sub(b, a), G.sub(c, b))) < tol * Math.max(1, G.dist(a, c))) {
          out.splice(i, 1); changed = true; break;
        }
      }
    }
    return out;
  };

  G.convexHull = function (pts) {
    const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    if (p.length < 3) return p;
    const lower = [], upper = [];
    for (const q of p) {
      while (lower.length >= 2 && G.cross(G.sub(lower[lower.length - 1], lower[lower.length - 2]), G.sub(q, lower[lower.length - 2])) <= 0) lower.pop();
      lower.push(q);
    }
    for (let i = p.length - 1; i >= 0; i--) {
      const q = p[i];
      while (upper.length >= 2 && G.cross(G.sub(upper[upper.length - 1], upper[upper.length - 2]), G.sub(q, upper[upper.length - 2])) <= 0) upper.pop();
      upper.push(q);
    }
    upper.pop(); lower.pop();
    return lower.concat(upper);
  };

  G.isConvex = function (poly) {
    let sign = 0;
    for (let i = 0, n = poly.length; i < n; i++) {
      const c = G.cross(G.sub(poly[(i + 1) % n], poly[i]), G.sub(poly[(i + 2) % n], poly[(i + 1) % n]));
      if (Math.abs(c) < EPS) continue;
      if (!sign) sign = Math.sign(c); else if (Math.sign(c) !== sign) return false;
    }
    return true;
  };

  /* Cut a simple polygon along the line through a and b.
   *   opts.segment: only cut where the drawn segment a-b covers the chord
   *                 (a knife stroke that stops short leaves that part whole)
   * Returns null when nothing is cut, else an array of pieces
   * [{ poly, side }] where side is +1 left of a->b, -1 right, 0 mixed. */
  G.splitPoly = function (poly, a, b, opts) {
    opts = opts || {};
    const L = G.dist(a, b);
    if (L < EPS) return null;
    const u = G.mul(G.sub(b, a), 1 / L), n = G.perp(u);
    const scale = Math.max(1e-6, G.bbox([poly]).w + G.bbox([poly]).h);
    let shift = 0;
    let d;
    for (let attempt = 0; attempt < 8; attempt++) {
      d = poly.map((p) => G.dot(G.sub(p, a), n) - shift);
      if (d.every((v) => Math.abs(v) > scale * 1e-9)) break;
      shift += scale * 1.37e-7 * (attempt + 1) * (attempt % 2 ? -1 : 1);
    }
    const N = poly.length;
    const xs = []; // crossings: { edge, pt, q }
    for (let i = 0; i < N; i++) {
      const j = (i + 1) % N;
      if ((d[i] > 0) !== (d[j] > 0)) {
        const t = d[i] / (d[i] - d[j]);
        const pt = G.lerp(poly[i], poly[j], t);
        xs.push({ edge: i, t, pt, q: G.dot(G.sub(pt, a), u) });
      }
    }
    if (xs.length < 2) return null;
    const sorted = xs.slice().sort((p, q) => p.q - q.q);
    const tol = scale * 1e-6;
    let active = 0;
    for (let k = 0; k + 1 < sorted.length; k += 2) {
      const c0 = sorted[k], c1 = sorted[k + 1];
      const on = !opts.segment || (c0.q >= -tol - (opts.reach || 0) && c1.q <= L + tol + (opts.reach || 0));
      c0.partner = on ? c1 : null;
      c1.partner = on ? c0 : null;
      if (on) active++;
    }
    if (!active) return null;
    // the ring with active crossings inserted after the start of their edge
    const ring = [];
    for (let i = 0; i < N; i++) {
      ring.push({ pt: poly[i], orig: true, side: d[i] > 0 ? 1 : -1 });
      xs.filter((x) => x.edge === i && x.partner).sort((p, q) => p.t - q.t).forEach((x) => {
        x.node = { pt: x.pt, cross: x };
        ring.push(x.node);
      });
    }
    ring.forEach((node, i) => { node.i = i; });
    const R = ring.length;
    const used = new Array(R).fill(false);
    const pieces = [];
    for (let s = 0; s < R; s++) {
      if (!ring[s].orig || used[s]) continue;
      const loop = [];
      let sideSum = 0;
      let i = s, guard = 0;
      do {
        const node = ring[i];
        loop.push(node.pt);
        if (node.orig) { used[i] = true; sideSum += node.side; }
        if (node.cross) {
          const j = node.cross.partner.node.i;
          loop.push(ring[j].pt);
          i = (j + 1) % R;
        } else i = (i + 1) % R;
        if (++guard > 4 * R + 8) break;
      } while (i !== s);
      const cl = G.clean(loop);
      if (cl.length >= 3 && G.absArea(cl) > scale * scale * 1e-9) {
        const allL = loop.length && sideSum;
        pieces.push({ poly: cl, side: Math.sign(allL) });
      }
    }
    if (pieces.length < 2) return null;
    // mark mixed pieces (only possible with a partial knife stroke)
    pieces.forEach((pc) => {
      const c = G.centroid(pc.poly);
      pc.side = G.dot(G.sub(c, a), n) > 0 ? 1 : -1;
    });
    return pieces;
  };

  /* ---------- rasters: compare shapes without polygon booleans ---------- */

  // fill polygons (each with the even-odd rule, the set as a union) into a W x H mask
  G.raster = function (polys, box, W, H, mask) {
    mask = mask || new Uint8Array(W * H);
    const sx = W / box.w, sy = H / box.h;
    polys.forEach((poly) => {
      const pts = poly.map((p) => [(p[0] - box.x0) * sx, (p[1] - box.y0) * sy]);
      const n = pts.length;
      let ymin = Infinity, ymax = -Infinity;
      pts.forEach((p) => { if (p[1] < ymin) ymin = p[1]; if (p[1] > ymax) ymax = p[1]; });
      const r0 = Math.max(0, Math.floor(ymin)), r1 = Math.min(H - 1, Math.ceil(ymax));
      const xs = [];
      for (let r = r0; r <= r1; r++) {
        // sample a hair off the pixel centre, so shared edges on the lattice never land exactly on a sample
        const y = r + 0.5 + 0.00731;
        xs.length = 0;
        for (let i = 0, j = n - 1; i < n; j = i++) {
          const a = pts[i], b = pts[j];
          if ((a[1] > y) !== (b[1] > y)) xs.push(a[0] + (y - a[1]) * (b[0] - a[0]) / (b[1] - a[1]));
        }
        xs.sort((p, q) => p - q);
        for (let k = 0; k + 1 < xs.length; k += 2) {
          // half-open [left, right): a pixel on an edge shared by two pieces belongs to one of them
          const c0 = Math.max(0, Math.ceil(xs[k] - 0.51317)), c1 = Math.min(W - 1, Math.ceil(xs[k + 1] - 0.51317) - 1);
          for (let c = c0; c <= c1; c++) mask[r * W + c] = 1;
        }
      }
    });
    return mask;
  };

  G.rasterArea = function (polys, res) {
    const box = G.bbox(polys);
    const W = res || 256, H = Math.max(1, Math.round(W * box.h / Math.max(box.w, 1e-9)));
    const m = G.raster(polys, box, W, H);
    let n = 0;
    for (let i = 0; i < m.length; i++) n += m[i];
    return n * (box.w / W) * (box.h / H);
  };

  /* Compare two shapes (each a list of polygons, unioned).
   *   opts.align: 'none' (default) compare where they are;
   *               'bbox' first move B so the two bounding boxes share a corner;
   *               'centroid' first move B's area centroid onto A's
   *   opts.res:   raster size of the longer side (default 240)
   * Returns { iou, missing, extra } as fractions of B's area. */
  G.compareShapes = function (A, B, opts) {
    opts = opts || {};
    let bb = B;
    if (opts.align === 'bbox') {
      const ba = G.bbox(A), bbx = G.bbox(B);
      bb = B.map((poly) => poly.map((p) => [p[0] - bbx.x0 + ba.x0, p[1] - bbx.y0 + ba.y0]));
    } else if (opts.align === 'centroid') {
      const ca = G.areaCentroid(A), cb = G.areaCentroid(B);
      bb = B.map((poly) => poly.map((p) => [p[0] - cb[0] + ca[0], p[1] - cb[1] + ca[1]]));
    }
    const box = G.bbox(A.concat(bb));
    const pad = Math.max(box.w, box.h) * 0.02 + 1e-9;
    box.x0 -= pad; box.y0 -= pad; box.w += 2 * pad; box.h += 2 * pad;
    const res = opts.res || 240;
    const W = box.w >= box.h ? res : Math.max(8, Math.round(res * box.w / box.h));
    const H = box.h > box.w ? res : Math.max(8, Math.round(res * box.h / box.w));
    const ma = G.raster(A, box, W, H), mb = G.raster(bb, box, W, H);
    let both = 0, onlyA = 0, onlyB = 0, nb = 0;
    for (let i = 0; i < ma.length; i++) {
      if (ma[i] && mb[i]) both++;
      else if (ma[i]) onlyA++;
      else if (mb[i]) onlyB++;
      if (mb[i]) nb++;
    }
    return {
      iou: both / Math.max(1, both + onlyA + onlyB),
      missing: onlyB / Math.max(1, nb),
      extra: onlyA / Math.max(1, nb)
    };
  };

  G.areaCentroid = function (polys) {
    let ax = 0, ay = 0, at = 0;
    polys.forEach((p) => {
      const a = G.absArea(p), c = G.centroid(p);
      ax += c[0] * a; ay += c[1] * a; at += a;
    });
    return at ? [ax / at, ay / at] : [0, 0];
  };

  // do any two of these polygons overlap by more than a sliver?
  G.overlapArea = function (polys, res) {
    const box = G.bbox(polys);
    const W = res || 200, H = Math.max(1, Math.round(W * box.h / Math.max(box.w, 1e-9)));
    const count = new Uint8Array(W * H);
    polys.forEach((poly) => {
      const m = G.raster([poly], box, W, H);
      for (let i = 0; i < m.length; i++) if (m[i]) count[i]++;
    });
    let over = 0;
    for (let i = 0; i < count.length; i++) if (count[i] > 1) over++;
    return over * (box.w / W) * (box.h / H);
  };

  /* ---------- congruence: the same figure moved, turned or mirrored ---------- */

  function canonSegs(segs) {
    return segs.map((s) => (s[0][0] < s[1][0] - 1e-9 || (Math.abs(s[0][0] - s[1][0]) < 1e-9 && s[0][1] <= s[1][1])) ? s : [s[1], s[0]]);
  }

  // are two sets of segments the same figure up to a rigid motion (and a
  // mirror image when allowMirror)? tol is in the figures' own units.
  G.segmentsCongruent = function (A, B, opts) {
    opts = opts || {};
    const tol = opts.tol || 0.08;
    if (A.length !== B.length) return false;
    if (!A.length) return true;
    const a0 = A[0], la = G.dist(a0[0], a0[1]);
    const mirrors = opts.allowMirror === false ? [false] : [false, true];
    for (const s of B) {
      if (Math.abs(G.dist(s[0], s[1]) - la) > tol) continue;
      for (const [p, q] of [[s[0], s[1]], [s[1], s[0]]]) {
        for (const mir of mirrors) {
          const m = frameMap(a0[0], a0[1], p, q, mir);
          if (!m) continue;
          const mapped = A.map((sg) => [G.M.apply(m, sg[0]), G.M.apply(m, sg[1])]);
          if (matchSegs(mapped, B, tol)) return true;
        }
      }
    }
    return false;
  };
  function frameMap(a0, a1, b0, b1, mirror) {
    // matrix taking segment a0a1 onto b0b1 (with an optional mirror)
    const da = G.sub(a1, a0), db = G.sub(b1, b0);
    const la = G.len(da), lb = G.len(db);
    if (la < EPS || lb < EPS) return null;
    let m = G.M.translate(-a0[0], -a0[1]);
    m = G.M.mul(G.M.rotate(-G.angle(da)), m);
    if (mirror) m = G.M.mul([1, 0, 0, -1, 0, 0], m);
    m = G.M.mul(G.M.rotate(G.angle(db)), m);
    m = G.M.mul(G.M.translate(b0[0], b0[1]), m);
    return m;
  }
  function matchSegs(A, B, tol) {
    const used = new Array(B.length).fill(false);
    for (const s of A) {
      let found = -1;
      for (let i = 0; i < B.length; i++) {
        if (used[i]) continue;
        const t = B[i];
        if ((G.dist(s[0], t[0]) < tol && G.dist(s[1], t[1]) < tol) || (G.dist(s[0], t[1]) < tol && G.dist(s[1], t[0]) < tol)) { found = i; break; }
      }
      if (found < 0) return false;
      used[found] = true;
    }
    return true;
  }
  G.canonSegs = canonSegs;

  // are two point sets the same up to a rigid motion (and a mirror image)?
  G.pointsCongruent = function (A, B, opts) {
    opts = opts || {};
    const tol = opts.tol || 0.08;
    if (A.length !== B.length) return false;
    if (A.length <= 1) return true;
    const mirrors = opts.allowMirror === false ? [false] : [false, true];
    // anchor on the pair of A with the largest separation for stability
    let i0 = 0, i1 = 1, best = -1;
    for (let i = 0; i < A.length; i++) for (let j = i + 1; j < A.length; j++) {
      const dd = G.dist(A[i], A[j]); if (dd > best) { best = dd; i0 = i; i1 = j; }
    }
    for (let p = 0; p < B.length; p++) for (let q = 0; q < B.length; q++) {
      if (p === q || Math.abs(G.dist(B[p], B[q]) - best) > tol) continue;
      for (const mir of mirrors) {
        const m = frameMap(A[i0], A[i1], B[p], B[q], mir);
        if (!m) continue;
        const used = new Array(B.length).fill(false);
        let ok = true;
        for (const pt of A) {
          const mp = G.M.apply(m, pt);
          let f = -1;
          for (let k = 0; k < B.length; k++) if (!used[k] && G.dist(mp, B[k]) < tol) { f = k; break; }
          if (f < 0) { ok = false; break; }
          used[f] = true;
        }
        if (ok) return true;
      }
    }
    return false;
  };

  /* ---------- small numeric helpers ---------- */

  G.gcd = function (a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { const t = a % b; a = b; b = t; } return a; };
  G.clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
})(typeof window !== 'undefined' ? window : globalThis);
