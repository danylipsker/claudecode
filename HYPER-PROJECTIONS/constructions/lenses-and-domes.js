/* HYPER-PROJECTIONS · constructions/lenses-and-domes.js — hand constructions for lenses, panoramas, domes and mirrors.
 *
 *   ld-lens-radii           where one ray lands under the five lens laws, found on a circle of radius f
 *   ld-fisheye-grid         the equidistant polar paper (rings every 15°) and a room plotted on it point by point
 *   ld-equisolid-rings      the equisolid rings from the chord of the circle (compass about A)
 *   ld-stereo-rings         the stereographic rings from the pole opposite (straightedge from S)
 *   ld-equirect-grid        a room on the longitude/latitude rectangle: vertical edges straight, the rest curves
 *   ld-cube-net             the cross of six rectilinear 90° faces and the room drawn in each
 *   ld-dome-master          the planetarium master: altitude rings by dividers, the celestial equator by one arc
 *   ld-cylinder-anamorphosis the polar grid of a cylinder mirror: reflected rays and distances
 *   ld-cone-anamorphosis    the cone mirror: profile and plan, the picture turned inside out
 *   ld-planet-circles       a little planet: altitude circles of the stereographic picture, the horizon as the rim
 * Every figure is computed (k.g and the projection engine), never placed by eye.
 */
(function () {
  'use strict';
  const PI = Math.PI, TAU = 2 * PI, D2R = PI / 180, R2D = 180 / PI;
  const sin = Math.sin, cos = Math.cos, tan = Math.tan, atan = Math.atan, atan2 = Math.atan2, asin = Math.asin, hypot = Math.hypot;
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

  /* ================================================================ five laws on one circle */
  Hyper.construction({
    id: 'ld-lens-radii',
    title: 'Five lenses, one angle: where the ray lands',
    tags: ['fisheye', 'lens', 'compass', 'rectilinear', 'stereographic'],
    note: 'A circle of radius f about the lens N, the picture line T touching it at A, and a ray at the angle θ from the axis cutting the circle at P. Each lens law is a different way of carrying P to T: the tangent construction gives r = f·tan θ (rectilinear); a ray from the opposite point S gives r = 2f·tan(θ/2) (stereographic); the chord AP gives r = 2f·sin(θ/2) (equisolid angle); the arc A P rectified gives r = f·θ (equidistant); the foot of the perpendicular gives r = f·sin θ (orthographic). For θ = 60° the five land at 0.87, 1.00, 1.05, 1.15 and 1.73 f.',
    build(k) {
      const g = k.g, f = 100, th = 60 * D2R;
      const N = k.pt(0, 0), A = k.pt(0, f), S = k.pt(0, -f), P = g.polar(N, f, PI / 2 - th);
      const hit = r => k.pt(r, f);
      const rRect = f * tan(th), rStereo = 2 * f * tan(th / 2), rOrtho = f * sin(th), rSolid = 2 * f * sin(th / 2), rEq = f * th;
      const tag = (r, text, ly) => { const q = hit(r); k.point(q, '', 'n'); k.seg(q, k.pt(246, ly), { cls: 'aux' }); k.text(250, ly, text, { size: 0.8, upright: true, anchor: 'start' }); };
      k.given('The lens N, the axis N A, the circle of radius f about N (the sphere of directions seen in section) and the picture line T touching it at A. A ray leaves N at θ = 60° from the axis and cuts the circle at P.', () => {
        k.circle(N, f, { cls: 'given' }); k.point(N, 'N', 'sw'); k.seg(N, A, { cls: 'given' }); k.point(A, 'A', 'nw');
        k.seg(k.pt(-30, f), k.pt(240, f), { cls: 'given' }); k.label(k.pt(-30, f), 'T', 'w', { upright: true });
        k.seg(N, P, { cls: 'given' }); k.point(P, 'P', 'se'); k.angle(N, P, A, { label: 'θ', r: 1.6, labelDist: 1.3 });
        k.point(S, 'S', 'sw');
        k.frame(-125, -125, 400, 190);
      });
      k.step('straightedge', 'Rectilinear: extend N P to meet T. The point lies at f·tan θ = ' + fmt(rRect) + ' from A.', () => {
        k.seg(P, hit(rRect), { cls: 'cons' }); tag(rRect, 'r = f tan θ  (rectilinear)', 115);
      });
      k.step('straightedge', 'Stereographic: join the opposite point S (the antipode of A) to P and extend to T. The point lies at 2f·tan(θ/2) = ' + fmt(rStereo) + ' from A.', () => {
        k.seg(S, hit(rStereo), { cls: 'cons' }); tag(rStereo, 'r = 2f tan θ/2  (stereographic)', 130);
      });
      k.step('square', 'Orthographic: drop the perpendicular from P to T with the set square. The foot lies at f·sin θ = ' + fmt(rOrtho) + ' from A.', () => {
        k.seg(P, hit(rOrtho), { cls: 'cons' }); tag(rOrtho, 'r = f sin θ  (orthographic)', 175);
      });
      k.step('compass', 'Equisolid angle: with centre A and radius A P (the chord of the angle θ) draw an arc down to T. It cuts T at 2f·sin(θ/2) = ' + fmt(rSolid) + ' from A.', () => {
        k.arc(A, g.dist(A, P), -th / 2, 0, { cls: 'curve' }); tag(rSolid, 'r = 2f sin θ/2  (equisolid)', 160);
      });
      k.step('dividers', 'Equidistant: rectify the arc A P. Step the dividers along it in four equal parts of 15° and lay the same four steps along T from A. The last mark is f·θ = ' + fmt(rEq) + ' from A.', () => {
        [15, 30, 45].forEach(t => { k.dot(g.polar(N, f, PI / 2 - t * D2R), { r: 0.6 }); k.dot(hit(f * t * D2R), { r: 0.6 }); });
        tag(rEq, 'r = f θ  (equidistant)', 145);
      });
      k.note('From the axis outwards the five marks come in the order sin θ < 2 sin θ/2 < θ < 2 tan θ/2 < tan θ. They agree near the axis (small angles) and part company as θ grows: the orthographic lens crowds the edge, the rectilinear stretches it without limit, the other three lie between.', () => {
        k.arc(N, f * 0.35, PI / 2 - th, PI / 2, { cls: 'aux' });
      });
    }
  });

  /* ================================================================ the equidistant polar paper */
  Hyper.construction({
    id: 'ld-fisheye-grid',
    title: 'A room on the equidistant polar paper',
    tags: ['fisheye', 'equidistant', 'compass', 'dividers', 'polar grid'],
    note: 'In the equidistant fisheye a direction at the angle θ from the axis and the azimuth φ goes to the point at distance r = f·θ from the centre in the direction φ. So the paper is a polar grid: circles at equal steps of θ (here every 15°) and radii at equal steps of φ. Points of the room are plotted by (θ, φ) and the edges traced through them with a French curve. The four long edges of the room, which run parallel to the axis, are straight radii.',
    build(k) {
      const g = k.g, R = 150, f = R / (PI / 2), a = 3, b = 2, D = 4;
      const O = k.pt(0, 0), pt = (X, Y, Z) => { const q = k.proj.fisheye('equidistant', [X, Y, Z], f); return k.pt(q[0], q[1]); };
      const xs = [-3, -2, -1, 0, 1, 2, 3], ys = [-1, 0, 1];
      const top = xs.map(x => pt(x, b, D)), bot = xs.map(x => pt(x, -b, D));
      const rgt = [b, 1, 0, -1, -b].map(y => pt(a, y, D)), lft = [b, 1, 0, -1, -b].map(y => pt(-a, y, D));
      const cor = [pt(a, b, D), pt(-a, b, D), pt(-a, -b, D), pt(a, -b, D)];
      const th0 = atan(hypot(a, b) / D), ph0 = atan2(b, a), thT = atan(b / D);
      k.given('The picture circle of radius R = f·π/2 (θ up to 90°) with its centre O. The room is 6 wide and 4 high, the far wall 4 away, the eye at the middle of the cross-section: the far wall\'s corner (3, 2, 4) has θ = ' + fmt(th0 / D2R) + '° and azimuth φ = ' + fmt(ph0 / D2R) + '°.', () => {
        k.circle(O, R, { cls: 'given' }); k.point(O, 'O', 'sw'); k.frame(-R * 1.1, -R * 1.1, R * 1.1, R * 1.1);
      });
      k.step('dividers', 'Divide a radius into six equal parts (steps of 15° of θ, each R/6 = 25 long) and mark them.', () => {
        for (let i = 1; i <= 5; i++) { k.point(k.pt(i * R / 6, 0), '', 'n'); }
        k.label(k.pt(R / 6, 0), '15°', 's', { upright: true, size: 0.65 }); k.label(k.pt(R / 2, 0), '45°', 's', { upright: true, size: 0.65 }); k.label(k.pt(R * 5 / 6, 0), '75°', 's', { upright: true, size: 0.65 });
      });
      k.step('compass', 'With centre O draw the circles through the marks: the rings of constant θ, equally spaced.', () => {
        for (let i = 1; i <= 5; i++) k.circle(O, i * R / 6, { cls: 'cons' });
      });
      k.step('tee', 'Draw the horizontal diameter (φ = 0° and 180°).', () => { k.seg(k.pt(-R, 0), k.pt(R, 0), { cls: 'cons' }); });
      k.step('square', 'With the 30°–60° set square draw the diameters at 30°, 60°, 90°, 120° and 150°: the radii of constant azimuth, every 30°.', () => {
        [30, 60, 90, 120, 150].forEach(p => k.seg(g.polar(O, -R, p * D2R), g.polar(O, R, p * D2R), { cls: 'cons' }));
      });
      k.step('ruler', 'Plot the corner of the far wall: azimuth ' + fmt(ph0 / D2R) + '° (protractor or interpolate between the radii), distance r = f·θ = ' + fmt(hypot(cor[0].x, cor[0].y)) + ' from O. The other three corners are its images in the horizon and the vertical: carry the distance with the dividers.', () => {
        cor.forEach((c, i) => k.point(c, 'K_' + (i + 1), ['ne', 'nw', 'sw', 'se'][i]));
      });
      k.step('ruler', 'Plot points along the top edge, y = 2 at x = −2 … 2: θ = arctan(√(x² + 4)/4), φ = arctan(2/x), r = f·θ; the middle of the edge (x = 0) is at θ = ' + fmt(thT / D2R) + ', r = ' + fmt(f * thT) + ' straight up. The bottom edge is its mirror image.', () => {
        xs.slice(1, -1).forEach(x => { k.dot(pt(x, b, D), { r: 0.8 }); k.dot(pt(x, -b, D), { r: 0.8 }); });
        ys.forEach(y => { k.dot(pt(a, y, D), { r: 0.8 }); k.dot(pt(-a, y, D), { r: 0.8 }); });
      });
      k.step('pencil', 'Trace the four edges of the far wall through the points: top, bottom, left and right, each a flat curve bulging away from the centre.', () => {
        k.smooth(top, { cls: 'curve', n: 16 }); k.smooth(bot, { cls: 'curve', n: 16 }); k.smooth(rgt, { cls: 'curve', n: 16 }); k.smooth(lft, { cls: 'curve', n: 16 });
      });
      k.step('pencil', 'The four long edges of the room are parallel to the axis: they are radii. Draw each from its corner out to the rim, where it passes the plane of the eye.', () => {
        cor.forEach(c => k.seg(c, g.mul(g.unit(c), R), { cls: 'thick' }));
      });
      k.note('A circle on the paper is a cone of directions about the axis, so the rings can be read as angles at once: the ring through a point tells its angle off the axis. A wall straight ahead, at right angles to the axis, is bowed outwards because the same distance in the room is a smaller angle towards the edge.', () => {
        k.label(g.polar(O, R * 0.85, 120 * D2R), 'θ = 75°', 'nw', { upright: true, size: 0.7 }); k.label(g.polar(O, R * 0.5, 120 * D2R), '45°', 'nw', { upright: true, size: 0.7 });
      });
    }
  });

  /* ================================================================ equisolid and stereographic rings */
  function ringsConstruction(o) {
    return {
      id: o.id, title: o.title, tags: o.tags, note: o.note,
      build(k) {
        const g = k.g, f = o.f, ths = o.thetas.map(t => t * D2R);
        const N = k.pt(0, 0), A = k.pt(0, f), S = k.pt(0, -f), P = t => g.polar(N, f, PI / 2 - t);
        const radius = o.radius(f), rmax = radius(ths[ths.length - 1]);
        const X0 = 2 * rmax + 40, Oc = k.pt(X0, f);
        const hit = t => k.pt(radius(t), f);
        k.given('The lens N, the axis N A, the circle of radius f = ' + f + ' about N (the sphere of directions in section) and the picture line T touching it at A. To the right, the centre O_p of the picture; the rings of constant angle ' + o.thetas.map(t => t + '°').join(', ') + ' will be drawn about it.', () => {
          k.circle(N, f, { cls: 'given' }); k.point(N, 'N', 'sw'); k.seg(N, A, { cls: 'given' }); k.point(A, 'A', 'nw');
          k.seg(k.pt(-20, f), k.pt(rmax + 15, f), { cls: 'given' }); k.label(k.pt(-20, f), 'T', 'w', { upright: true });
          k.point(Oc, 'O_p', 'sw'); if (o.useS) k.point(S, 'S', 'sw');
          k.frame(-f - 20, f - rmax - 12, X0 + rmax + 14, f + rmax + 14);
        });
        k.step('protractor', 'From the axis lay off the angles ' + o.thetas.map(t => t + '°').join(', ') + ' at N and mark where the rays cut the circle: P_1, P_2 …', () => {
          ths.forEach((t, i) => { k.seg(N, P(t), { cls: 'cons' }); k.point(P(t), String(o.thetas[i]) + '°', { at: 'se', lo: { upright: true, size: 0.65 } }); });
        });
        o.steps(k, { g, f, ths, N, A, S, P, hit, Oc, radius });
        k.step('dividers', 'Carry each distance A–(mark on T) with the dividers to O_p and mark it on a horizontal radius of the picture.', () => {
          ths.forEach(t => k.dot(k.pt(Oc.x + radius(t), f), { r: 0.7 }));
        });
        k.step('compass', 'With centre O_p draw the rings through those marks. Each ring is the set of directions at one angle from the axis.', () => {
          ths.forEach(t => k.circle(Oc, radius(t), { cls: 'curve' }));
        });
        k.note(o.final(radius, o.thetas), () => {
          ths.forEach((t, i) => k.label(g.polar(Oc, radius(t), (90 - 25 * i) * D2R), o.thetas[i] + '°', 'ne', { upright: true, size: 0.65 }));
        });
      }
    };
  }
  Hyper.construction(ringsConstruction({
    id: 'ld-equisolid-rings', f: 70, thetas: [30, 60, 90, 120, 150, 180],
    title: 'The equisolid rings from the chord',
    tags: ['fisheye', 'equisolid', 'compass', 'chord'],
    note: 'The equisolid-angle law r = 2f·sin(θ/2) is the length of the chord A P that the angle θ cuts off a circle of radius f: with the compass fixed at A and the pencil at P, the arc swings P down to the picture line T and lays the chord off from A. The rings come out closer and closer together towards the edge — that is how the picture keeps areas true.',
    final: (rad, th) => 'The rings crowd towards the edge: with f = 70 the radii are ' + th.map(t => fmt(rad(t * D2R))).join(', ') + ', so the last step, from ' + th[th.length - 2] + '° to ' + th[th.length - 1] + '°, is only ' + fmt(rad(th[th.length - 1] * D2R) - rad(th[th.length - 2] * D2R)) + ' wide while the first 30° is ' + fmt(rad(th[0] * D2R)) + '. At 180° the ring has radius 2f. Equal areas on the sphere are equal areas on the paper.',
    radius: f => t => 2 * f * sin(t / 2),
    steps(k, c) {
      k.step('compass', 'For each ray put the compass point at A and the pencil at P_i and swing the arc down to the line T: it cuts T at the chord length 2f·sin(θ/2) from A.', () => {
        c.ths.forEach(t => k.arc(c.A, c.g.dist(c.A, c.P(t)), -t / 2, 0, { cls: 'cons' }));
        c.ths.forEach(t => k.dot(c.hit(t), { r: 0.7 }));
      });
    }
  }));
  Hyper.construction(ringsConstruction({
    id: 'ld-stereo-rings', f: 60, thetas: [30, 60, 90, 120], useS: true,
    title: 'The stereographic rings from the opposite pole',
    tags: ['fisheye', 'stereographic', 'straightedge', 'rings'],
    note: 'The stereographic law r = 2f·tan(θ/2) is the projection of the circle of directions from its antipode S onto the tangent line T. By the inscribed-angle theorem the angle at S is half the angle at N, so the ray from S through P_i meets T at distance 2f·tan(θ/2) from A. Every circle on the sphere stays a circle in the picture — and the rings spread out towards the edge.',
    final: (rad, th) => 'The rings spread apart towards the edge: with f = 60 the radii are ' + th.map(t => fmt(rad(t * D2R))).join(', ') + ', so each step of 30° is wider than the one before. The picture keeps angles, so a small circle of directions is a circle on the paper — but a larger one the nearer the edge.',
    radius: f => t => 2 * f * tan(t / 2),
    steps(k, c) {
      k.step('straightedge', 'From the opposite point S draw a line through each P_i to the picture line T: the inscribed angle at S is half the angle at N, so it lands at 2f·tan(θ/2) from A.', () => {
        c.ths.forEach(t => { k.seg(c.S, c.hit(t), { cls: 'cons' }); k.dot(c.hit(t), { r: 0.7 }); });
      });
    }
  }));

  /* ================================================================ equirectangular grid */
  Hyper.construction({
    id: 'ld-equirect-grid',
    title: 'A room on the longitude–latitude rectangle',
    tags: ['equirectangular', '360°', 'panorama', 'ruler', 'table'],
    note: 'The equirectangular picture uses the longitude λ = arctan2(x, z) as the horizontal coordinate and the latitude φ = arcsin(y/|d|) as the vertical one, both in degrees (here 1° = 1 unit). Vertical lines of the room are straight vertical lines of the picture, but they stop short of the poles; a horizontal line of the front wall is the arch tan φ = (b/D)·cos λ; the edges running away from the viewer swing up to a hump when the wall is at right angles to the view.',
    build(k) {
      const g = k.g, a = 3, b = 2, D = 4;
      const ll = (X, Y, Z) => { const d = Math.hypot(X, Y, Z); return k.pt(atan2(X, Z) * R2D, asin(Y / d) * R2D); };
      const lat0 = asin(b / Math.hypot(a, b, D)) * R2D, lon0 = atan2(a, D) * R2D;
      const wall = (z, sy) => [-a, -1.5, 0, 1.5, a].map(x => ll(x, sy * b, z));
      const side = (x, sy) => [D, 2, 0, -2, -D].map(z => ll(x, sy * b, z));
      const backR = (sy) => [0, 1.5, a].map(x => ll(x, sy * b, -D)), backL = (sy) => [-a, -1.5, -0.0001].map(x => ll(x, sy * b, -D));
      k.given('The rectangle 360° × 180° of the picture, with the horizon (latitude 0) and the centre line (longitude 0, straight ahead). The room is 6 wide, 4 high and 8 long, the eye at its centre; so the corners are at longitude ±' + fmt(lon0) + '° and ±' + fmt(180 - lon0) + ', latitude ±' + fmt(lat0) + '°.', () => {
        k.seg(k.pt(-180, 0), k.pt(180, 0), { cls: 'given' }); k.seg(k.pt(0, -90), k.pt(0, 90), { cls: 'given' });
        k.seg(k.pt(-180, -90), k.pt(180, -90), { cls: 'given' }); k.seg(k.pt(-180, 90), k.pt(180, 90), { cls: 'given' });
        k.seg(k.pt(-180, -90), k.pt(-180, 90), { cls: 'given' }); k.seg(k.pt(180, -90), k.pt(180, 90), { cls: 'given' });
        k.label(k.pt(-180, 0), 'horizon', 'nw', { upright: true, size: 0.7 }); k.frame(-205, -98, 190, 98);
      });
      k.step('dividers', 'Step off the longitudes every 30° along the horizon from the centre (30 units each way, equal steps).', () => {
        for (let l = -150; l <= 150; l += 30) if (l) k.dot(k.pt(l, 0), { r: 0.6 });
      });
      k.step('square', 'Through each mark draw a vertical: the meridians.', () => {
        for (let l = -150; l <= 150; l += 30) if (l) k.seg(k.pt(l, -90), k.pt(l, 90), { cls: 'cons' });
      });
      k.step('tee', 'Draw the parallels of latitude at ±30° and ±60° with the T-square.', () => {
        [-60, -30, 30, 60].forEach(p => k.seg(k.pt(-180, p), k.pt(180, p), { cls: 'cons' }));
      });
      k.step('ruler', 'Plot the eight corners of the room from the table: longitude ±' + fmt(lon0) + '° and ±' + fmt(180 - lon0) + '°, latitude ±' + fmt(lat0) + '° (arcsin of 2/√29).', () => {
        [[1, 1, 1], [-1, 1, 1], [1, -1, 1], [-1, -1, 1], [1, 1, -1], [-1, 1, -1], [1, -1, -1], [-1, -1, -1]].forEach(s => k.point(ll(s[0] * a, s[1] * b, s[2] * D), '', 'n'));
      });
      k.step('straightedge', 'The four vertical edges of the room are straight vertical lines of the picture: join each corner pair top to bottom.', () => {
        [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(s => { const p = ll(s[0] * a, b, s[1] * D), q = ll(s[0] * a, -b, s[1] * D); k.seg(p, q, { cls: 'thick' }); });
      });
      k.step('ruler', 'Plot points of the front wall\'s top and bottom edges: longitude λ = arctan(x/4), latitude φ = arctan((2/4)·cos λ) for x = −3, −1.5, 0, 1.5, 3: the middle is at φ = ' + fmt(atan(0.5) * R2D) + '°, the corners at ' + fmt(lat0) + '°. Do the same for the back wall (longitudes near ±180°).', () => {
        [1, -1].forEach(sy => { wall(D, sy).slice(1, -1).forEach(p => k.dot(p, { r: 0.7 })); wall(-D, sy).slice(1, -1).forEach(p => k.dot(p, { r: 0.7 })); });
      });
      k.step('ruler', 'The edges that run away from the viewer, at x = ±3: λ = arctan2(±3, z) and φ = arctan(±2/√(9 + z²)) for z = 4, 2, 0, −2, −4. At z = 0 (the wall straight to the side) the edge is at its highest, φ = ' + fmt(atan(2 / 3) * R2D) + '°.', () => {
        [1, -1].forEach(sy => [a, -a].forEach(x => side(x, sy).slice(1, -1).forEach(p => k.dot(p, { r: 0.7 }))));
      });
      k.step('pencil', 'Trace the curves through the points: the top and bottom edges of the front and back walls (flat arches) and the four edges running along the room, which swing up to a hump at the side.', () => {
        [1, -1].forEach(sy => {
          k.smooth(wall(D, sy), { cls: 'curve', n: 16 });
          k.smooth(backR(sy), { cls: 'curve', n: 16 }); k.smooth(backL(sy), { cls: 'curve', n: 16 });
          [a, -a].forEach(x => k.smooth(side(x, sy), { cls: 'curve', n: 16 }));
        });
      });
      k.note('The picture is stretched sideways towards the poles: a whole row at latitude 80° is as wide as the equator, though it is a small circle of the sphere. That is why a 360° photograph looks stretched near the ceiling and floor.', () => {
        k.text(120, 80, 'zenith: one point, a whole row', { size: 0.7, upright: true }); k.text(-120, -80, 'nadir: one point, a whole row', { size: 0.7, upright: true });
      });
    }
  });

  /* ================================================================ cube net */
  Hyper.construction({
    id: 'ld-cube-net',
    title: 'The cube-map net of a room',
    tags: ['cube map', 'rectilinear', 'one-point', 'set square', 'net'],
    note: 'Each face of the cube is an ordinary rectilinear picture of a 90° square cone of directions, with its vanishing point at the middle of the face and the focal length equal to half the side. A straight line of the room is straight in every face it crosses, but it changes direction at the seam — the corner edges do it at the borders of the front face. The six faces unfold as a cross: four in a row (left, front, right, back) with the ceiling above the front and the floor below it.',
    build(k) {
      const g = k.g, f = 50, a = 3, b = 2, D = 4;
      const faces = [
        { n: 'front', F: [0, 0, 1], Rt: [1, 0, 0], Up: [0, 1, 0], c: [0, 0] }, { n: 'right', F: [1, 0, 0], Rt: [0, 0, -1], Up: [0, 1, 0], c: [2 * f, 0] },
        { n: 'back', F: [0, 0, -1], Rt: [-1, 0, 0], Up: [0, 1, 0], c: [4 * f, 0] }, { n: 'left', F: [-1, 0, 0], Rt: [0, 0, 1], Up: [0, 1, 0], c: [-2 * f, 0] },
        { n: 'up', F: [0, 1, 0], Rt: [1, 0, 0], Up: [0, 0, -1], c: [0, 2 * f] }, { n: 'down', F: [0, -1, 0], Rt: [1, 0, 0], Up: [0, 0, 1], c: [0, -2 * f] }
      ];
      const dot = (u, v) => u[0] * v[0] + u[1] * v[1] + u[2] * v[2];
      const segs = [];
      const add = (p, q, tag) => segs.push({ p, q, tag });
      const rect = (z, tag) => { add([-a, -b, z], [a, -b, z], tag); add([-a, b, z], [a, b, z], tag); add([-a, -b, z], [-a, b, z], tag); add([a, -b, z], [a, b, z], tag); };
      rect(D, 'wallF'); rect(-D, 'wallB');
      [-a, a].forEach(x => [-b, b].forEach(y => add([x, y, -D], [x, y, D], 'edgeZ')));
      [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach((s, i, arr) => { const t = arr[(i + 1) % 4]; add([s[0], b, s[1]], [t[0], b, t[1]], 'lamp'); add([s[0], -b, s[1]], [t[0], -b, t[1]], 'rug'); });
      function clip(face, s) {
        const p = s.p, e = [s.q[0] - p[0], s.q[1] - p[1], s.q[2] - p[2]], F = face.F, Rt = face.Rt, Up = face.Up;
        const cons = [];
        for (const sg of [1, -1]) { cons.push([dot(p, F) + sg * dot(p, Rt), dot(e, F) + sg * dot(e, Rt)]); cons.push([dot(p, F) + sg * dot(p, Up), dot(e, F) + sg * dot(e, Up)]); }
        let t0 = 0, t1 = 1;
        for (const [c0, c1] of cons) { if (Math.abs(c1) < 1e-12) { if (c0 < 0) return null; } else { const t = -c0 / c1; if (c1 > 0) t0 = Math.max(t0, t); else t1 = Math.min(t1, t); } }
        if (t1 - t0 < 1e-9) return null;
        const at = t => { const d = [p[0] + t * e[0], p[1] + t * e[1], p[2] + t * e[2]], w = dot(d, F); return k.pt(face.c[0] + f * dot(d, Rt) / w, face.c[1] + f * dot(d, Up) / w); };
        return [at(t0), at(t1)];
      }
      const inFace = (name, tag) => { const fc = faces.find(x => x.n === name); return segs.filter(s => s.tag === tag).map(s => clip(fc, s)).filter(Boolean); };
      const draw = (name, tag, cls) => inFace(name, tag).forEach(pq => k.seg(pq[0], pq[1], { cls: cls || 'thick' }));
      k.given('The room: 6 wide, 4 high and 8 long, the eye at its centre; a lamp 2 × 2 on the ceiling and a rug 2 × 2 on the floor. Each face of the cube map has side 2f = 100 (the dividers carry it) because its half-angle is 45°: f = 50.', () => {
        const gA = k.pt(-150, -125), gB = k.pt(-50, -125);
        k.seg(gA, gB, { cls: 'given' }); k.tick(gA, k.pt(1, 0)); k.tick(gB, k.pt(1, 0)); k.dim(gA, gB, '2f', { dist: 1.1 });
        k.frame(-165, -165, 265, 165);
      });
      k.step('tee', 'With the T-square draw the horizontals of the net: the top and the bottom of the row of four faces (y = ±50) and the top of the ceiling face and the bottom of the floor face (y = ±150).', () => {
        k.seg(k.pt(-150, 50), k.pt(250, 50), { cls: 'cons' }); k.seg(k.pt(-150, -50), k.pt(250, -50), { cls: 'cons' });
        k.seg(k.pt(-50, 150), k.pt(50, 150), { cls: 'cons' }); k.seg(k.pt(-50, -150), k.pt(50, -150), { cls: 'cons' });
      });
      k.step('square', 'With the set square draw the verticals: x = −150, −50, 50, 150, 250 across the row of four faces, and x = ±50 above and below the front face.', () => {
        [-150, -50, 50, 150, 250].forEach(x => k.seg(k.pt(x, -50), k.pt(x, 50), { cls: 'cons' }));
        [-50, 50].forEach(x => { k.seg(k.pt(x, 50), k.pt(x, 150), { cls: 'cons' }); k.seg(k.pt(x, -150), k.pt(x, -50), { cls: 'cons' }); });
        faces.forEach(fc => k.text(fc.c[0], fc.c[1] - 40, fc.n, { size: 0.65, upright: true, cls: 'aux' }));
      });
      k.step('ruler', 'Front face: the far wall is 4 away, so its corners lie at x = ±f·3/4 = ±37.5 and y = ±f·2/4 = ±25 from the centre (the face\'s vanishing point). Mark them.', () => {
        inFace('front', 'wallF').forEach(pq => { k.dot(pq[0], { r: 0.8 }); k.dot(pq[1], { r: 0.8 }); });
      });
      k.step('tee', 'Join the corners with the T-square and set square: the far wall is a rectangle, drawn true to shape (the wall is parallel to the picture plane).', () => { draw('front', 'wallF'); });
      k.step('straightedge', 'The four long edges run to the vanishing point at the centre of the face: draw each from its far corner outwards along the line through the centre, as far as the border of the face.', () => { draw('front', 'edgeZ'); });
      k.step('ruler', 'Right face: the wall x = 3 is parallel to this face, so the corner edges are horizontal lines at y = ±f·2/3 = ±33.3 across it; they meet the front face\'s edge lines on the seam. The left face is the same on the other side.', () => { draw('right', 'edgeZ'); draw('left', 'edgeZ'); });
      k.step('dividers', 'Back face: the far wall behind is also 4 away: carry the front face\'s rectangle and radial edges to the back face.', () => { draw('back', 'wallB'); draw('back', 'edgeZ'); });
      k.step('ruler', 'Ceiling and floor faces: the lamp and the rug lie 2 from the eye, so their squares (2 × 2) have half-side f·1/2 = 25 about the middle of the face. The edges of the room are too far out to enter these faces.', () => { draw('up', 'lamp'); draw('down', 'rug'); });
      k.note('At the seam between the front and the right face the corner edge meets itself with a kink: in the front face it climbs obliquely towards the corner, in the right face it runs horizontally. The straightness of lines inside each face and the kinks at the seams are the signature of a cube map.', () => {
        k.point(k.pt(50, f * b / a), 'kink', { at: 'se', open: true, lo: { upright: true, size: 0.7 } });
      });
    }
  });

  /* ================================================================ dome master */
  Hyper.construction({
    id: 'ld-dome-master',
    title: 'The dome master: altitude rings and the celestial equator',
    tags: ['dome', 'planetarium', 'azimuthal equidistant', 'dividers', 'compass'],
    note: 'The dome master is the azimuthal equidistant picture of the hemisphere: the zenith at the centre, the horizon at the rim, a point at altitude h at distance r = R·(90° − h)/90° from the centre in the direction of its azimuth. It is drawn as the sky is seen looking up: north at the top, east on the left. The celestial equator rises exactly in the east, sets exactly in the west and crosses the meridian at altitude 90° − φ; one circular arc through these three points follows it to about 1 % of R.',
    build(k) {
      const g = k.g, R = 150, phi = 32 * D2R;
      const Z = k.pt(0, 0), pos = (alt, az) => { const r = R * (PI / 2 - alt) / (PI / 2); return k.pt(-r * sin(az), r * cos(az)); };
      const E = k.pt(-R, 0), W = k.pt(R, 0), Q = pos(PI / 2 - phi, PI), Pn = pos(phi, 0);
      const C = g.circumcenter(E, Q, W), rC = g.dist(C, E);
      const eq = []; for (let t = 0.0005; t < PI; t += 0.04) { const alt = asin(sin(t) * cos(phi)), az = atan2(cos(t), -sin(t) * sin(phi)); eq.push(pos(alt, az)); }
      k.given('The disc of radius R = 150 (the horizon) with its centre Z, the zenith. The place is at latitude φ = 32° north. North is at the top, east on the left, as on a star chart held overhead.', () => {
        k.circle(Z, R, { cls: 'given' }); k.point(Z, 'Z', 'se');
        k.label(k.pt(0, R), 'N', 'n', { upright: true }); k.label(k.pt(0, -R), 'S', 's', { upright: true }); k.label(k.pt(-R, 0), 'E', 'w', { upright: true }); k.label(k.pt(R, 0), 'W', 'e', { upright: true });
        k.frame(-R * 1.15, -R * 1.12, R * 1.15, 196);
      });
      k.step('dividers', 'Divide a radius into six equal parts: steps of 15° of altitude, R/6 = 25 each. The marks are the altitudes 75°, 60°, 45°, 30°, 15° going outwards.', () => {
        for (let i = 1; i <= 5; i++) k.point(k.pt(i * R / 6, 0), '', 'n');
        [[1, 75], [3, 45], [5, 15]].forEach(([i, h]) => k.label(k.pt(i * R / 6, 0), h + '°', 's', { upright: true, size: 0.65 }));
      });
      k.step('compass', 'With centre Z draw the five circles of constant altitude through the marks. The rim is the horizon, altitude 0.', () => { for (let i = 1; i <= 5; i++) k.circle(Z, i * R / 6, { cls: 'cons' }); });
      k.step('tee', 'Draw the east–west diameter (azimuth 90° and 270°).', () => { k.seg(E, W, { cls: 'cons' }); });
      k.step('square', 'With the set square draw the north–south diameter and, with the 30° and 60° edges, the diameters at azimuths 30°, 60°, 120° and 150°.', () => {
        [0, 30, 60, 120, 150].forEach(az => k.seg(pos(0, az * D2R), pos(0, (az + 180) * D2R), { cls: 'cons' }));
      });
      k.step('ruler', 'Mark the south point of the celestial equator: it crosses the meridian at altitude 90° − φ = 58°, so r = R·32/90 = ' + fmt(g.dist(Z, Q)) + ' below Z. Mark the celestial pole too: altitude φ = 32° due north, r = ' + fmt(g.dist(Z, Pn)) + ' above Z.', () => {
        k.point(Q, 'Q', 'se'); k.point(Pn, 'pole', { at: 'ne', lo: { upright: true, size: 0.8 } });
      });
      k.step('square', 'The equator also passes through E and W (it rises due east and sets due west). The centre of the circle through E, Q and W lies on the perpendicular bisector of W Q and on the north–south line: draw the bisector.', () => {
        const m = g.mid(W, Q), dd = g.perp(g.unit(g.sub(Q, W)));
        k.seg(W, Q, { cls: 'cons' }); k.line(m, g.add(m, g.mul(dd, 10)), { cls: 'cons' }); k.point(C, 'C', 'ne');
      });
      k.step('compass', 'With centre C and radius C W draw the arc from W through Q to E: the visible half of the celestial equator.', () => { arcVia(k, C, W, Q, E, { cls: 'curve' }); });
      k.note('Dashed: the exact curve (altitude and azimuth of the points of the equator, plotted on the same paper). The arc is within about 1 % of R. Stars on the equator move along it from E to W in twelve hours; those near the pole circle slowly about the pole mark.', () => {
        k.curve(eq, null, { cls: 'aux', dash: true });
      });
    }
  });

  /* ================================================================ cylinder anamorphosis */
  Hyper.construction({
    id: 'ld-cylinder-anamorphosis',
    title: 'Cylinder-mirror anamorphosis: the polar grid',
    tags: ['anamorphosis', 'mirror', 'cylinder', 'protractor', 'reflection'],
    note: 'A mirror cylinder of radius ρ stands on the sheet and is looked at from far away along the +y direction. The column of the undistorted picture at abscissa x = ρ sin β is seen at the point M of the near half of the circle where the radius makes the angle β with the line of sight. There the ray is reflected through 2β: it leaves M in the direction (sin 2β, −cos 2β). A point of the picture at depth y* (measured from the plane through the axis) lies at the distance t = y* + ρ cos β from M along that ray. So vertical lines of the picture become rays, horizontal lines become curves round the cylinder, and the whole picture opens into a fan.',
    build(k) {
      const g = k.g, rho = 100, O = k.pt(0, 0), cols = [-3, -2, -1, 0, 1, 2, 3], rows = [0, 50, 100, 150];
      const beta = i => asin(i / 4), M = i => k.pt(rho * i / 4, -rho * cos(beta(i)));
      const dirOf = i => g.dir(-PI / 2 + 2 * beta(i));            // (sin 2β, −cos 2β)
      const Pt = (i, y) => g.add(M(i), g.mul(dirOf(i), y + rho * cos(beta(i))));
      k.given('The mirror cylinder in plan: the circle of radius ρ = 100 about O. The eye is far away below the sheet, looking up the page. The picture to be seen in the mirror is a grid seven columns wide (columns at x = −75 … 75, every 25) and four rows deep (rows y* = 0, 50, 100, 150 behind the axis), shown faintly.', () => {
        k.circle(O, rho, { cls: 'given' }); k.point(O, 'O', 'ne');
        k.arrow(k.pt(-300, -360), k.pt(-300, -290), { cls: 'given' }); k.label(k.pt(-300, -360), 'eye, far away', 'e', { upright: true, size: 0.7 });
        k.seg(k.pt(-rho * 1.15, 0), k.pt(rho * 1.15, 0), { cls: 'cons' });
        cols.forEach(i => k.seg(k.pt(25 * i, rows[0]), k.pt(25 * i, rows[3]), { cls: 'aux' })); rows.forEach(y => k.seg(k.pt(-75, y), k.pt(75, y), { cls: 'aux' }));
        k.frame(-330, -380, 330, 190);
      });
      k.step('dividers', 'Divide the radius into four equal parts and step them off on the diameter either side of O: the abscissae x = ±25, ±50, ±75 of the picture\'s columns.', () => { cols.forEach(i => { if (i) k.dot(k.pt(25 * i, 0), { r: 0.7 }); }); });
      k.step('square', 'From each mark draw a line parallel to the line of sight (vertical on the page) down to the near half of the circle: M_i, the point where that column is seen.', () => {
        cols.forEach(i => { if (i) k.seg(k.pt(25 * i, 0), M(i), { cls: 'cons' }); k.point(M(i), '', 'n'); });
      });
      k.step('protractor', 'At each M_i the radius makes the angle β_i with the vertical (β = ' + [1, 2, 3].map(i => fmt(beta(i) / D2R)).join('°, ') + '°). The mirror turns the ray through 2β: lay off 2β from the downward vertical, outwards, and draw the reflected ray.', () => {
        cols.forEach(i => k.seg(M(i), Pt(i, rows[3]), { cls: 'cons' }));
        k.angle(M(3), k.pt(M(3).x, M(3).y - 40), Pt(3, 40), { label: '2β', r: 1, labelDist: 1.6 });
      });
      k.step('ruler', 'Along each ray lay off the distances t = y* + ρ cos β from M_i, for the four rows y* = 0, 50, 100, 150. On the middle ray (β = 0) they are 100, 150, 200, 250; on the outer rays (β = ' + fmt(beta(3) / D2R) + '°) they are ' + rows.map(y => fmt(y + rho * cos(beta(3)))).join(', ') + '.', () => {
        cols.forEach(i => rows.forEach(y => k.dot(Pt(i, y), { r: 0.7 })));
      });
      k.step('pencil', 'Join the points of each row with a smooth curve: these are the picture\'s horizontal lines, now arcs fanned round the cylinder. The rays are its vertical lines. Draw the picture on this grid, one cell at a time.', () => {
        rows.forEach(y => k.smooth(cols.map(i => Pt(i, y)), { cls: 'curve', n: 16 }));
      });
      k.note('Stand the mirror on the circle and look from far away along the line of sight: the fan is seen as the square grid, standing behind the cylinder. Move the eye and the picture shears: the construction assumes the eye is far away.', () => {
        k.text(0, -260, 'the fan on the sheet', { size: 0.7, upright: true, cls: 'aux' });
      });
    }
  });

  /* ================================================================ cone anamorphosis */
  Hyper.construction({
    id: 'ld-cone-anamorphosis',
    title: 'Cone-mirror anamorphosis: the picture turned inside out',
    tags: ['anamorphosis', 'mirror', 'cone', 'protractor', 'plan and elevation'],
    note: 'A mirror cone of half-angle γ stands on the sheet and is looked down upon from above its apex. A vertical ray meets the cone side at the radius r_M and is reflected through 2γ from the vertical: it reaches the sheet at r = r_M + z_M·tan 2γ, where z_M = (ρ − r_M)/tan γ is the height of the point. For γ = 30° this is r = 3ρ − 2 r_M: the centre of the picture (the apex) goes to the outer ring of radius 3ρ, the rim of the cone to the radius ρ itself, and the picture is turned inside out, with the azimuth unchanged.',
    build(k) {
      const g = k.g, rho = 100, ga = 30 * D2R, H = rho / tan(ga), ys = -360;
      const rM = [0, 25, 50, 75, 100], rP = r => r + (rho - r) / tan(ga) * tan(2 * ga);
      const Mp = r => k.pt(r, (rho - r) / tan(ga));
      const base = k.pt(0, 0), Op = k.pt(0, ys), rmax = rP(0);
      k.given('Above, the profile of the cone: apex at height H = ' + fmt(H) + ', base radius ρ = 100, half-angle γ = 30°; the eye looks down along the vertical. Below, the plan: the base circle about O\' (the same radius).', () => {
        k.seg(k.pt(-rmax - 20, 0), k.pt(rmax + 20, 0), { cls: 'given' });
        k.poly([k.pt(-rho, 0), k.pt(0, H), k.pt(rho, 0)], { close: true, cls: 'given' });
        k.seg(k.pt(0, -10), k.pt(0, H + 25), { cls: 'cons' }); k.point(base, 'O', 'sw');
        k.circle(Op, rho, { cls: 'given' }); k.point(Op, 'O\'', 'ne');
        k.arrow(k.pt(-rmax, H + 40), k.pt(-rmax, H - 20), { cls: 'given' }); k.label(k.pt(-rmax, H + 40), 'eye', 'n', { upright: true, size: 0.7 });
        k.frame(-rmax - 25, ys - rmax - 15, rmax + 25, H + 60);
      });
      k.step('dividers', 'Divide the base radius into four equal parts: r_M = 25, 50, 75 (and the apex 0 and the rim 100).', () => { rM.slice(1, 4).forEach(r => k.dot(k.pt(r, 0), { r: 0.7 })); });
      k.step('square', 'From each mark draw a vertical (the incoming ray) up to the side of the cone: the points M_i.', () => {
        rM.slice(0, 4).forEach(r => { if (r) k.seg(k.pt(r, 0), Mp(r), { cls: 'cons' }); k.point(Mp(r), '', 'n'); });
      });
      k.step('protractor', 'At each M_i the reflected ray makes the angle 2γ = 60° with the vertical, pointing outwards and downwards. Lay it off and extend it to the base line.', () => {
        rM.slice(0, 4).forEach(r => k.seg(Mp(r), k.pt(rP(r), 0), { cls: 'cons' }));
        k.angle(Mp(25), k.pt(25, Mp(25).y - 40), k.pt(rP(25), 0), { label: '2γ', r: 0.9, labelDist: 1.7 });
      });
      k.step('ruler', 'Mark where each ray meets the base line: r = r_M + z_M·tan 2γ = ' + rM.slice(0, 4).map(r => fmt(rP(r))).join(', ') + ' for the apex and for r_M = 25, 50, 75. (The rim, r_M = 100, stays at 100.)', () => {
        rM.slice(0, 4).forEach(r => k.point(k.pt(rP(r), 0), '', 'n'));
      });
      k.step('compass', 'With centre O\' draw the circles of radius ' + rM.map(r => fmt(rP(r))).join(', ') + ' in the plan: the rings on which the picture\'s concentric circles are drawn.', () => {
        rM.forEach(r => { if (r !== 100) k.circle(Op, rP(r), { cls: 'curve' }); });
      });
      k.step('square', 'The azimuth is unchanged: draw radii every 30° with the set square, the picture\'s radial lines.', () => {
        [0, 30, 60, 90, 120, 150].forEach(p => k.seg(g.polar(Op, -rmax, p * D2R), g.polar(Op, rmax, p * D2R), { cls: 'cons' }));
      });
      k.note('The picture\'s centre is on the outermost ring, its rim on the ring next to the cone, and its brightest detail is stretched over the large outer rings. Draw the picture in polar coordinates with the radius reversed: r_sheet = 3ρ − 2 r_picture.', () => {
        k.label(g.polar(Op, rmax, 80 * D2R), 'picture centre', 'ne', { upright: true, size: 0.7 }); k.label(g.polar(Op, rho, 50 * D2R), 'picture rim', 'ne', { upright: true, size: 0.7 });
      });
    }
  });

  /* ================================================================ little planet */
  Hyper.construction({
    id: 'ld-planet-circles',
    title: 'A little planet: the altitude circles of the stereographic picture',
    tags: ['little planet', 'stereographic', 'compass', 'panorama', 'rings'],
    note: 'Look straight down at the ground and take the stereographic picture r = 2f·tan(θ/2) of the whole panorama, θ the angle from the nadir. A circle of constant altitude h in the panorama is the circle of constant θ = 90° + h about the nadir: the ground below the horizon fills the small inside, the horizon (θ = 90°) is the circle of radius 2f, and the sky is stretched outwards without limit (the zenith is at infinity). A vertical post is a radius; the whole panorama strip is wrapped round the centre.',
    build(k) {
      const g = k.g, f = 25, alts = [-60, -30, 0, 30, 60], r = h => 2 * f * tan((90 + h) * D2R / 2);
      const O = k.pt(0, 0), rmax = r(60);
      k.given('The centre O of the picture is the nadir, the point of the ground straight below the camera. The scale is f = 25 (a segment to carry with the dividers). The panorama\'s altitudes −60°, −30°, 0° (the horizon), +30° and +60° go to the rings θ = 90° + altitude.', () => {
        k.point(O, 'O', 'se');
        const gA = k.pt(-rmax - 5, -rmax - 15), gB = k.pt(-rmax - 5 + f, -rmax - 15);
        k.seg(gA, gB, { cls: 'given' }); k.tick(gA, k.pt(1, 0)); k.tick(gB, k.pt(1, 0)); k.dim(gA, gB, 'f', { dist: 1.1 });
        k.frame(-rmax - 15, -rmax - 25, rmax + 15, rmax + 15);
      });
      k.step('ruler', 'Lay off the radii r = 2f·tan(θ/2) along a horizontal radius to the right: ' + alts.map(h => fmt(r(h))).join(', ') + ' for the altitudes −60°, −30°, 0°, +30°, +60°.', () => {
        alts.forEach(h => k.dot(k.pt(r(h), 0), { r: 0.7 }));
      });
      k.step('compass', 'With centre O draw the five circles. The circle through 0° is the horizon: the rim of the little planet. Inside is the ground, outside the sky.', () => {
        alts.forEach(h => k.circle(O, r(h), { cls: h === 0 ? 'curve' : 'cons' }));
      });
      k.step('square', 'The azimuth of the panorama becomes the angle round the centre. Draw the radii every 30° with the set square: the vertical lines of the panorama.', () => {
        [0, 30, 60, 90, 120, 150].forEach(p => k.seg(g.polar(O, -rmax, p * D2R), g.polar(O, rmax, p * D2R), { cls: 'cons' }));
      });
      k.step('pencil', 'A tower of the panorama between azimuths 120° and 150° and altitudes 0° to 30°: two radii and two arcs, a curved quadrilateral standing on the rim of the planet. Draw it.', () => {
        const a0 = 120 * D2R, a1 = 150 * D2R;
        k.seg(g.polar(O, r(0), a0), g.polar(O, r(30), a0), { cls: 'thick' }); k.seg(g.polar(O, r(0), a1), g.polar(O, r(30), a1), { cls: 'thick' });
        k.arc(O, r(0), a0, a1, { cls: 'thick' }); k.arc(O, r(30), a0, a1, { cls: 'thick' });
      });
      k.note('Buildings stand on the rim of the planet and point away from the centre; the ground is the planet itself and the sky is stretched across the whole outer ring. The picture is conformal, so the tower\'s corners are still right angles, but its top is wider than its base: ' + fmt(r(30) / r(0), 2) + ' times the radius.', () => {
        k.label(g.polar(O, r(0), 40 * D2R), 'horizon', 'ne', { upright: true, size: 0.7 }); k.label(g.polar(O, r(60), 60 * D2R), 'sky', 'ne', { upright: true, size: 0.7 }); k.label(g.polar(O, r(-30), 80 * D2R), 'ground', 'ne', { upright: true, size: 0.7 });
      });
    }
  });
})();
