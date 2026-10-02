/* Curves Workshop · figures/isoptic.js — Figs. 136 (page 138, two drawings) and 137 (page 139) */

/* Fig. 136, left drawing, page 138 — the orthoptic of a parabola is its directrix. The parabola
   x² = 4py opens upwards with the vertex on the X axis (drawn through it) and the focus F (the
   double circle) on the Y axis. The heavy line below the vertex is the directrix; from a point W
   of it the two tangents to the parabola are drawn, and they meet at a right angle. */
Curves.figure({
  id: 'fig-136a',
  section: 'isoptic',
  page: 138,
  title: 'The orthoptic of a parabola is its directrix',
  tags: ['orthoptic', 'parabola', 'directrix', 'tangent'],
  build(k) {
    const g = k.g, p = 70;
    const V = k.pt(0, 0), F = k.pt(0, p);
    const x0 = -0.24 * p;
    const W = k.pt(x0, -p);
    const par = x => x * x / (4 * p);
    const xt = [x0 - Math.sqrt(x0 * x0 + 4 * p * p), x0 + Math.sqrt(x0 * x0 + 4 * p * p)];   // abscissas of the points of contact
    const Tc = xt.map(x => k.pt(x, par(x)));
    const Fr = Tc.map(T => g.reflect(F, W, T));                // the reflection of F in each tangent lies on the directrix

    k.given('The parabola with vertex V and focus F, and the axes: X through the vertex (the tangent there), Y the axis of the parabola.', () => {
      k.axes(V, { x: [-p * 2.5, p * 2.9], y: [-p * 2.3, p * 2.55] });
      k.curve(t => [t, par(t)], [-p * 3.17, p * 3.17], { cls: 'thick', n: 240 });
      k.point(V, '', { open: true });
      k.pivot(F);
    });
    k.step('dividers', 'Lay off the distance VF from V on the axis on the other side of V, and draw the directrix through that point at right angles to the axis.', () => {
      k.seg(k.pt(-p * 2.9, -p), k.pt(p * 3.0, -p), { cls: 'thick' });
    });
    k.step('compass', 'Take any point W of the directrix. The circle about W through the focus F cuts the directrix at two points: the reflections of F in the two tangents from W.', () => {
      const r = g.dist(W, F);
      k.arc(W, r, 0, Math.PI, { cls: 'aux', nobounds: true });
      Fr.forEach(q => k.dot(q, { open: true, r: 0.55, cls: 'aux' }));
    });
    k.step('straightedge', 'Each tangent from W is the perpendicular bisector of the segment joining F to one of those two points. Draw the two tangents from W; each ends where it touches the parabola.', () => {
      Fr.forEach(q => k.seg(F, q, { cls: 'aux' }));
      Tc.forEach(T => k.seg(W, T, { cls: 'given' }));
      k.point(W, '', { open: true });
    });
    k.note('The two tangents meet at W at a right angle, whichever point W of the directrix is chosen: the directrix is the locus of the intersection of perpendicular tangents, the orthoptic of the parabola.', () => {
      k.right(W, Tc[1], Tc[0], { r: 0.9 });
    });
  }
});

/* Fig. 136, right drawing, page 138 — the orthoptics of the central conics. The ellipse
   x²/a² + y²/b² = 1 is inscribed in the rectangle x = ±a, y = ±b; the hyperbola
   x²/a² - y²/b² = 1 has the same vertices, and the diagonals of the rectangle are its
   asymptotes. The large circle x² + y² = a² + b² (through the corners and the foci of the
   hyperbola) is the orthoptic of the ellipse; the small circle x² + y² = a² - b² (through the foci
   of the ellipse) is the orthoptic of the hyperbola. Two perpendicular tangents of the ellipse are
   drawn from a point U of the large circle. */
Curves.figure({
  id: 'fig-136b',
  section: 'isoptic',
  page: 138,
  title: 'The orthoptics of the ellipse and the hyperbola are concentric circles',
  tags: ['orthoptic', 'ellipse', 'hyperbola', 'director circle', 'tangent'],
  note: 'The book letters only the axes; the other points are described in the step texts.',
  build(k) {
    const g = k.g, a = 262, b = 195;
    const O = k.pt(0, 0);
    const c1 = Math.sqrt(a * a - b * b), c2 = Math.sqrt(a * a + b * b);   // focal distances of the ellipse and of the hyperbola
    const U = g.polar(O, c2, g.deg(71));
    const Us = k.pt(U.x, U.y * a / b);                                   // the ellipse becomes a circle when y is scaled by a/b
    const Tc = g.tangentPoints(Us, O, a).map(q => k.pt(q.x, q.y * b / a));

    k.given('The axes, the centre O, the ellipse with semi-axes a and b, and the hyperbola with the same vertices (±a, 0) and semi-axes a and b.', () => {
      k.axes(O, { x: [-516, 504], y: [-395, 403] });
      k.dot(O, { open: true, r: 0.9 });
      k.ellipse(O, a, b, { cls: 'thick' });
      k.curve(t => [a * Math.cosh(t), b * Math.sinh(t)], [-1.27, 1.27], { cls: 'thick', n: 120 });
      k.curve(t => [-a * Math.cosh(t), b * Math.sinh(t)], [-1.27, 1.27], { cls: 'thick', n: 120 });
    });
    k.step('straightedge', 'Draw the rectangle with sides x = ±a and y = ±b, which touch the ellipse at its vertices, and its two diagonals: they are the asymptotes of the hyperbola.', () => {
      k.poly([k.pt(-a, -b), k.pt(a, -b), k.pt(a, b), k.pt(-a, b)], { close: true, cls: 'given' });
      k.seg(k.pt(-511, -511 * b / a), k.pt(511, 511 * b / a), { cls: 'given' });
      k.seg(k.pt(-511, 511 * b / a), k.pt(511, -511 * b / a), { cls: 'given' });
    });
    k.step('compass', 'The circle about O through the corners of the rectangle has the radius √(a² + b²): it is the orthoptic of the ellipse, and it cuts the axis at the foci of the hyperbola.', () => {
      k.circle(O, c2, { cls: 'thick' });
      k.pivot(k.pt(c2, 0)); k.pivot(k.pt(-c2, 0));
    });
    k.step('compass', 'The circle about the end of the minor axis (0, b) with the radius a cuts the major axis at the foci of the ellipse, at the distance √(a² − b²) from O. The circle about O through those foci is the orthoptic of the hyperbola.', () => {
      k.arc(k.pt(0, b), a, g.deg(-90 - 41), g.deg(-90 + 41), { cls: 'aux', nobounds: true });
      k.circle(O, c1, { cls: 'thick' });
      k.pivot(k.pt(c1, 0)); k.pivot(k.pt(-c1, 0));
    });
    k.step('straightedge', 'From any point U of the large circle draw the two tangents to the ellipse. They are perpendicular, whichever U is chosen: U is on the orthoptic.', () => {
      Tc.forEach(T => k.seg(U, T, { cls: 'given' }));
      k.dot(U, { open: true, r: 1.1 });
    });
  }
});

/* Fig. 137, page 139 — the tangent construction of an isoptic. A rigid angle PRQ of constant size
   slides with its sides touching the given curve at P and Q. The normals at P and Q (dashed) meet
   in H, the instantaneous centre of rotation of the rigid body formed by the angle, so HR is
   normal to the path of R, the isoptic. The book hatches the given curve (a fixed profile), marks
   the angle at R black and draws H as a hinge. Drawn in the units of the scan (pixels of the
   close-up); the curve is the ellipse arc tangent to RP at P and to RQ at Q. */
Curves.figure({
  id: 'fig-137',
  section: 'isoptic',
  page: 139,
  title: 'Tangent construction for an isoptic: the instantaneous centre H',
  tags: ['isoptic', 'instantaneous center', 'normal', 'tangent'],
  note: 'The book stops at the dashed normals PH and QH; the last step draws HR, the normal to the isoptic, which the text states.',
  build(k) {
    const g = k.g, w = 0.55;
    const P = k.pt(243, -753), Q = k.pt(922, -588), R = k.pt(590, -128);
    const arcPt = s => { const A = (1 - s) * (1 - s), B = 2 * w * s * (1 - s), C = s * s, D = A + B + C;
      return k.pt((A * P.x + B * R.x + C * Q.x) / D, (A * P.y + B * R.y + C * Q.y) / D); };
    const H = g.lineLine(P, g.add(P, g.perp(g.sub(R, P))), Q, g.add(Q, g.perp(g.sub(R, Q))));
    const f = s => { const q = arcPt(s); return [q.x, q.y]; };
    const inward = s => { const e = 1e-3, T = g.unit(g.sub(arcPt(s + e), arcPt(s - e))); const n = g.perp(T); return g.dot(n, g.sub(H, arcPt(s))) > 0 ? n : g.mul(n, -1); };
    const stroke = (s, len) => { const c = arcPt(s), n = g.rot(inward(s), -0.55); k.seg(c, g.add(c, g.mul(n, len)), { cls: 'cons' }); };

    k.given('The given curve (a fixed profile) and two points P and Q of it. The angle PRQ is a rigid body of constant size whose sides touch the curve at P and Q.', () => {
      k.curve(f, [-0.2, 1.4], { cls: 'given', width: 4.6, n: 160 });
      for (let i = 0; i <= 6; i++) stroke(-0.2 + i * 0.03, 52);
      for (let i = 0; i <= 8; i++) stroke(1.09 + i * 0.039, 48);
      for (let i = 0; i <= 12; i++) { const s = 0.39 + i * 0.0175; stroke(s, 72 * (1 - Math.abs(i - 6) / 6.8)); }
      k.point(P, 'P', { at: 'nw', open: true, r: 1.5 });
      k.point(Q, 'Q', { at: 'ne', open: true, r: 1.5 });
    });
    k.step('straightedge', 'Draw the tangents to the curve at P and at Q; they meet at R and make the constant angle between them.', () => {
      k.seg(P, R, { cls: 'given', width: 4 });
      k.seg(Q, R, { cls: 'given', width: 4 });
      k.label(R, 'R', 'nw');
    });
    k.step('square', 'At P and at Q draw the normals (perpendicular to the tangents). They meet at H.', () => {
      k.seg(P, H, { cls: 'given', dash: true, width: 4 });
      k.seg(Q, H, { cls: 'given', dash: true, width: 4 });
      k.point(H, 'H', { at: 'n', open: true, r: 1.5 });
    });
    k.step('straightedge', 'H is the instantaneous centre of rotation of the angle PRQ, so R moves at right angles to HR: the line HR is the normal to the isoptic generated by R, and the tangent of the isoptic at R is perpendicular to it.', () => {
      k.seg(H, R, { cls: 'cons', dotted: true });
    });
    k.note('The angle at R is shaded and H is drawn as a hinge, as in the book.', () => {
      const a0 = g.angleOf(g.sub(P, R)), a1 = g.angleOf(g.sub(Q, R));
      const pts = [R]; const n = 14;
      let da = a1 - a0; while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
      for (let i = 0; i <= n; i++) pts.push(g.polar(R, 85, a0 + da * i / n));
      k.hatch(pts, { fill: '#1b1b1b', gap: 1000 });
      k.seg(H, g.add(H, k.pt(-34, -30)), { cls: 'given' });
      k.seg(H, g.add(H, k.pt(34, -30)), { cls: 'given' });
    });
  }
});
