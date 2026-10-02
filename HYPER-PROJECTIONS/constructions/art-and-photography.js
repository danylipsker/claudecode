/* HYPER-PROJECTIONS · constructions/art-and-photography.js — constructions of the topic "Art and photography".
 *
 *   ap-focal-lengths     the cone of view of 24, 50 and 200 mm, the distance point at ±f, and the 24 mm picture of a cube with the 50 and 200 mm crops
 *   ap-scheimpflug       the Scheimpflug construction for a sharp ground: hinge circle, lens plane, film plane
 *   ap-shift-verticals   why a tilted camera makes verticals converge, and how a shift (rise) keeps the picture plane vertical
 *   ap-panorama-stitch   four overlapping rectilinear frames swung onto a cylinder and unrolled into a panorama
 *   ap-anamorphic-squeeze  a 2 : 1 squeeze: a circle drawn as a 2 : 1 ellipse by the concentric-circle method, and desqueezed
 *   ap-forced-stage      a raked, tapered stage that looks like a long hall: plan and section, with the false vanishing point
 *   ap-sidewalk-cube     a cube projected onto the pavement from the viewer's eye: elevation, plan, sight lines
 * Every shape is computed (k.g, closed formulas); every step names the tool it is made with.
 */
(function () {
  'use strict';
  const PI = Math.PI, D2R = PI / 180, R2D = 180 / PI;
  const CL = '5 1.2 0.8 1.2';
  const chain = (k, a, b, o) => k.seg(a, b, Object.assign({ cls: 'aux', dash: CL }, o || {}));
  /* clip the segment ab to the rectangle [x0, x1] × [y0, y1] (Liang–Barsky); null when it is outside */
  function clip(a, b, x0, y0, x1, y1) {
    let t0 = 0, t1 = 1; const dx = b.x - a.x, dy = b.y - a.y;
    for (const [p, q] of [[-dx, a.x - x0], [dx, x1 - a.x], [-dy, a.y - y0], [dy, y1 - a.y]]) {
      if (Math.abs(p) < 1e-12) { if (q < 0) return null; continue; }
      const t = q / p; if (p < 0) { if (t > t1) return null; if (t > t0) t0 = t; } else { if (t < t0) return null; if (t < t1) t1 = t; }
    }
    return [{ x: a.x + dx * t0, y: a.y + dy * t0 }, { x: a.x + dx * t1, y: a.y + dy * t1 }];
  }
  function dimension(k, A, B, off, text, o) {
    o = o || {};
    const g = k.g, u = g.unit(g.sub(B, A)), n = g.perp(u), e = off < 0 ? -1 : 1;
    const a = g.add(A, g.mul(n, off)), b = g.add(B, g.mul(n, off));
    k.seg(g.add(A, g.mul(n, e * (o.gap == null ? 1.2 : o.gap))), g.add(a, g.mul(n, e * 1.8)), { cls: 'cons' });
    k.seg(g.add(B, g.mul(n, e * (o.gap == null ? 1.2 : o.gap))), g.add(b, g.mul(n, e * 1.8)), { cls: 'cons' });
    k.seg(a, b, { cls: 'cons' }); k.head(a, g.mul(u, -1), { cls: 'cons', size: o.head || 1 }); k.head(b, u, { cls: 'cons', size: o.head || 1 });
    const m = g.mid(a, b); let ang = g.rad(g.angleOf(u)); if (ang > 90) ang -= 180; if (ang <= -90) ang += 180;
    k.text(m.x, m.y, text, { upright: true, bg: true, size: o.size || 0.75, rotate: ang });
  }

  /* ------------------------------------------------------------------------------------------ focal lengths */
  Hyper.construction({
    id: 'ap-focal-lengths',
    title: 'What a focal length does: the cone of view, the distance point and the crop',
    tags: ['photography', 'focal length', 'field of view', 'distance point', 'vanishing point', 'protractor'],
    note: 'Upper part: the lens seen from above, in millimetres on the film side. For a film plane at distance f from the lens, a frame 36 mm wide is seen under the angle 2 atan(18 / f): 73.7°, 39.6° and 10.3° for 24, 50 and 200 mm. Lines at 45° to the axis meet the film plane at the distance f on either side of the axis: this is the vanishing point of a building turned 45° to the camera, and it moves out in proportion to f. Lower part: the picture a 24 mm lens makes of a cube 3 m wide, 12 m away, camera 1.6 m above the ground, drawn eight times life size on the film; the nested frames are what the 50 and 200 mm lenses would record from the same spot: the same picture, enlarged. A telephoto does not change the perspective, only the part you keep.',
    build(k) {
      const g = k.g, P = k.pt, S = P(0, 0), F = [24, 50, 200], CLS = ['red', 'green', 'curve'], W2 = 18, YT = 215;
      const half = f => Math.atan(W2 / f);
      k.given('The lens, seen from above: S is the centre of the lens, the vertical line is its axis. A frame is 36 mm wide. Three lenses: 24, 50 and 200 mm. The film plane of each lies at the distance f from S, across the axis. The camera is level, so these are also the horizontal angles of view.', () => {
        chain(k, P(0, -8), P(0, YT + 6)); k.point(S, 'S', { at: 'sw', lo: { upright: true, size: 0.8 } });
        k.text(-218, 205, 'LENS SEEN FROM ABOVE', { anchor: 'start', upright: true, bold: true, size: 0.7 });
        k.text(-218, 195, 'frame 36 mm wide; lenses 24, 50 and 200 mm', { anchor: 'start', upright: true, size: 0.6 });
        k.frame(-232, -250, 232, 222); k.fontScale(0.75);
      });
      k.step('ruler', 'Lay off the focal length along the axis from S: 24, 50 and 200 mm, and mark the points F₂₄, F₅₀ and F₂₀₀.', () => {
        F.forEach((f, i) => { k.dot(P(0, f), { cls: CLS[i], r: 0.8 }); k.text(222, f + 7, 'f = ' + f + ' mm', { anchor: 'end', upright: true, size: 0.65, fill: ['#b03a2e', '#2d7a3a', '#0b4fa0'][i] }); });
      });
      k.step('tee', 'Through each of those points draw the film plane, square to the axis, and mark the frame: 18 mm either side of the axis (the dividers carry the half-width). The frame is the short thick bar.', () => {
        F.forEach((f, i) => { k.seg(P(-215, f), P(215, f), { cls: 'aux' }); k.seg(P(-W2, f), P(W2, f), { cls: CLS[i], width: 2.2 }); });
      });
      k.step('straightedge', 'From S draw a line through each end of each frame, and carry it on. These are the edges of the cone of view of the three lenses; the wide lens sees a wide wedge, the long lens a thin one.', () => {
        F.forEach((f, i) => [-1, 1].forEach(s => k.seg(S, P(s * W2 * YT / f, YT), { cls: CLS[i] })));
      });
      k.step('protractor', 'Measure the half-angle of each cone against the axis: 36.9°, 19.8° and 5.1°, so the angles of view are 73.7°, 39.6° and 10.3°. Check against 2 atan(18 / f).', () => {
        F.forEach((f, i) => { const a = half(f) * R2D; k.angle(S, g.polar(S, 1, PI / 2 - half(f)), P(0, 1), { label: a.toFixed(1) + '°', r: [3.2, 5.8, 8.8][i], labelDist: 0.9, cls: CLS[i] }); });
      });
      k.step('square', 'With the 45° set square draw the two lines at 45° to the axis. They cut the film planes at the distance f on each side of the axis: the points V₂₄, V₅₀ and V₂₀₀. A building turned 45° to the camera has its edges vanishing there; the focal length is the distance of that vanishing point from the centre.', () => {
        [-1, 1].forEach(s => k.seg(S, P(s * YT, YT), { cls: 'cons' }));
        F.forEach((f, i) => [-1, 1].forEach(s => k.point(P(s * f, f), s > 0 ? 'V_{' + f + '}' : '', { at: 'se', lo: { upright: true, size: 0.65 }, cls: CLS[i], r: 0.9 })));
      });
      /* the 24 mm picture of a cube, five times life size */
      const m = 8, C0 = P(0, -128), a = 3, h = 1.6, Hc = 3, c45 = Math.SQRT1_2;
      const Nw = { X: 0.4, Z: 12 }, Rw = { X: Nw.X + a * c45, Z: Nw.Z + a * c45 }, Lw = { X: Nw.X - a * c45, Z: Nw.Z + a * c45 };
      const img = (f, X, Y, Z) => P(C0.x + m * f * X / Z, C0.y + m * f * (Y - h) / Z);
      const V1 = P(C0.x + m * 24, C0.y), V2 = P(C0.x - m * 24, C0.y);
      const Nb = img(24, Nw.X, 0, Nw.Z), Nt = img(24, Nw.X, Hc, Nw.Z), xR = img(24, Rw.X, 0, Rw.Z).x, xL = img(24, Lw.X, 0, Lw.Z).x;
      const vline = (x, y0, y1) => [P(x, y0), P(x, y1)];
      k.step('ruler', 'The 24 mm picture. Draw the frame 36 × 24 eight times life size (288 × 192), the horizon through its centre C, and the two vanishing points of the 45° edges at 24 mm either side of C (192 on this scale): V₁ and V₂.', () => {
        k.rect(C0.x - 18 * m, C0.y - 12 * m, C0.x + 18 * m, C0.y + 12 * m, { cls: 'thick' });
        k.seg(P(C0.x - 215, C0.y), P(C0.x + 215, C0.y), { cls: 'cons' });
        k.point(C0, 'C', { at: 'ne', lo: { upright: true, size: 0.75 } }); k.point(V1, 'V_1', { at: 'n', lo: { upright: true, size: 0.75 }, cls: 'red' }); k.point(V2, 'V_2', { at: 'n', lo: { upright: true, size: 0.75 }, cls: 'red' });
      });
      k.step('ruler', 'The cube\'s nearest vertical edge (1.6 m below the lens at the bottom, 1.4 m above at the top) stands 0.4 m right of the axis, 12 m away: on the film it is 0.8 mm right of C, from 3.2 mm below to 2.8 mm above the horizon. Lay it off (×8). The two other vertical edges stand at 4.3 mm right and 2.9 mm left of C (from the angles at S).', () => {
        k.seg(Nb, Nt, { cls: 'cons' }); k.point(Nb, 'N', { at: 'sw', lo: { upright: true, size: 0.7 } });
        const vr = vline(xR, C0.y - 12 * m, C0.y + 12 * m), vl = vline(xL, C0.y - 12 * m, C0.y + 12 * m);
        k.seg(vr[0], vr[1], { cls: 'aux' }); k.seg(vl[0], vl[1], { cls: 'aux' });
      });
      k.step('straightedge', 'From the bottom and the top of the near edge draw lines to V₁ and to V₂: the receding edges of the two faces. Where they cross the other two vertical edges lie the corners R and L.', () => {
        [Nb, Nt].forEach(p => { k.seg(p, V1, { cls: 'cons' }); k.seg(p, V2, { cls: 'cons' }); });
      });
      const Rb = g.lineLine(Nb, V1, P(xR, 0), P(xR, 1)), Rt = g.lineLine(Nt, V1, P(xR, 0), P(xR, 1)), Lb = g.lineLine(Nb, V2, P(xL, 0), P(xL, 1)), Lt = g.lineLine(Nt, V2, P(xL, 0), P(xL, 1));
      k.step('straightedge', 'Mark the corners R and L where those receding lines meet the two outer vertical edges. The cube is higher than the lens, so we look up at it: its top face and its far corner are hidden behind the two faces we see.', () => {
        [[Rb, 'R', 'e'], [Lb, 'L', 'w']].forEach(([p, t, at]) => k.point(p, t, { at, lo: { upright: true, size: 0.7 } })); k.dot(Rt, { r: 0.9 }); k.dot(Lt, { r: 0.9 }); k.dot(Nt, { r: 0.9 });
      });
      k.step('pencil', 'Line in the cube: the three vertical edges, the two base edges NR and NL, and the two top edges NtRt and NtLt.', () => {
        [[Nb, Nt], [Rb, Rt], [Lb, Lt], [Nb, Rb], [Nb, Lb], [Nt, Rt], [Nt, Lt]].forEach(([p, q]) => k.seg(p, q, { cls: 'thick' }));
      });
      k.note('The same picture from the same spot with a 50 mm lens is the inner frame (138 × 92 at this scale, a crop 2.1 times smaller); with a 200 mm lens only the tiny innermost frame (35 × 23), 8.3 times smaller: it holds the middle of the near edge and little else. Enlarge each to the full frame and you have the 50 and 200 mm pictures. Move the camera and the perspective changes; change the focal length from where you stand and it does not.', () => {
        [[50, 'green'], [200, 'curve']].forEach(([f, c]) => { const hx = m * W2 * 24 / f, hy = m * 12 * 24 / f; k.rect(C0.x - hx, C0.y - hy, C0.x + hx, C0.y + hy, { cls: c, width: 1.6 }); k.text(C0.x + hx + 3, C0.y + hy + 4, f + ' mm', { anchor: 'start', upright: true, size: 0.6, fill: c === 'green' ? '#2d7a3a' : '#0b4fa0' }); });
        k.text(C0.x, C0.y - 12 * m - 10, '24 mm PICTURE AND THE CROPS OF 50 AND 200 mm', { upright: true, size: 0.65 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------ Scheimpflug */
  Hyper.construction({
    id: 'ap-scheimpflug',
    title: 'The Scheimpflug construction: tilting the lens to keep the whole ground sharp',
    tags: ['view camera', 'Scheimpflug', 'tilt', 'plane of focus', 'hinge rule', 'compass'],
    note: 'Side view, millimetres, drawn full size. The film plane stays vertical; the lens plane is tilted by θ. Scheimpflug\'s rule: the plane of the film, the plane of the lens and the plane of sharp focus meet in one line (a point Q in this side view). The hinge rule of Merklinger gives the same result in another way: the plane of focus passes through the point H, straight below the lens at the distance J = f / sin θ, so it is the lens plane\'s tilt that decides where the plane of focus is hinged. For the ground to be the plane of focus, J must be the height of the lens above it: here 580 mm and f = 150 mm give θ = 15°. In the drawing the circle about H of radius f is tangent to the lens plane; the film plane stands where the lens plane meets the ground.',
    build(k) {
      const g = k.g, P = k.pt, f = 150, J = 580;
      const O = P(0, 0), H = P(0, -J), G0 = P(-1000, -J), G1 = P(250, -J);
      const th = Math.asin(f / J), v = f / Math.cos(th), thd = th * R2D;
      const T = g.tangentPoints(O, H, f).find(p => p.x > 0), Q = g.lineLine(O, T, G0, G1);
      const u = P(-Math.sin(th), Math.cos(th)), n = P(Math.cos(th), Math.sin(th)), Ac = P(v, v * Math.tan(th));
      const fy = [105, 97, 90].map(y => P(v, y));
      k.given('Side view. The lens centre O is 580 above flat ground; the lens has f = 150. The film is 4 × 5 in, 125 mm high, and must stay vertical so that vertical lines stay parallel. We want the ground sharp from close to the tripod to the horizon. Where must the lens plane and the film plane stand?', () => {
        k.seg(G0, G1, { cls: 'thick' }); k.point(O, 'O', { at: 'nw', lo: { upright: true, size: 0.8 } });
        const a = P(-960, -J - 60), b = P(-960 + f, -J - 60); k.seg(a, b, { cls: 'given' }); k.tick(a, P(0, 1)); k.tick(b, P(0, 1)); k.text(-960 + f / 2, -J - 90, 'f = 150', { upright: true, size: 0.7 });
        k.text(-330, -J - 40, 'the ground: the plane we want sharp', { upright: true, size: 0.65 });
        k.frame(-1020, -J - 110, 270, 170); k.fontScale(0.5);
      });
      k.step('tee', 'Drop the vertical from O to the ground: its foot H is the hinge point. The plane through the lens parallel to the film (this vertical) always meets the plane of focus there.', () => {
        k.seg(O, H, { cls: 'cons' }); k.point(H, 'H', { at: 'sw', lo: { upright: true, size: 0.8 } });
        dimension(k, H, O, 30, 'J = 580', { size: 0.65 });
      });
      k.step('compass', 'With centre H and radius f = 150 draw a circle. The lens plane has to be exactly f from H: Scheimpflug and the thin-lens law together say that the point H of the plane of focus lies on the focal plane of the lens.', () => {
        k.circle(H, f, { cls: 'curve' });
      });
      k.step('straightedge', 'From O draw the tangent to that circle, touching it at T, and carry it on to the ground. This is the lens plane. It meets the ground at Q, the Scheimpflug point.', () => {
        k.seg(g.add(O, g.mul(u, 70)), Q, { cls: 'thick' }); k.point(T, 'T', { at: 'e', lo: { upright: true, size: 0.7 } }); k.point(Q, 'Q', { at: 'se', lo: { upright: true, size: 0.8 } });
      });
      k.step('protractor', 'Measure the tilt of the lens plane against the vertical: 15.0°, as sin θ = f / J = 150 / 580 gives θ = 14.99°.', () => {
        k.angle(O, H, Q, { r: 3, cls: 'cons' }); k.text(100, -150, 'θ = ' + thd.toFixed(1) + '°', { upright: true, size: 0.75, bg: true });
      });
      k.step('tee', 'The film plane is the vertical through Q: the three planes must meet there. It stands 155.3 from O (f ÷ cos θ).', () => {
        k.seg(Q, P(v, 200), { cls: 'cons' }); k.seg(P(v, -J + 40), P(v, 200), { cls: 'aux' });
        k.text(v + 14, 170, 'film plane', { anchor: 'start', upright: true, size: 0.65 });
      });
      k.step('square', 'The optical axis is square to the lens plane through O. It meets the film plane at A, 41.6 above the level of O: the frame is centred a little above the horizontal.', () => {
        k.seg(O, Ac, { cls: 'cons' }); k.right(O, g.add(O, g.mul(u, 30)), g.add(O, g.mul(n, 30)), { r: 0.5 }); k.point(Ac, 'A', { at: 'e', lo: { upright: true, size: 0.7 } });
      });
      k.step('pencil', 'Line in the camera: the lens as a short thick bar along its plane, and the film frame, 125 high, centred on A, as a thick bar on the film plane.', () => {
        k.seg(g.add(O, g.mul(u, 38)), g.sub(O, g.mul(u, 38)), { cls: 'thick', width: 8 });
        k.seg(P(v, Ac.y - 62.5), P(v, Ac.y + 62.5), { cls: 'thick', width: 8 });
      });
      k.step('straightedge', 'Test it. Take three points on the film, 105, 97 and 90 above the level of O. A ray from each through O lands on the ground at 858, 929 and 1001 in front of the lens: the film sees the ground in focus from 0.86 m to infinity, and everything in between is in focus at once.', () => {
        fy.forEach((p, i) => { const q = g.lineLine(p, O, G0, G1); k.point(p, '', { r: 0.7 }); k.seg(p, q, { cls: ['red', 'green', 'curve'][i] }); k.dot(q, { r: 1 }); });
      });
      k.note('Without the tilt the film plane and lens plane are parallel and the plane of focus is a vertical plane at one distance: either the horizon or the foreground is sharp, never both, and stopping down only trades one for the other. The tilt is small: for f = 150 and a lens 1.5 m above the ground, θ = asin(0.15 / 1.5) = 5.7°.', () => {
        k.text(-480, -J + 120, 'plane of focus = the ground', { upright: true, size: 0.7 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------ shift and tilt */
  Hyper.construction({
    id: 'ap-shift-verticals',
    title: 'Keeping verticals vertical: why a rising front works and a tilted camera does not',
    tags: ['view camera', 'shift', 'rising front', 'keystone', 'architectural photography', 'protractor'],
    note: 'Side view; 1 m of the scene is 4 units, and the camera is drawn 2.5 times life size (the 24 mm film distance is 60, the 24 mm frame 60 high) so that it can be seen. A 25 m building 30 m away is photographed from 1.6 m above the ground. Aimed straight ahead, the frame cuts off the top of the building. Tilting the camera up brings it in, but the film plane is then no longer parallel to the façade, and its vertical edges converge towards a third vanishing point: at the top the façade is drawn 21 % narrower than at the base. Sliding the lens up (or the film down) by 8 mm keeps the film plane vertical, and every vertical stays parallel: the picture is a different window onto the same image.',
    build(k) {
      const g = k.g, P = k.pt, s = 4, hE = 1.6 * s, D = 30 * s, HB = 25 * s, fF = 60, hf = 30;
      const O = P(0, hE), B = P(D, 0), T = P(D, HB);
      const aT = Math.atan2(HB - hE, D), aB = Math.atan2(-hE, D), al = (aT + aB) / 2;
      const vline = x => [P(x, -60), P(x, 80)];
      const hit = (a, b, c, d) => g.lineLine(a, b, c, d);
      k.given('Side view. The camera stands 30 m from a building 25 m high; the lens is 1.6 m above the ground, the film plane vertical at the distance f, and the frame is 24 mm high. Scale: 1 m is 4 units; the camera is enlarged so that it can be drawn.', () => {
        k.seg(P(-30, 0), P(150, 0), { cls: 'thick' });
        k.rect(D, 0, D + 10, HB, { cls: 'given' }); k.hatch([P(D, 0), P(D + 10, 0), P(D + 10, HB), P(D, HB)], { angle: PI / 4, gap: 0.7 });
        k.point(O, 'O', { at: 'nw', lo: { upright: true, size: 0.8 } }); k.point(T, 'T', { at: 'nw', lo: { upright: true, size: 0.8 } }); k.point(B, 'B', { at: 'sw', lo: { upright: true, size: 0.8 } });
        k.text(D + 5, HB + 8, 'BUILDING', { upright: true, size: 0.65 });
        k.frame(-34, -34, 152, 118); k.fontScale(0.7);
      });
      k.step('ruler', 'Lay off, at 4 units to the metre, the height of the lens (6.4), the distance to the building (120) and its height (100): the points O, B and T.', () => {
        dimension(k, P(-12, 0), P(-12, hE), 9, '1.6 m', { size: 0.6 });
        dimension(k, P(D + 14, 0), P(D + 14, HB), -3, '25 m', { size: 0.55 });
        dimension(k, P(0, -12), P(D, -12), -3, '30 m', { size: 0.55, gap: 0 });
      });
      k.step('straightedge', 'Draw the sight lines from O to the top T and to the foot B of the building, and the horizontal through O (the horizon). The sight lines rise about 38° and fall about 3°.', () => {
        k.seg(O, T, { cls: 'cons' }); k.seg(O, B, { cls: 'cons' }); k.seg(O, P(D + 14, hE), { cls: 'aux', dash: true });
      });
      const t1 = hit(O, T, P(fF, 0), P(fF, 1)), b1 = hit(O, B, P(fF, 0), P(fF, 1));
      k.step('tee', 'The film plane: a vertical at the distance f = 60 (24 mm). The sight lines cut it at t′ (53.2) and b′ (3.2) above the ground: the image of the building spans 50 units, 20 mm.', () => {
        k.seg(P(fF, -34), P(fF, 100), { cls: 'cons' }); k.point(t1, "t'", { at: 'e', lo: { upright: true, size: 0.7 } }); k.point(b1, "b'", { at: 'e', lo: { upright: true, size: 0.7 } });
      });
      k.step('ruler', 'The frame, 24 mm = 60 units high, centred on the axis through O: it runs from −23.6 to 36.4. Pointed straight ahead the camera loses the upper two thirds of the building.', () => {
        k.seg(P(fF - 4, hE - hf), P(fF - 4, hE + hf), { cls: 'curve', width: 2.4 }); k.text(fF - 7, hE - hf - 6, 'frame, centred', { anchor: 'middle', upright: true, size: 0.6, fill: '#0b4fa0' });
      });
      const Ac = P(fF * Math.cos(al), hE + fF * Math.sin(al)), dir = P(-Math.sin(al), Math.cos(al));
      const t2 = hit(O, T, Ac, g.add(Ac, dir)), b2 = hit(O, B, Ac, g.add(Ac, dir));
      k.step('protractor', 'Tilt the camera up 17.5° (half-way between the two sight lines) so the frame centres on the building: draw the new axis and, square to it at the distance 60, the tilted film plane (dashed).', () => {
        k.seg(O, Ac, { cls: 'cons' }); k.angle(O, P(30, hE), Ac, { label: '17.5°', r: 1.6, labelDist: 1.6, cls: 'cons' });
        k.seg(g.sub(Ac, g.mul(dir, hf + 6)), g.add(Ac, g.mul(dir, hf + 6)), { cls: 'red', dash: true, width: 2 });
        k.point(t2, '', { r: 0.7 }); k.point(b2, '', { r: 0.7 });
      });
      k.note('Now both images fall inside the frame, but the film plane makes 17.5° with the building. The distance measured along the new axis is 142.5 to the top and 112.5 to the foot: a horizontal edge of the façade is drawn 112.5 ÷ 142.5 = 0.79 as wide at the top as at the base, so verticals lean towards a vanishing point above the picture.', () => {
        k.text(Ac.x - 2, Ac.y + hf + 14, 'tilted film plane', { upright: true, size: 0.6, fill: '#b03a2e' });
      });
      k.step('tee', 'Keep the film plane vertical instead and slide the frame up along it by 20 units (8 mm), as the rising front of a view camera or a shift lens does. The frame now runs from −3.6 to 56.4: it holds t′ and b′ both.', () => {
        k.seg(P(fF + 4, hE - hf + 20), P(fF + 4, hE + hf + 20), { cls: 'green', width: 2.4 }); k.text(fF + 7, hE + hf + 25, 'frame shifted 8 mm', { anchor: 'start', upright: true, size: 0.6, fill: '#2d7a3a' });
        k.dot(t1, { r: 0.8 }); k.dot(b1, { r: 0.8 });
      });
      k.note('Nothing about the perspective changed: the sight lines, the picture plane and the lens are where they were, and the picture is a cut taken higher out of the same image (the lens projects a circle larger than the frame). Verticals are parallel because the film plane is parallel to them; the horizon lies at 8 mm below the middle of the frame instead of at the middle.', () => {
        k.arrow(P(fF + 14, hE), P(fF + 14, hE + 20), { cls: 'green' });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------ the panorama */
  Hyper.construction({
    id: 'ap-panorama-stitch',
    title: 'Four rectilinear frames swung onto a cylinder and unrolled into a panorama',
    tags: ['panorama', 'cylindrical projection', 'stitching', 'nodal point', 'overlap', 'protractor', 'dividers'],
    note: 'The camera turns about the vertical axis through the lens\'s nodal point (so that near and far objects do not shift against each other), 30° between frames. Each frame is a rectilinear picture on its own flat film plane: a feature near the edge of one frame sits near the centre of the next, but at a different place and magnification, so the frames cannot just be laid side by side. A panorama program (or a draughtsman) puts them all on a cylinder of radius f about the lens: a point of a frame at x on the film is carried along its sight line to the cylinder, at the angle atan(x / f) from that frame\'s axis; the cylinder is then unrolled so that the angle becomes length f × angle. Drawn here five times life size, with f = 35 mm and a 36 mm frame. Verticals stay vertical; horizontals other than the horizon become curves.',
    build(k) {
      const g = k.g, P = k.pt, S = P(0, 0), f = 175, W2 = 90, A = [-45, -15, 15, 45], CLS = ['red', 'green', 'curve', 'given'];
      const dir = a => P(Math.sin(a * D2R), Math.cos(a * D2R)), tan = a => P(Math.cos(a * D2R), -Math.sin(a * D2R));
      const hf = Math.atan(W2 / f) * R2D, cen = A.map(a => g.add(S, g.mul(dir(a), f)));
      const Y0 = -265, strip = az => P(f * az * D2R, Y0);                        // the unrolled strip: horizon at y = Y0
      k.given('The camera seen from above: S is the lens, the line upward is the forward direction. Lens f = 35 mm, frame 36 mm wide (drawn five times life size: f = 175, frame 180). Four frames, 30° apart, are taken by turning the camera about S: at −45°, −15°, +15° and +45° from forward.', () => {
        chain(k, P(0, -8), P(0, 330)); k.point(S, 'S', { at: 'sw', lo: { upright: true, size: 0.8 } });
        k.text(-290, 316, 'CAMERA SEEN FROM ABOVE', { anchor: 'start', upright: true, bold: true, size: 0.7 });
        k.frame(-300, -350, 300, 335); k.fontScale(0.7);
      });
      k.step('protractor', 'Lay off the four optical axes from the forward direction: 45° and 15° to the left, 15° and 45° to the right.', () => {
        A.forEach((a, i) => {
          k.seg(S, g.add(S, g.mul(dir(a), 235)), { cls: 'aux', dash: CL });
          const p = g.add(S, dir(a)), q = g.add(S, dir(0));
          if (a > 0) k.angle(S, p, q, { r: Math.abs(a) > 20 ? 6 : 3.4, cls: 'cons' }); else k.angle(S, q, p, { r: Math.abs(a) > 20 ? 6 : 3.4, cls: 'cons' });
          k.text(...(v => [v.x, v.y])(g.add(S, g.mul(dir(a), 248))), (a > 0 ? '+' : '') + a + '°', { upright: true, size: 0.7 });
        });
      });
      k.step('compass', 'With centre S and radius f = 175 draw the circle: the cylinder, seen from above. It cuts each axis at the centre of that frame\'s film plane.', () => {
        k.circle(S, f, { cls: 'cons' }); cen.forEach(p => k.dot(p, { r: 0.9 }));
      });
      k.step('square', 'At each of those four points draw the film plane, square to the axis (the tangent to the circle), and mark the frame 90 either side of the axis with the dividers: the thick bars.', () => {
        A.forEach((a, i) => { const c = cen[i], t = tan(a); k.seg(g.sub(c, g.mul(t, W2 + 25)), g.add(c, g.mul(t, W2 + 25)), { cls: 'aux' }); k.seg(g.sub(c, g.mul(t, W2)), g.add(c, g.mul(t, W2)), { cls: CLS[i], width: 2.4 }); });
      });
      k.step('straightedge', 'Draw the field of view of each frame: lines from S through the ends of the bar. Each covers 54.4° (2 atan(18 / 35)); neighbouring frames overlap by 24.4°, nearly half a frame.', () => {
        A.forEach((a, i) => [-1, 1].forEach(s => k.seg(S, g.add(S, g.mul(g.unit(g.add(cen[i], g.mul(tan(a), s * W2))), 300)), { cls: CLS[i] })));
      });
      const az = -25, post = g.mul(dir(az), 290);
      const x1 = g.lineLine(S, post, cen[0], g.add(cen[0], tan(A[0]))), x2 = g.lineLine(S, post, cen[1], g.add(cen[1], tan(A[1])));
      k.step('straightedge', 'A post stands at −25°, in the overlap of the first two frames. Its sight line cuts the first film plane 63.7 right of that frame\'s axis and the second 30.9 left of its axis: in the two pictures it is in two different places. This is why the frames must be put on the cylinder before they are joined.', () => {
        k.seg(S, post, { cls: 'cons' }); k.dot(post, { r: 1.4 }); k.label(post, 'post', 'n', { upright: true, size: 0.7 });
        k.dot(x1, { r: 1 }); k.dot(x2, { r: 1 });
      });
      const marks = [-90, -60, -30, 0, 30, 60, 90], m2 = marks.map(x => g.add(cen[1], g.mul(tan(A[1]), x))), onCirc = m2.map(p => g.add(S, g.mul(g.unit(p), f)));
      k.step('straightedge', 'Mark equal intervals of 30 on the second film plane and carry each through S to the circle. The arcs between the points on the circle are not equal: 8.3°, 9.2°, 9.7° towards the centre. The flat film stretches whatever is near its edge.', () => {
        m2.forEach((p, i) => { k.seg(S, onCirc[i], { cls: 'cons' }); k.dot(p, { r: 0.7 }); k.dot(onCirc[i], { r: 0.9 }); });
      });
      const azOf = x => A[1] + Math.atan(x / f) * R2D;
      k.step('dividers', 'Unroll the circle onto a straight line below: the horizontal at the height of the horizon, with the forward direction at its middle. An angle a from forward goes to the distance f × a (in radians) from the middle: transfer the arcs with the dividers. Mark the seams, half-way across each overlap, at −30°, 0° and +30°.', () => {
        k.seg(P(-225, Y0), P(225, Y0), { cls: 'given' });
        [-30, 0, 30].forEach(a => { k.seg(strip(a), P(strip(a).x, Y0 + 70), { cls: 'cons' }); k.seg(strip(a), P(strip(a).x, Y0 - 70), { cls: 'cons' }); k.text(strip(a).x, Y0 - 78, a + '°', { upright: true, size: 0.6 }); });
        marks.forEach(x => { const p = strip(azOf(x)); k.dot(p, { r: 0.8 }); });
      });
      const first = A[0] - hf, last = A[3] + hf;
      k.step('pencil', 'Frame the panorama (the four frames contribute the bands between the seams), and draw the straight line of a wall and its footing as they appear: not straight but a curve y = f H cos(a − a₀) ÷ D, bowed away from the horizon. The horizon stays straight; so do the verticals.', () => {
        k.rect(f * first * D2R, Y0 - 70, f * last * D2R, Y0 + 70, { cls: 'thick' });
        const wall = (H, col) => k.curve(t => { const a = t, c = Math.cos((a + 10) * D2R); return c > 0.05 ? [f * a * D2R, Y0 + f * H * c / 6] : null; }, [first, last], { cls: col, n: 200 });
        wall(2, 'curve'); wall(-1.6, 'red');
        k.text(0, Y0 + 82, 'PANORAMA, 145° WIDE', { upright: true, size: 0.7 });
      });
      k.note('The seams run half-way through the overlaps, so each frame contributes its middle 30° and the picture is made from the best part of every lens. The width of the strip is f × 145° = 442 on this scale (88 mm for f = 35 mm): about 4.1 : 1 for the 24 mm frame height. Turn all the way round (twelve frames) and the ends meet: a 360° cylinder, the panorama of a pano head. A wide-angle rectilinear picture cannot show more than about 100°, however it is cropped.', () => {
        k.text(0, Y0 - 92, 'f × angle = 175 × 2.53 rad = 442', { upright: true, size: 0.6 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------ anamorphic */
  Hyper.construction({
    id: 'ap-anamorphic-squeeze',
    title: 'The 2 : 1 anamorphic squeeze: a circle becomes a 2 : 1 ellipse, and back',
    tags: ['anamorphic', 'cinema', 'squeeze', 'ellipse', 'concentric circles', 'CinemaScope'],
    note: 'A 2× anamorphic lens has one focal length across the frame and another along it: it shortens the picture by half horizontally and leaves it alone vertically. The film frame is therefore nearly square (1.2 : 1), and a projector lens with the opposite squeeze stretches it back to the 2.39 : 1 screen. Every circle is recorded as an ellipse twice as tall as it is wide, and returns to a circle on the screen. The ellipse is drawn here by the concentric-circle method: one circle gives the heights, the other the widths.',
    build(k) {
      const g = k.g, P = k.pt, Hh = 60, Wd = Hh * 2.39, R0 = 25, Cs = P(0, 55), Cf = P(0, -45);
      const sq = (p, c0, c1) => P(c1.x + (p.x - c0.x) / 2, c1.y + (p.y - c0.y));
      const sqpts = [45, 135, 225, 315].map(a => g.polar(Cs, R0, a * D2R));
      k.given('What the audience should see: a frame 2.39 : 1 (143.4 × 60) with a round moon of diameter 50 and a square inscribed in it. We shall find what the film records through a 2× anamorphic lens.', () => {
        k.rect(Cs.x - Wd / 2, Cs.y - Hh / 2, Cs.x + Wd / 2, Cs.y + Hh / 2, { cls: 'given' });
        k.circle(Cs, R0, { cls: 'given' }); k.poly(sqpts, { close: true, cls: 'given' });
        chain(k, P(Cs.x, Cs.y - Hh / 2 - 5), P(Cs.x, Cs.y + Hh / 2 + 5)); chain(k, P(Cs.x - Wd / 2 - 5, Cs.y), P(Cs.x + Wd / 2 + 5, Cs.y));
        k.text(-Wd / 2 - 4, Cs.y + Hh / 2 + 6, 'SCREEN 2.39 : 1', { anchor: 'start', upright: true, size: 0.7 });
        k.frame(-85, -90, 85, 100); k.fontScale(0.8);
      });
      k.step('ruler', 'The film frame has the same height, 60, and half the width, 71.7: draw it centred on the vertical axis below.', () => {
        k.rect(Cf.x - Wd / 4, Cf.y - Hh / 2, Cf.x + Wd / 4, Cf.y + Hh / 2, { cls: 'given' });
        chain(k, P(Cf.x, Cf.y - Hh / 2 - 5), P(Cf.x, Cf.y + Hh / 2 + 5)); chain(k, P(Cf.x - Wd / 4 - 5, Cf.y), P(Cf.x + Wd / 4 + 5, Cf.y));
        k.text(-Wd / 4, Cf.y - Hh / 2 - 7, 'FILM FRAME 1.2 : 1', { anchor: 'start', upright: true, size: 0.7 });
      });
      k.step('compass', 'On the centre of the film frame draw two circles: one of radius 25 (the half-height: it gives the heights of the ellipse) and one of radius 12.5 (half of that: it gives the widths).', () => {
        k.circle(Cf, R0, { cls: 'cons' }); k.circle(Cf, R0 / 2, { cls: 'cons' });
      });
      k.step('protractor', 'Draw twelve radii at 30° from the centre through both circles.', () => {
        for (let i = 0; i < 12; i++) k.seg(Cf, g.polar(Cf, R0 + 6, i * PI / 6), { cls: 'cons' });
      });
      const ell = [...Array(12).keys()].map(i => P(Cf.x + R0 / 2 * Math.cos(i * PI / 6), Cf.y + R0 * Math.sin(i * PI / 6)));
      k.step('tee', 'On each radius carry the height of its point on the big circle across with the T-square, and the width of its point on the small circle up or down with the set square. The two lines cross on the ellipse.', () => {
        for (let i = 0; i < 12; i++) { const a = i * PI / 6, hi = g.polar(Cf, R0, a), lo = g.polar(Cf, R0 / 2, a); k.seg(hi, P(lo.x, hi.y), { cls: 'aux' }); k.seg(lo, P(lo.x, hi.y), { cls: 'aux' }); k.dot(ell[i], { r: 0.9 }); }
      });
      k.step('pencil', 'Join the twelve points with a smooth curve: the circle has become an ellipse 25 wide and 50 high. The inscribed square (halve every width) is now a tall oblong 17.7 wide and 35 high.', () => {
        k.curve(smoothClosed(ell, 8), null, { cls: 'curve' });
        k.poly(sqpts.map(p => sq(p, Cs, Cf)), { close: true, cls: 'thick' });
      });
      k.note('At the projector the opposite lens stretches every width by two (the arrows): each point of the film frame moves out from the axis to twice its distance and back to the screen drawing above. A circle returns to a circle. If the squeeze were not undone, faces would be thin; if it were undone twice, fat.', () => {
        [0, 1, 2, 3].forEach(i => { const p = ell[i * 3 % 12], q = P(Cf.x + (p.x - Cf.x) * 2, p.y); if (Math.abs(p.x - Cf.x) > 1) k.arrow(p, q, { cls: 'green' }); });
        k.text(0, Cf.y - Hh / 2 - 16, 'desqueeze: widths × 2', { upright: true, size: 0.7 });
      });
    }
  });
  /* a closed Catmull–Rom curve through points (as [x, y]) */
  function smoothClosed(pts, n) {
    const m = pts.length, out = [];
    for (let i = 0; i < m; i++) {
      const p0 = pts[(i + m - 1) % m], p1 = pts[i], p2 = pts[(i + 1) % m], p3 = pts[(i + 2) % m];
      for (let j = 0; j < n; j++) { const t = j / n, t2 = t * t, t3 = t2 * t;
        out.push([0.5 * (2 * p1.x + (-p0.x + p2.x) * t + (2 * p0.x - 5 * p1.x + 4 * p2.x - p3.x) * t2 + (-p0.x + 3 * p1.x - 3 * p2.x + p3.x) * t3),
          0.5 * (2 * p1.y + (-p0.y + p2.y) * t + (2 * p0.y - 5 * p1.y + 4 * p2.y - p3.y) * t2 + (-p0.y + 3 * p1.y - 3 * p2.y + p3.y) * t3)]); }
    }
    out.push([pts[0].x, pts[0].y]); return out;
  }

  /* ------------------------------------------------------------------------------------------ the stage */
  Hyper.construction({
    id: 'ap-forced-stage',
    title: 'A raked, tapered stage that looks like a long hall: the false vanishing point',
    tags: ['stage design', 'forced perspective', 'Teatro Olimpico', 'raked stage', 'plan and section', 'vanishing point'],
    note: 'Scale 1 m = 8 units. The audience looks from one seat, E, 8 m from the front of the stage and 1.5 m above its front edge. The stage is 8 m wide and 5 m high at the front and only 3 m wide and 1.875 m high at the back, 8 m further on: every dimension is multiplied by s = 0.375. Because the eye sees only angles, a back wall 8 m deep and 3 m wide looks exactly like a wall 8 m wide at 42.7 m: the stage seems 34 m deeper than it is. The side walls, the rising floor and the sinking ceiling all aim at the same real point (the apex, 20.8 m from E at eye height), and in the picture that point is the vanishing point of the whole hall. From any other seat the illusion fails: the set is a shape that works from one position only.',
    build(k) {
      const g = k.g, P = k.pt, u = 8, D = 8, depth = 8, wF = 8, wB = 3, hF = 5, eye = 1.5, s = wB / wF, Lap = depth / (1 - s), zApp = (D + depth) / s;
      const XP = D * u, XB = (D + depth) * u, XA = (D + Lap) * u, XApp = zApp * u, Ys = -105;                  // proscenium, back wall, apex and apparent back wall on the sheet; section floor level
      const E = P(0, 0), Es = P(0, Ys + eye * u);
      const floorB = 0.9375 * u, ceilB = 2.8125 * u;                                                              // floor and ceiling at the back wall, above the front floor level
      k.given('Plan (above) and section (below) of the stage and the seat E. The front opening is 8 m wide and 5 m high; 8 m behind it the back wall is only 3 m wide and 1.875 m high; the floor rises 0.94 m and the ceiling sinks 2.19 m. E is 8 m in front of the opening and 1.5 m above the front edge of the floor.', () => {
        k.point(E, 'E', { at: 'sw', lo: { upright: true, size: 0.8 } });
        [[1, 1], [-1, 1]].forEach(([sg]) => k.seg(P(XP, sg * wF / 2 * u), P(XB, sg * wB / 2 * u), { cls: 'thick' }));
        k.seg(P(XP, -wF / 2 * u), P(XP, wF / 2 * u), { cls: 'given' }); k.seg(P(XB, -wB / 2 * u), P(XB, wB / 2 * u), { cls: 'thick' });
        k.text(XP - 4, 44, 'PLAN', { anchor: 'end', upright: true, size: 0.7 });
        k.point(Es, 'E', { at: 'sw', lo: { upright: true, size: 0.8 } });
        k.seg(P(XP, Ys), P(XB, Ys + floorB), { cls: 'thick' }); k.seg(P(XP, Ys + hF * u), P(XB, Ys + ceilB), { cls: 'thick' });
        k.seg(P(XP, Ys), P(XP, Ys + hF * u), { cls: 'given' }); k.seg(P(XB, Ys + floorB), P(XB, Ys + ceilB), { cls: 'thick' });
        k.text(XP - 4, Ys + 52, 'SECTION', { anchor: 'end', upright: true, size: 0.7 });
        chain(k, P(-10, 0), P(XApp + 20, 0)); k.frame(-30, Ys - 20, XApp + 40, 56); k.fontScale(0.6);
      });
      k.step('straightedge', 'Prolong the side walls of the plan, and the floor and ceiling lines of the section, until they meet. They all meet at the same point, A, 20.8 m from E (12.8 m behind the opening) at the height of the eye. This is the false vanishing point of the set: the real point where the converging lines would cross.', () => {
        const pA = P(XA, 0), sA = P(XA, Ys + eye * u);
        [[1], [-1]].forEach(([sg]) => k.seg(P(XB, sg * wB / 2 * u), pA, { cls: 'cons', dash: true }));
        k.seg(P(XB, Ys + floorB), sA, { cls: 'cons', dash: true }); k.seg(P(XB, Ys + ceilB), sA, { cls: 'cons', dash: true });
        k.point(pA, 'A', { at: 'ne', lo: { upright: true, size: 0.8 } }); k.point(sA, 'A', { at: 'ne', lo: { upright: true, size: 0.8 } });
      });
      k.step('straightedge', 'Plan: from E draw lines through the two back corners and carry them on until they meet the lines of the proscenium opening continued (the side walls of a real hall 8 m wide). They meet at 42.7 m: that is where the eye puts the back wall.', () => {
        [1, -1].forEach(sg => { k.seg(E, P(XApp, sg * wF / 2 * u), { cls: 'cons' }); k.seg(P(XP, sg * wF / 2 * u), P(XApp, sg * wF / 2 * u), { cls: 'cons', dash: true }); });
        k.seg(P(XApp, -wF / 2 * u), P(XApp, wF / 2 * u), { cls: 'cons', dash: true }); k.dot(P(XApp, wF / 2 * u), { r: 1 }); k.dot(P(XApp, -wF / 2 * u), { r: 1 });
      });
      k.step('straightedge', 'Section: the same through the back floor and back ceiling edges. They meet the level floor (height 0) and the level ceiling (height 5) of the imagined hall at the same 42.7 m.', () => {
        k.seg(Es, P(XApp, Ys), { cls: 'cons' }); k.seg(Es, P(XApp, Ys + hF * u), { cls: 'cons' });
        k.seg(P(XP, Ys), P(XApp, Ys), { cls: 'cons', dash: true }); k.seg(P(XP, Ys + hF * u), P(XApp, Ys + hF * u), { cls: 'cons', dash: true });
        k.seg(P(XApp, Ys), P(XApp, Ys + hF * u), { cls: 'cons', dash: true }); k.dot(P(XApp, Ys), { r: 1 }); k.dot(P(XApp, Ys + hF * u), { r: 1 });
      });
      const T = [2, 4, 6], sT = t => 1 - t / Lap;
      k.step('dividers', 'Set three wings at 2, 4 and 6 m behind the opening: each is the front opening scaled by s(t) = 1 − t ÷ 12.8, i.e. 0.84, 0.69 and 0.53. In plan they are bars 6.7, 5.5 and 4.2 m wide; in section, bars 4.4, 3.4 and 2.7 m tall, standing on the rising floor and hanging from the sinking ceiling.', () => {
        T.forEach(t => {
          const X = (D + t) * u, hw = wF / 2 * u * sT(t), fl = floorB * t / depth, ce = hF * u - (hF * u - ceilB) * t / depth;
          k.seg(P(X, -hw), P(X, hw), { cls: 'thick' }); k.seg(P(X, Ys + fl), P(X, Ys + ce), { cls: 'thick' });
        });
      });
      k.step('straightedge', 'Draw the sight lines from E through the edges of each wing in plan: they cross the walls of the imagined hall at 11.9, 17.5 and 26.4 m from E. The wings that really stand 10, 12 and 14 m away seem to stand 11.9, 17.5 and 26.4 m away: the depth of the stage is stretched as 1 ÷ s grows (z′ = (8 + t) ÷ s(t)).', () => {
        T.forEach(t => { const X = (D + t) * u, hw = wF / 2 * u * sT(t), Xa = (D + t) / sT(t) * u; k.seg(E, P(Xa, wF / 2 * u), { cls: 'cons' }); k.dot(P(Xa, wF / 2 * u), { r: 0.9 }); k.dot(P(X, hw), { r: 0.9 }); });
      });
      k.note('Painted scenery works the same way with the numbers softened: a stage rake of 1 in 12 or 1 in 24, wings that taper only a little, a back-cloth painted with small figures. The price is that the actors, as they walk upstage, seem to shrink beside the scenery, which Scamozzi hid in the Teatro Olimpico by using child-sized figures in the far streets and by keeping the actors in the front zone.', () => {
        k.text(XApp / 2, -46, 'the eye sees a hall 8 m wide and 42.7 m deep', { upright: true, size: 0.7 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------ the sidewalk cube */
  Hyper.construction({
    id: 'ap-sidewalk-cube',
    title: 'A cube drawn on the pavement: projecting it from the viewer\'s eye onto the ground',
    tags: ['anamorphosis', 'street art', 'projection onto the ground plane', 'sight lines', 'plan and elevation'],
    note: 'Scale 1 m = 30 units. The viewer\'s eye E is 1.6 m above the pavement. The cube, 1 m on a side, is imagined standing on the ground 3.5 m ahead and 0.4 m to the right of the line of sight. Every point of the cube is carried onto the pavement along its sight line from E: a point at height y lands at the point where the line from E through it meets the ground, at 1.6 ÷ (1.6 − y) times its distance from the foot of the eye. The top face of the cube (y = 1) is enlarged 2.67 times and moved out to 9.3–12 m. The elevation gives the distances, the plan the sideways positions. Seen from E, the three painted shapes fill exactly the picture that a real cube would; from any other point they are a puzzle of distorted quadrilaterals.',
    build(k) {
      const g = k.g, P = k.pt, u = 30, h = 1.6, a = 1.0, x0 = 3.5, x1 = 4.5, z0 = 0.4, z1 = 1.4, kf = h / (h - a);
      const E = P(0, h * u), Yp = -62, Ep = P(0, Yp), pl = (x, z) => P(x * u, Yp - z * u);                          // plan: lateral distance z to the right of the viewer goes down the sheet
      k.given('Elevation (above) and plan (below), aligned. The eye E is 1.6 m above the ground and the foot of the viewer is at the left. The cube to be imagined is 1 m on a side, its near face 3.5 m ahead and its left face 0.4 m to the right of the line of sight (the dashed outlines).', () => {
        k.seg(P(-30, 0), P(400, 0), { cls: 'thick' }); k.rect(x0 * u, 0, x1 * u, a * u, { cls: 'cons', dash: true });
        k.seg(P(0, 0), E, { cls: 'cons' }); k.point(E, 'E', { at: 'nw', lo: { upright: true, size: 0.8 } });
        k.rect(x0 * u, Yp - z1 * u, x1 * u, Yp - z0 * u, { cls: 'cons', dash: true });
        chain(k, P(-20, Yp), P(400, Yp)); k.point(Ep, 'E′', { at: 'nw', lo: { upright: true, size: 0.8 } });
        k.text(395, 20, 'ELEVATION', { anchor: 'end', upright: true, size: 0.7 }); k.text(395, Yp + 10, 'PLAN', { anchor: 'end', upright: true, size: 0.7 });
        k.frame(-40, -190, 410, 60); k.fontScale(0.65);
      });
      const gA = P(x0 * kf * u, 0), gB = P(x1 * kf * u, 0);
      k.step('straightedge', 'Elevation: from E draw lines through the top corners of the cube, (3.5, 1) and (4.5, 1), and carry them to the pavement. They land at A′ = 9.33 m and B′ = 12 m. The bottom corners are already on the ground and stay where they are.', () => {
        k.seg(E, g.add(gA, g.mul(g.unit(g.sub(gA, E)), 4)), { cls: 'cons' }); k.seg(E, g.add(gB, g.mul(g.unit(g.sub(gB, E)), 4)), { cls: 'cons' });
        k.point(gA, "A'", { at: 'se', lo: { upright: true, size: 0.75 } }); k.point(gB, "B'", { at: 'se', lo: { upright: true, size: 0.75 } });
        k.dot(P(x0 * u, a * u), { r: 0.9 }); k.dot(P(x1 * u, a * u), { r: 0.9 });
      });
      k.step('square', 'Carry the four distances (3.5, 4.5, 9.33 and 12 m) straight down into the plan as vertical projectors.', () => {
        [x0 * u, x1 * u, gA.x, gB.x].forEach(x => k.seg(P(x, -4), P(x, Yp - z1 * kf * u - 8), { cls: 'cons' }));
      });
      const corners = [[x0, z0], [x0, z1], [x1, z0], [x1, z1]];
      k.step('straightedge', 'Plan: from E′ draw a line through each corner of the cube\'s footprint, and carry it on to the projector of its top corner (A′ for the near corners, B′ for the far ones). The crossings give the sideways positions of the top corners on the pavement: each one is the footprint\'s sideways distance times 2.67.', () => {
        corners.forEach(([x, z]) => { const xe = x === x0 ? gA.x : gB.x, p = pl(x, z), q = g.lineLine(Ep, p, P(xe, 0), P(xe, 1)); k.seg(Ep, q, { cls: 'cons' }); k.dot(q, { r: 1 }); });
      });
      const T = (x, z) => pl(x * kf, z * kf), Bq = (x, z) => pl(x, z);
      k.step('pencil', 'Draw the three painted shapes. The front face is the trapezoid from the base edge (3.5 m) to its stretched top edge (9.33 m); the left face the trapezoid beside it, running out to 12 m; the top face the large square, 2.67 × 2.67 m, at the far end.', () => {
        k.poly([Bq(x0, z0), Bq(x0, z1), T(x0, z1), T(x0, z0)], { close: true, cls: 'thick' });
        k.poly([Bq(x0, z0), Bq(x1, z0), T(x1, z0), T(x0, z0)], { close: true, cls: 'thick' });
        k.poly([T(x0, z0), T(x1, z0), T(x1, z1), T(x0, z1)], { close: true, cls: 'thick' });
        const mid = (...pp) => g.centroid(pp);
        [['FRONT', mid(Bq(x0, z0), Bq(x0, z1), T(x0, z1), T(x0, z0))], ['LEFT', mid(Bq(x0, z0), Bq(x1, z0), T(x1, z0), T(x0, z0))], ['TOP', mid(T(x0, z0), T(x1, z0), T(x1, z1), T(x0, z1))]].forEach(([t, c]) => k.text(c.x, c.y, t, { upright: true, size: 0.6, bg: true }));
      });
      k.note('The picture on the pavement is 8.5 m long for a cube 1 m high. Colour the front face mid-grey, the left face dark and the top face light and, from E, a cube seems to stand on the street. A step to either side, or standing taller or shorter, and the sight lines no longer pass through the same points: the cube lies down and stretches. Painters reduce the stretch by making the cube lower, or draw it in two halves for a wide street.', () => {
        k.text(T(x0, 0).x + 50, T(x0, z1 * 1.2).y - 16, 'painted on the pavement', { upright: true, size: 0.7 });
      });
    }
  });

})();
