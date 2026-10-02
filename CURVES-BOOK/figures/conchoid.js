/* Curves Workshop · figures/conchoid.js — Figs. 27–29 (pages 31 and 33)
 *
 * Fig. 27  the conchoid of a curve with respect to O
 * Fig. 28  the conchoid of Nicomedes (conchoid of a line), both branches, and its tangent construction
 * Fig. 29  the trisection of an angle with the marked ruler
 */

/* Fig. 27, page 31 — a curve and a fixed point O. A variable line through O meets the curve at A;
   P1 and P2 are the points of the line at distance +k and −k from A. Their locus is the conchoid
   of the curve with respect to O. */
Curves.figure({
  id: 'fig-027',
  section: 'conchoid',
  page: 31,
  title: 'The conchoid of a curve with respect to O',
  tags: ['conchoid', 'secant', 'construction'],
  note: 'The book draws one secant and no locus; the pencil step adds the two branches of the conchoid of the (freehand) given curve.',
  build(k) {
    const g = k.g;
    const kk = 55;                                              // the constant length k
    // the given curve: a smooth arc (freehand in the book); t runs down the arc
    const arc = t => [(743 + 6.9e-4 * (t - 190) * (t - 190) - 155) / 4, (533 - t) / 4];
    const O = k.pt(0, 0);
    const Ac = arc(352), A = k.pt(Ac[0], Ac[1]);
    const u = g.unit(A);
    const P1 = g.add(A, g.mul(u, kk)), P2 = g.sub(A, g.mul(u, kk));
    const branch = sign => t => { const p = arc(t); const v = g.unit(k.pt(p[0], p[1])); return [p[0] + sign * kk * v.x, p[1] + sign * kk * v.y]; };

    k.given('The given curve and the fixed point O, with the constant length k.', () => {
      k.curve(arc, [70, 628], { cls: 'thick', n: 120 });
      k.pivot(O); k.label(O, 'O', 'n', { dist: 1.9 });
    });
    k.step('straightedge', 'Draw a line through O. It meets the given curve at A.', () => {
      k.seg(O, g.add(A, g.mul(u, kk + 6)));
      k.point(A, 'A', { at: 'sw', open: true, lo: { dist: 1.2 } });
    });
    k.step('dividers', 'With the dividers take the length k and lay it off from A along the line in both directions: P1 beyond A (+k), P2 on the side of O (−k). Both lie on the conchoid.', () => {
      k.point(P1, 'P_1', { at: 'n', open: true, lo: { dist: 1.9 } });
      k.point(P2, 'P_2', { at: 'n', open: true, lo: { dist: 1.9 } });
      k.text(g.lerp(P2, A, 0.5).x, g.lerp(P2, A, 0.5).y + 5.5, '−k', { size: 0.95 });
      k.text(g.lerp(A, P1, 0.5).x, g.lerp(A, P1, 0.5).y + 6, '+k', { size: 0.95 });
    });
    k.step('pencil', 'Repeat with other lines through O. P1 and P2 together trace the conchoid of the curve with respect to O.', () => {
      k.curve(branch(1), [70, 628], { n: 160, nobounds: true });
      k.curve(branch(-1), [70, 628], { n: 160, nobounds: true });
    });
  }
});

/* Fig. 28, page 31 — the conchoid of Nicomedes: the conchoid of a line, with r = a csc θ ± k.
   O is at the distance a from the line AX; k > a here, so the inner branch has a loop through O.
   Tangent: the perpendicular to AX at A and the perpendicular to OA at O meet in H, the centre of
   rotation of the points of OA, so HP1 and HP2 are normals. */
Curves.figure({
  id: 'fig-028',
  section: 'conchoid',
  page: 31,
  title: 'The conchoid of Nicomedes with both branches and the tangent construction',
  tags: ['conchoid', 'Nicomedes', 'tangent'],
  note: 'Drawn with k = 2a, so the inner branch has a loop (the book draws about the same proportions). The book does not draw the normals HP1 and HP2; the tangent step adds them as dashed lines.',
  build(k) {
    const g = k.g;
    const a = 100, kk = 200, th = g.deg(46);
    const O = k.pt(0, 0), F = k.pt(0, a);
    const A = k.pt(a / Math.tan(th), a);
    const u = g.dir(th);
    const P1 = g.add(A, g.mul(u, kk)), P2 = g.sub(A, g.mul(u, kk));
    const H = k.pt(A.x, -A.x / Math.tan(th));
    const r1 = t => a / Math.sin(t) + kk, r2 = t => a / Math.sin(t) - kk;
    const polar = f => t => { const r = f(t); return [r * Math.cos(t), r * Math.sin(t)]; };
    const bis = (f, lo, hi) => { const flo = f(lo) > 0; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if ((f(m) > 0) === flo) lo = m; else hi = m; } return (lo + hi) / 2; };
    const tOut = bis(t => r1(t) * Math.cos(t) - 395, g.deg(5), g.deg(60));     // the upper branch is drawn out to x = ±395
    const tArm = bis(t => r2(t) * Math.cos(t) - 268, g.deg(1), g.deg(29));     // the arms of the inner branch out to x = ±268

    k.given('The fixed point O, the line AX at the distance a from O (with the foot F of the perpendicular from O), and the constant length k.', () => {
      k.seg(k.pt(-435, a), k.pt(420, a), { cls: 'axis', arrow: 'end' });
      k.label(k.pt(410, a), 'X', 'n', { dist: 1.2, cls: 'axis' });
      k.seg(O, k.pt(0, a + kk));
      k.point(F, '', { open: true });
      k.text(-11, a / 2, 'a', { size: 0.95 });
      k.pivot(O);
    });
    k.step('straightedge', 'Draw a line through O. It meets AX at A, at the angle θ.', () => {
      k.seg(O, A);
      k.point(A, 'A', { at: 'nw', open: true });
      k.angle(A, k.pt(A.x + 60, a), P1, { label: 'θ', r: 1.7, labelDist: 1.2 });
    });
    k.step('dividers', 'Lay off k from A along the line in both directions: P1 beyond A and P2 towards O (it falls on the far side of O when k is larger than OA). Both lie on the conchoid.', () => {
      k.seg(A, P1);
      k.seg(O, P2);
      k.point(P1, 'P_1', { at: 'ne', open: true });
      k.point(P2, 'P_2', { at: 'w', open: true, lo: { dist: 1.3 } });
      const m = g.lerp(A, P1, 0.5);
      k.label(m, 'k', 'nw', { dist: 1.0 });
    });
    k.step('straightedge', 'Tangent: draw the perpendicular to AX at A and the perpendicular to OA at O. They meet at H, the centre of rotation of the points of OA, so HP1 and HP2 are the normals to the curve at P1 and P2.', () => {
      k.seg(A, H);
      k.seg(O, H);
      k.point(H, 'H', { at: 'e', open: true });
      k.seg(H, P1, { cls: 'cons', dash: true });
      k.seg(H, P2, { cls: 'cons', dash: true });
    });
    k.step('pencil', 'The conchoid of Nicomedes r = a csc θ ± k: the outer branch (r = a csc θ + k, through P1, with AX as asymptote) and the inner branch (r = a csc θ − k, through P2, which makes a loop through O).', () => {
      k.curve(polar(r1), [tOut, Math.PI - tOut], { n: 300 });
      k.curve(polar(r2), [tArm, Math.PI - tArm], { n: 400 });
    });
  }
});

/* Fig. 29, page 33 — trisection of the angle XOY with the marked ruler. The ruler carries two marks
   P and Q, 2k apart. OB = k on OY; BC ∥ OX; BA ⟂ OX. The ruler's edge passes through O while P slides
   along AB; when Q falls on BC the ruler makes the angle θ with OX, and the angle XOY = 3θ.
   Proof: M, the middle of PQ, is the centre of the circle through P, B, Q (the angle PBQ is right),
   so MB = MP = MQ = k = OB; the exterior angle BMP = 2θ gives ∠BOM = 2θ. */
Curves.figure({
  id: 'fig-029',
  section: 'conchoid',
  page: 33,
  title: 'Trisection of an angle with the marked ruler',
  tags: ['trisection', 'marked ruler', 'neusis', 'Nicomedes'],
  note: 'Drawn for XOY = 67.5° (θ = 22.5°), where the dashed line BM is exactly perpendicular to OY, as in the book.',
  build(k) {
    const g = k.g;
    const kk = 100, th = g.deg(22.5);
    const O = k.pt(0, 0), B = k.pt(kk, 0);
    const dX = g.dir(3 * th), dR = g.dir(2 * th);
    const A = g.mul(dX, kk * Math.cos(3 * th));
    const P = g.lineLine(O, g.add(O, dR), A, B);
    const M = g.add(P, g.mul(dR, kk)), Q = g.add(P, g.mul(dR, 2 * kk));
    const Cend = g.add(B, g.mul(dX, 2.9 * kk));
    const Aend = g.add(B, g.mul(g.unit(g.sub(A, B)), g.dist(A, B) + 30));
    const conch = psi => { const r = kk * Math.cos(3 * th) / Math.cos(psi - 3 * th) + 2 * kk; return [r * Math.cos(psi), r * Math.sin(psi)]; };

    k.given('The angle XOY to be trisected, with its vertex O.', () => {
      k.seg(O, g.mul(dX, 2.89 * kk));
      k.seg(O, k.pt(2.6 * kk, 0));
      k.label(g.mul(dX, 2.89 * kk), 'X', 'ne', { dist: 0.9 });
      k.label(k.pt(2.6 * kk, 0), 'Y', 'n', { dist: 1.2 });
      k.pivot(O); k.label(O, 'O', 'se', { dist: 1.5 });
    });
    k.step('dividers', 'Choose a length k with the dividers and mark B on OY with OB = k.', () => {
      k.arc(O, kk, -0.2, 0.2, { cls: 'cons' });
      k.point(B, 'B', { at: 'se', open: true, lo: { dist: 1.2 } });
      k.text(kk / 2, 9, 'k', { size: 0.95 });
    });
    k.step('straightedge', 'Through B draw BC parallel to OX, and the perpendicular BA to OX (A is its foot on OX).', () => {
      k.seg(B, Cend);
      k.seg(Aend, B);
      k.point(A, 'A', { at: 'nw', open: true, lo: { dist: 1.4 } });
      k.label(Cend, 'C', 'ne', { dist: 0.9 });
    });
    k.step('ruler', 'The ruler carries two marks P and Q, 2k apart. Lay it with its edge through O and the mark P on the line AB; slide it about O until the mark Q falls on BC. The edge OPQ then makes the angle θ with OX.', () => {
      k.seg(g.add(O, g.mul(dR, -0.45 * kk)), g.add(Q, g.mul(dR, 0.3 * kk)), { cls: 'thick', w: 2.6 });
      k.point(P, 'P', { at: 'e', open: true, r: 1.2, lo: { dist: 1.6 } });
      k.point(Q, 'Q', { at: 'e', open: true, r: 1.2, lo: { dist: 1.6 } });
    });
    k.note('Why it works: M, the middle of PQ, is the centre of the circle through P, B and Q (the angle PBQ is right), so MB = MP = MQ = k = OB. Then the angles at Q and at O are θ and 2θ, and XOY = 3θ.', () => {
      k.dot(M, { open: true });
      k.seg(B, M, { cls: 'cons', dash: true });
      k.label(g.lerp(B, M, 0.5), 'k', 'w', { dist: 1.0 });
      k.label(g.lerp(P, M, 0.5), 'k', 'nw', { dist: 1.0 });
      k.label(g.lerp(M, Q, 0.5), 'k', 'nw', { dist: 1.0 });
      k.angle(O, k.pt(80, 0), M, { label: '2θ', r: 1.2, labelDist: 1.0 });
      k.angle(O, M, g.mul(dX, 100), { label: 'θ', r: 4.4, labelDist: 1.2 });
      k.angle(M, O, B, { label: '2θ', r: 1.5, labelDist: 1.7 });
      k.angle(Q, M, B, { label: 'θ', r: 1.6, labelDist: 1.3 });
    });
    k.step('pencil', 'The mark Q describes a conchoid of Nicomedes (the conchoid of the line AB with respect to O, constant 2k); where it meets BC the angle is trisected.', () => {
      k.curve(conch, [g.deg(12), g.deg(78)], { n: 200, nobounds: true });
    });
  }
});
