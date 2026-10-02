/* HYPER-PROJECTIONS · constructions/sky-maps-and-instruments.js
 *
 *   sm-horizon-view-grid      the camera's sky: altitude and azimuth lines in a rectilinear picture, from a tangent table
 *   sm-all-sky-grid           the all-sky (azimuthal equidistant) grid: rings by dividers, azimuths by protractor, Orion and the Plough
 *   sm-planisphere-wheel      the star wheel: polar stereographic, declination circles by the inscribed-angle method, the ecliptic, stars
 *   sm-planisphere-mask       the horizon mask for one latitude: the horizon circle, the zenith, altitude circles
 *   sm-astrolabe-rete         the rete of an astrolabe over its plate: ecliptic ring, zodiac points, star pointers
 *   sm-polar-star-chart       a polar (azimuthal equidistant) star chart to declination -30 with the Plough and the brightest stars
 *   sm-hammer-grid            the Hammer all-sky grid in galactic coordinates, by the auxiliary-circle ellipse and a table
 *   sm-sun-path-diagram       the stereographic sun-path diagram for one latitude, point by point
 *   sm-analemma               the figure of eight from the fortnightly table of declination and equation of time
 *   sm-horizontal-sundial     the horizontal sundial by the classical construction from the equatorial dial
 *   sm-equatorial-dial        the equatorial dial: face and elevation
 *   sm-armillary-rings        the armillary sphere: great circles and tropics as ellipses, by the auxiliary-circle method
 *   sm-dome-master            the dome master and the dome: equal angles on the dome, equal steps on the master
 *
 * Every figure takes its numbers from the sky engine (kit.sky) or from the formula of the page, so the table in the
 * notes is exactly what the drawing uses. Orientation: charts of the sky are drawn as seen looking up (north up,
 * east on the left); the sun-path diagram is a plan (north up, east on the right); the astrolabe is the view from
 * outside the celestial sphere, zenith up (east still on the left).
 */
(function () {
  'use strict';
  const PI = Math.PI, D2R = PI / 180, R2D = 180 / PI;
  const tan = Math.tan, sin = Math.sin, cos = Math.cos, sqrt = Math.sqrt, abs = Math.abs, atan2 = Math.atan2, asin = Math.asin, acos = Math.acos;
  const SKY = () => Hyper.sky;
  /* Horizon coordinates with the azimuth measured from north through EAST. (kit.sky's eqToHor/horToEq return the azimuth
     mirrored east-west for a body west of the meridian: a star with hour angle +6h comes out in the east. Altitude, hour
     angle and everything else are right. These two functions use the standard formulas, so the pictures stay correct
     whether or not the engine is later corrected.) */
  const wrap360 = x => ((x % 360) + 360) % 360;
  function eqToHor(ra, dec, lst, lat) {
    const ha = (lst - ra) * D2R, d = dec * D2R, f = lat * D2R;
    const x = cos(ha) * cos(d), y = sin(ha) * cos(d), z = sin(d);
    const xh = x * sin(f) - z * cos(f), yh = y, zh = x * cos(f) + z * sin(f);
    return { alt: asin(Math.max(-1, Math.min(1, zh))) * R2D, az: wrap360(atan2(-yh, -xh) * R2D), ha: ((lst - ra + 540) % 360 + 360) % 360 - 180 };
  }
  function horToEq(alt, az, lst, lat) {
    const a = alt * D2R, A = az * D2R, f = lat * D2R;
    const xh = -cos(a) * cos(A), yh = -cos(a) * sin(A), zh = sin(a);
    const x = xh * sin(f) + zh * cos(f), y = yh, z = -xh * cos(f) + zh * sin(f);
    return { ra: wrap360(lst - atan2(y, x) * R2D), dec: asin(Math.max(-1, Math.min(1, z))) * R2D };
  }
  /* number to text with a true minus sign */
  const fx = (x, n) => { n = n == null ? 1 : n; const s = Math.abs(x).toFixed(n); return (x < 0 && Number(s) !== 0 ? '−' : '') + s; };
  const hm = h => { const t = ((h % 24) + 24) % 24, hh = Math.floor(t), m = Math.round((t - hh) * 60); return (m === 60 ? hh + 1 : hh) + 'h' + (m === 60 ? '00' : String(m).padStart(2, '0')); };
  /* the radius on a polar stereographic chart of radius R (the equator) for polar distance p (degrees) */
  const sr = (R, p) => R * tan(p * D2R / 2);
  /* a point at distance r from C, at angle a (degrees) measured clockwise from "up" */
  const clk = (C, r, a) => ({ x: C.x + r * sin(a * D2R), y: C.y + r * cos(a * D2R) });
  /* a point at distance r from C along the direction a (degrees, counter-clockwise from the x axis) */
  const ccw = (C, r, a) => ({ x: C.x + r * cos(a * D2R), y: C.y + r * sin(a * D2R) });
  const mdTable = (head, rows) => '\n\n| ' + head.join(' | ') + ' |\n|' + head.map(() => '---').join('|') + '|\n' + rows.map(r => '| ' + r.join(' | ') + ' |').join('\n') + '\n';

  /* ================================================================= the camera's sky */
  Hyper.construction({
    id: 'sm-horizon-view-grid',
    title: 'The camera\'s sky: altitude and azimuth lines in a rectilinear picture',
    tags: ['gnomonic', 'camera', 'horizon', 'tangent table'],
    note: 'A camera is a central projection: a direction at angle a to the right of the axis lands at $x = f\\tan a$, and at altitude $h$ it lands at $y = f\\tan h/\\cos a$ — the height is the length of the line from the eye to the foot of the vertical ($f/\\cos a$) times $\\tan h$, which is why the altitude lines bow upwards away from the centre. Each altitude line is a hyperbola, $y^2 - x^2\\tan^2 h = f^2\\tan^2 h$. The lower half of a level picture is the ground, the mirror image of what is drawn here. Tilt the camera up and the vertical azimuth lines lean together towards the zenith, the third vanishing point.',
    build(k) {
      const f = 100, HW = f * tan(40 * D2R), HH = 67;
      const O = k.pt(0, 0);
      const azs = [-40, -30, -20, -10, 0, 10, 20, 30, 40];
      const X = a => f * tan(a * D2R);
      const Yh = (h, a) => f * tan(h * D2R) / cos(a * D2R);
      k.given('The picture frame with the principal point O at its centre, and the focal length f = 100 (the distance from the eye to the picture: take it with the dividers). The camera is level and looks due south, so the horizon passes through O and the frame spans ±40° of azimuth.', () => {
        k.rect(-HW, -HH, HW, HH, { cls: 'given' });
        k.point(O, 'O', 'nw');
        const gA = k.pt(-HW + 6, -HH - 24), gB = k.pt(-HW + 6 + f, -HH - 24);
        k.seg(gA, gB, { cls: 'given' }); k.tick(gA, k.pt(1, 0)); k.tick(gB, k.pt(1, 0)); k.dim(gA, gB, 'f = 100', { dist: 1.3 });
        k.frame(-HW - 8, -HH - 42, HW + 30, HH + 14);
      });
      k.step('tee', 'Draw the horizon through O with the T-square, and the vertical through O with the set square against it: a level camera draws the horizon (altitude 0°) as a straight line and the azimuth 180° as a vertical.', () => {
        k.seg(k.pt(-HW, 0), k.pt(HW, 0), { cls: 'thick' });
        k.seg(k.pt(0, -HH), k.pt(0, HH), { cls: 'cons' });
        k.label(k.pt(HW, 0), 'horizon', 'e', { upright: true, size: 0.75, dist: 0.8 });
      });
      k.step('ruler', 'On the horizon lay off x = f tan a from O on both sides: a = 10°, 20°, 30°, 40° gives 17.6, 36.4, 57.7 and 83.9. The marks get wider apart: a degree of sky is stretched towards the edge.', () => {
        azs.forEach(a => { if (a !== 0) k.point(k.pt(X(a), 0), '', 'n'); });
      });
      k.step('square', 'Through each mark draw a vertical with the set square. These are the azimuth lines, 140° to 220°: a vertical great circle through the zenith is a vertical line for a level camera.', () => {
        azs.forEach(a => { if (a !== 0) k.seg(k.pt(X(a), -HH), k.pt(X(a), HH), { cls: 'cons' }); });
        azs.forEach(a => k.label(k.pt(X(a), -HH), String(180 + a) + '°', 's', { upright: true, size: 0.7 }));
      });
      [10, 20, 30].forEach(h => {
        k.step('ruler', 'Altitude ' + h + '°: on each vertical lay off the height y = f tan ' + h + '° / cos a above the horizon. On the central line it is ' + fx(Yh(h, 0), 1) + '; it grows towards the edges, to ' + fx(Yh(h, 20), 1) + ' at a = 20°' + (Yh(h, 40) > HH ? ' (stop where the frame ends).' : ' and ' + fx(Yh(h, 40), 1) + ' at a = 40°.'), () => {
          azs.forEach(a => { if (Yh(h, a) <= HH) k.point(k.pt(X(a), Yh(h, a)), '', 'n'); });
          k.label(k.pt(0, Yh(h, 0)), h + '°', 'ne', { upright: true, size: 0.75, dist: 0.8 });
        });
      });
      k.step('pencil', 'Trace each altitude line through its marks with a steady hand or a French curve. They are hyperbolas, flat at the centre and rising towards the edges.', () => {
        [10, 20, 30].forEach(h => {
          const pts = []; for (let i = 0; i <= 80; i++) { const x = -HW + 2 * HW * i / 80; const y = tan(h * D2R) * sqrt(f * f + x * x); pts.push(y <= HH ? [x, y] : null); }
          k.curve(pts, null, { cls: 'curve' });
        });
      });
      k.note('Ten degrees of azimuth measure 17.6, 18.8, 21.3 and 26.2 from the centre to the edge: the picture is stretched by sec²a across the field. That growing step is the price of keeping every straight line of the sky straight.', () => {
        [[0, 10], [10, 20], [20, 30], [30, 40]].forEach(([a, b]) => k.text((X(a) + X(b)) / 2, -13, fx(X(b) - X(a), 1), { size: 0.7, upright: true }));
      });
    }
  });

  /* ================================================================= the all-sky view */
  const ALLSKY = {
    R: 150, lat: 32, lst: 82.5,
    ori: ['lamOri', 'alpOri', 'gamOri', 'delOri', 'epsOri', 'zetOri', 'kapOri', 'betOri'],
    uma: ['etaUMa', 'zetUMa', 'epsUMa', 'delUMa', 'gamUMa', 'betUMa', 'alpUMa'],
    lab: { lamOri: 'Meissa', alpOri: 'Betelgeuse', gamOri: 'Bellatrix', delOri: 'Mintaka', epsOri: 'Alnilam', zetOri: 'Alnitak', kapOri: 'Saiph', betOri: 'Rigel', etaUMa: 'Alkaid', zetUMa: 'Mizar', epsUMa: 'Alioth', delUMa: 'Megrez', gamUMa: 'Phecda', betUMa: 'Merak', alpUMa: 'Dubhe' },
    fig: [['lamOri', 'alpOri'], ['lamOri', 'gamOri'], ['alpOri', 'zetOri'], ['gamOri', 'delOri'], ['delOri', 'epsOri'], ['epsOri', 'zetOri'], ['zetOri', 'kapOri'], ['delOri', 'betOri'],
      ['etaUMa', 'zetUMa'], ['zetUMa', 'epsUMa'], ['epsUMa', 'delUMa'], ['delUMa', 'gamUMa'], ['gamUMa', 'betUMa'], ['betUMa', 'alpUMa'], ['alpUMa', 'delUMa']]
  };
  function allSkyStars() {
    const S = SKY(); if (!S) return [];
    return ALLSKY.ori.concat(ALLSKY.uma).map(key => { const s = S.star(key), h = eqToHor(s.ra, s.dec, ALLSKY.lst, ALLSKY.lat); return { key, alt: h.alt, az: h.az }; });
  }
  function allSkyNote() {
    const R = ALLSKY.R;
    return 'The picture is the sky as an all-sky camera sees it looking up: the zenith at the centre, the horizon at the rim, north at the top and east on the **left** (the mirror image of a plan or a map). The radius is proportional to the angle from the zenith, $r = R\\,(90° - h)/90°$, so a degree is the same length everywhere along a radius: the equidistant fisheye, $r = f\\theta$. The sky is Tel Aviv (32° N) at local sidereal time 5h 30m, about 23:30 in mid-January. By hand, the altitudes and azimuths come from the conversion of right ascension and declination to horizon coordinates; here they are the engine\'s values:' +
      mdTable(['star', 'altitude', 'azimuth', 'radius r'], allSkyStars().map(o => [ALLSKY.lab[o.key], fx(o.alt, 1) + '°', fx(o.az, 1) + '°', o.alt > 0 ? fx(R * (90 - o.alt) / 90, 1) : 'below the horizon']));
  }
  Hyper.construction({
    id: 'sm-all-sky-grid',
    title: 'The all-sky view: rings by dividers, azimuths by protractor, Orion and the Plough plotted',
    tags: ['azimuthal equidistant', 'all-sky', 'fisheye', 'dividers'],
    note: allSkyNote(),
    build(k) {
      const R = ALLSKY.R, Z = k.pt(0, 0), lab = ALLSKY.lab, all = allSkyStars();
      const ringR = h => R * (90 - h) / 90;
      const at = (r, az) => k.pt(-r * sin(az * D2R), r * cos(az * D2R));        // north up, east on the left
      k.given('The zenith Z, the horizon circle of radius R = 150 (the rim of the sky, zenith distance 90°) and the four compass points: north at the top and east on the LEFT, because you are looking up at the sky.', () => {
        k.circle(Z, R, { cls: 'given' });
        k.point(Z, 'Z', 'ne');
        k.label(at(R, 0), 'N', 'n', { upright: true }); k.label(at(R, 90), 'E', 'w', { upright: true }); k.label(at(R, 180), 'S', 's', { upright: true }); k.label(at(R, 270), 'W', 'e', { upright: true });
        k.frame(-R - 20, -R - 14, R + 20, R + 14);
      });
      k.step('tee', 'Draw the north–south line (vertical) and the east–west line (horizontal) through Z. They are the azimuths 0°/180° and 90°/270°.', () => {
        k.seg(at(R, 0), at(R, 180), { cls: 'cons' }); k.seg(at(R, 90), at(R, 270), { cls: 'cons' });
      });
      k.step('dividers', 'Divide the radius into nine equal parts, R/9 = 16.7 each, one for every 10° of altitude: the mark n parts from the rim is at altitude 10n°. Step them off along the line towards north.', () => {
        for (let h = 80; h >= 10; h -= 10) { k.point(at(ringR(h), 0), '', 'e'); k.label(at(ringR(h), 0), String(h) + '°', 'e', { upright: true, size: 0.65, dist: 0.7 }); }
      });
      k.step('compass', 'With centre Z draw a circle through each mark: the circles of altitude 80°, 70° … 10°. They are equally spaced, because the picture keeps angles along a radius true.', () => {
        for (let h = 80; h >= 10; h -= 10) k.circle(Z, ringR(h), { cls: 'cons' });
      });
      k.step('protractor', 'Every 30° from the north line, with the protractor centred on Z, draw the azimuth lines to the rim. Azimuth is measured from north through east, so 90° is on the left.', () => {
        for (let a = 30; a < 360; a += 30) { if (a % 90) k.seg(Z, at(R, a), { cls: 'cons' }); }
        for (let a = 30; a < 360; a += 30) if (a % 90) k.label(at(R, a), String(a) + '°', a < 180 ? 'w' : 'e', { upright: true, size: 0.65, dist: 0.8 });
      });
      k.step('protractor', 'For each star in the table, measure its azimuth from north through east and draw that radius lightly from Z (dashed here).', () => {
        all.forEach(o => { if (o.alt > 0) k.seg(Z, at(R * (90 - o.alt) / 90 + 14, o.az), { cls: 'aux', dash: true }); });
      });
      k.step('ruler', 'On each radius lay off r = 150 × (90° − altitude) / 90° from Z. A star at altitude 60° is 50 from the centre, one at 30° is 100.', () => {
        all.forEach(o => { if (o.alt > 0) k.point(at(R * (90 - o.alt) / 90, o.az), '', 'ne'); });
      });
      k.step('pencil', 'Join the stars into their figures and name them: Orion (the belt, the shoulders and the knee) high in the south, the Plough (the Big Dipper) low in the north-east.', () => {
        const pos = {}, up = {}; all.forEach(o => { pos[o.key] = at(R * (90 - o.alt) / 90, o.az); up[o.key] = o.alt > 0; });
        ALLSKY.fig.forEach(([a, b]) => { if (up[a] && up[b]) k.seg(pos[a], pos[b], { cls: 'thick' }); });
        [['alpOri', 'w'], ['betOri', 'e'], ['alpUMa', 'e'], ['etaUMa', 'nw']].forEach(([key, at2]) => { if (up[key]) k.label(pos[key], lab[key], at2, { upright: true, size: 0.7, dist: 0.9 }); });
      });
      k.note('Notice the stretch across the rim: ten degrees of azimuth measure 26.2 on the horizon circle but only 2.9 on the ring of altitude 80°. Along a radius the scale is the same everywhere; across it, it shrinks to nothing at the zenith.', () => {
        k.arc(Z, R, (90 + 40) * D2R, (90 + 50) * D2R, { cls: 'red', width: 3 });
        k.arc(Z, ringR(80), (90 + 40) * D2R, (90 + 50) * D2R, { cls: 'red', width: 3 });
        k.text(-R * 0.9, R * 0.26, '26.2', { size: 0.8, upright: true, fill: '#b03a2e' });
        k.text(-ringR(80) - 8, ringR(80) * 0.45, '2.9', { size: 0.75, upright: true, fill: '#b03a2e' });
      });
    }
  });

  /* ================================================================= the planisphere */
  const WHEEL = {
    R: 60, rimDec: -40, eps: 23.44,
    g1: ['alpUMi', 'alpUMa', 'betUMa', 'gamUMa', 'delUMa', 'epsUMa', 'zetUMa', 'etaUMa', 'betCas', 'alpCas', 'gamCas', 'delCas', 'epsCas'],
    g2: ['alpOri', 'gamOri', 'delOri', 'epsOri', 'zetOri', 'kapOri', 'betOri', 'alpCMa', 'alpCMi', 'alpTau', 'alpAur', 'betGem', 'alpLeo', 'alpVir', 'alpBoo', 'alpSco', 'alpLyr', 'alpCyg', 'alpAql'],
    name: { alpUMi: 'Polaris', alpUMa: 'Dubhe', betUMa: 'Merak', gamUMa: 'Phecda', delUMa: 'Megrez', epsUMa: 'Alioth', zetUMa: 'Mizar', etaUMa: 'Alkaid', betCas: 'Caph', alpCas: 'Schedar', gamCas: 'Gamma Cas', delCas: 'Ruchbah', epsCas: 'Segin',
      alpOri: 'Betelgeuse', gamOri: 'Bellatrix', delOri: 'Mintaka', epsOri: 'Alnilam', zetOri: 'Alnitak', kapOri: 'Saiph', betOri: 'Rigel', alpCMa: 'Sirius', alpCMi: 'Procyon', alpTau: 'Aldebaran', alpAur: 'Capella', betGem: 'Pollux', alpLeo: 'Regulus', alpVir: 'Spica', alpBoo: 'Arcturus', alpSco: 'Antares', alpLyr: 'Vega', alpCyg: 'Deneb', alpAql: 'Altair' },
    fig: [['etaUMa', 'zetUMa'], ['zetUMa', 'epsUMa'], ['epsUMa', 'delUMa'], ['delUMa', 'gamUMa'], ['gamUMa', 'betUMa'], ['betUMa', 'alpUMa'], ['alpUMa', 'delUMa'],
      ['betCas', 'alpCas'], ['alpCas', 'gamCas'], ['gamCas', 'delCas'], ['delCas', 'epsCas'],
      ['alpOri', 'gamOri'], ['gamOri', 'delOri'], ['delOri', 'epsOri'], ['epsOri', 'zetOri'], ['zetOri', 'alpOri'], ['zetOri', 'kapOri'], ['delOri', 'betOri']]
  };
  /* where a star lies on the wheel: polar distance p, radius r on a chart of equator radius R, and the angle (clockwise from the 0h spoke, up) */
  function wheelStar(key) {
    const S = SKY(), s = S.star(key), p = 90 - s.dec, r = sr(WHEEL.R, p);
    return { key, ra: s.ra, dec: s.dec, p, r, pos: clk({ x: 0, y: 0 }, r, s.ra) };
  }
  function monthTicks() {
    const S = SKY(), out = [], names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let m = 1; m <= 12; m++) out.push({ name: names[m - 1], ra: S.sun(S.jdUT(2025, m, 1, 12)).ra });
    return out;
  }
  function wheelNote() {
    if (!SKY()) return '';
    const rows = WHEEL.g1.concat(WHEEL.g2).map(key => { const w = wheelStar(key); return [WHEEL.name[key], fx(w.ra / 15, 2) + ' h = ' + fx(w.ra, 1) + '°', fx(w.dec, 1) + '°', fx(w.p, 1) + '°', fx(w.r, 1)]; });
    const ticks = monthTicks().map(t => t.name + ' ' + fx(t.ra, 0) + '°').join(', ');
    return 'The wheel is the sky seen looking up: north up, east to the left, so right ascension runs **clockwise**. Every circle of the sky stays a circle, so the whole wheel is made with a compass; the only calculation is the radius of a declination circle, $r = R\\tan\\frac{90° - \\delta}{2}$, and the inscribed-angle construction replaces even that. For a latitude as far south as Tel Aviv the wheel must reach declination −58° to show everything that rises; this one stops at −40°, as a planisphere for 50° N does (the horizon of 51.5° N reaches −38.5° in the south). The **date scale** on the rim is the Sun\'s right ascension on the first of each month (' + ticks + '). Plotted stars (right ascension and declination are the catalogue\'s; polar distance p = 90° − δ):' + mdTable(['star', 'right ascension', 'declination', 'p', 'radius r'], rows);
  }
  Hyper.construction({
    id: 'sm-planisphere-wheel',
    title: 'The star wheel of a planisphere: declination circles by the inscribed angle, the ecliptic, the stars',
    tags: ['stereographic', 'planisphere', 'compass', 'inscribed angle'],
    note: wheelNote(),
    build(k) {
      const S = SKY(), g = k.g, R = WHEEL.R, eps = WHEEL.eps;
      const P = k.pt(0, 0), A = k.pt(0, R), B = k.pt(0, -R);
      const Q = (p) => clk(P, R, p);                                   // a point of the equator circle, p degrees clockwise from the top
      const horiz = [k.pt(-1000, 0), k.pt(1000, 0)];
      const decs = [[60, '+60°'], [30, '+30°'], [eps, '+23.4°'], [-eps, '−23.4°'], [-30, '−30°'], [WHEEL.rimDec, '−40°']];
      const Xc = decs.map(([d]) => { const p = 90 - d, q = Q(p); return { d, p, q, x: g.lineLine(B, q, horiz[0], horiz[1]) }; });
      const rOf = d => sr(R, 90 - d);
      const rRim = rOf(WHEEL.rimDec);
      k.given('The pole P at the centre, the equator circle of radius R = 60 (declination 0°), the vertical diameter AB and the horizontal diameter through P. The wheel will reach declination −40°. Right ascension is measured clockwise from the 0h line, which points up.', () => {
        k.circle(P, R, { cls: 'given' });
        k.seg(A, B, { cls: 'cons' }); k.seg(k.pt(-R, 0), k.pt(R, 0), { cls: 'cons' });
        k.point(P, 'P', 'ne'); k.point(A, 'A', 'n'); k.point(B, 'B', 's');
        k.frame(-rRim - 22, -rRim - 22, rRim + 22, rRim + 22);
      });
      k.step('protractor', 'On the equator circle mark the points at 30°, 60°, 66.56°, 113.44°, 120° and 130° from A, measured at P clockwise. They stand for declinations +60°, +30°, +23.44° (the tropic of Cancer), −23.44° (Capricorn), −30° and −40° (the rim): the angle is the polar distance, 90° − δ.', () => {
        Xc.forEach(o => k.point(o.q, '', 'e'));
        Xc.forEach(o => k.label(o.q, fx(o.d, o.d === eps || o.d === -eps ? 1 : 0) + '°', 'e', { upright: true, size: 0.62, dist: 0.7 }));
      });
      k.step('straightedge', 'Join B to each of these points. Where each line cuts the horizontal diameter is the radius of that declination circle: the angle at B is half the angle at P, so the cut lies at R tan(p/2).', () => {
        Xc.forEach(o => { k.seg(B, o.x, { cls: 'cons' }); k.point(o.x, '', 'n'); });
      });
      k.step('compass', 'With centre P draw a circle through each cut: the circles of declination +60°, +30°, the two tropics, −30° and the rim at −40°. They crowd together towards the pole and spread out to the south: the stereographic projection\'s signature.', () => {
        Xc.forEach(o => k.circle(P, g.dist(P, o.x), { cls: o.d === WHEEL.rimDec ? 'thick' : 'cons' }));
        Xc.forEach(o => k.label(k.pt(0, g.dist(P, o.x)), fx(o.d, o.d === eps || o.d === -eps ? 1 : 0), 'w', { upright: true, size: 0.58, dist: 0.5 }));
      });
      k.step('protractor', 'Every 30° round P draw a spoke out to the rim: these are the hours of right ascension, 0h at the top, 2h, 4h … clockwise (15° to the hour).', () => {
        for (let h = 0; h < 24; h += 2) { const a = h * 15; k.seg(P, clk(P, rRim, a), { cls: 'cons' }); k.label(clk(P, rRim + 3, a), h + 'h', a > 180 ? 'w' : a === 0 || a === 180 ? 'n' : 'e', { upright: true, size: 0.65, dist: 0.7 }); }
      });
      const rCan = rOf(eps), rCap = rOf(-eps);
      const C6 = k.pt(rCan, 0), C18 = k.pt(-rCap, 0), Ce = g.mid(C6, C18), rEc = g.dist(Ce, C6);
      k.step('dividers', 'The ecliptic crosses the 6h spoke at declination +23.44° and the 18h spoke at −23.44°. Take the radius of the Cancer circle from P to the right (the point is already there) and the radius of the Capricorn circle from P to the left: C₆ and C₁₈.', () => {
        k.point(C6, 'C_6', 'sw'); k.point(C18, 'C_{18}', 'nw');
      });
      k.step('compass', 'Bisect C₆C₁₈ to find the centre E of the ecliptic and draw the circle through C₆ and C₁₈. Its radius is R / cos 23.44° = 65.4 and its centre lies R tan 23.44° = 26 from P towards 18h. It passes through the equator circle at 0h and 12h: the equinoxes.', () => {
        k.point(Ce, 'E', 'nw');
        k.circle(Ce, rEc, { cls: 'red' });
        k.label(clk(Ce, rEc, 330), 'ecliptic', 'se', { upright: true, size: 0.7, fill: '#b03a2e' });
      });
      const ticks = monthTicks();
      k.step('protractor', 'The date scale: on the rim mark the Sun\'s right ascension at the first of each month (Jan 1 is at about 281°, Mar 1 at 341°, Jun 1 at 69°, Sep 1 at 158°), measured clockwise from the 0h spoke, and letter the months.', () => {
        ticks.forEach(t => { k.seg(clk(P, rRim, t.ra), clk(P, rRim + 6, t.ra), { cls: 'thick' }); });
        ticks.forEach(t => k.label(clk(P, rRim + 10, t.ra + 8), t.name, 'c', { upright: true, size: 0.6 }));
      });
      const place = keys => keys.map(wheelStar);
      k.step('ruler', 'Plot the northern stars. For each, take the polar distance p = 90° − δ from the table, lay off r = 60 tan(p/2) from P along the direction RA × 15° clockwise from the 0h line: Polaris sits almost on P; the Plough lies 30° to 40° out, Cassiopeia about 30° out on the opposite side.', () => {
        place(WHEEL.g1).forEach(w => k.point(w.pos, '', 'ne'));
        ['alpUMi', 'alpUMa', 'alpCas'].forEach(key => k.label(wheelStar(key).pos, WHEEL.name[key], key === 'alpUMi' ? 'sw' : 'ne', { upright: true, size: 0.62, dist: 0.8 }));
      });
      k.step('ruler', 'Plot the bright stars of the zodiac and the summer triangle the same way: Orion\'s seven, Sirius, Procyon, Aldebaran, Capella, Pollux, Regulus, Spica, Arcturus, Antares, Vega, Deneb and Altair.', () => {
        place(WHEEL.g2).forEach(w => k.point(w.pos, '', 'ne'));
        ['alpCMa', 'alpBoo', 'alpLyr', 'alpAur', 'alpSco'].forEach(key => k.label(wheelStar(key).pos, WHEEL.name[key], 'ne', { upright: true, size: 0.62, dist: 0.8 }));
      });
      k.step('pencil', 'Join the stars of the Plough (and its pointers to Polaris), of Cassiopeia and of Orion with light lines, and ink in the ecliptic and the rim: the star wheel is done.', () => {
        const ws = {}; WHEEL.g1.concat(WHEEL.g2).forEach(key => { ws[key] = wheelStar(key).pos; });
        WHEEL.fig.forEach(([a, b]) => k.seg(ws[a], ws[b], { cls: 'curve' }));
        k.seg(ws.betUMa, ws.alpUMi, { cls: 'aux', dash: true });
      });
    }
  });

  /* the mask: horizon circle of a latitude on the same polar stereographic chart */
  const MASK = { R: 60, lat: 51.5 };
  /* a point of the sky given by altitude and azimuth, on the chart seen looking up (meridian vertical, north up) */
  function maskPos(alt, az) {
    const S = SKY(), e = horToEq(alt, az, 0, MASK.lat), ha = -e.ra, r = sr(MASK.R, 90 - e.dec);
    return { x: r * sin(ha * D2R), y: -r * cos(ha * D2R), r };
  }
  function maskNote() {
    if (!SKY()) return '';
    const rows = [0, 30, 60].map(a => { const n = maskPos(a, 0), s = maskPos(a, 180); return [a + '°', fx(n.y, 1), fx(s.y, 1), fx((n.y + s.y) / 2, 1), fx(abs(n.y - s.y) / 2, 1)]; });
    return 'The mask is the horizon of one latitude drawn on the chart of the wheel; everything inside the horizon circle is above the horizon, and the window of the planisphere is cut along it. A planisphere is made for a band of latitudes only, because the horizon circle changes with φ while the wheel does not: for 51.5° N its centre lies R cot φ = 47.7 below P and its radius is R / sin φ = 76.7. Positions along the meridian (positive upwards = towards the north horizon), for R = 60, and the circles of equal altitude they give (centre and radius on the meridian):' +
      mdTable(['altitude', 'north point y', 'south point y', 'centre y', 'radius'], rows) + 'Use the same chart, turn the wheel until the date mark of the rim meets the time on the mask, and read the sky: the date scale is the Sun\'s right ascension, the time scale turns it into the sidereal time $\\theta = \\alpha_\\odot + 15° \\times (t - 12\\,\\mathrm{h})$ at the local mean time $t$.';
  }
  Hyper.construction({
    id: 'sm-planisphere-mask',
    title: 'The horizon mask of a planisphere for latitude 51.5° N',
    tags: ['stereographic', 'planisphere', 'horizon', 'compass'],
    note: maskNote(),
    build(k) {
      const g = k.g, R = MASK.R, phi = MASK.lat;
      const P = k.pt(0, 0), A = k.pt(0, R), B = k.pt(0, -R), Wp = k.pt(R, 0), Ep = k.pt(-R, 0);
      const rim = sr(R, 130);
      const horiz = [k.pt(-1000, 0), k.pt(1000, 0)];
      const qN = clk(P, R, phi), qS = clk(P, R, 180 - phi), qZ = clk(P, R, 90 - phi);
      const xN = g.lineLine(B, qN, horiz[0], horiz[1]), xS = g.lineLine(B, qS, horiz[0], horiz[1]), xZ = g.lineLine(B, qZ, horiz[0], horiz[1]);
      const HN = k.pt(0, g.dist(P, xN)), HS = k.pt(0, -g.dist(P, xS)), Z = k.pt(0, -g.dist(P, xZ));
      const C = g.mid(HN, HS), rH = g.dist(C, HN);
      k.given('The pole P, the equator circle of radius R = 60, the meridian AB (vertical) and the east–west line; the latitude is φ = 51.5° N. The chart is the one of the star wheel: north up, east on the left, the rim at declination −40°.', () => {
        k.circle(P, R, { cls: 'given' });
        k.circle(P, rim, { cls: 'cons' });
        k.seg(A, B, { cls: 'cons' }); k.seg(Ep, Wp, { cls: 'cons' });
        k.point(P, 'P', 'ne'); k.point(A, 'A', 'n'); k.point(B, 'B', 's'); k.point(Ep, 'E', 'w'); k.point(Wp, 'W', 'e');
        k.frame(-rim - 14, -rim - 14, rim + 14, rim + 14);
      });
      k.step('protractor', 'On the equator circle mark three points, measured clockwise from A at P: at φ = 51.5° (for the north point of the horizon, declination 90° − φ), at 90° − φ = 38.5° (for the zenith, declination φ) and at 180° − φ = 128.5° (for the south point, declination φ − 90°).', () => {
        k.point(qN, 'Q_N', 'se'); k.point(qZ, 'Q_Z', 'n'); k.point(qS, 'Q_S', 'e');
      });
      k.step('straightedge', 'Join B to each of the three points. The cuts on the horizontal diameter are the distances from P of the north point (28.9), the zenith (20.9) and the south point (124.4) of the horizon.', () => {
        [xN, xZ, xS].forEach(x => { k.seg(B, x, { cls: 'cons' }); k.point(x, '', 'n'); });
      });
      k.step('dividers', 'Carry the first distance up the meridian from P to H_N (the north point), the second down to Z (the zenith, which lies below P because the zenith is on the south side of the pole), the third down to H_S (the south point).', () => {
        k.point(HN, 'H_N', 'ne'); k.point(Z, 'Z', 'ne'); k.point(HS, 'H_S', 'se');
      });
      k.step('compass', 'Bisect H_N H_S for the centre C and draw the horizon circle through H_N and H_S. It passes through E and W: the horizon cuts the celestial equator at the east and west points, which is the check on the work.', () => {
        k.point(C, 'C', 'ne');
        k.circle(C, rH, { cls: 'curve' });
        k.label(clk(C, rH, 235), 'horizon', 'sw', { upright: true, size: 0.75, fill: '#0b4fa0' });
      });
      const alts = [30, 60].map(a => { const n = maskPos(a, 0), s = maskPos(a, 180); return { a, n: k.pt(0, n.y), s: k.pt(0, s.y), c: k.pt(0, (n.y + s.y) / 2), r: abs(n.y - s.y) / 2 }; });
      k.step('ruler', 'Circles of equal altitude are drawn the same way. For altitude 30° and 60° mark on the meridian the points where the circle crosses it north and south of the zenith (the table in the note gives their positions).', () => {
        alts.forEach(o => { k.point(o.n, '', 'e'); k.point(o.s, '', 'e'); });
      });
      k.step('compass', 'Bisect each pair for its centre and draw the circles of altitude 30° and 60°, the second shrinking round the zenith Z.', () => {
        alts.forEach(o => { k.circle(o.c, o.r, { cls: 'cons' }); k.label(k.pt(o.c.x + o.r, o.c.y), o.a + '°', 'e', { upright: true, size: 0.62, dist: 0.6 }); });
      });
      k.step('pencil', 'Letter the compass points on the horizon circle (north at the top, south at the bottom, east and west where it meets the equator circle) and cut away the card outside it: that oval is the window.', () => {
        k.circle(C, rH, { cls: 'thick' });
        k.label(HN, 'N', 'n', { upright: true }); k.label(HS, 'S', 's', { upright: true });
        k.text(0, C.y - rH * 0.62, 'window (open sky)', { upright: true, size: 0.75 });
      });
    }
  });

  /* ================================================================= the astrolabe */
  const ASTRO = {
    R: 60, lat: 32, lst: 90, eps: 23.44,
    stars: ['alpCMa', 'alpCMi', 'alpOri', 'betOri', 'alpTau', 'alpAur', 'betGem', 'alpLeo', 'alpVir', 'alpBoo', 'alpLyr', 'alpAql', 'alpCyg'],
    name: { alpCMa: 'Sirius', alpCMi: 'Procyon', alpOri: 'Betelgeuse', betOri: 'Rigel', alpTau: 'Aldebaran', alpAur: 'Capella', betGem: 'Pollux', alpLeo: 'Regulus', alpVir: 'Spica', alpBoo: 'Arcturus', alpLyr: 'Vega', alpAql: 'Altair', alpCyg: 'Deneb' },
    signs: ['Ari', 'Tau', 'Gem', 'Cnc', 'Leo', 'Vir', 'Lib', 'Sco', 'Sgr', 'Cap', 'Aqr', 'Psc']
  };
  /* the astrolabe is the sky seen from outside the sphere: zenith up, east on the left; the point at hour angle H lies H degrees clockwise from up */
  function astroXY(ra, dec, lst) {
    const H = (lst == null ? ASTRO.lst : lst) - ra, r = sr(ASTRO.R, 90 - dec);
    return { x: r * sin(H * D2R), y: r * cos(H * D2R), r };
  }
  /* a point given by altitude and azimuth, on the plate (the plate is fixed to the horizon: take the sidereal time as 0) */
  function plateXY(alt, az) { const S = SKY(), e = horToEq(alt, az, 0, ASTRO.lat); return astroXY(e.ra, e.dec, 0); }
  function astroNote() {
    const S = SKY(); if (!S) return '';
    const rows = ASTRO.stars.map(key => { const s = S.star(key), q = astroXY(s.ra, s.dec); return [ASTRO.name[key], fx(s.ra / 15, 2) + ' h', fx(s.dec, 1) + '°', fx(sr(ASTRO.R, 90 - s.dec), 1), fx(((ASTRO.lst - s.ra) % 360 + 360) % 360, 1) + '°']; });
    const zr = ASTRO.signs.map((nm, i) => { const e = S.eclToEq(30 * i, 0); const q = astroXY(e.ra, e.dec); return [nm + ' ' + (30 * i) + '°', fx(e.ra / 15, 2) + ' h', fx(e.dec, 1) + '°', fx(q.r, 1)]; });
    return 'The astrolabe is the stereographic projection of the sky from the south celestial pole onto the plane of the equator, seen from outside the sphere: the zenith is up, the pole in the centre, and the hour angle of a point is measured clockwise from the meridian. The **plate** is cut for one latitude (here 32° N, Tel Aviv) and carries the horizon, the circles of equal altitude and the meridian; the **rete** is the open-work brass sky turning over it, carrying the ecliptic ring and the pointers of the brightest stars. The rete is shown here set at local sidereal time 6h; turn it and the stars rise over the east (left) edge of the horizon, cross the meridian at the top and set at the right. The ecliptic ring has centre $R\\tan\\varepsilon$ from the pole and radius $R/\\cos\\varepsilon$; the zodiac points on it are given in the table (the stereographic divisions of a great circle are not equal, so they are set from right ascension and declination).' +
      mdTable(['star', 'right ascension', 'declination', 'radius r', 'hour angle at 6h'], rows) + mdTable(['ecliptic longitude', 'right ascension', 'declination', 'radius r'], zr);
  }
  Hyper.construction({
    id: 'sm-astrolabe-rete',
    title: 'The astrolabe: the plate for 32° N and the rete turning over it',
    tags: ['astrolabe', 'stereographic', 'rete', 'ecliptic', 'compass'],
    note: astroNote(),
    build(k) {
      const S = SKY(), g = k.g, R = ASTRO.R, phi = ASTRO.lat, eps = ASTRO.eps;
      const P = k.pt(0, 0), A = k.pt(0, R), B = k.pt(0, -R), Wp = k.pt(R, 0), Ep = k.pt(-R, 0);
      const rCan = sr(R, 90 - eps), rCap = sr(R, 90 + eps), rim = rCap;
      const horiz = [k.pt(-1000, 0), k.pt(1000, 0)];
      const qCan = clk(P, R, 90 - eps), qCap = clk(P, R, 90 + eps), qN = clk(P, R, phi), qZ = clk(P, R, 90 - phi);
      const cut = q => g.lineLine(B, q, horiz[0], horiz[1]);
      const xCan = cut(qCan), xCap = cut(qCap), xN = cut(qN), xZ = cut(qZ);
      const HN = k.pt(0, -g.dist(P, xN)), Z = k.pt(0, g.dist(P, xZ));
      const mid = g.mid(Ep, HN), dirb = g.perp(g.sub(HN, Ep));
      const Ch = g.lineLine(mid, g.add(mid, dirb), k.pt(0, -1000), k.pt(0, 1000)), rH = g.dist(Ch, HN);
      const arcInside = (c, rho) => {
        const pts = g.circleCircle(c, rho, P, rim);
        if (pts.length < 2) return g.dist(c, P) + rho <= rim + 1e-9 ? 'full' : null;
        let t1 = atan2(pts[0].y - c.y, pts[0].x - c.x), t2 = atan2(pts[1].y - c.y, pts[1].x - c.x);
        const span = ((t2 - t1) % (2 * PI) + 2 * PI) % (2 * PI), m = { x: c.x + rho * cos(t1 + span / 2), y: c.y + rho * sin(t1 + span / 2) };
        return g.dist(m, P) <= rim ? { a0: t1, a1: t1 + span } : { a0: t2, a1: t2 + (2 * PI - span) };
      };
      const draw = (c, rho, o) => { const a = arcInside(c, rho); if (a === 'full') k.circle(c, rho, o); else if (a) k.arc(c, rho, a.a0, a.a1, o); };
      k.given('The pole P at the centre, the equator circle of radius R = 60, the meridian (vertical: the zenith will lie above P) and the east–west line, east on the left. The plate is for latitude φ = 32° N and ends at the tropic of Capricorn.', () => {
        k.circle(P, R, { cls: 'given' });
        k.seg(A, B, { cls: 'cons' }); k.seg(Ep, Wp, { cls: 'cons' });
        k.point(P, 'P', 'ne'); k.point(A, 'A', 'n'); k.point(B, 'B', 's'); k.point(Ep, 'E', 'w'); k.point(Wp, 'W', 'e');
        k.frame(-rim - 12, -rim - 12, rim + 12, rim + 12);
      });
      k.step('protractor', 'On the equator circle mark, clockwise from A: 66.56° and 113.44° for the tropics (declination ±23.44°), φ = 32° for the north point of the horizon (declination 90° − φ) and 90° − φ = 58° for the zenith (declination φ).', () => {
        k.point(qCan, 'Q_1', 'e'); k.point(qCap, 'Q_2', 'e'); k.point(qN, 'Q_3', 'e'); k.point(qZ, 'Q_4', 'e');
      });
      k.step('straightedge', 'Join B to each point; the cuts on the east–west line give the distances from P: Cancer 39.4, Capricorn 91.4, the north point of the horizon 17.2 and the zenith 33.3 (all at R tan(p/2)).', () => {
        [xCan, xCap, xN, xZ].forEach(x => { k.seg(B, x, { cls: 'cons' }); k.point(x, '', 'n'); });
      });
      k.step('compass', 'With centre P draw the tropic of Cancer (inner) and the tropic of Capricorn (outer): the outer one is the edge of the plate.', () => {
        k.circle(P, g.dist(P, xCan), { cls: 'cons' }); k.circle(P, g.dist(P, xCap), { cls: 'thick' });
      });
      k.step('dividers', 'Carry the distance of the north point of the horizon down the meridian from P to H_N, and the distance of the zenith up to Z.', () => {
        k.point(HN, 'H_N', 'se'); k.point(Z, 'Z', 'e');
      });
      k.step('square', 'The horizon passes through E, W and H_N. Draw the perpendicular bisector of E H_N with the set square; where it meets the meridian is the centre C of the horizon circle (it lies far above P, because the south point of the horizon is off the plate).', () => {
        k.seg(g.lerp(mid, Ch, -0.25), g.lerp(mid, Ch, 1.12), { cls: 'cons' });
        k.seg(Ep, HN, { cls: 'cons', dash: true });
        k.point(Ch, 'C', 'ne');
      });
      k.step('compass', 'With centre C and radius C H_N draw the horizon, as much of it as lies on the plate: it runs through E and W and bends round below P. Everything inside is above the horizon.', () => {
        draw(Ch, rH, { cls: 'curve' });
        k.label(k.pt(-R * 1.28, -R * 0.38), 'horizon', 'w', { upright: true, size: 0.7, fill: '#0b4fa0' });
      });
      const alts = [30, 60].map(a => { const n = plateXY(a, 0), s = plateXY(a, 180); return { a, n: k.pt(0, n.y), s: k.pt(0, s.y), c: k.pt(0, (n.y + s.y) / 2), r: abs(n.y - s.y) / 2 }; });
      k.step('ruler', 'The circles of equal altitude are found the same way. Mark on the meridian the points where the altitude circles of 30° and 60° meet it (from the table: the north points y = ' + alts.map(o => fx(o.n.y, 1)).join(', ') + ', the south points y = ' + alts.map(o => fx(o.s.y, 1)).join(', ') + ').', () => {
        alts.forEach(o => { k.point(o.n, '', 'e'); k.point(o.s, '', 'e'); });
      });
      k.step('compass', 'Bisect each pair and draw the circles of altitude 30° and 60° (the almucantars). They shrink towards the zenith Z.', () => {
        alts.forEach(o => { draw(o.c, o.r, { cls: 'cons' }); k.label(o.s, o.a + '°', 'e', { upright: true, size: 0.6, dist: 0.7 }); });
      });
      /* the rete, set at sidereal time 6h */
      const C6 = k.pt(0, rCan), C18 = k.pt(0, -rCap), Ce = g.mid(C6, C18), rEc = g.dist(Ce, C6);
      k.step('dividers', 'The rete, set at sidereal time 6h so that the 6h line of right ascension lies along the meridian. The ecliptic meets it at declination +23.44° (the Cancer circle, above P) and at −23.44° (the Capricorn circle, below P): mark C₆ and C₁₈ and bisect them for the centre E of the ecliptic ring.', () => {
        k.point(C6, 'C_6', 'nw'); k.point(C18, 'C_{18}', 'se'); k.point(Ce, 'C_e', 'ne');
      });
      k.step('compass', 'Draw the ecliptic ring with centre E through C₆ and C₁₈. It is R / cos 23.44° = 65.4 in radius, touches the plate edge at the bottom and passes through the equator circle at the equinoxes, 90° to either side of the meridian.', () => {
        k.circle(Ce, rEc, { cls: 'red' });
        k.label(clk(Ce, rEc, 300), 'ecliptic', 'w', { upright: true, size: 0.7, fill: '#b03a2e', dist: 0.7 });
      });
      const zod = ASTRO.signs.map((nm, i) => { const e = S.eclToEq(30 * i, 0), q = astroXY(e.ra, e.dec); return { nm, pos: k.pt(q.x, q.y), lon: 30 * i }; });
      k.step('ruler', 'Mark the twelve zodiac points on the ring, every 30° of ecliptic longitude: take each point\'s right ascension and declination from the table, lay off the radius R tan((90° − δ)/2) and the hour angle (6h − RA) clockwise from the meridian. They are not equally spaced round the ring; Cancer and Capricorn are the points C₆ and C₁₈ already found.', () => {
        zod.forEach(z => { k.point(z.pos, '', 'ne'); });
        zod.filter((z, i) => i !== 3 && i !== 9).forEach(z => { const vx = z.pos.x - Ce.x, vy = z.pos.y - Ce.y; const at2 = abs(vy) > 1.6 * abs(vx) ? (vy > 0 ? 'n' : 's') : (vx > 0 ? 'e' : 'w'); k.label(z.pos, z.nm, at2, { upright: true, size: 0.55, dist: 0.8, fill: '#b03a2e' }); });
      });
      const stars = ASTRO.stars.map(key => { const s = S.star(key), q = astroXY(s.ra, s.dec); return { key, pos: k.pt(q.x, q.y) }; });
      k.step('ruler', 'Place the pointers of the bright stars on the rete in the same way: r = 60 tan((90° − δ)/2) at the hour angle (6h − RA) clockwise from the meridian. Sirius is a few degrees past the meridian\'s east side, Arcturus and Vega low in the east.', () => {
        stars.forEach(s => k.point(s.pos, '', 'ne'));
        stars.filter(s => ['alpCMa', 'betOri', 'alpOri', 'alpLyr', 'alpBoo', 'alpAql', 'alpAur', 'alpCyg'].includes(s.key)).forEach(s => k.label(s.pos, ASTRO.name[s.key], s.pos.x < 0 ? 'w' : 'e', { upright: true, size: 0.55, dist: 0.7, fill: '#2d7a3a' }));
      });
      k.note('Turn the rete clockwise and the stars set at the right; move it back and they rise over the left of the horizon. The place of any star is read against the horizon, the altitude circles and the meridian: the sky for this latitude and this hour, from a drawing that is made with a compass and a protractor alone.', () => {
        k.arc(P, rim * 1.04, 100 * D2R, 40 * D2R, { cw: true, arrow: true, cls: 'red' });
      });
    }
  });

  /* ================================================================= polar star charts */
  const POLAR = {
    k: 1.5, pMax: 120,
    g1: ['alpUMi', 'alpUMa', 'betUMa', 'gamUMa', 'delUMa', 'epsUMa', 'zetUMa', 'etaUMa', 'betCas', 'alpCas', 'gamCas', 'delCas', 'epsCas', 'alpLyr', 'alpCyg', 'alpAur'],
    g2: ['alpBoo', 'alpAql', 'alpLeo', 'alpVir', 'alpSco', 'alpCMa', 'alpCMi', 'betOri', 'alpOri', 'alpTau', 'betGem'],
    name: { alpUMi: 'Polaris', alpUMa: 'Dubhe', betUMa: 'Merak', gamUMa: 'Phecda', delUMa: 'Megrez', epsUMa: 'Alioth', zetUMa: 'Mizar', etaUMa: 'Alkaid', betCas: 'Caph', alpCas: 'Schedar', gamCas: 'γ Cas', delCas: 'Ruchbah', epsCas: 'Segin', alpLyr: 'Vega', alpCyg: 'Deneb', alpAur: 'Capella',
      alpBoo: 'Arcturus', alpAql: 'Altair', alpLeo: 'Regulus', alpVir: 'Spica', alpSco: 'Antares', alpCMa: 'Sirius', alpCMi: 'Procyon', betOri: 'Rigel', alpOri: 'Betelgeuse', alpTau: 'Aldebaran', betGem: 'Pollux' }
  };
  function polarStar(key) { const S = SKY(), s = S.star(key), p = 90 - s.dec, r = POLAR.k * p; return { key, ra: s.ra, dec: s.dec, p, r, pos: clk({ x: 0, y: 0 }, r, s.ra) }; }
  function polarNote() {
    if (!SKY()) return '';
    const rows = POLAR.g1.concat(POLAR.g2).map(key => { const w = polarStar(key); return [POLAR.name[key], fx(w.ra / 15, 2) + ' h', fx(w.dec, 1) + '°', fx(w.p, 1) + '°', fx(w.r, 1)]; });
    return 'This is a polar chart in the **azimuthal equidistant** projection: the distance from the pole is proportional to the polar distance, $r = k\\,(90° - \\delta)$ with $k = 1.5$ units per degree, so the declination circles are equally spaced and a degree of declination is the same everywhere. Right ascension is the angle at the pole, clockwise from the 0h line, as the sky is seen looking up with the pole overhead (north up, east on the left). Printed polar charts use this or the stereographic and equal-area versions; the choice only changes how the radius grows with polar distance (equidistant $kp$, stereographic $R\\tan(p/2)$, equal-area $2R\\sin(p/2)$). The Plough\'s two pointer stars, Merak and Dubhe, point to Polaris: the line from Merak through Dubhe, extended five times the gap, ends on it.' +
      mdTable(['star', 'right ascension', 'declination', 'p = 90° − δ', 'radius r = 1.5 p'], rows);
  }
  Hyper.construction({
    id: 'sm-polar-star-chart',
    title: 'A polar star chart to declination −30°: the Plough, Cassiopeia and the bright stars',
    tags: ['polar chart', 'azimuthal equidistant', 'dividers', 'protractor'],
    note: polarNote(),
    build(k) {
      const g = k.g, K = POLAR.k, P = k.pt(0, 0), rMax = K * POLAR.pMax;
      const rings = [[75, 15], [60, 30], [45, 45], [30, 60], [15, 75], [0, 90], [-15, 105], [-30, 120]];
      k.given('The pole P at the centre and a vertical line up from it (the 0h line). The scale is 1.5 units to each degree of polar distance, so the chart out to declination −30° (polar distance 120°) has radius 180.', () => {
        k.point(P, 'P', 'se');
        k.seg(P, k.pt(0, rMax), { cls: 'given' });
        k.frame(-rMax - 24, -rMax - 20, rMax + 24, rMax + 20);
      });
      k.step('dividers', 'Set the dividers to 22.5 (15° of polar distance) and step them off eight times up the vertical line from P. The marks are at declination +75°, +60° … 0° … −30°.', () => {
        rings.forEach(([d, p]) => k.point(k.pt(0, K * p), '', 'e'));
        rings.forEach(([d, p]) => k.label(k.pt(0, K * p), (d > 0 ? '+' : d < 0 ? '−' : '') + Math.abs(d) + '°', 'e', { upright: true, size: 0.6, dist: 0.7 }));
      });
      k.step('compass', 'Draw a circle about P through each mark. The equator (declination 0°) is the heavy one; the outer circle at −30° is the edge of the chart.', () => {
        rings.forEach(([d, p]) => k.circle(P, K * p, { cls: d === 0 ? 'thick' : d === -30 ? 'thick' : 'cons' }));
      });
      k.step('protractor', 'Every 30° round P draw a line of right ascension to the edge, clockwise from the 0h line: 0h, 2h, 4h … 22h.', () => {
        for (let h = 0; h < 24; h += 2) { const a = h * 15; k.seg(P, clk(P, rMax, a), { cls: 'cons' }); k.label(clk(P, rMax + 3, a), h + 'h', a > 180 ? 'w' : a === 0 || a === 180 ? 'n' : 'e', { upright: true, size: 0.65, dist: 0.7 }); }
      });
      const w1 = POLAR.g1.map(polarStar), w2 = POLAR.g2.map(polarStar);
      k.step('ruler', 'Plot the northern stars: Polaris, the seven stars of the Plough (Big Dipper), Cassiopeia\'s five and the bright Vega, Deneb and Capella. For each, lay off r = 1.5 × (90° − δ) along the direction RA × 15° clockwise from the 0h line.', () => {
        w1.forEach(w => k.point(w.pos, '', 'ne'));
        ['alpUMi', 'alpUMa', 'alpCas', 'alpLyr', 'alpCyg', 'alpAur'].forEach(key => k.label(polarStar(key).pos, POLAR.name[key], key === 'alpUMi' ? 'sw' : 'ne', { upright: true, size: 0.62, dist: 0.7 }));
      });
      k.step('ruler', 'Plot the brighter stars that lie farther from the pole, out to declination −30°: Arcturus, Altair, Regulus, Spica, Antares, Sirius, Procyon, Rigel, Betelgeuse, Aldebaran and Pollux.', () => {
        w2.forEach(w => k.point(w.pos, '', 'ne'));
        w2.forEach(w => k.label(w.pos, POLAR.name[w.key], 'ne', { upright: true, size: 0.58, dist: 0.7 }));
      });
      k.step('pencil', 'Join the Plough and Cassiopeia, and draw the pointer line from Merak through Dubhe to Polaris. Ink the equator and the edge.', () => {
        const ws = {}; w1.forEach(w => { ws[w.key] = w.pos; });
        [['etaUMa', 'zetUMa'], ['zetUMa', 'epsUMa'], ['epsUMa', 'delUMa'], ['delUMa', 'gamUMa'], ['gamUMa', 'betUMa'], ['betUMa', 'alpUMa'], ['alpUMa', 'delUMa'], ['betCas', 'alpCas'], ['alpCas', 'gamCas'], ['gamCas', 'delCas'], ['delCas', 'epsCas']].forEach(([a, b]) => k.seg(ws[a], ws[b], { cls: 'curve' }));
        k.seg(ws.betUMa, ws.alpUMi, { cls: 'aux', dash: true });
      });
    }
  });

  /* ================================================================= all-sky charts: Hammer */
  const HAM = { u: 50 };
  /* Hammer's equal-area projection of the sphere, unit radius: x in [-2.83, 2.83], y in [-1.41, 1.41] (longitude and latitude in degrees) */
  const hammer = (lon, lat) => { const l = lon * D2R, f = lat * D2R, d = sqrt(1 + cos(f) * cos(l / 2)); return [2 * Math.SQRT2 * cos(f) * sin(l / 2) / d, Math.SQRT2 * sin(f) / d]; };
  const hamPt = (l, b) => { const S = SKY(); const lp = S.rev180(l), q = hammer(lp, b); return { x: -HAM.u * q[0], y: HAM.u * q[1] }; };       // galactic longitude increases to the left
  function hamLandmarks() {
    const S = SKY(); if (!S) return [];
    const dsky = nm => S.deepSky.find(o => o.name.indexOf(nm) === 0);
    const star = key => S.star(key);
    const list = [['Galactic centre', dsky('Galactic centre')], ['Andromeda galaxy', dsky('Andromeda')], ['Orion Nebula', dsky('Orion')], ['Large Magellanic Cloud', dsky('Large')], ['Small Magellanic Cloud', dsky('Small')], ['Deneb', star('alpCyg')], ['Sirius', star('alpCMa')], ['Acrux', star('alpCru')], ['Polaris', star('alpUMi')]];
    return list.map(([name, o]) => { const gl = S.eqToGal(o.ra, o.dec); return { name, l: gl.l, b: gl.b }; });
  }
  function hammerNote() {
    if (!SKY()) return '';
    const lm = hamLandmarks();
    return 'Hammer\'s projection is Lambert\'s azimuthal equal-area map of one hemisphere, doubled in width: for longitude λ and latitude φ (here galactic $l$ and $b$) the point is $x = 2\\sqrt2\\,\\cos\\varphi\\,\\sin\\frac{\\lambda}{2}\\big/\\sqrt{1+\\cos\\varphi\\cos\\frac{\\lambda}{2}}$ and $y = \\sqrt2\\,\\sin\\varphi\\big/\\sqrt{1+\\cos\\varphi\\cos\\frac{\\lambda}{2}}$, in units of the sphere\'s radius. The boundary $\\lambda = \\pm180°$ is an ellipse of semi-axes $2\\sqrt2$ and $\\sqrt2$, which is why it can be drawn by the **auxiliary-circle method**; the equator and the central meridian are straight and graduated unequally; every other meridian and parallel is a curve through points found from the table. Equal areas on the sphere are equal areas on the sheet, so the Milky Way\'s band and the number of stars per square degree can be compared directly. Here the unit is 50, the centre is the Galactic centre and galactic longitude increases to the left, as on the all-sky pictures of the Milky Way; for an equatorial map put right ascension 12h in the middle and let it increase to the left as on star atlases. Landmarks (galactic longitude and latitude from their right ascension and declination):' +
      mdTable(['object', 'l', 'b'], lm.map(o => [o.name, fx(o.l, 1) + '°', fx(o.b, 1) + '°']));
  }
  Hyper.construction({
    id: 'sm-hammer-grid',
    title: 'An all-sky chart: the Hammer grid in galactic coordinates, point by point',
    tags: ['Hammer', 'all-sky chart', 'equal-area', 'auxiliary circle', 'galactic'],
    note: hammerNote(),
    build(k) {
      const u = HAM.u, a = 2 * Math.SQRT2 * u, b = Math.SQRT2 * u;
      const O = k.pt(0, 0);
      const eqx = l => -u * hammer(l, 0)[0], cmy = bl => u * hammer(0, bl)[1];
      k.given('The centre O of the map, with the horizontal equator and the vertical central meridian, and the unit u = 50 (the radius of the sphere on the sheet). The map is an ellipse 4√2 u = 283 wide and 2√2 u = 141 high.', () => {
        k.point(O, 'O', 'se');
        const gA = k.pt(-a, -b - 22), gB = k.pt(-a + u, -b - 22);
        k.seg(gA, gB, { cls: 'given' }); k.tick(gA, k.pt(1, 0)); k.tick(gB, k.pt(1, 0)); k.dim(gA, gB, 'u = 50', { dist: 1.3 });
        k.frame(-a - 28, -b - 38, a + 28, a + 10);
      });
      k.step('tee', 'Draw the equator (b = 0°) and the central meridian (l = 0°) through O, at right angles. Both stay straight on this map.', () => {
        k.seg(k.pt(-a * 1.04, 0), k.pt(a * 1.04, 0), { cls: 'cons' }); k.seg(k.pt(0, -b * 1.1), k.pt(0, b * 1.1), { cls: 'cons' });
      });
      k.step('compass', 'For the edge ellipse draw two quarter circles about O, in the first quadrant: one of radius 2√2 u = 141 (the semi-major axis) and one of radius √2 u = 71 (the semi-minor axis).', () => {
        k.arc(O, a, 0, PI / 2, { cls: 'aux' }); k.arc(O, b, 0, PI / 2, { cls: 'aux' });
      });
      const rays = [15, 30, 45, 60, 75];
      k.step('protractor', 'Draw rays from O every 15° (only the first quadrant is needed; the ellipse is symmetric).', () => {
        rays.forEach(t => k.seg(O, ccw(O, a, t), { cls: 'cons' }));
      });
      k.step('square', 'Where a ray meets the large circle drop a vertical; where it meets the small circle run a horizontal. The two meet on the ellipse: x = 141 cos t, y = 71 sin t. Mark the five points.', () => {
        rays.forEach(t => { const B1 = ccw(O, a, t), S1 = ccw(O, b, t), E1 = k.pt(B1.x, S1.y); k.seg(B1, E1, { cls: 'cons' }); k.seg(S1, E1, { cls: 'cons' }); k.point(E1, '', 'ne'); });
      });
      k.step('pencil', 'Reflect the points into the other three quadrants and draw the ellipse through them: the edge of the map, l = ±180° (the meridian at the back of the sphere, split in two).', () => {
        k.ellipse(O, a, b, { cls: 'thick' });
      });
      const lons = [30, 60, 90, 120, 150];
      k.step('ruler', 'Graduate the equator. Lay off x = 2√2 sin(l/2) / √(1 + cos(l/2)) × u from O for l = 30°, 60°, 90°, 120°, 150°: ' + lons.map(l => fx(abs(eqx(l)), 1)).join(', ') + ' (141.4 at 180°). Longitude increases to the left; the right side of the map is the same, with l counted from 360° downwards.', () => {
        lons.forEach(l => { const x = eqx(l); k.point(k.pt(x, 0), '', 's'); k.point(k.pt(-x, 0), '', 's'); k.label(k.pt(x, 0), String(l) + '°', 's', { upright: true, size: 0.6, dist: 0.6 }); });
      });
      const lats = [30, 60];
      k.step('ruler', 'Graduate the central meridian. Lay off y = √2 sin b / √(1 + cos b) × u up and down for b = 30° and 60°: ' + lats.map(bl => fx(cmy(bl), 1)).join(' and ') + ' from the equator; 90° is at the end of the ellipse, 70.7.', () => {
        lats.forEach(bl => { const y = cmy(bl); k.point(k.pt(0, y), '', 'e'); k.point(k.pt(0, -y), '', 'e'); k.label(k.pt(0, y), bl + '°', 'e', { upright: true, size: 0.6, dist: 0.6 }); });
      });
      const ip = [];
      [-120, -60, 60, 120].forEach(l => [-60, -30, 30, 60].forEach(bl => { const q = hammer(l, bl); ip.push({ l, b: bl, pt: k.pt(-u * q[0], u * q[1]) }); }));
      k.step('ruler', 'Where the parallels b = ±30°, ±60° cross the meridians l = ±60°, ±120° compute both coordinates from the formula (the table in the note) and mark the sixteen points: they pin down the curves.', () => {
        ip.forEach(o => k.point(o.pt, '', 'ne'));
      });
      k.step('pencil', 'Draw the four parallels through their points and the central meridian: they are curves bowing away from the equator, flatter near the centre and steeper near the edge.', () => {
        [-60, -30, 30, 60].forEach(bl => { const pts = []; for (let l = -180; l <= 180; l += 4) { const q = hammer(l, bl); pts.push([-u * q[0], u * q[1]]); } k.curve(pts, null, { cls: 'curve' }); });
      });
      k.step('pencil', 'Draw the meridians l = ±30° … ±150° the same way: each runs from pole to pole through its points on the equator and the parallels, and they all cut the equator at right angles.', () => {
        [-150, -120, -90, -60, -30, 30, 60, 90, 120, 150].forEach(l => { const pts = []; for (let bl = -90; bl <= 90; bl += 3) { const q = hammer(l, bl); pts.push([-u * q[0], u * q[1]]); } k.curve(pts, null, { cls: 'curve' }); });
      });
      const lm = hamLandmarks();
      k.step('ruler', 'Plot the landmarks of the table in the note: the Galactic centre in the middle, Deneb and the Cygnus region to the left, Crux to the right, the Magellanic clouds and Andromeda off the plane. Longitude increases to the left.', () => {
        lm.forEach(o => { const p = hamPt(o.l, o.b); k.point(p, '', 'ne'); });
        lm.forEach(o => { const p = hamPt(o.l, o.b); k.label(p, o.name.replace('Large Magellanic Cloud', 'LMC').replace('Small Magellanic Cloud', 'SMC').replace('Andromeda galaxy', 'M31').replace('Orion Nebula', 'M42').replace('Galactic centre', 'GC'), 'ne', { upright: true, size: 0.6, dist: 0.7, fill: '#0b4fa0' }); });
      });
    }
  });

  /* ================================================================= sun-path diagrams */
  const SUNP = { lat: 51.5, R: 150, hours: [8, 10, 12, 14, 16], eps: 23.44 };
  const sunDates = [{ name: '21 December', short: 'Dec', dec: -SUNP.eps, cls: 'curve' }, { name: '21 March and 23 September', short: 'Equinox', dec: 0, cls: 'curve' }, { name: '21 June', short: 'Jun', dec: SUNP.eps, cls: 'curve' }];
  /* altitude and azimuth of the Sun at hour angle H (degrees, noon = 0) on a day of declination dec */
  function sunAltAz(dec, H) { const S = SKY(), h = eqToHor(0, dec, H, SUNP.lat); return { alt: h.alt, az: h.az }; }
  /* the plan of the stereographic diagram: north up, east on the right */
  const sunXY = (alt, az) => { const r = sr(SUNP.R, 90 - alt); return { x: r * sin(az * D2R), y: r * cos(az * D2R), r }; };
  function sunNote() {
    if (!SKY()) return '';
    const rows = [];
    sunDates.forEach(d => SUNP.hours.forEach(t => { const h = sunAltAz(d.dec, 15 * (t - 12)); rows.push([d.name, t + ':00', fx(h.alt, 1) + '°', fx(h.az, 1) + '°', fx(sr(SUNP.R, 90 - h.alt), 1)]); }));
    const R = SUNP.R, phi = SUNP.lat;
    const circ = sunDates.map(d => { const rn = sr(R, phi - d.dec), rl = sr(R, 180 - phi - d.dec); return [d.name, fx(d.dec, 2) + '°', fx(90 - phi + d.dec, 1) + '°', fx((rl - rn) / 2, 1), fx((rl + rn) / 2, 1)]; });
    return 'The diagram is a plan of the sky: the zenith at the centre, the horizon at the rim, north up and east on the **right** (the view from above, the opposite of an all-sky photograph). It is stereographic, $r = R\\tan\\frac{90° - h}{2}$ with $R = 150$, so each daily path of the Sun — a small circle of the sky — is an exact circular arc and the circles of equal altitude stay circles. Latitude 51.5° N (London), solar time (the clock hour differs by the equation of time and the longitude). Altitude, azimuth and radius at two-hour steps from the engine:' + mdTable(['day', 'solar time', 'altitude h', 'azimuth A', 'radius r'], rows) +
      'Each path is the circle through the noon point (on the meridian, below the centre) and the lower-culmination point on the north meridian; its centre and radius in this drawing are:' + mdTable(['day', 'declination δ', 'noon altitude', 'centre y (north up)', 'radius'], circ) + 'The winter circle has a radius of more than two horizon radii: use a beam compass, a trammel or a flexible curve, or draw it through its points as here.';
  }
  Hyper.construction({
    id: 'sm-sun-path-diagram',
    title: 'The sun-path diagram for 51.5° N: the Sun\'s three roads, point by point',
    tags: ['sun path', 'stereographic', 'solstice', 'compass', 'architecture'],
    note: sunNote(),
    build(k) {
      const g = k.g, R = SUNP.R, phi = SUNP.lat, Z = k.pt(0, 0);
      const at = (r, az) => k.pt(r * sin(az * D2R), r * cos(az * D2R));
      const pts = sunDates.map(d => SUNP.hours.map(t => { const h = sunAltAz(d.dec, 15 * (t - 12)), q = sunXY(h.alt, h.az); return { t, alt: h.alt, az: h.az, p: k.pt(q.x, q.y) }; }));
      const circle = d => { const rn = sr(R, phi - d.dec), rl = sr(R, 180 - phi - d.dec); return { c: k.pt(0, (rl - rn) / 2), r: (rl + rn) / 2, noon: k.pt(0, -rn) }; };
      const arcPath = (c, rho) => { const pp = g.circleCircle(c, rho, Z, R); if (pp.length < 2) return null; const t1 = atan2(pp[0].y - c.y, pp[0].x - c.x), t2 = atan2(pp[1].y - c.y, pp[1].x - c.x); const span = ((t2 - t1) % (2 * PI) + 2 * PI) % (2 * PI); const mid = { x: c.x + rho * cos(t1 + span / 2), y: c.y + rho * sin(t1 + span / 2) }; return g.dist(mid, Z) <= R ? [t1, t1 + span] : [t2, t2 + 2 * PI - span]; };
      k.given('The zenith Z at the centre, the horizon circle of radius R = 150, north up and east on the RIGHT (a plan, seen from above). The latitude is 51.5° N; the Sun\'s declination is −23.44° on 21 December, 0° at the equinoxes and +23.44° on 21 June.', () => {
        k.circle(Z, R, { cls: 'given' }); k.point(Z, 'Z', 'ne');
        k.label(at(R, 0), 'N', 'n', { upright: true }); k.label(at(R, 90), 'E', 'e', { upright: true }); k.label(at(R, 180), 'S', 's', { upright: true }); k.label(at(R, 270), 'W', 'w', { upright: true });
        k.frame(-R - 18, -R - 16, R + 18, R + 16);
      });
      k.step('tee', 'Draw the north–south line and the east–west line through Z.', () => {
        k.seg(at(R, 0), at(R, 180), { cls: 'cons' }); k.seg(at(R, 90), at(R, 270), { cls: 'cons' });
      });
      const rings = [75, 60, 45, 30, 15];
      k.step('ruler', 'Mark the circles of equal altitude on the north line from the tangent table r = 150 tan((90° − h)/2): h = 75° → 19.7, 60° → 40.2, 45° → 62.1, 30° → 86.6, 15° → 115.1.', () => {
        rings.forEach(h => { k.point(at(sr(R, 90 - h), 0), '', 'e'); k.label(at(sr(R, 90 - h), 0), h + '°', 'e', { upright: true, size: 0.62, dist: 0.7 }); });
      });
      k.step('compass', 'Draw the five altitude circles about Z. They are not equally spaced: the stereographic projection crowds the zenith and spreads the horizon (the angle to the zenith is halved, then its tangent taken).', () => {
        rings.forEach(h => k.circle(Z, sr(R, 90 - h), { cls: 'cons' }));
      });
      k.step('protractor', 'Every 30° from north draw the azimuth lines (east at 90° on the right, south at 180° down).', () => {
        for (let a = 30; a < 360; a += 30) if (a % 90) { k.seg(Z, at(R, a), { cls: 'cons' }); k.label(at(R * 1.0, a), String(a) + '°', 'c', { upright: true, size: 0.6, dist: 0.9 }); }
      });
      sunDates.forEach((d, i) => {
        const p = pts[i].filter(o => o.alt > 0);
        const hrs = p.map(o => o.t + ':00').join(', ');
        k.step('protractor', d.name + ' (δ = ' + fx(d.dec, 2) + '°): at ' + hrs + ' solar time the Sun is above the horizon at the azimuths ' + p.map(o => fx(o.az, 0) + '°').join(', ') + '. Draw those radii lightly from Z.', () => {
          p.forEach(o => { k.seg(Z, at(R * 0.98, o.az), { cls: 'aux', dash: true }); });
        });
        k.step('ruler', 'Mark the Sun on each radius at r = 150 tan((90° − h)/2). The altitudes are ' + p.map(o => fx(o.alt, 1) + '°').join(', ') + ', giving r = ' + p.map(o => fx(sr(R, 90 - o.alt), 1)).join(', ') + '. Letter the hours.', () => {
          p.forEach(o => { k.point(o.p, '', 'ne'); k.label(o.p, o.t + 'h', 'ne', { upright: true, size: 0.55, dist: 0.6 }); });
        });
      });
      const cs = sunDates.map(circle);
      k.step('square', 'The path through the equinox points is a circle. To find its centre join the noon point to the 14:00 point, erect the perpendicular at the middle of that chord with the set square and see where it cuts the north–south line: that is the centre (by symmetry about the meridian it lies on it).', () => {
        const a1 = pts[1][2].p, a2 = pts[1][3].p, m = g.mid(a1, a2), dd = g.perp(g.sub(a2, a1));
        k.seg(a1, a2, { cls: 'cons' });
        k.seg(g.lerp(m, k.pt(0, cs[1].c.y), -0.1), g.lerp(m, k.pt(0, cs[1].c.y), 1.15), { cls: 'cons' });
        k.point(cs[1].c, 'C', 'ne');
      });
      k.step('compass', 'With the beam compass at C draw the equinox path through the five points, from sunrise on the east point E over the noon point to sunset on W. The same construction gives the 21 June path: its centre is nearer and its radius smaller.', () => {
        [cs[1], cs[2]].forEach(o => { const ar = arcPath(o.c, o.r); if (ar) k.arc(o.c, o.r, ar[0], ar[1], { cls: 'curve' }); });
        k.label(cs[1].noon, 'equinox', 'sw', { upright: true, size: 0.65, fill: '#0b4fa0', dist: 1.2 });
        k.label(cs[2].noon, 'June', 'sw', { upright: true, size: 0.65, fill: '#0b4fa0', dist: 1.2 });
      });
      k.step('pencil', 'The 21 December path has a radius of 357, longer than a compass reaches; join its points with a flexible curve between sunrise (south-east, azimuth about 130°) and sunset, a flat arc just above the southern horizon.', () => {
        const o = cs[0], ar = arcPath(o.c, o.r), pp = []; if (ar) for (let i = 0; i <= 60; i++) { const t = ar[0] + (ar[1] - ar[0]) * i / 60; pp.push([o.c.x + o.r * cos(t), o.c.y + o.r * sin(t)]); }
        k.curve(pp, null, { cls: 'curve' });
        k.label(cs[0].noon, 'December', 'sw', { upright: true, size: 0.65, fill: '#0b4fa0', dist: 1.2 });
      });
      k.step('pencil', 'Join the same hour of the three days with a curve: the hour lines (dashed here) cross the three paths and read the time of day. The 12:00 line is the north–south line itself.', () => {
        SUNP.hours.forEach(t => { const pp = []; for (let dd = -SUNP.eps; dd <= SUNP.eps + 1e-9; dd += 1.5) { const h = sunAltAz(dd, 15 * (t - 12)); if (h.alt > 0) { const q = sunXY(h.alt, h.az); pp.push([q.x, q.y]); } } if (t !== 12 && pp.length > 1) k.curve(pp, null, { cls: 'red', dash: true }); });
      });
    }
  });

  /* ================================================================= the analemma */
  const ANA = { year: 2025, ex: 4, ey: 5 };
  function anaRows() {
    const S = SKY(); if (!S) return [];
    const out = [], mn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    for (let m = 1; m <= 12; m++) [1, 15].forEach(d => { const jd = S.jdUT(ANA.year, m, d, 12), s = S.sun(jd), e = S.equationOfTime(jd); out.push({ label: d + ' ' + mn[m - 1], eot: e, dec: s.dec, x: ANA.ex * e, y: ANA.ey * s.dec }); });
    return out;
  }
  function anaNote() {
    if (!SKY()) return '';
    const rows = anaRows();
    return 'At clock noon (local mean time) the Sun is not on the meridian: when the sundial is **ahead** of the clock (the equation of time is positive, as in November) the Sun has already passed it and stands to the **west**, to the right as you face south; when the sundial is behind (February) it stands to the east. Its height changes with the declination. Plot the declination upwards and the equation of time across, and a year draws a **figure of eight**: the two loops are unequal because the two causes of the equation of time — the Earth\'s elliptical orbit and the tilt of the ecliptic — add in winter and nearly cancel in summer. The horizontal scale here is stretched 3.2 times (1 minute of time is 0.25° of the Sun\'s motion across the sky, drawn as 4 units, against 5 units to the degree of declination); at true scale the figure is 7.6° wide and 47° high. At noon at latitude φ the altitude is $90° - \\varphi + \\delta$. Values for ' + ANA.year + ' at 12:00 UT, the engine\'s:' +
      mdTable(['date', 'equation of time (min)', 'declination'], rows.map(r => [r.label, (r.eot >= 0 ? '+' : '') + fx(r.eot, 1).replace('−', '−'), fx(r.dec, 1) + '°']));
  }
  Hyper.construction({
    id: 'sm-analemma',
    title: 'The analemma: the figure of eight from the equation of time and the declination',
    tags: ['analemma', 'equation of time', 'declination', 'sundial'],
    note: anaNote(),
    build(k) {
      const S = SKY(), ex = ANA.ex, ey = ANA.ey, rows = anaRows();
      const O = k.pt(0, 0);
      const xr = 80, yr = 25 * ey;
      k.given('Two scales crossing at O: the declination up (5 units to the degree, from −25° to +25°) and the equation of time across (4 units to the minute, from −20 to +20 minutes), positive to the right. The Sun at clock noon stands to the right of the meridian when the sundial is ahead of the clock.', () => {
        k.axes(O, { x: [-xr, xr], y: [-yr, yr], labels: false, cls: 'axis' });
        k.text(xr - 6, -16, 'equation of time (min)', { size: 0.62, upright: true, anchor: 'end' }); k.text(14, yr + 8, 'declination', { size: 0.62, upright: true, anchor: 'start' });
        [-20, -15, -10, -5, 5, 10, 15, 20].forEach(m => { k.tick(k.pt(m * ex, 0), k.pt(0, 1)); k.label(k.pt(m * ex, 0), (m > 0 ? '+' : '−') + Math.abs(m), 's', { upright: true, size: 0.55, dist: 0.7 }); });
        [-20, -10, 10, 20].forEach(d => { k.tick(k.pt(0, d * ey), k.pt(1, 0)); k.label(k.pt(0, d * ey), (d > 0 ? '+' : '−') + Math.abs(d) + '°', 'e', { upright: true, size: 0.55, dist: 0.6 }); });
        k.grid(-xr, -yr, xr, yr, 20, { cls: 'aux' });
        k.frame(-xr - 28, -yr - 14, xr + 34, yr + 16);
      });
      k.step('ruler', 'From the table in the note plot the Sun at clock noon on the 1st and 15th of every month: across x = 4 × (equation of time in minutes), up y = 5 × (declination in degrees). That is twenty-four points.', () => {
        rows.forEach(r => k.point(k.pt(r.x, r.y), '', 'ne'));
        rows.filter((r, i) => i % 2 === 0).forEach(r => k.label(k.pt(r.x, r.y), r.label.replace(/^1 /, ''), r.x > 0 ? 'e' : 'w', { upright: true, size: 0.5, dist: 0.7 }));
      });
      k.step('pencil', 'Join the points in date order with one smooth curve, from 1 January round to 15 December and back: it crosses itself once, where the points of mid-April and early September almost coincide, and makes a figure of eight with a small upper loop and a larger lower one.', () => {
        const pts = []; const jd1 = S.jdUT(ANA.year, 1, 1, 12);
        for (let d = 0; d <= 365; d += 1) { const jd = jd1 + d, e = S.equationOfTime(jd), dec = S.sun(jd).dec; pts.push([ex * e, ey * dec]); }
        k.curve(pts, null, { cls: 'curve' });
      });
      const ext = [['11 Feb', 41], ['14 May', 133], ['26 Jul', 206], ['3 Nov', 306]];
      k.note('The four extremes of the equation of time are the points where the curve is farthest left or right: −14.2 min about 11 February, +3.6 min about 14 May, −6.6 min about 26 July and +16.4 min about 3 November. The curve crosses the vertical axis four times a year, when the clock and the sundial agree: about 15 April, 13 June, 1 September and 25 December.', () => {
        const jd1 = S.jdUT(ANA.year, 1, 1, 12);
        ext.forEach(([nm, d]) => { const jd = jd1 + d, e = S.equationOfTime(jd), dec = S.sun(jd).dec, p = k.pt(ex * e, ey * dec); k.point(p, '', 'e', { open: true }); k.label(p, nm, e > 0 ? 'e' : 'w', { upright: true, size: 0.58, dist: 1.0, fill: '#b03a2e' }); });
      });
    }
  });

  /* ================================================================= sundials */
  const DIAL = { lat: 32, m: 100 };
  /* the angle of the hour line k hours from noon on a horizontal dial: tan θ = sin φ tan 15°k */
  const hourAngle = (phi, kh) => atan2(sin(phi * D2R) * tan(kh * 15 * D2R), 1) * R2D;
  function dialNote() {
    const phi = DIAL.lat;
    const rows = [1, 2, 3, 4, 5].map(kh => [(12 - kh) + ' and ' + (12 + kh), fx(15 * kh, 0) + '°', fx(hourAngle(phi, kh), 1) + '°', fx(DIAL.m * sin(phi * D2R) * tan(15 * kh * D2R), 1)]);
    return 'On a **horizontal** dial the hour lines radiate from the foot O of the style, which is the edge of the gnomon, a right-angled triangle standing on the noon line with its sloping edge at the angle φ of the latitude to the plate and pointing at the celestial pole. The hour line for a Sun $15°\\times k$ from the meridian makes the angle θ with the noon line given by $\\tan\\theta = \\sin\\varphi\\,\\tan 15°k$; at 6 o\'clock it is the east–west line. The construction is that formula folded flat: an **equatorial dial** (hour lines 15° apart, perpendicular to the style) cuts the plate along the east–west line through M, and swinging it down onto the paper puts its centre C at distance $OM\\sin\\varphi$ from M. For φ = 32° and OM = 100:' + mdTable(['hours', 'Sun from the meridian', 'hour line θ from the noon line', 'cut T on the line through M (right of the noon line)'], rows) + 'The cut for 5 and 7 o\'clock lies far outside the plate: draw those two lines with the protractor at O. The plate faces the sky, so the dial is read with north up; the morning hours are on the west (left) side. For a **vertical** south-facing dial use $\\cos\\varphi$ in place of $\\sin\\varphi$. The shadow-edge of the style tells solar time, which differs from the clock by the equation of time, the longitude and any summer time.';
  }
  Hyper.construction({
    id: 'sm-horizontal-sundial',
    title: 'A horizontal sundial for 32° N by the classical construction from the equatorial dial',
    tags: ['sundial', 'gnomonic', 'gnomon', 'straightedge', 'protractor'],
    note: dialNote(),
    build(k) {
      const g = k.g, phi = DIAL.lat, m = DIAL.m, ph = phi * D2R;
      const O = k.pt(0, 0), M = k.pt(0, m);
      const X0 = -118, X1 = 118, Y0 = -24, Y1 = 150;
      const clipHour = th => {                                        // end of an hour line leaving the plate (th: degrees from the noon line, + to the right)
        const t = tan(abs(th) * D2R), yEnd = t < 1e-9 ? Y1 : Math.min(Y1, X1 / t);
        return k.pt((th < 0 ? -1 : 1) * yEnd * t, yEnd);
      };
      k.given('The plate (a square slab) with the noon line running north, up the sheet, from the dial centre O (the foot of the style); the point M on it, 100 north of O; and the latitude φ = 32°.', () => {
        k.rect(X0, Y0, X1, Y1, { cls: 'given' });
        k.seg(O, k.pt(0, Y1), { cls: 'given' });
        k.point(O, 'O', 'se'); k.point(M, 'M', 'ne');
        k.frame(X0 - 8, Y0 - 12, X1 + 14, Y1 + 16);
      });
      const Cq = g.foot(M, O, ccw(O, 100, 90 - phi));            // foot of the perpendicular from M to the style line
      k.step('protractor', 'At O lay off the angle φ = 32° from the noon line, towards the right: this is the style (the sloping edge of the gnomon) folded flat into the plate about the noon line.', () => {
        k.seg(O, ccw(O, 112, 90 - phi), { cls: 'cons' });
        k.angle(O, ccw(O, 40, 90 - phi), M, { label: 'φ', r: 2.2 });
        k.label(ccw(O, 112, 90 - phi), 'style', 'e', { upright: true, size: 0.7 });
      });
      k.step('square', 'From M drop the perpendicular to the style, with the set square: the foot C′ makes the right angle O C′ M. Its length MC′ = OM sin φ = 53.0 is the distance from the centre of the equatorial dial to the plate.', () => {
        k.seg(M, Cq, { cls: 'cons' }); k.right(Cq, M, O, { r: 0.7 }); k.point(Cq, 'C′', 'e');
      });
      const Cc = k.pt(0, m - g.dist(M, Cq));
      k.step('compass', 'With centre M and radius MC′ swing an arc down onto the noon line: it cuts it at C″ = 47.0 from O. C″ is where the centre of the equatorial dial lands when that dial is folded down onto the plate about the east–west line through M.', () => {
        k.arc3(M, Cc, Cq, { cls: 'cons' }); k.point(Cc, 'C″', 'ne');
      });
      k.step('tee', 'Through M draw the east–west line across the plate with the T-square. It is where the plane of the equatorial dial meets the plate.', () => {
        k.seg(k.pt(X0, m), k.pt(X1, m), { cls: 'cons' });
      });
      const kh = [1, 2, 3, 4];
      const T = kh.map(h => m * sin(ph) * tan(15 * h * D2R));
      k.step('protractor', 'At C″ lay off the angles 15°, 30°, 45° and 60° from the noon line, on both sides: the equatorial dial\'s hour lines, 15° to the hour. They cut the line through M at T₁ … T₄, ' + T.map(t => fx(t, 1)).join(', ') + ' from the noon line.', () => {
        kh.forEach((h, i) => { [-1, 1].forEach(s => { const Tp = k.pt(s * T[i], m); k.seg(Cc, Tp, { cls: 'cons' }); k.point(Tp, '', 'n'); }); });
        kh.forEach((h, i) => k.label(k.pt(T[i], m), String(15 * h) + '°', 'ne', { upright: true, size: 0.6, dist: 0.7 }));
      });
      k.step('straightedge', 'Join O to each T and extend the lines to the edge of the plate. These are the hour lines for 11 and 1, 10 and 2, 9 and 3, 8 and 4 o\'clock: the angle each makes with the noon line is the one in the table.', () => {
        kh.forEach((h, i) => { [-1, 1].forEach(s => { const th = s * hourAngle(phi, h); k.seg(O, clipHour(th), { cls: 'cons' }); }); });
      });
      k.step('protractor', 'The 7 and 5 o\'clock lines are too steep for the construction (their cut is 198 away): set the protractor at O and draw them at ' + fx(hourAngle(phi, 5), 1) + '° on either side of the noon line. The 6 o\'clock line is the east–west line through O.', () => {
        [-1, 1].forEach(s => k.seg(O, clipHour(s * hourAngle(phi, 5)), { cls: 'cons' }));
        k.seg(k.pt(X0, 0), k.pt(X1, 0), { cls: 'cons' });
      });
      k.step('pencil', 'Ink the thirteen hour lines from O, number them (morning on the west, left; afternoon on the east, right) and draw the base of the gnomon on the noon line from O northwards: the style stands over it at the angle φ, its shadow falling along the hour line of the time.', () => {
        for (let h = -6; h <= 6; h++) { const th = h === 0 ? 0 : h < 0 ? -hourAngle(phi, -h) : hourAngle(phi, h); const E = h === 6 || h === -6 ? k.pt((h < 0 ? X0 : X1), 0) : clipHour(th); k.seg(O, E, { cls: 'thick' }); k.label(E, String(h < 0 ? 12 + h : h === 0 ? 12 : h), h === 0 ? 'n' : (h < 0 ? 'nw' : 'ne'), { upright: true, size: 0.75 }); }
        k.seg(O, k.pt(0, 62), { cls: 'red', width: 4 });
        k.label(k.pt(0, 62), 'gnomon', 'nw', { upright: true, size: 0.7, fill: '#b03a2e' });
      });
    }
  });

  Hyper.construction({
    id: 'sm-equatorial-dial',
    title: 'The equatorial dial: its face and its elevation',
    tags: ['sundial', 'equatorial', 'protractor', 'square'],
    note: 'The equatorial dial is the simplest dial and the cleanest gnomonic projection: the plate is perpendicular to the Earth\'s axis, so the Sun moves round the style at 15° an hour and the hour lines are equally spaced, whatever the date and the latitude. Tilt the plate so that its normal, and the style which is its axis, point at the celestial pole: the style rises from the horizon at the angle φ of the latitude, and the plate leans at 90° − φ to the horizontal. The north face is lit from the spring equinox to the autumn one, the south face in the other half of the year, and at the equinoxes the Sun is in the plane of the plate and nothing can be read. Seen from the north, noon is at the bottom and the hours run clockwise, like the hands of a clock.',
    build(k) {
      const g = k.g, phi = 32, rho = 80;
      const F = k.pt(-110, 0), D = k.pt(70, 20), gy = -85;
      const dirA = ccw(k.pt(0, 0), 1, phi);                            // the style: rises at φ towards the north (right in this view from the east)
      const plateDir = ccw(k.pt(0, 0), 1, phi + 90);
      k.given('Left, the face of the plate seen from the north: its centre F and the vertical noon line pointing DOWN (at noon the shadow of the style falls towards the ground). Right, the dial seen from the east: the ground line, the centre D of the plate above it, north to the right; the latitude is φ = 32°.', () => {
        k.point(F, 'F', 'ne'); k.seg(F, k.pt(F.x, F.y - rho * 1.08), { cls: 'given' });
        k.seg(k.pt(-10, gy), k.pt(190, gy), { cls: 'given' }); k.hatch([k.pt(-10, gy), k.pt(190, gy), k.pt(190, gy - 8), k.pt(-10, gy - 8)], { gap: 0.6 });
        k.point(D, 'D', 'sw');
        k.label(k.pt(0, gy), 'ground', 'n', { upright: true, size: 0.7 });
        k.frame(-210, gy - 22, 255, rho + 70);
      });
      k.step('compass', 'Face: draw the circle of the plate about F, radius 80.', () => {
        k.circle(F, rho, { cls: 'given' });
      });
      k.step('protractor', 'Face: from the noon line, every 15° round F draw the hour lines for 6 in the morning to 6 in the evening, clockwise from the noon line at the bottom (afternoon hours on the left, morning on the right). They are equally spaced.', () => {
        for (let h = -6; h <= 6; h++) { const a = 180 + 15 * h; k.seg(F, clk(F, rho, a), { cls: h === 0 ? 'cons' : 'cons' }); k.label(clk(F, rho + 3, a), String(h < 0 ? 12 + h : h === 0 ? 12 : h), h < 0 ? 'e' : h === 0 ? 's' : 'w', { upright: true, size: 0.7, dist: 0.8 }); }
      });
      const Dn = k.pt(D.x, D.y), tipS = g.add(Dn, g.mul(dirA, 135)), plA = g.add(Dn, g.mul(plateDir, rho)), plB = g.sub(Dn, g.mul(plateDir, rho));
      k.step('protractor', 'Elevation: at D lay off the angle φ = 32° above the horizontal towards the north (right). This is the style, the axis of the dial; it points at the celestial pole.', () => {
        k.seg(k.pt(D.x - 40, D.y), k.pt(D.x + 80, D.y), { cls: 'cons', dash: true });
        k.seg(Dn, tipS, { cls: 'cons' });
        k.angle(Dn, k.pt(D.x + 60, D.y), tipS, { label: 'φ', r: 2.2 });
        k.label(tipS, 'to the pole', 'e', { upright: true, size: 0.7 });
      });
      k.step('square', 'Elevation: through D draw the perpendicular to the style with the set square: the plate seen edge-on. It leans back at 90° − φ = 58° to the horizontal.', () => {
        k.seg(plB, plA, { cls: 'cons' });
        k.right(Dn, tipS, plA, { r: 0.7 });
      });
      k.step('dividers', 'Elevation: carry the radius of the face, 80, from D along the plate on each side. The two ends are the top and bottom of the plate.', () => {
        k.point(plA, '', 'w'); k.point(plB, '', 'e');
      });
      k.step('pencil', 'Ink the plate as a thick line and the style as a rod through D; add the post and the base on the ground. The style meets the face at F: the face and the elevation are the same plate.', () => {
        k.seg(plB, plA, { cls: 'thick' }); k.seg(g.sub(Dn, g.mul(dirA, 20)), tipS, { cls: 'red', width: 4 });
        k.seg(Dn, k.pt(D.x, gy), { cls: 'thick' }); k.seg(k.pt(D.x - 28, gy), k.pt(D.x + 28, gy), { cls: 'thick' });
        k.label(plA, 'south edge', 'w', { upright: true, size: 0.65 }); k.label(plB, 'north edge', 'se', { upright: true, size: 0.65 });
      });
    }
  });

  /* ================================================================= the armillary sphere */
  const ARM = { R: 100, lat: 32, az: 145, el: 18, eps: 23.44 };
  const v3 = { dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], mul: (a, s) => [a[0] * s, a[1] * s, a[2] * s], unit: a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; } };
  /* the armillary model: the viewing frame (looking from azimuth `az`, altitude `el`) and the rings with their normals; world axes east, north, up */
  function armModel() {
    const S = SKY(), az = ARM.az * D2R, el = ARM.el * D2R;
    const c = [cos(el) * sin(az), cos(el) * cos(az), sin(el)], f = v3.mul(c, -1);
    const right = v3.unit(v3.cross(f, [0, 0, 1])), up = v3.cross(right, f);
    const scr = v => ({ x: v3.dot(v, right), y: v3.dot(v, up) });
    const phi = ARM.lat * D2R, pole = [0, cos(phi), sin(phi)];
    const e = eqToHor(270, 90 - ARM.eps, 0, ARM.lat), ecl = S.enu(e.alt, e.az);
    const R = ARM.R, se = sin(ARM.eps * D2R), ce = cos(ARM.eps * D2R);
    const rings = [
      { id: 'equator', name: 'celestial equator', n: pole, cen: [0, 0, 0], a: R },
      { id: 'horizon', name: 'horizon', n: [0, 0, 1], cen: [0, 0, 0], a: R },
      { id: 'meridian', name: 'meridian', n: [1, 0, 0], cen: [0, 0, 0], a: R },
      { id: 'ecliptic', name: 'ecliptic', n: ecl, cen: [0, 0, 0], a: R },
      { id: 'cancer', name: 'tropic of Cancer', n: pole, cen: v3.mul(pole, R * se), a: R * ce },
      { id: 'capricorn', name: 'tropic of Capricorn', n: pole, cen: v3.mul(pole, -R * se), a: R * ce }
    ].map(r => {
      const ctr = scr(r.cen), sn = scr(r.n), cosg = abs(v3.dot(r.n, f)), minorAng = Math.hypot(sn.x, sn.y) < 1e-9 ? 0 : atan2(sn.y, sn.x);
      return Object.assign(r, { centre: { x: ctr.x, y: ctr.y }, b: r.a * cosg, ratio: cosg, minorAng, clockwiseFromUp: R2D * atan2(sn.x, sn.y) });
    });
    return { scr, rings, pole, zenith: [0, 0, 1], f };
  }
  function armNote() {
    if (!SKY()) return '';
    const M = armModel();
    const rows = M.rings.map(r => [r.name, fx(r.a, 1), fx(r.b, 1), fx(r.ratio, 3), fx(((r.clockwiseFromUp % 180) + 180) % 180, 1) + '°', fx(r.centre.x, 1) + ', ' + fx(r.centre.y, 1)]);
    return 'An armillary sphere is the celestial sphere made of rings: the horizon, the meridian, the celestial equator and the ecliptic are great circles, the tropics small circles parallel to the equator, all about one axis. Seen in parallel projection a circle becomes an ellipse. **The rule:** a circle of radius $a$ in a plane with normal $\\hat n$, seen along a direction $\\hat v$, is an ellipse with semi-major axis $a$ (perpendicular to the projection of $\\hat n$) and semi-minor axis $b = a\\,|\\hat n\\cdot\\hat v|$ (along it). The drawing is the sphere seen from azimuth ' + ARM.az + '° (south-east) and altitude ' + ARM.el + '°, at latitude ' + ARM.lat + '° N, with R = 100, ε = 23.44° and the vernal equinox on the meridian. For each ring (lengths in drawing units; the minor-axis angle is measured clockwise from the vertical of the sheet; the centre is the offset of the ellipse from O):' + mdTable(['ring', 'a', 'b', 'b / a', 'minor axis', 'centre'], rows) + 'The sphere of the sky is seen from outside: every constellation drawn on it is the **mirror image** of the one seen from the ground, which is why the celestial globe\'s Orion looks back to front.';
  }
  /* the ellipse by the auxiliary-circle method: for rays at angles ts from the major axis e1 the points B (on the big circle), S (small circle), and E (on the ellipse) */
  function auxPoints(O, a, b, e1, e2, ts) {
    return ts.map(t => { const c = cos(t * D2R), s = sin(t * D2R), P = (u, v) => ({ x: O.x + u * e1.x + v * e2.x, y: O.y + u * e1.y + v * e2.y }); return { t, B: P(a * c, a * s), S: P(b * c, b * s), E: P(a * c, b * s), F: P(a * c, 0), G: P(0, b * s) }; });
  }
  Hyper.construction({
    id: 'sm-armillary-rings',
    title: 'The armillary sphere: great circles and tropics as ellipses by the auxiliary-circle method',
    tags: ['armillary', 'ellipse', 'auxiliary circle', 'ecliptic', 'celestial sphere'],
    note: armNote(),
    build(k) {
      const M = armModel(), R = ARM.R, O = k.pt(0, 0), g = k.g;
      const eq = M.rings[0];
      const dirOf = r => ({ minor: { x: cos(r.minorAng), y: sin(r.minorAng) }, major: { x: -sin(r.minorAng), y: cos(r.minorAng) } });
      const ringPt = (r, t) => { const d = dirOf(r), c = cos(t * D2R), s = sin(t * D2R); return k.pt(r.centre.x + r.a * c * d.major.x + r.b * s * d.minor.x, r.centre.y + r.a * c * d.major.y + r.b * s * d.minor.y); };
      const zenS = M.scr(M.zenith), polS = M.scr(M.pole);
      k.given('The outline of the sphere (a circle of radius R = 100 about O), the vertical through O (the zenith axis) and the polar axis through O, both as they appear from the viewing direction (the table in the note gives their angles). The pole stands at 32° above the north horizon; the view is from the south-east and slightly above.', () => {
        k.circle(O, R, { cls: 'given' }); k.point(O, 'O', 'se');
        k.seg(k.pt(-R * zenS.x * 1.1, -R * zenS.y * 1.1), k.pt(R * zenS.x * 1.1, R * zenS.y * 1.1), { cls: 'cons' });
        k.seg(k.pt(-R * polS.x * 1.25, -R * polS.y * 1.25), k.pt(R * polS.x * 1.25, R * polS.y * 1.25), { cls: 'given' });
        k.label(k.pt(R * zenS.x * 1.1, R * zenS.y * 1.1), 'zenith', 'n', { upright: true, size: 0.7 });
        k.label(k.pt(R * polS.x * 1.25, R * polS.y * 1.25), 'north pole', 'ne', { upright: true, size: 0.7 });
        k.frame(-R - 30, -R - 22, R + 38, R + 22);
      });
      const ev = dirOf(eq);
      const ts = [15, 30, 45, 60, 75];
      k.step('ruler', 'The equator ring is perpendicular to the polar axis. Its semi-major axis is R = 100, perpendicular to the projected axis; its semi-minor axis is b = R |n·v| = ' + fx(eq.b, 1) + ', along the projected axis. Lay both off from O.', () => {
        [1, -1].forEach(s => { k.point(k.pt(s * eq.b * ev.minor.x, s * eq.b * ev.minor.y), '', 'e'); k.point(k.pt(s * R * ev.major.x, s * R * ev.major.y), '', 'e'); });
      });
      k.step('compass', 'Draw the small auxiliary circle of radius b about O (the large one, radius 100, is the outline of the sphere already drawn).', () => {
        k.circle(O, eq.b, { cls: 'aux' });
      });
      const aux = auxPoints(O, R, eq.b, ev.major, ev.minor, ts);
      k.step('protractor', 'From the major axis measure 15°, 30°, 45°, 60° and 75° with the protractor at O and draw each ray out to the large circle.', () => {
        aux.forEach(o => k.seg(O, o.B, { cls: 'cons' }));
      });
      k.step('square', 'From the point where a ray meets the large circle draw a line parallel to the minor axis; from the point where it meets the small circle draw a parallel to the major axis. They cross on the ellipse. Mark the five points.', () => {
        aux.forEach(o => { k.seg(o.F, o.B, { cls: 'cons' }); k.seg(o.G, o.E, { cls: 'cons' }); k.point(o.E, '', 'ne'); });
      });
      k.step('pencil', 'Reflect the five points in the two axes and draw the ellipse of the celestial equator through them.', () => {
        k.ellipse(eq.centre, eq.a, eq.b, { rotate: eq.minorAng + PI / 2, cls: 'curve' });
        k.label(ringPt(eq, 60), 'celestial equator', 'e', { upright: true, size: 0.6, fill: '#0b4fa0' });
      });
      const others = M.rings.filter(r => ['horizon', 'meridian', 'ecliptic'].includes(r.id));
      k.step('ruler', 'The horizon, the meridian and the ecliptic are drawn the same way. For each, lay off its semi-minor axis b along the projection of its own normal (the angle in the note) and its semi-major axis 100 across it. The horizon\'s normal is the vertical; the meridian\'s points east; the ecliptic\'s leans 23.44° from the polar axis.', () => {
        others.forEach(r => { const d = dirOf(r); [1, -1].forEach(s => { k.point(k.pt(s * r.b * d.minor.x, s * r.b * d.minor.y), '', 'e'); }); });
      });
      k.step('pencil', 'Draw the three ellipses with a French curve, each through the ends of its two axes: horizon, meridian and ecliptic.', () => {
        const col = { horizon: 'green', meridian: 'thick', ecliptic: 'red' };
        others.forEach(r => k.ellipse(r.centre, r.a, r.b, { rotate: r.minorAng + PI / 2, cls: col[r.id] }));
        k.label(ringPt(M.rings[3], 200), 'ecliptic', 'w', { upright: true, size: 0.6, fill: '#b03a2e' });
        k.label(ringPt(M.rings[2], 270), 'meridian', 's', { upright: true, size: 0.6 });
        k.label(ringPt(M.rings[1], 0), 'horizon', 'e', { upright: true, size: 0.6, fill: '#2d7a3a' });
      });
      const tro = M.rings.filter(r => r.id === 'cancer' || r.id === 'capricorn');
      k.step('ruler', 'The tropics are small circles in planes parallel to the equator, R sin 23.44° = 39.8 either side of O along the polar axis. Mark their centres, then lay off the semi-minor axis b = 91.8 × ' + fx(eq.ratio, 3) + ' = ' + fx(tro[0].b, 1) + ' from each (the same shape as the equator, smaller).', () => {
        tro.forEach(r => { k.point(k.pt(r.centre.x, r.centre.y), '', 'ne'); });
      });
      k.step('pencil', 'Draw the ellipses of the tropic of Cancer (towards the north pole) and of Capricorn, each with semi-major axis 91.8, centred on the marked points and with the major axis perpendicular to the polar axis.', () => {
        tro.forEach(r => k.ellipse(r.centre, r.a, r.b, { rotate: r.minorAng + PI / 2, cls: 'cons' }));
        tro.forEach(r => k.label(ringPt(r, 0), r.id === 'cancer' ? 'Cancer' : 'Capricorn', 'e', { upright: true, size: 0.55 }));
      });
    }
  });

  /* ================================================================= the dome master */
  const DOME = { Rd: 70, rho: 110 };
  Hyper.construction({
    id: 'sm-dome-master',
    title: 'The dome master and the dome: equal angles on the dome become equal steps on the master',
    tags: ['dome', 'planetarium', 'azimuthal equidistant', 'fisheye', 'dividers'],
    note: 'A planetarium projector with a fisheye lens sits at the centre of the dome and throws its picture along rays whose angle from the zenith, θ, is proportional to the distance r from the centre of the image: r = fθ, the **equidistant** mapping. The frame fed to it is therefore the **dome master**: a square image in which the dome\'s edge (the horizon, θ = 90°) is the inscribed circle, the zenith is the centre and altitude is measured along a radius at equal steps, with a black border in the four corners that no ray reaches. One degree of the sky is $N/180$ pixels wide for an $N\\times N$ master, anywhere in the picture: 22.8 px for 4096 (4K), 45.5 for 8192 (8K). A pixel then covers $180°\\times60/N$ arcminutes, 2.6′ at 4K and 1.3′ at 8K, and on a dome of diameter D it measures $\\pi D/(2N)$: 7.7 mm for a 20 m dome at 4K. The eye resolves about 1′, so even 8K is a little short of the eye. In the drawing the dome has radius 70 and the master 110 = 70 × π/2, so that an arc of the dome and the step on the master are equal and the dividers carry one to the other. This drawing is the same picture as the all-sky view: the equidistant projection of the hemisphere.',
    build(k) {
      const g = k.g, Rd = DOME.Rd, rho = DOME.rho;
      const Ps = k.pt(-140, 0), Zm = k.pt(80, 0);
      const at = (r, az) => k.pt(Zm.x - r * sin(az * D2R), Zm.y + r * cos(az * D2R));          // north up, east on the left, as the audience sees the dome
      const step = rho / 6;
      k.given('Left, a section of the dome through its zenith: a semicircle of radius 70 on the spring line, the projector P at its centre. Right, the square dome master of side 220, its inscribed circle (the dome\'s edge, the horizon) and its centre Z (the zenith); north is up and east on the left.', () => {
        k.arc(Ps, Rd, 0, PI, { cls: 'given' });
        k.seg(k.pt(Ps.x - Rd - 12, 0), k.pt(Ps.x + Rd + 12, 0), { cls: 'given' });
        k.point(Ps, 'P', 'sw'); k.seg(Ps, k.pt(Ps.x, Rd), { cls: 'cons', dash: true });
        k.label(k.pt(Ps.x, Rd), 'zenith', 'n', { upright: true, size: 0.65 });
        k.rect(Zm.x - rho, -rho, Zm.x + rho, rho, { cls: 'given' });
        k.circle(Zm, rho, { cls: 'given' });
        k.point(Zm, 'Z', 'se');
        k.label(at(rho, 0), 'N', 'n', { upright: true }); k.label(at(rho, 180), 'S', 's', { upright: true }); k.label(at(rho, 90), 'E', 'w', { upright: true }); k.label(at(rho, 270), 'W', 'e', { upright: true });
        k.frame(Ps.x - Rd - 22, -rho - 16, Zm.x + rho + 14, rho + 22);
      });
      const zs = [15, 30, 45, 60, 75];
      const D = zs.map(z => ({ z, p: clk(Ps, Rd, z) }));
      k.step('protractor', 'On the section lay off the angles from the vertical at P every 15°, towards the right: 15°, 30° … 75°. Each ray is one direction of the projector, and where it meets the dome is the point the pixel lands on.', () => {
        D.forEach(o => { k.seg(Ps, o.p, { cls: 'cons' }); k.point(o.p, '', 'ne'); });
        D.forEach(o => k.label(o.p, o.z + '°', 'ne', { upright: true, size: 0.55, dist: 0.7 }));
      });
      k.step('dividers', 'Set the dividers to one of these 15° arcs of the dome (18.3: a 15° step on a circle of radius 70) and step it six times up the vertical radius of the master from Z. The marks are at zenith angle 15°, 30° … 90°: the dome master keeps arc length.', () => {
        for (let i = 1; i <= 6; i++) k.point(at(step * i, 0), '', 'e');
        for (let i = 1; i <= 6; i++) k.label(at(step * i, 0), String(90 - 15 * i) + '°', 'e', { upright: true, size: 0.55, dist: 0.6 });
      });
      k.step('compass', 'Draw a circle about Z through each mark: the circles of altitude 75°, 60°, 45°, 30°, 15° (the outermost, 0°, is the circle already given). They are evenly spaced because the dome master is equidistant.', () => {
        for (let i = 1; i <= 5; i++) k.circle(Zm, step * i, { cls: 'cons' });
      });
      k.step('protractor', 'Every 30° from north draw the azimuth lines through Z to the edge of the circle, with 90° (east) on the left.', () => {
        for (let a = 0; a < 180; a += 30) k.seg(at(rho, a), at(rho, a + 180), { cls: 'cons' });
        for (let a = 30; a < 360; a += 30) if (a % 90) k.label(at(rho, a), String(a) + '°', a < 180 ? 'w' : 'e', { upright: true, size: 0.55, dist: 0.7 });
      });
      const alt = 30, azi = 60, rS = step * (90 - alt) / 15;
      k.step('ruler', 'Plot a point at altitude ' + alt + ' degrees and azimuth ' + azi + ' degrees: along the azimuth line ' + azi + '° lay off r = 110 × (90° − ' + alt + '°) / 90° = ' + fx(rho * (90 - alt) / 90, 1) + ' from Z. On the section the same point is on the 60° ray.', () => {
        k.point(at(rS, azi), 'S', 'nw'); k.point(D[3].p, 'S′', { at: 'ne', open: true });
      });
      k.step('pencil', 'Ink the square, the edge circle and the dome section; hatch the four corners. No ray of the projector reaches them, so the master is black there: about 21 % of the pixels of a dome master are never lit.', () => {
        [[1, 1], [-1, 1], [1, -1], [-1, -1]].forEach(([sx, sy]) => { const a0 = sx > 0 ? (sy > 0 ? 0 : 270) : (sy > 0 ? 90 : 180); const pts = [k.pt(Zm.x + sx * rho, sy * rho)]; for (let i = 0; i <= 18; i++) { const a = (a0 + 5 * i) * D2R; pts.push(k.pt(Zm.x + rho * cos(a), rho * sin(a))); } k.hatch(pts, { gap: 0.55, angle: PI / 4 }); });
        k.arc(Ps, Rd, 0, PI, { cls: 'thick' }); k.circle(Zm, rho, { cls: 'thick' });
      });
    }
  });

})();
