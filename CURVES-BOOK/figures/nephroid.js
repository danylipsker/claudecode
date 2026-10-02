/* Curves Workshop · figures/nephroid.js — Fig. 146 (page 152)
 *
 * The nephroid with fixed circle (O, a), a = 2b, drawn with its two cusps on the Y axis (the kit's curves.nephroid(b) has them on
 * the X axis, so the coordinates are swapped: (x, y) -> (y, x), which reverses the sense of rolling).
 * Double generation: a circle of radius a/2 (centre A') and a circle of radius 3a/2 (centre A, on the diameter ET) trace the same curve.
 * OT = OE = a, OD = 2a (TD = 3a), T'E ∥ PD, triangles OET' and OFD are isosceles.
 */
Curves.figure({
  id: 'fig-146',
  section: 'nephroid',
  page: 152,
  title: 'Double generation of the nephroid',
  tags: ['roulette', 'epicycloid', 'double generation'],
  build(k) {
    const g = k.g, a = 200, b = a / 2, al = g.deg(52.1), th = Math.PI / 2 - al;
    const O = k.pt(0, 0);
    const K = k.curves.nephroid(b);
    const sw = t => { const p = K(t); return [p[1], p[0]]; };
    const Tp = g.polar(O, a, al), Ap = g.polar(O, 1.5 * a, al), F = g.polar(O, 2 * a, al);
    const Pq = sw(th), P = k.pt(Pq[0], Pq[1]);
    const T = g.lineCircle(P, Tp, O, a).filter(p => g.dist(p, Tp) > 1)[0];
    const D = g.mul(T, -2), E = g.mul(T, -1), A = g.mul(T, -0.5);
    if (Math.abs(g.dist(P, A) - 1.5 * a) > 1e-6 || Math.abs(g.cross(g.sub(P, D), g.sub(F, D))) > 1e-6) throw new Error('fig-146: inconsistent construction');
    const X = k.pt(0, a);

    k.given('The fixed circle of radius a about O (strokes show it is fixed) and the axes; the curve starts at the cusp X = (0, a).', () => {
      k.axes(O, { x: [-2.13 * a, 2.22 * a], y: [-1.55 * a, 1.98 * a], labels: false });
      k.circle(O, a);
      [[105, 130], [197, 232], [-68, -50]].forEach(([p, q]) => k.arc(O, a, g.deg(p), g.deg(q), { hatch: 'in', cls: 'given' }));
      k.point(O, 'O', { at: 'sw', open: true, r: 1.1 });
      k.point(X, 'X', { at: 's', open: true, r: 1.1, lo: { dist: 1.4 } });
    });
    k.step('protractor', 'Draw the ray OT\' with the angle XOT\' = θ measured from the cusp (T\' is on the fixed circle).', () => {
      k.seg(O, F, { cls: 'cons' });
      k.dot(Tp, { open: true, r: 1.1 });
    });
    k.step('dividers', 'Step off the distances on the ray: OT\' = a, then T\'A\' = a/2 (A\' is the centre of the rolling circle) and A\'F = a/2, so that T\'F is a diameter of the rolling circle.', () => {
      k.point(Tp, "T'", { at: 'e', open: true, r: 1.1 });
      k.point(Ap, "A'", { at: 'e', open: true, r: 1.1 });
      k.point(F, 'F', { at: 'ne', open: true, r: 1.1 });
    });
    k.step('compass', 'The rolling circle of radius a/2 about A\': it touches the fixed circle at T\' (from outside).', () => {
      k.circle(Ap, a / 2);
    });
    k.step('protractor', 'The tracing point P: the arc T\'P of the small circle equals the arc XT\' = aθ of the fixed circle, so the angle T\'A\'P = 2θ.', () => {
      k.point(P, 'P', { at: 'n', open: true, r: 1.1 });
    });
    k.step('straightedge', 'Draw PT\' and extend it to meet the fixed circle at T. Then extend TO beyond O to D, the point where TO meets FP: TD = 3a (OD = 2a).', () => {
      k.seg(P, T, { cls: 'cons' });
      k.seg(T, D, { cls: 'cons' });
      k.seg(D, F, { cls: 'cons' });
      k.point(T, 'T', { at: 'e', open: true, r: 1.1 });
      k.point(D, 'D', { at: 'w', open: true, r: 1.1, lo: { dist: 1.3 } });
    });
    k.step('compass', 'The circle on T, P and D. The angle DPT is a right angle, so TD is a diameter: the circle has radius 3a/2, its centre A is the midpoint of TD (OA = a/2) and it touches the fixed circle at T. This larger circle generates the same nephroid.', () => {
      k.circle(A, 1.5 * a);
      k.point(A, 'A', { at: 'sw', open: true, r: 1.1 });
    });
    k.step('straightedge', 'The other end of the diameter TO of the fixed circle is E; draw ET\'. Since PD ∥ T\'E, the triangles OET\' and OFD are isosceles.', () => {
      k.seg(E, Tp, { cls: 'cons' });
      k.point(E, 'E', { at: 'sw', open: true, r: 1.1 });
    });
    k.note('The angles θ at D, E, T\' and F are equal (the arcs: arc TT\' = 2aθ, arc T\'P = aθ = arc T\'X, arc TX = 3aθ = arc TP).', () => {
      k.angle(D, T, P, { label: 'θ', r: 1.6, labelDist: 1.6 });
      k.angle(E, T, Tp, { label: 'θ', r: 1.6, labelDist: 1.6 });
      k.angle(Tp, E, O, { label: 'θ', r: 1.6, labelDist: 1.6 });
      k.angle(F, P, Tp, { label: 'θ', r: 1.3, labelDist: 1.6 });
    });
    k.step('pencil', 'The nephroid: the path of P, with its two cusps on the Y axis at (0, ±a) and its lobes reaching x = ±2a. It passes through P tangent to PF (and PD).', () => {
      k.curve(sw, [0, k.TAU], { n: 480 });
    });
  }
});
