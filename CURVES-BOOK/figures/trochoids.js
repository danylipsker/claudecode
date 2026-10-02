/* Curves Workshop · figures/trochoids.js — Figs. 207–210 (pages 233–236)
 *
 * Fig. 207  (p. 233)  the general epitrochoid: a rod carrying tracing points rigidly fixed to a rolling circle
 * Fig. 208  (p. 234)  the prolate and curtate cycloids of a wheel on a line
 * Fig. 209  (p. 235)  (a) the ellipse as a hypotrochoid, a = 2b; (b) the double generation: a larger circle rolling on a smaller
 * Fig. 210  (p. 236)  (a) the three-leaved rose by a rolling circle; (b) the polar equation of the general case
 */
(function () {
  const PI = Math.PI;

  /* ---------------------------------------------------------------------------------------------
     Fig. 207, page 233 — an epitrochoid. A circle of radius b rolls outside a fixed circle of radius a
     (centre O); T is the contact, A the centre of the rolling circle, t the angle between OT and OX.
     A rod fixed to the rolling circle carries tracing points P at the distances AP = k from A:
     x = m cos t − k cos(mt/b), y = m sin t − k sin(mt/b), m = a + b. Three points are shown: k < b
     (a curtate path), k = b (the epicycloid, with its cusp on the fixed circle), k > b (a prolate
     path with a loop). The picture shows the paths traced up to the position drawn.
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-207',
    section: 'trochoids',
    page: 233,
    title: 'The epitrochoid: a point rigidly attached to a rolling circle',
    tags: ['roulette', 'epitrochoid', 'rod'],
    note: 'The book shows a rod with three tracing points (distances about 0.5b, b and 1.6b from A) and the paths they have drawn. Here a = 150, b = 86, t = 37°.',
    build(k) {
      const g = k.g, a = 150, b = 86, m = a + b, t = g.deg(37);
      const O = k.pt(0, 0), ex = k.pt(1, 0), u = g.dir(t);
      const T = g.mul(u, a), A = g.mul(u, m), far = g.mul(u, m + b);
      const hs = [0.47 * b, b, 1.57 * b];
      const kk = hs[2], tx = 0.607, Xc = k.curves.epitrochoid(a, b, kk)(tx);   // the loop of the long path crosses the axis here
      const at = h => { const q = k.curves.epitrochoid(a, b, h)(t); return k.pt(q[0], q[1]); };
      const P = hs.map(at);

      k.given('The fixed circle of radius a with centre O and the axis OX; the tracing points start on the axis.', () => {
        k.arrow(k.pt(-a, 0), k.pt(1.82 * a, 0), { cls: 'axis' });
        k.circle(O, a, { width: 1.3 });
        k.arc(O, a, g.deg(93), g.deg(114), { cls: 'aux', hatch: 'in', nobounds: true });
        k.arc(O, a, g.deg(241), g.deg(266), { cls: 'aux', hatch: 'in', nobounds: true });
        k.point(O, 'O', { at: 'nw', open: true });
        k.label(k.pt(1.82 * a, 0), 'X', 'ne');
      });
      k.step('compass', 'Draw the rolling circle of radius b outside the fixed circle, touching it at T on the radius OT, at the angle t. Its centre A is on OT, at the distance a + b from O.', () => {
        k.seg(O, far, { cls: 'given', width: 1.2 });
        k.circle(A, b, { width: 1.3 });
        k.arc(A, 1.17 * b, g.deg(134), g.deg(166), { cls: 'given', arrow: true, nobounds: true });
        k.point(T, 'T', { at: 'w', open: true });
        k.dim(O, T, 'a', { dist: 1.1 });
        k.dim(T, A, 'b', { dist: 1.1 });
        k.dim(A, far, 'b', { dist: 1.1 });
        k.angle(O, ex, T, { label: 't', r: 1.2, labelDist: 1.3 });
      });
      k.step('linkage', 'Fix a rod to the rolling circle at its centre A, with tracing points at several distances AP = k: one inside the circle, one on it, one outside. The rod turns with the circle.', () => {
        k.bar(A, P[2]);
        k.dot(A, { open: true, r: 0.9 });
        k.dot(P[0], { r: 0.8 });
        k.dot(P[1], { r: 0.8 });
        k.dot(P[2], { open: true, r: 0.9 });
        k.label(A, 'A', 'nw', { dist: 1.3 });
        k.label(P[0], 'P', 'e', { dist: 1.4 });
        k.label(P[2], 'P', 'ne', { dist: 1.1 });
        k.text(-62, 1.27 * a, 'AP = k', { anchor: 'start', size: 0.95 });
      });
      k.step('pencil', 'As the circle rolls, each tracing point draws its own path: a curtate path for k < b, the epicycloid with a cusp on the fixed circle for k = b, a prolate path with a loop for k > b (the loop crosses the axis again at the last dot). The three paths start on the axis at the distances a + b − k from O.', () => {
        hs.forEach(h => {
          k.curve(k.curves.epitrochoid(a, b, h), [-1.0, t], { n: 160 });
          k.dot(k.pt(m - h, 0), { open: true, r: 0.9 });
        });
        k.dot(k.pt(Xc[0], Xc[1]), { open: true, r: 0.9 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 208, page 234 — the prolate and curtate cycloids: the paths of points rigidly attached to a
     wheel (radius a) rolling on a line. The point is at the distance k from the hub: k = a gives the
     cycloid, k < a the curtate cycloid, k > a the prolate cycloid (with loops). Coordinates: the line is
     y = 0; the left vertical is the lowest position of the tracing point, t = 0.
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-208',
    section: 'trochoids',
    page: 234,
    title: 'The prolate and curtate cycloids',
    tags: ['roulette', 'cycloid', 'trochoid', 'rod'],
    note: 'The book uses a rod with a tracing point at 0.5a (curtate), at a (the cycloid) and at 2a (prolate) from the hub; the wheel is drawn after a turn of about 2.4 radians.',
    build(k) {
      const g = k.g, a = 100, L = 2 * PI * a, tw = 2.4;
      const tro = h => k.curves.trochoid(a, h);
      const Cw = k.pt(a * tw, a);
      const at = h => { const q = tro(h)(tw); return k.pt(q[0], q[1]); };
      const t0 = 1.8955;                                         // the loop of the prolate cycloid closes where a t = 2a sin t
      const yNode = a + 2 * a * Math.cos(PI - t0);               // height of the node of the loops (k = 2a)

      k.given('The line on which the wheel of radius a rolls, and the wheel with its hub, in the position reached after it has turned through about 2.4 radians.', () => {
        k.seg(k.pt(-1.1 * a, 0), k.pt(7.5 * a, 0), { cls: 'given' });
        k.circle(Cw, a);
        k.circle(Cw, 0.17 * a);
        k.pivot(Cw);
      });
      k.step('linkage', 'Fix a rod to the hub with tracing points at 0.5a, a and 2a from it: one inside the wheel, one on its rim, one outside.', () => {
        k.bar(Cw, at(2 * a));
        k.dot(at(0.5 * a), { r: 0.9 });
        k.dot(at(a), { r: 0.9 });
        k.dot(at(2 * a), { open: true, r: 0.9 });
      });
      k.step('note', 'The thin vertical lines mark where the tracing point is lowest: the wheel then stands on the line with the point directly below the hub (or, for k = a, in contact with the line).', () => {
        [0, L].forEach(x => {
          k.seg(k.pt(x, -1.15 * a), k.pt(x, 2.4 * a), { cls: 'aux' });
          k.dot(k.pt(x, 0), { open: true, r: 0.9 });
          k.dot(k.pt(x, yNode), { open: true, r: 0.9 });
        });
      });
      k.step('pencil', 'The paths, drawn point by point or by rolling: the curtate cycloid (the wavy curve), the ordinary cycloid with its cusps on the line, and the prolate cycloid with a loop below the line for each turn.', () => {
        k.curve(tro(2 * a), [-2.15, 2 * PI + 2.15], { n: 400 });
        k.curve(tro(a), [-1.29, 2 * PI + 1.29], { n: 300 });
        k.curve(tro(0.5 * a), [-1.0, 2 * PI + 1.0], { n: 300 });
        k.label(k.pt(L / 2, 2 * a + 0.4 * a), 'prolate', 's', { upright: true, size: 0.8, dist: -1.2 });
        k.label(k.pt(L / 2 + 120, a * 1.5 - 4), 'curtate', 'ne', { upright: true, size: 0.8, dist: 0.2 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 209(a), page 235 — the ellipse as a hypotrochoid with a = 2b. The rolling circle (radius a/2)
     passes through the centre O of the fixed circle (radius a); T is the contact, OT the diameter, and
     the angle TOX = θ. P, the point of the rolling circle on OX, and Q, its point on OY, are the ends of
     a diameter (PQ), and the angle TCP at the centre C is 2θ. P started at X and always stays on OX
     (arc TP = arc TX), Q stays on OY: the rolling circle is a trammel of Archimedes.
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-209a',
    section: 'trochoids',
    page: 235,
    title: 'The ellipse as a hypotrochoid (a = 2b)',
    tags: ['roulette', 'hypotrochoid', 'ellipse', 'trammel'],
    note: 'The book leaves the ellipse of F undrawn; it is added in the last step. G is a general point of the rolling circle.',
    build(k) {
      const g = k.g, a = 150, b = a / 2, th = g.deg(32);
      const O = k.pt(0, 0), ex = k.pt(1, 0), C = g.polar(O, b, th), T = g.polar(O, a, th);
      const P = k.pt(a * Math.cos(th), 0), Q = k.pt(0, a * Math.sin(th)), X = k.pt(a, 0);
      const F = g.lerp(C, Q, 0.616), G = k.pt(62, 93);
      const d = g.dist(C, F);

      k.given('The fixed circle of radius a with its centre O, the axes OX and OY, and X where the tracing point P starts.', () => {
        k.seg(k.pt(-1.04 * a, 0), k.pt(1.17 * a, 0), { cls: 'axis' });
        k.seg(k.pt(0, -a), k.pt(0, a), { cls: 'axis' });
        k.circle(O, a);
        [[109, 129], [210, 228], [-66, -54]].forEach(h => k.arc(O, a, g.deg(h[0]), g.deg(h[1]), { cls: 'aux', hatch: 'in', nobounds: true }));
        k.pivot(O);
        k.label(O, 'O', 'sw');
        k.point(X, 'X', { at: 'ne', open: true });
        k.text(-73, 12, 'a', { upright: false });
      });
      k.step('compass', 'Draw the rolling circle: its radius is a/2, so it passes through O. Its centre C is a/2 from O, in the direction θ, and T, the other end of the diameter OT, is the point of contact.', () => {
        k.circle(C, b);
        k.seg(O, T, { cls: 'given', dash: true });
        k.point(T, 'T', { at: 'ne', open: true });
        k.dim(O, C, 'a/2', { dist: 1.2 });
        k.dot(C, { open: true, r: 0.9 });
        k.arc(C, 1.15 * b, g.deg(-66), g.deg(-112), { cls: 'given', cw: true, arrow: true, nobounds: true });
        k.angle(O, ex, C, { label: 'θ', r: 1.2, labelDist: 1.45 });
      });
      k.step('straightedge', 'The rolling circle meets the axes again at P (on OX) and Q (on OY); the angles at O are right angles, so PQ is a diameter. P was at X when the rolling began, and it stays on OX; Q stays on OY.', () => {
        k.seg(O, P, { cls: 'given', dash: true });
        k.seg(O, Q, { cls: 'given', dash: true });
        k.seg(Q, P, { cls: 'given', dash: true });
        k.point(P, 'P', { at: 'se', open: true });
        k.point(Q, 'Q', { at: 'nw', open: true });
        k.angle(C, P, T, { label: '2θ', r: 0.9, labelDist: 1.55 });
      });
      k.note('F is a point of the diameter PQ, G any other point of the rolling circle: both are carried along with it.', () => {
        k.dot(F, { r: 1.2 });
        k.dot(G, { r: 1.4 });
        k.label(F, 'F', 'ne', { dist: 1.1 });
        k.label(G, 'G', 'e', { dist: 1.1 });
      });
      k.step('pencil', 'F describes an ellipse with semi-axes b + d and b − d along OY and OX (d = CF): the path of a point of a trammel. (The book does not draw it.)', () => {
        k.curve(k.curves.hypotrochoid(a, b, -d), [0, 2 * PI], { n: 160 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 209(b), page 235 — the double generation theorem for the case a = 2b. The smaller circle
     (radius a/2, centre C0) is fixed and the larger circle (radius a, centre O) rolls round it, touching
     it internally at T; O stays on the small circle. Any diameter RX of the large circle passes
     through the fixed point P of the small circle. A point S of the diameter is at a constant distance
     from O on a line through P, so it describes a limaçon (the cardioid for R, which is on the circle).
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-209b',
    section: 'trochoids',
    page: 235,
    title: 'Double generation: the larger circle rolling on the smaller',
    tags: ['double generation', 'limaçon', 'cardioid', 'roulette'],
    note: 'The loci of S and R are not drawn in the book; they are added in the last step.',
    build(k) {
      const g = k.g, a = 150, b = a / 2, ga = g.deg(28.2);
      const O = k.pt(0, 0), C0 = g.polar(O, b, ga), T = g.polar(O, a, ga);
      const P = k.pt(a * Math.cos(ga), 0), X = k.pt(a, 0), R = k.pt(-a, 0);
      const Si = k.pt(-0.56 * a, 0), So = k.pt(-1.25 * a, 0);

      k.given('The smaller circle, of radius a/2, held fixed; O is a point of it, and P is the second point where the line OX meets it.', () => {
        k.circle(C0, b);
        [[80, 110], [-3, 22], [-98, -70]].forEach(h => k.arc(C0, b, g.deg(h[0]), g.deg(h[1]), { cls: 'aux', hatch: 'in', nobounds: true }));
        k.seg(So, k.pt(1.19 * a, 0), { cls: 'axis' });
        k.seg(O, P, { cls: 'given', dash: true });
        k.point(O, 'O', { at: 's', open: true });
        k.pivot(P);
        k.label(P, 'P', 'sw', { dist: 1.7 });
      });
      k.step('compass', 'The larger circle, of radius a with centre O, touches the small circle at T on the line OC0 (T is a from O). It rolls round the small one, always touching it inside, with O staying on the small circle.', () => {
        k.circle(O, a);
        k.dot(T, { open: true, r: 0.9 });
        k.arc(O, 1.09 * a, g.deg(-10.7), g.deg(-38), { cls: 'given', cw: true, arrow: true, nobounds: true });
      });
      k.step('straightedge', 'The diameter RX of the large circle lies on the line OP in this position, and in every position it passes through P. Mark R and X, and points S on the diameter.', () => {
        k.point(R, 'R', { at: 'ne', open: true });
        k.point(X, 'X', { at: 'ne', open: true });
        k.point(Si, 'S', { at: 'n', open: true });
        k.point(So, 'S', { at: 'n', open: true });
      });
      k.step('pencil', 'Since SO is a fixed length and the line SO always passes through the fixed point P, S describes a limaçon with pole P: r = σ − a cos(ρ + γ), σ being the signed distance OS. For R on the rolling circle (σ = −a) the limaçon becomes a cardioid with its cusp at P.', () => {
        // S = P + (σ − a cos(ρ + γ0)) e(ρ): a limaçon with its pole at P; |σ| = a gives the cardioid
        const loc = sg => rho => { const r = sg - a * Math.cos(rho + ga); return [P.x + r * Math.cos(rho), P.y + r * Math.sin(rho)]; };
        [-0.56 * a, -a].forEach(sg => k.curve(loc(sg), [0, 2 * PI], { n: 360 }));
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 210(a), page 236 — the three-leaved rose as a hypotrochoid. 3b = a: a circle of radius b (the
     black disc) rolls inside the fixed circle of radius a = 3b; the tracing point is at the distance
     k = 2b from its centre, so the path is the rose r = 4b cos 3θ (rotated so that a petal points to the
     left). Rolling circle of radius (n − 1)A/(2(n + 1)) in a circle of radius nA/(n + 1), point A/2 from its
     centre, gives r = A cos nθ; here n = 3 and A = 4b.
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-210a',
    section: 'trochoids',
    page: 236,
    title: 'The three-leaved rose as a hypotrochoid',
    tags: ['roulette', 'hypotrochoid', 'rose'],
    note: 'The book fills the rolling circle black. Its path r = A cos 3θ, with A = 4b, has its tips outside the fixed circle.',
    build(k) {
      const g = k.g, a = 150, b = 50, kk = 2 * b, t0 = g.deg(20);
      const O = k.pt(0, 0);
      const f = t => [(a - b) * Math.cos(t) - kk * Math.cos((a - b) * t / b), (a - b) * Math.sin(t) + kk * Math.sin((a - b) * t / b)];
      const p0 = f(t0), P0 = k.pt(p0[0], p0[1]), C0 = g.polar(O, a - b, t0);
      const tip = ang => g.polar(O, 4 * b, ang);

      k.given('The fixed circle of radius a = 3b with its centre O.', () => {
        k.circle(O, a);
        [[101, 131], [246, 264]].forEach(h => k.arc(O, a, g.deg(h[0]), g.deg(h[1]), { cls: 'aux', hatch: 'in', nobounds: true }));
        k.dot(O, { open: true, r: 0.9 });
        k.text(-1.7 * b, -1.35 * b, '3b = a', { upright: true, size: 0.95 });
      });
      k.step('compass', 'The rolling circle, of radius b = a/3, inside the fixed circle: its centre is on the circle of radius a − b about O, here at the angle 20°. (The book fills it in black.)', () => {
        k.circle(C0, b, { fill: '#171717' });
        k.arc(C0, 1.2 * b, g.deg(262), g.deg(213), { cls: 'given', cw: true, arrow: true, nobounds: true });
      });
      k.step('linkage', 'A rod carries the tracing point at 2b from the centre of the rolling circle.', () => {
        const dirv = g.unit(g.sub(P0, C0));
        k.seg(g.add(C0, g.mul(dirv, b * 0.92)), P0, { cls: 'thick', w: 3.4 });
        k.dot(P0, { open: true, r: 0.8 });
      });
      k.step('straightedge', 'The three axes of the rose: lines through O at 60°, 180° and 300°. The tips of the petals lie on them, at the distance 4b = (4/3)a.', () => {
        [60, 180, 300].forEach(d => k.seg(O, tip(g.deg(d)), { cls: 'cons' }));
        k.dot(tip(g.deg(60)), { open: true, r: 1.4 });
        k.dot(tip(g.deg(300)), { open: true, r: 1.4 });
      });
      k.step('pencil', 'The path of the tracing point is the three-leaved rose r = 4b cos 3θ. Each petal is drawn while the rolling circle goes one third of the way round.', () => {
        k.curve(f, [0, 2 * PI], { n: 360, arrow: [g.deg(30), g.deg(150), g.deg(262)] });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------
     Fig. 210(b), page 236 — the hypotrochoid in polar coordinates. Fixed circle (O, a), rolling circle
     (A, b) touching it at B; α = angle BOX... here OA makes the angle α with the initial line (through O and a
     maximum point of the curve); the tracing point P is at the distance AP = OA = a − b from A, at the
     polar angle −θ. The rolling condition is aα = bβ; the isosceles triangle OAP gives
     β = 2(α + θ) = (a/b)α, so α = 2bθ/(a − 2b), and r = OP = 2(a − b)cos(α + θ) = 2(a − b)cos(aθ/(a − 2b)).
     The book's proportions a = 3b, α about 40°.
  --------------------------------------------------------------------------------------------- */
  Curves.figure({
    id: 'fig-210b',
    section: 'trochoids',
    page: 236,
    title: 'The rose in polar coordinates: the angles α, β, θ',
    tags: ['roulette', 'hypotrochoid', 'rose', 'polar'],
    note: 'In the book a = 3b and the angle α is about 40°; the same values are used here (b = 60).',
    build(k) {
      const g = k.g, b = 60, a = 3 * b, al = g.deg(40);
      const th = (a - 2 * b) * al / (2 * b);
      const O = k.pt(0, 0), ex = k.pt(1, 0), u = g.dir(al);
      const A = g.mul(u, a - b), B = g.mul(u, a), E = g.mul(u, a - 2 * b);
      const r = 2 * (a - b) * Math.cos(al + th), P = k.pt(r * Math.cos(th), -r * Math.sin(th));
      const rose = x => { const rr = 2 * (a - b) * Math.cos(a * x / (a - 2 * b)); return [rr * Math.cos(x), rr * Math.sin(x)]; };

      k.given('The fixed circle (only an arc is needed), its centre O, and the initial line OX, which passes through a maximum point of the path.', () => {
        k.arc(O, a, g.deg(-30), g.deg(103), { cls: 'given' });
        k.arc(O, a, g.deg(82), g.deg(95), { cls: 'aux', hatch: 'in', nobounds: true });
        k.arc(O, a, g.deg(4), g.deg(23), { cls: 'aux', hatch: 'in', nobounds: true });
        k.seg(O, k.pt(1.43 * a, 0), { cls: 'axis' });
        k.pivot(O);
        k.label(O, 'O', 's', { dist: 1.2 });
      });
      k.step('compass', 'The rolling circle, of radius b, touches the fixed circle inside at B, with OB = a. Its centre A is on OB, so OA = a − b; the angle BOX is α.', () => {
        k.seg(O, B, { cls: 'given' });
        k.circle(A, b);
        k.arc(A, 1.19 * b, g.deg(158), g.deg(122), { cls: 'given', cw: true, arrow: true, nobounds: true });
        k.dot(A, { open: true, r: 0.9 });
        k.point(B, 'B', { at: 'ne', open: true });
        k.label(A, 'A', 'nw', { dist: 1.2 });
        k.dim(O, E, 'a−2b', { dist: 1.1 });
        k.dim(E, A, 'b', { side: 'right', dist: 1.1 });
        k.dim(A, B, 'b', { side: 'right', dist: 1.1 });
        k.angle(O, ex, A, { label: 'α', r: 1.6, labelDist: 1.3 });
      });
      k.step('compass', 'P is the tracing point, at the distance AP = OA = a − b from A (drawn with the compass about A). Join A to P and O to P: the triangle OAP is isosceles, so its angles at O and P are equal, α + θ, where θ is the angle of OP with the initial line, below it.', () => {
        k.seg(A, P, { cls: 'given' });
        k.seg(O, P, { cls: 'given', dash: true });
        k.point(P, 'P', { at: 's', open: true });
        k.label(g.lerp(O, P, 0.62), 'r', 'n', { dist: 1.3 });
        k.angle(O, P, ex, { label: 'θ', r: 2.2, labelDist: 1.2 });
        k.angle(P, A, O, { label: 'α+θ', r: 1.3, labelDist: 2.0 });
      });
      k.note('At A the angle β between AB and AP is 2(α + θ); rolling without slipping gives aα = bβ, hence α = 2bθ / (a − 2b).', () => {
        k.angle(A, P, B, { label: 'β', r: 1.0, labelDist: 1.7 });
      });
      k.step('pencil', 'The path of P in polar coordinates: r = 2(a − b) cos(α + θ) = 2(a − b) cos(aθ/(a − 2b)). The little stub left of O is the continuation through the pole, and the arrow shows the direction of tracing.', () => {
        k.curve(rose, [-PI / 6 - 0.075, 0.12], { n: 160, arrow: -0.2, cw: true });
      });
    }
  });
})();
