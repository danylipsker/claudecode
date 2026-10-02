/* HYPER-CORE · celestial.js
 *
 * The sky for simulations, the sky lab and tests (kit.sky / Hyper.sky): time (Julian date, sidereal
 * time), the coordinate systems of the celestial sphere (horizontal, equatorial, ecliptic, galactic)
 * and the rotations between them, the Sun, the Moon and the planets to about a quarter of a degree
 * (Schlyter's method, enough to find them in the sky), rise, set and transit, the Sun's path, the
 * analemma, and a catalogue of about 400 bright stars with the stick figures of all 88 constellations.
 * Angles are in degrees in and out; RA in degrees too (divide by 15 for hours). Nothing here uses the DOM.
 *
 *   S.jd(date) S.date(jd) S.J2000 S.gmst(jd) S.lst(jd, lon) S.obliquity(jd)
 *   S.eclToEq(lon, lat, jd) S.eqToEcl(ra, dec, jd) S.eqToHor(ra, dec, lst, lat) S.horToEq(alt, az, lst, lat) S.eqToGal S.galToEq
 *   S.sun(jd) S.moon(jd) S.planet(name, jd) S.body(name, jd) S.PLANETS S.equationOfTime(jd)
 *   S.altAz(name, jd, lat, lon) S.events(fnAlt, jd0, h0) S.sunEvents(jd0, lat, lon) S.sunPath(jd0, lat, lon, step)
 *   S.analemma(year, lat, lon, hourUT) S.stars S.constellations S.deepSky S.star(key) S.eclipticLine(jd) S.galacticEquator()
 *   S.enu(alt, az) S.cameraFrame(az0, alt0) S.toCamera(frame, enuVec)
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const S = H.sky = {};
  const PI = Math.PI, D2R = PI / 180, R2D = 180 / PI;
  const sin = Math.sin, cos = Math.cos, tan = Math.tan, asin = Math.asin, atan2 = Math.atan2, sqrt = Math.sqrt, abs = Math.abs;
  const sind = x => sin(x * D2R), cosd = x => cos(x * D2R), tand = x => tan(x * D2R);
  const asind = x => asin(Math.max(-1, Math.min(1, x))) * R2D, atan2d = (y, x) => atan2(y, x) * R2D;
  const rev = x => { x = x % 360; if (x < 0) x += 360; return x >= 360 - 1e-9 ? 0 : x; };
  const rev180 = x => { x = rev(x); return x > 180 ? x - 360 : x; };
  S.rev = rev; S.rev180 = rev180;

  /* ---------------------------------------------------------------- time */
  S.J2000 = 2451545.0;
  S.jd = date => (date instanceof Date ? date.getTime() : date) / 86400000 + 2440587.5;
  S.date = jd => new Date((jd - 2440587.5) * 86400000);
  S.jdUT = (y, m, d, h) => S.jd(Date.UTC(y, m - 1, d, 0, 0, 0)) + (h || 0) / 24;   // civil date (month 1–12) and hours UT
  S.days = jd => jd - 2451543.5;                       // days since 1999-12-31 0h, Schlyter's epoch
  S.gmst = jd => {                                      // Greenwich mean sidereal time, degrees
    const d = jd - S.J2000, T = d / 36525;
    return rev(280.46061837 + 360.98564736629 * d + 0.000387933 * T * T - T * T * T / 38710000);
  };
  S.lst = (jd, lon) => rev(S.gmst(jd) + lon);
  S.obliquity = jd => 23.4392911 - 0.0130042 * ((jd - S.J2000) / 36525);
  S.fmtHours = h => { h = rev(h * 15) / 15; const hh = Math.floor(h), m = Math.round((h - hh) * 60); return (m === 60 ? hh + 1 : hh) + 'h ' + String(m === 60 ? 0 : m).padStart(2, '0') + 'm'; };
  S.fmtRA = ra => S.fmtHours(ra / 15);
  S.fmtDeg = (d, sign) => { const s = d < 0 ? '−' : (sign ? '+' : ''); const a = abs(d), dd = Math.floor(a), m = Math.round((a - dd) * 60); return s + (m === 60 ? dd + 1 : dd) + '° ' + String(m === 60 ? 0 : m).padStart(2, '0') + '′'; };

  /* ---------------------------------------------------------------- coordinate systems */
  S.eclToEq = (lon, lat, jd) => { const e = S.obliquity(jd == null ? S.J2000 : jd); const x = cosd(lat) * cosd(lon), y = cosd(lat) * sind(lon), z = sind(lat); const y2 = y * cosd(e) - z * sind(e), z2 = y * sind(e) + z * cosd(e); return { ra: rev(atan2d(y2, x)), dec: asind(z2) }; };
  S.eqToEcl = (ra, dec, jd) => { const e = S.obliquity(jd == null ? S.J2000 : jd); const x = cosd(dec) * cosd(ra), y = cosd(dec) * sind(ra), z = sind(dec); const y2 = y * cosd(e) + z * sind(e), z2 = -y * sind(e) + z * cosd(e); return { lon: rev(atan2d(y2, x)), lat: asind(z2) }; };
  /* altitude and azimuth (azimuth from north through east) for a local sidereal time and latitude */
  S.eqToHor = (ra, dec, lst, lat) => {
    const ha = lst - ra;
    const x = cosd(ha) * cosd(dec), y = sind(ha) * cosd(dec), z = sind(dec);
    const xh = x * sind(lat) - z * cosd(lat), yh = y, zh = x * cosd(lat) + z * sind(lat);
    // a positive hour angle (after culmination) lies west: azimuth from north through east is atan2(−yh, −xh)
    return { alt: asind(zh), az: rev(atan2d(-yh, -xh)), ha: rev180(ha) };
  };
  S.horToEq = (alt, az, lst, lat) => {
    const xh = -cosd(alt) * cosd(az), yh = -cosd(alt) * sind(az), zh = sind(alt);
    const x = xh * sind(lat) + zh * cosd(lat), y = yh, z = -xh * cosd(lat) + zh * sind(lat);
    const ha = atan2d(y, x);
    return { ra: rev(lst - ha), dec: asind(z) };
  };
  /* galactic coordinates (J2000 pole at RA 192.859°, Dec +27.128°; the centre at l = 0) */
  const GP = { ra: 192.85948, dec: 27.12825, lNCP: 122.93192 };
  S.eqToGal = (ra, dec) => {
    const sb = sind(dec) * sind(GP.dec) + cosd(dec) * cosd(GP.dec) * cosd(ra - GP.ra);
    const b = asind(sb);
    const y = cosd(dec) * sind(ra - GP.ra), x = sind(dec) * cosd(GP.dec) - cosd(dec) * sind(GP.dec) * cosd(ra - GP.ra);
    return { l: rev(GP.lNCP - atan2d(y, x)), b };
  };
  S.galToEq = (l, b) => {
    const sd = sind(b) * sind(GP.dec) + cosd(b) * cosd(GP.dec) * cosd(GP.lNCP - l);
    const dec = asind(sd);
    const y = cosd(b) * sind(GP.lNCP - l), x = sind(b) * cosd(GP.dec) - cosd(b) * sind(GP.dec) * cosd(GP.lNCP - l);
    return { ra: rev(atan2d(y, x) + GP.ra), dec };
  };
  /* a direction in the sky as an east-north-up vector, and the frame of a camera looking at (az0, alt0) */
  S.enu = (alt, az) => [cosd(alt) * sind(az), cosd(alt) * cosd(az), sind(alt)];
  S.fromEnu = v => ({ alt: asind(v[2] / (Math.hypot(v[0], v[1], v[2]) || 1)), az: rev(atan2d(v[0], v[1])) });
  S.cameraFrame = (az0, alt0, roll) => {
    const f = S.enu(alt0, az0), r0 = [cosd(az0), -sind(az0), 0];                       // right = east of the view direction, level
    const u0 = [f[1] * r0[2] - f[2] * r0[1], f[2] * r0[0] - f[0] * r0[2], f[0] * r0[1] - f[1] * r0[0]];   // up = f × r … sign below
    let r = r0, u = u0.map(x => -x);                                                   // so that up points to the zenith side
    if (roll) { const c = cosd(roll), s = sind(roll); const r2 = r.map((x, i) => x * c + u[i] * s), u2 = u.map((x, i) => -r[i] * s + x * c); r = r2; u = u2; }
    return { f, r, u };
  };
  S.toCamera = (fr, v) => [v[0] * fr.r[0] + v[1] * fr.r[1] + v[2] * fr.r[2], v[0] * fr.u[0] + v[1] * fr.u[1] + v[2] * fr.u[2], v[0] * fr.f[0] + v[1] * fr.f[1] + v[2] * fr.f[2]];

  /* ---------------------------------------------------------------- the Sun */
  S.sun = jd => {
    const d = S.days(jd);
    const w = 282.9404 + 4.70935e-5 * d, e = 0.016709 - 1.151e-9 * d, M = rev(356.0470 + 0.9856002585 * d);
    const E = M + e * R2D * sind(M) * (1 + e * cosd(M));
    const xv = cosd(E) - e, yv = sqrt(1 - e * e) * sind(E);
    const v = atan2d(yv, xv), r = sqrt(xv * xv + yv * yv);
    const lon = rev(v + w);
    const eq = S.eclToEq(lon, 0, jd);
    const L = rev(w + M);                                 // mean longitude
    return { name: 'Sun', ra: eq.ra, dec: eq.dec, lon, lat: 0, dist: r, meanLon: L, mag: -26.7, radius: 0.2666 / r, L: L, w, M, e };
  };
  /* the equation of time in minutes (sundial minus clock) */
  S.equationOfTime = jd => { const s = S.sun(jd); return rev180(s.meanLon - s.ra) * 4; };

  /* ---------------------------------------------------------------- the Moon (Schlyter, with the main perturbations) */
  S.moon = jd => {
    const d = S.days(jd), sun = S.sun(jd);
    const N = rev(125.1228 - 0.0529538083 * d), i = 5.1454, w = rev(318.0634 + 0.1643573223 * d), a = 60.2666, e = 0.054900, M = rev(115.3654 + 13.0649929509 * d);
    let E = M + e * R2D * sind(M) * (1 + e * cosd(M));
    for (let k = 0; k < 5; k++) E = E - (E - e * R2D * sind(E) - M) / (1 - e * cosd(E));
    const xv = a * (cosd(E) - e), yv = a * sqrt(1 - e * e) * sind(E);
    const v = atan2d(yv, xv), r = sqrt(xv * xv + yv * yv);
    const xh = r * (cosd(N) * cosd(v + w) - sind(N) * sind(v + w) * cosd(i)), yh = r * (sind(N) * cosd(v + w) + cosd(N) * sind(v + w) * cosd(i)), zh = r * sind(v + w) * sind(i);
    let lon = rev(atan2d(yh, xh)), lat = atan2d(zh, sqrt(xh * xh + yh * yh)), dist = r;
    const Ms = sun.M, Mm = M, Ls = sun.L, Lm = rev(N + w + M), D = rev(Lm - Ls), F = rev(Lm - N);
    lon += -1.274 * sind(Mm - 2 * D) + 0.658 * sind(2 * D) - 0.186 * sind(Ms) - 0.059 * sind(2 * Mm - 2 * D) - 0.057 * sind(Mm - 2 * D + Ms) + 0.053 * sind(Mm + 2 * D) + 0.046 * sind(2 * D - Ms) + 0.041 * sind(Mm - Ms) - 0.035 * sind(D) - 0.031 * sind(Mm + Ms) - 0.015 * sind(2 * F - 2 * D) + 0.011 * sind(Mm - 4 * D);
    lat += -0.173 * sind(F - 2 * D) - 0.055 * sind(Mm - F - 2 * D) - 0.046 * sind(Mm + F - 2 * D) + 0.033 * sind(F + 2 * D) + 0.017 * sind(2 * Mm + F);
    dist += -0.58 * cosd(Mm - 2 * D) - 0.46 * cosd(2 * D);
    lon = rev(lon);
    const eq = S.eclToEq(lon, lat, jd);
    const elong = Math.acos(Math.max(-1, Math.min(1, cosd(lon - sun.lon) * cosd(lat)))) * R2D;   // elongation from the Sun
    const phase = (1 - cosd(elong)) / 2;                   // illuminated fraction
    const age = rev(lon - sun.lon) / 360 * 29.530589;      // days since new moon (approx.)
    return { name: 'Moon', ra: eq.ra, dec: eq.dec, lon, lat, dist, distKm: dist * 6378.14, elong, phase, age, waxing: rev(lon - sun.lon) < 180, mag: -12.7 + 2.5 * Math.log10(Math.max(1e-6, 1 / Math.max(0.01, phase))) * 0.5, radius: 0.2725 * 60.2666 / dist };
  };

  /* ---------------------------------------------------------------- the planets (Schlyter's elements) */
  const EL = {
    mercury: d => ({ N: 48.3313 + 3.24587e-5 * d, i: 7.0047 + 5.00e-8 * d, w: 29.1241 + 1.01444e-5 * d, a: 0.387098, e: 0.205635 + 5.59e-10 * d, M: 168.6562 + 4.0923344368 * d, mag: (r, R, FV) => -0.36 + 5 * Math.log10(r * R) + 0.027 * FV + 2.2e-13 * Math.pow(FV, 6) }),
    venus: d => ({ N: 76.6799 + 2.46590e-5 * d, i: 3.3946 + 2.75e-8 * d, w: 54.8910 + 1.38374e-5 * d, a: 0.723330, e: 0.006773 - 1.302e-9 * d, M: 48.0052 + 1.6021302244 * d, mag: (r, R, FV) => -4.34 + 5 * Math.log10(r * R) + 0.013 * FV + 4.2e-7 * Math.pow(FV, 3) }),
    mars: d => ({ N: 49.5574 + 2.11081e-5 * d, i: 1.8497 - 1.78e-8 * d, w: 286.5016 + 2.92961e-5 * d, a: 1.523688, e: 0.093405 + 2.516e-9 * d, M: 18.6021 + 0.5240207766 * d, mag: (r, R, FV) => -1.51 + 5 * Math.log10(r * R) + 0.016 * FV }),
    jupiter: d => ({ N: 100.4542 + 2.76854e-5 * d, i: 1.3030 - 1.557e-7 * d, w: 273.8777 + 1.64505e-5 * d, a: 5.20256, e: 0.048498 + 4.469e-9 * d, M: 19.8950 + 0.0830853001 * d, mag: (r, R, FV) => -9.25 + 5 * Math.log10(r * R) + 0.014 * FV }),
    saturn: d => ({ N: 113.6634 + 2.38980e-5 * d, i: 2.4886 - 1.081e-7 * d, w: 339.3939 + 2.97661e-5 * d, a: 9.55475, e: 0.055546 - 9.499e-9 * d, M: 316.9670 + 0.0334442282 * d, mag: (r, R, FV) => -8.88 + 5 * Math.log10(r * R) + 0.044 * FV }),
    uranus: d => ({ N: 74.0005 + 1.3978e-5 * d, i: 0.7733 + 1.9e-8 * d, w: 96.6612 + 3.0565e-5 * d, a: 19.18171 - 1.55e-8 * d, e: 0.047318 + 7.45e-9 * d, M: 142.5905 + 0.011725806 * d, mag: (r, R, FV) => -7.15 + 5 * Math.log10(r * R) + 0.001 * FV }),
    neptune: d => ({ N: 131.7806 + 3.0173e-5 * d, i: 1.7700 - 2.55e-7 * d, w: 272.8461 - 6.027e-6 * d, a: 30.05826 + 3.313e-8 * d, e: 0.008606 + 2.15e-9 * d, M: 260.2471 + 0.005995147 * d, mag: (r, R, FV) => -6.90 + 5 * Math.log10(r * R) + 0.001 * FV })
  };
  S.PLANETS = Object.keys(EL);
  S.PLANET_NAMES = { mercury: 'Mercury', venus: 'Venus', mars: 'Mars', jupiter: 'Jupiter', saturn: 'Saturn', uranus: 'Uranus', neptune: 'Neptune' };
  function helio(el) {
    let E = el.M + el.e * R2D * sind(el.M) * (1 + el.e * cosd(el.M));
    for (let k = 0; k < 6; k++) E = E - (E - el.e * R2D * sind(E) - el.M) / (1 - el.e * cosd(E));
    const xv = el.a * (cosd(E) - el.e), yv = el.a * sqrt(1 - el.e * el.e) * sind(E);
    const v = atan2d(yv, xv), r = sqrt(xv * xv + yv * yv);
    const xh = r * (cosd(el.N) * cosd(v + el.w) - sind(el.N) * sind(v + el.w) * cosd(el.i)), yh = r * (sind(el.N) * cosd(v + el.w) + cosd(el.N) * sind(v + el.w) * cosd(el.i)), zh = r * sind(v + el.w) * sind(el.i);
    return { x: xh, y: yh, z: zh, r };
  }
  S.planet = (name, jd) => {
    const f = EL[name]; if (!f) throw new Error('unknown planet ' + name);
    const d = S.days(jd), el = f(d); el.M = rev(el.M);
    const p = helio(el), sun = S.sun(jd);
    // Jupiter and Saturn pull each other about a degree; the main terms
    if (name === 'jupiter' || name === 'saturn') {
      const Mj = rev(19.8950 + 0.0830853001 * d), Ms = rev(316.9670 + 0.0334442282 * d);
      let dlon = 0;
      if (name === 'jupiter') dlon = -0.332 * sind(2 * Mj - 5 * Ms - 67.6) - 0.056 * sind(2 * Mj - 2 * Ms + 21) + 0.042 * sind(3 * Mj - 5 * Ms + 21) - 0.036 * sind(Mj - 2 * Ms) + 0.022 * cosd(Mj - Ms) + 0.023 * sind(2 * Mj - 3 * Ms + 52) - 0.016 * sind(Mj - 5 * Ms - 69);
      else dlon = 0.812 * sind(2 * Mj - 5 * Ms - 67.6) - 0.229 * cosd(2 * Mj - 4 * Ms - 2) + 0.119 * sind(Mj - 2 * Ms - 3) + 0.046 * sind(2 * Mj - 6 * Ms - 69) + 0.014 * sind(Mj - 3 * Ms + 32);
      const lon = atan2d(p.y, p.x) + dlon, lat = atan2d(p.z, sqrt(p.x * p.x + p.y * p.y)), rr = Math.hypot(p.x, p.y, p.z);
      p.x = rr * cosd(lon) * cosd(lat); p.y = rr * sind(lon) * cosd(lat); p.z = rr * sind(lat);
    }
    const xs = sun.dist * cosd(sun.lon), ys = sun.dist * sind(sun.lon);
    const xg = p.x + xs, yg = p.y + ys, zg = p.z;
    const lon = rev(atan2d(yg, xg)), lat = atan2d(zg, sqrt(xg * xg + yg * yg)), dist = Math.hypot(xg, yg, zg);
    const eq = S.eclToEq(lon, lat, jd);
    const R = dist, r = p.r, s = sun.dist;
    const FV = Math.acos(Math.max(-1, Math.min(1, (r * r + R * R - s * s) / (2 * r * R)))) * R2D;
    const elong = Math.acos(Math.max(-1, Math.min(1, (s * s + R * R - r * r) / (2 * s * R)))) * R2D;
    return { name: S.PLANET_NAMES[name], id: name, ra: eq.ra, dec: eq.dec, lon, lat, dist, helio: p, phaseAngle: FV, elong, mag: el.mag(r, R, FV), phase: (1 + cosd(FV)) / 2 };
  };
  S.body = (name, jd) => name === 'sun' ? S.sun(jd) : name === 'moon' ? S.moon(jd) : S.planet(name, jd);
  S.altAz = (name, jd, lat, lon) => { const b = S.body(name, jd); return Object.assign(b, S.eqToHor(b.ra, b.dec, S.lst(jd, lon), lat)); };

  /* ---------------------------------------------------------------- rise, set, transit */
  /* Sample a body's altitude through the day from jd0 (0h UT) and find the crossings of h0 (degrees; −0.833 for the
     Sun's upper limb with refraction, −0.566 for a star's centre). Returns hours UT, or null when it does not happen. */
  S.events = (altAt, jd0, h0, stepMin) => {
    h0 = h0 == null ? -0.566 : h0; stepMin = stepMin || 10;
    const n = Math.round(1440 / stepMin), alts = [];
    for (let i = 0; i <= n; i++) alts.push(altAt(jd0 + i * stepMin / 1440));
    let rise = null, set = null, maxAlt = -90, minAlt = 90, transit = null, lowest = null;
    for (let i = 0; i < n; i++) {
      const a = alts[i], b = alts[i + 1];
      if (a < h0 && b >= h0 && rise == null) rise = (i + (h0 - a) / (b - a)) * stepMin / 60;
      if (a >= h0 && b < h0 && set == null) set = (i + (a - h0) / (a - b)) * stepMin / 60;
    }
    alts.forEach((a, i) => { if (a > maxAlt) { maxAlt = a; transit = i * stepMin / 60; } if (a < minAlt) { minAlt = a; lowest = i * stepMin / 60; } });
    // refine the transit by a parabola through the neighbours
    const k = Math.round(transit * 60 / stepMin);
    if (k > 0 && k < n) { const y0 = alts[k - 1], y1 = alts[k], y2 = alts[k + 1], den = y0 - 2 * y1 + y2; if (abs(den) > 1e-9) { const dx = 0.5 * (y0 - y2) / den; transit = (k + dx) * stepMin / 60; maxAlt = y1 - 0.25 * (y0 - y2) * dx; } }
    return { rise, set, transit, maxAlt, minAlt, lowest, alwaysUp: minAlt >= h0, neverUp: maxAlt < h0 };
  };
  S.sunEvents = (jd0, lat, lon) => { const r = S.events(jd => { const s = S.sun(jd); return S.eqToHor(s.ra, s.dec, S.lst(jd, lon), lat).alt; }, jd0, -0.833, 5); r.dayLength = r.rise != null && r.set != null ? rev(r.set - r.rise) : (r.alwaysUp ? 24 : 0); return r; };
  S.bodyEvents = (name, jd0, lat, lon) => S.events(jd => { const b = S.body(name, jd); return S.eqToHor(b.ra, b.dec, S.lst(jd, lon), lat).alt; }, jd0, name === 'sun' ? -0.833 : name === 'moon' ? 0.125 : -0.566, 5);
  S.starEvents = (ra, dec, jd0, lat, lon) => S.events(jd => S.eqToHor(ra, dec, S.lst(jd, lon), lat).alt, jd0, -0.566, 10);
  /* the Sun's path through the day: samples of { t (hours UT), alt, az } */
  S.sunPath = (jd0, lat, lon, stepMin) => { stepMin = stepMin || 10; const out = []; for (let m = 0; m <= 1440; m += stepMin) { const jd = jd0 + m / 1440, s = S.sun(jd), h = S.eqToHor(s.ra, s.dec, S.lst(jd, lon), lat); out.push({ t: m / 60, alt: h.alt, az: h.az, dec: s.dec }); } return out; };
  /* the analemma: the Sun at the same clock time (hours UT) through a year, { day, alt, az, eot, dec } */
  S.analemma = (year, lat, lon, hourUT, stepDays) => { stepDays = stepDays || 3; const out = []; const jd1 = S.jdUT(year, 1, 1, hourUT); for (let dd = 0; dd < 366; dd += stepDays) { const jd = jd1 + dd, s = S.sun(jd), h = S.eqToHor(s.ra, s.dec, S.lst(jd, lon), lat); out.push({ day: dd, alt: h.alt, az: h.az, eot: S.equationOfTime(jd), dec: s.dec }); } return out; };
  S.eclipticLine = (jd, n) => { n = n || 72; const out = []; for (let i = 0; i <= n; i++) { const e = S.eclToEq(360 * i / n, 0, jd); out.push([e.ra, e.dec]); } return out; };
  S.galacticEquator = n => { n = n || 72; const out = []; for (let i = 0; i <= n; i++) { const e = S.galToEq(360 * i / n, 0); out.push([e.ra, e.dec]); } return out; };
  S.seasons = jd => { const s = S.sun(jd); return { lon: s.lon, dec: s.dec, season: s.lon < 90 ? 'spring (N) / autumn (S)' : s.lon < 180 ? 'summer (N) / winter (S)' : s.lon < 270 ? 'autumn (N) / spring (S)' : 'winter (N) / summer (S)' }; };

  /* ---------------------------------------------------------------- the stars (J2000, rounded; magnitudes to 0.1) */
  // [key, RA hours, Dec degrees, magnitude, name]
  const STARS = [
    ['alpUMa', 11.062, 61.75, 1.8, 'Dubhe'], ['betUMa', 11.031, 56.38, 2.4, 'Merak'], ['gamUMa', 11.897, 53.69, 2.4, 'Phecda'], ['delUMa', 12.257, 57.03, 3.3, 'Megrez'], ['epsUMa', 12.900, 55.96, 1.8, 'Alioth'], ['zetUMa', 13.399, 54.93, 2.2, 'Mizar'], ['etaUMa', 13.792, 49.31, 1.9, 'Alkaid'],
    ['theUMa', 9.548, 51.68, 3.2], ['iotUMa', 8.986, 48.04, 3.1, 'Talitha'], ['kapUMa', 9.060, 47.16, 3.6], ['lamUMa', 10.285, 42.91, 3.4, 'Tania Borealis'], ['muUMa', 10.372, 41.50, 3.1, 'Tania Australis'], ['nuUMa', 11.308, 33.09, 3.5, 'Alula Borealis'], ['xiUMa', 11.303, 31.53, 3.8, 'Alula Australis'], ['omiUMa', 8.504, 60.72, 3.4, 'Muscida'], ['upsUMa', 9.840, 59.04, 3.8], ['psiUMa', 11.162, 44.50, 3.0], ['chiUMa', 11.767, 47.78, 3.7],
    ['alpUMi', 2.530, 89.26, 2.0, 'Polaris'], ['betUMi', 14.845, 74.16, 2.1, 'Kochab'], ['gamUMi', 15.345, 71.83, 3.0, 'Pherkad'], ['delUMi', 17.537, 86.59, 4.4], ['epsUMi', 16.766, 82.04, 4.2], ['zetUMi', 15.734, 77.79, 4.3], ['etaUMi', 16.292, 75.76, 5.0],
    ['betCas', 0.153, 59.15, 2.3, 'Caph'], ['alpCas', 0.675, 56.54, 2.2, 'Schedar'], ['gamCas', 0.945, 60.72, 2.2], ['delCas', 1.430, 60.24, 2.7, 'Ruchbah'], ['epsCas', 1.907, 63.67, 3.4, 'Segin'],
    ['alpCep', 21.310, 62.59, 2.4, 'Alderamin'], ['betCep', 21.478, 70.56, 3.2, 'Alfirk'], ['gamCep', 23.656, 77.63, 3.2, 'Errai'], ['delCep', 22.486, 58.42, 4.0], ['zetCep', 22.181, 58.20, 3.4], ['etaCep', 20.755, 61.84, 3.4], ['iotCep', 22.828, 66.20, 3.5],
    ['alpDra', 14.073, 64.38, 3.7, 'Thuban'], ['betDra', 17.507, 52.30, 2.8, 'Rastaban'], ['gamDra', 17.943, 51.49, 2.2, 'Eltanin'], ['delDra', 19.209, 67.66, 3.1], ['zetDra', 17.146, 65.71, 3.2], ['etaDra', 16.400, 61.51, 2.7], ['iotDra', 15.415, 58.97, 3.3], ['kapDra', 12.558, 69.79, 3.9], ['lamDra', 11.523, 69.33, 3.8], ['nuDra', 17.536, 55.18, 4.9], ['xiDra', 17.892, 56.87, 3.7], ['chiDra', 18.351, 72.73, 3.6],
    ['alpOri', 5.919, 7.41, 0.5, 'Betelgeuse'], ['betOri', 5.242, -8.20, 0.1, 'Rigel'], ['gamOri', 5.419, 6.35, 1.6, 'Bellatrix'], ['delOri', 5.533, -0.30, 2.2, 'Mintaka'], ['epsOri', 5.604, -1.20, 1.7, 'Alnilam'], ['zetOri', 5.679, -1.94, 1.8, 'Alnitak'], ['kapOri', 5.796, -9.67, 2.1, 'Saiph'], ['lamOri', 5.585, 9.93, 3.4, 'Meissa'], ['pi3Ori', 4.830, 6.96, 3.2], ['pi4Ori', 4.853, 5.60, 3.7], ['pi5Ori', 4.904, 2.44, 3.7], ['pi2Ori', 4.843, 8.90, 4.4], ['pi1Ori', 4.915, 10.15, 4.6], ['iotOri', 5.590, -5.91, 2.8],
    ['alpTau', 4.599, 16.51, 0.9, 'Aldebaran'], ['betTau', 5.438, 28.61, 1.7, 'Elnath'], ['zetTau', 5.627, 21.14, 3.0], ['gamTau', 4.330, 15.63, 3.6], ['delTau', 4.383, 17.54, 3.8], ['epsTau', 4.477, 19.18, 3.5], ['theTau', 4.478, 15.87, 3.4], ['lamTau', 4.011, 12.49, 3.4], ['omiTau', 3.413, 9.03, 3.6], ['xiTau', 3.453, 9.73, 3.7], ['etaTau', 3.791, 24.11, 2.9, 'Alcyone'],
    ['alpGem', 7.577, 31.89, 1.6, 'Castor'], ['betGem', 7.755, 28.03, 1.1, 'Pollux'], ['gamGem', 6.629, 16.40, 1.9, 'Alhena'], ['delGem', 7.335, 21.98, 3.5, 'Wasat'], ['epsGem', 6.732, 25.13, 3.0, 'Mebsuta'], ['zetGem', 7.068, 20.57, 3.9], ['etaGem', 6.248, 22.51, 3.3, 'Propus'], ['iotGem', 7.428, 27.80, 3.8], ['kapGem', 7.741, 24.40, 3.6], ['lamGem', 7.301, 16.54, 3.6], ['muGem', 6.383, 22.51, 2.9, 'Tejat'], ['nuGem', 6.483, 20.21, 4.1], ['xiGem', 6.754, 12.90, 3.4], ['tauGem', 7.186, 30.25, 4.4], ['upsGem', 7.598, 26.90, 4.1],
    ['alpCMa', 6.752, -16.72, -1.5, 'Sirius'], ['epsCMa', 6.977, -28.97, 1.5, 'Adhara'], ['delCMa', 7.140, -26.39, 1.8, 'Wezen'], ['betCMa', 6.378, -17.96, 2.0, 'Mirzam'], ['etaCMa', 7.401, -29.30, 2.4, 'Aludra'], ['omi2CMa', 7.050, -23.83, 3.0], ['zetCMa', 6.338, -30.06, 3.0, 'Furud'], ['sigCMa', 7.029, -27.93, 3.5], ['iotCMa', 6.935, -17.05, 4.4], ['theCMa', 6.903, -12.04, 4.1], ['omi1CMa', 6.902, -24.18, 3.9],
    ['alpCMi', 7.655, 5.22, 0.4, 'Procyon'], ['betCMi', 7.453, 8.29, 2.9, 'Gomeisa'],
    ['alpLeo', 10.140, 11.97, 1.4, 'Regulus'], ['betLeo', 11.818, 14.57, 2.1, 'Denebola'], ['gamLeo', 10.333, 19.84, 2.0, 'Algieba'], ['delLeo', 11.235, 20.52, 2.6, 'Zosma'], ['theLeo', 11.237, 15.43, 3.3, 'Chertan'], ['epsLeo', 9.764, 23.77, 3.0], ['zetLeo', 10.278, 23.42, 3.4, 'Adhafera'], ['etaLeo', 10.122, 16.76, 3.5], ['muLeo', 9.879, 26.01, 3.9, 'Rasalas'], ['omiLeo', 9.685, 9.89, 3.5], ['lamLeo', 9.529, 22.97, 4.3],
    ['alpVir', 13.420, -11.16, 1.0, 'Spica'], ['betVir', 11.845, 1.76, 3.6, 'Zavijava'], ['gamVir', 12.694, -1.45, 2.7, 'Porrima'], ['delVir', 12.927, 3.40, 3.4], ['epsVir', 13.036, 10.96, 2.8, 'Vindemiatrix'], ['zetVir', 13.578, -0.60, 3.4, 'Heze'], ['etaVir', 12.332, -0.67, 3.9], ['theVir', 13.166, -5.54, 4.4], ['iotVir', 14.267, -6.00, 4.1], ['muVir', 14.717, -5.66, 3.9], ['kapVir', 14.215, -10.27, 4.2], ['nuVir', 11.764, 6.53, 4.0], ['tauVir', 14.027, 1.54, 4.3], ['109Vir', 14.772, 1.89, 3.7],
    ['alpBoo', 14.261, 19.18, 0.0, 'Arcturus'], ['epsBoo', 14.750, 27.07, 2.4, 'Izar'], ['etaBoo', 13.911, 18.40, 2.7, 'Muphrid'], ['gamBoo', 14.535, 38.31, 3.0, 'Seginus'], ['betBoo', 15.032, 40.39, 3.5, 'Nekkar'], ['delBoo', 15.258, 33.31, 3.5], ['rhoBoo', 14.530, 30.37, 3.6], ['zetBoo', 14.686, 13.73, 3.8], ['theBoo', 14.420, 51.85, 4.0], ['lamBoo', 14.273, 46.09, 4.2],
    ['alpLyr', 18.616, 38.78, 0.0, 'Vega'], ['betLyr', 18.835, 33.36, 3.5, 'Sheliak'], ['gamLyr', 18.982, 32.69, 3.2, 'Sulafat'], ['delLyr', 18.908, 36.90, 4.3], ['zetLyr', 18.746, 37.61, 4.4], ['epsLyr', 18.739, 39.67, 4.7],
    ['alpCyg', 20.690, 45.28, 1.3, 'Deneb'], ['gamCyg', 20.370, 40.26, 2.2, 'Sadr'], ['epsCyg', 20.770, 33.97, 2.5, 'Gienah'], ['delCyg', 19.750, 45.13, 2.9], ['betCyg', 19.512, 27.96, 3.1, 'Albireo'], ['zetCyg', 21.216, 30.23, 3.2], ['etaCyg', 19.938, 35.08, 3.9], ['iotCyg', 19.495, 51.73, 3.8], ['kapCyg', 19.285, 53.37, 3.8],
    ['alpAql', 19.846, 8.87, 0.8, 'Altair'], ['gamAql', 19.771, 10.61, 2.7, 'Tarazed'], ['betAql', 19.922, 6.41, 3.7, 'Alshain'], ['zetAql', 19.090, 13.86, 3.0], ['theAql', 20.188, -0.82, 3.2], ['delAql', 19.425, 3.11, 3.4], ['lamAql', 19.102, -4.88, 3.4], ['etaAql', 19.874, 1.01, 3.9], ['epsAql', 18.994, 15.07, 4.0], ['iotAql', 19.611, -1.29, 4.4],
    ['alpSco', 16.490, -26.43, 1.0, 'Antares'], ['lamSco', 17.560, -37.10, 1.6, 'Shaula'], ['theSco', 17.622, -42.99, 1.9, 'Sargas'], ['delSco', 16.005, -22.62, 2.3, 'Dschubba'], ['betSco', 16.091, -19.81, 2.6, 'Acrab'], ['piSco', 15.981, -26.11, 2.9], ['sigSco', 16.353, -25.59, 2.9], ['tauSco', 16.598, -28.22, 2.8], ['epsSco', 16.836, -34.29, 2.3], ['mu1Sco', 16.864, -38.05, 3.0], ['zet2Sco', 16.909, -42.36, 3.6], ['etaSco', 17.203, -43.24, 3.3], ['iot1Sco', 17.793, -40.13, 3.0], ['kapSco', 17.708, -39.03, 2.4], ['upsSco', 17.513, -37.30, 2.7, 'Lesath'], ['nuSco', 16.200, -19.46, 4.0],
    ['epsSgr', 18.403, -34.38, 1.8, 'Kaus Australis'], ['sigSgr', 18.921, -26.30, 2.0, 'Nunki'], ['zetSgr', 19.043, -29.88, 2.6, 'Ascella'], ['delSgr', 18.350, -29.83, 2.7, 'Kaus Media'], ['lamSgr', 18.466, -25.42, 2.8, 'Kaus Borealis'], ['gamSgr', 18.097, -30.42, 3.0, 'Alnasl'], ['piSgr', 19.163, -21.02, 2.9], ['phiSgr', 18.761, -26.99, 3.2], ['tauSgr', 19.116, -27.67, 3.3], ['etaSgr', 18.294, -36.76, 3.1],
    ['alpCru', 12.443, -63.10, 0.8, 'Acrux'], ['betCru', 12.795, -59.69, 1.3, 'Mimosa'], ['gamCru', 12.519, -57.11, 1.6, 'Gacrux'], ['delCru', 12.252, -58.75, 2.8], ['epsCru', 12.356, -60.40, 3.6],
    ['alpCen', 14.660, -60.84, -0.3, 'Rigil Kentaurus'], ['betCen', 14.064, -60.37, 0.6, 'Hadar'], ['theCen', 14.111, -36.37, 2.1, 'Menkent'], ['gamCen', 12.692, -48.96, 2.2], ['epsCen', 13.665, -53.47, 2.3], ['etaCen', 14.592, -42.16, 2.3], ['zetCen', 13.926, -47.29, 2.5], ['delCen', 12.139, -50.72, 2.6], ['iotCen', 13.343, -36.71, 2.7], ['kapCen', 14.986, -42.10, 3.1], ['muCen', 13.828, -42.47, 3.0], ['nuCen', 13.825, -41.69, 3.4],
    ['alpCar', 6.399, -52.70, -0.7, 'Canopus'], ['betCar', 9.220, -69.72, 1.7, 'Miaplacidus'], ['epsCar', 8.375, -59.51, 1.9, 'Avior'], ['iotCar', 9.285, -59.28, 2.2, 'Aspidiske'], ['theCar', 10.716, -64.39, 2.8], ['upsCar', 9.785, -65.07, 3.0], ['omeCar', 10.228, -70.04, 3.3], ['chiCar', 7.946, -52.98, 3.5], ['qCar', 10.288, -61.33, 3.4],
    ['gamVel', 8.158, -47.34, 1.8, 'Regor'], ['delVel', 8.745, -54.71, 2.0], ['lamVel', 9.133, -43.43, 2.2, 'Suhail'], ['kapVel', 9.369, -55.01, 2.5], ['muVel', 10.779, -49.42, 2.7], ['psiVel', 9.512, -40.47, 3.6], ['phiVel', 9.948, -54.57, 3.5],
    ['zetPup', 8.060, -40.00, 2.2, 'Naos'], ['piPup', 7.285, -37.10, 2.7], ['rhoPup', 8.126, -24.30, 2.8], ['tauPup', 6.832, -50.61, 2.9], ['nuPup', 6.629, -43.20, 3.2], ['sigPup', 7.487, -43.30, 3.3], ['xiPup', 7.822, -24.86, 3.3],
    ['alpPer', 3.405, 49.86, 1.8, 'Mirfak'], ['betPer', 3.136, 40.96, 2.1, 'Algol'], ['zetPer', 3.902, 31.88, 2.9], ['epsPer', 3.964, 40.01, 2.9], ['gamPer', 3.080, 53.51, 2.9], ['delPer', 3.715, 47.79, 3.0], ['rhoPer', 3.086, 38.84, 3.4], ['etaPer', 2.845, 55.90, 3.8], ['kapPer', 3.158, 44.86, 3.8], ['xiPer', 3.982, 35.79, 4.0, 'Menkib'], ['omiPer', 3.733, 32.29, 3.8], ['iotPer', 3.151, 49.61, 4.0], ['thePer', 2.737, 49.23, 4.1],
    ['alpAnd', 0.140, 29.09, 2.1, 'Alpheratz'], ['betAnd', 1.162, 35.62, 2.1, 'Mirach'], ['gamAnd', 2.065, 42.33, 2.1, 'Almach'], ['delAnd', 0.656, 30.86, 3.3], ['epsAnd', 0.642, 29.31, 4.4], ['zetAnd', 0.789, 24.27, 4.1], ['etaAnd', 0.950, 23.42, 4.4], ['muAnd', 0.946, 38.50, 3.9], ['nuAnd', 0.830, 41.08, 4.5], ['piAnd', 0.615, 33.72, 4.4],
    ['alpPeg', 23.079, 15.21, 2.5, 'Markab'], ['betPeg', 23.063, 28.08, 2.4, 'Scheat'], ['gamPeg', 0.220, 15.18, 2.8, 'Algenib'], ['epsPeg', 21.736, 9.88, 2.4, 'Enif'], ['zetPeg', 22.691, 10.83, 3.4, 'Homam'], ['etaPeg', 22.717, 30.22, 2.9, 'Matar'], ['thePeg', 22.170, 6.20, 3.5, 'Biham'], ['iotPeg', 22.117, 25.35, 3.8], ['kapPeg', 21.744, 25.65, 4.1], ['lamPeg', 22.775, 23.57, 3.9], ['muPeg', 22.833, 24.60, 3.5], ['piPeg', 22.166, 33.18, 4.3],
    ['alpAur', 5.278, 46.00, 0.1, 'Capella'], ['betAur', 5.992, 44.95, 1.9, 'Menkalinan'], ['theAur', 5.995, 37.21, 2.6], ['iotAur', 4.950, 33.17, 2.7, 'Hassaleh'], ['epsAur', 5.033, 43.82, 3.0, 'Almaaz'], ['etaAur', 5.108, 41.23, 3.2], ['zetAur', 5.041, 41.08, 3.7], ['delAur', 5.992, 54.28, 3.7],
    ['alpAri', 2.120, 23.46, 2.0, 'Hamal'], ['betAri', 1.911, 20.81, 2.6, 'Sheratan'], ['gamAri', 1.892, 19.29, 3.9, 'Mesarthim'], ['41Ari', 2.833, 27.26, 3.6],
    ['etaPsc', 1.525, 15.35, 3.6], ['gamPsc', 23.286, 3.28, 3.7], ['alpPsc', 2.034, 2.76, 3.8, 'Alrescha'], ['omePsc', 23.988, 6.86, 4.0], ['iotPsc', 23.665, 5.63, 4.1], ['thePsc', 23.466, 6.38, 4.3], ['lamPsc', 23.700, 1.78, 4.5], ['kapPsc', 23.448, 1.26, 4.9], ['omiPsc', 1.756, 9.16, 4.3], ['nuPsc', 1.690, 5.49, 4.4], ['muPsc', 1.500, 6.14, 4.8], ['epsPsc', 1.049, 7.89, 4.3], ['delPsc', 0.812, 7.59, 4.4], ['tauPsc', 1.194, 30.09, 4.5], ['upsPsc', 1.325, 27.26, 4.8], ['phiPsc', 1.229, 24.58, 4.7], ['chiPsc', 1.190, 21.03, 4.7],
    ['betAqr', 21.526, -5.57, 2.9, 'Sadalsuud'], ['alpAqr', 22.096, -0.32, 2.9, 'Sadalmelik'], ['delAqr', 22.911, -15.82, 3.3, 'Skat'], ['gamAqr', 22.361, -1.39, 3.8, 'Sadachbia'], ['zetAqr', 22.477, -0.02, 3.6], ['etaAqr', 22.589, -0.12, 4.0], ['lamAqr', 22.877, -7.58, 3.7], ['epsAqr', 20.794, -9.50, 3.8, 'Albali'], ['theAqr', 22.280, -7.78, 4.2], ['iotAqr', 22.107, -13.87, 4.3], ['tauAqr', 22.826, -13.59, 4.0], ['phiAqr', 23.233, -6.05, 4.2], ['88Aqr', 23.157, -21.17, 3.7], ['98Aqr', 23.383, -20.10, 4.0],
    ['delCap', 21.784, -16.13, 2.9, 'Deneb Algedi'], ['betCap', 20.350, -14.78, 3.1, 'Dabih'], ['alpCap', 20.301, -12.54, 3.6, 'Algedi'], ['gamCap', 21.668, -16.66, 3.7, 'Nashira'], ['zetCap', 21.444, -22.41, 3.7], ['theCap', 21.099, -17.23, 4.1], ['iotCap', 21.370, -16.83, 4.3], ['omeCap', 20.864, -26.92, 4.1], ['psiCap', 20.768, -25.27, 4.1], ['epsCap', 21.618, -19.47, 4.5],
    ['alpPsA', 22.961, -29.62, 1.2, 'Fomalhaut'], ['epsPsA', 22.678, -27.04, 4.2], ['delPsA', 22.932, -32.54, 4.2], ['betPsA', 22.525, -32.35, 4.3], ['iotPsA', 21.749, -33.03, 4.3], ['gamPsA', 22.875, -32.88, 4.5], ['muPsA', 22.140, -32.99, 4.5],
    ['alpGru', 22.137, -46.96, 1.7, 'Alnair'], ['betGru', 22.711, -46.88, 2.1, 'Tiaki'], ['gamGru', 21.899, -37.36, 3.0], ['epsGru', 22.809, -51.32, 3.5], ['delGru', 22.487, -43.50, 4.0], ['zetGru', 23.015, -52.75, 4.1], ['iotGru', 23.173, -45.25, 3.9], ['lamGru', 22.102, -39.54, 4.5], ['theGru', 23.115, -43.52, 4.3],
    ['alpPav', 20.427, -56.74, 1.9, 'Peacock'], ['betPav', 20.749, -66.20, 3.4], ['delPav', 20.145, -66.18, 3.6], ['etaPav', 17.762, -64.72, 3.6], ['epsPav', 20.009, -72.91, 4.0], ['zetPav', 18.717, -71.43, 4.0], ['kapPav', 18.950, -67.23, 4.4], ['lamPav', 18.870, -62.19, 4.2], ['gamPav', 21.441, -65.37, 4.2], ['xiPav', 18.388, -61.49, 4.4], ['piPav', 18.143, -63.67, 4.3],
    ['alpEri', 1.629, -57.24, 0.5, 'Achernar'], ['betEri', 5.131, -5.09, 2.8, 'Cursa'], ['gamEri', 3.967, -13.51, 2.9, 'Zaurak'], ['theEri', 2.971, -40.30, 3.2, 'Acamar'], ['delEri', 3.721, -9.76, 3.5], ['epsEri', 3.549, -9.46, 3.7], ['etaEri', 2.940, -8.90, 3.9], ['tau4Eri', 3.325, -21.76, 3.7], ['tau3Eri', 3.037, -23.62, 4.1], ['ups2Eri', 4.593, -30.56, 3.8], ['omi1Eri', 4.198, -6.84, 4.0], ['nuEri', 4.606, -3.35, 3.9], ['muEri', 4.758, -3.25, 4.0], ['chiEri', 1.933, -51.61, 3.7], ['phiEri', 2.275, -51.51, 3.6], ['kapEri', 2.447, -47.70, 4.3], ['iotEri', 2.678, -39.86, 4.1], ['piEri', 3.769, -12.10, 4.4], ['ups1Eri', 4.558, -29.77, 4.5], ['tau6Eri', 3.780, -23.25, 4.2], ['tau5Eri', 3.570, -21.63, 4.3], ['tau1Eri', 2.751, -18.57, 4.5], ['tau2Eri', 2.850, -21.00, 4.8], ['tau9Eri', 3.998, -24.02, 4.7], ['43Eri', 4.401, -34.02, 4.0],
    ['betCet', 0.727, -17.99, 2.0, 'Diphda'], ['alpCet', 3.038, 4.09, 2.5, 'Menkar'], ['omiCet', 2.323, -2.98, 3.0, 'Mira'], ['gamCet', 2.722, 3.24, 3.5, 'Kaffaljidhma'], ['etaCet', 1.143, -10.18, 3.4], ['theCet', 1.400, -8.18, 3.6], ['zetCet', 1.858, -10.33, 3.7], ['tauCet', 1.735, -15.94, 3.5], ['iotCet', 0.324, -8.82, 3.6], ['delCet', 2.658, 0.33, 4.1], ['xi2Cet', 2.469, 8.46, 4.3], ['muCet', 2.750, 10.11, 4.3], ['lamCet', 2.995, 8.91, 4.7], ['nuCet', 2.597, 5.59, 4.9],
    ['alpOph', 17.582, 12.56, 2.1, 'Rasalhague'], ['etaOph', 17.173, -15.72, 2.4, 'Sabik'], ['zetOph', 16.619, -10.57, 2.6], ['delOph', 16.239, -3.69, 2.7, 'Yed Prior'], ['betOph', 17.724, 4.57, 2.8, 'Cebalrai'], ['kapOph', 16.961, 9.38, 3.2], ['epsOph', 16.305, -4.69, 3.2, 'Yed Posterior'], ['theOph', 17.366, -25.00, 3.3], ['nuOph', 17.983, -9.77, 3.3], ['gamOph', 17.798, 2.71, 3.8], ['lamOph', 16.515, 1.98, 3.8, 'Marfik'],
    ['betHer', 16.504, 21.49, 2.8, 'Kornephoros'], ['zetHer', 16.688, 31.60, 2.8], ['delHer', 17.251, 24.84, 3.1, 'Sarin'], ['piHer', 17.251, 36.81, 3.2], ['alpHer', 17.244, 14.39, 3.1, 'Rasalgethi'], ['muHer', 17.775, 27.72, 3.4], ['etaHer', 16.715, 38.92, 3.5], ['xiHer', 17.963, 29.25, 3.7], ['gamHer', 16.366, 19.15, 3.7], ['iotHer', 17.657, 46.01, 3.8], ['omiHer', 18.126, 28.76, 3.8], ['theHer', 17.938, 37.25, 3.9], ['tauHer', 16.329, 46.31, 3.9], ['epsHer', 17.005, 30.93, 3.9], ['sigHer', 16.568, 42.44, 4.2], ['lamHer', 17.513, 26.11, 4.4],
    ['alpCrA', 19.157, -37.90, 4.1, 'Meridiana'], ['betCrA', 19.167, -39.34, 4.1], ['gamCrA', 19.107, -37.06, 4.2], ['delCrA', 19.140, -40.50, 4.6],
    ['alpCrB', 15.578, 26.71, 2.2, 'Alphecca'], ['betCrB', 15.464, 29.11, 3.7, 'Nusakan'], ['gamCrB', 15.712, 26.30, 3.8], ['delCrB', 15.826, 26.07, 4.6], ['epsCrB', 15.959, 26.88, 4.1], ['theCrB', 15.549, 31.36, 4.1], ['iotCrB', 16.024, 29.85, 5.0],
    ['alpLib', 14.848, -16.04, 2.8, 'Zubenelgenubi'], ['betLib', 15.283, -9.38, 2.6, 'Zubeneschamali'], ['sigLib', 15.068, -25.28, 3.3, 'Brachium'], ['gamLib', 15.592, -14.79, 3.9], ['upsLib', 15.617, -28.14, 3.6], ['tauLib', 15.644, -29.78, 3.7],
    ['alpHya', 9.460, -8.66, 2.0, 'Alphard'], ['gamHya', 13.316, -23.17, 3.0], ['zetHya', 8.923, 5.95, 3.1], ['nuHya', 10.828, -16.19, 3.1], ['piHya', 14.106, -26.68, 3.3], ['epsHya', 8.780, 6.42, 3.4], ['xiHya', 11.550, -31.86, 3.5], ['lamHya', 10.176, -12.35, 3.6], ['muHya', 10.434, -16.84, 3.8], ['theHya', 9.239, 2.31, 3.9], ['iotHya', 9.665, -1.14, 3.9], ['ups1Hya', 9.858, -14.85, 4.1], ['delHya', 8.628, 5.70, 4.1], ['sigHya', 8.646, 3.34, 4.4], ['etaHya', 8.720, 3.40, 4.3], ['betHya', 11.882, -33.91, 4.3],
    ['gamCrv', 12.263, -17.54, 2.6, 'Gienah'], ['betCrv', 12.573, -23.40, 2.6, 'Kraz'], ['delCrv', 12.498, -16.52, 2.9, 'Algorab'], ['epsCrv', 12.169, -22.62, 3.0, 'Minkar'], ['alpCrv', 12.140, -24.73, 4.0],
    ['delCrt', 11.322, -14.78, 3.6], ['gamCrt', 11.415, -17.68, 4.1], ['alpCrt', 10.996, -18.30, 4.1, 'Alkes'], ['betCrt', 11.194, -22.83, 4.5], ['zetCrt', 11.746, -18.35, 4.7], ['theCrt', 11.611, -9.80, 4.7], ['epsCrt', 11.410, -10.86, 4.8], ['etaCrt', 11.934, -17.15, 5.2],
    ['alpLep', 5.545, -17.82, 2.6, 'Arneb'], ['betLep', 5.471, -20.76, 2.8, 'Nihal'], ['epsLep', 5.091, -22.37, 3.2], ['muLep', 5.216, -16.21, 3.3], ['zetLep', 5.783, -14.82, 3.5], ['gamLep', 5.741, -22.45, 3.6], ['etaLep', 5.940, -14.17, 3.7], ['delLep', 5.855, -20.88, 3.8], ['lamLep', 5.325, -13.18, 4.3], ['kapLep', 5.221, -12.94, 4.4],
    ['alpCol', 5.661, -34.07, 2.6, 'Phact'], ['betCol', 5.849, -35.77, 3.1, 'Wazn'], ['delCol', 6.369, -33.44, 3.9], ['epsCol', 5.513, -35.47, 3.9], ['etaCol', 5.985, -42.82, 3.9], ['gamCol', 5.959, -35.28, 4.4],
    ['alpLup', 14.699, -47.39, 2.3], ['betLup', 14.975, -43.13, 2.7], ['gamLup', 15.586, -41.17, 2.8], ['delLup', 15.356, -40.65, 3.2], ['epsLup', 15.378, -44.69, 3.4], ['zetLup', 15.205, -52.10, 3.4], ['etaLup', 16.002, -38.40, 3.4], ['phiLup', 15.363, -36.26, 3.6], ['chiLup', 15.849, -33.63, 3.9], ['theLup', 16.100, -36.80, 4.2],
    ['alpTrA', 16.811, -69.03, 1.9, 'Atria'], ['betTrA', 15.919, -63.43, 2.8], ['gamTrA', 15.315, -68.68, 2.9],
    ['betAra', 17.421, -55.53, 2.8], ['alpAra', 17.531, -49.88, 2.9], ['zetAra', 16.977, -55.99, 3.1], ['gamAra', 17.423, -56.38, 3.3], ['delAra', 17.518, -60.68, 3.6], ['theAra', 18.110, -50.09, 3.7], ['etaAra', 16.830, -59.04, 3.8], ['epsAra', 16.993, -53.16, 4.1],
    ['betCnc', 8.275, 9.19, 3.5, 'Tarf'], ['delCnc', 8.745, 18.15, 3.9, 'Asellus Australis'], ['iotCnc', 8.778, 28.76, 4.0], ['alpCnc', 8.975, 11.86, 4.3, 'Acubens'], ['gamCnc', 8.722, 21.47, 4.7, 'Asellus Borealis'],
    ['46LMi', 10.888, 34.21, 3.8, 'Praecipua'], ['betLMi', 10.465, 36.71, 4.2], ['21LMi', 10.123, 35.24, 4.5], ['10LMi', 9.570, 36.40, 4.5],
    ['alpLyn', 9.351, 34.39, 3.1], ['38Lyn', 9.312, 36.80, 3.8], ['31Lyn', 8.380, 43.19, 4.2], ['21Lyn', 7.445, 49.21, 4.6], ['15Lyn', 6.954, 58.42, 4.4], ['2Lyn', 6.330, 59.00, 4.4],
    ['betCam', 5.057, 60.44, 4.0], ['alpCam', 4.901, 66.34, 4.3], ['gamCam', 3.839, 71.33, 4.6], ['7Cam', 4.950, 53.75, 4.5],
    ['alpLac', 22.521, 50.28, 3.8], ['betLac', 22.393, 52.23, 4.4], ['1Lac', 22.266, 37.75, 4.1], ['5Lac', 22.493, 47.71, 4.3], ['2Lac', 22.350, 46.50, 4.6], ['4Lac', 22.410, 49.50, 4.6], ['11Lac', 22.676, 44.28, 4.5], ['6Lac', 22.510, 43.10, 4.5],
    ['alpVul', 19.478, 24.66, 4.4, 'Anser'], ['13Vul', 19.898, 24.08, 4.6],
    ['gamSge', 19.979, 19.49, 3.5], ['delSge', 19.790, 18.53, 3.8], ['alpSge', 19.668, 18.01, 4.4, 'Sham'], ['betSge', 19.684, 17.48, 4.4],
    ['betDel', 20.626, 14.60, 3.6, 'Rotanev'], ['alpDel', 20.661, 15.91, 3.8, 'Sualocin'], ['gamDel', 20.777, 16.12, 4.3], ['epsDel', 20.553, 11.30, 4.0], ['delDel', 20.724, 15.07, 4.4],
    ['alpEqu', 21.264, 5.25, 3.9, 'Kitalpha'], ['delEqu', 21.241, 10.01, 4.5], ['gamEqu', 21.172, 10.13, 4.7],
    ['alpTri', 1.885, 29.58, 3.4, 'Mothallah'], ['betTri', 2.159, 34.99, 3.0], ['gamTri', 2.289, 33.85, 4.0],
    ['alpCVn', 12.934, 38.32, 2.9, 'Cor Caroli'], ['betCVn', 12.562, 41.36, 4.3, 'Chara'],
    ['betCom', 13.198, 27.88, 4.3], ['alpCom', 13.166, 17.53, 4.3, 'Diadem'], ['gamCom', 12.449, 28.27, 4.4],
    ['alpSer', 15.738, 6.43, 2.6, 'Unukalhai'], ['muSer', 15.827, -3.43, 3.5], ['betSer', 15.770, 15.42, 3.7], ['epsSer', 15.847, 4.48, 3.7], ['delSer', 15.580, 10.54, 3.8], ['gamSer', 15.941, 15.66, 3.9], ['kapSer', 15.814, 18.14, 4.1], ['iotSer', 15.695, 19.67, 4.5], ['etaSer', 18.355, -2.90, 3.3], ['theSer', 18.937, 4.20, 4.6, 'Alya'], ['xiSer', 17.627, -15.40, 3.5], ['nuSer', 17.345, -12.85, 4.3], ['omiSer', 17.690, -12.88, 4.2],
    ['alpSct', 18.587, -8.24, 3.9], ['betSct', 18.786, -4.75, 4.2], ['gamSct', 18.487, -14.57, 4.7], ['delSct', 18.705, -9.05, 4.7],
    ['alpTel', 18.449, -45.97, 3.5], ['zetTel', 18.482, -49.07, 4.1], ['epsTel', 18.187, -45.95, 4.5],
    ['alpInd', 20.626, -47.29, 3.1], ['betInd', 20.913, -58.45, 3.7], ['delInd', 21.965, -54.99, 4.4], ['theInd', 21.331, -53.45, 4.4],
    ['gamMic', 21.023, -32.26, 4.7], ['epsMic', 21.298, -32.17, 4.7], ['alpMic', 20.833, -33.78, 4.9],
    ['alpScl', 0.977, -29.36, 4.3], ['betScl', 23.549, -37.82, 4.4], ['gamScl', 23.314, -32.53, 4.4], ['delScl', 23.815, -28.13, 4.6],
    ['alpPhe', 0.438, -42.31, 2.4, 'Ankaa'], ['betPhe', 1.101, -46.72, 3.3], ['gamPhe', 1.473, -43.32, 3.4], ['delPhe', 1.521, -49.07, 4.0], ['epsPhe', 0.157, -45.75, 3.9], ['zetPhe', 1.140, -55.25, 3.9],
    ['betHyi', 0.429, -77.25, 2.8], ['alpHyi', 1.979, -61.57, 2.9], ['gamHyi', 3.787, -74.24, 3.2], ['delHyi', 2.363, -68.66, 4.1], ['epsHyi', 2.660, -68.27, 4.1],
    ['alpTuc', 22.308, -60.26, 2.9], ['gamTuc', 23.290, -58.24, 4.0], ['zetTuc', 0.335, -64.88, 4.2], ['betTuc', 0.526, -62.96, 4.4], ['epsTuc', 23.999, -65.58, 4.5], ['delTuc', 22.456, -64.97, 4.5],
    ['nuOct', 21.691, -77.39, 3.8], ['betOct', 22.767, -81.38, 4.1], ['delOct', 14.449, -83.67, 4.3], ['sigOct', 21.146, -88.96, 5.5, 'Polaris Australis'],
    ['alpAps', 14.798, -79.04, 3.8], ['gamAps', 16.557, -78.90, 3.9], ['betAps', 16.718, -77.52, 4.2], ['delAps', 16.339, -78.69, 4.7],
    ['alpCha', 8.309, -76.92, 4.1], ['gamCha', 10.591, -78.61, 4.1], ['betCha', 12.306, -79.31, 4.2], ['delCha', 10.763, -80.54, 4.5], ['theCha', 8.344, -77.48, 4.3],
    ['alpMus', 12.620, -69.14, 2.7], ['betMus', 12.772, -68.11, 3.0], ['delMus', 13.038, -71.55, 3.6], ['lamMus', 11.760, -66.73, 3.6], ['gamMus', 12.541, -72.13, 3.9], ['epsMus', 12.293, -67.96, 4.1],
    ['alpCir', 14.708, -64.98, 3.2], ['betCir', 15.291, -58.80, 4.1], ['gamCir', 15.390, -59.32, 4.5],
    ['gamNor', 16.331, -50.16, 4.0], ['epsNor', 16.453, -47.55, 4.5], ['etaNor', 16.054, -49.23, 4.6], ['delNor', 16.108, -45.17, 4.7],
    ['betVol', 8.428, -66.14, 3.8], ['gamVol', 7.145, -70.50, 3.6], ['zetVol', 7.697, -72.61, 3.9], ['delVol', 7.280, -67.96, 4.0], ['alpVol', 9.041, -66.40, 4.0], ['epsVol', 8.132, -68.62, 4.4],
    ['alpPic', 6.803, -61.94, 3.2], ['betPic', 5.788, -51.07, 3.9], ['gamPic', 5.830, -56.17, 4.5],
    ['alpDor', 4.567, -55.04, 3.3], ['betDor', 5.560, -62.49, 3.8], ['gamDor', 4.267, -51.49, 4.3], ['delDor', 5.746, -65.74, 4.3], ['zetDor', 5.088, -57.47, 4.7],
    ['alpRet', 4.240, -62.47, 3.3], ['betRet', 3.737, -64.81, 3.8], ['epsRet', 4.275, -59.30, 4.4], ['delRet', 3.979, -61.40, 4.6],
    ['alpHor', 4.233, -42.29, 3.9], ['betHor', 2.979, -64.07, 5.0],
    ['alpCae', 4.676, -41.86, 4.4], ['gamCae', 5.074, -35.48, 4.6],
    ['alpFor', 3.201, -28.99, 3.9], ['betFor', 2.818, -32.41, 4.5], ['nuFor', 2.075, -29.30, 4.7],
    ['alpAnt', 10.453, -31.07, 4.3], ['epsAnt', 9.487, -35.95, 4.5], ['iotAnt', 10.945, -37.14, 4.6],
    ['alpPyx', 8.726, -33.19, 3.7], ['betPyx', 8.668, -35.31, 4.0], ['gamPyx', 8.842, -27.71, 4.0],
    ['alpSex', 10.132, -0.37, 4.5], ['betSex', 10.505, -0.64, 5.1], ['gamSex', 9.875, -8.10, 5.1],
    ['alpMen', 6.170, -74.75, 5.1], ['gamMen', 5.532, -76.34, 5.2], ['betMen', 5.045, -71.31, 5.3],
    ['alpMon', 7.687, -9.55, 3.9], ['gamMon', 6.248, -6.27, 4.0], ['delMon', 7.197, -0.49, 4.2], ['betMon', 6.480, -7.03, 3.7], ['zetMon', 8.143, -2.98, 4.3], ['epsMon', 6.396, 4.59, 4.4]
  ];
  S.stars = STARS.map((s, i) => ({ i, key: s[0], ra: s[1] * 15, raH: s[1], dec: s[2], mag: s[3], name: s[4] || '', con: s[0].slice(-3) }));
  const byKey = new Map(S.stars.map(s => [s.key, s]));
  S.star = key => byKey.get(key) || null;
  S.named = () => S.stars.filter(s => s.name);
  S.brightest = n => S.stars.slice().sort((a, b) => a.mag - b.mag).slice(0, n || 50);

  /* the stick figures: pairs of star keys */
  const FIG = {
    UMa: ['etaUMa-zetUMa', 'zetUMa-epsUMa', 'epsUMa-delUMa', 'delUMa-alpUMa', 'alpUMa-betUMa', 'betUMa-gamUMa', 'gamUMa-delUMa', 'alpUMa-omiUMa', 'omiUMa-upsUMa', 'upsUMa-theUMa', 'theUMa-iotUMa', 'theUMa-kapUMa', 'gamUMa-chiUMa', 'chiUMa-psiUMa', 'psiUMa-muUMa', 'muUMa-lamUMa', 'chiUMa-nuUMa', 'nuUMa-xiUMa'],
    UMi: ['alpUMi-delUMi', 'delUMi-epsUMi', 'epsUMi-zetUMi', 'zetUMi-betUMi', 'betUMi-gamUMi', 'gamUMi-etaUMi', 'etaUMi-zetUMi'],
    Cas: ['betCas-alpCas', 'alpCas-gamCas', 'gamCas-delCas', 'delCas-epsCas'],
    Cep: ['alpCep-betCep', 'betCep-gamCep', 'gamCep-iotCep', 'iotCep-zetCep', 'zetCep-alpCep', 'zetCep-delCep', 'alpCep-etaCep'],
    Dra: ['lamDra-kapDra', 'kapDra-alpDra', 'alpDra-iotDra', 'iotDra-etaDra', 'etaDra-zetDra', 'zetDra-chiDra', 'chiDra-delDra', 'delDra-xiDra', 'xiDra-nuDra', 'nuDra-betDra', 'betDra-gamDra', 'gamDra-xiDra'],
    Ori: ['alpOri-gamOri', 'gamOri-delOri', 'delOri-epsOri', 'epsOri-zetOri', 'zetOri-alpOri', 'delOri-betOri', 'zetOri-kapOri', 'gamOri-lamOri', 'lamOri-alpOri', 'gamOri-pi3Ori', 'pi3Ori-pi2Ori', 'pi2Ori-pi1Ori', 'pi3Ori-pi4Ori', 'pi4Ori-pi5Ori', 'epsOri-iotOri'],
    Tau: ['gamTau-delTau', 'delTau-epsTau', 'epsTau-betTau', 'gamTau-theTau', 'theTau-alpTau', 'alpTau-zetTau', 'gamTau-lamTau', 'lamTau-xiTau', 'xiTau-omiTau'],
    Gem: ['alpGem-tauGem', 'tauGem-epsGem', 'epsGem-muGem', 'muGem-etaGem', 'betGem-upsGem', 'upsGem-delGem', 'delGem-zetGem', 'zetGem-gamGem', 'delGem-lamGem', 'lamGem-xiGem', 'epsGem-nuGem', 'betGem-kapGem', 'tauGem-iotGem', 'iotGem-upsGem'],
    CMa: ['alpCMa-betCMa', 'alpCMa-iotCMa', 'iotCMa-theCMa', 'alpCMa-omi2CMa', 'omi2CMa-delCMa', 'delCMa-etaCMa', 'delCMa-epsCMa', 'epsCMa-zetCMa', 'epsCMa-sigCMa', 'sigCMa-delCMa', 'omi1CMa-betCMa'],
    CMi: ['alpCMi-betCMi'],
    Leo: ['alpLeo-etaLeo', 'etaLeo-gamLeo', 'gamLeo-zetLeo', 'zetLeo-muLeo', 'muLeo-epsLeo', 'epsLeo-lamLeo', 'alpLeo-theLeo', 'theLeo-betLeo', 'betLeo-delLeo', 'delLeo-theLeo', 'gamLeo-delLeo', 'alpLeo-omiLeo'],
    Vir: ['nuVir-betVir', 'betVir-etaVir', 'etaVir-gamVir', 'gamVir-delVir', 'delVir-epsVir', 'gamVir-theVir', 'theVir-alpVir', 'delVir-zetVir', 'zetVir-tauVir', 'tauVir-109Vir', 'zetVir-iotVir', 'iotVir-muVir', 'alpVir-kapVir'],
    Boo: ['alpBoo-etaBoo', 'alpBoo-epsBoo', 'epsBoo-delBoo', 'delBoo-betBoo', 'betBoo-gamBoo', 'gamBoo-rhoBoo', 'rhoBoo-alpBoo', 'alpBoo-zetBoo', 'gamBoo-lamBoo', 'lamBoo-theBoo'],
    Lyr: ['alpLyr-epsLyr', 'alpLyr-zetLyr', 'zetLyr-betLyr', 'betLyr-gamLyr', 'gamLyr-delLyr', 'delLyr-zetLyr'],
    Cyg: ['alpCyg-gamCyg', 'gamCyg-etaCyg', 'etaCyg-betCyg', 'gamCyg-epsCyg', 'epsCyg-zetCyg', 'gamCyg-delCyg', 'delCyg-iotCyg', 'iotCyg-kapCyg'],
    Aql: ['betAql-alpAql', 'alpAql-gamAql', 'gamAql-delAql', 'delAql-zetAql', 'zetAql-epsAql', 'delAql-lamAql', 'lamAql-iotAql', 'iotAql-theAql', 'theAql-etaAql', 'etaAql-alpAql'],
    Sco: ['betSco-delSco', 'delSco-piSco', 'delSco-sigSco', 'sigSco-alpSco', 'alpSco-tauSco', 'tauSco-epsSco', 'epsSco-mu1Sco', 'mu1Sco-zet2Sco', 'zet2Sco-etaSco', 'etaSco-theSco', 'theSco-iot1Sco', 'iot1Sco-kapSco', 'kapSco-upsSco', 'upsSco-lamSco', 'betSco-nuSco'],
    Sgr: ['gamSgr-delSgr', 'delSgr-epsSgr', 'epsSgr-zetSgr', 'zetSgr-phiSgr', 'phiSgr-delSgr', 'delSgr-lamSgr', 'lamSgr-phiSgr', 'phiSgr-sigSgr', 'sigSgr-tauSgr', 'tauSgr-zetSgr', 'epsSgr-etaSgr', 'sigSgr-piSgr'],
    Cru: ['alpCru-gamCru', 'betCru-delCru'],
    Cen: ['alpCen-betCen', 'betCen-epsCen', 'epsCen-zetCen', 'zetCen-gamCen', 'gamCen-delCen', 'zetCen-muCen', 'muCen-nuCen', 'nuCen-theCen', 'theCen-iotCen', 'zetCen-etaCen', 'etaCen-kapCen'],
    Car: ['alpCar-chiCar', 'chiCar-epsCar', 'epsCar-iotCar', 'iotCar-qCar', 'qCar-theCar', 'theCar-upsCar', 'upsCar-betCar', 'betCar-omeCar', 'omeCar-theCar'],
    Vel: ['gamVel-lamVel', 'lamVel-psiVel', 'psiVel-muVel', 'muVel-phiVel', 'phiVel-kapVel', 'kapVel-delVel', 'delVel-gamVel'],
    Pup: ['zetPup-rhoPup', 'rhoPup-xiPup', 'zetPup-piPup', 'piPup-nuPup', 'nuPup-tauPup', 'piPup-sigPup'],
    Per: ['etaPer-gamPer', 'gamPer-alpPer', 'alpPer-delPer', 'delPer-epsPer', 'epsPer-xiPer', 'xiPer-zetPer', 'zetPer-omiPer', 'alpPer-kapPer', 'kapPer-betPer', 'betPer-rhoPer', 'alpPer-iotPer', 'iotPer-thePer'],
    And: ['alpAnd-delAnd', 'delAnd-betAnd', 'betAnd-gamAnd', 'betAnd-muAnd', 'muAnd-nuAnd', 'delAnd-epsAnd', 'epsAnd-zetAnd', 'zetAnd-etaAnd', 'delAnd-piAnd'],
    Peg: ['alpPeg-betPeg', 'betPeg-alpAnd', 'alpAnd-gamPeg', 'gamPeg-alpPeg', 'alpPeg-zetPeg', 'zetPeg-thePeg', 'thePeg-epsPeg', 'betPeg-etaPeg', 'etaPeg-piPeg', 'betPeg-muPeg', 'muPeg-lamPeg', 'lamPeg-iotPeg', 'iotPeg-kapPeg'],
    Aur: ['alpAur-epsAur', 'epsAur-iotAur', 'iotAur-betTau', 'betTau-theAur', 'theAur-betAur', 'betAur-alpAur', 'betAur-delAur', 'epsAur-zetAur', 'zetAur-etaAur'],
    Ari: ['gamAri-betAri', 'betAri-alpAri', 'alpAri-41Ari'],
    Psc: ['thePsc-gamPsc', 'gamPsc-kapPsc', 'kapPsc-lamPsc', 'lamPsc-iotPsc', 'iotPsc-thePsc', 'iotPsc-omePsc', 'omePsc-delPsc', 'delPsc-epsPsc', 'epsPsc-muPsc', 'muPsc-nuPsc', 'nuPsc-alpPsc', 'alpPsc-omiPsc', 'omiPsc-etaPsc', 'etaPsc-chiPsc', 'chiPsc-phiPsc', 'phiPsc-upsPsc', 'upsPsc-tauPsc'],
    Aqr: ['epsAqr-betAqr', 'betAqr-alpAqr', 'alpAqr-gamAqr', 'gamAqr-zetAqr', 'zetAqr-etaAqr', 'alpAqr-theAqr', 'theAqr-lamAqr', 'lamAqr-phiAqr', 'lamAqr-tauAqr', 'tauAqr-delAqr', 'delAqr-88Aqr', '88Aqr-98Aqr', 'betAqr-iotAqr'],
    Cap: ['alpCap-betCap', 'betCap-psiCap', 'psiCap-omeCap', 'omeCap-zetCap', 'zetCap-epsCap', 'epsCap-delCap', 'delCap-gamCap', 'gamCap-iotCap', 'iotCap-theCap', 'theCap-alpCap'],
    PsA: ['alpPsA-epsPsA', 'epsPsA-muPsA', 'muPsA-iotPsA', 'iotPsA-betPsA', 'betPsA-gamPsA', 'gamPsA-delPsA', 'delPsA-alpPsA'],
    Gru: ['gamGru-lamGru', 'lamGru-delGru', 'delGru-alpGru', 'delGru-betGru', 'betGru-epsGru', 'epsGru-zetGru', 'betGru-iotGru', 'iotGru-theGru'],
    Pav: ['alpPav-betPav', 'betPav-gamPav', 'betPav-delPav', 'delPav-epsPav', 'epsPav-zetPav', 'delPav-kapPav', 'kapPav-lamPav', 'lamPav-xiPav', 'xiPav-piPav', 'piPav-etaPav'],
    Eri: ['betEri-muEri', 'muEri-nuEri', 'nuEri-omi1Eri', 'omi1Eri-gamEri', 'gamEri-piEri', 'piEri-delEri', 'delEri-epsEri', 'epsEri-etaEri', 'etaEri-tau1Eri', 'tau1Eri-tau2Eri', 'tau2Eri-tau3Eri', 'tau3Eri-tau4Eri', 'tau4Eri-tau5Eri', 'tau5Eri-tau6Eri', 'tau6Eri-tau9Eri', 'tau9Eri-ups1Eri', 'ups1Eri-ups2Eri', 'ups2Eri-43Eri', '43Eri-theEri', 'theEri-iotEri', 'iotEri-kapEri', 'kapEri-phiEri', 'phiEri-chiEri', 'chiEri-alpEri'],
    Cet: ['alpCet-lamCet', 'lamCet-muCet', 'muCet-xi2Cet', 'xi2Cet-nuCet', 'nuCet-gamCet', 'gamCet-alpCet', 'gamCet-delCet', 'delCet-omiCet', 'omiCet-zetCet', 'zetCet-tauCet', 'tauCet-betCet', 'betCet-iotCet', 'iotCet-etaCet', 'etaCet-theCet', 'theCet-zetCet'],
    Oph: ['alpOph-betOph', 'betOph-gamOph', 'gamOph-nuOph', 'nuOph-etaOph', 'etaOph-zetOph', 'zetOph-epsOph', 'epsOph-delOph', 'delOph-lamOph', 'lamOph-kapOph', 'kapOph-alpOph', 'etaOph-theOph'],
    Her: ['epsHer-zetHer', 'zetHer-etaHer', 'etaHer-piHer', 'piHer-epsHer', 'zetHer-betHer', 'betHer-gamHer', 'epsHer-delHer', 'delHer-lamHer', 'lamHer-muHer', 'muHer-xiHer', 'xiHer-omiHer', 'etaHer-sigHer', 'sigHer-tauHer', 'piHer-theHer', 'theHer-iotHer', 'delHer-alpHer'],
    CrA: ['gamCrA-alpCrA', 'alpCrA-betCrA', 'betCrA-delCrA'],
    CrB: ['theCrB-betCrB', 'betCrB-alpCrB', 'alpCrB-gamCrB', 'gamCrB-delCrB', 'delCrB-epsCrB', 'epsCrB-iotCrB'],
    Lib: ['sigLib-alpLib', 'alpLib-betLib', 'betLib-gamLib', 'sigLib-upsLib', 'upsLib-tauLib'],
    Hya: ['zetHya-epsHya', 'epsHya-delHya', 'delHya-sigHya', 'sigHya-etaHya', 'etaHya-zetHya', 'zetHya-theHya', 'theHya-iotHya', 'iotHya-alpHya', 'alpHya-ups1Hya', 'ups1Hya-lamHya', 'lamHya-muHya', 'muHya-nuHya', 'nuHya-xiHya', 'xiHya-betHya', 'betHya-gamHya', 'gamHya-piHya'],
    Crv: ['alpCrv-epsCrv', 'epsCrv-gamCrv', 'gamCrv-delCrv', 'delCrv-betCrv', 'betCrv-epsCrv'],
    Crt: ['alpCrt-betCrt', 'betCrt-gamCrt', 'gamCrt-delCrt', 'delCrt-alpCrt', 'gamCrt-zetCrt', 'zetCrt-etaCrt', 'delCrt-epsCrt', 'epsCrt-theCrt'],
    Lep: ['muLep-alpLep', 'alpLep-betLep', 'betLep-epsLep', 'epsLep-muLep', 'alpLep-zetLep', 'zetLep-etaLep', 'betLep-gamLep', 'gamLep-delLep', 'muLep-lamLep', 'muLep-kapLep'],
    Col: ['epsCol-alpCol', 'alpCol-betCol', 'betCol-gamCol', 'gamCol-delCol', 'betCol-etaCol'],
    Lup: ['alpLup-betLup', 'betLup-delLup', 'delLup-gamLup', 'gamLup-epsLup', 'epsLup-zetLup', 'zetLup-alpLup', 'gamLup-etaLup', 'delLup-phiLup', 'phiLup-chiLup', 'etaLup-theLup'],
    TrA: ['alpTrA-betTrA', 'betTrA-gamTrA', 'gamTrA-alpTrA'],
    Ara: ['alpAra-betAra', 'betAra-gamAra', 'gamAra-delAra', 'delAra-etaAra', 'etaAra-zetAra', 'zetAra-epsAra', 'epsAra-alpAra', 'alpAra-theAra'],
    Cnc: ['iotCnc-gamCnc', 'gamCnc-delCnc', 'delCnc-alpCnc', 'delCnc-betCnc'],
    LMi: ['10LMi-21LMi', '21LMi-betLMi', 'betLMi-46LMi', '46LMi-21LMi'],
    Lyn: ['alpLyn-38Lyn', '38Lyn-31Lyn', '31Lyn-21Lyn', '21Lyn-15Lyn', '15Lyn-2Lyn'],
    Cam: ['betCam-alpCam', 'alpCam-gamCam', 'betCam-7Cam'],
    Lac: ['betLac-alpLac', 'alpLac-4Lac', '4Lac-5Lac', '5Lac-2Lac', '2Lac-6Lac', '6Lac-11Lac', '6Lac-1Lac'],
    Vul: ['alpVul-13Vul'],
    Sge: ['alpSge-delSge', 'betSge-delSge', 'delSge-gamSge'],
    Del: ['epsDel-betDel', 'betDel-alpDel', 'alpDel-gamDel', 'gamDel-delDel', 'delDel-betDel'],
    Equ: ['alpEqu-delEqu', 'delEqu-gamEqu'],
    Tri: ['alpTri-betTri', 'betTri-gamTri', 'gamTri-alpTri'],
    CVn: ['alpCVn-betCVn'],
    Com: ['alpCom-betCom', 'betCom-gamCom'],
    Ser: ['iotSer-kapSer', 'kapSer-gamSer', 'gamSer-betSer', 'betSer-delSer', 'delSer-alpSer', 'alpSer-epsSer', 'epsSer-muSer', 'nuSer-xiSer', 'xiSer-omiSer', 'omiSer-etaSer', 'etaSer-theSer'],
    Sct: ['betSct-alpSct', 'alpSct-gamSct', 'betSct-delSct'],
    Tel: ['epsTel-alpTel', 'alpTel-zetTel'],
    Ind: ['alpInd-theInd', 'theInd-delInd', 'alpInd-betInd'],
    Mic: ['alpMic-gamMic', 'gamMic-epsMic'],
    Scl: ['alpScl-delScl', 'delScl-gamScl', 'gamScl-betScl'],
    Phe: ['epsPhe-alpPhe', 'alpPhe-betPhe', 'betPhe-gamPhe', 'gamPhe-delPhe', 'delPhe-zetPhe', 'zetPhe-betPhe'],
    Hyi: ['alpHyi-betHyi', 'betHyi-gamHyi', 'gamHyi-epsHyi', 'epsHyi-delHyi', 'delHyi-alpHyi'],
    Tuc: ['alpTuc-gamTuc', 'gamTuc-betTuc', 'betTuc-zetTuc', 'zetTuc-epsTuc', 'epsTuc-delTuc', 'delTuc-alpTuc'],
    Oct: ['nuOct-betOct', 'betOct-delOct', 'delOct-nuOct'],
    Aps: ['alpAps-delAps', 'delAps-gamAps', 'gamAps-betAps'],
    Cha: ['alpCha-gamCha', 'gamCha-betCha', 'betCha-delCha', 'delCha-gamCha', 'alpCha-theCha'],
    Mus: ['lamMus-epsMus', 'epsMus-alpMus', 'alpMus-betMus', 'betMus-delMus', 'delMus-gamMus', 'gamMus-alpMus'],
    Cir: ['betCir-alpCir', 'alpCir-gamCir'],
    Nor: ['gamNor-epsNor', 'epsNor-delNor', 'delNor-etaNor', 'etaNor-gamNor'],
    Vol: ['alpVol-betVol', 'betVol-epsVol', 'epsVol-delVol', 'delVol-gamVol', 'gamVol-zetVol', 'zetVol-epsVol'],
    Pic: ['alpPic-gamPic', 'gamPic-betPic'],
    Dor: ['gamDor-alpDor', 'alpDor-zetDor', 'zetDor-betDor', 'betDor-delDor'],
    Ret: ['alpRet-betRet', 'betRet-delRet', 'delRet-epsRet', 'epsRet-alpRet'],
    Hor: ['alpHor-betHor'],
    Cae: ['alpCae-gamCae'],
    For: ['alpFor-betFor', 'betFor-nuFor'],
    Ant: ['epsAnt-alpAnt', 'alpAnt-iotAnt'],
    Pyx: ['betPyx-alpPyx', 'alpPyx-gamPyx'],
    Sex: ['gamSex-alpSex', 'alpSex-betSex'],
    Men: ['alpMen-gamMen', 'gamMen-betMen'],
    Mon: ['betMon-gamMon', 'betMon-delMon', 'delMon-epsMon', 'alpMon-delMon', 'alpMon-zetMon']
  };
  S.CONSTELLATION_NAMES = { And: 'Andromeda', Ant: 'Antlia', Aps: 'Apus', Aqr: 'Aquarius', Aql: 'Aquila', Ara: 'Ara', Ari: 'Aries', Aur: 'Auriga', Boo: 'Boötes', Cae: 'Caelum', Cam: 'Camelopardalis', Cnc: 'Cancer', CVn: 'Canes Venatici', CMa: 'Canis Major', CMi: 'Canis Minor', Cap: 'Capricornus', Car: 'Carina', Cas: 'Cassiopeia', Cen: 'Centaurus', Cep: 'Cepheus', Cet: 'Cetus', Cha: 'Chamaeleon', Cir: 'Circinus', Col: 'Columba', Com: 'Coma Berenices', CrA: 'Corona Australis', CrB: 'Corona Borealis', Crv: 'Corvus', Crt: 'Crater', Cru: 'Crux', Cyg: 'Cygnus', Del: 'Delphinus', Dor: 'Dorado', Dra: 'Draco', Equ: 'Equuleus', Eri: 'Eridanus', For: 'Fornax', Gem: 'Gemini', Gru: 'Grus', Her: 'Hercules', Hor: 'Horologium', Hya: 'Hydra', Hyi: 'Hydrus', Ind: 'Indus', Lac: 'Lacerta', Leo: 'Leo', LMi: 'Leo Minor', Lep: 'Lepus', Lib: 'Libra', Lup: 'Lupus', Lyn: 'Lynx', Lyr: 'Lyra', Men: 'Mensa', Mic: 'Microscopium', Mon: 'Monoceros', Mus: 'Musca', Nor: 'Norma', Oct: 'Octans', Oph: 'Ophiuchus', Ori: 'Orion', Pav: 'Pavo', Peg: 'Pegasus', Per: 'Perseus', Phe: 'Phoenix', Pic: 'Pictor', Psc: 'Pisces', PsA: 'Piscis Austrinus', Pup: 'Puppis', Pyx: 'Pyxis', Ret: 'Reticulum', Sge: 'Sagitta', Sgr: 'Sagittarius', Sco: 'Scorpius', Scl: 'Sculptor', Sct: 'Scutum', Ser: 'Serpens', Sex: 'Sextans', Tau: 'Taurus', Tel: 'Telescopium', Tri: 'Triangulum', TrA: 'Triangulum Australe', Tuc: 'Tucana', UMa: 'Ursa Major', UMi: 'Ursa Minor', Vel: 'Vela', Vir: 'Virgo', Vol: 'Volans', Vul: 'Vulpecula' };
  S.constellations = Object.keys(FIG).map(abbr => {
    const lines = FIG[abbr].map(pair => { const [a, b] = pair.split('-'); const A = byKey.get(a), B = byKey.get(b); if (!A || !B) throw new Error('celestial.js: unknown star in ' + abbr + ': ' + pair); return [A.i, B.i]; });
    const mine = S.stars.filter(s => s.con === abbr);
    const cx = mine.length ? mine.reduce((a, s) => a + s.ra, 0) / mine.length : 0, cy = mine.length ? mine.reduce((a, s) => a + s.dec, 0) / mine.length : 0;
    return { abbr, name: S.CONSTELLATION_NAMES[abbr] || abbr, lines, ra: cx, dec: cy };
  });
  S.deepSky = [
    { name: 'Andromeda Galaxy (M31)', ra: 10.68, dec: 41.27, type: 'galaxy' }, { name: 'Orion Nebula (M42)', ra: 83.82, dec: -5.39, type: 'nebula' }, { name: 'Pleiades (M45)', ra: 56.85, dec: 24.12, type: 'cluster' },
    { name: 'Hyades', ra: 66.75, dec: 15.87, type: 'cluster' }, { name: 'Hercules Cluster (M13)', ra: 250.42, dec: 36.46, type: 'globular' }, { name: 'Praesepe (M44)', ra: 130.1, dec: 19.67, type: 'cluster' },
    { name: 'Omega Centauri', ra: 201.69, dec: -47.48, type: 'globular' }, { name: '47 Tucanae', ra: 6.02, dec: -72.08, type: 'globular' }, { name: 'Large Magellanic Cloud', ra: 80.89, dec: -69.76, type: 'galaxy' },
    { name: 'Small Magellanic Cloud', ra: 13.19, dec: -72.83, type: 'galaxy' }, { name: 'Coalsack', ra: 193.0, dec: -63.0, type: 'dark nebula' }, { name: 'Ptolemy Cluster (M7)', ra: 268.45, dec: -34.8, type: 'cluster' },
    { name: 'Lagoon Nebula (M8)', ra: 270.9, dec: -24.38, type: 'nebula' }, { name: 'Ring Nebula (M57)', ra: 283.4, dec: 33.03, type: 'nebula' }, { name: 'Whirlpool Galaxy (M51)', ra: 202.47, dec: 47.2, type: 'galaxy' },
    { name: 'Galactic centre', ra: 266.42, dec: -29.0, type: 'centre' }, { name: 'Double Cluster', ra: 34.9, dec: 57.15, type: 'cluster' }
  ];
  /* everything in the sky at one moment and place: stars and planets with alt/az (for drawing) */
  S.scene = (jd, lat, lon, magLimit) => {
    const lst = S.lst(jd, lon), out = { lst, stars: [], bodies: [] };
    for (const s of S.stars) { if (magLimit != null && s.mag > magLimit) continue; const h = S.eqToHor(s.ra, s.dec, lst, lat); out.stars.push({ s, alt: h.alt, az: h.az }); }
    for (const b of ['sun', 'moon'].concat(S.PLANETS)) { const o = S.body(b, jd), h = S.eqToHor(o.ra, o.dec, lst, lat); out.bodies.push(Object.assign(o, { alt: h.alt, az: h.az })); }
    return out;
  };
})(typeof window !== 'undefined' ? window : globalThis);
