/* Curves Workshop · figures/envelopes.js — Figs. 70–77 (pages 75–80)
 *
 * 70  the slopes of a differential equation of the second degree (two integral curves through a point)
 * 71  y = px + 4/p: the tangents of the parabola y² = 16x      72  lines whose intercepts have a constant sum
 * 73  the astroid as the envelope of Archimedes' trammel        74  the ellipses ab = k and their envelope
 * 75  folding the conics: ellipse, hyperbola, parabola          76  M² = L·N, a conic with two tangents and their chord
 * 77  the cycloids normal to F = 0 and their envelope E = 0
 */
(function () {
  'use strict';

  /* a crease: the perpendicular bisector of P P' (the fold that carries P onto P') */
  function crease(g, P, Pp) {
    const mid = g.mid(P, Pp), d = g.unit(g.perp(g.sub(Pp, P)));
    return { mid, d, a: mid, b: g.add(mid, d) };
  }

  /* ------------------------------------------------------------------ Fig. 70, page 75 */
  /* The book draws a lattice of points with the slopes p that the differential equation f(x, y, p) = 0 gives
     there: two crossing segments at most points, a single segment on a curve, and no point beyond it. The
     drawing is a sketch; here the equation is (p − e'(x))² = κ(y − e(x)), whose slopes are real above the
     curve y = e(x), coincide on it and are imaginary below it: y = e(x) is a solution of the equation and the
     envelope of its other integral curves. */
  Curves.figure({
    id: 'fig-070',
    section: 'envelopes',
    page: 75,
    title: 'Two slopes at every point: the envelope is where they coincide',
    tags: ['envelope', 'differential equation', 'slope'],
    note: 'The book draws a lattice of points with their slopes as a sketch. Here the slopes come from the equation (p − e′(x))² = κ(y − e(x)): two real slopes above the curve y = e(x), one on it, none below it.',
    build(k) {
      const X0 = 773, m = 115, c0 = 810.5, kappa = 0.008, half = 52;
      const e = x => c0 - m * Math.log(X0 - x);
      const de = x => m / (X0 - x);
      const O = k.pt(0, 0);
      const D = [[160, 183], [305, 272], [170, 373], [440, 406], [263, 472], [542, 578], [341, 608], [365, 741], [600, 762]];
      const S = [331, 512, 668, 755].map(x => k.pt(x, e(x)));
      const slopes = P => { const w = Math.sqrt(kappa * (P.y - e(P.x))); return [de(P.x) + w, de(P.x) - w]; };
      const dash = (P, p) => { const u = k.g.unit(k.pt(1, p)); k.seg(k.g.add(P, k.g.mul(u, -half)), k.g.add(P, k.g.mul(u, half)), { cls: 'cons' }); };
      k.given('The axes, and a number of points of the plane. A differential equation of the second degree, f(x, y, p) = 0 with p = dy/dx, gives two values of p at each point.', () => {
        k.axes(O, { x: [-210, 810], y: [-290, 995] });
        k.dot(O, { open: true, r: 1.5 });
        D.forEach(d => k.dot(k.pt(d[0], d[1]), { open: true, r: 0.7 }));
        S.forEach(P => k.dot(P, { open: true, r: 0.7 }));
      });
      k.step('protractor', 'Through each point lay off the two directions given by its two values of p (the slopes of the two integral curves that pass through it).', () => {
        D.forEach(d => { const P = k.pt(d[0], d[1]); slopes(P).forEach(p => dash(P, p)); });
      });
      k.step('protractor', 'Where the two values of p are equal there is a single direction: the two integral curves touch. These are the points of the envelope.', () => {
        S.forEach(P => dash(P, de(P.x)));
      });
      k.step('pencil', 'Draw the curve through the points with a single slope: the locus of equal values of p, the envelope of the family of integral curves. It satisfies the differential equation and touches an integral curve at each of its points.', () => {
        k.curve(x => [x, e(x)], [250, 760], { n: 160 });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 71, page 76 */
  /* y = px + 4/p crosses the axes at (−4/p², 0) and (0, 4/p); the lines for p and −p meet on the x-axis.
     The envelope y² = 16x touches the line at (4/p², 8/p). The unit is 40. */
  Curves.figure({
    id: 'fig-071',
    section: 'envelopes',
    page: 76,
    title: 'The tangents y = px + 4/p and their envelope, the parabola y² = 16x',
    tags: ['envelope', 'parabola', 'Clairaut'],
    build(k) {
      const g = k.g, U = 40;
      const O = k.pt(0, 0), P = (x, y) => k.pt(U * x, U * y);
      const ps = [3 / 4, 1, 3 / 2, 3];
      const line = (p, sg) => {                               // the line y = (sg p) x + sg 4/p, from its x-intercept past the point of contact
        const xi = -4 / (p * p), xt = 4 / (p * p) + (p > 2 ? 3.5 : 2.6);
        return [P(xi - 0.25, sg * p * (xi - 0.25) + sg * 4 / p), P(xt, sg * p * xt + sg * 4 / p)];
      };
      k.given('The axes. Every line y = px + 4/p crosses OX at x = −4/p² and OY at y = 4/p; the line for −p is its mirror image in OX.', () => {
        k.axes(O, { x: [-100, 480], y: [-520, 520] });
        k.dot(O, { open: true, r: 1.6 });
      });
      ps.forEach(p => {
        k.step('straightedge', 'p = ' + (p === 0.75 ? '3/4' : p === 1.5 ? '3/2' : p) + ': mark A at x = −4/p² on OX and B at y = ±4/p on OY, and join A to B. The two lines (for p and −p) cross on the axis at A.', () => {
          const A = P(-4 / (p * p), 0);
          [1, -1].forEach(sg => { const L = line(p, sg); k.seg(L[0], L[1], { cls: 'cons' }); });
          k.dot(A, { open: true, r: 0.9 });
        });
      });
      k.step('pencil', 'Draw the parabola y² = 16x, vertex O: every line touches it, at x = 4/p², y = 8/p.', () => {
        k.curve(t => [U * t * t / 16, U * t], [-13, 13], { n: 200 });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 72, page 76 */
  /* Lines x/a + y/(1−a) = 1, intercepts a and 1 − a with a constant sum 1; the envelope is the parabola
     √x + √y = 1, which touches OX at (1, 0) and OY at (0, 1). The unit is 300. */
  Curves.figure({
    id: 'fig-072',
    section: 'envelopes',
    page: 76,
    title: 'Lines whose intercepts have a constant sum envelope the parabola √x + √y = 1',
    tags: ['envelope', 'parabola', 'intercepts'],
    build(k) {
      const U = 300, N = 8, O = k.pt(0, 0);
      const A = i => k.pt(U * i / N, 0), B = i => k.pt(0, U * (1 - i / N));
      k.given('The axes, and the unit length OX = OY = 1 (the constant sum of the intercepts).', () => {
        k.axes(O, { x: [-40, 340], y: [-40, 340] });
        k.dot(O, { open: true, r: 1.5 });
      });
      k.step('dividers', 'Divide the unit length on OX into eight equal parts, and do the same on OY. Pair the point at i/8 on OX with the point at 1 − i/8 on OY (the division numbered i from the far end).', () => {
        for (let i = 1; i < N; i++) { k.dot(A(i), { open: true, r: 0.6 }); k.dot(B(i), { open: true, r: 0.6 }); }
      });
      k.step('straightedge', 'Join each point of OX to its partner on OY. Each line has intercepts a and 1 − a, so the sum of its intercepts is 1.', () => {
        for (let i = 1; i < N; i++) k.seg(A(i), B(i), { cls: 'cons' });
      });
      k.step('pencil', 'The lines touch a parabola: draw it through the points of contact, √x + √y = 1, from (0, 1) to (1, 0) (the points x = (1 − t)², y = t²).', () => {
        k.curve(t => [U * (1 - t) * (1 - t), U * t * t], [0, 1], { n: 160 });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 73, page 77 */
  /* A rod of constant length 1 slides with its ends on the axes (the trammel of Archimedes): the segments
     from (0, b) to (a, 0) with a² + b² = 1 envelope x^{2/3} + y^{2/3} = 1, the astroid. The book hatches only
     the first quadrant with the rod's positions and draws the whole astroid. The unit is 300. */
  Curves.figure({
    id: 'fig-073',
    section: 'envelopes',
    page: 77,
    title: 'The astroid as the envelope of the trammel of Archimedes',
    tags: ['envelope', 'astroid', 'trammel'],
    build(k) {
      const U = 300, N = 14, O = k.pt(0, 0);
      const Bj = j => k.pt(0, U * j / N), Aj = j => k.pt(U * Math.sqrt(1 - (j / N) * (j / N)), 0);
      k.given('The two axes (thin lines) and the length of the rod: the unit OA = 1.', () => {
        k.seg(k.pt(-U * 1.12, 0), k.pt(U * 1.12, 0), { cls: 'given' });
        k.seg(k.pt(0, -U * 1.12), k.pt(0, U * 1.12), { cls: 'given' });
      });
      k.step('dividers', 'Divide OY (from 0 to 1) into fourteen equal parts and number the points B_1 … B_13 upwards.', () => {
        for (let j = 1; j < N; j++) k.dot(Bj(j), { open: true, r: 0.55 });
      });
      k.step('compass', 'Open the compass to the rod length 1. About each B_j draw a small arc cutting OX at A_j: the rod B_jA_j slides with its ends on the axes, and OA_j² + OB_j² = 1.', () => {
        for (let j = 1; j < N; j++) {
          const B = Bj(j), A = Aj(j), a0 = Math.atan2(A.y - B.y, A.x - B.x);
          k.arc(B, U, a0 - 0.045, a0 + 0.045, { cls: 'aux' });
          k.dot(A, { open: true, r: 0.55 });
        }
      });
      k.step('straightedge', 'Join each B_j to the A_j on the other axis: these are the positions of the rod. They crowd along a curve.', () => {
        for (let j = 1; j < N; j++) k.seg(Bj(j), Aj(j), { cls: 'cons' });
      });
      k.step('pencil', 'The envelope of all the positions, in all four quadrants, is the astroid x^{2/3} + y^{2/3} = 1, with its cusps on the axes at distance 1.', () => {
        k.curve(k.curves.astroid(U), [0, k.TAU], { n: 360 });
        k.text(0, -U * 1.2, 'x^{2/3} + y^{2/3} = 1', { upright: true, size: 0.9 });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 74, page 78 */
  /* Concentric coaxial ellipses x²/a² + y²/b² = 1 of constant area, ab = k. At each point of the envelope
     x²/a² = y²/b² = 1/2, so xy = ±k/2: four branches of the two hyperbolas x²y² = k²/4 (the book prints k³/2,
     which has the wrong dimensions). */
  Curves.figure({
    id: 'fig-074',
    section: 'envelopes',
    page: 78,
    title: 'Ellipses of equal area ab = k and their envelope, the hyperbolas xy = ±k/2',
    tags: ['envelope', 'ellipse', 'hyperbola'],
    note: 'The book prints the envelope as x²y² = k³/2; the algebra gives x²y² = k²/4 (the semi-axes touch the envelope at x = a/√2, y = b/√2, so xy = ab/2 = k/2). That is what is drawn.',
    build(k) {
      const a0 = 100, kk = a0 * a0, O = k.pt(0, 0);
      const steps = [-1.2, -0.9, -0.6, -0.3, 0, 0.3, 0.6, 0.9, 1.2];
      k.given('The axes. The ellipses x²/a² + y²/b² = 1 all have the same area, ab = k; here k = 100² and a runs through a series of values.', () => {
        k.axes(O, { x: [-355, 355], y: [-355, 355], labels: false });
      });
      k.step('pencil', 'Draw the ellipses with semi-axes a and b = k/a, a = 100·e^s for s = −1.2, −0.9 … 1.2: the longer a is, the thinner the ellipse. (Each is easy to draw with the two concentric circles of radii a and b.)', () => {
        steps.forEach(s => { const a = a0 * Math.exp(s); k.ellipse(O, a, kk / a, { cls: 'cons' }); });
      });
      k.step('pencil', 'The ellipses all touch four hyperbolic arcs: xy = ± k/2 (at the point of contact x = a/√2, y = b/√2). Draw them heavy: the envelope is the pair of hyperbolas x²y² = k²/4.', () => {
        const L = 350, x1 = kk / 2 / L;
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sy]) => {
          k.curve(t => { const x = x1 * Math.pow(L / x1, t); return [sx * x, sy * kk / 2 / x]; }, [0, 1], { n: 160 });
        });
        k.text(0, -375, 'xy = ± k/2', { upright: true, size: 0.9 });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 75, page 78 */
  const dashed = { cls: 'cons', dash: true };

  /* (a) P inside the circle (centre C, radius r): fold P onto P' of the circle; the crease cuts CP' at Q;
     QP = QP' = u, QC = v, u + v = r: Q lies on the ellipse with foci P and C. */
  Curves.figure({
    id: 'fig-075a',
    section: 'envelopes',
    page: 78,
    title: 'Folding a point inside a circle onto the circle: the creases envelope an ellipse',
    tags: ['paper folding', 'ellipse', 'envelope'],
    build(k) {
      const g = k.g, r = 500, C = k.pt(0, 0), P = k.pt(-300, 0);
      const Pp = g.polar(C, r, g.deg(113));
      const cr = crease(g, P, Pp);
      const Q = g.lineLine(cr.mid, cr.b, C, Pp);
      const ends = g.lineCircle(cr.mid, cr.b, C, r).sort((p, q) => p.x - q.x);
      const u = g.dist(P, Q), v = g.dist(Q, C);
      const M = g.mid(P, C), a = r / 2, c = g.dist(P, C) / 2, b = Math.sqrt(a * a - c * c);
      k.given('The fixed circle of radius r with centre C, and the point P inside it (wax paper, so that you can fold it).', () => {
        k.circle(C, r);
        k.point(C, 'C', { at: 's', r: 1.7 });
        k.point(P, 'P', { at: 's', r: 1.7 });
      });
      k.step('fold', 'Choose a point P\' on the circle and fold P over onto P\': the crease is the perpendicular bisector of PP\'. Press it flat and unfold; draw PP\' as a guide.', () => {
        k.seg(P, Pp, dashed);
        k.point(Pp, 'P\'', { at: 'n', open: true, r: 0.9 });
        k.seg(ends[0], ends[1], { cls: 'thick' });
      });
      k.step('straightedge', 'Draw CP\' to cut the crease at Q, and join Q to P. Q is on the crease, which is the perpendicular bisector of PP\', so QP = QP\' = u; with QC = v we have u + v = CP\' = r.', () => {
        k.seg(Pp, Q, dashed); k.seg(Q, C, dashed); k.seg(P, Q, dashed);
        k.point(Q, 'Q', { at: 'ne', open: true, r: 0.8 });
        k.label(g.mid(Pp, Q), 'u', 'e'); k.label(g.mid(P, Q), 'u', 's'); k.label(g.mid(Q, C), 'v', 'e');
        k.text(0, -r * 0.86, 'CP\' = r', { size: 0.8, upright: true });
      });
      k.note('The crease bisects the angle between the two focal radii QP and QP\' (the equal angles θ), so it is the tangent at Q.', () => {
        const dl = g.unit(g.sub(ends[0], Q));
        k.angle(Q, Pp, g.add(Q, dl), { label: 'θ', r: 1.1, labelDist: 1.35, cls: 'given' });
        k.angle(Q, g.add(Q, dl), P, { label: 'θ', r: 1.1, labelDist: 1.35, cls: 'given' });
      });
      k.step('fold', 'Move P\' round the circle, folding each time: the creases (dashed) are the tangents of one curve.', () => {
        for (let i = 0; i < 16; i++) {
          const q = g.polar(C, r, g.deg(7 + 22.5 * i + 0.4)), cc = crease(g, P, q), e2 = g.lineCircle(cc.mid, cc.b, C, r);
          if (e2.length === 2) k.seg(e2[0], e2[1], { cls: 'aux', dash: true });
        }
      });
      k.step('pencil', 'They envelope an ellipse with foci P and C and major axis r (u + v = r).', () => {
        const ang = g.angleOf(g.sub(C, P));
        k.curve(t => { const x = a * Math.cos(t), y = b * Math.sin(t); return [M.x + x * Math.cos(ang) - y * Math.sin(ang), M.y + x * Math.sin(ang) + y * Math.cos(ang)]; }, [0, k.TAU], { n: 240 });
      });
    }
  });

  /* (b) P outside the circle: the crease cuts the line CP' beyond C; QP = QP' = u, QC = v, u − v = r:
     Q lies on a hyperbola with foci P and C. */
  Curves.figure({
    id: 'fig-075b',
    section: 'envelopes',
    page: 78,
    title: 'Folding a point outside a circle onto the circle: the creases envelope a hyperbola',
    tags: ['paper folding', 'hyperbola', 'envelope'],
    build(k) {
      const g = k.g, r = 460, C = k.pt(0, 0), P = k.pt(-590, 0);
      const Pp = g.polar(C, r, g.deg(99.5));
      const cr = crease(g, P, Pp);
      const Q = g.lineLine(cr.mid, cr.b, C, Pp);
      const ends = g.lineCircle(cr.mid, cr.b, C, r).sort((p, q) => p.x - q.x);
      const M = g.mid(P, C), a = r / 2, c = g.dist(P, C) / 2, b = Math.sqrt(c * c - a * a);
      const hyp = side => t => [M.x + side * a * Math.cosh(t), M.y + b * Math.sinh(t)];
      k.given('The fixed circle of radius r with centre C, and the point P outside it.', () => {
        k.circle(C, r);
        k.point(C, 'C', { at: 'e', r: 1.7 });
        k.point(P, 'P', { at: 'n', r: 1.7 });
      });
      k.step('fold', 'Choose a point P\' on the circle and fold P over onto P\': the crease is the perpendicular bisector of PP\'.', () => {
        k.seg(P, Pp, dashed);
        k.point(Pp, 'P\'', { at: 'n', open: true, r: 0.9 });
        k.seg(ends[0], ends[1], { cls: 'thick' });
      });
      k.step('straightedge', 'Draw P\'C and extend it beyond C until it cuts the crease at Q; join Q to P. Now QP = QP\' = u and QC = v, and u − v = P\'C = r.', () => {
        k.seg(Pp, Q, dashed); k.seg(P, Q, dashed);
        k.point(Q, 'Q', { at: 'se', open: true, r: 0.8 });
        k.label(g.mid(P, Q), 'u', 's'); k.label(g.mid(C, Q), 'v', 'e');
        k.text(0, -r * 0.8, 'CP\' = r', { size: 0.8, upright: true });
      });
      k.note('The equal angles θ: the crease bisects the angle between the focal radii QP and QC, so it is the tangent at Q.', () => {
        const du = g.unit(g.sub(ends[0], Q));
        k.angle(Q, g.add(Q, g.unit(g.sub(C, Q))), g.add(Q, du), { label: 'θ', r: 1.1, labelDist: 1.45, cls: 'given' });
        k.angle(Q, g.add(Q, du), P, { label: 'θ', r: 1.1, labelDist: 1.45, cls: 'given' });
      });
      k.step('fold', 'Fold P onto other points of the circle: the creases (dashed) are the tangents of one curve.', () => {
        for (let i = 0; i < 18; i++) {
          const q = g.polar(C, r, g.deg(9 + 19 * i + 0.4)), cc = crease(g, P, q), e2 = g.lineCircle(cc.mid, cc.b, C, r);
          if (e2.length === 2) k.seg(e2[0], e2[1], { cls: 'aux', dash: true });
        }
      });
      k.step('pencil', 'They envelope a hyperbola with foci P and C (u − v = r), both branches.', () => {
        k.curve(hyp(1), [-1.45, 1.45], { n: 200 });
        k.curve(hyp(-1), [-1.45, 1.45], { n: 200 });
      });
    }
  });

  /* (c) the circle is a line L (a circle of infinite radius); P'Q is perpendicular to L and PQ = P'Q:
     Q lies on the parabola with focus P and directrix L. */
  Curves.figure({
    id: 'fig-075c',
    section: 'envelopes',
    page: 78,
    title: 'Folding a point onto a line: the creases envelope a parabola',
    tags: ['paper folding', 'parabola', 'envelope'],
    build(k) {
      const g = k.g, d = 145, f = d / 2;                     // P at the origin, the line L at height d
      const P = k.pt(0, 0), x0 = 310, Pp = k.pt(x0, d);
      const cr = crease(g, P, Pp);
      const Q = g.lineLine(cr.mid, cr.b, Pp, k.pt(x0, 0));
      const Lx = g.lineLine(cr.mid, cr.b, k.pt(0, d), k.pt(1, d));
      const tail = g.add(Q, g.mul(g.unit(g.sub(Q, Lx)), 330));
      k.given('The fixed line L, and the point P at distance 2f from it (L is a circle of infinite radius).', () => {
        k.seg(k.pt(-485, d), k.pt(555, d), { cls: 'given' });
        k.label(k.pt(-330, d), 'L', 'n', { dist: 0.9 });
        k.point(P, 'P', { at: 's', r: 1.7 });
      });
      k.step('fold', 'Choose a point P\' on L and fold P over onto P\': the crease is the perpendicular bisector of PP\'.', () => {
        k.seg(P, Pp, dashed);
        k.point(Pp, 'P\'', { at: 'n', open: true, r: 0.9 });
        k.seg(Lx, tail, { cls: 'thick' });
      });
      k.step('straightedge', 'Draw P\'Q perpendicular to L, cutting the crease at Q, and join Q to P. Then PQ = P\'Q: Q is as far from P as from L.', () => {
        k.seg(Pp, Q, dashed); k.seg(P, Q, dashed);
        k.point(Q, 'Q', { at: 'e', open: true, r: 0.8 });
        k.right(Pp, k.pt(Pp.x - 30, Pp.y), Q, { r: 1 });
      });
      k.note('The equal angles θ: the crease bisects the angle between QP and QP\', so it is the tangent at Q.', () => {
        const du = g.unit(g.sub(Lx, Q));
        k.angle(Q, Pp, g.add(Q, du), { label: 'θ', r: 1.1, labelDist: 1.4, cls: 'given' });
        k.angle(Q, g.add(Q, du), P, { label: 'θ', r: 1.1, labelDist: 1.4, cls: 'given' });
      });
      k.step('fold', 'Fold P onto other points of L: the creases (dashed) are the tangents of one curve.', () => {
        for (let i = -8; i <= 8; i++) {
          const q = k.pt(46 * i + 10, d), cc = crease(g, P, q);
          const top = g.lineLine(cc.mid, cc.b, k.pt(0, d), k.pt(1, d));
          if (!top || Math.abs(top.x) > 480 || Math.abs(q.x - x0) < 20) continue;
          const Qi = k.pt(q.x, f - q.x * q.x / (4 * f)), dn = g.unit(g.sub(Qi, top));
          k.seg(top, g.add(Qi, g.mul(dn, 90)), { cls: 'aux', dash: true });
        }
      });
      k.step('pencil', 'They envelope a parabola with focus P and directrix L.', () => {
        k.curve(s => [s, f - s * s / (4 * f)], [-430, 425], { n: 240 });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 76, page 80 */
  /* A conic with two tangents L = 0 (at A1) and N = 0 (at A2) from T and their chord of contact M = 0:
     with the scale of M chosen so that the conic is M² = L·N, the lines  L c² + 2 M c + N = 0  (one for each
     value of c) are all tangents of the conic: their envelope. The ellipse is the image of a circle under an
     affine map, so the points of contact are found on the circle and carried over. */
  Curves.figure({
    id: 'fig-076',
    section: 'envelopes',
    page: 80,
    title: 'The conic M² = L·N with two tangents L = 0, N = 0 and their chord of contact M = 0',
    tags: ['envelope', 'conic', 'tangents', 'chord of contact'],
    build(k) {
      const g = k.g, A = 400, B = 245, psi = g.deg(45);
      const to = p => g.rot(k.pt(p.x * A, p.y * B), psi), from = p => { const q = g.rot(p, -psi); return k.pt(q.x / A, q.y / B); };
      const T = k.pt(-349, 486), Tc = from(T);
      const tp = g.tangentPoints(Tc, k.pt(0, 0), 1).map(to);
      const A1 = tp.reduce((s, p) => (p.x < s.x ? p : s)), A2 = tp.find(p => p !== A1);
      const lin = (P1, P2) => (X => g.cross(g.sub(P2, P1), g.sub(X, P1)) / g.dist(P1, P2));   // signed distance to the line P1P2
      const Lf = lin(T, A1), Mf = lin(A1, A2);
      let Nf = lin(T, A2);
      if (Lf(k.pt(0, 0)) * Nf(k.pt(0, 0)) < 0) { const N0 = Nf; Nf = X => -N0(X); }            // L and N both positive inside the wedge
      const E = to(k.pt(Math.cos(g.deg(250)), Math.sin(g.deg(250))));                          // a point of the ellipse, to scale M
      const sM = Math.sqrt(Lf(E) * Nf(E)) / Math.abs(Mf(E));                                   // M² = L·N is then the conic
      const ext = (P1, P2, d1, d2) => [g.along(P1, P2, -d1), g.along(P1, P2, g.dist(P1, P2) + d2)];
      const ellipse = t => { const p = to(k.pt(Math.cos(t), Math.sin(t))); return [p.x, p.y]; };
      k.given('The conic (an ellipse), drawn heavy.', () => {
        k.curve(ellipse, [0, k.TAU], { n: 240, cls: 'thick' });
      });
      k.step('straightedge', 'From a point T outside the conic draw the two tangents, L = 0 and N = 0, touching it at A1 and A2.', () => {
        const l1 = ext(T, A1, 0, 190), l2 = ext(T, A2, 0, 150);
        k.seg(l1[0], l1[1]); k.seg(l2[0], l2[1]);
        k.dot(T, { open: true, r: 1.4 }); k.dot(A1, { open: true, r: 1.2 }); k.dot(A2, { open: true, r: 1.2 });
        k.label(g.add(g.mid(T, A1), k.pt(-30, 20)), 'L = 0', 'w', { upright: true, size: 0.85 });
        k.label(g.mid(T, A2), 'N = 0', 'n', { upright: true, size: 0.85, dist: 1.6 });
      });
      k.step('straightedge', 'Join the points of contact: the chord of contact is M = 0.', () => {
        const m = ext(A1, A2, 130, 120);
        k.seg(m[0], m[1]);
        k.label(g.mid(A1, A2), 'M = 0', 'se', { upright: true, size: 0.85, dist: 1.5 });
      });
      k.step('straightedge', 'With M scaled so that the conic is M² = L·N, the lines L·c² + 2M·c + N = 0 (c = 0 gives N = 0, c → ∞ gives L = 0) are tangents of the same conic. Here are four of them, for c = ±1 and ±2: the conic is their envelope.', () => {
        [1, 2, -1, -2].forEach(c => {
          const f = X => Lf(X) * c * c + 2 * sM * Mf(X) * c + Nf(X);                            // affine in X
          const f0 = f(k.pt(0, 0)), fx = f(k.pt(1, 0)) - f0, fy = f(k.pt(0, 1)) - f0, n2 = fx * fx + fy * fy;
          const base = k.pt(-f0 * fx / n2, -f0 * fy / n2);
          k.line(base, g.add(base, k.pt(-fy, fx)), { cls: 'aux' });
        });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 77, page 80 */
  /* The cycloids hang below the line y = c (here y = 0) with their cusps on it: the paths of a point of a
     circle rolling under the line. F = 0 is cut at right angles by each of the family. The family is built
     from its envelope E (a circle arc): the cycloid with its cusp on y = 0 that touches E at the point with
     slope m has the parameter t = 2·atan2(1, −m) there, radius ρ = −y/(1 − cos t) and cusp x0 = x − ρ(t − sin t).
     F is then the orthogonal trajectory of the family: dt/ds = −(G_t·G_s)/|G_t|² along the parameter s of E. */
  Curves.figure({
    id: 'fig-077',
    section: 'envelopes',
    page: 80,
    title: 'The cycloids normal to F = 0 envelope a curve E = 0',
    tags: ['envelope', 'cycloid', 'calculus of variations', 'brachistochrone'],
    note: 'The book draws a sketch. Here the family is exact: the cycloids are normal to the curve F = 0 and all touch the curve E = 0; the point A lies on one of them.',
    build(k) {
      const g = k.g;
      const Ce = k.pt(233.1, -1285.1), Re = 1058.6;                           // E: an arc of this circle
      const Epos = s => k.pt(Ce.x + Re * Math.cos(s), Ce.y + Re * Math.sin(s));
      const par = s => {
        const E = Epos(s), m = -Math.cos(s) / Math.sin(s), t = 2 * Math.atan2(1, -m);
        const rho = -E.y / (1 - Math.cos(t));
        return { E, t, rho, x0: E.x - rho * (t - Math.sin(t)) };
      };
      const G = (s, t) => { const p = par(s); return [p.x0 + p.rho * (t - Math.sin(t)), -p.rho * (1 - Math.cos(t))]; };
      const dts = (s, t) => {
        const h = 1e-5, a = G(s + h, t), b = G(s - h, t), p = par(s);
        const Gs = [(a[0] - b[0]) / (2 * h), (a[1] - b[1]) / (2 * h)], Gt = [p.rho * (1 - Math.cos(t)), -p.rho * Math.sin(t)];
        return -(Gt[0] * Gs[0] + Gt[1] * Gs[1]) / (Gt[0] * Gt[0] + Gt[1] * Gt[1]);
      };
      const s1 = g.deg(70), ta = 4.08;
      const traj = sEnd => {                                                  // Runge–Kutta along s from (s1, ta)
        let s = s1, t = ta; const out = [G(s, t)], n = 40, h = (sEnd - s1) / n;
        for (let i = 0; i < n; i++) {
          const k1 = dts(s, t), k2 = dts(s + h / 2, t + h / 2 * k1), k3 = dts(s + h / 2, t + h / 2 * k2), k4 = dts(s + h, t + h * k3);
          t += h / 6 * (k1 + 2 * k2 + 2 * k3 + k4); s += h; out.push(G(s, t));
        }
        return { pts: out, t };
      };
      const up = traj(g.deg(75)), dn = traj(g.deg(46));
      const F = up.pts.slice().reverse().concat(dn.pts.slice(1));
      const s2 = g.deg(50), p1 = par(s1), p2 = par(s2);
      const cy = (p, t) => [p.x0 + p.rho * (t - Math.sin(t)), -p.rho * (1 - Math.cos(t))];
      const tF2 = traj(s2).t;
      const Aq = k.pt(...cy(p1, 3.3));
      k.given('The line y = c (the line of zero velocity, here y = 0), the curve F = 0 and the point A.', () => {
        k.seg(k.pt(180, 0), k.pt(1150, 0), { cls: 'given' });
        k.text(900, 70, 'y = c', { upright: true, size: 0.9 });
        k.curve(F, null, { cls: 'thick' });
        k.text(1060, -60, 'F = 0', { upright: true, size: 0.9 });
        k.point(Aq, 'A', { at: 'n', open: true, r: 1.2 });
      });
      k.step('roll', 'Roll a circle under the line y = c: a point of its rim traces a cycloid with its cusps on the line. The cycloid through A that meets F = 0 at right angles is the path of shortest time from A to F.', () => {
        k.curve(t => cy(p1, t), [-0.55, 4.08], { n: 200, cls: 'given' });
      });
      k.step('roll', 'Circles of other radii give other cycloids, each normal to F = 0 where it meets it. Here is a second one, with its cusp further to the right.', () => {
        k.curve(t => cy(p2, t), [-0.55, tF2], { n: 200, cls: 'given' });
      });
      k.step('pencil', 'All the cycloids normal to F = 0 touch one curve E = 0, their envelope. If E = 0 passes between A and F = 0, the cycloid from A does not give a unique shortest path.', () => {
        k.curve(s => { const p = Epos(s); return [p.x, p.y]; }, [g.deg(87), g.deg(44)], { n: 120, cls: 'thick' });
        k.text(190, -300, 'E = 0', { upright: true, size: 0.9 });
      });
    }
  });
})();
