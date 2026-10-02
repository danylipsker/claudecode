/* HYPER-PROJECTIONS · constructions/the-celestial-sphere.js — ruler-and-compass constructions of the celestial sphere.
 *
 *   cs-sphere-drawn         the celestial sphere in profile: horizon, zenith, the pole at altitude φ, the equator, a diurnal circle
 *   cs-equatorial-grid      the equatorial grid on a polar chart: rings of declination with dividers, hours of right ascension with the protractor
 *   cs-ecliptic-on-equator  the ecliptic drawn on the equator circle at 23.44° (top view and edge view, Monge style), its nodes the equinoxes
 *   cs-galactic-plane       the plane of the Milky Way, inclined 62.9° to the equator, with the galactic centre placed on it
 *   cs-sidereal-dials       why a star day is shorter than a solar day: the orbit with parallels, and the two 24-hour dials
 *   cs-spherical-triangle   the pole–zenith–star triangle solved as a drawing (plan and elevation, true length, protractor)
 *   cs-sun-declination      the Sun's declination through the year, a sine curve drawn point by point from a circle
 *   cs-moon-planet-bands    the Moon's path at 5.1° to the ecliptic and the latitude bands of the planets
 *   cs-diurnal-circles      the daily circles of several declinations at one latitude: circumpolar, rising and setting, never rising
 *   cs-precession-circle    the north celestial pole going round the ecliptic pole on a circle of 23.44° in about 25 800 years
 * Every step names its tool and every point is computed with k.g (never guessed); the data of the sky (dates, star places)
 * come from Hyper.sky. Angles in the code are degrees until they reach k.g (radians).
 */
(function () {
  'use strict';
  const D = Math.PI / 180, R2D = 180 / Math.PI;
  const rev = x => ((x % 360) + 360) % 360;
  const DIRN = ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'];
  const dirOf = ang => DIRN[Math.round(rev(ang) / 45) % 8];            // a compass word for a direction in degrees (0 = east, 90 = north)
  const up = { upright: true, size: 0.78 };
  const S = () => Hyper.sky;
  const MINUS = '−';
  const sgn = d => (d < 0 ? MINUS : '') + Math.abs(d);                // a degree value with a true minus sign
  /* a dot with its label: pt(k, P, 'P', 'ne', { upright: true, size: 0.8 }) — the last argument styles the label */
  const pt = (k, p, label, at, o) => k.point(p, label, { at: at || 'ne', lo: (o && o.lo) || o || {} });
  /* an angle mark at v from the ray towards a anticlockwise to the ray towards b; the text sits at distance lr from v on the bisector */
  function amark(k, v, a, b, r, text, lr, o) {
    const g = k.g;
    k.angle(v, a, b, Object.assign({ r }, o || {}));
    if (text) {
      const a0 = g.angleOf(g.sub(a, v)); let a1 = g.angleOf(g.sub(b, v)); while (a1 < a0) a1 += 2 * Math.PI;
      const p = g.polar(v, lr, (a0 + a1) / 2);
      k.text(p.x, p.y, text, { size: 0.8, bg: true, fill: (o && o.fill) || '#1b1b1b' });
    }
  }

  /* the dates (days after the March equinox, and the calendar date) on which the Sun's longitude is lam, in 2025 */
  function sunCrossing(lam) {
    const sky = S(), f = jd => ((sky.sun(jd).lon - lam + 540) % 360) - 180;
    for (let jd = sky.jdUT(2025, 3, 10, 0); jd < sky.jdUT(2026, 4, 15, 0); jd += 1) {
      if (f(jd) < 0 && f(jd + 1) >= 0) { let x = jd, y = jd + 1; for (let i = 0; i < 40; i++) { const m = (x + y) / 2; if (f(m) < 0) x = m; else y = m; } return x; }
    }
    return null;
  }

  /* ================================================================== the celestial sphere in profile */
  Hyper.construction({
    id: 'cs-sphere-drawn',
    title: 'The celestial sphere in profile: horizon, zenith, pole, equator and a daily circle',
    tags: ['celestial sphere', 'meridian', 'protractor', 'set square'],
    note: 'The figure is the observer\'s **meridian plane** seen from the east: the circle is the great circle of the sky through the zenith and the poles, the observer stands at its centre O, north is on the right. Everything that is a circle on the sphere and perpendicular to the meridian (the horizon, the celestial equator, a star\'s daily circle) is seen **edge-on as a straight line**, so the whole drawing needs only a protractor, a set square and a straightedge. Latitude φ = 32° (Tel Aviv); the star has declination +40°, close to Vega.',
    build(k) {
      const g = k.g, R = 150, phi = 32, dec = 40;
      const O = k.pt(0, 0), N = k.pt(R, 0), Sp = k.pt(-R, 0), Z = k.pt(0, R), Nd = k.pt(0, -R);
      const P = g.polar(O, R, phi * D), P2 = g.polar(O, R, (phi + 180) * D);
      const Q = g.polar(O, R, (phi + 90) * D), Q2 = g.polar(O, R, (phi - 90) * D);
      const C1 = g.polar(O, R, (phi + 90 - dec) * D), C2 = g.polar(O, R, (phi - 90 + dec) * D);
      const X = g.lineLine(C1, C2, Sp, N);
      k.given('The observer O at the centre of the meridian circle, the horizon (the horizontal diameter S–N, south on the left) and the vertical through the zenith Z and the nadir. The latitude is φ = 32° and the star has declination δ = +40°.', () => {
        k.circle(O, R, { cls: 'given' });
        k.seg(Sp, N, { cls: 'given' }); k.seg(Nd, Z, { cls: 'cons' });
        pt(k, O, 'O', 'sw'); pt(k, N, 'N', 'e'); pt(k, Sp, 'S', 'w'); pt(k, Z, 'Z', 'n'); pt(k, Nd, 'nadir', 's', { lo: up });
        k.label(g.lerp(Sp, O, 0.5), 'horizon', 's', up);
        k.frame(-R * 1.4, -R * 1.2, R * 1.5, R * 1.2);
      });
      k.step('protractor', 'At O lay off the latitude φ = 32° above the north point N. The ray ends on the circle at P: the **north celestial pole** stands as high above the north horizon as you are far from the equator.', () => {
        pt(k, P, 'P', 'ne');
        amark(k, O, N, P, 3, 'φ', 60);
      });
      k.step('straightedge', 'Draw the line through P and O to the opposite point P′: the **world axis**, the line the whole sky turns about once a day.', () => {
        k.seg(P2, P, { cls: 'given' }); pt(k, P2, "P′", 'sw');
      });
      k.step('square', 'With the set square draw through O the perpendicular to the axis: the **celestial equator** seen edge-on. It meets the circle at Q, due south and 90° − φ = 58° above the south horizon, and at Q′ below the north horizon.', () => {
        k.seg(Q2, Q, { cls: 'curve' });
        k.right(O, P, Q, { r: 1.2 });
        pt(k, Q, 'Q', 'nw'); pt(k, Q2, "Q′", 'se');
        k.label(g.lerp(O, Q2, 0.34), 'equator', 'ne', { upright: true, size: 0.75, fill: '#0b4fa0', bg: true });
      });
      k.step('dividers', 'Check with the dividers: the chord Z–P and the chord S–Q are equal. The pole is 90° − φ from the zenith and the equator meets the south horizon at the same angle, 90° − φ.', () => {
        k.seg(Z, P, { cls: 'cons', dash: true }); k.seg(Sp, Q, { cls: 'cons', dash: true });
        amark(k, O, P, Z, 5, '90° ' + MINUS + ' φ', 92);
        amark(k, O, Q, Sp, 5, '90° ' + MINUS + ' φ', 92);
      });
      k.step('protractor', 'For the star lay off its declination δ = +40° from the equator towards the pole, on both sides: C₁ on the upper side (the star at its highest, on the meridian) and C₂ (at its lowest, twelve hours later).', () => {
        pt(k, C1, 'C_1', 'n'); pt(k, C2, 'C_2', 'se');
        amark(k, O, C1, Q, 7, 'δ', 120, { cls: 'curve', fill: '#0b4fa0' });
        amark(k, O, Q2, C2, 7, 'δ', 120, { cls: 'curve', fill: '#0b4fa0' });
      });
      k.step('straightedge', 'Join C₁ to C₂. It is perpendicular to the axis, so it is the star\'s **daily circle** seen edge-on. It crosses the horizon at X: that is where the star rises and sets.', () => {
        k.seg(C1, C2, { cls: 'curve' }); pt(k, X, 'X', 'sw', { lo: up });
      });
      k.step('pencil', 'Line in the result: the part C₁X above the horizon, travelled while the star is up, solid; the part X–C₂ below the horizon, hidden by the Earth, dashed.', () => {
        k.seg(C1, X, { cls: 'thick' }); k.seg(X, C2, { cls: 'thick', dash: true });
      });
      k.note('Reading the picture: C₁ is 82° above the north horizon, so the star culminates 8° **north** of the zenith (altitude 90° − φ + δ = 98° counted from the south point). C₂ lies 18° below the north horizon; the star sinks to altitude −18° at lower culmination. A star whose circle lay wholly above the horizon would be circumpolar.', () => {
        amark(k, O, C2, N, 8.6, '18°', 166, { cls: 'aux' });
        amark(k, O, C1, Z, 8.6, '', 0, { cls: 'aux' });
      });
    }
  });

  /* ================================================================== the equatorial grid on a polar chart */
  Hyper.construction({
    id: 'cs-equatorial-grid',
    title: 'The equatorial grid on a polar chart',
    tags: ['right ascension', 'declination', 'polar chart', 'dividers', 'protractor'],
    note: 'A polar chart centred on the north celestial pole P. Here the distance from P is simply proportional to the angular distance 90° − δ (an **equidistant** polar chart), so rings of declination are found by stepping off equal intervals with the dividers. The sky is shown as you see it facing north at sidereal time 0 h: 0 h at the top, hours of right ascension increasing **clockwise**. (A chart seen from outside the sphere, as on a globe, is the mirror image.) The three stars are plotted from their catalogue places.',
    build(k) {
      const g = k.g, sc = 2.6, ring = dec => (90 - dec) * sc;           // 2.6 units per degree
      const P = k.pt(0, 0), rEq = ring(0), rOut = ring(-30);
      const hourAng = h => (90 - h * 15) * D;                           // screen angle of a right ascension in hours (0 h at the top, clockwise)
      const pos = (raDeg, decDeg) => g.polar(P, ring(decDeg), (90 - raDeg) * D);
      const sky = S();
      const stars = [['alpLyr', 'Vega'], ['alpCMa', 'Sirius'], ['alpUMa', 'Dubhe']].map(([key, nm]) => { const s = sky.star(key); return { nm, ra: s.ra, dec: s.dec, p: pos(s.ra, s.dec) }; });
      k.given('The pole P and the 0 h line drawn upwards from it, with the length of 10° of arc taken from the scale (say 25 mm).', () => {
        pt(k, P, 'P', 'sw', { lo: up });
        k.seg(P, g.polar(P, rOut, 90 * D), { cls: 'cons' });
        const a = k.pt(-rOut * 1.12, -rOut * 1.08), b = k.pt(-rOut * 1.12 + 10 * sc, -rOut * 1.08);
        k.seg(a, b, { cls: 'given' }); k.tick(a, k.pt(1, 0)); k.tick(b, k.pt(1, 0)); k.dim(a, b, '10°', { dist: 1.2, size: 0.8 });
        k.frame(-rOut * 1.2, -rOut * 1.16, rOut * 1.2, rOut * 1.16);
      });
      k.step('dividers', 'Starting at P, step the 10° interval off along the 0 h line: nine steps reach the equator (δ = 0°), three more the parallel of −30°. Each mark is a declination.', () => {
        for (let d = 80; d >= -30; d -= 10) { const p = g.polar(P, ring(d), 90 * D); k.dot(p, { r: 0.6 }); k.label(p, sgn(d) + '°', 'e', { upright: true, size: 0.58, dist: 0.5, bg: true }); }
      });
      k.step('compass', 'With centre P draw the circle through each mark: the **parallels of declination**. The ring at 0° is the celestial equator; draw it heavier.', () => {
        for (let d = 80; d >= -30; d -= 10) k.circle(P, ring(d), { cls: d === 0 ? 'curve' : 'cons' });
        k.label(g.polar(P, rEq, 135 * D), 'celestial equator', 'nw', { upright: true, size: 0.72, fill: '#0b4fa0' });
      });
      k.step('protractor', 'At P lay off 15° at a time (one hour of right ascension) clockwise from the 0 h line, and mark each direction on the outer ring: 0 h at the top, 6 h on the right, 12 h at the bottom, 18 h on the left.', () => {
        for (let h = 0; h < 24; h++) { const p = g.polar(P, rOut, hourAng(h)); k.dot(p, { r: 0.5 }); k.label(p, h + 'h', dirOf(90 - h * 15), { upright: true, size: 0.7, dist: 0.75 }); }
      });
      k.step('straightedge', 'Join the opposite hour marks through P: twelve straight lines make the 24 **hour circles** (the meridians of right ascension, seen as radii).', () => {
        for (let h = 0; h < 12; h++) k.seg(g.polar(P, rOut, hourAng(h)), g.polar(P, rOut, hourAng(h + 12)), { cls: 'cons' });
      });
      k.step('protractor', 'To plot a star measure its right ascension from the 0 h line: Vega 18 h 37 m = 279.2°, Sirius 6 h 45 m = 101.3°, Dubhe 11 h 04 m = 165.9°. Draw a faint ray at each angle.', () => {
        stars.forEach(s => k.seg(P, g.polar(P, rOut, (90 - s.ra) * D), { cls: 'cons', dash: true }));
      });
      k.step('dividers', 'Carry the angular distance 90° − δ from P along each ray (Vega 51.2°, Sirius 106.7°, Dubhe 28.3°, from the 10° scale): that is the star.', () => {
        stars.forEach(s => { k.dot(s.p, { r: 1.4 }); k.label(s.p, s.nm, dirOf(90 - s.ra + 20), { upright: true, size: 0.78 }); });
      });
      k.note('The grid does not turn: the stars have fixed places on it. What turns is the horizon, which the planisphere and the astrolabe lay over this chart and rotate once a sidereal day.', () => {
        k.label(P, 'north celestial pole', 'se', { upright: true, size: 0.7, dist: 1.4, bg: true });
      });
    }
  });
  /* ================================================================== an inclined great circle seen from the pole (top view and edge view) */
  /* The ecliptic and the Milky Way's plane are both great circles inclined to the celestial equator. Seen from the north celestial pole
     the equator is a circle of radius R and the other great circle is an ellipse with the same major axis (the line of nodes) and a
     semi-minor axis R cos(i). The edge view along the line of nodes shows the inclination i; the horizontal projectors carry R cos(i) back. */
  function inclinedCircle(k, o) {
    const g = k.g, R = 140, i = o.incl, Cx = 2.45 * R, b = R * Math.cos(i * D);
    const T = k.pt(0, 0), O2 = k.pt(Cx, 0);
    const Sp = g.polar(O2, R, (90 - i) * D), Sm = g.polar(O2, R, (270 - i) * D);        // the inclined circle's ends in the edge view
    const Bp = k.pt(0, b), Bm = k.pt(0, -b);
    const A = u => g.polar(T, R, u * D), B = u => g.polar(T, b, u * D);                // the radius at angle u cuts the outer and the inner circle
    const E = u => k.pt(R * Math.cos(u * D), b * Math.sin(u * D));                       // the point of the inclined circle at angle u from the node
    return { g, R, i, Cx, b, T, O2, Sp, Sm, Bp, Bm, A, B, E };
  }

  Hyper.construction({
    id: 'cs-ecliptic-on-equator',
    title: 'The ecliptic drawn on the celestial equator at 23.44°',
    tags: ['ecliptic', 'obliquity', 'equinox', 'descriptive geometry', 'protractor'],
    note: 'Two views of the celestial sphere, as in descriptive geometry. **Left, the view from the north celestial pole P**: the equator is a circle of radius R and the ecliptic, tilted by ε, is an ellipse (a circle seen obliquely). **Right, the view along the line of equinoxes**: both circles are edge-on, the equator as the vertical line and the ecliptic as a line tilted by ε. The horizontal projectors carry heights from the edge view to the top view. Longitudes increase anticlockwise, as seen from above the pole. The two crossing points are the equinoxes; the points half-way between are the solstices.',
    build(k) {
      const c = inclinedCircle(k, { incl: 23.44 }), g = c.g, R = c.R, b = c.b, T = c.T, O2 = c.O2, eps = c.i;
      const lamAngles = [30, 60, 120, 150];
      k.given('The celestial equator seen from the pole: a circle of radius R about P, with the line of equinoxes (horizontal) and the solstice line (vertical). On the right, the same sphere seen along the line of equinoxes: the equator is the vertical line through O′.', () => {
        k.circle(T, R, { cls: 'given' });
        k.seg(k.pt(-R * 1.12, 0), k.pt(R * 1.12, 0), { cls: 'cons' }); k.seg(k.pt(0, -R * 1.12), k.pt(0, R * 1.12), { cls: 'cons' });
        pt(k, T, 'P', 'sw', { lo: up });
        pt(k, k.pt(R, 0), 'March equinox', 's', { lo: up }); pt(k, k.pt(-R, 0), 'September equinox', 's', { lo: up });
        k.circle(O2, R, { cls: 'given' }); k.seg(k.pt(c.Cx, -R * 1.12), k.pt(c.Cx, R * 1.12), { cls: 'given' });
        pt(k, O2, "O′", 'sw', { lo: up });
        k.label(k.pt(c.Cx, R * 1.12), 'equator, edge-on', 'n', up);
        k.label(k.pt(0, -R * 1.3), 'view from the pole P', 's', { upright: true, size: 0.85 }); k.label(k.pt(c.Cx, -R * 1.3), 'view along the line of equinoxes', 's', { upright: true, size: 0.85 });
        k.fontScale(0.62);
        k.frame(-R * 1.55, -R * 1.5, c.Cx + R * 1.25, R * 1.3);
      });
      k.step('protractor', 'In the edge view, at O′ lay off the obliquity ε = 23.44° from the equator\'s vertical line. The tilted line is the ecliptic seen edge-on; it meets the circle at S⁺ (June solstice, upper right) and S⁻.', () => {
        k.seg(c.Sm, c.Sp, { cls: 'curve' }); pt(k, c.Sp, 'S^+', 'ne'); pt(k, c.Sm, 'S^-', 'sw');
        amark(k, O2, c.Sp, k.pt(c.Cx, R), 4.4, 'ε', 84);
      });
      k.step('tee', 'Draw horizontals from S⁺ and S⁻ back across to the top view. They meet the solstice line at two points a distance b = R cos ε from P: the half-width of the ecliptic when seen from the pole.', () => {
        k.seg(c.Sp, c.Bp, { cls: 'cons' }); k.seg(c.Sm, c.Bm, { cls: 'cons' });
        pt(k, c.Bp, 'B^+', 'se'); pt(k, c.Bm, 'B^-', 'ne');
      });
      k.step('compass', 'With centre P and radius b = PB⁺ draw the inner circle. The ecliptic ellipse will have semi-axes R and b and will touch the two circles at their ends.', () => {
        k.circle(T, b, { cls: 'cons' });
      });
      k.step('protractor', 'At P lay off the ecliptic longitude λ = 30°, 60°, 120° and 150° from the March equinox. Each radius cuts the outer circle at A and the inner circle at B.', () => {
        lamAngles.forEach(l => { k.seg(T, c.A(l), { cls: 'cons' }); k.dot(c.A(l), { r: 0.9 }); k.dot(c.B(l), { r: 0.9 }); });
        k.label(c.A(30), 'A', 'e', up); k.label(c.B(30), 'B', 'sw', up);
        [30, 60, 120, 150].forEach(l => k.label(c.A(l), l + '°', dirOf(l), { upright: true, size: 0.62, dist: l === 30 ? 2.4 : 1.1 }));
      });
      k.step('square', 'Through each A draw the vertical and through the matching B the horizontal. They meet at E: a point of the ecliptic (its distance from the equator\'s node line is R sin λ cos ε, its longitude is λ).', () => {
        lamAngles.forEach(l => { const e = c.E(l); k.seg(c.A(l), e, { cls: 'cons' }); k.seg(c.B(l), e, { cls: 'cons' }); k.dot(e, { r: 1.1 }); });
      });
      k.step('dividers', 'The ecliptic is symmetrical about P: carry each E through P to the opposite side to get the points for λ + 180°.', () => {
        [...lamAngles, 90].forEach(l => { const e = c.E(l + 180); k.dot(e, { r: 1.1 }); });
        lamAngles.forEach(l => k.seg(c.E(l), c.E(l + 180), { cls: 'cons', dash: true }));
      });
      k.step('pencil', 'Trace the ellipse through the twelve points. Its major axis is the line of equinoxes (length 2R), its minor axis the solstice line (length 2b). The ecliptic leaves the equator at the equinoxes and is farthest from it at the solstices.', () => {
        k.curve(t => [R * Math.cos(t), b * Math.sin(t)], [0, 2 * Math.PI], { n: 240, cls: 'curve' });
        k.label(k.pt(0, R), 'June solstice (λ = 90°)', 'n', { upright: true, size: 0.8, fill: '#0b4fa0', dist: 1.1 });
        k.label(k.pt(0, -R), 'December solstice (λ = 270°)', 's', { upright: true, size: 0.8, fill: '#0b4fa0', dist: 1.1 });
      });
      k.note('The north ecliptic pole K stands at distance ε from P, in the direction of λ = 270° (here straight down). The solstice point stands ε above the equator, which is why the Sun\'s greatest declination is 23.44°.', () => {
        const K = k.pt(0, -R * Math.sin(eps * D)); pt(k, K, 'K', 'se', { lo: up });
      });
    }
  });

  Hyper.construction({
    id: 'cs-galactic-plane',
    title: 'The plane of the Milky Way: inclination 62.9° and the galactic centre',
    tags: ['galactic plane', 'galactic centre', 'descriptive geometry', 'protractor'],
    note: 'The same two-view method as for the ecliptic, with the inclination of the galactic plane to the celestial equator, i = 62.87°. The line of nodes (where the plane crosses the equator) runs from right ascension 6 h 51 m to 18 h 51 m; the ascending node, where the Milky Way goes north of the equator, is at the right (galactic longitude l = 32.9°). Angles u are measured anticlockwise from that node along the plane, so that u = l − 32.93°. Seen from the north celestial pole P the plane is an ellipse of semi-axes R and R cos i. The numbers are the J2000 definition of the galactic system.',
    build(k) {
      const c = inclinedCircle(k, { incl: 62.87 }), g = c.g, R = c.R, b = c.b, T = c.T, O2 = c.O2, inc = c.i;
      const l0 = 32.93, gl = [0, 45, 90, 135];                              // galactic longitudes constructed; the opposite points follow by symmetry
      const u = l => l - l0;
      k.given('The celestial equator seen from the pole P (a circle of radius R), with the line of nodes of the galactic plane drawn horizontally, and on the right the edge view along that line. The ascending node is at the right.', () => {
        k.circle(T, R, { cls: 'given' });
        k.seg(k.pt(-R * 1.12, 0), k.pt(R * 1.12, 0), { cls: 'cons' }); k.seg(k.pt(0, -R * 1.12), k.pt(0, R * 1.12), { cls: 'cons' });
        pt(k, T, 'P', 'sw', { lo: up });
        pt(k, k.pt(R, 0), 'ascending node', 's', { lo: up }); pt(k, k.pt(-R, 0), 'descending node', 's', { lo: up });
        k.circle(O2, R, { cls: 'given' }); k.seg(k.pt(c.Cx, -R * 1.12), k.pt(c.Cx, R * 1.12), { cls: 'given' });
        pt(k, O2, "O′", 'sw', { lo: up });
        k.label(k.pt(c.Cx, R * 1.12), 'equator, edge-on', 'n', up);
        k.label(k.pt(0, -R * 1.3), 'view from the pole P', 's', { upright: true, size: 0.85 }); k.label(k.pt(c.Cx, -R * 1.3), 'view along the line of nodes', 's', { upright: true, size: 0.85 });
        k.fontScale(0.62);
        k.frame(-R * 1.55, -R * 1.5, c.Cx + R * 1.3, R * 1.3);
      });
      k.step('protractor', 'In the edge view lay off the inclination i = 62.87° from the equator\'s vertical line at O′. The tilted line is the galactic plane seen edge-on.', () => {
        k.seg(c.Sm, c.Sp, { cls: 'curve' }); pt(k, c.Sp, 'G^+', 'ne'); pt(k, c.Sm, 'G^-', 'sw');
        amark(k, O2, c.Sp, k.pt(c.Cx, R), 3.4, 'i', 62);
      });
      k.step('tee', 'Horizontals from G⁺ and G⁻ back to the top view cut the vertical line at distance b = R cos i = 0.457 R from P: the half-width of the plane seen from the pole.', () => {
        k.seg(c.Sp, c.Bp, { cls: 'cons' }); k.seg(c.Sm, c.Bm, { cls: 'cons' });
        pt(k, c.Bp, 'B^+', 'se'); pt(k, c.Bm, 'B^-', 'ne');
      });
      k.step('compass', 'Draw the inner circle with centre P and radius b.', () => {
        k.circle(T, b, { cls: 'cons' });
      });
      k.step('protractor', 'Measure from the ascending node: the galactic centre (l = 0°) is u = −32.9°, then l = 45°, 90° and 135° are u = 12.1°, 57.1° and 102.1°. Draw the four radii; each cuts the outer circle at A and the inner circle at B.', () => {
        gl.forEach(l => { const a = u(l); k.seg(T, c.A(a), { cls: 'cons' }); k.dot(c.A(a), { r: 0.9 }); k.dot(c.B(a), { r: 0.9 }); k.label(c.A(a), 'l = ' + l + '°', dirOf(a), { upright: true, size: 0.62, dist: 1.1 }); });
      });
      k.step('square', 'Vertical from each A, horizontal from the matching B: they meet at the point of the galactic plane with that longitude.', () => {
        gl.forEach(l => { const a = u(l), e = c.E(a); k.seg(c.A(a), e, { cls: 'cons' }); k.seg(c.B(a), e, { cls: 'cons' }); k.dot(e, { r: 1.1 }); });
      });
      k.step('dividers', 'The plane is symmetrical about P: carry each point through P to the opposite side for l + 180°.', () => {
        gl.forEach(l => { const a = u(l); k.dot(c.E(a + 180), { r: 1.1 }); k.seg(c.E(a), c.E(a + 180), { cls: 'cons', dash: true }); });
      });
      k.step('pencil', 'Trace the ellipse. Mark the galactic centre (l = 0°, in Sagittarius) and the north galactic pole (straight below P, at distance b from it). The top of the ellipse is the plane\'s northernmost point, in Cassiopeia.', () => {
        k.curve(t => [R * Math.cos(t), b * Math.sin(t)], [0, 2 * Math.PI], { n: 240, cls: 'curve' });
        const gc = c.E(u(0)); k.dot(gc, { r: 1.8 }); k.label(gc, 'galactic centre', 'w', { upright: true, size: 0.78, dist: 1.1, bg: true });
        pt(k, k.pt(0, -b), 'north galactic pole', 's', { lo: { upright: true, size: 0.72, dist: 1.4 } });
      });
      k.note('Reading the drawing: the plane climbs to declination +62.9° at right ascension 0 h 51 m and sinks to −62.9° at 12 h 51 m. The galactic centre, 32.9° before the ascending node, stands at declination −28.9°, in Sagittarius: that is why the centre of the Galaxy never rises high for observers in the north.', () => {
        const gc = c.E(u(0)); k.seg(gc, k.pt(gc.x, 0), { cls: 'aux', dash: true });
      });
    }
  });
  /* ================================================================== the sidereal and the solar dial */
  Hyper.construction({
    id: 'cs-sidereal-dials',
    title: 'Why a star day is shorter: the orbit, the parallels and the two 24-hour dials',
    tags: ['sidereal time', 'solar day', 'orbit', 'set square', 'dividers'],
    note: 'Seen from the north, with the Sun S at the centre. The stars are so far away that the direction to a given star is the **same from every point of the orbit**: that is why the same horizontal parallel is drawn at each position. At local midnight the observer\'s meridian points straight away from the Sun, along the extension of the line S–E. The angle from the horizontal (the direction of the March equinox) to that line is the sidereal time at midnight, 12 h at the start and 2 h more at each step: in a year the sidereal clock gains a whole 24 hours on the solar clock, 3 min 56.6 s every day. (The ecliptic is slightly tilted to the equator, so the times are right to within about ten minutes.)',
    build(k) {
      const g = k.g, R = 150, ext = 70, sky = S();
      const Sun = k.pt(0, 0), E = i => g.polar(Sun, R, (180 + 30 * i) * D), out = i => g.polar(Sun, R + ext, (180 + 30 * i) * D);
      const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateOf = i => { const d = sky.date(sunCrossing(30 * i)); return d.getUTCDate() + ' ' + MON[d.getUTCMonth()]; };
      const hrs = i => ((12 + 2 * i) % 24) + 'h';
      k.given('The Sun S at the centre, the Earth\'s orbit (a circle of radius R, drawn as a circle although it is nearly one), and the direction of the March equinox: a long arrow to the right. The Earth goes round anticlockwise.', () => {
        k.circle(Sun, R, { cls: 'given', arrow: Math.PI * 0.75 });
        pt(k, Sun, 'S', 'ne');
        k.arrow(k.pt(R + ext + 170, -R * 1.22), k.pt(R + ext + 260, -R * 1.22), { cls: 'given' });
        k.label(k.pt(R + ext + 260, -R * 1.22), 'to the March equinox', 'e', { upright: true, size: 0.75, dist: 1.3 });
        k.fontScale(0.74);
        k.frame(-R - ext - 40, -R * 1.3, R + ext + 380, R * 1.62);
      });
      k.step('protractor', 'At S lay off 30° at a time from the left-hand end of the horizontal diameter. The twelve marks E₀ … E₁₁ are the Earth\'s places when the Sun is seen at longitude 0°, 30°, 60° … (about a month apart; the dates are those of 2025).', () => {
        for (let i = 0; i < 12; i++) { pt(k, E(i), 'E_{' + i + '}', dirOf(180 + 30 * i), { lo: { upright: true, size: 0.7, dist: 0.9 } }); }
      });
      k.step('straightedge', 'Join each E to S and extend beyond the orbit. Six lines through S give the twelve directions to the Sun; beyond the orbit each line is the direction in which an observer on the night side looks at midnight.', () => {
        for (let i = 0; i < 6; i++) k.seg(out(i), out(i + 6), { cls: 'cons' });
        for (let i = 0; i < 12; i++) k.label(out(i), hrs(i), dirOf(180 + 30 * i), { upright: true, size: 0.72, dist: 0.9 });
      });
      k.step('square', 'Slide the set square along the T-square to draw through every E the **parallel** to the equinox direction (a short horizontal to the right): a distant star does not change direction as the Earth goes round.', () => {
        for (let i = 0; i < 12; i++) k.seg(E(i), g.add(E(i), k.pt(62, 0)), { cls: 'cons', arrow: 'end' });
      });
      k.step('protractor', 'Read the sidereal time at midnight with the protractor at S: the angle from the equinox direction (the horizontal) anticlockwise to the line S–E. For E₀ it is 180° = 12 h, for E₃ (about 21 June) 270° = 18 h; each month adds 30° = 2 h. (At E the same angle appears again, between the parallel and the outward line.)', () => {
        k.arc(Sun, 38, 0, Math.PI, { cls: 'curve', arrow: true }); k.arc(Sun, 52, 0, 1.5 * Math.PI, { cls: 'curve', arrow: true });
        k.text(-62, 18, '12 h = 180°', { size: 0.72, upright: true, fill: '#0b4fa0', bg: true }); k.text(30, -66, '18 h = 270°', { size: 0.72, upright: true, fill: '#0b4fa0', bg: true });
      });
      k.note('Dates of the Sun\'s longitudes: ' + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (30 * i) + '° ' + dateOf(i)).join(', ') + '. In 365.24 days the Earth turns 366.24 times with respect to the stars; a sidereal day is 23 h 56 min 4.09 s of solar time.', () => {
        for (let r = 0; r < 4; r++) k.text(R + ext + 190, R * 1.5 - r * 14, [0, 1, 2].map(j => (30 * (3 * r + j)) + '° ' + dateOf(3 * r + j)).join('     '), { size: 0.55, upright: true });
        k.text(R + ext + 190, R * 1.5 + 14, 'longitude of the Sun and date, 2025', { size: 0.55, upright: true });
      });
      k.note('The same fact as two clock dials at midnight on 21 March: the outer dial counts mean solar hours (0 h at the bottom, where the Sun is opposite), the inner dial counts sidereal hours and reads 12 h at the same mark. After a month the inner dial has slipped 2 h forwards; after a year, once round.', () => {
        const C = k.pt(R + ext + 190, 0), r1 = 115, r2 = 78;
        k.circle(C, r1, { cls: 'aux' }); k.circle(C, r2, { cls: 'aux' });
        for (let h = 0; h < 24; h++) {
          const a = (270 + h * 15) * D, p1 = g.polar(C, r1, a), p2 = g.polar(C, r1 - 8, a);
          k.seg(p1, p2, { cls: 'aux' });
          if (h % 3 === 0) k.label(g.polar(C, r1 + 6, a), String(h), dirOf(270 + h * 15), { upright: true, size: 0.6 });
          const b = (270 + (h - 12) * 15) * D;
          k.seg(g.polar(C, r2, b), g.polar(C, r2 - 7, b), { cls: 'aux' });
          if (h % 6 === 0) k.label(g.polar(C, r2 - 16, b), String(h), 'c', { upright: true, size: 0.6 });
        }
        k.text(C.x, C.y + 8, 'solar (outer)', { upright: true, size: 0.62 }); k.text(C.x, C.y - 8, 'sidereal (inner)', { upright: true, size: 0.62 });
      });
    }
  });

  /* ================================================================== the spherical triangle drawn */
  Hyper.construction({
    id: 'cs-spherical-triangle',
    title: 'The pole–zenith–star triangle solved as a drawing',
    tags: ['spherical triangle', 'altitude', 'hour angle', 'descriptive geometry', 'true length'],
    note: 'A star of declination δ = +19.2° (Arcturus) at hour angle H = 50° (3 h 20 min past the meridian), seen from latitude φ = 32°. The three directions from the observer O to the pole P, the zenith Z and the star X make the three sides of a **spherical triangle**: PZ = 90° − φ, PX = 90° − δ, and the unknown ZX = 90° − h (h is the altitude). The angle at P between the planes PZ and PX is the hour angle H. The solution uses a plan and an elevation drawn along the polar axis and the true length of the chord ZX; the protractor then reads the third side. Its azimuth is found by the same method from the angle at Z.',
    build(k) {
      const g = k.g, R = 140, phi = 32, dec = 19.18, H = 50;
      const oy = -2.35 * R;                                   // the plan is drawn below the elevation
      const Oe = k.pt(0, 0), Pe = k.pt(0, R), Op = k.pt(0, oy);
      const Ze = g.polar(Oe, R, phi * D);                      // zenith in the elevation: at 90° − φ from the axis OP
      const Xm = g.polar(Oe, R, dec * D);                      // the star at hour angle 0 (in the meridian plane)
      const yx = R * Math.sin(dec * D), rho = R * Math.cos(dec * D);          // height of the daily circle, its radius
      const Xp = k.pt(rho * Math.cos(H * D), oy - rho * Math.sin(H * D));      // the star in the plan
      const Zp = k.pt(R * Math.cos(phi * D), oy);                               // the zenith in the plan
      const Xe = k.pt(Xp.x, yx);                                                // the star in the elevation
      const dPlan = g.dist(Zp, Xp), dy = Math.abs(Ze.y - yx), L = Math.hypot(dPlan, dy);
      const omega = 2 * Math.asin(L / (2 * R)) * R2D;                           // the third side, degrees
      const tx = 2.55 * R;                                                      // the small figures on the right
      const A0 = k.pt(tx, 0), A1 = k.pt(tx + dPlan, 0), A2 = k.pt(tx + dPlan, dy);          // the right triangle: legs d and Δy
      const Z3 = k.pt(tx, oy + R * 0.5), X3 = g.polar(Z3, L, 0);                             // the base ZX of the isosceles triangle
      const O3 = g.circleCircle(Z3, R, X3, R).sort((a, b) => b.y - a.y)[0];
      k.given('The elevation: the sphere of directions seen from the side with the polar axis OP vertical, and the plan: the same sphere seen from the pole. φ = 32°, δ = 19.2°, H = 50°; R is the radius of the sphere.', () => {
        k.circle(Oe, R, { cls: 'given' }); k.seg(k.pt(-R, 0), k.pt(R, 0), { cls: 'cons' }); k.seg(k.pt(0, -R * 1.05), k.pt(0, R * 1.1), { cls: 'cons' });
        pt(k, Oe, 'O', 'sw', { lo: up }); pt(k, Pe, 'P', 'ne');
        k.label(k.pt(-R, 0), 'equator', 'nw', { upright: true, size: 0.7 });
        k.circle(Op, R, { cls: 'given' }); k.seg(k.pt(-R, oy), k.pt(R * 1.1, oy), { cls: 'cons' }); k.seg(k.pt(0, oy - R * 1.1), k.pt(0, oy + R * 1.05), { cls: 'cons' });
        pt(k, Op, "O′", 'sw', { lo: up });
        k.label(k.pt(-R * 1.02, R * 0.95), 'elevation', 'se', { upright: true, size: 0.8 }); k.label(k.pt(-R * 1.02, oy + R * 0.95), 'plan', 'se', { upright: true, size: 0.8 });
        k.fontScale(0.7);
        k.frame(-R * 1.25, oy - R * 1.2, tx + R * 1.15, R * 1.2);
      });
      k.step('protractor', 'In the elevation lay off 90° − φ = 58° from the axis OP (or φ above the equator): the zenith Z, a point of the circle.', () => {
        k.seg(Oe, Ze, { cls: 'curve' }); pt(k, Ze, 'Z', 'ne');
        amark(k, Oe, Ze, Pe, 3.2, '90° − φ', 50);
      });
      k.step('protractor', 'Lay off the declination δ = 19.2° above the equator on the other side. The star at hour angle 0 would be at X₀; its daily circle is the horizontal chord through X₀, at height R sin δ above the equator.', () => {
        pt(k, Xm, 'X_0', 'ne', { lo: up });
        k.seg(k.pt(-Xm.x, Xm.y), Xm, { cls: 'cons' });
        amark(k, Oe, k.pt(R, 0), Xm, 4.5, 'δ', 64);
      });
      k.step('square', 'Drop the vertical from X₀ to the plan: its foot is at distance R cos δ from O′.', () => {
        k.seg(Xm, k.pt(Xm.x, oy), { cls: 'cons', dash: true }); k.dot(k.pt(Xm.x, oy), { r: 0.8 });
      });
      k.step('compass', 'In the plan draw the daily circle of the star: centre O′, radius R cos δ. Here it has its true size.', () => {
        k.circle(Op, rho, { cls: 'curve' });
      });
      k.step('protractor', 'In the plan lay off the hour angle H = 50° at O′, measured from the meridian direction O′–(right) towards the bottom: the star X is where the ray meets the daily circle. The zenith is straight above in the plan at Zₚ, R cos φ from O′ (drop the vertical from Z).', () => {
        k.seg(Op, Xp, { cls: 'cons' }); pt(k, Xp, 'X_p', 'sw'); k.seg(Ze, Zp, { cls: 'cons', dash: true }); pt(k, Zp, 'Z_p', 'ne');
        amark(k, Op, Xp, k.pt(R, oy), 4.2, 'H', 50);
      });
      k.step('square', 'Carry X up to the elevation with a vertical: it meets the daily circle (the horizontal chord) at X.', () => {
        k.seg(Xp, Xe, { cls: 'cons', dash: true }); pt(k, Xe, 'X', 'sw');
        k.seg(Ze, Xe, { cls: 'cons', dash: true });
      });
      k.step('straightedge', 'Join Zₚ to Xₚ in the plan: this is the horizontal distance d between the zenith direction and the star. In the elevation the difference of heights Δ is the vertical distance between Z and X.', () => {
        k.seg(Zp, Xp, { cls: 'curve' });
        k.seg(Ze, k.pt(R * 1.25, Ze.y), { cls: 'cons', dash: true }); k.seg(Xe, k.pt(R * 1.25, yx), { cls: 'cons', dash: true });
        k.seg(k.pt(R * 1.25, Ze.y), k.pt(R * 1.25, yx), { cls: 'curve' }); k.label(k.pt(R * 1.25, (Ze.y + yx) / 2), 'Δ', 'e', { size: 0.8 });
      });
      k.step('dividers', 'Carry d and Δ to the right-hand figure: lay off d along a horizontal and erect Δ at its end at a right angle. The hypotenuse is the true length L of the chord ZX.', () => {
        k.seg(A0, A1, { cls: 'cons' }); k.seg(A1, A2, { cls: 'cons' }); k.right(A1, A0, A2, { r: 0.9 });
        k.label(g.mid(A0, A1), 'd', 's', { size: 0.8 }); k.label(g.mid(A1, A2), 'Δ', 'e', { size: 0.8 });
      });
      k.step('straightedge', 'Join the ends: A₀A₂ = L, the chord that joins the two directions Z and X on the sphere.', () => {
        k.seg(A0, A2, { cls: 'curve' }); k.label(g.mid(A0, A2), 'L', 'n', { size: 0.9 });
      });
      k.step('dividers', 'Lay L off as the base Z–X of a new triangle.', () => {
        k.seg(Z3, X3, { cls: 'curve' }); pt(k, Z3, 'Z', 'sw'); pt(k, X3, 'X', 'se');
      });
      k.step('compass', 'With centre Z and then centre X, radius R (the radius of the sphere), draw two arcs: they meet at O″, the observer. Join O″ to Z and X.', () => {
        k.arc(Z3, R, 70 * D, 110 * D, { cls: 'cons' }); k.arc(X3, R, 70 * D, 110 * D, { cls: 'cons' });
        k.seg(O3, Z3, { cls: 'cons' }); k.seg(O3, X3, { cls: 'cons' }); pt(k, O3, "O″", 'n');
      });
      k.step('protractor', 'Measure the angle at O″ between the two rays: it is the third side of the spherical triangle, ZX = 90° − h = ' + omega.toFixed(1) + '°. So the altitude is h = ' + (90 - omega).toFixed(1) + '°; check: sin h = sin φ sin δ + cos φ cos δ cos H gives the same.', () => {
        amark(k, O3, Z3, X3, 1.6, '', 0, { cls: 'curve' }); k.text(O3.x, O3.y - 0.42 * R, 'ZX = ' + omega.toFixed(1) + '°', { size: 0.85, upright: true, fill: '#0b4fa0', bg: true });
      });
    }
  });
  /* ================================================================== the Sun's declination through the year */
  Hyper.construction({
    id: 'cs-sun-declination',
    title: 'The Sun\'s declination through the year, drawn point by point from a circle',
    tags: ['Sun', 'declination', 'sine curve', 'seasons', 'dividers'],
    note: 'The Sun moves round the ecliptic at a nearly steady rate, and the ecliptic is tilted by ε = 23.44° to the equator, so the Sun\'s height above the equator is, to within a few hundredths of a degree, **ε sin λ** (exactly sin δ = sin ε sin λ). A point going round a circle of radius ε has exactly that height: the sine curve is the circle seen from the side. The only subtlety is the time axis: equal steps of longitude are not equal steps of time (the Earth is nearest the Sun in early January and moves faster, so northern spring and summer last about 7.6 days longer than autumn and winter), and the construction uses the true dates of 2025.',
    build(k) {
      const g = k.g, sky = S(), eps = 23.44, sc = 5, xs = 1.15, r = eps * sc;      // 5 units per degree of declination, 1.15 units per day
      const t0 = sunCrossing(0), TY = 365.2422;
      const day = i => (i === 24 ? TY : sunCrossing(15 * i) - t0);
      const C = k.pt(-r - 70, 0);
      const Pc = i => g.polar(C, r, 15 * i * D), Dp = i => k.pt(day(i) * xs, r * Math.sin(15 * i * D));
      const xEnd = TY * xs + 24;
      const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const dateOf = i => { const d = sky.date(t0 + day(i)); return d.getUTCDate() + ' ' + MON[d.getUTCMonth()]; };
      k.given('The time axis (days after the March equinox of 2025, 1.15 units to the day), the declination axis (5 units to the degree), and a circle of radius ε = 23.44° on the same scale, with its horizontal diameter on the time axis. The angle round the circle is the Sun\'s longitude λ.', () => {
        k.seg(k.pt(0, 0), k.pt(xEnd, 0), { cls: 'given' }); k.seg(k.pt(0, -r * 1.18), k.pt(0, r * 1.18), { cls: 'given' });
        k.circle(C, r, { cls: 'given' }); k.seg(k.pt(C.x - r * 1.1, 0), k.pt(C.x + r * 1.1, 0), { cls: 'cons' });
        pt(k, C, 'C', 'sw', { lo: up });
        [-20, -10, 10, 20].forEach(d => { k.dot(k.pt(0, d * sc), { r: 0.5 }); k.label(k.pt(0, d * sc), sgn(d) + '°', 'w', { upright: true, size: 0.62, dist: 0.7 }); });
        k.label(k.pt(0, r * 1.18), 'δ', 'ne', { size: 0.9 }); k.label(k.pt(xEnd, 0), 'days', 'se', { upright: true, size: 0.7 });
        k.seg(k.pt(0, r), k.pt(xEnd, r), { cls: 'aux', dotted: true }); k.seg(k.pt(0, -r), k.pt(xEnd, -r), { cls: 'aux', dotted: true });
        k.label(k.pt(xEnd, r), '+23.44°', 'e', { upright: true, size: 0.62 }); k.label(k.pt(xEnd, -r), '−23.44°', 'e', { upright: true, size: 0.62 });
        k.fontScale(0.7);
        k.frame(C.x - r * 1.25, -r * 1.35, xEnd + 70, r * 1.35);
      });
      k.step('dividers', 'Set the dividers to the chord of 15° (taken once with the protractor) and step round the circle from the right-hand end of the diameter: 24 points, the Sun\'s longitude λ = 0°, 15°, 30° … 345°.', () => {
        for (let i = 0; i < 24; i++) k.dot(Pc(i), { r: 0.8 });
        [0, 6, 12, 18].forEach(i => k.label(Pc(i), 15 * i + '°', dirOf(15 * i), { upright: true, size: 0.62, dist: 0.9 }));
      });
      k.step('ruler', 'Along the time axis lay off the day on which the Sun reaches each of those longitudes (the 24 dates, 0, 15, 30, 46, 61, 77, 93 … 365 days after the equinox, from the almanac or from a sun chart).', () => {
        for (let i = 1; i <= 24; i++) { const p = k.pt(day(i) * xs, 0); k.dot(p, { r: 0.8 }); }
        [0, 6, 12, 18, 24].forEach(i => k.label(k.pt(day(i) * xs, 0), dateOf(i), i % 12 === 0 ? 'nw' : (i === 6 ? 'se' : 'ne'), { upright: true, size: 0.62, dist: 0.9 }));
      });
      k.step('square', 'With the set square raise the vertical (ordinate) through each date mark, up or down as far as the height of the matching point on the circle.', () => {
        for (let i = 1; i < 24; i++) if (i !== 12) k.seg(k.pt(day(i) * xs, 0), Dp(i), { cls: 'cons' });
      });
      k.step('tee', 'With the T-square carry the height of each circle point horizontally across to its ordinate: the intersection D is the Sun\'s declination on that date.', () => {
        for (let i = 1; i < 24; i++) if (i !== 12) { k.seg(Pc(i), Dp(i), { cls: 'cons' }); k.dot(Dp(i), { r: 0.9 }); }
      });
      k.step('pencil', 'Draw the smooth curve through the points: the Sun\'s declination through the year. It crosses zero at the equinoxes, reaches +23.44° at the June solstice and −23.44° at the December one.', () => {
        const pts = []; for (let i = 0; i <= 24; i++) pts.push(Dp(i));
        k.smooth(pts, { cls: 'curve', n: 20 });
      });
      k.note('For comparison, the dashed curve is the Sun\'s declination from the ephemeris of the engine (it lies on the drawn curve within the line width), and the dotted curve is a sine in time, ε sin(2πt/365.24 d), which would peak on day 91 instead of day 93 and cross zero in September on day 183 instead of 186.', () => {
        const jd0 = t0, F = t => [t * xs, sky.sun(jd0 + t).dec * sc];
        k.curve(t => F(t), [0, TY], { n: 220, cls: 'aux', dash: true });
        k.curve(t => [t * xs, r * Math.sin(2 * Math.PI * t / TY)], [0, TY], { n: 220, cls: 'aux', dotted: true });
      });
    }
  });

  /* ================================================================== the Moon's path and the planets' bands */
  Hyper.construction({
    id: 'cs-moon-planet-bands',
    title: 'The Moon\'s path at 5.1° to the ecliptic, and the planets\' bands',
    tags: ['Moon', 'planets', 'ecliptic', 'nodes', 'latitude'],
    note: 'Drawn in ecliptic coordinates: longitude 0°–360° along the horizontal line (2 units to the degree) and ecliptic latitude up and down (14 units to the degree, so that the latitudes are seven times exaggerated against the longitudes). The ecliptic is the horizontal line itself. The Moon\'s orbit is a great circle tilted 5.145° to it, so its path is a sine wave, drawn here from a circle exactly like the Sun\'s declination. The nodes (where the wave crosses the line) go slowly backwards, once round in 18.6 years: the dots are the real Moon, every second day of January 2022, whose wobble about the wave is the perturbation by the Sun. The bars below give the greatest ecliptic latitude each planet reaches as seen from the Earth over 1950–2050.',
    build(k) {
      const g = k.g, sky = S(), xs = 2, ys = 14, inc = 5.145, rc = inc * ys;
      const jd0 = sky.jdUT(2022, 1, 1, 0), node = rev(125.1228 - 0.0529538083 * sky.days(jd0));
      const C = k.pt(-rc - 50, 0);
      const Pc = j => g.polar(C, rc, 30 * j * D), lam = j => rev(node + 30 * j);
      const Dp = j => k.pt(lam(j) * xs, rc * Math.sin(30 * j * D));
      const bars = [['Mercury', 5.0], ['Venus', 8.7], ['Mars', 6.8], ['Jupiter', 1.6], ['Saturn', 2.8], ['Uranus', 0.8], ['Neptune', 1.8], ['Moon', 5.3]];
      k.given('The ecliptic as a horizontal line with a scale of longitude (2 units to the degree) and, at the left, a circle of radius 5.145° on the scale of latitude (14 units to the degree), centred on the line. The Moon\'s ascending node on 1 January 2022 is at longitude ' + node.toFixed(1) + '°.', () => {
        k.seg(k.pt(0, 0), k.pt(360 * xs, 0), { cls: 'given' }); k.seg(k.pt(0, -ys * 9), k.pt(0, ys * 9), { cls: 'given' });
        for (let l = 0; l <= 360; l += 30) { k.dot(k.pt(l * xs, 0), { r: 0.6 }); k.label(k.pt(l * xs, 0), l + '°', 's', { upright: true, size: 0.58, dist: 0.8 }); }
        [-8, -4, 4, 8].forEach(b => { k.dot(k.pt(0, b * ys), { r: 0.5 }); k.label(k.pt(0, b * ys), sgn(b) + '°', 'w', { upright: true, size: 0.58, dist: 0.7 }); });
        k.circle(C, rc, { cls: 'given' }); k.seg(k.pt(C.x - rc * 1.15, 0), k.pt(C.x + rc * 1.15, 0), { cls: 'cons' }); pt(k, C, 'C', 'sw', { lo: up });
        k.label(k.pt(360 * xs, 0), 'λ', 'e', { size: 0.9 }); k.label(k.pt(0, ys * 9), 'β', 'ne', { size: 0.9 });
        k.seg(k.pt(0, 8 * ys), k.pt(360 * xs, 8 * ys), { cls: 'aux', dotted: true }); k.seg(k.pt(0, -8 * ys), k.pt(360 * xs, -8 * ys), { cls: 'aux', dotted: true });
        k.label(k.pt(360 * xs, 8 * ys), 'edge of the zodiac, about +8°', 'ne', { upright: true, size: 0.55 }); k.label(k.pt(360 * xs, -8 * ys), '−8°', 'se', { upright: true, size: 0.55 });
        k.fontScale(0.66);
        k.frame(C.x - rc * 1.4, -ys * 9 - 330, 360 * xs + 150, ys * 9.5);
      });
      k.step('ruler', 'Mark the ascending node, where the Moon crosses the ecliptic going north, at longitude ' + node.toFixed(1) + '°, and the descending node 180° further on.', () => {
        const a = k.pt(node * xs, 0), d = k.pt(rev(node + 180) * xs, 0);
        pt(k, a, 'ascending node', 'nw', { lo: { upright: true, size: 0.7 } }); pt(k, d, 'descending node', 'ne', { lo: { upright: true, size: 0.7 } });
      });
      k.step('dividers', 'Step round the circle with the 30° chord from its right-hand end: twelve points, which stand for the Moon\'s angle u = 0°, 30° … 330° along its orbit measured from the ascending node.', () => {
        for (let j = 0; j < 12; j++) k.dot(Pc(j), { r: 0.8 });
      });
      k.step('ruler', 'Lay the same twelve points on the longitude scale: the Moon is at u from the node when its longitude is node + u. Mark node + 30°, node + 60° … (subtract 360° where the number passes it).', () => {
        for (let j = 0; j < 12; j++) k.dot(k.pt(lam(j) * xs, 0), { r: 0.8 });
      });
      k.step('square', 'Raise the ordinate through each of the twelve marks.', () => {
        for (let j = 1; j < 12; j++) if (j !== 6) k.seg(k.pt(lam(j) * xs, 0), Dp(j), { cls: 'cons' });
      });
      k.step('tee', 'Carry the height of each circle point across to its ordinate with the T-square: the meeting point is a place on the Moon\'s path.', () => {
        for (let j = 1; j < 12; j++) if (j !== 6) { k.seg(Pc(j), Dp(j), { cls: 'cons' }); k.dot(Dp(j), { r: 0.9 }); }
      });
      k.step('pencil', 'Draw the sine wave through the points. The Moon stays within 5.1° of the ecliptic (5.3° counting the perturbations), well inside the edge of the zodiac, and crosses the line only at the nodes.', () => {
        k.curve(l => [l * xs, rc * Math.sin((l - node) * D)], [0, 360], { n: 360, cls: 'curve' });
      });
      k.note('The dots are the real Moon, from the engine, at 0 h UT every second day of January 2022. They follow the wave; the little scatter is the effect of the Sun\'s pull.', () => {
        for (let d = 0; d <= 28; d += 2) { const m = sky.moon(jd0 + d); k.dot(k.pt(m.lon * xs, m.lat * ys), { r: 0.9, fill: '#b03a2e' }); }
      });
      k.step('ruler', 'Below, lay off to the same scale of latitude (14 units to the degree) the greatest ecliptic latitude each body reaches: Mercury 5.0°, Venus 8.7°, Mars 6.8°, Jupiter 1.6°, Saturn 2.8°, Uranus 0.8°, Neptune 1.8°, the Moon 5.3°.', () => {
        const y0 = -ys * 9 - 90, x0 = 150;
        bars.forEach(([nm, v], i) => {
          const y = y0 - 28 * i;
          k.rect(x0, y - 8, x0 + v * ys, y + 8, { cls: 'cons', fill: nm === 'Moon' ? '#f0d9d6' : '#dbe7f6' });
          k.label(k.pt(x0 - 6, y), nm, 'w', { upright: true, size: 0.7, dist: 0.3 }); k.label(k.pt(x0 + v * ys + 4, y), v.toFixed(1) + '°', 'e', { upright: true, size: 0.62, dist: 0.3 });
        });
        k.seg(k.pt(x0, y0 + 14), k.pt(x0, y0 - 28 * 7 - 14), { cls: 'given' });
        k.label(k.pt(x0, y0 + 16), 'greatest latitude seen from the Earth, 1950–2050', 'ne', { upright: true, size: 0.62 });
      });
    }
  });

  /* ================================================================== diurnal circles at one latitude */
  Hyper.construction({
    id: 'cs-diurnal-circles',
    title: 'Daily circles at one latitude: circumpolar, rising and setting, never rising',
    tags: ['diurnal circle', 'circumpolar', 'rising and setting', 'declination', 'compass'],
    note: 'The meridian circle of the sphere as in the first construction, now at the latitude φ = 32° (Tel Aviv). A star\'s daily circle is perpendicular to the world axis, so in this side view every daily circle is a **chord** perpendicular to PP′ at a distance R sin δ from the centre; where it meets the horizon the star rises and sets. The limiting declinations are ±(90° − φ) = ±58°. At the end the circle of δ = +40° is folded down about its chord to show its true shape and how much of it lies above the horizon.',
    build(k) {
      const g = k.g, R = 150, phi = 32, decs = [70, 58, 40, 0, -40, -58, -70];
      const O = k.pt(0, 0), N = k.pt(R, 0), Sp = k.pt(-R, 0), Z = k.pt(0, R), Nd = k.pt(0, -R);
      const P = g.polar(O, R, phi * D), P2 = g.polar(O, R, (phi + 180) * D), Q = g.polar(O, R, (phi + 90) * D), Q2 = g.polar(O, R, (phi - 90) * D);
      const C1 = d => g.polar(O, R, (phi + 90 - d) * D), C2 = d => g.polar(O, R, (phi - 90 + d) * D);
      const kind = d => (d > 90 - phi + 1e-9 ? 'circ' : d < -(90 - phi) - 1e-9 ? 'never' : d === 90 - phi ? 'touch' : d === -(90 - phi) ? 'touchS' : 'rs');
      const cls = d => { const t = kind(d); return t === 'circ' ? 'green' : t === 'never' ? 'red' : 'curve'; };
      const u = g.dir(phi * D), t = g.dir((phi + 90) * D);
      const Fc = g.add(O, g.mul(u, R * Math.sin(40 * D)));            // the centre of the daily circle of δ = +40°
      const X40 = g.lineLine(C1(40), C2(40), Sp, N);
      const sX = g.dot(g.sub(X40, Fc), t), rho = R * Math.cos(40 * D), w = Math.sqrt(Math.max(0, rho * rho - sX * sX));
      const U = g.add(X40, g.mul(u, w)), V = g.sub(X40, g.mul(u, w));
      const H0 = Math.acos(sX / rho) * R2D;
      k.given('The meridian circle with the horizon and the vertical, as before. Latitude φ = 32°; the declinations to be drawn are +70°, +58°, +40°, 0°, −40°, −58° and −70°.', () => {
        k.circle(O, R, { cls: 'given' }); k.seg(Sp, N, { cls: 'given' }); k.seg(Nd, Z, { cls: 'cons' });
        pt(k, O, 'O', 'sw', { lo: up }); pt(k, N, 'N', 'e'); pt(k, Sp, 'S', 'w'); pt(k, Z, 'Z', 'n');
        k.label(g.lerp(Sp, O, 0.5), 'horizon', 's', up);
        k.fontScale(0.72);
        k.frame(-R * 1.35, -R * 1.2, R * 1.6, R * 1.2);
      });
      k.step('protractor', 'Lay off φ = 32° above N and draw the world axis through O (P at the top, P′ at the bottom).', () => {
        pt(k, P, 'P', 'ne'); k.seg(P2, P, { cls: 'given' }); pt(k, P2, "P′", 'sw');
        amark(k, O, N, P, 3, 'φ', 58);
      });
      k.step('square', 'Draw the perpendicular to the axis through O: the celestial equator, edge-on (δ = 0°).', () => {
        k.seg(Q2, Q, { cls: 'curve' }); k.right(O, P, Q, { r: 1.2 }); k.label(Q, 'equator', 'nw', { upright: true, size: 0.7, fill: '#0b4fa0' });
      });
      k.step('protractor', 'From the equator lay off each declination at O, towards the pole for δ > 0 and away from it for δ < 0, on both sides of the centre. Each pair of marks on the circle is the two ends of one daily circle.', () => {
        decs.forEach(d => { if (d === 0) return; k.dot(C1(d), { r: 0.8 }); k.dot(C2(d), { r: 0.8 }); k.label(C1(d), sgn(d) + '°', dirOf((phi + 90 - d)), { upright: true, size: 0.6, dist: 1.1 }); });
      });
      k.step('straightedge', 'Join each pair: the chords are the daily circles seen edge-on. Green chords stay wholly above the horizon (circumpolar), red ones wholly below (never rise), blue ones cross the horizon.', () => {
        decs.forEach(d => { if (d === 0) return; k.seg(C1(d), C2(d), { cls: cls(d) }); });
      });
      k.note('The chord of δ = +58° = 90° − φ ends exactly on the north point N: its circle touches the horizon there and the star just grazes it at lower culmination. The chord of δ = −58° ends on the south point S: that star only just peeps over the southern horizon at upper culmination. Stars farther north than +58° never set; stars farther south than −58° never rise.', () => {
        k.label(C1(70), 'circumpolar', 'ne', { upright: true, size: 0.7, fill: '#2d7a3a', dist: 1.9 });
        k.label(C2(-70), 'never rises', 'se', { upright: true, size: 0.7, fill: '#b03a2e', dist: 1.5 });
      });
      k.step('compass', 'To see how long the star of δ = +40° is up, fold its daily circle down about its chord: draw the circle with centre F (the midpoint of the chord) and radius F C₁. That is its true shape.', () => {
        k.circle(Fc, rho, { cls: 'cons' }); pt(k, Fc, 'F', 'se', { lo: up }); pt(k, X40, 'X', 'sw', { lo: up });
      });
      k.step('straightedge', 'Where the chord meets the horizon (X) draw the perpendicular to the chord. It meets the folded circle at U (rising) and V (setting).', () => {
        k.seg(U, V, { cls: 'cons' }); pt(k, U, 'U', 'ne', { lo: up }); pt(k, V, 'V', 'sw', { lo: up });
        k.seg(Fc, U, { cls: 'cons' }); k.seg(Fc, V, { cls: 'cons' });
      });
      k.step('protractor', 'Measure at F the angle from FC₁ (the star on the meridian) to FU: ' + H0.toFixed(1) + '°, i.e. ' + (H0 / 15).toFixed(1) + ' hours of hour angle. The star is above the horizon between −H₀ and +H₀: ' + (2 * H0 / 15).toFixed(1) + ' hours of the 24, the "semi-diurnal arc" being 2H₀/2 = ' + (H0 / 15).toFixed(1) + ' hours either side of the meridian.', () => {
        amark(k, Fc, U, C1(40), 2.2, 'H₀', 36, { cls: 'curve', fill: '#0b4fa0' });
      });
    }
  });

  /* ================================================================== the precession circle */
  Hyper.construction({
    id: 'cs-precession-circle',
    title: 'The pole goes round the ecliptic pole: the precession circle',
    tags: ['precession', 'pole star', 'ecliptic pole', 'Thuban', 'Vega'],
    note: 'A chart of the northern sky centred on the **north ecliptic pole K**, with the distance from K equal to 90° minus the ecliptic latitude (an equidistant polar chart). The celestial pole is at all times 23.44° from K, and it goes round K once in about 25 800 years, in the direction of decreasing longitude. Ecliptic longitude 90° is at the top and longitudes increase clockwise (the sky as seen from inside the sphere, facing north). The stars are at their J2000 places; the times are the epochs at which the pole passes closest to each star, found from the precession rate of 50.3″ a year.',
    build(k) {
      const g = k.g, sky = S(), eps = 23.4393, sc = 5, rate = 360 / 25772, J = sky.J2000;       // degrees of precession per year
      const K = k.pt(0, 0), R0 = eps * sc;
      const ang = lon => (180 - lon) * D;                                                   // longitude 90° at the top, increasing clockwise
      const pos = (lon, lat) => g.polar(K, (90 - lat) * sc, ang(lon));
      const poleAt = t => pos(90 - rate * t, 90 - eps);                                      // the celestial pole t years after AD 2000
      const stars = [['alpDra', 'Thuban'], ['alpUMi', 'Polaris'], ['gamCep', 'Errai'], ['alpCep', 'Alderamin'], ['alpCyg', 'Deneb'], ['alpLyr', 'Vega']].map(([key, nm]) => {
        const s = sky.star(key), e = sky.eqToEcl(s.ra, s.dec, J);
        let best = 1e9, tb = 0;
        for (let t = -12000; t <= 16000; t += 10) { const lp = 90 - rate * t, la = 90 - eps; const c = Math.sin(la * D) * Math.sin(e.lat * D) + Math.cos(la * D) * Math.cos(e.lat * D) * Math.cos((lp - e.lon) * D); const d = Math.acos(Math.max(-1, Math.min(1, c))) * R2D; if (d < best) { best = d; tb = t; } }
        const yr = Math.round((2000 + tb) / 100) * 100;
        return { nm, p: pos(e.lon, e.lat), t: tb, yr, text: nm + ' ' + (yr <= 0 ? Math.abs(yr) + ' BC' : 'AD ' + yr) };
      });
      const yearName = y => (y < 0 ? Math.abs(y) + ' BC' : y === 0 ? '0' : 'AD ' + y);
      k.given('The north ecliptic pole K at the centre, the line of longitude 90° drawn upwards (the direction of the June solstice point), and a scale of 10° of arc. The obliquity is ε = 23.44°.', () => {
        pt(k, K, 'K', 'sw', { lo: up });
        k.seg(K, k.pt(0, 50 * sc), { cls: 'cons' });
        const a = k.pt(-50 * sc, -50 * sc * 1.1), b = k.pt(-50 * sc + 10 * sc, -50 * sc * 1.1);
        k.seg(a, b, { cls: 'given' }); k.tick(a, k.pt(1, 0)); k.tick(b, k.pt(1, 0)); k.dim(a, b, '10°', { dist: 1.2, size: 0.8 });
        k.fontScale(0.66);
        k.frame(-50 * sc * 1.15, -50 * sc * 1.2, 50 * sc * 1.15, 50 * sc * 1.12);
      });
      k.step('compass', 'Draw circles about K every 10° of distance (radii 10°, 20° … 50°): they are the parallels of ecliptic latitude 80°, 70° … 40°.', () => {
        for (let d = 10; d <= 50; d += 10) { k.circle(K, d * sc, { cls: 'cons' }); k.label(k.pt(0, d * sc), (90 - d) + '°', 'ne', { upright: true, size: 0.5, dist: 0.5, bg: true }); }
      });
      k.step('ruler', 'On the upward line lay off the obliquity 23.44° from K: the point P₀ is the celestial pole as it is today (the Pole Star Polaris stands a little more than half a degree from it).', () => {
        const P0 = poleAt(0); pt(k, P0, 'P_0', 'ne', { lo: up });
      });
      k.step('compass', 'With centre K and radius K–P₀ draw the **precession circle**: the path of the celestial pole among the stars.', () => {
        k.circle(K, R0, { cls: 'curve' });
      });
      k.step('protractor', 'Mark the pole every 2000 years: 360° ÷ 25 772 years is 0.01397° a year, so 2000 years are 27.94°. From P₀ step 27.94° at a time, anticlockwise for the future (the pole moves towards decreasing longitude) and clockwise back into the past.', () => {
        for (let t = -6000; t <= 14000; t += 2000) { const p = poleAt(t); k.dot(p, { r: t === 0 ? 1.6 : 1.0 }); k.label(p, yearName(2000 + t).replace('AD ', ''), dirOf(Math.atan2(p.y, p.x) * R2D), { upright: true, size: 0.55, dist: 1.0, bg: true }); }
      });
      k.step('dividers', 'Plot the stars: for each, measure its ecliptic longitude from the 90° line and carry its distance from K (90° minus its ecliptic latitude) along that direction. These six stars lie close to the precession circle.', () => {
        stars.forEach(s => { k.dot(s.p, { r: 1.5 }); k.label(s.p, s.nm, dirOf(Math.atan2(s.p.y, s.p.x) * R2D + 30), { upright: true, size: 0.62, dist: 1.2, bg: true }); });
      });
      k.step('pencil', 'Mark on the circle the point where the pole passes nearest each star: Thuban was the pole star of the pyramid builders, Polaris is today, Vega will be in AD 13 800.', () => {
        stars.forEach(s => { const p = poleAt(s.t); k.seg(p, s.p, { cls: 'curve', dotted: true }); k.dot(p, { r: 1.4, fill: '#0b4fa0' }); k.label(p, s.text, dirOf(Math.atan2(p.y, p.x) * R2D - 25), { upright: true, size: 0.62, fill: '#0b4fa0', dist: 1.7, bg: true }); });
      });
      k.note('The whole circle takes about 25 800 years (the "Great Year"). The ecliptic pole K itself does not move among the stars; the equinoxes slide westwards along the ecliptic by 1° in 72 years because the equator, and with it the celestial pole, turns about K.', () => {
        k.text(0, -50 * sc * 1.0, 'longitude increases clockwise', { upright: true, size: 0.6 });
      });
    }
  });
  /*__CELESTIAL_NEXT__*/
})();
