/* HYPER-PROJECTIONS · constructions/oblique-projections.js
 *
 *   ob-arch-block      an oblique drawing of an arched block with a round hole: front face true, depth at 30° and ratio 0.6
 *   ob-cavalier-box    a cavalier cube (45°, depth true length) with a boss: the circle on the front face is a true circle
 *   ob-cabinet-box     a cabinet cube (45°, depth halved) with a circle on the front and the ellipse on the top by eight points
 *   ob-oblique-circle  the ellipse of a circle in a face that contains the depth axis: the twelve-point parallelogram method
 *   ob-planometric     a floor plan turned 45° with the walls raised vertically (military projection)
 *   ob-handscroll      a courtyard and pavilion in the parallel (oblique) perspective of a Chinese handscroll
 *   ob-pixel-grid      the 2 : 1 pixel grid of games against true isometric: a diamond tile and a cube on the pixel lattice
 * Every point is computed (k.g), never guessed; hidden lines are removed by a small sampled hidden-line routine.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI;
  const g = Hyper.construct.g;

  /* ------------------------------------------------------------------ helpers */
  const ccw = (c, p, q) => (g.cross(g.sub(p, c), g.sub(q, c)) >= 0 ? [p, q] : [q, p]);
  function arcShort(k, c, p, q, o) { const pq = ccw(c, p, q); return k.arc3(c, pq[0], pq[1], o); }
  /* the arc about c from p to q (either way) that passes through `via` */
  function arcVia(k, c, p, q, via, o) {
    const nrm = x => ((x % TAU) + TAU) % TAU;
    const a0 = g.angleOf(g.sub(p, c)), a1 = g.angleOf(g.sub(q, c)), am = g.angleOf(g.sub(via, c)), r = g.dist(c, p);
    return nrm(am - a0) <= nrm(a1 - a0) ? k.arc(c, r, a0, a1, o) : k.arc(c, r, a1, a0, o);
  }
  const dotAt = (k, p, o) => k.dot(p, o);

  /* hidden lines for solids made of planar faces under a parallel projection (see the axonometric file) */
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
  /* a prism on a polygon [[x, z], …] between the heights y0 and y1: faces and real edges, object coordinates [x, y, z] */
  function prism(poly, y0, y1) {
    const faces = [{ pts: poly.map(p => [p[0], y1, p[1]]) }, { pts: poly.map(p => [p[0], y0, p[1]]) }], edges = [], n = poly.length;
    for (let i = 0; i < n; i++) {
      const a = poly[i], b = poly[(i + 1) % n];
      faces.push({ pts: [[a[0], y0, a[1]], [b[0], y0, b[1]], [b[0], y1, b[1]], [a[0], y1, a[1]]] });
      edges.push([[a[0], y1, a[1]], [b[0], y1, b[1]]], [[a[0], y0, a[1]], [b[0], y0, b[1]]], [[a[0], y0, a[1]], [a[0], y1, a[1]]]);
    }
    return { faces, edges };
  }

  /* ================================================================== the arched block */
  Hyper.construction({
    id: 'ob-arch-block',
    title: 'An oblique drawing of an arched block with a round hole',
    tags: ['oblique', 'set square', 'compass', 'tangent'],
    note: 'The front face is drawn exactly as the front view — the arch and the hole are true circles, drawn with the compass. Only the depth is oblique: every receding edge runs at 30° and is drawn at 0.6 of its true length (depth 60 becomes 36). The back arch is the same arc moved by the receding vector; the outline of the arched top is the tangent to the front and back arcs, parallel to the receding direction. A smooth joint (where the vertical side runs into the arch) is not drawn as a line.',
    build(k) {
      const Wd = 100, Hs = 50, R = 50, rh = 20, dep = 60, a = 30 * D2R, rr = 0.6;
      const v = g.mul(g.dir(a), rr * dep), Cc = k.pt(0, Hs), Cb = g.add(Cc, v);
      const BL = k.pt(-50, 0), BR = k.pt(50, 0), TL = k.pt(-50, Hs), TR = k.pt(50, Hs);
      const P120 = g.polar(Cc, R, a + PI / 2), BLb = g.add(BL, v), BRb = g.add(BR, v), TLb = g.add(TL, v), TRb = g.add(TR, v), P120b = g.add(P120, v);
      const II = g.circleCircle(Cc, rh, Cb, rh), viaPt = g.sub(Cb, g.mul(g.unit(v), rh));
      k.given('The front view (true shape): a block 100 wide, 50 high with a semicircular top of radius 50 and a round hole of radius 20 at the centre of the arch. The depth is 60, drawn at the angle 30° and the ratio 0.6.', () => {
        const a0 = k.pt(-50, -22), a1 = k.pt(50, -22), b0 = k.pt(-50, -44), b1 = g.add(b0, g.mul(g.dir(a), dep)), b2 = g.add(b0, g.mul(g.dir(a), dep * rr));
        k.seg(a0, a1); k.tick(a0, k.pt(1, 0)); k.tick(a1, k.pt(1, 0)); k.label(g.mid(a0, a1), '100', 'n', { upright: true, size: 0.8 });
        k.seg(b0, b1, { cls: 'given' }); k.tick(b0, g.dir(a)); k.tick(b1, g.dir(a)); k.label(b1, 'true depth 60', 'e', { upright: true, size: 0.8 });
        k.seg(g.add(b0, k.pt(0, -14)), g.add(b2, k.pt(0, -14)), { cls: 'given' }); k.tick(g.add(b0, k.pt(0, -14)), g.dir(a)); k.tick(g.add(b2, k.pt(0, -14)), g.dir(a)); k.label(g.add(b2, k.pt(0, -14)), 'drawn depth 36', 'e', { upright: true, size: 0.8 });
        k.frame(-70, -75, 160, 125);
      });
      k.step('tee', 'Base line and the two vertical sides of the front face (T-square and set square).', () => {
        k.seg(BL, BR, { cls: 'cons' }); k.seg(BL, TL, { cls: 'cons' }); k.seg(BR, TR, { cls: 'cons' });
        k.point(BL, '', 'sw'); k.point(BR, '', 'se');
      });
      k.step('compass', 'The arch: a semicircle of radius 50 about the centre C of the top edge; and the hole, a circle of radius 20 about the same centre.', () => {
        k.point(Cc, 'C', 'sw'); k.arc(Cc, R, 0, PI, { cls: 'cons' }); k.circle(Cc, rh, { cls: 'cons' });
      });
      k.step('square', 'With the 30° set square draw the receding lines: from the lower and upper right-hand corners, and from the point P where the tangent to the arch is parallel to the receding direction (120° on the circle: the radius to P is perpendicular to the 30° line).', () => {
        k.point(P120, 'P', 'nw');
        [BR, TR, P120].forEach(p => k.seg(p, g.add(p, g.mul(v, 1.35)), { cls: 'cons' }));
      });
      k.step('dividers', 'On each of the three lines lay off the drawn depth 36 (0.6 × 60), and from C too: the back corners and the back centre C′.', () => {
        [BRb, TRb, P120b].forEach(p => k.dot(p)); k.point(Cb, 'C′', 'se');
      });
      k.step('compass', 'The back arch: the same radius, about C′, from the horizontal to the point of tangency P′. Only this part can be seen.', () => {
        k.arc(Cb, R, 0, a + PI / 2, { cls: 'cons' });
      });
      k.step('straightedge', 'Join P to P′ (the outline of the arched top) and complete the right-hand side: the back vertical edge and the bottom edge.', () => {
        k.seg(P120, P120b, { cls: 'cons' }); k.seg(BRb, TRb, { cls: 'cons' }); k.seg(BR, BRb, { cls: 'cons' });
      });
      k.step('compass', 'The hole goes through the block: its back rim is the same circle about C′. Only the arc that falls inside the front circle can be seen, the part nearest C.', () => {
        k.circle(Cb, rh, { cls: 'aux', dash: true });
        k.point(II[0], '', 'n'); k.point(II[1], '', 's');
      });
      k.step('pencil', 'Line in the visible outline: the front face with its arch and hole, the right-hand face, the back arch up to P′, the tangent PP′ and the crescent of the hole.', () => {
        [[BL, BR], [BL, TL], [BR, TR], [BR, BRb], [BRb, TRb], [P120, P120b]].forEach(([p, q]) => k.seg(p, q, { cls: 'thick' }));
        k.arc(Cc, R, 0, PI, { cls: 'thick' }); k.circle(Cc, rh, { cls: 'thick' });
        k.arc(Cb, R, 0, a + PI / 2, { cls: 'thick' });
        arcVia(k, Cb, II[0], II[1], viaPt, { cls: 'thick' });
      });
      k.note('Hidden edges (dashed) are left out of the finished drawing: the left-hand side, the bottom edge and the rest of the back arch.', () => {
        [[BL, BLb], [BLb, BRb], [BLb, TLb], [BL, BR]].forEach(([p, q], i) => { if (i < 3) k.seg(p, q, { cls: 'aux', dash: true }); });
        k.arc(Cb, R, a + PI / 2, PI, { cls: 'aux', dash: true });
      });
    }
  });

  /* ================================================================== cavalier box with a boss */
  Hyper.construction({
    id: 'ob-cavalier-box',
    title: 'A cavalier cube with a round boss',
    tags: ['cavalier', 'oblique', '45° set square', 'compass'],
    note: 'Cavalier projection: the front face is true and the depth is drawn at its true length along a 45° line. A circle in the front face is drawn with the compass; a cylinder whose axis points at the viewer is two equal circles one receding-vector apart, joined by the two tangents parallel to the receding direction. Notice how deep the cube looks: the back face is as far behind the front face as it is wide, which is why the cabinet drawing halves the depth.',
    build(k) {
      const a = 80, ang = 45 * D2R, rb = 22, tt = 24;
      const e = g.dir(ang), v = g.mul(e, a);
      const O = k.pt(0, 0), BR = k.pt(a, 0), TR = k.pt(a, a), TL = k.pt(0, a), C0 = k.pt(a / 2, a / 2), C1 = g.sub(C0, g.mul(e, tt));
      const B1 = g.add(BR, v), B2 = g.add(TR, v), B3 = g.add(TL, v);
      k.given('The edge a = 80 (ticked, to be taken with the dividers); the receding direction 45°, depth drawn at full length. A boss of radius 22 stands 24 out of the front face at its centre.', () => {
        const p = k.pt(-20, -30), q = k.pt(60, -30); k.seg(p, q); k.tick(p, k.pt(1, 0)); k.tick(q, k.pt(1, 0)); k.label(g.mid(p, q), 'a = 80', 'n', { upright: true, size: 0.8 });
        k.point(O, 'O', 'sw'); k.frame(-40, -50, 190, 180);
      });
      k.step('tee', 'The front face: base, verticals and top with the T-square and set square — a true square of side a.', () => {
        k.seg(O, BR, { cls: 'cons' }); k.seg(BR, TR, { cls: 'cons' }); k.seg(TR, TL, { cls: 'cons' }); k.seg(TL, O, { cls: 'cons' });
      });
      k.step('straightedge', 'The diagonals cross at the centre C of the face.', () => {
        k.seg(O, TR, { cls: 'cons' }); k.seg(BR, TL, { cls: 'cons' }); k.point(C0, 'C', 'sw');
      });
      k.step('compass', 'With centre C and radius 22 draw the base circle of the boss: a true circle on the front face.', () => {
        k.circle(C0, rb, { cls: 'cons' });
      });
      k.step('square', 'With the 45° set square draw the receding lines from the three corners that show: lower right, upper right, upper left.', () => {
        [BR, TR, TL].forEach(p => k.seg(p, g.add(p, g.mul(v, 1.15)), { cls: 'cons' }));
      });
      k.step('dividers', 'Cavalier: the full edge a is laid off along each receding line.', () => {
        [B1, B2, B3].forEach(p => k.dot(p));
      });
      k.step('tee', 'Complete the back face: the top edge parallel to the front top edge, the right edge vertical.', () => {
        k.seg(B2, B3, { cls: 'cons' }); k.seg(B1, B2, { cls: 'cons' });
      });
      k.step('pencil', 'Line in the nine visible edges of the cube.', () => {
        [[O, BR], [O, TL], [BR, TR], [TL, TR], [BR, B1], [TR, B2], [TL, B3], [B1, B2], [B3, B2]].forEach(([p, q]) => k.seg(p, q, { cls: 'thick' }));
      });
      k.step('dividers', 'The boss comes towards the viewer, so its end is displaced the other way, down and to the left: carry 24 along the 45° line from C to C′.', () => {
        k.point(C1, 'C′', 'sw'); k.seg(C0, C1, { cls: 'cons' });
      });
      k.step('compass', 'The end of the boss is a circle of the same radius about C′ — again a true circle.', () => {
        k.circle(C1, rb, { cls: 'cons' });
      });
      const tA = g.polar(C1, rb, ang + PI / 2), tB = g.polar(C1, rb, ang - PI / 2), uA = g.polar(C0, rb, ang + PI / 2), uB = g.polar(C0, rb, ang - PI / 2);
      k.step('square', 'The sides of the boss are tangent to both circles and run in the receding direction: with the 45° set square, draw the tangents at the points where the radius is perpendicular to 45°.', () => {
        k.seg(tA, uA, { cls: 'cons' }); k.seg(tB, uB, { cls: 'cons' });
      });
      k.step('pencil', 'Line in the boss: the end circle, the two tangents and the half of the base circle that is not hidden by the boss.', () => {
        k.circle(C1, rb, { cls: 'thick' }); k.seg(tA, uA, { cls: 'thick' }); k.seg(tB, uB, { cls: 'thick' });
        k.arc(C0, rb, ang - PI / 2, ang + PI / 2, { cls: 'thick' });
      });
    }
  });

  /* ================================================================== cabinet box, ellipse by eight points */
  Hyper.construction({
    id: 'ob-cabinet-box',
    title: 'A cabinet cube with a circle on the front and an ellipse on the top',
    tags: ['cabinet', 'oblique', 'ellipse', 'eight points', 'dividers'],
    note: 'Cabinet projection: the front face is true and the depth is halved. The circle on the front face is a true circle; the same circle on the top face is an ellipse, found by the parallelogram method. The eight points of the front circle give the distances 0, 11.7, 40, 68.3 and 80 along the top edge (the circle meets the diagonals at 0.1464 and 0.8536 of the side); the receding edge carries the same distances at half scale, by parallels to the line joining the far ends. A grid through these marks cuts the ellipse in its eight points.',
    build(k) {
      const a = 80, ang = 45 * D2R, rr = 0.5, R = 40;
      const e = g.dir(ang), v = g.mul(e, a * rr);
      const O = k.pt(0, 0), BR = k.pt(a, 0), TR = k.pt(a, a), TL = k.pt(0, a), C0 = k.pt(40, 40);
      const B1 = g.add(BR, v), B2 = g.add(TR, v), B3 = g.add(TL, v);
      const t = Math.SQRT1_2;
      const xs = [0, 40 - 40 * t, 40, 40 + 40 * t, 80];                       // abscissas on the top edge
      const onTop = x => k.pt(x, a), onEdge = x => g.add(TL, g.mul(v, x / a));
      const Cf = g.add(g.add(TL, k.pt(40, 0)), g.mul(v, 0.5));                // centre of the top face
      const ell = th => [Cf.x + R * Math.cos(th) + R * rr * Math.cos(ang) * Math.sin(th), Cf.y + R * rr * Math.sin(ang) * Math.sin(th)];
      // the eight points: (x, d) with x from the left, d from the front edge, both measured in the true square
      const pairs = [[80, 40], [68.3, 11.7], [40, 0], [11.7, 11.7], [0, 40], [11.7, 68.3], [40, 80], [68.3, 68.3]].map(([x, d]) => [40 + (x - 40), d]);
      const gridPt = (x, d) => g.add(g.add(TL, k.pt(x, 0)), g.mul(v, d / a));
      k.given('The edge a = 80 (ticked), the receding direction 45° and the ratio ½. The circle is inscribed in the front face, diameter 80.', () => {
        const p = k.pt(-20, -30), q = k.pt(60, -30); k.seg(p, q); k.tick(p, k.pt(1, 0)); k.tick(q, k.pt(1, 0)); k.label(g.mid(p, q), 'a = 80', 'n', { upright: true, size: 0.8 });
        k.point(O, 'O', 'sw'); k.frame(-40, -50, 150, 150);
      });
      k.step('tee', 'The front face, a true square of side a.', () => {
        k.seg(O, BR, { cls: 'cons' }); k.seg(BR, TR, { cls: 'cons' }); k.seg(TR, TL, { cls: 'cons' }); k.seg(TL, O, { cls: 'cons' });
      });
      k.step('straightedge', 'The diagonals cross at the centre C of the face.', () => {
        k.seg(O, TR, { cls: 'cons' }); k.seg(BR, TL, { cls: 'cons' }); k.point(C0, 'C', 'sw');
      });
      k.step('compass', 'The circle about C with radius a/2: it touches the four sides and cuts the diagonals in four more points — eight points in all.', () => {
        k.circle(C0, R, { cls: 'curve' });
        [[40, 0], [80, 40], [40, 80], [0, 40]].forEach(([x, y]) => k.dot(k.pt(x, y), { r: 0.7 }));
        [[40 - 40 * t, 40 - 40 * t], [40 + 40 * t, 40 - 40 * t], [40 + 40 * t, 40 + 40 * t], [40 - 40 * t, 40 + 40 * t]].forEach(([x, y]) => k.dot(k.pt(x, y), { r: 0.7 }));
      });
      k.step('square', 'The cabinet cube: 45° lines from the three corners, half the edge (40) laid off on each, the back face completed. The top face is a parallelogram.', () => {
        [BR, TR, TL].forEach(p => k.seg(p, g.add(p, v), { cls: 'cons' }));
        k.seg(B3, B2, { cls: 'cons' }); k.seg(B1, B2, { cls: 'cons' });
      });
      k.step('pencil', 'Line in the nine visible edges.', () => {
        [[O, BR], [O, TL], [BR, TR], [TL, TR], [BR, B1], [TR, B2], [TL, B3], [B1, B2], [B3, B2]].forEach(([p, q]) => k.seg(p, q, { cls: 'thick' }));
      });
      k.step('tee', 'Raise verticals from the eight points of the front circle to the top edge: they cut it at 0, 11.7, 40, 68.3 and 80 from the left corner.', () => {
        const ys = { 0: 40, 11.7: 11.7, 40: 0, 68.3: 11.7, 80: 40 };
        xs.forEach(x => { const key = Object.keys(ys).find(kk => Math.abs(+kk - x) < 0.5); k.seg(k.pt(x, ys[key]), onTop(x), { cls: 'cons' }); k.dot(onTop(x), { r: 0.7 }); });
      });
      k.step('square', 'Carry the same five marks to the receding edge at half scale: through each mark draw a parallel to the line from the right end of the top edge to the far end of the receding edge.', () => {
        k.seg(TR, B3, { cls: 'cons', dash: true });
        xs.forEach(x => { k.seg(onTop(x), onEdge(x), { cls: 'cons' }); k.dot(onEdge(x), { r: 0.7 }); });
      });
      k.step('square', 'Through the marks on the top edge draw lines in the receding direction (45° set square); through the marks on the receding edge draw horizontals (T-square).', () => {
        xs.forEach(x => k.seg(onTop(x), g.add(onTop(x), v), { cls: 'cons' }));
        xs.forEach(x => k.seg(onEdge(x), g.add(onEdge(x), k.pt(a, 0)), { cls: 'cons' }));
      });
      k.step('dividers', 'The eight points of the ellipse are where the matching lines cross. Mark them.', () => {
        pairs.forEach(([x, d]) => k.dot(gridPt(x, d), { r: 0.9 }));
      });
      k.step('pencil', 'Draw the ellipse through the eight points, touching the four sides of the parallelogram at their midpoints.', () => {
        k.curve(ell, [0, TAU], { cls: 'thick', n: 200 });
      });
    }
  });

  /* ================================================================== the oblique circle by twelve points */
  Hyper.construction({
    id: 'ob-oblique-circle',
    title: 'The circle in a face that contains the depth axis: twelve points',
    tags: ['oblique', 'ellipse', 'parallelogram', 'dividers'],
    note: 'In an oblique drawing a circle lying in a plane that contains the depth axis becomes an ellipse inscribed in the parallelogram that is the picture of its square. Its two half-sides are *conjugate* semi-diameters, but not the axes. The method is the one every draughtsman uses: take the abscissas and ordinates of points of the true circle, carry them to the two sides of the parallelogram (the ordinates scaled by the ratio r; here r = 1, cavalier at 45°) and draw the parallels. For cavalier 45° the ellipse has semi-axes 1.307 R and 0.541 R, and the major axis lies 22.5° above the horizontal.',
    build(k) {
      const R = 40, ang = 45 * D2R, rr = 1;
      const Q0 = k.pt(30, -40), ex = k.pt(1, 0), er = g.dir(ang);
      const Cc = g.add(g.add(Q0, k.pt(R, 0)), g.mul(er, R * rr));
      const Cs = k.pt(-110, 0);                                        // centre of the true circle and its square
      const pt3 = (u, w) => g.add(g.add(Cc, g.mul(ex, u)), g.mul(er, w * rr));
      const ts = []; for (let i = 0; i < 12; i++) ts.push(i * 30 * D2R);
      const us = [R, R * Math.cos(30 * D2R), R * 0.5, 0, -R * 0.5, -R * Math.cos(30 * D2R), -R], ws = us.slice();
      const Q1 = g.add(Q0, k.pt(2 * R, 0)), Q3 = g.add(Q0, g.mul(er, 2 * R * rr)), Q2 = g.add(Q1, g.mul(er, 2 * R * rr));
      const base = u => g.add(Q0, k.pt(R + u, 0)), edge = w => g.add(Q0, g.mul(er, (R + w) * rr));
      const S0 = g.sub(Cs, k.pt(R, R));
      k.given('The true circle (radius R = 40) in its square, left, with its twelve points at 30° steps; the parallelogram that is the picture of the square at cavalier 45° (ratio r = 1), right.', () => {
        k.rect(S0.x, S0.y, S0.x + 2 * R, S0.y + 2 * R, { cls: 'given' }); k.circle(Cs, R, { cls: 'given' });
        ts.forEach(t => k.dot(g.polar(Cs, R, t), { r: 0.8 }));
        k.poly([Q0, Q1, Q2, Q3], { close: true, cls: 'given' });
        k.point(Q0, 'Q_0', 'sw'); k.point(Q1, 'Q_1', 'se'); k.point(Q3, 'Q_3', 'nw');
        k.frame(-170, -70, 190, 120);
      });
      k.step('tee', 'Drop verticals from the points of the circle to the base of its square: seven marks at distances ±R, ±R cos 30°, ±R/2 and 0 from the middle.', () => {
        ts.forEach(t => { const p = g.polar(Cs, R, t); k.seg(p, k.pt(p.x, S0.y), { cls: 'cons' }); });
        us.forEach(u => k.dot(k.pt(Cs.x + u, S0.y), { r: 0.7 }));
      });
      k.step('dividers', 'Carry the seven marks to the base of the parallelogram, measured from its midpoint.', () => {
        us.forEach(u => k.dot(base(u), { r: 0.8 }));
      });
      k.step('tee', 'Run horizontals from the points of the circle to the left side of its square: seven heights.', () => {
        ts.forEach(t => { const p = g.polar(Cs, R, t); k.seg(p, k.pt(S0.x, p.y), { cls: 'cons' }); });
        ws.forEach(w => k.dot(k.pt(S0.x, Cs.y + w), { r: 0.7 }));
      });
      k.step('dividers', 'Carry the heights to the receding side Q₀Q₃, from its midpoint, at the ratio r (here r = 1: the same lengths).', () => {
        ws.forEach(w => k.dot(edge(w), { r: 0.8 }));
      });
      k.step('square', 'Through each mark on the base draw a line parallel to the receding side (45° set square); through each mark on the receding side a parallel to the base (T-square).', () => {
        us.forEach(u => k.seg(base(u), g.add(base(u), g.mul(er, 2 * R * rr)), { cls: 'cons' }));
        ws.forEach(w => k.seg(edge(w), g.add(edge(w), k.pt(2 * R, 0)), { cls: 'cons' }));
      });
      k.step('dividers', 'The twelve points of the ellipse are where the parallels belonging to the same point of the circle cross.', () => {
        ts.forEach(t => k.dot(pt3(R * Math.cos(t), R * Math.sin(t)), { r: 1 }));
      });
      k.step('pencil', 'Draw the ellipse through the twelve points with a French curve, touching the four sides of the parallelogram at their midpoints.', () => {
        k.curve(t => { const p = pt3(R * Math.cos(t), R * Math.sin(t)); return [p.x, p.y]; }, [0, TAU], { cls: 'thick', n: 240 });
      });
      /* the axes by Rytz's construction */
      const Aend = pt3(R, 0), Bend = pt3(0, R), Ap = g.add(Cc, g.perp(g.sub(Aend, Cc))), Mm = g.mid(Ap, Bend), rM = g.dist(Mm, Cc);
      const PQ = g.lineCircle(Ap, Bend, Mm, rM), Pp = PQ[0], Qq = PQ[1];
      const bp = g.dist(Bend, Pp), bq = g.dist(Bend, Qq), dP = g.unit(g.sub(Pp, Cc)), dQ = g.unit(g.sub(Qq, Cc));
      k.step('square', 'The axes by Rytz\'s construction. The half-sides CA and CB are conjugate semi-diameters. At C draw the perpendicular to CA and make CA′ equal to CA (set square and dividers).', () => {
        k.point(Cc, 'C', 'sw'); k.point(Aend, 'A', 'se'); k.point(Bend, 'B', 'ne');
        k.seg(Cc, Aend, { cls: 'cons' }); k.seg(Cc, Bend, { cls: 'cons' }); k.seg(Cc, Ap, { cls: 'cons' }); k.point(Ap, 'A′', 'nw');
      });
      k.step('straightedge', 'Join A′ to B and find its midpoint M (dividers).', () => {
        k.seg(Ap, Bend, { cls: 'cons' }); k.point(Mm, 'M', 'n');
      });
      k.step('compass', 'Draw the circle about M through C. It cuts the line A′B in two points P and Q.', () => {
        k.circle(Mm, rM, { cls: 'cons' }); k.point(Pp, 'P', 'nw'); k.point(Qq, 'Q', 'ne');
      });
      k.step('straightedge', 'Draw CP and CQ and extend them: they are the directions of the axes of the ellipse. They are perpendicular, because C, P, Q lie on a circle with PQ as a diameter.', () => {
        k.line(Cc, Pp, { cls: 'cons' }); k.line(Cc, Qq, { cls: 'cons' });
      });
      k.step('dividers', 'The semi-axes are the distances from B to P and from B to Q: lay BP along CQ (the major axis) and BQ along CP (the minor axis), both ways from C.', () => {
        [g.add(Cc, g.mul(dQ, bp)), g.sub(Cc, g.mul(dQ, bp)), g.add(Cc, g.mul(dP, bq)), g.sub(Cc, g.mul(dP, bq))].forEach(p => k.dot(p, { r: 0.9 }));
        k.seg(g.sub(Cc, g.mul(dQ, bp)), g.add(Cc, g.mul(dQ, bp)), { cls: 'thick' }); k.seg(g.sub(Cc, g.mul(dP, bq)), g.add(Cc, g.mul(dP, bq)), { cls: 'thick' });
      });
      k.note('The axes measure ' + (bp / R).toFixed(3) + ' R and ' + (bq / R).toFixed(3) + ' R (formula: 1.307 R and 0.541 R), the major axis at ' + (Math.atan2(dQ.y, dQ.x) * R2D).toFixed(1) + '° above the horizontal. The ellipse touches the parallelogram at the midpoints of its sides, not at the ends of its axes.', () => {
        k.point(Cc, '', 'sw');
      });
    }
  });

  /* ================================================================== planometric */
  Hyper.construction({
    id: 'ob-planometric',
    title: 'A floor plan turned 45° and raised: the planometric drawing',
    tags: ['planometric', 'military projection', '45° set square', 'T-square'],
    note: 'The plan is drawn true to shape — every right angle stays a right angle — only turned, here by 45°, so that its sides run along the 45° set square. The walls are then raised with verticals at true height (scale 1:1). It is an oblique projection onto the horizontal plane: the plan is the "front face". The walls nearest the viewer hide part of the rooms, so the drawing is made with the roof taken off. Wall thickness 6, wall height 30, doors 18 wide.',
    build(k) {
      const a = 45 * D2R, Hh = 30;
      const FP = [[0, 0], [22, 0], [22, 6], [6, 6], [6, 58], [56, 58], [56, 40], [62, 40], [62, 58], [94, 58], [94, 6], [62, 6], [62, 24], [56, 24], [56, 6], [40, 6], [40, 0], [100, 0], [100, 64], [0, 64]];
      const O = k.pt(0, 0);
      const Pp = (u, h, v) => ({ x: O.x + u * Math.cos(a) - v * Math.sin(a), y: O.y + u * Math.sin(a) + h + v * Math.cos(a) });
      const A = [[Math.cos(a), 0, -Math.sin(a)], [Math.sin(a), 1, Math.cos(a)]], view = [-1, 1 / Math.cos(a), -1];
      const pr = prism(FP, 0, Hh);
      const vis = hiddenLines(A, view)(pr.faces, pr.edges, { step: 0.5 });
      const base = FP.map(p => Pp(p[0], 0, p[1])), top = FP.map(p => Pp(p[0], Hh, p[1]));
      k.given('The floor plan in its true position (north up): outer walls 100 × 64, wall thickness 6, a door in the south wall (18 wide), a partition at 56 – 62 from the west with a doorway 16 wide. Wall height 30 (ticked).', () => {
        const T = k.pt(-215, 20);
        k.poly(FP.map(p => ({ x: T.x + p[0], y: T.y + p[1] })), { close: true, cls: 'given' });
        k.text(T.x + 50, T.y - 14, 'plan, true position', { upright: true, size: 0.8 });
        const h0 = k.pt(-215, 100), h1 = k.pt(-215, 100 + Hh); k.seg(h0, h1); k.tick(h0, k.pt(0, 1)); k.tick(h1, k.pt(0, 1)); k.label(h1, 'wall height 30', 'e', { upright: true, size: 0.8 });
        k.point(O, 'O', 's'); k.frame(-225, -20, 100, 165);
      });
      k.step('square', 'Turn the plan 45°: with the 45° set square against the T-square draw the outer walls from the south corner O — 100 along the right-hand 45° line, 64 along the left-hand one — and complete the rectangle.', () => {
        [[0, 0, 100, 0], [100, 0, 100, 64], [100, 64, 0, 64], [0, 64, 0, 0]].forEach(([u0, v0, u1, v1]) => k.seg(Pp(u0, 0, v0), Pp(u1, 0, v1), { cls: 'cons' }));
      });
      k.step('dividers', 'Measure the doors and the walls along the outer sides: the door 22 – 40 in the south wall, the partition 56 – 62, and the wall thickness 6 on every side.', () => {
        [[22, 0], [40, 0], [56, 0], [62, 0], [6, 0], [94, 0]].forEach(([u, v]) => k.dot(Pp(u, 0, v), { r: 0.7 }));
        [[0, 6], [0, 58], [0, 64], [100, 6], [100, 58]].forEach(([u, v]) => k.dot(Pp(u, 0, v), { r: 0.7 }));
      });
      k.step('square', 'Draw the inner wall lines and the partition parallel to the outer sides. The wall footprint is now complete on the ground.', () => {
        const onOuter = (p, q) => (p[0] === 0 && q[0] === 0) || (p[0] === 100 && q[0] === 100) || (p[1] === 0 && q[1] === 0) || (p[1] === 64 && q[1] === 64);
        for (let i = 0; i < FP.length; i++) { const p = FP[i], q = FP[(i + 1) % FP.length]; if (!onOuter(p, q)) k.seg(Pp(p[0], 0, p[1]), Pp(q[0], 0, q[1]), { cls: 'cons' }); }
      });
      k.step('tee', 'Raise a vertical from every corner of the footprint (T-square, set square against it).', () => {
        FP.forEach((p, i) => k.seg(base[i], top[i], { cls: 'cons' }));
      });
      k.step('dividers', 'On each vertical lay off the wall height 30 at the true scale.', () => {
        top.forEach(p => k.dot(p, { r: 0.6 }));
      });
      k.step('square', 'Join the tops with the 45° set square: the plan again, 30 higher.', () => {
        for (let i = 0; i < FP.length; i++) k.seg(top[i], top[(i + 1) % FP.length], { cls: 'cons' });
      });
      k.step('pencil', 'Line in what can be seen: the wall tops, the faces towards the viewer (the south- and west-facing ones) and where the near walls cut off the floor and the far walls. The rest is hidden.', () => {
        vis.forEach(s => k.seg(Pp(s.a[0], s.a[1], s.a[2]), Pp(s.b[0], s.b[1], s.b[2]), { cls: 'thick' }));
      });
      k.note('The plan on the ground is the plan of the given figure, turned: the corner at the south door is still exactly 90°. In an isometric drawing the same plan would be distorted into a rhombus.', () => {
        k.right(Pp(100, 0, 0), Pp(0, 0, 0), Pp(100, 0, 64), { r: 0.7 });
        k.right(Pp(0, 0, 0), Pp(100, 0, 0), Pp(0, 0, 64), { r: 0.7 });
      });
    }
  });

  /* ================================================================== the Chinese handscroll */
  Hyper.construction({
    id: 'ob-handscroll',
    title: 'A courtyard and pavilion in the parallel perspective of a Chinese handscroll',
    tags: ['parallel perspective', 'oblique', 'handscroll', 'hidden lines'],
    note: 'Painters of the Chinese handscroll and of the Japanese picture scroll drew buildings, courtyards and streets in an oblique parallel view: the front of every building is shown true, the receding lines run parallel up the picture, and a thing far away is as big as one that is near. Nothing converges. That is an oblique projection at about 50° with the depth drawn at about 0.65 of its true length; the near wall is kept low, as the painters did with "blown-off" roofs, so that the courtyard can be seen. The dashed lines show what linear perspective would do to the same courtyard: the sides would meet and the back wall would shrink.',
    build(k) {
      const a = 50 * D2R, rr = 0.65, Wc = 170, Dc = 110, Hw = 18;
      const gx0 = 73, gx1 = 97, px0 = 50, px1 = 120, pd0 = 36, pd1 = 80, hx0 = 60, hx1 = 110, hd0 = 44, hd1 = 72, ph = 10, hh = 44, rh = 72, rx0 = 46, rx1 = 124, rd0 = 34, rd1 = 82, rdm = 58;
      const O = k.pt(0, 0), e = g.dir(a);
      const Pq = (x, y, d) => ({ x: O.x + x + rr * Math.cos(a) * d, y: O.y + y + rr * Math.sin(a) * d });
      const A = [[1, 0, rr * Math.cos(a)], [0, 1, rr * Math.sin(a)]], view = [rr * Math.cos(a), rr * Math.sin(a), -1];
      const ring = [[0, 0], [gx0, 0], [gx0, 5], [5, 5], [5, Dc - 5], [Wc - 5, Dc - 5], [Wc - 5, 5], [gx1, 5], [gx1, 0], [Wc, 0], [Wc, Dc], [0, Dc]];
      const solids = [prism(ring, 0, Hw)];
      const box = (x0, x1, y0, y1, d0, d1) => prism([[x0, d0], [x1, d0], [x1, d1], [x0, d1]], y0, y1);
      solids.push(box(px0, px1, 0, ph, pd0, pd1), box(hx0, hx1, ph, hh, hd0, hd1));
      // the roof: a triangular prism along x
      const rf = [[rd0, hh], [rd1, hh], [rdm, rh]], rfaces = [{ pts: rf.map(p => [rx0, p[1], p[0]]) }, { pts: rf.map(p => [rx1, p[1], p[0]]) }], redges = [];
      for (let i = 0; i < 3; i++) { const p = rf[i], q = rf[(i + 1) % 3]; rfaces.push({ pts: [[rx0, p[1], p[0]], [rx1, p[1], p[0]], [rx1, q[1], q[0]], [rx0, q[1], q[0]]] }); redges.push([[rx0, p[1], p[0]], [rx1, p[1], p[0]]], [[rx0, p[1], p[0]], [rx0, q[1], q[0]]], [[rx1, p[1], p[0]], [rx1, q[1], q[0]]]); }
      solids.push({ faces: rfaces, edges: redges });
      const faces = [].concat(...solids.map(s => s.faces)), edges = [].concat(...solids.map(s => s.edges));
      edges.push([[gx0, 0, 0], [gx0, 0, pd0]], [[gx1, 0, 0], [gx1, 0, pd0]]);     // the path from the gate to the platform
      const vis = hiddenLines(A, view)(faces, edges, { step: 0.5 });
      const ringB = ring.map(p => Pq(p[0], 0, p[1])), ringT = ring.map(p => Pq(p[0], Hw, p[1]));
      k.given('The courtyard 170 wide and 110 deep, its wall 18 high with a gate 24 wide, and a pavilion on a platform. Receding lines at 50°, depth drawn at 0.65 of the true length (a length of 50 and its drawn length 32.5 are ticked at the right).', () => {
        k.point(O, 'O', 'sw');
        const p0 = k.pt(250, -35), p1 = g.add(p0, g.mul(e, 50)), p2 = g.add(p0, g.mul(e, 32.5));
        k.seg(p0, p1, { cls: 'given' }); k.tick(p0, e); k.tick(p1, e); k.label(p1, 'true depth 50', 'ne', { upright: true, size: 0.8 });
        const q0 = g.add(p0, k.pt(22, 0)), q1 = g.add(q0, g.mul(e, 32.5));
        k.seg(q0, q1, { cls: 'given' }); k.tick(q0, e); k.tick(q1, e); k.label(q1, 'drawn 32.5', 'ne', { upright: true, size: 0.8 });
        k.frame(-25, -45, 345, 125);
      });
      k.step('tee', 'The front edge of the courtyard: a true horizontal of length 170 (T-square).', () => {
        k.seg(O, Pq(Wc, 0, 0), { cls: 'cons' }); k.point(Pq(Wc, 0, 0), '', 'se');
      });
      k.step('protractor', 'From both ends lay off the receding direction, 50° above the horizontal, and mark the drawn depth 0.65 × 110 = 71.5 on each.', () => {
        k.seg(O, Pq(0, 0, Dc), { cls: 'cons' }); k.seg(Pq(Wc, 0, 0), Pq(Wc, 0, Dc), { cls: 'cons' }); k.dot(Pq(0, 0, Dc), { r: 0.7 }); k.dot(Pq(Wc, 0, Dc), { r: 0.7 });
      });
      k.step('tee', 'Close the ground with the back edge, parallel to the front one. The sides are parallel: they do not converge.', () => {
        k.seg(Pq(0, 0, Dc), Pq(Wc, 0, Dc), { cls: 'cons' });
      });
      k.step('square', 'The wall: draw its footprint (thickness 5) inside the ground lines, leaving the gate open between 73 and 97 on the front edge.', () => {
        for (let i = 0; i < ring.length; i++) k.seg(ringB[i], ringB[(i + 1) % ring.length], { cls: 'cons' });
      });
      k.step('tee', 'Raise verticals of height 18 (true scale) from every corner of the wall and join the tops: a low ring that hides little of the yard.', () => {
        ring.forEach((p, i) => { k.seg(ringB[i], ringT[i], { cls: 'cons' }); k.seg(ringT[i], ringT[(i + 1) % ring.length], { cls: 'cons' }); });
      });
      k.step('dividers', 'Place the pavilion: carry its position along the front edge (50 – 120) and its depth (36 – 80, at 0.65) to the ground, and draw the footprints of the platform and of the hall with the 50° and the horizontal lines.', () => {
        [[px0, px1, pd0, pd1], [hx0, hx1, hd0, hd1]].forEach(([x0, x1, d0, d1]) => k.poly([Pq(x0, 0, d0), Pq(x1, 0, d0), Pq(x1, 0, d1), Pq(x0, 0, d1)], { close: true, cls: 'cons' }));
      });
      k.step('tee', 'Raise the platform (10), the hall (to 44) and the roof (ridge at 72) with verticals; the eaves overhang the hall by 10 in depth and 14 at the ends.', () => {
        [[px0, pd0], [px1, pd0], [px1, pd1], [px0, pd1]].forEach(([x, d]) => k.seg(Pq(x, 0, d), Pq(x, ph, d), { cls: 'cons' }));
        [[hx0, hd0], [hx1, hd0], [hx1, hd1], [hx0, hd1]].forEach(([x, d]) => k.seg(Pq(x, ph, d), Pq(x, hh, d), { cls: 'cons' }));
        [rx0, rx1].forEach(x => k.seg(Pq(x, hh, rdm), Pq(x, rh, rdm), { cls: 'cons' }));
      });
      k.step('square', 'Draw the roof: the eave lines at height 44, the ridge at 72, and the slopes between them.', () => {
        rf.forEach(([d, y]) => k.seg(Pq(rx0, y, d), Pq(rx1, y, d), { cls: 'cons' }));
        for (let i = 0; i < 3; i++) { const p = rf[i], q = rf[(i + 1) % 3]; k.seg(Pq(rx0, p[1], p[0]), Pq(rx0, q[1], q[0]), { cls: 'cons' }); k.seg(Pq(rx1, p[1], p[0]), Pq(rx1, q[1], q[0]), { cls: 'cons' }); }
      });
      k.step('pencil', 'Line in only what the viewer sees: the front slope of the roof hides the hall behind it, the near wall hides the lower part of the yard, the hall hides the back wall.', () => {
        vis.forEach(s => k.seg(Pq(s.a[0], s.a[1], s.a[2]), Pq(s.b[0], s.b[1], s.b[2]), { cls: 'thick' }));
      });
      k.note('The sides of the courtyard are parallel and the back edge is as long as the front one (170 both). In linear perspective the sides would converge towards a vanishing point and the back wall would be drawn shorter: the scroll painter never does that.', () => {
        const f0 = O, f1 = Pq(Wc, 0, 0), b0 = Pq(0, 0, Dc), b1 = Pq(Wc, 0, Dc);
        k.dim(f0, f1, '170', { side: 'right', dist: 1.4, size: 0.8 });
        { const m = g.mid(b0, b1); k.text(m.x, m.y + 24, '170', { size: 0.8, upright: false }); }
        k.seg(g.add(f0, k.pt(-8, 0)), g.add(b0, k.pt(-8, 0)), { cls: 'aux', dash: true }); k.seg(g.add(f1, k.pt(8, 0)), g.add(b1, k.pt(8, 0)), { cls: 'aux', dash: true });
      });
    }
  });


  /* ================================================================== the 2 : 1 pixel grid */
  Hyper.construction({
    id: 'ob-pixel-grid',
    title: 'The 2 : 1 pixel grid of isometric games',
    tags: ['pixel art', 'dimetric', '2:1', 'isometric'],
    note: 'Pixel art cannot draw a 30° line cleanly: the line of slope tan 30° = 0.577 crosses the pixel lattice in an irregular staircase (runs of 2, 2, 2, 1, 2, 2, 2, 1 …). A slope of exactly ½ is a perfectly regular staircase of two across and one up (26.57°), so game artists use it: a diamond tile of 16 × 8 pixels. It is a dimetric projection with the camera 30° above the horizon (the tile is sin 30° = ½ as high as it is wide), turned 45°; a true isometric tile would be 0.577 as high as wide. The vertical edge of a cube of the same size is 0.612 of the tile width (10 pixels for a 16-pixel tile).',
    build(k) {
      const c = 8;                                                      // one pixel = 8 units
      const P = (px, py) => k.pt(px * c, py * c);
      const Lc = [3, 16], Tc = [11, 20], Rc = [19, 16], Bc = [11, 12], hh = 10;
      const sq = (px, py, o) => k.rect(px * c, py * c, (px + 1) * c, (py + 1) * c, Object.assign({ fill: '#c8c8c8', stroke: 'none', opacity: 0.85, nobounds: true }, o || {}));
      k.given('Pixel graph paper, 40 × 22 pixels. A diamond tile 16 pixels wide and 8 high, and a block whose vertical edges are 10 pixels.', () => {
        k.grid(0, 0, 40 * c, 22 * c, c, { cls: 'aux' });
        k.frame(-4, -4, 40 * c + 4, 22 * c + 4);
      });
      k.step('ruler', 'Mark the four corners of the tile on the lattice points: left (3, 16), top (11, 20), right (19, 16) and bottom (11, 12). The tile is 16 pixels wide and 8 high.', () => {
        [Lc, Tc, Rc, Bc].forEach((p, i) => { k.point(P(p[0], p[1]), ['L', 'T', 'R', 'B'][i], ['w', 'n', 'e', 's'][i]); });
      });
      k.step('straightedge', 'Join the corners. Every edge rises 4 pixels over 8: exactly 1 up for 2 across, 26.57°, passing through lattice points at both ends.', () => {
        [[Lc, Tc], [Tc, Rc], [Rc, Bc], [Bc, Lc]].forEach(([p, q]) => k.seg(P(p[0], p[1]), P(q[0], q[1]), { cls: 'thick' }));
      });
      k.note('Where the pixels go: along the edge L–T they run in perfectly equal steps of two across, one up (grey squares). Any drawing program will give the same staircase for every 2 : 1 line.', () => {
        for (let i = 0; i < 8; i++) sq(Lc[0] + i, Lc[1] + Math.floor(i / 2));
      });
      k.step('tee', 'The height of the block: from L, R and B draw verticals 10 pixels down.', () => {
        [Lc, Rc, Bc].forEach(p => k.seg(P(p[0], p[1]), P(p[0], p[1] - hh), { cls: 'cons' }));
        [Lc, Rc, Bc].forEach(p => k.dot(P(p[0], p[1] - hh), { r: 0.8 }));
      });
      k.step('straightedge', 'Join the lower ends with two more 2 : 1 lines: the base of the block.', () => {
        const L2 = [Lc[0], Lc[1] - hh], B2 = [Bc[0], Bc[1] - hh], R2 = [Rc[0], Rc[1] - hh];
        k.seg(P(L2[0], L2[1]), P(B2[0], B2[1]), { cls: 'cons' }); k.seg(P(B2[0], B2[1]), P(R2[0], R2[1]), { cls: 'cons' });
      });
      k.step('pencil', 'Line in the cube: the top tile, the two vertical edges at the sides, the near vertical edge and the two lower edges.', () => {
        const L2 = [Lc[0], Lc[1] - hh], B2 = [Bc[0], Bc[1] - hh], R2 = [Rc[0], Rc[1] - hh];
        [[Lc, L2], [Rc, R2], [Bc, B2], [L2, B2], [B2, R2]].forEach(([p, q]) => k.seg(P(p[0], p[1]), P(q[0], q[1]), { cls: 'thick' }));
      });
      const S0 = [24, 4], N = 14;
      k.step('ruler', 'The same exercise at 30°: from the lattice point (24, 4) draw the 2 : 1 line (26.57°) and, for comparison, the 30° line of true isometric, 14 pixels across.', () => {
        k.point(P(S0[0], S0[1]), '', 'sw');
        k.seg(P(S0[0], S0[1]), P(S0[0] + N, S0[1] + N / 2), { cls: 'thick' });
        k.seg(P(S0[0], S0[1]), P(S0[0] + N, S0[1] + N * Math.tan(PI / 6)), { cls: 'red' });
        k.label(P(S0[0] + N, S0[1] + N / 2), '2 : 1', 'se', { upright: true, size: 0.8 }); k.label(P(S0[0] + N, S0[1] + N * Math.tan(PI / 6)), '30°', 'ne', { upright: true, size: 0.8 });
      });
      k.note('The pixels of each line. The 2 : 1 line (grey) is a regular staircase; the 30° line (red) rises 8.08 pixels over 14 and its steps are irregular — the runs are 2, 2, 2, 1, 2, 2, 2, 1 … so it looks wobbly at small sizes.', () => {
        for (let i = 0; i < N; i++) sq(S0[0] + i, S0[1] + Math.floor(i / 2), { fill: '#bdbdbd' });
        for (let i = 0; i < N; i++) sq(S0[0] + i, S0[1] + Math.floor(i * Math.tan(PI / 6) + 1e-9) + 0, { fill: '#e8a49c', opacity: 0.6 });
      });
    }
  });
})();
