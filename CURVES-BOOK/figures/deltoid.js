/* Curves Workshop · figures/deltoid.js — Fig. 69(a) and 69(b) (page 71)
 *
 * The deltoid with b the radius of the rolling circle and a = 3b the radius of the fixed circle (the kit's curves.deltoid(b):
 * x = b(2 cos t + cos 2t), y = b(2 sin t − sin 2t), cusps on the fixed circle at t = 0, 2π/3, 4π/3).
 * 69(a): the hypocycloid by a circle of radius b rolling inside the circle of radius 3b, the tangent at P through N.
 * 69(b): the double generation by a circle of radius 2a/3 = 2b, and the circle of radius b through F, P, T'.
 */

/* Fig. 69(a). t is the angle XOT. T = 3b e^{it} is the contact, A = 2b e^{it} the centre of the rolling circle (radius b),
   N = b e^{it} (the point of the rolling circle opposite T, on the inscribed circle), P = A + b e^{−2it} the tracing point
   (the angle TAP = 3t). The tangent at P passes through N; it meets the curve again at B (parameter t + 2π/3) and C (t − π/3),
   with BC = 4b and N its midpoint. */
Curves.figure({
  id: 'fig-069a',
  section: 'deltoid',
  page: 71,
  title: 'The deltoid as a hypocycloid of three cusps, with its tangent',
  tags: ['roulette', 'hypocycloid', 'tangent'],
  build(k) {
    const g = k.g, b = 100, t = g.deg(40), a3 = 3 * b;
    const O = k.pt(0, 0);
    const f = k.curves.deltoid(b);
    const T = g.polar(O, a3, t), A = g.polar(O, 2 * b, t), N = g.polar(O, b, t);
    const P = k.pt(...f(t)), Bp = k.pt(...f(t + 2 * Math.PI / 3)), Cp = k.pt(...f(t - Math.PI / 3));
    const X = k.pt(a3, 0);
    const K2 = g.polar(O, a3, g.deg(120)), K3 = g.polar(O, a3, g.deg(240));
    const V2 = g.polar(O, b, g.deg(-60)), V3 = g.polar(O, b, g.deg(60));

    k.given('The fixed circle of radius a = 3b about O (strokes show the inside is fixed) and the axis OX; the curve starts at X on the circle.', () => {
      k.circle(O, a3);
      [[70, 102], [152, 206], [-74, -42]].forEach(([p, q]) => k.arc(O, a3, g.deg(p), g.deg(q), { hatch: 'out', cls: 'given' }));
      k.seg(k.pt(-3.13 * b, 0), X, { cls: 'given' });
      k.point(O, 'O', { at: 's', open: true, r: 1.1 });
      k.point(X, 'X', { at: 'nw', open: true, r: 1.1 });
    });
    k.step('dividers', 'The three cusps divide the fixed circle into three equal arcs: from X step off two arcs of 120°.', () => {
      [K2, K3].forEach(p => k.dot(p, { open: true, r: 1.1 }));
    });
    k.step('protractor', 'Draw the ray OT at the angle t to OX (here t = 40°).', () => {
      k.seg(O, T, { cls: 'cons' });
      k.angle(O, k.pt(b, 0), N, { label: 't', r: 1.6, labelDist: 1.2 });
    });
    k.step('dividers', 'Step off b three times along OT: N (on the inscribed circle of radius b), A (the centre of the rolling circle) and T (on the fixed circle).', () => {
      k.point(N, 'N', { at: 'n', open: true, r: 1.1, lo: { dist: 1.1 } });
      k.point(A, 'A', { at: 'n', open: true, r: 1.1, lo: { dist: 1.1 } });
      k.point(T, 'T', { at: 'ne', open: true, r: 1.1 });
    });
    k.step('compass', 'The inscribed circle about O with radius b, and the rolling circle about A with the same radius b: it touches the fixed circle at T and passes through N.', () => {
      k.circle(O, b);
      k.circle(A, b);
      k.arc(A, 1.13 * b, g.deg(167), g.deg(129), { cw: true, arrow: true, cls: 'given', nobounds: true, width: 1 });
    });
    k.step('protractor', 'The tracing point P is on the rolling circle: the arc TP of the small circle equals the arc XT of the fixed one, and the radius ratio is 3, so the angle TAP = 3t (turned clockwise).', () => {
      k.seg(A, P, { cls: 'cons' });
      k.point(P, 'P', { at: 'nw', open: true, r: 1.1 });
    });
    k.step('straightedge', 'T is the instantaneous centre of P, so TP is the normal; the tangent is perpendicular to it and passes through N, the end of the diameter through T. Extend it both ways to meet the curve at B and C: N is the midpoint of BC and BC = 4b. The angle between the tangent and NT is 3t/2.', () => {
      k.seg(T, P, { cls: 'cons' });
      k.seg(Bp, Cp, { cls: 'cons' });
      k.dot(Bp, { open: true, r: 1.1 }); k.dot(Cp, { open: true, r: 1.1 });
      k.label(Bp, 'B', 'nw', { dist: 1.3 }); k.label(Cp, 'C', 'se', { dist: 1.3 });
      k.angle(N, P, A, { label: '3t/2', r: 1.3, labelDist: 1.5 });
    });
    k.step('straightedge', 'Join each cusp to O: the lines meet the inscribed circle where the curve touches it.', () => {
      k.seg(K2, V2, { cls: 'cons' });
      k.seg(K3, V3, { cls: 'cons' });
    });
    k.step('pencil', 'The deltoid: the path of P, with its three cusps on the fixed circle and the inscribed circle touching it at its three vertices.', () => {
      k.curve(f, [0, k.TAU], { n: 480 });
    });
  }
});

/* Fig. 69(b) — double generation. a = 3b = OT = OE. T = a e^{iτ}, E = −T. The rolling circle of the figure has radius 2a/3, centre
   A = (a/3)e^{iτ}; D = −(a/3)e^{iτ} is the end of its diameter through T. T' = a e^{iα} (τ = −2α) is the second point where TP meets
   the fixed circle, with TP : T'P = 2 : 1, P = (T + 2T')/3. PD ∥ T'E, F = PD ∩ OT' (OF = a/3); the circle on F, P, T' has centre
   A' (A'T' = a/3) and touches the fixed circle at T'. P lies on the deltoid at the parameter α. */
Curves.figure({
  id: 'fig-069b',
  section: 'deltoid',
  page: 71,
  title: 'Double generation of the deltoid: a circle of radius 2a/3',
  tags: ['roulette', 'hypocycloid', 'double generation'],
  note: 'The book draws the deltoid only outside the larger rolling circle.',
  build(k) {
    const g = k.g, a = 300, bb = a / 3, al = g.deg(37.5), ta = -2 * al;
    const O = k.pt(0, 0);
    const f = k.curves.deltoid(bb);
    const T = g.polar(O, a, ta), E = g.polar(O, -a, ta), A = g.polar(O, a / 3, ta), D = g.polar(O, -a / 3, ta);
    const Tp = g.polar(O, a, al);
    const P = k.pt((T.x + 2 * Tp.x) / 3, (T.y + 2 * Tp.y) / 3);
    const F = g.lineLine(D, P, O, Tp), Ap = g.mid(F, Tp);
    const Pd = k.pt(...f(al));
    if (g.dist(P, Pd) > 1e-6 || Math.abs(g.dist(P, A) - 2 * a / 3) > 1e-6 || Math.abs(g.dist(F, g.polar(O, a / 3, al))) > 1e-6) throw new Error('fig-069b: inconsistent construction');
    const hid = t => { const p = f(t); return g.dist(k.pt(p[0], p[1]), A) < 2 * a / 3 - 0.5 ? null : p; };

    k.given('The fixed circle of radius a = 3b about O (strokes mark it as fixed), and a diameter ET of it.', () => {
      k.circle(O, a);
      [[148, 206], [70, 100]].forEach(([p, q]) => k.arc(O, a, g.deg(p), g.deg(q), { hatch: 'out', cls: 'given' }));
      k.seg(E, T, { cls: 'cons' });
      k.point(O, 'O', { at: 'sw', open: true, r: 1.1 });
      k.point(E, 'E', { at: 'n', open: true, r: 1.1 });
      k.label(T, 'T', 's', { dist: 1.3 });
      k.dot(T, { open: true, r: 1.1 });
    });
    k.step('compass', 'The rolling circle of radius 2a/3: its centre A is on OT at the distance a/3 from O, and it touches the fixed circle at T. D, the other end of its diameter through T, is on the line ET with OD = a/3.', () => {
      k.circle(A, 2 * a / 3);
      k.arc(A, 0.88 * (2 * a / 3), g.deg(170), g.deg(195), { arrow: true, cls: 'given', nobounds: true, width: 1 });
      k.point(A, 'A', { at: 'w', open: true, r: 1.1 });
      k.point(D, 'D', { at: 'nw', open: true, r: 1.1 });
    });
    k.step('roll', 'The tracing point P of the rolling circle.', () => {
      k.point(P, 'P', { at: 'n', open: true, r: 1.1 });
    });
    k.step('straightedge', 'Draw TP and extend it to T\' on the fixed circle (TP : T\'P = 2 : 1). Then T\'E and PD: the angle DPT is in a half circle and so is the angle ET\'T, hence PD ∥ T\'E. Draw T\'O; it meets PD at F.', () => {
      k.seg(T, Tp, { cls: 'cons' });
      k.seg(E, Tp, { cls: 'cons' });
      k.seg(D, P, { cls: 'given' });
      k.seg(O, Tp, { cls: 'cons' });
      k.point(Tp, "T'", { at: 'ne', open: true, r: 1.1 });
      k.point(F, 'F', { at: 's', open: true, r: 1.1, lo: { dist: 2.2 } });
    });
    k.step('compass', 'The circle through F, P and T\', centre A\' (the midpoint of FT\'). It touches the fixed circle at T\' because the angle FPT\' is a right angle and FT\' extended passes through O. Its radius is a/3.', () => {
      k.circle(Ap, a / 3);
      k.arc(Ap, 1.13 * a / 3, g.deg(174), g.deg(140), { cw: true, arrow: true, cls: 'given', nobounds: true, width: 1 });
      k.point(Ap, "A'", { at: 'nw', open: true, r: 1.1 });
    });
    k.note('The triangles TET\', TDP and T\'FP are similar, so the three angles θ marked at D, F and T\' are equal, and TP/T\'P = 2/1.', () => {
      k.angle(D, T, P, { label: 'θ', r: 1.2, labelDist: 1.6 });
      k.angle(F, P, Tp, { label: 'θ', r: 1.2, labelDist: 1.6 });
      k.angle(Tp, E, F, { label: 'θ', r: 1.2, labelDist: 1.6 });
    });
    k.step('pencil', 'The deltoid: the same curve is generated by P on either circle (the two circles roll in opposite senses). PD is the tangent at P. The stretch inside the larger circle is left blank, as in the book.', () => {
      k.curve(hid, [0, k.TAU], { n: 600 });
      k.point(g.polar(O, a, 0), 'X', { at: 'n', open: true, r: 1.1 });
      [g.deg(120), g.deg(240)].forEach(th => k.dot(g.polar(O, a, th), { open: true, r: 1.1 }));
    });
  }
});
