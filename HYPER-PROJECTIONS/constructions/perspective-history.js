/* HYPER-PROJECTIONS · constructions/perspective-history.js — the instruments and the pictures of early perspective.
 *
 *   ph-brunelleschi-panel   the geometry of Brunelleschi's peephole panel and its mirror (plan view)
 *   ph-alberti-veil         Alberti's window: the veil with its grid, and the copy square by square
 *   ph-durer-door           Dürer's door: the thread from the wall hook and the crossing threads of the frame
 *   ph-durer-glass          Dürer's glass pane with the sight: equal steps on the ground, unequal on the glass
 *   ph-camera-obscura       the camera obscura: the inverted image, its size, and the blur of a finite hole
 *   ph-pantograph           the pantograph linkage: a machine that scales a drawing by central projection
 *   ph-masaccio-vault       the barrel vault of Masaccio's Trinity: receding arches by the distance point
 * Every point is computed with k.g; the perspective positions were checked against x' = x_s + (x - x_s) D/(z + D).
 */
(function () {
  'use strict';
  const rad = a => a * Math.PI / 180;

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.construction({
    id: 'ph-brunelleschi-panel',
    title: 'Brunelleschi\'s peephole panel and its mirror',
    tags: ['Brunelleschi', 'mirror', 'peephole', 'plan'],
    note: 'The plan, seen from above. The eye E is at the back of the panel P, looking through the hole H. The painted face of the panel looks away from the eye, towards a mirror M held in front of it. The eye therefore sees the mirror image P′ of the panel, as far behind the mirror as P is in front: at the distance a + 2m from the eye. That is the distance from which the painting was drawn. The picture has to be the central projection of the Baptistery from E on a plane P′ at that distance; and without the mirror the eye sees the real building through the same hole. Not to scale: the building was some 50 times farther away than drawn.',
    build(k) {
      const g = k.g, a = 26, m = 70, hp = 45, Lc = 400, Rr = 80, bg = { upright: true, bg: true, size: 0.8 };
      const E = k.pt(0, 0), H = k.pt(-a, 0), Mc = k.pt(-a - m, 0), Pc = k.pt(-a - 2 * m, 0), Ctr = k.pt(-Lc, 0);
      const oct = Array.from({ length: 8 }, (_, i) => g.polar(Ctr, Rr, rad(45 * i)));
      const front = [oct[0], oct[1], oct[2], oct[6], oct[7]];
      const onP = X => g.lineLine(E, X, k.pt(Pc.x, 0), k.pt(Pc.x, 1));
      const marks = front.map(onP);
      const back = Y => k.pt(-a, Y.y);                      // the same lateral position on the real panel
      k.given('The plan of the scene: the eye E, the Baptistery (an octagon) straight ahead, far away. The eye is at distance a = 26 behind the panel P (with its peephole H) and the mirror M is held m = 70 in front of the panel, towards the building.', () => {
        k.point(E, 'E', { at: 'ne', lo: bg, cls: 'red' });
        k.poly(oct, { close: true, cls: 'given' }); k.label(k.pt(Ctr.x, -Rr - 12), 'Baptistery (plan)', 's', { upright: true, size: 0.8 });
        k.seg(k.pt(H.x, -hp), k.pt(H.x, hp), { cls: 'thick' }); k.point(H, 'H', { at: 'ne', lo: bg }); k.label(k.pt(H.x, hp), 'P', 'n', { upright: true });
        k.seg(k.pt(Mc.x, -hp), k.pt(Mc.x, hp), { cls: 'thick', width: 4 }); k.label(k.pt(Mc.x, hp), 'M', 'n', { upright: true });
        k.seg(E, k.pt(Ctr.x + Rr + 20, 0), { cls: 'cons', dash: true });
        k.frame(Ctr.x - Rr - 25, -Rr - 25, 22, Rr + 25); k.fontScale(0.8);
      });
      k.step('ruler', 'Lay off the distance a from E to the panel P (a vertical line with the peephole H on the axis) and a further m to the mirror M.', () => {
        k.dim(E, H, 'a', { dist: 1.6, upright: true, size: 0.75, ticks: true }); k.dim(H, Mc, 'm', { dist: 1.6, upright: true, size: 0.75, ticks: true });
      });
      k.step('dividers', 'Carry the distance HM beyond the mirror: the mirror image P′ of the panel is behind the mirror, at a + 2m from the eye. This is the picture plane the painter had to use.', () => {
        k.seg(k.pt(Pc.x, -hp), k.pt(Pc.x, hp), { cls: 'curve', dash: true }); k.label(k.pt(Pc.x, hp), "P'", 'n', { upright: true });
        k.dim(E, Pc, 'D = a + 2m', { side: 'left', dist: 3.6, upright: true, size: 0.75, ticks: true });
      });
      k.step('straightedge', 'From E draw the visual rays to the five corners of the Baptistery that the eye sees, and extend them: the two outer ones bound the cone of vision.', () => {
        front.forEach(X => k.seg(E, X, { cls: 'cons' }));
      });
      k.step('straightedge', 'Mark where each ray crosses P′: these lateral positions are where the painter had to put the corners of the building on the picture. The outer two show how wide the painted view must be.', () => {
        marks.forEach(p => k.dot(p, { r: 0.8, cls: 'curve' }));
        k.label(marks[2], 's_1', 'nw', { size: 0.7, upright: true, bg: true }); k.label(marks[3], 's_2', 'sw', { size: 0.7, upright: true, bg: true });
      });
      k.step('fold', 'Fold the sheet about the mirror line M: P′ falls on the real panel P. Each mark lands at the same lateral position on P: these are the marks on the painted face that the eye sees in the mirror.', () => {
        marks.forEach(p => { const q = back(p); k.dot(q, { r: 0.8 }); k.arrow(p, q, { cls: 'aux', dash: true }); });
      });
      k.step('thread', 'Follow the light from an edge point p of the painted face: it runs to the mirror and returns to E. The straight line from E to the image p′ on P′ shows where it appears to come from.', () => {
        const p = k.pt(-a, hp * 0.85), pimg = k.pt(Pc.x, hp * 0.85);
        const Eimg = k.pt(-2 * (a + m), 0), W = g.lineLine(p, Eimg, k.pt(Mc.x, 0), k.pt(Mc.x, 1));
        k.dot(p, { cls: 'red' }); k.label(p, 'p', 'ne', { upright: true, size: 0.75, bg: true }); k.dot(pimg, { cls: 'red' }); k.label(pimg, "p'", 'nw', { upright: true, size: 0.75, bg: true });
        k.seg(p, W, { cls: 'red' }); k.seg(W, E, { cls: 'red' }); k.seg(E, pimg, { cls: 'red', dash: true }); k.dot(W, { r: 0.8 });
      });
      k.note('Take the mirror away and the same eye, through the same hole, sees the real building along the same rays. The painting and the Baptistery then coincide because both are the central projection from E.', () => {
        k.seg(E, k.pt(Ctr.x + Rr, 0), { cls: 'aux', dash: true });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.construction({
    id: 'ph-alberti-veil',
    title: 'Alberti\'s window: the veil and the square-by-square copy',
    tags: ['Alberti', 'veil', 'grid', 'tee', 'copy'],
    note: 'Alberti\'s veil (velo) is a frame with a net of threads, set between the eye and the thing to be drawn. Everything seen through one square of the net goes into the same square of a grid of the same proportions on the panel. The side elevation shows why this is perspective: each thread of the net is the trace, in the picture plane, of the visual rays through it; the rows are seen edge-on as the marks on the veil line. The eye must stay at one fixed place: Alberti\'s followers fixed it with a sight.',
    build(k) {
      const g = k.g, th = rad(30), Dist = 160, e = 90, q = 20, nc = 8, nr = 6, side = 70, ZA = 30, XA = -10, bg = { upright: true, bg: true, size: 0.8 };
      const xv = 0, xE = -Dist, gx0 = 120, W = nc * q, Hh = nr * q, pyOff = -(Hh + 60);
      const u1 = [Math.cos(th), Math.sin(th)], u2 = [-Math.sin(th), Math.cos(th)];
      const E = k.pt(xE, e), V0 = k.pt(xv, 0), V1 = k.pt(xv, Hh);
      const at = (a, b, h) => ({ X: XA + a * u1[0] + b * u2[0], Z: ZA + a * u1[1] + b * u2[1], h });
      const veilPt = (P, ox, oy) => { const s = Dist / (P.Z + Dist); return k.pt(ox + P.X * s, oy + e + (P.h - e) * s); };
      const cx = gx0 + W / 2;
      const corners = { A0: at(0, 0, 0), A1: at(0, 0, side), B0: at(side, 0, 0), B1: at(side, 0, side), D0: at(0, side, 0), D1: at(0, side, side), C0: at(side, side, 0), C1: at(side, side, side) };
      const pic = (n, ox, oy) => veilPt(corners[n], ox, oy);
      const edgesVis = [['A0', 'A1'], ['A0', 'B0'], ['B0', 'B1'], ['A1', 'B1'], ['A0', 'D0'], ['D0', 'D1'], ['A1', 'D1'], ['B1', 'C1'], ['D1', 'C1']];
      const gridAt = (ox, oy, cls) => { for (let i = 0; i <= nc; i++) k.seg(k.pt(ox + i * q, oy), k.pt(ox + i * q, oy + Hh), { cls }); for (let j = 0; j <= nr; j++) k.seg(k.pt(ox, oy + j * q), k.pt(ox + W, oy + j * q), { cls }); };
      const zNear = ZA, zFar = ZA + side * (u1[1] + u2[1]);
      const vz = Z => k.pt(xv + Z, 0);
      const heights = [[zNear, side], [zFar, side], [zNear, 0], [zFar, 0]];
      const mark = ([Z, h]) => g.lineLine(E, k.pt(xv + Z, h), V0, V1);
      k.given('Left, the side elevation: the ground line, the eye E at height 90 and distance 160 from the veil, whose rows (every 20) are seen edge-on on the veil line, and the cube, turned 30°. Right, the veil seen from the front: a net of 8 × 6 squares, and the cube as the eye sees it through the net.', () => {
        k.seg(k.pt(xE - 15, 0), k.pt(xv + zFar + 25, 0), { cls: 'given' });
        k.seg(V0, V1, { cls: 'thick' }); for (let j = 0; j <= nr; j++) k.tick(k.pt(xv, j * q), k.pt(0, 1), { size: 0.8 });
        k.label(V1, 'veil', 'n', { upright: true, size: 0.85 });
        k.point(E, 'E', { at: 'nw', lo: bg, cls: 'red' });
        k.dim(k.pt(xE - 10, 0), k.pt(xE - 10, e), 'e', { side: 'right', dist: 1.0, upright: true, size: 0.75, ticks: true });
        k.rect(xv + zNear, 0, xv + zFar, side, { cls: 'given' });
        gridAt(gx0, 0, 'cons');
        edgesVis.forEach(([p, r]) => k.seg(pic(p, cx, 0), pic(r, cx, 0), { cls: 'given' }));
        k.label(k.pt(gx0 + W / 2, Hh), 'the veil seen from the eye', 'n', { upright: true, size: 0.8 });
        k.frame(xE - 28, pyOff - 30, gx0 + W + 8, Hh + 24); k.fontScale(0.85);
      });
      k.step('thread', 'Sight from E along the corners of the cube: the top near and far corners and the foot near and far corners. Each sight line crosses the veil line at the height of a mark (a, b, c, d).', () => {
        heights.forEach(([Z, h], i) => { k.seg(E, k.pt(xv + Z, h), { cls: 'cons' }); const p = mark([Z, h]); k.dot(p, { r: 0.8, cls: 'red' }); k.label(p, 'abcd'[i], 'w', { upright: true, size: 0.75, bg: true }); });
      });
      k.step('tee', 'Carry the four heights across to the veil with the T-square. They run exactly through the corners of the cube\'s picture: the net shows what the sight lines have found.', () => {
        heights.forEach(([Z, h]) => { const p = mark([Z, h]); k.seg(p, k.pt(gx0 + W, p.y), { cls: 'cons', dash: true }); });
      });
      k.step('square', 'Rule on the panel the same net: 8 columns and 6 rows of the same proportions (any size). Use the T-square for the rows and the set square for the columns.', () => {
        gridAt(gx0, pyOff, 'cons');
        k.label(k.pt(gx0 + W / 2, pyOff), 'the panel', 's', { upright: true, size: 0.8 });
      });
      k.step('dividers', 'Square by square, mark on the panel the corners of the cube where they fall in the same squares of the net, at the same fraction of the square across and up.', () => {
        Object.keys(corners).filter(n => n !== 'C0').forEach(n => { const p = pic(n, cx, pyOff); k.dot(p, { r: 0.8 }); });
      });
      k.step('pencil', 'Join the corners in the order of the veil: the visible edges of the cube. The panel now holds the same perspective picture; draw the grid fainter and rub it out.', () => {
        edgesVis.forEach(([p, r]) => k.seg(pic(p, cx, pyOff), pic(r, cx, pyOff), { cls: 'thick' }));
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.construction({
    id: 'ph-durer-door',
    title: 'Dürer\'s door: one thread, two crossing threads',
    tags: ['Dürer', 'thread', 'plan and elevation', 'device'],
    note: 'A thread is fixed to a hook E in the wall (the eye) and ends on a point of the object. A hinged frame stands between: across it run a vertical thread and a horizontal one, slid until both touch the long thread. Their crossing is where the thread passes the picture plane. The plan (top) shows why the vertical thread fixes the sideways position of the crossing, and the elevation (right) why the horizontal thread fixes its height: two threads, because the point has two coordinates in the frame. The frame is then closed onto the paper and the crossing marked. Here the frame\'s opening, bottom left, is also the paper.',
    build(k) {
      const g = k.g, Eh = 90, Zf = 120, Y1 = 190, XE0 = 105, bg = { upright: true, bg: true, size: 0.8 };
      const bx = { x0: -80, x1: -30, z0: 150, z1: 210, h: 50 };
      const V = { A0: [bx.x0, 0, bx.z0], A1: [bx.x0, bx.h, bx.z0], B0: [bx.x1, 0, bx.z0], B1: [bx.x1, bx.h, bx.z0], C0: [bx.x1, 0, bx.z1], C1: [bx.x1, bx.h, bx.z1], D0: [bx.x0, 0, bx.z1], D1: [bx.x0, bx.h, bx.z1] };
      const vis = [['A0', 'A1'], ['A0', 'B0'], ['B0', 'B1'], ['A1', 'B1'], ['B0', 'C0'], ['C0', 'C1'], ['B1', 'C1'], ['A1', 'D1'], ['D1', 'C1']];
      const fx0 = -75, fx1 = 15, fy0 = 0, fy1 = 100;
      const Ep = k.pt(0, Y1), Ee = k.pt(XE0, Eh);
      const planOf = n => k.pt(V[n][0], Y1 + V[n][2]), elevOf = n => k.pt(XE0 + V[n][2], V[n][1]);
      const xc = n => V[n][0] * Zf / V[n][2], yc = n => Eh + (V[n][1] - Eh) * Zf / V[n][2];
      const pf = n => k.pt(xc(n), yc(n));
      const done = new Set();
      const thread = (n, lab) => {
        if (!done.has(n[0])) { done.add(n[0]); k.seg(Ep, planOf(n), { cls: 'red' }); k.seg(k.pt(xc(n), Y1 + Zf), k.pt(xc(n), yc(n)), { cls: 'cons', dash: true }); k.dot(k.pt(xc(n), Y1 + Zf), { r: 0.8 }); }
        else k.seg(k.pt(xc(n), Y1 + Zf), k.pt(xc(n), yc(n)), { cls: 'cons', dash: true });
        k.seg(Ee, elevOf(n), { cls: 'red' }); k.dot(k.pt(XE0 + Zf, yc(n)), { r: 0.8 });
        k.seg(k.pt(XE0 + Zf, yc(n)), k.pt(xc(n), yc(n)), { cls: 'cons', dash: true });
        k.dot(pf(n), { cls: 'red', r: 1.2 }); k.label(pf(n), lab, 'nw', { upright: true, size: 0.8, bg: true });
      };
      k.given('Three views of the device. Top: the plan, with the hook Eₚ, the frame seen edge-on (a line) and the box beyond it. Right: the elevation, from the side, with the hook E at height 90, the frame as a vertical line and the box. Bottom left: the frame seen from the front, the opening still empty.', () => {
        k.point(Ep, 'E', { at: 'sw', lo: bg, cls: 'red' }); k.seg(k.pt(fx0 - 10, Y1 + Zf), k.pt(fx1 + 10, Y1 + Zf), { cls: 'thick' }); k.label(k.pt(fx1 + 10, Y1 + Zf), 'frame', 'e', { upright: true, size: 0.8 });
        k.poly([planOf('A0'), planOf('B0'), planOf('C0'), planOf('D0')], { close: true, cls: 'given' }); k.label(k.pt(-95, Y1 + 235), 'plan', 'e', { upright: true, size: 0.9 });
        k.seg(k.pt(XE0, 0), k.pt(XE0 + 245, 0), { cls: 'given' }); k.point(Ee, 'E', { at: 'nw', lo: bg, cls: 'red' });
        k.seg(k.pt(XE0 + Zf, fy0), k.pt(XE0 + Zf, fy1), { cls: 'thick' }); k.label(k.pt(XE0 + Zf, fy1), 'frame', 'n', { upright: true, size: 0.8 });
        k.rect(XE0 + bx.z0, 0, XE0 + bx.z1, bx.h, { cls: 'given' }); k.label(k.pt(XE0 + 170, 130), 'elevation', 'e', { upright: true, size: 0.9 });
        k.rect(fx0, fy0, fx1, fy1, { cls: 'given' }); k.label(k.pt((fx0 + fx1) / 2, fy1 + 4), 'frame, seen from the front', 'n', { upright: true, size: 0.8 });
        k.frame(-100, -14, XE0 + 255, Y1 + 245); k.fontScale(0.85);
      });
      k.step('thread', 'Take the near top corner A₁ of the box. In the plan stretch the thread from E to the corner: it crosses the frame line, and the vertical thread of the frame is slid to that place and carried down. In the elevation the same thread (from E to the top of the box) crosses the frame line at a height; the horizontal thread is slid to that height and carried across. Their crossing is p₁.', () => thread('A1', 'p_1'));
      k.step('thread', 'The top corner B₁ at the right end of the front face: the same two threads, in plan and elevation, give p₂.', () => thread('B1', 'p_2'));
      k.step('thread', 'The far top corner D₁ of the box: p₃. The plan thread is longer, so the vertical thread is nearer the middle of the frame.', () => thread('D1', 'p_3'));
      k.step('thread', 'The foot A₀ of the near edge: the plan thread is the one already stretched for A₁, so the vertical thread is the same; only the elevation thread is new. p₄ lies straight below p₁.', () => thread('A0', 'p_4'));
      k.step('pencil', 'Find the other corners the same way (or from the lines through p₁ to p₃ and p₂ to p₃) and join the crossings as the box joins them. The opening now holds the perspective picture of the box seen from E.', () => {
        ['B0', 'C0', 'C1', 'D0'].forEach(n => k.dot(pf(n), { r: 0.9 }));
        vis.forEach(([p, r]) => k.seg(pf(p), pf(r), { cls: 'thick' }));
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.construction({
    id: 'ph-durer-glass',
    title: 'Dürer\'s glass pane and the sight',
    tags: ['Dürer', 'glass', 'sight', 'foreshortening', 'thread'],
    note: 'The draughtsman looks through the fixed sight S, so every sight line starts at one point, and traces on the glass what lies behind it. The side view shows what he traces. Equal steps on the ground (the marks 1 to 5, 40 apart) are traced as steps that shrink with distance. The post is traced with a height proportional to d/z. Move the glass farther from the sight and the tracing is larger but identical in shape: it is a scaled copy of the same picture.',
    build(k) {
      const g = k.g, e = 80, d = 70, Hp = 60, zs = [150, 190, 230, 270, 310], d2 = 105, bg = { upright: true, bg: true, size: 0.8 };
      const S = k.pt(0, e), G0 = k.pt(d, 0), G1 = k.pt(d, 135), G20 = k.pt(d2, 0), G21 = k.pt(d2, 135);
      const T = k.pt(zs[0], Hp), Bp = k.pt(zs[0], 0);
      const onGlass = P => g.lineLine(S, P, G0, G1), onGlass2 = P => g.lineLine(S, P, G20, G21);
      const f1 = v => v.toFixed(1);
      const hs = zs.map(z => onGlass(k.pt(z, 0)).y), gaps = hs.slice(1).map((y, i) => y - hs[i]);
      k.given('The side view: the ground, the sight S at the draughtsman\'s eye height 80, a pane of glass at distance d = 70 from S, and behind it a post 60 high at the first of five ground marks, 40 apart.', () => {
        k.seg(k.pt(-28, 0), k.pt(zs[4] + 36, 0), { cls: 'given' });
        k.seg(k.pt(0, 0), S, { cls: 'thick' }); k.point(S, 'S', { at: 'nw', lo: bg, cls: 'red' });
        k.seg(G0, G1, { cls: 'curve', width: 3.6 }); k.label(G1, 'glass', 'n', { upright: true, size: 0.85 });
        k.dim(k.pt(0, -10), k.pt(d, -10), 'd', { side: 'right', dist: 0.9, upright: true, size: 0.75, ticks: true });
        zs.forEach((z, i) => { k.dot(k.pt(z, 0)); k.label(k.pt(z, 0), String(i + 1), 's', { upright: true, size: 0.8 }); });
        k.seg(Bp, T, { cls: 'thick' }); k.label(T, 'post', 'n', { upright: true, size: 0.8 });
        k.frame(-34, -26, zs[4] + 44, 148); k.fontScale(0.85);
      });
      k.step('thread', 'Sight along the top and the foot of the post: two threads from S. They cross the glass at t and b. The tracing of the post on the glass is the stretch bt.', () => {
        k.seg(S, T, { cls: 'cons' }); k.seg(S, Bp, { cls: 'cons' });
        const t = onGlass(T), b = onGlass(Bp);
        k.dot(t, { cls: 'red' }); k.dot(b, { cls: 'red' }); k.label(t, 't', 'ne', { upright: true, size: 0.8, bg: true }); k.label(b, 'b', 'sw', { upright: true, size: 0.8, bg: true });
        k.seg(b, t, { cls: 'red', width: 3.2 });
      });
      k.step('ruler', 'Measure bt on the glass. By similar triangles it is the height of the post times d/z: 60 × 70/150 = ' + f1(60 * 70 / 150) + '. The glass is 70/150 of the way to the post, so the tracing is that fraction of the post.', () => {
        const t = onGlass(T), b = onGlass(Bp);
        k.dim(b, t, 'bt = ' + f1(t.y - b.y), { side: 'left', dist: 3.6, upright: true, size: 0.75, ticks: true });
      });
      k.step('thread', 'Now sight along the five ground marks. The threads cross the glass at ' + hs.map(f1).join(', ') + ' above the ground.', () => {
        zs.forEach((z, i) => { const P = k.pt(z, 0), p = onGlass(P); k.seg(S, P, { cls: 'cons' }); k.dot(p, { r: 0.8, cls: 'red' }); });
      });
      k.step('dividers', 'Step the spaces between the five marks on the glass: ' + gaps.map(f1).join(', ') + '. Equal steps on the ground are traced smaller and smaller: foreshortening, drawn by the glass itself.', () => {
        for (let i = 0; i < zs.length - 1; i++) { const p = onGlass(k.pt(zs[i], 0)), q = onGlass(k.pt(zs[i + 1], 0)); k.seg(k.pt(d + 6, p.y), k.pt(d + 6, q.y), { cls: 'curve', width: 3.2 }); k.tick(p, k.pt(0, 1), { size: 0.5 }); }
        k.tick(onGlass(k.pt(zs[4], 0)), k.pt(0, 1), { size: 0.5 });
      });
      k.note('Move the glass to d = 105 (dashed): the same threads now cross it at 1.5 times the heights and intervals. The tracing grows, its shape does not change.', () => {
        k.seg(G20, G21, { cls: 'aux', dash: true });
        k.seg(onGlass2(Bp), onGlass2(T), { cls: 'aux', dash: true, width: 3 });
        zs.forEach(z => k.dot(onGlass2(k.pt(z, 0)), { r: 0.6, cls: 'aux' }));
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.construction({
    id: 'ph-camera-obscura',
    title: 'The camera obscura: the inverted image and its size',
    tags: ['camera obscura', 'pinhole', 'similar triangles', 'ray diagram'],
    note: 'Light travels in straight lines, so a point of the scene reaches the screen only along the line through the hole: every point of the scene has one image point, upside down and left-right reversed. The triangles on either side of the hole are similar, so the image is the object scaled by dᵢ / dₒ. A real hole has a width a, and each scene point lights a small patch of width b = a (1 + dᵢ/dₒ) instead of a point: a larger hole is brighter but blurrier. The hole here (a = 14) is far larger than a real one.',
    build(k) {
      const g = k.g, do_ = 240, di = 110, a = 14, yb = -20, yt = 60, bg = { upright: true, bg: true, size: 0.8 };
      const O = k.pt(0, 0), Ob = k.pt(-do_, yb), Ot = k.pt(-do_, yt);
      const sc0 = k.pt(di, -80), sc1 = k.pt(di, 80);
      const onScreen = P => g.lineLine(P, O, sc0, sc1);
      const It = onScreen(Ot), Ib = onScreen(Ob);
      const up = k.pt(0, a / 2), dn = k.pt(0, -a / 2);
      const patch = P => [g.lineLine(P, up, sc0, sc1), g.lineLine(P, dn, sc0, sc1)];
      k.given('The side view: the object, an arrow from y = −20 to y = 60 at the distance dₒ = 240 from the front wall; the wall with a pinhole O on the axis; the screen at the distance dᵢ = 110 behind the wall.', () => {
        k.seg(k.pt(0, -85), k.pt(0, -a / 2), { cls: 'thick' }); k.seg(k.pt(0, a / 2), k.pt(0, 85), { cls: 'thick' }); k.label(k.pt(0, 85), 'wall', 'n', { upright: true, size: 0.85 });
        k.point(O, 'O', { at: 'nw', lo: bg });
        k.seg(sc0, sc1, { cls: 'thick' }); k.label(sc1, 'screen', 'n', { upright: true, size: 0.85 });
        k.seg(Ob, Ot, { cls: 'curve', width: 3.4 }); k.head(Ot, k.pt(0, 1), { size: 1.2 }); k.label(Ot, 'T', 'nw', { upright: true, size: 0.85 }); k.label(Ob, 'B', 'sw', { upright: true, size: 0.85 });
        k.seg(k.pt(-do_ - 30, 0), k.pt(di + 25, 0), { cls: 'cons', dash: true });
        k.dim(k.pt(-do_, -62), k.pt(0, -62), 'd_o', { dist: 1.0, upright: true, size: 0.8, ticks: true }); k.dim(k.pt(0, -62), k.pt(di, -62), 'd_i', { dist: 1.0, upright: true, size: 0.8, ticks: true });
        k.frame(-do_ - 40, -100, di + 40, 100); k.fontScale(0.85);
      });
      k.step('straightedge', 'The ray from the top T through the hole O goes on to the screen and lands at T′, below the axis: the top of the arrow is the bottom of the image.', () => {
        k.seg(Ot, It, { cls: 'cons' }); k.point(It, "T'", { at: 'se', lo: bg });
      });
      k.step('straightedge', 'The ray from the foot B through O lands at B′, above the axis. The arrow is upside down on the screen.', () => {
        k.seg(Ob, Ib, { cls: 'cons' }); k.point(Ib, "B'", { at: 'ne', lo: bg });
        k.seg(Ib, It, { cls: 'curve', width: 3.4 });
      });
      k.step('ruler', 'Measure the image T′B′: 80 × 110/240 = 36.7. The two triangles T–axis–O and T′–axis–O are similar, so the image is the object scaled by dᵢ/dₒ = 0.458.', () => {
        k.dim(Ib, It, "h_i = 36.7", { side: 'left', dist: 3.6, upright: true, size: 0.8, ticks: true });
        k.dim(Ob, Ot, 'h_o = 80', { side: 'left', dist: 2.6, upright: true, size: 0.8, ticks: true });
      });
      k.step('compass', 'Now take account of the width of the hole, a = 14: its edges are O′ above and O″ below the axis. Draw the rays from T through the two edges: they strike the screen at two points, the ends of a patch of width b.', () => {
        const [p1, p2] = patch(Ot);
        k.point(up, 'O′', { at: 'ne', lo: bg }); k.point(dn, 'O″', { at: 'se', lo: bg });
        k.seg(Ot, p1, { cls: 'red' }); k.seg(Ot, p2, { cls: 'red' });
        k.seg(p1, p2, { cls: 'red', width: 4 });
      });
      k.step('ruler', 'Measure the patch: b = a (1 + dᵢ/dₒ) = 14 × 1.458 = 20.4, wider than the hole and growing with the screen distance. Every point of the scene is smeared into such a patch: the image is blurred by b.', () => {
        const [p1, p2] = patch(Ot);
        k.dim(p2, p1, 'b = 20.4', { side: 'right', dist: 8.5, upright: true, size: 0.8, ticks: true });
        const [q1, q2] = patch(Ob); k.seg(Ob, q1, { cls: 'cons', dash: true }); k.seg(Ob, q2, { cls: 'cons', dash: true });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.construction({
    id: 'ph-pantograph',
    title: 'The pantograph: scaling a drawing by central projection',
    tags: ['pantograph', 'Scheiner', 'machine', 'similarity', 'compass'],
    note: 'Four bars make a parallelogram ABCD. Bar I runs from the pivot O through A to D, with OA = AD, so that A is its midpoint. Bar IV runs from D through C to P, with DC = CP. Because ABCD is a parallelogram, O, B and P are always on one line and OP = 2·OB, whatever the shape of the parallelogram: the tracer at B and the pencil at P are related by a central scaling by 2 about O. Seen as a perspective, it is the picture of a plane that is parallel to the picture plane.',
    build(k) {
      const g = k.g, t = 80, s = 70, bg = { upright: true, bg: true, size: 0.85 };
      const O = k.pt(0, 0);
      const T = [k.pt(62, 60), k.pt(112, 22), k.pt(92, 96)];
      const B = T[0];
      const A = g.circleCircle(O, t, B, s).filter(p => g.cross(g.sub(B, O), g.sub(p, O)) < 0)[0];
      const D = g.add(O, g.mul(g.sub(A, O), 2));
      const C = g.add(B, g.sub(D, A));
      const P = g.add(C, g.sub(C, D));
      const P2 = g.add(O, g.mul(g.sub(T[1], O), 2)), P3 = g.add(O, g.mul(g.sub(T[2], O), 2));
      k.given('The pivot O, fixed, and a figure to copy: the triangle T₁T₂T₃. The bars are 80 long (bar I, from O to D, with the hinge A at its midpoint) and 70 long (the sides AB and DC).', () => {
        k.point(O, 'O', { at: 'sw', lo: bg, cls: 'red' });
        k.poly(T, { close: true, cls: 'given' });
        T.forEach((p, i) => k.point(p, 'T_' + (i + 1), { at: ['nw', 'se', 'n'][i], lo: bg }));
        k.frame(-30, -35, 240, 205); k.fontScale(0.85);
      });
      k.step('compass', 'First position: put the tracer on T₁, which is the hinge B. The hinge A is 80 from O and 70 from B: draw a circle about O of radius 80 and a circle about B of radius 70, and take their intersection A (the lower one).', () => {
        k.circle(O, t, { cls: 'cons', width: 1.4 }); k.circle(B, s, { cls: 'cons' });
        k.point(A, 'A', { at: 'se', lo: bg }); k.point(B, 'B', { at: 'sw', lo: bg });
      });
      k.step('dividers', 'Extend OA beyond A by its own length (carry OA with the dividers from A): D. Bar I is the straight bar O A D, 160 long.', () => {
        k.seg(O, D, { cls: 'thick' }); k.point(D, 'D', { at: 'sw', lo: bg });
      });
      k.step('square', 'Through B draw the parallel to AD and carry AD along it: C. The figure ABCD is a parallelogram: AB = DC and BC = AD. Join A to B and B to C.', () => {
        k.seg(A, B, { cls: 'thick' }); k.seg(B, C, { cls: 'thick' }); k.point(C, 'C', { at: 'ne', lo: bg });
        k.seg(D, C, { cls: 'cons' });
      });
      k.step('dividers', 'Extend DC beyond C by its own length: P, the pencil. Bar IV is the straight bar D C P, 140 long.', () => {
        k.seg(D, P, { cls: 'thick' }); k.point(P, 'P_1', { at: 'ne', lo: bg });
      });
      k.step('straightedge', 'The check: the straightedge from O through B passes through P, and OP is twice OB. Ink the line O B P.', () => {
        k.seg(O, P, { cls: 'cons', dash: true });
        k.tick(g.mid(O, B), g.sub(B, O), { size: 1.3 }); k.tick(g.mid(B, P), g.sub(B, O), { size: 1.3 }); k.text(P.x + 34, P.y - 12, 'OP = 2·OB', { size: 0.85, upright: true, bg: true });
      });
      k.step('straightedge', 'The other corners: whatever the pose of the linkage, the pencil is on the ray from O through the tracer, at twice the distance. Draw O T₂ and O T₃ and carry OT twice along each with the dividers: P₂ and P₃.', () => {
        k.seg(O, P2, { cls: 'cons' }); k.seg(O, P3, { cls: 'cons' });
        k.point(P2, 'P_2', { at: 'e', lo: bg }); k.point(P3, 'P_3', { at: 'n', lo: bg });
      });
      k.step('pencil', 'Join P₁P₂P₃: the copy, twice as long in every direction and four times the area. Rays from O and the pantograph do the same job.', () => {
        k.poly([P, P2, P3], { close: true, cls: 'thick' });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.construction({
    id: 'ph-masaccio-vault',
    title: 'The barrel vault of the Trinity: arches receding to one point',
    tags: ['Masaccio', 'barrel vault', 'one-point', 'distance point', 'compass'],
    note: 'A scheme of the architecture of Masaccio\'s Trinity (Santa Maria Novella, c. 1427), not a tracing of it: a barrel vault entered through a round arch, in one-point perspective with the vanishing point at the eye level of a person standing before the fresco. Every arch of the vault lies in a plane parallel to the picture, so it stays a true circle, only smaller and nearer the vanishing point. Their sizes come from the floor line and the distance point DP: a diagonal to DP gives the scale s = D/(D + z) of each arch with no calculation.',
    build(k) {
      const g = k.g, R = 100, e = 30, ys = 120, D = 240, wd = 30, n = 5, bg = { upright: true, bg: true, size: 0.8 };
      const VP = k.pt(0, 0), DP = k.pt(D, 0), BL = k.pt(-R, -e), L0 = k.pt(-R, ys), C0 = k.pt(0, ys), Top = k.pt(0, ys + R);
      const Tk = i => k.pt(-R - i * wd, -e);
      const Xk = i => g.lineLine(Tk(i), DP, VP, BL);
      const Lk = i => g.lineLine(VP, L0, k.pt(Xk(i).x, 0), k.pt(Xk(i).x, 1));
      const Ck = i => g.lineLine(k.pt(0, 0), k.pt(0, 1), Lk(i), k.pt(Lk(i).x + 1, Lk(i).y));
      const sc = i => D / (D + i * wd);
      const rib = j => g.polar(C0, R, rad(30 * j));
      const xL = -R - n * wd - 18;
      k.given('The sheet with the horizon HL and the vanishing point VP at eye level, the distance point DP on HL at the viewing distance D = 240, and the ground line GL 30 below. The chapel is entered through a semicircular arch of radius 100 about C₀, resting on two piers from GL up to the springing line.', () => {
        k.seg(k.pt(xL, 0), k.pt(D + 25, 0), { cls: 'given', dash: true }); k.label(k.pt(D + 25, 0), 'HL', 'ne', { upright: true, size: 0.85 });
        k.seg(k.pt(xL, -e), k.pt(D + 25, -e), { cls: 'given' }); k.label(k.pt(D + 25, -e), 'GL', 'ne', { upright: true, size: 0.85 });
        k.point(VP, 'VP', { at: 'n', lo: bg }); k.point(DP, 'DP', { at: 'n', lo: bg });
        k.seg(BL, L0, { cls: 'thick' }); k.seg(k.pt(R, -e), k.pt(R, ys), { cls: 'thick' });
        k.arc(C0, R, 0, Math.PI, { cls: 'thick' }); k.point(C0, 'C_0', { at: 'e', lo: bg });
        k.point(BL, 'B', { at: 'sw', lo: bg }); k.point(L0, 'L_0', { at: 'w', lo: bg });
        k.frame(xL, -e - 18, D + 40, ys + R + 12); k.fontScale(0.8);
      });
      k.step('straightedge', 'From VP draw the receding lines of the two walls: to the foot B of each pier (the floor lines) and to the springing corners (L₀ on the left).', () => {
        k.seg(VP, BL, { cls: 'cons' }); k.seg(VP, L0, { cls: 'cons' });
        k.seg(VP, k.pt(R, -e), { cls: 'cons' }); k.seg(VP, k.pt(R, ys), { cls: 'cons' });
      });
      k.step('dividers', 'On GL step the depth of one bay, 30, five times to the left of B: T₁ … T₅. They are the depths measured sideways on the ground line.', () => {
        for (let i = 1; i <= n; i++) { k.dot(Tk(i)); k.label(Tk(i), 'T_' + i, 's', { upright: true, size: 0.7 }); }
      });
      k.step('straightedge', 'Join each Tᵢ to DP. Where it crosses the floor line VP–B is the foot Xᵢ of the i-th arch: the diagonals of the floor squares, from the distance point.', () => {
        for (let i = 1; i <= n; i++) { k.seg(Tk(i), DP, { cls: 'cons' }); k.dot(Xk(i), { r: 0.7 }); }
      });
      k.step('square', 'Raise a vertical through each Xᵢ up to the springing line VP–L₀: the springing points L₁ … L₅ of the receding arches.', () => {
        for (let i = 1; i <= n; i++) { k.seg(Xk(i), Lk(i), { cls: 'cons' }); k.dot(Lk(i), { r: 0.7 }); }
      });
      k.step('tee', 'Through each Lᵢ draw a horizontal to the central axis: the centres C₁ … C₅ of the arches.', () => {
        for (let i = 1; i <= n; i++) { k.seg(Lk(i), Ck(i), { cls: 'cons' }); k.dot(Ck(i), { r: 0.7 }); }
        k.seg(VP, Top, { cls: 'cons', dash: true });
      });
      k.step('compass', 'With centre Cᵢ and radius CᵢLᵢ draw the semicircle of the i-th arch. They get smaller and nearer VP, but stay circles.', () => {
        for (let i = 1; i <= n; i++) k.arc(Ck(i), g.dist(Ck(i), Lk(i)), 0, Math.PI, { cls: 'curve' });
      });
      k.step('protractor', 'Divide the front arch into six parts of 30° (the ribs of the vault).', () => {
        for (let j = 1; j <= 5; j++) k.dot(rib(j), { r: 0.8 });
      });
      k.step('straightedge', 'Join each rib point to VP. The ribs run through the same points of every arch, so the coffers between them and the arches are in perspective.', () => {
        for (let j = 0; j <= 6; j++) { const P5 = g.lerp(VP, rib(j), sc(n)); k.seg(rib(j), P5, { cls: 'cons' }); }
      });
      k.note('The vault, inked: the front arch heavy, the receding arches lighter, the ribs between. The scale of the i-th arch is sᵢ = D/(D + 30 i): 0.89, 0.80, 0.73, 0.67, 0.62.', () => {
        for (let i = 1; i <= n; i++) k.arc(Ck(i), g.dist(Ck(i), Lk(i)), 0, Math.PI, { cls: 'thick', width: 2.0 - i * 0.2 });
      });
    }
  });


})();
