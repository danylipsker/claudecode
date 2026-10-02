/* HYPER-PROJECTIONS · constructions/sky-history.js — ruler-and-compass constructions from the history of charting the sky.
 *
 *   sh-hipparchus-precession   the equinox slides past Spica: Hipparchus' comparison of two observations, drawn on the ecliptic
 *   sh-astrolabe-parts         the rete of an astrolabe: the ecliptic ring found with the compass, the zodiac points and star pointers,
 *                              with the other parts (mater, plate, rule, pin) set on the figure
 *   sh-durer-grid              the polar grid of Dürer's star maps of 1515: ecliptic pole at the centre, the ecliptic as a circle,
 *                              the celestial equator as an off-centre curve
 *   sh-bayer-trapezoid         a chart plate in the trapezoidal form of Bayer's Uranometria, with the Plough plotted on it
 * Every point is computed with k.g; star places and dates come from Hyper.sky (celestial.js). Angles are degrees until k.g.
 */
(function () {
  'use strict';
  const D = Math.PI / 180, R2D = 180 / Math.PI;
  const rev = x => ((x % 360) + 360) % 360;
  const DIRN = ['e', 'ne', 'n', 'nw', 'w', 'sw', 's', 'se'];
  const dirOf = ang => DIRN[Math.round(rev(ang) / 45) % 8];
  const up = { upright: true, size: 0.78 };
  const MINUS = '−';
  const sgn = d => (d < 0 ? MINUS : '') + Math.abs(d);
  const S = () => Hyper.sky;
  const RATE = 360 / 25772;                                              // degrees of precession a year
  /* a dot with its label; the last argument styles the label */
  const pt = (k, p, label, at, o) => k.point(p, label, { at: at || 'ne', lo: (o && o.lo) || o || {} });

  /* ================================================================== Hipparchus and Spica */
  Hyper.construction({
    id: 'sh-hipparchus-precession',
    title: 'Hipparchus finds the precession: the equinox slides past Spica',
    tags: ['Hipparchus', 'precession', 'Spica', 'ecliptic', 'ruler', 'dividers'],
    note: 'The ecliptic is drawn as a straight line with the star Spica fixed at the origin and the longitude counted in degrees east of it (1° = 36 units; the figure is a strip of the ecliptic, not a map). The equinox is not fixed to the stars: it moves **westwards** along the ecliptic, towards and past Spica. About 280 BC Timocharis recorded Spica 8° before the autumn equinox, i.e. the equinox point 8° east of the star; about 130 BC Hipparchus found 6°. The two readings are as Ptolemy reports them in the Almagest, rounded to whole degrees. The later positions are computed from the modern rate of 50.29″ a year.',
    build(k) {
      const g = k.g, u = 36, X = d => d * u;
      const eq = yr => (180 - (203.8425 + RATE * (yr - 2000)));                // degrees east of Spica of the autumn equinox in year yr (negative = west)
      const e137 = eq(137), e2000 = eq(2000);
      const lane = (x, y, text, o) => { k.seg(k.pt(x, 26), k.pt(x, y - 6), { cls: 'aux' }); k.text(x, y, text, Object.assign({ upright: true, size: 0.72, bg: true }, o || {})); };
      k.given('The ecliptic as a horizontal line graduated in degrees (1° = 36 units), with Spica at the origin, east to the right and west to the left. The length of 2° is marked on a spare scale (take it with the dividers).', () => {
        const a = k.pt(X(-3), 0), b = k.pt(X(10.5), 0);
        k.seg(a, b, { cls: 'given' });
        for (let d = -3; d <= 10; d++) { const p = k.pt(X(d), 0); k.tick(p, k.pt(1, 0), { size: 1.1 }); k.label(p, sgn(d) + '°', 's', { upright: true, size: 0.62, dist: 0.9 }); }
        k.dot(k.pt(0, 0), { r: 2.4 }); k.label(k.pt(0, 0), 'Spica', 'n', { upright: true, size: 0.85, dist: 1.4 });
        k.label(a, 'west', 'w', { upright: true, size: 0.7, dist: 1.1 }); k.label(b, 'east', 'e', { upright: true, size: 0.7, dist: 1.1 });
        const s0 = k.pt(X(-3), -112), s1 = k.pt(X(-1), -112);
        k.seg(s0, s1, { cls: 'given' }); k.tick(s0, k.pt(1, 0)); k.tick(s1, k.pt(1, 0)); k.dim(s0, s1, '2°', { dist: 1.1, size: 0.8 });
        k.fontScale(0.78);
        k.frame(X(-3.6), -136, X(11.6), 118);
      });
      k.step('ruler', 'Timocharis, about 280 BC: the autumn equinox point lay 8° east of Spica. Lay off 8° east of the origin and mark the equinox E₁.', () => {
        pt(k, k.pt(X(8), 0), 'E_1', 'ne', up); lane(X(8), 62, 'Timocharis, c. 280 BC');
      });
      k.step('ruler', 'Hipparchus, about 130 BC: the equinox lay 6° east of Spica. Lay off 6° and mark E₂. In about 150 years the equinox has moved 2° west.', () => {
        pt(k, k.pt(X(6), 0), 'E_2', 'ne', up); lane(X(6), 92, 'Hipparchus, c. 130 BC');
        k.seg(k.pt(X(8), 24), k.pt(X(6), 24), { cls: 'curve', arrow: 'end' }); k.label(k.pt(X(7), 24), '2° in 150 yr', 'n', { upright: true, size: 0.6, fill: '#0b4fa0' });
      });
      k.step('dividers', 'Carry the 2° interval west from E₂ to see where the motion leads: 4° east of Spica around AD 20; another 2° around AD 170, and at this rate (about 1° in 75 years) the equinox reaches Spica about AD 320.', () => {
        pt(k, k.pt(X(4), 0), 'E_3', 'ne', up); lane(X(4), 62, 'extended: about AD 20');
        k.arc3(k.pt(X(5), -4), k.pt(X(6), 0), k.pt(X(4), 0), { cls: 'cons' });
      });
      k.step('ruler', 'The actual positions, from the modern rate of 1° in 71.6 years: the equinox lay ' + e137.toFixed(1) + '° east of Spica in AD 137, the epoch of Ptolemy\'s catalogue, and it now lies ' + Math.abs(e2000).toFixed(1) + '° west of it (off the scale, to the left).', () => {
        pt(k, k.pt(X(e137), 0), 'E_4', 'ne', up); lane(X(e137), 92, 'Ptolemy\'s epoch, AD 137');
        k.seg(k.pt(X(-0.8), -50), k.pt(X(-2.9), -50), { cls: 'curve', arrow: 'end' }); k.label(k.pt(X(-0.6), -50), 'AD 2000: ' + Math.abs(e2000).toFixed(1) + '° west', 'e', { upright: true, size: 0.6, fill: '#0b4fa0', dist: 0.6 });
      });
      k.step('pencil', 'Line in the track of the equinox as a heavy arrow pointing west: the star stays and the equinox, which is where the Sun crosses the equator, goes all the way round the ecliptic in about 25 800 years.', () => {
        k.seg(k.pt(X(8.6), -80), k.pt(X(-2.6), -80), { cls: 'thick', arrow: 'end' });
        k.label(k.pt(X(3), -80), 'the equinox moves west', 's', { upright: true, size: 0.75, dist: 1.1 });
      });
      k.note('Hipparchus could not tell whether the stars or the equinox moved, but he saw that all the stars he compared shifted together with respect to the equinox, and stated a rate of at least 1° per century. The truth, 1.4° per century, makes a full turn in 25 770 years.', () => {
        k.label(k.pt(X(-3.4), 112), '1° per 71.6 years: 360° in 25 770 years', 'e', { upright: true, size: 0.8, fill: '#0b4fa0' });
      });
    }
  });

  /* ================================================================== the rete of an astrolabe */
  Hyper.construction({
    id: 'sh-astrolabe-parts',
    title: 'The rete of an astrolabe: the ecliptic ring and the star pointers',
    tags: ['astrolabe', 'rete', 'ecliptic ring', 'stereographic', 'compass', 'mater', 'rule'],
    note: 'The astrolabe is the sky in stereographic projection from the south celestial pole onto the plane of the equator (see the plate construction on the horizon page). The **plate** is engraved with the lines fixed to the observer — horizon, almucantars — and the **rete** (the "net") with the lines fixed to the stars — the ecliptic ring and the pointers of the bright stars. The rete turns over the plate once a sidereal day. Here the plate\'s tropics are given and the rete is drawn: the ring is found with the compass alone because it is a circle that touches the two tropics, and passes through the ends of the east–west line. R = 100 units, latitude of Baghdad 33.3° (it affects only the plate, shown dashed). Right ascension is laid off anticlockwise from the right.',
    build(k) {
      const g = k.g, R = 100, eps = 23.4393, phi = 33.31, sky = S();
      const rOf = dec => R * Math.tan((90 - dec) * D / 2), rCan = rOf(eps), rCap = rOf(-eps);
      const P = k.pt(0, 0), A = k.pt(0, rCan), B = k.pt(0, -rCap), Cc = g.mid(A, B), rho = g.dist(Cc, A);
      const M = (() => { const d = g.dist(A, B); return g.circleCircle(A, 0.65 * d, B, 0.65 * d); })();
      const W = pt2 => g.polar(P, rOf(pt2.dec), pt2.ra * D);                                          // a point of the plate: right ascension anticlockwise from the right
      const signs = []; for (let j = 0; j < 12; j++) { const e = sky.eclToEq(30 * j, 0, sky.J2000); signs.push({ j, ra: e.ra, dec: e.dec, p: W(e) }); }
      const SG = ['Ari', 'Tau', 'Gem', 'Cnc', 'Leo', 'Vir', 'Lib', 'Sco', 'Sgr', 'Cap', 'Aqr', 'Psc'];
      const stars = [['alpLyr', 'Vega'], ['alpBoo', 'Arcturus'], ['alpAur', 'Capella'], ['alpCMa', 'Sirius'], ['alpAql', 'Altair']].map(([key, nm]) => { const s = sky.star(key); return { nm, p: W({ ra: s.ra, dec: s.dec }), ra: s.ra, dec: s.dec }; });
      k.given('The plate: the equator (radius R), the tropic of Cancer (inside it) and the tropic of Capricorn (the plate\'s edge), with the pole P at the centre and the meridian vertical. The tropics\' radii are R tan 33.3° = 65.6 and R tan 56.7° = 152.7.', () => {
        k.circle(P, R, { cls: 'given' }); k.circle(P, rCan, { cls: 'given' }); k.circle(P, rCap, { cls: 'given' });
        k.seg(k.pt(0, -rCap * 1.04), k.pt(0, rCap * 1.04), { cls: 'cons' }); k.seg(k.pt(-rCap * 1.04, 0), k.pt(rCap * 1.04, 0), { cls: 'cons' });
        pt(k, P, 'P', 'sw', up);
        k.label(g.polar(P, rCan, 135 * D), 'Cancer', 'nw', { upright: true, size: 0.62, dist: 0.8 }); k.label(g.polar(P, R, 150 * D), 'equator', 'nw', { upright: true, size: 0.62, dist: 0.8 }); k.label(g.polar(P, rCap, 135 * D), 'Capricorn', 'nw', { upright: true, size: 0.62, dist: 0.8 });
        // the horizon of the latitude, dashed: the plate's own line
        const cH = R / Math.tan(phi * D), rH = R / Math.sin(phi * D);
        { const Ch = k.pt(0, cH), X2 = g.circleCircle(P, rCap, Ch, rH).filter(p => p.x > 0)[0]; if (X2) { const ar = g.angleOf(g.sub(X2, Ch)); k.arc(Ch, rH, -Math.PI - ar, ar, { cls: 'aux', dash: true }); k.label(g.polar(Ch, rH, -100 * D), 'horizon', 'sw', { upright: true, size: 0.62, dist: 0.8 }); } }
        k.fontScale(0.8);
        k.frame(-rCap * 1.5, -rCap * 1.45, rCap * 1.5, rCap * 1.45);
      });
      k.step('dividers', 'Carry the radius of the tropic of Cancer up the meridian from P to A, and the radius of the tropic of Capricorn down to B. A and B are the points where the ecliptic touches the tropics: the solstices.', () => {
        pt(k, A, 'A', 'ne', up); pt(k, B, 'B', 'se', up);
      });
      k.step('compass', 'Bisect AB: with the compass open wider than half of AB, strike an arc about A and an arc about B on each side; they cross at M₁ and M₂.', () => {
        const d = g.dist(A, B), r = 0.65 * d;
        M.forEach((m, i) => { pt(k, m, 'M_' + (i + 1), i ? 'w' : 'e', up); });
        [A, B].forEach(c => M.forEach(m => { const t = g.angleOf(g.sub(m, c)); k.arc(c, r, t - 0.22, t + 0.22, { cls: 'cons' }); }));
      });
      k.step('straightedge', 'Join M₁ to M₂: it cuts AB at C, the centre of the ecliptic ring. (C lies below P, because the ring is bigger on the Capricorn side.)', () => {
        k.seg(M[0], M[1], { cls: 'cons' }); pt(k, Cc, 'C', 'ne', up);
      });
      k.step('compass', 'With centre C and radius CA draw the **ecliptic ring**. It touches the two tropics at A and B and, as the construction guarantees, passes through the ends E and W of the east–west diameter of the equator.', () => {
        k.circle(Cc, rho, { cls: 'curve' });
        pt(k, k.pt(R, 0), 'E', 'se', up); pt(k, k.pt(-R, 0), 'W', 'sw', up);
        k.label(g.polar(Cc, rho, 200 * D), 'ecliptic', 'w', { upright: true, size: 0.7, fill: '#0b4fa0', dist: 0.8 });
      });
      k.step('protractor', 'The twelve points of the ring where the Sun enters the signs: for λ = 0°, 30°, 60° … take from a table the right ascension α and declination δ of the point; lay α off with the protractor and the radius R tan((90° − δ)/2) with the dividers. The points fall on the ring; join their marks with short strokes.', () => {
        signs.forEach(s => { k.dot(s.p, { r: 1.1 }); k.seg(g.polar(s.p, 4, g.angleOf(g.sub(s.p, Cc))), g.polar(s.p, -4, g.angleOf(g.sub(s.p, Cc))), { cls: 'cons' }); });
        signs.forEach(s => k.label(s.p, SG[s.j], dirOf(g.angleOf(g.sub(s.p, Cc)) * R2D), { upright: true, size: 0.55, dist: 1.2 }));
      });
      k.step('ruler', 'The star pointers: for each bright star lay off its right ascension with the protractor and its distance from the pole with the dividers, in the same way (Vega 18 h 37 m +38.8°, Arcturus 14 h 16 m +19.2°, Capella 5 h 17 m +46.0°, Sirius 6 h 45 m −16.7°, Altair 19 h 51 m +8.9°). Each pointer is a small tongue of brass ending at the star.', () => {
        stars.forEach(s => { k.dot(s.p, { r: 1.5 }); k.label(s.p, s.nm, dirOf(g.angleOf(s.p) * R2D + 25), { upright: true, size: 0.62, dist: 1.1 }); });
      });
      k.note('The rest of the instrument is added around this: the **mater** (the hollow body) with its raised rim, the **limb** graduated in hours or degrees, and the **throne** at the top; the **plate** sits in the mater and the rete over it; the **rule** turns on the central **pin**, held by the **horse**; on the back, the **alidade** with its two sights.', () => {
        const rL = rCap * 1.13, rM = rCap * 1.22;
        k.circle(P, rL, { cls: 'aux' }); k.circle(P, rM, { cls: 'aux' });
        for (let h = 0; h < 24; h++) { const a = (90 - h * 15) * D; k.seg(g.polar(P, rL, a), g.polar(P, rL + 5, a), { cls: 'aux' }); }
        k.seg(P, g.polar(P, rM, 35 * D), { cls: 'cons', dash: true });
        k.label(g.polar(P, rM, 35 * D), 'rule', 'e', { upright: true, size: 0.7 }); k.label(g.polar(P, rM, 100 * D), 'mater', 'nw', { upright: true, size: 0.7 });
        k.label(g.polar(P, rL, -60 * D), 'limb', 'se', { upright: true, size: 0.7 }); k.label(g.polar(P, rCap * 0.55, 215 * D), 'rete', 'sw', { upright: true, size: 0.7, fill: '#0b4fa0' });
        k.label(g.polar(P, rCap * 0.98, 290 * D), 'plate', 'se', { upright: true, size: 0.7, dist: 1.4 }); k.label(P, 'pin', 'nw', { upright: true, size: 0.6, dist: 1.1 });
      });
    }
  });

  /* ================================================================== Dürer's polar grid */
  Hyper.construction({
    id: 'sh-durer-grid',
    title: 'The grid of Dürer\'s northern star map (1515)',
    tags: ['Dürer', 'star map', 'ecliptic pole', 'polar projection', 'dividers', 'protractor'],
    note: 'Dürer\'s two charts of 1515 each show a hemisphere of the sky centred on an **ecliptic pole**. The layout is usually described as a polar (azimuthal) projection in which the distance from the pole is proportional to the angular distance, an **equidistant** grid: the ecliptic is a circle, the twelve signs are 30° sectors, and the celestial equator is a curve off to one side because the celestial pole is 23.44° from the ecliptic pole. This construction draws that grid for the northern chart (the figures on the originals are drawn as on a globe, seen from outside; the longitude here increases anticlockwise, the same view). The stars are at their J2000 places moved back to 1515 by 6.8° of longitude for precession.',
    build(k) {
      const g = k.g, sky = S(), s = 2.4, ring = b => (90 - b) * s, rMax = ring(-30);
      const K = k.pt(0, 0), at = (lam, beta) => g.polar(K, ring(beta), lam * D);
      const SIGN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricornus', 'Aquarius', 'Pisces'];
      const eqPts = []; for (let ra = 0; ra < 360; ra += 30) { const e = sky.eqToEcl(ra, 0, sky.J2000); eqPts.push({ ra, lam: e.lon, beta: e.lat, p: at(e.lon, e.lat) }); }
      const shift = RATE * (2000 - 1515);
      const stars = [['alpUMi', 'Polaris'], ['alpLyr', 'Vega'], ['alpUMa', 'Dubhe'], ['alpBoo', 'Arcturus']].map(([key, nm]) => { const o = sky.star(key), e = sky.eqToEcl(o.ra, o.dec, sky.J2000); return { nm, p: at(e.lon - shift, e.lat) }; });
      const Np = at(90, 90 - 23.4393);
      k.given('The ecliptic pole K at the centre; the 0° line of ecliptic longitude drawn to the right; a scale of 10° of arc (here 24 units).', () => {
        pt(k, K, 'K', 'sw', up);
        k.seg(K, k.pt(rMax, 0), { cls: 'cons' });
        const a = k.pt(-rMax, -rMax * 1.08), b = k.pt(-rMax + 10 * s, -rMax * 1.08);
        k.seg(a, b, { cls: 'given' }); k.tick(a, k.pt(1, 0)); k.tick(b, k.pt(1, 0)); k.dim(a, b, '10°', { dist: 1.2, size: 0.8 });
        k.fontScale(0.66);
        k.frame(-rMax * 1.22, -rMax * 1.18, rMax * 1.22, rMax * 1.18);
      });
      k.step('dividers', 'Step the 10° interval off along the 0° line: nine steps reach the ecliptic (latitude 0°, 90° from the pole), three more the outer rim at −30° where the zodiac figures stand.', () => {
        for (let b = 80; b >= -30; b -= 10) { const p = k.pt(ring(b), 0); k.dot(p, { r: 0.6 }); k.label(p, sgn(b) + '°', 's', { upright: true, size: 0.5, dist: 0.7 }); }
      });
      k.step('compass', 'With centre K draw the circle through each mark: the parallels of ecliptic latitude. The ring at 0° is the **ecliptic**; draw it heavier. The outer circle at −30° is the rim of the chart.', () => {
        for (let b = 80; b >= -30; b -= 10) k.circle(K, ring(b), { cls: b === 0 ? 'curve' : 'cons' });
      });
      k.step('protractor', 'At K lay off 30° at a time from the 0° line, anticlockwise: twelve radii. They divide the ecliptic into the twelve signs, Aries first.', () => {
        for (let j = 0; j < 12; j++) k.seg(K, g.polar(K, rMax, 30 * j * D), { cls: 'cons' });
        for (let j = 0; j < 12; j++) k.label(g.polar(K, rMax * 1.0, (30 * j + 15) * D), SIGN[j], dirOf(30 * j + 15), { upright: true, size: 0.58, dist: 0.9 });
      });
      k.step('protractor', 'The celestial equator: for each 2 h of right ascension take its ecliptic longitude and latitude from a table (they follow tan λ = tan α / cos ε); lay the longitude off with the protractor and the distance 90° − β from K with the dividers. Twelve points.', () => {
        eqPts.forEach(e => k.dot(e.p, { r: 1.1 }));
        pt(k, eqPts[0].p, '0 h', 'se', { upright: true, size: 0.55 }); pt(k, eqPts[3].p, '6 h', 'n', { upright: true, size: 0.55 }); pt(k, eqPts[6].p, '12 h', 'nw', { upright: true, size: 0.55 }); pt(k, eqPts[9].p, '18 h', 's', { upright: true, size: 0.55 });
      });
      k.step('pencil', 'Draw the smooth closed curve through the points: the **celestial equator**. It is not a circle about K: it crosses the ecliptic at the equinoxes (λ = 0° and 180°), lies 23.44° outside the ecliptic at λ = 90° and 23.44° inside it at λ = 270°. Mark the north celestial pole, 23.44° from K towards λ = 90°.', () => {
        const pts = eqPts.map(e => e.p); pts.push(eqPts[0].p);
        k.smooth(pts, { cls: 'curve', n: 20 });
        pt(k, Np, 'celestial pole', 'ne', { upright: true, size: 0.62 });
      });
      k.step('protractor', 'Plot some stars the same way (longitude with the protractor, 90° − latitude with the dividers): Polaris, Vega, Dubhe, Arcturus. Dürer\'s artist and astronomer did this for 1022 stars of Ptolemy\'s catalogue.', () => {
        stars.forEach(o => { k.dot(o.p, { r: 1.6 }); k.label(o.p, o.nm, dirOf(g.angleOf(o.p) * R2D + 30), { upright: true, size: 0.6, dist: 1.2 }); });
      });
      k.note('Near the pole (the centre) the chart is nearly true; towards the ecliptic and beyond, east–west lengths are stretched by θ/sin θ (θ = angular distance from K), already 57 % at the ecliptic. That is the price of an equidistant polar chart; the figures of the zodiac in the rim are drawn larger to match.', () => {
        k.label(g.polar(K, ring(0), 225 * D), 'ecliptic', 'sw', { upright: true, size: 0.62, fill: '#0b4fa0', dist: 1.0 });
      });
    }
  });

  /* ================================================================== Bayer's trapezoid */
  Hyper.construction({
    id: 'sh-bayer-trapezoid',
    title: 'A star-chart plate in the trapezoidal form of Bayer\'s Uranometria',
    tags: ['Bayer', 'Uranometria', 'trapezoid', 'star atlas', 'Plough', 'Ursa Major', 'dividers'],
    note: 'Bayer\'s *Uranometria* (1603) drew each constellation on a plate with equally spaced horizontal parallels of declination and straight meridians that meet at the pole above the plate: a **trapezoid**. Here is such a plate for Ursa Major, with the meridians drawn through the apex T (the pole) and true scale on the middle parallel (declination 50°). Right ascension increases to the left, as on a star atlas. One unit is 1/6 of a degree of arc on the meridian.',
    build(k) {
      const g = k.g, sky = S(), s = 6, d0 = 50, a0 = 11.5 * 15, kk = Math.cos(d0 * D);
      const y = dec => -(90 - dec) * s;                                                // the parallels are equally spaced
      const xOf = (ra, dec) => -(ra - a0) * kk * ((90 - dec) / (90 - d0)) * s;         // true scale on the parallel of declination d0, widening downwards
      const T = k.pt(0, 0), decs = [70, 60, 50, 40, 30], halfH = 2.5;
      const P = (ra, dec) => k.pt(xOf(ra, dec), y(dec));
      const dip = ['alpUMa', 'betUMa', 'gamUMa', 'delUMa', 'epsUMa', 'zetUMa', 'etaUMa'].map(key => sky.star(key));
      k.given('The pole T at the top and the central meridian (right ascension 11 h 30 m) dropped from it, with the scale of 10° of arc.', () => {
        pt(k, T, 'T (pole)', 'ne', up);
        k.seg(T, k.pt(0, y(25)), { cls: 'cons' });
        const a = k.pt(-196, y(70)), b = k.pt(-196, y(60));
        k.seg(a, b, { cls: 'given' }); k.tick(a, k.pt(0, 1)); k.tick(b, k.pt(0, 1)); k.dim(a, b, '10°', { side: 'right', dist: 1.2, size: 0.75 });
        k.fontScale(0.7);
        k.frame(-210, y(24), 210, 14);
      });
      k.step('dividers', 'Step the 10° interval down the meridian from T: the parallels of declination 80°, 70° … 30°, equally spaced because the vertical scale is the same everywhere.', () => {
        for (let d = 80; d >= 30; d -= 10) { const p = k.pt(0, y(d)); k.dot(p, { r: 0.7 }); k.label(p, d + '°', 'e', { upright: true, size: 0.55, dist: 0.5 }); }
      });
      k.step('tee', 'With the T-square draw the parallels of declination 70° to 30° as horizontal lines across the sheet.', () => {
        decs.forEach(d => k.seg(k.pt(-200, y(d)), k.pt(200, y(d)), { cls: 'cons' }));
      });
      k.step('ruler', 'On the middle parallel (50°) lay off the real length of 2.5 hours of right ascension either side of the centre: one hour is 15° cos 50° = 9.64° of arc, so 2.5 hours are 24.1° each way (145 units). Mark L (right ascension 14 h) and R (9 h).', () => {
        const L = P(a0 + halfH * 15, d0), Rr = P(a0 - halfH * 15, d0);
        pt(k, L, 'L', 'nw', up); pt(k, Rr, 'R', 'ne', up);
      });
      k.step('straightedge', 'Draw the two edges of the plate: straight lines from T through L and through R, down to the parallel of 30°. The sheet is a trapezoid, narrow at the top.', () => {
        const L = P(a0 + halfH * 15, d0), Rr = P(a0 - halfH * 15, d0);
        k.seg(T, P(a0 + halfH * 15, 30), { cls: 'thick' }); k.seg(T, P(a0 - halfH * 15, 30), { cls: 'thick' });
        k.seg(P(a0 + halfH * 15, 70), P(a0 - halfH * 15, 70), { cls: 'thick' }); k.seg(P(a0 + halfH * 15, 30), P(a0 - halfH * 15, 30), { cls: 'thick' });
        void L; void Rr;
      });
      k.step('dividers', 'On each parallel divide the stretch between the edges into five equal parts with the dividers (one hour each). The widths grow towards the bottom.', () => {
        decs.forEach(d => { for (let h = -2; h <= 3; h++) k.dot(P(a0 + (h - 0.5) * 15, d), { r: 0.6 }); });
      });
      k.step('straightedge', 'Join the matching division points with straight lines through T: the meridians of 10 h, 11 h, 12 h and 13 h are straight and meet at the pole.', () => {
        [-1.5, -0.5, 0.5, 1.5].forEach(h => k.seg(T, P(a0 + h * 15, 30), { cls: 'cons' }));
        [-1.5, -0.5, 0.5, 1.5].forEach(h => k.label(P(a0 + h * 15, 30), String(11.5 + h) + ' h', 's', { upright: true, size: 0.55, dist: 0.6 }));
      });
      k.step('pencil', 'Plot the seven stars of the Plough from their right ascension and declination: Dubhe 11 h 04 m +61.7°, Merak 11 h 02 m +56.4°, Phecda 11 h 54 m +53.7°, Megrez 12 h 15 m +57.0°, Alioth 12 h 54 m +56.0°, Mizar 13 h 24 m +54.9°, Alkaid 13 h 47 m +49.3°. Join them in the order of the figure.', () => {
        const pts = dip.map(o => P(o.ra, o.dec));
        pts.forEach((p, i) => { k.dot(p, { r: 1.6 }); k.label(p, ['Dubhe', 'Merak', 'Phecda', 'Megrez', 'Alioth', 'Mizar', 'Alkaid'][i], i === 0 ? 'ne' : i === 1 ? 'se' : i < 4 ? 'sw' : 'nw', { upright: true, size: 0.55, dist: 1.1 }); });
        [[0, 1], [1, 2], [2, 3], [3, 0], [3, 4], [4, 5], [5, 6]].forEach(([i, j]) => k.seg(pts[i], pts[j], { cls: 'thick' }));
      });
      k.note('How true is the plate? On a sphere a degree of right ascension at declination δ is cos δ of a degree of arc, but here the width is proportional to (90° − δ). At the middle parallel the two agree; at declination 70° the plate is 5 % too narrow, at 30° it is 13 % too wide. The dots are where the width ought to be. For a single constellation this is good enough; for a whole sky it is why later atlases use smaller plates and better projections.', () => {
        [70, 60, 40, 30].forEach(d => { const half = halfH * 15 * Math.cos(d * D) * s; k.dot(k.pt(-half, y(d)), { r: 1.1, fill: '#b03a2e' }); k.dot(k.pt(half, y(d)), { r: 1.1, fill: '#b03a2e' }); });
      });
    }
  });
})();
