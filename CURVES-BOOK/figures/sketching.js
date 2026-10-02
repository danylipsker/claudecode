/* Curves Workshop · figures/sketching.js — Figs. 171–182 (pages 188–201)
 *
 * The figures of the chapter on sketching: addition of ordinates (171, 172, 173, 182), the slope at an
 * intercept (174), singular points (175, 178, 179, 180, 181), asymptotes (176, 177), critical points
 * (178, 179). Every curve is drawn from its equation; the book's own sketches are only approximate
 * (and some are drawn with different scales on the two axes), the notes say where they differ.
 * Where the printed figure is an unlabelled panel the letters run left to right, top to bottom
 * (Fig. 180 and 181 have eight boxes each on the page, not six).
 */
(function () {
  'use strict';
  const PI = Math.PI, SEC = 'sketching';
  const sq = Math.sqrt, cb = Math.cbrt;

  const fig = (id, page, title, extra, build) => Curves.figure(Object.assign({ id, section: SEC, page, title }, extra, { build }));
  const linsp = (a, b, n) => { const o = []; for (let i = 0; i <= n; i++) o.push(a + (b - a) * i / n); return o; };
  /* n+1 values from a to b, packed at both ends (for the square-root points of a curve y² = P(x)) */
  const clus = (a, b, n) => { const o = []; for (let i = 0; i <= n; i++) o.push(a + (b - a) * (1 - Math.cos(PI * i / n)) / 2); return o; };
  /* the graph y = f(x), scaled by sx, sy (null where f is undefined) */
  const graph = (f, a, b, sx, sy, n) => linsp(a, b, n || 240).map(x => { const y = f(x); return y == null || !isFinite(y) ? null : [sx * x, sy * y]; });
  /* a parametric curve sampled at the values ts, scaled */
  const para = (f, ts, sx, sy) => ts.map(t => { const p = f(t); return p == null || !isFinite(p[0]) || !isFinite(p[1]) ? null : [sx * p[0], (sy || sx) * p[1]]; });
  /* null the points outside the box [x0, x1] × [y0, y1] (breaks a curve that runs off to infinity at the frame) */
  const cut = (pts, x0, y0, x1, y1) => pts.map(p => p && p[0] >= x0 && p[0] <= x1 && p[1] >= y0 && p[1] <= y1 ? p : null);
  /* draw a list of points (null breaks the curve) */
  const draw = (k, pts, o) => k.curve(i => pts[Math.round(i)], [0, pts.length - 1], Object.assign({ n: pts.length - 1 }, o || {}));
  const O = { x: 0, y: 0 };
  const ring = (k, P, r) => k.dot(P, { open: true, r: r || 1 });          // the book's small open point
  const bigO = (k, P) => k.dot(P, { open: true, r: 1.7 });                // the book's larger origin mark
  const dash = { cls: 'cons', dash: true };
  const txt = (k, x, y, s, o) => k.text(x, y, s, Object.assign({ upright: true, size: 0.85 }, o || {}));
  const pt = (x, y) => ({ x, y });

  /* ================================================================== Fig. 171 — addition of ordinates (page 188) */
  fig('fig-171a', 188, 'Addition of ordinates: y = x²/6 + cos x + 1', {
    tags: ['sketching', 'addition of ordinates'],
    note: 'The book marks the dashed ordinates at the zeros and the extremes of cos x, from 0 to ±3π/2.'
  }, k => {
    const sx = 100, sy = 130, X = x => sx * x, Y = y => sy * y;
    const y1 = x => 1 + x * x / 6, y2 = Math.cos, y = x => y1(x) + y2(x);
    k.frame(X(-5.3), Y(-2.0), X(5.4), Y(5.6));
    k.given('Draw the axes and the line y = 1. Both component curves start on that line: y1 = 1 + x²/6 is a parabola with its vertex at height 1, y2 = cos x is a cosine of amplitude 1.', () => {
      k.axes(O, { x: [X(-5.1), X(5.2)], y: [Y(-0.45), Y(5.4)] });
      bigO(k, O);
      k.seg(pt(X(-4.72), Y(1)), pt(X(4.72), Y(1)), { cls: 'cons' });
      txt(k, X(3.9), Y(1.14), 'y=1', { size: 0.8 });
    });
    k.step('pencil', 'Draw the parabola y1 = 1 + x²/6 lightly (dashed): vertex at (0, 1), symmetric about the y-axis.', () => {
      draw(k, graph(y1, -4.9, 4.9, sx, sy, 200), dash);
    });
    k.step('pencil', 'Draw the cosine y2 = cos x lightly (dashed): it crosses the x-axis at ±π/2 and ±3π/2 and reaches −1 at ±π.', () => {
      draw(k, graph(y2, -5.0, 5.0, sx, sy, 300), dash);
    });
    k.step('ruler', 'Add the ordinates: at x = 0, ±π/2, ±π, ±3π/2 measure y2 on the cosine and add it to the height y1 of the parabola. Each dashed vertical carries the mark of y2 and, above it, the mark of the sum y = y1 + y2 (where y2 = 0 the sum falls on the parabola).', () => {
      [-1.5, -1, -0.5, 0, 0.5, 1, 1.5].forEach(m => {
        const x = m * PI;
        if (m !== 0) k.seg(pt(X(x), Y(Math.min(0, y2(x)))), pt(X(x), Y(y(x))), dash);
        ring(k, pt(X(x), Y(y2(x))));
        ring(k, pt(X(x), Y(y(x))));
      });
    });
    k.step('pencil', 'Draw the sum y = y1 + y2 through the marks, heavy: the two minima sit just below the line y = 1 and the curve rises like the parabola for large |x|.', () => {
      draw(k, graph(y, -4.78, 4.78, sx, sy, 400));
    });
    k.note('The captions of the book: the equations of the curve and of its components.', () => {
      txt(k, 0, Y(-0.75), 'y = x^2/6 + cos x + 1', { size: 0.8 });
      txt(k, 0, Y(-1.45), 'y_1 = 1 + x^2/6,  y_2 = cos x,  y = y_1 + y_2.', { size: 0.8 });
    });
  });

  fig('fig-171b', 188, 'Addition of ordinates: y = 1 + ½ cosh x', {
    tags: ['sketching', 'addition of ordinates', 'catenary'],
    note: 'The book draws the sum a little too low at x = 0; here the exact curve y = 1 + ½ cosh x is drawn.'
  }, k => {
    const sx = 200, sy = 200, X = x => sx * x, Y = y => sy * y;
    const y1 = x => Math.exp(x) / 4, y2 = x => Math.exp(-x) / 4, y = x => 1 + y1(x) + y2(x);
    k.frame(X(-2.55), Y(-1.15), X(2.6), Y(3.5));
    k.given('Draw the axes and the line y = 1.', () => {
      k.axes(O, { x: [X(-2.2), X(2.45)], y: [Y(-0.05), Y(3.45)] });
      bigO(k, O);
      k.seg(pt(X(-2.2), Y(1)), pt(X(2.2), Y(1)), { cls: 'cons' });
      txt(k, X(1.8), Y(1.12), 'y=1', { size: 0.8 });
    });
    k.step('pencil', 'Draw y1 = eˣ/4 (dashed): it is 1/4 at x = 0 and grows to the right.', () => {
      draw(k, graph(y1, -1.5, 2.3, sx, sy, 200), dash);
      k.label(pt(X(0.62), Y(y1(0.62))), 'y_1', 'nw');
    });
    k.step('pencil', 'Draw y2 = e⁻ˣ/4 (dashed): the mirror image of y1 in the y-axis.', () => {
      draw(k, graph(y2, -2.3, 1.5, sx, sy, 200), dash);
      k.label(pt(X(0.7), Y(y2(0.7))), 'y_2', 'ne');
    });
    k.step('ruler', 'Add the ordinates at x = 0, ±1, ±2: from the axis lay off y2, then y1, and mark the sum y = 1 + y1 + y2 on the vertical (solid ordinates in the book).', () => {
      [-2, -1, 0, 1, 2].forEach(x => {
        if (x !== 0) k.seg(pt(X(x), 0), pt(X(x), Y(y(x))), { cls: 'cons' });
        ring(k, pt(X(x), Y(y1(x))));
        if (x !== 0) ring(k, pt(X(x), Y(y2(x))));
        ring(k, pt(X(x), Y(y(x))));
      });
    });
    k.step('pencil', 'Draw the sum heavy: a catenary, y = 1 + ½ cosh x, with its lowest point at (0, 3/2).', () => {
      draw(k, graph(y, -2.12, 2.12, sx, sy, 300));
      k.label(pt(X(0.5), Y(y(0.5) + 0.2)), 'y', 'e');
    });
    k.note('The captions of the book.', () => {
      txt(k, 0, Y(-0.3), 'y = 1 + (1/2)cosh x', { size: 0.8 });
      txt(k, 0, Y(-0.7), 'y_1 = e^x/4,  y_2 = e^{−x}/4,  y = 1 + y_1 + y_2.', { size: 0.8 });
    });
  });

  /* ================================================================== Fig. 172 — the conic as line ± ordinate (page 189) */
  /* Drawn in the units of the page (the Y axis at u = 0, the x-axis at v = 0). Cy = y1 ± y2 with y1 the straight line
     y1 = −Bx − E and y2 the ordinate of the conic y2² = (B²−AC)x² + 2(BE−CD)x + E² − CF, centred on the x-axis. */
  fig('fig-172a', 189, 'A conic by combining ordinates: the ellipse (B² − AC < 0)', {
    tags: ['sketching', 'conic', 'ellipse', 'addition of ordinates']
  }, k => {
    const cx = 151, a = 131, b = 102, x0 = cx - a, x1 = cx + a, m = 0.5594;
    const y1 = x => 168 + m * (x - x0), C = pt(cx, 0);
    k.frame(-48, -122, 345, 440);
    k.given('The axes and the origin.', () => {
      k.axes(O, { x: [-22, 318], y: [-12, 395] });
      bigO(k, O);
    });
    k.step('pencil', 'Draw the conic y2² = (B²−AC)x² + 2(BE−CD)x + E² − CF about the x-axis. For B² − AC < 0 it is an ellipse, centred at x = (CD − BE)/(B² − AC); the vertical through the centre is its diameter.', () => {
      k.ellipse(C, a, b);
      k.seg(pt(cx, -b), pt(cx, y1(cx) + b + 4), { cls: 'given' });
      [x0, cx, x1].forEach(x => ring(k, pt(x, 0)));
    });
    k.step('straightedge', 'Draw the straight line y1 = −Bx − E, heavy. It meets the vertical through the vertices of y2 where y2 = 0, so it passes through the points above the two vertices.', () => {
      k.seg(pt(-32, y1(-32)), pt(312, y1(312)), { cls: 'thick' });
      ring(k, pt(x0, y1(x0))); ring(k, pt(x1, y1(x1)));
    });
    k.step('ruler', 'Combine the ordinates: at each x lay off y2 above and below the line, measured from the line instead of from the axis. The parallelogram bounded by the two verticals through the vertices and the parallels to the line at distance ±b (the greatest y2) contains the curve.', () => {
      k.poly([pt(x0, y1(x0) - b), pt(x1, y1(x1) - b), pt(x1, y1(x1) + b), pt(x0, y1(x0) + b)], { close: true, cls: 'cons' });
      [x0, 100, 213, x1].forEach(x => k.seg(pt(x, 0), pt(x, y1(x) + b), dash));
    });
    k.step('pencil', 'Draw the ellipse y = y1 ± y2 through the marks, tangent to the parallelogram: its tangents are vertical where it meets the line.', () => {
      k.curve(t => { const x = cx + a * Math.cos(t); return [x, y1(x) + b * Math.sin(t)]; }, [0, 2 * PI], { n: 240 });
    });
  });

  fig('fig-172b', 189, 'A conic by combining ordinates: the hyperbola (B² − AC > 0)', {
    tags: ['sketching', 'conic', 'hyperbola', 'asymptote', 'addition of ordinates']
  }, k => {
    const cx = 181, al = 76.5, r = 0.95, be = r * al, m = 0.575, y1 = x => 273 + m * (x - cx);
    const y2 = x => r * sq(Math.max(0, (x - cx) * (x - cx) - al * al));
    k.frame(-12, -115, 345, 470);
    k.given('The axes and the origin.', () => {
      k.axes(O, { x: [-8, 358], y: [-12, 395] });
      bigO(k, O);
    });
    k.step('pencil', 'Draw the conic y2² = (B²−AC)x² + … about the x-axis: for B² − AC > 0 a hyperbola, with its centre on the axis, its vertices where y2 = 0 and its asymptotes y2 = ±(β/α)(x − x_c).', () => {
      const ts = linsp(-1.15, 1.15, 120);
      [-1, 1].forEach(sg => draw(k, para(s => [cx + sg * al * Math.cosh(s), be * Math.sinh(s)], ts, 1, 1)));
      k.seg(pt(cx - 135, -r * 135), pt(cx + 135, r * 135), { cls: 'cons' });
      k.seg(pt(cx - 135, r * 135), pt(cx + 135, -r * 135), { cls: 'cons' });
      [cx - al, cx, cx + al].forEach(x => ring(k, pt(x, 0)));
    });
    k.step('straightedge', 'Draw the straight line y1 = −Bx − E, heavy; it cuts the vertical through each vertex at the centre of the upper hyperbola.', () => {
      k.seg(pt(-19, y1(-19)), pt(329, y1(329)), { cls: 'thick' });
      [cx - al, cx, cx + al].forEach(x => ring(k, pt(x, y1(x))));
    });
    k.step('ruler', 'Lay off y2 above and below the line at each x: the vertices go to the line, the asymptotes become the lines of slope m ± β/α through the centre on the line (thin), and the dashed ordinates show the construction.', () => {
      k.seg(pt(74, y1(cx) + (m + r) * (74 - cx)), pt(291, y1(cx) + (m + r) * (291 - cx)), { cls: 'cons' });        // steep asymptote, slope m + r
      k.seg(pt(39, y1(cx) - (m - r) * (cx - 39)), pt(329, y1(cx) + (m - r) * 148), { cls: 'cons' });
      [70, cx - al, cx, cx + al, 306].forEach(x => k.seg(pt(x, 0), pt(x, y1(x) + (Math.abs(x - cx) >= al ? y2(x) : 0)), dash));
    });
    k.step('pencil', 'Draw the hyperbola y = y1 ± y2: two branches, the same shape as the first but sheared along the line; the vertical tangents are at the points where the line meets the curve.', () => {
      const ts = linsp(-1.75, 1.75, 240);
      [-1, 1].forEach(sg => draw(k, cut(para(t => { const x = cx + sg * al * Math.cosh(t); return [x, y1(x) + be * Math.sinh(t)]; }, ts, 1, 1), 30, -200, 335, 443)));
    });
  });

  fig('fig-172c', 189, 'A conic by combining ordinates: the parabola (B² − AC = 0)', {
    tags: ['sketching', 'conic', 'parabola', 'addition of ordinates'],
    note: 'For the parabola the line y1 is parallel to the axis of the curve.'
  }, k => {
    const v0 = 22, m = 0.571, kk = 13, y1 = x => 236 + m * (x - v0);
    k.frame(-45, -170, 245, 445);
    k.given('The axes and the origin.', () => {
      k.axes(O, { x: [-22, 212], y: [-12, 395] });
      bigO(k, O);
    });
    k.step('pencil', 'Draw the conic y2² = (B²−AC)x² + … about the x-axis: for B² − AC = 0 it is a parabola with its vertex on the axis and the axis of symmetry along x.', () => {
      draw(k, para(s => [v0 + s * s, kk * s], linsp(-11.7, 11.7, 160), 1, 1));
      ring(k, pt(v0, 0));
    });
    k.step('straightedge', 'Draw the straight line y1 = −Bx − E, heavy. It is parallel to the axis of the parabola and meets the vertical tangent at (x_v, y1).', () => {
      k.seg(pt(-25, y1(-25)), pt(215, y1(215)), { cls: 'thick' });
      ring(k, pt(v0, y1(v0)));
    });
    k.step('ruler', 'Lay off y2 above and below the line at each x: the vertex of y2 goes to the line (a vertical tangent), the upper end grows steeply, the lower end falls back below the line and then turns up again.', () => {
      k.seg(pt(v0, 0), pt(v0, y1(v0)), dash);
      k.seg(pt(55, 0), pt(55, y1(55) + kk * sq(33)), dash);
    });
    k.step('pencil', 'Draw the parabola y = y1 ± y2, whose axis is parallel to the line.', () => {
      draw(k, para(s => { const x = v0 + s * s; return [x, y1(x) + kk * s]; }, linsp(-13.3, 10.1, 200), 1, 1));
    });
  });

  /* ================================================================== Fig. 173 — auxiliary and directional curves (page 190) */
  fig('fig-173a', 190, 'Auxiliary curves: y = x² − 1/(3x) between the parabola and the hyperbola', {
    tags: ['sketching', 'auxiliary curves', 'hyperbola', 'parabola'],
    note: 'The book draws the two guides as thin full lines; they are drawn thin here too.'
  }, k => {
    const s = 200, par = x => x * x, hyp = x => -1 / (3 * x), f = x => x * x - 1 / (3 * x);
    k.frame(s * -1.6, s * -1.45, s * 1.85, s * 1.7);
    k.given('Draw the axes, and write y = x² − 1/(3x) as the sum of a parabola x² and a hyperbola −1/(3x).', () => {
      k.axes(O, { x: [s * -1.45, s * 1.7], y: [s * -1.2, s * 1.55] });
      ring(k, O, 0.9);
      txt(k, s * -0.6, s * 1.62, 'y = x^2 − 1/(3x)', { size: 0.85 });
    });
    k.step('pencil', 'Near x = ±∞ the term x² wins: draw the parabola y = x² as a guide.', () => {
      draw(k, graph(par, -1.18, 1.18, s, s, 160), { cls: 'given' });
    });
    k.step('pencil', 'Near the origin the term 1/(3x) wins: draw the hyperbola y = −1/(3x) as a guide, in the second and fourth quadrants.', () => {
      draw(k, graph(hyp, -1.45, -0.23, s, s, 160), { cls: 'given' });
      draw(k, graph(hyp, 0.28, 1.52, s, s, 160), { cls: 'given' });
    });
    k.step('pencil', 'Draw the curve itself: it follows the hyperbola close to the origin and then bends away to follow the parabola. Left of the origin it is a cup above both guides; to the right it crosses the x-axis at x = 0.69 (where x³ = 1/3) and climbs.', () => {
      draw(k, graph(f, -1.12, -0.285, s, s, 200));
      draw(k, graph(f, 0.265, 1.33, s, s, 200));
    });
  });

  fig('fig-173b', 190, 'Directional curves: y = e⁻ˣ cos x between its damping envelopes', {
    tags: ['sketching', 'damping', 'envelope', 'addition of ordinates'],
    note: 'The book sketches the decay much more slowly than e⁻ˣ so that the waves can be seen; here the damping factor is drawn as e^(−x/2).'
  }, k => {
    const sx = 100, sy = 354, kk = 0.5, env = x => Math.exp(-kk * x), f = x => env(x) * Math.cos(x);
    k.frame(sx * -1.2, sy * -1.25, sx * 9.3, sy * 1.35);
    k.given('Draw the axes and the two horizontal lines y = ±1 (dashed): cos x oscillates between them.', () => {
      k.axes(O, { x: [sx * -0.7, sx * 8.7], y: [sy * -1.02, sy * 1.2] });
      ring(k, O);
      k.seg(pt(sx * -0.65, sy), pt(sx * 8.1, sy), dash);
      k.seg(pt(sx * -0.55, -sy), pt(sx * 8.6, -sy), dash);
    });
    k.step('pencil', 'Draw the factor cos x lightly: maxima at 0 and 2π, minimum at π, zeros at π/2, 3π/2, 5π/2.', () => {
      draw(k, graph(Math.cos, -0.85, 8.55, sx, sy, 300), { cls: 'given' });
      [[0, 1], [PI, -1], [2 * PI, 1]].forEach(p => ring(k, pt(sx * p[0], sy * p[1])));
      [0.5, 1.5, 2.5].forEach(m => ring(k, pt(sx * m * PI, 0)));
      ring(k, pt(0, -sy));
    });
    k.step('pencil', 'Draw the damping factor and its mirror image, y = ±e^(−x/2) (thin): they start at ±1 on the y-axis and fall towards the axis.', () => {
      draw(k, graph(env, 0, 8.3, sx, sy, 240), { cls: 'given' });
      draw(k, graph(x => -env(x), 0, 8.3, sx, sy, 240), { cls: 'given' });
    });
    k.step('pencil', 'Draw the product: it crosses the axis where cos x does (π/2, 3π/2, 5π/2) and touches the envelope where cos x = ±1 (at 0, π, 2π); each wave is smaller than the one before.', () => {
      draw(k, graph(f, -0.35, 2.5 * PI, sx, sy, 400));
    });
  });

  /* ================================================================== Fig. 174 — slope at an intercept (page 191) */
  fig('fig-174', 191, 'The slope of a curve at the intercept (a, 0): the limit of y/(x − a)', {
    tags: ['sketching', 'slope', 'intercept', 'limit']
  }, k => {
    const A = pt(182, 0), P = pt(543, 300), F = pt(545, 0);
    const f = u => 0.002125 * (u - 182) * (934 - u);
    k.frame(-45, -78, 700, 385);
    k.given('The axes, the origin O and the intercept (a, 0): the curve passes through it.', () => {
      k.axes(O, { x: [-50, 635], y: [-45, 340] });
      ring(k, O, 1.4); ring(k, A, 1.4);
      k.label(pt(91, 4), 'a', 'n');
      draw(k, graph(f, 145, 640, 1, 1, 200));
    });
    k.step('straightedge', 'Take a neighbouring point (x, y) of the curve and draw the chord from (a, 0) to it; drop the ordinate y (dashed) to the axis.', () => {
      k.seg(A, P, { cls: 'given' });
      k.seg(P, F, dash);
      ring(k, P, 1.4); ring(k, F, 1.4);
      k.label(pt(363, 4), 'x−a', 'n');
      k.label(pt(545, 150), 'y', 'e');
    });
    k.note('The chord has slope y/(x − a); as the point moves down the curve to (a, 0), the chord turns into the tangent and the limit of y/(x − a) is the slope m of the curve at the intercept.', () => {
      k.angle(A, pt(300, 0), P, { r: 1.3 });
    });
  });

  /* ================================================================== Fig. 175 — the singular point at the origin (page 192) */
  const U175 = 116;
  const caption = (k, x, y, lines, gap) => lines.forEach((s, i) => txt(k, x, y - i * (gap || 24), s, { size: 0.85 }));
  const singular = (k, kind) => {          // the book's marks for the origin: a ringed dot for an isolated point, a ring otherwise
    if (kind === 'isolated') { k.dot(O, { open: true, r: 1.7 }); k.dot(O, { r: 0.85 }); } else ring(k, O, 1.2);
  };

  fig('fig-175a', 192, 'Isolated point: y² = x²(x − 1) has (0, 0) as an isolated point', {
    tags: ['sketching', 'singular point', 'isolated point']
  }, k => {
    const s = U175, f = q => { const x = 1 + q * q; return [x, x * q]; };
    k.frame(s * -0.75, s * -2.35, s * 2.95, s * 2.3);
    k.given('The axes and the equation. y² ≥ 0 needs x ≥ 1, apart from the single value x = 0, which also satisfies the equation (y = 0).', () => {
      k.axes(O, { x: [s * -0.3, s * 2.6], y: [s * -1.55, s * 1.75] });
      txt(k, s * 1.1, s * 2.0, 'y^2 = x^2(x−1)');
    });
    k.step('pencil', 'Draw the single branch for x ≥ 1: it starts at (1, 0) with a vertical tangent and opens to the right, symmetric about the x-axis.', () => {
      draw(k, para(f, linsp(-0.88, 0.88, 200), s, s));
      ring(k, pt(s, 0), 1.1);
    });
    k.note('The origin is a point of the curve with no real tangent: the lowest-degree terms y² + x² = 0 have no real factor, so it is an isolated (hermit) point, drawn as a ringed dot.', () => {
      singular(k, 'isolated');
      caption(k, s * 0.9, -s * 1.8, ['has (0,0) as an', 'isolated point']);
    });
  });

  fig('fig-175b', 192, 'Node: y² = x²(1 − x) has (0, 0) as a node', {
    tags: ['sketching', 'singular point', 'node']
  }, k => {
    const s = U175, f = q => { const x = 1 - q * q; return [x, x * q]; };
    k.frame(s * -1.35, s * -2.35, s * 2.0, s * 2.3);
    k.given('The axes and the equation. The curve exists for x ≤ 1.', () => {
      k.axes(O, { x: [s * -1.05, s * 1.8], y: [s * -1.45, s * 1.6] });
      txt(k, s * 0.4, s * 2.0, 'y^2 = x^2(1−x)');
    });
    k.step('pencil', 'Draw the curve: a loop between x = 0 and x = 1 (vertical tangent at (1, 0)) and two branches that leave the origin to the left, one rising and one falling.', () => {
      draw(k, para(f, linsp(-1.4, 1.4, 300), s, s));
    });
    k.step('straightedge', 'The lowest-degree terms y² − x² = 0 give two distinct real tangents y = ±x at the origin: the origin is a node. Draw them lightly.', () => {
      k.seg(pt(-s * 0.55, -s * 0.55), pt(s * 0.55, s * 0.55), dash);
      k.seg(pt(-s * 0.55, s * 0.55), pt(s * 0.55, -s * 0.55), dash);
      singular(k, 'node');
    });
    k.note('The caption of the book.', () => {
      caption(k, s * 0.4, -s * 1.8, ['has (0,0) as a', 'node']);
    });
  });

  fig('fig-175c', 192, 'Cusp: y² = x³ has (0, 0) as a cusp', {
    tags: ['sketching', 'singular point', 'cusp']
  }, k => {
    const s = U175, f = q => [q * q, q * q * q];
    k.frame(s * -0.8, s * -2.35, s * 2.05, s * 2.3);
    k.given('The axes and the equation.', () => {
      k.axes(O, { x: [s * -0.55, s * 1.85], y: [s * -1.45, s * 1.6] });
      txt(k, s * 0.7, s * 2.0, 'y^2 = x^3');
    });
    k.step('pencil', 'Draw the two branches y = ±x^(3/2): both leave the origin along the x-axis and spread out on either side of it.', () => {
      draw(k, para(f, linsp(-1.12, 1.12, 200), s, s));
    });
    k.note('The lowest-degree term is y² = 0, a double (equal) factor: the tangent y = 0 counts twice and the origin is a cusp. Caption of the book.', () => {
      ring(k, O, 1.2);
      caption(k, s * 0.7, -s * 1.8, ['has (0,0) as a', 'cusp']);
    });
  });

  /* ================================================================== Fig. 176 — the folium and its asymptote (page 193) */
  fig('fig-176', 193, 'The folium x³ + y³ − 3xy = 0 and its asymptote x + y + 1 = 0', {
    tags: ['sketching', 'asymptote', 'folium']
  }, k => {
    const s = 205, fol = k.curves.folium(1);
    k.frame(s * -2.2, s * -2.3, s * 2.2, s * 2.15);
    k.given('The axes: the folium has a node at the origin whose tangents are the two axes.', () => {
      k.axes(O, { x: [s * -1.85, s * 1.9], y: [s * -2.0, s * 1.95] });
      ring(k, O, 1.2);
    });
    k.step('straightedge', 'The asymptote x + y + 1 = 0 (found by m = −1, k = −1): draw the line through (−1, 0) and (0, −1).', () => {
      k.seg(pt(-s * 2.1, s * 1.1), pt(s * 1.1, -s * 2.1), { cls: 'given' });
    });
    k.step('pencil', 'Draw the loop in the first quadrant (it leaves the origin tangent to the x-axis and returns tangent to the y-axis), and the two infinite branches, which close in on the asymptote.', () => {
      draw(k, para(fol, linsp(0, PI / 2 - 1e-7, 1200).map(a => Math.tan(a)), s, s));
      const ul = para(fol, linsp(-0.545, 0, 200), s, s);
      draw(k, ul);
      draw(k, ul.map(p => p && [p[1], p[0]]));
    });
  });

  /* ================================================================== Fig. 177 — two asymptote examples (page 195) */
  fig('fig-177a', 195, 'Asymptote of a cubic: y³ − x³ + x = 0 has y = x for an asymptote', {
    tags: ['sketching', 'asymptote', 'cubic']
  }, k => {
    const s = 105, f = x => cb(x * x * x - x);
    k.frame(s * -1.95, s * -1.95, s * 2.25, s * 2.15);
    k.given('The axes and the equation y³ − x³ + x = 0.', () => {
      k.axes(O, { x: [s * -1.75, s * 2.05], y: [s * -1.4, s * 1.45] });
      txt(k, s * 0.2, s * 1.95, 'y^3 − x^3 + x = 0');
    });
    k.step('straightedge', 'Dividing by x³ and letting x grow: y/x → 1 and y − x → 0, so the line y = x is an asymptote at both ends. Draw it.', () => {
      k.seg(pt(-s * 1.5, -s * 1.5), pt(s * 1.5, s * 1.5), { cls: 'given' });
    });
    k.step('pencil', 'Draw the curve y = ∛(x³ − x): it is odd, crosses the x-axis at −1, 0, 1 (a vertical tangent at the origin, where y³ ≈ −x) and hugs the asymptote at both ends.', () => {
      draw(k, graph(f, -1.4, 1.4, s, s, 400));
      [-1, 0, 1].forEach(x => ring(k, pt(s * x, 0), x ? 0.9 : 1.2));
    });
    k.note('The caption of the book.', () => { txt(k, s * 0.2, -s * 1.7, 'has y = x for an asymptote.', { size: 0.8 }); });
  });

  fig('fig-177b', 195, 'Asymptotes of a conic: (2y + x)(y − x) − 1 = 0 is a hyperbola with asymptotes 2y + x = 0 and y − x = 0', {
    tags: ['sketching', 'asymptote', 'hyperbola']
  }, k => {
    const s = 107, up = x => (x + sq(9 * x * x + 8)) / 4, lo = x => (x - sq(9 * x * x + 8)) / 4;
    k.frame(s * -2.35, s * -1.95, s * 2.4, s * 2.15);
    k.given('The axes and the equation (2y + x)(y − x) − 1 = 0.', () => {
      k.axes(O, { x: [s * -2.15, s * 2.05], y: [s * -1.4, s * 1.45] });
      txt(k, s * 0.1, s * 1.95, '(2y + x)(y − x) − 1 = 0');
    });
    k.step('straightedge', 'An equation of the form (y − ax)(y − bx) + c = 0 is a hyperbola whose asymptotes are the two factors set equal to zero: here y − x = 0 and 2y + x = 0. Draw them through the origin.', () => {
      k.seg(pt(-s * 1.45, -s * 1.45), pt(s * 1.35, s * 1.35), { cls: 'given' });
      k.seg(pt(-s * 2.15, s * 1.075), pt(s * 2.15, -s * 1.075), { cls: 'given' });
    });
    k.step('pencil', 'Solve for y: y = (x ± √(9x² + 8))/4. The two branches lie in the opposite pairs of angles between the asymptotes and approach them.', () => {
      draw(k, graph(up, -1.98, 1.2, s, s, 260));
      draw(k, graph(lo, -1.28, 2.1, s, s, 260));
      ring(k, O, 1.2);
    });
    k.note('The caption of the book.', () => { txt(k, 0, -s * 1.7, 'has asymptotes 2y + x = 0, y − x = 0', { size: 0.8 }); });
  });

  /* ================================================================== Fig. 178 — critical points (page 196) */
  fig('fig-178a', 196, 'Maximum and minimum values of y: y² = x³(1 − x)', {
    tags: ['sketching', 'critical points', 'maximum', 'cusp']
  }, k => {
    const s = 330, f = th => [Math.sin(th) * Math.sin(th), Math.pow(Math.sin(th), 3) * Math.cos(th)];
    k.frame(s * -0.14, s * -0.5, s * 1.22, s * 0.52);
    k.given('The axes and the equation. The curve exists only for 0 ≤ x ≤ 1, where x³(1 − x) ≥ 0.', () => {
      k.axes(O, { x: [s * -0.09, s * 1.1], y: [s * -0.4, s * 0.4] });
      txt(k, s * 0.55, s * 0.47, 'y^2 = x^3(1 − x)');
    });
    k.step('pencil', 'Draw the closed curve: a cusp at the origin and a vertical tangent at (1, 0). Between them dy/dx = 0 at the greatest and least values of y, at x = 3/4 (y = ±0.325).', () => {
      draw(k, para(f, linsp(-PI / 2, PI / 2, 300), s, s));
      ring(k, O, 1.2);
    });
  });

  fig('fig-178b', 196, 'Critical points of y³ = (x − 1)²(x + 1)⁹: a flex at (−1, 0), a maximum, a cusp at (1, 0)', {
    tags: ['sketching', 'critical points', 'flex', 'cusp'],
    note: 'The book sketches the maximum lower (about y = 1.7) than the equation gives (y = 2.2 at x = 7/11); the curve is drawn from the equation.'
  }, k => {
    const s = 160;
    k.frame(s * -1.65, s * -0.6, s * 1.95, s * 2.75);
    k.given('The axes, the intercepts (−1, 0), (1, 0) and the point (0, 1) on the y-axis.', () => {
      k.axes(O, { x: [s * -1.55, s * 1.5], y: [s * -0.45, s * 2.55] });
      [pt(0, 0), pt(-s, 0), pt(s, 0), pt(0, s)].forEach(p => ring(k, p, 1.1));
      txt(k, s * 1.05, s * 2.65, 'y^3 = (x − 1)^2(x + 1)^9', { size: 0.8 });
    });
    k.step('pencil', 'Draw y = (x + 1)³ ∛((x − 1)²): at x = −1 the factor (x + 1)³ gives a flex with a horizontal tangent; the curve climbs to a maximum (dy/dx = 0 at x = 7/11), falls to a cusp at (1, 0) with a vertical tangent (dy/dx infinite), and rises again.', () => {
      // x = 1 + q³ makes the cusp at q = 0 smooth: y = (2 + q³)³ q²
      draw(k, cut(para(q => [1 + q * q * q, Math.pow(2 + q * q * q, 3) * q * q], linsp(-1.357, 0.585, 900), s, s), -1e9, -1e9, 1e9, s * 2.5));
    });
  });

  /* ================================================================== Fig. 179 — flexes (page 197) */
  fig('fig-179a', 197, 'A flex at the origin: y = x³, y″ = 0', {
    tags: ['sketching', 'critical points', 'flex']
  }, k => {
    const s = 292;
    k.frame(s * -0.85, s * -0.6, s * 0.95, s * 0.82);
    k.given('The axes and the equation.', () => {
      k.axes(O, { x: [s * -0.73, s * 0.86], y: [s * -0.45, s * 0.5] });
      txt(k, s * 0.05, s * 0.74, 'y = x^3,  y″_0 = 0', { size: 0.85 });
    });
    k.step('pencil', 'Draw y = x³: y″ = 6x changes sign at x = 0, so the origin is a flex; the tangent there is the x-axis, which the curve crosses.', () => {
      draw(k, graph(x => x * x * x, -0.75, 0.78, s, s, 200));
      ring(k, O, 1.2);
    });
  });

  fig('fig-179b', 197, 'A flex with infinite curvature at the origin: y³ = x⁵, y″ = ∞', {
    tags: ['sketching', 'critical points', 'flex']
  }, k => {
    const s = 305, f = x => Math.sign(x) * Math.pow(Math.abs(x), 5 / 3);
    k.frame(s * -0.78, s * -0.6, s * 0.8, s * 0.82);
    k.given('The axes and the equation.', () => {
      k.axes(O, { x: [s * -0.65, s * 0.7], y: [s * -0.45, s * 0.5] });
      txt(k, 0, s * 0.74, 'y^3 = x^5,  y″_0 = ∞', { size: 0.85 });
    });
    k.step('pencil', 'Draw y = x^(5/3): here y″ = (10/9) x^(−1/3) is infinite at x = 0 and changes sign there, so again a flex, with the x-axis as its tangent.', () => {
      draw(k, graph(f, -0.62, 0.62, s, s, 300));
      ring(k, O, 1.2);
    });
  });


  /* ================================================================== Figs. 180 and 181 — the illustrations in boxes (pages 199, 200) */
  /* Each box of the book is one panel of 450 × 297 units (1 unit ≈ one pixel of the scan). The origin of the axes sits at
     (ox, oy) from the lower-left corner of the box, as in the book; `u` is the unit of the curve in the same units. */
  const BW = 450, BH = 297;
  const boxed = (id, page, title, ox, oy, extra, body) => fig(id, page, title, extra, k => {
    k.frame(-ox - 5, -oy - 5, BW - ox + 5, BH - oy + 5);
    const c = {
      box: () => k.poly([pt(-ox, -oy), pt(BW - ox, -oy), pt(BW - ox, BH - oy), pt(-ox, BH - oy)], { close: true, cls: 'given' }),
      axes: (x0, x1, y0, y1) => k.axes(O, { x: [Math.max(x0, -ox + 8), Math.min(x1, BW - ox - 28)], y: [Math.max(y0, -oy + 6), Math.min(y1, BH - oy - 30)] }),
      clip: pts => cut(pts, -ox + 3, -oy + 3, BW - ox - 3, BH - oy - 3)
    };
    body(k, c);
  });
  const eq = (k, x, y, s, o) => txt(k, x, y, s, Object.assign({ size: 0.8 }, o || {}));
  /* the book's typewritten captions in capitals, the first line (or the lines listed in o.under) underlined */
  const cap = (k, x, y, lines, o) => {
    o = o || {};
    lines.forEach((s, i) => {
      const yy = y - i * (o.gap || 17);
      txt(k, x, yy, s, { size: 0.72, anchor: o.anchor || 'middle' });
      if (o.under && (o.under === true ? i === 0 : o.under.indexOf(i) >= 0)) {
        const w = s.length * 7.6, x0 = o.anchor === 'start' ? x : x - w / 2;
        k.seg(pt(x0, yy - 9), pt(x0 + w, yy - 9), { cls: 'cons' });
      }
    });
  };

  /* ---- Fig. 180 (page 199): cusps, double and triple points, osculinflexion */
  boxed('fig-180a', 199, 'Cusp of the first kind: y² = x³', 113, 149, { tags: ['sketching', 'cusp', 'singular point'] }, (k, c) => {
    const u = 300;
    k.given('The box with its axes, and the equation y² = x³.', () => {
      c.box(); c.axes(-70, 317, -131, 137);
      eq(k, 202, 100, 'y^2 = x^3');
    });
    k.step('pencil', 'Draw the two branches y = ±x^(3/2): both leave the origin along the x-axis, one above and one below it, and spread apart.', () => {
      draw(k, c.clip(para(s => [s * s, s * s * s], linsp(-0.78, 0.78, 240), u, u)));
    });
    k.note('The origin is a cusp of the first kind: the two branches recede on different sides of the common tangent.', () => {
      ring(k, O, 1.1);
      cap(k, 211, -23, ['CUSP OF FIRST KIND', 'BRANCHES RECEDE ON', 'DIFFERENT SIDES OF', 'TANGENT.'], { under: true });
    });
  });

  boxed('fig-180b', 199, 'Cusp of the second kind: (y − x²)² = x⁵', 87, 152, { tags: ['sketching', 'cusp', 'singular point'] }, (k, c) => {
    const u = 125;
    k.given('The box with its axes, and the equation (y − x²)² = x⁵, that is y = x² ± x^(5/2).', () => {
      c.box(); c.axes(-12, 340, -131, 138);
      eq(k, 210, 101, '(y − x^2)^2 = x^5    or');
      eq(k, 225, 71, 'y = x^2 ± x^{5/2}');
    });
    k.step('pencil', 'Draw the parabola y = x² as a guide in the mind, then the two branches y = x² + x^(5/2) (above it, rising steeply) and y = x² − x^(5/2) (below it, turning down and crossing the x-axis at x = 1).', () => {
      draw(k, c.clip(para(s => [s * s, Math.pow(s, 4) + Math.pow(s, 5)], linsp(-1.45, 0.88, 320), u, u)));
      ring(k, pt(u, 0), 1.1);
    });
    k.note('Both branches lie on the same side of the common tangent (the x-axis): a cusp of the second kind.', () => {
      ring(k, O, 1.1);
      cap(k, 103, -51, ['CUSP OF SECOND KIND', 'BRANCHES RECEDE ON', 'SAME SIDE OF TANGENT.'], { under: true });
    });
  });

  boxed('fig-180c', 199, 'Double point or point of osculation: y² = x⁴(1 − x²)', 227, 155, { tags: ['sketching', 'double point', 'singular point'] }, (k, c) => {
    const u = 170;
    k.given('The box with its axes, and the equation y² = x⁴(1 − x²).', () => {
      c.box(); c.axes(-187, 208, -135, 140);
      eq(k, 103, 95, 'y^2 = x^4(1 − x^2)');
    });
    k.step('pencil', 'The curve exists for |x| ≤ 1 and is symmetric about both axes. Near the origin y ≈ ±x²: the branches touch the x-axis, so the two lobes meet there with a common tangent.', () => {
      draw(k, para(t => [Math.sin(t), Math.sin(t) * Math.sin(t) * Math.cos(t)], linsp(-PI, PI, 400), u, u));
    });
    k.note('A double point where the two branches have the same tangent is a point of osculation (a tacnode).', () => {
      ring(k, O, 1.1);
      cap(k, -2, -92, ['DOUBLE POINT - OR - POINT OF OSCULATION'], { under: true });
    });
  });

  boxed('fig-180d', 199, 'A curve with two cusps and a node: y² = x²(1 − x²)³', 224, 157, { tags: ['sketching', 'cusp', 'node', 'singular point'] }, (k, c) => {
    const u = 168;
    k.given('The box with its axes, and the equation y² = x²(1 − x²)³.', () => {
      c.box(); c.axes(-197, 198, -137, 138);
      eq(k, 98, 95, 'y^2 = x^2(1 − x^2)^3');
    });
    k.step('pencil', 'The curve exists for |x| ≤ 1. At the origin y ≈ ±x: a node with the tangents y = ±x, from which two loops spring; at x = ±1 the factor (1 − x²)³ makes a cusp pointing outwards.', () => {
      draw(k, para(t => [Math.sin(t), Math.sin(t) * Math.pow(Math.cos(t), 3)], linsp(-PI, PI, 500), u, u));
    });
    k.note('The singular points are marked: the node at the origin and the two cusps at (±1, 0).', () => {
      [pt(-u, 0), O, pt(u, 0)].forEach(p => ring(k, p, 1.1));
    });
  });

  boxed('fig-180e', 199, 'Cusp of the first kind: (y − x²)² = x³', 118, 135, { tags: ['sketching', 'cusp', 'singular point'] }, (k, c) => {
    const u = 290;
    k.given('The box with its axes, and the equation (y − x²)² = x³, that is y = x² ± x^(3/2).', () => {
      c.box(); c.axes(-73, 370, -125, 158);
      eq(k, 210, 101, '(y − x^2)^2 = x^3   or');
      eq(k, 217, 73, 'y = x^2 ± x^{3/2}');
    });
    k.step('pencil', 'Draw the branch y = x² + x^(3/2) (rising steeply) and the branch y = x² − x^(3/2): the second leaves the origin below the axis, reaches a minimum and returns to cross the x-axis at x = 1.', () => {
      draw(k, c.clip(para(s => [s * s, Math.pow(s, 4) + Math.pow(s, 3)], linsp(-1.07, 0.7, 320), u, u)));
      ring(k, pt(u, 0), 1.1);
    });
    k.note('The branches recede on opposite sides of the tangent (the x-axis): a cusp of the first kind.', () => {
      ring(k, O, 1.1);
      cap(k, 142, -62, ['CUSP OF FIRST KIND'], { under: true });
    });
  });

  boxed('fig-180f', 199, 'Three double points: (x² − 1)² = y²(3 + 2y)', 225, 195, {
    tags: ['sketching', 'node', 'singular point'],
    note: 'The book draws this box with the y scale about one and a half times the x scale; here the scales are equal.'
  }, (k, c) => {
    const u = 90, g = y => y * sq(3 + 2 * y), xa = y => (y < -1 ? -1 : 1) * sq(Math.max(0, 1 + g(y)));
    k.given('The box with its axes, and the equation (x² − 1)² = y²(3 + 2y).', () => {
      c.box(); c.axes(-125, 207, -185, 97);
      eq(k, 82, 84, '(x^2 − 1)^2 = y^2(3 + 2y)', { size: 0.74 });
    });
    k.step('pencil', 'Solving for x: x = ±√(1 ± y√(3 + 2y)), for y ≥ −3/2. The two sign choices give two arms that cross at (0, −1), and a closed heart-shaped curve whose top is at (0, 1/2).', () => {
      const w1 = sq(1.15 + 1.5);
      const A = linsp(w1, 0, 240).map(w => { const y = -1.5 + w * w; return [xa(y), y]; });
      const H1 = linsp(0, PI, 200).map(t => { const y = -0.5 - Math.cos(t); return [-sq(Math.max(0, 1 - g(y))), y]; });
      const H2 = linsp(PI, 0, 200).map(t => { const y = -0.5 - Math.cos(t); return [sq(Math.max(0, 1 - g(y))), y]; });
      const B = linsp(0, w1, 240).map(w => { const y = -1.5 + w * w; return [-xa(y), y]; });
      draw(k, c.clip(A.concat(H1, H2, B).map(p => [u * p[0], u * p[1]])));
    });
    k.note('The singular points are the nodes (±1, 0) and (0, −1) where the arms cross the loop; (0, 1/2) is the top of the loop and O the origin of the axes.', () => {
      [pt(-u, 0), pt(u, 0), pt(0, -u), pt(0, u / 2), O].forEach(p => ring(k, p, 1.1));
    });
  });

  boxed('fig-180g', 199, 'Triple point: x⁴ − x²y + y³ = 0', 246, 169, { tags: ['sketching', 'triple point', 'singular point'] }, (k, c) => {
    const u = 467;
    k.given('The box with its axes, and the equation x⁴ − x²y + y³ = 0.', () => {
      c.box(); c.axes(-188, 192, -154, 136);
      eq(k, -121, -36, 'x^4 − x^2y + y^3 = 0');
    });
    k.step('pencil', 'The terms of lowest degree, −x²y + y³ = y(y − x)(y + x), give three distinct tangents at the origin: y = 0, y = x, y = −x, so the origin is a triple point. Putting y = tx gives x = t − t³, y = t² − t⁴: draw two loops that touch the x-axis and two branches that run down along y = ±x.', () => {
      draw(k, para(t => [t - t * t * t, t * t - Math.pow(t, 4)], linsp(-1.11, 1.11, 500), u, u));
    });
    k.note('Three branches pass through the origin.', () => {
      ring(k, O, 1.1);
      cap(k, 109, -31, ['TRIPLE POINT'], { under: true });
    });
  });

  boxed('fig-180h', 199, 'Osculinflexion: y² + 2x³y + x⁷ = 0', 232, 205, { tags: ['sketching', 'singular point', 'osculinflexion'] }, (k, c) => {
    const u = 180;
    k.given('The box with its axes, and the equation y² + 2x³y + x⁷ = 0.', () => {
      c.box(); c.axes(-190, 200, -182, 100);
      eq(k, 105, 68, 'y^2 + 2x^3y + x^7 = 0');
    });
    k.step('pencil', 'Solving for y: y = −x³ ± |x|³√(1 − x), real for x ≤ 1. For 0 ≤ x ≤ 1 the two values form a narrow loop ending at (1, −1); for x < 0 one branch rises steeply and the other falls slowly. At the origin all branches touch the x-axis.', () => {
      draw(k, c.clip(para(q => { const x = 1 - q * q; return [x, x * x * x * (q - 1)]; }, linsp(-1, 1, 300), u, u)));
      const low = linsp(1.1, 0, 120).map(v => [-v, v * v * v * (1 - sq(1 + v))]);
      const up = linsp(0, 0.8, 120).map(v => [-v, v * v * v * (1 + sq(1 + v))]);
      draw(k, c.clip(low.concat(up).map(p => [u * p[0], u * p[1]])));
    });
    k.note('A cusp of the second kind whose branches also have an inflexion: an osculinflexion.', () => {
      ring(k, O, 1.1);
      cap(k, -78, -65, ['OSCULINFLEXION'], { under: true });
    });
  });

  /* ---- Fig. 181 (page 200): isolated point, a quartic curve with a loop, asymptotes, double cusp … */
  boxed('fig-181a', 200, 'An isolated point at the origin: x²(y² − 1) = y⁴', 219, 143, { tags: ['sketching', 'isolated point', 'asymptote'] }, (k, c) => {
    const u = 44;
    k.given('The box with its axes, and the equation x²(y² − 1) = y⁴.', () => {
      c.box(); c.axes(-213, 214, -138, 138);
      eq(k, -20, 117, 'x^2(y^2−1)'); eq(k, -19, 95, '= y^4');
    });
    k.step('straightedge', 'The asymptotes: dividing by y² the curve is x² = y⁴/(y² − 1), so x → ∞ as y → ±1 (the horizontal asymptotes y = ±1) and x ≈ ±y for large y (the diagonals y = ±x). Draw the four lines.', () => {
      k.seg(pt(-140, -140), pt(140, 140), { cls: 'cons' });
      k.seg(pt(-140, 140), pt(140, -140), { cls: 'cons' });
      k.seg(pt(-216, u), pt(216, u), { cls: 'cons' });
      k.seg(pt(-216, -u), pt(216, -u), { cls: 'cons' });
    });
    k.step('pencil', 'Draw the four branches x = ±y²/√(y² − 1) for |y| > 1: each comes in along a horizontal asymptote, turns and leaves along a diagonal one.', () => {
      const ws = linsp(0.19, 1.9, 300);
      [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(sg => draw(k, c.clip(para(w => [sg[0] * Math.cosh(w) * Math.cosh(w) / Math.sinh(w), sg[1] * Math.cosh(w)], ws, u, u))));
    });
    k.note('The origin satisfies the equation but no real branch passes through it: it is an isolated point (the lowest-degree term x² = 0 would suggest a cusp, but y⁴ is too small to make one).', () => {
      singular(k, 'isolated');
      txt(k, -205, -68, 'x^2 = 0', { size: 0.7, anchor: 'start' });
      txt(k, -205, -83, 'indicates', { size: 0.7, anchor: 'start' });
      txt(k, -205, -98, 'a cusp at', { size: 0.7, anchor: 'start' });
      txt(k, -188, -113, 'origin.', { size: 0.7, anchor: 'start' });
      cap(k, -6, -83, ['ORIGIN IS AN', 'ISOLATED POINT'], { under: [0, 1] });
    });
  });

  boxed('fig-181b', 200, 'A curve with a node: (y² + x² − 3ay)² = 4ay²(2a − y), the sum of a circle and a parabola', 221, 15, { tags: ['sketching', 'node', 'addition of abscissae', 'circle', 'parabola'] }, (k, c) => {
    const a = 92, cc = y => sq(Math.max(0, 2 * a * y - y * y)), pp = y => sq(a * y), ys = clus(0, 2 * a, 220);
    k.given('The box with its axes, and the equation x = ±√(2ay − y²) ± √(ay): the abscissa is a sum of the abscissa of the circle x² + y² = 2ay and the abscissa of the parabola x² = ay.', () => {
      c.box(); c.axes(-196, 207, -10, 262);
      eq(k, -145, 258, '(y^2 + x^2 − 3ay)^2'); eq(k, -76, 230, '= 4ay^2(2a − y)');
      eq(k, 68, 245, 'x = ±√(2ay − y^2)'); eq(k, 60, 216, '± √(ay)');
    });
    k.step('pencil', 'Draw the two component curves lightly (dashed): the circle of radius a about (0, a) and the two arms of the parabola x² = ay.', () => {
      k.circle(pt(0, a), a, { cls: 'cons', dash: true });
      draw(k, linsp(0, 2.9 * a, 120).map(y => [pp(y), y]), dash);
      draw(k, linsp(0, 2.9 * a, 120).map(y => [-pp(y), y]), dash);
    });
    k.step('ruler', 'For each y between 0 and 2a add (and subtract) the two abscissae: the four values ±√(2ay − y²) ± √(ay) give the points of the curve on the horizontal through y.', () => {
      [0.4, 1, 1.6].forEach(m => { const y = m * a; k.seg(pt(-(cc(y) + pp(y)), y), pt(cc(y) + pp(y), y), dash); });
    });
    k.step('pencil', 'Draw the curve heavy: two big lobes, and a small loop between y = 0 and y = a whose crossing point (0, a) is a node; the lobes touch the x-axis at the origin.', () => {
      draw(k, ys.map(y => [cc(y) + pp(y), y]));
      draw(k, ys.map(y => [pp(y) - cc(y), y]));
      draw(k, ys.map(y => [-(cc(y) + pp(y)), y]));
      draw(k, ys.map(y => [cc(y) - pp(y), y]));
      ring(k, O, 1.1); ring(k, pt(0, a), 1.1);
    });
  });

  boxed('fig-181c', 200, 'Cusps at the ends of the axis: (x/a)² + (y/b)^(2/3) = 1', 223, 149, { tags: ['sketching', 'cusp', 'Lamé curve'] }, (k, c) => {
    const a = 182, b = 112;
    k.given('The box with its axes, and the equation (x/a)² + (y/b)^(2/3) = 1.', () => {
      c.box(); c.axes(-207, 223, -144, 148);
      eq(k, -205, 101, '(x/a)^2 + (y/b)^{2/3} = 1', { anchor: 'start' });
    });
    k.step('pencil', 'Put x = a cos t, y = b sin³t: the curve is symmetric about both axes, it meets the x-axis at (±a, 0) with a cusp (y ≈ (a − x)^(3/2)) and the y-axis at (0, ±b) with a horizontal tangent.', () => {
      draw(k, para(t => [a * Math.cos(t), b * Math.pow(Math.sin(t), 3)], linsp(0, 2 * PI, 400), 1, 1));
    });
    k.note('The origin (the centre) and the cusps (±a, 0) are marked.', () => {
      ring(k, O, 1.1); ring(k, pt(-a, 0), 1.1); ring(k, pt(a, 0), 1.1);
    });
  });

  boxed('fig-181d', 200, 'Asymptotes and a cusp: xy² = (x − 1)³', 216, 155, {
    tags: ['sketching', 'asymptote', 'cusp'],
    note: 'The book draws this box with the y scale about 0.4 of the x scale (the asymptotes y = ±(x − 3/2) then slope at about 22°); the same scale is used here.'
  }, (k, c) => {
    const u = 87, ys = 0.4;
    k.given('The box with its axes, and the equation xy² = (x − 1)³.', () => {
      c.box(); c.axes(-208, 228, -150, 140);
      eq(k, 87, 125, 'xy^2 = (x−1)^3');
    });
    k.step('straightedge', 'The asymptotes: y² = (x − 1)³/x ≈ (x − 3/2)² for large |x|, so y = ±(x − 3/2): two lines through (3/2, 0). The y-axis (x = 0) is also an asymptote, since y → ∞ as x → 0 from the left. Draw them.', () => {
      k.seg(pt(-2.4 * u, ys * u * 3.9), pt(2.7 * u, -ys * u * 1.2), { cls: 'cons' });
      k.seg(pt(-2.4 * u, -ys * u * 3.9), pt(2.7 * u, ys * u * 1.2), { cls: 'cons' });
    });
    k.step('pencil', 'Draw the curve: for x ≥ 1 two branches meeting in a cusp at (1, 0) (y ≈ ±(x − 1)^(3/2)) and approaching the oblique asymptotes; for x < 0 two branches, each coming down the y-axis and bending out along an oblique asymptote.', () => {
      draw(k, c.clip(para(s => [1 + s * s, s * s * s / sq(1 + s * s)], linsp(-1.45, 1.45, 300), u, ys * u)));
      const qs = linsp(0, 1, 300).map(v => 0.03 * Math.pow(2.45 / 0.03, v));
      draw(k, c.clip(qs.map(q => [-u * q, ys * u * sq(Math.pow(q + 1, 3) / q)])));
      draw(k, c.clip(qs.map(q => [-u * q, -ys * u * sq(Math.pow(q + 1, 3) / q)])));
    });
    k.note('The origin of the axes, the cusp (1, 0) and the crossing point of the asymptotes (3/2, 0) are marked.', () => {
      ring(k, O, 1.1); ring(k, pt(u, 0), 1.1); ring(k, pt(1.5 * u, 0), 1.1);
    });
  });

  boxed('fig-181e', 200, 'Double cusp: y² = x⁴(1 + x)', 225, 149, { tags: ['sketching', 'double cusp', 'tacnode', 'singular point'] }, (k, c) => {
    const u = 182;
    k.given('The box with its axes, and the equation y² = x⁴(1 + x).', () => {
      c.box(); c.axes(-209, 223, -137, 143);
      eq(k, -82, 78, 'y^2 = x^4(1 + x)');
    });
    k.step('pencil', 'The curve exists for x ≥ −1. Put x = s² − 1, y = (s² − 1)² s: a loop between x = −1 (vertical tangent) and the origin, and a branch for x > 0 that rises like x². At the origin y ≈ ±x²: the branches touch the x-axis from both sides.', () => {
      draw(k, c.clip(para(s => [s * s - 1, Math.pow(s * s - 1, 2) * s], linsp(-1.33, 1.33, 400), u, u)));
    });
    k.note('The origin is a double cusp (a tacnode, two cusps back to back on one tangent). The ends of the loop are marked.', () => {
      ring(k, O, 1.1); ring(k, pt(-u, 0), 1.1);
      cap(k, 118, 15, ['DOUBLE CUSP'], { under: true });
    });
  });

  boxed('fig-181f', 200, 'A tacnode and an asymptote: x³y² − a³x² + ay⁴ = 0', 223, 150, { tags: ['sketching', 'asymptote', 'singular point', 'tacnode'] }, (k, c) => {
    const u = 72, h = x => (sq(x * x * x * x + 4) - x * x) / 2, h2 = x => (x * x + sq(x * x * x * x + 4)) / 2;
    k.given('The box with its axes, and the equation x³y² − a³x² + ay⁴ = 0 (here a = 1).', () => {
      c.box(); c.axes(-212, 222, -145, 140);
      eq(k, 125, 105, 'x^3y^2 − a^3x^2 + ay^4 = 0');
    });
    k.step('pencil', 'Treat the equation as a quadratic in y²: y² = x(√(x⁴ + 4a⁴) − x²)/(2a) for x > 0 (a bulb that leaves the origin vertically and tails off to the x-axis, y → 0 as x → ∞) and y² = |x|(x² + √(x⁴ + 4a⁴))/(2a) for x < 0 (two arms opening to the left).', () => {
      draw(k, c.clip(para(s => [s * s, s * sq(h(s * s))], linsp(-1.69, 1.69, 300), u, u)));
      draw(k, c.clip(para(s => [-s * s, s * sq(h2(s * s))], linsp(-1.3, 1.3, 300), u, u)));
    });
    k.note('Near the origin y² ≈ a|x|: the two parabolas x = ±y²/a touch the y-axis from either side, a tacnode with a vertical tangent. The x-axis is an asymptote of the bulb.', () => { ring(k, O, 1.1); });
  });

  boxed('fig-181g', 200, 'A curve of constant area: (y − mx²)² = a² − x²', 225, 153, { tags: ['sketching', 'area', 'circle', 'parabola'] }, (k, c) => {
    const a = 118, m = 0.9 / a;
    k.given('The box with its axes, and the equation (y − mx²)² = a² − x², that is y = mx² ± √(a² − x²).', () => {
      c.box(); c.axes(-209, 218, -136, 136);
      eq(k, -150, -41, '(y − mx^2)^2 ='); eq(k, -127, -66, 'a^2 − x^2');
    });
    k.step('pencil', 'Add the ordinate of the parabola y = mx² to each ordinate ±√(a² − x²) of the circle of radius a: the circle is bent into a tongue, with its lowest point (0, −a) and a dip at the top (0, a) between two higher shoulders.', () => {
      draw(k, para(t => [a * Math.cos(t), a * Math.sin(t) + m * a * a * Math.cos(t) * Math.cos(t)], linsp(0, 2 * PI, 400), 1, 1));
    });
    k.note('Every vertical chord keeps its length 2√(a² − x²), so the area is the circle’s, πa², whatever the value of m.', () => {
      ring(k, O, 1.1);
      cap(k, 150, -43, ['AREA = πa^2', '(independent', 'of m)'], { under: [0] });
    });
  });

  boxed('fig-181h', 200, 'Triple point with asymptotes: x⁴ − y⁴ = y(3x² − y²)', 221, 150, { tags: ['sketching', 'triple point', 'asymptote'] }, (k, c) => {
    const u = 133, S3 = sq(3);
    const X = t => t * (3 - t * t) / (1 - Math.pow(t, 4)), Y = t => t * t * (3 - t * t) / (1 - Math.pow(t, 4));
    k.given('The box with its axes, and the equation x⁴ − y⁴ = y(3x² − y²).', () => {
      c.box(); c.axes(-208, 220, -145, 140);
      eq(k, -126, -52, 'x^4 − y^4 = y(3x^2 − y^2)');
    });
    k.step('straightedge', 'The highest-degree terms x⁴ − y⁴ = (x − y)(x + y)(x² + y²) give the directions y = ±x of the asymptotes; the constant is found as in the folium: y = x − 1/2 and y = −x − 1/2, crossing at (0, −1/2). Draw them.', () => {
      k.seg(pt(-0.6 * u, -1.1 * u), pt(1.6 * u, 1.1 * u), { cls: 'cons' });
      k.seg(pt(0.6 * u, -1.1 * u), pt(-1.6 * u, 1.1 * u), { cls: 'cons' });
    });
    k.step('pencil', 'The lowest-degree terms y(y² − 3x²) give three tangents at the origin (y = 0, y = ±√3 x): a triple point. Putting y = tx gives the curve in terms of t: draw the wide U through the origin (|t| < 1), the loop above it (|t| > √3) and the two branches that run down along the asymptotes (1 < |t| < √3).', () => {
      draw(k, c.clip(linsp(-0.58, 0.58, 240).map(t => [u * X(t), u * Y(t)])));
      draw(k, c.clip(linsp(-1 / S3, 1 / S3, 240).map(t => [u * t * (3 * t * t - 1) / (Math.pow(t, 4) - 1), u * (3 * t * t - 1) / (Math.pow(t, 4) - 1)])));
      draw(k, c.clip(linsp(1.31, S3 - 1e-4, 200).map(t => [u * X(t), u * Y(t)])));
      draw(k, c.clip(linsp(-S3 + 1e-4, -1.31, 200).map(t => [u * X(t), u * Y(t)])));
    });
    k.note('The triple point at the origin and the crossing point (0, −1/2) of the asymptotes are marked.', () => {
      ring(k, O, 1.1); ring(k, pt(0, -u / 2), 1.1);
      cap(k, 130, -27, ['TRIPLE POINT'], { under: true });
    });
  });

  /* ================================================================== Fig. 182 — a semi-polynomial from its polynomial (page 201) */
  fig('fig-182', 201, 'A semi-polynomial sketched from its polynomial: y² = x(3 − x)(x − 2)²', {
    tags: ['sketching', 'semi-polynomial', 'square root', 'addition of ordinates'],
    note: 'The book draws Y = P(x) above the curve y² = P(x); the maxima of Y and of y fall at the same x, and where Y < 0 there is no y.'
  }, k => {
    const u = 91, yo = 238, P = x => x * (3 - x) * (x - 2) * (x - 2);
    const m1 = (13 - sq(73)) / 8, m2 = (13 + sq(73)) / 8;
    const oval = (a, b, n) => { const t = clus(a, b, n), o = []; t.forEach(x => o.push([u * x, u * sq(Math.max(0, P(x)))])); for (let i = n - 1; i >= 0; i--) o.push([u * t[i], -u * sq(Math.max(0, P(t[i])))]); return o; };
    k.frame(-70, -185, 355, yo + 295);
    k.given('Draw the axes of the polynomial Y = P(x) above, and the axes of the curve y² = Y below; mark the intercepts x = 0, 2, 3 on both. The factor (x − 2)² is a double root: Y touches the axis at x = 2 without crossing.', () => {
      k.axes(pt(0, yo), { x: [-25, 320], y: [-85, 250], yl: 'Y' });
      k.axes(O, { x: [-25, 320], y: [-155, 160], yl: 'y' });
      [0, 2, 3].forEach(x => { ring(k, pt(u * x, yo), 1.2); ring(k, pt(u * x, 0), 1.2); });
    });
    k.step('pencil', 'Sketch Y = x(3 − x)(x − 2)²: negative for x < 0, a large maximum between 0 and 2 (x ≈ 0.56, Y ≈ 2.83), a touch of the axis at x = 2, a small maximum between 2 and 3 (x ≈ 2.69, Y ≈ 0.40), then negative again.', () => {
      draw(k, graph(P, -0.06, 3.07, u, u, 300).map(p => p && [p[0], p[1] + yo]));
    });
    k.step('ruler', 'Carry the intercepts and the two maxima down as dashed ordinates: the maxima of y fall at the same values of x, and where Y is negative no y exists. At each x lay off √Y above and below the lower axis.', () => {
      [m1, 2, m2, 3].forEach(x => k.seg(pt(u * x, yo + (x === 2 || x === 3 ? 0 : u * P(x))), pt(u * x, x === 2 || x === 3 ? 0 : u * sq(P(x))), dash));
    });
    k.step('pencil', 'Draw the curve y² = Y through the points: the big loop over 0 ≤ x ≤ 2 (vertical tangent at the origin) and the small loop over 2 ≤ x ≤ 3, meeting in a node at (2, 0) whose tangents have slope ±√(x(3 − x)) = ±√2.', () => {
      draw(k, oval(0, 2, 160));
      draw(k, oval(2, 3, 100));
    });
  });
})();
