/* HYPER-CORE · motors.js
 *
 * Electric, hydraulic and air motors for simulations (kit.motor), the tools and tests: torque and power,
 * brushed DC motors (steady state and transients, PWM ripple), induction motors (the per-phase equivalent
 * circuit, the torque–slip curve, starting, V/f), steppers (torque against speed), servo sizing (move profiles,
 * reflected inertia, RMS torque), mechanics (screws, belts), encoders, heating and duty, efficiency classes,
 * hydraulic and air motors, cables and braking. SI units unless a name says otherwise (rpm, kW, bar, cm³,
 * L/min, mm²). Nothing here uses the DOM.
 *
 *   M.rpm(ω) M.rad(n)  M.torqueFromPower(P, rpm)  M.powerFromTorque(T, rpm)  M.HP M.PS
 *   M.power3(V_LL, I, pf)  M.current3(Pout, V_LL, eff, pf)
 *   M.dc({ V, R, K, I0 }) -> { stallCurrent, stallTorque, noLoadSpeed, noLoadRpm, at(T) -> { I, w, n, Pout, Pin, eff }, maxPower: { T, P }, maxEff, effPeakCurrent }
 *   M.dcSim({ V, R, L, K, J, b, TL, T, dt }) -> [[t, i, ω], …]   (V and TL numbers or functions of t)
 *   M.pwmRipple({ V, D, L, f }) peak-to-peak current ripple of a PWM-driven winding
 *   M.induction({ V_LL, f, poles, R1, X1, R2, X2, Xm, Rc, Pfw, delta, deepBar }) -> { ns, ws, at(s) -> { T, I1, pf, Pin, Pmech, eff, n }, sMax, Tmax, start }
 *   M.vf({ Vn, fn, f, boost })   M.starDelta() -> 1/3   M.syncRpm(f, poles)   M.slip(n, f, poles)
 *   M.stepper({ steps, I, R, L, Vs, Th, teeth }) -> { torque(rpm), cornerRpm, stepRate(rpm, micro) }
 *   M.move({ dist, vmax, acc, dec }) -> { tAcc, tConst, tDec, tTotal, vPeak, at(t) -> { x, v, a } }   (trapezoid or triangle)
 *   M.reflected(Jload, ratio, eff)  M.moveTorque({ Jm, Jload, ratio, eff, acc, Tload })  M.rmsTorque([[T, t], …])
 *   M.screwTorque({ F, lead, eff })  M.screwRpm(v, lead)  M.beltSpeed(rpm, d)
 *   M.encoder({ ppr, rpm }) -> { counts, resolutionDeg, lineFreq, countFreq }
 *   M.copperR(R20, T)  M.windingTemp({ Ploss, Rth, tau, t, Tamb })  M.INSULATION  M.dutyOverload(D)
 *   M.IE (IE2/IE3/IE4, 4-pole 50 Hz, approximate)  M.ieClass(kW, eff)  M.IEC_FRAMES
 *   M.hydMotor({ Vg, dp, Q, etaV, etaHM }) -> { T, n, Pout, Pin, eta }   M.hydPump({ Vg, n, dp, etaV, etaHM })
 *   M.airMotor({ Pmax, n0, n }) -> { P, T, Tstall }
 *   M.cableDrop({ I, L, A, pf, rho, x, phases })   M.brakeEnergy({ J, n1, n2 })   M.steinmetzC({ P, V, f })
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const TAU = 2 * Math.PI, SQ3 = Math.sqrt(3);
  const rpm = w => w * 60 / TAU, rad = n => n * TAU / 60;
  const HP = 745.69987158227, PS = 735.49875;

  /* ---------------------------------------------------------------- power and torque */
  const torqueFromPower = (P, n) => P / rad(n);
  const powerFromTorque = (T, n) => T * rad(n);
  const power3 = (V, I, pf) => SQ3 * V * I * pf;
  const current3 = (P, V, eff, pf) => P / (SQ3 * V * eff * pf);

  /* ---------------------------------------------------------------- brushed DC */
  // V = R i + K ω in the steady state, T = K (i − I0): the no-load current I0 stands for friction and core loss
  function dc(o) {
    const V = o.V, R = o.R, K = o.K, I0 = o.I0 || 0, Is = V / R;
    const at = T => {
      const I = T / K + I0, w = (V - R * I) / K, Pout = T * w, Pin = V * I;
      return { T, I, w, n: rpm(w), Pout, Pin, eff: Pin > 0 && w > 0 ? Pout / Pin : 0 };
    };
    const Ts = K * (Is - I0), w0 = (V - R * I0) / K;
    return { stallCurrent: Is, stallTorque: Ts, noLoadSpeed: w0, noLoadRpm: rpm(w0), at,
      maxPower: { T: Ts / 2, P: Ts / 2 * w0 / 2 }, maxEff: Math.pow(1 - Math.sqrt(I0 / Is), 2), effPeakCurrent: Math.sqrt(I0 * Is) };
  }
  // the electrical and mechanical equations together: L di/dt = V − R i − K ω, J dω/dt = K i − b ω − T_L (RK4)
  function dcSim(o) {
    const Vf = typeof o.V === 'function' ? o.V : () => o.V, TLf = typeof o.TL === 'function' ? o.TL : () => (o.TL || 0);
    const dt = o.dt || 1e-4, out = [[0, 0, 0]], b = o.b || 0;
    let i = o.i0 || 0, w = o.w0 || 0;
    const f = (t, i, w) => [(Vf(t) - o.R * i - o.K * w) / o.L, (o.K * i - b * w - TLf(t, w)) / o.J];
    for (let t = 0; t < o.T - 1e-12; t += dt) {
      const k1 = f(t, i, w), k2 = f(t + dt / 2, i + dt / 2 * k1[0], w + dt / 2 * k1[1]), k3 = f(t + dt / 2, i + dt / 2 * k2[0], w + dt / 2 * k2[1]), k4 = f(t + dt, i + dt * k3[0], w + dt * k3[1]);
      i += dt / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); w += dt / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      out.push([t + dt, i, w]);
    }
    return out;
  }
  // a winding with back-EMF about D·V switched at f: ΔI = V D (1 − D)/(L f), largest at D = ½
  const pwmRipple = o => o.V * o.D * (1 - o.D) / (o.L * o.f);

  /* ---------------------------------------------------------------- induction motors */
  const C = (re, im) => ({ re, im: im || 0 });
  const cadd = (a, b) => C(a.re + b.re, a.im + b.im), cmul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re);
  const cdiv = (a, b) => { const d = b.re * b.re + b.im * b.im; return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
  const cabs = a => Math.hypot(a.re, a.im), par = (a, b) => cdiv(cmul(a, b), cadd(a, b));
  const syncRpm = (f, poles) => 120 * f / poles;
  const slip = (n, f, poles) => 1 - n / syncRpm(f, poles);
  // per-phase equivalent circuit (IEEE form): stator R1 + jX1, magnetising branch Rc ∥ jXm, rotor R2/s + jX2 (referred)
  function induction(o) {
    const Vph = o.V_LL / (o.delta ? 1 : SQ3), ws = TAU * o.f / (o.poles / 2), Z1 = C(o.R1, o.X1);
    const Zm = o.Rc ? par(C(o.Rc, 0), C(0, o.Xm)) : C(0, o.Xm), Pfw = o.Pfw || 0;
    // deep bars (or a double cage): the rotor current crowds to the top of the bars at high rotor frequency,
    // so the rotor resistance rises with the rotor frequency s·f: R2 (1 + k s f / 50 Hz) — more starting torque on
    // the mains, less starting current; on a VFD at low frequency the effect fades
    const kdb = (o.deepBar || 0) * o.f / 50, R2at = s => o.R2 * (1 + kdb * s);
    const at = s => {
      s = Math.max(s, 1e-6);
      const Z2 = C(R2at(s) / s, o.X2), Z = cadd(Z1, par(Zm, Z2)), I1 = cdiv(C(Vph, 0), Z), E = cadd(C(Vph, 0), C(-cmul(I1, Z1).re, -cmul(I1, Z1).im)), I2 = cdiv(E, Z2);
      const Pag = 3 * Math.pow(cabs(I2), 2) * R2at(s) / s, T = Pag / ws, Pin = 3 * Vph * I1.re, Pmech = (1 - s) * Pag - Pfw;
      return { s, T, Tshaft: Pmech / Math.max(1e-9, (1 - s) * ws), I1: cabs(I1), I2: cabs(I2), pf: Math.cos(Math.atan2(Z.im, Z.re)), Pin, Pag, Pmech, eff: Pin > 0 ? Pmech / Pin : 0, n: (1 - s) * syncRpm(o.f, o.poles) };
    };
    // Thévenin equivalent of the stator and magnetising branch gives the breakdown point
    const Vth = cabs(cdiv(cmul(C(Vph, 0), Zm), cadd(Z1, Zm))), Zth = par(Z1, Zm), den = Math.hypot(Zth.re, Zth.im + o.X2);
    const sMax = Math.min(1, o.R2 / Math.max(1e-9, den - o.R2 * kdb)), Tmax = 3 * Vth * Vth / (2 * ws * (Zth.re + den));
    return { ns: syncRpm(o.f, o.poles), ws, Vph, at, sMax, Tmax, start: at(1) };
  }
  // V/f: keep the flux constant below the base frequency, with a boost at low speed for the stator resistance
  const vf = o => Math.min(o.Vn, (o.boost || 0) + (o.Vn - (o.boost || 0)) * o.f / o.fn);
  const starDelta = () => 1 / 3;

  /* ---------------------------------------------------------------- steppers */
  // hybrid stepper: the current the driver can push falls as the winding's inductance and back-EMF grow with speed;
  // torque ≈ holding torque × (available current / rated current). An upper bound: real pull-out curves sit below it.
  function stepper(o) {
    // Each phase is a sinusoidal PM machine: back-EMF amplitude E = k ω with the per-phase constant k = Th / (√2 I)
    // (the holding torque is rated with both phases at I), reactance X = teeth·ω·L. The driver can apply at most Vs
    // (amplitude) and the rated current amplitude √2 I. Torque ∝ the current in phase with E (Iq); a current leading it
    // (Id) lets the reactance cancel part of E, which is how the torque survives past the speed where E reaches Vs.
    const steps = o.steps || 200, teeth = o.teeth || steps / 4, Imax = Math.SQRT2 * o.I, k = o.Th / Imax;
    const iq = n => {
      const w = rad(Math.max(0, n)), E = k * w, X = teeth * w * o.L, R = o.R, a = R * R + X * X, b = 2 * R * E;
      let best = 0;
      for (let j = 0; j <= 120; j++) {
        const Id = Imax * j / 120, c = (E - X * Id) * (E - X * Id) + R * R * Id * Id - o.Vs * o.Vs, disc = b * b - 4 * a * c;
        if (disc < 0) continue;
        const q = Math.min(Math.sqrt(Math.max(0, Imax * Imax - Id * Id)), (-b + Math.sqrt(disc)) / (2 * a || 1e-12));
        if (q > best) best = q;
      }
      return best;
    };
    const avail = n => iq(n) / Math.SQRT2;             // as an equivalent rated (per-phase DC) current
    const torque = n => k * iq(n);
    let lo = 0, hi = 1e5; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (avail(m) >= o.I * 0.999) lo = m; else hi = m; }
    return { torque, avail, cornerRpm: lo, stepRate: (n, micro) => n / 60 * steps * (micro || 1), stepAngle: 360 / steps };
  }

  /* ---------------------------------------------------------------- move profiles and sizing */
  // a point-to-point move: accelerate, cruise, decelerate (a triangle if the distance is too short to reach vmax)
  function move(o) {
    const a = o.acc, d = o.dec || o.acc;
    let vp = o.vmax, tA = vp / a, tD = vp / d, xA = vp * vp / (2 * a), xD = vp * vp / (2 * d);
    if (xA + xD > o.dist) { vp = Math.sqrt(2 * o.dist * a * d / (a + d)); tA = vp / a; tD = vp / d; xA = vp * vp / (2 * a); xD = vp * vp / (2 * d); }
    const tC = (o.dist - xA - xD) / vp, tT = tA + tC + tD;
    const at = t => {
      if (t <= 0) return { x: 0, v: 0, a: 0 };
      if (t < tA) return { x: a * t * t / 2, v: a * t, a };
      if (t < tA + tC) return { x: xA + vp * (t - tA), v: vp, a: 0 };
      if (t < tT) { const u = t - tA - tC; return { x: xA + vp * tC + vp * u - d * u * u / 2, v: vp - d * u, a: -d }; }
      return { x: o.dist, v: 0, a: 0 };
    };
    return { tAcc: tA, tConst: tC, tDec: tD, tTotal: tT, vPeak: vp, triangle: vp < o.vmax, at };
  }
  const reflected = (J, ratio, eff) => J / (ratio * ratio * (eff || 1));
  // torque at the motor to accelerate motor + load: (Jm + Jload/(i² η)) α_m + T_load/(i η), with α_m = i × the load's α
  function moveTorque(o) {
    const i = o.ratio || 1, eff = o.eff || 1, am = (o.acc || 0) * i;
    const Jr = reflected(o.Jload || 0, i, eff), Tl = (o.Tload || 0) / (i * eff);
    return { Jreflected: Jr, inertiaRatio: Jr / o.Jm, Tacc: (o.Jm + Jr) * am, Tload: Tl, Tpeak: (o.Jm + Jr) * am + Tl };
  }
  const rmsTorque = seg => { let s = 0, t = 0; for (const [T, dt] of seg) { s += T * T * dt; t += dt; } return Math.sqrt(s / t); };
  const screwTorque = o => o.F * o.lead / (TAU * (o.eff || 0.9));
  const screwRpm = (v, lead) => v / lead * 60;
  const beltSpeed = (n, d) => rad(n) * d / 2;
  const encoder = o => ({ counts: 4 * o.ppr, resolutionDeg: 360 / (4 * o.ppr), lineFreq: (o.rpm || 0) / 60 * o.ppr, countFreq: 4 * (o.rpm || 0) / 60 * o.ppr });

  /* ---------------------------------------------------------------- heat and duty */
  const copperR = (R20, T) => R20 * (1 + 0.00393 * (T - 20));
  const windingTemp = o => (o.Tamb == null ? 40 : o.Tamb) + o.Ploss * o.Rth * (1 - Math.exp(-o.t / o.tau));
  // insulation classes: the hottest-spot temperature the insulation is designed for (IEC 60085)
  const INSULATION = { A: 105, E: 120, B: 130, F: 155, H: 180 };
  // cycles short compared with the thermal time constant: heating ∝ I² × duty, so the allowed current grows as 1/√duty
  const dutyOverload = D => 1 / Math.sqrt(Math.max(1e-3, Math.min(1, D)));

  /* ---------------------------------------------------------------- efficiency classes and frames */
  // minimum efficiencies (%), 4-pole 50 Hz, IEC 60034-30-1 / EU Regulation 2019/1781 — approximate, for teaching
  const IE = {
    kW: [0.75, 1.1, 1.5, 2.2, 3, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110],
    IE2: [79.6, 81.4, 82.8, 84.3, 85.5, 86.6, 87.7, 88.7, 89.8, 90.6, 91.2, 91.6, 92.3, 92.7, 93.1, 93.5, 94.0, 94.2, 94.5],
    IE3: [82.5, 84.1, 85.3, 86.7, 87.7, 88.6, 89.6, 90.4, 91.4, 92.1, 92.6, 93.0, 93.6, 93.9, 94.2, 94.6, 95.0, 95.2, 95.4],
    IE4: [85.7, 87.2, 88.2, 89.5, 90.4, 91.1, 91.9, 92.6, 93.3, 93.9, 94.2, 94.5, 94.9, 95.2, 95.4, 95.7, 96.0, 96.1, 96.3]
  };
  const ieAt = (cls, kW) => { const k = IE.kW; if (kW <= k[0]) return IE[cls][0]; for (let i = 1; i < k.length; i++) if (kW <= k[i]) { const u = (Math.log(kW) - Math.log(k[i - 1])) / (Math.log(k[i]) - Math.log(k[i - 1])); return IE[cls][i - 1] + u * (IE[cls][i] - IE[cls][i - 1]); } return IE[cls][k.length - 1]; };
  const ieClass = (kW, eff) => eff >= ieAt('IE4', kW) ? 'IE4' : eff >= ieAt('IE3', kW) ? 'IE3' : eff >= ieAt('IE2', kW) ? 'IE2' : 'below IE2';
  // typical IEC frame sizes (shaft height in mm) of 4-pole, 50 Hz totally enclosed motors — the usual assignments
  const IEC_FRAMES = [['71', 0.37], ['80', 0.75], ['90S', 1.1], ['90L', 1.5], ['100L', 3], ['112M', 4], ['132S', 5.5], ['132M', 7.5], ['160M', 11], ['160L', 15], ['180M', 18.5], ['180L', 22], ['200L', 30], ['225S', 37], ['225M', 45], ['250M', 55], ['280S', 75], ['280M', 90]];

  /* ---------------------------------------------------------------- hydraulic and air motors */
  // Vg in cm³/rev, dp in bar, Q in L/min, n in rpm; torque = Vg·Δp/(2π)·η_hm, speed = Q·η_v/Vg
  function hydMotor(o) {
    const etaV = o.etaV == null ? 0.95 : o.etaV, etaHM = o.etaHM == null ? 0.92 : o.etaHM;
    const T = o.Vg * 1e-6 * o.dp * 1e5 / TAU * etaHM, n = o.Q * 1000 * etaV / o.Vg, Pin = o.dp * 1e5 * o.Q / 60000, Pout = T * rad(n);
    return { T, n, Pin, Pout, eta: etaV * etaHM };
  }
  function hydPump(o) {
    const etaV = o.etaV == null ? 0.95 : o.etaV, etaHM = o.etaHM == null ? 0.92 : o.etaHM;
    const Q = o.Vg * o.n * etaV / 1000, T = o.Vg * 1e-6 * o.dp * 1e5 / (TAU * etaHM), Pin = T * rad(o.n), Phyd = o.dp * 1e5 * Q / 60000;
    return { Q, T, Pin, Phyd, eta: etaV * etaHM };
  }
  // an air motor's power is a parabola in speed, largest at half the free speed; torque falls linearly to zero
  function airMotor(o) {
    const u = o.n / o.n0, Tstall = 4 * o.Pmax / rad(o.n0);
    return { P: Math.max(0, 4 * o.Pmax * u * (1 - u)), T: Math.max(0, Tstall * (1 - u)), Tstall };
  }

  /* ---------------------------------------------------------------- cables, braking, capacitors */
  // voltage drop of a cable run (L one way, A in mm²): three-phase √3·I·L·(r cos φ + x sin φ), single-phase 2·I·L·(…)
  function cableDrop(o) {
    const r = (o.rho || 0.0175) / o.A, x = (o.x == null ? 0.08e-3 : o.x), pf = o.pf == null ? 0.85 : o.pf, sn = Math.sqrt(1 - pf * pf);
    return (o.phases === 1 ? 2 : SQ3) * o.I * o.L * (r * pf + x * sn);
  }
  const brakeEnergy = o => 0.5 * o.J * (Math.pow(rad(o.n1), 2) - Math.pow(rad(o.n2 || 0), 2));
  // rule of thumb for running a three-phase motor on one phase (Steinmetz): about 70 µF per kW at 230 V, 50 Hz
  const steinmetzC = o => 70e-6 * (o.P / 1000) * Math.pow(230 / o.V, 2) * (50 / (o.f || 50));

  H.motor = {
    rpm, rad, HP, PS, torqueFromPower, powerFromTorque, power3, current3,
    dc, dcSim, pwmRipple, induction, vf, starDelta, syncRpm, slip, stepper,
    move, reflected, moveTorque, rmsTorque, screwTorque, screwRpm, beltSpeed, encoder,
    copperR, windingTemp, INSULATION, dutyOverload, IE, ieAt, ieClass, IEC_FRAMES,
    hydMotor, hydPump, airMotor, cableDrop, brakeEnergy, steinmetzC
  };
})(typeof window !== 'undefined' ? window : globalThis);
