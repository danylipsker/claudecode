/* Curves Workshop · figures/limacon.js — Figs. 143–145 (pages 148–151) */

/* Fig. 143(a), page 148 — the limacon as an epitrochoid: a circle of radius 2a rolls on an equal fixed
   circle (centre O); the tracing point P sits on a bar AP fixed to the rolling circle (A is its centre,
   AP = k). The book draws the bar with three black dots, k < 2a, k = 2a and k > 2a, and the three paths
   in a window around the bar: the curve with an indentation, the cardioid (cusp) and the limacon with a
   double point (inner loop). */
Curves.figure({
  id: 'fig-143a',
  section: 'limacon',
  page: 148,
  title: 'The limacon as an epitrochoid of two equal circles',
  tags: ['roulette', 'epitrochoid', 'rolling'],
  note: 'The book draws three tracing points on the bar (k < 2a, k = 2a, k > 2a) and shows each path only in a window round the bar. The letters follow the figure: the fixed circle has radius 2a, so the parametric equations read x = 4a cos t − k cos 2t, y = 4a sin t − k sin 2t (the book prints a cosine in the second line by a slip).',
  build(k) {
    const g = k.g, a = 70, R = 2 * a, t = g.deg(67);
    const O = k.pt(0, 0);
    const A = g.polar(O, 2 * R, t);                        // centre of the rolling circle
    const T = g.polar(O, R, t);                            // point of contact
    const X0 = k.pt(R, 0);                                 // where the fixed circle crosses OX: the circles started touching here
    const tang = g.add(T, g.perp(g.sub(T, O)));
    const X1 = g.reflect(X0, T, tang);                     // the point of the rolling circle that started at X0
    const u = g.unit(g.sub(X1, A));                        // direction of the bar
    const hs = [0.55 * R, R, 1.67 * R];                    // k < 2a, k = 2a, k > 2a
    const Ps = hs.map(h => g.add(A, g.mul(u, h)));
    const hw = 0.045 * R;                                  // half-width of the bar, where the paths disappear behind it
    const distSeg = (p, s0, s1) => g.dist(p, g.lerp(s0, s1, Math.max(0, Math.min(1, g.dot(g.sub(p, s0), g.sub(s1, s0)) / g.dot(g.sub(s1, s0), g.sub(s1, s0))))));
    const path = (h, tmin, tmax, hide) => {
      const f = k.curves.epitrochoid(R, R, h), pts = [], n = 260;
      for (let i = 0; i <= n; i++) {
        const p = f(tmin + (tmax - tmin) * i / n);
        if (hide && distSeg(g.pt(p[0], p[1]), A, Ps[2]) < hw) break;
        pts.push(p);
      }
      return pts;
    };

    k.given('The fixed circle of radius 2a about O, and the line OX. (The book hatches the circle to show that it stays put.)', () => {
      k.seg(k.pt(-1.27 * R, 0), k.pt(2.5 * R, 0), { cls: 'axis', arrow: 'end' });
      k.label(k.pt(2.5 * R, 0), 'X', 'ne', { cls: 'axis' });
      k.circle(O, R);
      k.arc(O, R, g.deg(100), g.deg(125), { hatch: 'in' });
      k.arc(O, R, g.deg(-135), g.deg(-85), { hatch: 'in' });
      k.point(O, 'O', { at: 'sw', open: true });
    });
    k.step('compass', 'Mark the contact point T on the fixed circle at the angle t from OX. Continue OT by its own length 2a to A and draw the rolling circle about A with radius 2a: it equals the fixed circle and touches it at T.', () => {
      k.seg(O, A, { cls: 'cons' });
      k.circle(A, R);
      k.dot(T, { open: true });
      k.dim(O, T, '2a', { dist: 1.1 });
      k.dim(T, A, '2a', { dist: 1.1 });
      k.angle(O, k.pt(R, 0), T, { label: 't' });
    });
    k.step('roll', 'The bar is fixed to the rolling circle. When t = 0 it lay along AO, pointing at the starting contact point X0 = (2a, 0). Mirror X0 in the common tangent at T (the equal circles roll as mirror images) to get the point X0′ of the rolling circle that started at X0: the bar now points from A through X0′, which is the direction π + 2t.', () => {
      k.seg(g.along(T, tang, -0.55 * R), g.along(T, tang, 0.55 * R), { cls: 'aux' });
      k.dot(X0, { open: true, r: 0.8 });
      k.dot(X1, { open: true, r: 0.8 });
      k.seg(A, X1, { cls: 'cons' });
    });
    k.step('dividers', 'Lay off the arm AP = k along the bar from A, for three values: k less than 2a, equal to 2a and greater than 2a. P is the tracing point.', () => {
      k.bar(A, Ps[2]);
      k.point(A, 'A', 'ne');
      Ps.forEach(p => k.point(p, 'P', 'ne'));
    });
    k.step('pencil', 'Repeat for other values of t and draw the three paths of P: with k < 2a an indentation, with k = 2a a cusp on the fixed circle (the cardioid), with k > 2a a double point and an inner loop. Where t = 0 each path crosses OX (open dots).', () => {
      k.curve(path(hs[0], -1.0, 1.17, true), null, { n: 0 });
      k.curve(path(hs[1], -1.15, 1.17, true), null, { n: 0 });
      k.curve(path(hs[2], -1.28, 1.17, false), null, { n: 0 });
      hs.forEach(h => k.dot(k.pt(2 * R - h, 0), { open: true }));
    });
  }
});

/* Fig. 143(b), page 148 — the limacon as the conchoid of a circle, drawn by a linkage: the crank OA of
   length a turns about O; the bar slides through the swivel at B (OB = a, on the line OX) and carries the
   pivot A and the tracing pivot P with AP = k. Since OA = OB, the angle AOX is twice the angle θ of the bar. */
Curves.figure({
  id: 'fig-143b',
  section: 'limacon',
  page: 148,
  title: 'The limacon as the conchoid of a circle, drawn by a linkage',
  tags: ['conchoid', 'linkage', 'construction'],
  note: 'With the pole at B the path of P is r = 2a cos θ + k. Laying AP = k off on the other side of A gives r = 2a cos θ − k, the same curve once more.',
  build(k) {
    const g = k.g, a = 100, th = g.deg(42), kk = 1.1 * a;
    const O = k.pt(0, 0), B = k.pt(-a, 0);
    const u = g.dir(th);
    const A = g.polar(O, a, 2 * th);                       // on the circle about O through B, on the secant from B
    const P = g.add(A, g.mul(u, kk));
    const box = (c, w, h) => k.poly([k.pt(c.x - w, c.y - h * 0.9), k.pt(c.x + w, c.y - h * 0.9), k.pt(c.x + w, c.y + h * 1.1), k.pt(c.x - w, c.y + h * 1.1)], { close: true, cls: 'given' });

    k.given('The line OX with the fixed point O and the point B on it, OB = a. B is the fixed point of the conchoid; the distance AP = k is given.', () => {
      k.seg(k.pt(-1.45 * a, 0), k.pt(1.3 * a, 0), { cls: 'axis', arrow: 'end' });
      k.label(k.pt(1.3 * a, 0), 'X', 'ne', { cls: 'axis' });
      k.point(O, 'O', { at: 's', open: true, lo: { dist: 2.4 } });
      k.point(B, 'B', { at: 's', open: true, lo: { dist: 2.6 } });
      k.text(0.83 * a, 0.52 * a, 'OB = OA = a', { upright: true, size: 0.9 });
      k.text(-1.63 * a, 0.2 * a, 'AP = k', { upright: true, size: 0.9, anchor: 'start' });
    });
    k.step('compass', 'Draw the circle about O through B, radius a. B is on the circle, and every secant from B cuts the circle once more.', () => {
      k.circle(O, a, { cls: 'cons' });
    });
    k.step('protractor', 'Through B draw a secant making the angle θ with OX. It cuts the circle again at A. Because OA = OB, the angle AOX is 2θ.', () => {
      k.seg(B, A, { cls: 'cons' });
      k.point(A, 'A', { at: 'e', open: true, lo: { dist: 1.8 } });
      k.angle(B, O, A, { label: 'θ', r: 1.7 });
    });
    k.step('dividers', 'With the dividers set to k, lay AP off along the secant beyond A. P is a point of the limacon. (Laid off back towards B it gives r = 2a cos θ − k, which is the same curve again.) Repeat for other angles θ.', () => {
      k.seg(A, P, { cls: 'cons' });
      k.point(P, 'P', { at: 's', open: true, lo: { dist: 2.2 } });
    });
    k.step('linkage', 'As a mechanism: the crank OA turns about O; the bar is pinned to the crank at A and slides through the swivel at B; the pencil sits at P, AP = k beyond A.', () => {
      box(O, 0.17 * a, 0.125 * a);
      box(B, 0.16 * a, 0.12 * a);
      const stub = g.sub(B, g.mul(u, 0.55 * a));
      k.bar(stub, P);
      k.bar(O, A);
      // the swivel at B
      const n = g.perp(u), s = 0.17 * a, w = 0.07 * a;
      k.poly([g.add(g.add(B, g.mul(u, s)), g.mul(n, w)), g.sub(g.add(B, g.mul(u, s)), g.mul(n, w)), g.sub(g.sub(B, g.mul(u, s)), g.mul(n, w)), g.add(g.sub(B, g.mul(u, s)), g.mul(n, w))], { close: true, cls: 'given' });
      // the broken end of the bar
      const e0 = g.add(stub, g.mul(n, 0.045 * a)), e1 = g.sub(stub, g.mul(n, 0.045 * a));
      k.poly([e0, g.add(g.lerp(e0, e1, 0.25), g.mul(u, 0.03 * a)), g.sub(g.lerp(e0, e1, 0.5), g.mul(u, 0.02 * a)), g.add(g.lerp(e0, e1, 0.75), g.mul(u, 0.03 * a)), e1], { cls: 'given' });
      k.pivot(O); k.pivot(B); k.pivot(A); k.pivot(P);
    });
    k.step('pencil', 'The pencil at P draws the limacon r = 2a cos θ + k (the book shows a short piece of it through P).', () => {
      const f = k.curves.limacon(a, kk);
      k.curve(t => { const p = f(t); return [p[0] + B.x, p[1] + B.y]; }, [th - 0.17, th + 0.17], { n: 40 });
    });
  }
});

/* Fig. 144(a), page 150 — the tangent and the centre of curvature. The bar BAP (A on the circle about O
   through B, AP = k) moves so that A goes round the circle. The point A moves perpendicular to OA, so its
   normal is AO; the point of the bar at B moves along the bar, so its normal is the perpendicular to the bar
   at B. They meet at H, the other end of the diameter through A (the angle ABH is a right angle). H is the
   instantaneous centre of the bar, HP is the normal and the perpendicular at P is the tangent. Radius of
   curvature: HQ perpendicular to HP meets AB in Q; QO meets HP in C, the centre of curvature. */
Curves.figure({
  id: 'fig-144a',
  section: 'limacon',
  page: 150,
  title: 'Tangent and centre of curvature of the limacon',
  tags: ['tangent', 'curvature', 'instantaneous center', 'construction'],
  note: 'The construction is exact: C computed this way is the centre of curvature of r = 2a cos θ + k at P.',
  build(k) {
    const g = k.g, a = 150, th = g.deg(28), kk = 1.12 * a;
    const O = k.pt(0, 0), B = k.pt(-a, 0);
    const A = g.polar(O, a, 2 * th);
    const u = g.dir(th);
    const P = g.add(B, g.mul(u, 2 * a * Math.cos(th) + kk));
    const H = g.sub(g.mul(O, 2), A);                        // the other end of the diameter through A
    const Q = g.lineLine(A, B, H, g.add(H, g.perp(g.sub(P, H))));
    const C = g.lineLine(Q, O, H, P);
    const f = k.curves.limacon(a, kk);
    const curveAt = t => { const p = f(t); return [p[0] + B.x, p[1] + B.y]; };

    k.given('The circle of radius a about O, the point B on it (the pole of the limacon) and the line BO.', () => {
      k.circle(O, a);
      k.seg(B, g.add(O, k.pt(2.05 * a, 0)), { cls: 'given' });
      k.point(B, 'B', { at: 'nw', open: true });
      k.point(O, 'O', { at: 'nw', open: true });
    });
    k.step('straightedge', 'Draw the secant from B through a point A of the circle and carry it on to P, with AP = k: P is a point of the limacon. Join O to A.', () => {
      k.seg(B, P, { cls: 'given' });
      k.seg(O, A, { cls: 'given' });
      k.point(A, 'A', { at: 'n', open: true });
      k.point(P, 'P', { at: 's', open: true });
    });
    k.step('straightedge', 'The point A of the bar moves perpendicular to OA, so its normal is AO. The point of the bar at B moves along the bar, so its normal is the perpendicular to the bar at B. Both meet at H: carry AO through O to the circle, then BH is perpendicular to AB (a diameter subtends a right angle).', () => {
      k.seg(O, H, { cls: 'cons', dash: true });
      k.seg(B, H, { cls: 'cons', dash: true });
      k.point(H, 'H', { at: 's', open: true });
    });
    k.step('straightedge', 'H is the centre of rotation of the whole bar, so HP is the normal to the path of P.', () => {
      k.seg(H, P, { cls: 'cons', dash: true });
    });
    k.step('square', 'The perpendicular to HP at P is the tangent to the limacon.', () => {
      const d = g.unit(g.perp(g.sub(P, H)));
      k.seg(g.add(P, g.mul(d, 62)), g.sub(P, g.mul(d, 62)), { cls: 'cons' });
    });
    k.step('square', 'Radius of curvature: at H draw HQ perpendicular to HP, until it meets AB in Q (on the extension of AB beyond B).', () => {
      k.seg(H, Q, { cls: 'cons', dash: true });
      k.seg(Q, B, { cls: 'cons', dash: true });
      k.point(Q, 'Q', { at: 'sw', open: true });
    });
    k.step('straightedge', 'Join Q to O. It meets HP in C, the centre of curvature of the path of P.', () => {
      k.seg(Q, C, { cls: 'cons', dash: true });
      k.point(C, 'C', { at: 'ne', open: true });
    });
    k.step('pencil', 'The path of P near P, touching the tangent.', () => {
      const t0 = g.angleOf(g.sub(P, B));
      k.curve(curveAt, [t0 - 0.1, t0 + 0.1], { n: 30 });
    });
  }
});

/* Fig. 144(b), page 150 — the same limacon as an epitrochoid: the circle with centre A rolls on the fixed
   circle about O (equal radii, touching at T); T is the instantaneous centre of every point carried by the
   rolling circle, so TP is the normal at P and the perpendicular to TP at P is the tangent. (The text of
   item (k) speaks of double generation, but the drawing shows this tangent construction.) */
Curves.figure({
  id: 'fig-144b',
  section: 'limacon',
  page: 150,
  title: 'The tangent to the limacon by the point of contact T',
  tags: ['tangent', 'instantaneous center', 'rolling'],
  note: 'The page prints this drawing beside the tangent text (i): T, the point of contact, is the centre of rotation of the rolling circle, so TP is normal to the path of P.',
  build(k) {
    const g = k.g, R = 125, t = g.deg(42.9), h = 0.49 * R;
    const O = k.pt(0, 0);
    const T = g.polar(O, R, t), A = g.polar(O, 2 * R, t);
    const P = g.add(A, g.mul(g.dir(2 * t + Math.PI), h));
    const f = k.curves.epitrochoid(R, R, h);

    k.given('The fixed circle about O, and the line OX.', () => {
      k.seg(k.pt(-1.25 * R, 0), k.pt(2.8 * R, 0), { cls: 'given' });
      k.circle(O, R);
      k.arc(O, R, g.deg(98), g.deg(122), { hatch: 'in' });
      k.arc(O, R, g.deg(-135), g.deg(-70), { hatch: 'in' });
      k.point(O, 'O', { at: 'nw', open: true });
    });
    k.step('compass', 'The equal circle rolls on it: its centre A lies on OT produced, at distance 2R from O, and it touches the fixed circle at T.', () => {
      k.seg(O, T, { cls: 'given' });
      k.circle(A, R);
      k.point(T, 'T', { at: 'n', open: true });
      k.point(A, 'A', { at: 'ne', open: true });
    });
    k.step('roll', 'P is a point rigidly attached to the rolling circle (the end of the bar from A, pointing in the direction π + 2t).', () => {
      k.point(P, 'P', { at: 'ne', open: true });
    });
    k.step('straightedge', 'T is the instantaneous centre of rotation of the rolling circle, so TP is normal to the path of P.', () => {
      k.seg(T, P, { cls: 'given' });
    });
    k.step('square', 'The perpendicular to TP at P is the tangent to the path.', () => {
      const d = g.unit(g.perp(g.sub(P, T)));
      k.seg(g.add(P, g.mul(d, 0.52 * R)), g.sub(P, g.mul(d, 0.52 * R)), { cls: 'cons' });
    });
    k.step('pencil', 'The path of P, an epitrochoid (a limacon), touching the tangent at P.', () => {
      k.curve(f, [-0.95, 0.97], { n: 160 });
    });
  }
});

/* Fig. 145, page 151 — the linkage of two crossed parallelograms CDKF and CGED (similar, sharing CD) with
   C and F fixed on the base line; CHJD is a true parallelogram and P lies on the extension of JD. Angle
   markings θ are the equal angles of the crossed parallelograms; D is the centre of a circle that rolls on
   the equal circle about C, so P traces a limacon. */
Curves.figure({
  id: 'fig-145',
  section: 'limacon',
  page: 151,
  title: 'Linkage of crossed parallelograms drawing the limacon',
  tags: ['linkage', 'crossed parallelogram'],
  note: 'Proportions as in the book: CD = KF, DK = CF, CG = ED, GE = CD with CD² = CF · CG (the two crossed parallelograms are similar). The figure shows one position of the mechanism, with the equal angles θ marked.',
  build(k) {
    const g = k.g, d = 200, f = 301, th = g.deg(56.5);
    const gg = d * d / f;                                   // CG = ED, from the similarity CD² = CF · CG
    const hh = 0.92 * d, pp = 0.336 * d;
    const C = k.pt(0, 0), F = k.pt(f, 0);
    const D = g.polar(C, d, th);
    const G = g.polar(C, gg, 2 * th);
    const Hh = g.polar(C, hh, 2 * th);
    const mirror = (p, a, b) => { const m = g.mid(a, b); return g.reflect(p, m, g.add(m, g.perp(g.sub(b, a)))); };
    const E = mirror(C, G, D);                              // CGED crossed: E is C reflected in the perpendicular bisector of GD
    const K = mirror(C, D, F);                              // CDKF crossed: K is C reflected in the perpendicular bisector of DF
    const J = g.add(D, Hh);                                 // CHJD a parallelogram
    const P = g.add(D, g.mul(g.dir(2 * th + Math.PI), pp)); // on the extension of JD
    const box = (c, w, h) => k.poly([k.pt(c.x - w, c.y - h), k.pt(c.x + w, c.y - h), k.pt(c.x + w, c.y + h), k.pt(c.x - w, c.y + h)], { close: true, cls: 'given' });
    const tick = (a, b, s) => { const p = g.lerp(a, b, s); k.tick(p, g.sub(b, a), { cls: 'given' }); };

    k.given('The base line with the fixed pivots C and F (CF = f), and the equal lengths: CD = KF, DK = CF, CG = ED, GE = CD, with CD² = CF · CG.', () => {
      k.seg(k.pt(-0.3 * d, 0), k.pt(f + 0.29 * d, 0), { cls: 'given' });
      box(C, 0.13 * d, 0.095 * d);
      box(F, 0.13 * d, 0.095 * d);
      k.pivot(C); k.pivot(F);
      k.label(C, 'C', 's', { dist: 2.6 });
      k.label(F, 'F', 'se', { dist: 2.4 });
    });
    k.step('linkage', 'First crossed parallelogram CDKF: the bar CD turns about C by the angle θ with the base line; the bar DK (length CF) crosses the base line to K, and KF equals CD. The angle at K between KD and KF is also θ.', () => {
      k.bar(C, D); k.bar(D, K); k.bar(K, F);
      k.pivot(D); k.pivot(K);
      k.label(D, 'D', 'ne', { dist: 2.0 });
      k.label(K, 'K', 'w', { dist: 2.4 });
      k.angle(C, F, D, { r: 1.7 });
      k.label(g.polar(C, 0.34 * d, th / 2 + 0.05), 'θ', 'e', { dist: 0.6 });
      k.angle(K, F, D, { r: 1.6, cls: 'cons' });
      k.label(g.polar(K, 0.3 * d, g.angleOf(g.sub(D, K)) - 0.45), 'θ', 'e', { dist: 0.5 });
    });
    k.step('linkage', 'Second crossed parallelogram CGED, similar to the first and sharing the bar CD: G lies on the line at the angle 2θ from C with CG = ED, and the bar GE crosses CD to E on DK, with GE = CD.', () => {
      k.bar(C, Hh); k.bar(G, E);
      k.pivot(G); k.pivot(E);
      k.label(G, 'G', 'sw', { dist: 2.0 });
      k.label(E, 'E', 'e', { dist: 2.0 });
      k.angle(C, D, G, { r: 1.7 });
      k.label(g.polar(C, 0.27 * d, 1.5 * th + 0.03), 'θ', 'n', { dist: 0.9 });
    });
    k.step('linkage', 'Complete the parallelogram CHJD: H on the line CG with CH = DJ, then J = D + CH. The angle at J between JH and JD is again θ.', () => {
      k.bar(Hh, J); k.bar(J, D);
      k.pivot(Hh); k.pivot(J);
      k.label(Hh, 'H', 'nw', { dist: 1.8 });
      k.label(J, 'J', 'nw', { dist: 1.8 });
      k.angle(J, Hh, D, { r: 1.6 });
      k.label(g.polar(J, 0.3 * d, g.angleOf(g.sub(D, J)) - th / 2), 'θ', 's', { dist: 0.9 });
    });
    k.step('pencil', 'P is a point on the extension of JD beyond D. D is the centre of a circle that rolls on the equal fixed circle about C, and JD is carried by it, so P traces a limacon (short piece shown).', () => {
      k.seg(D, P, { cls: 'given' });
      k.pivot(P); k.point(P, 'P', { at: 'e', dist: 2.4 });
      const fe = k.curves.epitrochoid(d / 2, d / 2, pp);
      k.curve(fe, [th - 0.22, th + 0.22], { n: 40, nobounds: true });
    });
    k.note('The equal angles θ of the figure: at J (between JH and JD), at C (between CG and CD, and between CD and the base line) and at K (between KD and KF); the short ticks mark the bars of equal length.', () => {
      tick(J, Hh, 0.1); tick(J, D, 0.1);
      tick(C, G, 0.28); tick(C, D, 0.28);
      tick(K, D, 0.1); tick(K, F, 0.14);
    });
  }
});
