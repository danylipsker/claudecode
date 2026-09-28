/* HYPER-CORE · ergo.js
 *
 * Ergonomics for simulations (kit.ergo), the tools and tests: anthropometry (body dimensions by percentile
 * for men, women and mixed populations; how many people a design range fits), workstation rules from the body,
 * manual lifting (the revised NIOSH equation), noise dose and exposure, hand-arm and whole-body vibration,
 * thermal comfort (Fanger's PMV/PPD, ISO 7730), heat and cold stress, load carriage (Pandolf), controls and
 * displays (Fitts, Hick), stairs and lighting. Lengths in mm, masses in kg unless a name says otherwise.
 * Nothing here uses the DOM.
 *
 *   E.DIMS[id] -> { name, m: [mean, sd], f: [mean, sd], unit, note }   (representative adults, rounded — see the note)
 *   E.z(p) (inverse normal)  E.phi(z)  E.pct(id, sex, p)  E.pctMix(id, p, shareMen)  E.fraction(id, sex, lo, hi)  E.fractionMix(id, lo, hi, share)
 *   E.person({ sex, p }) -> every dimension at one percentile        E.SEGMENTS (link lengths as fractions of stature)
 *   E.workstation(person) -> { seat, deskSit, keyboard, monitorTop, standPrecision, standLight, standHeavy, … }
 *   E.niosh({ H, V, D, A, F, hours, coupling, load }) -> { RWL, LI, HM, VM, DM, AM, FM, CM }   (H, V, D in cm; F lifts/min)
 *   E.noiseDose([[L dB(A), hours], …], { criterion, exchange }) -> { dose, twa }   E.lex8([[L, h], …])   E.addDb([L, …])
 *   E.NOISE_LIMITS  E.a8([[a m/s², h], …])  E.VIBRATION_LIMITS
 *   E.pmv({ ta, tr, vel, rh, met, clo, wme }) -> { pmv, ppd, tcl }   E.ppd(pmv)   E.wbgt({ tnw, tg, ta, outdoor })   E.windChill(ta, v)
 *   E.pandolf({ W, L, V, G, eta }) -> watts   E.fitts({ a, b, D, W })   E.hick({ a, b, n })   E.blondel(rise, going)   E.LIGHTING
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};

  /* ---------------------------------------------------------------- anthropometry */
  // Representative adult body dimensions (mm; weight kg): mean and standard deviation for men (m) and women (f),
  // rounded, consistent with large surveys of North American and European adults (such as ANSUR II, 2012, and
  // national surveys) and measured as defined in ISO 7250-1. Populations differ by several centimetres — for a
  // real design use data for the actual users (nationality, age, occupation) and add clothing and posture allowances.
  const DIMS = {
    stature: { name: 'Stature', m: [1755, 70], f: [1625, 64] },
    eyeHeight: { name: 'Eye height, standing', m: [1640, 68], f: [1515, 62] },
    shoulderHeight: { name: 'Shoulder height, standing', m: [1440, 64], f: [1330, 58] },
    elbowHeight: { name: 'Elbow height, standing', m: [1100, 50], f: [1015, 46] },
    knuckleHeight: { name: 'Knuckle height, standing', m: [765, 38], f: [725, 35] },
    gripReachUp: { name: 'Vertical grip reach, standing', m: [2060, 90], f: [1910, 85] },
    sittingHeight: { name: 'Sitting height', m: [915, 36], f: [855, 34] },
    eyeHeightSit: { name: 'Eye height, sitting', m: [795, 35], f: [740, 33] },
    shoulderHeightSit: { name: 'Shoulder height, sitting', m: [600, 32], f: [560, 31] },
    elbowRest: { name: 'Elbow rest height, sitting', m: [245, 30], f: [235, 28] },
    thighClearance: { name: 'Thigh clearance', m: [165, 15], f: [155, 16] },
    kneeHeight: { name: 'Knee height, sitting', m: [555, 29], f: [510, 26] },
    popliteal: { name: 'Popliteal height (underside of the thigh)', m: [445, 28], f: [405, 26] },
    buttockKnee: { name: 'Buttock–knee length', m: [610, 30], f: [580, 29] },
    buttockPopliteal: { name: 'Buttock–popliteal length (seat depth)', m: [500, 28], f: [485, 28] },
    shoulderBreadth: { name: 'Shoulder breadth (bideltoid)', m: [480, 28], f: [415, 25] },
    hipBreadthSit: { name: 'Hip breadth, sitting', m: [370, 27], f: [395, 34] },
    forwardReach: { name: 'Forward grip reach', m: [800, 38], f: [730, 36] },
    handLength: { name: 'Hand length', m: [192, 10], f: [176, 9] },
    handBreadth: { name: 'Hand breadth', m: [88, 5], f: [78, 4] },
    footLength: { name: 'Foot length', m: [268, 13], f: [243, 11] },
    footBreadth: { name: 'Foot breadth', m: [101, 5], f: [91, 5] },
    headCirc: { name: 'Head circumference', m: [575, 15], f: [550, 15] },
    weight: { name: 'Body mass', m: [85, 14], f: [68, 13], unit: 'kg' }
  };
  for (const k in DIMS) { DIMS[k].unit = DIMS[k].unit || 'mm'; DIMS[k].id = k; }
  // the standard normal distribution: Φ by Abramowitz–Stegun 7.1.26 (error < 1.5e-7), and its inverse (Acklam)
  function phi(x) {
    const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x / 2);
    return x >= 0 ? (1 + y) / 2 : (1 - y) / 2;
  }
  function z(p) {
    p = Math.min(1 - 1e-12, Math.max(1e-12, p));
    const a = [-39.6968302866538, 220.946098424521, -275.928510446969, 138.357751867269, -30.6647980661472, 2.50662827745924];
    const b = [-54.4760987982241, 161.585836858041, -155.698979859887, 66.8013118877197, -13.2806815528857];
    const c = [-0.00778489400243029, -0.322396458041136, -2.40075827716184, -2.54973253934373, 4.37466414146497, 2.93816398269878];
    const d = [0.00778469570904146, 0.32246712907004, 2.445134137143, 3.75440866190742];
    const q0 = Math.min(p, 1 - p);
    let x;
    if (q0 < 0.02425) { const q = Math.sqrt(-2 * Math.log(q0)); x = Math.abs((((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1)); x = p < 0.5 ? -x : x; }
    else { const q = p - 0.5, r = q * q; x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
    return x;
  }
  const pct = (id, sex, p) => { const [m, s] = DIMS[id][sex === 'f' ? 'f' : 'm']; return m + z(p / 100) * s; };
  const cdfMix = (id, x, w) => { const M = DIMS[id].m, F = DIMS[id].f; return w * phi((x - M[0]) / M[1]) + (1 - w) * phi((x - F[0]) / F[1]); };
  function pctMix(id, p, w) {
    w = w == null ? 0.5 : w;
    let lo = Math.min(DIMS[id].m[0], DIMS[id].f[0]) - 8 * Math.max(DIMS[id].m[1], DIMS[id].f[1]), hi = Math.max(DIMS[id].m[0], DIMS[id].f[0]) + 8 * Math.max(DIMS[id].m[1], DIMS[id].f[1]);
    for (let k = 0; k < 100; k++) { const m = (lo + hi) / 2; if (cdfMix(id, m, w) < p / 100) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  const fraction = (id, sex, lo, hi) => { const [m, s] = DIMS[id][sex === 'f' ? 'f' : 'm']; return phi((hi - m) / s) - phi((lo - m) / s); };
  const fractionMix = (id, lo, hi, w) => cdfMix(id, hi, w == null ? 0.5 : w) - cdfMix(id, lo, w == null ? 0.5 : w);
  const person = o => { const out = { sex: o.sex, p: o.p }; for (const k in DIMS) out[k] = pct(k, o.sex, o.p); return out; };
  // link lengths as fractions of stature (Drillis and Contini, 1966), for drawing a manikin
  const SEGMENTS = { ankle: 0.039, knee: 0.285, hip: 0.530, wristStanding: 0.485, elbowStanding: 0.630, shoulder: 0.818, eye: 0.936, upperArm: 0.186, forearm: 0.146, hand: 0.108, thigh: 0.245, shank: 0.246, footLength: 0.152, shoulderWidth: 0.259, hipWidth: 0.191, head: 0.130 };

  /* ---------------------------------------------------------------- workstation rules */
  // from one person's dimensions (mm): a seat at popliteal height plus a shoe allowance, a work surface at seated
  // elbow height, the top of a screen at or below eye height, standing surfaces relative to standing elbow height
  function workstation(p) {
    const shoe = 25, seat = p.popliteal + shoe, elbowSit = seat + p.elbowRest;
    return {
      seat, deskSit: elbowSit, keyboard: elbowSit - 20, monitorTop: seat + p.eyeHeightSit, monitorCentre: seat + p.eyeHeightSit - 150, seatDepthMax: p.buttockPopliteal - 50,
      kneeClearance: seat + p.thighClearance + 20, legroomDepth: p.buttockKnee + 100,
      standPrecision: [p.elbowHeight + shoe + 50, p.elbowHeight + shoe + 100], standLight: [p.elbowHeight + shoe - 150, p.elbowHeight + shoe - 100], standHeavy: [p.elbowHeight + shoe - 400, p.elbowHeight + shoe - 150],
      reachComfort: p.forwardReach * 0.75, reachMax: p.forwardReach
    };
  }

  /* ---------------------------------------------------------------- manual lifting: the revised NIOSH equation (1991/1994) */
  // frequency multiplier table: rows by lifts per minute; columns ≤1 h (V<75, V≥75), ≤2 h (…), ≤8 h (…)
  const FM_F = [0.2, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  const FM = [
    [1.00, 1.00, 0.95, 0.95, 0.85, 0.85], [0.97, 0.97, 0.92, 0.92, 0.81, 0.81], [0.94, 0.94, 0.88, 0.88, 0.75, 0.75], [0.91, 0.91, 0.84, 0.84, 0.65, 0.65],
    [0.88, 0.88, 0.79, 0.79, 0.55, 0.55], [0.84, 0.84, 0.72, 0.72, 0.45, 0.45], [0.80, 0.80, 0.60, 0.60, 0.35, 0.35], [0.75, 0.75, 0.50, 0.50, 0.27, 0.27],
    [0.70, 0.70, 0.42, 0.42, 0.22, 0.22], [0.60, 0.60, 0.35, 0.35, 0.18, 0.18], [0.52, 0.52, 0.30, 0.30, 0.00, 0.15], [0.45, 0.45, 0.26, 0.26, 0.00, 0.13],
    [0.41, 0.41, 0.00, 0.23, 0.00, 0.00], [0.37, 0.37, 0.00, 0.21, 0.00, 0.00], [0.00, 0.34, 0.00, 0.00, 0.00, 0.00], [0.00, 0.31, 0.00, 0.00, 0.00, 0.00],
    [0.00, 0.28, 0.00, 0.00, 0.00, 0.00]];
  function freqMult(F, hours, V) {
    const col = (hours <= 1 ? 0 : hours <= 2 ? 2 : 4) + (V >= 75 ? 1 : 0);
    if (F > 15) return 0;
    if (F <= 0.2) return FM[0][col];
    for (let i = 1; i < FM_F.length; i++) if (F <= FM_F[i] + 1e-9) {
      if (Math.abs(F - FM_F[i]) < 1e-9) return FM[i][col];
      const u = (F - FM_F[i - 1]) / (FM_F[i] - FM_F[i - 1]); return FM[i - 1][col] + u * (FM[i][col] - FM[i - 1][col]);
    }
    return 0;
  }
  // H horizontal distance of the hands from the ankles, V height of the hands, D vertical travel (cm); A asymmetry (°)
  function niosh(o) {
    const Hc = o.H, V = o.V, D = o.D, A = o.A || 0, F = o.F == null ? 0.2 : o.F, hours = o.hours == null ? 1 : o.hours;
    const HM = Hc <= 25 ? 1 : Hc > 63 ? 0 : 25 / Hc;
    const VM = V > 175 || V < 0 ? 0 : 1 - 0.003 * Math.abs(V - 75);
    const DM = D <= 25 ? 1 : D > 175 ? 0 : 0.82 + 4.5 / D;
    const AM = A > 135 ? 0 : 1 - 0.0032 * A;
    const FMv = freqMult(F, hours, V);
    const CM = o.coupling === 'poor' ? 0.90 : o.coupling === 'fair' ? (V < 75 ? 0.95 : 1.00) : 1.00;
    const RWL = 23 * HM * VM * DM * AM * FMv * CM;
    return { RWL, LI: o.load != null && RWL > 0 ? o.load / RWL : NaN, HM, VM, DM, AM, FM: FMv, CM, LC: 23 };
  }

  /* ---------------------------------------------------------------- noise */
  // permitted time at level L: T = 8 h / 2^((L − criterion)/exchange); dose = Σ C/T; the equivalent level from the dose
  function noiseDose(parts, o) {
    const crit = (o && o.criterion) || 85, ex = (o && o.exchange) || 3;
    let dose = 0; for (const [L, h] of parts) dose += h / (8 / Math.pow(2, (L - crit) / ex));
    return { dose, twa: crit + ex * Math.log2(Math.max(dose, 1e-12)) };
  }
  const lex8 = parts => 10 * Math.log10(parts.reduce((s, [L, h]) => s + h * Math.pow(10, L / 10), 0) / 8);
  const addDb = Ls => 10 * Math.log10(Ls.reduce((s, L) => s + Math.pow(10, L / 10), 0));
  // EU Directive 2003/10/EC (LEX,8h and peak), OSHA 29 CFR 1910.95 (TWA, 5 dB exchange), NIOSH REL (3 dB exchange)
  const NOISE_LIMITS = { euLowerAction: 80, euUpperAction: 85, euLimit: 87, euPeak: [135, 137, 140], oshaPEL: 90, oshaAction: 85, oshaExchange: 5, nioshREL: 85, nioshExchange: 3 };

  /* ---------------------------------------------------------------- vibration */
  const a8 = parts => Math.sqrt(parts.reduce((s, [a, h]) => s + a * a * h, 0) / 8);
  // EU Directive 2002/44/EC: exposure action and limit values, A(8) in m/s²
  const VIBRATION_LIMITS = { handArmAction: 2.5, handArmLimit: 5, wholeBodyAction: 0.5, wholeBodyLimit: 1.15 };

  /* ---------------------------------------------------------------- thermal comfort, heat and cold */
  // Fanger's predicted mean vote and percentage dissatisfied (ISO 7730): ta, tr in °C, vel m/s, rh %, met, clo
  function pmv(o) {
    const ta = o.ta, tr = o.tr == null ? o.ta : o.tr, vel = o.vel, rh = o.rh, met = o.met, clo = o.clo, wme = o.wme || 0;
    const pa = rh * 10 * Math.exp(16.6536 - 4030.183 / (ta + 235));
    const icl = 0.155 * clo, m = met * 58.15, w = wme * 58.15, mw = m - w;
    const fcl = icl <= 0.078 ? 1 + 1.29 * icl : 1.05 + 0.645 * icl;
    const hcf = 12.1 * Math.sqrt(vel), taa = ta + 273, tra = tr + 273;
    const tcla = taa + (35.5 - ta) / (3.5 * icl + 0.1);
    const p1 = icl * fcl, p2 = p1 * 3.96, p3 = p1 * 100, p4 = p1 * taa, p5 = 308.7 - 0.028 * mw + p2 * Math.pow(tra / 100, 4);
    let xn = tcla / 100, xf = tcla / 50, hc = hcf, n = 0;
    while (Math.abs(xn - xf) > 0.00015 && n < 150) {
      xf = (xf + xn) / 2;
      const hcn = 2.38 * Math.pow(Math.abs(100 * xf - taa), 0.25);
      hc = hcf > hcn ? hcf : hcn;
      xn = (p5 + p4 * hc - p2 * Math.pow(xf, 4)) / (100 + p3 * hc);
      n++;
    }
    const tcl = 100 * xn - 273;
    const hl1 = 3.05e-3 * (5733 - 6.99 * mw - pa), hl2 = mw > 58.15 ? 0.42 * (mw - 58.15) : 0, hl3 = 1.7e-5 * m * (5867 - pa);
    const hl4 = 0.0014 * m * (34 - ta), hl5 = 3.96 * fcl * (Math.pow(xn, 4) - Math.pow(tra / 100, 4)), hl6 = fcl * hc * (tcl - ta);
    const ts = 0.303 * Math.exp(-0.036 * m) + 0.028, v = ts * (mw - hl1 - hl2 - hl3 - hl4 - hl5 - hl6);
    return { pmv: v, ppd: ppd(v), tcl };
  }
  const ppd = v => 100 - 95 * Math.exp(-0.03353 * Math.pow(v, 4) - 0.2179 * v * v);
  // wet-bulb globe temperature (ISO 7243): indoors 0.7 t_nw + 0.3 t_g; in the sun 0.7 t_nw + 0.2 t_g + 0.1 t_a
  const wbgt = o => o.outdoor ? 0.7 * o.tnw + 0.2 * o.tg + 0.1 * o.ta : 0.7 * o.tnw + 0.3 * o.tg;
  // wind chill (North America, 2001): ta °C, v km/h at 10 m; valid for ta ≤ 10 °C and v ≥ 4.8 km/h
  const windChill = (ta, v) => v < 4.8 ? ta : 13.12 + 0.6215 * ta - 11.37 * Math.pow(v, 0.16) + 0.3965 * ta * Math.pow(v, 0.16);

  /* ---------------------------------------------------------------- work, controls, buildings */
  // Pandolf et al. (1977): metabolic rate (W) of walking with a load — W body mass, L load (kg), V speed (m/s), G grade (%), η terrain
  const pandolf = o => 1.5 * o.W + 2.0 * (o.W + o.L) * Math.pow(o.L / o.W, 2) + (o.eta || 1) * (o.W + o.L) * (1.5 * o.V * o.V + 0.35 * o.V * (o.G || 0));
  // Fitts's law (Shannon form) and Hick's law: times in the units of a and b
  const fitts = o => o.a + o.b * Math.log2(o.D / o.W + 1);
  const hick = o => o.a + o.b * Math.log2(o.n + 1);
  // stairs: Blondel's rule 2R + G, comfortable between about 600 and 650 mm; returns the pitch too
  const blondel = (rise, going) => ({ step: 2 * rise + going, angle: Math.atan2(rise, going) * 180 / Math.PI, ok: 2 * rise + going >= 600 && 2 * rise + going <= 650 });
  // typical maintained illuminance (lx), rounded, in the spirit of EN 12464-1 — check the standard for a real design
  const LIGHTING = [['Corridors and circulation', 100], ['Storage, stairs', 150], ['Canteens, rest rooms', 200], ['Rough assembly, loading bays', 300], ['Offices: reading, writing, screens', 500], ['Workshop bench work, medium assembly', 500], ['Technical drawing, fine assembly', 750], ['Precision assembly, inspection', 1000], ['Very fine work: electronics, watchmaking', 1500]];

  H.ergo = {
    DIMS, phi, z, pct, pctMix, fraction, fractionMix, person, SEGMENTS, workstation,
    niosh, freqMult, noiseDose, lex8, addDb, NOISE_LIMITS, a8, VIBRATION_LIMITS,
    pmv, ppd, wbgt, windChill, pandolf, fitts, hick, blondel, LIGHTING
  };
})(typeof window !== 'undefined' ? window : globalThis);
