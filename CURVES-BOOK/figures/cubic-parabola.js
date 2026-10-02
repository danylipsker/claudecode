/* Curves Workshop · figures/cubic-parabola.js — Figs. 56–59 (pages 56–58)
 *
 * The four shapes of the cubic (56), the graphical solution of x³ + hx + k = 0 by the one curve y = x³ (57),
 * the mechanical solution with a straightedge pivoting at (−1, 0) (58), the trisection of an angle with y = 4x³ (59).
 * Panel (a)–(d) of Fig. 56 are drawn from cubics with the shapes of the book's sketches.
 */
(function () {
  'use strict';
  const PI = Math.PI;

  /* ================================================================ Fig. 56 — the four shapes */
  function shape56(k, o) {
    const g = k.g, O = k.pt(0, 0);
    k.given('The axes OX, OY of the graph of y = Ax³ + Bx² + Cx + D = A(x − a)(x² + bx + c).', () => {
      k.axes(O, { x: [o.x0, o.x1], y: [o.y0, o.y1], labels: false });
      k.label(k.pt(o.x1 - 20, 0), 'X', 'n', { cls: 'axis' });
      k.label(k.pt(0, o.y1 - 15), 'Y', 'e', { cls: 'axis' });
      k.dot(O, { open: true, r: 1.6 });
    });
    k.step('pencil', o.text, () => {
      k.curve(o.f, o.range, { n: 240 });
    });
    k.note('The condition on the quadratic factor x² + bx + c, written under the graph in the book.', () => {
      k.text(o.tx, o.ty, o.cond, { upright: true, size: 1, anchor: 'start' });
    });
  }

  Curves.figure({
    id: 'fig-056a', section: 'cubic-parabola', page: 56,
    title: 'The cubic with three real roots: b² − 4ac > 0',
    tags: ['cubic', 'graph', 'discriminant'],
    build(k) {
      const r = [-25, 182, 350], A = 4.98770e-5;
      shape56(k, {
        x0: -85, x1: 575, y0: -290, y1: 560, tx: 90, ty: -262, cond: 'b^2 − 4ac > 0',
        f: x => [x, A * (x - r[0]) * (x - r[1]) * (x - r[2])], range: [-63.5, 403],
        text: 'When the quadratic factor has two real roots the cubic crosses the x-axis three times: a maximum and a minimum lie between the roots.'
      });
    }
  });

  Curves.figure({
    id: 'fig-056b', section: 'cubic-parabola', page: 56,
    title: 'The cubic with a double root: b² − 4ac = 0',
    tags: ['cubic', 'graph', 'discriminant'],
    build(k) {
      const A = 4.85144e-5;
      shape56(k, {
        x0: -95, x1: 580, y0: -315, y1: 560, tx: 125, ty: -262, cond: 'b^2 − 4ac = 0',
        f: x => [x, A * (x - 67) * (x - 375) * (x - 375)], range: [41.9, 504],
        text: 'When the quadratic factor has a double root the two lower turns merge: the curve touches the x-axis there instead of crossing it.'
      });
    }
  });

  Curves.figure({
    id: 'fig-056c', section: 'cubic-parabola', page: 56,
    title: 'The cubic with one real root: b² − 4ac < 0',
    tags: ['cubic', 'graph', 'discriminant'],
    build(k) {
      const A = 3.2157e-5, m = 305.66, d = 93.54;
      shape56(k, {
        x0: -65, x1: 465, y0: -258, y1: 472, tx: 55, ty: -215, cond: 'b^2 − 4ac < 0',
        f: x => [x, A * (x + 63) * ((x - m) * (x - m) + d * d)], range: [-66, 430],
        text: 'When the quadratic factor has no real roots the cubic crosses the x-axis once, at x = a; it may still have a maximum and a minimum.'
      });
    }
  });

  Curves.figure({
    id: 'fig-056d', section: 'cubic-parabola', page: 56,
    title: 'The cubic y = Ax³ with a = b = c = 0',
    tags: ['cubic', 'graph', 'flex'],
    note: 'The book\'s sketch is lopsided; the true curve y = Ax³ is symmetrical about the origin, its point of inflexion.',
    build(k) {
      const A = 1.4225e-5;
      shape56(k, {
        x0: -250, x1: 300, y0: -248, y1: 452, tx: -118, ty: -210, cond: 'a = b = c = 0',
        f: x => [x, A * x * x * x], range: [-262, 262],
        text: 'When b = c = 0 as well the curve is the basic cubic parabola, with its point of inflexion at the origin where the tangent is the x-axis.'
      });
    }
  });

  /* ================================================================ Fig. 57 — the graphical solution */
  Curves.figure({
    id: 'fig-057', section: 'cubic-parabola', page: 57,
    title: 'Graphical solution of x³ + hx + k = 0 by the cubic parabola y = x³ and the line y + hx + k = 0',
    tags: ['cubic', 'graphical solution', 'monge'],
    build(k) {
      const u = 380, g = k.g;
      const r = [-0.8, -0.2, 1.0];                              // the three roots (sum zero, as the square term is missing)
      const h = r[0] * r[1] + r[0] * r[2] + r[1] * r[2], kk = -r[0] * r[1] * r[2];
      const O = k.pt(0, 0), Y = x => -h * x - kk;               // the line y = −hx − k
      const I = r.map(x => k.pt(x * u, x * x * x * u)), X = r.map(x => k.pt(x * u, 0));
      k.given('The axes OX, OY. The cubic x³ + hx + k = 0 (here h < 0, so that it has three real roots) is to be solved.', () => {
        k.axes(O, { x: [-0.87 * u, 1.38 * u], y: [-1.08 * u, 1.29 * u], labels: false });
        k.label(k.pt(1.36 * u, 0), 'X', 'n', { cls: 'axis' });
        k.label(k.pt(0, 1.27 * u), 'Y', 'e', { cls: 'axis' });
      });
      k.step('pencil', 'Draw the cubic parabola y = x³ once for all: it serves for every cubic of the form x³ + hx + k = 0.', () => {
        k.curve(x => [x * u, x * x * x * u], [-0.92, 1.04], { n: 240 });
      });
      k.step('straightedge', 'Draw the straight line y + hx + k = 0 (it cuts OY at height −k with slope −h). The abscissas of its meetings with the curve are the roots.', () => {
        k.seg(k.pt(-0.97 * u, Y(-0.97) * u), k.pt(1.17 * u, Y(1.17) * u));
        I.forEach(p => k.dot(p, { open: true, r: 1.5 }));
      });
      k.step('square', 'From each meeting point drop the perpendicular to OX (dashed). Its foot is a root: x1, x2, x3.', () => {
        I.forEach((p, i) => { k.seg(p, X[i], { cls: 'cons', dash: true }); k.dot(X[i], { open: true, r: 1.5 }); });
        k.label(g.add(X[0], { x: 0, y: 22 }), 'x_1', 'n', { upright: true });
        k.label(g.add(X[1], { x: 0, y: 22 }), 'x_2', 'n', { upright: true });
        k.label(g.add(X[2], { x: 0, y: 22 }), 'x_3', 'n', { upright: true });
      });
    }
  });

  /* ================================================================ Fig. 58 — the mechanical solution */
  Curves.figure({
    id: 'fig-058', section: 'cubic-parabola', page: 58,
    title: 'Mechanical solution: a straightedge pivoting at (−1, 0) and the curve y = x³',
    tags: ['cubic', 'mechanical solution', 'straightedge'],
    build(k) {
      const g = k.g, u = 100, m = -0.66, s = -m;                // the line y = −m(x + 1), slope −m = 0.66
      const bis = (f, a, b) => { let fa = f(a); for (let i = 0; i < 60; i++) { const c = (a + b) / 2, fc = f(c); if ((fa < 0) === (fc < 0)) { a = c; fa = fc; } else b = c; } return (a + b) / 2; };
      const xr = bis(x => x * x * x + m * (x + 1), 0.5, 2);       // the real root of x³ + m(x + 1) = 0
      const O = k.pt(0, 0), Pv = k.pt(-u, 0);
      k.given('The axes and the cubic parabola y = x³, drawn once.', () => {
        k.axes(O, { x: [-2.5 * u, 2.0 * u], y: [-1.86 * u, 2.52 * u], labels: false });
        k.label(k.pt(1.95 * u, 0), 'X', 'n', { cls: 'axis' });
        k.label(k.pt(0, 2.5 * u), 'Y', 'e', { cls: 'axis' });
        k.dot(O, { open: true, r: 1.6 });
        k.curve(x => [x * u, x * x * x * u], [-1.14, 1.21], { cls: 'given', width: 3.2, n: 200 });
      });
      k.step('linkage', 'Pivot the straightedge at (−1, 0) and turn it until it cuts OY at the height −m (the slope is −m): this is the line y + m(x + 1) = 0.', () => {
        k.seg(k.pt(-2.42 * u, s * (-1.42) * u), k.pt(1.52 * u, s * 2.52 * u), { cls: 'thick', width: 12 });
        k.circle(Pv, 13, { fill: '#1b1b1b' });
        k.label(Pv, '(−1,0)', 'sw', { upright: true, dist: 1.9, size: 0.9 });
        k.text(0.24 * u, 0.36 * u, '−m', { upright: true, anchor: 'start', size: 0.95 });
      });
      k.step('square', 'The straightedge meets the curve where x³ + m(x + 1) = 0. Drop the perpendicular to OX (dashed): the foot is the root x. Only the slope of the straightedge changes from one cubic to the next.', () => {
        k.seg(k.pt(xr * u, xr * xr * xr * u), k.pt(xr * u, 0), { cls: 'cons', dash: true });
        k.dot(k.pt(xr * u, 0), { open: true, r: 1.6 });
      });
      k.step('straightedge', 'The thin line through (−1, 0) touches the curve (at x = −3/2) and has slope 27/4. It separates the straightedge positions with three real roots (−m > 27/4) from those with one.', () => {
        k.seg(k.pt(-1.28 * u, -1.65 * u), k.pt(-0.62 * u, 2.5 * u), { cls: 'given' });
      });
    }
  });

  /* ================================================================ Fig. 59 — trisection of an angle */
  Curves.figure({
    id: 'fig-059', section: 'cubic-parabola', page: 58,
    title: 'Trisection of an angle with the cubic parabola y = 4x³ and the unit circle',
    tags: ['trisection', 'cubic', 'unit circle', 'construction'],
    build(k) {
      const g = k.g, u = 100, th = g.deg(25), th3 = 3 * th;
      const O = k.pt(0, 0), B = k.pt(1.62 * u, 0);
      const A = g.polar(O, u, th3), a = Math.cos(th3) * u, xP = Math.cos(th);
      const T = g.polar(O, u, th), P = k.pt(xP * u, 4 * Math.pow(xP, 3) * u);
      const Fa = k.pt(A.x, 0), Fp = k.pt(P.x, 0), Ya = k.pt(0, a), L1 = k.pt(-u, 0), L2 = k.pt(0, 3 * u);
      const par0 = k.pt(-a / 3, 0);
      k.given('The angle AOB = 3θ with OA a radius of the unit circle. The projection of A on OB is a = cos 3θ.', () => {
        k.seg(k.pt(-1.5 * u, 0), O);
        k.arrow(O, B, { cls: 'thick' });
        k.arc(O, u, g.deg(-13), g.deg(197));
        k.seg(O, g.polar(O, 1.22 * u, th3), { cls: 'thick' });
        k.seg(A, Fa);
        k.dot(O, { open: true, r: 1.6 });
        k.point(A, 'A', open('ne'));
        k.label(O, 'O', 'sw', { upright: true, dist: 1.6 });
        k.label(B, 'B', 'n', { upright: true, dist: 1.2 });
        k.text(a / 2, -0.09 * u, 'a', { upright: false });
      });
      k.step('pencil', 'Draw the cubic parabola y = 4x³ (once drawn it serves for every angle). With x = cos θ, cos 3θ = 4cos³θ − 3cos θ turns into 4x³ − 3x − a = 0.', () => {
        k.curve(x => [x * u, 4 * x * x * x * u], [0, xP + 0.002], { n: 120 });
      });
      k.step('straightedge', 'Draw the fixed line L of slope 3 through (−1, 0) and (0, 3).', () => {
        k.seg(L1, L2);
        k.dot(L1, { open: true, r: 1.4 }); k.dot(L2, { open: true, r: 1.4 });
        k.seg(O, L2, { cls: 'cons' });
        k.text(-0.63 * u, 1.62 * u, 'L', { upright: true });
      });
      k.step('square', 'Through the point (0, a) on OY draw the parallel to L, which has slope 3: its equation is y − 3x − a = 0. It meets the curve at P, and the abscissa of P is cos θ.', () => {
        k.seg(par0, P);
        k.dot(Ya, { open: true, r: 1.4 });
        k.point(P, 'P', open('e', 1.4));
      });
      k.step('square', 'From P draw the perpendicular to OB. It cuts the unit circle at T and OB at the distance x = cos θ from O.', () => {
        k.seg(k.pt(P.x, P.y + 0.12 * u), Fp);
        k.point(T, 'T', open('ne'));
        k.text(0.69 * u, 0.09 * u, 'x', { upright: false });
      });
      k.step('straightedge', 'Join O to T and carry the line on. OT is the trisecting line: the angle BOT is θ, a third of the angle AOB.', () => {
        k.seg(O, g.mul(T, 1.41));
        k.angle(O, B, T, { label: 'θ', r: 2.4, labelDist: 1.2 });
      });
    }
  });

  function open(at, r) { return { at: at, open: true, r: r || 1.4 }; }
})();
