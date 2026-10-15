/* HYPER-CORE · water.js — the physics and the data of water, for Hyper Water (kit.water in simulations,
 * Hyper.water anywhere). Tested by tools/test-water.js.
 *
 *   const W = kit.water;
 *   W.density(T)              liquid water, kg/m³, T in °C (Kell 1975; good from −30 to 150 °C)
 *   W.densityIce(T)           ice Ih, kg/m³         W.densityD2O(T)  heavy water (a shifted-and-scaled model)
 *   W.TMAX                    3.98 °C, the temperature of maximum density      W.expansion(T)  volumetric, 1/K
 *   W.vapourPressure(T)       Pa over liquid water (IAPWS Wagner–Pruß, T in °C; extrapolated when supercooled)
 *   W.sublimationPressure(T)  Pa over ice (IAPWS 2011)         W.boilingPoint(p)  °C at pressure p Pa
 *   W.meltingPressure(T)      Pa on the ice Ih melting curve (T in K, 251.165–273.16)
 *   W.meltingPoint(p)         { T (K), ice } on the melting curve of Ih, III, V, VI or VII at pressure p (Pa)
 *   W.phaseAt(T, p)           'ice Ih' | 'liquid' | 'vapour' | 'supercritical' | 'ice VI' … for the phase diagram (T in K, p in Pa)
 *   W.ICE_BOUNDARIES          approximate solid–solid lines for drawing, [[T K, p MPa], …]
 *   W.surfaceTension(T)       N/m (IAPWS)     W.viscosity(T)  Pa·s (Vogel)     W.heatCapacity(T)  J/(kg·K)
 *   W.thermalConductivity(T)  W/(m·K)         W.dielectric(T)  εr (Malmberg–Maryott)   W.speedOfSound(T)  m/s
 *   W.compressibility(T)      1/Pa (isothermal)   W.bulkModulus(T)  Pa     W.pKw(T), W.Kw(T), W.pHneutral(T)
 *   W.latentVaporisation(T)   J/kg      W.LATENT_FUSION  W.LATENT_SUBLIMATION   W.ccSlope(T)  dp/dT Pa/K (Clausius–Clapeyron)
 *   W.henry(gas, T)           mol/(L·atm)   W.dissolvedOxygen(T, salinity)  mg/L from air at 1 atm
 *   W.freezingDepression(m, i)  W.boilingElevation(m, i)  K    W.osmoticPressure(M, i, T)  Pa (M in mol/L, T in K)
 *   W.laplace(r, σ)  W.jurin(r, θ, σ, ρ)  W.capillaryLength(T)  m
 *   W.dewPoint(T, RH)  W.absoluteHumidity(T, RH)  W.wetBulb(T, RH)  W.relativeHumidity(T, Td)
 *   W.hbondsPerMolecule(T)  W.hbondLifetime(T)  ps    W.HBOND  the numbers of the bond and the molecule
 *   W.molecules(massKg)       how many molecules      W.MOLECULES  water beside its look-alikes
 *   W.LIQUIDS  properties of common liquids   W.DH  deuterium-to-hydrogen ratios   W.WORLDS  water on other worlds
 *   W.EARTH  Earth's water inventory and fluxes   W.ANOMALIES  the anomalies   W.ICES  the phases of ice
 *   W.habitableZone(L)  W.snowLine(L)  AU for a star of luminosity L (Suns)
 * Temperatures are °C unless a function says K; the IAPWS curves take K as the standards write them.
 */
(function () {
  'use strict';
  const H = typeof Hyper !== 'undefined' ? Hyper : (window.Hyper = window.Hyper || {});
  const W = {};

  /* ---------------------------------------------------------------- constants */
  W.M = 18.015268;                 // g/mol
  W.NA = 6.02214076e23;
  W.R = 8.314462618;               // J/(mol·K)
  W.Rs = 461.52;                   // J/(kg·K), specific gas constant of water vapour
  W.TRIPLE = { T: 273.16, p: 611.657 };                       // K, Pa
  W.CRITICAL = { T: 647.096, p: 22.064e6, rho: 322 };         // K, Pa, kg/m³
  W.TMAX = 3.98;                   // °C, maximum density (computed below and checked by the tests)
  W.LATENT_FUSION = 333.55e3;      // J/kg at 0 °C
  W.LATENT_SUBLIMATION = 2834e3;   // J/kg at 0 °C
  W.Kf = 1.86;                     // K·kg/mol, cryoscopic constant
  W.Kb = 0.512;                    // K·kg/mol, ebullioscopic constant
  W.g = 9.80665;
  W.HBOND = {
    energy: 20e3,                  // J/mol, a typical O–H···O hydrogen bond in the liquid (18–25 kJ/mol)
    covalent: 463e3,               // J/mol, the O–H bond inside the molecule
    OO: 2.8e-10,                   // m, oxygen–oxygen distance of a hydrogen bond in the liquid
    OOice: 2.76e-10,               // m, in ice Ih
    OH: 0.9584e-10,                // m, the O–H bond length
    angle: 104.45,                 // °, H–O–H
    dipole: 1.855,                 // debye
    oscillation: 170e-15,          // s, the underdamped stretch of the bond (Fecko, Eaves et al. 2003)
    reorganisation: 1.2e-12,       // s, collective rearrangement of the network (same source)
    kT: 2.48e3                     // J/mol, thermal energy at 25 °C
  };

  const K = T => T + 273.15, C = T => T - 273.15;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  /* linear interpolation in a table [[x, y], …] sorted by x; clamps outside */
  function interp(tab, x) {
    if (x <= tab[0][0]) return tab[0][1];
    const n = tab.length - 1;
    if (x >= tab[n][0]) return tab[n][1];
    let i = 0;
    while (tab[i + 1][0] < x) i++;
    const [x0, y0] = tab[i], [x1, y1] = tab[i + 1];
    // monotone cubic (Fritsch–Carlson) would be nicer; a Catmull–Rom-ish smooth step is enough for curves
    const t = (x - x0) / (x1 - x0);
    const m0 = i > 0 ? (y1 - tab[i - 1][1]) / (x1 - tab[i - 1][0]) : (y1 - y0) / (x1 - x0);
    const m1 = i + 2 <= n ? (tab[i + 2][1] - y0) / (tab[i + 2][0] - x0) : (y1 - y0) / (x1 - x0);
    const h = x1 - x0, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * h * m0 + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * h * m1;
  }
  function bisect(f, a, b, iters) {
    let fa = f(a);
    const fb = f(b);
    if ((fa < 0) === (fb < 0)) return Math.abs(fa) <= Math.abs(fb) ? a : b;   // no sign change: the root sits on an end
    for (let i = 0; i < (iters || 80); i++) {
      const m = (a + b) / 2, fm = f(m);
      if (fm === 0) return m;
      if ((fm < 0) === (fa < 0)) { a = m; fa = fm; } else b = m;
    }
    return (a + b) / 2;
  }

  /* ---------------------------------------------------------------- density */
  /* Kell (1975), J. Chem. Eng. Data 20, 97: liquid water at 1 atm, 0–150 °C; it also follows the measured
     supercooled densities down to about −30 °C (983.9 kg/m³ at −30 °C). */
  W.density = function (T) {
    const t = clamp(T, -40, 150);
    return (999.83952 + 16.945176 * t - 7.9870401e-3 * t * t - 46.170461e-6 * t ** 3 + 105.56302e-9 * t ** 4 - 280.54253e-12 * t ** 5) / (1 + 16.879850e-3 * t);
  };
  /* ice Ih: 916.7 kg/m³ at 0 °C, a volumetric expansion of about 1.6e-4 /K */
  W.densityIce = T => 916.7 * (1 - 1.6e-4 * clamp(T, -273, 0));
  /* heavy water: maximum 1105.3 kg/m³ at 11.2 °C; modelled as the light-water curve shifted by 7.2 K and scaled
     (within 0.1 % below 60 °C, 0.6 % at 100 °C) */
  W.densityD2O = T => W.density(T - 7.2) * (1105.3 / 999.972);
  W.D2O = { mp: 3.82, bp: 101.42, Tmax: 11.2, rhoMax: 1105.3, rho25: 1104.4, M: 20.0276, viscosity25: 1.095e-3, pKw25: 14.87 };
  /* volumetric thermal expansion coefficient, 1/K (negative below 3.98 °C) */
  W.expansion = function (T) {
    const h = 0.05;
    return -(W.density(T + h) - W.density(T - h)) / (2 * h) / W.density(T);
  };
  (function () {   // the temperature of maximum density, found rather than typed
    let best = 0, bT = 0;
    for (let t = 2; t <= 6; t += 0.001) { const r = W.density(t); if (r > best) { best = r; bT = t; } }
    W.TMAX = Math.round(bT * 100) / 100;
    W.RHO_MAX = best;
  })();

  /* ---------------------------------------------------------------- vapour pressure and the curves of the phase diagram */
  /* Wagner & Pruß (IAPWS-95 auxiliary equation), triple point to critical point, T in °C */
  W.vapourPressure = function (T) {
    const Tk = clamp(K(T), 200, W.CRITICAL.T), Tc = W.CRITICAL.T, tau = 1 - Tk / Tc;
    const a = [-7.85951783, 1.84408259, -11.7866497, 22.6807411, -15.9618719, 1.80122502];
    const s = a[0] * tau + a[1] * tau ** 1.5 + a[2] * tau ** 3 + a[3] * tau ** 3.5 + a[4] * tau ** 4 + a[5] * tau ** 7.5;
    return W.CRITICAL.p * Math.exp(Tc / Tk * s);
  };
  /* IAPWS 2011 sublimation curve, 50–273.16 K, T in °C */
  W.sublimationPressure = function (T) {
    const th = clamp(K(T), 50, W.TRIPLE.T) / W.TRIPLE.T;
    const a = [-21.2144006, 27.3203819, -6.10598130], b = [0.00333333333, 1.20666667, 1.70333333];
    return W.TRIPLE.p * Math.exp((a[0] * th ** b[0] + a[1] * th ** b[1] + a[2] * th ** b[2]) / th);
  };
  /* the pressure of vapour in equilibrium with the stable condensed phase: ice below the triple point, water above */
  W.saturationPressure = T => T < 0.01 ? W.sublimationPressure(T) : W.vapourPressure(T);
  /* the temperature at which water boils (or sublimes) under pressure p (Pa) -> °C */
  W.boilingPoint = function (p) {
    p = clamp(p, 1e-3, W.CRITICAL.p);
    if (p < W.TRIPLE.p) return bisect(T => W.sublimationPressure(T) - p, -223, 0.01);
    return bisect(T => W.vapourPressure(T) - p, 0.01, C(W.CRITICAL.T));
  };
  /* IAPWS 2011 melting-pressure equations, T in K, p in Pa */
  const MELT = {
    Ih: { Tlo: 251.165, Thi: 273.16, f: T => { const th = T / 273.16; return 611.657 * (1 + 0.119539337e7 * (1 - th ** 3) + 0.808183159e5 * (1 - th ** 25.75) + 0.333826860e4 * (1 - th ** 103.75)); } },
    III: { Tlo: 251.165, Thi: 256.164, f: T => { const th = T / 251.165; return 208.566e6 * (1 - 0.299948 * (1 - th ** 60)); } },
    V: { Tlo: 256.164, Thi: 273.31, f: T => { const th = T / 256.164; return 350.1e6 * (1 - 1.18721 * (1 - th ** 8)); } },
    VI: { Tlo: 273.31, Thi: 355, f: T => { const th = T / 273.31; return 632.4e6 * (1 - 1.07476 * (1 - th ** 4.6)); } },
    VII: { Tlo: 355, Thi: 715, f: T => { const th = T / 355; return 2216e6 * Math.exp(0.173683e1 * (1 - 1 / th) - 0.544606e-1 * (1 - th ** 5) + 0.806106e-7 * (1 - th ** 22)); } }
  };
  W.MELT = MELT;
  W.meltingPressure = T => MELT.Ih.f(clamp(T, MELT.Ih.Tlo, MELT.Ih.Thi));
  /* the melting temperature at pressure p (Pa): which ice melts there and at what T (K) */
  W.meltingPoint = function (p) {
    p = clamp(p, 0, 2e11);
    if (p <= MELT.Ih.f(MELT.Ih.Tlo)) return { T: p < W.TRIPLE.p ? NaN : bisect(T => MELT.Ih.f(T) - p, MELT.Ih.Tlo, MELT.Ih.Thi), ice: 'Ih' };
    for (const id of ['III', 'V', 'VI', 'VII']) {
      const m = MELT[id];
      if (p <= m.f(m.Thi) * (1 + 1e-9)) return { T: bisect(T => m.f(T) - p, m.Tlo, m.Thi), ice: id };
    }
    // beyond the IAPWS range of ice VII (715 K, about 20.6 GPa) the equation turns over: continue with a Simon-type law
    // anchored there, T ∝ p^0.5, which passes near 1,000 K at 40 GPa as the diamond-anvil measurements do
    const pTop = MELT.VII.f(715);
    return { T: 715 * Math.sqrt(p / pTop), ice: 'VII' };
  };
  /* The phase at (T K, p Pa). Solid–solid lines are the approximate segments below. */
  W.ICE_BOUNDARIES = [
    { a: 'Ih', b: 'XI', pts: [[72, 0], [72, 200]] },
    { a: 'Ih', b: 'II', pts: [[238.5, 212.9], [120, 270]] },
    { a: 'Ih', b: 'III', pts: [[238.5, 212.9], [251.165, 208.566]] },
    { a: 'II', b: 'III', pts: [[238.5, 212.9], [248.85, 344.3]] },
    { a: 'III', b: 'IX', pts: [[165, 344], [165, 213]] },
    { a: 'III', b: 'V', pts: [[248.85, 344.3], [256.164, 350.1]] },
    { a: 'II', b: 'V', pts: [[248.85, 344.3], [218, 620]] },
    { a: 'V', b: 'XIII', pts: [[110, 350], [110, 620]] },
    { a: 'V', b: 'VI', pts: [[218, 620], [273.31, 632.4]] },
    { a: 'II', b: 'VI', pts: [[218, 620], [120, 760]] },
    { a: 'VI', b: 'XV', pts: [[130, 700], [130, 1500]] },
    { a: 'XV', b: 'XIX', pts: [[100, 1500], [100, 2100]] },
    { a: 'VI', b: 'VIII', pts: [[278, 2100], [130, 1500]] },
    { a: 'VI', b: 'VII', pts: [[278, 2100], [355, 2216]] },
    { a: 'VII', b: 'VIII', pts: [[278, 2100], [273, 20000], [240, 60000]] },
    { a: 'VII', b: 'X', pts: [[240, 60000], [300, 62000], [1000, 100000]] }
  ];
  W.phaseAt = function (T, p) {
    const MPa = p / 1e6;
    if (T >= W.CRITICAL.T) { const mm = W.meltingPoint(p); if (!(T < mm.T)) return p >= W.CRITICAL.p ? 'supercritical' : 'vapour'; }   // hot ice VII and X sit above the critical temperature
    if (T < W.TRIPLE.T) {
      if (p < W.sublimationPressure(C(T))) return 'vapour';
    } else if (p < W.vapourPressure(C(T))) return 'vapour';
    const m = W.meltingPoint(p);
    if (!Number.isNaN(m.T) && T > m.T) return 'liquid';
    if (p < W.TRIPLE.p) return 'ice Ih';
    // solid: which ice. Ordered by pressure, with the low-temperature ordered phases
    if (MPa < 209) return T < 72 ? 'ice XI' : 'ice Ih';
    if (MPa < 213 && T > 238.5) return 'ice Ih';
    if (MPa < 345) { if (T > 238.5 + (MPa - 212.9) / (344.3 - 212.9) * (248.85 - 238.5)) return T < 165 ? 'ice IX' : 'ice III'; return 'ice II'; }
    if (MPa < 630) { if (T > 248.85 - (MPa - 344.3) / (620 - 344.3) * (248.85 - 218)) return T < 110 ? 'ice XIII' : 'ice V'; return 'ice II'; }
    if (MPa < 2100) { if (T < 100 && MPa > 1500) return 'ice XIX'; if (T < 130) return 'ice XV'; if (T < 218 - (MPa - 620) / 140 * 98 && MPa < 760) return 'ice II'; return 'ice VI'; }
    if (MPa < 60000) return T < 273 ? 'ice VIII' : 'ice VII';
    return 'ice X';
  };

  /* ---------------------------------------------------------------- transport and thermal properties, T in °C */
  /* IAPWS 2014: σ = B τ^μ (1 + b τ), τ = 1 − T/Tc */
  W.surfaceTension = function (T) {
    const tau = 1 - clamp(K(T), 230, W.CRITICAL.T) / W.CRITICAL.T;
    return 235.8e-3 * tau ** 1.256 * (1 - 0.625 * tau);
  };
  /* Vogel equation, Pa·s (1.002 mPa·s at 20 °C, 0.282 at 100 °C); extrapolated below 0 °C */
  W.viscosity = T => 0.02939e-3 * Math.exp(507.88 / (clamp(K(T), 200, 400) - 149.3));
  W.kinematicViscosity = T => W.viscosity(T) / W.density(T);
  const CP = [[-30, 5050], [-25, 4780], [-20, 4570], [-15, 4420], [-10, 4320], [-5, 4260], [0, 4217.4], [5, 4201.6], [10, 4192.1], [15, 4185.4], [20, 4181.8], [25, 4179.6], [30, 4178.4], [35, 4178.2], [40, 4178.5], [45, 4179.4], [50, 4180.6], [55, 4182.5], [60, 4184.3], [65, 4186.8], [70, 4189.5], [75, 4192.8], [80, 4196.3], [85, 4200.4], [90, 4205.0], [95, 4210.1], [100, 4215.9]];
  W.heatCapacity = T => interp(CP, T);             // J/(kg·K) at 1 atm; supercooled values approximate
  W.heatCapacityIce = T => 2050 + 7.5 * clamp(T, -100, 0);   // about 2.05 kJ/(kg·K) at 0 °C, falling when colder
  W.heatCapacitySteam = 2010;                      // J/(kg·K) near 100 °C
  const KT = [[-20, 0.515], [-10, 0.537], [0, 0.5562], [10, 0.5786], [20, 0.5985], [25, 0.6071], [30, 0.6154], [40, 0.6306], [50, 0.6435], [60, 0.6543], [70, 0.6631], [80, 0.6700], [90, 0.6753], [100, 0.6791]];
  W.thermalConductivity = T => interp(KT, T);
  W.thermalConductivityIce = 2.2;                  // W/(m·K) near 0 °C
  /* Malmberg & Maryott (1956), 0–100 °C */
  W.dielectric = T => { const t = clamp(T, -40, 100); return 87.740 - 0.40008 * t + 9.398e-4 * t * t - 1.410e-6 * t ** 3; };
  /* Bilaniuk & Wong (1993), 5th order, 0–100 °C, m/s */
  W.speedOfSound = T => { const t = clamp(T, -20, 100); return 1402.385 + 5.038813 * t - 5.799136e-2 * t * t + 3.287156e-4 * t ** 3 - 1.398845e-6 * t ** 4 + 2.787860e-9 * t ** 5; };
  const KAPPA = [[-30, 9.5], [-20, 7.0], [-10, 5.85], [0, 5.09], [10, 4.78], [20, 4.59], [25, 4.52], [30, 4.48], [40, 4.42], [46, 4.41], [50, 4.41], [60, 4.44], [70, 4.50], [80, 4.58], [90, 4.68], [100, 4.80]];
  W.compressibility = T => interp(KAPPA, T) * 1e-10;      // isothermal, 1/Pa; minimum near 46 °C
  W.bulkModulus = T => 1 / W.compressibility(T);
  const PKW = [[0, 14.94], [10, 14.53], [20, 14.17], [25, 13.995], [30, 13.83], [40, 13.53], [50, 13.26], [60, 13.02], [75, 12.70], [100, 12.26]];
  W.pKw = T => interp(PKW, T);
  W.Kw = T => Math.pow(10, -W.pKw(T));
  W.pHneutral = T => W.pKw(T) / 2;
  /* S/m: the ions of water's own dissociation (H⁺ 349.8, OH⁻ 198.6 S·cm²/mol at 25 °C) at √Kw, their mobility following the
     viscosity partly (Grotthuss hopping is less hindered): 0.055 µS/cm at 25 °C (18.2 MΩ·cm), 0.011 at 0 °C, 0.9 at 100 °C */
  W.conductivityPure = T => 0.05484 * Math.pow(W.viscosity(25) / W.viscosity(T), 0.7) * Math.sqrt(W.Kw(T)) * 1000;
  /* latent heat of vaporisation, J/kg (2501 kJ/kg at 0 °C, 2257 at 100 °C, 0 at the critical point) */
  W.latentVaporisation = function (T) {
    const t = clamp(T, -40, C(W.CRITICAL.T));
    if (t <= 100) return (2501 - 2.42 * t) * 1e3;
    const tau = 1 - K(t) / W.CRITICAL.T, tau100 = 1 - 373.15 / W.CRITICAL.T;
    return 2259e3 * Math.pow(tau / tau100, 0.36);   // Watson-type scaling, within 2 % of the steam tables to 350 °C
  };
  /* Clausius–Clapeyron: the slope of the vapour-pressure curve, Pa/K, T in °C */
  W.ccSlope = T => W.latentVaporisation(T) * W.vapourPressure(T) / (W.Rs * K(T) * K(T));
  /* heat to take m kg of ice at T1 to steam at T2 (or anywhere between): J, states by temperature at 1 atm */
  W.heatToWarm = function (m, T1, T2) {
    let Q = 0, a = Math.min(T1, T2), b = Math.max(T1, T2);
    const seg = (lo, hi, cp) => { const l = Math.max(a, lo), h = Math.min(b, hi); if (h > l) Q += m * cp * (h - l); };
    seg(-273, 0, 2050); seg(0, 100, 4190); seg(100, 2000, 2010);
    if (a < 0 && b > 0) Q += m * W.LATENT_FUSION;
    if (a < 100 && b > 100) Q += m * (2257e3);
    return T2 >= T1 ? Q : -Q;
  };

  /* ---------------------------------------------------------------- solutions */
  const HENRY = { O2: [1.3e-3, 1700], N2: [6.5e-4, 1300], CO2: [3.4e-2, 2400], He: [3.8e-4, 230], Ne: [4.5e-4, 490], Ar: [1.4e-3, 1500], H2: [7.8e-4, 500], CH4: [1.4e-3, 1900], NH3: [61, 4200], SO2: [1.4, 2900], H2S: [0.1, 2100], Cl2: [0.09, 2000] };
  W.HENRY = HENRY;
  /* Henry's law solubility constant mol/(L·atm) at T °C (Sander 2015 values at 25 °C with van 't Hoff temperature dependence) */
  W.henry = function (gas, T) {
    const h = HENRY[gas]; if (!h) return NaN;
    return h[0] * Math.exp(h[1] * (1 / K(T) - 1 / 298.15));
  };
  /* dissolved oxygen in water in equilibrium with air at 1 atm, mg/L; salinity in g/kg lowers it (about 18 % at 35 g/kg) */
  W.dissolvedOxygen = function (T, salinity) {
    const pO2 = 0.20946 * (1 - W.vapourPressure(T) / 101325);
    return 0.98 * W.henry('O2', T) * pO2 * 31.998 * 1e3 * (1 - 0.0051 * (salinity || 0));   // 0.98: the van 't Hoff fit runs a little high against the Benson–Krause tables
  };
  W.freezingDepression = (m, i) => W.Kf * (i == null ? 1 : i) * m;
  W.boilingElevation = (m, i) => W.Kb * (i == null ? 1 : i) * m;
  W.osmoticPressure = (M, i, T) => (i == null ? 1 : i) * M * 1e3 * W.R * (T == null ? 298.15 : T);
  W.SEAWATER = { salinity: 35, density: 1025, freezing: -1.9, osmotic: 2.7e6, ions: [['Cl⁻', 19.35], ['Na⁺', 10.78], ['SO₄²⁻', 2.71], ['Mg²⁺', 1.28], ['Ca²⁺', 0.41], ['K⁺', 0.40], ['HCO₃⁻', 0.11], ['Br⁻', 0.067], ['Sr²⁺', 0.008], ['B(OH)₃', 0.02], ['F⁻', 0.0013]] };   // g/kg
  /* density of a NaCl solution, kg/m³ (S in g/kg, T °C; a fit good to a few kg/m³ up to sea-water strengths and beyond) */
  W.densityBrine = (S, T) => W.density(T) + (0.805 - 0.0022 * T) * S;   // 1028 at 0 °C and 35 g/kg, 1023 at 25 °C

  /* ---------------------------------------------------------------- surfaces */
  W.laplace = (r, sigma) => 2 * (sigma == null ? W.surfaceTension(20) : sigma) / r;      // Pa inside a drop of radius r
  W.laplaceBubble = (r, sigma) => 4 * (sigma == null ? W.surfaceTension(20) : sigma) / r;  // a soap bubble has two surfaces
  W.jurin = (r, thetaDeg, sigma, rho) => 2 * (sigma == null ? W.surfaceTension(20) : sigma) * Math.cos((thetaDeg || 0) * Math.PI / 180) / ((rho == null ? 998.2 : rho) * W.g * r);   // m
  W.capillaryLength = T => Math.sqrt(W.surfaceTension(T == null ? 20 : T) / (W.density(T == null ? 20 : T) * W.g));   // 2.7 mm
  W.bondNumber = (L, T) => (L / W.capillaryLength(T)) ** 2;
  W.youngContact = (sg, sl, lg) => Math.acos(clamp((sg - sl) / lg, -1, 1)) * 180 / Math.PI;   // contact angle from the three tensions

  /* ---------------------------------------------------------------- humidity */
  W.relativeHumidity = (T, Td) => clamp(W.vapourPressure(Td) / W.vapourPressure(T), 0, 1);
  W.dewPoint = function (T, RH) { const p = clamp(RH, 1e-6, 1) * W.vapourPressure(T); return W.boilingPoint(p); };
  W.absoluteHumidity = (T, RH) => clamp(RH, 0, 1) * W.vapourPressure(T) / (W.Rs * K(T));            // kg/m³
  W.mixingRatio = (T, RH, p) => { const e = clamp(RH, 0, 1) * W.vapourPressure(T), P = p == null ? 101325 : p; return 0.622 * e / (P - e); };   // kg/kg
  /* Stull (2011) wet-bulb temperature at 1 atm, T °C, RH as a fraction */
  W.wetBulb = function (T, RH) {
    const rh = clamp(RH, 0.05, 0.99) * 100, at = Math.atan;
    return T * at(0.151977 * Math.sqrt(rh + 8.313659)) + at(T + rh) - at(rh - 1.676331) + 0.00391838 * Math.pow(rh, 1.5) * at(0.023101 * rh) - 4.686035;
  };
  /* saturation vapour over a droplet of radius r (Kelvin equation): ratio to the flat-surface value */
  W.kelvinRatio = (r, T) => Math.exp(2 * W.surfaceTension(T) * W.M * 1e-3 / (W.density(T) * W.R * K(T) * r));

  /* ---------------------------------------------------------------- the network */
  /* an estimate of intact hydrogen bonds per molecule in the liquid (about 3.7 at 25 °C, 3.1 at 100 °C) */
  W.hbondsPerMolecule = T => clamp(3.9 - 0.0083 * T, 2, 4);
  /* the lifetime of a bond before the network rearranges, s (1.2 ps at 25 °C, Arrhenius with 10 kJ/mol) */
  W.hbondLifetime = T => 1.2e-12 * Math.exp(10e3 / W.R * (1 / K(T) - 1 / 298.15));
  /* the fraction of molecules present as H₃O⁺ (or OH⁻) in pure water at T °C */
  W.ionFraction = T => Math.sqrt(W.Kw(T)) / 55.5;
  W.selfDiffusion = T => 2.3e-9 * Math.exp(-2200 * (1 / K(T) - 1 / 298.15));                   // m²/s, 2.3e-9 at 25 °C
  W.molecules = massKg => massKg * 1e3 / W.M * W.NA;
  W.moleculesPerLitre = T => W.molecules(W.density(T == null ? 25 : T) * 1e-3);
  W.molarVolume = T => W.M / W.density(T == null ? 25 : T) * 1e3;                                 // cm³/mol (18.07 at 25 °C)
  W.meanSpeed = T => Math.sqrt(8 * W.R * K(T) / (Math.PI * W.M * 1e-3));                          // m/s, as a gas

  /* ---------------------------------------------------------------- water beside its look-alikes */
  W.MOLECULES = [
    { id: 'CH4', name: 'Methane', tex: '\\ce{CH4}', mass: 16.04, mp: -182.5, bp: -161.5, dipole: 0, shape: 'tetrahedral', donors: 0, acceptors: 0, note: 'Symmetric: the four C–H dipoles cancel. No hydrogen bonds at all.' },
    { id: 'NH3', name: 'Ammonia', tex: '\\ce{NH3}', mass: 17.03, mp: -77.7, bp: -33.3, dipole: 1.47, shape: 'trigonal pyramidal', donors: 3, acceptors: 1, note: 'Three hydrogens but one lone pair: on average one good hydrogen bond per molecule.' },
    { id: 'H2O', name: 'Water', tex: '\\ce{H2O}', mass: 18.02, mp: 0.0, bp: 100.0, dipole: 1.85, shape: 'bent (104.5°)', donors: 2, acceptors: 2, note: 'Two hydrogens and two lone pairs: four bonds, a three-dimensional network.' },
    { id: 'HF', name: 'Hydrogen fluoride', tex: '\\ce{HF}', mass: 20.01, mp: -83.6, bp: 19.5, dipole: 1.83, shape: 'linear', donors: 1, acceptors: 3, note: 'Very strong hydrogen bonds, but one hydrogen: chains and rings, not a net.' },
    { id: 'Ne', name: 'Neon', tex: '\\ce{Ne}', mass: 20.18, mp: -248.6, bp: -246.1, dipole: 0, shape: 'atom', donors: 0, acceptors: 0, note: 'The same mass with no bonds of any kind: what water would be without its dipole.' },
    { id: 'H2S', name: 'Hydrogen sulfide', tex: '\\ce{H2S}', mass: 34.08, mp: -85.5, bp: -60.3, dipole: 0.97, shape: 'bent (92°)', donors: 2, acceptors: 2, note: 'Water\'s heavier cousin: sulfur is too large and too weakly electronegative for strong hydrogen bonds.' },
    { id: 'H2Se', name: 'Hydrogen selenide', tex: '\\ce{H2Se}', mass: 80.98, mp: -65.7, bp: -41.3, dipole: 0.62, shape: 'bent (91°)', donors: 2, acceptors: 2, note: 'Boils higher than H₂S only because it is heavier.' },
    { id: 'H2Te', name: 'Hydrogen telluride', tex: '\\ce{H2Te}', mass: 129.6, mp: -49, bp: -2.2, dipole: 0.2, shape: 'bent (90°)', donors: 2, acceptors: 2, note: 'The bottom of the ladder; extrapolating the trend upwards puts water at about −80 °C.' },
    { id: 'CH3OH', name: 'Methanol', tex: '\\ce{CH3OH}', mass: 32.04, mp: -97.6, bp: 64.7, dipole: 1.70, shape: 'bent at O', donors: 1, acceptors: 2, note: 'One O–H: chains of hydrogen bonds, a liquid, but no three-dimensional net.' },
    { id: 'CO2', name: 'Carbon dioxide', tex: '\\ce{CO2}', mass: 44.01, mp: -56.6, bp: -78.5, dipole: 0, shape: 'linear', donors: 0, acceptors: 2, note: 'Linear and symmetric: no dipole, a gas; it sublimes at 1 atm.' }
  ];
  W.ladderExpected = -80;    // °C, water's boiling point by the trend of H₂Te → H₂Se → H₂S

  /* properties of liquids near 20–25 °C: cp J/(kg·K), sigma mN/m, eta mPa·s, eps, k W/(m·K), Lv kJ/kg, rho kg/m³, bp °C */
  W.LIQUIDS = [
    { id: 'water', name: 'Water', cp: 4182, sigma: 72.8, eta: 1.00, eps: 78.4, k: 0.60, Lv: 2257, rho: 998, bp: 100 },
    { id: 'ethanol', name: 'Ethanol', cp: 2440, sigma: 22.1, eta: 1.07, eps: 24.5, k: 0.17, Lv: 841, rho: 789, bp: 78.4 },
    { id: 'methanol', name: 'Methanol', cp: 2530, sigma: 22.5, eta: 0.54, eps: 32.7, k: 0.20, Lv: 1100, rho: 792, bp: 64.7 },
    { id: 'acetone', name: 'Acetone', cp: 2170, sigma: 23.5, eta: 0.31, eps: 20.7, k: 0.16, Lv: 518, rho: 784, bp: 56 },
    { id: 'hexane', name: 'Hexane', cp: 2260, sigma: 18.4, eta: 0.30, eps: 1.89, k: 0.12, Lv: 335, rho: 655, bp: 69 },
    { id: 'benzene', name: 'Benzene', cp: 1740, sigma: 28.9, eta: 0.60, eps: 2.3, k: 0.14, Lv: 394, rho: 877, bp: 80 },
    { id: 'glycerol', name: 'Glycerol', cp: 2430, sigma: 63, eta: 1412, eps: 42.5, k: 0.29, Lv: 974, rho: 1261, bp: 290 },
    { id: 'oil', name: 'Olive oil', cp: 1970, sigma: 32, eta: 84, eps: 3.1, k: 0.17, Lv: NaN, rho: 915, bp: NaN },
    { id: 'mercury', name: 'Mercury', cp: 140, sigma: 486, eta: 1.53, eps: NaN, k: 8.3, Lv: 295, rho: 13534, bp: 357 },
    { id: 'ammonia', name: 'Ammonia (liquid, −33 °C)', cp: 4700, sigma: 23, eta: 0.26, eps: 22, k: 0.5, Lv: 1370, rho: 682, bp: -33.3 }
  ];
  W.SOLIDS_CP = [['Water', 4182], ['Ice', 2050], ['Ethanol', 2440], ['Concrete', 880], ['Glass', 840], ['Aluminium', 897], ['Iron', 449], ['Copper', 385], ['Lead', 129], ['Granite', 790], ['Dry sand', 830], ['Wood', 1700], ['Air', 1005]];

  /* ---------------------------------------------------------------- isotopes: the deuterium clock */
  /* D/H ratios. kind: standard · planet · giant · oort (Oort-cloud comet) · jfc (Jupiter-family comet) · meteorite · moon · ism */
  W.VSMOW = 1.5576e-4;
  W.DH = [
    { id: 'vsmow', name: 'Earth\'s oceans (VSMOW)', dh: 1.5576e-4, kind: 'standard', src: 'IAEA reference water' },
    { id: 'protosolar', name: 'Protosolar nebula', dh: 2.1e-5, kind: 'giant', src: 'from the solar wind and Jupiter' },
    { id: 'jupiter', name: 'Jupiter (H₂)', dh: 2.25e-5, kind: 'giant', src: 'Galileo probe, ISO' },
    { id: 'saturn', name: 'Saturn (H₂)', dh: 1.7e-5, kind: 'giant', src: 'Cassini CIRS' },
    { id: 'uranus', name: 'Uranus (H₂)', dh: 4.4e-5, kind: 'giant', src: 'Herschel' },
    { id: 'neptune', name: 'Neptune (H₂)', dh: 4.1e-5, kind: 'giant', src: 'Herschel' },
    { id: 'venus', name: 'Venus atmosphere', dh: 1.6e-2, kind: 'planet', src: 'Pioneer Venus; about 100× Earth' },
    { id: 'mars', name: 'Mars atmosphere', dh: 8e-4, kind: 'planet', src: 'Curiosity; about 5× Earth' },
    { id: 'moon', name: 'Moon (apatite in basalts)', dh: 1.5e-4, kind: 'moon', src: 'Saal et al. 2013' },
    { id: 'enceladus', name: 'Enceladus plume', dh: 2.9e-4, kind: 'moon', src: 'Cassini INMS, Waite et al. 2009' },
    { id: 'halley', name: '1P/Halley', dh: 3.16e-4, kind: 'oort', src: 'Giotto 1986' },
    { id: 'hyakutake', name: 'C/1996 B2 Hyakutake', dh: 2.9e-4, kind: 'oort', src: '1996' },
    { id: 'halebopp', name: 'C/1995 O1 Hale–Bopp', dh: 3.3e-4, kind: 'oort', src: '1997' },
    { id: 'tuttle', name: '8P/Tuttle', dh: 4.1e-4, kind: 'oort', src: '2008' },
    { id: 'hartley', name: '103P/Hartley 2', dh: 1.61e-4, kind: 'jfc', src: 'Herschel 2011 — Earth-like' },
    { id: '67p', name: '67P/Churyumov–Gerasimenko', dh: 5.3e-4, kind: 'jfc', src: 'Rosetta ROSINA 2014 — 3.4× Earth' },
    { id: 'wirtanen', name: '46P/Wirtanen', dh: 1.6e-4, kind: 'jfc', src: 'SOFIA 2019' },
    { id: 'cc', name: 'Carbonaceous chondrites (CI, CM)', dh: 1.4e-4, kind: 'meteorite', src: 'bulk, near Earth\'s value' },
    { id: 'ec', name: 'Enstatite chondrites', dh: 1.3e-4, kind: 'meteorite', src: 'Piani et al. 2020' },
    { id: 'ism', name: 'Water in protostellar cores', dh: 3e-3, kind: 'ism', src: 'HDO/H₂O in hot corinos, 1e-3–1e-2' }
  ];

  /* ---------------------------------------------------------------- water on other worlds (km³ of H₂O as ice and liquid; estimates) */
  W.WORLDS = [
    { id: 'earth', name: 'Earth (oceans)', km3: 1.335e9, ocean: 1.335e9, depth: 3.7, note: 'Oceans only; the mantle may hold one to three oceans more, bound in minerals.', src: 'USGS' },
    { id: 'europa', name: 'Europa', km3: 3.0e9, ocean: 3.0e9, depth: 100, note: 'A 60–150 km layer of ice and water over rock; most of it liquid: two to three times Earth\'s oceans.', src: 'Galileo gravity and magnetometer' },
    { id: 'ganymede', name: 'Ganymede', km3: 7e10, ocean: 2.5e10, depth: 800, note: 'Half ice by mass, about 800 km deep; a salty ocean sandwiched between ice layers.', src: 'Galileo, Hubble aurorae 2015' },
    { id: 'callisto', name: 'Callisto', km3: 5e10, ocean: 1e10, depth: 300, note: 'An ocean likely under 100–200 km of ice, from its induced magnetic field.', src: 'Galileo' },
    { id: 'titan', name: 'Titan', km3: 6.5e10, ocean: 2e10, depth: 500, note: 'Water ice crust over a water–ammonia ocean; methane and ethane lakes on top.', src: 'Cassini gravity and tides' },
    { id: 'enceladus', name: 'Enceladus', km3: 4e7, ocean: 2.4e7, depth: 50, note: 'A global ocean 20–40 km deep under 5–30 km of ice, venting from the south pole.', src: 'Cassini' },
    { id: 'triton', name: 'Triton', km3: 6e9, ocean: NaN, depth: NaN, note: 'Mostly ice with a rocky core; a subsurface ocean is possible but not shown.', src: 'Voyager 2' },
    { id: 'pluto', name: 'Pluto', km3: 4e9, ocean: NaN, depth: NaN, note: 'An ice shell; Sputnik Planitia hints at a liquid layer beneath.', src: 'New Horizons' },
    { id: 'ceres', name: 'Ceres', km3: 2e8, ocean: NaN, depth: NaN, note: 'A quarter water by mass; brines beneath the crust feed the bright spots.', src: 'Dawn' },
    { id: 'mars', name: 'Mars (ice today)', km3: 5e6, ocean: NaN, depth: NaN, note: 'Polar caps and ground ice; once an ocean a few hundred metres deep over the north.', src: 'MRO, Mars Express' },
    { id: 'moon', name: 'Moon (polar ice)', km3: 1, ocean: NaN, depth: NaN, note: 'Ice in permanently shadowed craters, perhaps a cubic kilometre in all.', src: 'LCROSS, M3' },
    { id: 'comet67p', name: 'Comet 67P', km3: 10, ocean: NaN, depth: NaN, note: 'A 4 km nucleus, about one-fifth water ice.', src: 'Rosetta' },
    { id: 'quasar', name: 'APM 08279+5255 (quasar vapour)', km3: 1.9e23, ocean: NaN, depth: NaN, note: '140 trillion Earth oceans of water vapour around a quasar 12 billion light-years away.', src: 'Bradford et al. 2011; Lis et al. 2011' }
  ];

  /* ---------------------------------------------------------------- Earth's water */
  W.EARTH = {
    totalWater: 1.386e9,            // km³ (USGS / Gleick)
    oceans: 1.338e9, oceanMass: 1.37e21, oceanArea: 3.61e14, oceanMeanDepth: 3688,
    icecaps: 2.406e7, groundwater: 2.34e7, groundwaterFresh: 1.053e7, permafrost: 3.0e5, lakes: 1.764e5, lakesFresh: 9.1e4,
    soil: 1.65e4, atmosphere: 1.29e4, swamps: 1.147e4, rivers: 2120, biological: 1120,
    fresh: 3.5e7,                   // 2.5 % of the total
    flux: { oceanEvap: 413e3, oceanPrecip: 373e3, landEvap: 73e3, landPrecip: 113e3, runoff: 40e3 },   // km³/yr
    residence: { atmosphere: 9 / 365, rivers: 0.05, soil: 0.2, lakes: 17, groundwater: 1400, oceans: 3200, icecaps: 10000 },  // years
    atmosphereMass: 5.15e18, cpAir: 1005, cpSeawater: 3990, rhoSeawater: 1025, earthMass: 5.972e24,
    heatUptake: 1.4e22               // J/yr, the ocean's share of the Earth's energy imbalance (≈ 0.9 W/m² over the ocean, IPCC AR6)
  };
  /* the depth of ocean whose heat capacity equals the whole atmosphere's: about 3.5 m */
  W.oceanLayerEqualToAtmosphere = () => W.EARTH.atmosphereMass * W.EARTH.cpAir / (W.EARTH.cpSeawater * W.EARTH.rhoSeawater * W.EARTH.oceanArea);
  W.oceanFractionOfEarth = () => W.EARTH.oceanMass / W.EARTH.earthMass;

  /* ---------------------------------------------------------------- the anomalies */
  W.ANOMALIES = [
    { id: 'density-max', name: 'Maximum density at 3.98 °C', normal: 'A liquid gets denser as it cools, all the way to freezing.', water: 'Water is densest at 3.98 °C and expands on cooling below it.', value: '999.97 kg/m³ at 3.98 °C; 999.84 at 0 °C', why: 'Below 4 °C the open, ice-like tetrahedral patches win over thermal shrinking.', prop: 'density' },
    { id: 'ice-floats', name: 'The solid floats', normal: 'A solid is denser than its melt and sinks in it.', water: 'Ice is 8.3 % less dense than water at 0 °C.', value: '916.7 vs 999.84 kg/m³', why: 'The ice lattice holds every molecule at four neighbours in an open hexagonal net.', prop: 'density' },
    { id: 'negative-slope', name: 'Melting point falls under pressure', normal: 'Pressure raises a melting point (the solid is denser).', water: 'Pressure lowers it: −0.0074 K per bar, down to −22 °C at 2,100 bar.', value: 'Ice Ih melts at 251.2 K at 209 MPa', why: 'Squeezing favours the denser phase — here the liquid.', prop: 'melting' },
    { id: 'bp', name: 'Boiling point', normal: 'By the trend of H₂Te, H₂Se and H₂S water would boil at about −80 °C.', water: 'It boils at 100 °C.', value: '180 K higher than expected', why: 'Four hydrogen bonds per molecule must be loosened to free it.', prop: 'vapour' },
    { id: 'mp', name: 'Melting point', normal: 'By the same trend ice would melt at about −100 °C.', water: 'It melts at 0 °C.', value: '100 K higher than expected', why: 'The same bonds hold the lattice.', prop: 'melting' },
    { id: 'cp', name: 'Highest heat capacity of common liquids', normal: 'Roughly 2 kJ/(kg·K) for organic liquids.', water: '4.18 kJ/(kg·K); only liquid ammonia comes near.', value: '4182 J/(kg·K) at 25 °C', why: 'Heat goes into bending and breaking hydrogen bonds, not only into motion.', prop: 'cp' },
    { id: 'cp-min', name: 'Heat capacity has a minimum', normal: 'Heat capacity rises slowly with temperature.', water: 'It falls to a minimum near 35 °C, then rises — and soars when supercooled.', value: 'min 4178 J/(kg·K) at 35 °C; about 5000 at −30 °C', why: 'Two kinds of structure trade places: open and dense.', prop: 'cp' },
    { id: 'kappa-min', name: 'Compressibility has a minimum', normal: 'A liquid becomes harder to squeeze as it cools.', water: 'Water is hardest to squeeze at 46 °C and becomes easier to compress on cooling below it.', value: '4.41e-10 /Pa at 46 °C; 5.09e-10 at 0 °C', why: 'Open tetrahedral patches collapse under pressure.', prop: 'kappa' },
    { id: 'visc-pressure', name: 'Viscosity falls under pressure', normal: 'Squeezing a liquid makes it flow more slowly.', water: 'Below about 33 °C, moderate pressure makes water flow more easily.', value: 'about −8 % at 1,000 bar and 0 °C', why: 'Pressure breaks the network that holds the molecules back.', prop: 'viscosity' },
    { id: 'sound-max', name: 'Speed of sound has a maximum', normal: 'The speed of sound in a liquid falls with temperature.', water: 'It rises to a maximum of 1,555 m/s at 74 °C before falling.', value: '1,402 m/s at 0 °C, 1,555 at 74 °C', why: 'Density and compressibility both pass through extremes.', prop: 'sound' },
    { id: 'expansion', name: 'Negative thermal expansion', normal: 'Everything expands when warmed.', water: 'Between 0 and 3.98 °C water shrinks when warmed.', value: 'α = −6.8e-5 /K at 0 °C', why: 'The same cause as the density maximum.', prop: 'expansion' },
    { id: 'sigma', name: 'Highest surface tension of ordinary liquids', normal: '20–30 mN/m for organic liquids.', water: '72.8 mN/m; only liquid metals are higher.', value: '72.8 mN/m at 20 °C', why: 'A molecule at the surface loses hydrogen bonds it would have had in the bulk.', prop: 'sigma' },
    { id: 'eps', name: 'Very high dielectric constant', normal: 'Two to thirty for most liquids.', water: '78 at 25 °C: the force between two charges in water is divided by 78.', value: '87.9 at 0 °C, 78.4 at 25 °C, 55.5 at 100 °C', why: 'Strong dipoles that align with a field, cooperatively.', prop: 'eps' },
    { id: 'lv', name: 'Highest latent heat of vaporisation', normal: '300–900 kJ/kg for organic liquids.', water: '2,257 kJ/kg at 100 °C.', value: '40.7 kJ/mol', why: 'Every molecule leaving must break its bonds with the network.', prop: 'vapour' },
    { id: 'lf', name: 'High latent heat of fusion', normal: 'A few tens of kJ/kg.', water: '334 kJ/kg — why ice is such a good cooler.', value: '6.01 kJ/mol', why: 'Only about a tenth of the bonds break on melting, but each is strong.', prop: 'melting' },
    { id: 'k', name: 'High thermal conductivity for a liquid', normal: '0.1–0.2 W/(m·K) for organic liquids.', water: '0.6 W/(m·K), and it rises with temperature.', value: '0.556 at 0 °C, 0.679 at 100 °C', why: 'Vibrations pass along the hydrogen-bonded network.', prop: 'k' },
    { id: 'd2o', name: 'Heavy water is different', normal: 'Isotopes barely change a liquid\'s properties.', water: 'D₂O melts at 3.8 °C, is densest at 11.2 °C, is 23 % more viscous and tastes sweet.', value: 'mp 3.82 °C, bp 101.42 °C', why: 'Nuclear quantum effects: the heavier deuterium makes stronger, stiffer hydrogen bonds.', prop: 'density' },
    { id: 'supercooled', name: 'Supercooling to −41 °C', normal: 'Liquids supercool a little.', water: 'Clean droplets stay liquid to about −41 °C; the anomalies grow explosively on the way.', value: 'homogeneous nucleation near 235 K', why: 'Ice needs a nucleus; the growing anomalies point to a hidden critical point near 228 K.', prop: 'cp' },
    { id: 'polyamorph', name: 'Two amorphous ices', normal: 'A glass has one density.', water: 'Low- and high-density amorphous ice, 0.94 and 1.17 g/cm³, with a sharp transition between them.', value: 'HDA from Ih at 77 K and 1 GPa (Mishima 1984)', why: 'The glassy forms of two distinct liquids.', prop: 'density' },
    { id: 'proton', name: 'Protons move too fast', normal: 'An ion\'s mobility is set by its size.', water: 'H⁺ moves five to seven times faster than Na⁺ although it is wrapped in water.', value: 'H⁺ 36.2, OH⁻ 20.5, Na⁺ 5.2 (×1e-8 m²/(V·s))', why: 'The charge hops along hydrogen bonds (Grotthuss) instead of a molecule moving.', prop: 'eps' },
    { id: 'hot-ice', name: 'Ice hotter than boiling water', normal: 'Ice means cold.', water: 'Ice VII is stable above 100 °C at 2.2 GPa and ice X beyond 60 GPa; ice VII was found inside diamonds in 2018.', value: 'melts at 355 K at 2.216 GPa', why: 'Denser lattices survive where the open one cannot.', prop: 'melting' },
    { id: 'mpemba', name: 'The Mpemba effect', normal: 'Hotter water should take longer to freeze.', water: 'Sometimes it seems not to; the effect is real in some set-ups and absent in others.', value: 'contested', why: 'Evaporation, convection, dissolved gas, supercooling and the definition of "freezes" all enter.', prop: 'cp' }
  ];

  /* ---------------------------------------------------------------- the ices */
  W.ICES = [
    { id: 'Ih', name: 'Ice Ih', year: '—', rho: 0.917, p: '< 0.2 GPa', structure: 'hexagonal', ordered: false, note: 'All natural ice on Earth: snow, glaciers, sea ice, the freezer.' },
    { id: 'Ic', name: 'Ice Ic', year: 1943, rho: 0.92, p: '< 0.2 GPa, metastable', structure: 'cubic (diamond-like)', ordered: false, note: 'Forms from vapour below −80 °C; pure ice Ic was first made in 2020. Most "cubic ice" is stacking-disordered.' },
    { id: 'II', name: 'Ice II', year: 1900, rho: 1.17, p: '0.2–0.6 GPa, cold', structure: 'rhombohedral', ordered: true, note: 'Tammann\'s first high-pressure ice; hydrogen-ordered from the start. Perhaps inside Ganymede.' },
    { id: 'III', name: 'Ice III', year: 1900, rho: 1.16, p: '0.2–0.35 GPa', structure: 'tetragonal', ordered: false, note: 'The first ice met on compressing cold water past 209 MPa.' },
    { id: 'IV', name: 'Ice IV', year: 1935, rho: 1.27, p: '0.4–0.6 GPa, metastable', structure: 'rhombohedral', ordered: false, note: 'Never stable; made with a nucleating agent.' },
    { id: 'V', name: 'Ice V', year: 1912, rho: 1.23, p: '0.35–0.63 GPa', structure: 'monoclinic', ordered: false, note: 'The most complex structure of the ices, 28 molecules per cell.' },
    { id: 'VI', name: 'Ice VI', year: 1912, rho: 1.31, p: '0.63–2.2 GPa', structure: 'tetragonal', ordered: false, note: 'Two interpenetrating networks; stable above room temperature; found inside diamonds.' },
    { id: 'VII', name: 'Ice VII', year: 1937, rho: 1.50, p: '2.2–62 GPa', structure: 'cubic', ordered: false, note: 'Two interpenetrating diamond lattices; stable to 715 K; found in diamond inclusions (2018), a mineral.' },
    { id: 'VIII', name: 'Ice VIII', year: 1966, rho: 1.46, p: '2.2–62 GPa, below 0 °C', structure: 'tetragonal', ordered: true, note: 'Ice VII with its hydrogens ordered.' },
    { id: 'IX', name: 'Ice IX', year: 1968, rho: 1.16, p: '0.2–0.4 GPa, below −108 °C', structure: 'tetragonal', ordered: true, note: 'Ice III with its hydrogens ordered — not Vonnegut\'s.' },
    { id: 'X', name: 'Ice X', year: 1984, rho: 2.5, p: '> 62 GPa', structure: 'cubic, symmetric', ordered: true, note: 'The hydrogen sits halfway between the oxygens: no molecules any more.' },
    { id: 'XI', name: 'Ice XI', year: 1972, rho: 0.92, p: '< 0.2 GPa, below 72 K', structure: 'orthorhombic', ordered: true, note: 'Ice Ih with its hydrogens ordered; ferroelectric; made with KOH doping. Perhaps on the Kuiper belt.' },
    { id: 'XII', name: 'Ice XII', year: 1996, rho: 1.29, p: '0.2–0.6 GPa, metastable', structure: 'tetragonal', ordered: false, note: 'Found by accident while making ice V.' },
    { id: 'XIII', name: 'Ice XIII', year: 2006, rho: 1.23, p: '0.5 GPa, below 110 K', structure: 'monoclinic', ordered: true, note: 'Ice V ordered, with HCl doping (Salzmann).' },
    { id: 'XIV', name: 'Ice XIV', year: 2006, rho: 1.29, p: '1.2 GPa, below 118 K', structure: 'orthorhombic', ordered: true, note: 'Ice XII ordered.' },
    { id: 'XV', name: 'Ice XV', year: 2009, rho: 1.33, p: '0.8–1.5 GPa, below 130 K', structure: 'pseudo-orthorhombic', ordered: true, note: 'Ice VI ordered, antiferroelectric.' },
    { id: 'XVI', name: 'Ice XVI', year: 2014, rho: 0.81, p: 'vacuum, below 145 K', structure: 'cubic clathrate frame', ordered: false, note: 'An emptied neon clathrate: the least dense ice known.' },
    { id: 'XVII', name: 'Ice XVII', year: 2016, rho: 0.85, p: 'vacuum, below 130 K', structure: 'hexagonal, porous', ordered: false, note: 'Hydrogen-filled ice with the hydrogen pumped out; it re-absorbs gases.' },
    { id: 'XVIII', name: 'Ice XVIII', year: 2019, rho: 3, p: '100–400 GPa, thousands of K', structure: 'superionic', ordered: false, note: 'Oxygen lattice with protons flowing through it like a liquid; the interior of Uranus and Neptune.' },
    { id: 'XIX', name: 'Ice XIX', year: 2021, rho: 1.33, p: '~2 GPa, below 100 K', structure: 'pseudo-orthorhombic', ordered: true, note: 'A second way of ordering the hydrogens of ice VI (Innsbruck and Tokyo).' },
    { id: 'LDA', name: 'Low-density amorphous ice', year: 1935, rho: 0.94, p: 'vapour deposition below 130 K', structure: 'glass', ordered: false, note: 'The commonest ice in the universe, on interstellar grains.' },
    { id: 'HDA', name: 'High-density amorphous ice', year: 1984, rho: 1.17, p: 'Ih crushed at 77 K and 1 GPa', structure: 'glass', ordered: false, note: 'Mishima\'s discovery; the glass of a second liquid.' },
    { id: 'VHDA', name: 'Very-high-density amorphous ice', year: 2001, rho: 1.25, p: 'HDA annealed at 1.1 GPa', structure: 'glass', ordered: false, note: 'A third amorphous form.' },
    { id: 'MDA', name: 'Medium-density amorphous ice', year: 2023, rho: 1.06, p: 'Ih ball-milled at 77 K', structure: 'glass', ordered: false, note: 'Made by grinding; its density is that of liquid water.' }
  ];
  W.CLATHRATES = [
    { id: 'sI', name: 'Structure I', cages: '2 small (5¹²) + 6 large (5¹²6²) per 46 H₂O', guests: 'methane, CO₂, ethane', note: 'Methane hydrate: 164 m³ of gas per m³ at STP; stable on the seabed below 300–500 m.' },
    { id: 'sII', name: 'Structure II', cages: '16 small + 8 large (5¹²6⁴) per 136 H₂O', guests: 'propane, nitrogen, oxygen', note: 'Pipeline plugs; the ice XVI frame when emptied.' },
    { id: 'sH', name: 'Structure H', cages: 'three cage types per 34 H₂O', guests: 'methane + a large molecule', note: 'Needs two guests at once.' }
  ];

  /* ---------------------------------------------------------------- stars and distances */
  W.habitableZone = L => ({ inner: 0.95 * Math.sqrt(L), outer: 1.67 * Math.sqrt(L) });   // AU (Kopparapu conservative, Sun-like star)
  W.snowLine = L => 2.7 * Math.sqrt(L);                                                     // AU, where water ice survives in a young disk
  W.equilibriumTemperature = (L, dAU, albedo) => 278.6 * Math.pow(L, 0.25) * Math.pow(1 - (albedo == null ? 0.3 : albedo), 0.25) / Math.sqrt(dAU);   // K

  /* ---------------------------------------------------------------- trees and columns */
  W.hydrostaticHead = h => W.density(20) * W.g * h;                     // Pa for a column of height h
  W.suctionLimit = p => (p == null ? 101325 : p) / (W.density(20) * W.g);   // m: the height a vacuum can lift water (10.3 m)
  W.xylemTension = (h, resistance) => W.hydrostaticHead(h) + (resistance == null ? 0 : resistance) * h;   // Pa needed at the top

  W.interp = interp;
  W.bisect = bisect;
  W.K = K; W.C = C;
  H.water = W;
})();
