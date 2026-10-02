/* Curves Workshop · figures/hyperbolic.js — Figs. 111–112 (pages 113, 115)
 *
 * Hyperbolic functions: their graphs in pairs (Fig. 111a–c) and their attachment to the rectangular
 * hyperbola, the way the circular functions are attached to the circle (Fig. 112a, 112b).
 */
(function () {
  const PI = Math.PI;
  const aux = { cls: 'cons', dash: true };
  const T = (k, x, y, s, o) => k.text(x, y, s, Object.assign({ upright: true, size: 0.85 }, o || {}));
  const graph = (k, f, a, b, u, o, ylim) => k.curve(x => { const y = f(x); return (y == null || !isFinite(y) || (ylim && (y > ylim[1] || y < ylim[0]))) ? null : [x * u, y * u]; }, [a, b], o);
  /* the key written inside the book's panels: "y = sinh x ———" and "y = csch x - - -" */
  const key = (k, u, x, y, name, dashed) => {
    T(k, x * u, y * u, 'y = ' + name, { size: 0.8, anchor: 'start' });
    const w = dashed ? 0.62 : 0.5;
    k.seg(k.pt((x + 1.03) * u, y * u), k.pt((x + 1.03 + w) * u, y * u), dashed ? { cls: 'given', dash: true, width: 1.4 } : { cls: 'given', width: 1.4 });
  };

  /* Fig. 111 (a), page 113 — y = sinh x (solid) and y = csch x (dashed) */
  Curves.figure({
    id: 'fig-111a',
    section: 'hyperbolic',
    page: 113,
    title: 'y = sinh x and y = csch x',
    tags: ['hyperbolic', 'sinh', 'csch'],
    note: 'The two graphs cross where sinh² x = 1, at x = ±arsinh 1 = ±0.881.',
    build(k) {
      const u = 60, O = k.pt(0, 0), P = (x, y) => k.pt(x * u, y * u);
      k.given('The axes. csch x = 1/sinh x is undefined at x = 0, so the origin is open.', () => {
        k.axes(O, { x: [-2.2 * u, 2.3 * u], y: [-2.45 * u, 3.6 * u] });
        k.dot(O, { open: true });
      });
      k.step('pencil', 'y = sinh x = (eˣ − e⁻ˣ)/2: an odd curve through the origin, rising ever faster, with slope 1 at the origin.', () => {
        graph(k, Math.sinh, -1.55, 1.75, u, { n: 200 });
      });
      k.note('y = csch x = 1/sinh x, dashed: two branches with the y-axis as vertical asymptote, running to the x-axis; they meet the sinh curve at (±0.881, ±1).', () => {
        graph(k, x => 1 / Math.sinh(x), 0.28, 2.05, u, { dash: true, cls: 'given', n: 240 }, [-2.3, 3.4]);
        graph(k, x => 1 / Math.sinh(x), -2.05, -0.41, u, { dash: true, cls: 'given', n: 240 }, [-2.3, 3.4]);
        key(k, u, 0.45, -1.45, 'sinh x', false);
        key(k, u, 0.45, -1.9, 'csch x', true);
      });
    }
  });

  /* Fig. 111 (b), page 113 — y = cosh x (solid) and y = sech x (dashed) */
  Curves.figure({
    id: 'fig-111b',
    section: 'hyperbolic',
    page: 113,
    title: 'y = cosh x and y = sech x',
    tags: ['hyperbolic', 'cosh', 'sech'],
    build(k) {
      const u = 60, O = k.pt(0, 0), P = (x, y) => k.pt(x * u, y * u);
      k.given('The axes.', () => {
        k.axes(O, { x: [-2.2 * u, 2.4 * u], y: [-2.45 * u, 3.6 * u] });
        k.dot(O, { open: true });
      });
      k.step('pencil', 'y = cosh x = (eˣ + e⁻ˣ)/2: the catenary-shaped curve with its lowest point (0, 1) and symmetric about the y-axis.', () => {
        graph(k, Math.cosh, -1.95, 1.95, u, { n: 200 });
        k.dot(P(0, 1), { open: true });
      });
      k.note('y = sech x = 1/cosh x, dashed: a bell with its top at (0, 1) where it touches the cosh curve; the x-axis is its asymptote.', () => {
        graph(k, x => 1 / Math.cosh(x), -2.15, 2.4, u, { dash: true, cls: 'given', n: 240 });
        key(k, u, 0.45, -1.45, 'cosh x', false);
        key(k, u, 0.45, -1.9, 'sech x', true);
      });
    }
  });

  /* Fig. 111 (c), page 113 — y = tanh x (solid) and y = coth x (dashed), with the asymptotes y = ±1 */
  Curves.figure({
    id: 'fig-111c',
    section: 'hyperbolic',
    page: 113,
    title: 'y = tanh x and y = coth x',
    tags: ['hyperbolic', 'tanh', 'coth', 'asymptote'],
    build(k) {
      const u = 60, O = k.pt(0, 0), P = (x, y) => k.pt(x * u, y * u);
      k.given('The axes and the dashed asymptotes y = 1 and y = −1.', () => {
        k.axes(O, { x: [-2.2 * u, 2.4 * u], y: [-2.45 * u, 3.6 * u] });
        k.dot(O, { open: true });
        k.seg(P(-2.15, 1), P(2.3, 1), aux);
        k.seg(P(-2.15, -1), P(2.3, -1), aux);
        T(k, -1.95 * u, 1.17 * u, 'y = 1', { size: 0.8, anchor: 'start' });
      });
      k.step('pencil', 'y = tanh x = sinh x / cosh x: an S-shaped odd curve through the origin that approaches the lines y = 1 and y = −1.', () => {
        graph(k, Math.tanh, -1.95, 1.95, u, { n: 200 });
      });
      k.note('y = coth x = 1/tanh x, dashed: two branches outside the strip |y| < 1, with the y-axis as vertical asymptote, approaching the same two lines from outside.', () => {
        graph(k, x => 1 / Math.tanh(x), 0.29, 2.0, u, { dash: true, cls: 'given', n: 240 }, [-2.3, 3.4]);
        graph(k, x => 1 / Math.tanh(x), -2.1, -0.43, u, { dash: true, cls: 'given', n: 240 }, [-2.3, 3.4]);
        key(k, u, 0.45, -1.45, 'tanh x', false);
        key(k, u, 0.45, -1.9, 'coth x', true);
      });
    }
  });

  /* Fig. 112 (a), page 115 — the circular functions on the circle: x = a cos t, y = a sin t, A = a²t/2 */
  Curves.figure({
    id: 'fig-112a',
    section: 'hyperbolic',
    page: 115,
    title: 'The circle: x = a cos t, y = a sin t, and the sector of area A = a²t/2',
    tags: ['circle', 'sector', 'circular functions'],
    build(k) {
      const g = k.g, a = 150, t = 0.66, O = k.pt(0, 0), V = k.pt(a, 0);
      const Pt = k.pt(a * Math.cos(t), a * Math.sin(t));
      k.given('The axes and the circle x² + y² = a² of radius a about O.', () => {
        k.axes(O, { x: [-1.3 * a, 1.3 * a], y: [-0.22 * a, 1.2 * a] });
        k.arc(O, a, -0.14, PI + 0.14, { cls: 'given', width: 2.4 });
        k.dot(O, { open: true, r: 1.15 });
        k.label(O, 'O', 'nw', { upright: true });
      });
      k.step('straightedge', 'The point P = (x, y) on the circle at the angle t from OX: x = a cos t, y = a sin t. The vertical from P to the x-axis is dashed.', () => {
        k.seg(O, Pt, { cls: 'given' });
        k.seg(Pt, k.pt(Pt.x, 0), aux);
        k.dot(Pt, { open: true, r: 1.15 });
        k.label(Pt, '(x , y)', 'e', { upright: true, dist: 1.4 });
        k.text(a * 0.5, -0.12 * a, 'a', { upright: true, size: 0.95 });
      });
      k.note('The shaded sector between OV, the arc VP and the radius OP has the angle θ = t at O and the area A = a²t/2.', () => {
        const pts = [O, V]; for (let i = 1; i <= 24; i++) { const s = t * i / 24; pts.push(k.pt(a * Math.cos(s), a * Math.sin(s))); }
        k.hatch(pts, { angle: -PI / 4, gap: 0.9 });
        k.angle(O, V, Pt, { label: 'θ', r: 0.9, labelDist: 1.2, upright: true });
        k.seg(O, V, { cls: 'given' });
      });
    }
  });

  /* Fig. 112 (b), page 115 — the hyperbolic functions on the rectangular hyperbola: x = a cosh t, y = a sinh t */
  Curves.figure({
    id: 'fig-112b',
    section: 'hyperbolic',
    page: 115,
    title: 'The rectangular hyperbola: x = a cosh t, y = a sinh t, and the sector of area A = a²t/2',
    tags: ['hyperbola', 'sector', 'hyperbolic functions'],
    note: 'In the book the point P of this panel sits a little off the curve; here P is exactly (a cosh t, a sinh t) for t = 0.9, and the angle θ satisfies tan θ = tanh t.',
    build(k) {
      const g = k.g, a = 150, t = 0.9, O = k.pt(0, 0), V = k.pt(a, 0);
      const H = s => k.pt(a * Math.cosh(s), a * Math.sinh(s));
      const Pt = H(t);
      k.given('The axes, the right-hand branch x² − y² = a² of the rectangular hyperbola with its vertex V = (a, 0), and its asymptote y = x.', () => {
        k.axes(O, { x: [-0.1 * a, 2.0 * a], y: [-0.4 * a, 2.1 * a] });
        k.seg(O, k.pt(1.75 * a, 1.75 * a), { cls: 'given' });
        k.curve(s => { const p = H(s); return [p.x, p.y]; }, [-0.3, 1.27], { cls: 'given', width: 2.4, n: 160 });
        k.dot(O, { open: true, r: 1.15 });
        k.label(O, 'O', 'nw', { upright: true });
      });
      k.step('straightedge', 'The point P = (x, y) on the branch with x = a cosh t, y = a sinh t; join it to O and drop the dashed vertical to the x-axis.', () => {
        k.seg(O, Pt, { cls: 'given' });
        k.seg(Pt, k.pt(Pt.x, 0), aux);
        k.dot(Pt, { open: true, r: 1.15 });
        k.label(Pt, '(x , y)', 'e', { upright: true, dist: 1.4 });
        k.text(a * 0.5, -0.17 * a, 'a', { upright: true, size: 0.95 });
      });
      k.note('The shaded region between OV, the arc VP and the line OP has the angle θ (tan θ = tanh t) at O and the area A = a²t/2: the same relation as for the circle.', () => {
        const pts = [O, V]; for (let i = 1; i <= 24; i++) pts.push(H(t * i / 24));
        k.hatch(pts, { angle: -PI / 4, gap: 0.9 });
        k.angle(O, V, Pt, { label: 'θ', r: 0.9, labelDist: 1.2, upright: true });
        k.seg(O, V, { cls: 'given' });
      });
    }
  });
})();
