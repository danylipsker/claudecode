/* Curves Workshop · figures/inversion.js — Figs. 122–133 (pages 127–134)
 *
 * Inversion in a circle of centre O and radius k: OA · OĀ = k².
 * 122 the definition; 123 the construction of inverse points (tangent and perpendicular; compass only);
 * 124–128 inverses of the parabola, the rectangular hyperbola (vertex, centre), the conics (focus, centre);
 * 129–130 the Peaucellier and Hart inversors, without and with the extra bar for line motion;
 * 131 poles and polars; 132 Apollonius by inversion; 133 a cyclic quadrilateral inverts into a line.
 * Wrapped in a function so that the helpers stay private.
 */
(function () {
  const g = Curves.g;
  const PI = Math.PI, TAU = 2 * Math.PI;
  const ob = s => s + '̄';                                   // a letter with a bar over it: Ā
  const P2 = (x, y) => ({ x, y: -y });                            // a point read from the scan (y down) to the kit (y up)

  /* the inverse of a point or of a sampled curve */
  const invP = (p, O, k2) => g.inversion(p, O, k2);
  const invCurve = (f, O, k2) => t => { const p = f(t); if (!p) return null; const q = g.inversion({ x: p[0], y: p[1] }, O, k2); return [q.x, q.y]; };

  /* the arc of a circle from P through Q to R, as a function of t in [0, 1] */
  function arcThrough(P, Q, R) {
    const Z = g.circumcenter(P, Q, R), r = g.dist(Z, P);
    const norm = x => { while (x < 0) x += TAU; while (x >= TAU) x -= TAU; return x; };
    const aP = g.angleOf(g.sub(P, Z)), dR = norm(g.angleOf(g.sub(R, Z)) - aP), dQ = norm(g.angleOf(g.sub(Q, Z)) - aP);
    const sweep = dQ < dR ? dR : dR - TAU;
    return t => [Z.x + r * Math.cos(aP + sweep * t), Z.y + r * Math.sin(aP + sweep * t)];
  }
  const segF = (P, Q) => t => [P.x + (Q.x - P.x) * t, P.y + (Q.y - P.y) * t];

  /* the centre of inversion and a sample pair, in the same style in every figure */
  function samplePair(k, O, k2, P0, lp, lq, atP, atQ) {
    const Q0 = invP(P0, O, k2);
    k.seg(O, g.dist(O, Q0) > g.dist(O, P0) ? Q0 : P0, { cls: 'aux', dash: true });
    k.point(P0, lp, { at: atP || 'se', open: true });
    k.point(Q0, lq, { at: atQ || 'ne', open: true });
    return Q0;
  }

  /* linkage drawing helpers (the book's wide hollow bars, pivot rings and bearings) */
  function wideBar(k, A, B, w, o) {
    const d = g.unit(g.sub(B, A)), n = g.perp(d), h = w / 2, ang = g.angleOf(n), N = 10, pts = [];
    pts.push(g.add(A, g.mul(n, h)), g.add(B, g.mul(n, h)));
    for (let i = 1; i < N; i++) pts.push(g.polar(B, h, ang - PI * i / N));
    pts.push(g.add(B, g.mul(n, -h)), g.add(A, g.mul(n, -h)));
    for (let i = 1; i < N; i++) pts.push(g.polar(A, h, ang + PI - PI * i / N));
    k.poly(pts, Object.assign({ close: true, cls: 'given' }, o || {}));
  }
  function ring(k, P, r) { k.circle(P, r, { cls: 'given', fill: '#fff', target: false }); k.circle(P, r * 0.4, { cls: 'given', target: false }); }
  function box(k, P, hx, hy) {
    k.poly([k.pt(P.x - hx, P.y - hy), k.pt(P.x + hx, P.y - hy), k.pt(P.x + hx, P.y + hy), k.pt(P.x - hx, P.y + hy)], { close: true, cls: 'cons' });
  }

  /* ---------------------------------------------------------------- Fig. 122, page 127 */
  Curves.figure({
    id: 'fig-122',
    section: 'inversion',
    page: 127,
    title: 'Mutually inverse points and curves',
    tags: ['inversion', 'definition'],
    build(k) {
      const K = 160, k2 = K * K;
      const O = k.pt(0, 0);
      const A = g.polar(O, 0.69 * K, g.deg(36)), B = g.polar(O, 0.49 * K, g.deg(57)), C = g.polar(O, 0.775 * K, g.deg(82));
      const M = g.mid(C, A);
      let nv = g.unit(g.perp(g.sub(A, C)));
      if (g.dot(nv, g.sub(M, B)) < 0) nv = g.mul(nv, -1);
      const Mb = g.add(M, g.mul(nv, 0.16 * g.dist(C, A)));
      const arcCA = arcThrough(C, Mb, A);
      const Ab = invP(A, O, k2), Bb = invP(B, O, k2), Cb = invP(C, O, k2);

      k.given('The circle of inversion, with centre O and radius k, and the figure to be inverted: the triangle ABC with one curved side.', () => {
        k.circle(O, K, { cls: 'given' });
        k.point(O, 'O', { at: 'w', open: true });
        k.poly([C, B, A], { cls: 'thick' });
        k.curve(arcCA, [0, 1], { n: 60, cls: 'thick' });
        k.point(A, 'A', { at: 'e', open: true, lo: { dist: 1.3 } });
        k.point(B, 'B', { at: 'sw', open: true, lo: { dist: 1.3 } });
        k.point(C, 'C', { at: 'w', open: true, lo: { dist: 1.3 } });
      });
      k.step('straightedge', 'Draw the lines OA, OB, OC. The inverse of each point lies on its own ray from O.', () => {
        k.seg(O, Ab, { cls: 'cons', dash: true });
        k.seg(O, Bb, { cls: 'cons', dash: true });
        k.seg(O, Cb, { cls: 'cons', dash: true });
      });
      k.step('compass', 'On each ray find the inverse point, with OA · OĀ = OB · OB̄ = OC · OC̄ = k² (the construction of Fig. 123).', () => {
        k.point(Ab, ob('A'), { at: 'se', open: true, lo: { dist: 1.3 } });
        k.point(Bb, ob('B'), { at: 'ne', open: true, lo: { dist: 1.3 } });
        k.point(Cb, ob('C'), { at: 'nw', open: true, lo: { dist: 1.3 } });
      });
      k.step('pencil', 'Invert enough points of each side and join them: the inverse of a segment or an arc is an arc (a circle through O when the side is a straight line), and the figure Ā B̄ C̄ has the same angles as ABC, in the opposite sense.', () => {
        k.curve(invCurve(segF(C, B), O, k2), [0, 1], { n: 80, cls: 'curve' });
        k.curve(invCurve(segF(B, A), O, k2), [0, 1], { n: 80, cls: 'curve' });
        k.curve(invCurve(arcCA, O, k2), [0, 1], { n: 80, cls: 'curve' });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 123(a), page 128 */
  Curves.figure({
    id: 'fig-123a',
    section: 'inversion',
    page: 128,
    title: 'Inverse of A by the tangent and the perpendicular',
    tags: ['inversion', 'construction', 'tangent'],
    note: 'The book draws the tangents AP, AP′ without saying how; the circle on OA as diameter that finds the points of contact is added.',
    build(k) {
      const K = 100, O = k.pt(0, 0), A = k.pt(2 * K, 0);
      const Ab = k.pt(K / 2, 0);
      const T = g.tangentPoints(A, O, K).sort((p, q) => q.y - p.y);       // upper first
      const P = T[0], P2_ = T[1];
      k.given('The circle of inversion, centre O and radius k, and a point A outside it.', () => {
        k.circle(O, K, { cls: 'given' });
        k.point(O, 'O', { at: 'nw', open: true });
        k.point(A, 'A', { at: 'n', open: true });
      });
      k.step('straightedge', 'Draw OA.', () => {
        k.seg(O, A, { cls: 'cons' });
      });
      k.step('compass', 'Draw the circle on OA as diameter: it cuts the circle of inversion at the two points of contact P and P′ of the tangents from A (the angle OPA in a semicircle is a right angle).', () => {
        k.circle(g.mid(O, A), K, { cls: 'aux', dash: true });
        k.point(P, 'P', { at: 'n', open: true });
        k.dot(P2_, { open: true });
      });
      k.step('straightedge', 'Draw the tangents AP and AP′ and the radii OP and OP′ (length k).', () => {
        k.seg(A, P, { cls: 'given' });
        k.seg(A, P2_, { cls: 'given' });
        k.seg(O, P, { cls: 'given' });
        k.seg(O, P2_, { cls: 'given' });
        k.label(g.mid(O, P), 'k', 'w', { dist: 1.2 });
      });
      k.step('straightedge', 'From P draw the perpendicular to OA (the chord PP′). It meets OA at Ā. The right triangles OĀP and OPA are similar, so OĀ / k = k / OA, that is OA · OĀ = k².', () => {
        k.seg(P, P2_, { cls: 'given' });
        k.right(Ab, A, P, { r: 0.9 });
        k.point(Ab, ob('A'), { at: 'ne', open: true, lo: { dist: 1.3 } });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 123(b), page 128 */
  Curves.figure({
    id: 'fig-123b',
    section: 'inversion',
    page: 128,
    title: 'Inverse of A with the compass alone',
    tags: ['inversion', 'construction', 'compass'],
    build(k) {
      const K = 100, O = k.pt(0, 0), A = k.pt(2 * K, 0);
      const hits = g.circleCircle(A, 2 * K, O, K).sort((p, q) => q.y - p.y);   // circle about A through O meets the circle of inversion
      const P = hits[0], Q = hits[1];
      const Ab = g.reflect(O, P, Q);                                           // the circles about P and Q through O meet again at Ā
      const aA = g.angleOf(g.sub(P, A));
      k.given('The circle of inversion, centre O and radius k, and a point A outside it.', () => {
        k.circle(O, K, { cls: 'given' });
        k.point(O, 'O', { at: 'nw', open: true });
        k.point(A, 'A', { at: 'n', open: true });
      });
      k.step('compass', 'Draw the circle about A through O (radius AO). It meets the circle of inversion at P and Q.', () => {
        k.arc(A, 2 * K, aA - 0.18, 2 * PI - aA + 0.18, { cls: 'given' });
        k.point(P, 'P', { at: 'e', open: true, lo: { dist: 1.8 } });
        k.point(Q, 'Q', { at: 'e', open: true, lo: { dist: 1.8 } });
      });
      k.step('compass', 'Keep the compass at the radius k and draw the circles about P and Q through O (PO = QO = k). They meet again at Ā: that is the inverse of A.', () => {
        const aP = g.angleOf(g.sub(O, P)), aP2 = g.angleOf(g.sub(Ab, P));
        k.arc(P, K, aP - 0.2, aP2 + 0.2, { cls: 'given' });
        const aQ = g.angleOf(g.sub(O, Q)), aQ2 = g.angleOf(g.sub(Ab, Q));
        k.arc(Q, K, aQ2 - 0.2, aQ + 0.2, { cls: 'given' });
        k.point(Ab, ob('A'), { at: 'n', open: true, lo: { dist: 1.9 } });
      });
      k.note('Proof: the isosceles triangles OAP (AO = AP, OP = k) and POĀ (PO = PĀ = k) have the same base angle at O, so they are similar: OA / OP = OP / OĀ, hence OA · OĀ = k².', () => {});
    }
  });

  /* ---------------------------------------------------------------- Fig. 124, page 129 */
  Curves.figure({
    id: 'fig-124',
    section: 'inversion',
    page: 129,
    title: 'A parabola inverted at its vertex: the cissoid of Diocles',
    tags: ['inversion', 'parabola', 'cissoid'],
    build(k) {
      const S = 150, h = 0.87, k2 = S * S;
      const O = k.pt(0, 0);
      const par = t => [S * t * t / h, S * t];
      const tc = Math.sqrt((-1 + Math.sqrt(1 + 4 / (h * h))) / (2 / (h * h)));       // where the parabola meets the circle of inversion
      const t0 = 0.55, T = 40;
      const arm = s => u => invCurve(par, O, k2)(s * t0 * Math.pow(T / t0, u));
      k.given('The circle of inversion about the vertex O (k = 1) and the parabola y² = hx.', () => {
        k.axes(O, { x: [0, 1.57 * S], y: [-1.35 * S, 1.56 * S], labels: true });
        k.circle(O, S, { cls: 'cons', dash: true });
        k.curve(par, [-1.06, 1.06], { n: 120, cls: 'given' });
        k.point(O, 'O', { at: 'sw', open: true });
        k.dot(k.pt(...par(tc)), { open: true });
        k.dot(k.pt(...par(-tc)), { open: true });
      });
      k.step('compass', 'Take any point P of the parabola and find its inverse P̄ on the ray OP (Fig. 123). Where the parabola crosses the circle of inversion P and P̄ coincide.', () => {
        samplePair(k, O, k2, k.pt(...par(1.0)), 'P', ob('P'), 'se', 'nw');
      });
      k.step('pencil', 'The inverse curve, through all the inverse points: the cissoid of Diocles y² = hx³ / (1 − hx) (k = 1). It has a cusp at O, where the parabola has its vertex, and the line x = 1/h as asymptote.', () => {
        k.curve(arm(1), [0, 1], { n: 200, cls: 'curve' });
        k.curve(arm(-1), [0, 1], { n: 200, cls: 'curve' });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 125, page 129 */
  Curves.figure({
    id: 'fig-125',
    section: 'inversion',
    page: 129,
    title: 'A rectangular hyperbola inverted at a vertex: the strophoid',
    tags: ['inversion', 'hyperbola', 'strophoid'],
    build(k) {
      const S = 260, a = S / 2, k2 = S * S;
      const O = k.pt(0, 0);
      const right = t => [-a + a * Math.cosh(t), a * Math.sinh(t)];
      const left = t => [-a - a * Math.cosh(t), a * Math.sinh(t)];
      let t0 = 0.02; { const yb = t => Math.abs(invP(k.pt(...right(t)), O, k2).y); while (yb(t0) > 1.17 * S) t0 += 0.004; }
      const hit = k.pt(S / 2, S * Math.sqrt(3) / 2);
      k.given('The circle of inversion about the vertex O (radius 2a) and the rectangular hyperbola (x + a)² − y² = a², with its asymptotes.', () => {
        k.axes(O, { x: [-1.09 * S, 0.63 * S], y: [-1.08 * S, 1.18 * S] });
        k.arc(O, S, PI / 3, 5 * PI / 3, { cls: 'cons', dash: true });
        k.seg(k.pt(-1.18 * S, 0.68 * S), k.pt(0.36 * S, -0.86 * S), { cls: 'given' });
        k.seg(k.pt(-1.18 * S, -0.68 * S), k.pt(0.36 * S, 0.86 * S), { cls: 'given' });
        k.curve(right, [-1.45, 1.45], { n: 120, cls: 'thick' });
        k.curve(left, [-0.95, 0.95], { n: 100, cls: 'thick' });
        k.point(O, 'O', { at: 'sw', open: true });
        k.dot(k.pt(-S, 0), { open: true });
        k.dot(hit, { open: true }); k.dot(k.pt(hit.x, -hit.y), { open: true });
      });
      k.step('compass', 'Take a point P of the hyperbola and find its inverse P̄ on the ray OP. The vertex (−2a, 0) lies on the circle of inversion and so is its own inverse.', () => {
        samplePair(k, O, k2, k.pt(...left(0.55)), 'P', ob('P'), 'ne', 'se');
      });
      k.step('pencil', 'The inverse: the ordinary strophoid. The branch through O goes to the two arms (asymptote x = 2a), the other branch to the loop; the asymptotes of the hyperbola become the tangents of the node at O.', () => {
        k.curve(invCurve(right, O, k2), [t0, 8], { n: 240, cls: 'curve' });
        k.curve(invCurve(right, O, k2), [-8, -t0], { n: 240, cls: 'curve' });
        k.curve(invCurve(left, O, k2), [-7, 7], { n: 420, cls: 'curve' });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 126, page 130 */
  Curves.figure({
    id: 'fig-126',
    section: 'inversion',
    page: 130,
    title: 'A rectangular hyperbola inverted at its centre: the lemniscate',
    tags: ['inversion', 'hyperbola', 'lemniscate'],
    build(k) {
      const S = 150, k2 = S * S;
      const O = k.pt(0, 0);
      const hr = t => [S * Math.cosh(t), S * Math.sinh(t)];
      const hl = t => [-S * Math.cosh(t), S * Math.sinh(t)];
      k.given('The circle of inversion about the centre O (k = 1) and the rectangular hyperbola x² − y² = 1, i.e. r² cos 2θ = 1, with its asymptotes.', () => {
        k.axes(O, { x: [-1.25 * S, 1.44 * S], y: [-1.26 * S, 1.45 * S] });
        k.circle(O, S, { cls: 'cons', dash: true });
        k.seg(k.pt(-1.28 * S, 1.28 * S), k.pt(1.28 * S, -1.28 * S), { cls: 'given' });
        k.seg(k.pt(-1.28 * S, -1.28 * S), k.pt(1.28 * S, 1.28 * S), { cls: 'given' });
        k.curve(hr, [-1.1, 1.1], { n: 100, cls: 'given' });
        k.curve(hl, [-1.1, 1.1], { n: 100, cls: 'given' });
        k.point(O, 'O', { at: 'sw', open: true });
        k.dot(k.pt(S, 0), { open: true }); k.dot(k.pt(-S, 0), { open: true });
      });
      k.step('compass', 'Take a point P of the hyperbola and find its inverse P̄ on the ray OP. The vertices (±1, 0) are on the circle of inversion and are their own inverses.', () => {
        samplePair(k, O, k2, k.pt(...hr(0.7)), 'P', ob('P'), 'se', 'ne');
      });
      k.step('pencil', 'The inverse: the lemniscate of Bernoulli ρ² = cos 2θ. The asymptotes of the hyperbola become its tangents at the node O.', () => {
        k.curve(Curves.curves.lemniscateParam(S), [0, TAU], { n: 360, cls: 'curve' });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 127, page 130: conics inverted at a focus */
  function limacon(k, o) {
    const S = 100, a = o.a, b = o.b, k2 = S * S;
    const O = k.pt(0, 0);
    const rr = t => 1 / (a - b * Math.cos(t));
    const conic = cut => t => { const r = rr(t); return Math.abs(r) > cut ? null : [S * r * Math.cos(t), S * r * Math.sin(t)]; };
    const lim = t => { const r = a - b * Math.cos(t); return [S * r * Math.cos(t), S * r * Math.sin(t)]; };
    const th1 = Math.acos((a - 1) / b);                                    // where ρ = k
    k.given(o.given, () => {
      k.arrow(k.pt(o.x0 * S, 0), k.pt(o.x1 * S, 0), { cls: 'axis' });
      if (o.xl) k.label(k.pt(o.x1 * S, 0), 'X', 'ne', { cls: 'axis' });
      k.circle(O, S, { cls: 'cons', dash: true });
      o.conic(k, S, a, b, conic);
      ring(k, O, 0.065 * S);
      k.dot(k.pt(S * Math.cos(th1), S * Math.sin(th1)), { open: true });
      k.dot(k.pt(S * Math.cos(th1), -S * Math.sin(th1)), { open: true });
      if (o.extraDot) k.dot(k.pt(-S, 0), { open: true });
      k.text(o.capx * S, o.capy * S, o.caption, { upright: true, size: 0.85 });
    });
    k.step('compass', 'Take a point P of the conic and find its inverse P̄ on the ray from the focus (Fig. 123). The points where the conic crosses the circle of inversion are their own inverses.', () => {
      const P0 = o.sample(S);
      samplePair(k, O, k2, P0, 'P', ob('P'), 'se', 'ne');
    });
    k.step('pencil', o.result, () => {
      k.curve(lim, [0, TAU], { n: 400, cls: 'curve' });
    });
  }

  Curves.figure({
    id: 'fig-127a', section: 'inversion', page: 130,
    title: 'A conic inverted at a focus: the limaçon with a > b (an ellipse)',
    tags: ['inversion', 'conic', 'limacon'],
    note: 'The page draws the near vertex of the conic on the left of the focus, which is r = 1/(a − b cos θ); the printed equation has the sign of b reversed, the same curve turned about the focus.',
    build(k) {
      limacon(k, {
        a: 1.25, b: 0.75, x0: -2.0, x1: 2.15, caption: 'a > b', capx: 0, capy: -2.15, capdx: 0,
        given: 'The circle of inversion about the focus (k = 1) and the conic r = 1/(a − b cos θ), here an ellipse (b < a).',
        conic(k, S, a, b, conic) { k.curve(conic(99), [0, TAU], { n: 240, cls: 'given' }); },
        sample: S => { const r = 1 / (1.25 - 0.75 * Math.cos(2.2)); return k.pt(S * r * Math.cos(2.2), S * r * Math.sin(2.2)); },
        result: 'The inverse: the limaçon ρ = a − b cos θ, which for a > b has no inner loop but a dimple at θ = 0.'
      });
    }
  });
  Curves.figure({
    id: 'fig-127b', section: 'inversion', page: 130,
    title: 'A conic inverted at a focus: the limaçon with a = b (a parabola)',
    tags: ['inversion', 'conic', 'limacon', 'cardioid'],
    build(k) {
      limacon(k, {
        a: 1, b: 1, x0: -2.0, x1: 1.15, caption: 'a = b', capx: -0.4, capy: -2.15,
        given: 'The circle of inversion about the focus (k = 1) and the conic r = 1/(a − b cos θ) with a = b: a parabola.',
        conic(k, S, a, b, conic) { k.curve(t => (t < 1.03 || t > TAU - 1.03) ? null : conic(99)(t), [0, TAU], { n: 240, cls: 'given' }); },
        sample: S => { const r = 1 / (1 - Math.cos(2.4)); return k.pt(S * r * Math.cos(2.4), S * r * Math.sin(2.4)); },
        result: 'The inverse: the limaçon ρ = a − a cos θ with a = b, the cardioid, with its cusp at the focus.'
      });
    }
  });
  Curves.figure({
    id: 'fig-127c', section: 'inversion', page: 130,
    title: 'A conic inverted at a focus: the limaçon with a < b (a hyperbola)',
    tags: ['inversion', 'conic', 'limacon', 'hyperbola'],
    build(k) {
      limacon(k, {
        a: 1, b: 2, x0: -3.2, x1: 1.24, xl: true, extraDot: true, caption: 'a < b', capx: 0.55, capy: -2.3,
        given: 'The circle of inversion about the focus (k = 1) and the conic r = 1/(a − b cos θ) with a < b: a hyperbola, with its asymptotes.',
        conic(k, S, a, b, conic) {
          k.curve(conic(2.05), [0, TAU], { n: 800, cls: 'given' });
          const cx = -S * a / (b * b - a * a);                                // centre of the hyperbola
          const dir = g.dir(Math.acos(a / b));
          k.seg(g.sub(k.pt(cx, 0), g.mul(dir, 2.1 * S)), g.add(k.pt(cx, 0), g.mul(dir, 2.1 * S)), { cls: 'given' });
          const dir2 = g.dir(-Math.acos(a / b));
          k.seg(g.sub(k.pt(cx, 0), g.mul(dir2, 2.1 * S)), g.add(k.pt(cx, 0), g.mul(dir2, 2.1 * S)), { cls: 'given' });
        },
        sample: S => { const r = 1 / (1 - 2 * Math.cos(2.0)); return k.pt(S * r * Math.cos(2.0), S * r * Math.sin(2.0)); },
        result: 'The inverse: the limaçon ρ = a − b cos θ with a < b, which has an inner loop through the focus.'
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 128, page 131 */
  Curves.figure({
    id: 'fig-128',
    section: 'inversion',
    page: 131,
    title: 'Confocal central conics inverted at their centre: ovals and figures eight',
    tags: ['inversion', 'conic', 'confocal'],
    build(k) {
      const S = 150, k2 = S * S;
      const O = k.pt(0, 0);
      const bx = 0.75, c = Math.sqrt(1 - bx * bx), A = c / Math.SQRT2;       // ellipse x²/bx² + y² = 1; confocal rectangular hyperbola y² − x² = c²/2
      const ell = t => [S * bx * Math.cos(t), S * Math.sin(t)];
      const hypU = t => [S * A * Math.sinh(t), S * A * Math.cosh(t)];
      const hypL = t => [S * A * Math.sinh(t), -S * A * Math.cosh(t)];
      const xc = Math.sqrt((1 + A * A) / 2), yc = Math.sqrt((1 + A * A) / 2);
      k.given('The circle of inversion about the common centre O (k = 1), a confocal ellipse and a confocal rectangular hyperbola with their foci on the y-axis, and the asymptotes.', () => {
        k.axes(O, { x: [-1.4 * S, 1.58 * S], y: [-2.2 * S, 2.3 * S] });
        k.circle(O, S, { cls: 'cons', dash: true });
        k.seg(k.pt(-1.38 * S, 1.38 * S), k.pt(1.38 * S, -1.38 * S), { cls: 'given' });
        k.seg(k.pt(-1.38 * S, -1.38 * S), k.pt(1.38 * S, 1.38 * S), { cls: 'given' });
        k.curve(ell, [0, TAU], { n: 200, cls: 'given' });
        k.curve(hypU, [-1.78, 1.78], { n: 120, cls: 'given' });
        k.curve(hypL, [-1.78, 1.78], { n: 120, cls: 'given' });
        k.point(O, 'O', { at: 'sw', open: true });
        k.dot(k.pt(0, S * c), { open: true }); k.dot(k.pt(0, -S * c), { open: true });             // the foci
        [-1, 1].forEach(sx => [-1, 1].forEach(sy => k.dot(k.pt(sx * S * xc, sy * S * yc), { open: true })));   // conic meets the circle
        k.dot(k.pt(0, S), { open: true }); k.dot(k.pt(0, -S), { open: true });
      });
      k.step('compass', 'Take a point P of the ellipse and find its inverse P̄ on the ray OP. The ellipse touches the circle of inversion at (0, ±1), and the hyperbola crosses it at four points, which are their own inverses.', () => {
        samplePair(k, O, k2, k.pt(...ell(0.6)), 'P', ob('P'), 'se', 'ne');
      });
      k.step('pencil', 'The inverses: the ellipse gives the oval; each branch of the hyperbola gives one lobe of the figure eight, whose tangents at O are the asymptotes. The other members of the confocal family give the other ovals and figures eight.', () => {
        k.curve(invCurve(ell, O, k2), [0, TAU], { n: 240, cls: 'curve' });
        k.curve(invCurve(hypU, O, k2), [-7, 7], { n: 600, cls: 'curve' });
        k.curve(invCurve(hypL, O, k2), [-7, 7], { n: 600, cls: 'curve' });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 129(a), page 131: Peaucellier cell */
  Curves.figure({
    id: 'fig-129a',
    section: 'inversion',
    page: 131,
    title: 'The Peaucellier cell',
    tags: ['linkage', 'inversor', 'peaucellier', 'inversion'],
    build(k) {
      const b = 270, a = 164, AM = 140;
      const OM = Math.sqrt(b * b - AM * AM), MP = Math.sqrt(a * a - AM * AM);
      const O = k.pt(-OM, 0), P = k.pt(-MP, 0), Q = k.pt(MP, 0), R = k.pt(OM, 0);
      const A = k.pt(0, AM), B = k.pt(0, -AM);
      const D = g.along(A, O, a), C = g.along(A, O, -a);
      const aD = g.angleOf(g.sub(D, A)), aC = g.angleOf(g.sub(C, A));
      k.given('The fixed pivot O, and the bars of the cell: OA = OB = b (long) and AP = PB = BQ = QA = a (the small rhombus APBQ); the bars AR and BR (length b) complete the second rhombus OARB. O, P, Q, R are on one line.', () => {
        k.point(O, 'O', { at: 's', open: true, r: 1.7 });
      });
      k.step('linkage', 'The two long bars OA and OB turn about O.', () => {
        k.seg(O, A, { cls: 'thick' }); k.seg(O, B, { cls: 'thick' });
        k.point(A, 'A', { at: 'nw', open: true, r: 1.7, lo: { dist: 1.3 } });
        k.point(B, 'B', { at: 'se', open: true, r: 1.7, lo: { dist: 1.3 } });
      });
      k.step('linkage', 'The small rhombus APBQ has its corners A and B on the long bars.', () => {
        k.seg(A, P, { cls: 'thick' }); k.seg(A, Q, { cls: 'thick' });
        k.seg(B, P, { cls: 'thick' }); k.seg(B, Q, { cls: 'thick' });
        k.point(P, 'P', { at: 's', open: true, r: 1.7, lo: { dist: 1.3 } });
        k.point(Q, 'Q', { at: 's', open: true, r: 1.7, lo: { dist: 1.3 } });
      });
      k.step('linkage', 'The bars AR and BR close the large rhombus OARB; its fourth corner R is on the line OPQ.', () => {
        k.seg(A, R, { cls: 'thick' }); k.seg(B, R, { cls: 'thick' });
        k.point(R, 'R', { at: 's', open: true, r: 1.7, lo: { dist: 1.3 } });
        k.seg(O, R, { cls: 'cons', dash: true });
      });
      k.note('The inversive property: draw the circle about A through P (radius a; it passes through Q). It cuts the line OA at D and C, with OD = b − a and OC = b + a. By the secant property (OP)(OQ) = (OD)(OC) = (b − a)(b + a) = b² − a². So P and Q are inverse points for the circle about O of radius √(b² − a²), whatever the position of the cell. With directions, (PO)(PR) = −(OP)(OQ) = a² − b².', () => {
        k.seg(A, C, { cls: 'cons', dash: true });
        k.arc(A, a, aD - 0.1, aC + 0.1, { cls: 'cons', dash: true });
        k.point(D, 'D', { at: 'n', open: true, r: 1.7, lo: { dist: 1.3 } });
        k.point(C, 'C', { at: 'se', open: true, r: 1.7, lo: { dist: 1.3 } });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 129(b), page 131: Hart crossed parallelogram */
  Curves.figure({
    id: 'fig-129b',
    section: 'inversion',
    page: 131,
    title: 'The Hart crossed parallelogram',
    tags: ['linkage', 'inversor', 'hart', 'inversion'],
    build(k) {
      const A = k.pt(-204, 0), D = k.pt(204, 0), B = k.pt(-84, 255), C = k.pt(84, 255);
      const t = 0.165;
      const at = (U, V) => g.lerp(U, V, t);
      const O = at(B, A), P = at(B, D), Q = at(C, A), R = at(C, D);
      const Z = g.circumcenter(D, A, P), rZ = g.dist(Z, D);
      const F = g.lineCircle(B, A, Z, rZ).sort((p, q) => g.dist(q, B) - g.dist(p, B)).filter(p => g.dist(p, A) > 1)[0] || g.lineCircle(B, A, Z, rZ)[0];
      const aA = g.angleOf(g.sub(A, Z)), aD = g.angleOf(g.sub(D, Z));
      k.given('The crossed parallelogram of four bars: AB = CD and AC = BD, with the bases AD and BC parallel. The points O, P, Q, R divide the bars AB, BD, AC, CD in the same ratio and lie on a line parallel to the bases.', () => {
        k.seg(A, B, { cls: 'thick' }); k.seg(D, C, { cls: 'thick' });
        k.seg(B, D, { cls: 'thick' }); k.seg(A, C, { cls: 'thick' });
        k.point(A, 'A', { at: 'e', open: true, r: 1.7, lo: { dist: 1.4 } });
        k.point(D, 'D', { at: 'w', open: true, r: 1.7, lo: { dist: 1.4 } });
        k.point(B, 'B', { at: 'nw', open: true, r: 1.7, lo: { dist: 1.2 } });
        k.point(C, 'C', { at: 'ne', open: true, r: 1.7, lo: { dist: 1.2 } });
      });
      k.step('linkage', 'Mark O on AB, P on BD, Q on AC and R on CD at the same fraction of the bars from B and C. O, P, Q, R stay on a line parallel to AD and BC as the linkage is deformed.', () => {
        k.seg(O, R, { cls: 'cons', dash: true });
        k.point(O, 'O', { at: 'w', open: true, r: 1.7, lo: { dist: 1.2 } });
        k.point(P, 'P', { at: 'ne', open: true, r: 1.7, lo: { dist: 1.2 } });
        k.point(Q, 'Q', { at: 'nw', open: true, r: 1.7, lo: { dist: 1.2 } });
        k.point(R, 'R', { at: 'ne', open: true, r: 1.7, lo: { dist: 1.2 } });
      });
      k.note('Draw the circle through D, A, P and Q; it meets AB again at F. By the secant property (BF)(BA) = (BP)(BD). BA, BP, BD are constant, so BF is constant: F is a fixed point of the bar AB. Then (OP)(OQ) = (OF)(OA) is constant: P and Q are inverse points about O.', () => {
        k.arc(Z, rZ, aD - 0.04, aA + 0.04, { cls: 'cons', dash: true });
        k.point(F, 'F', { at: 'w', open: true, r: 1.7, lo: { dist: 1.3 } });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 130(a), page 132: Peaucellier with the extra bar */
  Curves.figure({
    id: 'fig-130a',
    section: 'inversion',
    page: 132,
    title: 'The Peaucellier cell with the extra bar: straight-line motion',
    tags: ['linkage', 'inversor', 'peaucellier', 'line motion'],
    note: 'The book prints no letters on Fig. 130; the letters here are those of Fig. 129, added so that the steps can refer to the points (O′ is the second fixed pivot).',
    build(k) {
      const a = 320, b = 190, d = 170, phi = g.deg(2), alpha = g.deg(31);
      const O = k.pt(0, 0), Op = g.polar(O, d, phi);
      const sP = 2 * d * Math.cos(alpha - phi), e = g.dir(alpha);
      const P = g.mul(e, sP);
      const sQ = (a * a - b * b) / sP, Q = g.mul(e, -sQ);
      const M = g.mul(e, (sP - sQ) / 2), h = Math.sqrt(a * a - Math.pow((sP + sQ) / 2, 2));
      const A = g.add(M, g.mul(g.perp(e), h)), B = g.sub(M, g.mul(g.perp(e), h));
      const u = g.unit(g.sub(Op, O)), w = g.perp(u);                        // the generated line is along w
      const W = 17, RR = 14;
      k.given('The frame: two fixed pivots O and O′, OO′ = d (the bearings are drawn as squares).', () => {
        box(k, O, 30, 22); box(k, Op, 30, 22);
        k.seg(O, Op, { cls: 'cons', dash: true });
        ring(k, O, RR); ring(k, Op, RR);
        k.label(O, 'O', 'sw', { dist: 2.4 }); k.label(Op, 'O′', 'se', { dist: 2.4 });
      });
      k.step('linkage', 'The Peaucellier cell: the short bars OA and OB (length b) and the four bars AP, PB, BQ, QA (length a, a > b) of the rhombus APBQ. O lies between P and Q on the line of symmetry, and OP · OQ = a² − b² (negatively inverse).', () => {
        wideBar(k, O, A, W); wideBar(k, O, B, W);
        wideBar(k, A, P, W); wideBar(k, B, P, W); wideBar(k, A, Q, W); wideBar(k, B, Q, W);
        [A, B, P, Q].forEach(p => ring(k, p, RR));
        ring(k, O, RR);
        k.label(A, 'A', 'nw', { dist: 2.4 }); k.label(B, 'B', 'se', { dist: 2.4 });
        k.label(P, 'P', 'ne', { dist: 2.4 }); k.label(Q, 'Q', 'sw', { dist: 2.4 });
      });
      k.step('linkage', 'The extra bar O′P, of length O′O = d, forces P to move on the circle about O′ that passes through O.', () => {
        wideBar(k, Op, P, W);
        ring(k, Op, RR); ring(k, P, RR);
      });
      k.step('pencil', 'A circle through the centre of inversion inverts into a straight line, so Q, the inverse of P, moves on a straight line perpendicular to OO′: line motion from circular motion.', () => {
        k.seg(g.sub(Q, g.mul(w, 120)), g.add(Q, g.mul(w, 345)), { cls: 'curve' });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 130(b), page 132: Hart with the extra bar */
  Curves.figure({
    id: 'fig-130b',
    section: 'inversion',
    page: 132,
    title: 'The Hart crossed parallelogram with the extra bar: straight-line motion',
    tags: ['linkage', 'inversor', 'hart', 'line motion'],
    note: 'The book prints no letters on Fig. 130; the letters here are those of Fig. 129, added so that the steps can refer to the points (O′ is the second fixed pivot).',
    build(k) {
      const rot = p => g.rot(p, g.deg(2));
      const A = rot(k.pt(-177.5, 0)), D = rot(k.pt(177.5, 0)), B = rot(k.pt(-100.5, 265)), C = rot(k.pt(100.5, 265));
      const t = 0.6, at = (U, V) => g.lerp(U, V, t);
      const O = at(B, A), P = at(B, D), Q = at(C, A);
      const dd = 163;
      const mq = g.mid(O, Q), nq = g.unit(g.perp(g.sub(Q, O)));
      let Op = g.add(mq, g.mul(nq, Math.sqrt(dd * dd - Math.pow(g.dist(O, Q) / 2, 2))));
      if (Op.y > mq.y) Op = g.sub(mq, g.mul(nq, Math.sqrt(dd * dd - Math.pow(g.dist(O, Q) / 2, 2))));
      const u = g.unit(g.sub(Op, O)), w = g.perp(u);
      if (w.x < 0) w.x = -w.x, w.y = -w.y;
      const W = 17, RR = 14;
      k.given('The frame: two fixed pivots O and O′ (the bearings are squares). The bar AB of the Hart linkage turns about O, which is a point of it.', () => {
        box(k, O, 30, 22); box(k, Op, 30, 22);
        k.seg(O, Op, { cls: 'cons', dash: true });
        ring(k, O, RR); ring(k, Op, RR);
        k.label(O, 'O', 'w', { dist: 2.4 }); k.label(Op, 'O′', 'w', { dist: 2.4 });
      });
      k.step('linkage', 'The Hart crossed parallelogram ADCB: AB = CD, AC = BD, with O on AB, P on BD and Q on AC, so that OPQ is parallel to the bases.', () => {
        wideBar(k, A, B, W); wideBar(k, D, C, W); wideBar(k, B, D, W); wideBar(k, A, C, W);
        [A, B, C, D, P, Q].forEach(p => ring(k, p, RR));
        ring(k, O, RR);
        k.label(A, 'A', 'w', { dist: 2.4 }); k.label(D, 'D', 'e', { dist: 2.4 });
        k.label(B, 'B', 'nw', { dist: 2.4 }); k.label(C, 'C', 'ne', { dist: 2.4 });
        k.label(P, 'P', 'se', { dist: 2.2 }); k.label(Q, 'Q', 'ne', { dist: 2.2 });
      });
      k.step('linkage', 'The extra bar O′Q, of length O′O, forces Q to move on the circle about O′ through O.', () => {
        wideBar(k, Op, Q, W);
        ring(k, Op, RR); ring(k, Q, RR);
      });
      k.step('pencil', 'P is the inverse of Q about O, so while Q goes round the circle through O, P moves on a straight line perpendicular to OO′.', () => {
        k.seg(g.sub(P, g.mul(w, 118)), g.add(P, g.mul(w, 168)), { cls: 'curve' });
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 131, page 133 */
  Curves.figure({
    id: 'fig-131',
    section: 'inversion',
    page: 133,
    title: 'Poles and polars: the harmonic set',
    tags: ['inversion', 'polar', 'harmonic'],
    note: 'The page labels the points O, A, P, Ā. The strictly harmonic set on this line is formed by A and Ā with the two ends of the diameter, P and the point opposite P.',
    build(k) {
      const K = 100, O = k.pt(0, 0), OA = 0.55 * K;
      const A = k.pt(OA, 0), P = k.pt(K, 0), Ab = k.pt(K * K / OA, 0);
      const T = g.tangentPoints(Ab, O, K).sort((p, q) => q.y - p.y);
      const T1 = T[0], T2 = T[1];
      k.given('The circle of inversion with centre O and radius k, and the point Ā outside it on the line through O. P is where that line meets the circle.', () => {
        k.circle(O, K, { cls: 'given' });
        k.seg(k.pt(-1.03 * K, 0), Ab, { cls: 'given' });
        k.point(O, 'O', { at: 'n', open: true });
        k.point(P, 'P', { at: 'n', open: true });
        k.point(Ab, ob('A'), { at: 'n', open: true, lo: { dist: 1.3 } });
      });
      k.step('straightedge', 'Draw the two tangents from Ā to the circle, touching it at T1 and T2.', () => {
        k.seg(g.along(Ab, T1, g.dist(Ab, T1) + 0.35 * K), Ab, { cls: 'given' });
        k.seg(g.along(Ab, T2, g.dist(Ab, T2) + 0.35 * K), Ab, { cls: 'given' });
      });
      k.step('straightedge', 'Join the points of contact: the chord T1T2 is the polar of Ā. It cuts the line at A, the inverse of Ā (OA · OĀ = k²), and is perpendicular to it.', () => {
        k.seg(g.along(T1, T2, -0.25 * K), g.along(T2, T1, -0.25 * K), { cls: 'given' });
        k.point(A, 'A', { at: 'n', open: true, lo: { dist: 1.3 } });
        k.right(A, Ab, T1, { r: 0.8 });
      });
      k.note('Since A lies on the polar of Ā, inversion is the theory of poles and polars for the circle. A and Ā divide the diameter through P harmonically: (AP′ / AP) = (ĀP′ / ĀP), where P′ is the other end of the diameter.', () => {
        k.dot(k.pt(-K, 0), { open: true });
        k.label(k.pt(-K, 0), 'P′', 'nw', {});
      });
    }
  });

  /* ---------------------------------------------------------------- Fig. 132, page 133 */
  Curves.figure({
    id: 'fig-132',
    section: 'inversion',
    page: 133,
    title: 'The problem of Apollonius by inversion',
    tags: ['inversion', 'apollonius', 'circles', 'tangent'],
    note: 'The book does not draw the circle of inversion; it is added (light, dashed) because the inverted lines and circle are found with it. The final tangent circle is not drawn in the book either.',
    build(k) {
      const Tc = P2(695, 265), Bc = P2(692, 722), Lc = P2(280, 415);
      const rt = 125, rb = 200, rl = 100;
      const dTB = g.dist(Tc, Bc), add = (dTB - rt - rb) / 2;            // the length a that makes the top and bottom circles touch
      const O = g.along(Tc, Bc, rt + add);                              // their point of contact: the centre of inversion
      const k2 = 125000, K = Math.sqrt(k2);
      const disc = (C, r) => { const pts = []; for (let i = 0; i < 96; i++) pts.push(g.polar(C, r, TAU * i / 96)); return pts; };
      const hatchDisc = (C, r) => { k.hatch(disc(C, r), { angle: 1.0, gap: 0.8, stroke: '#2a2a2a' }); k.circle(C, r, { cls: 'given' }); };
      // the inverse of an enlarged circle through O: a line; of the other one: a circle
      const lineOf = (C, r) => {                                       // far point of the circle from O, inverted: the line is perpendicular to OC
        const dirv = g.unit(g.sub(C, O)), far = g.add(O, g.mul(dirv, 2 * r)), pf = invP(far, O, k2);
        return [pf, g.perp(dirv)];
      };
      const [pT, vT] = lineOf(Tc, rt + add), [pB, vB] = lineOf(Bc, rb + add);
      const dl = g.dist(O, Lc), rL = rl + add;
      const d1 = k2 / (dl - rL), d2 = k2 / (dl + rL), dirL = g.unit(g.sub(Lc, O));
      const cInv = g.add(O, g.mul(dirL, (d1 + d2) / 2)), rInv = Math.abs(d1 - d2) / 2;
      k.given('The three given circles (hatched), none touching the others.', () => {
        hatchDisc(Tc, rt); hatchDisc(Bc, rb); hatchDisc(Lc, rl);
      });
      k.step('compass', 'Increase every radius by the same length a, chosen so that two of the circles (here the top and bottom ones) just touch. Their point of contact is the centre of inversion O.', () => {
        k.circle(Tc, rt + add, { cls: 'given' });
        k.circle(Bc, rb + add, { cls: 'given' });
        k.circle(Lc, rL, { cls: 'given' });
        ring(k, O, 9); k.label(O, 'O', 'e', { dist: 2.2 });
      });
      k.step('compass', 'Choose a circle of inversion about O (the book does not draw it).', () => {
        k.circle(O, K, { cls: 'aux', dash: true });
      });
      k.step('pencil', 'Invert the three enlarged circles. The two that pass through O become parallel straight lines (perpendicular to the line of centres); the third becomes a circle. The circle tangent to these two lines and this circle is easy to draw with straightedge and compass.', () => {
        const lineSeg = (p, v, xl, xr) => k.seg(g.add(p, g.mul(v, (O.x + xl - p.x) / v.x)), g.add(p, g.mul(v, (O.x + xr - p.x) / v.x)), { cls: 'curve' });
        lineSeg(pT, vT, -585, 370);
        lineSeg(pB, vB, -580, 355);
        k.circle(cInv, rInv, { cls: 'curve' });
      });
      k.note('To finish: invert the circle tangent to the two lines and the circle (with respect to the same circle of inversion), then change its radius by a. The result touches the three given circles.', () => {});
    }
  });

  /* ---------------------------------------------------------------- Fig. 133, page 134 */
  Curves.figure({
    id: 'fig-133',
    section: 'inversion',
    page: 134,
    title: 'A cyclic quadrilateral inverted into a line',
    tags: ['inversion', 'theorem', 'cyclic quadrilateral'],
    build(k) {
      const Z = P2(676, 547), R = 386, k2 = 187600;
      const O = g.polar(Z, R, -PI / 2);
      const A = g.polar(Z, R, g.deg(174)), B = g.polar(Z, R, g.deg(77)), C = g.polar(Z, R, g.deg(5));
      const Ab = invP(A, O, k2), Bb = invP(B, O, k2), Cb = invP(C, O, k2);
      k.given('A circle through O, and on it three points A, B, C. The quadrilateral OABC is cyclic, so its opposite angles at B and O add up to π: if the angle at O is θ, the angle at B is π − θ.', () => {
        k.circle(Z, R, { cls: 'given' });
        k.seg(A, B, { cls: 'given' }); k.seg(B, C, { cls: 'given' });
        k.seg(A, O, { cls: 'given' }); k.seg(C, O, { cls: 'given' });
        k.point(A, 'A', { at: 'nw', open: true, lo: { dist: 1.4 } });
        k.point(B, 'B', { at: 'ne', open: true, lo: { dist: 1.3 } });
        k.point(C, 'C', { at: 'e', open: true, lo: { dist: 1.4 } });
        ring(k, O, 13);
      });
      k.step('compass', 'Invert A, B, C with respect to O (the construction of Fig. 123). Ā and C̄ fall on OA and OC; B̄ falls on OB.', () => {
        k.seg(O, B, { cls: 'aux', dash: true });
        k.point(Ab, ob('A'), { at: 'n', open: true, lo: { dist: 1.7 } });
        k.point(Bb, ob('B'), { at: 'n', open: true, lo: { dist: 1.7 } });
        k.point(Cb, ob('C'), { at: 'n', open: true, lo: { dist: 1.7 } });
      });
      k.step('straightedge', 'The circle passes through O, so it inverts into a straight line: Ā, B̄, C̄ are collinear. Draw the line ĀC̄; B̄ lies on it.', () => {
        k.seg(g.along(Ab, Cb, -0.2 * R), g.along(Cb, Ab, -0.2 * R), { cls: 'curve' });
      });
      k.step('compass', 'The lines AB and BC do not pass through O, so they invert into circles through O: the circle through O, Ā, B̄ and the circle through O, B̄, C̄. They meet at B̄ at the angle π − θ, the angle between the lines AB and BC.', () => {
        const c1 = g.circumcenter(O, Ab, Bb), c2 = g.circumcenter(O, Bb, Cb);
        k.circle(c1, g.dist(c1, O), { cls: 'given' });
        k.circle(c2, g.dist(c2, O), { cls: 'given' });
      });
      k.note('As B moves on the circle (to the left), B̄ moves on the line (to the right) and the circles through O, Ā and O, C̄ meet at B̄ at the constant angle π − θ. So the locus of the intersection of circles on the fixed points O, Ā and O, C̄ that meet at a constant angle is the line ĀC̄.', () => {
        k.angle(B, A, C, { n: 2, label: 'π − θ', r: 0.8, labelDist: 1.6 });
        k.angle(O, C, A, { label: 'θ', r: 1.0, labelDist: 2.1 });
        k.arrow(g.add(B, k.pt(-30, 30)), g.add(B, k.pt(-150, 30)), { cls: 'given', headSize: 0.8 });
        k.arrow(g.add(Bb, k.pt(30, -18)), g.add(Bb, k.pt(115, -18)), { cls: 'given', headSize: 0.8 });
      });
    }
  });
})();
