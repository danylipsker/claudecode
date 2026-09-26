/* HYPER-CORE · medicine.js
 *
 * Physiology and clinical arithmetic, for simulations (kit.med), the medical tools and tests.
 * Nothing here uses the DOM. Every formula is the standard published one; units are the
 * ones the formula is written in (mg/dL for creatinine, mmHg, kg, cm, years …).
 *
 *   M.ecg({ rhythm: 'sinus' | 'brady' | 'tachy' | 'afib' | 'aflutter' | 'pvc' | 'vt' | 'vf' | 'asystole' | 'block1' | 'block3',
 *           hr: 72, seconds: 10, seed: 1 })  -> { at(t) -> mV, beats: [{ t, kind }], hr }     a synthetic lead-II ECG
 *   M.hh({ I: t => 10, tEnd: 50, dt: 0.01 }) -> { t, V, m, h, n }    the Hodgkin–Huxley squid axon (ms, mV, µA/cm²)
 *   M.sat(po2, { pH, T, p50 })  M.o2content(hb, sat, po2)  M.alveolarO2({ fio2, patm, paco2, rq })
 *   M.pk({ halfLife, Vd, doses: [{ t, amount, route: 'iv' | 'oral' | 'infusion', F, ka, duration }] }) -> { at(t) }  (h, L, mg → mg/L)
 *   M.bayes({ prevalence, sensitivity, specificity })  M.sir({ R0, days, N, I0, vaccinated, gamma })
 *   M.bmi  M.bsa  M.egfr  M.cockcroftGault  M.map  M.qtc  M.anionGap  M.correctedCalcium  M.parkland  M.maintenanceFluids …
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const rng = seed => (H.util && H.util.rng ? H.util.rng(seed >>> 0) : Math.random);
  const gauss = (t, mu, sd) => Math.exp(-0.5 * ((t - mu) / sd) * ((t - mu) / sd));

  /* ---------------------------------------------------------------- ECG */
  // one beat as Gaussian waves around the R peak (seconds, mV); QT stretches with the RR interval
  function beatShape(dt, b) {
    const rr = b.rr || 0.83, qt = 0.4 * Math.sqrt(rr);            // Bazett: QT grows with the square root of RR
    if (b.kind === 'wide') {
      // a ventricular beat: no P wave, a broad QRS and a T wave the other way
      return 1.1 * gauss(dt, 0, 0.035) - 0.45 * gauss(dt, 0.07, 0.04) - 0.35 * gauss(dt, qt * 0.85, 0.07);
    }
    let v = 0;
    if (b.p !== false) v += 0.15 * gauss(dt, -(b.pr || 0.16), 0.025);
    v += -0.1 * gauss(dt, -0.035, 0.01) + 1.2 * gauss(dt, 0, 0.011) - 0.25 * gauss(dt, 0.035, 0.012);
    v += 0.3 * gauss(dt, qt * 0.72, 0.055);
    return v;
  }
  function ecg(o) {
    o = o || {};
    const rhythm = o.rhythm || 'sinus', seconds = o.seconds || 10, R = rng(o.seed || 1);
    let hr = o.hr || { brady: 45, tachy: 130, vt: 180, afib: 110, aflutter: 150, block3: 38 }[rhythm] || 72;
    const beats = [], extras = { fib: 0, flutter: false, p: [] };
    let t = 0.3;
    if (rhythm === 'vf' || rhythm === 'asystole') {
      // no organised beats at all
    } else if (rhythm === 'block3') {
      // complete heart block: P waves at the sinus rate, escape beats slow and unrelated
      const pRate = o.pRate || 80;
      for (let tp = 0.1; tp < seconds; tp += 60 / pRate) extras.p.push(tp);
      for (; t < seconds + 1; t += 60 / hr) beats.push({ t, kind: 'wide', rr: 60 / hr, p: false });
    } else {
      let k = 0;
      while (t < seconds + 1) {
        const base = 60 / hr;
        let rr = base * (1 + (R() - 0.5) * 0.06), kind = 'normal', p = true, pr = rhythm === 'block1' ? 0.3 : 0.16;
        if (rhythm === 'afib') { rr = base * (0.55 + R() * 0.9); p = false; }
        if (rhythm === 'aflutter') { rr = base; p = false; }
        if (rhythm === 'vt') { kind = 'wide'; p = false; rr = base * (1 + (R() - 0.5) * 0.02); }
        if (rhythm === 'pvc' && k % (o.every || 4) === 3) { kind = 'wide'; p = false; rr = base * 0.62; }
        beats.push({ t, kind, rr, p, pr });
        // after a premature beat the next normal one waits (the compensatory pause)
        t += (rhythm === 'pvc' && kind === 'wide') ? base * 1.38 : rr;
        k++;
      }
    }
    if (rhythm === 'afib') extras.fib = 0.05;
    if (rhythm === 'aflutter') extras.flutter = true;
    const vfPhase = [R() * 6.28, R() * 6.28, R() * 6.28, R() * 6.28];
    const at = time => {
      let v = 0;
      if (rhythm === 'vf') {
        v = 0.45 * Math.sin(2 * Math.PI * 4.8 * time + vfPhase[0]) * (0.6 + 0.4 * Math.sin(2 * Math.PI * 0.4 * time + vfPhase[1]))
          + 0.25 * Math.sin(2 * Math.PI * 6.3 * time + vfPhase[2]) + 0.15 * Math.sin(2 * Math.PI * 3.1 * time + vfPhase[3]);
        return v;
      }
      if (rhythm === 'asystole') return 0.02 * Math.sin(2 * Math.PI * 0.3 * time);
      for (const b of beats) { const d = time - b.t; if (d > -0.4 && d < 0.7) v += beatShape(d, b); }
      for (const tp of extras.p) { const d = time - tp; if (Math.abs(d) < 0.1) v += 0.15 * gauss(d, 0, 0.025); }
      if (extras.fib) v += extras.fib * (Math.sin(2 * Math.PI * 6.1 * time) * 0.6 + Math.sin(2 * Math.PI * 8.3 * time + 1) * 0.4);
      if (extras.flutter) { const ph = (time * 5) % 1; v += 0.18 * (ph < 0.8 ? -ph / 0.8 : (ph - 0.8) / 0.2 - 1) + 0.09; }   // sawtooth at 300/min
      return v;
    };
    const measured = beats.length > 2 ? 60 * (beats.length - 1) / (beats[beats.length - 1].t - beats[0].t) : 0;
    return { at, beats, hr: measured, rhythm };
  }

  /* ---------------------------------------------------------------- the neuron */
  // Hodgkin and Huxley's squid axon (1952), with the resting potential at −65 mV
  function hh(o) {
    const I = typeof o.I === 'function' ? o.I : () => o.I || 0;
    const dt = o.dt || 0.01, tEnd = o.tEnd || 50;
    const gNa = o.gNa != null ? o.gNa : 120, gK = o.gK != null ? o.gK : 36, gL = 0.3, ENa = 50, EK = -77, EL = -54.387;
    const an = V => Math.abs(V + 55) < 1e-7 ? 0.1 : 0.01 * (V + 55) / (1 - Math.exp(-(V + 55) / 10));
    const bn = V => 0.125 * Math.exp(-(V + 65) / 80);
    const am = V => Math.abs(V + 40) < 1e-7 ? 1 : 0.1 * (V + 40) / (1 - Math.exp(-(V + 40) / 10));
    const bm = V => 4 * Math.exp(-(V + 65) / 18);
    const ah = V => 0.07 * Math.exp(-(V + 65) / 20);
    const bh = V => 1 / (1 + Math.exp(-(V + 35) / 10));
    let V = o.V0 != null ? o.V0 : -65;
    let m = am(V) / (am(V) + bm(V)), h = ah(V) / (ah(V) + bh(V)), n = an(V) / (an(V) + bn(V));
    const out = { t: [], V: [], m: [], h: [], n: [], INa: [], IK: [] };
    const every = Math.max(1, Math.round((o.sample || 0.05) / dt));
    for (let k = 0, t = 0; t <= tEnd; k++, t += dt) {
      const INa = gNa * m * m * m * h * (V - ENa), IK = gK * n * n * n * n * (V - EK), IL = gL * (V - EL);
      if (k % every === 0) { out.t.push(t); out.V.push(V); out.m.push(m); out.h.push(h); out.n.push(n); out.INa.push(INa); out.IK.push(IK); }
      V += dt * (I(t) - INa - IK - IL);
      m += dt * (am(V) * (1 - m) - bm(V) * m);
      h += dt * (ah(V) * (1 - h) - bh(V) * h);
      n += dt * (an(V) * (1 - n) - bn(V) * n);
    }
    // spikes: upward crossings of 0 mV driven by a real inward sodium current (a strong stimulus alone,
    // with the sodium channels blocked, can also push V past 0 — that is not an action potential)
    const spikes = [];
    for (let k = 1; k < out.V.length; k++) {
      if (!(out.V[k - 1] < 0 && out.V[k] >= 0)) continue;
      let peakINa = 0;
      for (let j = Math.max(0, k - 20); j < Math.min(out.V.length, k + 20); j++) peakINa = Math.min(peakINa, out.INa[j]);
      if (peakINa < -100) spikes.push(out.t[k]);
    }
    out.spikes = spikes;
    return out;
  }
  // membrane potentials (mV) at body temperature
  const RTF = (T) => 8.314462618 * (T || 310.15) / 96485.33212 * 1000;
  const nernst = (z, cOut, cIn, T) => RTF(T) / z * Math.log(cOut / cIn);
  function goldman(o) {
    // permeabilities pK, pNa, pCl; concentrations out and in (mM)
    const num = o.pK * o.Ko + o.pNa * o.Nao + o.pCl * o.Cli;
    const den = o.pK * o.Ki + o.pNa * o.Nai + o.pCl * o.Clo;
    return RTF(o.T) * Math.log(num / den);
  }

  /* ---------------------------------------------------------------- oxygen */
  // haemoglobin saturation (0–1) from PO2 (mmHg): Severinghaus (1979), with the curve shifted by
  // pH (Bohr effect) and temperature, or a given P50
  function p50(o) {
    o = o || {};
    if (o.p50) return o.p50;
    const dlog = -0.48 * ((o.pH != null ? o.pH : 7.4) - 7.4) + 0.024 * ((o.T != null ? o.T : 37) - 37);
    return 26.8 * Math.pow(10, dlog);
  }
  function sat(po2, o) {
    const x = Math.max(0, po2) * 26.8 / p50(o);                      // the "virtual" PO2 on the standard curve
    if (x <= 0) return 0;
    return 1 / (23400 / (x * x * x + 150 * x) + 1);
  }
  const o2content = (hb, s, po2) => 1.34 * hb * s + 0.003 * po2;      // mL O2 per dL of blood
  const alveolarO2 = o => (o.fio2 != null ? o.fio2 : 0.21) * ((o.patm != null ? o.patm : 760) - 47) - (o.paco2 != null ? o.paco2 : 40) / (o.rq || 0.8);

  /* ---------------------------------------------------------------- drugs in the body */
  // one compartment, first-order elimination; times in hours, doses in mg, Vd in L -> mg/L
  function pk(o) {
    const k = Math.LN2 / o.halfLife, Vd = o.Vd;
    const doses = o.doses || [];
    const at = t => {
      let c = 0;
      for (const d of doses) {
        const s = t - d.t;
        if (s < 0) continue;
        const F = d.F != null ? d.F : 1;
        if (d.route === 'oral') {
          const ka = d.ka || 1;
          c += Math.abs(ka - k) < 1e-9 ? F * d.amount / Vd * k * s * Math.exp(-k * s)
            : F * d.amount * ka / (Vd * (ka - k)) * (Math.exp(-k * s) - Math.exp(-ka * s));
        } else if (d.route === 'infusion') {
          const rate = d.amount / d.duration;                         // mg per hour
          const on = Math.min(s, d.duration);
          c += rate / (k * Vd) * (1 - Math.exp(-k * on)) * Math.exp(-k * Math.max(0, s - d.duration));
        } else c += F * d.amount / Vd * Math.exp(-k * s);
      }
      return c;
    };
    return { at, k, clearance: k * Vd };
  }
  // repeated IV doses at steady state: peak, trough, average, and the accumulation factor
  function steadyState(o) {
    const k = Math.LN2 / o.halfLife, F = o.F != null ? o.F : 1, acc = 1 / (1 - Math.exp(-k * o.tau));
    const peak = F * o.dose / o.Vd * acc;
    return { peak, trough: peak * Math.exp(-k * o.tau), average: F * o.dose / (k * o.Vd * o.tau), accumulation: acc, clearance: k * o.Vd };
  }
  const loadingDose = (target, Vd, F) => target * Vd / (F || 1);
  const maintenanceDose = (target, CL, tau, F) => target * CL * tau / (F || 1);
  // dose–response: the Hill (Emax) curve
  const emax = (C, Emax, EC50, n) => Emax * Math.pow(C, n || 1) / (Math.pow(EC50, n || 1) + Math.pow(C, n || 1));

  /* ---------------------------------------------------------------- tests and risks */
  function bayes(o) {
    const p = o.prevalence, se = o.sensitivity, sp = o.specificity, N = o.N || 1000;
    const tp = se * p, fn = (1 - se) * p, fp = (1 - sp) * (1 - p), tn = sp * (1 - p);
    return { ppv: tp / (tp + fp), npv: tn / (tn + fn), lrPos: se / (1 - sp), lrNeg: (1 - se) / sp,
      counts: { tp: tp * N, fn: fn * N, fp: fp * N, tn: tn * N }, accuracy: tp + tn };
  }
  // probability after a test result, from the probability before it and a likelihood ratio
  const postTest = (pre, lr) => { const odds = pre / (1 - pre) * lr; return odds / (1 + odds); };
  function risk(o) {
    // cer, eer: event rates without and with treatment
    const arr = o.cer - o.eer, rr = o.eer / o.cer;
    const or = (o.eer / (1 - o.eer)) / (o.cer / (1 - o.cer));
    return { arr, rrr: arr / o.cer, rr, or, nnt: arr !== 0 ? 1 / Math.abs(arr) : Infinity };
  }
  // Wilson score interval for a proportion
  function wilson(k, n, z) {
    z = z || 1.96;
    const p = k / n, d = 1 + z * z / n, c = (p + z * z / (2 * n)) / d, h = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / d;
    return [c - h, c + h];
  }

  /* ---------------------------------------------------------------- epidemics */
  // SIR with R0 and a mean infectious period (days); a fraction vaccinated starts immune
  function sir(o) {
    const R0 = o.R0 != null ? o.R0 : 2.5;                            // (R0 = 0 is allowed: nothing spreads)
    const N = o.N || 1e6, gamma = 1 / (o.infectious || 7), beta = R0 * gamma, days = o.days || 180, dt = o.dt || 0.1;
    let I = o.I0 || 10, R = N * (o.vaccinated || 0), S = N - I - R;
    const out = [{ day: 0, S, I, R }];
    const f = (s, i) => [-beta * s * i / N, beta * s * i / N - gamma * i];
    for (let k = 1, day = 0; day < days; k++) {
      // RK4
      const [a1, b1] = f(S, I), [a2, b2] = f(S + a1 * dt / 2, I + b1 * dt / 2), [a3, b3] = f(S + a2 * dt / 2, I + b2 * dt / 2), [a4, b4] = f(S + a3 * dt, I + b3 * dt);
      const dS = (a1 + 2 * a2 + 2 * a3 + a4) * dt / 6, dI = (b1 + 2 * b2 + 2 * b3 + b4) * dt / 6;
      S += dS; I += dI; R = N - S - I; day += dt;
      if (k % Math.round(1 / dt) === 0) out.push({ day: Math.round(day), S, I, R });
    }
    const peak = out.reduce((m, r) => r.I > m.I ? r : m, out[0]);
    const infected = (out[out.length - 1].R - N * (o.vaccinated || 0)) / N;
    return { series: out, peak, infected, herd: R0 > 1 ? 1 - 1 / R0 : 0 };
  }

  /* ---------------------------------------------------------------- clinical formulas */
  const bmi = (kg, m) => kg / (m * m);
  const bsa = (kg, cm, method) => method === 'dubois' ? 0.007184 * Math.pow(kg, 0.425) * Math.pow(cm, 0.725) : Math.sqrt(kg * cm / 3600);   // m²
  // estimated GFR, CKD-EPI 2021 (race-free), creatinine in mg/dL -> mL/min/1.73 m²
  function egfr(scr, age, female) {
    const kap = female ? 0.7 : 0.9, a = female ? -0.241 : -0.302;
    return 142 * Math.pow(Math.min(scr / kap, 1), a) * Math.pow(Math.max(scr / kap, 1), -1.2) * Math.pow(0.9938, age) * (female ? 1.012 : 1);
  }
  const cockcroftGault = (age, kg, scr, female) => (140 - age) * kg / (72 * scr) * (female ? 0.85 : 1);     // mL/min
  const map = (sbp, dbp) => dbp + (sbp - dbp) / 3;
  const qtc = (qtMs, hr, method) => { const rr = 60 / hr; return method === 'fridericia' ? qtMs / Math.cbrt(rr) : qtMs / Math.sqrt(rr); };
  const anionGap = (na, cl, hco3) => na - (cl + hco3);
  const correctedCalcium = (caMgDl, albGdl) => caMgDl + 0.8 * (4 - albGdl);
  const ibw = (cm, female) => (female ? 45.5 : 50) + 2.3 * (cm / 2.54 - 60);                            // Devine, kg
  const bmr = (kg, cm, age, female) => 10 * kg + 6.25 * cm - 5 * age + (female ? -161 : 5);             // Mifflin–St Jeor, kcal/day
  const maxHR = age => 208 - 0.7 * age;                                                                   // Tanaka
  const karvonen = (rest, max, intensity) => rest + intensity * (max - rest);
  const parkland = (kg, tbsa) => 4 * kg * tbsa;                                                           // mL in 24 h (tbsa in %)
  const maintenanceFluids = kg => (kg <= 10 ? 4 * kg : kg <= 20 ? 40 + 2 * (kg - 10) : 60 + (kg - 20));  // mL/h, 4-2-1
  const dripRate = (mL, minutes, dropFactor) => mL * dropFactor / minutes;                                // drops/min
  const winters = hco3 => 1.5 * hco3 + 8;                                                                // expected PaCO2 ± 2
  const cardiacOutput = (hr, sv) => hr * sv / 1000;                                                       // L/min (sv in mL)

  H.med = {
    ecg, beatShape, hh, nernst, goldman, p50, sat, o2content, alveolarO2,
    pk, steadyState, loadingDose, maintenanceDose, emax,
    bayes, postTest, risk, wilson, sir,
    bmi, bsa, egfr, cockcroftGault, map, qtc, anionGap, correctedCalcium, ibw, bmr, maxHR, karvonen,
    parkland, maintenanceFluids, dripRate, winters, cardiacOutput
  };
})(typeof window !== 'undefined' ? window : globalThis);
