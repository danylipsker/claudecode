/* Curves Workshop · figures/exponential.js — Figs. 86–88 (pages 93–96)
 *
 * Exponential Curves: the two limits that define e (Fig. 86a, 86b), the law of growth
 * with its flex (Fig. 87a), the probability curve (Fig. 87b) and the shot-board that
 * produces it (Fig. 88).
 */
(function () {
  const E = Math.E;
  const AXIS = { cls: 'axis' };
  const aux = { cls: 'cons', dash: true };

  /* Fig. 86 (a), page 93 — y = (1 + 1/x)^x. Solid where the base 1 + 1/x is positive (x > 0 and
     x < −1); dotted between −1 and 0, where the base is negative and the power exists only at the
     rational x with an odd denominator, taking both signs. */
  Curves.figure({
    id: 'fig-086a',
    section: 'exponential',
    page: 93,
    title: 'The graph of y = (1 + 1/x)^x',
    tags: ['limit', 'asymptote', 'removable point'],
    note: 'The book draws the dotted branches between x = −1 and 0 as nearly straight sketches; here they are the true point sets ±|1 + 1/x|^x (they dip below 1 near x = −1/4 and return to 1 at x = −1/2). The origin and the point (0, 1) are open: the function is not defined at x = 0.',
    build(k) {
      const u = 60, O = k.pt(0, 0);
      const P = (x, y) => k.pt(x * u, y * u);
      const g = x => Math.pow(1 + 1 / x, x);                       // real where 1 + 1/x > 0
      const gabs = x => Math.pow(Math.abs(1 + 1 / x), x);          // the modulus, for the dotted branches
      k.given('The axes, the horizontal asymptote y = e (the limit as x → ±∞) and the vertical asymptote x = −1.', () => {
        k.axes(O, { x: [-3.4 * u, 3.0 * u], y: [-1.6 * u, 5.4 * u] });
        k.dot(O, { open: true });
        k.seg(P(-3.4, E), P(3.0, E), aux);
        k.seg(P(-1, -1.6), P(-1, 5.4), aux);
        k.text(1.25 * u, (E + 0.22) * u, 'y = e', { upright: true, size: 0.9 });
        k.text(-1.08 * u, -0.7 * u, 'x = −1', { upright: true, size: 0.9, anchor: 'end' });
      });
      k.step('pencil', 'For x > 0 the curve rises from the open point (0, 1) towards the asymptote y = e; for x < −1 it comes down from +∞ at the line x = −1 to the same asymptote.', () => {
        k.curve(s => { const x = s * s; return [x * u, g(x) * u]; }, [0.0001, Math.sqrt(3.0)], { n: 300 });                        // x > 0
        k.curve(s => { const x = -1 - s * s; const y = g(x); return y > 5.35 ? null : [x * u, y * u]; }, [Math.sqrt(0.05), Math.sqrt(1.95)], { n: 300 });   // x < −1
        k.dot(P(0, 1), { open: true });
        k.label(P(0, 1), '1', 'se', { dist: 0.9 });
      });
      k.step('note', 'Between x = −1 and x = 0 the base is negative. The points that exist (x a rational with odd denominator) lie on the dotted curves y = ±|1 + 1/x|^x, which both end at the open point as x → 0.', () => {
        k.curve(x => { const y = gabs(x); return y > 5.35 ? null : [x * u, y * u]; }, [-0.9995, -0.0004], { dotted: true, cls: 'given', n: 700 });
        k.curve(x => { const y = -gabs(x); return y < -1.55 ? null : [x * u, y * u]; }, [-0.9995, -0.0004], { dotted: true, cls: 'given', n: 700 });
        k.text(0.45 * u, -0.5 * u, 'y = (1 + 1/x)^x', { upright: true, size: 1, anchor: 'start' });
      });
    }
  });

  /* Fig. 86 (b), page 93 — y = (1 + x)^{1/x}. Solid for x > −1; dotted for x < −1 (negative base). */
  Curves.figure({
    id: 'fig-086b',
    section: 'exponential',
    page: 93,
    title: 'The graph of y = (1 + x)^{1/x}',
    tags: ['limit', 'asymptote', 'removable point'],
    note: 'The curve is continuous through x = 0 except for the missing point (0, e), which is the limit that defines the number e. The dotted branches for x < −1 are the true point sets ±|1 + x|^{1/x}; the book sketches them freehand.',
    build(k) {
      const u = 60, O = k.pt(0, 0);
      const P = (x, y) => k.pt(x * u, y * u);
      const f = x => Math.pow(1 + x, 1 / x);                      // real for x > −1, x ≠ 0
      const fabs = x => Math.pow(Math.abs(1 + x), 1 / x);
      k.given('The axes, the asymptote y = 1 (the value as x → ∞) and the line x = −1.', () => {
        k.axes(O, { x: [-3.6 * u, 3.0 * u], y: [-1.7 * u, 6.2 * u] });
        k.dot(O, { open: true });
        k.seg(P(-3.7, 1), P(3.0, 1), aux);
        k.seg(P(-1, -1.7), P(-1, 6.2), aux);
        k.seg(P(-0.95, E), P(3.0, E), aux);
        k.text(1.3 * u, (E + 0.22) * u, 'y = e', { upright: true, size: 0.9 });
        k.text(1.9 * u, 1.22 * u, 'y = 1', { upright: true, size: 0.9 });
        k.text(-1.4 * u, 3.4 * u, 'x = −1', { upright: true, size: 0.9, anchor: 'end' });
      });
      k.step('pencil', 'For x > −1 the curve falls from +∞ at the line x = −1 through the open point (0, e) towards the asymptote y = 1.', () => {
        k.curve(s => { const x = -s * s; const y = f(x); return y > 6.15 ? null : [x * u, y * u]; }, [0.0001, Math.sqrt(0.9995)], { n: 400 });     // −1 < x < 0
        k.curve(s => { const x = s * s; return [x * u, f(x) * u]; }, [0.0001, Math.sqrt(3.0)], { n: 300 });                                       // x > 0
        k.dot(P(0, E), { open: true });
      });
      k.step('note', 'For x < −1 the base 1 + x is negative; the points that exist lie on the dotted curves y = ±|1 + x|^{1/x}, which run to ±∞ at the line x = −1.', () => {
        k.curve(x => { const y = fabs(x); return y > 6.15 ? null : [x * u, y * u]; }, [-3.6, -1.0004], { dotted: true, cls: 'given', n: 700 });
        k.curve(x => { const y = -fabs(x); return y < -1.65 ? null : [x * u, y * u]; }, [-3.6, -1.0004], { dotted: true, cls: 'given', n: 700 });
        k.text(0.4 * u, -0.5 * u, 'y = (1 + x)^{1/x}', { upright: true, size: 1, anchor: 'start' });
      });
    }
  });

  /* Fig. 87 (a), page 95 — the logistic curve x = 1/(a + b e^{−t}) (the integrated law of growth
     dx/dt = f(t)·x·(n − x) with a constant f). The vertical axis is the population x, the horizontal
     axis the time t; the line x = 1/a is the saturation level. */
  Curves.figure({
    id: 'fig-087a',
    section: 'exponential',
    page: 95,
    title: 'The law of growth: the logistic curve x = 1/(a + b·e^{−t})',
    tags: ['growth', 'logistic', 'flex'],
    note: 'The book prints the flex as "x = ln b/(2b − a)"; for x = 1/(a + b e^{−t}) the flex is at t = ln(b/a), where x = 1/(2a), half the saturation level. The drawing uses a = 1, b = 0.5.',
    build(k) {
      const a = 1, b = 0.5, ut = 40, ux = 120;                    // t unit = 40, x unit = 120 (1/a = 120)
      const O = k.pt(0, 0);
      const X = t => 1 / (a + b * Math.exp(-t));
      const T = (t, x) => k.pt(t * ut, x * ux);
      k.given('The axes (x upwards, t to the right) and the saturation level x = 1/a.', () => {
        k.seg(O, T(0, 1.42), { cls: 'axis', arrow: 'end' });
        k.seg(T(-3.6, 0), T(3.55, 0), { cls: 'axis', arrow: 'end' });
        k.dot(O, { open: true });
        k.label(T(0, 1.42), 'X', 'ne', { cls: 'axis' });
        k.label(T(3.55, 0), 't', 'ne', { cls: 'axis', dist: 1.1 });
        k.seg(T(-3.6, 1 / a), T(3.7, 1 / a), { cls: 'given', width: 1.2 });
        k.text(0.6 * ut, (1 / a + 0.08) * ux, 'x = 1/a', { upright: true, size: 0.8, anchor: 'start' });
      });
      k.step('pencil', 'The curve: x = 1/(a + b·e^−t). It starts near 0, grows ever faster, has the height 1/(a + b) at t = 0 and flattens out towards the level 1/a.', () => {
        k.fn(t => X(t / ut) * ux, [-3.4 * ut, 3.1 * ut], { n: 300, width: 3 });
      });
      k.note('The values the book writes beside the curve: the flex point, where the growth is fastest, and the value at t = 0.', () => {
        const tf = Math.log(b / a);
        k.dot(T(tf, X(tf)), { open: true });
        k.text(-3.55 * ut, 0.84 * ux, 'Flex at', { upright: true, size: 0.75, anchor: 'start' });
        k.text(-3.55 * ut, 0.7 * ux, 'x = ln b/(2b − a)', { upright: true, size: 0.75, anchor: 'start' });
        k.dot(T(0, X(0)), { r: 0.6 });
        k.text(0.12 * ut, (X(0) - 0.2) * ux, '1/(a + b)', { upright: true, size: 0.7, anchor: 'start' });
        k.text(0.2 * ut, -0.22 * ux, 'x = 1/(a + b·e^{−t})', { upright: true, size: 0.8, anchor: 'middle' });
      });
    }
  });

  /* Fig. 87 (b), page 95 — the probability curve y = e^{−x²/2}, with the flex points (±1, e^{−1/2})
     and the largest inscribed rectangle of the text (a), whose upper corners are the flex points. */
  Curves.figure({
    id: 'fig-087b',
    section: 'exponential',
    page: 95,
    title: 'The probability curve y = e^{−x²/2}',
    tags: ['probability', 'normal curve', 'flex'],
    note: 'The label inside the book\'s figure reads y = e^{−x²}, the boxed equation of the text is y = e^{−x²/2}; the drawing follows the text. The flex points, the inscribed rectangle and the flex tangents are described in the text of the section and are added as a note.',
    build(k) {
      const ux = 100, uy = 125, O = k.pt(0, 0);
      const Pp = (x, y) => k.pt(x * ux, y * uy);
      const y = x => Math.exp(-x * x / 2);
      k.given('The axes; the origin is open because the picture is only the graph.', () => {
        k.axes(O, { x: [-2.7 * ux, 2.7 * ux], y: [-0.12 * uy, 1.3 * uy] });
        k.dot(O, { open: true });
      });
      k.step('pencil', 'The curve y = e^(−x²/2): symmetric about the y-axis, with its top at (0, 1) and the x-axis as asymptote.', () => {
        k.fn(x => y(x / ux) * uy, [-2.45 * ux, 2.45 * ux], { n: 300, width: 3 });
        k.text(0, -0.24 * uy, 'y = e^{−x²/2}', { upright: true, size: 0.95 });
      });
      k.note('The flex points (±1, e^−1/2), where y″ = y(x² − 1) = 0, are the upper corners of the largest rectangle inscribed with one side on the x-axis; the tangents there meet the x-axis at ±2.', () => {
        const y0 = y(1);
        [-1, 1].forEach(s => {
          k.dot(Pp(s, y0), { open: true });
          k.seg(Pp(s, 0), Pp(s, y0), { cls: 'cons', dash: true });
          k.seg(Pp(s, y0), Pp(s * 2, 0), { cls: 'cons', dash: true });
          k.label(Pp(s, 0), s > 0 ? '1' : '−1', 's', { upright: true, size: 0.8, dist: 0.8 });
        });
        k.seg(Pp(-1, y0), Pp(1, y0), { cls: 'cons', dash: true });
        k.text(1.12 * ux, (y0 + 0.07) * uy, '(1, e^{−1/2})', { upright: true, size: 0.75, anchor: 'start' });
        k.text(-1.12 * ux, (y0 + 0.07) * uy, '(−1, e^{−1/2})', { upright: true, size: 0.75, anchor: 'end' });
      });
    }
  });

  /* Fig. 88, page 96 — the "slot machine" (the Galton board): shot falls through rows of nails and
     collects in bins; the bin counts follow the binomial coefficients and the histogram approaches
     the normal curve. Drawn in the units of the page (y down in the scan, up here). */
  Curves.figure({
    id: 'fig-088',
    section: 'exponential',
    page: 96,
    title: 'The "slot machine": shot, nails and bins form a binomial histogram',
    tags: ['probability', 'binomial', 'histogram'],
    note: 'The book draws eight rows of nails and ten bins, with bars in the proportions 1 : 9 : 36 : 84 : 126 : 126 : 84 : 36 : 9 : 1 (the coefficients of (1 + 1)^9); the dashed curve of the last step is the normal curve through the bars, added to show the limit.',
    build(k) {
      const g = k.g;
      const Pp = (x, y) => k.pt(x, -y);                            // page coordinates, y downwards
      const bottom = 857;
      k.given('The floor of the machine: a horizontal line, about ten bins long.', () => {
        k.seg(Pp(103, bottom), Pp(1113, bottom), { cls: 'thick', width: 2.2 });
      });
      k.step('straightedge', 'The hopper: from the ends of the floor the two walls go up and then the two sloping shoulders rise towards the neck of the funnel; the neck is closed by the short sides and the wide rim.', () => {
        const pts = [Pp(445, 52), Pp(752, 52), Pp(710, 133), Pp(1115, 548), Pp(1113, bottom), Pp(103, bottom), Pp(95, 548), Pp(487, 133)];
        pts.forEach((p, i) => { if (i !== 4) k.seg(p, pts[(i + 1) % pts.length], { cls: 'thick', width: 2.2 }); });
      });
      k.step('note', 'The nails: row r has r nails, the first row one nail under the neck of the funnel, each row shifted by half a bin so that a falling shot meets one nail at every row.', () => {
        for (let r = 1; r <= 8; r++) {
          const y = 135 + (r - 1) * 52.4;
          for (let i = 0; i < r; i++) k.dot(Pp(600 + (i - (r - 1) / 2) * 102.3, y), { r: 0.75 });
        }
        k.text(Pp(600, 135).x + 36, Pp(600, 135).y + 4, 'nail', { upright: true, size: 0.75, anchor: 'start' });
      });
      k.step('straightedge', 'The partitions: at the bottom, upright posts with pointed tops (hatched) divide the box into ten bins; a half post stands against each wall.', () => {
        const cxs = []; for (let i = 0; i < 9; i++) cxs.push(203 + i * 101.5);
        cxs.forEach(cx => {
          const post = [Pp(cx - 27, bottom), Pp(cx - 27, 572), Pp(cx, 548), Pp(cx + 27, 572), Pp(cx + 27, bottom)];
          k.hatch(post, { angle: 1.15, gap: 0.8, outline: true });
          k.poly(post, { close: true, cls: 'given', width: 1.6 });
        });
        const lh = [Pp(95, 548), Pp(123, 572), Pp(123, bottom), Pp(103, bottom)];
        const rh = [Pp(1115, 548), Pp(1090, 572), Pp(1090, bottom), Pp(1113, bottom)];
        [lh, rh].forEach(p => { k.hatch(p, { angle: 1.15, gap: 0.8 }); k.poly(p, { close: true, cls: 'given', width: 1.6 }); });
      });
      k.step('pencil', 'The shot collected in the ten bins: the heights are in the ratio of the coefficients 1, 9, 36, 84, 126, 126, 84, 36, 9, 1 of the binomial expansion (1 + 1)^9.', () => {
        const edges = [[123, 176], [230, 278], [332, 380], [434, 483], [537, 584], [638, 685], [739, 786], [840, 888], [942, 988], [1042, 1090]];
        const coef = [1, 9, 36, 84, 126, 126, 84, 36, 9, 1];
        edges.forEach((e, i) => {
          const h = coef[i] * 2.28;
          k.poly([Pp(e[0], bottom), Pp(e[0], bottom - h), Pp(e[1], bottom - h), Pp(e[1], bottom)], { close: true, fill: '#1b1b1b', cls: 'given', width: 1 });
        });
      });
      k.note('As more shot falls the bars follow the bell-shaped normal curve (dashed): the binomial law tends to the law of Fig. 87b.', () => {
        const cx = 611.5, s = 153, h0 = 310.5;
        k.curve(t => [t, -bottom + h0 * Math.exp(-(t - cx) * (t - cx) / (2 * s * s))], [123, 1090], { n: 120, dash: true, cls: 'curve', width: 2 });
      });
    }
  });
})();
