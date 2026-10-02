/* HYPER-PROJECTIONS · constructions/axonometric-projections.js
 *
 *   ax-trace-triangle   the picture plane cuts the three axes in a triangle; the axes of the picture are its altitudes
 *   ax-iso-block        an isometric drawing of a plate with a hole and a slot: 30° set square, dividers, four-centre circle
 *   ax-iso-scale        the isometric scale from a 30° and a 45° line (0.8165 without a calculator)
 *   ax-iso-cylinder     a cylinder in isometric: top ellipse by four centres, the lower half carried down, the tangents
 *   ax-dimetric-axes    the dimetric 1 : 1 : ½ axes laid out from 8 : 1 and 8 : 7 triangles, and a box on them
 *   ax-trimetric        a trimetric axes (15° and 45°) with the three scales read from the matrix, and a stepped block
 *   ax-pohlke           any three axes: the trace triangle, the rabatment of two coordinate planes, the three scales
 *   ax-exploded         an exploded isometric of a three-part assembly along its centre line
 * Every point is computed (k.g), never guessed; hidden lines are removed by a small sampled hidden-line routine.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI;
  const C30 = Math.cos(PI / 6);
  const g = Hyper.construct.g;

  /* ------------------------------------------------------------------ helpers */
  /* a full-scale isometric drawing: x along the right axis (30° up), z along the left axis (30° up), y vertical */
  const isoMap = (O, a) => (x, y, z) => ({ x: O.x + (a || 1) * C30 * (x - z), y: O.y + (a || 1) * (0.5 * (x + z) + y) });

  /* the shorter arc about c from p to q, as the first and last point in counter-clockwise order */
  const ccw = (c, p, q) => (g.cross(g.sub(p, c), g.sub(q, c)) >= 0 ? [p, q] : [q, p]);
  function arcShort(k, c, p, q, o) { const pq = ccw(c, p, q); return k.arc3(c, pq[0], pq[1], o); }
  function sampleArc(c, p, q, n) {
    const r = g.dist(c, p), a0 = g.angleOf(g.sub(p, c)), a1 = g.angleOf(g.sub(q, c));
    let d = a1 - a0; while (d > PI) d -= TAU; while (d < -PI) d += TAU;
    const pts = []; for (let i = 0; i <= n; i++) pts.push(g.polar(c, r, a0 + d * i / n));
    return pts;
  }

  /* the four-centre ellipse of the circle of radius r about c whose plane has the paper unit directions u and v */
  function fourCentre(c, r, u, v) {
    const ru = g.mul(u, r), rv = g.mul(v, r);
    const P = [g.sub(g.sub(c, ru), rv), g.sub(g.add(c, ru), rv), g.add(g.add(c, ru), rv), g.add(g.sub(c, ru), rv)];
    const m = P.map((p, i) => g.mid(p, P[(i + 1) % 4]));
    const obtuse = g.dot(u, v) < 0 ? [0, 2] : [1, 3];
    const arcs = [];
    for (let i = 0; i < 4; i++) {
      const j = (i + 1) % 4;
      if (obtuse.includes(j)) arcs.push({ c: P[(j + 2) % 4], p: m[i], q: m[j], big: true });
      else arcs.push({ c: g.lineLine(P[(j + 3) % 4], m[j], P[(j + 1) % 4], m[i]), p: m[i], q: m[j], big: false });
    }
    const pts = n => { let all = []; arcs.forEach(a => { all = all.concat(sampleArc(a.c, a.p, a.q, n || 24)); }); return all; };
    return { P, m, arcs, obtuse, pts, c, r };
  }
  function inPoly(q, poly) {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if (((a.y > q.y) !== (b.y > q.y)) && (q.x < (b.x - a.x) * (q.y - a.y) / (b.y - a.y) + a.x)) c = !c;
    }
    return c;
  }
  /* the runs of consecutive points of `pts` that lie inside `poly` */
  function runsInside(pts, poly) {
    const runs = []; let cur = [];
    pts.forEach(p => { if (inPoly(p, poly)) cur.push(p); else { if (cur.length > 1) runs.push(cur); cur = []; } });
    if (cur.length > 1) runs.push(cur);
    return runs;
  }
  const shiftPts = (pts, dx, dy) => pts.map(p => ({ x: p.x + dx, y: p.y + dy }));

  /* hidden lines for solids made of planar faces under a parallel projection.
     A is the 2×3 matrix paper = A·p, view a vector from the object towards the viewer (any length).
     Returns the visible pieces of the given edges as {a, b} (3-D) and {pa, pb} (paper). */
  function hiddenLines(A, view) {
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
    const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
    const P = p => [A[0][0] * p[0] + A[0][1] * p[1] + A[0][2] * p[2], A[1][0] * p[0] + A[1][1] * p[1] + A[1][2] * p[2]];
    function prep(face) {
      const pts = face.pts; let n = null;
      for (let i = 2; i < pts.length && !n; i++) { const c = cross(sub(pts[1], pts[0]), sub(pts[i], pts[0])); const l = Math.hypot(c[0], c[1], c[2]); if (l > 1e-9) n = [c[0] / l, c[1] / l, c[2] / l]; }
      if (!n) return null;
      const m = [A[0], A[1], n];
      const det = m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
      if (Math.abs(det) < 1e-6) return null;
      const inv = [
        [(m[1][1] * m[2][2] - m[1][2] * m[2][1]) / det, (m[0][2] * m[2][1] - m[0][1] * m[2][2]) / det, (m[0][1] * m[1][2] - m[0][2] * m[1][1]) / det],
        [(m[1][2] * m[2][0] - m[1][0] * m[2][2]) / det, (m[0][0] * m[2][2] - m[0][2] * m[2][0]) / det, (m[0][2] * m[1][0] - m[0][0] * m[1][2]) / det],
        [(m[1][0] * m[2][1] - m[1][1] * m[2][0]) / det, (m[0][1] * m[2][0] - m[0][0] * m[2][1]) / det, (m[0][0] * m[1][1] - m[0][1] * m[1][0]) / det]];
      const pp = pts.map(P); let x0 = 1e18, x1 = -1e18, y0 = 1e18, y1 = -1e18;
      pp.forEach(q => { x0 = Math.min(x0, q[0]); x1 = Math.max(x1, q[0]); y0 = Math.min(y0, q[1]); y1 = Math.max(y1, q[1]); });
      return { pp, inv, d0: dot(n, pts[0]), bb: [x0, y0, x1, y1] };
    }
    function inside(q, pp, margin) {
      let c = false, dmin = 1e18;
      for (let i = 0, j = pp.length - 1; i < pp.length; j = i++) {
        const a = pp[i], b = pp[j];
        if (((a[1] > q[1]) !== (b[1] > q[1])) && (q[0] < (b[0] - a[0]) * (q[1] - a[1]) / (b[1] - a[1]) + a[0])) c = !c;
        const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy; let t = l2 ? ((q[0] - a[0]) * dx + (q[1] - a[1]) * dy) / l2 : 0; t = Math.max(0, Math.min(1, t));
        dmin = Math.min(dmin, Math.hypot(q[0] - a[0] - t * dx, q[1] - a[1] - t * dy));
      }
      return c && dmin > margin;
    }
    return function (faces, edges, o) {
      o = o || {}; const step = o.step || 0.6, margin = 1e-3;
      const F = faces.map(prep).filter(Boolean);
      const hiddenAt = p => {
        const q = P(p), dp = dot(p, view);
        for (const f of F) {
          if (q[0] < f.bb[0] || q[0] > f.bb[2] || q[1] < f.bb[1] || q[1] > f.bb[3]) continue;
          if (!inside(q, f.pp, margin)) continue;
          const r = [q[0], q[1], f.d0];
          const x = [f.inv[0][0] * r[0] + f.inv[0][1] * r[1] + f.inv[0][2] * r[2], f.inv[1][0] * r[0] + f.inv[1][1] * r[1] + f.inv[1][2] * r[2], f.inv[2][0] * r[0] + f.inv[2][1] * r[1] + f.inv[2][2] * r[2]];
          if (dot(x, view) - dp > 5e-3 * Math.hypot(view[0], view[1], view[2])) return true;
        }
        return false;
      };
      const out = [];
      for (const [a, b] of edges) {
        const pa = P(a), pb = P(b);
        const len = Math.hypot(pb[0] - pa[0], pb[1] - pa[1]) + Math.abs(dot(sub(b, a), view)) * 0.01;
        const n = Math.max(6, Math.ceil(len / step));
        const at = t => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
        const vis = []; for (let i = 0; i < n; i++) vis.push(!hiddenAt(at((i + 0.5) / n)));
        let i = 0;
        while (i < n) {
          if (!vis[i]) { i++; continue; }
          let j = i; while (j + 1 < n && vis[j + 1]) j++;
          let t0 = i / n, t1 = (j + 1) / n;
          if (i > 0) { let lo = (i - 0.5) / n, hi = (i + 0.5) / n; for (let q = 0; q < 22; q++) { const mid = (lo + hi) / 2; if (hiddenAt(at(mid))) lo = mid; else hi = mid; } t0 = hi; }
          if (j < n - 1) { let lo = (j + 0.5) / n, hi = (j + 1.5) / n; for (let q = 0; q < 22; q++) { const mid = (lo + hi) / 2; if (hiddenAt(at(mid))) hi = mid; else lo = mid; } t1 = lo; }
          const a1 = at(t0), b1 = at(t1);
          out.push({ a: a1, b: b1, pa: P(a1), pb: P(b1) });
          i = j + 1;
        }
      }
      return out;
    };
  }
  const boxFaces = (x0, x1, y0, y1, z0, z1) => [
    { pts: [[x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0]] }, { pts: [[x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1]] },
    { pts: [[x0, y0, z0], [x0, y1, z0], [x0, y1, z1], [x0, y0, z1]] }, { pts: [[x1, y0, z0], [x1, y1, z0], [x1, y1, z1], [x1, y0, z1]] },
    { pts: [[x0, y0, z0], [x1, y0, z0], [x1, y0, z1], [x0, y0, z1]] }, { pts: [[x0, y1, z0], [x1, y1, z0], [x1, y1, z1], [x0, y1, z1]] }];
  const boxEdges = (x0, x1, y0, y1, z0, z1) => {
    const V = (x, y, z) => [x, y, z], e = [];
    [[x0, x1], [y0, y1], [z0, z1]].forEach(() => {});
    for (const y of [y0, y1]) for (const z of [z0, z1]) e.push([V(x0, y, z), V(x1, y, z)]);
    for (const x of [x0, x1]) for (const z of [z0, z1]) e.push([V(x, y0, z), V(x, y1, z)]);
    for (const x of [x0, x1]) for (const y of [y0, y1]) e.push([V(x, y, z0), V(x, y, z1)]);
    return e;
  };

  /* ================================================================== trace triangle */
  Hyper.construction({
    id: 'ax-trace-triangle',
    title: 'The axes of an axonometric picture from its trace triangle',
    tags: ['axonometric', 'trace triangle', 'orthocentre', 'set square'],
    note: 'Slice the corner off a cube with a plane and look straight at the cut: you see the triangle ABC in its true shape, and the corner O′ at its orthocentre, because each edge of the cube is perpendicular to the opposite side of the cut. So the three axes of any orthographic axonometric picture are the **altitudes** of a triangle, and the triangle must be acute (all the angles at O′ obtuse). The shape of the triangle decides the kind of picture: equilateral gives the isometric, isosceles the dimetric, scalene the trimetric. The example is the 15° / 45° trimetric used on the next pages.',
    build(k) {
      const O = k.pt(0, 0), dS = g.dir((180 + 15) * D2R), dT = g.dir(-45 * D2R), dY = k.pt(0, 1);
      const A = g.mul(dS, 210);
      const C = g.lineLine(A, g.add(A, k.pt(1, 0)), O, g.add(O, dT));
      const B = g.lineLine(A, g.add(A, g.perp(dT)), O, g.add(O, dY));
      const foot = (P, Q, R) => g.foot(P, Q, R);
      const fA = foot(A, B, C), fB = foot(B, A, C), fC = foot(C, A, B);
      k.given('The triangle ABC in which the picture plane cuts the three axes of a cube (true shape). It is acute: all three angles are less than 90°.', () => {
        k.poly([A, B, C], { close: true, cls: 'given' });
        k.point(A, 'A', 'sw'); k.point(B, 'B', 'n'); k.point(C, 'C', 'se');
        k.frame(-230, -200, 520, 175);
      });
      k.step('square', 'With the T-square along AC and a set square against it, draw from B the perpendicular to AC (a vertical): the first altitude.', () => {
        k.seg(B, fB, { cls: 'cons' }); k.right(fB, B, A, { r: 0.6 });
      });
      k.step('square', 'From A draw the perpendicular to BC (set square with one leg along BC).', () => {
        k.seg(A, fA, { cls: 'cons' }); k.right(fA, A, B, { r: 0.6 });
      });
      k.step('square', 'From C draw the perpendicular to AB. The three altitudes meet at one point, the orthocentre O′.', () => {
        k.seg(C, fC, { cls: 'cons' }); k.right(fC, C, A, { r: 0.6 });
        k.point(O, "O′", 'ne');
      });
      k.step('pencil', 'Go over O′A, O′B and O′C: these are the three axes of the picture. The vertical one is the height axis, the others are the two receding axes.', () => {
        k.seg(O, A, { cls: 'thick' }); k.seg(O, B, { cls: 'thick' }); k.seg(O, C, { cls: 'thick' });
        k.label(g.lerp(O, A, 0.5), 'x', 's', { dist: 0.8 }); k.label(g.lerp(O, B, 0.6), 'y', 'e', { dist: 0.8 }); k.label(g.lerp(O, C, 0.6), 'z', 'ne', { dist: 0.5 });
      });
      k.step('protractor', 'Read the angles with the protractor: the left-hand axis (towards A) is 15° from the horizontal, the right-hand one (towards C) 45°, and the three angles between the axes are 105°, 135° and 120° (they add up to 360°).', () => {
        k.angle(O, k.pt(-100, 0), A, { cls: 'cons', label: '15°', r: 3.2, labelDist: 1.4, size: 0.7 });
        k.angle(O, C, k.pt(100, 0), { cls: 'cons', label: '45°', r: 2.0, labelDist: 1.5, size: 0.7 });
        k.angle(O, B, A, { cls: 'curve', label: '105°', r: 1.5, labelDist: 1.75, size: 0.7 });
        k.angle(O, C, B, { cls: 'curve', label: '135°', r: 1.5, labelDist: 1.75, size: 0.7 });
        k.angle(O, A, C, { cls: 'curve', label: '120°', r: 1.5, labelDist: 1.75, size: 0.7 });
      });
      /* the special cases, to the right */
      const tri = (V, name, nameAt) => {
        const [a, b, c] = V; const h = [g.foot(a, b, c), g.foot(b, a, c), g.foot(c, a, b)];
        const H = g.lineLine(a, h[0], b, h[1]);
        k.poly([a, b, c], { close: true, cls: 'aux' });
        [[a, h[0]], [b, h[1]], [c, h[2]]].forEach(([p, q]) => k.seg(p, q, { cls: 'aux' }));
        [a, b, c].forEach(p => k.seg(H, p, { cls: 'cons' }));
        k.dot(H, { cls: 'cons' });
        const aa = Math.round(g.rad(Math.abs(g.angle(a, H, b))) * 10) / 10, bb = Math.round(g.rad(Math.abs(g.angle(b, H, c))) * 10) / 10, cc = Math.round((360 - aa - bb) * 10) / 10;
        const yb = Math.min(a.y, b.y, c.y);
        k.text(H.x, yb - 22, name, { size: 0.8, upright: true });
        k.text(H.x, yb - 40, aa + '° · ' + bb + '° · ' + cc + '°', { size: 0.65, upright: true });
        void nameAt;
      };
      k.note('Equilateral triangle: the three axes are 120° apart and equally foreshortened, the isometric picture.', () => {
        const E = k.pt(355, 60), R = 85;
        tri([g.polar(E, R, 210 * D2R), g.polar(E, R, 330 * D2R), g.polar(E, R, 90 * D2R)], 'isometric', 'n');
      });
      k.note('Isosceles triangle with base √14 and legs √8 (the intercepts √7 : √7 : 1): two equal angles at O′ and one odd axis at half scale, the 1 : 1 : ½ dimetric picture.', () => {
        const kk = 48, a = k.pt(270, -140), b = k.pt(270 + Math.sqrt(14) * kk, -140);
        const cApex = k.pt((a.x + b.x) / 2, -140 + Math.sqrt(8 * kk * kk - 14 * kk * kk / 4));
        tri([a, b, cApex], 'dimetric 1 : 1 : ½', 'n');
      });
    }
  });

  /* ================================================================== isometric block with hole and slot */
  Hyper.construction({
    id: 'ax-iso-block',
    title: 'An isometric drawing of a plate with a hole and a slot',
    tags: ['isometric', 'set square', 'dividers', 'four-centre ellipse'],
    note: 'A full-scale isometric *drawing*: every length along an axis is laid off true. The plate is boxed in first, then the slot and the hole are cut into the top by measuring along the edges. Hidden edges are left out, as in every pictorial: the hole shows only the part of its lower rim that falls inside the upper ellipse, and the floor of the slot is cut off by the near wall. Dimensions: plate 120 × 70 × 24; slot 28 wide, 10 deep, 72 from the left face; hole Ø44 with its centre 38 and 35 from the two faces.',
    build(k) {
      const L = 120, W = 70, H = 24, x1 = 72, x2 = 100, t = 10, hx = 38, hz = 35, hr = 22;
      k.fontScale(0.85);
      const O = k.pt(0, 0), I = isoMap(O, 1), ux = k.pt(C30, 0.5), uz = k.pt(-C30, 0.5), uy = k.pt(0, 1);
      const X = I(L, 0, 0), Z = I(0, 0, W), Y = I(0, H, 0), XY = I(L, H, 0), ZY = I(0, H, W), T = I(L, H, W);
      k.given('The corner O of the plate, the three true dimensions L = 120, W = 70, H = 24 (ticked, to be taken with the dividers) and the sizes of the slot and the hole.', () => {
        k.point(O, 'O', 's');
        [[-60, -34, L, 'L = 120'], [-60, -52, W, 'W = 70'], [-60, -70, H, 'H = 24']].forEach(([x, y, len, lab]) => {
          const a = k.pt(x, y), b = k.pt(x + len, y); k.seg(a, b, { cls: 'given' }); k.tick(a, k.pt(1, 0)); k.tick(b, k.pt(1, 0)); k.label(b, lab, 'e', { upright: true, size: 0.85 });
        });
        k.text(-60, -88, 'slot 28 wide, 10 deep, 72 from the left face · hole Ø44 at 38 and 35', { anchor: 'start', upright: true, size: 0.8 });
        k.frame(-78, -96, 190, 128);
      });
      k.step('square', 'With the 30° set square against the T-square, draw the three isometric axes through O: right at 30°, left at 30° and the vertical.', () => {
        k.seg(O, g.mul(ux, 135), { cls: 'cons' }); k.seg(O, g.mul(uz, 80), { cls: 'cons' }); k.seg(O, g.mul(uy, 40), { cls: 'cons' });
      });
      k.step('dividers', 'Step the three dimensions off the axes: L to the right (X), W to the left (Z), H up (Y).', () => {
        k.point(X, 'X', 'se'); k.point(Z, 'Z', 'sw'); k.point(Y, 'Y', 'e');
      });
      k.step('square', 'Box the plate in: verticals through X and Z, parallels to the axes through Y.', () => {
        k.seg(X, XY, { cls: 'cons' }); k.seg(Z, ZY, { cls: 'cons' }); k.seg(Y, XY, { cls: 'cons' }); k.seg(Y, ZY, { cls: 'cons' });
      });
      k.step('square', 'Parallels from X′ and Z′ meet at the far top corner T: the top face is a rhombus.', () => {
        k.seg(XY, T, { cls: 'cons' }); k.seg(ZY, T, { cls: 'cons' }); k.point(T, 'T', 'n');
      });
      const S1 = I(x1, H, 0), S2 = I(x2, H, 0), S1b = I(x1, H - t, 0), S2b = I(x2, H - t, 0);
      k.step('dividers', 'The slot runs across the top parallel to the left axis. On the top front edge measure 72 and then 100 from the left corner Y: the points S₁ and S₂.', () => {
        k.point(S1, 'S_1', 'n'); k.point(S2, 'S_2', 'n');
      });
      k.step('square', 'Through S₁ and S₂ draw parallels to the left axis, right across the top face.', () => {
        k.seg(S1, I(x1, H, W), { cls: 'cons' }); k.seg(S2, I(x2, H, W), { cls: 'cons' });
      });
      k.step('dividers', 'From S₁ and S₂ measure the depth of the slot, 10, straight down.', () => {
        k.point(S1b, 'S_1′', 'w'); k.point(S2b, 'S_2′', 'e');
      });
      k.step('square', 'Through the two new points draw parallels to the left axis: they are the floor of the slot and the foot of its right wall.', () => {
        k.seg(S1b, I(x1, H - t, W), { cls: 'cons' }); k.seg(S2b, I(x2, H - t, W), { cls: 'cons' });
      });
      const Cc = I(hx, H, hz), cp = I(hx, H, 0), cq = I(0, H, hz);
      k.step('dividers', 'The hole: measure 38 along the top front edge from Y and 35 along the top left edge from Y. Through these marks draw the centre lines (parallel to the axes); they cross at the centre.', () => {
        k.point(cp, '', 'n'); k.point(cq, '', 'n');
        k.seg(cp, g.add(Cc, g.mul(uz, 40)), { cls: 'cons', dash: '7 2 1.5 2' });
        k.seg(cq, g.add(Cc, g.mul(ux, 50)), { cls: 'cons', dash: '7 2 1.5 2' });
        k.point(Cc, 'C', 's');
      });
      const fc = fourCentre(Cc, hr, ux, uz);
      k.step('dividers', 'Lay the radius 22 off on each centre line, both ways from C: four points where the ellipse will touch the sides of its isometric square.', () => {
        fc.m.forEach(p => k.dot(p));
      });
      k.step('square', 'Through the four points draw parallels to the axes: the isometric square of the circle (side 44).', () => {
        k.poly(fc.P, { close: true, cls: 'cons' });
      });
      k.step('straightedge', 'From the two obtuse corners of the square draw lines to the midpoints of the opposite sides: they cross on the long diagonal at the small centres.', () => {
        fc.arcs.forEach(a => { if (!a.big) { const o1 = a.c; k.point(o1, '', 'n'); } });
        const bigC = fc.arcs.filter(a => a.big);
        bigC.forEach(a => { k.seg(a.c, a.p, { cls: 'cons' }); k.seg(a.c, a.q, { cls: 'cons' }); });
      });
      k.step('compass', 'With the corner centres draw the two large arcs between the points of contact.', () => {
        fc.arcs.filter(a => a.big).forEach(a => arcShort(k, a.c, a.p, a.q, { cls: 'curve' }));
      });
      k.step('compass', 'With the two small centres draw the small arcs: they close the ellipse.', () => {
        fc.arcs.filter(a => !a.big).forEach(a => arcShort(k, a.c, a.p, a.q, { cls: 'curve' }));
      });
      /* the visible edges of the plate with the slot */
      const prof = [[0, 0], [L, 0], [L, H], [x2, H], [x2, H - t], [x1, H - t], [x1, H], [0, H]];
      const faces = [{ pts: prof.map(p => [p[0], p[1], 0]).reverse() }, { pts: prof.map(p => [p[0], p[1], W]) }], edges = [];
      prof.forEach((a, i) => {
        const b = prof[(i + 1) % prof.length];
        faces.push({ pts: [[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], W], [a[0], a[1], W]] });
        edges.push([[a[0], a[1], 0], [b[0], b[1], 0]], [[a[0], a[1], W], [b[0], b[1], W]], [[a[0], a[1], 0], [a[0], a[1], W]]);
      });
      const Aiso = [[C30, 0, -C30], [0.5, 1, 0.5]], view = [-1, 1, -1];
      const vis = hiddenLines(Aiso, view)(faces, edges);
      const lower = shiftPts(fc.pts(30), 0, -H), topPoly = fc.pts(30);
      k.step('dividers', 'The hole goes right through the plate: carry the ellipse down by the thickness 24 (move all four centres down, same radii). Only the part of the lower rim that falls inside the upper ellipse can be seen through the hole.', () => {
        runsInside(lower, topPoly).forEach(r => k.curve(r, null, { cls: 'aux', dash: true }));
      });
      k.step('pencil', 'Line in what can be seen: the plate with its notched front edge, the slot with the near wall hiding part of its floor, the full ellipse of the hole and the crescent of its lower rim. Hidden edges are not drawn.', () => {
        vis.forEach(s => k.seg(I(s.a[0], s.a[1], s.a[2]), I(s.b[0], s.b[1], s.b[2]), { cls: 'thick' }));
        runsInside(lower, topPoly).forEach(r => k.curve(r, null, { cls: 'curve' }));
      });
      k.note('Check with the true ellipse (dashed): the four-centre curve is a hand approximation — its axes are 1.155 D and 0.732 D against the true 1.225 D and 0.707 D — but it touches the sides of the square at the same four points.', () => {
        k.ellipse(Cc, hr * Math.sqrt(1.5), hr * Math.SQRT1_2, { cls: 'aux', dash: true, n: 180 });
      });
    }
  });

  /* ================================================================== the isometric scale */
  Hyper.construction({
    id: 'ax-iso-scale',
    title: 'The isometric scale from a 30° and a 45° line',
    tags: ['isometric', 'scale', 'set square'],
    note: 'In a true isometric *projection* every length along an axis is multiplied by cos 45° / cos 30° = 0.8165. The two set squares make the reduction without arithmetic: a true length laid along the 45° line has the horizontal extent L cos 45°; the vertical through its end meets the 30° line at L cos 45° / cos 30°. The marks on the 30° line are the isometric scale. A drawing (full scale) does not need it; a true projection does.',
    build(k) {
      const O = k.pt(0, 0), d30 = g.dir(30 * D2R), d45 = g.dir(45 * D2R);
      const ticks = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140];
      const top = 150;
      k.given('A horizontal line through O. The true lengths 10, 20, 30 … will be read off a scale along the 45° line.', () => {
        k.seg(k.pt(-20, 0), k.pt(top * 1.05, 0), { cls: 'given' }); k.point(O, 'O', 'sw');
        k.frame(-30, -30, 170, 120);
      });
      k.step('square', 'With the 30° set square draw the isometric axis through O, and with the 45° set square the line of true lengths.', () => {
        k.seg(O, g.mul(d30, 160), { cls: 'cons' }); k.seg(O, g.mul(d45, 150), { cls: 'given' });
        k.label(g.mul(d30, 160), '30°', 'e', { upright: true, size: 0.85 }); k.label(g.mul(d45, 150), '45°', 'ne', { upright: true, size: 0.85 });
      });
      k.step('ruler', 'On the 45° line mark the true lengths 10, 20, 30 … 140 from O.', () => {
        ticks.forEach(L => { const p = g.mul(d45, L); k.dot(p, { r: 0.7 }); });
        k.label(g.mul(d45, 100), '100 true', 'nw', { upright: true, size: 0.75 });
      });
      k.step('tee', 'Through each mark draw a vertical (T-square with the set square against it) down to the 30° line.', () => {
        ticks.forEach(L => { const p = g.mul(d45, L); const q = k.pt(p.x, p.x * Math.tan(PI / 6)); k.seg(p, q, { cls: 'cons' }); });
      });
      k.step('pencil', 'The feet of the verticals on the 30° line are the isometric scale: the length marked "100" is only 81.65 from O. Letter the marks with the true lengths they stand for.', () => {
        ticks.forEach(L => {
          const p = g.mul(d45, L), q = k.pt(p.x, p.x * Math.tan(PI / 6));
          k.dot(q, { r: 0.8, cls: 'thick' });
          if (L % 20 === 0) k.label(q, String(L), 'se', { upright: true, size: 0.7, dist: 0.9 });
        });
        const e = k.pt(140 * Math.SQRT1_2, 140 * Math.SQRT1_2 * Math.tan(PI / 6));
        k.seg(O, e, { cls: 'thick' });
      });
      k.note('Check: 100 true becomes 100 × 0.8165 = 81.65 along the 30° line; since the line is inclined, its horizontal extent is 70.7 = 100 cos 45°.', () => {
        const p = g.mul(d45, 100), q = k.pt(p.x, p.x * Math.tan(PI / 6));
        const n = g.perp(g.unit(g.sub(q, O)));
        k.seg(g.add(O, g.mul(n, -12)), g.add(q, g.mul(n, -12)), { cls: 'aux', dash: true });
        k.text(g.mid(O, q).x + 26, g.mid(O, q).y - 14, '81.65', { size: 0.85, upright: true, bg: true });
      });
    }
  });

  /* ================================================================== isometric cylinder */
  Hyper.construction({
    id: 'ax-iso-cylinder',
    title: 'A cylinder in isometric: the ellipse carried down',
    tags: ['isometric', 'cylinder', 'four-centre ellipse', 'compass'],
    note: 'The top rim is drawn once with the four-centre method. The bottom rim is the same ellipse moved down by the height — move the four centres with the dividers — and only its lower half can be seen. The sides are the two verticals that touch both ellipses at their leftmost and rightmost points. Because the four-centre curve has its extreme points on the long diagonal, those points are the ends of the horizontal diameter of the small arcs.',
    build(k) {
      const r = 36, h = 64, ux = k.pt(C30, 0.5), uz = k.pt(-C30, 0.5);
      const C = k.pt(0, 0), fc = fourCentre(C, r, ux, uz);
      k.given('The centre C of the top face, the radius r = 36 and the height h = 64 (ticked, to be taken with the dividers). The axis of the cylinder is vertical.', () => {
        k.point(C, 'C', 'n'); k.line(C, k.pt(0, -1), { cls: 'cons', dash: '7 2 1.5 2' });
        const a = k.pt(-170, 20), b = k.pt(-170 + r, 20), c = k.pt(-170, -40), d = k.pt(-170, -40 - h);
        k.seg(a, b); k.tick(a, k.pt(0, 1)); k.tick(b, k.pt(0, 1)); k.label(g.mid(a, b), 'r', 'n', { upright: true });
        k.seg(c, d); k.tick(c, k.pt(1, 0)); k.tick(d, k.pt(1, 0)); k.label(g.mid(c, d), 'h', 'e', { upright: true });
        k.frame(-190, -h - 70, 100, 70);
      });
      k.step('square', 'Through C draw the two isometric centre lines with the 30° set square.', () => {
        k.seg(g.sub(C, g.mul(ux, r * 1.5)), g.add(C, g.mul(ux, r * 1.5)), { cls: 'cons' }); k.seg(g.sub(C, g.mul(uz, r * 1.5)), g.add(C, g.mul(uz, r * 1.5)), { cls: 'cons' });
      });
      k.step('dividers', 'Lay the radius off from C along both centre lines, both ways: four points 1 – 4.', () => {
        fc.m.forEach((p, i) => k.point(p, String(i + 1), ['se', 'ne', 'nw', 'sw'][i]));
      });
      k.step('square', 'Through the four points draw parallels to the centre lines: the isometric square of side 2r.', () => {
        k.poly(fc.P, { close: true, cls: 'cons' });
      });
      k.step('straightedge', 'From each obtuse corner draw the two lines to the midpoints of the far sides (the points of contact); they cross on the long diagonal at the small centres.', () => {
        fc.arcs.filter(a => a.big).forEach(a => { k.seg(a.c, a.p, { cls: 'cons' }); k.seg(a.c, a.q, { cls: 'cons' }); });
        fc.arcs.filter(a => !a.big).forEach(a => k.point(a.c, '', 'n'));
      });
      k.step('compass', 'Draw the two large arcs from the obtuse corners, and the two small arcs from the small centres: the top ellipse.', () => {
        fc.arcs.forEach(a => arcShort(k, a.c, a.p, a.q, { cls: 'curve' }));
      });
      /* the lower half */
      const sh = p => g.sub(p, k.pt(0, h));
      k.step('dividers', 'Carry the height h straight down from the four centres.', () => {
        fc.arcs.forEach(a => k.point(sh(a.c), '', 'n'));
      });
      k.step('compass', 'With the same radii draw the lower rim — only its front half: the large lower arc, and the lower halves of the two small arcs down to the ends of the horizontal diameter.', () => {
        fc.arcs.forEach(a => {
          const c2 = sh(a.c), p2 = sh(a.p), q2 = sh(a.q);
          if (a.big) { if (a.c.y > 0) arcShort(k, c2, p2, q2, { cls: 'curve' }); }
          else { const rs = g.dist(a.c, a.p), side = a.c.x < 0 ? -1 : 1, ext = g.add(c2, k.pt(side * rs, 0)); arcShort(k, c2, p2.y < q2.y ? p2 : q2, ext, { cls: 'curve' }); }
        });
      });
      const smalls = fc.arcs.filter(a => !a.big), rs = g.dist(smalls[0].c, smalls[0].p);
      const left = smalls.reduce((a, b) => (a.c.x < b.c.x ? a : b)), right = smalls.reduce((a, b) => (a.c.x > b.c.x ? a : b));
      const eL = g.add(left.c, k.pt(-rs, 0)), eR = g.add(right.c, k.pt(rs, 0));
      k.step('tee', 'Draw the two sides: verticals through the leftmost and rightmost points of the top ellipse, down to the lower rim.', () => {
        k.seg(eL, sh(eL), { cls: 'curve' }); k.seg(eR, sh(eR), { cls: 'curve' });
        k.point(eL, '', 'w'); k.point(eR, '', 'e');
      });
      k.note('The true ellipse of the circle (dashed) for comparison. The four-centre curve is a little too narrow along the long axis and a little too tall: 1.155 D by 0.732 D instead of 1.225 D by 0.707 D.', () => {
        k.ellipse(C, r * Math.sqrt(1.5), r * Math.SQRT1_2, { cls: 'aux', dash: true, n: 180 });
        k.ellipse(sh(C), r * Math.sqrt(1.5), r * Math.SQRT1_2, { cls: 'aux', dash: true, n: 180 });
      });
    }
  });

  /* ================================================================== dimetric axes */
  Hyper.construction({
    id: 'ax-dimetric-axes',
    title: 'The 1 : 1 : ½ dimetric axes from an 8 : 1 and an 8 : 7 triangle',
    tags: ['dimetric', 'scale', 'T-square', 'dividers'],
    note: 'In the true projection the right axis is at 7°10′ and the left one at 41°25′ (tan 7.18° = 0.126, tan 41.41° = 0.882). The simple slopes 1 : 8 (7°07′) and 7 : 8 (41°11′) are within a quarter of a degree, so the axes can be laid out with the T-square and the dividers alone, no protractor. The left axis is drawn at **half** the true length, the right and vertical axes at full length: the 1 : 1 : ½ drawing, which is the true projection enlarged by 1.0607.',
    build(k) {
      const u = 14, O = k.pt(0, 0);
      const P8 = k.pt(8 * u, 0), Q = k.pt(8 * u, u), R8 = k.pt(-8 * u, 0), S = k.pt(-8 * u, 7 * u);
      const ex = g.unit(g.sub(Q, O)), ez = g.unit(g.sub(S, O)), ey = k.pt(0, 1);
      const Lx = 100, Hy = 60, Wz = 80;
      const X1 = g.add(O, g.mul(ex, Lx)), Y1 = g.add(O, g.mul(ey, Hy)), Z1 = g.add(O, g.mul(ez, Wz / 2));
      const XY = g.add(X1, g.mul(ey, Hy)), ZY = g.add(Z1, g.mul(ey, Hy)), T = g.add(XY, g.mul(ez, Wz / 2));
      k.given('The corner O, a horizontal through O, and the box to be drawn: 100 wide (x), 60 high (y), 80 deep (z). Take any convenient unit u (here 14) for the layout triangles.', () => {
        k.seg(k.pt(-9 * u, 0), k.pt(9 * u, 0), { cls: 'given' }); k.point(O, 'O', 's');
        const a = k.pt(-135, -40), b = k.pt(-135 + Lx, -40), c = k.pt(-135, -58), d = k.pt(-135 + Wz, -58), e = k.pt(-135, -76), f = k.pt(-135 + Hy, -76);
        [[a, b, 'x = 100'], [c, d, 'z = 80'], [e, f, 'y = 60']].forEach(([p, q, lab]) => { k.seg(p, q, { cls: 'given' }); k.tick(p, k.pt(1, 0)); k.tick(q, k.pt(1, 0)); k.label(q, lab, 'e', { upright: true, size: 0.8 }); });
        k.frame(-150, -90, 150, 135);
      });
      k.step('dividers', 'Step off eight units u to the right of O and eight to the left, along the horizontal.', () => {
        for (let i = 1; i <= 8; i++) { k.dot(k.pt(i * u, 0), { r: 0.5 }); k.dot(k.pt(-i * u, 0), { r: 0.5 }); }
        k.point(P8, '8', 'se'); k.point(R8, '8', 'sw');
      });
      k.step('tee', 'At the right-hand mark erect a perpendicular one unit high (Q); at the left-hand mark one seven units high (S).', () => {
        k.seg(P8, Q, { cls: 'cons' }); k.seg(R8, S, { cls: 'cons' }); k.point(Q, 'Q', 'e'); k.point(S, 'S', 'w');
      });
      k.step('straightedge', 'Draw OQ and OS and extend them: the right axis (rise 1 in 8, 7°07′) and the left axis (rise 7 in 8, 41°11′).', () => {
        k.ray(O, Q, { cls: 'cons' }); k.ray(O, S, { cls: 'cons' });
      });
      k.step('tee', 'The third axis is the vertical through O.', () => {
        k.seg(O, k.pt(0, 85), { cls: 'cons' });
      });
      k.note('Compare the true projection: the axes lie at 7.18° and 41.41° to the horizontal, 97.2° and 131.4° apart. The two layouts differ by less than a quarter of a degree.', () => {
        k.angle(O, k.pt(60, 0), Q, { cls: 'cons', label: '7°', r: 1.2, labelDist: 1.6 });
        k.angle(O, S, k.pt(-60, 0), { cls: 'cons', label: '41°', r: 1.2, labelDist: 1.6 });
      });
      k.step('dividers', 'Lay off the box dimensions: x = 100 full length on the right axis (X), y = 60 full length on the vertical (Y), but z = 80 at HALF length, 40, on the left axis (Z).', () => {
        k.point(X1, 'X', 'se'); k.point(Y1, 'Y', 'e'); k.point(Z1, 'Z', 'w');
      });
      k.step('square', 'Box it in: verticals through X and Z, parallels to the axes through Y and through the new top corners.', () => {
        k.seg(X1, XY, { cls: 'cons' }); k.seg(Z1, ZY, { cls: 'cons' }); k.seg(Y1, XY, { cls: 'cons' }); k.seg(Y1, ZY, { cls: 'cons' });
        k.seg(XY, T, { cls: 'cons' }); k.seg(ZY, T, { cls: 'cons' }); k.point(T, 'T', 'n');
      });
      k.step('pencil', 'Line in the nine visible edges. The front face (between the right and vertical axes) is almost undistorted; the side face is narrow and the top is foreshortened.', () => {
        [[O, X1], [O, Z1], [O, Y1], [X1, XY], [Z1, ZY], [Y1, XY], [Y1, ZY], [XY, T], [ZY, T]].forEach(([p, q]) => k.seg(p, q, { cls: 'thick' }));
      });
      k.note('What you get if you forget to halve the left edge (dashed): a box 80 deep drawn at full length looks twice as deep as it is.', () => {
        const Zf = g.add(O, g.mul(ez, Wz)), ZYf = g.add(Zf, g.mul(ey, Hy)), Tf = g.add(XY, g.mul(ez, Wz));
        [[O, Zf], [Zf, ZYf], [Y1, ZYf], [ZYf, Tf], [XY, Tf]].forEach(([p, q]) => k.seg(p, q, { cls: 'aux', dash: true }));
      });
    }
  });

  /* ================================================================== trimetric */
  const TRI = (function () {
    const thx = 15 * D2R, thz = 45 * D2R, sa = Math.sqrt(Math.tan(thx) * Math.tan(thz)), al = Math.asin(sa), be = Math.atan(Math.tan(thx) / sa);
    return { thx, thz, al, be, sx: Math.sqrt(Math.cos(be) ** 2 + sa * sa * Math.sin(be) ** 2), sy: Math.cos(al), sz: Math.sqrt(Math.sin(be) ** 2 + sa * sa * Math.cos(be) ** 2) };
  })();
  Hyper.construction({
    id: 'ax-trimetric',
    title: 'A trimetric drawing: axes at 15° and 45°, three different scales',
    tags: ['trimetric', 'scale', 'protractor', 'hidden lines'],
    note: 'The picture is made by turning the object by β = 27.37° and tilting it by α = 31.17° (the matrix on the page); that puts the receding axes 15° and 45° below the horizontal and foreshortens the three axes by 0.919 (right), 0.856 (vertical) and 0.650 (left) — three different numbers, so no two directions share a scale. Multiply every true length by the scale of its axis before laying it off.',
    build(k) {
      const O = k.pt(0, 0), sx = TRI.sx, sy = TRI.sy, sz = TRI.sz;
      const ex = k.pt(sx * Math.cos(TRI.thx), sx * Math.sin(TRI.thx)), ey = k.pt(0, sy), ez = k.pt(-sz * Math.cos(TRI.thz), sz * Math.sin(TRI.thz));
      const M = (x, y, z) => ({ x: x * ex.x + y * ey.x + z * ez.x, y: x * ex.y + y * ey.y + z * ez.y });
      const L = 100, W = 80, H1 = 30, H2 = 60;
      k.given('The corner O, a horizontal through O and the object: a block 100 × 80 × 30 with a block 50 × 40 on top at the far corner, total height 60. The scales from the matrix: right axis 0.919, vertical 0.856, left axis 0.650.', () => {
        k.seg(k.pt(-90, 0), k.pt(100, 0), { cls: 'given' }); k.point(O, 'O', 's');
        const rows = [['right axis  100 → ', 100 * sx], ['vertical   30 and 60 → ', 60 * sy], ['left axis  80 → ', 80 * sz]];
        rows.forEach(([t, v], i) => k.text(-95, -34 - 14 * i, t + v.toFixed(1), { anchor: 'start', upright: true, size: 0.8 }));
        k.frame(-110, -85, 105, 135);
      });
      k.step('protractor', 'With the protractor lay off 15° above the horizontal to the right of O: the right axis.', () => {
        k.ray(O, g.add(O, ex), { cls: 'cons' }); k.angle(O, k.pt(60, 0), g.add(O, g.mul(ex, 1)), { cls: 'cons', label: '15°', r: 2.6, labelDist: 1.25, size: 0.8 });
      });
      k.step('square', 'With the 45° set square lay off the left axis, 45° above the horizontal to the left.', () => {
        k.ray(O, g.add(O, ez), { cls: 'cons' }); k.angle(O, g.add(O, ez), k.pt(-60, 0), { cls: 'cons', label: '45°', r: 2.0, labelDist: 1.4, size: 0.8 });
      });
      k.step('tee', 'The vertical axis through O (T-square and set square).', () => {
        k.seg(O, k.pt(0, 110), { cls: 'cons' });
      });
      const bx = M(L, 0, 0), bz = M(0, 0, W), by = M(0, H1, 0);
      k.step('ruler', 'Lay off the scaled lengths on the axes: 100 × 0.919 = 91.9 on the right axis, 80 × 0.650 = 52.0 on the left, 30 × 0.856 = 25.7 up.', () => {
        k.point(bx, 'X', 'se'); k.point(bz, 'Z', 'sw'); k.point(by, 'Y', 'e');
      });
      k.step('square', 'Box in the lower block with parallels to the axes.', () => {
        const xy = M(L, H1, 0), zy = M(0, H1, W), t = M(L, H1, W);
        k.seg(bx, xy, { cls: 'cons' }); k.seg(bz, zy, { cls: 'cons' }); k.seg(by, xy, { cls: 'cons' }); k.seg(by, zy, { cls: 'cons' }); k.seg(xy, t, { cls: 'cons' }); k.seg(zy, t, { cls: 'cons' });
      });
      k.step('dividers', 'On the top face bisect the two near edges (the dividers halve L and W): the corner of the upper block is at 50 along x and 40 along z.', () => {
        k.point(M(L / 2, H1, 0), 'a', 'se'); k.point(M(0, H1, W / 2), 'b', 'sw');
      });
      k.step('square', 'Through a and b draw parallels to the axes: they cross at the near corner P of the upper block.', () => {
        k.seg(M(L / 2, H1, 0), M(L / 2, H1, W), { cls: 'cons' }); k.seg(M(0, H1, W / 2), M(L, H1, W / 2), { cls: 'cons' }); k.point(M(L / 2, H1, W / 2), 'P', 's');
      });
      k.step('ruler', 'Raise the upper block: 30 × 0.856 = 25.7 straight up from P and from the two neighbouring corners; join the tops with parallels.', () => {
        const up = (x, z) => M(x, H2, z);
        [[L / 2, W / 2], [L, W / 2], [L / 2, W], [L, W]].forEach(([x, z]) => k.seg(M(x, H1, z), up(x, z), { cls: 'cons' }));
        k.seg(up(L / 2, W / 2), up(L, W / 2), { cls: 'cons' }); k.seg(up(L / 2, W / 2), up(L / 2, W), { cls: 'cons' }); k.seg(up(L, W / 2), up(L, W), { cls: 'cons' }); k.seg(up(L / 2, W), up(L, W), { cls: 'cons' });
      });
      const A2 = [[ex.x, ey.x, ez.x], [ex.y, ey.y, ez.y]];
      const A3 = [[ex.x, 0, ez.x], [ex.y, ey.y, ez.y]];
      void A2;
      // the viewing direction: null vector of the 2×3 matrix, pointing to the viewer (negative x and z, positive y)
      const r0 = [A3[0][0], A3[0][1], A3[0][2]], r1 = [A3[1][0], A3[1][1], A3[1][2]];
      let v = [r0[1] * r1[2] - r0[2] * r1[1], r0[2] * r1[0] - r0[0] * r1[2], r0[0] * r1[1] - r0[1] * r1[0]];
      if (v[1] < 0) v = v.map(c => -c);
      const A = [[ex.x, ey.x, ez.x], [ex.y, ey.y, ez.y]];
      const faces = boxFaces(0, L, 0, H1, 0, W).concat(boxFaces(L / 2, L, H1, H2, W / 2, W));
      const edges = boxEdges(0, L, 0, H1, 0, W).concat(boxEdges(L / 2, L, H1, H2, W / 2, W));
      const vis = hiddenLines(A, v)(faces, edges);
      k.step('pencil', 'Line in the visible edges. The far edges of the lower top face disappear behind the upper block; hidden edges are left out.', () => {
        vis.forEach(s => k.seg(M(s.a[0], s.a[1], s.a[2]), M(s.b[0], s.b[1], s.b[2]), { cls: 'thick' }));
      });
    }
  });

  /* ================================================================== Pohlke: the scales of any three axes */
  Hyper.construction({
    id: 'ax-pohlke',
    title: 'Any three axes: finding the scales by rabatting two coordinate planes',
    tags: ['Pohlke', 'trace triangle', 'rabatment', 'scale', 'compass'],
    note: 'Pohlke\'s theorem says that any three segments drawn from one point can be taken for the picture of three equal, mutually perpendicular edges of a cube. For a *perpendicular* projection only the directions are free and the lengths follow from them — that is what is constructed here. The trace triangle ABC is found from the three axes (each side is perpendicular to the opposite axis); the right angle at the true corner O lies on the semicircle over AB, so turning the plane OAB flat about AB brings O to O₁ on the perpendicular from O′. A length on the axis is then foreshortened exactly as the perpendiculars to AB carry it from AO₁ to AO′ (an orthogonal affinity). Any other lengths on the three axes give an *oblique* picture of a cube — the cavalier and cabinet drawings are examples.',
    build(k) {
      k.fontScale(0.62);
      const O = k.pt(0, 0), thS = 20 * D2R, thT = 40 * D2R;
      const dS = g.dir(PI + thS), dT = g.dir(-thT), dY = k.pt(0, 1);       // rays towards the viewer: shallow down-left, steep down-right, vertical up
      const eS = g.mul(dS, -1), eT = g.mul(dT, -1);                         // the cube edges run the other way: up-right, up-left
      const A = g.mul(dS, 150);
      const C = g.lineLine(A, g.add(A, k.pt(1, 0)), O, g.add(O, dT));
      const B = g.lineLine(A, g.add(A, g.perp(dT)), O, g.add(O, dY));
      const u = 70;
      // rabatment about PQ: the corner O falls at O1 on the perpendicular from O′, at the height sqrt(PF · FQ) above the foot F
      const rabat = (P, Q) => {
        const F = g.foot(O, P, Q), n = g.unit(g.sub(O, F)), h = Math.sqrt(g.dist(P, F) * g.dist(F, Q));
        return { F, n, Oq: g.add(F, g.mul(n, h)), M: g.mid(P, Q) };
      };
      const r1 = rabat(A, B), r2 = rabat(B, C);
      // the true edge u marked from P along P–O1, carried by a perpendicular to the axis PQ onto P–O′
      const carry = (P, Oq, n) => {
        const U = g.along(P, Oq, u), U2 = g.lineLine(U, g.add(U, n), P, O);
        return { U, U2, len: g.dist(P, U2) };
      };
      const cA = carry(A, r1.Oq, r1.n), cB = carry(B, r1.Oq, r1.n), cC = carry(C, r2.Oq, r2.n);
      const sx = cA.len / u, sy = cB.len / u, sz = cC.len / u;
      const f3 = v => v.toFixed(3);
      const pS = g.add(O, g.mul(eS, cA.len)), pY = g.add(O, g.mul(dY, cB.len)), pT = g.add(O, g.mul(eT, cC.len));
      k.given('Three axes from one point O′: the edges x (shallow, to the right), y (vertical) and z (steep, to the left) of a cube, as drawn. Also given: the true length u of the cube edge (ticked).', () => {
        k.point(O, "O′", 'se');
        [eS, dY, eT].forEach(d => k.arrow(O, g.add(O, g.mul(d, 70)), { cls: 'given' }));
        k.label(g.add(O, g.mul(eS, 72)), 'x', 'e'); k.label(g.add(O, g.mul(dY, 72)), 'y', 'n'); k.label(g.add(O, g.mul(eT, 72)), 'z', 'w');
        const a = k.pt(-190, 150), b = k.pt(-190 + u, 150); k.seg(a, b); k.tick(a, k.pt(1, 0)); k.tick(b, k.pt(1, 0)); k.label(g.mid(a, b), 'u', 'n', { upright: true });
        k.frame(-215, -190, 330, 205);
      });
      k.step('straightedge', 'Extend the three axes into full lines through O′, backwards as well as forwards.', () => {
        k.line(O, g.add(O, dS), { cls: 'cons' }); k.line(O, g.add(O, dY), { cls: 'cons' }); k.line(O, g.add(O, dT), { cls: 'cons' });
      });
      k.step('tee', 'Pick A on the backward extension of x. The side AC of the trace triangle must be perpendicular to the y-axis, so draw it horizontally (T-square) to meet the extension of z at C.', () => {
        k.point(A, 'A', 'w'); k.seg(A, C, { cls: 'cons' }); k.point(C, 'C', 'se');
      });
      k.step('square', 'Through A draw the perpendicular to the z-axis (set square): it meets the y-axis at B.', () => {
        k.seg(A, B, { cls: 'cons' }); k.point(B, 'B', 'n');
      });
      k.step('straightedge', 'Join B to C. Check: BC is perpendicular to the x-axis, as the construction promises.', () => {
        k.seg(B, C, { cls: 'cons' }); k.right(g.foot(O, B, C), O, B, { r: 0.55 });
      });
      k.step('square', 'Rabat the plane xy about AB: from O′ draw the perpendicular to AB, meeting it at F.', () => {
        k.seg(r1.F, r1.Oq, { cls: 'cons' }); k.point(r1.F, 'F', 'sw'); k.right(r1.F, O, A, { r: 0.55 });
      });
      k.step('compass', 'Draw the semicircle on AB as diameter. It meets the perpendicular at O₁, the corner O turned flat into the sheet; AO₁ and BO₁ are the true lengths of the cube edges as seen from A and B (the right angle at O₁ is Thales\' angle).', () => {
        arcShort(k, r1.M, A, r1.Oq, { cls: 'curve' }); arcShort(k, r1.M, r1.Oq, B, { cls: 'curve' });
        k.point(r1.Oq, 'O_1', 'se');
        k.seg(A, r1.Oq, { cls: 'cons' }); k.seg(B, r1.Oq, { cls: 'cons' });
      });
      k.step('dividers', 'Mark the true edge u from A along AO₁ (the point U) and from B along BO₁ (V).', () => {
        k.point(cA.U, 'U', 'nw'); k.point(cB.U, 'V', 'ne');
      });
      k.step('square', 'Through U and V draw perpendiculars to AB. They cut AO′ at U′ and BO′ at V′: the orthogonal affinity about AB carries a length on AO₁ to its foreshortened length on AO′.', () => {
        k.seg(cA.U, cA.U2, { cls: 'cons' }); k.seg(cB.U, cB.U2, { cls: 'cons' });
        k.point(cA.U2, 'U′', 'sw'); k.point(cB.U2, 'V′', 'ne');
      });
      k.step('dividers', 'Carry AU′ to the x-axis and BV′ to the y-axis, from O′: the foreshortened cube edges, ' + f3(sx) + ' u and ' + f3(sy) + ' u.', () => {
        k.dot(pS, { r: 1 }); k.dot(pY, { r: 1 }); k.label(pS, 'x_1', 'se', { dist: 0.8 }); k.label(pY, 'y_1', 'e', { dist: 0.8 });
      });
      k.step('square', 'Now the z-axis, with the plane yz: the perpendicular from O′ to BC (foot G), the semicircle on BC giving O₂, the edge u marked from C along CO₂ (W) and carried by a perpendicular to BC onto CO′ (W′).', () => {
        k.seg(r2.F, r2.Oq, { cls: 'cons' }); k.point(r2.F, 'G', 'nw');
        arcShort(k, r2.M, B, r2.Oq, { cls: 'curve' }); arcShort(k, r2.M, r2.Oq, C, { cls: 'curve' });
        k.point(r2.Oq, 'O_2', 'e'); k.seg(C, r2.Oq, { cls: 'cons' }); k.seg(B, r2.Oq, { cls: 'cons' });
        k.point(cC.U, 'W', 'e'); k.seg(cC.U, cC.U2, { cls: 'cons' }); k.point(cC.U2, 'W′', 'sw');
      });
      k.step('dividers', 'Carry CW′ to the z-axis from O′: z₁, ' + f3(sz) + ' u. The three scales ' + f3(sx) + ' : ' + f3(sy) + ' : ' + f3(sz) + ' obey ' + f3(sx) + '² + ' + f3(sy) + '² + ' + f3(sz) + '² = ' + f3(sx * sx + sy * sy + sz * sz) + ', as every perpendicular projection must (the sum is 2).', () => {
        k.dot(pT, { r: 1 }); k.label(pT, 'z_1', 'w', { dist: 0.8 });
      });
      /* the cube on its own */
      const O2 = k.pt(235, -40), ey2 = k.pt(0, sy * u);
      const exs = g.mul(eS, sx * u), ezs = g.mul(eT, sz * u);
      const Xc = g.add(O2, exs), Zc = g.add(O2, ezs), Yc = g.add(O2, ey2);
      const XY2 = g.add(Xc, ey2), ZY2 = g.add(Zc, ey2), T2 = g.add(XY2, ezs);
      k.step('square', 'Draw the cube on these three edges: from a new corner O lay off x₁, y₁ and z₁ and complete the parallels.', () => {
        k.point(O2, 'O', 's');
        k.seg(O2, Xc, { cls: 'cons' }); k.seg(O2, Zc, { cls: 'cons' }); k.seg(O2, Yc, { cls: 'cons' });
        k.seg(Xc, XY2, { cls: 'cons' }); k.seg(Zc, ZY2, { cls: 'cons' }); k.seg(Yc, XY2, { cls: 'cons' }); k.seg(Yc, ZY2, { cls: 'cons' }); k.seg(XY2, T2, { cls: 'cons' }); k.seg(ZY2, T2, { cls: 'cons' });
      });
      k.step('pencil', 'Line in the cube. It is the picture, by perpendicular projectors, of a true cube of edge u — the construction proves it.', () => {
        [[O2, Xc], [O2, Zc], [O2, Yc], [Xc, XY2], [Zc, ZY2], [Yc, XY2], [Yc, ZY2], [XY2, T2], [ZY2, T2]].forEach(([p, q]) => k.seg(p, q, { cls: 'thick' }));
      });
      k.note('Pohlke goes further: three segments of any lengths in these directions — the dashed ones, for example — are also the picture of a cube. Then the projectors are inclined to the picture plane (an oblique projection) and the cube is seen from the side.', () => {
        const odd = [1.3, 0.55, 0.9];
        const e1 = g.mul(eS, sx * u * odd[0]), e2 = g.mul(dY, sy * u * odd[1]), e3 = g.mul(eT, sz * u * odd[2]);
        const P0 = k.pt(235, 110);
        const E = [e1, e2, e3];
        E.forEach(e => k.seg(P0, g.add(P0, e), { cls: 'aux', dash: true }));
        [[0, 1], [0, 2], [1, 2]].forEach(([i, j]) => {
          const a = g.add(P0, E[i]), b = g.add(P0, E[j]), ab = g.add(a, E[j]), l = 3 - i - j;
          k.seg(a, ab, { cls: 'aux', dash: true }); k.seg(b, ab, { cls: 'aux', dash: true }); k.seg(ab, g.add(ab, E[l]), { cls: 'aux', dash: true });
        });
      });
    }
  });


  /* ================================================================== exploded isometric */
  Hyper.construction({
    id: 'ax-exploded',
    title: 'An exploded isometric of a three-part assembly',
    tags: ['exploded view', 'isometric', 'centre line', 'compass'],
    note: 'The parts are pulled apart along the line they are assembled on, in the order they go together, and the assembly line is drawn dash-dot through all of them. The gaps must be large enough that the outlines do not run into each other: for coaxial discs of radii r₁ and r₂ the gap between the face centres has to exceed (r₁ + r₂)/√2, because each rim ellipse reaches r/√2 above and below its face. Here: a base plate with a bore, a bush, and a pin that goes through both.',
    build(k) {
      const ux = k.pt(C30, 0.5), uz = k.pt(-C30, 0.5), I = isoMap(k.pt(0, 0), 1);
      const pl = { a: 45, t: 14, bore: 14 }, bu = { r: 28, y0: 75, h: 26, bore: 14 }, pn = { r: 13, y0: 140, h: 70 };
      const ctr = (y) => k.pt(0, y);
      k.given('The assembly line, a vertical dash-dot line, and the stations on it: the top of the plate (0), the underside of the bush (75), the top of the bush (101), the underside of the pin (140) and its top (210). Plate 90 × 90 × 14 with a bore Ø28; bush Ø56 × 26 with the same bore; pin Ø26 × 70.', () => {
        k.line(ctr(-80), ctr(240), { cls: 'cons', dash: '9 3 2 3' });
        [[0, 'plate top  0'], [75, 'bush bottom  75'], [101, 'bush top  101'], [140, 'pin bottom  140'], [210, 'pin top  210']].forEach(([y, lab]) => {
          k.dot(ctr(y), { r: 0.8 }); k.seg(k.pt(-6, y), k.pt(6, y), { cls: 'cons' });
          k.text(-92, y, lab, { anchor: 'end', upright: true, size: 0.72 });
        });
        k.frame(-190, -90, 140, 250);
      });
      /* the plate */
      const a = pl.a, t = pl.t;
      const P_ = (x, y, z) => I(x, y, z);
      const tn = P_(-a, 0, -a), tx = P_(a, 0, -a), tf = P_(a, 0, a), tz = P_(-a, 0, a), bn = P_(-a, -t, -a), bx = P_(a, -t, -a), bz = P_(-a, -t, a);
      k.step('square', 'The plate: with the 30° set square draw the top rhombus about the centre (half-side 45 along both axes) …', () => {
        k.poly([tn, tx, tf, tz], { close: true, cls: 'cons' });
      });
      k.step('dividers', '… and drop the thickness 14 from the three near corners.', () => {
        k.point(bn, '', 's'); k.point(bx, '', 'e'); k.point(bz, '', 'w');
      });
      const fcP = fourCentre(ctr(0), pl.bore, ux, uz), lowerP = shiftPts(fcP.pts(30), 0, -t), topP = fcP.pts(30);
      k.step('pencil', 'Line in the plate: the top rhombus, three verticals and the two near bottom edges.', () => {
        [[tn, tx], [tx, tf], [tf, tz], [tz, tn], [tn, bn], [tx, bx], [tz, bz], [bn, bx], [bn, bz]].forEach(([p, q]) => k.seg(p, q, { cls: 'thick' }));
      });
      k.step('compass', 'The bore Ø28: the four-centre ellipse about the centre of the plate (radius 14 on the centre lines, as in the isometric circle), and the part of its lower rim that shows through the hole.', () => {
        fcP.arcs.forEach(a2 => arcShort(k, a2.c, a2.p, a2.q, { cls: 'thick' }));
        runsInside(lowerP, topP).forEach(r => k.curve(r, null, { cls: 'thick' }));
      });
      /* a cylinder helper: top ellipse, lower half, two sides */
      const cyl = (y0, h, r, bore) => {
        const top = fourCentre(ctr(y0 + h), r, ux, uz), bot = fourCentre(ctr(y0), r, ux, uz);
        const smalls = top.arcs.filter(x => !x.big), rs = g.dist(smalls[0].c, smalls[0].p);
        const left = smalls.reduce((p, q) => (p.c.x < q.c.x ? p : q)), right = smalls.reduce((p, q) => (p.c.x > q.c.x ? p : q));
        const eL = g.add(left.c, k.pt(-rs, 0)), eR = g.add(right.c, k.pt(rs, 0)), sh = p => g.sub(p, k.pt(0, h));
        const lowerArcs = () => bot.arcs.forEach(x => {
          if (x.big) { if (x.c.y > ctr(y0).y) arcShort(k, x.c, x.p, x.q, { cls: 'thick' }); }
          else { const side = x.c.x < ctr(y0).x ? -1 : 1, ext = g.add(x.c, k.pt(side * rs, 0)); arcShort(k, x.c, x.p.y < x.q.y ? x.p : x.q, ext, { cls: 'thick' }); }
        });
        return { top, bot, eL, eR, sh, lowerArcs, rs };
      };
      const bush = cyl(bu.y0, bu.h, bu.r), pin = cyl(pn.y0, pn.h, pn.r);
      k.step('compass', 'The bush: the top ellipse of the outer circle (radius 28) and of the bore (radius 14) about the station 101, and the lower half of the outer rim about the station 75.', () => {
        bush.top.arcs.forEach(x => arcShort(k, x.c, x.p, x.q, { cls: 'thick' }));
        fourCentre(ctr(bu.y0 + bu.h), bu.bore, ux, uz).arcs.forEach(x => arcShort(k, x.c, x.p, x.q, { cls: 'thick' }));
        bush.lowerArcs();
      });
      k.step('tee', 'Join the two ellipses with the vertical sides, through their leftmost and rightmost points.', () => {
        k.seg(bush.eL, g.sub(bush.eL, k.pt(0, bu.h)), { cls: 'thick' }); k.seg(bush.eR, g.sub(bush.eR, k.pt(0, bu.h)), { cls: 'thick' });
      });
      k.step('compass', 'The pin: the top ellipse (radius 13) about the station 210 and the lower half of the rim about the station 140.', () => {
        pin.top.arcs.forEach(x => arcShort(k, x.c, x.p, x.q, { cls: 'thick' })); pin.lowerArcs();
      });
      k.step('tee', 'The sides of the pin, again through the extreme points of the ellipse.', () => {
        k.seg(pin.eL, g.sub(pin.eL, k.pt(0, pn.h)), { cls: 'thick' }); k.seg(pin.eR, g.sub(pin.eR, k.pt(0, pn.h)), { cls: 'thick' });
      });
      k.step('straightedge', 'Draw the assembly line (dash-dot) in the gaps between the parts, and a short way beyond the pin.', () => {
        [[ctr(2), ctr(75 - 20)], [ctr(101 + 21), ctr(140 - 9)], [ctr(210 + 11), ctr(228)]].forEach(([p, q]) => k.seg(p, q, { cls: 'cons', dash: '9 3 2 3' }));
      });
      k.note('Gaps: 75 − 0 between plate and bush, 140 − 101 = 39 between bush and pin. Both exceed (r₁ + r₂)/√2: for the plate and bush the larger half-diagonal of the plate rhombus (45) plus the bush rim (19.8) gives 65 < 75; for the bush and pin, (28 + 13)/√2 = 29 < 39.', () => {
        [[0, 75, '75'], [101, 140, '39']].forEach(([y0, y1, lab]) => {
          k.seg(k.pt(96, y0), k.pt(96, y1), { cls: 'cons', arrow: 'both' });
          k.seg(k.pt(0, y0), k.pt(100, y0), { cls: 'aux', dash: true }); k.seg(k.pt(0, y1), k.pt(100, y1), { cls: 'aux', dash: true });
          k.text(100, (y0 + y1) / 2, lab, { anchor: 'start', upright: true, size: 0.8 });
        });
      });
    }
  });
})();
