/* Curves Workshop · figures/folium.js — Fig. 89 (page 98) */

/* Fig. 89, page 98 — the folium of Descartes x³ + y³ = 3axy, drawn from its parametric form
   x = 3at/(1 + t³), y = 3at²/(1 + t³) with t = y/x. Three ranges of t: −∞ < t < −1 the lower branch,
   −1 < t < 0 the upper branch, 0 < t < +∞ the loop. The asymptote is x + y + a = 0.
   The book prints the scale of t above the figure; it is drawn at the top. */
Curves.figure({
  id: 'fig-089',
  section: 'folium',
  page: 98,
  title: 'The folium of Descartes with its asymptote and the ranges of t',
  tags: ['folium', 'cubic', 'asymptote'],
  note: 'The book sketches the curve freehand; here it is drawn from the parametric equations, so the branches follow the asymptote more closely than in the printed sketch.',
  build(k) {
    const g = k.g;
    const a = 100;
    const f = k.curves.folium(a);
    const O = k.pt(0, 0);
    const bis = (fn, lo, hi) => { const flo = fn(lo) > 0; for (let i = 0; i < 80; i++) { const m = (lo + hi) / 2; if ((fn(m) > 0) === flo) lo = m; else hi = m; } return (lo + hi) / 2; };
    const tp = p => Math.tan(p);                                 // t = tan φ: the polar angle of the point
    // the ends of the two branches, as drawn in the book
    const phUp = bis(p => f(tp(p))[0] + 1.95 * a, -Math.PI / 4 + 1e-4, -1e-4);          // the upper branch out to x = −1.95a
    const phLo = bis(p => f(tp(p))[1] + 1.84 * a, -Math.PI / 2 + 1e-4, -Math.PI / 4 - 1e-4);   // the lower branch down to y = −1.84a
    const yS = 2.45 * a;                                         // the scale of t
    k.frame(-2.3 * a, -2.15 * a, 2.3 * a, 3.2 * a);

    k.given('The axes OX and OY, with the origin O, and the asymptote x + y + a = 0 (through the points (−a, 0) and (0, −a)).', () => {
      k.seg(k.pt(-1.83 * a, 0), k.pt(1.88 * a, 0), { cls: 'axis', arrow: 'end' });
      k.seg(k.pt(0, -1.98 * a), k.pt(0, 1.87 * a), { cls: 'axis', arrow: 'end' });
      k.label(k.pt(1.86 * a, 0), 'X', 'n', { dist: 1.6, cls: 'axis', size: 0.8 });
      k.label(k.pt(0, 1.86 * a), 'Y', 'e', { dist: 1.2, cls: 'axis', size: 0.8 });
      k.line(k.pt(-a, 0), k.pt(0, -a), { cls: 'given' });
      k.point(O, '', { open: true, r: 1.2 });
    });
    k.step('pencil', 'The loop: t from 0 to +∞. It starts at O tangent to OX, reaches its far point (3a/2, 3a/2) at t = 1 and returns to O tangent to OY.', () => {
      k.curve(p => f(tp(p)), [1e-6, Math.PI / 2 - 1e-6], { n: 300 });
    });
    k.step('pencil', 'The upper branch: t from −1 to 0. It comes in from the upper left, along the asymptote, and ends at O tangent to OX.', () => {
      k.curve(p => f(tp(p)), [phUp, -1e-6], { n: 300 });
    });
    k.step('pencil', 'The lower branch: t from −∞ to −1. It leaves O tangent to OY and runs down to the right along the asymptote.', () => {
      k.curve(p => f(tp(p)), [phLo, -Math.PI / 2 + 1e-6], { n: 300 });
    });
    k.note('The scale of the parameter t, as in the book: the three ranges of t and the curve piece each one draws.', () => {
      k.seg(k.pt(-2.04 * a, yS), k.pt(2.1 * a, yS), { cls: 'given', arrow: 'both' });
      k.point(k.pt(-0.9 * a, yS), '', { open: true });
      k.point(k.pt(0.08 * a, yS), '', { open: true });
      k.text(0.08 * a, yS + 0.5 * a, '(values of t)', { size: 0.9, upright: true });
      k.text(-1.98 * a, yS + 0.17 * a, '−∞', { size: 0.85, upright: true, anchor: 'start' });
      k.text(-1.65 * a, yS + 0.17 * a, 'lower', { size: 0.85, upright: true, anchor: 'start' });
      k.text(-0.96 * a, yS + 0.17 * a, '−1', { size: 0.85, upright: true, anchor: 'end' });
      k.text(-0.78 * a, yS + 0.17 * a, 'upper', { size: 0.85, upright: true, anchor: 'start' });
      k.text(0.08 * a, yS + 0.17 * a, '0', { size: 0.85, upright: true });
      k.text(1.18 * a, yS + 0.17 * a, 'loop', { size: 0.85, upright: true });
      k.text(2.0 * a, yS + 0.17 * a, '+∞', { size: 0.85, upright: true, anchor: 'end' });
    });
  }
});
