/* HYPER-PROJECTIONS · constructions/what-projection-is.js
 *
 *   wp-projectors             a point and a segment projected onto a plane seen edge-on: parallel projectors, then
 *                             projectors through a centre
 *   wp-centre-recedes         the centre of projection moved farther and farther away: the central images close in
 *                             on the parallel image
 *   wp-ray-to-picture         one ray at 60° from the axis put on a flat picture and on curved ones: rectilinear,
 *                             orthographic, equisolid, equidistant and stereographic radii found with ruler and compass
 *   wp-what-is-kept           five equally spaced points projected in parallel (still equal) and from a centre (no
 *                             longer equal, but with the same cross-ratio)
 *   wp-true-length-and-shape  a tilted plate: the plan shortens it by cos θ; swinging it flat gives its true length
 *                             and true shape
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------ wp-projectors */
  Hyper.construction({
    id: 'wp-projectors',
    title: 'Projecting a point and a segment onto a plane seen edge-on',
    tags: ['projectors', 'picture plane', 'parallel', 'central'],
    note: 'The picture plane π is drawn edge-on as a vertical line; everything happens in the plane of the page, which contains the whole segment AB and the centre O. In space the projectors fill a plane in the same way, so this drawing is the true section. Moving π to the left or right changes nothing in the parallel case except where the picture lies; in the central case it changes only the scale of the picture.',
    build(k) {
      const g = k.g;
      const A = k.pt(110, 140), B = k.pt(180, 50), O = k.pt(-260, 100);
      const d = g.unit(k.pt(-1, -0.25));
      const hit = (P, dir) => g.lineLine(P, g.add(P, dir), k.pt(0, 0), k.pt(0, 1));
      const Ap = hit(A, d), Bp = hit(B, d);
      const Ac = hit(A, g.sub(A, O)), Bc = hit(B, g.sub(B, O));
      const lenAB = g.dist(A, B), lenP = g.dist(Ap, Bp), lenC = g.dist(Ac, Bc);

      k.given('The picture plane π seen edge-on, the segment AB (the point A and the point B) in front of it, the centre O on the far side, and the direction d of the parallel projectors.', () => {
        k.seg(k.pt(0, -25), k.pt(0, 175), { cls: 'given', width: 3.2 });
        k.label(k.pt(0, 175), 'π  (the picture plane, edge-on)', 'e', { upright: true, size: 0.8 });
        k.seg(A, B, { cls: 'given' });
        k.point(A, 'A', 'ne'); k.point(B, 'B', 'se');
        k.point(O, 'O', 'nw');
        k.label(O, 'the centre', 'se', { upright: true, size: 0.75, dist: 1.2 });
        const t0 = k.pt(150, 10), t1 = g.add(t0, g.mul(d, 48));
        k.arrow(t0, t1, { cls: 'given' });
        k.label(g.mid(t0, t1), 'd', 'n', { dist: 0.9 });
        k.frame(-285, -62, 235, 195);
      });
      k.step('square', 'Parallel projectors. Through A draw a line in the direction d, and through B the parallel to it: slide the set square along the ruler. They are the projectors; each runs on to meet π.', () => {
        k.seg(A, Ap, { cls: 'cons' }); k.seg(B, Bp, { cls: 'cons' });
        k.head(g.lerp(A, Ap, 0.6), d, { size: 0.9 }); k.head(g.lerp(B, Bp, 0.6), d, { size: 0.9 });
      });
      k.step('pencil', 'Where the projectors meet π are the images A′ and B′ (the feet). The segment A′B′ is the parallel projection of AB.', () => {
        k.point(Ap, 'A′', 'w'); k.point(Bp, 'B′', 'w');
        k.seg(Ap, Bp, { cls: 'red', width: 3.4 });
      });
      k.step('straightedge', 'Central projectors. Lay the straightedge on O and A and draw the line on to π; do the same through B. All projectors now pass through the one point O.', () => {
        k.seg(O, A, { cls: 'cons' }); k.seg(O, B, { cls: 'cons' });
      });
      k.step('pencil', 'The feet A″ and B″ are the images from O. The segment A″B″ is the central projection of AB — a different picture of the same segment.', () => {
        k.point(Ac, 'A″', 'e'); k.point(Bc, 'B″', 'e');
        k.seg(Ac, Bc, { cls: 'green', width: 3.4 });
      });
      k.note('Compare the three lengths: the segment itself ' + lenAB.toFixed(0) + ', its parallel image ' + lenP.toFixed(0) + ' (shortened, because AB is tilted to π), its central image ' + lenC.toFixed(0) + ' (smaller still, because the segment lies farther from O than π does).', () => {
        k.text(-270, -14, 'AB = ' + lenAB.toFixed(0), { anchor: 'start', size: 0.85, upright: true });
        k.text(-270, -32, 'A′B′ = ' + lenP.toFixed(0) + '  (parallel image)', { anchor: 'start', size: 0.85, upright: true, fill: '#b03a2e' });
        k.text(-270, -50, 'A″B″ = ' + lenC.toFixed(0) + '  (central image)', { anchor: 'start', size: 0.85, upright: true, fill: '#2d7a3a' });
      });
    }
  });

  /* ------------------------------------------------------------------ wp-centre-recedes */
  Hyper.construction({
    id: 'wp-centre-recedes',
    title: 'Moving the centre away: central projection turns into parallel',
    tags: ['central', 'parallel', 'limit'],
    note: 'The centre runs along the dashed line in the direction d. As it goes farther away the rays from it to A and to B swing round towards the direction d, and the images A″B″ on π approach the parallel image. At infinity the rays are parallel: the parallel projection is the limit of central projection as the centre recedes. The same happens with the sun, which is so far away that its rays can be taken as parallel.',
    build(k) {
      const g = k.g;
      const A = k.pt(110, 140), B = k.pt(180, 50);
      const d = g.unit(k.pt(-1, -0.25));
      const C0 = k.pt(-130, 55);
      const hit = (P, dir) => g.lineLine(P, g.add(P, dir), k.pt(0, 0), k.pt(0, 1));
      const centre = s => g.add(C0, g.mul(d, s));
      const S = [0, 150, 450];
      const imgs = S.map(s => { const O = centre(s); return [hit(A, g.sub(A, O)), hit(B, g.sub(B, O))]; });
      const par = [hit(A, d), hit(B, d)];
      const lens = imgs.map(p => g.dist(p[0], p[1])), lenPar = g.dist(par[0], par[1]);
      const order = ['₁', '₂', '₃'];
      k.given('The picture plane π edge-on, the segment AB, the direction d, and the first position O₁ of the centre. The dashed line is the path the centre will take: it runs in the direction d.', () => {
        k.seg(k.pt(0, -40), k.pt(0, 160), { cls: 'given', width: 3.2 });
        k.label(k.pt(0, 160), 'π', 'ne', { upright: true });
        k.seg(A, B, { cls: 'given' });
        k.point(A, 'A', 'ne'); k.point(B, 'B', 'se');
        k.ray(C0, g.add(C0, g.mul(d, 50)), { cls: 'aux', dash: true, nobounds: true });
        k.point(C0, 'O₁', 'n');
        const t0 = k.pt(60, 160), t1 = g.add(t0, g.mul(d, 44));
        k.arrow(t0, t1, { cls: 'given' }); k.label(g.mid(t0, t1), 'd', 'n', { dist: 0.9 });
        k.frame(-300, -50, 215, 180);
      });
      S.forEach((s, i) => {
        const O = centre(s), P = imgs[i];
        const text = i === 0
          ? 'Join O₁ to A and to B and extend the lines to π. The two feet are the central image of AB from O₁ (image 1): it is ' + lens[0].toFixed(0) + ' long.'
          : i === 1
            ? 'Move the centre to O₂ (the dividers carry the distance along the dashed line, ' + s + ' units from O₁) and repeat. The rays are less spread and the image (image 2) is longer, ' + lens[1].toFixed(0) + '.'
            : 'Take O₃ much farther away, ' + s + ' units from O₁ and off the page; draw the same two lines, which can only be drawn from their direction. They are almost parallel and the image (image 3) is ' + lens[2].toFixed(0) + ' long.';
        k.step('straightedge', text, () => {
          const far = O.x < -300;
          if (!far) k.point(O, 'O' + order[i], 'n');
          k.seg(O, A, { cls: 'cons', nobounds: true }); k.seg(O, B, { cls: 'cons', nobounds: true });
          k.point(P[0], null); k.point(P[1], null);
        });
      });
      k.step('square', 'At infinity the rays are parallel to d. Draw through A and through B the lines parallel to d (slide the set square along the ruler); they meet π at the two feet. This is the parallel projection (image ∞), and it is ' + lenPar.toFixed(0) + ' long.', () => {
        k.seg(A, par[0], { cls: 'cons' }); k.seg(B, par[1], { cls: 'cons' });
        k.point(par[0], null); k.point(par[1], null);
        k.seg(par[0], par[1], { cls: 'red', width: 3.4 });
      });
      k.note('The lengths of the image on π: ' + lens.map((l, i) => 'A' + order[i] + 'B' + order[i] + ' = ' + l.toFixed(0)).join(', ') + ', and in the limit ' + lenPar.toFixed(0) + '. The centre goes to infinity; the picture settles down.', () => {
        const all = imgs.concat([par]);
        all.forEach((P, i) => {
          const x = -20 - 18 * i, cls = i === 3 ? 'red' : 'curve';
          k.seg(k.pt(x, P[0].y), k.pt(x, P[1].y), { cls, width: 2.4 });
          k.seg(k.pt(x, P[0].y), k.pt(0, P[0].y), { cls: 'aux', dotted: true });
          k.seg(k.pt(x, P[1].y), k.pt(0, P[1].y), { cls: 'aux', dotted: true });
          k.text(x, Math.max(P[0].y, P[1].y) + 9, i === 3 ? '∞' : String(i + 1), { size: 0.8, upright: true });
        });
        k.text(-290, -20, 'image 1: ' + lens[0].toFixed(0) + '    image 2: ' + lens[1].toFixed(0), { anchor: 'start', size: 0.8, upright: true });
        k.text(-290, -37, 'image 3: ' + lens[2].toFixed(0) + '    parallel: ' + lenPar.toFixed(0), { anchor: 'start', size: 0.8, upright: true });
      });
    }
  });

  /* ------------------------------------------------------------------ wp-ray-to-picture */
  Hyper.construction({
    id: 'wp-ray-to-picture',
    title: 'One ray, five pictures: flat and curved picture surfaces',
    tags: ['fisheye', 'rectilinear', 'stereographic', 'equidistant', 'equisolid', 'orthographic'],
    note: 'The eye is at O at the centre of a sphere of directions of radius f (the focal length). The flat picture plane touches the sphere at T. A ray at angle θ from the axis meets the sphere at P; the five ways of putting P on the plane differ in how they move P to the plane. Rectilinear: along the ray itself (straight lines stay straight). Orthographic: straight up. Equisolid: swinging the chord TP flat. Equidistant: rolling the arc TP out along the plane. Stereographic: from the opposite pole S. The radii are f tan θ, f sin θ, 2f sin(θ/2), f θ and 2f tan(θ/2).',
    build(k) {
      const g = k.g, f = 100, th = 60 * Math.PI / 180;
      const O = k.pt(0, 0), T = k.pt(0, f), S = k.pt(0, -f);
      const P = g.polar(O, f, Math.PI / 2 - th);
      const onPlane = x => k.pt(x, f);
      const xr = f * Math.tan(th), xo = f * Math.sin(th), xe = 2 * f * Math.sin(th / 2), xd = f * th, xs = 2 * f * Math.tan(th / 2);
      const tag = (x, row, text) => {
        const y = f + 16 + 16 * row;
        k.seg(onPlane(x), k.pt(x, y - 5), { cls: 'aux', dotted: true });
        k.text(x, y, text, { size: 0.78, upright: true });
      };
      k.given('The eye O at the centre of a circle of radius f = 100 (a section of the sphere of directions), the picture plane touching it at T, the axis OT, and a ray OP at θ = 60° from the axis. P is where the ray meets the sphere.', () => {
        k.circle(O, f, { cls: 'given' });
        k.seg(k.pt(-70, f), k.pt(190, f), { cls: 'given', width: 2.6 });
        k.point(O, 'O', 'sw'); k.point(T, 'T', 'nw'); k.point(S, 'S', 'sw'); k.point(P, 'P', 'e');
        k.seg(O, T, { cls: 'cons', dash: true });
        k.seg(O, P, { cls: 'given' });
        k.angle(O, P, T, { label: 'θ', r: 2.4 });
        k.label(k.pt(-70, f), 'picture plane', 'nw', { upright: true, size: 0.75 });
        k.frame(-125, -115, 195, 195);
      });
      k.step('straightedge', 'Rectilinear picture, the flat window. Extend the ray OP until it meets the picture plane at R. OR is the line of sight itself: this is the perspective of a camera, with TR = f tan θ = ' + xr.toFixed(1) + ', growing without limit as θ goes to 90°.', () => {
        k.seg(P, onPlane(xr), { cls: 'cons' });
        k.point(onPlane(xr), 'R', 'se'); tag(xr, 4, 'R  rectilinear ' + xr.toFixed(0));
      });
      k.step('square', 'Orthographic picture. From P draw a line perpendicular to the plane (set square on the T-square) and mark where it meets the plane at Q_o: TQ_o = f sin θ = ' + xo.toFixed(1) + '. The edge of the sphere is crowded together.', () => {
        k.seg(P, onPlane(xo), { cls: 'cons' });
        k.point(onPlane(xo), null); tag(xo, 0, 'Q_o  orthographic ' + xo.toFixed(0));
      });
      k.step('compass', 'Equisolid picture. Put the compass point on T and open it to the chord TP; swing an arc down to the plane. It lands at Q_e, where TQ_e = TP = 2f sin(θ/2) = ' + xe.toFixed(1) + '. Equal areas of sky get equal areas of picture.', () => {
        k.arc3(T, P, onPlane(xe), { cls: 'cons' });
        k.seg(T, P, { cls: 'cons', dash: true });
        k.point(onPlane(xe), null); tag(xe, 1, 'Q_e  equisolid ' + xe.toFixed(0));
      });
      k.step('straightedge', 'Stereographic picture. From the opposite pole S draw a line through P to the plane, meeting it at Q_s: TQ_s = 2f tan(θ/2) = ' + xs.toFixed(1) + '. Circles on the sphere stay circles in the picture, and angles are true.', () => {
        const Q = onPlane(xs);
        k.seg(S, Q, { cls: 'cons' });
        k.point(Q, null); tag(xs, 3, 'Q_s  stereographic ' + xs.toFixed(0));
      });
      k.step('dividers', 'Equidistant picture. Divide the arc TP into five equal steps with the dividers and step the same opening five times along the plane from T. The arc is rolled out: TQ_d = f θ = ' + xd.toFixed(1) + ' and every angle from the axis keeps its own length of picture.', () => {
        for (let i = 1; i <= 5; i++) {
          const a = th * i / 5;
          k.dot(g.polar(O, f, Math.PI / 2 - a), { r: 0.6 });
          if (i < 5) k.dot(onPlane(f * a), { r: 0.6 });
        }
        k.arc3(O, P, T, { cls: 'cons' });
        k.point(onPlane(xd), null); tag(xd, 2, 'Q_d  equidistant ' + xd.toFixed(0));
      });
      k.note('The five pictures of the same ray, along the plane from the axis: orthographic ' + xo.toFixed(0) + ', equisolid ' + xe.toFixed(0) + ', equidistant ' + xd.toFixed(0) + ', stereographic ' + xs.toFixed(0) + ', rectilinear ' + xr.toFixed(0) + '. At small angles they all agree; the farther from the axis, the more they part.', () => {
        k.seg(onPlane(0), onPlane(xr), { cls: 'curve', width: 2.4 });
        [xo, xe, xd, xs, xr].forEach(x => k.tick(onPlane(x), k.pt(1, 0), { size: 1.4 }));
      });
    }
  });

  /* ------------------------------------------------------------------ wp-what-is-kept */
  Hyper.construction({
    id: 'wp-what-is-kept',
    title: 'Equal divisions under parallel and under central projection',
    tags: ['ratio', 'cross-ratio', 'parallel', 'central'],
    note: 'A line AE divided into four equal parts is projected onto the picture line m. With parallel projectors the four parts stay equal (a ratio along a line is kept, and so is parallelism). From a centre they do not: the parts grow along the line. What does survive in both is the cross-ratio of four points, (AC·BD)/(BC·AD): here it is the same number for the original points and for both sets of images.',
    build(k) {
      const g = k.g;
      const A = k.pt(20, 70), E = k.pt(240, 190), O = k.pt(150, 330);
      const d = g.unit(k.pt(0.35, -1));
      const pts = [0, 1, 2, 3, 4].map(i => g.lerp(A, E, i / 4));
      const names = ['A', 'B', 'C', 'D', 'E'];
      const m0 = k.pt(-60, 0), m1 = k.pt(390, 0);
      const toM = (P, dir) => g.lineLine(P, g.add(P, dir), m0, m1);
      const par = pts.map(P => toM(P, d));
      const cen = pts.map(P => toM(P, g.sub(P, O)));
      const cr = a => ((a[2] - a[0]) * (a[3] - a[1])) / ((a[2] - a[1]) * (a[3] - a[0]));
      const crTrue = cr([0, 1, 2, 3]), crPar = cr(par.slice(0, 4).map(p => p.x)), crCen = cr(cen.slice(0, 4).map(p => p.x));
      const spP = par.slice(1).map((p, i) => g.dist(p, par[i])), spC = cen.slice(1).map((p, i) => g.dist(p, cen[i]));
      k.given('The line l with its ends A and E, the picture line m, the centre O (a lamp above the line) and the direction d of the parallel projectors.', () => {
        k.seg(A, E, { cls: 'given' });
        k.point(A, 'A', 'nw'); k.point(E, 'E', 'ne');
        k.seg(m0, m1, { cls: 'given', width: 2.6 });
        k.label(m1, 'm', 'ne', { upright: true });
        k.point(O, 'O', 'ne');
        const t0 = k.pt(330, 300), t1 = g.add(t0, g.mul(d, 50));
        k.arrow(t0, t1, { cls: 'given' }); k.label(g.mid(t0, t1), 'd', 'e', { dist: 0.9 });
        k.frame(-70, -95, 400, 345);
      });
      k.step('dividers', 'Divide AE into four equal parts: open the dividers to a quarter of AE by trial and step it along l from A. Label the division points B, C, D.', () => {
        [1, 2, 3].forEach(i => k.point(pts[i], names[i], 'nw'));
      });
      k.step('square', 'Parallel projectors. Through each of the five points draw a line in the direction d down to m (slide the set square along the ruler).', () => {
        pts.forEach((P, i) => k.seg(P, par[i], { cls: 'cons' }));
      });
      k.step('pencil', 'Mark the feet A′, B′, C′, D′, E′ on m. Check with the dividers: the four spaces are equal, ' + spP[0].toFixed(1) + ' each. A ratio of lengths along a line is kept.', () => {
        par.forEach((P, i) => k.point(P, names[i] + '′', 's'));
        par.forEach((P, i) => { if (i) k.seg(par[i - 1], P, { cls: 'red', width: 3.2 }); });
      });
      k.step('straightedge', 'Central projectors. Lay the straightedge on O and each of the five points in turn and draw the line down to m.', () => {
        pts.forEach((P, i) => k.seg(O, cen[i], { cls: 'cons' }));
      });
      k.step('pencil', 'Mark the feet A″ … E″. The spaces are now ' + spC.map(s => s.toFixed(0)).join(', ') + ': unequal, growing away from A. Equal divisions are not kept by central projection.', () => {
        cen.forEach((P, i) => { k.point(P, null); k.seg(P, k.pt(P.x, -44), { cls: 'aux', dotted: true }); k.text(P.x, -53, names[i] + '″', { size: 0.9 }); });
        cen.forEach((P, i) => { if (i) k.seg(cen[i - 1], P, { cls: 'green', width: 3.2 }); });
      });
      k.note('Yet the cross-ratio (AC·BD)/(BC·AD) of the four points A, B, C, D is ' + crTrue.toFixed(4) + ' on l, ' + crPar.toFixed(4) + ' on the parallel image and ' + crCen.toFixed(4) + ' on the central image: the one quantity every projection of a line keeps.', () => {
        k.text(-60, -84, 'cross-ratio  l: ' + crTrue.toFixed(3) + '    parallel: ' + crPar.toFixed(3) + '    central: ' + crCen.toFixed(3), { anchor: 'start', size: 0.8, upright: true });
      });
    }
  });

  /* ------------------------------------------------------------------ wp-true-length-and-shape */
  Hyper.construction({
    id: 'wp-true-length-and-shape',
    title: 'A tilted plate: its plan and its true length and shape',
    tags: ['true length', 'true shape', 'rabatment', 'plan', 'fold line'],
    note: 'The sheet is the fold-line drawing of Monge: the front view above the line xy, the plan below it. The plate is a rectangle L × W whose width W runs away from the viewer, so the front view shows it edge-on as the line AB. In the plan its length is only L cos θ, but its width is untouched. Swinging the plate flat about its lower edge (rabatment) shows its true shape, which is the plan stretched by 1/cos θ along the slope and not at all across it.',
    build(k) {
      const g = k.g, L = 160, W = 90, d0 = 25, th = 40 * Math.PI / 180;
      const A = k.pt(0, 0), B = g.polar(A, L, th), B1 = k.pt(L, 0);
      const Bp = k.pt(B.x, 0);
      const planY0 = -d0, planY1 = -d0 - W;
      k.given('The front view above the fold line xy: the plate seen edge-on as AB, of true length L = 160, rising at θ = 40° from A. Its width W = 90 runs away from you, starting 25 behind the front plane (this is data for the plan below).', () => {
        k.seg(k.pt(-35, 0), k.pt(205, 0), { cls: 'given' });
        k.label(k.pt(205, 0), 'x y', 'e', { upright: true });
        k.seg(A, B, { cls: 'given', width: 3.2 });
        k.point(A, 'A', 'nw'); k.point(B, 'B', 'ne');
        k.angle(A, B1, B, { label: 'θ', r: 2.2 });
        k.label(g.mid(A, B), 'L', 'nw', { dist: 1 });
        const w0 = k.pt(215, -d0), w1 = k.pt(215, -d0 - W);
        k.seg(w0, w1, { cls: 'given' }); k.tick(w0, k.pt(1, 0)); k.tick(w1, k.pt(1, 0)); k.label(g.mid(w0, w1), 'W', 'e', { dist: 1 });
        k.frame(-45, -140, 235, 125);
      });
      k.step('square', 'Drop the projectors from A and from B perpendicular to xy (set square against the T-square), far enough to enter the plan. B comes down to B′ on xy.', () => {
        k.seg(B, k.pt(B.x, planY1 - 8), { cls: 'cons' });
        k.seg(A, k.pt(A.x, planY1 - 8), { cls: 'cons' });
        k.point(Bp, "B′", 'se');
      });
      k.step('dividers', 'Carry the distances 25 and 25 + 90 from xy down the projector of A with the dividers: they fix the front and back edges of the plate in the plan.', () => {
        k.point(k.pt(0, planY0), 'a_1', 'w'); k.point(k.pt(0, planY1), 'a_2', 'w');
      });
      k.step('tee', 'Draw the two horizontals through those marks with the T-square, across to the projector of B.', () => {
        k.seg(k.pt(0, planY0), k.pt(B.x, planY0), { cls: 'cons' }); k.seg(k.pt(0, planY1), k.pt(B.x, planY1), { cls: 'cons' });
      });
      k.step('pencil', 'Line in the plan of the plate: a rectangle ' + B.x.toFixed(0) + ' long (= L cos θ) and 90 wide. The plate is shortened along its slope; its width is true.', () => {
        [[k.pt(0, planY0), k.pt(B.x, planY0)], [k.pt(B.x, planY0), k.pt(B.x, planY1)], [k.pt(B.x, planY1), k.pt(0, planY1)], [k.pt(0, planY1), k.pt(0, planY0)]].forEach(([p, q]) => k.seg(p, q, { cls: 'thick' }));
        k.dim(k.pt(0, planY1), k.pt(B.x, planY1), 'L cos θ = ' + B.x.toFixed(0), { side: 'right', dist: 1.3, upright: true, size: 0.75 });
      });
      k.step('compass', 'The true length. With centre A and radius AB draw an arc down to xy: it meets the line at B₁, and AB₁ = L = 160. The plate has been swung flat about its edge through A.', () => {
        k.arc3(A, B1, B, { cls: 'cons' });
        k.point(B1, 'B_1', 'se');
      });
      k.step('square', 'Drop the projector from B₁ into the plan and complete the rectangle with the two horizontals: the dashed rectangle ' + L + ' × ' + W + ' is the true shape of the plate.', () => {
        k.seg(B1, k.pt(B1.x, planY1), { cls: 'cons' });
        k.seg(k.pt(B.x, planY0), k.pt(L, planY0), { cls: 'cons', dash: true }); k.seg(k.pt(B.x, planY1), k.pt(L, planY1), { cls: 'cons', dash: true });
        k.poly([k.pt(0, planY0), k.pt(L, planY0), k.pt(L, planY1), k.pt(0, planY1)], { close: true, cls: 'curve', dash: true });
      });
      k.note('True shape against plan: the width is the same, the length stretched by 1/cos θ = ' + (1 / Math.cos(th)).toFixed(3) + '. The plan has ' + (Math.cos(th) * 100).toFixed(0) + ' % of the true area.', () => {
        k.hatch([k.pt(0, planY0), k.pt(B.x, planY0), k.pt(B.x, planY1), k.pt(0, planY1)], { angle: Math.PI / 4, gap: 1.1 });
      });
    }
  });
})();
