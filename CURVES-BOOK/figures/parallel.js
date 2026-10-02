/* Curves Workshop · figures/parallel.js — Figs. 147 (page 155), 148 (156), 149 a–f (157), 150 (158)
 *
 * Fig. 149 has six panels on the page (ellipse, parabola, hyperbola, y² = x³, lemniscate, astroid), not the eight the
 * manifest counts. Lettered left to right, top to bottom: a ellipse, b parabola, c hyperbola, d y² = x³, e lemniscate,
 * f astroid. Everything is wrapped in a function so that its helpers stay out of the global scope. */
(function () {
  'use strict';

  /* a root of f(t) = target between lo and hi, by bisection (f monotone there) */
  function solve(f, target, lo, hi) {
    let a = lo, b = hi; const fa = f(a) - target;
    for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if ((f(m) - target) * fa > 0) a = m; else b = m; }
    return (a + b) / 2;
  }

  /* ------------------------------------------------------------------ Fig. 147 */
  /* The definition: a curve with a point P; on the normal at P the points Q and Q', k units from P on either side.
     The book draws a gentle arc; here it is an arc of a circle of large radius, so the normal is exact. Units: pixels of
     the 2x close-up of the scan (only proportions matter). */
  Curves.figure({
    id: 'fig-147',
    section: 'parallel',
    page: 155,
    title: 'Definition of a parallel curve: the points Q and Q\' at distance k on the normal',
    tags: ['parallel curve', 'normal', 'definition'],
    note: 'The book draws a freehand arc; the curve here is an arc of a circle of large radius.',
    build(k) {
      const g = k.g, R = 2500;
      const P = k.pt(515, -280), Q = k.pt(915, -163);
      const u = g.unit(g.sub(Q, P));
      const Qp = g.sub(P, g.mul(u, g.dist(P, Q)));
      const C = g.sub(P, g.mul(u, R));                          // the centre of the circle that carries the arc
      k.given('A curve and a point P of it.', () => {
        k.arc(C, R, g.deg(8.6), g.deg(22.4), { cls: 'thick' });
        k.point(P, 'P', { at: 'ne', open: true, r: 1.5 });
      });
      k.step('straightedge', 'Draw the normal to the curve at P: the line through P perpendicular to the tangent.', () => {
        k.seg(Qp, Q, { cls: 'given' });
      });
      k.step('dividers', 'Lay off the distance k along the normal from P, once on each side: this gives Q and Q\'.', () => {
        k.point(Q, 'Q', { at: 'n', open: true, r: 1.5 });
        k.point(Qp, 'Q\'', { at: 'nw', open: true, r: 1.5 });
      });
      k.note('Do this at every point P of the curve: Q and Q\' run along the two branches of the curve parallel to the given one (the distances are k and −k).', () => {
        k.dim(P, Q, 'k', { dist: 1.3 });
        k.dim(Qp, P, '−k', { dist: 1.3 });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 148 */
  /* The same drawing as Fig. 134(a): an evolute (an equiangular spiral arc fitted to the printed curve), eleven of its
     tangents, and three involutes at constant distances from one another along every tangent. */
  Curves.figure({
    id: 'fig-148',
    section: 'parallel',
    page: 156,
    title: 'All involutes of a curve are parallel curves',
    tags: ['parallel curve', 'involute', 'evolute', 'string'],
    note: 'The evolute is drawn as a piece of an equiangular spiral, which the book\'s arc closely matches.',
    build(k) {
      const g = k.g;
      const pole = k.pt(596.7, -869.9), rL = 559.3, thL = g.deg(173.5), kk = 0.561;
      const E = u => { const th = thL - u, r = rL * Math.exp(-kk * u); return [pole.x + r * Math.cos(th), pole.y + r * Math.sin(th)]; };
      const u0 = 0.283, du = 0.1652, N = 11;
      const uj = Array.from({ length: N }, (_, j) => u0 + j * du);
      const uK = uj[N - 1];
      const arc = (a, b) => g.arcLength(E, a, b, 300);
      const extra = [0, 210, 319];
      const onNormal = (j, add) => { const p = E(uj[j]), T = g.frenet(E, uj[j]).T, len = arc(uj[j], uK) + add; return k.pt(p[0] + T.x * len, p[1] + T.y * len); };
      const involute = add => u => { const p = E(u), T = g.frenet(E, u).T, len = arc(u, uK) + add; return [p[0] + T.x * len, p[1] + T.y * len]; };

      k.given('The evolute: any curve, drawn heavy. Its tangents are the common normals of all its involutes.', () => {
        k.curve(E, [0, uK + 0.62], { cls: 'thick', n: 240 });
        k.text(370, -632, 'evolute', { size: 0.9 });
      });
      k.step('straightedge', 'Draw the tangents to the evolute at a series of points. A tangent is a position of the stretched string, and the normal of every involute.', () => {
        for (let j = 0; j < N; j++) k.seg(k.pt(...E(uj[j])), onNormal(j, extra[2]), { cls: 'cons' });
      });
      k.step('dividers', 'Choose the end K of the string on the evolute. On each tangent lay off from the point of tangency the arc of the evolute up to K (rectified with the dividers). The points are on the first involute.', () => {
        for (let j = 0; j < N; j++) k.dot(onNormal(j, 0), { open: true, r: 1.1 });
      });
      k.step('dividers', 'Lengthen the string by a fixed length and lay the same extra length along every tangent: the second involute.', () => {
        for (let j = 0; j < N; j++) k.dot(onNormal(j, extra[1]), { open: true, r: 1.1 });
      });
      k.step('dividers', 'A further fixed length gives the third involute.', () => {
        for (let j = 0; j < N; j++) k.dot(onNormal(j, extra[2]), { open: true, r: 1.1 });
      });
      k.step('pencil', 'Draw the involutes through their points. On each common normal they are the same distance apart, so they are parallel curves, and the evolute is common to all of them.', () => {
        const a = uj[0] - 0.45 * du, b = uj[N - 1] + 0.45 * du;
        k.curve(involute(extra[0]), [a, uK], { n: 200 });
        k.curve(involute(extra[1]), [a, b], { n: 200 });
        k.curve(involute(extra[2]), [a, b], { n: 200 });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 149 */
  /* Common steps of the six panels of Fig. 149: the given curve is thin, the parallel curves heavy. A parallel curve is
     found pointwise: the normal at a series of points, k laid off along it. */
  function parallelSteps(k, o) {
    // o: f(t) -> [x, y]; n(t) -> unit normal; ts: sample parameters; kOut, kIn: distances on the +n and -n sides
    const at = (t, s) => { const p = o.f(t), nn = o.n(t); return k.pt(p[0] + s * nn[0], p[1] + s * nn[1]); };
    k.step('dividers', o.textMarks || 'At a series of points of the curve take the normal (the faint lines) and lay off the distance k along it on each side of the curve.', () => {
      o.ts.forEach(t => {
        k.seg(at(t, -o.kIn), at(t, o.kOut), { cls: 'aux', opacity: 0.7 });
        k.dot(at(t, o.kOut), { open: true, r: 0.7 }); k.dot(at(t, -o.kIn), { open: true, r: 0.7 });
      });
    });
  }

  const range = (t0, t1, n) => Array.from({ length: n }, (_, i) => t0 + (t1 - t0) * (i + 0.5) / n);

  /* (a) the ellipse: thin ellipse a = 160, b = 120; the outer branch at k = 101.5, the inner branch at k = 158, where it has
     become an hourglass with four cusps. The book draws the two branches for different distances. */
  Curves.figure({
    id: 'fig-149a',
    section: 'parallel',
    page: 157,
    title: 'Curves parallel to the ellipse',
    tags: ['parallel curve', 'ellipse', 'cusp'],
    note: 'The book draws the outer and the inner branch at different distances k (about 0.63a and 0.99a); the same is done here.',
    build(k) {
      const a = 160, b = 120, kOut = 101.5, kIn = 158;
      const f = t => [a * Math.cos(t), b * Math.sin(t)];
      const n = t => { const d = Math.hypot(b * Math.cos(t), a * Math.sin(t)); return [b * Math.cos(t) / d, a * Math.sin(t) / d]; };   // outward unit normal
      const off = (s) => t => { const p = f(t), nn = n(t); return [p[0] + s * nn[0], p[1] + s * nn[1]]; };
      k.given('The ellipse (thin) with its major axis.', () => {
        k.seg(k.pt(-270, 0), k.pt(264, 0), { cls: 'given' });
        k.ellipse(k.pt(0, 0), a, b, { cls: 'given' });
        k.text(7, 131, 'ELLIPSE', { size: 0.5, upright: true });
      });
      parallelSteps(k, { f, n, ts: range(0, 2 * Math.PI, 16), kOut, kIn,
        textMarks: 'At a series of points of the ellipse take the normal (the faint lines) and lay off k along it outwards (outer branch) and, with a longer k, inwards (inner branch).' });
      k.step('pencil', 'Draw the two parallel curves through the points: the outer one is an oval, the inner one has four cusps, where k is the radius of curvature of the ellipse.', () => {
        k.curve(off(kOut), [0, 2 * Math.PI], { n: 360 });
        k.curve(off(-kIn), [0, 2 * Math.PI], { n: 360 });
      });
    }
  });

  /* (b) the parabola: p = 53 (focal length), vertex at the origin, opening to the right; outer branch k = 151, inner k = 232
     (a swallowtail with two cusps, whose arms cross on the axis and are cut a little beyond that). */
  Curves.figure({
    id: 'fig-149b',
    section: 'parallel',
    page: 157,
    title: 'Curves parallel to the parabola',
    tags: ['parallel curve', 'parabola', 'cusp'],
    note: 'The book draws the outer and the inner branch at different distances k; the same is done here.',
    build(k) {
      const p = 53, kOut = 151, kIn = 232;
      const f = t => [t * t / (4 * p), t];
      const n = t => { const L = Math.sqrt(1 + t * t / (4 * p * p)); return [-1 / L, t / (2 * p) / L]; };   // away from the focus
      const off = s => t => { const q = f(t), nn = n(t); return [q[0] + s * nn[0], q[1] + s * nn[1]]; };
      const tHi = solve(t => off(kOut)(t)[1], 226, 0, 400), tLo = solve(t => off(kOut)(t)[1], -196, -400, 0);
      const tE = solve(t => off(-kIn)(t)[0], 329, 150, 400);
      k.given('The parabola (thin) with its axis.', () => {
        k.seg(k.pt(-163, 0), k.pt(329, 0), { cls: 'given' });
        k.curve(f, [-206, 206], { cls: 'given', n: 200 });
        k.text(112, 160, 'PARABOLA', { size: 0.5, upright: true, anchor: 'start' });
      });
      parallelSteps(k, { f, n, ts: range(tLo * 0.97, tHi * 0.97, 9), kOut, kIn });
      k.step('pencil', 'Draw the two parallel curves: the outer one (away from the focus) is smooth; the inner one has two cusps and crosses itself on the axis, because k is larger than the radius of curvature at the vertex.', () => {
        k.curve(off(kOut), [tLo, tHi], { n: 240 });
        k.curve(off(-kIn), [-tE, tE], { n: 400 });
      });
    }
  });

  /* (c) the hyperbola: a = 116, b = 45; two branches; k = 79 on both sides; the concave side gives a swallowtail. */
  Curves.figure({
    id: 'fig-149c',
    section: 'parallel',
    page: 157,
    title: 'Curves parallel to the hyperbola',
    tags: ['parallel curve', 'hyperbola', 'cusp'],
    build(k) {
      const g = k.g, a = 116, b = 45, kk = 79;
      const f = u => [a * Math.cosh(u), b * Math.sinh(u)];
      const n = u => { const d = Math.hypot(b * Math.cosh(u), a * Math.sinh(u)); return [-b * Math.cosh(u) / d, a * Math.sinh(u) / d]; };   // towards the centre
      const off = s => u => { const q = f(u), nn = n(u); return [q[0] + s * nn[0], q[1] + s * nn[1]]; };
      const mir = fn => u => { const q = fn(u); return [-q[0], q[1]]; };
      const u1 = Math.acosh(281 / a);
      const uC = solve(u => off(kk)(u)[1], 180, 0, 3);
      const uE = solve(u => off(-kk)(u)[0], 273, 0.5, 3);
      const sample = range(-1.3, 1.3, 7);
      k.given('The two branches of the hyperbola (thin).', () => {
        k.curve(f, [-u1, u1], { cls: 'given', n: 160 });
        k.curve(mir(f), [-u1, u1], { cls: 'given', n: 160 });
        k.text(150, 70, 'HYPERBOLA', { size: 0.5, upright: true, anchor: 'start' });
      });
      k.step('dividers', 'At a series of points of each branch take the normal (the faint lines) and lay off k along it towards the centre and away from it.', () => {
        sample.forEach(u => [1, -1].forEach(sg => {
          const p = f(u), nn = n(u), P0 = k.pt(sg * p[0], p[1]), Nn = k.pt(sg * nn[0], nn[1]);
          k.seg(g.sub(P0, g.mul(Nn, kk)), g.add(P0, g.mul(Nn, kk)), { cls: 'aux', opacity: 0.7 });
          k.dot(g.add(P0, g.mul(Nn, kk)), { open: true, r: 0.7 });
          k.dot(g.sub(P0, g.mul(Nn, kk)), { open: true, r: 0.7 });
        }));
      });
      k.step('pencil', 'Draw the parallel curves: on the convex side each branch gives a hyperbola-like curve; on the concave side k is larger than the radius of curvature at the vertex, so there are two cusps and the arms cross.', () => {
        k.curve(off(kk), [-uC, uC], { n: 200 });
        k.curve(mir(off(kk)), [-uC, uC], { n: 200 });
        k.curve(off(-kk), [-uE, uE], { n: 300 });
        k.curve(mir(off(-kk)), [-uE, uE], { n: 300 });
      });
    }
  });

  /* (d) the semicubical parabola y² = x³, scale 235, with its cusp at the origin; k = 110 on both sides. */
  Curves.figure({
    id: 'fig-149d',
    section: 'parallel',
    page: 157,
    title: 'Curves parallel to the semicubical parabola y² = x³',
    tags: ['parallel curve', 'semicubical parabola', 'cusp'],
    note: 'The curve is shown only in a frame about as high as the book\'s panel.',
    build(k) {
      const L = 235, kk = 110, ymax = 240;
      const f = t => [L * t * t, L * t * t * t];
      const n = t => { const d = Math.sqrt(4 + 9 * t * t); return [-3 * t / d, 2 / d]; };      // the analytic normal: no flip at the cusp
      const off = s => t => { const q = f(t), nn = n(t); const p = [q[0] + s * nn[0], q[1] + s * nn[1]]; return Math.abs(p[1]) > ymax ? null : p; };
      k.frame(-40, -ymax - 10, 480, ymax + 10);
      k.given('The curve y² = x³ (thin) with its cusp at the origin, and the axis OX.', () => {
        k.curve(t => { const p = f(t); return Math.abs(p[1]) > ymax ? null : p; }, [-1.1, 1.1], { cls: 'given', n: 240 });
        k.arrow(k.pt(0, 0), k.pt(400, 0), { cls: 'given' });
        k.dot(k.pt(0, 0), { open: true, r: 1.2 });
        k.text(155, 128, 'y² = x³', { size: 0.55, upright: true, anchor: 'start' });
      });
      parallelSteps(k, { f, n, ts: range(-0.95, 0.95, 11), kOut: kk, kIn: kk,
        textMarks: 'At a series of points of the curve take the normal (the faint lines; at the cusp it is the vertical line) and lay off k along it on both sides.' });
      k.step('pencil', 'Draw the two parallel curves, one on each side. Each has two cusps near the cusp of the given curve, and the two curves cross on the axis.', () => {
        k.curve(off(kk), [-1.1, 1.1], { n: 400 });
        k.curve(off(-kk), [-1.1, 1.1], { n: 400 });
      });
    }
  });

  /* (e) the lemniscate r² = a² cos 2θ, a = 160; k = 82 on both sides: a big figure of eight outside, a pinched shape inside */
  Curves.figure({
    id: 'fig-149e',
    section: 'parallel',
    page: 157,
    title: 'Curves parallel to the lemniscate',
    tags: ['parallel curve', 'lemniscate', 'cusp'],
    build(k) {
      const a = 160, kk = 82;
      const f = k.curves.lemniscateParam(a);
      const n = t => { const nn = k.g.frenet(f, t).N; return [nn.x, nn.y]; };
      const off = s => t => { const q = f(t), nn = n(t); return [q[0] + s * nn[0], q[1] + s * nn[1]]; };
      k.given('The lemniscate (thin), with its node at the centre.', () => {
        k.curve(f, [0, 2 * Math.PI], { cls: 'given', n: 360 });
        k.dot(k.pt(0, 0), { open: true, r: 1.1 });
        k.text(0, 178, 'LEMNISCATE', { size: 0.5, upright: true });
      });
      parallelSteps(k, { f, n, ts: range(0, 2 * Math.PI, 24), kOut: kk, kIn: kk,
        textMarks: 'At a series of points of both loops take the normal (the faint lines) and lay off k along it on both sides.' });
      k.step('pencil', 'Draw the parallel curves: the outer branch is a large oval with a waist, the inner branch is pinched at the ends of the loops, where k is greater than the radius of curvature (a/3).', () => {
        k.curve(off(kk), [0, 2 * Math.PI], { n: 480 });
        k.curve(off(-kk), [0, 2 * Math.PI], { n: 480 });
      });
    }
  });

  /* (f) the astroid, a = 115: the outer curves (k = 200) are two crossing ovals, the inner curves (k = 60) four small cusped shapes */
  Curves.figure({
    id: 'fig-149f',
    section: 'parallel',
    page: 157,
    title: 'Curves parallel to the astroid',
    tags: ['parallel curve', 'astroid', 'cusp'],
    note: 'The book draws the two parallel curves for two different distances k (about 1.7a and 0.5a); the same is done here. The normal is continued analytically through each cusp.',
    build(k) {
      const a = 115, kOut = 200, kIn = 60;
      const f = k.curves.astroid(a);
      const n = t => [-Math.sin(t), -Math.cos(t)];
      const off = s => t => { const q = f(t), nn = n(t); return [q[0] + s * nn[0], q[1] + s * nn[1]]; };
      k.given('The astroid (thin), with its four cusps on the axes.', () => {
        k.curve(f, [0, 2 * Math.PI], { cls: 'given', n: 360 });
        k.dot(k.pt(0, 0), { open: true, r: 1.1 });
        k.text(0, 143, 'ASTROID', { size: 0.5, upright: true });
      });
      k.step('dividers', 'At a series of points take the normal (the faint lines; at a cusp it is the line through the cusp at right angles to the cusp tangent) and lay off a long distance k on both sides (outer pair of curves) and a short one (inner pair).', () => {
        range(0, 2 * Math.PI, 12).forEach(t => { const p = f(t), nn = n(t);
          k.seg(k.pt(p[0] - kOut * nn[0], p[1] - kOut * nn[1]), k.pt(p[0] + kOut * nn[0], p[1] + kOut * nn[1]), { cls: 'aux', opacity: 0.7 });
          [kOut, -kOut, kIn, -kIn].forEach(s => k.dot(k.pt(p[0] + s * nn[0], p[1] + s * nn[1]), { open: true, r: 0.6 })); });
      });
      k.step('pencil', 'Draw the parallel curves. With the long distance the two branches are ovals that cross four times; with the short one each branch has cusps, and the four little shapes lie round the cusps of the astroid.', () => {
        k.curve(off(kOut), [0, 2 * Math.PI], { n: 480 });
        k.curve(off(-kOut), [0, 2 * Math.PI], { n: 480 });
        k.curve(off(kIn), [0, 2 * Math.PI], { n: 480 });
        k.curve(off(-kIn), [0, 2 * Math.PI], { n: 480 });
      });
    }
  });

  /* ------------------------------------------------------------------ Fig. 150 */
  /* The linkage that draws curves parallel to an ellipse (page 158). Unit: OA = 280 (the book's scale is the same, 1 unit
     = 1 pixel of its 1.3x close-up). Geometry exactly as the text describes:
       - O, O' fixed, OO' = OA/2;  OA = OH, the rhombus OAB H on the sides OA and OH, B on the line OO'
       - crossed parallelograms OO'ED (OD = O'E = OA/4, DE = OO') and OO'FA (O'F = OA, FA = OO'), proportional (E is on O'F)
       - P on AB with AP = 0.42 OA: P describes the ellipse of semi-axes OA + AP and PB, centred at O
       - C = 2A on OA produced, on the perpendicular to OO' at B: the instantaneous centre of P
       - the kite CAPG (G the reflection of A in CP: AP = PG, CA = CG), the crossed parallelograms APMJ and PMNR (PM = 3 OA/4
         along PC, PR through G) make PM bisect the angle APG and so keep it on the normal of the ellipse at P
       - Q is a hole of the bar PM, at 2 OA/4 from P on the inner side: it describes the curve parallel to the ellipse. */
  Curves.figure({
    id: 'fig-150',
    section: 'parallel',
    page: 158,
    title: 'A linkage for curves parallel to the ellipse',
    tags: ['linkage', 'ellipse', 'parallel curve', 'mechanism', 'instantaneous center'],
    note: 'The book draws the mechanism and the ellipse of P (dashed); the last step adds the curve described by Q, which the text states.',
    build(k) {
      const g = k.g;
      const OA = 280, phi = g.deg(39), lam = 0.42, rho = 1.29 * OA, hole = OA / 4;
      const O = k.pt(0, 0), Op = k.pt(OA / 2, 0);
      const A = g.polar(O, OA, phi), H = k.pt(A.x, -A.y), B = g.add(A, H);
      const D = g.mul(H, 0.25);
      const E = g.circleCircle(Op, OA / 4, D, OA / 2).reduce((p, q) => (q.y > p.y ? q : p));
      const F = g.add(Op, g.mul(g.sub(E, Op), 4));
      const P = g.lerp(A, B, lam);
      const C = g.mul(A, 2);
      const G = g.reflect(A, C, P);
      const M = g.add(P, g.mul(g.unit(g.sub(C, P)), 0.75 * OA));
      const j1 = g.sub(g.add(A, M), P);
      const J = g.circleCircle(A, g.dist(P, M), M, g.dist(A, P)).reduce((p, q) => (g.dist(q, j1) > g.dist(p, j1) ? q : p));
      const R = g.add(P, g.mul(g.unit(g.sub(G, P)), rho));
      const N = g.circleCircle(R, g.dist(P, M), M, rho).reduce((p, q) => (q.y < p.y ? q : p));
      const u = g.unit(g.sub(M, P));                              // along the bar PM, towards M: the normal of the ellipse at P
      const bar0 = g.sub(P, g.mul(u, 5.35 * hole));               // the far end of the bar PM
      const Q = g.sub(P, g.mul(u, 2 * hole));
      const ea = OA * (1 + lam), eb = OA * (1 - lam);

      const joints = [];
      const W = 15;                                               // half width of a bar
      const slat = (p, q) => {
        const d = g.unit(g.sub(q, p)), nn = g.mul(g.perp(d), W * 0.62), th = g.angleOf(d);
        k.seg(g.add(p, nn), g.add(q, nn), { cls: 'given', width: 2.2 });
        k.seg(g.sub(p, nn), g.sub(q, nn), { cls: 'given', width: 2.2 });
        k.arc(p, W * 0.62, th + Math.PI / 2, th + 3 * Math.PI / 2, { cls: 'given', width: 2.2, nobounds: true });
        k.arc(q, W * 0.62, th - Math.PI / 2, th + Math.PI / 2, { cls: 'given', width: 2.2, nobounds: true });
      };
      const pin = p => { k.circle(p, 11.5, { cls: 'given', fill: '#fff', width: 2.4, nobounds: true }); k.circle(p, 6, { cls: 'given', fill: '#fff', width: 2, nobounds: true }); k.dot(p, { r: 0.4 }); };
      const addJoints = (...ps) => ps.forEach(p => joints.push(p));
      const redraw = () => joints.forEach(pin);
      const box = p => k.poly([k.pt(p.x - 30, p.y - 22), k.pt(p.x + 30, p.y - 22), k.pt(p.x + 30, p.y + 22), k.pt(p.x - 30, p.y + 22)], { close: true, cls: 'given', width: 2.2 });

      k.given('The frame: the line OO\' (the axis of the ellipse) and its perpendicular through O, with the two fixed pivots O and O\', OO\' = OA/2.', () => {
        k.seg(k.pt(-398, 0), k.pt(704, 0), { cls: 'axis', width: 2 });
        k.seg(k.pt(0, -202), k.pt(0, 213), { cls: 'axis', width: 2 });
        box(O); box(Op);
        addJoints(O, Op); redraw();
        k.label(O, 'O', 'w', { dist: 1.9 }); k.label(Op, 'O\'', 'e', { dist: 1.9 });
      });
      k.step('linkage', 'The first crossed parallelogram OO\'ED: the bars OD and O\'E are equal (OA/4) and the bar DE is as long as OO\'. The bars OD and O\'E turn about the fixed pivots O and O\'.', () => {
        slat(O, D); slat(D, E); slat(Op, E);
        addJoints(D, E); redraw();
        k.label(D, 'D', 'sw', { dist: 0.9 }); k.label(E, 'E', 'e', { dist: 0.9 });
      });
      k.step('linkage', 'The second crossed parallelogram OO\'FA is built in proportion to the first, four times as large on the sides O\'E and OD: the bar O\'F runs through E and is four times O\'E, and FA = OO\'. A is carried on a circle about O.', () => {
        slat(Op, F); slat(F, A); slat(O, A);
        addJoints(F, A); redraw();
        k.label(F, 'F', 'e', { dist: 0.9 }); k.label(A, 'A', 'n', { dist: 0.9 });
      });
      k.step('linkage', 'On OA and OH (the bar through D, with OH = OA) complete the rhombus OABH. Because OO\' bisects the angle AOH, the point B has to run along the line OO\'.', () => {
        slat(D, H); slat(A, B); slat(H, B);
        addJoints(H, B); redraw();
        k.label(H, 'H', 'e', { dist: 0.9 }); k.label(B, 'B', 's', { dist: 0.9 });
        k.angle(B, A, H, { r: 0.9, n: 1 });
      });
      k.step('linkage', 'Take the point P on the bar AB, with AP = 0.42 OA. A runs on a circle and B on a straight line, so P describes an ellipse with the centre O and the semi-axes OA + AP and PB.', () => {
        addJoints(P); redraw();
        k.label(P, 'P', 'w', { dist: 0.9 });
      });
      k.step('pencil', 'The ellipse described by P (dashed).', () => {
        k.ellipse(O, ea, eb, { cls: 'given', dash: true, width: 2.2 });
      });
      k.step('linkage', 'The instantaneous centre of P: A moves at right angles to OA, B along OO\', so C is where OA produced meets the perpendicular to OO\' at B; C is on the circle about O of radius 2 OA. The kite CAPG (AP = PG, CA = CG) has CP as its axis.', () => {
        k.seg(B, C, { cls: 'aux', dotted: true });
        slat(A, C); slat(C, G); slat(P, G);
        addJoints(C, G); redraw();
        k.label(C, 'C', 'e', { dist: 0.9 }); k.label(G, 'G', 'nw', { dist: 0.9 });
      });
      k.step('linkage', 'Two more crossed parallelograms, APMJ and PMNR, make the bar PM bisect the angle APG, that is lie along PC. So PM stays on the normal of the ellipse at P; the bar carries a row of holes, equally spaced from P.', () => {
        slat(A, J); slat(M, N); slat(P, R); slat(N, R); slat(M, bar0);
        addJoints(M, J, N, R); redraw();
        for (let s = -5; s <= 2; s++) { if (s === 0) continue; k.dot(g.add(P, g.mul(u, s * hole)), { r: 0.35 }); }
        k.label(M, 'M', 'w', { dist: 0.9 }); k.label(J, 'J', 'e', { dist: 0.9 });
        k.label(N, 'N', 'se', { dist: 0.9 }); k.label(R, 'R', 'n', { dist: 0.9 });
      });
      k.step('pencil', 'A pencil in the hole Q of the bar PM, on the normal at P at a fixed distance from P, draws the curve parallel to the ellipse at that distance (the inner branch here); holes on the other side give the outer branches.', () => {
        const d = g.dist(P, Q);
        k.curve(t => { const nn = g.unit(k.pt(eb * Math.cos(t), ea * Math.sin(t))); return [ea * Math.cos(t) - d * nn.x, eb * Math.sin(t) - d * nn.y]; }, [0, 2 * Math.PI], { n: 480, width: 2.2 });
        k.point(Q, 'Q', { at: 'e', open: true, r: 0.9, lo: { dist: 0.9 } });
      });
    }
  });
})();
