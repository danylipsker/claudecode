/* Curves Workshop · figures/evolutes.js — Figs. 80–85 (pages 86–92)
 *
 * 80  the centre of curvature (α, β) of a curve at (x, y)          81  the arc of the evolute is the difference of the radii
 * 82  the evolutes of the ellipse, the parabola and the hyperbola   83  the evolutes of the cycloidal curves
 * 84  y = xⁿ and curves with cusps, with their evolutes             85  the intrinsic equation of the evolute
 *
 * Every evolute is computed, never sketched: from the parametric curve with k.g.centerOfCurvature, from a
 * Whewell equation R(φ) (figures 80, 81, 85), or, for the power curves of Fig. 84, from the exact formulas
 * α = x − y'(1 + y'²)/y'', β = y + (1 + y'²)/y'' (which the numerical routine reproduces).
 */
(function () {
  'use strict';

  /* the centres of curvature of f(t), t0 … t1: the evolute as a list of points. Parameters closer than 4e-3
     to a cusp of f (where R = 0 and the numerical curvature fails) give the cusp itself, which lies on the evolute. */
  function evolute(g, f, t0, t1, n, cusps) {
    const out = [];
    for (let i = 0; i <= n; i++) {
      const t = t0 + (t1 - t0) * i / n;
      const c = (cusps || []).find(s => Math.abs(t - s) < 4e-3);
      if (c != null) { const p = f(c); out.push([p[0], p[1]]); continue; }
      const q = g.centerOfCurvature(f, t);
      out.push(q ? [q.x, q.y] : null);
    }
    return out;
  }

  /* a curve given by its Whewell equation: the radius of curvature R(φ) as a function of the tangential angle.
     x(φ) = ∫ R cos φ dφ, y(φ) = ∫ R sin φ dφ from φ = 0 (Simpson's rule on a table), tangent horizontal at the origin. */
  function whewell(R, phiMax, N) {
    N = N || 2000;
    const h = phiMax / N, xs = [0], ys = [0];
    for (let i = 0; i < N; i++) {
      const a = i * h, m = a + h / 2, b = a + h;
      xs.push(xs[i] + h / 6 * (R(a) * Math.cos(a) + 4 * R(m) * Math.cos(m) + R(b) * Math.cos(b)));
      ys.push(ys[i] + h / 6 * (R(a) * Math.sin(a) + 4 * R(m) * Math.sin(m) + R(b) * Math.sin(b)));
    }
    const at = (arr, p) => { const u = Math.min(Math.max(p / h, 0), N - 1e-9), i = Math.floor(u), f = u - i; return arr[i] * (1 - f) + arr[i + 1] * f; };
    const pt = p => [at(xs, p), at(ys, p)];
    const centre = p => { const q = pt(p), r = R(p); return [q[0] - r * Math.sin(p), q[1] + r * Math.cos(p)]; };
    return { pt, centre, R };
  }

  const heavy = { cls: 'curve' };

  /* ------------------------------------------------------------------ Fig. 80, page 86 */
  Curves.figure({
    id: 'fig-080',
    section: 'evolutes',
    page: 86,
    title: 'The centre of curvature (α, β) of a curve at (x, y)',
    tags: ['evolute', 'centre of curvature', 'definition'],
    note: 'The book draws a free sketch. Here the curve is a Whewell curve R(φ) = R(1 + 8(φ − φ₀)²), so the circle drawn is its true circle of curvature at (x, y), and the curve leaves the circle on both sides, as in the book.',
    build(k) {
      const g = k.g, phi0 = g.deg(62), R0 = 283, m = 8;                   // R(φ) = R0 (1 + m (φ − φ0)²): the curvature is greatest at (x, y)
      const W = whewell(p => R0 * (1 + m * (p - phi0) * (p - phi0)), 1.6);
      const base = W.pt(phi0), target = k.pt(732, 267);
      const sh = p => { const q = W.pt(p); return [q[0] - base[0] + target.x, q[1] - base[1] + target.y]; };
      const P = k.pt(...sh(phi0));
      const C = k.pt(P.x - R0 * Math.sin(phi0), P.y + R0 * Math.cos(phi0));
      const O = k.pt(0, 0), Xb = k.pt(P.x - P.y / Math.tan(phi0), 0);
      const foot = k.pt(C.x, 0), side = k.pt(C.x, P.y);
      k.given('The axes and the curve; (x, y) is a point of the curve, φ the angle its tangent makes with OX (the tangential angle), and R the radius of curvature there.', () => {
        k.axes(O, { x: [-100, 910], y: [-210, 760] });
        k.dot(O, { open: true, r: 1.4 });
        k.curve(p => sh(p), [0.42, 1.57], { cls: "thick", n: 160 });
        k.point(P, '(x, y)', { at: 'e', open: true, r: 0.9, lo: { upright: true, size: 0.85, dist: 1.15 } });
      });
      k.step('compass', 'The circle of curvature at (x, y): the circle that touches the curve there and has the same curvature, radius R. Its centre (α, β) is the centre of curvature.', () => {
        k.circle(C, R0);
        k.point(C, '(α, β)', { at: 'n', open: true, r: 0.8, lo: { upright: true, size: 0.85, dist: 1.6 } });
      });
      k.step('straightedge', 'Join the centre to (x, y): this is the normal, of length R. Drop the perpendicular from (α, β) to OX and the horizontal from (x, y) to it: they make a right triangle with hypotenuse R.', () => {
        k.seg(C, P);
        k.seg(C, foot);
        k.seg(side, P);
        k.label(g.mid(C, P), 'R', 'ne', { upright: true, size: 0.9, dist: 1.2 });
        k.dot(C, { open: true, r: 0.8 }); k.dot(P, { open: true, r: 0.9 });
      });
      k.step('straightedge', 'Draw the tangent at (x, y), inclined at φ to OX.', () => {
        k.seg(k.pt(Xb.x - 55 * Math.cos(phi0), -55 * Math.sin(phi0)), P, { cls: 'given' });
      });
      k.note('The tangent makes the angle φ with OX, and so does the normal with the vertical: the angle at (α, β) is φ. From the triangle α = x − R sin φ and β = y + R cos φ.', () => {
        k.angle(C, k.pt(C.x, C.y - 100), P, { label: 'φ', r: 1.5, labelDist: 1.6, cls: 'given' });
        k.angle(Xb, k.pt(Xb.x + 100, 0), P, { label: 'φ', r: 1.6, labelDist: 1.5, cls: 'given' });
        k.text(560, -80, 'α = x − R sin φ', { size: 0.9, upright: true, anchor: 'start' });
        k.text(560, -150, 'β = y + R cos φ', { size: 0.9, upright: true, anchor: 'start' });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 81, page 87 */
  /* A Whewell curve R(φ) = R2 (1 + cφ²), from the point B2 (horizontal tangent, radius R2) to B1 (radius R1):
     the evolute is the locus of the centres, and σ = R1 − R2 is its length (R increases monotonically). */
  Curves.figure({
    id: 'fig-081',
    section: 'evolutes',
    page: 87,
    title: 'The arc of the evolute is the difference of the radii of curvature',
    tags: ['evolute', 'string', 'involute'],
    build(k) {
      const g = k.g, R2 = 305, c = 0.95, p1 = 1.257;
      const W = whewell(p => R2 * (1 + c * p * p), 1.4);
      const B2 = k.pt(0, 0), B1 = k.pt(...W.pt(p1));
      const E2 = k.pt(...W.centre(0)), E1 = k.pt(...W.centre(p1));
      const R1 = W.R(p1);
      const sig = g.arcLength(p => W.centre(p), 0, p1, 600);
      k.given('The given curve between two points, drawn heavy. At the end points the radii of curvature are R2 (lower) and R1 (upper); the arc between them has length s.', () => {
        k.curve(p => W.pt(p), [0, p1], { cls: 'thick', n: 200 });
        k.dot(B2, { open: true, r: 1.1 }); k.dot(B1, { open: true, r: 1.1 });
        k.label(k.pt(...W.pt(0.75)), 's', 'nw', { size: 0.95, dist: 1.2 });
        k.label(k.pt(...W.pt(0.9)), 'given curve', 'se', { size: 0.8, dist: 2.2 });
      });
      k.step('straightedge', 'Draw the normals at the two ends and mark on each the radius of curvature, R2 and R1: their other ends E2 and E1 are the centres of curvature.', () => {
        k.seg(B2, E2); k.seg(B1, E1);
        k.dot(E2, { open: true, r: 1.1 }); k.dot(E1, { open: true, r: 1.1 });
        k.label(g.mid(B2, E2), 'R_2', 'e', { upright: true, size: 0.9, dist: 1.1 });
        k.label(g.mid(B1, E1), 'R_1', 'ne', { upright: true, size: 0.9, dist: 1.1 });
      });
      k.step('pencil', 'The centres of curvature of all the points between lie on a curve, the evolute, from E2 to E1. The normals R2 and R1 are tangent to it at its ends.', () => {
        k.curve(p => W.centre(p), [0, p1 + 0.1], { cls: 'thick', n: 200 });
        k.label(k.pt(...W.centre(0.55)), 'evolute', 'sw', { size: 0.8, dist: 1.8 });
      });
      k.note('Unwind a string from the evolute: the end of the string traces the given curve. The length σ of the evolute is exactly R1 − R2, because the string wraps along the evolute and then stands out along the tangent R.', () => {
        k.label(k.pt(...W.centre(0.6)), 'σ', 'e', { size: 1, dist: 1.6 });
        k.text(B2.x + 40, B2.y - 90, 'σ = R_1 − R_2', { size: 0.9, upright: true, anchor: 'start' });
        const ok = Math.abs(sig - (R1 - R2));
        if (ok > 1.5) throw new Error('fig-081: σ ≠ R1 − R2 (' + ok + ')');
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 82, page 88 */
  /* (a) the ellipse x²/a² + y²/b² = 1: the evolute is (ax)^{2/3} + (by)^{2/3} = (a² − b²)^{2/3}, an astroid-like curve
     with four cusps at (±(a² − b²)/a, 0) and (0, ±(a² − b²)/b). */
  Curves.figure({
    id: 'fig-082a',
    section: 'evolutes',
    page: 88,
    title: 'The evolute of the ellipse',
    tags: ['evolute', 'ellipse', 'Lamé curve'],
    build(k) {
      const g = k.g, a = 190, b = 98, ca = (a * a - b * b) / a, cb = (a * a - b * b) / b, t0 = g.deg(42);
      const f = k.curves.ellipse(a, b);
      const P = k.pt(...f(t0)), Cc = g.centerOfCurvature(f, t0), C = k.pt(Cc.x, Cc.y);
      k.given('The ellipse with its axes.', () => {
        k.seg(k.pt(-a, 0), k.pt(a, 0));
        k.seg(k.pt(0, -cb), k.pt(0, cb));
        k.label(k.pt(a, 0), 'X', 'e', { cls: 'axis', dist: 1.3 });
        k.curve(f, [0, k.TAU], { cls: 'given', n: 240 });
      });
      k.step('straightedge', 'The normal at a point P of the ellipse meets the evolute where the centre of curvature C is: CP = R (see Conics 20 for a construction of C).', () => {
        k.seg(P, C);
        k.dot(P, { open: true, r: 1 }); k.dot(C, { open: true, r: 1 });
      });
      k.step('pencil', 'The locus of the centres of curvature is the evolute: its four cusps are the centres of curvature of the vertices, at (±(a² − b²)/a, 0) and (0, ±(a² − b²)/b). Its equation is (x/A)^{2/3} + (y/B)^{2/3} = 1 with Aa = Bb = a² − b².', () => {
        k.curve(evolute(g, f, 0, k.TAU, 480), null, heavy);
        [[ca, 0], [-ca, 0], [0, cb], [0, -cb]].forEach(p => k.dot(k.pt(p[0], p[1]), { open: true, r: 1.1 }));
        k.label(k.pt(0, cb), 'Y', 'e', { cls: 'axis', dist: 1.5 });
      });
    }
  });

  /* (b) the parabola x² = 2ky: the evolute is x² = (8/27k)(y − k)³, a semi-cubic parabola with its cusp at (0, k). */
  Curves.figure({
    id: 'fig-082b',
    section: 'evolutes',
    page: 88,
    title: 'The evolute of the parabola',
    tags: ['evolute', 'parabola', 'semi-cubic parabola'],
    build(k) {
      const g = k.g, kk = 144, f = t => [t, t * t / (2 * kk)], u0 = 175;
      const P = k.pt(...f(u0)), Cc = g.centerOfCurvature(f, u0), C = k.pt(Cc.x, Cc.y);
      const O = k.pt(0, 0);
      k.given('The axes (OX is the tangent at the vertex) and the parabola x² = 2ky.', () => {
        k.axes(O, { x: [-480, 490], y: [-10, 935] });
        k.curve(f, [-485, 485], { cls: 'given', n: 240 });
      });
      k.step('straightedge', 'The normal at a point P meets the evolute at the centre of curvature C: CP = R.', () => {
        k.seg(P, C);
        k.dot(P, { open: true, r: 1 }); k.dot(C, { open: true, r: 1 });
      });
      k.step('pencil', 'The evolute is a semi-cubic parabola, x² = (8/27k)(y − k)³, with its cusp at (0, k) (the centre of curvature of the vertex, radius k).', () => {
        k.curve(evolute(g, f, -222, 222, 400), null, heavy);
        k.dot(k.pt(0, kk), { open: true, r: 1.2 });
      });
    }
  });

  /* (c) the hyperbola x²/a² − y²/b² = 1: the evolute is (x/H)^{2/3} − (y/K)^{2/3} = 1, Ha = Kb = a² + b², with two
     cusps at (±(a² + b²)/a, 0) on the axis, each with two arms spreading outwards. */
  Curves.figure({
    id: 'fig-082c',
    section: 'evolutes',
    page: 88,
    title: 'The evolute of the hyperbola',
    tags: ['evolute', 'hyperbola', 'asymptotes'],
    build(k) {
      const g = k.g, a = 180, b = 170, H = (a * a + b * b) / a;
      const f = k.curves.hyperbola(a, b), fl = t => { const p = f(t); return [-p[0], p[1]]; };
      const O = k.pt(0, 0);
      k.given('The axes, the asymptotes y = ±(b/a)x and the two branches of the hyperbola.', () => {
        k.axes(O, { x: [-560, 560], y: [-185, 390] });
        k.seg(k.pt(-445, -445 * b / a), k.pt(445, 445 * b / a), { cls: 'given' });
        k.seg(k.pt(-445, 445 * b / a), k.pt(445, -445 * b / a), { cls: 'given' });
        k.curve(f, [-1.55, 1.55], { cls: 'given', n: 200 });
        k.curve(fl, [-1.55, 1.55], { cls: 'given', n: 200 });
      });
      k.step('pencil', 'The evolute is the locus of the centres of curvature: each branch has a centre-of-curvature cusp on the axis at distance (a² + b²)/a from O (beyond the vertex), and two arms that spread outwards. Its equation is (x/H)^{2/3} − (y/K)^{2/3} = 1 with Ha = Kb = a² + b².', () => {
        k.curve(evolute(g, f, -0.56, 0.56, 200), null, heavy);
        k.curve(evolute(g, fl, -0.56, 0.56, 200), null, heavy);
        k.dot(k.pt(H, 0), { open: true, r: 1.1 }); k.dot(k.pt(-H, 0), { open: true, r: 1.1 });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 83, page 89 */
  /* The cycloidal curves have evolutes of the same species. In every panel the book prints the intrinsic
     equations of the given curve (s) and of its evolute (σ), the given curve thin and the evolute heavy.
     The deltoid and astroid panels show the given curve and the evolute heavy, with the fixed circles and axes. */
  const open = { open: true, r: 1.0 };

  Curves.figure({
    id: 'fig-083a',
    section: 'evolutes',
    page: 89,
    title: 'The evolute of the cycloid is an equal cycloid',
    tags: ['evolute', 'cycloid'],
    build(k) {
      const g = k.g, a = 60, f = k.curves.cycloid(a), T = 4 * Math.PI;
      k.given('The cycloid: two arches with cusps on a line, from the circle of radius a rolling along it (s = 4a sin t, measured from the top of an arch).', () => {
        k.curve(f, [-1.2, T + 1.2], { cls: 'given', n: 300 });
        k.text(T * a / 2, 2 * a + 70, 's = 4a sin t', { upright: true, size: 1 });
      });
      k.step('pencil', 'The evolute is the same cycloid, moved half a period along and down by 2a: its arches hang below the line, hanging from the cusps of the given curve (σ = 4a cos t).', () => {
        k.curve(evolute(g, f, -0.28, T, 700, [0, 2 * Math.PI, T]), null, heavy);
        k.text(T * a / 2, -2 * a - 60, 'σ = 4a cos t', { upright: true, size: 1 });
      });
    }
  });

  Curves.figure({
    id: 'fig-083b',
    section: 'evolutes',
    page: 89,
    title: 'The evolute of the cardioid is a cardioid',
    tags: ['evolute', 'cardioid'],
    note: 'The book draws the evolute about half the size of the cardioid; the true ratio, from the intrinsic equations printed in the figure, is one third, and that is what is drawn.',
    build(k) {
      const g = k.g, a = 100, f = k.curves.cardioid(a);
      k.given('The cardioid (thin), with its cusp on the right.', () => {
        k.curve(f, [0, k.TAU], { cls: 'given', n: 360 });
        k.text(-a, 3.25 * a, 's = 8a cos(φ/3)', { upright: true, size: 1 });
      });
      k.step('pencil', 'The evolute (heavy) is a cardioid one third the size, turned half way round: its cusp points left and its right-hand side touches the given cusp.', () => {
        k.curve(evolute(g, f, 0, k.TAU, 800, [0, k.TAU]), null, heavy);
        k.text(-a, -3.25 * a, 'σ = (8a/3) sin(φ/3)', { upright: true, size: 1 });
      });
    }
  });

  Curves.figure({
    id: 'fig-083c',
    section: 'evolutes',
    page: 89,
    title: 'The evolute of the nephroid is a nephroid',
    tags: ['evolute', 'nephroid'],
    build(k) {
      const g = k.g, a = 100, f0 = k.curves.nephroid(a), f = t => { const p = f0(t); return [-p[1], p[0]]; };
      k.given('The nephroid (thin), with its two cusps top and bottom.', () => {
        k.curve(f, [0, k.TAU], { cls: 'given', n: 360 });
        k.text(0, 3.4 * a, 's = 3a sin(φ/2)', { upright: true, size: 1 });
      });
      k.step('pencil', 'The evolute (heavy) is a nephroid half the size, turned through a right angle: its cusps lie on the horizontal axis (σ = (3a/2) cos(φ/2)).', () => {
        k.curve(evolute(g, f, 0, k.TAU, 800, [0, Math.PI, k.TAU]), null, heavy);
        k.text(0, -3.4 * a, 'σ = (3a/2) cos(φ/2)', { upright: true, size: 1 });
      });
    }
  });

  Curves.figure({
    id: 'fig-083d',
    section: 'evolutes',
    page: 89,
    title: 'The evolute of the deltoid is a deltoid three times as large',
    tags: ['evolute', 'deltoid'],
    note: 'The book prints the arc length of the deltoid as a capital S; it is the s of the other panels.',
    build(k) {
      const g = k.g, a = 55, f = k.curves.deltoid(a), O = k.pt(0, 0), r1 = 3 * a, r2 = 9 * a;
      const cusp = (r, deg) => g.polar(O, r, g.deg(deg));
      const small = [0, 120, 240].map(d => cusp(r1, d)), big = [180, 60, -60].map(d => cusp(r2, d));
      k.given('The deltoid (heavy) with its three cusps on the circle of radius 3a about O (the circle through the cusps), and its three axes of symmetry.', () => {
        k.circle(O, r1);
        k.curve(f, [0, k.TAU], { cls: 'thick', n: 300 });
        small.forEach(p => k.dot(p, open));
        k.dot(O, { open: true, r: 0.6 });
        k.text(-r2 * 0.55, -r2 - 70, 's = (8a/9) cos 3t', { upright: true, size: 0.9 });
      });
      k.step('straightedge', 'Draw the three axes of symmetry, each through O from a cusp to the opposite side.', () => {
        [[0, 0], [1, 2], [2, 1]].forEach(([i, j]) => k.seg(small[i], big[j], { cls: 'cons' }));
        k.seg(small[0], cusp(r2, 0), { cls: 'cons' });
      });
      k.step('pencil', 'The evolute is a deltoid three times as large, turned through 60°: its cusps are on the circle of radius 9a, on the axes opposite the cusps of the given deltoid (σ = (8a/3) sin 3t).', () => {
        k.circle(O, r2, { cls: 'cons' });
        k.curve(evolute(g, f, 0, k.TAU, 900, [0, 2 * Math.PI / 3, 4 * Math.PI / 3, k.TAU]), null, heavy);
        big.forEach(p => k.dot(p, open));
        k.text(r2 * 0.55, -r2 - 70, 'σ = (8a/3) sin 3t', { upright: true, size: 0.9 });
      });
    }
  });

  Curves.figure({
    id: 'fig-083e',
    section: 'evolutes',
    page: 89,
    title: 'The evolute of the astroid is an astroid twice as large',
    tags: ['evolute', 'astroid'],
    build(k) {
      const g = k.g, a = 250, f = k.curves.astroid(a), O = k.pt(0, 0), R2 = 2 * a;
      const inner = [0, 90, 180, 270].map(d => g.polar(O, a, g.deg(d))), outer = [45, 135, 225, 315].map(d => g.polar(O, R2, g.deg(d)));
      k.given('The astroid (heavy) with its cusps on the axes at distance a, the circles of radii a/2 and a about O, and the two axes.', () => {
        k.circle(O, a / 2, { cls: 'cons' });
        k.circle(O, a, { cls: 'cons' });
        k.curve(f, [0, k.TAU], { cls: 'thick', n: 360 });
        inner.forEach(p => k.dot(p, open));
        k.dot(O, { open: true, r: 0.6 });
        k.text(-a * 0.95, -R2 - 70, 's = (3a/4) cos 2t', { upright: true, size: 0.9 });
      });
      k.step('straightedge', 'Draw the diagonals through O: the evolute\'s cusps will lie on them.', () => {
        k.seg(outer[0], outer[2], { cls: 'cons' }); k.seg(outer[1], outer[3], { cls: 'cons' });
        k.seg(k.pt(-R2, 0), k.pt(R2, 0), { cls: 'cons' }); k.seg(k.pt(0, -R2), k.pt(0, R2), { cls: 'cons' });
      });
      k.step('pencil', 'The evolute is an astroid twice as large, turned through 45°: its cusps are on the diagonals, on the circle of radius 2a (σ = (3a/2) sin 2t).', () => {
        k.circle(O, R2, { cls: 'cons' });
        k.curve(evolute(g, f, 0, k.TAU, 900, [0, Math.PI / 2, Math.PI, 1.5 * Math.PI, k.TAU]), null, heavy);
        outer.forEach(p => k.dot(p, open));
        k.text(a * 0.95, -R2 - 70, 'σ = (3a/2) sin 2t', { upright: true, size: 0.9 });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 84, page 90 */
  /* y = xⁿ (n = 4/3, 4, 3, 5/3) and the semicubical y² = x³ and y² = x⁵. R0, the radius of curvature at the origin,
     is 0 when the curve is sharper than a parabola there (exponent < 2) and ∞ when flatter. The evolutes are
     the exact ones; the book draws parts of them of about the same extent. The unit is the unit of the equation. */
  const pow = n => x => {                                          // the centre of curvature of y = x^n, x > 0
    const y1 = n * Math.pow(x, n - 1), y2 = n * (n - 1) * Math.pow(x, n - 2), w = (1 + y1 * y1) / y2;
    return [x - y1 * w, Math.pow(x, n) + w];
  };
  const range = (a, b, N, cube) => Array.from({ length: N + 1 }, (_, i) => { const u = i / N; return a + (b - a) * (cube ? u * u * u : u); });
  const mirrorX = pts => pts.map(p => [-p[0], p[1]]), mirrorO = pts => pts.map(p => [-p[0], -p[1]]);
  const U = 150;                                                   // units of the equations -> drawing units (the SVG rounds to 0.01)
  const up = pts => pts.map(p => [U * p[0], U * p[1]]);

  function panel(id, title, tags, spec) {
    Curves.figure({
      id, section: 'evolutes', page: 90, title, tags: ['evolute', 'cusp'].concat(tags),
      note: spec.note,
      build(k) {
        const O = k.pt(0, 0);
        k.given(spec.given, () => {
          k.axes(O, { x: spec.xr.map(v => v * U), y: spec.yr.map(v => v * U) });
          k.dot(O, { open: true, r: 1.5 });
          spec.curve(k);
          k.text(spec.r0[0] * U, spec.r0[1] * U, spec.r0[2], { upright: true, size: 0.95 });
          k.text(spec.eq[0] * U, spec.eq[1] * U, spec.eq[2], { upright: true, size: 0.8 });
        });
        k.step('pencil', spec.result, () => spec.evolute(k));
      }
    });
  }
  const cv = (k, f, r, o) => k.curve(t => { const p = f(t); return [U * p[0], U * p[1]]; }, r, o);

  panel('fig-084a', 'The evolute of y³ = x⁴ (R₀ = 0)', ['power curve'], {
    given: 'The axes and the curve y³ = x⁴ (y = x^{4/3}), which is sharper than a parabola at O: its radius of curvature there is R0 = 0.',
    result: 'The evolute (heavy): each half of the curve has its centre of curvature on the other side of the axis, and as the point goes to O the centre goes to O too, so the two arcs of the evolute leave O upwards and then spread out.',
    xr: [-2.5, 2.4], yr: [-0.1, 4.5], r0: [1.4, 0.45, 'R_0 = 0'], eq: [0, -0.55, 'y^3 = x^4'],
    curve: k => cv(k, t => [t, Math.pow(Math.abs(t), 4 / 3)], [-2.72, 2.72], { cls: 'given', n: 300 }),
    evolute: k => { const e = up(range(1e-6, 0.55, 300, true).map(pow(4 / 3))); k.curve(e, null, heavy); k.curve(mirrorX(e), null, heavy); }
  });
  panel('fig-084b', 'The evolute of y = x⁴ (R₀ = ∞)', ['power curve'], {
    given: 'The axes and the quartic y = x⁴, which is flatter than a parabola at O: R0 = ∞.',
    result: 'The evolute (heavy): the centres of curvature of the flat part go off to infinity along the y-axis (two spikes), each half has a cusp, and the arcs beyond the cusps cross the axis.',
    xr: [-1.35, 1.38], yr: [-0.44, 2.93], r0: [0.9, 0.17, 'R_0 = ∞'], eq: [0.41, -0.32, 'y = x^4'],
    curve: k => cv(k, t => [t, Math.pow(t, 4)], [-1.25, 1.25], { cls: 'given', n: 240 }),
    evolute: k => { const e = up(range(0.185, 0.85, 500).map(pow(4))); k.curve(e, null, heavy); k.curve(mirrorX(e), null, heavy); }
  });
  panel('fig-084c', 'The evolute of y = x³ (R₀ = ∞)', ['power curve', 'flex'], {
    given: 'The axes and the cubic y = x³: a flex at O, where the curvature is zero (R0 = ∞).',
    result: 'The evolute (heavy): the flex corresponds to an asymptote of the evolute, here the y-axis; each half has a cusp and an arm crossing the axis.',
    xr: [-2.5, 2.1], yr: [-2.66, 2.86], r0: [1.25, -0.52, 'R_0 = ∞'], eq: [1.25, -2.2, 'y = x^3'],
    curve: k => cv(k, t => [t, t * t * t], [-1.4, 1.4], { cls: 'given', n: 240 }),
    evolute: k => { const e = up(range(0.065, 0.89, 500).map(pow(3))); k.curve(e, null, heavy); k.curve(mirrorO(e), null, heavy); }
  });
  panel('fig-084d', 'The evolute of y³ = x⁵ (R₀ = 0)', ['power curve'], {
    given: 'The axes and the curve y³ = x⁵ (y = x^{5/3}), which is sharper than a parabola at O: R0 = 0.',
    result: 'The evolute (heavy) passes through O with a vertical tangent: one smooth curve, from the upper left to the lower right.',
    xr: [-2.4, 2.5], yr: [-2.57, 2.6], r0: [-1.3, 0.47, 'R_0 = 0'], eq: [-1.6, -0.35, 'y^3 = x^5'],
    curve: k => cv(k, t => [t, Math.sign(t) * Math.pow(Math.abs(t), 5 / 3)], [-1.8, 1.8], { cls: 'given', n: 300 }),
    evolute: k => { const e = up(range(1e-6, 0.7, 300, true).map(pow(5 / 3))); k.curve(mirrorO(e).reverse().concat(e), null, heavy); }
  });
  panel('fig-084e', 'The evolute of the semicubical parabola y² = x³ (R₀ = 0)', ['power curve', 'semicubical parabola'], {
    given: 'The axes and the semicubical parabola y² = x³, x = t², y = t³: a cusp at O (of the first kind), R0 = 0.',
    result: 'The evolute (heavy) passes through the cusp of the given curve, with a vertical tangent there, and bends away to the left on both sides.',
    xr: [-2.04, 2.22], yr: [-2.49, 2.35], r0: [-0.84, 0.3, 'R_0 = 0'], eq: [-0.96, -0.37, 'y^2 = x^3'],
    curve: k => cv(k, t => [t * t, t * t * t], [-1.33, 1.33], { cls: 'given', n: 240 }),
    evolute: k => cv(k, t => [-t * t - 4.5 * Math.pow(t, 4), 4 / 3 * t + 4 * t * t * t], [-0.7, 0.7], { cls: 'curve', n: 240 })
  });
  panel('fig-084f', 'The evolute of y² = x⁵ (R₀ = ∞)', ['power curve', 'cusp'], {
    given: 'The axes and the curve y² = x⁵, x = t², y = t⁵: a cusp at O with both branches tangent to OX, and R0 = ∞.',
    result: 'The evolute (heavy): R0 = ∞, so the centres of curvature of the part near O run off to infinity along the y-axis (two spikes), each with its own cusp, and long arms that cross the axis.',
    xr: [-2.44, 2.27], yr: [-2.7, 2.77], r0: [-1.04, 0.43, 'R_0 = ∞'], eq: [-1.05, -0.4, 'y^2 = x^5'],
    curve: k => cv(k, t => [t * t, Math.pow(t, 5)], [-1.22, 1.22], { cls: 'given', n: 240 }),
    evolute: k => {
      const half = s => t => [t * t / 3 - 25 / 6 * Math.pow(t, 8), s * (4 / 15 / t + 8 / 3 * Math.pow(t, 5))];
      cv(k, half(1), [0.105, 0.96], { cls: 'curve', n: 400 });
      cv(k, half(-1), [0.105, 0.96], { cls: 'curve', n: 400 });
    }
  });

  /* ------------------------------------------------------------------ Fig. 85, page 92 */
  /* A curve s = f(φ) with the points O (φ = 0) and P, and the points O' and P' of its evolute: the normal at P
     touches the evolute at P', so σ = R_P − R_0 = f'(φ) − R_0; with the angle β of the normal, β = φ + π/2.
     Here f'(φ) = R(φ) = R0 (1 + cφ²). */
  Curves.figure({
    id: 'fig-085',
    section: 'evolutes',
    page: 92,
    title: 'The intrinsic equation of the evolute: σ = R_P − R_0',
    tags: ['evolute', 'intrinsic equation', 'Whewell'],
    build(k) {
      const g = k.g, R0 = 250, c = 4.3, phiP = 0.76;
      const W = whewell(p => R0 * (1 + c * p * p), 1.1);
      const O = k.pt(0, 0), P = k.pt(...W.pt(phiP)), O2 = k.pt(...W.centre(0)), P2 = k.pt(...W.centre(phiP));
      const RP = W.R(phiP), u = g.dir(phiP), n = g.dir(phiP + Math.PI / 2);
      const Xn = g.lineLine(P, g.add(P, n), O, k.pt(1, 0)), Xt = g.lineLine(P, g.add(P, u), O, k.pt(1, 0));
      const sig = g.arcLength(p => W.centre(p), 0, phiP, 600);
      if (Math.abs(sig - (RP - R0)) > 1.5) throw new Error('fig-085: σ ≠ R_P − R_0');
      k.given('The axes, and the given curve s = f(φ) from O, where the tangent is OX (heavy). P is the point with tangential angle φ.', () => {
        k.axes(O, { x: [-340, 640], y: [-145, 880] });
        k.curve(p => W.pt(p), [0, phiP + 0.2], { cls: 'thick', n: 160 });
        k.point(O, 'O', { at: 'nw', open: true, r: 1.5 });
        k.point(P, 'P', { at: 'n', open: true, r: 1.2 });
        k.label(k.pt(...W.pt(0.45)), 's', 'nw', { dist: 1.3 });
      });
      k.step('straightedge', 'Draw the tangent at P (inclined at φ to OX) and the normal at P. The normal makes the angle β = φ + π/2 with OX.', () => {
        k.seg(g.along(Xt, P, -75), g.add(P, g.mul(u, 235)), { cls: 'given' });
        k.seg(P2, g.add(Xn, g.mul(n, -75)), { cls: 'given' });
        k.dot(P, { open: true, r: 1.2 });
      });
      k.step('compass', 'The centres of curvature: O\' on the normal at O at distance R0 = R_O above O, and P\' on the normal at P at the distance R_P = f\'(φ) from P.', () => {
        k.point(O2, 'O\'', { at: 'e', open: true, r: 1.2 });
        k.point(P2, 'P\'', { at: 'ne', open: true, r: 1.2 });
      });
      k.step('pencil', 'The evolute from O\' to P\' (heavy): it touches the normal at P\' and its length is σ = R_P − R_0 = f\'(φ) − R_0, or, with β: σ = f\'(β − π/2) − R_0.', () => {
        k.curve(p => W.centre(p), [0, phiP + 0.12], { cls: 'thick', n: 160 });
        k.label(k.pt(...W.centre(0.35)), 'σ', 'w', { dist: 1.2 });
      });
      k.note('The angles: φ between the tangent and OX, β between the normal and OX.', () => {
        k.angle(Xt, k.pt(Xt.x + 100, 0), P, { label: 'φ', r: 1.6, labelDist: 1.5, cls: 'given' });
        k.angle(Xn, k.pt(Xn.x + 100, 0), P2, { label: 'β', r: 1.6, labelDist: 1.5, cls: 'given' });
      });
    }
  });
})();
