/* HYPER-CHEMISTRY · sims/thermo-kinetics.js — simulations for thermochemistry,
 * entropy and free energy, reaction rates and mechanisms: a coffee-cup calorimeter,
 * a Hess's-law staircase (through the elements or through gaseous atoms), molecules
 * spreading over boxes (S = k ln W), the ΔG = ΔH − TΔS map, zero-, first- and
 * second-order decay, an initial-rates puzzle, Maxwell–Boltzmann tails with an
 * Arrhenius plot, reaction profiles with catalysts and intermediates, and enzymes
 * following Michaelis–Menten kinetics. */
(function () {
  'use strict';

  const R = 8.314462618, KB = 1.380649e-23;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const num = (v, d) => { const x = +v; return v != null && Number.isFinite(x) ? x : d; };
  const gauss = () => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const plus = (kit, v, sig) => (v > 0 ? '+' : '') + kit.fmt(v, sig);
  // least-squares straight line through [[x, y], ...]: { m, c, r2 } or null
  function linfit(pts) {
    const n = pts.length;
    if (n < 2) return null;
    let sx = 0, sy = 0, sxx = 0, sxy = 0, syy = 0;
    for (const [x, y] of pts) { sx += x; sy += y; sxx += x * x; sxy += x * y; syy += y * y; }
    const d = n * sxx - sx * sx;
    if (Math.abs(d) < 1e-300) return null;
    const m = (n * sxy - sx * sy) / d, c = (sy - m * sx) / n;
    const vy = n * syy - sy * sy;
    const r2 = vy > 1e-300 ? Math.pow(n * sxy - sx * sy, 2) / (d * vy) : 1;
    return { m, c, r2: clamp(r2, 0, 1) };
  }
  // complementary error function, relative accuracy about 1e-7 everywhere
  function erfc(x) {
    const z = Math.abs(x), t = 1 / (1 + 0.5 * z);
    const r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 + t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
      t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277)))))))));
    return x >= 0 ? r : 2 - r;
  }
  const LNF = [0];
  function lnFact(n) {
    n = Math.max(0, Math.round(n));
    while (LNF.length <= n) LNF.push(LNF[LNF.length - 1] + Math.log(LNF.length));
    return LNF[n];
  }
  function setLabel(ctl, id, text) {
    const r = ctl.rows[id], lab = r && r.row && r.row.querySelector && r.row.querySelector('.cl span');
    if (lab) lab.textContent = text;
  }
  function graphBox(box) {
    const g = document.createElement('div');
    g.style.padding = '4px 10px 10px';
    box.stage.appendChild(g);
    return g;
  }
  const darker = hex => {
    const n = parseInt(String(hex).slice(1), 16);
    if (!Number.isFinite(n)) return 'rgba(0,0,0,.5)';
    return 'rgb(' + [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v * 0.65)).join(',') + ')';
  };

  /* ================================================================ calorimeter */
  const CAL = [
    { name: 'HCl + NaOH: neutralisation', kind: 'mix', dH: -57.1, tau: 6, eq: 'H⁺(aq) + OH⁻(aq) → H₂O(l)', what: '50 mL HCl + 50 mL NaOH' },
    { name: 'NaOH dissolving', kind: 'solid', f: 'NaOH', dH: -44.5, tau: 25, eq: 'NaOH(s) → Na⁺(aq) + OH⁻(aq)', what: 'NaOH pellets' },
    { name: 'CaCl₂ dissolving', kind: 'solid', f: 'CaCl2', dH: -81.3, tau: 30, eq: 'CaCl₂(s) → Ca²⁺(aq) + 2Cl⁻(aq)', what: 'anhydrous CaCl₂' },
    { name: 'NH₄NO₃ dissolving (cold pack)', kind: 'solid', f: 'NH4NO3', dH: 25.7, tau: 35, eq: 'NH₄NO₃(s) → NH₄⁺(aq) + NO₃⁻(aq)', what: 'NH₄NO₃ crystals' },
    { name: 'Magnesium in excess acid', kind: 'metal', f: 'Mg', dH: -466.9, tau: 50, eq: 'Mg(s) + 2H⁺(aq) → Mg²⁺(aq) + H₂(g)', what: 'Mg ribbon, 100 mL of 2 M HCl' }
  ];
  const T_ROOM = 21.0, C_CUP = 15, C_W = 4.18, T_MIX = 60, T_END = 600, DT_READ = 10;

  Hyper.sim('tk-calorimeter', {
    title: 'Coffee-cup calorimeter',
    blurb: `A reaction runs inside an insulated cup of water, and the thermometer is read every 10 s: a minute of steady readings, then the reactants meet at 60 s. The cooling line after the peak is extrapolated back to the moment of mixing; the jump there is ΔT, which gives $q = mc\\Delta T$ and $\\Delta H = -q/n$.

- Compare **Largest change seen** with the extrapolated ΔT: the difference is heat that leaked away while the reaction was still running. Set the heat loss to 0 and they agree.
- Tick **Include the cup**: the measured ΔH moves closer to the data-book value.
- Try the cold pack: the temperature falls, ΔT is negative and ΔH comes out positive.
- Magnesium reacts slowly and loses much of its heat before it finishes — extrapolation matters most there.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const rx0 = clamp(Math.round(num(params && params.rx, 0)), 0, CAL.length - 1);
      const ctl = kit.controls(box.side, [
        { id: 'rx', type: 'select', label: 'Reaction', options: CAL.map((r, i) => [r.name, i]), value: rx0 },
        { id: 'conc', label: 'Concentration of each solution', min: 0.25, max: 2, step: 0.05, value: 1, unit: 'M' },
        { id: 'mass', label: 'Mass of solid (into 100 g of water)', min: 0.5, max: 10, step: 0.1, value: 4, unit: 'g' },
        { id: 'mg', label: 'Mass of magnesium', min: 0.05, max: 0.5, step: 0.01, value: 0.2, unit: 'g' },
        { id: 'loss', label: 'Heat-loss constant (10⁻³ per second)', min: 0, max: 3, step: 0.1, value: 1 },
        { id: 'cup', type: 'check', label: 'Include the cup (15 J/K) in the calculation', value: false },
        { id: 'fast', type: 'check', label: 'Fast forward', value: false },
        { type: 'buttons', items: [{ id: 'run', label: 'New run', primary: true }] }
      ], id => { if (id === 'cup') analyse(); else if (id !== 'fast') setup(); });
      const ro = kit.readout(box.side, [['base', 'Starting temperature'], ['peak', 'Largest change seen'], ['dT', 'ΔT extrapolated to mixing'],
        ['q', 'Heat absorbed by the solution'], ['n', 'Amount reacting'], ['dH', 'ΔH measured'], ['book', 'ΔH (data book)']]);
      const plot = kit.plot(graphBox(box), { x: { label: 'time (s)', min: 0, max: T_END }, y: { label: 'temperature (°C)' }, legend: true }, 190);
      const V = ctl.values;
      let run = null, shown = -1;
      const crystals = Array.from({ length: 14 }, () => ({ x: Math.random(), y: Math.random(), s: 0.7 + Math.random() * 0.6 }));

      function molar(f) { const M = kit.chem.molarMass(f); return Number.isFinite(M) && M > 0 ? M : 100; }
      function setup() {
        const r = CAL[V.rx] || CAL[0];
        ctl.show('conc', r.kind === 'mix'); ctl.show('mass', r.kind === 'solid'); ctl.show('mg', r.kind === 'metal');
        let n, m;
        if (r.kind === 'mix') { n = V.conc * 0.05; m = 100; }
        else if (r.kind === 'solid') { n = V.mass / molar(r.f); m = 100 + V.mass; }
        else { n = V.mg / molar(r.f); m = 100 + V.mg; }
        run = { r, n, m, t: 0, T: T_ROOM, reads: [], next: 0, an: null, bub: [] };
        run.Ctot = m * C_W + C_CUP;
        run.Qtot = -n * r.dH * 1000;
        shown = -1;
        ro.set('book', kit.fmt(r.dH, 4) + ' kJ/mol');
        analyse();
      }
      function advance(dts) {
        let left = dts;
        while (left > 1e-9 && run.t < T_END) {
          const d = Math.min(0.25, left, T_END - run.t);
          const t0 = run.t, t1 = t0 + d;
          if (t1 > T_MIX) {
            const a = Math.max(0, t0 - T_MIX), b = t1 - T_MIX;
            run.T += run.Qtot * (Math.exp(-a / run.r.tau) - Math.exp(-b / run.r.tau)) / run.Ctot;
          }
          run.T -= V.loss * 1e-3 * (run.T - T_ROOM) * d;
          run.t = t1;
          while (run.next <= run.t + 1e-9 && run.next <= T_END) {
            run.reads.push([run.next, Math.round((run.T + 0.015 * gauss()) * 100) / 100]);
            run.next += DT_READ;
          }
          left -= d;
        }
      }
      function analyse() {
        const C = kit.colors();
        const rd = run.reads, r = run.r;
        const base = rd.filter(p => p[0] < T_MIX);
        const b = base.length ? base.reduce((s, p) => s + p[1], 0) / base.length : T_ROOM;
        const after = rd.filter(p => p[0] > T_MIX);
        const an = { base: b, nb: base.length, peak: null, ext: null, dT: null, fit: null, q: null, dH: null };
        if (after.length) {
          const s = r.dH < 0 ? 1 : -1;
          let best = after[0];
          for (const p of after) if (s * (p[1] - best[1]) > 0) best = p;
          an.peak = best[1] - b;
          // the reaction is taken as over once a reading first comes within 0.5 % (or 0.03 K)
          // of the extreme; fit the next few minutes of cooling (a short stretch stays straight)
          const near = s * an.peak - Math.max(0.005 * Math.abs(an.peak), 0.03);
          const done = after.find(p => s * (p[1] - b) >= near) || best;
          const tail = after.filter(p => p[0] >= done[0] + 20 && p[0] <= done[0] + 170);
          if (tail.length >= 5 && Math.abs(an.peak) > 0.05) {
            const f = linfit(tail);
            if (f) { an.fit = f; an.ext = f.m * T_MIX + f.c; an.dT = an.ext - b; }
          }
        }
        if (an.dT != null && run.n > 0) {
          an.q = (run.m * C_W + (V.cup ? C_CUP : 0)) * an.dT;
          an.dH = -an.q / run.n / 1000;
        }
        run.an = an;
        ro.set('base', base.length ? b.toFixed(2) + ' °C' : '—');
        ro.set('peak', an.peak == null ? '—' : plus(kit, an.peak, 3) + ' K');
        ro.set('dT', an.dT == null ? (after.length ? 'waiting for the cooling line' : '—') : plus(kit, an.dT, 3) + ' K');
        ro.set('q', an.q == null ? '—' : kit.fmt(an.q, 4) + ' J');
        ro.set('n', kit.fmt(run.n, 3) + ' mol');
        ro.set('dH', an.dH == null ? '—' : kit.fmt(an.dH, 3) + ' kJ/mol');
        const ys = rd.map(p => p[1]).concat([T_ROOM]);
        if (an.ext != null) ys.push(an.ext);
        let lo = Math.min(...ys), hi = Math.max(...ys);
        if (hi - lo < 1) { lo -= 0.5; hi += 0.5; }
        const pad = (hi - lo) * 0.08;
        const series = [{ pts: rd.slice(), line: false, dots: 2.6, label: 'thermometer readings', color: C.accent }];
        if (an.fit) series.push({ pts: [[T_MIX, an.ext], [T_END, an.fit.m * T_END + an.fit.c]], dash: [6, 4], width: 1.6, label: 'cooling line, extrapolated', color: C.warn });
        plot.set({ x: { label: 'time (s)', min: 0, max: T_END }, y: { label: 'temperature (°C)', min: lo - pad, max: hi + pad }, series,
          vlines: [{ x: T_MIX, label: 'mixed' }], hlines: base.length ? [{ y: b }] : [],
          marks: an.ext != null ? [{ x: T_MIX, y: an.ext, label: 'ΔT = ' + plus(kit, an.dT, 3) + ' K' }] : [] });
      }

      function draw(dt) {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, r = run.r;
        const dT = run.T - T_ROOM;
        const since = run.t - T_MIX, prog = since > 0 ? 1 - Math.exp(-since / r.tau) : 0;
        const cx = Math.max(90, W * 0.19), top = 78, bot = H - 20;
        const wT = Math.min(W * 0.26, 180), wB = wT * 0.78;
        const cupPath = inset => {
          c.beginPath();
          c.moveTo(cx - wT / 2 + inset, top + inset * 0.4); c.lineTo(cx + wT / 2 - inset, top + inset * 0.4);
          c.lineTo(cx + wB / 2 - inset, bot - inset); c.lineTo(cx - wB / 2 + inset, bot - inset); c.closePath();
        };
        kit.label(c, r.eq, 14, 18, { size: 14, weight: 650 });
        // outer and inner cup
        cupPath(0); c.fillStyle = C.surface; c.fill(); c.strokeStyle = C.muted; c.lineWidth = 1.5; c.stroke();
        cupPath(8); c.strokeStyle = C.faint; c.lineWidth = 1; c.stroke();
        // the liquid, tinted by its temperature
        const lvl = top + (bot - top) * 0.28;
        c.save(); cupPath(8); c.clip();
        c.fillStyle = C.hue(clamp(205 - 19 * dT, 0, 250), 0.4);
        c.fillRect(cx - wT, lvl, wT * 2, bot - lvl);
        // dissolving crystals or a shrinking ribbon, with hydrogen bubbles
        if (since > 0 && r.kind === 'solid') {
          c.fillStyle = C.text2;
          for (const k of crystals) {
            const s = 4.5 * k.s * Math.sqrt(Math.max(0, 1 - prog));
            if (s > 0.4) c.fillRect(cx - wB * 0.35 + k.x * wB * 0.7, bot - 14 - k.y * 18, s, s);
          }
        }
        if (since > 0 && r.kind === 'metal') {
          const L = wB * 0.5 * Math.max(0, 1 - prog);
          c.fillStyle = C.muted; c.fillRect(cx - L / 2, bot - 16, L, 3);
          if (dt > 0 && Math.random() < (1 - prog) * 0.9) run.bub.push({ x: cx + (Math.random() - 0.5) * L, y: bot - 18, r: 1.5 + Math.random() * 2 });
          for (const b of run.bub) b.y -= 40 * (dt || 0);
          run.bub = run.bub.filter(b => b.y > lvl);
          c.strokeStyle = C.text2; c.lineWidth = 1;
          for (const b of run.bub) { c.beginPath(); c.arc(b.x, b.y, b.r, 0, Math.PI * 2); c.stroke(); }
        }
        c.restore();
        // lid, stirrer and thermometer
        c.fillStyle = C.faint; c.fillRect(cx - wT / 2 - 6, top - 8, wT + 12, 8);
        c.strokeStyle = C.muted; c.lineWidth = 2;
        const sx = cx - wT * 0.18;
        c.beginPath(); c.moveTo(sx, top - 34); c.lineTo(sx, bot - 22); c.stroke();
        c.beginPath(); c.ellipse(sx, bot - 20, 12, 3, 0, 0, Math.PI * 2); c.stroke();
        const tx = cx + wT * 0.16, tb = lvl + (bot - lvl) * 0.62;
        c.fillStyle = C.surface; c.strokeStyle = C.muted; c.lineWidth = 1.2;
        c.fillRect(tx - 4, top - 46, 8, tb - top + 46); c.strokeRect(tx - 4, top - 46, 8, tb - top + 46);
        const colTop = clamp(tb - (run.T - 10) * 3.2, top - 44, tb);
        c.fillStyle = C.bad; c.fillRect(tx - 1.8, colTop, 3.6, tb - colTop);
        kit.dot(c, tx, tb + 4, 7, C.bad, C.muted);
        // what is waiting to go in
        if (since <= 0) {
          const bx = cx + wT / 2 + 14, by = top - 10;
          if (r.kind === 'mix') {
            c.fillStyle = C.hue(205, 0.35); c.fillRect(bx, by + 10, 34, 28);
            c.strokeStyle = C.muted; c.strokeRect(bx, by, 34, 38);
          } else {
            c.strokeStyle = C.muted; c.beginPath(); c.moveTo(bx - 4, by + 30); c.lineTo(bx + 40, by + 30); c.lineTo(bx + 34, by + 38); c.lineTo(bx + 2, by + 38); c.closePath(); c.stroke();
            c.fillStyle = r.kind === 'metal' ? C.muted : C.text2;
            if (r.kind === 'metal') c.fillRect(bx + 4, by + 26, 28, 3);
            else for (const k of crystals) c.fillRect(bx + 3 + k.x * 28, by + 23 + k.y * 5, 3.5, 3.5);
          }
          kit.label(c, r.what, bx + 17, by - 8, { size: 11, color: C.muted, align: 'center' });
        }
        // the lab notebook
        const nx = Math.max(cx + wT / 2 + 70, W * 0.44), an = run.an || {};
        let y = 52;
        const line = (t, col, wgt) => { kit.label(c, t, nx, y, { size: 13, color: col || C.text, weight: wgt || 500 }); y += 22; };
        kit.label(c, run.T.toFixed(2) + ' °C', nx, 22, { size: 22, weight: 700, color: C.accent });
        kit.label(c, 't = ' + Math.round(run.t) + ' s' + (run.t >= T_END ? ' (finished)' : ''), nx + 120, 24, { size: 12.5, color: C.muted });
        line('Before mixing: ' + (an.nb ? an.base.toFixed(2) + ' °C (mean of ' + an.nb + ' readings)' : '—'), C.text2);
        if (an.ext != null) {
          line('Cooling line back to 60 s: ' + an.ext.toFixed(2) + ' °C', C.text2);
          line('ΔT = ' + plus(kit, an.dT, 3) + ' K', C.text, 650);
          line('q = (' + kit.fmt(run.m, 4) + ' g × 4.18 J/(g·K)' + (V.cup ? ' + 15 J/K' : '') + ') × ΔT = ' + kit.fmt(an.q, 4) + ' J', C.text2);
          line('n = ' + kit.fmt(run.n, 3) + ' mol', C.text2);
          line('ΔH = −q/n = ' + kit.fmt(an.dH, 3) + ' kJ/mol   (book: ' + kit.fmt(r.dH, 4) + ')', C.text, 650);
        } else line(since > 0 ? 'Reacting… waiting for the cooling line' : 'Recording the starting temperature', C.muted);
      }

      function frame(dt) {
        if (run.t < T_END && dt > 0) {
          advance(dt * (V.fast ? 60 : 12));
          if (run.reads.length !== shown) { shown = run.reads.length; analyse(); }
        }
        draw(dt);
      }
      setup();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Hess's law staircase */
  const HESS = [
    { name: 'CH₄ + 2O₂ → CO₂ + 2H₂O(l)', r: [['CH₄', 1, -74.8], ['O₂', 2, 0]], p: [['CO₂', 1, -393.5], ['H₂O(l)', 2, -285.8]],
      bonds: { gas: -802.3, note: 'water as vapour', br: [['C–H', 4, 413], ['O=O', 2, 498]], fo: [['C=O', 2, 799], ['O–H', 4, 463]] } },
    { name: 'C₃H₈ + 5O₂ → 3CO₂ + 4H₂O(l)', r: [['C₃H₈', 1, -103.8], ['O₂', 5, 0]], p: [['CO₂', 3, -393.5], ['H₂O(l)', 4, -285.8]],
      bonds: { gas: -2043.9, note: 'water as vapour', br: [['C–C', 2, 348], ['C–H', 8, 413], ['O=O', 5, 498]], fo: [['C=O', 6, 799], ['O–H', 8, 463]] } },
    { name: 'C₂H₅OH(l) + 3O₂ → 2CO₂ + 3H₂O(l)', r: [['C₂H₅OH(l)', 1, -277.7], ['O₂', 3, 0]], p: [['CO₂', 2, -393.5], ['H₂O(l)', 3, -285.8]] },
    { name: 'N₂ + 3H₂ → 2NH₃', r: [['N₂', 1, 0], ['H₂', 3, 0]], p: [['NH₃', 2, -46.1]],
      bonds: { gas: -92.2, br: [['N≡N', 1, 945], ['H–H', 3, 436]], fo: [['N–H', 6, 391]] } },
    { name: 'C₂H₄ + H₂ → C₂H₆', r: [['C₂H₄', 1, 52.3], ['H₂', 1, 0]], p: [['C₂H₆', 1, -84.7]],
      bonds: { gas: -137.0, note: 'the four C–H of ethene are kept', br: [['C=C', 1, 614], ['H–H', 1, 436]], fo: [['C–C', 1, 348], ['C–H', 2, 413]] } },
    { name: 'H₂ + Cl₂ → 2HCl', r: [['H₂', 1, 0], ['Cl₂', 1, 0]], p: [['HCl', 2, -92.3]],
      bonds: { gas: -184.6, br: [['H–H', 1, 436], ['Cl–Cl', 1, 243]], fo: [['H–Cl', 2, 432]] } },
    { name: 'CaCO₃ → CaO + CO₂', r: [['CaCO₃', 1, -1206.9]], p: [['CaO', 1, -635.1], ['CO₂', 1, -393.5]] },
    { name: '2Al + Fe₂O₃ → Al₂O₃ + 2Fe (thermite)', r: [['Al', 2, 0], ['Fe₂O₃', 1, -824.2]], p: [['Al₂O₃', 1, -1675.7], ['Fe', 2, 0]] }
  ];

  Hyper.sim('tk-hess', {
    title: 'Hess\'s law: an energy staircase',
    blurb: `Enthalpy is a state function, so any route from reactants to products gives the same ΔH. **Via the elements**: take the reactants apart into their elements (climbing back over their formation enthalpies), then build the products — ΔH° = Σν ΔHf°(products) − Σν ΔHf°(reactants). **Via gaseous atoms**: break every bond, then make the new ones — an estimate from mean bond enthalpies. The dot walks the route.

- For methane the two routes agree within a few kJ/mol (the bond route uses water vapour, so compare it with −802 kJ/mol).
- For ethene + hydrogen the bond estimate misses by about 10 %: mean bond enthalpies are averages.
- Limestone has ΔH > 0: the product staircase ends above the reactants. Thermite drops by 850 kJ/mol.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340 });
      const rx0 = clamp(Math.round(num(params && params.rx, 0)), 0, HESS.length - 1);
      const rt0 = clamp(Math.round(num(params && params.route, 0)), 0, 1);
      const ctl = kit.controls(box.side, [
        { id: 'rx', type: 'select', label: 'Reaction', options: HESS.map((r, i) => [r.name, i]), value: rx0 },
        { id: 'route', type: 'select', label: 'Route', options: [['via the elements (formation enthalpies)', 0], ['via gaseous atoms (bond enthalpies)', 1]], value: rt0 },
        { id: 'walk', type: 'check', label: 'Walk the route', value: true }
      ], () => { phase = 0; update(); loop.once(); });
      const ro = kit.readout(box.side, [['sp', 'Σν ΔHf° of the products'], ['sr', 'Σν ΔHf° of the reactants'], ['dh', 'ΔH° = products − reactants'],
        ['bb', 'Bonds broken'], ['bf', 'Bonds formed'], ['be', 'ΔH from bond enthalpies'], ['err', 'Bond estimate against data']]);
      const V = ctl.values;
      let phase = 0;
      const sum = list => list.reduce((s, q) => s + q[1] * q[2], 0);
      function update() {
        const X = HESS[V.rx] || HESS[0];
        const sp = sum(X.p), sr = sum(X.r);
        ro.set('sp', kit.fmt(sp, 5) + ' kJ'); ro.set('sr', kit.fmt(sr, 5) + ' kJ'); ro.set('dh', kit.fmt(sp - sr, 5) + ' kJ/mol');
        if (X.bonds) {
          const bb = sum(X.bonds.br), bf = sum(X.bonds.fo), be = bb - bf;
          ro.set('bb', '+' + kit.fmt(bb, 5) + ' kJ'); ro.set('bf', '−' + kit.fmt(bf, 5) + ' kJ'); ro.set('be', kit.fmt(be, 4) + ' kJ/mol');
          ro.set('err', plus(kit, be - X.bonds.gas, 3) + ' kJ/mol from the data value ' + kit.fmt(X.bonds.gas, 5) + (X.bonds.note ? ' (' + X.bonds.note + ')' : ''));
        } else {
          ['bb', 'bf', 'be'].forEach(k => ro.set(k, '—'));
          ro.set('err', 'no bond data: ionic solids or liquids');
        }
      }

      function frame(dt) {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const X = HESS[V.rx] || HESS[0];
        const bondsRoute = V.route === 1 && !!X.bonds;
        // the steps of the two staircases, as energies (kJ)
        let left, right, mid, midLabel, startE, endE, trueE = null;
        const stair = (list, e0, sign) => { let e = e0; return list.map(([f, nu, h]) => { const a = e; e += sign * nu * h; return { f, nu, h, e0: a, e1: e }; }); };
        if (bondsRoute) {
          left = stair(X.bonds.br, 0, 1);
          mid = left[left.length - 1].e1;
          right = stair(X.bonds.fo, mid, -1);
          startE = 0; endE = right[right.length - 1].e1; trueE = X.bonds.gas;
          midLabel = 'gaseous atoms';
        } else {
          // reactants are taken apart (their formation reversed), products built from the elements
          const rs = stair(X.r, 0, 1), ps = stair(X.p, 0, 1);
          left = rs; right = ps; mid = 0;
          startE = rs[rs.length - 1].e1; endE = ps[ps.length - 1].e1;
          midLabel = 'elements in their standard states';
        }
        const Es = [0, mid, startE, endE].concat(left.map(s => s.e1), right.map(s => s.e1));
        if (trueE != null) Es.push(trueE);
        let lo = Math.min(...Es), hi = Math.max(...Es);
        if (hi - lo < 50) { hi += 25; lo -= 25; }
        const pad = (hi - lo) * 0.12;
        lo -= pad; hi += pad;
        const y0 = 44, y1 = H - 22;
        const Y = e => y1 - (e - lo) / (hi - lo) * (y1 - y0);
        const xs = W < 520 ? 24 : 34, gapM = W < 520 ? 34 : 56;
        const xL = W * 0.05, xR = W * 0.95, xM = W * 0.5;
        // steps are placed in the order the walker meets them: the reactant staircase is
        // descended (elements route) or climbed (bond route) towards the middle
        const nL = left.length;
        const stepX = (i, side) => side < 0 ? xM - gapM - (bondsRoute ? nL - 1 - i : i) * xs : xM + gapM + i * xs;
        kit.label(c, X.name, 14, 18, { size: 15, weight: 650 });
        kit.label(c, bondsRoute ? 'route: break every bond, then form the new ones' : 'route: through the elements', W - 14, 18, { size: 12, color: C.muted, align: 'right' });
        if (V.route === 1 && !X.bonds) kit.label(c, 'Bond enthalpies describe covalent gases — showing the route through the elements', W / 2, 36, { size: 11.5, color: C.warn, align: 'center' });
        // the route as a faint path
        const farL = Math.min(...left.map((s, i) => stepX(i, -1))), farR = Math.max(...right.map((s, i) => stepX(i, 1)));
        const path = [[xL, Y(startE)]];
        if (bondsRoute) left.forEach((s, i) => { const x = stepX(i, -1); path.push([x, Y(s.e0)], [x, Y(s.e1)]); });
        else for (let i = nL - 1; i >= 0; i--) { const s = left[i], x = stepX(i, -1); path.push([x, Y(s.e1)], [x, Y(s.e0)]); }
        right.forEach((s, i) => { const x = stepX(i, 1); path.push([x, Y(s.e0)], [x, Y(s.e1)]); });
        path.push([xR, Y(endE)]);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath();
        path.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke();
        // the middle level: the elements, or the gaseous atoms
        c.strokeStyle = C.muted; c.lineWidth = 2; c.setLineDash(bondsRoute ? [] : [6, 4]);
        c.beginPath(); c.moveTo(xM - gapM - 6, Y(mid)); c.lineTo(xM + gapM + 6, Y(mid)); c.stroke(); c.setLineDash([]);
        kit.label(c, midLabel + (bondsRoute ? ' (+' + kit.fmt(mid, 5) + ' kJ)' : ' (0 kJ)'), xM, Y(mid) + (bondsRoute ? -12 : 12), { size: 11.5, color: C.text2, align: 'center', bg: C.bg2 });
        // start and end levels
        const level = (e, xa, xb, text, col, dash, above) => {
          c.strokeStyle = col; c.lineWidth = dash ? 1.5 : 3; c.setLineDash(dash || []);
          c.beginPath(); c.moveTo(xa, Y(e)); c.lineTo(xb, Y(e)); c.stroke(); c.setLineDash([]);
          kit.label(c, text, (xa + xb) / 2, Y(e) + (above ? -11 : 12), { size: 11.5, color: col, align: 'center', bg: C.bg2 });
        };
        level(startE, xL, farL + 4, 'reactants ' + kit.fmt(startE, 5) + ' kJ', C.series[0], null, startE > endE);
        level(endE, farR - 4, xR, (bondsRoute ? 'products (estimate) ' : 'products ') + kit.fmt(endE, 5) + ' kJ', C.series[2], null, endE > startE);
        if (trueE != null) level(trueE, farR - 4, xR, 'from data: ' + kit.fmt(trueE, 5), C.muted, [5, 4], !(endE > startE));
        // the steps, as arrows in the direction of formation (or of breaking and making bonds)
        const drawStair = (list, side) => {
          list.forEach((s, i) => {
            const x = stepX(i, side), col = C.series[side < 0 ? 1 : 4];
            if (Math.abs(s.e1 - s.e0) > 0.05) kit.arrow(c, x, Y(s.e0), x, Y(s.e1), col, 2);
            else kit.dot(c, x, Y(s.e0), 3, col);
            const txt = (s.nu > 1 ? s.nu + ' ' : '') + s.f + ' ' + (s.e1 - s.e0 >= 0 ? '+' : '') + kit.fmt(s.e1 - s.e0, 4);
            kit.label(c, txt, x + (side < 0 ? -5 : 5), (Y(s.e0) + Y(s.e1)) / 2 + (i % 2 ? 9 : -9), { size: 10.5, color: C.text2, align: side < 0 ? 'right' : 'left', bg: C.bg2 });
          });
        };
        drawStair(left, -1);
        drawStair(right, 1);
        // the direct arrow
        const dH = endE - startE, col = dH < 0 ? C.warn : C.accent;
        c.strokeStyle = C.faint; c.setLineDash([3, 4]); c.lineWidth = 1;
        c.beginPath(); c.moveTo(farL, Y(startE)); c.lineTo(xM, Y(startE)); c.moveTo(xM, Y(endE)); c.lineTo(farR, Y(endE)); c.stroke(); c.setLineDash([]);
        kit.arrow(c, xM, Y(startE), xM, Y(endE), col, 3.5);
        const ly = (Y(startE) + Y(endE)) / 2;
        kit.label(c, 'ΔH = ' + kit.fmt(dH, 5) + ' kJ/mol', xM, ly - 9, { size: 13, weight: 700, color: col, align: 'center', bg: C.bg2 });
        kit.label(c, dH < 0 ? 'exothermic' : 'endothermic', xM, ly + 10, { size: 11, color: C.muted, align: 'center', bg: C.bg2 });
        // the walker
        if (V.walk) {
          let total = 0;
          const segs = [];
          for (let i = 1; i < path.length; i++) { const L = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); segs.push(L); total += L; }
          phase = total > 0 ? (phase + (dt || 0) * 110) % (total + 60) : 0;
          let d = Math.min(phase, total), k = 0;
          while (k < segs.length - 1 && d > segs[k]) { d -= segs[k]; k++; }
          const a = path[k], b = path[k + 1] || a, u = segs[k] > 0 ? clamp(d / segs[k], 0, 1) : 0;
          kit.dot(c, a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, 6, C.accent, C.surface);
        }
      }
      update();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ microstates */
  Hyper.sim('tk-microstates', {
    title: 'Spreading out: microstates and S = k ln W',
    blurb: `Bromine molecules start in the left half of a box. Remove the partition and they wander at random. Split the box into regions and count **W**, the number of ways of putting the molecules into regions with the counts you see; Boltzmann's entropy is $S = k_B \\ln W$.

- With 2 halves, all in one half has W = 1 (S = 0); an even split has the most arrangements. The entropy climbs, then jiggles just below its maximum.
- The chance that all the molecules are back in the left half at a given moment is (½)ᴺ. Try N = 4, then N = 80.
- More regions (finer counting) give larger W, but the same rise on opening: N k ln 2 when the volume doubles.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const ctl = kit.controls(box.side, [
        { id: 'N', label: 'Number of molecules', min: 2, max: 80, step: 1, value: 24 },
        { id: 'M', type: 'select', label: 'Count positions in', options: [['2 halves', 2], ['4 cells', 4], ['16 cells', 16]], value: 2 },
        { id: 'speed', label: 'Speed', min: 0.2, max: 3, step: 0.1, value: 1 },
        { type: 'buttons', items: [{ id: 'open', label: 'Remove the partition', primary: true }, { id: 'back', label: 'Put them all back' }] }
      ], id => {
        if (id === 'open') open = true;
        else if (id === 'back' || id === 'N') reset();
        else if (id === 'M') hist = [];
        loop.once();
      });
      const ro = kit.readout(box.side, [['occ', 'Molecules in each region'], ['W', 'Arrangements W'], ['lnW', 'ln W'], ['S', 'S = k_B ln W'],
        ['max', 'Most probable: ln W'], ['back', 'Chance all are in the left half']]);
      const plot = kit.plot(graphBox(box), { x: { label: 'time (s)' }, y: { label: 'ln W', min: 0 } }, 160);
      const V = ctl.values;
      const BR = kit.chem.el('Br'), brCol = (BR && BR.color) || '#a62929';
      let mols = [], open = false, hist = [], clock = 0, lastPush = -1;
      function reset() {
        open = false; mols = []; hist = []; clock = 0; lastPush = -1;
        const N = Math.round(V.N);
        for (let i = 0; i < N; i++) mols.push({ x: 0.04 + Math.random() * 0.42, y: 0.06 + Math.random() * 0.88, a: Math.random() * Math.PI * 2, th: Math.random() * 6.3, w: (Math.random() - 0.5) * 5 });
      }
      function regionOf(m, M) {
        const g = M === 16 ? 4 : M === 4 ? 2 : 1;
        const col = Math.min(M === 2 ? 1 : g - 1, Math.floor(m.x * (M === 2 ? 2 : g)));
        const row = M === 2 ? 0 : Math.min(g - 1, Math.floor(m.y * g));
        return M === 2 ? col : row * g + col;
      }
      function counts() {
        const M = V.M, n = new Array(M).fill(0);
        for (const m of mols) n[regionOf(m, M)]++;
        return n;
      }
      function lnWmax(N, M) { const q = Math.floor(N / M), rem = N % M; return lnFact(N) - (M - rem) * lnFact(q) - rem * lnFact(q + 1); }

      function frame(dt) {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const v = 0.22 * V.speed;
        for (const m of mols) {
          m.a += gauss() * 2.2 * Math.sqrt(dt || 0);
          m.x += Math.cos(m.a) * v * dt; m.y += Math.sin(m.a) * v * dt * 1.6; m.th += m.w * dt;
          if (m.x < 0.02) { m.x = 0.02; m.a = Math.PI - m.a; }
          if (m.x > 0.98) { m.x = 0.98; m.a = Math.PI - m.a; }
          if (m.y < 0.04) { m.y = 0.04; m.a = -m.a; }
          if (m.y > 0.96) { m.y = 0.96; m.a = -m.a; }
          if (!open && m.x > 0.475) { m.x = 0.475; m.a = Math.PI - m.a; }
        }
        clock += dt || 0;
        const n = counts(), N = mols.length, M = V.M;
        const lnW = lnFact(N) - n.reduce((s, k) => s + lnFact(k), 0);
        const mx = lnWmax(N, M);
        if (clock - lastPush >= 0.1 || lastPush < 0) {
          lastPush = clock;
          hist.push([clock, lnW]);
          while (hist.length && hist[0][0] < clock - 30) hist.shift();
          plot.set({ x: { label: 'time (s)', min: Math.max(0, clock - 30), max: Math.max(30, clock) }, y: { label: 'ln W  (S = k_B ln W)', min: 0, max: Math.max(1, mx * 1.12) },
            series: [{ pts: hist.slice(), label: 'ln W' }], hlines: [{ y: mx, label: 'most probable' }] });
        }
        ro.set('occ', M === 2 ? 'left ' + n[0] + ' · right ' + n[1] : n.join(' '));
        ro.set('W', kit.fmt(Math.round(Math.exp(lnW)), 4));
        ro.set('lnW', lnW.toFixed(2));
        ro.set('S', lnW < 1e-9 ? '0 J/K' : kit.fmt(KB * lnW, 3) + ' J/K');
        ro.set('max', mx.toFixed(2) + ' (ln of all ' + M + '^' + N + ' arrangements: ' + (N * Math.log(M)).toFixed(1) + ')');
        ro.set('back', kit.fmt(Math.pow(0.5, N), 3));
        // the box
        const bx = 14, by = 34, bw = W - 28, bh = H - 46;
        c.fillStyle = C.surface; c.fillRect(bx, by, bw, bh);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; c.strokeRect(bx, by, bw, bh);
        const g = M === 16 ? 4 : M === 4 ? 2 : 1;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.setLineDash([4, 4]);
        c.beginPath();
        const cols = M === 2 ? 2 : g, rows = M === 2 ? 1 : g;
        for (let i = 1; i < cols; i++) { c.moveTo(bx + bw * i / cols, by); c.lineTo(bx + bw * i / cols, by + bh); }
        for (let j = 1; j < rows; j++) { c.moveTo(bx, by + bh * j / rows); c.lineTo(bx + bw, by + bh * j / rows); }
        c.stroke(); c.setLineDash([]);
        for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) kit.label(c, String(n[j * cols + i]), bx + bw * i / cols + 6, by + bh * j / rows + 11, { size: 11, color: C.muted });
        if (!open) { c.strokeStyle = C.text; c.lineWidth = 4; c.beginPath(); c.moveTo(bx + bw * 0.5, by); c.lineTo(bx + bw * 0.5, by + bh); c.stroke(); }
        const rr = clamp(bh / 42, 3, 6);
        for (const m of mols) {
          const px = bx + m.x * bw, py = by + m.y * bh, dx = Math.cos(m.th) * rr * 0.75, dy = Math.sin(m.th) * rr * 0.75;
          for (const s of [-1, 1]) { c.beginPath(); c.arc(px + s * dx, py + s * dy, rr, 0, Math.PI * 2); c.fillStyle = brCol; c.fill(); c.strokeStyle = darker(brCol); c.lineWidth = 1; c.stroke(); }
        }
        kit.label(c, open ? 'partition removed: the molecules spread through the whole box' : 'partition closed: every molecule in the left half', 14, 16, { size: 13, weight: 600 });
        kit.label(c, 'Br₂ · N = ' + N, W - 14, 16, { size: 12, color: C.muted, align: 'right' });
      }
      reset();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ ΔG = ΔH − TΔS */
  const GIBBS = [
    ['N₂ + 3H₂ → 2NH₃ (Haber)', -92.2, -198.1],
    ['CaCO₃ → CaO + CO₂ (lime kiln)', 178.3, 160.7],
    ['ice → water (melting)', 6.01, 22.0],
    ['water → steam (boiling)', 40.7, 109.1],
    ['N₂O₄ → 2NO₂', 57.2, 175.9],
    ['2H₂O₂ → 2H₂O + O₂', -196.0, 125.8],
    ['3O₂ → 2O₃ (ozone)', 285.4, -137.8],
    ['NH₄NO₃ dissolving (cold pack)', 25.7, 108.7]
  ];

  Hyper.sim('tk-gibbs', {
    title: 'ΔG = ΔH − TΔS: who wins, and when',
    blurb: `The map places a reaction by its ΔH (across) and ΔS (up). The slanted line is ΔG = 0 at the chosen temperature: everything above it (shaded) is spontaneous. The bars show the tug of war between ΔH and −TΔS; the graph below shows ΔG against temperature.

- Drag the temperature up: the line swings round the origin, sweeping reactions from "not spontaneous" to "spontaneous" when ΔS > 0, and the other way when ΔS < 0.
- Top-left (ΔH < 0, ΔS > 0) is spontaneous at every temperature; bottom-right never is.
- Melting ice crosses at 273 K and boiling water at 373 K; limestone needs about 1110 K.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const p0 = clamp(Math.round(num(params && params.rx, 0)), 0, GIBBS.length - 1);
      const ctl = kit.controls(box.side, [
        { id: 'rx', type: 'select', label: 'Reaction', options: GIBBS.map((g, i) => [g[0], i]).concat([['your own (use the sliders)', -1]]), value: p0 },
        { id: 'dH', label: 'ΔH', min: -300, max: 300, step: 0.1, value: GIBBS[p0][1], unit: 'kJ/mol' },
        { id: 'dS', label: 'ΔS', min: -300, max: 300, step: 0.1, value: GIBBS[p0][2], unit: 'J/(mol·K)' },
        { id: 'T', label: 'Temperature', min: 50, max: 1500, step: 1, value: 298, unit: 'K' }
      ], (id, v) => {
        if (id === 'rx' && v >= 0 && GIBBS[v]) { ctl.set('dH', GIBBS[v][1]); ctl.set('dS', GIBBS[v][2]); }
        else if (id === 'dH' || id === 'dS') ctl.set('rx', -1);
        update(); loop.once();
      });
      const ro = kit.readout(box.side, [['dG', 'ΔG at this temperature'], ['K', 'K = e^(−ΔG/RT)'], ['Ts', 'Crossover T* = ΔH/ΔS'], ['v', 'Verdict']]);
      const plot = kit.plot(graphBox(box), { x: { label: 'temperature (K)', min: 0, max: 1500 }, y: { label: 'ΔG (kJ/mol)' } }, 170);
      const V = ctl.values;
      const calc = () => {
        const dH = V.dH, dS = V.dS, T = V.T;
        const G = dH - T * dS / 1000;
        const lnK = -G * 1000 / (R * T);
        const Ts = Math.abs(dS) > 1e-9 && dH / dS > 0 ? dH * 1000 / dS : null;
        return { dH, dS, T, G, lnK, Ts };
      };
      function update() {
        const q = calc(), C = kit.colors();
        ro.set('dG', kit.fmt(q.G, 4) + ' kJ/mol');
        ro.set('K', Math.abs(q.lnK) < 700 ? kit.fmt(Math.exp(q.lnK), 3) : '10^' + (q.lnK / Math.LN10).toFixed(0));
        ro.set('Ts', q.Ts == null ? 'none: the signs differ' : kit.fmt(q.Ts, 4) + ' K (' + Math.round(q.Ts - 273.15) + ' °C)');
        let verdict;
        if (q.dH < 0 && q.dS >= 0) verdict = 'spontaneous at every temperature';
        else if (q.dH > 0 && q.dS <= 0) verdict = 'never spontaneous (the reverse is)';
        else if (q.dH < 0) verdict = 'spontaneous below T*';
        else verdict = 'spontaneous above T*';
        ro.set('v', (q.G < 0 ? 'spontaneous now' : q.G > 0 ? 'not spontaneous now' : 'at equilibrium') + ' · ' + verdict);
        const pts = [];
        for (let T = 0; T <= 1500; T += 10) pts.push([T, q.dH - T * q.dS / 1000]);
        const vl = [{ x: q.T, label: 'T', color: C.accent }];
        if (q.Ts != null && q.Ts <= 1500) vl.push({ x: q.Ts, label: 'T*', color: C.warn });
        plot.set({ series: [{ pts, label: 'ΔG' }], hlines: [{ y: 0, label: 'ΔG = 0' }], vlines: vl, marks: [{ x: q.T, y: q.G, label: kit.fmt(q.G, 3) + ' kJ/mol' }] });
      }
      function frame() {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H, q = calc();
        // the sign map
        const ms = Math.max(120, Math.min(H - 56, W * 0.46)), mx = 34, my = 30;
        const X = h => mx + (h + 300) / 600 * ms, Y = s => my + (300 - s) / 600 * ms;
        const quad = (x, y, w, h, hue, text, tx, ty) => { c.fillStyle = C.hue(hue, 0.12); c.fillRect(x, y, w, h); kit.label(c, text, tx, ty, { size: 10.5, color: C.muted, align: 'center' }); };
        quad(mx, my, ms / 2, ms / 2, 150, 'always spontaneous', mx + ms / 4, my + 12);
        quad(mx + ms / 2, my, ms / 2, ms / 2, 45, 'spontaneous when hot', mx + ms * 0.75, my + 12);
        quad(mx, my + ms / 2, ms / 2, ms / 2, 210, 'spontaneous when cold', mx + ms / 4, my + ms - 10);
        quad(mx + ms / 2, my + ms / 2, ms / 2, ms / 2, 0, 'never spontaneous', mx + ms * 0.75, my + ms - 10);
        // the ΔG = 0 line at this temperature: ΔS = 1000 ΔH / T; spontaneous above it
        c.save(); c.beginPath(); c.rect(mx, my, ms, ms); c.clip();
        const sl = 1000 / Math.max(1, q.T);
        const hA = -300, hB = 300;
        c.beginPath(); c.moveTo(X(hA), Y(sl * hA)); c.lineTo(X(hB), Y(sl * hB)); c.lineTo(X(hB), Y(1e6)); c.lineTo(X(hA), Y(1e6)); c.closePath();
        c.fillStyle = C.hue(150, 0.13); c.fill();
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(X(hA), Y(sl * hA)); c.lineTo(X(hB), Y(sl * hB)); c.stroke();
        c.restore();
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(mx, Y(0)); c.lineTo(mx + ms, Y(0)); c.moveTo(X(0), my); c.lineTo(X(0), my + ms); c.stroke();
        c.strokeStyle = C.muted; c.strokeRect(mx, my, ms, ms);
        kit.label(c, 'ΔH →', mx + ms - 2, Y(0) - 8, { size: 11, color: C.text2, align: 'right' });
        kit.label(c, 'ΔS ↑', X(0) + 5, my + 26, { size: 11, color: C.text2 });
        kit.label(c, '−300', mx, my + ms + 10, { size: 10, color: C.faint });
        kit.label(c, '+300 kJ/mol', mx + ms, my + ms + 10, { size: 10, color: C.faint, align: 'right' });
        kit.label(c, 'ΔG = 0 at ' + Math.round(q.T) + ' K', mx + 4, my - 10, { size: 11.5, color: C.ok });
        const px = X(clamp(q.dH, -300, 300)), py = Y(clamp(q.dS, -300, 300));
        kit.dot(c, px, py, 7, q.G < 0 ? C.ok : C.bad, C.surface);
        // the tug of war
        const bx0 = mx + ms + 40, bw = Math.max(120, W - bx0 - 16), mid = my + ms * 0.45, span = ms * 0.4;
        const TdS = -q.T * q.dS / 1000;
        const big = Math.max(40, Math.abs(q.dH), Math.abs(TdS), Math.abs(q.G));
        const bars = [['ΔH', q.dH, C.series[1]], ['−TΔS', TdS, C.series[5]], ['ΔG', q.G, q.G < 0 ? C.ok : C.bad]];
        const cw = Math.min(70, bw / 3.4);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(bx0, mid); c.lineTo(bx0 + cw * 3.4, mid); c.stroke();
        bars.forEach(([name, v, col], i) => {
          const x = bx0 + i * cw * 1.15 + 6, h = v / big * span;
          c.fillStyle = col; c.fillRect(x, Math.min(mid, mid - h), cw * 0.8, Math.abs(h));
          kit.label(c, name, x + cw * 0.4, mid + (v >= 0 ? 12 : -12), { size: 12, weight: 650, align: 'center' });
          kit.label(c, kit.fmt(v, 3), x + cw * 0.4, mid - h + (v >= 0 ? -9 : 9), { size: 11, color: C.text2, align: 'center' });
        });
        kit.label(c, 'kJ/mol', bx0, mid - span - 8, { size: 11, color: C.muted });
        let ty = my + ms * 0.9;
        const tl = (t, col, w) => { kit.label(c, t, bx0, ty, { size: 12.5, color: col || C.text2, weight: w || 500 }); ty += 19; };
        tl('ΔG = ' + kit.fmt(q.dH, 4) + ' − ' + Math.round(q.T) + ' × (' + kit.fmt(q.dS / 1000, 4) + ') = ' + kit.fmt(q.G, 4) + ' kJ/mol', C.text, 600);
        tl(q.G < 0 ? 'negative: spontaneous at ' + Math.round(q.T) + ' K' : 'positive: not spontaneous at ' + Math.round(q.T) + ' K', q.G < 0 ? C.ok : C.bad);
        if (q.Ts != null) tl('changes sign at T* = ' + Math.round(q.Ts) + ' K', C.warn);
      }
      update();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ orders and straight lines */
  const ORDER_UNITS = ['M/s', '1/s', '1/(M·s)'];
  Hyper.sim('tk-orders', {
    title: 'Zero, first and second order: which plot is straight?',
    blurb: `A reactant A is measured as it disappears. The three small graphs plot the same readings as [A], ln[A] and 1/[A] against time; the straight one reveals the order, and its slope gives k. The big graph marks the successive half-lives.

- First order: equal half-lives, and ln[A] is the straight one.
- Second order: each half-life twice the last; 1/[A] is straight. Zero order: the half-lives shrink, and [A] itself falls in a straight line to zero.
- Tick **Compare the orders**: all three start at the same rate, but the second-order curve lags behind and keeps a long tail.
- Turn the noise on and watch how many points you need before the R² values tell the orders apart.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 220 });
      const o0 = clamp(Math.round(num(params && params.order, 1)), 0, 2);
      const ctl = kit.controls(box.side, [
        { id: 'order', type: 'select', label: 'Order of the reaction', options: [['zero order', 0], ['first order', 1], ['second order', 2]], value: o0 },
        { id: 'A0', label: 'Starting concentration [A]₀', min: 0.2, max: 2, step: 0.05, value: 1, unit: 'M' },
        { id: 'k', label: 'Rate constant k', min: 0.005, max: 0.5, value: 0.05, log: true, sig: 3 },
        { id: 'noise', type: 'check', label: 'Measurement noise (±2 %)', value: true },
        { id: 'cmp', type: 'check', label: 'Compare the orders (same starting rate)', value: false },
        { type: 'buttons', items: [{ id: 'go', label: 'Run again', primary: true }] }
      ], id => { if (id !== 'cmp') setup(); else bigPlot(); });
      const ro = kit.readout(box.side, [['k', 'Rate constant'], ['h1', 'First half-life'], ['h2', 'Second half-life'], ['h3', 'Third half-life'], ['best', 'Straightest plot']]);
      const plot = kit.plot(graphBox(box), { x: { label: 'time (s)', min: 0 }, y: { label: '[A] (M)', min: 0 }, legend: true }, 190);
      const V = ctl.values;
      let data = [], tmax = 1, tcur = 0, ord = 1, A0 = 1, k = 0.05, fits = [null, null, null], lastShown = -1;
      const conc = (o, a0, kk, t) => o === 0 ? Math.max(0, a0 - kk * t) : o === 1 ? a0 * Math.exp(-kk * t) : a0 / (1 + kk * a0 * t);
      const halves = (o, a0, kk) => { const out = []; let a = a0; for (let i = 0; i < 3; i++) { out.push(o === 0 ? a / (2 * kk) : o === 1 ? Math.LN2 / kk : 1 / (kk * a)); a /= 2; } return out; };
      function setup() {
        ord = V.order; A0 = V.A0; k = V.k;
        setLabel(ctl, 'k', 'Rate constant k (' + ORDER_UNITS[ord] + ')');
        const h = halves(ord, A0, k);
        tmax = ord === 0 ? 1.15 * A0 / k : ord === 1 ? 5 * h[0] : 7 * h[0];
        data = [];
        for (let i = 0; i <= 30; i++) {
          const t = i * tmax / 30, a = conc(ord, A0, k, t);
          const meas = a * (1 + (V.noise ? 0.02 * gauss() : 0)) + (V.noise ? 0.002 * A0 * gauss() : 0);
          data.push([t, Math.max(0, meas)]);
        }
        tcur = 0; lastShown = -1;
        ro.set('k', kit.fmt(k, 3) + ' ' + ORDER_UNITS[ord]);
        ['h1', 'h2', 'h3'].forEach((id, i) => ro.set(id, kit.fmt(h[i], 3) + ' s'));
        bigPlot();
      }
      const visible = () => data.filter(p => p[0] <= tcur + 1e-9);
      const transforms = [a => a, a => Math.log(a), a => 1 / a];
      const usable = a => a > 0.01 * A0;
      function bigPlot() {
        const C = kit.colors();
        const pts = [];
        for (let i = 0; i <= 200; i++) { const t = i * tmax / 200; pts.push([t, conc(ord, A0, k, t)]); }
        const names = ['zero order', 'first order', 'second order'];
        const series = [{ pts, label: names[ord] + ' (true)', width: 2.2, color: C.accent }];
        if (V.cmp) {
          const r0 = k * Math.pow(A0, ord);
          [0, 1, 2].filter(o => o !== ord).forEach(o => {
            const kk = r0 / Math.pow(A0, o), q = [];
            for (let i = 0; i <= 200; i++) { const t = i * tmax / 200; q.push([t, conc(o, A0, kk, t)]); }
            series.push({ pts: q, label: names[o] + ', same start', dash: [6, 4], width: 1.6, color: o === 0 ? C.series[1] : o === 1 ? C.series[2] : C.series[3] });
          });
        }
        series.push({ pts: visible(), line: false, dots: 3, label: 'measured', color: C.warn });
        const h = halves(ord, A0, k), vl = [];
        let acc = 0;
        h.forEach((x, i) => { acc += x; if (acc <= tmax) vl.push({ x: acc, label: ['t½', '2nd', '3rd'][i] }); });
        plot.set({ x: { label: 'time (s)', min: 0, max: tmax }, y: { label: '[A] (M)', min: 0, max: A0 * 1.08 }, series,
          hlines: [{ y: A0 / 2, label: '½' }, { y: A0 / 4, label: '¼' }, { y: A0 / 8, label: '⅛' }], vlines: vl });
      }
      function frame(dt) {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        if (tcur < tmax && dt > 0) tcur = Math.min(tmax, tcur + dt * tmax / 6);
        const vis = visible();
        if (vis.length !== lastShown) {
          lastShown = vis.length; bigPlot();
          fits = transforms.map(f => { const q = vis.filter(p => usable(p[1])).map(p => [p[0], f(p[1])]); return q.length >= 3 ? linfit(q) : null; });
          let best = -1;
          if (vis.length >= 6) fits.forEach((f, i) => { if (f && (best < 0 || f.r2 > fits[best].r2)) best = i; });
          ro.set('best', best < 0 ? 'need more points' : ['[A] → zero order', 'ln[A] → first order', '1/[A] → second order'][best] + ' (R² = ' + fits[best].r2.toFixed(4) + ')');
          fits.best = best;
        }
        const titles = ['[A] against t', 'ln[A] against t', '1/[A] against t'];
        const gap = 12, pw = (W - gap * 4) / 3, ph = H - 54, py = 30;
        transforms.forEach((f, i) => {
          const px = gap + i * (pw + gap);
          const all = data.filter(p => usable(p[1])).map(p => [p[0], f(p[1])]);
          let lo = Infinity, hi = -Infinity;
          for (const p of all) { lo = Math.min(lo, p[1]); hi = Math.max(hi, p[1]); }
          if (!Number.isFinite(lo)) { lo = 0; hi = 1; }
          if (hi - lo < 1e-9) { hi += 0.5; lo -= 0.5; }
          const pad = (hi - lo) * 0.08;
          lo -= pad; hi += pad;
          const X = t => px + 8 + t / tmax * (pw - 16), Y = v => py + ph - 8 - (v - lo) / (hi - lo) * (ph - 16);
          const isBest = fits.best === i;
          c.fillStyle = C.surface; c.fillRect(px, py, pw, ph);
          c.strokeStyle = isBest ? C.ok : C.border2 || C.faint; c.lineWidth = isBest ? 2.5 : 1; c.strokeRect(px, py, pw, ph);
          kit.label(c, titles[i], px + pw / 2, py - 10, { size: 12.5, weight: 650, align: 'center', color: isBest ? C.ok : C.text });
          const fit = fits[i];
          if (fit) {
            c.strokeStyle = isBest ? C.ok : C.faint; c.lineWidth = 1.5; c.setLineDash(isBest ? [] : [5, 4]);
            c.save(); c.beginPath(); c.rect(px, py, pw, ph); c.clip();
            c.beginPath(); c.moveTo(X(0), Y(fit.c)); c.lineTo(X(tmax), Y(fit.c + fit.m * tmax)); c.stroke();
            c.restore(); c.setLineDash([]);
            kit.label(c, 'R² = ' + fit.r2.toFixed(4), px + pw - 6, py + 12, { size: 11, color: isBest ? C.ok : C.muted, align: 'right' });
          }
          for (const p of vis) if (usable(p[1])) kit.dot(c, X(p[0]), Y(f(p[1])), 3, C.warn);
        });
        kit.label(c, 't = ' + kit.fmt(tcur, 3) + ' s', W - 14, H - 10, { size: 11, color: C.muted, align: 'right' });
      }
      setup();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ initial rates */
  Hyper.sim('tk-initial-rates', {
    title: 'Initial-rates detective',
    blurb: `A mystery reaction A + B → products has a hidden rate law, rate = k[A]ᵐ[B]ⁿ, with m and n each 0, 1 or 2. Choose starting concentrations, run experiments (each measured initial rate has about 3 % noise), and work out the orders.

- Change **one** concentration at a time: each new run is compared with an earlier one that differs only in that concentration.
- The graph shows product forming in the latest run. The initial rate is the slope of the tangent at t = 0, before the curve bends over.
- Choose your orders and press **Check my rate law**, then try a **New mystery reaction**.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const ctl = kit.controls(box.side, [
        { id: 'A', label: '[A]₀', min: 0.05, max: 0.5, step: 0.05, value: 0.1, unit: 'M' },
        { id: 'B', label: '[B]₀', min: 0.05, max: 0.5, step: 0.05, value: 0.1, unit: 'M' },
        { type: 'buttons', items: [{ id: 'go', label: 'Run experiment', primary: true }, { id: 'clear', label: 'Clear table' }] },
        { id: 'gm', type: 'select', label: 'Your order in A', options: [['0', 0], ['1', 1], ['2', 2]], value: 1 },
        { id: 'gn', type: 'select', label: 'Your order in B', options: [['0', 0], ['1', 1], ['2', 2]], value: 1 },
        { type: 'buttons', items: [{ id: 'check', label: 'Check my rate law' }, { id: 'new', label: 'New mystery reaction' }] }
      ], id => {
        if (id === 'go') doRun();
        else if (id === 'clear') { runs = []; notes = []; msg = null; }
        else if (id === 'check') check();
        else if (id === 'new') mystery();
        loop.once();
      });
      const ro = kit.readout(box.side, [['n', 'Experiments run'], ['last', 'Latest initial rate'], ['you', 'Your rate law']]);
      const plot = kit.plot(graphBox(box), { x: { label: 'time (s)', min: 0 }, y: { label: '[product] (M)', min: 0 }, legend: true }, 170);
      const V = ctl.values;
      let m = 1, n = 1, k = 1, runs = [], notes = [], msg = null, solved = false;
      const r2 = x => Math.round(x * 100) / 100;
      const sup = { 0: '⁰', 1: '', 2: '²' };
      function mystery() {
        do { m = Math.floor(Math.random() * 3); n = Math.floor(Math.random() * 3); } while (m + n === 0);
        const r0 = (2 + Math.random() * 6) * 1e-4;
        k = Number((r0 / (Math.pow(0.2, m) * Math.pow(0.2, n))).toPrecision(2));
        runs = []; notes = []; msg = null; solved = false;
        plot.set({ series: [] });
        ro.set('n', '0'); ro.set('last', '—');
      }
      const rateOf = (a, b) => k * Math.pow(a, m) * Math.pow(b, n);
      function doRun() {
        const a = r2(V.A), b = r2(V.B);
        const rate = rateOf(a, b) * (1 + 0.03 * gauss());
        runs.push({ a, b, rate, id: runs.length ? runs[runs.length - 1].id + 1 : 1 });
        if (runs.length > 9) runs.shift();
        const L = runs[runs.length - 1];
        notes = [];
        for (let i = runs.length - 2; i >= 0; i--) {
          const P = runs[i];
          if (Math.abs(P.b - L.b) < 1e-6 && Math.abs(P.a - L.a) > 1e-6 && !notes.some(t => t.w === 'A')) {
            notes.push({ w: 'A', t: 'Run ' + L.id + ' vs ' + P.id + ': [A] × ' + kit.fmt(L.a / P.a, 3) + ', rate × ' + kit.fmt(L.rate / P.rate, 3) + '  →  order in A ≈ ' + (Math.log(L.rate / P.rate) / Math.log(L.a / P.a)).toFixed(2) });
          }
          if (Math.abs(P.a - L.a) < 1e-6 && Math.abs(P.b - L.b) > 1e-6 && !notes.some(t => t.w === 'B')) {
            notes.push({ w: 'B', t: 'Run ' + L.id + ' vs ' + P.id + ': [B] × ' + kit.fmt(L.b / P.b, 3) + ', rate × ' + kit.fmt(L.rate / P.rate, 3) + '  →  order in B ≈ ' + (Math.log(L.rate / P.rate) / Math.log(L.b / P.b)).toFixed(2) });
          }
        }
        ro.set('n', String(L.id));
        ro.set('last', kit.fmt(L.rate, 3) + ' M/s');
        curve(L);
      }
      // the product curve of one run, integrated with RK4, and its initial tangent
      function curve(L) {
        const C = kit.colors();
        const f = P => { const ca = Math.max(0, L.a - P), cb = Math.max(0, L.b - P); return ca > 0 && cb > 0 ? k * Math.pow(ca, m) * Math.pow(cb, n) : 0; };
        const r0 = Math.max(1e-12, f(0));
        const tEnd = 0.6 * Math.min(L.a, L.b) / r0, h = tEnd / 120;
        const pts = [[0, 0]];
        let P = 0;
        for (let i = 1; i <= 120; i++) {
          const k1 = f(P), k2 = f(P + h * k1 / 2), k3 = f(P + h * k2 / 2), k4 = f(P + h * k3);
          P += h * (k1 + 2 * k2 + 2 * k3 + k4) / 6;
          pts.push([i * h, P]);
        }
        const tan = [[0, 0], [tEnd * 0.75, r0 * tEnd * 0.75]];
        plot.set({ x: { label: 'time (s)', min: 0, max: tEnd }, y: { label: '[product] (M)', min: 0, max: Math.max(P, r0 * tEnd * 0.75) * 1.08 },
          series: [{ pts, label: 'run ' + L.id + ': product formed', color: C.accent }, { pts: tan, dash: [6, 4], label: 'tangent at t = 0: the initial rate', color: C.warn }] });
      }
      function check() {
        const gm = V.gm, gn = V.gn;
        if (gm === m && gn === n) { solved = true; msg = { ok: true, t: 'Correct! rate = k[A]' + (m === 1 ? '' : sup[m]) + '[B]' + (n === 1 ? '' : sup[n]) + ', with k = ' + kit.fmt(k, 2) + ' in units of M^' + (1 - m - n) + '·s⁻¹.' }; }
        else {
          const a = gm === m ? 'the order in A is right' : 'the order in A is not ' + gm;
          const b = gn === n ? 'the order in B is right' : 'the order in B is not ' + gn;
          msg = { ok: false, t: 'Not yet: ' + a + '; ' + b + '. Compare runs that differ in one concentration only.' };
        }
      }
      function frame() {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        ro.set('you', 'rate = k[A]' + (V.gm === 1 ? '' : sup[V.gm]) + '[B]' + (V.gn === 1 ? '' : sup[V.gn]));
        kit.label(c, 'A + B → products', 14, 18, { size: 15, weight: 650 });
        kit.label(c, solved ? 'rate = k[A]' + (m === 1 ? '' : sup[m]) + '[B]' + (n === 1 ? '' : sup[n]) : 'rate = k[A]^?[B]^?', 180, 18, { size: 14, color: solved ? C.ok : C.muted });
        // the table
        const cols = [14, Math.max(70, W * 0.13), Math.max(150, W * 0.3), Math.max(230, W * 0.47)];
        const head = ['run', '[A]₀ (M)', '[B]₀ (M)', 'initial rate (M/s)'];
        let y = 48;
        head.forEach((h, i) => kit.label(c, h, cols[i], y, { size: 12, weight: 650, color: C.text2 }));
        c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(12, y + 10); c.lineTo(Math.max(cols[3] + 150, W * 0.66), y + 10); c.stroke();
        y += 26;
        runs.forEach((q, i) => {
          const last = i === runs.length - 1;
          if (last) { c.fillStyle = C.hue(220, 0.14); c.fillRect(10, y - 10, Math.max(cols[3] + 144, W * 0.66 - 2), 20); }
          [String(q.id), q.a.toFixed(2), q.b.toFixed(2), kit.fmt(q.rate, 3)].forEach((t, j) => kit.label(c, t, cols[j], y, { size: 12.5, color: last ? C.text : C.text2 }));
          y += 21;
        });
        if (!runs.length) kit.label(c, 'No experiments yet: set [A]₀ and [B]₀ and press Run experiment.', 14, y, { size: 12.5, color: C.muted });
        // what the comparisons say
        let ny = H - 16 - (msg ? 24 : 0) - notes.length * 19;
        for (const t of notes) { kit.label(c, t.t, 14, ny, { size: 12.5, color: C.accent }); ny += 19; }
        if (msg) kit.label(c, msg.t, 14, H - 16, { size: 12.5, weight: 600, color: msg.ok ? C.ok : C.warn });
      }
      mystery();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Maxwell–Boltzmann tails and Arrhenius */
  Hyper.sim('tk-collisions', {
    title: 'Energy tails and the Arrhenius plot',
    blurb: `The curve is the spread of molecular kinetic energies at temperature T (the Maxwell–Boltzmann distribution, per mole). Only the shaded tail beyond the activation energy Ea can react. The graph below is the Arrhenius plot of ln k against 1/T: its slope is −Ea/R.

- Raise T by a little and compare the dashed curve at T + 10 K: the peak barely moves, but the tail grows markedly — that is why rates rise so steeply with temperature.
- Set Ea to 50 kJ/mol: the tail becomes invisible on a linear scale. Tick **Logarithmic scale** to see that it is still there, some 10⁻⁸ of the molecules.
- Add a catalyst: the barrier drops, a far larger slice qualifies, and the Arrhenius line becomes shallower.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 250 });
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature', min: 200, max: 1000, step: 5, value: 400, unit: 'K' },
        { id: 'Ea', label: 'Activation energy Ea', min: 5, max: 150, step: 1, value: 20, unit: 'kJ/mol' },
        { id: 'cat', type: 'check', label: 'Add a catalyst (Ea lowered by a third)', value: false },
        { id: 'hot', type: 'check', label: 'Show the curve at T + 10 K', value: true },
        { id: 'log', type: 'check', label: 'Logarithmic vertical scale', value: !!(params && params.log) }
      ], () => { update(); loop.once(); });
      const ro = kit.readout(box.side, [['emp', 'Most probable energy (½RT)'], ['frac', 'Shaded fraction, E ≥ Ea'], ['boltz', 'Arrhenius factor e^(−Ea/RT)'],
        ['ten', 'Rate change for +10 K'], ['cat', 'Catalyst speed-up'], ['slope', 'Arrhenius slope −Ea/R']]);
      const plot = kit.plot(graphBox(box), { x: { label: '1000/T (1/K)' }, y: { label: 'ln k' }, legend: true }, 170);
      const V = ctl.values;
      const LNA = Math.log(1e11);
      const pdf = (E, RT) => E <= 0 ? 0 : 2 / Math.sqrt(Math.PI) * Math.sqrt(E) * Math.pow(RT, -1.5) * Math.exp(-E / RT);
      const tail = x => erfc(Math.sqrt(x)) + 2 * Math.sqrt(x / Math.PI) * Math.exp(-x);
      const Ecat = () => V.Ea * 2 / 3;
      function update() {
        const C = kit.colors();
        const T = V.T, RT = R * T / 1000, Ea = V.Ea;
        ro.set('emp', kit.fmt(RT / 2, 3) + ' kJ/mol');
        ro.set('frac', kit.fmt(tail(Ea / RT), 3));
        ro.set('boltz', kit.fmt(Math.exp(-Ea / RT), 3));
        ro.set('ten', '× ' + kit.fmt(Math.exp(Ea * 1000 / R * (1 / T - 1 / (T + 10))), 3));
        ro.set('cat', V.cat ? '× ' + kit.fmt(Math.exp((Ea - Ecat()) / RT), 3) : '—');
        ro.set('slope', kit.fmt(-Ea * 1000 / R, 4) + ' K');
        const line = e => { const q = []; for (let t = 200; t <= 1000; t += 10) q.push([1000 / t, LNA - e * 1000 / (R * t)]); return q; };
        const series = [{ pts: line(Ea), label: 'uncatalysed, Ea = ' + Math.round(Ea) + ' kJ/mol', color: C.accent }];
        if (V.cat) series.push({ pts: line(Ecat()), label: 'catalysed, Ea = ' + Math.round(Ecat()) + ' kJ/mol', color: C.ok, dash: [6, 4] });
        plot.set({ x: { label: '1000/T (1/K)   ← hotter', min: 1, max: 5 }, y: { label: 'ln k  (A = 10¹¹)' }, series,
          marks: [{ x: 1000 / T, y: LNA - Ea * 1000 / (R * T), label: Math.round(T) + ' K' }] });
      }
      function frame() {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const T = V.T, RT = R * T / 1000, Ea = V.Ea, RT2 = R * (T + 10) / 1000;
        const Emax = Math.max(1.35 * Ea, 10 * RT);
        const x0 = 56, x1 = W - 18, y0 = 30, y1 = H - 34;
        const peak = pdf(RT / 2, RT);
        const logs = V.log, top = peak * (logs ? 3 : 1.15), bottom = logs ? peak * 1e-12 : 0;
        const X = E => x0 + E / Emax * (x1 - x0);
        const Y = f => {
          if (logs) { const v = Math.log10(Math.max(f, bottom)); return y1 - (v - Math.log10(bottom)) / (Math.log10(top) - Math.log10(bottom)) * (y1 - y0); }
          return y1 - f / top * (y1 - y0);
        };
        // axes
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, y1); c.lineTo(x1, y1); c.stroke();
        const stp = Hyper.niceStep(Emax, 6);
        for (let e = 0; e <= Emax + 1e-9; e += stp) kit.label(c, String(Math.round(e)), X(e), y1 + 12, { size: 10.5, color: C.muted, align: 'center' });
        kit.label(c, 'kinetic energy (kJ/mol)', x1, y1 + 26, { size: 11.5, color: C.text2, align: 'right' });
        kit.label(c, logs ? 'fraction per kJ/mol (log scale)' : 'fraction of molecules per kJ/mol', x0 + 6, y0 - 12, { size: 11.5, color: C.text2 });
        if (logs) for (let p = 0; p >= -12; p -= 3) { const yy = Y(peak * Math.pow(10, p)); kit.label(c, p === 0 ? 'peak' : '10' + String(p).replace('-', '⁻').replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[d]), x0 - 6, yy, { size: 10, color: C.muted, align: 'right' }); }
        const N = 260, curve = (rt) => { const q = []; for (let i = 0; i <= N; i++) { const E = i / N * Emax; q.push([X(E), Y(pdf(E, rt))]); } return q; };
        const shade = (from, to, rt, col) => {
          if (from >= Emax) return;
          c.beginPath(); c.moveTo(X(from), y1);
          const n2 = 120;
          for (let i = 0; i <= n2; i++) { const E = from + (Math.min(to, Emax) - from) * i / n2; c.lineTo(X(E), Y(pdf(E, rt))); }
          c.lineTo(X(Math.min(to, Emax)), y1); c.closePath(); c.fillStyle = col; c.fill();
        };
        if (V.cat) shade(Ecat(), Ea, RT, C.hue(150, 0.35));
        shade(Ea, Emax, RT, C.hue(35, 0.55));
        const draw = (pts, col, dash, w) => { c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash || []); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.setLineDash([]); };
        if (V.hot) draw(curve(RT2), C.series[1], [6, 4], 1.6);
        draw(curve(RT), C.accent, null, 2.4);
        const vline = (E, col, text) => { if (E > Emax) return; c.strokeStyle = col; c.lineWidth = 1.5; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(X(E), y0); c.lineTo(X(E), y1); c.stroke(); c.setLineDash([]); kit.label(c, text, X(E) + 4, y0 + 8, { size: 11.5, color: col, weight: 650 }); };
        vline(Ea, C.warn, 'Ea = ' + Math.round(Ea));
        if (V.cat) vline(Ecat(), C.ok, 'catalysed ' + Math.round(Ecat()));
        // the labels sit over the shaded tail: give them the panel's background so they stay legible
        kit.label(c, 'T = ' + Math.round(T) + ' K', x1, y0 + 8, { size: 12.5, color: C.accent, align: 'right', weight: 650, bg: C.bg2 });
        if (V.hot) kit.label(c, 'T + 10 K (dashed)', x1, y0 + 26, { size: 11.5, color: C.series[1], align: 'right', bg: C.bg2 });
        kit.label(c, 'shaded: ' + kit.fmt(tail(Ea / RT), 3) + ' of the molecules', x1, y0 + 44, { size: 11.5, color: C.text, align: 'right', bg: C.bg2 });
      }
      update();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ reaction profiles */
  Hyper.sim('tk-profile', {
    title: 'Reaction profiles: barriers, catalysts and intermediates',
    blurb: `Molecules (dots) sit in the energy valleys and hop over a barrier at a rate proportional to $e^{-E_a/RT}$ — the forward barrier for going on, the reverse barrier for coming back. The graph below counts them.

- One step: make the reaction endothermic and the reverse barrier small, and it settles at an equilibrium with both present.
- Add a catalyst: the new, lower path is used; forward and reverse both speed up by the same factor, so the final balance is unchanged.
- Two steps: watch the intermediate rise and fall. Raise the second barrier above the first and the second step becomes the slow, rate-determining one.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 290 });
      const mode0 = clamp(Math.round(num(params && params.mode, 0)), 0, 2);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Mechanism', options: [['one step', 0], ['one step, with a catalyst', 1], ['two steps, with an intermediate', 2]], value: mode0 },
        { id: 'dH', label: 'ΔH (products − reactants)', min: -120, max: 80, step: 1, value: -40, unit: 'kJ/mol' },
        { id: 'Ea', label: 'Barrier of step 1 (from the reactants)', min: 20, max: 160, step: 1, value: mode0 === 2 ? 60 : 80, unit: 'kJ/mol' },
        { id: 'Ecat', label: 'Barrier with the catalyst', min: 10, max: 150, step: 1, value: 50, unit: 'kJ/mol' },
        { id: 'Ei', label: 'Energy of the intermediate', min: -60, max: 80, step: 1, value: -10, unit: 'kJ/mol' },
        { id: 'E2', label: 'Top of the second barrier', min: 10, max: 160, step: 1, value: 65, unit: 'kJ/mol' },
        { id: 'T', label: 'Temperature', min: 250, max: 700, step: 5, value: 450, unit: 'K' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again', primary: true }] }
      ], id => { if (id === 'reset' || id === 'mode') reset(); showControls(); describe(); loop.once(); });
      const ro = kit.readout(box.side, [['fw', 'Forward barrier'], ['rv', 'Reverse barrier'], ['dh', 'ΔH'], ['rds', 'Slowest step'], ['cat', 'Catalyst speed-up at T'], ['pop', 'Reactant · intermediate · product']]);
      const plot = kit.plot(graphBox(box), { x: { label: 'time (s)' }, y: { label: 'molecules', min: 0 }, legend: true }, 160);
      const V = ctl.values;
      const NP = 40, NU = Math.exp(60 / (R * 0.4));   // 60 kJ/mol at 400 K hops once a second
      let parts = [], hist = [], clock = 0, lastPush = -1;
      function showControls() { ctl.show('Ecat', V.mode === 1); ctl.show('Ei', V.mode === 2); ctl.show('E2', V.mode === 2); }
      function geom() {
        const dH = V.dH;
        if (V.mode === 2) {
          const Ei = V.Ei, t1 = Math.max(V.Ea, Math.max(0, Ei) + 5), t2 = Math.max(V.E2, Math.max(Ei, dH) + 5);
          return { pts: [[0.06, 0], [0.28, t1], [0.5, Ei], [0.72, t2], [0.94, dH]], wells: [0, 2, 4] };
        }
        const Ea = Math.max(V.Ea, Math.max(0, dH) + 5);
        const g = { pts: [[0.08, 0], [0.45, Ea], [0.92, dH]], wells: [0, 2] };
        if (V.mode === 1) { const Ec = clamp(V.Ecat, Math.max(0, dH) + 3, Ea); g.plain = g.pts; g.pts = [[0.08, 0], [0.45, Ec], [0.92, dH]]; }
        return g;
      }
      const energy = (pts, x) => {
        if (x <= pts[0][0]) return pts[0][1];
        for (let i = 0; i < pts.length - 1; i++) {
          const [xa, ya] = pts[i], [xb, yb] = pts[i + 1];
          if (x <= xb) { const u = (x - xa) / (xb - xa); return ya + (yb - ya) * (1 - Math.cos(Math.PI * u)) / 2; }
        }
        return pts[pts.length - 1][1];
      };
      function reset() {
        parts = [];
        for (let i = 0; i < NP; i++) parts.push({ w: 0, jx: (Math.random() - 0.5) * 0.07, ph: Math.random() * 6.3, mv: null });
        hist = []; clock = 0; lastPush = -1;
      }
      // hop rate over a barrier of height b (kJ/mol) at the chosen temperature, capped for the eye
      const hop = b => Math.min(6, NU * Math.exp(-Math.max(0, b) / (R * V.T / 1000)));
      function describe() {
        const g = geom(), P = g.pts, RT = R * V.T / 1000;
        ro.set('dh', kit.fmt(V.dH, 3) + ' kJ/mol');
        if (V.mode === 2) {
          ro.set('fw', 'step 1: ' + Math.round(P[1][1]) + ', step 2: ' + Math.round(P[3][1] - P[2][1]) + ' kJ/mol (from the intermediate)');
          ro.set('rv', Math.round(P[3][1] - P[4][1]) + ' kJ/mol (from the products)');
          ro.set('rds', P[3][1] > P[1][1] ? 'step 2: its peak is the higher' : 'step 1: its peak is the higher');
          ro.set('cat', '—');
        } else {
          ro.set('fw', Math.round(P[1][1]) + ' kJ/mol' + (V.mode === 1 ? ' (without catalyst ' + Math.round(g.plain[1][1]) + ')' : ''));
          ro.set('rv', Math.round(P[1][1] - V.dH) + ' kJ/mol');
          ro.set('rds', 'a single step');
          ro.set('cat', V.mode === 1 ? '× ' + kit.fmt(Math.exp((g.plain[1][1] - P[1][1]) / RT), 3) + ' (forward and reverse alike)' : '—');
        }
      }
      function frame(dt) {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        const g = geom(), P = g.pts, wells = g.wells;
        dt = dt || 0;
        clock += dt;
        // hops between neighbouring wells
        for (const p of parts) {
          if (p.mv) {
            p.mv.t += dt;
            if (p.mv.t >= p.mv.dur) { p.w = p.mv.to; p.mv = null; }
            continue;
          }
          if (p.w >= wells.length) p.w = wells.length - 1;
          const wi = wells[p.w];
          const up = p.w < wells.length - 1 ? hop(P[wi + 1][1] - P[wi][1]) : 0;
          const dn = p.w > 0 ? hop(P[wi - 1][1] - P[wi][1]) : 0;
          const r = Math.random();
          if (r < up * dt) p.mv = { from: p.w, to: p.w + 1, t: 0, dur: 0.7 };
          else if (r < (up + dn) * dt) p.mv = { from: p.w, to: p.w - 1, t: 0, dur: 0.7 };
        }
        const cnt = [0, 0, 0];
        for (const p of parts) { const s = p.mv ? p.mv.from : p.w; cnt[wells.length === 3 ? s : s * 2]++; }
        ro.set('pop', cnt[0] + ' · ' + (V.mode === 2 ? cnt[1] : '—') + ' · ' + cnt[2]);
        if (clock - lastPush >= 0.25 || lastPush < 0) {
          lastPush = clock;
          hist.push([clock, cnt[0], cnt[1], cnt[2]]);
          while (hist.length && hist[0][0] < clock - 40) hist.shift();
          const series = [{ pts: hist.map(h => [h[0], h[1]]), label: 'reactant', color: C.series[0] }, { pts: hist.map(h => [h[0], h[3]]), label: 'product', color: C.series[2] }];
          if (V.mode === 2) series.splice(1, 0, { pts: hist.map(h => [h[0], h[2]]), label: 'intermediate', color: C.series[4] });
          plot.set({ x: { label: 'time (s)', min: Math.max(0, clock - 40), max: Math.max(40, clock) }, y: { label: 'molecules', min: 0, max: NP }, series });
        }
        // the energy profile
        const allE = P.map(q => q[1]).concat(g.plain ? g.plain.map(q => q[1]) : []);
        const lo = Math.min(0, ...allE) - 22, hi = Math.max(...allE) + 26;
        const x0 = 50, x1 = W - 16, y0 = 26, y1 = H - 26;
        const X = x => x0 + x * (x1 - x0), Y = e => y1 - (e - lo) / (hi - lo) * (y1 - y0);
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x0, y1); c.lineTo(x1, y1); c.stroke();
        kit.label(c, 'energy', x0 - 6, y0 - 8, { size: 11.5, color: C.text2, align: 'right' });
        kit.label(c, 'reaction coordinate →', x1, y1 + 14, { size: 11.5, color: C.text2, align: 'right' });
        const path = (pts, col, w, dash) => { c.strokeStyle = col; c.lineWidth = w; c.setLineDash(dash || []); c.beginPath(); for (let i = 0; i <= 200; i++) { const x = i / 200; const yy = Y(energy(pts, x)); i ? c.lineTo(X(x), yy) : c.moveTo(X(x), yy); } c.stroke(); c.setLineDash([]); };
        if (g.plain) path(g.plain, C.faint, 2, [6, 4]);
        path(P, C.text, 2.6);
        // labels: levels, barriers, ΔH
        c.strokeStyle = C.faint; c.lineWidth = 1; c.setLineDash([3, 4]);
        c.beginPath(); c.moveTo(X(P[0][0]), Y(0)); c.lineTo(X(0.97), Y(0)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'reactants', X(P[0][0]), Y(0) + 14, { size: 11.5, color: C.series[0], align: 'center', weight: 650 });
        const last = P[P.length - 1];
        kit.label(c, 'products', X(last[0]), Y(last[1]) + 14, { size: 11.5, color: C.series[2], align: 'center', weight: 650 });
        if (V.mode === 2) kit.label(c, 'intermediate', X(P[2][0]), Y(P[2][1]) + 14, { size: 11.5, color: C.series[4], align: 'center', weight: 650 });
        const tsIdx = V.mode === 2 ? [1, 3] : [1];
        tsIdx.forEach(i => kit.label(c, '‡', X(P[i][0]), Y(P[i][1]) - 12, { size: 15, color: C.bad, align: 'center', weight: 700 }));
        const ax = X(P[1][0]) - 18;
        kit.arrow(c, ax, Y(0), ax, Y(P[1][1]) + 3, C.bad, 1.8);
        kit.label(c, 'Ea ' + Math.round(P[1][1]), ax - 4, (Y(0) + Y(P[1][1])) / 2, { size: 11.5, color: C.bad, align: 'right', bg: C.bg2 });
        if (g.plain) kit.label(c, 'without catalyst', X(g.plain[1][0]), Y(g.plain[1][1]) - 12, { size: 10.5, color: C.muted, align: 'center' });
        const hx = X(0.985);
        kit.arrow(c, hx, Y(0), hx, Y(last[1]), V.dH < 0 ? C.warn : C.accent, 1.8);
        kit.label(c, 'ΔH ' + Math.round(V.dH), hx - 6, (Y(0) + Y(last[1])) / 2, { size: 11.5, color: V.dH < 0 ? C.warn : C.accent, align: 'right', bg: C.bg2 });
        // the molecules
        const cols = [C.series[0], C.series[4], C.series[2]];
        for (const p of parts) {
          let x, colIdx;
          if (p.mv) {
            const u = p.mv.t / p.mv.dur, xa = P[wells[p.mv.from]][0], xb = P[wells[p.mv.to]][0];
            x = xa + (xb - xa) * u; colIdx = wells.length === 3 ? p.mv.from : p.mv.from * 2;
          } else {
            p.ph += dt * 6;
            x = P[wells[p.w]][0] + p.jx + Math.sin(p.ph) * 0.006; colIdx = wells.length === 3 ? p.w : p.w * 2;
          }
          x = clamp(x, 0.01, 0.99);
          kit.dot(c, X(x), Y(energy(P, x)) - 6, 4.5, cols[colIdx], C.surface);
        }
        kit.label(c, 'T = ' + Math.round(V.T) + ' K', x1, y0, { size: 12, color: C.muted, align: 'right' });
      }
      reset(); showControls(); describe();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* ================================================================ Michaelis–Menten */
  const VMAX = 10, KI = 0.5;                            // µM/s, mM
  const KCAT_D = 1.2, KOFF_D = 0.8, KIOFF_D = 0.6;       // animation rates, per second
  Hyper.sim('tk-michaelis', {
    title: 'Enzymes at work: Michaelis–Menten',
    blurb: `Eight enzyme molecules (the notched discs) grab substrate (orange) into their active sites and release product (green). Each enzyme can handle only one substrate at a time, so at high substrate concentration they are all busy and the rate levels off at Vmax. The graph is the Michaelis–Menten curve; tick **Lineweaver–Burk** for the straight-line version.

- Set [S] equal to Km: about half the enzymes are busy, and the rate is Vmax/2.
- A **competitive** inhibitor (grey) sits in the active site. It raises the apparent Km; flood the enzyme with substrate and the full Vmax comes back.
- A **non-competitive** inhibitor binds elsewhere and switches the enzyme off: Vmax falls, Km stays. On the Lineweaver–Burk plot the lines cross on the vertical axis for competitive inhibition and on the horizontal axis for non-competitive.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'S', label: 'Substrate concentration [S]', min: 0.05, max: 20, value: 1, log: true, sig: 3, unit: 'mM' },
        { id: 'Km', label: 'Michaelis constant Km', min: 0.2, max: 5, step: 0.1, value: 1, unit: 'mM' },
        { id: 'inh', type: 'select', label: 'Inhibitor', options: [['none', 0], ['competitive (in the active site)', 1], ['non-competitive (elsewhere)', 2]], value: 0 },
        { id: 'I', label: 'Inhibitor concentration (Ki = 0.5 mM)', min: 0, max: 5, step: 0.1, value: 1, unit: 'mM' },
        { id: 'lb', type: 'check', label: 'Lineweaver–Burk plot (1/v against 1/[S])', value: false }
      ], () => { update(); });
      const ro = kit.readout(box.side, [['v', 'Rate v (Michaelis–Menten)'], ['busy', 'Enzymes working (theory)'], ['seen', 'Enzymes working (in the picture)'], ['km', 'Apparent Km'], ['vm', 'Apparent Vmax']]);
      const plot = kit.plot(graphBox(box), { x: { label: '[S] (mM)', min: 0 }, y: { label: 'v (µM/s)', min: 0 }, legend: true }, 180);
      const V = ctl.values;
      const NE = 8;
      let enz = [], subs = [], prods = [], inhs = [], seen = 0.5, cv = 0;
      function app() {
        const I = V.inh ? V.I : 0;
        const Km = V.inh === 1 ? V.Km * (1 + I / KI) : V.Km;
        const Vm = V.inh === 2 ? VMAX / (1 + I / KI) : VMAX;
        return { Km, Vm, v: Vm * V.S / (Km + V.S) };
      }
      function update() {
        const C = kit.colors(), a = app();
        ro.set('v', kit.fmt(a.v, 3) + ' µM/s');
        ro.set('busy', Math.round(100 * a.v / VMAX) + ' %');
        ro.set('km', kit.fmt(a.Km, 3) + ' mM');
        ro.set('vm', kit.fmt(a.Vm, 3) + ' µM/s');
        const plain = { Km: V.Km, Vm: VMAX };
        const series = [], marks = [];
        const lab = V.inh === 0 ? 'Michaelis–Menten' : 'with inhibitor';
        if (!V.lb) {
          const curve = q => { const out = []; for (let i = 0; i <= 200; i++) { const s = i / 10; out.push([s, q.Vm * s / (q.Km + s)]); } return out; };
          if (V.inh) series.push({ pts: curve(plain), label: 'no inhibitor', dash: [6, 4], width: 1.5, color: C.faint });
          series.push({ pts: curve(a), label: lab, color: C.accent });
          marks.push({ x: V.S, y: a.v, label: 'you are here' });
          plot.set({ x: { label: '[S] (mM)', min: 0, max: 20 }, y: { label: 'v (µM/s)', min: 0, max: VMAX * 1.12 }, series, marks,
            hlines: [{ y: a.Vm, label: 'Vmax' }, { y: a.Vm / 2, label: '½ Vmax' }], vlines: a.Km <= 20 ? [{ x: a.Km, label: 'Km' }] : [] });
        } else {
          const lineOf = q => { const xa = -1 / q.Km; return [[xa, 0], [5, q.Km / (q.Vm * 0.2) + 1 / q.Vm]]; };
          const xmin = -1.15 / Math.min(V.Km, a.Km);
          if (V.inh) series.push({ pts: lineOf(plain), label: 'no inhibitor', dash: [6, 4], width: 1.5, color: C.faint });
          series.push({ pts: lineOf(a), label: lab, color: C.accent });
          const dots = [0.25, 0.5, 1, 2, 5].map(s => [1 / s, (a.Km + s) / (a.Vm * s)]);
          series.push({ pts: dots, line: false, dots: 3, label: 'measured points', color: C.warn });
          marks.push({ x: 1 / V.S, y: (a.Km + V.S) / (a.Vm * V.S), label: '1/v here' });
          plot.set({ x: { label: '1/[S] (1/mM)', min: xmin, max: 5 }, y: { label: '1/v (s/µM)', min: 0, max: Math.max(0.5, (a.Km / 0.2 + 1) / a.Vm * 1.1) }, series, marks,
            hlines: [], vlines: [] });
        }
      }
      function layout(W, H) {
        const w = Math.min(W * 0.62, W - 40), cols = 4, rows = 2;
        enz = enz.length === NE ? enz : Array.from({ length: NE }, () => ({ s: 0, i: 0, flash: 0 }));
        enz.forEach((e, k) => { e.x = 30 + (k % cols + 0.5) * (w - 40) / cols; e.y = 40 + (Math.floor(k / cols) + 0.5) * (H - 60) / rows; });
        return w;
      }
      function drift(p, dt, W, H, xmax) {
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vx += (Math.random() - 0.5) * 60 * dt; p.vy += (Math.random() - 0.5) * 60 * dt;
        const sp = Math.hypot(p.vx, p.vy); if (sp > 45) { p.vx *= 45 / sp; p.vy *= 45 / sp; }
        if (p.x < 8) { p.x = 8; p.vx = Math.abs(p.vx); } if (p.x > xmax) { p.x = xmax; p.vx = -Math.abs(p.vx); }
        if (p.y < 26) { p.y = 26; p.vy = Math.abs(p.vy); } if (p.y > H - 8) { p.y = H - 8; p.vy = -Math.abs(p.vy); }
      }
      const spawn = (W, H, xmax) => ({ x: 10 + Math.random() * (xmax - 20), y: 30 + Math.random() * (H - 40), vx: (Math.random() - 0.5) * 40, vy: (Math.random() - 0.5) * 40 });
      function frame(dt) {
        const C = kit.colors(), c = st.begin(), W = st.W, H = st.H;
        dt = dt || 0;
        const xmax = layout(W, H);
        const kon = (KCAT_D + KOFF_D) / V.Km, konI = KIOFF_D / KI, I = V.inh ? V.I : 0;
        // the enzymes' states: s = substrate bound, i = inhibitor bound
        for (const e of enz) {
          e.flash = Math.max(0, e.flash - dt);
          if (V.inh === 0 && e.i) e.i = 0;
          if (V.inh === 1) {
            if (e.i) { if (Math.random() < KIOFF_D * dt) e.i = 0; continue; }
            if (!e.s && Math.random() < konI * I * dt) { e.i = 1; continue; }
          } else if (V.inh === 2) {
            if (e.i) { if (Math.random() < KIOFF_D * dt) e.i = 0; continue; }
            if (Math.random() < konI * I * dt) { e.i = 1; continue; }
          }
          const r = Math.random();
          if (!e.s) { if (r < kon * V.S * dt) e.s = 1; }
          else if (r < KCAT_D * dt) { e.s = 0; e.flash = 0.35; prods.push({ x: e.x + 18, y: e.y, vx: 40 + Math.random() * 20, vy: (Math.random() - 0.5) * 40, life: 2.5 }); }
          else if (r < (KCAT_D + KOFF_D) * dt) e.s = 0;
        }
        const working = enz.filter(e => e.s && !e.i).length / NE;
        if (dt > 0) seen += (working - seen) * Math.min(1, dt / 6);
        cv += dt;
        if (cv > 0.25) { cv = 0; ro.set('seen', Math.round(100 * seen) + ' % (averaged)'); }
        // the free particles, in proportion to the concentrations
        const nS = Math.min(46, Math.round(3 + 3 * V.S)), nI = V.inh ? Math.min(20, Math.round(4 * I)) : 0;
        while (subs.length < nS) subs.push(spawn(W, H, xmax)); if (subs.length > nS) subs.length = nS;
        while (inhs.length < nI) inhs.push(spawn(W, H, xmax)); if (inhs.length > nI) inhs.length = nI;
        for (const p of subs) drift(p, dt, W, H, xmax);
        for (const p of inhs) drift(p, dt, W, H, xmax);
        for (const p of prods) { drift(p, dt, W, H, xmax); p.life -= dt; }
        prods = prods.filter(p => p.life > 0);
        // draw
        c.fillStyle = C.surface; c.fillRect(4, 22, xmax + 8, H - 26);
        const sCol = C.series[1], pCol = C.series[2], eCol = C.series[5];
        for (const p of subs) kit.dot(c, p.x, p.y, 3.5, sCol);
        for (const p of prods) { c.globalAlpha = clamp(p.life / 2.5, 0, 1); kit.dot(c, p.x, p.y, 3.5, pCol); c.globalAlpha = 1; }
        for (const p of inhs) { c.fillStyle = C.muted; c.fillRect(p.x - 3.5, p.y - 3.5, 7, 7); }
        const re = clamp(Math.min(W, H) / 16, 12, 22);
        for (const e of enz) {
          c.beginPath(); c.moveTo(e.x, e.y); c.arc(e.x, e.y, re, 0.55, Math.PI * 2 - 0.55); c.closePath();
          c.fillStyle = eCol; c.globalAlpha = e.i && V.inh === 2 ? 0.45 : 0.85; c.fill(); c.globalAlpha = 1;
          c.strokeStyle = C.text2; c.lineWidth = 1.2; c.stroke();
          if (e.s) kit.dot(c, e.x + re * 0.62, e.y, re * 0.3, sCol, C.surface);
          if (e.i) { c.fillStyle = C.muted; const ix = V.inh === 1 ? e.x + re * 0.62 : e.x - re * 0.95; c.fillRect(ix - re * 0.25, e.y - re * 0.25, re * 0.5, re * 0.5); }
          if (e.flash > 0) { c.strokeStyle = pCol; c.lineWidth = 2; c.beginPath(); c.arc(e.x, e.y, re + 6 * (1 - e.flash / 0.35) + 2, 0, Math.PI * 2); c.stroke(); }
        }
        kit.label(c, 'E + S ⇌ ES → E + P', 10, 12, { size: 13, weight: 650 });
        // the dial of how busy the enzymes are
        const a = app(), dx = xmax + 30, dw = Math.max(60, W - dx - 14);
        kit.label(c, 'working now', dx, 40, { size: 12, color: C.text2 });
        c.fillStyle = C.grid; c.fillRect(dx, 52, dw, 14);
        c.fillStyle = C.accent; c.fillRect(dx, 52, dw * working, 14);
        kit.label(c, 'average ' + Math.round(100 * seen) + ' %', dx, 80, { size: 12, color: C.text2 });
        c.fillStyle = C.grid; c.fillRect(dx, 92, dw, 14);
        c.fillStyle = C.ok; c.fillRect(dx, 92, dw * seen, 14);
        kit.label(c, 'theory ' + Math.round(100 * a.v / VMAX) + ' %', dx, 120, { size: 12, color: C.text2 });
        c.fillStyle = C.grid; c.fillRect(dx, 132, dw, 14);
        c.fillStyle = C.warn; c.fillRect(dx, 132, dw * a.v / VMAX, 14);
        kit.label(c, '[S] = ' + kit.fmt(V.S, 3) + ' mM', dx, 166, { size: 12.5, weight: 600 });
        kit.label(c, 'Km (apparent) = ' + kit.fmt(a.Km, 3) + ' mM', dx, 186, { size: 12, color: C.text2 });
      }
      update();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
