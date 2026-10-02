/* HYPER-PROJECTIONS · constructions/drawing-and-building.js — constructions of the topic "Drawing and building".
 *
 *   db-part-drawing        a bracket in three views (third angle) and a section: projectors, mitre line, hatching, dimensions, title block
 *   db-house-set           plan, section and elevation of a small house lined up on one sheet; the roof's true slope in the section
 *   db-exploded-assembly   a three-part assembly pulled apart along its axis in an isometric drawing, with balloons
 *   db-patent-figure       a patent-style figure: isometric view and plan, reference numerals and lead lines (given figure with notes)
 *   db-traverse            a closed surveyor's traverse plotted from bearings and distances; the closing error and its adjustment
 *   db-contours            a site plan with contours interpolated from spot heights, and a profile cut from them
 *   db-elbow-development   the development (pattern) of a two-piece 90° mitre elbow: elements, stretch-out line, dividers
 *   db-cone-development    the development of a truncated cone: a sector found with compass and protractor
 * Every shape is computed (k.g, closed formulas); every step names the tool it is made with.
 */
(function () {
  'use strict';
  const PI = Math.PI, D2R = PI / 180, R2D = 180 / PI;
  const CL = '5 1.2 0.8 1.2';                          // dash-dot pattern of a centre line, in sheet units (about mm)

  /* a dimension: extension lines, the dimension line with its arrowheads, the figure written on it */
  function dimension(k, A, B, off, text, o) {
    o = o || {};
    const g = k.g, u = g.unit(g.sub(B, A)), n = g.perp(u), e = off < 0 ? -1 : 1;
    const a = g.add(A, g.mul(n, off)), b = g.add(B, g.mul(n, off));
    const gap = o.gap == null ? 1.2 : o.gap, over = o.over == null ? 1.8 : o.over;
    k.seg(g.add(A, g.mul(n, e * gap)), g.add(a, g.mul(n, e * over)), { cls: 'cons' });
    k.seg(g.add(B, g.mul(n, e * gap)), g.add(b, g.mul(n, e * over)), { cls: 'cons' });
    k.seg(a, b, { cls: 'cons' });
    k.head(a, g.mul(u, -1), { cls: 'cons', size: o.head || 1 }); k.head(b, u, { cls: 'cons', size: o.head || 1 });
    const m = g.mid(a, b);
    let ang = g.rad(g.angleOf(u)); if (ang > 90) ang -= 180; if (ang <= -90) ang += 180;
    k.text(m.x, m.y, text, { upright: true, bg: true, size: o.size || 0.75, rotate: ang });
  }
  const chain = (k, a, b, o) => k.seg(a, b, Object.assign({ cls: 'aux', dash: CL }, o || {}));

  /* ------------------------------------------------------------------------------------------ the bracket */
  Hyper.construction({
    id: 'db-part-drawing',
    title: 'A bracket in three views and a section: the third-angle layout',
    tags: ['orthographic', 'third angle', 'section', 'mitre line', 'ISO 128'],
    note: 'Drawn full size. Third-angle layout (the American and Japanese convention): the top view above the front view, the right view to its right. ISO drawings usually use first angle, where the top view goes below and the right view to the left; the projection symbol in the title block tells the reader which. The 45° mitre line turns the depths of the top view into the widths of the right view. Section A–A is the front view redrawn as if the bracket were cut by the plane through both hole axes: the cut material is hatched with thin 45° lines and the hidden lines of the holes disappear.',
    build(k) {
      const g = k.g, P = k.pt;
      const Wd = 80, Ht = 50, De = 40, Bt = 15, Up = 15, GAP = 30;        // the bracket: width, height, depth, base thickness, upright width
      const xH = 50, rV = 6, yH = 35, rH = 4;                              // vertical hole Ø12 at x = 50; horizontal hole Ø8 at height 35
      const yT = Ht + GAP, xR = Wd + GAP;                                  // front edge of the top view (80) and of the right view (110) on the sheet
      const tY = t => yT + t, tX = t => xR + t;                            // a depth t behind the front face, as it appears in each view
      const depths = [0, De / 2 - rV, De / 2, De / 2 + rV, De];           // 0, 14, 20, 26, 40
      k.given('The front view of the bracket drawn full size, and the data of the part: depth 40; a Ø12 hole through the base, its axis 50 from the left edge and centred in the depth; a Ø8 hole through the upright, its axis 35 above the base and centred in the depth. Third angle: the top view will go above, the right view to the right.', () => {
        k.rect(-40, -42, 232, 148, { cls: 'cons' });
        k.poly([P(0, 0), P(Wd, 0), P(Wd, Bt), P(Up, Bt), P(Up, Ht), P(0, Ht)], { close: true, cls: 'thick' });
        k.text(160, 140, 'THE PART', { anchor: 'start', upright: true, bold: true, size: 0.8 });
        ['depth 40', 'Ø12 hole in the base,', 'axis at x = 50', 'Ø8 hole in the upright,', 'axis at height 35', 'both centred in the depth'].forEach((t, i) => k.text(160, 132 - 6.5 * i, t, { anchor: 'start', upright: true, size: 0.7 }));
        chain(k, P(xH, -4), P(xH, Bt + 4)); chain(k, P(-4, yH), P(Up + 4, yH));
        k.frame(-40, -42, 232, 148); k.fontScale(0.8);
      });
      k.step('tee', 'The top view goes above the front view. With the T-square and a set square carry every vertical feature of the front view straight up as a projector: the left edge, the upright (x = 15), the edges of the Ø12 hole (44 and 56), its axis (50) and the right edge.', () => {
        [[0, Ht], [Up, Ht], [xH - rV, Bt], [xH, Bt], [xH + rV, Bt], [Wd, Bt]].forEach(([x, y0]) => k.seg(P(x, y0), P(x, tY(De) + 4), x === xH ? { cls: 'aux', dash: CL } : { cls: 'cons' }));
      });
      k.step('ruler', 'Leave 30 for dimensions, then lay off the depth 40 above it: the front edge of the top view is at 80, the back edge at 120.', () => {
        const a = P(-24, Ht), b = P(-24, yT), c = P(-24, yT + De);
        k.seg(a, c, { cls: 'given' }); [a, b, c].forEach(p => k.tick(p, P(1, 0)));
        k.text(-30, (Ht + yT) / 2, '30', { upright: true, size: 0.7 }); k.text(-30, yT + De / 2, '40', { upright: true, size: 0.7 });
      });
      k.step('tee', 'Draw the front and back edges of the top view across the projectors with the T-square.', () => {
        [yT, yT + De].forEach(y => k.seg(P(0, y), P(Wd, y), { cls: 'cons' }));
      });
      k.step('dividers', 'Bisect the depth with the dividers: the line at 100 is the axis of both holes. It meets the axis projector at C, the centre of the Ø12 hole.', () => {
        chain(k, P(-4, tY(De / 2)), P(Wd + 4, tY(De / 2)));
        k.point(P(xH, tY(De / 2)), 'C', { at: 'sw', lo: { upright: true, size: 0.75 } });
      });
      k.step('compass', 'With the compass at C draw the Ø12 hole (radius 6): in the top view it shows its true shape.', () => {
        k.circle(P(xH, tY(De / 2)), rV, { cls: 'thick' });
      });
      k.step('square', 'The right view lies to the right of the front view. With the 45° set square draw the mitre line through M, the corner where the front edge of the top view (y = 80) meets the left edge of the right view (x = 110).', () => {
        k.seg(P(xR - 8, yT - 8), P(xR + De + 2, yT + De + 2), { cls: 'cons' });
        k.point(P(xR, yT), 'M', { at: 'nw', lo: { upright: true, size: 0.75 } });
      });
      k.step('tee', 'Carry the heights of the front view across to the right view: the bottom (0), the base top (15), the axis of the Ø8 hole (35) and the top (50).', () => {
        [0, Bt, yH, Ht].forEach(y => k.seg(P(Wd, y), P(xR + De + 4, y), y === yH ? { cls: 'aux', dash: CL } : { cls: 'cons' }));
      });
      k.step('tee', 'Carry the depths of the top view across to the mitre line: the front edge, the edges of the Ø12 hole, the mid-depth axis and the back edge.', () => {
        depths.forEach(t => k.seg(P(Wd, tY(t)), P(tX(t), tY(t)), t === De / 2 ? { cls: 'aux', dash: CL } : { cls: 'cons' }));
      });
      k.step('square', 'At the mitre line turn the corner: draw verticals down from each of those points into the right view. A depth in the top view has become a width in the right view.', () => {
        depths.forEach(t => k.seg(P(tX(t), tY(t)), P(tX(t), -4), t === De / 2 ? { cls: 'aux', dash: CL } : { cls: 'cons' }));
      });
      k.step('compass', 'The Ø8 hole is seen end-on in the right view: a circle of radius 4 about the crossing of the axes (130, 35).', () => {
        k.circle(P(tX(De / 2), yH), rH, { cls: 'thick' });
      });
      k.step('pencil', 'Line in the right view: the outline, the line where the upright face meets the base top (y = 15), and the Ø12 hole as two dashed hidden lines.', () => {
        k.rect(xR, 0, xR + De, Ht, { cls: 'thick' });
        k.seg(P(xR, Bt), P(xR + De, Bt), { cls: 'thick' });
        [tX(De / 2 - rV), tX(De / 2 + rV)].forEach(x => k.seg(P(x, 0), P(x, Bt), { cls: 'cons', dash: true }));
      });
      k.step('pencil', 'Line in the top view: the outline, the edge of the upright (x = 15, seen from above) and the Ø8 hole as two hidden lines under the upright.', () => {
        k.rect(0, yT, Wd, yT + De, { cls: 'thick' });
        k.seg(P(Up, yT), P(Up, yT + De), { cls: 'thick' });
        [tY(De / 2 - rH), tY(De / 2 + rH)].forEach(y => k.seg(P(0, y), P(Up, y), { cls: 'cons', dash: true }));
      });
      k.step('pencil', 'Back in the front view, line in what cannot be seen: the Ø12 hole (x = 44 and 56) and the Ø8 hole (y = 31 and 39) as hidden lines, 3 mm dashes.', () => {
        [xH - rV, xH + rV].forEach(x => k.seg(P(x, 0), P(x, Bt), { cls: 'cons', dash: true }));
        [yH - rH, yH + rH].forEach(y => k.seg(P(0, y), P(Up, y), { cls: 'cons', dash: true }));
      });
      k.note('Dimensions: each size once, outside the view, between extension lines, with arrowheads and the figure on the line; Ø in front of a diameter.', () => {
        dimension(k, P(0, 0), P(Wd, 0), -9, '80');
        dimension(k, P(0, 0), P(xH, 0), -19, '50');
        dimension(k, P(0, 0), P(0, Ht), 9, '50');
        dimension(k, P(xR, 0), P(xR + De, 0), -9, '40');
        dimension(k, P(xR + De, 0), P(xR + De, Bt), -8, '15');
        dimension(k, P(xR + De, 0), P(xR + De, yH), -17, '35');
        const c1 = g.polar(P(xH, tY(De / 2)), rV, 0.9);
        k.seg(c1, P(64, 112), { cls: 'cons' }); k.text(66, 112, 'Ø12', { anchor: 'start', upright: true, size: 0.75 });
        const c2 = g.polar(P(tX(De / 2), yH), rH, 0.5);
        k.seg(c2, P(156, 44), { cls: 'cons' }); k.text(158, 44, 'Ø8', { anchor: 'start', upright: true, size: 0.75 });
        k.text(Wd / 2, tY(De) + 7, 'TOP VIEW', { upright: true, size: 0.62 }); k.text(xR + De / 2, Ht + 7, 'RIGHT VIEW', { upright: true, size: 0.62 });
      });
      k.note('Section A–A. Mark the cutting plane on the top view: a chain line along the axis of the holes, thick at its ends, with arrows pointing the way you look (towards the front view) and the letter A at each end.', () => {
        const y = tY(De / 2);
        chain(k, P(-3, y), P(Wd + 3, y), { cls: 'cons' });
        [[-12, -3], [Wd + 3, Wd + 12]].forEach(([a, b]) => k.seg(P(a, y), P(b, y), { cls: 'thick' }));
        k.arrow(P(-10, y), P(-10, y - 8), { cls: 'thick' }); k.arrow(P(Wd + 10, y), P(Wd + 10, y - 8), { cls: 'thick' });
        k.text(-10, y - 15, 'A', { upright: true, size: 0.8 }); k.text(Wd + 10, y - 15, 'A', { upright: true, size: 0.8 });
      });
      k.note('Redraw the front view as the section A–A: the material the plane cuts is hatched with thin 45° lines, equally spaced; the holes are now cut open, so their hidden lines are gone and their edges are full lines.', () => {
        const regions = [
          [P(0, 0), P(xH - rV, 0), P(xH - rV, Bt), P(Up, Bt), P(Up, yH - rH), P(0, yH - rH)],
          [P(0, yH + rH), P(Up, yH + rH), P(Up, Ht), P(0, Ht)],
          [P(xH + rV, 0), P(Wd, 0), P(Wd, Bt), P(xH + rV, Bt)]
        ];
        regions.forEach(r => { k.hatch(r, { fill: '#fff', angle: PI / 4, gap: 0.9 }); k.poly(r, { close: true, cls: 'thick' }); });
        chain(k, P(xH, -4), P(xH, Bt + 4)); chain(k, P(-4, yH), P(Up + 4, yH));
        k.text(Wd / 2, -30, 'SECTION A–A', { upright: true, size: 0.62, bg: true });
      });
      k.note('The title block carries the projection symbol: a truncated cone seen from the front and from the left. Circles to the left of the cone mean the left view lies to the left: third angle. Circles to the right would mean first angle.', () => {
        k.rect(145, -42, 232, -16, { cls: 'given' });
        k.seg(P(175, -42), P(175, -16), { cls: 'given' }); k.seg(P(175, -29), P(232, -29), { cls: 'given' });
        k.circle(P(152, -29), 3, { cls: 'given' }); k.circle(P(152, -29), 5.5, { cls: 'given' });
        k.poly([P(159, -32), P(172, -34.5), P(172, -23.5), P(159, -26)], { close: true, cls: 'given' });
        chain(k, P(145.8, -29), P(174, -29), { cls: 'cons' });
        k.text(203.5, -22.5, 'BRACKET   1 : 1', { upright: true, size: 0.7 }); k.text(203.5, -35.5, 'THIRD ANGLE   mm', { upright: true, size: 0.7 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------ the house */
  Hyper.construction({
    id: 'db-house-set',
    title: 'Plan, elevation and section of a small house, lined up on one sheet',
    tags: ['architecture', 'plan', 'elevation', 'section', 'roof pitch', 'projectors', 'scale 1:50'],
    note: 'Scale 1 : 50, so 1 m is 20 on the sheet. The elevation (looking at the long front) sits above the plan and shares its widths through vertical projectors; the section A–A (cut across the house, looking left) sits beside the elevation and shares its heights through horizontal projectors; the depths come from the plan through quarter-circle arcs about the corner K. The roof is seen as a plain band in the elevation and as a shortened slope in the plan: only the section, which cuts across the ridge, shows its true pitch of 30° and its true rafter length. Cut walls are filled solid, as architects do; the hatched strip is the concrete slab.',
    build(k) {
      const g = k.g, P = k.pt, sc = 20;
      const T30 = Math.tan(30 * D2R), C30 = Math.cos(30 * D2R);
      const gY = -0.15 * sc, hSill = 0.9 * sc, hHead = 2.1 * sc, hPl = 2.7 * sc;     // ground (underside of the slab), sill, head, wall plate
      const hEav = hPl - 0.5 * sc * T30, hRid = hPl + 3 * sc * T30, tv = 0.15 * sc / C30;   // eaves underside, ridge underside, roof thickness measured vertically
      const yPT = gY - 28, yPB = yPT - 6 * sc, py = t => yPB + sc * t;               // the plan: back wall at the top, front wall at the bottom
      const xs0 = 200, px = t => xs0 + sc * t, Wx = 8 * sc, xCut = 5.5 * sc;
      const FILL = '#3d3d3d';
      const wall = (x0, x1, t0, t1) => [P(x0 * sc, py(t0)), P(x1 * sc, py(t0)), P(x1 * sc, py(t1)), P(x0 * sc, py(t1))];
      const planWalls = [wall(0, 0.3, 0, 6), wall(7.7, 8, 0, 6), wall(0.3, 1, 0, 0.3), wall(2, 4.5, 0, 0.3), wall(6.5, 7.7, 0, 0.3), wall(0.3, 7.7, 5.7, 6)];
      const drawPlan = o => planWalls.forEach(w => k.poly(w, Object.assign({ close: true, cls: 'thick', fill: FILL }, o || {})));
      k.given('The plan, drawn first: walls 0.3 thick, a door 1.0 wide, a window 2.0 wide, the roof overhang 0.5 (dashed, it is above the cut), and the cutting line A–A through the window. Data: eaves (top of wall) 2.7 above the floor, roof pitch 30°, ridge along the long side at mid-depth, sill 0.9, door and window heads 2.1.', () => {
        k.rect(-36, -178, 352, 132, { cls: 'cons' });
        drawPlan();
        k.rect(-0.3 * sc, py(-0.5), 8.3 * sc, py(6.5), { cls: 'cons', dash: true });
        k.seg(P(90, py(0.15)), P(130, py(0.15)), { cls: 'cons' });
        const hinge = P(40, py(0.3));
        k.seg(hinge, P(40, py(0.3) + 20), { cls: 'cons' }); k.arc(hinge, 20, PI / 2, PI, { cls: 'cons' });
        k.seg(P(-20, gY), P(Wx + 20, gY), { cls: 'thick' });
        k.text(Wx / 2, py(3), 'ONE ROOM', { upright: true, size: 0.7 });
        k.seg(P(xCut, yPB - 12), P(xCut, yPT + 12), { cls: 'aux', dash: CL });
        [[yPB - 12, yPB - 5], [yPT + 5, yPT + 12]].forEach(([a, b]) => k.seg(P(xCut, a), P(xCut, b), { cls: 'thick' }));
        k.arrow(P(xCut, yPB - 12), P(xCut - 9, yPB - 12), { cls: 'thick' }); k.arrow(P(xCut, yPT + 12), P(xCut - 9, yPT + 12), { cls: 'thick' });
        k.text(xCut - 5, yPB - 19, 'A', { upright: true, size: 0.8 }); k.text(xCut - 5, yPT + 19, 'A', { upright: true, size: 0.8 });
        k.text(-30, 126, 'THE HOUSE', { anchor: 'start', upright: true, bold: true, size: 0.8 });
        ['8.0 × 6.0 m outside, walls 0.3', 'eaves 2.7 above the floor, roof pitch 30°', 'overhang 0.5, ridge along the length, at mid-depth', 'door 1.0 × 2.1, window 2.0 wide, sill 0.9, head 2.1'].forEach((t, i) => k.text(i % 2 ? 130 : -30, 118 - 6.5 * (i >> 1), t, { anchor: 'start', upright: true, size: 0.62 }));
        k.frame(-36, -178, 352, 132); k.fontScale(0.8);
      });
      k.step('tee', 'The elevation goes above the plan and shares its widths. With the T-square and a set square carry the wall faces, the door, the window, the cutting line and the roof overhang straight up as projectors.', () => {
        [-0.3, 0, 0.3, 1, 2, 4.5, 5.5, 6.5, 7.7, 8, 8.3].forEach(x => k.seg(P(x * sc, yPT), P(x * sc, 100), x === 5.5 ? { cls: 'aux', dash: CL } : { cls: 'cons' }));
      });
      k.step('ruler', 'Heights are measured upwards from the floor on a scale to the left: the underside of the slab (−0.15), the floor (0), the sill (0.9), the heads (2.1) and the top of the wall (2.7).', () => {
        const hs = [gY, 0, hSill, hHead, hPl];
        k.seg(P(-28, gY), P(-28, hPl), { cls: 'given' }); hs.forEach(h => k.tick(P(-28, h), P(1, 0)));
        [['0', 0], ['0.9', hSill], ['2.1', hHead], ['2.7', hPl]].forEach(([t, h]) => k.text(-31, h, t, { anchor: 'end', upright: true, size: 0.55 }));
      });
      k.step('tee', 'Draw those levels across the elevation and on to the section as horizontal projectors.', () => {
        [gY, 0, hSill, hHead, hPl].forEach(h => k.seg(P(-28, h), P(px(6.5) + 8, h), { cls: 'cons' }));
      });
      k.step('dividers', 'Carry the depth to the section. The plan is not beside the section but below it, so first run the faces of the plan across to a vertical through K, the front-left corner of the section: the front face (0), the inner faces (0.3 and 5.7) and the back face (6.0). Then bisect the depth to find the ridge axis at 3.0.', () => {
        const K = P(xs0, yPB);
        [0, 0.3, 5.7, 6].forEach(t => k.seg(P(Wx, py(t)), P(xs0, py(t)), { cls: 'cons' }));
        k.seg(K, P(xs0, py(6)), { cls: 'cons' }); k.point(K, 'K', { at: 'se', lo: { upright: true, size: 0.75 } });
        k.point(P(xs0, py(3)), '', { r: 0.8 });
      });
      k.step('compass', 'With the compass at K swing each of those points down to the horizontal through K: radii 6, 60, 114 and 120. The depths now lie along a horizontal line.', () => {
        const K = P(xs0, yPB);
        [0.3, 3, 5.7, 6].forEach(t => { k.arc(K, sc * t, 0, PI / 2, { cls: 'cons' }); k.point(P(px(t), yPB), '', { r: 0.7 }); });
        k.seg(K, P(px(6) + 6, yPB), { cls: 'cons' });
      });
      k.step('square', 'Draw verticals up from the swung points into the section: the front wall (200 to 206), the ridge axis (260) and the back wall (314 to 320). The front face is the line through K itself.', () => {
        [0, 0.3, 3, 5.7, 6].forEach(t => k.seg(P(px(t), yPB), P(px(t), 100), t === 3 ? { cls: 'aux', dash: CL } : { cls: 'cons' }));
      });
      k.step('dividers', 'Lay off the overhang, 0.5 (10 on the sheet), beyond the two outer wall faces along the line of the wall plate (y = 54): the eaves tips are at 190 and 330.', () => {
        const a = P(px(-0.5), hPl), b = P(px(6.5), hPl);
        k.seg(a, b, { cls: 'cons' }); k.point(a, 'E_1', { at: 'sw', lo: { upright: true, size: 0.7 } }); k.point(b, 'E_2', { at: 'se', lo: { upright: true, size: 0.7 } });
      });
      k.step('protractor', 'The pitch is true only here, in a plane that cuts across the ridge. At the top outer corner of the front wall W (the open dot at 200, 54) lay off 30° above the horizontal and draw the underside of the front slope up to the ridge axis; it cuts the axis at the ridge R and, extended to the left, runs 0.5 past the wall.', () => {
        const W = P(px(0), hPl), R = P(px(3), hRid), Eu = P(px(-0.5), hEav);
        k.seg(Eu, R, { cls: 'thick' }); k.dot(W, { open: true, r: 1.3 }); k.point(R, 'R', { at: 'n', lo: { upright: true, size: 0.7 } });
        k.angle(W, P(W.x + 1, W.y), R, { label: '30°', r: 2.4, labelDist: 1.3, cls: 'cons' });
      });
      k.step('straightedge', 'The back slope is the mirror image of the front one about the ridge axis: join R to the back eaves tip.', () => {
        k.seg(P(px(3), hRid), P(px(6.5), hEav), { cls: 'thick' });
      });
      k.step('square', 'The roof has thickness: draw the upper surface parallel to the underside, 0.15 (3 on the sheet) away measured square to the slope.', () => {
        const d = P(0, tv);
        k.seg(g.add(P(px(-0.5), hEav), d), g.add(P(px(3), hRid), d), { cls: 'thick' });
        k.seg(g.add(P(px(3), hRid), d), g.add(P(px(6.5), hEav), d), { cls: 'thick' });
        k.seg(P(px(-0.5), hEav), g.add(P(px(-0.5), hEav), d), { cls: 'thick' }); k.seg(P(px(6.5), hEav), g.add(P(px(6.5), hEav), d), { cls: 'thick' });
      });
      k.step('tee', 'Carry the eaves and the ridge heights back to the elevation as horizontals: the roof edge at 48.2 and the ridge at 92.1.', () => {
        [hEav, hRid + tv].forEach(h => k.seg(P(px(6.5) + 4, h), P(-0.3 * sc - 6, h), { cls: 'cons' }));
      });
      k.step('pencil', 'Line in the elevation: the ground, the wall below the eaves, the door, the window with its glazing bar, and the roof as a plain band from the eaves to the ridge.', () => {
        k.rect(0, gY, Wx, hEav, { cls: 'thick' });
        k.rect(1 * sc, 0, 2 * sc, hHead, { cls: 'thick' });
        k.rect(4.5 * sc, hSill, 6.5 * sc, hHead, { cls: 'thick' }); k.seg(P(5.5 * sc, hSill), P(5.5 * sc, hHead), { cls: 'thick' });
        k.rect(-0.3 * sc, hEav, 8.3 * sc, hRid + tv, { cls: 'thick' });
      });
      k.note('Cut elements are filled in. In the section: the slab (hatched), the front wall with the window opening through it (it is cut at x = 5.5), the back wall, and the roof. Beyond the cut nothing is drawn but the ceiling and floor lines.', () => {
        k.rect(px(0), gY, px(6), 0, { cls: 'thick' });
        k.hatch([P(px(0), gY), P(px(6), gY), P(px(6), 0), P(px(0), 0)], { angle: PI / 4, gap: 0.45 });
        [[px(0), 0, px(0.3), hSill], [px(0), hHead, px(0.3), hPl], [px(5.7), 0, px(6), hPl]].forEach(([a, b, c, d]) => k.poly([P(a, b), P(c, b), P(c, d), P(a, d)], { close: true, cls: 'thick', fill: FILL }));
        const d = P(0, tv);
        k.poly([P(px(-0.5), hEav), P(px(3), hRid), P(px(6.5), hEav), g.add(P(px(6.5), hEav), d), g.add(P(px(3), hRid), d), g.add(P(px(-0.5), hEav), d)], { close: true, cls: 'thick', fill: FILL });
        k.seg(P(px(0.3), hPl), P(px(5.7), hPl), { cls: 'cons' }); k.seg(P(px(0.3), 0), P(px(5.7), 0), { cls: 'cons' });
        k.text(px(3), gY - 9, 'SECTION A–A', { upright: true, size: 0.62 });
      });
      k.note('Read the pitch where it is true. The rafter\'s true length is measured on the section, 70 ÷ cos 30° = 80.8 on the sheet (4.04 m): in the plan the same slope looks only 70 long, and the elevation shows just its rise.', () => {
        const Eu = P(px(-0.5), hEav), R = P(px(3), hRid);
        dimension(k, g.add(Eu, P(0, tv)), g.add(R, P(0, tv)), 12, '4.04 m true length', { size: 0.58 });
        dimension(k, P(0, yPB), P(Wx, yPB), -9, '8000', { size: 0.65 });
        k.text(30, yPB - 18, 'PLAN', { upright: true, size: 0.62 }); k.text(Wx / 2, hRid + tv + 7, 'FRONT ELEVATION', { upright: true, size: 0.62 });
      });
    }
  });

  /* the four-centre ellipse of a horizontal circle of radius r centred at C in an isometric drawing (the method of the reference page) */
  function isoCircle(k, C, r, o, half) {
    const g = k.g, c = (x, y) => k.pt(C.x + x, C.y + y), s3 = Math.sqrt(3);
    const L = c(-s3 * r, 0), R = c(s3 * r, 0), F = c(0, r), N = c(0, -r);
    const mLF = g.mid(L, F), mFR = g.mid(F, R), mRN = g.mid(R, N), mNL = g.mid(N, L);
    const cL = g.lineLine(N, mLF, F, mNL), cR = g.lineLine(N, mFR, F, mRN), rs = g.dist(cL, mLF);
    if (!half) { k.arc3(N, mFR, mLF, o); k.arc3(cL, mLF, mNL, o); k.arc3(F, mNL, mRN, o); k.arc3(cR, mRN, mFR, o); }
    else {                                                                   // only the near, lower half shows
      let aL = g.angleOf(g.sub(mNL, cL)); if (aL < 0) aL += 2 * PI;
      k.arc(cL, rs, PI, aL, o); k.arc3(F, mNL, mRN, o); k.arc(cR, rs, g.angleOf(g.sub(mRN, cR)), 0, o);
    }
    return { left: cL.x - rs, right: cR.x + rs, L, R, F, N, cL, cR, rs };
  }
  const C30 = Math.cos(PI / 6);
  /* a point of the isometric drawing: x to the right and up, z to the left and up, y vertical (true lengths) */
  const iso = (k, x, y, z) => k.pt(C30 * (x - z), 0.5 * (x + z) + y);

  /* ------------------------------------------------------------------------------------------ the exploded assembly */
  Hyper.construction({
    id: 'db-exploded-assembly',
    title: 'An exploded isometric drawing of a three-part assembly',
    tags: ['isometric', 'exploded view', 'technical illustration', 'balloons', 'four-centre ellipse'],
    note: 'An isometric drawing with true lengths (the projection enlarged 1.2247 times, as in the reference page). The parts keep their orientation and are pulled apart along the one axis they share, in the order they are assembled, with gaps wide enough that no part hides another. The chain line through the holes is the assembly line. Circles are four-centre ellipses (approximate: the true major axis is 6 % longer); hidden edges are omitted, as technical illustrators do.',
    build(k) {
      const g = k.g, P = k.pt, I = (x, y, z) => iso(k, x, y, z);
      const A1 = 30, y1 = 12, rH = 8;                         // base: half side 30, thickness 12, hole radius 8
      const rR = 20, y2a = 62, y2b = 80;                      // ring: outer radius 20, from 62 to 80 (hole radius 8)
      const A3 = 22, y3a = 130, y3b = 138;                    // cover: half side 22, from 130 to 138 (hole radius 8)
      const ink = { cls: 'thick' };
      const topFace = (a, y) => [I(-a, y, -a), I(a, y, -a), I(a, y, a), I(-a, y, a)];       // near, right, far, left corners of the top rhombus
      k.given('The common axis of the three parts, as a chain line, and the data (full size): 1 base, a 60 × 60 × 12 plate; 2 ring, Ø40 × 18, between the base and the cover; 3 cover, a 44 × 44 × 8 plate. All three have a Ø16 hole on the axis. The parts are 50 apart along the axis.', () => {
        chain(k, P(0, -40), P(0, 158));
        k.point(P(0, 0), 'O', { at: 'e', lo: { upright: true, size: 0.8 } });
        ['1  BASE PLATE   60 × 60 × 12', '2  RING   Ø40 × 18', '3  COVER   44 × 44 × 8', 'all with a Ø16 hole'].forEach((t, i) => k.text(-120, 150 - 8 * i, t, { anchor: 'start', upright: true, size: 0.62 }));
        k.frame(-125, -48, 125, 165); k.fontScale(0.85);
      });
      k.step('square', 'With the 30° set square against the T-square, draw the three isometric axes through O: one at 30° to the right, one at 30° to the left, and the axis itself vertical. Every length is laid off along them at its true size.', () => {
        const u = P(C30, 0.5), w = P(-C30, 0.5);
        k.seg(g.add(P(0, 0), g.mul(w, -40)), g.add(P(0, 0), g.mul(u, 40)), { cls: 'aux' }); k.seg(g.add(P(0, 0), g.mul(u, -40)), g.add(P(0, 0), g.mul(w, 40)), { cls: 'aux' });
        k.angle(P(0, 0), P(1, 0), g.add(P(0, 0), u), { label: '30°', r: 1.1, labelDist: 1.7, cls: 'cons' });
      });
      k.step('ruler', 'Step the levels off along the axis: the base from 0 to 12, the ring from 62 to 80, the cover from 130 to 138. The gaps, 50 each, are the explosion.', () => {
        [0, y1, y2a, y2b, y3a, y3b].forEach(y => k.dot(P(0, y), { r: 0.8 }));
        const lab = (y, t) => k.text(7, y, t, { anchor: 'start', upright: true, size: 0.55 });
        lab(0, '0'); lab(y1 + 3, '12'); lab(y2a - 2, '62'); lab(y2b + 3, '80'); lab(y3a - 3, '130'); lab(y3b + 3, '138');
      });
      k.step('square', 'Base. Through the axis point at height 12 draw the 30° lines and lay off the half side 30 each way: the isometric square (top face). Drop the three verticals of height 12 from its near, left and right corners and join their feet.', () => {
        const t = topFace(A1, y1), d = P(0, -y1);
        k.poly(t, Object.assign({ close: true, fill: '#fff' }, ink));
        [0, 1, 3].forEach(i => k.seg(t[i], g.add(t[i], d), ink));
        k.seg(g.add(t[3], d), g.add(t[0], d), ink); k.seg(g.add(t[0], d), g.add(t[1], d), ink);
      });
      k.step('compass', 'The Ø16 hole is a circle in the top face: draw its four-centre ellipse (radius 8) about the axis point. Two large arcs from the obtuse corners of the isometric square of side 16, two small ones between them.', () => {
        isoCircle(k, P(0, y1), rH, ink);
      });
      k.step('square', 'Ring. At height 80 draw the four-centre ellipse of the outer circle, Ø40, and of the Ø16 hole; at height 62 only the near, lower half of the outer ellipse is seen. Join the two ends of the ellipses with verticals: they touch both ellipses at their widest points.', () => {
        const top = isoCircle(k, P(0, y2b), rR, ink);
        isoCircle(k, P(0, y2b), rH, ink);
        isoCircle(k, P(0, y2a), rR, ink, true);
        k.seg(P(top.left, y2a), P(top.left, y2b), ink); k.seg(P(top.right, y2a), P(top.right, y2b), ink);
      });
      k.step('square', 'Cover. As for the base: the isometric square of half side 22 at height 138, three verticals of height 8, and the Ø16 hole in its top face.', () => {
        const t = topFace(A3, y3b), d = P(0, -(y3b - y3a));
        k.poly(t, Object.assign({ close: true, fill: '#fff' }, ink));
        [0, 1, 3].forEach(i => k.seg(t[i], g.add(t[i], d), ink));
        k.seg(g.add(t[3], d), g.add(t[0], d), ink); k.seg(g.add(t[0], d), g.add(t[1], d), ink);
        isoCircle(k, P(0, y3b), rH, ink);
      });
      k.step('straightedge', 'Draw the assembly line: the chain line through the holes, extended a little beyond the first and last part, with an arrowhead showing how the parts go together.', () => {
        chain(k, P(0, -34), P(0, y3b + 14), { cls: 'cons' });
        k.arrow(P(0, y3b + 6), P(0, y3b + 18), { cls: 'cons' });
      });
      k.note('Balloons. Each part gets a numbered circle outside the drawing, joined by a thin leader that ends on the part in a dot. The numbers refer to the parts list; the leaders must not cross each other.', () => {
        const bal = (n, c, d) => { k.circle(c, 6.5, { cls: 'given' }); k.text(c.x, c.y, String(n), { upright: true, size: 0.9 }); const u = g.unit(g.sub(d, c)); k.seg(g.add(c, g.mul(u, 6.5)), d, { cls: 'cons' }); k.dot(d, { r: 0.8 }); };
        bal(1, P(88, -6), I(0, 6, -A1)); bal(2, P(88, 66), P(14, 62)); bal(3, P(88, 126), I(0, 134, -A3));
      });
    }
  });

  /* an exact isometric ellipse: the circle of radius r about c = [x, y, z] in the plane 'xz' (horizontal), 'yz' (x constant) or 'xy' (z constant) */
  function isoEllipse(k, I, plane, c, r, o) {
    const f = t => {
      const a = r * Math.cos(t), b = r * Math.sin(t);
      const q = plane === 'xz' ? [c[0] + a, c[1], c[2] + b] : plane === 'yz' ? [c[0], c[1] + a, c[2] + b] : [c[0] + a, c[1] + b, c[2]];
      const p = I(q[0], q[1], q[2]); return [p.x, p.y];
    };
    return k.curve(f, [0, 2 * PI], Object.assign({ n: 120 }, o));
  }

  /* ------------------------------------------------------------------------------------------ the patent figure */
  Hyper.construction({
    id: 'db-patent-figure',
    title: 'A patent drawing: views, reference numerals and lead lines',
    tags: ['patent', 'isometric', 'reference numerals', 'lead lines', 'ISO 128', 'plan view'],
    note: 'A patent figure is a line drawing that has to be understood without the part in hand. Black ink only, one line weight for outlines, no shading and no colour; each view is labelled FIG. n; each part carries one reference numeral, the same in every view, joined to the part by a thin lead line that ends in a dot on the part (or in a free arrow when it names the whole). Numerals are at least 3.2 mm high at the size of the original (so they survive reduction), never inside the outline, and lead lines never cross each other. Here the figure is the bracket of the part drawing, in isometric and in plan.',
    build(k) {
      const g = k.g, P = k.pt, I = (x, y, z) => iso(k, x, y, z);
      const ink = { cls: 'thick' };
      const X0 = 122, Y0 = 8;                                                   // origin of the plan, FIG. 2
      const leader = (from, to, o) => {
        const d = g.unit(g.sub(to, from)), m = g.add(g.mid(from, to), g.mul(g.perp(d), 0.1 * g.dist(from, to)));
        k.smooth([from, m, to], { cls: 'given', n: 14 });
        if (o && o.arrow) k.head(to, g.unit(g.sub(to, m)), { size: 1.1 }); else k.dot(to, { r: 0.9 });
      };
      const num = (p, n) => k.text(p.x, p.y, String(n), { upright: true, size: 1.2 });
      k.given('The two views, already drawn: FIG. 1, an isometric view of the bracket (hidden surfaces removed), and FIG. 2, its plan. One line weight throughout, no shading.', () => {
        k.rect(-62, -44, 215, 112, { cls: 'cons' });
        const dn = (a, y, z0, z1) => [I(a, y, z0), I(a, y, z1)];
        k.poly([I(15, 15, 0), I(80, 15, 0), I(80, 15, 40), I(15, 15, 40)], Object.assign({ close: true, fill: '#fff' }, ink));
        isoEllipse(k, I, 'xz', [50, 15, 20], 6, ink);
        k.poly([I(0, 0, 0), I(80, 0, 0), I(80, 15, 0), I(15, 15, 0), I(15, 50, 0), I(0, 50, 0)], Object.assign({ close: true, fill: '#fff' }, ink));
        k.poly([I(0, 0, 0), I(0, 50, 0), I(0, 50, 40), I(0, 0, 40)], Object.assign({ close: true, fill: '#fff' }, ink));
        k.poly([I(0, 50, 0), I(15, 50, 0), I(15, 50, 40), I(0, 50, 40)], Object.assign({ close: true, fill: '#fff' }, ink));
        isoEllipse(k, I, 'yz', [0, 35, 20], 4, ink);
        void dn;
        k.rect(X0, Y0, X0 + 80, Y0 + 40, ink); k.seg(P(X0 + 15, Y0), P(X0 + 15, Y0 + 40), ink);
        k.circle(P(X0 + 50, Y0 + 20), 6, ink);
        k.frame(-62, -44, 215, 112); k.fontScale(0.85);
      });
      k.step('ruler', 'Fix the size of the numerals before anything else: at least 3.2 mm high on the original sheet. Here a numeral is drawn 5 high, so the sheet may be reduced by a third and the digits still read.', () => {
        const a = P(-52, 82), b = P(-52, 87);
        k.seg(a, b, { cls: 'given' }); k.tick(a, P(1, 0)); k.tick(b, P(1, 0));
        k.text(-46, 84.5, '5 high', { anchor: 'start', upright: true, size: 0.6 });
      });
      k.step('pencil', 'FIG. 1: give each part one numeral, placed outside the outline. 10 names the whole bracket (a free arrow), 12 the base, 14 the upright, 16 the hole in the base, 18 the hole in the upright. A thin curved lead line runs from each numeral to its part and ends in a dot on it.', () => {
        const T = (x, y, z) => I(x, y, z);
        num(P(100, 94), 10); leader(P(96, 91), P(56, 72), { arrow: true });
        num(P(103, 28), 12); leader(P(97, 28), T(60, 7, 0));
        num(P(-48, 74), 14); leader(P(-42, 73), T(7, 50, 20));
        num(P(103, 62), 16); leader(P(97, 62), I(53, 15, 20));
        num(P(-52, 22), 18); leader(P(-45, 24), I(0, 35, 22));
      });
      k.step('pencil', 'FIG. 2: the same parts keep the same numerals. The upright is 14, the base 12 and the hole 16. Lead lines again do not cross and do not touch the outline except where they end.', () => {
        num(P(X0 + 100, Y0 + 31), 12); leader(P(X0 + 94, Y0 + 31), P(X0 + 68, Y0 + 12));
        num(P(X0 + 7, Y0 + 55), 14); leader(P(X0 + 7, Y0 + 51), P(X0 + 7, Y0 + 30));
        num(P(X0 + 50, Y0 + 58), 16); leader(P(X0 + 50, Y0 + 54), P(X0 + 53, Y0 + 24));
      });
      k.note('Label every view FIG. 1, FIG. 2 … under it, in numerals of the same height, and keep the views apart so that no lead line is mistaken for an edge.', () => {
        k.text(18, -22, 'FIG. 1', { upright: true, size: 1.2 }); k.text(X0 + 40, -22, 'FIG. 2', { upright: true, size: 1.2 });
      });
      k.note('Check the sheet before it goes: the same numeral never names two parts and each part has a single numeral; every numeral in the specification appears in a figure; margins left clear (about 25 mm at the top and left, 15 mm at the right, 10 mm at the bottom of an A4 sheet).', () => {
        k.text(-52, -36, 'CHECK: one part, one numeral, in every view', { anchor: 'start', upright: true, size: 0.6 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------ the traverse */
  Hyper.construction({
    id: 'db-traverse',
    title: 'A closed traverse plotted by protractor and scale, its closing error and the compass-rule adjustment',
    tags: ['surveying', 'traverse', 'bearings', 'closing error', 'Bowditch', 'plan'],
    note: 'Plan scale 1 : 1000 (the drawing is in metres). A compass-and-tape traverse of an orchard: five legs, bearings read to half a degree, lengths taped. Plotted leg by leg from A, the polygon does not close: the last leg ends at A′, 2.09 m from A (1 in 246 of the perimeter 512.1 m). The inset (enlarged 40 times) divides that error among the stations in proportion to the distance walked to each (the compass or Bowditch rule) by the method of parallels; the dashed polygon is the adjusted traverse. A traverse with a total station would close within 1 in 10 000 or better, and the method is the same.',
    build(k) {
      const g = k.g, P = k.pt;
      const legs = [['AB', 74.5, 116.2], ['BC', 150.0, 90.6], ['CD', 226.0, 102.4], ['DE', 286.0, 113.6], ['EA', 15.5, 89.3]];
      const names = ['A', 'B', 'C', 'D', 'E', "A'"];
      const dirOf = b => P(Math.sin(b * D2R), Math.cos(b * D2R));                  // a bearing (clockwise from north) as a unit vector (east, north)
      const st = [P(0, 0)]; legs.forEach(([, b, d]) => st.push(g.add(st[st.length - 1], g.mul(dirOf(b), d))));
      const cum = []; legs.reduce((s, l, i) => (cum[i] = s + l[2]), 0);
      const Ptot = cum[4], Ap = st[5], err = g.dist(Ap, st[0]);
      const SC = 40, Oin = P(205, -100);                                           // the inset: the error enlarged 40 times, A′ at Oin
      const vIn = g.mul(g.sub(st[0], Ap), SC), Ain = g.add(Oin, vIn);
      const lbl = (i, at) => k.point(st[i], names[i], { at, lo: { upright: true, size: 0.9 } });
      k.given('Station A and a north line through it. The field book: AB 74.5° 116.2 m; BC 150.0° 90.6 m; CD 226.0° 102.4 m; DE 286.0° 113.6 m; EA 15.5° 89.3 m (bearings clockwise from north). Scale 1 : 1000: 1 m is 1 mm on the paper.', () => {
        k.point(st[0], 'A', { at: 'nw', lo: { upright: true, size: 0.9 } });
        k.seg(st[0], P(0, 22), { cls: 'cons' }); k.arrow(P(0, 14), P(0, 26), { cls: 'cons' }); k.text(0, 31, 'N', { upright: true, size: 0.8 });
        k.text(188, 34, 'FIELD BOOK', { anchor: 'start', upright: true, bold: true, size: 0.8 });
        legs.forEach(([n, b, d], i) => k.text(188, 26 - 8 * i, n + '   ' + b.toFixed(1) + '°   ' + d.toFixed(1) + ' m', { anchor: 'start', upright: true, size: 0.7 }));
        k.frame(-45, -140, 320, 45); k.fontScale(0.75);
      });
      legs.forEach(([n, b, d], i) => {
        const V = st[i], dir = dirOf(b);
        k.step('protractor', 'At ' + names[i] + ' draw a north line (parallel to the first, with the set square) and lay off the bearing of ' + n + ': ' + b.toFixed(1) + '° clockwise from north. Draw the line of the leg.', () => {
          if (i) k.seg(V, g.add(V, P(0, 22)), { cls: 'cons' });
          k.seg(V, g.add(V, g.mul(dir, d * 0.55)), { cls: 'cons' });
          k.angle(V, g.add(V, dir), g.add(V, P(0, 1)), { r: 0.9, cls: 'cons' });
          k.text(...(p => [p.x, p.y])(g.add(g.add(V, g.mul(dir, d * 0.34)), g.mul(g.perp(dir), 12))), b.toFixed(1) + '°', { upright: true, size: 0.7 });
        });
        k.step('ruler', 'Along that line lay off the length of ' + n + ', ' + d.toFixed(1) + ' m (' + d.toFixed(1) + ' mm on the sheet): this is ' + names[i + 1] + (i === 4 ? ', where the traverse ought to close on A' : '') + '.', () => {
          k.seg(V, st[i + 1], { cls: 'thick' });
          if (i < 4) lbl(i + 1, ['ne', 'e', 'sw', 'w'][i]); else k.point(st[5], "A'", { at: 'sw', lo: { upright: true, size: 0.9 } });
        });
      });
      k.step('straightedge', "Join A′ to A. The plotted traverse has not closed: the line A′A is the closing error, 2.09 m long, the sum of every small error of angle and length along the way.", () => {
        k.seg(Ap, st[0], { cls: 'red', width: 1.1 });
      });
      k.note('The error of closure is 2.09 m in a perimeter of 512.1 m: a relative accuracy of 1 in 246, about what a compass and a tape give. If the legs had been measured with a theodolite the figure would be 1 in several thousand. The inset, enlarged 40 times, shows A′ and A.', () => {
        k.point(Oin, "A'", { at: 'sw', lo: { upright: true, size: 0.9 } }); k.point(Ain, 'A', { at: 'ne', lo: { upright: true, size: 0.9 } });
        k.seg(Oin, Ain, { cls: 'red', width: 1.1 });
        k.text(Oin.x + 40, Oin.y + 63, 'CLOSING ERROR ×40', { upright: true, size: 0.75 });
        k.text(Oin.x + 40, Oin.y + 56, 'e = 2.09 m', { upright: true, size: 0.7 });
      });
      const ray = g.dir(g.angleOf(vIn) - 50 * D2R), M = cum.map(c => g.add(Oin, g.mul(ray, c / 5)));
      k.step('dividers', 'To share the error out in proportion to the distance walked, draw a line from A′ at any angle and lay off on it the cumulative lengths AB, AB + BC, … to a convenient scale (1 mm to 5 m): the marks M_B, M_C, M_D, M_E and, at the full perimeter, M_A.', () => {
        k.seg(Oin, M[4], { cls: 'cons' });
        ['B', 'C', 'D', 'E', 'A'].forEach((n, i) => k.point(M[i], 'M_' + n, { at: i % 2 ? 'sw' : 'se', lo: { upright: true, size: 0.7 }, r: 0.8 }));
      });
      k.step('straightedge', 'Join the last mark M_A to A.', () => { k.seg(M[4], Ain, { cls: 'cons' }); });
      k.step('square', 'Through each of the other marks draw a parallel to M_A A (set square on a straightedge). Where it meets A′A it marks the share of the error that belongs to that station: D_B, D_C, D_D, D_E (similar triangles).', () => {
        const dv = g.sub(Ain, M[4]), D = [];
        for (let i = 0; i < 4; i++) { const q = g.lineLine(M[i], g.add(M[i], dv), Oin, Ain); D.push(q); k.seg(M[i], q, { cls: 'cons' }); k.point(q, 'D_' + 'BCDE'[i], { at: 'nw', lo: { upright: true, size: 0.7 }, r: 0.8 }); }
      });
      k.note('Each station moves by the vector from A′ to its D, divided by 40 to go back to the plan (B by 0.47 m, C by 0.84 m, D by 1.26 m, E by 1.72 m, in the direction of the error from A′ to A). The adjusted traverse is dashed: it closes by construction.', () => {
        const dv = g.sub(Ain, M[4]), adj = [st[0]];
        for (let i = 0; i < 4; i++) { const q = g.lineLine(M[i], g.add(M[i], dv), Oin, Ain); adj.push(g.add(st[i + 1], g.mul(g.sub(q, Oin), 1 / SC))); }
        k.poly(adj, { close: true, cls: 'cons', dash: true });
        adj.slice(1).forEach((p, i) => k.dot(p, { open: true, r: 0.8 }));
        k.text(188, -20, 'ADJUSTED TRAVERSE B′ C′ D′ E′: dashed', { anchor: 'start', upright: true, size: 0.7 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------ the site plan with contours */
  /* contour polylines of a gridded surface by linear interpolation along the grid edges; each: { pts: [{x, y}], closed } */
  function contourLines(xs, ys, H, level) {
    const segs = [], key = (t, i, j) => t + ':' + i + ':' + j, pos = {};
    const cross = (a, b, pa, pb, id) => { if ((a < level) === (b < level)) return null; const t = (level - a) / (b - a); pos[id] = { x: pa.x + (pb.x - pa.x) * t, y: pa.y + (pb.y - pa.y) * t }; return id; };
    for (let i = 0; i + 1 < xs.length; i++) for (let j = 0; j + 1 < ys.length; j++) {
      const p = (a, b) => ({ x: xs[a], y: ys[b] });
      const e = [cross(H[i][j], H[i + 1][j], p(i, j), p(i + 1, j), key('h', i, j)), cross(H[i + 1][j], H[i + 1][j + 1], p(i + 1, j), p(i + 1, j + 1), key('v', i + 1, j)),
        cross(H[i][j + 1], H[i + 1][j + 1], p(i, j + 1), p(i + 1, j + 1), key('h', i, j + 1)), cross(H[i][j], H[i][j + 1], p(i, j), p(i, j + 1), key('v', i, j))].filter(Boolean);
      if (e.length === 2) segs.push(e);
      else if (e.length === 4) { segs.push([e[0], e[1]]); segs.push([e[2], e[3]]); }
    }
    const adj = {}; segs.forEach((s, n) => s.forEach(id => (adj[id] = adj[id] || []).push(n)));
    const used = new Set(), out = [];
    const walk = start => {
      const ids = [start]; let cur = start, prevSeg = -1;
      for (;;) {
        const nx = (adj[cur] || []).find(n => !used.has(n) && n !== prevSeg); if (nx == null) break;
        used.add(nx); const other = segs[nx][0] === cur ? segs[nx][1] : segs[nx][0]; ids.push(other); prevSeg = nx; cur = other;
        if (other === start) break;
      }
      return ids;
    };
    Object.keys(adj).filter(id => adj[id].length === 1).forEach(id => { if (adj[id].every(n => used.has(n))) return; const ids = walk(id); if (ids.length > 1) out.push({ pts: ids.map(i => pos[i]), closed: false }); });
    Object.keys(adj).forEach(id => { if (adj[id].every(n => used.has(n))) return; const ids = walk(id); if (ids.length > 2) out.push({ pts: ids.slice(0, -1).map(i => pos[i]), closed: ids[0] === ids[ids.length - 1] }); });
    return out;
  }
  /* a Catmull–Rom curve through the points, open or closed, as an array of [x, y] */
  function smoothPts(pts, closed, n) {
    n = n || 12; const m = pts.length, at = i => closed ? pts[(i + m) % m] : pts[Math.max(0, Math.min(m - 1, i))], out = [];
    for (let i = 0; i < (closed ? m : m - 1); i++) {
      const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2);
      for (let j = 0; j < n; j++) { const t = j / n, t2 = t * t, t3 = t2 * t;
        out.push([0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
          0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)]); }
    }
    const last = at(closed ? 0 : m - 1); out.push([last.x, last.y]);
    return out;
  }

  Hyper.construction({
    id: 'db-contours',
    title: 'A site plan with contours from spot heights, and a profile cut from it',
    tags: ['surveying', 'contours', 'spot heights', 'interpolation', 'profile', 'plan'],
    note: 'Scale 1 : 1000 (1 unit is 1 m). A level survey gave the height of the ground on a 20 m grid (the numbers). A contour joins the points of one height; between two grid points the ground is taken to slope evenly, so the point where a contour crosses a grid line is found by proportion. Joining those points gives contours every 1 m; where they crowd together the ground is steep. The profile under the plan is cut along the line P–Q: each contour crossing is carried straight down and set at its height, with the heights enlarged 10 times so that the shape can be seen.',
    build(k) {
      const g = k.g, P = k.pt;
      const xs = [0, 20, 40, 60, 80, 100], ys = [0, 20, 40, 60, 80];
      const field = (x, y) => 100 + 0.028 * x + 0.012 * y + 3.0 * Math.exp(-((x - 64) ** 2 + (y - 46) ** 2) / 800) + 1.1 * Math.exp(-((x - 16) ** 2 + (y - 14) ** 2) / 648);
      const Hgt = xs.map(x => ys.map(y => Math.round(field(x, y) * 100) / 100));
      const levels = [101, 102, 103, 104];
      const lines = levels.map(L => contourLines(xs, ys, Hgt, L));
      const yQ = 44, Y0 = -78, VE = 10;                                 // the section line P–Q at y = 44; the profile baseline and its height exaggeration
      k.given('The grid of the level survey, 20 m apart, with the height of the ground at each node (in metres above datum). The lowest point is 100.55, the highest 104.99. We draw contours every 1 m.', () => {
        for (let i = 0; i < xs.length; i++) k.seg(P(xs[i], 0), P(xs[i], 80), { cls: 'aux' });
        for (let j = 0; j < ys.length; j++) k.seg(P(0, ys[j]), P(100, ys[j]), { cls: 'aux' });
        for (let i = 0; i < xs.length; i++) for (let j = 0; j < ys.length; j++) { k.dot(P(xs[i], ys[j]), { r: 0.7 }); k.text(xs[i] + 1.5, ys[j] + 2.6, Hgt[i][j].toFixed(2), { anchor: 'start', upright: true, size: 0.5 }); }
        k.seg(P(112, 0), P(112, 12), { cls: 'cons' }); k.arrow(P(112, 6), P(112, 16), { cls: 'cons' }); k.text(112, 21, 'N', { upright: true, size: 0.8 });
        k.frame(-12, Y0 - 20, 124, 92); k.fontScale(0.7);
      });
      lines.forEach((cl, n) => {
        const L = levels[n];
        k.step('dividers', 'Contour ' + L + ' m. On every grid line whose two ends lie one above and one below ' + L + ', find the crossing by proportion: the fraction of the line is (' + L + ' − lower height) ÷ (the difference of the heights), carried with the dividers or read off a scale.' + (n === 0 ? ' Example: along y = 20 from 100.95 (at x = 0) to 101.93 (at x = 20) the 101 point lies 5 % of the way, 1 m from the first node.' : ''), () => {
          cl.forEach(c => c.pts.forEach(p => k.dot(P(p.x, p.y), { r: 0.9 })));
        });
        k.step('pencil', 'Join the ' + L + ' m points in the order they come, with a smooth curve that stays between the grid points where the ground changes direction; write the height on the line.', () => {
          cl.forEach((c, ci) => {
            k.curve(smoothPts(c.pts, c.closed), null, { cls: n === 2 ? 'thick' : 'curve' });
            const q = c.pts[Math.floor(c.pts.length / 2)];
            k.text(q.x, q.y, String(L), { upright: true, size: 0.6, bg: true });
          });
        });
      });
      const sec = P(0, yQ), secE = P(100, yQ);
      k.step('straightedge', 'Mark the section line P–Q across the hill (y = 44 on this plan) and note where it cuts each contour.', () => {
        k.seg(sec, secE, { cls: 'cons', dash: true }); k.point(sec, 'P', { at: 'w', lo: { upright: true, size: 0.8 } }); k.point(secE, 'Q', { at: 'e', lo: { upright: true, size: 0.8 } });
        lines.forEach(cl => cl.forEach(c => { const m = c.pts.length; for (let i = 0; i + (c.closed ? 0 : 1) < m; i++) { const a = c.pts[i], b = c.pts[(i + 1) % m], q = g.segSeg(P(a.x, a.y), P(b.x, b.y), sec, secE); if (q) k.dot(q, { r: 0.8 }); } }));
      });
      const cut = []; lines.forEach((cl, n) => cl.forEach(c => { const m = c.pts.length; for (let i = 0; i + (c.closed ? 0 : 1) < m; i++) { const a = c.pts[i], b = c.pts[(i + 1) % m], q = g.segSeg(P(a.x, a.y), P(b.x, b.y), sec, secE); if (q) cut.push({ x: q.x, h: levels[n] }); } }));
      cut.sort((a, b) => a.x - b.x);
      const hAtEnd = x => { const i = Math.min(xs.length - 2, Math.floor(x / 20)), t = (x - xs[i]) / 20, ju = Math.min(ys.length - 2, Math.floor(yQ / 20)), u = (yQ - ys[ju]) / 20; const a = Hgt[i][ju] * (1 - t) + Hgt[i + 1][ju] * t, b = Hgt[i][ju + 1] * (1 - t) + Hgt[i + 1][ju + 1] * t; return a * (1 - u) + b * u; };
      const prof = xs.map(x => ({ x, h: hAtEnd(x), grid: true })).concat(cut).sort((a, b) => a.x - b.x);
      k.step('tee', 'Draw the baseline of the profile under the plan, at height 100, and carry each contour crossing, and each point where P–Q crosses a grid line, straight down as a vertical projector.', () => {
        k.seg(P(0, Y0), P(100, Y0), { cls: 'given' });
        prof.forEach(p => k.seg(P(p.x, yQ), P(p.x, Y0 + (p.h - 100) * VE), { cls: 'cons' }));
        for (let h = 0; h <= 5; h++) { k.tick(P(-3, Y0 + h * VE), P(0, 1)); k.text(-5, Y0 + h * VE, String(100 + h), { anchor: 'end', upright: true, size: 0.5 }); }
      });
      k.step('ruler', 'On each projector lay off the height above 100, enlarged ten times (1 m of height is 10 on the sheet): 101 at 10, 102 at 20, 103 at 30, 104 at 40; for the projectors from the grid lines, interpolate the height between the grid heights on each side of the line P–Q.', () => {
        prof.forEach(p => k.dot(P(p.x, Y0 + (p.h - 100) * VE), { r: 0.9 }));
      });
      k.step('pencil', 'Join the points with a smooth curve: this is the ground profile along P–Q, with its vertical scale ten times the horizontal. The summit lies between the 104 crossings; the ground falls away more steeply on the left of the summit, where the contours crowd together.', () => {
        k.curve(smoothPts(prof.map(p => P(p.x, Y0 + (p.h - 100) * VE)), false, 10), null, { cls: 'curve' });
        k.text(50, Y0 - 9, 'PROFILE P–Q   height × 10', { upright: true, size: 0.7 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------ developments */
  Hyper.construction({
    id: 'db-elbow-development',
    title: 'The pattern of a two-piece mitre elbow: elements, stretch-out line and dividers',
    tags: ['sheet metal', 'development', 'elbow', 'cylinder', 'elements', 'dividers', 'parallel-line development'],
    note: 'A 90° elbow of two equal pieces of Ø80 pipe, joined along the mitre line at 45° to both axes (the intersection curve of the two cylinders is flat: an ellipse in the mitre plane, a straight line in this view). Each piece is a cylinder cut obliquely, and a cylinder develops without distortion: every element (a line parallel to the axis) keeps its length and the rim unrolls to a straight line of length πD = 251.3. The cut edge becomes a cosine curve, h = 70 − 40 cos(s/40). Both pieces use the same pattern, turned over; the seam is made on the short side, where the cut is shortest. Allow extra for the seam and the flange.',
    build(k) {
      const g = k.g, P = k.pt, R = 40, yB = -70, XP = 128;               // radius, bottom of the vertical piece, start of the pattern
      const circC = P(0, -125);
      const xk = i => R * Math.cos(i * PI / 6);                            // element i (i = 0 … 6 over the half circle) stands at x = R cos φ
      const mit = i => P(xk(i), -xk(i));                                   // where it meets the mitre line y = −x
      const arcStep = PI * 2 * R / 12;
      const hOf = i => -xk(i) - yB;                                         // length of element i
      k.given('The elbow in elevation: two pipes of Ø80, the vertical one cut by the mitre line (outer corner at (−40, 40), inner corner at (40, −40)); its shortest side measures 30 from the bottom edge. Below it the end view of the pipe, a circle of radius 40, which gives the cross-section.', () => {
        k.seg(P(-R, yB), P(-R, R), { cls: 'given' }); k.seg(P(R, yB), P(R, -R), { cls: 'given' }); k.seg(P(-R, yB), P(R, yB), { cls: 'given' });
        k.seg(P(-R, R), P(R, -R), { cls: 'thick' });
        k.seg(P(-R, R), P(70, R), { cls: 'given' }); k.seg(P(R, -R), P(70, -R), { cls: 'given' });
        chain(k, P(0, yB - 6), P(0, 56)); chain(k, P(-52, 0), P(78, 0));
        k.circle(circC, R, { cls: 'given' }); chain(k, P(-R - 8, circC.y), P(R + 8, circC.y)); chain(k, P(0, circC.y - R - 8), P(0, circC.y + R + 8));
        k.text(0, circC.y - R - 14, 'Ø80', { upright: true, size: 0.75 });
        k.text(R + 6, (yB + -R) / 2, '30', { anchor: 'start', upright: true, size: 0.7 });
        k.frame(-62, -176, 395, 60); k.fontScale(0.75);
      });
      k.step('compass', 'Divide the circle into twelve equal arcs. With the compass at the radius 40 step round from point 1 (on the right, at the short side): this marks 60° apart; then bisect each arc with the compass to mark the points between. Number the points of the half circle 1 to 7.', () => {
        for (let i = 0; i <= 6; i++) { const p = g.polar(circC, R, i * PI / 6); k.point(p, String(i + 1), { at: i < 3 ? 'ne' : i > 3 ? 'nw' : 'n', lo: { upright: true, size: 0.75 } }); }
      });
      k.step('square', 'The half circle is the front half of the pipe seen from below. Draw a vertical line through each point, up through the elevation to the mitre line: these are the elements 1 to 7. The back half repeats them.', () => {
        for (let i = 0; i <= 6; i++) k.seg(P(xk(i), circC.y + R * Math.sin(i * PI / 6)), mit(i), { cls: 'cons' });
        for (let i = 0; i <= 6; i++) k.point(mit(i), '', { r: 0.8 });
      });
      k.step('tee', 'Carry the mitre points straight across to the right with the T-square; the baseline y = −70 is the bottom edge of the pipe. The vertical distance from the baseline to each horizontal is the length of that element: 30, 35.4, 50, 70, 90, 104.6 and 110.', () => {
        for (let i = 0; i <= 6; i++) k.seg(mit(i), P(XP + 2 * PI * R + 6, mit(i).y), { cls: 'cons' });
        k.seg(P(XP - 8, yB), P(XP + 2 * PI * R + 8, yB), { cls: 'given' });
      });
      k.step('dividers', 'The stretch-out line: lay off on the baseline, from X, twelve equal spaces, each one twelfth of the circumference, πD/12 = 20.94, and number the points 1 to 13 (13 is 1 again, the seam).', () => {
        for (let j = 0; j <= 12; j++) { const p = P(XP + j * arcStep, yB); k.point(p, String(j + 1), { at: 's', lo: { upright: true, size: 0.65 }, r: 0.8 }); }
      });
      k.step('square', 'Erect a perpendicular at each of the thirteen points: the elements, laid out side by side in their order round the pipe. Points 8 to 13 repeat 6 to 1 on the way back.', () => {
        for (let j = 0; j <= 12; j++) k.seg(P(XP + j * arcStep, yB), P(XP + j * arcStep, yB + hOf(j <= 6 ? j : 12 - j)), { cls: 'cons' });
      });
      k.step('pencil', 'Where the horizontal of element i crosses the perpendicular of the same number, mark the point; join the points with a smooth curve (a French curve), and close the pattern with the two sides, 30 high, and the baseline.', () => {
        const pts = []; for (let j = 0; j <= 12; j++) pts.push(P(XP + j * arcStep, yB + hOf(j <= 6 ? j : 12 - j)));
        pts.forEach(p => k.dot(p, { r: 0.9 }));
        k.curve(smoothPts(pts, false, 12), null, { cls: 'curve' });
        k.seg(P(XP, yB), P(XP, yB + hOf(0)), { cls: 'thick' }); k.seg(P(XP + 2 * PI * R, yB), P(XP + 2 * PI * R, yB + hOf(0)), { cls: 'thick' }); k.seg(P(XP, yB), P(XP + 2 * PI * R, yB), { cls: 'thick' });
      });
      k.note('Cut along the heavy line, roll the sheet until its two short edges meet along the seam, and weld or lock it: the top edge is now the mitre ellipse. The second piece uses the same pattern. With more, narrower pieces (a three-, four- or five-piece elbow) each mitre is at half the bending angle of its joint and the curve flattens.', () => {
        k.text(XP + PI * R, yB - 26, 'one piece, laid flat: 251.3 long, 30 to 110 high', { upright: true, size: 0.7 });
        k.text(XP + PI * R, yB + hOf(6) + 8, 'long side', { upright: true, size: 0.6 }); k.text(XP - 4, yB + hOf(0) + 8, 'seam', { upright: true, size: 0.6 });
      });
    }
  });

  Hyper.construction({
    id: 'db-cone-development',
    title: 'The pattern of a truncated cone: a sector with compass and protractor',
    tags: ['sheet metal', 'development', 'cone', 'frustum', 'radial-line development', 'compass', 'protractor'],
    note: 'A hopper of Ø120 at the bottom, Ø60 at the top, 90 high. A cone develops into a sector of a circle whose radius is the slant length from the apex and whose arc is as long as the base circle: the angle is 360° × r / L. The elevation shows the slant length in true length because the generator through the edge of the view lies in the plane of the drawing. Stepping the chords of twelve equal divisions of the base circle along the arc is the alternative to the protractor (it comes out 1 % short; use more divisions or the calculated angle).',
    build(k) {
      const g = k.g, P = k.pt;
      const r1 = 60, r2 = 30, H = 90, Hap = H * r1 / (r1 - r2);               // radii and height; the apex lies at height 180
      const A = P(0, Hap), B = P(r1, 0), C = P(r2, H);
      const L1 = g.dist(A, B), L2 = g.dist(A, C), th = 360 * r1 / L1;       // slant lengths and the angle of the sector
      const Ad = P(250, Hap);
      k.given('The cone in elevation: the base of diameter 120, the top of diameter 60, the height 90.', () => {
        k.poly([P(-r1, 0), P(r1, 0), P(r2, H), P(-r2, H)], { close: true, cls: 'given' });
        chain(k, P(0, -8), P(0, Hap + 8));
        k.dim(P(-r1, 0), P(r1, 0), 'Ø120', { dist: 1.3 }); k.dim(P(-r2, H), P(r2, H), 'Ø60', { dist: -1.3 }); k.text(r1 + 12, H / 2, '90', { upright: true, size: 0.7 });
        k.frame(-70, -20, 430, Hap + 16); k.fontScale(0.75);
      });
      k.step('straightedge', 'Extend the two sloping sides until they meet on the axis: this is the apex A of the cone, 180 above the base (the sides rise 90 while the radius falls 30).', () => {
        k.seg(B, A, { cls: 'cons' }); k.seg(P(-r1, 0), A, { cls: 'cons' }); k.point(A, 'A', { at: 'n', lo: { upright: true, size: 0.8 } });
      });
      k.step('dividers', 'The line AB lies in the plane of the drawing, so it is the true slant length L = 189.7. Take AB and AC (the slant to the top edge, 94.9) with the dividers: they are the radii of the pattern.', () => {
        k.point(B, 'B', { at: 'e', lo: { upright: true, size: 0.8 } }); k.point(C, 'C', { at: 'e', lo: { upright: true, size: 0.8 } });
        k.text(r1 / 2 + 14, Hap / 2 + 28, 'L = 189.7', { upright: true, size: 0.65, rotate: 0 });
      });
      k.step('compass', 'Mark the apex of the pattern, A′, on the same level; draw the axis down from it; and with centre A′ draw two arcs, one of radius 189.7 and one of radius 94.9, swinging through about 130° symmetrically about the axis.', () => {
        k.point(Ad, "A'", { at: 'n', lo: { upright: true, size: 0.8 } });
        chain(k, Ad, P(Ad.x, Ad.y - L1 - 10));
        k.arc(Ad, L1, -PI / 2 - 0.58 * th * D2R, -PI / 2 + 0.58 * th * D2R, { cls: 'cons' });
        k.arc(Ad, L2, -PI / 2 - 0.58 * th * D2R, -PI / 2 + 0.58 * th * D2R, { cls: 'cons' });
      });
      k.step('protractor', 'The angle of the sector is 360° × r ÷ L = 360 × 60 ÷ 189.7 = 113.8°. Lay off half of it, 56.9°, on each side of the axis from A′ and draw the two radii: they cut the arcs at the ends of the pattern.', () => {
        [-1, 1].forEach(s => k.seg(Ad, g.polar(Ad, L1 + 6, -PI / 2 + s * th / 2 * D2R), { cls: 'cons' }));
        k.angle(Ad, g.polar(Ad, 1, -PI / 2), g.polar(Ad, 1, -PI / 2 + th / 2 * D2R), { label: '56.9°', r: 3.2, labelDist: 1.5, cls: 'cons' });
        k.angle(Ad, g.polar(Ad, 1, -PI / 2 - th / 2 * D2R), g.polar(Ad, 1, -PI / 2), { label: '56.9°', r: 3.2, labelDist: 1.5, cls: 'cons' });
      });
      k.step('pencil', 'Line in the pattern: the outer arc (the bottom edge, 377.0 long, as long as the base circle), the inner arc (the top edge, 188.5) and the two radii, which are the seam. Allow a lap for the seam and a flange on the edges.', () => {
        const a0 = -PI / 2 - th / 2 * D2R, a1 = -PI / 2 + th / 2 * D2R;
        k.arc(Ad, L1, a0, a1, { cls: 'thick' }); k.arc(Ad, L2, a0, a1, { cls: 'thick' });
        [a0, a1].forEach(a => k.seg(g.polar(Ad, L2, a), g.polar(Ad, L1, a), { cls: 'thick' }));
      });
      k.note('Check: the outer arc is L × θ = 189.7 × 1.987 rad = 377.0, the circumference of the base, 2π × 60. The chord of one twelfth of the base circle is 31.06; twelve of them stepped along the arc come to 372.7, which is why the calculated angle is better than stepping.', () => {
        const a0 = -PI / 2 - th / 2 * D2R, a1 = -PI / 2 + th / 2 * D2R;
        for (let j = 0; j <= 12; j++) { const p = g.polar(Ad, L1, a0 + (a1 - a0) * j / 12); k.dot(p, { r: 0.6 }); }
        k.text(Ad.x, Ad.y - L1 - 18, 'one pattern: sector 113.8° between radii 94.9 and 189.7', { upright: true, size: 0.7 });
      });
    }
  });

})();
