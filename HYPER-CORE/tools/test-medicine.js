/* Tests of the medicine module: clinical formulas against published values, the physiology
 * models against their known behaviour, and the medical units.
 *   node HYPER-CORE/tools/test-medicine.js
 */
'use strict';
const { loadCore } = require('./load');
const H = loadCore();
const M = H.med;
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL', m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol, m + ' (got ' + a + ', want ' + b + ')');

// clinical formulas
near(M.bmi(70, 1.75), 22.857, 0.001, 'BMI');
near(M.bsa(70, 175), 1.8447, 0.0001, 'BSA, Mosteller');
near(M.bsa(70, 175, 'dubois'), 1.8481, 0.001, 'BSA, DuBois');
near(M.egfr(0.8, 50, true), 89.6, 0.5, 'eGFR CKD-EPI 2021, woman of 50, creatinine 0.8');
near(M.egfr(1.0, 60, false), 86.2, 0.1, 'eGFR CKD-EPI 2021, man of 60, creatinine 1.0');
near(M.cockcroftGault(60, 72, 1.0, false), 80, 1e-9, 'Cockcroft–Gault');
near(M.map(120, 80), 93.33, 0.01, 'mean arterial pressure');
near(M.qtc(400, 60), 400, 1e-9, 'QTc at 60/min'); near(M.qtc(400, 100), 516.4, 0.1, 'QTc Bazett at 100/min'); near(M.qtc(400, 100, 'fridericia'), 474.25, 0.05, 'QTc Fridericia');
near(M.anionGap(140, 104, 24), 12, 1e-9, 'anion gap');
near(M.correctedCalcium(8.0, 2.0), 9.6, 1e-9, 'corrected calcium');
near(M.ibw(175, false), 70.46, 0.01, 'ideal body weight');
near(M.bmr(70, 175, 30, false), 1648.75, 1e-9, 'Mifflin–St Jeor');
near(M.maxHR(40), 180, 1e-9, 'maximum heart rate (Tanaka)');
near(M.parkland(70, 30), 8400, 1e-9, 'Parkland');
near(M.maintenanceFluids(25), 65, 1e-9, 'maintenance fluids 4-2-1'); near(M.maintenanceFluids(8), 32, 1e-9, 'maintenance fluids for a baby');
near(M.dripRate(1000, 480, 20), 41.67, 0.01, 'drip rate');

// oxygen
near(M.sat(26.8), 0.5, 0.002, 'half saturated at P50');
near(M.sat(100), 0.977, 0.002, 'arterial saturation at 100 mmHg');
near(M.sat(40), 0.75, 0.002, 'venous saturation at 40 mmHg');
ok(M.sat(40, { pH: 7.2 }) < M.sat(40) && M.sat(40, { T: 35 }) > M.sat(40), 'Bohr and temperature shifts');
near(M.o2content(15, 0.98, 100), 19.99, 0.01, 'oxygen content');
near(M.alveolarO2({ fio2: 0.21, paco2: 40 }), 99.7, 0.1, 'alveolar gas equation');

// neurons
const rest = M.hh({ I: 0, tEnd: 50 });
ok(rest.spikes.length === 0 && Math.abs(rest.V[rest.V.length - 1] + 65) < 1, 'Hodgkin–Huxley rests at −65 mV');
const fire = M.hh({ I: 10, tEnd: 100 });
ok(fire.spikes.length >= 5 && Math.max(...fire.V) > 30, 'a steady current makes it fire repetitively (' + fire.spikes.length + ' spikes)');
const blocked = M.hh({ I: 200, tEnd: 30, gNa: 0 });
ok(blocked.spikes.length === 0 && Math.max(...blocked.V) > 0, 'with sodium channels blocked, a strong current depolarises but makes no spikes');
near(M.nernst(1, 5, 140), -89.0, 0.5, 'Nernst potential of potassium');
near(M.nernst(1, 145, 12), 66.6, 0.5, 'Nernst potential of sodium');
near(M.goldman({ pK: 1, pNa: 0.04, pCl: 0.45, Ko: 5, Ki: 140, Nao: 145, Nai: 12, Clo: 110, Cli: 10 }), -67.3, 0.1, 'Goldman resting potential');

// ECG
const s = M.ecg({ rhythm: 'sinus', hr: 60, seconds: 20, seed: 2 });
near(s.hr, 60, 2, 'sinus rhythm at the set rate');
const peak = Math.max(...Array.from({ length: 1000 }, (_, k) => s.at(s.beats[3].t - 0.05 + k * 0.0001)));
near(peak, 1.2, 0.1, 'an R wave of about 1.2 mV');
const af = M.ecg({ rhythm: 'afib', hr: 100, seconds: 30, seed: 3 });
const rr = af.beats.slice(1).map((b, k) => b.t - af.beats[k].t), mean = rr.reduce((a, b) => a + b, 0) / rr.length;
ok(Math.sqrt(rr.reduce((a, b) => a + (b - mean) * (b - mean), 0) / rr.length) / mean > 0.15 && af.beats.every(b => b.p === false), 'atrial fibrillation: irregular, no P waves');
ok(M.ecg({ rhythm: 'vf', seconds: 5 }).beats.length === 0, 'ventricular fibrillation has no beats');
const b3 = M.ecg({ rhythm: 'block3', seconds: 20 });
near(b3.hr, 38, 3, 'complete heart block: a slow escape rhythm');
ok(['sinus', 'brady', 'tachy', 'afib', 'aflutter', 'pvc', 'vt', 'vf', 'asystole', 'block1', 'block3'].every(r => { const e = M.ecg({ rhythm: r, seconds: 6 }); for (let t = 0; t < 6; t += 0.01) if (!Number.isFinite(e.at(t))) return false; return true; }), 'every rhythm gives finite voltages');

// drugs
const iv = M.pk({ halfLife: 6, Vd: 50, doses: [{ t: 0, amount: 500 }] });
near(iv.at(0), 10, 1e-9, 'IV bolus: dose / Vd'); near(iv.at(6), 5, 1e-9, 'half gone after one half-life');
const ss = M.steadyState({ dose: 500, tau: 6, halfLife: 6, Vd: 50 });
near(ss.accumulation, 2, 1e-9, 'accumulation when dosing every half-life'); near(ss.peak, 20, 1e-9, 'steady-state peak'); near(ss.trough, 10, 1e-9, 'steady-state trough');
const many = M.pk({ halfLife: 6, Vd: 50, doses: Array.from({ length: 30 }, (_, k) => ({ t: 6 * k, amount: 500 })) });
near(many.at(174), 20, 0.01, 'repeated doses approach the steady-state peak');
const oral = M.pk({ halfLife: 6, Vd: 50, doses: [{ t: 0, amount: 500, route: 'oral', F: 0.8, ka: 1.5 }] });
ok(oral.at(0) === 0 && oral.at(2) > oral.at(0.25) && oral.at(24) < oral.at(2), 'oral dose: rises, peaks, falls');
const inf = M.pk({ halfLife: 2, Vd: 20, doses: [{ t: 0, amount: 1000, route: 'infusion', duration: 100 }] });
near(inf.at(40), 10 / (Math.LN2 / 2 * 20), 1e-5, 'an infusion reaches rate / (k·Vd)');
near(M.loadingDose(10, 50), 500, 1e-9, 'loading dose'); near(M.emax(10, 100, 10), 50, 1e-9, 'half effect at EC50');

// tests and risks
const b = M.bayes({ prevalence: 0.01, sensitivity: 0.9, specificity: 0.91 });
near(b.ppv, 0.0917, 0.0005, 'a positive screen when the disease is rare'); near(b.npv, 0.9989, 0.0001, 'negative predictive value');
near(b.lrPos, 10, 1e-9, 'likelihood ratio'); near(M.postTest(0.2, 10), 0.714, 0.001, 'post-test probability');
const r = M.risk({ cer: 0.1, eer: 0.075 });
near(r.arr, 0.025, 1e-12, 'absolute risk reduction'); near(r.rrr, 0.25, 1e-12, 'relative risk reduction'); near(r.nnt, 40, 1e-9, 'number needed to treat');
const w = M.wilson(40, 100); ok(w[0] > 0.30 && w[0] < 0.31 && w[1] > 0.49 && w[1] < 0.50, 'Wilson interval');

// epidemics
const ep = M.sir({ R0: 3, N: 1e6, I0: 10, days: 300 });
near(ep.infected, 0.9405, 0.005, 'final size of an epidemic with R0 = 3');
near(ep.herd, 2 / 3, 1e-12, 'herd-immunity threshold');
ok(M.sir({ R0: 3, N: 1e6, I0: 10, days: 300, vaccinated: 0.7 }).infected < 0.01, 'above the threshold the outbreak fizzles');
ok(M.sir({ R0: 0, N: 1e6, I0: 10, days: 60 }).infected < 1e-4 && M.sir({ R0: 0.5 }).herd === 0, 'R0 of zero or below one: no epidemic and no herd threshold');

// units
const U = H.units;
near(U.convert(100, 'glucose', 'mg/dL', 'mmol/L'), 5.55, 0.01, 'glucose units');
near(U.convert(1, 'creatinine', 'mg/dL', 'µmol/L'), 88.42, 0.01, 'creatinine units');
near(U.convert(200, 'cholesterol', 'mg/dL', 'mmol/L'), 5.17, 0.01, 'cholesterol units');
near(U.convert(10, 'calcium', 'mg/dL', 'mmol/L'), 2.495, 0.001, 'calcium units');
near(U.convert(1, 'bilirubin', 'mg/dL', 'µmol/L'), 17.1, 1e-9, 'bilirubin units');
near(U.convert(14, 'hemoglobin', 'g/dL', 'g/L'), 140, 1e-9, 'haemoglobin units');
near(U.convert(60, 'frequency', 'bpm', 'Hz'), 1, 1e-12, 'beats per minute');
near(U.convert(10, 'pressure', 'cmH₂O', 'mmHg'), 7.356, 0.001, 'cm of water');
near(U.convert(125, 'flowrate', 'mL/h', 'mL/min'), 2.0833, 0.0001, 'infusion rates');

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
