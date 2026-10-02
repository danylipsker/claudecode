/* Curves Workshop · figures/cardioid.js — Figs. 3(a), 3(b), 4, 5 (pages 4–7)
 *
 * Fig. 3(a): the cardioid as the path of a point of a circle rolling on an equal circle.
 * Fig. 3(b): the double generation (a circle of radius 2a rolling round the fixed circle of radius a).
 * Fig. 4:    a cardioid cam turned about its cusp moves a pin on a fixed line (simple harmonic motion).
 * Fig. 5:    two similar crossed parallelograms whose joint P describes the cardioid.
 */

/* Fig. 3(a), page 4. Fixed circle (O, a), rolling circle (C, a) with OC = 2a at the angle t.
   T is the contact point, Q the point of the rolling circle opposite T (OTCQ is a straight line, OT = TC = CQ = a).
   P = C + a·(−cos 2t, −sin 2t) is on the cardioid, the tangent at P is PQ (T is the instantaneous centre, ∠TPQ = 90°)
   and it meets OX at φ = 3t/2. The book draws the curve only outside the rolling circle. */
Curves.figure({
  id: 'fig-003a',
  section: 'cardioid',
  page: 4,
  title: 'The cardioid as an epicycloid of one cusp',
  tags: ['roulette', 'epicycloid', 'tangent'],
  note: 'The book draws one position of the rolling circle (t ≈ 63°) and leaves out the stretch of the curve that lies inside it.',
  build(k) {
    const g = k.g, a = 100, t = g.deg(63);
    const O = k.pt(0, 0);
    const f = k.curves.cardioid(a);
    const T = g.polar(O, a, t), C = g.polar(O, 2 * a, t), Q = g.polar(O, 3 * a, t);
    const P = k.pt(...f(t));
    const d = g.unit(g.sub(P, Q));                        // direction of the tangent, from Q through P
    const Xc = g.add(P, g.mul(d, -P.y / d.y));             // where it meets OX
    const tip = g.add(P, g.mul(d, (-0.2 * a - P.y) / d.y)); // the book carries the line a little below OX
    // where the curve leaves the rolling circle again (t after the position of P)
    let lo = t + 0.02, hi = Math.PI;
    const inside = u => g.dist(k.pt(...f(u)), C) < a - 1e-6;
    while (hi - lo > 1e-6) { const m = (lo + hi) / 2; if (inside(m)) lo = m; else hi = m; }
    const tExit = hi;

    k.given('The fixed circle of radius a about O, with the axes OX and OY. The radius a is marked on OX.', () => {
      k.axes(O, { x: [-3.18 * a, 2.0 * a], y: [-2.05 * a, 2.97 * a] });
      k.circle(O, a, { hatch: 'in' });
      k.point(O, 'O', { at: 'sw', open: true, r: 1.3 });
      k.dim(k.pt(-a, 0), O, 'a', { dist: 0.9 });
    });
    k.step('protractor', 'Draw the line OQ at the angle t to OX (here t ≈ 63°).', () => {
      k.seg(O, Q, { cls: 'cons' });
      k.angle(O, k.pt(a, 0), T, { label: 't', arrow: true, r: 1.3 });
    });
    k.step('dividers', 'Step off a three times along OQ: T on the fixed circle, C (the centre of the rolling circle) and Q, the point of the rolling circle opposite T.', () => {
      k.dim(T, C, 'a', { dist: 1.0 });
      k.dim(C, Q, 'a', { dist: 1.0 });
      k.dot(C, { open: true, r: 1.3 });
      k.dot(Q, { open: true, r: 1.3 });
    });
    k.step('compass', 'The rolling circle: centre C, radius a, equal to the fixed circle. It touches the fixed circle at T.', () => {
      k.circle(C, a);
      k.arc(C, 1.14 * a, g.deg(-22), g.deg(10), { arrow: true, cls: 'given', nobounds: true, width: 1 });
    });
    k.step('protractor', 'The tracing point P is the point that touched the fixed circle at (a, 0). Rolling without slipping makes the arc TP of the small circle equal to the arc of the fixed circle from (a, 0) to T, and the radii are equal, so the angle OCP is also t.', () => {
      k.seg(C, P, { cls: 'cons' });
      k.dot(P, { open: true, r: 1.3 });
      k.label(P, 'P', 'se');
      k.angle(C, O, P, { label: 't', arrow: true, r: 1.0 });
    });
    k.step('straightedge', 'The tangent at P: T is the instantaneous centre of rotation, so TP is the normal, and QP (the angle TPQ is inscribed in a half circle, hence a right angle) is the tangent. Extend QP down to OX; it meets it at φ = 3t/2. The angle at Q is t/2.', () => {
      k.seg(Q, tip, { cls: 'cons' });
      k.angle(Q, C, P, { label: 't/2', arrow: true, r: 1.1, labelDist: 1.3 });
      k.angle(Xc, k.pt(Xc.x + 1, 0), k.pt(Xc.x - d.x, Xc.y - d.y), { label: 'φ', r: 1.1, labelDist: 1.3 });
    });
    k.step('pencil', 'The cardioid: the path of P, with its cusp at (a, 0), reaching x = −3a on the far side. The stretch inside the rolling circle is left blank, as in the book.', () => {
      k.curve(f, [g.deg(-88), t], { n: 200 });
      k.curve(f, [tExit, g.deg(210)], { n: 300 });
    });
  }
});

/* Fig. 3(b), page 4 — double generation. P is a point of a circle of radius 2a rolling round the
   outside of the fixed circle (O, a), or of the circle of radius a (centre C) of Fig. 3(a). Here the cusp Z is on the
   fixed circle, P = C + (0, a) lies straight above the centre C, and
   OT'F is a line with OT' = a, T'C = CF = a; the line FP meets the vertical line ET at D with DE = 2a, the circle
   through T, P, D has DT as diameter (centre E, radius 2a) and PD ∥ T'E. The angle θ at D is half of ∠TOT'. */
Curves.figure({
  id: 'fig-003b',
  section: 'cardioid',
  page: 4,
  title: 'Double generation of the cardioid: a circle of radius 2a',
  tags: ['roulette', 'epicycloid', 'double generation'],
  note: 'The book prints arc TT\' = aθ; the construction makes the angle TOT\' equal to 2θ. The curve is left out inside the two rolling circles.',
  build(k) {
    const g = k.g, a = 100, al = g.deg(19.7);
    const O = k.pt(0, 0), E = k.pt(0, a), T = k.pt(0, -a), D = k.pt(0, 3 * a);
    const Tp = g.polar(O, a, al), C = g.polar(O, 2 * a, al), F = g.polar(O, 3 * a, al);
    const P = k.pt(C.x, C.y + a);
    const phi0 = 2 * al + Math.PI / 2, psi = al + Math.PI / 2;     // the cusp Z is at the polar angle phi0 on the fixed circle
    const f = u => {                                                  // the cardioid, cusp at Z, u = angle turned through
      const x0 = a * (2 * Math.cos(u) - Math.cos(2 * u)), y0 = -a * (2 * Math.sin(u) - Math.sin(2 * u));
      return [x0 * Math.cos(phi0) - y0 * Math.sin(phi0), x0 * Math.sin(phi0) + y0 * Math.cos(phi0)];
    };
    const S = g.circleCircle(E, 2 * a, C, a).filter(p => g.dist(p, P) > 1)[0];   // the second meeting of the two rolling circles

    k.given('The fixed circle of radius a about O, with its vertical diameter ET (E at the top, T at the bottom).', () => {
      k.circle(O, a, { hatch: 'in' });
      k.seg(k.pt(0, 3 * a), T, { cls: 'cons' });
      k.point(O, 'O', { at: 'w', open: true, r: 1.9 });
      k.point(E, 'E', { at: 'ne', open: true, r: 1.9 });
      k.label(T, 'T', 's');
    });
    k.step('dividers', 'Draw the ray from O through T\' on the fixed circle and step off a three times along it: T\' (on the fixed circle), C (the centre of the rolling circle) and F, the point of the rolling circle opposite T\'.', () => {
      k.seg(O, F, { cls: 'cons' });
      k.dim(O, Tp, 'a', { dist: 0.9 });
      k.dim(Tp, C, 'a', { dist: 0.9 });
      k.dim(C, F, 'a', { dist: 0.9 });
      k.point(Tp, "T'", { at: 'se', open: true, r: 1.9 });
      k.dot(C, { r: 1.1 });
      k.point(F, 'F', { at: 's', open: true, r: 1.9 });
    });
    k.step('compass', 'The rolling circle of radius a about C. It touches the fixed circle at T\'.', () => {
      k.circle(C, a);
      k.arc(C, 1.08 * a, g.deg(115), g.deg(151), { arrow: true, cls: 'given', nobounds: true, width: 1 });
    });
    k.step('roll', 'The tracing point P: the arc T\'P of the small circle equals the arc of the fixed circle from the cusp to T\'. Here P comes out straight above C.', () => {
      k.point(P, 'P', { at: 'ne', open: true, r: 1.9 });
    });
    k.step('straightedge', 'Draw ET\' and the line FP; extended it meets the line ET at D, with DE = 2a. (Also PT\' extended passes through T.) PD is parallel to T\'E.', () => {
      k.seg(E, Tp, { cls: 'cons' });
      k.seg(D, F, { cls: 'thick' });
      k.seg(P, T, { cls: 'aux' });
      k.point(D, 'D', { at: 'n', open: true, r: 1.9 });
    });
    k.step('compass', 'The circle through T, P and D. The angle DPT is a right angle, so DT is its diameter: its centre is E and its radius is 2a. This circle, rolling round the fixed one, generates the same cardioid.', () => {
      k.arc(E, 2 * a, g.angleOf(g.sub(P, E)), g.angleOf(g.sub(S, E)) + Math.PI * 2);
      k.arc(E, 2.17 * a, g.deg(47), g.deg(69), { arrow: true, cls: 'given', nobounds: true, width: 1 });
    });
    k.note('The equal angles: the isosceles triangle OET\' has equal base angles at E and T\'; PD ∥ T\'E makes the angle at F equal to them, and the angle θ at D is half the angle TEP at the centre of the larger circle.', () => {
      k.angle(D, E, P, { label: 'θ', n: 2, r: 1.1, labelDist: 1.6 });
      k.angle(E, O, Tp, { n: 3, r: 1.0 });
      k.angle(Tp, E, O, { n: 3, r: 1.0 });
      k.angle(F, P, Tp, { n: 3, r: 1.0 });
    });
    k.step('pencil', 'The cardioid: the path of P, with its cusp on the fixed circle at the upper left. It passes through P tangent to the line DF.', () => {
      k.curve(f, [g.deg(-105), psi], { n: 300 });
    });
  }
});

/* Fig. 4, page 6 — a cardioid cam. The cam is the cardioid r = a(1 + cos θ), pivoted at its cusp O and turned with constant
   angular velocity; a pin (roller) held on a fixed straight line through O (here vertical) bears on it, at the distance
   r from O. r − a = a cos θ, so r'' = −k²(r − a) and the pin moves with simple harmonic motion. The cam is drawn as a groove
   (a band round the cardioid); the pin runs in the centre of the groove. */
Curves.figure({
  id: 'fig-004',
  section: 'cardioid',
  page: 6,
  title: 'A cardioid cam moving a pin with simple harmonic motion',
  tags: ['mechanism', 'cam', 'simple harmonic motion'],
  build(k) {
    const g = k.g, a = 100, th = g.deg(52.4), w = 0.12 * a;      // w: width of the groove
    const om = Math.PI / 2 - th;                                    // direction of the axis of the cam
    const Op = k.pt(0, 0);
    const rho = s => a * (1 + Math.cos(s));
    const cen = s => [rho(s) * Math.cos(om + s), rho(s) * Math.sin(om + s)];
    const r = rho(th), pin = k.pt(0, r);
    const smax = Math.acos(-0.93);                                  // the groove is stopped near the cusp
    const off = (s, sgn) => {                                       // a point of the groove wall, outside (sgn = -1) or inside (+1)
      const h = 1e-5, p0 = cen(s - h), p1 = cen(s + h), c = cen(s);
      const n = g.unit(g.perp({ x: p1[0] - p0[0], y: p1[1] - p0[1] }));
      return [c[0] + sgn * n.x * w / 2, c[1] + sgn * n.y * w / 2];
    };
    const wall = sgn => t => off(-smax + 2 * smax * t, sgn);

    k.given('The line along which the pin is held (vertical, through the cusp O of the cam) and the axis of the cam (the direction r = 2a), turned from the pin line by the angle θ.', () => {
      const L = 2.6 * a, ax = g.polar(Op, L, om);
      k.seg(Op, ax, { cls: 'cons' });
      for (let j = 0; j < 9; j++) {                                  // the short strokes at the end of the axis
        const p = g.polar(Op, L - 0.34 * a + j * 0.04 * a, om);
        k.seg(p, g.add(p, g.mul(g.dir(om + g.deg(100)), 0.075 * a)), { cls: 'cons' });
      }
      k.point(Op, '', { r: 0.7 });
    });
    k.step('pencil', 'The cam: the cardioid r = a(1 + cos θ) about its cusp O, drawn as a groove (a band of constant width on both sides of the curve). The cusp is the pole of the polar coordinates and the axis of the cam is the line θ = 0.', () => {
      k.curve(wall(-1), [0, 1], { n: 300, cls: 'given', width: 1.2 });
      k.curve(wall(1), [0, 1], { n: 300, cls: 'given', width: 1.2 });
      [-smax, smax].forEach(s => {                                   // rounded ends of the groove
        const e = cen(s), p0 = cen(s + (s > 0 ? -1e-4 : 1e-4));
        const tdir = g.unit(g.sub(k.pt(e[0], e[1]), k.pt(p0[0], p0[1])));
        const ang = g.angleOf(tdir);
        k.arc(k.pt(e[0], e[1]), w / 2, ang - Math.PI / 2, ang + Math.PI / 2, { cls: 'given', width: 1.2 });
      });
    });
    k.step('linkage', 'The pin: a roller in the groove at the distance r from O on the fixed line, carried by a rod that slides through a fixed block (hatched).', () => {
      const yb = r + 0.36 * a, yt = r + 0.74 * a, hw = 0.045 * a;
      k.hatch([k.pt(-0.52 * a, yb), k.pt(-hw, yb), k.pt(-hw, yt), k.pt(-0.52 * a, yt)], { angle: Math.PI / 4, gap: 0.7, outline: true });
      k.hatch([k.pt(hw, yb), k.pt(0.52 * a, yb), k.pt(0.52 * a, yt), k.pt(hw, yt)], { angle: Math.PI / 4, gap: 0.7, outline: true });
      k.poly([k.pt(-hw, r), k.pt(hw, r), k.pt(hw, yt + 0.14 * a), k.pt(-hw, yt + 0.14 * a)], { close: true, fill: '#1b1b1b', width: 1 });
      k.circle(pin, 0.105 * a, { fill: '#fff', width: 1.8 });
      k.point(pin, null, { r: 1.7 });
    });
    k.step('ruler', 'The distance r from the pole O to the centre of the pin is r = a(1 + cos θ).', () => {
      k.seg(Op, k.pt(0, r - 0.11 * a), { cls: 'cons' });
      k.label(k.pt(0, 0.62 * r), 'r', 'e', { dist: 0.5 });
    });
    k.note('The cam turns with constant angular velocity θ̇ = k; the angle between the pin line and the axis of the cam is θ.', () => {
      k.angle(Op, g.polar(Op, a, om), k.pt(0, a), { label: 'θ', arrow: true, r: 1.7, labelDist: 1.3 });
    });
  }
});

/* Fig. 5, page 6 — two similar crossed parallelograms. O and A are fixed, AO = a. AB = OD = b, AO = BD = CP = a,
   BP = DC = c, a² = bc, so b = (√2 − 1)a, c = (√2 + 1)a. D lies on the line CO beyond O, with OD = b and OC = c − b = 2a.
   At all times the angle PCO = θ = angle COX and the point P describes a cardioid: P = C − a e^{2iθ} = a(2e^{iθ} − e^{2iθ}). */
Curves.figure({
  id: 'fig-005',
  section: 'cardioid',
  page: 6,
  title: 'The cardioid traced by two crossed parallelograms',
  tags: ['mechanism', 'linkage', 'crossed parallelogram'],
  build(k) {
    const g = k.g, a = 100, b = a * (Math.SQRT2 - 1), th = g.deg(46.7);
    const O = k.pt(0, 0), A = k.pt(-a, 0);
    const C = g.polar(O, 2 * a, th), D = g.polar(O, -b, th);
    const P = g.add(C, g.polar(k.pt(0, 0), a, 2 * th + Math.PI));
    const B = g.circleCircle(A, b, D, a).sort((p, q) => q.y - p.y)[0];
    const f = k.curves.cardioid(a);
    k.frame(-1.5 * a, -1.15 * a, 2.2 * a, 2.55 * a);

    const bar = (p, q, h) => {
      const n = g.mul(g.unit(g.perp(g.sub(q, p))), h == null ? 0.062 * a : h);
      k.poly([g.add(p, n), g.add(q, n), g.sub(q, n), g.sub(p, n)], { close: true, fill: '#fff', width: 1.3 });
    };
    const ring = p => { k.circle(p, 0.108 * a, { fill: '#fff', width: 1.8 }); k.circle(p, 0.06 * a, { width: 1.8 }); };
    const block = p => k.poly([k.pt(p.x - 0.21 * a, p.y - 0.13 * a), k.pt(p.x + 0.21 * a, p.y - 0.13 * a), k.pt(p.x + 0.21 * a, p.y + 0.13 * a), k.pt(p.x - 0.21 * a, p.y + 0.13 * a)], { close: true, fill: '#fff', width: 1.3 });

    k.given('The two fixed pivots A and O on the line OX, AO = a, and the dashed circle of radius a about O: the fixed circle of the cardioid, which will pass through the cusp at (a, 0).', () => {
      k.seg(k.pt(-1.46 * a, 0), k.pt(2.05 * a, 0), { cls: 'cons', dash: '14 4 3 4', arrow: 'end' });
      k.label(k.pt(2.05 * a, 0), 'X', 'ne', { upright: true });
      k.circle(O, a, { cls: 'cons', dash: true, nobounds: true });
      block(A); block(O);
    });
    k.step('linkage', 'The first crossed parallelogram A, B, D, O: AB = OD = b and AO = BD = a. The bar OD (continued to C) turns about O, the bar AB about A.', () => {
      bar(A, B); bar(B, D); bar(O, D);
      ring(A); ring(B); ring(D); ring(O);
      k.dot(O, { r: 0.5 });
    });
    k.step('linkage', 'The second, similar parallelogram B, P, C, D: BP = DC = c and CP = BD = a, with a² = bc. D, O, C lie on one line, so C is the end of the bar DC that passes through the pivot O.', () => {
      bar(D, C); bar(B, P); bar(C, P);
      ring(C); ring(P); ring(B); ring(D); ring(O);
      k.dot(O, { r: 0.5 });
    });
    k.note('The angles: at all times the angle PCO = θ = the angle COX (and the angle PBD = θ). The dashed circle about C of radius a (the rolling circle) touches the fixed circle on the line OC.', () => {
      k.circle(C, a, { cls: 'cons', dash: true, nobounds: true });
      k.angle(O, k.pt(1, 0), C, { label: 'θ', r: 3.0, labelDist: 1.2 });
      k.angle(O, A, D, { label: 'θ', r: 2.6, labelDist: 1.2 });
      k.angle(B, D, P, { label: 'θ', r: 1.6, labelDist: 1.2 });
      k.angle(C, O, P, { label: 'θ', r: 1.6, labelDist: 1.2 });
      k.arc(C, 0.66 * a, g.deg(-77), g.deg(-48), { arrow: true, cls: 'given', nobounds: true, width: 1 });
      k.label(A, 'A', 'sw', { dist: 2.5 }); k.label(B, 'B', 'nw', { dist: 2.5 }); k.label(C, 'C', 'n', { dist: 2.6 });
      k.label(D, 'D', 's', { dist: 2.6 }); k.label(O, 'O', 'se', { dist: 2.6 }); k.label(P, 'P', 'ne', { dist: 2.6 });
    });
    k.step('pencil', 'The path of P is the cardioid with its cusp at (a, 0). It is drawn from the cusp upward to P, and below the axis (the arrow shows the sense of motion).', () => {
      k.curve(f, [g.deg(-45), th - 0.12], { n: 200, arrow: g.deg(25) });
    });
  }
});
