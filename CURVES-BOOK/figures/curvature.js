/* Curves Workshop · figures/curvature.js — Figs. 60 and 61 (pages 60–61)
 *
 * Fig. 60  (p. 60)  the osculating circle at (x, y): centre (α, β), radius R, tangential angle φ
 * Fig. 61  (p. 61)  curvature at the origin (Newton): the circle through O tangent to OX, cutting the curve at P
 */
(function () {
  const PI = Math.PI;

  /* ---------------------------------------------------------------------------------------------
     Fig. 60, page 60 — the circle of curvature at the point Q = (x, y) of a curve. The tangent at Q
     makes the angle φ with OX; the normal, on the concave side, carries the centre C = (α, β) at the
     distance R, and the radius CQ makes the angle φ with the vertical through C (the sides of the two
     angles are perpendicular). From the right triangle: x − α = R sin φ and β − y = R cos φ.
     The book's curve is a freehand sketch; here the curve is the cubic y = c·(x − x₀)³ + y₀, placed so
     that at Q its tangent has the book's angle and its radius of curvature is exactly R.
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-060',
    section: 'curvature',
    page: 60,
    title: 'The osculating circle: centre (α, β), radius R, tangential angle φ',
    tags: ['curvature', 'osculating circle', 'tangent'],
    note: 'The curve in the book is a sketch, flatter than the circle. Here the curve is a cubic chosen so that the drawn circle really is its circle of curvature at (x, y).',
    build(k) {
      const g = k.g, R = 100, m = 1.8, phi = Math.atan(m);
      const O = k.pt(0, 0);
      const C = k.pt(170, 144);
      const Q = k.pt(C.x + R * Math.sin(phi), C.y - R * Math.cos(phi));            // the point (x, y)
      const K = Math.pow(1 + m * m, 1.5) / (6 * R), uQ = m / (3 * K), c = K / uQ;   // the cubic y = y0 + c·u³, x = x0 + u
      const x0 = Q.x - uQ, y0 = Q.y - c * uQ * uQ * uQ;
      const cub = u => [x0 + u, y0 + c * u * u * u];
      const tang = g.dir(phi), foot = k.pt(C.x, 0), side = k.pt(C.x, Q.y);
      const T0 = g.lineLine(Q, g.add(Q, tang), O, k.pt(1, 0));                       // the tangent meets OX here

      k.given('The axes OX, OY and a curve. Choose the point (x, y) on it where the curvature is wanted.', () => {
        k.axes(O, { x: [-29, 320], y: [-74, 265], arrows: true, labels: true });
        k.dot(O, { open: true });
        k.curve(cub, [0.35 * uQ, 1.7 * uQ], { n: 160, cls: 'thick' });
        k.point(Q, '(x, y)', { at: 'e', open: true });
      });
      k.step('straightedge', 'Draw the tangent to the curve at (x, y). It makes the tangential angle φ with OX.', () => {
        k.seg(g.along(T0, Q, -30), g.add(Q, g.mul(tang, 25)), { cls: 'given' });
        k.angle(T0, k.pt(T0.x + 1, 0), Q, { label: 'φ', r: 1.7, labelDist: 1.4 });
      });
      k.step('square', 'At (x, y) raise the normal to the tangent, on the concave side of the curve, and lay off on it the radius of curvature R: its end is the centre (α, β) of the circle.', () => {
        k.seg(Q, C, { cls: 'given' });
        k.point(C, '(α, β)', { at: 'n', open: true });
        k.label(g.lerp(C, Q, 0.55), 'R', 'ne', { dist: 1.3 });
      });
      k.step('compass', 'The circle about (α, β) with radius R: the osculating circle, or circle of curvature. It touches the curve at (x, y) and has the same y\' and y\'\' there.', () => {
        k.circle(C, R, { width: 1.1 });
      });
      k.step('square', 'Drop the vertical from the centre and the horizontal from (x, y) to it. The right triangle (angle φ at the centre, since its sides are perpendicular to those of the tangent angle) gives α = x − R sin φ and β = y + R cos φ.', () => {
        k.seg(C, foot, { cls: 'given' });
        k.seg(Q, side, { cls: 'given' });
        k.angle(C, foot, Q, { label: 'φ', r: 1.5, labelDist: 1.45 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 61, page 61 — curvature at the origin (Newton). The curve touches OX at O. The circle through
     O, tangent to OX there, cuts the curve again at P = (x, y); its centre A is on OY, OC = 2R is a
     diameter. In the right triangle OPC (the angle at P is in a semicircle) the altitude PB = x is the
     mean proportional of OB = y and BC = 2R − y, so 2R − y = x²/y; and as P → O the circle becomes the
     osculating circle: R₀ = lim x²/(2y). Also OCP = θ = POX (tangent-chord), so r = OP = 2R sin θ.
     The curve is y = k x² + m x³ through P (its sketch in the book is flatter on the left of O).
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-061',
    section: 'curvature',
    page: 61,
    title: 'Curvature at the origin: the circle through O and P',
    tags: ['curvature', 'Newton', 'osculating circle'],
    note: 'The book places P at about 37° (x = 0.96R, y = 0.72R), the values used here.',
    build(k) {
      const g = k.g, R = 100, px = 96, py = 72;
      const O = k.pt(0, 0), A = k.pt(0, R), B = k.pt(0, py), C = k.pt(0, 2 * R), P = k.pt(px, py), ex = k.pt(1, 0);
      const th = Math.atan2(py, px);
      // the curve y = κ x² + μ x³ through P, with a slightly smaller bend to the left of O, as in the book
      const xl = -95, yl = 28;
      const det = px * px * xl * xl * xl - xl * xl * px * px * px;
      const kap = (py * xl * xl * xl - yl * px * px * px) / det, mu = (px * px * yl - xl * xl * py) / det;
      const cur = x => [x, kap * x * x + mu * x * x * x];
      const Mx = g.mid(O, P);

      k.given('The axes, and a curve that touches OX at the origin O; P = (x, y) is a point of the curve near O.', () => {
        k.axes(O, { x: [-95, 138], y: [0, 222], arrows: true, labels: true });
        k.curve(cur, [-95, 133], { n: 200, cls: 'thick' });
        k.point(O, 'O', { at: 's', open: true });
        k.point(P, 'P', { at: 'e', open: true });
      });
      k.step('straightedge', 'Draw OP (its length is r), and from P the horizontal PB to the y-axis. Then PB = x and OB = y.', () => {
        k.seg(O, P, { cls: 'given' });
        k.seg(B, P, { cls: 'given' });
        k.point(B, 'B', { at: 'w', open: true });
        k.label(g.mid(B, P), 'x', 'n', { dist: 1.1 });
        k.label(g.mid(O, B), 'y', 'e', { dist: 1.1 });
        k.label(g.lerp(O, P, 0.55), 'r', 'nw', { dist: 1.0 });
      });
      k.step('compass', 'Find A, the centre of the circle through O and P that touches OX at O: it is where the perpendicular bisector of OP meets OY. Draw the circle; it cuts OY again at C, and OC = 2R is a diameter.', () => {
        const d = g.perp(g.unit(g.sub(P, O)));
        k.seg(g.add(Mx, g.mul(d, -22)), g.lerp(Mx, A, 1.15), { cls: 'cons' });
        k.circle(A, R, { width: 1.1 });
        k.point(A, 'A', { at: 'w', open: true });
        k.point(C, 'C', { at: 'nw', open: true });
      });
      k.step('straightedge', 'Join C to P. The angle OPC is in a semicircle, so it is a right angle, and PB is the altitude of the triangle OPC: PB² = OB · BC, that is x² = y (2R − y). The angle OCP is equal to θ, the angle POX (tangent and chord).', () => {
        k.seg(C, P, { cls: 'given' });
        k.angle(C, O, P, { label: 'θ', r: 1.3, labelDist: 1.5 });
        k.angle(O, ex, P, { label: 'θ', r: 1.5, labelDist: 1.45, arrow: true });
      });
      k.note('Hence 2R − y = x²/y. As P moves along the curve towards O the circle becomes the osculating circle, and R₀ = lim x² / 2y. In polar coordinates r = 2R sin θ, so R₀ = lim r / 2θ.', () => {
        k.text(0, -26, 'R_0 = lim x^2 / 2y   (P → O)', { upright: true, size: 0.9, anchor: 'middle' });
      });
    }
  });
})();
