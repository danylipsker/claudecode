/* HYPER-PROJECTIONS · constructions/descriptive-geometry.js
 *
 * Monge's fold-line drawing: the front view (elevation) above the line xy, the plan below it. A point of space is
 * (x, d, h): x along xy, d the distance in front of the vertical plane V, h the height above the horizontal plane H.
 * Its elevation is (x, h) and its plan (x, -d) on the sheet. Every construction below is computed from such
 * coordinates, so what is drawn is exact; the steps name the tool that makes each stroke.
 *
 *   dg-monge-point           a point in the two planes: the end view, the plane H turned down, the two views on one projector
 *   dg-monge-line            a line in plan and elevation, its horizontal and vertical traces
 *   dg-true-length           the true length and inclination of a line by rotation, checked by the right triangle
 *   dg-plane-traces          the traces of a plane through three points
 *   dg-auxiliary-view        the true shape of an inclined face from a new fold line
 *   dg-development-pyramid   the development of a square pyramid from its true edge length
 *   dg-development-cone      the development of a cone: a sector, and the base circle
 *   dg-line-plane            where a line pierces a triangle (the cutting-plane method) and which part is hidden
 *   dg-two-prisms            a chimney through a roof: the line of intersection of two prisms, and its picture
 *   dg-shadow-point-light    the shadow of a square post under a lamp: a scaled copy about the lamp's foot
 *   dg-shadow-sun            the shadow of the same post under the sun: a translated copy
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180;
  const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
  const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
  const mul3 = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const cross3 = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  const len3 = a => Math.hypot(a[0], a[1], a[2]);
  /* the two views of a point (x, d, h) on the fold-line sheet */
  const el = X => ({ x: X[0], y: X[2] });
  const pl = X => ({ x: X[0], y: -X[1] });
  /* convex hull of {x, y} points (monotone chain) */
  function hull(pts) {
    const p = pts.slice().sort((a, b) => a.x - b.x || a.y - b.y);
    const cr = (o, a, b) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
    const lo = [], up = [];
    p.forEach(q => { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); });
    for (let i = p.length - 1; i >= 0; i--) { const q = p[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    lo.pop(); up.pop(); return lo.concat(up);
  }

  /* ================================================================== dg-monge-point */
  Hyper.construction({
    id: 'dg-monge-point',
    title: 'A point in Monge\'s two planes: from the end view to the fold-line drawing',
    tags: ['Monge', 'fold line', 'elevation', 'plan', 'rabatment'],
    note: 'The left half is the point A seen from the end, looking along the line xy in which the horizontal plane H and the vertical plane V meet; there V and H are the two perpendicular lines. Turning the front half of H down about xy until it lies in V (the arc) puts the plan a exactly below the elevation a′, on one perpendicular to xy. The right half is the finished fold-line drawing, which is all the draughtsman keeps: height above xy for the elevation, depth below xy for the plan.',
    build(k) {
      const g = k.g, d = 35, h = 50, X = 165;
      const O = k.pt(0, 0), A = k.pt(d, h), a = k.pt(d, 0), a1 = k.pt(0, h), ar = k.pt(0, -d);
      k.given('The end view of the two planes, seen along xy: V the vertical line, H the horizontal one, meeting at O (the line xy seen end-on). The point A lies in front of V by d = 35 and above H by h = 50. On the right is the sheet on which the fold-line drawing will be made, with its line xy.', () => {
        k.seg(k.pt(0, -85), k.pt(0, 105), { cls: 'given' });
        k.seg(k.pt(-60, 0), k.pt(95, 0), { cls: 'given' });
        k.label(k.pt(0, 105), 'V', 'ne', { upright: true }); k.label(k.pt(-60, 0), 'H', 'nw', { upright: true });
        k.point(O, 'O', 'sw'); k.point(A, 'A', 'ne');
        k.seg(k.pt(110, 0), k.pt(240, 0), { cls: 'given' });
        k.label(k.pt(240, 0), 'x y', 'ne', { upright: true });
        k.label(k.pt(22, -62), 'front of V', 'e', { upright: true, size: 0.7 });
        k.frame(-70, -95, 330, 115);
      });
      k.step('square', 'Drop the perpendiculars from A to H and to V (set square against the T-square). Their feet are the plan a on H and the elevation a′ on V; A is d = 35 from V and h = 50 from H.', () => {
        k.seg(A, a, { cls: 'cons' }); k.seg(A, a1, { cls: 'cons' });
        k.point(a, 'a', 'se'); k.point(a1, 'a′', 'nw');
        k.dim(a, A, 'h', { side: 'right', dist: 0.9, upright: true, size: 0.8 }); k.dim(a1, A, 'd', { side: 'left', dist: 0.9, upright: true, size: 0.8 });
      });
      k.step('compass', 'Turn the front half of H down about O into the plane of V: with centre O and radius Oa draw the quarter circle from a to the line of V. The plan arrives at a_r, d = 35 below O.', () => {
        k.arc3(O, ar, a, { cls: 'curve' });
        k.point(ar, 'a_r', 'sw');
        k.arrow(g.polar(O, d, -Math.PI / 4 + 0.15), g.polar(O, d, -Math.PI / 4 - 0.05), { cls: 'curve' });
      });
      k.step('tee', 'With the T-square carry the height of a′ and the depth of a_r across to the right, to the place on the sheet where A is to stand.', () => {
        k.seg(a1, k.pt(X, h), { cls: 'cons' }); k.seg(ar, k.pt(X, -d), { cls: 'cons' });
      });
      k.step('square', 'Where A is to stand, draw the vertical projector (set square on the T-square) across xy. The elevation and the plan are on it.', () => {
        k.seg(k.pt(X, -85), k.pt(X, 105), { cls: 'cons' });
      });
      k.step('pencil', 'Mark the elevation a′ at height 50 above xy and the plan a at depth 35 below it. These two points, on one perpendicular to xy, are the whole drawing of the point A.', () => {
        k.point(k.pt(X, h), 'a′', 'ne'); k.point(k.pt(X, -d), 'a', 'se');
        k.seg(k.pt(X - 8, 0), k.pt(X + 8, 0), { cls: 'thick' });
      });
      k.note('Where the pair stands tells where the point is. a′ above xy, a below: first quadrant (in front of V, above H). Both above: behind V, above H (second). a′ below, a above: behind V, below H (third). Both below: in front of V, below H (fourth).', () => {
        k.text(X + 14, 80, 'a′ above xy, a below: 1st quadrant', { anchor: 'start', size: 0.6, upright: true });
        k.text(X + 14, -75, 'a′ below xy, a above: 3rd quadrant', { anchor: 'start', size: 0.6, upright: true });
      });
    }
  });

  /* ================================================================== dg-monge-line */
  Hyper.construction({
    id: 'dg-monge-line',
    title: 'A line in plan and elevation, and its two traces',
    tags: ['Monge', 'line', 'traces'],
    note: 'The line AB is given by the views a′b′ (above xy) and ab (below). Extended, it leaves the first quadrant where it meets a plane: at the horizontal trace H_t where it pierces H (its height is zero, so its elevation h′ is on xy) and at the vertical trace V_t where it pierces V (its depth is zero, so its plan v is on xy). Beyond V_t it is behind V; beyond H_t it is below H.',
    build(k) {
      const g = k.g, A = [20, 10, 50], B = [80, 40, 20];
      const at = t => add3(A, mul3(sub3(B, A), t));
      const tH = A[2] / (A[2] - B[2]), tV = -A[1] / (B[1] - A[1]);
      const Ht = at(tH), Vt = at(tV);
      const a1 = el(A), b1 = el(B), a = pl(A), b = pl(B);
      const xy0 = k.pt(-45, 0), xy1 = k.pt(170, 0);
      k.given('The sheet with the line xy, and the point A by its views a′ (above) and a (below), the point B by b′ and b. The line AB is joined in both views.', () => {
        k.seg(xy0, xy1, { cls: 'given' }); k.label(xy1, 'x y', 'ne', { upright: true });
        [[A, 'a'], [B, 'b']].forEach(([P, n]) => { k.point(el(P), n + '′', 'ne'); k.point(pl(P), n, 'se'); k.seg(el(P), pl(P), { cls: 'aux', dotted: true }); });
        k.seg(a1, b1, { cls: 'given' }); k.seg(a, b, { cls: 'given' });
        k.frame(-50, -80, 175, 80);
      });
      k.step('straightedge', 'Extend both views of the line right across the sheet: a′b′ and ab are the elevation and the plan of the whole line, not only of the segment AB.', () => {
        k.line(a1, b1, { cls: 'cons' }); k.line(a, b, { cls: 'cons' });
      });
      k.step('square', 'The horizontal trace. The line is in H where its height is zero: the elevation a′b′ meets xy at h′. From h′ drop the projector (set square) to the plan: it meets ab at h, the plan of the trace H_t.', () => {
        k.point(el(Ht), 'h′', 'ne'); k.seg(el(Ht), pl(Ht), { cls: 'cons' }); k.point(pl(Ht), 'h', 'se');
      });
      k.step('square', 'The vertical trace. The line is in V where its depth is zero: the plan ab meets xy at v. From v raise the projector to the elevation: it meets a′b′ at v′, the elevation of the trace V_t.', () => {
        k.point(pl(Vt), 'v', 'se'); k.seg(pl(Vt), el(Vt), { cls: 'cons' }); k.point(el(Vt), 'v′', 'nw');
      });
      k.step('pencil', 'Line in the part between the traces, v′ to h′ above and v to h below: it is the part of the line in the first quadrant, in front of V and above H, and it contains the segment AB.', () => {
        k.seg(el(Vt), el(Ht), { cls: 'thick' }); k.seg(pl(Vt), pl(Ht), { cls: 'thick' });
      });
      k.note('Past v′ the line goes behind V (above H); past h it goes below H (in front of V). The sign of a point tells its quadrant at once: above xy in the elevation means above H, below xy in the plan means in front of V.', () => {
        k.text(-5, 78, 'behind V', { size: 0.65, upright: true, anchor: 'end' });
        k.text(150, -56, 'below H', { size: 0.65, upright: true, anchor: 'start' });
      });
    }
  });

  /* ================================================================== dg-true-length */
  Hyper.construction({
    id: 'dg-true-length',
    title: 'The true length of a line: rotation, then the right triangle',
    tags: ['true length', 'rotation', 'inclination', 'right triangle'],
    note: 'Both views of AB are shorter than AB itself, because the line is inclined to H and to V. Rotating it about the vertical through A until it is parallel to V changes nothing about its height (so b′ slides along a horizontal) and nothing about its plan length (so b swings on an arc), and the new elevation is a true length. The right triangle method needs no rotation: its legs are the plan length and the difference of the heights, and its hypotenuse is the true length, with the angle to H at A.',
    build(k) {
      const g = k.g, A = [20, 15, 55], B = [95, 55, 25];
      const a1 = el(A), b1 = el(B), a = pl(A), b = pl(B);
      const planLen = g.dist(a, b), dh = Math.abs(A[2] - B[2]);
      const L = len3(sub3(B, A)), alpha = Math.atan2(dh, planLen);
      const bR = k.pt(a.x + planLen, a.y);                 // b swung round to the horizontal through a
      const b1R = k.pt(bR.x, b1.y);
      const dirAB = g.unit(g.sub(b, a)), n = k.pt(dirAB.y, -dirAB.x);
      const nn = (n.y < 0) ? n : k.pt(-n.x, -n.y);          // perpendicular pointing down the sheet
      const q = g.add(b, g.mul(nn, dh));
      k.given('The sheet with the line xy and the line AB given by its views a′b′ and ab. Neither is the true length: ab = ' + planLen.toFixed(1) + ' and a′b′ = ' + g.dist(a1, b1).toFixed(1) + '.', () => {
        k.seg(k.pt(-30, 0), k.pt(150, 0), { cls: 'given' }); k.label(k.pt(150, 0), 'x y', 'ne', { upright: true });
        k.point(a1, 'a′', 'nw'); k.point(b1, 'b′', 'sw'); k.point(a, 'a', 'nw'); k.point(b, 'b', 'ne');
        k.seg(a1, a, { cls: 'aux', dotted: true }); k.seg(b1, b, { cls: 'aux', dotted: true });
        k.seg(a1, b1, { cls: 'given' }); k.seg(a, b, { cls: 'given' });
        k.frame(-35, -135, 150, 75);
      });
      k.step('compass', 'Rotation in the plan. With centre a and radius ab swing b round to b_r on the horizontal through a: ab_r is parallel to xy. The line AB has been turned about the vertical through A until it is parallel to V.', () => {
        k.arc3(a, b, bR, { cls: 'curve' });
        k.seg(a, bR, { cls: 'cons' });
        k.point(bR, 'b_r', 'se');
      });
      k.step('tee', 'In the elevation the point B has not changed its height: with the T-square draw the horizontal through b′.', () => {
        k.seg(b1, k.pt(bR.x + 12, b1.y), { cls: 'cons' });
      });
      k.step('square', 'Raise the projector from b_r (set square on the T-square); it meets that horizontal at b′_r, the new elevation of B.', () => {
        k.seg(bR, b1R, { cls: 'cons' });
        k.point(b1R, 'b′_r', 'e');
      });
      k.step('pencil', 'Join a′ to b′_r: a′b′_r = ' + L.toFixed(1) + ' is the true length of AB, and its angle with the horizontal is the inclination of AB to H, α = ' + (alpha / D2R).toFixed(1) + '°.', () => {
        k.seg(a1, b1R, { cls: 'thick' });
        k.angle(a1, b1R, k.pt(a1.x + 40, a1.y), { label: 'α', r: 2.2 });
      });
      k.step('dividers', 'Check by the right triangle. In the plan, carry the difference of the heights, ' + dh.toFixed(0) + ' (from the elevation, between the levels of a′ and b′), to a perpendicular to ab at b.', () => {
        k.seg(b, q, { cls: 'cons' });
        k.right(b, a, q, { r: 0.9 });
        k.point(q, 'q', 'sw');
      });
      k.step('straightedge', 'The hypotenuse aq is the true length again, ' + g.dist(a, q).toFixed(1) + ', and the angle at a is α. No rotation was needed, only the plan and the height difference.', () => {
        k.seg(a, q, { cls: 'thick' });
        k.angle(a, q, b, { label: 'α', r: 3 });
      });
    }
  });

  /* ================================================================== dg-plane-traces */
  Hyper.construction({
    id: 'dg-plane-traces',
    title: 'The traces of a plane through three points',
    tags: ['plane', 'traces', 'Monge'],
    note: 'The horizontal trace of a plane is the line in which it meets H, the vertical trace the line in which it meets V. A line lying in the plane has its own traces on those two lines: find the traces of two lines of the plane and join them. The two traces of a plane always meet on xy (here at the intercept x = 100), unless the plane is parallel to it.',
    build(k) {
      const g = k.g, ax = 100, bd = 70, ch = 60;
      const hOf = (x, d) => ch * (1 - x / ax - d / bd);
      const A = [30, 14, hOf(30, 14)], B = [60, 7, hOf(60, 7)], C = [15, 35, hOf(15, 35)];
      const at = (P, Q, t) => add3(P, mul3(sub3(Q, P), t));
      const traces = (P, Q) => ({ H: at(P, Q, P[2] / (P[2] - Q[2])), V: at(P, Q, -P[1] / (Q[1] - P[1])) });
      const tAB = traces(A, B), tAC = traces(A, C);
      const xy0 = k.pt(-40, 0), xy1 = k.pt(135, 0);
      const X = k.pt(ax, 0);
      k.given('The sheet with xy, and the plane given by the triangle ABC: the elevation a′b′c′ above xy and the plan abc below.', () => {
        k.seg(xy0, xy1, { cls: 'given' }); k.label(xy1, 'x y', 'ne', { upright: true });
        [[A, 'a'], [B, 'b'], [C, 'c']].forEach(([P, n]) => { k.point(el(P), n + '′', 'ne'); k.point(pl(P), n, 'se'); k.seg(el(P), pl(P), { cls: 'aux', dotted: true }); });
        k.poly([el(A), el(B), el(C)], { close: true, cls: 'given' }); k.poly([pl(A), pl(B), pl(C)], { close: true, cls: 'given' });
        k.frame(-45, -100, 150, 80);
      });
      k.step('straightedge', 'Take two lines of the plane, AB and AC. Extend the views a′b′, ab and a′c′, ac across the sheet.', () => {
        k.seg(el(A), el(tAB.H), { cls: 'cons' }); k.seg(pl(A), pl(tAB.H), { cls: 'cons' });
        k.seg(el(tAC.V), el(tAC.H), { cls: 'cons', dash: true }); k.seg(pl(tAC.V), pl(tAC.H), { cls: 'cons', dash: true });
      });
      k.step('square', 'Vertical traces. Where each plan meets xy (v_1 for AB, v_2 for AC), raise the projector (set square) to the elevation of the same line: v′_1 and v′_2 are points of the vertical trace of the plane.', () => {
        [[tAB.V, 'v_1'], [tAC.V, 'v_2']].forEach(([T, n]) => { k.point(pl(T), n, 'sw'); k.seg(pl(T), el(T), { cls: 'cons' }); k.point(el(T), n.replace('v_', 'v′_'), 'nw'); });
      });
      k.step('square', 'Horizontal traces. Where each elevation meets xy (h′_1, h′_2), drop the projector to the plan of the same line: h_1 and h_2 are points of the horizontal trace of the plane.', () => {
        [[tAB.H, 'h_1'], [tAC.H, 'h_2']].forEach(([T, n]) => { k.point(el(T), n.replace('h_', 'h′_'), 'nw'); k.seg(el(T), pl(T), { cls: 'cons' }); k.point(pl(T), n, 'ne'); });
      });
      k.step('straightedge', 'Join v′_1 to v′_2: the vertical trace V_t of the plane. Join h_1 to h_2: the horizontal trace H_t. Both end on xy, at the same point X = ' + ax + ' — the check that the drawing is right.', () => {
        k.seg(X, k.pt(0, ch), { cls: 'thick' }); k.seg(pl(tAC.H), pl(tAB.H), { cls: 'thick' });
        k.point(X, 'X', 'nw');
        k.label(el(tAC.V), 'V_t', 'nw', { upright: true }); k.label(pl(tAC.H), 'H_t', 'nw', { upright: true });
      });
    }
  });

  /* ================================================================== dg-auxiliary-view */
  Hyper.construction({
    id: 'dg-auxiliary-view',
    title: 'An auxiliary view: the true shape of an inclined face',
    tags: ['auxiliary view', 'true shape', 'new fold line'],
    note: 'The hexagonal prism stands on H and is cut by a plane that is perpendicular to V, so the cut face is seen edge-on in the elevation but foreshortened in the plan. A new plane parallel to the face and perpendicular to V has its own fold line x1y1 parallel to the edge-on face. Distances measured from V are the same in the plan and in the new view, so each depth is taken from the plan with the dividers and laid off from x1y1, on the perpendicular from the elevation.',
    build(k) {
      const g = k.g, r = 36, cx = 100, cd = 62, al = 30 * D2R, z0 = 40, gap = 28;
      const hexs = [0, 1, 2, 3, 4, 5].map(i => { const t = i * 60 * D2R, x = cx + r * Math.cos(t), d = cd + r * Math.sin(t); return { x, d, z: z0 + (x - (cx - r)) * Math.tan(al) }; });
      const E = hexs.map(v => k.pt(v.x, v.z)), Pn = hexs.map(v => k.pt(v.x, -v.d));
      const u = k.pt(Math.cos(al), Math.sin(al)), n = k.pt(-Math.sin(al), Math.cos(al));
      const F0 = g.add(E[3], g.mul(n, gap));
      const F = E.map(e => g.add(e, g.mul(n, gap)));
      const Aux = hexs.map((v, i) => g.add(F[i], g.mul(n, v.d)));
      const xL = cx - r, xR = cx + r;
      k.given('The prism seen from the front above xy (the sloping top is the cut face, seen edge-on) and from above below xy (a regular hexagon 1 … 6 of circumradius 36). The cut plane rises at 30° and is perpendicular to V.', () => {
        k.seg(k.pt(40, 0), k.pt(170, 0), { cls: 'given' }); k.label(k.pt(170, 0), 'x y', 'ne', { upright: true });
        k.poly([Pn[0], Pn[1], Pn[2], Pn[3], Pn[4], Pn[5]], { close: true, cls: 'given' });
        Pn.forEach((p, i) => k.point(p, String(i + 1), ['e', 'se', 'sw', 'w', 'nw', 'ne'][i]));
        k.poly([k.pt(xL, 0), k.pt(xR, 0), E[0], E[3]], { close: true, cls: 'given' });
        [1, 2].forEach(i => k.seg(k.pt(hexs[i].x, 0), E[i], { cls: 'cons' }));
        [[3, '4′', 'nw'], [0, '1′', 'ne'], [2, '3′ 5′', 'n'], [1, '2′ 6′', 'n']].forEach(([i, t, at]) => k.point(E[i], t, at, { lo: { size: 0.75 } }));
        hexs.forEach((v, i) => k.seg(E[i], Pn[i], { cls: 'aux', dotted: true }));
        k.frame(-25, -105, 190, 175);
      });
      k.step('square', 'Draw the new fold line x1y1 parallel to the edge-on face and ' + gap + ' away from it, on the side away from the prism (slide the set square along the ruler to get the parallel).', () => {
        k.line(F[3], F[0], { cls: 'thick' });
        k.label(F[3], 'x_1 y_1', 'w', { upright: true });
      });
      k.step('square', 'From each point of the face in the elevation draw a perpendicular to x1y1 and carry it on beyond (the projectors of the new view). The pairs 2′, 6′ and 3′, 5′ share a projector, as they do a vertical in the plan.', () => {
        E.forEach((e, i) => k.seg(e, g.add(F[i], g.mul(n, 100)), { cls: 'cons' }));
      });
      k.step('dividers', 'Depths. The distance of each plan point from xy is its depth from V. Take it with the dividers from the plan and lay it off from x1y1 along the projector of the same point: that fixes 1 … 6 in the new view.', () => {
        Aux.forEach((p, i) => k.point(p, String(i + 1), ['e', 'e', 'w', 'w', 'w', 'e'][i]));
      });
      k.step('pencil', 'Join 1 … 6 in order: the hexagon is the true shape of the cut face. The side across the slope is ' + (2 * r * Math.sin(Math.PI / 3)).toFixed(0) + ' as before, but the side along the slope is ' + (g.dist(Aux[0], Aux[3])).toFixed(1) + ', which is 72 / cos 30°: the plan showed it too short by cos 30°.', () => {
        Aux.forEach((p, i) => k.seg(p, Aux[(i + 1) % Aux.length], { cls: 'thick' }));
      });
    }
  });

  /* ================================================================== dg-development-pyramid */
  Hyper.construction({
    id: 'dg-development-pyramid',
    title: 'The development of a square pyramid',
    tags: ['development', 'pyramid', 'true length', 'pattern'],
    note: 'The pyramid stands on H with a diagonal of its base parallel to V, so the outline edges o′1′ and o′3′ of the elevation are edges parallel to V and show the true length L of the lateral edges. All four lateral faces are isosceles triangles with sides L, L and s, so the pattern is a fan of four triangles about the apex: an arc of radius L stepped four times by the base edge s. The base is attached to one side.',
    build(k) {
      const g = k.g, s = 60, hgt = 70, c = s / Math.SQRT2;
      const L = Math.hypot(c, hgt), delta = 2 * Math.asin(s / (2 * L));
      const o1 = k.pt(0, hgt), p1 = k.pt(-c, 0), p3 = k.pt(c, 0), p24 = k.pt(0, 0);
      const cen = k.pt(0, -60), q1 = k.pt(-c, -60), q2 = k.pt(0, -60 - c), q3 = k.pt(c, -60), q4 = k.pt(0, -60 + c);
      const Od = k.pt(215, 95);
      const B = [0, 1, 2, 3, 4].map(i => g.polar(Od, L, -Math.PI / 2 + (i - 2) * delta));
      const mid = g.mid(B[1], B[2]), out = g.unit(g.sub(mid, Od));
      const S3 = g.add(B[2], g.mul(out, s)), S4 = g.add(B[1], g.mul(out, s));
      k.given('The elevation above xy (the outline o′1′3′) and the plan below (the diamond 1 2 3 4 with the apex o at its centre). The base is a square of side s = 60 and the height is 70; the diagonal 1–3 is parallel to xy.', () => {
        k.seg(k.pt(-70, 0), k.pt(70, 0), { cls: 'given' }); k.label(k.pt(70, 0), 'x y', 'ne', { upright: true });
        k.poly([p1, o1, p3], { cls: 'given' });
        k.point(o1, 'o′', 'n'); k.point(p1, '1′', 'sw'); k.point(p3, '3′', 'se'); k.point(p24, '2′ 4′', 's', { lo: { upright: true, size: 0.7 } });
        k.poly([q1, q2, q3, q4], { close: true, cls: 'given' });
        k.seg(q1, q3, { cls: 'cons', dash: true }); k.seg(q2, q4, { cls: 'cons', dash: true });
        k.point(q1, '1', 'w'); k.point(q2, '2', 's'); k.point(q3, '3', 'e'); k.point(q4, '4', 'n'); k.point(cen, 'o', 'ne', { lo: { upright: false } });
        k.dim(q2, q3, 's', { side: 'left', dist: 0.9, upright: true });
        k.frame(-85, -125, 300, 120);
      });
      k.step('dividers', 'True length. The edges o′1′ and o′3′ are parallel to V (their plan o1, o3 is parallel to xy), so they are drawn in true length: L = ' + L.toFixed(1) + '. Take it between the points of the dividers.', () => {
        k.seg(o1, p1, { cls: 'thick' }); k.seg(o1, p3, { cls: 'thick' });
        k.dim(p1, o1, 'L', { side: 'left', dist: 0.9, upright: true });
      });
      k.step('compass', 'Choose the apex O of the pattern, away from the views, and with the compass set to L draw a long arc below it: all the lateral edges lie on it.', () => {
        k.point(Od, 'O', 'n');
        k.arc(Od, L, -Math.PI / 2 - delta * 2.4, -Math.PI / 2 + delta * 2.4, { cls: 'curve' });
      });
      k.step('dividers', 'Take the base edge s = 60 (the side 2–3 of the plan) in the dividers and step it four times along the arc from a starting point B₀. B₀ … B₄ are the ends of the lateral edges.', () => {
        B.forEach((p, i) => k.point(p, 'B_' + i, i < 2 ? 'sw' : i > 2 ? 'se' : 's'));
      });
      k.step('straightedge', 'Join O to each point B and join the neighbouring points B₀B₁, B₁B₂, B₂B₃, B₃B₄. The four isosceles triangles of sides L, L, s are the four lateral faces.', () => {
        B.forEach(p => k.seg(Od, p, { cls: 'cons' }));
        for (let i = 0; i < 4; i++) k.seg(B[i], B[i + 1], { cls: 'cons' });
      });
      k.step('square', 'Attach the base to the edge B₁B₂ (set square for the perpendiculars at B₁ and B₂, dividers for the length s): it is a true square of side s.', () => {
        k.seg(B[2], S3, { cls: 'cons' }); k.seg(B[1], S4, { cls: 'cons' }); k.seg(S3, S4, { cls: 'cons' });
      });
      k.step('fold', 'Draw the outline heavily and the edges to be creased dashed. Cut along the outline, crease on the dashed lines, and the four faces and the base fold into the pyramid.', () => {
        k.poly([Od, B[0], B[1], S4, S3, B[2], B[3], B[4]], { close: true, cls: 'thick' });
        [B[1], B[2], B[3]].forEach(p => k.seg(Od, p, { cls: 'cons', dash: true }));
        k.seg(B[1], B[2], { cls: 'cons', dash: true });
      });
    }
  });

  /* ================================================================== dg-development-cone */
  Hyper.construction({
    id: 'dg-development-cone',
    title: 'The development of a cone: a sector and its base circle',
    tags: ['development', 'cone', 'sector', 'protractor'],
    note: 'The outline edges of the elevation are generators parallel to V, so they show the true slant length L. A cone develops into a sector of radius L whose arc has the length of the base circle, 2πr, so its angle is φ = 360° r / L. Stepping the chord of one twelfth of the base along the arc twelve times is the draughtsman\'s shortcut, but it gives 132.4° here instead of 133.7°: a chord is shorter than its arc, so lay off φ with the protractor and divide the arc into twelve by dividing the angle.',
    build(k) {
      const g = k.g, r = 40, hgt = 100, L = Math.hypot(r, hgt), phi = 2 * Math.PI * r / L;
      const o1 = k.pt(0, hgt), p1 = k.pt(-r, 0), p3 = k.pt(r, 0), cen = k.pt(0, -60);
      const Od = k.pt(215, 105);
      const a0 = -Math.PI / 2 - phi / 2, a1 = -Math.PI / 2 + phi / 2;
      const E0 = g.polar(Od, L, a0), E1 = g.polar(Od, L, a1);
      const chord = 2 * r * Math.sin(Math.PI / 12), phiChord = 24 * Math.asin(chord / (2 * L));
      const Cb = g.polar(Od, L + r, -Math.PI / 2);
      k.given('The elevation above xy (the triangle o′1′3′: base diameter 80, height 100) and the plan below (the base circle of radius r = 40). We want a flat pattern of the conical surface.', () => {
        k.seg(k.pt(-70, 0), k.pt(70, 0), { cls: 'given' }); k.label(k.pt(70, 0), 'x y', 'ne', { upright: true });
        k.poly([p1, o1, p3], { cls: 'given' }); k.point(o1, 'o′', 'n'); k.point(p1, '1′', 'sw'); k.point(p3, '3′', 'se');
        k.circle(cen, r, { cls: 'given' }); k.point(cen, 'o', 'ne');
        k.frame(-85, -130, 330, 125);
      });
      k.step('dividers', 'True slant length. The outline o′1′ is parallel to V, so it is the true length of every generator: L = ' + L.toFixed(1) + '. Take it with the dividers.', () => {
        k.seg(o1, p1, { cls: 'thick' }); k.dim(p1, o1, 'L', { side: 'left', dist: 0.9, upright: true });
      });
      k.step('compass', 'Choose the apex O of the pattern and, with the compass set to L, draw a long arc below it.', () => {
        k.point(Od, 'O', 'n');
        k.arc(Od, L, a0 - 0.15, a1 + 0.15, { cls: 'curve' });
      });
      k.step('protractor', 'The sector angle is φ = 360° · r / L = ' + (phi / D2R).toFixed(1) + '° (the arc must be as long as the base circle). Draw the vertical axis from O and lay off φ/2 = ' + (phi / D2R / 2).toFixed(1) + '° each side of it: the two radii end on the arc at E₀ and E₁.', () => {
        k.seg(Od, g.polar(Od, L * 0.6, -Math.PI / 2), { cls: 'cons', dash: true });
        k.seg(Od, E0, { cls: 'cons' }); k.seg(Od, E1, { cls: 'cons' });
        k.point(E0, 'E_0', 'sw'); k.point(E1, 'E_1', 'se');
        k.angle(Od, E0, E1, { label: 'φ', r: 3.4 });
      });
      k.step('dividers', 'Divide the base circle of the plan into twelve equal parts (dividers set to the chord of 30°) and divide the arc E₀E₁ into twelve equal parts as well: the points are the ends of twelve generators.', () => {
        for (let i = 0; i < 12; i++) k.dot(g.polar(cen, r, i * 30 * D2R), { r: 0.6 });
        for (let i = 1; i < 12; i++) k.dot(g.polar(Od, L, a0 + phi * i / 12), { r: 0.6 });
      });
      k.step('compass', 'Attach the base. The circle of radius r = 40 touches the arc at its middle: with centre on the axis at distance L + r from O, draw it.', () => {
        k.circle(Cb, r, { cls: 'curve' });
      });
      k.step('fold', 'Outline heavily; the generators (dashed) are not creased — the surface is curved — but they guide rolling the sector into the cone.', () => {
        k.poly([E0, Od, E1], { cls: 'thick' });
        k.arc(Od, L, a0, a1, { cls: 'thick' });
        for (let i = 1; i < 12; i++) k.seg(Od, g.polar(Od, L, a0 + phi * i / 12), { cls: 'cons', dash: true });
      });
      k.note('Stepping the chord ' + chord.toFixed(2) + ' twelve times along the arc would give φ = ' + (phiChord / D2R).toFixed(1) + '° instead of ' + (phi / D2R).toFixed(1) + '°: the cone would not close by about 1.3°.', () => {
        k.text(Od.x, Cb.y - r - 16, 'sector φ = ' + (phi / D2R).toFixed(1) + '°  radius L = ' + L.toFixed(1), { size: 0.75, upright: true });
      });
    }
  });

  /* ================================================================== dg-line-plane */
  Hyper.construction({
    id: 'dg-line-plane',
    title: 'Where a line pierces a plane: the cutting-plane method',
    tags: ['intersection', 'line', 'plane', 'visibility'],
    note: 'The vertical plane through the plan pq is seen edge-on in the plan as the line pq itself, so its section with the triangle is found at once there (points 1 and 2 on the sides) and carried up to the elevation. That section lies in the plane of the triangle and in the cutting plane, and the line pq lies in the cutting plane, so the section and the line meet exactly where the line pierces the triangle. Visibility is settled by asking, in each view, which part of the line is nearer the viewer.',
    build(k) {
      const g = k.g;
      const A = [10, 10, 15], B = [90, 25, 70], C = [60, 75, 10];
      const Xp = add3(add3(A, mul3(sub3(B, A), 0.4)), mul3(sub3(C, A), 0.3));
      const vdir = [-15, -35, 30], wdir = [12, 30, -25];
      const Pp = sub3(Xp, vdir.map(v => -v)), Qp = add3(Xp, wdir);   // X - (-15,-35,30) ... a line through X
      const N = cross3(sub3(B, A), sub3(C, A));
      // orient normals: up (for the plan) and towards the viewer (for the elevation)
      const Nup = N[2] >= 0 ? N : mul3(N, -1), Nfr = N[1] >= 0 ? N : mul3(N, -1);
      const sideOf = (P, Nn) => dot3(sub3(P, A), Nn);
      const tri3 = [A, B, C], triEl = tri3.map(el), triPl = tri3.map(pl);
      const edgesOf = pts => [[0, 1], [1, 2], [2, 0]].map(([i, j]) => [pts[i], pts[j]]);
      // the cutting plane meets the plan triangle where pq crosses its sides
      const pP = pl(Pp), qP = pl(Qp);
      const dirP = g.unit(g.sub(qP, pP)), farP = g.add(pP, g.mul(dirP, -500)), farQ = g.add(qP, g.mul(dirP, 500));
      const hits = [];
      [[0, 1], [1, 2], [2, 0]].forEach(([i, j]) => { const h = g.segSeg(farP, farQ, triPl[i], triPl[j]); if (h) hits.push({ i, j, p: h }); });
      // elevation of the section points: along the side i-j at the same x
      const onSide = (h) => { const a = tri3[h.i], b = tri3[h.j]; const t = (h.p.x - a[0]) / (b[0] - a[0]); return add3(a, mul3(sub3(b, a), t)); };
      const S1 = onSide(hits[0]), S2 = onSide(hits[1]);
      // the piercing point
      const nx = dot3(sub3(A, Pp), N) / dot3(sub3(Qp, Pp), N), Xs = add3(Pp, mul3(sub3(Qp, Pp), nx));
      // hidden part: from X toward the end that is below the plane (plan) / behind the plane (elevation)
      const hideEnd = (Nn) => (sideOf(Pp, Nn) < 0 ? Pp : Qp);
      const clipTo = (X2, End2, tri2) => {
        let best = null, bd = 1e9;
        edgesOf(tri2).forEach(([a, b]) => { const h = g.segSeg(X2, End2, a, b); if (h) { const dd = g.dist(h, X2); if (dd > 1e-6 && dd < bd) { bd = dd; best = h; } } });
        return best ? best : End2;
      };
      const hidP = hideEnd(Nup), hidE = hideEnd(Nfr);
      const hidPlanEnd = clipTo(pl(Xs), pl(hidP), triPl), hidElEnd = clipTo(el(Xs), el(hidE), triEl);
      k.given('The sheet with xy, the triangle ABC by its views a′b′c′ and abc, and the line PQ by p′q′ and pq. We want the point where PQ pierces the triangle, and which part of the line is hidden.', () => {
        k.seg(k.pt(-10, 0), k.pt(115, 0), { cls: 'given' }); k.label(k.pt(115, 0), 'x y', 'ne', { upright: true });
        k.poly(triEl, { close: true, cls: 'given' }); k.poly(triPl, { close: true, cls: 'given' });
        [[A, 'a'], [B, 'b'], [C, 'c']].forEach(([P, nm]) => { k.point(el(P), nm + '′', 'nw', { lo: { size: 0.8 } }); k.point(pl(P), nm, 'sw', { lo: { size: 0.8 } }); });
        k.seg(el(Pp), el(Qp), { cls: 'given' }); k.seg(pl(Pp), pl(Qp), { cls: 'given' });
        k.point(el(Pp), 'p′', 'n'); k.point(el(Qp), 'q′', 's'); k.point(pl(Pp), 'p', 'n'); k.point(pl(Qp), 'q', 's');
        k.frame(-15, -85, 120, 85);
      });
      k.step('straightedge', 'The cutting plane. Take the vertical plane through pq: in the plan it is the line pq. Extend pq across the plan triangle; it crosses two sides, at the points 1 and 2.', () => {
        k.seg(pl(Pp), g.add(pl(Qp), g.mul(dirP, 12)), { cls: 'cons' });
        k.point(hits[0].p, '1', 'ne', { lo: { size: 0.8 } }); k.point(hits[1].p, '2', 'ne', { lo: { size: 0.8 } });
      });
      k.step('square', 'Raise 1 and 2 (set square on the T-square) to the same sides of the triangle in the elevation: 1′ on one side, 2′ on the other.', () => {
        [[hits[0], S1, '1′'], [hits[1], S2, '2′']].forEach(([h, S, nm]) => { k.seg(h.p, el(S), { cls: 'cons' }); k.point(el(S), nm, 'nw', { lo: { size: 0.8 } }); });
      });
      k.step('straightedge', 'Join 1′ to 2′: it is the section of the triangle by the cutting plane. It crosses p′q′ at x′, which must therefore be a point of the triangle and a point of the line: the elevation of the piercing point.', () => {
        k.seg(el(S1), el(S2), { cls: 'cons' });
        k.point(el(Xs), 'x′', 'se', { lo: { size: 0.85 } });
      });
      k.step('square', 'Drop x′ to the plan (set square): it lands on pq at x, the plan of the piercing point.', () => {
        k.seg(el(Xs), pl(Xs), { cls: 'cons' });
        k.point(pl(Xs), 'x', 'se', { lo: { size: 0.85 } });
      });
      k.step('pencil', 'Visibility. In the plan the end of the line that is below the plane is hidden where it passes under the triangle (dashed); in the elevation the end that is behind the plane is hidden. The line is then drawn solid for the rest.', () => {
        k.seg(pl(Xs), hidPlanEnd, { cls: 'thick', dash: true }); k.seg(el(Xs), hidElEnd, { cls: 'thick', dash: true });
        const visP = (hidP === Pp) ? Qp : Pp, visE = (hidE === Pp) ? Qp : Pp;
        k.seg(pl(Xs), pl(visP), { cls: 'thick' }); k.seg(el(Xs), el(visE), { cls: 'thick' });
        if (g.dist(hidPlanEnd, pl(hidP)) > 1e-6) k.seg(hidPlanEnd, pl(hidP), { cls: 'thick' });
        if (g.dist(hidElEnd, el(hidE)) > 1e-6) k.seg(hidElEnd, el(hidE), { cls: 'thick' });
      });
    }
  });

  /* ================================================================== dg-two-prisms */
  Hyper.construction({
    id: 'dg-two-prisms',
    title: 'Two prisms meeting: a chimney through a roof',
    tags: ['intersection', 'prisms', 'direct method', 'isometric'],
    note: 'The roof is a prism with a triangular section whose faces are edge-on in the elevation; the chimney is a prism with a square section whose faces are edge-on in the plan. Each point of their line of intersection is therefore found at once: the vertical edges of the chimney pierce the roof planes where the elevation of the edge meets the roof line, and the ridge pierces the faces of the chimney where the plan of the ridge meets the plan of the face. The picture on the right (isometric) shows the polygon in space.',
    build(k) {
      const g = k.g, hw = 60, hr = 40, depth = 100, cxL = -24, cxR = 24, cd0 = 25, cd1 = 65, top = 80;
      const roofZ = x => hr * (1 - Math.abs(x) / hw);
      const zc = roofZ(cxR);     // 24
      const poly3 = [[cxL, cd1, zc], [0, cd1, hr], [cxR, cd1, zc], [cxR, cd0, zc], [0, cd0, hr], [cxL, cd0, zc]];
      k.given('The roof and the chimney in two views: the elevation above xy (the gable end, a triangle 120 wide and 40 high, and the chimney standing behind it) and the plan below (the roof rectangle 120 × 100 with its ridge, and the chimney square 48 × 40).', () => {
        k.seg(k.pt(-85, 0), k.pt(85, 0), { cls: 'given' }); k.label(k.pt(85, 0), 'x y', 'ne', { upright: true });
        k.poly([k.pt(-hw, 0), k.pt(hw, 0), k.pt(0, hr)], { close: true, cls: 'given' });
        k.rect(-hw, -depth, hw, 0, { cls: 'given' }); k.seg(k.pt(0, 0), k.pt(0, -depth), { cls: 'given' });
        k.rect(cxL, -cd1, cxR, -cd0, { cls: 'given' });
        k.point(k.pt(cxL, -cd1), '1', 'sw'); k.point(k.pt(cxR, -cd1), '2', 'se'); k.point(k.pt(cxR, -cd0), '3', 'ne'); k.point(k.pt(cxL, -cd0), '4', 'nw');
        k.point(k.pt(0, -cd1), 'm', 'se', { lo: { size: 0.8 } }); k.point(k.pt(0, -cd0), 'n', 'ne', { lo: { size: 0.8 } });
        k.seg(k.pt(cxL, hr + 0), k.pt(cxL, top), { cls: 'given' }); k.seg(k.pt(cxR, hr + 0), k.pt(cxR, top), { cls: 'given' }); k.seg(k.pt(cxL, top), k.pt(cxR, top), { cls: 'given' });
      });
      k.step('square', 'Raise the vertical edges of the chimney from the plan corners (set square on the T-square): the lines x = ±24 run up through the elevation.', () => {
        [cxL, cxR].forEach(x => k.seg(k.pt(x, -cd1), k.pt(x, 0), { cls: 'cons' }));
        k.seg(k.pt(0, -cd1), k.pt(0, hr), { cls: 'cons' });
      });
      k.step('pencil', 'The edges meet the roof lines at 1′ (left) and 2′ (right), at height ' + zc.toFixed(0) + ' = 40 (1 − 24/60): these are the points where the four vertical edges pierce the two roof planes.', () => {
        k.point(k.pt(cxL, zc), '1′ 4′', 'nw', { lo: { size: 0.8 } }); k.point(k.pt(cxR, zc), '2′ 3′', 'ne', { lo: { size: 0.8 } });
      });
      k.step('pencil', 'The ridge (x = 0) crosses the chimney faces 1–2 and 3–4 at m and n in the plan; their projector meets the ridge point in the elevation, at height 40: m′ n′.', () => {
        k.point(k.pt(0, hr), 'm′ n′', 'ne', { lo: { size: 0.8 } });
      });
      k.step('pencil', 'Join 1′ m′ 2′ (the face 1–2 meeting the roof) and the horizontals at height 24 for the faces 2–3 and 4–1, which are seen end-on. In the plan the curve lies on the chimney outline, so the plan shows the same square.', () => {
        k.seg(k.pt(cxL, zc), k.pt(0, hr), { cls: 'thick' }); k.seg(k.pt(0, hr), k.pt(cxR, zc), { cls: 'thick' });
      });
      // the pictorial
      const P = k.proj, M = P.mat4.mul(P.ortho(), P.isometric());
      const O3 = { x: 300, y: 15 }, S = 1.7;
      const ip = (x, d, h) => k.project(M, [[x, h, d]], { scale: S, origin: O3 })[0];
      k.step('pencil', 'Pictorial check, in isometric: the roof prism (hidden edges dashed), the chimney above the roof, and the line of intersection in blue — a closed six-sided polygon on the four faces of the chimney.', () => {
        // roof prism: ends at d = 0 and d = depth
        const pts = [[-hw, 0], [hw, 0], [0, hr]];
        const near = pts.map(([x, h]) => ip(x, depth, h)), far = pts.map(([x, h]) => ip(x, 0, h));
        k.poly(near, { close: true, cls: 'given' });
        k.seg(far[1], far[2], { cls: 'given' }); k.seg(far[1], near[1], { cls: 'given' }); k.seg(far[2], near[2], { cls: 'given' });
        k.seg(far[0], far[2], { cls: 'cons', dash: true }); k.seg(far[0], far[1], { cls: 'cons', dash: true }); k.seg(far[0], near[0], { cls: 'cons', dash: true });
        // chimney above the roof
        const cv = poly3.map(p => ip(p[0], p[1], p[2]));
        const topv = [[cxL, cd1], [cxR, cd1], [cxR, cd0], [cxL, cd0]].map(([x, d]) => ip(x, d, top));
        const base = [ip(cxL, cd1, zc), ip(cxR, cd1, zc), ip(cxR, cd0, zc), ip(cxL, cd0, zc)];
        k.poly(topv, { close: true, cls: 'given' });
        [0, 1, 2].forEach(i => k.seg(base[i], topv[i], { cls: 'given' }));
        k.seg(base[3], topv[3], { cls: 'cons', dash: true });
        k.poly(cv, { close: true, cls: 'curve', width: 3.6 });
        const allp = cv.concat(near, far, topv); const mx = allp.reduce((a, p) => a + p.x, 0) / allp.length, miny = Math.min.apply(null, allp.map(p => p.y));
        k.text(mx, miny - 14, 'the line of intersection (blue)', { size: 0.75, upright: true, fill: '#0b4fa0' });
      });
    }
  });

  /* ================================================================== dg-shadow-point-light */
  Hyper.construction({
    id: 'dg-shadow-point-light',
    title: 'The shadow of a post under a lamp',
    tags: ['shadow', 'point light', 'central projection', 'similar triangles'],
    note: 'A lamp is a centre of projection and the ground is the picture plane: the shadow of a point is where the ray from the lamp through it meets the ground. All the points of the top of the post lie at the same height h, so their shadows are the top square scaled about the foot F of the lamp by the factor H / (H − h). The section along one ray gives that factor by similar triangles; the plan then needs only parallels. The shadow of the whole post is the hull of the footprint and the shadow of the top.',
    build(k) {
      const g = k.g, H = 150, h = 60, kk = H / (H - h);
      const F = k.pt(0, -130);                                        // the lamp's foot, in the plan on the sheet
      const pp = [[90, 20], [115, 20], [115, 45], [90, 45]].map(([x, y]) => k.pt(F.x + x, F.y + y));
      const rel = p => g.sub(p, F);
      const S = pp.map(p => g.add(F, g.mul(rel(p), kk)));
      const dist1 = g.len(rel(pp[0])), tipDist = dist1 * kk;
      const G0 = k.pt(0, 0), Lamp = k.pt(0, H), Pst = k.pt(dist1, 0), T = k.pt(dist1, h), S1 = k.pt(tipDist, 0);
      const shadow = hull(pp.concat(S));
      k.given('Above: a section along the ray from the foot F of the lamp to the near corner of the post (the vertical plane through them, turned flat). The lamp is H = 150 above F, the post h = 60 high. Below: the plan, with F and the square footprint 1 2 3 4 of the post.', () => {
        k.seg(k.pt(-20, 0), k.pt(215, 0), { cls: 'given' }); k.label(k.pt(215, 0), 'ground', 'e', { upright: true, size: 0.7 });
        k.seg(G0, Lamp, { cls: 'given', dash: true }); k.point(Lamp, 'L', 'ne'); k.point(G0, 'F', 'sw');
        k.seg(Pst, T, { cls: 'given', width: 3 }); k.point(T, 'T', 'ne'); k.point(Pst, 'P', 'se');
        k.dim(G0, Lamp, 'H', { side: 'left', dist: 0.9, upright: true }); k.dim(Pst, T, 'h', { side: 'right', dist: 0.9, upright: true });
        k.point(F, 'F', 'sw');
        k.poly(pp, { close: true, cls: 'given' });
        pp.forEach((p, i) => k.point(p, String(i + 1), ['sw', 'se', 'ne', 'nw'][i]));
        k.frame(-30, -165, 230, 170);
      });
      k.step('straightedge', 'In the section draw the ray from the lamp L through the top T of the post to the ground: it lands at S. FS is the distance of the shadow of T from the lamp\'s foot, ' + tipDist.toFixed(1) + ', which is ' + kk.toFixed(3) + ' times FP.', () => {
        k.seg(Lamp, S1, { cls: 'cons' });
        k.point(S1, 'S', 'se');
      });
      k.step('straightedge', 'In the plan draw the rays from F through the four corners 1 … 4 and on beyond: the shadow of each top corner lies on its ray.', () => {
        pp.forEach(p => k.seg(F, g.add(F, g.mul(rel(p), kk * 1.04)), { cls: 'cons' }));
      });
      k.step('dividers', 'Carry FS from the section to the plan along the ray F1: this gives the shadow s₁ of the corner 1 of the top (the dividers set to FS).', () => {
        k.point(S[0], 's_1', 'ne');
      });
      k.step('square', 'Through s₁ draw the parallel to 1–2: it meets the ray F2 at s₂. Through s₂ draw the parallel to 2–3 to s₃ on the ray F3, then the parallel to 3–4 to s₄. (Similar triangles about F: the top square is only scaled.)', () => {
        for (let i = 0; i < 3; i++) k.seg(S[i], S[i + 1], { cls: 'cons' });
        k.seg(S[3], S[0], { cls: 'cons' });
        k.point(S[1], 's_2', 'ne'); k.point(S[2], 's_3', 'ne'); k.point(S[3], 's_4', 'nw');
      });
      k.step('pencil', 'The shadow of the post on the ground is the region bounded by the hull of the footprint and the shadow of the top: line it in and hatch it.', () => {
        k.hatch(shadow, { angle: Math.PI / 4, gap: 0.9, outline: true });
        shadow.forEach((p, i) => k.seg(p, shadow[(i + 1) % shadow.length], { cls: 'thick' }));
      });
    }
  });

  /* ================================================================== dg-shadow-sun */
  Hyper.construction({
    id: 'dg-shadow-sun',
    title: 'The shadow of a post under the sun',
    tags: ['shadow', 'sun', 'parallel projection', 'altitude'],
    note: 'The sun is so far away that its rays are parallel: a parallel projection onto the ground, with a direction given by the sun\'s azimuth (the direction of the shadow on the plan) and its altitude α (the angle of the rays above the ground). Every top corner of the post is shifted by the same horizontal vector, of length h / tan α, so the shadow of the top is a translated copy of the top square, and the shadow of the post is the hull of the footprint and that copy.',
    build(k) {
      const g = k.g, h = 60, alt = 35 * D2R, az = 30 * D2R;
      const sLen = h / Math.tan(alt);
      const ds = k.pt(Math.cos(az), Math.sin(az));
      const F = k.pt(0, -120);
      const pp = [[20, 0], [45, 0], [45, 25], [20, 25]].map(([x, y]) => k.pt(F.x + x, F.y + y));
      const S = pp.map(p => g.add(p, g.mul(ds, sLen)));
      const G0 = k.pt(0, 0), Pst = k.pt(30, 0), T = k.pt(30, h), Sg = k.pt(30 + sLen, 0);
      const shadow = hull(pp.concat(S));
      const rayEnd = g.add(k.pt(-30, -45), g.mul(ds, -1));
      k.given('Above: a section in the vertical plane of the sun (turned flat): the post PT of height h = 60 on the ground. Below: the plan, with the footprint 1 2 3 4 and the direction of the sun\'s shadow (30° above the sheet\'s horizontal, an arrow at the left).', () => {
        k.seg(k.pt(-20, 0), k.pt(220, 0), { cls: 'given' }); k.label(k.pt(220, 0), 'ground', 'e', { upright: true, size: 0.7 });
        k.seg(Pst, T, { cls: 'given', width: 3 }); k.point(Pst, 'P', 'sw'); k.point(T, 'T', 'ne');
        k.dim(Pst, T, 'h', { side: 'left', dist: 0.9, upright: true });
        k.poly(pp, { close: true, cls: 'given' });
        pp.forEach((p, i) => k.point(p, String(i + 1), ['sw', 'se', 'ne', 'nw'][i]));
        const a0 = k.pt(-100, -150), a1 = g.add(a0, g.mul(ds, 50));
        k.arrow(a0, a1, { cls: 'given' }); k.label(a0, 'direction of the shadow', 'sw', { upright: true, size: 0.7, dist: 0.6 });
        void rayEnd;
        k.frame(-150, -170, 230, 90);
      });
      k.step('protractor', 'The sun is at altitude α = 35°. From the top T of the post draw the ray down to the ground at 35° below the horizontal (protractor at T): it meets the ground at S. PS is the length of the shadow, h / tan α = ' + sLen.toFixed(1) + '.', () => {
        k.seg(T, Sg, { cls: 'cons' });
        k.angle(Sg, T, k.pt(Sg.x - 30, 0), { label: 'α', r: 2.2 });
        k.point(Sg, 'S', 'se');
      });
      k.note('Take PS between the points of the dividers: it is the horizontal shift of every point at height h, and it is what the next steps carry into the plan.', () => {
        k.dim(Pst, Sg, 'PS', { side: 'right', dist: 0.9, upright: true, size: 0.8 });
        k.tick(Pst, k.pt(1, 0)); k.tick(Sg, k.pt(1, 0));
      });
      k.step('square', 'In the plan draw through each corner 1 … 4 a line in the direction of the shadow (the set square slid along the ruler keeps them parallel).', () => {
        pp.forEach(p => k.seg(p, g.add(p, g.mul(ds, sLen + 12)), { cls: 'cons' }));
      });
      k.step('dividers', 'Lay off PS along each of these four lines from its corner: s₁ … s₄ are the shadows of the corners of the top. They form a square equal to the footprint, shifted.', () => {
        S.forEach((p, i) => k.point(p, 's_' + (i + 1), ['se', 'se', 'ne', 'nw'][i]));
        for (let i = 0; i < 4; i++) k.seg(S[i], S[(i + 1) % 4], { cls: 'cons' });
      });
      k.step('pencil', 'Line in the hull of the footprint and the shifted square and hatch it: the shadow of the post. The edges of the shadow of the vertical edges of the post are parallel to the shadow direction.', () => {
        k.hatch(shadow, { angle: Math.PI / 4, gap: 0.9, outline: true });
        shadow.forEach((p, i) => k.seg(p, shadow[(i + 1) % shadow.length], { cls: 'thick' }));
      });
    }
  });
})();
