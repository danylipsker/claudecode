/* HYPER-CHEMISTRY · sims/electrochemistry.js — simulations for electrochemistry:
 * an oxidation-number trainer, a half-reaction balancer checked by kit.chem.balance,
 * a galvanic cell builder, the Nernst equation, battery chemistries and packs,
 * corrosion with a ferroxyl indicator, electrolysis (Faraday's law live) and
 * electroplating thickness. Standard potentials are the usual 25 °C table values. */
(function () {
  'use strict';

  const F = 96485.33212, RG = 8.314462618, T25 = 298.15, P_ATM = 101325;
  const VM25 = RG * T25 / P_ATM;                      // m³/mol of ideal gas at 25 °C, 1 atm
  const FONT = '"Segoe UI", system-ui, sans-serif';
  const SUBD = '₀₁₂₃₄₅₆₇₈₉', SUPD = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const gcd = (a, b) => { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) { const t = a % b; a = b; b = t; } return a || 1; };
  const lcm = (a, b) => a / gcd(a, b) * b;
  const minus = s => String(s).replace(/-/g, '−');
  const sgn = (v, d) => (v > 1e-9 ? '+' : v < -1e-9 ? '−' : '') + Math.abs(v).toFixed(d);
  const volts = (v, d) => sgn(v, d == null ? 3 : d) + ' V';
  const sig = (v, n) => { if (!Number.isFinite(v)) return '—'; if (v === 0) return '0'; const a = Math.abs(v); return a >= 1e5 || a < 1e-3 ? v.toExponential(n - 1).replace('e+', ' × 10^').replace('e-', ' × 10^−') : String(Number(v.toPrecision(n))); };

  /* 'Cr2O7^2-' -> 'Cr₂O₇²⁻', 'Fe^3+' -> 'Fe³⁺', 'OH-' -> 'OH⁻', 'e-' -> 'e⁻' */
  function pretty(sp) {
    if (sp === 'e-') return 'e⁻';
    let f = String(sp), ch = '';
    let m = /\^(\d*[+-])$/.exec(f);
    if (m) { ch = m[1]; f = f.slice(0, m.index); }
    else if (f.length > 1 && /[+-]$/.test(f)) { ch = f.slice(-1); f = f.slice(0, -1); }   // NO3-, NH4+: a lone sign
    return f.replace(/\d/g, d => SUBD[d]) + ch.replace(/\d/g, d => SUPD[d]).replace('+', '⁺').replace('-', '⁻');
  }
  const term = (n, sp) => (n === 1 ? '' : String(n)) + pretty(sp);
  /* kit.chem.balance text 'MnO4- + 5 Fe^2+ -> ...' -> 'MnO₄⁻ + 5Fe²⁺ → ...' */
  const prettyEq = t => t.split(' -> ').map(side => side.split(' + ').map(x => { const m = /^(\d+) (.+)$/.exec(x); return m ? m[1] + pretty(m[2]) : pretty(x); }).join(' + ')).join(' → ');

  function font(c, size, weight) { c.font = (weight || 500) + ' ' + size + 'px ' + FONT; }
  function txt(c, s, x, y, o) {
    o = o || {};
    font(c, o.size || 13, o.weight);
    c.fillStyle = o.color || '#888';
    c.textAlign = o.align || 'left';
    c.textBaseline = o.baseline || 'middle';
    c.fillText(s, x, y);
    return c.measureText(s).width;
  }
  function textW(c, s, size, weight) { font(c, size, weight); return c.measureText(s).width; }
  function wrapLines(c, s, maxW, size, weight) {
    font(c, size, weight);
    const out = [];
    let cur = '';
    for (const w of String(s).split(' ')) {
      const t = cur ? cur + ' ' + w : w;
      if (cur && c.measureText(t).width > maxW) { out.push(cur); cur = w; } else cur = t;
    }
    if (cur) out.push(cur);
    return out;
  }
  function rrect(c, x, y, w, h, r) {
    r = Math.min(r, w / 2, h / 2);
    c.beginPath();
    c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.arcTo(x + w, y, x + w, y + r, r);
    c.lineTo(x + w, y + h - r); c.arcTo(x + w, y + h, x + w - r, y + h, r);
    c.lineTo(x + r, y + h); c.arcTo(x, y + h, x, y + h - r, r);
    c.lineTo(x, y + r); c.arcTo(x, y, x + r, y, r);
    c.closePath();
  }
  const rgb = hex => { const n = parseInt(String(hex).slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const shade = (hex, k) => 'rgb(' + rgb(hex).map(v => Math.round(clamp(v * k, 0, 255))).join(',') + ')';
  const inkOn = hex => { const [r, g, b] = rgb(hex); return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? '#1a1a1a' : '#ffffff'; };
  function ball(c, x, y, r, hex) {
    const g = c.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r);
    g.addColorStop(0, '#ffffff'); g.addColorStop(0.35, hex); g.addColorStop(1, shade(hex, 0.62));
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = g; c.fill();
    c.lineWidth = 1; c.strokeStyle = 'rgba(0,0,0,.45)'; c.stroke();
  }
  // metal colours for electrodes and coatings (a physical look, not the CPK colours)
  const METAL = { Mg: '#b9bec6', Al: '#c5cad0', Zn: '#a3acb7', Fe: '#868b93', Ni: '#b8b5a6', Sn: '#cfd1ca', Pb: '#7b7f88', Cu: '#c7773a', Ag: '#dadada', Au: '#e2b33b', Pt: '#cdd2d6', C: '#4a4d52', Cr: '#c9d1d8', Cd: '#b0b4b8' };
  const niceUp = v => { const p = Math.pow(10, Math.floor(Math.log10(Math.max(v, 1e-9)))); for (const m of [1, 2, 5, 10]) if (m * p >= v) return m * p; return 10 * p; };

  /* ================================================================ oxidation numbers */
  const OXRULE = {
    el: 'An element: every atom in it is 0.',
    ion: 'A monatomic ion: its oxidation number is its charge.',
    F: 'Fluorine is always −1.',
    g1: 'Group 1 metals are +1 in their compounds.',
    g2: 'Group 2 metals are +2 in their compounds.',
    Al: 'Aluminium is +3 in its compounds.',
    H: 'Hydrogen bonded to non-metals is +1.',
    O: 'Oxygen is −2 in most compounds.',
    sum: 'The last element follows from the sum rule: all oxidation numbers add up to the charge.',
    perox: 'Hydrogen is fixed at +1, so the sum rule leaves −1 for each oxygen: a peroxide, with an O–O bond.',
    hydride: 'The metal is fixed, so the sum rule leaves −1 for hydrogen: a metal hydride.',
    sup: 'Potassium is fixed at +1, so each oxygen is −½: a superoxide, with the O₂⁻ ion.',
    OF: 'Fluorine outranks oxygen, so oxygen comes out at +2 from the sum rule.'
  };
  // formula, name, charge, atoms in the order the rules settle them: [symbol, count, oxidation number, rule, label]
  const OXSP = [
    ['H2O', 'water', 0, [['H', 2, 1, 'H'], ['O', 1, -2, 'O']]],
    ['H2O2', 'hydrogen peroxide', 0, [['H', 2, 1, 'H'], ['O', 2, -1, 'perox']]],
    ['O2', 'oxygen gas', 0, [['O', 2, 0, 'el']]],
    ['Fe^3+', 'iron(III) ion', 3, [['Fe', 1, 3, 'ion']]],
    ['NaCl', 'sodium chloride', 0, [['Na', 1, 1, 'g1'], ['Cl', 1, -1, 'sum']]],
    ['NaH', 'sodium hydride', 0, [['Na', 1, 1, 'g1'], ['H', 1, -1, 'hydride']]],
    ['MnO4-', 'permanganate ion', -1, [['O', 4, -2, 'O'], ['Mn', 1, 7, 'sum']]],
    ['K2Cr2O7', 'potassium dichromate', 0, [['K', 2, 1, 'g1'], ['O', 7, -2, 'O'], ['Cr', 2, 6, 'sum']]],
    ['CrO4^2-', 'chromate ion', -2, [['O', 4, -2, 'O'], ['Cr', 1, 6, 'sum']]],
    ['H2SO4', 'sulfuric acid', 0, [['H', 2, 1, 'H'], ['O', 4, -2, 'O'], ['S', 1, 6, 'sum']]],
    ['SO2', 'sulfur dioxide', 0, [['O', 2, -2, 'O'], ['S', 1, 4, 'sum']]],
    ['H2S', 'hydrogen sulfide', 0, [['H', 2, 1, 'H'], ['S', 1, -2, 'sum']]],
    ['S2O3^2-', 'thiosulfate ion (an average)', -2, [['O', 3, -2, 'O'], ['S', 2, 2, 'sum']]],
    ['S4O6^2-', 'tetrathionate ion (an average)', -2, [['O', 6, -2, 'O'], ['S', 4, 2.5, 'sum', '+2.5']]],
    ['NH3', 'ammonia', 0, [['H', 3, 1, 'H'], ['N', 1, -3, 'sum']]],
    ['NH4+', 'ammonium ion', 1, [['H', 4, 1, 'H'], ['N', 1, -3, 'sum']]],
    ['NO3-', 'nitrate ion', -1, [['O', 3, -2, 'O'], ['N', 1, 5, 'sum']]],
    ['NO2', 'nitrogen dioxide', 0, [['O', 2, -2, 'O'], ['N', 1, 4, 'sum']]],
    ['CH4', 'methane', 0, [['H', 4, 1, 'H'], ['C', 1, -4, 'sum']]],
    ['CH3OH', 'methanol', 0, [['H', 4, 1, 'H'], ['O', 1, -2, 'O'], ['C', 1, -2, 'sum']]],
    ['HCHO', 'methanal (formaldehyde)', 0, [['H', 2, 1, 'H'], ['O', 1, -2, 'O'], ['C', 1, 0, 'sum']]],
    ['HCOOH', 'methanoic (formic) acid', 0, [['H', 2, 1, 'H'], ['O', 2, -2, 'O'], ['C', 1, 2, 'sum']]],
    ['CO2', 'carbon dioxide', 0, [['O', 2, -2, 'O'], ['C', 1, 4, 'sum']]],
    ['C2O4^2-', 'oxalate ion', -2, [['O', 4, -2, 'O'], ['C', 2, 3, 'sum']]],
    ['Fe2O3', 'iron(III) oxide', 0, [['O', 3, -2, 'O'], ['Fe', 2, 3, 'sum']]],
    ['Fe3O4', 'magnetite (an average)', 0, [['O', 4, -2, 'O'], ['Fe', 3, 8 / 3, 'sum', '+8/3']]],
    ['KO2', 'potassium superoxide', 0, [['K', 1, 1, 'g1'], ['O', 2, -0.5, 'sup', '−½']]],
    ['OF2', 'oxygen difluoride', 0, [['F', 2, -1, 'F'], ['O', 1, 2, 'OF']]],
    ['ClO-', 'hypochlorite ion', -1, [['O', 1, -2, 'O'], ['Cl', 1, 1, 'sum']]],
    ['ClO4-', 'perchlorate ion', -1, [['O', 4, -2, 'O'], ['Cl', 1, 7, 'sum']]],
    ['LiAlH4', 'lithium aluminium hydride', 0, [['Li', 1, 1, 'g1'], ['Al', 1, 3, 'Al'], ['H', 4, -1, 'hydride']]],
    ['Cu2O', 'copper(I) oxide', 0, [['O', 1, -2, 'O'], ['Cu', 2, 1, 'sum']]],
    ['OsO4', 'osmium tetroxide', 0, [['O', 4, -2, 'O'], ['Os', 1, 8, 'sum']]]
  ];
  const oxLabel = a => a[4] || (a[2] === 0 ? '0' : sgn(a[2], 0));

  Hyper.sim('ec-oxnum', {
    title: 'Oxidation-number trainer',
    blurb: `Choose a species and press **Next rule**. The rules settle the atoms one element at a time, in the order you would use them by hand — fixed values first (F, group 1 and 2 metals, H, O), the last element from the sum rule. Each element takes its place on the number line, and the ledger checks that everything adds up to the charge.

- Step through methane, methanol, methanal, methanoic acid and carbon dioxide: carbon climbs from −4 to +4 as it is oxidised.
- Hydrogen peroxide, the hydrides and potassium superoxide break the habits "O is −2" and "H is +1" — watch which rule gives way.
- Magnetite and tetrathionate give fractions: averages over atoms that are not alike.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const i0 = params && params.sp ? OXSP.findIndex(s => s[0] === params.sp) : -1;
      const ctl = kit.controls(box.side, [
        { id: 'sp', type: 'select', label: 'Species', options: OXSP.map((s, i) => [pretty(s[0]) + ' — ' + s[1], i]), value: i0 >= 0 ? i0 : 6 },
        { type: 'buttons', items: [{ id: 'next', label: 'Next rule', primary: true }, { id: 'all', label: 'Show all' }, { id: 'hide', label: 'Hide' }] }
      ], id => {
        const n = OXSP[V.sp][3].length;
        if (id === 'sp' || id === 'hide') shown = 0;
        else if (id === 'next') shown = shown >= n ? 0 : shown + 1;
        else if (id === 'all') shown = n;
        pulse = 0;
        describe();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['name', 'Species'], ['q', 'Charge'], ['rule', 'Rule used'], ['sum', 'Sum of oxidation numbers']]);
      let shown = 0, pulse = 0;

      const total = (at, k) => at.slice(0, k).reduce((a, x) => a + x[1] * x[2], 0);
      function describe() {
        const s = OXSP[V.sp], at = s[3];
        ro.set('name', s[1]);
        ro.set('q', s[2] === 0 ? '0 (neutral)' : sgn(s[2], 0));
        ro.set('rule', shown ? OXRULE[at[shown - 1][3]] : 'press Next rule');
        const sum = Math.round(total(at, shown) * 1000) / 1000;
        ro.set('sum', !shown ? '—' : shown === at.length ? sgn(sum, 0) + ' = charge ✓' : sgn(sum, 2).replace(/\.00$/, '') + ' so far');
      }

      function frame(dt) {
        pulse += dt || 0;
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const s = OXSP[V.sp], at = s[3], n = at.length;
        kit.label(c, pretty(s[0]), W / 2, 30, { size: 30, weight: 700, align: 'center' });
        kit.label(c, s[1] + (s[2] ? ' · charge ' + sgn(s[2], 0) : ' · neutral'), W / 2, 58, { size: 13, color: C.muted, align: 'center' });
        const colOf = v => v > 1e-9 ? C.warn : v < -1e-9 ? C.accent : C.muted;
        // one card per element
        const cy = H * 0.36, r = clamp(W / (n + 1) / 4.2, 16, 28);
        at.forEach((a, k) => {
          const x = W * (k + 1) / (n + 1);
          const e = kit.chem.el(a[0]);
          ball(c, x, cy, r, e.color);
          txt(c, a[0], x, cy + 1, { size: r * 0.78, weight: 700, align: 'center', color: inkOn(e.color) });
          kit.label(c, '× ' + a[1], x, cy + r + 14, { size: 13, color: C.muted, align: 'center' });
          const by = cy - r - 22;
          if (k < shown) {
            const lab = oxLabel(a), w = textW(c, lab, 17, 700) + 16;
            rrect(c, x - w / 2, by - 13, w, 26, 7);
            c.fillStyle = C.surface; c.fill();
            c.lineWidth = k === shown - 1 ? 2 + Math.max(0, 1.5 - pulse) * 2 : 1.5;
            c.strokeStyle = colOf(a[2]); c.stroke();
            txt(c, lab, x, by, { size: 17, weight: 700, align: 'center', color: colOf(a[2]) });
          } else kit.label(c, '?', x, by, { size: 18, color: C.faint, align: 'center' });
        });
        // the rule just used
        if (shown) {
          const lines = wrapLines(c, OXRULE[at[shown - 1][3]], W * 0.86, 13);
          lines.slice(0, 2).forEach((l, i) => kit.label(c, l, W / 2, H * 0.55 + i * 17, { size: 13, color: C.text, align: 'center' }));
        } else kit.label(c, 'Press Next rule to apply the rules one at a time.', W / 2, H * 0.55, { size: 13, color: C.muted, align: 'center' });
        // the ledger
        const parts = at.map((a, k) => a[1] + ' × (' + (k < shown ? oxLabel(a) : '?') + ')');
        const done = shown === n;
        const ledger = parts.join(' + ') + ' = ' + (done ? sgn(s[2], 0) : '?') + (done ? '   ✓ equals the charge' : '');
        kit.label(c, ledger, W / 2, H * 0.68, { size: 14, weight: 600, align: 'center', color: done ? C.ok : C.text });
        // the number line, −4 … +8
        const lx0 = W * 0.07, lx1 = W * 0.93, ly = H * 0.86;
        const X = v => lx0 + (v + 4) / 12 * (lx1 - lx0);
        c.strokeStyle = C.muted; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(lx0, ly); c.lineTo(lx1, ly); c.stroke();
        for (let v = -4; v <= 8; v++) {
          c.beginPath(); c.moveTo(X(v), ly - 4); c.lineTo(X(v), ly + 4); c.stroke();
          kit.label(c, v > 0 ? '+' + v : v < 0 ? '−' + (-v) : '0', X(v), ly + 15, { size: 11, color: C.muted, align: 'center' });
        }
        kit.label(c, 'reduced ←', lx0, ly - 34, { size: 11, color: C.faint });
        kit.label(c, '→ oxidised', lx1, ly - 34, { size: 11, color: C.faint, align: 'right' });
        const used = {};
        at.slice(0, shown).forEach(a => {
          const key = a[2].toFixed(3), lvl = used[key] = (used[key] || 0) + 1;
          const x = X(clamp(a[2], -4, 8)), y = ly - 10 - (lvl - 1) * 18;
          ball(c, x, y, 7, kit.chem.el(a[0]).color);
          kit.label(c, a[0], x + 10, y, { size: 11, weight: 600, color: C.text });
        });
      }
      describe();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ half-reaction balancer */
  // lead: 'red' writes the oxidising agent first in the final equation, as the name does
  const HB = [
    { name: 'Permanganate + iron(II), in acid', medium: 'acid', ox: ['Fe^2+', 'Fe^3+'], red: ['MnO4-', 'Mn^2+'], lead: 'red' },
    { name: 'Dichromate + iron(II), in acid', medium: 'acid', ox: ['Fe^2+', 'Fe^3+'], red: ['Cr2O7^2-', 'Cr^3+'], lead: 'red' },
    { name: 'Permanganate + oxalate, in acid', medium: 'acid', ox: ['C2O4^2-', 'CO2'], red: ['MnO4-', 'Mn^2+'], lead: 'red' },
    { name: 'Copper + dilute nitric acid', medium: 'acid', ox: ['Cu', 'Cu^2+'], red: ['NO3-', 'NO'] },
    { name: 'Copper + concentrated nitric acid', medium: 'acid', ox: ['Cu', 'Cu^2+'], red: ['NO3-', 'NO2'] },
    { name: 'Iodate + iodide, in acid', medium: 'acid', ox: ['I-', 'I2'], red: ['IO3-', 'I2'], lead: 'red' },
    { name: 'Permanganate + sulfite, in base', medium: 'base', ox: ['SO3^2-', 'SO4^2-'], red: ['MnO4-', 'MnO2'], lead: 'red' },
    { name: 'Chromium(III) hydroxide + hypochlorite, in base', medium: 'base', ox: ['Cr(OH)3', 'CrO4^2-'], red: ['ClO-', 'Cl-'] },
    { name: 'Chlorine in hot alkali (disproportionation)', medium: 'base', ox: ['Cl2', 'ClO3-'], red: ['Cl2', 'Cl-'] }
  ];

  function makeBalancer(chem) {
    const cache = {};
    const info = sp => cache[sp] || (cache[sp] = sp === 'e-' ? { atoms: {}, charge: -1 } : chem.parse(sp));
    const cnt = (side, el) => side.reduce((s, x) => s + x[1] * (info(x[0]).atoms[el] || 0), 0);
    const chg = side => side.reduce((s, x) => s + x[1] * info(x[0]).charge, 0);
    const add = (side, sp, n) => { if (!n) return; const t = side.find(x => x[0] === sp); if (t) t[1] += n; else side.push([sp, n]); };
    const clean = h => { h.L = h.L.filter(x => x[1] > 1e-9); h.R = h.R.filter(x => x[1] > 1e-9); };
    const copy = h => ({ L: h.L.map(x => x.slice()), R: h.R.map(x => x.slice()) });
    const cancel = (h, sp) => {
      const a = h.L.find(x => x[0] === sp), b = h.R.find(x => x[0] === sp);
      if (a && b) { const m = Math.min(a[1], b[1]); a[1] -= m; b[1] -= m; clean(h); }
    };
    const keyEl = sp => Object.keys(info(sp).atoms).find(e => e !== 'H' && e !== 'O') || 'O';
    function oxNum(sp, el) {
      const p = info(sp);
      let rest = 0;
      for (const e of Object.keys(p.atoms)) if (e !== el) rest += p.atoms[e] * (e === 'O' ? -2 : e === 'H' ? 1 : 0);
      return (p.charge - rest) / p.atoms[el];
    }
    function half(A, B, medium) {
      const X = keyEl(A);
      const h = { L: [[A, 1]], R: [[B, 1]] };
      const snaps = [copy(h)];
      const a0 = info(A).atoms[X], b0 = info(B).atoms[X], l = lcm(a0, b0);
      h.L[0][1] = l / a0; h.R[0][1] = l / b0;
      snaps.push(copy(h));
      const dO = cnt(h.L, 'O') - cnt(h.R, 'O');
      if (dO > 0) add(h.R, 'H2O', dO); else if (dO < 0) add(h.L, 'H2O', -dO);
      snaps.push(copy(h));
      const dH = cnt(h.L, 'H') - cnt(h.R, 'H');
      if (dH > 0) add(h.R, 'H+', dH); else if (dH < 0) add(h.L, 'H+', -dH);
      snaps.push(copy(h));
      const dq = chg(h.L) - chg(h.R);
      if (dq > 0) add(h.L, 'e-', dq); else if (dq < 0) add(h.R, 'e-', -dq);
      snaps.push(copy(h));
      if (medium === 'base') {
        const hp = (h.L.find(x => x[0] === 'H+') || h.R.find(x => x[0] === 'H+') || [0, 0])[1];
        if (hp) { add(h.L, 'OH-', hp); add(h.R, 'OH-', hp); }
        snaps.push(copy(h));
        for (const s of ['L', 'R']) {
          const t = h[s].find(x => x[0] === 'H+');
          if (t) { const n = t[1]; t[1] = 0; add(h[s], 'OH-', -n); add(h[s], 'H2O', n); }
        }
        clean(h); cancel(h, 'H2O'); cancel(h, 'OH-');
        snaps.push(copy(h));
      }
      return { snaps, h, ne: Math.abs(dq), X, from: oxNum(A, X), to: oxNum(B, X) };
    }
    function build(rx) {
      const o = half(rx.ox[0], rx.ox[1], rx.medium), r = half(rx.red[0], rx.red[1], rx.medium);
      const l = lcm(o.ne, r.ne), fo = l / o.ne, fr = l / r.ne;
      const mul = (h, f) => ({ L: h.L.map(x => [x[0], x[1] * f]), R: h.R.map(x => [x[0], x[1] * f]) });
      const O = mul(o.h, fo), Rd = mul(r.h, fr);
      const tot = { L: [], R: [] };
      O.L.concat(Rd.L).forEach(x => add(tot.L, x[0], x[1]));
      O.R.concat(Rd.R).forEach(x => add(tot.R, x[0], x[1]));
      const summed = copy(tot);
      for (const sp of tot.L.map(x => x[0])) cancel(tot, sp);
      const g = tot.L.concat(tot.R).reduce((a, x) => gcd(a, x[1]), 0) || 1;
      tot.L.forEach(x => { x[1] /= g; }); tot.R.forEach(x => { x[1] /= g; });
      const main = rx.lead === 'red' ? [rx.red[0], rx.ox[0], rx.red[1], rx.ox[1]] : [rx.ox[0], rx.red[0], rx.ox[1], rx.red[1]];
      const rank = sp => { const i = main.indexOf(sp); return i >= 0 ? i : ({ H2O: 10, 'H+': 11, 'OH-': 12, 'e-': 20 }[sp] || 15); };
      const sorted = h => ({ L: h.L.slice().sort((a, b) => rank(a[0]) - rank(b[0])), R: h.R.slice().sort((a, b) => rank(a[0]) - rank(b[0])) });
      // the independent check: balance the same species algebraically
      const fin = sorted(tot);
      let check = null;
      try {
        const res = chem.balance(fin.L.map(x => x[0]).join(' + ') + ' -> ' + fin.R.map(x => x[0]).join(' + '));
        if (res && res.ok) {
          const ours = fin.L.concat(fin.R).map(x => x[1]);
          const k = res.coefficients[0] / ours[0];
          check = { ok: res.coefficients.every((v, i) => Math.abs(v - k * ours[i]) < 1e-9), text: prettyEq(res.text) };
        } else check = { ok: false, text: 'no unique balance' };
      } catch (e) { check = { ok: false, text: 'could not check' }; }
      const skel = { L: [], R: [] };
      main.slice(0, 2).forEach(sp => add(skel.L, sp, 1));
      main.slice(2).forEach(sp => add(skel.R, sp, 1));
      skel.L.forEach(x => { x[1] = 1; }); skel.R.forEach(x => { x[1] = 1; });
      const on = v => sgn(v, Number.isInteger(Math.round(v * 1000) / 1000) ? 0 : 2);
      const steps = [];
      steps.push({ t: 'The unbalanced reaction', d: 'Neither the atoms nor the charges balance yet, and nothing says how many electrons pass. Split it into an oxidation and a reduction.', all: skel });
      steps.push({ t: 'Split into two half-reactions', d: o.X + ' goes from ' + on(o.from) + ' to ' + on(o.to) + ': oxidised. ' + r.X + ' goes from ' + on(r.from) + ' to ' + on(r.to) + ': reduced. Each half gets its own equation.', k: 0 });
      steps.push({ t: 'Balance the atoms other than O and H', d: 'Put coefficients in front so that the element whose oxidation number changes is balanced.', k: 1 });
      steps.push({ t: 'Balance oxygen by adding H₂O', d: 'Add water molecules to whichever side is short of oxygen.', k: 2 });
      steps.push({ t: 'Balance hydrogen by adding H⁺', d: 'Add H⁺ ions to whichever side is short of hydrogen.', k: 3 });
      steps.push({ t: 'Balance charge by adding electrons', d: 'Add electrons to the side with the more positive total charge until both sides match. Their number equals the change in oxidation number times the atoms that change.', k: 4 });
      if (rx.medium === 'base') {
        steps.push({ t: 'In base: add OH⁻ to both sides', d: 'A basic solution has almost no H⁺, so add as many OH⁻ to both sides as there are H⁺ ions.', k: 5 });
        steps.push({ t: 'Make water and cancel it', d: 'On the side with both, each H⁺ + OH⁻ is one water molecule. Then cancel water (and OH⁻) that appears on both sides.', k: 6 });
      }
      steps.push({ t: 'Make the electrons equal', d: 'The oxidation gives ' + o.ne + ' electron' + (o.ne > 1 ? 's' : '') + ' and the reduction takes ' + r.ne + '. Multiply them up to the least common multiple, ' + l + ': oxidation × ' + fo + ', reduction × ' + fr + '.', mult: true });
      steps.push({ t: 'Add the halves and cancel', d: 'The electrons cancel exactly. Species on both sides cancel too' + (g > 1 ? ', and every coefficient is divided by ' + g : '') + '. Check the atoms and the charge.', all: fin, summed: sorted(summed), last: true });
      return { steps, o, r, O: sorted(O), Rd: sorted(Rd), l, fo, fr, check, sortH: sorted, cnt, chg };
    }
    return { build, info };
  }

  Hyper.sim('ec-halfbal', {
    title: 'Balancing redox equations, step by step',
    blurb: `Walk through the half-reaction method one step at a time. Each step shows the two half-reactions, with whatever was just added **highlighted**, and under each a tally of every element and of the charge on the two sides (✓ when they match). At the end the result is checked independently by solving the balance as a system of linear equations (kit.chem.balance).

- Watch how many H⁺ the permanganate half needs, and why: its four oxygens must end up in water.
- Try the basic examples: after the acid-style balance, OH⁻ is added to both sides and turns H⁺ into water.
- The chlorine example is a disproportionation: the same Cl₂ appears in both halves.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.64, minH: 340 });
      const B = makeBalancer(kit.chem);
      const ctl = kit.controls(box.side, [
        { id: 'rx', type: 'select', label: 'Reaction', options: HB.map((r, i) => [r.name, i]), value: params && params.rx != null ? +params.rx : 0 },
        { id: 'tally', type: 'check', label: 'Show the atom and charge tally', value: true },
        { type: 'buttons', items: [{ id: 'next', label: 'Next step', primary: true }, { id: 'back', label: 'Back' }, { id: 'restart', label: 'Start again' }] }
      ], id => {
        if (id === 'rx') { plan = B.build(HB[V.rx] || HB[0]); k = 0; }
        else if (id === 'next') k = Math.min(plan.steps.length - 1, k + 1);
        else if (id === 'back') k = Math.max(0, k - 1);
        else if (id === 'restart') k = 0;
        fresh = 0;
        describe();
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eo', 'Oxidation: electrons lost'], ['er', 'Reduction: electrons gained'], ['lcm', 'Least common multiple'], ['res', 'Result'], ['chk', 'kit.chem.balance']]);
      let plan = B.build(HB[V.rx] || HB[0]), k = 0, fresh = 0;

      function describe() {
        const s = plan.steps[k];
        const reached = k >= 5;
        ro.set('eo', reached ? String(plan.o.ne) : '—');
        ro.set('er', reached ? String(plan.r.ne) : '—');
        ro.set('lcm', s.mult || s.last ? plan.l + ' (× ' + plan.fo + ' and × ' + plan.fr + ')' : '—');
        const eq = h => h.L.map(x => term(x[1], x[0])).join(' + ') + ' → ' + h.R.map(x => term(x[1], x[0])).join(' + ');
        ro.set('res', s.last ? eq(s.all) : '—');
        ro.set('chk', s.last ? (plan.check.ok ? 'agrees ✓' : plan.check.text) : '—');
      }

      // draws a half or whole equation, highlighting species that are new or changed since `prev`
      function drawEq(c, h, prev, x, y, maxW, C, size0) {
        const parts = [];
        const side = (list, pl) => list.forEach((p, i) => {
          if (i) parts.push({ t: ' + ' });
          const old = pl && pl.find(q => q[0] === p[0]);
          parts.push({ t: term(p[1], p[0]), hot: !!pl && (!old || Math.abs(old[1] - p[1]) > 1e-9), e: p[0] === 'e-' });
        });
        side(h.L, prev && prev.L);
        parts.push({ t: '  →  ' });
        side(h.R, prev && prev.R);
        let size = size0 || 18;
        const width = () => parts.reduce((a, p) => a + textW(c, p.t, size, 600), 0);
        while (size > 10 && width() > maxW) size -= 1;
        let cx = x;
        for (const p of parts) {
          const col = p.hot ? C.warn : p.e ? C.accent : C.text;
          if (p.hot) {
            const w = textW(c, p.t, size, 600);
            c.fillStyle = 'rgba(224,160,48,' + (0.1 + 0.18 * Math.max(0, 1 - fresh)) + ')';
            rrect(c, cx - 3, y - size * 0.72, w + 6, size * 1.44, 5); c.fill();
          }
          cx += txt(c, p.t, cx, y, { size, weight: 600, color: col });
        }
      }
      function drawTally(c, h, x, y, C) {
        const els = [];
        h.L.concat(h.R).forEach(p => Object.keys(B.info(p[0]).atoms).forEach(e => { if (!els.includes(e)) els.push(e); }));
        els.sort((a, b) => (a === 'H') - (b === 'H') || (a === 'O') - (b === 'O'));
        let cx = x;
        const item = (lab, a, b, f) => {
          const ok = Math.abs(a - b) < 1e-9;
          cx += txt(c, lab + ' ' + f(a) + ' | ' + f(b) + (ok ? ' ✓' : ' ✗'), cx, y, { size: 12, weight: 600, color: ok ? C.ok : C.bad }) + 16;
        };
        els.forEach(e => item(e, plan.cnt(h.L, e), plan.cnt(h.R, e), String));
        item('charge', plan.chg(h.L), plan.chg(h.R), v => sgn(v, 0) || '0');
      }

      function frame(dt) {
        fresh += dt || 0;
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, x0 = 18, mw = W - 36;
        const rx = HB[V.rx] || HB[0], s = plan.steps[k];
        kit.label(c, rx.name, x0, 20, { size: 13, color: C.muted });
        kit.label(c, 'Step ' + (k + 1) + ' of ' + plan.steps.length + ': ' + s.t, x0, 44, { size: 16, weight: 650 });
        const lines = wrapLines(c, s.d, mw, 13);
        lines.slice(0, 3).forEach((l, i) => kit.label(c, l, x0, 68 + i * 17, { size: 13, color: C.text }));
        let y = 68 + Math.min(3, lines.length) * 17 + 26;
        const gap = V.tally ? 62 : 44;
        if (s.all) {
          if (s.summed) {
            kit.label(c, 'Sum of the two halves, before cancelling:', x0, y, { size: 12, color: C.muted });
            drawEq(c, s.summed, null, x0, y + 22, mw, C, 15);
            y += 58;
          }
          kit.label(c, s.last ? 'Balanced equation' : 'Skeleton', x0, y, { size: 12, color: C.muted });
          drawEq(c, s.all, null, x0, y + 26, mw, C, 20);
          if (V.tally) drawTally(c, s.all, x0, y + 56, C);
          if (s.last) kit.label(c, plan.check.ok ? 'Checked: solving the same species as linear equations gives the same coefficients ✓' : 'Check: ' + plan.check.text, x0, y + (V.tally ? 84 : 58), { size: 12.5, color: plan.check.ok ? C.ok : C.bad });
        } else {
          const hs = s.mult ? [[plan.O, plan.o.snaps[plan.o.snaps.length - 1], 'Oxidation × ' + plan.fo], [plan.Rd, plan.r.snaps[plan.r.snaps.length - 1], 'Reduction × ' + plan.fr]]
            : [[plan.sortH(plan.o.snaps[s.k]), s.k ? plan.sortH(plan.o.snaps[s.k - 1]) : null, 'Oxidation'], [plan.sortH(plan.r.snaps[s.k]), s.k ? plan.sortH(plan.r.snaps[s.k - 1]) : null, 'Reduction']];
          hs.forEach(([h, prev, lab]) => {
            kit.label(c, lab, x0, y, { size: 12, color: C.muted });
            drawEq(c, h, s.mult ? null : prev, x0, y + 24, mw, C, 19);
            if (V.tally) drawTally(c, h, x0, y + 50, C);
            y += gap + 26;
          });
        }
        kit.label(c, rx.medium === 'acid' ? 'acidic solution: H⁺ and H₂O available' : 'basic solution: OH⁻ and H₂O available', W - 16, H - 14, { size: 11.5, color: C.faint, align: 'right' });
      }
      describe();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ galvanic cell builder */
  const COUPLES = [
    { id: 'Mg', ion: 'Mg^2+', n: 2, E0: -2.37 },
    { id: 'Al', ion: 'Al^3+', n: 3, E0: -1.66 },
    { id: 'Zn', ion: 'Zn^2+', n: 2, E0: -0.76 },
    { id: 'Fe', ion: 'Fe^2+', n: 2, E0: -0.44 },
    { id: 'Ni', ion: 'Ni^2+', n: 2, E0: -0.26 },
    { id: 'Sn', ion: 'Sn^2+', n: 2, E0: -0.14 },
    { id: 'Pb', ion: 'Pb^2+', n: 2, E0: -0.13 },
    { id: 'H2', ion: 'H+', n: 1, E0: 0, gas: true },
    { id: 'Cu', ion: 'Cu^2+', n: 2, E0: 0.34 },
    { id: 'Ag', ion: 'Ag+', n: 1, E0: 0.80 },
    { id: 'Au', ion: 'Au^3+', n: 3, E0: 1.50 }
  ];
  const coupleById = id => COUPLES.find(k => k.id === id) || COUPLES[2];
  const coupleName = k => pretty(k.ion) + '/' + pretty(k.id);
  const TINT = { 'Cu^2+': [40, 120, 230], 'Ni^2+': [60, 180, 90], 'Fe^2+': [130, 190, 120], 'Au^3+': [230, 190, 40] };
  const halfEq = (k, ox) => {
    const e = k.n > 1 ? k.n + 'e⁻' : 'e⁻';
    const red = k.gas ? '½H₂' : pretty(k.id);
    return ox ? red + ' → ' + pretty(k.ion) + ' + ' + e : pretty(k.ion) + ' + ' + e + ' → ' + red;
  };

  Hyper.sim('ec-galvanic', {
    title: 'Build a galvanic cell',
    blurb: `Choose the two half-cells. The one with the lower potential becomes the **anode** (oxidation, negative) and the other the **cathode**; the voltmeter reads $E_\\text{cell} = E_\\text{cathode} - E_\\text{anode}$, corrected for the ion concentrations by the Nernst equation. Connect the load and time runs fast: electrons move through the wire, ions through the salt bridge (K⁺ towards the cathode, NO₃⁻ towards the anode), the anode thins and the cathode grows.

- Zinc against copper is the Daniell cell, 1.10 V. Swap the sides: the roles follow the potentials, not the positions.
- Dilute the cathode solution tenfold and the voltage drops by about 30 mV (for a 2+ ion); let the cell run and watch the voltage sag as the cathode ions are used up.
- Put the same metal on both sides with different concentrations: a concentration cell.
- Magnesium and aluminium are listed for their standard potentials; in real water cells their oxide films and their reaction with water spoil the ideal voltage.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const S = kit.schem;
      const VOL = 0.1, M0 = 20, RINT = 20;         // 100 mL per beaker, 20 g electrodes, 20 Ω of bridge and solution
      const opts = COUPLES.map(k => [coupleName(k) + '  (' + volts(k.E0, 2) + ')', k.id]);
      const pa = params && params.a && COUPLES.some(k => k.id === params.a) ? params.a : 'Zn';
      const pc = params && params.c && COUPLES.some(k => k.id === params.c) ? params.c : 'Cu';
      const ctl = kit.controls(box.side, [
        { id: 'L', type: 'select', label: 'Left half-cell', options: opts, value: pa },
        { id: 'cL', label: 'Left ion concentration', min: 0.001, max: 2, value: 1, log: true, unit: 'M', sig: 2 },
        { id: 'R', type: 'select', label: 'Right half-cell', options: opts, value: pc },
        { id: 'cR', label: 'Right ion concentration', min: 0.001, max: 2, value: 1, log: true, unit: 'M', sig: 2 },
        { id: 'load', type: 'check', label: 'Connect the load resistor', value: false },
        { id: 'rl', label: 'Load resistance', min: 5, max: 1000, value: 50, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'speed', type: 'select', label: 'Time runs', options: [['1 s = 1 minute', 60], ['1 s = 1 hour', 3600], ['1 s = 10 hours', 36000]], value: 3600 },
        { type: 'buttons', items: [{ id: 'reset', label: 'Fresh cell', primary: true }] }
      ], id => {
        if (id === 'L' || id === 'R' || id === 'reset') reset();
        else if (id === 'cL') cell.nL = V.cL * VOL;
        else if (id === 'cR') cell.nR = V.cR * VOL;
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['an', 'Anode (−): oxidation'], ['ca', 'Cathode (+): reduction'], ['eq', 'Cell reaction'], ['e0', 'E°cell (standard)'], ['e', 'E (Nernst, now)'], ['v', 'Voltmeter'], ['i', 'Current'], ['dg', 'ΔG° = −nFE°'], ['k', 'log₁₀ K'], ['t', 'Time in the cell']]);
      let cell, phase = 0, bubbles = [], movers = [], dots = [], bridge = [], note = '';

      function reset() {
        cell = { nL: V.cL * VOL, nR: V.cR * VOL, mL: M0, mR: M0, t: 0 };
        bubbles = []; movers = [];
        dots = [0, 1].map(() => Array.from({ length: 18 }, () => [Math.random(), Math.random(), Math.random() * 6.28]));
        bridge = Array.from({ length: 16 }, (_, i) => ({ s: (i + 0.5) / 16, cat: i % 2 === 0 }));
      }
      const halfE = (k, conc) => k.E0 + RG * T25 / (k.n * F) * Math.log(Math.max(conc, 1e-15));
      const rxCache = {};
      function reaction(kA, kC) {
        const key = kA.id + '>' + kC.id;
        if (rxCache[key]) return rxCache[key];
        let out = { text: '—', n: lcm(kA.n, kC.n) };
        if (kA.id === kC.id) out = { text: pretty(kA.ion) + ' (concentrated) → ' + pretty(kA.ion) + ' (dilute)', n: kA.n };
        else {
          try {
            const b = kit.chem.balance(kA.id + ' + ' + kC.ion + ' -> ' + kA.ion + ' + ' + kC.id);
            if (b && b.ok) out = { text: prettyEq(b.text), n: b.coefficients[1] * kC.n };
          } catch (e) { /* keep the fallback */ }
        }
        return (rxCache[key] = out);
      }

      let I = 0, Vt = 0, Ecell = 0, leftAnode = true;
      function step(dt) {
        const kL = coupleById(V.L), kR = coupleById(V.R);
        const EL = halfE(kL, cell.nL / VOL), ER = halfE(kR, cell.nR / VOL);
        leftAnode = EL <= ER;
        Ecell = Math.abs(ER - EL);
        const kA = leftAnode ? kL : kR, kC = leftAnode ? kR : kL;
        const nCat = leftAnode ? cell.nR : cell.nL, mAn = leftAnode ? cell.mL : cell.mR;
        const dead = (!kA.gas && mAn <= 0.02) || nCat <= 1e-6;
        note = dead ? ((!kA.gas && mAn <= 0.02) ? 'the anode has dissolved' : 'the cathode ions are used up') : '';
        const ck = new kit.Circuit();
        ck.V('p', 'gnd', dead ? 0 : Ecell, { r: RINT });
        const RL = V.load ? ck.R('p', 'gnd', V.rl) : null;
        ck.dc();
        I = RL && ck.ok ? Math.max(0, RL.i) : 0;
        Vt = ck.ok ? ck.v('p') : Ecell;
        if (!dt) return;
        const tc = dt * V.speed;
        cell.t += tc;
        if (I > 0) {
          let ne = I * tc / F;                                  // moles of electrons this frame
          ne = Math.min(ne, nCat * kC.n);                       // cannot use more cathode ions than there are
          if (!kA.gas) ne = Math.min(ne, mAn / kit.chem.el(kA.id).mass * kA.n);
          const dA = ne / kA.n, dC = ne / kC.n;
          if (leftAnode) { cell.nL += dA; cell.nR -= dC; if (!kA.gas) cell.mL -= dA * kit.chem.el(kA.id).mass; if (!kC.gas) cell.mR += dC * kit.chem.el(kC.id).mass; }
          else { cell.nR += dA; cell.nL -= dC; if (!kA.gas) cell.mR -= dA * kit.chem.el(kA.id).mass; if (!kC.gas) cell.mL += dC * kit.chem.el(kC.id).mass; }
          cell.nL = Math.max(cell.nL, 0); cell.nR = Math.max(cell.nR, 0);
          cell.mL = Math.max(cell.mL, 0); cell.mR = Math.max(cell.mR, 0);
        }
      }
      function report() {
        const kL = coupleById(V.L), kR = coupleById(V.R);
        const kA = leftAnode ? kL : kR, kC = leftAnode ? kR : kL;
        const E0 = kC.E0 - kA.E0, rx = reaction(kA, kC);
        ro.set('an', (leftAnode ? 'left: ' : 'right: ') + halfEq(kA, true));
        ro.set('ca', (leftAnode ? 'right: ' : 'left: ') + halfEq(kC, false));
        ro.set('eq', rx.text);
        ro.set('e0', volts(E0, 2));
        ro.set('e', volts(Ecell, 3));
        ro.set('v', volts(Vt, 3) + (I > 0 ? ' (under load)' : ''));
        ro.set('i', I > 0 ? kit.eng(I, 'A') : '0 (voltmeter only)' + (note ? ' — ' + note : ''));
        ro.set('dg', sgn(-rx.n * F * E0 / 1000, 0) + ' kJ/mol (n = ' + rx.n + ')');
        ro.set('k', kA.id === kC.id ? '0 (K = 1)' : (rx.n * E0 / (RG * T25 * Math.LN10 / F)).toFixed(1));
        const h = cell.t / 3600;
        ro.set('t', h < 1 ? (cell.t / 60).toFixed(1) + ' min' : h.toFixed(h < 10 ? 2 : 1) + ' h');
      }

      function frame(dt) {
        step(dt || 0);
        report();
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const kL = coupleById(V.L), kR = coupleById(V.R);
        const ladW = clamp(W * 0.24, 130, 190), x1 = W - ladW - 14, cw = x1 - 10;
        const bw = cw * 0.37, bLx = 10 + cw * 0.03, bRx = x1 - bw - cw * 0.03;
        const yWire = 24, yMeter = 70, eTop = 104, bTop = 142, bBot = H - 12, liq = bTop + 18, eBot = bBot - 22;
        const exL = bLx + bw * 0.34, exR = bRx + bw * 0.66;
        const brL = bLx + bw * 0.84, brR = bRx + bw * 0.16, brTop = eTop + 14, brBot = liq + (bBot - liq) * 0.42;
        const exA = leftAnode ? exL : exR, exC = leftAnode ? exR : exL;
        // beakers with solution (tinted by coloured ions)
        [[bLx, kL, cell.nL / VOL], [bRx, kR, cell.nR / VOL]].forEach(([bx, k, conc]) => {
          c.fillStyle = 'rgba(120,170,230,0.10)'; c.fillRect(bx, liq, bw, bBot - liq);
          const tint = TINT[k.ion];
          if (tint) { c.fillStyle = 'rgba(' + tint.join(',') + ',' + (0.5 * conc / (conc + 0.25)).toFixed(3) + ')'; c.fillRect(bx, liq, bw, bBot - liq); }
          c.strokeStyle = C.muted; c.lineWidth = 2;
          c.beginPath(); c.moveTo(bx, bTop); c.lineTo(bx, bBot); c.lineTo(bx + bw, bBot); c.lineTo(bx + bw, bTop); c.stroke();
          c.strokeStyle = 'rgba(120,170,230,0.6)'; c.lineWidth = 1; c.beginPath(); c.moveTo(bx, liq); c.lineTo(bx + bw, liq); c.stroke();
        });
        // ions in solution, as many as the concentration suggests
        [[bLx, kL, cell.nL / VOL, 0], [bRx, kR, cell.nR / VOL, 1]].forEach(([bx, k, conc, side]) => {
          const n = Math.round(clamp(3 + 3.5 * Math.log10(Math.max(conc, 1e-9) / 1e-3), 0, 18));
          const col = kit.chem.el(k.gas ? 'H' : k.id).color;
          for (let i = 0; i < n; i++) {
            const d = dots[side][i];
            d[2] += (dt || 0) * 1.3;
            const x = bx + 10 + d[0] * (bw - 20) + Math.cos(d[2]) * 3, y = liq + 14 + d[1] * (bBot - liq - 28) + Math.sin(d[2] * 1.3) * 3;
            ball(c, x, y, 4.5, col);
          }
          kit.label(c, pretty(k.ion) + '  ' + sig(conc, 3) + ' M', bx + bw / 2, bBot + 1 - 8, { size: 11.5, color: C.text, align: 'center', bg: C.bg2 });
        });
        // salt bridge: an inverted U, with K⁺ and NO₃⁻ drifting through it
        const bpath = [[brL, brBot], [brL, brTop], [brR, brTop], [brR, brBot]];
        c.strokeStyle = C.faint; c.lineWidth = 16; c.lineJoin = 'round';
        c.beginPath(); bpath.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
        c.strokeStyle = C.bg2; c.lineWidth = 11;
        c.beginPath(); bpath.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
        const segs = [brTop - brBot, brR - brL, brTop - brBot].map(Math.abs), tot = segs[0] + segs[1] + segs[2];
        const at = s => {
          let d = clamp(s, 0, 1) * tot;
          for (let i = 0; i < 3; i++) {
            if (d <= segs[i] || i === 2) { const f = segs[i] ? d / segs[i] : 0; return [bpath[i][0] + (bpath[i + 1][0] - bpath[i][0]) * f, bpath[i][1] + (bpath[i + 1][1] - bpath[i][1]) * f]; }
            d -= segs[i];
          }
          return bpath[3];
        };
        const drift = clamp(I * 6, 0, 0.35) * (dt || 0);
        for (const b of bridge) {
          // s = 0 at the left leg, 1 at the right leg; cations go towards the cathode, anions towards the anode
          const toRight = b.cat ? leftAnode : !leftAnode;
          b.s += (toRight ? 1 : -1) * drift + (Math.random() - 0.5) * 0.004;
          if (b.s > 1) b.s -= 1; if (b.s < 0) b.s += 1;
          const p = at(b.s);
          c.beginPath(); c.arc(p[0], p[1], 3.2, 0, Math.PI * 2);
          c.fillStyle = b.cat ? kit.chem.el('K').color : kit.chem.el('N').color; c.fill();
        }
        kit.label(c, 'salt bridge (KNO₃)', (brL + brR) / 2, brTop - 16, { size: 11, color: C.muted, align: 'center' });
        // electrodes
        [[exL, kL, cell.mL, leftAnode], [exR, kR, cell.mR, !leftAnode]].forEach(([ex, k, m, isAn]) => {
          const col = k.gas ? METAL.Pt : (METAL[k.id] || '#aaa');
          const w = k.gas ? 10 : 14 * clamp(m / M0, 0.06, 2.4);
          if (k.gas) {
            c.strokeStyle = C.muted; c.lineWidth = 1.5;
            c.strokeRect(ex - 13, eTop + 10, 26, eBot - eTop - 30);
            kit.label(c, 'H₂ in', ex, eTop, { size: 10.5, color: C.muted, align: 'center' });
          }
          c.fillStyle = col; c.fillRect(ex - w / 2, eTop + (k.gas ? eBot - eTop - 70 : 0), w, k.gas ? 60 : eBot - eTop);
          c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 1; c.strokeRect(ex - w / 2, eTop + (k.gas ? eBot - eTop - 70 : 0), w, k.gas ? 60 : eBot - eTop);
          kit.label(c, k.gas ? 'Pt' : k.id, ex, eTop + 14, { size: 11, weight: 700, color: '#222', align: 'center' });
          kit.label(c, isAn ? 'anode (−)' : 'cathode (+)', ex, bTop - 10, { size: 11.5, weight: 650, color: isAn ? C.accent : C.warn, align: 'center', bg: C.bg2 });
        });
        // hydrogen bubbles at a gas electrode
        for (const [ex, k, isC] of [[exL, kL, !leftAnode], [exR, kR, leftAnode]]) {
          if (!k.gas) continue;
          const rate = 3 + (isC ? clamp(I * 400, 0, 20) : 0);
          if (Math.random() < rate * (dt || 0)) bubbles.push({ x: ex + (Math.random() - 0.5) * 16, y: eBot - 8, r: 1.5 + Math.random() * 2 });
        }
        bubbles = bubbles.filter(b => (b.y -= 40 * (dt || 0)) > eTop + 14);
        c.strokeStyle = C.text; c.lineWidth = 1;
        for (const b of bubbles) { c.beginPath(); c.arc(b.x, b.y, b.r, 0, Math.PI * 2); c.stroke(); }
        // ions leaving the anode and arriving at the cathode
        if (I > 0 && dt) {
          const kA = leftAnode ? kL : kR, kC = leftAnode ? kR : kL;
          if (Math.random() < clamp(I * 300, 0, 10) * dt) movers.push({ x: exA, y: liq + 30 + Math.random() * (eBot - liq - 50), vx: (leftAnode ? -1 : 1) * 14, life: 1.6, col: kit.chem.el(kA.gas ? 'H' : kA.id).color });
          if (Math.random() < clamp(I * 300, 0, 10) * dt) movers.push({ x: exC + (leftAnode ? 1 : -1) * 34, y: liq + 30 + Math.random() * (eBot - liq - 50), vx: (leftAnode ? -1 : 1) * 20, life: 1.6, col: kit.chem.el(kC.gas ? 'H' : kC.id).color });
        }
        movers = movers.filter(m => (m.life -= dt || 0) > 0);
        for (const m of movers) { m.x += m.vx * (dt || 0); c.globalAlpha = clamp(m.life, 0, 1); ball(c, m.x, m.y, 4, m.col); c.globalAlpha = 1; }
        // the external circuit: leads, load (switch + resistor) on top, voltmeter branch below
        S.wire(c, [[exL, eTop], [exL, yWire]]); S.wire(c, [[exR, eTop], [exR, yWire]]);
        const mid = (exL + exR) / 2;
        S.wire(c, [[exL, yWire], [mid - 78, yWire]]);
        S.switch(c, mid - 78, yWire, mid - 40, yWire, { closed: V.load });
        S.wire(c, [[mid - 40, yWire], [mid - 30, yWire]]);
        S.resistor(c, mid - 30, yWire, mid + 50, yWire, { label: 'load', value: kit.eng(V.rl, 'Ω'), color: V.load ? C.text : C.faint });
        S.wire(c, [[mid + 50, yWire], [exR, yWire]]);
        S.wire(c, [[exL, yMeter], [mid - 16, yMeter]]); S.wire(c, [[mid + 16, yMeter], [exR, yMeter]]);
        S.node(c, exL, yMeter); S.node(c, exR, yMeter);
        S.meter(c, mid, yMeter, 'V', volts(Vt, 3));
        phase += (dt || 0) * clamp(20 + I * 2500, 0, 140);
        if (I > 0) {
          S.flow(c, [[exA, eTop], [exA, yWire], [exC, yWire], [exC, eTop]], phase, { color: C.warn });
          kit.label(c, 'e⁻ ' + (leftAnode ? '→' : '←'), mid + 10, yWire + 16, { size: 12, weight: 700, color: C.warn, align: 'center' });
        }
        if (note && V.load) kit.label(c, 'stopped: ' + note, mid, yMeter + 30, { size: 12, color: C.bad, align: 'center' });
        // the ladder of standard potentials
        const lx = x1 + 30, ly0 = 34, ly1 = H - 22;
        const Emin = -2.5, Emax = 1.7, Y = e => ly1 - (e - Emin) / (Emax - Emin) * (ly1 - ly0);
        kit.label(c, 'E° / V', lx - 16, 16, { size: 11.5, weight: 650, color: C.muted });
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(lx, ly0); c.lineTo(lx, ly1); c.stroke();
        const labs = COUPLES.map(k => ({ k, y: Y(k.E0) })).sort((a, b) => a.y - b.y);
        for (let i = 1; i < labs.length; i++) if (labs[i].y - labs[i - 1].y < 12.5) labs[i].y = labs[i - 1].y + 12.5;
        const over = labs[labs.length - 1].y - (ly1 + 4);
        if (over > 0) labs.forEach(l => { l.y -= over; });
        const kA = leftAnode ? kL : kR, kC = leftAnode ? kR : kL;
        for (const l of labs) {
          const isA = l.k.id === kA.id, isC = l.k.id === kC.id;
          const col = isA ? C.accent : isC ? C.warn : C.faint;
          c.strokeStyle = col; c.lineWidth = isA || isC ? 2 : 1;
          c.beginPath(); c.moveTo(lx - 4, Y(l.k.E0)); c.lineTo(lx + 4, Y(l.k.E0)); c.lineTo(lx + 10, l.y); c.stroke();
          kit.label(c, coupleName(l.k) + ' ' + sgn(l.k.E0, 2), lx + 13, l.y, { size: 10.5, weight: isA || isC ? 700 : 500, color: isA || isC ? col : C.muted });
        }
        if (kA.id !== kC.id) {
          kit.arrow(c, lx - 12, Y(kA.E0), lx - 12, Y(kC.E0), C.ok, 2);
          kit.label(c, sgn(kC.E0 - kA.E0, 2) + ' V', lx - 16, (Y(kA.E0) + Y(kC.E0)) / 2, { size: 11, weight: 700, color: C.ok, align: 'right', bg: C.bg2 });
        }
      }
      reset();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Nernst equation */
  Hyper.sim('ec-nernst', {
    title: 'The Nernst equation: voltage against concentration',
    blurb: `The graph plots the cell voltage against the logarithm of the reaction quotient (or against pH); the dot is your cell. Every tenfold change in $Q$ moves the voltage by $59.16\\ \\text{mV}/n$ at 25 °C, and the slope grows with absolute temperature (E° is held at its 25 °C value).

- **Daniell cell:** make $[\\ce{Cu^2+}]$ tiny — the voltage barely moves. The line only reaches zero at $Q = K \\approx 10^{37}$: far off the scale of any real beaker.
- **Concentration cell:** equal concentrations give zero; the sign flips when the dilute side becomes the concentrated one.
- **pH:** the hydrogen and oxygen electrodes both fall by 59 mV per pH unit, so the gap between them — the minimum voltage to split water — stays 1.23 V at every pH.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 230, maxH: 320 });
      const mode0 = params && ['daniell', 'conc', 'ph'].includes(params.mode) ? params.mode : 'daniell';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Cell', options: [['Daniell cell: Zn | Zn²⁺ ‖ Cu²⁺ | Cu', 'daniell'], ['Concentration cell: same metal both sides', 'conc'], ['Hydrogen and oxygen electrodes against pH', 'ph']], value: mode0 },
        { id: 'zn', label: '[Zn²⁺]', min: 1e-6, max: 2, value: 1, log: true, unit: 'M', sig: 2 },
        { id: 'cu', label: '[Cu²⁺]', min: 1e-8, max: 2, value: 0.01, log: true, unit: 'M', sig: 2 },
        { id: 'metal', type: 'select', label: 'Metal', options: [['copper: Cu²⁺, n = 2', 2], ['silver: Ag⁺, n = 1', 1]], value: 2 },
        { id: 'c1', label: 'Left (anode side) concentration', min: 1e-6, max: 2, value: 0.001, log: true, unit: 'M', sig: 2 },
        { id: 'c2', label: 'Right (cathode side) concentration', min: 1e-6, max: 2, value: 1, log: true, unit: 'M', sig: 2 },
        { id: 'ph', label: 'pH', min: 0, max: 14, step: 0.1, value: 7 },
        { id: 'T', label: 'Temperature', min: 0, max: 100, step: 1, value: 25, unit: '°C' }
      ], () => { update(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['e0', 'E° (standard)'], ['q', 'Q'], ['lq', 'log₁₀ Q'], ['sl', 'Slope per decade'], ['e', 'E (this cell)'], ['k', 'log₁₀ K'], ['dg', 'ΔG = −nFE']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'log₁₀ Q' }, y: { label: 'E (V)' } }, 220);
      let E = 0, E0 = 0, n = 2, lq = 0, EH = 0, EO = 0;

      function update() {
        const T = V.T + 273.15, slope = RG * T * Math.LN10 / F;    // volts per decade for n = 1
        const m = V.mode;
        ctl.show('zn', m === 'daniell'); ctl.show('cu', m === 'daniell');
        ctl.show('metal', m === 'conc'); ctl.show('c1', m === 'conc'); ctl.show('c2', m === 'conc');
        ctl.show('ph', m === 'ph');
        ro.show('q', m !== 'ph'); ro.show('lq', m !== 'ph'); ro.show('k', m === 'daniell'); ro.show('dg', m !== 'ph');
        if (m === 'daniell') {
          n = 2; E0 = 1.10; lq = Math.log10(V.zn / V.cu); E = E0 - slope / n * lq;
          const lK = n * E0 / slope;
          ro.set('e0', volts(E0, 2)); ro.set('q', '[Zn²⁺]/[Cu²⁺] = ' + sig(V.zn / V.cu, 3)); ro.set('lq', lq.toFixed(2));
          ro.set('sl', '−' + (slope / n * 1000).toFixed(1) + ' mV'); ro.set('e', volts(E, 3)); ro.set('k', lK.toFixed(1) + '  (E = 0 there)');
          ro.set('dg', sgn(-n * F * E / 1000, 1) + ' kJ/mol');
          const pts = [];
          for (let x = -8; x <= 42; x += 0.5) pts.push([x, E0 - slope / n * x]);
          plot.set({ x: { label: 'log₁₀ Q = log₁₀([Zn²⁺]/[Cu²⁺])', min: -8, max: 42 }, y: { label: 'E (V)', min: -0.15, max: 1.45 },
            series: [{ pts, label: 'E = E° − (RT/2F) ln Q' }], hlines: [{ y: 0, label: 'E = 0' }], vlines: [{ x: lK, label: 'Q = K' }, { x: 0, label: 'standard' }],
            marks: [{ x: lq, y: E, label: 'your cell' }] });
        } else if (m === 'conc') {
          n = V.metal; E0 = 0; lq = Math.log10(V.c1 / V.c2); E = -slope / n * lq;
          ro.set('e0', '0 V (same couple)'); ro.set('q', 'c(left)/c(right) = ' + sig(V.c1 / V.c2, 3)); ro.set('lq', lq.toFixed(2));
          ro.set('sl', '−' + (slope / n * 1000).toFixed(1) + ' mV'); ro.set('e', volts(E, 4) + (E < 0 ? ' (left is the cathode)' : ''));
          ro.set('dg', sgn(-n * F * E / 1000, 2) + ' kJ/mol');
          const pts = [];
          for (let x = -6.5; x <= 6.5; x += 0.25) pts.push([x, -slope / n * x]);
          plot.set({ x: { label: 'log₁₀ Q = log₁₀(c_left / c_right)', min: -6.5, max: 6.5 }, y: { label: 'E (V)', min: -0.42, max: 0.42 },
            series: [{ pts, label: 'E = −(RT/nF) ln Q' }], hlines: [{ y: 0 }], vlines: [{ x: 0, label: 'equal' }],
            marks: [{ x: lq, y: E, label: 'your cell' }] });
        } else {
          EH = -slope * V.ph; EO = 1.229 - slope * V.ph; E = EO - EH;
          ro.set('e0', 'H⁺/H₂ 0 V, O₂/H₂O +1.229 V'); ro.set('sl', '−' + (slope * 1000).toFixed(1) + ' mV per pH unit');
          ro.set('e', 'H⁺/H₂ ' + volts(EH, 3) + ', O₂/H₂O ' + volts(EO, 3));
          const p1 = [], p2 = [];
          for (let x = 0; x <= 14; x += 0.25) { p1.push([x, -slope * x]); p2.push([x, 1.229 - slope * x]); }
          plot.set({ x: { label: 'pH', min: 0, max: 14 }, y: { label: 'E vs SHE (V)', min: -1, max: 1.4 },
            series: [{ pts: p2, label: 'O₂ + 4H⁺ + 4e⁻ → 2H₂O' }, { pts: p1, label: '2H⁺ + 2e⁻ → H₂' }], vlines: [{ x: 7, label: 'neutral' }],
            marks: [{ x: V.ph, y: EO, label: volts(EO, 2) }, { x: V.ph, y: EH, label: volts(EH, 2) }] });
        }
      }

      function frame() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H, m = V.mode;
        if (m === 'ph') {
          // a vertical potential scale with the two couples at this pH
          const x0 = W * 0.18, y0 = 26, y1 = H - 24, Y = e => y1 - (e + 1) / 2.4 * (y1 - y0);
          c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, y1); c.stroke();
          for (let e = -1; e <= 1.4001; e += 0.5) { c.beginPath(); c.moveTo(x0 - 4, Y(e)); c.lineTo(x0 + 4, Y(e)); c.stroke(); kit.label(c, e.toFixed(1), x0 - 8, Y(e), { size: 11, color: C.muted, align: 'right' }); }
          kit.label(c, 'E vs SHE / V', x0, 12, { size: 11.5, color: C.muted, align: 'center' });
          c.fillStyle = 'rgba(80,160,255,0.16)'; c.fillRect(x0 + 6, Y(EO), W * 0.34, Y(EH) - Y(EO));
          c.strokeStyle = C.warn; c.lineWidth = 2; c.beginPath(); c.moveTo(x0 + 6, Y(EO)); c.lineTo(x0 + 6 + W * 0.34, Y(EO)); c.stroke();
          c.strokeStyle = C.accent; c.beginPath(); c.moveTo(x0 + 6, Y(EH)); c.lineTo(x0 + 6 + W * 0.34, Y(EH)); c.stroke();
          kit.label(c, 'O₂/H₂O  ' + volts(EO, 3), x0 + 12 + W * 0.34, Y(EO), { size: 12.5, weight: 650, color: C.warn });
          kit.label(c, 'H⁺/H₂  ' + volts(EH, 3), x0 + 12 + W * 0.34, Y(EH), { size: 12.5, weight: 650, color: C.accent });
          kit.label(c, 'water is stable between the lines', x0 + 6 + W * 0.17, (Y(EO) + Y(EH)) / 2, { size: 12, color: C.text, align: 'center' });
          kit.arrow(c, W * 0.84, Y(EH), W * 0.84, Y(EO), C.ok, 2);
          kit.label(c, (EO - EH).toFixed(3) + ' V', W * 0.86, (Y(EO) + Y(EH)) / 2, { size: 13, weight: 700, color: C.ok });
          kit.label(c, 'pH ' + V.ph.toFixed(1) + ' · ' + V.T.toFixed(0) + ' °C', W - 12, 14, { size: 12, color: C.muted, align: 'right' });
          return;
        }
        // two beakers, tinted by concentration, and a meter dial
        const conc = m === 'daniell' ? [V.zn, V.cu] : [V.c1, V.c2];
        const labs = m === 'daniell' ? ['Zn | Zn²⁺', 'Cu²⁺ | Cu'] : (V.metal === 2 ? ['Cu | Cu²⁺', 'Cu²⁺ | Cu'] : ['Ag | Ag⁺', 'Ag⁺ | Ag']);
        const metals = m === 'daniell' ? ['Zn', 'Cu'] : [V.metal === 2 ? 'Cu' : 'Ag', V.metal === 2 ? 'Cu' : 'Ag'];
        const blue = [m === 'daniell' ? 0 : (V.metal === 2 ? 1 : 0), V.metal === 2 || m === 'daniell' ? 1 : 0];
        const bw = W * 0.2, by = H * 0.3, bh = H * 0.62;
        [W * 0.04, W * 0.34].forEach((bx, i) => {
          c.fillStyle = 'rgba(120,170,230,0.10)'; c.fillRect(bx, by + 12, bw, bh - 12);
          if (blue[i]) { c.fillStyle = 'rgba(40,120,230,' + (0.55 * conc[i] / (conc[i] + 0.2)).toFixed(3) + ')'; c.fillRect(bx, by + 12, bw, bh - 12); }
          c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, by); c.lineTo(bx, by + bh); c.lineTo(bx + bw, by + bh); c.lineTo(bx + bw, by); c.stroke();
          c.fillStyle = METAL[metals[i]]; c.fillRect(bx + bw / 2 - 6, by - 20, 12, bh - 20);
          kit.label(c, labs[i], bx + bw / 2, by - 30, { size: 12, weight: 650, align: 'center' });
          kit.label(c, sig(conc[i], 3) + ' M', bx + bw / 2, by + bh - 14, { size: 12, color: C.text, align: 'center', bg: C.bg2 });
        });
        c.strokeStyle = C.faint; c.lineWidth = 10; c.beginPath(); c.moveTo(W * 0.04 + bw * 0.85, by + bh * 0.5); c.lineTo(W * 0.04 + bw * 0.85, by - 4); c.lineTo(W * 0.34 + bw * 0.15, by - 4); c.lineTo(W * 0.34 + bw * 0.15, by + bh * 0.5); c.stroke();
        // the dial
        const cx = W * 0.77, cy = H * 0.74, r = Math.min(W * 0.18, H * 0.58);
        const lo = m === 'daniell' ? 0 : -0.3, hi = m === 'daniell' ? 1.4 : 0.3;
        const A = v => Math.PI * (1 - (clamp(v, lo, hi) - lo) / (hi - lo));
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.arc(cx, cy, r, Math.PI, 2 * Math.PI); c.stroke();
        const stepv = m === 'daniell' ? 0.2 : 0.1;
        for (let v = lo; v <= hi + 1e-9; v += stepv) {
          const a = A(v);
          c.beginPath(); c.moveTo(cx + Math.cos(a) * r, cy - Math.sin(a) * r); c.lineTo(cx + Math.cos(a) * (r - 8), cy - Math.sin(a) * (r - 8)); c.stroke();
          kit.label(c, v.toFixed(1), cx + Math.cos(a) * (r + 12), cy - Math.sin(a) * (r + 12), { size: 10.5, color: C.muted, align: 'center' });
        }
        const a = A(E);
        c.strokeStyle = C.warn; c.lineWidth = 3; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(a) * (r - 6), cy - Math.sin(a) * (r - 6)); c.stroke();
        kit.dot(c, cx, cy, 4, C.text);
        kit.label(c, volts(E, 3), cx, cy + 16, { size: 16, weight: 700, color: C.warn, align: 'center' });
        kit.label(c, V.T.toFixed(0) + ' °C', cx, cy + 34, { size: 11.5, color: C.muted, align: 'center' });
      }
      update();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ batteries */
  const CHEMS = [
    { name: 'Lead–acid', eq: 'Pb + PbO₂ + 2H₂SO₄ → 2PbSO₄ + 2H₂O', react: [['Pb', 1], ['PbO2', 1], ['H2SO4', 2]], n: 2, E: 2.05, nom: 2.0, cap: 60 },
    { name: 'Nickel–cadmium', eq: 'Cd + 2NiOOH + 2H₂O → Cd(OH)₂ + 2Ni(OH)₂', react: [['Cd', 1], ['NiOOH', 2], ['H2O', 2]], n: 2, E: 1.30, nom: 1.2, cap: 2 },
    { name: 'Alkaline zinc–MnO₂', eq: 'Zn + 2MnO₂ → ZnO + Mn₂O₃', react: [['Zn', 1], ['MnO2', 2]], n: 2, E: 1.5, nom: 1.5, cap: 2.5 },
    { name: 'Lithium iron phosphate', eq: 'LiC₆ + FePO₄ → C₆ + LiFePO₄', react: [['LiC6', 1], ['FePO4', 1]], n: 1, E: 3.3, nom: 3.2, cap: 3 },
    { name: 'Zinc–air (zinc counted)', eq: '2Zn + O₂ → 2ZnO', react: [['Zn', 2]], n: 4, E: 1.65, nom: 1.4, cap: 0.6 },
    { name: 'Hydrogen–oxygen fuel cell', eq: '2H₂ + O₂ → 2H₂O', react: [['H2', 2], ['O2', 1]], n: 4, E: 1.23, nom: 0.7, cap: 10 }
  ];

  Hyper.sim('ec-battery', {
    title: 'Battery chemistry and battery packs',
    blurb: `Left: the **theoretical** specific energy of each cell reaction, $nFE$ divided by the molar mass of the reactants — computed from the equation and the periodic table, not quoted. Right: a pack of identical cells, with series strings side by side in parallel.

- Series adds voltage, parallel adds capacity; the energy is the same for the same number of cells.
- "Reactants needed" is the least mass of chemicals that can store the pack's charge (Faraday's law). Real packs weigh several times more: casing, electrolyte, current collectors, and material that cannot be reached.
- Zinc–air counts only the zinc, because its oxygen comes from the air; the fuel cell counts hydrogen and oxygen.
- The run time is the ideal one, capacity ÷ current. Real cells deliver less at high C-rates.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'ch', type: 'select', label: 'Chemistry', options: CHEMS.map((k, i) => [k.name, i]), value: 3 },
        { id: 's', label: 'Cells in series', min: 1, max: 24, step: 1, value: 4 },
        { id: 'p', label: 'Strings in parallel', min: 1, max: 8, step: 1, value: 2 },
        { id: 'cap', label: 'Capacity of one cell', min: 0.1, max: 200, value: 3, log: true, sig: 2, unit: 'A·h' },
        { id: 'I', label: 'Load current', min: 0.05, max: 200, value: 2, log: true, sig: 2, unit: 'A' }
      ], id => { if (id === 'ch') ctl.set('cap', CHEMS[V.ch].cap); update(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['eq', 'Reaction'], ['w', 'Theoretical specific energy'], ['vc', 'Cell voltage (typical)'], ['vp', 'Pack voltage'], ['qp', 'Pack capacity'], ['ep', 'Pack energy'], ['mr', 'Reactants needed, at least'], ['cr', 'C-rate'], ['rt', 'Ideal run time']]);
      const wOf = k => k.n * F * k.E / k.react.reduce((a, r) => a + r[1] * kit.chem.molarMass(r[0]), 0) / 3.6;   // Wh/kg
      let phase = 0;
      function update() {
        const k = CHEMS[V.ch], s = Math.round(V.s), p = Math.round(V.p);
        const Vp = s * k.nom, Qp = p * V.cap, Ep = Vp * Qp;
        const mPerAh = 3600 / (k.n * F) * k.react.reduce((a, r) => a + r[1] * kit.chem.molarMass(r[0]), 0);   // g of reactants per A·h
        ro.set('eq', k.eq);
        ro.set('w', Math.round(wOf(k)) + ' Wh/kg (E = ' + k.E.toFixed(2) + ' V, n = ' + k.n + ')');
        ro.set('vc', k.nom.toFixed(1) + ' V' + (k.nom < k.E - 0.3 ? ' under load' : ' nominal'));
        ro.set('vp', Vp.toFixed(1) + ' V');
        ro.set('qp', sig(Qp, 3) + ' A·h');
        ro.set('ep', Ep >= 1000 ? (Ep / 1000).toFixed(2) + ' kWh' : sig(Ep, 3) + ' Wh');
        const mr = s * p * V.cap * mPerAh;
        ro.set('mr', mr >= 1000 ? (mr / 1000).toFixed(2) + ' kg' : sig(mr, 3) + ' g');
        ro.set('cr', (V.I / Qp).toFixed(2) + ' C');
        const h = Qp / V.I;
        ro.set('rt', h >= 1 ? h.toFixed(2) + ' h' : (h * 60).toFixed(1) + ' min');
      }
      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        // bars of theoretical specific energy
        const bx0 = 14, bw = W * 0.42, top = 38, rowH = Math.min(38, (H - top - 30) / CHEMS.length), xmax = 1500;
        kit.label(c, 'Theoretical specific energy (Wh/kg of reactants)', bx0, 16, { size: 12.5, weight: 650 });
        const X = v => bx0 + clamp(v / xmax, 0, 1) * (bw - 20);
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let v = 0; v <= xmax; v += 500) { c.beginPath(); c.moveTo(X(v), top - 6); c.lineTo(X(v), top + rowH * CHEMS.length); c.stroke(); kit.label(c, String(v), X(v), top + rowH * CHEMS.length + 10, { size: 10.5, color: C.muted, align: 'center' }); }
        CHEMS.forEach((k, i) => {
          const w = wOf(k), y = top + i * rowH, sel = i === V.ch;
          c.fillStyle = sel ? C.accent : C.series[(i + 1) % 7];
          c.globalAlpha = sel ? 1 : 0.55;
          c.fillRect(bx0, y + 4, X(w) - bx0, rowH * 0.5);
          c.globalAlpha = 1;
          if (w > xmax) { kit.arrow(c, X(xmax) - 12, y + 4 + rowH * 0.25, X(xmax) + 4, y + 4 + rowH * 0.25, C.text, 2); }
          kit.label(c, k.name + ' · ' + Math.round(w), bx0 + 4, y + 4 + rowH * 0.5 + 9, { size: 11, weight: sel ? 700 : 500, color: sel ? C.text : C.muted });
        });
        // the pack
        const k = CHEMS[V.ch], s = Math.round(V.s), p = Math.round(V.p);
        const px0 = W * 0.5, px1 = W - 20, py0 = 44, py1 = H - 56;
        kit.label(c, s + 'S' + p + 'P pack · ' + (s * k.nom).toFixed(1) + ' V · ' + sig(p * V.cap, 3) + ' A·h', (px0 + px1) / 2, 16, { size: 12.5, weight: 650, align: 'center' });
        const ds = Math.min(s, 10), dp = Math.min(p, 6);
        const cw = (px1 - px0 - 40) / ds, ch = Math.min(46, (py1 - py0) / dp);
        const colX = i => px0 + 20 + i * cw;
        const rowY = j => py0 + j * ch + ch / 2;
        const rails = [px0 + 8, px1 - 8];
        for (let j = 0; j < dp; j++) {
          const y = rowY(j);
          S.wire(c, [[rails[0], y], [colX(0) + 4, y]]);
          for (let i = 0; i < ds; i++) {
            const x = colX(i), w = cw - 8, hh = Math.min(22, ch * 0.55);
            if (s > 10 && i === 7) { kit.label(c, '… ' + (s - 9) + ' more …', x + w / 2, y, { size: 10.5, color: C.muted, align: 'center' }); S.wire(c, [[x, y], [x + 4, y]]); S.wire(c, [[x + w - 4, y], [x + cw, y]]); continue; }
            rrect(c, x + 4, y - hh / 2, w - 6, hh, 4); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.accent; c.lineWidth = 1.5; c.stroke();
            c.fillStyle = C.accent; c.fillRect(x + w - 2, y - 4, 3, 8);
            if (w > 38) kit.label(c, k.nom.toFixed(1) + ' V', x + 4 + (w - 6) / 2, y, { size: 10, color: C.text, align: 'center' });
            S.wire(c, [[x + w + 1, y], [x + cw + 4, y]]);
          }
          S.wire(c, [[colX(ds - 1) + cw, y], [rails[1], y]]);
        }
        if (p > 6) kit.label(c, '… ' + (p - 6) + ' more strings', (px0 + px1) / 2, py1 + 4, { size: 10.5, color: C.muted, align: 'center' });
        S.wire(c, [[rails[0], rowY(0)], [rails[0], py1 + 26], [(px0 + px1) / 2 - 40, py1 + 26]]);
        S.wire(c, [[rails[1], rowY(0)], [rails[1], py1 + 26], [(px0 + px1) / 2 + 40, py1 + 26]]);
        for (let j = 0; j < dp; j++) { S.node(c, rails[0], rowY(j)); S.node(c, rails[1], rowY(j)); }
        S.resistor(c, (px0 + px1) / 2 - 40, py1 + 26, (px0 + px1) / 2 + 40, py1 + 26, { label: 'load', value: kit.eng(V.I, 'A') });
        phase += (dt || 0) * clamp(15 + 30 * Math.log10(1 + V.I), 0, 120);
        S.flow(c, [[(px0 + px1) / 2 + 40, py1 + 26], [rails[1], py1 + 26], [rails[1], rowY(0)]], -phase, { color: C.warn });
        S.flow(c, [[rails[0], rowY(0)], [rails[0], py1 + 26], [(px0 + px1) / 2 - 40, py1 + 26]], -phase, { color: C.warn });
        kit.label(c, '−', rails[0] - 8, rowY(0) - 12, { size: 14, weight: 700, color: C.accent, align: 'center' });
        kit.label(c, '+', rails[1] + 8, rowY(0) - 12, { size: 14, weight: 700, color: C.warn, align: 'center' });
      }
      update();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ corrosion */
  const E0M = { Fe: -0.44, Zn: -0.76, Mg: -2.37, Cu: 0.34, Sn: -0.14 };
  const SETUPS = [
    { id: 'bare', name: 'Bare iron nail', partner: null, anode: 'Fe', cathode: 'Fe', mult: 1,
      sites: [[0.03, 'blue', 1.1], [0.97, 'blue', 1.1], [0.3, 'pink', 0.9], [0.5, 'pink', 1], [0.7, 'pink', 0.9]],
      flow: [[0.03, 0.5], [0.97, 0.5]], text: 'The cold-worked head and tip are anodes; the shank is the cathode.' },
    { id: 'zn', name: 'Nail wrapped with a zinc strip', partner: 'Zn', wrap: true, anode: 'Zn', cathode: 'Fe', mult: 1,
      sites: [[0.5, 'white', 1.2], [0.1, 'pink', 1], [0.3, 'pink', 1], [0.7, 'pink', 1], [0.9, 'pink', 1]],
      flow: [[0.5, 0.03], [0.5, 0.97]], text: 'Zinc is the anode and dissolves; the whole nail is a cathode and stays bright.' },
    { id: 'mg', name: 'Nail wrapped with magnesium ribbon', partner: 'Mg', wrap: true, anode: 'Mg', cathode: 'Fe', mult: 1.3,
      sites: [[0.5, 'white', 1.35], [0.1, 'pink', 1.1], [0.3, 'pink', 1.1], [0.7, 'pink', 1.1], [0.9, 'pink', 1.1]],
      flow: [[0.5, 0.03], [0.5, 0.97]], text: 'Magnesium protects even more strongly than zinc — and is used up faster.' },
    { id: 'cu', name: 'Nail wrapped with copper wire', partner: 'Cu', wrap: true, anode: 'Fe', cathode: 'Cu', mult: 1.6,
      sites: [[0.5, 'pink', 1.25], [0.05, 'blue', 1.2], [0.22, 'blue', 1], [0.78, 'blue', 1], [0.95, 'blue', 1.2]],
      flow: [[0.03, 0.5], [0.97, 0.5]], text: 'Copper is the cathode; the iron, now the anode, corrodes faster than on its own.' },
    { id: 'sn', name: 'Tin-plated nail, scratched', partner: 'Sn', coat: true, anode: 'Fe', cathode: 'Sn', mult: 1.8,
      sites: [[0.5, 'blue', 1.3], [0.15, 'pink', 0.9], [0.32, 'pink', 0.9], [0.68, 'pink', 0.9], [0.85, 'pink', 0.9]],
      flow: [[0.5, 0.03], [0.5, 0.97]], text: 'At the scratch the iron is the anode of a tin–iron cell: attack is concentrated there.' },
    { id: 'galv', name: 'Galvanised (zinc-coated) nail, scratched', partner: 'Zn', coat: true, anode: 'Zn', cathode: 'Fe', mult: 1,
      sites: [[0.5, 'pink', 1.1], [0.42, 'white', 0.8], [0.58, 'white', 0.8]],
      flow: [[0.25, 0.5], [0.75, 0.5]], text: 'The zinc around the scratch dissolves; the exposed iron is a cathode and does not rust.' }
  ];

  Hyper.sim('ec-corrosion', {
    title: 'Corrosion of an iron nail, and how to stop it',
    blurb: `A nail lies in salty agar containing the classic **ferroxyl indicator**: potassium ferricyanide turns **blue** where iron dissolves as Fe²⁺ (the anodes), and phenolphthalein turns **pink** where oxygen is reduced to OH⁻ (the cathodes). Zinc and magnesium ions give no colour, only a faint white haze. The colours grow over (accelerated) time; how fast is illustrative, but the pattern — which metal is the anode — follows the electrode potentials.

- Compare the bare nail with the copper-wrapped one: copper makes the iron corrode faster.
- Wrap it with zinc or magnesium instead: no blue at all — the nail is a cathode, protected.
- A scratch in tin plate turns blue; a scratch in a galvanised coating stays pink.
- The metal-loss figure is exact: Faraday's law for the corrosion (or protection) current you set.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 320 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'set', type: 'select', label: 'Set-up', options: SETUPS.map((s, i) => [s.name, i]), value: 0 },
        { id: 'I', label: 'Corrosion (or protection) current', min: 0.1, max: 100, value: 2, log: true, sig: 2, unit: 'mA' },
        { id: 'flow', type: 'check', label: 'Show the electrons in the metal', value: true },
        { type: 'buttons', items: [{ id: 'again', label: 'Start again', primary: true }] }
      ], id => { if (id === 'set' || id === 'again') tv = 0; update(); loop.once(); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['an', 'Anode (corrodes)'], ['ca', 'Cathode (O₂ reduced)'], ['dv', 'Driving voltage (E° difference)'], ['loss', 'Anode metal lost per year'], ['what', 'What happens']]);
      let tv = 0, phase = 0;
      function update() {
        const s = SETUPS[V.set];
        ro.set('an', s.anode === 'Fe' ? 'iron' : ({ Zn: 'zinc', Mg: 'magnesium' })[s.anode]);
        ro.set('ca', ({ Fe: 'iron', Cu: 'copper', Sn: 'tin' })[s.cathode] + ' surface');
        ro.set('dv', s.partner ? (Math.abs(E0M[s.cathode] - E0M[s.anode])).toFixed(2) + ' V' : 'small: differences in stress and oxygen supply');
        const el = kit.chem.el(s.anode), yr = 3.15576e7;
        const g = V.I / 1000 * yr / (2 * F) * el.mass;
        ro.set('loss', (g >= 1000 ? (g / 1000).toFixed(2) + ' kg' : sig(g, 3) + ' g') + ' of ' + el.name.toLowerCase() + ' (Faraday)');
        ro.set('what', s.text);
      }
      function frame(dt) {
        const s = SETUPS[V.set];
        tv += (dt || 0) * (0.35 + 0.3 * Math.log10(V.I / 0.1)) * s.mult;
        phase += (dt || 0) * (10 + 12 * Math.log10(1 + V.I));
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const cx = W * 0.5, cy = H * 0.46, R = Math.min(W * 0.44, H * 0.4);
        // the dish of agar (a physical colour, pale yellow from the ferricyanide)
        c.beginPath(); c.arc(cx, cy, R, 0, Math.PI * 2); c.fillStyle = '#efe9c4'; c.fill();
        c.lineWidth = 3; c.strokeStyle = C.muted; c.stroke();
        const nx0 = cx - R * 0.78, nx1 = cx + R * 0.78, nh = 12;
        const X = f => nx0 + f * (nx1 - nx0);
        // indicator colours around the anode and cathode sites
        const grow = 1 - Math.exp(-tv / 6);
        const order = { pink: 0, white: 1, blue: 2 };
        s.sites.slice().sort((a, b) => order[a[1]] - order[b[1]]).forEach(([f, kind, w]) => {
          const r = (14 + R * 0.26 * grow) * w;
          const col = kind === 'blue' ? '30,70,190' : kind === 'pink' ? '240,70,150' : '250,250,250';
          const a = kind === 'white' ? 0.75 : 0.62;
          const g = c.createRadialGradient(X(f), cy, 2, X(f), cy, r);
          g.addColorStop(0, 'rgba(' + col + ',' + (a * grow + 0.05).toFixed(3) + ')'); g.addColorStop(1, 'rgba(' + col + ',0)');
          c.fillStyle = g; c.beginPath(); c.arc(X(f), cy, r, 0, Math.PI * 2); c.fill();
        });
        // the nail: head, shank, point
        const body = s.coat ? METAL[s.partner] : METAL.Fe;
        c.fillStyle = body;
        c.fillRect(nx0 + 8, cy - nh / 2, nx1 - nx0 - 30, nh);
        c.beginPath(); c.moveTo(nx1 - 22, cy - nh / 2); c.lineTo(nx1, cy); c.lineTo(nx1 - 22, cy + nh / 2); c.closePath(); c.fill();
        c.fillRect(nx0, cy - 17, 9, 34);
        c.strokeStyle = 'rgba(0,0,0,.45)'; c.lineWidth = 1; c.strokeRect(nx0 + 8, cy - nh / 2, nx1 - nx0 - 30, nh); c.strokeRect(nx0, cy - 17, 9, 34);
        if (s.coat) { c.fillStyle = METAL.Fe; c.fillRect(X(0.5) - 3, cy - nh / 2, 6, nh); kit.label(c, 'scratch', X(0.5), cy + 26, { size: 11, color: '#333', align: 'center' }); }
        if (s.wrap) {
          const col = METAL[s.partner], x = X(0.5);
          if (s.partner === 'Cu') {
            c.strokeStyle = col; c.lineWidth = 3;
            for (let i = -3; i <= 3; i++) { c.beginPath(); c.moveTo(x + i * 6 - 4, cy - nh / 2 - 5); c.lineTo(x + i * 6 + 4, cy + nh / 2 + 5); c.stroke(); }
          } else { c.fillStyle = col; c.fillRect(x - 16, cy - nh / 2 - 6, 32, nh + 12); c.strokeStyle = 'rgba(0,0,0,.4)'; c.strokeRect(x - 16, cy - nh / 2 - 6, 32, nh + 12); }
          kit.label(c, s.partner === 'Cu' ? 'copper' : s.partner === 'Zn' ? 'zinc' : 'magnesium', x, cy - nh / 2 - 16, { size: 11, weight: 650, color: '#333', align: 'center' });
        }
        // electrons inside the metal, from anode to cathode
        if (V.flow) for (const [a, b] of s.flow) S.flow(c, [[X(a), cy], [X(b), cy]], phase, { color: C.warn, r: 2.2, gap: 12 });
        // legend
        const ly = cy + R + 16;
        const sw = (x, rgbs, label) => { c.fillStyle = 'rgb(' + rgbs + ')'; c.beginPath(); c.arc(x, ly, 6, 0, Math.PI * 2); c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1; c.stroke(); return x + 12 + txt(c, label, x + 12, ly, { size: 11.5, color: C.text }) + 18; };
        let lx = 16;
        lx = sw(lx, '30,70,190', 'blue: Fe²⁺, iron dissolving (anode)');
        lx = sw(lx, '240,70,150', 'pink: OH⁻, O₂ reduced (cathode)');
        if (lx < W - 190) sw(lx, '250,250,250', 'white: Zn²⁺ / Mg²⁺');
        kit.label(c, s.name, 14, 16, { size: 13, weight: 650 });
        kit.label(c, 'colour growth: illustrative, accelerated', W - 14, 16, { size: 11, color: C.faint, align: 'right' });
      }
      update();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ electrolysis */
  const EMODES = {
    water: { name: 'Water: dilute sulfuric acid, platinum electrodes', cat: { gas: 'H2', z: 2 }, an: { gas: 'O2', z: 4 }, Emin: 1.23, catEq: '4H⁺ + 4e⁻ → 2H₂', anEq: '2H₂O → O₂ + 4H⁺ + 4e⁻', cation: 'H', anion: 'S', catEl: 'Pt', anEl: 'Pt' },
    cu: { name: 'Copper sulfate, copper electrodes (refining)', cat: { metal: 'Cu', z: 2 }, an: { metal: 'Cu', z: 2 }, Emin: 0, catEq: 'Cu²⁺ + 2e⁻ → Cu', anEq: 'Cu → Cu²⁺ + 2e⁻', cation: 'Cu', anion: 'S', catEl: 'Cu', anEl: 'Cu', blue: true },
    'cu-inert': { name: 'Copper sulfate, platinum electrodes', cat: { metal: 'Cu', z: 2 }, an: { gas: 'O2', z: 4 }, Emin: 0.89, catEq: 'Cu²⁺ + 2e⁻ → Cu', anEq: '2H₂O → O₂ + 4H⁺ + 4e⁻', cation: 'Cu', anion: 'S', catEl: 'Pt', anEl: 'Pt', blue: true },
    brine: { name: 'Concentrated brine (NaCl), inert electrodes', cat: { gas: 'H2', z: 2 }, an: { gas: 'Cl2', z: 2 }, Emin: 2.19, catEq: '2H₂O + 2e⁻ → H₂ + 2OH⁻', anEq: '2Cl⁻ → Cl₂ + 2e⁻', cation: 'Na', anion: 'Cl', catEl: 'Pt', anEl: 'C' }
  };
  const GASCOL = { H2: 'rgba(200,220,255,0.35)', O2: 'rgba(200,220,255,0.35)', Cl2: 'rgba(170,220,90,0.55)' };

  Hyper.sim('ec-electrolysis', {
    title: 'Electrolysis and Faraday\'s law',
    blurb: `A DC supply drives the current you choose; the ammeter reads it. Every coulomb that flows is counted: charge $Q = It$, moles of electrons $Q/F$, and from them the metal deposited or the gas collected (at 25 °C and 1 atm). Time runs fast, so minutes pass in seconds.

- **Water:** the hydrogen tube fills twice as fast as the oxygen tube — two electrons per H₂, four per O₂.
- **Copper electrodes:** copper leaves the anode and plates on the cathode at 1.19 g per ampere-hour; the solution stays blue and hardly any voltage is needed.
- **Platinum electrodes in copper sulfate:** copper plates out, oxygen bubbles off and the blue fades as the solution turns to sulfuric acid; when the copper ions run out, hydrogen appears instead.
- **Brine:** hydrogen and chlorine, and sodium hydroxide left behind — the chlor-alkali process.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330 });
      const S = kit.schem;
      const m0 = params && EMODES[params.mode] ? params.mode : 'water';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Electrolyte', options: Object.keys(EMODES).map(k => [EMODES[k].name, k]), value: m0 },
        { id: 'I', label: 'Current', min: 0.05, max: 5, value: 1, log: true, sig: 2, unit: 'A' },
        { id: 'speed', type: 'select', label: 'Time runs', options: [['real time', 1], ['1 s = 1 minute', 60], ['1 s = 10 minutes', 600]], value: 60 },
        { type: 'buttons', items: [{ id: 'run', label: 'Run / pause', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], id => {
        if (id === 'run') running = !running;
        else if (id === 'reset' || id === 'mode') reset();
        loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['t', 'Time'], ['q', 'Charge Q = It'], ['ne', 'Electrons Q/F'], ['cat', 'At the cathode (−)'], ['an', 'At the anode (+)'], ['emin', 'Minimum voltage'], ['ph', 'pH of the solution']]);
      const VOL = 0.25, CU0 = 0.5;               // 250 mL, 0.5 M copper sulfate where used
      let s, running = true, phase = 0, bubbles = [], ions = [];
      function reset() {
        s = { t: 0, Q: 0, cu: CU0 * VOL, mCat: 0, mAn: 0, gCat: 0, gAn: 0, h2Cat: 0 };
        bubbles = [];
        ions = Array.from({ length: 16 }, (_, i) => ({ x: Math.random(), y: Math.random(), cat: i % 2 === 0 }));
      }
      function step(dt) {
        if (!running || !dt) return;
        const md = EMODES[V.mode], tc = dt * V.speed, dq = V.I * tc, ne = dq / F;
        s.t += tc; s.Q += dq;
        if (md.cat.metal) {
          if (V.mode === 'cu-inert') {
            const dCu = Math.min(ne / 2, s.cu);
            s.cu -= dCu; s.mCat += dCu * kit.chem.el('Cu').mass;
            s.h2Cat += (ne - 2 * dCu) / 2;                     // once the copper is gone, water is reduced
          } else s.mCat += ne / 2 * kit.chem.el('Cu').mass;
        } else s.gCat += ne / md.cat.z;
        if (md.an.metal) s.mAn += ne / md.an.z * kit.chem.el(md.an.metal).mass;
        else s.gAn += ne / md.an.z;
      }
      const mL = n => n * VM25 * 1e6;
      function report() {
        const md = EMODES[V.mode];
        const h = s.t / 3600;
        ro.set('t', h >= 1 ? Math.floor(h) + ' h ' + Math.floor((s.t % 3600) / 60) + ' min' : (s.t / 60).toFixed(1) + ' min');
        ro.set('q', sig(s.Q, 4) + ' C = ' + (s.Q / 3600).toFixed(3) + ' A·h');
        ro.set('ne', sig(s.Q / F, 4) + ' mol');
        if (md.cat.metal) ro.set('cat', 'Cu: ' + s.mCat.toFixed(3) + ' g deposited' + (s.h2Cat > 0 ? ', then H₂ ' + mL(s.h2Cat).toFixed(1) + ' mL' : ''));
        else ro.set('cat', 'H₂: ' + mL(s.gCat).toFixed(1) + ' mL (' + (s.gCat * 1000).toFixed(2) + ' mmol)');
        if (md.an.metal) ro.set('an', 'Cu: ' + s.mAn.toFixed(3) + ' g dissolved');
        else ro.set('an', pretty(md.an.gas) + ': ' + mL(s.gAn).toFixed(1) + ' mL (' + (s.gAn * 1000).toFixed(2) + ' mmol)');
        ro.set('emin', md.Emin ? md.Emin.toFixed(2) + ' V + overpotentials + IR' : 'about 0 V: only overpotential and IR');
        ro.show('ph', V.mode === 'cu-inert' || V.mode === 'brine');
        if (V.mode === 'cu-inert') {
          // two H⁺ per copper deposited; once the copper is gone, water is split and the acid stays
          const hPlus = 1e-4 + 2 * (CU0 * VOL - s.cu) / VOL;
          ro.set('ph', Math.max(0, -Math.log10(hPlus)).toFixed(2) + ' ([Cu²⁺] ' + (s.cu / VOL).toFixed(3) + ' M)');
        } else if (V.mode === 'brine') {
          const oh = s.Q / F / VOL;                              // one OH⁻ per electron
          ro.set('ph', oh > 1e-7 ? (14 + Math.log10(oh + 1e-7)).toFixed(2) + ' (NaOH ' + sig(oh, 3) + ' M)' : '7.00');
        }
      }
      function frame(dt) {
        step(dt || 0);
        report();
        const md = EMODES[V.mode];
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, H = st.H;
        const bx0 = W * 0.08, bx1 = W * 0.72, bTop = H * 0.3, bBot = H - 14, liq = bTop + 14;
        const xC = bx0 + (bx1 - bx0) * 0.27, xA = bx0 + (bx1 - bx0) * 0.73;
        const yW = 20, eTop = md.cat.gas || md.an.gas ? H * 0.62 : liq - 26, eBot = bBot - 18, tubeTop = H * 0.1 + 20;
        const lC = xC - 28, lA = xA + 28;                       // the leads run down beside the gas tubes
        // electrolyte
        c.fillStyle = 'rgba(120,170,230,0.12)'; c.fillRect(bx0, liq, bx1 - bx0, bBot - liq);
        if (md.blue) { const f = V.mode === 'cu' ? 1 : s.cu / (CU0 * VOL); c.fillStyle = 'rgba(40,120,230,' + (0.42 * f).toFixed(3) + ')'; c.fillRect(bx0, liq, bx1 - bx0, bBot - liq); }
        c.strokeStyle = C.muted; c.lineWidth = 2;
        c.beginPath(); c.moveTo(bx0, bTop); c.lineTo(bx0, bBot); c.lineTo(bx1, bBot); c.lineTo(bx1, bTop); c.stroke();
        // gas tubes, on a shared scale so that the volumes compare directly
        const vC = mL(md.cat.gas ? s.gCat : s.h2Cat), vA = mL(md.an.gas ? s.gAn : 0);
        const vmax = niceUp(Math.max(20, vC, vA) * 1.15);
        const tube = (x, v, gas, show) => {
          if (!show) return;
          const tw = 34, t0 = tubeTop, t1 = eTop - 6;
          const fill = clamp(v / vmax, 0, 1) * (t1 - t0 - 10);
          c.fillStyle = 'rgba(120,170,230,0.12)'; c.fillRect(x - tw / 2, t0, tw, t1 - t0);
          if (md.blue && V.mode !== 'cu') { c.fillStyle = 'rgba(40,120,230,' + (0.42 * s.cu / (CU0 * VOL)).toFixed(3) + ')'; c.fillRect(x - tw / 2, t0, tw, t1 - t0); }
          c.fillStyle = C.bg2; c.fillRect(x - tw / 2, t0, tw, fill);
          c.fillStyle = GASCOL[gas] || GASCOL.H2; c.fillRect(x - tw / 2, t0, tw, fill);
          c.strokeStyle = C.muted; c.lineWidth = 1.5;
          c.beginPath(); c.moveTo(x - tw / 2, t1); c.lineTo(x - tw / 2, t0 + 6); c.arc(x, t0 + 6, tw / 2, Math.PI, 0); c.lineTo(x + tw / 2, t1); c.stroke();
          for (let k = 0; k <= 5; k++) { const y = t0 + (t1 - t0 - 10) * k / 5; c.beginPath(); c.moveTo(x + tw / 2 - 7, y); c.lineTo(x + tw / 2, y); c.stroke(); if (k % 5 === 0 || k === 0) kit.label(c, Math.round(vmax * k / 5) + ' mL', x + tw / 2 + 4, y, { size: 9.5, color: C.faint }); }
          kit.label(c, pretty(gas) + ' ' + v.toFixed(1) + ' mL', x, t0 - 10, { size: 11.5, weight: 650, align: 'center' });
        };
        tube(xC, vC, 'H2', !!md.cat.gas || s.h2Cat > 0);
        tube(xA, vA, md.an.gas || 'O2', !!md.an.gas);
        // electrodes
        const drawE = (x, el, w, lab) => {
          c.fillStyle = METAL[el] || '#999'; c.fillRect(x - w / 2, eTop, w, eBot - eTop);
          c.strokeStyle = 'rgba(0,0,0,.35)'; c.lineWidth = 1; c.strokeRect(x - w / 2, eTop, w, eBot - eTop);
          kit.label(c, lab, x, bBot + 1 - 6, { size: 11, weight: 650, color: C.text, align: 'center', bg: C.bg2 });
        };
        const wC = md.cat.metal ? 10 + 22 * s.mCat / (s.mCat + 4) : 8;
        if (md.cat.metal && V.mode === 'cu-inert') { drawE(xC, 'Pt', 8, ''); c.fillStyle = METAL.Cu; c.globalAlpha = clamp(s.mCat / 0.3, 0, 1); c.fillRect(xC - wC / 2, eTop, wC, eBot - eTop); c.globalAlpha = 1; kit.label(c, 'cathode (−)', xC, bBot - 7, { size: 11, weight: 650, color: C.text, align: 'center', bg: C.bg2 }); }
        else drawE(xC, md.catEl === 'Pt' ? 'Pt' : 'Cu', md.cat.metal ? wC : 8, 'cathode (−)');
        drawE(xA, md.anEl, md.an.metal ? Math.max(3, 18 * (1 - s.mAn / 40)) : 8, 'anode (+)');
        // bubbles: the rate follows the moles of gas per second
        const rateC = md.cat.gas || (V.mode === 'cu-inert' && s.cu <= 1e-9) ? V.I / 2 : 0, rateA = md.an.gas ? V.I / md.an.z : 0;
        if (running && dt) {
          if (Math.random() < clamp(rateC * 16, 0, 30) * dt) bubbles.push({ x: xC + (Math.random() - 0.5) * 20, y: eBot - Math.random() * (eBot - eTop), r: 1.5 + Math.random() * 2, top: md.cat.gas || s.h2Cat > 0 ? tubeTop + 12 : liq });
          if (Math.random() < clamp(rateA * 16, 0, 30) * dt) bubbles.push({ x: xA + (Math.random() - 0.5) * 20, y: eBot - Math.random() * (eBot - eTop), r: 1.5 + Math.random() * 2.5, top: md.an.gas ? tubeTop + 12 : liq });
        }
        bubbles = bubbles.filter(b => (b.y -= (running ? 60 : 0) * (dt || 0)) > b.top + (b.x > (xC + xA) / 2 ? clamp(vA / vmax, 0, 1) : clamp(vC / vmax, 0, 1)) * (eTop - 6 - tubeTop - 10));
        c.strokeStyle = C.text; c.lineWidth = 1;
        for (const b of bubbles) { c.beginPath(); c.arc(b.x, b.y, b.r, 0, Math.PI * 2); c.stroke(); }
        // ions drifting: cations to the cathode, anions to the anode
        for (const q of ions) {
          if (running) q.x += (q.cat ? -1 : 1) * clamp(V.I * 0.08, 0.01, 0.3) * (dt || 0) + (Math.random() - 0.5) * 0.004;
          if (q.x < 0) q.x += 1; if (q.x > 1) q.x -= 1;
          const x = xC + 14 + q.x * (xA - xC - 28), y = liq + 16 + q.y * (bBot - liq - 44);
          const el = q.cat ? md.cation : md.anion;
          ball(c, x, y, q.cat ? 4.5 : 5, kit.chem.el(el).color);
        }
        // DC supply and ammeter
        const xm = (xC + xA) / 2;
        const legC = [[xm - 64, yW], [lC, yW], [lC, eTop - 2], [xC, eTop - 2], [xC, eTop]];
        const legA = [[xA, eTop], [xA, eTop - 2], [lA, eTop - 2], [lA, yW], [xm + 16, yW]];
        S.wire(c, legC);
        S.meter(c, xm - 48, yW, 'A', null);
        S.wire(c, [[xm - 32, yW], [xm - 16, yW]]);
        S.battery(c, xm + 16, yW, xm - 16, yW, { label: 'DC supply', value: '' });
        S.wire(c, legA);
        kit.label(c, V.I.toFixed(2) + ' A', xm - 48, yW + 26, { size: 12, weight: 650, color: C.accent, align: 'center' });
        phase += (running ? 1 : 0) * (dt || 0) * clamp(20 + 25 * V.I, 0, 140);
        // electrons: out of the supply's negative terminal into the cathode, and from the anode back to the positive terminal
        S.flow(c, [[xm - 16, yW]].concat(legC), phase, { color: C.warn });
        S.flow(c, legA, phase, { color: C.warn });
        // half-reactions and the Faraday check
        const px = bx1 + 16;
        kit.label(c, 'cathode', px, H * 0.34, { size: 11.5, color: C.muted });
        kit.label(c, V.mode === 'cu-inert' && s.cu <= 1e-9 ? '2H₂O + 2e⁻ → H₂ + 2OH⁻' : md.catEq, px, H * 0.34 + 17, { size: 12, weight: 650 });
        kit.label(c, 'anode', px, H * 0.34 + 44, { size: 11.5, color: C.muted });
        kit.label(c, md.anEq, px, H * 0.34 + 61, { size: 12, weight: 650 });
        const nprod = md.cat.metal ? s.mCat / kit.chem.el('Cu').mass : s.gCat;
        const zc = md.cat.metal ? 2 : md.cat.z;
        kit.label(c, 'Q/(zF) = ' + sig(s.Q / (zc * F) * 1000, 4) + ' mmol', px, H * 0.34 + 96, { size: 12, color: C.ok });
        kit.label(c, 'formed: ' + sig(nprod * 1000 + (V.mode === 'cu-inert' ? s.h2Cat * 1000 : 0), 4) + ' mmol ✓', px, H * 0.34 + 114, { size: 12, color: C.ok });
        if (!running) kit.label(c, 'paused', (bx0 + bx1) / 2, liq + 16, { size: 12, color: C.muted, align: 'center' });
      }
      reset();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ electroplating */
  // densities in g/cm³ (not in kit.chem); efficiencies are typical defaults for each bath, adjustable
  const BATHS = [
    { sym: 'Ni', name: 'Nickel (Watts bath)', z: 2, rho: 8.908, eff: 0.95, j: 3 },
    { sym: 'Cu', name: 'Copper (acid sulfate)', z: 2, rho: 8.96, eff: 0.98, j: 2 },
    { sym: 'Zn', name: 'Zinc (acid chloride)', z: 2, rho: 7.14, eff: 0.95, j: 2 },
    { sym: 'Ag', name: 'Silver (cyanide, Ag⁺)', z: 1, rho: 10.49, eff: 0.99, j: 1 },
    { sym: 'Au', name: 'Gold (cyanide, Au⁺)', z: 1, rho: 19.32, eff: 0.9, j: 0.5 },
    { sym: 'Cr', name: 'Hard chromium (Cr⁶⁺ bath)', z: 6, rho: 7.19, eff: 0.15, j: 40 }
  ];

  Hyper.sim('ec-plating', {
    title: 'Electroplating: how thick, how long',
    blurb: `Faraday's law turned into a plating-shop calculator. The part is the cathode; the current density (A/dm²), the time and the current efficiency set the thickness, $\\delta = j t \\eta M/(zF\\rho)$. The right-hand view is a magnified cross-section of the surface as the layer grows. Press **Plate again** to replay.

- Nickel at 1 A/dm² and 100 % efficiency grows 12.3 µm per hour — the plater's rule of thumb.
- Hard chromium: six electrons per atom and only about 15 % efficiency, so most of the current makes hydrogen (see the bubbles and the hydrogen readout).
- Gold needs only a fraction of a micrometre on a connector: a few minutes at low current density.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 310 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'm', type: 'select', label: 'Bath', options: BATHS.map((b, i) => [b.name, i]), value: 0 },
        { id: 'j', label: 'Current density', min: 0.1, max: 60, value: 3, log: true, sig: 2, unit: 'A/dm²' },
        { id: 'eff', label: 'Current efficiency', min: 0.05, max: 1, step: 0.01, value: 0.95 },
        { id: 't', label: 'Plating time', min: 1, max: 240, step: 1, value: 30, unit: 'min' },
        { id: 'area', label: 'Area being plated', min: 0.1, max: 100, value: 10, log: true, sig: 2, unit: 'dm²' },
        { type: 'buttons', items: [{ id: 'go', label: 'Plate again', primary: true }] }
      ], id => {
        if (id === 'm') { ctl.set('j', BATHS[V.m].j); ctl.set('eff', BATHS[V.m].eff); }
        if (id === 'm' || id === 'go' || id === 't') tp = 0;
        update(); loop.once();
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['I', 'Current I = jA'], ['rate', 'Deposition rate'], ['d', 'Thickness after the time set'], ['m', 'Metal deposited'], ['q', 'Charge'], ['h2', 'Hydrogen made instead'], ['t25', 'Time for 25 µm']]);
      let tp = 0, phase = 0, bubbles = [], ions = Array.from({ length: 14 }, () => [Math.random(), Math.random()]);
      const bath = () => BATHS[V.m] || BATHS[0];
      const rateUm = () => { const b = bath(); return V.j * 100 * V.eff * kit.chem.el(b.sym).mass / 1000 / (b.z * F * b.rho * 1000) * 1e6; };   // µm per second
      function update() {
        const b = bath(), r = rateUm(), I = V.j * V.area, tsec = V.t * 60;
        ro.set('I', sig(I, 3) + ' A');
        ro.set('rate', (r * 3600).toFixed(2) + ' µm/h');
        ro.set('d', (r * tsec).toFixed(2) + ' µm');
        const g = I * tsec * V.eff * kit.chem.el(b.sym).mass / (b.z * F);
        ro.set('m', g >= 1000 ? (g / 1000).toFixed(2) + ' kg' : sig(g, 3) + ' g');
        ro.set('q', (I * tsec / 3600).toFixed(2) + ' A·h');
        ro.set('h2', (mLh2(I * tsec * (1 - V.eff))).toFixed(0) + ' mL (25 °C, 1 atm)');
        const t25 = 25 / r;
        ro.set('t25', t25 > 3600 ? (t25 / 3600).toFixed(2) + ' h' : (t25 / 60).toFixed(1) + ' min');
      }
      const mLh2 = q => q / (2 * F) * VM25 * 1e6;
      function frame(dt) {
        const b = bath(), C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        tp = Math.min(V.t, tp + (dt || 0) * V.t / 4);           // replay the plating time in about 4 s
        phase += (dt || 0) * clamp(20 + 20 * Math.log10(1 + V.j), 0, 120);
        // the tank
        const tx0 = 16, tx1 = W * 0.48, tTop = H * 0.26, tBot = H - 14, liq = tTop + 12;
        c.fillStyle = 'rgba(120,170,230,0.13)'; c.fillRect(tx0, liq, tx1 - tx0, tBot - liq);
        c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath(); c.moveTo(tx0, tTop); c.lineTo(tx0, tBot); c.lineTo(tx1, tBot); c.lineTo(tx1, tTop); c.stroke();
        const xa1 = tx0 + 22, xa2 = tx1 - 22, xp = (tx0 + tx1) / 2, yb = H * 0.12;
        const anodeCol = b.sym === 'Cr' ? METAL.Pb : b.sym === 'Au' ? METAL.Pt : METAL[b.sym];
        [xa1, xa2].forEach(x => { c.fillStyle = anodeCol; c.fillRect(x - 6, liq - 20, 12, tBot - liq - 6); });
        const lay = clamp(tp * 60 * rateUm() / 25, 0, 1) * 6;
        c.fillStyle = METAL.Fe; c.fillRect(xp - 14, liq + 10, 28, tBot - liq - 40);
        c.fillStyle = METAL[b.sym]; c.fillRect(xp - 14 - lay, liq + 10 - lay, 28 + 2 * lay, tBot - liq - 40 + 2 * lay);
        c.fillStyle = METAL.Fe; c.globalAlpha = 1 - clamp(lay / 2, 0, 1); c.fillRect(xp - 14, liq + 10, 28, tBot - liq - 40); c.globalAlpha = 1;
        kit.label(c, 'part (cathode −)', xp, tBot - 18, { size: 11, weight: 650, align: 'center', bg: C.bg2 });
        kit.label(c, b.sym === 'Cr' ? 'lead anodes (+)' : b.sym === 'Au' ? 'inert anodes (+)' : b.sym + ' anodes (+)', (xa1 + xp) / 2 - 4, tTop - 8, { size: 11, color: C.muted, align: 'center' });
        // metal ions drifting to the part
        for (const q of ions) {
          q[0] += (dt || 0) * 0.25 * clamp(V.j / 3, 0.2, 2);
          if (q[0] > 1) { q[0] -= 1; q[1] = Math.random(); }
          const side = q[1] < 0.5 ? -1 : 1, f = q[0];
          const x = side < 0 ? xa1 + 10 + f * (xp - 24 - xa1 - 10) : xa2 - 10 - f * (xa2 - 10 - xp - 24);
          const y = liq + 20 + ((q[1] * 2) % 1) * (tBot - liq - 70);
          ball(c, x, y, 3.8, kit.chem.el(b.sym).color);
        }
        // hydrogen bubbles at the part: the share of current not depositing metal
        if (dt && tp < V.t && Math.random() < clamp((1 - V.eff) * V.j * 2, 0, 40) * dt) bubbles.push({ x: xp + (Math.random() < 0.5 ? -1 : 1) * (18 + lay), y: tBot - 40 - Math.random() * (tBot - liq - 60), r: 1.2 + Math.random() * 1.8 });
        bubbles = bubbles.filter(q => (q.y -= 45 * (dt || 0)) > liq);
        c.strokeStyle = C.text; c.lineWidth = 1;
        for (const q of bubbles) { c.beginPath(); c.arc(q.x, q.y, q.r, 0, Math.PI * 2); c.stroke(); }
        // rectifier and wiring: + to the anode bus, − through the ammeter to the part (hopping over the bus)
        const yA = yb + 36, xm1 = (xa1 + xp) / 2, xmA = (xm1 + 13 + xp) / 2, roomy = xp - xm1 - 13 > 44;
        S.wire(c, [[xa1, liq - 20], [xa1, yA], [xa2, yA], [xa2, liq - 20]]);
        S.node(c, xa1, yA);
        S.battery(c, xm1 - 13, yb, xm1 + 13, yb, { label: '', value: '' });
        S.wire(c, [[xm1 - 13, yb], [xa1, yb], [xa1, yA]]);
        if (roomy) { S.wire(c, [[xm1 + 13, yb], [xmA - 16, yb]]); S.meter(c, xmA, yb, 'A', null); S.wire(c, [[xmA + 16, yb], [xp, yb]]); }
        else S.wire(c, [[xm1 + 13, yb], [xp, yb]]);
        S.wire(c, [[xp, yb], [xp, yA - 6]]);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(xp, yA, 6, -Math.PI / 2, Math.PI / 2); c.stroke();
        S.wire(c, [[xp, yA + 6], [xp, liq + 10]]);
        kit.label(c, sig(V.j * V.area, 3) + ' A', roomy ? xmA : xp + 10, yb + (roomy ? 26 : 0), { size: 11.5, weight: 650, color: C.accent, align: roomy ? 'center' : 'left' });
        if (tp < V.t) S.flow(c, [[xm1 + 13, yb], [xp, yb], [xp, liq + 10]], phase, { color: C.warn });
        // magnified cross-section of the surface
        const zx0 = W * 0.54, zx1 = W - 16, zy0 = 40, zy1 = H - 34;
        const dNow = tp * 60 * rateUm(), dEnd = V.t * 60 * rateUm();
        const span = niceUp(Math.max(dEnd, 0.1) * 1.25);          // µm shown across the view height above the substrate
        const sub = zy0 + (zy1 - zy0) * 0.72, px = (sub - zy0) / span;
        kit.label(c, 'cross-section, magnified', (zx0 + zx1) / 2, 18, { size: 12.5, weight: 650, align: 'center' });
        c.fillStyle = METAL.Fe; c.fillRect(zx0, sub, zx1 - zx0, zy1 - sub);
        c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 1;
        for (let x = zx0 - (zy1 - sub); x < zx1; x += 9) { c.beginPath(); c.moveTo(Math.max(x, zx0), sub + Math.max(0, zx0 - x)); c.lineTo(Math.min(x + (zy1 - sub), zx1), zy1 - Math.max(0, x + (zy1 - sub) - zx1)); c.stroke(); }
        kit.label(c, 'steel part', (zx0 + zx1) / 2, (sub + zy1) / 2, { size: 11.5, color: '#ffffff', align: 'center' });
        c.fillStyle = METAL[b.sym]; c.fillRect(zx0, sub - dNow * px, zx1 - zx0, dNow * px);
        c.strokeStyle = 'rgba(0,0,0,.35)'; c.strokeRect(zx0, sub - dNow * px, zx1 - zx0, dNow * px);
        kit.label(c, b.sym + ' layer ' + dNow.toFixed(2) + ' µm', zx0 + 8, Math.max(zy0 + 10, sub - dNow * px - 12), { size: 12, weight: 650, color: C.text });
        // scale bar and a human hair for comparison
        const bar = niceUp(span / 4) / 2 >= span / 8 ? niceUp(span / 4) / 2 : niceUp(span / 4);
        const bx = zx1 - 14;
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.moveTo(bx, sub); c.lineTo(bx, sub - bar * px); c.stroke();
        kit.label(c, sig(bar, 2) + ' µm', bx - 6, sub - bar * px / 2, { size: 11, color: C.text, align: 'right' });
        if (70 < span) { const y = sub - 70 * px; c.setLineDash([5, 4]); c.strokeStyle = C.muted; c.beginPath(); c.moveTo(zx0, y); c.lineTo(zx1 - 60, y); c.stroke(); c.setLineDash([]); kit.label(c, 'a human hair is about 70 µm thick', zx0 + 6, y - 9, { size: 10.5, color: C.muted }); }
        kit.label(c, (tp).toFixed(0) + ' / ' + V.t.toFixed(0) + ' min', (zx0 + zx1) / 2, H - 14, { size: 11.5, color: C.muted, align: 'center' });
      }
      update();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
