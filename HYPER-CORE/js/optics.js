/* HYPER-CORE · optics.js
 *
 * Geometrical optics for the Hyper apps (kit.optics, Hyper.optics): wavelengths and spectral lines, optical
 * materials with their dispersion, reflection and refraction at a surface (Snell, Fresnel, complex indices),
 * prisms, paraxial optics (thin lenses, ray-transfer matrices, cardinal points, pupils), exact ray tracing
 * through spherical, conic and aspheric surfaces, spot diagrams, Seidel aberrations, a small library of lens
 * prescriptions and a few design helpers. Wave optics is in optics-wave.js, light, colour, cameras and the
 * eye in optics-vision.js; all three hang their functions on the same object. Nothing here uses the DOM.
 *
 * Units: wavelengths are ALWAYS in nanometres (arguments named nm); angles in radians (O.rad(deg), O.deg(rad));
 * a lens prescription may use any length unit as long as it is the same throughout (millimetres by custom).
 * Sign convention (Cartesian): light travels left to right along +z; a radius is positive when the centre of
 * curvature lies to the right of the surface; heights are positive upwards.
 *
 *   O.LINES  O.BANDS  O.photonEnergy(nm)  O.frequency(nm)  O.colourName(nm)
 *   O.MATERIALS  O.index(material, nm)  O.abbe(material)  O.METALS  O.metalIndex(id, nm)
 *   O.snell  O.criticalAngle  O.brewster  O.fresnel  O.prism  O.minDeviation  O.rainbow
 *   O.thinLens  O.lensmaker  O.mirrorImage  O.abcd.{free, lens, surface, mirror, mul, apply, cardinal}
 *   O.sys.{vertices, indices, paraxial, trace, at, fan, fan2d, spot, lsa, chromaticShift, seidel, bestFocus, sag, scale}
 *   O.LENSES  O.lens(id)  O.design.{singlet, achromat, cassegrain, newtonian, twoLens}
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const O = H.optics = H.optics || {};
  const PI = Math.PI, D2R = PI / 180, R2D = 180 / PI;

  O.rad = d => d * D2R;
  O.deg = r => r * R2D;
  O.clamp = (x, a, b) => x < a ? a : x > b ? b : x;
  O.sinc = x => Math.abs(x) < 1e-9 ? 1 : Math.sin(x) / x;
  O.c = 299792458;
  O.h = 6.62607015e-34;

  /* ---------------------------------------------------------------- complex numbers [re, im] */
  const C = O.cx = {
    of: z => typeof z === 'number' ? [z, 0] : Array.isArray(z) ? z : [z.n != null ? z.n : z.re || 0, z.k != null ? z.k : z.im || 0],
    add: (a, b) => [a[0] + b[0], a[1] + b[1]],
    sub: (a, b) => [a[0] - b[0], a[1] - b[1]],
    mul: (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]],
    div: (a, b) => { const d = b[0] * b[0] + b[1] * b[1]; return [(a[0] * b[0] + a[1] * b[1]) / d, (a[1] * b[0] - a[0] * b[1]) / d]; },
    scale: (a, s) => [a[0] * s, a[1] * s],
    abs2: a => a[0] * a[0] + a[1] * a[1],
    abs: a => Math.hypot(a[0], a[1]),
    arg: a => Math.atan2(a[1], a[0]),
    conj: a => [a[0], -a[1]],
    exp: a => { const e = Math.exp(a[0]); return [e * Math.cos(a[1]), e * Math.sin(a[1])]; },
    // the square root with a non-negative imaginary part (the decaying wave)
    sqrt: a => { const r = Math.hypot(a[0], a[1]); let re = Math.sqrt(Math.max(0, (r + a[0]) / 2)), im = Math.sqrt(Math.max(0, (r - a[0]) / 2)); if (a[1] < 0) re = -re; if (im === 0 && re < 0) re = -re; return [re, im]; },
    cos: a => [Math.cos(a[0]) * Math.cosh(a[1]), -Math.sin(a[0]) * Math.sinh(a[1])],
    sin: a => [Math.sin(a[0]) * Math.cosh(a[1]), Math.cos(a[0]) * Math.sinh(a[1])]
  };

  /* ---------------------------------------------------------------- wavelengths */
  // the spectral lines optical glass is specified at (nm)
  O.LINES = { i: 365.01, h: 404.66, g: 435.83, "F'": 479.99, F: 486.13, e: 546.07, d: 587.56, D: 589.29, "C'": 643.85, C: 656.27, r: 706.52, s: 852.11, t: 1013.98 };
  O.LINE_NAMES = { i: 'mercury i (UV)', h: 'mercury h (violet)', g: 'mercury g (blue)', "F'": 'cadmium F′ (blue)', F: 'hydrogen F (blue-green)', e: 'mercury e (green)', d: 'helium d (yellow)', D: 'sodium D (yellow)', "C'": 'cadmium C′ (red)', C: 'hydrogen C (red)', r: 'helium r (red)', s: 'caesium s (infrared)', t: 'mercury t (infrared)' };
  // the optical spectrum: [id, name, from nm, to nm]
  O.BANDS = [
    ['uvc', 'UV-C', 100, 280], ['uvb', 'UV-B', 280, 315], ['uva', 'UV-A', 315, 400],
    ['violet', 'violet', 380, 450], ['blue', 'blue', 450, 495], ['green', 'green', 495, 570], ['yellow', 'yellow', 570, 590], ['orange', 'orange', 590, 620], ['red', 'red', 620, 780],
    ['nir', 'near infrared (IR-A)', 780, 1400], ['swir', 'short-wave infrared (IR-B)', 1400, 3000], ['mwir', 'mid-wave infrared', 3000, 8000], ['lwir', 'long-wave (thermal) infrared', 8000, 15000], ['fir', 'far infrared', 15000, 1e6]
  ];
  O.colourName = function (nm) {
    if (nm < 100) return 'X-rays and extreme ultraviolet';
    if (nm < 380) return nm < 280 ? 'UV-C' : nm < 315 ? 'UV-B' : 'UV-A';
    for (const b of O.BANDS.slice(3)) if (nm < b[3]) return b[1];
    return 'far infrared';
  };
  O.photonEnergy = nm => 1239.841984 / nm;                 // eV
  O.frequency = nm => O.c / (nm * 1e-9);                   // Hz
  O.wavelengthIn = (nm, n) => nm / n;                      // the wavelength inside a medium of index n

  /* ---------------------------------------------------------------- materials */
  // Sellmeier: n² = 1 + Σ B λ²/(λ² − C), λ in µm.  s: [B1, B2, B3, C1, C2, C3]
  // or the pair nd, vd (index at the helium d line and Abbe number), from which a two-term Cauchy curve is made;
  // or a fixed index n (infrared materials at their working wavelength).  range: transmission window in nm.
  const M = O.MATERIALS = {
    'air':       { name: 'Air', kind: 'gas', nd: 1.000277, vd: 89.3, range: [185, 20000] },
    'vacuum':    { name: 'Vacuum', kind: 'gas', n: 1 },
    'water':     { name: 'Water (20 °C)', kind: 'liquid', nd: 1.3330, vd: 55.8, range: [200, 1300], density: 1.0 },
    'N-BK7':     { name: 'N-BK7 (borosilicate crown)', kind: 'glass', code: '517642', s: [1.03961212, 0.231792344, 1.01046945, 0.00600069867, 0.0200179144, 103.560653], range: [350, 2000], density: 2.51, cte: 7.1, dndt: 1.6, note: 'The everyday optical glass: windows, lenses, prisms.' },
    'N-K5':      { name: 'N-K5 (crown)', kind: 'glass', code: '522595', s: [1.08511833, 0.199562005, 0.930511663, 0.00661099503, 0.024110866, 111.982777], range: [350, 2000], density: 2.59, cte: 8.2 },
    'N-BAK4':    { name: 'N-BAK4 (barium crown)', kind: 'glass', code: '569560', s: [1.28834642, 0.132817724, 0.945395373, 0.00779980626, 0.0315631177, 105.965875], range: [350, 2000], density: 3.05, cte: 7.0, note: 'The glass of good binocular prisms.' },
    'N-SK16':    { name: 'N-SK16 (dense crown)', kind: 'glass', code: '620603', s: [1.34317774, 0.241144399, 0.994317969, 0.00704687339, 0.0229005, 92.7508526], range: [350, 2000], density: 3.58, cte: 6.3 },
    'N-SK2':     { name: 'N-SK2 (dense crown)', kind: 'glass', code: '607567', nd: 1.60738, vd: 56.65, range: [350, 2000], density: 3.55 },
    'N-LAK9':    { name: 'N-LAK9 (lanthanum crown)', kind: 'glass', code: '691547', s: [1.46231905, 0.344399589, 1.15508372, 0.00724270156, 0.0243353131, 85.4686868], range: [350, 2000], density: 3.51, cte: 6.3 },
    'N-FK51A':   { name: 'N-FK51A (fluor crown, low dispersion)', kind: 'glass', code: '487845', s: [0.971247817, 0.216901417, 0.904651666, 0.00472301995, 0.0153575612, 168.68133], range: [300, 2000], density: 3.68, cte: 12.7, dndt: -5.7, note: 'An "ED" glass: very low dispersion, for apochromats.' },
    'N-BAF10':   { name: 'N-BAF10 (barium flint)', kind: 'glass', code: '670471', s: [1.5851495, 0.143559385, 1.08521269, 0.00926681282, 0.0424489805, 105.613573], range: [350, 2000], density: 3.75, cte: 6.2 },
    'F2':        { name: 'F2 (flint)', kind: 'glass', code: '620364', s: [1.34533359, 0.209073176, 0.937357162, 0.00997743871, 0.0470450767, 111.886764], range: [380, 2000], density: 3.60, cte: 8.2 },
    'F5':        { name: 'F5 (flint)', kind: 'glass', code: '603380', nd: 1.60342, vd: 38.03, range: [380, 2000], density: 3.47 },
    'N-SF5':     { name: 'N-SF5 (dense flint)', kind: 'glass', code: '673323', s: [1.52481889, 0.187085527, 1.42729015, 0.011254756, 0.0588995392, 129.141675], range: [380, 2000], density: 2.86, cte: 7.9 },
    'N-SF10':    { name: 'N-SF10 (dense flint)', kind: 'glass', code: '728285', s: [1.62153902, 0.256287842, 1.64447552, 0.0122241457, 0.0595736775, 147.468793], range: [400, 2000], density: 3.05, cte: 9.4 },
    'N-SF11':    { name: 'N-SF11 (dense flint)', kind: 'glass', code: '785257', s: [1.73759695, 0.313747346, 1.89878101, 0.013188707, 0.0623068142, 155.23629], range: [420, 2000], density: 3.22, cte: 8.5, note: 'High index, strong dispersion: prisms that spread colours.' },
    'N-SF6':     { name: 'N-SF6 (dense flint)', kind: 'glass', code: '805254', s: [1.77931763, 0.338149866, 2.08734474, 0.0133714182, 0.0617533621, 174.01759], range: [420, 2000], density: 3.37, cte: 9.0 },
    'fused-silica': { name: 'Fused silica (SiO₂)', kind: 'glass', code: '458678', s: [0.6961663, 0.4079426, 0.8974794, 0.0684043 * 0.0684043, 0.1162414 * 0.1162414, 9.896161 * 9.896161], range: [185, 2100], density: 2.20, cte: 0.55, dndt: 10, note: 'Pure glass: transmits ultraviolet, barely expands, survives lasers.' },
    'CaF2':      { name: 'Calcium fluoride (CaF₂)', kind: 'crystal', s: [0.5675888, 0.4710914, 3.8484723, 0.050263605 * 0.050263605, 0.1003909 * 0.1003909, 34.649040 * 34.649040], range: [130, 9000], density: 3.18, cte: 18.9, dndt: -10.6, note: 'Deep UV to mid infrared; very low dispersion.' },
    'MgF2':      { name: 'Magnesium fluoride (MgF₂, ordinary ray)', kind: 'crystal', s: [0.48755108, 0.39875031, 2.3120353, 0.04338408 * 0.04338408, 0.09461442 * 0.09461442, 23.793604 * 23.793604], range: [120, 7000], density: 3.18, cte: 13.7, note: 'The classic anti-reflection layer; birefringent crystal.' },
    'sapphire':  { name: 'Sapphire (Al₂O₃, ordinary ray)', kind: 'crystal', s: [1.4313493, 0.65054713, 5.3414021, 0.0726631 * 0.0726631, 0.1193242 * 0.1193242, 18.028251 * 18.028251], range: [170, 5500], density: 3.98, cte: 5.3, dndt: 13, note: 'Next to diamond in hardness: watch glasses, scanner windows.' },
    'diamond':   { name: 'Diamond', kind: 'crystal', nd: 2.4175, vd: 55.3, range: [230, 100000], density: 3.51, cte: 1.0 },
    'calcite-o': { name: 'Calcite (ordinary ray)', kind: 'crystal', nd: 1.6584, vd: 49.0, range: [220, 2300], density: 2.71, note: 'Strongly birefringent: nₒ = 1.658, nₑ = 1.486.' },
    'calcite-e': { name: 'Calcite (extraordinary ray)', kind: 'crystal', nd: 1.4864, vd: 79.0, range: [220, 2300], density: 2.71 },
    'quartz-o':  { name: 'Crystal quartz (ordinary ray)', kind: 'crystal', nd: 1.5443, vd: 69.9, range: [190, 2900], density: 2.65, note: 'Weakly birefringent: nₑ − nₒ = 0.0091; the material of wave plates.' },
    'quartz-e':  { name: 'Crystal quartz (extraordinary ray)', kind: 'crystal', nd: 1.5534, vd: 69.0, range: [190, 2900], density: 2.65 },
    'PMMA':      { name: 'PMMA (acrylic)', kind: 'plastic', nd: 1.4918, vd: 57.4, range: [390, 1600], density: 1.19, cte: 68, dndt: -105, note: 'The crown glass of plastics.' },
    'PC':        { name: 'Polycarbonate', kind: 'plastic', nd: 1.5855, vd: 29.9, range: [395, 1600], density: 1.20, cte: 67, dndt: -107, note: 'The flint of plastics; tough: safety glasses.' },
    'PS':        { name: 'Polystyrene', kind: 'plastic', nd: 1.5905, vd: 30.9, range: [400, 1600], density: 1.05, cte: 70, dndt: -140 },
    'COP':       { name: 'Cyclo-olefin polymer', kind: 'plastic', nd: 1.5309, vd: 55.8, range: [370, 1600], density: 1.01, cte: 60, dndt: -101, note: 'Low water uptake: moulded phone-camera lenses.' },
    'CR-39':     { name: 'CR-39 (spectacle plastic)', kind: 'plastic', nd: 1.498, vd: 58, range: [350, 1400], density: 1.32, note: 'The standard plastic spectacle lens.' },
    'trivex':    { name: 'Trivex (spectacle plastic)', kind: 'plastic', nd: 1.530, vd: 44, range: [395, 1400], density: 1.11 },
    'hi-1.60':   { name: 'High-index 1.60 (spectacle plastic)', kind: 'plastic', nd: 1.600, vd: 41, range: [395, 1400], density: 1.30 },
    'hi-1.67':   { name: 'High-index 1.67 (spectacle plastic)', kind: 'plastic', nd: 1.665, vd: 32, range: [395, 1400], density: 1.35 },
    'hi-1.74':   { name: 'High-index 1.74 (spectacle plastic)', kind: 'plastic', nd: 1.740, vd: 33, range: [400, 1400], density: 1.47 },
    'crown-1.523': { name: 'Spectacle crown glass', kind: 'glass', nd: 1.523, vd: 59, range: [350, 2000], density: 2.54 },
    'silicon':   { name: 'Silicon (infrared)', kind: 'ir', n: 3.42, range: [1200, 7000], density: 2.33, cte: 2.6, dndt: 160, note: 'Opaque to the eye, clear from 1.2 to 7 µm.' },
    'germanium': { name: 'Germanium (infrared)', kind: 'ir', n: 4.003, range: [2000, 14000], density: 5.33, cte: 6.1, dndt: 396, note: 'The lens of thermal cameras: n = 4.' },
    'ZnSe':      { name: 'Zinc selenide (infrared)', kind: 'ir', n: 2.403, range: [600, 16000], density: 5.27, cte: 7.1, dndt: 61, note: 'CO₂-laser optics; yellow to look at.' },
    'ZnS':       { name: 'Zinc sulfide (infrared)', kind: 'ir', n: 2.20, range: [400, 12000], density: 4.09, cte: 6.5 },
    // the media of the eye (Le Grand's theoretical eye)
    'cornea':    { name: 'Cornea', kind: 'eye', nd: 1.3771, vd: 56 },
    'aqueous':   { name: 'Aqueous humour', kind: 'eye', nd: 1.3374, vd: 55 },
    'eye-lens':  { name: 'Crystalline lens', kind: 'eye', nd: 1.42, vd: 50 },
    'vitreous':  { name: 'Vitreous humour', kind: 'eye', nd: 1.336, vd: 55 }
  };
  for (const [id, m] of Object.entries(M)) m.id = id;

  const LF2 = 1 / (0.48613 * 0.48613), LC2 = 1 / (0.65627 * 0.65627), LD2 = 1 / (0.58756 * 0.58756);
  function cauchy(nd, vd, um) { const B = (nd - 1) / vd / (LF2 - LC2), A = nd - B * LD2; return A + B / (um * um); }
  function sellmeier(s, um) { const L = um * um; return Math.sqrt(1 + s[0] * L / (L - s[3]) + s[1] * L / (L - s[4]) + s[2] * L / (L - s[5])); }

  /* The refractive index of a material at a wavelength (nm).
     material: an id of O.MATERIALS, a number (taken as it is, no dispersion), or { nd, vd } / { n } / { s } */
  O.index = function (mat, nm) {
    if (typeof mat === 'number') return mat;
    if (mat == null) return 1;
    const m = typeof mat === 'string' ? M[mat] : mat;
    if (!m) throw new Error('Unknown optical material "' + mat + '"');
    const um = (nm || 587.56) / 1000;
    if (m.s) return sellmeier(m.s, um);
    if (m.nd != null) return m.vd ? cauchy(m.nd, m.vd, um) : m.nd;
    if (m.n != null) return m.n;
    return 1;
  };
  /* nd, the Abbe number vd = (nd − 1)/(nF − nC), and the indices behind it */
  O.abbe = function (mat) {
    const nd = O.index(mat, O.LINES.d), nF = O.index(mat, O.LINES.F), nC = O.index(mat, O.LINES.C);
    return { nd, nF, nC, vd: nF === nC ? Infinity : (nd - 1) / (nF - nC), dn: nF - nC };
  };
  /* group index n − λ dn/dλ: what a pulse (not a phase front) travels at */
  O.groupIndex = function (mat, nm) { const h = 0.5; return O.index(mat, nm) - nm * (O.index(mat, nm + h) - O.index(mat, nm - h)) / (2 * h); };
  /* the six-digit glass code: 517642 = nd 1.517, vd 64.2 */
  O.glassCode = function (mat) {
    const a = O.abbe(mat);
    if (!Number.isFinite(a.vd) || a.nd >= 1.9995 || a.vd >= 99.95) return '';        // outside the six-digit scheme (diamond, MgF₂, materials with no dispersion data)
    return String(Math.round((a.nd - 1) * 1000)).padStart(3, '0') + String(Math.round(a.vd * 10)).padStart(3, '0');
  };

  // metals: complex index n + ik at a few wavelengths (approximate handbook values), interpolated
  O.METALS = {
    aluminium: { name: 'Aluminium', t: [[250, 0.21, 2.94], [300, 0.28, 3.61], [400, 0.49, 4.86], [500, 0.77, 6.08], [600, 1.20, 7.26], [700, 1.83, 8.31], [800, 2.80, 8.45], [900, 2.06, 8.30], [1000, 1.35, 9.58], [1500, 1.38, 15.4], [2000, 2.15, 20.7]] },
    silver:    { name: 'Silver', t: [[300, 1.34, 0.96], [320, 0.90, 0.50], [350, 0.21, 1.42], [400, 0.05, 2.07], [500, 0.05, 3.09], [600, 0.055, 4.01], [700, 0.04, 4.84], [800, 0.04, 5.57], [1000, 0.04, 7.10], [1500, 0.10, 10.9], [2000, 0.26, 14.5]] },
    gold:      { name: 'Gold', t: [[300, 1.53, 1.89], [400, 1.47, 1.95], [450, 1.38, 1.92], [500, 0.97, 1.87], [550, 0.43, 2.45], [600, 0.25, 2.99], [700, 0.13, 3.84], [800, 0.15, 4.90], [1000, 0.23, 6.70], [1500, 0.52, 10.7], [2000, 0.85, 14.1]] },
    copper:    { name: 'Copper', t: [[300, 1.39, 1.67], [400, 1.18, 2.21], [500, 1.13, 2.56], [550, 1.04, 2.59], [600, 0.40, 2.95], [700, 0.21, 4.20], [800, 0.25, 5.03], [1000, 0.33, 6.60], [2000, 0.85, 12.6]] },
    chromium:  { name: 'Chromium', t: [[300, 0.98, 2.67], [400, 1.50, 3.59], [500, 2.61, 4.45], [600, 3.19, 4.30], [700, 3.84, 4.37], [800, 4.23, 4.34], [1000, 4.50, 4.28]] }
  };
  O.metalIndex = function (id, nm) {
    const m = O.METALS[id];
    if (!m) throw new Error('Unknown metal "' + id + '"');
    const t = m.t;
    if (nm <= t[0][0]) return { n: t[0][1], k: t[0][2] };
    for (let i = 1; i < t.length; i++) if (nm <= t[i][0]) { const f = (nm - t[i - 1][0]) / (t[i][0] - t[i - 1][0]); return { n: t[i - 1][1] + f * (t[i][1] - t[i - 1][1]), k: t[i - 1][2] + f * (t[i][2] - t[i - 1][2]) }; }
    const L = t[t.length - 1];
    return { n: L[1], k: L[2] };
  };
  /* an index of any kind as a complex number [n, k]: a number, a material id, a metal id, or { n, k } */
  O.nk = function (x, nm) {
    if (typeof x === 'number') return [x, 0];
    if (Array.isArray(x)) return x;
    if (typeof x === 'string') { if (O.METALS[x]) { const m = O.metalIndex(x, nm); return [m.n, m.k]; } return [O.index(x, nm), 0]; }
    if (x && x.k != null) return [x.n, x.k];
    return [O.index(x, nm), 0];
  };

  /* ---------------------------------------------------------------- a single surface */
  /* Snell's law: the angle of refraction, or NaN when the light is totally reflected */
  O.snell = function (n1, n2, t1) { const s = n1 * Math.sin(t1) / n2; return Math.abs(s) > 1 ? NaN : Math.asin(s); };
  O.criticalAngle = (n1, n2) => n2 < n1 ? Math.asin(n2 / n1) : NaN;
  O.brewster = (n1, n2) => Math.atan2(n2, n1);
  /* Fresnel's equations at an angle of incidence t1 (rad), from index n1 into n2 (either may be complex, { n, k }).
     -> { rs, rp (complex amplitudes), Rs, Rp, R (unpolarised), Ts, Tp, T, t2 (rad or NaN), tir, phaseS, phaseP } */
  O.fresnel = function (n1, n2, t1) {
    const a = C.of(n1), b = C.of(n2);
    const cos1 = [Math.cos(t1 || 0), 0], sin1 = Math.sin(t1 || 0);
    // n2 cos t2 = sqrt(n2² − n1² sin² t1)
    const s2 = C.scale(C.mul(a, a), sin1 * sin1);
    const q2 = C.sqrt(C.sub(C.mul(b, b), s2));                 // n2 cos t2
    const q1 = C.mul(a, cos1);                                 // n1 cos t1
    const rs = C.div(C.sub(q1, q2), C.add(q1, q2));
    // rp = (n2² q1 − n1² q2)/(n2² q1 + n1² q2)
    const b2 = C.mul(b, b), a2 = C.mul(a, a);
    const rp = C.div(C.sub(C.mul(b2, q1), C.mul(a2, q2)), C.add(C.mul(b2, q1), C.mul(a2, q2)));
    const Rs = Math.min(1, C.abs2(rs)), Rp = Math.min(1, C.abs2(rp));
    const real = a[1] === 0 && b[1] === 0;
    const tir = real && a[0] * sin1 > b[0];
    return { rs, rp, Rs, Rp, R: (Rs + Rp) / 2, Ts: 1 - Rs, Tp: 1 - Rp, T: 1 - (Rs + Rp) / 2,
      t2: real ? O.snell(a[0], b[0], t1) : NaN, tir, phaseS: C.arg(rs), phaseP: C.arg(rp) };
  };
  /* reflectance at normal incidence */
  O.normalR = function (n1, n2) { const a = C.of(n1), b = C.of(n2); return C.abs2(C.div(C.sub(a, b), C.add(a, b))); };
  /* an object at depth d under a flat surface, seen from straight above */
  O.apparentDepth = (d, nIn, nOut) => d * (nOut || 1) / nIn;
  /* a ray's sideways shift on crossing a plate of thickness t at incidence t1 */
  O.plateShift = function (t, n, t1) { const t2 = O.snell(1, n, t1); return t * Math.sin(t1 - t2) / Math.cos(t2); };

  /* a prism of apex angle A (rad) and index n in a medium nOut, a ray meeting the first face at incidence t1:
     -> { r1, r2 (inside), exit, delta (total deviation), tir } */
  O.prism = function (n, A, t1, nOut) {
    nOut = nOut || 1;
    const r1 = O.snell(nOut, n, t1), r2 = A - r1;
    const exit = O.snell(n, nOut, r2);
    return { r1, r2, exit, tir: Number.isNaN(exit), delta: t1 + exit - A };
  };
  O.minDeviation = (n, A, nOut) => 2 * Math.asin(O.clamp(n / (nOut || 1) * Math.sin(A / 2), -1, 1)) - A;
  O.prismIndex = (A, dmin) => Math.sin((A + dmin) / 2) / Math.sin(A / 2);
  /* a thin wedge deviates by (n − 1)·angle; in prism dioptres (cm per metre) */
  O.wedgeDeviation = (n, angle) => (n - 1) * angle;
  /* the rainbow: order 1 (primary, about 42°) or 2 (secondary, about 51°): the angle from the anti-solar point */
  O.rainbow = function (n, order) {
    order = order || 1;
    const k = order + 1;
    const ci = Math.sqrt((n * n - 1) / (k * k - 1)), ti = Math.acos(O.clamp(ci, -1, 1)), tr = Math.asin(Math.sin(ti) / n);
    const dev = 2 * (ti - tr) + order * (PI - 2 * tr);            // total deviation of the ray
    const ang = order === 1 ? PI - dev : dev - PI;
    return { incidence: ti, deviation: dev, angle: ang };
  };

  /* ---------------------------------------------------------------- thin lenses and mirrors (real-is-positive) */
  /* object distance so in front of a thin lens of focal length f -> image distance si (negative: virtual, on the
     object's side), magnification m (negative: inverted) */
  O.thinLens = function (f, so) {
    if (!Number.isFinite(f)) return { si: -so, m: 1, real: false, upright: true };       // no power at all: a flat mirror, a window
    const si = !Number.isFinite(so) ? f : Math.abs(so - f) < 1e-12 ? Infinity : so * f / (so - f);
    const m = !Number.isFinite(so) ? 0 : !Number.isFinite(si) ? Infinity : -si / so;
    return { si, m, real: si > 0, upright: m > 0 };
  };
  O.mirrorImage = O.thinLens;                                    // the same equation, with f = R/2 for a concave mirror
  /* the lensmaker's equation: radii R1, R2 (Cartesian signs), centre thickness d, lens index n in a medium nm0 */
  O.lensmaker = function (n, R1, R2, d, n0) {
    n0 = n0 || 1; d = d || 0;
    const c1 = flat(R1) ? 0 : 1 / R1, c2 = flat(R2) ? 0 : 1 / R2, r = n / n0;
    const P = (r - 1) * (c1 - c2 + (r - 1) * d * c1 * c2 / r);
    return P === 0 ? Infinity : 1 / P;
  };
  O.power = f => 1 / f;                                          // dioptres when f is in metres
  /* two thin lenses a distance d apart */
  O.twoLenses = function (f1, f2, d) {
    const P = 1 / f1 + 1 / f2 - d / (f1 * f2);
    const f = P === 0 ? Infinity : 1 / P;
    return { f, bfd: f * (1 - d / f1), ffd: f * (1 - d / f2), afocal: Math.abs(P) < 1e-12 };
  };
  /* shape factor q = (R2 + R1)/(R2 − R1) and the conjugate factor p = (si − so)/(si + so) of a thin lens */
  O.shapeFactor = function (R1, R2) { const c1 = flat(R1) ? 0 : 1 / R1, c2 = flat(R2) ? 0 : 1 / R2; return (c1 + c2) / (c1 - c2); };
  O.bestFormShape = n => 2 * (n * n - 1) / (n + 2);              // least spherical aberration, object at infinity

  function flat(R) { return R == null || R === 0 || !Number.isFinite(R); }

  /* ---------------------------------------------------------------- ray-transfer (ABCD) matrices, rays as [y, u] */
  const A = O.abcd = {
    free: d => [[1, d], [0, 1]],
    lens: f => [[1, 0], [-1 / f, 1]],
    surface: (n1, n2, R) => [[1, 0], [flat(R) ? 0 : (n1 - n2) / (n2 * R), n1 / n2]],
    mirror: R => [[1, 0], [flat(R) ? 0 : 2 / R, 1]],               // unfolded: a concave mirror (R < 0) focuses
    mul2: (P, Q) => [[P[0][0] * Q[0][0] + P[0][1] * Q[1][0], P[0][0] * Q[0][1] + P[0][1] * Q[1][1]], [P[1][0] * Q[0][0] + P[1][1] * Q[1][0], P[1][0] * Q[0][1] + P[1][1] * Q[1][1]]],
    /* mul(first, second, third …): the matrix of elements met in that order */
    mul() { let Mx = [[1, 0], [0, 1]]; for (const E of arguments) Mx = A.mul2(E, Mx); return Mx; },
    apply: (Mx, r) => [Mx[0][0] * r[0] + Mx[0][1] * r[1], Mx[1][0] * r[0] + Mx[1][1] * r[1]],
    det: Mx => Mx[0][0] * Mx[1][1] - Mx[0][1] * Mx[1][0],
    /* from the system matrix (first vertex to last vertex): focal lengths, focal distances, principal planes */
    cardinal(Mx) {
      const a = Mx[0][0], d = Mx[1][1], c = Mx[1][0], det = A.det(Mx);
      if (Math.abs(c) < 1e-15) return { afocal: true, efl: Infinity, angularMag: d, m: a };
      const efl = -1 / c;
      return { afocal: false, efl, power: -c, bfd: -a / c, ffd: -d / c, fFront: det * efl,
        Hrear: (1 - a) / c,                 // rear principal plane, measured from the last vertex (+ to the right)
        Hfront: (d - det) / c };            // front principal plane, measured from the first vertex (+ to the right)
    },
    /* the image of an object a distance so in front of the first vertex: -> { si (behind the last vertex), m } */
    image(Mx, so) {
      const T = A.mul(A.free(so), Mx);
      const si = -T[0][1] / T[1][1];
      return { si, m: T[0][0] + si * T[1][0] };
    }
  };

  /* ================================================================ lens systems
     sys = { name, surfaces: [{ R, t, n, sd, k, A, stop, mirror }], object: Infinity | distance, n0, epd, field }
       R      radius of curvature (0, null or Infinity: flat)          k   conic constant (−1 parabola)
       t      distance along the axis to the next surface              A   even asphere terms [a4, a6, a8 …]
       n      the medium AFTER the surface: id, number or { nd, vd }   sd  semi-diameter of the clear aperture
       stop   true on the surface that is the aperture stop            mirror  true for a reflecting surface
     The last surface's t is the distance to the image plane when given. After a mirror the light travels the
     other way, so the following t is negative (the surfaces lie to the left).                              */
  const S = O.sys = {};
  const curv = s => flat(s.R) ? 0 : 1 / s.R;

  S.vertices = function (sys) { const z = [0]; for (let i = 0; i < sys.surfaces.length - 1; i++) z.push(z[i] + (sys.surfaces[i].t || 0)); return z; };
  /* the index after each surface (a mirror leaves the medium as it was) */
  S.indices = function (sys, nm) {
    let n = O.index(sys.n0 == null ? 1 : sys.n0, nm);
    return sys.surfaces.map(s => { if (!s.mirror) n = O.index(s.n == null ? 1 : s.n, nm); return n; });
  };
  S.stopIndex = function (sys) { const i = sys.surfaces.findIndex(s => s.stop); return i < 0 ? 0 : i; };
  /* the sag of a surface at radial height r */
  S.sag = function (s, r) {
    const c = curv(s), k = s.k || 0, r2 = r * r;
    const rad = 1 - (1 + k) * c * c * r2;
    let z = rad < 0 ? NaN : c * r2 / (1 + Math.sqrt(rad));
    if (s.A) { let p = r2 * r2; for (const a of s.A) { z += a * p; p *= r2; } }
    return z;
  };
  function dsag(s, r) {            // d(sag)/dr
    const c = curv(s), k = s.k || 0;
    const rad = Math.sqrt(Math.max(1e-300, 1 - (1 + k) * c * c * r * r));
    let d = c * r / rad;
    if (s.A) { let p = r * r * r, e = 4; for (const a of s.A) { d += e * a * p; p *= r * r; e += 2; } }
    return d;
  }

  /* paraxial y–nu trace of one ray; mirrors flip the sign of the index. -> [{ y, u (after), n (after, signed) }] */
  function ynu(sys, nm, y, u, from, to) {
    const Sf = sys.surfaces, out = [];
    let n = O.index(sys.n0 == null ? 1 : sys.n0, nm), sign = 1;
    // the signed index in front of surface `from`
    for (let i = 0; i < from; i++) { if (Sf[i].mirror) sign = -sign; else n = O.index(Sf[i].n == null ? 1 : Sf[i].n, nm); }
    let nn = sign * n;
    for (let i = from; i <= to; i++) {
      const s = Sf[i];
      let n2;
      if (s.mirror) { sign = -sign; n2 = -nn; } else { n = O.index(s.n == null ? 1 : s.n, nm); n2 = sign * n; }
      const u2 = (nn * u - y * (n2 - nn) * curv(s)) / n2;
      out.push({ y, u: u2, uIn: u, n: n2, nIn: nn });
      nn = n2; u = u2;
      if (i < to) y = y + u * (s.t || 0);
    }
    return out;
  }

  /* first-order properties: focal length, focal distances, pupils, f-number, image position and magnification */
  S.paraxial = function (sys, nm) {
    nm = nm || 587.56;
    const Sf = sys.surfaces, last = Sf.length - 1, zs = S.vertices(sys);
    const n0 = O.index(sys.n0 == null ? 1 : sys.n0, nm);
    const a = ynu(sys, nm, 1, 0, 0, last), L = a[last];
    const power = -L.n * L.u;                      // φ = −n′u′/y for a ray entering parallel at y = 1
    const afocal = Math.abs(L.u) < 1e-14;
    const efl = afocal ? Infinity : 1 / power;
    const bfd = afocal ? Infinity : -L.y / L.u;
    const b = ynu(sys, nm, 0, 1, 0, last), Lb = b[last];
    // front focal point: the ray that leaves parallel. y0 + ... ; with y′ = A y + B u, u′ = C y + D u
    const Cc = L.u, Dd = Lb.u, Aa = L.y, Bb = Lb.y;
    const ffd = afocal ? Infinity : -Dd / Cc;      // in front of the first vertex (+ to the left)
    // pupils
    const si = S.stopIndex(sys);
    let zEP = 0, magE = 1, Bstop = 0, teleObj = false;
    if (si > 0) {
      const p = ynu(sys, nm, 1, 0, 0, si - 1), q = ynu(sys, nm, 0, 1, 0, si - 1);
      const tA = p[si - 1].y + p[si - 1].u * (Sf[si - 1].t || 0), tB = q[si - 1].y + q[si - 1].u * (Sf[si - 1].t || 0);
      Bstop = tB;
      // a stop at the rear focal plane of what stands before it: the entrance pupil is at infinity (object-space telecentric)
      if (Math.abs(tA) < 1e-6) { teleObj = true; zEP = Infinity; magE = Infinity; }
      else { zEP = tB / tA; magE = 1 / tA; }       // entrance pupil: z from the first vertex, radius = stop radius × magE
    }
    const stopSd = Sf[si].sd;
    let epd = sys.epd != null ? sys.epd : stopSd != null && !teleObj ? 2 * stopSd * Math.abs(magE) : NaN;
    // exit pupil: the stop seen through everything behind it
    let zXP = zs[si], magX = 1, teleImg = false;
    {
      const p = ynu(sys, nm, 0, 1, si, last), q = ynu(sys, nm, 1, 0, si, last);
      const Lp = p[last - si], Lq = q[last - si];
      if (Math.abs(Lp.u) > 1e-9) { zXP = zs[last] - Lp.y / Lp.u; magX = Lq.y - Lq.u * Lp.y / Lp.u; }
      else if (si < last || Math.abs(Lp.y) > 0) { teleImg = si < last; if (teleImg) { zXP = Infinity; magX = Infinity; } }    // image-space telecentric: the exit pupil is at infinity
    }
    // the object and its image
    const so = sys.object == null ? Infinity : sys.object;
    let zImage, m = 0, uImg;
    if (!Number.isFinite(so)) { zImage = zs[last] + bfd; uImg = L.u * (epd / 2 || 1); }
    else {
      const r = ynu(sys, nm, so * 1e-3, 1e-3, 0, last)[last];    // from the axial object point
      zImage = Math.abs(r.u) < 1e-18 ? Infinity : zs[last] - r.y / r.u;
      m = n0 * 1e-3 / (r.n * r.u);
      uImg = r.u;
    }
    const fno = Number.isFinite(efl) && epd ? Math.abs(efl) / epd : NaN;
    // the marginal ray's slope in image space gives the working f-number and NA
    let uM;
    if (!Number.isFinite(so)) uM = L.u * epd / 2;
    else if (teleObj) { const u0 = stopSd != null && Bstop ? stopSd / Bstop : 0; uM = ynu(sys, nm, u0 * so, u0, 0, last)[last].u; }
    else { const u0 = (epd / 2) / (so + zEP); uM = ynu(sys, nm, u0 * so, u0, 0, last)[last].u; }
    const nImg = Math.abs(L.n);
    return { nm, efl, power, bfd, ffd, afocal, zImage, m, zEP, epd, zXP, xpd: Number.isFinite(epd) && Number.isFinite(magX) && Number.isFinite(magE) ? Math.abs(epd / magE * magX) : teleObj && stopSd != null && Number.isFinite(magX) ? Math.abs(2 * stopSd * magX) : NaN,
      telecentricObject: teleObj, telecentricImage: teleImg, Bstop,
      fno, fnoWorking: uM ? 1 / (2 * Math.abs(uM) * nImg) : NaN, na: nImg * Math.abs(Math.sin(Math.atan(uM || 0))),
      Hrear: afocal ? NaN : zs[last] + bfd - L.n * efl, Hfront: afocal ? NaN : -ffd + n0 * efl,      // principal planes, z from the first vertex
      length: zs[last], zs, stop: si, magE, nImage: L.n, abcd: [[Aa, Bb], [Cc, Dd]] };
  };

  /* ---------------------------------------------------------------- exact ray tracing (3-D) */
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const unit = a => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

  // where the ray p0 + s·d meets the surface (vertex at the origin); returns s or NaN
  function hit(sf, p0, d) {
    const c = curv(sf), k = sf.k || 0;
    // carry the ray to the vertex plane first: of the two crossings of a sphere or a conic, the one wanted is the
    // one next to the vertex, however far away the ray started
    const s0 = Math.abs(d[2]) > 1e-12 ? -p0[2] / d[2] : 0;
    const p = s0 ? [p0[0] + s0 * d[0], p0[1] + s0 * d[1], 0] : p0;
    let s;
    if (c === 0) s = Math.abs(d[2]) < 1e-14 ? NaN : -p[2] / d[2];
    else {
      const a = c * (d[0] * d[0] + d[1] * d[1] + (1 + k) * d[2] * d[2]);
      const b = c * (p[0] * d[0] + p[1] * d[1] + (1 + k) * p[2] * d[2]) - d[2];
      const cc = c * (p[0] * p[0] + p[1] * p[1] + (1 + k) * p[2] * p[2]) - 2 * p[2];
      const disc = b * b - a * cc;
      if (disc < 0) return NaN;
      const den = -b + (b > 0 ? -1 : 1) * Math.sqrt(disc);
      s = Math.abs(den) < 1e-300 ? NaN : cc / den;
    }
    if (sf.A && Number.isFinite(s)) {
      // polish the intersection with the aspheric terms by Newton's method
      for (let it = 0; it < 12; it++) {
        const x = p[0] + s * d[0], y = p[1] + s * d[1], z = p[2] + s * d[2], r = Math.hypot(x, y);
        const f = z - S.sag(sf, r);
        if (!Number.isFinite(f)) return NaN;
        const g = dsag(sf, r), fr = r > 1e-12 ? (x * d[0] + y * d[1]) / r : 0;
        const df = d[2] - g * fr;
        if (Math.abs(df) < 1e-14) break;
        const ds = f / df; s -= ds;
        if (Math.abs(ds) < 1e-12) break;
      }
    }
    return s0 + s;
  }
  function normalAt(sf, P) {
    const c = curv(sf), k = sf.k || 0;
    if (sf.A) { const r = Math.hypot(P[0], P[1]), g = dsag(sf, r); return r < 1e-12 ? [0, 0, -1] : unit([g * P[0] / r, g * P[1] / r, -1]); }
    return unit([c * P[0], c * P[1], c * (1 + k) * P[2] - 1]);
  }

  /* Trace one ray { p: [x, y, z], d: [l, m, n] } through the system at a wavelength.
     -> { pts: [[x, y, z] …] (start, then one per surface), d (final direction), p (last point), n (final index),
          ok, why ('' | 'miss' | 'vignetted' | 'tir'), at (surface index where it stopped), opl (optical path) } */
  S.trace = function (sys, ray, nm, opts) {
    nm = nm || 587.56;
    const Sf = sys.surfaces, zs = (opts && opts.zs) || S.vertices(sys), ns = (opts && opts.ns) || S.indices(sys, nm);
    let p = ray.p.slice(), d = unit(ray.d), n1 = O.index(sys.n0 == null ? 1 : sys.n0, nm);
    const out = { pts: [p.slice()], ok: true, why: '', at: -1, opl: 0 };
    const clip = !(opts && opts.clip === false);
    for (let i = 0; i < Sf.length; i++) {
      const sf = Sf[i];
      const q = [p[0], p[1], p[2] - zs[i]];
      const s = hit(sf, q, d);
      if (!Number.isFinite(s)) { out.ok = false; out.why = 'miss'; out.at = i; break; }
      const P = [q[0] + s * d[0], q[1] + s * d[1], q[2] + s * d[2]];
      out.opl += n1 * s;
      p = [P[0], P[1], P[2] + zs[i]];
      out.pts.push(p.slice());
      if (clip && sf.sd != null && Math.hypot(P[0], P[1]) > sf.sd * (1 + 1e-6)) { out.ok = false; out.why = 'vignetted'; out.at = i; break; }
      let N = normalAt(sf, P), ci = -dot(d, N);
      if (ci < 0) { N = [-N[0], -N[1], -N[2]]; ci = -ci; }
      if (sf.mirror) d = unit([d[0] + 2 * ci * N[0], d[1] + 2 * ci * N[1], d[2] + 2 * ci * N[2]]);
      else {
        const n2 = ns[i], mu = n1 / n2, rad = 1 - mu * mu * (1 - ci * ci);
        if (rad < 0) { out.ok = false; out.why = 'tir'; out.at = i; break; }
        const g = mu * ci - Math.sqrt(rad);
        d = unit([mu * d[0] + g * N[0], mu * d[1] + g * N[1], mu * d[2] + g * N[2]]);
        n1 = n2;
      }
    }
    out.p = p; out.d = d; out.n = n1;
    return out;
  };
  /* the point where a traced ray crosses the plane z (absolute, measured from the first vertex) */
  S.at = function (tr, z) { const s = (z - tr.p[2]) / tr.d[2]; return [tr.p[0] + s * tr.d[0], tr.p[1] + s * tr.d[1], z]; };
  /* where a traced ray crosses the axis (meridional rays): z, or NaN */
  S.axisCrossing = function (tr) { return Math.abs(tr.d[1]) < 1e-15 ? NaN : tr.p[2] - tr.p[1] * tr.d[2] / tr.d[1]; };

  /* A ray aimed at a point of the entrance pupil. px, py: pupil coordinates −1 … 1.
     field: for an object at infinity the field angle (rad); for a near object its height. */
  S.aim = function (sys, px, py, field, par, nm) {
    par = par || S.paraxial(sys, nm);
    const so = sys.object == null ? Infinity : sys.object;
    if (par.telecentricObject) {
      // the entrance pupil is at infinity: every chief ray leaves the object parallel to the axis, and the pupil
      // coordinate sets the ray's slope. Correct the slope until the ray crosses the stop at (px, py) of its opening.
      const si = par.stop, rS = sys.surfaces[si].sd, B = par.Bstop, Q = [0, field || 0, Number.isFinite(so) ? -so : -1];
      if (rS == null || !B) return { p: Q, d: [0, 0, 1] };
      const U = [px * rS / B, py * rS / B], front = { surfaces: sys.surfaces.slice(0, si + 1), n0: sys.n0 }, zs = par.zs.slice(0, si + 1);
      let ray = { p: Q, d: unit([U[0], U[1], 1]) };
      homeIn(front, zs, nm || par.nm, si, [px * rS, py * rS], U, B, () => (ray = { p: Q, d: unit([U[0], U[1], 1]) }));
      return ray;
    }
    const rE = par.epd / 2;
    const through = P => {
      if (!Number.isFinite(so)) {
        const d = [0, Math.sin(field || 0), Math.cos(field || 0)];
        // start on a plane a little in front of the first surface
        const z0 = Math.min(-0.25 * Math.abs(par.epd || 1), par.zEP - 1e-6) - (sys.lead || 0), s = (z0 - P[2]) / d[2];
        return { p: [P[0] + s * d[0], P[1] + s * d[1], z0], d };
      }
      const Q = [0, field || 0, -so];
      return { p: Q, d: unit([P[0] - Q[0], P[1] - Q[1], P[2] - Q[2]]) };
    };
    // first aim at the paraxial entrance pupil, then correct the aim until the ray really crosses the stop at
    // (px, py) of its opening: the pupil of a real lens is not exactly where first-order optics puts it
    const P = [px * rE, py * rE, par.zEP];
    let ray = through(P);
    const si = par.stop, mE = par.magE || 1, rS = rE / mE;
    if (sys.aim !== false && Number.isFinite(rS)) {
      const front = { surfaces: sys.surfaces.slice(0, si + 1), n0: sys.n0 }, zs = par.zs.slice(0, si + 1);
      homeIn(front, zs, nm || par.nm, si, [px * rS, py * rS], P, 1 / mE, () => (ray = through(P)));
    }
    return ray;
  };
  /* Adjust the two aiming parameters v[0], v[1] until the ray made by next() crosses the stop (the last surface of
     `front`) at `target`. The first step uses the paraxial slope dHit/dv = g; later steps the slope actually seen. */
  function homeIn(front, zs, nm, si, target, v, g, next) {
    let ray = next(), gx = g, gy = g, hx0, hy0, vx0, vy0;
    for (let it = 0; it < 8; it++) {
      const tr = S.trace(front, ray, nm, { clip: false, zs });
      if (tr.pts.length < si + 2) return;                           // the ray missed a surface: keep the last aim
      const h = tr.pts[si + 1], ex = h[0] - target[0], ey = h[1] - target[1];
      if (Math.hypot(ex, ey) < 1e-10 * Math.max(1, Math.hypot(target[0], target[1]))) return;
      if (it > 0) {
        const sx = (h[0] - hx0) / (v[0] - vx0), sy = (h[1] - hy0) / (v[1] - vy0);
        if (Number.isFinite(sx) && sx / g > 0.2 && sx / g < 5) gx = sx;
        if (Number.isFinite(sy) && sy / g > 0.2 && sy / g < 5) gy = sy;
      }
      hx0 = h[0]; hy0 = h[1]; vx0 = v[0]; vy0 = v[1];
      v[0] -= ex / gx; v[1] -= ey / gy;
      ray = next();
    }
  }

  /* a fan of n meridional rays for drawing: -> [{ pts: [[z, y] …], ok, why, py }] ending on the plane zEnd
     (default: the paraxial image plane). opts: { nm, field, n, fill (fraction of the pupil, default 1), zEnd, zStart } */
  S.fan2d = function (sys, opts) {
    opts = opts || {};
    const nm = opts.nm || 587.56, par = S.paraxial(sys, nm), n = opts.n || 7, fill = opts.fill == null ? 1 : opts.fill;
    const zs = par.zs, ns = S.indices(sys, nm);
    const zEnd = opts.zEnd != null ? opts.zEnd : par.zImage;
    const out = [];
    for (let i = 0; i < n; i++) {
      const py = n === 1 ? 0 : fill * (2 * i / (n - 1) - 1);
      const ray = S.aim(sys, 0, py, opts.field || 0, par, nm);
      if (opts.zStart != null && Number.isFinite(sys.object == null ? Infinity : sys.object) === false) {
        const s = (opts.zStart - ray.p[2]) / ray.d[2]; ray.p = [ray.p[0] + s * ray.d[0], ray.p[1] + s * ray.d[1], opts.zStart];
      }
      const tr = S.trace(sys, ray, nm, { zs, ns });
      const pts = tr.pts.map(p => [p[2], p[1]]);
      if (tr.ok && Number.isFinite(zEnd)) { const e = S.at(tr, zEnd); pts.push([e[2], e[1]]); }
      out.push({ pts, ok: tr.ok, why: tr.why, at: tr.at, py, tr });
    }
    return out;
  };

  /* a spot diagram: rays over the pupil (rings × arms, or a square grid), where they land on the plane z.
     opts: { nm, field, rings (default 6), z (default paraxial image) }
     -> { pts: [[x, y] …], cx, cy (centroid), rms (radius), geo (largest radius from the centroid), n, lost } */
  S.spot = function (sys, opts) {
    opts = opts || {};
    const nm = opts.nm || 587.56, par = opts.par || S.paraxial(sys, nm), rings = opts.rings || 6;
    const zs = par.zs, ns = S.indices(sys, nm), z = opts.z != null ? opts.z : par.zImage;
    const pts = []; let lost = 0;
    const shoot = (px, py) => {
      const tr = S.trace(sys, S.aim(sys, px, py, opts.field || 0, par, nm), nm, { zs, ns });
      if (!tr.ok) { lost++; return; }
      const e = S.at(tr, z); pts.push([e[0], e[1]]);
    };
    shoot(0, 0);
    for (let r = 1; r <= rings; r++) { const m = 6 * r; for (let j = 0; j < m; j++) { const a = 2 * PI * j / m; shoot(r / rings * Math.cos(a), r / rings * Math.sin(a)); } }
    let cx = 0, cy = 0; for (const p of pts) { cx += p[0]; cy += p[1]; }
    cx /= pts.length || 1; cy /= pts.length || 1;
    let s2 = 0, geo = 0; for (const p of pts) { const d2 = (p[0] - cx) * (p[0] - cx) + (p[1] - cy) * (p[1] - cy); s2 += d2; geo = Math.max(geo, Math.sqrt(d2)); }
    return { pts, cx, cy, rms: Math.sqrt(s2 / (pts.length || 1)), geo, n: pts.length, lost, z };
  };
  /* the plane of smallest RMS spot near the paraxial image: -> { z, rms, shift (from the paraxial image) } */
  S.bestFocus = function (sys, opts) {
    opts = opts || {};
    const nm = opts.nm || 587.56, par = S.paraxial(sys, nm);
    const span = opts.span || Math.max(1e-6, 0.06 * Math.abs(par.efl));
    let a = par.zImage - span, b = par.zImage + span;
    const f = z => S.spot(sys, Object.assign({}, opts, { z, par })).rms;
    const g = (Math.sqrt(5) - 1) / 2;
    let x1 = b - g * (b - a), x2 = a + g * (b - a), f1 = f(x1), f2 = f(x2);
    for (let i = 0; i < 40; i++) { if (f1 < f2) { b = x2; x2 = x1; f2 = f1; x1 = b - g * (b - a); f1 = f(x1); } else { a = x1; x1 = x2; f1 = f2; x2 = a + g * (b - a); f2 = f(x2); } }
    const z = (a + b) / 2;
    return { z, rms: f(z), shift: z - par.zImage };
  };
  /* longitudinal spherical aberration: where rays through each zone of the pupil cross the axis, less the
     paraxial focus. -> [[zone 0…1, dz] …] */
  S.lsa = function (sys, nm, n) {
    nm = nm || 587.56; n = n || 20;
    const par = S.paraxial(sys, nm), zs = par.zs, ns = S.indices(sys, nm), out = [];
    for (let i = 1; i <= n; i++) {
      const tr = S.trace(sys, S.aim(sys, 0, i / n, 0, par, nm), nm, { zs, ns });
      if (!tr.ok) break;
      out.push([i / n, S.axisCrossing(tr) - par.zImage]);
    }
    return out;
  };
  /* transverse ray aberration across the pupil (the ray-fan plot): -> [[py, dy] …] relative to the chief ray */
  S.rayFan = function (sys, opts) {
    opts = opts || {};
    const nm = opts.nm || 587.56, ref = opts.refNm || nm, n = opts.n || 21;
    const par = S.paraxial(sys, ref), z = opts.z != null ? opts.z : par.zImage;
    const chief = S.trace(sys, S.aim(sys, 0, 0, opts.field || 0, par, ref), ref);
    const y0 = chief.ok ? S.at(chief, z)[1] : 0, out = [];
    for (let i = 0; i < n; i++) {
      const py = 2 * i / (n - 1) - 1;
      const tr = S.trace(sys, S.aim(sys, 0, py, opts.field || 0, par, ref), nm);
      if (tr.ok) out.push([py, S.at(tr, z)[1] - y0]);
    }
    return out;
  };
  /* how the paraxial focus moves with wavelength: -> [[nm, shift from the focus at refNm] …] */
  S.chromaticShift = function (sys, list, refNm) {
    const z0 = S.paraxial(sys, refNm || 587.56).zImage;
    return (list || [450, 486.13, 546.07, 587.56, 656.27, 700]).map(nm => [nm, S.paraxial(sys, nm).zImage - z0]);
  };

  /* Seidel (third-order) aberration sums from the paraxial marginal and chief rays.
     opts: { nm, field (rad for a distant object, or object height) }
     -> { S1 spherical, S2 coma, S3 astigmatism, S4 Petzval, S5 distortion, C1 axial colour, C2 lateral colour,
          perSurface: [{ S1 … }], W040, W131, W222, W220, W311 (in waves at nm), H (Lagrange invariant),
          tsa (third-order transverse spherical at the paraxial focus), lsa, petzvalRadius } */
  S.seidel = function (sys, opts) {
    opts = opts || {};
    const nm = opts.nm || 587.56, par = S.paraxial(sys, nm), Sf = sys.surfaces, last = Sf.length - 1;
    const so = sys.object == null ? Infinity : sys.object, n0 = O.index(sys.n0 == null ? 1 : sys.n0, nm);
    const field = opts.field != null ? opts.field : (sys.field || 0);
    let y, u, yb, ub;
    if (!Number.isFinite(so)) { y = par.epd / 2; u = 0; ub = Math.tan(field); yb = -ub * par.zEP; }
    else { u = (par.epd / 2) / (so + par.zEP); y = u * so; ub = -field / (so + par.zEP); yb = field + ub * so; }
    const m = ynu(sys, nm, y, u, 0, last), c = ynu(sys, nm, yb, ub, 0, last);
    const mF = ynu(sys, O.LINES.F, y, u, 0, last), mC = ynu(sys, O.LINES.C, y, u, 0, last);
    const Hinv = n0 * (ub * y - u * yb);
    const tot = { S1: 0, S2: 0, S3: 0, S4: 0, S5: 0, C1: 0, C2: 0 }, per = [];
    let petz = 0;                                   // Σ c·Δ(1/n): the Petzval sum, which needs no field
    for (let i = 0; i <= last; i++) {
      const s = Sf[i], cv = curv(s), a = m[i], b = c[i];
      const Ai = a.nIn * (a.uIn + a.y * cv), Bi = b.nIn * (b.uIn + b.y * cv);
      const dun = a.u / a.n - a.uIn / a.nIn, d1n = 1 / a.n - 1 / a.nIn;
      petz += cv * d1n;
      // dispersion of each medium: n_F − n_C, signed like the indices
      const dnIn = Math.abs(mF[i].nIn) - Math.abs(mC[i].nIn), dnOut = Math.abs(mF[i].n) - Math.abs(mC[i].n);
      const ddn = dnOut / Math.abs(a.n) - dnIn / Math.abs(a.nIn);
      const e = { S1: -Ai * Ai * a.y * dun, S2: -Ai * Bi * a.y * dun, S3: -Bi * Bi * a.y * dun, S4: -Hinv * Hinv * cv * d1n, S5: 0, C1: Ai * a.y * ddn, C2: Bi * a.y * ddn };
      e.S5 = Math.abs(Ai) > 1e-14 ? (Bi / Ai) * (e.S3 + e.S4) : 0;
      if (s.k || (s.A && s.A[0])) {      // the conic part of the surface, and the r⁴ term of an asphere (a₄ acts like k·c³/8)
        const dn = a.n - a.nIn, w = ((s.k || 0) * cv * cv * cv + 8 * ((s.A && s.A[0]) || 0)) * dn, y4 = a.y * a.y * a.y * a.y, q = b.y / (a.y || 1e-300);
        e.S1 += w * y4; e.S2 += w * y4 * q; e.S3 += w * y4 * q * q; e.S5 += w * y4 * q * q * q;
      }
      per.push(e);
      for (const k2 of Object.keys(tot)) tot[k2] += e[k2];
    }
    const lam = nm * 1e-6 * (opts.unit || 1);          // the wavelength in the prescription's unit (mm by default)
    const Lm = m[last], nu = Lm.n * Lm.u;
    return Object.assign(tot, { perSurface: per, H: Hinv, W040: tot.S1 / 8 / lam, W131: tot.S2 / 2 / lam, W222: tot.S3 / 2 / lam, W220: (tot.S3 + tot.S4) / 4 / lam, W311: tot.S5 / 2 / lam,
      tsa: Math.abs(nu) > 1e-14 ? tot.S1 / (2 * nu) : NaN, lsa: Math.abs(nu) > 1e-14 ? -tot.S1 / (2 * nu * Lm.u) : NaN,
      petzvalRadius: Math.abs(petz) > 1e-15 ? 1 / (Math.abs(Lm.n) * petz) : Infinity, petzvalSum: -petz, marginal: m, chief: c });
  };

  /* a copy of a system with every length multiplied by k (radii, thicknesses, apertures, aspheric terms) */
  S.scale = function (sys, k) {
    const out = Object.assign({}, sys, { surfaces: sys.surfaces.map(s => { const r = Object.assign({}, s); if (!flat(s.R)) r.R = s.R * k; if (s.t != null) r.t = s.t * k; if (s.sd != null) r.sd = s.sd * k; if (s.A) r.A = s.A.map((a, i) => a / Math.pow(k, 3 + 2 * i)); return r; }) });
    if (sys.epd != null) out.epd = sys.epd * k;
    if (Number.isFinite(sys.object)) out.object = sys.object * k;
    return out;
  };
  /* the same system scaled to a focal length */
  S.withFocal = function (sys, f, nm) { return S.scale(sys, Math.abs(f / S.paraxial(sys, nm).efl)); };     // a diverging system stays diverging
  /* the elements of a system for drawing: runs of surfaces with glass between them.
     -> [{ i0, i1, z0, z1, sd, glass }] (a cemented group is one element with several surfaces) */
  S.elements = function (sys) {
    const Sf = sys.surfaces, zs = S.vertices(sys), out = [];
    let start = -1;
    // "glass" is any medium denser than air that is not the medium the system sits in (a lens under water, the eye)
    const n0 = O.index(sys.n0 == null ? 1 : sys.n0, 587.56);
    const isGlass = s => { if (s.mirror || s.n == null) return false; const n = O.index(s.n, 587.56); return n > 1.01 && Math.abs(n - n0) > 0.02; };
    const close = i => { out.push({ i0: start, i1: i, z0: zs[start], z1: zs[i], sd: Math.max.apply(null, Sf.slice(start, i + 1).map(s => s.sd || 0)) }); start = -1; };
    for (let i = 0; i < Sf.length; i++) {
      if (Sf[i].mirror) { out.push({ mirror: true, i0: i, i1: i, z0: zs[i], z1: zs[i], sd: Sf[i].sd }); continue; }
      if (isGlass(Sf[i]) && start < 0) start = i;
      if (start >= 0 && !isGlass(Sf[i])) close(i);
    }
    // a system that ends inside a medium (the eye ends in the vitreous): its last element runs to the last surface
    if (start >= 0 && start < Sf.length - 1) close(Sf.length - 1);
    return out;
  };

  /* ================================================================ design helpers */
  const Dz = O.design = {};
  /* a singlet of focal length f: glass, shape factor q (0 equiconvex, 1 plano-convex with the curved side first,
     −1 flat side first), centre thickness t, diameter D */
  Dz.singlet = function (o) {
    const nm = o.nm || 587.56, n = O.index(o.glass || 'N-BK7', nm), q = o.q == null ? 0 : o.q, f = o.f || 100;
    const D = o.D || Math.abs(f) / 4, t = o.t != null ? o.t : Math.max(0.02 * Math.abs(f), 0.12 * D);
    const K = 1 / (f * (n - 1));
    const mk = scale => ({ name: o.name || 'Singlet', surfaces: [
      { R: (q + 1) === 0 ? 0 : 2 / (K * (q + 1)) * scale, t, n: o.glass || 'N-BK7', sd: D / 2, stop: true },
      { R: (q - 1) === 0 ? 0 : 2 / (K * (q - 1)) * scale, n: 1, sd: f < 0 ? D / 2 * 1.06 : D / 2 }] });       // a diverging lens spreads the beam: its back face is a little larger
    // the thickness shifts the focal length a little: rescale the radii until it is right
    let sc = 1, sys = mk(1);
    for (let i = 0; i < 6; i++) { const e = S.paraxial(sys, nm).efl; sc *= f / e; sys = mk(sc); }
    if (o.object != null) sys.object = o.object;
    return sys;
  };
  /* a cemented achromatic doublet: crown in front, flint behind, colours F and C brought to one focus and the
     bending chosen for the least third-order spherical aberration */
  Dz.achromat = function (o) {
    o = o || {};
    const f = o.f || 100, crown = o.crown || 'N-BK7', flint = o.flint || 'N-SF5', D = o.D || f / 4, nm = 587.56;
    const a1 = O.abbe(crown), a2 = O.abbe(flint);
    const dV = a1.vd - a2.vd;
    const P = 1 / f, P1 = P * a1.vd / dV, P2 = -P * a2.vd / dV;
    const sagOf = (c, h) => { const q = 1 - c * c * h * h; return q <= 0 ? NaN : c * h * h / (1 + Math.sqrt(q)); };
    // for one bending c1 and one diameter: the doublet, with thicknesses that leave an edge on both elements,
    // or null when a surface is too steep to reach the rim
    let trim = 0;                                    // a small correction to the thin-lens split of power
    const mk = (c1, sc, Dd) => {
      const Pa = P1 * (1 + trim), Pb = P - Pa;
      const k1 = c1 / sc, k2 = (c1 - Pa / (a1.nd - 1)) / sc, k3 = (c1 - Pa / (a1.nd - 1) - Pb / (a2.nd - 1)) / sc, h = Dd / 2;
      const s1 = sagOf(k1, h * 1.03), s2 = sagOf(k2, h * 1.03), s3 = sagOf(k3, h * 1.03);
      if (!(Number.isFinite(s1) && Number.isFinite(s2) && Number.isFinite(s3))) return null;
      const edge = Math.max(0.05 * Dd, 0.008 * Math.abs(f));
      const t1 = o.t1 || Math.max(0.07 * Dd, edge + s1 - s2), t2 = o.t2 || Math.max(0.07 * Dd, edge + s2 - s3);
      const R = k => Math.abs(k) < 1e-12 ? 0 : 1 / k;
      return { name: o.name || 'Cemented achromat', surfaces: [{ R: R(k1), t: t1, n: crown, sd: h, stop: true }, { R: R(k2), t: t2, n: flint, sd: h }, { R: R(k3), n: 1, sd: h }] };
    };
    const fit = (c1, Dd) => { let sc = 1, sys = mk(c1, 1, Dd); for (let i = 0; i < 6 && sys; i++) { const e = S.paraxial(sys, nm).efl; if (!Number.isFinite(e) || e === 0) return null; sc *= f / e; if (!(sc > 0.2 && sc < 5)) return null; sys = mk(c1, sc, Dd); } return sys; };
    const cost = (c1, Dd) => { const sys = fit(c1, Dd); if (!sys) return 1e9; const s = S.seidel(sys, { nm }); return Number.isFinite(s.S1) ? Math.abs(s.S1) : 1e9; };
    const search = Dd => {
      const lo = 0.05 * P1 / (a1.nd - 1), hi = 1.2 * P1 / (a1.nd - 1);
      let best = (lo + hi) / 2, bc = Infinity, step = (hi - lo) / 160;
      for (let i = 0; i <= 160; i++) { const c1 = lo + (hi - lo) * i / 160, v = cost(c1, Dd); if (v < bc) { bc = v; best = c1; } }
      for (let it = 0; it < 26 && bc < 1e9; it++) { step /= 2; for (const c1 of [best - step, best + step]) { const v = cost(c1, Dd); if (v < bc) { bc = v; best = c1; } } }
      if (bc >= 1e9) return null;
      // thick elements shift the colours a little: trim the split until F and C focus together, then bend again
      const colour = () => { const y = fit(best, Dd); return y ? S.paraxial(y, O.LINES.F).zImage - S.paraxial(y, O.LINES.C).zImage : NaN; };
      for (let round = 0; round < 2; round++) {
        let t0 = trim, e0 = colour(); trim = t0 + 0.004; let e1 = colour();
        for (let it = 0; it < 6 && Number.isFinite(e1) && Math.abs(e1) > 1e-7 * Math.abs(f) && e1 !== e0; it++) { const t2 = trim - e1 * (trim - t0) / (e1 - e0); t0 = trim; e0 = e1; trim = O.clamp(t2, -0.3, 0.3); e1 = colour(); }
        if (!Number.isFinite(e1)) { trim = 0; break; }
        let st2 = step * 8; bc = cost(best, Dd);
        for (let it = 0; it < 22; it++) { st2 /= 2; for (const c1 of [best - st2, best + st2]) { const v = cost(c1, Dd); if (v < bc) { bc = v; best = c1; } } }
      }
      return fit(best, Dd);
    };
    // glasses too alike in dispersion need element powers no lens can have: say so rather than return nonsense
    let sys = null, Dd = D;
    if (Math.abs(dV) >= 3) for (let i = 0; i < 9 && !sys; i++) { trim = 0; sys = search(Dd); if (!sys) Dd *= 0.8; }
    if (!sys) { sys = Dz.singlet({ f, glass: crown, q: O.bestFormShape(a1.nd), D }); sys.name = 'Singlet (no achromat can be made of these two glasses)'; sys.feasible = false; Dd = D; }
    else sys.feasible = true;
    sys.D = Dd; sys.dV = dV; sys.powers = sys.feasible ? [P1 * (1 + trim), P - P1 * (1 + trim)] : [P, 0];
    if (o.object != null) sys.object = o.object;
    return sys;
  };
  /* a Newtonian telescope mirror: a paraboloid of focal length f and diameter D */
  Dz.newtonian = function (o) { const f = o.f || 1000, D = o.D || 200; return { name: 'Parabolic mirror', surfaces: [{ R: -2 * f, k: o.k == null ? -1 : o.k, mirror: true, sd: D / 2, stop: true, t: -f }] }; };
  /* a classical Cassegrain: parabolic primary of focal length f1 and diameter D, a hyperbolic secondary that
     multiplies the focal length by m, final focus a distance b behind the primary's vertex */
  Dz.cassegrain = function (o) {
    const f1 = o.f1 || 800, m = o.m || 4, b = o.b == null ? 150 : o.b, D = o.D || 200;
    const p = (f1 + b) / (m + 1), d = f1 - p, q = m * p;
    const R2 = -2 * p * m / (m - 1), k2 = -Math.pow((m + 1) / (m - 1), 2);
    return { name: 'Cassegrain telescope', surfaces: [
      { R: -2 * f1, k: -1, mirror: true, sd: D / 2, stop: true, t: -d },
      { R: R2, k: k2, mirror: true, sd: D / 2 * p / f1 * 1.1 + 0.006 * d, t: q }], f: m * f1, d, q };       // the secondary is oversized for a field of about ±0.3°
  };
  /* two thin lenses as a system (for the telephoto, the retrofocus and zoom models): ideal thin lenses are
     drawn as paraxial surfaces by giving them the index of a thin, strong shell */
  Dz.thin = function (f, sd) {            // a "perfect" thin lens as two surfaces enclosing a sliver of dense glass
    const n = 1.5, t = 1e-6;
    return [{ R: 2 * (n - 1) * f, t, n, sd: sd || Math.abs(f) / 5 }, { R: -2 * (n - 1) * f, n: 1, sd: sd || Math.abs(f) / 5 }];
  };
  Dz.twoLens = function (o) {
    const a = Dz.thin(o.f1, o.sd1), b = Dz.thin(o.f2, o.sd2);
    a[1].t = o.d; a[0].stop = true;
    return { name: o.name || 'Two thin lenses', surfaces: a.concat(b) };
  };
  /* a two-group zoom (positive front, negative rear, or the reverse): the spacing and the back focal distance
     that give a focal length F: -> { d, bfd, total } */
  Dz.zoom2 = function (f1, f2, F) { const d = f1 + f2 - f1 * f2 / F; return { d, bfd: F * (1 - d / f1), total: d + F * (1 - d / f1) }; };

  /* ================================================================ a library of prescriptions (mm) */
  const LIB = O.LENSES = {
    'biconvex':     () => Dz.singlet({ f: 100, q: 0, D: 25.4, t: 5, name: 'Biconvex singlet, f = 100 mm' }),
    'plano-convex': () => Dz.singlet({ f: 100, q: 1, D: 25.4, t: 4.5, name: 'Plano-convex singlet, curved side to the far object' }),
    'convex-plano-reversed': () => Dz.singlet({ f: 100, q: -1, D: 25.4, t: 4.5, name: 'Plano-convex singlet, the wrong way round' }),
    'best-form':    () => Dz.singlet({ f: 100, q: O.bestFormShape(1.5168), D: 25.4, t: 4.5, name: 'Best-form singlet' }),
    'meniscus':     () => Dz.singlet({ f: 100, q: 2.2, D: 25.4, t: 4, name: 'Positive meniscus' }),
    'biconcave':    () => Dz.singlet({ f: -100, q: 0, D: 25.4, t: 3, name: 'Biconcave singlet, f = −100 mm' }),
    'achromat':     () => ({ name: 'Cemented achromat, f = 100 mm (a typical catalogue doublet)', surfaces: [
      { R: 62.8, t: 4.0, n: 'N-BK7', sd: 12.7, stop: true }, { R: -45.7, t: 2.5, n: 'N-SF5', sd: 12.7 }, { R: -128.2, n: 1, sd: 12.7 }] }),
    'cooke-triplet': () => ({ name: 'Cooke triplet, f = 50 mm, f/5', field: 20 * D2R, surfaces: [
      { R: 22.01359, t: 3.25896, n: 'N-SK16', sd: 9.5 }, { R: -435.76044, t: 6.00755, n: 1, sd: 9.5 },
      { R: -22.21328, t: 0.99997, n: 'F2', sd: 5 }, { R: 20.29192, t: 4.75041, n: 1, sd: 3.80, stop: true },
      { R: 79.68360, t: 2.95208, n: 'N-SK16', sd: 7.5 }, { R: -18.39533, n: 1, sd: 7.5 }] }),
    'double-gauss': () => ({ name: 'Double Gauss, f = 100 mm, f/3', field: 14 * D2R, surfaces: [
      { R: 54.15325, t: 8.746658, n: 'N-SK2', sd: 29.2 }, { R: 152.52192, t: 0.5, n: 1, sd: 28.1 },
      { R: 35.95062, t: 14.0, n: 'N-SK16', sd: 24.3 }, { R: 0, t: 3.776966, n: 'F5', sd: 21.3 }, { R: 22.26992, t: 14.25306, n: 1, sd: 15.0 },
      { R: 0, t: 12.42813, n: 1, sd: 9.98, stop: true },
      { R: -25.68503, t: 3.776966, n: 'F5', sd: 13.2 }, { R: 0, t: 10.83393, n: 'N-SK16', sd: 16.5 }, { R: -36.98022, t: 0.5, n: 1, sd: 18.9 },
      { R: 196.41733, t: 6.858175, n: 'N-SK16', sd: 21.3 }, { R: -67.14755, n: 1, sd: 21.6 }] }),
    'parabolic-mirror': () => Dz.newtonian({ f: 1000, D: 200 }),
    'spherical-mirror': () => Object.assign(Dz.newtonian({ f: 1000, D: 200, k: 0 }), { name: 'Spherical mirror' }),
    'cassegrain':   () => Dz.cassegrain({ f1: 800, m: 4, b: 150, D: 200 }),
    // Le Grand's theoretical eye with Navarro's conic surfaces; the image forms in the vitreous, on the retina
    'eye':          () => ({ name: 'Schematic eye (relaxed)', surfaces: [
      { R: 7.8, k: -0.26, t: 0.55, n: 'cornea', sd: 5.5 }, { R: 6.5, t: 3.05, n: 'aqueous', sd: 5.0 },
      { R: 10.2, k: -3.13, t: 4.0, n: 'eye-lens', sd: 2.0, stop: true }, { R: -6.0, k: -1.0, n: 'vitreous', sd: 4.5 }], retina: 16.6 })
  };
  O.lens = function (id) { const f = LIB[id]; if (!f) throw new Error('Unknown lens "' + id + '"'); return f(); };
})(typeof window !== 'undefined' ? window : globalThis);
