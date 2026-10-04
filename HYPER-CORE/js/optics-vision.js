/* HYPER-CORE · optics-vision.js
 *
 * Light as people and cameras meet it, added to Hyper.optics (kit.optics): radiometry and photometry, lamp
 * families and their spectra, lamp bases, colour (CIE 1931, sRGB, CIELAB, an approximate Munsell system, colour-
 * vision deficiencies), cameras (sensor formats, lens mounts, field of view, depth of field, exposure, noise,
 * zoom), the eye and spectacles, scanners, beam shaping, and optical fibres. Load after optics.js.
 * Wavelengths in nanometres, angles in radians, lengths in metres unless a name says otherwise (camera
 * functions use millimetres, as lens data do; pixel pitch in µm).
 *
 *   O.photo.{V, Vscotopic, efficacy, lumens, planck, wien, illuminance, solidAngle, etendue, imageIlluminance,
 *            spectrum, SOURCES, LEVELS, LUMINANCES}      O.LAMPS   O.BASES   O.BULBS
 *   O.colour.{cmf, xyz, xy, toRgb, srgb, css, wavelength, cct, planckXY, lab, fromLab, deltaE, munsell,
 *             munsellParse, cvd, mix, white}
 *   O.cam.{SENSORS, MOUNTS, sensor, mount, fov, focalFor, crop, coc, hyperfocal, dof, magnification, extension,
 *          workingFNumber, ev, exposureTime, photons, snr, dynamicRange, dataRate, motionBlur, distortion,
 *          cos4, digitalZoom, resample, pixelsOnTarget, adapter}
 *   O.eye.{accommodation, nearPoint, vertex, transpose, sphericalEquivalent, meridian, prentice, letterHeight,
 *          snellen, logmar, blurAngle, acuityFromDefocus, pupil, csf, pal, spectacleMag, FIELD, CONES, DATA}
 *   O.scan.{…}   O.shape.{…}   O.fibre.{…}   O.od   O.transmittance   O.beer   O.dB
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};
  const O = H.optics = H.optics || {};
  const PI = Math.PI, D2R = PI / 180;
  const kB = 1.380649e-23, hP = 6.62607015e-34, c0 = 299792458;

  O.od = T => -Math.log10(T);                         // optical density of a transmittance
  O.transmittance = od => Math.pow(10, -od);
  O.beer = (alpha, d) => Math.exp(-alpha * d);        // internal transmittance: absorption coefficient × thickness
  O.dB = ratio => 10 * Math.log10(ratio);

  /* ================================================================ colour */
  const Cl = O.colour = {};
  // the CIE 1931 2° standard observer, 380 to 780 nm in steps of 10 nm: x̄, ȳ, z̄ (each column sums to 10.68)
  const CMF = [[0.0014, 0.0000, 0.0065], [0.0042, 0.0001, 0.0201], [0.0143, 0.0004, 0.0679], [0.0435, 0.0012, 0.2074], [0.1344, 0.0040, 0.6456], [0.2839, 0.0116, 1.3856],
    [0.3483, 0.0230, 1.7471], [0.3362, 0.0380, 1.7721], [0.2908, 0.0600, 1.6692], [0.1954, 0.0910, 1.2876], [0.0956, 0.1390, 0.8130], [0.0320, 0.2080, 0.4652],
    [0.0049, 0.3230, 0.2720], [0.0093, 0.5030, 0.1582], [0.0633, 0.7100, 0.0782], [0.1655, 0.8620, 0.0422], [0.2904, 0.9540, 0.0203], [0.4334, 0.9950, 0.0087],
    [0.5945, 0.9950, 0.0039], [0.7621, 0.9520, 0.0021], [0.9163, 0.8700, 0.0017], [1.0263, 0.7570, 0.0011], [1.0622, 0.6310, 0.0008], [1.0026, 0.5030, 0.0003],
    [0.8544, 0.3810, 0.0002], [0.6424, 0.2650, 0.0000], [0.4479, 0.1750, 0.0000], [0.2835, 0.1070, 0.0000], [0.1649, 0.0610, 0.0000], [0.0874, 0.0320, 0.0000],
    [0.0468, 0.0170, 0.0000], [0.0227, 0.0082, 0.0000], [0.0114, 0.0041, 0.0000], [0.0058, 0.0021, 0.0000], [0.0029, 0.0010, 0.0000], [0.0014, 0.0005, 0.0000],
    [0.0007, 0.0002, 0.0000], [0.0003, 0.0001, 0.0000], [0.0002, 0.0001, 0.0000], [0.0001, 0.0000, 0.0000], [0.0000, 0.0000, 0.0000]];
  /* the CIE 1931 2° colour-matching functions [x̄, ȳ, z̄] at a wavelength (the standard table, smoothly interpolated) */
  Cl.cmf = function (nm) {
    if (!(nm >= 380) || nm > 780) return [0, 0, 0];
    const t = (nm - 380) / 10, i = Math.min(39, Math.floor(t)), f = t - i;
    const at = k => CMF[k < 0 ? 0 : k > 40 ? 40 : k], p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2), out = [0, 0, 0];
    // linear near the ends of the table (where the values are a few ten-thousandths), Catmull–Rom elsewhere
    for (let c = 0; c < 3; c++) out[c] = Math.max(0, 0.5 * (2 * p1[c] + (-p0[c] + p2[c]) * f + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * f * f + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * f * f * f));
    return out;
  };
  /* the chromaticity of one wavelength: the point of the spectral locus (380–700 nm; beyond 700 it no longer moves) */
  // the four-decimal table is too coarse for the two ends of the locus, so those are tied to the published points
  Cl.locus = function (nm) {
    nm = O.clamp(nm, 380, 700);
    if (nm >= 695) return [0.7347, 0.2653];
    if (nm < 400) { const a = Cl.xy(Cl.cmf(400)), t = (nm - 380) / 20; return [0.1741 + (a[0] - 0.1741) * t, 0.0050 + (a[1] - 0.0050) * t]; }
    return Cl.xy(Cl.cmf(nm));
  };
  /* tristimulus values of a spectrum: a function of nm, or [[nm, power] …]. Y is normalised to 1 for the
     spectrum itself unless `absolute` */
  Cl.xyz = function (spec, absolute) {
    let X = 0, Y = 0, Z = 0;
    const add = (nm, p, w) => { const m = Cl.cmf(nm); X += p * m[0] * w; Y += p * m[1] * w; Z += p * m[2] * w; };
    if (typeof spec === 'function') for (let nm = 380; nm <= 780; nm += 2) add(nm, spec(nm), 2);
    else for (let i = 0; i < spec.length; i++) { const w = spec.length > 1 ? (spec[Math.min(i + 1, spec.length - 1)][0] - spec[Math.max(i - 1, 0)][0]) / 2 : 1; add(spec[i][0], spec[i][1], w); }   // trapezoid rule
    if (!absolute && Y > 0) { X /= Y; Z /= Y; Y = 1; }
    return [X, Y, Z];
  };
  Cl.xy = function (XYZ) { const s = XYZ[0] + XYZ[1] + XYZ[2] || 1e-300; return [XYZ[0] / s, XYZ[1] / s]; };
  Cl.white = [0.95047, 1, 1.08883];                  // D65
  /* XYZ -> linear sRGB (may fall outside 0…1 when the colour is outside the gamut) */
  Cl.toRgb = XYZ => [3.2406 * XYZ[0] - 1.5372 * XYZ[1] - 0.4986 * XYZ[2], -0.9689 * XYZ[0] + 1.8758 * XYZ[1] + 0.0415 * XYZ[2], 0.0557 * XYZ[0] - 0.2040 * XYZ[1] + 1.0570 * XYZ[2]];
  Cl.fromRgb = r => [0.4124 * r[0] + 0.3576 * r[1] + 0.1805 * r[2], 0.2126 * r[0] + 0.7152 * r[1] + 0.0722 * r[2], 0.0193 * r[0] + 0.1192 * r[1] + 0.9505 * r[2]];
  const enc = v => v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055;
  const dec = v => v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  /* linear RGB -> display values 0…255 (clipped) */
  Cl.srgb = lin => lin.map(v => Math.round(255 * O.clamp(enc(O.clamp(v, 0, 1)), 0, 1)));
  Cl.linear = rgb255 => rgb255.map(v => dec(v / 255));
  /* bring an out-of-gamut linear RGB inside by adding white (desaturating), then scale so the largest is ≤ 1 */
  Cl.fit = function (lin, bright) {
    const lo = Math.min(lin[0], lin[1], lin[2]);
    let r = lo < 0 ? lin.map(v => v - lo) : lin.slice();
    const hi = Math.max(r[0], r[1], r[2]);
    if (bright && hi > 0) r = r.map(v => v / hi * bright); else if (hi > 1) r = r.map(v => v / hi);
    return r;
  };
  Cl.css = function (lin, alpha) { const s = Cl.srgb(lin); return alpha == null ? 'rgb(' + s.join(',') + ')' : 'rgba(' + s.join(',') + ',' + alpha + ')'; };
  /* the colour of a single wavelength for drawing rays and spectra: -> [r, g, b] 0…255. Outside the visible
     the result fades to a dim violet (UV) or a dim red (IR) so that invisible rays can still be drawn. */
  Cl.wavelength = function (nm) {
    // the hue is taken between 380 and 700 nm (deep red keeps one hue); colours a display cannot show are clipped
    const vis = O.clamp(nm, 380, 700), raw = Cl.toRgb(Cl.cmf(vis)).map(v => Math.max(0, v)), top = Math.max(raw[0], raw[1], raw[2]) || 1, lin = raw.map(v => v / top);
    // the eye's response falls away at the ends of the spectrum
    let f = 1;
    if (nm < 420) f = 0.35 + 0.65 * Math.max(0, (nm - 380) / 40); else if (nm > 680) f = 0.35 + 0.65 * Math.max(0, (780 - nm) / 100);
    if (nm < 380) return [120, 70, 150];
    if (nm > 780) return [140, 40, 40];
    return Cl.srgb(lin.map(v => v * f));
  };
  Cl.nmCss = function (nm, alpha) { const s = Cl.wavelength(nm); return alpha == null ? 'rgb(' + s.join(',') + ')' : 'rgba(' + s.join(',') + ',' + alpha + ')'; };
  /* correlated colour temperature from chromaticity (McCamy's formula; good from about 2000 to 12 500 K) */
  Cl.cct = function (x, y) { const n = (x - 0.3320) / (0.1858 - y); return 449 * n * n * n + 3525 * n * n + 6823.3 * n + 5520.33; };
  Cl.planckXY = T => Cl.xy(Cl.xyz(nm => O.photo.planck(nm, T)));
  /* Is this chromaticity a "white", and of what colour temperature? The nearest point of the black-body curve in the
     CIE 1960 (u, v) diagram: -> { cct, duv (distance from the curve; + is greenish, − pinkish), white (|duv| < 0.02
     and 1500–20 000 K) }. Use this rather than Cl.cct when the light may not be white at all. */
  let PLANCK = null;
  const uvOf = (x, y) => { const d = -2 * x + 12 * y + 3; return [4 * x / d, 6 * y / d]; };
  Cl.cctDuv = function (x, y) {
    if (!PLANCK) { PLANCK = []; for (let i = 0; i <= 150; i++) { const T = 1000 * Math.pow(40, i / 150), p = Cl.planckXY(T), q = uvOf(p[0], p[1]); PLANCK.push([T, q[0], q[1]]); } }
    const p = uvOf(x, y);
    let best = 0, bd = Infinity;
    for (let i = 0; i < PLANCK.length; i++) { const d = Math.hypot(PLANCK[i][1] - p[0], PLANCK[i][2] - p[1]); if (d < bd) { bd = d; best = i; } }
    // refine between the neighbours by projecting on the segment
    let T = PLANCK[best][0], d = bd, sign = p[1] >= PLANCK[best][2] ? 1 : -1;
    for (const j of [best - 1, best + 1]) {
      if (j < 0 || j >= PLANCK.length) continue;
      const a = PLANCK[best], b = PLANCK[j], ex = b[1] - a[1], ey = b[2] - a[2], L2 = ex * ex + ey * ey || 1e-30;
      const t = O.clamp(((p[0] - a[1]) * ex + (p[1] - a[2]) * ey) / L2, 0, 1), qx = a[1] + t * ex, qy = a[2] + t * ey, dd = Math.hypot(p[0] - qx, p[1] - qy);
      if (dd < d) { d = dd; T = a[0] * Math.pow(b[0] / a[0], t); sign = p[1] >= qy ? 1 : -1; }
    }
    return { cct: T, duv: sign * d, white: d < 0.02 && T >= 1500 && T <= 20000 };
  };
  /* CIELAB (D65 white unless given) */
  const fL = t => t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116;
  const fLi = t => t * t * t > 216 / 24389 ? t * t * t : (116 * t - 16) / (24389 / 27);
  Cl.lab = function (XYZ, w) { w = w || Cl.white; const fx = fL(XYZ[0] / w[0]), fy = fL(XYZ[1] / w[1]), fz = fL(XYZ[2] / w[2]); return [116 * fy - 16, 500 * (fx - fy), 200 * (fy - fz)]; };
  Cl.fromLab = function (lab, w) { w = w || Cl.white; const fy = (lab[0] + 16) / 116, fx = fy + lab[1] / 500, fz = fy - lab[2] / 200; return [w[0] * fLi(fx), w[1] * fLi(fy), w[2] * fLi(fz)]; };
  Cl.deltaE = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);          // CIE 1976
  Cl.labOfRgb = rgb255 => Cl.lab(Cl.fromRgb(Cl.linear(rgb255)));
  /* additive mixture of lights given as [r, g, b] 0…255: sums in linear light */
  Cl.mix = function (list) { const s = [0, 0, 0]; for (const c of list) { const l = Cl.linear(c); s[0] += l[0]; s[1] += l[1]; s[2] += l[2]; } return Cl.srgb(s); };

  /* The Munsell system, approximately. A Munsell colour is hue (0…100: 5 = 5R, 15 = 5YR, 25 = 5Y, 35 = 5GY,
     45 = 5G, 55 = 5BG, 65 = 5B, 75 = 5PB, 85 = 5P, 95 = 5RP), value (0 black … 10 white) and chroma (0 grey
     upward). The exact renotation is a measured table; here value is exact (the ASTM D1535 polynomial) and hue
     and chroma are mapped through CIELAB, which is close enough to draw the colour solid and its wheel.
     -> { rgb: [r, g, b], inGamut, lab, Y } */
  const HUE_ANCHOR = [[5, 24], [15, 58], [25, 92], [35, 118], [45, 160], [55, 196], [65, 233], [75, 273], [85, 310], [95, 347]];
  Cl.MUNSELL_HUES = ['R', 'YR', 'Y', 'GY', 'G', 'BG', 'B', 'PB', 'P', 'RP'];
  Cl.munsellValueY = V => (1.1914 * V - 0.22533 * V * V + 0.23352 * V * V * V - 0.020484 * Math.pow(V, 4) + 0.00081939 * Math.pow(V, 5)) / 100;
  Cl.munsellHueAngle = function (h) {
    h = ((h % 100) + 100) % 100;
    const a = HUE_ANCHOR;
    for (let i = 0; i < a.length; i++) {
      const p = a[i], q = a[(i + 1) % a.length];
      const h1 = q[0] + (i === a.length - 1 ? 100 : 0), ang1 = q[1] + (i === a.length - 1 ? 360 : 0);
      const hh = h < a[0][0] ? h + 100 : h;
      if (hh >= p[0] && hh <= h1) return (p[1] + (ang1 - p[1]) * (hh - p[0]) / (h1 - p[0])) % 360;
    }
    return 0;
  };
  Cl.munsell = function (h, V, Cm) {
    const Y = Cl.munsellValueY(V), L = 116 * fL(Y) - 16, ang = Cl.munsellHueAngle(h) * D2R, Cs = 5 * (Cm || 0);
    const lab = [L, Cs * Math.cos(ang), Cs * Math.sin(ang)], lin = Cl.toRgb(Cl.fromLab(lab));
    const inGamut = lin.every(v => v >= -0.002 && v <= 1.002);
    return { rgb: Cl.srgb(lin), inGamut, lab, Y };
  };
  /* "5R 4/14", "2.5YR 6/8", "N 5/" -> { h (0…100), V, C, text } */
  Cl.munsellParse = function (s) {
    const m = /^\s*(?:N\s*([\d.]+)\s*\/?|([\d.]+)\s*(RP|YR|GY|BG|PB|R|Y|G|B|P)\s+([\d.]+)\s*\/\s*([\d.]+))\s*$/i.exec(String(s));
    if (!m) return null;
    if (m[1] != null) return { h: 0, V: +m[1], C: 0, text: 'N ' + m[1] + '/' };
    const i = Cl.MUNSELL_HUES.indexOf(m[3].toUpperCase());
    return { h: i * 10 + +m[2], V: +m[4], C: +m[5], text: m[2] + m[3].toUpperCase() + ' ' + m[4] + '/' + m[5] };
  };
  Cl.munsellName = function (h, V, Cm) { h = ((h % 100) + 100) % 100; const i = Math.floor(h / 10) % 10, step = h - i * 10; const st = step === 0 ? 10 : step; const idx = step === 0 ? (i + 9) % 10 : i; return (Cm ? (Math.round(st * 10) / 10) + Cl.MUNSELL_HUES[idx] + ' ' : 'N ') + V + '/' + (Cm || ''); };

  /* colour-vision deficiency simulated on an [r, g, b] 0…255 colour (Machado, Oliveira and Fernandes, 2009).
     type: 'protan' | 'deutan' | 'tritan' | 'achroma'; severity 0…1 (1 = the dichromat) */
  const CVD = {
    protan: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
    deutan: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.011820, 0.042940, 0.968881]],
    tritan: [[1.255528, -0.076749, -0.178779], [-0.078411, 0.930809, 0.147602], [0.004733, 0.691367, 0.303900]],
    achroma: [[0.2126, 0.7152, 0.0722], [0.2126, 0.7152, 0.0722], [0.2126, 0.7152, 0.0722]]
  };
  Cl.cvd = function (rgb, type, severity) {
    const Mx = CVD[type]; if (!Mx) return rgb.slice();
    const s = severity == null ? 1 : O.clamp(severity, 0, 1), l = Cl.linear(rgb);
    const o = Mx.map((r, i) => (1 - s) * l[i] + s * (r[0] * l[0] + r[1] * l[1] + r[2] * l[2]));
    return Cl.srgb(o);
  };
  Cl.CVD_INFO = [
    { id: 'protan', name: 'Protan (L cones: "red-weak")', share: 'about 2 % of men' }, { id: 'deutan', name: 'Deutan (M cones: "green-weak")', share: 'about 6 % of men' },
    { id: 'tritan', name: 'Tritan (S cones: blue–yellow)', share: 'about 1 in 10 000 people' }, { id: 'achroma', name: 'Achromatopsia (no cone colour)', share: 'about 1 in 30 000 people' }
  ];

  /* ================================================================ radiometry and photometry */
  const Ph = O.photo = {};
  Ph.Km = 683; Ph.KmScotopic = 1700;
  Ph.V = nm => Cl.cmf(nm)[1];                                          // the photopic sensitivity of the eye
  Ph.Vscotopic = nm => 0.992 * Math.exp(-321.9 * Math.pow(nm / 1000 - 0.503, 2));     // night (rod) vision
  Ph.efficacy = nm => 683 * Ph.V(nm);                                  // lumens per watt of light at one wavelength
  /* Planck's law: spectral radiance, W/(m²·sr·nm) */
  Ph.planck = function (nm, T) { const l = nm * 1e-9, x = hP * c0 / (l * kB * T); return x > 700 ? 0 : 2 * hP * c0 * c0 / Math.pow(l, 5) / (Math.exp(x) - 1) * 1e-9; };
  Ph.wien = T => 2.897771955e6 / T;                                    // peak wavelength, nm
  /* luminous efficacy of radiation (lm per optical watt) of a spectrum (a function of nm), within [lo, hi] */
  Ph.ler = function (spec, lo, hi) {
    lo = lo || 250; hi = hi || 3000;
    let p = 0, v = 0; const step = 2;
    for (let nm = lo; nm <= hi; nm += step) { const s = spec(nm); p += s; if (nm >= 380 && nm <= 780) v += s * Ph.V(nm); }
    return p > 0 ? 683 * v / p : 0;
  };
  Ph.lumens = (watts, nm) => watts * Ph.efficacy(nm);
  Ph.illuminance = (I, d, theta) => I * Math.cos(theta || 0) / (d * d);   // lux from a point source of I candela
  Ph.solidAngle = half => 2 * PI * (1 - Math.cos(half));               // of a cone of half-angle `half`
  Ph.candelaFromLumens = (lm, half) => lm / Ph.solidAngle(half);       // an even beam of that half-angle
  Ph.lambertExitance = L => PI * L;                                    // lm/m² leaving a Lambertian surface of luminance L
  Ph.luminanceOfSurface = (E, rho) => E * (rho == null ? 1 : rho) / PI;   // cd/m² of a matt surface lit with E lux
  Ph.etendue = (area, half, n) => PI * area * Math.pow((n || 1) * Math.sin(half), 2);
  /* illuminance on a camera's sensor from a scene of luminance L (cd/m²): f-number N, transmission T, magnification m, field angle */
  Ph.imageIlluminance = (L, N, T, m, theta) => PI * L * (T == null ? 1 : T) * Math.pow(Math.cos(theta || 0), 4) / (4 * N * N * Math.pow(1 + (m || 0), 2));
  Ph.inverseSquare = (E1, d1, d2) => E1 * d1 * d1 / (d2 * d2);
  // typical illuminances (lux) and luminances (cd/m²)
  Ph.LEVELS = [['Direct sunlight', 100000], ['Full daylight, not in the sun', 20000], ['Overcast day', 5000], ['Operating theatre', 50000], ['Fine assembly, inspection', 1000], ['Office', 500], ['Corridor', 100], ['Living room', 100], ['Street lighting', 10], ['Twilight', 1], ['Full moon', 0.25], ['Starlight', 0.001]];
  Ph.LUMINANCES = [['The Sun\'s disc', 1.6e9], ['Tungsten filament', 1e7], ['LED die', 1e7], ['Fluorescent tube', 1e4], ['Clear blue sky', 5000], ['Phone or monitor screen', 300], ['White paper in an office', 120], ['Moon\'s disc', 2500], ['Night sky', 0.001]];

  /* schematic spectra of light sources: O.photo.spectrum(id) -> function of nm (relative power per nm) */
  const gs = (nm, mu, sig) => Math.exp(-0.5 * Math.pow((nm - mu) / sig, 2));
  const bb = T => nm => Ph.planck(nm, T) / Ph.planck(Ph.wien(T), T);
  const lines = (list, base) => nm => { let s = base ? base(nm) : 0; for (const [mu, a, sig] of list) s += a * gs(nm, mu, sig || 2.5); return s; };
  Ph.SOURCES = {
    'incandescent': { name: 'Incandescent lamp (2700 K)', f: bb(2700) },
    'halogen':      { name: 'Tungsten–halogen lamp (3000 K)', f: bb(3000) },
    'candle':       { name: 'Candle flame (1850 K)', f: bb(1850) },
    'sun':          { name: 'Sunlight (5800 K)', f: bb(5800) },
    'daylight':     { name: 'Daylight, overcast (6500 K)', f: bb(6500) },
    'xenon':        { name: 'Xenon arc (about 6000 K)', f: lines([[823, 0.35, 4], [882, 0.5, 4], [918, 0.3, 4], [980, 0.3, 5]], bb(6000)) },
    'led-warm':     { name: 'White LED, warm (about 2700–3000 K)', f: nm => 0.42 * gs(nm, 452, 10) + gs(nm, 605, 58) },
    'led-neutral':  { name: 'White LED, neutral (about 4000 K)', f: nm => 0.70 * gs(nm, 450, 10) + gs(nm, 580, 60) },
    'led-cool':     { name: 'White LED, cool (about 6500 K)', f: nm => 1.25 * gs(nm, 448, 10) + gs(nm, 555, 55) },
    'fluorescent':  { name: 'Fluorescent tube (triphosphor, about 4000 K)', f: lines([[404.7, 0.14], [435.8, 0.55], [487, 0.30, 6], [545, 1.0, 4], [585, 0.22, 7], [611, 0.74, 4], [627, 0.18, 6], [707, 0.05, 4]], nm => 0.04 * gs(nm, 540, 90)) },
    'cfl':          { name: 'Compact fluorescent (2700 K)', f: lines([[404.7, 0.07], [435.8, 0.25], [487, 0.14, 6], [545, 0.9, 4], [585, 0.25, 7], [611, 1.0, 4], [627, 0.3, 6], [707, 0.08, 4]], nm => 0.04 * gs(nm, 590, 90)) },
    'mercury':      { name: 'Mercury vapour lamp (clear)', f: lines([[365, 0.5], [404.7, 0.45], [435.8, 0.9], [546.1, 1.0], [577, 0.45], [579.1, 0.45]]) },
    'metal-halide': { name: 'Metal halide lamp', f: lines([[420, 0.4, 5], [435.8, 0.5], [475, 0.35, 8], [535, 0.9, 5], [546.1, 0.6], [569, 0.5, 5], [589, 0.8, 6], [616, 0.6, 8], [671, 0.3, 5]], nm => 0.25 * gs(nm, 540, 110)) },
    'sodium-hp':    { name: 'High-pressure sodium lamp', f: nm => Math.max(0, 0.9 * gs(nm, 575, 12) + 1.0 * gs(nm, 603, 14) - 0.75 * gs(nm, 589, 3.5)) + 0.25 * gs(nm, 498, 3) + 0.3 * gs(nm, 568, 3) + 0.25 * gs(nm, 616, 3) + 0.08 * gs(nm, 620, 80) },
    'sodium-lp':    { name: 'Low-pressure sodium lamp', f: lines([[589.0, 1, 1.2], [589.6, 0.9, 1.2]]) },
    'led-red':      { name: 'Red LED (630 nm)', f: nm => gs(nm, 630, 8) },
    'led-amber':    { name: 'Amber LED (590 nm)', f: nm => gs(nm, 590, 7) },
    'led-green':    { name: 'Green LED (525 nm)', f: nm => gs(nm, 525, 14) },
    'led-blue':     { name: 'Blue LED (465 nm)', f: nm => gs(nm, 465, 10) },
    'led-rgb':      { name: 'RGB LED white', f: nm => 0.8 * gs(nm, 465, 10) + gs(nm, 525, 14) + 0.9 * gs(nm, 630, 8) },
    'deuterium':    { name: 'Deuterium lamp (ultraviolet continuum)', f: lines([[486.0, 0.10, 1.5], [656.1, 0.28, 1.5]], nm => nm < 160 ? 0 : Math.exp(-Math.pow((nm - 215) / 95, 2)) + 0.015), invisible: true },
    'led-uv':       { name: 'UV-A LED (365 nm)', f: nm => gs(nm, 365, 5), invisible: true },
    'led-ir':       { name: 'Infrared LED (850 nm)', f: nm => gs(nm, 850, 17), invisible: true },
    'laser-red':    { name: 'Red diode laser (650 nm)', f: nm => gs(nm, 650, 0.8) },
    'laser-green':  { name: 'Green laser (532 nm)', f: nm => gs(nm, 532, 0.5) },
    'hene':         { name: 'Helium–neon laser (632.8 nm)', f: nm => gs(nm, 632.8, 0.5) },
    'equal':        { name: 'Equal energy at every wavelength', f: () => 1 }
  };
  Ph.spectrum = function (id) { const s = Ph.SOURCES[id]; if (!s) throw new Error('Unknown light source "' + id + '"'); return s.f; };

  // lamp families: efficacy in lm per electrical watt, colour temperature, colour rendering index, life in hours
  O.LAMPS = [
    { id: 'incandescent', name: 'Incandescent (tungsten filament)', family: 'thermal', efficacy: [8, 17], cct: [2400, 2900], cri: [100, 100], life: [750, 2000], start: 'instant', spectrum: 'incandescent', note: 'A hot wire: a smooth spectrum, mostly infrared. About 5 % of the power becomes visible light.' },
    { id: 'halogen', name: 'Tungsten–halogen', family: 'thermal', efficacy: [14, 25], cct: [2800, 3400], cri: [100, 100], life: [2000, 5000], start: 'instant', spectrum: 'halogen', note: 'A hotter filament in a small quartz bulb; the halogen cycle returns evaporated tungsten to the filament.' },
    { id: 'fluorescent', name: 'Fluorescent tube (T5, T8)', family: 'discharge', efficacy: [60, 105], cct: [2700, 6500], cri: [60, 95], life: [10000, 30000], start: 'seconds', spectrum: 'fluorescent', note: 'A low-pressure mercury discharge makes ultraviolet; the phosphor on the wall turns it into visible bands.' },
    { id: 'cfl', name: 'Compact fluorescent', family: 'discharge', efficacy: [45, 75], cct: [2700, 6500], cri: [80, 90], life: [6000, 15000], start: 'warms up in a minute', spectrum: 'cfl', note: 'A folded fluorescent tube with its ballast in the base.' },
    { id: 'mercury', name: 'High-pressure mercury', family: 'HID', efficacy: [35, 60], cct: [3500, 6000], cri: [15, 55], life: [16000, 24000], start: '4–7 minutes', spectrum: 'mercury', note: 'Blue-green line spectrum; largely replaced, and being phased out.' },
    { id: 'metal-halide', name: 'Metal halide', family: 'HID', efficacy: [70, 115], cct: [3000, 6000], cri: [65, 95], life: [6000, 20000], start: '2–5 minutes; minutes to restrike hot', spectrum: 'metal-halide', note: 'Mercury plus metal salts fill in the spectrum: stadiums, shops, projectors, car headlamps ("xenon" HID).' },
    { id: 'sodium-hp', name: 'High-pressure sodium', family: 'HID', efficacy: [80, 140], cct: [1900, 2200], cri: [20, 25], life: [16000, 30000], start: '3–5 minutes', spectrum: 'sodium-hp', note: 'Golden street lighting: very efficient, poor colour.' },
    { id: 'sodium-lp', name: 'Low-pressure sodium', family: 'discharge', efficacy: [100, 180], cct: [1800, 1800], cri: [0, 0], life: [14000, 18000], start: '7–15 minutes', spectrum: 'sodium-lp', note: 'One yellow line at 589 nm: the most lumens per watt and no colour at all.' },
    { id: 'xenon', name: 'Xenon short arc', family: 'arc', efficacy: [25, 50], cct: [5600, 6500], cri: [95, 99], life: [500, 3000], start: 'instant (high-voltage ignition)', spectrum: 'xenon', note: 'A tiny, extremely bright arc with a daylight spectrum: cinema projectors, solar simulators, searchlights.' },
    { id: 'flash', name: 'Xenon flash tube', family: 'arc', efficacy: [30, 60], cct: [5500, 6500], cri: [90, 99], life: [10000, 1000000], start: 'a pulse of micro- to milliseconds', spectrum: 'xenon', note: 'A capacitor discharged through xenon: photography, strobes, laser pumping. Life in flashes.' },
    { id: 'led', name: 'White LED (phosphor-converted)', family: 'solid state', efficacy: [80, 200], cct: [2200, 6500], cri: [70, 98], life: [15000, 50000], start: 'instant', spectrum: 'led-neutral', note: 'A blue LED chip under a yellow phosphor. Efficient, small, dimmable, long-lived; heat must be led away from the chip.' },
    { id: 'led-colour', name: 'Coloured LED', family: 'solid state', efficacy: [20, 150], cct: [0, 0], cri: [0, 0], life: [25000, 100000], start: 'instant (nanoseconds)', spectrum: 'led-green', note: 'One narrow band, 20–40 nm wide, set by the semiconductor: from 255 nm ultraviolet to beyond 1500 nm infrared.' },
    { id: 'oled', name: 'OLED panel', family: 'solid state', efficacy: [40, 90], cct: [2700, 4000], cri: [80, 95], life: [10000, 40000], start: 'instant', spectrum: 'led-warm', note: 'A thin glowing sheet: soft, glare-free light; displays.' },
    { id: 'deuterium', name: 'Deuterium lamp', family: 'arc', efficacy: [0, 0], cct: [0, 0], cri: [0, 0], life: [1000, 2000], start: 'seconds (heated cathode)', spectrum: 'deuterium', note: 'A continuous ultraviolet spectrum, 160–400 nm: spectrophotometers.' },
    { id: 'laser-lamp', name: 'Laser-pumped phosphor', family: 'solid state', efficacy: [40, 90], cct: [5000, 6500], cri: [70, 90], life: [20000, 30000], start: 'instant', spectrum: 'led-cool', note: 'Blue laser diodes on a phosphor: a very small, very bright source for projectors and headlamps.' }
  ];
  // lamp caps and bases (IEC 60061 designations): the number is a diameter or a pin spacing in millimetres
  O.BASES = [
    { code: 'E27', kind: 'Edison screw', mm: 27, use: 'the standard mains lamp in 230 V countries' }, { code: 'E26', kind: 'Edison screw', mm: 26, use: 'the standard mains lamp in 120 V countries' },
    { code: 'E14', kind: 'Edison screw', mm: 14, use: 'small ("candle") lamps, 230 V' }, { code: 'E12', kind: 'Edison screw', mm: 12, use: 'candelabra lamps, 120 V' },
    { code: 'E40', kind: 'Edison screw', mm: 40, use: 'large HID and street lamps (E39 in North America)' }, { code: 'E10', kind: 'Edison screw', mm: 10, use: 'torch and indicator bulbs' },
    { code: 'B22d', kind: 'bayonet', mm: 22, use: 'mains lamps in the UK, India, Australia' }, { code: 'B15d', kind: 'bayonet', mm: 15, use: 'small bayonet lamps' },
    { code: 'GU10', kind: 'twist-lock, two studs', mm: 10, use: 'mains-voltage reflector spots' }, { code: 'GU5.3', kind: 'two pins', mm: 5.33, use: '12 V reflector spots (MR16)' },
    { code: 'G4', kind: 'two pins', mm: 4, use: 'small 12 V capsules' }, { code: 'G9', kind: 'two loops', mm: 9, use: 'mains-voltage capsules' }, { code: 'GY6.35', kind: 'two pins', mm: 6.35, use: '12 V capsules, projector lamps' },
    { code: 'G13', kind: 'two pins at each end', mm: 12.7, use: 'T8 and T12 fluorescent tubes' }, { code: 'G5', kind: 'two pins at each end', mm: 5, use: 'T5 fluorescent tubes' },
    { code: 'R7s', kind: 'recessed contact at each end', mm: 7, use: 'linear halogen floodlight lamps (78 or 118 mm long)' }, { code: 'GX53', kind: 'twist-lock, two studs', mm: 53, use: 'flat under-cabinet lamps' },
    { code: '2G11', kind: 'four pins in a row', mm: 11, use: 'long compact fluorescent lamps' }, { code: 'G53', kind: 'two blades', mm: 53, use: 'AR111 reflector lamps' }, { code: 'P43t', kind: 'prefocus flange', mm: 43, use: 'H4 car headlamp bulbs' }
  ];
  // bulb shape codes: a letter for the shape and a diameter, in millimetres (IEC) or eighths of an inch (North America)
  O.BULBS = [
    { code: 'A60 / A19', shape: 'the classic pear', d: 60 }, { code: 'C35 / B11', shape: 'candle', d: 35 }, { code: 'G95 / G30', shape: 'globe', d: 95 }, { code: 'P45 / G14', shape: 'small golf ball', d: 45 },
    { code: 'R63 / R20', shape: 'blown reflector', d: 63 }, { code: 'PAR38', shape: 'pressed parabolic reflector', d: 121 }, { code: 'PAR30', shape: 'pressed parabolic reflector', d: 95 }, { code: 'PAR16', shape: 'pressed parabolic reflector', d: 51 },
    { code: 'MR16', shape: 'multifaceted reflector', d: 51 }, { code: 'MR11', shape: 'multifaceted reflector', d: 35 }, { code: 'AR111', shape: 'aluminium reflector', d: 111 },
    { code: 'T5', shape: 'tube', d: 16 }, { code: 'T8', shape: 'tube', d: 26 }, { code: 'T12', shape: 'tube', d: 38 }, { code: 'ST64', shape: 'Edison-style "squirrel cage"', d: 64 }
  ];

  // light detectors and the wavelengths they respond to (nm; typical round figures)
  O.DETECTORS = [
    { id: 'eye', name: 'The human eye', range: [380, 780], peak: 555, note: 'cones by day (peak 555 nm), rods by night (507 nm)' },
    { id: 'silicon', name: 'Silicon (CCD, CMOS, photodiodes)', range: [350, 1100], peak: 700, note: 'every ordinary camera; blind beyond 1.1 µm, where a photon no longer bridges the band gap' },
    { id: 'pmt', name: 'Photomultiplier (bialkali)', range: [185, 650], peak: 420, note: 'counts single photons; multi-alkali cathodes reach 900 nm' },
    { id: 'germanium', name: 'Germanium photodiode', range: [800, 1800], peak: 1550, note: 'power meters for the near infrared' },
    { id: 'ingaas', name: 'InGaAs', range: [900, 1700], peak: 1550, note: 'short-wave infrared cameras and telecom receivers; extended types to 2.6 µm' },
    { id: 'pbs', name: 'Lead sulfide (PbS)', range: [1000, 3000], peak: 2200, note: 'uncooled short-wave infrared sensing' },
    { id: 'insb', name: 'Indium antimonide (InSb), cooled', range: [1000, 5500], peak: 5000, note: 'mid-wave thermal cameras, cooled to about 77 K' },
    { id: 'mct', name: 'Mercury cadmium telluride (MCT), cooled', range: [2000, 14000], peak: 10000, note: 'band set by composition: mid- and long-wave infrared' },
    { id: 'bolometer', name: 'Microbolometer', range: [7500, 14000], peak: 10000, note: 'uncooled thermal cameras: each pixel is a tiny thermometer' },
    { id: 'thermopile', name: 'Thermopile and pyroelectric detectors', range: [200, 20000], peak: 0, note: 'respond to heat, so to any wavelength that is absorbed: laser power meters, motion sensors' }
  ];

  /* ================================================================ cameras */
  const Cm = O.cam = {};
  // sensor formats: the "inch" names come from television tubes; the diagonal is about two thirds of the name
  Cm.SENSORS = [
    { id: '1/4"', w: 3.6, h: 2.7 }, { id: '1/3"', w: 4.8, h: 3.6 }, { id: '1/2.5"', w: 5.76, h: 4.29 }, { id: '1/2.3"', w: 6.17, h: 4.55 }, { id: '1/2"', w: 6.4, h: 4.8 }, { id: '1/1.8"', w: 7.18, h: 5.32 },
    { id: '2/3"', w: 8.8, h: 6.6 }, { id: '1"', w: 12.8, h: 9.6 }, { id: '1.1"', w: 14.2, h: 10.4 }, { id: '4/3"', w: 17.3, h: 13.0, name: 'Four Thirds' },
    { id: 'APS-C', w: 23.6, h: 15.7 }, { id: 'Super 35', w: 24.9, h: 18.7 }, { id: 'Full frame', w: 36, h: 24, name: '35 mm full frame' }, { id: '44×33', w: 43.8, h: 32.9, name: 'Medium format 44 × 33' }, { id: '54×40', w: 53.7, h: 40.2, name: 'Medium format 54 × 40' },
    { id: 'Line 2k', w: 14.3, h: 0.007, name: 'Line scan, 2048 × 7 µm' }, { id: 'Line 4k', w: 28.7, h: 0.007, name: 'Line scan, 4096 × 7 µm' }, { id: 'Line 8k', w: 57.3, h: 0.007, name: 'Line scan, 8192 × 7 µm' }
  ];
  for (const s of Cm.SENSORS) { s.diag = Math.hypot(s.w, s.h); s.crop = 43.267 / s.diag; s.name = s.name || s.id + ' type'; }
  Cm.sensor = id => Cm.SENSORS.find(s => s.id === id);
  // lens mounts: flange focal distance (mount face to sensor), mm
  Cm.MOUNTS = [
    { id: 'C', name: 'C-mount', fit: 'thread 1"-32 UN (25.4 mm, 32 turns per inch)', ffd: 17.526, throat: 25.4, sensor: 'up to about 1.1" (22 mm image circle)', use: 'machine vision, microscopes, CCTV, 16 mm cine' },
    { id: 'CS', name: 'CS-mount', fit: 'thread 1"-32 UN (the same as C)', ffd: 12.526, throat: 25.4, sensor: 'up to about 1/2"', use: 'security and compact industrial cameras; a 5 mm ring fits a C lens' },
    { id: 'S', name: 'S-mount (M12)', fit: 'thread M12 × 0.5', ffd: null, throat: 12, sensor: 'up to about 1/1.8"', use: 'board cameras, drones, cars, embedded vision; focus by screwing the lens in its holder' },
    { id: 'TFL', name: 'TFL-mount', fit: 'thread M35 × 0.75', ffd: 17.526, throat: 35, sensor: 'up to APS-C', use: 'machine vision with large sensors' },
    { id: 'F', name: 'F-mount', fit: 'bayonet, three lugs', ffd: 46.5, throat: 44, sensor: 'full frame (43 mm image circle)', use: 'SLR cameras since 1959; line-scan and large-sensor industrial cameras' },
    { id: 'M42', name: 'M42 screw mount', fit: 'thread M42 × 1', ffd: 45.46, throat: 42, sensor: 'full frame', use: 'older SLR lenses; line-scan cameras' },
    { id: 'T2', name: 'T-mount (T2)', fit: 'thread M42 × 0.75', ffd: 55, throat: 42, sensor: 'full frame', use: 'telescopes, microscopes and adapters' },
    { id: 'M58', name: 'M58 mount', fit: 'thread M58 × 0.75', ffd: null, throat: 58, sensor: 'up to about 60 mm lines', use: 'line-scan and large-format industrial lenses (distance set by the lens)' },
    { id: 'M72', name: 'M72 mount', fit: 'thread M72 × 0.75', ffd: null, throat: 72, sensor: 'up to about 90 mm lines', use: 'long line-scan sensors' },
    { id: 'EF', name: 'EF-mount', fit: 'bayonet, electronic', ffd: 44.0, throat: 54, sensor: 'full frame', use: 'SLR cameras; cine and some industrial cameras' },
    { id: 'RF', name: 'RF-mount', fit: 'bayonet, electronic', ffd: 20.0, throat: 54, sensor: 'full frame', use: 'mirrorless cameras' },
    { id: 'E', name: 'E-mount', fit: 'bayonet, electronic', ffd: 18.0, throat: 46.1, sensor: 'full frame', use: 'mirrorless cameras' },
    { id: 'Z', name: 'Z-mount', fit: 'bayonet, electronic', ffd: 16.0, throat: 55, sensor: 'full frame', use: 'mirrorless cameras' },
    { id: 'L', name: 'L-mount', fit: 'bayonet, electronic', ffd: 20.0, throat: 51.6, sensor: 'full frame', use: 'mirrorless cameras' },
    { id: 'X', name: 'X-mount', fit: 'bayonet, electronic', ffd: 17.7, throat: 43.5, sensor: 'APS-C', use: 'mirrorless cameras' },
    { id: 'MFT', name: 'Micro Four Thirds', fit: 'bayonet, electronic', ffd: 19.25, throat: 38, sensor: '4/3"', use: 'mirrorless cameras, drones, cine' },
    { id: 'M', name: 'M-mount', fit: 'bayonet, four lugs', ffd: 27.8, throat: 44, sensor: 'full frame', use: 'rangefinder cameras' },
    { id: 'K', name: 'K-mount', fit: 'bayonet', ffd: 45.46, throat: 44, sensor: 'full frame', use: 'SLR cameras' },
    { id: 'PL', name: 'PL-mount', fit: 'breech lock, four flanges', ffd: 52.0, throat: 54, sensor: 'Super 35', use: 'cinema cameras' }
  ];
  Cm.mount = id => Cm.MOUNTS.find(m => m.id === id);
  /* can a lens made for mount `lens` be adapted to a camera with mount `body`? A plain tube works when the lens
     mount's flange distance is the longer one. -> { ok, ring (mm of adapter needed), note } */
  Cm.adapter = function (lens, body) {
    const a = Cm.mount(lens), b = Cm.mount(body);
    if (!a || !b || a.ffd == null || b.ffd == null) return { ok: null, ring: NaN, note: 'One of these mounts has no fixed flange distance.' };
    const ring = a.ffd - b.ffd;
    // equal distances but different fittings: only a flush reducing ring could join them, and only when the lens's fitting is the smaller
    if (ring === 0 && a.id !== b.id) return { ok: a.throat < b.throat, ring: 0, note: a.throat < b.throat ? 'The same flange distance: a flush reducing ring from the ' + b.name + ' fitting to the ' + a.name + ' fitting is all it takes.' : 'The same flange distance but a larger fitting on the lens: there is no room for an adapter.' };
    return { ok: ring >= 0, ring, note: ring === 0 ? 'The same mount.' : ring > 0 ? 'A ' + ring.toFixed(2) + ' mm adapter restores the lens\'s flange distance.' : 'The lens would sit ' + (-ring).toFixed(2) + ' mm too far from the sensor: it cannot reach infinity focus without extra optics.' };
  };
  /* field of view: focal length f and sensor size (mm). With a distance (mm from the lens) also the size of the scene.
     -> { h, v, d (full angles, rad), W, Hh (scene width and height, mm), m (magnification) } */
  Cm.fov = function (o) {
    const s = typeof o.sensor === 'string' ? Cm.sensor(o.sensor) : o.sensor || { w: o.w, h: o.h };
    const w = s.w, h = s.h, f = o.f, dist = o.distance;
    // focused at a finite distance the image lies farther back: v = f·dist/(dist − f); nothing nearer than about
    // 1.02 f can be focused at all (the image would be 50 focal lengths away), so the distance is held there
    const near = dist && Number.isFinite(dist) ? Math.max(dist, 1.02 * f) : dist;
    const v = near && Number.isFinite(near) ? f * near / (near - f) : f;
    const ang = x => 2 * Math.atan(x / (2 * v));
    const out = { h: ang(w), v: ang(h), d: ang(Math.hypot(w, h)) };
    if (near && Number.isFinite(near)) { out.m = v / near; out.W = w / out.m; out.Hh = h / out.m; }
    return out;
  };
  /* the focal length that images a scene width W at distance dist on a sensor of width w (thin lens) */
  Cm.focalFor = (w, W, dist) => dist / (1 + W / w);
  Cm.crop = diag => 43.267 / diag;
  Cm.coc = diag => diag / 1500;                                        // the usual circle of confusion, mm
  Cm.hyperfocal = (f, N, c) => f * f / (N * c) + f;
  /* depth of field (mm): focal length f, f-number N, focus distance s, circle of confusion c */
  Cm.dof = function (o) {
    const Hy = Cm.hyperfocal(o.f, o.N, o.c), s = Math.max(o.s, 1.02 * o.f);        // nothing nearer than the focal length can be focused
    const near = s * (Hy - o.f) / (Hy + s - 2 * o.f), far = s < Hy ? s * (Hy - o.f) / (Hy - s) : Infinity;
    return { near, far, total: far - near, H: Hy };
  };
  /* depth of field at close range from the magnification: 2 N c (m + 1)/m² */
  Cm.dofMacro = (N, c, m) => 2 * N * c * (m + 1) / (m * m);
  Cm.depthOfFocus = (N, c) => 2 * N * c;                               // tolerance at the sensor
  Cm.magnification = (f, s) => f / (s - f);
  Cm.extension = (f, m) => f * m;                                      // extra lens-to-sensor distance to reach magnification m
  Cm.workingFNumber = (N, m, pupilMag) => N * (1 + Math.abs(m) / (pupilMag || 1));
  Cm.naFromFNumber = N => 1 / (2 * N);
  /* exposure value at ISO 100 for an aperture and a time; the time for a given EV */
  Cm.ev = (N, t, iso) => Math.log2(N * N / t) - Math.log2((iso || 100) / 100);
  Cm.exposureTime = (N, ev, iso) => N * N / Math.pow(2, ev + Math.log2((iso || 100) / 100));
  Cm.STOPS = [1, 1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32];
  Cm.evOfLuminance = (L, iso) => Math.log2(L * (iso || 100) / 12.5);   // a reflected-light meter (K = 12.5)
  /* photons reaching one pixel: illuminance on the sensor E (lux, taken as light of 555 nm unless nm given with an
     irradiance in W/m²), exposure time t (s), pixel pitch (µm) */
  Cm.photons = function (o) {
    const nm = o.nm || 555, Ee = o.irradiance != null ? o.irradiance : o.lux / (683 * Math.max(1e-6, O.photo.V(nm)));
    return Ee * Math.pow(o.pitch * 1e-6, 2) * o.t / (hP * c0 / (nm * 1e-9));
  };
  /* signal-to-noise ratio of a pixel: photons, quantum efficiency, read noise (e⁻), dark current (e⁻/s), time */
  Cm.snr = function (o) {
    const sig = o.photons * (o.qe == null ? 1 : o.qe), dark = (o.dark || 0) * (o.t || 0), rd = o.read || 0;
    const noise = Math.sqrt(sig + dark + rd * rd);
    return { signal: sig, noise, snr: noise > 0 ? sig / noise : 0, db: noise > 0 && sig > 0 ? 20 * Math.log10(sig / noise) : -Infinity, shot: Math.sqrt(sig) };
  };
  Cm.dynamicRange = function (fullWell, read) { const r = fullWell / read; return { ratio: r, db: 20 * Math.log10(r), stops: Math.log2(r), bits: Math.ceil(Math.log2(r)) }; };
  Cm.dataRate = (w, h, bits, fps) => w * h * bits * fps;               // bit/s, uncompressed
  /* blur in pixels of something moving at v (mm/s) across the scene: exposure t, magnification m, pitch µm */
  Cm.motionBlur = (v, t, m, pitch) => v * t * Math.abs(m) / (pitch * 1e-3);
  Cm.lineRate = (v, m, pitch) => v * Math.abs(m) / (pitch * 1e-3);     // lines per second for square pixels on a moving web
  /* radial distortion (Brown's model, first two terms): the distorted radius of an ideal radius r (normalised) */
  Cm.distortion = (r, k1, k2) => r * (1 + k1 * r * r + (k2 || 0) * r * r * r * r);
  Cm.distortionPercent = (k1, k2) => 100 * (k1 + (k2 || 0));           // at the edge of the field (r = 1)
  Cm.cos4 = theta => Math.pow(Math.cos(theta), 4);
  Cm.pixelsOnTarget = (size, W, pixels) => size / W * pixels;          // how many pixels a feature of that size covers
  /* digital zoom: a crop of 1/z of the frame is enlarged to the whole frame. -> the pixels really used, and the
     equivalent focal length */
  Cm.digitalZoom = (w, h, z, f) => ({ w: Math.round(w / z), h: Math.round(h / z), megapixels: w * h / (z * z) / 1e6, fEquivalent: f != null ? f * z : NaN });
  /* resample a row of samples to n points: 'nearest' | 'linear' | 'cubic' (Catmull–Rom) */
  Cm.resample = function (a, n, how) {
    const out = [], N = a.length, at = i => a[O.clamp(i, 0, N - 1)];
    for (let j = 0; j < n; j++) {
      const x = (j + 0.5) * N / n - 0.5, i = Math.floor(x), t = x - i;
      if (how === 'nearest') out.push(at(Math.round(x)));
      else if (how === 'cubic') { const p0 = at(i - 1), p1 = at(i), p2 = at(i + 1), p3 = at(i + 2); out.push(0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t * t * t)); }
      else out.push(at(i) * (1 - t) + at(i + 1) * t);
    }
    return out;
  };

  /* ================================================================ the eye and spectacles */
  const E = O.eye = {};
  E.DATA = { power: 60, cornea: 43, lens: 19, axialLength: 24, nodalToRetina: 17, pupil: [2, 8], cones: 6e6, rods: 92e6, fovea: 5, foveola: 1, blindSpot: 15, coneSpacing: 0.5 };   // dioptres, mm, degrees, arc-minutes
  // extent of the visual field of one eye, degrees from the line of sight
  E.FIELD = { nasal: 60, temporal: 100, up: 60, down: 75, binocularOverlap: 120, bothEyes: 200, colour: 60, reading: 2 };
  // peak wavelengths of the photopigments (nm)
  E.CONES = { S: 420, M: 534, L: 564, rod: 498 };
  /* amplitude of accommodation with age (Hofstetter's formulas), dioptres */
  E.accommodation = age => ({ min: Math.max(0, 15 - 0.25 * age), avg: Math.max(0, 18.5 - 0.3 * age), max: Math.max(0, 25 - 0.4 * age) });
  /* the near and far points (m) of an eye with refractive error K (D; negative: myopic) and amplitude A */
  E.farPoint = K => K === 0 ? Infinity : -1 / K;                       // negative: behind the eye (hyperopia)
  E.nearPoint = (K, A) => { const v = A - K; return v <= 0 ? Infinity : 1 / v; };
  /* a spectacle power moved from vertex distance d1 to d2 (m): e.g. glasses at 12 mm to a contact lens at 0 */
  E.vertex = (Fs, d1, d2) => Fs / (1 - ((d1 || 0) - (d2 || 0)) * Fs);
  /* the same prescription written with the other sign of cylinder */
  E.transpose = rx => ({ sph: rx.sph + rx.cyl, cyl: -rx.cyl, axis: ((rx.axis + 90 - 1) % 180) + 1 });
  E.sphericalEquivalent = rx => rx.sph + rx.cyl / 2;
  E.meridian = (rx, deg) => rx.sph + rx.cyl * Math.pow(Math.sin((deg - rx.axis) * D2R), 2);   // power along a meridian
  E.prentice = (F, cm) => Math.abs(F * cm);                            // prism dioptres from decentring a lens by cm
  /* the height (m) of a letter that subtends 5 arc-minutes × (denominator/20) at a distance d (m) */
  E.letterHeight = (d, denominator) => d * Math.tan(5 / 60 * D2R * (denominator || 20) / 20);
  E.logmar = denominator => Math.log10(denominator / 20);              // of 20/denominator
  E.snellen = logmar => 20 * Math.pow(10, logmar);                     // -> the denominator of 20/x
  E.decimal = denominator => 20 / denominator;
  /* the angular diameter (rad) of the blur disc of an eye out of focus by D dioptres with a pupil p (mm) */
  E.blurAngle = (D, p) => Math.abs(D) * p * 1e-3;
  /* a rough acuity from uncorrected spherical error: 20/x, for a 4 mm pupil in daylight */
  // (a rule of thumb that follows the usual clinical tables: 0.5 D ≈ 20/45, 1 D ≈ 20/80, 2 D ≈ 20/180, 3 D ≈ 20/320)
  E.acuityFromDefocus = function (D) { const a = Math.abs(D); return a < 0.2 ? 20 : Math.round(20 * (1 + a) * (1 + a) / 5) * 5; };
  /* pupil diameter (mm) against the luminance of the field (cd/m²), de Groot and Gebhard's formula */
  E.pupil = function (L) { const mL = Math.max(1e-9, L / 3.183); return Math.pow(10, 0.8558 - 0.000401 * Math.pow(Math.log10(mL) + 8.6, 3)); };
  /* contrast sensitivity against spatial frequency (cycles per degree), Mannos and Sakrison's curve, peak 1 */
  E.csf = f => 2.6 * (0.0192 + 0.114 * f) * Math.exp(-Math.pow(0.114 * f, 1.1)) / 0.9809;
  E.diffractionLimitCpd = (pupilMm, nm) => pupilMm * 1e-3 / (nm * 1e-9) * D2R;     // cut-off of the eye's optics
  /* spectacle magnification: power F (D), vertex distance d (m), centre thickness t (m), index n, front curve F1 (D) */
  E.spectacleMag = (F, d, t, n, F1) => 1 / ((1 - (d || 0) * F) * (1 - ((t || 0) / (n || 1.5)) * (F1 || 0)));
  /* a progressive lens, schematically: the added power and the unwanted astigmatism at a point (x, y) mm of the
     lens, y measured up from the fitting cross. Power rises smoothly down a corridor of the given length;
     Minkwitz's theorem makes the astigmatism grow sideways twice as fast as the power grows downwards. */
  E.pal = function (x, y, o) {
    const add = o.add || 2, Lc = o.corridor || 14, y0 = o.start == null ? -2 : o.start;
    const t = O.clamp((y0 - y) / Lc, 0, 1), s = t * t * (3 - 2 * t), ds = 6 * t * (1 - t) / Lc;       // smoothstep and its slope (per mm)
    const cyl = Math.min(add * 1.1, 2 * add * ds * Math.abs(x) + (t >= 1 ? Math.max(0, Math.abs(x) - (o.nearWidth || 7)) * add * 0.09 : 0));
    return { add: add * s, cyl, gradient: add * ds };
  };
  // the standard reading additions with age (typical, dioptres)
  E.ADD_BY_AGE = [[40, 0.75], [45, 1.25], [50, 1.75], [55, 2.25], [60, 2.5], [65, 2.5]];

  /* ================================================================ scanning */
  const Sc = O.scan = {};
  Sc.galvoOptical = mech => 2 * mech;                                  // a mirror turns the beam by twice its own angle
  /* a rotating polygon: facets, rev/min -> optical scan angle per facet, line rate, facet time */
  Sc.polygon = function (o) { const n = o.facets, rps = o.rpm / 60; return { scanAngle: 4 * PI / n, lineRate: n * rps, facetTime: 1 / (n * rps), dutyCycle: o.beam && o.facetWidth ? Math.max(0, 1 - o.beam / o.facetWidth) : 1 }; };
  /* resolvable spots along a scan: full optical scan angle (rad), beam diameter D (m), a = 1.27 for a Gaussian beam */
  Sc.resolvableSpots = (theta, D, nm, a) => theta * D / ((a || 1.27) * nm * 1e-9);
  Sc.fTheta = (f, theta) => f * theta;                                 // image height of an f-theta scan lens
  Sc.fTan = (f, theta) => f * Math.tan(theta);                         // of an ordinary lens
  /* an acousto-optic deflector: sweep df (Hz), sound speed v (m/s), beam D (m) -> { angle, spots, access } */
  Sc.aod = function (o) { const tau = o.D / o.v; return { angle: o.nm * 1e-9 * o.df / o.v, spots: o.df * tau, access: tau }; };
  Sc.braggAngle = (nm, f, v) => Math.asin(O.clamp(nm * 1e-9 * f / (2 * v), -1, 1));
  /* laser triangulation: baseline b, lens focal length f, range z (m), detector resolution p (m) -> depth resolution */
  Sc.triangulation = function (o) { return { dz: o.z * o.z * o.p / (o.f * o.b), shift: o.f * o.b / o.z }; };
  Sc.tof = t => c0 * t / 2;                                            // range from a round-trip time
  Sc.tofTime = z => 2 * z / c0;
  Sc.tofResolution = dt => c0 * dt / 2;
  Sc.phaseRange = fmod => c0 / (2 * fmod);                             // unambiguous range of a phase-shift rangefinder
  Sc.dpiPitch = dpi => 25.4e-3 / dpi;                                  // sample spacing (m)
  Sc.confocalAxial = (nm, NA, n) => 1.4 * nm * 1e-9 * (n || 1) / (NA * NA);       // axial resolution of a confocal microscope
  Sc.pixelDwell = (lineRate, pixels, duty) => (duty || 1) / (lineRate * pixels);
  /* the smallest bar of a barcode a scanner resolves: spot size about equal to the bar width */
  Sc.barcodeDepth = (w0, nm) => 2 * PI * w0 * w0 / (nm * 1e-9);        // the range over which the spot stays within √2 of w0 (2 zR)
  /* stereo and structured light: depth from disparity d (pixels), baseline b, focal length f (pixels) */
  Sc.depthFromDisparity = (b, f, d) => b * f / d;
  Sc.lidarPoints = (lines, hz, hRes) => lines * hz * (2 * PI / hRes);  // points per second of a spinning lidar
  Sc.spinSpotSpacing = (z, dTheta) => z * dTheta;

  /* ================================================================ beam shaping */
  const Sh = O.shape = {};
  Sh.fanAngle = (D, f) => 2 * Math.atan(D / (2 * Math.abs(f)));        // full fan angle of a line made by a cylinder lens
  Sh.lineLength = (fan, z) => 2 * z * Math.tan(fan / 2);
  /* intensity along a laser line: 'gaussian' (cylinder lens: bright centre, dim ends) or 'powell' (nearly flat) */
  Sh.lineProfile = function (u, kind) { const a = Math.abs(u); if (kind === 'powell') return a > 1 ? 0 : 0.85 + 0.15 * a * a * (1.4 - 0.4 * a * a); return Math.exp(-2 * u * u * 2.2); };
  /* an axicon of base angle alpha: deflection, the length of its Bessel zone for a beam of radius w, the ring */
  Sh.axicon = function (o) {
    const beta = Math.asin(O.clamp((o.n || 1.5) * Math.sin(o.alpha), -1, 1)) - o.alpha;
    return { beta, zmax: o.w / Math.tan(beta), core: 2.405 * o.nm * 1e-9 / (2 * PI * Math.sin(beta)), ringRadius: z => z * Math.tan(beta), ringWidth: o.w };
  };
  Sh.superGaussian = (r, w, order) => Math.exp(-2 * Math.pow(Math.abs(r / w), order || 2));       // order 2 Gaussian; 10+ a flat top
  /* a microlens-array homogeniser: lenslet pitch p and focal length fLA, Fourier lens fFL -> flat-top size */
  Sh.homogenizer = (p, fLA, fFL) => p * fFL / fLA;
  /* a diffractive beam splitter of period d: the angle of order m; a dot-matrix projector's spot spacing at z */
  Sh.doeAngle = (m, d, nm) => Math.asin(O.clamp(m * nm * 1e-9 / d, -1, 1));
  Sh.doeFeature = (nm, fullAngle) => nm * 1e-9 / (2 * Math.sin(fullAngle / 2));       // smallest feature for a full spread angle
  /* the thermodynamic limit of concentration for acceptance half-angle theta: 3-D (dish) or 2-D (trough) */
  Sh.maxConcentration = (theta, n, dim) => dim === 2 ? (n || 1) / Math.sin(theta) : Math.pow((n || 1) / Math.sin(theta), 2);
  /* the profile of a compound parabolic concentrator: exit half-width a, acceptance half-angle theta -> [[x, y] …] of the right wall */
  Sh.cpc = function (a, theta, n) {
    const pts = [], f = a * (1 + Math.sin(theta)); n = n || 40;
    for (let i = 0; i <= n; i++) {
      const phi = 2 * theta + (PI / 2 - theta) * i / n;                // φ from 2θ (the entrance rim) to π/2 + θ (the exit rim)
      const r = 2 * f / (1 - Math.cos(phi));
      pts.push([r * Math.sin(phi - theta) - a, r * Math.cos(phi - theta)]);
    }
    return pts;
  };
  Sh.cpcLength = (a, theta) => a * (1 + 1 / Math.sin(theta)) / Math.tan(theta);
  /* a Fresnel lens: the slope angle of the facet at radius r for focal length f and index n
     (parallel light enters the flat side and the grooved side faces the focus; a lens with its flat side to a lamp needs other slopes) */
  Sh.fresnelFacet = (r, f, n) => Math.atan(r / ((n || 1.49) * Math.hypot(r, f) - f));
  /* a spatial filter: the pinhole for a beam of radius w focused by f (1.5 × the Gaussian spot diameter) */
  Sh.pinhole = (nm, f, w) => 1.5 * 2 * nm * 1e-9 * f / (PI * w);
  /* a beam expander of two lenses: magnification and length (Keplerian f1, f2 > 0; Galilean f1 < 0) */
  Sh.expander = (f1, f2) => ({ m: Math.abs(f2 / f1), length: f1 + f2, kind: f1 < 0 ? 'Galilean' : 'Keplerian' });

  /* ================================================================ optical fibres */
  const Fb = O.fibre = {};
  Fb.na = (n1, n2) => Math.sqrt(Math.max(0, n1 * n1 - n2 * n2));
  Fb.acceptance = (na, n0) => Math.asin(O.clamp(na / (n0 || 1), -1, 1));               // half-angle of the acceptance cone
  Fb.V = (a, nm, na) => 2 * PI * a * na / (nm * 1e-9);                                 // normalised frequency; a = core radius (m)
  Fb.modes = (V, graded) => V < 2.405 ? 1 : Math.round(V * V / (graded ? 4 : 2));
  Fb.cutoff = (a, na) => 2 * PI * a * na / 2.405 * 1e9;                                // nm: single-mode above this wavelength
  Fb.mfd = (a, V) => 2 * a * (0.65 + 1.619 * Math.pow(V, -1.5) + 2.879 * Math.pow(V, -6));   // mode-field diameter (Marcuse)
  Fb.loss = (dBkm, km) => Math.pow(10, -dBkm * km / 10);                               // fraction transmitted
  Fb.lossDb = (Pin, Pout) => 10 * Math.log10(Pin / Pout);
  Fb.fresnelLossDb = n => -10 * Math.log10(1 - O.normalR(1, n));                        // per glass–air face
  Fb.modalDispersion = (n1, n2, L) => L * n1 * (n1 - n2) / (n2 * c0);                  // pulse spread of a step-index fibre (s)
  Fb.bendLossRadius = (a, na) => 3 * a * 1.46 * 1.46 / (na * na);                       // order of the critical bend radius (m)
  Fb.TYPES = [
    { id: 'OS2', name: 'Single-mode (9/125 µm: the 9 is the mode-field diameter)', core: 8.2, clad: 125, na: 0.12, mfd: 9.2, loss: '0.35 dB/km at 1310 nm, 0.2 dB/km at 1550 nm', use: 'long distance and data-centre links' },
    { id: 'OM3', name: 'Multimode, graded index (50/125 µm)', core: 50, clad: 125, na: 0.20, loss: '3 dB/km at 850 nm', use: 'building and data-centre links to a few hundred metres' },
    { id: 'OM1', name: 'Multimode, graded index (62.5/125 µm)', core: 62.5, clad: 125, na: 0.275, loss: '3 dB/km at 850 nm', use: 'older building links' },
    { id: 'step', name: 'Large-core step index (200–1000 µm)', core: 400, clad: 440, na: 0.22, loss: '10 dB/km', use: 'laser power delivery, spectrometers, sensors' },
    { id: 'POF', name: 'Plastic fibre (980/1000 µm)', core: 980, clad: 1000, na: 0.5, loss: '150 dB/km at 650 nm', use: 'cars, home audio links, decorative lighting' },
    { id: 'bundle', name: 'Glass fibre bundle (light guide)', core: 50, clad: 55, na: 0.55, loss: 'about 60 % transmitted per metre', use: 'cold-light illumination of microscopes and endoscopes' }
  ];
  // connectors and their ferrules
  Fb.CONNECTORS = [
    { id: 'SC', ferrule: 2.5, lock: 'push–pull square body', use: 'telecom and data links' }, { id: 'LC', ferrule: 1.25, lock: 'latch, half the size of SC', use: 'transceivers, dense panels' },
    { id: 'FC', ferrule: 2.5, lock: 'threaded, keyed', use: 'instruments, single-mode and polarisation-maintaining fibre' }, { id: 'ST', ferrule: 2.5, lock: 'bayonet', use: 'older multimode networks' },
    { id: 'SMA 905', ferrule: 3.175, lock: 'threaded, metal ferrule', use: 'large-core fibres: lasers, spectrometers, medical' }, { id: 'MPO/MTP', ferrule: 6.4, lock: 'push–pull, 12 or 24 fibres in one rectangular ferrule', use: 'parallel data links' },
    { id: 'E2000', ferrule: 2.5, lock: 'latch with a spring shutter', use: 'telecom, high power safety' }, { id: 'MU', ferrule: 1.25, lock: 'push–pull', use: 'dense telecom panels' }
  ];
  Fb.POLISH = [{ id: 'PC', name: 'Physical contact', ret: -35 }, { id: 'UPC', name: 'Ultra physical contact', ret: -50 }, { id: 'APC', name: 'Angled physical contact (8°)', ret: -65 }];
})(typeof window !== 'undefined' ? window : globalThis);
