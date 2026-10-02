/* HYPER-PROJECTIONS · constructions/one-two-three-points.js — one, two and three vanishing points, drawn by hand.
 *
 *   pt-one-point-room       a room in one-point perspective: back wall by the diagonal to the distance point
 *   pt-two-point-box        a box between two vanishing points: the eye folded up onto the semicircle on VP₁VP₂
 *   pt-three-point-tower    a tower seen from below: the third vanishing point from the tilted picture plane
 *   pt-long-lens-cube       the same cube with a wide and with a long lens: only the distance point moves
 *   pt-tiled-floor          a tiled floor by the distance point (the diagonal of a tile goes to DP)
 *   pt-measuring-points     a two-point box with true lengths: the measuring points swung from the eye
 *   pt-dividing-fence       a receding fence in equal bays by the diagonals of its rectangles, then extended
 *   pt-gable-roof           a gable roof: the vanishing points of the slopes stand on the vertical through VP
 *   pt-stairs               a flight of stairs: treads by the distance point, nosings on the pitch line
 * Labels as a draughtsman letters them: HL horizon line, GL ground line, PP picture plane, SP station point,
 * CV centre of vision, VP vanishing point, MP measuring point, DP distance point. Everything is computed with k.g.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180;
  const small = { upright: true, size: 0.8 };

  function dim(k, a, b, text, o) {
    o = o || {};
    const u = k.g.sub(b, a);
    k.seg(a, b, { cls: o.cls || 'aux' });
    k.tick(a, u); k.tick(b, u);
    k.dim(a, b, text, { side: o.side, dist: o.dist == null ? 1.4 : o.dist, size: o.size || 0.85, cls: o.cls === 'cons' ? 'cons' : undefined });
  }
  const horiz = (k, p) => k.pt(p.x + 1, p.y);      // a second point on the horizontal through p
  const vert = (k, p) => k.pt(p.x, p.y + 1);       // a second point on the vertical through p

  /* ------------------------------------------------------------------ 1. one-point room */
  Hyper.construction({
    id: 'pt-one-point-room',
    title: 'A room in one-point perspective: the back wall by the distance point',
    tags: ['one-point', 'room', 'distance point', 'diagonal', 'perspective'],
    note: 'The opening ABCD is the picture plane, so it is drawn true size, and every line that runs into the room goes to the single vanishing point VP. How far back the far wall lies is fixed by the distance point DP, which stands on HL at the distance D (eye to picture) from VP: a 45° line on the floor goes to DP, and a point at the depth L along the side is found on the 45° line from the point L away from it on the ground line. The back wall is then the opening reduced about VP in the ratio D : (D + L). Choose D at least 1.5 times the width of the opening, or the room looks like a tunnel.',
    build(k) {
      const g = k.g;
      const Wd = 200, Ht = 130, e = 60, D = 200, L = 140;
      const A = k.pt(-100, 0), B = k.pt(100, 0), C = k.pt(100, Ht), Dd = k.pt(-100, Ht);
      const VP = k.pt(-25, e), DPl = k.pt(VP.x - D, e), DPr = k.pt(VP.x + D, e);
      const A1 = k.pt(A.x + L, 0), B1 = k.pt(B.x - L, 0);
      const A2 = g.lineLine(A1, DPl, A, VP), B2 = g.lineLine(B1, DPr, B, VP);
      const D2 = g.lineLine(A2, vert(k, A2), Dd, VP), C2 = g.lineLine(B2, vert(k, B2), C, VP);
      k.given('The opening ABCD of the room (the picture plane: true size, width ' + Wd + ', height ' + Ht + '), the ground line GL, the horizon HL at the eye height and the vanishing point VP on it. The depth of the room L and the distance D from the eye to the picture are given as lengths.', () => {
        k.seg(k.pt(-270, 0), k.pt(230, 0), { cls: 'given' }); k.label(k.pt(-270, 0), 'GL', 'nw', small);
        k.seg(k.pt(-270, e), k.pt(230, e), { cls: 'given' }); k.label(k.pt(-270, e), 'HL', 'nw', small);
        k.poly([A, B, C, Dd], { close: true, cls: 'thick' });
        k.point(A, 'A', 'sw'); k.point(B, 'B', 'se'); k.point(C, 'C', 'ne'); k.point(Dd, 'D', 'nw');
        k.point(VP, 'VP', 'ne');
        dim(k, k.pt(-100, -26), k.pt(-100 + L, -26), 'L', { cls: 'cons', side: 'right' });
        dim(k, k.pt(-100, -52), k.pt(-100 + D, -52), 'D', { cls: 'cons', side: 'right' });
        k.frame(-275, -62, 235, Ht + 15);
      });
      k.step('dividers', 'Take D with the dividers and set it off on HL to the left and to the right of VP: the distance points DP₁ and DP₂.', () => {
        k.point(DPl, 'DP_1', 'n'); k.point(DPr, 'DP_2', 'n');
      });
      k.step('straightedge', 'Join the four corners A, B, C, D to VP: these are the four edges where the walls, floor and ceiling meet.', () => {
        [A, B, C, Dd].forEach(p => k.seg(p, VP, { cls: 'cons' }));
      });
      k.step('dividers', 'Lay the depth L along the ground line: from A towards B to A₁, and from B towards A to B₁.', () => {
        k.point(A1, 'A_1', 's'); k.point(B1, 'B_1', 's');
      });
      k.step('straightedge', 'Join A₁ to DP₁ and B₁ to DP₂. Each 45° line cuts the floor edge from the same side at the depth L: A₂ on AVP and B₂ on BVP are the back corners of the floor.', () => {
        k.seg(A1, DPl, { cls: 'cons' }); k.seg(B1, DPr, { cls: 'cons' });
        k.point(A2, 'A_2', 'ne'); k.point(B2, 'B_2', 'nw');
      });
      k.step('tee', 'With the T-square draw the back edge of the floor through A₂ and B₂ (they are at the same height: the check that the two diagonals agree).', () => {
        k.seg(A2, B2, { cls: 'thick' });
      });
      k.step('square', 'Raise verticals from A₂ and B₂ to the lines DVP and CVP: D₂ and C₂ are the back corners of the ceiling.', () => {
        k.seg(A2, D2, { cls: 'thick' }); k.seg(B2, C2, { cls: 'thick' });
        k.point(D2, 'D_2', 'w'); k.point(C2, 'C_2', 'e');
      });
      k.step('tee', 'Join D₂ and C₂ with the T-square: the back wall A₂B₂C₂D₂ is the opening reduced in the ratio D : (D + L).', () => {
        k.seg(D2, C2, { cls: 'thick' });
      });
      k.note('Line in the room: the edges from the corners of the opening to the corners of the back wall. The back wall is ' + (D / (D + L)).toFixed(3) + ' times the opening (D / (D + L) = ' + D + ' / ' + (D + L) + '): width ' + (Wd * D / (D + L)).toFixed(0) + ', height ' + (Ht * D / (D + L)).toFixed(0) + '.', () => {
        [[A, A2], [B, B2], [C, C2], [Dd, D2]].forEach(([p, q]) => k.seg(p, q, { cls: 'thick' }));
      });
    }
  });

  /* ------------------------------------------------------------------ 2. two-point box */
  Hyper.construction({
    id: 'pt-two-point-box',
    title: 'A box between two vanishing points: the eye on the semicircle',
    tags: ['two-point', 'box', 'vanishing points', 'semicircle', 'compass'],
    note: 'The two edges of a box that meet at a right angle are two perpendicular directions, so their vanishing points V₁ and V₂ and the eye must satisfy: the angle V₁–SP–V₂ is a right angle. The eye folded up onto the sheet therefore stands on the semicircle with diameter V₁V₂ — and above CV, at the distance D (Thales). That gives D = √(a·b) for the distances a and b of CV from the two vanishing points. The widths of the two faces are then chosen by eye here; to make them true to scale you need the measuring points (next construction). The VPs are placed for edges at 30° and 60° to the picture plane.',
    build(k) {
      const g = k.g;
      const D = 140, e = 140, th = 30 * D2R, h = 90, xl = 30, xr = 190;
      const CV = k.pt(0, e), VR = k.pt(D / Math.tan(th), e), VL = k.pt(-D * Math.tan(th), e);
      const A = k.pt(100, 0), B = k.pt(100, h);
      const M = g.mid(VL, VR), r = g.dist(VL, VR) / 2;
      const SPs = g.lineCircle(CV, vert(k, CV), M, r).filter(p => p.y > e)[0];
      const at = (P, V, x) => g.lineLine(P, V, k.pt(x, 0), k.pt(x, 1));
      const AR = at(A, VR, xr), BR = at(B, VR, xr), AL = at(A, VL, xl), BL = at(B, VL, xl);
      const AF = g.lineLine(AL, VR, AR, VL), BF = g.lineLine(BL, VR, BR, VL);
      k.given('The ground line GL, the horizon HL, the centre of vision CV, the vanishing points VL and VR on HL, and the near vertical edge AB of the box (its true height).', () => {
        k.seg(k.pt(-130, 0), k.pt(290, 0), { cls: 'given' }); k.label(k.pt(-130, 0), 'GL', 'nw', small);
        k.seg(k.pt(-130, e), k.pt(290, e), { cls: 'given' }); k.label(k.pt(-130, e), 'HL', 'nw', small);
        k.point(CV, 'CV', 'sw'); k.point(VL, 'V_1', 'sw'); k.point(VR, 'V_2', 'se');
        k.seg(A, B, { cls: 'thick' }); k.point(A, 'A', 'sw'); k.point(B, 'B', 'nw');
        k.frame(-135, -15, 295, e + D + 25);
      });
      k.step('compass', 'Find the middle M of V₁V₂ (bisect it) and draw the semicircle on V₁V₂ as diameter, above HL.', () => {
        k.point(M, 'M', 'sw');
        k.arc(M, r, 0, Math.PI, { cls: 'curve' });
      });
      k.step('square', 'At CV raise the perpendicular to HL up to the semicircle. Its end SP* is the eye folded up into the sheet, and CV–SP* is the viewing distance D.', () => {
        k.seg(CV, SPs, { cls: 'cons' });
        k.point(SPs, 'SP*', 'ne');
        k.right(CV, VR, SPs, { r: 0.9 });
      });
      k.step('straightedge', 'Join SP* to V₁ and V₂: the angle V₁SP*V₂ is a right angle, and the two lines show the directions of the box\'s edges seen from above.', () => {
        k.seg(SPs, VL, { cls: 'cons' }); k.seg(SPs, VR, { cls: 'cons' });
        k.right(SPs, VL, VR, { r: 0.9 });
      });
      k.step('straightedge', 'From A and from B draw lines to V₁ and to V₂: the four edges of the two faces that meet at the near edge.', () => {
        [VL, VR].forEach(V => { k.seg(A, V, { cls: 'cons' }); k.seg(B, V, { cls: 'cons' }); });
      });
      k.step('square', 'Choose the width of each face by eye and raise verticals: on the left at x = ' + xl + ' (A_L and B_L), on the right at x = ' + xr + ' (A_R and B_R).', () => {
        k.seg(AL, BL, { cls: 'thick' }); k.seg(AR, BR, { cls: 'thick' });
        k.point(AL, 'A_L', 'sw'); k.point(BL, 'B_L', 'nw'); k.point(AR, 'A_R', 'se'); k.point(BR, 'B_R', 'ne');
      });
      k.step('straightedge', 'Join the top points to the opposite vanishing point: B_L to V₂ and B_R to V₁ meet at the far top corner B_F; A_L to V₂ and A_R to V₁ meet at the hidden far bottom corner A_F.', () => {
        k.seg(BL, BF, { cls: 'thick' }); k.seg(BR, BF, { cls: 'thick' });
        k.seg(AL, AF, { cls: 'cons', dash: true }); k.seg(AR, AF, { cls: 'cons', dash: true });
        k.point(BF, 'B_F', 'n'); k.point(AF, 'A_F', 's');
      });
      k.step('pencil', 'Line in the box. The horizon is above the box, so you see its top face; the three edges meeting at the hidden corner A_F are dashed.', () => {
        k.seg(A, B, { cls: 'thick' }); k.seg(A, AL, { cls: 'thick' }); k.seg(A, AR, { cls: 'thick' });
        k.seg(B, BL, { cls: 'thick' }); k.seg(B, BR, { cls: 'thick' });
        k.seg(AF, BF, { cls: 'cons', dash: true });
      });
      k.note('Check: D = √(a·b) = √(' + (-VL.x).toFixed(0) + ' × ' + VR.x.toFixed(0) + ') = ' + Math.sqrt(-VL.x * VR.x).toFixed(0) + ' — the same D as the height of SP* above CV. Edges at 30° and 60° put the vanishing points ' + (-VL.x).toFixed(0) + ' and ' + VR.x.toFixed(0) + ' from CV.', () => {
        dim(k, CV, SPs, 'D', { cls: 'cons', side: 'right', dist: 1.5 });
      });
    }
  });

  /* ------------------------------------------------------------------ 3. three-point tower */
  Hyper.construction({
    id: 'pt-three-point-tower',
    title: 'A tower seen from below: the third vanishing point from the tilted picture plane',
    tags: ['three-point', 'tower', 'worm\'s-eye', 'tilted picture plane', 'orthocentre'],
    note: 'Left: a side view. The eye SP looks up along an axis tilted by φ; the picture plane is perpendicular to the axis at the distance d. The horizontal ray from SP meets the plane at H₀ — that is where the horizon lies, d·tan φ below the centre — and the vertical ray meets it at V₃, d·cot φ above the centre: the third vanishing point. Right: the picture plane laid flat. The eye is folded about HL onto the principal vertical at the distance SP–H₀ = d / cos φ, and the two horizontal vanishing points are found from SP* exactly as in two-point perspective. The centre of vision is the orthocentre of the triangle V₁V₂V₃ (the dashed altitudes meet there). For φ = 0 the third point goes to infinity and the verticals stay vertical.',
    build(k) {
      const g = k.g, ph = 35 * D2R, d = 130, al = 55 * D2R;
      const Deff = d / Math.cos(ph);
      const S = k.pt(-260, 0);
      const ax = k.pt(Math.cos(ph), Math.sin(ph)), pd = k.pt(-Math.sin(ph), Math.cos(ph));
      const CVs = g.add(S, g.mul(ax, d)), H0 = k.pt(S.x + Deff, 0), V3s = k.pt(S.x, d / Math.sin(ph));
      const PP0 = g.add(CVs, g.mul(pd, -115)), PP1 = g.add(CVs, g.mul(pd, 205));
      const Xc = 190, CV = k.pt(Xc, CVs.y);
      const Hp = k.pt(Xc, CV.y - d * Math.tan(ph)), V3 = k.pt(Xc, CV.y + d / Math.tan(ph));
      const SPs = k.pt(Xc, Hp.y + Deff);
      const V1 = k.pt(Xc + Deff * Math.tan(al), Hp.y), V2 = k.pt(Xc - Deff / Math.tan(al), Hp.y);
      const A = k.pt(Xc + 125, -80);
      const at = (P, V, x) => g.lineLine(P, V, k.pt(x, 0), k.pt(x, 1));
      const B = at(A, V1, Xc + 205), C = at(A, V2, Xc + 70);
      const AT = g.lerp(A, V3, 0.46);
      const BT = g.lineLine(AT, V1, B, V3), CT = g.lineLine(AT, V2, C, V3);
      k.given('Left, the side view: the eye SP, the view axis tilted up by φ = 35°, and the picture plane PP perpendicular to it at the distance d. Right, the picture: its centre of vision CV and the vertical through it (the principal vertical). The tower is turned so that its edges make α = 55° and 35° with the view direction.', () => {
        k.point(S, 'SP', 'sw');
        k.seg(S, g.add(S, g.mul(ax, d + 45)), { cls: 'cons', dash: true });
        k.seg(PP0, PP1, { cls: 'given', width: 2.4 });
        k.label(PP1, 'PP', 'nw', small);
        k.point(CVs, 'C', 'e');
        dim(k, S, CVs, 'd', { cls: 'cons', side: 'right', dist: 1.2 });
        k.angle(S, k.pt(S.x + 80, 0), g.add(S, g.mul(ax, 80)), { label: 'φ', r: 1.4 });
        k.seg(k.pt(Xc, -105), k.pt(Xc, 275), { cls: 'cons', dash: true });
        k.point(CV, 'CV', 'w');
        k.frame(-290, -112, 450, 278);
        k.fontScale(0.82);
      });
      k.step('straightedge', 'In the side view draw the horizontal ray from SP and the vertical ray from SP. They meet PP at H₀ and V₀.', () => {
        k.seg(S, H0, { cls: 'cons' }); k.seg(S, V3s, { cls: 'cons' });
        k.point(H0, 'H_0', 'se'); k.point(V3s, 'V_0', 'ne');
      });
      k.step('compass', 'Swing the distances C–H₀ and C–V₀ onto the principal vertical of the picture, from CV: F lies below CV (the horizon is below the middle when you look up) and V₃ above it. V₃ is the third vanishing point.', () => {
        k.arc(CV, g.dist(CVs, H0), -Math.PI / 2 - 0.22, -Math.PI / 2 + 0.22, { cls: 'cons' });
        k.arc(CV, g.dist(CVs, V3s), Math.PI / 2 - 0.12, Math.PI / 2 + 0.12, { cls: 'cons' });
        k.point(Hp, 'F', 'se'); k.point(V3, 'V_3', 'ne');
      });
      k.step('tee', 'With the T-square draw HL through F. The horizontal vanishing points will lie on it.', () => {
        k.line(k.pt(40, Hp.y), k.pt(430, Hp.y), { cls: 'curve' });
        k.label(k.pt(40, Hp.y), 'HL', 'nw', small);
      });
      k.step('compass', 'Swing the length SP–H₀ = d / cos φ about F onto the principal vertical: SP*, the eye folded up about HL into the sheet.', () => {
        k.arc(Hp, Deff, Math.PI / 2 - 0.18, Math.PI / 2 + 0.18, { cls: 'cons' });
        k.point(SPs, 'SP*', 'w');
      });
      k.step('protractor', 'At SP* lay off α = 55° from the vertical SP*F to the right and 90° − α = 35° to the left. The two lines cut HL at V₁ and V₂, the vanishing points of the tower\'s horizontal edges.', () => {
        k.seg(SPs, V1, { cls: 'cons' }); k.seg(SPs, V2, { cls: 'cons' });
        k.point(V1, 'V_1', 'se'); k.point(V2, 'V_2', 'sw');
        k.right(SPs, V1, V2, { r: 0.9 });
        k.seg(SPs, Hp, { cls: 'cons', dash: true });
      });
      const F1 = g.foot(V1, V2, V3), F2 = g.foot(V2, V1, V3);
      k.note('Check: the lines from V₁ and V₂ through CV are perpendicular to V₂V₃ and V₁V₃ — CV is the orthocentre of the triangle of the three vanishing points, and the vertical through CV is its third altitude. The centre of vision stays where the picture is looked at.', () => {
        k.seg(V1, V3, { cls: 'aux', dash: true }); k.seg(V2, V3, { cls: 'aux', dash: true }); k.seg(V1, V2, { cls: 'aux', dash: true });
        k.seg(V1, F1, { cls: 'aux', dash: true }); k.seg(V2, F2, { cls: 'aux', dash: true });
        k.right(F1, V1, V3, { r: 0.7 }); k.right(F2, V2, V3, { r: 0.7 });
      });
      k.step('straightedge', 'Choose the near base corner A of the tower below HL and draw from A the three edges: to V₁ and V₂ (the base) and to V₃ (the vertical edge, now leaning).', () => {
        k.point(A, 'A', 'sw');
        k.seg(A, V1, { cls: 'cons' }); k.seg(A, V2, { cls: 'cons' }); k.seg(A, V3, { cls: 'cons' });
      });
      k.step('square', 'Choose the widths of the two faces by eye on the base lines: B on AV₁ and C on AV₂. From B and C draw the vertical edges, which also go to V₃.', () => {
        k.point(B, 'B', 'se'); k.point(C, 'C', 'sw');
        k.seg(B, V3, { cls: 'cons' }); k.seg(C, V3, { cls: 'cons' });
      });
      k.step('straightedge', 'Choose the height by eye: A_T on AV₃. The top edges go from A_T to V₁ and V₂; they cut the vertical edges at B_T and C_T.', () => {
        k.point(AT, 'A_T', 'ne');
        k.seg(AT, V1, { cls: 'cons' }); k.seg(AT, V2, { cls: 'cons' });
        k.point(BT, 'B_T', 'ne'); k.point(CT, 'C_T', 'nw');
      });
      k.step('pencil', 'Line in the two visible faces. Because you look up, the edges lean together towards V₃, the top face is out of sight, and the tower looks taller than it is.', () => {
        [[A, AT], [AT, BT], [BT, B], [B, A], [AT, CT], [CT, C], [C, A]].forEach(([p, q]) => k.seg(p, q, { cls: 'thick' }));
      });
    }
  });

  /* ------------------------------------------------------------------ 4. long lens: perspective with the vanishing points far away */
  Hyper.construction({
    id: 'pt-long-lens-cube',
    title: 'The same cube with a wide lens and a long lens: only the distance point moves',
    tags: ['zero-point', 'long lens', 'telephoto', 'distance point', 'cube'],
    note: 'The front face of the cube lies in the picture plane and is the same in both pictures. What changes is the distance D from the eye to the picture, and with it the distance point DP and the ratio k = D / (D + a) by which the back face is reduced about VP. With a wide lens (D = 1.2 a) the back face is little more than half the front; with a long lens (D = 3.3 a) it is three quarters, and the edges that run away are nearly parallel. In the limit D → ∞ the vanishing point leaves the sheet, k → 1 and the picture becomes an oblique parallel projection: a perspective with no vanishing points at all.',
    build(k) {
      const g = k.g, a = 100, e = 140;
      const A = k.pt(0, 0), B = k.pt(a, 0), C = k.pt(a, a), Dd = k.pt(0, a);
      const VP = k.pt(190, e);
      const D1 = 120, D2 = 330;
      const DP1 = k.pt(VP.x + D1, e), DP2 = k.pt(VP.x + D2, e);
      const cube = DP => {
        const B2 = g.lineLine(A, DP, B, VP);
        const A2 = g.lineLine(A, VP, B2, horiz(k, B2)), C2 = g.lineLine(C, VP, B2, vert(k, B2));
        const D2p = g.lineLine(Dd, VP, A2, vert(k, A2));
        return { B2, A2, C2, D2p };
      };
      const c1 = cube(DP1), c2 = cube(DP2);
      k.given('The front face ABCD of a cube of edge a, in the picture plane (true size), the horizon HL and the vanishing point VP of the edges that run away. Two viewing distances, D₁ = 1.2 a for a wide lens and D₂ = 3.3 a for a long lens, as lengths.', () => {
        k.seg(k.pt(-40, 0), k.pt(DP2.x + 25, 0), { cls: 'given' }); k.label(k.pt(-40, 0), 'GL', 'nw', small);
        k.seg(k.pt(-40, e), k.pt(DP2.x + 25, e), { cls: 'given' }); k.label(k.pt(-40, e), 'HL', 'nw', small);
        k.poly([A, B, C, Dd], { close: true, cls: 'thick' });
        k.point(A, 'A', 'sw'); k.point(B, 'B', 'se'); k.point(C, 'C', 'nw'); k.point(Dd, 'D', 'nw');
        k.point(VP, 'VP', 'n');
        dim(k, k.pt(0, -30), k.pt(D1, -30), 'D_1', { cls: 'cons', side: 'right' });
        dim(k, k.pt(0, -56), k.pt(D2, -56), 'D_2', { cls: 'cons', side: 'right' });
        k.frame(-45, -66, DP2.x + 30, e + 25);
      });
      k.step('dividers', 'Set D₁ and D₂ off on HL to the right of VP: the distance points DP₁ (wide lens) and DP₂ (long lens).', () => {
        k.point(DP1, 'DP_1', 'n'); k.point(DP2, 'DP_2', 'n');
      });
      k.step('straightedge', 'Join the front corners A, B, C, D to VP.', () => {
        [A, B, C, Dd].forEach(p => k.seg(p, VP, { cls: 'cons' }));
      });
      k.step('straightedge', 'Join A to DP₁. It cuts BVP at B₁, the back bottom corner of the cube for the wide lens (the diagonal of the floor square ends there).', () => {
        k.seg(A, DP1, { cls: 'cons' }); k.point(c1.B2, 'B_1', 'se');
      });
      k.step('square', 'Complete the back face: the horizontal through B₁ gives A₁ on AVP, the vertical through B₁ gives C₁ on CVP, and the vertical through A₁ gives D₁ on DVP.', () => {
        k.seg(c1.B2, c1.A2, { cls: 'thick' }); k.seg(c1.B2, c1.C2, { cls: 'thick' }); k.seg(c1.A2, c1.D2p, { cls: 'thick' });
        k.seg(c1.C2, c1.D2p, { cls: 'thick' });
      });
      k.step('straightedge', 'Join A to DP₂. It cuts BVP much nearer to B: B₂, the back corner for the long lens.', () => {
        k.seg(A, DP2, { cls: 'cons' }); k.point(c2.B2, 'B_2', 'se');
      });
      k.step('square', 'Complete the second back face in the same way: it is only a little smaller than the front face.', () => {
        k.seg(c2.B2, c2.A2, { cls: 'curve' }); k.seg(c2.B2, c2.C2, { cls: 'curve' }); k.seg(c2.A2, c2.D2p, { cls: 'curve' });
        k.seg(c2.C2, c2.D2p, { cls: 'curve' });
      });
      k.step('pencil', 'Line in both cubes: the visible edges that join the front face to each back face (the right and the top face).', () => {
        [[B, c1.B2], [C, c1.C2], [Dd, c1.D2p]].forEach(([p, q]) => k.seg(p, q, { cls: 'thick' }));
        [[B, c2.B2], [C, c2.C2], [Dd, c2.D2p]].forEach(([p, q]) => k.seg(p, q, { cls: 'curve' }));
      });
      k.note('Reduction of the back face: k₁ = ' + D1 + ' / ' + (D1 + a) + ' = ' + (D1 / (D1 + a)).toFixed(2) + ' and k₂ = ' + D2 + ' / ' + (D2 + a) + ' = ' + (D2 / (D2 + a)).toFixed(2) + '. For D = 10 a it is 0.91 and for D = 100 a, 0.99: the cube is then drawn as an oblique projection.', () => {
        k.label(c1.C2, 'k_1', 'ne', small); k.label(c2.C2, 'k_2', 'nw', { upright: true, size: 0.8, fill: '#0b4fa0' });
      });
    }
  });

  /* ------------------------------------------------------------------ 5. tiled floor */
  Hyper.construction({
    id: 'pt-tiled-floor',
    title: 'A tiled floor by the distance point',
    tags: ['grid', 'floor', 'distance point', 'diagonal', 'one-point'],
    note: 'The front edge of the floor lies on the ground line and is divided into tiles of true width t. All the lines parallel to the side go to VP. The diagonal of a tile makes 45° with the lines of the floor, so its picture goes to the distance point DP, at the distance D from VP. The diagonal from the corner A therefore crosses the lines to VP at the corners of the tiles of one diagonal row, and each crossing gives the depth of a row of tiles. The check is that every other diagonal (all parallel to the first) passes through the corners of the tiles and ends in DP.',
    build(k) {
      const g = k.g;
      const D = 280, e = 140, t = 40, nc = 6, nr = 5;
      const x = i => -120 + t * i;
      const A = k.pt(x(0), 0), B = k.pt(x(nc), 0), VP = k.pt(0, e), DP = k.pt(D, e);
      const P = i => g.lineLine(A, DP, k.pt(x(i), 0), VP);      // the crossing at the depth i·t
      const row = i => [g.lineLine(P(i), horiz(k, P(i)), A, VP), g.lineLine(P(i), horiz(k, P(i)), B, VP)];
      k.given('The front edge AB of the floor on GL, true length ' + nc * t + '; the horizon HL with VP; and the distance point DP at the distance D = ' + D + ' from VP (take D with the dividers).', () => {
        k.seg(k.pt(-170, 0), k.pt(D + 25, 0), { cls: 'given' }); k.label(k.pt(-170, 0), 'GL', 'nw', small);
        k.seg(k.pt(-170, e), k.pt(D + 25, e), { cls: 'given' }); k.label(k.pt(-170, e), 'HL', 'nw', small);
        k.seg(A, B, { cls: 'thick' }); k.point(A, 'A', 'sw'); k.point(B, 'B', 'se');
        k.point(VP, 'VP', 'n'); k.point(DP, 'DP', 'n');
        dim(k, k.pt(0, e + 20), k.pt(D, e + 20), 'D', { cls: 'cons' });
        k.frame(-175, -22, D + 30, e + 50);
      });
      k.step('dividers', 'Step the width of a tile, t, along AB from A: six equal divisions 1 … 5 on the front edge.', () => {
        for (let i = 1; i < nc; i++) { k.dot(k.pt(x(i), 0), { r: 0.7 }); k.tick(k.pt(x(i), 0), k.pt(1, 0)); }
      });
      k.step('straightedge', 'Join every division, and A and B, to VP: the lines of tile edges that run away from you.', () => {
        for (let i = 0; i <= nc; i++) k.seg(k.pt(x(i), 0), VP, { cls: 'cons' });
      });
      k.step('straightedge', 'Join A to DP. This diagonal crosses the lines to VP at the corners of one diagonal row of tiles: the first crossing is the corner of the first row, the second of the second, and so on.', () => {
        k.seg(A, DP, { cls: 'cons' });
        for (let i = 1; i <= nr; i++) k.dot(P(i), { r: 0.7 });
      });
      k.step('tee', 'Through each crossing draw a horizontal across the floor with the T-square: the back edge of each row of tiles. The rows get closer together as they recede.', () => {
        for (let i = 1; i <= nr; i++) { const [l, r] = row(i); k.seg(l, r, { cls: i === nr ? 'thick' : 'cons' }); }
      });
      k.step('pencil', 'Line in the front edge, the two sides and the back edge of the floor.', () => {
        const [l, r] = row(nr);
        k.seg(A, B, { cls: 'thick' }); k.seg(A, l, { cls: 'thick' }); k.seg(B, r, { cls: 'thick' }); k.seg(l, r, { cls: 'thick' });
      });
      k.note('Check: the diagonal from the second division (at ' + x(1) + ') to DP passes through the tile corners one column to the right of those found from A. Rows are at depths t, 2t … : the k-th back edge stands ' + (e * t / (D + t)).toFixed(1) + ', ' + (e * 2 * t / (D + 2 * t)).toFixed(1) + ' … ' + (e * nr * t / (D + nr * t)).toFixed(1) + ' above GL.', () => {
        k.seg(k.pt(x(1), 0), DP, { cls: 'aux', dash: true });
        k.seg(k.pt(x(2), 0), DP, { cls: 'aux', dash: true });
      });
    }
  });

  /* ------------------------------------------------------------------ 6. measuring points */
  Hyper.construction({
    id: 'pt-measuring-points',
    title: 'A box with true lengths: the measuring points swung from the eye',
    tags: ['two-point', 'measuring point', 'compass', 'true length', 'box'],
    note: 'A true length laid on the ground line from the near corner A is carried to the receding edge by a line to the measuring point. Why: take A, the point P on the edge at the true distance s, and the point Q on the picture plane at the same distance s from A. The triangle APQ is isosceles; the line PQ has the same direction whatever s is, so all the lines PQ meet at one vanishing point, the measuring point MP. By similar triangles it lies at the distance VP–SP from VP: swing that distance from VP onto HL with the compass. For the right-hand edge (towards V₂) the marks go to the right of A and the measuring point lies on the left of CV; for the left-hand edge the other way round.',
    build(k) {
      const g = k.g;
      const D = 140, e = 110, th = 30 * D2R, h = 60, lR = 140, lL = 80;
      const CV = k.pt(0, e), VR = k.pt(D / Math.tan(th), e), VL = k.pt(-D * Math.tan(th), e), SPs = k.pt(0, e + D);
      const A = k.pt(110, 0), B = k.pt(110, h);
      const hl = [k.pt(-300, e), k.pt(300, e)];
      const mpR = g.lineCircle(hl[0], hl[1], VR, g.dist(VR, SPs)).filter(p => p.x < VR.x)[0];
      const mpL = g.lineCircle(hl[0], hl[1], VL, g.dist(VL, SPs)).filter(p => p.x > VL.x)[0];
      const Rm = k.pt(A.x + lR, 0), Lm = k.pt(A.x - lL, 0);
      const CR = g.lineLine(Rm, mpR, A, VR), CL = g.lineLine(Lm, mpL, A, VL);
      const vline = (P, x) => g.lineLine(P, vert(k, P), k.pt(x, 0), k.pt(x, 1));
      const TR = g.lineLine(CR, vert(k, CR), B, VR), TL = g.lineLine(CL, vert(k, CL), B, VL);
      const CF = g.lineLine(CL, VR, CR, VL), TF = g.lineLine(TL, VR, TR, VL);
      k.given('The ground line GL, HL, the centre of vision CV, the vanishing points V₁ and V₂, the eye folded up as SP* (as in the previous construction), the near edge AB of height h, and the two true lengths of the box: ℓ₂ = ' + lR + ' along the right wall and ℓ₁ = ' + lL + ' along the left wall.', () => {
        k.seg(k.pt(-130, 0), k.pt(320, 0), { cls: 'given' }); k.label(k.pt(-130, 0), 'GL', 'nw', small);
        k.seg(k.pt(-130, e), k.pt(320, e), { cls: 'given' }); k.label(k.pt(-130, e), 'HL', 'nw', small);
        k.point(CV, 'CV', 'n'); k.point(VL, 'V_1', 'n'); k.point(VR, 'V_2', 'n'); k.point(SPs, 'SP*', 'ne');
        k.seg(CV, SPs, { cls: 'cons', dash: true });
        k.seg(A, B, { cls: 'thick' }); k.point(A, 'A', 'sw'); k.point(B, 'B', 'nw');
        k.frame(-135, -35, 330, e + D + 22);
      });
      k.step('compass', 'Centre V₂, radius V₂–SP*: swing SP* down onto HL. It lands at MP₂ on the left of CV. Centre V₁, radius V₁–SP*: swing SP* onto HL at MP₁ on the right of CV.', () => {
        k.arc3(VR, SPs, mpR, { cls: 'cons' });
        k.arc3(VL, mpL, SPs, { cls: 'cons' });
        k.point(mpR, 'MP_2', 'n'); k.point(mpL, 'MP_1', 'n');
      });
      k.step('dividers', 'Lay the true length ℓ₂ along GL from A to the right (R₂) and ℓ₁ from A to the left (R₁).', () => {
        k.seg(A, Rm, { cls: 'thick' }); k.seg(A, Lm, { cls: 'thick' });
        k.point(Rm, 'R_2', 's'); k.point(Lm, 'R_1', 's');
      });
      k.step('straightedge', 'Draw the edges from A and from B to V₁ and V₂: the base and the top of the two walls.', () => {
        [VL, VR].forEach(V => { k.seg(A, V, { cls: 'cons' }); k.seg(B, V, { cls: 'cons' }); });
      });
      k.step('straightedge', 'Join R₂ to MP₂: it cuts the base line AV₂ at C₂, which is exactly ℓ₂ from A. Join R₁ to MP₁: it cuts AV₁ at C₁, exactly ℓ₁ from A.', () => {
        k.seg(Rm, mpR, { cls: 'cons' }); k.seg(Lm, mpL, { cls: 'cons' });
        k.point(CR, 'C_2', 'se'); k.point(CL, 'C_1', 'sw');
      });
      k.step('square', 'Raise verticals at C₁ and C₂ up to the top lines: T₁ and T₂.', () => {
        k.seg(CR, TR, { cls: 'thick' }); k.seg(CL, TL, { cls: 'thick' });
        k.point(TR, 'T_2', 'ne'); k.point(TL, 'T_1', 'nw');
      });
      k.step('straightedge', 'The far corner: C₁ to V₂ and C₂ to V₁ meet at C_F; T₁ to V₂ and T₂ to V₁ meet at T_F.', () => {
        k.seg(CL, CF, { cls: 'cons', dash: true }); k.seg(CR, CF, { cls: 'cons', dash: true });
        k.seg(TL, TF, { cls: 'thick' }); k.seg(TR, TF, { cls: 'thick' });
        k.point(CF, 'C_F', 's'); k.point(TF, 'T_F', 'n');
      });
      k.step('pencil', 'Line in the box: the near edge, the base and top of the two walls, and the top face.', () => {
        k.seg(A, B, { cls: 'thick' });
        k.seg(A, CR, { cls: 'thick' }); k.seg(A, CL, { cls: 'thick' }); k.seg(B, TR, { cls: 'thick' }); k.seg(B, TL, { cls: 'thick' });
      });
      k.step('dividers', 'To divide a wall into equal true parts, divide R₂ on GL into four equal parts with the dividers and join each division to MP₂: the base edge AC₂ is divided into four equal lengths.', () => {
        for (let j = 1; j < 4; j++) {
          const Q = g.lerp(A, Rm, j / 4), Pj = g.lineLine(Q, mpR, A, VR);
          k.dot(Q, { r: 0.6 }); k.seg(Q, Pj, { cls: 'aux', dash: true }); k.dot(Pj, { r: 0.6 });
        }
      });
    }
  });

  /* ------------------------------------------------------------------ 7. dividing a fence */
  Hyper.construction({
    id: 'pt-dividing-fence',
    title: 'A receding fence in equal bays: the diagonals of its rectangles',
    tags: ['dividing depth', 'fence', 'diagonal', 'halving', 'equal spaces'],
    note: 'The diagonals of any rectangle in the plane of the fence cross at its centre, and a perspective keeps straight lines and their crossings: so the crossing of the two diagonals of a fence panel, however foreshortened, is the picture of its middle. A vertical through it halves the bay. Halving again and again gives 2, 4, 8 equal bays. To go on beyond the last post, use the same rule the other way: the line from the foot of one post through the middle of the next post meets the top rail at the top of the post after that. Equal bays are never equal in the picture; each is the same fraction D/(D + z) of the one before it, nearly.',
    build(k) {
      const g = k.g;
      const D = 300, e = 130, x0 = 520, hf = 100, s = 150, nb = 4;
      const VP = k.pt(0, e);
      const img = (z, y) => k.pt(x0 * D / (D + z), e + (y - e) * D / (D + z));
      const foot = i => img(s * i, 0), top = i => img(s * i, hf), mid = i => img(s * i, hf / 2);
      const vx = (P, x) => g.lineLine(P, vert(k, P), k.pt(x, 0), k.pt(x, 1));
      const B0 = foot(0), T0 = top(0), B4 = foot(nb), T4 = top(nb), M0 = mid(0);
      const post = X => ({ b: g.lineLine(X, vert(k, X), B0, VP), t: g.lineLine(X, vert(k, X), T0, VP) });
      const X2 = g.lineLine(B0, T4, T0, B4);
      const p2 = post(X2);
      const half = (Bl, Tl, Br, Tr) => g.lineLine(Bl, Tr, Tl, Br);      // the crossing of the diagonals of the panel
      const X1 = half(B0, T0, p2.b, p2.t), X3 = half(p2.b, p2.t, B4, T4);
      const p1 = post(X1), p3 = post(X3);
      const posts = [{ b: B0, t: T0 }, p1, p2, p3, { b: B4, t: T4 }];
      k.given('The ground line GL, HL and VP; the first post P₀ of height h on the picture plane (true height); the last post P₄ of the fence where it ends; and the base rail and the top rail, both going to VP.', () => {
        k.seg(k.pt(-30, 0), k.pt(550, 0), { cls: 'given' }); k.label(k.pt(-30, 0), 'GL', 'nw', small);
        k.seg(k.pt(-30, e), k.pt(550, e), { cls: 'given' }); k.label(k.pt(-30, e), 'HL', 'nw', small);
        k.point(VP, 'VP', 'n');
        k.seg(B0, T0, { cls: 'thick' }); k.seg(B4, T4, { cls: 'thick' });
        k.point(B0, 'B_0', 's'); k.point(T0, 'T_0', 'n'); k.point(B4, 'B_4', 's'); k.point(T4, 'T_4', 'n');
        k.seg(B0, VP, { cls: 'cons' }); k.seg(T0, VP, { cls: 'cons' });
        k.frame(-35, -28, 555, e + 25);
      });
      k.step('straightedge', 'Draw the two diagonals of the whole panel, B₀ to T₄ and T₀ to B₄. They cross at X, the picture of the middle of the panel.', () => {
        k.seg(B0, T4, { cls: 'cons' }); k.seg(T0, B4, { cls: 'cons' });
        k.point(X2, 'X', 'ne');
      });
      k.step('square', 'Raise the vertical through X between the rails: the middle post P₂. The fence is now in two equal bays.', () => {
        k.seg(p2.b, p2.t, { cls: 'thick' });
        k.point(p2.t, 'T_2', 'n');
      });
      k.step('straightedge', 'Repeat in each half: the diagonals of the panel P₀P₂ cross at X₁, those of P₂P₄ at X₃.', () => {
        k.seg(B0, p2.t, { cls: 'cons' }); k.seg(T0, p2.b, { cls: 'cons' });
        k.seg(p2.b, T4, { cls: 'cons' }); k.seg(p2.t, B4, { cls: 'cons' });
        k.point(X1, 'X_1', 'ne', { lo: { size: 0.8 } }); k.point(X3, 'X_3', 'ne', { lo: { size: 0.8 } });
      });
      k.step('square', 'Raise the verticals through X₁ and X₃: the posts P₁ and P₃. The fence is in four bays, equal in space and unequal on paper.', () => {
        k.seg(p1.b, p1.t, { cls: 'thick' }); k.seg(p3.b, p3.t, { cls: 'thick' });
      });
      const m3 = g.lineLine(p3.b, p3.t, M0, VP), m4 = g.lineLine(B4, T4, M0, VP);
      k.step('dividers', 'To continue beyond P₄: bisect P₀ to find its middle M₀ and draw the middle rail M₀VP. It meets each post at its middle: M₃ and M₄.', () => {
        k.seg(M0, VP, { cls: 'cons' }); k.point(M0, 'M_0', 'w');
        k.point(m4, 'M_4', 'sw', { lo: { size: 0.8 } });
      });
      const T5 = g.lineLine(p3.b, m4, T0, VP), B5 = g.lineLine(T5, vert(k, T5), B0, VP);
      const m5 = g.lineLine(B5, T5, M0, VP);
      const T6 = g.lineLine(B4, m5, T0, VP), B6 = g.lineLine(T6, vert(k, T6), B0, VP);
      k.step('straightedge', 'From B₃ draw the line through M₄ and extend it to the top rail: it ends at T₅, the top of the fifth post P₅. From B₄ through M₅ the line ends at T₆.', () => {
        k.seg(p3.b, T5, { cls: 'cons' }); k.point(T5, 'T_5', { at: 'n', lo: { size: 0.7 } });
        k.seg(B5, T5, { cls: 'thick' });
        k.seg(B4, T6, { cls: 'cons' }); k.point(T6, 'T_6', { at: 'n', lo: { size: 0.7 } });
        k.seg(B6, T6, { cls: 'thick' });
      });
      k.note('The bays at the near end are ' + (posts[0].b.x - posts[1].b.x).toFixed(0) + ', ' + (posts[1].b.x - posts[2].b.x).toFixed(0) + ', ' + (posts[2].b.x - posts[3].b.x).toFixed(0) + ' and ' + (posts[3].b.x - posts[4].b.x).toFixed(0) + ' units wide on the paper although each is ' + s + ' long on the ground. The posts to the right of P₄ keep shrinking: P₅ and P₆ are only ' + (B4.x - B5.x).toFixed(0) + ' and ' + (B5.x - B6.x).toFixed(0) + ' further on.', () => {
        [B0, p1.b, p2.b, p3.b, B4, B5, B6].forEach((b, i) => k.text(b.x, b.y - 14, String(i), { size: 0.65, upright: true }));
      });
    }
  });

  /* ------------------------------------------------------------------ 8. a gable roof */
  Hyper.construction({
    id: 'pt-gable-roof',
    title: 'A gable roof: the vanishing points of the slopes stand on the vertical through VP',
    tags: ['inclined plane', 'roof', 'gable', 'vanishing point', 'slope', 'compass', 'protractor'],
    note: 'A line that rises at the angle α along a horizontal direction whose vanishing point is V has its own vanishing point on the vertical through V, at the height |V SP*|·tan α above HL (or the same distance below HL for a line that falls). To see why, fold the eye SP* onto HL by swinging V–SP* about V: the right triangle V, M, V_up has the angle α at M. The roof of this house slopes along the direction of the wide face, so its vanishing points V_up and V_dn stand above and below V₂. The ridge is parallel to the other wall edges and goes to V₁. The roof is also a check on the whole drawing: the two slope lines from the ends of the eave meet exactly over the middle of the gable end.',
    build(k) {
      const g = k.g;
      const D = 140, e = 100, th = 30 * D2R, hw = 50, al = 25 * D2R, lR = 120, lL = 150, x0 = 20;
      const CV = k.pt(0, e), VR = k.pt(D / Math.tan(th), e), VL = k.pt(-D * Math.tan(th), e), SPs = k.pt(0, e + D);
      const img = (x, z, y) => k.pt(x * D / (D + z), e + (y - e) * D / (D + z));
      const Ap = [x0, 0], Bp = [x0 + lR * Math.cos(th), lR * Math.sin(th)], Cp = [x0 - lL * Math.sin(th), lL * Math.cos(th)];
      const Ab = img(Ap[0], Ap[1], 0), At = img(Ap[0], Ap[1], hw), Bb = img(Bp[0], Bp[1], 0), Bt = img(Bp[0], Bp[1], hw);
      const Cb = img(Cp[0], Cp[1], 0), Ct = img(Cp[0], Cp[1], hw);
      const rad = g.dist(VR, SPs), hUp = rad * Math.tan(al);
      const MR = k.pt(VR.x - rad, e), Vup = k.pt(VR.x, e + hUp), Vdn = k.pt(VR.x, e - hUp);
      const Xd = g.lineLine(Ab, Bt, Bb, At), Mt = g.lineLine(Xd, vert(k, Xd), At, Bt);
      const P = g.lineLine(At, Vup, Bt, Vdn), P2 = g.lineLine(Ct, Vup, P, VL);
      k.given('The ground line GL, HL, CV, the vanishing points V₁ (left) and V₂ (right) and the eye folded up as SP*; and the walls of the house, already drawn between V₁ and V₂: the wide gable end (the right face, edges to V₂) and the long wall (the left face, edges to V₁). The eave is the top of the walls.', () => {
        k.seg(k.pt(-110, 0), k.pt(300, 0), { cls: 'given' }); k.label(k.pt(-110, 0), 'GL', 'nw', small);
        k.seg(k.pt(-110, e), k.pt(300, e), { cls: 'given' }); k.label(k.pt(-110, e), 'HL', 'nw', small);
        k.point(VL, 'V_1', 'sw'); k.point(VR, 'V_2', 'se'); k.point(SPs, 'SP*', 'ne');
        k.poly([Ab, Bb, Bt, At], { close: true, cls: 'thick' }); k.poly([Ab, Cb, Ct, At], { close: true, cls: 'thick' });
        k.point(At, 'A_t', 'nw'); k.point(Bt, 'B_t', 'ne'); k.point(Ct, 'C_t', 'nw');
        k.frame(-115, e - hUp - 22, 305, e + D + 20);
        k.fontScale(0.8);
      });
      k.step('compass', 'Centre V₂, radius V₂–SP*: swing SP* down onto HL. It lands at M, on the left of CV. (The eye is turned about the vertical through V₂ into the horizontal plane of the eye.)', () => {
        k.arc3(VR, SPs, MR, { cls: 'cons' });
        k.point(MR, 'M', 'n');
        k.seg(MR, VR, { cls: 'aux', dash: true });
      });
      k.step('square', 'Through V₂ draw the vertical. The vanishing points of all lines that rise or fall along the direction of V₂ lie on it.', () => {
        k.line(VR, vert(k, VR), { cls: 'cons' });
      });
      k.step('protractor', 'At M lay off the pitch α = 25° above HL. The line cuts the vertical at V_up, the vanishing point of the roof slope going up. Set off the same distance below HL: V_dn, for the lines that fall.', () => {
        k.seg(MR, Vup, { cls: 'cons' });
        k.point(Vup, 'V_{up}', 'e'); k.point(Vdn, 'V_{dn}', 'e');
        k.angle(MR, VR, Vup, { label: 'α', r: 1.4 });
      });
      k.step('straightedge', 'Draw the diagonals of the gable-end wall. They cross at X, the middle of the wall.', () => {
        k.seg(Ab, Bt, { cls: 'cons' }); k.seg(Bb, At, { cls: 'cons' });
        k.point(Xd, 'X', 'se');
      });
      k.step('square', 'The vertical through X meets the eave A_tB_t at its middle M_t: the peak of the gable stands over this point.', () => {
        k.seg(Xd, Mt, { cls: 'cons' }); k.point(Mt, 'M_t', 'n');
      });
      k.step('straightedge', 'Draw A_t to V_up (up the slope) and B_t to V_dn (the same slope seen from the other end). The two lines meet at P — on the vertical through M_t — the peak of the gable.', () => {
        k.seg(At, P, { cls: 'thick' }); k.seg(Bt, P, { cls: 'thick' });
        k.seg(At, Vup, { cls: 'aux', dash: true }); k.seg(Bt, Vdn, { cls: 'aux', dash: true });
        k.point(P, 'P', 'nw');
      });
      k.step('straightedge', 'The ridge is parallel to the left wall edges, so it goes to V₁. Draw P to V₁.', () => {
        k.seg(P, VL, { cls: 'cons' });
      });
      k.step('straightedge', 'The slope along the far end of the eave: draw C_t to V_up. It cuts the ridge at P′, the far end of the ridge.', () => {
        k.seg(Ct, P2, { cls: 'thick' }); k.seg(Ct, Vup, { cls: 'aux', dash: true });
        k.point(P2, 'P′', 'ne');
      });
      k.step('pencil', 'Line in the roof: the ridge PP′ and the sloping edge C_tP′, with the eave A_tC_t, make the visible roof slope. The other slope faces away and is out of sight.', () => {
        k.seg(P, P2, { cls: 'thick' }); k.seg(Ct, P2, { cls: 'thick' }); k.seg(At, Ct, { cls: 'thick' });
      });
      k.note('The peak rises (' + lR + ' / 2)·tan 25° = ' + (lR / 2 * Math.tan(al)).toFixed(1) + ' above the eave in space. Try a steeper pitch: V_up and V_dn move apart along the vertical and P climbs, still over the middle of the gable end.', () => {
        k.text(VR.x - 10, e + hUp * 0.5, 'height ' + hUp.toFixed(0) + ' above HL', { anchor: 'end', size: 0.75, upright: true, bg: true });
      });
    }
  });

  /* ------------------------------------------------------------------ 9. stairs */
  Hyper.construction({
    id: 'pt-stairs',
    title: 'A flight of stairs: treads by the distance point, nosings on the pitch line',
    tags: ['stairs', 'inclined plane', 'pitch line', 'one-point', 'distance point'],
    note: 'The stair runs straight away from the picture, so its pitch line (the line through the nosings of the treads) rises in a vertical plane that contains the direction to VP. Its vanishing point V_s therefore lies on the vertical through VP, at the height D·tan α above HL, where tan α = riser / tread. The distance point DP is the eye folded onto HL, so the angle α laid at DP finds V_s without a table. The equal treads along the floor are found with the diagonal to DP (as in the tiled floor), the nosings are where the verticals through them meet the pitch line, and the whole flight follows from two lines. The eye is above the top tread, so you see every tread from above.',
    build(k) {
      const g = k.g;
      const D = 170, e = 100, x0 = 70, x1 = 210, t = 40, r = 15, n = 5;
      const VP = k.pt(0, e), DPr = k.pt(D, e), alpha = Math.atan2(r, t);
      const Vs = k.pt(0, e + D * Math.tan(alpha));
      const A0 = k.pt(x0, 0), N1 = k.pt(x0, r), A1 = k.pt(x1, 0), N1r = k.pt(x1, r);
      const mk = i => k.pt(x0 - i * t, 0);
      const G = i => i === 0 ? A0 : g.lineLine(mk(i), DPr, A0, VP);
      const N = i => g.lineLine(G(i - 1), vert(k, G(i - 1)), N1, Vs);
      const Mm = i => g.lineLine(G(i), vert(k, G(i)), N(i), VP);
      const Nr = i => g.lineLine(N(i), horiz(k, N(i)), N1r, Vs);
      const Mr = i => g.lineLine(Mm(i), horiz(k, Mm(i)), Nr(i), VP);
      const idx = Array.from({ length: n }, (_, i) => i + 1);
      k.given('The ground line GL, HL, VP and the distance point DP at the distance D from VP; the first riser on the picture plane, true height r, at the left edge of the stair (x = ' + x0 + ') and at its right edge (x = ' + x1 + '); and the tread t along GL. The flight has ' + n + ' steps.', () => {
        k.seg(k.pt(-175, 0), k.pt(265, 0), { cls: 'given' }); k.label(k.pt(-175, 0), 'GL', 'nw', small);
        k.seg(k.pt(-175, e), k.pt(265, e), { cls: 'given' }); k.label(k.pt(-175, e), 'HL', 'nw', small);
        k.point(VP, 'VP', 'nw'); k.point(DPr, 'DP', 'ne');
        k.seg(A0, N1, { cls: 'thick' }); k.seg(A1, N1r, { cls: 'thick' });
        k.seg(N1, N1r, { cls: 'thick' });
        k.point(A0, 'A', 'sw'); k.point(N1, 'N_1', 'nw');
        dim(k, A0, mk(1), 't', { cls: 'cons', side: 'right', dist: 1.3 });
        k.label(g.mid(A0, N1), 'r', 'w', small);
        k.frame(-185, -26, 270, e + D * Math.tan(alpha) + 25);
        k.fontScale(0.8);
      });
      k.step('protractor', 'At DP lay off the angle α = arctan(r / t) = ' + (alpha / D2R).toFixed(1) + '° above HL, towards VP. It cuts the vertical through VP at V_s, the vanishing point of the pitch line.', () => {
        k.line(VP, vert(k, VP), { cls: 'cons' });
        k.seg(DPr, Vs, { cls: 'cons' });
        k.point(Vs, 'V_s', 'ne');
        k.angle(DPr, Vs, VP, { label: 'α', r: 1.6, labelDist: 1.3 });
      });
      k.step('straightedge', 'Draw the pitch lines N₁ to V_s (left edge) and the corresponding line from the top of the right-hand riser to V_s.', () => {
        k.seg(N1, Vs, { cls: 'cons' }); k.seg(N1r, Vs, { cls: 'cons' });
      });
      k.step('dividers', 'Step the tread t off along GL to the left of A: the marks 1 … 5.', () => {
        idx.forEach(i => { k.dot(mk(i), { r: 0.7 }); k.tick(mk(i), k.pt(1, 0)); k.label(mk(i), String(i), 's', small); });
      });
      k.step('straightedge', 'Draw the floor line AVP at the left edge, and join each mark to DP. The 45° line from mark i cuts AVP at G_i, the depth i·t.', () => {
        k.seg(A0, VP, { cls: 'cons' });
        idx.forEach(i => { k.seg(mk(i), DPr, { cls: 'cons' }); k.dot(G(i), { r: 0.7 }); });
      });
      k.step('square', 'Raise a vertical at each of G₀ = A, G₁ … G₅ up to the pitch line: the points N₁ … N₅ are the nosings (front edges) of the treads.', () => {
        for (let i = 1; i <= n; i++) k.seg(G(i - 1), N(i), { cls: 'cons' });
        k.point(N(n), 'N_' + n, 'nw', { lo: { size: 0.8 } });
      });
      k.step('straightedge', 'From each nosing N_i draw the edge of the tread to VP; it meets the vertical through G_i at M_i, the back of the tread.', () => {
        idx.forEach(i => k.seg(N(i), Mm(i), { cls: 'thick' }));
      });
      k.step('tee', 'With the T-square carry the nosings and the backs of the treads across to the right-hand edge: the front edge N_iN′_i and the back edge M_iM′_i of each tread.', () => {
        idx.forEach(i => { k.seg(N(i), Nr(i), { cls: 'cons' }); k.seg(Mm(i), Mr(i), { cls: 'cons' }); });
      });
      k.step('pencil', 'Ink the stair: the risers (verticals), the treads and their right-hand edges. The left-hand side of the flight shows as a stepped profile.', () => {
        k.seg(A0, N1, { cls: 'thick' });
        idx.forEach(i => {
          k.seg(N(i), Nr(i), { cls: 'thick' }); k.seg(Nr(i), Mr(i), { cls: 'thick' }); k.seg(Mm(i), Mr(i), { cls: 'thick' });
          if (i < n) { k.seg(Mm(i), N(i + 1), { cls: 'thick' }); k.seg(Mr(i), Nr(i + 1), { cls: 'thick' }); }
        });
      });
      k.note('Check: the nosings N₁ … N₅ lie on one straight line through V_s, and so do the lower corners of the risers. Equal treads and equal risers give nosings that bunch towards the top just as the floor tiles bunch towards the horizon.', () => {
        k.seg(N(1), Vs, { cls: 'aux', dash: true });
      });
    }
  });
})();
