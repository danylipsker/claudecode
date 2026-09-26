/* HYPER-CHEMISTRY · sims/acids-bases.js — acids, bases, buffers and titrations.
 * Every pH shown here is exact for its model: it comes from the charge balance, solved
 * numerically (bisection on pH) with Kw and the acid constants, never from region-by-
 * region approximations. Molecules are drawn in the CPK colours of kit.chem. */
(function () {
  'use strict';

  /* ================================================================ shared chemistry */
  const KW = 1.0e-14;
  const pow10 = x => Math.pow(10, x);
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const SUPS = { '-': '⁻', '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹' };
  /* numbers as 3.2 × 10⁻⁵ (plain decimals between 0.01 and 1000) */
  function sci(v, sig) {
    sig = sig || 2;
    if (!Number.isFinite(v) || v <= 0) return '0';
    let e = Math.floor(Math.log10(v));
    let m = v / pow10(e);
    if (+m.toFixed(sig - 1) >= 10) { m /= 10; e += 1; }
    if (e >= -2 && e <= 3) return String(+v.toPrecision(sig));
    return m.toFixed(sig - 1) + ' × 10' + String(e).split('').map(ch => SUPS[ch] || ch).join('');
  }
  const f2 = v => (Number.isFinite(v) ? v : 0).toFixed(2).replace('-', '−');
  const pct = v => {
    const p = 100 * (Number.isFinite(v) ? v : 0);
    return (p >= 99.95 && p < 100 ? '> 99.9' : p > 0 && p < 0.05 ? '< 0.1' : p.toFixed(p < 10 ? 2 : 1)) + ' %';
  };

  /* fractions α_j of an acid H_nA in each protonation state j = 0 (fully protonated) … n */
  function fractions(h, Ka) {
    const t = [1];
    let p = 1;
    for (let i = 0; i < Ka.length; i++) { p *= Ka[i] / h; t.push(p); }
    let D = 0;
    for (const v of t) D += v;
    return t.map(v => v / D);
  }
  /* Exact pH of a mixture. nb = [Na⁺] − [Cl⁻] (mol/L) from strong bases and strong acids;
     acids = [{ C (mol/L), Ka: [...], z0: charge of the fully protonated form }].
     Charge balance: h − Kw/h + nb + Σ C·(z0 − n̄) = 0, with n̄ the mean number of protons
     lost. The left side falls steadily as the pH rises, so bisection finds the one root. */
  function solvePH(nb, acids, Kw) {
    Kw = Kw || KW;
    const F = pH => {
      const h = pow10(-pH);
      let s = h - Kw / h + nb;
      for (const a of acids || []) {
        if (!(a.C > 0)) continue;
        const al = fractions(h, a.Ka);
        let nbar = 0;
        for (let j = 1; j < al.length; j++) nbar += j * al[j];
        s += a.C * ((a.z0 || 0) - nbar);
      }
      return s;
    };
    let lo = -1.5, hi = 15.8;
    if (!(F(lo) > 0)) return lo;
    if (!(F(hi) < 0)) return hi;
    for (let i = 0; i < 64; i++) { const m = (lo + hi) / 2; if (F(m) > 0) lo = m; else hi = m; }
    return (lo + hi) / 2;
  }
  const KaOf = pKa => pKa.map(p => pow10(-p));

  /* acid systems at 25 °C: pKa values, the charge of the fully protonated form, species */
  const SYSTEMS = {
    acetic: { name: 'Acetic acid', pKa: [4.76], z0: 0, sp: ['CH₃COOH', 'CH₃COO⁻'], shape: 'acetic' },
    hocl: { name: 'Hypochlorous acid (pool chlorine)', pKa: [7.53], z0: 0, sp: ['HOCl', 'OCl⁻'], shape: 'hocl' },
    ammonium: { name: 'Ammonium ion / ammonia', pKa: [9.25], z0: 1, sp: ['NH₄⁺', 'NH₃'], shape: 'nh' },
    carbonic: { name: 'Carbonic acid (dissolved CO₂)', pKa: [6.35, 10.33], z0: 0, sp: ['CO₂(aq)', 'HCO₃⁻', 'CO₃²⁻'], shape: 'carbonate' },
    phosphoric: { name: 'Phosphoric acid', pKa: [2.15, 7.20, 12.35], z0: 0, sp: ['H₃PO₄', 'H₂PO₄⁻', 'HPO₄²⁻', 'PO₄³⁻'], shape: 'phosphate' },
    citric: { name: 'Citric acid', pKa: [3.13, 4.76, 6.40], z0: 0, sp: ['H₃Cit', 'H₂Cit⁻', 'HCit²⁻', 'Cit³⁻'], shape: 'generic' },
    glycine: { name: 'Glycine (an amino acid)', pKa: [2.34, 9.60], z0: 1, sp: ['⁺H₃N–CH₂–COOH', '⁺H₃N–CH₂–COO⁻', 'H₂N–CH₂–COO⁻'], shape: 'glycine' }
  };

  /* ================================================================ colours */
  // a typical universal indicator at whole pH units 0 … 14
  const UNIV = [[196, 30, 42], [220, 38, 40], [236, 72, 40], [244, 122, 42], [247, 165, 46], [240, 204, 52], [204, 218, 58], [98, 180, 72],
                [40, 152, 118], [38, 118, 178], [52, 82, 178], [82, 60, 166], [104, 46, 150], [116, 36, 132], [110, 30, 112]];
  const mix = (a, b, t) => a.map((v, i) => v + ((b[i] == null ? v : b[i]) - v) * t);
  const rgba = (a, alpha) => 'rgba(' + Math.round(a[0]) + ',' + Math.round(a[1]) + ',' + Math.round(a[2]) + ',' + (alpha != null ? alpha : (a[3] != null ? a[3] : 1)) + ')';
  function univ(pH) {
    const p = clamp(Number.isFinite(pH) ? pH : 7, 0, 14);
    const i = Math.min(13, Math.floor(p));
    return mix(UNIV[i], UNIV[i + 1], p - i);
  }
  // indicators: pK of the dye, visual range, acid and base colours (r, g, b, opacity)
  const INDICATORS = [
    { id: 'tb1', name: 'Thymol blue (acid range)', pK: 1.65, lo: 1.2, hi: 2.8, ca: [214, 38, 44, 0.85], cb: [238, 200, 40, 0.8], an: 'red', bn: 'yellow' },
    { id: 'mo', name: 'Methyl orange', pK: 3.46, lo: 3.1, hi: 4.4, ca: [214, 40, 50, 0.85], cb: [242, 184, 40, 0.8], an: 'red', bn: 'yellow-orange' },
    { id: 'bcg', name: 'Bromocresol green', pK: 4.7, lo: 3.8, hi: 5.4, ca: [232, 206, 50, 0.8], cb: [40, 96, 196, 0.85], an: 'yellow', bn: 'blue' },
    { id: 'mr', name: 'Methyl red', pK: 5.1, lo: 4.4, hi: 6.2, ca: [216, 36, 70, 0.85], cb: [240, 200, 44, 0.8], an: 'red', bn: 'yellow' },
    { id: 'lit', name: 'Litmus', pK: 6.5, lo: 4.5, hi: 8.3, ca: [196, 40, 64, 0.85], cb: [58, 70, 186, 0.85], an: 'red', bn: 'blue' },
    { id: 'btb', name: 'Bromothymol blue', pK: 7.1, lo: 6.0, hi: 7.6, ca: [230, 206, 44, 0.8], cb: [36, 84, 196, 0.85], an: 'yellow', bn: 'blue' },
    { id: 'pr', name: 'Phenol red', pK: 7.9, lo: 6.8, hi: 8.4, ca: [238, 196, 44, 0.8], cb: [216, 36, 96, 0.85], an: 'yellow', bn: 'red' },
    { id: 'tb2', name: 'Thymol blue (base range)', pK: 8.9, lo: 8.0, hi: 9.6, ca: [238, 200, 40, 0.8], cb: [44, 84, 196, 0.85], an: 'yellow', bn: 'blue' },
    { id: 'php', name: 'Phenolphthalein', pK: 9.4, lo: 8.2, hi: 10.0, ca: [255, 255, 255, 0], cb: [222, 30, 140, 0.85], an: 'colourless', bn: 'pink' },
    { id: 'tph', name: 'Thymolphthalein', pK: 9.9, lo: 9.3, hi: 10.5, ca: [255, 255, 255, 0], cb: [40, 84, 200, 0.85], an: 'colourless', bn: 'blue' },
    { id: 'ayr', name: 'Alizarin yellow R', pK: 11.0, lo: 10.1, hi: 12.0, ca: [236, 206, 50, 0.8], cb: [206, 64, 36, 0.85], an: 'yellow', bn: 'red' }
  ];
  const IND = {};
  INDICATORS.forEach(d => { IND[d.id] = d; });
  const baseFrac = (ind, pH) => 1 / (1 + pow10(ind.pK - pH));
  const indColour = (ind, pH) => mix(ind.ca, ind.cb, baseFrac(ind, pH));
  const WATER = [150, 190, 230, 0.22];

  /* ================================================================ drawing */
  let CHEM = null;   // kit.chem, set when a simulation mounts
  const darker = hex => {
    const n = parseInt(String(hex).slice(1), 16);
    if (!Number.isFinite(n)) return '#555555';
    return 'rgb(' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * 0.7)).join(',') + ')';
  };
  const elOf = s => (CHEM && CHEM.el(s)) || null;
  const elCol = s => { const e = elOf(s); return (e && e.color) || '#909090'; };
  const elRad = s => { const e = elOf(s); return 0.2 + ((e && e.r) || 70) / 100 * 0.5; };
  function ball(c, x, y, r, col) {
    const g = c.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.4, col); g.addColorStop(1, darker(col));
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = g; c.fill();
    c.lineWidth = 1; c.strokeStyle = 'rgba(0,0,0,.5)'; c.stroke();
  }
  /* flat molecule sketches, atom positions in ångström (y down) */
  function addH(A, ax, ay, dx, dy) { const n = Math.hypot(dx, dy) || 1; A.push(['H', ax + dx / n * 0.95, ay + dy / n * 0.95]); }
  function atomsOf(shape, nH, el) {
    const A = [];
    switch (shape) {
      case 'X': A.push([el || 'Cl', 0, 0]); if (nH) addH(A, 0, 0, -1, -0.4); break;
      case 'hocl': A.push(['Cl', -0.85, 0], ['O', 0.8, 0]); if (nH) addH(A, 0.8, 0, 0.5, -0.85); break;
      case 'cn': A.push(['C', -0.58, 0], ['N', 0.58, 0]); if (nH) addH(A, -0.58, 0, -1, 0); break;
      case 'h3o': A.push(['O', 0, 0]); addH(A, 0, 0, 0, -1); addH(A, 0, 0, 0.87, 0.5); addH(A, 0, 0, -0.87, 0.5); break;
      case 'acetic':
        A.push(['C', -1.45, 0], ['C', 0, 0], ['O', 0.72, -1.08], ['O', 0.72, 1.08]);
        addH(A, -1.45, 0, -0.5, -0.9); addH(A, -1.45, 0, -0.5, 0.9); addH(A, -1.45, 0, -1, 0);
        if (nH) addH(A, 0.72, 1.08, 1, 0.3);
        break;
      case 'formic':
        A.push(['C', 0, 0], ['O', 0.72, -1.08], ['O', 0.72, 1.08]); addH(A, 0, 0, -1, 0);
        if (nH) addH(A, 0.72, 1.08, 1, 0.3);
        break;
      case 'nh':
        A.push(['N', 0, 0]);
        if (nH >= 4) { addH(A, 0, 0, 1, 1); addH(A, 0, 0, -1, 1); addH(A, 0, 0, 1, -1); addH(A, 0, 0, -1, -1); }
        else for (let i = 0; i < nH; i++) addH(A, 0, 0, Math.cos(-Math.PI / 2 + i * 2.094), Math.sin(-Math.PI / 2 + i * 2.094));
        break;
      case 'co2': A.push(['O', -1.16, 0], ['C', 0, 0], ['O', 1.16, 0]); break;
      case 'carbonate': {
        const O = [[0, -1.28], [1.11, 0.64], [-1.11, 0.64]];
        A.push(['C', 0, 0]); O.forEach(o => A.push(['O', o[0], o[1]]));
        for (let i = 0; i < nH && i < 2; i++) addH(A, O[i + 1][0], O[i + 1][1], O[i + 1][0], O[i + 1][1]);
        break;
      }
      case 'phosphate': {
        const O = [[0, -1.5], [-1.42, 0.5], [1.42, 0.5], [0, 1.5]];
        A.push(['P', 0, 0]); O.forEach(o => A.push(['O', o[0], o[1]]));
        for (let i = 0; i < nH && i < 3; i++) addH(A, O[i + 1][0], O[i + 1][1], O[i + 1][0], O[i + 1][1]);
        break;
      }
      default: {   // a carboxylic acid with several acid groups, sketched
        const O = [[-1.2, -0.8], [1.2, -0.8], [0, 1.35]];
        A.push(['C', 0, 0]); O.forEach(o => A.push(['O', o[0], o[1]]));
        for (let i = 0; i < nH && i < 3; i++) addH(A, O[i][0], O[i][1], O[i][0], O[i][1]);
      }
    }
    return A;
  }
  function glycineAtoms(j) {
    const A = [['N', -2.3, 0.35], ['C', -1.15, -0.35], ['C', 0.1, 0.35], ['O', 1.2, -0.3], ['O', 0.1, 1.6]];
    addH(A, -2.3, 0.35, -0.6, -1); addH(A, -2.3, 0.35, -1, 0.5);
    if (j < 2) addH(A, -2.3, 0.35, 0.1, 1);
    if (j === 0) addH(A, 1.2, -0.3, 1, 0.5);
    return A;
  }
  /* the atoms of species j (j protons removed) of an acid system */
  function speciesAtoms(S, j) {
    const n = S.pKa.length;
    if (S.shape === 'carbonate') return j === 0 ? atomsOf('co2', 0) : atomsOf('carbonate', n - j);
    if (S.shape === 'glycine') return glycineAtoms(j);
    if (S.shape === 'nh') return atomsOf('nh', 4 - j);
    return atomsOf(S.shape, n - j);
  }
  const chargeText = z => z === 0 ? '' : (Math.abs(z) > 1 ? Math.abs(z) : '') + (z > 0 ? '+' : '−');
  function drawMol(c, atoms, x, y, s, th, alpha) {
    const cs = Math.cos(th || 0), sn = Math.sin(th || 0);
    c.globalAlpha = alpha == null ? 1 : alpha;
    const order = atoms.slice().sort((p, q) => (p[0] === 'H' ? 0 : 1) - (q[0] === 'H' ? 0 : 1));
    for (const [el, ax, ay] of order) ball(c, x + (ax * cs - ay * sn) * s, y + (ax * sn + ay * cs) * s, elRad(el) * s, elCol(el));
    c.globalAlpha = 1;
  }
  function drawCharge(kit, c, z, x, y, C) {
    const t = typeof z === 'string' ? z : chargeText(z);
    if (t) kit.label(c, t, x, y, { size: 12, weight: 700, color: C.text, align: 'center' });
  }
  /* a beaker: x, y the top-left of the glass; level 0 … 1 of its height is liquid */
  function beaker(c, C, x, y, w, h, level, fill) {
    const ly = y + h * (1 - clamp(level, 0, 1));
    c.save();
    c.fillStyle = rgba(WATER);
    c.fillRect(x + 1, ly, w - 2, y + h - ly - 1);
    if (fill) { c.fillStyle = fill; c.fillRect(x + 1, ly, w - 2, y + h - ly - 1); }
    c.strokeStyle = C.muted; c.lineWidth = 2;
    c.beginPath(); c.moveTo(x - 5, y - 3); c.lineTo(x, y + 2); c.lineTo(x, y + h); c.lineTo(x + w, y + h); c.lineTo(x + w, y); c.stroke();
    c.restore();
    return ly;
  }
  /* particles drifting in the unit square */
  function wander(p, dt) {
    p.x += p.vx * dt; p.y += p.vy * dt; p.th += p.w * dt;
    if (p.x < 0.05 && p.vx < 0) p.vx = -p.vx; if (p.x > 0.95 && p.vx > 0) p.vx = -p.vx;
    if (p.y < 0.06 && p.vy < 0) p.vy = -p.vy; if (p.y > 0.94 && p.vy > 0) p.vy = -p.vy;
    p.vx += (Math.random() - 0.5) * 0.25 * dt; p.vy += (Math.random() - 0.5) * 0.25 * dt;
    const sp = Math.hypot(p.vx, p.vy);
    if (sp > 0.1) { p.vx *= 0.1 / sp; p.vy *= 0.1 / sp; }
    else if (sp < 0.02) { p.vx += (Math.random() - 0.5) * 0.04; p.vy += (Math.random() - 0.5) * 0.04; }
  }
  const particle = (x, y) => {
    const a = Math.random() * Math.PI * 2, s = 0.03 + Math.random() * 0.05;
    return { x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, th: Math.random() * 6.28, w: (Math.random() - 0.5) * 1.2 };
  };
  /* a small panel of text for a pH meter */
  function meter(kit, c, C, x, y, w, pH, label) {
    c.fillStyle = C.surface; c.strokeStyle = C.border2 || C.muted; c.lineWidth = 1;
    c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, 40, 6); else c.rect(x, y, w, 40); c.fill(); c.stroke();
    kit.label(c, label || 'pH meter', x + w / 2, y + 10, { size: 10, color: C.muted, align: 'center' });
    kit.label(c, 'pH ' + f2(pH), x + w / 2, y + 27, { size: 16, weight: 700, align: 'center' });
  }
  function graphBox(box) {
    const gbox = document.createElement('div');
    gbox.style.padding = '4px 10px 10px';
    box.stage.appendChild(gbox);
    return gbox;
  }

  /* ================================================================ 1 · the pH scale */
  const SUBSTANCES = [
    ['Car-battery acid', 0.5], ['Stomach acid', 1.8], ['Lemon juice', 2.3], ['Cola', 2.5], ['Vinegar', 2.8], ['Coffee', 5.0], ['Clean rain', 5.6],
    ['Milk', 6.7], ['Pure water, 25 °C', 7.0], ['Blood', 7.4], ['Sea water', 8.1], ['Baking-soda solution', 8.3], ['Milk of magnesia', 10.5],
    ['Household ammonia', 11.5], ['Limewater', 12.4], ['Bleach', 12.6], ['1 M sodium hydroxide', 14.0]
  ];
  const TEMPS = [['0 °C', 14.94], ['25 °C', 14.00], ['37 °C (body)', 13.62], ['50 °C', 13.26], ['100 °C', 12.3]];

  Hyper.sim('ab-ph-scale', {
    title: 'The pH scale: hydronium against hydroxide',
    blurb: `Slide the pH or pick a substance. The bar shows a universal indicator's colours; the columns and the graph show [H₃O⁺] and [OH⁻] on a logarithmic axis, where each pH unit is a factor of ten.

- Move from pH 7 to pH 4: [H₃O⁺] grows a thousandfold and [OH⁻] shrinks a thousandfold — their product stays at Kw.
- Compare cola (2.5) with coffee (5.0): about 300 times more hydronium.
- Switch the temperature to 37 °C or 100 °C: the two lines cross lower, so neutral water has a pH below 7 without being acidic.`,
    mount(box, kit, params) {
      CHEM = kit.chem;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const t0 = params && params.temp != null && TEMPS[+params.temp] ? +params.temp : 1;
      const ctl = kit.controls(box.side, [
        { id: 'pH', label: 'pH', min: -1, max: 15, step: 0.01, value: 7, fmt: v => f2(v) },
        { id: 'sub', type: 'select', label: 'Everyday substance', options: [['— set the pH yourself —', -1]].concat(SUBSTANCES.map((s, i) => [s[0] + ' · ' + s[1], i])), value: -1 },
        { id: 'T', type: 'select', label: 'Temperature', options: TEMPS.map((t, i) => [t[0] + ' · pKw ' + t[1].toFixed(2), i]), value: t0 },
        { id: 'ui', type: 'check', label: 'Universal indicator in the beaker', value: true }
      ], (id, v) => {
        if (id === 'sub' && v >= 0 && SUBSTANCES[v]) ctl.set('pH', SUBSTANCES[v][1]);
        if (id === 'pH') ctl.set('sub', -1);
        update();
        loop.once();
      });
      const ro = kit.readout(box.side, [['h', '[H₃O⁺]'], ['oh', '[OH⁻]'], ['poh', 'pOH'], ['ratio', '[H₃O⁺] : [OH⁻]'], ['kw', 'Kw at this temperature'], ['state', 'The solution is']]);
      const plot = kit.plot(graphBox(box), { x: { label: 'pH', min: -1, max: 15 }, y: { label: 'mol/L', log: true, min: 1e-16, max: 10 } }, 200);
      const V = ctl.values;
      let disp = V.pH;

      function update() {
        const C = kit.colors();
        const pKw = TEMPS[V.T] ? TEMPS[V.T][1] : 14, Kw = pow10(-pKw), pH = V.pH;
        const h = pow10(-pH), oh = Kw / h, neutral = pKw / 2;
        ro.set('h', sci(h, 2) + ' mol/L');
        ro.set('oh', sci(oh, 2) + ' mol/L');
        ro.set('poh', f2(pKw - pH));
        ro.set('ratio', h >= oh ? sci(h / oh, 2) + ' : 1' : '1 : ' + sci(oh / h, 2));
        ro.set('kw', sci(Kw, 2));
        ro.set('state', Math.abs(pH - neutral) < 0.005 ? 'neutral' : (pH < neutral ? 'acidic' : 'basic') + ' (neutral: ' + f2(neutral) + ')');
        const line = f => { const a = []; for (let p = -1; p <= 15.0001; p += 0.1) a.push([p, f(p)]); return a; };
        plot.set({
          series: [{ pts: line(p => pow10(-p)), label: '[H₃O⁺]', color: C.series[1] }, { pts: line(p => Kw / pow10(-p)), label: '[OH⁻]', color: C.series[0] }],
          vlines: [{ x: neutral, label: 'neutral ' + f2(neutral) }, { x: pH, color: C.warn }],
          marks: [{ x: pH, y: h, color: C.series[1] }, { x: pH, y: oh, color: C.series[0] }]
        });
      }

      function frame(dt) {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        disp += (V.pH - disp) * Math.min(1, (dt || 1) * 9);
        const pKw = TEMPS[V.T] ? TEMPS[V.T][1] : 14, Kw = pow10(-pKw), neutral = pKw / 2;
        const x0 = 22, x1 = W - 22, px = p => x0 + (clamp(p, -1, 15) + 1) / 16 * (x1 - x0);
        const kind = Math.abs(disp - neutral) < 0.005 ? 'neutral' : disp < neutral ? 'acidic' : 'basic';
        kit.label(c, 'pH ' + f2(disp) + ' · ' + kind, x0, 18, { size: 17, weight: 650 });
        kit.label(c, TEMPS[V.T][0] + ': neutral at pH ' + f2(neutral), x1, 18, { size: 12, color: C.muted, align: 'right' });
        // the colour bar
        const by = 48, bh = 22;
        for (let i = 0; i < 160; i++) { const p = -1 + i / 10; c.fillStyle = rgba(univ(p)); c.fillRect(px(p), by, (x1 - x0) / 160 + 1, bh); }
        c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(x0, by, x1 - x0, bh);
        const every = W < 480 ? 2 : 1;
        for (let p = -1; p <= 15; p++) {
          const X = px(p);
          c.strokeStyle = C.muted; c.beginPath(); c.moveTo(X, by + bh); c.lineTo(X, by + bh + 4); c.stroke();
          if ((p + 1) % every === 0) kit.label(c, String(p).replace('-', '−'), X, by + bh + 12, { size: 11, align: 'center', color: C.muted });
        }
        const nx = px(neutral);
        c.setLineDash([4, 3]); c.strokeStyle = C.text; c.beginPath(); c.moveTo(nx, by - 3); c.lineTo(nx, by + bh + 3); c.stroke(); c.setLineDash([]);
        const X = px(disp);
        c.fillStyle = C.text; c.beginPath(); c.moveTo(X, by - 1); c.lineTo(X - 7, by - 12); c.lineTo(X + 7, by - 12); c.closePath(); c.fill();
        // substances, placed greedily in up to four rows so labels do not overlap
        c.font = '500 10.5px ' + (getComputedStyle(document.body).fontFamily || 'sans-serif');
        const rowsEnd = [-1e9, -1e9, -1e9, -1e9], ly0 = by + bh + 30;
        for (const s of SUBSTANCES) {
          const sx = px(s[1]), w = c.measureText(s[0]).width;
          let left = sx - w / 2;
          if (left < x0) left = x0; if (left + w > x1) left = x1 - w;
          const r = rowsEnd.findIndex(e => e < left - 6);
          c.strokeStyle = C.faint; c.lineWidth = 1;
          c.beginPath(); c.moveTo(sx, by + bh + 18); c.lineTo(sx, r >= 0 ? ly0 + r * 14 - 5 : by + bh + 22); c.stroke();
          if (r < 0) continue;
          rowsEnd[r] = left + w;
          const near = Math.abs(s[1] - disp) < 0.12;
          kit.label(c, s[0], left, ly0 + r * 14, { size: 10.5, color: near ? C.text : C.muted, weight: near ? 700 : 500 });
        }
        // lower part: beaker, log columns, the product
        const top = ly0 + 4 * 14 + 6, bot = H - 26;
        const bw = Math.min(150, W * 0.24), bxx = x0 + 8, bhh = Math.max(60, bot - top - 4);
        const pHnow = V.pH;
        beaker(c, C, bxx, top + 4, bw, bhh, 0.78, V.ui ? rgba(univ(pHnow), 0.85) : null);
        kit.label(c, V.ui ? 'with universal indicator' : 'no indicator', bxx + bw / 2, bot + 14, { size: 11, color: C.muted, align: 'center' });
        const cx = bxx + bw + Math.max(56, W * 0.1), colW = Math.min(46, W * 0.06), gap = colW * 0.8;
        const yv = v => bot - (clamp(Math.log10(Math.max(v, 1e-300)), -15, 0) + 15) / 15 * (bot - top - 14);
        c.strokeStyle = C.axis || C.muted; c.lineWidth = 1;
        c.beginPath(); c.moveTo(cx - 8, top + 14); c.lineTo(cx - 8, bot); c.lineTo(cx + 2 * colW + gap + 8, bot); c.stroke();
        for (let e = 0; e >= -15; e -= 3) {
          const Y = yv(pow10(e));
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(cx - 8, Y); c.lineTo(cx + 2 * colW + gap + 8, Y); c.stroke();
          kit.label(c, '10' + String(e).split('').map(ch => SUPS[ch]).join(''), cx - 12, Y, { size: 10.5, color: C.muted, align: 'right' });
        }
        const h = pow10(-pHnow), oh = Kw / h;
        [[h, 'H₃O⁺', C.series[1]], [oh, 'OH⁻', C.series[0]]].forEach(([v, lab, col], i) => {
          const x = cx + i * (colW + gap), Y = yv(v);
          c.fillStyle = col; c.globalAlpha = 0.85; c.fillRect(x, Y, colW, bot - Y); c.globalAlpha = 1;
          kit.label(c, lab, x + colW / 2, bot + 12, { size: 12, weight: 650, align: 'center' });
          kit.label(c, sci(v, 2), x + colW / 2, Math.max(top + 6, Y - 9), { size: 10.5, align: 'center' });
        });
        const ny = yv(Math.sqrt(Kw));
        c.setLineDash([4, 3]); c.strokeStyle = C.text; c.beginPath(); c.moveTo(cx - 8, ny); c.lineTo(cx + 2 * colW + gap + 8, ny); c.stroke(); c.setLineDash([]);
        const tx = cx + 2 * colW + gap + 26;
        if (tx < W - 120) {
          kit.label(c, 'Kw = [H₃O⁺][OH⁻] = ' + sci(Kw, 2), tx, top + 20, { size: 12.5, weight: 600 });
          const r = h / oh;
          kit.label(c, r >= 1 ? 'H₃O⁺ outnumbers OH⁻ ' + sci(r, 2) + ' to 1' : 'OH⁻ outnumbers H₃O⁺ ' + sci(1 / r, 2) + ' to 1', tx, top + 42, { size: 12, color: C.muted });
          kit.label(c, 'one pH unit = a factor of 10', tx, top + 62, { size: 12, color: C.muted });
          const near = SUBSTANCES.reduce((b, s) => Math.abs(s[1] - pHnow) < Math.abs(b[1] - pHnow) ? s : b, SUBSTANCES[0]);
          kit.label(c, 'nearest: ' + near[0] + ' (' + near[1] + ')', tx, top + 82, { size: 12, color: C.muted });
        }
      }
      update();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 2 · strong against weak */
  const WEAKS = {
    acetic: { label: 'Acetic acid · pKa 4.76', pKa: 4.76, HA: 'CH₃COOH', A: 'CH₃COO⁻', shape: 'acetic' },
    formic: { label: 'Formic acid · pKa 3.75', pKa: 3.75, HA: 'HCOOH', A: 'HCOO⁻', shape: 'formic' },
    hf: { label: 'Hydrofluoric acid · pKa 3.17', pKa: 3.17, HA: 'HF', A: 'F⁻', shape: 'X', el: 'F' },
    hocl: { label: 'Hypochlorous acid · pKa 7.53', pKa: 7.53, HA: 'HOCl', A: 'OCl⁻', shape: 'hocl' },
    hcn: { label: 'Hydrocyanic acid · pKa 9.21', pKa: 9.21, HA: 'HCN', A: 'CN⁻', shape: 'cn' }
  };
  const STRONG = { HA: 'HCl', A: 'Cl⁻', shape: 'X', el: 'Cl' };
  const N_ACID = 30;

  Hyper.sim('ab-strong-weak', {
    title: 'A strong and a weak acid at the same concentration',
    blurb: `Both flasks hold the same number of acid molecules (30 are drawn, whatever the concentration; water is left out). Hydrochloric acid gives every proton to water as H₃O⁺. In the weak acid, protons keep jumping on and off — at any moment only a few molecules are split, and which ones keeps changing.

- At 0.1 M, acetic acid is about 1 % ionised: most of the time you see no split molecule at all, and its pH is 2.88 against 1.00.
- Slide the concentration down: the weak acid ionises more and more (Ostwald's dilution law). Watch the dashed shortcut √(Ka/C) run away from the exact curve.
- Switch the graph to pH: below 10⁻⁶ M both acids approach pH 7 — water's own ions take over.`,
    mount(box, kit, params) {
      CHEM = kit.chem;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const a0 = params && WEAKS[params.acid] ? params.acid : 'acetic';
      const ctl = kit.controls(box.side, [
        { id: 'acid', type: 'select', label: 'Weak acid', options: Object.keys(WEAKS).map(k => [WEAKS[k].label, k]), value: a0 },
        { id: 'C', label: 'Concentration of each acid', min: 1e-6, max: 1, value: 0.1, log: true, sig: 2, unit: 'M' },
        { id: 'graph', type: 'select', label: 'Graph', options: [['Percentage ionised', 'alpha'], ['pH', 'pH']], value: 'alpha' },
        { type: 'buttons', items: [{ id: 'mix', label: 'Mix again' }] }
      ], id => {
        if (id === 'acid' || id === 'mix') fill();
        analyse();
        loop.once();
      });
      const ro = kit.readout(box.side, [['phS', 'pH, hydrochloric acid'], ['phW', 'pH, weak acid'], ['aW', 'Weak acid ionised'], ['ratio', '[H₃O⁺]: strong ÷ weak'], ['short', 'Weak acid by the shortcut']]);
      const plot = kit.plot(graphBox(box), {}, 190);
      const V = ctl.values;
      const flasks = [{ strong: true, mols: [] }, { strong: false, mols: [] }];
      let alphaW = 0.013, pHs = 1, pHw = 2.88;

      const exactW = (Ka, C) => { const pH = solvePH(0, [{ C, Ka: [Ka] }]); return { pH, alpha: Ka / (Ka + pow10(-pH)) }; };
      const exactS = C => solvePH(-C, []);
      function analyse() {
        const C = kit.colors();
        const Wk = WEAKS[V.acid] || WEAKS.acetic, Ka = pow10(-Wk.pKa), c0 = V.C;
        const w = exactW(Ka, c0);
        alphaW = w.alpha; pHw = w.pH; pHs = exactS(c0);
        ro.set('phS', f2(pHs));
        ro.set('phW', f2(pHw));
        ro.set('aW', pct(alphaW));
        ro.set('ratio', (pow10(pHw - pHs)).toPrecision(3) + ' ×');
        const x = Math.sqrt(Ka * c0);
        ro.set('short', 'pH ' + f2(-Math.log10(x)) + ', ' + pct(Math.min(1, x / c0)));
        const xs = [];
        for (let e = -7; e <= 0.0001; e += 0.05) xs.push(pow10(e));
        if (V.graph === 'pH') {
          plot.set({
            x: { label: 'concentration (mol/L)', log: true, min: 1e-7, max: 1 }, y: { label: 'pH', min: 0, max: 8 },
            series: [{ pts: xs.map(cc => [cc, exactS(cc)]), label: 'HCl', color: C.series[1] }, { pts: xs.map(cc => [cc, exactW(Ka, cc).pH]), label: Wk.HA, color: C.series[0] }],
            hlines: [{ y: 7, label: 'pH 7' }], vlines: [],
            marks: [{ x: c0, y: pHs, color: C.series[1] }, { x: c0, y: pHw, color: C.series[0] }]
          });
        } else {
          plot.set({
            x: { label: 'concentration (mol/L)', log: true, min: 1e-7, max: 1 }, y: { label: '% of the acid ionised', min: 0, max: 105 },
            series: [{ pts: xs.map(cc => [cc, 100]), label: 'HCl', color: C.series[1] }, { pts: xs.map(cc => [cc, 100 * exactW(Ka, cc).alpha]), label: Wk.HA + ' (exact)', color: C.series[0] },
                     { pts: xs.map(cc => [cc, Math.min(105, 100 * Math.sqrt(Ka / cc))]), label: 'shortcut √(Ka/C)', color: C.series[0], dash: [5, 4], width: 1.5 }],
            hlines: [], vlines: [],
            marks: [{ x: c0, y: 100 * alphaW, color: C.series[0], label: pct(alphaW) }]
          });
        }
      }
      function fill() {
        for (const F of flasks) {
          F.mols = [];
          const nSplit = F.strong ? N_ACID : Math.round(alphaW * N_ACID);
          for (let i = 0; i < N_ACID; i++) {
            const p = particle(0.08 + Math.random() * 0.84, 0.1 + Math.random() * 0.8);
            p.k = i < nSplit ? 'A' : 'HA';
            F.mols.push(p);
            if (p.k === 'A') { const q = particle(clamp(p.x + (Math.random() - 0.5) * 0.2, 0.06, 0.94), clamp(p.y + (Math.random() - 0.5) * 0.2, 0.06, 0.94)); q.k = 'H'; F.mols.push(q); }
          }
        }
      }
      // protons jump on and off: the split fraction averages the exact α
      function react(F, dt) {
        if (F.strong) return;
        const kr = 1.4, kf = alphaW >= 0.995 ? 80 : kr * alphaW / Math.max(1e-9, 1 - alphaW);
        const born = [];
        for (const m of F.mols) {
          if (m.k === 'HA' && Math.random() < kf * dt) {
            m.k = 'A';
            const q = particle(clamp(m.x + 0.04, 0.06, 0.94), clamp(m.y - 0.03, 0.06, 0.94)); q.k = 'H'; q.vx = Math.abs(q.vx) + 0.05; born.push(q);
          } else if (m.k === 'A' && Math.random() < kr * dt) {
            let best = null, bd = Infinity;
            for (const q of F.mols) if (q.k === 'H' && !q.gone) { const d = Math.hypot(q.x - m.x, q.y - m.y); if (d < bd) { bd = d; best = q; } }
            if (best) { best.gone = true; m.k = 'HA'; }
          }
        }
        F.mols = F.mols.filter(q => !q.gone).concat(born);
      }
      function frame(dt) {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const Wk = WEAKS[V.acid] || WEAKS.acetic;
        const s = clamp(Math.min(W, H) / 46, 6, 10);
        const fw = (W - 60) / 2, fh = H - 92, fy = 44;
        flasks.forEach((F, i) => {
          for (const m of F.mols) wander(m, dt);
          react(F, dt);
          const fx = 20 + i * (fw + 20);
          const pH = F.strong ? pHs : pHw;
          beaker(c, C, fx, fy, fw, fh, 0.96, null);
          const D = F.strong ? STRONG : Wk;
          kit.label(c, (F.strong ? 'HCl · strong' : D.HA + ' · weak'), fx + fw / 2, 16, { size: 14.5, weight: 650, align: 'center' });
          kit.label(c, 'pH ' + f2(pH) + ' · ' + (F.strong ? '100 % ionised' : pct(alphaW) + ' ionised'), fx + fw / 2, 34, { size: 12, color: C.muted, align: 'center' });
          const X = m => fx + 8 + m.x * (fw - 16), Y = m => fy + 8 + m.y * (fh - 16);
          for (const m of F.mols) {
            if (m.k === 'H') { drawMol(c, atomsOf('h3o', 0), X(m), Y(m), s, m.th); drawCharge(kit, c, '+', X(m) + 1.5 * s, Y(m) - 1.5 * s, C); }
            else {
              drawMol(c, atomsOf(D.shape, m.k === 'HA' ? 1 : 0, D.el), X(m), Y(m), s, m.th);
              if (m.k === 'A') drawCharge(kit, c, '−', X(m) + 1.9 * s, Y(m) - 1.7 * s, C);
            }
          }
          const split = F.mols.filter(m => m.k === 'A').length;
          kit.label(c, 'now: ' + split + ' of ' + N_ACID + ' molecules split', fx + fw / 2, fy + fh + 14, { size: 11.5, color: C.muted, align: 'center' });
        });
        // legend
        const ly = H - 14;
        const lx = [30, W * 0.2 + 30, W * 0.55];
        drawMol(c, atomsOf('h3o', 0), lx[0], ly, s * 0.8, 0); kit.label(c, 'H₃O⁺', lx[0] + 14, ly, { size: 11.5 });
        drawMol(c, atomsOf(Wk.shape, 1, Wk.el), lx[1], ly, s * 0.8, 0); kit.label(c, Wk.HA + ' intact', lx[1] + 18, ly, { size: 11.5 });
        drawMol(c, atomsOf(Wk.shape, 0, Wk.el), lx[2], ly, s * 0.8, 0); kit.label(c, Wk.A + ', Cl⁻: anions', lx[2] + 18, ly, { size: 11.5 });
      }
      analyse();
      fill();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 3 · species against pH */
  Hyper.sim('ab-species', {
    title: 'Who carries the protons? Species against pH',
    blurb: `An acid spends its protons as the pH rises. The graph shows what fraction of the acid is in each form; the flask shows 40 of its molecules drawn as that mixture, and the list gives the numbers.

- Neighbouring forms cross at 50 % exactly at each pKa. One pH unit further, the ratio is 10 : 1.
- Phosphoric acid at blood pH 7.4: mostly HPO₄²⁻ with H₂PO₄⁻ — PO₄³⁻ and H₃PO₄ are almost absent.
- Carbonic acid at 8.3 (baking soda) is 98 % hydrogencarbonate. Tick **Logarithmic fraction axis** to see the tiny amounts: past its pKa a form falls tenfold per pH unit, and a hundredfold per unit once the next pKa is passed too.
- Glycine: between its two pKa values it is a zwitterion, carrying a + and a − at once.`,
    mount(box, kit, params) {
      CHEM = kit.chem;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const s0 = params && SYSTEMS[params.acid] ? params.acid : 'phosphoric';
      const ctl = kit.controls(box.side, [
        { id: 'acid', type: 'select', label: 'Acid', options: Object.keys(SYSTEMS).map(k => [SYSTEMS[k].name, k]), value: s0 },
        { id: 'pH', label: 'pH', min: 0, max: 14, step: 0.01, value: params && params.pH != null ? +params.pH : 7.4, fmt: v => f2(v) },
        { id: 'log', type: 'check', label: 'Logarithmic fraction axis', value: false },
        { type: 'buttons', items: [{ id: 'next', label: 'Jump to the next pKa' }] }
      ], id => {
        if (id === 'next') {
          const S = SYSTEMS[V.acid];
          const nxt = S.pKa.find(p => p > V.pH + 0.01);
          ctl.set('pH', nxt != null ? nxt : S.pKa[0]);
        }
        update();
        loop.once();
      });
      const ro = kit.readout(box.side, [['f0', 'Form 1'], ['f1', 'Form 2'], ['f2', 'Form 3'], ['f3', 'Form 4'], ['dom', 'Main form'], ['z', 'Average charge']]);
      const plot = kit.plot(graphBox(box), {}, 200);
      const V = ctl.values;
      const mols = [];
      for (let i = 0; i < 40; i++) mols.push(particle(Math.random(), Math.random()));
      let al = [1, 0];

      function update() {
        const C = kit.colors();
        const S = SYSTEMS[V.acid] || SYSTEMS.phosphoric, Ka = KaOf(S.pKa), n = S.pKa.length;
        al = fractions(pow10(-V.pH), Ka);
        for (let j = 0; j < 4; j++) {
          ro.show('f' + j, j <= n);
          if (j <= n) ro.set('f' + j, S.sp[j] + ' · ' + pct(al[j]));
        }
        let big = 0;
        al.forEach((a, j) => { if (a > al[big]) big = j; });
        ro.set('dom', S.sp[big]);
        let z = 0;
        al.forEach((a, j) => { z += a * (S.z0 - j); });
        ro.set('z', (z >= 0 ? '+' : '−') + Math.abs(z).toFixed(2));
        // counts for the flask, by largest remainder
        const raw = al.map(a => a * mols.length), cnt = raw.map(Math.floor);
        let left = mols.length - cnt.reduce((a, b) => a + b, 0);
        raw.map((r, j) => [r - cnt[j], j]).sort((p, q) => q[0] - p[0]).forEach(([, j]) => { if (left > 0) { cnt[j]++; left--; } });
        let k = 0;
        cnt.forEach((m, j) => { for (let i = 0; i < m && k < mols.length; i++) mols[k++].sp = j; });
        const pts = j => { const a = []; for (let p = 0; p <= 14.0001; p += 0.05) a.push([p, fractions(pow10(-p), Ka)[j] * (V.log ? 1 : 100)]); return a; };
        plot.set({
          x: { label: 'pH', min: 0, max: 14 },
          y: V.log ? { label: 'fraction (log)', log: true, min: 1e-6, max: 2 } : { label: '% of the acid', min: 0, max: 105 },
          series: S.sp.map((name, j) => ({ pts: pts(j), label: name, color: C.series[j % 7] })),
          vlines: S.pKa.map((p, i) => ({ x: p, label: 'pKa' + (n > 1 ? String(i + 1).replace(/\d/, d => '₁₂₃'[d - 1]) : '') + ' ' + p.toFixed(2) })).concat([{ x: V.pH, color: C.warn, dash: [2, 3] }]),
          hlines: [], marks: al.map((a, j) => ({ x: V.pH, y: a * (V.log ? 1 : 100), color: C.series[j % 7] }))
        });
      }

      function frame(dt) {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const S = SYSTEMS[V.acid] || SYSTEMS.phosphoric;
        let big = 0;
        al.forEach((a, j) => { if (a > al[big]) big = j; });
        kit.label(c, 'pH ' + f2(V.pH) + ' · mostly ' + S.sp[big], 16, 18, { size: 16, weight: 650 });
        const listW = Math.max(150, Math.min(250, W * 0.34));
        const bx = 14, by = 34, bw = W - listW - 34, bh = H - by - 12;
        c.fillStyle = rgba(WATER); c.fillRect(bx, by, bw, bh);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(bx, by, bw, bh);
        const s = clamp(Math.min(bw, bh) / 40, 4.5, 8.5);
        for (const m of mols) {
          wander(m, dt);
          const j = m.sp || 0, x = bx + 3.2 * s + m.x * (bw - 6.4 * s), y = by + 3.2 * s + m.y * (bh - 6.4 * s);
          c.strokeStyle = C.series[j % 7]; c.lineWidth = 2.5;
          c.beginPath(); c.arc(x, y, 3.0 * s, 0, Math.PI * 2); c.stroke();
          drawMol(c, speciesAtoms(S, j), x, y, s, S.shape === 'glycine' ? 0 : m.th);
          drawCharge(kit, c, S.shape === 'glycine' && j === 1 ? '±' : S.z0 - j, x + 2.5 * s, y - 2.5 * s, C);
        }
        // the list
        const lx = W - listW - 8;
        S.sp.forEach((name, j) => {
          const y = by + 12 + j * 42;
          c.fillStyle = C.series[j % 7]; c.fillRect(lx, y - 7, 12, 12);
          kit.label(c, name, lx + 18, y, { size: 12.5, weight: 600 });
          kit.label(c, pct(al[j]), lx + listW, y, { size: 12.5, align: 'right' });
          c.fillStyle = C.grid; c.fillRect(lx, y + 10, listW, 8);
          c.fillStyle = C.series[j % 7]; c.fillRect(lx, y + 10, listW * clamp(al[j], 0, 1), 8);
        });
        const ny = by + 12 + S.sp.length * 42;
        if (ny < H - 20) kit.label(c, 'coloured rings match the graph', lx, ny, { size: 11, color: C.muted });
      }
      update();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 4 · buffer bench */
  const BUFFERS = {
    acetate: { name: 'Acetic acid / sodium acetate', sys: 'acetic', k: 0 },
    phosphate: { name: 'NaH₂PO₄ / Na₂HPO₄ (phosphate)', sys: 'phosphoric', k: 1 },
    ammonia: { name: 'NH₄Cl / NH₃ (ammonia)', sys: 'ammonium', k: 0 },
    carbonate: { name: 'NaHCO₃ / Na₂CO₃ (carbonate)', sys: 'carbonic', k: 1 }
  };
  const DROP = 0.05;          // mL per drop of 1.0 M reagent = 0.05 mmol
  const V0B = 100;            // mL in each beaker at the start

  Hyper.sim('ab-buffer', {
    title: 'Buffer bench: drops of acid and alkali',
    blurb: `Each press adds the same drops of 1.0 M hydrochloric acid or sodium hydroxide to 100 mL of pure water (left) and to 100 mL of a buffer (right). The bars show the buffer's weak acid and conjugate base; the graph shows the pH of both beakers against the acid or alkali added.

- One drop of acid takes the water from pH 7 to about 3.3; the buffer barely moves. Keep going: the buffer only fails when its base form is nearly used up.
- Raise the buffer concentration: same starting pH, more capacity. Lower it to 0.001 M and it gives up after a couple of drops.
- Set the ratio to 10 : 1 — the pH is pKa + 1 and the buffer resists acid well but alkali poorly. Capacity is greatest at 1 : 1, where pH = pKa.`,
    mount(box, kit, params) {
      CHEM = kit.chem;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300 });
      const b0 = params && BUFFERS[params.buffer] ? params.buffer : 'acetate';
      const ctl = kit.controls(box.side, [
        { id: 'buf', type: 'select', label: 'Buffer', options: Object.keys(BUFFERS).map(k => [BUFFERS[k].name, k]), value: b0 },
        { id: 'C', label: 'Buffer concentration (acid + base)', min: 0.001, max: 0.5, value: 0.1, log: true, sig: 2, unit: 'M' },
        { id: 'r', label: 'Ratio base : acid', min: 0.1, max: 10, value: 1, log: true, sig: 2, fmt: v => (v >= 1 ? kit.fmt(v, 2) + ' : 1' : '1 : ' + kit.fmt(1 / v, 2)) },
        { type: 'buttons', items: [{ id: 'a1', label: '+1 drop HCl' }, { id: 'b1', label: '+1 drop NaOH' }] },
        { type: 'buttons', items: [{ id: 'a10', label: '+10 drops HCl' }, { id: 'b10', label: '+10 drops NaOH' }] },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again', primary: true }] }
      ], id => {
        if (id === 'a1') add(1, 0); else if (id === 'b1') add(0, 1);
        else if (id === 'a10') add(10, 0); else if (id === 'b10') add(0, 10);
        else { dA = 0; dB = 0; drops = []; }
        update();
        loop.once();
      });
      const ro = kit.readout(box.side, [['pw', 'pH, water'], ['pb', 'pH, buffer'], ['dw', 'Change, water'], ['db', 'Change, buffer'], ['rat', 'Base : acid now'], ['beta', 'Buffer capacity']]);
      const plot = kit.plot(graphBox(box), {}, 190);
      const V = ctl.values;
      let dA = 0, dB = 0, drops = [], pw0 = 7, pb0 = 7, pw = 7, pb = 7;

      const recipe = () => {
        const B = BUFFERS[V.buf] || BUFFERS.acetate, S = SYSTEMS[B.sys];
        const b = V.r / (1 + V.r);
        return { B, S, Ka: KaOf(S.pKa), nb0: V.C * (B.k + b - S.z0) };     // nb0: [Na⁺] − [Cl⁻] in the recipe, mol/L
      };
      // pH of each beaker after a net amount x (mmol) of NaOH (negative: HCl), total volume vol (mL)
      const waterPH = (x, vol) => solvePH(x / vol, []);
      const bufferPH = (R, x, vol) => solvePH((R.nb0 * V0B + x) / vol, [{ C: V.C * V0B / vol, Ka: R.Ka, z0: R.S.z0 }]);
      function add(a, b) {
        dA += a; dB += b;
        for (let i = 0; i < a + b; i++) drops.push({ acid: i < a, t: -i * 0.06 });
      }
      function update() {
        const C = kit.colors(), R = recipe();
        const x = (dB - dA) * DROP, vol = V0B + (dA + dB) * DROP;
        pw0 = waterPH(0, V0B); pb0 = bufferPH(R, 0, V0B);
        pw = waterPH(x, vol); pb = bufferPH(R, x, vol);
        ro.set('pw', f2(pw)); ro.set('pb', f2(pb));
        ro.set('dw', (pw - pw0 >= 0 ? '+' : '−') + Math.abs(pw - pw0).toFixed(2));
        ro.set('db', (pb - pb0 >= 0 ? '+' : '−') + Math.abs(pb - pb0).toFixed(2));
        const al = fractions(pow10(-pb), R.Ka), ra = al[R.B.k + 1] / Math.max(1e-30, al[R.B.k]);
        ro.set('rat', ra >= 1 ? kit.fmt(ra, 3) + ' : 1' : '1 : ' + kit.fmt(1 / ra, 3));
        // capacity: strong base (mol/L) needed per unit of pH, found numerically
        const d = 1e-4, nbv = (R.nb0 * V0B + x) / vol, Cv = V.C * V0B / vol;
        const p1 = solvePH(nbv - d, [{ C: Cv, Ka: R.Ka, z0: R.S.z0 }]), p2 = solvePH(nbv + d, [{ C: Cv, Ka: R.Ka, z0: R.S.z0 }]);
        ro.set('beta', kit.fmt(2 * d / Math.max(1e-9, p2 - p1), 3) + ' mol/L per pH');
        const xs = [];
        for (let v = -6; v <= 6.0001; v += 0.05) xs.push(v);
        plot.set({
          x: { label: '← HCl added (mmol)   ·   NaOH added (mmol) →', min: -6, max: 6 }, y: { label: 'pH', min: 0, max: 14 },
          series: [{ pts: xs.map(v => [v, waterPH(v, V0B + Math.abs(v))]), label: 'water', color: C.series[1] }, { pts: xs.map(v => [v, bufferPH(R, v, V0B + Math.abs(v))]), label: 'buffer', color: C.series[0] }],
          vlines: [{ x: 0 }], hlines: [{ y: R.S.pKa[R.B.k], label: 'pKa ' + R.S.pKa[R.B.k].toFixed(2) }],
          marks: [{ x: x, y: pw, color: C.series[1] }, { x: x, y: pb, color: C.series[0] }]
        });
      }
      function frame(dt) {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, R = recipe();
        for (const d of drops) d.t += dt;
        drops = drops.filter(d => d.t < 0.7);
        const bw = Math.min(170, W * 0.24), bh = H * 0.5, by = H * 0.3;
        const xs = [W * 0.2 - bw / 2, W * 0.58 - bw / 2];
        const vol = V0B + (dA + dB) * DROP;
        [[pw, 'Pure water'], [pb, 'Buffer']].forEach(([p, name], i) => {
          const x = xs[i];
          beaker(c, C, x, by, bw, bh, 0.62 * vol / 100, rgba(univ(p), 0.8));
          kit.label(c, name, x + bw / 2, by + bh + 14, { size: 13, weight: 650, align: 'center' });
          meter(kit, c, C, x + bw / 2 - 48, 8, 96, p);
          // the dropper
          const dx = x + bw / 2;
          c.fillStyle = C.surface2 || C.bg; c.strokeStyle = C.muted; c.lineWidth = 1.2;
          c.beginPath(); c.rect(dx - 5, 54, 10, by - 74); c.fill(); c.stroke();
          c.beginPath(); c.moveTo(dx - 5, by - 20); c.lineTo(dx, by - 10); c.lineTo(dx + 5, by - 20); c.stroke();
          for (const d of drops) {
            if (d.t < 0) continue;
            const y = by - 8 + d.t / 0.7 * (bh * (1 - 0.62 * vol / 100) + 10);
            c.fillStyle = d.acid ? C.bad : C.accent;
            c.beginPath(); c.arc(dx, y, 3.2, 0, Math.PI * 2); c.fill();
          }
        });
        kit.label(c, 'universal indicator colours', xs[0] + bw / 2, by + bh + 30, { size: 10.5, color: C.muted, align: 'center' });
        // bars: the buffer pair now (filled) against the start (dashed)
        const S = R.S, k = R.B.k, Vc = V.C * V0B;       // mmol of the pair
        const now = fractions(pow10(-pb), R.Ka), start = fractions(pow10(-pb0), R.Ka);
        const gx = W * 0.58 + bw / 2 + 30, gw = W - gx - 14, gh = bh, gy = by + bh;
        if (gw > 90) {
          kit.label(c, 'in the buffer (mmol)', gx, by - 12, { size: 11.5, color: C.muted });
          [k, k + 1].forEach((j, i) => {
            const bx = gx + i * gw / 2 + gw * 0.08, w = gw * 0.34;
            const hNow = gh * now[j], hStart = gh * start[j];
            c.setLineDash([4, 3]); c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(bx, gy - hStart, w, hStart); c.setLineDash([]);
            c.fillStyle = C.series[i === 0 ? 3 : 2]; c.fillRect(bx, gy - hNow, w, hNow);
            kit.label(c, kit.fmt(now[j] * Vc, 3), bx + w / 2, gy - hNow - 9, { size: 11, align: 'center' });
            kit.label(c, S.sp[j], bx + w / 2, gy + 14, { size: 12, weight: 600, align: 'center' });
            kit.label(c, i === 0 ? 'acid' : 'base', bx + w / 2, gy + 30, { size: 10.5, color: C.muted, align: 'center' });
          });
        }
        const net = (dB - dA) * DROP;
        kit.label(c, dA + dB === 0 ? 'press a button to add drops' : 'added: ' + dA + ' drops HCl, ' + dB + ' drops NaOH (net ' + (net >= 0 ? '+' : '−') + Math.abs(net).toFixed(2) + ' mmol OH⁻)', 14, H - 10, { size: 11.5, color: C.muted });
      }
      update();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 5 · titration */
  const V0T = 25;             // mL of analyte, from a pipette
  const VMAX = 50;            // a 50 mL burette
  const TKINDS = {
    sa: { label: 'HCl titrated with NaOH (strong acid)', an: 'HCl', ti: 'NaOH', sys: null, base0: -1, tb: 1, n: 1, C0: 0.1, ind: 'php', half: [] },
    wa: { label: 'Acetic acid with NaOH (weak acid)', an: 'CH₃COOH', ti: 'NaOH', sys: 'acetic', base0: 0, tb: 1, n: 1, C0: 0.1, ind: 'php', half: [[0.5, 0]] },
    wb: { label: 'Ammonia with HCl (weak base)', an: 'NH₃', ti: 'HCl', sys: 'ammonium', base0: 0, tb: -1, n: 1, C0: 0.1, ind: 'mr', half: [[0.5, 0]] },
    dp: { label: 'Phosphoric acid with NaOH (triprotic)', an: 'H₃PO₄', ti: 'NaOH', sys: 'phosphoric', base0: 0, tb: 1, n: 3, C0: 0.05, ind: 'php', half: [[0.5, 0], [1.5, 1], [2.5, 2]] },
    carb: { label: 'Sodium carbonate with HCl (diprotic base)', an: 'Na₂CO₃', ti: 'HCl', sys: 'carbonic', base0: 2, tb: -1, n: 2, C0: 0.05, ind: 'php', half: [[0.5, 1], [1.5, 0]] }
  };
  const TIND = [['No indicator', 'none'], ['Universal indicator', 'univ'], ['Methyl orange · 3.1–4.4', 'mo'], ['Methyl red · 4.4–6.2', 'mr'], ['Bromothymol blue · 6.0–7.6', 'btb'], ['Phenolphthalein · 8.2–10.0', 'php']];

  Hyper.sim('ab-titration', {
    title: 'Titration: pH against the burette',
    blurb: `25.0 mL of the sample is in the flask; the burette holds the titrant. Drag **Titrant added**, or open the tap and let it run — it slows down near an equivalence point, as a careful chemist would. The pH comes from the exact charge balance at every point.

- Strong acid: pH 7 at equivalence, and one drop (0.05 mL) either side takes it from pH 4 to pH 10. Dilute both solutions tenfold and the same two drops only span pH 5 to 9.
- Weak acid: the flat buffer region, pH = pKa = 4.76 half-way, and an equivalence point near 8.7 (the flask holds sodium acetate). Methyl red changes colour far too early; phenolphthalein is right.
- Weak base: equivalence at about pH 5.3 — now methyl red is the right choice.
- Phosphoric acid shows two jumps, not three: HPO₄²⁻ (pKa 12.35) is too weak an acid to titrate in water. Sodium carbonate gives the two end points used to measure alkalinity in water analysis.`,
    mount(box, kit, params) {
      CHEM = kit.chem;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320 });
      const k0 = params && TKINDS[params.kind] ? params.kind : 'wa';
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Titration', options: Object.keys(TKINDS).map(k => [TKINDS[k].label, k]), value: k0 },
        { id: 'C0', label: 'Sample concentration', min: 0.001, max: 0.5, value: TKINDS[k0].C0, log: true, sig: 2, unit: 'M' },
        { id: 'Ct', label: 'Titrant concentration', min: 0.01, max: 1, value: 0.1, log: true, sig: 2, unit: 'M' },
        { id: 'v', label: 'Titrant added', min: 0, max: VMAX, step: 0.05, value: 0, unit: 'mL', fmt: v => v.toFixed(2) + ' mL' },
        { id: 'ind', type: 'select', label: 'Indicator', options: TIND, value: TKINDS[k0].ind },
        { id: 'whole', type: 'check', label: 'Show the whole curve', value: true },
        { type: 'buttons', items: [{ id: 'tap', label: 'Open the tap', primary: true }, { id: 'refill', label: 'Refill' }] }
      ], (id, val) => {
        if (id === 'kind') { const K = TKINDS[val]; ctl.set('C0', K.C0); ctl.set('ind', K.ind); ctl.set('v', 0); running = false; }
        if (id === 'tap') running = !running && V.v < VMAX;
        if (id === 'refill') { ctl.set('v', 0); running = false; }
        if (id === 'v') running = false;
        const b = ctl.rows.tap; if (b) b.textContent = running ? 'Close the tap' : 'Open the tap';
        if (id !== 'tap' && id !== 'v' && id !== 'ind' && id !== 'whole') curve = null;
        update();
        loop.once();
      });
      const ro = kit.readout(box.side, [['v', 'Titrant added'], ['pH', 'pH'], ['eq', 'Equivalence at'], ['pheq', 'pH at equivalence'], ['half', 'Half-way'], ['ind', 'Indicator']]);
      const plot = kit.plot(graphBox(box), {}, 220);
      const V = ctl.values;
      let running = false, curve = null, dropT = 0, stir = 0;

      const K = () => TKINDS[V.kind] || TKINDS.wa;
      function pHat(v) {
        const T = K(), vol = V0T + v, ca = V.C0 * V0T / vol, ct = V.Ct * v / vol;
        const acids = T.sys ? [{ C: ca, Ka: KaOf(SYSTEMS[T.sys].pKa), z0: SYSTEMS[T.sys].z0 }] : [];
        return solvePH(T.base0 * ca + T.tb * ct, acids);
      }
      const veq1 = () => V.C0 * V0T / V.Ct;
      function build() {
        const pts = [];
        for (let v = 0; v <= VMAX + 1e-9; v += 0.1) pts.push([v, pHat(v)]);
        curve = pts;
      }
      const indOf = () => V.ind === 'univ' ? 'univ' : IND[V.ind] || null;
      const liquid = pH => { const I = indOf(); return I === 'univ' ? rgba(univ(pH), 0.75) : I ? rgba(indColour(I, pH)) : null; };
      function update() {
        const C = kit.colors(), T = K();
        if (!curve) build();
        const v = V.v, pH = pHat(v), e1 = veq1();
        const eqs = [];
        for (let i = 1; i <= T.n; i++) eqs.push(i * e1);
        ro.set('v', v.toFixed(2) + ' mL');
        ro.set('pH', f2(pH));
        ro.set('eq', eqs.map(x => x <= VMAX ? x.toFixed(2) + ' mL' : 'beyond 50 mL').join(', '));
        ro.set('pheq', eqs.map(x => x <= VMAX ? f2(pHat(x)) : '—').join(', '));
        const S = T.sys ? SYSTEMS[T.sys] : null;
        ro.set('half', T.half.length ? T.half.map(([f, j]) => f * e1 <= VMAX ? 'pH ' + f2(pHat(f * e1)) + ' (pKa ' + S.pKa[j].toFixed(2) + ')' : '—').join(', ') : 'no buffer region');
        const I = indOf();
        ro.set('ind', I === 'univ' ? 'universal indicator' : I ? (baseFrac(I, pH) < 0.1 ? I.an : baseFrac(I, pH) > 0.9 ? I.bn : 'changing: ' + I.an + ' → ' + I.bn) : 'none');
        const done = curve.filter(p => p[0] <= v + 1e-9), rest = curve.filter(p => p[0] >= v - 1e-9);
        const series = [{ pts: done.concat([[v, pH]]), color: C.accent, width: 2.6 }];
        if (V.whole) series.push({ pts: rest, color: C.muted, dash: [5, 4], width: 1.4 });
        const marks = [{ x: v, y: pH, color: C.accent, label: 'pH ' + f2(pH) }];
        T.half.forEach(([f]) => { if (f * e1 <= VMAX) marks.push({ x: f * e1, y: pHat(f * e1), color: C.series[2], r: 4, label: '½' }); });
        eqs.forEach(x => { if (x <= VMAX) marks.push({ x, y: pHat(x), color: C.series[1], r: 4.5 }); });
        const hl = [];
        if (I && I !== 'univ') { hl.push({ y: I.lo, color: rgba(I.ca[3] ? I.ca : I.cb, 1), label: I.name + ' ' + I.lo }); hl.push({ y: I.hi, color: rgba(I.cb, 1), label: String(I.hi) }); }
        plot.set({
          x: { label: 'titrant added (mL)', min: 0, max: VMAX }, y: { label: 'pH', min: 0, max: 14 },
          series, marks, hlines: hl,
          vlines: eqs.filter(x => x <= VMAX).map((x, i) => ({ x, label: T.n > 1 ? 'eq. ' + (i + 1) : 'equivalence' }))
        });
      }
      function frame(dt) {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, T = K();
        if (running) {
          const e1 = veq1();
          let near = false;
          for (let i = 1; i <= T.n; i++) if (Math.abs(V.v - i * e1) < 1.2) near = true;
          const nv = Math.min(VMAX, V.v + (near ? 0.3 : 2.5) * dt);
          ctl.set('v', +nv.toFixed(3));
          if (nv >= VMAX) { running = false; const b = ctl.rows.tap; if (b) b.textContent = 'Open the tap'; }
          dropT += dt * (near ? 4 : 14);
          update();
        }
        stir += dt * 6;
        const pH = pHat(V.v);
        // the burette
        const bx = Math.max(70, W * 0.2), tt = 14, tb = H * 0.5, tw = 16;
        kit.label(c, T.ti + ', ' + kit.fmt(V.Ct, 2) + ' M', bx + tw, tt + 4, { size: 12, weight: 600 });
        c.fillStyle = C.surface2 || C.bg; c.fillRect(bx - tw / 2, tt, tw, tb - tt);
        const ly = tt + (V.v / VMAX) * (tb - tt);
        c.fillStyle = 'rgba(150,190,230,0.45)'; c.fillRect(bx - tw / 2, ly, tw, tb - ly);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(bx - tw / 2, tt, tw, tb - tt);
        for (let m = 0; m <= VMAX; m += 5) {
          const y = tt + m / VMAX * (tb - tt);
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(bx - tw / 2, y); c.lineTo(bx - tw / 2 + (m % 10 ? 4 : 7), y); c.stroke();
          if (m % 10 === 0) kit.label(c, String(m), bx - tw / 2 - 5, y, { size: 10, color: C.muted, align: 'right' });
        }
        // tap and tip
        c.fillStyle = running ? C.ok : C.muted; c.fillRect(bx - 12, tb + 2, 24, 6);
        c.strokeStyle = C.muted; c.beginPath(); c.moveTo(bx - 3, tb); c.lineTo(bx - 1.5, tb + 22); c.lineTo(bx + 1.5, tb + 22); c.lineTo(bx + 3, tb); c.stroke();
        // the flask
        const fw = Math.min(150, W * 0.24), fx = bx - fw / 2, fy = tb + 34, fh = Math.max(40, H - fy - 26);
        if (running) {
          const phase = dropT % 1;
          c.fillStyle = 'rgba(120,170,220,0.9)'; c.beginPath(); c.arc(bx, tb + 24 + phase * (fh * 0.5), 2.6, 0, Math.PI * 2); c.fill();
        }
        const lev = (V0T + V.v) / 100;
        const topY = beaker(c, C, fx, fy, fw, fh, lev, liquid(pH));
        c.fillStyle = C.text; c.beginPath(); c.ellipse(fx + fw / 2, fy + fh - 6, 14 * Math.abs(Math.cos(stir)) + 3, 3, 0, 0, Math.PI * 2); c.fill();
        kit.label(c, '25.0 mL ' + T.an + ', ' + kit.fmt(V.C0, 2) + ' M', Math.max(4, fx - 6), H - 9, { size: 11.5, color: C.muted });
        // pH meter with its electrode
        const mx = fx + fw + 14;
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(fx + fw - 22, topY + 30); c.lineTo(fx + fw - 22, fy - 16); c.lineTo(mx + 20, fy - 16); c.lineTo(mx + 20, fy - 4); c.stroke();
        meter(kit, c, C, mx, fy - 4, 92, pH);
        // what is in the flask
        const gx = Math.max(mx + 110, W * 0.55), gw = W - gx - 12, gy = 28, gh = H - gy - 46;
        if (gw > 110) {
          const vol = V0T + V.v, h = pow10(-pH);
          const items = [];
          if (T.sys) {
            const S = SYSTEMS[T.sys], al = fractions(h, KaOf(S.pKa));
            S.sp.forEach((name, j) => items.push([name, al[j] * V.C0 * V0T, C.series[j % 7]]));
          }
          items.push(['H₃O⁺', h * vol, C.bad], ['OH⁻', KW / h * vol, C.accent]);
          const top = Math.max(V.C0 * V0T, V.Ct * VMAX * 0.5, 1e-6);
          kit.label(c, 'in the flask (mmol)', gx, 14, { size: 11.5, color: C.muted });
          const bwid = gw / items.length, fs = bwid < 50 ? 9.5 : 11;
          items.forEach(([name, n, col], i) => {
            const x = gx + i * bwid + bwid * 0.15, w = bwid * 0.7, hh = gh * clamp(n / top, 0, 1);
            c.fillStyle = C.grid; c.fillRect(x, gy, w, gh);
            c.fillStyle = col; c.fillRect(x, gy + gh - hh, w, hh);
            kit.label(c, n < 1e-3 ? sci(n, 1) : kit.fmt(n, 3), x + w / 2, gy + gh - hh - 8, { size: fs - 1, align: 'center' });
            kit.label(c, name, x + w / 2, gy + gh + 13, { size: fs, weight: 600, align: 'center' });
          });
        }
      }
      update();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ 6 · indicators */
  Hyper.sim('ab-indicators', {
    title: 'Indicator colours across the pH scale',
    blurb: `Each strip shows one indicator's colour at every pH; the brackets mark the range over which the eye sees it change, about pK ± 1. Slide the pH to see every indicator's colour at once, and click a strip (or use the menu) to graph that dye's two forms.

- An indicator is a weak acid HIn whose acid and base forms differ in colour; its colour is half-way where pH = pK of the dye.
- Phenolphthalein stays colourless all the way up to pH 8, so it is useless for spotting pH 5 — and perfect for a weak acid titrated with alkali.
- Universal indicator is simply several dyes mixed, so that some strip is changing at every pH.`,
    mount(box, kit, params) {
      CHEM = kit.chem;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 360 });
      const i0 = params && IND[params.ind] ? params.ind : 'btb';
      const ctl = kit.controls(box.side, [
        { id: 'pH', label: 'pH', min: 0, max: 14, step: 0.01, value: 7, fmt: v => f2(v) },
        { id: 'ind', type: 'select', label: 'Indicator for the graph', options: INDICATORS.map(d => [d.name, d.id]), value: i0 },
        { id: 'univ', type: 'check', label: 'Add a universal indicator strip', value: true },
        { id: 'ranges', type: 'check', label: 'Show visual ranges', value: true }
      ], () => { update(); loop.once(); });
      const ro = kit.readout(box.side, [['col', 'Colour now'], ['pk', 'pK of the dye'], ['range', 'Visual range'], ['frac', 'Base form In⁻'], ['ratio', '[In⁻] : [HIn]']]);
      const plot = kit.plot(graphBox(box), {}, 180);
      const V = ctl.values;
      let rowsGeom = null;

      function update() {
        const C = kit.colors(), I = IND[V.ind] || IND.btb, f = baseFrac(I, V.pH);
        ro.set('col', f < 0.1 ? I.an : f > 0.9 ? I.bn : 'between ' + I.an + ' and ' + I.bn);
        ro.set('pk', I.pK.toFixed(2));
        ro.set('range', I.lo.toFixed(1) + ' – ' + I.hi.toFixed(1));
        ro.set('frac', pct(f));
        const r = pow10(V.pH - I.pK);
        ro.set('ratio', r >= 1 ? sci(r, 2) + ' : 1' : '1 : ' + sci(1 / r, 2));
        const pts = [];
        for (let p = 0; p <= 14.0001; p += 0.05) pts.push([p, 100 * baseFrac(I, p)]);
        plot.set({
          x: { label: 'pH', min: 0, max: 14 }, y: { label: '% as the base form In⁻', min: 0, max: 105 },
          series: [{ pts, label: I.name + ': In⁻', color: rgba(I.cb, 1) }, { pts: pts.map(p => [p[0], 100 - p[1]]), label: 'HIn', color: I.ca[3] ? rgba(I.ca, 1) : C.muted }],
          vlines: [{ x: I.lo, label: String(I.lo) }, { x: I.hi, label: String(I.hi) }, { x: V.pH, color: C.warn }],
          hlines: [{ y: 50 }],
          marks: [{ x: V.pH, y: 100 * f, color: C.accent }]
        });
      }
      function frame() {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const list = (V.univ ? [{ id: 'univ', name: 'Universal indicator' }] : []).concat(INDICATORS);
        const nameW = Math.min(170, W * 0.3), x0 = nameW + 18, x1 = W - 58, top = 30;
        const rh = Math.max(16, Math.min(28, (H - top - 26) / list.length));
        const px = p => x0 + p / 14 * (x1 - x0);
        for (let p = 0; p <= 14; p += 1) {
          const X = px(p);
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(X, top - 4); c.lineTo(X, top + list.length * rh); c.stroke();
          if (W > 440 || p % 2 === 0) kit.label(c, String(p), X, top - 12, { size: 10.5, color: C.muted, align: 'center' });
        }
        rowsGeom = { top, rh, list };
        list.forEach((d, i) => {
          const y = top + i * rh + 2, h = rh - 5;
          const sel = d.id === V.ind;
          kit.label(c, d.name, 10, y + h / 2, { size: rh < 20 ? 10.5 : 12, weight: sel ? 700 : 500, color: sel ? C.text : C.text2 || C.text });
          c.fillStyle = C.surface || C.bg; c.fillRect(x0, y, x1 - x0, h);
          for (let k = 0; k < 140; k++) {
            const p = k / 10;
            c.fillStyle = d.id === 'univ' ? rgba(univ(p), 0.9) : rgba(indColour(d, p));
            c.fillRect(px(p), y, (x1 - x0) / 140 + 0.8, h);
          }
          c.strokeStyle = sel ? C.accent : C.border || C.muted; c.lineWidth = sel ? 2 : 1; c.strokeRect(x0, y, x1 - x0, h);
          if (V.ranges && d.id !== 'univ') {
            c.strokeStyle = C.text; c.lineWidth = 1.5;
            [d.lo, d.hi].forEach((p, s) => { const X = px(p); c.beginPath(); c.moveTo(X + (s ? -4 : 4), y - 1); c.lineTo(X, y - 1); c.lineTo(X, y + h + 1); c.lineTo(X + (s ? -4 : 4), y + h + 1); c.stroke(); });
          }
          // the colour at the chosen pH, as a swatch
          const sw = d.id === 'univ' ? rgba(univ(V.pH), 0.9) : rgba(indColour(d, V.pH));
          c.fillStyle = rgba(WATER); c.fillRect(x1 + 12, y, 30, h);
          c.fillStyle = sw; c.fillRect(x1 + 12, y, 30, h);
          c.strokeStyle = C.muted; c.lineWidth = 1; c.strokeRect(x1 + 12, y, 30, h);
        });
        const X = px(V.pH);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(X, top - 4); c.lineTo(X, top + list.length * rh); c.stroke();
        kit.label(c, 'pH ' + f2(V.pH), clamp(X, x0 + 24, x1 - 24), top + list.length * rh + 10, { size: 12, weight: 650, align: 'center', bg: C.bg2 });
      }
      kit.click(st, p => {
        if (!rowsGeom) return;
        const i = Math.floor((p.y - rowsGeom.top) / rowsGeom.rh), d = rowsGeom.list[i];
        if (d && d.id !== 'univ') { ctl.set('ind', d.id); update(); loop.once(); }
      }, p => rowsGeom && p.y > rowsGeom.top && p.y < rowsGeom.top + rowsGeom.list.length * rowsGeom.rh);
      update();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
