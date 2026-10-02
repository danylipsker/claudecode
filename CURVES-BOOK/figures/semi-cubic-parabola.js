/* Curves Workshop · figures/semi-cubic-parabola.js — Fig. 170 (page 187)
 *
 * Fig. 170 is four graphs. Left column: y1 = y² = (x−1)(x−2)(x−3) — the cubic y1 above (a), the
 * curve y² = y1 below it (c). Right column: y1 = y² = (x−1)(x−2)² — the cubic (b) and its
 * semi-cubic (d). The book numbers its two scales differently ("Scales on X and Y-axes
 * different"); the y scale of each graph is a stated multiple of the x scale (YS_*), chosen to
 * match the proportions of the page. The dashed ordinates join each cubic to the curve under it.
 */
(function () {
  const U = 100;                                   // one unit of x
  const YS = { a: 2.0, b: 2.6, c: 2.44, d: 3.4 };  // y scale of each panel, in units of U
  const Pa = x => (x - 1) * (x - 2) * (x - 3);
  const Pb = x => (x - 1) * (x - 2) * (x - 2);
  const xmaxA = 3.2, xmaxB = 2.45;
  const XMAX_AXIS = 3.75 * U;

  // The curve y² = P(x), as drawn points (x in units, y scaled), for the pieces given by their x-intervals.
  // An oval over [a, b]: upper edge a→b, lower edge b→a, with the points clustered at both ends
  // (the tangent there is vertical, a square-root point).
  function oval(P, a, b, ys, n) {
    n = n || 160;
    const out = [];
    for (let i = 0; i <= n; i++) { const x = a + (b - a) * (1 - Math.cos(Math.PI * i / n)) / 2; out.push([U * x, U * ys * Math.sqrt(Math.max(0, P(x)))]); }
    for (let i = n - 1; i >= 0; i--) { const x = a + (b - a) * (1 - Math.cos(Math.PI * i / n)) / 2; out.push([U * x, -U * ys * Math.sqrt(Math.max(0, P(x)))]); }
    return out;
  }
  // The branch that starts at the root r and runs right to xmax: x = r + s², y = ±sqrt(P(x)).
  function branch(P, r, xmax, ys, n) {
    n = n || 200;
    const S = Math.sqrt(xmax - r), out = [];
    for (let i = -n; i <= n; i++) { const s = S * i / n, x = r + s * s; out.push([U * x, Math.sign(s) * U * ys * Math.sqrt(Math.max(0, P(x)))]); }
    return out;
  }
  const graph = (P, x0, x1, ys, n) => { const o = []; n = n || 200; for (let i = 0; i <= n; i++) { const x = x0 + (x1 - x0) * i / n; o.push([U * x, U * ys * P(x)]); } return o; };

  const O = { x: 0, y: 0 };
  function axesFor(k, yl, ylo, yhi, xl) {
    k.axes(O, { x: [-0.3 * U, XMAX_AXIS], y: [ylo, yhi], xl: xl || 'X', yl });
    k.dot(O, { open: true, r: 1.3 });
  }
  const roots = (k, rs) => rs.forEach(r => k.dot(k.pt(U * r, 0), { open: true, r: 1.3 }));

  /* ------------------------------------------------------------------ the cubics (top row) */
  Curves.figure({
    id: 'fig-170a', section: 'semi-cubic-parabola', page: 187,
    title: 'The cubic y1 = (x−1)(x−2)(x−3), the guide for the semi-cubic parabola',
    tags: ['sketching', 'cubic', 'intercepts'],
    note: 'The y scale is about twice the x scale, as in the book (its note: scales on X and Y differ).',
    build(k) {
      const ys = YS.a, yt = 190, yb = -160;
      k.frame(-50, yb - 20, 420, yt + 70);
      k.given('Draw the axes X and Y1 and mark the three intercepts x = 1, 2, 3 where y1 = 0.', () => {
        axesFor(k, 'Y_1', yb, yt);
        roots(k, [1, 2, 3]);
        k.text(-30, yt + 45, 'y_1 = y^2 = (x−1)(x−2)(x−3)', { upright: true, size: 0.85, anchor: 'start' });
      });
      k.step('pencil', 'Sketch the cubic through the three intercepts: it rises from the left, turns at the maximum between 1 and 2, turns again at the minimum between 2 and 3, and then rises for ever.', () => {
        k.curve(graph(Pa, 0.9, xmaxA, ys));
      });
      k.step('ruler', 'Carry the intercepts and the maximum down as dashed ordinates: they are the points where the curve under it, y² = y1, will have vertical tangents and its greatest height.', () => {
        const xm = 2 - 1 / Math.sqrt(3);
        [1, 2, 3].forEach(r => k.seg(k.pt(U * r, 0), k.pt(U * r, yb + 20), { cls: 'cons', dash: true }));
        k.seg(k.pt(U * xm, U * ys * Pa(xm)), k.pt(U * xm, yb + 20), { cls: 'cons', dash: true });
        k.dot(k.pt(U * xm, U * ys * Pa(xm)), { open: true, r: 1.3 });
      });
    }
  });

  Curves.figure({
    id: 'fig-170b', section: 'semi-cubic-parabola', page: 187,
    title: 'The cubic y1 = (x−1)(x−2)², with a double root at x = 2',
    tags: ['sketching', 'cubic', 'intercepts', 'double root'],
    build(k) {
      const ys = YS.b, yt = 190, yb = -160;
      k.frame(-50, yb - 20, 420, yt + 70);
      k.given('Draw the axes X and Y1 and mark the intercepts x = 1 and x = 2 (a double root).', () => {
        axesFor(k, 'Y_1', yb, yt);
        roots(k, [1, 2]);
        k.text(-30, yt + 45, 'y_1 = y^2 = (x−1)(x−2)^2', { upright: true, size: 0.85, anchor: 'start' });
      });
      k.step('pencil', 'Sketch the cubic: it crosses the axis at x = 1, rises to a maximum, comes back and only touches the axis at x = 2 (the factor (x−2)² does not change sign), then rises for ever.', () => {
        k.curve(graph(Pb, 0.85, xmaxB, ys));
      });
      k.step('ruler', 'Carry the intercepts down as dashed ordinates, and mark the maximum at x = 4/3.', () => {
        const xm = 4 / 3;
        [1, 2].forEach(r => k.seg(k.pt(U * r, 0), k.pt(U * r, yb + 20), { cls: 'cons', dash: true }));
        k.dot(k.pt(U * xm, U * ys * Pb(xm)), { open: true, r: 1.3 });
        k.seg(k.pt(U * xm, U * ys * Pb(xm)), k.pt(U * xm, yb + 20), { cls: 'cons', dash: true });
      });
    }
  });

  /* ------------------------------------------------------------------ the semi-cubics (bottom row) */
  Curves.figure({
    id: 'fig-170c', section: 'semi-cubic-parabola', page: 187,
    title: 'The semi-cubic y² = (x−1)(x−2)(x−3): an oval and an open branch',
    tags: ['sketching', 'semi-polynomial', 'square root'],
    note: 'The y scale is about 2.4 times the x scale, as in the book.',
    build(k) {
      const ys = YS.c, yt = 215, yb = -215;
      k.frame(-50, yb - 20, 420, yt + 70);
      k.given('Draw the axes X and Y, and mark the intercepts x = 1, 2, 3 (where y1 = 0).', () => {
        axesFor(k, 'Y', yb, yt);
        roots(k, [1, 2, 3]);
        k.text(-30, yt + 45, 'y^2 = (x−1)(x−2)(x−3)', { upright: true, size: 0.85, anchor: 'start' });
      });
      const xm = 2 - 1 / Math.sqrt(3), hm = Math.sqrt(Pa(xm));
      k.step('ruler', 'Where y1 is negative (x < 1 and 2 < x < 3) there is no real y. Where it is positive (1 < x < 2 and x > 3) take the square root of each ordinate and lay it off above and below the axis; at the maximum of y1 (x ≈ 1.42, y1 ≈ 0.385) the height is ±0.62.', () => {
        k.seg(k.pt(U * xm, 0), k.pt(U * xm, yt - 40), { cls: 'cons', dash: true });
        k.dot(k.pt(U * xm, U * YS.c * hm), { open: true, r: 1.2 });
        k.dot(k.pt(U * xm, -U * YS.c * hm), { open: true, r: 1.2 });
        [1, 2, 3].forEach(r => k.seg(k.pt(U * r, 0), k.pt(U * r, yt - 40), { cls: 'cons', dash: true }));
      });
      k.step('pencil', 'Draw the oval over 1 ≤ x ≤ 2 and the open branch from x = 3: the curve is symmetric about the x-axis and meets the axis at the intercepts with a vertical tangent (the slope there is infinite).', () => {
        k.curve(oval(Pa, 1, 2, ys));
        k.curve(branch(Pa, 3, xmaxA, ys));
      });
    }
  });

  Curves.figure({
    id: 'fig-170d', section: 'semi-cubic-parabola', page: 187,
    title: 'The semi-cubic y² = (x−1)(x−2)²: a loop with a node at (2, 0)',
    tags: ['sketching', 'semi-polynomial', 'node'],
    note: 'The y scale is about 3.4 times the x scale (the book uses different scales on the two axes).',
    build(k) {
      const ys = YS.d, yt = 215, yb = -215;
      k.frame(-50, yb - 20, 420, yt + 70);
      k.given('Draw the axes X and Y, and mark the intercepts x = 1 and x = 2.', () => {
        axesFor(k, 'Y', yb, yt);
        roots(k, [1, 2]);
        k.text(-30, yt + 45, 'y^2 = (x−1)(x−2)^2', { upright: true, size: 0.85, anchor: 'start' });
      });
      const xm = 4 / 3, hm = Math.sqrt(Pb(xm));
      k.step('ruler', 'Take the square root of the ordinates of the cubic and lay it off above and below the axis: at x = 4/3 the cubic has its maximum 4/27, so the heights are ±0.385.', () => {
        [1, 2].forEach(r => k.seg(k.pt(U * r, 0), k.pt(U * r, yt - 40), { cls: 'cons', dash: true }));
        k.seg(k.pt(U * xm, 0), k.pt(U * xm, yt - 40), { cls: 'cons', dash: true });
        k.dot(k.pt(U * xm, U * ys * hm), { open: true, r: 1.2 });
        k.dot(k.pt(U * xm, -U * ys * hm), { open: true, r: 1.2 });
      });
      k.step('pencil', 'Draw the loop between x = 1 and x = 2 and the two arms leaving x = 2. At x = 2 the slope is the limit of ±√(x − 1) = ±1: two distinct tangents, so (2, 0) is a node.', () => {
        // y = (x−2)·sqrt(x−1): x = 1 + s², y = (s² − 1)·s
        const S = Math.sqrt(xmaxB - 1), pts = [];
        for (let i = -240; i <= 240; i++) { const s = S * i / 240, x = 1 + s * s; pts.push([U * x, U * ys * (x - 2) * s]); }
        k.curve(pts);
      });
    }
  });
})();
