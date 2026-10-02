/* HYPER-PROJECTIONS · constructions/perspective-basics.js — the elements of linear perspective, drawn by hand.
 *
 *   pb-window-picture        the picture of a point and of a post on the window: rays from the eye, side view
 *   pb-horizon-eye-level     men of equal height in a file: every head on HL when the men are as tall as the eye
 *   pb-vanishing-point       the vanishing point of a direction: the parallel from SP, plan above and picture below
 *   pb-cone-of-vision        the picture width and the station point: 40° and 60° cones with protractor and set square
 *   pb-matrix-and-hand       a box plotted from the numbers of the perspective matrix, then its vanishing points
 *   pb-ground-foreshortening equal steps on the ground seen from the eye: the rays on the window bunch up to HL
 *   pb-field-of-view-angle   the focal length that gives a wanted angle of view on a 36 mm frame
 *   pb-eight-point-circle    a circle in one-point perspective by its square, its diagonals and eight points
 * Labels as a draughtsman letters them: HL horizon line, GL ground line, PP picture plane, SP station point,
 * CV centre of vision, VP vanishing point, DP distance point. Every point is computed with k.g, never guessed.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180;
  const small = { upright: true, size: 0.8 };

  /* a dimension: thin line with end ticks and its text (aux, so the practice board does not ask for it) */
  function dim(k, a, b, text, o) {
    o = o || {};
    const u = k.g.sub(b, a);
    k.seg(a, b, { cls: o.cls || 'aux' });
    k.tick(a, u); k.tick(b, u);
    k.dim(a, b, text, { side: o.side, dist: o.dist == null ? 1.4 : o.dist, size: o.size || 0.85, cls: o.cls === 'cons' ? 'cons' : undefined });
  }

  /* ------------------------------------------------------------------ 1. the window */
  Hyper.construction({
    id: 'pb-window-picture',
    title: 'The picture of a point and of a post on the window',
    tags: ['perspective', 'window', 'eye', 'rays', 'similar triangles'],
    note: 'This is the side view of Alberti\'s window: the eye E, a vertical pane W at distance d, and the scene beyond it. The ray from E to any point of the scene crosses the pane at the picture of that point. Because a post and its picture are two similar triangles with the apex at the eye, the picture of a post of height h at distance z is h·d/z long — the same post twice as far away is half as long. The rays are only drawn as far as the objects; the dashed ray at eye height is the horizon on the window.',
    build(k) {
      const g = k.g;
      const e = 100, d = 230, z1 = 300, z2 = 540, h = 200;
      const E = k.pt(0, e), W0 = k.pt(d, 0), W1 = k.pt(d, 250);
      const onW = Q => g.lineLine(E, Q, W0, W1);
      const F1 = k.pt(z1, 0), T1 = k.pt(z1, h), F2 = k.pt(z2, 0), T2 = k.pt(z2, h), Pp = k.pt(450, 215);
      const tiny = { upright: true, size: 0.8 };
      k.given('The ground, the eye E at height e, the window W at distance d from the eye, a post FT of height h at distance z, and a lantern P hanging in the air.', () => {
        k.seg(k.pt(-30, 0), k.pt(595, 0), { cls: 'given' });
        k.label(k.pt(-30, 0), 'ground', 'sw', small);
        k.seg(W0, W1, { cls: 'given', width: 2.4 });
        k.label(W1, 'W (the window, PP)', 'n', small);
        k.point(E, 'E', 'nw');
        k.seg(F1, T1, { cls: 'thick' });
        k.point(F1, 'F', 's'); k.point(T1, 'T', 'n');
        k.point(Pp, 'P', { at: 'ne', open: true });
        dim(k, k.pt(-24, 0), k.pt(-24, e), 'e', { cls: 'cons', side: 'right' });
        dim(k, k.pt(0, -22), k.pt(d, -22), 'd', { cls: 'cons', side: 'right', dist: 1.5 });
        dim(k, k.pt(0, -52), k.pt(z1, -52), 'z', { cls: 'cons', side: 'right', dist: 1.5 });
        k.frame(-60, -75, 600, 265);
      });
      k.step('straightedge', 'From the eye E draw the ray to the lantern P. Where it crosses the window is the picture of P: call it P′.', () => {
        k.seg(E, Pp, { cls: 'cons' });
        k.point(onW(Pp), 'P′', { at: 'nw', lo: tiny });
      });
      k.step('straightedge', 'Draw the rays from E to the top T and to the foot F of the post. They cross the window at T′ and F′.', () => {
        k.seg(E, T1, { cls: 'cons' }); k.seg(E, F1, { cls: 'cons' });
        k.point(onW(T1), 'T′', { at: 'nw', lo: tiny }); k.point(onW(F1), 'F′', { at: 'sw', lo: tiny });
      });
      k.step('pencil', 'Ink the segment F′T′ on the window: it is the picture of the post. It is shorter than the post in the ratio d : z, and the foot F′ stands well above the ground line because the eye is above the ground.', () => {
        k.seg(onW(F1), onW(T1), { cls: 'thick', width: 3 });
      });
      k.step('straightedge', 'A second post of the same height, twice as far away: draw its two rays. Its picture is shorter still, and both ends creep towards the level of the eye.', () => {
        k.seg(F2, T2, { cls: 'thick' });
        k.seg(E, T2, { cls: 'cons' }); k.seg(E, F2, { cls: 'cons' });
        k.point(F2, 'F_2', 's'); k.point(T2, 'T_2', 'n');
        k.point(onW(T2), 'T′_2', { at: 'nw', lo: tiny }); k.point(onW(F2), 'F′_2', { at: 'sw', lo: tiny });
        k.seg(onW(F2), onW(T2), { cls: 'thick', width: 3 });
      });
      k.note('The dashed ray from E parallel to the ground meets the window at eye level: that is the horizon line HL on the window. Every ray to a point at the height of the eye stays on it. The picture lengths are h·d/z = ' + (h * d / z1).toFixed(0) + ' and ' + (h * d / z2).toFixed(0) + ' for z = ' + z1 + ' and ' + z2 + '.', () => {
        k.seg(E, k.pt(595, e), { cls: 'cons', dash: true });
        k.label(k.pt(595, e), 'HL', 'nw', small);
        k.seg(k.pt(z1 + 16, 0), k.pt(z1 + 16, h), { cls: 'aux' }); k.tick(k.pt(z1 + 16, 0), k.pt(0, 1)); k.tick(k.pt(z1 + 16, h), k.pt(0, 1));
        k.text(z1 + 32, h * 0.72, 'h', { size: 0.9 });
      });
    }
  });

  /* ------------------------------------------------------------------ 2. horizon and eye level */
  Hyper.construction({
    id: 'pb-horizon-eye-level',
    title: 'The horizon at eye level: men of equal height in a file',
    tags: ['perspective', 'horizon', 'eye level', 'HL'],
    note: 'A man as tall as you has his eyes at your eye level, so the line from your eye to his is horizontal and the horizontal lines of the scene all pass through HL. The heights of equal men standing on level ground are the verticals between the line of their feet and the line of their heads, and those two lines meet at the vanishing point VP on HL. A man of the same height as your eye has his head on HL itself, wherever he stands; a child half as tall has his head half-way between his feet and HL.',
    build(k) {
      const g = k.g;
      const e = 110, xs = [-150, -80, -20, 40, 90], VPx = 150;
      const foot = x => 0 + e * (x - xs[0]) / (VPx - xs[0]);
      const GL0 = k.pt(-195, 0), GL1 = k.pt(195, 0);
      const VP = k.pt(VPx, e);
      k.given('The ground line GL, and a man of your own height (so that his eyes are at your eye level), standing on it. The eye height e is his height.', () => {
        k.seg(GL0, GL1, { cls: 'given' });
        k.label(k.pt(-195, 0), 'GL', 'nw', small);
        k.seg(k.pt(xs[0], 0), k.pt(xs[0], e), { cls: 'thick' });
        k.point(k.pt(xs[0], 0), '', 'sw'); k.point(k.pt(xs[0], e), 'A', 'nw');
        dim(k, k.pt(-185, 0), k.pt(-185, e), 'e', { cls: 'cons', side: 'right' });
        k.frame(-200, -20, 200, 135);
      });
      k.step('tee', 'With the T-square draw HL through the man\'s head. He is as tall as you, so his eyes are at your eye level: the horizon is the line through every eye of that height.', () => {
        k.line(k.pt(-195, e), k.pt(195, e), { cls: 'curve' });
        k.label(k.pt(-195, e), 'HL', 'nw', small);
      });
      k.step('straightedge', 'Choose a vanishing point VP on HL (it is where the file of men walks to) and join the man\'s feet to it: the line of their feet.', () => {
        k.point(VP, 'VP', 'ne');
        k.line(k.pt(xs[0], 0), VP, { cls: 'cons' });
      });
      k.step('square', 'At the places where the other men stand raise verticals from the line of feet up to HL. Each vertical is one man: all are the same height, and every head is on HL.', () => {
        xs.slice(1).forEach(x => { k.seg(k.pt(x, foot(x)), k.pt(x, e), { cls: 'thick' }); k.dot(k.pt(x, foot(x)), { r: 0.6 }); });
      });
      const c1 = k.pt(xs[1], foot(xs[1]) + (e - foot(xs[1])) / 2);
      k.step('dividers', 'Bisect the vertical of the second man with the dividers: its middle is the head of a child half as tall, standing at his side.', () => {
        k.point(c1, 'c_1', 'e');
      });
      k.step('straightedge', 'Join the child\'s head to VP. The child at the fourth place has his head on this line too: all children of that height have their heads on a line to VP.', () => {
        k.line(c1, VP, { cls: 'cons' });
        const c2 = k.pt(xs[3], foot(xs[3]) + (e - foot(xs[3])) / 2);
        k.point(c2, 'c_2', 'e');
        k.seg(k.pt(xs[3], foot(xs[3])), c2, { cls: 'green', width: 2.6 });
        k.seg(k.pt(xs[1], foot(xs[1])), c1, { cls: 'green', width: 2.6 });
      });
      k.note('Draw each man as a figure (a head the size of one seventh of his height). The heads of the tall figures touch HL; the heads of the children, who are half as tall, lie on the line through c₁ and c₂ that also goes to VP.', () => {
        xs.forEach((x, i) => { const hgt = i === 0 ? e : e - foot(x), r = hgt * 0.09; k.circle(k.pt(x, e - r), r, { cls: 'aux' }); });
        [xs[1], xs[3]].forEach(x => { const hgt = (e - foot(x)) / 2, r = hgt * 0.09; k.circle(k.pt(x, foot(x) + hgt - r), r, { cls: 'green' }); });
      });
    }
  });

  /* ------------------------------------------------------------------ 3. a vanishing point */
  Hyper.construction({
    id: 'pb-vanishing-point',
    title: 'The vanishing point of a direction: the parallel from SP',
    tags: ['perspective', 'vanishing point', 'station point', 'plan and picture'],
    note: 'The plan is above, the picture below, and verticals carry points from one to the other. The eye SP is in the plan at distance D from the picture plane PP. The ray from SP parallel to a set of parallel lines is the ray towards their point at infinity; where it crosses PP in the plan, a vertical carries it to HL. That is the vanishing point VP, and its distance from CV is D·cot θ for lines at angle θ to PP. Lines parallel to PP (θ = 0) never meet it: they have no vanishing point and stay parallel in the picture.',
    build(k) {
      const g = k.g;
      const D = 140, th = 35 * D2R, hl = -235, e = 60, gl = hl - e;
      const SP = k.pt(0, -D), CV = k.pt(0, hl);
      const dirv = k.pt(Math.cos(th), Math.sin(th));
      const T1 = k.pt(-170, 0), T2 = k.pt(-95, 0);
      const V = k.pt(D / Math.tan(th), 0), VP = k.pt(V.x, hl);
      const far = (T, t) => g.add(T, g.mul(dirv, t));
      k.given('The plan (above): the picture plane PP, the station point SP at distance D from it, and two parallel edges L₁ and L₂ that meet PP at T₁ and T₂ at the angle θ. The picture (below): the horizon HL at the eye height above the ground line GL, and CV straight below SP.', () => {
        k.seg(k.pt(-230, 0), k.pt(240, 0), { cls: 'given' });
        k.label(k.pt(-230, 0), 'PP', 'nw', small);
        k.point(SP, 'SP', 'se');
        k.seg(T1, far(T1, 150), { cls: 'thick' }); k.seg(T2, far(T2, 150), { cls: 'thick' });
        k.point(T1, 'T_1', 'sw'); k.point(T2, 'T_2', 'sw');
        k.label(far(T1, 150), 'L_1', 'ne', small); k.label(far(T2, 150), 'L_2', 'ne', small);
        k.angle(T1, k.pt(T1.x + 60, 0), far(T1, 60), { label: 'θ', r: 1.2 });
        k.seg(SP, k.pt(0, 0), { cls: 'cons', dash: true });
        dim(k, k.pt(14, -D), k.pt(14, 0), 'D', { cls: 'cons', side: 'right' });
        k.seg(k.pt(-230, hl), k.pt(250, hl), { cls: 'given' }); k.label(k.pt(-230, hl), 'HL', 'nw', small);
        k.seg(k.pt(-230, gl), k.pt(250, gl), { cls: 'given' }); k.label(k.pt(-230, gl), 'GL', 'nw', small);
        k.point(CV, 'CV', 'se');
        k.frame(-240, gl - 20, 255, 110);
      });
      k.step('square', 'Slide the set square along the straightedge to carry the direction of L₁ to SP: draw through SP the parallel to L₁ (and to L₂ — it is the same line). It meets PP at V.', () => {
        k.seg(SP, V, { cls: 'cons' });
        k.point(V, 'V', 'ne');
      });
      k.step('square', 'From V drop a vertical to HL. Where it meets HL is the vanishing point VP of the direction of L₁ and L₂.', () => {
        k.seg(V, VP, { cls: 'cons' });
        k.point(VP, 'VP', 'ne');
      });
      k.step('square', 'Drop verticals from T₁ and T₂ to GL: T′₁ and T′₂ are the pictures of the points where the lines pierce the picture plane.', () => {
        const a = k.pt(T1.x, gl), b = k.pt(T2.x, gl);
        k.seg(T1, a, { cls: 'cons' }); k.seg(T2, b, { cls: 'cons' });
        k.point(a, 'T′_1', 'sw'); k.point(b, 'T′_2', 'sw');
      });
      k.step('straightedge', 'Join T′₁ and T′₂ to VP. These are the pictures of L₁ and L₂: parallel in the plan, they meet at VP in the picture.', () => {
        k.seg(k.pt(T1.x, gl), VP, { cls: 'thick' }); k.seg(k.pt(T2.x, gl), VP, { cls: 'thick' });
      });
      k.note('The distance from CV to VP is D·cot θ = ' + (D / Math.tan(th)).toFixed(0) + ' for D = ' + D + ' and θ = 35°. Make θ smaller and VP runs away; at θ = 90° it falls on CV; at θ = 0 the parallel from SP never meets PP.', () => {
        dim(k, CV, VP, 'x_v = D cot θ', { dist: 1.3 });
        k.angle(SP, k.pt(SP.x + 60, SP.y), g.add(SP, g.mul(dirv, 60)), { label: 'θ', r: 1.1 });
      });
    }
  });

  /* ------------------------------------------------------------------ 4. cone of vision */
  Hyper.construction({
    id: 'pb-cone-of-vision',
    title: 'The picture width, the station point and the cone of vision',
    tags: ['perspective', 'station point', 'cone of vision', 'protractor', 'set square'],
    note: 'Seen from SP, the picture of width W subtends the angle 2·atan(W / 2D). Choosing that angle is choosing D. The picture itself should not exceed about 40° (D ≈ 1.4 W); the eye sees tolerably well in a cone of about 60°, and the 30°–60° set square draws it. Outside 60° the picture is stretched at the edges (a sphere becomes an ellipse), so nothing there should be drawn from this SP. Everything is in plan: PP is the line, the objects lie behind it.',
    build(k) {
      const g = k.g;
      const W = 170, a40 = 20 * D2R, a30 = 30 * D2R;
      const D = (W / 2) / Math.tan(a40);
      const L = k.pt(-W / 2, 0), R = k.pt(W / 2, 0), SP = k.pt(0, -D);
      k.given('The picture plane PP in plan, the picture width LR on it (take W with the dividers) and the central line. Behind PP, a building, a column and a tree in plan.', () => {
        k.seg(k.pt(-260, 0), k.pt(260, 0), { cls: 'given' }); k.label(k.pt(-260, 0), 'PP', 'nw', small);
        k.seg(L, R, { cls: 'thick' }); k.tick(L, k.pt(1, 0)); k.tick(R, k.pt(1, 0));
        k.point(L, 'L', 'sw'); k.point(R, 'R', 'se');
        dim(k, k.pt(-W / 2, 14), k.pt(W / 2, 14), 'W', { cls: 'cons' });
        k.seg(k.pt(0, -D * 1.1), k.pt(0, 170), { cls: 'cons', dash: true });
        k.poly([k.pt(-50, 40), k.pt(40, 40), k.pt(40, 110), k.pt(-50, 110)], { close: true, cls: 'given' });
        k.label(k.pt(-5, 90), 'building', 'c', small);
        k.circle(k.pt(125, 70), 12, { cls: 'given' }); k.label(k.pt(125, 90), 'column', 'n', small);
        k.circle(k.pt(215, 60), 14, { cls: 'given' }); k.label(k.pt(215, 80), 'tree', 'n', small);
        k.frame(-270, -D - 25, 270, 185);
      });
      k.step('protractor', 'At L and at R lay off 70° from PP, towards the middle. The two lines meet on the central line at SP, and the angle LSR is 40°.', () => {
        k.seg(L, SP, { cls: 'thick' }); k.seg(R, SP, { cls: 'thick' });
        k.point(SP, 'SP', 'se');
        k.angle(L, SP, R, { label: '70°', r: 1.4, labelDist: 1.5 }); k.angle(R, L, SP, { label: '70°', r: 1.4, labelDist: 1.5 });
        k.angle(SP, R, L, { r: 1.3 });
        k.text(0, -D + 74, '40°', { size: 0.85, upright: true, bg: true });
      });
      k.step('ruler', 'Measure D = SP to PP. For a 40° picture D = W / (2 tan 20°) = ' + (D / W).toFixed(2) + ' W; a 30°-wide picture would need D = 1.87 W and a 60° one only 0.87 W.', () => {
        dim(k, k.pt(-170, -D), k.pt(-170, 0), 'D = ' + D.toFixed(0), { cls: 'cons', side: 'right', dist: 2.6 });
      });
      k.step('straightedge', 'Continue SL and SR beyond PP: the picture\'s own cone. Everything in plan between these two lines is inside the picture.', () => {
        k.seg(L, k.pt(-Math.tan(a40) * (150 + D), 150), { cls: 'cons' });
        k.seg(R, k.pt(Math.tan(a40) * (150 + D), 150), { cls: 'cons' });
      });
      k.step('square', 'With the 30°–60° set square against the central line draw from SP the lines at 30° on each side: the boundary of the 60° cone of vision.', () => {
        k.seg(SP, k.pt(Math.tan(a30) * (170 + D), 170), { cls: 'curve' });
        k.seg(SP, k.pt(-Math.tan(a30) * (170 + D), 170), { cls: 'curve' });
        k.angle(SP, g.polar(SP, 100, 60 * D2R), g.polar(SP, 100, 90 * D2R), { r: 3.2 });
        k.text(36, -D + 130, '30°', { size: 0.85, upright: true, bg: true });
      });
      k.note('The building lies inside the picture: draw it. The column is inside the 60° cone but outside the picture (it is cut by the frame, or drawn with an ellipse at the edge). The tree lies outside the cone: from this SP it could only be drawn badly stretched, so it must be left out or moved.', () => {
        k.label(k.pt(-5, 62), 'drawn', 'c', { upright: true, size: 0.8, fill: '#2d7a3a' });
        k.label(k.pt(125, 48), 'stretched', 'n', { upright: true, size: 0.75, fill: '#b03a2e' });
        k.label(k.pt(215, 38), 'outside', 'n', { upright: true, size: 0.75, fill: '#b03a2e' });
      });
    }
  });

  /* ------------------------------------------------------------------ 5. the matrix, plotted by hand */
  Hyper.construction({
    id: 'pb-matrix-and-hand',
    title: 'A box plotted from the perspective matrix, then drawn out to its vanishing points',
    tags: ['perspective matrix', 'coordinates', 'ruler', 'vanishing point'],
    note: 'This is what a computer does a million times a second, done once at the drawing board. Each corner (x, y, z) is first brought into the camera\'s frame (the view matrix: translate the eye to the origin, turn to face the box) and then divided by its depth: x′ = d·x_c / (−z_c), y′ = d·y_c / (−z_c), with d = 100 mm. The picture plane is d in front of the eye; coordinates are in millimetres from the centre of vision O. The edges you join are the same ones the matrix sends to the vanishing points, so the hand method and the matrix must agree.',
    build(k) {
      const P = k.proj, M4 = P.mat4, g = k.g;
      const d = 100, eye = [2.0, 1.7, 2.6], at = [0, 1.7, 0];
      const M = M4.mul(P.perspective(d), P.lookAt(eye, at, [0, 1, 0]));
      const model = P.models.transform(P.models.box(2, 1, 2), M4.translate(0, 0.5, 0));
      const pts = model.pts.map(p => { const q = M4.point(M, p); return k.pt(q[0], q[1]); });
      const names = { 2: 'A′', 6: 'B′', 7: 'C′', 3: 'D′', 1: 'A', 5: 'B', 4: 'C', 0: 'D' };
      const cen = g.centroid(pts);
      const compass = v => { const a = Math.atan2(v.y, v.x) * 180 / Math.PI; const dirs = ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se']; return dirs[((Math.round(a / 45) % 8) + 8) % 8]; };
      const at8 = i => compass(g.sub(pts[i], cen));
      const num = v => (Math.round(v * 10) / 10).toFixed(1).replace('-', '−');
      const coords = idx => idx.map(i => names[i] + ' (' + num(pts[i].x) + ', ' + num(pts[i].y) + ')').join(', ');
      const vx = P.vanishing(M, [1, 0, 0]), vz = P.vanishing(M, [0, 0, -1]);
      const VPx = k.pt(vx[0], vx[1]), VPz = k.pt(vz[0], vz[1]);
      const O = k.pt(0, 0);
      const xs = pts.map(p => p.x).concat([VPx.x, VPz.x, 0]), ys = pts.map(p => p.y).concat([0]);
      k.given('The camera: eye at (2.0, 1.7, 2.6) metres, level, looking at (0, 1.7, 0); picture plane d = 100 mm in front of the eye. The box is 2 m × 1 m × 2 m standing on the ground. O is the centre of vision; HL passes through it because the camera is level. Coordinates below are in millimetres from O.', () => {
        k.seg(k.pt(Math.min(...xs) - 20, 0), k.pt(Math.max(...xs) + 20, 0), { cls: 'given' });
        k.label(k.pt(Math.min(...xs) - 20, 0), 'HL', 'nw', small);
        k.seg(k.pt(0, Math.min(...ys) - 15), k.pt(0, Math.max(...ys) + 15), { cls: 'cons', dash: true });
        k.point(O, 'O', 'se');
        k.frame(Math.min(...xs) - 30, Math.min(...ys) - 20, Math.max(...xs) + 30, Math.max(...ys) + 20);
      });
      k.step('ruler', 'Plot the four corners of the top face from the table (mm right of and above O): ' + coords([2, 6, 7, 3]) + '.', () => {
        [2, 6, 7, 3].forEach(i => k.point(pts[i], names[i], at8(i)));
      });
      k.step('ruler', 'Plot the four corners of the bottom face: ' + coords([1, 5, 4, 0]) + '.', () => {
        [1, 5, 4, 0].forEach(i => k.point(pts[i], names[i], at8(i)));
      });
      const ev = P.edgesWithVisibility(M, model);
      k.step('straightedge', 'Join the corners in the order of the box. The visible edges are drawn full, the three edges hidden behind the box dashed.', () => {
        ev.forEach(e => { if (e.visible) k.seg(pts[e.a], pts[e.b], { cls: 'thick' }); else k.seg(pts[e.a], pts[e.b], { cls: 'cons', dash: true }); });
      });
      const nearTo = (v, i, j) => g.dist(pts[i], v) < g.dist(pts[j], v) ? i : j;
      const ix = nearTo(VPx, 1, 0), tx = nearTo(VPx, 2, 3), iz = nearTo(VPz, 1, 5), tz = nearTo(VPz, 2, 6);
      k.step('straightedge', 'Extend the edges that run along x (D–A and D′–A′) and the edges that run along z (A–B and A′–B′): each pair meets on HL, at the vanishing point of its direction. VP_x = (' + num(VPx.x) + ', ' + num(VPx.y) + ') and VP_z = (' + num(VPz.x) + ', ' + num(VPz.y) + ').', () => {
        k.seg(pts[ix], VPx, { cls: 'cons' }); k.seg(pts[tx], VPx, { cls: 'cons' });
        k.seg(pts[iz], VPz, { cls: 'cons' }); k.seg(pts[tz], VPz, { cls: 'cons' });
        k.point(VPx, 'VP_x', 'n'); k.point(VPz, 'VP_z', 'n');
      });
      k.note('The other two edges of each family go to the same points, and the vertical edges stay vertical (the camera is level, so the vertical direction has no vanishing point). The matrix gives VP_x by putting the point at infinity (1, 0, 0, 0) through the same product: its fourth coordinate is the depth, and the quotient is the vanishing point.', () => {
        const other = (i, j, V) => k.seg(pts[i], V, { cls: 'aux', dash: true });
        other(nearTo(VPx, 5, 4), 0, VPx); other(nearTo(VPx, 6, 7), 0, VPx);
        other(nearTo(VPz, 0, 4), 0, VPz); other(nearTo(VPz, 3, 7), 0, VPz);
      });
    }
  });

  /* ------------------------------------------------------------------ 6. foreshortening of the ground */
  Hyper.construction({
    id: 'pb-ground-foreshortening',
    title: 'Equal steps on the ground seen from the eye: the rays on the window bunch up to HL',
    tags: ['perspective', 'foreshortening', 'ground', 'rays', 'dividers'],
    note: 'Side view. The eye E at height e looks along the ground; the window W is at distance d. Equal steps s on the ground at distances z give crossings at height e·(1 − d/z) on the window: the nearest step is the tallest, and each next one is shorter by a factor close to (z / (z + s))². The crossings climb towards the level of the eye but never reach it: the ground meets HL only at infinity. The same bunching is why the tiles of a floor and the planks of a road get thinner in the distance.',
    build(k) {
      const g = k.g;
      const e = 200, d = 100, z0 = 150, s = 60, n = 7;
      const E = k.pt(0, e), W0 = k.pt(d, 0), W1 = k.pt(d, 232);
      const G = i => k.pt(z0 + s * i, 0);
      const onW = Q => g.lineLine(E, Q, W0, W1);
      const y = i => onW(G(i)).y;
      k.given('The eye E at height e, the ground, the window W at distance d, and eight marks G₀ … G₇ on the ground spaced equally by s (step them off with the dividers).', () => {
        k.seg(k.pt(-30, 0), k.pt(z0 + s * n + 30, 0), { cls: 'given' });
        k.seg(W0, W1, { cls: 'given', width: 2.4 }); k.label(W1, 'W', 'n', small);
        k.point(E, 'E', 'w');
        for (let i = 0; i <= n; i++) { k.dot(G(i), { r: 0.7 }); k.tick(G(i), k.pt(1, 0)); k.label(G(i), String(i), 's', small); }
        dim(k, k.pt(z0, -38), k.pt(z0 + s, -38), 's', { cls: 'cons' });
        dim(k, k.pt(-24, 0), k.pt(-24, e), 'e', { cls: 'cons', side: 'right' });
        k.frame(-45, -62, z0 + s * n + 50, 245);
      });
      k.step('straightedge', 'Draw the rays from E to each mark G₀ … G₇. They cross the window at the heights of the pictures of the marks.', () => {
        for (let i = 0; i <= n; i++) { k.seg(E, G(i), { cls: 'cons' }); k.point(onW(G(i)), '', 'w'); }
      });
      k.step('dividers', 'Measure the gaps between neighbouring crossings on the window. The first is ' + (y(1) - y(0)).toFixed(1) + ', the second ' + (y(2) - y(1)).toFixed(1) + ', and the last ' + (y(n) - y(n - 1)).toFixed(1) + ' (marks 6 to 7): equal steps on the ground give gaps that shrink fast.', () => {
        const gap = i => y(i + 1) - y(i);
        [0, 1, n - 1].forEach((i, j) => {
          const x = d - 20 - j * 26, A1 = k.pt(x, y(i)), B1 = k.pt(x, y(i + 1));
          k.seg(A1, B1, { cls: 'cons' }); k.tick(A1, k.pt(1, 0)); k.tick(B1, k.pt(1, 0));
          k.seg(k.pt(x, y(i)), k.pt(d, y(i)), { cls: 'aux', dotted: true }); k.seg(k.pt(x, y(i + 1)), k.pt(d, y(i + 1)), { cls: 'aux', dotted: true });
          k.text(x - 6, (y(i) + y(i + 1)) / 2, gap(i).toFixed(1), { anchor: 'end', size: 0.8, upright: true });
        });
      });
      k.step('pencil', 'Ink the eight crossings as short horizontal lines on the window: this is the picture of eight equal marks on the ground, bunching towards the horizon.', () => {
        for (let i = 0; i <= n; i++) k.seg(k.pt(d - 10, y(i)), k.pt(d + 10, y(i)), { cls: 'thick', width: 2.6 });
      });
      k.note('The dashed line at eye height is HL. The crossings creep up towards it: the sum of the gaps is bounded by e − y₀, so infinitely many stripes fit between the nearest one and the horizon.', () => {
        k.seg(E, k.pt(z0 + s * n + 30, e), { cls: 'cons', dash: true });
        k.label(k.pt(z0 + s * n + 30, e), 'HL', 'ne', small);
      });
    }
  });

  /* ------------------------------------------------------------------ 7. field of view and focal length */
  Hyper.construction({
    id: 'pb-field-of-view-angle',
    title: 'The focal length for a wanted angle of view',
    tags: ['field of view', 'focal length', 'protractor', 'lens'],
    note: 'The frame is the picture: a width w seen from the lens centre O under the angle ω = 2·atan(w / 2f). Turning that round gives the hand construction: at both ends of the frame lay off 90° − ω/2, and the lines meet at O at the distance f. The scale here is 3 : 1 and the frame is the 36 mm of a full-frame camera (36 × 24 mm); 24 mm and 85 mm lenses are added in the last step. A longer lens narrows the cone and magnifies the middle of the view; the perspective itself changes only with where you stand.',
    build(k) {
      const g = k.g, sc = 3, w = 36, half = w * sc / 2, fov = 40;
      const A = k.pt(-half, 0), B = k.pt(half, 0), M0 = k.pt(0, 0);
      const f = (w / 2) / Math.tan(fov / 2 * D2R), O = k.pt(0, f * sc);
      k.given('The frame AB of width w = 36 mm (drawn three times full size), its middle M and the axis through M. The wanted angle of view across the frame: ω = 40°.', () => {
        k.seg(A, B, { cls: 'thick' }); k.tick(A, k.pt(1, 0)); k.tick(B, k.pt(1, 0));
        k.point(A, 'A', 'sw'); k.point(B, 'B', 'se'); k.point(M0, 'M', 'ne');
        k.seg(k.pt(0, -20), k.pt(0, 290), { cls: 'cons', dash: true });
        dim(k, k.pt(-half, -30), k.pt(half, -30), 'w = 36 mm', { cls: 'cons', side: 'right', dist: 1.5 });
        k.frame(-150, -62, 150, 300);
      });
      k.step('protractor', 'At A lay off 70° (that is 90° − ω/2) from AB towards the middle; at B do the same on the other side. The two lines meet on the axis at O, the centre of the lens.', () => {
        k.seg(A, O, { cls: 'cons' }); k.seg(B, O, { cls: 'cons' });
        k.point(O, 'O', 'ne');
        k.angle(A, B, O, { label: '70°', r: 1.5, labelDist: 1.5 });
      });
      k.step('ruler', 'Measure MO on the scale and divide by 3: the focal length f = ' + f.toFixed(1) + ' mm, the lens we call "50 mm" (it gives 39.6°; the standard lens is a little narrower than 40°).', () => {
        k.seg(M0, O, { cls: 'thick' });
        k.seg(k.pt(-16, 0), k.pt(-16, f * sc), { cls: 'cons' }); k.tick(k.pt(-16, 0), k.pt(0, 1)); k.tick(k.pt(-16, f * sc), k.pt(0, 1));
        k.text(-28, f * sc * 0.62, 'f', { size: 0.95, anchor: 'end' });
        k.angle(O, A, B, { label: '40°', r: 1.6, labelDist: 1.4 });
      });
      k.note('For comparison the same frame under a 24 mm lens (73.7°) and an 85 mm lens (23.9°): the shorter the lens, the closer O lies to the frame and the wider the cone.', () => {
        [24, 85].forEach(fl => {
          const Q = k.pt(0, fl * sc);
          k.seg(A, Q, { cls: 'aux', dash: true }); k.seg(B, Q, { cls: 'aux', dash: true });
          k.point(Q, fl + ' mm', 'e', { lo: { upright: true, size: 0.8 } });
        });
      });
    }
  });

  /* ------------------------------------------------------------------ 8. a circle in perspective, eight points */
  Hyper.construction({
    id: 'pb-eight-point-circle',
    title: 'A circle in one-point perspective by the eight-point method',
    tags: ['circle', 'ellipse', 'eight points', 'distance point', 'perspective'],
    note: 'A circle lies in a square. In perspective the square is found with the diagonal to the distance point DP, and the circle touches it at the middles of the sides and cuts its diagonals at four more points. Eight points are enough to draw the ellipse by hand. Note that the middle of the ellipse is not the picture of the circle\'s centre: the near half of a circle is nearer the eye and so looks larger, which pushes the ellipse\'s centre towards the viewer. The dashed ellipse is the exact picture, computed point by point; the eight points lie on it.',
    build(k) {
      const g = k.g;
      const s = 120, e = 220, D = 160, ax = -45;
      const tr = (x, z) => k.pt(x * D / (D + z), e * z / (D + z));
      const A = k.pt(ax, 0), B = k.pt(ax + s, 0), VP = k.pt(0, e), DP = k.pt(D, e);
      const C = tr(ax + s, s), Dd = tr(ax, s);
      const O1 = g.lineLine(A, C, B, Dd);
      const u1 = 0.5 - 0.5 * Math.SQRT1_2, u2 = 1 - u1;
      const mx = 230, my = 10;                                           // the true square in the margin
      const tru = (u, v) => k.pt(mx + u * s, my + v * s);
      const Fm = g.lineLine(VP, k.pt(ax + s / 2, 0), C, Dd);
      const Lm = g.lineLine(A, VP, O1, k.pt(O1.x + 1, O1.y)), Rm = g.lineLine(B, VP, O1, k.pt(O1.x + 1, O1.y));
      const a1 = k.pt(ax + u1 * s, 0), a2 = k.pt(ax + u2 * s, 0);
      const diag = [[a1, A, C], [a2, A, C], [a2, B, Dd], [a1, B, Dd]].map(([a, p, q]) => g.lineLine(a, VP, p, q));
      const curve = t => { const q = tr(ax + s / 2 + (s / 2) * Math.cos(t), s / 2 + (s / 2) * Math.sin(t)); return [q.x, q.y]; };
      k.given('The front edge AB of the square, true length s, on the ground line; HL with the vanishing point VP and the distance point DP at distance D from VP. In the margin: the true square with its circle, its diagonals and the four points where they cut the circle.', () => {
        k.seg(k.pt(-90, 0), k.pt(190, 0), { cls: 'given' }); k.label(k.pt(-90, 0), 'GL', 'nw', small);
        k.seg(k.pt(-90, e), k.pt(200, e), { cls: 'given' }); k.label(k.pt(-90, e), 'HL', 'nw', small);
        k.seg(A, B, { cls: 'thick' }); k.point(A, 'A', 'sw'); k.point(B, 'B', 'se');
        k.point(VP, 'VP', 'sw'); k.point(DP, 'DP', 'se');
        dim(k, k.pt(0, e + 30), k.pt(D, e + 30), 'D', { cls: 'cons', dist: 1.3 });
        k.seg(k.pt(0, e), k.pt(0, e + 30), { cls: 'aux' }); k.seg(k.pt(D, e), k.pt(D, e + 30), { cls: 'aux' });
        // the margin figure
        k.poly([tru(0, 0), tru(1, 0), tru(1, 1), tru(0, 1)], { close: true, cls: 'given' });
        k.circle(tru(0.5, 0.5), s / 2, { cls: 'given' });
        k.seg(tru(0, 0), tru(1, 1), { cls: 'cons' }); k.seg(tru(1, 0), tru(0, 1), { cls: 'cons' });
        [[u1, u1], [u2, u1], [u2, u2], [u1, u2]].forEach(([u, v]) => { k.dot(tru(u, v), { r: 0.6 }); k.seg(tru(u, v), tru(u, 0), { cls: 'aux', dotted: true }); });
        k.dot(tru(u1, 0), { r: 0.6 }); k.dot(tru(u2, 0), { r: 0.6 });
        k.label(tru(0.5, 1.02), 'true plan', 'n', small);
        k.frame(-100, -22, 365, e + 52);
      });
      k.step('straightedge', 'Join A and B to VP: the two sides of the square that run away from you.', () => {
        k.seg(A, VP, { cls: 'cons' }); k.seg(B, VP, { cls: 'cons' });
      });
      k.step('straightedge', 'Join A to DP. This 45° line crosses BVP at C, the far right corner: the depth of the square is fixed by the distance point.', () => {
        k.seg(A, DP, { cls: 'cons' });
        k.point(C, 'C', 'e');
      });
      k.step('tee', 'Draw the horizontal through C. It meets AVP at D, the far left corner: the square ABCD is the picture of a square on the ground.', () => {
        k.seg(Dd, C, { cls: 'thick' });
        k.point(Dd, 'D', 'w');
        k.seg(A, Dd, { cls: 'thick' }); k.seg(B, C, { cls: 'thick' });
      });
      k.step('straightedge', 'Draw the diagonals AC and BD. They cross at O′, the picture of the centre of the circle (and of the square).', () => {
        k.seg(A, C, { cls: 'cons' }); k.seg(B, Dd, { cls: 'cons' });
        k.point(O1, 'O′', 'ne');
      });
      k.step('tee', 'Through O′ draw the horizontal: it meets AD and BC at the middles L and R of those sides. The line from VP through the middle of AB meets DC at the middle F′ of the far side. These are four of the eight points: the circle touches the square there.', () => {
        k.seg(Lm, Rm, { cls: 'cons' });
        k.seg(VP, k.pt(ax + s / 2, 0), { cls: 'cons' });
        k.point(Lm, 'L', 'w'); k.point(Rm, 'R', 'e'); k.point(k.pt(ax + s / 2, 0), 'F', 's'); k.point(Fm, 'N', 'n');
      });
      k.step('dividers', 'Carry the two divisions of the margin square onto AB: a₁ at 0.146 s and a₂ at 0.854 s from A. They are where the diagonals of the true square cut the circle, seen from the side.', () => {
        k.point(a1, 'a_1', 's'); k.point(a2, 'a_2', 's');
      });
      k.step('straightedge', 'Join a₁ and a₂ to VP. Each line meets the diagonals AC and BD at two points: these are the other four points of the circle, found exactly because the diagonal of the picture records equal depth and width.', () => {
        k.seg(a1, VP, { cls: 'cons' }); k.seg(a2, VP, { cls: 'cons' });
        diag.forEach(p => k.point(p, '', 'ne'));
      });
      const top = (() => { let b = null, t = null; for (let i = 0; i <= 720; i++) { const q = curve(i * Math.PI / 360); if (!b || q[1] < b[1]) b = q; if (!t || q[1] > t[1]) t = q; } return { b, t }; })();
      k.step('pencil', 'Draw a smooth closed curve through the eight points, touching the sides of the square at L, R, F and N. It is an ellipse: round at both ends (never pointed), widest not at O′ but a little nearer you.', () => {
        k.curve(curve, [0, 2 * Math.PI], { cls: 'curve', n: 240 });
      });
      k.note('O′ is the picture of the centre of the circle; the centre of the ellipse c is half-way between its highest and lowest points, and lies nearer the eye. The two are close here and apart for a circle that is large or low.', () => {
        const c = k.pt((top.b[0] + top.t[0]) / 2, (top.b[1] + top.t[1]) / 2);
        k.point(c, 'c', { at: 's', open: true });
      });
    }
  });

  /* @@MORE@@ */
})();
