/* Tests of the biology module against textbook values.
 *   node HYPER-CORE/tools/test-bio.js
 */
'use strict';
const { loadCore } = require('./load');
const H = loadCore();
const B = H.bio, U = H.units;
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, m + ' (got ' + a + ', want ' + b + ')');

// the genetic code and sequences
ok(Object.keys(B.CODE).length === 64, '64 codons');
ok(B.CODE.ATG === 'M' && B.CODE.TGG === 'W' && B.CODE.TAA === '*' && B.CODE.TAG === '*' && B.CODE.TGA === '*', 'start, tryptophan and the three stops');
ok(Object.values(B.CODE).filter(a => a === 'L').length === 6 && Object.values(B.CODE).filter(a => a === 'R').length === 6, 'six codons each for Leu and Arg');
ok(B.translate('ATGTTTGGCTAA') === 'MFG*', 'translation'); ok(B.translate('AUGUUUGGCUAA') === 'MFG*', 'RNA translates too');
ok(B.revComp('ATGC') === 'GCAT', 'reverse complement'); ok(B.transcribe('ATGC') === 'AUGC', 'transcription (coding strand)');
near(B.gc('GGCCAT'), 2 / 3, 1e-12, 'GC content'); near(B.tm('ATGCATGC'), 24, 1e-12, 'Wallace rule'); near(B.tm('ATGCATGCATGCATGCATGC'), 51.78, 0.01, 'Tm, longer primers');
near(B.mwProtein('G'), 75.067, 0.001, 'glycine 75.07 Da'); near(B.mwProtein('GG'), 132.12, 0.01, 'diglycine');
near(B.mwDNA('ATGC'), 1173.84, 0.01, 'oligonucleotide mass');
const o = B.orfs('CCATGAAACCCGGGTTTTAACC', 3); ok(o.length === 1 && o[0].protein === 'MKPGF' && o[0].start === 3, 'open reading frame');
ok(JSON.stringify(B.sites('AAGAATTCTTGAATTC', 'EcoRI')) === '[3,11]', 'restriction sites');
ok(B.ends('EcoRI').type === '5′ overhang' && B.ends('EcoRI').overhang === 4 && B.ends('PstI').type === '3′ overhang' && B.ends('SmaI').type === 'blunt' && B.ends('NdeI').overhang === 2, 'restriction ends');
ok(Object.keys(B.ENZYMES).every(k => B.CUT[k] != null && B.ENZYMES[k] === B.revComp(B.ENZYMES[k])), 'every site is a palindrome with a cut position');

// genetics
const mono = B.punnett('Aa', 'Aa'); ok(mono.genotypes.AA === 1 && mono.genotypes.Aa === 2 && mono.genotypes.aa === 1, '1 : 2 : 1');
const di = B.punnett('AaBb', 'AaBb'); ok(di.total === 16 && di.phenotypes['A_ B_'] === 9 && di.phenotypes['aa bb'] === 1, '9 : 3 : 3 : 1');
const test = B.punnett('AaBb', 'aabb'); ok(Object.keys(test.phenotypes).length === 4 && Object.values(test.phenotypes).every(v => v === 4) && test.total === 16, 'test cross 1 : 1 : 1 : 1');
const hw = B.hardyWeinberg(0.6); near(hw.AA, 0.36, 1e-12, 'p²'); near(hw.Aa, 0.48, 1e-12, '2pq'); near(hw.aa, 0.16, 1e-12, 'q²');
const hwt = B.hwTest(360, 480, 160); near(hwt.p, 0.6, 1e-12, 'allele frequency from counts'); near(hwt.chi2, 0, 1e-9, 'no departure from equilibrium');
near(B.chiP(3.841, 1), 0.05, 1e-3, 'χ² 3.84, 1 df'); near(B.chiP(5.991, 2), 0.05, 1e-3, 'χ² 5.99, 2 df'); near(B.chiP(7.815, 3), 0.05, 1e-3, 'χ² 7.81, 3 df');
const cs = B.chiSquare([315, 108, 101, 32], [312.75, 104.25, 104.25, 34.75]); near(cs.chi2, 0.47, 0.01, "Mendel's peas fit 9:3:3:1"); ok(cs.p > 0.9, 'a good fit');
near(B.haldane(0.2), 25.54, 0.01, 'Haldane map distance'); near(B.kosambi(0.2), 21.18, 0.01, 'Kosambi map distance');

// populations
near(B.logistic(10, 0.5, 1000, 0), 10, 1e-9, 'logistic start'); ok(Math.abs(B.logistic(10, 0.5, 1000, 100) - 1000) < 1e-6, 'logistic reaches K');
near(B.exponential(100, Math.LN2, 3), 800, 1e-9, 'three doublings');
const lv = B.lotkaVolterra({ x: 10, y: 5, a: 1.1, b: 0.4, c: 0.1, d: 0.4, T: 30, dt: 0.01 });
const V = r => 0.1 * r[1] - 0.4 * Math.log(r[1]) + 0.4 * r[2] - 1.1 * Math.log(r[2]);
near(V(lv[lv.length - 1]), V(lv[0]), 1e-5, 'Lotka–Volterra conserves its invariant (RK4)');
const comp = B.competition({ x: 10, y: 10, r1: 1, r2: 1, K1: 100, K2: 100, a12: 0.5, a21: 0.5, T: 60 });
near(comp[comp.length - 1][1], 66.67, 0.1, 'competition: stable coexistence at K/(1+α)');

// enzymes
near(B.mm(2, 10, 2), 5, 1e-12, 'v = Vmax/2 at S = Km'); near(B.mm(2, 10, 2, { type: 'competitive', I: 1, Ki: 1 }), 10 / 3, 1e-12, 'competitive inhibition raises apparent Km');
near(B.mm(1e9, 10, 2, { type: 'competitive', I: 1, Ki: 1 }), 10, 1e-6, 'competitive: same Vmax at saturating S');
near(B.mm(1e9, 10, 2, { type: 'noncompetitive', I: 1, Ki: 1 }), 5, 1e-6, 'non-competitive halves Vmax at I = Ki');
near(B.hill(2, 1, 2, 4), 0.5, 1e-12, 'Hill: half at K');

// evolution
const wf = B.wrightFisher({ N: 50, p0: 0.5, gens: 100, seed: 3 }); ok(wf.length === 101 && wf.every(p => p >= 0 && p <= 1), 'Wright–Fisher trajectory');
{ const R = B.rng(7); let z = 0, big = 0; for (let i = 0; i < 20000; i++) { if (B.binomial(400, 1 / 400, R) === 0) z++; if (B.binomial(400, 399 / 400, R) === 400) big++; }
  ok(Math.abs(z / 20000 - Math.exp(-1)) < 0.015 && Math.abs(big / 20000 - Math.exp(-1)) < 0.015, 'binomial keeps the chance of losing a rare allele (e^-1 for 1 copy in 400)'); }
{ const R = B.rng(11); let s1 = 0, s2 = 0, z = 0; for (let i = 0; i < 20000; i++) { const k = B.poisson(2.5, R); s1 += k; if (!k) z++; s2 += B.poisson(80, R); }
  ok(Math.abs(s1 / 20000 - 2.5) < 0.05 && Math.abs(z / 20000 - Math.exp(-2.5)) < 0.01 && Math.abs(s2 / 20000 - 80) < 0.3, 'Poisson draws: mean λ and P(0) = e^−λ'); }
ok(B.chiSquare([20], [20]).p === 1 && B.chiP(0, 0) === 1, 'χ² with a single class has p = 1, not NaN');
let fixed = 0; for (let s = 1; s <= 200; s++) { const t = B.wrightFisher({ N: 10, p0: 0.2, gens: 400, seed: s }); if (t[t.length - 1] === 1) fixed++; }
near(fixed / 200, 0.2, 0.08, 'a neutral allele fixes with probability p0');
let sel = 0; for (let s = 1; s <= 100; s++) { const t = B.wrightFisher({ N: 500, p0: 0.1, gens: 400, s: 0.05, seed: s }); if (t[t.length - 1] > 0.99) sel++; }
ok(sel > 70, 'a strongly favoured allele usually sweeps (' + sel + '/100)');

// lab and ecology numbers
near(B.pcr(1, 30), 1073741824, 1e-3, 'PCR: 2^30'); near(B.pcr(1000, 10, 0.9), 1000 * Math.pow(1.9, 10), 1e-6, 'PCR at 90 % efficiency');
near(B.cfu(150, 1e-6, 0.1), 1.5e9, 1, 'colony-forming units');
near(B.shannon([5, 5, 5, 5]).H, Math.log(4), 1e-12, 'Shannon index of an even community'); near(B.simpson([5, 5, 5, 5]), 0.75, 1e-12, 'Gini–Simpson');
near(B.kleiber(70), 82.3, 0.3, 'Kleiber: a 70 kg mammal ≈ 82 W');
near(B.diffusionTime(1e-5, 1e-9), 0.05, 1e-12, 'diffusion across a cell');
near(B.osmoticPressure(2, 150, 310), 773300, 500, 'van \'t Hoff: 0.15 M NaCl at body temperature ≈ 7.7 bar');

// units
near(U.toSI(1, 'numberdensity', '1/mL'), 1e6, 1e-6, 'cells per millilitre');

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
