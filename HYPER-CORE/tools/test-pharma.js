/* Tests of the pharmaceutics module against textbook values.
 *   node HYPER-CORE/tools/test-pharma.js
 */
'use strict';
const { loadCore } = require('./load');
const H = loadCore();
const P = H.pharma, U = H.units;
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, m + ' (got ' + a + ', want ' + b + ')');

// ionisation and solubility (Henderson–Hasselbalch)
near(P.ionised(3.5, 7.4, true), 0.99987, 1e-5, 'aspirin (pKa 3.5) at pH 7.4 is 99.99 % ionised');
near(P.ionised(3.5, 3.5, true), 0.5, 1e-12, 'half ionised at pH = pKa');
near(P.ionised(9.5, 7.4, false), 0.99212, 1e-5, 'a base of pKa 9.5 at pH 7.4');
near(P.solubility({ S0: 1, pKa: 4, pH: 6, acid: true }), 101, 1e-9, 'weak-acid solubility rises 100-fold two units above pKa');
near(P.logD(1.2, 3.5, 7.4, true), 1.2 - Math.log10(1 + Math.pow(10, 3.9)), 1e-12, 'log D of an acid');
near(P.bufferCapacity(0.1, 4.76, 4.76), 0.057575, 1e-6, 'Van Slyke: 0.576 C at pH = pKa');

// dissolution and release
near(P.f2([10, 40, 80], [10, 40, 80]), 100, 1e-12, 'f2 of identical profiles = 100');
near(P.f2([20, 50, 80], [30, 60, 90]), 49.89, 0.01, 'f2 with a steady 10 % difference is just under 50');
near(P.noyesWhitney({ D: 5e-10, A: 1e-4, h: 50e-6, Cs: 1, C: 0, V: 1e-3 }), 1e-6, 1e-15, 'Noyes–Whitney rate');
const d = P.dissolve({ dose: 1e-4, r0: 10e-6, rho: 1300, Cs: 0.1, V: 9e-4, T: 1800, dt: 1 });
ok(d[300][1] < d[900][1] && d[900][1] < d[1800][1] && d[1800][1] <= 1, 'a powder dissolves progressively');
const fine = P.dissolve({ dose: 1e-4, r0: 3e-6, rho: 1300, Cs: 0.1, V: 9e-4, T: 600, dt: 1 });
ok(fine[300][1] > d[300][1], 'smaller particles dissolve faster');
near(P.release.higuchi(0.1, 25), 0.5, 1e-12, 'Higuchi √t release'); near(P.release.first(Math.LN2, 1), 0.5, 1e-12, 'first-order release half-time');

// stability
near(P.t90({ order: 1, k: 0.01 }), 10.536, 0.001, 'first-order t90 = 0.105/k'); near(P.t90({ order: 0, k: 1, C0: 100 }), 10, 1e-12, 'zero-order t90 = 0.1 C0/k');
near(P.arrhenius({ k1: 1, T1: 298.15, T2: 313.15, Ea: 80000 }), 4.692, 0.002, 'Arrhenius: 80 kJ/mol, 25 → 40 °C ≈ ×4.7');
near(P.degrade({ order: 1, k: 0.1, C0: 100, t: 10 }), 36.79, 0.01, 'first-order decay');
const sl = P.shelfLife({ kRef: 0.01, TRef: 313.15, T: 298.15, Ea: 80000 }); near(sl.t90, 10.536 * 4.692, 0.2, 'shelf life at 25 °C from 40 °C data');

// powders, dispersions, delivery
near(P.carr(0.5, 0.6), 16.67, 0.01, 'Carr index'); near(P.hausner(0.5, 0.6), 1.2, 1e-12, 'Hausner ratio'); ok(P.flowClass(16.7) === 'fair', 'USP flow class');
near(P.stokes({ d: 10e-6, rhoP: 1200, rhoF: 1000, eta: 1e-3 }), 1.0896e-5, 1e-8, 'Stokes settling');
near(P.hlbMix([[0.6, 15], [0.4, 4.3]]), 10.72, 1e-9, 'HLB of a surfactant blend');
near(P.aerodynamic({ d: 3e-6, rho: 4000 }), 6e-6, 1e-12, 'aerodynamic diameter');

// tonicity and calculations
near(P.naclToAdd({ volume: 100, drugs: [[1, 0.23]] }), 0.67, 1e-9, 'NaCl-equivalent method');
near(P.fpdMethod({ a: 0.1, b: 0.58 }), 0.7241, 1e-4, 'freezing-point method');
near(P.osmolarity({ gPerL: 9, MW: 58.44, n: 2 }), 308, 0.1, 'osmolarity of 0.9 % NaCl');
near(P.mEq({ mg: 1000, MW: 74.55, valence: 1 }), 13.41, 0.01, 'mEq in 1 g KCl');
near(P.dilute({ C1: 10, V1: 50, C2: 2 }), 250, 1e-12, 'C1V1 = C2V2');
const al = P.alligation({ high: 95, low: 70, want: 80 }); ok(al.partsHigh === 10 && al.partsLow === 15, 'alligation parts');

// sterilisation
near(P.f0([[0, 121.1], [10, 121.1]]), 10, 1e-9, 'F0 at 121.1 °C'); near(P.f0([[0, 111.1], [10, 111.1]]), 1, 1e-9, 'F0 ten degrees lower is a tenth');
near(P.logReduction(15, 1.5), 10, 1e-12, 'log reduction'); near(P.dAtT({ D121: 1.5, z: 10, T: 111.1 }), 15, 1e-9, 'D-value at a lower temperature');

// pharmacokinetics
const tc = P.twoComp({ dose: 100, V1: 10, k10: 0.2, k12: 0.5, k21: 0.3 });
near(tc.A + tc.B, 10, 1e-9, 'two-compartment C(0) = dose/V1'); near(tc.auc, 50, 1e-9, 'two-compartment AUC = dose/(V1·k10)'); ok(tc.alpha > tc.beta, 'α > β');
const t = [0, 0.5, 1, 2, 4, 6, 8, 12, 16, 24], c = t.map(x => 10 * (Math.exp(-0.2 * x) - Math.exp(-1.5 * x)));
const r = P.nca(t, c); near(r.lambda, 0.2, 1e-4, 'NCA terminal λz'); near(r.aucInf, 10 * (1 / 0.2 - 1 / 1.5), 0.87, 'NCA AUC∞ within 2 % of the exact value (sparse samples)');
{ const a = P.nca([0, 1, 2, 3], [0, 5, 4, 3]), b = P.nca([0, 1, 2], [0, 2, 5]);
  ok(a.points === 2 && Math.abs(a.lambda - Math.log(4 / 3)) < 1e-12 && Number.isNaN(b.lambda) && Number.isNaN(b.aucInf), 'NCA takes λz only from samples after C_max'); }
const mmL = P.mmPK({ dose: 300, Vd: 50, Vmax: 500, Km: 4, tau: 24, n: 3, dt: 0.05 });
ok(mmL[mmL.length - 1][1] > 0, 'Michaelis–Menten PK runs');
ok(mmL.filter((p, i) => i && p[1] > mmL[i - 1][1]).length === 2 && mmL[0][1] === 6, 'Michaelis–Menten PK gives exactly n doses (0, τ, 2τ)');
const bq = P.be([100, 110, 95, 105, 98, 102, 99, 101], [98, 105, 97, 100, 100, 99, 101, 100]); ok(bq.pass && bq.lo < 1 && bq.hi > 1, 'bioequivalence 90 % CI inside 80–125 %');
{ // a pure period effect (+10 % in period 2) must cancel in the crossover analysis, but bias the paired one
  const T = [100, 90, 120, 80, 110, 95], R = [100, 90, 120, 80, 110, 95], sq = ['TR', 'TR', 'TR', 'RT', 'RT', 'RT'];
  const t2 = T.map((x, i) => sq[i] === 'RT' ? x * 1.1 * (1 + 0.02 * (i % 2)) : x * (1 + 0.02 * (i % 2))), r2 = R.map((x, i) => sq[i] === 'TR' ? x * 1.1 : x);
  const x = P.be(t2, r2, sq), p = P.be(t2, r2);
  ok(x.df === 4 && p.df === 5 && Math.abs(Math.log(x.gmr) - Math.log(1.01)) < 0.005 && x.lo < x.gmr && x.hi > x.gmr, 'bioequivalence: 2×2 crossover cancels the period effect (n − 2 df)');
  ok(p.hi - p.lo > x.hi - x.lo, 'bioequivalence: the paired analysis is widened by an ignored period effect');
}
const bf = P.be([60, 70, 65, 75, 62, 68, 71, 66], [100, 98, 102, 97, 101, 99, 100, 103]); ok(!bf.pass, 'a 33 % lower exposure fails');
near(P.t95(10), 1.812, 1e-9, 't quantile');
near(P.occupancy(1, 1), 0.5, 1e-12, 'occupancy at Kd'); near(P.hill(2, 100, 2, 3), 50, 1e-9, 'Hill at EC50'); near(P.ti(100, 10), 10, 1e-12, 'therapeutic index');

// units
near(U.toSI(300, 'osmol', 'mOsm/L'), 300, 1e-12, 'mOsm/L is the osmolarity unit'); near(U.toSI(1, 'enzymeactivity', 'U'), 1e-6 / 60, 1e-15, 'one enzyme unit');

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
