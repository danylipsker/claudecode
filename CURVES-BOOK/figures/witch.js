/* Curves Workshop · figures/witch.js — Fig. 211 (page 237) */

/* Fig. 211, page 237 — the Witch of Agnesi. A circle of radius a on the diameter OK (OK = 2a, vertical).
   A secant through O cuts the circle at Q and the tangent at K at A. QP is drawn perpendicular to OK
   (horizontal), AP parallel to OK (vertical); the locus of P is the witch. With θ = ∠KOA:
   x = 2a tan θ, y = 2a cos² θ. The axis OX is the asymptote. The second secant (dashed) shows one more point. */
Curves.figure({
  id: 'fig-211',
  section: 'witch',
  page: 237,
  title: 'The witch of Agnesi',
  tags: ['witch', 'versiera', 'circle', 'secant', 'construction'],
  note: 'The book also marks a second secant (dashed) with its point A\' on the tangent and the point P\' of the witch below it.',
  build(k) {
    const g = k.g;
    const a = 100, th = Math.atan(1.39);
    const O = k.pt(0, 0), K = k.pt(0, 2 * a), Cc = k.pt(0, a);
    const at = Math.tan(th);
    const Aa = k.pt(2 * a * at, 2 * a);
    const Q = g.mul(k.pt(Math.sin(th), Math.cos(th)), 2 * a * Math.cos(th));
    const P = k.pt(Aa.x, Q.y);
    const Xf = k.pt(Aa.x, 0), Qf = k.pt(Q.x, 0);
    const th2 = Math.atan(0.556);
    const A2 = k.pt(2 * a * Math.tan(th2), 2 * a);
    const P2 = k.pt(A2.x, 2 * a * Math.cos(th2) * Math.cos(th2));
    const tEnd = Math.atan(1.49);
    const dimY = -12;

    k.given('The circle on the diameter OK (OK = 2a, so the radius is a), the tangent at K, and the axis OX through O.', () => {
      k.seg(k.pt(-302, 2 * a), k.pt(295, 2 * a));
      k.seg(k.pt(-289, 0), k.pt(300, 0), { cls: 'axis', arrow: 'end' });
      k.label(k.pt(293, 0), 'X', 'n', { dist: 1.5, cls: 'axis' });
      k.circle(Cc, a);
      k.seg(O, K);
      k.pivot(O); k.label(O, 'O', 'w', { dist: 1.8 });
      k.point(K, 'K', { at: 'sw', open: true, lo: { dist: 1.3 } });
      k.point(Cc, '', { open: true });
      k.text(-9, 150, 'a', { size: 0.95 });
      k.text(-9, 50, 'a', { size: 0.95 });
    });
    k.step('straightedge', 'Draw a secant OA through O. It cuts the circle again at Q and the tangent at K at A. θ is the angle KOA.', () => {
      k.seg(O, Aa);
      k.point(Q, 'Q', { at: 'w', open: true, lo: { dist: 1.4 } });
      k.point(Aa, 'A', { at: 'e', open: true, lo: { dist: 1.5 } });
      k.angle(O, Aa, K, { label: 'θ', r: 2.0, labelDist: 0.9, arrow: true });
    });
    k.step('square', 'From Q draw QP perpendicular to OK (horizontal), and from A the parallel AP to OK (vertical). They meet at P: its height is that of Q, its distance from OK is that of A.', () => {
      k.seg(Aa, Xf);
      k.seg(Q, P);
      k.point(Qf, '', { open: true });
      k.point(Xf, '', { open: true });
      k.seg(Q, Qf, { cls: 'cons', dash: true });
      k.point(P, 'P', { at: 'nw', open: true, lo: { dist: 1.3 } });
      k.text(Q.x + 7, Q.y / 2, 'y', { size: 0.95 });
      k.text(P.x - 8, P.y / 2, 'y', { size: 0.95 });
    });
    k.note('Marks of the book: the right angle OQK (dashed KQ), the angle θ at A, and the abscissa x = OX written between arrows.', () => {
      k.seg(K, Q, { cls: 'cons', dash: true });
      k.angle(Aa, O, Xf, { label: 'θ', r: 1.6, labelDist: 1.3 });
      k.seg(k.pt(0, dimY), k.pt(Aa.x / 2 - 14, dimY), { cls: 'given', arrow: 'start' });
      k.seg(k.pt(Aa.x / 2 + 14, dimY), k.pt(Aa.x, dimY), { cls: 'given', arrow: 'end' });
      k.text(Aa.x / 2, dimY, 'x', { size: 0.95 });
    });
    k.step('straightedge', 'A second secant gives another point in the same way (dashed): A\' on the tangent, and P\' at the height of its intersection with the circle.', () => {
      k.seg(O, A2, { cls: 'cons', dash: true });
      k.point(A2, '', { open: true });
      k.seg(A2, P2, { cls: 'cons', dash: true });
      k.point(P2, '', { open: true });
    });
    k.step('pencil', 'Repeat for every secant: P traces the witch of Agnesi, x = 2a tan θ, y = 2a cos² θ, with OX as its asymptote.', () => {
      k.curve(t => [2 * a * Math.tan(t), 2 * a * Math.cos(t) * Math.cos(t)], [-tEnd, tEnd], { n: 300 });
    });
  }
});
