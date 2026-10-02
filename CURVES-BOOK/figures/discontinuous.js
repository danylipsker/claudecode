/* Curves Workshop · figures/discontinuous.js — Figs. 90–103 (pages 100–107)
 *
 * Functions with discontinuous properties: removable discontinuities (90–93), jumps and
 * oscillations (94–98), the functions x^x and x^(1/x) with their dotted branches (99, 100), and the
 * three limit-processes of section 3: the saw-tooth path (101), the snowflake curve (102) and the
 * Sierpinski curve (103).
 */
(function () {
  const PI = Math.PI;
  const aux = { cls: 'cons', dash: true };
  const T = (k, x, y, s, o) => k.text(x, y, s, Object.assign({ upright: true, size: 0.85 }, o || {}));
  /* a graph y = f(x) in real units: the point (x·ux, f(x)·uy), null where f is undefined */
  const graph = (k, f, a, b, ux, uy, o, ylim) => k.curve(x => { const y = f(x); return (y == null || !isFinite(y) || (ylim && Math.abs(y) > ylim)) ? null : [x * ux, y * uy]; }, [a, b], o);

  /* Fig. 90, page 100 — y = (x² − 4)/(x − 2) is the line y = x + 2 with the point (2, 4) missing */
  Curves.figure({
    id: 'fig-090',
    section: 'discontinuous',
    page: 100,
    title: 'A removable discontinuity: y = (x² − 4)/(x − 2)',
    tags: ['removable', 'limit'],
    build(k) {
      const u = 50, O = k.pt(0, 0), P = (x, y) => k.pt(x * u, y * u);
      k.given('The axes. The function is undefined at x = 2, so the point of the graph above x = 2 will be an open circle.', () => {
        k.axes(O, { x: [-3.4 * u, 3.4 * u], y: [-1.5 * u, 5.3 * u] });
        k.dot(O, { open: true });
        k.seg(P(2, 0), P(2, 4), aux);
        T(k, 2 * u, -0.28 * u, '2', { size: 0.9 });
      });
      k.step('pencil', 'Away from x = 2 the quotient equals x + 2 (the factor x − 2 cancels): draw the line y = x + 2 and leave the point (2, 4) open.', () => {
        k.seg(P(-2.5, -0.5), P(2.8, 4.8), { cls: 'curve' });
        k.dot(P(2, 4), { open: true });
      });
      k.note('The limit of y as x → 2 is 4 (marked on the y-axis): the discontinuity is removable, because giving y the value 4 at x = 2 makes the graph continuous.', () => {
        k.seg(P(0, 4), P(2, 4), aux);
        T(k, -0.12 * u, 4 * u, '4', { size: 0.9, anchor: 'end' });
      });
    }
  });

  /* Fig. 91, page 100 — y = (x³ − 1)/(x − 1) is the parabola y = x² + x + 1 without the point (1, 3) */
  Curves.figure({
    id: 'fig-091',
    section: 'discontinuous',
    page: 100,
    title: 'A removable discontinuity: y = (x³ − 1)/(x − 1)',
    tags: ['removable', 'limit'],
    build(k) {
      const u = 42, O = k.pt(0, 0), P = (x, y) => k.pt(x * u, y * u);
      k.given('The axes. The function is undefined at x = 1.', () => {
        k.axes(O, { x: [-2.9 * u, 2.5 * u], y: [-0.8 * u, 5.6 * u] });
        k.dot(O, { open: true });
        k.seg(P(1, 0), P(1, 3), aux);
        T(k, 1 * u, -0.3 * u, '1', { size: 0.9 });
      });
      k.step('pencil', 'Away from x = 1 the quotient equals x² + x + 1 (divide x³ − 1 by x − 1): draw this parabola, with its lowest point at (−1/2, 3/4), and leave the point (1, 3) open.', () => {
        graph(k, x => x * x + x + 1, -2.5, 1.65, u, u, { n: 160 });
        k.dot(P(1, 3), { open: true });
      });
      k.note('The limit of y as x → 1 is 3.', () => {
        k.seg(P(0, 3), P(1, 3), aux);
        T(k, -0.12 * u, 3 * u, '3', { size: 0.9, anchor: 'end' });
      });
    }
  });

  /* Fig. 92, page 101 — y = sin x / x, with the bounding hyperbolas xy = ±1.
     The book draws the y-axis about 3.7 times as long as the x-axis (one unit up = 3.7 units across). */
  Curves.figure({
    id: 'fig-092',
    section: 'discontinuous',
    page: 101,
    title: 'y = sin x / x between the hyperbolas xy = ±1',
    tags: ['removable', 'limit', 'bound'],
    note: 'As in the book, the unit on the y-axis is about 3.7 times the unit on the x-axis.',
    build(k) {
      const ux = 22, uy = 80, O = k.pt(0, 0);
      const P = (x, y) => k.pt(x * ux, y * uy);
      k.given('The axes and the four branches of the bounding hyperbolas xy = 1 and xy = −1; |sin x| ≤ 1 gives |sin x / x| ≤ 1/|x|.', () => {
        k.axes(O, { x: [-10.2 * ux, 10.4 * ux], y: [-1.3 * uy, 2.1 * uy] });
        k.dot(O, { open: true });
        [1, -1].forEach(s => {
          graph(k, x => s / x, s > 0 ? 0.5 : 0.85, 9.6, ux, uy, { cls: 'cons', n: 200 });
          graph(k, x => s / x, -9.6, s > 0 ? -0.85 : -0.5, ux, uy, { cls: 'cons', n: 200 });
        });
      });
      k.step('pencil', 'The curve y = sin x / x for −3π ≤ x ≤ 3π: it touches the hyperbolas where |sin x| = 1, crosses the x-axis at ±π, ±2π, ±3π, and has its maximum 1 at x = 0, where the point is open.', () => {
        graph(k, x => (Math.abs(x) < 1e-9 ? 1 : Math.sin(x) / x), -3 * PI, 3 * PI, ux, uy, { n: 500 });
        k.dot(P(0, 1), { open: true });
      });
      k.note('The marks on the axis.', () => {
        T(k, -PI * ux, -0.17 * uy, '−π', { size: 0.8 });
        T(k, PI * ux, -0.17 * uy, 'π', { size: 0.8 });
        T(k, 2 * PI * ux, 0.14 * uy, '2π', { size: 0.8 });
      });
    }
  });

  /* Fig. 93, page 101 — y = x sin(1/x), bounded by the lines y = ±x */
  Curves.figure({
    id: 'fig-093',
    section: 'discontinuous',
    page: 101,
    title: 'y = x · sin(1/x) between the lines y = ±x',
    tags: ['removable', 'limit', 'oscillation'],
    note: 'The book\'s sketch lets both branches run up along the diagonals; the true graph of x·sin(1/x) is even, oscillates inside the lines y = ±x near the origin and levels off at y = 1 as |x| grows, so it is drawn that way here.',
    build(k) {
      const u = 190, O = k.pt(0, 0), P = (x, y) => k.pt(x * u, y * u);
      k.given('The axes and the bounding lines y = x and y = −x (|x · sin(1/x)| ≤ |x|), dashed.', () => {
        k.axes(O, { x: [-1.3 * u, 1.3 * u], y: [-1.25 * u, 1.3 * u] });
        k.seg(P(-1.2, -1.2), P(1.2, 1.2), aux);
        k.seg(P(-1.2, 1.2), P(1.2, -1.2), aux);
        k.dot(O, { open: true });
      });
      k.step('pencil', 'The curve: the same oscillation on both sides (the function is even). Put u = 1/x: the points (1/u, sin(u)/u) touch the lines y = ±x at the points where sin(1/x) = ±1, x = 2/((2m + 1)π), the waves crowd towards the origin, and the curve stays between y = −1 and y = 1.', () => {
        [1, -1].forEach(s => k.curve(w => { const x = s * 1 / w; return [x * u, x * Math.sin(1 / x) * u]; }, [1 / 1.2, 70], { n: 2600 }));
      });
      k.note('The limit at x = 0 is 0, so the open point at the origin is removable. For large |x| the curve approaches the line y = 1 (dashed).', () => {
        k.seg(P(0.64, 1), P(1.25, 1), { cls: 'aux', dash: true });
        T(k, 0.8 * u, 1.09 * u, 'y = 1', { size: 0.8 });
      });
    }
  });

  /* Fig. 94, page 102 — y = arc tan(1/x): a jump of π at x = 0 */
  Curves.figure({
    id: 'fig-094',
    section: 'discontinuous',
    page: 102,
    title: 'A jump: y = arc tan(1/x)',
    tags: ['jump', 'limit'],
    note: 'As in the book, the unit on the y-axis is 2.5 times the unit on the x-axis.',
    build(k) {
      const ux = 40, uy = 100, O = k.pt(0, 0), P = (x, y) => k.pt(x * ux, y * uy);
      k.given('The axes; at x = 0 the function is undefined.', () => {
        k.axes(O, { x: [-6 * ux, 6.2 * ux], y: [-2.1 * uy, 2.5 * uy] });
        k.dot(O, { open: true });
      });
      k.step('pencil', 'The graph of y = arc tan(1/x). For x > 0 it falls from π/2 to 0 as x grows; for x < 0 it falls from 0 to −π/2 as x → 0 from the left. Both ends at x = 0 are open.', () => {
        graph(k, x => Math.atan(1 / x), 0.0001, 5.6, ux, uy, { n: 200 });
        graph(k, x => Math.atan(1 / x), -5.6, -0.0001, ux, uy, { n: 200 });
        k.dot(P(0, PI / 2), { open: true });
        k.dot(P(0, -PI / 2), { open: true });
      });
      k.note('The two one-sided limits are finite but different: π/2 from the right and −π/2 from the left.', () => {
        T(k, -0.25 * ux, 0.78 * uy, 'π/2', { size: 0.9, anchor: 'end' });
        T(k, 0.25 * ux, -0.78 * uy, '−π/2', { size: 0.9, anchor: 'start' });
      });
    }
  });

  /* Fig. 95, page 102 — y = sin(1/x) oscillates between −1 and 1 near x = 0 */
  Curves.figure({
    id: 'fig-095',
    section: 'discontinuous',
    page: 102,
    title: 'No limit: y = sin(1/x)',
    tags: ['oscillation', 'limit'],
    note: 'As in the book, the unit on the x-axis is twice the unit on the y-axis.',
    build(k) {
      const ux = 300, uy = 150, O = k.pt(0, 0), P = (x, y) => k.pt(x * ux, y * uy);
      k.given('The axes and the two dashed lines y = 1 and y = −1 between which the curve lies.', () => {
        k.axes(O, { x: [-0.95 * ux, 0.95 * ux], y: [-1.45 * uy, 1.5 * uy] });
        k.dot(O, { open: true });
        k.seg(P(-0.88, 1), P(0.88, 1), aux);
        k.seg(P(-0.88, -1), P(0.88, -1), aux);
      });
      k.step('pencil', 'The curve y = sin(1/x). Put u = 1/x and plot (1/u, sin u): the first maximum is at x = 2/π, then each half-wave is shorter than the one before it, so that infinitely many waves crowd into every neighbourhood of x = 0. The x-axis is an asymptote.', () => {
        [1, -1].forEach(s => k.curve(w => { const x = s / w; return [x * ux, Math.sin(1 / x) * uy]; }, [1 / 0.84, 14.3], { n: 900 }));
      });
    }
  });

  /* Fig. 96, page 103 — the limit function with values +1 and −1, undefined at the integers */
  Curves.figure({
    id: 'fig-096',
    section: 'discontinuous',
    page: 103,
    title: 'A function equal to +1 and −1 on alternate intervals, undefined at the integers',
    tags: ['limit function', 'jump'],
    note: 'y = lim (1 + sin πx)^t + 1 over (1 + sin πx)^t − 1 as t → ∞: +1 where sin πx > 0, −1 where sin πx < 0, undefined where sin πx = 0.',
    build(k) {
      const u = 55, O = k.pt(0, 0), P = (x, y) => k.pt(x * u, y * u);
      k.given('The axes.', () => {
        k.axes(O, { x: [-2.7 * u, 3.5 * u], y: [-1.8 * u, 2.2 * u] });
        k.dot(O, { open: true });
        T(k, -0.14 * u, 1 * u, '1', { size: 0.8, anchor: 'end' });
        T(k, 0.14 * u, -1 * u, '−1', { size: 0.8, anchor: 'start' });
      });
      k.step('pencil', 'Where sin πx > 0 (x between 0 and 1, between 2 and 3, between −2 and −1) the limit is 1: (1 + sin πx)^t grows without bound. Where sin πx < 0 (between 1 and 2, between −1 and 0) the powers tend to 0 and the limit is −1. At every integer the quotient is 0/0: the value is undefined, so each end of each piece is open.', () => {
        for (let n = -2; n < 3; n++) {
          const v = (((n % 2) + 2) % 2 === 0) ? 1 : -1;
          k.seg(P(n, v), P(n + 1, v), { cls: 'curve', width: 3 });
          k.dot(P(n, v), { open: true, r: 0.75 });
          k.dot(P(n + 1, v), { open: true, r: 0.75 });
        }
      });
    }
  });

  /* Fig. 97, page 103 — y = 2^{1/x} */
  Curves.figure({
    id: 'fig-097',
    section: 'discontinuous',
    page: 103,
    title: 'y = 2^(1/x): the left and right limits at 0 differ',
    tags: ['non-removable', 'asymptote'],
    build(k) {
      const u = 60, O = k.pt(0, 0), P = (x, y) => k.pt(x * u, y * u);
      const f = x => Math.pow(2, 1 / x);
      k.given('The axes and the dashed line y = 1, the value of 2^(1/x) as x → ±∞.', () => {
        k.seg(O, P(0, 4.6), { cls: 'axis', arrow: 'end' });
        k.seg(P(-2.6, 0), P(2.4, 0), { cls: 'axis', arrow: 'end' });
        k.label(P(0, 4.6), 'Y', 'ne', { cls: 'axis' });
        k.label(P(2.4, 0), 'X', 'se', { cls: 'axis' });
        k.dot(O, { open: true });
        k.seg(P(-2.6, 1), P(2.4, 1), aux);
        T(k, 2.35 * u, 1.18 * u, 'y = 1', { size: 0.8, anchor: 'end' });
      });
      k.step('pencil', 'For x < 0 the curve rises from the open point at the origin (2^(1/x) → 0) towards the asymptote y = 1; for x > 0 it comes down from +∞ at the y-axis towards the same asymptote.', () => {
        graph(k, f, -2.3, -0.0001, u, u, { n: 400 });
        graph(k, f, 0.0001, 2.1, u, u, { n: 500 }, 4.4);
      });
    }
  });

  /* Fig. 98, page 104 — y = 1/(2^{1/x} + 1) */
  Curves.figure({
    id: 'fig-098',
    section: 'discontinuous',
    page: 104,
    title: 'y = 1/(2^(1/x) + 1): finite limits 1 and 0 from the two sides',
    tags: ['jump', 'limit'],
    build(k) {
      const u = 150, O = k.pt(0, 0), P = (x, y) => k.pt(x * u, y * u);
      const f = x => 1 / (Math.pow(2, 1 / x) + 1);
      k.given('The axes and the dashed line y = 1/2, the value of the function as x → ±∞.', () => {
        k.seg(O, P(0, 1.4), { cls: 'axis', arrow: 'end' });
        k.seg(P(-1.45, 0), P(1.5, 0), { cls: 'axis', arrow: 'end' });
        k.label(P(0, 1.4), 'Y', 'ne', { cls: 'axis' });
        k.label(P(1.5, 0), 'X', 'se', { cls: 'axis' });
        k.seg(P(-1.45, 0.5), P(1.5, 0.5), aux);
        T(k, 0.78 * u, 0.57 * u, 'y = 1/2', { size: 0.8 });
      });
      k.step('pencil', 'For x < 0 the curve rises from 1/2 to 1 as x → 0; for x > 0 it rises from 0 (at x → 0) to 1/2. Both ends at x = 0 are open.', () => {
        graph(k, f, -1.4, -0.0001, u, u, { n: 300 });
        graph(k, f, 0.0001, 1.55, u, u, { n: 300 });
      });
      k.note('The three open points on the y-axis: the left limit 1, the middle value 1/2 where the dashed line crosses, and the right limit 0 at the origin (double circle).', () => {
        k.dot(P(0, 1), { open: true, r: 0.8 });
        k.dot(P(0, 0.5), { open: true, r: 0.8 });
        k.dot(O, { open: true, r: 1.7 });
        k.dot(O, { open: true, r: 0.8 });
      });
    }
  });

  /* Fig. 99, page 104 — y = x^x */
  Curves.figure({
    id: 'fig-099',
    section: 'discontinuous',
    page: 104,
    title: 'y = x^x, with the dotted branches for x < 0',
    tags: ['dotted branches', 'limit'],
    note: 'The dotted points are the values the power takes at the rational x with odd denominator, both signs, plus the second root −x^x for x > 0 when the denominator is even.',
    build(k) {
      const ux = 70, uy = 42, O = k.pt(0, 0), P = (x, y) => k.pt(x * ux, y * uy);
      const xx = x => Math.pow(x, x);
      const xm = x => Math.pow(-x, x);                              // |x|^x for x < 0, i.e. |x|^(−|x|)
      k.given('The axes.', () => {
        k.axes(O, { x: [-2.7 * ux, 2.4 * ux], y: [-3.7 * uy, 3.8 * uy] });
        k.dot(O, { open: true });
      });
      k.step('pencil', 'For x > 0 the curve starts at the open point (0, 1) (x^x → 1 as x → 0+), falls to its lowest value (1/e)^(1/e) ≈ 0.69 at x = 1/e, and then climbs steeply.', () => {
        graph(k, xx, 0.0001, 1.95, ux, uy, { n: 300 }, 3.65);
        k.dot(P(0, 1), { open: true });
      });
      k.note('For x < 0 the points are everywhere discontinuous: they exist only at rational x, with the value ±|x|^−|x|, and lie on the dotted curves; the lower dotted curve for x > 0 is −x^x.', () => {
        graph(k, x => xm(x), -2.65, -0.0004, ux, uy, { dotted: true, cls: 'given', n: 500 });
        graph(k, x => -xm(x), -2.65, -0.0004, ux, uy, { dotted: true, cls: 'given', n: 500 });
        graph(k, x => -xx(x), 0.0004, 1.95, ux, uy, { dotted: true, cls: 'given', n: 500 }, 3.65);
      });
    }
  });

  /* Fig. 100, page 105 — y = x^{1/x} */
  Curves.figure({
    id: 'fig-100',
    section: 'discontinuous',
    page: 105,
    title: 'y = x^(1/x), with the dotted branches',
    tags: ['dotted branches', 'limit'],
    note: 'The curve x^(1/x) has its maximum e^(1/e) ≈ 1.445 at x = e. Dotted branches as in Fig. 99.',
    build(k) {
      const u = 88, O = k.pt(0, 0), P = (x, y) => k.pt(x * u, y * u);
      const f = x => Math.pow(x, 1 / x);                              // x > 0
      const fa = x => Math.pow(-x, 1 / x);                            // |x|^(1/x) for x < 0
      k.given('The axes and the two dashed lines y = 1 and y = −1, the limits of x^(1/x) as x → +∞ and of the negative branch.', () => {
        k.axes(O, { x: [-4.7 * u, 5.5 * u], y: [-3.05 * u, 3.15 * u] });
        k.dot(O, { open: true });
        k.seg(P(-4.7, 1), P(5.3, 1), aux);
        k.seg(P(-4.7, -1), P(5.3, -1), aux);
      });
      k.step('pencil', 'For x > 0 the curve leaves the origin (x^(1/x) → 0 as x → 0+), rises to its maximum e^(1/e) ≈ 1.44 at x = e and sinks slowly to the asymptote y = 1.', () => {
        graph(k, f, 0.0001, 5.3, u, u, { n: 500 });
      });
      k.note('For x < 0 the power is defined only at rational x with odd denominator and has either sign: the points lie on the dotted curves ±|x|^(1/x), which tend to ±∞ as x → 0− and cross the dashed lines at x = −1; the lower dotted curve for x > 0 is −x^(1/x).', () => {
        graph(k, x => fa(x), -4.4, -0.45, u, u, { dotted: true, cls: 'given', n: 600 }, 3);
        graph(k, x => -fa(x), -4.4, -0.45, u, u, { dotted: true, cls: 'given', n: 600 }, 3);
        graph(k, x => -f(x), 0.0004, 5.0, u, u, { dotted: true, cls: 'given', n: 500 });
      });
    }
  });

  /* Fig. 101, page 106 — the saw-tooth path of constant length between A and B */
  Curves.figure({
    id: 'fig-101',
    section: 'discontinuous',
    page: 106,
    title: 'The saw-tooth path between A and B by repeated halving',
    tags: ['limit process', 'saw tooth'],
    note: 'The path of the n-th figure has 2^(n+1) sides each of length AC/2^n, so its length stays 2·AC for every n, while its corners crowd along AB.',
    build(k) {
      const g = k.g;
      const A = k.pt(0, 0), B = k.pt(835, 0), C = k.pt(417.5, 369);
      /* the path from A to B by the n-th halving: the sides of the isosceles triangle ACB are halved at M1, M2, the
         rhombus C M1 V M2 is completed (V is the midpoint of AB), and the same is done in the two triangles A M1 V and V M2 B */
      const path = (a, c, b, n) => {
        if (n === 0) return [a, c, b];
        const m1 = g.mid(a, c), m2 = g.mid(c, b), v = g.mid(a, b);
        return path(a, m1, v, n - 1).concat(path(v, m2, b, n - 1).slice(1));
      };
      const draw = (pts, o) => { for (let i = 0; i + 1 < pts.length; i++) k.seg(pts[i], pts[i + 1], o); };
      k.given('The isosceles triangle ABC; the path A–C–B is its two equal sides.', () => {
        draw([A, C, B], { cls: 'cons' });
        k.point(A, 'A', { at: 'sw', open: true });
        k.point(B, 'B', { at: 'se', open: true });
        k.point(C, 'C', { at: 'nw', open: true });
      });
      k.step('straightedge', 'Halve AC at M1 and CB at M2; draw M1V parallel to CB and M2V parallel to AC, where V is the midpoint of AB. The path A–M1–V–M2–B has the same length 2·AC.', () => {
        const p1 = path(A, C, B, 1);
        draw(p1, { cls: 'given', width: 2.2 });
        p1.slice(1, -1).forEach(p => k.dot(p, { open: true, r: 0.7 }));
      });
      k.step('straightedge', 'Do the same in each of the two small isosceles triangles A M1 V and V M2 B: the path now has 8 sides, each AC/4 long.', () => {
        const p2 = path(A, C, B, 2);
        draw(p2, { cls: 'given', width: 2.6 });
      });
      k.step('pencil', 'And once more in each of the four small triangles: 16 sides of length AC/8 form the saw tooth. Repeating without end gives a continuous path of constant length with no tangent at the corners.', () => {
        const p3 = path(A, C, B, 3);
        for (let i = 0; i + 1 < p3.length; i++) k.seg(p3[i], p3[i + 1], { cls: 'curve', width: 3 });
        p3.slice(1, -1).forEach(p => k.dot(p, { open: true, r: 0.6 }));
      });
    }
  });

  /* Fig. 102, page 106 — the snowflake (von Koch) curve, stages 0 to 3 side by side */
  Curves.figure({
    id: 'fig-102',
    section: 'discontinuous',
    page: 106,
    title: 'The snowflake (von Koch) curve: the first four stages',
    tags: ['limit process', 'fractal', 'snowflake'],
    note: 'Stage n has 3·4^n sides of length 1/3^n of the side of the triangle; the length grows by 4/3 at each stage without bound, while the area stays finite.',
    build(k) {
      const g = k.g;
      const s = 100, gap = 14;
      const tri = [k.pt(0, 0), k.pt(s, 0), k.pt(s / 2, s * Math.sqrt(3) / 2)];   // counter-clockwise
      /* the points of a stage: every side p→q is split in thirds and the middle third replaced by two sides of an outward equilateral triangle */
      const koch = (p, q, n) => {
        if (n === 0) return [p];
        const a = g.lerp(p, q, 1 / 3), b = g.lerp(p, q, 2 / 3);
        const c = g.add(a, g.rot(g.sub(b, a), -PI / 3));
        return [].concat(koch(p, a, n - 1), koch(a, c, n - 1), koch(c, b, n - 1), koch(b, q, n - 1));
      };
      const stage = n => { let pts = []; for (let i = 0; i < 3; i++) pts = pts.concat(koch(tri[i], tri[(i + 1) % 3], n)); return pts; };
      const shift = (pts, dx) => pts.map(p => k.pt(p.x + dx, p.y));
      const dx = n => n * (s + gap);
      const caption = n => T(k, dx(n) + s / 2, -0.4 * s * Math.sqrt(3) / 2 - 8, 'n = ' + n, { size: 0.8 });
      k.given('Stage 0: an equilateral triangle.', () => {
        k.poly(shift(tri, dx(0)), { close: true, cls: 'given', width: 1.6 });
        caption(0);
      });
      k.step('straightedge', 'Stage 1: trisect each side, discard the middle third (dashed) and build on it an equilateral triangle pointing outwards. The result is a six-pointed star with 12 sides.', () => {
        for (let i = 0; i < 3; i++) { const p = tri[i], q = tri[(i + 1) % 3]; k.seg(k.pt(g.lerp(p, q, 1 / 3).x + dx(1), g.lerp(p, q, 1 / 3).y), k.pt(g.lerp(p, q, 2 / 3).x + dx(1), g.lerp(p, q, 2 / 3).y), { cls: 'cons', dash: true }); }
        const st1 = shift(stage(1), dx(1));
        st1.forEach((p, i) => k.seg(p, st1[(i + 1) % st1.length], { cls: 'given', width: 1.6 }));
        caption(1);
      });
      k.step('straightedge', 'Stage 2: do the same to each of the 12 sides of the star: 48 sides. The sides of the original triangle are drawn dashed.', () => {
        k.poly(shift(tri, dx(2)), { close: true, cls: 'cons', dash: true });
        k.poly(shift(stage(2), dx(2)), { close: true, cls: 'given', width: 1.5 });
        caption(2);
      });
      k.step('pencil', 'Stage 3: 192 sides. Repeated without end the curve has a finite area, an infinite length and no tangent anywhere.', () => {
        k.poly(shift(tri, dx(3)), { close: true, cls: 'cons', dash: true });
        k.poly(shift(stage(3), dx(3)), { close: true, cls: 'curve', width: 1.4 });
        caption(3);
      });
    }
  });

  /* Fig. 103, page 107 — the Sierpinski space-filling curve, stages 1 to 4 in four squares.
     Each stage is a closed polygon with sides at 0°, 45°, 90° …; the stage is produced by the rewriting rule
       X → X F + G + X F − − F − − X F + G + X     (F, G = "draw a side", + / − = turn 45° left / right)
     applied n times to  F − − X F − − F − − X F  (F is a short diagonal side, G a straight side √2 times longer). */
  Curves.figure({
    id: 'fig-103',
    section: 'discontinuous',
    page: 107,
    title: 'The Sierpinski space-filling curve: the first four stages',
    tags: ['limit process', 'space-filling', 'Sierpinski'],
    note: 'The curve of stage n is a closed polygon of 4^n · 4 sides (16, 64, 256, 1024); each stage lies in the same square, and the limit passes through every point of it. The drawing is generated by the rewriting rule given in the first step.',
    build(k) {
      const side = 100, gap = 9;
      const expand = n => { let s = 'F--XF--F--XF'; for (let i = 0; i < n; i++) s = s.replace(/X/g, 'XF+G+XF--F--XF+G+X'); return s; };
      const trace = (s, lenF, lenG) => {
        let x = 0, y = 0, h = 1; const pts = [[0, 0]];
        for (const ch of s) {
          if (ch === 'F' || ch === 'G') { const l = ch === 'F' ? lenF : lenG; x += l * Math.cos(h * PI / 4); y += l * Math.sin(h * PI / 4); pts.push([x, y]); }
          else if (ch === '+') h += 1; else if (ch === '-') h -= 1;
        }
        return pts;
      };
      const r2 = Math.SQRT2;
      /* stage n (the rewriting applied n times) fills a frame of side F = 2^(n+1)·√2 in the units of the rule: the polygon spans
         F − √2 in each direction, x from 0 and y from √2/2 downwards, so a margin √2/2 is left on every side */
      const place = n => {
        const F = Math.pow(2, n + 1) * r2, sc = side / F, ox = (n - 1) * (side + gap);
        return trace(expand(n), 1, r2).map(p => k.pt(ox + (p[0] + r2 / 2) * sc, (p[1] + F - r2) * sc));
      };
      const frameOf = n => { const ox = (n - 1) * (side + gap); return [k.pt(ox, 0), k.pt(ox + side, 0), k.pt(ox + side, side), k.pt(ox, side)]; };
      const cap = n => T(k, (n - 1) * (side + gap) + side / 2, -7, 'stage ' + n, { size: 0.8 });
      k.given('Four equal squares, one for each stage; stage 1 is the closed polygon of 16 sides drawn below.', () => {
        for (let n = 1; n <= 4; n++) { k.poly(frameOf(n), { close: true, cls: 'cons' }); cap(n); }
        const c1 = (0) * (side + gap);
        k.seg(k.pt(c1 + side / 2, 0), k.pt(c1 + side / 2, side), { cls: 'aux' });
        k.seg(k.pt(c1, side / 2), k.pt(c1 + side, side / 2), { cls: 'aux' });
      });
      k.step('straightedge', 'Stage 1: a cross-shaped polygon with a prong at each corner of the square. It has 16 sides: 12 oblique ones, all of the same length, and 4 straight ones √2 times as long.', () => {
        const st1 = place(1);
        st1.slice(0, -1).forEach((p, i) => k.seg(p, st1[i + 1], { cls: 'given', width: 1.8 }));
      });
      k.step('straightedge', 'Stage 2: divide the square in four; in each quarter lay a half-size copy of the stage-1 figure, the four copies joined by oblique sides into one closed polygon of 64 sides.', () => {
        k.poly(place(2), { close: true, cls: 'given', width: 1.5 });
      });
      k.step('pencil', 'Stages 3 and 4 repeat the rule in each quarter: 256 and 1024 sides. The limit of the sequence is a continuous curve that passes through every point of the square.', () => {
        k.poly(place(3), { close: true, cls: 'given', width: 1.1 });
        k.poly(place(4), { close: true, cls: 'curve', width: 0.9 });
      });
    }
  });
})();
