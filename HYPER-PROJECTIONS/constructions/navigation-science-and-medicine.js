/* HYPER-PROJECTIONS · constructions/navigation-science-and-medicine.js — hand constructions for the pages on navigation,
 * science and medicine.
 *
 *   ns-mercator-plotting     a course, its distance from the latitude scale, and a fix from two bearings on a Mercator chart
 *   ns-gnomonic-to-mercator  a great circle drawn straight on a gnomonic chart and carried to the Mercator chart as rhumb legs
 *   ns-lambert-aviation      the Lambert conformal conic of an aeronautical chart from its two standard parallels, with a route
 *   ns-polar-route           a polar stereographic chart: parallels by compass, meridians by protractor, a transpolar route
 *   ns-gps-trilateration     three compass circles about three beacons, and what a clock error does to them
 *   ns-web-tiles             the Web Mercator world as a square, halved three times, with the latitudes of the tile rows
 *   ns-radar-ppi             a plan position indicator: range rings by dividers, bearings by protractor, two echoes plotted
 *   ns-xray-geometry         the geometry of a radiograph: magnification, penumbra, and the distortion of an off-axis object
 *   ns-ct-radon              parallel projections of a disc at three angles, the sinogram and the crossing of the strips
 *   ns-planet-maps           a crater near the pole of Mars on a plate carrée map and on a polar stereographic map
 *   ns-wulff-construction    the Wulff net by compass from the inscribed angle, and the standard projection of a cubic crystal
 *   ns-weather-polar         the polar stereographic chart true at 60° N, from a section through the sphere, with the map factor
 * Every number is computed with the engine (k.proj, k.g); every step names the tool it is made with.
 */
(function () {
  'use strict';
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const f1 = x => String(+x.toFixed(1)), f2 = x => String(+x.toFixed(2)), f3 = x => String(+x.toFixed(3));
  const T = (k, x, y, text, o) => k.text(x, y, text, Object.assign({ upright: true }, o || {}));

  /* ------------------------------------------------------------------------------------------------ 1 */
  Hyper.construction({
    id: 'ns-mercator-plotting',
    title: 'Plotting a course and a fix on a Mercator chart',
    tags: ['Mercator chart', 'course', 'parallel rule', 'dividers', 'latitude scale', 'position line'],
    note: 'A small chart of the English Channel off Devon, 2° wide and 40′ high, drawn the way a Mercator sheet is: meridians equally spaced, parallels spread by the secant. The ship goes from A (49°45′ N, 3°30′ W) to B (50°15′ N, 2°30′ W). The rose is an ordinary compass rose printed on the chart; the parallel rule walks the course line to it. Distances come from the latitude scale at the side, level with the leg: here a minute of latitude is 6.2 units long but a minute of longitude only 4 — the scales differ because the chart is stretched by sec φ.',
    build(k) {
      const g = k.g, P = k.proj;
      const lon0 = -4, lat0 = 49 + 40 / 60, k4 = 4;                         // 4 units per minute of longitude
      const MP = lat => 10800 / Math.PI * Math.log(Math.tan(Math.PI / 4 + lat * D2R / 2));
      const X = lon => (lon - lon0) * 60 * k4, Y = lat => (MP(lat) - MP(lat0)) * k4;
      const ll = (d, m) => d + m / 60;
      const pos = (lat, lon) => k.pt(X(lon), Y(lat));
      const A = pos(ll(49, 45), -ll(3, 30)), B = pos(ll(50, 15), -ll(2, 30));
      const w = X(-2), h = Y(lat0 + 40 / 60);
      // the fix: the ship is at F, 45 % of the way from A to B; two lighthouses are seen at 078° and 190°
      const F = g.lerp(A, B, 0.45), brg = (a) => g.dir((90 - a) * D2R);
      const L1 = g.add(F, g.mul(brg(78), 110)), L2 = g.add(F, g.mul(brg(190), 85));
      const dAB = g.dist(A, B), course = Math.atan2(B.x - A.x, B.y - A.y) * R2D;
      const rose = k.pt(w + 75, h * 0.5), rr = 48;
      const latOf = y => { let lo = 48, hi = 52; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; if (Y(m) < y) lo = m; else hi = m; } return (lo + hi) / 2; };
      const midLat = latOf((A.y + B.y) / 2), unitMid = Y(midLat + 0.5 / 60) - Y(midLat - 0.5 / 60), distNm = dAB / unitMid;
      const latLabel = m => { const t = 40 + m; return (49 + Math.floor(t / 60)) + '°' + String(t % 60).padStart(2, '0') + '′'; };
      const lonLabel = m => { const t = 240 - m; return Math.floor(t / 60) + '°' + String(t % 60).padStart(2, '0') + '′ W'; };
      k.given('The chart: meridians every 30′ of longitude and parallels every 10′ of latitude, the latitude scale at the left, the longitude scale along the foot, a compass rose at the right. The ship leaves A (49°45′ N, 3°30′ W) for B (50°15′ N, 2°30′ W).', () => {
        k.poly([k.pt(0, 0), k.pt(w, 0), k.pt(w, h), k.pt(0, h)], { close: true, cls: 'given' });
        for (let m = 30; m < 120; m += 30) k.seg(k.pt(X(lon0 + m / 60), 0), k.pt(X(lon0 + m / 60), h), { cls: 'cons' });
        for (let m = 10; m < 40; m += 10) k.seg(k.pt(0, Y(lat0 + m / 60)), k.pt(w, Y(lat0 + m / 60)), { cls: 'cons' });
        for (let m = 0; m <= 40; m += 10) k.label(k.pt(0, Y(lat0 + m / 60)), latLabel(m), 'w', { upright: true, size: 0.7, dist: 1.4 });
        for (let m = 0; m <= 120; m += 30) T(k, X(lon0 + m / 60), -12, lonLabel(m), { size: 0.65 });
        for (let m = 0; m <= 40; m++) k.tick(k.pt(0, Y(lat0 + m / 60)), k.pt(0, 1), { size: m % 10 === 0 ? 1.2 : 0.55 });
        k.circle(rose, rr, { cls: 'given' }); k.circle(rose, rr * 0.82, { cls: 'cons' });
        for (let a = 0; a < 360; a += 30) k.seg(g.polar(rose, rr * 0.82, (90 - a) * D2R), g.polar(rose, rr * 1.06, (90 - a) * D2R), { cls: 'cons' });
        k.label(g.polar(rose, rr * 1.06, Math.PI / 2), 'N', 'n', { upright: true, size: 0.8 });
        k.frame(-80, -30, w + 150, h + 22);
        k.fontScale(0.7);
      });
      k.step('dividers', 'Plot A and B. Take each latitude from the latitude scale with the dividers and each longitude from the foot of the chart; the point is where the two lines meet (the guide lines are drawn lightly).', () => {
        [[A, 'A'], [B, 'B']].forEach(([p, n]) => { k.seg(k.pt(0, p.y), p, { cls: 'aux' }); k.seg(k.pt(p.x, 0), p, { cls: 'aux' }); k.point(p, n, { at: n === 'A' ? 'se' : 'nw', lo: { upright: true } }); });
      });
      k.step('straightedge', 'Draw the course line AB with the straightedge. On a Mercator chart a constant compass course is a straight line.', () => {
        k.seg(A, B, { cls: 'thick' });
      });
      k.step('square', 'Walk the parallel rule from AB to the compass rose and draw the line through the centre of the rose parallel to AB. It crosses the ring at the true course, ' + f1(course) + '°.', () => {
        const d = g.unit(g.sub(B, A));
        k.seg(g.sub(rose, g.mul(d, rr * 1.06)), g.add(rose, g.mul(d, rr * 1.06)), { cls: 'curve' });
        k.dot(rose, { r: 0.6 });
        const e = g.add(rose, g.mul(d, rr * 1.4)); T(k, e.x, e.y, f1(course) + '°', { size: 0.8 });
      });
      k.step('protractor', 'Check the angle with the protractor against the meridian at A: the course is ' + f1(course) + '° from north.', () => {
        const up = k.pt(A.x, A.y + 52);
        k.seg(A, up, { cls: 'cons', dash: true });
        k.angle(A, g.add(A, g.mul(g.unit(g.sub(B, A)), 52)), up, { r: 3, label: f1(course) + '°', labelDist: 1.2 });
      });
      k.step('dividers', 'Distance: set the dividers to the length AB and carry them to the latitude scale, centred level with the leg (about 50° N). Each minute of latitude is one nautical mile: the reading is ' + f1(distNm) + ' nm. (Taken at the foot of the chart, where a minute is shorter, it would read too many.)', () => {
        const half = distNm / 2, y0 = Y(midLat - half / 60), y1 = Y(midLat + half / 60);
        k.seg(k.pt(-30, y0), k.pt(-30, y1), { cls: 'curve' }); k.tick(k.pt(-30, y0), k.pt(1, 0)); k.tick(k.pt(-30, y1), k.pt(1, 0));
        T(k, -44, (y0 + y1) / 2, f1(distNm) + ' nm', { size: 0.8, rotate: 90 });
      });
      k.step('protractor', 'A fix. At F the navigator takes bearings of two lighthouses: 078° to L₁ and 190° to L₂. The position line of L₁ runs through L₁ at the reciprocal angle (258°): lay it off with the protractor at the lighthouse, and the same at L₂ (010°).', () => {
        k.point(L1, 'L_1', { at: 'e', lo: { upright: true } }); k.point(L2, 'L_2', { at: 'w', lo: { upright: true } });
        const ext = (L, a) => [g.add(L, g.mul(brg((a + 180) % 360), -40)), g.add(L, g.mul(brg((a + 180) % 360), 180))];
        [[L1, 78], [L2, 190]].forEach(([L, a]) => { const e = ext(L, a); k.seg(e[0], e[1], { cls: 'cons' }); });
      });
      k.step('pencil', 'The ship is where the two position lines cross: mark the fix F and write the time. It is on the course line, as it should be (to the width of the pencil).', () => {
        k.point(F, 'fix', { at: 'sw', cls: 'red', lo: { cls: 'red', upright: true } });
      });
      void P;
    }
  });

  /* ------------------------------------------------------------------------------------------------ 2 */
  Hyper.construction({
    id: 'ns-gnomonic-to-mercator',
    title: 'A great circle from the gnomonic chart, steered as rhumb legs on the Mercator chart',
    tags: ['great circle', 'gnomonic', 'Mercator', 'waypoints', 'composite route'],
    note: 'The passage 50° N 5° W → 40° N 70° W. Left: a gnomonic chart tangent at 45° N 37.5° W, on which every great circle is a straight line. Right: the Mercator chart of the same sea, on which every rhumb line is straight. The great circle is read off the left chart at the meridians of 25° W and 45° W, the waypoints are carried across by their latitudes and longitudes, and the passage becomes three straight legs on the right. (The two pictures are drawn at different scales.)',
    build(k) {
      const g = k.g, P = k.proj, G = P.geo;
      const A = [-5, 50], B = [-70, 40], nm = x => x / 1.852;
      const gO = { lon0: -37.5, lat0: 45 }, sg = 240, gx = -290;
      const gn = (lon, lat) => { const q = P.maps.project('gnomonic', lon, lat, gO); return k.pt(gx + q[0] * sg, q[1] * sg); };
      const sm = 210, mx = 290, my0 = Math.log(Math.tan(Math.PI / 4 + 45 * D2R / 2));
      const me = (lon, lat) => k.pt(mx + (lon + 37.5) * D2R * sm, (Math.log(Math.tan(Math.PI / 4 + lat * D2R / 2)) - my0) * sm);
      const gcAt = lon => G.greatCircle(A, B, 600).reduce((b, p) => Math.abs(p[0] - lon) < Math.abs(b[0] - lon) ? p : b);
      const W1 = gcAt(-25), W2 = gcAt(-45);
      const route = [A, W1, W2, B];
      const legs = [[A, W1], [W1, W2], [W2, B]].map(([a, b]) => ({ d: nm(G.rhumbDistance(a, b)), c: G.rhumbBearing(a, b) }));
      const lonsG = [-80, -70, -60, -50, -40, -30, -20, -10, 0], latsG = [30, 35, 40, 45, 50, 55, 60];
      k.given('Two charts of the North Atlantic: the gnomonic (left), with curved meridians and parallels, and the Mercator (right), with straight ones. Both have A (50° N 5° W) and B (40° N 70° W) plotted from their latitudes and longitudes.', () => {
        lonsG.forEach(lo => k.curve(Array.from({ length: 31 }, (_, i) => { const p = gn(lo, 30 + i); return [p.x, p.y]; }), null, { cls: 'aux' }));
        latsG.forEach(la => k.curve(Array.from({ length: 91 }, (_, i) => { const p = gn(-85 + i, la); return [p.x, p.y]; }), null, { cls: 'aux' }));
        lonsG.forEach(lo => k.seg(me(lo, 30), me(lo, 60), { cls: 'aux' }));
        latsG.forEach(la => k.seg(me(-85, la), me(5, la), { cls: 'aux' }));
        [-70, -45, -25, -5].forEach(lo => { T(k, gn(lo, 29.2).x, gn(lo, 29.2).y - 2, Math.abs(lo) + '°W', { size: 0.6 }); T(k, me(lo, 29.2).x, me(lo, 29.2).y - 2, Math.abs(lo) + '°W', { size: 0.6 }); });
        k.point(gn(A[0], A[1]), 'A', { at: 'ne', lo: { upright: true } }); k.point(gn(B[0], B[1]), 'B', { at: 'sw', lo: { upright: true } });
        k.point(me(A[0], A[1]), 'A', { at: 'ne', lo: { upright: true } }); k.point(me(B[0], B[1]), 'B', { at: 'sw', lo: { upright: true } });
        T(k, gx, gn(-37.5, 62).y, 'gnomonic', { size: 0.9, bold: true }); T(k, mx, me(-37.5, 62).y, 'Mercator', { size: 0.9, bold: true });
        k.frame(-420, -100, 430, 120);
        k.fontScale(0.62);
      });
      k.step('straightedge', 'On the gnomonic chart join A and B with the straightedge: this straight line is the great circle, the shortest route.', () => {
        k.seg(gn(A[0], A[1]), gn(B[0], B[1]), { cls: 'thick' });
      });
      k.step('dividers', 'Read where the line crosses the meridians of 45° W and 25° W, and estimate the latitudes between the parallels with the dividers: W₁ = ' + f1(W1[1]) + '° N at 25° W, W₂ = ' + f1(W2[1]) + '° N at 45° W.', () => {
        k.point(gn(W1[0], W1[1]), 'W_1', { at: 'n', lo: { upright: true } }); k.point(gn(W2[0], W2[1]), 'W_2', { at: 'n', lo: { upright: true } });
      });
      k.step('ruler', 'Carry the waypoints to the Mercator chart: each is where its meridian meets its parallel. Mark W₁ and W₂ there.', () => {
        k.point(me(W1[0], W1[1]), 'W_1', { at: 'n', lo: { upright: true } }); k.point(me(W2[0], W2[1]), 'W_2', { at: 'n', lo: { upright: true } });
      });
      k.step('straightedge', 'Join A–W₁, W₁–W₂ and W₂–B with the straightedge. On Mercator each is a rhumb line, a constant course: ' + legs.map(l => f1(l.c) + '° for ' + Math.round(l.d) + ' nm').join(', ') + '.', () => {
        for (let i = 0; i < 3; i++) k.seg(me(route[i][0], route[i][1]), me(route[i + 1][0], route[i + 1][1]), { cls: 'thick' });
      });
      const total = legs.reduce((s, l) => s + l.d, 0);
      k.note('For comparison: the single rhumb line AB (dashed) is ' + Math.round(nm(G.rhumbDistance(A, B))) + ' nm; the three legs are ' + Math.round(total) + ' nm; the true great circle (dotted curve) is ' + Math.round(nm(G.distance(A, B))) + ' nm. Three legs recover all but 0.3 % of the saving.', () => {
        k.seg(me(A[0], A[1]), me(B[0], B[1]), { cls: 'red', dash: true });
        k.curve(G.greatCircle(A, B, 120).map(p => { const q = me(p[0], p[1]); return [q.x, q.y]; }), null, { cls: 'cons', dotted: true });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 3 */
  Hyper.construction({
    id: 'ns-lambert-aviation',
    title: 'The Lambert conformal conic of an aeronautical chart, from its standard parallels',
    tags: ['Lambert conformal conic', 'standard parallels', 'cone constant', 'aeronautical chart'],
    note: 'The cone developed flat: the meridians are straight lines through the apex O, the parallels are circular arcs about O. With standard parallels 33° and 45° the cone constant is n = 0.6305: two meridians Δλ apart make an angle nΔλ at O. The sphere is drawn with radius R = 150 units; the apex lies F·R = 293 units above the equator\'s arc, here taken as the top of the drawing. The great circle from New York to Los Angeles (dotted) is indistinguishable from the straight chord at this scale (2 km apart in 3 900), but the meridians that it crosses converge, so its true course changes by nΔλ along the way.',
    build(k) {
      const g = k.g, P = k.proj, G = P.geo, R = 150, p1 = 33 * D2R, p2 = 45 * D2R, lon0 = -96;
      const n = Math.log(Math.cos(p1) / Math.cos(p2)) / Math.log(Math.tan(Math.PI / 4 + p2 / 2) / Math.tan(Math.PI / 4 + p1 / 2));
      const F = Math.cos(p1) * Math.pow(Math.tan(Math.PI / 4 + p1 / 2), n) / n;
      const rho = lat => R * F / Math.pow(Math.tan(Math.PI / 4 + lat * D2R / 2), n);
      const O = k.pt(0, 0), at = (lon, lat) => { const th = n * (lon - lon0) * D2R; return k.pt(rho(lat) * Math.sin(th), -rho(lat) * Math.cos(th)); };
      const ny = [-74.01, 40.71], la = [-118.24, 34.05];
      const lats = [25, 33, 39, 45, 50], lons = [-126, -116, -106, -96, -86, -76, -66];
      const th0 = 20 * D2R;
      const NY = at(ny[0], ny[1]), LA = at(la[0], la[1]);
      const gcPts = G.greatCircle(ny, la, 80).map(p => at(p[0], p[1]));
      let dev = 0; gcPts.forEach(q => { const d = Math.abs(g.cross(g.sub(NY, LA), g.sub(q, LA))) / g.dist(NY, LA); if (d > dev) dev = d; });
      const turn = (V, a, b, label, o) => { if (g.cross(g.sub(a, V), g.sub(b, V)) > 0) k.angle(V, a, b, Object.assign({ label }, o)); else k.angle(V, b, a, Object.assign({ label }, o)); };
      k.given('The central meridian (96° W) as a vertical line running up to the apex O (off the top of the sheet), and the data: standard parallels 33° and 45°, sphere radius R = 150 units, cone constant n = ' + f3(n) + '. Everything on the sheet hangs below O.', () => {
        k.seg(O, k.pt(0, -rho(24)), { cls: 'cons', dash: true });
        k.point(O, 'O', { at: 'n', nobounds: true });
        k.frame(-rho(24) * Math.sin(th0) - 14, -rho(24) - 16, rho(24) * Math.sin(th0) + 14, -rho(51) + 4);
        k.fontScale(0.6);
      });
      k.step('ruler', 'Lay off the radius of each parallel down the central meridian, measured from the apex O: ρ(φ) = R·F / tan^n(45° + φ/2) = ' + lats.map(l => l + '°: ' + f1(rho(l))).join(', ') + '.', () => {
        lats.forEach(l => { k.dot(k.pt(0, -rho(l)), { r: 0.8 }); k.label(k.pt(0, -rho(l)), l + '°', 'ne', { upright: true, size: 0.7, dist: 0.9 }); });
      });
      k.step('compass', 'With the compass centred on O draw an arc through each mark, as far as 20° on either side of the central meridian: the parallels. The standard parallels (33° and 45°) are drawn heavy: the scale is exactly 1 on them.', () => {
        lats.forEach(l => k.arc(O, rho(l), -Math.PI / 2 - th0, -Math.PI / 2 + th0, { cls: l === 33 || l === 45 ? 'thick' : 'given' }));
      });
      k.step('dividers', 'Set the dividers to the chord of the angle n·10° = ' + f2(n * 10) + '° on the 45° arc and step it off to either side of the central meridian: three marks each way, one for every 10° of longitude. Do the same on the 33° arc.', () => {
        [45, 33].forEach(l => lons.forEach(lo => { if (lo !== lon0) k.dot(at(lo, l), { r: 0.6 }); }));
      });
      k.step('straightedge', 'Draw each meridian as a straight line through the pair of marks it has on the 45° and the 33° arcs (it runs through the apex O). The meridian lines make angles of n·Δλ = ' + f2(n * 10) + '° with each other.', () => {
        lons.forEach(lo => { if (lo !== lon0) { k.seg(at(lo, 50), at(lo, 25), { cls: 'cons' }); k.label(at(lo, 25), Math.abs(lo) + '°W', 's', { upright: true, size: 0.7 }); } });
        k.seg(at(lon0, 50), at(lon0, 25), { cls: 'cons' });
      });
      k.step('dividers', 'Plot New York (40.7° N, 74.0° W) and Los Angeles (34.1° N, 118.2° W): set the dividers to ρ(φ) from O along the meridian of each city and mark the point (find ρ(40.7°) and ρ(34.1°) by interpolating in the table).', () => {
        k.point(NY, 'New York', { at: 'ne', lo: { upright: true, size: 0.8 } }); k.point(LA, 'Los Angeles', { at: 'nw', lo: { upright: true, size: 0.8 } });
      });
      k.step('straightedge', 'Join the two cities: the straight line is the route. It crosses the meridians at changing angles, because the meridians converge.', () => {
        k.seg(NY, LA, { cls: 'curve' });
      });
      const north = P_ => g.add(P_, g.mul(g.unit(g.sub(O, P_)), 30)), dir = g.unit(g.sub(LA, NY));
      const bearing = P_ => { const nn = g.unit(g.sub(O, P_)), ee = { x: nn.y, y: -nn.x }; return (Math.atan2(g.dot(dir, ee), g.dot(dir, nn)) * R2D + 360) % 360; };
      const bNY = bearing(NY), bLA = bearing(LA);
      k.note('The dotted curve is the true great circle: it stays within ' + f2(dev / R * 6371) + ' km of the line. Read against the local meridians, the route heads ' + f1(bNY) + '° at New York and ' + f1(bLA) + '° at Los Angeles: a change of ' + f1(Math.abs(bLA - bNY)) + '°, close to n·Δλ = ' + f1(n * (ny[0] - la[0])) + '°, because the meridians that it crosses converge.', () => {
        k.curve(gcPts.map(q => [q.x, q.y]), null, { cls: 'red', dotted: true });
        k.seg(NY, north(NY), { cls: 'aux', dash: true }); k.seg(LA, north(LA), { cls: 'aux', dash: true });
        const NYd = g.add(NY, g.mul(dir, 30)), LAd = g.add(LA, g.mul(dir, 30));
        turn(NY, north(NY), NYd, f1(bNY) + '°', { r: 2.2, labelDist: 1.2 }); turn(LA, north(LA), LAd, f1(bLA) + '°', { r: 2.2, labelDist: 1.2 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 4 */
  Hyper.construction({
    id: 'ns-polar-route',
    title: 'A polar stereographic chart and a transpolar route',
    tags: ['polar stereographic', 'inscribed angle', 'great circle', 'grid heading'],
    note: 'The plane touches the sphere at the pole and the eye is at the opposite pole, so a parallel at latitude φ is a circle of radius ρ = 2R·tan((90° − φ)/2) — found with the inscribed-angle construction as in the astrolabe plate — and the meridians are straight spokes at their longitudes (Greenwich at the top: grid north). New York to Tokyo (dotted: the true great circle) is nearly straight: within about 4 % of its length of the chord, and the chord itself is the shortest line on the chart. Headings on this chart are grid headings, measured from the vertical.',
    build(k) {
      const g = k.g, P = k.proj, G = P.geo, R = 100;
      const rho = lat => 2 * R * Math.tan((90 - lat) * D2R / 2);
      const O = k.pt(0, 0);
      const at = (lon, lat) => { const q = P.maps.project('stereographic', lon, lat, { lat0: 90, lon0: 180 }); return k.pt(q[0] * R, q[1] * R); };
      const ny = [-74.01, 40.71], tk = [139.69, 35.69];
      const NY = at(ny[0], ny[1]), TK = at(tk[0], tk[1]);
      const lats = [80, 70, 60, 50, 40, 30];
      const gcPts = G.greatCircle(ny, tk, 120).map(p => at(p[0], p[1]));
      let dev = 0; gcPts.forEach(q => { const d = Math.abs(g.cross(g.sub(TK, NY), g.sub(q, NY))) / g.dist(NY, TK); if (d > dev) dev = d; });
      const turn = (V, a, b, label, o) => { if (g.cross(g.sub(a, V), g.sub(b, V)) > 0) k.angle(V, a, b, Object.assign({ label }, o)); else k.angle(V, b, a, Object.assign({ label }, o)); };
      k.given('The pole O at the centre and the Greenwich meridian drawn upwards as grid north. The sphere has radius R = 100 units.', () => {
        k.point(O, 'N pole', { at: 'sw', lo: { upright: true, size: 0.8 } }); k.seg(O, k.pt(0, rho(25)), { cls: 'cons', dash: true });
        k.frame(-rho(26), -rho(26), rho(26), rho(26) + 6);
        k.fontScale(0.7);
      });
      k.step('ruler', 'Lay off the radius of each parallel up the Greenwich meridian: ρ = 2R tan((90° − φ)/2) = ' + lats.map(l => l + '°: ' + f1(rho(l))).join(', ') + ' (each can be found by the inscribed-angle construction on a section circle).', () => {
        lats.forEach(l => { k.dot(k.pt(0, rho(l)), { r: 0.7 }); k.label(k.pt(0, rho(l)), l + '°', 'ne', { upright: true, size: 0.7, dist: 0.5 }); });
      });
      k.step('compass', 'Draw a circle about O through each mark: the parallels. They are farther apart the farther they are from the pole, so the scale grows towards the equator.', () => {
        lats.forEach(l => k.circle(O, rho(l), { cls: 'given' }));
      });
      k.step('protractor', 'Draw the meridians as straight spokes every 30° of longitude, counted from the Greenwich meridian to the west (clockwise) and the east (anticlockwise).', () => {
        for (let lo = 0; lo < 360; lo += 30) { const q = at(lo, 30); k.seg(O, q, { cls: 'cons' }); const t = at(lo, 24); T(k, t.x, t.y, (lo === 0 ? '0°' : lo <= 180 ? lo + '°E' : (360 - lo) + '°W'), { size: 0.7 }); }
      });
      k.step('dividers', 'Plot the cities: carry the radius of the parallel to the spoke of the meridian. New York is at 40.7° N, 74.0° W and Tokyo at 35.7° N, 139.7° E.', () => {
        k.point(NY, 'New York', { at: 'e', lo: { upright: true, size: 0.8, dist: 1.2 } }); k.point(TK, 'Tokyo', { at: 'se', lo: { upright: true, size: 0.8 } });
      });
      k.step('straightedge', 'Join New York and Tokyo: the straight line is, to a good approximation, the great-circle route over the Arctic.', () => {
        k.seg(NY, TK, { cls: 'curve' });
      });
      const dir = g.unit(g.sub(TK, NY)), gridHeading = (Math.atan2(dir.x, dir.y) * R2D + 360) % 360;
      const bearing = P_ => { const nn = g.unit(g.sub(O, P_)), ee = { x: nn.y, y: -nn.x }; return (Math.atan2(g.dot(dir, ee), g.dot(dir, nn)) * R2D + 360) % 360; };
      const bNY = bearing(NY), bTK = bearing(TK), north = P_ => g.add(P_, g.mul(g.unit(g.sub(O, P_)), 28));
      k.note('The line has one grid heading, ' + f1(gridHeading) + '° from grid north (the top of the sheet). Against the local meridians it is ' + f1(bNY) + '° at New York and ' + f1(bTK) + '° at Tokyo — the true heading changes by ' + f1(Math.abs(bTK - bNY)) + '°, the difference in longitude. The true great circle (dotted) bows ' + Math.round(dev / R * 6371) + ' km from the chord, ' + f1(dev / g.dist(NY, TK) * 100) + ' % of its length.', () => {
        k.curve(gcPts.map(q => [q.x, q.y]), null, { cls: 'red', dotted: true });
        k.seg(NY, north(NY), { cls: 'aux', dash: true }); k.seg(TK, north(TK), { cls: 'aux', dash: true });
        turn(NY, north(NY), g.add(NY, g.mul(dir, 28)), f1(bNY) + '°', { r: 3.2, labelDist: 1.5 }); turn(TK, north(TK), g.add(TK, g.mul(dir, 28)), f1(bTK) + '°', { r: 3.2, labelDist: 1.5 });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 5 */
  Hyper.construction({
    id: 'ns-gps-trilateration',
    title: 'Trilateration: a position from three ranges, and what a clock error does',
    tags: ['GPS', 'trilateration', 'compass', 'pseudorange', 'clock bias'],
    note: 'The plane version of GPS. The three beacons B₁, B₂, B₃ are at known places and the receiver has measured the distance to each from the delay of a signal. A circle about each beacon holds every place at that distance; the receiver is where they meet. If the receiver\'s clock is wrong, every measured range is too long (or too short) by the same amount b: the three circles no longer meet in one point but form a small triangle, and the extra unknown b is found by shrinking all three radii equally until the triangle closes. In space the circles become spheres and the extra unknown makes four satellites necessary.',
    build(k) {
      const g = k.g, bias = 14;
      const B1 = k.pt(0, 0), B2 = k.pt(150, 15), B3 = k.pt(55, 150), Rcv = k.pt(75, 62);
      const bs = [B1, B2, B3], r = bs.map(b => g.dist(b, Rcv));
      const x12 = g.circleCircle(B1, r[0], B2, r[1]);
      const near = (cands, pt) => cands.reduce((b, p) => !b || g.dist(p, pt) < g.dist(b, pt) ? p : b, null);
      k.given('The three beacons B₁, B₂, B₃ (their positions are known) and the three measured ranges: r₁ = ' + f1(r[0]) + ', r₂ = ' + f1(r[1]) + ', r₃ = ' + f1(r[2]) + ' (take them from the delays of the signals, distance = c × time).', () => {
        bs.forEach((b, i) => k.point(b, 'B_' + (i + 1), { at: i === 0 ? 'sw' : i === 1 ? 'se' : 'n', lo: { upright: true } }));
        k.frame(-110, -100, 260, 250);
        k.fontScale(0.75);
      });
      k.step('compass', 'Set the compass to r₁ and draw a circle about B₁: the receiver is somewhere on it.', () => {
        k.circle(B1, r[0], { cls: 'given' });
      });
      k.step('compass', 'Set it to r₂ and draw a circle about B₂: it cuts the first circle at two points, X and X′. Two ranges are not enough.', () => {
        k.circle(B2, r[1], { cls: 'given' });
        x12.forEach((p, i) => k.point(p, i ? 'X′' : 'X', { at: i ? 'se' : 'ne', lo: { upright: true, size: 0.8 } }));
      });
      k.step('compass', 'Set it to r₃ and draw a circle about B₃: it passes through one of the two points and misses the other. That point is the receiver.', () => {
        k.circle(B3, r[2], { cls: 'given' });
      });
      k.step('pencil', 'Mark the receiver R where all three circles meet.', () => {
        k.point(Rcv, 'R', { at: 'ne', cls: 'red', lo: { cls: 'red', upright: true } });
      });
      const rb = r.map(x => x + bias);
      const tri = [g.circleCircle(B1, rb[0], B2, rb[1]), g.circleCircle(B2, rb[1], B3, rb[2]), g.circleCircle(B3, rb[2], B1, rb[0])].map(c => near(c, Rcv));
      k.note('Now suppose the receiver clock is fast by an amount that adds b = ' + bias + ' to every range. The dashed circles (radius r + b) no longer meet in a point: the three pairwise crossings nearest R form a small triangle. Shrinking all three radii by the same amount until the triangle closes gives back R and, as a by-product, the clock error b.', () => {
        bs.forEach((b, i) => k.circle(b, rb[i], { cls: 'red', dash: true }));
        tri.forEach(p => k.dot(p, { r: 0.7, cls: 'red' }));
        k.poly(tri, { close: true, cls: 'red' });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 6 */
  Hyper.construction({
    id: 'ns-web-tiles',
    title: 'The Web Mercator world as a square, cut into tiles',
    tags: ['Web Mercator', 'tiles', 'zoom level', 'quadkey', 'dividers'],
    note: 'Web Mercator is Mercator cut at ±85.0511° so that the world is a square. Zoom level 0 is one tile; halving every side gives 4 tiles at level 1, 16 at level 2, 64 at level 3, and 4^z at level z. The columns are equal steps of longitude, but the rows are equal steps of the Mercator ordinate, so the latitudes of the horizontal lines (40.98°, 66.51°, 79.17°, 85.05°) crowd towards the poles. Tel Aviv lies in tile x = 4, y = 3 at level 3, whose quadkey is 122 (the digits are the bits of x and y interleaved: 1+0, 0+2, 0+2).',
    build(k) {
      const g = k.g, P = k.proj, S = 320, z = 3, N = 1 << z;
      const my = lat => Math.log(Math.tan(Math.PI / 4 + lat * D2R / 2)), X = lon => (lon + 180) / 360 * S, Y = lat => S / 2 * (1 + my(lat) / Math.PI);
      const latOfRow = j => Math.atan(Math.sinh(Math.PI * (1 - 2 * j / N))) * R2D;
      const tel = [34.78, 32.07], tile = [Math.floor((tel[0] + 180) / 360 * N), Math.floor((1 - Math.log(Math.tan(tel[1] * D2R) + 1 / Math.cos(tel[1] * D2R)) / Math.PI) / 2 * N)];
      const Q = (tx, ty) => k.pt(tx / N * S, S - ty / N * S);                           // top-left origin counted in tiles, drawn y up
      k.given('The world square: longitude from −180° to +180° across, the Mercator ordinate from −π to +π up, so that the top and bottom edges are the parallels of ±85.0511°. The equator and the Greenwich meridian cross at the centre.', () => {
        k.poly([k.pt(0, 0), k.pt(S, 0), k.pt(S, S), k.pt(0, S)], { close: true, cls: 'given' });
        k.seg(k.pt(0, S / 2), k.pt(S, S / 2), { cls: 'cons' }); k.seg(k.pt(S / 2, 0), k.pt(S / 2, S), { cls: 'cons' });
        // the coastlines, lightly, for orientation
        Hyper.world.lines().forEach(l => P.maps.path('web-mercator', l.pts, {}).forEach(seg => {
          const pts = seg.map(q => [(q[0] + Math.PI) / (2 * Math.PI) * S, S / 2 * (1 + q[1] / Math.PI)]).filter(q => q[1] >= 0 && q[1] <= S);
          if (pts.length > 1) k.curve(pts, null, { cls: 'aux', nobounds: true });
        }));
        k.frame(-60, -30, S + 20, S + 20);
        k.fontScale(0.75);
      });
      k.step('dividers', 'Halve each side, then halve the halves, then halve again: 8 equal parts along the bottom edge and up the left edge, the marks of zoom level 3.', () => {
        for (let i = 1; i < N; i++) { k.dot(k.pt(i / N * S, 0), { r: 0.6 }); k.dot(k.pt(0, i / N * S), { r: 0.6 }); }
      });
      k.step('tee', 'Draw the verticals and horizontals through the marks. The middle ones (heavy) are level 1: four tiles; the quarter lines make 16 at level 2; all of them make 64 at level 3.', () => {
        for (let i = 1; i < N; i++) { const c = i === N / 2 ? 'thick' : i % 2 === 0 ? 'given' : 'cons'; k.seg(Q(i, 0), Q(i, N), { cls: c }); k.seg(Q(0, i), Q(N, i), { cls: c }); }
      });
      k.step('ruler', 'Label the rows with their latitudes. They are not equal steps: the line k rows from the top is at φ = arctan sinh(π(1 − 2k/8)), i.e. 85.05°, 79.17°, 66.51°, 40.98°, 0°, then the same below the equator.', () => {
        for (let j = 0; j <= N; j++) { const lat = j === 0 ? 85.0511 : j === N ? -85.0511 : latOfRow(j); k.label(Q(0, j), (lat >= 0 ? '' : '−') + f2(Math.abs(lat)) + '°', 'w', { upright: true, size: 0.65, dist: 0.5 }); }
        for (let i = 0; i <= N; i += 2) k.label(Q(i, N), (-180 + i * 360 / N) + '°', 's', { upright: true, size: 0.65 });
      });
      k.step('pencil', 'Mark Tel Aviv (34.78° E, 32.07° N): x = 8 × (34.78 + 180)/360 = 4.77, y = 4 × (1 − ln(tan φ + sec φ)/π) = 3.25. It lies in tile column ' + tile[0] + ', row ' + tile[1] + '. Shade that tile.', () => {
        k.point(k.pt(X(tel[0]), Y(tel[1])), 'Tel Aviv', { at: 'se', cls: 'red', lo: { cls: 'red', upright: true, size: 0.75 } });
        k.hatch([Q(tile[0], tile[1]), Q(tile[0] + 1, tile[1]), Q(tile[0] + 1, tile[1] + 1), Q(tile[0], tile[1] + 1)], { gap: 0.7, outline: true });
      });
      const b = { w: tile[0] / N * 360 - 180, e: (tile[0] + 1) / N * 360 - 180, n: latOfRow(tile[1]), s: latOfRow(tile[1] + 1) };
      k.note('Tile (z, x, y) = (3, ' + tile[0] + ', ' + tile[1] + ') covers ' + f2(b.w) + '° to ' + f2(b.e) + '° E and ' + f2(b.s) + '° to ' + f2(b.n) + '° N. Each further zoom level splits it into four; at level 17 a pixel is about 1 m on the ground at this latitude.', () => {
        k.dim(Q(tile[0], tile[1] + 1), Q(tile[0] + 1, tile[1] + 1), f2(b.e - b.w) + '° wide', { dist: 1.3, size: 0.7, upright: true, side: 'right' });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 7 */
  Hyper.construction({
    id: 'ns-radar-ppi',
    title: 'A plan position indicator: range rings, bearings and two echoes',
    tags: ['radar', 'PPI', 'azimuthal equidistant', 'range rings', 'protractor'],
    note: 'The display is drawn in polar coordinates about the own-ship position O, north up. Range rings every 2 nautical miles are laid off with the dividers (2 nm = 40 units) and drawn with the compass; the bearing lines every 30° with the protractor. An echo that returns after t microseconds is R = ct/2 away: 12.36 µs per nautical mile, so 74.1 µs is 6.0 nm and 43.3 µs is 3.5 nm. Each echo is plotted on the spoke of its bearing at that distance from O: distance and direction from the centre are both true — an azimuthal equidistant map.',
    build(k) {
      const g = k.g, s = 20, O = k.pt(0, 0), c = 299792458;
      const rngNm = t => c * t * 1e-6 / 2 / 1852, polar = (nm, brg) => g.polar(O, nm * s, (90 - brg) * D2R);
      const echoes = [{ t: 74.1, b: 52, n: 'T_1' }, { t: 43.3, b: 305, n: 'T_2' }];
      echoes.forEach(e => { e.R = rngNm(e.t); e.p = polar(e.R, e.b); });
      k.given('The own-ship position O at the centre and the north line upwards. The scale: 2 nautical miles are 40 units. Two echoes have been received: 74.1 µs after the pulse on bearing 052°, and 43.3 µs on bearing 305° (12.36 µs of delay is one nautical mile of range).', () => {
        k.point(O, 'O', { at: 'sw', lo: { upright: true } }); k.seg(O, polar(12, 0), { cls: 'cons' });
        k.frame(-12 * s - 22, -12 * s - 20, 12 * s + 22, 12 * s + 24);
        k.fontScale(0.7);
      });
      k.step('dividers', 'Step the dividers (set to 2 nm = 40 units) up the north line from O: six marks, 2, 4, 6, 8, 10 and 12 nautical miles.', () => {
        for (let i = 1; i <= 6; i++) k.dot(k.pt(0, 2 * i * s), { r: 0.6 });
      });
      k.step('compass', 'Draw a circle about O through each mark: the range rings. Every point of a ring is at the same distance from the antenna.', () => {
        for (let i = 1; i <= 6; i++) { k.circle(O, 2 * i * s, { cls: i === 6 ? 'given' : 'cons' }); k.label(k.pt(0, 2 * i * s), String(2 * i), 'ne', { upright: true, size: 0.65, dist: 0.5 }); }
      });
      k.step('protractor', 'With the protractor lay off a bearing line from O every 30° (000° at the top, then clockwise) as far as the outer ring, and write the bearings round the edge.', () => {
        for (let b = 0; b < 360; b += 30) { k.seg(O, polar(12, b), { cls: 'cons' }); const t = polar(12.9, b); T(k, t.x, t.y, String(b).padStart(3, '0') + '°', { size: 0.65 }); }
      });
      echoes.forEach((e, i) => {
        k.step('protractor', 'Echo ' + (i + 1) + ': lay off the bearing ' + String(e.b).padStart(3, '0') + '° from north, clockwise, and draw the line from O to the outer ring.', () => {
          k.seg(O, polar(12, e.b), { cls: 'curve' });
        });
        k.step('ruler', 'Echo ' + (i + 1) + ': its delay of ' + e.t + ' µs is a range of c·t/2 = ' + f2(e.R) + ' nm. Lay that off from O along the line (' + f1(e.R * s) + ' units, or ' + f1(e.R / 2) + ' ring spacings) and mark the echo.', () => {
          k.point(e.p, e.n, { at: i ? 'w' : 'e', cls: 'red', lo: { cls: 'red', upright: true } });
        });
      });
      const sep = g.dist(echoes[0].p, echoes[1].p) / s;
      k.step('straightedge', 'Join the two echoes. The distance between them is ' + f1(sep) + ' nautical miles, measured with the same scale as the rings.', () => {
        k.seg(echoes[0].p, echoes[1].p, { cls: 'thick' });
      });
      k.note('Limits of the picture: a 1.5° beam smears each echo across ' + f1(echoes[0].R * 1852 * 1.5 * D2R) + ' m at 6 nm; a 1 µs pulse cannot separate two echoes less than 150 m apart in range; and with the antenna 25 m up the radar horizon for a 10 m high ship is about 34 km (18 nm), beyond which the ring is empty.', () => {
        k.arc(O, echoes[0].R * s, (90 - 52 - 0.75) * D2R, (90 - 52 + 0.75) * D2R, { cls: 'red' });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 8 */
  Hyper.construction({
    id: 'ns-xray-geometry',
    title: 'The geometry of a radiograph: magnification, penumbra and the off-axis object',
    tags: ['X-ray', 'magnification', 'SID', 'penumbra', 'central projection'],
    note: 'A side view. The focal spot S is 100 cm above the detector (SID = 100); the object plane is 15 cm above it (OID = 15, SOD = 85); one unit on the sheet is 0.4 cm. By similar triangles an object parallel to the detector is magnified by SID/SOD = 1.176; the focal spot is drawn about 60 times too large so that its penumbra can be seen; and a sphere far from the axis gives an elongated shadow because the rays strike the detector obliquely.',
    build(k) {
      const g = k.g, sc = 2.5, SID = 100, OID = 15, SOD = SID - OID, M = SID / SOD;
      const Sp = k.pt(0, SID * sc), det = y => k.pt(0, y);
      const yObj = OID * sc, w = 12.5 * sc, Fd = 60;
      const hit = (A, P) => g.lineLine(A, P, k.pt(-300, 0), k.pt(300, 0));
      const barL = k.pt(-w / 2, yObj), barR = k.pt(w / 2, yObj);
      const iL = hit(Sp, barL), iR = hit(Sp, barR);
      const Fa = k.pt(-Fd / 2, SID * sc), Fb = k.pt(Fd / 2, SID * sc);
      const pa = hit(Fa, barR), pb = hit(Fb, barR);
      const cx = 100, rS = 6.25 * sc, Cs = k.pt(cx, yObj + 0.0);
      const tp = g.tangentPoints(Sp, Cs, rS);
      const sI = tp.map(t => hit(Sp, t)), sw = Math.abs(sI[0].x - sI[1].x), sc0 = 2 * rS * M;
      k.given('The source S (the focal spot) at 100 cm, the detector below it, and an object — a bar 12.5 cm wide, the size of a heart — in a plane parallel to the detector, 15 cm above it. (1 unit = 0.4 cm.)', () => {
        k.seg(k.pt(-140, 0), k.pt(200, 0), { cls: 'thick' }); T(k, 190, -10, 'detector', { size: 0.8 });
        k.point(Sp, 'S', { at: 'ne', lo: { upright: true }, nobounds: true });
        k.seg(k.pt(0, 0), Sp, { cls: 'cons', dash: true });
        k.seg(barL, barR, { cls: 'given' }); k.point(barL, 'a', { at: 'nw', lo: { upright: true, size: 0.8 } }); k.point(barR, 'b', { at: 'ne', lo: { upright: true, size: 0.8 } });
        k.dim(k.pt(-150, 0), k.pt(-150, yObj), 'OID = 15 cm', { dist: 3.2, size: 0.7, upright: true, side: 'right' });
        k.frame(-190, -30, 230, 140);
        k.fontScale(0.7);
        T(k, 20, 128, '↑ the focal spot S is 100 cm above the detector, off the top of the sheet', { size: 0.8 });
      });
      k.step('straightedge', 'Draw the rays from S through the ends a and b of the bar to the detector. They diverge, so the shadow is wider than the bar.', () => {
        k.seg(Sp, iL, { cls: 'cons' }); k.seg(Sp, iR, { cls: 'cons' });
        k.point(iL, 'a′', { at: 'sw', lo: { upright: true, size: 0.8 } }); k.point(iR, 'b′', { at: 'se', lo: { upright: true, size: 0.8 } });
      });
      k.step('dividers', 'Compare the lengths: the image a′b′ measures ' + f1(Math.abs(iR.x - iL.x) / sc * 1) + ' cm against the bar\'s 12.5 cm, a magnification of ' + f3(Math.abs(iR.x - iL.x) / w) + ' = SID/SOD = 100/85 = ' + f3(M) + ' (similar triangles S a b and S a′ b′).', () => {
        k.seg(k.pt(iL.x, -14), k.pt(iR.x, -14), { cls: 'curve' }); k.tick(k.pt(iL.x, -14), k.pt(1, 0)); k.tick(k.pt(iR.x, -14), k.pt(1, 0));
      });
      k.step('straightedge', 'A real focal spot has a size F. Draw the rays from its two ends past the edge b: they land at two different points, and between them the shadow fades from dark to light — the penumbra.', () => {
        k.seg(Fa, Fb, { cls: 'thick' });
        k.seg(Fa, pa, { cls: 'red' }); k.seg(Fb, pb, { cls: 'red' });
      });
      k.note('The penumbra is ' + f2(Math.abs(pa.x - pb.x) / sc * 10) + ' mm wide for the exaggerated spot drawn (' + f1(Fd / sc * 10) + ' mm): U_g = F × OID/SOD, here F × 0.176. For a real 1 mm spot it is 0.18 mm.', () => {
        k.seg(k.pt(Math.min(pa.x, pb.x), -8), k.pt(Math.max(pa.x, pb.x), -8), { cls: 'red', width: 3 }); T(k, Math.max(pa.x, pb.x) + 26, -9, 'U_g', { size: 0.8 });
      });
      k.step('compass', 'Now an object far from the axis: a sphere of diameter 12.5 cm, with its centre in the same plane but 40 cm off the central ray. Draw it with the compass.', () => {
        k.circle(Cs, rS, { cls: 'given' });
      });
      k.step('straightedge', 'Draw the two tangent rays from S to the sphere: where they meet the detector they mark the edges of its shadow.', () => {
        tp.forEach((t, i) => { k.seg(Sp, sI[i], { cls: 'cons' }); k.point(sI[i], '', { }); });
      });
      k.note('The shadow is ' + f1(sw / sc) + ' cm wide, against ' + f1(sc0 / sc) + ' cm for the same sphere on the central ray after magnification: the oblique rays stretch it, and its centre is displaced outward. A round object becomes an oval: this is the distortion of radiography away from the axis.', () => {
        k.dim(sI[0], sI[1], f1(sw / sc) + ' cm', { dist: 2, size: 0.8, upright: true, side: 'right' });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 9 */
  Hyper.construction({
    id: 'ns-ct-radon',
    title: 'CT by hand: three projections of a disc, the sinogram and the strips that locate it',
    tags: ['CT', 'Radon transform', 'sinogram', 'back-projection', 'parallel projection'],
    note: 'A slice of a body (large circle) holds one dense disc, centre (30, 40) mm, radius 25 mm. For each angle θ the scanner measures the line integral of the absorption along parallel rays; for a uniform disc this is a half-ellipse profile, as long as the chord of the disc: p(s) = 2μ√(r² − (s − s₀)²), centred on s₀ = x₀ cos θ + y₀ sin θ. Plotting the profiles for every θ from 0° to 180° gives the sinogram: the disc is a band bounded by two sine curves of amplitude √(x₀² + y₀²) = 50 mm. Back-projection smears each profile back across the slice along its rays; the strips overlap only where the disc can be.',
    build(k) {
      const g = k.g, rB = 85, c = k.pt(30, 40), r = 25, D = 115, hs = 0.8, O = k.pt(0, 0);
      const sh = th => g.dir(th * D2R), rd = th => k.pt(-Math.sin(th * D2R), Math.cos(th * D2R));
      const s0 = th => g.dot(c, sh(th));
      const detPt = (th, s) => g.add(g.mul(rd(th), D), g.mul(sh(th), s));
      const ths = [0, 45, 90];
      const profile = th => { const pts = []; for (let i = 0; i <= 60; i++) { const s = s0(th) - r + 2 * r * i / 60, ch = 2 * Math.sqrt(Math.max(0, r * r - (s - s0(th)) ** 2)); const p = g.add(detPt(th, s), g.mul(rd(th), hs * ch)); pts.push([p.x, p.y]); } return pts; };
      const X0 = 230, sinPt = (th, s) => k.pt(X0 + th * 0.95, s);
      const strip = th => { const L = 100; return [g.add(g.mul(sh(th), s0(th) - r), g.mul(rd(th), -L)), g.add(g.mul(sh(th), s0(th) + r), g.mul(rd(th), -L)), g.add(g.mul(sh(th), s0(th) + r), g.mul(rd(th), L)), g.add(g.mul(sh(th), s0(th) - r), g.mul(rd(th), L))]; };
      const clip = (subject, clipP) => {
        let out = subject;
        for (let i = 0; i < clipP.length && out.length; i++) {
          const a = clipP[i], b = clipP[(i + 1) % clipP.length], inp = out; out = [];
          const inside = p => (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x) >= 0;
          for (let j = 0; j < inp.length; j++) {
            const p = inp[j], q = inp[(j + 1) % inp.length], ip = inside(p), iq = inside(q);
            if (ip !== iq) out.push(g.lineLine(p, q, a, b));
            if (iq) out.push(q);
          }
        }
        return out;
      };
      k.given('A slice of a body: the large circle, with one dense disc of radius 25 mm centred at (30, 40) mm. The scanner turns round it; for the angle θ the rays run in the direction (−sin θ, cos θ) and the detector line is perpendicular to them, with the coordinate s measured along (cos θ, sin θ).', () => {
        k.circle(O, rB, { cls: 'cons' }); k.circle(c, r, { cls: 'thick' });
        k.axes(O, { x: [-rB * 1.0, rB * 1.0], y: [-rB, rB], xl: 'x', yl: 'y', labels: true });
        k.point(c, 'c = (30, 40)', { at: 'ne', lo: { upright: true, size: 0.8 } });
        k.frame(-165, -158, X0 + 190, 158);
        k.fontScale(0.62);
      });
      const names = { 0: 'θ = 0°: the rays run upwards and the detector is the line above the slice (s = x)', 45: 'θ = 45°: the rays run up and to the left', 90: 'θ = 90°: the rays run to the left (s = y)' };
      ths.forEach(th => {
        k.step('square', names[th] + '. Draw the two rays parallel to the beam that just touch the disc, at s = s₀ ± r = ' + f1(s0(th)) + ' ± 25 mm, from far behind the slice to the detector.', () => {
          [s0(th) - r, s0(th) + r].forEach(s => k.seg(g.add(g.mul(sh(th), s), g.mul(rd(th), -D)), detPt(th, s), { cls: 'cons' }));
          k.seg(detPt(th, -rB), detPt(th, rB), { cls: 'given' });
        });
        k.step('pencil', 'Plot the profile on the detector line: at each s between the two rays the height is proportional to the chord of the disc, 2√(r² − (s − s₀)²). It is a half-ellipse centred at s₀ = ' + f1(s0(th)) + ' mm.', () => {
          k.curve(profile(th), null, { cls: 'curve' });
        });
      });
      k.step('tee', 'The sinogram. Draw axes to the right: θ from 0° to 180° along the bottom, s from −85 to +85 mm up the side.', () => {
        k.seg(sinPt(0, 0), sinPt(180, 0), { cls: 'axis' }); k.seg(sinPt(0, -rB), sinPt(0, rB), { cls: 'axis' });
        [0, 90, 180].forEach(t => { k.label(sinPt(t, -rB), String(t) + '°', 's', { upright: true, size: 0.7 }); k.tick(sinPt(t, 0), k.pt(1, 0), {}); });
        k.label(sinPt(0, rB), 's', 'n', { upright: true, size: 0.8 }); k.label(sinPt(180, 0), 'θ', 'e', { size: 0.9 });
      });
      k.step('pencil', 'Trace the band of the disc: its edges are the curves s = s₀(θ) ± r with s₀(θ) = 30 cos θ + 40 sin θ = 50 cos(θ − 53.1°). The three profiles drawn above are the vertical chords of the band at 0°, 45° and 90°.', () => {
        [-r, 0, r].forEach((off, i) => k.curve(th => { const q = sinPt(th, s0(th) + off); return [q.x, q.y]; }, [0, 180], { cls: i === 1 ? 'cons' : 'curve', dash: i === 1, n: 120 }));
      });
      const ccw = pts => { let ar = 0; pts.forEach((p, i) => { const q = pts[(i + 1) % pts.length]; ar += p.x * q.y - q.x * p.y; }); return ar >= 0 ? pts : pts.slice().reverse(); };
      const polys = ths.map(th => strip(th));
      let inter = polys[0]; for (let i = 1; i < 3; i++) inter = clip(inter, ccw(polys[i]));
      k.note('Back-projection: smear each profile back across the slice along its rays. The strip for θ = 0° is the band 5 < x < 55, the strip for 90° the band 15 < y < 65; they overlap in a square, and the 45° strip trims its corners. With all angles the intersection shrinks to the disc itself (the filtering step then removes the remaining blur).', () => {
        if (inter.length > 2) { k.poly(inter, { close: true, cls: 'red' }); k.hatch(inter, { gap: 0.5 }); }
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 10 */
  Hyper.construction({
    id: 'ns-planet-maps',
    title: 'A crater near the pole of Mars: plate carrée against polar stereographic',
    tags: ['planetary map', 'equirectangular', 'polar stereographic', 'Mars', 'distortion'],
    note: 'A round crater of radius 470 km (7.94° on Mars, where one degree is 59.16 km) centred at 70° N, 40° E. Left: an equirectangular map, 1.6 units to the degree both ways. Right: a polar stereographic map with the pole at the centre; the radius of the parallel φ is ρ = 2R tan((90° − φ)/2) and R = 100 units. The outline of the crater is computed point by point on the sphere and then mapped; the stretching of the left map is sec 70° = 2.9 east–west.',
    build(k) {
      const g = k.g, P = k.proj, G = P.geo, Rm = 3389.5;
      const cen = [40, 70], rad = 470;
      const outline = []; for (let b = 0; b <= 360; b += 6) outline.push(G.destination(cen, b, rad));
      const sx = 1.6, L0 = k.pt(-300, 0);
      const eq = (lon, lat) => k.pt(L0.x + (lon + 20) * sx, (lat - 40) * sx);
      const R = 100, rho = lat => 2 * R * Math.tan((90 - lat) * D2R / 2), C = k.pt(110, 60);
      const pol = (lon, lat) => { const q = P.maps.project('stereographic', lon, lat, { lat0: 90, lon0: 220 }); return k.pt(C.x + q[0] * R, C.y + q[1] * R); };
      const bbox = pts => ({ w: Math.max(...pts.map(p => p.x)) - Math.min(...pts.map(p => p.x)), h: Math.max(...pts.map(p => p.y)) - Math.min(...pts.map(p => p.y)) });
      const bl = bbox(outline.map(p => eq(p[0], p[1]))), br = bbox(outline.map(p => pol(p[0], p[1])));
      k.given('The data: Mars (radius 3389.5 km, 59.16 km to the degree) and a round crater of radius 470 km centred at 70° N, 40° E. Two maps of the north polar region will be made: an equirectangular map (left), and a polar stereographic map (right).', () => {
        k.poly([eq(-20, 40), eq(100, 40), eq(100, 90), eq(-20, 90)], { close: true, cls: 'given' });
        k.point(C, 'pole', { at: 'sw', lo: { upright: true, size: 0.8 } });
        k.frame(-320, -22, C.x + rho(40) + 14, 140);
        k.fontScale(0.62);
      });
      k.step('dividers', 'Left map: step the dividers 20 times 1.6 = 32 units along the bottom for each 20° of longitude, and 16 units up the side for each 10° of latitude.', () => {
        for (let lo = 0; lo <= 100; lo += 20) { k.dot(eq(lo, 40), { r: 0.6 }); k.label(eq(lo, 40), lo + '°E', 's', { upright: true, size: 0.65 }); }
        for (let la = 50; la <= 90; la += 10) { k.dot(eq(-20, la), { r: 0.6 }); k.label(eq(-20, la), la + '°', 'w', { upright: true, size: 0.65 }); }
      });
      k.step('tee', 'Draw the meridians (verticals) and the parallels (horizontals) through the marks: a rectangular graticule, because longitude and latitude are used as x and y.', () => {
        for (let lo = 0; lo < 100; lo += 20) k.seg(eq(lo, 40), eq(lo, 90), { cls: 'cons' });
        for (let la = 50; la < 90; la += 10) k.seg(eq(-20, la), eq(100, la), { cls: 'cons' });
      });
      k.step('pencil', 'Plot the outline of the crater point by point (longitude and latitude of each point of the circle of radius 470 km) and join them. The crater is drawn as an oval ' + f2(bl.w / bl.h) + ' times wider than tall.', () => {
        k.curve(outline.map(p => { const q = eq(p[0], p[1]); return [q.x, q.y]; }), null, { cls: 'curve' });
      });
      k.step('ruler', 'Right map: lay off the radius of each parallel up the 40° E meridian from the pole, ρ = 2R tan((90° − φ)/2) = ' + [80, 70, 60, 50, 40].map(l => l + '°: ' + f1(rho(l))).join(', ') + ' units.', () => {
        [80, 70, 60, 50, 40].forEach(l => { const q = pol(40, l); k.dot(q, { r: 0.7 }); });
      });
      k.step('compass', 'Draw the parallels as circles about the pole through those marks.', () => {
        [80, 70, 60, 50, 40].forEach(l => { k.circle(C, rho(l), { cls: 'cons' }); const q = pol(40 + 90, l); k.label(q, l + '°', 'se', { upright: true, size: 0.6, dist: 0.3 }); });
      });
      k.step('protractor', 'Draw the meridians as spokes every 20° of longitude, from the pole to the outer circle (the 40° E spoke points straight up).', () => {
        for (let lo = 0; lo < 360; lo += 20) k.seg(C, pol(lo, 40), { cls: 'cons' });
      });
      k.step('pencil', 'Plot the outline of the same crater on this map, point by point. It is a circle.', () => {
        k.curve(outline.map(p => { const q = pol(p[0], p[1]); return [q.x, q.y]; }), null, { cls: 'curve' });
      });
      k.note('Width ÷ height of the outline: ' + f2(bl.w / bl.h) + ' on the equirectangular map (sec 70° = 2.92), ' + f2(br.w / br.h) + ' on the polar stereographic map. The polar stereographic map is conformal: small circles stay circles, and the crater keeps its shape.', () => {
        k.dim(eq(cen[0] - 8 / Math.cos(70 * D2R), cen[1] - 8.6), eq(cen[0] + 8 / Math.cos(70 * D2R), cen[1] - 8.6), 'stretched ×' + f2(bl.w / bl.h), { dist: 1.1, size: 0.65, upright: true, side: 'right' });
      });
      void Rm;
    }
  });

  /* ------------------------------------------------------------------------------------------------ 11 */
  Hyper.construction({
    id: 'ns-wulff-construction',
    title: 'The Wulff net by compass, and the standard projection of a cubic crystal',
    tags: ['stereographic', 'Wulff net', 'inscribed angle', 'crystal poles', 'compass'],
    note: 'The primitive circle is the section of the reference sphere seen edge-on, with the eye at S: a line from S to the point of the circle at angular distance ψ from the top N cuts the horizontal diameter at R tan(ψ/2) — the stereographic image of that point, found with a ruler and no table. A meridian of the net is the circle through N, S and the point E at angular distance λ from the centre; a parallel of latitude β is the circle through the point at height R sin β on the primitive and the point R tan(β/2) up the vertical diameter. The poles of a cubic crystal viewed down [001] are then plotted on the same circle: the [101] poles (of the {110} family) at 45° from the centre, {111} at 54.74°; the stereographic triangle [001]–[101]–[111] has its third side on the meridian λ = 45°, which shows that [111] is at latitude 35.26° from [101].',
    build(k) {
      const g = k.g, R = 150, O = k.pt(0, 0), N = k.pt(0, R), Sp = k.pt(0, -R), E = k.pt(R, 0), W = k.pt(-R, 0);
      const onCircle = psi => k.pt(R * Math.sin(psi * D2R), R * Math.cos(psi * D2R));          // angle psi from N, to the right
      const lam = [30, 45, 60];
      const horiz = [W, E];
      const cutH = psi => g.lineLine(Sp, onCircle(psi), W, E);
      const merid = l => { const e = cutH(l), mid = g.mid(N, e), perp = g.perp(g.sub(e, N)), cx = g.lineLine(mid, g.add(mid, perp), W, E); return { e, c: cx, rad: g.dist(cx, N) }; };
      const arcMer = (m, side) => {
        const phi = Math.atan2(R, Math.abs(m.c.x));
        if (side > 0) k.arc(m.c, m.rad, -phi, phi, { cls: 'given' }); else k.arc(k.pt(-m.c.x, 0), m.rad, Math.PI - phi, Math.PI + phi, { cls: 'given' });
      };
      const small = b => {                                         // the small circle of latitude b (north), through the primitive and the vertical diameter
        const pL = k.pt(-R * Math.cos(b * D2R), R * Math.sin(b * D2R)), pR = k.pt(R * Math.cos(b * D2R), R * Math.sin(b * D2R)), v = k.pt(0, R * Math.tan(b * D2R / 2));
        const cc = g.circumcenter(pL, pR, v);
        return { pL, pR, v, cc, rad: g.dist(cc, v) };
      };
      const polar = (psi, az) => { const rr = R * Math.tan(psi * D2R / 2); return k.pt(rr * Math.cos(az * D2R), rr * Math.sin(az * D2R)); };
      const psi111 = Math.acos(1 / Math.sqrt(3)) * R2D;
      k.given('The primitive circle (radius R = 150), its two diameters and the points N, S (top and bottom) and E, W. The eye is at S, and the horizontal diameter is the plane of projection.', () => {
        k.circle(O, R, { cls: 'given' }); k.seg(W, E, { cls: 'cons' }); k.seg(Sp, N, { cls: 'cons' });
        k.point(N, 'N', 'n'); k.point(Sp, 'S', 's'); k.point(E, 'E', 'e'); k.point(W, 'W', 'w'); k.dot(O);
        k.frame(-R - 24, -R - 26, R + 24, R + 24);
        k.fontScale(0.7);
      });
      k.step('protractor', 'Mark on the circle, to the right of N, the points at 30°, 45° and 60° from N (angles measured at the centre).', () => {
        lam.forEach(l => k.point(onCircle(l), l + '°', { at: 'ne', lo: { upright: true, size: 0.7 } }));
      });
      k.step('straightedge', 'Join S to each of them. Where the lines cut the horizontal diameter are the stereographic images of the points 30°, 45°, 60° from the centre: at R tan 15° = ' + f1(R * Math.tan(15 * D2R)) + ', R tan 22.5° = ' + f1(R * Math.tan(22.5 * D2R)) + ' and R tan 30° = ' + f1(R * Math.tan(30 * D2R)) + '.', () => {
        lam.forEach(l => { k.seg(Sp, onCircle(l), { cls: 'cons' }); k.dot(cutH(l), { r: 0.8 }); });
      });
      const ms = lam.map(merid);
      k.step('square', 'The meridian of longitude λ is the circle through N, S and the point E_λ just found. Its centre lies on the horizontal diameter, on the perpendicular bisector of N E_λ: draw the bisectors and mark the centres C_30, C_45, C_60 (to the left of the net).', () => {
        ms.forEach(m => { const mid = g.mid(N, m.e); k.seg(mid, m.c, { cls: 'cons', nobounds: true }); k.dot(m.c, { r: 0.7, nobounds: true }); });
      });
      k.step('compass', 'With centre C_λ and radius C_λN draw the arc from N to S on the right of the vertical diameter, and by symmetry the arc on the left about the mirror image of C_λ: the meridians of 30°, 45° and 60°.', () => {
        ms.forEach(m => { arcMer(m, 1); arcMer(m, -1); });
      });
      const sm = [30, 60].map(small);
      k.step('protractor', 'Parallels of latitude. Mark on the circle, above the horizontal diameter, the points at 30° and 60° above E (and their mirror images above W): the places where the parallels meet the primitive.', () => {
        sm.forEach(s => { k.dot(s.pL, { r: 0.8 }); k.dot(s.pR, { r: 0.8 }); });
      });
      k.step('straightedge', 'Join W to the points above E: the lines cut the vertical diameter at R tan(β/2) = ' + f1(R * Math.tan(15 * D2R)) + ' and ' + f1(R * Math.tan(30 * D2R)) + ' (the same inscribed-angle construction turned through a right angle).', () => {
        sm.forEach(s => { k.seg(W, s.pR, { cls: 'cons' }); k.dot(s.v, { r: 0.8 }); });
      });
      k.step('compass', 'Each parallel is the circle through the three points (the two on the primitive and the one on the vertical diameter). Find its centre on the vertical diameter and draw the arc inside the primitive; do the same below the equator.', () => {
        sm.forEach(s => { const a0 = Math.atan2(s.pL.y - s.cc.y, s.pL.x - s.cc.x), a1 = Math.atan2(s.pR.y - s.cc.y, s.pR.x - s.cc.x); k.arc(s.cc, s.rad, a0, a1, { cls: 'given' }); const m2 = k.pt(s.cc.x, -s.cc.y); k.arc(m2, s.rad, -a1, -a0, { cls: 'given' }); });
      });
      const rP = R * Math.tan(45 * D2R / 2), rQ = R * Math.tan(psi111 * D2R / 2);
      k.step('compass', 'Now the crystal. A cubic crystal viewed down [001]: the poles [101], [011] … (of the {110} family) are 45° from the centre and the poles {111} are ' + f2(psi111) + '° from it, so by the same construction they lie on circles of radius R tan 22.5° = ' + f1(rP) + ' and R tan ' + f2(psi111 / 2) + '° = ' + f1(rQ) + ' about the centre. Draw both circles.', () => {
        k.circle(O, rP, { cls: 'cons' }); k.circle(O, rQ, { cls: 'cons' });
      });
      k.step('protractor', 'The azimuths: the [101]-type poles lie on the axes (0°, 90°, 180°, 270°), {111} on the diagonals (45°, 135°, …). Draw the spokes at 0° and 45° and mark the poles where they cross the circles.', () => {
        k.seg(O, E, { cls: 'cons' }); k.seg(O, polar(90, 45), { cls: 'cons' });
        for (let a = 0; a < 360; a += 90) k.point(polar(45, a), a === 0 ? '[101]' : '', { at: 'se', cls: 'red', lo: { cls: 'red', upright: true, size: 0.7 } });
        for (let a = 45; a < 360; a += 90) k.point(polar(psi111, a), a === 45 ? '[111]' : '', { at: 'ne', cls: 'red', lo: { cls: 'red', upright: true, size: 0.7 } });
        k.point(O, '[001]', { at: 'sw', cls: 'red', lo: { cls: 'red', upright: true, size: 0.7 } });
      });
      const tri = [O, polar(45, 0), polar(psi111, 45)];
      k.step('pencil', 'Trace the stereographic triangle [001]–[101]–[111]: two straight sides from the centre, and a third side along the meridian λ = 45°, the circle of centre C_45 through [101] and [111]. Every direction of a cubic crystal is equivalent to one inside this triangle.', () => {
        k.seg(tri[0], tri[1], { cls: 'thick' }); k.seg(tri[0], tri[2], { cls: 'thick' });
        const c45 = ms[1].c, a0 = Math.atan2(tri[1].y - c45.y, tri[1].x - c45.x), a1 = Math.atan2(tri[2].y - c45.y, tri[2].x - c45.x);
        k.arc(c45, ms[1].rad, a0, a1, { cls: 'thick' });
      });
      k.note('Measure on the net: [111] lies on the 45° meridian, ' + f2(Math.acos(2 / Math.sqrt(6)) * R2D) + '° from [101] along it (cos φ = 2/√6). The angle [001]–[111] is ' + f2(psi111) + '° and [001]–[101] is 45°.', () => {
        k.dim(tri[1], tri[2], '35.26°', { dist: 1.4, size: 0.75, upright: true, side: 'right' });
      });
    }
  });

  /* ------------------------------------------------------------------------------------------------ 12 */
  Hyper.construction({
    id: 'ns-weather-polar',
    title: 'The polar stereographic chart true at 60° N, from a section through the sphere',
    tags: ['polar stereographic', 'standard parallel', 'map factor', 'weather chart', 'inscribed angle'],
    note: 'Left: a section through the sphere along its axis. The eye is at the south pole S. A tangent plane at the north pole (dashed) would give the usual polar stereographic with true scale at the pole; the weather chart uses a plane that cuts the sphere along the parallel of 60° N, the standard parallel, so that the scale is exactly 1 there. The line from S through the point of latitude φ meets the plane at the radius ρ of that parallel on the chart (right). Because the plane is nearer to S than the tangent plane, the whole chart is smaller by (1 + sin 60°)/2 = 0.933 and the map factor is m = (1 + sin 60°)/(1 + sin φ).',
    build(k) {
      const g = k.g, R = 100, p0 = 60, SC = k.pt(-160, 0), PC = k.pt(170, 0);
      const Sp = g.add(SC, k.pt(0, -R)), Np = g.add(SC, k.pt(0, R)), yPl = R * Math.sin(p0 * D2R);
      const plA = g.add(SC, k.pt(-20, yPl)), plB = g.add(SC, k.pt(185, yPl));
      const lats = [80, 70, 60, 50, 40, 30];
      const Q = l => g.add(SC, k.pt(R * Math.cos(l * D2R), R * Math.sin(l * D2R)));
      const hitP = l => g.lineLine(Sp, Q(l), plA, plB);
      const rho = l => hitP(l).x - SC.x, mf = l => (1 + Math.sin(p0 * D2R)) / (1 + Math.sin(l * D2R));
      k.given('A section through the sphere in a plane containing the axis: the circle of radius R = 100, the axis NS, the equator as a horizontal diameter, the eye at the south pole S, and the plane of projection — a horizontal line at the height R sin 60° = 86.6, where it cuts the circle at the parallel of 60° N (the dashed line is the plane touching at the pole).', () => {
        k.circle(SC, R, { cls: 'given' }); k.seg(Sp, Np, { cls: 'cons' }); k.seg(g.add(SC, k.pt(-R, 0)), g.add(SC, k.pt(R, 0)), { cls: 'cons' });
        k.point(Sp, 'S (eye)', { at: 's', lo: { upright: true, size: 0.8 } }); k.point(Np, 'N', { at: 'n', lo: { upright: true, size: 0.8 } });
        k.seg(plA, plB, { cls: 'thick' }); k.seg(g.add(SC, k.pt(-20, R)), g.add(SC, k.pt(185, R)), { cls: 'aux', dash: true });
        k.point(PC, 'pole', { at: 'sw', lo: { upright: true, size: 0.8 } });
        k.frame(SC.x - R - 24, -R - 26, PC.x + rho(30) + 14, R + 20);
        k.fontScale(0.62);
      });
      k.step('protractor', 'Mark on the circle, on the right, the points of latitude 80°, 70°, 60°, 50°, 40° and 30°: Q_φ is at the angle φ above the equator.', () => {
        lats.forEach(l => k.point(Q(l), l + '°', { at: 'e', lo: { upright: true, size: 0.65 } }));
      });
      k.step('straightedge', 'Join S to each point and extend the line until it meets the plane of projection. The distance of the meeting point from the axis is the radius ρ of that parallel on the chart: ' + lats.map(l => l + '°: ' + f1(rho(l))).join(', ') + '.', () => {
        lats.forEach(l => { k.seg(Sp, hitP(l), { cls: 'cons' }); k.dot(hitP(l), { r: 0.8 }); });
      });
      k.step('dividers', 'Carry each ρ from the axis to the chart on the right: mark the distances up the Greenwich meridian from the pole.', () => {
        lats.forEach(l => { k.dot(g.add(PC, k.pt(0, rho(l))), { r: 0.7 }); });
      });
      k.step('compass', 'Draw the parallels as circles about the pole. The 60° circle (heavy) has radius R cos 60° = 50: the plane cuts the sphere there, so it is drawn at its true length.', () => {
        lats.forEach(l => { k.circle(PC, rho(l), { cls: l === 60 ? 'thick' : 'cons' }); k.label(g.add(PC, k.pt(0, rho(l))), l + '°', 'ne', { upright: true, size: 0.65, dist: 0.3 }); });
      });
      k.step('protractor', 'Draw the meridians as spokes every 30° of longitude from the pole to the 30° circle, with the Greenwich meridian upwards.', () => {
        for (let a = 0; a < 360; a += 30) k.seg(PC, g.add(PC, g.mul(g.dir((90 + a) * D2R), rho(30))), { cls: 'cons' });
      });
      k.note('Map factor along the chart: ' + [30, 45, 60, 80, 90].map(l => 'm(' + l + '°) = ' + f3(mf(l))).join(', ') + '. A pressure gradient measured on the chart must be multiplied by m: at 45° N the chart is 9 % too large, so reading the isobar spacing there without correcting would give a wind 9 % too light.', () => {
        [30, 45, 60].forEach(l => k.label(g.add(PC, k.pt(0, -rho(l))), 'm = ' + f2(mf(l)), 'e', { upright: true, size: 0.65 }));
      });
    }
  });


})();
