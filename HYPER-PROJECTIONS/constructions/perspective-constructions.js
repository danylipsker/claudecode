/* HYPER-PROJECTIONS · constructions/perspective-constructions.js — the drawing-board methods of linear perspective.
 *
 *   pc-plan-elevation-house   a gabled house by the plan-and-elevation (visual-ray) method
 *   pc-alberti-floor          Alberti's costruzione legittima: the tiled floor, the side elevation, the diagonal check
 *   pc-direct-measuring       the direct (measuring-point) method: measuring points swung with the compass
 *   pc-shadow-sun-behind      shadow of a post, sun behind the viewer (light vanishing point below the horizon)
 *   pc-shadow-sun-front       shadow of a post, sun in front of the viewer (light vanishing point above the horizon)
 *   pc-shadow-lamp            shadow of a post from a lamp (the shadow lines radiate from the lamp's foot)
 *   pc-reflection-water       reflection of a block in still water: equal depth, verticals continued, same vanishing points
 *   pc-reflection-mirror      reflection in a vertical mirror on a side wall (one-point perspective)
 *   pc-anamorphosis-grid      a plane anamorphosis: a square grid projected from an oblique eye (plan and elevation)
 *   pc-ames-room              the Ames room in plan: a trapezoidal room whose corners lie on the rays to the peephole
 *   pc-reverse-perspective    a table in reverse (Byzantine) perspective, with the ordinary perspective dashed
 *   pc-atmospheric-tones      atmospheric perspective as a scale of tones and hatching densities
 * Every point is computed with k.g; the picture positions were checked against the central-projection formula
 * x' = x_s + (x − x_s) D/(z + D), y' = y_HL + (h − e) D/(z + D).
 */
(function () {
  'use strict';
  const rad = a => a * Math.PI / 180;

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.construction({
    id: 'pc-plan-elevation-house',
    title: 'A gabled house by the plan-and-elevation (visual-ray) method',
    tags: ['perspective', 'plan and elevation', 'vanishing points', 'house'],
    note: 'The plan is drawn above the picture plane PP, seen edge-on; the picture (ground line GL, horizon HL) below. Every point of the house is found with a straightedge and a set square: the plan says *where* a corner is seen (the ray from SP crosses PP), the true height at A says *how high*. The edge A touches PP, so it is the only edge drawn at full size; all the other heights are carried along lines to the vanishing points. The ridge is parallel to the long wall, so it vanishes at VP₁, the same point as the eaves.',
    build(k) {
      const g = k.g, th = rad(35), Dist = 140, sx = 20, e = 150, H1 = 60, H2 = 95, w = 150, dep = 90, bg = { bg: true };
      const u1 = k.pt(Math.cos(th), Math.sin(th)), u2 = k.pt(-Math.sin(th), Math.cos(th));
      const A = k.pt(0, 0), B = g.add(A, g.mul(u1, w)), Dd = g.add(A, g.mul(u2, dep)), C = g.add(B, g.mul(u2, dep));
      const Mm = g.mid(A, Dd), Nn = g.mid(B, C), SP = k.pt(sx, -Dist);
      const PP0 = k.pt(0, 0), PP1 = k.pt(1, 0);
      const cross = X => g.lineLine(SP, X, PP0, PP1);
      const vOf = u => g.lineLine(SP, g.add(SP, u), PP0, PP1);
      const b = cross(B), c = cross(C), d = cross(Dd), m = cross(Mm), n = cross(Nn), v1 = vOf(u1), v2 = vOf(u2);
      const HLy = -Dist - 75, GLy = HLy - e;
      const VP1 = k.pt(v1.x, HLy), VP2 = k.pt(v2.x, HLy);
      const A0 = k.pt(0, GLy), A1 = k.pt(0, GLy + H1), A2 = k.pt(0, GLy + H2);
      const vert = x => [k.pt(x, 0), k.pt(x, 1)];
      const hit = (P, Q, x) => g.lineLine(P, Q, ...vert(x));
      const D0 = hit(A0, VP2, d.x), D1 = hit(A1, VP2, d.x), Ra = hit(A2, VP2, m.x);
      const B0 = hit(A0, VP1, b.x), B1 = hit(A1, VP1, b.x);
      const C0 = g.lineLine(B0, VP2, ...vert(c.x)), C1 = g.lineLine(B1, VP2, ...vert(c.x));
      const Rb = hit(Ra, VP1, n.x);
      const xL = -120, xR = v1.x + 45, yTop = 175, yBot = GLy - 30, yDrop = GLy - 14;
      k.given('The plan of the house (corner A touches the picture plane PP), the station point SP, and below them the ground line GL and the horizon HL at eye height. The ridge runs parallel to AB; the eaves are at height H₁ and the ridge at H₂ (given as true lengths).', () => {
        k.seg(k.pt(xL, 0), k.pt(xR, 0), { cls: 'given' }); k.label(k.pt(xR, 0), 'PP', 'ne', { upright: true });
        k.poly([A, B, C, Dd], { close: true, cls: 'given' });
        k.seg(Mm, Nn, { cls: 'cons', dash: true });
        k.point(A, 'A', { at: 'se', lo: { bg: true } }); k.point(B, 'B', 'e'); k.point(C, 'C', 'ne'); k.point(Dd, 'D', 'nw'); k.point(Mm, 'M', 'w'); k.point(Nn, 'N', 'e');
        k.point(SP, 'SP', 'se', { cls: 'red' });
        k.seg(k.pt(xL, HLy), k.pt(xR, HLy), { cls: 'given', dash: true }); k.label(k.pt(xR, HLy), 'HL', 'ne', { upright: true });
        k.seg(k.pt(xL, GLy), k.pt(xR, GLy), { cls: 'given' }); k.label(k.pt(xR, GLy), 'GL', 'ne', { upright: true });
        k.dim(k.pt(xL + 12, GLy), k.pt(xL + 12, HLy), 'eye height', { side: 'right', dist: 1.2, size: 0.8, upright: true });
        k.frame(xL - 5, yBot, xR + 5, yTop); k.fontScale(0.8);
      });
      k.step('straightedge', 'From SP draw the visual rays to the corners B, C, D and to the ridge points M and N (A is on PP already). Where each ray crosses PP, mark the point in small letters.', () => {
        [B, C, Dd, Mm, Nn].forEach(X => k.seg(SP, X, { cls: 'cons' }));
        const lb = at => ({ at, lo: { bg: true, upright: true } });
        k.point(b, 'b', lb('se')); k.point(c, 'c', lb('sw')); k.point(d, 'd', lb('nw')); k.point(m, 'm', lb('sw')); k.point(n, 'n', lb('se'));
      });
      k.step('square', 'With the set square slide a parallel to AB through SP until it meets PP at v₁, and a parallel to AD through SP to v₂. These give the directions in which the two walls recede.', () => {
        k.seg(SP, v1, { cls: 'cons' }); k.seg(SP, v2, { cls: 'cons' });
        k.point(v1, 'v_1', 'n'); k.point(v2, 'v_2', 'n');
      });
      k.step('square', 'Drop v₁ and v₂ vertically onto HL: the vanishing points VP₁ and VP₂.', () => {
        k.seg(v1, VP1, { cls: 'cons' }); k.seg(v2, VP2, { cls: 'cons' });
        k.point(VP1, 'VP_1', 'ne'); k.point(VP2, 'VP_2', 'nw');
      });
      k.step('square', 'Drop A, b, c, d, m and n vertically from PP into the picture, below GL. Every vertical edge of the house will stand on one of these lines.', () => {
        [A, b, c, d, m, n].forEach(X => k.seg(X, k.pt(X.x, yDrop), { cls: 'cons' }));
      });
      k.step('ruler', 'The edge at A lies in PP, so it is drawn true size: on its vertical lay off from GL the eaves height H₁ and the ridge height H₂.', () => {
        k.point(A0, 'A_0', { at: 's', lo: bg }); k.point(A1, 'A_1', { at: 'se', lo: bg }); k.point(A2, 'A_2', { at: 'ne', lo: bg });
        k.seg(A0, A2, { cls: 'thick' });
      });
      k.step('straightedge', 'From A₀, A₁ and A₂ draw lines to VP₂. They are the foot, the eaves and the ridge level of the end wall AD, and they cut the verticals of d and m in D₀, D₁ and the ridge end R.', () => {
        [A0, A1, A2].forEach(P => k.seg(P, VP2, { cls: 'cons' }));
        k.point(D0, 'D_0', { at: 'w', lo: bg }); k.point(D1, 'D_1', { at: 'w', lo: bg }); k.point(Ra, 'R', { at: 'nw', lo: bg });
      });
      k.step('straightedge', 'From A₀ and A₁ draw lines to VP₁: the foot and the eaves of the long wall AB. They cut the vertical of b in B₀ and B₁.', () => {
        [A0, A1].forEach(P => k.seg(P, VP1, { cls: 'cons' }));
        k.point(B0, 'B_0', { at: 'se', lo: bg }); k.point(B1, 'B_1', { at: 'e', lo: bg });
      });
      k.step('straightedge', 'From B₀ and B₁ draw lines to VP₂, and from D₀ and D₁ to VP₁. Each pair meets on the vertical of c: C₀ and C₁. The meeting is also your check.', () => {
        [B0, B1].forEach(P => k.seg(P, VP2, { cls: 'cons' }));
        [D0, D1].forEach(P => k.seg(P, VP1, { cls: 'cons' }));
        k.point(C0, 'C_0', { at: 'se', lo: bg }); k.point(C1, 'C_1', { at: 'ne', lo: bg });
      });
      k.step('straightedge', 'The ridge is parallel to AB, so from R draw a line to VP₁: it cuts the vertical of n in the other ridge end S.', () => {
        k.seg(Ra, VP1, { cls: 'cons' });
        k.point(Rb, 'S', { at: 'ne', lo: bg });
      });
      k.step('pencil', 'Line in what the eye sees: the two walls, the gable end and the near roof slope. The far walls and the far roof slope stay hidden.', () => {
        [[A0, A1], [A0, B0], [B0, B1], [A1, B1], [A0, D0], [D0, D1], [A1, D1], [A1, Ra], [D1, Ra], [Ra, Rb], [B1, Rb]].forEach(([P, Q]) => k.seg(P, Q, { cls: 'thick' }));
      });
      k.note('The hidden edges, dashed: the far foot edges, the far wall, and the far slope of the roof.', () => {
        [[B0, C0], [D0, C0], [C0, C1], [B1, C1], [D1, C1], [Rb, C1]].forEach(([P, Q]) => k.seg(P, Q, { cls: 'cons', dash: true }));
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.construction({
    id: 'pc-alberti-floor',
    title: 'Alberti\'s costruzione legittima: a tiled floor',
    tags: ['perspective', 'Alberti', 'floor', 'distance point', 'dividers'],
    note: 'The floor is six braccia (units) wide and six deep. The orthogonals come from dividing the base; the spacing of the transversals comes from the side elevation, where the eye E stands at the true eye height and the true viewing distance from the picture plane. The picture above and the elevation below share one scale. If you have no room for the elevation, the diagonal does the same job: a line from a base corner to the distance point D (on the horizon, one viewing distance from the centric point C) cuts the orthogonals exactly where the transversals belong.',
    build(k) {
      const g = k.g, b = 30, N = 6, h = 80, d = 5 * b, top = 118, GLs = -190, xs = -15;
      const half = N * b / 2, bg = { bg: true, upright: true, size: 0.8 };
      const C = k.pt(0, h), Dp = k.pt(d, h), Bk = i => k.pt(-half + i * b, 0);
      const E = k.pt(xs - d, GLs + h);
      const ppLo = k.pt(xs, GLs), ppHi = k.pt(xs, GLs + top);
      const Zk = i => k.pt(xs + i * b, GLs);
      const Pk = i => g.lineLine(E, Zk(i), ppLo, ppHi);
      const tk = i => k.pt(0, Pk(i).y - GLs);
      const outerL = y => g.lineLine(Bk(0), C, k.pt(0, y), k.pt(1, y));
      const outerR = y => g.lineLine(Bk(N), C, k.pt(0, y), k.pt(1, y));
      const corner = (i, kk) => kk === 0 ? Bk(i) : g.lineLine(Bk(i), C, k.pt(0, tk(kk).y), k.pt(1, tk(kk).y));
      k.given('The picture: a frame whose lower side is the base line, six braccia long, and the horizon HL at the eye height h with the centric point C in the middle. Below it the side elevation: the ground line, the picture-plane line PP, and the eye E at height h and distance d from PP. The braccio b is given as a ticked length.', () => {
        k.rect(-half - 10, -4, half + 10, top, { cls: 'given' });
        k.seg(Bk(0), Bk(N), { cls: 'thick' }); k.label(Bk(0), 'A', 'sw', { upright: true }); k.label(Bk(N), 'B', 'se', { upright: true });
        k.seg(k.pt(-half - 10, h), k.pt(d + 25, h), { cls: 'given', dash: true }); k.label(k.pt(d + 25, h), 'HL', 'e', { upright: true });
        k.point(C, 'C', { at: 'nw', lo: { upright: true } });
        const gA = k.pt(-half - 10, -34), gB = k.pt(-half - 10 + b, -34);
        k.seg(gA, gB, { cls: 'given' }); k.tick(gA, k.pt(1, 0)); k.tick(gB, k.pt(1, 0)); k.dim(gA, gB, 'b', { dist: 1.0, upright: true, size: 0.8 });
        // the side elevation
        k.seg(k.pt(xs - d - 12, GLs), k.pt(xs + N * b + 12, GLs), { cls: 'given' }); k.label(k.pt(xs + N * b + 12, GLs), 'ground', 'e', { upright: true, size: 0.8 });
        k.seg(ppLo, ppHi, { cls: 'given' }); k.label(ppHi, 'PP', 'n', { upright: true });
        k.point(E, 'E', { at: 'n', lo: { upright: true }, cls: 'red' });
        k.dim(k.pt(xs - d, GLs - 12), k.pt(xs, GLs - 12), 'd', { dist: 0.9, upright: true, size: 0.8, ticks: true });
        k.dim(k.pt(xs - d - 12, GLs), E, 'h', { side: 'right', dist: 1.0, upright: true, size: 0.8, ticks: true });
        k.frame(-half - 25, GLs - 35, d + 40, top + 8); k.fontScale(0.85);
      });
      k.step('dividers', 'Step the braccio b along the base line from A: six equal parts, marks 0 to 6.', () => {
        for (let i = 0; i <= N; i++) { k.dot(Bk(i)); k.label(Bk(i), i, 's', { upright: true, size: 0.8 }); }
      });
      k.step('straightedge', 'Join every mark of the base to the centric point C: these are the orthogonals, the parallel lines running away from you across the floor.', () => {
        for (let i = 0; i <= N; i++) k.seg(Bk(i), C, { cls: 'cons' });
      });
      k.step('dividers', 'In the side elevation step the same braccio b along the ground from the PP line: marks 1 to 6 are the depths of the transversals behind the picture.', () => {
        for (let i = 1; i <= N; i++) { k.dot(Zk(i)); k.label(Zk(i), i, 's', { upright: true, size: 0.8 }); }
      });
      k.step('straightedge', 'Join E to each mark: the visual rays. Where they cross the PP line, mark the heights p₁ … p₆ above the ground.', () => {
        for (let i = 1; i <= N; i++) k.seg(E, Zk(i), { cls: 'cons' });
        for (let i = 1; i <= N; i++) k.dot(Pk(i), { r: 0.8 });
        k.label(Pk(1), 'p_1', 'ne', { size: 0.8 }); k.label(Pk(N), 'p_6', 'ne', { size: 0.8 });
      });
      k.step('dividers', 'Carry each height pₖ from the ground line of the elevation up the central vertical of the picture, starting from the base line: marks t₁ … t₆.', () => {
        for (let i = 1; i <= N; i++) k.dot(tk(i), { r: 0.8 });
        k.label(tk(1), 't_1', 'e', { size: 0.8, bg: true }); k.label(tk(N), 't_6', 'e', { size: 0.8, bg: true });
      });
      k.step('tee', 'With the T-square draw a horizontal through each mark tₖ, between the two outer orthogonals: the transversals. Orthogonals and transversals together make the tiles.', () => {
        for (let i = 1; i <= N; i++) k.seg(outerL(tk(i).y), outerR(tk(i).y), { cls: 'cons' });
      });
      k.step('straightedge', 'The check: lay the straightedge from the corner A through the far corner of the first tile. It must pass through the corners of every tile of that diagonal and run on to the distance point D, one distance d to the right of C on HL. A bent line means a wrong transversal.', () => {
        k.point(Dp, 'D', { at: 'ne', lo: { upright: true } });
        k.seg(Bk(0), Dp, { cls: 'curve' });
        for (let i = 1; i <= N; i++) k.dot(corner(i, i), { r: 0.8, cls: 'curve' });
        k.dim(C, Dp, 'd', { dist: 0.9, upright: true, size: 0.8, ticks: true });
      });
      k.note('Shade alternate tiles. Each tile is a square of the floor; the nearest are widest and tallest, the farthest narrow and shallow.', () => {
        for (let i = 0; i < N; i++) for (let kk = 0; kk < N; kk++) if ((i + kk) % 2 === 0)
          k.hatch([corner(i, kk), corner(i + 1, kk), corner(i + 1, kk + 1), corner(i, kk + 1)], { angle: Math.PI / 4, gap: 0.45, stroke: '#555', outline: true });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.construction({
    id: 'pc-direct-measuring',
    title: 'The direct measuring method: a box with measuring points',
    tags: ['perspective', 'measuring points', 'compass', 'two-point'],
    note: 'No plan of the box is needed, only the station point SP and the angle of the walls to the picture plane. A measuring point is a vanishing point turned into a ruler: because the triangle SP–v–m is isosceles, lines drawn from m to marks on the ground line measure true lengths along the receding edge. Rule: the edge that vanishes at VP₁ is measured with M₁, which lies on the other side of VP₁ from the edge, at the distance v₁SP; the true length is laid off on GL from A towards VP₁\'s side. The same for VP₂ and M₂.',
    build(k) {
      const g = k.g, th = rad(40), Dist = 110, e = 110, w = 130, dd = 90, hb = 80, xA = 10;
      const PPy = 0, SP = k.pt(0, -Dist), PP0 = k.pt(0, PPy), PP1 = k.pt(1, PPy);
      const v1 = g.lineLine(SP, g.add(SP, k.pt(Math.cos(th), Math.sin(th))), PP0, PP1);
      const v2 = g.lineLine(SP, g.add(SP, k.pt(-Math.sin(th), Math.cos(th))), PP0, PP1);
      const r1 = g.dist(v1, SP), r2 = g.dist(v2, SP);
      const m1 = k.pt(v1.x - r1, PPy), m2 = k.pt(v2.x + r2, PPy);
      const HLy = -Dist - 70, GLy = HLy - e;
      const V1 = k.pt(v1.x, HLy), V2 = k.pt(v2.x, HLy), M1 = k.pt(m1.x, HLy), M2 = k.pt(m2.x, HLy);
      const A0 = k.pt(xA, GLy), A1 = k.pt(xA, GLy + hb);
      const T1 = k.pt(xA + w, GLy), T2 = k.pt(xA - dd, GLy);
      const vert = x => [k.pt(x, 0), k.pt(x, 1)];
      const X1 = g.lineLine(M1, T1, A0, V1), X2 = g.lineLine(M2, T2, A0, V2);
      const C0 = g.lineLine(X1, V2, X2, V1);
      const X1t = g.lineLine(A1, V1, ...vert(X1.x)), X2t = g.lineLine(A1, V2, ...vert(X2.x));
      const C1 = g.lineLine(X1t, V2, X2t, V1);
      const xL = V2.x - 40, xR = V1.x + 35, bg = { bg: true };
      k.given('The picture plane PP with the station point SP below it (plan strip), the horizon HL and ground line GL below, and the nearest vertical edge of the box at A on GL. The walls are turned 40° and 50° to the picture plane. True lengths: width w (towards the right), depth d (towards the left), height h.', () => {
        k.seg(k.pt(xL, PPy), k.pt(xR, PPy), { cls: 'given' }); k.label(k.pt(xR, PPy), 'PP', 'ne', { upright: true });
        k.point(SP, 'SP', { at: 'se', lo: { upright: true }, cls: 'red' });
        k.seg(k.pt(xL, HLy), k.pt(xR, HLy), { cls: 'given', dash: true }); k.label(k.pt(xR, HLy), 'HL', 'ne', { upright: true });
        k.seg(k.pt(xL, GLy), k.pt(xR, GLy), { cls: 'given' }); k.label(k.pt(xR, GLy), 'GL', 'ne', { upright: true });
        k.point(A0, 'A', { at: 's', lo: { upright: true } });
        const tw = k.pt(xL + 8, GLy - 40), th2 = k.pt(xL + 8 + w, GLy - 40);
        k.seg(tw, th2, { cls: 'given' }); k.tick(tw, k.pt(1, 0)); k.tick(th2, k.pt(1, 0)); k.dim(tw, th2, 'w = 130', { dist: 1.0, upright: true, size: 0.8 });
        const td = k.pt(xL + 8 + w + 25, GLy - 40), td2 = k.pt(xL + 8 + w + 25 + dd, GLy - 40);
        k.seg(td, td2, { cls: 'given' }); k.tick(td, k.pt(1, 0)); k.tick(td2, k.pt(1, 0)); k.dim(td, td2, 'd = 90', { dist: 1.0, upright: true, size: 0.8 });
        k.frame(xL, GLy - 56, xR + 20, 14); k.fontScale(0.85);
      });
      k.step('protractor', 'From SP draw a line at 40° to PP (parallel to the long wall) and another at 50° (parallel to the short wall). They meet PP in v₁ and v₂.', () => {
        k.seg(SP, v1, { cls: 'cons' }); k.seg(SP, v2, { cls: 'cons' });
        k.point(v1, 'v_1', { at: 'n', lo: { upright: true } }); k.point(v2, 'v_2', { at: 'n', lo: { upright: true } });
        k.angle(SP, k.pt(SP.x + 40, SP.y), g.add(SP, g.mul(g.unit(g.sub(v1, SP)), 40)), { label: '40°', r: 1.5, labelDist: 1.4, upright: true });
      });
      k.step('square', 'Drop v₁ and v₂ vertically onto HL: the vanishing points VP₁ and VP₂.', () => {
        k.seg(v1, V1, { cls: 'cons' }); k.seg(v2, V2, { cls: 'cons' });
        k.point(V1, 'VP_1', { at: 'ne', lo: bg }); k.point(V2, 'VP_2', { at: 'nw', lo: bg });
      });
      k.step('compass', 'With centre v₁ and radius v₁SP swing SP round onto PP, to m₁ (to the left of v₁). With centre v₂ and radius v₂SP swing SP onto PP to m₂ (to the right of v₂).', () => {
        k.arc3(v1, m1, SP, { cls: 'curve' }); k.arc3(v2, SP, m2, { cls: 'curve' });
        k.point(m1, 'm_1', { at: 'n', lo: { upright: true } }); k.point(m2, 'm_2', { at: 'n', lo: { upright: true } });
      });
      k.step('square', 'Drop m₁ and m₂ vertically onto HL: the measuring points M₁ (for edges going to VP₁) and M₂ (for edges going to VP₂).', () => {
        k.seg(m1, M1, { cls: 'cons' }); k.seg(m2, M2, { cls: 'cons' });
        k.point(M1, 'M_1', { at: 'n', lo: bg }); k.point(M2, 'M_2', { at: 'n', lo: bg });
      });
      k.step('dividers', 'On GL lay off from A the true width w to the right (T₁) and the true depth d to the left (T₂).', () => {
        k.point(T1, 'T_1', { at: 's', lo: { upright: true } }); k.point(T2, 'T_2', { at: 's', lo: { upright: true } });
        k.seg(T2, T1, { cls: 'thick' });
      });
      k.step('straightedge', 'From A draw lines to VP₁ and to VP₂: the two base edges recede along them.', () => {
        k.seg(A0, V1, { cls: 'cons' }); k.seg(A0, V2, { cls: 'cons' });
      });
      k.step('straightedge', 'Join M₁ to T₁: where the line cuts AVP₁ is X₁, the far end of the width. Join M₂ to T₂: it cuts AVP₂ in X₂, the far end of the depth.', () => {
        k.seg(M1, T1, { cls: 'cons' }); k.seg(M2, T2, { cls: 'cons' });
        k.point(X1, 'X_1', { at: 's', lo: bg }); k.point(X2, 'X_2', { at: 's', lo: bg });
      });
      k.step('straightedge', 'From X₁ draw to VP₂ and from X₂ to VP₁. They meet in the fourth corner C of the base.', () => {
        k.seg(X1, V2, { cls: 'cons' }); k.seg(X2, V1, { cls: 'cons' });
        k.point(C0, 'C', { at: 'n', lo: bg });
      });
      k.step('ruler', 'Raise the true height h on the vertical at A, which touches PP: A₁. Draw the verticals through X₁, X₂ and C.', () => {
        k.seg(A0, A1, { cls: 'thick' }); k.point(A1, 'A_1', { at: 'w', lo: bg });
        [X1, X2, C0].forEach(P => k.seg(P, k.pt(P.x, GLy + hb + 6), { cls: 'cons' }));
      });
      k.step('straightedge', 'From A₁ draw to VP₁ and VP₂: they cut the verticals of X₁ and X₂ in X₁′ and X₂′. From those draw to VP₂ and VP₁: they meet on the vertical of C, in C′.', () => {
        k.seg(A1, V1, { cls: 'cons' }); k.seg(A1, V2, { cls: 'cons' });
        k.seg(X1t, V2, { cls: 'cons' }); k.seg(X2t, V1, { cls: 'cons' });
        k.point(X1t, "X_1'", { at: 'e', lo: bg }); k.point(X2t, "X_2'", { at: 'w', lo: bg }); k.point(C1, "C'", { at: 'n', lo: bg });
      });
      k.step('pencil', 'Line in the box: three vertical edges and the two walls in view, and the top.', () => {
        [[A0, A1], [A0, X1], [A0, X2], [X1, X1t], [X2, X2t], [A1, X1t], [A1, X2t], [X1t, C1], [X2t, C1]].forEach(([P, Q]) => k.seg(P, Q, { cls: 'thick' }));
      });
      k.note('The far base edges and the far vertical edge, dashed (hidden).', () => {
        [[X1, C0], [X2, C0], [C0, C1]].forEach(([P, Q]) => k.seg(P, Q, { cls: 'cons', dash: true }));
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  /* two posts of equal height on level ground, shared by the three shadow constructions */
  function twoPosts(k) {
    const g = k.g, HLy = 100;
    const B1 = k.pt(-30, 20), T1 = k.pt(-30, 65), B2 = k.pt(40, -30);
    const Va = g.lineLine(B1, B2, k.pt(0, HLy), k.pt(1, HLy));
    const T2 = g.lineLine(T1, Va, B2, k.pt(B2.x, B2.y + 1));
    return { HLy, B1, T1, B2, T2, Va };
  }
  const POSTS_STEP = 'Both posts are the same height. Join the bases B₁ and B₂ and extend to HL: the vanishing point V of the ground line. A line from T₁ to V meets the vertical at B₂ in the top T₂ of the second post.';
  function drawPosts(k, p, xL, xR) {
    k.seg(k.pt(xL, p.HLy), k.pt(xR, p.HLy), { cls: 'given', dash: true }); k.label(k.pt(xR, p.HLy), 'HL', 'ne', { upright: true });
    k.seg(p.B1, p.T1, { cls: 'thick' });
    k.point(p.B1, 'B_1', { at: 'se', lo: { upright: true, bg: true } }); k.point(p.T1, 'T_1', { at: 'nw', lo: { upright: true, bg: true } });
    k.point(p.B2, 'B_2', { at: 'se', lo: { upright: true, bg: true } });
  }
  function postsStep(k, p) {
    k.step('straightedge', POSTS_STEP, () => {
      k.seg(p.B1, p.Va, { cls: 'cons' }); k.seg(p.T1, p.Va, { cls: 'cons' });
      k.point(p.Va, 'V', { at: 'n', lo: { upright: true, bg: true } });
      k.seg(p.B2, p.T2, { cls: 'thick' }); k.point(p.T2, 'T_2', { at: 'ne', lo: { upright: true, bg: true } });
    });
  }

  Hyper.construction({
    id: 'pc-shadow-sun-behind',
    title: 'Shadows of posts, the sun behind the viewer',
    tags: ['perspective', 'shadows', 'sun', 'light vanishing point'],
    note: 'The sun is so far away that its rays are parallel. Parallel lines meet at a vanishing point, so the rays meet at the light vanishing point L. With the sun behind you, the rays travel away from you and downwards, so L lies below the horizon (it is the sun\'s anti-solar point). Every shadow on level ground lies in a vertical plane that contains a ray, and so vanishes on the horizon straight above L: the shadow vanishing point Vₛ. The lower L is below HL, the higher the sun and the shorter the shadows.',
    build(k) {
      const g = k.g, p = twoPosts(k), xL = p.Va.x - 30, xR = 175;
      const L = k.pt(130, -22), Vs = k.pt(L.x, p.HLy), bg = { upright: true, bg: true };
      const S1 = g.lineLine(p.B1, Vs, p.T1, L), S2 = g.lineLine(p.B2, Vs, p.T2, L);
      k.given('The horizon HL, the post B₁T₁ standing on level ground, the foot B₂ of a second, equal post, and the light vanishing point L below the horizon (the sun is behind you, high or low as you choose).', () => {
        drawPosts(k, p, xL, xR);
        k.point(L, 'L', { at: 'se', lo: bg, cls: 'red' });
        k.frame(xL, -118, xR + 20, 118); k.fontScale(0.85);
      });
      k.step('square', 'From L erect a vertical to HL: the shadow vanishing point Vₛ. All shadows on the ground vanish there.', () => {
        k.seg(L, Vs, { cls: 'cons' }); k.point(Vs, 'V_s', { at: 'ne', lo: bg });
      });
      postsStep(k, p);
      k.step('straightedge', 'The shadow of each post lies on the ground: draw from B₁ and from B₂ to Vₛ. The shadows are parallel in space and so converge in the picture.', () => {
        k.seg(p.B1, Vs, { cls: 'cons' }); k.seg(p.B2, Vs, { cls: 'cons' });
      });
      k.step('straightedge', 'The ray that grazes the top of a post continues to the ground: draw from T₁ and from T₂ to L. Where each cuts its shadow line is the end of the shadow, S₁ and S₂.', () => {
        k.seg(p.T1, L, { cls: 'cons' }); k.seg(p.T2, L, { cls: 'cons' });
        k.point(S1, 'S_1', { at: 'sw', lo: bg }); k.point(S2, 'S_2', { at: 'ne', lo: bg });
      });
      k.step('pencil', 'Ink in the shadows: B₁S₁ and B₂S₂. The nearer post throws the longer shadow in the picture, as it is the larger object.', () => {
        k.seg(p.B1, S1, { cls: 'thick', width: 3.4 }); k.seg(p.B2, S2, { cls: 'thick', width: 3.4 });
      });
      k.note('A higher sun puts L lower below HL (here L′): the ray from T₁ turns steeper and the shadow end slides back along the same shadow line to S₁′. Raise L to HL and the shadows run to infinity: sunset.', () => {
        const L2 = k.pt(L.x, -105), S1b = g.lineLine(p.B1, Vs, p.T1, L2);
        k.point(L2, 'L′', { at: 'se', lo: bg }); k.seg(L, L2, { cls: 'aux', dash: true });
        k.seg(p.T1, L2, { cls: 'aux', dash: true }); k.point(S1b, 'S_1′', { at: 'ne', lo: bg });
      });
    }
  });

  Hyper.construction({
    id: 'pc-shadow-sun-front',
    title: 'Shadows of posts, the sun in front of the viewer',
    tags: ['perspective', 'shadows', 'sun', 'contre-jour'],
    note: 'With the sun in front of you, the sun itself is the vanishing point of its rays: it hangs above the horizon in the picture. Its foot on the horizon, Vₛ, is again the vanishing point of the shadows. But now the shadows run towards you: they start at the bases and grow towards the bottom of the picture, away from Vₛ. The rays are drawn from the tops of the posts to the sun and then extended past the tops, towards you. The nearer and the higher the sun, the shorter the shadows.',
    build(k) {
      const g = k.g, p = twoPosts(k), xL = p.Va.x - 30, xR = 175;
      const L = k.pt(110, 290), Vs = k.pt(L.x, p.HLy), bg = { upright: true, bg: true };
      const S1 = g.lineLine(p.B1, Vs, p.T1, L), S2 = g.lineLine(p.B2, Vs, p.T2, L);
      k.given('The horizon HL, the post B₁T₁ standing on level ground, the foot B₂ of a second, equal post, and the sun L above the horizon.', () => {
        drawPosts(k, p, xL, xR);
        k.point(L, 'sun', { at: 'e', lo: { upright: true, bg: true }, cls: 'red', r: 1.6 });
        k.frame(xL, -125, xR + 20, 305); k.fontScale(0.9);
      });
      k.step('square', 'From the sun drop a vertical to HL: its foot Vₛ is the vanishing point of the shadows.', () => {
        k.seg(L, Vs, { cls: 'cons' }); k.point(Vs, 'V_s', { at: 'ne', lo: bg });
      });
      postsStep(k, p);
      k.step('straightedge', 'Draw the shadow lines from Vₛ through B₁ and B₂ and extend them past the bases, towards you.', () => {
        k.seg(Vs, g.lerp(Vs, S1, 1.08), { cls: 'cons' }); k.seg(Vs, g.lerp(Vs, S2, 1.08), { cls: 'cons' });
      });
      k.step('straightedge', 'Draw the rays from the sun through T₁ and T₂ and extend them past the tops, towards you. Each meets its shadow line at the end of the shadow, S₁ and S₂.', () => {
        k.seg(L, g.lerp(L, S1, 1.06), { cls: 'cons' }); k.seg(L, g.lerp(L, S2, 1.06), { cls: 'cons' });
        k.point(S1, 'S_1', { at: 'sw', lo: bg }); k.point(S2, 'S_2', { at: 'sw', lo: bg });
      });
      k.step('pencil', 'Ink in the shadows B₁S₁ and B₂S₂: they come towards you, away from the sun.', () => {
        k.seg(p.B1, S1, { cls: 'thick', width: 3.4 }); k.seg(p.B2, S2, { cls: 'thick', width: 3.4 });
      });
    }
  });

  Hyper.construction({
    id: 'pc-shadow-lamp',
    title: 'Shadows of posts from a lamp',
    tags: ['perspective', 'shadows', 'lamp', 'point source'],
    note: 'A lamp is a point at a finite distance, so its rays are not parallel and do not vanish anywhere: draw them as ordinary lines. The shadow of a vertical post lies on the line from the lamp\'s foot F (the point of the ground below the lamp) through the post\'s base, because the post, the lamp and F lie in one vertical plane. The end of the shadow is where the ray from the lamp past the top of the post meets that line. The shadow lines radiate from F instead of being parallel.',
    build(k) {
      const g = k.g, p = twoPosts(k), xL = p.Va.x - 30, xR = 150;
      const F = k.pt(60, 5), Lm = k.pt(60, 140), bg = { upright: true, bg: true };
      const S1 = g.lineLine(F, p.B1, Lm, p.T1), S2 = g.lineLine(F, p.B2, Lm, p.T2);
      k.given('The horizon HL, the post B₁T₁, the foot B₂ of an equal post, and a lamp L with its foot F on the ground directly below it.', () => {
        drawPosts(k, p, xL, xR);
        k.point(F, 'F', { at: 'se', lo: bg }); k.point(Lm, 'L', { at: 'ne', lo: bg, cls: 'red', r: 1.4 });
        k.seg(F, Lm, { cls: 'thick' });
        k.frame(xL, -90, xR + 20, 150); k.fontScale(0.85);
      });
      postsStep(k, p);
      k.step('straightedge', 'From F draw lines through B₁ and B₂ and extend them past the bases: the shadows lie along them, radiating from F.', () => {
        k.seg(F, g.lerp(F, S1, 1.1), { cls: 'cons' }); k.seg(F, g.lerp(F, S2, 1.1), { cls: 'cons' });
      });
      k.step('straightedge', 'From L draw lines through T₁ and T₂ and extend them to the ground. Each meets its shadow line at the end of the shadow, S₁ and S₂.', () => {
        k.seg(Lm, g.lerp(Lm, S1, 1.06), { cls: 'cons' }); k.seg(Lm, g.lerp(Lm, S2, 1.06), { cls: 'cons' });
        k.point(S1, 'S_1', { at: 'sw', lo: bg }); k.point(S2, 'S_2', { at: 'sw', lo: bg });
      });
      k.step('pencil', 'Ink in the shadows B₁S₁ and B₂S₂. Unlike the sun\'s, they fan out from the lamp\'s foot.', () => {
        k.seg(p.B1, S1, { cls: 'thick', width: 3.4 }); k.seg(p.B2, S2, { cls: 'thick', width: 3.4 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.construction({
    id: 'pc-reflection-water',
    title: 'The reflection of a block in still water',
    tags: ['perspective', 'reflection', 'water', 'dividers'],
    note: 'Still water is a horizontal mirror. The reflection of a point lies on the same vertical, as far below the water surface as the point is above it, so the nearest vertical edge is simply carried down with the dividers. Because the mirror is horizontal, every horizontal direction is unchanged: the edges of the reflection run to the same vanishing points as the block itself. Only the two near walls are seen in the water; the reflection of the top face and of the far corner is hidden (dashed).',
    build(k) {
      const g = k.g, th = rad(35), Dist = 120, sx = 10, e = 100, w = 110, dd = 75, hb = 60, bg = { upright: true, bg: true };
      const u1 = [Math.cos(th), Math.sin(th)], u2 = [-Math.sin(th), Math.cos(th)];
      const pic = (X, Z, h) => { const s = Dist / (Z + Dist); return k.pt(sx + (X - sx) * s, (h - e) * s); };
      const at = (a, b, h) => pic(a * u1[0] + b * u2[0], a * u1[1] + b * u2[1], h);
      const A0 = at(0, 0, 0), A1 = at(0, 0, hb), B0 = at(w, 0, 0), B1 = at(w, 0, hb), D0 = at(0, dd, 0), D1 = at(0, dd, hb), C0 = at(w, dd, 0), C1 = at(w, dd, hb);
      const HLy = 0, VP1 = k.pt(sx + Dist * u1[0] / u1[1], HLy), VP2 = k.pt(sx + Dist * u2[0] / u2[1], HLy);
      const vert = x => [k.pt(x, 0), k.pt(x, 1)];
      const A1r = k.pt(A0.x, A0.y - (A1.y - A0.y));
      const B1r = g.lineLine(A1r, VP1, ...vert(B0.x)), D1r = g.lineLine(A1r, VP2, ...vert(D0.x));
      const C1r = g.lineLine(B1r, VP2, D1r, VP1);
      const xL = VP2.x - 25, xR = VP1.x + 40;
      k.given('The block standing in the water, drawn in two-point perspective: the horizon HL with VP₁ and VP₂, the two walls in view (A₀A₁B₁B₀ and A₀A₁D₁D₀). The water surface is the plane of the base.', () => {
        k.seg(k.pt(xL, HLy), k.pt(xR, HLy), { cls: 'given', dash: true }); k.label(k.pt(xR, HLy), 'HL', 'ne', { upright: true });
        k.point(VP1, 'VP_1', { at: 'ne', lo: bg }); k.point(VP2, 'VP_2', { at: 'nw', lo: bg });
        [[A0, A1], [A0, B0], [B0, B1], [A1, B1], [A0, D0], [D0, D1], [A1, D1]].forEach(([P, Q]) => k.seg(P, Q, { cls: 'thick' }));
        k.seg(B1, C1, { cls: 'cons', dash: true }); k.seg(D1, C1, { cls: 'cons', dash: true });
        k.point(A0, 'A_0', { at: 'se', lo: bg }); k.point(A1, 'A_1', { at: 'w', lo: bg }); k.point(B0, 'B_0', { at: 'se', lo: bg }); k.point(D0, 'D_0', { at: 'sw', lo: bg });
        k.point(B1, 'B_1', { at: 'e', lo: bg }); k.point(D1, 'D_1', { at: 'w', lo: bg });
        k.frame(xL, A1r.y - 20, xR, 25); k.fontScale(0.85);
      });
      k.step('dividers', 'Set the dividers to the height A₀A₁ and step the same length downwards from A₀, along the vertical: A₁′, the reflection of the top of the near edge.', () => {
        k.tick(A0, k.pt(0, 1), { size: 1.4 });
        k.seg(A0, A1r, { cls: 'curve' }); k.point(A1r, "A_1'", { at: 'w', lo: bg });
      });
      k.step('straightedge', 'From A₁′ draw lines to VP₁ and to VP₂. A horizontal mirror changes no horizontal direction, so these are the lower edges of the reflected walls.', () => {
        k.seg(A1r, VP1, { cls: 'cons' }); k.seg(A1r, VP2, { cls: 'cons' });
      });
      k.step('square', 'Extend the vertical edges at B and D downwards. They cut the two lines in B₁′ and D₁′, the reflected tops.', () => {
        k.seg(B0, B1r, { cls: 'curve' }); k.seg(D0, D1r, { cls: 'curve' });
        k.point(B1r, "B_1'", { at: 'e', lo: bg }); k.point(D1r, "D_1'", { at: 'w', lo: bg });
      });
      k.step('dividers', 'Check: carry the height B₀B₁ down from B₀ and D₀D₁ down from D₀. They end exactly on B₁′ and D₁′: each edge and its reflection are equal.', () => {
        k.tick(B1r, k.pt(0, 1), { size: 1.2 }); k.tick(D1r, k.pt(0, 1), { size: 1.2 });
        k.tick(A1r, k.pt(0, 1), { size: 1.2 });
      });
      k.step('straightedge', 'From B₁′ draw to VP₂ and from D₁′ to VP₁: they meet at C₁′, the reflection of the far top corner. It lies behind the reflected walls, so only dashed.', () => {
        k.seg(B1r, VP2, { cls: 'cons' }); k.seg(D1r, VP1, { cls: 'cons' });
        k.point(C1r, "C_1'", { at: 's', lo: bg });
      });
      k.step('pencil', 'Ink in what the eye sees in the water: the two reflected walls, hanging from the water line.', () => {
        [[A0, A1r], [A1r, B1r], [B0, B1r], [A1r, D1r], [D0, D1r]].forEach(([P, Q]) => k.seg(P, Q, { cls: 'thick' }));
      });
      k.note('The reflection of the far top corner and its edges, dashed: they are hidden behind the reflected walls.', () => {
        k.seg(B1r, C1r, { cls: 'cons', dash: true }); k.seg(D1r, C1r, { cls: 'cons', dash: true });
      });
    }
  });

  Hyper.construction({
    id: 'pc-reflection-mirror',
    title: 'The reflection of a cube in a mirror on a side wall',
    tags: ['perspective', 'reflection', 'mirror', 'one-point'],
    note: 'In one-point perspective a mirror on a side wall reflects along lines parallel to the picture plane, and these stay horizontal in the picture. The reflected point therefore lies on the same horizontal, as far beyond the wall\'s floor line as the point is on this side of it: measured with the dividers along the horizontal. Heights are unchanged, so the reflected verticals have the same lengths as the real ones. The reflected cube sits "behind" the wall and is seen only through the mirror\'s frame.',
    build(k) {
      const g = k.g, Dd = 160, e = 55, Xw = -110, Hc = 110, bg = { upright: true, bg: true };
      const pic = (X, Z, h) => { const s = Dd / (Z + Dd); return k.pt(X * s, (h - e) * s); };
      const C = k.pt(0, 0);
      const L0 = pic(Xw, 0, 0), U0 = pic(Xw, 0, Hc);
      const mirror = [pic(Xw, 5, 8), pic(Xw, 5, 90), pic(Xw, 125, 90), pic(Xw, 125, 8)];
      const x1 = -78, x2 = -24, z1 = 150, z2 = 198, hc = 48;
      const N1 = pic(x1, z1, 0), N2 = pic(x2, z1, 0), F1 = pic(x1, z2, 0), F2 = pic(x2, z2, 0);
      const N1t = pic(x1, z1, hc), N2t = pic(x2, z1, hc), F1t = pic(x1, z2, hc), F2t = pic(x2, z2, hc);
      const hor = y => [k.pt(0, y), k.pt(1, y)];
      const Wn = g.lineLine(L0, C, ...hor(N1.y)), Wf = g.lineLine(L0, C, ...hor(F1.y));
      const refl = (P, W) => k.pt(2 * W.x - P.x, P.y);
      const N1r = refl(N1, Wn), N2r = refl(N2, Wn), F1r = refl(F1, Wf), F2r = refl(F2, Wf);
      const N1rt = k.pt(N1r.x, N1t.y), N2rt = k.pt(N2r.x, N2t.y), F1rt = k.pt(F1r.x, F1t.y), F2rt = k.pt(F2r.x, F2t.y);
      const xL = L0.x - 22, xR = 12, yB = L0.y - 16, yT = U0.y + 14;
      k.given('Half a room in one-point perspective: the horizon through the centre C, the left wall between its floor line L₀C and its ceiling line U₀C, a mirror on that wall (the quadrilateral), and a cube standing on the floor farther back. N₁N₂ is its near base edge and F₁F₂ its far one.', () => {
        k.seg(k.pt(xL, 0), k.pt(xR, 0), { cls: 'given', dash: true }); k.label(k.pt(xR, 0), 'HL', 'ne', { upright: true });
        k.point(C, 'C', { at: 'n', lo: bg });
        k.seg(L0, C, { cls: 'given' }); k.seg(U0, C, { cls: 'given' }); k.seg(L0, U0, { cls: 'given' });
        k.label(g.lerp(L0, C, 0.32), 'wall floor line', 's', { upright: true, size: 0.7 });
        k.poly(mirror, { close: true, cls: 'thick' }); k.label(mirror[1], 'mirror', 'nw', { upright: true, size: 0.8 });
        k.poly([N1, N2, N2t, N1t], { close: true, cls: 'given' });
        k.seg(N1, F1, { cls: 'given' }); k.seg(N2, F2, { cls: 'given' }); k.seg(N1t, F1t, { cls: 'given' }); k.seg(N2t, F2t, { cls: 'given' });
        k.seg(F1, F2, { cls: 'given' }); k.seg(F1, F1t, { cls: 'given' }); k.seg(F2, F2t, { cls: 'given' }); k.seg(F1t, F2t, { cls: 'given' });
        k.point(N1, 'N_1', { at: 'sw', lo: bg }); k.point(N2, 'N_2', { at: 'se', lo: bg }); k.point(F1, 'F_1', { at: 'sw', lo: bg }); k.point(F2, 'F_2', { at: 'se', lo: bg });
        k.frame(xL, yB, xR, yT); k.fontScale(0.85);
      });
      k.step('tee', 'Through the near base corners N₁, N₂ draw a horizontal to the wall\'s floor line: it meets it at W₁. Through F₁, F₂ draw another to W₂. These lines are parallel to the picture plane and so perpendicular to the wall in space.', () => {
        k.seg(k.pt(Wn.x - 6, N1.y), k.pt(N2.x + 4, N1.y), { cls: 'cons' }); k.seg(k.pt(Wf.x - 6, F1.y), k.pt(F2.x + 4, F1.y), { cls: 'cons' });
        k.point(Wn, 'W_1', { at: 'sw', lo: bg }); k.point(Wf, 'W_2', { at: 'sw', lo: bg });
      });
      k.step('dividers', 'Carry the distance from each base corner to the wall\'s floor line the same distance beyond it: N₁′, N₂′ about W₁, and F₁′, F₂′ about W₂.', () => {
        [N1r, N2r, F1r, F2r].forEach((P, i) => k.dot(P, { cls: 'curve' }));
        k.label(N1r, "N_1'", 'sw', { size: 0.75, bg: true, upright: true }); k.label(N2r, "N_2'", 'se', { size: 0.75, bg: true, upright: true });
        k.label(F1r, "F_1'", 'sw', { size: 0.75, bg: true, upright: true }); k.label(F2r, "F_2'", 'se', { size: 0.75, bg: true, upright: true });
      });
      k.step('square', 'Raise a vertical at each of the new base points. Carry the height with a horizontal from the top of the matching real edge: the reflected tops sit at the same level.', () => {
        [[N1r, N1rt], [N2r, N2rt], [F1r, F1rt], [F2r, F2rt]].forEach(([P, Q]) => k.seg(P, Q, { cls: 'curve' }));
        [[N1t, N1rt], [N2t, N2rt], [F1t, F1rt], [F2t, F2rt]].forEach(([P, Q]) => k.seg(P, Q, { cls: 'cons', dotted: true }));
      });
      k.step('straightedge', 'The depth edges of the image still run to C. Join N₁′ to C: it must pass through F₁′, which is your check. Do the same for N₂′ and for the two tops.', () => {
        [N1r, N2r, N1rt, N2rt].forEach(P => k.seg(P, C, { cls: 'cons' }));
      });
      k.step('pencil', 'Ink in the reflected cube: it is the real cube turned the other way, seen through the mirror frame as if behind the wall.', () => {
        k.poly([N1r, N2r, N2rt, N1rt], { close: true, cls: 'curve' });
        k.seg(F1r, F1rt, { cls: 'curve' }); k.seg(F1rt, F2rt, { cls: 'curve' }); k.seg(F2r, F2rt, { cls: 'curve' }); k.seg(N1rt, F1rt, { cls: 'curve' }); k.seg(N2rt, F2rt, { cls: 'curve' });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.construction({
    id: 'pc-anamorphosis-grid',
    title: 'A plane anamorphosis: stretching a square grid for an oblique eye',
    tags: ['anamorphosis', 'plan and elevation', 'projection', 'Holbein'],
    note: 'The eye E looks down at a shallow angle at a picture on the ground. The picture is first drawn on an ordinary square grid on an imaginary image plane Π, perpendicular to the line of sight. Each point of that grid is then projected from E onto the ground, which is a plan-and-elevation problem: the elevation (below) gives how far away each row lands, the plan (above, turned so that distance runs from left to right) gives how far to the side. Rows become lines of constant distance; columns become straight lines through V, the point where the line through E parallel to Π meets the ground behind you. In the plan the viewer faces right, so his right hand is down the sheet.',
    build(k) {
      const g = k.g, al = rad(30), h = 150, f = 150, gu = 15, Y0 = 390, nj = [-3, -2, -1, 0, 1, 2, 3];
      const ca = Math.cos(al), sa = Math.sin(al), bg = { upright: true, bg: true, size: 0.8 };
      const E = k.pt(0, h), s = k.pt(ca, -sa), u = k.pt(sa, ca), G0 = k.pt(0, 0), G1 = k.pt(1, 0);
      const O = g.lineLine(E, g.add(E, s), G0, G1), C = g.add(E, g.mul(s, f));
      const M = j => g.add(C, g.mul(u, j * gu)), zOf = j => g.lineLine(E, M(j), G0, G1);
      const Vel = g.lineLine(E, g.add(E, u), G0, G1);
      const Ep = k.pt(0, Y0), Vp = k.pt(Vel.x, Y0), Cp = k.pt(C.x, Y0), Q = i => k.pt(C.x, Y0 - i * gu);
      const col = x => [k.pt(x, 0), k.pt(x, 1)];
      const X0 = i => g.lineLine(Ep, Q(i), ...col(zOf(0).x));
      const node = (i, j) => g.lineLine(Vp, X0(i), ...col(zOf(j).x));
      const Fg = [[-2, -3], [-1, -3], [-1, 0], [1, 0], [1, 1], [-1, 1], [-1, 2], [2, 2], [2, 3], [-2, 3]];
      const ox = -205, grid0 = (i, j) => k.pt(ox + i * gu, Y0 + j * gu);
      const xL = ox - 30, xR = zOf(3).x + 45, yTop = Y0 + 225;
      k.given('The ground line and the eye E at height h = 150 above it (elevation, below); the plan axis through Eₚ (plan, above, with distance running to the right). Left: the picture to be seen, the letter F drawn on a square grid. We choose the viewing angle α = 30° below the horizontal, the viewing distance f = 150 and the grid unit g = 15.', () => {
        k.seg(k.pt(-120, 0), k.pt(xR, 0), { cls: 'given' }); k.label(k.pt(xR - 40, 0), 'ground', 'n', { upright: true, size: 0.8 });
        k.point(E, 'E', { at: 'nw', lo: { upright: true, bg: true }, cls: 'red' });
        k.dim(k.pt(-14, 0), k.pt(-14, h), 'h', { side: 'right', dist: 0.9, upright: true, size: 0.8, ticks: true });
        k.seg(k.pt(-120, h), k.pt(130, h), { cls: 'cons', dash: true });
        k.seg(k.pt(-120, Y0), k.pt(xR, Y0), { cls: 'cons', dash: true }); k.point(Ep, 'E_p', { at: 'nw', lo: { upright: true, bg: true }, cls: 'red' });
        for (let i = -3; i <= 3; i++) { k.seg(grid0(i, -3), grid0(i, 3), { cls: 'aux' }); k.seg(grid0(-3, i), grid0(3, i), { cls: 'aux' }); }
        k.poly(Fg.map(p => grid0(p[0], p[1])), { close: true, cls: 'given', fill: '#e5e5e5' });
        k.label(grid0(0, 3.7), 'the picture', 'n', { upright: true, size: 0.85 });
        k.frame(xL, -30, xR, yTop); k.fontScale(0.9);
      });
      k.step('protractor', 'In the elevation draw the line of sight from E down to the ground at α = 30° below the horizontal.', () => {
        k.seg(E, O, { cls: 'cons' }); k.point(O, 'O', { at: 'se', lo: bg });
        k.angle(E, O, k.pt(E.x + 100, E.y), { label: 'α', r: 3.6, labelDist: 1.3, upright: true });
      });
      k.step('ruler', 'Along the line of sight lay off the viewing distance f = 150 from E: the point C, the middle of the image plane Π.', () => {
        k.point(C, 'C', { at: 'ne', lo: bg }); k.dim(E, C, 'f', { side: 'right', dist: 1.0, upright: true, size: 0.8 });
      });
      k.step('square', 'Through C draw Π perpendicular to the line of sight (set square against the line). In the elevation Π is seen edge-on.', () => {
        k.seg(M(-3.6), M(3.6), { cls: 'thick' }); k.label(M(3.6), 'Π', 'ne', { upright: true });
      });
      k.step('dividers', 'Step the grid unit g = 15 along Π on both sides of C: the marks M₋₃ … M₃ are the horizontal lines of the grid.', () => {
        nj.forEach(j => k.dot(M(j), { r: 0.7 }));
        k.label(M(-3), 'M_{-3}', 'sw', { upright: true, size: 0.7, bg: true }); k.label(M(3), 'M_3', 'ne', { upright: true, size: 0.7, bg: true });
      });
      k.step('straightedge', 'Join E to each mark and extend to the ground. The visual rays land at distances z₋₃ … z₃: equal steps on Π become unequal steps on the ground, growing with distance.', () => {
        nj.forEach(j => k.seg(E, zOf(j), { cls: 'cons' }));
        nj.forEach(j => k.dot(zOf(j), { r: 0.7 }));
        k.label(zOf(-3), 'z_{-3}', 's', { upright: true, size: 0.7, bg: true }); k.label(zOf(0), 'z_0', 's', { upright: true, size: 0.7, bg: true }); k.label(zOf(3), 'z_3', 's', { upright: true, size: 0.7, bg: true });
      });
      k.step('square', 'Carry z₋₃ … z₃ up into the plan with vertical projectors. In the plan they are the rows of the stretched grid: lines of equal distance, running across the sheet.', () => {
        nj.forEach(j => k.seg(zOf(j), k.pt(zOf(j).x, yTop - 8), { cls: 'cons' }));
      });
      k.step('square', 'Carry C up to the plan axis: Cₚ, the plan of the middle of Π. All points of Π\'s middle row lie on the vertical through Cₚ.', () => {
        k.seg(C, Cp, { cls: 'cons' }); k.point(Cp, 'C_p', { at: 'sw', lo: bg });
      });
      k.step('dividers', 'On that vertical step the unit g along the lateral direction on both sides of Cₚ: Q₋₃ … Q₃ (Q₊ to the viewer\'s right, which is down the sheet).', () => {
        for (let i = -3; i <= 3; i++) k.dot(Q(i), { r: 0.7 });
        k.label(Q(3), 'Q_3', 'sw', { upright: true, size: 0.7, bg: true }); k.label(Q(-3), 'Q_{-3}', 'nw', { upright: true, size: 0.7, bg: true });
      });
      k.step('straightedge', 'Join Eₚ to each Qᵢ and extend to the row z₀. These plan rays cut the row in Xᵢ,₀: the central row of the stretched grid.', () => {
        for (let i = -3; i <= 3; i++) k.seg(Ep, X0(i), { cls: 'cons' });
        for (let i = -3; i <= 3; i++) k.dot(X0(i), { r: 0.7 });
      });
      k.step('square', 'In the elevation draw through E the parallel to Π (set square): it meets the ground at V, behind you. Carry V up to the plan axis: Vₚ. Every column of the grid will pass through Vₚ.', () => {
        k.seg(E, Vel, { cls: 'cons' }); k.point(Vel, 'V', { at: 'sw', lo: bg });
        k.seg(Vel, Vp, { cls: 'cons' }); k.point(Vp, 'V_p', { at: 'nw', lo: bg });
      });
      k.step('straightedge', 'Draw the columns: from Vₚ through each Xᵢ,₀, as far as the rows z₋₃ and z₃. Where a column crosses a row is a node of the stretched grid.', () => {
        for (let i = -3; i <= 3; i++) k.seg(node(i, -3), node(i, 3), { cls: 'cons' });
      });
      k.step('pencil', 'Ink the stretched grid: the seven rows between the outer columns, and the columns between the outer rows.', () => {
        nj.forEach(j => k.seg(node(-3, j), node(3, j), { cls: 'curve' }));
        for (let i = -3; i <= 3; i++) k.seg(node(i, -3), node(i, 3), { cls: 'curve' });
      });
      k.step('pencil', 'Copy the F square by square: mark each vertex of the letter at the node with the same grid numbers (i, j) and join them in the same order.', () => {
        k.poly(Fg.map(p => node(p[0], p[1])), { close: true, cls: 'thick', fill: '#d8d8d8' });
      });
      k.note('Seen from E, and only from there, the stretched F subtends exactly the angles of the ordinary F on Π. Move the eye and the picture falls apart. From above, the F is long and thin; the further rows are stretched most.', () => {
        k.arrow(k.pt(40, Y0 + 205), k.pt(300, Y0 + 205), { cls: 'cons' }); k.text(170, Y0 + 216, 'looking direction', { size: 0.8, upright: true });
        k.arrow(k.pt(xR - 12, Y0 + 40), k.pt(xR - 12, Y0 - 40), { cls: 'cons' }); k.text(xR - 26, Y0, 'viewer\'s right', { size: 0.8, upright: true, rotate: 90 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.construction({
    id: 'pc-ames-room',
    title: 'The Ames room in plan: a trapezoid that looks like a cube',
    tags: ['forced perspective', 'Ames room', 'illusion', 'plan'],
    note: 'Seen from the peephole P with one eye, a point of the real room and a point of an ordinary rectangular room look the same if they lie on the same ray from P. So the real room is built from the apparent one by sliding every corner along its ray. To keep walls, floor and ceiling flat, the two real walls that are parallel to the eye line (the apparent front and back walls) must be turned about their middle points until they meet on the eye line through P, here at Q. Then the real side walls stay parallel to the line of sight, one long and one short. Floor and ceiling are tilted planes, so every height at a corner scales by the same factor as its distance.',
    build(k) {
      const g = k.g, a = 60, d0 = 50, dB = 170, bg = { upright: true, bg: true, size: 0.85 };
      const P = k.pt(0, 0);
      const FLa = k.pt(-a, d0), FRa = k.pt(a, d0), BLa = k.pt(-a, dB), BRa = k.pt(a, dB), MB = k.pt(0, dB), MF = k.pt(0, d0), Q = k.pt(3 * a, 0);
      const ray = X => g.add(P, g.mul(g.sub(X, P), 1.6));
      const BLr = g.lineLine(Q, MB, P, BLa), BRr = g.lineLine(Q, MB, P, BRa), FLr = g.lineLine(Q, MF, P, FLa), FRr = g.lineLine(Q, MF, P, FRa);
            k.given('The peephole P, with the line of sight straight ahead, and the room as it will look: an ordinary rectangular room (dashed) with walls parallel to the line of sight, 120 wide, its front wall 50 and its back wall 170 from P.', () => {
        k.point(P, 'P', { at: 'sw', lo: { upright: true, bg: true }, cls: 'red' });
        k.seg(P, k.pt(0, 275), { cls: 'cons', dash: true });
        k.poly([FLa, FRa, BRa, BLa], { close: true, cls: 'given', dash: true });
        k.point(FLa, 'F', { at: 'w', lo: bg }); k.point(BLa, 'B', { at: 'w', lo: bg });
        k.point(MB, 'M', { at: 'ne', lo: bg }); k.point(MF, 'N', { at: 'ne', lo: bg });
        k.seg(k.pt(-110, 0), k.pt(195, 0), { cls: 'cons', dash: true }); k.label(k.pt(195, 0), 'eye line', 'ne', { upright: true, size: 0.8 });
        k.frame(-115, -22, 200, 285); k.fontScale(0.85);
      });
      k.step('straightedge', 'Draw the sight lines from P through the four corners of the apparent room, and extend them. Every point of the real room will be on one of these rays or between them.', () => {
        [FLa, FRa, BLa, BRa].forEach(X => k.seg(P, ray(X), { cls: 'cons' }));
      });
      k.step('straightedge', 'Choose the point Q on the eye line (here 180 to the right of P, three times the half-width). Draw the line from Q through M, the middle of the apparent back wall: it is the real back wall, slanting away to the left.', () => {
        k.point(Q, 'Q', { at: 'n', lo: bg });
        k.seg(Q, g.lerp(Q, MB, 1.55), { cls: 'cons' });
      });
      k.step('straightedge', 'Where that line cuts the sight lines through the two back corners are the real back corners BL′ and BR′. The left one is the farther.', () => {
        k.point(BLr, "B_L'", { at: 'nw', lo: bg }); k.point(BRr, "B_R'", { at: 'ne', lo: bg });
        k.seg(BLr, BRr, { cls: 'thick' });
      });
      k.step('straightedge', 'In the same way draw the line from Q through N, the middle of the apparent front wall. It cuts the sight lines in FL′ and FR′.', () => {
        k.seg(Q, g.lerp(Q, MF, 2.1), { cls: 'cons' });
        k.point(FLr, "F_L'", { at: 'w', lo: bg }); k.point(FRr, "F_R'", { at: 'e', lo: bg });
        k.seg(FLr, FRr, { cls: 'thick' });
      });
      k.step('square', 'Join FL′ to BL′ and FR′ to BR′: the real side walls. Check with the set square against the line of sight that both are parallel to it.', () => {
        k.seg(FLr, BLr, { cls: 'thick' }); k.seg(FRr, BRr, { cls: 'thick' });
        k.right(FLr, BLr, k.pt(FLr.x + 30, FLr.y), { r: 0.6 });
      });
      k.step('compass', 'Place two people of the same real size, drawn from above as circles of radius 6, in the two back corners. From P the left one is 1.5 times as far as the corner of the cube-room it seems to stand in, and the right one only 0.75 times.', () => {
        k.circle(k.pt(BLr.x + 10, BLr.y - 17), 6, { cls: 'red' }); k.circle(k.pt(BRr.x - 10, BRr.y - 13), 6, { cls: 'red' });
      });
      k.note('The distance from P to the left back corner is 1.5 times PB and to the right back corner 0.75 times PB. Seen from P the left person looks half as big as the right one (0.75 / 1.5), yet both stand in what looks like the same corner of the same room.', () => {
                const qL = g.lerp(P, BLr, 0.8), qR = g.lerp(P, BRr, 0.8);
        k.text(qL.x + 26, qL.y, 'PB′ = 1.5 PB', { size: 0.8, bg: true, upright: true }); k.text(qR.x + 30, qR.y - 8, 'PB′ = 0.75 PB', { size: 0.8, bg: true, upright: true });
        k.seg(P, BLr, { cls: 'aux', dash: true }); k.seg(P, BRr, { cls: 'aux', dash: true });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------------ */
  Hyper.construction({
    id: 'pc-reverse-perspective',
    title: 'A table in reverse (Byzantine) perspective',
    tags: ['reverse perspective', 'icon', 'Byzantine', 'straightedge'],
    note: 'In an ordinary picture the receding edges of a table converge towards a vanishing point behind the picture. In reverse perspective they diverge: it is as if they were converging towards a point R in front of the picture, where the viewer stands. Everything grows with distance in the picture: the far edge is longer than the near edge, the far legs are longer than the near legs. The ordinary perspective of the same table is dashed for comparison.',
    build(k) {
      const g = k.g, r = 170, w = 45, leg = 40, yF = 85, bg = { upright: true, bg: true, size: 0.85 };
      const R = k.pt(0, -r), N1 = k.pt(-w, 0), N2 = k.pt(w, 0), B1 = k.pt(-w, -leg), B2 = k.pt(w, -leg);
      const hor = y => [k.pt(-1, y), k.pt(1, y)], vert = x => [k.pt(x, 0), k.pt(x, 1)];
      const F1 = g.lineLine(R, N1, ...hor(yF)), F2 = g.lineLine(R, N2, ...hor(yF));
      const G1 = g.lineLine(R, B1, ...vert(F1.x)), G2 = g.lineLine(R, B2, ...vert(F2.x));
      const Vo = k.pt(0, 170), O1 = g.lineLine(Vo, N1, ...hor(yF)), O2 = g.lineLine(Vo, N2, ...hor(yF));
      k.given('The sheet with its centre line, the near edge N₁N₂ of the table, the length of the near legs below it, and the point R below the picture, where the viewer stands.', () => {
        k.seg(k.pt(0, -r - 10), k.pt(0, 125), { cls: 'cons', dash: true });
        k.seg(N1, N2, { cls: 'thick' }); k.seg(N1, B1, { cls: 'thick' }); k.seg(N2, B2, { cls: 'thick' });
        k.point(N1, 'N_1', { at: 'w', lo: bg }); k.point(N2, 'N_2', { at: 'e', lo: bg }); k.point(B1, 'L_1', { at: 'w', lo: bg }); k.point(B2, 'L_2', { at: 'e', lo: bg });
        k.point(R, 'R (the viewer)', { at: 'e', lo: bg, cls: 'red', r: 1.4 });
        k.rect(-110, -r - 22, 110, 135, { cls: 'given' });
        k.frame(-112, -r - 24, 112, 137); k.fontScale(0.85);
      });
      k.step('straightedge', 'Lay the straightedge from R through N₁ and draw it on past N₁; do the same through N₂. The two lines spread as they rise: the side edges of the table top, diverging.', () => {
        k.seg(R, g.lerp(R, N1, 1.6), { cls: 'cons' }); k.seg(R, g.lerp(R, N2, 1.6), { cls: 'cons' });
      });
      k.step('tee', 'With the T-square draw the far edge of the table, a horizontal at height 85. It cuts the two lines in F₁ and F₂ and is longer than the near edge.', () => {
        k.seg(F1, F2, { cls: 'thick' }); k.point(F1, 'F_1', { at: 'w', lo: bg }); k.point(F2, 'F_2', { at: 'e', lo: bg });
        k.dim(N1, N2, '2 × 45', { side: 'right', dist: 2.6, upright: true, size: 0.75 });
      });
      k.step('straightedge', 'From R draw through the leg ends L₁ and L₂ and beyond: the lines on which the far leg ends must lie.', () => {
        k.seg(R, g.lerp(R, B1, 1.55), { cls: 'cons' }); k.seg(R, g.lerp(R, B2, 1.55), { cls: 'cons' });
      });
      k.step('square', 'Drop verticals from F₁ and F₂. They cut those lines in G₁ and G₂: the far legs, longer than the near ones.', () => {
        k.seg(F1, G1, { cls: 'thick' }); k.seg(F2, G2, { cls: 'thick' });
        k.point(G1, 'G_1', { at: 'w', lo: bg }); k.point(G2, 'G_2', { at: 'e', lo: bg });
      });
      k.step('pencil', 'Ink the table: the near edge, the long far edge, the diverging side edges and the four legs.', () => {
        [[N1, F1], [N2, F2]].forEach(([P, Q]) => k.seg(P, Q, { cls: 'thick' }));
      });
      k.note('For comparison, in red and dashed: ordinary perspective with a vanishing point V above the picture. The same near edge, but the side edges converge and the far edge is only half as long.', () => {
        k.point(Vo, 'V', { at: 'e', lo: bg, cls: 'red' });
        k.seg(N1, Vo, { cls: 'red', dash: true }); k.seg(N2, Vo, { cls: 'red', dash: true }); k.seg(O1, O2, { cls: 'red', dash: true });
      });
    }
  });

  Hyper.construction({
    id: 'pc-atmospheric-tones',
    title: 'Atmospheric perspective as a scale of tones',
    tags: ['atmospheric perspective', 'aerial perspective', 'hatching', 'tone'],
    note: 'Air scatters light, so distant things lose contrast and drift towards the tone of the haze. A simple law (Koschmieder\'s) says the contrast falls as exp(−σd) with the distance d; here σ = 0.25 per km, the nearest dark tone is 90 % and the haze 12 %. The tone of a ridge at distance d is then t = 12 + 78·exp(−0.25 d) per cent. In pencil a tone is a hatching density: close, dark lines for the near ridge, wide, light, thinner lines for the far one. Draw from the farthest ridge to the nearest, so that each nearer ridge covers the lines behind it.',
    build(k) {
      const Wd = 300, ds = [0.5, 1.5, 3, 5, 8], sigma = 0.25, tSky = 12, t0 = 90;
      const tone = d => tSky + (t0 - tSky) * Math.exp(-sigma * d);
      const ts = ds.map(tone), gap = ts.map(t => 50 / t), wd = [1, 0.85, 0.7, 0.55, 0.45];
      const cN = [36, 60, 76, 89, 98], aN = [24, 15, 9, 6, 3.5], lam = [230, 190, 165, 140, 120], ph = [0.4, 2.1, 4.0, 1.2, 3.1];
      const sil = (n, x) => cN[n] + aN[n] * (0.65 * Math.sin(2 * Math.PI * x / lam[n] + ph[n]) + 0.35 * Math.sin(4.7 * Math.PI * x / lam[n] + 2 * ph[n]));
      const ridge = n => { const pts = []; for (let x = 0; x <= Wd; x += 6) pts.push(k.pt(x, sil(n, x))); return pts; };
      const HL = 102;
      k.given('The frame of the picture with the horizon HL. Five ridges stand at 0.5, 1.5, 3, 5 and 8 km. The haze is 12 % grey, the darkest near tone 90 %, and the air thins the contrast by exp(−0.25 d).', () => {
        k.rect(0, 0, Wd, 130, { cls: 'given' });
        k.seg(k.pt(0, HL), k.pt(Wd, HL), { cls: 'cons', dash: true }); k.label(k.pt(Wd, HL), 'HL', 'e', { upright: true, size: 0.8 });
        k.frame(-40, -8, Wd + 85, 138); k.fontScale(0.8);
      });
      k.step('ruler', 'Compute the five tones, t = 12 + 78·exp(−0.25 d): 81, 66, 49, 34 and 23 %. Draw a tone chart at the side with five patches, the darkest at the top, and fill each with hatching whose gap is inversely proportional to its tone.', () => {
        const x0 = Wd + 25, x1 = x0 + 28;
        ts.forEach((t, n) => {
          const y1 = 125 - n * 24, y0 = y1 - 20;
          k.seg(k.pt(x0, y0), k.pt(x1, y0), { cls: 'cons' }); k.seg(k.pt(x0, y1), k.pt(x1, y1), { cls: 'cons' });
          k.hatch([k.pt(x0, y0), k.pt(x1, y0), k.pt(x1, y1), k.pt(x0, y1)], { angle: Math.PI / 3, gap: gap[n], w: wd[n], outline: true });
          k.label(k.pt(x1, (y0 + y1) / 2), Math.round(t) + ' %  (' + ds[n] + ' km)', 'e', { upright: true, size: 0.7 });
        });
        k.text(Wd + 38, 134, 'tone', { upright: true, size: 0.75 });
      });
      for (let n = 4; n >= 0; n--) {
        k.step('pencil', 'Ridge ' + (n + 1) + ' at ' + ds[n] + ' km: draw its outline, tone ' + Math.round(ts[n]) + ' %. ' + (n === 4 ? 'Hatch it with wide, light lines (the gap of the lightest patch).' : n === 0 ? 'Hatch it with the close, dark lines of the darkest patch, and press harder on the outline.' : 'Use the hatching of its patch; the outline is a little lighter than the one in front.'), () => {
          const top = ridge(n), poly = top.concat([k.pt(Wd, 0), k.pt(0, 0)]);
          k.poly(poly, { close: true, cls: 'aux', fill: '#fff', stroke: '#fff', width: 0.01, nobounds: true });
          k.hatch(poly, { angle: Math.PI / 3, gap: gap[n], w: wd[n] });
          k.curve(top.map(p => [p.x, p.y]), null, { cls: 'curve', width: [2.7, 2.1, 1.6, 1.2, 0.9][n] });
        });
      }
      k.note('The farthest ridge is nearly the haze itself: its outline is faint, its hatching wide. The contrast between a ridge and the one in front falls with distance.', () => {
        k.text(150, 120, 'further: lighter, less contrast, bluer', { upright: true, size: 0.8, bg: true });
        k.arrow(k.pt(60, 113), k.pt(20, 113), { cls: 'cons' });
      });
    }
  });


})();
