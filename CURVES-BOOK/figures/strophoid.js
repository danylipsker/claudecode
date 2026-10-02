/* Curves Workshop · figures/strophoid.js — Figs. 195–198 (pages 217–219)
 *
 * Fig. 195   the general strophoid of a curve, with respect to O and A
 * Fig. 196   the right strophoid: (a) from the line AB, (b) from the circle of radius a rolling on M
 * Fig. 197   the strophoid as the cissoid of a line and a circle: (a) right, (b) oblique
 * Fig. 198   the carpenter's square that draws the strophoid
 */

/* Fig. 195, page 217 — the general strophoid. Fixed points O and A, a given curve f(x, y) = 0.
   A line through O meets the curve at K; P1 and P2 are the points of that line with
   KP1 = KP2 = KA. Their locus is the general strophoid. */
Curves.figure({
  id: 'fig-195',
  section: 'strophoid',
  page: 217,
  title: 'The general strophoid of a curve with respect to O and A',
  tags: ['strophoid', 'construction', 'compass'],
  note: 'The given curve is freehand in the book. The book draws one position of the line only; the pencil step adds the locus of P1 and P2 for the part of the curve that is drawn.',
  build(k) {
    const g = k.g;
    const U = (px, py) => k.pt((px - 170) / 4, (530 - py) / 4);       // scan pixels → units
    const O = U(170, 530), A = U(945, 437);
    const ctl = [[645, 2], [700, 60], [735, 150], [754, 293], [800, 440], [850, 520], [908, 568]].map(p => U(p[0], p[1]));
    const f = t => {                                                  // a smooth curve through the control points (Catmull–Rom), t in [0, 6]
      const n = ctl.length - 1, i = Math.min(n - 1, Math.max(0, Math.floor(t))), s = t - i;
      const p0 = ctl[Math.max(0, i - 1)], p1 = ctl[i], p2 = ctl[i + 1], p3 = ctl[Math.min(n, i + 2)];
      const c = (a, b, c2, d) => 0.5 * ((2 * b) + (-a + c2) * s + (2 * a - 5 * b + 4 * c2 - d) * s * s + (-a + 3 * b - 3 * c2 + d) * s * s * s);
      return [c(p0.x, p1.x, p2.x, p3.x), c(p0.y, p1.y, p2.y, p3.y)];
    };
    const Kp = k.pt(...f(3));                                         // the control point (754, 293)
    const u = g.unit(g.sub(Kp, O));
    const R = g.dist(Kp, A);
    const P1 = g.sub(Kp, g.mul(u, R)), P2 = g.add(Kp, g.mul(u, R));

    k.given('The fixed points O and A and the given curve f = 0.', () => {
      k.curve(f, [0, 6], { cls: 'thick', n: 160 });
      k.pivot(O); k.label(O, 'O', 'n', { dist: 2.2 });
      k.pivot(A); k.label(A, 'A', 'e', { dist: 2.2 });
      const t = U(642, 14); k.text(t.x, t.y, 'f = 0', { anchor: 'end', upright: true, size: 0.9 });
    });
    k.step('straightedge', 'Draw a line through O. It meets the curve at K.', () => {
      k.seg(O, g.add(P2, g.mul(u, 6)));
      k.point(Kp, 'K', { at: 'nw', open: true, lo: { dist: 1.2 } });
      k.seg(Kp, A, { cls: 'cons', dash: true });
    });
    k.step('compass', 'With the radius KA draw the circle about K. It cuts the line again at P1 and P2, so KP1 = KP2 = KA.', () => {
      k.circle(Kp, R);
      k.point(P1, 'P_1', { at: 'nw', open: true, lo: { dist: 1.4 } });
      k.point(P2, 'P_2', { at: 'w', open: true, lo: { dist: 1.6 } });
    });
    k.step('pencil', 'Repeat with other lines through O: P1 and P2 together trace the general strophoid.', () => {
      const br = s => t => { const p = f(t), v = g.unit(g.sub(k.pt(p[0], p[1]), O)), r = g.dist(k.pt(p[0], p[1]), A); return [p[0] + s * r * v.x, p[1] + s * r * v.y]; };
      k.curve(br(1), [0, 6], { n: 240, nobounds: true });
      k.curve(br(-1), [0, 6], { n: 240, nobounds: true });
    });
  }
});

/* Fig. 196(a), page 217 — the right strophoid from a line. The curve f = 0 is the line AB,
   O is on the perpendicular OA = a to AB. K = OP ∩ AB, and P1, P2 on OK with KP = KA.
   r = a (sec θ ± tan θ) with the pole at O. The line M is the asymptote, at the distance a from A. */
Curves.figure({
  id: 'fig-196a',
  section: 'strophoid',
  page: 217,
  title: 'The right strophoid from a line and a point',
  tags: ['strophoid', 'right strophoid', 'construction'],
  build(k) {
    const g = k.g;
    const a = 100, th = g.deg(35);
    const O = k.pt(0, 0), A = k.pt(a, 0), Mf = k.pt(2 * a, 0);
    const Kp = k.pt(a, a * Math.tan(th));
    const u = g.dir(th), R = g.dist(Kp, A);
    const P1 = g.sub(Kp, g.mul(u, R)), P2 = g.add(Kp, g.mul(u, R));
    const B = k.pt(a, 2 * R);
    const sf = t => { const r = a * (1 / Math.cos(t) - 2 * Math.cos(t)); return [a + r * Math.cos(t), r * Math.sin(t)]; };

    k.given('The line AB, the point O with OA = a perpendicular to AB, and the line M parallel to AB at the distance a from A.', () => {
      k.seg(k.pt(-29, 0), Mf, { cls: 'axis' });
      k.seg(k.pt(a, -24), k.pt(a, 154));
      k.seg(k.pt(2 * a, -34), k.pt(2 * a, 152));
      k.point(O, 'O', { at: 'w', open: true, lo: { dist: 1.2 } });
      k.pivot(A); k.label(A, 'A', 'nw', { dist: 2.0 });
      k.point(Mf, '', { open: true });
      k.text(50, -9, 'a', { size: 0.95 });
      k.text(150, 9, 'a', { size: 0.95 });
    });
    k.step('straightedge', 'Draw a line through O. It meets AB at K, at the angle θ with OA.', () => {
      k.seg(O, P2);
      k.point(Kp, 'K', { at: 'w', open: true, lo: { dist: 1.2 } });
      k.angle(O, A, P1, { label: 'θ', r: 1.7, labelDist: 1.2 });
    });
    k.step('compass', 'The circle about K with the radius KA (it passes through A; its highest point is B). It cuts OK at P1 and P2.', () => {
      k.circle(Kp, R);
      k.point(B, 'B', { at: 'nw', open: true, lo: { dist: 1.3 } });
      k.point(P1, 'P_1', { at: 'nw', open: true, lo: { dist: 1.5 } });
      k.point(P2, 'P_2', { at: 'e', open: true, lo: { dist: 1.4 } });
      k.label(g.lerp(O, P1, 0.55), 'r', 'nw', { dist: 1.6 });
    });
    k.step('pencil', 'Repeat for other lines through O. P1 and P2 trace the right strophoid, a loop between O and A and two branches that approach M.', () => {
      k.curve(sf, [g.deg(-54.5), g.deg(65.5)], { n: 300 });
    });
  }
});

/* Fig. 196(b), page 217 — the right strophoid from a circle of radius a rolling on the line M.
   A (the pole) is a distance a from M; O is a on the other side. The circle of radius a touches M at R;
   the line AR meets the circle again at P. With V = OB ∩ L'P: (OV)(VB) = (VP)², so BP ⟂ OP, the angles
   KPA and KAP are equal, and KP = KA: the situation of Fig. 196(a). r = a (sec θ − 2 cos θ). */
Curves.figure({
  id: 'fig-196b',
  section: 'strophoid',
  page: 217,
  title: 'The right strophoid from a circle rolling on a line',
  tags: ['strophoid', 'right strophoid', 'roulette', 'circle'],
  note: 'The book draws the circle heavy, with a gap where its lettering sits, and does not draw the strophoid; the pencil step adds it. The book\'s rotated dimension lettering is written upright here.',
  build(k) {
    const g = k.g;
    const a = 100, th = g.deg(64), ta = Math.tan(th);
    const A = k.pt(0, 0), O = k.pt(-a, 0), Mf = k.pt(a, 0);
    const B = k.pt(0, a * ta), L2 = k.pt(-a, a * ta), R = k.pt(a, a * ta);
    const rP = a * (1 / Math.cos(th) - 2 * Math.cos(th));
    const P = g.polar(A, rP, th);
    const Kp = k.pt(0, rP / (2 * Math.sin(th)));
    const V = g.add(O, g.mul(g.unit(g.sub(B, O)), a * ta * Math.sin(th)));
    const sf = t => { const r = a * (1 / Math.cos(t) - 2 * Math.cos(t)); return [r * Math.cos(t), r * Math.sin(t)]; };
    k.frame(-140, -70, 150, 330);

    k.given('The line M at the distance a from A, the points A and O on a perpendicular to M (OA = a), and the circle of radius a that touches M at R, with its centre B on the perpendicular through A.', () => {
      k.seg(k.pt(-114, 0), k.pt(123, 0), { cls: 'axis' });
      k.seg(Mf, k.pt(a, 290));
      k.arc(B, a, g.deg(250), g.deg(231 + 360), { cls: 'thick' });
      k.seg(L2, R);
      k.seg(L2, O);
      k.seg(A, B);
      k.pivot(A); k.label(A, 'A', 'nw', { dist: 1.4 });
      k.point(O, 'O', { at: 'nw', open: true, lo: { dist: 1.2 } });
      k.point(Mf, '', { open: true });
      k.point(L2, '', { open: true });
      k.point(B, 'B', { at: 'n', open: true, lo: { dist: 1.2 } });
      k.point(R, 'R', { at: 'e', open: true, lo: { dist: 1.4 } });
      k.text(-50, 0 + 9, 'a', { size: 0.95 });
      k.text(50, 9, 'a', { size: 0.95 });
      k.text(-50, a * ta + 9, 'a', { size: 0.95 });
      k.text(50, a * ta + 9, 'a', { size: 0.95 });
      k.label(k.pt(a, 120), 'M', 'e', { dist: 1.3 });
    });
    k.step('straightedge', 'Draw AR. It meets the circle again at P. The angle RAM is θ, and AP = r.', () => {
      k.seg(A, R);
      k.point(P, 'P', { at: 'se', open: true, lo: { dist: 1.2 } });
      k.angle(A, k.pt(40, 0), P, { label: 'θ', r: 1.5, labelDist: 1.2 });
      k.label(g.lerp(A, P, 0.45), 'r', 'e', { dist: 1.2 });
    });
    k.note('Why P is on the strophoid. Let V be the point where OB meets the chord from the left end L of the diameter to P. Then (OV)(VB) = (VP)², with OV = a tan θ sin θ, VB = a cos θ, VP = a sin θ; so BP is perpendicular to OP.', () => {
      k.seg(O, B, { cls: 'cons', dash: true });
      k.seg(L2, P, { cls: 'cons', dash: true });
      k.seg(B, P, { cls: 'cons', dash: true });
      k.point(V, 'V', { at: 'se', open: true, lo: { dist: 1.2 } });
      k.angle(R, B, A, { label: 'θ', r: 1.3, labelDist: 1.3 });
      k.angle(L2, k.pt(L2.x, L2.y - 50), P, { label: 'θ', r: 1.3, labelDist: 1.3 });
      const mv = g.lerp(V, P, 0.5), mo = g.lerp(O, V, 0.5), mb = g.lerp(V, B, 0.5);
      k.text(-104, a * ta / 2, 'a tan θ', { size: 0.8, anchor: 'end' });
      k.text(mb.x - 4, mb.y + 2, 'a cos θ', { size: 0.8, anchor: 'end' });
      k.text(mv.x + 3, mv.y + 11, 'a sin θ', { size: 0.8, anchor: 'start' });
      k.text(mo.x - 5, mo.y + 3, 'a tan θ sin θ', { size: 0.8, anchor: 'end' });
    });
    k.step('compass', 'K is the point of the perpendicular through A with KA = KP (the angles KAP and KPA are equal, double arcs). The line OP passes through K, which is the situation of Fig. 196(a).', () => {
      k.seg(O, P, { cls: 'cons', dash: true });
      k.point(Kp, 'K', { at: 'w', open: true, lo: { dist: 1.3 } });
      k.angle(A, P, B, { n: 2, r: 2.0 });
      k.angle(P, Kp, A, { n: 2, r: 1.4 });
    });
    k.step('pencil', 'Roll the circle along M (a different R, a different P). P draws the right strophoid r = a(sec θ − 2 cos θ), with the pole A, the node at A and the asymptote M.', () => {
      k.curve(sf, [g.deg(-70), g.deg(70)], { n: 360, nobounds: true });
    });
  }
});

/* Fig. 197(a), page 218 — the right strophoid as the cissoid of the line L and a circle. O is the centre
   of the circle through A (radius a), L is the line through O parallel to AB. E and D are the points where
   AP meets L and the circle. Then ED = a cos 2φ sec φ = AP, so P is on the cissoid of L and the circle. */
Curves.figure({
  id: 'fig-197a',
  section: 'strophoid',
  page: 218,
  title: 'The right strophoid as the cissoid of a line and a circle',
  tags: ['strophoid', 'cissoid', 'circle and line'],
  build(k) {
    const g = k.g;
    const a = 100, th = g.deg(32), ph = g.deg(45) - th / 2;          // θ = 32°, φ = 45° − θ/2
    const O = k.pt(0, 0), A = k.pt(a, 0), Mf = k.pt(2 * a, 0);
    const Kp = k.pt(a, a * Math.tan(th));
    const u = g.dir(th), R = g.dist(Kp, A);
    const P = g.sub(Kp, g.mul(u, R)), P2 = g.add(Kp, g.mul(u, R));
    const D = g.lineCircle(A, P, O, a).find(p => g.dist(p, A) > 1e-6);
    const E = g.lineLine(A, P, O, k.pt(0, 1));
    const sf = t => { const r = a * (1 / Math.cos(t) - 2 * Math.cos(t)); return [a + r * Math.cos(t), r * Math.sin(t)]; };
    const aD = g.angleOf(g.sub(D, O));

    k.given('The centre O and the circle of radius a through A, the line L through O parallel to AB (AB is perpendicular to OA at A), the axis OA and the asymptote at the distance a from A.', () => {
      k.seg(k.pt(-103, 0), k.pt(2 * a, 0), { cls: 'axis' });
      k.circle(O, a, { cls: 'thick' });
      k.seg(k.pt(0, 116), k.pt(0, 22), { cls: 'given', width: 2 });
      k.seg(k.pt(0, -35), k.pt(0, -119), { cls: 'given', width: 2 });
      k.label(k.pt(0, -28), 'L', 'c', { dist: 1.0 });
      k.seg(k.pt(2 * a, -100), k.pt(2 * a, 127));
      k.point(O, 'O', { at: 'sw', open: true, lo: { dist: 1.2 } });
      k.pivot(A); k.label(A, 'A', 'e', { dist: 2.0 });
      k.point(Mf, '', { open: true });
      k.text(50, -9, 'a', { size: 0.95 });
    });
    k.step('straightedge', 'Draw a line from A. It meets L at E and the circle again at D.', () => {
      k.seg(A, D);
      k.point(E, 'E', { at: 'ne', open: true, lo: { dist: 1.2 } });
      k.point(D, 'D', { at: 'nw', open: true, lo: { dist: 1.3 } });
      k.seg(O, D, { cls: 'cons', dash: true });
      k.text((D.x) / 2 - 8, D.y / 2 + 3, 'a', { size: 0.95 });
    });
    k.step('dividers', 'Take the distance ED with the dividers and lay it off from A along AD: AP = ED. P is a point of the strophoid, the cissoid of the line L and the circle.', () => {
      k.point(P, 'P', { at: 'n', open: true, lo: { dist: 1.3 } });
    });
    k.step('compass', 'The same point from the general construction: OP meets the perpendicular AB at K, and the circle about K with the radius KA cuts OK at P (and at P2).', () => {
      k.seg(k.pt(a, -44), k.pt(a, 127));
      k.seg(O, g.add(P2, g.mul(u, 6)));
      k.circle(Kp, R);
      k.point(Kp, 'K', { at: 'nw', open: true, lo: { dist: 1.3 } });
      k.point(P2, '', { open: true });
    });
    k.note('The angles: θ = ∠AOK, φ = ∠OAD, and the central angle DOX is 2φ (as is ∠AKP). Then ED = a cos 2φ sec φ and AP = AK = 2a tan θ sin φ = 2a cot 2φ sin φ, so AP = ED.', () => {
      k.angle(O, A, P, { label: 'θ', r: 2.2, labelDist: 1.2 });
      k.angle(A, P, O, { label: 'φ', r: 2.4, labelDist: 1.2 });
      k.angle(O, D, k.pt(-50, 0), { label: '2φ', r: 2.4, labelDist: 1.2 });
      k.angle(Kp, P, A, { label: '2φ', r: 1.6, labelDist: 1.3 });
    });
    k.step('pencil', 'Repeat with other lines through A. P traces the right strophoid r = a(sec θ ± tan θ) with the pole at O: the loop through O and A and two branches that approach the asymptote.', () => {
      k.curve(sf, [g.deg(-61.5), g.deg(63.2)], { n: 300 });
    });
  }
});

/* Fig. 197(b), page 218 — the oblique strophoid: the line AB is not perpendicular to OA. L is the line through O
   parallel to AB, at the angle α with OA; the circle has the centre O and passes through A. Again ED = AP.
   r = a (sin α − sin θ) csc(α − θ) with the pole at O. */
Curves.figure({
  id: 'fig-197b',
  section: 'strophoid',
  page: 218,
  title: 'The oblique strophoid as the cissoid of a line and a circle',
  tags: ['strophoid', 'oblique strophoid', 'cissoid'],
  build(k) {
    const g = k.g;
    const a = 100, al = g.deg(69), th = g.deg(32);
    const O = k.pt(0, 0), A = k.pt(a, 0), Mf = k.pt(2 * a, 0), Lm = k.pt(-a, 0);
    const dA = g.dir(al);
    const Kp = g.lineLine(O, g.dir(th), A, g.add(A, dA));
    const u = g.dir(th), R = g.dist(Kp, A);
    const P = g.sub(Kp, g.mul(u, R));
    const D = g.lineCircle(A, P, O, a).find(p => g.dist(p, A) > 1e-6);
    const E = g.lineLine(A, P, O, dA);
    const rr = t => a * (Math.sin(al) - Math.sin(t)) / Math.sin(al - t);
    const along = (pt, s) => g.add(pt, g.mul(dA, s));
    k.frame(-124, -136, 228, 142);

    k.given('The centre O and the circle of radius a through A, the line L through O at the angle α with OA, the line AB through A parallel to L, the axis OA and the parallel to L at the distance a beyond A.', () => {
      k.seg(k.pt(-105, 0), k.pt(207, 0), { cls: 'axis' });
      k.circle(O, a, { cls: 'thick' });
      k.seg(along(O, -126), along(O, -71), { cls: 'given', width: 2 });
      k.seg(along(O, -46), along(O, 117), { cls: 'given', width: 2 });
      k.label(along(O, -58), 'L', 'c', { dist: 1.0 });
      k.seg(along(A, -120), along(A, 135));
      k.seg(along(Mf, -125), along(Mf, 78));
      k.seg(k.pt(-a, -125), k.pt(-a, 119), { cls: 'cons' });
      k.point(Lm, '', { open: true });
      k.point(Mf, '', { open: true });
      k.point(O, 'O', { at: 'nw', open: true, lo: { dist: 1.3 } });
      k.pivot(A); k.label(A, 'A', 's', { dist: 2.4 });
      k.text(50, 9, 'a', { size: 0.95 });
      k.angle(O, g.dir(Math.PI), along(O, -1), { label: 'α', r: 2.1, labelDist: 1.2 });
    });
    k.step('straightedge', 'Draw a line from A. It meets L at E and the circle again at D, and the point P of it with AP = ED is a point of the oblique strophoid.', () => {
      k.seg(A, D);
      k.point(E, 'E', { at: 'ne', open: true, lo: { dist: 1.2 } });
      k.point(D, 'D', { at: 'nw', open: true, lo: { dist: 1.3 } });
      k.seg(O, D, { cls: 'cons', dash: true });
      k.text(D.x / 2 - 9, D.y / 2, 'a', { size: 0.95 });
      k.point(P, 'P', { at: 'n', open: true, lo: { dist: 1.3 } });
    });
    k.step('compass', 'The same point from the general construction: OP meets the line AB at K, and the circle about K with the radius KA cuts OK at P.', () => {
      k.seg(O, g.add(Kp, g.mul(u, 12)));
      k.circle(Kp, R);
      k.point(Kp, 'K', { at: 'n', open: true, lo: { dist: 1.4 } });
      k.angle(O, A, P, { label: 'θ', r: 2.2, labelDist: 1.2 });
      k.label(g.lerp(O, P, 0.5), 'r', 'nw', { dist: 1.3 });
    });
    k.step('pencil', 'P traces the oblique strophoid r = a(sin α − sin θ) csc(α − θ), with the pole at O and the node at A. The right strophoid is the case α = 90°.', () => {
      k.curve(t => { const r = rr(t); return [r * Math.cos(t), r * Math.sin(t)]; }, [al - Math.PI + 0.07, al + Math.PI - 0.07], { n: 900, nobounds: true });
    });
  }
});

/* Fig. 198, page 219 — the carpenter's square. The right angle is at Q; the edge QA has length a and its end A
   runs along the line CA while the other edge passes through the fixed point B, BC = a (C the pole, CA ⟂ BC).
   Then AB = a sec θ, CQ ∥ BA, and the path of Q is r = a sec θ − 2a cos θ. */
Curves.figure({
  id: 'fig-198',
  section: 'strophoid',
  page: 219,
  title: "The carpenter's square that draws the strophoid",
  tags: ["carpenter's square", 'mechanical', 'strophoid'],
  note: 'The book does not draw the curve; the pencil step adds the path of Q.',
  build(k) {
    const g = k.g;
    const a = 100, th = g.deg(63);
    const C = k.pt(0, 0), B = k.pt(-a, 0), A = k.pt(0, a * Math.tan(th));
    const Q = g.add(A, g.mul(g.dir(Math.PI + 2 * th), a));
    const uA = g.unit(g.sub(A, Q)), uB = g.unit(g.sub(B, Q));
    const w = 18;
    const Bend = g.add(Q, g.mul(uB, g.dist(Q, B) + 70));
    const F = g.foot(C, A, B), G = g.foot(Q, A, B);
    const e0 = g.add(Bend, g.mul(uA, w)), e1 = Bend;
    const zig = [0.2, 0.4, 0.6, 0.8].map((t, i) => g.add(g.lerp(e0, e1, t), g.mul(uB, (i % 2 ? 4 : -4))));
    const shape = [Q, A, g.add(A, g.mul(uB, w)), g.add(Q, g.mul(g.add(uA, uB), w)), g.add(Bend, g.mul(uA, w)), ...zig, Bend];
    const rectA = [Q, A, g.add(A, g.mul(uB, w)), g.add(Q, g.mul(uB, w))];
    const rectB = [Q, Bend, g.add(Bend, g.mul(uA, w)), g.add(Q, g.mul(uA, w))];
    const ccw = pts => { let s = 0; pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; s += p.x * q.y - q.x * p.y; }); return s > 0 ? pts : pts.slice().reverse(); };
    const rects = [ccw(rectA), ccw(rectB)];
    const outside = (X, Y) => {
      const d = g.sub(Y, X), cuts = [];
      rects.forEach(pg => {
        let t0 = 0, t1 = 1;
        for (let i = 0; i < pg.length && t0 < t1; i++) {
          const p = pg[i], q = pg[(i + 1) % pg.length], e = g.sub(q, p);
          const num = g.cross(e, g.sub(X, p)), den = g.cross(e, d);
          if (Math.abs(den) < 1e-12) { if (num < 0) { t0 = 1; t1 = 0; } continue; }
          const t = -num / den; if (den > 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t);
        }
        if (t0 < t1) cuts.push([t0, t1]);
      });
      cuts.sort((m, n) => m[0] - n[0]);
      const out = []; let t = 0;
      cuts.forEach(([c0, c1]) => { if (c0 > t + 1e-9) out.push([t, c0]); t = Math.max(t, c1); });
      if (t < 1 - 1e-9) out.push([t, 1]);
      return out.map(([s0, s1]) => [g.lerp(X, Y, s0), g.lerp(X, Y, s1)]);
    };
    const seen = (X, Y, o) => outside(X, Y).forEach(([p, q]) => k.seg(p, q, o));
    const sf = t => { const r = a * (1 / Math.cos(t) - 2 * Math.cos(t)); return [r * Math.cos(t), r * Math.sin(t)]; };

    k.given('The line BC with the fixed point B and the pole C (BC = a), and the line CA perpendicular to BC at C. The square will slide with its corner A on CA.', () => {
      k.seg(k.pt(-160, 0), k.pt(185, 0), { cls: 'axis', arrow: 'end' });
      k.seg(C, k.pt(0, 232));
      k.dot(B, { r: 1.2 }); k.label(B, 'B', 's', { dist: 1.4 });
      k.dot(C, { r: 1.2 }); k.label(C, 'C', 's', { dist: 1.4 });
      k.text(-50, 9, 'a', { size: 0.95 });
    });
    k.step('compass', 'Choose A on CA. Q is the point at distance a from A (AQ = a) on the circle that has AB as diameter, so that the angle AQB is a right angle.', () => {
      k.seg(A, B, { cls: 'cons', dash: true });
      k.label(A, 'A', 'ne', { dist: 1.5 });
      const Mab = g.mid(A, B), rr = g.dist(A, B) / 2;
      const aq = g.angleOf(g.sub(Q, Mab));
      k.arc(Mab, rr, aq - 0.3, aq + 0.3, { cls: 'cons' });
      const ap = g.angleOf(g.sub(Q, A));
      k.arc(A, a, ap - 0.2, ap + 0.2, { cls: 'cons' });
    });
    k.step('square', 'Place the carpenter\'s square with its corner at Q: one edge runs from Q to A (length a), the other passes through B.', () => {
      k.seg(Q, A, { cls: 'given' });
      k.seg(Q, g.add(Q, g.mul(uB, g.dist(Q, B) + 70)), { cls: 'given' });
      k.hatch(shape, { gap: 1000, fill: '#fff', outline: true });
      k.poly(shape, { close: true, cls: 'given' });
      k.poly([g.add(Q, g.mul(uA, 8)), g.add(g.add(Q, g.mul(uA, 8)), g.mul(uB, 8)), g.add(Q, g.mul(uB, 8)), Q], { close: true, fill: '#1b1b1b', cls: 'given', nobounds: true });
      k.label(Q, 'Q', 'e', { dist: 1.6 });
      k.dot(B, { r: 1.2 });
      k.text(g.add(g.lerp(A, Q, 0.5), g.mul(uB, -19)).x, g.add(g.lerp(A, Q, 0.5), g.mul(uB, -19)).y, 'a', { size: 0.95 });
    });
    k.step('straightedge', 'Draw CQ (it is parallel to BA). With C as the pole, θ is its angle with CB\'s direction, AB = a sec θ, and CQ = r.', () => {
      k.seg(C, Q, { cls: 'cons', dash: true });
      k.angle(C, k.pt(60, 0), Q, { label: 'θ', r: 2.0, labelDist: 1.2 });
      k.label(g.lerp(C, Q, 0.55), 'r', 'e', { dist: 1.1 });
    });
    k.note('The book also draws the line AB and the perpendiculars to it from C and from Q (the square hides the parts underneath): CQ ∥ AB, so these perpendiculars give the rectangle that shows r = AB − 2 BF.', () => {
      seen(A, B, { cls: 'cons', dash: true });
      seen(C, F, { cls: 'cons', dash: true });
      seen(G, Q, { cls: 'cons', dash: true });
    });
    k.step('pencil', 'As the square slides, Q draws the strophoid r = a sec θ − 2a cos θ, with C as the pole.', () => {
      k.curve(sf, [g.deg(-70), g.deg(70)], { n: 360, nobounds: true });
    });
  }
});
