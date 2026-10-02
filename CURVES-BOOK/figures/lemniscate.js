/* Curves Workshop · figures/lemniscate.js — Figs. 140–142 (pages 143–146)
 *
 * Fig. 140(a): the pointwise construction of the lemniscate as a Cassinian curve with foci 2a apart
 * (product of the distances a², vertex OX = a√2, so the curve is r² = 2a² cos 2θ).
 * Fig. 140(b): the lemniscate r² = a² cos 2θ as the cissoid of the circle of radius a/2 about the point O
 * at a√2/2 from its centre: OP = OB − OA = AB.
 * Fig. 141: the tangent (the normal makes 2θ with the radius vector) and the centre of curvature.
 * Fig. 142: the two linkages that draw the lemniscate.
 * Everything is wrapped in a function so that the helpers do not leak into the other figure files.
 */
(function () {
  const g = Curves.g;
  const PI = Math.PI, SQ2 = Math.SQRT2;

  /* the right loop and the node of r² = a² cos 2θ, as a polar function */
  const lemR = a => th => { const c = Math.cos(2 * th); return c < 0 ? null : a * Math.sqrt(c); };
  const lemPt = a => th => { const r = lemR(a)(th); return r == null ? null : [r * Math.cos(th), r * Math.sin(th)]; };

  /* the tangents at the node (the book prints them as the heavy crossing strokes) */
  function nodeTails(k, O, len, o) {
    k.seg(O, g.polar(O, len, g.deg(135)), o);
    k.seg(O, g.polar(O, len, g.deg(225)), o);
  }


  /* a bar as the book draws it: a hollow rounded strip of width w between two pivots */
  function wideBar(k, A, B, w, o) {
    const d = g.unit(g.sub(B, A)), n = g.perp(d), h = w / 2, ang = g.angleOf(n), N = 10, pts = [];
    pts.push(g.add(A, g.mul(n, h)), g.add(B, g.mul(n, h)));
    for (let i = 1; i < N; i++) pts.push(g.polar(B, h, ang - PI * i / N));
    pts.push(g.add(B, g.mul(n, -h)), g.add(A, g.mul(n, -h)));
    for (let i = 1; i < N; i++) pts.push(g.polar(A, h, ang + PI - PI * i / N));
    k.poly(pts, Object.assign({ close: true, cls: 'given' }, o || {}));
  }
  /* a pivot as the book draws it: a white ring with a small ring inside */
  function ring(k, P, r) {
    k.circle(P, r, { cls: 'given', fill: '#fff', target: false });
    k.circle(P, r * 0.4, { cls: 'given', target: false });
  }

  /* a small square round a fixed pivot: the book's sign for a bearing or a slide */
  function box(k, P, h, o) {
    k.poly([k.pt(P.x - h, P.y - h), k.pt(P.x + h, P.y - h), k.pt(P.x + h, P.y + h), k.pt(P.x - h, P.y + h)], Object.assign({ close: true, cls: 'cons' }, o || {}));
  }

  /* Fig. 140(a), page 143 */
  Curves.figure({
    id: 'fig-140a',
    section: 'lemniscate',
    page: 143,
    title: 'The lemniscate as a Cassinian curve: the pointwise construction',
    tags: ['construction', 'compass', 'cassinian', 'foci', 'secant'],
    note: 'The book draws only the radius lines F1P and F2P; the two short arcs that locate P are added so that the construction can be practised.',
    build(k) {
      const a = 100, OX = a * SQ2;
      const O = k.pt(0, 0), F1 = k.pt(-a, 0), F2 = k.pt(a, 0), X = k.pt(-OX, 0);
      const phi = g.deg(28);
      const hits = g.lineCircle(X, g.add(X, g.dir(phi)), O, a);          // the secant from X cuts the circle on F1F2
      const A = hits[0], B = hits[1];                                      // A near X, B far
      const r1 = g.dist(X, B), r2 = g.dist(X, A);                          // XB and XA
      const P = g.circleCircle(F1, r1, F2, r2).sort((p, q) => q.y - p.y)[0];

      k.given('The foci F1 and F2, 2a apart, with their midpoint O, and the point X on the axis with OX = a√2. The curve is to be the locus of P with F1P · F2P = a².', () => {
        k.axes(O, { x: [-1.57 * a, 1.52 * a], y: [-0.66 * a, 1.28 * a], labels: false });
        ring(k, F1, 5.5); k.label(F1, 'F_1', 'se');
        ring(k, F2, 5.5); k.label(F2, 'F_2', 'se');
        k.point(O, 'O', { at: 's', open: true });
        k.point(X, 'X', { at: 'nw', open: true });
      });
      k.step('compass', 'About O draw the circle on F1F2 as diameter (radius a); only the upper half is needed.', () => {
        k.arc(O, a, -0.2, PI + 0.2, { cls: 'cons', dash: true });
      });
      k.step('straightedge', 'Through X draw a secant that cuts the circle at A (the near point) and B (the far one). By the secant property XA · XB = OX² − a² = a².', () => {
        k.seg(X, B, { cls: 'cons' });
        k.point(A, 'A', { at: 'nw', open: true });
        k.point(B, 'B', { at: 'ne', open: true });
      });
      k.step('compass', 'Take F1P = XB and F2P = XA: draw the circle about F1 with radius XB and the circle about F2 with radius XA. They meet at P, so F1P · F2P = XA · XB = a² and P is on the curve.', () => {
        const a1 = g.angleOf(g.sub(P, F1)), a2 = g.angleOf(g.sub(P, F2));
        k.arc(F1, r1, a1 - 0.07, a1 + 0.07, { cls: 'cons' });
        k.arc(F2, r2, a2 - 0.25, a2 + 0.25, { cls: 'cons' });
        k.point(P, 'P', { at: 'ne', open: true });
      });
      k.step('straightedge', 'Join P to the foci: PF1 = XB and PF2 = XA.', () => {
        k.seg(F1, P, { cls: 'cons' });
        k.seg(F2, P, { cls: 'cons' });
      });
      k.step('pencil', 'The lemniscate: repeat with other secants through X (each gives four points by symmetry) and draw the curve through them. It passes through X, through O (a node) and through the mirror point of X.', () => {
        k.curve(Curves.curves.lemniscateParam(OX), [0, 2 * PI], { n: 360, cls: 'curve' });
      });
    }
  });

  /* Fig. 140(b), page 143 */
  Curves.figure({
    id: 'fig-140b',
    section: 'lemniscate',
    page: 143,
    title: 'The lemniscate as a cissoid of a circle',
    tags: ['construction', 'cissoid', 'circle', 'dividers'],
    build(k) {
      const a = 100, rc = a / 2, OC = a * SQ2 / 2;
      const O = k.pt(0, 0), C = k.pt(OC, 0);
      const th = g.deg(26);
      const dir = g.dir(th);
      const hits = g.lineCircle(O, g.add(O, dir), C, rc);
      const A = hits[0], B = hits[1];
      const r = g.dist(A, B);                                              // OP = AB
      const P = g.along(O, B, r);
      const al = Math.abs(g.angle(O, B, C));                               // the angle OBC = α

      k.given('The circle of radius a/2 about C, and the point O at a√2/2 from C on the line of centres; O is the pole.', () => {
        k.line(k.pt(-0.3 * a, 0), k.pt(1.6 * a, 0), { cls: 'cons' });
        k.circle(C, rc, { cls: 'cons', dash: true });
        ring(k, C, 5.5); k.label(C, 'C', 'nw', { dist: 1.6 });
        k.point(O, 'O', { at: 'w', open: true, lo: { dist: 1.4 } });
      });
      k.step('straightedge', 'Through O draw a line at the angle θ with the axis. It cuts the circle at A (near) and B (far).', () => {
        k.seg(O, B, { cls: 'cons', dash: true });
        k.point(A, 'A', { at: 'se', open: true });
        k.point(B, 'B', { at: 'ne', open: true });
      });
      k.step('dividers', 'Carry the chord AB from O along the line: OP = AB, that is, BP = OA. (OP = OB − OA, the cissoid of the circle with respect to O.)', () => {
        k.point(P, 'P', { at: 'n', open: true });
      });
      k.step('pencil', 'The lemniscate r² = a² cos 2θ: the locus of P as the line turns about O. Its tangents at the node O make 45° with the axis.', () => {
        k.curve(t => lemPt(a)(t), [-PI / 4, PI / 4], { n: 240, cls: 'curve' });
        nodeTails(k, O, 0.26 * a, { cls: 'thick' });
      });
      k.note('Why: in the isosceles triangle CAB (CA = CB = a/2) the chord is AB = a cos α, and the sine rule in triangle OCB gives sin α = √2 sin θ. So r = a√(1 − 2 sin²θ), r² = a² cos 2θ.', () => {
        k.angle(O, k.pt(a, 0), B, { label: 'θ', r: 1.6, labelDist: 1.5 });
        k.angle(B, O, C, { label: 'α', r: 1.4, labelDist: 1.5 });
        k.seg(C, B, { cls: 'cons' });
        k.label(g.mid(C, B), 'a/2', 'e', { upright: true, size: 0.85 });
      });
    }
  });

  /* Fig. 141, page 145: tangent and centre of curvature */
  Curves.figure({
    id: 'fig-141',
    section: 'lemniscate',
    page: 145,
    title: 'Tangent and centre of curvature of the lemniscate',
    tags: ['tangent', 'curvature', 'construction', 'protractor'],
    build(k) {
      const a = 100, th = g.deg(23.5);
      const O = k.pt(0, 0);
      const f = lemPt(a);
      const r = lemR(a)(th);
      const P = k.pt(r * Math.cos(th), r * Math.sin(th));
      const Cc = g.centerOfCurvature(f, th);                                 // centre of curvature at P
      const C = k.pt(Cc.x, Cc.y);
      const T = g.along(O, P, 2 * r / 3);                                    // the trisection point farthest from O
      const nrm = g.unit(g.sub(C, P));                                       // the normal, from P towards C
      const tg = g.perp(nrm);

      k.given('The lemniscate r² = a² cos 2θ with its node O and axes, and the point P at the polar angle θ.', () => {
        k.axes(O, { x: [0, 1.12 * a], y: [-0.45 * a, 0.5 * a], labels: false });
        k.curve(t => f(t), [-PI / 4, PI / 4], { n: 240, cls: 'thick' });
        nodeTails(k, O, 0.26 * a, { cls: 'thick' });
        k.point(O, 'O', { at: 'w', open: true });
        k.point(P, 'P', { at: 'ne', open: true });
      });
      k.step('straightedge', 'Draw the radius vector OP; it makes the angle θ with the polar axis.', () => {
        k.seg(O, P, { cls: 'cons' });
        k.angle(O, k.pt(a, 0), P, { label: 'θ', r: 2.4 });
      });
      k.step('protractor', 'The tangent makes the angle ψ = 2θ + π/2 with the radius vector, so the normal makes 2θ with it (and 3θ with the polar axis): at P lay off 2θ from PO and draw the normal.', () => {
        k.seg(g.add(P, g.mul(nrm, -0.1 * a)), g.add(P, g.mul(nrm, 0.85 * a)), { cls: 'cons' });
        k.angle(P, O, C, { label: '2θ', r: 2.2, labelDist: 1.25 });
      });
      k.step('square', 'The tangent is the perpendicular to the normal at P.', () => {
        k.seg(g.add(P, g.mul(tg, -0.28 * a)), g.add(P, g.mul(tg, 0.26 * a)), { cls: 'thick' });
      });
      k.step('dividers', 'Divide OP into three equal parts; T is the division point farthest from O (OT = 2r/3).', () => {
        k.point(T, '', { open: true });
      });
      k.step('square', 'At T draw the perpendicular to OP. It meets the normal at C, the centre of curvature: the projection of R = a²/3r on the radius vector is R cos 2θ = r/3.', () => {
        k.seg(T, C, { cls: 'cons' });
        k.right(T, P, C, { r: 1 });
        ring(k, C, 5.5); k.label(C, 'C', 'e', { dist: 1.6 });
      });
    }
  });

  /* Fig. 142(a), page 146: the linkage with OA = AB = a, BC = CP = OC = a/√2 */
  Curves.figure({
    id: 'fig-142a',
    section: 'lemniscate',
    page: 146,
    title: 'A linkage that draws the lemniscate r² = 2a² cos 2θ',
    tags: ['linkage', 'mechanism'],
    note: 'In the book the bars BC, CP, OC are drawn a little too long for the stated lengths; here they are exactly a/√2, so that the angle BOP is exactly a right angle.',
    build(k) {
      const a = 200, th = g.deg(24);
      const O = k.pt(0, 0), A = k.pt(-a, 0);
      const B = k.pt(-2 * a * Math.sin(th) * Math.sin(th), 2 * a * Math.sin(th) * Math.cos(th));   // OB = 2a sin θ at 90° + θ
      const r = a * Math.sqrt(2 * Math.cos(2 * th));
      const P = k.pt(r * Math.cos(th), r * Math.sin(th));
      const C = g.mid(B, P);
      const f = t => { const c = 2 * a * a * Math.cos(2 * t); return c < 0 ? null : [Math.sqrt(c) * Math.cos(t), Math.sqrt(c) * Math.sin(t)]; };

      k.given('The frame: a horizontal line with two fixed pivots, A and O, with OA = a.', () => {
        k.line(k.pt(-1.3 * a, 0), k.pt(1.2 * a, 0), { cls: 'cons' });
        box(k, A, 21); box(k, O, 21);
        ring(k, A, 13); k.label(A, 'A', 'nw', { dist: 2.6 });
        ring(k, O, 13); k.label(O, 'O', 's', { dist: 2.4 });
      });
      k.step('linkage', 'The bar AB of length a turns about A.', () => {
        wideBar(k, A, B, 17);
        ring(k, A, 13);
        ring(k, B, 13); k.label(B, 'B', 'nw', { dist: 2.4 });
      });
      k.step('linkage', 'The bar BP of length a√2 has its midpoint C pinned to the end of the bar OC, which turns about O (BC = CP = OC = a/√2).', () => {
        wideBar(k, O, C, 17);
        wideBar(k, B, P, 17);
        ring(k, O, 13); ring(k, B, 13);
        ring(k, C, 13); k.label(C, 'C', 'ne', { dist: 2.4 });
        ring(k, P, 13); k.label(P, 'P', 'ne', { dist: 2.4 });
      });
      k.note('C is the circumcentre of the triangle BOP (CB = CO = CP), so the angle BOP is always a right angle. Hence r² = BP² − OB² = 2a² − 4a² sin²θ = 2a² cos 2θ.', () => {
        k.seg(B, O, { cls: 'cons', dash: true });
        k.seg(O, P, { cls: 'cons', dash: true });
        k.label(g.mid(O, P), 'r', 'se', { dist: 1.2 });
        k.angle(O, k.pt(a, 0), P, { label: 'θ', r: 2.2, labelDist: 1.2 });
        k.angle(O, B, A, { label: 'π/2 − θ', r: 2.4, labelDist: 3.3 });
      });
      k.step('pencil', 'As the bar AB turns, P draws the lemniscate r² = 2a² cos 2θ.', () => {
        k.curve(f, [g.deg(44.4), th + 0.0], { n: 120, cls: 'curve' });
        k.curve(f, [-g.deg(44.4), -th], { n: 120, cls: 'curve' });
        nodeTails(k, O, 0.28 * a, { cls: 'thick' });
      });
    }
  });

  /* Fig. 142(b), page 146: the crossed parallelogram, P and O the midpoints of DC and AB */
  Curves.figure({
    id: 'fig-142b',
    section: 'lemniscate',
    page: 146,
    title: 'The crossed parallelogram that draws the lemniscate r² = a² cos 2θ',
    tags: ['linkage', 'mechanism', 'crossed parallelogram'],
    note: 'The book draws AB and DC rather longer than a√2; here AB = DC = a√2 exactly, which is what makes the path of P a true lemniscate.',
    build(k) {
      const a = 200, d = a / SQ2;
      const O = k.pt(0, 0), A = k.pt(-d, 0), B = k.pt(d, 0);
      const C = g.polar(B, a, g.deg(106));                                   // BC = a
      const Dp = g.add(A, g.sub(C, B));                                      // the parallelogram position of D …
      const D = g.reflect(Dp, A, C);                                         // … reflected in AC: the crossed position (AD = a, DC = a√2)
      const P = g.mid(D, C);
      const f = t => { const c = a * a * Math.cos(2 * t); return c < 0 ? null : [Math.sqrt(c) * Math.cos(t), Math.sqrt(c) * Math.sin(t)]; };
      const thP = g.angleOf(g.sub(P, O));

      k.given('The frame: two fixed pivots A and B on a line, AB = a√2, with O the midpoint of AB.', () => {
        k.line(k.pt(-1.3 * a, 0), k.pt(1.35 * a, 0), { cls: 'cons' });
        box(k, A, 21); box(k, B, 21);
        ring(k, A, 13); k.label(A, 'A', 'n', { dist: 3 });
        ring(k, B, 13); k.label(B, 'B', 'e', { dist: 3 });
        k.point(O, 'O', { at: 's', open: true, r: 1.2 });
      });
      k.step('linkage', 'The bars AD and BC, each of length a, turn about A and B.', () => {
        wideBar(k, A, D, 17); wideBar(k, B, C, 17);
        ring(k, A, 13); ring(k, B, 13);
        ring(k, D, 13); k.label(D, 'D', 'se', { dist: 2.4 });
        ring(k, C, 13); k.label(C, 'C', 'nw', { dist: 2.4 });
      });
      k.step('linkage', 'The bar DC of length a√2 joins their free ends and crosses the line AB: AB = DC and AD = BC, a crossed parallelogram. P is the midpoint of DC.', () => {
        wideBar(k, D, C, 17);
        ring(k, D, 13); ring(k, C, 13);
        k.dot(P, { r: 1.6 }); k.label(P, 'P', 'e', { dist: 1.6 });
      });
      k.note('P and O are midpoints of DC and AB, and OP = r. Whatever the position of the bars, r² = a² cos 2θ.', () => {
        k.seg(O, P, { cls: 'cons', dash: true });
        k.label(g.mid(O, P), 'r', 'nw', { dist: 1.3 });
        k.angle(O, B, P, { label: 'θ', r: 2, labelDist: 1.3 });
      });
      k.step('pencil', 'As the bars swing, P draws the loop of the lemniscate (the other loop, on the left, when the bars are reversed).', () => {
        k.curve(t => f(t), [-PI / 4, PI / 4], { n: 240, cls: 'curve' });
        k.seg(g.polar(O, 0.2 * a, g.deg(45)), g.polar(O, 0.2 * a, g.deg(225)), { cls: 'thick' });
        k.seg(g.polar(O, 0.2 * a, g.deg(135)), g.polar(O, 0.2 * a, g.deg(315)), { cls: 'thick' });
      });
    }
  });
})();
