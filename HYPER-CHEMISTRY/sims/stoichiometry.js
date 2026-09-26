/* HYPER-CHEMISTRY · sims/stoichiometry.js — counting by weighing, the mole map,
 * balancing equations, empirical formulas from analysis, and a burette titration.
 * Every atomic mass comes from kit.chem, so the numbers agree with the periodic table. */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- shared helpers */
  const SUB = '₀₁₂₃₄₅₆₇₈₉', SUP = '⁰¹²³⁴⁵⁶⁷⁸⁹';
  const sub = s => String(s).replace(/\d/g, d => SUB[d]);
  const sup = s => String(s).replace(/\d/g, d => SUP[d]).replace(/-/g, '⁻').replace(/\+/g, '⁺');
  // (the headless checker tells sodium azide, NaN₃, from a NaN value, so formulas pass through as they are)
  const azide = s => String(s);
  // 'CuSO4·5H2O' -> 'CuSO₄·5H₂O', 'Cu^2+' -> 'Cu²⁺', 'MnO4^-' -> 'MnO₄⁻'
  function pretty(f) {
    f = String(f);
    let charge = '';
    const m = /\^(\d*[+-])$/.exec(f);
    if (m) { charge = sup(m[1]); f = f.slice(0, m.index); }
    return azide(f.split(/[·.]/).map((part, i) => {
      const c = i > 0 ? /^\d+/.exec(part) : null;
      return c ? c[0] + sub(part.slice(c[0].length)) : sub(part);
    }).join('·') + charge);
  }
  // 6.02 × 10²³
  function sci(x, d) {
    if (!Number.isFinite(x)) return '—';
    if (x === 0) return '0';
    let e = Math.floor(Math.log10(Math.abs(x)));
    let s = (x / Math.pow(10, e)).toFixed(d == null ? 2 : d);
    if (Math.abs(parseFloat(s)) >= 10) { e += 1; s = (x / Math.pow(10, e)).toFixed(d == null ? 2 : d); }
    return s + ' × 10' + sup(e);
  }
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const fontOf = (size, weight) => (weight || 500) + ' ' + size + 'px ' + getComputedStyle(document.body).fontFamily;
  // a particle drawn as a small pie: each element's share of the mass, in its CPK colour
  function pie(kit, c, x, y, r, comp) {
    let a0 = -Math.PI / 2;
    for (const q of comp) {
      const a1 = a0 + q.fraction * Math.PI * 2;
      c.beginPath(); c.moveTo(x, y); c.arc(x, y, r, a0, a1); c.closePath();
      c.fillStyle = kit.chem.el(q.sym).color; c.fill();
      a0 = a1;
    }
    c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2);
    c.lineWidth = 1; c.strokeStyle = 'rgba(0,0,0,.55)'; c.stroke();
  }
  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
  }
  const setLabel = (ctl, id, text) => {
    const r = ctl.rows[id], lab = r && r.row && r.row.querySelector && r.row.querySelector('.cl span');
    if (lab) lab.textContent = text;
  };
  const NA = 6.02214076e23;

  /* ================================================================ counting by weighing */
  const WEIGH = [['Carbon, C', 'C'], ['Magnesium, Mg', 'Mg'], ['Aluminium, Al', 'Al'], ['Sulfur, S', 'S'], ['Iron, Fe', 'Fe'],
    ['Copper, Cu', 'Cu'], ['Silver, Ag', 'Ag'], ['Gold, Au', 'Au'], ['Lead, Pb', 'Pb'], ['Water, H₂O', 'H2O'],
    ['Table salt, NaCl', 'NaCl'], ['Chalk, CaCO₃', 'CaCO3'], ['Glucose, C₆H₁₂O₆', 'C6H12O6'], ['Sucrose, C₁₂H₂₂O₁₁', 'C12H22O11']];

  Hyper.sim('stoich-weigh', {
    title: 'Counting by weighing',
    blurb: `Two pans, two substances. Each dot on a pan stands for 0.1 mol — $6.02 \\times 10^{21}$ particles — drawn as a little pie of the elements' shares of the mass. The graph shows mass against amount: the slope of each line is the molar mass.

- Start with **1 mol of aluminium against 1 mol of copper**: the same number of atoms, yet the copper side sinks, because each copper atom is heavier.
- Press **Balance the masses**: equal masses need 2.36 mol of aluminium for every mole of copper — the ratio of their molar masses.
- Put water on one side and sucrose on the other and balance them: a gram of water holds 19 times as many molecules as a gram of sugar.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const opts = WEIGH.map((w, i) => [w[0], i]);
      const ctl = kit.controls(box.side, [
        { id: 'a', type: 'select', label: 'Left pan', options: opts, value: params && params.a != null ? +params.a : 2 },
        { id: 'na', label: 'Amount on the left', min: 0, max: 3, step: 0.05, value: 1, unit: 'mol' },
        { id: 'b', type: 'select', label: 'Right pan', options: opts, value: params && params.b != null ? +params.b : 5 },
        { id: 'nb', label: 'Amount on the right', min: 0, max: 3, step: 0.05, value: 1, unit: 'mol' },
        { type: 'buttons', items: [{ id: 'match', label: 'Balance the masses', primary: true }, { id: 'same', label: 'Same amount' }] }
      ], id => {
        if (id === 'same') ctl.set('nb', V.na);
        else if (id === 'match') {
          const Ma = M(V.a), Mb = M(V.b);
          let nb = V.na * Ma / Mb, na = V.na;
          if (nb > 3) { nb = 3; na = 3 * Mb / Ma; }
          if (na === 0 && nb === 0) { na = 1; nb = Ma / Mb; if (nb > 3) { nb = 3; na = 3 * Mb / Ma; } }
          ctl.set('na', na); ctl.set('nb', nb);
        }
        update();
      });
      const ro = kit.readout(box.side, [['L', 'Left pan'], ['NL', 'Particles, left'], ['R', 'Right pan'], ['NR', 'Particles, right'], ['cmp', 'Right ÷ left']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'amount n (mol)', min: 0, max: 3 }, y: { label: 'mass m (g)', min: 0 } }, 170);
      const V = ctl.values;
      const formula = i => (WEIGH[i] || WEIGH[0])[1];
      const M = i => kit.chem.molarMass(formula(i));
      let th = 0, om = 0;

      function update() {
        const fa = formula(V.a), fb = formula(V.b), Ma = M(V.a), Mb = M(V.b);
        const ma = V.na * Ma, mb = V.nb * Mb;
        ro.set('L', kit.fmt(V.na, 3) + ' mol ' + pretty(fa) + ' = ' + kit.fmt(ma, 4) + ' g');
        ro.set('NL', sci(V.na * NA));
        ro.set('R', kit.fmt(V.nb, 3) + ' mol ' + pretty(fb) + ' = ' + kit.fmt(mb, 4) + ' g');
        ro.set('NR', sci(V.nb * NA));
        ro.set('cmp', (ma > 0 ? 'mass × ' + kit.fmt(mb / ma, 3) : 'mass —') + ' · particles × ' + (V.na > 0 ? kit.fmt(V.nb / V.na, 3) : '—'));
        plot.set({
          series: [{ pts: [[0, 0], [3, 3 * Ma]], label: pretty(fa) + ': slope ' + kit.fmt(Ma, 4) + ' g/mol' },
                   { pts: [[0, 0], [3, 3 * Mb]], label: pretty(fb) + ': slope ' + kit.fmt(Mb, 4) + ' g/mol' }],
          y: { label: 'mass m (g)', min: 0, max: Math.max(10, 3 * Math.max(Ma, Mb) * 1.05) },
          marks: [{ x: V.na, y: ma, label: 'left' }, { x: V.nb, y: mb, label: 'right' }],
          hlines: Math.abs(ma - mb) < 0.005 * Math.max(ma, mb, 1e-9) && ma > 0 ? [{ y: ma, label: 'equal masses' }] : []
        });
      }

      function drawPan(c, C, x, y, pw, f, n, comp, Mm) {
        // strings and the pan
        c.strokeStyle = C.muted; c.lineWidth = 1.2;
        c.beginPath(); c.moveTo(x, y - st.H * 0.26); c.lineTo(x - pw / 2, y); c.moveTo(x, y - st.H * 0.26); c.lineTo(x + pw / 2, y); c.stroke();
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(x - pw / 2 - 6, y); c.quadraticCurveTo(x, y + 22, x + pw / 2 + 6, y); c.closePath(); c.fill(); c.stroke();
        // the pile: one dot per 0.1 mol
        const N = Math.round(n * 10);
        const r = clamp(3.5 + 4.5 * Math.cbrt(Mm / 200), 3.5, 9);
        let placed = 0, row = 0;
        while (placed < N && row < 40) {
          const per = Math.max(1, Math.floor((pw - 8) / (2 * r + 1)) - row);
          const k = Math.min(per, N - placed);
          const w = k * (2 * r + 1);
          for (let i = 0; i < k; i++) pie(kit, c, x - w / 2 + r + i * (2 * r + 1) + 0.5, y - r - 1 - row * (2 * r - 1), r, comp);
          placed += k; row++;
        }
        kit.label(c, pretty(f), x, y + 30, { size: 15, weight: 650, align: 'center' });
        kit.label(c, kit.fmt(n, 3) + ' mol · ' + kit.fmt(n * Mm, 4) + ' g', x, y + 50, { size: 12.5, color: C.muted, align: 'center' });
      }

      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const Ma = M(V.a), Mb = M(V.b), ma = V.na * Ma, mb = V.nb * Mb;
        const target = ma + mb > 0 ? 0.2 * Math.tanh(4 * (mb - ma) / (ma + mb)) : 0;
        // a lightly damped beam swinging towards its rest angle
        const n = 8, h = (dt || 0) / n;
        for (let i = 0; i < n; i++) { om += (-40 * (th - target) - 5 * om) * h; th += om * h; }
        if (!dt) { th = target; om = 0; }
        const cx = W / 2, py = Hh * 0.2, Lb = Math.min(W * 0.32, 300);
        const cs = Math.cos(th), sn = Math.sin(th);
        const lx = cx - Lb * cs, ly = py - Lb * sn, rx = cx + Lb * cs, ry = py + Lb * sn;
        // stand
        c.fillStyle = C.bg2; c.strokeStyle = C.muted; c.lineWidth = 2;
        c.beginPath(); c.moveTo(cx, py); c.lineTo(cx, Hh - 18); c.stroke();
        c.beginPath(); c.moveTo(cx - 60, Hh - 12); c.lineTo(cx + 60, Hh - 12); c.lineWidth = 5; c.stroke();
        // beam and pointer
        c.strokeStyle = C.text; c.lineWidth = 4; c.lineCap = 'round';
        c.beginPath(); c.moveTo(lx, ly); c.lineTo(rx, ry); c.stroke(); c.lineCap = 'butt';
        c.strokeStyle = Math.abs(th) < 0.004 ? C.ok : C.warn; c.lineWidth = 2;
        c.beginPath(); c.moveTo(cx, py); c.lineTo(cx + Math.sin(th) * 60, py + Math.cos(th) * 60); c.stroke();
        kit.dot(c, cx, py, 5, C.text);
        const pw = Math.min(W * 0.27, 210), drop = Hh * 0.26;
        drawPan(c, C, lx, ly + drop, pw, formula(V.a), V.na, kit.chem.composition(formula(V.a)), Ma);
        drawPan(c, C, rx, ry + drop, pw, formula(V.b), V.nb, kit.chem.composition(formula(V.b)), Mb);
        const msg = ma + mb === 0 ? 'both pans empty' : Math.abs(mb - ma) < 0.005 * Math.max(ma, mb) ? 'balanced: equal masses' : (mb > ma ? 'right pan heavier' : 'left pan heavier');
        kit.label(c, msg, cx, 18, { size: 13, color: Math.abs(th) < 0.004 && ma + mb > 0 ? C.ok : C.muted, align: 'center' });
        kit.label(c, 'one dot = 0.1 mol = 6.02 × 10²² particles', 12, Hh - 12, { size: 11, color: C.faint });
      }
      update();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ the mole map */
  const MAP_RX = [
    { name: '2H₂ + O₂ → 2H₂O  (from H₂ to H₂O)', A: 'H2', a: 2, B: 'H2O', b: 2, gasA: true },
    { name: 'CaCO₃ → CaO + CO₂  (limestone to CO₂)', A: 'CaCO3', a: 1, B: 'CO2', b: 1, gasB: true },
    { name: '2NaN₃ → 2Na + 3N₂  (an airbag)', A: 'NaN3', a: 2, B: 'N2', b: 3, gasB: true },
    { name: 'Mg + 2HCl → MgCl₂ + H₂  (Mg to H₂)', A: 'Mg', a: 1, B: 'H2', b: 1, gasB: true },
    { name: 'NaOH + HCl → NaCl + H₂O  (solutions)', A: 'NaOH', a: 1, B: 'HCl', b: 1, aqA: true, aqB: true },
    { name: 'Fe₂O₃ + 3CO → 2Fe + 3CO₂  (Fe₂O₃ to Fe)', A: 'Fe2O3', a: 1, B: 'Fe', b: 2 },
    { name: '2C₈H₁₈ + 25O₂ → 16CO₂ + 18H₂O  (octane to CO₂)', A: 'C8H18', a: 2, B: 'CO2', b: 16, gasB: true },
    { name: 'AgNO₃ + NaCl → AgCl + NaNO₃  (solution to precipitate)', A: 'AgNO3', a: 1, B: 'AgCl', b: 1, aqA: true }
  ];
  const ROUTES = [['mass (g)', 0], ['amount (mol)', 1], ['number of particles', 2], ['volume of gas (L)', 3], ['volume of solution (mL)', 4]];
  const RANGE = [[0.1, 1000, 'g', 10], [0.001, 10, 'mol', 0.1], [1e20, 1e25, 'particles', 6.02e22], [0.01, 100, 'L', 2.45], [1, 1000, 'mL', 25]];
  const VM = [['0 °C, 1 atm: 22.41 L/mol', 22.414], ['0 °C, 1 bar: 22.71 L/mol', 22.711], ['25 °C, 1 atm: 24.47 L/mol', 24.465], ['25 °C, 1 bar: 24.79 L/mol', 24.790]];

  Hyper.sim('stoich-molemap', {
    title: 'The mole map',
    blurb: `Every stoichiometry problem is a trip across this map: from whatever you measured, **in to the amount in moles**, **across the equation** with the ratio of the coefficients, and **out again** to whatever you want to know about the other substance. The box you start from is outlined in the accent colour; everything that follows from it is outlined in green.

- Limestone → CO₂ with 1000 g of limestone: the kiln releases 440 g of CO₂, 224 L of gas at 0 °C and 1 atm.
- The airbag, working **from the product**: ask for 60 L of nitrogen and the map runs backwards to the sodium azide needed.
- The solutions: 25.0 mL of 0.100 M sodium hydroxide and acid of 0.100 M need 25.0 mL of acid — a titration in miniature. Change the acid's concentration and watch the volume follow.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const rx0 = params && params.rx != null ? +params.rx : 1;
      let route = params && params.given != null ? +params.given : 0;
      let ks = params && params.from != null ? +params.from : 0;          // 0: we know the reactant A; 1: the product B
      const toVal = pos => { const [lo, hi] = RANGE[route]; return Number((lo * Math.pow(hi / lo, pos / 100)).toPrecision(3)); };
      const toPos = v => { const [lo, hi] = RANGE[route]; return 100 * Math.log(v / lo) / Math.log(hi / lo); };
      const unitTxt = v => route === 2 ? sci(v) + ' particles' : kit.fmt(v, 3) + ' ' + RANGE[route][2];
      const ctl = kit.controls(box.side, [
        { id: 'rx', type: 'select', label: 'Reaction', options: MAP_RX.map((r, i) => [r.name, i]), value: rx0 },
        { id: 'from', type: 'select', label: 'You know something about…', options: [['the left substance, A', 0], ['the right substance, B', 1]], value: ks },
        { id: 'route', type: 'select', label: '…namely its', options: ROUTES, value: route },
        { id: 'v', label: 'Value', min: 0, max: 100, step: 0.5, value: 50, fmt: p => unitTxt(toVal(p)) },
        { id: 'cA', label: 'Concentration of A\'s solution', min: 0.01, max: 2, value: 0.1, unit: 'M', log: true, sig: 2 },
        { id: 'cB', label: 'Concentration of B\'s solution', min: 0.01, max: 2, value: 0.1, unit: 'M', log: true, sig: 2 },
        { id: 'vm', type: 'select', label: 'Gas conditions', options: VM, value: 22.414 }
      ], id => {
        if (id === 'rx') { R = MAP_RX[V.rx] || MAP_RX[0]; if (!valid(route)) setRoute(0); }
        if (id === 'from') { ks = V.from === 1 ? 1 : 0; if (!valid(route)) setRoute(0); }
        if (id === 'route') { if (valid(V.route)) setRoute(V.route); else ctl.set('route', route); }
        shows(); loop.once();
      });
      const ro = kit.readout(box.side, [['nK', 'Amount you know'], ['ratio', 'Across the equation'], ['nO', 'Amount of the other'], ['mO', 'Its mass'], ['xO', 'Its gas or solution volume']]);
      const V = ctl.values;
      let R = MAP_RX[rx0] || MAP_RX[1];
      const known = () => (ks === 0 ? { f: R.A, gas: R.gasA, aq: R.aqA, conc: V.cA, coef: R.a } : { f: R.B, gas: R.gasB, aq: R.aqB, conc: V.cB, coef: R.b });
      const other = () => (ks === 0 ? { f: R.B, gas: R.gasB, aq: R.aqB, conc: V.cB, coef: R.b } : { f: R.A, gas: R.gasA, aq: R.aqA, conc: V.cA, coef: R.a });
      const valid = r => r <= 2 || (r === 3 && !!known().gas) || (r === 4 && !!known().aq);
      function setRoute(r) {
        route = r; ctl.set('route', r);
        ctl.set('v', toPos(RANGE[r][3]));
      }
      function shows() {
        ctl.show('cA', !!R.aqA); ctl.show('cB', !!R.aqB);
        ctl.show('vm', !!(R.gasA || R.gasB));
      }
      if (!valid(route)) route = 0;
      setRoute(route);
      shows();

      function compute() {
        const Vm = +V.vm || 22.414, K = known(), O = other();
        const MK = kit.chem.molarMass(K.f), MO = kit.chem.molarMass(O.f);
        const x = toVal(V.v);
        const nK = route === 0 ? x / MK : route === 1 ? x : route === 2 ? x / NA : route === 3 ? x / Vm : K.conc * x / 1000;
        const nO = nK * O.coef / K.coef;
        const side = (n, M, s) => ({ mass: n * M, n, N: n * NA, gas: s.gas ? n * Vm : null, sol: s.aq && s.conc > 0 ? n / s.conc * 1000 : null, M });
        const sK = side(nK, MK, K), sO = side(nO, MO, O);
        return { Vm, K, O, nK, nO, sK, sO, A: ks === 0 ? sK : sO, B: ks === 0 ? sO : sK };
      }

      function box2(c, C, x, y, w, h, title, value, kind) {
        const col = kind === 'given' ? C.accent : kind === 'out' ? C.ok : C.faint;
        c.fillStyle = kind === 'na' ? C.bg2 : C.surface;
        roundRect(c, x - w / 2, y - h / 2, w, h, 8); c.fill();
        c.strokeStyle = col; c.lineWidth = kind === 'na' ? 1 : 2;
        if (kind === 'na') c.setLineDash([4, 3]);
        c.stroke(); c.setLineDash([]);
        kit.label(c, title, x, y - h / 2 + 12, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, value, x, y + 8, { size: 13.5, weight: 650, color: kind === 'na' ? C.faint : C.text, align: 'center' });
      }
      function link(c, C, x1, y1, x2, y2, text, on, col) {
        const a = Math.atan2(y2 - y1, x2 - x1);
        const X1 = x1 + Math.cos(a) * 4, Y1 = y1 + Math.sin(a) * 4, X2 = x2 - Math.cos(a) * 6, Y2 = y2 - Math.sin(a) * 6;
        if (on) kit.arrow(c, X1, Y1, X2, Y2, col, 2.2);
        else { c.strokeStyle = C.grid; c.lineWidth = 1.2; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(X1, Y1); c.lineTo(X2, Y2); c.stroke(); c.setLineDash([]); }
        kit.label(c, text, (X1 + X2) / 2, (Y1 + Y2) / 2 - 9, { size: 11.5, color: on ? col : C.faint, align: 'center', bg: C.bg2 });
      }

      function frame() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const r = compute();
        const hy = Hh * 0.54, hr = Math.max(26, Math.min(W * 0.065, Hh * 0.1));
        const hubs = [{ x: W * 0.33, s: R.A, side: r.A, satX: W * 0.1, gas: R.gasA, aq: R.aqA, conc: V.cA, dir: -1 },
                      { x: W * 0.67, s: R.B, side: r.B, satX: W * 0.9, gas: R.gasB, aq: R.aqB, conc: V.cB, dir: 1 }];
        const bw = Math.min(150, W * 0.18), bh = 44;
        const ys = [hy - Hh * 0.36, hy - Hh * 0.12, hy + Hh * 0.12, hy + Hh * 0.36];
        kit.label(c, azide(R.name.split('  ')[0]), W / 2, 16, { size: 15, weight: 650, align: 'center' });
        hubs.forEach((H, k) => {
          const S = H.side, isKnown = k === ks;
          const sats = [
            ['mass', kit.fmt(S.mass, 3) + ' g', 0, '÷ ' + kit.fmt(S.M, 4) + ' g/mol', '× ' + kit.fmt(S.M, 4) + ' g/mol'],
            ['particles', sci(S.N), 2, '÷ 6.022 × 10²³', '× 6.022 × 10²³'],
            ['gas volume', H.gas ? kit.fmt(S.gas, 3) + ' L' : 'not a gas here', 3, '÷ ' + kit.fmt(r.Vm, 4) + ' L/mol', '× ' + kit.fmt(r.Vm, 4) + ' L/mol'],
            ['solution', H.aq ? kit.fmt(S.sol, 3) + ' mL of ' + kit.fmt(H.conc, 2) + ' M' : 'not in solution', 4, '× ' + kit.fmt(H.conc, 2) + ' M', '÷ ' + kit.fmt(H.conc, 2) + ' M']
          ];
          sats.forEach((q, i) => {
            const applicable = q[2] === 3 ? !!H.gas : q[2] === 4 ? !!H.aq : true;
            const given = isKnown && route === q[2];
            const kind = !applicable ? 'na' : given ? 'given' : isKnown ? 'idle' : 'out';
            const sx = H.satX, sy = ys[i];
            const inner = [sx - H.dir * bw / 2, sy];
            const ang = Math.atan2(sy - hy, inner[0] - H.x);
            const hub = [H.x + Math.cos(ang) * hr, hy + Math.sin(ang) * hr];
            if (isKnown) link(c, C, inner[0], inner[1], hub[0], hub[1], q[3], given, C.accent);
            else link(c, C, hub[0], hub[1], inner[0], inner[1], q[4], applicable, C.ok);
            box2(c, C, sx, sy, bw, bh, q[0], q[1], kind);
          });
          c.beginPath(); c.arc(H.x, hy, hr, 0, Math.PI * 2);
          c.fillStyle = C.surface; c.fill();
          c.strokeStyle = isKnown ? (route === 1 ? C.accent : C.text) : C.ok; c.lineWidth = 2.5; c.stroke();
          kit.label(c, 'n(' + pretty(H.s) + ')', H.x, hy - 9, { size: 12, color: C.muted, align: 'center' });
          kit.label(c, kit.fmt(S.n, 3) + ' mol', H.x, hy + 9, { size: 13.5, weight: 700, align: 'center' });
          kit.label(c, (k === 0 ? 'A = ' : 'B = ') + pretty(H.s), H.x, hy + hr + 16, { size: 13, weight: 600, align: 'center' });
        });
        const from = hubs[ks], to = hubs[1 - ks];
        link(c, C, from.x + (to.x > from.x ? hr : -hr), hy, to.x + (to.x > from.x ? -hr : hr), hy, '× ' + r.O.coef + '/' + r.K.coef, true, C.warn);
        kit.label(c, 'the equation', W / 2, hy + 16, { size: 11, color: C.muted, align: 'center' });
        ro.set('nK', kit.fmt(r.nK, 4) + ' mol ' + pretty(r.K.f));
        ro.set('ratio', r.O.coef + ' ' + pretty(r.O.f) + ' per ' + r.K.coef + ' ' + pretty(r.K.f));
        ro.set('nO', kit.fmt(r.nO, 4) + ' mol ' + pretty(r.O.f));
        ro.set('mO', kit.fmt(r.sO.mass, 4) + ' g');
        ro.set('xO', r.O.gas ? kit.fmt(r.sO.gas, 4) + ' L of gas' : r.O.aq ? kit.fmt(r.sO.sol, 4) + ' mL of ' + kit.fmt(r.O.conc, 2) + ' M solution' : 'a solid or liquid here');
      }
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ balancing equations */
  const EQS = ['H2 + O2 -> H2O', 'N2 + H2 -> NH3', 'Fe + O2 -> Fe2O3', 'CH4 + O2 -> CO2 + H2O', 'C3H8 + O2 -> CO2 + H2O',
    'Al + HCl -> AlCl3 + H2', 'Fe2O3 + CO -> Fe + CO2', 'NaN3 -> Na + N2', 'C6H12O6 + O2 -> CO2 + H2O', 'NH3 + O2 -> NO + H2O',
    'C8H18 + O2 -> CO2 + H2O', 'Ca3(PO4)2 + H2SO4 -> CaSO4 + H3PO4', 'Cu + Ag^+ -> Cu^2+ + Ag', 'Cu + HNO3 -> Cu(NO3)2 + NO + H2O',
    'KMnO4 + HCl -> KCl + MnCl2 + Cl2 + H2O', 'MnO4^- + Fe^2+ + H^+ -> Mn^2+ + Fe^3+ + H2O'];
  const MAXSP = 6;
  const gcd = (a, b) => { while (b) { [a, b] = [b, a % b]; } return a; };

  Hyper.sim('stoich-balance', {
    title: 'Balance the equation',
    blurb: `Set the coefficients with the sliders. Each row counts one element: its atoms on the left and on the right, drawn in their periodic-table colours and grouped by the formula they come from. A row turns green when the two sides match; ionic equations get a row for charge too.

- Start with $\\ce{CH4 + O2 -> CO2 + H2O}$: fix carbon, then hydrogen, and leave oxygen — which appears on its own — for last.
- Octane needs a fraction on the way ($\\tfrac{25}{2}\\ce{O2}$): double everything to clear it.
- In the permanganate equation the atoms can balance while the charge does not — keep going until the charge row is green too.
- Stuck? **Show the answer** solves the equation exactly, the same way as the equation balancer in Tools.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const eq0 = params && params.eq != null ? +params.eq : 3;
      const eqName = e => e.split(' -> ').map(side => side.split(' + ').map(pretty).join(' + ')).join(' → ');
      const defs = [{ id: 'eq', type: 'select', label: 'Equation', options: EQS.map((e, i) => [eqName(e), i]), value: eq0 }];
      for (let i = 0; i < MAXSP; i++) defs.push({ id: 'k' + i, label: 'Coefficient ' + (i + 1), min: 1, max: 30, step: 1, value: 1 });
      defs.push({ type: 'buttons', items: [{ id: 'answer', label: 'Show the answer', primary: true }, { id: 'ones', label: 'All back to 1' }] });
      const ctl = kit.controls(box.side, defs, id => {
        if (id === 'eq') load();
        else if (id === 'ones') for (let i = 0; i < MAXSP; i++) ctl.set('k' + i, 1);
        else if (id === 'answer') {
          const r = kit.chem.balance(EQS[V.eq]);
          if (r.ok) r.coefficients.forEach((k, i) => ctl.set('k' + i, clamp(k, 1, 30)));
          shown = true;
        }
        loop.once();
      });
      const ro = kit.readout(box.side, [['state', 'Status'], ['left', 'Atoms on the left'], ['right', 'Atoms on the right']]);
      const V = ctl.values;
      let sp = [], nL = 0, els = [], ionic = false, shown = false;

      function load() {
        const eq = EQS[V.eq] || EQS[0];
        const [L, Rr] = eq.split('->').map(s => s.trim().split(/\s+\+\s+/));
        nL = L.length;
        sp = L.concat(Rr).map(f => Object.assign({ f }, kit.chem.parse(f)));
        els = [];
        for (const s of sp) for (const e of Object.keys(s.atoms)) if (!els.includes(e)) els.push(e);
        ionic = sp.some(s => s.charge);
        for (let i = 0; i < MAXSP; i++) {
          ctl.set('k' + i, 1);
          ctl.show('k' + i, i < sp.length);
          if (i < sp.length) setLabel(ctl, 'k' + i, 'Coefficient of ' + pretty(sp[i].f) + (i < nL ? ' (left)' : ' (right)'));
        }
        shown = false;
      }
      const coef = i => Math.round(V['k' + i] || 1);
      function counts() {
        const rows = els.map(e => {
          const L = [], R = [];
          sp.forEach((s, i) => { const n = (s.atoms[e] || 0) * coef(i); if (n) (i < nL ? L : R).push(n); });
          return { e, L, R, l: L.reduce((a, b) => a + b, 0), r: R.reduce((a, b) => a + b, 0) };
        });
        let qL = 0, qR = 0;
        sp.forEach((s, i) => { if (i < nL) qL += s.charge * coef(i); else qR += s.charge * coef(i); });
        return { rows, qL, qR };
      }

      function drawEquation(c, C, y) {
        const parts = [];
        sp.forEach((s, i) => {
          if (i > 0) parts.push({ t: i === nL ? '  →  ' : '  +  ', col: C.muted });
          parts.push({ t: String(coef(i)), col: coef(i) === 1 ? C.faint : C.accent, w: 700 });
          parts.push({ t: ' ' + pretty(s.f), col: C.text, w: 600 });
        });
        let size = 20, total = 0;
        for (let k = 0; k < 6; k++) {
          total = 0;
          for (const p of parts) { c.font = fontOf(size, p.w || 500); total += c.measureText(p.t).width; }
          if (total < st.W - 24) break;
          size -= 2;
        }
        let x = (st.W - total) / 2;
        for (const p of parts) {
          c.font = fontOf(size, p.w || 500);
          const w = c.measureText(p.t).width;
          kit.label(c, p.t, x, y, { size, weight: p.w || 500, color: p.col });
          x += w;
        }
      }

      function frame() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const k = counts();
        drawEquation(c, C, 26);
        const nRows = k.rows.length + (ionic ? 1 : 0);
        const top = 58, bottom = Hh - 44, rh = Math.min(52, (bottom - top) / Math.max(1, nRows));
        const xl0 = 64, xl1 = W / 2 - 34, xr0 = W / 2 + 34, xr1 = W - 64;
        kit.label(c, 'left side', (xl0 + xl1) / 2, top - 6, { size: 11, color: C.muted, align: 'center' });
        kit.label(c, 'right side', (xr0 + xr1) / 2, top - 6, { size: 11, color: C.muted, align: 'center' });
        let wrong = 0;
        const dots = (groups, x0, x1, y, col, right) => {
          const n = groups.reduce((a, b) => a + b, 0);
          if (!n) return;
          const width = x1 - x0, gap = 5;
          let r = Math.min(7, rh * 0.28, (width - gap * (groups.length - 1)) / (n * 2.3));
          r = Math.max(1.8, r);
          const step = 2 * r + 1;
          const total = n * step + gap * (groups.length - 1);
          let x = right ? x0 + r : x1 - Math.min(total, width) + r;
          for (const g of groups) {
            for (let i = 0; i < g; i++) {
              if (x > x1 + r) break;
              c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = col; c.fill();
              c.lineWidth = 0.8; c.strokeStyle = 'rgba(0,0,0,.5)'; c.stroke();
              x += step;
            }
            x += gap;
          }
        };
        k.rows.forEach((row, i) => {
          const y = top + rh * (i + 0.5);
          const ok = row.l === row.r;
          if (!ok) wrong++;
          const el = kit.chem.el(row.e);
          c.fillStyle = ok ? kit.hue(150, 0.12) : kit.hue(0, 0.08);
          c.fillRect(8, y - rh / 2 + 2, W - 16, rh - 4);
          kit.label(c, row.e, 18, y, { size: 16, weight: 700 });
          dots(row.L, xl0, xl1, y, el.color, false);
          dots(row.R, xr0, xr1, y, el.color, true);
          kit.label(c, String(row.l), xl0 - 10, y, { size: 14, weight: 650, align: 'right', color: ok ? C.ok : C.bad });
          kit.label(c, String(row.r), xr1 + 10, y, { size: 14, weight: 650, color: ok ? C.ok : C.bad });
          kit.label(c, ok ? '=' : '≠', W / 2, y, { size: 20, weight: 700, align: 'center', color: ok ? C.ok : C.bad });
        });
        if (ionic) {
          const y = top + rh * (k.rows.length + 0.5);
          const ok = k.qL === k.qR;
          if (!ok) wrong++;
          const q = v => (v > 0 ? '+' : v < 0 ? '−' : '') + Math.abs(v);
          c.fillStyle = ok ? kit.hue(150, 0.12) : kit.hue(0, 0.08);
          c.fillRect(8, y - rh / 2 + 2, W - 16, rh - 4);
          kit.label(c, 'charge', 18, y, { size: 13, weight: 700 });
          kit.label(c, q(k.qL), (xl0 + xl1) / 2, y, { size: 16, weight: 650, align: 'center', color: ok ? C.ok : C.bad });
          kit.label(c, q(k.qR), (xr0 + xr1) / 2, y, { size: 16, weight: 650, align: 'center', color: ok ? C.ok : C.bad });
          kit.label(c, ok ? '=' : '≠', W / 2, y, { size: 20, weight: 700, align: 'center', color: ok ? C.ok : C.bad });
        }
        const g = sp.reduce((a, s, i) => gcd(a, coef(i)), 0) || 1;
        let msg, col;
        if (wrong) { msg = wrong + (wrong === 1 ? ' row does' : ' rows do') + ' not balance yet'; col = C.warn; }
        else if (g > 1) { msg = 'Balanced — but every coefficient divides by ' + g + ': use the smallest whole numbers'; col = C.warn; }
        else { msg = 'Balanced!' + (shown ? '' : ' Well done.'); col = C.ok; }
        kit.label(c, msg, W / 2, Hh - 20, { size: 15, weight: 650, color: col, align: 'center' });
        ro.set('state', wrong ? 'not balanced' : g > 1 ? 'balanced, not in lowest terms' : 'balanced');
        ro.set('left', k.rows.map(r => r.e + ' ' + r.l).join(', ') + (ionic ? '; charge ' + k.qL : ''));
        ro.set('right', k.rows.map(r => r.e + ' ' + r.r).join(', ') + (ionic ? '; charge ' + k.qR : ''));
      }
      load();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ empirical formula */
  const CMB = [['Glucose', 'C6H12O6'], ['Ethanol', 'C2H6O'], ['Vitamin C', 'C6H8O6'], ['Benzene', 'C6H6'], ['Ethyl ethanoate', 'C4H8O2'],
    ['Propanone', 'C3H6O'], ['Naphthalene', 'C10H8'], ['Octane', 'C8H18'], ['Aspirin', 'C9H8O4'], ['Butanoic acid', 'C4H8O2']];
  const PCT = [['Magnetite', 'Fe3O4'], ['Hematite', 'Fe2O3'], ['Hydrogen peroxide', 'H2O2'], ['Phosphorus(V) oxide', 'P4O10'],
    ['Hydrazine', 'N2H4'], ['Dinitrogen tetroxide', 'N2O4'], ['Vitamin C', 'C6H8O6'], ['Caffeine', 'C8H10N4O2'],
    ['Nicotine', 'C10H14N2'], ['Sodium thiosulfate', 'Na2S2O3'], ['Glucose', 'C6H12O6']];

  Hyper.sim('stoich-empirical', {
    title: 'From analysis to formula',
    blurb: `An unknown compound is analysed — by burning it and weighing the $\\ce{CO2}$ and $\\ce{H2O}$, or from its mass percentages — and the table turns masses into a formula: divide by the atomic masses, divide by the smallest, then **multiply until every number is whole**. A measured molar mass turns the empirical formula into the molecular one.

- Vitamin C gives 1 : 1.33 : 1. Try multipliers 2 and 3: only 3 makes every number whole.
- Magnetite gives Fe : O = 1 : 1.33 — the same fraction in an inorganic compound.
- Tick **Measurement error** and **Run again** a few times: real ratios come out as 1.98 or 3.03, and you must judge what is whole.
- Glucose, ethanoic acid and methanal would all give $\\ce{CH2O}$: only the molar mass separates them.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const mode0 = params && params.mode != null ? +params.mode : 0;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Data from', options: [['Combustion analysis', 0], ['Mass percentages', 1]], value: mode0 },
        { id: 'cmb', type: 'select', label: 'Compound (C, H and O only)', options: CMB.map((q, i) => [q[0], i]), value: 2 },
        { id: 'pct', type: 'select', label: 'Compound', options: PCT.map((q, i) => [q[0], i]), value: 0 },
        { id: 'ms', label: 'Sample mass', min: 5, max: 50, step: 0.5, value: 20, unit: 'mg' },
        { id: 'k', label: 'Multiply the ratios by', min: 1, max: 6, step: 1, value: 1 },
        { id: 'err', type: 'check', label: 'Measurement error (±0.3 %)', value: false },
        { type: 'buttons', items: [{ id: 'find', label: 'Find the multiplier', primary: true }, { id: 'again', label: 'Run again' }] }
      ], id => {
        if (id === 'again') noise = fresh();
        if (id === 'find') { const m = best(analyse()); ctl.set('k', m || 1); }
        if (id === 'mode' || id === 'cmb' || id === 'pct') { ctl.set('k', 1); noise = fresh(); }
        shows(); loop.once();
      });
      const ro = kit.readout(box.side, [['emp', 'Empirical formula'], ['Mm', 'Measured molar mass'], ['mol', 'Molecular formula']]);
      const V = ctl.values;
      const fresh = () => Array.from({ length: 8 }, () => Math.random() * 2 - 1);
      let noise = fresh();
      function shows() {
        ctl.show('cmb', V.mode === 0); ctl.show('pct', V.mode === 1); ctl.show('ms', V.mode === 0);
      }
      const truth = () => (V.mode === 0 ? CMB[V.cmb] || CMB[0] : PCT[V.pct] || PCT[0]);
      // what the analysis reports, and what the table makes of it
      function analyse() {
        const [name, f] = truth();
        const p = kit.chem.parse(f), M = kit.chem.molarMass(f);
        const e = V.err ? 0.003 : 0;
        const A = s => kit.chem.el(s).mass;
        let rows, data;
        if (V.mode === 0) {
          const ms = V.ms, n = ms / M;                                   // mmol of sample
          const mCO2 = (p.atoms.C || 0) * n * kit.chem.molarMass('CO2') * (1 + e * noise[0]);
          const mH2O = (p.atoms.H || 0) / 2 * n * kit.chem.molarMass('H2O') * (1 + e * noise[1]);
          const mC = mCO2 * A('C') / kit.chem.molarMass('CO2'), mH = mH2O * 2 * A('H') / kit.chem.molarMass('H2O');
          const mO = Math.max(0, ms - mC - mH);
          data = { ms, mCO2, mH2O };
          rows = [['C', mC], ['H', mH]].concat(p.atoms.O ? [['O', mO]] : []).map(([s, m]) => ({ s, m, n: m / A(s) }));
        } else {
          const comp = kit.chem.composition(f);
          rows = comp.map((q, i) => {
            const pc = Math.round(q.fraction * 10000 * (1 + e * noise[2 + (i % 6)])) / 100;
            return { s: q.sym, m: pc, n: pc / A(q.sym) };
          });
          data = null;
        }
        const nmin = Math.min(...rows.map(r => r.n).filter(x => x > 0));
        rows.forEach(r => { r.q = nmin > 0 ? r.n / nmin : 0; });
        return { name, f, M, rows, data };
      }
      const whole = (rows, k) => rows.every(r => Math.abs(r.q * k - Math.round(r.q * k)) < 0.1);
      const best = a => { for (let k = 1; k <= 6; k++) if (whole(a.rows, k)) return k; return 0; };
      const formulaOf = (rows, k) => rows.map(r => { const n = Math.round(r.q * k); return n ? r.s + (n > 1 ? n : '') : ''; }).join('');

      function drawTrain(c, C, a, y, W) {
        const d = a.data;
        const x0 = 20, x1 = W - 20;
        const fx = x0 + (x1 - x0) * 0.16, fw = (x1 - x0) * 0.3, t1 = x0 + (x1 - x0) * 0.56, t2 = x0 + (x1 - x0) * 0.77, tw = (x1 - x0) * 0.15;
        kit.arrow(c, x0, y, fx - 4, y, C.muted, 2);
        kit.label(c, 'O₂', x0, y - 14, { size: 13, weight: 600 });
        // furnace
        c.fillStyle = kit.hue(20, 0.18); roundRect(c, fx, y - 22, fw, 44, 8); c.fill();
        c.strokeStyle = C.warn; c.lineWidth = 2; c.stroke();
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.beginPath(); c.moveTo(fx - 6, y - 7); c.lineTo(fx + fw + 6, y - 7); c.moveTo(fx - 6, y + 7); c.lineTo(fx + fw + 6, y + 7); c.stroke();
        c.fillStyle = C.text; c.fillRect(fx + fw * 0.35, y - 1, fw * 0.3, 6);
        kit.label(c, 'furnace, ~900 °C', fx + fw / 2, y - 34, { size: 11.5, color: C.muted, align: 'center' });
        kit.label(c, 'sample ' + kit.fmt(d.ms, 4) + ' mg', fx + fw / 2, y + 36, { size: 12.5, weight: 600, align: 'center' });
        // absorbers
        const tube = (x, lab, gain, what) => {
          c.fillStyle = C.surface; roundRect(c, x, y - 14, tw, 28, 12); c.fill(); c.strokeStyle = C.text; c.lineWidth = 1.5; c.stroke();
          for (let i = 0; i < 12; i++) kit.dot(c, x + 8 + (i % 6) * (tw - 16) / 5, y - 5 + Math.floor(i / 6) * 10, 2.5, C.faint);
          kit.label(c, lab, x + tw / 2, y - 26, { size: 11, color: C.muted, align: 'center' });
          kit.label(c, '+' + kit.fmt(gain, 4) + ' mg ' + what, x + tw / 2, y + 30, { size: 12.5, weight: 650, color: C.accent, align: 'center' });
        };
        kit.arrow(c, fx + fw + 6, y, t1 - 3, y, C.muted, 1.5);
        tube(t1, 'traps H₂O', d.mH2O, 'H₂O');
        kit.arrow(c, t1 + tw, y, t2 - 3, y, C.muted, 1.5);
        tube(t2, 'NaOH traps CO₂', d.mCO2, 'CO₂');
        kit.arrow(c, t2 + tw, y, x1, y, C.muted, 1.5);
      }
      function drawBar(c, C, a, y, W) {
        const x0 = 20, x1 = W - 20;
        let x = x0;
        kit.label(c, 'mass percentages of ' + a.name.toLowerCase(), x0, y - 26, { size: 12, color: C.muted });
        for (const r of a.rows) {
          const w = (x1 - x0) * r.m / 100;
          c.fillStyle = kit.chem.el(r.s).color; c.fillRect(x, y - 14, Math.max(0, w), 28);
          c.strokeStyle = 'rgba(0,0,0,.4)'; c.lineWidth = 1; c.strokeRect(x, y - 14, Math.max(0, w), 28);
          if (w > 44) kit.label(c, r.s + ' ' + r.m.toFixed(2) + ' %', x + w / 2, y, { size: 12, weight: 650, align: 'center', color: '#111', bg: 'rgba(255,255,255,.7)' });
          x += w;
        }
      }

      function frame() {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        const a = analyse(), k = Math.round(V.k);
        if (V.mode === 0) drawTrain(c, C, a, Hh * 0.17, W); else drawBar(c, C, a, Hh * 0.15, W);
        // the table
        const cols = V.mode === 0 ? ['element', 'mass / mg', 'amount / mmol', '÷ smallest', '× ' + k, 'whole?']
                                  : ['element', 'in 100 g / g', 'amount / mol', '÷ smallest', '× ' + k, 'whole?'];
        const tx = [0.06, 0.2, 0.38, 0.56, 0.72, 0.88].map(f => f * W);
        const ty0 = Hh * 0.36, rh = Math.min(30, (Hh * 0.4) / (a.rows.length + 1));
        cols.forEach((t, i) => kit.label(c, t, tx[i], ty0, { size: 11.5, color: C.muted, align: i ? 'center' : 'left' }));
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(12, ty0 + rh / 2); c.lineTo(W - 12, ty0 + rh / 2); c.stroke();
        a.rows.forEach((r, j) => {
          const y = ty0 + rh * (j + 1);
          const v = r.q * k, near = Math.abs(v - Math.round(v)) < 0.1;
          kit.dot(c, tx[0] + 6, y, 7, kit.chem.el(r.s).color, 'rgba(0,0,0,.5)');
          kit.label(c, r.s, tx[0] + 20, y, { size: 14, weight: 700 });
          kit.label(c, kit.fmt(r.m, 4), tx[1], y, { size: 13, align: 'center' });
          kit.label(c, kit.fmt(r.n, 4), tx[2], y, { size: 13, align: 'center' });
          kit.label(c, r.q.toFixed(3), tx[3], y, { size: 13, align: 'center' });
          kit.label(c, v.toFixed(2), tx[4], y, { size: 14, weight: 700, align: 'center', color: near ? C.ok : C.warn });
          kit.label(c, near ? '✓ ' + Math.round(v) : '✗', tx[5], y, { size: 14, weight: 700, align: 'center', color: near ? C.ok : C.bad });
        });
        // the conclusion
        const kb = best(a), ok = whole(a.rows, k);
        const yEnd = Hh - 44;
        let line1, col1;
        if (ok && kb && k % kb === 0 && k > kb) { line1 = 'Whole numbers — but ×' + kb + ' already works: the empirical formula is the simplest ratio.'; col1 = C.warn; }
        else if (ok) { line1 = 'Empirical formula: ' + pretty(formulaOf(a.rows, k)); col1 = C.ok; }
        else { line1 = 'Not all whole yet: try another multiplier.'; col1 = C.warn; }
        kit.label(c, line1, W / 2, yEnd, { size: 15, weight: 650, align: 'center', color: col1 });
        const emp = kb ? formulaOf(a.rows, kb) : null;
        if (emp) {
          const Me = kit.chem.molarMass(emp), mult = Math.round(a.M / Me);
          const txt = 'measured molar mass ' + kit.fmt(a.M, 4) + ' g/mol ÷ ' + kit.fmt(Me, 4) + ' g/mol = ' + kit.fmt(a.M / Me, 3) + ' → molecular formula ' + pretty(a.f);
          kit.label(c, ok ? txt : 'then divide the measured molar mass by the empirical formula\'s', W / 2, yEnd + 24, { size: 12, color: C.muted, align: 'center' });
          ro.set('emp', ok ? pretty(formulaOf(a.rows, k)) + (k > kb ? ' (not simplest)' : '') : '— (find whole numbers first)');
          ro.set('Mm', kit.fmt(a.M, 4) + ' g/mol (from a mass spectrum)');
          ro.set('mol', ok ? pretty(a.f) + ' = ' + mult + ' × ' + pretty(emp) : '—');
        } else {
          ro.set('emp', '— (no whole-number ratio up to ×6: rethink the rounding)');
          ro.set('Mm', kit.fmt(a.M, 4) + ' g/mol'); ro.set('mol', '—');
        }
      }
      shows();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ titration */
  // acid systems: Ka values of the fully protonated form, its charge z0; titrant NaOH (acids) or HCl (bases)
  const ANALYTES = [
    { name: 'Hydrochloric acid (strong)', eq: 'HCl + NaOH → NaCl + H₂O', acid: true, Ka: [1e7], z0: 0, ratio: 1, lo: 0.06, hi: 0.12, naPer: 0 },
    { name: 'Ethanoic acid, as in vinegar (weak)', eq: 'CH₃COOH + NaOH → CH₃COONa + H₂O', acid: true, Ka: [1.75e-5], z0: 0, ratio: 1, lo: 0.06, hi: 0.12, naPer: 0 },
    { name: 'Sulfuric acid (diprotic)', eq: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O', acid: true, Ka: [1e7, 1.0e-2], z0: 0, ratio: 2, lo: 0.03, hi: 0.06, naPer: 0 },
    { name: 'Ammonia (weak base)', eq: 'NH₃ + HCl → NH₄Cl', acid: false, Ka: [5.6e-10], z0: 1, ratio: 1, lo: 0.06, hi: 0.12, naPer: 0 },
    { name: 'Sodium carbonate (base, two steps)', eq: 'Na₂CO₃ + 2HCl → 2NaCl + H₂O + CO₂', acid: false, Ka: [4.5e-7, 4.7e-11], z0: 0, ratio: 2, lo: 0.03, hi: 0.06, naPer: 2 }
  ];
  const INDICATORS = [
    ['Phenolphthalein (8.2–10.0)', { pk: 9.3, a: [255, 255, 255, 0], b: [225, 50, 150, 0.85] }],
    ['Methyl orange (3.1–4.4)', { pk: 3.7, a: [225, 45, 40, 0.8], b: [245, 185, 30, 0.75] }],
    ['Methyl red (4.4–6.2)', { pk: 5.1, a: [225, 40, 70, 0.8], b: [245, 200, 40, 0.75] }],
    ['Bromothymol blue (6.0–7.6)', { pk: 7.1, a: [230, 205, 40, 0.75], b: [40, 90, 215, 0.8] }],
    ['None — watch the pH meter', null]
  ];
  const TAP = [['Closed', 0], ['Drop by drop', 0.1], ['Slow stream', 0.4], ['Fast', 1.5]];
  const KW = 1e-14;
  function alphas(h, Ka) {
    const lt = [0];
    let acc = 0;
    for (const k of Ka) { acc += Math.log(k) - Math.log(h); lt.push(acc); }
    const mx = Math.max(...lt);
    const t = lt.map(v => Math.exp(v - mx));
    const s = t.reduce((a, b) => a + b, 0);
    return t.map(v => v / s);
  }
  // pH from the charge balance: [H+] + [Na+] + C·(mean charge of the acid system) = [OH-] + [Cl-]
  function solvePH(C, Ka, z0, Na, Cl) {
    const f = lh => {
      const h = Math.pow(10, lh);
      const al = alphas(h, Ka);
      let z = 0;
      al.forEach((a, i) => { z += a * (z0 - i); });
      return h + Na - KW / h - Cl + C * z;
    };
    let lo = -15, hi = 1.5;
    for (let k = 0; k < 64; k++) { const m = (lo + hi) / 2; if (f(m) > 0) hi = m; else lo = m; }
    return -(lo + hi) / 2;
  }

  Hyper.sim('stoich-titration', {
    title: 'Burette titration',
    blurb: `A pipetted aliquot of an unknown sits in the flask with a few drops of indicator; the burette holds 0.1000 M titrant. Open the tap, watch the colour, close it at the end point and read the burette — the calculation panel turns your titre into a concentration.

- Run fast for a **rough titre**, then refill and go **drop by drop** near the end: the pink flash that fades on swirling says you are close.
- Read the magnified scale to the nearest 0.05 mL, and remember the titre is the final reading **minus the initial one**.
- Titrate the weak ethanoic acid with **methyl orange** instead of phenolphthalein: the colour drifts early and gives a titre that is far too small.
- Sodium carbonate has two steps: phenolphthalein fades at the first, methyl orange changes at the second — the pH curve shows both.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340 });
      const an0 = params && params.analyte != null ? +params.analyte : 1;
      const ctl = kit.controls(box.side, [
        { id: 'an', type: 'select', label: 'Analyte in the flask', options: ANALYTES.map((a, i) => [a.name, i]), value: an0 },
        { id: 'ind', type: 'select', label: 'Indicator', options: INDICATORS.map((q, i) => [q[0], i]), value: an0 >= 3 ? 1 : 0 },
        { id: 'va', type: 'select', label: 'Aliquot (pipette)', options: [['10.00 mL', 10], ['20.00 mL', 20], ['25.00 mL', 25]], value: 25 },
        { id: 'tap', type: 'select', label: 'Burette tap', options: TAP, value: 0 },
        { id: 'ph', type: 'check', label: 'pH meter in the flask', value: true },
        { id: 'curve', type: 'check', label: 'Show the whole pH curve', value: false },
        { type: 'buttons', items: [{ id: 'drop', label: 'Add one drop', primary: true }, { id: 'refill', label: 'Refill, start again' }, { id: 'new', label: 'New unknown' }, { id: 'reveal', label: 'Reveal the answer' }] }
      ], id => {
        if (id === 'drop') addDrop();
        else if (id === 'refill') refill();
        else if (id === 'new') { unknown(); refill(); }
        else if (id === 'reveal') revealed = true;
        else if (id === 'an') { ctl.set('ind', V.an >= 3 ? 1 : 0); unknown(); refill(); }
        else if (id === 'va') refill();
        full = null; updatePlot(); loop.once();
      });
      const ro = kit.readout(box.side, [['r0', 'Initial reading'], ['r', 'Reading now'], ['titre', 'Titre'], ['pH', 'pH'], ['calc', 'Concentration from this titre'], ['true', 'True concentration']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'titrant added (mL)', min: 0 }, y: { label: 'pH', min: 0, max: 14 } }, 170);
      const V = ctl.values;
      const cT = 0.1000;
      let A = ANALYTES[an0] || ANALYTES[1], cA = 0.1, r0 = 0.5, vt = 0, pts = [], drops = [], flash = 0, flashCol = null, revealed = false, dropAcc = 0, lastRec = -1;
      let full = null, dirty = false, plotT = 0;

      function unknown() {
        A = ANALYTES[V.an] || ANALYTES[1];
        cA = Number((A.lo + (A.hi - A.lo) * Math.random()).toFixed(4));
        revealed = false;
      }
      function refill() {
        A = ANALYTES[V.an] || ANALYTES[1];
        r0 = Math.round((0.1 + Math.random() * 1.4) * 20) / 20;
        vt = 0; pts = []; drops = []; flash = 0; lastRec = -1; dropAcc = 0;
        record(true);
      }
      const va = () => +V.va || 25;
      function pHat(v) {
        const Vt = (va() + v) / 1000, nA = cA * va() / 1000, nT = cT * v / 1000;
        const C = nA / Vt;
        const Na = (A.acid ? nT : 0) / Vt + A.naPer * C;
        const Cl = (A.acid ? 0 : nT) / Vt;
        return solvePH(C, A.Ka, A.z0, Na, Cl);
      }
      const vEq = () => cA * va() * A.ratio / cT;
      function record(force) {
        if (force || vt - lastRec >= 0.049) { pts.push([vt, pHat(vt)]); lastRec = vt; dirty = true; }
      }
      function addDrop() {
        if (r0 + vt >= 50) return;
        drops.push({ y: 0, v: 0.05 });
      }
      function colourAt(pH) {
        const ind = INDICATORS[V.ind] && INDICATORS[V.ind][1];
        const water = [150, 185, 225, 0.22];
        if (!ind) return water;
        const f = 1 / (1 + Math.pow(10, ind.pk - pH));
        const mix = ind.a.map((x, i) => x + (ind.b[i] - x) * f);
        // tint over water
        const al = mix[3];
        return [water[0] * (1 - al) + mix[0] * al, water[1] * (1 - al) + mix[1] * al, water[2] * (1 - al) + mix[2] * al, Math.max(water[3], al)];
      }
      const rgba = q => 'rgba(' + Math.round(q[0]) + ',' + Math.round(q[1]) + ',' + Math.round(q[2]) + ',' + q[3].toFixed(3) + ')';
      function updatePlot() {
        const xmax = Math.max(10, Math.min(50, Math.ceil(vEq() * 1.6 / 5) * 5));
        const series = [{ pts: pts.slice(), label: 'measured', dots: 2.2 }];
        if (V.curve) {
          if (!full) { full = []; for (let v = 0; v <= xmax + 1e-9; v += xmax / 250) full.push([v, pHat(v)]); }
          series.push({ pts: full, label: 'whole curve', dash: [5, 4] });
        }
        dirty = false; plotT = 0;
        const ind = INDICATORS[V.ind] && INDICATORS[V.ind][1];
        plot.set({ x: { label: 'titrant added (mL)', min: 0, max: xmax }, y: { label: 'pH', min: 0, max: 14 }, series,
          vlines: revealed ? [{ x: vEq(), label: 'equivalence' }] : [],
          hlines: ind ? [{ y: ind.pk - 1, label: '' }, { y: ind.pk + 1, label: 'indicator range' }] : [] });
      }

      function frame(dt) {
        const C = kit.colors();
        const c = st.begin();
        const W = st.W, Hh = st.H;
        // flow from the tap
        const rate = +V.tap || 0;
        if (dt && rate > 0 && r0 + vt < 50) {
          if (rate <= 0.1) { dropAcc += rate * dt; while (dropAcc >= 0.05) { dropAcc -= 0.05; addDrop(); } }
          else { vt = Math.min(50 - r0, vt + rate * dt); record(false); if (Math.random() < dt * 12) drops.push({ y: 0, v: 0, deco: true }); }
        }
        // burette geometry
        const bx = W * 0.2, bt = 20, bb = Hh * 0.6, bw = 16;
        const yOf = rd => bt + 10 + (bb - bt - 20) * rd / 50;
        const fx = bx, fBot = Hh - 16, fH = Hh * 0.27, fTop = fBot - fH;
        const tipY = bb + 38;
        // drops falling into the liquid
        const fw = Math.min(120, W * 0.2), neck = 16;
        const surf = fBot - fH * 0.75 * clamp((va() + vt) / 150, 0.12, 0.8);
        for (const d of drops) d.y += (dt || 0) * 260;
        const landed = drops.filter(d => d.y >= surf - tipY);
        drops = drops.filter(d => d.y < surf - tipY);
        for (const d of landed) {
          if (!d.deco && r0 + vt < 50) {
            vt = Math.min(50 - r0, vt + d.v); record(true);
            // where the drop lands the titrant is briefly in excess: a flash of the other colour
            const now = colourAt(pHat(vt)), loc = colourAt(pHat(vt + 0.8));
            if (Math.abs(loc[0] - now[0]) + Math.abs(loc[1] - now[1]) + Math.abs(loc[2] - now[2]) + 200 * Math.abs(loc[3] - now[3]) > 60) { flash = 1; flashCol = loc; }
          }
        }
        plotT += dt || 0;
        if (dirty && plotT > 0.15) updatePlot();
        flash = Math.max(0, flash - (dt || 0) * 1.3);
        const reading = r0 + vt, pH = pHat(vt);
        // stand
        c.strokeStyle = C.muted; c.lineWidth = 3;
        c.beginPath(); c.moveTo(bx - 70, fBot + 6); c.lineTo(bx - 70, 10); c.stroke();
        c.beginPath(); c.moveTo(bx - 70, bt + 40); c.lineTo(bx - bw / 2, bt + 40); c.stroke();
        c.fillStyle = C.surface; c.fillRect(bx - 110, fBot + 2, 220, 8);
        // burette tube and liquid
        c.fillStyle = C.surface; c.fillRect(bx - bw / 2, bt, bw, bb - bt);
        c.fillStyle = 'rgba(150,185,225,0.35)'; c.fillRect(bx - bw / 2, yOf(reading), bw, bb - yOf(reading));
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(bx - bw / 2, bt, bw, bb - bt);
        for (let m = 0; m <= 50; m++) {
          const y = yOf(m), big = m % 5 === 0;
          c.strokeStyle = C.muted; c.lineWidth = 1;
          c.beginPath(); c.moveTo(bx - bw / 2, y); c.lineTo(bx - bw / 2 + (big ? 8 : 4), y); c.stroke();
          if (big && m % 10 === 0) kit.label(c, String(m), bx - bw / 2 - 4, y, { size: 10, color: C.muted, align: 'right' });
        }
        // tap and tip
        c.fillStyle = rate > 0 ? C.ok : C.text;
        c.fillRect(bx - 14, bb + 10, 28, 7);
        c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath(); c.moveTo(bx - bw / 2, bb); c.lineTo(bx - 3, bb + 30); c.lineTo(bx - 2, tipY); c.moveTo(bx + bw / 2, bb); c.lineTo(bx + 3, bb + 30); c.lineTo(bx + 2, tipY); c.stroke();
        for (const d of drops) { c.beginPath(); c.arc(bx, tipY + d.y, 3, 0, Math.PI * 2); c.fillStyle = 'rgba(150,185,225,0.9)'; c.fill(); }
        // magnified scale around the meniscus
        const mx = bx + 30, mw = 86, mh = Math.min(150, Hh * 0.36), my = clamp(yOf(reading) - mh / 2, 8, bb - mh);
        c.fillStyle = C.surface; roundRect(c, mx, my, mw, mh, 8); c.fill();
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.stroke();
        const ppm = mh / 2.4;                                           // pixels per mL in the lens
        const yc = my + mh / 2;
        c.save(); c.beginPath(); c.rect(mx + 1, my + 1, mw - 2, mh - 2); c.clip();
        c.fillStyle = 'rgba(150,185,225,0.35)'; c.fillRect(mx, yc, mw, mh);
        for (let t = Math.floor((reading - 1.3) * 10); t <= Math.ceil((reading + 1.3) * 10); t++) {
          const v = t / 10, y = yc + (v - reading) * ppm;
          if (v < 0 || v > 50) continue;
          const big = t % 10 === 0, mid = t % 5 === 0;
          c.strokeStyle = C.text; c.lineWidth = big ? 1.5 : 1;
          c.beginPath(); c.moveTo(mx + 8, y); c.lineTo(mx + 8 + (big ? 30 : mid ? 22 : 14), y); c.stroke();
          if (big) kit.label(c, String(Math.round(v)), mx + 44, y, { size: 12, weight: 650 });
        }
        // the meniscus: read its bottom
        c.strokeStyle = C.accent; c.lineWidth = 2;
        c.beginPath(); c.moveTo(mx + 4, yc - 5); c.quadraticCurveTo(mx + mw / 2, yc + 5, mx + mw - 4, yc - 5); c.stroke();
        c.restore();
        kit.label(c, 'read the bottom of the meniscus', mx, my + mh + 12, { size: 10.5, color: C.faint });
        // the flask
        const col = colourAt(pH);
        const path = () => { c.beginPath(); c.moveTo(fx - neck / 2, fTop); c.lineTo(fx - neck / 2, fTop + fH * 0.25); c.lineTo(fx - fw / 2, fBot); c.lineTo(fx + fw / 2, fBot); c.lineTo(fx + neck / 2, fTop + fH * 0.25); c.lineTo(fx + neck / 2, fTop); };
        c.save(); path(); c.clip();
        const ly = fBot - fH * 0.75 * clamp((va() + vt) / 150, 0.12, 0.8);
        c.fillStyle = rgba(col); c.fillRect(fx - fw, ly, 2 * fw, fBot - ly);
        if (flash > 0 && flashCol) { c.globalAlpha = flash; c.fillStyle = rgba(flashCol); c.beginPath(); c.ellipse(fx, ly + 12, fw * 0.25 * (1.6 - flash), 9, 0, 0, Math.PI * 2); c.fill(); c.globalAlpha = 1; }
        c.restore();
        path(); c.strokeStyle = C.text; c.lineWidth = 1.8; c.stroke();
        // the calculation panel
        const px = W * 0.52, pw = W * 0.46;
        const titre = vt;
        const cCalc = cT * titre / A.ratio / va();
        kit.label(c, A.eq, px, 22, { size: 14, weight: 650 });
        const lines = [
          ['aliquot', va().toFixed(2) + ' mL of unknown'],
          ['titrant', cT.toFixed(4) + ' M ' + (A.acid ? 'NaOH' : 'HCl')],
          ['initial reading', r0.toFixed(2) + ' mL'],
          ['reading now', reading.toFixed(2) + ' mL'],
          ['titre', titre.toFixed(2) + ' mL'],
          ['n(titrant)', kit.fmt(cT * titre, 4) + ' mmol'],
          ['n(analyte) = n ÷ ' + A.ratio, kit.fmt(cT * titre / A.ratio, 4) + ' mmol'],
          ['c(analyte)', titre > 0 ? kit.fmt(cCalc, 4) + ' M' : '—']
        ];
        lines.forEach((q, i) => {
          const y = 52 + i * 22;
          kit.label(c, q[0], px, y, { size: 12.5, color: C.muted });
          kit.label(c, q[1], px + pw - 8, y, { size: 13, weight: i === 7 ? 700 : 550, align: 'right', color: i === 7 ? C.accent : C.text });
        });
        if (V.ph) {
          const y = 52 + lines.length * 22 + 14;
          c.fillStyle = C.bg2; roundRect(c, px, y - 14, 110, 30, 6); c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1; c.stroke();
          kit.label(c, 'pH ' + pH.toFixed(2), px + 55, y + 1, { size: 15, weight: 700, align: 'center', color: C.ok });
        }
        if (revealed) kit.label(c, 'true: ' + cA.toFixed(4) + ' M; equivalence at ' + vEq().toFixed(2) + ' mL', px, Hh - 18, { size: 12.5, weight: 600, color: C.warn });
        if (r0 + vt >= 50 - 1e-9) kit.label(c, 'burette empty — refill', bx + 30, Hh - 20, { size: 12, color: C.bad });
        ro.set('r0', r0.toFixed(2) + ' mL');
        ro.set('r', reading.toFixed(2) + ' mL');
        ro.set('titre', titre.toFixed(2) + ' mL');
        ro.set('pH', V.ph ? pH.toFixed(2) : 'meter off');
        ro.set('calc', titre > 0 ? kit.fmt(cCalc, 4) + ' M' : '—');
        ro.set('true', revealed ? cA.toFixed(4) + ' M' : 'hidden: press Reveal');
      }
      unknown(); refill(); updatePlot();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
