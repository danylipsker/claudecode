/* HYPER-WATER · sims/melting-and-boiling.js — the simulations of "Why it is liquid" (topic melting-and-boiling).
 *   mb-hydride-ladder   the boiling points of the hydrides of groups 14–17 against period, with hydrogen bonding switched off
 *   mb-heating-curve    ice to steam at a chosen power: the two plateaus, the beaker and the share of the heat in each stage
 *   mb-bond-ledger      one mole of ice taken apart: the energy ladder, the bonds on screen and Hess's law
 *   mb-vapour-pressure  the vapour-pressure curve, a wet cloth in moving air, the dew point and the wet-bulb temperature
 *   mb-altitude         the boiling point against altitude, in a pressure cooker and on a summit, and what it does to cooking
 *   mb-phase-diagram    the pressure–temperature map of water with a draggable state point
 *   mb-supercritical    a sealed tube heated through the critical point: the meniscus fades and vanishes
 *   mb-triple-point     a triple-point cell and the three small corrections that separate it from the ice point
 * The numbers come from kit.water (water.js: IAPWS vapour-pressure, sublimation and melting curves, latent heats,
 * heatToWarm, the standard molecules); the drawing from kit.wsym. A few small local tables (the hydrides of groups 14, 15
 * and 17 outside the engine's molecule list, and the saturated densities near the critical point) are named where used.
 */
(function () {
  'use strict';
  const TAU = Math.PI * 2;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const num = (v, d) => (Number.isFinite(v) ? v : 0).toFixed(d == null ? 1 : d).replace('-', '−');
  const sci = (v, d) => { if (!Number.isFinite(v) || v === 0) return '0'; const e = Math.floor(Math.log10(Math.abs(v))); const m = v / Math.pow(10, e); return num(m, d == null ? 2 : d) + '×10' + String(e).replace('-', '⁻').replace(/\d/g, c => '⁰¹²³⁴⁵⁶⁷⁸⁹'[c]); };
  const fP = p => !Number.isFinite(p) ? '—' : p >= 1e9 ? num(p / 1e9, 2) + ' GPa' : p >= 1e6 ? num(p / 1e6, 2) + ' MPa' : p >= 1e3 ? num(p / 1e3, 2) + ' kPa' : num(p, p < 10 ? 2 : 1) + ' Pa';
  const fT = s => { s = Math.max(0, s); const m = Math.floor(s / 60); return m + ' min ' + Math.round(s - 60 * m) + ' s'; };
  const text = (kit, c, s, x, y, o) => kit.label(c, s, x, y, o);

  /* ================================================================ 1. the hydride ladder */
  Hyper.sim('mb-hydride-ladder', {
    title: 'The hydride ladder',
    blurb: `The boiling points of the hydrides of the four columns of the periodic table that follow carbon, against the row of the central atom. Three columns climb as you go down — heavier molecules, stronger dispersion forces. At the top of each column stands a molecule that can form hydrogen bonds, and for three of the four it is far above the trend. The dashed line extends the trend of the three heavier members up one row.

**Try this**
- Tick *Switch off hydrogen bonding*: ammonia, water and hydrogen fluoride slide down to the trend line — and water lands near −80 °C, a gas at room temperature. Methane does not move: it never had a hydrogen bond.
- Read the excess of each column. It grows with the number of bonds a molecule can make: methane none, ammonia one, hydrogen fluoride one strong, water two donors and two acceptors.
- Look at the liquid range of water at the bottom: 100 K with the bond, a 20 K window in the deep cold without it.
- Choose one column to see it alone.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 520 });
      const M = id => { const m = W.MOLECULES.find(x => x.id === id); return m; };
      /* boiling points [formula, mass, bp °C (, mp °C)]: the first, and group 16, from the engine; the heavier hydrides of groups 14, 15 and 17 from the CRC Handbook */
      const eng = (id, f) => [f, M(id).mass, M(id).bp, M(id).mp];
      const GROUPS = [
        { g: '14', name: 'Group 14', hy: [eng('CH4', 'CH₄'), ['SiH₄', 32.12, -111.9], ['GeH₄', 76.67, -88.5], ['SnH₄', 122.73, -52]] },
        { g: '15', name: 'Group 15', hy: [eng('NH3', 'NH₃'), ['PH₃', 34.0, -87.7], ['AsH₃', 77.95, -62.5], ['SbH₃', 124.78, -17]] },
        { g: '16', name: 'Group 16', hy: [eng('H2O', 'H₂O'), eng('H2S', 'H₂S'), eng('H2Se', 'H₂Se'), eng('H2Te', 'H₂Te')] },
        { g: '17', name: 'Group 17', hy: [eng('HF', 'HF'), ['HCl', 36.46, -85.0], ['HBr', 80.91, -66.8], ['HI', 127.91, -35.4]] }
      ];
      /* the value expected for the first member: the mean of the line through the periods 3 and 5 extended to period 2 and the line against mass */
      const trend = (hy, k) => {
        const a = hy[1], c = hy[3];
        const byP = a[k] - (c[k] - a[k]) / 2;
        const byM = a[k] + (c[k] - a[k]) / (c[1] - a[1]) * (hy[0][1] - a[1]);
        return { lo: Math.min(byP, byM), hi: Math.max(byP, byM), mid: (byP + byM) / 2 };
      };
      const ctl = kit.controls(box.side, [
        { id: 'off', type: 'check', label: 'Switch off hydrogen bonding', value: !!params.off },
        { id: 'show', type: 'select', label: 'Show', options: [['All four columns', 'all'], ['Group 14 (CH₄ …)', '14'], ['Group 15 (NH₃ …)', '15'], ['Group 16 (H₂O …)', '16'], ['Group 17 (HF …)', '17']], value: params.show || 'all' },
        { id: 'trend', type: 'check', label: 'Show the trend lines', value: true },
        { id: 'room', type: 'check', label: 'Mark room temperature', value: true }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['e14', 'Methane vs its column'], ['e15', 'Ammonia vs its column'], ['e16', 'Water vs its column'], ['e17', 'Hydrogen fluoride vs its column'], ['range', 'Liquid range of water']]);
      let k = V.off ? 1 : 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors();
        k += ((V.off ? 1 : 0) - k) * Math.min(1, dt * 4.5);
        if (Math.abs((V.off ? 1 : 0) - k) < 0.002) k = V.off ? 1 : 0;
        const g = { x0: 58, y0: 16, x1: st.W - 14, y1: st.H - 46 };
        const ymin = -200, ymax = 150;
        const X = p => g.x0 + (p - 1.7) / (5.4 - 1.7) * (g.x1 - g.x0);
        const Y = t => g.y1 - (t - ymin) / (ymax - ymin) * (g.y1 - g.y0);
        // frame, grid, labels
        for (let t = ymin; t <= 120; t += 40) {
          c.strokeStyle = t === 0 ? C.axis : C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(g.x0, Y(t)); c.lineTo(g.x1, Y(t)); c.stroke();
          text(kit, c, num(t, 0) + ' °C', g.x0 - 6, Y(t), { align: 'right', size: 10.5, color: C.muted });
        }
        for (let p = 2; p <= 5; p++) {
          c.strokeStyle = C.grid; c.beginPath(); c.moveTo(X(p), g.y0); c.lineTo(X(p), g.y1); c.stroke();
          text(kit, c, 'row ' + p, X(p), g.y1 + 6, { align: 'center', baseline: 'top', size: 11, color: C.muted });
        }
        text(kit, c, 'period of the central atom →', g.x1, st.H - 6, { align: 'right', baseline: 'bottom', size: 11, color: C.muted });
        text(kit, c, 'boiling point at 1 atm', g.x0 + 4, g.y0 + 2, { size: 11, color: C.muted, baseline: 'top' });
        if (V.room) {
          c.save(); c.setLineDash([2, 4]); c.strokeStyle = C.warn; c.beginPath(); c.moveTo(g.x0, Y(25)); c.lineTo(g.x1, Y(25)); c.stroke(); c.restore();
          text(kit, c, 'room temperature: below this line a hydride is a gas', g.x1 - 4, Y(25) - 8, { align: 'right', size: 10.5, color: C.warn });
        }
        const info = {};
        GROUPS.forEach((G, gi) => {
          const col = C.series[gi % C.series.length], dim = V.show !== 'all' && V.show !== G.g;
          const tr = trend(G.hy, 2), actual = G.hy[0][2];
          const y0v = lerp(actual, tr.mid, G.g === '14' ? 0 : k);
          const pts = [[2, y0v], [3, G.hy[1][2]], [4, G.hy[2][2]], [5, G.hy[3][2]]];
          info[G.g] = { actual, tr, now: y0v };
          c.save(); c.globalAlpha = dim ? 0.18 : 1;
          if (V.trend) {
            c.setLineDash([5, 4]); c.strokeStyle = col; c.lineWidth = 1.3; c.globalAlpha = dim ? 0.1 : 0.7;
            c.beginPath(); c.moveTo(X(3), Y(G.hy[1][2])); c.lineTo(X(2), Y(tr.mid)); c.stroke();
            c.setLineDash([]); c.globalAlpha = dim ? 0.1 : 0.35; c.fillStyle = col;
            c.beginPath(); c.moveTo(X(2) - 5, Y(tr.lo)); c.lineTo(X(2) + 5, Y(tr.lo)); c.lineTo(X(2) + 5, Y(tr.hi)); c.lineTo(X(2) - 5, Y(tr.hi)); c.closePath(); c.fill();
            c.globalAlpha = dim ? 0.18 : 1;
          }
          c.setLineDash([]); c.strokeStyle = col; c.lineWidth = 2.2; c.beginPath();
          pts.forEach((p, i) => i ? c.lineTo(X(p[0]), Y(p[1])) : c.moveTo(X(p[0]), Y(p[1]))); c.stroke();
          if (G.g !== '14' && k > 0.02 && k < 0.999) {   // the molecule on its way down
            c.strokeStyle = col; c.lineWidth = 1; c.beginPath(); c.arc(X(2), Y(actual), 5, 0, TAU); c.stroke();
            kit.arrow(c, X(2) + 12, Y(actual) + 4, X(2) + 12, Y(y0v) - 4, col, 1.3);
          }
          pts.forEach((p, i) => {
            kit.dot(c, X(p[0]), Y(p[1]), i === 0 ? 6 : 4.5, col, C.bg2);
            text(kit, c, G.hy[i][0], X(p[0]) + 9, Y(p[1]) + (i === 0 ? (G.g === '14' ? 12 : -12) : (gi - 1.5) * 11), { size: i === 0 ? 12.5 : 11, weight: i === 0 ? 700 : 500, color: C.text });
          });
          c.restore();
        });
        // water's verdict
        const w = info['16'];
        if (V.show === 'all' || V.show === '16') {
          text(kit, c, k < 0.5 ? 'water: boils at +100 °C, a liquid' : 'water without the bond: ' + num(w.now, 0) + ' °C, a gas', X(2) + 22, Y(w.now) + (k < 0.5 ? 14 : -14), { size: 11.5, weight: 650, color: k < 0.5 ? C.accent : C.bad });
        }
        // readouts
        for (const G of GROUPS) {
          const i = info[G.g], ex = i.actual - i.tr.mid;
          ro.set('e' + G.g, (ex >= 0 ? '+' : '') + num(ex, 0) + ' K  (' + num(i.actual, 0) + ' vs ' + num(i.tr.mid, 0) + ' °C)');
        }
        const wg = GROUPS[2].hy, mpT = trend(wg, 3).mid, bpT = trend(wg, 2).mid;
        ro.set('range', V.off ? num(mpT, 0) + ' to ' + num(bpT, 0) + ' °C: ' + num(bpT - mpT, 0) + ' K wide' : '0 to 100 °C: 100 K wide');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 2. the heating curve */
  Hyper.sim('mb-heating-curve', {
    title: 'Heating ice to steam',
    blurb: `A block of ice, warmed by a heater of fixed power, all the way to steam. The graph is temperature against heat added: it climbs where one phase is warming and stands still on two plateaus where the heat goes into changing the phase, not the temperature — melting at 0 °C and boiling at 100 °C. The bar under the beaker is drawn to scale: how much of the total heat each stage takes.

**Try this**
- Press *Play* and watch the beaker. The first plateau (melting) is short; the second (boiling) is 6.8 times longer, 2,257 kJ against 334 kJ per kilogram.
- Drag *Progress* to stop in the middle of a plateau and read the state: half-melted ice is still at 0 °C.
- Raise the heater power: the curve against *heat* does not change at all; only the time to travel it does.
- Start colder: the ice slope is steeper than the water slope (its specific heat is half as large), and so is steam's.
- Read the share of the heat in the boiling stage — roughly 70 % of everything you pay.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym, focus = params.focus || 'all';
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 260, maxH: 340 });
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px'; box.stage.appendChild(graph);
      let playing = false, frac = 0;
      const ctl = kit.controls(box.side, [
        { id: 'm', label: 'Mass', min: 0.1, max: 3, step: 0.1, value: 1, unit: 'kg' },
        { id: 'P', label: 'Heater power', min: 0.2, max: 5, step: 0.1, value: 2, unit: 'kW' },
        { id: 'T0', label: 'Starting temperature', min: -40, max: -1, step: 1, value: -20, unit: '°C' },
        { id: 'speed', label: 'Time speed-up', min: 1, max: 200, step: 1, value: 40, unit: '×' },
        { id: 'prog', label: 'Progress along the curve', min: 0, max: 100, step: 0.1, value: 0, unit: '%' },
        { type: 'buttons', items: [{ id: 'play', label: 'Play / pause', primary: true }, { id: 'restart', label: 'Restart' }] }
      ], (id, v) => {
        if (id === 'play') playing = !playing;
        else if (id === 'restart') { frac = 0; ctl.set('prog', 0); playing = true; }
        else if (id === 'prog') { frac = v / 100; playing = false; }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Temperature'], ['state', 'The sample'], ['Q', 'Heat added'], ['t', 'Time at this power'], ['plat', 'Plateaus, min:s (melt · boil)'], ['share', 'Share of the heat in boiling'], ['bonds', 'Hydrogen bonds per molecule (model)']]);
      const plot = kit.plot(graph, { x: { label: 'heat added (kJ)', min: 0 }, y: { label: 'temperature (°C)', min: -45, max: 160 }, legend: false }, 200);
      // constants read from the engine
      const LF = W.LATENT_FUSION, LV = Math.round(W.heatToWarm(1, 100 - 1e-9, 100 + 1e-9));
      const cpI = W.heatToWarm(1, -20, -10) / 10, cpW = W.heatToWarm(1, 0, 100) / 100, cpS = W.heatToWarm(1, 100, 110) / 10;
      function path() {
        const m = V.m, T0 = V.T0, qa = W.heatToWarm(m, T0, 0), qb = qa + m * LF, qc = qb + W.heatToWarm(m, 0, 100), qd = qc + m * LV, qe = qd + W.heatToWarm(m, 100, 150);
        return { m, T0, qa, qb, qc, qd, qe };
      }
      function at(Pth, Q) {   // the state of the sample after heat Q (J)
        const { m, T0, qa, qb, qc, qd } = Pth;
        if (Q <= qa) return { T: T0 + Q / (m * cpI), ice: 1, liq: 0, vap: 0, name: 'ice, warming' };
        if (Q <= qb) { const f = (Q - qa) / (qb - qa); return { T: 0, ice: 1 - f, liq: f, vap: 0, name: 'melting: ' + Math.round(f * 100) + ' % liquid' }; }
        if (Q <= qc) return { T: (Q - qb) / (m * cpW), ice: 0, liq: 1, vap: 0, name: 'liquid water, warming' };
        if (Q <= qd) { const f = (Q - qc) / (qd - qc); return { T: 100, ice: 0, liq: 1 - f, vap: f, name: 'boiling: ' + Math.round(f * 100) + ' % steam' }; }
        return { T: 100 + (Q - qd) / (m * cpS), ice: 0, liq: 0, vap: 1, name: 'steam, warming' };
      }
      let key = '';
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const Pth = path(), Pw = V.P * 1000, Qmax = focus === 'melting' ? Pth.qb + Pth.m * cpW * 30 : Pth.qe;
        if (playing) {
          frac = Math.min(1, frac + Pw * dt * V.speed / Pth.qe);
          ctl.set('prog', frac * 100);
          if (frac >= 1) playing = false;
        }
        const Q = frac * Pth.qe, s = at(Pth, Q);
        // the plot (rebuilt only when the inputs change)
        const k2 = [V.m, V.T0, focus].join('|');
        if (k2 !== key) {
          key = k2;
          const pts = []; for (let i = 0; i <= 400; i++) { const q = i / 400 * Qmax; pts.push([q / 1e3, at(Pth, q).T]); }
          plot.set({ series: [{ pts, label: 'temperature', color: C.accent, width: 2.6 }], x: { label: 'heat added (kJ)', min: 0, max: Qmax / 1e3 }, y: { label: 'temperature (°C)', min: Math.floor(V.T0 / 10) * 10 - 5, max: focus === 'melting' ? 40 : 160 }, hlines: [{ y: 0, label: 'melts' }, { y: 100, label: 'boils' }] });
        }
        plot.set({ marks: [{ x: Math.min(Q, Qmax) / 1e3, y: Math.min(s.T, 160), label: num(s.T, 0) + ' °C', color: C.bad }] });
        // the beaker
        const bw = Math.min(120, Wd * 0.2), bh = Hh - 96, bx = 30, by = 24;
        const liqCol = 'rgba(70,150,235,0.5)';
        S.beaker(c, bx, by, bw, bh, 0.78 * s.liq, { liquid: liqCol });
        text(kit, c, num(Pth.m, 1) + ' kg of water', bx + bw / 2, by + bh + 24, { align: 'center', size: 11.5, color: C.muted });
        if (s.ice > 0) {   // ice floats on the liquid and sits on the bottom when nothing melted
          const ih = 0.55 * bh * s.ice * 0.75 + 4, iy = s.liq > 0 ? by + bh - 0.78 * s.liq * bh - ih * 0.7 : by + bh - ih - 2;
          c.fillStyle = 'rgba(205,235,255,0.92)'; c.strokeStyle = C.text; c.lineWidth = 1.2;
          c.beginPath(); c.rect(bx + 14, iy, bw - 28, ih); c.fill(); c.stroke();
        }
        if (s.vap > 0) for (let i = 0; i < 5; i++) {   // steam wisps
          const wx = bx + bw * (0.12 + 0.19 * i), wy = by - 4;
          c.save(); c.globalAlpha = Math.min(1, 0.25 + s.vap); c.strokeStyle = C.muted; c.lineWidth = 2; c.beginPath();
          c.moveTo(wx, wy); c.bezierCurveTo(wx - 8, wy - 8, wx + 8, wy - 16, wx, wy - 22); c.stroke(); c.restore();
        }
        c.fillStyle = s.T > 150 ? C.bad : C.warn; c.fillRect(bx - 8, by + bh + 3, bw + 16, 5);
        S.thermometer(c, bx + bw + 38, by, bh, Math.min(s.T, 160), { min: -45, max: 160 });
        text(kit, c, s.name, bx + bw + 110, by + 12, { size: 12.5, weight: 650, color: C.text });
        text(kit, c, 'ice ' + Math.round(s.ice * 100) + ' % · water ' + Math.round(s.liq * 100) + ' % · steam ' + Math.round(s.vap * 100) + ' %', bx + bw + 110, by + 32, { size: 11.5, color: C.muted });
        // the budget bar, to scale
        const bx0 = bx + bw + 110, bx1 = Wd - 18, byy = Hh - 52, bhh = 22, tot = Pth.qe;
        const seg = [['ice', Pth.qa, C.accent, false], ['melt', Pth.qb - Pth.qa, C.warn, true], ['water', Pth.qc - Pth.qb, C.accent, false], ['boil', Pth.qd - Pth.qc, C.warn, true], ['steam', Pth.qe - Pth.qd, C.accent, false]];
        let xx = bx0;
        for (const [nm, q, col, latent] of seg) {
          const w = q / tot * (bx1 - bx0);
          c.save(); c.globalAlpha = latent ? 0.85 : 0.45; c.fillStyle = col; c.fillRect(xx, byy, Math.max(1, w), bhh); c.restore();
          c.strokeStyle = C.bg2; c.lineWidth = 1; c.strokeRect(xx, byy, Math.max(1, w), bhh);
          if (w > 56) text(kit, c, nm === 'melt' ? 'melt ' + num(q / 1e3, 0) + ' kJ' : nm === 'boil' ? 'boil ' + num(q / 1e3, 0) + ' kJ' : num(q / 1e3, 0) + ' kJ', xx + w / 2, byy + bhh / 2, { align: 'center', size: 10.5, color: C.text });
          xx += w;
        }
        const mx = bx0 + clamp(Q / tot, 0, 1) * (bx1 - bx0);
        c.fillStyle = C.bad; c.beginPath(); c.moveTo(mx, byy - 2); c.lineTo(mx - 6, byy - 12); c.lineTo(mx + 6, byy - 12); c.closePath(); c.fill();
        text(kit, c, 'to scale: pale = warming (sensible heat), strong = latent heat', bx0, byy + bhh + 14, { size: 10.5, color: C.muted });
        // readouts
        const t1 = (Pth.qb - Pth.qa) / Pw, t2 = (Pth.qd - Pth.qc) / Pw;
        ro.set('T', num(s.T, 1) + ' °C');
        ro.set('state', s.name);
        ro.set('Q', num(Q / 1e3, 0) + ' kJ of ' + num(tot / 1e3, 0));
        ro.set('t', fT(Q / Pw) + (Q > 0 ? '' : ''));
        ro.set('plat', fT(t1).replace(' min ', ':').replace(' s', '') + ' · ' + fT(t2).replace(' min ', ':').replace(' s', '') + ' (× ' + num(t2 / t1, 1) + ')');
        ro.set('share', num((Pth.qd - Pth.qc) / tot * 100, 0) + ' %');
        ro.set('bonds', s.vap >= 1 ? '0 (vapour)' : s.ice >= 1 ? '4 (ice)' : num(s.liq * W.hbondsPerMolecule(Math.max(0, Math.min(100, s.T))) + s.ice * 4, 2));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 3. the bond ledger */
  Hyper.sim('mb-bond-ledger', {
    title: 'One mole of ice, taken apart',
    blurb: `Add energy to one mole of ice (18 grams, 6×10²³ molecules) and watch what it pays for. The molecules on the left are drawn from the engine's bond model; the ladder on the right is the energy budget in kJ per mole, and the red dot is where you are. The first 6.0 kJ/mol melts the ice — only an eighth of the 51.1 kJ/mol that holds the crystal together. The next 7.6 kJ/mol warms the liquid to 100 °C. The last 40.7 kJ/mol boils it, tearing out the rest of the bonds.

**Try this**
- Press *Melt*: bonds per molecule fall from 4 to 3.9 (by the geometric count) — but the energy spent is already 12 % of the total. Melting bends and disorders the net more than it breaks it.
- Press *Boiling point*: the liquid at 100 °C holds about 3.1 bonds per molecule.
- Drag through the boiling plateau: the temperature does not move, the molecules leave one by one, and the bond count falls to zero.
- Hess's law at the right: melt + vaporise at 0 °C (6.01 + 45.05) equals sublimation (51.06), whichever path.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 520 });
      const kJ = j => j * W.M * 1e-3 / 1e3;      // J/kg -> kJ/mol
      const Efus = kJ(W.LATENT_FUSION), Ewarm = kJ(W.heatToWarm(1, 0, 100)), Eboil = kJ(Math.round(W.heatToWarm(1, 100 - 1e-9, 100 + 1e-9))), Esub = kJ(W.LATENT_SUBLIMATION), Evap0 = Esub - Efus;
      const E2 = Efus + Ewarm, E3 = E2 + Eboil;
      const Emax = Math.ceil(E3 + 3);
      const ctl = kit.controls(box.side, [
        { id: 'E', label: 'Energy added to one mole', min: 0, max: Emax, step: 0.05, value: params.E != null ? params.E : 0, unit: 'kJ/mol' },
        { id: 'bonds', type: 'check', label: 'Show the hydrogen bonds', value: true },
        { type: 'buttons', items: [{ id: 'melt', label: 'Melt', primary: true }, { id: 'bp', label: 'Boiling point' }, { id: 'gas', label: 'All vapour' }, { id: 'ice', label: 'Ice' }] }
      ], (id) => { if (id === 'melt') ctl.set('E', Efus); else if (id === 'bp') ctl.set('E', E2); else if (id === 'gas') ctl.set('E', E3 + 0.5); else if (id === 'ice') ctl.set('E', 0); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['state', 'The sample'], ['T', 'Temperature'], ['frac', 'Share of the cohesive energy spent'], ['hb', 'Bonds per molecule (model)'], ['scr', 'Bonds drawn on screen'], ['hess', 'Hess: melt + vaporise at 0 °C']]);
      const N = 22;
      let net = null, gas = null, sc = 16, accB = 0, cntB = 0, lw = 0, lh = 0;
      const state = E => {
        if (E <= 0) return { T: 0, ice: 1, f: 0, x: 0, hb: 4, name: 'ice at 0 °C' };
        if (E < Efus) { const f = E / Efus; return { T: 0, ice: 1 - f, f, x: 0, hb: lerp(4, W.hbondsPerMolecule(0), f), name: 'melting: ' + Math.round(f * 100) + ' % liquid, still 0 °C' }; }
        if (E < E2) { const T = 100 * (E - Efus) / Ewarm; return { T, ice: 0, f: 1, x: 0, hb: W.hbondsPerMolecule(T), name: 'liquid water, warming' }; }
        if (E < E3) { const x = (E - E2) / Eboil; return { T: 100, ice: 0, f: 1, x, hb: (1 - x) * W.hbondsPerMolecule(100), name: 'boiling: ' + Math.round(x * 100) + ' % vapour, still 100 °C' }; }
        return { T: 100 + (E - E3) / kJ(W.heatToWarm(1, 100, 101)), ice: 0, f: 1, x: 1, hb: 0, name: 'steam, warming' };
      };
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const s = state(V.E);
        // layout
        const lx = 14, ly = 30, lwid = Math.max(170, Wd * 0.5), lhei = Hh - 78, ofy = lhei * 0.38;
        if (!net || lw !== lwid) {
          lw = lwid; lh = lhei; sc = clamp(Math.sqrt(lw * lh * 0.62 / N) / 4.4, 10, 20);
          net = S.makeNetwork(N, lw, lh * 0.62, sc, 11);
          gas = []; const r = net.rng; for (let i = 0; i < N; i++) gas.push({ x: r() * lw, y: r() * lh, a: r() * TAU, vx: (r() - 0.5) * 160, vy: (r() - 0.5) * 160, va: (r() - 0.5) * 4 });
        }
        c.save(); c.strokeStyle = C.border2 || C.axis; c.lineWidth = 1; c.strokeRect(lx, ly, lw, lh); c.restore();
        const nLiq = Math.round((1 - s.x) * N), step = Math.min(dt, 0.05);
        c.save(); c.translate(lx, ly); c.beginPath(); c.rect(0, 0, lw, lh); c.clip();
        let bonds = [];
        if (nLiq > 0) { const liq = net.slice(0, nLiq); liq.rng = net.rng; for (let i = 0; i < 2; i++) bonds = S.stepNetwork(liq, step / 2, { T: s.T, W: lw, H: lh * 0.62, scale: sc }); }
        // the ice lattice fades into the liquid as it melts
        if (s.ice > 0.001) { c.save(); c.globalAlpha = clamp(s.ice, 0, 1) * 0.95; S.iceLattice(c, lw / 2, ofy + lh * 0.31, Math.min(lw, lh) / 13, 2, { molecules: true, angle: Math.PI / 6 }); c.restore(); }
        if (s.ice < 0.999) {
          c.save(); c.globalAlpha = clamp(1 - s.ice, 0, 1);
          const liq = net.slice(0, nLiq);
          c.save(); c.translate(0, ofy);
          if (nLiq > 0) S.network(c, liq, { scale: sc, bonds: V.bonds ? bonds : [] });
          c.restore();
          c.restore();
        }
        // vapour: free molecules bouncing in the box, no bonds
        const nGas = N - nLiq;
        for (let i = 0; i < nGas; i++) {
          const m = gas[N - 1 - i], sp = 0.5 + s.T / 120;
          m.x += m.vx * step * sp; m.y += m.vy * step * sp; m.a += m.va * step;
          if (m.x < sc || m.x > lw - sc) { m.vx = -m.vx; m.x = clamp(m.x, sc, lw - sc); }
          if (m.y < sc || m.y > lh - sc) { m.vy = -m.vy; m.y = clamp(m.y, sc, lh - sc); }
          S.molecule(c, m.x, m.y, { angle: m.a, scale: sc });
        }
        c.restore();
        text(kit, c, s.name, lx, ly - 14, { size: 12.5, weight: 650, color: C.text });
        // the ladder
        const rx = lx + lw + 124, rw = Wd - rx - 16, top = ly, bot = ly + lh;
        const Y = e => bot - e / (E3 + 2) * (bot - top);
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(rx, top); c.lineTo(rx, bot); c.stroke();
        const stages = [[0, Efus, C.warn, 'melting ' + num(Efus, 1)], [Efus, E2, C.accent, 'warming ' + num(Ewarm, 1)], [E2, E3, C.bad, 'boiling ' + num(Eboil, 1)]];
        for (const [a, b, col, nm] of stages) {
          c.save(); c.globalAlpha = 0.35; c.fillStyle = col; c.fillRect(rx + 2, Y(b), 28, Y(a) - Y(b)); c.restore();
          text(kit, c, nm, rx + 36, (Y(a) + Y(b)) / 2, { size: 11, color: C.text });
        }
        for (const [e, nm] of [[0, 'ice, 0 °C'], [Efus, 'water, 0 °C'], [E2, 'water, 100 °C'], [E3, 'steam, 100 °C']]) {
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(rx - 4, Y(e)); c.lineTo(rx + 30, Y(e)); c.stroke();
          text(kit, c, nm + '  ' + num(e, 1), rx - 8, Y(e) - 7, { align: 'right', size: 10.5, color: C.muted });
        }
        // Hess: sublimation bracket
        const hx = Math.max(rx + 100, Wd - 54);
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(hx, Y(0)); c.lineTo(hx + 8, Y(0)); c.lineTo(hx + 8, Y(Esub)); c.lineTo(hx, Y(Esub)); c.stroke();
        text(kit, c, 'sublim.', hx + 12, Y(Esub / 2) - 8, { size: 10.5, color: C.ok });
        text(kit, c, num(Esub, 1), hx + 12, Y(Esub / 2) + 6, { size: 10.5, color: C.ok, weight: 650 });
        c.setLineDash([3, 3]); c.strokeStyle = C.ok; c.beginPath(); c.moveTo(rx, Y(Esub)); c.lineTo(hx, Y(Esub)); c.stroke(); c.setLineDash([]);
        kit.dot(c, rx, Y(clamp(V.E, 0, E3 + 2)), 7, C.bad, '#fff');
        // bonds on screen
        accB += bonds.filter(b => b[0] < nLiq && b[1] < nLiq).length; cntB++;
        if (cntB >= 10) { ro.set('scr', num(accB / cntB / N, 2) + ' per molecule (' + Math.round(accB / cntB) + ')'); accB = 0; cntB = 0; }
        ro.set('state', s.name);
        ro.set('T', num(s.T, 1) + ' °C');
        ro.set('frac', num(Math.min(V.E, Esub) / Esub * 100, 0) + ' % of ' + num(Esub, 1) + ' kJ/mol  (' + num(V.E, 2) + ' spent)');
        ro.set('hb', num(s.hb, 2) + ' of 4');
        ro.set('hess', num(Efus, 2) + ' + ' + num(Evap0, 2) + ' = ' + num(Efus + Evap0, 2) + ' = ' + num(Esub, 2) + ' kJ/mol');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 4. vapour pressure and the wet cloth */
  Hyper.sim('mb-vapour-pressure', {
    title: 'Vapour pressure and the wet cloth',
    blurb: `A wet cloth in moving air. Blue dots leave the cloth at a rate set by the saturation vapour pressure *at the cloth's own temperature*; orange dots arrive from the air at a rate set by the vapour already in it. When the blue outnumber the orange the cloth dries — and cools, because the escaping molecules carry off the latent heat, until it settles at the wet-bulb temperature. The graph is the vapour-pressure curve of water: the red dot is the air at its temperature, the green dot the wet cloth, and the amber dot the dew point (where the curve meets the vapour already in the air).

**Try this**
- At 100 % humidity nothing dries and nothing cools: the two streams are equal and the cloth stays at the air temperature.
- Dry the air to 20 %: the cloth falls many degrees below it, a wet-bulb cooling you feel as a chill.
- Raise the air temperature by ten degrees at a fixed humidity: the saturation pressure nearly doubles, and so does the drying rate.
- Read the fractional rise of vapour pressure per kelvin: about 6 % at room temperature, 7 % near freezing. Switch the axis to logarithmic and the curve is almost a straight line.
- The wind (the model is schematic) widens the gap between the streams by removing the vapour near the cloth.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 230, maxH: 300 });
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px'; box.stage.appendChild(graph);
      const ctl = kit.controls(box.side, [
        { id: 'Ta', label: 'Air temperature', min: -10, max: 45, step: 0.5, value: params.Ta != null ? params.Ta : 30, unit: '°C' },
        { id: 'RH', label: 'Relative humidity', min: 5, max: 100, step: 1, value: params.RH != null ? params.RH : 50, unit: '%' },
        { id: 'wind', label: 'Wind over the cloth', min: 0, max: 10, step: 0.5, value: 1, unit: 'm/s' },
        { id: 'log', type: 'check', label: 'Logarithmic pressure axis', value: false }
      ], () => {});
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ps', 'Saturation pressure of the air'], ['pv', 'Vapour pressure in the air'], ['Td', 'Dew point'], ['Tw', 'Wet cloth settles at'], ['cool', 'Cooling below the air'], ['rate', 'Drying rate (30 °C, 50 %, 1 m/s = 1)'], ['cc', 'Rise of saturation pressure']]);
      const plot = kit.plot(graph, { x: { label: 'temperature (°C)', min: -20, max: 60 }, y: { label: 'vapour pressure (kPa)' }, legend: false }, 190);
      const pts = []; for (let T = -20; T <= 60; T += 1) pts.push([T, W.saturationPressure(T) / 1e3]);
      const sat = T => W.saturationPressure(T);
      const state = () => {
        const Ta = V.Ta, rh = V.RH / 100, ps = sat(Ta), pv = rh * ps;
        const Tw = rh >= 0.995 ? Ta : Math.min(Ta, W.wetBulb(Ta, rh));
        return { Ta, rh, ps, pv, Tw, psw: sat(Tw), Td: Math.min(Ta, W.dewPoint(Ta, rh)) };
      };
      const rateOf = (s, wind) => Math.max(0, s.psw - s.pv) * Math.pow(1 + wind / 2, 0.8);
      const ref = rateOf({ psw: sat(W.wetBulb(30, 0.5)), pv: 0.5 * sat(30) }, 1);
      let parts = [], accE = 0, accC = 0;
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const s = state();
        const sx0 = Wd * 0.32, sx1 = Wd * 0.8, sy = Hh * 0.78, top = 18;
        // the air, the wind and the cloth
        c.save(); c.globalAlpha = 0.12; c.fillStyle = s.Ta > 20 ? C.warn : C.accent; c.fillRect(sx0 - 30, top - 8, sx1 - sx0 + 60, sy - top + 8); c.restore();
        for (let i = 0; i < 4; i++) {
          const wy = top + 14 + i * 26, off = ((t * 40 * (0.2 + V.wind)) + i * 90) % (sx1 - sx0 + 60);
          c.strokeStyle = C.faint; c.lineWidth = 1; c.globalAlpha = V.wind > 0 ? 0.5 : 0; c.beginPath(); c.moveTo(sx0 - 30 + off, wy); c.lineTo(sx0 - 30 + off + 22 + V.wind * 3, wy); c.stroke(); c.globalAlpha = 1;
        }
        c.fillStyle = 'rgba(70,150,235,0.55)'; c.fillRect(sx0, sy, sx1 - sx0, Hh - sy - 26);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(sx0, sy, sx1 - sx0, Hh - sy - 26);
        text(kit, c, 'wet cloth at ' + num(s.Tw, 1) + ' °C', (sx0 + sx1) / 2, sy + (Hh - sy - 26) / 2, { align: 'center', size: 12, weight: 650, color: C.text });
        text(kit, c, 'air at ' + num(s.Ta, 1) + ' °C, ' + Math.round(V.RH) + ' % humidity', (sx0 + sx1) / 2, Hh - 10, { align: 'center', size: 11.5, color: C.muted });
        // the traffic of molecules
        const rE = clamp(40 * s.psw / 3170, 0, 300), rC = clamp(40 * s.pv / 3170, 0, 300);
        accE += rE * dt; accC += rC * dt;
        while (accE >= 1 && parts.length < 700) { accE -= 1; parts.push({ x: sx0 + Math.random() * (sx1 - sx0), y: sy - 2, vx: (Math.random() - 0.5) * 30 + V.wind * 10, vy: -(35 + Math.random() * 60), e: true }); }
        while (accC >= 1 && parts.length < 700) { accC -= 1; parts.push({ x: sx0 + Math.random() * (sx1 - sx0), y: top, vx: (Math.random() - 0.5) * 30 + V.wind * 10, vy: 35 + Math.random() * 60, e: false }); }
        accE = Math.min(accE, 2); accC = Math.min(accC, 2);
        parts = parts.filter(p => { p.x += p.vx * dt; p.y += p.vy * dt; return p.e ? p.y > top - 6 : p.y < sy; });
        for (const p of parts) kit.dot(c, p.x, p.y, 2.2, p.e ? C.accent : C.warn);
        // thermometers
        S.thermometer(c, 26, 20, Hh - 52, s.Ta, { min: -15, max: 50, color: C.warn, label: 'air ' });
        S.thermometer(c, Wd - 60, 20, Hh - 52, s.Tw, { min: -15, max: 50, color: C.accent, label: 'cloth ' });
        kit.arrow(c, sx0 - 14, sy - 6, sx0 - 14, sy - 6 - clamp(rE / 4, 4, 70), C.accent, 2);
        kit.arrow(c, sx1 + 14, top + 6 + clamp(rC / 4, 4, 70), sx1 + 14, top + 6, C.warn, 2);
        // the graph
        const hl = [{ y: s.pv / 1e3, label: 'vapour in the air ' + num(s.pv / 1e3, 2) + ' kPa', color: C.muted }];
        plot.set({
          series: [{ pts, label: 'saturation vapour pressure', color: C.accent, width: 2.4 }],
          y: { label: 'vapour pressure (kPa)', log: V.log, min: V.log ? 0.05 : 0, max: V.log ? 200 : 20 },
          x: { label: 'temperature (°C)', min: -20, max: 60 }, hlines: hl,
          marks: [{ x: s.Ta, y: s.ps / 1e3, color: C.bad }, { x: s.Tw, y: s.psw / 1e3, color: C.ok }, { x: s.Td, y: s.pv / 1e3, color: C.warn }]
        });
        ro.set('ps', num(s.ps / 1e3, 2) + ' kPa');
        ro.set('pv', num(s.pv / 1e3, 2) + ' kPa  (' + num(s.pv / 101325 * 100, 1) + ' % of an atmosphere)');
        ro.set('Td', num(s.Td, 1) + ' °C');
        ro.set('Tw', num(s.Tw, 1) + ' °C, saturation ' + num(s.psw / 1e3, 2) + ' kPa');
        ro.set('cool', num(s.Ta - s.Tw, 1) + ' K');
        ro.set('rate', '× ' + num(rateOf(s, V.wind) / ref, 2));
        ro.set('cc', num(W.ccSlope(Math.max(s.Ta, 0.01)) / W.vapourPressure(Math.max(s.Ta, 0.01)) * 100, 1) + ' % per kelvin (doubles every ' + num(Math.log(2) / (W.ccSlope(Math.max(s.Ta, 0.01)) / W.vapourPressure(Math.max(s.Ta, 0.01))), 1) + ' K)');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 5. boiling at altitude */
  Hyper.sim('mb-altitude', {
    title: 'Boiling on a mountain and in a pressure cooker',
    blurb: `Water boils when its vapour pressure equals the pressure around it, so the boiling point follows the air. The scale on the left is altitude in the standard atmosphere; the pot on the right shows the temperature at which the water in it boils; the graph gives the boiling point at every altitude, for an open pot and (dashed) with the lid of a pressure cooker on.

**Try this**
- Choose *Denver*: the pressure falls to 83 kPa and the water boils at 95 °C. Choose *Everest summit* (the pressure measured in 1981, 33.7 kPa): 72 °C.
- Climb further, to the *Armstrong limit*, 18.9 km: water boils at body temperature, 37 °C.
- Put the lid on at sea level and set the gauge to 100 kPa: the absolute pressure is two atmospheres and the water boils at 120 °C.
- The cooking time uses the rule of thumb that every ten degrees of cooler water multiplies the time by *Q₁₀*. At Denver it is about 1.4 times longer; in the cooker about a quarter.
- Watch the boiling-point change per 300 m: close to one kelvin.`,
    mount(box, kit, params) {
      const W = kit.water, S = kit.wsym;
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270, maxH: 360 });
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px'; box.stage.appendChild(graph);
      let override = null;
      /* the International Standard Atmosphere: troposphere formula to 11 km, isothermal above */
      const pAlt = h => h <= 11000 ? 101325 * Math.pow(1 - 2.25577e-5 * h, 5.25588) : 22632.06 * Math.exp(-1.5768852e-4 * (h - 11000));
      const PRE = [['— choose a place —', -1, 0, null], ['Sea level', 0, 0, null], ['Denver (1,609 m)', 1, 1609, null], ['Mexico City (2,240 m)', 2, 2240, null], ['La Paz (3,640 m)', 3, 3640, null], ['Everest base camp (5,364 m)', 4, 5364, null], ['Everest summit (8,849 m; 33.7 kPa measured)', 5, 8849, 33700], ['The Armstrong limit (18.9 km)', 6, 18900, null]];
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'A place', options: PRE.map(p => [p[0], p[1]]), value: -1 },
        { id: 'h', label: 'Altitude', min: 0, max: 20000, step: 50, value: params.h != null ? params.h : 1609, unit: 'm' },
        { id: 'lid', type: 'check', label: 'Pressure-cooker lid', value: !!params.lid },
        { id: 'pg', label: 'Gauge pressure under the lid', min: 0, max: 300, step: 5, value: 100, unit: 'kPa' },
        { id: 'q10', label: 'Cooking speeds up per 10 K (Q₁₀)', min: 1.2, max: 4, step: 0.1, value: 2 }
      ], (id, v) => {
        if (id === 'pre' && v >= 0) { const p = PRE.find(x => x[1] === v); override = p[3]; ctl.set('h', p[2]); }
        else if (id === 'h') { override = null; ctl.set('pre', -1); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['p', 'Absolute pressure'], ['bp', 'Water boils at'], ['d', 'Change from sea level'], ['rule', 'Per 300 m of climb'], ['cook', 'Cooking time'], ['egg', 'A 10-minute egg takes'], ['note', '']]);
      const plot = kit.plot(graph, { x: { label: 'altitude (km)', min: 0, max: 20 }, y: { label: 'boiling point (°C)', min: 20, max: 130 }, legend: true }, 190);
      const open = [], lidded = [];
      for (let h = 0; h <= 20000; h += 250) { open.push([h / 1000, W.boilingPoint(pAlt(h))]); }
      let bubbles = [], accB = 0;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const pOut = override != null ? override : pAlt(V.h), p = pOut + (V.lid ? V.pg * 1e3 : 0), bp = W.boilingPoint(p), bp0 = W.boilingPoint(101325);
        // the altitude scale and the mountain
        const ax = 44, aTop = 18, aBot = Hh - 26, aY = h => aBot - h / 20000 * (aBot - aTop), mw = Wd * 0.2;
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(ax, aTop); c.lineTo(ax, aBot); c.stroke();
        for (let k = 0; k <= 20; k += 5) { c.beginPath(); c.moveTo(ax - 4, aY(k * 1000)); c.lineTo(ax + 4, aY(k * 1000)); c.stroke(); text(kit, c, k + ' km', ax - 8, aY(k * 1000), { align: 'right', size: 10.5, color: C.muted }); }
        c.fillStyle = 'rgba(130,140,160,0.55)'; c.beginPath(); c.moveTo(ax + 6, aBot); c.lineTo(ax + 6 + mw * 0.45, aY(8849)); c.lineTo(ax + 6 + mw * 0.6, aY(7600)); c.lineTo(ax + 6 + mw * 0.85, aY(8200)); c.lineTo(ax + 6 + mw * 1.7, aBot); c.closePath(); c.fill();
        c.fillStyle = 'rgba(240,248,255,0.85)'; c.beginPath(); c.moveTo(ax + 6 + mw * 0.45, aY(8849)); c.lineTo(ax + 6 + mw * 0.36, aY(7700)); c.lineTo(ax + 6 + mw * 0.55, aY(7900)); c.lineTo(ax + 6 + mw * 0.6, aY(7600)); c.closePath(); c.fill();
        text(kit, c, 'Everest', ax + 6 + mw * 0.45, aY(8849) - 8, { align: 'center', size: 10.5, color: C.muted });
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.bad; c.beginPath(); c.moveTo(ax - 4, aY(18900)); c.lineTo(ax + 6 + mw * 1.7, aY(18900)); c.stroke(); c.restore();
        text(kit, c, 'Armstrong limit 18.9 km', ax + 10, aY(18900) - 8, { size: 10.5, color: C.bad });
        const hy = aY(V.h);
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath(); c.moveTo(ax, hy); c.lineTo(ax + 6 + mw * 1.7, hy); c.stroke();
        kit.dot(c, ax, hy, 5.5, C.accent, C.bg2);
        text(kit, c, num(V.h, 0) + ' m · ' + num(pOut / 1e3, 1) + ' kPa', ax + 12, hy - 9, { size: 11, color: C.accent, weight: 650 });
        // the pot
        const px = ax + 14 + mw * 1.7 + 34, pw = Math.min(120, Wd * 0.17), ph = Hh * 0.52, py = Hh * 0.3;
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.fillStyle = 'rgba(70,150,235,0.45)';
        c.fillRect(px, py + ph * 0.25, pw, ph * 0.75 - 2);
        c.beginPath(); c.moveTo(px, py); c.lineTo(px, py + ph); c.lineTo(px + pw, py + ph); c.lineTo(px + pw, py); c.stroke();
        c.fillStyle = bp > 100.5 ? C.bad : C.warn; c.fillRect(px - 8, py + ph + 3, pw + 16, 5);
        if (V.lid) {
          c.fillStyle = C.muted; c.fillRect(px - 8, py - 10, pw + 16, 10);
          c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(px + pw / 2, py - 30, 18, Math.PI, TAU); c.stroke();
          const ang = Math.PI + clamp(V.pg / 300, 0, 1) * Math.PI; c.beginPath(); c.moveTo(px + pw / 2, py - 30); c.lineTo(px + pw / 2 + 15 * Math.cos(ang), py - 30 + 15 * Math.sin(ang)); c.stroke();
          text(kit, c, 'gauge ' + num(V.pg, 0) + ' kPa', px + pw / 2, py - 56, { align: 'center', size: 10.5, color: C.muted });
        }
        accB += dt * 22; while (accB >= 1 && bubbles.length < 60) { accB -= 1; bubbles.push({ x: px + 8 + Math.random() * (pw - 16), y: py + ph - 4, r: 2 + Math.random() * 3 }); }
        accB = Math.min(accB, 2);
        bubbles = bubbles.filter(b => { b.y -= dt * (50 + b.r * 12); b.x += (Math.random() - 0.5) * 20 * dt; return b.y > py + ph * 0.25; });
        for (const b of bubbles) { c.strokeStyle = 'rgba(255,255,255,0.8)'; c.lineWidth = 1; c.beginPath(); c.arc(b.x, b.y, b.r, 0, TAU); c.stroke(); }
        S.thermometer(c, px + pw + 30, py - 20, ph + 20, bp, { min: 20, max: 130, label: 'boils at ' });
        // the graph
        lidded.length = 0; for (let h = 0; h <= 20000; h += 250) lidded.push([h / 1000, W.boilingPoint(pAlt(h) + V.pg * 1e3)]);
        plot.set({ series: [{ pts: open, label: 'open pot', color: C.accent }, { pts: V.lid ? lidded : [], label: V.lid ? 'with the lid on' : '', color: C.bad, dash: true }], marks: [{ x: V.h / 1000, y: bp, label: num(bp, 1) + ' °C', color: C.bad }], hlines: [{ y: 100, label: '100 °C' }, { y: 37, label: 'body temperature' }] });
        const k300 = V.h > 300 ? (bp0 - W.boilingPoint(pOut)) / (V.h / 300) : NaN;
        const factor = Math.pow(V.q10, (bp0 - bp) / 10);
        ro.set('p', num(p / 1e3, 1) + ' kPa = ' + num(p / 101325, 2) + ' atm');
        ro.set('bp', num(bp, 1) + ' °C');
        ro.set('d', (bp - bp0 >= 0 ? '+' : '') + num(bp - bp0, 1) + ' K');
        ro.set('rule', Number.isFinite(k300) ? num(k300, 2) + ' K' : '—');
        ro.set('cook', '× ' + num(factor, 2) + (factor > 1.02 ? ' (longer)' : factor < 0.98 ? ' (shorter)' : ''));
        ro.set('egg', num(10 * factor, 1) + ' minutes');
        ro.set('note', bp < 38 ? 'Body fluids would boil at body temperature here.' : V.lid ? 'Absolute pressure = air + gauge. Real cookers cut times by half or two-thirds.' : override != null ? 'The measured summit pressure is above the standard atmosphere\'s 31.4 kPa.' : '');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 6. the phase diagram */
  Hyper.sim('mb-phase-diagram', {
    title: 'The phase diagram of water',
    blurb: `The pressure–temperature map of water, drawn from the IAPWS curves. Drag the red dot — or use the sliders and the places — and read what water does there. Pressure is logarithmic: the map spans eleven powers of ten from 1 pascal to 100 gigapascals.

**Try this**
- Start in the *kitchen* (25 °C, 1 atm): liquid. Press *To the boiling point*: the dot jumps to 100 °C on the vaporisation curve. Raise the pressure and press again: 120 °C at 2 atmospheres.
- Choose the *Everyday* view and look at the melting curve of ice: it leans to the left. Press *To the melting point* at 1 atm and at 100 MPa and compare.
- Lower the pressure below 611.657 Pa (the triple-point pressure): the liquid region has ended and ice sublimes straight into vapour.
- Go past 22 MPa and 374 °C: no boiling, no boundary, a supercritical fluid.
- Squeeze to 1 GPa at room temperature: ice VI, solid at 25 °C.
- The last read-out counts the freedoms of the phase rule: two in a region, one on a line, none at the triple point.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340, maxH: 600 });
      const VIEWS = { all: { T0: 100, T1: 800, a: 0, b: 11, Ts: 100 }, home: { T0: 240, T1: 420, a: 1, b: 8.6, Ts: 20 } };
      const PLACES = [['— a place —', ''], ['The kitchen (25 °C, 1 atm)', '298.15,101325'], ['A freezer (−18 °C)', '255.15,101325'], ['A pressure cooker (2 atm)', '393.35,202650'], ['Everest summit (33.7 kPa)', '294,33700'], ['The surface of Mars (610 Pa)', '230,610'], ['10 km deep in the sea (100 MPa)', '277.15,1e8'], ['A black smoker (400 °C, 30 MPa)', '673.15,3e7'], ['Water at 25 °C squeezed to 1 GPa', '298.15,1e9']];
      const ctl = kit.controls(box.side, [
        { id: 'view', type: 'select', label: 'View', options: [['The whole map', 'all'], ['Everyday pressures', 'home']], value: params.view || 'all' },
        { id: 'T', label: 'Temperature', min: 100, max: 800, step: 0.5, value: params.T != null ? +params.T : 298.15, unit: 'K' },
        { id: 'lp', label: 'Pressure, log₁₀ of pascals', min: 0, max: 11, step: 0.01, value: params.p != null ? Math.log10(+params.p) : Math.log10(101325), sig: 3 },
        { id: 'place', type: 'select', label: 'A place', options: PLACES, value: '' },
        { id: 'solid', type: 'check', label: 'Show the solid–solid boundaries', value: true },
        { id: 'names', type: 'check', label: 'Name the phases', value: true },
        { type: 'buttons', items: [{ id: 'gob', label: 'To the boiling point', primary: true }, { id: 'gom', label: 'To the melting point' }, { id: 'got', label: 'To the triple point' }] }
      ], (id, v) => {
        if (id === 'place' && v) { const [t, p] = v.split(',').map(Number); ctl.set('T', clamp(t, 100, 800)); ctl.set('lp', clamp(Math.log10(p), 0, 11)); }
        else if (id === 'gob') { const p = Math.pow(10, V.lp); if (p >= W.TRIPLE.p && p <= W.CRITICAL.p) ctl.set('T', W.boilingPoint(p) + 273.15); }
        else if (id === 'gom') { const m = W.meltingPoint(Math.pow(10, V.lp)); if (Number.isFinite(m.T)) ctl.set('T', clamp(m.T, 100, 800)); }
        else if (id === 'got') { ctl.set('T', W.TRIPLE.T); ctl.set('lp', Math.log10(W.TRIPLE.p)); }
        else if (id === 'view') raster = null;
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['ph', 'Water here is'], ['T', 'Temperature'], ['p', 'Pressure'], ['mel', 'Melts at this pressure'], ['boil', 'Boils at this pressure'], ['slope', 'Melting point shifts by'], ['dof', 'Freedoms (phase rule)']]);
      const HUE = { 'ice Ih': 195, 'ice II': 160, 'ice III': 140, 'ice V': 100, 'ice VI': 60, 'ice VII': 30, 'ice VIII': 20, 'ice X': 0, 'ice XI': 205, 'ice IX': 150, 'ice XIII': 110, 'ice XV': 70, 'ice XIX': 50 };
      const hsl = (h, s, l) => { const a = s * Math.min(l, 1 - l), f = n => { const k = (n + h / 30) % 12; return l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); }; return [Math.round(255 * f(0)), Math.round(255 * f(8)), Math.round(255 * f(4))]; };
      let raster = null, rkey = '';
      const geom = () => ({ x0: 56, y0: 14, x1: st.W - 14, y1: st.H - 42 });
      const vw = () => VIEWS[V.view] || VIEWS.all;
      const toX = (g, Tk) => g.x0 + (Tk - vw().T0) / (vw().T1 - vw().T0) * (g.x1 - g.x0);
      const toY = (g, lp) => g.y1 - (lp - vw().a) / (vw().b - vw().a) * (g.y1 - g.y0);
      const fromXY = (g, x, y) => ({ T: vw().T0 + (x - g.x0) / (g.x1 - g.x0) * (vw().T1 - vw().T0), lp: vw().a + (g.y1 - y) / (g.y1 - g.y0) * (vw().b - vw().a) });
      function build(dark) {
        const nx = 160, ny = 120, v = vw(), cv = document.createElement('canvas'); cv.width = nx; cv.height = ny;
        const cx = cv.getContext('2d');
        if (!cx || !cx.createImageData) return null;
        const img = cx.createImageData(nx, ny);
        for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
          const Tk = v.T0 + (i + 0.5) / nx * (v.T1 - v.T0), lp = v.b - (j + 0.5) / ny * (v.b - v.a);
          const ph = W.phaseAt(Tk, Math.pow(10, lp));
          const hue = ph === 'vapour' ? 0 : ph === 'liquid' ? 212 : ph === 'supercritical' ? 280 : (HUE[ph] != null ? HUE[ph] : 100);
          const sat = ph === 'vapour' ? 0.02 : ph === 'liquid' ? 0.55 : ph === 'supercritical' ? 0.4 : 0.45;
          const [r, gg, b] = hsl(hue, sat, dark ? 0.27 : 0.86);
          const k = (j * nx + i) * 4; img.data[k] = r; img.data[k + 1] = gg; img.data[k + 2] = b; img.data[k + 3] = 255;
        }
        cx.putImageData(img, 0, 0);
        return cv;
      }
      const curve = (c, pts, col, w, dash) => { c.save(); c.strokeStyle = col; c.lineWidth = w || 2; if (dash) c.setLineDash(dash); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore(); };
      kit.drag(st, {
        hover: true, hit: () => 'pt',
        move: (w, p) => { const s = fromXY(geom(), p.x, p.y); ctl.set('T', clamp(Math.round(s.T * 2) / 2, 100, 800)); ctl.set('lp', clamp(Math.round(s.lp * 100) / 100, 0, 11)); }
      });
      st.onResize(() => { raster = null; });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), g = geom(), v = vw();
        const key = V.view + st.W + 'x' + st.H + (C.dark ? 'd' : 'l');
        if (!raster || key !== rkey) { raster = build(!!C.dark); rkey = key; }
        if (raster) { c.imageSmoothingEnabled = false; c.drawImage(raster, g.x0, g.y0, g.x1 - g.x0, g.y1 - g.y0); c.imageSmoothingEnabled = true; }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(g.x0, g.y0, g.x1 - g.x0, g.y1 - g.y0);
        // axes
        for (let lp = Math.ceil(v.a); lp <= v.b; lp++) {
          const y = toY(g, lp); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(g.x0, y); c.lineTo(g.x1, y); c.stroke();
          const lab = lp === 0 ? '1 Pa' : lp === 3 ? '1 kPa' : lp === 6 ? '1 MPa' : lp === 9 ? '1 GPa' : '10' + String(lp).replace(/\d/g, d =>'⁰¹²³⁴⁵⁶⁷⁸⁹'[d]);
          text(kit, c, lab, g.x0 - 6, y, { align: 'right', size: 10.5, color: C.muted });
        }
        for (let Tt = Math.ceil(v.T0 / v.Ts) * v.Ts; Tt <= v.T1; Tt += v.Ts) {
          const x = toX(g, Tt); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, g.y0); c.lineTo(x, g.y1); c.stroke();
          text(kit, c, Tt + ' K', x, g.y1 + 6, { align: 'center', baseline: 'top', size: 10.5, color: C.muted });
          text(kit, c, num(Tt - 273.15, 0) + ' °C', x, g.y1 + 20, { align: 'center', baseline: 'top', size: 10, color: C.faint });
        }
        // the curves
        const inV = (Tk, lp) => Tk >= v.T0 - 1 && Tk <= v.T1 + 1 && lp >= v.a - 0.2 && lp <= v.b + 0.2;
        const sub = [], vap = [];
        for (let t = v.T0; t <= W.TRIPLE.T; t += (W.TRIPLE.T - v.T0) / 80) { const lp = Math.log10(W.sublimationPressure(t - 273.15)); if (lp >= v.a - 0.5) sub.push([toX(g, t), toY(g, lp)]); }
        for (let t = W.TRIPLE.T; t <= Math.min(W.CRITICAL.T, v.T1); t += 2) vap.push([toX(g, t), toY(g, Math.log10(W.vapourPressure(t - 273.15)))]);
        curve(c, sub, C.text, 2); curve(c, vap, C.text, 2);
        for (const id of ['Ih', 'III', 'V', 'VI', 'VII']) {
          const m = W.MELT[id], pts = [], hi = id === 'VII' ? v.T1 : m.Thi;
          for (let t = m.Tlo; t <= hi; t += (hi - m.Tlo) / 60) pts.push([toX(g, t), toY(g, Math.log10(m.f(t)))]);
          curve(c, pts, C.text, 2);
        }
        if (V.solid) for (const b of W.ICE_BOUNDARIES) curve(c, b.pts.map(([t, mpa]) => [toX(g, t), toY(g, Math.log10(Math.max(1, mpa * 1e6)))]), C.text, 1, [4, 3]);
        const px = toX(g, W.CRITICAL.T), py = toY(g, Math.log10(W.CRITICAL.p));
        if (W.CRITICAL.T <= v.T1) { curve(c, [[px, py], [px, g.y0]], C.muted, 1, [2, 4]); curve(c, [[px, py], [g.x1, py]], C.muted, 1, [2, 4]); kit.dot(c, px, py, 4, C.text); text(kit, c, 'critical point', px + 6, py - 8, { size: 10.5, color: C.text }); }
        const tx = toX(g, W.TRIPLE.T), ty = toY(g, Math.log10(W.TRIPLE.p));
        kit.dot(c, tx, ty, 4, C.text); text(kit, c, 'triple point', tx + 7, ty + 12, { size: 10.5, color: C.text });
        // one atmosphere, 0 and 100 °C
        c.save(); c.setLineDash([6, 4]); c.strokeStyle = C.warn; c.lineWidth = 1;
        c.beginPath(); c.moveTo(g.x0, toY(g, Math.log10(101325))); c.lineTo(g.x1, toY(g, Math.log10(101325))); c.stroke(); c.restore();
        text(kit, c, '1 atm', g.x1 - 4, toY(g, Math.log10(101325)) - 7, { align: 'right', size: 10.5, color: C.warn });
        if (V.names) {
          const L = v === VIEWS.all ? [['vapour', 450, 2.2], ['liquid', 400, 7.2], ['supercritical fluid', 730, 8.4], ['ice Ih', 190, 5.5], ['II', 185, 8.45], ['III', 247, 8.35], ['V', 263, 8.7], ['VI', 300, 9.1], ['VII', 420, 9.9], ['X', 400, 10.75]] : [['vapour', 330, 2.2], ['liquid', 340, 6.2], ['ice Ih', 255, 5.8], ['III', 250, 8.4], ['V', 263, 8.5]];
          for (const [s, t, lp] of L) if (inV(t, lp)) text(kit, c, s, toX(g, t), toY(g, lp), { align: 'center', size: s.length > 4 ? 12 : 11, weight: 650, color: C.text });
        }
        // the state point
        const Tk = V.T, p = Math.pow(10, V.lp), x = toX(g, Tk), y = toY(g, V.lp), ph = W.phaseAt(Tk, p);
        c.save(); c.strokeStyle = C.bad; c.lineWidth = 1; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(g.x0, y); c.lineTo(x, y); c.lineTo(x, g.y1); c.stroke(); c.restore();
        kit.dot(c, x, y, 7, C.bad, '#fff');
        const m = W.meltingPoint(p), Tb = p >= W.TRIPLE.p && p <= W.CRITICAL.p ? W.boilingPoint(p) + 273.15 : NaN;
        const dTdp = Number.isFinite(m.T) ? (W.meltingPoint(p * 1.02).T - W.meltingPoint(p / 1.02).T) / (p * 1.02 - p / 1.02) : NaN;
        // freedoms: a point on a curve has one, the triple point none
        const tol = (v.T1 - v.T0) / 90, lpTol = (v.b - v.a) / 90;
        const onVap = Number.isFinite(Tb) && Math.abs(Tk - Tb) < tol, onMelt = Number.isFinite(m.T) && Math.abs(Tk - m.T) < tol;
        const onSub = Tk < W.TRIPLE.T && Math.abs(V.lp - Math.log10(W.sublimationPressure(Tk - 273.15))) < lpTol;
        const onTrip = Math.abs(Tk - W.TRIPLE.T) < tol && Math.abs(V.lp - Math.log10(W.TRIPLE.p)) < lpTol;
        const dof = onTrip ? 0 : (onVap || onMelt || onSub) ? 1 : 2;
        ro.set('ph', ph);
        ro.set('T', num(Tk, 1) + ' K = ' + num(Tk - 273.15, 1) + ' °C');
        ro.set('p', fP(p) + ' = ' + num(p / 101325, p > 1e5 ? 1 : 4) + ' atm');
        ro.set('mel', p < W.TRIPLE.p ? 'no liquid below 611.657 Pa' : num(m.T - 273.15, 2) + ' °C (ice ' + m.ice + ')');
        ro.set('boil', p > W.CRITICAL.p ? 'never: above the critical pressure' : num(W.boilingPoint(p), 1) + ' °C' + (p < W.TRIPLE.p ? ' (sublimes)' : ''));
        ro.set('slope', Number.isFinite(dTdp) ? num(dTdp * 101325, 4) + ' K per atmosphere' + (dTdp < 0 ? ' (down)' : ' (up)') : '—');
        ro.set('dof', dof + (dof === 0 ? ': the triple point' : dof === 1 ? ': on a coexistence curve' : ': inside a region'));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 7. through the critical point */
  Hyper.sim('mb-supercritical', {
    title: 'A sealed tube through the critical point',
    blurb: `Water sealed in a strong tube and heated. Below 374 °C there are two phases and a meniscus between them: the liquid expands and thins, the vapour compresses and thickens, and the surface tension that holds the meniscus falls towards zero. At 373.946 °C the two densities meet at 322 kg/m³ and the surface vanishes. The dots are molecules, drawn in proportion to the density; the graph shows the two densities closing in. (The saturated densities are steam-table values; within 75 K of the critical point they are a critical-scaling fit — schematic, good to a few per cent.)

**Try this**
- Keep the filling at 322 kg/m³ (*Critical filling*) and raise the temperature: the meniscus stays near the middle, grows faint, turns milky (critical opalescence) and is gone at 373.9 °C.
- Choose a *light filling* (150): the liquid evaporates entirely before the critical point, and the meniscus drops to the bottom. A *heavy filling* (500): the liquid rises and fills the tube.
- Watch the surface tension and the latent heat read-outs fall to zero at the critical temperature.
- Above 374 °C, change the filling: the fluid goes smoothly from gas-like to liquid-like with no boiling.`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 300, maxH: 460 });
      const graph = document.createElement('div'); graph.style.padding = '6px 10px 10px'; box.stage.appendChild(graph);
      const ctl = kit.controls(box.side, [
        { id: 'T', label: 'Temperature', min: 20, max: 450, step: 0.5, value: params.T != null ? +params.T : 200, unit: '°C' },
        { id: 'rf', label: 'Filling density (mass of water per tube volume)', min: 100, max: 600, step: 1, value: params.rf != null ? +params.rf : 322, unit: 'kg/m³' },
        { id: 'mol', type: 'check', label: 'Show the molecules', value: true },
        { type: 'buttons', items: [{ id: 'crit', label: 'Critical filling', primary: true }, { id: 'light', label: 'Light filling' }, { id: 'heavy', label: 'Heavy filling' }, { id: 'near', label: 'Just below Tc' }] }
      ], (id) => { if (id === 'crit') ctl.set('rf', 322); else if (id === 'light') ctl.set('rf', 150); else if (id === 'heavy') ctl.set('rf', 500); else if (id === 'near') ctl.set('T', 372); });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['state', 'In the tube'], ['rl', 'Liquid density'], ['rv', 'Vapour density'], ['ratio', 'Liquid ÷ vapour'], ['sig', 'Surface tension'], ['L', 'Latent heat of vaporisation'], ['p', 'Pressure (saturated, below Tc)']]);
      const Tc = W.CRITICAL.T - 273.15, rc = W.CRITICAL.rho;
      /* saturated liquid and vapour densities, kg/m³: steam-table values (IAPWS-IF97, rounded) to 300 °C; above that a critical-scaling fit
         rho = rho_c + s (Tc - T) ± A tau^0.326, tau = 1 - T/Tc, with A and s fitted to the 300 °C and 350 °C values. Schematic. */
      const TAB = [[0.01, 999.8, 0.0049], [20, 998.2, 0.0173], [50, 988.0, 0.083], [100, 958.4, 0.598], [150, 917.0, 2.55], [200, 864.7, 7.86], [250, 799.2, 19.97], [300, 712.1, 46.2]];
      const TL = TAB.map(r => [r[0], r[1]]), TV = TAB.map(r => [r[0], r[2]]);
      const satDens = T => {
        if (T >= Tc) return [rc, rc];
        if (T <= 300) return [W.interp(TL, T), W.interp(TV, T)];
        const Tk = T + 273.15, tau = 1 - Tk / W.CRITICAL.T, dia = rc + 0.7728 * (W.CRITICAL.T - Tk), half = 675.5 * Math.pow(tau, 0.326);
        return [dia + half, dia - half];
      };
      const curveL = [], curveV = [];
      for (let T = 20; T < Tc; T += 3) { const d = satDens(T); curveL.push([T, d[0]]); curveV.push([T, d[1]]); }
      curveL.push([Tc, rc]); curveV.push([Tc, rc]);
      const plot = kit.plot(graph, { x: { label: 'temperature (°C)', min: 0, max: 450 }, y: { label: 'density (kg/m³)', min: 0, max: 1050 }, legend: true }, 190);
      // fixed particles: a visibility threshold and a place, shared by the two phases
      let seed = 12345; const rnd = () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
      const PL = [], PG = [], PS = [];
      for (let i = 0; i < 300; i++) { PL.push({ u: rnd(), v: rnd(), r: rnd() }); PG.push({ u: rnd(), v: rnd(), r: rnd() }); PS.push({ u: rnd(), v: rnd(), r: rnd() }); }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const T = V.T, rf = V.rf, d = satDens(T), above = T >= Tc;
        let kind = 'super', x = 0;
        if (!above) { x = (rf - d[1]) / (d[0] - d[1]); kind = x <= 0 ? 'vapour' : x >= 1 ? 'liquid' : 'two'; x = clamp(x, 0, 1); }
        // the tube
        const tw = Math.min(110, Wd * 0.2), th = Hh - 50, tx = Wd * 0.14, ty = 22;
        const rad = tw / 2, bot = ty + th;
        c.save();
        c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx, bot - rad); c.arc(tx + rad, bot - rad, rad, Math.PI, 0, true); c.lineTo(tx + tw, ty); c.closePath(); c.clip();
        const yMen = bot - x * th;
        if (kind === 'two' || kind === 'liquid') { c.fillStyle = 'rgba(70,150,235,0.35)'; c.fillRect(tx, kind === 'liquid' ? ty : yMen, tw, bot - (kind === 'liquid' ? ty : yMen)); }
        if (kind === 'super') { c.fillStyle = 'rgba(160,120,230,' + (0.08 + 0.25 * rf / 600) + ')'; c.fillRect(tx, ty, tw, th); }
        if (kind === 'vapour') { c.fillStyle = 'rgba(160,160,170,0.12)'; c.fillRect(tx, ty, tw, th); }
        if (V.mol) {
          const dotAt = (P, y0, y1, dens, col) => { const f = clamp(dens / 1000, 0, 1); for (const p of P) { if (p.r > f) continue; const X = tx + 6 + p.u * (tw - 12) + Math.sin(t * 3 + p.v * 40) * 1.6, Y = y0 + p.v * (y1 - y0) + Math.cos(t * 2.6 + p.u * 40) * 1.6; kit.dot(c, X, Y, 2.1, col); } };
          if (kind === 'two') { dotAt(PL, yMen + 4, bot - 4, d[0], C.accent); dotAt(PG, ty + 4, yMen - 4, d[1] * 1.0, C.muted); }
          else if (kind === 'liquid') dotAt(PL, ty + 4, bot - 4, rf, C.accent);
          else if (kind === 'vapour') dotAt(PG, ty + 4, bot - 4, rf, C.muted);
          else dotAt(PS, ty + 4, bot - 4, rf, C.series[5] || C.accent);
        }
        // critical opalescence
        const haze = Math.exp(-Math.pow((T - Tc) / 5, 2)) * Math.exp(-Math.pow((rf - rc) / 90, 2));
        if (haze > 0.02) { c.fillStyle = 'rgba(190,150,100,' + (0.62 * haze) + ')'; c.fillRect(tx, ty, tw, th); }
        // the meniscus: its thickness follows the surface tension
        const sig = above ? 0 : W.surfaceTension(T);
        if (kind === 'two') { c.strokeStyle = C.text; c.lineWidth = 0.4 + 3.6 * sig / 0.0728; c.beginPath(); c.moveTo(tx, yMen); c.quadraticCurveTo(tx + tw / 2, yMen + 3 * sig / 0.0728, tx + tw, yMen); c.stroke(); }
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.beginPath(); c.moveTo(tx, ty); c.lineTo(tx, bot - rad); c.arc(tx + rad, bot - rad, rad, Math.PI, 0, true); c.lineTo(tx + tw, ty); c.stroke();
        text(kit, c, kind === 'two' ? 'two phases, a meniscus' : kind === 'liquid' ? 'all liquid (the meniscus reached the top)' : kind === 'vapour' ? 'all vapour (the meniscus reached the bottom)' : 'one supercritical fluid', tx + tw + 16, ty + 10, { size: 12.5, weight: 650, color: C.text });
        if (kind === 'two') { text(kit, c, 'vapour', tx + tw + 16, (ty + yMen) / 2, { size: 11.5, color: C.muted }); text(kit, c, 'liquid', tx + tw + 16, (yMen + bot) / 2, { size: 11.5, color: C.accent }); }
        if (haze > 0.1) text(kit, c, 'critical opalescence: density fluctuations scatter light', tx + tw + 16, ty + 30, { size: 11.5, color: C.warn });
        // thermometer-like bar for T against Tc
        const bx = Wd - 70, bh = th;
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx, ty, 16, bh);
        const fy = ty + bh - clamp((T - 20) / 430, 0, 1) * bh; c.fillStyle = above ? C.bad : C.warn; c.fillRect(bx + 1, fy, 14, ty + bh - fy);
        const cy = ty + bh - (Tc - 20) / 430 * bh; c.strokeStyle = C.bad; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(bx - 8, cy); c.lineTo(bx + 24, cy); c.stroke(); c.setLineDash([]);
        text(kit, c, 'Tc', bx - 12, cy, { align: 'right', size: 11, color: C.bad });
        text(kit, c, num(T, 1) + ' °C', bx + 8, ty - 10, { align: 'center', size: 11.5, weight: 650, color: C.text });
        // the graph
        plot.set({ series: [{ pts: curveL, label: 'saturated liquid', color: C.accent }, { pts: curveV, label: 'saturated vapour', color: C.muted }], hlines: [{ y: rf, label: 'filling ' + num(rf, 0), color: C.warn }], vlines: [{ x: Tc, label: 'critical point', color: C.bad }], marks: above ? [{ x: T, y: rf, label: 'one fluid', color: C.bad }] : [{ x: T, y: d[0], color: C.accent }, { x: T, y: d[1], color: C.muted }] });
        // readouts
        ro.set('state', kind === 'two' ? 'liquid ' + num(x * 100, 0) + ' % of the volume' : kind === 'super' ? 'supercritical fluid, ' + num(rf, 0) + ' kg/m³' : kind === 'liquid' ? 'liquid only' : 'vapour only');
        ro.set('rl', above ? '— (no liquid)' : num(d[0], 1) + ' kg/m³');
        ro.set('rv', above ? '— (no vapour)' : num(d[1], 2) + ' kg/m³');
        ro.set('ratio', above ? '1 (identical)' : num(d[0] / d[1], 1));
        ro.set('sig', num(sig * 1000, 2) + ' mN/m');
        ro.set('L', above ? '0 (no boiling)' : num(W.latentVaporisation(T) / 1e3, 0) + ' kJ/kg');
        ro.set('p', above ? '> 22.06 MPa' : fP(W.vapourPressure(T)));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ 8. the triple-point cell */
  Hyper.sim('mb-triple-point', {
    title: 'A triple-point cell, and why the ice point is 0.01 K lower',
    blurb: `A sealed glass cell with a thermometer well, an ice mantle around it and a thin layer of liquid, vapour above: the three phases of pure water in equilibrium. By the phase rule nothing is free, and the cell sits at 273.16 K. The bars show how far three small effects move the melting temperature of ice from that point, in millikelvin: the pressure on the ice, air dissolved in the water, and the isotopic make-up of the water. The scale adjusts itself; the grey band is the 0.1 mK of the best measurements.

**Try this**
- Choose *The ice point*: 1 atmosphere and air-saturated water. The pressure term is −7.5 mK, the air −2.3 mK, and the total puts the melting point at 273.150 K: the 0 °C of the Celsius scale.
- Start from the *triple point* and add air: the temperature drops by 2.3 mK even in a sealed cell.
- Raise the pressure over the ice: each atmosphere lowers the melting point by 7.5 mK.
- Move the deuterium slider to −430 ‰ (*Antarctic snow*): the triple point moves down by 0.26 mK, more than the whole uncertainty. This is why the definition specified ocean water (VSMOW).`,
    mount(box, kit, params) {
      const W = kit.water;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 340, maxH: 520 });
      const lp0 = Math.log10(W.TRIPLE.p);
      const PRE = [['— a setting —', ''], ['The triple point (sealed cell, ocean water)', 'tp'], ['The ice point (1 atm, air-saturated)', 'ice'], ['A sealed cell of Antarctic snow', 'snow'], ['Ice under 100 atmospheres', 'deep']];
      const ctl = kit.controls(box.side, [
        { id: 'pre', type: 'select', label: 'Setting', options: PRE, value: '' },
        { id: 'lp', label: 'Pressure on the ice', min: lp0, max: 7.5, step: 0.005, value: params.lp != null ? +params.lp : lp0, fmt: v => fP(Math.pow(10, v)) },
        { id: 'air', type: 'check', label: 'Air dissolved in the water (saturated at this pressure)', value: !!params.air },
        { id: 'dD', label: 'Deuterium content compared with the oceans', min: -450, max: 100, step: 1, value: params.dD != null ? +params.dD : 0, fmt: v => (v > 0 ? '+' : '') + Math.round(v) + ' ‰' }
      ], (id, v) => {
        if (id !== 'pre' || !v) return;
        if (v === 'tp') { ctl.set('lp', lp0); ctl.set('air', false); ctl.set('dD', 0); }
        else if (v === 'ice') { ctl.set('lp', Math.log10(101325)); ctl.set('air', true); ctl.set('dD', 0); }
        else if (v === 'snow') { ctl.set('lp', lp0); ctl.set('air', false); ctl.set('dD', -430); }
        else if (v === 'deep') { ctl.set('lp', Math.log10(101 * 101325)); ctl.set('air', false); ctl.set('dD', 0); }
      });
      const V = ctl.values;
      const ro = kit.readout(box.side, [['T', 'Melting temperature'], ['C', 'In degrees Celsius'], ['dp', 'Pressure term'], ['da', 'Dissolved-air term'], ['dd', 'Isotope term'], ['ice', 'Above (+) or below (−) the ice point 273.15 K'], ['m', 'Dissolved gas']]);
      // dissolved gas of air at 0 °C and total pressure p: partial pressure of the air is p less the water's own vapour pressure
      const airMolal = p => Math.max(0, p - W.TRIPLE.p) / 101325 * (0.78084 * W.henry('N2', 0) + 0.20946 * W.henry('O2', 0) + 0.00934 * W.henry('Ar', 0));
      const calc = () => {
        const p = Math.max(W.TRIPLE.p, Math.pow(10, V.lp));
        const dP = W.meltingPoint(p).T - W.TRIPLE.T, m = V.air ? airMolal(p) : 0, dA = -W.Kf * m, dD = (W.D2O.mp) * W.VSMOW * (V.dD / 1000);
        return { p, dP: Math.abs(dP) < 1e-7 ? 0 : dP, m, dA, dD, T: W.TRIPLE.T + (Math.abs(dP) < 1e-7 ? 0 : dP) + dA + dD };
      };
      let scale = 12;
      const loop = kit.loop((dt) => {
        const c = st.begin(), C = kit.colors(), Wd = st.W, Hh = st.H;
        const s = calc();
        // the cell
        const cw = Math.min(150, Wd * 0.24), chh = Hh * 0.56, cx0 = Wd * 0.08, cy0 = 26;
        c.strokeStyle = C.text; c.lineWidth = 2.5; c.beginPath(); c.moveTo(cx0, cy0); c.lineTo(cx0, cy0 + chh); c.lineTo(cx0 + cw, cy0 + chh); c.lineTo(cx0 + cw, cy0); c.stroke();
        const level = cy0 + chh * 0.22;
        c.fillStyle = 'rgba(70,150,235,0.35)'; c.fillRect(cx0 + 1.5, level, cw - 3, cy0 + chh - level - 1.5);
        const wx0 = cx0 + cw * 0.38, wx1 = cx0 + cw * 0.62, wBot = cy0 + chh * 0.82;
        c.fillStyle = 'rgba(225,245,255,0.92)'; c.fillRect(wx0 - cw * 0.14, cy0 + chh * 0.32, (wx1 - wx0) + cw * 0.28, wBot - (cy0 + chh * 0.32) + 6);     // the ice mantle
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(wx0 - cw * 0.14, cy0 + chh * 0.32, (wx1 - wx0) + cw * 0.28, wBot - (cy0 + chh * 0.32) + 6);
        c.fillStyle = 'rgba(70,150,235,0.55)'; c.fillRect(wx0 - 4, cy0 + chh * 0.32, (wx1 - wx0) + 8, wBot - (cy0 + chh * 0.32) + 2);                                  // the thin layer of melt
        c.fillStyle = C.bg2; c.fillRect(wx0, cy0 - 12, wx1 - wx0, wBot - cy0 + 12);                                                                                     // the well
        c.strokeStyle = C.text; c.lineWidth = 1.6; c.strokeRect(wx0, cy0 - 12, wx1 - wx0, wBot - cy0 + 12);
        c.fillStyle = C.bad; c.fillRect((wx0 + wx1) / 2 - 2, cy0 - 6, 4, wBot - cy0 - 4);                                                                                // the thermometer
        text(kit, c, 'vapour', cx0 + 6, cy0 + 12, { size: 11, color: C.muted });
        text(kit, c, 'water', cx0 + 6, level + 14, { size: 11, color: C.accent });
        text(kit, c, 'ice', cx0 + cw / 2, cy0 + chh * 0.55, { align: 'center', size: 11, color: C.axis });
        text(kit, c, 'thermometer well', cx0 + cw / 2, cy0 - 20, { align: 'center', size: 11, color: C.muted });
        text(kit, c, num(s.T, 4) + ' K', cx0 + cw / 2, cy0 + chh + 20, { align: 'center', size: 15, weight: 700, color: C.text });
        // the bars, in millikelvin from 273.16 K
        const bx0 = cx0 + cw + 150, bx1 = Wd - 20, bw = bx1 - bx0, by = 40, rowH = 38;
        const rows = [['pressure on the ice', s.dP * 1e3, C.accent], ['dissolved air', s.dA * 1e3, C.warn], ['isotopes (deuterium)', s.dD * 1e3, C.series[5] || C.ok], ['total', (s.T - W.TRIPLE.T) * 1e3, C.bad]];
        const want = Math.max(1.4, ...rows.map(r => Math.abs(r[1])) ) * 1.25, wantP = 1.2 * want;
        scale += (wantP - scale) * Math.min(1, dt * 5);
        const half = scale, X = v => bx0 + bw / 2 + v / half * (bw / 2 - 4);
        // the grey band: 0.1 mK
        c.fillStyle = C.grid; c.fillRect(X(-0.1), by - 14, X(0.1) - X(-0.1) + 1, rowH * 4 + 8);
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(0), by - 18); c.lineTo(X(0), by + rowH * 4); c.stroke();
        text(kit, c, '273.16 K (triple point)', X(0), by - 26, { align: 'center', size: 11, color: C.text });
        // the ice point at -10 mK
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.ok; c.beginPath(); c.moveTo(X(-10), by - 14); c.lineTo(X(-10), by + rowH * 4); c.stroke(); c.restore();
        if (X(-10) > bx0 - 6) text(kit, c, 'ice point 273.15 K', X(-10), by + rowH * 4 + 12, { align: 'center', size: 11, color: C.ok });
        rows.forEach((r, i) => {
          const y = by + i * rowH + 4, x1 = X(r[1]), xs = Math.min(X(0), x1);
          c.fillStyle = r[2]; c.globalAlpha = i === 3 ? 0.9 : 0.6; c.fillRect(xs, y, Math.max(1.5, Math.abs(x1 - X(0))), 18); c.globalAlpha = 1;
          text(kit, c, r[0], bx0 - 8, y + 9, { align: 'right', size: 11, color: C.muted });
          text(kit, c, (r[1] >= 0 ? '+' : '') + num(r[1], Math.abs(r[1]) < 10 ? 2 : 1) + ' mK', r[1] >= 0 ? x1 + 6 : x1 - 6, y + 9, { align: r[1] >= 0 ? 'left' : 'right', size: 11, weight: 650, color: C.text });
        });
        text(kit, c, 'scale: ±' + num(half, half < 10 ? 1 : 0) + ' mK across the bars · grey band = ±0.1 mK', bx0, by + rowH * 4 + 34, { size: 10.5, color: C.muted });
        ro.set('T', num(s.T, 4) + ' K');
        ro.set('C', num(s.T - 273.15, 4) + ' °C');
        ro.set('dp', num(s.dP * 1e3, 2) + ' mK  (at ' + fP(s.p) + ')');
        ro.set('da', num(s.dA * 1e3, 2) + ' mK');
        ro.set('dd', num(s.dD * 1e3, 3) + ' mK');
        ro.set('ice', num((s.T - 273.15) * 1e3, 1) + ' mK');
        ro.set('m', num(s.m * 1e3, 2) + ' mmol/kg');
      }, box.stage);
      loop.start();
    }
  });
})();
