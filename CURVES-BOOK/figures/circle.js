/* Curves Workshop · figures/circle.js — Figs. 18–22 (pages 22–25)
 *
 * Fig. 18  (a) the secant property, (b) the radical axis by a third circle
 * Fig. 19  the centres of similitude I and E of two circles
 * Fig. 20  the problem of Apollonius: a circle tangent to three circles
 * Fig. 21  trains of circles: (a) a train that does not close, (b) a Steiner chain between concentric circles
 * Fig. 22  the arbelos with the train of Pappus
 */
(function () {
  'use strict';
  const PI = Math.PI;

  /* a circle as a polygon, for k.hatch */
  function disc(g, c, r, n) { const p = []; for (let i = 0; i < (n || 96); i++) p.push(g.polar(c, r, 2 * PI * i / (n || 96))); return p; }
  /* the smaller of the two angles AVB */
  function ang(k, V, A, B, o) { return k.g.angle(A, V, B) >= 0 ? k.angle(V, A, B, o) : k.angle(V, B, A, o); }
  /* the circle (x, y, r) with |PC_i| = |r + s_i r_i| for the three given [x, y, s_i r_i]: the circles tangent to all three.
     s_i = +1: the new circle is outside circle i, s_i = −1: it is inside it (or contains it). Returns every solution with r > 0. */
  function tangents(c1, c2, c3) {
    const eq = c => [c[0] - c1[0], c[1] - c1[1], c[2] - c1[2], 0.5 * ((c[0] * c[0] + c[1] * c[1] - c[2] * c[2]) - (c1[0] * c1[0] + c1[1] * c1[1] - c1[2] * c1[2]))];
    const rows = [eq(c2), eq(c3)];
    let best = -1, f = 2;
    for (let j = 0; j < 3; j++) {
      const cs = [0, 1, 2].filter(x => x !== j);
      const det = rows[0][cs[0]] * rows[1][cs[1]] - rows[0][cs[1]] * rows[1][cs[0]];
      if (Math.abs(det) > best) { best = Math.abs(det); f = j; }
    }
    const cs = [0, 1, 2].filter(x => x !== f);
    const a = rows[0][cs[0]], b = rows[0][cs[1]], c = rows[1][cs[0]], d = rows[1][cs[1]], det = a * d - b * c;
    const e0 = rows[0][3], e1 = rows[1][3], g0 = rows[0][f], g1 = rows[1][f];
    const base = [0, 0, 0], w = [0, 0, 0];
    base[cs[0]] = (d * e0 - b * e1) / det; w[cs[0]] = (-d * g0 + b * g1) / det;
    base[cs[1]] = (a * e1 - c * e0) / det; w[cs[1]] = (-a * g1 + c * g0) / det;
    w[f] = 1;
    const U = [base[0] - c1[0], base[1] - c1[1], base[2] + c1[2]];
    const A = w[0] * w[0] + w[1] * w[1] - w[2] * w[2], B = U[0] * w[0] + U[1] * w[1] - U[2] * w[2], Cc = U[0] * U[0] + U[1] * U[1] - U[2] * U[2];
    let ts = [];
    if (Math.abs(A) < 1e-12) ts = [-Cc / (2 * B)];
    else { const D = B * B - A * Cc; if (D >= 0) { const s = Math.sqrt(D); ts = [(-B + s) / A, (-B - s) / A]; } }
    return ts.map(t => ({ x: base[0] + w[0] * t, y: base[1] + w[1] * t, r: base[2] + w[2] * t })).filter(q => q.r > 1e-9);
  }

  /* ================================================================== Fig. 18 */
  Curves.figure({
    id: 'fig-018a',
    section: 'circle',
    page: 22,
    title: 'The secant property of a circle',
    tags: ['circle', 'power of a point', 'secants'],
    build(k) {
      const g = k.g, R = 150;
      const O = k.pt(0, 0);
      const A = g.polar(O, R, g.deg(70)), B = g.polar(O, R, g.deg(172.5)), C = g.polar(O, R, g.deg(245)), D = g.polar(O, R, g.deg(40));
      const P = g.lineLine(A, B, D, C);
      k.given('A circle with centre O and a point P outside it.', () => {
        k.circle(O, R, { cls: 'given' });
        k.dot(O, { open: true, r: 0.9 });
        k.dot(P, { open: true, r: 1 }); k.label(P, 'P', 'se', { dist: 1.1, upright: true });
      });
      k.step('straightedge', 'Through P draw any two lines cutting the circle: one at A and B (A nearer to P), the other at D and C (D nearer to P).', () => {
        k.seg(P, B, { cls: 'given' });
        k.seg(P, C, { cls: 'given' });
        [['A', A, 'nw'], ['B', B, 'w'], ['C', C, 'sw'], ['D', D, 'e']].forEach(([n, p, at]) => { k.dot(p, { open: true, r: 1 }); k.label(p, n, at, { dist: 1.1, upright: true }); });
      });
      k.step('straightedge', 'Join A to D and B to C.', () => {
        k.seg(A, D, { cls: 'given' });
        k.seg(B, C, { cls: 'given' });
      });
      k.note('The angle PAD is equal to the angle BCD (the exterior angle of the cyclic quadrilateral ABCD equals the interior angle opposite). So the triangles PAD and PCB are similar and PA : PC = PD : PB, that is PA · PB = PD · PC.', () => {
        ang(k, A, P, D, { r: 1.5 });
        ang(k, C, B, D, { r: 1.5 });
      });
    }
  });

  Curves.figure({
    id: 'fig-018b',
    section: 'circle',
    page: 22,
    title: 'The radical axis of two circles by a third circle',
    tags: ['circle', 'radical axis', 'radical centre'],
    note: 'The book draws only the two common chords meeting at the radical centre; the dashed line, the radical axis itself, is added as the last note.',
    build(k) {
      const g = k.g;
      const O1 = k.pt(922, -290), r1 = 145, O2 = k.pt(1242, -397), r2 = 100;
      const O3 = g.circumcenter(k.pt(860, -422), k.pt(1068, -285), k.pt(1233, -493)), r3 = g.dist(O3, k.pt(860, -422));
      const X = g.circleCircle(O3, r3, O1, r1), Y = g.circleCircle(O3, r3, O2, r2);
      const R = g.lineLine(X[0], X[1], Y[0], Y[1]);
      const ext = (p, from, d) => g.add(p, g.mul(g.unit(g.sub(p, from)), d));
      const end1 = g.angleOf(g.sub(k.pt(1180, -612), O3)), end0 = g.angleOf(g.sub(k.pt(920, -622), O3));
      k.given('Two circles that do not meet. The radical axis is the line of the points of equal power with respect to both.', () => {
        k.circle(O1, r1, { cls: 'given' });
        k.circle(O2, r2, { cls: 'given' });
      });
      k.step('compass', 'Draw a third circle, arbitrary, cutting both of the given circles.', () => {
        k.arc(O3, r3, end1, end0 + 2 * PI, { cls: 'given' });
        X.concat(Y).forEach(p => k.dot(p, { open: true, r: 1 }));
      });
      k.step('straightedge', 'Draw the common chord of the third circle and each of the given circles (each is the radical axis of that pair). The two chords meet at R, the radical centre of the three circles.', () => {
        [[X, 50, 28], [Y, 38, 33]].forEach(([pq, e0, e1]) => {          // the chord, from beyond its far end to beyond R
          const near = g.dist(pq[0], R) < g.dist(pq[1], R) ? pq[0] : pq[1], far = near === pq[0] ? pq[1] : pq[0];
          k.seg(ext(far, near, e0), ext(R, near, e1), { cls: 'given' });
        });
        k.dot(R, { open: true, r: 1 }); k.label(R, 'R', 'ne', { dist: 1.2, upright: true });
      });
      k.note('R has equal power with respect to all three circles, so it is on the radical axis of the first two: the line through R perpendicular to the line of the centres (dashed).', () => {
        const u = g.unit(g.sub(O2, O1)), nrm = g.perp(u);
        k.seg(g.add(R, g.mul(nrm, 330)), g.sub(R, g.mul(nrm, 330)), { cls: 'cons', dash: true, nobounds: true });
        k.seg(O1, O2, { cls: 'aux', dotted: true });
      });
    }
  });

  /* ================================================================== Fig. 19 */
  Curves.figure({
    id: 'fig-019',
    section: 'circle',
    page: 23,
    title: 'The centres of similitude of two circles',
    tags: ['circle', 'similitude'],
    note: 'I is the internal and E the external centre of similitude; I, E and the two centres are on one line (not drawn in the book).',
    build(k) {
      const g = k.g;
      const O1 = k.pt(0, 0), r1 = 271, O2 = k.pt(512, 0), r2 = 93;
      const u = g.dir(g.deg(38));
      const U = g.add(O1, g.mul(u, r1)), L = g.sub(O1, g.mul(u, r1)), U2 = g.add(O2, g.mul(u, r2)), L2 = g.sub(O2, g.mul(u, r2));
      const E = g.lineLine(U, U2, L, L2), I = g.lineLine(U, L2, L, U2);
      k.given('Two circles with centres O1 and O2.', () => {
        k.circle(O1, r1, { cls: 'given' });
        k.circle(O2, r2, { cls: 'given' });
        k.dot(O1, { open: true, r: 0.9 }); k.dot(O2, { open: true, r: 0.9 });
      });
      k.step('straightedge', 'Draw a diameter of the large circle; its ends are U and L.', () => {
        k.seg(L, U, { cls: 'given' });
        k.dot(U, { open: true, r: 0.9 }); k.dot(L, { open: true, r: 0.9 });
      });
      k.step('square', 'Through O2 draw the diameter of the small circle parallel to it; its ends are U′ (on the same side as U) and L′.', () => {
        k.seg(L2, U2, { cls: 'given' });
        k.dot(U2, { open: true, r: 0.9 }); k.dot(L2, { open: true, r: 0.9 });
      });
      k.step('straightedge', 'Join the ends of the parallel diameters that point the same way: UU′ and LL′. They meet at E, the external centre of similitude.', () => {
        k.seg(U, E, { cls: 'given' });
        k.seg(L, E, { cls: 'given' });
        k.dot(E, { open: true, r: 0.9 }); k.label(E, 'E', 'n', { dist: 1.3, upright: true });
      });
      k.step('straightedge', 'Join the ends that point opposite ways: UL′ and LU′. They meet at I, the internal centre of similitude. The four points O1, I, O2, E lie on one line.', () => {
        k.seg(U, L2, { cls: 'given' });
        k.seg(L, U2, { cls: 'given' });
        k.dot(I, { open: true, r: 0.9 }); k.label(I, 'I', 'n', { dist: 1.3, upright: true });
      });
    }
  });

  /* ================================================================== Fig. 20 */
  Curves.figure({
    id: 'fig-020',
    section: 'circle',
    page: 23,
    title: 'The problem of Apollonius: a circle tangent to three circles',
    tags: ['circle', 'Apollonius', 'tangent'],
    note: 'One of the (generally) eight circles tangent to the three given ones: the one touching all three from outside.',
    build(k) {
      const g = k.g;
      const C = [[203, -242, 146], [733, -386, 108], [290, -758, 208]];
      const sol = tangents([C[0][0], C[0][1], C[0][2]], [C[1][0], C[1][1], C[1][2]], [C[2][0], C[2][1], C[2][2]]).sort((p, q) => p.r - q.r)[0];
      const X = k.pt(sol.x, sol.y);
      const P = C.map(c => k.pt(c[0], c[1]));
      const rho = C[1][2];                              // the smallest radius is shrunk to a point
      k.given('Three given circles, no two of them touching and with no common circle of their pencil.', () => {
        C.forEach(c => k.circle(k.pt(c[0], c[1]), c[2], { cls: 'given' }));
        P.forEach((p, i) => { k.dot(p, { r: 0.6 }); k.label(p, 'C_' + (i + 1), 'ne', { dist: 0.9, size: 0.85 }); });
      });
      k.step('compass', 'Shrink the smallest circle to a point: about the other two centres draw the circles of radii r1 − ρ and r3 − ρ (ρ = the radius of the smallest circle). A circle touching all three given circles from outside becomes, with its radius lessened by ρ, a circle through the centre of the smallest one that touches these two reduced circles.', () => {
        k.circle(P[0], C[0][2] - rho, { cls: 'cons', dash: true });
        k.circle(P[2], C[2][2] - rho, { cls: 'cons', dash: true });
      });
      k.step('compass', 'Find that circle: inversion about the centre of the smallest circle turns it into a common tangent of two circles (see Inversion); inverting back gives the circle through the three points. Its centre is X, and the radius we need is XC2 − ρ.', () => {
        k.circle(X, g.dist(X, P[1]), { cls: 'aux', dash: true, nobounds: true });
        k.dot(X, { r: 0.7 });
      });
      k.step('compass', 'Draw the circle about X of radius XC2 − ρ: it touches the three given circles.', () => {
        k.circle(X, sol.r, { cls: 'given' });
      });
      k.note('The solution circle is shaded. The three signs of the tangency (outside or inside each given circle) give the eight solutions.', () => {
        k.hatch(disc(g, X, sol.r, 120), { angle: -g.deg(32), gap: 1.1 });
      });
    }
  });

  /* ================================================================== Fig. 21 */
  /* (b) the Steiner chain between two concentric circles; (a) a train between two circles that are not concentric. */
  Curves.figure({
    id: 'fig-021a',
    section: 'circle',
    page: 24,
    title: 'A train of circles between two circles that do not meet',
    tags: ['circle', 'train', 'Steiner chain'],
    note: 'A train generally does not close: this one stops in the narrow gap on the right.',
    build(k) {
      const g = k.g;
      const R = 300, ci = k.pt(100, 0), ri = 137.5;
      const first = { x: (-R + (ci.x - ri)) / 2, y: 0, r: (-R - (ci.x - ri)) / -2 };
      const up = [];
      let prev = first, prev2 = null;
      for (let i = 0; i < 4; i++) {
        const sols = tangents([0, 0, -R], [ci.x, ci.y, ri], [prev.x, prev.y, prev.r]);
        let pick = prev2 ? sols.filter(s => g.dist(k.pt(s.x, s.y), k.pt(prev2.x, prev2.y)) > 1e-6) : sols.filter(s => s.y > 0);
        const s = pick[0]; up.push(s); prev2 = prev; prev = s;
      }
      const all = [first].concat(up).concat(up.map(s => ({ x: s.x, y: -s.y, r: s.r })));
      const H = { angle: 0, gap: 0.9 };
      k.given('Two circles, one inside the other, not concentric.', () => {
        k.circle(k.pt(0, 0), R, { cls: 'given' });
        k.circle(ci, ri, { cls: 'given' });
      });
      k.step('compass', 'Start where the gap between the circles is widest: the circle that touches both on the axis, with its diameter the width of the gap.', () => {
        k.circle(k.pt(first.x, first.y), first.r, { cls: 'given' });
      });
      k.step('compass', 'Each next circle touches the two given circles and the one before it; going round above the axis the circles grow smaller as the gap narrows.', () => {
        up.forEach(s => k.circle(k.pt(s.x, s.y), s.r, { cls: 'given' }));
      });
      k.step('compass', 'The same below the axis (the figure is symmetrical). The train does not close: a gap is left in the narrow part on the right.', () => {
        up.forEach(s => k.circle(k.pt(s.x, -s.y), s.r, { cls: 'given' }));
      });
      k.note('The circles of the train are shaded with horizontal lines.', () => {
        all.forEach(s => k.hatch(disc(g, k.pt(s.x, s.y), s.r, 90), H));
      });
    }
  });

  Curves.figure({
    id: 'fig-021b',
    section: 'circle',
    page: 24,
    title: 'A Steiner chain between two concentric circles',
    tags: ['circle', 'train', 'Steiner chain'],
    build(k) {
      const g = k.g;
      const n = 8, R = 300, s = Math.sin(PI / n);
      const r = R * (1 - s) / (1 + s), rho = (R - r) / 2, d = (R + r) / 2;
      const O = k.pt(0, 0);
      const cs = []; for (let i = 0; i < n; i++) cs.push(g.polar(O, d, 2 * PI * i / n));
      k.given('Two concentric circles of radii R and r, with sin(π/8) = (R − r) / (R + r).', () => {
        k.circle(O, R, { cls: 'given' });
        k.circle(O, r, { cls: 'given' });
      });
      k.step('compass', 'The circle that touches both: its diameter is the width R − r of the ring, its centre is at (R + r)/2 from O.', () => {
        k.circle(cs[0], rho, { cls: 'given' });
      });
      k.step('dividers', 'Step the centre round the ring: each circle subtends the angle 2·asin((R − r)/(R + r)) = 45° at O, so eight circles close the chain after one turn about the centre.', () => {
        cs.slice(1).forEach(c => k.circle(c, rho, { cls: 'given' }));
      });
      k.note('The circles of the chain are shaded with horizontal lines.', () => {
        cs.forEach(c => k.hatch(disc(g, c, rho, 90), { angle: 0, gap: 0.9 }));
      });
    }
  });

  /* ================================================================== Fig. 22 */
  Curves.figure({
    id: 'fig-022',
    section: 'circle',
    page: 25,
    title: 'The arbelos and the train of Pappus',
    tags: ['circle', 'arbelos', 'Pappus'],
    build(k) {
      const g = k.g;
      const A = k.pt(0, 0), B = k.pt(270, 0), Cp = k.pt(400, 0);
      const MA = k.pt(135, 0), MB = k.pt(335, 0), MC = k.pt(200, 0);
      const rAB = 135, rBC = 65, rAC = 200;
      const Z = k.pt(270, Math.sqrt(rAC * rAC - 70 * 70));
      /* the train of Pappus c0 (the circle on BC), c1, c2 ... tangent to the circles on AB and AC: invert about A, where
         the circles on AB and AC become the parallel lines x = 1/AB and x = 1/AC and the train becomes a stack of equal circles */
      const w = 1 / 270 - 1 / 400, rr = w / 2, xc = (1 / 270 + 1 / 400) / 2;
      const chain = [];
      for (let m = 1; m <= 6; m++) {
        const cx = xc, cy = 2 * rr * m, den = cx * cx + cy * cy - rr * rr;
        chain.push({ c: k.pt(cx / den, cy / den), r: rr / den, n: m });
      }
      const H = { angle: g.deg(28), gap: 0.7 };
      const half = (c, r) => { const p = []; for (let i = 0; i <= 60; i++) p.push(g.polar(c, r, PI * i / 60)); return p; };
      k.given('Three collinear points A, B, C. The arbelos is the figure bounded by the three semicircles on AB, BC and AC.', () => {
        k.seg(A, Cp, { cls: 'given' });
        k.label(A, 'A', 'ne', { dist: 1.2, upright: true }); k.label(B, 'B', 'nw', { dist: 1.2, upright: true }); k.label(Cp, 'C', 'sw', { dist: 1.2, upright: true });
      });
      k.step('compass', 'Describe the semicircles on AB, BC and AC as diameters, all on the same side of the line.', () => {
        k.arc(MC, rAC, 0, PI, { cls: 'given' });
        k.arc(MA, rAB, 0, PI, { cls: 'given' });
        k.arc(MB, rBC, 0, PI, { cls: 'given' });
        k.label(k.pt(MA.x, rAB), 'X', 's', { dist: 1.8, upright: true });
        k.label(k.pt(MB.x, rBC), 'Y', 'ne', { dist: 1.7, upright: true });
      });
      k.step('square', 'At B raise the perpendicular to AC; it meets the large semicircle at Z. The area of the arbelos equals the area of the circle on BZ as diameter.', () => {
        k.seg(B, Z, { cls: 'given' });
        k.label(Z, 'Z', 'ne', { dist: 1.1, upright: true });
      });
      k.step('compass', 'The train of Pappus: c0 is the circle on BC, and each next circle touches the circles on AB and AC and the one before it. The centre of the n-th circle is at the height 2n times its radius above AC, h_n = 2n·r_n. Draw c1, c2 … towards A.', () => {
        chain.forEach(c => k.circle(c.c, c.r, { cls: 'given' }));
      });
      k.note('The half-disc on BC and the circles of the train are shaded.', () => {
        k.hatch(half(MB, rBC), Object.assign({ outline: false }, H));
        chain.forEach(c => k.hatch(disc(g, c.c, c.r, 72), H));
      });
    }
  });
})();
