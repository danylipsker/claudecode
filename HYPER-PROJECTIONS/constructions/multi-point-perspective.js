/* HYPER-PROJECTIONS · constructions/multi-point-perspective.js — hand constructions for four-, five- and six-point perspective.
 *
 *   mp-five-point-frame     the hemisphere in a circle: the four rim vanishing points, the centre, and the far wall of a room
 *                           drawn with four compass arcs through computed points
 *   mp-six-point-frame      the whole sphere in a disc: the half-way circle, the rim as the point behind, the back wall found
 *                           from the front wall by the rule r(back) = R − r(front)
 *   mp-curved-edge          Barre and Flocon's rule for any straight edge: an arc through two opposite rim points and the
 *                           edge's own vanishing point
 *   mp-cylindrical-grid     the horizontal lines of a square room unrolled on a cylinder, point by point from a cosine table
 *   mp-cylinder-from-photo  a straight line of a flat photograph rolled onto the cylinder (arc rectified, height shrunk by cos)
 *   mp-mirror-ball          a room in a mirror ball: the bisector of the angle gives the point of reflection
 *   mp-tangent-scale        the rectilinear picture line: equal angles give unequal spacing r = f·tan θ
 * Every figure is computed (k.g and the projection engine), never placed by eye.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180;
  const sin = Math.sin, cos = Math.cos, tan = Math.tan, atan = Math.atan, atan2 = Math.atan2, hypot = Math.hypot;
  const fmt = (x, d) => (Math.round(x * Math.pow(10, d == null ? 1 : d)) / Math.pow(10, d == null ? 1 : d)).toString();

  /* the arc of the circle (C, |CP|) that runs from P to Q through M */
  function arcVia(k, C, P, M, Q, o) {
    const g = k.g, r = g.dist(C, P);
    let a0 = g.angleOf(g.sub(P, C)), a1 = g.angleOf(g.sub(Q, C));
    const am = g.angleOf(g.sub(M, C));
    const sweep = (x, y) => { let d = (y - x) % TAU; if (d < 0) d += TAU; return d; };
    if (sweep(a0, am) > sweep(a0, a1)) { const t = a0; a0 = a1; a1 = t; }
    return k.arc(C, r, a0, a1, o);
  }
  /* the equidistant (r = f·θ) picture of a direction [x, y, z], y up, z along the axis, as a paper point */
  function eqd(k, f, d) { const q = k.proj.fisheye('equidistant', d, f); return q ? k.pt(q[0], q[1]) : null; }

  /* ================================================================ five-point frame */
  Hyper.construction({
    id: 'mp-five-point-frame',
    title: 'The five-point frame: a room on a hemisphere',
    tags: ['five-point', 'fisheye', 'compass', 'vanishing points'],
    note: 'The picture is the hemisphere of directions out to 90° from the axis, laid flat so that the angle θ from the axis becomes the distance r = f·θ from the centre; the rim of radius R = f·π/2 is the circle of directions at right angles to the axis. Every straight line of the room becomes a curve through two opposite points of the rim. A circular arc through the two rim points and one computed point follows the true curve to about 1 % of R (the true curves are dashed in the last step). The arcs, not the table, make the corners here: they fall within half a per cent of R of the table values.',
    build(k) {
      const g = k.g, R = 150, f = R / (PI / 2);
      const a = 3, b = 2, D = 4;                                  // the room: 6 wide, 4 high, far wall 4 away; eye at the centre
      const O = k.pt(0, 0), VL = k.pt(-R, 0), VR = k.pt(R, 0), VU = k.pt(0, R), VD = k.pt(0, -R);
      const phi = atan2(b, a), thT = atan(b / D), thS = atan(a / D);
      const mT = k.pt(0, f * thT), mB = k.pt(0, -f * thT), mR = k.pt(f * thS, 0), mL = k.pt(-f * thS, 0);
      const cT = g.circumcenter(VL, mT, VR), cB = g.circumcenter(VL, mB, VR), cR = g.circumcenter(VU, mR, VD), cL = g.circumcenter(VU, mL, VD);
      const rT = g.dist(cT, VL), rR = g.dist(cR, VU);
      const near = (pts, ex) => g.closest(ex, pts);
      const exact = [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(s => eqd(k, f, [s[0] * a, s[1] * b, D]));
      const corner = [
        near(g.circleCircle(cT, rT, cR, rR), exact[0]), near(g.circleCircle(cT, rT, cL, rR), exact[1]),
        near(g.circleCircle(cB, rT, cL, rR), exact[2]), near(g.circleCircle(cB, rT, cR, rR), exact[3])
      ];
      k.given('The picture circle of radius R = f·π/2 (the hemisphere out to 90° from the axis) with its centre O, the point straight ahead. The room is 6 wide and 4 high with its far wall 4 away, and the eye is at the middle of the cross-section.', () => {
        k.circle(O, R, { cls: 'given' });
        k.point(O, 'O', 'ne');
        k.seg(O, g.polar(O, R, -PI / 4), { cls: 'given' }); k.label(g.polar(O, R * 0.5, -PI / 4), 'R', 'se', { upright: true });
        k.frame(-R * 1.12, -R * 1.12, R * 1.12, R * 1.12);
      });
      k.step('tee', 'With the T-square draw the horizontal diameter, the horizon. It meets the circle at V_L and V_R: the vanishing points of the directions left and right, each 90° from the axis.', () => {
        k.seg(VL, VR, { cls: 'cons' }); k.point(VL, 'V_L', 'w'); k.point(VR, 'V_R', 'e');
      });
      k.step('square', 'With the set square against the T-square draw the vertical diameter. Its ends V_U and V_D are the vanishing points of up and down.', () => {
        k.seg(VD, VU, { cls: 'cons' }); k.point(VU, 'V_U', 'n'); k.point(VD, 'V_D', 's'); k.right(O, VR, VU, { r: 0.8 });
      });
      k.note('O is the fifth vanishing point: every line parallel to the axis runs along a radius to O. The sixth direction, straight behind, is not in the picture.', () => {
        k.label(g.polar(O, 14, -PI / 2.6), 'V_0', 'se');
      });
      k.step('protractor', 'The four long edges of the room run parallel to the axis, so each is a radius. Its direction is tan φ = b/a = 2/3: lay off φ = ' + fmt(phi / D2R) + '° from the horizon in each quadrant and mark where the lines meet the circle.', () => {
        [1, 2, 3, 4].forEach((q, i) => { const ang = [phi, PI - phi, PI + phi, TAU - phi][i]; k.point(g.polar(O, R, ang), 'E_' + q, ['ne', 'nw', 'sw', 'se'][i]); });
        k.angle(O, VR, g.polar(O, R, phi), { label: 'φ', r: 1.5, labelDist: 1.3 });
      });
      k.step('straightedge', 'Draw the four radii to E_1 … E_4: they are the lines on which the corner edges of the room will lie.', () => {
        [phi, PI - phi, PI + phi, TAU - phi].forEach(ang => k.seg(O, g.polar(O, R, ang), { cls: 'cons' }));
      });
      k.step('ruler', 'Mark the middles of the far wall\'s edges. Top and bottom: θ = arctan(b/D) = ' + fmt(thT / D2R) + '°, r = f·θ = ' + fmt(f * thT) + ' up and down from O. Left and right: θ = arctan(a/D) = ' + fmt(thS / D2R) + '°, r = ' + fmt(f * thS) + ' either side.', () => {
        k.point(mT, 'M_t', 'ne'); k.point(mB, 'M_b', 'se'); k.point(mR, 'M_r', 'se'); k.point(mL, 'M_l', 'sw');
      });
      k.step('square', 'Join V_L to M_t and draw the perpendicular bisector of that segment with the set square. It cuts the vertical diameter at C_t: the centre of the circle through V_L, M_t and V_R (the top edge of the far wall).', () => {
        const m = g.mid(VL, mT), dd = g.perp(g.unit(g.sub(mT, VL)));
        k.seg(VL, mT, { cls: 'cons' }); k.line(m, g.add(m, g.mul(dd, 10)), { cls: 'cons' }); k.point(cT, 'C_t', 'sw');
      });
      k.step('compass', 'With centre C_t and radius C_t V_L draw the arc through V_L, M_t and V_R.', () => { arcVia(k, cT, VL, mT, VR, { cls: 'curve' }); });
      k.step('dividers', 'The bottom edge is the mirror image: carry the distance O C_t down from O to find C_b.', () => { k.point(cB, 'C_b', 'nw'); });
      k.step('compass', 'With centre C_b draw the arc through V_L, M_b and V_R.', () => { arcVia(k, cB, VL, mB, VR, { cls: 'curve' }); });
      k.step('square', 'The side edges pass through V_U and V_D: bisect V_U M_r in the same way. The bisector cuts the horizon at C_r — on the left, just outside the circle, because the right-hand edge bows towards the right.', () => {
        const m = g.mid(VU, mR), dd = g.perp(g.unit(g.sub(mR, VU)));
        k.seg(VU, mR, { cls: 'cons' }); k.line(m, g.add(m, g.mul(dd, 10)), { cls: 'cons' }); k.point(cR, 'C_r', { at: 'sw', lo: { dist: 1.2 } });
      });
      k.step('compass', 'With centre C_r draw the arc through V_U, M_r and V_D.', () => { arcVia(k, cR, VU, mR, VD, { cls: 'curve' }); });
      k.step('dividers', 'Carry O C_r to the other side of O to find C_l, and draw the left edge, the arc through V_U, M_l and V_D.', () => {
        k.point(cL, 'C_l', { at: 'se', lo: { dist: 1.2 } }); arcVia(k, cL, VU, mL, VD, { cls: 'curve' });
      });
      k.note('The four arcs cross at the corners of the far wall (K_1 … K_4). The table value for the first is r = f·θ with tan θ = √(a² + b²)/D, θ = ' + fmt(atan(hypot(a, b) / D) / D2R) + '°, r = ' + fmt(hypot(exact[0].x, exact[0].y)) + ': the arcs agree to within half a per cent of R.', () => {
        corner.forEach((c, i) => k.point(c, 'K_' + (i + 1), ['ne', 'nw', 'sw', 'se'][i]));
      });
      k.step('pencil', 'Line in the room: the far wall (the four arcs between the corners) and the four long edges, each from its corner out along its radius to the rim, where it passes the plane of the eye.', () => {
        arcVia(k, cT, corner[1], mT, corner[0], { cls: 'thick' }); arcVia(k, cB, corner[2], mB, corner[3], { cls: 'thick' });
        arcVia(k, cR, corner[0], mR, corner[3], { cls: 'thick' }); arcVia(k, cL, corner[1], mL, corner[2], { cls: 'thick' });
        corner.forEach(c => k.seg(c, g.mul(g.unit(c), R), { cls: 'thick' }));
      });
      k.note('Dashed: the exact curves of the top and bottom edges (the point at x = D·tan u for u from −85° to 85°). The arcs lie within about 1 % of R.', () => {
        [b, -b].forEach(y => k.curve(u => { const q = k.proj.fisheye('equidistant', [D * tan(u), y, D], f); return q; }, [-85 * D2R, 85 * D2R], { cls: 'aux', dash: true, n: 120 }));
      });
    }
  });

  /* ================================================================ six-point frame */
  Hyper.construction({
    id: 'mp-six-point-frame',
    title: 'The six-point frame: the whole sphere in a disc',
    tags: ['six-point', 'sphere', 'compass', 'dividers'],
    note: 'The equidistant picture of the whole sphere: r = f·θ with θ out to 180°, so the rim has radius R = f·π and is the single point straight behind the viewer, spread round a circle. The half-way circle of radius R/2 is θ = 90°, the border between the front and the back hemisphere; the four side vanishing points lie on it. A direction (x, y, −z) behind has the same azimuth as (x, y, z) in front and θ\' = 180° − θ, so r\' = R − r: the back of the room is the front turned inside out about the half-way circle, found with dividers alone.',
    build(k) {
      const g = k.g, R = 157, f = R / PI;
      const a = 3, b = 2, D = 4;
      const O = k.pt(0, 0), VL = k.pt(-R / 2, 0), VR = k.pt(R / 2, 0), VU = k.pt(0, R / 2), VD = k.pt(0, -R / 2);
      const thT = atan(b / D), thS = atan(a / D);
      const mT = k.pt(0, f * thT), mB = k.pt(0, -f * thT), mR = k.pt(f * thS, 0);
      const cT = g.circumcenter(VL, mT, VR), cB = g.circumcenter(VL, mB, VR), cR = g.circumcenter(VU, mR, VD), cL = g.circumcenter(VU, k.pt(-mR.x, 0), VD);
      const rT = g.dist(cT, VL), rR = g.dist(cR, VU);
      const exact = [[1, 1], [-1, 1], [-1, -1], [1, -1]].map(s => eqd(k, f, [s[0] * a, s[1] * b, D]));
      const corner = [
        g.closest(exact[0], g.circleCircle(cT, rT, cR, rR)), g.closest(exact[1], g.circleCircle(cT, rT, cL, rR)),
        g.closest(exact[2], g.circleCircle(cB, rT, cL, rR)), g.closest(exact[3], g.circleCircle(cB, rT, cR, rR))
      ];
      const azs = [20, 45, 70, 90, 110, 135, 160].map(d => d * D2R);
      const fronts = azs.map(az => { const q = g.lineCircle(O, g.polar(O, 1, az), cT, rT).filter(p => g.dot(g.sub(p, O), g.dir(az)) > 0 && g.dist(O, p) < R / 2); return q.length ? g.closest(g.polar(O, 30, az), q) : null; });
      const backs = fronts.map((p, i) => p ? g.polar(O, R - g.dist(O, p), azs[i]) : null);
      k.given('The disc of radius R = f·π (the whole sphere of directions) with its centre O straight ahead. The room is 6 wide and 4 high; the eye is at its centre, and the front wall and the back wall are each 4 away.', () => {
        k.circle(O, R, { cls: 'given' }); k.point(O, 'O', 'ne');
        k.seg(O, g.polar(O, R, -PI / 4), { cls: 'given' }); k.label(g.polar(O, R * 0.62, -PI / 4), 'R', 'se', { upright: true });
        k.frame(-R * 1.1, -R * 1.1, R * 1.1, R * 1.1);
      });
      k.step('dividers', 'Halve the radius with the dividers (mark H on it) and draw, about O, the half-way circle. It is the border of the front hemisphere: θ = 90°.', () => { k.point(g.polar(O, R / 2, -PI / 4), 'H', 'se'); });
      k.step('compass', 'With centre O and radius OH draw the half-way circle. Inside it is everything in front of the viewer; outside, everything behind.', () => { k.circle(O, R / 2, { cls: 'cons' }); });
      k.step('tee', 'Draw the horizon through O. It meets the half-way circle at V_L and V_R, the vanishing points of left and right.', () => { k.seg(k.pt(-R, 0), k.pt(R, 0), { cls: 'cons' }); k.point(VL, 'V_L', 'sw'); k.point(VR, 'V_R', 'se'); });
      k.step('square', 'With the set square draw the vertical through O: V_U and V_D, up and down. The centre O is the vanishing point ahead and the whole rim is the vanishing point behind: six in all.', () => { k.seg(k.pt(0, -R), k.pt(0, R), { cls: 'cons' }); k.point(VU, 'V_U', 'ne'); k.point(VD, 'V_D', 'se'); });
      k.step('ruler', 'The top and bottom edges of the front wall: θ = arctan(b/D) = ' + fmt(thT / D2R) + '°, r = f·θ = ' + fmt(f * thT) + ' up and down from O. The side edges: θ = ' + fmt(thS / D2R) + '°, r = ' + fmt(f * thS) + ' right and left.', () => {
        k.point(mT, 'M_t', 'e'); k.point(mB, 'M_b', 'e'); k.point(mR, 'M_r', 'se'); k.point(k.pt(-mR.x, 0), 'M_l', 'sw');
      });
      k.step('square', 'Bisect V_L M_t perpendicularly; the bisector cuts the vertical through O at C_t, the centre of the arc through V_L, M_t, V_R.', () => {
        const m = g.mid(VL, mT), dd = g.perp(g.unit(g.sub(mT, VL)));
        k.seg(VL, mT, { cls: 'cons' }); k.line(m, g.add(m, g.mul(dd, 10)), { cls: 'cons' }); k.point(cT, 'C_t', 'sw');
      });
      k.step('compass', 'Draw the top edge of the front wall, the arc V_L M_t V_R about C_t; then, with C_b the mirror of C_t, the bottom edge.', () => {
        arcVia(k, cT, VL, mT, VR, { cls: 'curve' }); k.point(cB, 'C_b', 'nw'); arcVia(k, cB, VL, mB, VR, { cls: 'curve' });
      });
      k.step('compass', 'In the same way, with centres C_r and C_l on the horizon, draw the side edges through V_U and V_D.', () => {
        arcVia(k, cR, VU, mR, VD, { cls: 'curve' }); arcVia(k, cL, VU, k.pt(-mR.x, 0), VD, { cls: 'curve' }); k.point(cR, 'C_r', { at: 'sw', lo: { dist: 1.2 } }); k.point(cL, 'C_l', { at: 'se', lo: { dist: 1.2 } });
      });
      k.step('straightedge', 'Draw radii from O at the azimuths 20°, 45°, 70°, 90°, 110°, 135°, 160°; each cuts the top arc of the front wall at a point P.', () => {
        azs.forEach((az, i) => { k.seg(O, g.polar(O, R, az), { cls: 'cons' }); if (fronts[i]) k.point(fronts[i], i === 1 ? 'P' : '', 'se'); });
      });
      k.step('dividers', 'The back wall: carry each distance OP from the rim inwards along the same radius, to P\'. A point behind the viewer has the same azimuth as its twin in front and lies as far from the rim as the twin lies from O.', () => {
        backs.forEach((p, i) => { if (p) k.point(p, i === 1 ? 'P\'' : '', 'ne'); });
      });
      k.step('pencil', 'Trace the top edge of the back wall: the smooth curve through V_L, the seven points P\' and V_R. With the front edge it makes a closed oval — one straight line of the room as a great circle of the sphere.', () => {
        const pts = [VL].concat(backs.filter(Boolean).sort((p, q) => atan2(p.y, p.x) - atan2(q.y, q.x)).reverse(), [VR]);
        k.smooth(pts, { cls: 'curve', n: 20 });
      });
      k.step('pencil', 'Line in the front wall (the four arcs between K_1 … K_4) and the four long edges. Each long edge is a radius, running from its front corner across the half-way circle to its back corner.', () => {
        arcVia(k, cT, corner[1], mT, corner[0], { cls: 'thick' }); arcVia(k, cB, corner[2], mB, corner[3], { cls: 'thick' });
        arcVia(k, cR, corner[0], mR, corner[3], { cls: 'thick' }); arcVia(k, cL, corner[1], k.pt(-mR.x, 0), corner[2], { cls: 'thick' });
        corner.forEach((c, i) => { k.point(c, 'K_' + (i + 1), ['ne', 'nw', 'sw', 'se'][i]); const back = g.polar(O, R - g.dist(O, c), g.angleOf(c)); k.seg(c, back, { cls: 'thick' }); });
      });
      k.note('Dashed: the exact top edge of the back wall (the same line at z = −D). The front arc is within 1 % of R; the back curve, found from it by the rule r\' = R − r, keeps that accuracy because the rule is exact.', () => {
        k.curve(u => k.proj.fisheye('equidistant', [D * tan(u), b, -D], f), [-89.5 * D2R, 89.5 * D2R], { cls: 'aux', dash: true, n: 160 });
      });
    }
  });

  /* ================================================================ Barre–Flocon curved edge */
  Hyper.construction({
    id: 'mp-curved-edge',
    title: 'A straight edge as an arc: the rule of Barre and Flocon',
    tags: ['Barre-Flocon', 'five-point', 'compass', 'vanishing point'],
    note: 'The rule: the picture of any straight line is (very nearly) an arc of a circle through two opposite points E and E\' of the rim, the second being the point where the line\'s own vanishing point sits or any other point of the picture of the line. E is the direction of the point Q where the line crosses the plane of the eye (the plane through the eye parallel to the picture plane), so it is the azimuth of Q seen from the eye. The deviation from the true curve of the equidistant picture is under 2 % of the radius of the picture.',
    build(k) {
      const g = k.g, R = 150, f = R / (PI / 2);
      const al = 30 * D2R, y0 = 1.5, z0 = 2.5;                     // edge: 1.5 below the eye, through the point 2.5 ahead, 30° to the picture plane
      const d = [cos(al), 0, sin(al)], p = [0, -y0, z0];
      const tE = -z0 / sin(al), Q = [p[0] + tE * d[0], -y0, 0];
      const az = atan2(Q[1], Q[0]);
      const O = k.pt(0, 0), E = g.polar(O, R, az), Ep = g.polar(O, R, az + PI);
      const V = k.pt(f * (PI / 2 - al), 0);
      const mid = g.mid(E, V), perpEV = g.perp(g.unit(g.sub(V, E)));
      const C = g.lineLine(mid, g.add(mid, perpEV), O, g.add(O, g.perp(g.unit(g.sub(E, O)))));
      k.given('The picture circle of radius R = f·π/2 with its centre O and the horizon. The edge is the foot of a wall: it starts at Q on the wall beside the viewer (' + fmt(-Q[0], 2) + ' to the left, 1.5 below eye level) and runs away to the right at 30° to the picture plane.', () => {
        k.circle(O, R, { cls: 'given' }); k.point(O, 'O', 'ne'); k.seg(k.pt(-R, 0), k.pt(R, 0), { cls: 'cons' });
        k.label(k.pt(R, 0), 'horizon', 'ne', { upright: true, size: 0.8 });
        k.frame(-R * 1.15, -R * 1.15, R * 1.15, 212);
      });
      k.step('protractor', 'Q lies ' + fmt(az / D2R + 180) + '° below the horizon to the left (tan = 1.5/' + fmt(-Q[0], 2) + '). Lay off this direction from O to the rim: the point E. Lay off the opposite direction: E\'.', () => {
        k.point(E, 'E', 'sw'); k.point(Ep, 'E\'', 'ne'); k.angle(O, k.pt(-1, 0), E, { label: fmt(az / D2R + 180) + '°', r: 1.7, labelDist: 1.6 });
      });
      k.step('straightedge', 'Draw the diameter E E\'. Every arc of the family passes through its two ends.', () => { k.seg(E, Ep, { cls: 'cons' }); });
      k.step('ruler', 'The edge makes 30° with the picture plane, so its direction is 60° from the axis, on the horizon to the right. Its vanishing point is at r = f·60° = ' + fmt(V.x) + ' from O: mark V.', () => { k.point(V, 'V', 'se'); });
      k.step('square', 'The centre of the circle through E, V and E\' lies on the perpendicular bisector of E V and on the perpendicular to the diameter E E\' through O (the bisector of E E\'). Draw both with the set square; they cross at C.', () => {
        k.seg(E, V, { cls: 'cons' });
        k.line(mid, g.add(mid, perpEV), { cls: 'cons' });
        k.line(O, g.add(O, g.perp(g.unit(g.sub(E, O)))), { cls: 'cons' });
        k.point(C, 'C', 'nw');
      });
      k.step('compass', 'With centre C and radius C E draw the arc from E through V.', () => { arcVia(k, C, E, V, Ep, { cls: 'cons' }); });
      k.step('pencil', 'The picture of the edge is the part of the arc from E, where the edge passes the eye, to V, where it vanishes. Line it in.', () => {
        const a0 = g.angleOf(g.sub(E, C)), a1 = g.angleOf(g.sub(V, C));
        const sw = (x, y) => { let t = (y - x) % TAU; if (t < 0) t += TAU; return t; };
        if (sw(a0, a1) < PI) k.arc(C, g.dist(C, E), a0, a1, { cls: 'thick' }); else k.arc(C, g.dist(C, E), a1, a0, { cls: 'thick' });
      });
      k.note('Dashed: the true picture of the edge, point by point (r = f·θ). The arc is within 2 % of R of it everywhere. Taking the picture of the point 2.5 ahead instead of V as the third point reduces the error to about 1 %.', () => {
        const pts = [];
        for (let i = 0; i <= 240; i++) {
          const t = tE + 1e-4 + (600 - tE) * Math.pow(i / 240, 3);
          const q = k.proj.fisheye('equidistant', [p[0] + t * d[0], p[1], p[2] + t * d[2]], f); if (q) pts.push(q);
        }
        k.curve(pts, null, { cls: 'aux', dash: true });
      });
    }
  });

  /* ================================================================ cylindrical grid */
  Hyper.construction({
    id: 'mp-cylindrical-grid',
    title: 'A square room unrolled on a cylinder: the arches of the horizontals',
    tags: ['four-point', 'cylinder', 'panorama', 'dividers', 'table'],
    note: 'On the unrolled cylinder a direction with azimuth u and altitude angle a lands at x = f·u, y = f·tan a. A horizontal line at height h along a wall at distance d has tan a = h·cos(u − u₀)/d, so y = (f·h/d)·cos(u − u₀): an arch, highest where the wall is nearest. Verticals stay vertical and straight. The four vanishing points of the room\'s horizontal directions sit on the horizon at u = 0°, 90°, 180°, 270°; the vertical directions go to ±∞ and are not on the picture, which is why a cylinder holds four, not five or six.',
    build(k) {
      const f = 60, d = 2, h1 = 2.6, h2 = -1.5;                   // square hall, walls 2 away; ceiling 2.6 above the eye, floor 1.5 below
      const X = u => f * u * D2R, Yc = w => f * h1 / d * cos(w * D2R), Yf = w => f * h2 / d * cos(w * D2R);
      const xL = X(-180), xR = X(180), W = [-45, -30, -15, 0, 15, 30, 45];
      const HL = k.pt(0, 0);
      k.given('The cylinder of radius f = 60 unrolled to a strip: the horizon (eye level) and the axis, u = 0° straight ahead. The hall is square, its walls 2 from the eye, the ceiling 2.6 above eye level and the floor 1.5 below. Lengths along the horizon are true arc lengths: 1° = f·π/180 = ' + fmt(f * D2R, 2) + '.', () => {
        k.seg(k.pt(xL, 0), k.pt(xR, 0), { cls: 'given' }); k.point(HL, 'O', 'se');
        k.label(k.pt(xL, 0), 'horizon', 'ne', { upright: true, size: 0.75 });
        k.seg(k.pt(0, -Yc(0)), k.pt(0, Yc(0)), { cls: 'cons' });
        const gA = k.pt(xL, -Yc(0) * 1.35), gB = k.pt(xL + f, -Yc(0) * 1.35);
        k.seg(gA, gB, { cls: 'given' }); k.tick(gA, k.pt(1, 0)); k.tick(gB, k.pt(1, 0)); k.dim(gA, gB, 'f', { dist: 1.1 });
        const c = k.pt(xR - 60, -Yc(0) * 1.32), s = 17;                        // the plan, small
        k.rect(c.x - s, c.y - s, c.x + s, c.y + s, { cls: 'given' }); k.point(c, '', 'n'); k.label(k.pt(c.x + s * 1.3, c.y), 'plan', 'e', { upright: true, size: 0.7 });
        k.frame(xL - 12, -Yc(0) * 1.62, xR + 40, Yc(0) * 1.18);
      });
      k.step('dividers', 'Step off the azimuth every 15° either side of O: the marks are f·15° = ' + fmt(f * 15 * D2R, 2) + ' apart, out to ±45°, the width of the front wall.', () => {
        W.forEach(w => { if (w) k.dot(k.pt(X(w), 0), { r: 0.7 }); });
        k.label(k.pt(X(45), 0), '45°', 'se', { upright: true, size: 0.7 }); k.label(k.pt(X(-45), 0), '−45°', 'sw', { upright: true, size: 0.7 });
      });
      k.step('square', 'Through each mark draw a vertical with the set square. On the cylinder a vertical line of the room is a vertical straight line.', () => {
        W.forEach(w => { if (w) k.seg(k.pt(X(w), -Yc(0) * 1.05), k.pt(X(w), Yc(0) * 1.05), { cls: 'cons' }); });
      });
      k.step('ruler', 'Lay off the ceiling heights y = f·h·cos(w)/d on the verticals, w being the angle from the wall\'s normal: ' + [0, 15, 30, 45].map(w => fmt(Yc(w))).join(', ') + ' for w = 0°, 15°, 30°, 45°. Do the same below the horizon with the floor heights ' + [0, 15, 30, 45].map(w => fmt(-Yf(w))).join(', ') + '.', () => {
        W.forEach(w => { k.dot(k.pt(X(w), Yc(w)), { r: 0.7 }); k.dot(k.pt(X(w), Yf(w)), { r: 0.7 }); });
      });
      k.step('pencil', 'Trace the ceiling edge of the front wall through the seven points, and the floor edge: two arches, flat-topped at the middle and falling towards the corners at ±45°.', () => {
        k.smooth(W.map(w => k.pt(X(w), Yc(w))), { cls: 'curve', n: 16 }); k.smooth(W.map(w => k.pt(X(w), Yf(w))), { cls: 'curve', n: 16 });
      });
      k.step('dividers', 'The room repeats every 90°: carry the width of the front wall, f·90° = ' + fmt(f * 90 * D2R, 1) + ', to the right and to the left to find the middles of the side walls at u = ±90° and of the back wall at u = ±180°.', () => {
        [-180, -90, 90, 180].forEach(u => k.dot(k.pt(X(u), 0), { r: 0.7 }));
        k.label(k.pt(X(90), 0), '90°', 'se', { upright: true, size: 0.7 }); k.label(k.pt(X(-90), 0), '−90°', 'sw', { upright: true, size: 0.7 });
      });
      k.step('pencil', 'Copy the two arches onto the other walls (the back wall is cut by the ends of the strip): the ceiling and floor edges all the way round.', () => {
        [-90, 90].forEach(u0 => { k.smooth(W.map(w => k.pt(X(u0 + w), Yc(w))), { cls: 'curve', n: 16 }); k.smooth(W.map(w => k.pt(X(u0 + w), Yf(w))), { cls: 'curve', n: 16 }); });
        [-180, 180].forEach(u0 => { const sgn = u0 < 0 ? 1 : -1; const half = W.filter(w => sgn * w >= 0); k.smooth(half.map(w => k.pt(X(u0 + w), Yc(w))), { cls: 'curve', n: 16 }); k.smooth(half.map(w => k.pt(X(u0 + w), Yf(w))), { cls: 'curve', n: 16 }); });
      });
      k.step('pencil', 'Line in the four vertical corners of the room, at u = ±45° and ±135°, from the floor arch up to the ceiling arch: the cusps where two arches meet.', () => {
        [-135, -45, 45, 135].forEach(u => k.seg(k.pt(X(u), Yf(45)), k.pt(X(u), Yc(45)), { cls: 'thick' }));
      });
      k.note('The vanishing points of the walls\' horizontal directions are on the horizon: V_1 straight ahead (u = 0°), V_2 to the right (90°), V_3 behind (±180°), V_4 to the left (−90°). A line of the front wall that is horizontal and parallel to the picture plane in an ordinary photograph is here an arch; only the horizon itself stays straight.', () => {
        [[0, 'V_1'], [90, 'V_2'], [-90, 'V_4'], [180, 'V_3']].forEach(([u, t]) => { k.point(k.pt(X(u), 0), t, { at: 'n', open: true }); });
      });
    }
  });

  /* ================================================================ cylinder from a photograph */
  Hyper.construction({
    id: 'mp-cylinder-from-photo',
    title: 'Rolling a flat photograph onto the cylinder',
    tags: ['panorama', 'cylindrical', 'stitching', 'dividers', 'arc'],
    note: 'A point of a flat photograph with coordinates (x\', y\') — measured from the principal point, the photograph at distance f from the lens — lies at the azimuth u = arctan(x\'/f). Rolled onto the cylinder of radius f it goes to x = f·u (the arc length, hence the rectified arc) and to y = y\'·cos u (the ray is longer by 1/cos u, so the height is shrunk by cos u). A horizontal line of the photograph therefore becomes an arch, and a vertical line stays vertical. This is the first step of every stitching program.',
    build(k) {
      const g = k.g, f = 60, c = 45, sy = -100;                  // sy: the horizon of the strip
      const O = k.pt(0, 0), A = k.pt(0, f);
      const ks = [-3, -2, -1, 0, 1, 2, 3], xp = j => 30 * j, u = j => atan(xp(j) / f);
      const onT = j => k.pt(xp(j), f), onC = j => g.polar(O, f, PI / 2 - u(j));
      const Q = j => k.pt(f * u(j), sy);
      k.given('The lens at O, the photograph seen edge-on as the line T at distance f = 60 (its marks every 30 from the centre A), and the cylinder: the circle of radius f about O. Below, the line B is the horizon of the unrolled strip.', () => {
        k.arc(O, f, 20 * D2R, 160 * D2R, { cls: 'given' }); k.point(O, 'O', 'se');
        k.seg(k.pt(-110, f), k.pt(110, f), { cls: 'given' }); k.label(k.pt(112, f), 'T', 'e', { upright: true });
        k.point(A, 'A', 'n');
        ks.forEach(j => { if (j) { k.dot(onT(j), { r: 0.7 }); k.label(onT(j), String(xp(j)), 'n', { upright: true, size: 0.65 }); } });
        k.seg(O, A, { cls: 'cons' });
        k.seg(k.pt(-100, sy), k.pt(100, sy), { cls: 'given' }); k.label(k.pt(102, sy), 'B', 'e', { upright: true }); k.point(k.pt(0, sy), 'O\'', 'sw');
        k.frame(-120, sy - 14, 125, f + 22);
      });
      k.step('straightedge', 'Draw the rays from O through the marks of T. Each cuts the circle at P_j: the point of the cylinder that the photograph\'s point is rolled to.', () => {
        ks.forEach(j => { if (j) { k.seg(O, onT(j), { cls: 'cons' }); k.point(onC(j), j > 0 ? 'P_' + j : '', { at: 'ne', lo: { size: 0.8 } }); } });
      });
      k.step('dividers', 'Rectify the arc A P_j: step the dividers round the circle from A to P_j in small equal steps, and lay the same number of steps along B from O\'. The marks are f·u apart: ' + [1, 2, 3].map(j => fmt(f * u(j), 1)).join(', ') + ' (u = 26.6°, 45°, 56.3°).', () => {
        ks.forEach(j => { if (j) k.point(Q(j), j > 0 ? 'Q_' + j : '', { at: 'sw', lo: { size: 0.75 } }); });
      });
      k.step('square', 'Through the marks on B draw verticals: the columns of the rolled picture.', () => {
        ks.forEach(j => { if (j) k.seg(k.pt(Q(j).x, sy), k.pt(Q(j).x, sy + c + 6), { cls: 'cons' }); });
      });
      k.step('ruler', 'The photograph\'s horizontal line at height y\' = 45 above its centre: on each column lay off 45·cos u =' + [0, 1, 2, 3].map(j => fmt(c * cos(u(j)), 1)).join(', ') + ' for the marks 0, 30, 60, 90.', () => {
        ks.forEach(j => k.dot(k.pt(Q(j).x, sy + c * cos(u(j))), { r: 0.7 }));
      });
      k.step('pencil', 'Trace the curve through the points: the straight line of the photograph has become an arch.', () => {
        k.smooth(ks.map(j => k.pt(Q(j).x, sy + c * cos(u(j)))), { cls: 'curve', n: 16 });
      });
      k.note('Dashed: the line as it is in the photograph (a straight line at height 45). The rolled line falls away from it at the sides by the factor cos u.', () => {
        k.seg(k.pt(Q(-3).x, sy + c), k.pt(Q(3).x, sy + c), { cls: 'aux', dash: true });
      });
    }
  });

  /* ================================================================ mirror ball */
  Hyper.construction({
    id: 'mp-mirror-ball',
    title: 'A room in a mirror ball: Escher\'s sphere',
    tags: ['Escher', 'sphere', 'protractor', 'compass', 'reflection'],
    note: 'Seen from far away, a ball of radius a is an orthographic picture of a sphere of directions. The ray from the eye to the point of the ball whose radius makes the angle β with the line of sight is reflected through 2β, so a point of the room in the direction θ\' (measured from the direction to the eye) appears where β = θ\'/2, at distance a·sin β from the centre of the picture. This is the equisolid-angle mapping: the centre shows the viewer himself (θ\' = 0), the rim shows the room straight behind the ball (θ\' = 180°).',
    build(k) {
      const g = k.g, a = 100, O = k.pt(0, 0), Oc = k.pt(3.15 * a, 0), thw = 70 * D2R;
      const ths = [30, 70, 90, 120].map(t => t * D2R);
      const Pw = g.polar(O, a, thw / 2), Y = P => k.pt(0, P.y);
      k.given('The ball (a circle of radius a = 100 in section), the line to the eye, far away to the right, and the picture line: the vertical diameter, which is the ball seen edge-on. A point S of the room lies in the direction 70° from the line to the eye.', () => {
        k.circle(O, a, { cls: 'given' }); k.point(O, 'O', 'sw');
        k.arrow(O, k.pt(1.6 * a, 0), { cls: 'given' }); k.label(k.pt(1.35 * a, 0), 'to the eye', 'n', { upright: true, size: 0.8 });
        k.seg(k.pt(0, -a * 1.1), k.pt(0, a * 1.1), { cls: 'cons', dash: true }); k.label(k.pt(0, -a * 1.1), 'picture', 's', { upright: true, size: 0.8 });
        k.seg(O, g.polar(O, 1.5 * a, thw), { cls: 'given' }); k.point(g.polar(O, 1.5 * a, thw), 'S', 'ne');
        k.frame(-a * 1.3, -a * 1.3, Oc.x + a * 1.2, a * 1.55);
      });
      k.step('dividers', 'The angle V O S measures 70°. To find where S is seen, bisect it: with the dividers mark the points U and W at the same distance (0.7a) from O on the two sides.', () => {
        k.point(g.polar(O, 0.7 * a, 0), 'U', 'se'); k.point(g.polar(O, 0.7 * a, thw), 'W', 'nw');
      });
      k.step('compass', 'With the same radius draw arcs about U and about W; they cross at X on the bisector.', () => {
        const U = g.polar(O, 0.7 * a, 0), W = g.polar(O, 0.7 * a, thw), r = 0.62 * a;
        const X = g.circleCircle(U, r, W, r).sort((p, q) => g.dist(q, O) - g.dist(p, O))[0], ua = g.angleOf(g.sub(X, U)), wa = g.angleOf(g.sub(X, W));
        k.arc(U, r, ua - 0.38, ua + 0.38, { cls: 'cons' }); k.arc(W, r, wa - 0.38, wa + 0.38, { cls: 'cons' }); k.point(X, 'X', 'sw');
      });
      k.step('straightedge', 'Draw O X and extend it to the ball: P_2 is the point of the ball where S is seen. The radius O P_2 is the normal of the mirror there, and it halves the angle between the eye and S: β = 35°.', () => {
        k.seg(O, Pw, { cls: 'cons' }); k.point(Pw, 'P_2', { at: 'ne', lo: { size: 0.9 } }); k.angle(O, k.pt(1, 0), Pw, { label: 'β', r: 1.3, labelDist: 1.5 });
      });
      k.step('square', 'The eye looks along the horizontals: from P_2 draw the horizontal to the picture line. Its height above O is a·sin β = ' + fmt(Pw.y) + ': the place of S in the picture.', () => {
        k.seg(Pw, Y(Pw), { cls: 'cons' }); k.point(Y(Pw), 'S\'', 'nw');
      });
      k.step('protractor', 'Repeat for the directions θ\' = 30°, 90° and 120°: lay off half of each angle (15°, 45°, 60°) from the line to the eye and mark the points P_1, P_3 and P_4 on the ball.', () => {
        [0, 2, 3].forEach(i => k.point(g.polar(O, a, ths[i] / 2), 'P_' + (i + 1), { at: 'ne', lo: { size: 0.9 } }));
      });
      k.step('square', 'Horizontals from P_1, P_3 and P_4 to the picture line give the heights a·sin β: ' + [0, 2, 3].map(i => fmt(a * sin(ths[i] / 2))).join(', ') + '.', () => {
        [0, 2, 3].forEach(i => { const P = g.polar(O, a, ths[i] / 2); k.seg(P, Y(P), { cls: 'cons' }); });
      });
      k.step('dividers', 'Carry the four heights ' + ths.map(t => fmt(a * sin(t / 2))).join(', ') + ' with the dividers to the right, onto a vertical radius of the picture of the ball, centred at O_p.', () => {
        k.point(Oc, 'O_p', 'sw');
        ths.forEach(t => k.dot(k.pt(Oc.x, a * sin(t / 2)), { r: 0.7 }));
      });
      k.step('compass', 'With centre O_p draw the rings through those marks, and the rim (radius a). Each ring is the set of directions at one angle θ\' from the viewer.', () => {
        ths.forEach(t => k.circle(Oc, a * sin(t / 2), { cls: 'curve' })); k.circle(Oc, a, { cls: 'given' });
      });
      k.note('From the centre outwards the rings are 0° (the viewer himself), 30°, 70°, 90°, 120° and, at the rim, 180° — the room straight behind the ball. The rings crowd towards the rim: every direction within 60° of straight behind is squeezed into the last narrow ring.', () => {
        ths.forEach((t, i) => k.label(k.pt(Oc.x + (i % 2 ? -2 : 2), a * sin(t / 2)), Math.round(t / D2R) + '°', i % 2 ? 'nw' : 'ne', { upright: true, size: 0.65 }));
        k.label(k.pt(Oc.x + 2, a), '180°', 'ne', { upright: true, size: 0.65 });
      });
    }
  });

  /* ================================================================ tangent scale */
  Hyper.construction({
    id: 'mp-tangent-scale',
    title: 'Why the flat picture stretches: equal angles on the tangent line',
    tags: ['rectilinear', 'wide angle', 'protractor', 'limits'],
    note: 'On a flat picture line at distance f from the eye the ray at angle θ from the axis lands at r = f·tan θ. Equal steps of angle therefore give unequal steps of length, growing without limit: 15° steps give 16, 19, 25, 44 and 120 units for f = 60, and the ray at 90° never meets the line. The circle of radius f round the eye is the cylinder: on it equal angles are equal arcs.',
    build(k) {
      const g = k.g, f = 60, O = k.pt(0, 0), ths = [15, 30, 45, 60, 75];
      const hit = t => k.pt(f * tan(t * D2R), f), E = t => g.polar(O, 38, PI / 2 - t * D2R);
      k.given('The eye O, the axis (vertical), and the picture line T at distance f = 60 from the eye, touching the circle of radius f at A.', () => {
        k.point(O, 'O', 'sw'); k.seg(O, k.pt(0, f), { cls: 'given' }); k.seg(k.pt(-8, f), k.pt(245, f), { cls: 'given' });
        k.point(k.pt(0, f), 'A', 'nw'); k.label(k.pt(245, f), 'T', 'ne', { upright: true });
        k.dim(O, k.pt(0, f), 'f', { dist: 1.2 });
        k.frame(-20, -8, 250, 80);
      });
      k.step('protractor', 'From the axis lay off 15°, 30°, 45°, 60° and 75° to the right, marking each on a small arc about O.', () => {
        ths.forEach(t => k.point(E(t), t + '°', { at: 'se', lo: { upright: true, size: 0.65, dist: 0.9 } }));
        k.arc(O, 38, PI / 2 - 75 * D2R, PI / 2, { cls: 'aux' });
      });
      k.step('straightedge', 'Extend each ray to the picture line T. The marks fall at f·tan θ: ' + ths.map(t => fmt(f * tan(t * D2R))).join(', ') + ' from A.', () => {
        ths.forEach(t => { k.seg(O, hit(t), { cls: 'cons' }); k.point(hit(t), '', 'n'); });
      });
      k.step('ruler', 'Check the gaps between neighbouring marks with the scale: ' + [0].concat(ths).slice(1).map((t, i) => fmt(f * (tan(t * D2R) - tan(([0].concat(ths))[i] * D2R)))).join(', ') + '. Equal angles, unequal lengths — the picture stretches towards its edge.', () => {
        [0].concat(ths).forEach((t, i, arr) => { if (i) k.dim(hit(arr[i - 1]), hit(t), fmt(f * (tan(t * D2R) - tan(arr[i - 1] * D2R))), { side: 'left', dist: 0.9, size: 0.65 }); });
      });
      k.step('compass', 'For comparison draw the circle of radius f about O, the cylinder round the eye. The rays cut it in points with equal arcs between them (15° of arc = 15.7 each).', () => {
        k.arc(O, f, PI / 2 - 75 * D2R, PI / 2, { cls: 'curve' });
        ths.forEach(t => k.dot(g.polar(O, f, PI / 2 - t * D2R), { r: 0.7 }));
      });
      k.step('straightedge', 'The ray at 90° runs parallel to T and never meets it: no flat picture can show a field of 180°.', () => {
        k.ray(O, k.pt(100, 0), { cls: 'aux', dash: true }); k.label(k.pt(230, 0), '90°: parallel to T', 'n', { upright: true, size: 0.75 });
      });
      k.step('pencil', 'Line in the segments of T between the marks, heavier as they lengthen.', () => {
        [0].concat(ths).forEach((t, i, arr) => { if (i) k.seg(hit(arr[i - 1]), hit(t), { cls: 'thick' }); });
      });
    }
  });
})();
