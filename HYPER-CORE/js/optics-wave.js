/* HYPER-CORE · optics-wave.js
 *
 * Wave optics for the Hyper apps, added to Hyper.optics (kit.optics): thin-film stacks and coatings, the
 * Fabry–Perot etalon, diffraction by slits, gratings and round apertures, resolution and the modulation transfer
 * function, Gaussian beams and resonators, the laser families and laser safety, polarisation (Jones and Stokes).
 * Load after optics.js. Wavelengths in nanometres, angles in radians, other lengths in metres unless a name says
 * otherwise (layer thicknesses in nm, spatial frequencies in cycles per millimetre, pixel pitch in µm).
 *
 *   O.film.{stack, spectrum, quarterWave, design, DESIGNS, COATING_MATERIALS}   O.etalon
 *   O.besselJ0  O.besselJ1  O.fresnelCS
 *   O.diff.{singleSlit, doubleSlit, nSlits, airy, airyRadius, rayleighAngle, grating, gratingOrders, resolvingPower,
 *           fresnelNumber, knifeEdge, coherenceLength, fringeSpacing}
 *   O.mtf.{cutoff, diffraction, pixel, motion, defocus, gaussian, nyquist, system, mtf50}
 *   O.beam.{rayleigh, w, R, divergence, focus, lens, train, bpp}   O.laser.{g, stable, modeSpacing, cavityWaist,
 *           mpe, nohd, od, CLASSES, classOf}   O.LASERS
 *   O.pol.{vec, polarizer, retarder, qwp, hwp, rotator, apply, chain, intensity, ellipse, stokes, malus, mueller, dop}
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const O = H.optics = H.optics || {};
  const C = O.cx, PI = Math.PI;

  /* ================================================================ thin films */
  const F = O.film = {};
  // typical coating materials (indices in the visible; dispersion neglected)
  F.COATING_MATERIALS = {
    'MgF2': { n: 1.38, name: 'Magnesium fluoride', kind: 'low' }, 'cryolite': { n: 1.35, name: 'Cryolite (Na₃AlF₆)', kind: 'low' },
    'SiO2': { n: 1.46, name: 'Silicon dioxide', kind: 'low' }, 'Al2O3': { n: 1.63, name: 'Aluminium oxide', kind: 'medium' },
    'Y2O3': { n: 1.80, name: 'Yttrium oxide', kind: 'medium' }, 'HfO2': { n: 1.95, name: 'Hafnium oxide', kind: 'high' },
    'ZrO2': { n: 2.05, name: 'Zirconium dioxide', kind: 'high' }, 'Ta2O5': { n: 2.10, name: 'Tantalum pentoxide', kind: 'high' },
    'TiO2': { n: 2.35, name: 'Titanium dioxide', kind: 'high' }, 'ZnS': { n: 2.35, name: 'Zinc sulfide', kind: 'high' },
    'Nb2O5': { n: 2.30, name: 'Niobium pentoxide', kind: 'high' }, 'Ge': { n: 4.0, name: 'Germanium (infrared)', kind: 'high' }
  };
  function nkOf(x, nm) {
    if (typeof x === 'string' && F.COATING_MATERIALS[x]) return [F.COATING_MATERIALS[x].n, 0];
    return O.nk(x, nm);
  }
  // sqrt with a non-negative real part; a purely imaginary result is given the decaying sign for n − ik indices
  function root4(a) { const r = Math.hypot(a[0], a[1]); let re = Math.sqrt(Math.max(0, (r + a[0]) / 2)), im = Math.sqrt(Math.max(0, (r - a[0]) / 2)); if (a[1] < 0) im = -im; if (re < 1e-14 && im > 0) im = -im; return [re, im]; }

  /* A stack of layers on a substrate. def: { n0 (incident medium, default 1), ns (substrate), layers: [{ n, d }] }
     with d the physical thickness in nm, listed from the incident side. Indices: numbers, material ids
     (optical materials, coating materials, metals) or { n, k }.
     -> { R, T, A, Rs, Rp, Ts, Tp, phase (of the reflected s wave) } at wavelength nm and incidence theta;
     pol: 's', 'p' or undefined (the average of both, for unpolarised light) */
  F.stack = function (def, nm, theta, pol) {
    theta = theta || 0;
    const n0 = nkOf(def.n0 == null ? 1 : def.n0, nm)[0], s0 = n0 * Math.sin(theta), s2 = [s0 * s0, 0];
    const one = p => {
      let B = [1, 0], Cc = null;
      // start from the substrate and multiply the layer matrices on from the right-hand end
      const Ns = nkOf(def.ns == null ? 1.52 : def.ns, nm), NsM = [Ns[0], -Ns[1]];
      const qs = root4(C.sub(C.mul(NsM, NsM), s2));
      const etaS = p ? C.div(C.mul(NsM, NsM), qs) : qs;
      let vB = [1, 0], vC = etaS;
      const L = def.layers || [];
      for (let j = L.length - 1; j >= 0; j--) {
        const N = nkOf(L[j].n, nm), Nm = [N[0], -N[1]];
        const q = root4(C.sub(C.mul(Nm, Nm), s2));
        const eta = p ? C.div(C.mul(Nm, Nm), q) : q;
        const delta = C.scale(q, 2 * PI * L[j].d / nm);
        const cd = C.cos(delta), sd = C.sin(delta), isd = [-sd[1], sd[0]];      // i·sin δ
        const nB = C.add(C.mul(cd, vB), C.mul(C.div(isd, eta), vC));
        const nC = C.add(C.mul(C.mul(isd, eta), vB), C.mul(cd, vC));
        vB = nB; vC = nC;
      }
      B = vB; Cc = vC;
      const eta0 = [p ? n0 / Math.cos(theta) : n0 * Math.cos(theta), 0];
      const num = C.sub(C.mul(eta0, B), Cc), den = C.add(C.mul(eta0, B), Cc);
      const r = C.div(num, den);
      const R = Math.min(1, C.abs2(r));
      const into = Math.max(0, 4 * eta0[0] * etaS[0] / C.abs2(den));        // the power that enters the substrate
      // an absorbing substrate (a metal) transmits nothing: what enters it is absorbed
      return Ns[1] > 1e-6 ? { r, R, T: 0, lost: into } : { r, R, T: into, lost: 0 };
    };
    const s = one(false), p = one(true);
    if (pol === 's') return { R: s.R, T: s.T, A: Math.max(0, 1 - s.R - s.T), Rs: s.R, Rp: p.R, Ts: s.T, Tp: p.T, phase: C.arg(s.r) };       // A: absorbed in the layers and in a metal substrate
    if (pol === 'p') return { R: p.R, T: p.T, A: Math.max(0, 1 - p.R - p.T), Rs: s.R, Rp: p.R, Ts: s.T, Tp: p.T, phase: C.arg(p.r) };
    const R = (s.R + p.R) / 2, T = (s.T + p.T) / 2;
    return { R, T, A: Math.max(0, 1 - R - T), Rs: s.R, Rp: p.R, Ts: s.T, Tp: p.T, phase: C.arg(s.r) };
  };
  /* the stack across a band of wavelengths: -> [{ nm, R, T, Rs, Rp }] */
  F.spectrum = function (def, lo, hi, steps, theta, pol) {
    const out = []; steps = steps || 120;
    for (let i = 0; i <= steps; i++) { const nm = lo + (hi - lo) * i / steps, r = F.stack(def, nm, theta, pol); out.push({ nm, R: r.R, T: r.T, Rs: r.Rs, Rp: r.Rp }); }
    return out;
  };
  /* the physical thickness (nm) of a layer `waves` wavelengths thick optically (default a quarter) */
  F.quarterWave = function (n, nm, waves) { return (waves == null ? 0.25 : waves) * nm / nkOf(n, nm)[0]; };
  // a layer list from a formula of quarter waves: [['H', 1], ['L', 2]] with H, L, M materials; 1 = one quarter wave
  function layers(seq, mats, nm) { return seq.map(([m, q]) => ({ n: mats[m], d: F.quarterWave(mats[m], nm, 0.25 * q), mat: m, q })); }
  function repeat(unit, k) { let out = []; for (let i = 0; i < k; i++) out = out.concat(unit); return out; }
  /* ready-made coatings, designed for a centre wavelength nm0 on a substrate ns.
     -> { n0, ns, layers, name, note }                                                                      */
  F.DESIGNS = {
    uncoated:   { name: 'Uncoated surface', make: () => [] },
    mgf2:       { name: 'Single layer MgF₂ (quarter wave)', make: nm => layers([['L', 1]], { L: 'MgF2' }, nm), note: 'The classic single-layer anti-reflection coating: about 1.3 % left on crown glass.' },
    vcoat:      { name: 'Two-layer V-coat', make: (nm, ns) => vcoat(nm, ns), note: 'Zero reflection at one wavelength; the curve is a narrow V. For lasers.' },
    bbar:       { name: 'Three-layer broadband AR (quarter–half–quarter)', make: nm => layers([['L', 1], ['H', 2], ['M', 1]], { L: 'MgF2', H: 'ZrO2', M: 'Al2O3' }, nm), note: 'Below about 0.5 % across the visible: the coating of camera lenses.' },
    hr:         { name: 'Quarter-wave mirror, 8 pairs', make: nm => layers(repeat([['H', 1], ['L', 1]], 8).concat([['H', 1]]), { H: 'TiO2', L: 'SiO2' }, nm), note: 'Each interface reflects a little, all in phase: above 99.9 % in a band about the design wavelength.' },
    hr4:        { name: 'Quarter-wave mirror, 4 pairs', make: nm => layers(repeat([['H', 1], ['L', 1]], 4).concat([['H', 1]]), { H: 'TiO2', L: 'SiO2' }, nm) },
    bandpass:   { name: 'Narrow band-pass (one cavity)', make: nm => layers(repeat([['H', 1], ['L', 1]], 4).concat([['H', 2]], repeat([['L', 1], ['H', 1]], 4)), { H: 'TiO2', L: 'SiO2' }, nm), note: 'Two mirrors a half wave apart: a Fabry–Perot cavity that passes one narrow line.' },
    // the two edge filters and the band-pass block only a band about a fifth of the wavelength wide; real filters add absorbing glass or further stacks
    longpass:   { name: 'Long-pass edge filter', make: nm => layers([['H', 0.5]].concat(repeat([['L', 1], ['H', 1]], 9), [['L', 1], ['H', 0.5]]), { H: 'TiO2', L: 'SiO2' }, nm * 0.85), note: 'Reflects the short wavelengths, passes the long ones.' },
    shortpass:  { name: 'Short-pass edge filter', make: nm => layers([['L', 0.5]].concat(repeat([['H', 1], ['L', 1]], 9), [['H', 1], ['L', 0.5]]), { H: 'TiO2', L: 'SiO2' }, nm * 1.15), note: 'Passes the short wavelengths, reflects the long ones: a hot mirror when the edge is at 700 nm.' },
    splitter:   { name: 'Dielectric beam splitter (three layers)', make: nm => layers([['H', 1], ['L', 1], ['H', 1]], { H: 'ZnS', L: 'MgF2' }, nm), note: 'A few layers reflect about two thirds and pass the rest with almost no absorption; at 45° the s and p polarizations split very unequally.' },
    splitter30: { name: 'Dielectric beam splitter (one layer, 30/70)', make: nm => layers([['H', 1]], { H: 'TiO2' }, nm), note: 'One quarter-wave layer of a high index reflects about 30 % across the visible.' },
    aluminium:  { name: 'Aluminium mirror with a half-wave SiO₂ overcoat', sub: 'aluminium', make: nm => layers([['L', 2]], { L: 'SiO2' }, nm), note: 'Protected aluminium: about 88–92 % across the visible.' },
    enhancedAl: { name: 'Enhanced aluminium (two dielectric pairs)', sub: 'aluminium', make: nm => layers([['H', 1], ['L', 1], ['H', 1], ['L', 1]], { H: 'TiO2', L: 'SiO2' }, nm), note: 'Quarter-wave pairs on the metal lift the visible reflectance to about 95–98 %.' },
    silver:     { name: 'Protected silver mirror', sub: 'silver', make: nm => layers([['L', 2]], { L: 'SiO2' }, nm), note: 'The highest reflectance in the visible and infrared; tarnishes unless protected.' },
    gold:       { name: 'Bare gold mirror', sub: 'gold', make: () => [], note: 'Poor in the blue and green, superb in the infrared.' }
  };
  const VCOAT = new Map();
  function vcoat(nm, ns) {
    // two layers (high next to the glass, low outside) with thicknesses solved for zero reflectance at nm
    const nH = 2.05, nL = 1.38, sub = typeof ns === 'number' ? ns : O.nk(ns == null ? 'N-BK7' : ns, nm)[0];
    const memo = Math.round(nm * 10) + '|' + sub.toFixed(5);
    if (VCOAT.has(memo)) return VCOAT.get(memo).map(l => Object.assign({}, l));
    let best = null;
    const R = (a, b) => F.stack({ ns: sub, layers: [{ n: nL, d: a }, { n: nH, d: b }] }, nm).R;
    for (let a = 5; a <= nm / nL / 2; a += nm / 400) for (let b = 5; b <= nm / nH / 2; b += nm / 400) { const r = R(a, b); if (!best || r < best[0]) best = [r, a, b]; }
    let [r0, a, b] = best, step = nm / 400;
    for (let it = 0; it < 40; it++) { step /= 1.6; for (const [da, db] of [[step, 0], [-step, 0], [0, step], [0, -step]]) { const r = R(a + da, b + db); if (r < r0) { r0 = r; a += da; b += db; } } }
    const out = [{ n: nL, d: a, mat: 'L' }, { n: 'ZrO2', d: b, mat: 'H' }];
    if (VCOAT.size > 200) VCOAT.clear();
    VCOAT.set(memo, out);
    return out.map(l => Object.assign({}, l));
  }
  F.design = function (id, nm0, ns) {
    const d = F.DESIGNS[id];
    if (!d) throw new Error('Unknown coating design "' + id + '"');
    nm0 = nm0 || 550;
    return { name: d.name, note: d.note || '', n0: 1, ns: d.sub || (ns == null ? 'N-BK7' : ns), layers: d.make(nm0, ns), nm0 };
  };

  /* a Fabry–Perot etalon: two mirrors of reflectance R a distance d (m) apart in a medium n.
     -> { T (at nm, theta), finesse, F (coefficient of finesse), fsrNm, fsrHz, fwhmNm, order } */
  O.etalon = function (o) {
    const R = o.R, n = o.n || 1, d = o.d, th = o.theta || 0, lam = o.nm * 1e-9;
    const delta = 4 * PI * n * d * Math.cos(th) / lam, Fc = 4 * R / ((1 - R) * (1 - R));
    const fin = PI * Math.sqrt(R) / (1 - R), fsrHz = O.c / (2 * n * d * Math.cos(th)), fsrNm = o.nm * o.nm * 1e-9 / (2 * n * d * Math.cos(th));
    return { T: 1 / (1 + Fc * Math.pow(Math.sin(delta / 2), 2)), finesse: fin, F: Fc, fsrHz, fsrNm, fwhmNm: fsrNm / fin, order: 2 * n * d * Math.cos(th) / lam };
  };

  /* ================================================================ special functions */
  function bessel(n, x) {
    const ax = Math.abs(x);
    if (ax < 12) {
      let term = n === 0 ? 1 : x / 2, sum = term;
      const q = -x * x / 4;
      for (let k = 1; k < 60; k++) { term *= q / (k * (k + n)); sum += term; if (Math.abs(term) < 1e-17 * Math.abs(sum)) break; }
      return sum;
    }
    const mu = 4 * n * n, e = 8 * ax, chi = ax - (n / 2 + 0.25) * PI;
    const P = 1 - (mu - 1) * (mu - 9) / (2 * e * e) + (mu - 1) * (mu - 9) * (mu - 25) * (mu - 49) / (24 * e * e * e * e);
    const Q = (mu - 1) / e - (mu - 1) * (mu - 9) * (mu - 25) / (6 * e * e * e);
    const v = Math.sqrt(2 / (PI * ax)) * (P * Math.cos(chi) - Q * Math.sin(chi));
    return n === 1 && x < 0 ? -v : v;
  }
  O.besselJ0 = x => bessel(0, x);
  O.besselJ1 = x => bessel(1, x);
  O.jinc = x => Math.abs(x) < 1e-8 ? 1 : 2 * bessel(1, x) / x;        // 2 J1(x)/x: the amplitude of the Airy pattern
  /* Fresnel integrals C(x), S(x) with the π/2 t² argument (Abramowitz & Stegun 7.3.32–33, good to 0.002) */
  O.fresnelCS = function (x) {
    const a = Math.abs(x), f = (1 + 0.926 * a) / (2 + 1.792 * a + 3.104 * a * a), g = 1 / (2 + 4.142 * a + 3.492 * a * a + 6.670 * a * a * a);
    const t = PI * a * a / 2, s = Math.sin(t), c = Math.cos(t);
    const Cv = 0.5 + f * s - g * c, Sv = 0.5 - f * c - g * s;
    return x < 0 ? [-Cv, -Sv] : [Cv, Sv];
  };

  /* ================================================================ interference and diffraction */
  const Df = O.diff = {};
  /* relative intensity (1 at the centre) at angle theta: slit width a, slit spacing d in metres */
  Df.singleSlit = function (a, nm, theta) { const b = PI * a * Math.sin(theta) / (nm * 1e-9); return Math.pow(O.sinc(b), 2); };
  Df.doubleSlit = function (a, d, nm, theta) { const g = PI * d * Math.sin(theta) / (nm * 1e-9); return Df.singleSlit(a, nm, theta) * Math.pow(Math.cos(g), 2); };
  Df.nSlits = function (N, a, d, nm, theta) {
    const g = PI * d * Math.sin(theta) / (nm * 1e-9), s = Math.sin(g);
    const multi = Math.abs(s) < 1e-9 ? 1 : Math.pow(Math.sin(N * g) / (N * s), 2);
    return (a ? Df.singleSlit(a, nm, theta) : 1) * multi;
  };
  /* the Airy pattern: relative intensity at a dimensionless radius x = π D sinθ/λ = π r/(λ N) */
  Df.airy = x => Math.pow(O.jinc(x), 2);
  Df.airyRadius = (nm, N) => 1.21967 * nm * 1e-9 * N;                 // radius of the first dark ring in the image (m)
  Df.rayleighAngle = (nm, D) => 1.21967 * nm * 1e-9 / D;              // smallest resolvable angle of an aperture D (m)
  Df.dawes = D => 0.116 / D / 3600 * PI / 180;                        // Dawes' limit for double stars (rad), D in metres
  Df.abbe = (nm, NA) => nm * 1e-9 / (2 * NA);                         // smallest resolvable period in a microscope (m)
  Df.encircled = x => 1 - Math.pow(bessel(0, x), 2) - Math.pow(bessel(1, x), 2);   // energy of the Airy pattern inside x
  /* the grating equation d (sinθm − sinθi) = m λ … with the sign convention sin θm = sin θi + mλ/d (transmission)
     o: { d (m) or linesPerMm, nm, thetaI, m } -> θm (rad), or NaN when the order does not exist */
  Df.grating = function (o) {
    const d = o.d || 1e-3 / o.linesPerMm, s = Math.sin(o.thetaI || 0) + (o.m == null ? 1 : o.m) * o.nm * 1e-9 / d;
    return Math.abs(s) > 1 ? NaN : Math.asin(s);
  };
  Df.gratingOrders = function (o) {
    const d = o.d || 1e-3 / o.linesPerMm, out = [], si = Math.sin(o.thetaI || 0), k = o.nm * 1e-9 / d;
    for (let m = Math.ceil((-1 - si) / k); m <= Math.floor((1 - si) / k); m++) out.push({ m, theta: Math.asin(O.clamp(si + m * k, -1, 1)) });
    return out;
  };
  Df.resolvingPower = (m, N) => Math.abs(m) * N;                      // λ/Δλ of a grating with N lines lit, in order m
  Df.angularDispersion = function (o) { const d = o.d || 1e-3 / o.linesPerMm, th = Df.grating(o); return (o.m == null ? 1 : o.m) / (d * Math.cos(th)) * 1e-9; };   // rad per nm
  Df.littrow = function (o) { const d = o.d || 1e-3 / o.linesPerMm; const s = (o.m == null ? 1 : o.m) * o.nm * 1e-9 / (2 * d); return Math.abs(s) > 1 ? NaN : Math.asin(s); };
  Df.fresnelNumber = (a, L, nm) => a * a / (L * nm * 1e-9);
  /* intensity behind a straight edge, relative to the unobstructed beam; u = x·sqrt(2/(λL)), u > 0 in the light */
  Df.knifeEdge = function (u) { const [c, s] = O.fresnelCS(u); return 0.5 * (Math.pow(c + 0.5, 2) + Math.pow(s + 0.5, 2)); };
  Df.coherenceLength = (nm, dnm) => nm * nm / dnm * 1e-9;             // metres, for a line of width dnm
  Df.fringeSpacing = (nm, d, L) => nm * 1e-9 * L / d;                 // Young's fringes on a screen at distance L
  /* two-beam interference: intensity for beams I1, I2 with a phase difference; visibility */
  Df.twoBeam = (I1, I2, phase, gamma) => I1 + I2 + 2 * Math.sqrt(I1 * I2) * (gamma == null ? 1 : gamma) * Math.cos(phase);
  Df.visibility = (Imax, Imin) => (Imax - Imin) / (Imax + Imin);
  /* zone radii of a Fresnel zone plate of focal length f (m) */
  Df.zoneRadius = (k, f, nm) => { const l = nm * 1e-9; return Math.sqrt(k * l * f + k * k * l * l / 4); };

  /* ================================================================ modulation transfer */
  const Mt = O.mtf = {};
  Mt.cutoff = (nm, N) => 1 / (nm * 1e-6 * N);                         // cycles/mm where a perfect lens of f-number N reaches zero
  Mt.diffraction = function (nu, nm, N) { const x = nu / Mt.cutoff(nm, N); return x >= 1 ? 0 : x <= 0 ? 1 : 2 / PI * (Math.acos(x) - x * Math.sqrt(1 - x * x)); };
  Mt.pixel = (nu, pitchUm, fill) => Math.abs(O.sinc(PI * nu * pitchUm * 1e-3 * (fill == null ? 1 : fill)));          // a square pixel of that width
  Mt.motion = (nu, blurMm) => Math.abs(O.sinc(PI * nu * blurMm));     // uniform smear of length blurMm
  Mt.defocus = (nu, blurMm) => Math.abs(O.jinc(PI * nu * blurMm));    // geometric blur disc of diameter blurMm
  Mt.gaussian = (nu, sigmaMm) => Math.exp(-2 * PI * PI * sigmaMm * sigmaMm * nu * nu);
  Mt.nyquist = pitchUm => 1000 / (2 * pitchUm);                       // cycles/mm
  Mt.system = function (nu, parts) { let m = 1; for (const p of parts) m *= typeof p === 'function' ? p(nu) : p; return m; };
  /* the frequency where a curve f(ν) falls to a level (default one half) */
  Mt.mtf50 = function (f, max, level) {
    level = level == null ? 0.5 : level;
    let a = 0, b = max;
    if (f(b) > level) return b;
    for (let i = 0; i < 50; i++) { const m = (a + b) / 2; if (f(m) > level) a = m; else b = m; }
    return (a + b) / 2;
  };
  /* contrast (modulation) of a pattern */
  Mt.contrast = (max, min) => (max - min) / (max + min);
  /* USAF 1951 target: line pairs per mm of group g, element e */
  Mt.usaf = (g, e) => Math.pow(2, g + (e - 1) / 6);

  /* ================================================================ Gaussian beams */
  const B = O.beam = {};
  B.rayleigh = (w0, nm, M2) => PI * w0 * w0 / ((M2 || 1) * nm * 1e-9);
  B.w = function (z, w0, nm, M2) { const zr = B.rayleigh(w0, nm, M2); return w0 * Math.sqrt(1 + z * z / (zr * zr)); };
  B.R = function (z, w0, nm, M2) { const zr = B.rayleigh(w0, nm, M2); return Math.abs(z) < 1e-300 ? Infinity : z * (1 + zr * zr / (z * z)); };
  B.divergence = (w0, nm, M2) => (M2 || 1) * nm * 1e-9 / (PI * w0);    // half-angle, rad
  B.gouy = function (z, w0, nm, M2) { return Math.atan(z / B.rayleigh(w0, nm, M2)); };
  B.bpp = (w0, nm, M2) => w0 * B.divergence(w0, nm, M2);              // beam parameter product, m·rad
  /* a collimated beam of radius w focused by a lens f: the waist it makes */
  B.focus = function (o) { const w0 = (o.M2 || 1) * o.nm * 1e-9 * o.f / (PI * o.w); return { w0, zR: B.rayleigh(w0, o.nm, o.M2), dof: 2 * B.rayleigh(w0, o.nm, o.M2) }; };
  /* a waist w0 a distance s in front of a thin lens f: the new waist and where it is (Self's equations) */
  B.lens = function (o) {
    const zr = B.rayleigh(o.w0, o.nm, o.M2), f = o.f, s = o.s;
    const m = 1 / Math.sqrt(Math.pow(1 - s / f, 2) + Math.pow(zr / f, 2));
    const sp = f + (s - f) * m * m;                                    // 1/(s + zR²/(s − f)) + 1/s′ = 1/f
    return { w0: m * o.w0, s: sp, m, zR: m * m * zr };
  };
  /* a beam through a train of thin lenses. start: { w0, z0 (waist position), nm, M2 }; lenses: [{ z, f }]
     -> { w(z), segments: [{ from, to, waistZ, w0, zR }] } */
  B.train = function (start, lenses) {
    const lam = (start.M2 || 1) * start.nm * 1e-9;
    const Ls = (lenses || []).slice().sort((a, b) => a.z - b.z);
    const segs = [];
    let waistZ = start.z0 || 0, w0 = start.w0, from = -Infinity;
    for (const L of Ls) {
      const zr = PI * w0 * w0 / lam;
      segs.push({ from, to: L.z, waistZ, w0, zR: zr });
      // q just before the lens, then through it
      const q = [L.z - waistZ, zr];
      // 1/q' = 1/q − 1/f
      const inv = C.div([1, 0], q), inv2 = [inv[0] - 1 / L.f, inv[1]], q2 = C.div([1, 0], inv2);
      waistZ = L.z - q2[0]; w0 = Math.sqrt(lam * q2[1] / PI); from = L.z;
    }
    segs.push({ from, to: Infinity, waistZ, w0, zR: PI * w0 * w0 / lam });
    return { segments: segs, w(z) { const s = segs.find(g => z <= g.to) || segs[segs.length - 1]; return s.w0 * Math.sqrt(1 + Math.pow((z - s.waistZ) / s.zR, 2)); } };
  };
  /* the fraction of a Gaussian beam's power that passes a round hole of radius a */
  B.throughAperture = (a, w) => 1 - Math.exp(-2 * a * a / (w * w));
  B.peakIrradiance = (P, w) => 2 * P / (PI * w * w);

  /* ================================================================ lasers */
  const Ls = O.laser = {};
  Ls.g = (L, R) => 1 - L / R;                                        // R = Infinity for a flat mirror
  Ls.stable = (g1, g2) => { const p = g1 * g2; return p >= 0 && p <= 1; };
  Ls.modeSpacing = (L, n) => O.c / (2 * (n || 1) * L);               // Hz between longitudinal modes
  /* the waist of the fundamental mode of a two-mirror cavity: -> { w0, z1 (from mirror 1), w1, w2 } or null when unstable */
  Ls.cavityWaist = function (L, R1, R2, nm) {
    const g1 = Ls.g(L, R1), g2 = Ls.g(L, R2), lam = nm * 1e-9, p = g1 * g2;
    // the symmetric confocal cavity (g₁ = g₂ = 0) is the limit of the general formula: waist √(λL/2π) at the centre
    if (Math.abs(g1) < 1e-9 && Math.abs(g2) < 1e-9) { const wm = Math.sqrt(lam * L / PI); return { w0: wm / Math.SQRT2, z1: L / 2, w1: wm, w2: wm }; }
    if (!(p > 0 && p < 1)) return null;
    const den = g1 + g2 - 2 * p;
    const w0 = Math.sqrt(lam * L / PI * Math.sqrt(p * (1 - p) / (den * den)));
    const w1 = Math.sqrt(lam * L / PI * Math.sqrt(g2 / (g1 * (1 - p)))), w2 = Math.sqrt(lam * L / PI * Math.sqrt(g1 / (g2 * (1 - p))));
    return { w0, z1: L * g2 * (1 - g1) / den, w1, w2 };
  };
  Ls.thresholdGain = (L, R1, R2, loss) => (loss || 0) + Math.log(1 / (R1 * R2)) / (2 * L);     // per metre
  /* laser safety classes for continuous visible beams (IEC 60825-1, simplified) */
  Ls.CLASSES = [
    { cls: '1', limit: 0.39e-3, text: 'Safe under all conditions of normal use, including long viewing.', examples: 'Laser printers and disc players (a stronger laser sealed inside).' },
    { cls: '2', limit: 1e-3, text: 'Visible beams only. The blink reflex (0.25 s) protects the eye; do not stare into the beam.', examples: 'Barcode scanners, spirit-level lasers, many pointers.' },
    { cls: '3R', limit: 5e-3, text: 'Low risk, but direct viewing can exceed the safe exposure. Avoid the beam.', examples: 'Brighter pointers, alignment lasers.' },
    { cls: '3B', limit: 0.5, text: 'Direct and mirror-reflected beams injure the eye at once; diffuse reflections are normally safe. Eyewear, key control, interlocks.', examples: 'Laboratory lasers, light-show projectors, therapy lasers.' },
    { cls: '4', limit: Infinity, text: 'Injures eye and skin, even by diffuse reflection; a fire hazard. Enclosures, interlocks, eyewear, a laser safety officer.', examples: 'Cutting, welding, marking and surgical lasers.' }
  ];
  Ls.classOf = P => Ls.CLASSES.find(c => P <= c.limit).cls;          // visible continuous beam, power in watts
  /* maximum permissible exposure at the cornea, visible light 400–700 nm, 18 µs to 10 s: 18 t^0.75 J/m² */
  Ls.mpe = function (t) { const H0 = 18 * Math.pow(t, 0.75); return { H: H0, E: H0 / t }; };            // J/m², W/m²
  /* nominal ocular hazard distance: beyond it the beam is below the MPE. P (W), divergence full angle (rad), exit diameter a (m), mpe (W/m²) */
  Ls.nohd = function (P, div, a, mpe) { return Math.max(0, (Math.sqrt(4 * P / (PI * mpe)) - (a || 0)) / div); };
  Ls.od = (exposure, limit) => Math.max(0, Math.log10(exposure / limit));     // optical density that eyewear needs

  // the laser families: wavelengths in nm
  O.LASERS = [
    { id: 'hene', name: 'Helium–neon', family: 'gas', nm: [632.8, 543.5, 594.1, 611.9, 1152, 3391], mode: 'CW', power: '0.5–50 mW', pump: 'electric discharge', uses: 'alignment, interferometry, older barcode scanners, teaching' },
    { id: 'argon', name: 'Argon ion', family: 'gas', nm: [488.0, 514.5, 457.9, 476.5, 496.5, 351.1], mode: 'CW', power: '10 mW–25 W', pump: 'high-current discharge', uses: 'light shows, flow cytometry, confocal microscopes, pumping other lasers' },
    { id: 'krypton', name: 'Krypton ion', family: 'gas', nm: [647.1, 568.2, 530.9, 413.1, 676.4], mode: 'CW', power: '0.1–5 W', pump: 'high-current discharge', uses: 'light shows, ophthalmology' },
    { id: 'hecd', name: 'Helium–cadmium', family: 'gas', nm: [441.6, 325.0], mode: 'CW', power: '10–200 mW', pump: 'electric discharge', uses: 'lithography of holographic gratings, fluorescence' },
    { id: 'co2', name: 'Carbon dioxide', family: 'gas', nm: [10600, 9600], mode: 'CW or pulsed', power: '10 W–20 kW', pump: 'electric discharge or radio frequency', uses: 'cutting and engraving of non-metals, welding, surgery' },
    { id: 'excimer', name: 'Excimer (ArF, KrF, XeCl, XeF)', family: 'gas', nm: [193, 248, 308, 351], mode: 'pulsed (ns)', power: '1–300 W average', pump: 'pulsed discharge', uses: 'chip lithography, LASIK, micromachining' },
    { id: 'nitrogen', name: 'Nitrogen', family: 'gas', nm: [337.1], mode: 'pulsed (ns)', power: 'mJ pulses', pump: 'pulsed discharge', uses: 'pumping dye lasers, MALDI' },
    { id: 'ruby', name: 'Ruby', family: 'solid', nm: [694.3], mode: 'pulsed', power: 'J pulses', pump: 'flash lamp', uses: 'the first laser (1960); holography, tattoo removal' },
    { id: 'ndyag', name: 'Nd:YAG', family: 'solid', nm: [1064, 532, 355, 266, 1319, 946], mode: 'CW or pulsed', power: 'mW–kW', pump: 'laser diodes or lamps', uses: 'marking, welding, range finding, surgery; 532 nm when frequency-doubled' },
    { id: 'ndyvo4', name: 'Nd:YVO₄', family: 'solid', nm: [1064, 532, 355], mode: 'CW or pulsed', power: 'mW–100 W', pump: 'laser diodes', uses: 'green pointers and modules (doubled), marking, micromachining' },
    { id: 'tisapphire', name: 'Titanium–sapphire', family: 'solid', nm: [800, 700, 1000], mode: 'CW or femtosecond pulses', power: '0.1–5 W', pump: 'green laser', uses: 'tunable 650–1100 nm; ultrafast science, multiphoton microscopy' },
    { id: 'eryag', name: 'Er:YAG', family: 'solid', nm: [2940], mode: 'pulsed', power: 'W', pump: 'lamps or diodes', uses: 'dentistry, skin resurfacing (strongly absorbed by water)' },
    { id: 'alexandrite', name: 'Alexandrite', family: 'solid', nm: [755], mode: 'pulsed', power: 'J pulses', pump: 'flash lamp', uses: 'hair and tattoo removal' },
    { id: 'diode', name: 'Laser diode (edge emitter)', family: 'semiconductor', nm: [405, 450, 520, 635, 650, 670, 780, 808, 850, 905, 940, 980, 1310, 1550], mode: 'CW or modulated', power: 'mW–W per emitter, kW in bars', pump: 'electric current', uses: 'pointers, disc players, printers, fibre communication, pumping, lidar' },
    { id: 'vcsel', name: 'VCSEL (surface emitter)', family: 'semiconductor', nm: [850, 940, 1310], mode: 'CW or modulated', power: 'mW per emitter, W in arrays', pump: 'electric current', uses: 'short data links, optical mice, face recognition, time-of-flight sensors' },
    { id: 'qcl', name: 'Quantum cascade', family: 'semiconductor', nm: [4500, 7800, 10000], mode: 'CW or pulsed', power: 'mW–W', pump: 'electric current', uses: 'mid-infrared gas sensing' },
    { id: 'ybfiber', name: 'Ytterbium fibre', family: 'fibre', nm: [1070, 1030, 1064], mode: 'CW or pulsed', power: '10 W–100 kW', pump: 'laser diodes', uses: 'cutting and welding metal, marking' },
    { id: 'erfiber', name: 'Erbium fibre', family: 'fibre', nm: [1550], mode: 'CW or pulsed', power: 'mW–100 W', pump: 'laser diodes', uses: 'telecommunication amplifiers, eye-safer lidar' },
    { id: 'tmfiber', name: 'Thulium fibre', family: 'fibre', nm: [1940, 2000], mode: 'CW or pulsed', power: 'W–kW', pump: 'laser diodes', uses: 'surgery, plastics welding' },
    { id: 'dye', name: 'Dye', family: 'liquid', nm: [570, 590, 620], mode: 'CW or pulsed', power: 'mW–W', pump: 'another laser or a flash lamp', uses: 'tunable across the visible; spectroscopy, dermatology' }
  ];
  O.laserById = id => O.LASERS.find(l => l.id === id);

  /* ================================================================ polarisation */
  // Jones vectors [Ex, Ey] of complex numbers; the wave is Re[E·exp(i(kz − ωt))].
  // 'R' is right-circular in the optics convention: clockwise when you look towards the source.
  const P = O.pol = {};
  const r2 = Math.SQRT1_2;
  P.vec = function (s) {
    if (typeof s === 'number') return [[Math.cos(s), 0], [Math.sin(s), 0]];
    return { H: [[1, 0], [0, 0]], V: [[0, 0], [1, 0]], D: [[r2, 0], [r2, 0]], A: [[r2, 0], [-r2, 0]], R: [[r2, 0], [0, -r2]], L: [[r2, 0], [0, r2]] }[s];
  };
  const rot = t => [[[Math.cos(t), 0], [Math.sin(t), 0]], [[-Math.sin(t), 0], [Math.cos(t), 0]]];
  const mm = (X, Y) => [[C.add(C.mul(X[0][0], Y[0][0]), C.mul(X[0][1], Y[1][0])), C.add(C.mul(X[0][0], Y[0][1]), C.mul(X[0][1], Y[1][1]))],
                        [C.add(C.mul(X[1][0], Y[0][0]), C.mul(X[1][1], Y[1][0])), C.add(C.mul(X[1][0], Y[0][1]), C.mul(X[1][1], Y[1][1]))]];
  const turned = (D, t) => mm(rot(-t), mm(D, rot(t)));
  P.polarizer = t => turned([[[1, 0], [0, 0]], [[0, 0], [0, 0]]], t || 0);                 // transmission axis at angle t
  P.retarder = (delta, t) => turned([[C.exp([0, -delta / 2]), [0, 0]], [[0, 0], C.exp([0, delta / 2])]], t || 0);   // fast axis at t
  P.qwp = t => P.retarder(PI / 2, t);
  P.hwp = t => P.retarder(PI, t);
  P.rotator = t => [[[Math.cos(t), 0], [-Math.sin(t), 0]], [[Math.sin(t), 0], [Math.cos(t), 0]]];      // turns the plane of polarisation by t
  P.apply = (Mx, v) => [C.add(C.mul(Mx[0][0], v[0]), C.mul(Mx[0][1], v[1])), C.add(C.mul(Mx[1][0], v[0]), C.mul(Mx[1][1], v[1]))];
  P.chain = (v, list) => list.reduce((x, Mx) => P.apply(Mx, x), v);
  P.intensity = v => C.abs2(v[0]) + C.abs2(v[1]);
  /* Stokes parameters [S0, S1, S2, S3]: S1 horizontal − vertical, S2 +45° − −45°, S3 right − left circular */
  P.stokes = function (v) {
    const xy = C.mul(C.conj(v[0]), v[1]);
    return [C.abs2(v[0]) + C.abs2(v[1]), C.abs2(v[0]) - C.abs2(v[1]), 2 * xy[0], -2 * xy[1]];
  };
  /* the polarisation ellipse: azimuth of the long axis, ellipticity angle (±45° circular), axis ratio, handedness */
  P.ellipse = function (v) {
    const S = P.stokes(v), I = S[0] || 1e-300;
    const psi = 0.5 * Math.atan2(S[2], S[1]), chi = 0.5 * Math.asin(O.clamp(S[3] / I, -1, 1));
    return { azimuth: psi, ellipticity: chi, ratio: Math.abs(Math.tan(chi)), handed: Math.abs(S[3] / I) < 1e-9 ? 'linear' : S[3] > 0 ? 'right' : 'left', I };
  };
  P.malus = t => Math.pow(Math.cos(t), 2);
  P.dop = S => Math.sqrt(S[1] * S[1] + S[2] * S[2] + S[3] * S[3]) / (S[0] || 1e-300);       // degree of polarisation
  P.mueller = {
    polarizer(t) { const c = Math.cos(2 * t), s = Math.sin(2 * t); return [[0.5, 0.5 * c, 0.5 * s, 0], [0.5 * c, 0.5 * c * c, 0.5 * c * s, 0], [0.5 * s, 0.5 * c * s, 0.5 * s * s, 0], [0, 0, 0, 0]]; },
    retarder(d, t) {
      const c = Math.cos(2 * t), s = Math.sin(2 * t), cd = Math.cos(d), sd = Math.sin(d);
      return [[1, 0, 0, 0], [0, c * c + s * s * cd, c * s * (1 - cd), -s * sd], [0, c * s * (1 - cd), s * s + c * c * cd, c * sd], [0, s * sd, -c * sd, cd]];
    },
    depolarizer(f) { f = f == null ? 0 : f; return [[1, 0, 0, 0], [0, f, 0, 0], [0, 0, f, 0], [0, 0, 0, f]]; },
    apply: (Mx, S) => Mx.map(r => r[0] * S[0] + r[1] * S[1] + r[2] * S[2] + r[3] * S[3])
  };
  /* polarisation by reflection: the degree of polarisation of unpolarised light after one reflection */
  P.byReflection = function (n1, n2, t1) { const f = O.fresnel(n1, n2, t1); return (f.Rs - f.Rp) / (f.Rs + f.Rp || 1e-300); };
  /* retardance (rad) of a birefringent plate: thickness d (m), birefringence dn */
  P.retardance = (d, dn, nm) => 2 * PI * d * dn / (nm * 1e-9);
  P.waveplateThickness = (waves, dn, nm) => waves * nm * 1e-9 / dn;   // zero-order plate (m)
})(typeof window !== 'undefined' ? window : globalThis);
