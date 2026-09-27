/* HYPER-CORE · bio.js
 *
 * Biology for simulations (kit.bio), the tools and tests: sequences and the genetic code, genetics,
 * population and community dynamics, enzyme kinetics, evolution by drift and selection, and the
 * everyday numbers of a biology lab. Nothing here uses the DOM.
 *
 *   B.clean(seq)  B.revComp(dna)  B.transcribe(dna) -> mRNA  B.translate(seq, frame) -> one-letter protein ('*' = stop)
 *   B.gc(seq)  B.tm(primer) (°C; Wallace below 14 nt)  B.orfs(dna, minAA) -> [{ strand, frame, start, end, protein }]
 *   B.mwProtein(aa) (Da, average)  B.mwDNA(dna, double) (g/mol)  B.sites(dna, name|pattern) -> positions  B.ENZYMES
 *   B.CUT (top-strand cut offset in each site)  B.ends(name) -> { site, cut, overhang, type: '5′ overhang' | '3′ overhang' | 'blunt' }
 *   B.CODE (codon -> amino acid)  B.AA (one-letter -> { name, three })
 *   B.punnett(g1, g2) -> { gametes1, gametes2, grid, genotypes: {g: n}, phenotypes: {p: n}, total }   (e.g. 'AaBb' × 'aabb')
 *   B.hardyWeinberg(p) -> { AA, Aa, aa }   B.hwTest(nAA, nAa, naa) -> { p, q, expected, chi2, pValue }
 *   B.chiSquare(observed, expected) -> { chi2, df, p }   B.chiP(chi2, df)
 *   B.haldane(r) / B.kosambi(r) -> map distance in cM
 *   B.exponential(N0, r, t)  B.logistic(N0, r, K, t)  B.growthCurve({ N0, mu, K, lag, t })
 *   B.lotkaVolterra({ x, y, a, b, c, d, T, dt }) -> [[t, prey, predator], …]   B.competition({ x, y, r1, r2, K1, K2, a12, a21, T, dt })
 *   B.mm(S, Vmax, Km, { I, Ki, Kii, type: 'competitive' | 'uncompetitive' | 'noncompetitive' | 'mixed' })   B.hill(S, Vmax, K, n)
 *   B.wrightFisher({ N, p0, gens, s, h, seed }) -> [p per generation]   B.rng(seed) -> () => [0, 1)   B.binomial(n, p, R)  B.poisson(λ, R)
 *   B.pcr(N0, cycles, eff)  B.cfu(colonies, dilution, mL)  B.shannon(counts) -> { H, E }  B.simpson(counts)
 *   B.kleiber(massKg) (W)  B.diffusionTime(x, D, dims)  B.osmoticPressure(i, C, T)  B.gelDistance(bp, a, b)
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};

  /* ---------------------------------------------------------------- sequences and the genetic code */
  const BASES = 'TCAG', AAS = 'FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG';
  const CODE = {};
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) CODE[BASES[i] + BASES[j] + BASES[k]] = AAS[16 * i + 4 * j + k];
  const AA = {
    A: ['alanine', 'Ala', 71.0788], R: ['arginine', 'Arg', 156.1875], N: ['asparagine', 'Asn', 114.1038], D: ['aspartic acid', 'Asp', 115.0886],
    C: ['cysteine', 'Cys', 103.1388], E: ['glutamic acid', 'Glu', 129.1155], Q: ['glutamine', 'Gln', 128.1307], G: ['glycine', 'Gly', 57.0519],
    H: ['histidine', 'His', 137.1411], I: ['isoleucine', 'Ile', 113.1594], L: ['leucine', 'Leu', 113.1594], K: ['lysine', 'Lys', 128.1741],
    M: ['methionine', 'Met', 131.1926], F: ['phenylalanine', 'Phe', 147.1766], P: ['proline', 'Pro', 97.1167], S: ['serine', 'Ser', 87.0782],
    T: ['threonine', 'Thr', 101.1051], W: ['tryptophan', 'Trp', 186.2132], Y: ['tyrosine', 'Tyr', 163.176], V: ['valine', 'Val', 99.1326]
  };
  const clean = s => String(s || '').toUpperCase().replace(/U/g, 'T').replace(/[^ACGTN]/g, '');
  const COMP = { A: 'T', T: 'A', G: 'C', C: 'G', N: 'N' };
  const revComp = s => clean(s).split('').reverse().map(b => COMP[b]).join('');
  const transcribe = s => clean(s).replace(/T/g, 'U');
  function translate(s, frame) {
    s = clean(s).slice(frame || 0);
    let out = '';
    for (let i = 0; i + 3 <= s.length; i += 3) out += CODE[s.slice(i, i + 3)] || 'X';
    return out;
  }
  const gc = s => { s = clean(s); return s.length ? (s.match(/[GC]/g) || []).length / s.length : 0; };
  function tm(s) {
    s = clean(s); const n = s.length, g = (s.match(/[GC]/g) || []).length, a = n - g;
    return n < 14 ? 2 * a + 4 * g : 64.9 + 41 * (g - 16.4) / n;
  }
  function orfs(s, minAA) {
    s = clean(s); minAA = minAA || 30;
    const found = [];
    for (const [strand, seq] of [['+', s], ['−', revComp(s)]]) for (let f = 0; f < 3; f++) {
      const prot = translate(seq, f);
      let start = -1;
      for (let i = 0; i < prot.length; i++) {
        if (start < 0 && prot[i] === 'M') start = i;
        if (start >= 0 && prot[i] === '*') {
          if (i - start >= minAA) found.push({ strand, frame: f + 1, start: f + 3 * start + 1, end: f + 3 * i + 3, protein: prot.slice(start, i) });
          start = -1;
        }
      }
    }
    return found.sort((x, y) => y.protein.length - x.protein.length);
  }
  const mwProtein = p => String(p || '').toUpperCase().split('').reduce((m, c) => m + (AA[c] ? AA[c][2] : 0), 18.01528);
  const NT = { A: 313.21, C: 289.18, G: 329.21, T: 304.2 };
  function mwDNA(s, double) {
    s = clean(s).replace(/N/g, '');
    const one = x => x.split('').reduce((m, c) => m + NT[c], 0) - 61.96;
    return double ? one(s) + one(revComp(s)) : one(s);
  }
  const ENZYMES = { EcoRI: 'GAATTC', BamHI: 'GGATCC', HindIII: 'AAGCTT', NotI: 'GCGGCCGC', XhoI: 'CTCGAG', PstI: 'CTGCAG', SmaI: 'CCCGGG', KpnI: 'GGTACC', SalI: 'GTCGAC', XbaI: 'TCTAGA', NdeI: 'CATATG', SacI: 'GAGCTC' };
  // where each enzyme cuts the top strand, counted from the start of its site (EcoRI G^AATTC -> 1); the sites are palindromes,
  // so the bottom strand is cut at (length − cut) and the ends overhang by (length − 2·cut): positive 5′, negative 3′, zero blunt
  const CUT = { EcoRI: 1, BamHI: 1, HindIII: 1, NotI: 2, XhoI: 1, PstI: 5, SmaI: 3, KpnI: 5, SalI: 1, XbaI: 1, NdeI: 2, SacI: 5 };
  function ends(name) {
    const site = ENZYMES[name], cut = CUT[name];
    if (!site || cut == null) return null;
    const o = site.length - 2 * cut;
    return { site, cut, overhang: Math.abs(o), type: o > 0 ? '5′ overhang' : o < 0 ? '3′ overhang' : 'blunt' };
  }
  function sites(s, enz) {
    s = clean(s); const pat = ENZYMES[enz] || clean(enz), out = [];
    if (!pat) return out;
    for (let i = s.indexOf(pat); i >= 0; i = s.indexOf(pat, i + 1)) out.push(i + 1);
    return out;
  }

  /* ---------------------------------------------------------------- genetics */
  // gametes of a genotype written locus by locus ('AaBb'): independent assortment
  function gametes(g) {
    const loci = g.match(/[A-Za-z]{2}/g) || [];
    let out = [''];
    for (const l of loci) { const next = []; for (const o of out) for (const a of [l[0], l[1]]) next.push(o + a); out = next; }
    return out;
  }
  const sortPair = (a, b) => a === a.toUpperCase() ? a + b : b + a;          // the dominant allele first: Aa, never aA
  function punnett(g1, g2) {
    const ga = gametes(g1), gb = gametes(g2), grid = [], genotypes = {}, phenotypes = {};
    for (const x of ga) {
      const row = [];
      for (const y of gb) {
        let g = '';
        for (let i = 0; i < x.length; i++) g += sortPair(x[i], y[i]);
        row.push(g);
        genotypes[g] = (genotypes[g] || 0) + 1;
        const ph = (g.match(/../g) || []).map(p => /[A-Z]/.test(p) ? p[0].toUpperCase() + '_' : p).join(' ');
        phenotypes[ph] = (phenotypes[ph] || 0) + 1;
      }
      grid.push(row);
    }
    return { gametes1: ga, gametes2: gb, grid, genotypes, phenotypes, total: ga.length * gb.length };
  }
  const hardyWeinberg = p => ({ AA: p * p, Aa: 2 * p * (1 - p), aa: (1 - p) * (1 - p) });
  // regularised upper incomplete gamma Q(a, x), for chi-square p-values
  function gammaQ(a, x) {
    if (x <= 0) return 1;
    const lg = lgamma(a);
    if (x < a + 1) { let sum = 1 / a, term = sum; for (let n = 1; n < 500; n++) { term *= x / (a + n); sum += term; if (Math.abs(term) < 1e-14 * sum) break; } return 1 - sum * Math.exp(-x + a * Math.log(x) - lg); }
    let b = x + 1 - a, c = 1e300, d = 1 / b, h = d;
    for (let i = 1; i < 500; i++) { const an = -i * (i - a); b += 2; d = an * d + b; if (Math.abs(d) < 1e-300) d = 1e-300; c = b + an / c; if (Math.abs(c) < 1e-300) c = 1e-300; d = 1 / d; const del = d * c; h *= del; if (Math.abs(del - 1) < 1e-14) break; }
    return Math.exp(-x + a * Math.log(x) - lg) * h;
  }
  function lgamma(z) {
    const g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - lgamma(1 - z);
    z -= 1; let x = c[0]; for (let i = 1; i < g + 2; i++) x += c[i] / (z + i);
    const t = z + g + 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
  }
  // no degrees of freedom (a single class): nothing can differ, so p = 1 unless χ² is somehow positive
  const chiP = (chi2, df) => df > 0 ? gammaQ(df / 2, chi2 / 2) : chi2 > 0 ? 0 : 1;
  function chiSquare(obs, exp) {
    let chi2 = 0; for (let i = 0; i < obs.length; i++) chi2 += exp[i] > 0 ? Math.pow(obs[i] - exp[i], 2) / exp[i] : 0;
    const df = obs.length - 1;
    return { chi2, df, p: chiP(chi2, df) };
  }
  function hwTest(nAA, nAa, naa) {
    const n = nAA + nAa + naa, p = (2 * nAA + nAa) / (2 * n), q = 1 - p, e = [p * p * n, 2 * p * q * n, q * q * n];
    let chi2 = 0; [nAA, nAa, naa].forEach((o, i) => { chi2 += e[i] > 0 ? (o - e[i]) ** 2 / e[i] : 0; });
    return { p, q, expected: e, chi2, pValue: chiP(chi2, 1) };                 // one degree of freedom (3 classes − 1 − 1 estimated)
  }
  const haldane = r => -50 * Math.log(1 - 2 * r);
  const kosambi = r => 25 * Math.log((1 + 2 * r) / (1 - 2 * r));

  /* ---------------------------------------------------------------- populations and communities */
  const exponential = (N0, r, t) => N0 * Math.exp(r * t);
  const logistic = (N0, r, K, t) => K / (1 + (K - N0) / N0 * Math.exp(-r * t));
  const growthCurve = o => o.t <= (o.lag || 0) ? o.N0 : logistic(o.N0, o.mu, o.K, o.t - (o.lag || 0));
  function rk4(f, y, T, dt) {
    const out = [[0].concat(y)];
    for (let t = 0; t < T - 1e-12;) {
      const h = Math.min(dt, T - t), a = f(y), b = f(y.map((v, i) => v + h / 2 * a[i])), c = f(y.map((v, i) => v + h / 2 * b[i])), d = f(y.map((v, i) => v + h * c[i]));
      y = y.map((v, i) => Math.max(0, v + h / 6 * (a[i] + 2 * b[i] + 2 * c[i] + d[i]))); t += h;
      out.push([t].concat(y));
    }
    return out;
  }
  const lotkaVolterra = o => rk4(([x, y]) => [o.a * x - o.b * x * y, o.c * x * y - o.d * y], [o.x, o.y], o.T, o.dt || 0.01);
  const competition = o => rk4(([x, y]) => [o.r1 * x * (1 - (x + o.a12 * y) / o.K1), o.r2 * y * (1 - (y + o.a21 * x) / o.K2)], [o.x, o.y], o.T, o.dt || 0.01);

  /* ---------------------------------------------------------------- enzymes */
  function mm(S, Vmax, Km, o) {
    o = o || {};
    const I = o.I || 0, a = 1 + I / (o.Ki || Infinity), b = 1 + I / (o.Kii || o.Ki || Infinity);
    switch (o.type) {
      case 'competitive': return Vmax * S / (Km * a + S);
      case 'uncompetitive': return Vmax * S / (Km + S * b);
      case 'noncompetitive': return Vmax * S / ((Km + S) * a);
      case 'mixed': return Vmax * S / (Km * a + S * b);
      default: return Vmax * S / (Km + S);
    }
  }
  const hill = (S, Vmax, K, n) => Vmax * Math.pow(S, n) / (Math.pow(K, n) + Math.pow(S, n));

  /* ---------------------------------------------------------------- evolution */
  function rng(seed) { let a = (seed >>> 0) || 1; return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  // binomial draw: exact below 200 trials, and exact by inversion when few successes (or failures) are expected —
  // a rare allele must keep its true chance of being lost; the normal approximation only when both counts are large
  function binomial(n, p, R) {
    if (p <= 0) return 0; if (p >= 1) return n;
    if (n < 200) { let k = 0; for (let i = 0; i < n; i++) if (R() < p) k++; return k; }
    if (n * Math.min(p, 1 - p) < 30) {
      if (p > 0.5) return n - binomial(n, 1 - p, R);
      const r = p / (1 - p), u = R();
      let f = Math.pow(1 - p, n), cdf = f, k = 0;
      while (u > cdf && k < n) { f *= (n - k) / (k + 1) * r; k++; cdf += f; }
      return k;
    }
    const u = Math.max(1e-12, R()), v = R(), z = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    return Math.max(0, Math.min(n, Math.round(n * p + z * Math.sqrt(n * p * (1 - p)))));
  }
  // Poisson draw (mutations per generation, colonies on a plate, cells in a well): exact below λ = 30, normal above
  function poisson(lambda, R) {
    if (!(lambda > 0)) return 0;
    if (lambda < 30) { const L = Math.exp(-lambda); let k = 0, p = R(); while (p > L) { k++; p *= R(); } return k; }
    const u = Math.max(1e-12, R()), v = R();
    return Math.max(0, Math.round(lambda + Math.sqrt(lambda) * Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)));
  }
  // Wright–Fisher: 2N gene copies; selection on genotype fitnesses 1+s (AA), 1+hs (Aa), 1 (aa)
  function wrightFisher(o) {
    const R = rng(o.seed || 1), N2 = 2 * o.N, s = o.s || 0, h = o.h == null ? 0.5 : o.h, out = [o.p0];
    let p = o.p0;
    for (let g = 0; g < o.gens; g++) {
      const q = 1 - p, wAA = 1 + s, wAa = 1 + h * s, w = p * p * wAA + 2 * p * q * wAa + q * q;
      const pSel = w > 0 ? (p * p * wAA + p * q * wAa) / w : p;
      p = binomial(N2, pSel, R) / N2;
      out.push(p);
    }
    return out;
  }

  /* ---------------------------------------------------------------- lab and ecology numbers */
  const pcr = (N0, cycles, eff) => N0 * Math.pow(1 + (eff == null ? 1 : eff), cycles);
  const cfu = (colonies, dilution, mL) => colonies / (dilution * mL);
  function shannon(counts) {
    const n = counts.reduce((a, b) => a + b, 0), S = counts.filter(c => c > 0).length;
    const Hh = -counts.reduce((h, c) => c > 0 ? h + c / n * Math.log(c / n) : h, 0);
    return { H: Hh, E: S > 1 ? Hh / Math.log(S) : 0, S };
  }
  const simpson = counts => { const n = counts.reduce((a, b) => a + b, 0); return 1 - counts.reduce((s, c) => s + (c / n) * (c / n), 0); };
  const kleiber = m => 3.4 * Math.pow(m, 0.75);
  const diffusionTime = (x, D, dims) => x * x / (2 * (dims || 1) * D);
  const osmoticPressure = (i, C, T) => i * C * 8.314462618 * T;                  // C in mol/m³ -> Pa
  const gelDistance = (bp, a, b) => (a == null ? 9 : a) - (b == null ? 2.2 : b) * Math.log10(bp);   // cm, a typical 1 % agarose calibration

  H.bio = {
    CODE, AA, ENZYMES, CUT, ends, clean, revComp, transcribe, translate, gc, tm, orfs, mwProtein, mwDNA, sites,
    gametes, punnett, hardyWeinberg, hwTest, chiSquare, chiP, lgamma, haldane, kosambi,
    exponential, logistic, growthCurve, rk4, lotkaVolterra, competition, mm, hill,
    rng, binomial, poisson, wrightFisher, pcr, cfu, shannon, simpson, kleiber, diffusionTime, osmoticPressure, gelDistance
  };
})(typeof window !== 'undefined' ? window : globalThis);
