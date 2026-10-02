/* HYPER-PROJECTIONS · constructions/computing-and-vision.js — hand constructions for the pages on computing and vision.
 *
 *   cv-pipeline-spaces   one corner of a cube carried through model, world, camera, NDC and window space, with its numbers
 *   cv-frustum-to-cube   the view frustum to scale in side view and its mapping onto the clip cube: the nonlinear depth
 *   cv-depth-curve       the depth-buffer curve z_ndc(d) drawn point by point from the levels of a 3-bit buffer
 *   cv-shadow-section    a shadow map by hand: the light's rays, the depth map as bars, and the test of three ground points
 *   cv-iso-2to1          the 2 : 1 pixel-art tile grid beside the true 30° isometric grid
 *   cv-tile-unwarp       a square tile in a photograph: vanishing points, centre, true midpoints and the unwarped square
 *   cv-two-stations      two camera stations, their rays and the point where they cross: baseline, disparity, depth
 *   cv-marker-pose       the pose of a square marker from its image: vanishing points, Thales circle, focal length and tilt
 * Every number is computed with the engine (k.proj, k.g); every step names the tool it is made with.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180;
  const f3 = x => String(+x.toFixed(3)), f2 = x => String(+x.toFixed(2)), f1 = x => String(+x.toFixed(1));

  /* ------------------------------------------------------------------------------------------------ 1 */
  Hyper.construction({
    id: 'cv-pipeline-spaces',
    title: 'One corner through the five spaces of the graphics pipeline',
    tags: ['pipeline', 'model-view-projection', 'clip space', 'viewport'],
    note: 'All five pictures are *side views*, looking along the x axis: horizontal is −z (depth, so the camera looks to the right) and vertical is y; the x coordinate (1 for the corner followed) is written in the labels. The numbers are those of the worked example: M = translate (0, 1, 0), eye at (0, 1, 5) looking down −z, vertical field of view 60°, aspect 1.5, near 1, far 10, window 1200 × 800. In the NDC picture notice how the cube, 2 units deep in the world, is squeezed to a sliver against the far plane.',
    build(k) {
      const g = k.g, P = k.proj, M4 = P.mat4;
      const W = 1200, Hh = 800, nn = 1, ff = 10, asp = 1.5, fov = 60 * D2R;
      const Mm = M4.translate(0, 1, 0), Vv = M4.translate(0, -1, -5), Pp = P.perspectiveGL(fov, asp, nn, ff);
      const PVM = M4.chain(Pp, Vv, Mm);
      const pm = [1, 1, 1], pw = M4.point(Mm, pm), pv = M4.point(M4.mul(Vv, Mm), pm);
      const pc = M4.apply(PVM, [1, 1, 1, 1]), pn = [pc[0] / pc[3], pc[1] / pc[3], pc[2] / pc[3]];
      const px = (1 + pn[0]) / 2 * W, py = (1 - pn[1]) / 2 * Hh, pz = (pn[2] + 1) / 2;
      const ndcOf = q => { const c = M4.apply(PVM, [q[0], q[1], q[2], 1]); return [c[0] / c[3], c[1] / c[3], c[2] / c[3]]; };
      const title = (x, y, t) => k.text(x, y, t, { upright: true, size: 1.0, bold: true });
      const mark = (p, label, at) => k.point(p, label, { at, cls: 'red', lo: { cls: 'red', upright: true, size: 0.85 } });

      // panel 1 — model space: origin O1, 30 per unit, horizontal = −z
      const O1 = k.pt(-185, 105), s1 = 30, m1 = (z, y) => k.pt(O1.x - z * s1, O1.y + y * s1);
      // panel 2 — world space: origin W0 (on the ground), 24 per unit
      const W0 = k.pt(45, 55), s2 = 24, m2 = (z, y) => k.pt(W0.x - z * s2, W0.y + y * s2);
      // panel 3 — camera space: the eye at E3, 13 per unit of depth d = −z
      const E3 = k.pt(125, 112), s3 = 13, m3 = (d, y) => k.pt(E3.x + d * s3, E3.y + y * s3);
      // panel 4 — normalised device coordinates: centre N0, 60 per unit
      const N0 = k.pt(-150, -95), s4 = 60, m4 = (z, y) => k.pt(N0.x + z * s4, N0.y + y * s4);
      // panel 5 — window: centre C5, 0.17 per pixel
      const C5 = k.pt(70, -95), kap = 0.17, m5 = (x, y) => k.pt(C5.x + (x - W / 2) * kap, C5.y - (y - Hh / 2) * kap);

      k.given('Model space. The cube runs from −1 to +1 in every direction; the corner to follow is p = (1, 1, 1). The pictures are side views: horizontal is −z (depth), vertical is y.', () => {
        title(O1.x, 200, '1  Model space');
        k.axes(O1, { x: [-48, 48], y: [-48, 48], xl: '−z', yl: 'y' });
        k.poly([m1(-1, -1), m1(1, -1), m1(1, 1), m1(-1, 1)], { close: true, cls: 'given' });
        mark(m1(1, 1), 'p = (1, 1, 1)', 'nw');
        k.frame(-250, -178, 275, 205);
        k.fontScale(0.62);
      });

      k.step('ruler', 'World space. The model matrix M lifts the cube by 1 (translate (0, 1, 0)). Lay off the cube above the ground line, the eye E = (0, 1, 5) five units in front of its centre, and the corner p_w = (1, 2, 1).', () => {
        title(W0.x - 25, 200, '2  World space  (M)');
        k.axes(W0, { x: [-100, 40], y: [0, 70], xl: '−z', yl: 'y' });
        k.poly([m2(-1, 0), m2(1, 0), m2(1, 2), m2(-1, 2)], { close: true, cls: 'given' });
        k.arrow(m2(0, 0), m2(0, 1), { cls: 'cons' });
        k.point(m2(5, 1), 'E (0, 1, 5)', { at: 'n', lo: { upright: true, size: 0.85 } });
        k.arrow(m2(5, 1), g.add(m2(5, 1), k.pt(28, 0)), { cls: 'cons' });
        mark(m2(1, 2), 'p_w = (1, 2, 1)', 'n');
      });

      const half = fov / 2, hOf = d => d * Math.tan(half);
      k.step('protractor', 'Camera space. Put the eye E at the origin and lay off the half field of view, 30°, above and below the optical axis: the two edges of the frustum.', () => {
        title(E3.x + 70, 200, '3  Camera space  (V)');
        k.axes(E3, { x: [-10, 142], y: [-82, 84], xl: 'd = −z', yl: 'y' });
        k.point(E3, 'E', { at: 'sw', lo: { upright: true, size: 0.85 } });
        k.seg(E3, m3(ff, hOf(ff)), { cls: 'given' });
        k.seg(E3, m3(ff, -hOf(ff)), { cls: 'given' });
        k.angle(E3, m3(ff, 0), m3(ff, hOf(ff)), { label: '30°', r: 9, labelDist: 0.6 });
      });

      k.step('ruler', 'On the axis lay off the near plane (d = 1) and the far plane (d = 10) and close the frustum; then draw the cube at depth 4 to 6 and the corner p_v = (1, 1, −4): the view matrix has only subtracted the eye position (0, 1, 5).', () => {
        k.seg(m3(nn, -hOf(nn)), m3(nn, hOf(nn)), { cls: 'given' });
        k.seg(m3(ff, -hOf(ff)), m3(ff, hOf(ff)), { cls: 'given' });
        k.label(m3(nn, -hOf(nn)), 'near', 's', { upright: true, size: 0.8 });
        k.label(m3(ff, hOf(ff)), 'far', 'ne', { upright: true, size: 0.8 });
        k.poly([m3(4, -1), m3(6, -1), m3(6, 1), m3(4, 1)], { close: true, cls: 'thick' });
        mark(m3(4, 1), 'p_v = (1, 1, −4)', 'ne');
        k.seg(E3, m3(4, 1), { cls: 'cons', dash: true });
      });

      k.step('tee', 'Normalised device coordinates. The projection matrix and the division by w = 4 turn the frustum into a box. Draw the clip cube as a square: z from −1 (the near plane) on the left to +1 (the far plane) on the right, y from −1 to +1.', () => {
        title(N0.x, -20, '4  NDC  (P, then ÷ w)');
        k.poly([m4(-1, -1), m4(1, -1), m4(1, 1), m4(-1, 1)], { close: true, cls: 'given' });
        k.seg(m4(-1, 0), m4(1, 0), { cls: 'aux', dash: true });
        k.seg(m4(0, -1), m4(0, 1), { cls: 'aux', dash: true });
        k.label(m4(-1, -1), 'near', 's', { upright: true, size: 0.8 });
        k.label(m4(1, -1), 'far', 's', { upright: true, size: 0.8 });
      });

      const cubeCorners = [[1, -1, -1], [1, 1, -1], [1, 1, 1], [1, -1, 1]].map(q => ndcOf(q));
      k.step('ruler', 'Lay off the cube: its faces at depth 4 and 6 have z_ndc = (11 − 20/d)/9 = 0.667 and 0.852, and its edges y_ndc = ±1.732/d = ±0.433 and ±0.289. The cube is squeezed against the far plane; p lands at (z, y) = (0.667, 0.433).', () => {
        k.poly(cubeCorners.map(c => m4(c[2], c[1])), { close: true, cls: 'thick' });
        mark(m4(pn[2], pn[1]), 'p = (' + f3(pn[0]) + ', ' + f3(pn[1]) + ', ' + f3(pn[2]) + ')', 'w');
      });

      k.step('pencil', 'Window space. Draw the 1200 × 800 viewport and in it the picture of the cube, the front view through the whole chain: x_win = 600 (1 + x_ndc), y_win = 400 (1 − y_ndc), counted downwards from the top-left corner. Hidden edges dashed.', () => {
        title(C5.x, -20, '5  Window  (viewport)');
        k.poly([m5(0, 0), m5(W, 0), m5(W, Hh), m5(0, Hh)], { close: true, cls: 'given' });
        const M5 = M4.chain(M4.scale(W / 2 * kap, Hh / 2 * kap, 1), PVM);
        k.wire(M5, P.models.cube(2), { scale: 1, origin: C5, cls: 'thick' });
        mark(m5(px, py), '(' + f1(px) + ', ' + f1(py) + ') px, depth ' + f3(pz), 'ne');
      });

      k.note('Summary of the journey: p (1, 1, 1) → M → (1, 2, 1) → V → (1, 1, −4) → P → clip (' + f3(pc[0]) + ', ' + f3(pc[1]) + ', ' + f3(pc[2]) + ', ' + f3(pc[3]) + ') → ÷ w → (' + f3(pn[0]) + ', ' + f3(pn[1]) + ', ' + f3(pn[2]) + ') → viewport → pixel (' + f1(px) + ', ' + f1(py) + '), depth ' + f3(pz) + '.', () => {
        k.label(m5(0, 0), '(0, 0)', 'nw', { upright: true, size: 0.75, dist: 0.4 });
        k.label(m5(W, Hh), '(1200, 800)', 'se', { upright: true, size: 0.75, dist: 0.4 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 2 */
  Hyper.construction({
    id: 'cv-frustum-to-cube',
    title: 'The view frustum and its mapping onto the clip cube',
    tags: ['frustum', 'clip space', 'NDC', 'nonlinear depth'],
    note: 'Side view with a 60° field of view, near plane n = 1 and far plane f = 6, drawn to scale. The projection matrix sends the frustum to the cube [−1, 1]³: rays through the eye become parallel to the axis, the near plane goes to the left face, the far plane to the right face — and depth is spaced by z = (f + n)/(f − n) − 2fn/((f − n) d) = 1.4 − 2.4/d, so slices equally spaced in depth crowd towards the far face.',
    build(k) {
      const g = k.g, nn = 1, ff = 6, half = 30 * D2R, s = 34, tn = Math.tan(half);
      const A = (ff + nn) / (ff - nn), B = 2 * ff * nn / (ff - nn);
      const zOf = d => A - B / d;
      const E = k.pt(0, 0), m = (d, y) => k.pt(d * s, y * s), hOf = d => d * tn;
      const sc = ff * tn * s;                                     // half-height of the far plane, in paper units
      const cx = 270 + sc, cy = 0, c = (z, y) => k.pt(cx + z * sc, cy + y * sc);
      const ds = [1, 2, 3, 4, 5, 6];
      k.given('The eye E, the optical axis, the vertical field of view of 60° and the two planes n = 1 and f = 6 (side view; one unit of depth is 34 mm on the sheet, if you draw it full size).', () => {
        k.axes(E, { x: [-12, 222], y: [-125, 125], xl: 'd', yl: 'y' });
        k.point(E, 'E', 'sw');
        k.frame(-30, -150, cx + sc + 40, 150);
        k.fontScale(0.75);
      });
      k.step('protractor', 'Lay off 30° above and below the axis: the edges of the frustum, as far as the far plane.', () => {
        k.seg(E, m(ff, hOf(ff)), { cls: 'given' });
        k.seg(E, m(ff, -hOf(ff)), { cls: 'given' });
        k.angle(E, m(ff, 0), m(ff, hOf(ff)), { label: '30°', r: 6, labelDist: 0.7 });
      });
      k.step('ruler', 'Lay off the near plane at d = 1 and the far plane at d = 6 on the axis.', () => {
        k.point(m(nn, 0), 'n', 'sw'); k.point(m(ff, 0), 'f', 'sw');
      });
      k.step('tee', 'Draw both planes as verticals, from edge to edge of the frustum.', () => {
        k.seg(m(nn, -hOf(nn)), m(nn, hOf(nn)), { cls: 'thick' });
        k.seg(m(ff, -hOf(ff)), m(ff, hOf(ff)), { cls: 'thick' });
      });
      k.step('dividers', 'Step the depth from n to f in equal intervals: the slices d = 2, 3, 4, 5 divide the frustum into five equal layers.', () => {
        [2, 3, 4, 5].forEach(d => k.point(m(d, 0), String(d), 'sw'));
      });
      k.step('tee', 'Draw each slice as a vertical between the edges of the frustum.', () => {
        [2, 3, 4, 5].forEach(d => k.seg(m(d, -hOf(d)), m(d, hOf(d)), { cls: 'cons' }));
      });
      k.step('tee', 'The clip cube. Draw a square whose height is the far plane\'s: the near plane maps to its left side (z = −1) and the far plane to its right side (z = +1); the middle line is z = 0.', () => {
        k.poly([c(-1, -1), c(1, -1), c(1, 1), c(-1, 1)], { close: true, cls: 'given' });
        k.seg(c(0, -1), c(0, 1), { cls: 'aux', dash: true });
        k.label(c(-1, 1), 'near', 'n', { upright: true, size: 0.8 }); k.label(c(1, 1), 'far', 'n', { upright: true, size: 0.8 });
      });
      k.step('ruler', 'Lay off the depth of each slice on the cube\'s axis from z = 1.4 − 2.4/d: −1, 0.2, 0.6, 0.8, 0.92, 1. Half the cube (z < 0) is used up by depths between 1 and 1.71 alone.', () => {
        ds.forEach(d => k.dot(c(zOf(d), 0), {}));
        [2, 3, 4, 5].forEach((d, i) => k.label(c(zOf(d), 0), f2(zOf(d)), i % 2 ? 'ne' : 'se', { upright: true, size: 0.75 }));
      });
      k.step('tee', 'Draw each slice as a full-height vertical of the cube: a plane of constant depth is still a plane, but the planes are no longer equally spaced.', () => {
        [2, 3, 4, 5].forEach(d => k.seg(c(zOf(d), -1), c(zOf(d), 1), { cls: 'cons' }));
      });
      k.step('straightedge', 'Rays through the eye: draw the rays at 15° and 30° above the axis. In the cube they become horizontals at y = tan 15°/tan 30° = 0.464 and y = 1: perspective has made the rays parallel.', () => {
        const r15 = g.polar(E, ff * s * 1.02, 15 * D2R);
        k.seg(E, r15, { cls: 'red' });
        const y15 = Math.tan(15 * D2R) / tn;
        k.seg(c(-1, y15), c(1, y15), { cls: 'red' });
        k.label(r15, '15°', 'e', { upright: true, size: 0.75 }); k.label(c(1, y15), '0.464', 'e', { upright: true, size: 0.75 });
      });
      k.note('The slice halfway between n and f, d = 3.5, lands at z = ' + f2(zOf(3.5)) + ', not at the middle of the cube: depth through a perspective matrix is a function of 1/d.', () => {
        k.dim(c(zOf(1), -1.12), c(zOf(2), -1.12), 'd from 1 to 2: 60 % of the cube', { dist: 0.3, size: 0.75, upright: true });
        k.dim(c(zOf(5), -1.12), c(zOf(6), -1.12), 'd 5 to 6: 4 %', { dist: 0.3, size: 0.75, upright: true });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 3 */
  Hyper.construction({
    id: 'cv-depth-curve',
    title: 'The depth-buffer curve, plotted from the levels of a 3-bit buffer',
    tags: ['depth buffer', 'z-fighting', 'precision', 'hyperbola'],
    note: 'With n = 1 and f = 10 the depth stored in NDC is z = 1.222 − 2.222/d. A 3-bit buffer has only eight levels; the curve is found by asking, for each level, at which distance the buffer steps to it. A real 24-bit buffer has 16 million levels but the same shape: nearly all of them lie close to the near plane. The dashed straight line is what the depth would be if it were linear in the distance.',
    build(k) {
      const g = k.g, nn = 1, ff = 10, A = (ff + nn) / (ff - nn), B = 2 * ff * nn / (ff - nn);
      const zOf = d => A - B / d, dOf = z => B / (A - z);
      const sx = 34, sy = 115, X = d => d * sx, Y = z => z * sy, p = (d, z) => k.pt(X(d), Y(z));
      const levels = []; for (let i = 0; i <= 8; i++) levels.push(-1 + i * 0.25);
      k.given('Axes: the distance d from 0 to 10 along the bottom (one unit = 34 on the sheet), the stored depth z_ndc from −1 to +1 up the side. Near plane n = 1, far plane f = 10, and a 3-bit buffer with eight levels.', () => {
        k.seg(p(0, -1), p(10.4, -1), { cls: 'axis' });
        k.seg(p(0, -1), p(0, 1.12), { cls: 'axis' });
        for (let d = 0; d <= 10; d += 1) { k.tick(p(d, -1), k.pt(1, 0), {}); if (d % 2 === 0) k.label(p(d, -1), String(d), 's', { upright: true, size: 0.8 }); }
        [-1, 0, 1].forEach(z => { k.tick(p(0, z), k.pt(0, 1), {}); k.label(p(0, z), (z > 0 ? '+' : z < 0 ? '−' : '') + Math.abs(z), 'w', { upright: true, size: 0.8 }); });
        k.label(p(10.4, -1), 'd', 'e', { size: 0.9 }); k.label(p(0, 1.12), 'z_{ndc}', 'n', { size: 0.9 });
        k.frame(-40, -150, 380, 150);
        k.fontScale(0.8);
      });
      k.step('dividers', 'Divide the height from −1 to +1 into eight equal levels (a 3-bit buffer): 0.25 apart.', () => {
        levels.forEach(z => k.dot(p(0, z), { r: 0.7 }));
      });
      k.step('tee', 'Draw a horizontal through each level.', () => {
        levels.forEach(z => k.seg(p(0, z), p(10, z), { cls: 'cons' }));
      });
      k.step('ruler', 'For each level find the distance at which the buffer reaches it, d = 2.222/(1.222 − z): 1.00, 1.13, 1.29, 1.51, 1.82, 2.29, 3.08, 4.71 and 10 (the far plane). Lay these off on the d axis.', () => {
        levels.forEach(z => { const d = dOf(z); k.dot(p(d, -1), { r: 0.8 }); });
        [-1, -0.5, 0, 0.5, 0.75, 1].forEach(z => k.label(p(dOf(z), z), f2(dOf(z)), 'se', { upright: true, size: 0.7, dist: 0.9 }));
      });
      k.step('square', 'Through each mark draw a vertical up to its level. The crossings are eight points of the depth curve.', () => {
        levels.forEach(z => { const d = dOf(z); k.seg(p(d, -1), p(d, z), { cls: 'cons' }); k.dot(p(d, z), { r: 0.9, cls: 'red' }); });
      });
      k.step('pencil', 'Draw the curve through the points (a French curve helps): a hyperbola, steep at the near plane, nearly flat towards the far plane.', () => {
        k.curve(d => [X(d), Y(zOf(d))], [1, 10], { cls: 'curve', n: 240 });
      });
      k.note('Compare with a linear depth (dashed): the curve is far above it everywhere. Read the steps along the d axis: the first level change takes only 0.13 of distance, the last one 5.3 — over half the range.', () => {
        k.seg(p(1, -1), p(10, 1), { cls: 'aux', dash: true });
        k.dim(p(dOf(-1), -1.2), p(dOf(-0.75), -1.2), 'first step 0.13', { dist: 0.2, size: 0.75, upright: true });
        k.dim(p(dOf(0.75), -1.2), p(dOf(1), -1.2), 'last step 5.3', { dist: 0.2, size: 0.75, upright: true });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 4 */
  Hyper.construction({
    id: 'cv-shadow-section',
    title: 'A shadow map by hand: two linked drawings of a cross-section',
    tags: ['shadow map', 'depth', 'orthographic light', 'bias'],
    note: 'A cross-section through a scene lit by a directional light (an orthographic camera looking along ℓ, 35° from the vertical). The upper drawing is the scene with the light\'s rays; the lower drawing is the shadow map itself — for each of 13 texels along the light\'s image line the depth of the nearest surface, drawn as a bar. A point seen by the camera E is in shadow when its own depth along ℓ is larger than the bar of its texel (plus a small bias, here 7 units, about half the depth change across a texel on the ground: 20 tan 35°).',
    build(k) {
      const g = k.g, ang = 35 * D2R, bias = 7;
      const l = k.pt(Math.sin(ang), -Math.cos(ang)), uh = k.pt(Math.cos(ang), Math.sin(ang));
      const L0 = k.pt(-60, 140);
      const Lp = u => g.add(L0, g.mul(uh, u)), depthOf = Pt => g.dot(g.sub(Pt, L0), l), uOf = Pt => g.dot(g.sub(Pt, L0), uh);
      const G0 = k.pt(-40, 0), G1 = k.pt(260, 0);
      const bx0 = 60, bx1 = 140, bh = 60;
      const surfaces = [[G0, G1], [k.pt(bx0, bh), k.pt(bx1, bh)], [k.pt(bx0, 0), k.pt(bx0, bh)], [k.pt(bx1, 0), k.pt(bx1, bh)]];
      const firstHit = O => {
        let best = null; const far = g.add(O, g.mul(l, 1200));
        surfaces.forEach(([a, b]) => { const h = g.segSeg(O, far, a, b); if (h) { const s = g.dist(O, h); if (!best || s < best.s) best = { p: h, s }; } });
        return best;
      };
      const N = 13, TW = 20, u0 = -70, centre = i => u0 + TW * i + TW / 2;
      const hits = []; for (let i = 0; i < N; i++) hits.push(firstHit(Lp(centre(i))));
      const E = k.pt(120, 165), Qs = [14, 160, 234].map(x => k.pt(x, 0));
      const texelOf = Pt => Math.floor((uOf(Pt) - u0) / TW);
      const verdict = Qs.map(Q => { const i = texelOf(Q), stored = hits[i].s, d = depthOf(Q); return { i, stored, d, shadow: d > stored + bias }; });
      // the graph: u runs along the horizontal, depth s upwards (0.4 per unit)
      const OB = k.pt(-40, -175), gx = u => OB.x + (u - u0), gy = s => OB.y + 0.4 * s;
      const shadowEnd = bx1 + bh * Math.tan(ang);

      k.given('The scene in cross-section: level ground, a box 80 wide and 60 high, a directional light ℓ falling 35° from the vertical, and a camera E that sees the three ground points Q₁, Q₂, Q₃.', () => {
        k.seg(G0, G1, { cls: 'given' });
        k.poly([k.pt(bx0, 0), k.pt(bx1, 0), k.pt(bx1, bh), k.pt(bx0, bh)], { close: true, cls: 'given' });
        k.arrow(k.pt(-122, 222), g.add(k.pt(-122, 222), g.mul(l, 46)), { cls: 'given' });
        k.label(k.pt(-122, 222), 'light ℓ', 'nw', { upright: true, size: 0.9 });
        k.point(E, 'E (camera)', { at: 'ne', lo: { upright: true, size: 0.85 } });
        Qs.forEach((Q, j) => { k.seg(E, Q, { cls: 'cons' }); k.point(Q, 'Q_' + (j + 1), { at: 's', lo: { upright: true, size: 0.85 } }); });
        k.frame(-135, -205, 285, 255);
        k.fontScale(0.62);
      });
      k.step('square', 'The light\'s image line (the film of the shadow map): draw a line perpendicular to ℓ, upstream of the whole scene.', () => {
        k.seg(Lp(u0), Lp(u0 + N * TW), { cls: 'thick' });
        k.label(Lp(u0 + N * TW), 'light\'s image line', 'e', { upright: true, size: 0.8 });
      });
      k.step('dividers', 'Divide it into 13 texels of width 20: step the dividers along the line and mark the texel edges.', () => {
        for (let i = 0; i <= N; i++) k.tick(Lp(u0 + i * TW), uh, { size: 1.1 });
      });
      k.step('square', 'Through the centre of every texel draw a ray parallel to ℓ, as far as the first surface it meets — the ground, the top of the box or its left face.', () => {
        hits.forEach((h, i) => k.seg(Lp(centre(i)), h.p, { cls: 'cons' }));
      });
      k.step('pencil', 'Mark the first hit of every ray: these are the surfaces the light can see. The rays on the right of the box land on its top and then, 22 units beyond its edge, on the ground again — the ground between them is hidden from the light.', () => {
        hits.forEach(h => k.dot(h.p, { r: 0.9, cls: 'red' }));
      });
      k.step('tee', 'The shadow map. Below the scene draw the graph of the map: u along the light\'s image line to the right, and the depth s (the distance from that line along the ray) upwards.', () => {
        k.seg(OB, k.pt(OB.x + N * TW + 14, OB.y), { cls: 'axis' });
        k.seg(OB, k.pt(OB.x, OB.y + 0.4 * 330), { cls: 'axis' });
        k.label(k.pt(OB.x + N * TW + 14, OB.y), 'u', 'e', { size: 0.9 });
        k.label(k.pt(OB.x, OB.y + 0.4 * 330), 'depth s', 'n', { upright: true, size: 0.85 });
      });
      k.step('dividers', 'Carry the length of each ray into the graph with the dividers: one bar per texel, at the texel\'s u. The bars are the depth map — a profile of the surfaces as the light sees them.', () => {
        hits.forEach((h, i) => k.rect(gx(centre(i) - 7), OB.y, gx(centre(i) + 7), gy(h.s), { cls: 'given' }));
      });
      k.step('square', 'For each ground point Q seen by the camera draw its own ray back towards the light, parallel to ℓ: it meets the image line at the point that gives Q its texel (u) and its length is the depth of Q.', () => {
        Qs.forEach(Q => k.seg(Q, Lp(uOf(Q)), { cls: 'red', dash: true }));
      });
      k.step('dividers', 'Plot Q₁, Q₂, Q₃ in the graph at (u, depth): carry u from the image line along the dividers and the length of the dashed ray upwards.', () => {
        Qs.forEach((Q, j) => {
          const P = k.pt(gx(uOf(Q)), gy(depthOf(Q)));
          k.seg(k.pt(P.x, OB.y), P, { cls: 'cons', dotted: true });
          k.point(P, 'Q_' + (j + 1), { at: 'ne', open: true, lo: { upright: true, size: 0.85 } });
        });
      });
      k.note('Compare each point with the bar of its texel (the short tick is the stored depth plus the bias). ' + verdict.map((v, j) => 'Q' + ['₁', '₂', '₃'][j] + ' is ' + (v.shadow ? 'farther than the lit surface: in shadow' : 'on the lit surface: lit')).join('; ') + '. The shadow on the ground runs from the box (x = 140) to x = ' + Math.round(shadowEnd) + '.', () => {
        hits.forEach((h, i) => { const y = gy(h.s + bias); k.seg(k.pt(gx(centre(i) - 7), y), k.pt(gx(centre(i) + 7), y), { cls: 'aux' }); });
        k.seg(k.pt(bx1, 0), k.pt(shadowEnd, 0), { cls: 'red', width: 3 });
        verdict.forEach((v, j) => k.label(Qs[j], v.shadow ? 'shadow' : 'lit', 'se', { upright: true, size: 0.8, fill: v.shadow ? '#b03a2e' : '#2d7a3a', dist: 2.2 }));
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 5 */
  Hyper.construction({
    id: 'cv-iso-2to1',
    title: 'The 2 : 1 pixel-art grid beside the true 30° isometric grid',
    tags: ['isometric', 'dimetric', 'pixel art', 'tile grid', 'dividers'],
    note: 'A 4 × 4 map of tiles 64 pixels wide and 32 high, drawn the way a pixel artist builds it: only the dividers and a straightedge are needed, because every tile edge climbs exactly one pixel for every two across (26.57°). The true isometric diamond of the same width is taller (36.95 px) and its edges climb at 30°; the dashed overlay shows how the two drift apart — by 20 pixels over four tiles.',
    build(k) {
      const g = k.g, w = 64, h = 32, n = 4, ht = w / Math.sqrt(3);
      const R = (i, j) => k.pt((i - j) * w / 2, -(i + j) * h / 2);
      const T = (i, j) => k.pt((i - j) * w / 2, -(i + j) * ht / 2);
      const O = R(0, 0), Bm = R(n, n);
      k.given('The top corner O of the map, and the tile: 64 pixels wide and 32 high (take both with the dividers from a pixel scale).', () => {
        k.point(O, 'O', 'n');
        k.line(k.pt(-170, 0), k.pt(300, 0), { cls: 'cons' });
        const a = k.pt(-165, 24), b = k.pt(-165 + w, 24), c = k.pt(-165, -24), d = k.pt(-165, -24 - h);
        k.seg(a, b, { cls: 'given' }); k.tick(a, k.pt(1, 0)); k.tick(b, k.pt(1, 0)); k.dim(a, b, 'w = 64', { dist: 1.0, size: 0.8, upright: true });
        k.seg(c, d, { cls: 'given' }); k.tick(c, k.pt(0, 1)); k.tick(d, k.pt(0, 1)); k.dim(c, d, 'h = 32', { dist: 1.2, size: 0.8, upright: true, side: 'right' });
        k.frame(-190, -185, 300, 40);
        k.fontScale(0.7);
      });
      k.step('dividers', 'From O step 32 across and 16 down, four times to the right and four times to the left: the points R₁…R₄ and L₁…L₄ (each step is one half-tile).', () => {
        for (let q = 1; q <= n; q++) { k.point(R(q, 0), 'R_' + q, { at: 'e', lo: { upright: true, size: 0.8 } }); k.point(R(0, q), 'L_' + q, { at: 'w', lo: { upright: true, size: 0.8 } }); }
      });
      k.step('straightedge', 'Join O to R₄ and to L₄: the two upper edges of the map rise 1 : 2 towards O.', () => {
        k.seg(O, R(n, 0), { cls: 'thick' }); k.seg(O, R(0, n), { cls: 'thick' });
      });
      k.step('dividers', 'Carry the 128 pixels (four tile heights) straight down from O: the bottom corner B.', () => {
        k.point(Bm, 'B', 's');
      });
      k.step('straightedge', 'Join R₄ and L₄ to B: the outline of the map is a diamond 256 wide and 128 high.', () => {
        k.seg(R(n, 0), Bm, { cls: 'thick' }); k.seg(R(0, n), Bm, { cls: 'thick' });
      });
      k.step('square', 'Through R₁, R₂, R₃ draw lines parallel to O L₄, and through L₁, L₂, L₃ lines parallel to O R₄: the tile grid. Every edge steps two pixels across for one down.', () => {
        for (let q = 1; q < n; q++) { k.seg(R(q, 0), R(q, n), { cls: 'cons' }); k.seg(R(0, q), R(n, q), { cls: 'cons' }); }
      });
      k.note('The true isometric for comparison (dashed): the same 64-pixel width but edges at 30°. Its bottom corner is 147.8 pixels below O, not 128: the 2 : 1 map is a squashed dimetric view, elevation 30° instead of 35.26°.', () => {
        k.seg(O, T(n, 0), { cls: 'red', dash: true }); k.seg(O, T(0, n), { cls: 'red', dash: true });
        k.seg(T(n, 0), T(n, n), { cls: 'red', dash: true }); k.seg(T(0, n), T(n, n), { cls: 'red', dash: true });
        k.angle(O, R(n, 0), k.pt(300, 0), { label: '26.57°', r: 9.5, labelDist: 1.0 });
        k.angle(O, T(n, 0), k.pt(300, 0), { label: '30°', r: 12.5, labelDist: 1.0, cls: 'red' });
        k.label(T(n, n), 'B (true isometric)', 's', { upright: true, size: 0.8, fill: '#b03a2e' });
      });
      k.note('Why the pixel artists choose 2 : 1. Left to right, sixteen pixels of a tile edge, magnified: at 2 : 1 the steps are all two across and one down; at 30° the run lengths wander between one and two.', () => {
        const sc = 4, x0 = 170, stair = (y0, rowOf) => { const pts = []; for (let c = 0; c < 16; c++) { const r = rowOf(c); pts.push([x0 + c * sc, y0 - r * sc], [x0 + (c + 1) * sc, y0 - r * sc]); } return pts; };
        k.curve(stair(-30, c => Math.floor(c / 2)), null, { cls: 'cons', width: 1.6 });
        k.curve(stair(-90, c => Math.round(c * Math.tan(30 * Math.PI / 180))), null, { cls: 'red', width: 1.6 });
        k.label(k.pt(x0, -20), '2 : 1', 'sw', { upright: true, size: 0.8 }); k.label(k.pt(x0, -80), '30°', 'sw', { upright: true, size: 0.8 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 6 */
  Hyper.construction({
    id: 'cv-tile-unwarp',
    title: 'Un-warping a tile photographed in perspective: the four-point construction',
    tags: ['homography', 'vanishing points', 'cross-ratio', 'rectification'],
    note: 'The picture of a square tile is any convex quadrilateral. Its two pairs of opposite sides meet at the vanishing points V₁ and V₂; the diagonals meet at the picture O of the centre; a line from a vanishing point through O cuts the other pair of sides at their true midpoints. Repeating inside each quarter gives the 4 × 4 grid. The position of a sample point P in the real tile follows from the cross-ratio on the sides (the vanishing point plays the part of the point at infinity).',
    build(k) {
      const g = k.g;
      const A = k.pt(0, -90), B = k.pt(150, 5), C = k.pt(0, 36), D = k.pt(-150, 5), Pp = k.pt(60, -20);
      const V1 = g.lineLine(A, B, D, C), V2 = g.lineLine(A, D, B, C);
      const gp = {};                                           // the 5 × 5 grid points found by the hand method
      gp['0,0'] = A; gp['4,0'] = B; gp['4,4'] = C; gp['0,4'] = D;
      const split = (i0, j0, st) => {
        const q = [gp[i0 + ',' + j0], gp[(i0 + st) + ',' + j0], gp[(i0 + st) + ',' + (j0 + st)], gp[i0 + ',' + (j0 + st)]], hs = st / 2;
        const O = g.lineLine(q[0], q[2], q[1], q[3]);
        gp[(i0 + hs) + ',' + (j0 + hs)] = O;
        gp[(i0 + hs) + ',' + j0] = g.lineLine(q[0], q[1], O, V2);
        gp[(i0 + hs) + ',' + (j0 + st)] = g.lineLine(q[3], q[2], O, V2);
        gp[i0 + ',' + (j0 + hs)] = g.lineLine(q[0], q[3], O, V1);
        gp[(i0 + st) + ',' + (j0 + hs)] = g.lineLine(q[1], q[2], O, V1);
      };
      split(0, 0, 4); [[0, 0], [2, 0], [0, 2], [2, 2]].forEach(([i, j]) => split(i, j, 2));
      const O = gp['2,2'];
      // the exact projective map from the unit square, for the check and for the sample point
      const sq = (u, v) => {
        const [x0, y0, x1, y1, x2, y2, x3, y3] = [A.x, A.y, B.x, B.y, C.x, C.y, D.x, D.y];
        const dx1 = x1 - x2, dx2 = x3 - x2, dx3 = x0 - x1 + x2 - x3, dy1 = y1 - y2, dy2 = y3 - y2, dy3 = y0 - y1 + y2 - y3, den = dx1 * dy2 - dy1 * dx2;
        const gg = (dx3 * dy2 - dy3 * dx2) / den, hh = (dx1 * dy3 - dy1 * dx3) / den, w = gg * u + hh * v + 1;
        return k.pt(((x1 - x0 + gg * x1) * u + (x3 - x0 + hh * x3) * v + x0) / w, ((y1 - y0 + gg * y1) * u + (y3 - y0 + hh * y3) * v + y0) / w);
      };
      const param = (P0, P1, Vinf, X) => {                  // coordinate of X on the line P0P1 (0 at P0, 1 at P1) from the cross-ratio with the point Vinf at infinity
        const e = g.unit(g.sub(P1, P0)), t = Y => g.dot(g.sub(Y, P0), e), tb = t(P1), tv = t(Vinf), tx = t(X);
        const r = (tx * (tv - tb)) / ((tx - tb) * tv); return r / (r - 1);
      };
      const Pa = g.lineLine(A, D, Pp, V1), Pb = g.lineLine(A, B, Pp, V2);
      const u = param(A, B, V1, Pb), v = param(A, D, V2, Pa);
      const S = 150, A2 = k.pt(-75, -330), sqp = (a, b) => k.pt(A2.x + a * S, A2.y + b * S);
      k.given('A square tile has been photographed: its picture is the quadrilateral ABCD, with the corners A, B, C, D standing for (0, 0), (1, 0), (1, 1), (0, 1) of the tile. P is a point of the picture whose place on the tile we want.', () => {
        k.poly([A, B, C, D], { close: true, cls: 'thick' });
        k.point(A, 'A', 's'); k.point(B, 'B', 'e'); k.point(C, 'C', 'n'); k.point(D, 'D', 'w');
        k.point(Pp, 'P', { at: 'se', cls: 'red', lo: { cls: 'red', upright: true } });
        k.frame(-340, -380, 340, 140);
        k.fontScale(0.65);
      });
      k.step('straightedge', 'Extend the opposite sides AB and DC until they meet at V₁, and AD and BC until they meet at V₂: the vanishing points of the two directions of the tile.', () => {
        k.seg(B, V1, { cls: 'cons' }); k.seg(C, V1, { cls: 'cons' }); k.seg(D, V2, { cls: 'cons' }); k.seg(C, V2, { cls: 'cons' });
        k.point(V1, 'V_1', 'ne'); k.point(V2, 'V_2', 'nw');
      });
      k.step('straightedge', 'Join V₁ and V₂: the horizon (vanishing line) of the plane of the tile. Every direction on the tile vanishes on it.', () => {
        k.seg(V1, V2, { cls: 'cons', dash: true });
      });
      k.step('straightedge', 'Draw the diagonals AC and BD: they cross at O, the picture of the centre of the tile (not the midpoint of anything on the photograph).', () => {
        k.seg(A, C, { cls: 'cons' }); k.seg(B, D, { cls: 'cons' });
        k.point(O, 'O', 'se');
      });
      k.step('straightedge', 'Join O to V₁ and to V₂, as far as the sides. The line through V₂ cuts AB and DC at their true midpoints, the line through V₁ cuts AD and BC at theirs: the tile is divided into four.', () => {
        k.seg(gp['2,0'], gp['2,4'], { cls: 'cons' }); k.seg(gp['0,2'], gp['4,2'], { cls: 'cons' });
        ['2,0', '2,4', '0,2', '4,2'].forEach(key => k.dot(gp[key], { r: 0.7 }));
      });
      k.step('straightedge', 'Repeat in each quarter (diagonals, then the lines to V₁ and V₂): the 4 × 4 grid of the tile, found with the straightedge alone.', () => {
        for (let a = 1; a <= 3; a += 2) { k.seg(gp[a + ',0'], gp[a + ',4'], { cls: 'cons' }); k.seg(gp['0,' + a], gp['4,' + a], { cls: 'cons' }); }
      });
      k.step('ruler', 'The real tile. Next to the photograph draw a true square of side 150, A′B′C′D′, and divide each side into four equal parts with the dividers.', () => {
        k.poly([sqp(0, 0), sqp(1, 0), sqp(1, 1), sqp(0, 1)], { close: true, cls: 'thick' });
        k.label(sqp(0, 0), 'A′', 'sw', { upright: true }); k.label(sqp(1, 0), 'B′', 'se', { upright: true }); k.label(sqp(1, 1), 'C′', 'ne', { upright: true }); k.label(sqp(0, 1), 'D′', 'nw', { upright: true });
        for (let q = 1; q < 4; q++) { k.dot(sqp(q / 4, 0), { r: 0.6 }); k.dot(sqp(q / 4, 1), { r: 0.6 }); k.dot(sqp(0, q / 4), { r: 0.6 }); k.dot(sqp(1, q / 4), { r: 0.6 }); }
      });
      k.step('tee', 'Draw the grid of the square: horizontals and verticals through the division marks. Cell by cell it corresponds to the grid of the photograph.', () => {
        for (let q = 1; q < 4; q++) { k.seg(sqp(q / 4, 0), sqp(q / 4, 1), { cls: 'cons' }); k.seg(sqp(0, q / 4), sqp(1, q / 4), { cls: 'cons' }); }
      });
      k.step('straightedge', 'Place the point P. Draw the line from P to V₁: it cuts AD at P_a. Draw the line from P to V₂: it cuts AB at P_b.', () => {
        k.seg(Pp, Pa, { cls: 'red' }); k.seg(Pp, Pb, { cls: 'red' });
        k.point(Pa, 'P_a', { at: 'w', cls: 'red', lo: { cls: 'red', upright: true } }); k.point(Pb, 'P_b', { at: 'se', cls: 'red', lo: { cls: 'red', upright: true } });
      });
      k.step('ruler', 'On A′B′ and A′D′ lay off the true positions of P_b and P_a. The cross-ratio with the vanishing point gives them: u = ' + f3(u) + ' along AB and v = ' + f3(v) + ' along AD (the vanishing point stands for the point at infinity).', () => {
        k.dot(sqp(u, 0), { cls: 'red' }); k.dot(sqp(0, v), { cls: 'red' });
        k.label(sqp(u, 0), 'u = ' + f3(u), 's', { upright: true, size: 0.8, dist: 1.3 }); k.label(sqp(0, v), 'v = ' + f3(v), 'w', { upright: true, size: 0.8, dist: 1.3 });
      });
      k.step('tee', 'Draw the vertical through u and the horizontal through v: they meet at P′, the position of P on the real tile.', () => {
        k.seg(sqp(u, 0), sqp(u, v), { cls: 'red' }); k.seg(sqp(0, v), sqp(u, v), { cls: 'red' });
        k.point(sqp(u, v), 'P′', { at: 'ne', cls: 'red', lo: { cls: 'red', upright: true } });
      });
      k.note('Result: for a 1 m tile P is ' + Math.round(u * 100) + ' cm along AB and ' + Math.round(v * 100) + ' cm along AD. The exact homography gives the same point (to the width of the pencil line).', () => {
        const ex = sq(u, v); k.dot(ex, { r: 0.5, cls: 'aux' });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 7 */
  Hyper.construction({
    id: 'cv-two-stations',
    title: 'Two camera stations: the rays that cross at the point',
    tags: ['photogrammetry', 'triangulation', 'baseline', 'disparity', 'similar triangles'],
    note: 'A plan view. Two cameras with parallel axes stand a baseline B = 60 apart; each image plane is drawn in front of its centre at the focal distance f = 40 (the usual convention: the image is upright). The point P is measured at x₁ = +15 on the first picture and x₂ = −5 on the second, so the disparity is d = 20, and by similar triangles Z = fB/d = 120. The shaded diamond shows what a measuring error of 1.5 units in each image does: the depth is uncertain by about ±9, the sideways position by only ±1.5 — the baseline is what makes depth accurate.',
    build(k) {
      const g = k.g, B = 60, f = 40, Z = 120, Px = 15, delta = 1.5;
      const C1 = k.pt(-B / 2, 0), C2 = k.pt(B / 2, 0), P = k.pt(Px, Z);
      const x1 = f * (Px - C1.x) / Z, x2 = f * (Px - C2.x) / Z, d = x1 - x2;
      const p1 = k.pt(C1.x + x1, f), p2 = k.pt(C2.x + x2, f), p1s = k.pt(C2.x + x1, f);
      const ext = (C, Q, s) => g.add(C, g.mul(g.sub(Q, C), s));
      k.given('The two stations C₁ and C₂ a baseline B = 60 apart, their parallel optical axes, the image planes at the focal distance f = 40, and the measured image points p₁ (15 to the right of axis 1) and p₂ (5 to the left of axis 2).', () => {
        k.point(C1, 'C_1', { at: 'sw', lo: { upright: true } }); k.point(C2, 'C_2', { at: 'se', lo: { upright: true } });
        k.seg(C1, C2, { cls: 'given' }); k.dim(C1, C2, 'B = 60', { dist: 1.2, side: 'right', size: 0.8, upright: true });
        [C1, C2].forEach(C => { k.seg(k.pt(C.x, 0), k.pt(C.x, 150), { cls: 'aux', dotted: true }); k.seg(k.pt(C.x - 27, f), k.pt(C.x + 27, f), { cls: 'given' }); });
        k.point(p1, 'p_1', { at: 'nw', lo: { upright: true } }); k.point(p2, 'p_2', { at: 'ne', lo: { upright: true } });
        k.label(k.pt(C1.x - 27, f), 'image 1', 'w', { upright: true, size: 0.8 }); k.label(k.pt(C2.x + 27, f), 'image 2', 'e', { upright: true, size: 0.8 });
        k.frame(-75, -22, 80, 150);
        k.fontScale(0.8);
      });
      k.step('straightedge', 'Draw the ray from C₁ through p₁ and the ray from C₂ through p₂, and extend them: each is the line of sight to the point.', () => {
        k.seg(C1, ext(C1, P, 1.12), { cls: 'cons' }); k.seg(C2, ext(C2, P, 1.12), { cls: 'cons' });
      });
      k.step('pencil', 'Mark P where the two rays cross. Its distance from the baseline is the depth Z.', () => {
        k.point(P, 'P', 'e');
        k.seg(k.pt(P.x, 0), P, { cls: 'curve' });
        k.dim(k.pt(P.x, 0), P, 'Z', { dist: 1.2, size: 0.9, side: 'right' });
      });
      k.step('square', 'Through C₂ draw the parallel to the first ray C₁P: it meets the image plane of camera 2 at p₁′, exactly d to the right of p₂.', () => {
        k.seg(C2, p1s, { cls: 'red' });
        k.point(p1s, 'p_1′', { at: 'ne', cls: 'red', lo: { cls: 'red', upright: true } });
        k.dim(p2, p1s, 'd = 20', { dist: 2.2, size: 0.8, upright: true });
      });
      k.note('The triangle C₂ p₁′ p₂ (base d, height f) is similar to the triangle C₁ C₂ P (base B, height Z): Z / f = B / d, so Z = f B / d = 40 · 60 / 20 = 120. Near points have a large disparity, far points a small one.', () => {
        k.dim(k.pt(C2.x, 0), k.pt(C2.x, f), 'f = 40', { dist: 1.2, size: 0.8, side: 'right', upright: true });
      });
      const r1 = s => g.sub(k.pt(p1.x + s * delta, f), C1), r2 = s => g.sub(k.pt(p2.x + s * delta, f), C2);
      const quad = [[-1, -1], [1, -1], [1, 1], [-1, 1]].map(([a, b]) => g.lineLine(C1, g.add(C1, r1(a)), C2, g.add(C2, r2(b))));
      k.note('A matching error of ±1.5 in each picture moves each ray sideways at the image plane. The four limiting rays bound a diamond (hatched): long in the depth direction (about ±' + Math.round(Z * Z * delta / (f * B)) + '), narrow across. A longer baseline, or a longer focal length, shrinks it: δZ = Z² δd / (f B).', () => {
        quad.forEach((q, i) => k.seg(q, quad[(i + 1) % 4], { cls: 'red' }));
        k.hatch(quad, { gap: 0.28, outline: true });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 8 */
  Hyper.construction({
    id: 'cv-marker-pose',
    title: 'The pose of a square marker from its picture: focal length and tilt by compass',
    tags: ['augmented reality', 'marker', 'vanishing points', 'Thales circle', 'pose'],
    note: 'Two perpendicular directions of the marker vanish at V₁ and V₂, so the eye O sees them at a right angle: O lies on the circle with diameter V₁V₂ in the sense that O V₁ ⊥ O V₂ — and O is a height f above the principal point c. The foot F of the perpendicular from O on the horizon is the foot of the perpendicular from c, and in the right triangle V₁ O V₂ the altitude satisfies OF² = FV₁ · FV₂. Turning the plane O c F down into the picture turns this into a compass construction: it finds f, and the slope of the marker\'s plane to the sensor, with no calculation. (Here the marker has been photographed with f = 100, a yaw of 40° and a pitch of 45°.)',
    build(k) {
      const g = k.g, M4 = k.proj.mat4, D = Math.PI / 180, f0 = 100;
      const Rm = M4.chain(M4.rotX(-45 * D), M4.rotY(40 * D)), M = M4.chain(M4.translate(0.15, 0.05, -2.0), Rm);
      const cn = [[-0.5, -0.5, 0], [0.5, -0.5, 0], [0.5, 0.5, 0], [-0.5, 0.5, 0]].map(q => { const w = M4.point(M, q); return k.pt(f0 * w[0] / -w[2], f0 * w[1] / -w[2]); });
      const [A, B, C, D4] = cn, c = k.pt(0, 0);
      const V1 = g.lineLine(A, B, D4, C), V2 = g.lineLine(A, D4, B, C);
      const F = g.foot(c, V1, V2), e = g.dist(c, F), gg = Math.sqrt(g.dist(F, V1) * g.dist(F, V2));
      const Mid = g.mid(V1, V2), rad = g.dist(V1, V2) / 2;
      const nF = g.unit(g.sub(c, F));                                   // from the horizon towards c
      const T = g.add(F, g.mul(nF, gg));                                 // on the perpendicular at F, at distance sqrt(FV1·FV2)
      const hz = g.unit(g.sub(V2, V1)), sideO = g.dot(hz, g.perp(g.sub(c, F))) >= 0 ? 1 : -1;
      const Oc = g.add(c, g.mul(g.perp(nF), Math.sqrt(gg * gg - e * e) * sideO));   // the eye turned into the picture: O′
      const f = g.dist(c, Oc), slant = Math.atan2(f, e) / D;
      k.given('The picture of the marker: the quadrilateral ABCD (a square card, photographed obliquely) and the principal point c, the centre of the picture. Nothing else is known — not the focal length, not the pose.', () => {
        k.poly([A, B, C, D4], { close: true, cls: 'thick' });
        k.point(A, 'A', 'sw'); k.point(B, 'B', 'se'); k.point(C, 'C', 'ne'); k.point(D4, 'D', 'nw');
        k.point(c, 'c', { at: 'sw', cls: 'red', lo: { cls: 'red', upright: true } });
        k.seg(k.pt(-8, 0), k.pt(8, 0), { cls: 'aux' }); k.seg(k.pt(0, -8), k.pt(0, 8), { cls: 'aux' });
        k.frame(-60, -150, 215, 125);
        k.fontScale(0.62);
      });
      k.step('straightedge', 'Extend the sides AB and DC to V₁, and AD and BC to V₂: the vanishing points of the card\'s two directions.', () => {
        k.seg(B, V1, { cls: 'cons' }); k.seg(C, V1, { cls: 'cons' }); k.seg(D4, V2, { cls: 'cons' }); k.seg(C, V2, { cls: 'cons' });
        k.point(V1, 'V_1', 'e'); k.point(V2, 'V_2', 'n');
      });
      k.step('straightedge', 'Join V₁ and V₂: the horizon of the card\'s plane.', () => {
        k.seg(V1, V2, { cls: 'thick' });
      });
      k.step('square', 'From c drop the perpendicular onto the horizon: its foot is F, its length e = |cF|, and extend it on the other side of F.', () => {
        k.seg(c, F, { cls: 'cons' }); k.right(F, c, V2, { r: 0.8 });
        k.point(F, 'F', { at: 'ne', lo: { upright: true } });
        k.seg(F, g.add(F, g.mul(nF, -gg * 0.9)), { cls: 'cons' });
      });
      k.step('compass', 'Draw the circle on the diameter V₁V₂ about its midpoint. The perpendicular at F meets it at T, and |FT|² = |FV₁|·|FV₂| (the altitude in a right triangle).', () => {
        k.circle(Mid, rad, { cls: 'cons' });
        k.point(T, 'T', 'se');
        k.seg(F, T, { cls: 'thick' });
      });
      k.step('compass', 'With centre F and radius FT draw an arc. The eye O stands at height f above c; turned down into the picture it lies on this arc.', () => {
        if (g.cross(g.sub(T, F), g.sub(Oc, F)) > 0) k.arc3(F, T, Oc, { cls: 'cons' }); else k.arc3(F, Oc, T, { cls: 'cons' });
      });
      k.step('square', 'Through c draw the parallel to the horizon: it meets the arc at O′, the eye turned into the picture. Its distance from c is the focal length: f = |cO′|.', () => {
        k.seg(c, Oc, { cls: 'curve' });
        k.line(c, g.add(c, hz), { cls: 'cons' });
        k.point(Oc, 'O′', { at: 'n', cls: 'red', lo: { cls: 'red', upright: true } });
        k.dim(c, Oc, 'f = ' + f1(f), { dist: 1.2, size: 0.8, upright: true });
      });
      k.step('protractor', 'Join O′ to F: the angle at F between FO′ and Fc is the slant σ of the card\'s plane against the sensor, tan σ = f / e. A frontal card has σ = 0°, a card seen edge-on 90°.', () => {
        k.seg(Oc, F, { cls: 'thick' });
        if (g.cross(g.sub(c, F), g.sub(Oc, F)) > 0) k.angle(F, c, Oc, { label: 'σ = ' + f1(slant) + '°', r: 3.2, labelDist: 1.25 }); else k.angle(F, Oc, c, { label: 'σ = ' + f1(slant) + '°', r: 3.2, labelDist: 1.25 });
      });
      const r1 = g.sub(V1, c), r2 = g.sub(V2, c);
      const n3 = v => { const l = Math.hypot(v.x, v.y, f); return [v.x / l, v.y / l, f / l]; };
      const a1 = n3(r1), a2 = n3(r2), nrm = [a1[1] * a2[2] - a1[2] * a2[1], a1[2] * a2[0] - a1[0] * a2[2], a1[0] * a2[1] - a1[1] * a2[0]];
      k.note('Pose: f = ' + f1(f) + ' (the true value was 100), slant σ = ' + f1(slant) + '°. The card\'s axes point along (V − c, f): r₁ = (' + a1.map(f2).join(', ') + '), r₂ = (' + a2.map(f2).join(', ') + '), whose dot product is ' + f3(a1[0] * a2[0] + a1[1] * a2[1] + a1[2] * a2[2]) + ' (perpendicular, as the card requires). The normal r₃ = r₁ × r₂ = (' + nrm.map(f2).join(', ') + '). The distance then comes from the size: a card of side L that appears ℓ wide is about f L / ℓ away.', () => {
        k.circle(c, 1.2, { cls: 'aux' });
      });
    }
  });


})();
