/* Tests of the chemistry module (elements, formulas, balancing, VSEPR) and of \ce notation.
 *   node HYPER-CORE/tools/test-chem.js
 */
'use strict';
const path = require('path');
const { makeContext, loadCore, run } = require('./load');
const ctx = makeContext();
const H = loadCore(ctx);
run(ctx, path.join(__dirname, '..', 'js', 'chem.js'));
const C = H.chem;
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, m + ' (got ' + a + ', want ' + b + ')');

// elements
ok(C.elements.length === 118, '118 elements');
ok(C.elements.every((e, i) => e.z === i + 1), 'atomic numbers in order');
ok(new Set(C.elements.map(e => e.sym)).size === 118, 'symbols unique');
near(C.el('C').mass, 12.011, 1e-9, 'carbon mass');
ok(C.el('Fe').config === '[Ar] 3d6 4s2', 'Fe configuration');
ok(C.el('Cu').config === '[Ar] 3d10 4s1', 'Cu exception');
ok(C.el('Br').config === '[Ar] 3d10 4s2 4p5', 'Br configuration');
ok(C.el('Og').config === '[Rn] 5f14 6d10 7s2 7p6', 'Og configuration (' + C.el('Og').config + ')');
ok(C.fullConfig(11) === '1s2 2s2 2p6 3s1', 'Na full configuration');
// every configuration holds the right number of electrons
for (const e of C.elements) {
  const n = C.fullConfig(e.z).split(' ').reduce((a, s) => a + +s.slice(2), 0);
  if (n !== e.z) { ok(false, e.sym + ' configuration has ' + n + ' electrons'); }
}
pass++;
ok(C.el('Na').block === 's' && C.el('Fe').block === 'd' && C.el('Cl').block === 'p' && C.el('Nd').block === 'f', 'blocks');
ok(C.el('F').en === 3.98 && C.el('He').en === null, 'electronegativity');
// trends the data must show
ok(C.el('Li').ie < C.el('Be').ie && C.el('Na').ie < C.el('Li').ie && C.el('Ne').ie > C.el('F').ie, 'ionisation energy trends');
ok(C.el('Cs').r > C.el('Na').r && C.el('F').r < C.el('Li').r, 'radius trends');

// formulas and molar masses
near(C.molarMass('H2O'), 18.015, 0.001, 'water');
near(C.molarMass('H2SO4'), 98.07, 0.01, 'sulfuric acid');
near(C.molarMass('CuSO4·5H2O'), 249.68, 0.01, 'copper sulfate pentahydrate');
near(C.molarMass('Ca(OH)2'), 74.09, 0.01, 'calcium hydroxide');
near(C.molarMass('K4[Fe(CN)6]'), 368.35, 0.01, 'potassium ferrocyanide');
near(C.molarMass('C6H12O6'), 180.16, 0.01, 'glucose');
near(C.molarMass('CsCl'), 168.36, 0.01, 'caesium chloride');
ok(C.parse('SO4^2-').charge === -2 && C.parse('Fe3+').charge === 3 && C.parse('NH4+').charge === 1 && C.parse('NH4+').atoms.H === 4, 'charges');
ok(C.parse('[Cu(NH3)4]^2+').atoms.N === 4 && C.parse('[Cu(NH3)4]^2+').charge === 2, 'complex ion');
let threw = false; try { C.parse('Xx2'); } catch (e) { threw = true; } ok(threw, 'unknown element rejected');
const comp = C.composition('H2O');
near(comp.find(c => c.sym === 'O').fraction, 0.888, 0.001, 'mass fraction of O in water');

// balancing
const bal = (eq, want) => { const b = C.balance(eq); ok(b.ok && b.coefficients.join(',') === want, eq + ' -> ' + (b.ok ? b.coefficients.join(',') : b.error)); };
bal('H2 + O2 -> H2O', '2,1,2');
bal('Fe + O2 -> Fe2O3', '4,3,2');
bal('C3H8 + O2 -> CO2 + H2O', '1,5,3,4');
bal('KMnO4 + HCl -> KCl + MnCl2 + H2O + Cl2', '2,16,2,2,8,5');
bal('Cu + HNO3 -> Cu(NO3)2 + NO + H2O', '3,8,3,2,4');
bal('MnO4- + Fe^2+ + H+ -> Mn^2+ + Fe^3+ + H2O', '1,5,8,1,5,4');
bal('Cr2O7^2- + H+ + e- -> Cr^3+ + H2O', '1,14,6,2,7');
bal('2 H2O(l) -> 2 H2(g) + O2(g)', '2,2,1');
ok(!C.balance('H2 -> O2').ok, 'impossible equation reported');

// VSEPR
ok(C.vsepr(2, 2).name === 'bent' && C.vsepr(3, 1).name === 'trigonal pyramidal' && C.vsepr(4, 2).name === 'square planar' && C.vsepr(5, 0).name === 'trigonal bipyramidal', 'VSEPR shapes');
const w = C.molecule('H2O');
const a = w.atoms, v1 = [a[1].x, a[1].y, a[1].z], v2 = [a[2].x, a[2].y, a[2].z];
const ang = Math.acos((v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]) / (Math.hypot(...v1) * Math.hypot(...v2))) * 180 / Math.PI;
near(ang, 104.5, 0.01, 'water bond angle');
const m = C.molecule('CH4');
const d = (i, j) => Math.acos((m.atoms[i].x * m.atoms[j].x + m.atoms[i].y * m.atoms[j].y + m.atoms[i].z * m.atoms[j].z) / (Math.hypot(m.atoms[i].x, m.atoms[i].y, m.atoms[i].z) * Math.hypot(m.atoms[j].x, m.atoms[j].y, m.atoms[j].z))) * 180 / Math.PI;
near(d(1, 2), 109.47, 0.05, 'tetrahedral angle'); near(d(2, 4), 109.47, 0.05, 'tetrahedral angle 2');
const nh3 = C.molecule('NH3'), ang3 = (i, j) => { const p = nh3.atoms[i], q = nh3.atoms[j]; return Math.acos((p.x * q.x + p.y * q.y + p.z * q.z) / (Math.hypot(p.x, p.y, p.z) * Math.hypot(q.x, q.y, q.z))) * 180 / Math.PI; };
near(ang3(1, 2), 107, 0.01, 'ammonia H–N–H'); near(ang3(2, 3), 107, 0.01, 'ammonia H–N–H 2'); near(ang3(1, 3), 107, 0.01, 'ammonia H–N–H 3');

// \ce notation renders
for (const s of ['2H2 + O2 -> 2H2O', 'SO4^2-', 'Fe^{3+}', 'NH4+', 'CuSO4.5H2O', 'NaCl(aq)', 'N2 + 3H2 <=> 2NH3', '^{235}_{92}U', 'Cu^2+ + 2e- -> Cu', 'CaCO3 ->[\\Delta] CaO + CO2', '[Cu(NH3)4]^2+', 'H3O+ + OH- -> 2H2O']) {
  try { const mm = H.tex('\\ce{' + s + '}', false); ok(mm.startsWith('<math'), '\\ce ' + s); } catch (e) { fail++; console.log('FAIL \\ce', s, e.message); }
}
ok(/msubsup/.test(H.tex('\\ce{SO4^2-}', false)), '\\ce charge and subscript on the same atom');
ok(/<msup><mi mathvariant="normal">Fe<\/mi><mrow><mn>3\+<\/mn>/.test(H.tex('\\ce{Fe3+}', false)), '\\ce Fe3+ is iron with charge 3+');
ok(/<msubsup><mi mathvariant="normal">H<\/mi><mn>4<\/mn><mrow><mn>\+<\/mn>/.test(H.tex('\\ce{NH4+}', false)), '\\ce NH4+ keeps the subscript 4 under the charge');
ok(/<mn>2<\/mn><mspace/.test(H.tex('\\ce{2H2O}', false)), '\\ce coefficient');
ok(/\(aq\)/.test(H.tex('\\ce{NaCl(aq)}', false)), '\\ce state');
ok(/mmultiscripts/.test(H.tex('\\ce{^{235}_{92}U}', false)), '\\ce isotope');
ok(/⇌/.test(H.tex('\\ce{A <=> B}', false)), '\\ce equilibrium arrow');
ok(/<mn>4<\/mn><\/msub><mo[^>]*>·<\/mo><mn>5<\/mn>/.test(H.tex('\\ce{CuSO4.5H2O}', false)), '\\ce hydrate written with a full stop');
ok(/mmultiscripts><mi mathvariant="normal">e<\/mi><mprescripts><\/mprescripts><mn>−1<\/mn><mn>0<\/mn>/.test(H.tex('\\ce{^{0}_{-1}e}', false)), '\\ce beta particle');
near(C.molarMass('CuSO4.5H2O'), 249.68, 0.01, 'hydrate with a full stop');
ok(/<msub><mi mathvariant="normal">C<\/mi><mi>x<\/mi><\/msub><msub><mi mathvariant="normal">H<\/mi><mi>y<\/mi><\/msub>/.test(H.tex('\\ce{C_xH_yO_z}', false)), '\\ce letter counts');
ok(/<msub><mo stretchy="false">\)<\/mo><mi>n<\/mi><\/msub>/.test(H.tex('\\ce{(CH2)_n}', false)), '\\ce a letter count after a bracket');
ok(/<mmultiscripts><mi mathvariant="normal">X<\/mi><mprescripts><\/mprescripts><mi>Z<\/mi><mi>A<\/mi>/.test(H.tex('\\ce{^{A}_{Z}X}', false)), '\\ce isotope notation with letters');
ok(/≡/.test(H.tex('\\ce{HC#CH}', false)) && /<mo[^>]*>=<\/mo>/.test(H.tex('\\ce{CH2=CH2}', false)) && /<mo[^>]*>−<\/mo>/.test(H.tex('\\ce{CH3-CH3}', false)), '\\ce bonds');
ok(/<msup><mi mathvariant="normal">O<\/mi><mn>−<\/mn><\/msup>|O<\/mi><mrow><mn>−/.test(H.tex('\\ce{CH3COO-}', false)), '\\ce a trailing minus is still a charge');
ok(C.vsepr(1, 0).dirs.length === 1 && C.vsepr(3, 3).dirs.length === 3 && C.vsepr(2, 3).dirs.length === 2, 'VSEPR bond counts at the edges');

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
