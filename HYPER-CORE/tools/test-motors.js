/* Tests of HYPER-CORE/js/motors.js (kit.motor). Run: node HYPER-CORE/tools/test-motors.js */
'use strict';
const L = require('./load.js');
const H = L.loadCore(), M = H.motor;
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) pass++; else { fail++; console.log('FAIL ' + m); } };
const near = (a, b, tol, m) => ok(Math.abs(a - b) <= tol * Math.max(1, Math.abs(b)), m + ' (got ' + a + ', want ' + b + ')');

// power and torque
near(M.torqueFromPower(7500, 1450), 49.39, 1e-3, '7.5 kW at 1450 rpm is 49.4 N·m (9549 P/n)');
near(M.power3(400, 14.5, 0.85) / 1000, 8.539, 1e-3, 'three-phase power √3 V I cos φ');
near(M.HP, 745.7, 1e-4, '1 hp = 745.7 W');

// brushed DC motor: a 24 V motor with R = 1 Ω, K = 0.05 V·s/rad, I0 = 0.2 A
{
  const m = M.dc({ V: 24, R: 1, K: 0.05, I0: 0.2 });
  near(m.stallCurrent, 24, 1e-12, 'DC: stall current V/R');
  near(m.stallTorque, 0.05 * 23.8, 1e-12, 'DC: stall torque K(Is − I0)');
  near(m.noLoadSpeed, (24 - 0.2) / 0.05, 1e-12, 'DC: no-load speed (V − R I0)/K');
  const p = m.at(m.maxPower.T); near(p.Pout, m.maxPower.P, 1e-9, 'DC: most power at half the stall torque');
  let best = 0; for (let T = 0.001; T < m.stallTorque; T += 0.0005) best = Math.max(best, m.at(T).eff);
  near(best, m.maxEff, 2e-3, 'DC: peak efficiency (1 − √(I0/Is))²');
  const sim = M.dcSim({ V: 24, R: 1, L: 1e-3, K: 0.05, J: 1e-5, b: 0, TL: 0, T: 0.2, dt: 2e-5 });
  near(sim[sim.length - 1][2], 24 / 0.05, 2e-3, 'DC transient settles at V/K with no load');
  const tau = 1e-5 * 1 / (0.05 * 0.05); let t63 = 0; for (const [t, , w] of sim) if (w >= 0.632 * 480) { t63 = t; break; }
  near(t63, tau, 0.05, 'DC transient: mechanical time constant J R / K²');
  near(M.pwmRipple({ V: 24, D: 0.5, L: 1e-3, f: 20000 }), 0.3, 1e-9, 'PWM ripple V/(4 L f) at 50 %');
}

// induction motor: a 400 V, 50 Hz, 4-pole star-connected machine (typical 7.5 kW circuit values)
{
  const im = M.induction({ V_LL: 400, f: 50, poles: 4, R1: 0.8, X1: 1.5, R2: 0.7, X2: 2.0, Xm: 60, Pfw: 150 });
  near(im.ns, 1500, 1e-12, 'synchronous speed 120 f/p');
  let tmax = 0, sAt = 0; for (let s = 0.001; s <= 1; s += 0.0005) { const T = im.at(s).T; if (T > tmax) { tmax = T; sAt = s; } }
  near(tmax, im.Tmax, 2e-3, 'breakdown torque from the Thévenin circuit');
  near(sAt, im.sMax, 0.02, 'slip at breakdown');
  const r = im.at(0.035);
  ok(r.T > 30 && r.T < 80 && r.pf > 0.7 && r.pf < 0.92 && r.eff > 0.8 && r.eff < 0.95, 'at 3.5 % slip: realistic torque, power factor and efficiency (T ' + r.T.toFixed(1) + ', pf ' + r.pf.toFixed(2) + ', η ' + r.eff.toFixed(3) + ')');
  ok(im.start.I1 > 4 * r.I1, 'starting current is several times the running current (' + (im.start.I1 / r.I1).toFixed(1) + '×)');
  near(M.slip(1450, 50, 4), 1 / 30, 1e-12, 'slip (ns − n)/ns');
  near(M.vf({ Vn: 400, fn: 50, f: 25 }), 200, 1e-12, 'V/f: half speed, half voltage');
  // a deep-bar rotor: more starting torque, same breakdown torque, breakdown slip still where the scan finds it
  const db = M.induction({ V_LL: 400, f: 50, poles: 4, R1: 0.7, X1: 1.1, R2: 0.55, X2: 1.6, Xm: 45, Pfw: 120, deepBar: 1 });
  const sc = M.induction({ V_LL: 400, f: 50, poles: 4, R1: 0.7, X1: 1.1, R2: 0.55, X2: 1.6, Xm: 45, Pfw: 120 });
  let tm2 = 0, sAt2 = 0; for (let s = 0.001; s <= 1; s += 0.0005) { const T = db.at(s).T; if (T > tm2) { tm2 = T; sAt2 = s; } }
  near(tm2, db.Tmax, 2e-3, 'deep bars: breakdown torque unchanged by a slip-dependent rotor resistance');
  near(sAt2, db.sMax, 0.02, 'deep bars: slip at breakdown');
  ok(db.start.T > 1.6 * sc.start.T && db.start.I1 < sc.start.I1, 'deep bars: more starting torque (' + (db.start.T / sc.start.T).toFixed(2) + '×) with less starting current');
}

// stepper: a 1.8° hybrid motor, 2 A, 1.2 Ω, 2.5 mH, 0.9 N·m holding, on 24 V and 48 V
{
  const s24 = M.stepper({ steps: 200, I: 2, R: 1.2, L: 2.5e-3, Vs: 24, Th: 0.9 }), s48 = M.stepper({ steps: 200, I: 2, R: 1.2, L: 2.5e-3, Vs: 48, Th: 0.9 });
  near(s24.torque(1), 0.9, 1e-6, 'stepper: holding torque at very low speed');
  ok(s24.torque(1500) < s24.torque(300) && s48.torque(1000) > s24.torque(1000), 'stepper: torque falls with speed, and a higher supply voltage keeps it up');
  ok(s48.cornerRpm > 1.8 * s24.cornerRpm, 'stepper: doubling the voltage about doubles the corner speed');
  // back-EMF per phase = Th/(√2 I)·ω reaches the 24 V supply near 720 rpm on a NEMA 23, yet an advanced load angle keeps torque beyond it
  const n23 = M.stepper({ steps: 200, I: 2.8, R: 0.9, L: 2.5e-3, Vs: 24, Th: 1.26 });
  ok(n23.torque(1000) > 0.35 && n23.torque(1000) < 0.8 && n23.torque(200) > 1.25, 'stepper: NEMA 23 on 24 V keeps about 0.5 N·m at 1000 rpm, full torque at low speed (' + n23.torque(1000).toFixed(2) + ' N·m)');
  near(s24.stepRate(600, 16), 32000, 1e-12, 'step rate at 600 rpm with 1/16 microstepping');
}

// move profiles and sizing
{
  const m = M.move({ dist: 1, vmax: 0.5, acc: 2 });
  near(m.tTotal, 2.25, 1e-12, 'trapezoid: 1 m at 0.5 m/s with 2 m/s² takes 2.25 s');
  near(m.at(m.tTotal).x, 1, 1e-12, 'trapezoid ends at the distance');
  const t = M.move({ dist: 0.05, vmax: 0.5, acc: 2 }); ok(t.triangle && Math.abs(t.vPeak - Math.sqrt(0.05 * 2)) < 1e-12, 'short move: a triangle profile');
  near(M.reflected(0.1, 10, 1), 0.001, 1e-12, 'reflected inertia J/i²');
  const q = M.moveTorque({ Jm: 1e-4, Jload: 0.01, ratio: 10, eff: 1, acc: 50, Tload: 2 });
  near(q.Tpeak, (1e-4 + 1e-4) * 500 + 0.2, 1e-12, 'torque to accelerate motor + reflected load, plus load torque');
  near(M.rmsTorque([[2, 1], [0.5, 2], [-1.5, 1]]), Math.sqrt((4 + 0.5 + 2.25) / 4), 1e-12, 'RMS torque over a cycle');
  near(M.screwTorque({ F: 1000, lead: 0.005, eff: 0.9 }), 0.8842, 1e-3, 'ball screw torque F·lead/(2π η)');
  const e = M.encoder({ ppr: 1000, rpm: 3000 }); ok(e.counts === 4000 && Math.abs(e.countFreq - 200000) < 1e-9, 'encoder: ×4 quadrature counts and count rate');
}

// heat, efficiency classes, hydraulics, air, cables, braking
{
  near(M.copperR(1, 120), 1.393, 1e-9, 'copper resistance at 120 °C');
  near(M.windingTemp({ Ploss: 100, Rth: 0.5, tau: 1200, t: 1e9, Tamb: 40 }), 90, 1e-9, 'steady winding temperature Tamb + P·Rth');
  ok(M.INSULATION.F === 155 && M.INSULATION.B === 130, 'insulation classes');
  near(M.ieAt('IE3', 7.5), 90.4, 1e-9, 'IE3 7.5 kW 4-pole');
  ok(M.ieClass(7.5, 91) === 'IE3' && M.ieClass(7.5, 93) === 'IE4' && M.ieClass(7.5, 86) === 'below IE2', 'efficiency class lookup');
  const hm = M.hydMotor({ Vg: 100, dp: 200, Q: 60, etaV: 1, etaHM: 1 });
  near(hm.T, 318.3, 1e-3, 'hydraulic motor torque Vg·Δp/2π'); near(hm.n, 600, 1e-12, 'hydraulic motor speed Q/Vg');
  near(hm.Pout, hm.Pin, 1e-9, 'an ideal hydraulic motor: power in = power out');
  const hp = M.hydPump({ Vg: 28, n: 1450, dp: 150, etaV: 0.95, etaHM: 0.9 }); near(hp.Q, 38.57, 1e-3, 'pump flow Vg·n·ηv');
  const am = M.airMotor({ Pmax: 500, n0: 10000, n: 5000 }); near(am.P, 500, 1e-12, 'air motor: most power at half the free speed');
  near(M.cableDrop({ I: 20, L: 50, A: 4, pf: 1, x: 0, phases: 3 }), Math.sqrt(3) * 20 * 50 * 0.0175 / 4, 1e-12, 'three-phase cable drop');
  near(M.brakeEnergy({ J: 0.5, n1: 1500 }), 0.5 * 0.5 * Math.pow(1500 * 2 * Math.PI / 60, 2), 1e-12, 'kinetic energy to brake ½Jω²');
}

console.log(pass + ' passed, ' + fail + ' failed');
process.exit(fail ? 1 : 0);
