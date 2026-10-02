/* Tests of HYPER-CORE/js/celestial.js (kit.sky). Run: node HYPER-CORE/tools/test-celestial.js */
'use strict';
const L = require('./load.js');
const H = L.loadCore(), S = H.sky;
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL ' + m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, m + ' (got ' + a + ', want ' + b + ')');
const dAngle = (a, b) => { let d = (a - b) % 360; if (d > 180) d -= 360; if (d < -180) d += 360; return Math.abs(d); };

// time
near(S.jd(new Date(Date.UTC(2000, 0, 1, 12))), 2451545, 1e-9, 'J2000.0 is JD 2451545.0');
near(S.jdUT(2000, 1, 1, 12), 2451545, 1e-9, 'jdUT builds the same');
near(S.gmst(2451545), 280.46, 0.01, 'GMST at J2000.0 = 280.46°');
near(S.gmst(2451545 + 1), (280.46 + 360.9856) % 360, 0.01, 'a day later: +360.9856° (mod 360)');
near(S.lst(2451545, 30), 310.46, 0.01, 'LST = GMST + longitude');
near(S.obliquity(2451545), 23.4393, 1e-3, 'obliquity at J2000');

// coordinate systems: round trips and known points
const e = S.eclToEq(0, 0, 2451545); near(e.ra, 0, 1e-9, 'the vernal point: RA 0'); near(e.dec, 0, 1e-9, '… Dec 0');
const e2 = S.eclToEq(90, 0, 2451545); near(e2.dec, 23.4393, 1e-3, 'the summer solstice point is at Dec +ε');
const back = S.eqToEcl(e2.ra, e2.dec, 2451545); near(back.lon, 90, 1e-9, 'eqToEcl inverts eclToEq');
const g = S.eqToGal(266.405, -28.936); near(g.l, 0, 0.1, 'the galactic centre at l = 0'); near(g.b, 0, 0.1, '… b = 0');
const gp = S.eqToGal(192.85948, 27.12825); near(gp.b, 90, 1e-6, 'the galactic pole at b = 90');
const g2 = S.galToEq(g.l, g.b); near(dAngle(g2.ra, 266.405), 0, 1e-6, 'galToEq inverts'); near(g2.dec, -28.936, 1e-6, '… dec');
const lst = 100, lat = 40;
const h = S.eqToHor(100, 40, lst, lat); near(h.alt, 90, 1e-5, 'a star on the meridian at the observer\'s latitude is at the zenith');
const hp = S.eqToHor(0, 90, lst, lat); near(hp.alt, lat, 1e-9, 'the pole\'s altitude is the latitude'); near(hp.az, 0, 1e-6, '… due north');
const hs = S.eqToHor(lst, -10, lst, lat); near(hs.az, 180, 1e-6, 'a star on the meridian south of the zenith is due south'); near(hs.alt, 40, 1e-9, '… at 90 − φ + δ');
const he = S.eqToHor(lst + 90, 0, lst, lat); near(he.az, 90, 1e-6, 'a star on the equator 6 h before culmination (hour angle −90°) is due east'); near(he.alt, 0, 1e-9, '… on the horizon');
const hw = S.eqToHor(lst - 90, 0, lst, lat); near(hw.az, 270, 1e-6, '… and 6 h after culmination it is due west');
const sunLondon = S.altAz('sun', S.jdUT(2026, 3, 20, 15), 51.5, -0.13); ok(sunLondon.az > 215 && sunLondon.az < 245, 'the Sun at 15 h UT in London is in the south-west (az ≈ 230°)');
const sunMorning = S.altAz('sun', S.jdUT(2026, 3, 20, 9), 51.5, -0.13); ok(sunMorning.az > 115 && sunMorning.az < 145, 'the Sun at 9 h UT in London is in the south-east (az ≈ 130°)');
for (const [ra, dec] of [[33, 12], [250, -40], [190, 70]]) { const hh = S.eqToHor(ra, dec, lst, lat), bk = S.horToEq(hh.alt, hh.az, lst, lat); near(dAngle(bk.ra, ra), 0, 1e-6, 'horToEq inverts eqToHor (ra ' + ra + ')'); near(bk.dec, dec, 1e-6, '… dec'); }
const fr = S.cameraFrame(0, 0); const cN = S.toCamera(fr, S.enu(0, 0)); near(cN[2], 1, 1e-9, 'camera looking north: north is ahead'); const cE = S.toCamera(fr, S.enu(0, 90)); near(cE[0], 1, 1e-9, '… east is to the right'); const cZ = S.toCamera(fr, S.enu(90, 0)); near(cZ[1], 1, 1e-9, '… the zenith is up');

// the Sun
const s0 = S.sun(2451545); near(s0.dec, -23.0, 0.1, 'the Sun on 2000-01-01: Dec −23.0°'); near(s0.ra, 281.3, 0.2, '… RA 18h45m');
const eqx = S.sun(S.jdUT(2024, 3, 20, 3.1)); near(eqx.dec, 0, 0.05, 'the March 2024 equinox: Dec 0'); near(eqx.lon, 0, 0.05, '… longitude 0');
const sol = S.sun(S.jdUT(2024, 6, 20, 20.85)); near(sol.dec, 23.44, 0.02, 'the June 2024 solstice: Dec +23.44°');
const dec21 = S.sun(S.jdUT(2024, 12, 21, 9.3)); near(dec21.lon, 270, 0.05, 'the December solstice: longitude 270°');
near(S.equationOfTime(S.jdUT(2024, 11, 3, 12)), 16.4, 0.4, 'equation of time early November ≈ +16.4 min');
near(S.equationOfTime(S.jdUT(2024, 2, 11, 12)), -14.2, 0.4, 'equation of time mid February ≈ −14.2 min');
const ev = S.sunEvents(S.jdUT(2024, 6, 21, 0), 51.5, -0.13);
near(ev.rise, 3.72, 0.05, 'London sunrise 21 June 2024 ≈ 03:43 UT'); near(ev.set, 20.35, 0.05, '… sunset ≈ 20:21 UT'); near(ev.maxAlt, 62, 0.2, '… noon altitude ≈ 62°');
const polar = S.sunEvents(S.jdUT(2024, 12, 21, 0), 78.22, 15.63); ok(polar.neverUp, 'Longyearbyen at midwinter: polar night');
const midnight = S.sunEvents(S.jdUT(2024, 6, 21, 0), 78.22, 15.63); ok(midnight.alwaysUp, 'Longyearbyen at midsummer: midnight sun');
const eqDay = S.sunEvents(S.jdUT(2024, 3, 20, 0), 0, 0); near(eqDay.dayLength, 12.1, 0.1, 'on the equator at the equinox the day is 12 h (plus refraction)');

// the Moon and the planets (JPL/almanac reference values, loose tolerances for a low-precision model)
// phases are defined by the difference of ecliptic longitude from the Sun (the Moon can be 5° off the ecliptic, so the elongation differs)
const full = S.moon(S.jdUT(2024, 1, 25, 17.9)); ok(full.phase > 0.99, 'full moon 25 Jan 2024'); near(dAngle(full.lon - S.sun(S.jdUT(2024, 1, 25, 17.9)).lon, 180), 0, 1.0, '… 180° from the Sun in longitude');
const newm = S.moon(S.jdUT(2024, 1, 11, 11.95)); ok(newm.phase < 0.01, 'new moon 11 Jan 2024'); near(dAngle(newm.lon, S.sun(S.jdUT(2024, 1, 11, 11.95)).lon), 0, 1.0, '… at the Sun\'s longitude');
const fq = S.moon(S.jdUT(2024, 1, 18, 3.9)); near(fq.phase, 0.5, 0.03, 'first quarter 18 Jan 2024: half lit'); ok(fq.waxing, '… waxing');
const m1 = S.moon(S.jdUT(2024, 1, 1, 0)); near(dAngle(m1.ra, 158), 0, 2.5, 'the Moon on 2024-01-01 0h: RA ≈ 10h30m (reference to a degree)'); near(m1.dec, 13, 2.5, '… Dec ≈ +13°');
ok(m1.dist > 55 && m1.dist < 64, 'the Moon between 55 and 64 Earth radii');
// the planets, checked at oppositions and conjunctions (dates reliable to half a day): the elongation in longitude is 180° or 0°
const elong = (name, jd) => dAngle(S.planet(name, jd).lon - S.sun(jd).lon, 0);
near(elong('jupiter', S.jdUT(2023, 11, 3, 5)), 180, 1.0, 'Jupiter at opposition, 3 Nov 2023');
near(elong('saturn', S.jdUT(2023, 8, 27, 8)), 180, 1.0, 'Saturn at opposition, 27 Aug 2023');
near(elong('mars', S.jdUT(2022, 12, 8, 6)), 180, 1.0, 'Mars at opposition, 8 Dec 2022');
near(elong('mars', S.jdUT(2023, 11, 18, 6)), 0, 1.0, 'Mars in conjunction with the Sun, 18 Nov 2023');
near(elong('uranus', S.jdUT(2023, 11, 13, 17)), 180, 1.0, 'Uranus at opposition, 13 Nov 2023');
near(elong('neptune', S.jdUT(2023, 9, 19, 11)), 180, 1.0, 'Neptune at opposition, 19 Sep 2023');
near(elong('venus', S.jdUT(2023, 8, 13, 11)), 0, 1.5, 'Venus at inferior conjunction, 13 Aug 2023');
near(elong('venus', S.jdUT(2024, 6, 4, 16)), 0, 1.5, 'Venus at superior conjunction, 4 Jun 2024');
near(elong('mercury', S.jdUT(2023, 9, 6, 11)), 0, 1.5, 'Mercury at inferior conjunction, 6 Sep 2023');
const jup = S.planet('jupiter', S.jdUT(2023, 11, 3, 5)); ok(jup.mag < -2.5 && jup.mag > -3.2, 'Jupiter at opposition about magnitude −2.9');
const ven = S.planet('venus', S.jdUT(2023, 9, 19, 0)); ok(ven.mag < -4.3, 'Venus near greatest brilliancy, Sep 2023'); ok(ven.phase < 0.35, '… a crescent');
ok(S.planet('saturn', S.jdUT(2024, 1, 1, 0)).dec < -5, 'Saturn in Aquarius in 2024: southern declination');
for (const p of S.PLANETS) { const b = S.planet(p, 2451545 + 9000); ok(isFinite(b.ra) && isFinite(b.dec) && isFinite(b.mag) && b.dist > 0, p + ' is finite far from the epoch'); }

// the stars and the figures
ok(S.stars.length > 600, 'more than 600 stars');
ok(S.stars.every(s => s.ra >= 0 && s.ra < 360 && Math.abs(s.dec) <= 90 && isFinite(s.mag)), 'every star has valid coordinates');
ok(S.constellations.length === 88, 'all 88 constellations have figures (got ' + S.constellations.length + ')');
ok(S.constellations.every(c => c.lines.length > 0 && c.lines.every(([a, b]) => S.stars[a] && S.stars[b] && a !== b)), 'every figure line joins two catalogue stars');
ok(S.constellations.every(c => c.lines.every(([a, b]) => { const A = S.stars[a], B = S.stars[b]; const d = Math.acos(Math.max(-1, Math.min(1, Math.sin(A.dec * Math.PI / 180) * Math.sin(B.dec * Math.PI / 180) + Math.cos(A.dec * Math.PI / 180) * Math.cos(B.dec * Math.PI / 180) * Math.cos((A.ra - B.ra) * Math.PI / 180)))) * 180 / Math.PI; return d < 40; })), 'no figure line longer than 40° (a typo in a coordinate would show here)');
const sir = S.star('alpCMa'); near(sir.ra, 101.28, 0.1, 'Sirius RA'); near(sir.dec, -16.72, 0.05, 'Sirius Dec'); ok(sir.mag < -1, 'Sirius is the brightest');
ok(S.brightest(5).map(s => s.name).join() === 'Sirius,Canopus,Rigil Kentaurus,Arcturus,Vega', 'the five brightest in order (got ' + S.brightest(5).map(s => s.name).join() + ')');
const sc = S.scene(S.jdUT(2024, 1, 1, 0), 40, 0, 3); ok(sc.stars.length > 50 && sc.bodies.length === 9, 'a scene has stars and nine bodies');
ok(S.deepSky.length > 10 && S.deepSky.every(o => isFinite(o.ra) && isFinite(o.dec)), 'deep-sky landmarks');

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
