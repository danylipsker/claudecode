/* HYPER-CORE · chem.js
 *
 * Chemistry data and tools, for content, calculators and simulations. No DOM.
 *
 *   Hyper.chem.el('Fe')              -> { z, sym, name, mass, group, period, block, cat, en, ie, r, ox, config, color, radioactive }
 *   Hyper.chem.elements               all 118, by atomic number (elements[0] is hydrogen)
 *   Hyper.chem.parse('Ca(OH)2')       -> { atoms: { Ca: 1, O: 2, H: 2 }, charge: 0 }     also hydrates 'CuSO4·5H2O', ions 'SO4^2-', 'NH4+'
 *   Hyper.chem.molarMass('H2SO4')     -> 98.07 (g/mol)
 *   Hyper.chem.composition('H2O')     -> [{ sym: 'H', n: 2, mass: 2.016, fraction: 0.1119 }, ...]
 *   Hyper.chem.balance('Fe + O2 -> Fe2O3') -> { ok, coefficients: [4, 3, 2], text: '4 Fe + 3 O2 -> 2 Fe2O3', reactants, products }
 *   Hyper.chem.vsepr(4, 0)            -> { name: 'tetrahedral', angle: 109.5, dirs: [[x, y, z], ...] }   bonding pairs, lone pairs
 *   Hyper.chem.molecule('H2O')        -> { atoms: [{ el, x, y, z }], bonds: [[i, j, order]], lone: [...] }  from a small library or VSEPR
 *
 * Masses: IUPAC standard atomic weights (abridged); radioactive elements carry the mass
 * number of their longest-lived isotope. en: Pauling electronegativity; ie: first
 * ionisation energy in eV; r: single-bond covalent radius in pm.
 */
(function (root) {
  'use strict';
  const H = root.Hyper = root.Hyper || {};

  // z | symbol | name | mass | group | period | category | EN | IE (eV) | r (pm) | common oxidation states
  const T = `
1|H|Hydrogen|1.008|1|1|nonmetal|2.20|13.598|31|+1,-1
2|He|Helium|4.0026|18|1|noble||24.587|28|0
3|Li|Lithium|6.94|1|2|alkali|0.98|5.392|128|+1
4|Be|Beryllium|9.0122|2|2|alkaline-earth|1.57|9.323|96|+2
5|B|Boron|10.81|13|2|metalloid|2.04|8.298|84|+3
6|C|Carbon|12.011|14|2|nonmetal|2.55|11.260|76|+4,-4,+2
7|N|Nitrogen|14.007|15|2|nonmetal|3.04|14.534|71|-3,+3,+5
8|O|Oxygen|15.999|16|2|nonmetal|3.44|13.618|66|-2
9|F|Fluorine|18.998|17|2|halogen|3.98|17.423|57|-1
10|Ne|Neon|20.180|18|2|noble||21.565|58|0
11|Na|Sodium|22.990|1|3|alkali|0.93|5.139|166|+1
12|Mg|Magnesium|24.305|2|3|alkaline-earth|1.31|7.646|141|+2
13|Al|Aluminium|26.982|13|3|post-transition|1.61|5.986|121|+3
14|Si|Silicon|28.085|14|3|metalloid|1.90|8.152|111|+4,-4
15|P|Phosphorus|30.974|15|3|nonmetal|2.19|10.487|107|+5,+3,-3
16|S|Sulfur|32.06|16|3|nonmetal|2.58|10.360|105|-2,+4,+6
17|Cl|Chlorine|35.45|17|3|halogen|3.16|12.968|102|-1,+1,+5,+7
18|Ar|Argon|39.95|18|3|noble||15.760|106|0
19|K|Potassium|39.098|1|4|alkali|0.82|4.341|203|+1
20|Ca|Calcium|40.078|2|4|alkaline-earth|1.00|6.113|176|+2
21|Sc|Scandium|44.956|3|4|transition|1.36|6.561|170|+3
22|Ti|Titanium|47.867|4|4|transition|1.54|6.828|160|+4,+3
23|V|Vanadium|50.942|5|4|transition|1.63|6.746|153|+5,+4,+3,+2
24|Cr|Chromium|51.996|6|4|transition|1.66|6.767|139|+3,+6,+2
25|Mn|Manganese|54.938|7|4|transition|1.55|7.434|139|+2,+4,+7
26|Fe|Iron|55.845|8|4|transition|1.83|7.902|132|+2,+3
27|Co|Cobalt|58.933|9|4|transition|1.88|7.881|126|+2,+3
28|Ni|Nickel|58.693|10|4|transition|1.91|7.640|124|+2
29|Cu|Copper|63.546|11|4|transition|1.90|7.726|132|+2,+1
30|Zn|Zinc|65.38|12|4|transition|1.65|9.394|122|+2
31|Ga|Gallium|69.723|13|4|post-transition|1.81|5.999|122|+3
32|Ge|Germanium|72.630|14|4|metalloid|2.01|7.900|120|+4
33|As|Arsenic|74.922|15|4|metalloid|2.18|9.789|119|+3,+5,-3
34|Se|Selenium|78.971|16|4|nonmetal|2.55|9.752|120|-2,+4,+6
35|Br|Bromine|79.904|17|4|halogen|2.96|11.814|120|-1,+1,+5
36|Kr|Krypton|83.798|18|4|noble|3.00|13.999|116|0
37|Rb|Rubidium|85.468|1|5|alkali|0.82|4.177|220|+1
38|Sr|Strontium|87.62|2|5|alkaline-earth|0.95|5.695|195|+2
39|Y|Yttrium|88.906|3|5|transition|1.22|6.217|190|+3
40|Zr|Zirconium|91.224|4|5|transition|1.33|6.634|175|+4
41|Nb|Niobium|92.906|5|5|transition|1.6|6.759|164|+5
42|Mo|Molybdenum|95.95|6|5|transition|2.16|7.092|154|+6,+4
43|Tc|Technetium|98|7|5|transition|1.9|7.28|147|+7,+4
44|Ru|Ruthenium|101.07|8|5|transition|2.2|7.361|146|+3,+4
45|Rh|Rhodium|102.91|9|5|transition|2.28|7.459|142|+3
46|Pd|Palladium|106.42|10|5|transition|2.20|8.337|139|+2,+4
47|Ag|Silver|107.87|11|5|transition|1.93|7.576|145|+1
48|Cd|Cadmium|112.41|12|5|transition|1.69|8.994|144|+2
49|In|Indium|114.82|13|5|post-transition|1.78|5.786|142|+3
50|Sn|Tin|118.71|14|5|post-transition|1.96|7.344|139|+4,+2
51|Sb|Antimony|121.76|15|5|metalloid|2.05|8.608|139|+3,+5,-3
52|Te|Tellurium|127.60|16|5|metalloid|2.1|9.010|138|-2,+4,+6
53|I|Iodine|126.90|17|5|halogen|2.66|10.451|139|-1,+1,+5,+7
54|Xe|Xenon|131.29|18|5|noble|2.60|12.130|140|0,+2,+4,+6
55|Cs|Caesium|132.91|1|6|alkali|0.79|3.894|244|+1
56|Ba|Barium|137.33|2|6|alkaline-earth|0.89|5.212|215|+2
57|La|Lanthanum|138.91|3|6|lanthanide|1.10|5.577|207|+3
58|Ce|Cerium|140.12|3|6|lanthanide|1.12|5.539|204|+3,+4
59|Pr|Praseodymium|140.91|3|6|lanthanide|1.13|5.473|203|+3
60|Nd|Neodymium|144.24|3|6|lanthanide|1.14|5.525|201|+3
61|Pm|Promethium|145|3|6|lanthanide|1.13|5.582|199|+3
62|Sm|Samarium|150.36|3|6|lanthanide|1.17|5.644|198|+3,+2
63|Eu|Europium|151.96|3|6|lanthanide|1.2|5.670|198|+3,+2
64|Gd|Gadolinium|157.25|3|6|lanthanide|1.20|6.150|196|+3
65|Tb|Terbium|158.93|3|6|lanthanide|1.2|5.864|194|+3
66|Dy|Dysprosium|162.50|3|6|lanthanide|1.22|5.939|192|+3
67|Ho|Holmium|164.93|3|6|lanthanide|1.23|6.022|192|+3
68|Er|Erbium|167.26|3|6|lanthanide|1.24|6.108|189|+3
69|Tm|Thulium|168.93|3|6|lanthanide|1.25|6.184|190|+3
70|Yb|Ytterbium|173.05|3|6|lanthanide|1.1|6.254|187|+3,+2
71|Lu|Lutetium|174.97|3|6|lanthanide|1.27|5.426|187|+3
72|Hf|Hafnium|178.49|4|6|transition|1.3|6.825|175|+4
73|Ta|Tantalum|180.95|5|6|transition|1.5|7.550|170|+5
74|W|Tungsten|183.84|6|6|transition|2.36|7.864|162|+6
75|Re|Rhenium|186.21|7|6|transition|1.9|7.834|151|+7,+4
76|Os|Osmium|190.23|8|6|transition|2.2|8.438|144|+4,+8
77|Ir|Iridium|192.22|9|6|transition|2.20|8.967|141|+3,+4
78|Pt|Platinum|195.08|10|6|transition|2.28|8.959|136|+2,+4
79|Au|Gold|196.97|11|6|transition|2.54|9.226|136|+3,+1
80|Hg|Mercury|200.59|12|6|transition|2.00|10.438|132|+2,+1
81|Tl|Thallium|204.38|13|6|post-transition|1.62|6.108|145|+1,+3
82|Pb|Lead|207.2|14|6|post-transition|2.33|7.417|146|+2,+4
83|Bi|Bismuth|208.98|15|6|post-transition|2.02|7.286|148|+3
84|Po|Polonium|209|16|6|post-transition|2.0|8.417|140|+2,+4
85|At|Astatine|210|17|6|halogen|2.2|9.3|150|-1,+1
86|Rn|Radon|222|18|6|noble|2.2|10.749|150|0
87|Fr|Francium|223|1|7|alkali|0.7|4.073|260|+1
88|Ra|Radium|226|2|7|alkaline-earth|0.9|5.279|221|+2
89|Ac|Actinium|227|3|7|actinide|1.1|5.17|215|+3
90|Th|Thorium|232.04|3|7|actinide|1.3|6.307|206|+4
91|Pa|Protactinium|231.04|3|7|actinide|1.5|5.89|200|+5
92|U|Uranium|238.03|3|7|actinide|1.38|6.194|196|+6,+4
93|Np|Neptunium|237|3|7|actinide|1.36|6.266|190|+5
94|Pu|Plutonium|244|3|7|actinide|1.28|6.026|187|+4
95|Am|Americium|243|3|7|actinide|1.3|5.974|180|+3
96|Cm|Curium|247|3|7|actinide|1.3|5.991|169|+3
97|Bk|Berkelium|247|3|7|actinide|1.3|6.198||+3
98|Cf|Californium|251|3|7|actinide|1.3|6.282||+3
99|Es|Einsteinium|252|3|7|actinide|1.3|6.42||+3
100|Fm|Fermium|257|3|7|actinide|1.3|6.50||+3
101|Md|Mendelevium|258|3|7|actinide|1.3|6.58||+3
102|No|Nobelium|259|3|7|actinide|1.3|6.65||+2
103|Lr|Lawrencium|266|3|7|actinide|1.3|4.9||+3
104|Rf|Rutherfordium|267|4|7|transition||||
105|Db|Dubnium|268|5|7|transition||||
106|Sg|Seaborgium|269|6|7|transition||||
107|Bh|Bohrium|270|7|7|transition||||
108|Hs|Hassium|269|8|7|transition||||
109|Mt|Meitnerium|278|9|7|transition||||
110|Ds|Darmstadtium|281|10|7|transition||||
111|Rg|Roentgenium|282|11|7|transition||||
112|Cn|Copernicium|285|12|7|transition||||
113|Nh|Nihonium|286|13|7|post-transition||||
114|Fl|Flerovium|289|14|7|post-transition||||
115|Mc|Moscovium|290|15|7|post-transition||||
116|Lv|Livermorium|293|16|7|post-transition||||
117|Ts|Tennessine|294|17|7|halogen||||
118|Og|Oganesson|294|18|7|noble||||`;

  const RADIOACTIVE = new Set([43, 61].concat(Array.from({ length: 118 - 83 }, (_, i) => 84 + i)));

  /* ground-state configurations that break the Madelung (aufbau) order */
  const EXCEPTIONS = {
    24: '[Ar] 3d5 4s1', 29: '[Ar] 3d10 4s1', 41: '[Kr] 4d4 5s1', 42: '[Kr] 4d5 5s1', 44: '[Kr] 4d7 5s1', 45: '[Kr] 4d8 5s1',
    46: '[Kr] 4d10', 47: '[Kr] 4d10 5s1', 57: '[Xe] 5d1 6s2', 58: '[Xe] 4f1 5d1 6s2', 64: '[Xe] 4f7 5d1 6s2', 78: '[Xe] 4f14 5d9 6s1',
    79: '[Xe] 4f14 5d10 6s1', 89: '[Rn] 6d1 7s2', 90: '[Rn] 6d2 7s2', 91: '[Rn] 5f2 6d1 7s2', 92: '[Rn] 5f3 6d1 7s2',
    93: '[Rn] 5f4 6d1 7s2', 96: '[Rn] 5f7 6d1 7s2', 103: '[Rn] 5f14 7s2 7p1'
  };
  const ORDER = ['1s', '2s', '2p', '3s', '3p', '4s', '3d', '4p', '5s', '4d', '5p', '6s', '4f', '5d', '6p', '7s', '5f', '6d', '7p'];
  const CAP = { s: 2, p: 6, d: 10, f: 14 };
  const NOBLE = [[2, 'He'], [10, 'Ne'], [18, 'Ar'], [36, 'Kr'], [54, 'Xe'], [86, 'Rn']];
  function aufbau(z) {
    const out = [];
    let left = z;
    for (const sub of ORDER) {
      if (left <= 0) break;
      const n = Math.min(CAP[sub[1]], left);
      out.push(sub + n);
      left -= n;
    }
    return out;
  }
  function config(z) {
    if (EXCEPTIONS[z]) return EXCEPTIONS[z];
    let core = null;
    for (const [nz, sym] of NOBLE) if (nz < z) core = [nz, sym];
    const full = aufbau(z);
    if (!core) return full.join(' ');
    const coreLen = aufbau(core[0]).length;
    // the shells after the noble-gas core, written in order of n then l
    const rest = full.slice(coreLen);
    const L = { s: 0, p: 1, d: 2, f: 3 };
    rest.sort((a, b) => (+a[0] - +b[0]) || (L[a[1]] - L[b[1]]));
    return '[' + core[1] + '] ' + rest.join(' ');
  }
  /* full configuration written out, e.g. for Fe: 1s2 2s2 2p6 3s2 3p6 3d6 4s2 */
  function fullConfig(z) {
    const c = config(z);
    const m = /^\[(\w+)\]\s*(.*)$/.exec(c);
    if (!m) return c;
    const core = NOBLE.find(x => x[1] === m[1]);
    return fullConfig(core[0]) + ' ' + m[2];
  }

  /* CPK-style colours for drawing atoms */
  const COLOR = { H: '#f4f4f4', C: '#555a60', N: '#3050f8', O: '#ff2a2a', F: '#90e050', Cl: '#1fd01f', Br: '#a62929', I: '#940094', He: '#d9ffff',
    Ne: '#b3e3f5', Ar: '#80d1e3', Kr: '#5cb8d1', Xe: '#429eb0', P: '#ff8000', S: '#e8d33f', B: '#ffb5b5', Li: '#cc80ff', Na: '#ab5cf2', K: '#8f40d4',
    Rb: '#702eb0', Cs: '#57178f', Be: '#c2ff00', Mg: '#8aff00', Ca: '#3dff00', Sr: '#00ff00', Ba: '#00c900', Fe: '#e06633', Cu: '#c88033',
    Zn: '#7d80b0', Ag: '#c0c0c0', Au: '#ffd123', Pt: '#d0d0e0', Hg: '#b8b8d0', Al: '#bfa6a6', Si: '#f0c8a0', Ti: '#bfc2c7', Cr: '#8a99c7',
    Mn: '#9c7ac7', Co: '#f090a0', Ni: '#50d050', Sn: '#668080', Pb: '#575961', U: '#008fff' };

  const elements = [];
  const bySym = {};
  for (const line of T.trim().split('\n')) {
    const [z, sym, name, mass, group, period, cat, en, ie, r, ox] = line.split('|');
    const Z = +z;
    const e = {
      z: Z, sym, name, mass: +mass, group: +group, period: +period, cat,
      en: en ? +en : null, ie: ie ? +ie : null, r: r ? +r : null,
      ox: ox ? ox.split(',').map(s => +s) : [],
      radioactive: RADIOACTIVE.has(Z),
      block: (Z >= 57 && Z <= 71) || (Z >= 89 && Z <= 103) ? (Z === 71 || Z === 103 ? 'd' : 'f') : (+group <= 2 || Z === 2) ? 's' : +group >= 13 ? 'p' : 'd',
      config: config(Z),
      color: COLOR[sym] || '#e070a0'
    };
    if (Z === 1) e.block = 's';
    elements.push(e);
    bySym[sym] = e;
  }

  /* ---------------------------------------------------------------- formulas */
  /* 'Ca(OH)2' -> {atoms, charge}. Accepts hydrates (·, ., *), brackets, charges 'SO4^2-',
     'SO4{2-}', 'Fe^3+', 'NH4+', 'e-'; a leading coefficient of a hydrate part multiplies it. */
  /* the charge written at the end of a formula: SO4^2-, SO4^{2-}, SO4{2-}, NH4+, Cl-, SO4--,
     and Fe3+ (a single element followed by digits and a sign: the digits are the charge) */
  function splitCharge(s) {
    const sg = c => (c === '+' ? 1 : -1);
    let m = /\^\{?(\d*)([+-])\}?$/.exec(s) || /\{(\d*)([+-])\}$/.exec(s);
    if (m) return [s.slice(0, m.index), sg(m[2]) * (m[1] ? +m[1] : 1)];
    m = /([+-]+)$/.exec(s);
    if (m) {
      const signs = m[1], body = s.slice(0, m.index);
      if (signs.length > 1) return [body, sg(signs[0]) * signs.length];
      const d = /^([A-Z][a-z]?)(\d+)$/.exec(body);
      if (d) return [d[1], sg(signs) * +d[2]];
      return [body, sg(signs)];
    }
    return [s, 0];
  }
  function parse(formula) {
    let s = String(formula).trim().replace(/\s+/g, '');
    if (s === 'e' || s === 'e-' || s === 'e^-') return { atoms: {}, charge: -1, electron: true };
    const atoms = {};
    let charge;
    [s, charge] = splitCharge(s);
    const parts = s.split(/[·.*•]/);
    for (const part0 of parts) {
      let part = part0, mult = 1;
      const c = /^(\d+)/.exec(part);
      if (c && parts.length > 1) { mult = +c[1]; part = part.slice(c[1].length); }
      const counts = group(part);
      for (const [k, v] of Object.entries(counts)) atoms[k] = (atoms[k] || 0) + v * mult;
    }
    return { atoms, charge };
  }
  function group(s) {
    let i = 0;
    const read = () => {
      const out = {};
      while (i < s.length) {
        const ch = s[i];
        if (ch === '(' || ch === '[' || ch === '{') {
          i++;
          const inner = read();
          if (s[i] !== ')' && s[i] !== ']' && s[i] !== '}') throw new Error('Unclosed bracket in ' + s);
          i++;
          const n = num();
          for (const [k, v] of Object.entries(inner)) out[k] = (out[k] || 0) + v * n;
        } else if (ch === ')' || ch === ']' || ch === '}') return out;
        else if (/[A-Z]/.test(ch)) {
          let sym = ch; i++;
          if (i < s.length && /[a-z]/.test(s[i])) { sym += s[i]; i++; }
          if (!bySym[sym]) throw new Error('Unknown element "' + sym + '"');
          const n = num();
          out[sym] = (out[sym] || 0) + n;
        } else throw new Error('Unexpected "' + ch + '" in ' + s);
      }
      return out;
    };
    const num = () => { const m = /^\d+/.exec(s.slice(i)); if (m) { i += m[0].length; return +m[0]; } return 1; };
    const r = read();
    if (i < s.length) throw new Error('Unexpected "' + s[i] + '" in ' + s);
    return r;
  }
  function molarMass(formula) {
    const { atoms } = typeof formula === 'string' ? parse(formula) : formula;
    let M = 0;
    for (const [k, v] of Object.entries(atoms)) M += bySym[k].mass * v;
    return M;
  }
  function composition(formula) {
    const { atoms } = parse(formula);
    const M = molarMass({ atoms });
    return Object.entries(atoms).map(([sym, n]) => ({ sym, n, mass: n * bySym[sym].mass, fraction: n * bySym[sym].mass / M }));
  }

  /* ---------------------------------------------------------------- balancing */
  // exact rational arithmetic with BigInt, so coefficients are exact integers
  const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; };
  /* species are separated by " + " (with spaces), so a charge sign stays attached: Fe^3+ + e- */
  function splitSide(side) {
    return side.split(/\s+\+\s+/).map(x => x.trim()).filter(Boolean);
  }
  function stripSpecies(sp) {
    // "2 H2O(l)" -> "H2O"; keeps charges
    return sp.replace(/^\d+\s*/, '').replace(/\((aq|s|l|g)\)$/, '').trim();
  }
  function balance(eq) {
    const txt = String(eq).replace(/→|⟶|=>|==|=|<=>|⇌|<->|↔/g, '->');
    const sides = txt.split('->');
    if (sides.length !== 2) return { ok: false, error: 'Write the equation as reactants -> products' };
    const L = splitSide(sides[0]).map(stripSpecies), R = splitSide(sides[1]).map(stripSpecies);
    const species = L.concat(R);
    let parsed;
    try { parsed = species.map(parse); } catch (e) { return { ok: false, error: e.message }; }
    const els = [...new Set(parsed.flatMap(p => Object.keys(p.atoms)))];
    const rows = els.map(el => parsed.map((p, j) => BigInt((p.atoms[el] || 0) * (j < L.length ? 1 : -1))));
    if (parsed.some(p => p.charge)) rows.push(parsed.map((p, j) => BigInt(p.charge * (j < L.length ? 1 : -1))));
    // reduced row echelon form over the rationals (integer rows, kept primitive)
    const n = species.length;
    const M = rows.map(r => r.slice());
    let r = 0;
    const pivots = [];
    for (let c = 0; c < n && r < M.length; c++) {
      let p = M.findIndex((row, i) => i >= r && row[c] !== 0n);
      if (p < 0) continue;
      [M[r], M[p]] = [M[p], M[r]];
      for (let i = 0; i < M.length; i++) {
        if (i === r || M[i][c] === 0n) continue;
        const a = M[r][c], b = M[i][c];
        M[i] = M[i].map((v, k) => v * a - M[r][k] * b);
        const g = M[i].reduce((acc, v) => gcd(acc, v), 0n);
        if (g > 1n) M[i] = M[i].map(v => v / g);
      }
      pivots.push(c);
      r++;
    }
    const free = [];
    for (let c = 0; c < n; c++) if (!pivots.includes(c)) free.push(c);
    if (free.length !== 1) return { ok: false, error: free.length === 0 ? 'No way to balance this equation (check the formulas).' : 'More than one independent way to balance it: this is really several reactions.' };
    // set the free coefficient to the lcm of the pivots and back-substitute
    const f = free[0];
    let scale = 1n;
    for (let i = 0; i < pivots.length; i++) { const a = M[i][pivots[i]]; scale = scale * (a < 0n ? -a : a) / gcd(scale, a); }
    const x = new Array(n).fill(0n);
    x[f] = scale;
    for (let i = 0; i < pivots.length; i++) x[pivots[i]] = -M[i][f] * scale / M[i][pivots[i]];
    let g = x.reduce((acc, v) => gcd(acc, v), 0n);
    let coeffs = x.map(v => v / g);
    if (coeffs.some(v => v < 0n)) coeffs = coeffs.map(v => -v);
    if (coeffs.some(v => v <= 0n)) return { ok: false, error: 'A species would need a zero or negative coefficient: is it on the right side?' };
    const nums = coeffs.map(Number);
    const fmt = (list, off) => list.map((s, i) => (nums[i + off] === 1 ? '' : nums[i + off] + ' ') + s).join(' + ');
    return { ok: true, coefficients: nums, reactants: L, products: R, text: fmt(L, 0) + ' -> ' + fmt(R, L.length), elements: els };
  }

  /* ---------------------------------------------------------------- VSEPR */
  const t = Math.acos(-1 / 3);                  // tetrahedral angle
  const GEOM = {
    1: [[1, 0, 0]],
    2: [[1, 0, 0], [-1, 0, 0]],
    3: [[1, 0, 0], [-0.5, Math.sqrt(3) / 2, 0], [-0.5, -Math.sqrt(3) / 2, 0]],
    4: [[0, 0, 1], [Math.sin(t), 0, Math.cos(t)], [Math.sin(t) * Math.cos(2 * Math.PI / 3), Math.sin(t) * Math.sin(2 * Math.PI / 3), Math.cos(t)], [Math.sin(t) * Math.cos(4 * Math.PI / 3), Math.sin(t) * Math.sin(4 * Math.PI / 3), Math.cos(t)]],
    5: [[0, 0, 1], [0, 0, -1], [1, 0, 0], [-0.5, Math.sqrt(3) / 2, 0], [-0.5, -Math.sqrt(3) / 2, 0]],       // two axial, then three equatorial
    6: [[0, 0, 1], [0, 0, -1], [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0]]
  };
  const NAMES = {
    '2,0': ['linear', 180], '3,0': ['trigonal planar', 120], '2,1': ['bent', 117], '4,0': ['tetrahedral', 109.5], '3,1': ['trigonal pyramidal', 107],
    '2,2': ['bent', 104.5], '5,0': ['trigonal bipyramidal', '90 and 120'], '4,1': ['seesaw', '<90 and <120'], '3,2': ['T-shaped', '<90'],
    '2,3': ['linear', 180], '6,0': ['octahedral', 90], '5,1': ['square pyramidal', '<90'], '4,2': ['square planar', 90], '1,0': ['linear', '—'], '1,1': ['linear', '—'], '1,2': ['linear', '—'], '1,3': ['linear', '—']
  };
  /* bonding pairs b, lone pairs l around a central atom: ideal directions for bonds and lone pairs */
  function vsepr(b, l) {
    const n = b + (l || 0);
    const dirs = (GEOM[n] || GEOM[2]).map(d => d.slice());
    // lone pairs take the positions with most room: equatorial in 5, trans in 6
    let lonePos = [];
    if (n === 5) lonePos = [2, 3, 4, 0, 1].slice(0, l);
    else if (n === 6) lonePos = [0, 1, 2, 3, 4, 5].slice(0, l);     // two lone pairs trans
    else lonePos = Array.from({ length: l }, (_, i) => n - 1 - i);
    const bonds = [], lone = [];
    dirs.forEach((d, i) => (lonePos.includes(i) ? lone : bonds).push(d));
    const nm = NAMES[b + ',' + (l || 0)] || ['—', '—'];
    return { name: nm[0], angle: nm[1], electronGeometry: ({ 2: 'linear', 3: 'trigonal planar', 4: 'tetrahedral', 5: 'trigonal bipyramidal', 6: 'octahedral' })[n] || '—', dirs: bonds, lone, steric: n };
  }

  /* ---------------------------------------------------------------- molecules */
  const d2r = Math.PI / 180;
  function fromVsepr(center, ligands, l, order) {
    const g = vsepr(ligands.length, l);
    const atoms = [{ el: center, x: 0, y: 0, z: 0 }];
    const bonds = [];
    // bent molecules: squeeze toward the real angle (lone pairs repel more)
    const shrink = { 'bent': 1, 'trigonal pyramidal': 1 };
    g.dirs.forEach((d, i) => {
      const el = ligands[i];
      const len = ((bySym[center].r || 75) + (bySym[el].r || 75)) / 100;
      atoms.push({ el, x: d[0] * len, y: d[1] * len, z: d[2] * len });
      bonds.push([0, i + 1, order ? order[i] || 1 : 1]);
    });
    void shrink;
    return { atoms, bonds, lone: g.lone.map(d => ({ atom: 0, dir: d })), shape: g.name, angle: g.angle };
  }
  const LIB = {
    H2O: () => { const m = fromVsepr('O', ['H', 'H'], 2); setAngle(m, 104.5); return m; },
    NH3: () => pyramid(fromVsepr('N', ['H', 'H', 'H'], 1), 107),
    CH4: () => fromVsepr('C', ['H', 'H', 'H', 'H'], 0),
    CO2: () => fromVsepr('C', ['O', 'O'], 0, [2, 2]),
    BF3: () => fromVsepr('B', ['F', 'F', 'F'], 0),
    SF6: () => fromVsepr('S', ['F', 'F', 'F', 'F', 'F', 'F'], 0),
    PCl5: () => fromVsepr('P', ['Cl', 'Cl', 'Cl', 'Cl', 'Cl'], 0),
    XeF4: () => fromVsepr('Xe', ['F', 'F', 'F', 'F'], 2),
    SF4: () => fromVsepr('S', ['F', 'F', 'F', 'F'], 1),
    ClF3: () => fromVsepr('Cl', ['F', 'F', 'F'], 2),
    H2: () => ({ atoms: [{ el: 'H', x: -0.37, y: 0, z: 0 }, { el: 'H', x: 0.37, y: 0, z: 0 }], bonds: [[0, 1, 1]], lone: [] }),
    HCl: () => ({ atoms: [{ el: 'H', x: -0.64, y: 0, z: 0 }, { el: 'Cl', x: 0.64, y: 0, z: 0 }], bonds: [[0, 1, 1]], lone: [] }),
    N2: () => ({ atoms: [{ el: 'N', x: -0.55, y: 0, z: 0 }, { el: 'N', x: 0.55, y: 0, z: 0 }], bonds: [[0, 1, 3]], lone: [] }),
    O2: () => ({ atoms: [{ el: 'O', x: -0.6, y: 0, z: 0 }, { el: 'O', x: 0.6, y: 0, z: 0 }], bonds: [[0, 1, 2]], lone: [] }),
    C2H4: () => {
      const a = [{ el: 'C', x: -0.67, y: 0, z: 0 }, { el: 'C', x: 0.67, y: 0, z: 0 }];
      for (const [cx, s] of [[-0.67, -1], [0.67, 1]]) for (const k of [-1, 1]) a.push({ el: 'H', x: cx + s * 1.09 * Math.cos(60 * d2r), y: k * 1.09 * Math.sin(60 * d2r), z: 0 });
      return { atoms: a, bonds: [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]], lone: [] };
    },
    C2H2: () => ({ atoms: [{ el: 'C', x: -0.6, y: 0, z: 0 }, { el: 'C', x: 0.6, y: 0, z: 0 }, { el: 'H', x: -1.66, y: 0, z: 0 }, { el: 'H', x: 1.66, y: 0, z: 0 }], bonds: [[0, 1, 3], [0, 2, 1], [1, 3, 1]], lone: [] }),
    C6H6: () => {
      const a = [], b = [];
      for (let k = 0; k < 6; k++) { const q = k * 60 * d2r; a.push({ el: 'C', x: 1.39 * Math.cos(q), y: 1.39 * Math.sin(q), z: 0 }); }
      for (let k = 0; k < 6; k++) { const q = k * 60 * d2r; a.push({ el: 'H', x: 2.48 * Math.cos(q), y: 2.48 * Math.sin(q), z: 0 }); b.push([k, (k + 1) % 6, k % 2 ? 1 : 2], [k, k + 6, 1]); }
      return { atoms: a, bonds: b, lone: [], aromatic: true };
    },
    C2H5OH: () => {
      // ethanol, staggered
      const atoms = [{ el: 'C', x: -1.17, y: -0.4, z: 0 }, { el: 'C', x: 0.25, y: 0.13, z: 0 }, { el: 'O', x: 1.2, y: -0.9, z: 0 }, { el: 'H', x: 2.07, y: -0.52, z: 0 },
        { el: 'H', x: -1.87, y: 0.43, z: 0 }, { el: 'H', x: -1.34, y: -1.02, z: 0.88 }, { el: 'H', x: -1.34, y: -1.02, z: -0.88 }, { el: 'H', x: 0.42, y: 0.75, z: 0.89 }, { el: 'H', x: 0.42, y: 0.75, z: -0.89 }];
      return { atoms, bonds: [[0, 1, 1], [1, 2, 1], [2, 3, 1], [0, 4, 1], [0, 5, 1], [0, 6, 1], [1, 7, 1], [1, 8, 1]], lone: [] };
    }
  };
  /* close the three bonds of a pyramid (one lone pair) to a given H–X–H angle, about the lone-pair axis */
  function pyramid(m, deg) {
    const L = m.lone[0].dir, n = Math.hypot(L[0], L[1], L[2]), u = [L[0] / n, L[1] / n, L[2] / n];
    // three bonds at angle a from the axis opposite the lone pair: cos(deg) = 1.5 cos²a − 0.5
    const ca = Math.sqrt((Math.cos(deg * d2r) + 0.5) / 1.5), sa = Math.sqrt(1 - ca * ca);
    for (let i = 1; i < m.atoms.length; i++) {
      const a = m.atoms[i], len = Math.hypot(a.x, a.y, a.z);
      const d = [a.x / len, a.y / len, a.z / len], along = d[0] * u[0] + d[1] * u[1] + d[2] * u[2];
      const p = [d[0] - along * u[0], d[1] - along * u[1], d[2] - along * u[2]], pn = Math.hypot(p[0], p[1], p[2]) || 1;
      a.x = len * (-ca * u[0] + sa * p[0] / pn); a.y = len * (-ca * u[1] + sa * p[1] / pn); a.z = len * (-ca * u[2] + sa * p[2] / pn);
    }
    return m;
  }
  /* rotate the two ligands of a bent molecule to a given angle (in their plane) */
  function setAngle(m, deg) {
    const h = deg / 2 * d2r;
    const len = Math.hypot(m.atoms[1].x, m.atoms[1].y, m.atoms[1].z);
    m.atoms[1] = Object.assign(m.atoms[1], { x: len * Math.sin(h), y: -len * Math.cos(h), z: 0 });
    m.atoms[2] = Object.assign(m.atoms[2], { x: -len * Math.sin(h), y: -len * Math.cos(h), z: 0 });
    m.lone = [{ atom: 0, dir: [0, 0.6, 0.8] }, { atom: 0, dir: [0, 0.6, -0.8] }];
  }
  function molecule(name) {
    if (LIB[name]) return LIB[name]();
    return null;
  }

  H.chem = {
    elements, el: s => bySym[s] || (typeof s === 'number' ? elements[s - 1] : null), bySym,
    config, fullConfig, parse, molarMass, composition, balance, vsepr, molecule, fromVsepr, library: Object.keys(LIB),
    CATEGORIES: ['alkali', 'alkaline-earth', 'transition', 'post-transition', 'metalloid', 'nonmetal', 'halogen', 'noble', 'lanthanide', 'actinide']
  };
})(typeof window !== 'undefined' ? window : globalThis);
