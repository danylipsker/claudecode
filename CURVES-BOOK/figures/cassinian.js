/* Curves Workshop · figures/cassinian.js — Figs. 6, 7, 8 (pages 8–9)
 *
 * Fig. 9 (page 10, the pointwise construction) is in _reference.js.
 * Fig. 6: confocal Cassinian curves with foci F1, F2 = (∓a, 0): P F1 · P F2 = k² for k < a (two ovals), k = a (the lemniscate)
 *         and k > a (one curve); the dashed curve is the locus of the inflection points, r² = −a² cos 2θ.
 * Fig. 7: a torus cut by a plane parallel to its axis: the section is a Cassinian curve (a sketch).
 * Fig. 8: a Peaucellier cell with a crank: the points P and P' of the linkage describe a Cassinian curve.
 */

/* Fig. 6, page 8. The book draws foci at ±a with a family of curves: two shaded ovals (k < a), the lemniscate (k = a)
   and two waisted curves (a < k < √2 a). The waisted curves have four inflection points each, marked with small circles;
   the dashed curves through them are the lemniscate r² = −a² cos 2θ (the locus of the inflection points of the family:
   the book's dashed curves are drawn open at the top, the true locus closes at (0, ±a)). */
Curves.figure({
  id: 'fig-006',
  section: 'cassinian',
  page: 8,
  title: 'A family of confocal Cassinian curves',
  tags: ['foci', 'family', 'inflection'],
  note: 'k = 0.95a, a, 1.115a, 1.23a. The book\'s dashed locus is a freehand curve; the true locus of the inflection points, the lemniscate r² = −a² cos 2θ, is drawn here.',
  build(k) {
    const g = k.g, a = 100;
    const O = k.pt(0, 0), F1 = k.pt(-a, 0), F2 = k.pt(a, 0);
    const cas = kk => k.curves.cassini(a, kk * a, 1);
    const oval = (kk, sgn) => {                                  // the right oval (sgn = 1) or the left one (-1) for k < a, as a closed polygon
      const tm = Math.asin(kk * kk) / 2, n = 120, pts = [];
      const rr = (th, s) => {
        const d = Math.max(0, Math.pow(kk, 4) - Math.pow(Math.sin(2 * th), 2));
        return Math.sqrt(Math.max(0, Math.cos(2 * th) + s * Math.sqrt(d))) * a;
      };
      for (let i = 0; i <= n; i++) { const th = -tm + 2 * tm * i / n; pts.push(k.pt(sgn * rr(th, 1) * Math.cos(th), rr(th, 1) * Math.sin(th))); }
      for (let i = n; i >= 0; i--) { const th = -tm + 2 * tm * i / n; pts.push(k.pt(sgn * rr(th, -1) * Math.cos(th), rr(th, -1) * Math.sin(th))); }
      return pts;
    };
    const flexLoc = t => { const q = -Math.cos(2 * t); return q < 0 ? null : [a * Math.sqrt(q) * Math.cos(t), a * Math.sqrt(q) * Math.sin(t)]; };
    const flex = kk => {                                           // the four inflection points of the curve with k = kk·a
      const c = -Math.sqrt((Math.pow(kk, 4) - 1) / 3), th = Math.acos(c) / 2, r = a * Math.sqrt(-c);
      return [th, Math.PI - th, -th, Math.PI + th].map(t => g.polar(O, r, t));
    };

    k.given('The axes and the two foci F1 and F2 on the X axis, at the distances ±a from O. Every curve of the family has the same foci; they differ in the constant k of the product PF1 · PF2 = k².', () => {
      k.axes(O, { x: [-1.9 * a, 1.85 * a], y: [-0.95 * a, 1.0 * a] });
      k.pivot(F1); k.label(F1, 'F_1', 'ne', { dist: 1.7 });
      k.pivot(F2); k.label(F2, 'F_2', 'ne', { dist: 1.7 });
    });
    k.step('pencil', 'For k a little larger than a (here k = 1.23a) the curve is one oval around both foci with a waist at the Y axis (at the height √(k² − a²)). Compute points as in Fig. 9 and join them.', () => {
      k.curve(cas(1.23), [0, k.TAU], { n: 400, cls: 'given', width: 1.5 });
    });
    k.step('pencil', 'For a smaller k (here 1.115a) the waist is deeper.', () => {
      k.curve(cas(1.115), [0, k.TAU], { n: 400, cls: 'given', width: 1.5 });
    });
    k.step('pencil', 'For k = a the waist closes at O: the curve is the lemniscate of Bernoulli, a figure eight with its double point at O.', () => {
      k.curve(cas(1), [0, k.TAU], { n: 600, cls: 'given', width: 1.5 });
    });
    k.step('pencil', 'For k < a (here 0.95a) the curve splits into two ovals, one around each focus.', () => {
      const L = oval(0.95, -1), R = oval(0.95, 1);
      k.hatch(L, { angle: 0, gap: 0.5 });
      k.hatch(R, { angle: 0, gap: 0.5 });
      k.curve(L.map(p => [p.x, p.y]), null, { cls: 'given', width: 1.5 });
      k.curve(R.map(p => [p.x, p.y]), null, { cls: 'given', width: 1.5 });
      [[F1, 'F_1'], [F2, 'F_2']].forEach(([F, nm]) => {          // the book sets the focus names on a white patch over the shading
        k.poly([k.pt(F.x + 9, F.y + 13), k.pt(F.x + 35, F.y + 13), k.pt(F.x + 35, F.y + 33), k.pt(F.x + 9, F.y + 33)], { close: true, fill: '#fff', stroke: '#fff', width: 0.5 });
        k.label(F, nm, 'ne', { dist: 1.7 });
      });
    });
    k.note('The inflection points of the two waisted curves (small circles) and the curve through all such points: the lemniscate r² = −a² cos 2θ, with its loops along the Y axis.', () => {
      [1.23, 1.115].forEach(kk => flex(kk).forEach(p => k.dot(p, { open: true, r: 1.1 })));
      k.curve(flexLoc, [0, k.TAU], { n: 400, cls: 'given', dash: true, width: 1.5 });
    });
  }
});

/* Fig. 7, page 9 — a sketch of a torus (a tube bent round the axis, the arrow) cut by a plane parallel to the axis: the
   section is a Cassinian curve (a lemniscate when b = a). The torus is drawn in oblique projection: axis vertical, the
   central circle of radius R foreshortened by sin e. Drawn on the scale of the page (pixels of the scan, y downwards). */
Curves.figure({
  id: 'fig-007',
  section: 'cassinian',
  page: 9,
  title: 'A torus cut by a plane parallel to its axis',
  tags: ['3D', 'torus', 'section'],
  note: 'A free sketch in the book; here the torus is projected from its equations. The distance a runs from the axis to the cutting plane, b is the inner radius of the generating circle.',
  build(k) {
    const g = k.g;
    const S = (x, y) => k.pt(x, -y);                       // scan coordinates (pixels, y down) to the kit's
    const Cx = 500, Cy = 625, R = 270, rho = 75, e = g.deg(55), se = Math.sin(e), ce = Math.cos(e);
    const u0 = g.deg(-140), u1 = g.deg(115);
    const proj = (u, w) => {                               // torus point (u around the axis, w around the tube) in screen coordinates
      const r = R + rho * Math.cos(w), x = r * Math.cos(u), y = r * Math.sin(u), z = rho * Math.sin(w);
      return [Cx + x, -(Cy - (z * ce + y * se))];
    };
    const sil = off => u => proj(u, Math.atan(Math.sin(u) / Math.tan(e)) + off);
    const seen = (u, w) => -Math.cos(w) * Math.sin(u) * ce + Math.sin(w) * se > 0;      // the tube faces the viewer here
    const ringFront = u => w => seen(u, w) ? proj(u, w) : null;
    const ringBack = u => w => seen(u, w) ? null : proj(u, w);
    const rings = [u0, g.deg(-103), g.deg(-22), g.deg(35), g.deg(75), u1];
    const O = S(500, 625);

    k.given('The axis of the torus (the arrow) and the cutting plane, parallel to the axis: its edges are the two long lines on the left.', () => {
      k.seg(S(497, 1025), S(498, 905), { cls: 'given' });
      k.seg(S(500, 775), S(500, 462), { cls: 'given' });
      k.arrow(S(500, 340), S(503, 170), { cls: 'given' });
      k.poly([S(183, 1080), S(190, 320), S(200, 300), S(285, 55)], { cls: 'thick', width: 2.6 });
      k.poly([S(445, 60), S(443, 500), S(435, 522), S(372, 722)], { cls: 'thick', width: 2.6 });
      k.poly([S(325, 868), S(257, 1080)], { cls: 'thick', width: 2.6 });
      k.point(O, '', { open: true, r: 1.1 });
    });
    k.step('pencil', 'The torus: the tube of circle radius ρ swept round the axis. Its outline in this view is the outer curve and the inner curve (the edge of the hole); the tube is shown cut open on the left.', () => {
      k.curve(sil(0), [u0, u1], { n: 240, cls: 'given', width: 2.2 });
      k.curve(sil(Math.PI), [u0, u1], { n: 240, cls: 'given', width: 2.2 });
    });
    k.note('Cross sections of the tube (circles of the generating circle): the front half in a full line, the half behind the tube dashed.', () => {
      rings.forEach(u => {
        k.curve(ringFront(u), [0, k.TAU], { n: 90, cls: 'given', width: 1.6 });
        k.curve(ringBack(u), [0, k.TAU], { n: 90, cls: 'given', dash: true, width: 1.4 });
      });
    });
    k.note('The distance a from the axis to the plane, the inner radius b of the generating circle, and the curve in which the plane cuts the torus (the arc on the left): a Cassinian curve; if b = a it is a lemniscate.', () => {
      k.seg(S(328, 572), O, { cls: 'given' });
      k.dot(S(328, 572), { r: 0.7 });
      k.seg(O, S(693, 688), { cls: 'given', dash: true });
      k.label(S(385, 563), 'a', 'n', { dist: 0.6 });
      k.label(S(592, 628), 'b', 'n', { dist: 0.6 });
      k.curve(t => [190 - 42 * Math.sin(t), -(580 - 125 * Math.cos(t))], [0, Math.PI], { n: 80, cls: 'given', width: 1.8 });
    });
  }
});

/* Fig. 8, page 9 — a Peaucellier cell driven by a crank. AD = AO = a; DC = CQ = EO = OC = c/2 (O, C, Q, E a rhombus,
   D, C, Q on one line); CP = PE = EP' = P'C = d with d² = a² − c²/4. A is the centre of the crank's circle through O, so D
   moves on a circle through O; the angle DAO = 2θ and the angle XOQ = θ. P and P' lie on the line OQ and describe the
   Cassinian curve with foci at (±a, 0) and k⁴ = a²c² − c⁴/4. */
Curves.figure({
  id: 'fig-008',
  section: 'cassinian',
  page: 9,
  title: 'A Peaucellier-cell linkage that draws a Cassinian curve',
  tags: ['mechanism', 'linkage', 'Peaucellier'],
  build(k) {
    const g = k.g, a = 100, c = a, d = Math.sqrt(a * a - c * c / 4), th = g.deg(22.3);
    const O = k.pt(0, 0), A = k.pt(-a, 0);
    const D = g.polar(O, 2 * a * Math.sin(th), th + Math.PI / 2);
    const rhoQ = Math.sqrt(c * c - 4 * a * a * Math.sin(th) ** 2);
    const Q = g.polar(O, rhoQ, th);
    const C = g.mid(D, Q), E = g.sub(Q, C), M = g.mid(O, Q);
    const h = Math.sqrt(d * d - a * a * Math.sin(th) ** 2);
    const P = g.add(M, g.mul(g.dir(th), h)), Pp = g.sub(M, g.mul(g.dir(th), h));
    const hw = 0.036 * a;

    const bar = (p, q) => {
      const n = g.mul(g.unit(g.perp(g.sub(q, p))), hw);
      k.poly([g.add(p, n), g.add(q, n), g.sub(q, n), g.sub(p, n)], { close: true, fill: '#fff', width: 1.2 });
    };
    const ring = p => { k.circle(p, 0.05 * a, { fill: '#fff', width: 1.6 }); k.circle(p, 0.028 * a, { width: 1.6 }); };
    const block = p => k.poly([k.pt(p.x - 0.13 * a, p.y - 0.1 * a), k.pt(p.x + 0.13 * a, p.y - 0.1 * a), k.pt(p.x + 0.13 * a, p.y + 0.1 * a), k.pt(p.x - 0.13 * a, p.y + 0.1 * a)], { close: true, fill: '#fff', width: 1.2 });

    k.given('The two fixed pivots A and O, AO = a, and the axis OX.', () => {
      k.seg(A, k.pt(-0.54 * a, 0), { cls: 'cons' });
      k.seg(k.pt(-0.46 * a, 0), k.pt(-0.12 * a, 0), { cls: 'cons' });
      k.label(k.pt(-0.5 * a, 0), 'a', 'c', { upright: false });
      k.arrow(k.pt(0.12 * a, 0), k.pt(0.85 * a, 0), { cls: 'cons' });
      k.label(k.pt(0.85 * a, 0), 'X', 'ne', { upright: true, dist: 1.2 });
      block(A); block(O);
      ring(A); ring(O); k.dot(O, { r: 0.5 });
    });
    k.step('linkage', 'The crank AD: a bar of length a turning about A; since AD = AO, the point D moves on a circle through O. In the position drawn the angle DAO is 2θ.', () => {
      bar(A, D); ring(A); ring(D);
      k.angle(A, O, D, { label: '2θ', r: 3.3, labelDist: 1.3 });
    });
    k.step('linkage', 'The bars DC and OC, both of length c/2, meet at C.', () => {
      bar(D, C); bar(O, C);
      ring(D); ring(C); ring(O); k.dot(O, { r: 0.5 });
    });
    k.step('linkage', 'The bar CQ of length c/2, in line with DC, and the bars QE and EO of length c/2: O, C, Q, E form a rhombus, D is on the line CQ and the angle DOQ is a right angle, since O, D, Q lie on a circle with centre C and diameter DQ.', () => {
      bar(C, Q); bar(Q, E); bar(O, E);
      ring(C); ring(Q); ring(E); ring(O); k.dot(O, { r: 0.5 });
    });
    k.step('linkage', 'The Peaucellier cell: four bars of length d joining C and E to P and P\'. It inverts Q in O (OP · OP\' = d² − c²/4), P and P\' lie on the line OQ.', () => {
      bar(C, P); bar(P, E); bar(E, Pp); bar(Pp, C);
      ring(C); ring(E); ring(P); ring(Pp); ring(Q); ring(O); k.dot(O, { r: 0.5 });
    });
    k.note('The dashed lines: OD (perpendicular to OQ) and the line O–Q–P, which makes the angle θ with OX. With d² = a² − c²/4 the points P and P\' describe a Cassinian curve.', () => {
      k.seg(D, O, { cls: 'cons', dash: true });
      k.seg(O, P, { cls: 'cons', dash: true });
      k.angle(O, k.pt(1, 0), Q, { label: 'θ', r: 4.2, labelDist: 1.0 });
      k.label(A, 'A', 'n', { dist: 2.4 }); k.label(D, 'D', 'ne', { dist: 2.2 }); k.label(C, 'C', 'n', { dist: 2.4 });
      k.label(P, 'P', 'nw', { dist: 2.4 }); k.label(Q, 'Q', 'e', { dist: 2.4 }); k.label(E, 'E', 'se', { dist: 2.4 });
      k.label(Pp, "P'", 'w', { dist: 2.4 }); k.label(O, 'O', 'w', { dist: 3.2 });
    });
  }
});
