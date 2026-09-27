/* HYPER-HYDRAULICS · sims/systems.js — simulations for System circuits and Components and sizing (content/systems.js).
 *   sys-acc-charge   an accumulator charged by a pump and discharged through an orifice: the nitrogen charge with
 *                    heat exchange to the shell (thermal time constant), so slow strokes follow pV = const and fast
 *                    ones pV^1.4 = const; the gas state traced on a p–V diagram
 *   sys-acc-size     sizing an accumulator: three gas states, isothermal and adiabatic sizes, temperature-corrected
 *                    pre-charge, a nominal size, the p–V diagram
 *   sys-acc-circuit  a working accumulator circuit: small pump, charging (unloading) valve with cut-in/cut-out,
 *                    check valve, safety block (relief, gauge, dump valve), compensated flow control, 4/3 valve, cylinder
 *   sys-hilo         a hi-lo press: double pump, unloading valve piloted from the system, check valve, relief,
 *                    tandem-centre 4/3 valve and a vertical press forming a workpiece; power compared with one big pump
 *   sys-energy       fixed pump + relief, open centre, pressure-compensated and load-sensing supplies on the same work
 *                    cycle: p–Q power rectangles, power and heat bars, cycle efficiency
 *   sys-motor-brake  a motor driving a flywheel, stopped by crossover relief valves with make-up checks — or not:
 *                    a dynamic model with oil compressibility (pressure spikes, cavitation, rocking)
 *   sys-heat         oil temperature over a shift: heat load, tank walls, air-oil cooler with thermostatic bypass
 *   sys-tank         inside a reservoir: dwell time, a baffle and air bubbles rising at the Stokes speed
 * Engine additions kept inside this file: a simple nitrogen-charge model (gas, gasStep) and an externally piloted
 * unloading-valve symbol (unloadValve), drawn in the style of kit.fsym.pressureValve.
 */
(function () {
  'use strict';
  const ATM = 101325, RHO = 870, G0 = 9.80665;
  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  const fin = (x, d) => (Number.isFinite(x) ? x : (d || 0));
  const fbar = (p, dec) => (fin(p) / 1e5).toFixed(dec == null ? 0 : dec) + ' bar';
  const flpm = (q, dec) => (fin(q) * 60000).toFixed(dec == null ? 1 : dec) + ' L/min';
  const fkw = (p, dec) => (fin(p) / 1000).toFixed(dec == null ? 2 : dec) + ' kW';
  // draw on a fixed W × H design grid, scaled and centred on the stage
  function onGrid(st, W, H) {
    const c = st.begin(), k = Math.min(st.W / W, st.H / H);
    c.save(); c.translate((st.W - W * k) / 2, (st.H - H * k) / 2); c.scale(k, k);
    return c;
  }
  function plotDiv(box) { const d = document.createElement('div'); d.style.padding = '4px 10px 10px'; box.stage.appendChild(d); return d; }
  function seg(c, pts, color, w, dash) {
    c.strokeStyle = color; c.lineWidth = w || 1.6; c.setLineDash(dash || []); c.lineJoin = 'round'; c.lineCap = 'round';
    c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke(); c.setLineDash([]);
  }
  // a capsule (the shell of an accumulator)
  function capsule(c, x, y, w, h) {
    const r = w / 2;
    c.beginPath(); c.moveTo(x, y + r); c.arc(x + r, y + r, r, Math.PI, 0); c.lineTo(x + w, y + h - r); c.arc(x + r, y + h - r, r, 0, Math.PI); c.closePath();
  }
  // gas temperature → a colour from blue (cold) to red (hot)
  const gasCol = (kit, TC, a) => kit.hue(clamp(220 - (TC + 10) * 2.1, 0, 230), a);

  /* ---------------------------------------------------------------- a nitrogen charge (ideal gas with heat exchange)
   * p0g: pre-charge (gauge, Pa) at T0C (°C); V0: gas volume when empty of oil (m³).
   * gasStep: qNet (m³/s) of oil into the accumulator over dt; tau: thermal time constant (s) towards the wall temperature. */
  function gas(p0g, V0, T0C) { const T0 = T0C + 273.15; return { NR: (p0g + ATM) * V0 / T0, V0, Vg: V0, T: T0, Tw: T0 }; }
  const gasP = g => g.NR * g.T / g.Vg;
  function gasStep(g, qNet, dt, tau) {
    const Vn = clamp(g.Vg - qNet * dt, g.V0 * 0.03, g.V0);
    g.T *= Math.pow(g.Vg / Vn, 0.4);                                   // adiabatic part, exact for the step
    g.T += (g.Tw - g.T) * (1 - Math.exp(-dt / Math.max(tau, 1e-3)));   // heat exchange with the shell
    g.Vg = Vn;
  }

  /* ---------------------------------------------------------------- an externally piloted unloading valve
   * Local frame as kit.fsym.pressureValve: flow from 'in' (bottom) to 'out' (top), spring on the right,
   * the pilot port X on the left (dashed). rot in degrees. */
  function unloadValve(kit, c, x, y, o) {
    o = o || {};
    const S = kit.fsym, col = o.color || kit.colors().text, w = 30, h = 38, off = 9 * (1 - clamp(o.open || 0, 0, 1));
    const r = (o.rot || 0) * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r);
    const map = (lx, ly) => [x + lx * cs - ly * sn, y + lx * sn + ly * cs];
    c.save(); c.translate(x, y); if (r) c.rotate(r);
    c.setLineDash([]); c.strokeStyle = col; c.lineWidth = 1.8; c.strokeRect(-w / 2, -h / 2, w, h);
    seg(c, [[0, h / 2], [0, h / 2 + 10]], col, 1.8); seg(c, [[0, -h / 2], [0, -h / 2 - 10]], col, 1.8);
    seg(c, [[off, h / 2 - 4], [off, -h / 2 + 7]], col, 1.6); S.head(c, off, -h / 2 + 3, -Math.PI / 2, 8, col);
    S.zigzag(c, w / 2, 0, w / 2 + 16, 0, 5, 3, col);
    seg(c, [[w / 2 + 2, 10], [w / 2 + 16, -10]], col, 1.2); S.head(c, w / 2 + 18, -13, Math.atan2(-23, 16), 6, col);
    seg(c, [[-w / 2 - 12, 0], [-w / 2, 0]], col, 1.3, [4, 3]);
    c.restore();
    return { in: map(0, h / 2 + 10), out: map(0, -h / 2 - 10), X: map(-w / 2 - 12, 0) };
  }
  // 2/2 valves with P at the top, so the arrow points down the page
  const SPEC_22_NC_DOWN = { top: [['P', 0.5]], bottom: [['A', 0.5]], boxes: [['P>A'], ['P|', 'A|']], normal: 1 };
  const SPEC_22_NO_DOWN = { top: [['P', 0.5]], bottom: [['A', 0.5]], boxes: [['P|', 'A|'], ['P>A']], normal: 1 };

  /* ================================================================ an accumulator charging and discharging */
  Hyper.sim('sys-acc-charge', {
    title: 'An accumulator charging and discharging',
    blurb: `A pump charges a bladder accumulator through a check valve; a solenoid valve and an orifice discharge it to tank. On the right the accumulator is drawn in section — the nitrogen (coloured by its temperature) above, the oil below — and underneath, the state of the gas is traced on a pressure–volume diagram against the isothermal curve (pV = const) and the adiabatic one (pV^1.4 = const), both through the pre-charge point. The gas exchanges heat with the shell with the time constant you set.

**Try this**
- Watch one automatic cycle: charging heats the gas and the trace climbs above the isothermal curve; while the accumulator holds its oil, the gas cools and the pressure sags at constant volume.
- Open the discharge orifice to 8 mm: the stroke takes about a second, the trace follows the adiabatic curve, n ≈ 1.4, and the gas is left cold — less oil for the same pressure drop.
- Close it to 0.5 mm: the discharge takes minutes, the trace hugs the isothermal curve, n ≈ 1.
- Raise the pre-charge above the relief setting: no oil can ever enter. Lower it to 20 bar: plenty of oil, but most of it delivered at pressures too low to be useful.
- After a fast discharge the accumulator is empty but its gas is cold: watch its pressure climb back to the pre-charge as it warms.`,
    mount(box, kit) {
      const S = kit.fsym, F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 300 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'gas volume (L)', min: 0 }, y: { label: 'gas pressure (bar, absolute)', min: 0 }, legend: true }, 210);
      let phase = 'charge', auto = true, tIn = 0, cond = 0, next = 'dis', g, hist = [], start = null, nEff = null, work = 0, tPlot = 0, vstate = 1;
      const ph = {};
      let out = { qin: 0, qout: 0, qr: 0, pNode: 0, Qp: 0 };
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'charge', label: 'Charge' }, { id: 'hold', label: 'Hold' }, { id: 'dis', label: 'Discharge' }] },
        { id: 'auto', type: 'check', label: 'Cycle automatically', value: true },
        { id: 'p0', label: 'Pre-charge at 20 °C (gauge)', min: 20, max: 150, step: 5, value: 90, unit: 'bar' },
        { id: 'V0', label: 'Size (gas volume V₀)', min: 1, max: 32, step: 0.5, value: 10, unit: 'L' },
        { id: 'Qp', label: 'Pump flow', min: 2, max: 80, step: 1, value: 30, unit: 'L/min' },
        { id: 'd', label: 'Discharge orifice diameter', min: 0.5, max: 8, step: 0.1, value: 3, unit: 'mm' },
        { id: 'tau', label: 'Heat-exchange time constant', min: 1, max: 200, value: 8, unit: 's', log: true, sig: 2 },
        { id: 'relief', label: 'Relief-valve setting', min: 120, max: 300, step: 5, value: 200, unit: 'bar' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Empty and restart' }] }
      ], (id, v) => {
        if (id === 'charge' || id === 'hold' || id === 'dis') { auto = false; ctl.set('auto', false); setPhase(id); }
        if (id === 'auto') { auto = !!v; tIn = 0; cond = 0; }
        if (id === 'p0' || id === 'V0' || id === 'reset') restart();
      });
      const ro = kit.readout(box.side, [['p', 'Gas pressure: absolute / gauge'], ['v', 'Gas volume / oil stored'], ['T', 'Gas temperature'], ['n', 'Exponent of this stroke, n'], ['q', 'Oil flow in / out'], ['w', 'Work stored in the gas']]);
      const V = ctl.values;
      function setPhase(p, n) {
        phase = p; tIn = 0; cond = 0; if (n) next = n;
        if (p !== 'hold') { start = { p: gasP(g), V: g.Vg }; nEff = null; }
      }
      function restart() { g = gas(V.p0 * 1e5, V.V0 / 1000, 20); hist = []; work = 0; nEff = null; setPhase('charge', 'dis'); }
      restart();
      function step(dt) {
        const Qp = V.Qp / 60000, pSet = V.relief * 1e5, A = Math.PI * Math.pow(V.d / 1000, 2) / 4;
        const pg = gasP(g) - ATM, hasOil = g.Vg < g.V0 * (1 - 1e-6);
        let qin = 0, qout = 0, qr = 0, pNode = hasOil ? Math.max(0, pg) : 0;
        if (phase === 'charge') {
          const pc = pSet - 10e5;
          qr = Qp * clamp((pg - pc) / (pSet - pc), 0, 1); qin = Qp - qr; pNode = Math.max(0, pg);
        } else if (phase === 'dis' && hasOil && pg > 0) {
          qout = Math.min(F.orifice(0.65, A, pg, RHO), (g.V0 - g.Vg) / dt);
        }
        const Vb = g.Vg;
        gasStep(g, qin - qout, dt, V.tau);
        work += gasP(g) * (Vb - g.Vg);
        if (g.Vg >= g.V0 * (1 - 1e-6)) work = 0;
        out = { qin, qout, qr, pNode, Qp };
        tIn += dt;
        if (auto) {
          const pNow = gasP(g) - ATM, empty = g.Vg >= g.V0 * (1 - 1e-6);
          if (phase === 'charge') { if (pNow >= pSet - 12e5) cond += dt; if (cond > 1 || tIn > 150) setPhase('hold', 'dis'); }
          else if (phase === 'hold') { if ((tIn > 3 && Math.abs(g.T - g.Tw) < 3) || tIn > 20) setPhase(next); }
          else if (phase === 'dis') { if (empty) cond += dt; if (cond > 0.5 || tIn > 300) setPhase('hold', 'charge'); }
        }
        if (start && phase !== 'hold') {
          const lv = Math.log(start.V / g.Vg);
          if (Math.abs(lv) > 0.03) nEff = Math.log(gasP(g) / start.p) / lv;
        }
      }
      const loop = kit.loop((dt) => {
        const n = 25;
        for (let k = 0; k < n; k++) step(dt / n);
        const C = kit.colors(), o = out, pa = gasP(g), pg = pa - ATM, TC = g.T - 273.15, oil = g.V0 - g.Vg;
        vstate += clamp((phase === 'dis' ? 0 : 1) - vstate, -dt / 0.08, dt / 0.08);
        ro.set('p', (pa / 1e5).toFixed(1) + ' bar abs / ' + (pg / 1e5).toFixed(1) + ' bar');
        ro.set('v', (g.Vg * 1000).toFixed(2) + ' L / ' + (oil * 1000).toFixed(2) + ' L');
        ro.set('T', TC.toFixed(1) + ' °C');
        ro.set('n', nEff == null || !Number.isFinite(nEff) ? '—' : nEff.toFixed(2) + (nEff < 1.1 ? '  (nearly isothermal)' : nEff > 1.3 ? '  (nearly adiabatic)' : '  (in between)'));
        ro.set('q', flpm(o.qin) + ' in / ' + flpm(o.qout) + ' out' + (o.qr > 1e-7 ? '  (' + flpm(o.qr) + ' over the relief valve)' : ''));
        ro.set('w', (work / 1000).toFixed(1) + ' kJ');
        // the p–V diagram
        tPlot += dt;
        if (tPlot > 0.1) {
          tPlot = 0;
          hist.push([g.Vg * 1000, pa / 1e5]); if (hist.length > 700) hist.shift();
          const p0a = (V.p0 * 1e5 + ATM) / 1e5, V0 = V.V0, pTop = (V.relief * 1e5 + ATM) / 1e5 * 1.15, iso = [], adi = [];
          for (let i = 0; i <= 50; i++) {
            const p = p0a + (pTop - p0a) * i / 50;
            iso.push([V0 * p0a / p, p]); adi.push([V0 * Math.pow(p0a / p, 1 / 1.4), p]);
          }
          plot.set({
            x: { label: 'gas volume (L)', min: 0, max: V0 * 1.05 },
            series: [{ pts: iso, label: 'isothermal, pV = const' }, { pts: adi, label: 'adiabatic, pV^1.4 = const', dash: [6, 4] }, { pts: hist.slice(), label: 'the gas', width: 2.4 }],
            marks: [{ x: g.Vg * 1000, y: pa / 1e5, label: 'now' }],
            hlines: [{ y: (V.relief * 1e5 + ATM) / 1e5, label: 'relief (abs)' }]
          });
        }
        // ---- drawing on a 780 × 400 grid
        const c = onGrid(st, 780, 400), col = S.col;
        const pumpOn = phase === 'charge' && o.Qp > 0, hp = o.pNode > 5e5;
        const P = {
          suction: [[110, 326], [110, 336]],
          header: [[110, 274], [110, 200], [192, 200]],
          relief: [[160, 200], [160, 221]], reliefOut: [[160, 279], [160, 289]],
          node: [[228, 200], [400, 200], [400, 225]],
          gauge: [[270, 181], [270, 200]], acc: [[330, 169], [330, 200]],
          dis1: [[400, 275], [400, 289]], dis2: [[400, 321], [400, 335]]
        };
        S.line(c, P.suction, { state: pumpOn ? 'suction' : 'idle' });
        S.line(c, P.header, { state: pumpOn ? 'pressure' : 'idle' });
        S.line(c, P.relief, { state: pumpOn ? 'pressure' : 'idle' });
        S.line(c, P.reliefOut, { state: o.qr > 1e-7 ? 'return' : 'idle' });
        S.line(c, P.node, { state: hp ? 'pressure' : 'idle' });
        S.line(c, P.gauge, { state: hp ? 'pressure' : 'idle' });
        S.line(c, P.acc, { state: hp ? 'pressure' : 'idle' });
        S.line(c, P.dis1, { state: o.qout > 1e-7 ? 'return' : 'idle' });
        S.line(c, P.dis2, { state: o.qout > 1e-7 ? 'return' : 'idle' });
        S.junction(c, 160, 200); S.junction(c, 270, 200); S.junction(c, 330, 200);
        const adv = (key, q) => { ph[key] = (ph[key] || 0) + dt * 90 * q / 5e-4; return ph[key]; };
        if (pumpOn) { S.flow(c, P.suction, adv('su', o.Qp), { color: col('suction') }); S.flow(c, P.header, adv('he', o.Qp), { color: col('pressure') }); }
        if (o.qr > 1e-7) S.flow(c, P.relief.concat(P.reliefOut), adv('re', o.qr), { color: col('pressure') });
        if (o.qin > 1e-7) S.flow(c, [[228, 200], [330, 200], [330, 169]], adv('in', o.qin), { color: col('pressure') });
        if (o.qout > 1e-7) {
          S.flow(c, [[330, 169], [330, 200], [400, 200], [400, 225]], adv('ou', o.qout), { color: col('pressure') });
          S.flow(c, P.dis1.concat(P.dis2), adv('o2', o.qout), { color: col('return') });
        }
        S.pump(c, 110, 300, { motor: true });
        S.tank(c, 110, 346); S.tank(c, 160, 299); S.tank(c, 400, 345);
        S.pressureValve(c, 160, 250, { kind: 'relief', rot: 180, open: o.Qp > 0 ? o.qr / o.Qp : 0 });
        S.check(c, 210, 200, { rot: 90, open: o.qin > 1e-7 });
        S.gauge(c, 270, 160, { frac: o.pNode / 400e5, value: fbar(o.pNode) });
        S.accumulator(c, 330, 140, { level: clamp(oil / g.V0, 0, 1) });
        S.valve(c, 400, 250, { spec: SPEC_22_NC_DOWN, state: vstate, left: 'solenoid', right: 'spring', s: 30 });
        S.throttle(c, 400, 305, { adjustable: true });
        kit.label(c, 'd = ' + V.d.toFixed(1) + ' mm', 418, 305, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'relief ' + V.relief + ' bar', 150, 250, { color: C.muted, size: 10, align: 'right' });
        kit.label(c, V.Qp.toFixed(0) + ' L/min', 76, 300, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, phase === 'dis' ? 'Y1 on' : 'Y1', 352, 262, { color: phase === 'dis' ? C.bad : C.muted, size: 11, weight: 700, align: 'right' });
        seg(c, [[346, 140], [520, 140]], C.faint || C.muted, 1, [3, 4]);
        // ---- the accumulator in section
        const x0 = 530, w = 140, y0 = 44, h = 316, inTop = y0 + 8, inBot = y0 + h - 12, Hin = inBot - inTop;
        const f = clamp(g.Vg / g.V0, 0, 1), yi = inTop + f * Hin;
        c.save(); capsule(c, x0 + 7, y0 + 7, w - 14, h - 14); c.clip();
        c.fillStyle = kit.hue(38, 0.45); c.fillRect(x0, yi, w, inBot - yi + 20);
        c.fillStyle = gasCol(kit, TC, 0.5); c.strokeStyle = C.text; c.lineWidth = 1.4;
        const bw = w - 26, br = Math.min(bw / 2, Math.max(4, (yi - inTop) / 2));
        c.beginPath(); c.moveTo(x0 + 13, inTop - 20); c.lineTo(x0 + 13, yi - br); c.arc(x0 + 13 + bw / 2, yi - br, bw / 2, Math.PI, 0, true);
        c.lineTo(x0 + 13 + bw, inTop - 20); c.closePath(); c.fill(); c.stroke();
        c.restore();
        c.strokeStyle = C.text; c.lineWidth = 3; capsule(c, x0, y0, w, h); c.stroke();
        c.fillStyle = C.text; c.fillRect(x0 + w / 2 - 7, y0 - 12, 14, 14);
        c.fillRect(x0 + w / 2 - 10, y0 + h - 2, 20, 12);
        c.fillStyle = C.surface; c.fillRect(x0 + w / 2 - 12, y0 + h - 18, 24, 8); c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(x0 + w / 2 - 12, y0 + h - 18, 24, 8);
        kit.label(c, 'N₂', x0 + w / 2, inTop + (yi - inTop) * 0.35, { color: C.text, size: 16, weight: 700 });
        kit.label(c, (pa / 1e5).toFixed(0) + ' bar abs', x0 + w / 2, inTop + (yi - inTop) * 0.35 + 20, { color: C.text, size: 12 });
        kit.label(c, TC.toFixed(0) + ' °C', x0 + w / 2, inTop + (yi - inTop) * 0.35 + 36, { color: C.text, size: 12 });
        if (inBot - yi > 30) kit.label(c, 'oil ' + (oil * 1000).toFixed(1) + ' L', x0 + w / 2, (yi + inBot) / 2, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'the accumulator, in section', x0 + w / 2, 22, { color: C.muted, size: 11 });
        kit.label(c, 'gas valve', x0 + w / 2 + 12, y0 - 5, { color: C.muted, size: 10, align: 'left' });
        kit.label(c, 'poppet', x0 + w / 2 + 16, y0 + h - 14, { color: C.muted, size: 10, align: 'left' });
        const msg = phase === 'charge' ? (o.qin < 1e-7 && o.Qp > 0 ? 'charging: all flow over the relief valve' : 'charging: pump → check valve → accumulator')
          : phase === 'dis' ? (g.Vg >= g.V0 * (1 - 1e-6) ? 'empty: the bladder rests on the poppet' : 'discharging through the orifice to tank') : 'holding: valve closed, pump stopped';
        kit.label(c, msg, 30, 385, { color: C.text, size: 12, weight: 700, align: 'left' });
        if (V.p0 >= V.relief - 10) kit.label(c, 'pre-charge ≥ relief setting: no oil can enter', 30, 30, { color: C.bad, size: 12, weight: 700, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ sizing an accumulator */
  Hyper.sim('sys-acc-size', {
    title: 'Sizing an accumulator',
    blurb: `Choose the oil the accumulator must deliver, the pressure band and the pre-charge ratio; the sizing formula with absolute pressures gives the gas volume V₀ for a slow (isothermal) and a fast (adiabatic) stroke. The three gas states are drawn above — pre-charged, full at p₂, and at the end of the stroke at p₁ — with a fourth accumulator working between them; the p–V diagram below shows both sizes' curves and the band. The pre-charge is specified at the working temperature and converted to the filling pressure at 20 °C.

**Try this**
- Switch between the fast and the slow stroke: the adiabatic accumulator is about a quarter larger for a 2:1 band.
- Narrow the band (raise p₁ towards p₂): the accumulator grows rapidly. Widen it: it shrinks, but the actuator must still work at p₁.
- Lower the pre-charge ratio from 0.9 to 0.5: more gas volume is needed, and the bladder is squeezed harder (watch p₂/p₀; bladders are limited to about 4).
- Raise the gas working temperature to 60 °C: the pre-charge must be filled lower at 20 °C, or it would rise above the intended value when warm.
- Try a low-pressure system (p₁ = 20, p₂ = 40 bar): here the difference between gauge and absolute pressures matters.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.42, minH: 240 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'gas volume (L)', min: 0 }, y: { label: 'gas pressure (bar, absolute)', min: 0 }, legend: true }, 230);
      const NOM = [0.16, 0.32, 0.5, 0.75, 1, 1.4, 2.5, 4, 5, 6, 10, 13, 20, 24, 32, 50];
      let dirty = true, t = 0, tPlot = 1, res = null;
      const ctl = kit.controls(box.side, [
        { id: 'dV', label: 'Oil to deliver ΔV', min: 0.2, max: 40, value: 2, unit: 'L', log: true, sig: 2 },
        { id: 'p2', label: 'Maximum working pressure p₂ (gauge)', min: 30, max: 350, step: 5, value: 200, unit: 'bar' },
        { id: 'p1', label: 'Minimum working pressure p₁ (gauge)', min: 10, max: 300, step: 5, value: 100, unit: 'bar' },
        { id: 'r', label: 'Pre-charge ratio p₀/p₁ (absolute, when warm)', min: 0.5, max: 0.97, step: 0.01, value: 0.9 },
        { id: 'Tw', label: 'Gas working temperature', min: -10, max: 80, step: 1, value: 20, unit: '°C' },
        { id: 'n', type: 'select', label: 'Stroke', options: [['Fast (adiabatic, n = 1.4)', 1.4], ['Slow (isothermal, n = 1)', 1]], value: 1.4 }
      ], () => { dirty = true; });
      const ro = kit.readout(box.side, [['V0', 'Size needed, this stroke'], ['both', 'Isothermal / adiabatic'], ['nom', 'Nominal size (typical list)'], ['fill', 'Fill to, at 20 °C (gauge)'], ['ratio', 'p₂/p₀  ·  p₂/p₁'], ['chk', 'Check']]);
      const V = ctl.values;
      function calc() {
        const p1 = V.p1 + ATM / 1e5, p2 = V.p2 + ATM / 1e5;
        if (!(p2 > p1 + 0.5)) return { ok: false };
        const p0 = V.r * p1, n = +V.n;
        const size = m => V.dV / (Math.pow(p0 / p1, 1 / m) - Math.pow(p0 / p2, 1 / m));
        const Vi = size(1), Va = size(1.4), V0 = n === 1 ? Vi : Va;
        const V1 = V0 * Math.pow(p0 / p1, 1 / n), V2 = V0 * Math.pow(p0 / p2, 1 / n);
        const nom = NOM.find(s => s >= V0 - 1e-9) || null;
        const fill = p0 * 293.15 / (V.Tw + 273.15) - ATM / 1e5;
        return { ok: true, p0, p1, p2, n, Vi, Va, V0, V1, V2, nom, fill };
      }
      function readouts(r) {
        if (!r.ok) { ['V0', 'both', 'nom', 'fill', 'ratio'].forEach(k => ro.set(k, '—')); ro.set('chk', 'p₂ must be above p₁'); return; }
        ro.set('V0', r.V0.toFixed(2) + ' L');
        ro.set('both', r.Vi.toFixed(2) + ' L / ' + r.Va.toFixed(2) + ' L');
        ro.set('nom', r.nom ? r.nom + ' L  (delivers ' + (r.nom * (Math.pow(r.p0 / r.p1, 1 / r.n) - Math.pow(r.p0 / r.p2, 1 / r.n))).toFixed(2) + ' L)' : 'over 50 L: several accumulators or a piston type');
        ro.set('fill', r.fill.toFixed(1) + ' bar  (' + (r.p0 - ATM / 1e5).toFixed(1) + ' bar when at ' + V.Tw + ' °C)');
        ro.set('ratio', (r.p2 / r.p0).toFixed(2) + '  ·  ' + (r.p2 / r.p1).toFixed(2));
        ro.set('chk', r.p2 / r.p0 > 8 ? 'p₂/p₀ over 8: too much even for a diaphragm; raise p₀' : r.p2 / r.p0 > 4 ? 'p₂/p₀ over 4: too high for a bladder; piston or diaphragm' : r.fill < 1 ? 'pre-charge too low to fill reliably' : 'within the usual bladder limits');
      }
      const loop = kit.loop((dt) => {
        if (dirty) { res = calc(); readouts(res); dirty = false; tPlot = 1; }
        t += dt; tPlot += dt;
        const C = kit.colors(), r = res;
        const c = onGrid(st, 760, 300);
        if (!r || !r.ok) { kit.label(c, 'Set the maximum pressure above the minimum.', 380, 150, { color: C.bad, size: 14, weight: 700 }); c.restore(); return; }
        // the working accumulator moves between V2 and V1 on the chosen curve
        const s = 0.5 - 0.5 * Math.cos(t * 2 * Math.PI / 5);
        const Vw = r.V2 + (r.V1 - r.V2) * s, pw = r.p0 * Math.pow(r.V0 / Vw, r.n);
        const states = [
          { x: 70, f: 1, title: 'pre-charged', sub: 'p₀ = ' + r.p0.toFixed(0) + ' bar abs', v: 'V₀ = ' + r.V0.toFixed(2) + ' L' },
          { x: 230, f: r.V2 / r.V0, title: 'full, at p₂', sub: r.p2.toFixed(0) + ' bar abs', v: 'V₂ = ' + r.V2.toFixed(2) + ' L' },
          { x: 390, f: r.V1 / r.V0, title: 'end of stroke, at p₁', sub: r.p1.toFixed(0) + ' bar abs', v: 'V₁ = ' + r.V1.toFixed(2) + ' L' },
          { x: 590, f: Vw / r.V0, title: 'working', sub: pw.toFixed(0) + ' bar abs', v: 'gas ' + Vw.toFixed(2) + ' L' }
        ];
        const w = 70, y0 = 40, h = 200, inTop = y0 + 6, Hin = h - 16;
        for (const S of states) {
          const yi = inTop + S.f * Hin;
          c.save(); capsule(c, S.x + 5, y0 + 5, w - 10, h - 10); c.clip();
          c.fillStyle = kit.hue(38, 0.45); c.fillRect(S.x, yi, w, h);
          c.fillStyle = kit.hue(205, 0.35); c.fillRect(S.x, y0, w, yi - y0);
          seg(c, [[S.x, yi], [S.x + w, yi]], C.text, 1.4);
          c.restore();
          c.strokeStyle = C.text; c.lineWidth = 2.4; capsule(c, S.x, y0, w, h); c.stroke();
          kit.label(c, S.title, S.x + w / 2, 22, { color: C.text, size: 12, weight: 700 });
          kit.label(c, S.sub, S.x + w / 2, y0 + h + 16, { color: C.text, size: 11 });
          kit.label(c, S.v, S.x + w / 2, y0 + h + 32, { color: C.muted, size: 11 });
        }
        // ΔV bracket between the full and end-of-stroke levels
        const yF = inTop + states[1].f * Hin, yE = inTop + states[2].f * Hin;
        seg(c, [[300, yF], [320, yF]], C.accent, 1.4, [3, 3]); seg(c, [[300, yE], [320, yE]], C.accent, 1.4, [3, 3]);
        kit.arrow(c, 310, yE - 2, 310, yF + 2, C.accent, 2); kit.arrow(c, 310, yF + 2, 310, yE - 2, C.accent, 2);
        kit.label(c, 'ΔV = ' + V.dV.toFixed(2) + ' L', 318, (yF + yE) / 2 - 10, { color: C.accent, size: 12, weight: 700, align: 'left' });
        kit.label(c, 'n = ' + r.n, 700, 60, { color: C.muted, size: 12, align: 'left' });
        kit.label(c, r.nom ? 'choose ' + r.nom + ' L' : 'over 50 L', 700, 80, { color: C.ok, size: 13, weight: 700, align: 'left' });
        c.restore();
        if (tPlot > 0.1) {
          tPlot = 0;
          const top = r.p2 * 1.15, iso = [], adi = [];
          for (let i = 0; i <= 60; i++) {
            const p = r.p0 + (top - r.p0) * i / 60;
            iso.push([r.Vi * r.p0 / p, p]); adi.push([r.Va * Math.pow(r.p0 / p, 1 / 1.4), p]);
          }
          plot.set({
            x: { label: 'gas volume (L)', min: 0, max: Math.max(r.Vi, r.Va) * 1.08 },
            y: { label: 'gas pressure (bar, absolute)', min: 0, max: top * 1.02 },
            series: [{ pts: iso, label: 'isothermal size ' + r.Vi.toFixed(2) + ' L', width: r.n === 1 ? 2.6 : 1.2 }, { pts: adi, label: 'adiabatic size ' + r.Va.toFixed(2) + ' L', dash: [6, 4], width: r.n === 1 ? 1.2 : 2.6 }],
            vlines: [{ x: r.V2, label: 'V₂' }, { x: r.V1, label: 'V₁' }],
            hlines: [{ y: r.p1, label: 'p₁' }, { y: r.p2, label: 'p₂' }, { y: r.p0, label: 'p₀' }],
            marks: [{ x: Vw, y: pw, label: 'working' }]
          });
        }
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a working accumulator circuit */
  Hyper.sim('sys-acc-circuit', {
    title: 'An accumulator circuit: a small pump for a big stroke',
    blurb: `A 20 L/min pump charges a 10 L accumulator through a check valve. A charging (unloading) valve, piloted from the accumulator side, dumps the pump's flow to tank when the pressure reaches its cut-out of 170 bar and loads it again at the cut-in of 140 bar. The safety block has its own relief valve (200 bar), a gauge and a normally open dump valve that closes only while the machine runs. A pressure-compensated flow control and a 4/3 valve drive an 80/45 mm cylinder through a 500 mm stroke at 60 L/min — three times the pump's flow — then pause. Lines: **red** pressure, **yellow** metered, **blue** return, **orange** pilot.

**Try this**
- Watch the gauge through a cycle: the accumulator supplies the stroke and the pressure falls; the pump recharges it during the pause and unloads at the cut-out.
- Shrink the accumulator to 2.5 L, or raise the load: the pressure falls below what the load needs and the stroke slows and stalls — the accumulator is too small for the band.
- Shorten the pause: the average demand exceeds the pump flow and the accumulator never refills. Compare the two flows in the read-out.
- Press Stop: the dump valve empties the accumulator in a few seconds. Untick the dump valve and stop again: the machine is off but the gauge still shows the stored energy.
- With the machine stopped and the dump valve unticked, press Emergency retract: the accumulator alone returns the cylinder.`,
    mount(box, kit) {
      const S = kit.fsym, F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'time (s)' }, y: { label: 'pressure (bar)', min: 0 }, legend: true }, 170);
      const Dc = 0.08, dc = 0.045, stroke = 0.5, fr = 1500;
      const A1 = Math.PI * Dc * Dc / 4, A2 = A1 - Math.PI * dc * dc / 4, Ad = Math.PI * 0.002 * 0.002 / 4;
      const CUTIN = 140e5, CUTOUT = 170e5, RELIEF = 200e5, DPC = 8e5, TAU = 15, TW = 30;
      let running = true, cyc = 'ext', tIn = 0, x = 0, unl = true, vstate = 1, dstate = 0, g = null, t = 0, tPlot = 0;
      const hist = [], ph = {};
      let out = { Qp: 0, qPump: 0, Qc: 0, qa: 0, qd: 0, qr: 0, pg: 0, pNeed: 0, bx: 1, moving: false, hasOil: true };
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'start', label: 'Start', primary: true }, { id: 'stop', label: 'Stop' }, { id: 'eret', label: 'Emergency retract' }] },
        { id: 'dump', type: 'check', label: 'Automatic dump valve in the safety block', value: true },
        { id: 'Qp', label: 'Pump flow', min: 5, max: 60, step: 1, value: 20, unit: 'L/min' },
        { id: 'Qs', label: 'Flow the stroke asks for', min: 20, max: 150, step: 5, value: 60, unit: 'L/min' },
        { id: 'F', label: 'Load against extension', min: 0, max: 80, step: 1, value: 25, unit: 'kN' },
        { id: 'V0', label: 'Accumulator size', min: 1, max: 32, step: 0.5, value: 10, unit: 'L' },
        { id: 'p0', label: 'Pre-charge (gauge)', min: 30, max: 130, step: 5, value: 70, unit: 'bar' },
        { id: 'pause', label: 'Pause between strokes', min: 2, max: 20, step: 0.5, value: 8, unit: 's' }
      ], (id) => {
        if (id === 'start' && !running) { running = true; cyc = gasP(g) - ATM > CUTIN ? 'pause' : 'fill'; tIn = 0; }
        if (id === 'stop') { running = false; cyc = 'stop'; tIn = 0; }
        if (id === 'eret' && !running) { cyc = 'eret'; tIn = 0; }
        if (id === 'V0' || id === 'p0') fillUp();
      });
      const ro = kit.readout(box.side, [['p', 'Accumulator pressure'], ['pump', 'Pump'], ['v', 'Gas volume / oil stored'], ['q', 'Cylinder flow: from pump / accumulator'], ['rod', 'Rod speed'], ['E', 'Energy stored (isothermal estimate)'], ['avg', 'Average demand / pump flow']]);
      const V = ctl.values;
      // start as if the machine had been running: pre-charged, then filled to the cut-out pressure
      function fillUp() {
        g = gas(V.p0 * 1e5, V.V0 / 1000, TW);
        const p0a = (V.p0 * 1e5 + ATM), pc = CUTOUT + ATM;
        if (pc > p0a) g.Vg = g.V0 * p0a / pc;
        unl = true;
      }
      fillUp();
      function step(dt) {
        const Qp = running ? V.Qp / 60000 : 0, Qs = V.Qs / 60000, Fl = V.F * 1000;
        const pg = gasP(g) - ATM, hasOil = g.Vg < g.V0 * (1 - 1e-6);
        if (running) { if (pg >= CUTOUT) unl = true; else if (pg <= CUTIN) unl = false; } else unl = false;
        const qPump = unl ? 0 : Qp;
        const want = cyc === 'ext' ? 0 : (cyc === 'ret' || cyc === 'eret') ? 2 : 1;
        vstate += clamp(want - vstate, -dt / 0.08, dt / 0.08);
        const bx = Math.round(vstate);
        const moving = (bx === 0 && x < stroke - 1e-9) || (bx === 2 && x > 1e-9);
        const pNeed = !moving ? 0 : bx === 0 ? (Fl + fr) / A1 + 3e5 : fr / A2 + 3e5;
        let Qc = 0;
        if (moving) Qc = hasOil ? Qs * Math.min(1, Math.sqrt(Math.max(0, pg - pNeed) / DPC)) : Math.min(Qs, qPump);
        const dumpOpen = !running && V.dump;
        dstate += clamp((dumpOpen ? 1 : 0) - dstate, -dt / 0.1, dt / 0.1);
        const qd = dumpOpen && hasOil && pg > 0 ? F.orifice(0.65, Ad, pg, RHO) : 0;
        const qr = qPump * clamp((pg - (RELIEF - 5e5)) / 5e5, 0, 1);
        let qa = qPump - qr - Qc - qd;
        if (!hasOil && qa < 0) qa = 0;
        gasStep(g, qa, dt, TAU);
        x = clamp(x + (bx === 0 ? Qc / A1 : bx === 2 ? -Qc / A2 : 0) * dt, 0, stroke);
        out = { Qp, qPump, Qc, qa, qd, qr, pg: gasP(g) - ATM, pNeed, bx, moving, hasOil };
        tIn += dt; t += dt;
        if (cyc === 'fill') { if (unl) { cyc = 'ext'; tIn = 0; } }
        else if (cyc === 'ext') { if (x >= stroke - 1e-9) { cyc = 'dwell'; tIn = 0; } }
        else if (cyc === 'dwell') { if (tIn > 1) { cyc = 'ret'; tIn = 0; } }
        else if (cyc === 'ret') { if (x <= 1e-9) { cyc = 'pause'; tIn = 0; } }
        else if (cyc === 'pause') { if (tIn > V.pause) { cyc = 'ext'; tIn = 0; } }
        else if (cyc === 'eret') { if (x <= 1e-9 || tIn > 20) { cyc = 'stop'; tIn = 0; } }
      }
      const loop = kit.loop((dt) => {
        const n = 20;
        for (let k = 0; k < n; k++) step(dt / n);
        const C = kit.colors(), o = out, pa = gasP(g), oil = g.V0 - g.Vg;
        const Qs = V.Qs / 60000, tCyc = stroke * A1 / Qs + 1 + stroke * A2 / Qs + V.pause, avg = stroke * (A1 + A2) / tCyc;
        const stalled = o.moving && o.Qc < 1e-7;
        ro.set('p', fbar(o.pg) + (unl ? '  (cut-out reached)' : ''));
        ro.set('pump', !running ? 'stopped' : unl ? 'unloaded to tank at a few bar' : 'loaded: ' + flpm(o.Qp));
        ro.set('v', (g.Vg * 1000).toFixed(2) + ' L / ' + (oil * 1000).toFixed(2) + ' L');
        const fromPump = Math.min(o.Qc, o.qPump);
        ro.set('q', flpm(fromPump) + ' / ' + flpm(Math.max(0, o.Qc - fromPump)));
        ro.set('rod', (o.moving ? (o.bx === 0 ? o.Qc / A1 : o.Qc / A2) * 1000 : 0).toFixed(0) + ' mm/s' + (stalled ? '  (stalled)' : ''));
        ro.set('E', (pa * g.Vg * Math.log(g.V0 / g.Vg) / 1000).toFixed(1) + ' kJ');
        ro.set('avg', flpm(avg) + ' / ' + flpm(V.Qp / 60000) + (avg > V.Qp / 60000 ? '  — pump too small' : ''));
        tPlot += dt;
        if (tPlot > 0.1) {
          tPlot = 0; hist.push([t, o.pg / 1e5, o.moving ? o.pNeed / 1e5 : 0]); if (hist.length > 250) hist.shift();
          plot.set({ series: [{ pts: hist.map(h => [h[0], h[1]]), label: 'accumulator' }, { pts: hist.map(h => [h[0], h[2]]), label: 'needed by the load', dash: [5, 4] }],
            hlines: [{ y: CUTOUT / 1e5, label: 'cut-out' }, { y: CUTIN / 1e5, label: 'cut-in' }] });
        }
        // ---- drawing on a 780 × 440 grid
        const c = onGrid(st, 780, 440), col = S.col;
        const hp = o.hasOil && o.pg > 5e5;
        const ext = o.bx === 0 && o.moving && o.Qc > 1e-7, ret = o.bx === 2 && o.moving && o.Qc > 1e-7;
        const P = {
          suction: [[90, 396], [90, 406]], pumpLine: [[90, 344], [90, 250], [212, 250]],
          unl: [[150, 250], [150, 281]], unlOut: [[150, 339], [150, 349]], pilot: [[270, 250], [270, 310], [177, 310]],
          node: [[248, 250], [493.6, 250], [493.6, 240]], acc: [[300, 199], [300, 250]], gauge: [[340, 226], [340, 250]],
          relief: [[385, 250], [385, 281]], reliefOut: [[385, 339], [385, 349]],
          dump: [[475, 250], [475, 276]], dump2: [[475, 324], [475, 334]], dump3: [[475, 366], [475, 376]],
          fcOut: [[493.6, 184], [493.6, 176]], T: [[506.4, 176], [506.4, 182], [545, 182], [545, 400]],
          A: [[428, 78], [428, 95], [493.6, 95], [493.6, 124]], B: [[562, 78], [562, 108], [506.4, 108], [506.4, 124]]
        };
        S.line(c, P.suction, { state: running ? 'suction' : 'idle' });
        S.line(c, P.pumpLine, { state: !running ? 'idle' : unl ? 'return' : 'pressure' });
        S.line(c, P.unl, { state: running && unl ? 'return' : 'idle' });
        S.line(c, P.unlOut, { state: running && unl ? 'return' : 'idle' });
        S.line(c, P.pilot, { state: hp ? 'pilot' : 'idle', kind: 'pilot' });
        for (const k of ['node', 'acc', 'gauge', 'relief', 'dump']) S.line(c, P[k], { state: hp ? 'pressure' : 'idle' });
        S.line(c, P.reliefOut, { state: o.qr > 1e-7 ? 'return' : 'idle' });
        S.line(c, P.dump2, { state: o.qd > 1e-7 ? 'return' : 'idle' }); S.line(c, P.dump3, { state: o.qd > 1e-7 ? 'return' : 'idle' });
        S.line(c, P.fcOut, { state: ext || ret ? 'metered' : hp ? 'pressure' : 'idle' });
        S.line(c, P.T, { state: ext || ret ? 'return' : 'idle' });
        S.line(c, P.A, { state: ext ? 'metered' : ret ? 'return' : 'idle' });
        S.line(c, P.B, { state: ret ? 'metered' : ext ? 'return' : 'idle' });
        [[150, 250], [270, 250], [300, 250], [340, 250], [385, 250], [475, 250]].forEach(p => S.junction(c, p[0], p[1]));
        const adv = (key, q) => { ph[key] = (ph[key] || 0) + dt * 90 * q / 5e-4; return ph[key]; };
        if (running) {
          S.flow(c, P.suction, adv('su', o.Qp), { color: col('suction') });
          S.flow(c, [[90, 344], [90, 250], [150, 250]], adv('pl', o.Qp), { color: col(unl ? 'return' : 'pressure') });
          if (unl) S.flow(c, P.unl.concat(P.unlOut), adv('ul', o.Qp), { color: col('return') });
          else S.flow(c, [[150, 250], [300, 250]], adv('ck', o.qPump), { color: col('pressure') });
        }
        if (Math.abs(o.qa) > 1e-7) S.flow(c, o.qa > 0 ? [[300, 250], [300, 199]] : [[300, 199], [300, 250]], adv('ac', Math.abs(o.qa)), { color: col('pressure') });
        if (ext || ret) {
          S.flow(c, [[300, 250], [493.6, 250], [493.6, 176]], adv('fc', o.Qc), { color: col('pressure') });
          const qo = ext ? o.Qc * A2 / A1 : o.Qc * A1 / A2;
          if (ext) { S.flow(c, P.A.slice().reverse(), adv('a', o.Qc), { color: col('metered') }); S.flow(c, P.B.concat(P.T.slice(1)), adv('b', qo), { color: col('return') }); }
          else { S.flow(c, P.B.slice().reverse(), adv('b', o.Qc), { color: col('metered') }); S.flow(c, P.A.concat([[506.4, 176]], P.T.slice(1)), adv('a', qo), { color: col('return') }); }
        }
        if (o.qd > 1e-7) S.flow(c, P.dump.concat(P.dump2, P.dump3), adv('du', o.qd), { color: col('return') });
        // symbols
        S.pump(c, 90, 370, { motor: true });
        S.tank(c, 90, 416); S.tank(c, 150, 359); S.tank(c, 385, 359); S.tank(c, 475, 386); S.tank(c, 545, 410);
        unloadValve(kit, c, 150, 310, { rot: 180, open: running && unl ? 1 : 0 });
        S.check(c, 230, 250, { rot: 90, open: o.qPump > 1e-7 });
        S.accumulator(c, 300, 170, { level: clamp(oil / g.V0, 0, 1) });
        S.gauge(c, 340, 205, { frac: Math.max(0, o.pg) / 250e5, value: fbar(o.pg) });
        S.pressureValve(c, 385, 310, { kind: 'relief', rot: 180, open: o.qPump > 0 ? o.qr / o.qPump : 0 });
        S.valve(c, 475, 300, { spec: SPEC_22_NO_DOWN, state: dstate, left: 'solenoid', right: 'spring', s: 28 });
        S.throttle(c, 475, 350, { adjustable: false });
        S.flowControl(c, 493.6, 212, { compensated: true, free: 'up' });
        const v4 = S.valve(c, 500, 150, { spec: '4/3 closed', state: vstate, left: 'spring+solenoid', right: 'spring+solenoid', s: 32, labels: true });
        kit.label(c, 'Y1', v4.xl - 6, 150, { color: o.bx === 0 && cyc !== 'stop' ? C.bad : C.muted, size: 11, weight: 700, align: 'right' });
        kit.label(c, 'Y2', v4.xr + 6, 150, { color: o.bx === 2 ? C.bad : C.muted, size: 11, weight: 700, align: 'left' });
        const fillP = p => p > 20e5 ? (C.dark ? 'rgba(255,92,92,' : 'rgba(214,40,40,') + Math.min(0.45, 0.1 + p / 400e5) + ')' : null;
        const cy = S.cylinder(c, 420, 50, { len: 150, h: 36, pos: x / stroke, fillA: ext ? fillP(o.pNeed) : null, fillB: ret ? fillP(o.pNeed) : null });
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(cy.tip[0], 30, 36, 40); c.strokeRect(cy.tip[0], 30, 36, 40);
        if (V.F > 0) kit.arrow(c, cy.tip[0] + 36 + 8 + Math.min(40, V.F), 50, cy.tip[0] + 40, 50, C.warn, 2.5);
        kit.label(c, V.F.toFixed(0) + ' kN', cy.tip[0] + 18, 20, { color: C.text, size: 11, weight: 700 });
        kit.label(c, 'charging valve', 150, 392, { color: C.muted, size: 10 });
        kit.label(c, 'safety block: relief · gauge · dump', 420, 425, { color: C.muted, size: 10 });
        kit.label(c, V.V0 + ' L', 316, 160, { color: C.muted, size: 10, align: 'left' });
        kit.label(c, 'dump', 492, 300, { color: C.muted, size: 10, align: 'left' });
        let msg = '', mc = C.muted;
        if (!running) {
          if (o.pg > 1e5 && o.hasOil) { msg = V.dump ? 'stopped: the dump valve is discharging the accumulator…' : 'STOPPED, BUT STILL CHARGED: ' + fbar(o.pg) + ' of stored energy'; mc = V.dump ? C.warn : C.bad; }
          else { msg = 'stopped and discharged: lock out before any work'; mc = C.ok; }
          if (cyc === 'eret') msg = o.moving && o.Qc > 1e-7 ? 'emergency retract, powered by the accumulator' : 'emergency retract: no stored oil left';
        } else if (stalled) { msg = 'stalled: the accumulator pressure is below what the load needs'; mc = C.bad; }
        else if (cyc === 'fill') msg = 'charging the accumulator before the first stroke';
        else if (unl) msg = 'accumulator full: the pump idles, unloaded';
        else msg = 'pump charging the accumulator';
        kit.label(c, msg, 20, 20, { color: mc, size: 12, weight: 700, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ a hi-lo press */
  Hyper.sim('sys-hilo', {
    title: 'A hi-lo press circuit',
    blurb: `A 100/70 mm press cylinder is fed by a double pump on one motor: 58 L/min from the large pump and 11.6 L/min from the small one. The large pump delivers through a check valve; an unloading valve, piloted from the system side, sends its flow to tank once the pressure reaches its setting. A relief valve limits the pressure, a tandem-centre valve unloads both pumps between strokes. The platen approaches quickly, forms the work, bottoms out, and a pressure switch near the relief setting starts the return. Bars at the top compare the motor power with that of one pump giving the same approach speed.

**Try this**
- Follow one cycle on the graph: fast approach at low pressure, a sudden slowdown when the pressure passes the unloading setting, then pressing at 25 mm/s up to the relief pressure.
- Switch to one large pump: the press is faster, but the power bars show several times the motor power while pressing.
- Switch to the small pump alone: the power is low but the approach crawls — compare the cycle times.
- Set the unloading pressure to 10 bar, below what the approach needs (about 11 bar) and the return (about 25 bar): both slow to a crawl. Set it at 120 bar and the large pump works at pressure for nothing.
- Raise the forming force above what the relief allows (about 196 kN at 250 bar): the press stalls against the work.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.6, minH: 330 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'time (s)' }, y: { label: 'pressure (bar)  ·  speed (mm/s)', min: 0 }, legend: true }, 170);
      const Dp = 0.1, dr = 0.07, stroke = 0.4, xc = 0.35, xb = 0.38;
      const A1 = Math.PI * Dp * Dp / 4, A2 = A1 - Math.PI * dr * dr / 4;
      const QL = 58 / 60000, QH = 11.6 / 60000, ETA = 0.85, PN = 4e5;
      const kv = 5e5 / Math.pow(2 * (QL + QH), 2), dpv = q => kv * q * q;   // each valve path: 5 bar at the largest return flow
      let cyc = 'down', tIn = 0, cond = 0, x = 0, vstate = 1, t = 0, tPlot = 0, auto = true, peak = 0, cycT0 = 0, lastCycle = null;
      const hist = [], ph = {};
      let out = { p: 0, Q: 0, v: 0, F: 0, bx: 1, qs: 0, Qr: 0, Pin: 0, Pbig: 0, u: 0 };
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'press', label: 'Press', primary: true }, { id: 'up', label: 'Return' }, { id: 'stop', label: 'Stop' }] },
        { id: 'auto', type: 'check', label: 'Repeat the cycle', value: true },
        { id: 'mode', type: 'select', label: 'Pumps', options: [['Hi-lo: 58 + 11.6 L/min, unloading valve', 'hilo'], ['One large pump, 69.6 L/min', 'big'], ['Small pump only, 11.6 L/min', 'small']], value: 'hilo' },
        { id: 'Fw', label: 'Forming force of the work', min: 20, max: 220, step: 5, value: 120, unit: 'kN' },
        { id: 'pu', label: 'Unloading-valve setting', min: 10, max: 120, step: 5, value: 40, unit: 'bar' },
        { id: 'pr', label: 'Relief-valve setting', min: 100, max: 300, step: 5, value: 250, unit: 'bar' }
      ], (id, v) => {
        if (id === 'press') go('down');
        if (id === 'up') go('up');
        if (id === 'stop') { go('idle'); auto = false; ctl.set('auto', false); }
        if (id === 'auto') auto = !!v;
        if (id === 'mode' || id === 'pu' || id === 'pr' || id === 'Fw') peak = 0;
      });
      const ro = kit.readout(box.side, [['ph', 'Phase'], ['p', 'System pressure'], ['big', 'Large pump'], ['v', 'Platen speed'], ['F', 'Force on the work'], ['P', 'Motor power now / peak'], ['one', 'One 69.6 L/min pump at this pressure'], ['ct', 'Last cycle time']]);
      const V = ctl.values;
      function go(p) { cyc = p; tIn = 0; cond = 0; if (p === 'down') { cycT0 = t; peak = 0; } }
      const Qmax = () => (V.mode === 'small' ? QH : QL + QH);
      function Qsup(p) {
        if (V.mode === 'big') return QL + QH;
        if (V.mode === 'small') return QH;
        return QH + QL * (1 - clamp((p - (V.pu * 1e5 - 3e5)) / 3e5, 0, 1));
      }
      function Qrel(p) { const pr = V.pr * 1e5, pc = pr - 10e5; return Qmax() * clamp((p - pc) / (pr - pc), 0, 1.5); }
      function load(xx) {
        const Fw = Math.max(V.Fw * 1000, 7500);
        if (xx < xc) return 7500;
        if (xx < xb) return Math.min(Fw, 7500 + 5e7 * (xx - xc));
        return Fw + 5e8 * (xx - xb);
      }
      function solve(need) {
        const gq = Q => Q + Qrel(need(Q)) - Qsup(need(Q));
        if (gq(0) >= 0) {
          let lo = 0, hi = V.pr * 1e5 + 30e5;
          for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (Qrel(m) - Qsup(m) > 0) hi = m; else lo = m; }
          return { Q: 0, p: lo };
        }
        let lo = 0, hi = Qsup(0);
        for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (gq(m) > 0) hi = m; else lo = m; }
        return { Q: lo, p: need(lo) };
      }
      function step(dt) {
        const want = cyc === 'down' || cyc === 'dwell' ? 0 : cyc === 'up' ? 2 : 1;
        vstate += clamp(want - vstate, -dt / 0.08, dt / 0.08);
        const bx = Math.round(vstate), Fl = load(x);
        let p = PN, Q = 0, v = 0;
        if (bx === 0 && x < stroke) { const r = solve(q => (Fl + dpv(q * A2 / A1) * A2) / A1 + dpv(q)); p = r.p; Q = r.Q; v = Q / A1; }
        else if (bx === 2 && x > 0) { const r = solve(q => (5500 + dpv(q * A1 / A2) * A1) / A2 + dpv(q)); p = r.p; Q = r.Q; v = -Q / A2; }
        else if (bx !== 1) { const r = solve(() => 1e9); p = r.p; }
        x = clamp(x + v * dt, 0, stroke);
        const qs = bx === 1 ? Qmax() : Qsup(p);
        const u = V.mode === 'hilo' && bx !== 1 ? clamp(1 - (qs - QH) / QL, 0, 1) : 0;
        let Pin;
        if (bx === 1) Pin = PN * Qmax() / ETA;
        else if (V.mode === 'hilo') Pin = (p * QH + (p * (1 - u) + PN * u) * QL) / ETA;
        else Pin = p * Qmax() / ETA;
        const Pbig = (bx === 1 ? PN : p) * (QL + QH) / ETA;
        out = { p, Q, v, F: Fl, bx, qs, Qr: bx === 1 ? 0 : Math.min(Qrel(p), qs), Pin, Pbig, u };
        peak = Math.max(peak, Pin);
        tIn += dt; t += dt;
        const pr = V.pr * 1e5;
        if (cyc === 'down') { if (p >= pr - 15e5) cond += dt; else cond = 0; if (cond > 0.15 || x >= stroke - 1e-9) go('dwell'); }
        else if (cyc === 'dwell') { if (tIn > 0.6) go('up'); }
        else if (cyc === 'up') { if (x <= 1e-9) { lastCycle = t - cycT0; go('wait'); } }
        else if (cyc === 'wait') { if (auto && tIn > 1.5) go('down'); }
      }
      const loop = kit.loop((dt) => {
        const n = 10;
        for (let k = 0; k < n; k++) step(dt / n);
        const C = kit.colors(), o = out;
        const phaseName = { down: o.bx === 0 ? (x < xc ? 'fast approach' : x < xb ? 'pressing the work' : 'bottomed: pressure rising') : 'shifting', dwell: 'dwell at full pressure', up: 'return stroke', wait: 'waiting (tandem centre: pumps unloaded)', idle: 'stopped (tandem centre)' }[cyc] || cyc;
        ro.set('ph', phaseName);
        ro.set('p', fbar(o.p) + (o.Qr > 1e-7 && o.p > (V.pr - 10) * 1e5 ? '  (relief open)' : ''));
        ro.set('big', V.mode === 'small' ? 'not fitted' : V.mode === 'big' ? 'single pump, always delivering' : o.bx === 1 ? 'unloaded through the valve centre' : o.u > 0.5 ? 'unloaded to tank at a few bar' : 'delivering to the system');
        ro.set('v', (Math.abs(o.v) * 1000).toFixed(0) + ' mm/s ' + (o.v > 1e-6 ? 'down' : o.v < -1e-6 ? 'up' : ''));
        ro.set('F', x >= xc && o.bx === 0 ? (Math.min(o.F, o.p * A1) / 1000).toFixed(0) + ' kN' : '—');
        ro.set('P', fkw(o.Pin, 1) + ' / ' + fkw(peak, 1));
        ro.set('one', fkw(o.Pbig, 1));
        ro.set('ct', lastCycle == null ? '—' : lastCycle.toFixed(1) + ' s');
        tPlot += dt;
        if (tPlot > 0.1) {
          tPlot = 0; hist.push([t, o.p / 1e5, Math.abs(o.v) * 1000]); if (hist.length > 150) hist.shift();
          plot.set({ series: [{ pts: hist.map(h => [h[0], h[1]]), label: 'pressure (bar)' }, { pts: hist.map(h => [h[0], h[2]]), label: 'platen speed (mm/s)', dash: [5, 4] }],
            hlines: V.mode === 'hilo' ? [{ y: V.pu, label: 'unloading' }, { y: V.pr, label: 'relief' }] : [{ y: V.pr, label: 'relief' }] });
        }
        // ---- drawing on a 780 × 470 grid
        const c = onGrid(st, 780, 470), col = S.col;
        const hp = o.p > 20e5, moving = Math.abs(o.v) > 1e-6, down = o.bx === 0 && moving, up = o.bx === 2 && moving;
        const bigUnl = V.mode === 'hilo' && (o.u > 0.5 || o.bx === 1), hasBig = V.mode !== 'small';
        const P = {
          su1: [[110, 436], [110, 446]], su2: [[300, 436], [300, 446]],
          big: [[110, 384], [110, 288]], bigOut: [[110, 252], [110, 235]],
          unl: [[110, 300], [205, 300], [205, 311]], unlOut: [[205, 369], [205, 375]],
          small: [[300, 384], [300, 235]], pilot: [[300, 340], [232, 340]],
          header: [[110, 235], [493.6, 235], [493.6, 216]], relief: [[360, 235], [360, 256]], reliefOut: [[360, 314], [360, 324]],
          gauge: [[330, 226], [330, 235]], T: [[506.4, 216], [506.4, 226], [545, 226], [545, 420]],
          A: [[667, 28], [493.6, 28], [493.6, 164]], B: [[667, 202], [655, 202], [655, 140], [506.4, 140], [506.4, 164]]
        };
        if (hasBig) {
          S.line(c, P.su1, { state: 'suction' });
          S.line(c, P.big, { state: bigUnl ? 'return' : hp ? 'pressure' : 'idle' });
          if (V.mode === 'hilo') { S.line(c, P.unl, { state: bigUnl && o.bx !== 1 ? 'return' : 'idle' }); S.line(c, P.unlOut, { state: bigUnl && o.bx !== 1 ? 'return' : 'idle' }); }
          S.line(c, P.bigOut, { state: !bigUnl && hp ? 'pressure' : 'idle' });
        }
        S.line(c, P.su2, { state: 'suction' });
        S.line(c, P.small, { state: hp ? 'pressure' : 'idle' });
        if (V.mode === 'hilo') S.line(c, P.pilot, { state: hp ? 'pilot' : 'idle', kind: 'pilot' });
        S.line(c, P.header, { state: hp ? 'pressure' : 'idle' });
        S.line(c, P.relief, { state: hp ? 'pressure' : 'idle' }); S.line(c, P.gauge, { state: hp ? 'pressure' : 'idle' });
        S.line(c, P.reliefOut, { state: o.Qr > 1e-7 ? 'return' : 'idle' });
        S.line(c, P.T, { state: moving || o.bx === 1 ? 'return' : 'idle' });
        S.line(c, P.A, { state: down || (o.bx === 0 && hp) ? 'pressure' : up ? 'return' : 'idle' });
        S.line(c, P.B, { state: up ? 'pressure' : down ? 'return' : 'idle' });
        [[110, 235], [300, 235], [330, 235], [360, 235], [300, 340]].forEach(p => S.junction(c, p[0], p[1]));
        if (V.mode === 'hilo') S.junction(c, 110, 300);
        const adv = (key, q) => { ph[key] = (ph[key] || 0) + dt * 90 * q / 5e-4; return ph[key]; };
        if (hasBig) {
          S.flow(c, P.su1, adv('s1', QL), { color: col('suction') });
          if (bigUnl && o.bx !== 1 && V.mode === 'hilo') S.flow(c, [[110, 384], [110, 300], [205, 300], [205, 311]], adv('bu', QL), { color: col('return') });
          else S.flow(c, [[110, 384], [110, 235], [300, 235]], adv('bg', QL), { color: col(hp ? 'pressure' : 'return') });
        }
        S.flow(c, P.su2, adv('s2', QH), { color: col('suction') });
        S.flow(c, P.small, adv('sm', QH), { color: col(hp ? 'pressure' : 'return') });
        const qSys = o.bx === 1 ? Qmax() : o.Q;
        if (qSys > 1e-7) S.flow(c, [[300, 235], [493.6, 235], [493.6, 216]], adv('hd', qSys), { color: col(hp ? 'pressure' : 'return') });
        if (o.Qr > 1e-7) S.flow(c, P.relief.concat(P.reliefOut), adv('rv', o.Qr), { color: col('pressure') });
        if (o.bx === 1) S.flow(c, P.T, adv('tt', Qmax()), { color: col('return') });
        if (down) { S.flow(c, P.A.slice().reverse(), adv('a', o.Q), { color: col('pressure') }); S.flow(c, P.B.concat(P.T.slice(1)), adv('b', o.Q * A2 / A1), { color: col('return') }); }
        if (up) { S.flow(c, P.B.slice().reverse(), adv('b', o.Q), { color: col('pressure') }); S.flow(c, P.A.concat([[506.4, 216]], P.T.slice(1)), adv('a', o.Q * A1 / A2), { color: col('return') }); }
        // symbols
        if (hasBig) {
          S.pump(c, 110, 410, { motor: true }); S.tank(c, 110, 456);
          S.check(c, 110, 270, { open: !bigUnl && moving });
          seg(c, [[126, 407.5], [272, 407.5]], C.text, 1.4); seg(c, [[126, 412.5], [272, 412.5]], C.text, 1.4);
          S.pump(c, 300, 410, {});
        } else S.pump(c, 300, 410, { motor: true });
        S.tank(c, 300, 456);
        if (V.mode === 'hilo') { unloadValve(kit, c, 205, 340, { rot: 180, open: bigUnl && o.bx !== 1 ? 1 : 0 }); S.tank(c, 205, 385); }
        S.pressureValve(c, 360, 285, { kind: 'relief', rot: 180, open: o.qs > 0 ? clamp(o.Qr / o.qs, 0, 1) : 0 }); S.tank(c, 360, 334);
        S.gauge(c, 330, 205, { frac: o.p / 350e5, value: fbar(o.p) });
        const v4 = S.valve(c, 500, 190, { spec: '4/3 tandem', state: vstate, left: 'spring+solenoid', right: 'spring+solenoid', s: 32, labels: true });
        kit.label(c, 'Y1', v4.xl - 6, 190, { color: o.bx === 0 ? C.bad : C.muted, size: 11, weight: 700, align: 'right' });
        kit.label(c, 'Y2', v4.xr + 6, 190, { color: o.bx === 2 ? C.bad : C.muted, size: 11, weight: 700, align: 'left' });
        S.tank(c, 545, 430);
        const fillP = pp => pp > 20e5 ? (C.dark ? 'rgba(255,92,92,' : 'rgba(214,40,40,') + Math.min(0.45, 0.1 + pp / 400e5) + ')' : null;
        const cy = S.cylinder(c, 700, 20, { len: 190, h: 46, pos: x / stroke, rot: 90, fillA: o.bx === 0 ? fillP(o.p) : null, fillB: o.bx === 2 ? fillP(o.p) : null });
        const tipY = cy.tip[1], restTop = 20 + 191.5 + 175 * (xc / stroke) + 12, tableY = restTop + 22;
        const wTop = Math.max(restTop, tipY + 12);
        c.fillStyle = kit.hue(30, 0.5); c.fillRect(665, wTop, 70, tableY - wTop); c.strokeStyle = C.text; c.lineWidth = 1.2; c.strokeRect(665, wTop, 70, tableY - wTop);
        c.fillStyle = C.surface; c.fillRect(655, tipY, 90, 12); c.strokeRect(655, tipY, 90, 12);
        c.fillStyle = C.muted; c.fillRect(640, tableY, 120, 10);
        kit.label(c, 'work', 700, (wTop + tableY) / 2, { color: C.text, size: 10, weight: 700 });
        kit.label(c, 'large pump', 130, 452, { color: C.muted, size: 10, align: 'left' });
        kit.label(c, 'small pump', 320, 452, { color: C.muted, size: 10, align: 'left' });
        if (V.mode === 'hilo') kit.label(c, 'unloading ' + V.pu + ' bar', 238, 368, { color: C.muted, size: 10, align: 'left' });
        kit.label(c, 'relief ' + V.pr + ' bar', 384, 300, { color: C.muted, size: 10, align: 'left' });
        // power bars
        const bars = [['this circuit, now', o.Pin, C.accent], ['peak this cycle', peak, C.warn], ['one big pump, same pressure', o.Pbig, C.bad]];
        kit.label(c, 'Motor power (85 % efficiency)', 20, 52, { color: C.text, size: 12, weight: 700, align: 'left' });
        bars.forEach((b, i) => {
          const y = 66 + i * 26, wv = clamp(b[1] / 45000, 0, 1) * 200;
          kit.label(c, b[0], 20, y + 8, { color: C.muted, size: 10, align: 'left' });
          c.fillStyle = C.bg2 || C.surface; c.fillRect(190, y, 200, 16);
          c.fillStyle = b[2]; c.fillRect(190, y, wv, 16);
          kit.label(c, (b[1] / 1000).toFixed(1) + ' kW', 398, y + 8, { color: C.text, size: 11, weight: 700, align: 'left' });
        });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ fixed, open-centre, pressure-compensated, load-sensing */
  Hyper.sim('sys-energy', {
    title: 'Where the power goes: four ways to supply a load',
    blurb: `One work cycle — a fast light move, a slow heavy one, a medium one and some waiting — served by four supplies: a fixed pump with a closed-centre valve and a relief valve, a fixed pump with an open-centre valve, a pressure-compensated variable pump, and a load-sensing pump. On the left, the pressure–flow diagram of the supply you choose: the pump's rectangle p × Q is the power it delivers, the green rectangles are the power the loads use, everything else is heat. On the right, the power of all four at this moment, and their efficiency over the last cycle. The plot shows the pump power through the cycle.

**Try this**
- Watch the fixed pump with the relief valve: its rectangle never changes — full pressure, full flow, all the time. Its cycle efficiency is dismal.
- The open centre wastes little while waiting, but while metering it pushes its surplus flow through the centre at the load pressure.
- The pressure-compensated pump cuts the flow but not the pressure: the loss is the strip between the load pressure and the setting.
- Load sensing keeps a thin strip of margin above the load. Now tick the second, light function: the pump must serve the heavy load, and the light one is throttled from its pressure — the diagram shows the loss.
- Choose the manual load and put 180 bar on it: with a load near the setting all the variable supplies look alike. At 40 bar they differ most.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 300 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'time in the cycle (s)', min: 0, max: 16 }, y: { label: 'pump power (kW)', min: 0 }, legend: true }, 190);
      const SYS = [
        { id: 'fixed', name: 'Fixed pump + relief, closed centre', short: 'fixed pump + relief' },
        { id: 'open', name: 'Fixed pump, open centre', short: 'open centre' },
        { id: 'pc', name: 'Pressure-compensated pump', short: 'pressure-compensated' },
        { id: 'ls', name: 'Load-sensing pump', short: 'load sensing' }
      ];
      const P0 = Object.assign({ show: 'ls' }, params || {});
      let tc = 0;
      const E = {}, lastEff = {}, trace = {};
      const ctl = kit.controls(box.side, [
        { id: 'show', type: 'select', label: 'Pressure–flow diagram for', options: SYS.map(s => [s.name, s.id]), value: SYS.some(s => s.id === P0.show) ? P0.show : 'ls' },
        { id: 'load', type: 'select', label: 'Load', options: [['A work cycle (16 s)', 'cycle'], ['Hold the sliders below', 'manual']], value: 'cycle' },
        { id: 'two', type: 'check', label: 'A second, light function (40 bar, 25 L/min) runs with the heavy ones', value: false },
        { id: 'pL', label: 'Manual load pressure', min: 0, max: 200, step: 5, value: 100, unit: 'bar' },
        { id: 'QL', label: 'Manual load flow', min: 0, max: 100, step: 1, value: 40, unit: 'L/min' },
        { id: 'Qmax', label: 'Pump maximum flow', min: 40, max: 120, step: 5, value: 80, unit: 'L/min' },
        { id: 'pr', label: 'Relief / compensator setting', min: 190, max: 300, step: 5, value: 210, unit: 'bar' },
        { id: 'dls', label: 'Load-sensing margin', min: 10, max: 40, step: 1, value: 20, unit: 'bar' },
        { id: 'dn', label: 'Open-centre pressure drop', min: 3, max: 20, step: 1, value: 8, unit: 'bar' }
      ], (id) => { if (id !== 'show') resetCycle(); });
      const ro = kit.readout(box.side, [['pp', 'Pump pressure / flow'], ['pin', 'Pump power'], ['use', 'Useful power'], ['loss', 'Loss, turned into heat'], ['eta', 'Efficiency now'], ['cyc', 'Efficiency over the last cycle']]);
      const V = ctl.values;
      const LEAK = 2 / 60000;
      const SEG = [[0, 2, null], [2, 5, [50, 60]], [5, 7, null], [7, 10, [180, 15]], [10, 13, [110, 40]], [13, 16, null]];
      function resetCycle() { tc = 0; for (const s of SYS) { E[s.id] = { in: 0, use: 0 }; lastEff[s.id] = null; trace[s.id] = []; } trace.use = []; }
      resetCycle();
      function loads(tt) {
        if (V.load === 'manual') return V.QL > 0 ? [{ p: V.pL * 1e5, Q: V.QL / 60000 }] : [];
        const L = [];
        for (const s of SEG) if (s[2] && tt >= s[0] && tt < s[1]) { const r = clamp(Math.min(tt - s[0], s[1] - tt) / 0.3, 0, 1); L.push({ p: s[2][0] * 1e5, Q: s[2][1] / 60000 * r }); }
        if (V.two && tt >= 7 && tt < 13) { const r = clamp(Math.min(tt - 7, 13 - tt) / 0.3, 0, 1); L.push({ p: 40e5, Q: 25 / 60000 * r }); }
        return L;
      }
      function evaluate(id, L) {
        const Qmax = V.Qmax / 60000, pr = V.pr * 1e5;
        let Qsum = L.reduce((a, l) => a + l.Q, 0);
        const scale = Qsum > Qmax ? Qmax / Qsum : 1;
        const fl = L.map(l => ({ p: Math.min(l.p, pr), Q: l.Q * scale }));
        Qsum *= scale;
        const pmax = fl.reduce((a, l) => Math.max(a, l.p), 0), useful = fl.reduce((a, l) => a + l.p * l.Q, 0);
        let pP, QP;
        if (id === 'fixed') { pP = pr; QP = Qmax; }
        else if (id === 'open') { pP = Qsum > 1e-9 ? Math.min(pr, Math.max(pmax + 5e5, V.dn * 1e5)) : V.dn * 1e5; QP = Qmax; }
        else if (id === 'pc') { pP = pr; QP = Math.min(Qmax, Qsum + LEAK); }
        else { pP = Qsum > 1e-9 ? Math.min(pr, pmax + V.dls * 1e5) : V.dls * 1e5; QP = Math.min(Qmax, Qsum + LEAK); }
        const Pin = pP * QP;
        return { pP, QP, useful, Pin, loss: Math.max(0, Pin - useful), fl, Qsum };
      }
      let acc = 0;
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        tc += dt;
        if (tc >= 16) {
          tc -= 16;
          for (const s of SYS) { lastEff[s.id] = E[s.id].in > 0 ? E[s.id].use / E[s.id].in : null; E[s.id] = { in: 0, use: 0 }; trace[s.id] = []; }
          trace.use = [];
        }
        const L = loads(tc), R = {};
        for (const s of SYS) { R[s.id] = evaluate(s.id, L); E[s.id].in += R[s.id].Pin * dt; E[s.id].use += R[s.id].useful * dt; }
        acc += dt;
        if (acc > 0.1) {
          acc = 0;
          for (const s of SYS) trace[s.id].push([tc, R[s.id].Pin / 1000]);
          trace.use.push([tc, R.ls.useful / 1000]);
          plot.set({ series: SYS.map(s => ({ pts: trace[s.id].slice(), label: s.short, width: s.id === V.show ? 2.6 : 1.3 })).concat([{ pts: trace.use.slice(), label: 'useful', dash: [5, 4] }]) });
        }
        const r = R[V.show];
        ro.set('pp', fbar(r.pP) + ' / ' + flpm(r.QP));
        ro.set('pin', fkw(r.Pin, 1));
        ro.set('use', fkw(r.useful, 1));
        ro.set('loss', fkw(r.loss, 1));
        ro.set('eta', r.Pin > 1 ? (100 * r.useful / r.Pin).toFixed(0) + ' %' : '—');
        ro.set('cyc', V.load === 'manual' ? '— (manual load)' : lastEff[V.show] == null ? 'after the first cycle' : (100 * lastEff[V.show]).toFixed(0) + ' %');
        // ---- drawing on a 780 × 390 grid
        const c = onGrid(st, 780, 390);
        const x0 = 64, x1 = 400, y0 = 34, y1 = 330, Qm = V.Qmax * 1.12, pm = V.pr * 1.12;
        const X = q => x0 + (q * 60000) / Qm * (x1 - x0), Y = p => y1 - (p / 1e5) / pm * (y1 - y0);
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (let q = 0; q <= Qm; q += 20) { c.beginPath(); c.moveTo(X(q / 60000), y0); c.lineTo(X(q / 60000), y1); c.stroke(); kit.label(c, String(q), X(q / 60000), y1 + 12, { color: C.muted, size: 10 }); }
        for (let p = 0; p <= pm; p += 50) { c.beginPath(); c.moveTo(x0, Y(p * 1e5)); c.lineTo(x1, Y(p * 1e5)); c.stroke(); kit.label(c, String(p), x0 - 6, Y(p * 1e5), { color: C.muted, size: 10, align: 'right' }); }
        seg(c, [[x0, y0], [x0, y1], [x1, y1]], C.axis || C.text, 1.4);
        kit.label(c, 'flow (L/min)', (x0 + x1) / 2, y1 + 28, { color: C.muted, size: 11 });
        kit.label(c, 'bar', x0 - 30, y0 - 12, { color: C.muted, size: 11 });
        // the pump's rectangle: all of it is power delivered
        c.fillStyle = C.dark ? 'rgba(229,72,77,.22)' : 'rgba(214,40,40,.16)';
        c.fillRect(X(0), Y(r.pP), X(r.QP) - X(0), Y(0) - Y(r.pP));
        c.strokeStyle = C.bad; c.lineWidth = 2; c.strokeRect(X(0), Y(r.pP), X(r.QP) - X(0), Y(0) - Y(r.pP));
        // the loads' rectangles: the useful part
        let q0 = 0;
        for (const f of r.fl) {
          c.fillStyle = C.dark ? 'rgba(34,179,122,.55)' : 'rgba(18,146,90,.45)';
          c.fillRect(X(q0), Y(f.p), X(q0 + f.Q) - X(q0), Y(0) - Y(f.p));
          c.strokeStyle = C.ok; c.lineWidth = 1.4; c.strokeRect(X(q0), Y(f.p), X(q0 + f.Q) - X(q0), Y(0) - Y(f.p));
          if (X(q0 + f.Q) - X(q0) > 36) kit.label(c, 'useful', (X(q0) + X(q0 + f.Q)) / 2, (Y(f.p) + Y(0)) / 2, { color: C.text, size: 10, weight: 700 });
          q0 += f.Q;
        }
        kit.label(c, 'pump: ' + (r.pP / 1e5).toFixed(0) + ' bar × ' + (r.QP * 60000).toFixed(0) + ' L/min = ' + (r.Pin / 1000).toFixed(1) + ' kW', x0 + 4, y0 - 12, { color: C.bad, size: 11, weight: 700, align: 'left' });
        if ((V.show === 'fixed' || V.show === 'open') && r.QP - r.Qsum > 1e-6 && X(r.QP) - X(r.Qsum) > 60)
          kit.label(c, V.show === 'fixed' ? 'surplus over the relief' : 'through the open centre', (X(r.Qsum) + X(r.QP)) / 2, Math.max(y0 + 14, (Y(r.pP) + Y(0)) / 2), { color: C.bad, size: 10, weight: 700 });
        if (r.fl.length && r.pP - r.fl[0].p > 8e5 && X(r.Qsum) - X(0) > 50)
          kit.label(c, 'throttled', (X(0) + X(r.Qsum)) / 2, (Y(r.pP) + Y(r.fl.reduce((a, f) => Math.max(a, f.p), 0))) / 2, { color: C.bad, size: 10 });
        // bars for all four
        const bx0 = 450, bw = 290, scale = V.pr * 1e5 * V.Qmax / 60000;
        kit.label(c, 'pump power now: useful + heat', bx0, 24, { color: C.text, size: 12, weight: 700, align: 'left' });
        SYS.forEach((s, i) => {
          const y = 48 + i * 82, R1 = R[s.id], wu = clamp(R1.useful / scale, 0, 1) * bw, wl = clamp(R1.loss / scale, 0, 1) * bw;
          kit.label(c, s.name, bx0, y, { color: s.id === V.show ? C.accent : C.text, size: 11, weight: 700, align: 'left' });
          c.fillStyle = C.bg2 || C.surface; c.fillRect(bx0, y + 10, bw, 18);
          c.fillStyle = C.ok; c.fillRect(bx0, y + 10, wu, 18);
          c.fillStyle = C.bad; c.fillRect(bx0 + wu, y + 10, Math.min(wl, bw - wu), 18);
          if (s.id === V.show) { c.strokeStyle = C.accent; c.lineWidth = 2; c.strokeRect(bx0 - 2, y + 8, bw + 4, 22); }
          const eff = R1.Pin > 1 ? (100 * R1.useful / R1.Pin).toFixed(0) + ' %' : '—';
          kit.label(c, (R1.Pin / 1000).toFixed(1) + ' kW in · ' + (R1.loss / 1000).toFixed(1) + ' kW heat · η ' + eff, bx0, y + 42, { color: C.muted, size: 10, align: 'left' });
          kit.label(c, 'last cycle: ' + (V.load === 'manual' || lastEff[s.id] == null ? '—' : (100 * lastEff[s.id]).toFixed(0) + ' %'), bx0 + bw, y + 42, { color: C.text, size: 10, weight: 700, align: 'right' });
        });
        const phase = V.load === 'manual' ? 'manual load' : L.length ? L.map(l => (l.p / 1e5).toFixed(0) + ' bar').join(' + ') : 'waiting';
        kit.label(c, (V.load === 'manual' ? '' : 't = ' + tc.toFixed(1) + ' s  ·  ') + phase, bx0, 380, { color: C.muted, size: 11, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ braking a motor with inertia */
  Hyper.sim('sys-motor-brake', {
    title: 'Stopping a motor with inertia: crossover relief valves',
    blurb: `A 200 cm³/rev motor drives a flywheel from a 40 L/min pump through a 4/3 valve. When the valve centres, the flywheel keeps turning the motor, which now pumps oil from one line into the other. A dynamic model with the compressibility of the oil in each line (1.5 L, effective bulk modulus 0.8 GPa including hose swelling) shows what happens: with crossover relief valves the outlet pressure is capped and the flywheel stops at a steady deceleration; without them the pressure spikes and the drive rocks. Make-up check valves refill the low-pressure line from the return, which has 1 bar of back-pressure. Lines: **red** high pressure, **blue** low pressure and return, **orange** a cavitating line.

**Try this**
- Watch a stop with the crossover valves at 120 bar: line B holds the setting, the speed falls in a straight line, and the read-outs give the stopping time, the angle and the heat made.
- Untick the crossover valves: the pressure spikes to several hundred bar and the flywheel rocks back and forth before it settles.
- Untick the make-up checks as well as the crossovers: the inlet line empties to vapour pressure — cavitation — while the outlet spikes.
- Lower the crossover setting to 60 bar: a gentler, longer stop. Raise the inertia: longer again, with the same peak pressure.
- Choose the float centre: both lines open to tank, and the flywheel coasts, stopped only by friction.`,
    mount(box, kit) {
      const S = kit.fsym;
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 320 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'time (s)' }, y: { label: 'pressure (bar)  ·  speed (rpm)' }, legend: true }, 180);
      const Vg = 200e-6, Dm = Vg / (2 * Math.PI), Qp = 40 / 60000, VL = 1.5e-3, KB = 0.8e9 / VL;
      const K = Qp / Math.sqrt(5e5), PV = -0.95e5, PRET = 1e5, PR = 180e5;
      const GR = Qp / 10e5, GC = Qp / 10e5, GM = Qp / 1e5, KIL = 2e-12, KD = 5e-13;
      let cmd = 1, auto = true, tIn = 0, seqI = 0, vstate = 1, w = 0, th = 0, t = 0, tPlot = 0, heat = 0;
      const A = { p: 0, v: 0 }, B = { p: 0, v: 0 };
      let stop = null, lastStop = null;
      const hist = [], ph = {};
      let out = { pP: 0, qPA: 0, qPB: 0, qAT: 0, qBT: 0, qAB: 0, qBA: 0, qTA: 0, qTB: 0, qRel: 0, bx: 1 };
      const SEQ = [[1, 4], [0, 3.5], [-1, 4], [0, 3.5]];
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'fwd', label: 'Forward (Y1)' }, { id: 'stop', label: 'Stop' }, { id: 'rev', label: 'Reverse (Y2)' }] },
        { id: 'auto', type: 'check', label: 'Cycle automatically', value: true },
        { id: 'centre', type: 'select', label: 'Valve centre', options: [['Closed centre', 'closed'], ['Float centre (A and B to tank)', 'float']], value: 'closed' },
        { id: 'cross', type: 'check', label: 'Crossover relief valves', value: true },
        { id: 'pc', label: 'Crossover setting', min: 40, max: 250, step: 5, value: 120, unit: 'bar' },
        { id: 'makeup', type: 'check', label: 'Make-up (anti-cavitation) check valves', value: true },
        { id: 'J', label: 'Inertia at the motor shaft', min: 2, max: 100, value: 20, unit: 'kg·m²', log: true, sig: 2 }
      ], (id, v) => {
        if (id === 'fwd' || id === 'stop' || id === 'rev') { auto = false; ctl.set('auto', false); setCmd(id === 'fwd' ? 1 : id === 'rev' ? -1 : 0); }
        if (id === 'auto') { auto = !!v; tIn = 0; }
      });
      const ro = kit.readout(box.side, [['w', 'Motor speed'], ['p', 'Line A / line B'], ['T', 'Torque from the oil'], ['stop', 'Last stop: time / turns'], ['pk', 'Peak pressure in the last stop'], ['heat', 'Heat in the crossover valves (last stop)'], ['cav', 'Cavitation']]);
      const V = ctl.values;
      function setCmd(k) {
        if (k === 0 && cmd !== 0) stop = { t0: t, w0: w, heat0: heat, peak: 0, path: 0, last: null, tFirst: null, wBack: 0, done: false };
        if (k !== 0) stop = null;
        cmd = k; tIn = 0;
      }
      const Qv = dp => { const a = Math.abs(dp); return a < 1e5 ? K * dp / Math.sqrt(1e5) : K * Math.sign(dp) * Math.sqrt(a); };
      const reliefQ = p => GR * Math.max(0, p - (PR - 10e5));
      function lineStep(L, dV) {
        if (L.v > 0) { L.v -= dV; if (L.v < 0) { L.p = PV + KB * (-L.v); L.v = 0; } else L.p = PV; return; }
        L.p += KB * dV;
        if (L.p < PV) { L.v = (PV - L.p) / KB; L.p = PV; }
        if (L.p > 2000e5) L.p = 2000e5;
      }
      function step(dt) {
        const target = cmd === 1 ? 0 : cmd === -1 ? 2 : 1;
        vstate += clamp(target - vstate, -dt / 0.06, dt / 0.06);
        const bx = Math.round(vstate);
        let pP, qPA = 0, qPB = 0, qAT = 0, qBT = 0;
        if (bx === 0 || bx === 2) {
          const pX = bx === 0 ? A.p : B.p;
          let lo = pX - 2e5, hi = PR + 40e5;
          for (let k = 0; k < 32; k++) { const m = (lo + hi) / 2; if (Qv(m - pX) + reliefQ(m) > Qp) hi = m; else lo = m; }
          pP = (lo + hi) / 2;
          if (bx === 0) { qPA = Qv(pP - A.p); qBT = Qv(B.p); } else { qPB = Qv(pP - B.p); qAT = Qv(A.p); }
        } else {
          pP = PR - 10e5 + Qp / GR;
          if (V.centre === 'float') { qAT = Qv(A.p); qBT = Qv(B.p); }
        }
        const qRel = Math.max(0, Qp - qPA - qPB);
        let qAB = 0, qBA = 0, qTA = 0, qTB = 0;
        if (V.cross) { const crack = V.pc * 1e5 - 5e5; qAB = GC * Math.max(0, A.p - B.p - crack); qBA = GC * Math.max(0, B.p - A.p - crack); }
        if (V.makeup) { qTA = GM * Math.max(0, PRET - 0.3e5 - A.p); qTB = GM * Math.max(0, PRET - 0.3e5 - B.p); }
        const dp = A.p - B.p;
        const Tm = Dm * dp, Tf = (15 + 0.04 * Dm * Math.abs(dp)) * Math.tanh(w / 0.3) + 1.0 * w;
        w += (Tm - Tf) / V.J * dt;                                   // semi-implicit: speed first, then the lines
        const qm = Dm * w, qil = KIL * dp, qdA = KD * Math.max(0, A.p), qdB = KD * Math.max(0, B.p);
        lineStep(A, (qPA - qAT + qTA - qm - qil - qdA + qBA - qAB) * dt);
        lineStep(B, (qPB - qBT + qTB + qm + qil - qdB + qAB - qBA) * dt);
        th += w * dt; t += dt;
        heat += (qAB + qBA) * Math.abs(dp) * dt;
        if (stop && !stop.done) {
          // at rest once the speed has stayed below about 1 rpm for 0.4 s (a drive without crossovers rocks first)
          stop.peak = Math.max(stop.peak, A.p, B.p);
          if (stop.tFirst == null) {
            stop.path += Math.abs(w) * dt;
            if (Math.abs(w) < 0.05 || w * stop.w0 < 0) { stop.tFirst = t; stop.wBack = 0; }
          } else stop.wBack = Math.max(stop.wBack, Math.abs(w));
          if (Math.abs(w) >= 0.1 || stop.last == null) stop.last = t;
          if (t - stop.last > 0.4 || t - stop.t0 > 30) {
            stop.done = true;
            lastStop = { time: stop.tFirst == null ? null : stop.tFirst - stop.t0, turns: stop.path / (2 * Math.PI), rocks: (stop.wBack || 0) > 0.1 * Math.abs(stop.w0), peak: stop.peak, heat: heat - stop.heat0 };
          }
        }
        out = { pP, qPA, qPB, qAT, qBT, qAB, qBA, qTA, qTB, qRel, bx };
      }
      const loop = kit.loop((dt) => {
        const n = Math.min(600, Math.max(1, Math.ceil(dt / 1e-4)));
        for (let k = 0; k < n; k++) step(dt / n);
        if (auto) { tIn += dt; if (tIn > SEQ[seqI][1]) { seqI = (seqI + 1) % SEQ.length; setCmd(SEQ[seqI][0]); } }
        const C = kit.colors(), o = out, rpm = w * 60 / (2 * Math.PI), cav = A.v > 1e-7 || B.v > 1e-7;
        ro.set('w', rpm.toFixed(0) + ' rpm');
        ro.set('p', fbar(A.p) + ' / ' + fbar(B.p));
        ro.set('T', (Dm * (A.p - B.p)).toFixed(0) + ' N·m');
        ro.set('stop', lastStop ? (lastStop.time == null ? 'still turning' : lastStop.time.toFixed(2) + ' s') + ' / ' + lastStop.turns.toFixed(2) + ' rev' + (lastStop.rocks ? ', then rocks back' : '') : '—');
        ro.set('pk', lastStop ? fbar(lastStop.peak) : '—');
        ro.set('heat', lastStop ? (lastStop.heat / 1000).toFixed(2) + ' kJ' : '—');
        ro.set('cav', cav ? 'yes: line ' + (A.v > 1e-7 ? 'A' : 'B') + ' at vapour pressure' : 'no');
        tPlot += dt;
        if (tPlot > 0.04) {
          tPlot = 0; hist.push([t, A.p / 1e5, B.p / 1e5, rpm]); if (hist.length > 300) hist.shift();
          plot.set({ series: [{ pts: hist.map(h => [h[0], h[1]]), label: 'line A (bar)' }, { pts: hist.map(h => [h[0], h[2]]), label: 'line B (bar)' }, { pts: hist.map(h => [h[0], h[3]]), label: 'speed (rpm)', dash: [5, 4] }],
            hlines: V.cross ? [{ y: V.pc, label: 'crossover' }] : [] });
        }
        // ---- drawing on a 780 × 450 grid
        const c = onGrid(st, 780, 450), col = S.col;
        const lineState = (L, flowing) => L.v > 1e-7 ? null : L.p > 20e5 ? 'pressure' : flowing ? 'return' : 'idle';
        const cavCol = C.warn;
        const P = {
          su: [[120, 411], [120, 421]], header: [[120, 359], [120, 340], [243.6, 340], [243.6, 316]],
          relief: [[185, 340], [185, 351]], reliefOut: [[185, 409], [185, 419]],
          T: [[256.4, 316], [256.4, 326], [300, 326], [300, 410]],
          A: [[243.6, 264], [243.6, 90], [560, 90], [560, 124]], B: [[256.4, 264], [256.4, 220], [560, 220], [560, 176]],
          rv1a: [[310, 90], [310, 126]], rv1b: [[310, 184], [310, 220]], rv2a: [[390, 126], [390, 90]], rv2b: [[390, 220], [390, 184]],
          muA: [[450, 107], [450, 90]], muB: [[500, 203], [500, 220]], feed: [[450, 143], [450, 155], [500, 155], [500, 167]], feedT: [[475, 155], [475, 162]],
          gA: [[280, 81], [280, 90]], gB: [[280, 216], [280, 220]]
        };
        const moving = Math.abs(w) > 0.05;
        S.line(c, P.su, { state: 'suction' });
        S.line(c, P.header, { state: o.pP > 20e5 ? 'pressure' : 'idle' });
        S.line(c, P.relief, { state: o.pP > 20e5 ? 'pressure' : 'idle' });
        S.line(c, P.reliefOut, { state: o.qRel > 1e-7 ? 'return' : 'idle' });
        S.line(c, P.T, { state: o.qAT > 1e-7 || o.qBT > 1e-7 ? 'return' : 'idle' });
        const sA = lineState(A, moving), sB = lineState(B, moving);
        for (const k of ['A', 'rv1a', 'rv2a', 'muA', 'gA']) S.line(c, P[k], sA ? { state: sA } : { color: cavCol, width: 2.4 });
        for (const k of ['B', 'rv1b', 'rv2b', 'muB', 'gB']) S.line(c, P[k], sB ? { state: sB } : { color: cavCol, width: 2.4 });
        S.line(c, P.feed, { state: o.qTA + o.qTB > 1e-7 ? 'return' : 'idle' }); S.line(c, P.feedT, { state: o.qTA + o.qTB > 1e-7 ? 'return' : 'idle' });
        [[185, 340], [310, 90], [390, 90], [450, 90], [280, 90], [310, 220], [390, 220], [500, 220], [280, 220], [475, 155]].forEach(p => S.junction(c, p[0], p[1]));
        const adv = (key, q) => { ph[key] = (ph[key] || 0) + dt * 90 * q / 5e-4; return ph[key]; };
        S.flow(c, P.su, adv('su', Qp), { color: col('suction') });
        S.flow(c, [[120, 359], [120, 340], [185, 340]], adv('hd', Qp), { color: col('pressure') });
        if (o.qRel > 1e-7) S.flow(c, P.relief.concat(P.reliefOut), adv('rl', o.qRel), { color: col('pressure') });
        const qm = Dm * w;
        if (Math.abs(qm) > 1e-6) {
          S.flow(c, [[243.6, 90], [560, 90], [560, 124]], adv('ma', qm), { color: col(sA || 'return') });
          S.flow(c, [[560, 176], [560, 220], [256.4, 220]], adv('mb', qm), { color: col(sB || 'return') });
        }
        if (o.qAB > 1e-7) S.flow(c, P.rv1a.concat(P.rv1b), adv('x1', o.qAB), { color: col('pressure') });
        if (o.qBA > 1e-7) S.flow(c, P.rv2b.concat(P.rv2a), adv('x2', o.qBA), { color: col('pressure') });
        if (o.qTA > 1e-7) S.flow(c, [[475, 162], [475, 155], [450, 155], [450, 143]], adv('ta', o.qTA), { color: col('return') });
        if (o.qTB > 1e-7) S.flow(c, [[475, 162], [475, 155], [500, 155], [500, 167]], adv('tb', o.qTB), { color: col('return') });
        // bubbles in a cavitating line
        c.strokeStyle = cavCol; c.lineWidth = 1.2;
        for (const [L, y] of [[A, 90], [B, 220]]) if (L.v > 1e-7) for (let i = 0; i < 9; i++) { const bx = 330 + ((i * 47 + t * 30) % 220); c.beginPath(); c.arc(bx, y - 6 + (i % 3) * 5, 2.5, 0, Math.PI * 2); c.stroke(); }
        // symbols
        S.pump(c, 120, 385, { motor: true }); S.tank(c, 120, 431);
        S.pressureValve(c, 185, 380, { kind: 'relief', rot: 180, open: clamp(o.qRel / Qp, 0, 1) }); S.tank(c, 185, 429);
        S.tank(c, 300, 420);
        const v4 = S.valve(c, 250, 290, { spec: V.centre === 'float' ? '4/3 float' : '4/3 closed', state: vstate, left: 'spring+solenoid', right: 'spring+solenoid', s: 32, labels: true });
        kit.label(c, 'Y1', v4.xl - 6, 290, { color: cmd === 1 ? C.bad : C.muted, size: 11, weight: 700, align: 'right' });
        kit.label(c, 'Y2', v4.xr + 6, 290, { color: cmd === -1 ? C.bad : C.muted, size: 11, weight: 700, align: 'left' });
        if (V.cross) {
          S.pressureValve(c, 310, 155, { kind: 'relief', rot: 180, open: clamp(o.qAB / Qp, 0, 1) });
          S.pressureValve(c, 390, 155, { kind: 'relief', open: clamp(o.qBA / Qp, 0, 1) });
          kit.label(c, 'crossover ' + V.pc + ' bar', 350, 240, { color: C.muted, size: 10 });
        } else kit.label(c, 'no crossover valves', 350, 155, { color: C.bad, size: 11, weight: 700 });
        if (V.makeup) {
          S.check(c, 450, 125, { open: o.qTA > 1e-7 }); S.check(c, 500, 185, { rot: 180, open: o.qTB > 1e-7 });
          S.tank(c, 475, 172);
          kit.label(c, 'make-up', 475, 200, { color: C.muted, size: 10 });
        }
        S.gauge(c, 280, 60, { frac: Math.max(0, A.p) / 400e5, value: 'A ' + fbar(A.p) });
        S.gauge(c, 280, 195, { frac: Math.max(0, B.p) / 400e5, value: 'B ' + fbar(B.p) });
        S.motor(c, 560, 150, { bidir: true });
        seg(c, [[588, 147.5], [606, 147.5]], C.text, 1.4); seg(c, [[588, 152.5], [606, 152.5]], C.text, 1.4);
        const fx = 660, fy = 150, fr = 50;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2.2; c.beginPath(); c.arc(fx, fy, fr, 0, Math.PI * 2); c.fill(); c.stroke();
        for (let i = 0; i < 4; i++) { const a = th + i * Math.PI / 2; seg(c, [[fx + 8 * Math.cos(a), fy + 8 * Math.sin(a)], [fx + (fr - 6) * Math.cos(a), fy + (fr - 6) * Math.sin(a)]], C.text, 2); }
        c.fillStyle = C.accent; c.beginPath(); c.arc(fx + (fr - 12) * Math.cos(th), fy + (fr - 12) * Math.sin(th), 5, 0, Math.PI * 2); c.fill();
        kit.label(c, 'J = ' + V.J.toFixed(V.J < 10 ? 1 : 0) + ' kg·m²', fx, fy + fr + 16, { color: C.text, size: 11, weight: 700 });
        kit.label(c, rpm.toFixed(0) + ' rpm', fx, fy - fr - 12, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'A', 236, 80, { color: C.muted, size: 11, align: 'right' });
        kit.label(c, 'B', 248, 230, { color: C.muted, size: 11, align: 'right' });
        const msg = cmd !== 0 ? (cmd === 1 ? 'driving forward' : 'driving in reverse')
          : Math.abs(w) > 0.1 ? (V.centre === 'float' ? 'coasting: both lines open to tank' : V.cross && (o.qAB > 1e-7 || o.qBA > 1e-7) ? 'braking at the crossover setting' : 'braking against trapped oil') : 'stopped';
        kit.label(c, msg + (cav ? ' — cavitation!' : ''), 20, 20, { color: cav ? C.bad : C.text, size: 12, weight: 700, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ heat balance through a shift */
  Hyper.sim('sys-heat', {
    title: 'Heat balance: oil temperature through a shift',
    blurb: `A power unit turns part of its input power into heat in the oil. The oil and the steel of the tank warm up; the tank walls shed heat in proportion to the temperature above ambient (P = kA ΔT), and an air-oil cooler, if fitted, removes P₀₁ × (oil − air) once its thermostatic bypass lets the oil through. The graph runs a whole 8-hour shift in about 48 seconds. The tank is taken as a box of surface A ≈ 6 V^(2/3) holding about 0.8 kg of steel per litre of oil.

**Try this**
- Start with no cooler at the default 30 kW: the oil heads for temperatures no mineral oil survives. The tank alone sheds well under 1 kW.
- Add a cooler of about 0.3 kW/K: the oil settles near 52 °C, where the thermostat holds it. Note how long the climb takes — the time constant.
- Double the tank volume: the climb is slower (a longer time constant), but without a cooler the final temperature hardly falls. A bigger tank delays; a cooler cures.
- Raise the efficiency from 70 to 85 %: half the heat — making less heat beats removing it.
- Untick the thermostatic bypass and do a cold start: the cooler works from the start and the oil takes much longer to reach its working temperature.`,
    mount(box, kit) {
      const S = kit.fsym, F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.44, minH: 260 });
      const plot = kit.plot(plotDiv(box), { x: { label: 'time (h)', min: 0, max: 8 }, y: { label: 'oil temperature (°C)', min: 0 }, legend: true }, 200);
      const SPEED = 600, SHIFT = 8 * 3600;
      let T = 25, tm = 0, hold = 0, fanA = 0, tPlot = 0, t60 = null;
      const hist = [], ph = {};
      const ctl = kit.controls(box.side, [
        { type: 'buttons', items: [{ id: 'cold', label: 'Cold start', primary: true }] },
        { id: 'Pin', label: 'Input power', min: 5, max: 100, step: 1, value: 30, unit: 'kW' },
        { id: 'eta', label: 'Overall efficiency', min: 40, max: 95, step: 1, value: 70, unit: '%' },
        { id: 'duty', label: 'Share of the time working', min: 10, max: 100, step: 5, value: 100, unit: '%' },
        { id: 'V', label: 'Oil in the reservoir', min: 50, max: 1000, value: 250, unit: 'L', log: true, sig: 2 },
        { id: 'k', label: 'Heat-transfer coefficient of the tank', min: 6, max: 25, step: 0.5, value: 12, unit: 'W/(m²·K)' },
        { id: 'Ta', label: 'Ambient temperature', min: 0, max: 45, step: 1, value: 25, unit: '°C' },
        { id: 'P01', label: 'Cooler specific power (0 = no cooler)', min: 0, max: 1.5, step: 0.01, value: 0, unit: 'kW/K' },
        { id: 'thermo', type: 'check', label: 'Thermostatic bypass: cooler in above 50 °C', value: true }
      ], (id) => { if (id === 'cold') restart(); });
      const ro = kit.readout(box.side, [['heat', 'Heat load'], ['T', 'Oil temperature'], ['tank', 'Tank: surface / heat shed'], ['cool', 'Cooler removes'], ['ss', 'Settles at'], ['tau', 'Time constant'], ['t60', 'Reached 60 °C after'], ['nu', 'Viscosity of ISO VG 46 now'], ['life', 'Oil life compared with 60 °C']]);
      const V = ctl.values;
      function restart() { T = V.Ta; tm = 0; hold = 0; t60 = null; hist.length = 0; }
      restart();
      const geo = () => { const Vm = V.V / 1000; return { A: 6 * Math.pow(Vm, 2 / 3), C: V.V * 0.87 * 1880 + 0.8 * V.V * 460 }; };
      const heatLoad = () => V.Pin * 1000 * (1 - V.eta / 100) * V.duty / 100;
      const frac = TT => (V.thermo ? clamp((TT - 48) / 4, 0, 1) : 1);
      const coolerP = TT => V.P01 * 1000 * frac(TT) * Math.max(0, TT - V.Ta);
      function steady() {
        const g = geo(), Ph = heatLoad();
        let lo = V.Ta, hi = V.Ta + Ph / (V.k * g.A) + 1;
        for (let k = 0; k < 60; k++) { const m = (lo + hi) / 2; if (Ph - V.k * g.A * (m - V.Ta) - coolerP(m) > 0) lo = m; else hi = m; }
        return (lo + hi) / 2;
      }
      const loop = kit.loop((dt) => {
        const g = geo(), Ph = heatLoad();
        if (tm < SHIFT) {
          let rem = dt * SPEED;
          while (rem > 0) {
            const h = Math.min(5, rem); rem -= h;
            T += (Ph - V.k * g.A * (T - V.Ta) - coolerP(T)) / g.C * h;
            T = clamp(T, -20, 150); tm += h;
            if (t60 == null && T >= 60) t60 = tm;
          }
        } else { hold += dt; if (hold > 3) restart(); }
        const Tss = steady(), Pt = V.k * g.A * (T - V.Ta), Pc = coolerP(T);
        const tau = g.C / (V.k * g.A + (Tss > 50 || !V.thermo ? V.P01 * 1000 : 0));
        ro.set('heat', fkw(Ph, 1));
        ro.set('T', T.toFixed(1) + ' °C' + (T >= 149.9 ? '  (model stops here: the oil would be ruined)' : T > 60 ? '  (too hot)' : ''));
        ro.set('tank', g.A.toFixed(2) + ' m² / ' + fkw(Pt, 2));
        ro.set('cool', V.P01 > 0 ? fkw(Pc, 1) + (frac(T) < 1 ? '  (bypass ' + (frac(T) > 0 ? 'partly ' : '') + 'open)' : '') : 'no cooler');
        ro.set('ss', Tss > 200 ? 'over 200 °C — the oil would be destroyed long before' : Tss.toFixed(0) + ' °C');
        ro.set('tau', (tau / 3600).toFixed(tau < 3600 ? 2 : 1) + ' h');
        ro.set('t60', t60 == null ? 'not yet' : (t60 / 3600).toFixed(1) + ' h');
        ro.set('nu', (F.oilViscosity(46, T) * 1e6).toFixed(0) + ' mm²/s');
        ro.set('life', T <= 60 ? 'full life' : (100 * Math.pow(2, -(T - 60) / 10)).toFixed(0) + ' %');
        tPlot += dt;
        if (tPlot > 0.1 && tm <= SHIFT) {
          tPlot = 0; hist.push([tm / 3600, T]);
          plot.set({ y: { label: 'oil temperature (°C)', min: 0, max: Math.max(80, Math.min(165, Math.max(Tss, T) * 1.1)) },
            series: [{ pts: hist.slice(), label: 'oil', width: 2.4 }],
            hlines: [{ y: 60, label: '60 °C' }, { y: Math.min(Tss, 160), label: Tss > 160 ? 'settles far above' : 'settles at' }, { y: V.Ta, label: 'ambient' }] });
        }
        // ---- drawing on a 760 × 330 grid
        const c = onGrid(st, 760, 330), C = kit.colors(), col = S.col;
        const oilCol = kit.hue(clamp(215 - (T - 15) * 2.7, 0, 215), 0.45);
        c.fillStyle = oilCol; c.fillRect(42, 100, 256, 188);
        seg(c, [[40, 60], [40, 290], [300, 290], [300, 60]], C.text, 3); seg(c, [[36, 60], [304, 60]], C.text, 3);
        kit.label(c, V.V.toFixed(0) + ' L of oil', 170, 200, { color: C.text, size: 13, weight: 700 });
        kit.label(c, T.toFixed(1) + ' °C', 170, 222, { color: C.text, size: 13 });
        // heat leaving the walls
        const nw = clamp(Pt / 400, 0, 6);
        for (let i = 0; i < Math.round(nw); i++) {
          const y = 120 + i * 28; kit.arrow(c, 38, y, 14, y - 8, C.warn, 1.8);
          const xx = 70 + i * 40; kit.arrow(c, xx, 292, xx - 8, 316, C.warn, 1.8);
        }
        kit.label(c, 'walls: ' + (Pt / 1000).toFixed(2) + ' kW', 170, 42, { color: C.warn, size: 11, weight: 700 });
        // thermometer
        const tx = 330, tyTop = 70, tyBot = 280, tf = clamp(T / 120, 0, 1);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.strokeRect(tx - 6, tyTop, 12, tyBot - tyTop);
        c.fillStyle = T > 60 ? C.bad : C.accent; c.fillRect(tx - 4, tyBot - tf * (tyBot - tyTop), 8, tf * (tyBot - tyTop));
        const y60 = tyBot - 0.5 * (tyBot - tyTop);
        seg(c, [[tx - 10, y60], [tx + 10, y60]], C.bad, 1.5); kit.label(c, '60 °C', tx + 14, y60, { color: C.bad, size: 10, align: 'left' });
        // the hydraulic system, its return line through the cooler, and the suction
        const on = Ph > 0, cooling = V.P01 > 0 && frac(T) > 0.01;
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6; c.fillRect(540, 95, 200, 80); c.strokeRect(540, 95, 200, 80);
        kit.label(c, 'hydraulic system', 640, 112, { color: C.text, size: 12, weight: 700 });
        kit.label(c, 'in ' + V.Pin.toFixed(0) + ' kW · η ' + V.eta.toFixed(0) + ' %', 640, 132, { color: C.muted, size: 11 });
        kit.label(c, 'heat ' + (Ph / 1000).toFixed(1) + ' kW', 640, 152, { color: C.bad, size: 12, weight: 700 });
        const suction = [[90, 250], [90, 30], [640, 30], [640, 95]];
        const ret = [[540, 150], [453, 150]], ret2 = [[407, 150], [380, 150], [380, 50], [250, 50], [250, 235]];
        const byp = [[520, 150], [520, 205], [380, 205], [380, 150]];
        S.line(c, suction, { state: 'suction' });
        S.line(c, ret, { state: 'return' }); S.line(c, ret2, { state: 'return' });
        S.line(c, byp, { state: V.P01 > 0 && frac(T) < 0.99 ? 'return' : 'idle' });
        S.junction(c, 520, 150); S.junction(c, 380, 150);
        const adv = (key, q) => { ph[key] = (ph[key] || 0) + dt * 40 * q; return ph[key]; };
        if (on) {
          S.flow(c, suction, adv('su', 1), { color: col('suction') });
          S.flow(c, ret, adv('r1', 1), { color: col('return') });
          if (V.P01 > 0 && frac(T) < 0.99) S.flow(c, byp, adv('by', 1 - frac(T)), { color: col('return') });
          S.flow(c, ret2, adv('r2', 1), { color: col('return') });
        }
        if (V.P01 > 0) {
          S.cooler(c, 430, 150, { rot: 90 });
          fanA += dt * (cooling ? 12 : 0);
          c.strokeStyle = C.text; c.lineWidth = 1.4; c.beginPath(); c.arc(430, 105, 13, 0, Math.PI * 2); c.stroke();
          for (let i = 0; i < 3; i++) { const a = fanA + i * 2 * Math.PI / 3; seg(c, [[430, 105], [430 + 11 * Math.cos(a), 105 + 11 * Math.sin(a)]], C.text, 2); }
          if (cooling) { kit.arrow(c, 430, 122, 430, 132, C.accent, 1.6); kit.arrow(c, 445, 128, 470, 110, C.warn, 2); }
          kit.label(c, 'cooler ' + V.P01.toFixed(2) + ' kW/K: ' + (Pc / 1000).toFixed(1) + ' kW', 430, 228, { color: cooling ? C.warn : C.muted, size: 11, weight: 700 });
          kit.label(c, frac(T) < 0.99 ? 'thermostat: bypass open' : 'thermostat: through the cooler', 443, 218 - 30, { color: C.muted, size: 10 });
        } else { seg(c, [[407, 150], [453, 150]], col('return'), 2.2); kit.label(c, 'no cooler', 430, 170, { color: C.muted, size: 11 }); }
        kit.label(c, 'suction', 96, 22, { color: C.muted, size: 10, align: 'left' });
        kit.label(c, 'return', 470, 142, { color: C.muted, size: 10 });
        kit.label(c, 't = ' + (tm / 3600).toFixed(2) + ' h of an 8 h shift  ·  ambient ' + V.Ta + ' °C', 20, 318, { color: C.muted, size: 11, align: 'left' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ inside a reservoir */
  Hyper.sim('sys-tank', {
    title: 'Inside a reservoir: dwell time, a baffle and rising air',
    blurb: `A reservoir in section. Oil returns through a diffuser on the left carrying air bubbles and flows to the pump's suction strainer on the right. Each bubble drifts with the flow and rises at its Stokes speed, v = ρgd²/(18μ), with the viscosity of ISO VG 46 oil at the temperature you set; a bubble that reaches the surface escapes, one that reaches the suction goes round the system again. Time runs 20 times faster than real time; the tank is a box twice as long as it is deep.

**Try this**
- Remove the baffle: the returning stream short-circuits along the lower half of the tank to the suction, and far fewer bubbles escape.
- With the baffle, watch where the air leaves: the stream is lifted over the baffle close to the surface.
- Cool the oil to 15 °C: the viscosity rises about fourfold and the fine bubbles no longer make it.
- Double the pump flow with the same tank (half the dwell time), then double the tank instead.
- Show the dirt: 10–60 µm silica particles sink so slowly that almost all of them reach the suction — the tank is no substitute for a filter.`,
    mount(box, kit) {
      const F = kit.fluid;
      const st = kit.stage(box.stage, { aspect: 0.48, minH: 280 });
      const ACC = 20, SURF = 72, BOT = 298;
      let seed = 12345, spawn = 0, parts = [], pops = [], stats = null;
      const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      const ctl = kit.controls(box.side, [
        { id: 'Q', label: 'Pump flow', min: 10, max: 200, value: 60, unit: 'L/min', log: true, sig: 2 },
        { id: 'V', label: 'Oil in the tank', min: 40, max: 1000, value: 250, unit: 'L', log: true, sig: 2 },
        { id: 'baffle', type: 'check', label: 'Baffle between return and suction', value: true },
        { id: 'T', label: 'Oil temperature (ISO VG 46)', min: 10, max: 70, step: 1, value: 40, unit: '°C' },
        { id: 'sizes', type: 'select', label: 'Bubbles in the returning oil', options: [['Fine: 0.03–0.3 mm', 'fine'], ['Mixed: 0.03–1 mm', 'mixed'], ['Coarse: 0.2–2 mm', 'coarse']], value: 'mixed' },
        { id: 'dirt', type: 'check', label: 'Show dirt particles too (silica, 10–60 µm)', value: false }
      ], () => reset());
      const ro = kit.readout(box.side, [['dw', 'Dwell time V/Q'], ['path', 'Time on the flow path'], ['mu', 'Oil viscosity'], ['v', 'Rise speed: 0.1 / 0.3 / 1 mm bubble'], ['rel', 'Air released before the suction'], ['bins', 'Released: < 0.1 / 0.1–0.3 / > 0.3 mm'], ['dirt', 'Dirt settled on the floor']]);
      const V = ctl.values;
      function reset() { parts = []; pops = []; stats = { n: [0, 0, 0], rel: [0, 0, 0], dirtN: 0, dirtSet: 0 }; }
      reset();
      const RANGE = { fine: [0.03, 0.3], mixed: [0.03, 1], coarse: [0.2, 2] };
      function lanePts(lane) {
        return V.baffle ? [[100, 248], [320, 160 + 110 * lane], [400, 88 + 30 * lane], [480, 160 + 110 * lane], [688, 268]]
          : [[100, 248], [250, 196 + 84 * lane], [560, 196 + 84 * lane], [688, 268]];
      }
      function at(pts, s) {
        const L = []; let tot = 0;
        for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(l); tot += l; }
        let d = clamp(s, 0, 1) * tot, i = 0;
        while (i < L.length - 1 && d > L[i]) { d -= L[i]; i++; }
        const f = L[i] ? d / L[i] : 0;
        return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * f, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * f];
      }
      const bin = dmm => (dmm < 0.1 ? 0 : dmm < 0.3 ? 1 : 2);
      const loop = kit.loop((dt) => {
        const C = kit.colors();
        const Vm = V.V / 1000, Qs = V.Q / 60000, dwell = Vm / Qs, H = Math.cbrt(Vm / 2.4), pxPerM = (BOT - SURF) / H;
        const Tpath = (V.baffle ? 0.6 : 0.25) * dwell;
        const nu = F.oilViscosity(46, V.T), mu = nu * RHO;
        const rise = dmm => Math.min(0.2, RHO * G0 * Math.pow(dmm / 1000, 2) / (18 * mu));
        const sink = dmm => (2650 - RHO) * G0 * Math.pow(dmm / 1000, 2) / (18 * mu);
        // new bubbles (and dirt)
        spawn += dt * 22;
        while (spawn >= 1 && parts.length < 450) {
          spawn -= 1;
          const r = RANGE[V.sizes] || RANGE.mixed, dmm = r[0] * Math.pow(r[1] / r[0], rnd());
          parts.push({ kind: 'air', d: dmm, lane: rnd(), s: 0, off: 0 });
          if (V.dirt && rnd() < 0.35) parts.push({ kind: 'dirt', d: 0.01 * Math.pow(6, rnd()), lane: rnd(), s: 0, off: 0 });
        }
        if (spawn > 1) spawn = 0;
        const next = [];
        for (const p of parts) {
          p.s += dt * ACC / Tpath;
          p.off += (p.kind === 'air' ? -rise(p.d) : sink(p.d)) * pxPerM * dt * ACC;
          const q = at(lanePts(p.lane), p.s), y = q[1] + p.off;
          if (p.kind === 'air' && y <= SURF) { stats.n[bin(p.d)]++; stats.rel[bin(p.d)]++; pops.push({ x: q[0], r: 1, a: 1 }); continue; }
          if (p.kind === 'dirt' && y >= BOT) { stats.dirtN++; stats.dirtSet++; continue; }
          if (p.s >= 1) { if (p.kind === 'air') stats.n[bin(p.d)]++; else stats.dirtN++; continue; }
          p.x = q[0]; p.y = clamp(y, SURF, BOT); next.push(p);
        }
        parts = next;
        const nAll = stats.n[0] + stats.n[1] + stats.n[2], rAll = stats.rel[0] + stats.rel[1] + stats.rel[2];
        const pc = (a, b) => (b > 0 ? (100 * a / b).toFixed(0) + ' %' : '—');
        ro.set('dw', (dwell / 60).toFixed(1) + ' min');
        ro.set('path', (Tpath / 60).toFixed(1) + ' min' + (V.baffle ? '' : '  (short-circuit)'));
        ro.set('mu', (nu * 1e6).toFixed(0) + ' mm²/s, ' + (mu * 1000).toFixed(0) + ' mPa·s');
        ro.set('v', (rise(0.1) * 1000).toFixed(2) + ' / ' + (rise(0.3) * 1000).toFixed(1) + ' / ' + (rise(1) * 1000).toFixed(0) + ' mm/s');
        ro.set('rel', pc(rAll, nAll));
        ro.set('bins', pc(stats.rel[0], stats.n[0]) + ' / ' + pc(stats.rel[1], stats.n[1]) + ' / ' + pc(stats.rel[2], stats.n[2]));
        ro.set('dirt', V.dirt ? pc(stats.dirtSet, stats.dirtN) : '—');
        // ---- drawing on a 780 × 360 grid
        const c = onGrid(st, 780, 360);
        c.fillStyle = kit.hue(38, 0.2); c.fillRect(40, SURF, 700, BOT - SURF);
        seg(c, [[40, 50], [40, BOT + 2], [740, BOT + 2], [740, 50]], C.text, 3); seg(c, [[36, 50], [744, 50]], C.text, 3);
        seg(c, [[40, SURF], [740, SURF]], C.accent, 1.2, [6, 4]);
        // flow lanes, faint
        for (const lane of [0, 0.25, 0.5, 0.75, 1]) seg(c, lanePts(lane), C.faint || C.muted, 0.8, [2, 6]);
        // return with diffuser, suction with strainer, baffle
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.6;
        c.fillRect(94, 18, 12, 222); c.strokeRect(94, 18, 12, 222);
        c.fillRect(86, 236, 28, 16); c.strokeRect(86, 236, 28, 16);
        c.fillRect(684, 18, 12, 240); c.strokeRect(684, 18, 12, 240);
        c.fillRect(674, 254, 32, 30); c.strokeRect(674, 254, 32, 30);
        for (let yy = 258; yy < 284; yy += 5) seg(c, [[676, yy], [704, yy]], C.muted, 0.8);
        if (V.baffle) { c.fillStyle = C.muted; c.fillRect(396, 122, 8, BOT - 122); }
        // particles
        for (const p of parts) {
          if (p.kind === 'air') { const r = 1.2 + 2.1 * Math.log10(p.d / 0.03); c.strokeStyle = C.text; c.lineWidth = 1; c.beginPath(); c.arc(p.x, p.y, Math.max(1, r), 0, Math.PI * 2); c.stroke(); }
          else { c.fillStyle = C.warn; c.fillRect(p.x - 1.5, p.y - 1.5, 3, 3); }
        }
        for (const q of pops) { q.r += dt * 30; q.a -= dt * 1.5; if (q.a > 0) { c.strokeStyle = C.accent; c.globalAlpha = q.a; c.lineWidth = 1.2; c.beginPath(); c.arc(q.x, SURF - 2, q.r, Math.PI, 2 * Math.PI); c.stroke(); c.globalAlpha = 1; } }
        pops = pops.filter(q => q.a > 0);
        kit.label(c, 'return, through a diffuser', 114, 30, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'suction strainer', 676, 30, { color: C.muted, size: 11, align: 'right' });
        if (V.baffle) kit.label(c, 'baffle', 412, 200, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'air escapes at the surface', 400, 62, { color: C.accent, size: 11 });
        kit.label(c, 'depth ' + (H * 1000).toFixed(0) + ' mm · length ' + (2 * H * 1000).toFixed(0) + ' mm · time × ' + ACC, 40, 320, { color: C.muted, size: 11, align: 'left' });
        kit.label(c, 'dwell ' + (dwell / 60).toFixed(1) + ' min', 740, 320, { color: C.text, size: 12, weight: 700, align: 'right' });
        c.restore();
      }, box.stage);
      loop.start();
    }
  });
})();
