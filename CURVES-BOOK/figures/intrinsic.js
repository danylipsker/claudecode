/* Curves Workshop · figures/intrinsic.js — Fig. 121 (page 124) */

/* Fig. 121 — the Whewell equation. The arc s is measured along the curve from the initial point O, whose
   tangent is taken as the x-axis; φ is the angle that the tangent at P makes with that initial tangent.
   The book's curve is a freehand sketch; it is drawn as the catenary y = a(cosh(x/a) − 1) (the first example
   of the text, s = a tan φ), which starts at its vertex O with the x-axis as tangent. */
Curves.figure({
  id: 'fig-121',
  section: 'intrinsic',
  page: 124,
  title: 'The Whewell equation: arc length s and tangential angle φ',
  tags: ['intrinsic', 'Whewell', 'tangent', 'arc length'],
  note: 'Drawn for the catenary, whose Whewell equation is s = a tan φ; the book sketches an unnamed curve of the same kind.',
  build(k) {
    const g = k.g;
    const a = 380, phi = g.deg(64);
    const cat = x => [x, a * (Math.cosh(x / a) - 1)];
    const xP = a * Math.asinh(Math.tan(phi)), P = k.pt(cat(xP)[0], cat(xP)[1]);
    const O = k.pt(0, 0);
    const dir = g.dir(phi), Q = k.pt(P.x - P.y / Math.tan(phi), 0);            // where the tangent at P meets the x-axis
    k.given('The initial point O of the arc, with the tangent to the curve at O taken as the x-axis, and the curve starting from O.', () => {
      k.axes(O, { x: [-150, 805], y: [-120, 745] });
      k.curve(cat, [-115, 655], { cls: 'thick', n: 240 });
      k.dot(O, { open: true, r: 1.5 }); k.label(O, 'O', 'nw', { dist: 1.3 });
    });
    k.step('note', 'P is a point of the curve; the arc s is the length of the curve measured from O to P.', () => {
      k.dot(P, { open: true, r: 1.5 }); k.label(P, 'P', 'w', { dist: 1.3 });
      const m = cat(270);
      k.label(k.pt(m[0], m[1]), 's', 'nw', { dist: 1.2, upright: true });
    });
    k.step('straightedge', 'Draw the tangent to the curve at P. It meets the x-axis (the tangent at O) below P.', () => {
      k.seg(g.add(P, g.mul(dir, -(P.y + 85) / Math.sin(phi))), g.add(P, g.mul(dir, (722 - P.y) / Math.sin(phi))), { cls: 'given' });
    });
    k.step('protractor', 'Measure the tangential angle φ: the angle from the initial tangent (the x-axis) to the tangent at P. The Whewell equation of the curve is the relation between s and φ.', () => {
      k.angle(Q, k.pt(Q.x + 100, 0), P, { label: 'φ', r: 1.7, labelDist: 1.3, upright: true });
    });
  }
});
