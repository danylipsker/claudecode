/* Curves Workshop · figures/radial.js — Figs. 157(a), 157(b) (page 172) and 158 a–c (page 173)
 *
 * The radial of a curve with respect to a point O: from O draw the line equal and parallel to the radius of curvature
 * at every point P of the curve; the end points of those lines form the radial. The book draws the line from O in the
 * sense C→P (C the centre of curvature), that is O + (P − C); the same convention is used in every figure here.
 * Each figure is drawn in the pixels of its own 2x close-up of the scan, with O at the origin and y upwards, so that
 * only proportions matter. */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ Fig. 157(a) */
  /* The cycloid with its cusp O on the base line. The rolling circle (radius a, centre Z) touches the base at H, OH = a t;
     P is the point of the circle that was at O. The normal of the cycloid at P is PH, the radius of curvature is R = 2 PH
     (the centre of curvature is the reflection of P in H) and makes the angle t/2 with the base line. From O the line
     of length R parallel to PH ends on the radial r = 4a sin(t/2), a circle of radius 2a about (0, 2a). */
  Curves.figure({
    id: 'fig-157a',
    section: 'radial',
    page: 172,
    title: 'The radial of the cycloid: a circle of radius 2a',
    tags: ['radial', 'cycloid', 'radius of curvature', 'circle'],
    note: 'The book draws the cycloid only near its cusp O, the rolling circle at t of about 72°, and the radial as a heavy circle.',
    build(k) {
      const g = k.g, a = 231, t = 1.25;
      const O = k.pt(0, 0);
      const H = k.pt(a * t, 0), Z = k.pt(a * t, a), Top = k.pt(a * t, 2 * a);
      const cyc = s => [a * (s - Math.sin(s)), a * (1 - Math.cos(s))];
      const P = k.pt(...cyc(t));
      const Rp = g.add(O, g.mul(g.sub(P, H), 2));                     // the end of the line OR = 2 PH, parallel to HP
      const big = k.pt(0, 2 * a);

      k.given('The base line, the cycloid near its cusp O (thin), and the axis of the cycloid through O.', () => {
        k.seg(k.pt(-469, 0), k.pt(506, 0), { cls: 'given' });
        k.seg(O, k.pt(0, 927), { cls: 'given' });
        k.curve(cyc, [-1.4, 1.4], { cls: 'given', n: 160 });
        k.point(O, '', { open: true, r: 2 });
        k.text(4, 122, 'O', { size: 1 });
      });
      k.step('roll', 'The generating circle of radius a rolls along the base line. When it touches the line at H, with OH equal to the arc a·t, the point P (which was at O) is on the cycloid. The angle at the centre between the vertical and ZP is t.', () => {
        k.circle(Z, a, { cls: 'given' });
        k.seg(Top, H, { cls: 'given' });
        k.dot(Top, { open: true, r: 2 }); k.dot(H, { open: true, r: 2 }); k.dot(Z, { open: true, r: 1.1 }); k.dot(P, { open: true, r: 2 });
        k.label(P, 'P', 'nw', { dist: 1.6 }); k.label(H, 'H', 'ne', { dist: 1.3 });
        k.dim(Top, Z, 'a', { dist: 1.2 }); k.dim(Z, H, 'a', { dist: 1.2 });
        k.angle(Z, P, H, { label: 't', r: 1.4, labelDist: 1.2 });
      });
      k.step('straightedge', 'Join P to H: H is the instantaneous centre of the rolling circle, so PH is the normal of the cycloid at P. Since the angle PH-top is a right angle in a semicircle, the angle between HP and the base line is half of t.', () => {
        k.seg(P, H, { cls: 'cons', dash: true });
        k.seg(P, Z, { cls: 'cons', dash: true });
        k.seg(P, Top, { cls: 'cons', dash: true });
        k.angle(H, P, k.pt(H.x - 130, 0), { label: 't/2', r: 2.2, labelDist: 1.25 });
      });
      k.step('square', 'The radius of curvature of the cycloid at P is twice PH. Through the point O draw the line parallel to HP.', () => {
        k.seg(O, g.along(O, Rp, g.dist(O, Rp) * 0.4), { cls: 'cons' });
      });
      k.step('dividers', 'Carry the length R = 2·PH from O along that line: its end R is a point of the radial.', () => {
        k.seg(O, Rp, { cls: 'thick' });
        k.dot(Rp, { open: true, r: 2 });
        k.label(g.lerp(O, Rp, 0.5), 'R', 'ne', { dist: 2.2 });
        k.angle(O, Rp, k.pt(-200, 0), { label: 't/2', r: 1.7, labelDist: 1.3 });
      });
      k.step('pencil', 'Repeat for other positions of the generating circle: the points R run along a circle of radius 2a through O (r = 4a sin(t/2) = 4a sin θ, with θ = π − t/2).', () => {
        k.circle(big, 2 * a, { cls: 'curve' });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 157(b) */
  /* The equiangular spiral r = r0 e^{k(φ − φ_P)} about its pole O (thin), with P on it, the tangent at P, the radius vector
     OP = r and the radius of curvature PC = R. For this spiral C lies on the perpendicular to OP at O, and R = r √(1 + k²).
     The line OR of length R, parallel to CP, ends on the radial, another equiangular spiral (heavy). θ is the inclination
     of R. Fitted to the book's drawing: k = 0.44, r = 436 at P (pixels of the 2x close-up). */
  Curves.figure({
    id: 'fig-157b',
    section: 'radial',
    page: 172,
    title: 'The radial of the equiangular spiral: another equiangular spiral',
    tags: ['radial', 'equiangular spiral', 'radius of curvature'],
    note: 'The spiral is drawn with k = 0.44, which fits the book\'s drawing; the radial then has the same k.',
    build(k) {
      const g = k.g, kk = 0.44, phiP = g.deg(133.1), rP = 436;
      const O = k.pt(0, 0);
      const f = s => { const r = rP * Math.exp(kk * (s - phiP)); return [r * Math.cos(s), r * Math.sin(s)]; };
      const P = k.pt(...f(phiP));
      const cc = g.centerOfCurvature(f, phiP);
      const C = k.pt(cc.x, cc.y);
      const Rp = g.sub(P, C);                                           // O + (P − C), O at the origin
      const radial = s => { const q = f(s), cv = g.centerOfCurvature(f, s); return [q[0] - cv.x, q[1] - cv.y]; };
      const T = g.frenet(f, phiP).T;
      const u = g.unit(g.sub(C, O));
      const X = g.lineLine(P, C, O, k.pt(1, 0));                        // where PC crosses the horizontal axis

      k.given('The pole O with the axes, and the equiangular spiral (thin) winding about it.', () => {
        k.seg(k.pt(-727, 0), k.pt(291, 0), { cls: 'given' });
        k.seg(k.pt(0, -261), k.pt(0, 497), { cls: 'given' });
        k.curve(f, [-3.4, 3.42], { cls: 'given', n: 500 });
        k.pivot(O);
      });
      k.step('straightedge', 'Take a point P of the spiral. Draw the tangent at P and the radius vector OP = r.', () => {
        k.seg(g.sub(P, g.mul(T, 409)), g.add(P, g.mul(T, 170)), { cls: 'given' });
        k.seg(O, P, { cls: 'given' });
        k.dot(P, { open: true, r: 2 });
        k.label(g.lerp(O, P, 0.5), 'r', 'ne', { dist: 1.4 });
      });
      k.step('square', 'The centre of curvature C of an equiangular spiral is on the perpendicular to OP at O. Draw that perpendicular and the normal at P: they meet at C, and PC = R is the radius of curvature, which makes the angle θ with the axis.', () => {
        k.seg(g.sub(O, g.mul(u, 351)), g.add(O, g.mul(u, 366)), { cls: 'given' });
        k.seg(P, C, { cls: 'given' });
        k.dot(C, { open: true, r: 2 });
        k.label(g.lerp(P, C, 0.35), 'R', 'w', { dist: 1.3 });
        k.angle(X, k.pt(X.x + 200, 0), P, { label: 'θ', r: 1.5, labelDist: 1.3 });
      });
      k.step('dividers', 'From O lay off a line equal and parallel to the radius of curvature, in the sense C to P: its end is a point of the radial.', () => {
        k.seg(O, Rp, { cls: 'thick' });
        k.dot(Rp, { open: true, r: 2 });
        k.label(g.lerp(O, Rp, 0.45), 'R', 'e', { dist: 1.5 });
      });
      k.step('pencil', 'Do the same at other points: the radial is again an equiangular spiral about O, here drawn for the points from φ = 39° to 190° (turned and enlarged by the factor √(1 + k²)).', () => {
        k.curve(radial, [g.deg(38.7), g.deg(189.7)], { cls: 'curve', n: 400 });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 158 */
  /* The radial curves of the conics with respect to the focus-free points of the book's drawing:
     (a) the parabola (O at the vertex): x³ = −k(x² + y²) with k = 2p (the book draws the branch x < 0 for the radii taken from C to P);
     (b) the ellipse (O the centre): (a²x² + b²y²)³ = a⁴b⁴(x² + y²)², a peanut elongated along the minor axis;
     (c) the hyperbola (O the centre): the same with b² negative; the asymptotes are shared. */
  const textEq = (k, x, y, tx, o) => k.text(x, y, tx, Object.assign({ upright: true, size: 0.8, anchor: 'middle' }, o || {}));

  Curves.figure({
    id: 'fig-158a',
    section: 'radial',
    page: 173,
    title: 'The radial of the parabola',
    tags: ['radial', 'parabola', 'conic'],
    note: 'The radial is x³ = −k(x² + y²) with k = 2p for the radii taken from C to P, and x³ = +k(x² + y²) for the opposite sense; the book draws the first branch.',
    build(k) {
      const g = k.g, p = 11;
      const f = s => [s * s / (4 * p), s];
      const O = k.pt(0, 0);
      const radial = s => { const L2 = 1 + s * s / (4 * p * p); return [-2 * p * L2, s * L2]; };
      const T = solveT(155);
      function solveT(y) { let lo = 0, hi = 200; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (radial(m)[1] < y) lo = m; else hi = m; } return (lo + hi) / 2; }
      k.given('The parabola (thin) with its vertex O and axes.', () => {
        k.seg(k.pt(-93, 0), k.pt(155, 0), { cls: 'given' });
        k.seg(k.pt(0, -78), k.pt(0, 62), { cls: 'given' });
        k.curve(f, [-84, 84], { cls: 'given', n: 160 });
        k.pivot(O);
      });
      k.step('pencil', 'At each point P of the parabola draw from O the line equal and parallel to the radius of curvature, in the sense C to P. Its end points form the radial: a curve with its vertex at distance 2p from O on the side away from the parabola, and two branches that run out to infinity.', () => {
        k.curve(radial, [-T, T], { n: 240 });
      });
      k.note('The equation of the radial is printed under the drawing.', () => {
        textEq(k, 20, -135, 'x^3 = ± k (x^2 + y^2)');
      });
    }
  });

  Curves.figure({
    id: 'fig-158b',
    section: 'radial',
    page: 173,
    title: 'The radial of the ellipse',
    tags: ['radial', 'ellipse', 'conic'],
    build(k) {
      const a = 125, b = 91.5;
      const f = s => [a * Math.cos(s), b * Math.sin(s)];
      const O = k.pt(0, 0);
      const radial = s => { const D2 = b * b * Math.cos(s) * Math.cos(s) + a * a * Math.sin(s) * Math.sin(s); return [D2 * Math.cos(s) / a, D2 * Math.sin(s) / b]; };
      k.given('The ellipse (thin) with its centre O and its axes.', () => {
        k.seg(k.pt(-148, 0), k.pt(144, 0), { cls: 'given' });
        k.seg(k.pt(0, -182), k.pt(0, 176), { cls: 'given' });
        k.ellipse(O, a, b, { cls: 'given' });
        k.pivot(O);
      });
      k.step('pencil', 'At each point of the ellipse draw from O the line equal and parallel to the radius of curvature (outwards, since the centre of curvature lies inside). Their end points form the radial: a peanut-shaped curve. Its half-width on the major axis is b²/a (the radius of curvature at a vertex) and its half-length on the minor axis is a²/b.', () => {
        k.curve(radial, [0, 2 * Math.PI], { n: 360 });
      });
      k.note('The equation of the radial is printed under the drawing.', () => {
        textEq(k, 0, -215, '(a^2 x^2 + b^2 y^2)^3 = a^4 b^4 (x^2 + y^2)^2');
        textEq(k, 0, -240, 'Ellipse: b^2 > 0');
      });
    }
  });

  Curves.figure({
    id: 'fig-158c',
    section: 'radial',
    page: 173,
    title: 'The radial of the hyperbola',
    tags: ['radial', 'hyperbola', 'conic', 'asymptote'],
    note: 'The dashed lines are the asymptotes of the hyperbola; the arms of the radial run out along the perpendicular directions. The equation is the ellipse\'s with b² negative.',
    build(k) {
      const g = k.g, a = 98, b = 45;
      const f = u => [a * Math.cosh(u), b * Math.sinh(u)];
      const O = k.pt(0, 0);
      const D2 = u => b * b * Math.cosh(u) * Math.cosh(u) + a * a * Math.sinh(u) * Math.sinh(u);
      const radial = u => [-D2(u) * Math.cosh(u) / a, D2(u) * Math.sinh(u) / b];      // the radial of the right branch lies on the left
      let lo = 0, hi = 3; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (radial(m)[1] < 162) lo = m; else hi = m; }
      const uR = (lo + hi) / 2;
      const u1 = Math.acosh(203 / a);
      const mir = fn => u => { const q = fn(u); return [-q[0], q[1]]; };
      k.given('The hyperbola (thin) with its centre O, its axes and its asymptotes (dashed).', () => {
        k.seg(k.pt(-195, 0), k.pt(198, 0), { cls: 'given' });
        k.seg(k.pt(0, -95), k.pt(0, 90), { cls: 'given' });
        k.seg(k.pt(-200, -200 * b / a), k.pt(200, 200 * b / a), { cls: 'cons', dash: true });
        k.seg(k.pt(-200, 200 * b / a), k.pt(200, -200 * b / a), { cls: 'cons', dash: true });
        k.curve(f, [-u1, u1], { cls: 'given', n: 160 });
        k.curve(mir(f), [-u1, u1], { cls: 'given', n: 160 });
        k.pivot(O);
      });
      k.step('pencil', 'At each point of each branch draw from O the line equal and parallel to the radius of curvature, in the sense C to P. The radial of the right branch lies to the left of O and the radial of the left branch to the right: two curves that cross the axis at b²/a on either side of O, with arms that run out along the lines through O perpendicular to the asymptotes of the hyperbola.', () => {
        k.curve(radial, [-uR, uR], { n: 240 });
        k.curve(mir(radial), [-uR, uR], { n: 240 });
      });
      k.note('The equation is that of the ellipse\'s radial with b² < 0.', () => {
        textEq(k, 0, -135, '(a^2 x^2 + b^2 y^2)^3 = a^4 b^4 (x^2 + y^2)^2');
        textEq(k, 0, -157, 'Hyperbola: b^2 < 0');
      });
    }
  });
})();
