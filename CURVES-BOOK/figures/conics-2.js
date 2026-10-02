/* Curves Workshop · figures/conics-2.js — Figs. 44–55 (pages 47–55), the second half of the Conics section.
 *
 * Inscribed triangles (44), aeroplane design (45), Brianchon (46), string methods (47), pointwise
 * constructions (48), envelopes (49), paper folding (50), Newton's method (51), the 3-bar linkage (52),
 * the inversor (53), the projection of the normal on a focal radius (54), the centre of curvature (55).
 * The book's drawings are freehand in places; where a drawing is only approximate the figure is built
 * from the exact geometry, with the book's positions as the starting point (px = a point read off the scan).
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * Math.PI;
  const px = (x, y) => ({ x: x, y: -y });                  // a point read off the scan (y down) -> y up

  /* ---------------------------------------------------------------- helpers */
  function ellipseFn(c, a, b, phi) {                         // ellipse of centre c, semi-axes a (along phi) and b
    const cp = Math.cos(phi), sp = Math.sin(phi);
    return t => [c.x + a * Math.cos(t) * cp - b * Math.sin(t) * sp, c.y + a * Math.cos(t) * sp + b * Math.sin(t) * cp];
  }
  function at(f, t) { const p = f(t); return { x: p[0], y: p[1] }; }
  function nearestT(f, P) {                                 // parameter of the curve point nearest to P
    const n = 3600; let best = 0, bd = Infinity;
    for (let i = 0; i < n; i++) { const t = TAU * i / n, q = f(t), d = (q[0] - P.x) * (q[0] - P.x) + (q[1] - P.y) * (q[1] - P.y); if (d < bd) { bd = d; best = t; } }
    let lo = best - TAU / n, hi = best + TAU / n;
    for (let i = 0; i < 60; i++) {
      const m1 = lo + (hi - lo) / 3, m2 = hi - (hi - lo) / 3, q1 = f(m1), q2 = f(m2);
      const d1 = (q1[0] - P.x) * (q1[0] - P.x) + (q1[1] - P.y) * (q1[1] - P.y), d2 = (q2[0] - P.x) * (q2[0] - P.x) + (q2[1] - P.y) * (q2[1] - P.y);
      if (d1 < d2) hi = m2; else lo = m1;
    }
    return (lo + hi) / 2;
  }
  function clipLine(P, d, r) {                               // the piece of the line P + s d inside the rectangle r = {x0,y0,x1,y1}
    let s0 = -Infinity, s1 = Infinity;
    const tests = [[-d.x, P.x - r.x0], [d.x, r.x1 - P.x], [-d.y, P.y - r.y0], [d.y, r.y1 - P.y]];
    for (const [p, q] of tests) {
      if (Math.abs(p) < 1e-12) { if (q < 0) return null; continue; }
      const s = q / p; if (p < 0) { if (s > s0) s0 = s; } else { if (s < s1) s1 = s; }
    }
    if (s0 > s1) return null;
    return [{ x: P.x + d.x * s0, y: P.y + d.y * s0 }, { x: P.x + d.x * s1, y: P.y + d.y * s1 }];
  }
  function stadium(g, A, B, hw) {                            // outline of a bar of half-width hw with round ends
    const u = g.unit(g.sub(B, A)), n = g.perp(u), a0 = g.angleOf(n), N = 14, pts = [];
    pts.push(g.add(A, g.mul(n, hw)));
    for (let j = 0; j <= N; j++) { const th = a0 - PI * j / N; pts.push({ x: B.x + hw * Math.cos(th), y: B.y + hw * Math.sin(th) }); }
    for (let j = 0; j <= N; j++) { const th = a0 - PI - PI * j / N; pts.push({ x: A.x + hw * Math.cos(th), y: A.y + hw * Math.sin(th) }); }
    return pts;
  }
  function bar(k, A, B, hw, o) { return k.poly(stadium(k.g, A, B, hw), Object.assign({ close: true, fill: '#fff' }, o || {})); }
  function joint(k, P, r) { k.circle(P, r, { fill: '#fff' }); k.circle(P, r * 0.4, { fill: '#fff' }); }
  function box(k, C, w, h) { k.poly([{ x: C.x - w / 2, y: C.y - h / 2 }, { x: C.x + w / 2, y: C.y - h / 2 }, { x: C.x + w / 2, y: C.y + h / 2 }, { x: C.x - w / 2, y: C.y + h / 2 }], { close: true, fill: '#fff' }); }
  function angMark(k, V, A, B, o) {                          // the angle AVB (the smaller one), whichever way round it lies
    const g = k.g; return g.angle(A, V, B) >= 0 ? k.angle(V, A, B, o) : k.angle(V, B, A, o);
  }
  function pencil(k, tip, head, w) {                         // the pencil as the book sketches it: a heavy shaft and a round head
    const g = k.g;
    k.seg(g.along(tip, head, 4), head, { cls: 'thick', width: w || 11 });
    k.dot(head, { r: 1.7 });
  }
  const open = (at_, r) => ({ at: at_, open: true, r: r || 1.5 });

  /* ================================================================ Fig. 44 */
  Curves.figure({
    id: 'fig-044', section: 'conics', page: 47,
    title: 'Inscribed triangle: the tangents at the vertices meet the opposite sides in three collinear points',
    tags: ['pascal', 'projective', 'tangent', 'hexagon'],
    note: 'The book labels the vertices 1=2′, 2=3′, 3=1′: Pascal\'s hexagon 1 2 3 1′ 2′ 3′ with each pair of neighbouring vertices run together, so that its sides 12′… become the tangents.',
    build(k) {
      const g = k.g;
      const f = ellipseFn(px(513.3, 314.0), 280.45, 212.37, -1.88);
      const t1 = nearestT(f, px(450, 580)), t2 = nearestT(f, px(665, 470)), t3 = nearestT(f, px(312, 262));
      const V1 = at(f, t1), V2 = at(f, t2), V3 = at(f, t3);
      const T1 = g.frenet(f, t1).T, T2 = g.frenet(f, t2).T, T3 = g.frenet(f, t3).T;
      const L = g.lineLine(V3, g.add(V3, T3), V1, V2);        // tangent at V3 meets the side V1V2
      const M = g.lineLine(V2, g.add(V2, T2), V1, V3);        // tangent at V2 meets the side V1V3
      const R = g.lineLine(V1, g.add(V1, T1), V2, V3);        // tangent at V1 meets the side V2V3
      const ext = (V, T, from, d) => (g.dot(g.sub(V, from), T) > 0 ? g.add(V, g.mul(T, d)) : g.sub(V, g.mul(T, d)));

      k.given('A conic and a triangle inscribed in it. Its vertices are named 1=2′, 2=3′ and 3=1′, because the triangle is Pascal\'s hexagon with neighbouring vertices run together.', () => {
        k.hatch([V1, V2, V3], { angle: g.angleOf(g.sub(V2, V3)), gap: 1.15 });
        k.curve(f, [0, TAU], { cls: 'thick', n: 360 });
        k.poly([V1, V2, V3], { close: true });
        k.point(V3, '1′=3', Object.assign(open('w'), { lo: { upright: true, size: 0.9, dist: 1.3 } }));
        k.point(V2, '2=3′', Object.assign(open('e'), { lo: { upright: true, size: 0.9, dist: 1.3 } }));
        k.dot(V1, { open: true, r: 1.5 });
        k.text(415, -627, '1=2′', { upright: true, size: 0.9 });
      });
      k.step('straightedge', 'At the vertex 3=1′ draw the tangent to the conic, and extend the opposite side (1=2′ to 2=3′) until the two lines meet.', () => {
        k.seg(V2, L);
        k.seg(L, ext(V3, T3, L, 105));
        k.dot(L, { open: true, r: 1.5 });
      });
      k.step('straightedge', 'In the same way the tangent at 2=3′ meets the side joining the other two vertices, 3=1′ and 1=2′.', () => {
        k.seg(V3, M);
        k.seg(M, ext(V2, T2, M, 95));
        k.dot(M, { open: true, r: 1.5 });
      });
      k.step('straightedge', 'And the tangent at 1=2′ meets the side from 3=1′ to 2=3′.', () => {
        k.seg(V3, R);
        k.seg(R, ext(V1, T1, R, 100));
        k.dot(R, { open: true, r: 1.5 });
      });
      k.step('straightedge', 'The three points of meeting lie on one straight line (the Pascal line of this degenerate hexagon). Lay the straightedge along any two of them: it passes through the third.', () => {
        k.seg(g.add(L, g.mul(g.unit(g.sub(L, R)), 55)), g.add(R, g.mul(g.unit(g.sub(R, L)), 35)));
      });
    }
  });

  /* ================================================================ Fig. 45 */
  Curves.figure({
    id: 'fig-045', section: 'conics', page: 48,
    title: 'Aeroplane design: a conic through three points with two tangents, by Pascal lines',
    tags: ['pascal', 'projective', 'construction', 'tangent'],
    build(k) {
      const g = k.g;
      const f = ellipseFn(px(615.1, 559.0), 307.27, 232.5, -1.639);
      const t1 = nearestT(f, px(455, 335)), t2 = nearestT(f, px(413, 697)), t3 = nearestT(f, px(667, 258));
      const P1 = at(f, t1), P2 = at(f, t2), P3 = at(f, t3);
      const T2 = g.frenet(f, t2).T, T3 = g.frenet(f, t3).T;
      const X = g.lineLine(P2, g.add(P2, T2), P3, g.add(P3, T3));
      const H = g.add(X, { x: 1, y: 0 });                    // the Pascal line is drawn through X, here horizontal
      const Y = g.lineLine(P1, P2, X, H);
      const Z = g.lineLine(P1, P3, X, H);
      const Q = g.lineLine(Y, P3, Z, P2);
      const beyond = (V, T, from, d) => (g.dot(g.sub(V, from), T) > 0 ? g.add(V, g.mul(T, d)) : g.sub(V, g.mul(T, d)));

      k.given('Three points P1, P2, P3 of the conic and the tangents at two of them, P2 and P3; the tangents meet at X.', () => {
        k.seg(X, beyond(P2, T2, X, 150));
        k.seg(X, beyond(P3, T3, X, 115));
        k.point(P1, 'P_1', open('w'));
        k.point(P2, 'P_2', open('sw'));
        k.point(P3, 'P_3', Object.assign(open('n'), { lo: { dist: 1.9 } }));
        k.point(X, 'X', open('n'));
      });
      k.step('straightedge', 'To find further points Q, draw any line through X (a Pascal line, here a horizontal).', () => {
        k.seg(g.add(X, { x: -50, y: 0 }), g.add(Z, { x: 75, y: 0 }));
      });
      k.step('straightedge', 'Extend P1P2 until it meets this line at Y, and P1P3 until it meets it at Z.', () => {
        k.seg(P2, Y);
        k.seg(P1, Z);
        k.point(Y, 'Y', open('n'));
        k.point(Z, 'Z', open('n'));
      });
      k.step('straightedge', 'Draw YP3 and ZP2. They meet at Q, a point of the conic (Pascal\'s theorem for the hexagon Q P3 P3 P1 P2 P2).', () => {
        k.seg(Y, Q);
        k.seg(Z, P2);
        k.point(Q, 'Q', open('e'));
      });
      k.step('pencil', 'The conic through P1, P2, P3 and Q, touching the given tangents at P2 and P3. Another line through X gives another point Q.', () => {
        k.curve(f, [0, TAU], { cls: 'thick', n: 360 });
      });
      k.note('The book shades the quadrilateral P1 P3 Q P2 inscribed in the conic.', () => {
        k.hatch([P1, P3, Q, P2], { angle: -0.45, gap: 1.2 });
      });
    }
  });

  /* ================================================================ Fig. 46 */
  Curves.figure({
    id: 'fig-046', section: 'conics', page: 48,
    title: 'Duality: Brianchon\'s theorem, the three joins of opposite vertices of a circumscribed hexagon meet in a point',
    tags: ['brianchon', 'duality', 'projective', 'tangent'],
    build(k) {
      const g = k.g;
      const f = ellipseFn(px(542.5, 451.5), 310.65, 408.15, -0.751);
      const sides = [[540, 75], [860, 105], [938, 510], [548, 870], [128, 725], [242, 268]];
      // tangent point of each side of the book's hexagon: the point of the conic nearest to that side
      const tt = sides.map((v, i) => {
        const w = sides[(i + 1) % 6], A = px(v[0], v[1]), B = px(w[0], w[1]);
        let best = 0, bd = Infinity;
        for (let j = 0; j < 3600; j++) { const t = TAU * j / 3600, q = at(f, t), d = Math.abs(g.cross(g.sub(B, A), g.sub(q, A))) / g.dist(A, B); if (d < bd) { bd = d; best = t; } }
        return best;
      });
      const tp = tt.map(t => at(f, t)), tg = tt.map(t => g.frenet(f, t).T);
      // vertex i+1 lies on the tangents i and i+1
      const V = [];
      for (let i = 0; i < 6; i++) { const j = (i + 1) % 6; V[j] = g.lineLine(tp[i], g.add(tp[i], tg[i]), tp[j], g.add(tp[j], tg[j])); }
      const Z = g.lineLine(V[0], V[3], V[1], V[4]);

      k.given('A conic (an ellipse here).', () => {
        k.curve(f, [0, TAU], { cls: 'thick', n: 360 });
      });
      k.step('straightedge', 'Draw six tangents to the conic. Neighbouring tangents meet at the six vertices of a hexagon circumscribed about the conic.', () => {
        k.poly(V, { close: true });
        V.forEach(v => k.dot(v, { open: true, r: 1.5 }));
      });
      k.step('straightedge', 'Join the three pairs of opposite vertices. The three joins pass through one point (Brianchon\'s theorem, the dual of Pascal\'s).', () => {
        k.seg(V[0], V[3]); k.seg(V[1], V[4]); k.seg(V[2], V[5]);
        k.pivot(Z);
      });
    }
  });

  /* ================================================================ Fig. 47 — string methods */
  Curves.figure({
    id: 'fig-047a', section: 'conics', page: 49,
    title: 'String method: the ellipse with a loop of string about two pins',
    tags: ['string', 'mechanical', 'ellipse', 'foci'],
    build(k) {
      const g = k.g;
      const F1 = px(140, 785), F2 = px(915, 785), P = px(745, 395);
      const sum = g.dist(F1, P) + g.dist(P, F2), cc = g.dist(F1, F2) / 2, a = sum / 2, b = Math.sqrt(a * a - cc * cc);
      const C0 = g.mid(F1, F2), f = ellipseFn(C0, a, b, 0);
      const t0 = Math.atan2((P.y - C0.y) / b, (P.x - C0.x) / a);
      k.given('Two pins F1 and F2 pushed into the board; they will be the foci.', () => {
        k.pivot(F1); k.pivot(F2);
        k.text(555, -200, 'Ellipse', { upright: true, size: 1.1 });
      });
      k.step('linkage', 'Tie a loop of thread and drop it over the pins. Its length is 2a + 2c (c = half of F1F2). Pull it taut with the pencil point at P.', () => {
        k.poly([F1, P, F2], { close: true });
        pencil(k, P, px(605, 300));
      });
      k.step('pencil', 'Keeping the thread taut, move the pencil round: PF1 + PF2 is the length of the thread less F1F2, always 2a, so the point traces an ellipse with foci F1 and F2.', () => {
        k.curve(f, [t0 - 0.24, t0 + 0.26], { cls: 'curve' });
      });
    }
  });

  Curves.figure({
    id: 'fig-047b', section: 'conics', page: 49,
    title: 'String method: the parabola with a set square sliding along the directrix',
    tags: ['string', 'mechanical', 'parabola', 'directrix', 'focus'],
    build(k) {
      const g = k.g;
      const dx = 145, Pn = px(510, 618);
      const yF = 618 + Math.sqrt(Math.pow(Pn.x - dx, 2) - Math.pow(Pn.x - 348, 2));       // makes FP equal to the distance of P from the directrix
      const F = px(348, yF);
      const S0 = px(dx, 618), S1 = px(dx, 225), S2 = px(830, 618);
      const p = (F.x - dx) / 2, V = { x: dx + p, y: F.y };
      const yP = Pn.y - F.y;                                 // the ordinate of P above the axis of the parabola
      const parab = s => [V.x + s * s / (4 * p), F.y + s];
      k.given('A straight rule fixed to the board (the directrix) and a pin at F (the focus).', () => {
        k.seg(px(dx, 40), px(dx, 1050), { cls: 'thick' });
        k.dot(F, { r: 1.5 });
        k.text(510, -185, 'Parabola', { upright: true, size: 1.1 });
      });
      k.step('linkage', 'Slide the set square along the rule, one leg against it. The thread has the length of the other leg: tie one end to the pin F and the other to the far corner of the leg.', () => {
        k.hatch([S0, S1, S2], { angle: 0.5, gap: 1.0 });
        k.poly([S0, S1, S2], { close: true, width: 2.4 });
        k.poly([px(255, 390), px(255, 518), px(462, 518)], { close: true, fill: '#fff' });
        k.seg(F, Pn);
        k.dot(S2, { r: 0.9 });
      });
      k.step('linkage', 'Hold the thread taut against the leg with the pencil at P. Then PF + (the part of the thread along the leg) = the length of the leg, so PF equals the distance of P from the rule.', () => {
        pencil(k, Pn, px(675, 740));
      });
      k.step('pencil', 'Sliding the square along the rule and keeping the thread taut, the pencil traces a parabola: its points are as far from F as from the rule.', () => {
        k.curve(parab, [yP - 150, yP], { cls: 'curve' });
      });
    }
  });

  Curves.figure({
    id: 'fig-047c', section: 'conics', page: 49,
    title: 'String method: the hyperbola with a ruler pivoting at a focus',
    tags: ['string', 'mechanical', 'hyperbola', 'foci'],
    build(k) {
      const g = k.g;
      const F1 = px(165, 712), F2 = px(835, 712), P = px(718, 342);
      const u = g.unit(g.sub(P, F1)), Rlen = g.dist(F1, P) + 235, E = g.add(F1, g.mul(u, Rlen));
      const twoA = g.dist(F1, P) - g.dist(F2, P), cc = g.dist(F1, F2) / 2, a = twoA / 2, b = Math.sqrt(cc * cc - a * a);
      const C0 = g.mid(F1, F2);
      const u0 = Math.asinh((P.y - C0.y) / b);
      const hyp = s => [C0.x + a * Math.cosh(s), C0.y + b * Math.sinh(s)];
      k.given('A pin at F2 and a pivot at F1 (the foci), 2c apart.', () => {
        k.seg(F1, F2, { cls: 'aux', dash: true });
        k.pivot(F1); k.pivot(F2);
        k.text(470, -150, 'Hyperbola', { upright: true, size: 1.1 });
      });
      k.step('linkage', 'Fix a ruler to turn about F1, and tie a thread to its free end and to the pin F2. The thread is shorter than the ruler by 2a.', () => {
        bar(k, F1, E, 6);
        k.dot(E, { r: 0.9 });
        k.pivot(F1);
        k.seg(E, P);
        k.seg(P, F2);
      });
      k.step('linkage', 'Hold the thread against the ruler with the pencil at P and turn the ruler: PF1 − PF2 = ruler − thread = 2a stays constant.', () => {
        pencil(k, P, px(880, 310));
      });
      k.step('pencil', 'The pencil traces one branch of the hyperbola with foci F1 and F2 (interchange the pins for the other branch).', () => {
        k.curve(hyp, [u0 - 0.28, u0 + 0.3], { cls: 'curve' });
      });
    }
  });

  /* ================================================================ Fig. 48 — pointwise constructions */
  function eqLines(k, x, y, lines, gap, size) {              // the equations printed under a drawing, with the brace
    const n = lines.length;
    k.text(x, y - gap * (n - 1) / 2, '{', { upright: true, size: (size || 1) * (1 + 1.1 * n), anchor: 'end' });
    lines.forEach((ln, i) => k.text(x + 8, y - gap * i, ln, { upright: true, size: size || 1, anchor: 'start' }));
  }

  Curves.figure({
    id: 'fig-048a', section: 'conics', page: 49,
    title: 'Pointwise construction of the ellipse from two concentric circles: x = a cos t, y = b sin t',
    tags: ['construction', 'pointwise', 'ellipse', 'concentric circles'],
    build(k) {
      const g = k.g, a = 420, b = 220, t = g.deg(36.4);
      const O = k.pt(0, 0), A1 = g.polar(O, a, t), B1 = g.polar(O, b, t), P = k.pt(a * Math.cos(t), b * Math.sin(t));
      k.given('Two concentric circles about O, of radii a and b (a > b), and the axes OX, OY.', () => {
        k.axes(O, { x: [-1.08 * a, 1.12 * a], y: [0, 1.42 * a], labels: false });
        k.label(k.pt(0, 1.36 * a), 'Y', 'w', { cls: 'axis' });
        k.circle(O, a);
        k.circle(O, b);
        k.label(k.pt(0, -a), 'a', 'n', { upright: true });
        k.label(k.pt(0, -b), 'b', 'n', { upright: true });
        k.dot(O, { open: true, r: 1.6 });
      });
      k.step('protractor', 'Lay off the angle t from OX and draw the ray from O: it cuts the inner circle and the outer circle.', () => {
        k.seg(O, A1);
        k.angle(O, k.pt(a, 0), A1, { label: 't', r: 1.8, labelDist: 1.2 });
      });
      k.step('square', 'From the point where the ray cuts the outer circle draw a vertical, and from the point where it cuts the inner circle a horizontal (dashed). They meet at P, with x = a cos t and y = b sin t.', () => {
        k.seg(A1, P, { cls: 'cons', dash: true });
        k.seg(B1, P, { cls: 'cons', dash: true });
        k.dot(P, { open: true, r: 1.5 });
      });
      k.step('pencil', 'Repeat for other angles t (mark P each time) and draw the ellipse through the points found.', () => {
        [10, 20, 55, 75, 95].forEach(d => { const q = g.deg(d); k.dot(k.pt(a * Math.cos(q), b * Math.sin(q)), { r: 0.8 }); });
        k.curve(k.curves.ellipse(a, b), [0, 1.92], { n: 200 });
      });
      k.note('The equations of the construction, as printed under the figure.', () => {
        eqLines(k, -0.52 * a, -1.26 * a, ['x  =  a cos t', 'y  =  b sin t'], 0.14 * a, 0.95);
      });
    }
  });

  Curves.figure({
    id: 'fig-048b', section: 'conics', page: 49,
    title: 'Pointwise construction of the parabola from circles about the focus and vertical lines',
    tags: ['construction', 'pointwise', 'parabola', 'focus', 'directrix'],
    build(k) {
      const g = k.g, kk = 93;
      const O = k.pt(0, 0), F = k.pt(kk, 0);
      const aS = [1, 2.4, 3.7, 5, 6.4, 7.8].map(v => v * kk);
      const tick = a => [1, -1].map(sg => {                  // a short arc about F across the line x = a
        const Pt = k.pt(a, sg * 2 * Math.sqrt(kk * a)), ang = g.angleOf(g.sub(Pt, F)), h = 30 / (a + kk);
        return [ang - h, ang + h];
      });
      k.given('The directrix (heavy line, a distance k to the left of K), the vertex K, and the focus (double circle) a distance k to the right of K. The axes through K.', () => {
        k.seg(k.pt(-kk, -6.3 * kk), k.pt(-kk, 7 * kk), { cls: 'thick' });
        k.axes(O, { x: [-kk, 9.1 * kk], y: [-4 * kk, 7 * kk], labels: false });
        k.label(k.pt(9.1 * kk, 0), 'X', 'n', { cls: 'axis' });
        k.label(k.pt(0, 6.85 * kk), 'Y', 'e', { cls: 'axis' });
        k.point(O, 'K', { at: 'nw', open: true, r: 1.6 });
        k.pivot(F);
      });
      k.step('straightedge', 'Draw the verticals x = a for a series of values a (the first through the focus).', () => {
        aS.forEach(a => { const h = 2 * Math.sqrt(kk * a) + 1.7 * kk; k.seg(k.pt(a, -h), k.pt(a, h), { cls: 'cons' }); });
      });
      k.step('compass', 'About the focus draw an arc of radius a + k (the distance of the line x = a from the directrix). It cuts the line x = a above and below the axis at points of the parabola, since (x − k)² + y² = (a + k)² with x = a.', () => {
        const a = aS[1]; tick(a).forEach(r => k.arc(F, a + kk, r[0], r[1]));
      });
      k.step('compass', 'Repeat for each vertical, marking the crossing with a short stroke.', () => {
        aS.forEach((a, i) => { if (i === 1) return; tick(a).forEach(r => k.arc(F, a + kk, r[0], r[1])); });
      });
      k.step('pencil', 'Draw the parabola through the points found: it passes through K.', () => {
        k.curve(y => [y * y / (4 * kk), y], [-5.75 * kk, 5.75 * kk], { n: 200 });
      });
      k.note('The equations of the construction, as printed under the figure.', () => {
        eqLines(k, 0.15 * kk, -6.35 * kk, ['x  =  a', '(x − k)^2 + y^2  =  (a + k)^2'], 0.46 * kk, 0.95);
      });
    }
  });

  Curves.figure({
    id: 'fig-048c', section: 'conics', page: 49,
    title: 'Pointwise construction of the hyperbola from two concentric circles: x = a sec t, y = b tan t',
    tags: ['construction', 'pointwise', 'hyperbola', 'concentric circles'],
    build(k) {
      const g = k.g, a = 365, b = 195, t = g.deg(32.4);
      const O = k.pt(0, 0), xs = a / Math.cos(t);
      const A2 = k.pt(a, a * Math.tan(t)), B2 = k.pt(b, b * Math.tan(t)), P = k.pt(xs, b * Math.tan(t)), S = k.pt(xs, 0);
      k.given('Two concentric circles about O, of radii a and b (a > b), and the axes OX, OY.', () => {
        k.axes(O, { x: [-a, 1.52 * a], y: [0, 1.69 * a], labels: false });
        k.label(k.pt(1.52 * a, 0), 'X', 'n', { cls: 'axis' });
        k.label(k.pt(0, 1.64 * a), 'Y', 'e', { cls: 'axis' });
        k.circle(O, a);
        k.circle(O, b);
        k.label(k.pt(0, -a), 'a', 'n', { upright: true });
        k.label(k.pt(0, -b), 'b', 'n', { upright: true });
        k.dot(O, { open: true, r: 1.6 });
      });
      k.step('straightedge', 'Draw the verticals touching the circles: x = b at the right end of the inner circle, x = a at the right end of the outer circle.', () => {
        k.seg(k.pt(b, -2.06 * b), k.pt(b, 2.19 * b));
        k.seg(k.pt(a, -1.25 * a), k.pt(a, 1.54 * a));
      });
      k.step('protractor', 'Lay off the angle t from OX and draw the ray from O, to meet the vertical x = a (above the outer circle). It meets x = b on the way.', () => {
        k.seg(O, A2);
        k.dot(B2, { open: true, r: 1.6 });
        k.dot(A2, { open: true, r: 1.6 });
        k.angle(O, k.pt(a, 0), A2, { label: 't', r: 1.8, labelDist: 1.2 });
      });
      k.step('compass', 'About O draw the arc through the upper meeting point (dashed): it cuts OX at x = a sec t.', () => {
        k.arc(O, xs, 0, t, { cls: 'cons', dash: true });
      });
      k.step('square', 'Raise the vertical from that point of OX, and draw the horizontal from the meeting point on x = b (both dashed). They meet at P: x = a sec t, y = b tan t.', () => {
        k.seg(S, P, { cls: 'cons', dash: true });
        k.seg(B2, P, { cls: 'cons', dash: true });
        k.dot(P, { open: true, r: 1.6 });
      });
      k.step('pencil', 'Repeat for other angles t and draw the branch of the hyperbola through the points; it touches the vertical x = a at its vertex.', () => {
        [-25, -10, 15, 40].forEach(d => { const q = g.deg(d); k.dot(k.pt(a / Math.cos(q), b * Math.tan(q)), { r: 0.8 }); });
        k.curve(s => [a / Math.cos(s), b * Math.tan(s)], [-0.52, 0.8], { n: 200 });
      });
      k.note('The equations of the construction, as printed under the figure.', () => {
        eqLines(k, -0.52 * a, -1.5 * a, ['x  =  a sec t', 'y  =  b tan t'], 0.16 * a, 0.95);
      });
    }
  });

  /* ================================================================ Figs. 49 and 50 — envelopes and paper folding */
  function rectOf(x0, y0, x1, y1) { return { x0, y0, x1, y1 }; }

  Curves.figure({
    id: 'fig-049a', section: 'conics', page: 50,
    title: 'Envelope of the perpendicular to a ray from F at a point of a circle: the ellipse',
    tags: ['envelope', 'pedal', 'ellipse', 'construction'],
    build(k) {
      const g = k.g, R = 164, c = 92, N = 44, O = k.pt(0, 0), F = k.pt(0, -c);
      const Pn = i => g.polar(O, R, TAU * (i + 0.4) / N);
      const chord = P => g.lineCircle(P, g.add(P, g.perp(g.sub(P, F))), O, R);
      k.given('A fixed circle and a fixed point F inside it.', () => {
        k.circle(O, R);
        k.point(F, 'F', { at: 's', open: true, r: 1.0, lo: { upright: true, size: 0.85 } });
      });
      k.step('straightedge', 'Draw a ray from F to a point P of the circle.', () => {
        const P = Pn(7); k.seg(F, P, { cls: 'cons' }); k.dot(P, { r: 0.8 });
      });
      k.step('square', 'At P draw the perpendicular to the ray, as a chord of the circle. This line is a tangent of the envelope.', () => {
        const P = Pn(7), ch = chord(P); k.seg(ch[0], ch[1], { w: 0.6 }); k.right(P, F, ch[1], { r: 1 });
      });
      k.step('straightedge', 'Repeat from 43 further points spaced round the circle: first the rays from F …', () => {
        for (let i = 0; i < N; i++) if (i !== 7) k.seg(F, Pn(i), { cls: 'cons' });
      });
      k.step('square', '… then the perpendicular chords. The lines crowd together along a curve, the envelope.', () => {
        for (let i = 0; i < N; i++) if (i !== 7) { const ch = chord(Pn(i)); k.seg(ch[0], ch[1], { w: 0.6 }); }
      });
      k.step('pencil', 'The envelope is an ellipse with foci F and the centre of the circle, and major axis equal to the diameter of the circle (the circle is its auxiliary circle).', () => {
        k.curve(t => [Math.sqrt(R * R - c * c) * Math.cos(t), R * Math.sin(t)], [0, TAU], { n: 240 });
      });
    }
  });

  Curves.figure({
    id: 'fig-049b', section: 'conics', page: 50,
    title: 'Envelope of the perpendicular to a ray from F at a point of a line: the parabola',
    tags: ['envelope', 'pedal', 'parabola', 'construction'],
    build(k) {
      const g = k.g, f = 80, N = 41, F = k.pt(0, -f), win = rectOf(-2.2 * f, -1.22 * f, 2.2 * f, 0);
      const phi = i => (i - (N - 1) / 2) * g.deg(3.2), Pn = i => k.pt(f * Math.tan(phi(i)), 0);
      const line = P => clipLine(P, g.perp(g.sub(P, F)), win);
      const m = 27;                                           // the sample ray
      k.given('A fixed line and a fixed point F near it.', () => {
        k.seg(k.pt(-2.25 * f, 0), k.pt(2.25 * f, 0));
        k.point(F, 'F', { at: 's', open: true, r: 1.0, lo: { upright: true, size: 0.85 } });
      });
      k.step('straightedge', 'Draw a ray from F to a point P of the line.', () => {
        const P = Pn(m); k.seg(F, P, { cls: 'cons' }); k.dot(P, { r: 0.8 });
      });
      k.step('square', 'At P draw the perpendicular to the ray. It is a tangent of the envelope.', () => {
        const P = Pn(m), l = line(P); k.seg(l[0], l[1], { w: 0.6 });
        k.right(P, F, g.add(P, g.unit(g.sub(l[1], l[0]))), { r: 1 });
      });
      k.step('straightedge', 'Repeat from 40 further points along the line, rays first …', () => {
        for (let i = 0; i < N; i++) if (i !== m && i % 3 === 0 && Math.abs(phi(i)) < g.deg(58)) k.seg(F, Pn(i), { cls: 'cons' });
      });
      k.step('square', '… then the perpendiculars, cut off at the edge of the drawing.', () => {
        for (let i = 0; i < N; i++) if (i !== m) { const l = line(Pn(i)); if (l) k.seg(l[0], l[1], { w: 0.6 }); }
      });
      k.step('pencil', 'The envelope is a parabola with focus F, touching the fixed line at its vertex (the fixed line is the tangent at the vertex).', () => {
        k.curve(x => [x, -x * x / (4 * f)], [-2.2 * f, 2.2 * f], { n: 160 });
      });
    }
  });

  Curves.figure({
    id: 'fig-049c', section: 'conics', page: 50,
    title: 'Envelope of the perpendicular to a ray from F at a point of a circle, F outside: the hyperbola',
    tags: ['envelope', 'pedal', 'hyperbola', 'construction'],
    build(k) {
      const g = k.g, R = 110, c = 150, N = 48, O = k.pt(0, 0), F = k.pt(0, -c), win = rectOf(-1.35 * R, -1.66 * R, 1.35 * R, 1.15 * R);
      const Pn = i => g.polar(O, R, TAU * (i + 0.5) / N);
      const line = P => clipLine(P, g.perp(g.sub(P, F)), win);
      const b = Math.sqrt(c * c - R * R);
      const inWin = (x, y) => x >= win.x0 && x <= win.x1 && y >= win.y0 && y <= win.y1;
      k.frame(win.x0 - 8, win.y0 - 40, win.x1 + 8, win.y1 + 8);
      k.given('A fixed circle and a fixed point F outside it.', () => {
        k.circle(O, R, { cls: 'cons' });
        k.point(F, 'F', { at: 's', open: true, r: 1.0, lo: { upright: true, size: 0.85 } });
      });
      k.step('straightedge', 'Draw a ray from F to a point P of the circle.', () => {
        const P = Pn(34); k.seg(F, P, { cls: 'cons' }); k.dot(P, { r: 0.8 });
      });
      k.step('square', 'At P draw the perpendicular to the ray, as a long line cut off by the edge of the drawing.', () => {
        const P = Pn(34), l = line(P); k.seg(l[0], l[1], { w: 0.6 });
      });
      k.step('straightedge', 'Repeat from 47 further points round the circle: rays from F to the points on the near side …', () => {
        for (let i = 0; i < N; i++) if (i !== 34 && Math.sin(TAU * (i + 0.5) / N) < 0) k.seg(F, Pn(i), { cls: 'cons' });
      });
      k.step('square', '… and the perpendicular at every point. Two curves appear where the lines crowd together.', () => {
        for (let i = 0; i < N; i++) if (i !== 34) { const l = line(Pn(i)); if (l) k.seg(l[0], l[1], { w: 0.6 }); }
      });
      k.step('pencil', 'The envelope is a hyperbola with one focus at F and the other the mirror image of F in the centre of the circle; the circle is its auxiliary circle (radius a).', () => {
        [1, -1].forEach(sg => k.curve(u => { const x = b * Math.sinh(u), y = sg * R * Math.cosh(u); return inWin(x, y) ? [x, y] : null; }, [-1.4, 1.4], { n: 280 }));
      });
    }
  });

  Curves.figure({
    id: 'fig-050a', section: 'conics', page: 50,
    title: 'Paper folding: F folded onto a circle, the creases envelope an ellipse',
    tags: ['envelope', 'folding', 'ellipse', 'construction'],
    build(k) {
      const g = k.g, R = 134, N = 48, O = k.pt(0, 0), F = k.pt(-99, 0);
      const Pn = i => g.polar(O, R, TAU * (i + 0.37) / N);
      const crease = P => { const M = g.mid(F, P), d = g.perp(g.sub(P, F)); return g.lineCircle(M, g.add(M, d), O, R); };
      k.given('A circle of paper, with the point F marked inside it (the centre of the circle is the other focus).', () => {
        k.circle(O, R, { cls: 'cons' });
        k.pivot(O);
        k.pivot(F);
        k.label(F, 'F', 'e', { upright: true, size: 0.85, dist: 1.8 });
      });
      k.step('fold', 'Fold F onto a point P of the circle and crease the paper: the crease is the perpendicular bisector of FP.', () => {
        const P = Pn(6), ch = crease(P);
        k.seg(F, P, { cls: 'aux', dash: true }); k.dot(P, { r: 0.8 });
        k.seg(ch[0], ch[1], { cls: 'cons' });
      });
      k.step('fold', 'Fold F onto 47 more points spaced round the circle, creasing each time.', () => {
        for (let i = 0; i < N; i++) if (i !== 6) { const ch = crease(Pn(i)); k.seg(ch[0], ch[1], { cls: 'cons' }); }
      });
      k.step('pencil', 'The creases envelope an ellipse with foci F and the centre of the circle: the distance from a point of it to F plus its distance to the centre is the radius of the circle.', () => {
        const a = R / 2, cc = 49.5, b = Math.sqrt(a * a - cc * cc);
        k.curve(t => [-cc + a * Math.cos(t), b * Math.sin(t)], [0, TAU], { n: 200 });
      });
    }
  });

  Curves.figure({
    id: 'fig-050b', section: 'conics', page: 50,
    title: 'Paper folding: F folded onto a line, the creases envelope a parabola',
    tags: ['envelope', 'folding', 'parabola', 'construction'],
    build(k) {
      const g = k.g, d = 60, N = 49, F = k.pt(0, -d), win = rectOf(-2.8 * d, -4.7 * d, 2.8 * d, 0);
      const phi = i => (i - (N - 1) / 2) * g.deg(3.0), Pn = i => k.pt(d * Math.tan(phi(i)), 0);
      const crease = P => clipLine(g.mid(F, P), g.perp(g.sub(P, F)), win);
      k.given('A sheet of paper with a straight edge and the point F marked a little way from it.', () => {
        k.seg(k.pt(-2.9 * d, 0), k.pt(2.9 * d, 0));
        k.pivot(F);
        k.label(F, 'F', 'se', { upright: true, size: 0.85, dist: 1.8 });
      });
      k.step('fold', 'Fold F onto a point P of the edge and crease the paper: the crease is the perpendicular bisector of FP.', () => {
        const P = Pn(31), l = crease(P);
        k.seg(F, P, { cls: 'aux', dash: true }); k.dot(P, { r: 0.8 });
        k.seg(l[0], l[1], { cls: 'cons' });
      });
      k.step('fold', 'Fold F onto 48 more points of the edge. Points far along the edge give creases that lean steeply.', () => {
        for (let i = 0; i < N; i++) if (i !== 31) { const l = crease(Pn(i)); if (l) k.seg(l[0], l[1], { cls: 'cons' }); }
      });
      k.step('pencil', 'The creases envelope a parabola with focus F and the edge as its directrix.', () => {
        k.curve(x => [x, -d / 2 - x * x / (2 * d)], [-2.8 * d, 2.8 * d], { n: 160 });
      });
    }
  });

  Curves.figure({
    id: 'fig-050c', section: 'conics', page: 50,
    title: 'Paper folding: F outside the circle, the creases envelope a hyperbola',
    tags: ['envelope', 'folding', 'hyperbola', 'construction'],
    build(k) {
      const g = k.g, R = 135, N = 48, O = k.pt(0, 0), F = k.pt(-191, 0), win = rectOf(-233, -135, 52, 135);
      const Pn = i => g.polar(O, R, TAU * (i + 0.37) / N);
      const crease = P => clipLine(g.mid(F, P), g.perp(g.sub(P, F)), win);
      const m = { x: -95.5, y: 0 }, a = R / 2, b = Math.sqrt(95.5 * 95.5 - a * a);
      const inWin = (x, y) => x >= win.x0 && x <= win.x1 && y >= win.y0 && y <= win.y1;
      k.given('A circle on the paper, with the point F marked outside it (the centre of the circle is the other focus).', () => {
        k.circle(O, R, { cls: 'cons' });
        k.pivot(O);
        k.pivot(F);
        k.label(F, 'F', 'sw', { upright: true, size: 0.85, dist: 1.8 });
      });
      k.step('fold', 'Fold F onto a point P of the circle and crease the paper: the crease is the perpendicular bisector of FP.', () => {
        const P = Pn(10), l = crease(P);
        k.seg(F, P, { cls: 'aux', dash: true }); k.dot(P, { r: 0.8 });
        if (l) k.seg(l[0], l[1], { cls: 'cons' });
      });
      k.step('fold', 'Fold F onto 47 more points spaced round the circle, creasing each time.', () => {
        for (let i = 0; i < N; i++) if (i !== 10) { const l = crease(Pn(i)); if (l) k.seg(l[0], l[1], { cls: 'cons' }); }
      });
      k.step('pencil', 'The creases envelope a hyperbola with foci F and the centre of the circle: the difference of the distances from a point of it to F and to the centre is the radius.', () => {
        [1, -1].forEach(sg => k.curve(u => { const x = m.x + sg * a * Math.cosh(u), y = b * Math.sinh(u); return inWin(x, y) ? [x, y] : null; }, [-2.2, 2.2], { n: 300 }));
      });
    }
  });

  /* ================================================================ Fig. 51 — Newton's method */
  Curves.figure({
    id: 'fig-051', section: 'conics', page: 51,
    title: 'Newton\'s method: two angles of constant size turning about A and B, one pair of sides meeting on a line',
    tags: ['newton', 'projective pencils', 'generation', 'angle'],
    build(k) {
      const g = k.g;
      const A = px(368, 745), B = px(745, 940), P = px(512, 340), Q = px(868, 515);
      const aAP = g.angleOf(g.sub(P, A)), aAQ = g.angleOf(g.sub(Q, A)), aBP = g.angleOf(g.sub(P, B)), aBQ = g.angleOf(g.sub(Q, B));
      const dA = aAP - aAQ, dB = aBP - aBQ;                   // the constant angles at A and at B
      const onY = (V, ang, y) => g.add(V, g.mul(g.dir(ang), (y - V.y) / Math.sin(ang)));
      const onX = (V, ang, x) => g.add(V, g.mul(g.dir(ang), (x - V.x) / Math.cos(ang)));
      const A1 = onY(A, aAP, -55), A2 = onX(A, aAQ, 990);
      const zigA = [[688, 68], [692, 140], [757, 146], [764, 217], [832, 215], [833, 262], [905, 340], [953, 343], [956, 410], [998, 415]].map(p => px(p[0], p[1]));
      const B1 = onY(B, aBP, -160), B2 = onY(B, aBQ, -232);
      const zigB = [[498, 195], [558, 142], [592, 206], [635, 194], [685, 265], [718, 226], [765, 215], [800, 262], [836, 225], [880, 245]].map(p => px(p[0], p[1]));
      const locus = s => {
        const Ps = { x: s, y: -340 };
        const a1 = g.angleOf(g.sub(Ps, A)) - dA, b1 = g.angleOf(g.sub(Ps, B)) - dB;
        const R = g.lineLine(A, g.add(A, g.dir(a1)), B, g.add(B, g.dir(b1)));
        return R ? [R.x, R.y] : null;
      };
      k.given('A fixed line, and two fixed points A and B (the vertices of the two angles).', () => {
        k.seg(px(120, 340), px(1090, 340), { cls: 'thick' });
        box(k, A, 65, 43); box(k, B, 83, 44);
        k.dot(A, { r: 2.2 }); k.dot(B, { r: 2.2 });
        k.label(g.add(A, { x: 0, y: -34 }), 'A', 's', { upright: true, size: 0.95 });
        k.label(g.add(B, { x: -48, y: 0 }), 'B', 'w', { upright: true, size: 0.95 });
        k.arrow(px(395, 325), px(490, 325), { headSize: 0.8 });
      });
      k.step('protractor', 'At A draw an angle of fixed size (about 46° here) turning about A. One of its sides passes through the point P of the fixed line; the other side is the one that will meet the second angle.', () => {
        k.hatch([A, A1].concat(zigA, [A2]), { angle: -PI / 4, gap: 1.5 });
        k.seg(A, A1);
        k.seg(A, A2);
        k.poly([A1].concat(zigA, [A2]));
      });
      k.step('protractor', 'At B draw a second angle of fixed size (about 37°). Its left side passes through the same point P; its right side meets the second side of the angle at A in the point Q.', () => {
        k.hatch([B, B1].concat(zigB, [B2]), { angle: 0, gap: 1.15, fill: '#fff' });
        k.seg(B, B1);
        k.seg(B, B2);
        k.poly([B1].concat(zigB, [B2]));
        k.dot(B, { r: 2.2 });
        k.point(P, 'P', { at: 'sw', r: 0.7 });
        k.point(Q, 'Q', { at: 'e', r: 0.7 });
      });
      k.step('pencil', 'Slide P along the fixed line, keeping both angles the same size. The point Q then describes a conic through A and B.', () => {
        k.curve(locus, [512, 655], { n: 80, arrow: 640 });
      });
    }
  });

  /* ================================================================ Figs. 52 and 53 — the linkage and the inversor */
  function linkage3(g, a, th, z) {                           // AB = CD = 2a, AC = BD = 2b: C and D from the angle th and the distance z = MT
    const u2 = g.dir(2 * th), T = { x: z, y: 0 };
    return { A: { x: -a, y: 0 }, B: { x: a, y: 0 }, T, u2, D: g.add(T, g.mul(u2, a + z)), C: g.sub(T, g.mul(u2, a - z)) };
  }

  Curves.figure({
    id: 'fig-052', section: 'conics', page: 51,
    title: 'The 3-bar linkage AB = CD = 2a, AC = BD = 2b: a variable trapezoid',
    tags: ['linkage', 'mechanism', 'antiparallelogram'],
    note: 'The bars AC and BD swing about the fixed pivots A and B and the bar CD joins them; AD and BC stay parallel, and so OP stays parallel to them.',
    build(k) {
      const g = k.g, a = 307, th = g.deg(21.9), z = 115, s = 197, hw = 24, rj = 33;
      const { A, B, T, u2, C, D } = linkage3(g, a, th, z);
      const P = g.add(T, g.mul(u2, s)), O = k.pt(z - s, 0), M = k.pt(0, 0);
      const joints = () => { [A, B, C, D].forEach(v => joint(k, v, rj)); };
      k.given('Two fixed pivots A and B on a straight line, AB = 2a, M its midpoint.', () => {
        k.seg(k.pt(-a - 85, 0), k.pt(a + 170, 0));
        box(k, A, 108, 88); box(k, B, 108, 88);
        k.label(g.add(A, { x: 0, y: 62 }), 'A', 'n', { upright: true });
        k.label(g.add(B, { x: 70, y: 40 }), 'B', 'e', { upright: true });
      });
      k.step('linkage', 'Hinge a bar AC of length 2b at A and a bar BD of the same length at B (a > b).', () => {
        bar(k, A, C, hw); bar(k, B, D, hw);
        joints();
        k.label(g.add(C, { x: 36, y: -14 }), 'C', 'e', { upright: true });
        k.label(g.add(D, { x: -40, y: 8 }), 'D', 'w', { upright: true });
      });
      k.step('linkage', 'Join their free ends by a bar CD of length 2a. The bars AB and CD cross at T; AD and BC are parallel (dashed).', () => {
        bar(k, C, D, hw);
        k.seg(A, D, { cls: 'cons', dash: true });
        k.seg(C, B, { cls: 'cons', dash: true });
        joints();
        k.dot(T, { r: 0.7 });
        k.label(g.add(T, { x: -6, y: 8 }), 'T', 'nw', { upright: true });
      });
      k.step('square', 'Choose a point P on CD and draw through it OP parallel to AD and BC, meeting AB at O. O is the same whatever the position of the linkage, so OP = r turns about the fixed point O.', () => {
        k.seg(O, P, { cls: 'cons', dash: true });
        k.dot(O, { open: true, r: 1.1 }); k.dot(M, { open: true, r: 1.1 }); k.dot(P, { open: true, r: 1.2 });
        k.label(O, 'O', 's', { upright: true, dist: 1.4 }); k.label(M, 'M', 's', { upright: true, dist: 1.4 });
        k.label(g.add(P, { x: -10, y: 4 }), 'P', 'nw', { upright: true });
        k.label(g.add(g.mid(O, P), g.mul(g.perp(g.unit(g.sub(P, O))), 24)), 'r', 'c');
      });
      k.note('The angle θ: the angle BAD, which AD makes with AB, is repeated at O (between OB and OP), at D (between DA and DC), at C (between CB and CD) and at B (between BA and BC).', () => {
        angMark(k, A, B, D, { label: 'θ', r: 2.0, labelDist: 1.3 });
        angMark(k, O, B, P, { label: 'θ', r: 2.4, labelDist: 1.3 });
        angMark(k, D, A, C, { label: 'θ', r: 2.6, labelDist: 1.3 });
        angMark(k, C, B, D, { label: 'θ', r: 2.4, labelDist: 1.3 });
        angMark(k, B, A, C, { label: 'θ', r: 2.2, labelDist: 1.3 });
      });
    }
  });

  Curves.figure({
    id: 'fig-053', section: 'conics', page: 52,
    title: 'The inversor OEPFP′ attached to the 3-bar linkage: P′ describes a conic',
    tags: ['linkage', 'mechanism', 'inversion', 'peaucellier'],
    note: 'In the book the fixed pivot O is taken at M (OM = c = 0); with c ≠ 0 it moves along AB as in Fig. 52.',
    build(k) {
      const g = k.g, a = 203.5, th = g.deg(20.6), z = 76.9, hw = 17, rj = 22;
      const { A, B, T, u2, C, D } = linkage3(g, a, th, z);
      const O = k.pt(0, 0), P = g.add(T, g.mul(u2, z));       // OT = z, so TP = OT and OP is parallel to AD
      const r = g.dist(O, P), uP = g.unit(g.sub(P, O)), nP = g.perp(uP);
      const Lb = 485, sr = 362, rho = (Lb * Lb - sr * sr) / r;
      const Pp = g.add(O, g.mul(uP, rho)), mid = g.add(O, g.mul(uP, (r + rho) / 2)), h = Math.sqrt(sr * sr - Math.pow((rho - r) / 2, 2));
      const E = g.add(mid, g.mul(nP, h)), F = g.sub(mid, g.mul(nP, h));
      k.given('The 3-bar linkage of Fig. 52 (A, B and O on the fixed line, O the midpoint of AB here) with P on the bar CD, OP parallel to AD.', () => {
        k.seg(k.pt(-a - 95, 0), k.pt(a + 520, 0));
        box(k, A, 80, 60); box(k, O, 85, 60); box(k, B, 76, 60);
        bar(k, A, C, hw); bar(k, C, D, hw); bar(k, D, B, hw);
        [A, B, C, D, O, P].forEach(v => joint(k, v, rj));
        k.label(g.add(A, { x: 0, y: 36 }), 'A', 'n', { upright: true, size: 0.9 });
        k.label(g.add(O, { x: 0, y: 36 }), 'O', 'n', { upright: true, size: 0.9 });
        k.label(g.add(B, { x: 0, y: -30 }), 'B', 's', { upright: true, size: 0.9 });
        k.label(g.add(C, { x: 26, y: -6 }), 'C', 'e', { upright: true, size: 0.9 });
        k.label(g.add(D, { x: 28, y: 0 }), 'D', 'e', { upright: true, size: 0.9 });
        k.label(g.add(P, { x: -4, y: 18 }), 'P', 'n', { upright: true, size: 0.9 });
      });
      k.step('linkage', 'Attach the inversor: bars OE and OF of equal length, and four equal bars EP, PF, FP′ and P′E forming a rhombus. O, P and P′ always lie on a straight line.', () => {
        bar(k, O, E, hw); bar(k, P, E, hw); bar(k, E, Pp, hw); bar(k, Pp, F, hw); bar(k, F, P, hw); bar(k, O, F, hw);
        [O, P, E, F, Pp].forEach(v => joint(k, v, rj));
        k.label(g.add(E, { x: -24, y: 8 }), 'E', 'nw', { upright: true, size: 0.9 });
        k.label(g.add(F, { x: 26, y: -4 }), 'F', 'e', { upright: true, size: 0.9 });
        k.label(g.add(Pp, { x: 22, y: -14 }), 'P′', 'se', { upright: true, size: 0.9 });
        k.label(g.add(P, { x: -4, y: 18 }), 'P', 'n', { upright: true, size: 0.9 });
      });
      k.note('OP · OP′ = OE² − PE² = 2k, so P′ is the inverse of P with respect to the circle of centre O and radius √(2k): when P describes the sextic, P′ describes a conic.');
    }
  });

  /* ================================================================ Fig. 54 — projection of the normal upon a focal radius */
  function panel54(k, o) {                                    // the lettering and marks common to the three panels
    const g = k.g, { F1, P, Q, H } = o;
    k.step('straightedge', o.t2, () => {
      k.seg(P, Q, { cls: 'thick' });
      if (o.axisFrom) k.seg(o.axisFrom, o.axisTo);
      k.point(Q, 'Q', open(o.atQ || 's', 1.1));
      k.label(g.mid(P, Q), 'N', o.atN, { upright: true, dist: 1.5, size: 0.9 });
    });
    k.step('square', 'From Q draw the perpendicular QH to the focal radius F1P (dashed). Then PH = N cos α = ρ1 − F1Q cos θ, and with F1Q = e·ρ1 this is the constant A, the semi-latus rectum.', () => {
      k.seg(Q, H, { cls: 'cons', dash: true });
      k.point(H, 'H', Object.assign(open(o.atH || 'sw', 0.9), { lo: { dist: o.distH || 1 } }));
      k.right(H, P, Q, { r: 0.8 });
    });
    k.note('The angle α at P between the normal and the focal radius, the angle θ at F1 between the axis (towards Q) and the focal radius, and the lengths marked.', () => {
      angMark(k, P, o.aA, o.aB, { label: 'α', r: 1.7, labelDist: 1.2 });
      angMark(k, F1, Q, P, { label: 'θ', r: 1.7, labelDist: 1.2 });
      k.label(g.lerp(F1, P, o.rho1At || 0.5), 'ρ_1', o.atR1 || 'e', { dist: o.distR1 || 1.2 });
    });
  }

  Curves.figure({
    id: 'fig-054a', section: 'conics', page: 53,
    title: 'Projection of the normal upon a focal radius: the parabola',
    tags: ['normal', 'focal radius', 'semi-latus rectum', 'parabola'],
    build(k) {
      const g = k.g, p = 110, yP = 383;
      const xP = -yP * yP / (4 * p), P = k.pt(xP, yP), F1 = k.pt(-p, 0);
      const rho1 = g.dist(P, F1), Q = k.pt(F1.x - rho1, 0), M = k.pt(xP, 0), H = g.foot(Q, F1, P);
      k.given('A parabola with focus F1, a point P of it, the focal radius F1P and the line through P parallel to the axis.', () => {
        k.curve(y => [-y * y / (4 * p), y], [-315, 486], { cls: 'thick', n: 240 });
        k.seg(k.pt(-647, yP), P);
        k.seg(P, F1);
        k.dot(F1, { r: 2.2 }); k.label(F1, 'F_1', 's', { dist: 1.4 });
        k.point(P, 'P', open('n', 1.4));
      });
      k.step('compass', 'With centre F1 and radius F1P mark Q on the axis, on the far side of F1: for the parabola F1Q = ρ1, so the triangle F1PQ is isosceles and PQ is the normal.', () => {
        k.arc(F1, rho1, g.deg(172), g.deg(188), { cls: 'aux' });
        k.seg(Q, F1);
      });
      panel54(k, { F1, P, Q, H, t2: 'Draw PQ, the normal of length N. Its projection on the axis, QM, is the semi-latus rectum A (the subnormal of a parabola is constant); the dashed ordinate PM is perpendicular to the axis.', atN: 'w', atQ: 's', atH: 'sw', aA: Q, aB: F1, atR1: 'e', rho1At: 0.465 });
      k.note('The ordinate PM and the length A = QM.', () => {
        k.seg(P, M, { cls: 'cons', dash: true });
        k.dot(M, { open: true, r: 0.8 });
        k.label(g.mid(Q, M), 'A', 'n', { upright: true, dist: 1.3 });
      });
    }
  });

  Curves.figure({
    id: 'fig-054b', section: 'conics', page: 53,
    title: 'Projection of the normal upon a focal radius: the ellipse',
    tags: ['normal', 'focal radius', 'semi-latus rectum', 'ellipse'],
    note: 'The book prints F for the left focus here; it is the focus F1 from which ρ1 and θ are measured.',
    build(k) {
      const g = k.g, a = 354, b = 269, c = Math.sqrt(a * a - b * b), t = g.deg(58);
      const f = ellipseFn({ x: 0, y: 0 }, a, b, 0);
      const P = at(f, t), F1 = k.pt(-c, 0), F2 = k.pt(c, 0), nrm = { x: P.x / (a * a), y: P.y / (b * b) };
      const Q = g.lineLine(P, g.add(P, nrm), F1, F2), H = g.foot(Q, F1, P);
      k.given('An ellipse with foci F1 and F2, a point P of it and the focal radii ρ1 = F1P and ρ2 = F2P.', () => {
        k.curve(f, [0, TAU], { cls: 'thick', n: 240 });
        k.seg(F1, P); k.seg(P, F2);
        k.dot(F1, { r: 2.2 }); k.dot(F2, { r: 2.2 });
        k.label(F1, 'F_1', 's', { dist: 1.4 }); k.label(F2, 'F_2', 's', { dist: 1.4 });
        k.point(P, 'P', open('n', 1.4));
        k.label(g.lerp(F2, P, 0.5), 'ρ_2', 'e', { dist: 1.2 });
      });
      panel54(k, { F1, P, Q, H, t2: 'Draw the normal at P: it bisects the angle F1PF2 and meets the axis at Q, so F2Q : F1Q = ρ2 : ρ1. Its length PQ is N.', axisFrom: F1, axisTo: F2, atN: 'e', atQ: 's', atH: 'w', aA: F1, aB: Q, atR1: 'nw', rho1At: 0.42 });
    }
  });

  Curves.figure({
    id: 'fig-054c', section: 'conics', page: 53,
    title: 'Projection of the normal upon a focal radius: the hyperbola',
    tags: ['normal', 'focal radius', 'semi-latus rectum', 'hyperbola'],
    build(k) {
      const g = k.g, a = 169, c = 236, b = Math.sqrt(c * c - a * a), u = 1.25;
      const hy = (sg, v) => [sg * a * Math.cosh(v), b * Math.sinh(v)];
      const P = k.pt(a * Math.cosh(u), b * Math.sinh(u)), F1 = k.pt(c, 0), F2 = k.pt(-c, 0);
      const nrm = { x: P.x / (a * a), y: -P.y / (b * b) };
      const Q = g.lineLine(P, g.add(P, nrm), F1, F2), H = g.foot(Q, F1, P);
      k.given('A hyperbola with foci F1 and F2, a point P on the branch round F1, and the focal radii ρ1 = F1P and ρ2 = F2P.', () => {
        k.curve(v => hy(1, v), [-1.3, 1.65], { cls: 'thick', n: 200 });
        k.curve(v => hy(-1, v), [-1.25, 1.25], { cls: 'thick', n: 200 });
        k.seg(F2, P); k.seg(F1, P);
        k.dot(F1, { r: 2.2 }); k.dot(F2, { r: 2.2 });
        k.label(F1, 'F_1', 's', { dist: 1.4 }); k.label(F2, 'F_2', 's', { dist: 1.4 });
        k.point(P, 'P', open('n', 1.4));
        k.label(g.lerp(F2, P, 0.5), 'ρ_2', 'nw', { dist: 1.2 });
      });
      panel54(k, { F1, P, Q, H, t2: 'Draw the normal at P: it bisects the outside angle at P between the focal radii and meets the axis at Q beyond F1, so F2Q : F1Q = ρ2 : ρ1. Its length PQ is N.', axisFrom: F2, axisTo: F1, atN: 'ne', atQ: 's', atH: 'e', aA: F1, aB: Q, atR1: 'e', rho1At: 0.62, distR1: 1.4, distH: 2.2 });
      k.note('The axis from F1 to Q is drawn dashed.', () => {
        k.seg(F1, Q, { cls: 'cons', dash: true });
      });
    }
  });

  /* ================================================================ Fig. 55 — the centre of curvature of an ellipse */
  Curves.figure({
    id: 'fig-055', section: 'conics', page: 55,
    title: 'The centre of curvature C at a point P of an ellipse',
    tags: ['curvature', 'evolute', 'normal', 'focal radius', 'ellipse'],
    build(k) {
      const g = k.g, a = 461, b = 347.5, c = Math.sqrt(a * a - b * b), t = g.deg(55);
      const f = ellipseFn({ x: 0, y: 0 }, a, b, 0);
      const P = at(f, t), F1 = k.pt(-c, 0), F2 = k.pt(c, 0);
      const nrm = { x: P.x / (a * a), y: P.y / (b * b) };
      const Q = g.lineLine(P, g.add(P, nrm), F1, F2);
      const K = g.lineLine(F1, P, Q, g.add(Q, g.perp(g.sub(P, Q))));
      const C = g.lineLine(P, Q, K, g.add(K, g.perp(g.sub(P, F1))));
      k.given('An ellipse with foci F1 and F2, a point P of it, and the focal radii F1P and F2P.', () => {
        k.curve(f, [0, TAU], { cls: 'thick', n: 300 });
        k.seg(F1, F2);
        k.seg(F1, P, { cls: 'thick' }); k.seg(P, F2);
        k.dot(F1, { r: 1.7 }); k.dot(F2, { r: 1.7 });
        k.label(F1, 'F_1', 's', { upright: true, dist: 1.4 }); k.label(F2, 'F_2', 's', { upright: true, dist: 1.4 });
        k.point(P, 'P', open('ne', 1.0));
      });
      k.step('straightedge', 'Draw the normal at P (it bisects the angle F1PF2); it meets the axis F1F2 at Q. Its length PQ is N.', () => {
        k.seg(P, Q, { cls: 'thick' });
        k.point(Q, 'Q', open('se', 1.0));
        k.label(g.mid(P, Q), 'N', 'e', { upright: true, dist: 1.3, size: 0.85 });
      });
      k.step('square', 'At Q draw the perpendicular to the normal; it meets the focal radius F1P at K. In the right triangle PQK, PK = N sec α.', () => {
        k.seg(Q, K, { cls: 'cons', dash: true });
        k.right(Q, P, K, { r: 0.8 });
        k.point(K, 'K', open('nw', 1.0));
        k.label(g.lerp(K, P, 0.5), 'N·sec α', 'nw', { upright: true, dist: 1.2, size: 0.85 });
      });
      k.step('square', 'At K draw the perpendicular to F1P; it meets the normal in C, the centre of curvature: PC = PK sec α = N sec²α = R.', () => {
        k.seg(K, C, { cls: 'cons', dash: true });
        k.seg(Q, C, { cls: 'cons', dash: true });
        k.right(K, P, C, { r: 0.8 });
        k.pivot(C);
        k.label(C, 'C', 'e', { upright: true, dist: 2.2, size: 0.85 });
      });
      k.note('The angle α between the focal radius and the normal at P.', () => {
        angMark(k, P, K, Q, { label: 'α', r: 1.6, labelDist: 1.3 });
      });
    }
  });
})();
