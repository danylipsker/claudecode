/* HYPER-PROJECTIONS · constructions/cylindrical-family.js — the cylindrical projections drawn by hand.
 *
 *   cy-cylinder-side-view      one latitude, four cylinders: central, Lambert (Archimedes), equirectangular, Mercator
 *   cy-equirectangular-grid    the plate carrée with T-square and dividers, and the effect of a standard parallel
 *   cy-tm-grid                 the transverse Mercator graticule from a table of coordinates
 *   cy-utm-zone-layout         the sixty UTM zones and the lettered latitude bands
 *   cy-web-mercator-square     the Web Mercator square, cut at 85.05°, and its tiles
 *   cy-archimedes-cylinder     Lambert's equal-area map by Archimedes' construction
 *   cy-gall-peters-sheet       the Gall–Peters map: the same construction with the 45° standard parallels
 *   cy-miller-table            Miller's cylindrical from a table
 *   cy-gall-stereographic      Gall's stereographic cylindrical: projectors from the equator point opposite
 *   cy-cassini-grid            the Cassini graticule from perpendicular distances and feet
 *   cy-central-cylinder        the central cylindrical projection: projectors from the centre
 * Points are computed, never guessed; where the hand method is a table (Mercator, Miller, Cassini, transverse
 * Mercator) the table values are computed from the formula and printed in the step.
 */
(function () {
  'use strict';
  const D = Math.PI / 180, SQ2 = Math.SQRT2;
  const merc = ph => Math.log(Math.tan(Math.PI / 4 + ph * D / 2));        // Mercator ordinate for R = 1
  const f1 = x => x.toFixed(1);

  /* ---------------------------------------------------------------------------------------------------------- 1 */
  Hyper.construction({
    id: 'cy-cylinder-side-view',
    title: 'One latitude, four cylinders: the ordinate from a side view',
    tags: ['cylindrical', 'central', 'Archimedes', 'equirectangular', 'Mercator', 'side view'],
    note: 'A cylinder round the equator is seen from the side as a vertical line touching the circle of the globe. The meridians come out as equally spaced verticals whatever the projection; the projections differ only in how high the parallel of latitude φ is placed on the cylinder. For φ = 50° and R = 100: the central projection (a light at the centre) R tan φ = 119.2; Mercator R ln tan(45° + φ/2) = 101.1, stretched to keep angles true; the equirectangular R φ = 87.3, the arc simply laid out straight; Lambert’s (parallel horizontal rays) R sin φ = 76.6. Only the first and the last are geometric projections.',
    build(k) {
      const g = k.g, R = 100, ph = 50;
      const O = k.pt(0, 0), E = k.pt(R, 0), one = k.pt(R, 1);
      const Q = k.pt(R * Math.cos(ph * D), R * Math.sin(ph * D));
      const yC = R * Math.tan(ph * D), yL = R * Math.sin(ph * D), yM = R * merc(ph);
      const ch = 2 * R * Math.sin(5 * D);
      k.given('The globe seen from the side with the axis vertical: a circle of radius R about O, the equator E on the right, and the cylinder, a vertical line touching the globe at E. The parallel we project is at latitude 50°.', () => {
        k.circle(O, R, { cls: 'given' });
        k.seg(k.pt(-R, 0), k.pt(R * 1.45, 0), { cls: 'cons' });
        k.line(k.pt(R, -R * 0.4), k.pt(R, R * 1.4), { cls: 'given' });
        k.point(O, 'O', 'sw'); k.point(E, 'E', 'se');
        k.label(k.pt(R, R * 1.32), 'cylinder', 'ne', { upright: true, size: 0.8 });
        k.frame(-R * 1.15, -R * 1.12, R * 1.95, R * 1.45);
      });
      k.step('protractor', 'At O lay off the angle 50° from OE: it marks the point Q of latitude 50° on the globe.', () => {
        k.seg(O, Q, { cls: 'cons' }); k.point(Q, 'Q', 'nw'); k.angle(O, E, Q, { label: 'φ', r: 1.6 });
      });
      k.step('straightedge', 'Central cylindrical: the light is at O. Extend the line OQ to the cylinder: the height above E is R tan φ.', () => {
        k.seg(Q, g.lineLine(O, Q, E, one), { cls: 'cons' });
        k.point(k.pt(R, yC), 'central ' + f1(yC), { at: 'e', cls: 'red', lo: { upright: true, size: 0.7 } });
      });
      k.step('ruler', 'Mercator has no projector: the height is a logarithm, R ln tan(45° + φ/2) = 101.1 (from the table of meridional parts). Lay it off up the cylinder from E with the scale.', () => {
        k.point(k.pt(R, yM), 'Mercator ' + f1(yM), { at: 'e', cls: 'red', lo: { upright: true, size: 0.7 } });
      });
      k.step('dividers', 'Equirectangular: set the dividers to a chord of 10° and step five times along the arc from E to Q, then five times up the cylinder from E. The arc is laid out straight: height R φ.', () => {
        for (let i = 1; i <= 5; i++) { k.dot(k.pt(R * Math.cos(10 * i * D), R * Math.sin(10 * i * D)), { r: 0.55 }); k.dot(k.pt(R, i * ch), { r: 0.55 }); }
        k.point(k.pt(R, 5 * ch), 'equirect. ' + f1(R * ph * D), { at: 'e', cls: 'red', lo: { upright: true, size: 0.7 } });
      });
      k.step('tee', 'Lambert’s (Archimedes’): the rays are horizontal. With the T-square draw the horizontal from Q to the cylinder: height R sin φ.', () => {
        k.seg(Q, k.pt(R, yL), { cls: 'cons' });
        k.point(k.pt(R, yL), 'Lambert ' + f1(yL), { at: 'e', cls: 'red', lo: { upright: true, size: 0.7 } });
      });
      k.note('The same latitude lands at four heights, 76.6 to 119.2. Because the meridians are equally spaced in all four, the choice of height decides everything: how much the map stretches north–south, and so whether it keeps angles (Mercator), areas (Lambert), distances along the meridians (equirectangular) or none.', () => {
        k.seg(k.pt(R * 1.68, yL), k.pt(R * 1.68, yC), { cls: 'cons' }); k.tick(k.pt(R * 1.68, yL), k.pt(1, 0)); k.tick(k.pt(R * 1.68, yC), k.pt(1, 0));
        k.label(k.pt(R * 1.68, (yL + yC) / 2), 'spread ' + f1(yC - yL), 'e', { upright: true, size: 0.7 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 2 */
  Hyper.construction({
    id: 'cy-equirectangular-grid',
    title: 'The equirectangular graticule with T-square and dividers',
    tags: ['equirectangular', 'plate carrée', 'T-square', 'dividers', 'standard parallel'],
    note: 'Longitude and latitude are used directly as x and y, with the same scale for both: a degree of longitude is as long as a degree of latitude. The world is a rectangle twice as wide as high. The coast of the continents (hairlines) is drawn from the engine’s own table, for comparison. With a standard parallel φ₁ the meridians are drawn closer, by the factor cos φ₁: Marinus of Tyre’s rectangle used φ₁ = 36°, the latitude of Rhodes.',
    build(k) {
      const g = k.g, R = 60, u = R * D, W = 180 * u, H = 90 * u;
      const lons = []; for (let l = -180; l <= 180; l += 30) lons.push(l);
      const lats = [-90, -60, -30, 0, 30, 60, 90];
      k.given('The equator drawn as a horizontal line, the central meridian through O, and the length of 30° of arc on a globe of radius R = 60: 31.4 units. Draw it as a ticked segment so that the dividers can carry it.', () => {
        const O = k.pt(0, 0);
        k.seg(k.pt(-W, 0), k.pt(W, 0), { cls: 'given' });
        k.point(O, 'O', 'se');
        const a = k.pt(-W - 2, -H - 24), b = k.pt(-W - 2 + 30 * u, -H - 24);
        k.seg(a, b, { cls: 'given' }); k.tick(a, k.pt(1, 0)); k.tick(b, k.pt(1, 0)); k.dim(a, b, '30° of arc', { dist: 1.2, size: 0.7 });
        k.frame(-W - 14, -H - 40, W + 14, H + 18);
      });
      k.step('dividers', 'Step the length of 30° along the equator, 6 times to the right of O and 6 times to the left: the meridians from 180° W to 180° E.', () => {
        lons.forEach(l => { if (l) k.dot(k.pt(l * u, 0), { r: 0.6 }); });
      });
      k.step('square', 'With the set square against the T-square draw a vertical through each mark: the meridians are equally spaced parallel lines, 2 : 1 for the whole sheet.', () => {
        lons.forEach(l => k.seg(k.pt(l * u, -H), k.pt(l * u, H), { cls: 'cons' }));
        [-180, -90, 0, 90, 180].forEach(l => k.label(k.pt(l * u, H), l + '°', 'n', { upright: true, size: 0.6 }));
      });
      k.step('dividers', 'Step the same length up and down the central meridian from O, three times each way: the parallels 30°, 60° and 90° N and S are the same distance apart as the meridians.', () => {
        lats.forEach(l => { if (l) k.dot(k.pt(0, l * u), { r: 0.6 }); });
      });
      k.step('tee', 'With the T-square draw a horizontal through each mark: the parallels. The poles are lines, as long as the equator.', () => {
        lats.forEach(l => { if (l) k.seg(k.pt(-W, l * u), k.pt(W, l * u), { cls: 'cons' }); });
        [-60, -30, 30, 60].forEach(l => k.label(k.pt(-W, l * u), Math.abs(l) + '°' + (l > 0 ? 'N' : 'S'), 'w', { upright: true, size: 0.55 }));
      });
      k.note('With the standard parallel 36° the meridians (dashed) are drawn closer, 30° of longitude = 31.4 × cos 36° = 25.4. The coastlines of the globe are plotted from the table: Africa is stretched east–west towards the poles, the north of Eurasia is smeared across the top.', () => {
        const c36 = Math.cos(36 * D);
        lons.forEach(l => k.seg(k.pt(l * u * c36, -H), k.pt(l * u * c36, H), { cls: 'red', dash: true, nobounds: true }));
        Hyper.world.lines().forEach(l => { const pts = []; l.pts.forEach((p, i) => { if (i && Math.abs(p[0] - l.pts[i - 1][0]) > 180) pts.push(null); pts.push([p[0] * u, p[1] * u]); }); k.curve(pts, null, { cls: 'aux', nobounds: true }); });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 3 */
  const tmX = (ph, dl) => Math.atanh(Math.cos(ph * D) * Math.sin(dl * D));
  const tmY = (ph, dl) => Math.atan2(Math.tan(ph * D), Math.cos(dl * D));
  Hyper.construction({
    id: 'cy-tm-grid',
    title: 'The transverse Mercator graticule from a table',
    tags: ['transverse Mercator', 'UTM', 'cylindrical', 'table', 'conformal'],
    note: 'Turn the sphere so that the central meridian takes the place of the equator, apply Mercator’s formula, and turn back: x = R artanh(cos φ sin Δλ), y = R atan2(tan φ, cos Δλ), where Δλ is the longitude from the central meridian. The central meridian is straight and true to scale; every other meridian bends towards it as it goes north and meets all the others at the pole, which lies at the finite height π R / 2. The scale rises with the distance from the central meridian: at the equator it is 1/ cos Δλ, already 2 at 60°, which is why the system works in strips only a few degrees wide. Here R = 80 and the strip is 120° wide, to show the shape. Only the northern half is drawn; the south is its mirror image.',
    build(k) {
      const g = k.g, R = 80;
      const dls = [20, 40, 60], phs = [0, 20, 40, 60, 80];
      const P = (ph, dl) => k.pt(R * tmX(ph, dl), R * tmY(ph, dl));
      k.given('The equator as a horizontal line and the central meridian as a vertical through O, at the scale R = 80 units per radian (1° of arc = 1.40 units).', () => {
        const O = k.pt(0, 0);
        k.seg(k.pt(-R * 1.5, 0), k.pt(R * 1.5, 0), { cls: 'given' }); k.seg(k.pt(0, 0), k.pt(0, R * Math.PI / 2 * 1.1), { cls: 'given' });
        k.point(O, 'O', 'sw');
        k.label(k.pt(R * 1.18, 0), 'equator', 'ne', { upright: true, size: 0.7 });
        k.label(k.pt(0, R * Math.PI / 2 * 1.1), 'central meridian', 'n', { upright: true, size: 0.7 });
        k.frame(-R * 1.55, -R * 0.3, R * 1.55, R * Math.PI / 2 * 1.2);
      });
      k.step('ruler', 'Lay off the table. For each parallel and each meridian Δλ = 20°, 40°, 60° east of the central meridian, measure the abscissa x from the central meridian and the ordinate y from the equator and mark the point. Rows 0°, 20°, 40°, 60°, 80° N give (x, y): ' +
        phs.map(ph => ph + '°: ' + dls.map(dl => '(' + (R * tmX(ph, dl)).toFixed(1) + ', ' + (R * tmY(ph, dl)).toFixed(1) + ')').join(' ')).join('; ') + '. On the central meridian y = R φ.', () => {
        phs.forEach(ph => { dls.forEach(dl => k.dot(P(ph, dl), { r: 0.6 })); if (ph) k.dot(k.pt(0, R * ph * D), { r: 0.6 }); });
        k.dot(k.pt(0, R * Math.PI / 2), { r: 0.8 });
        k.label(k.pt(0, R * Math.PI / 2), 'pole', 'e', { upright: true, size: 0.7, dist: 1.4 });
      });
      k.step('pencil', 'Join the points of each parallel with a French curve (they are concave towards the pole) and mirror them to the west of the central meridian.', () => {
        phs.forEach(ph => { if (!ph) { k.seg(k.pt(-R * tmX(0, 60), 0), k.pt(R * tmX(0, 60), 0), { cls: 'thick' }); return; } [1, -1].forEach(s => k.curve(t => [s * R * tmX(ph, t), R * tmY(ph, t)], [0, 60], { cls: 'curve', n: 60 })); });
      });
      k.step('pencil', 'Join the points of each meridian in the same way: they bend towards the central meridian as they rise, and all of them end in the pole.', () => {
        dls.forEach(dl => [1, -1].forEach(s => k.curve(t => [s * R * tmX(t, dl), R * tmY(t, dl)], [0, 89.9], { cls: 'curve', n: 90 })));
        dls.forEach(dl => k.label(k.pt(R * tmX(0, dl), 0), dl + '°', 'se', { upright: true, size: 0.6 }));
      });
      k.note('Scale along the parallels near the edge of a 6° UTM zone is only 1.0010 (at the equator); here, at Δλ = 60° it is 2.0. The scale at the central meridian of a UTM zone is reduced to 0.9996 so that the error is shared between the middle and the edges.', () => {
        k.dim(k.pt(0, -R * 0.16), k.pt(R * tmX(0, 60), -R * 0.16), 'Δλ = 60° at the equator: x = ' + f1(R * tmX(0, 60)), { ticks: true, size: 0.65 });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 4 */
  Hyper.construction({
    id: 'cy-utm-zone-layout',
    title: 'The sixty UTM zones and the lettered bands',
    tags: ['UTM', 'transverse Mercator', 'zones', 'dividers', 'grid reference'],
    note: 'The UTM system cuts the world between 80° S and 84° N into 60 zones of 6° of longitude, numbered eastward from 180°: zone n has the central meridian 6n − 183° (zone 1: −177°). The lettered bands, C to X without I and O, are 8° high (the last, X, 12°). The zone and the band together name a grid square: Jerusalem (35.2° E, 31.8° N) is in 36R. Two exceptions are drawn dashed: zone 32 is widened to 9° over southern Norway (32V), and over Svalbard the zones 32, 34, 36 are dropped and the others widened (31X to 37X).',
    build(k) {
      const g = k.g, u = 1.2;
      const bands = 'CDEFGHJKLMNPQRSTUVWX', edges = []; for (let i = 0; i <= 20; i++) edges.push(i < 20 ? -80 + 8 * i : 84);
      const y0 = -80 * u, y1 = 84 * u;
      const zoneOf = lon => Math.floor((lon + 180) / 6) + 1, cmOf = n => 6 * n - 183;
      const zJ = zoneOf(35.21), bJ = bands[Math.floor((31.77 + 80) / 8)];
      k.given('The equator and the 180° meridians at either edge, on a flat sheet with 1° = 1.2 units both ways; the band from 80° S to 84° N is the UTM world.', () => {
        k.seg(k.pt(-180 * u, 0), k.pt(180 * u, 0), { cls: 'given' });
        k.seg(k.pt(-180 * u, y0), k.pt(-180 * u, y1), { cls: 'given' }); k.seg(k.pt(180 * u, y0), k.pt(180 * u, y1), { cls: 'given' });
        k.label(k.pt(180 * u, 0), 'equator', 'e', { upright: true, size: 0.55 });
        k.frame(-180 * u - 24, y0 - 14, 180 * u + 34, y1 + 18);
      });
      k.step('dividers', 'Set the dividers to 6° (7.2 units) and step along the equator from 180° W: 60 zones. Number them 1 to 60 eastward.', () => {
        for (let n = 1; n < 60; n++) k.dot(k.pt((-180 + 6 * n) * u, 0), { r: 0.45, target: false });
      });
      k.step('square', 'With the set square on the T-square draw a vertical at each division from 80° S to 84° N: the zone boundaries.', () => {
        for (let n = 1; n < 60; n++) k.seg(k.pt((-180 + 6 * n) * u, y0), k.pt((-180 + 6 * n) * u, y1), { cls: 'cons' });
      });
      k.step('tee', 'With the T-square draw horizontals at every 8° from 80° S to 72° N, and at 84° N: the band boundaries.', () => {
        edges.forEach(e => { if (Math.abs(e) !== 0) k.seg(k.pt(-180 * u, e * u), k.pt(180 * u, e * u), { cls: 'cons' }); });
      });
      k.step('pencil', 'Letter the bands C … X up the left edge and number the zones along the top (every second zone is enough).', () => {
        for (let i = 0; i < 20; i++) k.label(k.pt(-180 * u, ((edges[i] + edges[i + 1]) / 2) * u), bands[i], 'w', { upright: true, size: 0.6 });
        for (let n = 1; n <= 60; n += 1) if (n % 2 === 1 && n !== 35 && n !== 37) k.label(k.pt((-180 + 6 * n - 3) * u, y1), String(n), 'n', { upright: true, size: 0.4 });
      });
      k.step('pencil', 'Shade the grid square 36R: Jerusalem, 35.2° E, 31.8° N, is in zone ' + zJ + ' (central meridian ' + cmOf(zJ) + '° E) and band ' + bJ + '. Draw the central meridian of zone 36 as a heavy line.', () => {
        const x0 = (-180 + 6 * (zJ - 1)) * u, bi = bands.indexOf(bJ);
        k.poly([k.pt(x0, edges[bi] * u), k.pt(x0 + 6 * u, edges[bi] * u), k.pt(x0 + 6 * u, edges[bi + 1] * u), k.pt(x0, edges[bi + 1] * u)], { close: true, fill: '#9fc7ef', opacity: 0.6, cls: 'aux' });
        k.seg(k.pt(cmOf(zJ) * u, y0), k.pt(cmOf(zJ) * u, y1), { cls: 'thick' });
        k.point(k.pt(35.21 * u, 31.77 * u), 'Jerusalem', { at: 'se', cls: 'red', lo: { upright: true, size: 0.6 } });
        k.label(k.pt(cmOf(zJ) * u, y1), 'central meridian ' + cmOf(zJ) + '° E', 'n', { upright: true, size: 0.55, dist: 2.4 });
      });
      k.note('The two exceptions, dashed: the zone 32V over southern Norway is widened to 9° (3° E to 12° E), taking 3° from zone 31; the band X over Svalbard has zones of 12° (31X 0–9° E, 33X 9–21°, 35X 21–33°, 37X 33–42°).', () => {
        const yv = (56 * u), yv1 = 64 * u;
        k.poly([k.pt(3 * u, yv), k.pt(12 * u, yv), k.pt(12 * u, yv1), k.pt(3 * u, yv1)], { close: true, cls: 'red', dash: true, nobounds: true });
        k.label(k.pt(7.5 * u, yv), '32V', 's', { upright: true, size: 0.5 });
        [0, 9, 21, 33, 42].forEach(l => k.seg(k.pt(l * u, 72 * u), k.pt(l * u, 84 * u), { cls: 'red', dash: true, nobounds: true }));
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 5 */
  const tileOf = (lon, lat, z) => { const n = Math.pow(2, z); return { x: Math.floor((lon + 180) / 360 * n), y: Math.floor((1 - Math.log(Math.tan(Math.PI / 4 + lat * D / 2)) / Math.PI) / 2 * n) }; };
  Hyper.construction({
    id: 'cy-web-mercator-square',
    title: 'The Web Mercator square, cut at 85.05°, and its tiles',
    tags: ['Web Mercator', 'Mercator', 'tiles', 'square', 'compass'],
    note: 'Web Mercator is the Mercator chart cut where it becomes a square: the height equals the width when R ln tan(45° + φ/2) = π R, i.e. at φ = 85.0511°. With 1° of longitude = 1 unit the sheet is 360 × 360. The square is halved again and again into tiles: zoom z has 2^z × 2^z tiles, numbered from the top left. Tel Aviv (34.8° E, 32.1° N) is in tile 3/4/3 (zoom/column/row) at zoom 3.',
    build(k) {
      const g = k.g, L = 180, y = ph => (180 / Math.PI) * merc(ph);
      const O = k.pt(0, 0), ph0 = Math.atan(Math.sinh(Math.PI)) / D;
      const tt = tileOf(34.78, 32.07, 3);
      k.given('The equator as a horizontal line, the central meridian through O, and the scale: 1° of longitude is 1 unit, so the whole equator is 360 units.', () => {
        k.seg(k.pt(-L * 1.12, 0), k.pt(L * 1.12, 0), { cls: 'given' }); k.seg(k.pt(0, -L * 1.12), k.pt(0, L * 1.12), { cls: 'given' });
        k.point(O, 'O', 'se');
        const a = k.pt(-L * 1.12, -L * 1.18), b = k.pt(-L * 1.12 + 30, -L * 1.18);
        k.seg(a, b, { cls: 'given' }); k.tick(a, k.pt(1, 0)); k.tick(b, k.pt(1, 0)); k.dim(a, b, '30°', { dist: 1.2, size: 0.7 });
        k.frame(-L * 1.16, -L * 1.26, L * 1.16, L * 1.16);
      });
      k.step('ruler', 'Mark ±180 on the equator with the scale: the western and eastern edges of the map (the meridians of 180° W and E). With the set square draw the verticals through them.', () => {
        k.point(k.pt(-L, 0), '−180°', 'sw'); k.point(k.pt(L, 0), '180°', 'se');
        k.seg(k.pt(-L, -L), k.pt(-L, L), { cls: 'thick' }); k.seg(k.pt(L, -L), k.pt(L, L), { cls: 'thick' });
      });
      k.step('compass', 'Make the sheet square: with centre O and radius 180 mark the points on the central meridian above and below O. They are the top and bottom edges.', () => {
        k.arc(O, L, Math.PI / 2 - 0.12, Math.PI / 2 + 0.12, { cls: 'cons' }); k.arc(O, L, -Math.PI / 2 - 0.12, -Math.PI / 2 + 0.12, { cls: 'cons' });
        k.point(k.pt(0, L), '', 'ne'); k.point(k.pt(0, -L), '', 'se');
      });
      k.step('tee', 'With the T-square draw the top and bottom edges through them: the square, 360 by 360. Its edges are the parallels of ±' + ph0.toFixed(4) + '°.', () => {
        k.seg(k.pt(-L, L), k.pt(L, L), { cls: 'thick' }); k.seg(k.pt(-L, -L), k.pt(L, -L), { cls: 'thick' });
        k.label(k.pt(L, L), ph0.toFixed(2) + '° N', 'ne', { upright: true, size: 0.6 }); k.label(k.pt(L, -L), ph0.toFixed(2) + '° S', 'se', { upright: true, size: 0.6 });
      });
      const parallels = [30, 60, 75];
      k.step('ruler', 'The parallels from the Mercator table, y = (180/π) ln tan(45° + φ/2): 30° at ' + f1(y(30)) + ', 60° at ' + f1(y(60)) + ', 75° at ' + f1(y(75)) + '. Lay them off up and down the central meridian and draw horizontals.', () => {
        parallels.forEach(p => { [1, -1].forEach(s => { k.dot(k.pt(0, s * y(p)), { r: 0.7 }); k.seg(k.pt(-L, s * y(p)), k.pt(L, s * y(p)), { cls: 'cons' }); }); k.label(k.pt(L, y(p)), p + '°', 'e', { upright: true, size: 0.55 }); });
      });
      k.step('dividers', 'The tiles. Halve the square: the cross through O gives the four tiles of zoom 1. Halve each tile: lines at ±90 give zoom 2 (16 tiles); halve again: lines at ±45 and ±135 give zoom 3 (64 tiles).', () => {
        k.seg(k.pt(-L, 0), k.pt(L, 0), { cls: 'thick' }); k.seg(k.pt(0, -L), k.pt(0, L), { cls: 'thick' });
        [-90, 90].forEach(c => { k.seg(k.pt(c, -L), k.pt(c, L), { cls: 'cons' }); k.seg(k.pt(-L, c), k.pt(L, c), { cls: 'cons' }); });
        [-135, -45, 45, 135].forEach(c => { k.seg(k.pt(c, -L), k.pt(c, L), { cls: 'cons' }); k.seg(k.pt(-L, c), k.pt(L, c), { cls: 'cons' }); });
      });
      k.step('pencil', 'Shade the zoom-3 tile that holds Tel Aviv: column ' + tt.x + ' from the left, row ' + tt.y + ' from the top (counting from 0), tile 3/' + tt.x + '/' + tt.y + '.', () => {
        const tx = -L + tt.x * 45, ty = L - tt.y * 45;
        k.poly([k.pt(tx, ty), k.pt(tx + 45, ty), k.pt(tx + 45, ty - 45), k.pt(tx, ty - 45)], { close: true, fill: '#9fc7ef', opacity: 0.6, cls: 'aux' });
        k.point(k.pt(34.78, y(32.07)), 'Tel Aviv', { at: 'nw', cls: 'red', lo: { upright: true, size: 0.6 } });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 6 */
  Hyper.construction({
    id: 'cy-archimedes-cylinder',
    title: 'Lambert’s equal-area map by Archimedes’ construction',
    tags: ['Lambert', 'cylindrical', 'equal-area', 'Archimedes', 'T-square'],
    note: 'Archimedes showed that the area of a zone of a sphere between two parallels equals the area of the zone of the circumscribed cylinder between the same two planes: 2πR times the height. So if each point of the sphere is projected onto the cylinder along a horizontal ray, parallel to the equator and perpendicular to the axis, areas are kept exactly. The cylinder is cut along a meridian and rolled out flat: a rectangle 2πR wide and 2R high, π : 1. A parallel at latitude φ is at the height R sin φ, so the T-square carries the heights straight across from the side view. R = 60.',
    build(k) {
      const g = k.g, R = 60, x0 = R * 1.5, Wd = 2 * Math.PI * R, u = R * D;
      const O = k.pt(0, 0), phs = [-75, -60, -45, -30, -15, 15, 30, 45, 60, 75];
      const lons = []; for (let l = -180; l <= 180; l += 30) lons.push(l);
      const xs = l => x0 + Wd / 2 + l * u;
      k.given('The globe seen from the side, a circle of radius R = 60 about O with the axis vertical. To the right, the cylinder cut along a meridian and rolled out: a rectangle 2πR = 377 wide and 2R = 120 high, with its equator in line with the equator of the globe.', () => {
        k.circle(O, R, { cls: 'given' });
        k.seg(k.pt(-R, 0), k.pt(x0 + Wd, 0), { cls: 'given' }); k.seg(k.pt(0, -R * 1.1), k.pt(0, R * 1.1), { cls: 'cons' });
        k.rect(x0, -R, x0 + Wd, R, { cls: 'given' });
        k.point(O, 'O', 'sw');
        k.label(k.pt(x0 + Wd / 2, R), 'north pole (a line)', 'n', { upright: true, size: 0.7 });
        k.frame(-R * 1.15, -R * 1.2, x0 + Wd + 44, R * 1.3);
      });
      k.step('protractor', 'At O lay off the latitudes 15°, 30°, 45°, 60° and 75°, north and south, from the equator, and mark them on the circle (right half).', () => {
        phs.forEach(p => k.point(k.pt(R * Math.cos(p * D), R * Math.sin(p * D)), '', 'e'));
      });
      k.step('tee', 'With the T-square draw a horizontal through each mark, right across the rectangle. Each line is a ray of the projection, and where it lies on the rectangle is the parallel: its height is R sin φ.', () => {
        phs.forEach(p => { const y = R * Math.sin(p * D); k.seg(k.pt(R * Math.cos(p * D), y), k.pt(x0 + Wd, y), { cls: 'curve' }); });
        [-60, -30, 30, 60].forEach(p => k.label(k.pt(x0 + Wd, R * Math.sin(p * D)), Math.abs(p) + '°' + (p > 0 ? 'N' : 'S'), 'e', { upright: true, size: 0.55 }));
      });
      k.step('dividers', 'Meridians: on the equator of the rectangle step the length of 30° of arc, 31.4, twelve times from the left edge.', () => {
        lons.forEach(l => k.dot(k.pt(xs(l), 0), { r: 0.55 }));
      });
      k.step('square', 'With the set square draw a vertical through each division: the meridians, equally spaced.', () => {
        lons.forEach(l => { if (l > -180 && l < 180) k.seg(k.pt(xs(l), -R), k.pt(xs(l), R), { cls: 'cons' }); });
        [-180, -90, 0, 90, 180].forEach(l => k.label(k.pt(xs(l), -R), l + '°', 's', { upright: true, size: 0.55 }));
      });
      k.note('Check the equal areas: the shaded band between 30° and 60° N is 2πR wide and R (sin 60° − sin 30°) = 0.366 R high, so its area is 0.732 π R², exactly the area of the zone of the sphere between those parallels, 2πR² (sin 60° − sin 30°). A degree of longitude is as wide at the pole as at the equator, so shapes are crushed vertically near the poles.', () => {
        const ya = R * Math.sin(30 * D), yb = R * Math.sin(60 * D);
        k.hatch([k.pt(x0, ya), k.pt(x0 + Wd, ya), k.pt(x0 + Wd, yb), k.pt(x0, yb)], { angle: Math.PI / 4, gap: 0.9, fill: '#dbe9f8' });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 7 */
  Hyper.construction({
    id: 'cy-gall-peters-sheet',
    title: 'The Gall–Peters sheet: the same construction with 45° standard parallels',
    tags: ['Gall–Peters', 'Lambert', 'cylindrical', 'equal-area', 'standard parallel'],
    note: 'Gall–Peters is Lambert’s cylindrical equal-area map with the cylinder cutting the sphere at 45° N and S. The cylinder of radius R cos 45° is shorter round the equator, and the heights are stretched by 1/cos 45° = √2 to keep the areas: x = R λ/√2, y = √2 R sin φ. So the height of a parallel is R′ sin φ with R′ = √2 R: Archimedes’ construction on a circle of radius √2 R, with meridians half as far apart horizontally as in Lambert’s map. The sheet is 2πR/√2 = 4.44 R wide and 2√2 R = 2.83 R high: π/2 : 1, much more like a map than Lambert’s π : 1. R = 45 here. At 45° N and S shape is true; at the equator shapes are stretched north–south, at 60° east–west (the indicatrices, dashed).',
    build(k) {
      const g = k.g, R = 45, Rp = SQ2 * R, x0 = Rp * 1.45, Wd = 2 * Math.PI * R / SQ2, u = R * D / SQ2;
      const O = k.pt(0, 0), phs = [-75, -60, -45, -30, -15, 15, 30, 45, 60, 75];
      const lons = []; for (let l = -180; l <= 180; l += 30) lons.push(l);
      const xs = l => x0 + Wd / 2 + l * u;
      const A = k.pt(R, 0), C = k.pt(0, R), B = k.pt(R, R);
      k.given('The radius R = 45 of the globe, drawn as a ticked segment OA on the horizontal axis through O, and the vertical axis.', () => {
        k.seg(k.pt(-Rp * 1.2, 0), k.pt(x0 + Wd, 0), { cls: 'given' }); k.seg(k.pt(0, -Rp * 1.2), k.pt(0, Rp * 1.2), { cls: 'cons' });
        k.point(O, 'O', 'sw'); k.point(A, 'A', 'sw');
        k.tick(A, k.pt(0, 1)); k.dim(O, A, 'R', { dist: 1.3, size: 0.7 });
        k.frame(-Rp * 1.3, -Rp * 1.3, x0 + Wd + 12, Rp * 1.35);
      });
      k.step('square', 'On OA erect the square OABC (set square and T-square). Its diagonal OB is √2 R = 63.6.', () => {
        k.seg(A, B, { cls: 'cons' }); k.seg(B, C, { cls: 'cons' }); k.seg(O, C, { cls: 'cons' }); k.seg(O, B, { cls: 'cons' });
        k.point(B, 'B', 'ne'); k.point(C, 'C', 'nw');
      });
      k.step('compass', 'With centre O and radius OB draw the circle of radius R′ = √2 R. It stands for the globe of radius R after the heights have been stretched by √2.', () => {
        k.circle(O, Rp, { cls: 'given' });
        k.point(k.pt(0, Rp), 'N', 'ne'); k.point(k.pt(0, -Rp), 'S', 'se');
      });
      k.step('protractor', 'At O lay off the latitudes 15° … 75°, north and south, and mark them on the circle (right half).', () => {
        phs.forEach(p => k.point(k.pt(Rp * Math.cos(p * D), Rp * Math.sin(p * D)), '', 'e'));
      });
      k.step('tee', 'Draw the parallels as horizontals through the marks, right across the sheet: the height of a parallel is R′ sin φ. The poles are the lines at ±R′, level with the top and bottom of the circle. The 45° lines (heavy) are the standard parallels.', () => {
        k.rect(x0, -Rp, x0 + Wd, Rp, { cls: 'given' });
        phs.forEach(p => { const y = Rp * Math.sin(p * D); k.seg(k.pt(Rp * Math.cos(p * D), y), k.pt(x0 + Wd, y), { cls: Math.abs(p) === 45 ? 'thick' : 'curve' }); });
      });
      k.step('dividers', 'Meridians: on the equator of the sheet step the length R (π/6) / √2 = 16.7 twelve times from the left edge, half the spacing of the Lambert map for the same R.', () => {
        lons.forEach(l => k.dot(k.pt(xs(l), 0), { r: 0.55 }));
      });
      k.step('square', 'Draw the verticals through the divisions: the meridians.', () => {
        lons.forEach(l => { if (l > -180 && l < 180) k.seg(k.pt(xs(l), -Rp), k.pt(xs(l), Rp), { cls: 'cons' }); });
        [-180, -90, 0, 90, 180].forEach(l => k.label(k.pt(xs(l), -Rp), l + '°', 's', { upright: true, size: 0.55 }));
      });
      k.note('Tissot’s indicatrices (a circle of 600 km on the ground, dashed): a tall ellipse at the equator (north–south stretched by √2, east–west squeezed by 1/√2), a true circle at 45°, a wide ellipse at 60°. The area of every one is the same.', () => {
        const r = 10;
        [0, 45, 60, 75].forEach(p => {
          const kx = Math.cos(45 * D) / Math.cos(p * D), ky = Math.cos(p * D) / Math.cos(45 * D);
          k.ellipse(k.pt(xs(60), Rp * Math.sin(p * D)), r * kx, r * ky, { cls: 'aux', dash: true, nobounds: true });
        });
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 8 */
  const millerY = ph => 1.25 * merc(0.8 * ph);
  Hyper.construction({
    id: 'cy-miller-table',
    title: 'Miller’s cylindrical map from a table',
    tags: ['Miller', 'cylindrical', 'Mercator', 'table', 'ruler'],
    note: 'Miller wanted the look of Mercator’s map with the poles brought in. His recipe: take 0.8 of the latitude, find the Mercator height for that, and multiply by 1.25: y = 1.25 R ln tan(45° + 0.4 φ). The meridians are equally spaced, as in every cylindrical map. At R = 100 the heights of the parallels 15°, 30°, 45°, 60°, 75° and 90° are ' + [15, 30, 45, 60, 75, 90].map(p => (100 * millerY(p)).toFixed(1)).join(', ') + '.',
    build(k) {
      const g = k.g, R = 100, u = R * D, Wd = Math.PI * R, Hh = millerY(90) * R;
      const lons = []; for (let l = -180; l <= 180; l += 30) lons.push(l);
      const phs = [15, 30, 45, 60, 75, 90];
      k.given('The equator as a horizontal line, the central meridian through O, and the length of 30° of arc on a globe of radius R = 100: 52.4 units.', () => {
        k.seg(k.pt(-Wd, 0), k.pt(Wd, 0), { cls: 'given' }); k.seg(k.pt(0, -Hh * 1.05), k.pt(0, Hh * 1.05), { cls: 'cons' });
        k.point(k.pt(0, 0), 'O', 'se');
        const a = k.pt(-Wd, -Hh - 28), b = k.pt(-Wd + 30 * u, -Hh - 28);
        k.seg(a, b, { cls: 'given' }); k.tick(a, k.pt(1, 0)); k.tick(b, k.pt(1, 0)); k.dim(a, b, '30° of arc', { dist: 1.2, size: 0.7 });
        k.frame(-Wd - 14, -Hh - 44, Wd + 14, Hh + 22);
      });
      k.step('dividers', 'Step the length of 30° twelve times along the equator from 180° W: the meridians are equally spaced.', () => {
        lons.forEach(l => k.dot(k.pt(l * u, 0), { r: 0.55 }));
      });
      k.step('square', 'Draw the verticals through the divisions with the set square.', () => {
        lons.forEach(l => k.seg(k.pt(l * u, -Hh), k.pt(l * u, Hh), { cls: 'cons' }));
      });
      k.step('ruler', 'Lay off the parallels on the central meridian from the table of Miller’s heights (R = 100): ' + phs.map(p => p + '° at ' + f1(R * millerY(p))).join(', ') + '. Do the same below the equator.', () => {
        phs.forEach(p => { k.dot(k.pt(0, R * millerY(p)), { r: 0.6 }); k.dot(k.pt(0, -R * millerY(p)), { r: 0.6 }); });
      });
      k.step('tee', 'Draw the parallels as horizontals through the marks. The poles are lines at ±' + f1(Hh) + ' (the sheet is 2πR by 2 × 2.30 R, a ratio of 1.36), unlike Mercator’s, which are at infinity.', () => {
        phs.forEach(p => { [1, -1].forEach(s => k.seg(k.pt(-Wd, s * R * millerY(p)), k.pt(Wd, s * R * millerY(p)), { cls: p === 90 ? 'thick' : 'curve' })); });
        [30, 60].forEach(p => k.label(k.pt(Wd, R * millerY(p)), p + '°', 'e', { upright: true, size: 0.55 }));
      });
      k.note('For comparison, the Mercator parallels (dashed) at 60° and 75° lie at ' + f1(R * merc(60)) + ' and ' + f1(R * merc(75)) + ', against Miller’s ' + f1(R * millerY(60)) + ' and ' + f1(R * millerY(75)) + ': Miller compresses the high latitudes by about a tenth at 60° and by a fifth at 75°.', () => {
        [60, 75].forEach(p => k.seg(k.pt(-Wd, R * merc(p)), k.pt(Wd, R * merc(p)), { cls: 'red', dash: true, nobounds: true }));
      });
    }
  });

  /* ---------------------------------------------------------------------------------------------------------- 9 */
  Hyper.construction({
    id: 'cy-gall-stereographic',
    title: 'Gall’s stereographic cylindrical: projectors from the equator point opposite',
    tags: ['Gall', 'stereographic', 'cylindrical', 'perspective', 'secant cylinder'],
    note: 'Gall’s stereographic is a true perspective projection: the light stands on the equator at the point opposite the central meridian, and the cylinder cuts the sphere at 45° N and S, so that it is a cylinder of radius R cos 45° = R/√2. The ray from the light L through the point of latitude φ meets the cylinder at the height R (1 + 1/√2) tan(φ/2) = 1.707 R tan(φ/2). The poles come out at ±1.707 R, finite. The meridians are equally spaced on the cylinder, R/√2 per radian. R = 70.',
    build(k) {
      const g = k.g, R = 70, xc = R / SQ2, x0 = R * 1.45, Wd = 2 * Math.PI * R / SQ2, u = R * D / SQ2;
      const O = k.pt(0, 0), Lp = k.pt(-R, 0), phs = [15, 30, 45, 60, 75, 90];
      const yOf = p => R * (1 + SQ2 / 2) * Math.tan(p * D / 2), Hh = yOf(90);
      const lons = []; for (let l = -180; l <= 180; l += 30) lons.push(l);
      const xs = l => x0 + Wd / 2 + l * u;
      k.given('The globe seen from the side, a circle of radius R = 70 about O with the axis vertical; the light L at the equator point opposite the central meridian; and the cylinder, a vertical line at R cos 45° = 49.5 from the axis, which cuts the circle at the latitudes ±45°.', () => {
        k.circle(O, R, { cls: 'given' });
        k.seg(k.pt(-R * 1.15, 0), k.pt(x0 + Wd, 0), { cls: 'given' }); k.seg(k.pt(0, -R * 1.2), k.pt(0, R * 1.2), { cls: 'cons' });
        k.line(k.pt(xc, 0), k.pt(xc, 1), { cls: 'given' });
        k.point(O, 'O', 'sw'); k.point(Lp, 'L', 'nw');
        k.label(k.pt(xc, Hh * 1.06), 'cylinder', 'e', { upright: true, size: 0.7 });
        k.frame(-R * 1.25, -Hh * 1.12, x0 + Wd + 12, Hh * 1.12);
      });
      k.step('protractor', 'At O lay off the latitudes 15°, 30°, 45°, 60°, 75° and 90°, north and south, from the equator, and mark them on the circle (right half).', () => {
        phs.forEach(p => { k.point(k.pt(R * Math.cos(p * D), R * Math.sin(p * D)), '', 'e'); k.point(k.pt(R * Math.cos(p * D), -R * Math.sin(p * D)), '', 'e'); });
      });
      k.step('straightedge', 'From L draw a line through each mark and on to the cylinder. The cut is the height of that parallel: R × 1.707 × tan(φ/2). The line through the pole mark is the longest and lands at 1.707 R = 119.5.', () => {
        phs.forEach(p => { [1, -1].forEach(s => k.seg(Lp, k.pt(xc, s * yOf(p)), { cls: 'cons' })); });
        phs.forEach(p => k.dot(k.pt(xc, yOf(p)), { r: 0.7 }));
      });
      k.step('tee', 'With the T-square carry each cut to the right across the rolled-out cylinder: the parallels. Draw the sheet’s outline: 2πR/√2 = 311 wide, 2 × 119.5 = 239 high.', () => {
        k.rect(x0, -Hh, x0 + Wd, Hh, { cls: 'given' });
        phs.forEach(p => { [1, -1].forEach(s => k.seg(k.pt(xc, s * yOf(p)), k.pt(x0 + Wd, s * yOf(p)), { cls: p === 45 ? 'thick' : 'curve' })); });
      });
      k.step('dividers', 'Meridians: step the length R (π/6) / √2 = 25.9 twelve times along the equator of the sheet from the left edge.', () => {
        lons.forEach(l => k.dot(k.pt(xs(l), 0), { r: 0.55 }));
      });
      k.step('square', 'Draw the verticals through the divisions: the meridians, equally spaced.', () => {
        lons.forEach(l => { if (l > -180 && l < 180) k.seg(k.pt(xs(l), -Hh), k.pt(xs(l), Hh), { cls: 'cons' }); });
        [-180, -90, 0, 90, 180].forEach(l => k.label(k.pt(xs(l), -Hh), l + '°', 's', { upright: true, size: 0.55 }));
      });
      k.note('Compare with the Mercator and Miller maps: Gall’s stereographic keeps the poles on the sheet like Miller’s, and its parallels are spaced by a true projection. The 45° parallels are where the cylinder cuts the globe and the scale is true along them; the sheet is 1.30 : 1.', () => {
        k.label(k.pt(xs(0), yOf(45)), '45°', 'n', { upright: true, size: 0.6 });
      });
    }
  });

  /* --------------------------------------------------------------------------------------------------------- 10 */
  const casX = (ph, dl) => Math.asin(Math.cos(ph * D) * Math.sin(dl * D)) / D;
  const casY = (ph, dl) => Math.atan2(Math.tan(ph * D), Math.cos(dl * D)) / D;
  Hyper.construction({
    id: 'cy-cassini-grid',
    title: 'The Cassini graticule from perpendicular distances',
    tags: ['Cassini', 'cylindrical', 'transverse', 'spherical triangle', 'table'],
    note: 'Cassini’s projection is the plate carrée turned on its side. Take the central meridian as one axis and the great circle perpendicular to it as the other. A place is then fixed by two distances: x, its distance from the central meridian measured along the perpendicular great circle through it, and y, the distance along the central meridian to the foot of that perpendicular. In the spherical right triangle (Napier): sin x = cos φ sin Δλ and tan y = tan φ / cos Δλ. Both are true distances, so the map is equidistant along the central meridian and along every perpendicular. The hemisphere Δλ ≤ 90° becomes a square of side 180°. Here 1° = 1.2 units and only the north-east quadrant is tabulated.',
    build(k) {
      const g = k.g, u = 1.2;
      const dls = [30, 60, 90], phs = [15, 30, 45, 60, 75];
      const P = (ph, dl) => k.pt(u * casX(ph, dl), u * casY(ph, dl));
      k.given('The central meridian as a vertical line and the perpendicular great circle as a horizontal line through O, at 1° = 1.2 units; the sheet for the hemisphere is a square of 216 units, ±90°.', () => {
        const O = k.pt(0, 0);
        k.seg(k.pt(-90 * u * 1.1, 0), k.pt(90 * u * 1.1, 0), { cls: 'given' }); k.seg(k.pt(0, -90 * u * 1.1), k.pt(0, 90 * u * 1.1), { cls: 'given' });
        k.point(O, 'O', 'se');
        k.label(k.pt(0, 90 * u * 1.1), 'central meridian', 'ne', { upright: true, size: 0.65 });
        k.label(k.pt(90 * u * 1.1, 0), 'transverse equator', 'ne', { upright: true, size: 0.65 });
        k.frame(-90 * u * 1.2, -90 * u * 1.18, 90 * u * 1.62, 90 * u * 1.2);
      });
      k.step('ruler', 'Mark the rim of the hemisphere: the square of side 180° (±108 units). Its top and bottom edges are the images of the meridians of 90° east and west; each vertical side is the image of one point, the equator at 90° E or W.', () => {
        k.rect(-90 * u, -90 * u, 90 * u, 90 * u, { cls: 'thick' });
      });
      k.step('ruler', 'Lay off the table. For each parallel and each meridian Δλ = 30°, 60°, 90° east of the central meridian, measure x from the central meridian and y from the equator. The table (degrees, then multiply by 1.2): ' +
        phs.map(ph => ph + '° N: ' + dls.map(dl => '(' + casX(ph, dl).toFixed(1) + ', ' + casY(ph, dl).toFixed(1) + ')').join(' ')).join('; ') + '.', () => {
        phs.forEach(ph => { dls.forEach(dl => k.dot(P(ph, dl), { r: 0.6 })); k.dot(k.pt(0, u * ph), { r: 0.6 }); });
        k.dot(k.pt(0, 90 * u), { r: 0.8 }); k.label(k.pt(0, 90 * u), 'pole', 'ne', { upright: true, size: 0.6 });
      });
      k.step('pencil', 'Join the points of each parallel with a French curve and mirror them across the central meridian and across the equator, which is the straight line through O. All the parallels end on the top and bottom edges of the square.', () => {
        k.seg(k.pt(-90 * u, 0), k.pt(90 * u, 0), { cls: 'thick' });
        phs.forEach(ph => [1, -1].forEach(s => [1, -1].forEach(r => k.curve(t => [s * u * casX(ph, t), r * u * casY(ph, t)], [0, 90], { cls: 'curve', n: 60 }))));
      });
      k.step('pencil', 'Join the points of each meridian: the meridians of 30° and 60° curve away from the central meridian, and the meridian of 90° is the top edge of the square, from the pole to the corner.', () => {
        dls.forEach(dl => [1, -1].forEach(s => k.curve(t => [s * u * casX(t, dl), u * casY(t, dl)], [-89.9, 89.9], { cls: 'curve', n: 120 })));
        dls.forEach(dl => k.label(k.pt(u * casX(0, dl), 0), dl + '°', 'se', { upright: true, size: 0.6 }));
      });
      k.note('The south half is the mirror image of the north. The next hemisphere (Δλ from 90° to 180°) is a second square on top of this one; the whole globe is a strip of two squares, 180° wide and 360° high.', () => {
        k.label(k.pt(90 * u * 1.05, 45 * u), 'Δλ = 90° (the rim)', 'e', { upright: true, size: 0.55 });
      });
    }
  });

  /* --------------------------------------------------------------------------------------------------------- 11 */
  Hyper.construction({
    id: 'cy-central-cylinder',
    title: 'The central cylindrical projection: projectors from the centre',
    tags: ['central cylindrical', 'cylindrical', 'perspective', 'gnomonic', 'panorama'],
    note: 'The light is at the centre O of the globe and the cylinder touches the equator. The ray from O through the point of latitude φ meets the cylinder at the height R tan φ, so the map is a true perspective projection: the vertical lines of the world stay straight and the horizontals stretch. Unlike Mercator’s stretch of sec φ, this one is much faster: by 70° the parallel is at 2.75 R (Mercator’s: 1.74 R), and the pole is at infinity. The map is therefore cut at ±70° here. It is the way a camera panning round a horizon records the world: a cylindrical panorama. R = 50.',
    build(k) {
      const g = k.g, R = 50, x0 = R * 1.45, Wd = 2 * Math.PI * R, u = R * D;
      const O = k.pt(0, 0), phs = [-70, -60, -45, -30, -15, 15, 30, 45, 60, 70];
      const yT = p => R * Math.tan(p * D), Hh = yT(70);
      const lons = []; for (let l = -180; l <= 180; l += 30) lons.push(l);
      const xs = l => x0 + Wd / 2 + l * u;
      k.given('The globe seen from the side, a circle of radius R = 50 about O with the axis vertical, and the cylinder, a vertical line touching it at the equator. To the right, the cylinder cut along a meridian and rolled out: 2πR = 314 wide, with its equator in line with the globe’s.', () => {
        k.circle(O, R, { cls: 'given' });
        k.seg(k.pt(-R * 1.1, 0), k.pt(x0 + Wd, 0), { cls: 'given' }); k.seg(k.pt(0, -R * 1.1), k.pt(0, R * 1.1), { cls: 'cons' });
        k.line(k.pt(R, 0), k.pt(R, 1), { cls: 'given' });
        k.point(O, 'O', 'sw');
        k.frame(-R * 1.2, -Hh * 1.1, x0 + Wd + 44, Hh * 1.1);
      });
      k.step('protractor', 'At O lay off the latitudes 15°, 30°, 45°, 60° and 70°, north and south, and mark them on the circle.', () => {
        phs.forEach(p => k.point(k.pt(R * Math.cos(p * D), R * Math.sin(p * D)), '', 'e'));
      });
      k.step('straightedge', 'From O draw a ray through each mark and extend it to the cylinder. The cuts are at the heights R tan φ: 13.4, 28.9, 50.0, 86.6 and 137.4 above the equator.', () => {
        phs.forEach(p => { k.seg(O, k.pt(R, yT(p)), { cls: 'cons' }); k.dot(k.pt(R, yT(p)), { r: 0.7 }); });
      });
      k.step('tee', 'With the T-square carry each cut to the right across the sheet: the parallels. The top and bottom edges are the parallels of 70°.', () => {
        k.rect(x0, -Hh, x0 + Wd, Hh, { cls: 'given' });
        phs.forEach(p => k.seg(k.pt(R, yT(p)), k.pt(x0 + Wd, yT(p)), { cls: 'curve' }));
        [-60, -30, 30, 60].forEach(p => k.label(k.pt(x0 + Wd, yT(p)), Math.abs(p) + '°' + (p > 0 ? 'N' : 'S'), 'e', { upright: true, size: 0.55 }));
      });
      k.step('dividers', 'Meridians: step the length of 30° of arc, 26.2, twelve times along the equator of the sheet from the left edge.', () => {
        lons.forEach(l => k.dot(k.pt(xs(l), 0), { r: 0.55 }));
      });
      k.step('square', 'Draw the verticals through the divisions: the meridians.', () => {
        lons.forEach(l => { if (l > -180 && l < 180) k.seg(k.pt(xs(l), -Hh), k.pt(xs(l), Hh), { cls: 'cons' }); });
        [-180, -90, 0, 90, 180].forEach(l => k.label(k.pt(xs(l), -Hh), l + '°', 's', { upright: true, size: 0.55 }));
      });
      k.note('For comparison the Mercator parallels at 60° and 70° (dashed) would be at 65.8 and 86.8: the central cylinder has already put 70° at 137.4. The map is far from conformal: an east–west stretch of sec φ is joined by a north–south stretch of sec² φ.', () => {
        [60, 70].forEach(p => k.seg(k.pt(x0, R * merc(p)), k.pt(x0 + Wd, R * merc(p)), { cls: 'red', dash: true, nobounds: true }));
      });
    }
  });
})();
