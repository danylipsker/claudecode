/* Curves Workshop · figures/involutes.js — Figs. 134(a), 134(b) (page 135) and 135 (page 137) */

/* Fig. 134(a), page 135 — all involutes of a curve are parallel curves. The book shows an evolute
   (a heavy arc), eleven tangents to it, and three involutes cutting every tangent: the strings
   unwound from the evolute, each longer than the last by a fixed length. The evolute here is a
   piece of an equiangular spiral (the parameters were fitted to the book's drawing: the involutes
   of that curve are again equiangular spirals, item (e) of the section). The unit is the pixel of
   the book's scan, which only fixes the proportions. */
Curves.figure({
  id: 'fig-134a',
  section: 'involutes',
  page: 135,
  title: 'The involutes of a curve are parallel curves',
  tags: ['involute', 'evolute', 'parallel curves', 'string'],
  note: 'The evolute is drawn as a piece of an equiangular spiral, which the book\'s arc closely matches; its tangents are taken at equal steps of the turning angle.',
  build(k) {
    const g = k.g;
    const pole = k.pt(596.7, -869.9), rL = 559.3, thL = g.deg(173.5), kk = 0.561;
    const E = u => { const th = thL - u, r = rL * Math.exp(-kk * u); return [pole.x + r * Math.cos(th), pole.y + r * Math.sin(th)]; };
    const u0 = 0.283, du = 0.1652, N = 11;                     // the eleven tangents, u_j = u0 + j du
    const uj = Array.from({ length: N }, (_, j) => u0 + j * du);
    const arc = (u1, u2) => g.arcLength(E, u1, u2, 300);        // length of the evolute between two parameters
    const uK = uj[N - 1];                                       // the point K where the string of the first involute ends
    const dL = [0, 210, 319];                                   // extra string lengths of involutes 1, 2, 3
    const frame = j => ({ p: E(uj[j]), T: g.frenet(E, uj[j]).T });
    const onTangent = (j, extra) => {                           // the point of the tangent j at the string length arc(u_j, K) + extra
      const f = frame(j), len = arc(uj[j], uK) + extra;
      return k.pt(f.p[0] + f.T.x * len, f.p[1] + f.T.y * len);
    };
    const involute = extra => u => {                           // the whole involute: the point at the parameter u
      const T = g.frenet(E, u).T, p = E(u), len = arc(u, uK) + extra;
      return [p[0] + T.x * len, p[1] + T.y * len];
    };

    k.given('The evolute: any curve, drawn heavy. Its tangents will be the stretched string.', () => {
      k.curve(E, [0, uK + 0.62], { cls: 'thick', n: 240 });
      k.text(370, -632, 'evolute', { size: 0.9 });
    });
    k.step('straightedge', 'Draw the tangents to the evolute at a series of points, here at equal steps of the turning angle. Each one is a position of the straight part of the string.', () => {
      for (let j = 0; j < N; j++) k.seg(k.pt(...E(uj[j])), onTangent(j, dL[2]), { cls: 'cons' });
    });
    const K = k.pt(...E(uK));
    k.step('dividers', 'Fix the end of the string at K, a point of the evolute. On every tangent lay off, from the point of tangency, the length of the arc of the evolute from there to K (the arc is rectified by stepping it off in short chords). These points belong to the first involute.', () => {
      for (let j = 0; j < N; j++) k.dot(onTangent(j, 0), { open: true, r: 1.1 });
    });
    k.step('dividers', 'Lengthen the string by a fixed amount: lay the same extra length beyond the first points on every tangent. This gives the second involute.', () => {
      for (let j = 0; j < N; j++) k.dot(onTangent(j, dL[1]), { open: true, r: 1.1 });
    });
    k.step('dividers', 'And once more, with a further extra length: the third involute.', () => {
      for (let j = 0; j < N; j++) k.dot(onTangent(j, dL[2]), { open: true, r: 1.1 });
    });
    k.step('pencil', 'Draw the three involutes through their points. Every tangent of the evolute cuts all of them at right angles and the same distance apart, so the involutes are parallel to each other.', () => {
      const a = uj[0] - 0.45 * du, b = uj[N - 1] + 0.45 * du;
      k.curve(involute(dL[0]), [a, uK], { n: 200 });
      k.curve(involute(dL[1]), [a, b], { n: 200 });
      k.curve(involute(dL[2]), [a, b], { n: 200 });
    });
  }
});

/* Fig. 134(b), page 135 — the involute of a circle. The point P is the end of the string TP of
   length at (the arc AT of the circle, unrolled), TP is tangent to the circle at T, so
   x = a(cos t + t sin t), y = a(sin t - t cos t). The book draws the angle t of about 62° at O
   and the same angle at T between the tangent and the vertical; the dashed right triangle with
   hypotenuse "at", the ordinate y of P, and the heavy curve with a cusp at A. */
Curves.figure({
  id: 'fig-134b',
  section: 'involutes',
  page: 135,
  title: 'The involute of a circle',
  tags: ['involute', 'circle', 'string', 'construction'],
  note: 'The book does not letter the point of contact; T is added here so that the steps can name it. The book draws t at about 62°; the drawing here uses 60° so that T is one of the division points.',
  build(k) {
    const g = k.g, a = 150, t = g.deg(60);
    const O = k.pt(0, 0), A = k.pt(a, 0);
    const T = g.polar(O, a, t);
    const tangent = u => g.dir(u - Math.PI / 2);                 // the direction of the string leaving the circle at the angle u
    const Pof = u => g.add(g.polar(O, a, u), g.mul(tangent(u), a * u));
    const P = Pof(t);
    const F = k.pt(P.x, 0), Cn = k.pt(T.x, P.y);
    const steps = [-45, -30, -15, 15, 30, 45, 60, 75, 90].map(g.deg);

    k.given('The circle of radius a, its centre O and the axes. A is the point of the circle on OX where the curve will start.', () => {
      k.axes(O, { x: [-a * 1.05, a * 1.89], y: [-a * 1.14, a * 1.12] });
      k.circle(O, a);
      k.point(O, 'O', { at: 'nw', open: true });
      k.point(A, 'A', { at: 'w', open: true });
    });
    k.step('dividers', 'Divide the circle into equal arcs of 15° from A, on both sides. The arc from A to each point is a·t, with t the angle at O.', () => {
      steps.forEach(u => k.dot(g.polar(O, a, u), { open: true, r: 0.7 }));
      k.point(T, 'T', { at: 'w', open: true });
    });
    k.step('square', 'At each division point draw the tangent to the circle (perpendicular to the radius). Each tangent is a position of the unwinding string.', () => {
      steps.forEach(u => {
        const Tu = g.polar(O, a, u), Pu = Pof(u);
        k.seg(Tu, g.along(Pu, Tu, -a * 0.08), { cls: 'cons' });
      });
    });
    k.step('dividers', 'On each tangent lay off from its point of contact the length of the arc from A, a·t (rectify the arc with the dividers in short chords). The end of the string is a point of the involute.', () => {
      steps.forEach(u => k.dot(Pof(u), { open: true, r: 0.8 }));
      k.dot(A, { open: true });
    });
    k.step('pencil', 'Draw the involute through the points: it starts at A with a cusp, where it is perpendicular to the circle, and winds outward on both sides.', () => {
      k.curve(k.curves.involuteOfCircle(a), [-0.9, 1.55], { n: 240 });
    });
    k.note('P is the point for the angle t. The tangent TP has length at, the dashed right triangle on it has the angle t at T, and y is the ordinate of P: x = a(cos t + t sin t), y = a(sin t − t cos t).', () => {
      k.seg(O, T, { cls: 'cons', dash: true });
      k.dim(O, T, 'a', { dist: 1.1 });
      k.angle(O, A, T, { label: 't', r: 1.3, labelDist: 1.1 });
      k.seg(T, g.along(T, P, g.dist(T, P) + a * 0.22), { cls: 'given' });
      k.dim(T, P, 'at', { dist: 1.0 });
      k.seg(T, Cn, { cls: 'cons', dash: true });
      k.seg(Cn, P, { cls: 'cons', dash: true });
      k.angle(T, Cn, P, { label: 't', r: 1.1, labelDist: 1.2 });
      k.seg(F, P, { cls: 'cons', dash: true });
      k.dim(F, P, 'y', { side: 'right', dist: 1.0 });
      k.point(P, 'P', { at: 'nw', open: true });
    });
  }
});

/* Fig. 135, page 137 — involute gear teeth. Two circles with fixed centres O1, O2 (pivots, drawn
   as the book does) on the line of centres. The line CC is the common internal tangent (the line
   of action); it cuts the line of centres at P (the pitch point, dividing O1O2 in the ratio of the
   radii). Each tooth profile through P is the involute of its own base circle unwound from the
   tangent line; the two involutes touch at P because both have their normal along CC. The book
   draws the other flank and the tip of each tooth dashed, and an arrow for each rotation.
   Drawn in the unit of the book's scan (pixels of the 2x close-up). */
Curves.figure({
  id: 'fig-135',
  section: 'involutes',
  page: 137,
  title: 'Involute gear teeth: the base circles, the line of action and the profiles in contact',
  tags: ['involute', 'gear', 'mechanism', 'tangent'],
  note: 'The book draws only the arcs of the base circles that show on the page, and the flanks of the teeth dashed.',
  build(k) {
    const g = k.g;
    const R1 = 303, R2 = 224, d = 750;
    const O1 = k.pt(183, -338), O2 = k.pt(183 + d, -338);
    const P = g.lerp(O1, O2, R1 / (R1 + R2));                     // pitch point: O1P : PO2 = R1 : R2
    const C1 = g.tangentPoints(P, O1, R1).reduce((p, q) => (q.y > p.y ? q : p));
    const C2 = g.tangentPoints(P, O2, R2).reduce((p, q) => (q.y < p.y ? q : p));
    const u1 = g.dist(C1, P) / R1, u2 = g.dist(C2, P) / R2;       // the unwound angles (string = R u)
    const th1 = g.angleOf(g.sub(C1, O1)) - u1;                     // where each involute leaves its circle
    const th2 = g.angleOf(g.sub(C2, O2)) - u2;
    const inv = (O, R, th0) => u => k.pt(O.x + R * (Math.cos(th0 + u) + u * Math.sin(th0 + u)), O.y + R * (Math.sin(th0 + u) - u * Math.cos(th0 + u)));
    const invB = (O, R, thB) => u => k.pt(O.x + R * (Math.cos(thB - u) - u * Math.sin(thB - u)), O.y + R * (Math.sin(thB - u) + u * Math.cos(thB - u)));
    const tip1 = 498, tip2 = 363;                                  // the tip radii of the two teeth
    const ut1 = Math.sqrt(Math.pow(tip1 / R1, 2) - 1), ut2 = Math.sqrt(Math.pow(tip2 / R2, 2) - 1);
    const pa = (u, th0) => th0 + u - Math.atan(u);                 // polar angle of the involute point at the unwound angle u
    const w = g.deg(24);                                           // angular width of the tip land
    const A1 = pa(ut1, th1), A2 = pa(ut2, th2);                    // polar angles of the tips of the full-line flanks
    const thB1 = A1 + w + (ut1 - Math.atan(ut1));                  // where the dashed flank leaves the circle
    const thB2 = A2 + w + (ut2 - Math.atan(ut2));
    const f = fn => t => { const p = fn(t); return [p.x, p.y]; };

    k.given('The two fixed centres (pivots) on the line of centres.', () => {
      k.seg(k.pt(O1.x - 53, O1.y), k.pt(O2.x + 52, O2.y), { cls: 'given', dash: true });
      k.pivot(O1);
      k.pivot(O2);
    });
    k.step('compass', 'The base circles of the two gears, about the centres, with radii in the ratio of the speeds they are to turn at.', () => {
      k.arc(O1, R1, g.deg(-104), g.deg(106), { cls: 'thick' });
      k.arc(O2, R2, g.deg(62), g.deg(295), { cls: 'thick' });
    });
    k.step('straightedge', 'The common internal tangent of the two circles touches them at C and C and cuts the line of centres at P, which divides O1O2 in the ratio of the radii. This is the line of action, the line along which the teeth will push.', () => {
      k.seg(C1, C2, { cls: 'given', dash: true });
      k.dot(C1, { open: true, r: 0.9 });
      k.dot(C2, { open: true, r: 0.9 });
      k.label(C1, 'C', 'ne');
      k.label(C2, 'C', 'sw');
      k.point(P, 'P', { at: 'nw', open: true });
    });
    k.step('pencil', 'Roll the tangent line on the left circle (or unwind a string from it): its point P draws the involute of that circle. Draw it from the circle past P to the tip of the tooth.', () => {
      k.curve(f(inv(O1, R1, th1)), [0, ut1], { cls: 'thick', n: 120 });
    });
    k.step('pencil', 'The same line, rolled on the right circle, gives the involute of that circle through P. The two profiles touch at P: both have the normal along the line of action, so a constant velocity ratio is transmitted.', () => {
      k.curve(f(inv(O2, R2, th2)), [0, ut2], { cls: 'thick', n: 120 });
    });
    k.note('The book completes each tooth with dashes: the tip of the tooth is an arc about the centre, the other flank an involute of the same circle turned the other way. The arrows show the senses of rotation.', () => {
      k.curve(f(invB(O1, R1, thB1)), [0, ut1], { cls: 'given', dash: true, n: 120 });
      k.arc(O1, tip1, A1, thB1 - (ut1 - Math.atan(ut1)), { cls: 'given', dash: true });
      k.curve(f(invB(O2, R2, thB2)), [0, ut2], { cls: 'given', dash: true, n: 120 });
      k.arc(O2, tip2, A2, A2 + w, { cls: 'given', dash: true });
      k.arc(O1, 265, g.deg(48), g.deg(83), { cls: 'given', arrow: true, nobounds: true });
      k.arc(O2, 199, g.deg(157), g.deg(118), { cls: 'given', cw: true, arrow: true, nobounds: true });
    });
  }
});
