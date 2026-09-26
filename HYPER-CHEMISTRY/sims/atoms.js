/* HYPER-CHEMISTRY · sims/atoms.js — simulations for Atoms and the Periodic Table:
 * build an atom, the hydrogen spectrum, orbitals in 3-D, filling orbitals, periodic
 * trends, Slater's rules, radioactive decay, and the chart of nuclides. Element data
 * come from kit.chem; nuclear data are real where tabulated below, otherwise from the
 * liquid-drop (semi-empirical) mass formula, and the sims say which. */
(function () {
  'use strict';

  /* ================================================================ shared helpers */
  const SUPS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '+': '⁺', '-': '⁻' };
  const SUBS = { 0: '₀', 1: '₁', 2: '₂', 3: '₃', 4: '₄', 5: '₅', 6: '₆', 7: '₇', 8: '₈', 9: '₉' };
  const sup = s => String(s).split('').map(ch => SUPS[ch] || ch).join('');
  const sub = s => String(s).split('').map(ch => SUBS[ch] || ch).join('');
  const chargeText = q => (q === 0 ? '' : sup((Math.abs(q) > 1 ? Math.abs(q) : '') + (q > 0 ? '+' : '-')));
  const cfgPretty = s => String(s).replace(/([spdf])(\d+)/g, (m, a, b) => a + sup(b));
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const YR = 3.15576e7, DAY = 86400, HR = 3600, MIN = 60;

  /* ---------------------------------------------------------------- electron configurations */
  const ORDER = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'];
  const CAP = { s: 2, p: 6, d: 10, f: 14 };
  const LNUM = { s: 0, p: 1, d: 2, f: 3 };
  const NOBLE = [[86, 'Rn'], [54, 'Xe'], [36, 'Kr'], [18, 'Ar'], [10, 'Ne'], [2, 'He']];
  // occupancy map {'1s': 2, ...} from a configuration written out in full
  function parseFull(str) {
    const occ = {};
    for (const tok of String(str).trim().split(/\s+/)) {
      const m = /^(\d)([spdf])(\d+)$/.exec(tok);
      if (m) occ[m[1] + m[2]] = (occ[m[1] + m[2]] || 0) + +m[3];
    }
    return occ;
  }
  // the simple aufbau (Madelung) filling of k electrons
  function aufbauOcc(k) {
    const occ = {};
    for (const s of ORDER) { if (k <= 0) break; const n = Math.min(CAP[s[1]], k); occ[s] = n; k -= n; }
    return occ;
  }
  // ground-state occupancy of element z with charge q: cations lose electrons from outside the
  // noble-gas core, highest n (then highest l) first — 4s before 3d, 6s and 5d before 4f
  function ionOcc(chem, z, q) {
    const occ = parseFull(chem.fullConfig(z));
    let core = {};
    for (const [nz] of NOBLE) if (nz < z) { core = aufbauOcc(nz); break; }
    let k = q;
    while (k > 0) {
      let best = null;
      for (const pass of [0, 1]) {
        for (const s in occ) if (occ[s] > 0 && (pass || (occ[s] > (core[s] || 0)))) {
          const n = +s[0], l = LNUM[s[1]];
          if (!best || n > best.n || (n === best.n && l > best.l)) best = { s, n, l };
        }
        if (best) break;
      }
      if (!best) break;
      occ[best.s]--; k--;
    }
    while (k < 0) {
      const s = ORDER.find(x => (occ[x] || 0) < CAP[x[1]]);
      if (!s) break;
      occ[s] = (occ[s] || 0) + 1; k++;
    }
    for (const s in occ) if (!occ[s]) delete occ[s];
    return occ;
  }
  const occTotal = occ => Object.values(occ).reduce((a, b) => a + b, 0);
  const sortNL = list => list.sort((a, b) => (+a[0] - +b[0]) || (LNUM[a[1]] - LNUM[b[1]]));
  // "[Ar] 3d⁶" style text for any occupancy
  function occText(occ) {
    const keys = sortNL(Object.keys(occ).filter(s => occ[s] > 0));
    if (!keys.length) return 'no electrons';
    for (const [nz, sym] of NOBLE) {
      const core = aufbauOcc(nz);
      if (Object.keys(core).every(s => occ[s] === core[s])) {
        const rest = keys.filter(s => !(s in core));
        return '[' + sym + ']' + (rest.length ? ' ' + rest.map(s => s + sup(occ[s])).join(' ') : '');
      }
    }
    return keys.map(s => s + sup(occ[s])).join(' ');
  }
  const unpairedOf = occ => Object.keys(occ).reduce((u, s) => { const m = 2 * LNUM[s[1]] + 1, k = occ[s]; return u + (k <= m ? k : 2 * m - k); }, 0);

  /* ---------------------------------------------------------------- nuclear data */
  // stable nuclides (mass numbers) for Z = 1 … 82; bismuth-209 is listed as effectively stable
  const STABLE = { 1: [1, 2], 2: [3, 4], 3: [6, 7], 4: [9], 5: [10, 11], 6: [12, 13], 7: [14, 15], 8: [16, 17, 18], 9: [19], 10: [20, 21, 22],
    11: [23], 12: [24, 25, 26], 13: [27], 14: [28, 29, 30], 15: [31], 16: [32, 33, 34, 36], 17: [35, 37], 18: [36, 38, 40], 19: [39, 41], 20: [40, 42, 43, 44, 46],
    21: [45], 22: [46, 47, 48, 49, 50], 23: [51], 24: [50, 52, 53, 54], 25: [55], 26: [54, 56, 57, 58], 27: [59], 28: [58, 60, 61, 62, 64], 29: [63, 65], 30: [64, 66, 67, 68, 70],
    31: [69, 71], 32: [70, 72, 73, 74], 33: [75], 34: [74, 76, 77, 78, 80], 35: [79, 81], 36: [80, 82, 83, 84, 86], 37: [85], 38: [84, 86, 87, 88], 39: [89], 40: [90, 91, 92, 94],
    41: [93], 42: [92, 94, 95, 96, 97, 98], 44: [96, 98, 99, 100, 101, 102, 104], 45: [103], 46: [102, 104, 105, 106, 108, 110], 47: [107, 109], 48: [106, 108, 110, 111, 112, 114],
    49: [113], 50: [112, 114, 115, 116, 117, 118, 119, 120, 122, 124], 51: [121, 123], 52: [120, 122, 123, 124, 125, 126], 53: [127], 54: [126, 128, 129, 130, 131, 132, 134],
    55: [133], 56: [132, 134, 135, 136, 137, 138], 57: [139], 58: [136, 138, 140, 142], 59: [141], 60: [142, 143, 145, 146, 148], 62: [144, 149, 150, 152, 154], 63: [153],
    64: [154, 155, 156, 157, 158, 160], 65: [159], 66: [156, 158, 160, 161, 162, 163, 164], 67: [165], 68: [162, 164, 166, 167, 168, 170], 69: [169], 70: [168, 170, 171, 172, 173, 174, 176],
    71: [175], 72: [176, 177, 178, 179, 180], 73: [181], 74: [182, 183, 184, 186], 75: [185], 76: [187, 188, 189, 190, 192], 77: [191, 193], 78: [192, 194, 195, 196, 198], 79: [197],
    80: [196, 198, 199, 200, 201, 202, 204], 81: [203, 205], 82: [204, 206, 207, 208] };
  // measured decay modes and half-lives (s) of well-known radionuclides, keyed 'Z-A'
  const KNOWN = {
    '1-3': ['b-', 12.32 * YR], '2-6': ['b-', 0.807], '2-8': ['b-', 0.119], '3-8': ['b-', 0.839], '3-9': ['b-', 0.178], '4-7': ['ec', 53.2 * DAY], '4-10': ['b-', 1.39e6 * YR],
    '4-11': ['b-', 13.8], '5-8': ['b+', 0.770], '5-12': ['b-', 0.0202], '6-10': ['b+', 19.3], '6-11': ['b+', 20.4 * MIN], '6-14': ['b-', 5730 * YR], '6-15': ['b-', 2.45],
    '7-13': ['b+', 9.97 * MIN], '7-16': ['b-', 7.13], '8-14': ['b+', 70.6], '8-15': ['b+', 122], '8-19': ['b-', 26.9], '9-18': ['b+', 109.8 * MIN], '11-22': ['b+', 2.60 * YR],
    '11-24': ['b-', 14.96 * HR], '15-32': ['b-', 14.27 * DAY], '16-35': ['b-', 87.4 * DAY], '17-36': ['b-', 3.01e5 * YR], '19-40': ['b-', 1.248e9 * YR], '26-55': ['ec', 2.74 * YR],
    '26-59': ['b-', 44.5 * DAY], '27-57': ['ec', 271.7 * DAY], '27-60': ['b-', 5.27 * YR], '28-63': ['b-', 98.7 * YR], '36-85': ['b-', 10.76 * YR], '37-87': ['b-', 4.97e10 * YR],
    '38-89': ['b-', 50.6 * DAY], '38-90': ['b-', 28.8 * YR], '39-90': ['b-', 64.1 * HR], '42-99': ['b-', 65.9 * HR], '43-99': ['b-', 2.11e5 * YR], '53-125': ['ec', 59.4 * DAY],
    '53-129': ['b-', 1.57e7 * YR], '53-131': ['b-', 8.02 * DAY], '54-133': ['b-', 5.25 * DAY], '55-134': ['b-', 2.07 * YR], '55-137': ['b-', 30.1 * YR], '56-133': ['ec', 10.5 * YR],
    '62-147': ['a', 1.06e11 * YR], '71-176': ['b-', 3.76e10 * YR], '75-187': ['b-', 4.1e10 * YR], '81-201': ['ec', 73 * HR], '81-207': ['b-', 4.77 * MIN],
    '82-210': ['b-', 22.2 * YR], '82-211': ['b-', 36.1 * MIN], '82-212': ['b-', 10.64 * HR], '82-214': ['b-', 26.8 * MIN],
    '83-209': ['a', 2.01e19 * YR], '83-210': ['b-', 5.01 * DAY], '83-211': ['a', 2.14 * MIN], '83-212': ['b-', 60.6 * MIN], '83-214': ['b-', 19.9 * MIN],
    '84-210': ['a', 138.4 * DAY], '84-212': ['a', 2.99e-7], '84-214': ['a', 1.64e-4], '84-215': ['a', 1.78e-3], '84-216': ['a', 0.145], '84-218': ['a', 3.10 * MIN],
    '86-219': ['a', 3.96], '86-220': ['a', 55.6], '86-222': ['a', 3.8235 * DAY], '88-223': ['a', 11.4 * DAY], '88-224': ['a', 3.63 * DAY], '88-226': ['a', 1600 * YR], '88-228': ['b-', 5.75 * YR],
    '89-227': ['b-', 21.8 * YR], '89-228': ['b-', 6.15 * HR], '90-227': ['a', 18.7 * DAY], '90-228': ['a', 1.91 * YR], '90-230': ['a', 7.54e4 * YR], '90-231': ['b-', 25.5 * HR],
    '90-232': ['a', 1.405e10 * YR], '90-234': ['b-', 24.1 * DAY], '91-231': ['a', 3.276e4 * YR], '91-234': ['b-', 6.70 * HR], '92-233': ['a', 1.59e5 * YR], '92-234': ['a', 2.455e5 * YR],
    '92-235': ['a', 7.04e8 * YR], '92-238': ['a', 4.468e9 * YR], '92-239': ['b-', 23.45 * MIN], '93-237': ['a', 2.14e6 * YR], '93-239': ['b-', 2.356 * DAY],
    '94-238': ['a', 87.7 * YR], '94-239': ['a', 2.411e4 * YR], '94-240': ['a', 6561 * YR], '94-241': ['b-', 14.3 * YR], '95-241': ['a', 432.2 * YR], '96-244': ['a', 18.1 * YR],
    '98-252': ['a', 2.645 * YR],
    '25-54': ['ec', 312 * DAY], '27-58': ['ec', 70.9 * DAY], '29-64': ['ec', 12.7 * HR], '30-65': ['ec', 244 * DAY], '31-67': ['ec', 3.26 * DAY], '31-68': ['b+', 67.7 * MIN],
    '32-68': ['ec', 271 * DAY], '37-82': ['b+', 76], '38-82': ['ec', 25.4 * DAY], '43-97': ['ec', 4.21e6 * YR], '43-98': ['b-', 4.2e6 * YR], '49-111': ['ec', 2.80 * DAY],
    '53-123': ['ec', 13.2 * HR], '61-145': ['ec', 17.7 * YR], '61-147': ['b-', 2.62 * YR], '62-151': ['b-', 90 * YR], '62-153': ['b-', 46.3 * HR], '71-177': ['b-', 6.65 * DAY],
    '77-192': ['b-', 73.8 * DAY], '79-198': ['b-', 2.70 * DAY], '83-213': ['b-', 45.6 * MIN], '84-209': ['a', 124 * YR], '87-223': ['b-', 22.0 * MIN], '88-225': ['b-', 14.9 * DAY],
    '89-225': ['a', 9.92 * DAY], '90-229': ['a', 7917 * YR], '91-233': ['b-', 26.97 * DAY], '92-232': ['a', 68.9 * YR], '92-236': ['a', 2.342e7 * YR], '92-237': ['b-', 6.75 * DAY],
    '94-236': ['a', 2.858 * YR], '94-242': ['a', 3.75e5 * YR], '94-244': ['a', 8.0e7 * YR], '95-243': ['a', 7370 * YR], '96-242': ['a', 162.8 * DAY], '98-249': ['a', 351 * YR],
    '99-253': ['a', 20.5 * DAY], '100-257': ['a', 100.5 * DAY]
  };
  // measured atomic masses (u) for binding energies
  const MASS = { '1-2': 2.01410178, '1-3': 3.01604928, '2-3': 3.01602932, '2-4': 4.00260325, '3-6': 6.0151229, '3-7': 7.0160034, '4-9': 9.0121831, '6-12': 12, '6-14': 14.0032420,
    '7-14': 14.0030740, '8-16': 15.9949146, '10-20': 19.9924402, '14-28': 27.9769265, '20-40': 39.9625909, '26-56': 55.9349363, '28-62': 61.9283454, '36-84': 83.9114977,
    '36-92': 91.926156, '50-120': 119.9022016, '56-138': 137.9052470, '56-141': 140.914411, '82-208': 207.9766521, '92-235': 235.0439299, '92-238': 238.0507882 };
  const M_H = 1.00782503, M_N = 1.00866492, UC2 = 931.49410242;
  const realBE = (Z, A) => { const m = MASS[Z + '-' + A]; return m == null ? null : (Z * M_H + (A - Z) * M_N - m) * UC2; };
  // liquid-drop binding energy (MeV)
  function semf(Z, N) {
    const A = Z + N;
    if (Z < 0 || N < 0 || A < 2) return A === 1 ? 0 : -Infinity;
    const a3 = Math.cbrt(A);
    let B = 15.75 * A - 17.8 * a3 * a3 - 0.711 * Z * (Z - 1) / a3 - 23.7 * (N - Z) * (N - Z) / A;
    if (Z % 2 === 0 && N % 2 === 0) B += 11.18 / Math.sqrt(A);
    else if (Z % 2 === 1 && N % 2 === 1) B -= 11.18 / Math.sqrt(A);
    return B;
  }
  const LIGHT = { 1: [0, 1, 2], 2: [1, 2, 4, 6] };                          // bound nuclides of H and He, by N
  function bound(Z, N) {
    if (Z < 1 || N < 0) return false;
    if (Z <= 2) return LIGHT[Z].includes(N);
    const B = semf(Z, N);
    return B - semf(Z, N - 1) > 0 && B - semf(Z - 1, N) > 0 && (N > 0);
  }
  const tAlpha = (Z, Q) => Q > 0.5 ? Math.pow(10, (1.66175 * Z - 8.5166) / Math.sqrt(Q) - 0.20228 * Z - 33.9069) : Infinity;   // Viola–Seaborg
  const tBeta = Q => Q > 0.01 ? Math.pow(10, 3.8 - 5 * Math.log10(Q)) : Infinity;                                          // Sargent's rule, roughly
  // beta decay runs along an isobar towards its beta-stable member: the stable nuclides and the long-lived alpha emitters
  const ANCHORS = {};
  for (const z in STABLE) for (const a of STABLE[z]) (ANCHORS[a] = ANCHORS[a] || []).push(+z);
  for (const k in KNOWN) if (KNOWN[k][0] === 'a' || KNOWN[k][0] === 'sf') { const [z, a] = k.split('-').map(Number); (ANCHORS[a] = ANCHORS[a] || []).push(z); }
  const nucCache = new Map();
  /* what the chart knows about a nuclide: { mode: 'stable'|'b-'|'b+'|'ec'|'a'|'sf', t (s) if measured, known, model } or null if unbound */
  function nuclide(Z, N) {
    const key = Z + ',' + N;
    if (nucCache.has(key)) return nucCache.get(key);
    const A = Z + N;
    let r = null;
    if (STABLE[Z] && STABLE[Z].includes(A)) r = { mode: 'stable', known: true };
    else if (KNOWN[Z + '-' + A]) r = { mode: KNOWN[Z + '-' + A][0], t: KNOWN[Z + '-' + A][1], known: true };
    else if (bound(Z, N) && Z > 2) {
      const B = semf(Z, N);
      const qb = 0.782 + semf(Z + 1, N - 1) - B;
      const qe = -0.782 + semf(Z - 1, N + 1) - B;
      const qa = N > 2 ? semf(Z - 2, N - 2) + 28.296 - B : -1;
      const pos = qe > 1.022 ? 'b+' : 'ec';
      let an = ANCHORS[A];
      if (!an || !an.length) an = [Math.round(A / (1.98 + 0.0155 * Math.pow(A, 2 / 3)))];
      const nrich = an.some(z => z > Z), prich = an.some(z => z < Z);
      let mode;
      if (Z >= 104) mode = 'sf';
      else if (Z >= 84) mode = nrich ? 'b-' : !prich ? 'a' : (tAlpha(Z, qa) < (qe > 0 ? tBeta(qe) * 100 : Infinity) ? 'a' : pos);
      else if (nrich && prich) mode = qb >= qe ? 'b-' : pos;
      else if (nrich) mode = 'b-';
      else if (prich) mode = pos;
      else mode = Z >= 60 && qa > 0 ? 'a' : qb >= qe ? 'b-' : pos;
      r = { mode, model: true, q: { b: qb, e: qe, a: qa } };
    }
    nucCache.set(key, r);
    return r;
  }
  const MODE_NAME = { stable: 'stable', 'b-': 'β⁻ decay', 'b+': 'β⁺ (positron) decay', ec: 'electron capture', a: 'α decay', sf: 'spontaneous fission' };
  function daughter(Z, N, mode) {
    if (mode === 'b-') return [Z + 1, N - 1];
    if (mode === 'b+' || mode === 'ec') return [Z - 1, N + 1];
    if (mode === 'a') return [Z - 2, N - 2];
    return null;
  }
  function fmtTime(s) {
    if (!Number.isFinite(s)) return '—';
    if (s < 1e-3) return (s * 1e6).toPrecision(3) + ' µs';
    if (s < 1) return (s * 1e3).toPrecision(3) + ' ms';
    if (s < 120) return s.toPrecision(3) + ' s';
    if (s < 2 * HR) return (s / MIN).toPrecision(3) + ' min';
    if (s < 2 * DAY) return (s / HR).toPrecision(3) + ' h';
    if (s < YR) return (s / DAY).toPrecision(3) + ' days';
    const y = s / YR;
    if (y < 1e4) return y.toPrecision(3) + ' years';
    const e = Math.floor(Math.log10(y));
    return (y / Math.pow(10, e)).toFixed(2) + ' × 10' + sup(e) + ' years';
  }
  const nucName = (chem, Z, A) => { const e = chem.el(Z); return e ? sup(A) + e.sym + ' (' + e.name.toLowerCase() + '-' + A + ')' : 'Z = ' + Z; };

  /* a #rrggbb colour lightened or darkened, for shaded balls */
  function shade(hex, k) {
    const n = parseInt(String(hex).slice(1), 16);
    if (!Number.isFinite(n)) return hex;
    let r = n >> 16, g = (n >> 8) & 255, b = n & 255;
    const t = k > 0 ? 255 : 0, a = Math.abs(k);
    r = Math.round(r + (t - r) * a); g = Math.round(g + (t - g) * a); b = Math.round(b + (t - b) * a);
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  }
  function ball(c, x, y, r, hex) {
    const g = c.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
    g.addColorStop(0, shade(hex, 0.6)); g.addColorStop(0.55, hex); g.addColorStop(1, shade(hex, -0.45));
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = g; c.fill();
    c.lineWidth = 0.8; c.strokeStyle = 'rgba(0,0,0,.45)'; c.stroke();
  }

  /* visible wavelength (nm) to a colour; null outside 380–750 nm */
  function waveColor(nm, alpha) {
    if (!(nm >= 380 && nm <= 750)) return null;
    let r = 0, g = 0, b = 0;
    if (nm < 440) { r = (440 - nm) / 60; b = 1; }
    else if (nm < 490) { g = (nm - 440) / 50; b = 1; }
    else if (nm < 510) { g = 1; b = (510 - nm) / 20; }
    else if (nm < 580) { r = (nm - 510) / 70; g = 1; }
    else if (nm < 645) { r = 1; g = (645 - nm) / 65; }
    else r = 1;
    let f = 1;
    if (nm < 420) f = 0.3 + 0.7 * (nm - 380) / 40; else if (nm > 700) f = 0.3 + 0.7 * (750 - nm) / 50;
    const q = v => Math.round(255 * Math.pow(v * f, 0.8));
    return 'rgba(' + q(r) + ',' + q(g) + ',' + q(b) + ',' + (alpha == null ? 1 : alpha) + ')';
  }

  /* ================================================================ 1. build an atom */
  Hyper.sim('atom-build', {
    title: 'Build an atom: protons, neutrons and electrons',
    blurb: `Set the numbers of protons, neutrons and electrons. The protons alone decide the element; neutrons change the isotope; electrons change the charge. The nucleus is drawn hugely enlarged — at true scale it would be a speck 20 000 times smaller than the electron cloud.

- Start from carbon-12 (6, 6, 6) and add two neutrons: still carbon, now radioactive carbon-14.
- Take one electron off sodium (11, 12, 11): the sodium ion Na⁺, with the neon arrangement of electrons.
- Give chlorine one extra electron (17, 18, 18): chloride, Cl⁻. Then try iron with 23 electrons — Fe³⁺ loses its 4s electrons first.
- Push the neutrons far from the stable number and watch the nucleus turn unstable, or unbound altogether.`,
    mount(box, kit, params) {
      const P = params || {};
      const chem = kit.chem;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300 });
      const ctl = kit.controls(box.side, [
        { id: 'p', label: 'Protons (Z)', min: 1, max: 92, step: 1, value: P.p != null ? +P.p : 6 },
        { id: 'n', label: 'Neutrons (N)', min: 0, max: 146, step: 1, value: P.n != null ? +P.n : 6 },
        { id: 'e', label: 'Electrons', min: 0, max: 95, step: 1, value: P.e != null ? +P.e : 6 },
        { type: 'buttons', items: [{ id: 'neutral', label: 'Make it neutral' }, { id: 'stable', label: 'Common isotope' }] }
      ], id => {
        if (id === 'neutral') ctl.set('e', Math.round(V.p));
        else if (id === 'stable') ctl.set('n', commonN(Math.round(V.p)));
        describe(); loop.once();
      });
      const ro = kit.readout(box.side, [['el', 'Element'], ['nuc', 'Symbol'], ['A', 'Mass number A = Z + N'], ['q', 'Charge'], ['kind', 'Particle'], ['stab', 'Nucleus'], ['cfg', 'Electrons']]);
      const V = ctl.values;
      let nucleons = [], occ = {}, info = {};

      function commonN(Z) {
        const e = chem.el(Z);
        const st2 = STABLE[Z];
        if (!st2) return Math.max(0, Math.round(e.mass) - Z);
        let best = st2[0];
        for (const A of st2) if (Math.abs(A - e.mass) < Math.abs(best - e.mass)) best = A;
        return best - Z;
      }
      function describe() {
        const Z = Math.round(V.p), N = Math.round(V.n), ne = Math.round(V.e), A = Z + N, q = Z - ne;
        const e = chem.el(Z);
        occ = ionOcc(chem, Z, q);
        ro.set('el', e.name + ' (' + e.sym + '), Z = ' + Z);
        ro.set('nuc', sup(A) + e.sym + chargeText(q) + '  ·  ' + e.name.toLowerCase() + '-' + A);
        ro.set('A', Z + ' + ' + N + ' = ' + A);
        ro.set('q', q === 0 ? '0' : (q > 0 ? '+' : '−') + Math.abs(q) + '  (' + Z + ' protons, ' + ne + ' electrons)');
        ro.set('kind', q === 0 ? 'neutral atom' : q > 0 ? 'cation: ' + q + ' electron' + (q > 1 ? 's' : '') + ' lost' : 'anion: ' + (-q) + ' electron' + (q < -1 ? 's' : '') + ' gained');
        const nu = nuclide(Z, N);
        let s;
        if (!nu) s = N < commonN(Z) ? 'unbound: too few neutrons, it would fall apart at once' : 'unbound: too many neutrons, one would drip off at once';
        else if (nu.mode === 'stable') s = 'stable';
        else if (nu.known) s = (Z === 83 && A === 209 ? 'effectively stable: ' : 'radioactive: ') + MODE_NAME[nu.mode] + ', half-life ' + fmtTime(nu.t);
        else s = 'radioactive: ' + MODE_NAME[nu.mode] + ' expected (' + (nu.mode === 'b-' ? 'too many neutrons' : nu.mode === 'a' || nu.mode === 'sf' ? 'too heavy' : 'too few neutrons') + ')';
        ro.set('stab', s);
        ro.set('cfg', ne === 0 ? 'none: a bare nucleus' : occText(occ) + (q < -3 ? ' (so many extra electrons would not stay bound)' : ''));
        info = { Z, N, A, q, e, stable: nu && nu.mode === 'stable' };
        // nucleons in a sunflower pattern, protons spread evenly among neutrons
        nucleons = [];
        for (let i = 0; i < A; i++) nucleons.push({ p: Math.floor((i + 1) * Z / A) > Math.floor(i * Z / A), i });
      }

      function frame(dt, t) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const cx = W * 0.38, cy = H * 0.5;
        const R = Math.min(W * 0.34, H * 0.44);
        const A = info.A || 1;
        const rb = clamp(R * 0.17 / Math.sqrt(A + 1), 2.2, 11);
        const Rn = rb * 1.05 * Math.sqrt(A) + rb;
        // shells, grouped by n
        const byN = {};
        for (const s in occ) byN[s[0]] = (byN[s[0]] || 0) + occ[s];
        const ns = Object.keys(byN).map(Number).sort((a, b) => a - b);
        const nmax = ns.length ? ns[ns.length - 1] : 0;
        for (let k = 1; k <= nmax; k++) {
          const r = Rn + 10 + k * (R - Rn - 10) / Math.max(nmax, 1);
          c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2);
          c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 4]); c.stroke(); c.setLineDash([]);
          const cnt = byN[k] || 0;
          for (let j = 0; j < cnt; j++) {
            const a = (t || 0) * 0.6 / k + j * 2 * Math.PI / cnt + k;
            kit.dot(c, cx + r * Math.cos(a), cy + r * Math.sin(a), 3.6, C.accent);
          }
          kit.label(c, 'n = ' + k + ': ' + cnt, cx + r * 0.72 + 4, cy - r * 0.72 - 4, { size: 10.5, color: C.muted });
        }
        // nucleus: outer nucleons first so the inner ones sit on top
        const pc = kit.colors().dark ? '#e0584d' : '#d04438', nc = kit.colors().dark ? '#9aa3b8' : '#8a93a8';
        for (let k = nucleons.length - 1; k >= 0; k--) {
          const nu = nucleons[k];
          const r = rb * 1.05 * Math.sqrt(nu.i + 0.5), a = nu.i * 2.39996;
          ball(c, cx + r * Math.cos(a), cy + r * Math.sin(a), rb, nu.p ? pc : nc);
        }
        // the symbol, large, at the right
        const e = info.e;
        if (e) {
          const sx = W * 0.86, sy = H * 0.3;
          kit.label(c, e.sym, sx, sy, { size: 44, weight: 700, align: 'center' });
          kit.label(c, String(info.A), sx - 26 - 7 * e.sym.length, sy - 22, { size: 16, align: 'right', color: C.text2 });
          kit.label(c, String(info.Z), sx - 26 - 7 * e.sym.length, sy + 20, { size: 16, align: 'right', color: C.text2 });
          if (info.q) kit.label(c, (Math.abs(info.q) > 1 ? Math.abs(info.q) : '') + (info.q > 0 ? '+' : '−'), sx + 22 + 7 * e.sym.length, sy - 22, { size: 16, weight: 700, color: C.warn });
          kit.label(c, e.name, sx, sy + 48, { size: 13, align: 'center', color: C.muted });
          kit.label(c, info.stable ? 'stable nucleus' : 'unstable nucleus', sx, sy + 68, { size: 12, align: 'center', color: info.stable ? C.ok : C.bad });
        }
        // legend
        const ly = H - 16;
        ball(c, 16, ly, 6, pc); kit.label(c, 'proton', 26, ly, { size: 11.5, color: C.muted });
        ball(c, 86, ly, 6, nc); kit.label(c, 'neutron', 96, ly, { size: 11.5, color: C.muted });
        kit.dot(c, 164, ly, 3.6, C.accent); kit.label(c, 'electron', 172, ly, { size: 11.5, color: C.muted });
        kit.label(c, 'not to scale', W - 12, ly, { size: 11, color: C.faint, align: 'right' });
      }
      describe();
      const loop = kit.loop((dt, t) => frame(dt, t), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 2. the hydrogen spectrum */
  const SERIES = { 1: 'Lyman', 2: 'Balmer', 3: 'Paschen', 4: 'Brackett', 5: 'Pfund', 6: 'Humphreys' };
  const RINF = 10973731.568, ME_U = 5.48579909e-4, HC_EVNM = 1239.84198;
  const NUC_MASS = { 1: 1.00727647, 2: 4.00150618, 3: 7.01435797 };

  Hyper.sim('atom-hydrogen-spectrum', {
    title: 'The hydrogen spectrum: jumps between energy levels',
    blurb: `The ladder shows the allowed energies of the electron, $E_n = -13.6\\ \\mathrm{eV}\\,Z^2/n^2$, drawn to scale. Choose two levels (or click one on the ladder) and fire the jump: the photon carries exactly the energy difference, and its line appears in the spectrum below — full range on a log scale, and the visible part as you would see it in a spectroscope.

- Go through the Balmer series (lower level 2): red, blue-green, violet, violet… and then the lines crowd into the ultraviolet.
- Compare 2 → 1 with 7 → 6: the levels squeeze together near 0 eV, so high jumps carry little energy.
- Tick **Discharge tube**: random excitations and cascades build up the whole emission spectrum.
- Switch to **Absorption** with the discharge on: a cold gas starts in n = 1, so it absorbs only the Lyman lines, all in the ultraviolet.
- Try He⁺: the same pattern, every energy four times larger.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 380 });
      const ctl = kit.controls(box.side, [
        { id: 'Z', type: 'select', label: 'Atom or ion', options: [['Hydrogen, H', 1], ['Helium ion, He⁺', 2], ['Lithium ion, Li²⁺', 3]], value: 1 },
        { id: 'mode', type: 'select', label: 'Light', options: [['Emission: a hot gas glows', 'em'], ['Absorption: white light through cool gas', 'ab']], value: 'em' },
        { id: 'hi', label: 'Upper level n₂', min: 2, max: 8, step: 1, value: 3 },
        { id: 'lo', label: 'Lower level n₁', min: 1, max: 7, step: 1, value: 2 },
        { id: 'dis', type: 'check', label: 'Discharge tube: random jumps', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Make the jump', primary: true }, { id: 'clear', label: 'Clear spectrum' }] }
      ], (id, v) => {
        if (id === 'hi' && Math.round(V.hi) <= Math.round(V.lo)) ctl.set('lo', Math.round(V.hi) - 1);
        if (id === 'lo' && Math.round(V.lo) >= Math.round(V.hi)) ctl.set('hi', Math.min(8, Math.round(V.lo) + 1));
        if (id === 'go') fire(Math.round(V.hi), Math.round(V.lo));
        if (id === 'clear' || id === 'Z' || id === 'mode') counts = {};
        describe();
      });
      const ro = kit.readout(box.side, [['tr', 'Jump'], ['ser', 'Series'], ['dE', 'Energy gap ΔE'], ['lam', 'Wavelength λ'], ['nu', 'Frequency'], ['mol', 'Per mole of photons'], ['col', 'Region']]);
      const V = ctl.values;
      let counts = {}, photons = [], anim = null, clock = 0, cur = 1;

      const Z = () => +V.Z || 1;
      const RM = () => RINF / (1 + ME_U / (NUC_MASS[Z()] || 1.00727647));
      const E = n => -HC_EVNM * 1e-9 * RM() * Z() * Z() / (n * n);                       // eV
      const lam = (a, b) => 1e9 / (RM() * Z() * Z() * Math.abs(1 / (a * a) - 1 / (b * b)));    // nm
      const region = nm => nm < 10 ? 'extreme ultraviolet' : nm < 380 ? 'ultraviolet' : nm <= 750 ? 'visible' : 'infrared';
      const colorName = nm => nm < 380 ? 'ultraviolet (invisible)' : nm < 450 ? 'violet' : nm < 495 ? 'blue' : nm < 520 ? 'blue-green' : nm < 570 ? 'green' : nm < 590 ? 'yellow' : nm < 620 ? 'orange' : nm <= 750 ? 'red' : 'infrared (invisible)';
      function describe() {
        const a = Math.round(V.hi), b = Math.round(V.lo);
        const L = lam(a, b), dE = E(a) - E(b);
        ro.set('tr', V.mode === 'em' ? 'n = ' + a + ' → ' + b + ' (emits)' : 'n = ' + b + ' → ' + a + ' (absorbs)');
        ro.set('ser', (SERIES[b] || 'n₁ = ' + b) + ' series');
        ro.set('dE', kit.fmt(dE, 4) + ' eV');
        ro.set('lam', kit.fmt(L, 4) + ' nm');
        ro.set('nu', kit.fmt(299792458 / (L * 1e-9) / 1e12, 4) + ' THz');
        ro.set('mol', kit.fmt(dE * 96.485, 4) + ' kJ/mol');
        ro.set('col', region(L) + (L >= 380 && L <= 750 ? ': ' + colorName(L) : ''));
      }
      function spawnPhoton(a, b, x, y) {
        const L = lam(a, b);
        photons.push({ x, y, L, age: 0, up: V.mode === 'ab' });
        if (photons.length > 40) photons.shift();
      }
      function fire(a, b) {
        anim = { a, b, t: 0 };
        const key = b + '-' + a;
        counts[key] = (counts[key] || 0) + 3;
      }
      // geometry, shared by drawing and clicking
      function geo() {
        const W = st.W, H = st.H;
        return { x0: 64, x1: W * 0.5, yTop: 34, yBot: H * 0.6, W, H };
      }
      const yOf = (g, e) => g.yTop + (g.yBot - g.yTop) * (e / E(1));
      kit.click(st, p => {
        const g = geo();
        if (p.x > g.x1 + 30 || p.y > g.yBot + 20) return;
        let best = 1, bd = Infinity;
        for (let n = 1; n <= 8; n++) { const d = Math.abs(yOf(g, E(n)) - p.y); if (d < bd) { bd = d; best = n; } }
        if (best > Math.round(V.lo)) ctl.set('hi', best);
        else if (best < Math.round(V.hi)) ctl.set('lo', best);
        if (Math.round(V.hi) <= Math.round(V.lo)) ctl.set('hi', Math.min(8, Math.round(V.lo) + 1));
        describe(); loop.once();
      }, p => { const g = geo(); return p.x < g.x1 + 30 && p.y < g.yBot + 20; });

      function strip(c, C, x0, y0, w, h, lo, hi, log, title) {
        const X = nm => x0 + w * (log ? Math.log(nm / lo) / Math.log(hi / lo) : (nm - lo) / (hi - lo));
        // background: dark for emission, rainbow for absorption
        c.fillStyle = V.mode === 'em' ? '#05060a' : C.surface; c.fillRect(x0, y0, w, h);
        const step = log ? 1.01 : 1;
        for (let nm = Math.max(lo, 380); nm < Math.min(hi, 750); nm = log ? nm * step : nm + step) {
          const xa = X(nm), xb = X(log ? nm * step : nm + step);
          c.fillStyle = waveColor(nm, V.mode === 'em' ? 0.13 : 0.95); c.fillRect(xa, y0, xb - xa + 0.6, h);
        }
        if (log) {
          if (lo < 380) { c.fillStyle = kit.hue(270, V.mode === 'em' ? 0.12 : 0.25); c.fillRect(x0, y0, Math.max(0, Math.min(X(380), x0 + w) - x0), h); }
          if (hi > 750) { const xa = Math.max(X(750), x0); c.fillStyle = kit.hue(0, V.mode === 'em' ? 0.1 : 0.22); c.fillRect(xa, y0, x0 + w - xa, h); }
        }
        // the lines
        const maxC = Math.max(1, ...Object.values(counts));
        const selA = Math.round(V.hi), selB = Math.round(V.lo);
        for (let b = 1; b <= 7; b++) for (let a = b + 1; a <= 8; a++) {
          const L = lam(a, b);
          if (L < lo || L > hi) continue;
          const cnt = counts[b + '-' + a] || 0;
          const sel = a === selA && b === selB;
          let alpha;
          if (V.mode === 'em') alpha = V.dis ? (cnt ? 0.25 + 0.75 * cnt / maxC : 0.06) : (sel ? 1 : 0.28 + (cnt ? 0.5 : 0));
          else alpha = V.dis ? (cnt ? 0.3 + 0.7 * cnt / maxC : 0) : (b === selB ? (sel ? 1 : 0.65) : 0.08);
          if (alpha <= 0) continue;
          const x = X(L);
          const col = V.mode === 'em' ? (waveColor(L, alpha) || (L < 380 ? kit.hue(270, alpha) : kit.hue(0, alpha))) : 'rgba(0,0,0,' + (0.9 * alpha) + ')';
          c.fillStyle = col; c.fillRect(x - (sel ? 1.5 : 1), y0, sel ? 3 : 2, h);
          if (sel) { c.strokeStyle = C.accent; c.lineWidth = 1.5; c.strokeRect(x - 4, y0 - 3, 8, h + 6); }
        }
        c.strokeStyle = C.border2 || C.muted; c.lineWidth = 1; c.strokeRect(x0, y0, w, h);
        // ticks
        const ticks = log ? [5, 10, 20, 50, 100, 200, 500, 1000, 2000, 5000] : [400, 450, 500, 550, 600, 650, 700, 750];
        for (const t of ticks) {
          if (t < lo || t > hi) continue;
          const x = X(t);
          c.fillStyle = C.muted; c.fillRect(x, y0 + h, 1, 4);
          kit.label(c, String(t), x, y0 + h + 12, { size: 10, align: 'center', color: C.muted });
        }
        kit.label(c, title, x0, y0 - 9, { size: 11.5, color: C.text2, weight: 600 });
        return X;
      }

      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const g = geo(), W = g.W, H = g.H;
        clock += dt;
        // discharge: an electron cascading at random
        if (V.dis && dt) {
          while (clock > 0.09) {
            clock -= 0.09;
            if (V.mode === 'ab') {
              const a = 2 + Math.floor(Math.random() * 7);
              counts['1-' + a] = (counts['1-' + a] || 0) + 1;
              if (Math.random() < 0.3) spawnPhoton(a, 1, g.x0 + 60, yOf(g, E(1)));
            } else if (cur === 1) cur = 2 + Math.floor(Math.random() * 7);
            else {
              const b = 1 + Math.floor(Math.random() * (cur - 1));
              counts[b + '-' + cur] = (counts[b + '-' + cur] || 0) + 1;
              if (Math.random() < 0.35) spawnPhoton(cur, b, g.x0 + 60 + Math.random() * 80, (yOf(g, E(cur)) + yOf(g, E(b))) / 2);
              cur = b;
            }
          }
        } else clock = 0;
        // the ladder
        c.strokeStyle = C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(g.x0 - 8, g.yTop - 8); c.lineTo(g.x0 - 8, g.yBot + 6); c.stroke();
        kit.label(c, 'energy', g.x0 - 12, g.yTop - 18, { size: 10.5, color: C.muted, align: 'center' });
        c.strokeStyle = C.faint; c.setLineDash([5, 4]);
        c.beginPath(); c.moveTo(g.x0, g.yTop); c.lineTo(g.x1, g.yTop); c.stroke(); c.setLineDash([]);
        kit.label(c, '0 eV: electron free', g.x1 - 2, g.yTop - 8, { size: 10.5, color: C.muted, align: 'right' });
        const A = Math.round(V.hi), B = Math.round(V.lo);
        for (let n = 1; n <= 8; n++) {
          const y = yOf(g, E(n));
          const on = n === A || n === B;
          c.strokeStyle = on ? C.accent : C.text2; c.lineWidth = on ? 2.5 : 1.3;
          c.beginPath(); c.moveTo(g.x0, y); c.lineTo(g.x1, y); c.stroke();
          if (n <= 4 || on) {
            kit.label(c, 'n = ' + n, g.x0 - 14, y, { size: 11, align: 'right', color: on ? C.accent : C.muted });
            if (n <= 3) kit.label(c, kit.fmt(E(n), 3) + ' eV', g.x1 - 2, y - 8, { size: 10.5, color: C.muted, align: 'right' });
          }
        }
        // the chosen jump
        const ya = yOf(g, E(A)), yb = yOf(g, E(B));
        const L = lam(A, B);
        const pcol = waveColor(L) || (L < 380 ? kit.hue(270) : kit.hue(0));
        const ax = g.x0 + (g.x1 - g.x0) * 0.42;
        if (V.mode === 'em') kit.arrow(c, ax, ya, ax, yb, pcol, 3); else kit.arrow(c, ax, yb, ax, ya, pcol, 3);
        if (anim) {
          anim.t += dt * 1.6;
          const f = Math.min(1, anim.t);
          const y0 = V.mode === 'em' ? yOf(g, E(anim.a)) : yOf(g, E(anim.b)), y1 = V.mode === 'em' ? yOf(g, E(anim.b)) : yOf(g, E(anim.a));
          kit.dot(c, ax, y0 + (y1 - y0) * f, 5, C.accent, C.text);
          if (anim.t >= 1 && !anim.sent) { anim.sent = true; spawnPhoton(anim.a, anim.b, ax, (y0 + y1) / 2); }
          if (anim.t > 1.6) anim = null;
        }
        // photons flying off (emission) or arriving (absorption)
        for (const ph of photons) {
          ph.age += dt;
          const col = waveColor(ph.L) || (ph.L < 380 ? kit.hue(270) : kit.hue(0));
          const len = 70, wl = clamp(ph.L / 40, 4, 30);
          const x = ph.up ? ph.x + 260 - ph.age * 240 : ph.x + ph.age * 240;
          c.strokeStyle = col; c.lineWidth = 2; c.beginPath();
          for (let k = 0; k <= len; k += 2) { const xx = x + k - len / 2, yy = ph.y + 6 * Math.sin((k / wl) * Math.PI * 2) * Math.sin(Math.PI * k / len); k ? c.lineTo(xx, yy) : c.moveTo(xx, yy); }
          c.stroke();
        }
        photons = photons.filter(ph => ph.age < 1.6);
        // the numbers, big
        kit.label(c, 'λ = ' + kit.fmt(L, 4) + ' nm', W * 0.77, g.yTop + 26, { size: 20, weight: 650, align: 'center' });
        kit.label(c, 'ΔE = ' + kit.fmt(E(A) - E(B), 3) + ' eV', W * 0.77, g.yTop + 54, { size: 14, align: 'center', color: C.text2 });
        c.fillStyle = pcol; c.fillRect(W * 0.77 - 40, g.yTop + 72, 80, 14);
        kit.label(c, colorName(L), W * 0.77, g.yTop + 100, { size: 12, align: 'center', color: C.muted });
        kit.label(c, (SERIES[B] || '') + ' series', W * 0.77, g.yTop + 120, { size: 12, align: 'center', color: C.muted });
        // spectrum strips
        const z2 = Z() * Z();
        strip(c, C, 16, H * 0.7, W - 32, H * 0.09, 50 / z2, 8000 / z2, true, 'Whole spectrum (log scale, nm): ultraviolet · visible · infrared');
        strip(c, C, 16, H * 0.88, W - 32, H * 0.07, 380, 750, false, 'Visible part (nm), as seen in a spectroscope');
      }
      describe();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 3. orbitals in 3-D */
  const E_ = Math.exp;
  const ORBITALS = {
    '1s': { n: 1, l: 0, R: r => E_(-r), A: () => 1, rad: [], planes: [], cones: [], label: '1s' },
    '2s': { n: 2, l: 0, R: r => (2 - r) * E_(-r / 2), A: () => 1, rad: [2], planes: [], cones: [], label: '2s' },
    '2p_z': { n: 2, l: 1, R: r => r * E_(-r / 2), A: (x, y, z) => z, rad: [], planes: [[0, 0, 1]], cones: [], label: '2pz' },
    '2p_x': { n: 2, l: 1, R: r => r * E_(-r / 2), A: (x) => x, rad: [], planes: [[1, 0, 0]], cones: [], label: '2px' },
    '2p_y': { n: 2, l: 1, R: r => r * E_(-r / 2), A: (x, y) => y, rad: [], planes: [[0, 1, 0]], cones: [], label: '2py' },
    '3s': { n: 3, l: 0, R: r => (27 - 18 * r + 2 * r * r) * E_(-r / 3), A: () => 1, rad: [(18 - Math.sqrt(108)) / 4, (18 + Math.sqrt(108)) / 4], planes: [], cones: [], label: '3s' },
    '3p_z': { n: 3, l: 1, R: r => r * (6 - r) * E_(-r / 3), A: (x, y, z) => z, rad: [6], planes: [[0, 0, 1]], cones: [], label: '3pz' },
    '3d_z2': { n: 3, l: 2, R: r => r * r * E_(-r / 3), A: (x, y, z) => 3 * z * z - 1, rad: [], planes: [], cones: [Math.acos(1 / Math.sqrt(3))], label: '3dz²' },
    '3d_xz': { n: 3, l: 2, R: r => r * r * E_(-r / 3), A: (x, y, z) => x * z, rad: [], planes: [[1, 0, 0], [0, 0, 1]], cones: [], label: '3dxz' },
    '3d_yz': { n: 3, l: 2, R: r => r * r * E_(-r / 3), A: (x, y, z) => y * z, rad: [], planes: [[0, 1, 0], [0, 0, 1]], cones: [], label: '3dyz' },
    '3d_xy': { n: 3, l: 2, R: r => r * r * E_(-r / 3), A: (x, y) => x * y, rad: [], planes: [[1, 0, 0], [0, 1, 0]], cones: [], label: '3dxy' },
    '3d_x2y2': { n: 3, l: 2, R: r => r * r * E_(-r / 3), A: (x, y) => x * x - y * y, rad: [], planes: [[Math.SQRT1_2, -Math.SQRT1_2, 0], [Math.SQRT1_2, Math.SQRT1_2, 0]], cones: [], label: '3dx²−y²' },
    '4f_z3': { n: 4, l: 3, R: r => r * r * r * E_(-r / 4), A: (x, y, z) => z * (5 * z * z - 3), rad: [], planes: [[0, 0, 1]], cones: [Math.acos(Math.sqrt(0.6))], label: '4fz³' }
  };
  const RMAX = [0, 10, 24, 36, 52];
  const A0PM = 52.9177;

  Hyper.sim('atom-orbitals', {
    title: 'Orbitals in 3-D: clouds, lobes and nodes',
    blurb: `Each dot is a place where the electron might be found, drawn at random with probability $\\psi^2$ — so the cloud is densest where the electron spends most time. The two colours are the two signs of $\\psi$. Drag to turn the orbital. The graph shows the radial distribution $r^2R^2$: how likely the electron is to be at each distance from the nucleus.

- Compare 1s, 2s and 3s: each is bigger, and each hides one more spherical node (tick **Slice** to see the empty shells).
- 2pz: two lobes of opposite sign, with a nodal plane between them. Turn it until the plane is edge-on.
- 3dxy and 3dx²−y² are the same shape turned by 45°: one points between the axes, one along them.
- 3dz² has a doughnut round its waist; its nodes are two cones, not planes.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 320 });
      const P = params || {};
      const keys = Object.keys(ORBITALS);
      const ctl = kit.controls(box.side, [
        { id: 'orb', type: 'select', label: 'Orbital', options: keys.map(k => [ORBITALS[k].label, k]), value: keys.includes(P.orb) ? P.orb : '2p_z' },
        { id: 'npts', label: 'Dots', min: 1000, max: 9000, step: 500, value: 5000 },
        { id: 'nodes', type: 'check', label: 'Show nodes', value: true },
        { id: 'slice', type: 'check', label: 'Slice: only a thin layer through the nucleus', value: false },
        { id: 'axes', type: 'check', label: 'Axes', value: true },
        { id: 'spin', type: 'check', label: 'Turn slowly', value: true },
        { type: 'buttons', items: [{ id: 'again', label: 'New random dots' }] }
      ], id => { if (id === 'orb' || id === 'npts' || id === 'again') build(); loop.once(); });
      const ro = kit.readout(box.side, [['name', 'Orbital'], ['qn', 'n, l'], ['nodes', 'Nodes'], ['rmp', 'Most probable distance'], ['r90', '90 % of the time within']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'distance from the nucleus r (pm)' }, y: { label: 'r²R² (relative)', min: 0 } }, 150);
      const V = ctl.values;
      const view = kit.mol.view({ rotX: -0.35, rotY: 0.5 });
      kit.mol.rotator(st, view, () => loop.once());
      let pts = [], extent = 5, orb = ORBITALS['2p_z'];

      function build() {
        orb = ORBITALS[V.orb] || ORBITALS['2p_z'];
        const rmax = RMAX[orb.n] || 30, M = 1500;
        const cdf = new Float64Array(M + 1), pr = [];
        let tot = 0, best = 0, rbest = 0;
        for (let i = 0; i < M; i++) {
          const r = (i + 0.5) * rmax / M, R = orb.R(r), p = r * r * R * R;
          tot += p; cdf[i + 1] = tot;
          if (p > best) { best = p; rbest = r; }
          if (i % 6 === 0) pr.push([r * A0PM, p]);
        }
        for (let i = 0; i <= M; i++) cdf[i] /= tot || 1;
        const rAt = f => { let lo = 0, hi = M; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cdf[m] < f) lo = m; else hi = m; } return (lo + Math.random()) * rmax / M; };
        const rq = f => { let i = 0; while (i < M && cdf[i] < f) i++; return i * rmax / M; };
        extent = rq(0.97);
        // angular maximum, by sampling directions
        let amax = 0;
        for (let k = 0; k < 3000; k++) { const d = randDir(); const a = orb.A(d[0], d[1], d[2]); amax = Math.max(amax, a * a); }
        amax = amax * 1.05 || 1;
        pts = [];
        const want = Math.round(V.npts);
        let tries = 0;
        while (pts.length < want && tries < want * 60) {
          tries++;
          const d = randDir(), a = orb.A(d[0], d[1], d[2]);
          if (Math.random() * amax > a * a) continue;
          const r = rAt(Math.random()), R = orb.R(r);
          pts.push([r * d[0], r * d[1], r * d[2], (R * a) >= 0 ? 1 : -1]);
        }
        const peaks = [[rbest * A0PM, best]];
        plot.set({
          x: { label: 'distance from the nucleus r (pm)', min: 0, max: rq(0.995) * A0PM },
          y: { label: 'r²R² (relative)', min: 0, max: best * 1.15 },
          series: [{ pts: pr, label: orb.label, fill: true }],
          vlines: orb.rad.map(r => ({ x: r * A0PM, label: 'node' })),
          marks: peaks.map(p => ({ x: p[0], y: p[1], label: 'most probable ' + Math.round(p[0]) + ' pm' }))
        });
        const nr = orb.n - orb.l - 1;
        ro.set('name', orb.label + ' (hydrogen)');
        ro.set('qn', 'n = ' + orb.n + ', l = ' + orb.l + ' (' + 'spdf'[orb.l] + ')');
        ro.set('nodes', nr + ' radial (spheres), ' + orb.l + ' angular (' + (orb.cones.length ? 'plane or cones' : orb.l ? 'planes' : 'none') + ')');
        ro.set('rmp', Math.round(rbest * A0PM) + ' pm');
        ro.set('r90', Math.round(rq(0.9) * A0PM) + ' pm');
      }
      function randDir() {
        const u = 2 * Math.random() - 1, ph = 2 * Math.PI * Math.random(), s = Math.sqrt(1 - u * u);
        return [s * Math.cos(ph), s * Math.sin(ph), u];
      }
      // chemistry axes (z up) into the view's frame (y up)
      const toView = p => [p[0], p[2], p[1]];
      function rot(p) {
        const cy = Math.cos(view.rotY), sy = Math.sin(view.rotY), cx = Math.cos(view.rotX), sx = Math.sin(view.rotX);
        const x1 = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy;
        return [x1, p[1] * cx - z1 * sx, p[1] * sx + z1 * cx];
      }
      function frame(dt) {
        if (V.spin && !view.dragging) view.rotY += 0.3 * (dt || 0);
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, cx = W / 2, cy = H / 2 + 6;
        const s = Math.min(W, H) * 0.44 / (extent || 1);
        const P2 = p => { const q = rot(toView(p)); return [cx + q[0] * s, cy - q[1] * s, q[2]]; };
        // axes
        if (V.axes) {
          const L = extent * 1.1;
          for (const [v, name] of [[[L, 0, 0], 'x'], [[0, L, 0], 'y'], [[0, 0, L], 'z']]) {
            const a = P2(v.map(x => -x)), b = P2(v);
            c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); c.stroke();
            kit.label(c, name, b[0] + 6, b[1], { size: 12, color: C.muted, weight: 600 });
          }
        }
        // nodes behind the cloud
        if (V.nodes) {
          c.lineWidth = 1.2;
          for (const r of orb.rad) { c.strokeStyle = C.warn; c.setLineDash([4, 4]); c.beginPath(); c.arc(cx, cy, r * s, 0, Math.PI * 2); c.stroke(); c.setLineDash([]); }
          const E2 = extent * 0.95;
          for (const nv of orb.planes) {
            // two unit vectors spanning the plane
            const a = Math.abs(nv[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
            const u = [nv[1] * a[2] - nv[2] * a[1], nv[2] * a[0] - nv[0] * a[2], nv[0] * a[1] - nv[1] * a[0]];
            const un = Math.hypot(u[0], u[1], u[2]) || 1; for (let k = 0; k < 3; k++) u[k] /= un;
            const w = [nv[1] * u[2] - nv[2] * u[1], nv[2] * u[0] - nv[0] * u[2], nv[0] * u[1] - nv[1] * u[0]];
            const corners = [[1, 1], [1, -1], [-1, -1], [-1, 1]].map(([i, j]) => P2([E2 * (i * u[0] + j * w[0]), E2 * (i * u[1] + j * w[1]), E2 * (i * u[2] + j * w[2])]));
            c.beginPath(); corners.forEach((q, k) => k ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath();
            c.fillStyle = kit.hue(45, 0.08); c.fill(); c.strokeStyle = kit.hue(45, 0.6); c.stroke();
          }
          for (const th of orb.cones) for (const sgn of [1, -1]) {
            c.beginPath();
            for (let k = 0; k <= 48; k++) {
              const ph = k / 48 * Math.PI * 2, rr = E2 * Math.sin(th), zz = sgn * E2 * Math.cos(th);
              const q = P2([rr * Math.cos(ph), rr * Math.sin(ph), zz]);
              k ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]);
            }
            c.strokeStyle = kit.hue(45, 0.7); c.stroke();
            const tip = P2([0, 0, 0]), rim = P2([E2 * Math.sin(th), 0, sgn * E2 * Math.cos(th)]), rim2 = P2([-E2 * Math.sin(th), 0, sgn * E2 * Math.cos(th)]);
            c.beginPath(); c.moveTo(rim[0], rim[1]); c.lineTo(tip[0], tip[1]); c.lineTo(rim2[0], rim2[1]); c.stroke();
          }
        }
        // the cloud
        const thin = extent * 0.09;
        for (const sign of [1, -1]) {
          c.fillStyle = sign > 0 ? C.series[0] : C.series[1];
          c.globalAlpha = 0.6;
          for (const p of pts) {
            if (p[3] !== sign) continue;
            if (V.slice && Math.abs(p[1]) > thin) continue;
            const q = P2(p);
            const sz = V.slice ? 2.4 : 1.8;
            c.fillRect(q[0] - sz / 2, q[1] - sz / 2, sz, sz);
          }
        }
        c.globalAlpha = 1;
        kit.dot(c, cx, cy, 3, C.text);
        kit.label(c, orb.label, 14, 20, { size: 18, weight: 650 });
        kit.label(c, orb.l ? 'colours: the two signs (phases) of ψ' : 'an s orbital has one sign everywhere' + (orb.rad.length ? ' — outside a node it flips' : ''), 14, 42, { size: 11.5, color: C.muted });
        if (V.slice) kit.label(c, 'slice through the xz plane', 14, 60, { size: 11.5, color: C.muted });
        kit.label(c, 'drag to turn · box ≈ ' + Math.round(2 * extent * A0PM) + ' pm across', W - 12, H - 12, { size: 11, color: C.faint, align: 'right' });
      }
      build();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 4. filling orbitals (aufbau) */
  const BLOCK_HUE = { s: 205, p: 40, d: 145, f: 300 };
  function cellOf(e) {
    if (e.z >= 57 && e.z <= 71) return { col: e.z - 57 + 3, row: 8.4 };
    if (e.z >= 89 && e.z <= 103) return { col: e.z - 89 + 3, row: 9.4 };
    return { col: e.group, row: e.period };
  }

  Hyper.sim('atom-aufbau', {
    title: 'Filling orbitals, element by element',
    blurb: `Each box is an orbital, each arrow an electron. The subshells are stacked in the order they fill (1s, 2s, 2p, 3s, 3p, 4s, 3d …). Press **Fill step by step** to watch the three rules at work: lowest energy first, two electrons of opposite spin per box, and one electron in each box of a subshell before any pair up. Click an element in the little periodic table to jump to it.

- Carbon, nitrogen, oxygen: two, three, then two unpaired electrons — Hund's rule. The Lewis symbol shows the same electrons as dots.
- Chromium (24) and copper (29) break the simple order: the real atoms take a 4s electron into 3d.
- Set the charge on iron (26) to +2 and +3: the 4s electrons leave first.
- Notice how the block colours match the subshell being filled.`,
    mount(box, kit, params) {
      const chem = kit.chem;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 360 });
      const z0 = params && params.z != null ? clamp(Math.round(+params.z), 1, 118) : 8;
      const ctl = kit.controls(box.side, [
        { id: 'z', label: 'Atomic number Z', min: 1, max: 118, step: 1, value: z0 },
        { id: 'q', label: 'Charge of the ion', min: -3, max: 3, step: 1, value: 0 },
        { type: 'buttons', items: [{ id: 'prev', label: '◀' }, { id: 'next', label: '▶' }, { id: 'fill', label: 'Fill step by step', primary: true }] }
      ], id => {
        if (id === 'prev') ctl.set('z', Math.max(1, Math.round(V.z) - 1));
        if (id === 'next') ctl.set('z', Math.min(118, Math.round(V.z) + 1));
        if (id === 'fill') anim = { k: 0, t: 0, phase: 0 }; else anim = null;
        if (id === 'z') ctl.set('q', clamp(Math.round(V.q), -3, Math.min(3, Math.round(V.z))));
        describe(); loop.once();
      });
      const ro = kit.readout(box.side, [['el', 'Element'], ['cfg', 'Configuration'], ['full', 'Written out'], ['unp', 'Unpaired electrons'], ['mag', 'Magnetism'], ['val', 'Valence electrons'], ['note', 'Note']]);
      const V = ctl.values;
      let anim = null, occ = {}, cells = [];

      function state() {
        const z = Math.round(V.z), q = clamp(Math.round(V.q), -3, Math.min(3, z));
        if (anim) {
          if (anim.phase === 0) return { occ: aufbauOcc(Math.min(anim.k, z)), filling: true };
          if (anim.phase === 1) return { occ: aufbauOcc(z), predicted: true };
        }
        return { occ: ionOcc(chem, z, q) };
      }
      function valence(e, o) {
        if (e.block !== 's' && e.block !== 'p') return null;
        let nmax = 0;
        for (const s in o) if (o[s] > 0) nmax = Math.max(nmax, +s[0]);
        return (o[nmax + 's'] || 0) + (o[nmax + 'p'] || 0);
      }
      function describe() {
        const z = Math.round(V.z), q = clamp(Math.round(V.q), -3, Math.min(3, z));
        const e = chem.el(z);
        occ = ionOcc(chem, z, q);
        const pred = aufbauOcc(z);
        const exc = Object.keys(pred).some(s => pred[s] !== parseFull(chem.fullConfig(z))[s]);
        ro.set('el', e.name + ' (' + e.sym + (q ? chargeText(q) : '') + '), Z = ' + z + ', ' + e.block + '-block');
        ro.set('cfg', occText(occ));
        ro.set('full', sortNL(Object.keys(occ)).map(s => s + sup(occ[s])).join(' ') || '—');
        const u = unpairedOf(occ);
        ro.set('unp', String(u));
        ro.set('mag', u ? 'paramagnetic (spin-only μ = ' + Math.sqrt(u * (u + 2)).toFixed(2) + ' μB)' : 'diamagnetic: every electron paired');
        const v = valence(e, parseFull(chem.fullConfig(z)));
        ro.set('val', v != null ? v + (e.group ? ' (group ' + e.group + ')' : '') : 'd/f-block: ns and inner (n−1)d or f electrons can all take part');
        let note = '';
        if (exc) note = 'Exception: the simple filling order predicts ' + occText(pred) + '; the real atom is ' + cfgPretty(chem.config(z)) + '.';
        else if (q > 0 && e.block === 'd') note = 'Transition-metal ions lose their outer s electrons before d.';
        else if (q > 0) note = 'Cations lose electrons from the outermost shell.';
        else if (q < 0) note = 'Anions add electrons to the next free orbital.';
        else note = 'Aufbau, Pauli and Hund give the configuration directly.';
        ro.set('note', note);
      }

      function drawArrow(c, x, y, h, up, col) {
        c.strokeStyle = col; c.fillStyle = col; c.lineWidth = 1.8;
        const y1 = up ? y + h / 2 : y - h / 2, y2 = up ? y - h / 2 : y + h / 2;
        c.beginPath(); c.moveTo(x, y1); c.lineTo(x, y2); c.stroke();
        const d = up ? 1 : -1;
        c.beginPath(); c.moveTo(x, y2 - d * 0.5); c.lineTo(x - 3.5, y2 + d * 5); c.lineTo(x + 3.5, y2 + d * 5); c.closePath(); c.fill();
      }
      function lewis(c, C, x, y, sym, dots, q, bracket) {
        kit.label(c, sym, x, y, { size: 30, weight: 700, align: 'center' });
        const w = 11 + 9 * sym.length, h = 22;
        const sides = [[0, -h, 1, 0], [w, 0, 0, 1], [0, h, 1, 0], [-w, 0, 0, 1]];     // offset, then the direction dots of a pair spread
        for (let i = 0; i < 4; i++) {
          const n = dots >= i + 5 ? 2 : dots >= i + 1 ? 1 : 0;
          if (sym === 'He' && i === 0) { for (const k of [-1, 1]) kit.dot(c, x + k * 5, y - h, 2.6, C.accent); continue; }
          if (sym === 'He') continue;
          const [ox, oy, dx, dy] = sides[i];
          if (n === 1) kit.dot(c, x + ox, y + oy, 2.6, C.accent);
          if (n === 2) for (const k of [-1, 1]) kit.dot(c, x + ox + k * 5 * dx, y + oy + k * 5 * dy, 2.6, C.accent);
        }
        if (bracket) {
          c.strokeStyle = C.muted; c.lineWidth = 1.5;
          const bx = w + 12, by = h + 8;
          c.beginPath(); c.moveTo(x - bx + 5, y - by); c.lineTo(x - bx, y - by); c.lineTo(x - bx, y + by); c.lineTo(x - bx + 5, y + by); c.stroke();
          c.beginPath(); c.moveTo(x + bx - 5, y - by); c.lineTo(x + bx, y - by); c.lineTo(x + bx, y + by); c.lineTo(x + bx - 5, y + by); c.stroke();
        }
        if (q) kit.label(c, (Math.abs(q) > 1 ? Math.abs(q) : '') + (q > 0 ? '+' : '−'), x + w + (bracket ? 20 : 8), y - h - 2, { size: 15, weight: 700, color: C.warn });
      }

      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const z = Math.round(V.z), e = chem.el(z);
        if (anim && dt) {
          anim.t += dt;
          if (anim.phase === 0 && anim.t > (z > 36 ? 0.08 : 0.3)) { anim.t = 0; anim.k++; if (anim.k >= z) { anim.k = z; anim.phase = 1; } }
          else if (anim.phase === 1 && anim.t > 1.4) {
            anim.t = 0;
            const pred = aufbauOcc(z), real = parseFull(chem.fullConfig(z));
            anim.phase = Object.keys(pred).some(s => pred[s] !== real[s]) ? 2 : 3;
          } else if (anim.phase === 2 && anim.t > 2.5) anim = null;
          else if (anim && anim.phase === 3) anim = null;
        }
        const S = state();
        const o = S.occ;
        // rows: every subshell up to the last occupied one, plus the next
        let last = 0;
        ORDER.forEach((s, i) => { if ((o[s] || 0) > 0) last = i; });
        const rows = ORDER.slice(0, Math.min(ORDER.length, last + 2));
        const left = 12, right = W * 0.56, top = 30, bottom = H - 16;
        const rh = Math.min(30, (bottom - top) / rows.length);
        const bs = clamp(rh - 5, 10, 22);
        let nmaxOuter = 0;
        for (const s in o) if (o[s] > 0) nmaxOuter = Math.max(nmaxOuter, +s[0]);
        kit.label(c, 'energy ↑ (filling order)', left, 14, { size: 11, color: C.muted });
        rows.forEach((s, i) => {
          const y = bottom - (i + 0.5) * rh;
          const l = LNUM[s[1]], m = 2 * l + 1, k = o[s] || 0;
          const x0 = left + 34;
          kit.label(c, s, left + 24, y, { size: Math.min(13, rh * 0.55), align: 'right', color: k ? C.text : C.faint, weight: 600 });
          const bw = Math.min(bs * 1.2, (right - x0) / 7.4);
          const outer = +s[0] === nmaxOuter || (e.block === 'd' && s[1] === 'd' && +s[0] === nmaxOuter - 1) || (e.block === 'f' && s[1] === 'f');
          for (let j = 0; j < m; j++) {
            const bx = x0 + j * bw;
            c.fillStyle = kit.hue(BLOCK_HUE[s[1]], k ? 0.16 : 0.05); c.fillRect(bx, y - bs / 2, bw - 2, bs);
            c.strokeStyle = k ? C.muted : C.faint; c.lineWidth = 1; c.strokeRect(bx, y - bs / 2, bw - 2, bs);
            const up = j < Math.min(k, m), dn = j < k - m;
            const col = outer ? C.accent : C.text2;
            if (up) drawArrow(c, bx + (bw - 2) * (dn ? 0.32 : 0.5), y, bs * 0.72, true, col);
            if (dn) drawArrow(c, bx + (bw - 2) * 0.68, y, bs * 0.72, false, col);
          }
        });
        // message during the animation
        if (anim) {
          const msg = anim.phase === 0 ? 'adding electron ' + anim.k + ' of ' + z : anim.phase === 1 ? 'the simple filling order gives this…' : '…but the real atom rearranges: ' + cfgPretty(chem.config(z));
          kit.label(c, msg, right - 4, 14, { size: 12, align: 'right', color: anim.phase === 2 ? C.warn : C.accent, weight: 600 });
        }
        // the mini periodic table
        const px0 = W * 0.6, pw = W - px0 - 10, cs = Math.min(pw / 18, (H * 0.55) / 10.2);
        const py0 = 18;
        cells = [];
        for (const el of chem.elements) {
          const pos = cellOf(el);
          const x = px0 + (pos.col - 1) * cs, y = py0 + (pos.row - 1) * cs;
          cells.push({ z: el.z, x, y, s: cs });
          const on = el.z === z;
          c.fillStyle = on ? C.accent : kit.hue(BLOCK_HUE[el.block] || 0, el.z <= z ? 0.55 : 0.2);
          c.fillRect(x + 0.5, y + 0.5, cs - 1, cs - 1);
          if (cs >= 15) kit.label(c, el.sym, x + cs / 2, y + cs / 2 + 0.5, { size: Math.min(10, cs * 0.5), align: 'center', color: on ? '#fff' : C.text });
        }
        kit.label(c, 's', px0 + cs, py0 - 8, { size: 10, align: 'center', color: C.muted });
        kit.label(c, 'd', px0 + 7.5 * cs, py0 + 2.2 * cs, { size: 10, align: 'center', color: C.muted });
        kit.label(c, 'p', px0 + 15.5 * cs, py0 - 8, { size: 10, align: 'center', color: C.muted });
        kit.label(c, 'f', px0 + 1.5 * cs, py0 + 8.9 * cs, { size: 10, align: 'center', color: C.muted });
        // the element and its Lewis symbol
        const q = clamp(Math.round(V.q), -3, Math.min(3, z));
        const iy = py0 + 10.6 * cs + 16;
        kit.label(c, e.name + (q ? ' ion' : ''), px0 + pw / 2, iy, { size: 15, weight: 650, align: 'center' });
        kit.label(c, occText(S.occ), px0 + pw / 2, iy + 20, { size: 12.5, align: 'center', color: C.text2 });
        const ly = Math.min(H - 40, iy + 70);
        if (e.block === 's' || e.block === 'p') {
          if (q > 0) lewis(c, C, px0 + pw / 2, ly, e.sym, 0, q, false);
          else {
            let nmax = 0; for (const s in S.occ) if (S.occ[s] > 0) nmax = Math.max(nmax, +s[0]);
            const dots = (S.occ[nmax + 's'] || 0) + (S.occ[nmax + 'p'] || 0);
            lewis(c, C, px0 + pw / 2, ly, e.sym, dots, q, q < 0);
          }
          kit.label(c, 'Lewis symbol', px0 + pw / 2, H - 10, { size: 10.5, align: 'center', color: C.faint });
        } else kit.label(c, 'Lewis symbols are used for s- and p-block elements', px0 + pw / 2, ly, { size: 11, align: 'center', color: C.faint });
      }
      kit.click(st, p => {
        const hit = cells.find(k => p.x >= k.x && p.x < k.x + k.s && p.y >= k.y && p.y < k.y + k.s);
        if (hit) { anim = null; ctl.set('z', hit.z); ctl.set('q', 0); describe(); loop.once(); }
      }, p => cells.some(k => p.x >= k.x && p.x < k.x + k.s && p.y >= k.y && p.y < k.y + k.s));
      describe();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Slater's rules (used by 5 and 6) */
  function slaterGroups(occ) {
    const g = {};
    for (const s in occ) {
      if (!occ[s]) continue;
      const n = +s[0], l = s[1], kind = (l === 's' || l === 'p') ? 'sp' : l;
      const key = n + kind;
      if (!g[key]) g[key] = { key, n, kind, count: 0, order: n * 10 + (kind === 'sp' ? 0 : kind === 'd' ? 1 : 2), label: kind === 'sp' ? (n === 1 ? '1s' : n + 's,' + n + 'p') : n + kind };
      g[key].count += occ[s];
    }
    return Object.values(g).sort((a, b) => a.order - b.order);
  }
  function slater(groups, key) {
    const G = groups.find(x => x.key === key);
    if (!G) return null;
    let S = 0;
    const parts = [];
    for (const h of groups) {
      let cnt = h.count - (h.key === G.key ? 1 : 0);
      if (cnt <= 0) continue;
      let f;
      if (h.order > G.order) f = 0;
      else if (h.key === G.key) f = G.n === 1 ? 0.30 : 0.35;
      else if (G.kind === 'sp') f = h.n === G.n - 1 ? 0.85 : 1.00;
      else f = 1.00;
      parts.push({ label: h.label, key: h.key, count: cnt, f });
      S += cnt * f;
    }
    return { S, parts, group: G };
  }
  const outerKey = groups => { const sp = groups.filter(g => g.kind === 'sp'); return (sp.length ? sp[sp.length - 1] : groups[groups.length - 1]).key; };
  const zeffMemo = {};
  function zeffOuter(chem, z) {
    if (z in zeffMemo) return zeffMemo[z];
    const groups = slaterGroups(parseFull(chem.fullConfig(z)));
    const r = slater(groups, outerKey(groups));
    return (zeffMemo[z] = r ? z - r.S : null);
  }

  /* ================================================================ 5. periodic trends */
  const PROPS = {
    ie: { label: 'First ionisation energy', unit: 'kJ/mol', get: e => (e.ie ? e.ie * 96.485 : null), dp: 0 },
    en: { label: 'Electronegativity (Pauling)', unit: '', get: e => e.en, dp: 2 },
    r: { label: 'Covalent radius', unit: 'pm', get: e => e.r, dp: 0 },
    zeff: { label: 'Z_eff on the outermost electron (Slater)', unit: '', get: null, dp: 2 }
  };
  Hyper.sim('atom-trends', {
    title: 'Periodic trends: a property against atomic number',
    blurb: `Every element up to the chosen atomic number, with the periods shaded. Click a point to read the element and the reason for its value. The saw-tooth repeats with every period — that repetition is what "periodic" means.

- **Ionisation energy**: peaks at every noble gas, plunges at every alkali metal. Find the small dips at B, O, Al and S.
- **Covalent radius**: the mirror image. Look at how little the radius changes across the transition metals, and at Zr and Hf.
- **Electronegativity**: fluorine tops the chart; the noble gases have no Pauling value.
- **Z_eff (Slater)**: rises by 0.65 per element across a period and drops back at each new shell — the cause behind the other three.`,
    mount(box, kit, params) {
      const chem = kit.chem;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const p0 = params && PROPS[params.prop] ? params.prop : 'ie';
      const ctl = kit.controls(box.side, [
        { id: 'prop', type: 'select', label: 'Property', options: Object.keys(PROPS).map(k => [PROPS[k].label + (PROPS[k].unit ? ' (' + PROPS[k].unit + ')' : ''), k]), value: p0 },
        { id: 'zmax', type: 'select', label: 'Elements', options: [['Z = 1–20', 20], ['Z = 1–36', 36], ['Z = 1–56', 56], ['Z = 1–86', 86], ['Z = 1–103', 103]], value: 56 },
        { id: 'hl', type: 'select', label: 'Highlight', options: [['nothing', 'none'], ['group 1: alkali metals', 'g1'], ['group 2', 'g2'], ['group 17: halogens', 'g17'], ['group 18: noble gases', 'g18'], ['period 2', 'p2'], ['period 3', 'p3']], value: 'none' },
        { id: 'block', type: 'check', label: 'Colour by block', value: true }
      ], () => { describe(); loop.once(); });
      const ro = kit.readout(box.side, [['sel', 'Element'], ['val', 'Value'], ['pos', 'Period, group'], ['prev', 'Change from Z − 1'], ['why', 'Why']]);
      const V = ctl.values;
      let sel = p0 === 'en' ? 9 : p0 === 'r' ? 55 : 11, pts = [];
      const val = (k, e) => (k === 'zeff' ? zeffOuter(chem, e.z) : PROPS[k].get(e));
      const fmtV = (k, v) => (v == null ? 'no value' : v.toFixed(PROPS[k].dp) + (PROPS[k].unit ? ' ' + PROPS[k].unit : ''));

      function why(k, e) {
        const g = e.group, z = e.z;
        if (k === 'ie') {
          if (g === 1 && z > 1) return 'a new shell starts: one electron, far out and well shielded — the lowest in its period';
          if (g === 18) return 'a full shell: the highest in its period';
          if (g === 13 && e.period <= 5) return 'first electron in a p subshell, higher in energy than s: a dip';
          if (g === 16 && e.period <= 5) return 'first paired p electron: pair repulsion makes it easier to remove, a dip';
          if (e.block === 'd' || e.block === 'f') return 'new electrons go into an inner subshell, so the outer ones barely change';
          return 'Z_eff rises across the period and the atom shrinks, so the electron is held harder';
        }
        if (k === 'r') {
          if (z === 72) return 'lanthanide contraction: the 4f electrons shield poorly, so hafnium is no bigger than zirconium';
          if (z === 31) return 'd-block contraction: gallium is hardly larger than aluminium';
          if (g === 18) return 'noble-gas covalent radii are estimates: these atoms rarely bond';
          if (g === 1) return 'a new shell: the largest atom of its period';
          if (e.block === 'd' || e.block === 'f') return 'electrons enter an inner subshell: the size hardly changes across the series';
          return 'same shell, rising Z_eff: the atom shrinks across the period';
        }
        if (k === 'en') {
          if (e.en == null) return 'noble gases (except Kr and Xe) form no bonds, so there is no value';
          if (z === 9) return 'the most electronegative element: small, with a high Z_eff';
          if (g === 1) return 'lowest in its period: one electron, far from the nucleus';
          return 'rises across a period with Z_eff, falls down a group as atoms grow';
        }
        if (g === 1 && z > 1) return 'a new shell: the inner shell shields 0.85–1.00 per electron, so Z_eff drops back';
        if (e.block === 'd') return 'a 3d/4d electron shields the outer s electron by 0.85: Z_eff on the s electron creeps up slowly';
        return 'each step adds a proton but only 0.35 of shielding: Z_eff rises by about 0.65';
      }
      function describe() {
        const k = V.prop, e = chem.el(sel);
        if (!e) return;
        const v = val(k, e);
        ro.set('sel', e.name + ' (' + e.sym + '), Z = ' + e.z);
        ro.set('val', fmtV(k, v));
        ro.set('pos', e.block === 'f' ? 'period ' + e.period + ', f-block' : 'period ' + e.period + ', group ' + e.group);
        const pe = chem.el(sel - 1), pv = pe ? val(k, pe) : null;
        ro.set('prev', v != null && pv != null ? (v - pv >= 0 ? '+' : '−') + Math.abs(v - pv).toFixed(PROPS[k].dp) + ' from ' + pe.sym : '—');
        ro.set('why', why(k, e));
      }
      function geo() { return { x0: 52, x1: st.W - 14, y0: 26, y1: st.H - 34 }; }
      kit.click(st, p => {
        let best = null, bd = 14;
        for (const q of pts) { const d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; best = q; } }
        if (best) { sel = best.z; describe(); loop.once(); }
      }, p => pts.some(q => Math.hypot(q.x - p.x, q.y - p.y) < 10));

      function frame() {
        const C = kit.colors();
        const c = st.begin();
        const g = geo(), k = V.prop, zmax = +V.zmax || 56;
        if (sel > zmax) { sel = zmax; describe(); }
        const vals = [];
        for (let z = 1; z <= zmax; z++) { const e = chem.el(z); vals.push({ e, v: val(k, e) }); }
        const vmax = Math.max(1e-9, ...vals.map(q => q.v || 0)) * 1.1;
        const X = z => g.x0 + (z - 0.5) / zmax * (g.x1 - g.x0);
        const Y = v => g.y1 - (v / vmax) * (g.y1 - g.y0);
        // periods
        const ends = [0, 2, 10, 18, 36, 54, 86, 118];
        for (let pI = 1; pI < ends.length && ends[pI - 1] < zmax; pI++) {
          const a = X(ends[pI - 1] + 0.5), b = X(Math.min(ends[pI], zmax) + 0.5);
          if (pI % 2 === 0) { c.fillStyle = C.surface; c.fillRect(a, g.y0, b - a, g.y1 - g.y0); }
          kit.label(c, 'period ' + pI, (a + b) / 2, g.y0 - 10, { size: 10.5, align: 'center', color: C.muted });
        }
        // axes
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(g.x0, g.y0); c.lineTo(g.x0, g.y1); c.lineTo(g.x1, g.y1); c.stroke();
        const step = Hyper.niceStep ? Hyper.niceStep(vmax, 5) : vmax / 5;
        for (let v = 0; v <= vmax + 1e-9; v += step) {
          const y = Y(v);
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(g.x0, y); c.lineTo(g.x1, y); c.stroke();
          kit.label(c, String(+v.toFixed(2)), g.x0 - 6, y, { size: 10, align: 'right', color: C.muted });
        }
        const zs = zmax <= 20 ? 2 : zmax <= 56 ? 5 : 10;
        for (let z = zs; z <= zmax; z += zs) kit.label(c, String(z), X(z), g.y1 + 11, { size: 10, align: 'center', color: C.muted });
        kit.label(c, 'atomic number Z', (g.x0 + g.x1) / 2, g.y1 + 25, { size: 11, align: 'center', color: C.muted });
        kit.label(c, PROPS[k].label + (PROPS[k].unit ? ' (' + PROPS[k].unit + ')' : ''), g.x0 + 6, g.y0 + 10, { size: 12, weight: 600 });
        // line, broken where there is no value
        c.strokeStyle = C.faint; c.lineWidth = 1.2; c.beginPath();
        let pen = false;
        vals.forEach(q => { if (q.v == null) { pen = false; return; } const x = X(q.e.z), y = Y(q.v); pen ? c.lineTo(x, y) : c.moveTo(x, y); pen = true; });
        c.stroke();
        pts = [];
        const hl = V.hl;
        const isHl = e => (hl === 'g1' && e.group === 1 && e.z > 1) || (hl === 'g2' && e.group === 2) || (hl === 'g17' && e.group === 17) || (hl === 'g18' && e.group === 18) || (hl === 'p2' && e.period === 2) || (hl === 'p3' && e.period === 3);
        for (const q of vals) {
          if (q.v == null) continue;
          const x = X(q.e.z), y = Y(q.v);
          pts.push({ x, y, z: q.e.z });
          const h = isHl(q.e);
          const col = V.block ? kit.hue(BLOCK_HUE[q.e.block] || 0) : C.accent;
          kit.dot(c, x, y, h ? 5 : zmax > 60 ? 2.4 : 3.2, h ? C.warn : col);
          if (h) kit.label(c, q.e.sym, x, y - 11, { size: 10.5, align: 'center', color: C.warn, weight: 600 });
        }
        const se = chem.el(sel), sv = se ? val(k, se) : null;
        if (se && sv != null) {
          const x = X(sel), y = Y(sv);
          c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.arc(x, y, 8, 0, Math.PI * 2); c.stroke();
          kit.label(c, se.sym + ': ' + fmtV(k, sv), x + (x > (g.x0 + g.x1) / 2 ? -12 : 12), y - 16, { size: 12, weight: 650, align: x > (g.x0 + g.x1) / 2 ? 'right' : 'left', bg: C.bg2 });
        }
        if (V.block) {
          let lx = g.x1 - 150;
          for (const b of ['s', 'p', 'd', 'f']) { kit.dot(c, lx, g.y0 + 10, 4, kit.hue(BLOCK_HUE[b])); kit.label(c, b, lx + 7, g.y0 + 10, { size: 11, color: C.muted }); lx += 34; }
        }
      }
      describe();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 6. effective nuclear charge */
  const FCOL = f => (f >= 1 ? 'bad' : f >= 0.8 ? 'warn' : f > 0 ? 'ok' : 'faint');
  Hyper.sim('atom-zeff', {
    title: 'Shielding and Slater\'s rules',
    blurb: `Pick an element and an electron. The other electrons are coloured by how much of the nucleus they hide from it: red ones (inner shells) about a whole proton each, orange ones (the shell just inside) 0.85, green ones (the same group) 0.35, grey ones (farther out) nothing. The bar shows what is left: $Z_\\text{eff} = Z - S$. Click a ring to choose an electron in that group.

- Step across period 2 from Li to Ne and watch Z_eff on the outer electron climb by 0.65 each time.
- Compare Na, K and Rb: the outer electron feels about the same +2.2, but it is farther out each time.
- Iron (26): compare the outermost electron (4s) with a 3d electron — the reason ions lose 4s first.
- A 1s electron sees almost the whole nucleus.`,
    mount(box, kit, params) {
      const chem = kit.chem;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 300 });
      const z0 = params && params.z != null ? clamp(Math.round(+params.z), 1, 86) : 11;
      const ctl = kit.controls(box.side, [
        { id: 'z', label: 'Atomic number Z', min: 1, max: 86, step: 1, value: z0 },
        { id: 'which', type: 'select', label: 'Electron', options: [['outermost electron', 'out'], ['an electron in the highest d subshell', 'd'], ['a 1s electron', '1s']], value: 'out' },
        { type: 'buttons', items: [{ id: 'prev', label: '◀ previous' }, { id: 'next', label: 'next ▶' }] }
      ], id => {
        if (id === 'prev') ctl.set('z', Math.max(1, Math.round(V.z) - 1));
        if (id === 'next') ctl.set('z', Math.min(86, Math.round(V.z) + 1));
        chosen = null;
        describe(); loop.once();
      });
      const ro = kit.readout(box.side, [['el', 'Element'], ['e', 'Electron'], ['S', 'Shielding S'], ['zeff', 'Z_eff = Z − S'], ['felt', 'Felt as']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'atomic number Z' }, y: { label: 'Z_eff on the outermost electron', min: 0 } }, 150);
      const V = ctl.values;
      let chosen = null, groups = [], res = null, rings = [];
      const curve = [];
      for (let z = 1; z <= 86; z++) curve.push([z, zeffOuter(chem, z)]);

      function pickKey() {
        if (chosen && groups.some(g => g.key === chosen)) return chosen;
        if (V.which === '1s') return '1sp';
        if (V.which === 'd') { const d = groups.filter(g => g.kind === 'd'); if (d.length) return d[d.length - 1].key; }
        return outerKey(groups);
      }
      function describe() {
        const z = Math.round(V.z), e = chem.el(z);
        groups = slaterGroups(parseFull(chem.fullConfig(z)));
        const key = pickKey();
        res = slater(groups, key);
        if (!res) return;
        const zeff = z - res.S;
        ro.set('el', e.name + ' (' + e.sym + '), ' + cfgPretty(chem.config(z)));
        ro.set('e', 'one electron in (' + res.group.label + ')' + (V.which === 'd' && res.group.kind !== 'd' && key !== chosen ? ' — no d electrons, so the outermost' : ''));
        const terms = res.parts.filter(p => p.f > 0).map(p => p.count + ' × ' + p.f.toFixed(2));
        ro.set('S', terms.length ? terms.join(' + ') + ' = ' + res.S.toFixed(2) : 'no other electrons shield it: 0');
        ro.set('zeff', z + ' − ' + res.S.toFixed(2) + ' = ' + zeff.toFixed(2));
        ro.set('felt', 'a charge of +' + zeff.toFixed(2) + ' instead of +' + z + ' (' + Math.round(100 * zeff / z) + ' %)');
        plot.set({ series: [{ pts: curve, label: 'outermost electron' }], marks: [{ x: z, y: zeffOuter(chem, z), label: e.sym }], x: { label: 'atomic number Z', min: 1, max: 86 }, y: { label: 'Z_eff on the outermost electron (Slater)', min: 0 } });
      }
      kit.click(st, p => {
        const hit = rings.find(r => Math.abs(Math.hypot(p.x - r.cx, p.y - r.cy) - r.r) < 9);
        if (hit) { chosen = hit.key; describe(); loop.once(); }
      }, p => rings.some(r => Math.abs(Math.hypot(p.x - r.cx, p.y - r.cy) - r.r) < 9));

      function frame(dt, t) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        if (!res) return;
        const z = Math.round(V.z), e = chem.el(z);
        const cx = W * 0.3, cy = H * 0.5, Rmax = Math.min(W * 0.28, H * 0.45);
        const fOf = key => { if (key === res.group.key) return null; const p = res.parts.find(q => q.key === key); return p ? p.f : 0; };
        // nucleus
        kit.dot(c, cx, cy, 11, kit.colors().dark ? '#e0584d' : '#d04438');
        kit.label(c, '+' + z, cx, cy, { size: 10, align: 'center', color: '#fff', weight: 700 });
        rings = [];
        groups.forEach((g, i) => {
          const r = 22 + (i + 1) * (Rmax - 22) / groups.length;
          rings.push({ cx, cy, r, key: g.key });
          const mine = g.key === res.group.key;
          c.strokeStyle = mine ? C.accent : C.faint; c.lineWidth = mine ? 2 : 1;
          c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.stroke();
          const f = fOf(g.key);
          for (let j = 0; j < g.count; j++) {
            const a = j * 2 * Math.PI / g.count + i * 0.7 + (t || 0) * 0.15;
            const x = cx + r * Math.cos(a), y = cy + r * Math.sin(a);
            if (mine && j === 0) { kit.dot(c, x, y, 6, C.accent, C.text); continue; }
            const col = mine ? C.ok : C[FCOL(f)];
            kit.dot(c, x, y, 3.3, col);
          }
          kit.label(c, g.label, cx + r * 0.71 + 3, cy - r * 0.71 - 3, { size: 10.5, color: mine ? C.accent : C.muted });
        });
        // the bars
        const bx = W * 0.62, bw = W - bx - 16, by = 46, bh = 22;
        const sc = bw / Math.max(z, 1);
        kit.label(c, 'nuclear charge Z = ' + z, bx, by - 12, { size: 12, color: C.text2 });
        c.fillStyle = kit.colors().dark ? '#e0584d' : '#d04438'; c.fillRect(bx, by, z * sc, bh);
        let x = bx;
        const y2 = by + bh + 34;
        kit.label(c, 'shielding S = ' + res.S.toFixed(2), bx, y2 - 12, { size: 12, color: C.text2 });
        for (const f of [1, 0.85, 0.35, 0.30]) {
          const amt = res.parts.filter(p => Math.abs(p.f - f) < 1e-9).reduce((s, p) => s + p.count * p.f, 0);
          if (!amt) continue;
          c.fillStyle = C[FCOL(f)]; c.fillRect(x, y2, amt * sc, bh);
          if (amt * sc > 30) kit.label(c, amt.toFixed(2), x + amt * sc / 2, y2 + bh / 2, { size: 10.5, align: 'center', color: '#fff', weight: 600 });
          x += amt * sc;
        }
        const zeff = z - res.S;
        c.fillStyle = C.accent; c.fillRect(x, y2, Math.max(0, zeff * sc), bh);
        kit.label(c, 'Z_eff = ' + zeff.toFixed(2), bx + bw, y2 + bh + 16, { size: 15, weight: 700, align: 'right', color: C.accent });
        // legend
        const leg = [['bad', '1.00 (deeper shells)'], ['warn', '0.85 (shell n − 1)'], ['ok', '0.35 (same group)'], ['faint', '0 (farther out)']];
        leg.forEach(([k, txt], i) => { kit.dot(c, bx + 6, y2 + bh + 44 + i * 18, 4, C[k]); kit.label(c, txt, bx + 16, y2 + bh + 44 + i * 18, { size: 11, color: C.muted }); });
        kit.label(c, e.name + ': ' + cfgPretty(chem.config(z)), 14, 18, { size: 13, weight: 600 });
        kit.label(c, 'click a ring to pick an electron there', 14, H - 12, { size: 11, color: C.faint });
      }
      describe();
      const loop = kit.loop((dt, t) => frame(dt, t), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 7. radioactive decay */
  const ISOS = [
    { name: 'Demonstration nuclide (t½ = 1 min)', th: 60, unit: ['s', 1], p: null, d: null, mode: '' },
    { name: 'Iodine-131 → xenon-131 (β⁻)', th: 8.02 * DAY, unit: ['days', DAY], p: 'I', d: 'Xe', mode: 'β⁻' },
    { name: 'Fluorine-18 → oxygen-18 (β⁺)', th: 109.8 * MIN, unit: ['min', MIN], p: 'F', d: 'O', mode: 'β⁺' },
    { name: 'Radon-222 → polonium-218 (α)', th: 3.8235 * DAY, unit: ['days', DAY], p: 'Rn', d: 'Po', mode: 'α' },
    { name: 'Cobalt-60 → nickel-60 (β⁻)', th: 5.27 * YR, unit: ['years', YR], p: 'Co', d: 'Ni', mode: 'β⁻' },
    { name: 'Carbon-14 → nitrogen-14 (β⁻)', th: 5730 * YR, unit: ['years', YR], p: 'C', d: 'N', mode: 'β⁻' }
  ];
  Hyper.sim('atom-decay', {
    title: 'Radioactive decay: random nuclei, exponential law',
    blurb: `Every square is one nucleus. In each instant each one has the same small chance of decaying — no nucleus knows how old it is. Yet the number left falls along the smooth curve $N = N_0\\,(1/2)^{t/t_{1/2}}$, and the time for half of them to go is the same whenever you start counting.

- Run it with 100 nuclei, then with 2500: the fewer there are, the more the count wanders from the curve.
- Read the measured half-life from the table and compare it with the true one.
- Watch the activity (decays per unit time) fall in step with the number left: A = λN.
- Change the isotope: the curve is the same shape, only the time axis changes — from minutes to thousands of years.`,
    mount(box, kit, params) {
      const chem = kit.chem;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 260 });
      const i0 = params && params.iso != null ? clamp(Math.round(+params.iso), 0, ISOS.length - 1) : 1;
      const ctl = kit.controls(box.side, [
        { id: 'iso', type: 'select', label: 'Nuclide', options: ISOS.map((s, i) => [s.name, i]), value: i0 },
        { id: 'n0', label: 'Nuclei at the start', min: 100, max: 2500, step: 100, value: 600 },
        { id: 'speed', label: 'Half-lives per 10 s', min: 0.2, max: 4, step: 0.1, value: 1 },
        { id: 'curve', type: 'check', label: 'Show the exponential law', value: true },
        { type: 'buttons', items: [{ id: 'run', label: 'Start / pause', primary: true }, { id: 'reset', label: 'Reset' }] }
      ], id => {
        if (id === 'run') running = !running;
        else if (id === 'reset' || id === 'iso' || id === 'n0') reset();
        replot(); loop.once();
      });
      const ro = kit.readout(box.side, [['t', 'Time'], ['nh', 'Half-lives elapsed'], ['N', 'Nuclei left'], ['exp', 'Expected by N₀(½)^(t/t½)'], ['th', 'Measured half-life'], ['A', 'Activity now']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'time' }, y: { label: 'nuclei left', min: 0 } }, 170);
      const V = ctl.values;
      let nuc = [], tau = 0, running = false, hist = [], half = null, recent = [], sinceplot = 0;

      function reset() {
        const n = Math.round(V.n0);
        nuc = new Array(n).fill(0).map(() => ({ gone: false, at: -1 }));
        tau = 0; hist = [[0, n]]; half = null; recent = []; running = false;
      }
      const iso = () => ISOS[+V.iso] || ISOS[0];
      function replot() {
        const I = iso(), n0 = nuc.length, u = I.unit[1] / 1, k = I.th / u;
        const theory = [];
        const tmax = Math.max(4, Math.ceil(tau + 0.5));
        for (let x = 0; x <= tmax; x += 0.05) theory.push([x * k, n0 * Math.pow(0.5, x)]);
        const vl = [];
        for (let j = 1; j <= tmax; j++) vl.push({ x: j * k, label: j === 1 ? 't½' : j + 't½' });
        plot.set({
          x: { label: 'time (' + I.unit[0] + ')', min: 0, max: tmax * k },
          y: { label: 'nuclei left', min: 0, max: n0 * 1.05 },
          series: [{ pts: hist.map(h => [h[0] * k, h[1]]), label: 'counted' }].concat(V.curve ? [{ pts: theory, label: 'N₀(½)^(t/t½)', dash: [6, 4] }] : []),
          vlines: vl, hlines: [{ y: n0 / 2, label: 'N₀/2' }],
          marks: half != null ? [{ x: half * k, y: n0 / 2, label: 'half gone' }] : []
        });
      }
      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, I = iso();
        const n0 = nuc.length;
        if (running && dt) {
          const d = V.speed / 10 * dt;
          const p = 1 - Math.pow(2, -d);
          tau += d;
          let k = 0;
          for (const q of nuc) if (!q.gone && Math.random() < p) { q.gone = true; q.at = tau; k++; }
          recent.push([tau, k]);
          const left = nuc.reduce((s, q) => s + (q.gone ? 0 : 1), 0);
          if (tau - hist[hist.length - 1][0] >= 0.01 || !left) hist.push([tau, left]);
          if (half == null && left <= n0 / 2) half = tau;
          if (!left || tau > 12) running = false;
          sinceplot += dt;
          if (sinceplot > 0.12 || !running) { sinceplot = 0; replot(); }
        }
        recent = recent.filter(r => r[0] > tau - 0.1);
        const left = nuc.reduce((s, q) => s + (q.gone ? 0 : 1), 0);
        // the grid of nuclei
        const cols = Math.ceil(Math.sqrt(n0 * (W - 20) / Math.max(40, H - 50)));
        const rows = Math.ceil(n0 / Math.max(cols, 1));
        const cs = Math.max(2, Math.min((W - 20) / cols, (H - 50) / Math.max(rows, 1)));
        const gx = (W - cols * cs) / 2, gy = 38;
        const pcol = I.p ? chem.el(I.p).color : C.series[1], dcol = I.d ? chem.el(I.d).color : C.faint;
        nuc.forEach((q, i) => {
          const x = gx + (i % cols) * cs, y = gy + Math.floor(i / cols) * cs;
          const fresh = q.gone && tau - q.at < 0.05;
          c.fillStyle = fresh ? C.warn : q.gone ? dcol : pcol;
          c.globalAlpha = q.gone && !fresh ? 0.35 : 1;
          c.fillRect(x + 0.5, y + 0.5, cs - 1, cs - 1);
        });
        c.globalAlpha = 1;
        kit.label(c, I.p ? I.name.split(' (')[0] : 'parent → daughter', 12, 16, { size: 13, weight: 600 });
        kit.label(c, left + ' of ' + n0 + ' left', W - 12, 16, { size: 13, weight: 600, align: 'right', color: C.accent });
        // readouts
        const u = I.unit[1], tReal = tau * I.th;
        ro.set('t', kit.fmt(tReal / u, 3) + ' ' + I.unit[0]);
        ro.set('nh', tau.toFixed(2));
        ro.set('N', left + ' (' + (n0 ? (100 * left / n0).toFixed(1) : '0') + ' %)');
        ro.set('exp', (n0 * Math.pow(0.5, tau)).toFixed(1));
        ro.set('th', half != null ? kit.fmt(half * I.th / u, 3) + ' ' + I.unit[0] + ' (true ' + kit.fmt(I.th / u, 4) + ')' : 'not yet: wait for N₀/2');
        const dN = recent.reduce((s, r) => s + r[1], 0), span = recent.length > 1 ? tau - recent[0][0] + 1e-12 : 0;
        const lam = Math.LN2 / (I.th / u), per = ' per ' + ({ s: 's', min: 'min', days: 'day', years: 'year' }[I.unit[0]] || I.unit[0]);
        ro.set('A', span > 0.02 ? kit.fmt(dN / (span * I.th / u), 3) + per + ' (λN = ' + kit.fmt(lam * left, 3) + ')' : 'λN = ' + kit.fmt(lam * left, 3) + per);
      }
      reset(); replot();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 8. band of stability */
  const MODE_HUE = { 'b-': 215, 'b+': 0, ec: 0, a: 48, sf: 135 };
  const REACTIONS = {
    fission: { name: '²³⁵U + n → ¹⁴¹Ba + ⁹²Kr + 3n', from: [[92, 235]], to: [[56, 141], [36, 92]], nIn: 1, nOut: 3 },
    fusion: { name: '²H + ³H → ⁴He + n', from: [[1, 2], [1, 3]], to: [[2, 4]], nIn: 0, nOut: 1 }
  };
  Hyper.sim('atom-stability', {
    title: 'The band of stability and the chart of nuclides',
    blurb: `Each square is a nuclide: $Z$ protons across, $N$ neutrons up. Black squares are stable; the others decay — β⁻ (blue) above the band, β⁺ or electron capture (red) below it, α (yellow) for heavy nuclei, fission (green) for the heaviest. Decay modes and half-lives are measured values for the stable nuclides and about 130 well-known radioactive ones; the other squares are nuclides the liquid-drop mass formula predicts will hold together (about 3300 have actually been made), with their decay estimated — beta decay runs along a line of equal $A$ towards its stable member. Click a square, or use the sliders.

- The band starts along N = Z and bends upwards: heavy nuclei need extra neutrons.
- Pick uranium-238 and press **Follow the chain**: 8 α and 6 β⁻ steps lead to lead-206.
- Pick a neutron-rich fission product such as ¹⁴¹Ba and follow it down to the band.
- Switch to **Binding energy per nucleon** to see why both fission and fusion release energy.`,
    mount(box, kit, params) {
      const chem = kit.chem;
      const P = params || {};
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 340 });
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['Chart of nuclides (N against Z)', 'chart'], ['Binding energy per nucleon', 'binding']], value: P.view === 'binding' ? 'binding' : 'chart' },
        { id: 'z', label: 'Protons Z', min: 1, max: 104, step: 1, value: P.z != null ? clamp(+P.z, 1, 104) : 6 },
        { id: 'n', label: 'Neutrons N', min: 0, max: 160, step: 1, value: P.n != null ? clamp(+P.n, 0, 160) : 8 },
        { id: 'arrows', type: 'check', label: 'Show the decay arrow', value: true },
        { id: 'rx', type: 'select', label: 'Reaction', options: [['Fission of uranium-235', 'fission'], ['Fusion of deuterium and tritium', 'fusion']], value: 'fission' },
        { type: 'buttons', items: [{ id: 'decay', label: 'Decay once' }, { id: 'chain', label: 'Follow the chain', primary: true }] }
      ], id => {
        if (id === 'decay') step();
        else if (id === 'chain') chain = { t: 0, steps: 0 };
        else if (id === 'z' || id === 'n') chain = null;
        modeCtl(); describe(); dirty = true;
      });
      const ro = kit.readout(box.side, [['nuc', 'Nuclide'], ['zn', 'Z, N, A'], ['ratio', 'N / Z'], ['stat', 'Status'], ['t', 'Half-life'], ['d', 'Daughter'], ['be', 'Binding energy per nucleon']]);
      const V = ctl.values;
      let dirty = true, chain = null, lastKey = '', cells = null;

      function modeCtl() {
        const b = V.view === 'binding';
        for (const k of ['z', 'n', 'arrows', 'decay', 'chain']) ctl.show(k, !b);
        ctl.show('rx', b);
      }
      const bePer = (Z, N) => { const A = Z + N, r = realBE(Z, A); return r != null ? { v: r / A, real: true } : { v: semf(Z, N) / A, real: false }; };
      function step() {
        const Z = Math.round(V.z), N = Math.round(V.n), nu = nuclide(Z, N);
        if (!nu) return false;
        const d = daughter(Z, N, nu.mode);
        if (!d || d[0] < 1 || d[1] < 0) return false;
        ctl.set('z', d[0]); ctl.set('n', d[1]);
        return true;
      }
      function describe() {
        if (V.view === 'binding') {
          const R = REACTIONS[V.rx] || REACTIONS.fission;
          const mIn = R.from.reduce((s, [z, a]) => s + MASS[z + '-' + a], 0) + R.nIn * M_N;
          const mOut = R.to.reduce((s, [z, a]) => s + MASS[z + '-' + a], 0) + R.nOut * M_N;
          const Q = (mIn - mOut) * UC2;
          const Ain = R.from.reduce((s, [, a]) => s + a, 0) + R.nIn;
          ro.set('nuc', R.name);
          ro.set('zn', 'mass before ' + mIn.toFixed(4) + ' u, after ' + mOut.toFixed(4) + ' u');
          ro.set('ratio', 'mass lost ' + (mIn - mOut).toFixed(5) + ' u');
          ro.set('stat', 'Q = ' + Q.toFixed(1) + ' MeV released');
          ro.set('t', (Q / Ain).toFixed(3) + ' MeV per nucleon taking part');
          ro.set('d', R.to.map(([z, a]) => sup(a) + chem.el(z).sym + ': ' + (realBE(z, a) / a).toFixed(3) + ' MeV').join(', '));
          ro.set('be', R.from.map(([z, a]) => sup(a) + chem.el(z).sym + ': ' + (realBE(z, a) / a).toFixed(3) + ' MeV').join(', ') + ' before');
          return;
        }
        const Z = Math.round(V.z), N = Math.round(V.n), A = Z + N, nu = nuclide(Z, N);
        ro.set('nuc', nucName(chem, Z, A));
        ro.set('zn', 'Z = ' + Z + ', N = ' + N + ', A = ' + A);
        ro.set('ratio', (N / Z).toFixed(3));
        if (!nu) {
          ro.set('stat', 'not bound: it would fall apart at once' + (Z > 2 ? ' (liquid-drop model)' : ''));
          ro.set('t', '—'); ro.set('d', '—');
        } else {
          ro.set('stat', nu.mode === 'stable' ? 'stable' : (Z === 83 && A === 209 ? 'effectively stable: ' : '') + MODE_NAME[nu.mode] + (nu.model ? ' (model estimate)' : ' (measured)'));
          ro.set('t', nu.t ? fmtTime(nu.t) : nu.mode === 'stable' ? 'stable' : 'not tabulated here');
          const d = daughter(Z, N, nu.mode);
          ro.set('d', d && d[0] >= 1 && chem.el(d[0]) ? nucName(chem, d[0], d[0] + d[1]) : '—');
        }
        const b = bePer(Z, N);
        ro.set('be', Number.isFinite(b.v) && b.v > 0 ? b.v.toFixed(3) + ' MeV' + (b.real ? ' (from the measured mass)' : ' (liquid-drop estimate)') : '—');
      }
      function geo() { return { x0: 44, x1: st.W - 12, y0: 16, y1: st.H - 34, zmax: 104, nmax: 160 }; }
      kit.click(st, p => {
        if (V.view !== 'chart') return;
        const g = geo();
        const Z = Math.round((p.x - g.x0) / (g.x1 - g.x0) * (g.zmax + 1) - 0.5), N = Math.round((g.y1 - p.y) / (g.y1 - g.y0) * (g.nmax + 1) - 0.5);
        if (Z >= 1 && Z <= g.zmax && N >= 0 && N <= g.nmax) { chain = null; ctl.set('z', Z); ctl.set('n', N); describe(); dirty = true; }
      }, p => V.view === 'chart' && p.x > geo().x0 && p.y < geo().y1);

      function buildCells() {
        cells = [];
        for (let Z = 1; Z <= 104; Z++) for (let N = 0; N <= 160; N++) { const nu = nuclide(Z, N); if (nu) cells.push([Z, N, nu.mode]); }
      }
      function drawChart(c, C) {
        const g = geo();
        const cw = (g.x1 - g.x0) / (g.zmax + 1), ch = (g.y1 - g.y0) / (g.nmax + 1);
        const X = z => g.x0 + (z + 0.5) * cw, Y = n => g.y1 - (n + 0.5) * ch;
        // magic numbers
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (const m of [8, 20, 28, 50, 82, 126]) {
          if (m <= g.zmax) { c.beginPath(); c.moveTo(X(m), g.y0); c.lineTo(X(m), g.y1); c.stroke(); kit.label(c, String(m), X(m), g.y1 + 10, { size: 9.5, align: 'center', color: C.faint }); }
          c.beginPath(); c.moveTo(g.x0, Y(m)); c.lineTo(g.x1, Y(m)); c.stroke(); kit.label(c, String(m), g.x0 - 4, Y(m), { size: 9.5, align: 'right', color: C.faint });
        }
        // cells, one colour at a time
        if (!cells) buildCells();
        const byMode = {};
        for (const [Z, N, m] of cells) (byMode[m] = byMode[m] || []).push([Z, N]);
        for (const m in byMode) {
          c.fillStyle = m === 'stable' ? C.text : kit.hue(MODE_HUE[m] || 0, 0.8);
          c.beginPath();
          for (const [Z, N] of byMode[m]) c.rect(X(Z) - cw / 2, Y(N) - ch / 2, Math.max(1, cw - 0.4), Math.max(1, ch - 0.2));
          c.fill();
        }
        // N = Z
        c.strokeStyle = C.muted; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(Math.min(g.zmax, g.nmax)), Y(Math.min(g.zmax, g.nmax))); c.stroke(); c.setLineDash([]);
        kit.label(c, 'N = Z', X(62), Y(66), { size: 11, color: C.muted });
        // axes
        c.strokeStyle = C.axis || C.muted; c.beginPath(); c.moveTo(g.x0, g.y0); c.lineTo(g.x0, g.y1); c.lineTo(g.x1, g.y1); c.stroke();
        kit.label(c, 'protons Z →', g.x1, g.y1 + 22, { size: 11, align: 'right', color: C.muted });
        kit.label(c, 'neutrons N ↑', g.x0 + 4, g.y0 + 4, { size: 11, color: C.muted });
        // legend
        const leg = [['stable', C.text], ['β⁻', kit.hue(215)], ['β⁺ / EC', kit.hue(0)], ['α', kit.hue(48)], ['fission', kit.hue(135)]];
        leg.forEach(([t, col], i) => { c.fillStyle = col; c.fillRect(g.x0 + 14, g.y0 + 24 + i * 17, 10, 10); kit.label(c, t, g.x0 + 30, g.y0 + 29 + i * 17, { size: 11, color: C.text2 }); });
        kit.label(c, 'magic numbers: grey lines', g.x0 + 14, g.y0 + 24 + 5 * 17 + 5, { size: 10.5, color: C.faint });
        // the selection
        const Z = Math.round(V.z), N = Math.round(V.n), nu = nuclide(Z, N);
        c.strokeStyle = C.accent; c.lineWidth = 2;
        c.strokeRect(X(Z) - cw / 2 - 3, Y(N) - ch / 2 - 3, cw + 6, ch + 6);
        const e = chem.el(Z);
        if (e) kit.label(c, sup(Z + N) + e.sym, X(Z) + (Z > 70 ? -10 : 10), Y(N) - 12, { size: 13, weight: 700, align: Z > 70 ? 'right' : 'left', color: C.accent, bg: C.bg2 });
        if (V.arrows && nu) {
          const d = daughter(Z, N, nu.mode);
          if (d && d[0] >= 1) kit.arrow(c, X(Z), Y(N), X(d[0]), Y(d[1]), C.warn, 2.2, 8);
        }
      }
      function drawBinding(c, C) {
        const W = st.W, H = st.H;
        const g = { x0: 52, x1: W - 16, y0: 24, y1: H - 36 };
        const X = a => g.x0 + a / 250 * (g.x1 - g.x0), Y = b => g.y1 - b / 9.5 * (g.y1 - g.y0);
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(g.x0, g.y0); c.lineTo(g.x0, g.y1); c.lineTo(g.x1, g.y1); c.stroke();
        for (let b = 0; b <= 9; b++) { c.strokeStyle = C.grid; c.beginPath(); c.moveTo(g.x0, Y(b)); c.lineTo(g.x1, Y(b)); c.stroke(); kit.label(c, String(b), g.x0 - 6, Y(b), { size: 10, align: 'right', color: C.muted }); }
        for (let a = 0; a <= 250; a += 50) kit.label(c, String(a), X(a), g.y1 + 11, { size: 10, align: 'center', color: C.muted });
        kit.label(c, 'mass number A', (g.x0 + g.x1) / 2, g.y1 + 25, { size: 11, align: 'center', color: C.muted });
        kit.label(c, 'binding energy per nucleon (MeV)', g.x0 + 6, g.y0 - 10, { size: 11.5, color: C.text2, weight: 600 });
        // the liquid-drop valley
        c.strokeStyle = C.series[0]; c.lineWidth = 2; c.beginPath();
        let started = false;
        for (let A = 8; A <= 250; A++) {
          let best = -Infinity;
          for (let Z = 1; Z < A; Z++) best = Math.max(best, semf(Z, A - Z) / A);
          const x = X(A), y = Y(best);
          started ? c.lineTo(x, y) : c.moveTo(x, y); started = true;
        }
        c.stroke();
        kit.label(c, 'liquid-drop model, most stable isobar', X(150), Y(8.95), { size: 10.5, color: C.series[0] });
        // measured points
        const R = REACTIONS[V.rx] || REACTIONS.fission;
        const involved = new Set(R.from.concat(R.to).map(([z, a]) => z + '-' + a));
        for (const key in MASS) {
          const [z, a] = key.split('-').map(Number);
          const b = realBE(z, a) / a;
          if (!(b > 0)) continue;
          const on = involved.has(key);
          kit.dot(c, X(a), Y(b), on ? 5.5 : 3.8, on ? C.warn : C.text);
          if (on || [4, 12, 56, 62, 238].includes(a)) kit.label(c, sup(a) + chem.el(z).sym, X(a) + 6, Y(b) + (a === 62 ? -12 : a === 56 ? 12 : -10), { size: 11, color: on ? C.warn : C.text2, weight: on ? 650 : 500 });
        }
        // the reaction: arrows from reactants to products
        for (const [zf, af] of R.from) for (const [zt, at] of R.to) {
          const b1 = realBE(zf, af) / af, b2 = realBE(zt, at) / at;
          kit.arrow(c, X(af), Y(b1), X(at), Y(b2), C.accent, 2, 9);
        }
        kit.label(c, R.name, g.x1 - 4, Y(1.5), { size: 13, weight: 650, align: 'right' });
        kit.label(c, 'products are more tightly bound: energy is released', g.x1 - 4, Y(0.9), { size: 11, align: 'right', color: C.muted });
        kit.label(c, 'iron–nickel peak', X(58), Y(9.25), { size: 10.5, align: 'center', color: C.muted });
      }
      function frame(dt) {
        const C = kit.colors();
        const key = C.theme + '|' + C.bg2 + '|' + st.W + 'x' + st.H;
        if (key !== lastKey) { lastKey = key; dirty = true; }
        if (chain && dt) {
          chain.t += dt;
          if (chain.t > 0.7) {
            chain.t = 0; chain.steps++;
            if (!step() || chain.steps > 40) chain = null;
            describe(); dirty = true;
            const nu = nuclide(Math.round(V.z), Math.round(V.n));
            if (!nu || nu.mode === 'stable') chain = null;
          }
        }
        if (!dirty && dt) return;
        dirty = false;
        const c = st.begin();
        if (V.view === 'binding') drawBinding(c, C); else drawChart(c, C);
      }
      modeCtl(); describe();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => { dirty = true; loop.once(); });
    }
  });
})();
