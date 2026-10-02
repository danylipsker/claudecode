/* Curves Workshop · figures/_reference.js
 *
 * Three figures drawn as the reference for every writer: Fig. 1(a) and 1(b) (the astroid
 * by rolling, with hatched fixed circle, axes, angle marks, a tangent) and Fig. 9 (a true
 * compass-and-straightedge construction, point by point). Read AUTHORING.md first.
 */

/* Fig. 1(a), page 1 — the astroid as the path of a point on a circle of radius a/4 rolling
   inside a circle of radius a. The book draws one position of the rolling circle (contact T),
   the tracing point P, the line of centres OT with the angle t, and the tangent at P, which
   passes through the point of the rolling circle opposite T and meets OX at the angle π − t. */
Curves.figure({
  id: 'fig-001a',
  section: 'astroid',
  page: 1,
  title: 'The astroid as a hypocycloid of four cusps',
  tags: ['roulette', 'hypocycloid', 'tangent'],
  build(k) {
    const a = 150, t = k.g.deg(68);
    const O = k.pt(0, 0);
    const T = k.g.polar(O, a, t);                    // point of contact
    const Cc = k.g.polar(O, 3 * a / 4, t);           // centre of the rolling circle
    const P = k.pt(a * Math.pow(Math.cos(t), 3), a * Math.pow(Math.sin(t), 3));   // the tracing point
    const T2 = k.g.polar(O, a / 2, t);               // the point of the rolling circle opposite T
    const Q = k.pt(a * Math.cos(t), 0);              // where the tangent at P meets OX

    k.given('The fixed circle of radius a with centre O, and the axes OX, OY.', () => {
      k.axes(O, { x: [-a * 1.18, a * 1.18], y: [-a * 1.18, a * 1.18] });
      k.circle(O, a, { hatch: 'out' });
      k.point(O, 'O', 'sw');
      k.dim(k.pt(-a, 0), O, 'a', { dist: 1.2 });
    });
    k.step('compass', 'Draw the rolling circle: radius a/4, centre on the circle of radius 3a/4 (here at the angle t), so that it touches the fixed circle at T.', () => {
      k.seg(O, T, { cls: 'cons' });
      k.circle(Cc, a / 4);
      k.dot(Cc, { r: 0.7 });
      k.point(T, 'T', 'ne');
      k.angle(O, k.pt(a, 0), T, { label: 't' });
      k.arc(Cc, a / 4 + 9, t + 2.7, t + 1.5, { cls: 'given', cw: true, arrow: true, nobounds: true, width: 1 });
    });
    k.step('roll', 'P is the point of the rolling circle that started at the cusp (a, 0): the arc TP of the small circle equals the arc of the big circle from (a, 0) to T.', () => {
      k.point(P, 'P', 'w');
    });
    k.step('straightedge', 'The tangent at P: through P and the point of the rolling circle opposite T (T is the instantaneous centre, so TP is the normal). It meets OX below T at the angle π − t.', () => {
      k.dot(T2, { open: true, r: 0.8 });
      k.seg(P, T2, { cls: 'cons' });
      k.seg(k.g.along(Q, P, -18), P, { cls: 'cons' });
      k.point(Q, '', 'se');
      k.angle(Q, k.pt(a, 0), P, { label: 'π−t', labelDist: 1.3 });
    });
    k.step('pencil', 'The astroid: the whole path of P, with its four cusps on the axes.', () => {
      k.curve(k.curves.astroid(a), [0, k.TAU], { n: 360 });
    });
  }
});

/* Fig. 1(b), page 1 — double generation: the same astroid is traced by a point of a circle of
   radius 3a/4 rolling inside the circle of radius a. The angle at the centre of the rolling
   circle between the contact T and the tracing point P is 4t/3. */
Curves.figure({
  id: 'fig-001b',
  section: 'astroid',
  page: 1,
  title: 'Double generation of the astroid: a circle of radius 3a/4',
  tags: ['roulette', 'hypocycloid', 'double generation'],
  build(k) {
    const a = 150, t = k.g.deg(64);
    const O = k.pt(0, 0);
    const T = k.g.polar(O, a, t);
    const Cc = k.g.polar(O, a / 4, t);                      // centre of the rolling circle (radius 3a/4)
    const P = k.pt(a / 4 * Math.cos(t) + 3 * a / 4 * Math.cos(t / 3), a / 4 * Math.sin(t) - 3 * a / 4 * Math.sin(t / 3));

    k.given('The fixed circle of radius a with centre O, and the axes.', () => {
      k.axes(O, { x: [-a * 1.18, a * 1.18], y: [-a * 1.18, a * 1.18] });
      k.circle(O, a, { hatch: 'out' });
      k.point(O, 'O', 'nw');
    });
    k.step('compass', 'Draw the rolling circle of radius 3a/4: its centre is a/4 from O, in the direction t, and it touches the fixed circle at T.', () => {
      k.seg(O, Cc, { cls: 'cons' });
      k.circle(Cc, 3 * a / 4, { arrow: t + 2.2 });
      k.dot(Cc, { open: true, r: 0.8 });
      k.seg(Cc, T, { cls: 'cons' });
      k.point(T, 'T', 'ne');
      k.angle(O, k.pt(a, 0), T, { label: 't' });
    });
    k.step('roll', 'The tracing point P: the angle TCP at the centre of the rolling circle is 4t/3 (its arc from T equals the arc of the fixed circle from (a, 0) to T).', () => {
      k.seg(Cc, P, { cls: 'cons' });
      k.point(P, 'P', 's');
      k.angle(Cc, P, T, { label: '4t/3', labelDist: 1.5 });
      k.head(k.pt(a * 0.9, -a * 0.33), k.pt(-0.35, -1), { cls: 'given' });
    });
    k.step('pencil', 'The same astroid as in Fig. 1(a).', () => {
      k.curve(k.curves.astroid(a), [0, k.TAU], { n: 360 });
    });
  }
});

/* Fig. 9, page 10 — Cassinian curve, point by point. Foci F1 and F2, constant product k².
   F1C = k is perpendicular to the axis. The circle about M (the midpoint of F1F2) through C
   cuts the axis at the vertices A and B. For any X on the axis: draw the circle about F1
   through X; draw CX and the perpendicular CY at C; then F1X·F1Y = k², so the circle about F2
   with radius F1Y meets the first circle at a point P of the curve. */
Curves.figure({
  id: 'fig-009',
  section: 'cassinian',
  page: 10,
  title: 'Pointwise construction of a Cassinian curve',
  tags: ['construction', 'compass', 'foci'],
  build(k) {
    const g = k.g;
    const c = 85, kk = 110;                                 // half the focal distance, the constant k
    const M = k.pt(0, 0), F1 = k.pt(-c, 0), F2 = k.pt(c, 0);
    const C = k.pt(-c, kk);
    const rv = Math.hypot(c, kk);                           // MA = MB = MC
    const A = k.pt(-rv, 0), B = k.pt(rv, 0);
    const r1 = 150;                                          // F1X, chosen freely
    const X = k.pt(-c - r1, 0);
    const r2 = kk * kk / r1;                                 // F1Y = k² / F1X
    const Y = k.pt(-c + r2, 0);
    const P = g.circleCircle(F1, r1, F2, r2)[0];             // the upper intersection

    k.given('The foci F1, F2 on the axis, their midpoint M, and the constant product k² — the length k is given (drawn at the top left, to be taken with the dividers).', () => {
      k.line(X, B, { cls: 'given' });
      k.pivot(F1); k.label(F1, 'F_1', 's');
      k.pivot(F2); k.label(F2, 'F_2', 's');
      k.point(M, 'M', 's');
      const k0 = k.pt(X.x, 185), k1 = k.pt(X.x + kk, 185);
      k.seg(k0, k1, { cls: 'given' }); k.tick(k0, k.pt(1, 0)); k.tick(k1, k.pt(1, 0));
      k.dim(k0, k1, 'k', { dist: 1.1 });
    });
    k.step('square', 'At F1 raise the perpendicular to the axis.', () => {
      k.line(F1, C, { cls: 'cons' });
    });
    k.step('dividers', 'Take the length k with the dividers and lay it off from F1 along the perpendicular: the point C.', () => {
      k.arc(F1, kk, Math.PI / 2 - 0.35, Math.PI / 2 + 0.35, { cls: 'aux', target: false });
      k.point(C, 'C', 'nw');
    });
    k.step('compass', 'The circle about M through C cuts the axis at A and B: the two vertices of the curve.', () => {
      k.arc(M, rv, 0, Math.PI, { cls: 'cons' });
      k.point(A, 'A', 's'); k.point(B, 'B', 's');
    });
    k.step('compass', 'Choose any point X on the axis and draw the circle about F1 through X.', () => {
      k.point(X, 'X', 's');
      k.arc(F1, r1, 0, Math.PI, { cls: 'cons' });
    });
    k.step('straightedge', 'Draw CX, and at C the perpendicular to it, meeting the axis at Y. In the right triangle XCY the altitude gives F1X · F1Y = F1C² = k².', () => {
      k.seg(X, C, { cls: 'cons' });
      k.seg(C, Y, { cls: 'cons' });
      k.right(C, X, Y);
      k.point(Y, 'Y', 's');
    });
    k.step('compass', 'With the radius F1Y, draw the circle about F2. It cuts the first circle at P: F1P · F2P = k², so P is on the curve. Repeat from other points X; by symmetry each X gives four points.', () => {
      const a0 = g.angleOf(g.sub(P, F2));
      k.arc(F2, r2, a0 - 0.35, a0 + 0.5, { cls: 'cons' });
      k.point(P, 'P', 'e');
      k.seg(F1, P, { cls: 'thick' });
      k.seg(F2, P, { cls: 'thick' });
    });
    k.note('The book also marks the normal at P (it bisects the angle between PF1 and PF2 as seen from the curve) and the line PM.', () => {
      k.seg(P, M, { cls: 'cons', dash: true });
      k.seg(k.pt(P.x, P.y - 45), k.pt(P.x, P.y + 45), { cls: 'cons' });
      k.angle(P, F1, M, { r: 1.3, n: 1 });
      k.angle(P, k.pt(P.x, P.y - 10), F2, { r: 1.3 });
    });
  }
});
