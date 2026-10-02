/* HYPER-PROJECTIONS · constructions/map-fundamentals.js — the hand constructions of "What a map can keep".
 *
 *   mf-orange-peel               one gore of the globe from the sinusoidal formula, point by point; why gores will not close
 *   mf-tissot-ellipse            Tissot's indicatrix at a point drawn from the scales h and k (auxiliary circles) and the angle ω
 *   mf-conformal-vs-equal-area   a conformal strip (Mercator) beside an equal-area strip (Lambert) of the same parallel band
 *   mf-archimedes-cylinder       the equal-area cylinder: horizontal projection from the axis (Archimedes' hat-box theorem)
 *   mf-equidistant-from-a-city   an azimuthal equidistant map by bearings and distances from one city
 *   mf-miller-compromise         a compromise made by hand: Miller's squeezed Mercator between the plate carrée and Mercator
 *   mf-three-surfaces            cylinder, cone and plane touching the sphere, the apex of the cone found by a tangent
 *   mf-cone-unroll               the tangent cone unrolled into a sector of angle 2π sin φ₁
 *   mf-secant-cone               a cone cutting the sphere along two standard parallels, and its sector
 *   mf-scale-factor              the scale along a parallel of a secant cylinder, read from the side view by a fourth proportional
 *   mf-aspects-cylinder          the same cylinder normal, oblique and transverse, in side view
 *   mf-gc-rhumb                  a great circle and a rhumb line between two cities on a stereographic globe and a Mercator strip
 *   mf-decision-table            choosing a projection: purpose and region as boxes and arrows
 * Every number is computed (k.g and the engine in k.proj); every step names the tool it is made with.
 */
(function () {
  'use strict';
  const D = Math.PI / 180;

  Hyper.construction({
    id: 'mf-orange-peel',
    title: 'The orange peel: one gore of the globe, and why gores will not close',
    tags: ['gores', 'sinusoidal', 'compass', 'protractor'],
    note: 'Peel an orange along its meridians and each strip (a **gore**) is a pointed leaf: its width at latitude φ is the width at the equator times cos φ. That is the outline of the sinusoidal projection of one gore, found here point by point with a compass: the horizontal distance of a point of a circle from its vertical diameter is the radius times the cosine of the angle. Laid side by side, two gores touch only at the equator; the gap that opens towards the poles is the curvature of the sphere, and no stretching of paper that has not been torn can close it.',
    build(k) {
      const g = k.g, R = 100, half = 30, w = R * half * D, poleY = R * Math.PI / 2;
      const lats = [15, 30, 45, 60, 75];
      const O = k.pt(0, 0), Np = k.pt(0, poleY), Sp = k.pt(0, -poleY);
      const M = p => k.pt(0, R * p * D);
      const C = p => k.pt(w * Math.cos(p * D), w * Math.sin(p * D));
      const E = p => k.pt(w * Math.cos(p * D), R * p * D);
      const E2 = p => k.pt(-w * Math.cos(p * D), R * p * D);
      const all = []; lats.forEach(p => { all.push(p, -p); });
      k.given('The central meridian of the gore, a straight line from pole to pole of length πR, and the equator through O. The gore is 60° wide, so at the equator its half-width is w = R × 30° (in radians) = 52.4.', () => {
        k.seg(Sp, Np, { cls: 'given' });
        k.seg(k.pt(-w, 0), k.pt(w, 0), { cls: 'given' });
        k.point(O, 'O', 'sw'); k.point(Np, 'N', 'ne'); k.point(Sp, 'S', 'se');
        k.dim(O, k.pt(w, 0), 'w', { side: 'right', dist: 0.9 });
        k.frame(-w * 1.35, -poleY * 1.08, w * 3.45, poleY * 1.08);
      });
      k.step('dividers', 'Set the dividers to the arc of 15° on the meridian, R × 15° = 26.2, and step it off from O six times upwards and six times downwards: the marks are the parallels, and the sixth is the pole.', () => {
        all.forEach(p => { k.dot(M(p), { r: 0.7 }); k.label(M(p), p > 0 ? p + '°' : '−' + (-p) + '°', 'e', { upright: true, size: 0.7, dist: 0.5, bg: true }); });
      });
      k.step('compass', 'With centre O and radius w draw the half-circle to the right of the meridian. It is only a helper: its horizontal distances from the meridian are w cos φ.', () => {
        k.arc(O, w, -Math.PI / 2, Math.PI / 2, { cls: 'cons' });
      });
      k.step('protractor', 'On the half-circle mark the angles 15°, 30°, 45°, 60° and 75° above and below the equator, measured at O.', () => {
        all.forEach(p => { k.seg(O, C(p), { cls: 'cons' }); k.dot(C(p), { r: 0.7 }); });
        k.angle(O, k.pt(w, 0), C(45), { label: '45°', r: 1.5, labelDist: 1.25 });
      });
      k.step('square', 'Through each mark on the half-circle draw a vertical with the set square, up (or down) to the level of the parallel of the same latitude.', () => {
        all.forEach(p => k.seg(C(p), E(p), { cls: 'cons' }));
      });
      k.step('tee', 'With the T-square draw each parallel from its mark on the central meridian to the vertical of the same latitude. Where they meet is a point E of the right-hand edge of the gore.', () => {
        all.forEach(p => { k.seg(M(p), E(p), { cls: 'cons' }); k.dot(E(p), { r: 0.8 }); });
        k.label(E(45), 'E_{45}', 'ne', { size: 0.8 });
      });
      k.step('dividers', 'Carry each half-width M–E to the left of the meridian: the points of the left-hand edge.', () => {
        all.forEach(p => { k.seg(M(p), E2(p), { cls: 'cons' }); k.dot(E2(p), { r: 0.8 }); });
      });
      k.step('pencil', 'Trace both edges through the points, from pole to pole: the gore. Its width is 2w cos φ at latitude φ, so it ends in a point at each pole.', () => {
        k.curve(t => [w * Math.cos(t), R * t], [-Math.PI / 2, Math.PI / 2], { cls: 'curve', n: 90 });
        k.curve(t => [-w * Math.cos(t), R * t], [-Math.PI / 2, Math.PI / 2], { cls: 'curve', n: 90 });
      });
      k.note('A second gore, dashed, beside the first. They touch at the equator only; the shaded wedges are the gap, 2w(1 − cos φ) wide at latitude φ. To close it the paper would have to stretch every parallel by 1/cos φ: infinitely at the poles.', () => {
        const gore2 = sgn => k.curve(t => [2 * w + sgn * w * Math.cos(t), R * t], [-Math.PI / 2, Math.PI / 2], { cls: 'aux', dash: true, n: 90 });
        gore2(1); gore2(-1);
        k.seg(k.pt(2 * w, -poleY), k.pt(2 * w, poleY), { cls: 'aux', dash: true });
        [1, -1].forEach(s => {
          const pts = [];
          for (let i = 0; i <= 24; i++) { const t = (Math.PI / 2) * i / 24; pts.push(k.pt(w * Math.cos(t), s * R * t)); }
          for (let i = 24; i >= 0; i--) { const t = (Math.PI / 2) * i / 24; pts.push(k.pt(2 * w - w * Math.cos(t), s * R * t)); }
          k.hatch(pts, { angle: Math.PI / 4, gap: 0.55, outline: false, stroke: '#b03a2e' });
        });
        k.text(w, poleY * 0.8, 'gap', { upright: true, size: 0.9, fill: '#b03a2e', bg: true });
        k.text(w, -poleY * 0.8, 'gap', { upright: true, size: 0.9, fill: '#b03a2e', bg: true });
        k.text(w + 8, -14, 'touch here', { upright: true, size: 0.7, anchor: 'start', bg: true });
      });
    }
  });

  Hyper.construction({
    id: 'mf-tissot-ellipse',
    title: "Tissot's indicatrix at a point, drawn from the scales h and k",
    tags: ['Tissot', 'ellipse', 'auxiliary circles', 'compass'],
    note: 'Where the meridian and the parallel meet at right angles on the map, the indicatrix has its axes along them, and its semi-axes are the scales: a = k r along the parallel, b = h r along the meridian (the larger is the major axis). The numbers drawn here are those of the Lambert cylindrical equal-area map at latitude 60°: h = cos 60° = 0.5, k = sec 60° = 2, so a·b = r² and the area is kept while the shape is squashed to a ratio 4 : 1. The ellipse is found by the **two-circle (auxiliary circle) method**: a ray from P cuts a circle of radius a and a circle of radius b; the vertical through the first and the horizontal through the second meet on the ellipse.',
    build(k) {
      const g = k.g, r = 36, hh = 0.5, kk = 2, a = kk * r, b = hh * r;
      const C0 = k.pt(-105, 0), P = k.pt(70, 0);
      const ang = [35, 60, 80];
      k.fontScale(0.8);
      const Mi = t => k.pt(P.x + a * Math.cos(t * D), P.y + a * Math.sin(t * D));
      const Ni = t => k.pt(P.x + b * Math.cos(t * D), P.y + b * Math.sin(t * D));
      const Ei = t => k.pt(P.x + a * Math.cos(t * D), P.y + b * Math.sin(t * D));
      k.given('At P the parallel (horizontal) and the meridian (vertical) cross at right angles. The scale along the parallel is k = 2, along the meridian h = 0.5. On the left, a circle of radius r on the globe, drawn at the scale of the equator: the circle whose image we want.', () => {
        k.circle(C0, r, { cls: 'given' }); k.dot(C0);
        k.seg(C0, k.pt(C0.x + r, 0), { cls: 'cons' });
        k.label(k.pt(C0.x + r / 2, 0), 'r', 's', { size: 0.9, dist: 0.5 });
        k.seg(k.pt(P.x - 1.5 * a, 0), k.pt(P.x + 1.5 * a, 0), { cls: 'cons' });
        k.seg(k.pt(P.x, -1.25 * a), k.pt(P.x, 1.25 * a), { cls: 'cons' });
        k.point(P, 'P', 'sw');
        k.text(P.x + 1.5 * a + 6, 0, 'parallel: k = 2', { upright: true, size: 0.8, anchor: 'start' });
        k.text(P.x + 4, 1.25 * a + 10, 'meridian: h = 0.5', { upright: true, size: 0.8, anchor: 'start' });
        k.text(C0.x, -r - 14, 'circle on the globe', { upright: true, size: 0.8 });
        k.frame(-185, -1.5 * a, P.x + 1.5 * a + 100, 1.25 * a + 24);
      });
      const A1 = k.pt(P.x + a, 0), A2 = k.pt(P.x - a, 0), B1 = k.pt(P.x, b), B2 = k.pt(P.x, -b);
      k.step('ruler', 'On the parallel lay off P to A and P to A′ equal to k r = 72 on each side; on the meridian lay off P to B and P to B′ equal to h r = 18.', () => {
        k.point(A1, 'A', 'e'); k.point(A2, 'A′', 'w'); k.point(B1, 'B', 'nw'); k.point(B2, 'B′', 'sw');
      });
      k.step('compass', 'With centre P draw the large circle through A and A′ (radius a = 72) and the small circle through B and B′ (radius b = 18).', () => {
        k.circle(P, a, { cls: 'cons' }); k.circle(P, b, { cls: 'cons' });
      });
      k.step('protractor', 'From P draw three rays, at 35°, 60° and 80° to the parallel. Each cuts the large circle at M and the small one at a point N (a dot).', () => {
        ang.forEach((t, i) => { k.seg(P, Mi(t), { cls: 'cons' }); k.point(Mi(t), 'M_' + (i + 1), { at: 'ne', lo: { size: 0.8 } }); k.dot(Ni(t), { r: 0.8 }); });
      });
      k.step('square', 'Through each M draw a vertical and through the N of the same ray a horizontal. They cross at E: the point (a cos t, b sin t) of the indicatrix.', () => {
        ang.forEach(t => { k.seg(Mi(t), Ei(t), { cls: 'cons' }); k.seg(Ni(t), Ei(t), { cls: 'cons' }); });
        ang.forEach((t, i) => k.point(Ei(t), 'E_' + (i + 1), { at: 'se', lo: { size: 0.8 } }));
      });
      k.step('pencil', 'Draw the ellipse through A, E₃, E₂, E₁, B and by symmetry through the other three quadrants (a French curve helps near A, where it bends most).', () => {
        k.ellipse(P, a, b, { cls: 'curve' });
      });
      k.note('Both ellipses have the area of the circle (π r² = π a b, because k h = 1): the map keeps areas. The angles are not kept: lines at ±63.4° on the globe (angle 126.9° between them) come out at ±26.6° (angle 53.1°). That is the largest angular change, ω = 126.9° − 53.1° = 73.7°.', () => {
        const th = Math.atan(Math.sqrt(kk / hh));
        const d1 = g.dir(th), d2 = g.dir(-th);
        k.seg(g.sub(C0, g.mul(d1, r * 1.25)), g.add(C0, g.mul(d1, r * 1.25)), { cls: 'red', dash: true });
        k.seg(g.sub(C0, g.mul(d2, r * 1.25)), g.add(C0, g.mul(d2, r * 1.25)), { cls: 'red', dash: true });
        const u1 = g.dir(Math.atan(hh / kk * Math.tan(th))), u2 = g.dir(-Math.atan(hh / kk * Math.tan(th)));
        k.seg(g.sub(P, g.mul(u1, a * 1.1)), g.add(P, g.mul(u1, a * 1.1)), { cls: 'red', dash: true });
        k.seg(g.sub(P, g.mul(u2, a * 1.1)), g.add(P, g.mul(u2, a * 1.1)), { cls: 'red', dash: true });
        k.angle(C0, g.sub(C0, g.mul(d2, r)), g.sub(C0, g.mul(d1, r)), { label: '126.9°', r: 2.2, labelDist: 2.4, cls: 'red' });
        k.angle(P, g.sub(P, g.mul(u2, a)), g.sub(P, g.mul(u1, a)), { label: '53.1°', r: 2.4, labelDist: 1.4, cls: 'red' });
        k.text(P.x, -1.25 * a, 'ω = 126.9° − 53.1° = 73.7°', { upright: true, size: 0.9, anchor: 'middle' });
      });
    }
  });

  Hyper.construction({
    id: 'mf-conformal-vs-equal-area',
    title: 'A conformal strip beside an equal-area strip of the same band',
    tags: ['Mercator', 'Lambert', 'conformal', 'equal-area', 'cells'],
    note: 'Both strips show the same cells of the globe: 15° of longitude by 15° of latitude, from the equator to 60°. The meridians are the same on both. On the Mercator strip (left) the parallels are spaced by the integral of the secant, so every cell keeps its shape and the cells swell towards the pole. On the Lambert strip (right) the parallels are spaced by the sine, so every cell keeps its area and the cells flatten. At latitude 52.5° the Mercator cell is 1.65 times as high as wide, as on the globe; the Lambert cell is only 0.6 times as high as wide. Tables for R = 100: Mercator 26.5, 54.9, 88.1, 131.7; Lambert 25.9, 50.0, 70.7, 86.6.',
    build(k) {
      const R = 100, dW = R * 15 * D, lats = [0, 15, 30, 45, 60];
      const yM = p => R * Math.log(Math.tan(Math.PI / 4 + p * D / 2)), yL = p => R * Math.sin(p * D);
      const x0M = 0, x0L = 3 * dW + 60;
      k.given('Two equators, each with the central scale: 15° of longitude is R × 15° = 26.2 (take it with the dividers). The left strip will be Mercator, the right strip Lambert\'s cylindrical equal-area; both are drawn for R = 100.', () => {
        k.seg(k.pt(x0M, 0), k.pt(x0M + 3 * dW, 0), { cls: 'given' });
        k.seg(k.pt(x0L, 0), k.pt(x0L + 3 * dW, 0), { cls: 'given' });
        const gA = k.pt(x0M, -26), gB = k.pt(x0M + dW, -26);
        k.seg(gA, gB); k.tick(gA, k.pt(1, 0)); k.tick(gB, k.pt(1, 0)); k.dim(gA, gB, '15°', { dist: 1, size: 0.75 });
        k.text(x0M + 1.5 * dW, yM(60) + 16, 'Mercator: conformal', { upright: true, size: 0.85 });
        k.text(x0L + 1.5 * dW, yM(60) + 16, 'Lambert: equal-area', { upright: true, size: 0.85 });
        k.frame(-22, -40, x0L + 3 * dW + 22, yM(60) + 30);
      });
      k.step('dividers', 'Step off the 15° of longitude three times along each equator.', () => {
        for (let j = 0; j <= 3; j++) { k.dot(k.pt(x0M + j * dW, 0), { r: 0.6 }); k.dot(k.pt(x0L + j * dW, 0), { r: 0.6 }); }
      });
      k.step('tee', 'With the T-square and set square draw the four meridians of each strip: parallel verticals, equally spaced.', () => {
        for (let j = 0; j <= 3; j++) { k.seg(k.pt(x0M + j * dW, 0), k.pt(x0M + j * dW, yM(60)), { cls: 'cons' }); k.seg(k.pt(x0L + j * dW, 0), k.pt(x0L + j * dW, yL(60)), { cls: 'cons' }); }
      });
      k.step('ruler', 'Mark the parallels on the first meridian of each strip: Mercator at R ln tan(45° + φ/2) and Lambert at R sin φ, for φ = 15°, 30°, 45°, 60°.', () => {
        lats.slice(1).forEach(p => {
          k.dot(k.pt(x0M, yM(p)), { r: 0.6 }); k.label(k.pt(x0M, yM(p)), p + '°', 'w', { upright: true, size: 0.65, dist: 0.8 });
          k.dot(k.pt(x0L, yL(p)), { r: 0.6 }); k.label(k.pt(x0L, yL(p)), p + '°', 'w', { upright: true, size: 0.65, dist: 0.8 });
        });
      });
      k.step('tee', 'Draw the parallels across both strips. On the left they spread apart towards the pole; on the right they crowd together.', () => {
        lats.slice(1).forEach(p => { k.seg(k.pt(x0M, yM(p)), k.pt(x0M + 3 * dW, yM(p)), { cls: 'cons' }); k.seg(k.pt(x0L, yL(p)), k.pt(x0L + 3 * dW, yL(p)), { cls: 'cons' }); });
      });
      k.step('pencil', 'Line in the middle column of cells on each strip. Mercator cells are 26.2 wide and 26.5, 28.4, 33.2, 43.6 high: always the right shape. Lambert cells are 25.9, 24.1, 20.7, 15.9 high: always the right area.', () => {
        for (let i = 0; i < 4; i++) {
          k.rect(x0M + dW, yM(lats[i]), x0M + 2 * dW, yM(lats[i + 1]), { cls: 'curve' });
          k.rect(x0L + dW, yL(lats[i]), x0L + 2 * dW, yL(lats[i + 1]), { cls: 'curve' });
        }
      });
      k.note('A circle of 7 units on the globe at 37.5°N, 22.5°E: on Mercator it is a circle of radius 7 sec 37.5° = 8.8 (shape kept, area 1.6 times too large); on Lambert it is an ellipse 8.8 wide and 5.6 high, with exactly the area of the original circle.', () => {
        const rr = 7, sec = 1 / Math.cos(37.5 * D), cx = 22.5 * D * R;
        k.circle(k.pt(x0M + cx, yM(37.5)), rr * sec, { cls: 'red' });
        k.ellipse(k.pt(x0L + cx, yL(37.5)), rr * sec, rr * Math.cos(37.5 * D), { cls: 'red' });
      });
    }
  });

  Hyper.construction({
    id: 'mf-archimedes-cylinder',
    title: "The equal-area cylinder: Archimedes' horizontal projection",
    tags: ['Lambert', 'equal-area', 'cylinder', 'Archimedes'],
    note: "Archimedes showed that the area of a zone of a sphere between two parallel planes is 2πR times the distance between the planes, the same as the band of the circumscribed cylinder between them. So if every point of the sphere is carried **horizontally outward from the axis** onto the cylinder, a parallel at latitude φ lands at the height R sin φ and every zone keeps its area. Unrolled, the cylinder is Lambert's cylindrical equal-area map of 1772. Along the parallels the map is stretched by sec φ (the parallel of radius R cos φ becomes a line of length 2πR), so the meridians are kept equally spaced and the north–south scale shrinks to cos φ.",
    build(k) {
      const g = k.g, R = 100, lats = [15, 30, 45, 60, 75];
      const O = k.pt(0, 0), sx = 150, ex = sx + R * Math.PI / 2;
      const Pp = p => k.pt(R * Math.cos(p * D), R * Math.sin(p * D));
      const yL = p => R * Math.sin(p * D);
      k.given('The sphere seen from the side (a meridian section of radius R), its polar axis, the equator, and the cylinder that touches it along the equator: two verticals at distance R from the axis.', () => {
        k.circle(O, R, { cls: 'given' });
        k.seg(k.pt(0, -R * 1.12), k.pt(0, R * 1.12), { cls: 'axis', dash: true });
        k.seg(k.pt(-R * 1.1, 0), k.pt(R * 1.1, 0), { cls: 'given' });
        k.seg(k.pt(R, -R * 1.1), k.pt(R, R * 1.1), { cls: 'given' });
        k.seg(k.pt(-R, -R * 1.1), k.pt(-R, R * 1.1), { cls: 'given' });
        k.point(O, 'O', 'sw'); k.point(k.pt(0, R), 'N', 'nw');
        k.label(k.pt(R, R * 1.1), 'cylinder', 'ne', { upright: true, size: 0.75 });
        k.frame(-R * 1.2, -R * 1.2, ex + 95, R * 1.25);
      });
      k.step('protractor', 'At O lay off the latitudes 15°, 30°, 45°, 60° and 75° from the equator, and mark where each line meets the circle.', () => {
        lats.forEach(p => { k.seg(O, Pp(p), { cls: 'cons' }); k.dot(Pp(p), { r: 0.8 }); });
        k.angle(O, k.pt(1, 0), Pp(30), { label: '30°', r: 2.4, labelDist: 1.1 });
      });
      k.step('tee', 'Through each point of the circle draw a horizontal, from the axis out across the cylinder and on over the strip you are about to draw. This is the projection: each parallel lands at the height R sin φ.', () => {
        lats.forEach(p => k.seg(k.pt(0, yL(p)), k.pt(ex, yL(p)), { cls: 'cons' }));
      });
      k.step('dividers', 'Unroll the cylinder to the right as a strip. Step off the meridians along its equator, 30° of longitude = R × 30° = 52.4 apart, for 90° of longitude.', () => {
        for (let j = 0; j <= 3; j++) k.dot(k.pt(sx + j * R * 30 * D, 0), { r: 0.7 });
        k.seg(k.pt(sx, 0), k.pt(ex, 0), { cls: 'given' });
      });
      k.step('square', 'Draw the meridians as verticals through those marks, up to the top of the cylinder at the height R.', () => {
        for (let j = 0; j <= 3; j++) k.seg(k.pt(sx + j * R * 30 * D, 0), k.pt(sx + j * R * 30 * D, R), { cls: 'cons' });
      });
      k.step('pencil', 'Line in the equal-area map: the outline of the strip and the parallels at the heights found, 25.9, 50.0, 70.7, 86.6, 96.6.', () => {
        k.rect(sx, 0, ex, R, { cls: 'thick' });
        lats.forEach(p => k.seg(k.pt(sx, yL(p)), k.pt(ex, yL(p)), { cls: 'thick' }));
        k.label(k.pt(ex, 0), 'equator', 'e', { upright: true, size: 0.7 }); k.label(k.pt(ex, R), 'pole', 'e', { upright: true, size: 0.7 });
        lats.forEach(p => k.label(k.pt(sx, yL(p)), p + '°', 'w', { upright: true, size: 0.7, dist: 0.7, bg: true }));
      });
      k.note('The parallel of 30° is at height 50, half the way to the pole: it cuts the northern hemisphere into two zones of equal area (the strip splits into two equal bands). The stretching is sec φ along the parallels, cos φ along the meridians: the product is 1.', () => {
        const band = (y0, y1) => [k.pt(sx, y0), k.pt(ex, y0), k.pt(ex, y1), k.pt(sx, y1)];
        k.hatch(band(0, 50), { angle: Math.PI / 4, gap: 0.8, stroke: '#0b4fa0' });
        k.hatch(band(50, R), { angle: -Math.PI / 4, gap: 0.8, stroke: '#b03a2e' });
        k.text((sx + ex) / 2, 25, 'equal', { upright: true, size: 0.7, bg: true });
        k.text((sx + ex) / 2, 75, 'areas', { upright: true, size: 0.7, bg: true });
        [[0, 50], [50, R]].forEach(([y0, y1]) => {
          k.seg(k.pt(ex + 70, y0), k.pt(ex + 70, y1), { cls: 'cons' });
          k.dim(k.pt(ex + 70, y0), k.pt(ex + 70, y1), '50', { side: 'right', dist: 0.7, size: 0.7, ticks: true });
        });
      });
    }
  });

  Hyper.construction({
    id: 'mf-equidistant-from-a-city',
    title: 'An azimuthal equidistant map from Tel Aviv, by bearings and distances',
    tags: ['azimuthal equidistant', 'protractor', 'compass', 'bearing'],
    note: 'On a map centred on one place, every other place is plotted from two numbers: the **bearing** from the centre (an angle from north, laid off with the protractor) and the **great-circle distance** (laid off with the scale, at one fixed scale for all). That is the azimuthal equidistant projection. Distances and bearings from the centre are exact; distances between two other places are not. The scale here is 1 unit = 50 km. The last step overlays the coastlines computed by the engine through the same rule, to show that the plotted cities land where the map says.',
    build(k) {
      const g = k.g, Pj = k.proj, Wd = Hyper.world, s = 1 / 50;
      const home = Wd.city('Tel Aviv'), H0 = [home.lon, home.lat];
      const names = ['Rome', 'Moscow', 'London', 'Dubai', 'Mumbai', 'Nairobi', 'Cape Town', 'Beijing', 'Tokyo', 'New York'];
      const info = names.map(n => { const c = Wd.city(n), ll = [c.lon, c.lat]; const d = Pj.geo.distance(H0, ll), b = Pj.geo.bearing(H0, ll); return { n, d, b, pt: k.pt(s * d * Math.sin(b * D), s * d * Math.cos(b * D)), dir: ({ Rome: 'w', Moscow: 'e', London: 'nw', Dubai: 'se', Mumbai: 'e', Nairobi: 'e', 'Cape Town': 'w', Beijing: 'e', Tokyo: 'e', 'New York': 'w' })[n] }; });
      const O = k.pt(0, 0);
      k.given('The centre O (Tel Aviv), the direction of north, the scale (2000 km = 40 units, to be taken with the dividers) and the table of the ten cities with their bearing from Tel Aviv and their distance.', () => {
        k.point(O, 'Tel Aviv', { at: 'w', lo: { upright: true, size: 0.8, bg: true } });
        k.arrow(O, k.pt(0, 225), { cls: 'given' }); k.label(k.pt(0, 225), 'N', 'n', { upright: true, size: 0.9 });
        const gA = k.pt(-205, -225), gB = k.pt(-165, -225);
        k.seg(gA, gB); k.tick(gA, k.pt(1, 0)); k.tick(gB, k.pt(1, 0)); k.dim(gA, gB, '2000 km', { dist: 1.1, size: 0.75 });
        [['city', 245, 'start'], ['bearing', 400, 'end'], ['distance', 505, 'end']].forEach(([t, x, an]) => k.text(x, 205, t, { upright: true, size: 0.8, anchor: an, bold: true }));
        info.forEach((c, i) => { const y = 186 - i * 16, o = { upright: true, size: 0.75 }; k.text(245, y, c.n, Object.assign({ anchor: 'start' }, o)); k.text(400, y, Math.round(c.b) + '°', Object.assign({ anchor: 'end' }, o)); k.text(505, y, (Math.round(c.d / 10) * 10).toLocaleString('en-US') + ' km', Object.assign({ anchor: 'end' }, o)); });
        k.frame(-225, -240, 520, 245);
      });
      k.step('compass', 'Draw circles about O every 2000 km: radii 40, 80, 120, 160 and 200 units. Every place on one circle is the same distance from Tel Aviv.', () => {
        for (let j = 1; j <= 5; j++) { k.circle(O, 40 * j, { cls: 'cons' }); const ang = 235 * D; k.text(40 * j * Math.sin(ang), 40 * j * Math.cos(ang), (2000 * j).toLocaleString('en-US'), { upright: true, size: 0.6, anchor: 'end', bg: true }); }
      });
      k.step('protractor', 'From O draw a ray for each city at its bearing, measured clockwise from north.', () => {
        info.forEach(c => { const u = g.dir(Math.PI / 2 - c.b * D); k.seg(O, g.add(O, g.mul(u, c.d * s + 10)), { cls: 'cons' }); });
      });
      k.step('ruler', 'On each ray lay off the distance at 1 unit per 50 km: that is the city.', () => {
        info.forEach(c => k.point(c.pt, c.n, { at: c.dir, lo: { upright: true, size: 0.7 } }));
      });
      k.note('The coastlines computed by the engine with the same rule (bearing and distance from Tel Aviv) fall under the cities you plotted. Straight lines from O are great circles; lines between other cities are not.', () => {
        const R = Pj.geo.R * s, o = { lon0: home.lon, lat0: home.lat };
        Wd.lines().forEach(l => Pj.maps.path('azimuthal-equidistant', l.pts, o).forEach(seg => {
          const pts = seg.map(p => [p[0] * R, p[1] * R]).filter(p => Math.hypot(p[0], p[1]) < 205);
          if (pts.length > 1) k.curve(pts, null, { cls: 'aux', nobounds: true });
        }));
      });
    }
  });

  Hyper.construction({
    id: 'mf-miller-compromise',
    title: 'A compromise made by hand: Miller between the plate carrée and Mercator',
    tags: ['Miller', 'compromise', 'Mercator', 'scales'],
    note: 'The plate carrée spaces the parallels by the latitude itself (y = R φ); Mercator by the integral of the secant. Osborn Miller (1942) took a step between them: squeeze the latitude by 0.8, look up Mercator\'s ordinate for the squeezed latitude, and stretch the answer by 1.25. The scale of the parallels on the Miller map is then between the two and, unlike Mercator\'s, the pole is a finite distance away (230 for R = 100). Neither conformal nor equal-area, but neither terrible. R = 100.',
    build(k) {
      const R = 100, lats = [15, 30, 45, 60, 75];
      const yP = p => R * p * D, yMi = p => 1.25 * R * Math.log(Math.tan(Math.PI / 4 + 0.4 * p * D)), yMe = p => R * Math.log(Math.tan(Math.PI / 4 + p * D / 2));
      const X = [0, 100, 200];
      k.given('The equator and three vertical scales, one for each map: the plate carrée on the left, Miller in the middle, Mercator on the right. All have the same central scale at the equator.', () => {
        k.seg(k.pt(-25, 0), k.pt(X[2] + 25, 0), { cls: 'given' });
        X.forEach(x => k.seg(k.pt(x, 0), k.pt(x, 250), { cls: 'given' }));
        ['plate carrée', 'Miller', 'Mercator'].forEach((t, i) => k.text(X[i], 268, t, { upright: true, size: 0.85 }));
        k.frame(-45, -15, X[2] + 55, 285);
      });
      k.step('ruler', 'Plate carrée: lay off R φ for each latitude (φ in radians): 26.2, 52.4, 78.5, 104.7, 131.0, and 157.1 at the pole.', () => {
        lats.concat([90]).forEach(p => { k.dot(k.pt(X[0], yP(p)), { r: 0.7 }); k.label(k.pt(X[0], yP(p)), p + '°', 'w', { upright: true, size: 0.65, dist: 0.7 }); });
      });
      k.step('ruler', 'Miller: for each latitude take 0.8 φ, look up Mercator\'s ordinate for it and multiply by 1.25. The result is 26.4, 54.0, 84.3, 119.7, 164.6 and, at the pole, 230.3.', () => {
        lats.concat([90]).forEach(p => { k.dot(k.pt(X[1], yMi(p)), { r: 0.7 }); k.label(k.pt(X[1], yMi(p)), p + '°', 'w', { upright: true, size: 0.65, dist: 0.7 }); });
      });
      k.step('ruler', 'Mercator: lay off R ln tan(45° + φ/2): 26.5, 54.9, 88.1, 131.7, 202.8. The pole is off the page.', () => {
        lats.forEach(p => { k.dot(k.pt(X[2], yMe(p)), { r: 0.7 }); k.label(k.pt(X[2], yMe(p)), p + '°', 'w', { upright: true, size: 0.65, dist: 0.7 }); });
        k.arrow(k.pt(X[2], 215), k.pt(X[2], 245), { cls: 'cons' });
      });
      k.step('straightedge', 'Join the three marks of each parallel. The Miller mark is always between the other two, nearer the plate carrée at low latitudes.', () => {
        lats.forEach(p => { k.seg(k.pt(X[0], yP(p)), k.pt(X[1], yMi(p)), { cls: 'cons' }); k.seg(k.pt(X[1], yMi(p)), k.pt(X[2], yMe(p)), { cls: 'cons' }); });
        k.seg(k.pt(X[0], yP(90)), k.pt(X[1], yMi(90)), { cls: 'cons' });
      });
      k.note('At 60° the three scales put the parallel at 104.7, 119.7 and 131.7. The Miller map spreads the high latitudes about halfway as much as Mercator does, and leaves room for the poles.', () => {
        [yP(60), yMi(60), yMe(60)].forEach((y, i) => k.dot(k.pt(X[i], y), { r: 1.1, cls: 'red' }));
      });
    }
  });

  Hyper.construction({
    id: 'mf-three-surfaces',
    title: 'Cylinder, cone and plane touching the sphere: finding the apex of the cone',
    tags: ['developable', 'cylinder', 'cone', 'plane', 'tangent'],
    note: 'Seen from the side the sphere is a circle and each surface is a straight line touching it. The cylinder touches along the equator; the plane touches at the pole; the cone touches along the parallel φ₁ = 40°, and its sides are the tangents at the two ends of that parallel. The tangent at a point is perpendicular to the radius there, so the apex is found with the set square; the slant length from the apex to the parallel is R cot φ₁ = 119.2, the radius of the unrolled arc. The cylinder is the limit of the cones as φ₁ → 0, the plane as φ₁ → 90°.',
    build(k) {
      const g = k.g, R = 100, f1 = 40 * D, O = k.pt(0, 0);
      const Pc = k.pt(R * Math.cos(f1), R * Math.sin(f1)), Pc2 = k.pt(-Pc.x, Pc.y), T = k.pt(0, R / Math.sin(f1));
      k.given('The sphere seen from the side: a circle of radius R about O, with its polar axis and the equator.', () => {
        k.circle(O, R, { cls: 'given' });
        k.seg(k.pt(0, -R * 1.15), k.pt(0, R * 1.75), { cls: 'axis', dash: true });
        k.seg(k.pt(-R * 1.25, 0), k.pt(R * 1.25, 0), { cls: 'given' });
        k.point(O, 'O', 'sw'); k.point(k.pt(0, R), 'N', 'nw', { r: 0.9 });
        k.frame(-R * 1.45, -R * 1.2, R * 1.45, R * 1.8);
      });
      k.step('tee', 'The plane: a horizontal line touching the circle at the pole N (it is perpendicular to the axis).', () => {
        k.seg(k.pt(-R * 1.3, R), k.pt(R * 1.3, R), { cls: 'green' });
        k.label(k.pt(R * 1.3, R), 'plane', 'e', { upright: true, size: 0.8, fill: '#2d7a3a' });
      });
      k.step('square', 'The cylinder: two verticals touching the circle at the ends of the equator.', () => {
        k.seg(k.pt(R, -R * 1.1), k.pt(R, R * 1.6), { cls: 'curve' });
        k.seg(k.pt(-R, -R * 1.1), k.pt(-R, R * 1.6), { cls: 'curve' });
        k.label(k.pt(R, R * 1.6), 'cylinder', 'n', { upright: true, size: 0.8, fill: '#0b4fa0' });
      });
      k.step('protractor', 'The cone: choose the parallel φ₁ = 40° and mark its ends A and A′ on the circle, 40° from the equator at O.', () => {
        k.seg(O, Pc, { cls: 'cons' }); k.seg(O, Pc2, { cls: 'cons' });
        k.point(Pc, 'A', 'e'); k.point(Pc2, 'A′', 'w');
        k.angle(O, k.pt(1, 0), Pc, { label: '40°', r: 2.2, labelDist: 1.2 });
      });
      k.step('square', 'Through A draw the perpendicular to the radius OA: the tangent. It meets the axis at the apex T. Do the same at A′; it meets the axis at the same point.', () => {
        const dir = g.unit(g.sub(Pc, T));
        k.seg(g.add(Pc, g.mul(dir, 55)), T, { cls: 'red' });
        k.seg(g.add(Pc2, g.mul(g.unit(g.sub(Pc2, T)), 55)), T, { cls: 'red' });
        k.right(Pc, O, T, { r: 0.8 });
        k.point(T, 'T', 'ne');
        k.label(k.pt(R * 0.3, R * 1.6), 'cone', 'e', { upright: true, size: 0.8, fill: '#b03a2e' });
      });
      k.note('The slant length TA = R cot 40° = 119.2 is the radius of the circle into which the parallel will unroll; the height of the apex is OT = R / sin 40° = 155.6. Make φ₁ smaller and T runs up the axis to infinity: the cone becomes the cylinder.', () => {
        k.text((T.x + Pc.x) / 2 + 12, (T.y + Pc.y) / 2 + 8, 'TA = R cot φ₁', { upright: true, size: 0.75, anchor: 'start', fill: '#b03a2e', bg: true });
        k.text(-8, R * 1.28, 'OT = R / sin φ₁', { upright: true, size: 0.75, anchor: 'end', bg: true });
      });
    }
  });

  Hyper.construction({
    id: 'mf-cone-unroll',
    title: 'Unrolling the tangent cone into a sector of angle 2π sin φ₁',
    tags: ['cone', 'development', 'sector', 'equidistant conic'],
    note: 'Cut the cone along one of its sides and lay it flat: it becomes a sector of a circle whose radius is the slant length TA = R cot φ₁ and whose arc is the whole parallel of length 2πR cos φ₁. The angle of the sector is therefore 2πR cos φ₁ / (R cot φ₁) = 2π sin φ₁: the **cone constant** n = sin φ₁ is the fraction of a full turn. On the unrolled cone longitude λ becomes the angle nλ at the apex, so the meridians are straight lines through the apex and the parallels are arcs about it. Here the other parallels are placed at their true distances along the meridian (the equidistant conic with one standard parallel).',
    build(k) {
      const g = k.g, R = 100, f1 = 40, n = Math.sin(f1 * D), th = 2 * Math.PI * n, rho1 = R / Math.tan(f1 * D);
      const O = k.pt(0, 0), Pc = k.pt(R * Math.cos(f1 * D), R * Math.sin(f1 * D)), Pc2 = k.pt(-Pc.x, Pc.y), T = k.pt(0, R / Math.sin(f1 * D));
      const T2 = k.pt(330, 105);
      const rho = p => rho1 - R * (p - f1) * D;
      const down = -Math.PI / 2;
      const arc = (r, o) => k.arc(T2, r, down - th / 2, down + th / 2, o);
      k.given('The cone from the previous drawing: sphere, tangent cone with apex T, parallel AA′ at φ₁ = 40°. To the right, the apex T′ of the new figure, and the central meridian, a vertical going down from T′.', () => {
        k.circle(O, R, { cls: 'given' });
        k.seg(k.pt(0, -R * 1.1), k.pt(0, R * 1.7), { cls: 'axis', dash: true });
        k.seg(Pc, T, { cls: 'given' }); k.seg(Pc2, T, { cls: 'given' }); k.seg(Pc2, Pc, { cls: 'given' });
        k.point(T, 'T', 'ne'); k.point(Pc, 'A', 'e'); k.point(Pc2, 'A′', 'w');
        k.point(T2, 'T′', 'n');
        k.seg(T2, k.pt(T2.x, T2.y - 205), { cls: 'cons', dash: true });
        k.frame(-R * 1.3, T2.y - 235, 585, T2.y + 235 * Math.sin(25.7 * D) + 10);
      });
      const Q1 = k.pt(T2.x, T2.y - rho1);
      k.step('dividers', 'Take the slant length TA = R cot φ₁ = 119.2 with the dividers and lay it off down the central meridian from T′ to Q.', () => {
        k.point(Q1, 'Q', 'w');
      });
      k.step('compass', 'With centre T′ and radius T′Q draw the arc of the standard parallel. Its length must be the length of the parallel, 2πR cos φ₁ = 481.3, which fixes how far round the arc goes.', () => {
        arc(rho1, { cls: 'curve' });
      });
      const e1 = g.dir(down - th / 2), e2 = g.dir(down + th / 2);
      k.step('protractor', 'The arc subtends the angle 2π sin φ₁ = 360° × 0.6428 = 231.4° at T′: lay off half of it, 115.7°, on each side of the central meridian and draw the two edges of the sector.', () => {
        k.seg(T2, g.add(T2, g.mul(e1, rho(0) + 6)), { cls: 'cons' });
        k.seg(T2, g.add(T2, g.mul(e2, rho(0) + 6)), { cls: 'cons' });
        k.angle(T2, g.add(T2, g.mul(g.dir(down), 40)), g.add(T2, g.mul(e2, 40)), { r: 1.7 });
        k.text(T2.x + (rho(0) + 12) * e2.x, T2.y + (rho(0) + 12) * e2.y + 6, '115.7°', { upright: true, size: 0.8, anchor: 'start' });
      });
      const ps = [0, 10, 20, 30, 50, 60, 70, 80, 90];
      k.step('dividers', 'Step off R × 10° = 17.5 along the central meridian from Q, up towards the pole (the radii shrink) and down towards the equator (they grow): the marks are the parallels.', () => {
        ps.forEach(p => { k.dot(k.pt(T2.x, T2.y - rho(p)), { r: 0.7 }); });
        [0, 90].forEach(p => k.label(k.pt(T2.x, T2.y - rho(p)), p + '°', 'e', { upright: true, size: 0.65, dist: 0.7 }));
      });
      k.step('compass', 'With centre T′ draw an arc through each mark: the parallels are concentric circles.', () => {
        ps.forEach(p => arc(rho(p), { cls: 'cons' }));
        k.label(k.pt(T2.x, T2.y - rho(40)), '40°', 'e', { upright: true, size: 0.65, dist: 0.7 });
      });
      k.step('protractor', 'Draw the meridians every 30° of longitude: they are lines through T′ at n × 30° = 19.3° from one another (12 of them fill the sector, 231.4° in all).', () => {
        for (let j = -6; j <= 6; j++) { if (Math.abs(j) === 6) continue; k.seg(T2, g.add(T2, g.mul(g.dir(down + j * 30 * n * D), rho(0))), { cls: 'cons' }); }
      });
      k.note('Check: the arc is 231.4° of a circle of radius 119.2: 4.0386 × 119.2 = 481.3 = 2π × 76.6, the length of the circle of the parallel. On the standard parallel the map is exactly to scale; away from it, along the parallels, the scale is n ρ / (R cos φ): too large on both sides.', () => {
        k.text(T2.x, T2.y - rho(0) - 24, 'scale 1 on the standard parallel (blue)', { upright: true, size: 0.75, bg: true });
      });
    }
  });

  Hyper.construction({
    id: 'mf-secant-cone',
    title: 'A cone cutting the sphere along two standard parallels',
    tags: ['cone', 'secant', 'standard parallels', 'development'],
    note: 'Let the cone cut into the sphere instead of just touching it: it meets the sphere in two circles, the standard parallels φ₁ = 20° and φ₂ = 60°. On both, the cone and the sphere coincide, so the map is to scale along them (scale 1); between them the cone lies inside the sphere and the map is too small, outside them the cone lies outside and the map is too large. The apex is where the line through the two points where the cone meets the circle crosses the axis. The cone constant is n = sin ½(φ₁ + φ₂) = 0.643 for this geometric cone. (The equidistant conic of the engine respaces the parallels along the meridians and uses n = (cos φ₁ − cos φ₂)/(φ₂ − φ₁) = 0.630 here: a different but very close map.)',
    build(k) {
      const g = k.g, R = 100, f1 = 20, f2 = 60, n = Math.sin((f1 + f2) / 2 * D), th = 2 * Math.PI * n;
      const O = k.pt(0, 0), P1 = k.pt(R * Math.cos(f1 * D), R * Math.sin(f1 * D)), P2 = k.pt(R * Math.cos(f2 * D), R * Math.sin(f2 * D));
      const P1b = k.pt(-P1.x, P1.y), P2b = k.pt(-P2.x, P2.y);
      const T = g.lineLine(P1, P2, k.pt(0, 0), k.pt(0, 1)), rho1 = g.dist(T, P1), rho2 = g.dist(T, P2);
      const T2 = k.pt(330, 110), down = -Math.PI / 2;
      const arc = (r, o) => k.arc(T2, r, down - th / 2, down + th / 2, o);
      k.given('The sphere from the side with its axis and equator, and the two standard parallels φ₁ = 20° and φ₂ = 60° drawn as horizontal chords.', () => {
        k.circle(O, R, { cls: 'given' });
        k.seg(k.pt(0, -R * 1.1), k.pt(0, R * 1.7), { cls: 'axis', dash: true });
        k.seg(k.pt(-R * 1.15, 0), k.pt(R * 1.15, 0), { cls: 'given' });
        k.seg(P1b, P1, { cls: 'given' }); k.seg(P2b, P2, { cls: 'given' });
        k.point(O, 'O', 'sw');
        k.frame(-R * 1.3, T2.y - 235, 680, T2.y + 230 * Math.sin(25.7 * D) + 10);
      });
      k.step('protractor', 'Mark the ends of the two parallels on the circle: B and C at 20° and 60° from the equator, and the mirror images B′ and C′.', () => {
        k.point(P1, 'B', 'e'); k.point(P2, 'C', 'ne'); k.point(P1b, 'B′', 'w'); k.point(P2b, 'C′', 'nw');
        k.angle(O, k.pt(1, 0), P1, { label: '20°', r: 2.4, labelDist: 0.9 });
        k.angle(O, k.pt(1, 0), P2, { label: '60°', r: 3.4, labelDist: 0.9 });
      });
      k.step('straightedge', 'Draw the line through B and C and extend it until it meets the axis at the apex T; do the same through B′ and C′. These two lines are the sides of the cone that cuts the sphere in the two parallels.', () => {
        k.seg(g.add(P1, g.mul(g.unit(g.sub(P1, P2)), 70)), T, { cls: 'red' }); k.seg(g.add(P1b, g.mul(g.unit(g.sub(P1b, P2b)), 70)), T, { cls: 'red' });
        k.point(T, 'T', 'ne');
      });
      const Q1 = k.pt(T2.x, T2.y - rho1), Q2 = k.pt(T2.x, T2.y - rho2);
      k.step('dividers', 'Carry the slant distances TB = 146.2 and TC = 77.8 to a new figure: from the new apex T′ lay them off down the central meridian, Q₁ and Q₂.', () => {
        k.point(T2, 'T′', 'n'); k.seg(T2, k.pt(T2.x, T2.y - 175), { cls: 'cons', dash: true });
        k.point(Q1, 'Q_1', { at: 'e', lo: { size: 0.7 } }); k.point(Q2, 'Q_2', { at: 'e', lo: { size: 0.7 } });
      });
      k.step('compass', 'Draw the two arcs about T′ through Q₁ and Q₂: the standard parallels of 20° and 60°, both true to scale.', () => {
        arc(rho1, { cls: 'curve' }); arc(rho2, { cls: 'curve' });
      });
      const e1 = g.dir(down - th / 2), e2 = g.dir(down + th / 2);
      k.step('protractor', 'The sector angle is 2π n with n = sin 40° (the mean latitude): 360° × 0.6428 = 231.4°. Lay off half, 115.7°, on each side of the central meridian.', () => {
        k.seg(T2, g.add(T2, g.mul(e1, rho1 + 25)), { cls: 'cons' });
        k.seg(T2, g.add(T2, g.mul(e2, rho1 + 25)), { cls: 'cons' });
        k.angle(T2, g.add(T2, g.mul(g.dir(down), 40)), g.add(T2, g.mul(e2, 40)), { r: 1.7 });
        k.text(T2.x + (rho1 + 40) * e2.x, T2.y + (rho1 + 40) * e2.y + 6, '115.7°', { upright: true, size: 0.8, anchor: 'start' });
      });
      const step = (rho1 - rho2) / 4, rr = j => rho1 - j * step;
      k.step('dividers', 'Divide the distance Q₂Q₁ into four equal parts (10° of latitude each): the radii of the parallels of 30°, 40° and 50°. Carry the same step beyond Q₁ and Q₂ for 10° and 70°.', () => {
        [-1, 1, 2, 3, 5].forEach(j => k.dot(k.pt(T2.x, T2.y - rr(j)), { r: 0.7 }));
        [[-1, '10°'], [1, '30°'], [2, '40°'], [3, '50°'], [5, '70°']].forEach(([j, t]) => k.label(k.pt(T2.x, T2.y - rr(j)), t, 'w', { upright: true, size: 0.5, dist: 0.7 }));
      });
      k.step('compass', 'Draw the arcs of these five parallels about T′.', () => {
        [-1, 1, 2, 3, 5].forEach(j => arc(rr(j), { cls: 'cons' }));
      });
      k.note('Scale along the parallels, n ρ / (R cos φ): 1.07 at 10°, 1 at 20°, 0.96 at 30°, 0.94 at 40°, 0.95 at 50°, 1 at 60°, 1.14 at 70°. Between the standard parallels the map is too small by at most 6 %; outside, it grows quickly.', () => {
        const txt = [[rr(-1), 10], [rr(0), 20], [rr(1), 30], [rr(2), 40], [rr(3), 50], [rr(4), 60], [rr(5), 70]].map(([r, p]) => p + '°: ' + (n * r / (R * Math.cos(p * D))).toFixed(2)).join('   ');
        k.text(T2.x + 40, T2.y - rr(-1) - 38, 'scale along the parallel, n ρ / (R cos φ):', { upright: true, size: 0.7, fill: '#b03a2e' });
        k.text(T2.x + 40, T2.y - rr(-1) - 58, txt, { upright: true, size: 0.7, fill: '#b03a2e' });
      });
    }
  });

  Hyper.construction({
    id: 'mf-scale-factor',
    title: 'Reading the scale factor along a parallel from the side view',
    tags: ['scale factor', 'secant cylinder', 'standard parallel', 'proportion'],
    note: 'A parallel of latitude φ is a circle of radius R cos φ on the sphere. On the cylinder that cuts the sphere along the parallel φ₁ it becomes a circle of radius R cos φ₁, and unrolled, a straight line of that circumference. So along the parallel the map is stretched by k = cos φ₁ / cos φ: the ratio of two lengths on the side view. The ratio is found with a **fourth proportional**: lay the two lengths on one ray, a unit on another, join, and draw a parallel. Here φ₁ = 30°, φ = 60°, k = 0.866 / 0.5 = 1.732. The same drawing at the equator gives 0.866 (the map is too small there) and at 30° exactly 1.',
    build(k) {
      const g = k.g, R = 100, f1 = 30, f = 60, rc = R * Math.cos(f1 * D), rp = R * Math.cos(f * D);
      const O = k.pt(0, 0), S1 = k.pt(rc, R * Math.sin(f1 * D)), S2 = k.pt(rc, -R * Math.sin(f1 * D));
      const Q = k.pt(rp, R * Math.sin(f * D)), Q0 = k.pt(0, Q.y), Qc = k.pt(rc, Q.y);
      const Z = k.pt(200, -70), dirB = g.dir(62 * D);
      const A = k.pt(Z.x + rp, Z.y), Cc = k.pt(Z.x + rc, Z.y), B = g.add(Z, g.mul(dirB, 100));
      const Dd = g.lineLine(Cc, g.add(Cc, g.sub(B, A)), Z, B);
      k.given('The sphere from the side, its axis and equator, and the secant cylinder: two verticals at distance R cos 30° = 86.6 from the axis, cutting the circle at S and S′ (the parallels of ±30°, where the map is true).', () => {
        k.circle(O, R, { cls: 'given' });
        k.seg(k.pt(0, -R * 1.15), k.pt(0, R * 1.15), { cls: 'axis', dash: true });
        k.seg(k.pt(-R * 1.1, 0), k.pt(R * 1.1, 0), { cls: 'given' });
        k.seg(k.pt(rc, -R * 1.1), k.pt(rc, R * 1.1), { cls: 'curve' }); k.seg(k.pt(-rc, -R * 1.1), k.pt(-rc, R * 1.1), { cls: 'curve' });
        k.point(S1, 'S', 'e'); k.point(S2, 'S′', 'e'); k.point(O, 'O', 'sw');
        k.frame(-R * 1.25, -R * 1.25, 420, R * 1.5);
      });
      k.step('protractor', 'Choose the parallel whose scale you want, φ = 60°, and mark its end Q on the circle, 60° from the equator at O.', () => {
        k.seg(O, Q, { cls: 'cons' }); k.point(Q, 'Q', 'ne');
        k.angle(O, k.pt(1, 0), Q, { label: '60°', r: 3, labelDist: 1.2 });
      });
      k.step('tee', 'Draw the horizontal through Q from the axis out to the cylinder. The part from the axis to Q is the radius of the parallel, r = 50; the whole line to the cylinder is the radius of the cylinder, 86.6.', () => {
        k.seg(Q0, Qc, { cls: 'red' }); k.point(Q0, '', 'w'); k.point(Qc, '', 'e');
      });
      k.step('dividers', 'Carry the two lengths to a clean place on the right: from a point Z lay off r = 50 (to A) and the cylinder radius 86.6 (to C) on the same horizontal.', () => {
        k.point(Z, 'Z', 'sw'); k.seg(Z, g.add(Cc, k.pt(30, 0)), { cls: 'cons' });
        k.point(A, 'A', 'sw'); k.point(Cc, 'C', 'sw');
      });
      k.step('ruler', 'On a second ray from Z, at any angle, lay off a unit length ZB = 100.', () => {
        k.seg(Z, g.add(Z, g.mul(dirB, 190)), { cls: 'cons' }); k.point(B, 'B', 'w');
      });
      k.step('straightedge', 'Join A to B.', () => { k.seg(A, B, { cls: 'cons' }); });
      k.step('square', 'Through C draw the parallel to AB. It meets the second ray at D, and ZD / ZB = ZC / ZA is the ratio you want.', () => {
        k.seg(Cc, Dd, { cls: 'red' }); k.point(Dd, 'D', 'w');
      });
      k.note('Measure ZD against the unit ZB: 173.2 / 100 = 1.73. So at latitude 60° the map is 1.73 times too long along the parallel; the formula cos 30° / cos 60° says the same.', () => {
        k.text(Dd.x + 18, Dd.y - 4, 'k = ZD / ZB = 1.73', { upright: true, size: 0.8, anchor: 'start', fill: '#b03a2e' });
      });
    }
  });

  Hyper.construction({
    id: 'mf-aspects-cylinder',
    title: 'The same cylinder in three aspects: normal, oblique, transverse',
    tags: ['aspects', 'cylinder', 'oblique', 'transverse', 'protractor'],
    note: 'A projection does not care which great circle you call the equator. Tilt the cylinder\'s axis by τ from the polar axis and it touches the sphere along a **new equator** that is tilted by τ to the real one: τ = 0 is the normal aspect, τ = 90° the transverse (the cylinder touches a meridian and its opposite) and anything between is oblique. The geographic pole N then sits at latitude 90° − τ in the new system: at the pole, on the new equator, or in between. Mercator in the transverse aspect is the projection of the UTM grid.',
    build(k) {
      const g = k.g, R = 50, L = 70, taus = [0, 45, 90], cx = [-190, 0, 190];
      const O = i => k.pt(cx[i], 0), u = i => g.dir(Math.PI / 2 - taus[i] * D), e = i => g.dir(-taus[i] * D);
      const titles = ['normal, τ = 0°', 'oblique, τ = 45°', 'transverse, τ = 90°'];
      k.given('Three copies of the sphere seen from the side, each with its polar axis and the pole N. The cylinder will be tilted by τ = 0°, 45° and 90° from the polar axis.', () => {
        taus.forEach((t, i) => {
          k.circle(O(i), R, { cls: 'given' });
          k.seg(k.pt(cx[i], -R * 1.35), k.pt(cx[i], R * 1.35), { cls: 'axis', dash: true });
          k.point(k.pt(cx[i], R), 'N', 'nw', { r: 0.9 }); k.point(O(i), '', 'sw');
          k.text(cx[i], -R * 2.2, titles[i], { upright: true, size: 0.85 });
        });
        k.frame(cx[0] - 85, -R * 2.4, cx[2] + 85, R * 1.65);
      });
      k.step('protractor', 'At each centre lay off the tilt τ from the polar axis, to the right, and draw the axis of the cylinder through O.', () => {
        taus.forEach((t, i) => {
          if (t === 0) return;
          k.seg(g.sub(O(i), g.mul(u(i), R * 1.55)), g.add(O(i), g.mul(u(i), R * 1.55)), { cls: 'cons', dash: true });
          k.angle(O(i), g.add(O(i), u(i)), g.add(O(i), k.pt(0, 1)), { label: 'τ', r: 1.9, labelDist: 0.6 });
        });
      });
      k.step('square', 'Perpendicular to the axis, through O, draw the diameter: it is the new equator seen edge-on, and its ends T and T′ are where the cylinder touches the sphere.', () => {
        taus.forEach((t, i) => {
          k.seg(g.sub(O(i), g.mul(e(i), R * 1.15)), g.add(O(i), g.mul(e(i), R * 1.15)), { cls: 'cons' });
          k.dot(g.add(O(i), g.mul(e(i), R)), { r: 0.9 }); k.dot(g.sub(O(i), g.mul(e(i), R)), { r: 0.9 });
        });
      });
      k.step('square', 'Through T and T′ draw the parallels to the axis: the walls of the cylinder.', () => {
        taus.forEach((t, i) => {
          [1, -1].forEach(s => {
            const Tp = g.add(O(i), g.mul(e(i), s * R));
            k.seg(g.sub(Tp, g.mul(u(i), L)), g.add(Tp, g.mul(u(i), L)), { cls: 'curve' });
          });
        });
      });
      k.note('The new pole N′ is where the axis meets the sphere. The geographic pole N lies τ away from it: it is still the pole of the normal cylinder, a point on the equator of the transverse one.', () => {
        taus.forEach((t, i) => {
          const Np = g.add(O(i), g.mul(u(i), R));
          if (t > 0) { k.point(Np, 'N′', t === 90 ? 'n' : 'ne', { r: 0.9, cls: 'red' }); }
        });
      });
    }
  });

  Hyper.construction({
    id: 'mf-gc-rhumb',
    title: 'A great circle and a rhumb line from Tel Aviv to New York',
    tags: ['great circle', 'rhumb line', 'stereographic', 'Mercator', 'bearing'],
    note: 'On a map centred on the midpoint of the route the great circle is a **straight line through the centre** (every azimuthal map has this property for lines through its centre). Read the latitude where it crosses each meridian, plot those points on a Mercator strip and the same great circle is a curve that bows towards the pole, to 52° N. On the Mercator strip the **rhumb line** is the straight line: it crosses every meridian at 275.6° from north. Read its points the same way and plot them on the globe: a gentle spiral, south of the great circle and 7 % longer (9766 km against 9117 km). The latitudes come from tan φ = (tan φ₁ sin(λ₂ − λ) + tan φ₂ sin(λ − λ₁)) / sin(λ₂ − λ₁) for the great circle and from the straight line in ψ = ln tan(45° + φ/2) for the rhumb line.',
    build(k) {
      const g = k.g, P = k.proj, Wd = Hyper.world;
      k.fontScale(0.8);
      const A = Wd.city('Tel Aviv'), B = Wd.city('New York'), a = [A.lon, A.lat], b = [B.lon, B.lat];
      const mid = P.geo.midpoint(a, b), go = { lon0: mid[0], lat0: mid[1] };
      const S = 50, gC = k.pt(-150, 0);
      const psi = p => Math.log(Math.tan(Math.PI / 4 + p * D / 2));
      const Rm = 100, lon0m = -90, lon1m = 60, lat0m = 15, lat1m = 65, mx0 = 40, my0 = -62;
      const mW = Rm * (lon1m - lon0m) * D, mH = Rm * (psi(lat1m) - psi(lat0m));
      const gp = ll => { const q = P.maps.project('stereographic', ll[0], ll[1], go); return q ? k.pt(gC.x + S * q[0], gC.y + S * q[1]) : null; };
      const mp = ll => k.pt(mx0 + Rm * (ll[0] - lon0m) * D, my0 + Rm * (psi(ll[1]) - psi(lat0m)));
      const inStrip = p => p.x >= mx0 - 0.01 && p.x <= mx0 + mW + 0.01 && p.y >= my0 - 0.01 && p.y <= my0 + mH + 0.01;
      const runs = (pts, ok) => { const out = []; let cur = []; pts.forEach(p => { if (p && ok(p)) cur.push([p.x, p.y]); else { if (cur.length > 1) out.push(cur); cur = []; } }); if (cur.length > 1) out.push(cur); return out; };
      const gcLat = lon => { const l1 = a[0] * D, l2 = b[0] * D, f1 = a[1] * D, f2 = b[1] * D, l = lon * D; return Math.atan((Math.tan(f1) * Math.sin(l2 - l) + Math.tan(f2) * Math.sin(l - l1)) / Math.sin(l2 - l1)) / D; };
      const rhLat = lon => { const t = (lon - a[0]) / (b[0] - a[0]); const ps = psi(a[1]) + (psi(b[1]) - psi(a[1])) * t; return (2 * Math.atan(Math.exp(ps)) - Math.PI / 2) / D; };
      const cross = [-60, -45, -30, -15, 0, 15, 30];
      const onGlobe = p => g.dist(p, gC) <= 2 * S + 0.01;
      const brgR = P.geo.rhumbBearing(a, b), brgG = P.geo.bearing(a, b);
      k.given('A stereographic globe centred on the midpoint of the route (the circle is the horizon, 90° from the centre) and a Mercator strip of the same region, both with a graticule every 15°. Tel Aviv and New York are marked on both.', () => {
        k.circle(gC, 2 * S, { cls: 'given' });
        P.maps.graticule('stereographic', go, 15, 15).forEach(gr => runs(gr.pts.map(q => k.pt(gC.x + S * q[0], gC.y + S * q[1])), onGlobe).forEach(r => k.curve(r, null, { cls: 'aux', nobounds: true })));
        Wd.lines().forEach(l => P.maps.path('stereographic', l.pts, go).forEach(seg => runs(seg.map(q => k.pt(gC.x + S * q[0], gC.y + S * q[1])), onGlobe).forEach(r => k.curve(r, null, { cls: 'aux', nobounds: true, width: 0.5 }))));
        k.rect(mx0, my0, mx0 + mW, my0 + mH, { cls: 'given' });
        for (let lo = lon0m + 15; lo < lon1m; lo += 15) k.seg(mp([lo, lat0m]), mp([lo, lat1m]), { cls: 'aux' });
        for (let la = 20; la < lat1m; la += 10) k.seg(mp([lon0m, la]), mp([lon1m, la]), { cls: 'aux' });
        Wd.lines().forEach(l => P.maps.path('mercator', l.pts, { lon0: 0 }).forEach(seg => runs(seg.map(q => k.pt(mx0 + Rm * (q[0] - lon0m * D), my0 + Rm * (q[1] - psi(lat0m)))), inStrip).forEach(r => k.curve(r, null, { cls: 'aux', nobounds: true, width: 0.5 }))));
        for (let lo = lon0m; lo <= lon1m; lo += 30) k.label(mp([lo, lat0m]), (lo < 0 ? '−' : '') + Math.abs(lo) + '°', 's', { upright: true, size: 0.6 });
        for (let la = 20; la <= 60; la += 20) k.label(mp([lon0m, la]), la + '°', 'w', { upright: true, size: 0.6 });
        [[gp(a), 'Tel Aviv'], [gp(b), 'New York']].forEach(([p, t]) => k.point(p, t, { at: p.x > gC.x ? 'e' : 'w', lo: { upright: true, size: 0.7 } }));
        k.point(mp(a), 'Tel Aviv', { at: 's', lo: { upright: true, size: 0.65 } }); k.point(mp(b), 'New York', { at: 's', lo: { upright: true, size: 0.65 } });
        k.text(gC.x, gC.y + 2 * S + 22, 'stereographic, centred on the route', { upright: true, size: 0.7 });
        k.text(mx0 + mW / 2, my0 + mH + 12, 'Mercator', { upright: true, size: 0.7 });
        k.frame(gC.x - 2 * S - 20, -2 * S - 30, mx0 + mW + 25, 2 * S + 30);
      });
      k.step('straightedge', 'On the globe join Tel Aviv to New York with a straight line. The centre of the map is the midpoint of the route, so the great circle through the two cities passes through the centre and is straight.', () => {
        k.seg(gp(a), gp(b), { cls: 'green' });
      });
      k.step('dividers', 'Read off the latitude where the line crosses each meridian from 60°W to 30°E (every 15°): seven points, between 41° and 52° north.', () => {
        cross.forEach(lo => k.dot(gp([lo, gcLat(lo)]), { r: 0.9, cls: 'green' }));
      });
      k.step('ruler', 'On the Mercator strip plot each of the seven points at its longitude, and at the height that Mercator gives its latitude (the strip is graduated).', () => {
        cross.forEach(lo => k.dot(mp([lo, gcLat(lo)]), { r: 0.9, cls: 'green' }));
      });
      k.step('pencil', 'Draw the curve through the points, from Tel Aviv to New York: the great circle on the Mercator chart. It bows towards the pole, to 52° N.', () => {
        k.curve(P.geo.greatCircle(a, b, 120).map(q => { const p = mp(q); return [p.x, p.y]; }), null, { cls: 'curve' });
      });
      k.step('straightedge', 'On the strip join Tel Aviv to New York with a straight line: the rhumb line, the course of constant compass bearing.', () => {
        k.seg(mp(a), mp(b), { cls: 'red' });
      });
      const mA = mp(a), mB = mp(b), dAB = g.unit(g.sub(mB, mA));
      k.step('protractor', 'Measure the angle between the line and a meridian: 84.4° to the west of north, a bearing of ' + brgR.toFixed(1) + '°. Mercator keeps angles, so this is the bearing to steer, and it is the same at every point of the line.', () => {
        k.angle(mA, g.add(mA, k.pt(0, 34)), g.add(mA, g.mul(dAB, 34)), { r: 2.2, cls: 'red' });
        k.text(mA.x - 70, mA.y - 17, '84.4° west of north', { upright: true, size: 0.65, anchor: 'end', fill: '#b03a2e', bg: true });
      });
      k.step('dividers', 'Mark where the straight line crosses the same seven meridians. Read their latitudes (32° to 40°) and plot those points on the globe.', () => {
        cross.forEach(lo => { k.dot(mp([lo, rhLat(lo)]), { r: 0.9, cls: 'red' }); k.dot(gp([lo, rhLat(lo)]), { r: 0.9, cls: 'red' }); });
      });
      k.step('pencil', 'Join the points on the globe: the rhumb line is a spiral that cuts every meridian at 275.6°, lying south of the great circle.', () => {
        const pts = []; for (let i = 0; i <= 120; i++) { const lo = a[0] + (b[0] - a[0]) * i / 120; const p = gp([lo, rhLat(lo)]); pts.push(p ? [p.x, p.y] : null); }
        k.curve(pts, null, { cls: 'red' });
      });
      k.note('Great circle: ' + P.geo.distance(a, b).toFixed(0) + ' km, leaving Tel Aviv on ' + brgG.toFixed(1) + '°, arriving on a bearing about 55° further round, a different one at every point. Rhumb line: ' + P.geo.rhumbDistance(a, b).toFixed(0) + ' km at a constant ' + brgR.toFixed(1) + '°. A ship follows the rhumb line (one setting of the compass) or a chain of short rhumb lines along the great circle.', () => {
        k.text(gC.x, gC.y - 2 * S - 16, 'great circle (green): straight here', { upright: true, size: 0.7, fill: '#2d7a3a' });
        k.text(mx0 + mW / 2, my0 + mH + 30, 'rhumb line (red): straight here', { upright: true, size: 0.7, fill: '#b03a2e' });
      });
    }
  });

  Hyper.construction({
    id: 'mf-decision-table',
    title: 'Choosing a projection: purpose first, then region',
    tags: ['choosing', 'decision', 'flow chart'],
    note: 'The first question is **what the map must keep**, because no flat map keeps everything; the second is **how big and where the region is**, because that decides which surface (cylinder, cone, plane) leaves the least distortion. The table gives well-known examples, not the only ones; the coloured paths in the last step are two worked choices. Regions larger than a hemisphere, or crossing the poles, rarely suit a single conic or plane; for them take a compromise or an equal-area world map.',
    build(k) {
      const xs = [-300, -150, 0, 150, 300], cw = 138;
      const lh = 15.5;
      const seg = (p, q, o) => k.seg(p, q, o || { cls: 'given' });
      const box = (cx, cy, w, h, lines, o) => {
        o = o || {};
        const x0 = cx - w / 2, x1 = cx + w / 2, y0 = cy - h / 2, y1 = cy + h / 2, c = o.cls || 'given';
        seg(k.pt(x0, y0), k.pt(x1, y0), { cls: c }); seg(k.pt(x1, y0), k.pt(x1, y1), { cls: c }); seg(k.pt(x1, y1), k.pt(x0, y1), { cls: c }); seg(k.pt(x0, y1), k.pt(x0, y0), { cls: c });
        lines.forEach((t, i) => k.text(cx, cy + (lines.length - 1) / 2 * lh - i * lh, t, { upright: true, size: 0.45, bold: !!o.head && i === 0, anchor: 'middle' }));
      };
      const purposes = [['Angles and shapes', 'navigation, local detail'], ['Areas', 'densities, statistics'], ['Distances from', 'one place'], ['Shortest routes', 'great circles straight'], ['A world to look at', 'wall maps, atlases']];
      const results = [['CONFORMAL', 'Mercator', 'Lambert conic', 'stereographic'], ['EQUAL-AREA', 'Albers conic', 'Lambert azimuthal', 'Equal Earth'], ['EQUIDISTANT', 'azimuthal equidist.', 'equidistant conic'], ['GNOMONIC', 'great circles are', 'straight lines'], ['COMPROMISE', 'Winkel tripel', 'Robinson', 'Natural Earth']];
      const regions = [['tropics, east–west belt', 'cylinder'], ['mid-latitudes, east–west', 'cone'], ['poles or a round region', 'plane (azimuthal)'], ['narrow north–south strip', 'transverse cylinder']];
      const yRoot = 190, yPur = 118, yRes = 36, yLine = -22, yBand = -78, bx = [-270, -90, 90, 270];
      k.given('The question at the head of the chart: what must the map keep, and for which region?', () => {
        box(0, yRoot, 300, 34, ['What must the map keep, and where?'], { cls: 'given' });
        k.frame(-380, yBand - 40, 380, yRoot + 30);
      });
      k.step('straightedge', 'Under it draw five boxes, one for each purpose, and an arrow from the question to each.', () => {
        purposes.forEach((t, i) => { box(xs[i], yPur, cw, 46, t); k.arrow(k.pt(Math.max(-60, Math.min(60, xs[i] * 0.3)), yRoot - 17), k.pt(xs[i], yPur + 23), { cls: 'cons' }); });
      });
      k.step('straightedge', 'Below each purpose draw the box of the kind of map that keeps it, with well-known examples, and an arrow down.', () => {
        results.forEach((t, i) => { box(xs[i], yRes, cw, 66, t, { head: true }); k.arrow(k.pt(xs[i], yPur - 23), k.pt(xs[i], yRes + 33), { cls: 'cons' }); });
      });
      k.step('straightedge', 'Draw a bar under the five boxes with a short stem from each, and four boxes below it for the shape of the region: it decides the surface.', () => {
        seg(k.pt(xs[0], yLine), k.pt(xs[4], yLine), { cls: 'cons' });
        xs.forEach(x => seg(k.pt(x, yRes - 33), k.pt(x, yLine), { cls: 'cons' }));
        bx.forEach((x, i) => { box(x, yBand, 170, 40, regions[i]); k.arrow(k.pt(x, yLine), k.pt(x, yBand + 20), { cls: 'cons' }); });
        k.text(0, yLine + 10, 'then match the surface to the region', { upright: true, size: 0.5, bg: true });
      });
      k.note('Two worked choices. A sea chart must keep angles (so a course is a straight line): conformal, Mercator, a cylinder round the tropics (red). A map of population density across Europe must keep areas: equal-area, Albers, a cone for mid-latitudes (green).', () => {
        const hi = (cx, cy, w, h, cls) => { const x0 = cx - w / 2 - 3, x1 = cx + w / 2 + 3, y0 = cy - h / 2 - 3, y1 = cy + h / 2 + 3; k.poly([k.pt(x0, y0), k.pt(x1, y0), k.pt(x1, y1), k.pt(x0, y1)], { close: true, cls, width: 1.6 }); };
        hi(xs[0], yPur, cw, 46, 'red'); hi(xs[0], yRes, cw, 66, 'red'); hi(bx[0], yBand, 170, 40, 'red');
        hi(xs[1], yPur, cw, 46, 'green'); hi(xs[1], yRes, cw, 66, 'green'); hi(bx[1], yBand, 170, 40, 'green');
      });
    }
  });

  // @@NEXT@@
})();
