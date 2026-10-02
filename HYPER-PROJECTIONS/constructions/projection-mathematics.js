/* HYPER-PROJECTIONS · constructions/projection-mathematics.js
 *
 * The hand constructions of the topic "The mathematics" (homogeneous coordinates, matrices, rotations,
 * composition, the camera, points at infinity, the cross-ratio, projective geometry).
 *
 *   pm-divide-by-w               the perspective division in one dimension: the ray from the origin through (X, W) cuts w = 1
 *   pm-matrix-columns            a matrix read off its columns: the images of the unit vectors and of the origin build the picture
 *   pm-rotate-point              a point turned about the origin with compass and protractor; the entries of the matrix read off the unit circle
 *   pm-compose-rt, pm-compose-tr translation and rotation in both orders: two drawings, two different results
 *   pm-parallels-meet            a pencil of parallel lines meeting at a point at infinity: found in the plan, drawn as lines to a vanishing point
 *   pm-frustum-to-cube           the frustum of a camera and its map to the unit cube, to scale
 *   pm-cross-ratio-construction  four points on one line carried through a centre to a second line; measured with the scale, equal cross-ratios
 *   pm-desargues                 two triangles in perspective from a point are in perspective from a line
 */
(function () {
  'use strict';
  const PI = Math.PI, deg = d => d * PI / 180;
  /* the sides of a closed polygon as separate strokes, so that the practice board can check each one */
  const edges = (k, pts, o) => pts.forEach((p, i) => k.seg(p, pts[(i + 1) % pts.length], o));

  /* ------------------------------------------------------------------ homogeneous coordinates */
  Hyper.construction({
    id: 'pm-divide-by-w',
    title: 'Dividing by w by hand: the ray from the origin',
    tags: ['homogeneous coordinates', 'perspective division', 'straightedge'],
    note: 'This is the one-dimensional picture of homogeneous coordinates: the horizontal axis carries X, the vertical axis carries W, and the real number line is the line w = 1. A homogeneous pair (X, W) is a point of the plane; the ray from the origin through it cuts w = 1 at x = X/W. Every pair on the same ray is the same real number. The three-dimensional case is the same drawing with one more axis.',
    build(k) {
      const g = k.g, u = 60, O = k.pt(0, 0);
      const X = (x, w) => k.pt(x * u, w * u);
      const H = X(3, 2), L1 = [X(-0.4, 1), X(7, 1)];
      const p = g.lineLine(O, H, L1[0], L1[1]);
      k.given('The axes: X to the right, W upwards, one unit = 60 mm on the sheet. Draw the line w = 1 across the sheet: it is the real number line. The homogeneous pair H = (3, 2) is given.', () => {
        k.axes(O, { x: [-0.4 * u, 7.2 * u], y: [-0.4 * u, 3.6 * u], xl: 'X', yl: 'W' });
        for (let i = 1; i <= 7; i++) { k.tick(X(i, 0), k.pt(1, 0)); k.label(X(i, 0), String(i), 's', { upright: true, size: 0.7 }); }
        for (let i = 1; i <= 3; i++) { k.tick(X(0, i), k.pt(0, 1)); k.label(X(0, i), String(i), 'w', { upright: true, size: 0.7 }); }
        k.seg(L1[0], L1[1], { cls: 'given' });
        k.text(7.9 * u, 0.8 * u, 'w = 1', { anchor: 'end', size: 0.8, upright: true });
        k.point(O, 'O', 'sw');
        k.point(H, 'H = (3, 2)', 'nw');
        k.frame(-0.7 * u, -1.0 * u, 8.4 * u, 3.8 * u);
      });
      k.step('straightedge', 'Lay the straightedge on O and H and draw the ray through them. Every pair (3t, 2t) lies on this ray: they are all the same point of the real line.', () => {
        k.ray(O, H, { cls: 'cons' });
      });
      k.step('straightedge', 'Mark where the ray cuts the line w = 1. This is the point the pair stands for.', () => {
        k.point(p, 'p', 'se');
      });
      k.step('square', 'Set the set square against the T-square and drop the perpendicular from p to the X axis. Its foot is x = X/W = 3/2 = 1.5.', () => {
        k.seg(p, X(1.5, 0), { cls: 'cons' });
        k.point(X(1.5, 0), '1.5', 's');
        k.label(X(1.5, 0), 'x = 3/2', 's', { upright: true, size: 0.75, dist: 2.4 });
      });
      k.step('dividers', 'Check the other members of the family: with the dividers on O and p, step the distance Op from p along the ray: you reach H = (3, 2), and one step further (4.5, 3). They fall on the same ray, so all give 1.5.', () => {
        const ap = Math.atan2(p.y, p.x);
        k.arc(p, g.dist(O, p), ap - 0.12, ap + 0.12, { cls: 'cons' });
        k.arc(H, g.dist(O, p), ap - 0.12, ap + 0.12, { cls: 'cons' });
        k.point(X(4.5, 3), '(4.5, 3)', 'se');
      });
      const H2 = X(3, 0.5), q2 = g.lineLine(O, H2, L1[0], L1[1]);
      k.step('straightedge', 'Now let W shrink: the pair (3, 0.5) lies on a flatter ray. Draw it; it cuts w = 1 at x = 3/0.5 = 6, much farther out.', () => {
        k.ray(O, H2, { cls: 'cons' });
        k.point(H2, '(3, 0.5)', 'ne');
        k.point(q2, '6', 'ne');
      });
      const H3 = X(3, 0.2);
      k.step('straightedge', 'Shrink W again: (3, 0.2) gives an almost level ray that lands at x = 15, far off this sheet. The nearer W comes to zero, the farther the point flies.', () => {
        k.ray(O, H3, { cls: 'cons', nobounds: true });
        k.dot(H3);
        k.text(8.2 * u, 0.3 * u, '(3, 0.2) lands at 15 →', { anchor: 'end', size: 0.8, upright: true });
      });
      k.note('At W = 0 the pair (3, 0) lies on the X axis itself, which is parallel to w = 1 and never meets it: the ray has no landing place. The pair is a point at infinity, the direction of the line, and it is what a point turns into as it recedes.', () => {
        k.text(4.4 * u, -0.62 * u, 'W = 0: the points at infinity', { anchor: 'middle', size: 0.85, upright: true, fill: '#b03a2e' });
      });
    }
  });

  /* ------------------------------------------------------------------ the matrix of a transformation */
  Hyper.construction({
    id: 'pm-matrix-columns',
    title: 'A matrix drawn from its columns',
    tags: ['matrix', 'affine map', 'dividers', 'columns'],
    note: 'This is the plane version of the 4 × 4 matrix (a 3 × 3 homogeneous matrix), because the plane shows everything the space does. The matrix is M = [[1.2, −0.5, 1.0], [0.4, 1.0, 0.5], [0, 0, 1]]. Its columns are the images of the unit vector along x, the unit vector along y, and the origin. Once those three are drawn, the picture of every other point follows by stepping off multiples of the columns with the dividers. The determinant of the upper left block, 1.2 × 1.0 − (−0.5) × 0.4 = 1.4, is the factor by which the area is multiplied.',
    build(k) {
      const g = k.g, u = 70, O = k.pt(0, 0);
      const X = (x, y) => k.pt(x * u, y * u);
      const t = [1.0, 0.5], c1 = [1.2, 0.4], c2 = [-0.5, 1.0];
      const T = X(t[0], t[1]), A = X(t[0] + c1[0], t[1] + c1[1]), B = X(t[0] + c2[0], t[1] + c2[1]);
      const C = X(t[0] + c1[0] + c2[0], t[1] + c1[1] + c2[1]);
      const P = X(2, 1.5), S2 = X(t[0] + 2 * c1[0], t[1] + 2 * c1[1]);
      const P2 = X(t[0] + 2 * c1[0] + 1.5 * c2[0], t[1] + 2 * c1[1] + 1.5 * c2[1]);
      k.given('The axes, the unit square with corners O, E1 = (1, 0), E2 = (0, 1), and the point P = (2, 1.5). The matrix columns are (1.2, 0.4) for x, (−0.5, 1.0) for y and (1.0, 0.5) for the translation.', () => {
        k.axes(O, { x: [-0.3 * u, 3.4 * u], y: [-0.3 * u, 3.4 * u], xl: 'x', yl: 'y' });
        for (let i = 1; i <= 3; i++) { k.tick(X(i, 0), k.pt(1, 0)); k.tick(X(0, i), k.pt(0, 1)); if (i > 1) { k.label(X(i, 0), String(i), 's', { upright: true, size: 0.7 }); k.label(X(0, i), String(i), 'w', { upright: true, size: 0.7 }); } }
        k.poly([X(0, 0), X(1, 0), X(1, 1), X(0, 1)], { close: true, cls: 'given' });
        k.point(O, 'O', 'sw'); k.point(X(1, 0), 'E_1', 'se'); k.point(X(0, 1), 'E_2', 'w');
        k.point(P, 'P', 'se');
        k.frame(-0.6 * u, -0.6 * u, 3.5 * u, 3.5 * u);
      });
      k.step('ruler', 'Lay off the translation column, (1.0, 0.5) × 70 mm, from O: its end T is where the origin goes (the fourth column).', () => {
        k.arrow(O, T, { cls: 'green' });
        k.point(T, 'T', 'se');
      });
      k.step('ruler', 'From T lay off the first column (1.2, 0.4) to A, the image of E1, and the second column (−0.5, 1.0) to B, the image of E2.', () => {
        k.arrow(T, A, { cls: 'curve' }); k.arrow(T, B, { cls: 'curve' });
        k.point(A, 'A', 'e'); k.point(B, 'B', 'nw');
      });
      k.step('dividers', 'Complete the parallelogram: carry the length TA from B and the length TB from A. The arcs cross at C, the image of the corner (1, 1).', () => {
        const aB = g.angleOf(g.sub(C, B)), aA = g.angleOf(g.sub(C, A));
        k.arc(B, g.dist(T, A), aB - 0.22, aB + 0.22, { cls: 'cons' });
        k.arc(A, g.dist(T, B), aA - 0.22, aA + 0.22, { cls: 'cons' });
        k.point(C, 'C', 'ne');
      });
      k.step('pencil', 'Line in the parallelogram T, A, C, B. It is the unit square after the transformation: turned, stretched, sheared and moved, with its area multiplied by 1.4.', () => {
        edges(k, [T, A, C, B], { cls: 'thick' });
      });
      k.step('dividers', 'Find the image of P = 2·E1 + 1.5·E2. Step the column TA twice from T to S, then carry the column TB one and a half times from S (one step and half of another, found by bisecting).', () => {
        k.seg(T, S2, { cls: 'cons' });
        k.point(S2, 'S', 'se');
        k.seg(S2, P2, { cls: 'cons' });
        k.dot(g.add(S2, g.sub(B, T)), { r: 0.7 });
      });
      k.step('pencil', 'Mark the end of the path: P′ = T + 2·(first column) + 1.5·(second column) = (2.65, 2.8).', () => {
        k.point(P2, "P′", 'ne');
      });
      k.note('Dashed: P is carried to P′. The same recipe moves every point: step the first column x times and the second y times from T. A 4 × 4 matrix does the same in space with a third column, and its bottom row (0 0 0 1) says nothing is divided.', () => {
        k.seg(P, P2, { cls: 'aux', dash: true });
        k.head(g.lerp(P, P2, 0.5), g.sub(P2, P), { cls: 'aux' });
      });
    }
  });

  /* ------------------------------------------------------------------ rotation */
  Hyper.construction({
    id: 'pm-rotate-point',
    title: 'Turning a point about the origin, and reading the matrix off the unit circle',
    tags: ['rotation', 'matrix', 'compass', 'protractor'],
    note: 'The first column of the rotation matrix is where the unit vector along x goes, the second where the unit vector along y goes. On the unit circle those two points are U = (cos θ, sin θ) and V = (−sin θ, cos θ), so the four entries of the matrix are lengths you can measure: drop perpendiculars from U and V onto the axes. The second way of finding P′, by stepping the columns, uses the matrix itself and must land on the point found with the protractor.',
    build(k) {
      const g = k.g, u = 60, th = deg(30), O = k.pt(0, 0);
      const X = (x, y) => k.pt(x * u, y * u);
      const P = X(3, 2), rP = g.dist(O, P);
      const aP = g.angleOf(P);
      const Pn = g.polar(O, rP, aP + th);
      const U = g.polar(O, u, th), V = g.polar(O, u, th + PI / 2);
      const Sx = g.polar(O, 3 * u, th);
      k.given('The axes with the unit length marked on both (60 mm), the point P = (3, 2) and the angle θ = 30°, counter-clockwise.', () => {
        k.axes(O, { x: [-1.4 * u, 4.4 * u], y: [-1.4 * u, 4.4 * u], xl: 'x', yl: 'y' });
        for (let i = 1; i <= 4; i++) { k.tick(X(i, 0), k.pt(1, 0)); k.tick(X(0, i), k.pt(0, 1)); }
        k.point(O, 'O', 'sw');
        k.point(P, 'P', 'se');
        k.seg(O, P, { cls: 'given' });
        k.frame(-1.5 * u, -1.5 * u, 4.5 * u, 4.5 * u);
      });
      k.step('compass', 'With centre O draw the unit circle (radius = the unit on the axes) and an arc of the circle through P. The turned point will stay on that circle.', () => {
        k.circle(O, u, { cls: 'cons' });
        k.arc(O, rP, aP - 0.3, aP + th + 0.3, { cls: 'cons' });
      });
      k.step('protractor', 'At O lay off 30° from the x axis, counter-clockwise: the ray cuts the unit circle at U. Lay off 30° from the y axis: the ray cuts it at V.', () => {
        k.seg(O, g.polar(O, 1.5 * u, th), { cls: 'cons' });
        k.seg(O, g.polar(O, 1.5 * u, th + PI / 2), { cls: 'cons' });
        k.point(U, 'U', 'se'); k.point(V, 'V', 'nw');
        k.angle(O, X(1, 0), U, { label: '30°', r: 2.2, labelDist: 1.5 });
      });
      k.step('square', 'Drop perpendiculars from U onto both axes and from V onto both axes. The feet read the entries of the matrix: cos 30° = 0.866 and sin 30° = 0.5 for U; −0.5 and 0.866 for V.', () => {
        const feet = [[U, X(U.x / u, 0)], [U, X(0, U.y / u)], [V, X(V.x / u, 0)], [V, X(0, V.y / u)]];
        feet.forEach(([a, b]) => k.seg(a, b, { cls: 'cons', dash: true }));
        k.label(X(U.x / u, 0), '0.866', 's', { upright: true, size: 0.7, dist: 1.2 });
        k.label(X(0, U.y / u), '0.5', 'w', { upright: true, size: 0.7 });
        k.label(X(V.x / u, 0), '−0.5', 's', { upright: true, size: 0.7 });
        k.label(X(0, V.y / u), '0.866', 'w', { upright: true, size: 0.7 });
      });
      k.step('protractor', 'Measure the angle of OP with the protractor and lay off 30° more, counter-clockwise from OP. The new ray cuts the large circle at P′, the turned point.', () => {
        k.seg(O, g.polar(O, rP * 1.12, aP + th), { cls: 'cons' });
        k.point(Pn, "P′", 'nw');
        k.angle(O, P, Pn, { label: '30°', r: 8.5, labelDist: 1.2 });
      });
      k.step('dividers', 'Check it with the matrix. P′ = 3 × (first column) + 2 × (second column). Step the length OU three times along OU, to S = (3 cos 30°, 3 sin 30°).', () => {
        for (let i = 2; i <= 3; i++) k.point(g.polar(O, i * u, th), '', 'ne');
        k.point(Sx, 'S', 'se');
        k.seg(O, Sx, { cls: 'cons' });
      });
      k.step('square', 'Through S draw the parallel to OV (the second column).', () => {
        k.seg(Sx, g.add(Sx, g.mul(g.sub(V, O), 2.35)), { cls: 'cons' });
      });
      k.step('dividers', 'Carry the length OV twice from S along that parallel. You arrive at P′ again: the matrix and the protractor agree.', () => {
        k.dot(g.add(Sx, g.sub(V, O)));
        k.dot(g.add(Sx, g.mul(g.sub(V, O), 2)), { open: true, r: 1.6 });
      });
      k.note('x′ = 3 cos 30° − 2 sin 30° = 1.60 and y′ = 3 sin 30° + 2 cos 30° = 3.23. The turned point is at the same distance from O as P (|OP| = 3.61): a rotation is rigid.', () => {
        k.arc(O, rP, aP, aP + th, { cls: 'curve', arrow: true });
      });
    }
  });

  /* ------------------------------------------------------------------ composing: translation and rotation in both orders */
  function composeBuilder(order) {
    return function (k) {
      const g = k.g, u = 42, O = k.pt(0, 0);
      const X = (x, y) => k.pt(x * u, y * u);
      const tri = [X(1, 0.5), X(2.5, 0.5), X(1, 1.5)];
      const t = X(3, 0);
      const rot = p => g.rot(p, PI / 2);
      const tr = p => g.add(p, t);
      const names = ['A', 'B', 'C'];
      const fin = tri.map(order === 'RT' ? rot : tr).map(order === 'RT' ? tr : rot);
      const otherFin = tri.map(order === 'RT' ? tr : rot).map(order === 'RT' ? rot : tr);
      k.given(order === 'RT'
        ? 'Order 1, rotate first and then translate. Given: the triangle ABC, the origin O as the centre of the quarter turn, and the translation t = (3, 0) (a length of 3 units along x).'
        : 'Order 2, translate first and then rotate. Given: the same triangle ABC, the origin O as the centre of the quarter turn, and the same translation t = (3, 0).', () => {
        k.axes(O, { x: [-3.1 * u, 6.8 * u], y: [-1.1 * u, 6.2 * u], xl: 'x', yl: 'y' });
        k.poly(tri, { close: true, cls: 'given' });
        tri.forEach((p, i) => k.point(p, names[i], ['sw', 'se', 'nw'][i]));
        k.point(O, 'O', 'sw');
        k.arrow(X(0, -0.75), X(3, -0.75), { cls: 'red' });
        k.label(X(1.5, -0.75), 't = (3, 0)', 's', { upright: true, dist: 0.7, fill: '#b03a2e', size: 0.85 });
        k.frame(-3.2 * u, -1.5 * u, 6.9 * u, 6.4 * u);
      });
      const turn = (from, tag) => {
        k.step('straightedge', 'Join O to each vertex of the ' + (tag === 1 ? '' : 'moved ') + 'triangle.', () => {
          from.forEach(p => k.seg(O, p, { cls: 'cons' }));
        });
        k.step('square', 'With the set square at O draw the perpendicular to each of those lines, on the counter-clockwise side: a quarter turn.', () => {
          from.forEach(p => k.seg(O, g.rot(p, PI / 2), { cls: 'cons' }));
        });
        const to = from.map(p => g.rot(p, PI / 2));
        k.step('compass', 'With centre O and the radius to each vertex, cut the perpendicular: that is where the vertex goes. ', () => {
          from.forEach((p, i) => { k.arc3(O, p, to[i], { cls: 'cons' }); k.point(to[i], '', 'ne'); });
        });
        return to;
      };
      const shift = (from, tag) => {
        k.step('square', 'Through each vertex of the ' + (tag === 1 ? '' : 'turned ') + 'triangle draw the parallel to t (here: horizontal).', () => {
          from.forEach(p => k.seg(p, g.add(p, g.mul(g.unit(t), 3.4 * u)), { cls: 'cons' }));
        });
        const to = from.map(p => g.add(p, t));
        k.step('dividers', 'Carry the length of t, 3 units, along each parallel from the vertex.', () => {
          from.forEach((p, i) => { k.point(to[i], '', 'ne'); });
        });
        return to;
      };
      if (order === 'RT') {
        const a = turn(tri, 1);
        k.step('pencil', 'Line in the turned triangle (green): the result of the first operation.', () => {
          edges(k, a, { cls: 'green' });
          a.forEach((p, i) => k.label(p, names[i] + "′", ['e', 'e', 'w'][i]));
        });
        const b = shift(a, 2);
        k.step('pencil', 'Line in the final triangle A″B″C″: rotated about O, then moved by t.', () => {
          edges(k, b, { cls: 'curve' });
          b.forEach((p, i) => k.label(p, names[i] + '″', ['e', 'e', 'nw'][i]));
        });
      } else {
        const a = shift(tri, 1);
        k.step('pencil', 'Line in the moved triangle (green): the result of the first operation.', () => {
          edges(k, a, { cls: 'green' });
          a.forEach((p, i) => k.label(p, names[i] + "′", ['s', 'se', 'n'][i]));
        });
        const b = turn(a, 2);
        k.step('pencil', 'Line in the final triangle A″B″C″: moved by t, then rotated about O.', () => {
          edges(k, b, { cls: 'curve' });
          b.forEach((p, i) => k.label(p, names[i] + '″', ['w', 'w', 'w'][i]));
        });
      }
      k.note('Dashed red: where the other order ends. Rotation and translation do not commute: the two results are ' + (g.dist(fin[0], otherFin[0]) / u).toFixed(2) + ' units apart, |t|·2 sin(θ/2) with θ = 90°. Read right to left, the matrix of this drawing is ' + (order === 'RT' ? 'T · R' : 'R · T') + '.', () => {
        k.poly(otherFin, { close: true, cls: 'red', dash: true });
      });
    };
  }
  Hyper.construction({
    id: 'pm-compose-rt',
    title: 'Rotate, then translate (the matrix T · R)',
    tags: ['composition', 'rotation', 'translation', 'order'],
    note: 'Order 1 of two drawings. The triangle is first turned a quarter turn about the origin and then carried along t. In matrices, acting on columns, that is T · R (R acts first). The companion drawing, "Translate, then rotate", uses the same triangle and the same t and ends somewhere else.',
    build: composeBuilder('RT')
  });
  Hyper.construction({
    id: 'pm-compose-tr',
    title: 'Translate, then rotate (the matrix R · T)',
    tags: ['composition', 'rotation', 'translation', 'order'],
    note: 'Order 2 of two drawings. The triangle is first carried along t and then the whole sheet content is turned a quarter turn about the origin, so the translation itself is turned too. In matrices, acting on columns, that is R · T (T acts first). Compare the end with the drawing "Rotate, then translate".',
    build: composeBuilder('TR')
  });

  /* ------------------------------------------------------------------ the projection matrix: the division by similar triangles */
  Hyper.construction({
    id: 'pm-plan-projection',
    title: 'The perspective division by similar triangles',
    tags: ['perspective', 'plan', 'similar triangles', 'picture plane', 'straightedge'],
    note: 'Seen from above: the eye E at the origin, the depth Z running to the right and the sideways position x upwards, one unit = 50 mm. The picture plane stands across the axis at the distance d = 2. The matrix of the page does the arithmetic x′ = d·x / Z; here the straightedge does it, and the two right triangles E-G-Q₁ and E-F-P₁ show why: x′/d = x/Z. The point P₂ is twice as far as P₁ and its image is half as high.',
    build(k) {
      const g = k.g, u = 50, d = 2, E = k.pt(0, 0);
      const X = (Z, x) => k.pt(Z * u, x * u);
      const P1 = X(4, 3), P2 = X(8, 3), F1 = X(4, 0), G = X(d, 0);
      const pp = [X(d, -0.6), X(d, 3.8)];
      const Q1 = g.lineLine(E, P1, pp[0], pp[1]), Q2 = g.lineLine(E, P2, pp[0], pp[1]);
      k.given('The eye E, the axis of sight Z (one unit = 50 mm), the picture plane across it at Z = d = 2, and two points of the same height above the axis: P₁ at depth 4 and P₂ at depth 8, both at x = 3.', () => {
        k.axes(E, { x: [-0.4 * u, 9.3 * u], y: [-0.7 * u, 4.2 * u], xl: 'Z', yl: 'x' });
        for (let i = 1; i <= 9; i++) k.tick(X(i, 0), k.pt(1, 0));
        k.seg(pp[0], pp[1], { cls: 'given' });
        k.label(pp[1], 'picture plane, Z = d = 2', 'ne', { upright: true, size: 0.8 });
        k.point(E, 'E', 'sw'); k.point(P1, 'P_1', 'n'); k.point(P2, 'P_2', 'n');
        k.frame(-0.8 * u, -1.8 * u, 10 * u, 4.6 * u);
      });
      k.step('straightedge', 'Lay the straightedge on E and P₁ and draw the projector. Where it cuts the picture plane is the image Q₁ of P₁.', () => {
        k.seg(E, P1, { cls: 'cons' });
        k.point(Q1, 'Q_1', 'nw');
      });
      k.step('square', 'With the set square on the T-square drop perpendiculars from P₁ and from Q₁ onto the axis, to F and G. The right triangles E-G-Q₁ and E-F-P₁ are similar: the projector is their common hypotenuse.', () => {
        k.seg(P1, F1, { cls: 'cons' }); k.seg(Q1, G, { cls: 'cons' });
        k.right(F1, P1, E, { r: 0.6 }); k.right(G, Q1, E, { r: 0.6 });
        k.point(F1, 'F', 'se'); k.point(G, 'G', 'se');
      });
      k.step('ruler', 'Measure with the scale: x = FP₁ = 3, Z = EF = 4, d = EG = 2 and the image x′ = GQ₁ = 1.5. Check x′/d = x/Z: 1.5/2 = 3/4.', () => {
        const o1 = X(4.35, 0), o2 = X(1.6, 0);
        k.seg(o1, X(4.35, 3), { cls: 'curve' }); k.tick(X(4.35, 3), k.pt(0, 1)); k.tick(o1, k.pt(0, 1));
        k.label(X(4.35, 1.5), 'x = 3', 'e', { upright: true, size: 0.8 });
        k.seg(o2, X(1.6, 1.5), { cls: 'curve' }); k.tick(X(1.6, 1.5), k.pt(0, 1)); k.tick(o2, k.pt(0, 1));
        k.label(X(1.6, 0.75), "x′ = 1.5", 'w', { upright: true, size: 0.8 });
        k.seg(X(0, -0.85), X(4, -0.85), { cls: 'curve' }); k.tick(X(0, -0.85), k.pt(1, 0)); k.tick(X(4, -0.85), k.pt(1, 0));
        k.label(X(2, -0.85), 'Z = 4', 'c', { upright: true, size: 0.8, bg: true });
        k.seg(X(0, -1.35), X(2, -1.35), { cls: 'curve' }); k.tick(X(0, -1.35), k.pt(1, 0)); k.tick(X(2, -1.35), k.pt(1, 0));
        k.label(X(1, -1.35), 'd = 2', 'c', { upright: true, size: 0.8, bg: true });
      });
      k.step('straightedge', 'Now the same for P₂, twice as far. The projector from E through P₂ cuts the picture plane at Q₂, half as high as Q₁.', () => {
        k.seg(E, P2, { cls: 'cons' });
        k.point(Q2, 'Q_2', 'se');
      });
      k.note('P₁ and P₂ are the same height. Dividing by w = Z gives images of height 1.5 and 0.75: the distance is the divisor. Move the picture plane out to d = 4 and both images double, which is the only thing d does.', () => {
        k.seg(Q1, Q2, { cls: 'curve', dash: true });
      });
    }
  });

  /* ------------------------------------------------------------------ points at infinity */
  Hyper.construction({
    id: 'pm-parallels-meet',
    title: 'Parallel lines meet at a point at infinity: finding the vanishing point from the plan',
    tags: ['vanishing point', 'point at infinity', 'horizon', 'plan'],
    note: 'The picture sits above, the plan below, and both use the same horizontal positions. In the plan the picture plane PP is a horizontal line, the eye E (the station point) lies 120 mm in front of it, and five parallel lines run away from PP at 60° to it. The line through E parallel to them meets PP at V0: that is the whole secret, x_v = d·cot θ = 120 × 0.577 = 69.3. All parallels in the pencil share that one point on the horizon.',
    build(k) {
      const g = k.g, d = 120, th = deg(60), HLy = 0, GLy = -100, PPy = -200;
      const E = k.pt(0, PPy - d), xv = d / Math.tan(th);
      const V0 = k.pt(xv, PPy), V = k.pt(xv, HLy);
      const xs = [-100, -50, 0, 50, 100];
      const dir = g.dir(th);
      k.given('The picture above: the horizon HL and the ground line GL (100 mm below it). The plan below: the picture plane PP, the station point E (120 mm in front of PP), and the five parallel lines, which leave PP at the marks 1 to 5 at 60° to it.', () => {
        k.seg(k.pt(-170, HLy), k.pt(170, HLy), { cls: 'given' });
        k.seg(k.pt(-170, GLy), k.pt(170, GLy), { cls: 'given' });
        k.label(k.pt(170, HLy), 'HL', 'e', { upright: true, size: 0.9 });
        k.label(k.pt(170, GLy), 'GL', 'e', { upright: true, size: 0.9 });
        k.seg(k.pt(-170, PPy), k.pt(170, PPy), { cls: 'given' });
        k.label(k.pt(170, PPy), 'PP', 'e', { upright: true, size: 0.9 });
        k.point(E, 'E', 's');
        k.seg(k.pt(-150, PPy), k.pt(-150, PPy - d), { cls: 'cons' });
        k.tick(k.pt(-150, PPy), k.pt(0, 1)); k.tick(k.pt(-150, PPy - d), k.pt(0, 1));
        k.label(k.pt(-150, PPy - d / 2), 'd = 120', 'w', { upright: true, size: 0.85 });
        xs.forEach((x, i) => {
          k.point(k.pt(x, PPy), String(i + 1), 'sw');
          k.seg(k.pt(x, PPy), g.add(k.pt(x, PPy), g.mul(dir, 65)), { cls: 'given' });
        });
        k.angle(k.pt(xs[0], PPy), k.pt(xs[0] + 40, PPy), g.add(k.pt(xs[0], PPy), g.mul(dir, 40)), { label: '60°', r: 1.4, labelDist: 1.4 });
        k.frame(-190, -330, 200, 30);
      });
      k.step('square', 'With the set square on the T-square draw the parallel to the lines of the plan through E, at 60° to PP. It will meet PP in V0.', () => {
        k.seg(E, g.add(E, g.mul(dir, d / Math.sin(th) * 1.0)), { cls: 'cons' });
        k.point(V0, 'V_0', { at: 's', lo: { dist: 2.2 } });
      });
      k.step('square', 'Slide the set square along the T-square and draw the vertical from V0 up to the horizon HL. Its foot V is the vanishing point of all five lines.', () => {
        k.seg(V0, V, { cls: 'cons', dash: true });
        k.point(V, 'V', 'ne');
      });
      k.step('square', 'Transfer the five marks of PP up to the ground line GL with verticals: in the picture they are the points where the lines start.', () => {
        xs.forEach((x, i) => { k.seg(k.pt(x, PPy), k.pt(x, GLy), { cls: 'cons', dash: true }); k.point(k.pt(x, GLy), String(i + 1), 'sw'); });
      });
      k.step('straightedge', 'Join each mark on GL to V. These are the five parallel lines as the eye sees them: they converge, all on the same point V of the horizon.', () => {
        xs.forEach(x => k.seg(k.pt(x, GLy), V, { cls: 'thick' }));
      });
      k.note('The lines are parallel in space and meet nowhere; on the paper they meet at V, the image of their point at infinity. Lines at another angle have another vanishing point on the same horizon: d·cot θ moves along HL as θ changes, and to ±∞ when the lines are parallel to PP, which is when they stay parallel in the picture.', () => {
        k.text(-165, HLy + 14, 'V is the image of the point at infinity of the rails', { anchor: 'start', size: 0.8, upright: true });
      });
    }
  });

  /* ------------------------------------------------------------------ the camera frustum and the unit cube */
  Hyper.construction({
    id: 'pm-frustum-to-cube',
    title: 'The frustum of a camera and the unit cube it is squeezed into',
    tags: ['frustum', 'clip space', 'OpenGL', 'depth', 'to scale'],
    note: 'Seen from above: the eye E at the origin looks along +Z (the depth Z = −z of the camera), the half-angle of the view is α with tan α = 1/2, and the near and far planes are at Z = 2 and Z = 8. The projection matrix squeezes this frustum into the cube −1 ≤ x, y, z ≤ 1. The depth is squeezed unevenly: z_ndc = (f + n)/(f − n) − 2fn/((f − n)·Z) = 1.667 − 5.333/Z, so the planes crowd towards the far end. Every ray through the eye becomes a line parallel to the depth axis: the central projection has been turned into a parallel one.',
    build(k) {
      const g = k.g, u = 30, n = 2, f = 8, ta = 0.5;
      const E = k.pt(0, 0), cx = 14 * u, hh = 4 * u;
      const zn = Z => (f + n) / (f - n) - 2 * f * n / ((f - n) * Z);
      const cube = z => cx + hh * z;
      const N1 = k.pt(n * u, n * ta * u), N2 = k.pt(n * u, -n * ta * u), F1 = k.pt(f * u, f * ta * u), F2 = k.pt(f * u, -f * ta * u);
      const depths = [3, 4, 6];
      k.given('The eye E and the view axis Z, with the near plane at Z = 2 and the far plane at Z = 8 marked (30 mm to the unit). The half-angle of the view is α, with tan α = 1/2: go 2 across for every 1 up.', () => {
        k.axes(E, { x: [-0.5 * u, 9 * u], y: [-5 * u, 5 * u], xl: 'Z', yl: 'x', arrows: true });
        k.tick(k.pt(n * u, 0), k.pt(1, 0)); k.tick(k.pt(f * u, 0), k.pt(1, 0));
        [[2, '2 (n)'], [3, '3'], [4, '4'], [6, '6'], [8, '8 (f)']].forEach(([Z, t]) => k.label(k.pt(Z * u, 0), t, 's', { upright: true, size: 0.7, dist: 3.0, bg: true }));
        k.point(E, 'E', 'sw');
        k.frame(-1 * u, -5.9 * u, 19.2 * u, 5.9 * u);
      });
      k.step('protractor', 'Lay off α = 26.57° on each side of the axis from E (the slope 1 : 2) and draw the two sides of the frustum out to the far plane.', () => {
        k.seg(E, F1, { cls: 'thick' }); k.seg(E, F2, { cls: 'thick' });
        k.angle(E, k.pt(u, 0), g.polar(E, u, Math.atan(ta)), { label: 'α', r: 2.2, labelDist: 1.6 });
      });
      k.step('tee', 'With the T-square and set square draw the near plane (Z = 2) and the far plane (Z = 8) as verticals between the sides: the frustum is the trapezoid between them.', () => {
        k.seg(N1, N2, { cls: 'thick' }); k.seg(F1, F2, { cls: 'thick' });
        k.dot(N1); k.dot(F1);
      });
      k.step('ruler', 'Mark the planes Z = 3, 4 and 6 on the axis and draw their verticals between the sides. Each is a slice of the frustum at constant depth.', () => {
        depths.forEach(Z => { k.seg(k.pt(Z * u, -Z * ta * u), k.pt(Z * u, Z * ta * u), { cls: 'cons' }); k.dot(k.pt(Z * u, 0)); });
      });
      k.step('square', 'To the right draw the square of the unit cube, 8 units (240 mm) high and 8 wide, centre line at the height of the axis. Its horizontal is z_ndc from −1 to +1; its vertical is x_ndc from −1 to +1.', () => {
        k.rect(cube(-1), -hh, cube(1), hh, { cls: 'given' });
        k.seg(k.pt(cube(-1), 0), k.pt(cube(1), 0), { cls: 'cons', dash: true });
        k.label(k.pt(cube(-1), hh), 'z = −1', 'nw', { upright: true, size: 0.75 }); k.label(k.pt(cube(1), hh), 'z = +1', 'ne', { upright: true, size: 0.75 });
        k.text(cube(0), -hh - 40, 'the unit cube (clip space)', { anchor: 'middle', size: 0.8, upright: true });
      });
      k.step('ruler', 'Lay off the depth of each plane inside the cube from its centre: z_ndc(2) = −1, z_ndc(3) = −0.11, z_ndc(4) = 0.33, z_ndc(6) = 0.78, z_ndc(8) = +1 (from the formula). Draw the five vertical lines across the cube.', () => {
        [2, 3, 4, 6, 8].forEach(Z => {
          const x = cube(zn(Z));
          if (Z !== 2 && Z !== 8) k.seg(k.pt(x, -hh), k.pt(x, hh), { cls: 'cons' });
          k.dot(k.pt(x, -hh));
          k.label(k.pt(x, -hh), String(Z), 's', { upright: true, size: 0.7, dist: 0.8 });
        });
      });
      k.step('straightedge', 'Draw the rays from E that leave the frustum at constant ratio x/Z = −1, −1/2, 0, 1/2, 1 times tan α. In the cube each ray is the horizontal at x_ndc = −1, −1/2, 0, 1/2, 1: the projectors have become parallel.', () => {
        [-1, -0.5, 0.5, 1].forEach(r => { k.seg(E, k.pt(f * u, r * f * ta * u), { cls: 'cons' }); });
        [-1, -0.5, 0.5, 1].forEach(r => { k.seg(k.pt(cube(-1), r * hh), k.pt(cube(1), r * hh), { cls: 'cons' }); });
      });
      const Pz = 6, Px = 1.5, Pn = k.pt(cube(zn(Pz)), Px / (Pz * ta) * hh);
      k.step('pencil', 'Map one point. P is at Z = 6, x = 1.5 in the frustum, so x_ndc = 1.5/(6 × 0.5) = 0.5 and z_ndc = 0.78. Mark P′ in the cube at those two values.', () => {
        k.point(k.pt(Pz * u, Px * u), 'P', 'ne');
        k.point(Pn, "P′", 'ne');
        k.seg(k.pt(Pz * u, Px * u), Pn, { cls: 'aux', dash: true });
      });
      k.note('Dashed: P travels to P′. The near plane is stretched to fill the whole left face of the cube and the far plane the right face; the nearest fifth of the depth range, Z = 2 to 3.2, takes half the cube. That is why depth buffers lose precision far away, and why the near plane is set as far out as the scene allows.', () => {
        k.text(cube(0), hh + 44, 'near plane → left face, far plane → right face', { anchor: 'middle', size: 0.8, upright: true });
      });
    }
  });

  /* ------------------------------------------------------------------ the cross-ratio */
  Hyper.construction({
    id: 'pm-cross-ratio-construction',
    title: 'The cross-ratio carried from one line to another through a centre',
    tags: ['cross-ratio', 'perspectivity', 'invariant', 'ruler', 'dividers'],
    note: 'Two lines l and l′ meet at Q at 60° to each other. The centre O is placed so that the point at distance u from Q on l is carried to the point at distance v = 6u/(u + 2) from Q on l′ (in oblique coordinates along the two lines, O is 2 units back along l and 6 units out along l′). Lengths change in the projection, ratios of three points change, but the number (AC · BD)/(BC · AD) does not. With the points at u = 1, 2, 4 and 6 it is 1.2 on both lines. One unit is 60 mm on the sheet.',
    build(k) {
      const g = k.g, u = 60, phi = deg(60);
      const Q = k.pt(0, 0), e1 = g.dir(0), e2 = g.dir(phi);
      const O = g.add(g.mul(e1, -2 * u), g.mul(e2, 6 * u));
      const us = [1, 2, 4, 6], vs = us.map(x => 6 * x / (x + 2));
      const names = ['A', 'B', 'C', 'D'], names2 = ['A′', 'B′', 'C′', 'D′'];
      const P1 = us.map(x => g.mul(e1, x * u)), P2 = vs.map(v => g.mul(e2, v * u));
      k.given('The line l (horizontal), the line l′ through Q at 60° to it, and the centre O. The unit length is 60 mm.', () => {
        k.seg(k.pt(-0.5 * u, 0), k.pt(6.9 * u, 0), { cls: 'given' });
        k.seg(g.mul(e2, -0.4 * u), g.mul(e2, 5.4 * u), { cls: 'given' });
        k.point(Q, 'Q', 'sw');
        k.point(O, 'O', 'nw');
        k.label(k.pt(6.9 * u, 0), 'l', 'ne', { upright: true });
        k.label(g.mul(e2, 5.4 * u), 'l′', 'ne', { upright: true });
        k.frame(-1.2 * u, -1.1 * u, 7.4 * u, 6.0 * u);
      });
      k.step('dividers', 'From Q step off the unit length along l and mark the points A, B, C, D at 1, 2, 4 and 6 units.', () => {
        P1.forEach((p, i) => k.point(p, names[i], 'n'));
      });
      k.step('straightedge', 'Draw the four lines from O through A, B, C and D. Where each cuts l′ is the image of the point: A′, B′, C′, D′.', () => {
        P1.forEach((p, i) => { k.seg(O, p, { cls: 'cons' }); k.point(P2[i], names2[i], 'w', { lo: { bg: true } }); });
      });
      k.step('ruler', 'Lay the scale along l and read the positions from Q: A = 1, B = 2, C = 4, D = 6. Then (A, B; C, D) = (AC · BD)/(BC · AD) = (3 · 4)/(2 · 5) = 1.2.', () => {
        for (let i = 0; i <= 6; i++) { k.tick(g.mul(e1, i * u), e1); k.label(g.mul(e1, i * u), String(i), 's', { upright: true, size: 0.7, dist: 1.1 }); }
      });
      k.step('ruler', 'Lay the scale along l′ and read A′ = 2, B′ = 3, C′ = 4, D′ = 4.5. The lengths are not those of l, but (A′, B′; C′, D′) = (2 · 1.5)/(1 · 2.5) = 1.2 again.', () => {
        for (let i = 1; i <= 5; i++) { k.tick(g.mul(e2, i * u), e2); k.label(g.mul(e2, i * u), String(i), 'e', { upright: true, size: 0.7, dist: 1.1, bg: true }); }
      });
      k.note('On l the ratio AB : BC is 1 : 2 and on l′ it is 1 : 1: the ratio of three points changed. The four-point number did not. Move O or tilt l′ and the same four rays give the same 1.2, so a cross-ratio read off a picture is a cross-ratio of the thing pictured.', () => {
        k.text(3.6 * u, 5.4 * u, '(A, B; C, D) = 1.2 on l  and  1.2 on l′', { anchor: 'middle', size: 0.95, upright: true, bg: true });
      });
    }
  });

  /* ------------------------------------------------------------------ projective geometry: Desargues */
  Hyper.construction({
    id: 'pm-desargues',
    title: "Desargues' theorem: triangles in perspective from a point are in perspective from a line",
    tags: ['Desargues', 'projective geometry', 'straightedge', 'collinear'],
    note: 'Only a straightedge is needed. Triangle ABC and triangle A′B′C′ are in perspective from the point O when the three lines AA′, BB′, CC′ pass through O. Desargues (1639) showed that then the three points where the corresponding sides meet, P = AB·A′B′, Q = BC·B′C′ and R = CA·C′A′, lie on one line. No distances or angles appear; the statement is about points and lines only, which is why it belongs to projective geometry.',
    build(k) {
      const g = k.g, O = k.pt(0, 0);
      const A = k.pt(-70, 30), B = k.pt(60, 70), C = k.pt(40, -50);
      const A2 = g.mul(A, 1.8), B2 = g.mul(B, 0.5), C2 = g.mul(C, 2.9);
      const P = g.lineLine(A, B, A2, B2), Q = g.lineLine(B, C, B2, C2), R = g.lineLine(C, A, C2, A2);
      k.given('The centre O and the triangle ABC.', () => {
        k.poly([A, B, C], { close: true, cls: 'given' });
        k.point(O, 'O', 'sw'); k.point(A, 'A', 'sw'); k.point(B, 'B', 'ne'); k.point(C, 'C', 'se');
        k.frame(-350, -180, 190, 230);
      });
      k.step('straightedge', 'Through O and each vertex draw a line (a projector): OA, OB, OC.', () => {
        [A, B, C].forEach(p => k.line(O, p, { cls: 'cons' }));
      });
      k.step('dividers', 'Choose a point on each projector, wherever you like: A′ on OA, B′ on OB, C′ on OC (here at 1.8, 0.5 and 2.9 times the distance from O to the vertex).', () => {
        k.point(A2, 'A′', 'nw'); k.point(B2, 'B′', 'sw'); k.point(C2, 'C′', 'se');
      });
      k.step('straightedge', "Join the new points: the triangle A′B′C′. The two triangles are in perspective from O.", () => {
        edges(k, [A2, B2, C2], { cls: 'green' });
      });
      k.step('straightedge', 'Extend the corresponding sides until they meet. AB and A′B′ meet at P, BC and B′C′ at Q, CA and C′A′ at R.', () => {
        k.line(A, B, { cls: 'cons', dash: true }); k.line(A2, B2, { cls: 'cons', dash: true });
        k.line(B, C, { cls: 'cons', dash: true }); k.line(B2, C2, { cls: 'cons', dash: true });
        k.line(C, A, { cls: 'cons', dash: true }); k.line(C2, A2, { cls: 'cons', dash: true });
        k.point(P, 'P', 'nw'); k.point(Q, 'Q', 'ne'); k.point(R, 'R', 'ne');
      });
      k.step('straightedge', 'Lay the straightedge on P and Q. It also passes through R: the two triangles are in perspective from the line PQR, the Desargues line.', () => {
        k.line(P, Q, { cls: 'curve' });
      });
      k.note('Move any point and the three intersections stay collinear. If you push O to infinity the projectors become parallel and the line PQR becomes the axis of an affine stretch; if PQR goes to infinity, the corresponding sides are parallel in pairs.', () => {
        k.text(-210, -130, 'P, Q, R are collinear', { anchor: 'middle', size: 0.95, upright: true, bg: true });
      });
    }
  });
})();
