/* Tests of HYPER-CORE/js/ergo.js (kit.ergo). Run: node HYPER-CORE/tools/test-ergo.js */
'use strict';
const L = require('./load.js');
const H = L.loadCore(), E = H.ergo;
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL ' + m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), m + ' (got ' + a + ', want ' + b + ')');

// the normal distribution
near(E.phi(1.6448536), 0.95, 1e-6, 'Φ(1.645) = 0.95');
near(E.z(0.95), 1.6448536, 1e-6, 'z(0.95) = 1.645');
near(E.z(0.01), -2.3263479, 1e-6, 'z(0.01), lower tail');
near(E.z(0.999), 3.0902323, 1e-6, 'z(0.999), upper tail');

// anthropometry
near(E.pct('stature', 'm', 50), 1755, 1e-12, 'median man = mean');
near(E.pct('stature', 'f', 5), 1625 - 1.6448536 * 64, 1e-6, '5th percentile woman: μ − 1.645σ');
const mix5 = E.pctMix('stature', 5), mix95 = E.pctMix('stature', 95);
ok(mix5 < E.pct('stature', 'm', 5) && mix5 > E.pct('stature', 'f', 5) - 20 && mix95 > E.pct('stature', 'f', 95) && mix95 < E.pct('stature', 'm', 95) + 20, 'mixed population percentiles lie between the sexes');
near(E.fractionMix('stature', -1e9, mix95), 0.95, 1e-6, 'the mixed 95th percentile has 95 % below it');
near(E.fraction('popliteal', 'm', E.pct('popliteal', 'm', 5), E.pct('popliteal', 'm', 95)), 0.90, 1e-6, 'P5 to P95 fits 90 %');
ok(Object.values(E.DIMS).every(d => d.m[0] > 0 && d.f[0] > 0 && d.m[1] > 0 && d.f[1] > 0), 'every dimension has a mean and a spread for both sexes');
const pw = E.workstation(E.person({ sex: 'f', p: 50 }));
ok(pw.seat > 400 && pw.seat < 460 && pw.deskSit > pw.seat + 150 && pw.monitorTop > pw.deskSit, 'workstation: seat, desk and screen in a sensible order');

// NIOSH: the ideal lift gives 23 kg; the Applications Manual's multipliers
near(E.niosh({ H: 25, V: 75, D: 25, A: 0, F: 0.2, hours: 1, coupling: 'good' }).RWL, 23, 1e-12, 'NIOSH: ideal conditions give the load constant 23 kg');
const n1 = E.niosh({ H: 50, V: 30, D: 100, A: 45, F: 3, hours: 2, coupling: 'fair', load: 12 });
near(n1.HM, 0.5, 1e-12, 'HM = 25/H'); near(n1.VM, 0.865, 1e-12, 'VM = 1 − 0.003|V − 75|'); near(n1.DM, 0.865, 1e-12, 'DM = 0.82 + 4.5/D');
near(n1.AM, 0.856, 1e-12, 'AM = 1 − 0.0032A'); near(n1.FM, 0.79, 1e-12, 'FM from the table (3/min, ≤2 h)'); near(n1.CM, 0.95, 1e-12, 'fair coupling below 75 cm');
near(n1.RWL, 23 * 0.5 * 0.865 * 0.865 * 0.856 * 0.79 * 0.95, 1e-9, 'RWL is the product'); ok(n1.LI > 2, 'lifting index above 2: high risk');
ok(E.niosh({ H: 70, V: 75, D: 25 }).RWL === 0, 'NIOSH: hands beyond 63 cm → no recommended weight');

// noise
near(E.noiseDose([[85, 8]]).dose, 1, 1e-12, 'noise: 85 dB(A) for 8 h is a dose of 100 %');
near(E.noiseDose([[88, 4]]).dose, 1, 1e-12, 'noise: 3 dB more halves the permitted time');
near(E.noiseDose([[95, 4]], { criterion: 90, exchange: 5 }).dose, 1, 1e-12, 'OSHA: 95 dB(A) allowed for 4 h');
near(E.lex8([[91, 2]]), 85, 1e-3, 'LEX,8h: 91 dB(A) for 2 h is 85 dB(A) over a shift');
near(E.addDb([80, 80]), 83.01, 1e-3, 'two equal sources add 3 dB');

// vibration
near(E.a8([[5, 2]]), 2.5, 1e-12, 'A(8): 5 m/s² for 2 h');

// thermal comfort (ISO 7730, Annex D examples)
{
  const a = E.pmv({ ta: 22, tr: 22, vel: 0.1, rh: 60, met: 1.2, clo: 0.5 }), b = E.pmv({ ta: 27, tr: 27, vel: 0.1, rh: 60, met: 1.2, clo: 0.5 });
  near(a.pmv, -0.75, 0.04, 'PMV at 22 °C, 0.5 clo, 1.2 met'); near(a.ppd, 17, 0.06, 'PPD ≈ 17 %');
  near(b.pmv, 0.77, 0.04, 'PMV at 27 °C'); near(E.ppd(0), 5, 1e-12, 'PPD never below 5 %');
  const c = E.pmv({ ta: 27, tr: 27, vel: 0.3, rh: 60, met: 1.2, clo: 0.5 }); ok(c.pmv < b.pmv - 0.2, 'more air movement cools');
}
near(E.wbgt({ tnw: 25, tg: 40 }), 29.5, 1e-12, 'WBGT indoors');
near(E.windChill(-10, 30), -19.5, 0.02, 'wind chill at −10 °C and 30 km/h');

// load carriage, controls, stairs
near(E.pandolf({ W: 70, L: 0, V: 0, G: 0 }), 105, 1e-12, 'Pandolf: standing without load is 1.5 W per kg');
ok(E.pandolf({ W: 70, L: 30, V: 1.3, G: 0 }) > E.pandolf({ W: 70, L: 0, V: 1.3, G: 0 }) * 1.3, 'Pandolf: a 30 kg load costs far more');
near(E.fitts({ a: 0.1, b: 0.15, D: 300, W: 20 }), 0.1 + 0.15 * 4, 1e-12, 'Fitts: ID = log2(D/W + 1) = 4 bits');
near(E.hick({ a: 0.2, b: 0.15, n: 7 }), 0.2 + 0.15 * 3, 1e-12, 'Hick: 7 choices, 3 bits');
ok(E.blondel(170, 290).ok && !E.blondel(220, 250).ok, 'stairs: 170/290 comfortable, 220/250 too steep');

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
