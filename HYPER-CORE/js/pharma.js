/* HYPER-CORE · pharma.js
 *
 * Pharmaceutics for simulations (kit.pharma), the tools and tests: physical pharmacy, dissolution and
 * release, stability, dosage-form science, sterilisation, pharmacokinetic models beyond medicine.js,
 * non-compartmental analysis, bioequivalence and pharmacy calculations. Nothing here uses the DOM.
 * Units as named (SI unless a parameter says mg, mL, h, °C); these are teaching models, not clinical tools.
 *
 *   P.ionised(pKa, pH, acid) -> fraction ionised    P.solubility({ S0, pKa, pH, acid })    P.logD(logP, pKa, pH, acid)
 *   P.bufferCapacity(C, pKa, pH) (Van Slyke)         P.noyesWhitney({ D, A, h, Cs, C, V }) -> dC/dt
 *   P.dissolve({ dose, r0, rho, Cs, D, h, V, n, T, dt }) -> [[t, fraction dissolved], …] (a shrinking-sphere powder)
 *   P.release: zero(k,t) first(k,t) higuchi(k,t) korsmeyer(k,n,t) weibull(t,a,b) hixson(k,t)   P.f2(ref[], test[])
 *   P.degrade({ order, k, C0, t })  P.t90({ order, k, C0 })  P.arrhenius({ k1, T1, T2, Ea }) (T in K)  P.shelfLife({ order, kRef, TRef, Ea, T, C0 })
 *   P.carr(bulk, tapped)  P.hausner(bulk, tapped)  P.flowClass(carr)  P.heckel(D) = ln(1/(1−D))  P.stokes({ d, rhoP, rhoF, eta })
 *   P.hlbMix([[fraction, HLB], …])  P.fickFlux({ D, K, h, dC })  P.aerodynamic({ d, rho, chi })
 *   P.naclToAdd({ volume, drugs: [[grams, E], …] })  P.fpdMethod({ a, b })  P.osmolarity({ gPerL, MW, n })  P.mEq({ mg, MW, valence })
 *   P.dilute({ C1, V1, C2 })  P.alligation({ high, low, want }) -> { partsHigh, partsLow }
 *   P.f0(profile [[t min, T °C], …], z, Tref)  P.logReduction(t, D)  P.dAtT({ D121, z, T })
 *   P.twoComp({ dose, V1, k10, k12, k21 }) -> { A, B, alpha, beta, at(t), auc }   P.mmPK({ dose, Vd, Vmax, Km, tau, n, dt })
 *   P.nca(times, concs, nz?) -> { cmax, tmax, auc, aucInf, lambda, half, points } (λz from the last nz after C_max)    P.be(test, ref, seq?) -> { gmr, lo, hi, df, cv, pass } (90 % CI; with seq the 2×2 crossover, n − 2 df)
 *   P.occupancy(C, Kd)  P.hill(C, Emax, EC50, n)  P.ti(TD50, ED50)
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const R = 8.314462618;

  /* ---------------------------------------------------------------- ionisation, solubility, partition */
  const ionised = (pKa, pH, acid) => acid ? 1 / (1 + Math.pow(10, pKa - pH)) : 1 / (1 + Math.pow(10, pH - pKa));
  // total solubility of a weak acid or base from its intrinsic (un-ionised) solubility S0
  const solubility = o => o.S0 * (1 + (o.acid ? Math.pow(10, o.pH - o.pKa) : Math.pow(10, o.pKa - o.pH)));
  const logD = (logP, pKa, pH, acid) => logP - Math.log10(1 + (acid ? Math.pow(10, pH - pKa) : Math.pow(10, pKa - pH)));
  // Van Slyke buffer capacity, mol/(L·pH) with C in mol/L
  const bufferCapacity = (C, pKa, pH) => { const Ka = Math.pow(10, -pKa), h = Math.pow(10, -pH); return 2.303 * C * Ka * h / Math.pow(Ka + h, 2); };

  /* ---------------------------------------------------------------- dissolution and release */
  const noyesWhitney = o => o.D * o.A / (o.h * o.V) * (o.Cs - (o.C || 0));
  // a monodisperse powder of n-particle mass `dose` (kg), radius r0 (m), dissolving in volume V (m³) by Noyes–Whitney,
  // the diffusion layer h (default: the particle radius, capped at 30 µm); returns [[t s, fraction dissolved], …]
  function dissolve(o) {
    const V = o.V, rho = o.rho || 1300, D = o.D || 7e-10, Cs = o.Cs, T = o.T || 3600, dt = o.dt || 1;
    const m0 = o.dose, np = m0 / (rho * 4 / 3 * Math.PI * Math.pow(o.r0, 3));
    let r = o.r0, m = m0, C = 0; const out = [[0, 0]];
    for (let t = dt; t <= T + 1e-9; t += dt) {
      if (m > 0) {
        const h = o.h || Math.min(r, 30e-6), A = np * 4 * Math.PI * r * r;
        const dm = Math.min(m, D * A / h * Math.max(0, Cs - C) * dt);
        m -= dm; C += dm / V;
        r = m > 0 ? Math.cbrt(m / (np * rho * 4 / 3 * Math.PI)) : 0;
      }
      out.push([t, 1 - m / m0]);
    }
    return out;
  }
  const release = {
    zero: (k, t) => Math.min(1, k * t),
    first: (k, t) => 1 - Math.exp(-k * t),
    higuchi: (k, t) => Math.min(1, k * Math.sqrt(t)),
    korsmeyer: (k, n, t) => Math.min(1, k * Math.pow(t, n)),
    weibull: (t, a, b) => 1 - Math.exp(-Math.pow(t, b) / a),
    hixson: (k, t) => 1 - Math.pow(Math.max(0, 1 - k * t), 3)          // fraction dissolved; W^(1/3) falls linearly
  };
  // FDA/EMA similarity factor between two dissolution profiles (% dissolved at the same times)
  function f2(ref, test) {
    const n = Math.min(ref.length, test.length);
    let s = 0; for (let i = 0; i < n; i++) s += Math.pow(ref[i] - test[i], 2);
    return 50 * Math.log10(100 / Math.sqrt(1 + s / n));
  }

  /* ---------------------------------------------------------------- stability */
  function degrade(o) {
    if (o.order === 0) return Math.max(0, o.C0 - o.k * o.t);
    if (o.order === 2) return o.C0 / (1 + o.k * o.C0 * o.t);
    return o.C0 * Math.exp(-o.k * o.t);
  }
  const t90 = o => o.order === 0 ? 0.1 * o.C0 / o.k : o.order === 2 ? 1 / (9 * o.k * o.C0) : Math.log(10 / 9) / o.k;
  const arrhenius = o => o.k1 * Math.exp(o.Ea / R * (1 / o.T1 - 1 / o.T2));
  function shelfLife(o) {
    const k = arrhenius({ k1: o.kRef, T1: o.TRef, T2: o.T, Ea: o.Ea });
    return { k, t90: t90({ order: o.order == null ? 1 : o.order, k, C0: o.C0 || 100 }) };
  }

  /* ---------------------------------------------------------------- powders, tablets, dispersions */
  const carr = (bulk, tapped) => 100 * (1 - bulk / tapped);
  const hausner = (bulk, tapped) => tapped / bulk;
  // USP <1174> flow classes by compressibility index
  const flowClass = ci => ci <= 10 ? 'excellent' : ci <= 15 ? 'good' : ci <= 20 ? 'fair' : ci <= 25 ? 'passable' : ci <= 31 ? 'poor' : ci <= 37 ? 'very poor' : 'very, very poor';
  const heckel = D => Math.log(1 / (1 - D));
  const stokes = o => 2 / 9 * Math.pow(o.d / 2, 2) * (o.rhoP - o.rhoF) * (o.g || 9.80665) / o.eta;
  const hlbMix = parts => parts.reduce((s, [f, v]) => s + f * v, 0) / parts.reduce((s, [f]) => s + f, 0);
  const fickFlux = o => o.D * o.K * o.dC / o.h;
  const aerodynamic = o => o.d * Math.sqrt(o.rho / ((o.chi || 1) * 1000));

  /* ---------------------------------------------------------------- tonicity, strength, dilution */
  // grams of sodium chloride to add to make `volume` mL isotonic, given each drug's grams and NaCl equivalent E
  const naclToAdd = o => 0.009 * o.volume - o.drugs.reduce((s, [g, E]) => s + g * E, 0);
  // freezing-point method: grams per 100 mL of adjusting substance, a = depression by the drug, b = by 1 % of adjuster
  const fpdMethod = o => (0.52 - o.a) / o.b;
  const osmolarity = o => o.gPerL / o.MW * (o.n || 1) * 1000;                    // mOsm/L (ideal)
  const mEq = o => o.mg * o.valence / o.MW;
  const dilute = o => o.C1 * o.V1 / o.C2;                                        // the final volume V2
  const alligation = o => ({ partsHigh: o.want - o.low, partsLow: o.high - o.want });

  /* ---------------------------------------------------------------- sterilisation */
  // F0: equivalent minutes at Tref (121.1 °C) with z (10 °C) from a temperature profile [[t min, T °C], …]
  function f0(profile, z, Tref) {
    z = z || 10; Tref = Tref || 121.1;
    let F = 0;
    for (let i = 1; i < profile.length; i++) {
      const [t0, T0] = profile[i - 1], [t1, T1] = profile[i];
      F += (t1 - t0) * (Math.pow(10, (T0 - Tref) / z) + Math.pow(10, (T1 - Tref) / z)) / 2;
    }
    return F;
  }
  const logReduction = (t, D) => t / D;
  const dAtT = o => o.D121 * Math.pow(10, (121.1 - o.T) / o.z);

  /* ---------------------------------------------------------------- pharmacokinetics */
  // two-compartment IV bolus: C1(t) = A e^(−αt) + B e^(−βt)
  function twoComp(o) {
    const s = o.k10 + o.k12 + o.k21, p = o.k10 * o.k21;
    const alpha = (s + Math.sqrt(s * s - 4 * p)) / 2, beta = (s - Math.sqrt(s * s - 4 * p)) / 2, C0 = o.dose / o.V1;
    const A = C0 * (alpha - o.k21) / (alpha - beta), B = C0 * (o.k21 - beta) / (alpha - beta);
    return { A, B, alpha, beta, at: t => A * Math.exp(-alpha * t) + B * Math.exp(-beta * t), auc: A / alpha + B / beta, halfBeta: Math.LN2 / beta };
  }
  // Michaelis–Menten elimination with repeated IV doses (e.g. phenytoin-like): returns [[t, C], …]
  function mmPK(o) {
    const out = []; let C = 0, t = 0;
    const dt = o.dt || 0.05, T = (o.n || 10) * o.tau;
    let next = 0;
    while (t <= T + 1e-9) {
      if (t >= next - 1e-9 && next < T - 1e-9) { C += o.dose / o.Vd; next += o.tau; }     // n doses: at 0, τ, … (n − 1)τ
      out.push([t, C]);
      const step = x => -o.Vmax * x / (o.Km + x) / o.Vd;
      const k1 = step(C), k2 = step(C + dt / 2 * k1), k3 = step(C + dt / 2 * k2), k4 = step(C + dt * k3);
      C = Math.max(0, C + dt / 6 * (k1 + 2 * k2 + 2 * k3 + k4)); t += dt;
    }
    return out;
  }
  // non-compartmental analysis: linear-up / log-down trapezoids; λz from the last three points (log-linear regression)
  // λz uses the last nz (default 3) positive samples after C_max; fewer than two such samples, or a slope that is not
  // falling, gives NaN for λz, t½ and AUC∞ rather than a number built on the absorption phase
  function nca(times, conc, nz) {
    let cmax = -Infinity, tmax = 0, imax = 0, auc = 0;
    for (let i = 0; i < times.length; i++) {
      if (conc[i] > cmax) { cmax = conc[i]; tmax = times[i]; imax = i; }
      if (!i) continue;
      const dt = times[i] - times[i - 1], c1 = conc[i - 1], c2 = conc[i];
      auc += c2 < c1 && c2 > 0 ? (c1 - c2) * dt / Math.log(c1 / c2) : dt * (c1 + c2) / 2;
    }
    const idx = []; for (let i = imax + 1; i < times.length; i++) if (conc[i] > 0) idx.push(i);
    const use = idx.slice(-(nz || 3)), n = use.length;
    let lambda = NaN;
    if (n >= 2) {
      const xs = use.map(i => times[i]), ys = use.map(i => Math.log(conc[i]));
      const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
      let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
      if (sxx > 0 && sxy < 0) lambda = -sxy / sxx;
    }
    return { cmax, tmax, auc, aucInf: auc + conc[conc.length - 1] / lambda, lambda, half: Math.LN2 / lambda, points: n };
  }
  // Student t quantile (two-sided 90 % CI -> one-sided 0.95) for df; exact table to 30, then normal-corrected
  const T95 = [NaN, 6.314, 2.920, 2.353, 2.132, 2.015, 1.943, 1.895, 1.860, 1.833, 1.812, 1.796, 1.782, 1.771, 1.761, 1.753, 1.746, 1.740, 1.734, 1.729, 1.725, 1.721, 1.717, 1.714, 1.711, 1.708, 1.706, 1.703, 1.701, 1.699, 1.697];
  const t95 = df => df <= 30 ? T95[Math.max(1, Math.round(df))] : 1.645 + 2.8 / df;
  // average bioequivalence from each subject's test and reference values (AUC or Cmax): 90 % CI of the geometric mean ratio.
  // With seq (each subject's sequence, e.g. 'TR' or 'RT') it is the 2×2 crossover analysis: the two sequence means of
  // ln(T/R) are averaged so the period effect cancels, and the variance is pooled within sequences (n − 2 df).
  // Without seq it is the paired analysis (n − 1 df), which assumes no period effect.
  function be(test, ref, seq) {
    const d = test.map((x, i) => Math.log(x) - Math.log(ref[i])), n = d.length;
    const mean = a => a.reduce((s, x) => s + x, 0) / a.length, ss = a => { const m = mean(a); return a.reduce((s, x) => s + (x - m) ** 2, 0); };
    let m, s2, se, df;
    const groups = seq ? [...new Set(seq.map(String))] : [];
    if (groups.length === 2) {
      const g = groups.map(k => d.filter((_, i) => String(seq[i]) === k));
      if (g.some(x => x.length < 2)) return be(test, ref);
      m = (mean(g[0]) + mean(g[1])) / 2; df = n - 2; s2 = (ss(g[0]) + ss(g[1])) / df;
      se = Math.sqrt(s2 / 4 * (1 / g[0].length + 1 / g[1].length));
    } else { m = mean(d); df = n - 1; s2 = ss(d) / df; se = Math.sqrt(s2 / n); }
    const t = t95(df), gmr = Math.exp(m), lo = Math.exp(m - t * se), hi = Math.exp(m + t * se);
    return { gmr, lo, hi, df, cv: Math.sqrt(Math.exp(s2 / 2) - 1), pass: lo >= 0.8 && hi <= 1.25 };
  }
  const occupancy = (C, Kd) => C / (C + Kd);
  const hill = (C, Emax, EC50, n) => Emax * Math.pow(C, n || 1) / (Math.pow(EC50, n || 1) + Math.pow(C, n || 1));
  const ti = (TD50, ED50) => TD50 / ED50;

  H.pharma = {
    R, ionised, solubility, logD, bufferCapacity, noyesWhitney, dissolve, release, f2,
    degrade, t90, arrhenius, shelfLife, carr, hausner, flowClass, heckel, stokes, hlbMix, fickFlux, aerodynamic,
    naclToAdd, fpdMethod, osmolarity, mEq, dilute, alligation, f0, logReduction, dAtT,
    twoComp, mmPK, nca, t95, be, occupancy, hill, ti
  };
})(typeof window !== 'undefined' ? window : globalThis);
