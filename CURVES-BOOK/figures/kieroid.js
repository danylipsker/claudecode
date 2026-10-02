/* Curves Workshop · figures/kieroid.js — Figs. 138–139 (pages 141–142)
 *
 * Fig. 138   the general kieroid: circle of radius a with its centre B on the line AB, O at the distance c
 *            from AB, the line DE parallel to AB at the distance b, the secant OD with D the foot of B on DE
 * Fig. 139   the three special cases: (a) b = 0 conchoid, (b) b = a cissoid (plus an asymptote),
 *            (c) b = a with O on AB, strophoid (plus an asymptote)
 */
(function () {
  /* The kieroid in a frame where O is the origin, e1 the unit vector from O towards the line AB (perpendicular to it)
     and e2 the unit vector along AB. For the offset w along AB: B = O + c e1 + w e2 is the centre of the circle
     (radius a), D = B + b e1 is the point of the line DE on the same perpendicular, and the secant is OD.
     Its two intersections with the circle are the points P of the kieroid: near (P2) and far (P1). */
  function kier(g, O, e1, e2, a, b, c) {
    const B = w => g.add(O, g.add(g.mul(e1, c), g.mul(e2, w)));
    const D = w => g.add(B(w), g.mul(e1, b));
    const P = (w, which) => { const r = g.lineCircle(O, D(w), B(w), a); return r.length ? r[which] : null; };
    const branch = which => w => { const p = P(w, which); return p ? [p.x, p.y] : null; };
    return { B, D, P, branch };
  }
  const bisect = (f, lo, hi) => { const flo = f(lo) > 0; for (let i = 0; i < 70; i++) { const m = (lo + hi) / 2; if ((f(m) > 0) === flo) lo = m; else hi = m; } return (lo + hi) / 2; };

  /* Fig. 138, page 141. O is c above the line AB; DE is b below AB; B moves along AB and D is always directly
     below B. The circle of radius a about B meets the secant OD at P1 (far) and P2 (near). */
  Curves.figure({
    id: 'fig-138',
    section: 'kieroid',
    page: 141,
    title: 'The general kieroid',
    tags: ['kieroid', 'circle', 'secant'],
    note: 'Drawn with a = 1, b ≈ 0.63, c ≈ 1.55 (the proportions of the book). With these values c > a, so there is no double point. Both branches run out along the line DE.',
    build(k) {
      const g = k.g;
      const a = 100, b = 63, c = 155, w0 = 193;
      const O = k.pt(0, 0), e1 = k.pt(0, -1), e2 = k.pt(1, 0);
      const K = kier(g, O, e1, e2, a, b, c);
      const A = k.pt(0, -c), E = k.pt(0, -(c + b));
      const Bp = K.B(w0), D = K.D(w0);
      const [P2, P1] = [K.P(w0, 0), K.P(w0, 1)];
      const u = g.unit(g.sub(D, O));
      k.frame(-300, -292, 335, 36);
      // the branches are drawn over the same stretch as in the book: the upper one from x = -268 to 267, the lower one from -283 to 314
      const wx = (which, x) => bisect(w => K.P(w, which).x - x, -900, 900);

      k.given('The fixed point O, the line AB at the distance c from O (A is the foot of the perpendicular from O), the parallel line DE at the distance b from AB (E is on OA), and the radius a of the circle.', () => {
        k.seg(k.pt(0, 28), E);
        k.seg(k.pt(-272, -c), k.pt(304, -c));
        k.seg(k.pt(-275, -(c + b)), k.pt(297, -(c + b)));
        k.pivot(O); k.label(O, 'O', 'w', { dist: 2.4 });
        k.point(A, 'A', { at: 'nw', open: true, lo: { dist: 1.3 } });
        k.point(E, 'E', { at: 'nw', open: true, lo: { dist: 1.3 } });
        k.text(10, -c + 50, 'a', { size: 0.95 });
        k.text(10, -c - b / 2, 'b', { size: 0.95 });
      });
      k.step('square', 'Choose a point D on DE and drop the perpendicular from D to AB: its foot B is the centre of the circle (D is the middle of the chord that the circle cuts from DE).', () => {
        k.point(D, 'D', { at: 'ne', open: true, lo: { dist: 1.3 } });
        k.seg(Bp, D);
        k.point(Bp, 'B', { at: 'nw', open: true, lo: { dist: 1.3 } });
      });
      k.step('compass', 'Draw the circle of radius a about B.', () => {
        k.circle(Bp, a);
        k.text(Bp.x + 45, -c - 8, 'a', { size: 0.95 });
      });
      k.step('straightedge', 'Draw the secant OD. It cuts the circle at P2 (the nearer point) and P1 (the farther one): both are points of the kieroid.', () => {
        k.seg(O, g.add(P1, g.mul(u, 6)));
        k.point(P2, 'P_2', { at: 'nw', open: true, lo: { dist: 1.3 } });
        k.point(P1, 'P_1', { at: 'se', open: true, lo: { dist: 1.3 } });
        k.angle(O, k.pt(0, -60), D, { label: 'θ', r: 2.6, labelDist: 1.2 });
      });
      k.step('pencil', 'Slide B along AB and repeat. P2 draws the upper branch (it passes at the distance a above A) and P1 the lower; both approach the line DE.', () => {
        k.curve(K.branch(0), [wx(0, -268), wx(0, 267)], { n: 300 });
        k.curve(K.branch(1), [wx(1, -283), wx(1, 314)], { n: 300 });
      });
    }
  });

  /* Fig. 139, page 142 — the three special cases, drawn with O at the left and AB vertical. */
  const w139 = 222;

  /* (a) b = 0: the line DE coincides with AB, D = B and the kieroid is the conchoid of Nicomedes. */
  Curves.figure({
    id: 'fig-139a',
    section: 'kieroid',
    page: 142,
    title: 'Kieroid with b = 0: the conchoid of Nicomedes',
    tags: ['kieroid', 'conchoid', 'special case'],
    build(k) {
      const g = k.g;
      const a = 100, b = 0, c = 185;
      const O = k.pt(0, 0), A = k.pt(c, 0);
      const K = kier(g, O, k.pt(1, 0), k.pt(0, 1), a, b, c);
      const Bp = K.B(w139), [P2, P1] = [K.P(w139, 0), K.P(w139, 1)];
      const u = g.unit(Bp);
      const wTop0 = bisect(w => K.P(w, 0).y - 220, 100, 800), wTop1 = bisect(w => K.P(w, 1).y - 227, 100, 800);
      const wLo0 = bisect(w => K.P(w, 0).y + 31, -200, 5), wLo1 = bisect(w => K.P(w, 1).y + 33, -200, 5);

      k.given('The fixed point O with the axis through it, the line AB at the distance c from O (here DE is the same line, b = 0), and the radius a.', () => {
        k.seg(k.pt(-16, 0), k.pt(c + a + 6, 0), { cls: 'given' });
        k.seg(A, k.pt(c, 331));
        k.pivot(O); k.label(O, 'O', 'nw', { dist: 1.6 });
        k.point(A, '', { open: true });
      });
      k.step('compass', 'Choose B on AB and draw the circle of radius a about it.', () => {
        k.circle(Bp, a);
        k.point(Bp, '', { open: true });
      });
      k.step('straightedge', 'Draw the secant OB (D is the same point as B). It meets the circle at P2 and P1, each at the distance a from B.', () => {
        k.seg(O, P1);
        k.point(P2, 'P_2', { at: 'se', open: true, lo: { dist: 1.2 } });
        k.point(P1, 'P_1', { at: 'ne', open: true, lo: { dist: 1.2 } });
      });
      k.step('pencil', 'Move B along AB: P2 and P1 trace the two branches of the conchoid of Nicomedes with the pole O (here a < c, so there is no loop).', () => {
        k.curve(K.branch(0), [wLo0, wTop0], { n: 200 });
        k.curve(K.branch(1), [wLo1, wTop1], { n: 200 });
      });
    }
  });

  /* (b) b = a: the circle touches DE at D = P1, the far branch is the line DE itself, the near branch is a cissoid. */
  Curves.figure({
    id: 'fig-139b',
    section: 'kieroid',
    page: 142,
    title: 'Kieroid with b = a: the cissoid (plus an asymptote)',
    tags: ['kieroid', 'cissoid', 'special case'],
    build(k) {
      const g = k.g;
      const a = 100, b = 100, c = 191;
      const O = k.pt(0, 0), A = k.pt(c, 0), Fd = k.pt(c + b, 0);
      const K = kier(g, O, k.pt(1, 0), k.pt(0, 1), a, b, c);
      const Bp = K.B(w139), D = K.D(w139), P2 = K.P(w139, 0);
      const wTop = bisect(w => K.P(w, 0).y - 280, 100, 900), wLo = bisect(w => K.P(w, 0).y + 34, -200, 5);

      k.given('The fixed point O with the axis through it, the line AB at the distance c from O, the parallel line DE at the distance b = a from AB, and the radius a.', () => {
        k.seg(k.pt(-17, 0), k.pt(c + b + 14, 0));
        k.seg(A, k.pt(c, 337));
        k.seg(Fd, k.pt(c + b, 339), { cls: 'thick' });
        k.seg(Fd, k.pt(c + b, -29), { cls: 'thick' });
        k.pivot(O); k.label(O, 'O', 'nw', { dist: 1.6 });
        k.point(A, '', { open: true });
        k.point(Fd, '', { open: true });
        k.text(c + 50, 10, 'a', { size: 0.95 });
      });
      k.step('square', 'Choose D on DE and drop the perpendicular DB to AB. The circle of radius a about B touches DE at D.', () => {
        k.seg(Bp, D, { cls: 'cons' });
        k.circle(Bp, a);
        k.point(Bp, '', { open: true });
      });
      k.step('straightedge', 'Draw the secant OD. It meets the circle at D itself (this is P1, which stays on the line DE) and at the second point P2.', () => {
        k.seg(O, D);
        k.point(D, 'P_1', { at: 'nw', open: true, lo: { dist: 1.5 } });
        k.point(P2, 'P_2', { at: 'nw', open: true, lo: { dist: 1.5 } });
      });
      k.step('pencil', 'Slide D along DE. P2 traces the cissoid, with DE as its asymptote; P1 traces the line DE itself.', () => {
        k.curve(K.branch(0), [wLo, wTop], { n: 240 });
      });
    }
  });

  /* (c) b = a and O on AB (A = O): the near branch is a strophoid. */
  Curves.figure({
    id: 'fig-139c',
    section: 'kieroid',
    page: 142,
    title: 'Kieroid with b = a and O on AB: the strophoid (plus an asymptote)',
    tags: ['kieroid', 'strophoid', 'special case'],
    note: 'The book writes the condition as b = a = −c and says that O and A coincide; the figure shows O on the line AB, which is c = 0 in the notation used here.',
    build(k) {
      const g = k.g;
      const a = 100, b = 100, c = 0;
      const O = k.pt(0, 0), Fd = k.pt(a, 0);
      const K = kier(g, O, k.pt(1, 0), k.pt(0, 1), a, b, c);
      const Bp = K.B(w139), D = K.D(w139), P2 = K.P(w139, 0);
      const sf = t => { const r = a * (1 / Math.cos(t) - 2 * Math.cos(t)); return [r * Math.cos(t), r * Math.sin(t)]; };

      k.given('The fixed point O on the line AB (so A = O), the axis through O, the parallel line DE at the distance b = a, and the radius a.', () => {
        k.seg(k.pt(-52, 0), k.pt(a + 11, 0));
        k.seg(O, k.pt(0, 338));
        k.seg(Fd, k.pt(a, 347), { cls: 'thick' });
        k.seg(Fd, k.pt(a, -31), { cls: 'thick' });
        k.pivot(O); k.label(O, 'O', 's', { dist: 2.4 });
        k.point(Fd, '', { open: true });
        k.text(50, 10, 'a', { size: 0.95 });
      });
      k.step('square', 'Choose D on DE; the point B is the foot of the perpendicular from D to AB. The circle of radius a about B touches DE at D.', () => {
        k.seg(Bp, D, { cls: 'cons' });
        k.circle(Bp, a);
        k.point(Bp, '', { open: true });
      });
      k.step('straightedge', 'Draw the secant OD. It meets the circle at D (P1, on the line DE) and at P2.', () => {
        k.seg(O, D);
        k.point(D, 'P_1', { at: 'ne', open: true, lo: { dist: 1.5 } });
        k.point(P2, 'P_2', { at: 'w', open: true, lo: { dist: 1.5 } });
      });
      k.step('pencil', 'Slide D along DE. P2 traces the strophoid r = a(sec θ − 2 cos θ) with its node at O, and P1 the asymptote DE.', () => {
        k.curve(sf, [g.deg(-52), g.deg(75.5)], { n: 360 });
      });
    }
  });
})();
