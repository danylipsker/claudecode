/* HYPER-ELECTRONICS · sims/diodes.js — simulations for the Diodes branch: the diode's
 * I–V curve and its models, the rectifier lab, the Zener regulator, clippers and
 * clampers, voltage multipliers, the flyback diode, LEDs and solar modules.
 * Every circuit is solved by kit.Circuit and drawn with kit.schem. */
(function () {
  'use strict';

  const VT300 = 0.025852;        // the simulator's thermal voltage (kT/q at 300 K)
  const KQ = 8.617333e-5;        // Boltzmann constant over the electron charge, V/K
  const TNOM = 298.15;           // datasheet temperature, 25 °C

  /* Diode parameters: Shockley equation with a series resistance, fitted to typical
     datasheet curves. eg and xti set how the saturation current grows with temperature. */
  const DIODES = {
    '1n4148': { label: '1N4148 (small-signal silicon)', short: '1N4148', is: 2.52e-9, n: 1.752, rs: 0.57, eg: 1.11, xti: 3, von: 0.7, vmax: 1.1, kind: '' },
    '1n4007': { label: '1N4007 (1 A rectifier)', short: '1N4007', is: 7e-9, n: 1.81, rs: 0.035, eg: 1.11, xti: 3, von: 0.7, vmax: 1.1, kind: '' },
    '1n5819': { label: '1N5819 (1 A Schottky)', short: '1N5819', is: 3e-7, n: 1.1, rs: 0.05, eg: 0.69, xti: 2, von: 0.3, vmax: 0.7, kind: 'schottky' },
    red: { label: 'Red LED (5 mm)', short: 'red LED', led: true, vf20: 2.0, n: 2, rs: 10, eg: 2.25, xti: 3, von: 2.0, vmax: 2.6, kind: 'led', glow: '#ff3b30' },
    blue: { label: 'Blue LED (5 mm)', short: 'blue LED', led: true, vf20: 3.1, n: 2, rs: 10, eg: 3.4, xti: 3, von: 3.1, vmax: 3.7, kind: 'led', glow: '#3b82ff' }
  };
  /* an LED's saturation current, from its forward voltage at 20 mA */
  function ledIs(vf20, n, rs) { return 0.02 / (Math.exp((vf20 - 0.02 * rs) / (n * KQ * TNOM)) - 1); }
  for (const k in DIODES) if (DIODES[k].led) DIODES[k].is = ledIs(DIODES[k].vf20, DIODES[k].n, DIODES[k].rs);

  /* saturation current and n·kT/q at a temperature (°C); nsim is the emission coefficient
     to hand the simulator, whose thermal voltage is fixed at 300 K */
  function atTemp(d, tc) {
    const T = tc + 273.15;
    const is = d.is * Math.pow(T / TNOM, d.xti / d.n) * Math.exp(d.eg / (d.n * KQ) * (1 / TNOM - 1 / T));
    const nvt = d.n * KQ * T;
    return { is, nvt, nsim: nvt / VT300 };
  }
  /* diode voltage at a current, including the series resistance */
  const vAt = (p, d, i) => p.nvt * Math.log(1 + i / p.is) + i * d.rs;

  /* volts per division from the 1–2–5 series so that vmax spans at most 3.6 divisions */
  function vdivFor(vmax) {
    const v = Math.max(1e-6, Math.abs(vmax) / 3.6);
    const e = Math.pow(10, Math.floor(Math.log10(v)));
    for (const m of [1, 2, 5, 10]) if (m * e >= v * 0.999) return m * e;
    return 10 * e;
  }
  /* moving-dot speed for a current (log-compressed, so µA and A both move) */
  const speed = i => Math.sign(i) * Math.min(120, 30 * Math.log10(1 + Math.abs(i) / 1e-6));
  const fmtR = kit => v => kit.eng(v, 'Ω');
  /* engineering format that shows a negligible value as ≈ 0 */
  const eng0 = (kit, v, unit, tiny) => Math.abs(v) < (tiny || 1e-9) ? '≈ 0 ' + unit : kit.eng(v, unit);
  /* a halo behind a lit LED */
  function halo(g, x, y, r, color, a) {
    if (!(a > 0.01)) return;
    g.save(); g.globalAlpha = Math.min(0.75, a); g.fillStyle = color;
    g.beginPath(); g.arc(x, y, r, 0, 7); g.fill(); g.restore();
  }

  /* =============================================================== 1. the I–V curve */
  Hyper.sim('dio-iv', {
    title: 'Diode I–V curve: models, load line and temperature',
    blurb: `A source and a resistor drive the diode; the simulator finds the operating point where the diode's curve meets the resistor's **load line**. The dashed lines are the ideal-switch and constant-drop models.

- With 5 V and 1 kΩ the three models agree within about 15 %. Drop the supply to 1 V: the ideal model is now badly wrong, and even the 0.7 V model misses.
- Tick the logarithmic axis: the forward curve becomes a straight line, one decade of current per $n \\times 60$ mV.
- Heat the diode to 125 °C: at the same current the voltage falls by about 2 mV per degree, and the reverse leakage (make the supply negative) grows a thousandfold.
- Compare the 1N5819 Schottky with the 1N4148: a lower drop, paid for with far more leakage.`,
    mount(box, kit, params) {
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 210, maxH: 260 });
      const ctl = kit.controls(box.side, [
        { id: 'dev', type: 'select', label: 'Diode', options: Object.keys(DIODES).map(k => [DIODES[k].label, k]), value: DIODES[params.dev] ? params.dev : '1n4148' },
        { id: 'vs', label: 'Supply voltage', min: -5, max: 12, step: 0.05, value: 5, unit: 'V' },
        { id: 'r', label: 'Series resistor', min: 10, max: 100e3, value: 1e3, log: true, sig: 2, fmt: fmtR(kit) },
        { id: 't', label: 'Temperature', min: -40, max: 150, step: 1, value: 25, unit: '°C' },
        { id: 'log', type: 'check', label: 'Logarithmic current axis', value: !!params.log },
        { id: 'models', type: 'check', label: 'Show the ideal and constant-drop models', value: true }
      ], () => solve());
      const ro = kit.readout(box.side, [['vd', 'Diode voltage'], ['id', 'Diode current'], ['ideal', 'Ideal-switch model'], ['cd', 'Constant-drop model'],
        ['rd', 'Small-signal r_d = nV_T/I'], ['pd', 'Power in the diode'], ['tc', 'Forward-voltage drift']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'diode voltage (V)' }, y: { label: 'current (A)' } }, 280);
      const V = ctl.values;
      let sol = { vd: 0, id: 0 }, phase = 0;

      function opPoint(d, tc) {
        const p = atTemp(d, tc);
        const c = new kit.Circuit();
        c.V('s', 'gnd', V.vs);
        c.R('s', 'a', V.r);
        c.R('a', 'j', d.rs);
        const D = c.D('j', 'gnd', { is: p.is, n: p.nsim });
        c.dc();
        return { vd: c.v('a'), id: D.i };
      }
      function curve(d, tc, xmin, i0, i1, reverse) {
        const p = atTemp(d, tc), pts = [];
        if (reverse) for (let k = 0; k <= 40; k++) { const v = xmin * (1 - k / 40); pts.push([v, p.is * (Math.exp(v / p.nvt) - 1)]); }
        for (let k = 0; k <= 160; k++) { const i = i0 * Math.pow(i1 / i0, k / 160); pts.push([vAt(p, d, i), i]); }
        return pts;
      }
      function solve() {
        const d = DIODES[V.dev] || DIODES['1n4148'];
        sol = opPoint(d, V.t);
        const p = atTemp(d, V.t), p1 = atTemp(d, V.t + 1);
        const iIdeal = Math.max(0, V.vs / V.r), iCd = Math.max(0, (V.vs - d.von) / V.r);
        const rel = x => sol.id > 1e-9 ? ' (' + (x >= sol.id ? '+' : '−') + Math.abs(100 * (x - sol.id) / sol.id).toFixed(0) + ' %)' : '';
        ro.set('vd', kit.eng(sol.vd, 'V'));
        ro.set('id', sol.id < 0 ? kit.eng(sol.id, 'A') + ' (leakage)' : kit.eng(sol.id, 'A'));
        ro.set('ideal', kit.eng(iIdeal, 'A') + rel(iIdeal));
        ro.set('cd', kit.eng(iCd, 'A') + rel(iCd));
        ro.set('rd', sol.id > 1e-9 ? kit.eng(p.nvt / sol.id, 'Ω') : 'very large (off)');
        ro.set('pd', kit.eng(Math.abs(sol.vd * sol.id), 'W'));
        const iref = Math.max(sol.id, 1e-3);
        ro.set('tc', ((vAt(p1, d, iref) - vAt(p, d, iref)) * 1000).toFixed(2) + ' mV/°C at ' + kit.eng(iref, 'A'));
        const C = kit.colors();
        const series = [], marks = [];
        let x, y;
        if (!V.log) {
          const xmin = Math.min(-1, V.vs - 0.3), xmax = d.vmax;
          const ymax = 1.15 * Math.max(V.vs / V.r, sol.id, 1e-3), ymin = -0.06 * ymax;
          x = { label: 'diode voltage (V)', min: xmin, max: xmax };
          y = { label: 'current (A)', min: ymin, max: ymax };
          series.push({ pts: curve(d, V.t, xmin, ymax * 1e-4, ymax * 1.6, true), label: d.short + ' at ' + V.t + ' °C', color: C.accent, width: 2.6 });
          if (V.t !== 25) series.push({ pts: curve(d, 25, xmin, ymax * 1e-4, ymax * 1.6, true), label: 'at 25 °C', color: C.faint, dash: [5, 4] });
          if (V.models) {
            series.push({ pts: [[xmin, 0], [0, 0], [0, ymax * 2]], label: 'ideal switch', color: C.series[2], dash: [7, 5], width: 1.6 });
            series.push({ pts: [[xmin, 0], [d.von, 0], [d.von, ymax * 2]], label: 'constant drop ' + d.von + ' V', color: C.series[1], dash: [7, 5], width: 1.6 });
          }
          const ll = [];
          for (let k = 0; k <= 200; k++) {
            const v = xmin + (xmax - xmin) * k / 200, i = (V.vs - v) / V.r;
            ll.push([v, i > ymin - (ymax - ymin) && i < 2 * ymax ? i : NaN]);
          }
          series.push({ pts: ll, label: 'load line', color: C.warn, width: 1.6 });
        } else {
          const xmax = d.vmax;
          x = { label: 'diode voltage (V)', min: 0, max: xmax };
          y = { label: 'current (A), log scale', min: 1e-12, max: 10, log: true };
          series.push({ pts: curve(d, V.t, 0, 1e-13, 20, false), label: d.short + ' at ' + V.t + ' °C', color: C.accent, width: 2.6 });
          if (V.t !== 25) series.push({ pts: curve(d, 25, 0, 1e-13, 20, false), label: 'at 25 °C', color: C.faint, dash: [5, 4] });
          if (V.models) {
            series.push({ pts: [[0.002, 1e-12], [0.002, 10]], label: 'ideal switch', color: C.series[2], dash: [7, 5], width: 1.6 });
            series.push({ pts: [[d.von, 1e-12], [d.von, 10]], label: 'constant drop ' + d.von + ' V', color: C.series[1], dash: [7, 5], width: 1.6 });
          }
          const ll = [];
          for (let k = 0; k <= 200; k++) { const v = xmax * k / 200, i = (V.vs - v) / V.r; ll.push([v, i > 1e-13 ? i : NaN]); }
          series.push({ pts: ll, label: 'load line', color: C.warn, width: 1.6 });
        }
        if (V.models && V.vs > 0) {
          marks.push({ x: 0, y: V.log ? Math.max(iIdeal, 1e-12) : iIdeal, color: C.series[2] });
          if (iCd > 0) marks.push({ x: d.von, y: iCd, color: C.series[1] });
        }
        if (!V.log || sol.id > 1e-12) marks.push({ x: sol.vd, y: sol.id, label: 'operating point', color: C.accent });
        plot.set({ x, y, series, marks, hlines: [], vlines: [] });
      }

      function draw(dt) {
        const C = kit.colors(), g = st.begin(), W = st.W, Hh = st.H;
        const d = DIODES[V.dev] || DIODES['1n4148'];
        const xs = Math.max(50, W * 0.1), xd = W * 0.46, xm = W * 0.6, top = Hh * 0.2, bot = Hh * 0.82, mid = (top + bot) / 2;
        phase += (dt || 0) * speed(sol.id);
        S.wire(g, [[xs, mid - 26], [xs, top], [xs + 40, top]]);
        S.battery(g, xs, mid - 26, xs, mid + 26, { label: 'V_s', value: kit.eng(V.vs, 'V') });
        S.resistor(g, xs + 40, top, xd - 30, top, { label: 'R', value: kit.eng(V.r, 'Ω') });
        S.wire(g, [[xd - 30, top], [xd, top], [xd, top + 16]]);
        const lit = d.led && sol.id > 1e-4;
        if (lit) halo(g, xd, mid, 26, d.glow, Math.sqrt(sol.id / 0.02) * 0.45);
        S.diode(g, xd, top + 16, xd, bot - 16, { kind: d.kind, on: lit, glow: d.glow, label: d.short });
        S.wire(g, [[xd, bot - 16], [xd, bot], [xs, bot], [xs, mid + 26]]);
        S.ground(g, (xs + xd) / 2, bot);
        S.wire(g, [[xd, top], [xm, top], [xm, mid - 16]]);
        S.meter(g, xm, mid, 'V', kit.eng(sol.vd, 'V'));
        S.wire(g, [[xm, mid + 16], [xm, bot], [xd, bot]]);
        S.node(g, xd, top); S.node(g, xd, bot);
        S.flow(g, [[xs, mid - 26], [xs, top], [xd, top], [xd, bot], [xs, bot], [xs, mid + 26]], phase, { color: C.warn });
        kit.label(g, 'I = ' + kit.eng(sol.id, 'A'), xs + 8, top - 16, { size: 12, color: C.warn });
        const xt = W * 0.74;
        const fwd = sol.id > 1e-6;
        kit.label(g, fwd ? 'conducting' : 'blocking', xt, top, { size: 12.5, color: fwd ? C.ok : C.muted, weight: 600 });
        kit.label(g, 'T = ' + V.t + ' °C', xt, top + 22, { size: 12, color: C.muted });
        kit.label(g, 'P = ' + kit.eng(Math.abs(sol.vd * sol.id), 'W'), xt, top + 42, { size: 12, color: C.muted });
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* =============================================================== 2. rectifiers */
  Hyper.sim('dio-rectifier', {
    title: 'Rectifier lab: half-wave, centre-tap and bridge',
    blurb: `A mains transformer's secondary feeds the rectifier; the simulator steps the circuit in time with 1N4007-type diodes and a 0.5 Ω winding resistance. Yellow: the secondary voltage. Blue: the output. Pink: the current in diode D1 (1 V on the screen = 1 A).

- Without the capacitor, compare the three circuits: half-wave passes one hump per cycle, the other two both halves. The bridge output is two diode drops below the peak, the centre-tap one drop.
- Fit the capacitor: the output becomes DC with a sawtooth ripple, and the diode current shrinks into short, tall pulses — often five to ten times the load current.
- Make the load heavier or the capacitor smaller and watch the ripple grow as $I/(f_r C)$. The half-wave circuit, with half the ripple frequency, needs twice the capacitance.
- Read the peak reverse voltage on D1: with a capacitor the half-wave diode sees about twice the peak.
- Press Reset to see the inrush current into the empty capacitor.

> [!warn] The primary of a real transformer is at mains voltage. Build rectifier experiments on the low-voltage secondary, with the mains side enclosed and fused.`,
    mount(box, kit, params) {
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 420, maxH: 640 });
      const MODES = [['Half-wave (1 diode)', 'half'], ['Centre-tap full-wave (2 diodes)', 'ct'], ['Bridge (4 diodes)', 'bridge']];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Rectifier', options: MODES, value: MODES.some(m => m[1] === params.mode) ? params.mode : 'bridge' },
        { id: 'vrms', label: 'Secondary voltage, RMS (each half for centre-tap)', min: 3, max: 24, step: 0.5, value: 12, unit: 'V' },
        { id: 'f', type: 'select', label: 'Mains frequency', options: [['50 Hz', 50], ['60 Hz', 60]], value: 50 },
        { id: 'cap', type: 'check', label: 'Smoothing capacitor', value: !!params.cap },
        { id: 'c', label: 'Capacitance', min: 10e-6, max: 10e-3, value: 1000e-6, log: true, sig: 2, fmt: v => kit.eng(v, 'F') },
        { id: 'rl', label: 'Load resistance', min: 10, max: 10e3, value: 100, log: true, sig: 2, fmt: fmtR(kit) },
        { id: 'cur', type: 'check', label: 'Show the diode current', value: true }
      ], id => { if (id !== 'cur') rebuild(); });
      const ro = kit.readout(box.side, [['vpk', 'Peak output'], ['vmin', 'Lowest output'], ['rip', 'Ripple, peak to peak'], ['est', 'Estimate I/(f_r C)'],
        ['vdc', 'Average (DC) output'], ['idc', 'Load current'], ['ipk', 'Peak diode current'], ['cond', 'D1 conducts for'], ['piv', 'Peak reverse voltage on D1']]);
      const V = ctl.values;
      const RW = 0.5, DOPT = { is: 7e-9, n: 1.81 };
      let c, D1, dt, T, tdiv, buf, tStart, armed, per, meas, vdivV, vdivI, spf, count, nper;

      function fresh() { return { vmax: -Infinity, vmin: Infinity, sum: 0, n: 0, ipk: 0, on: 0, piv: 0 }; }
      function rebuild() {
        T = 1 / V.f; nper = 400; dt = T / nper;
        const Vp = V.vrms * Math.SQRT2, w = 2 * Math.PI * V.f;
        const src = t => Vp * Math.sin(w * t);
        c = new kit.Circuit();
        if (V.mode === 'half') { c.V('a', 'gnd', src, { r: RW }); D1 = c.D('a', 'out', DOPT); }
        else if (V.mode === 'ct') { c.V('a', 'gnd', src, { r: RW }); c.V('gnd', 'b', src, { r: RW }); D1 = c.D('a', 'out', DOPT); c.D('b', 'out', DOPT); }
        else { c.V('a', 'b', src, { r: RW }); D1 = c.D('a', 'out', DOPT); c.D('b', 'out', DOPT); c.D('gnd', 'a', DOPT); c.D('gnd', 'b', DOPT); }
        if (V.cap) c.C('out', 'gnd', V.c, 0);
        c.R('out', 'gnd', V.rl);
        c.reset();
        tdiv = 5e-3;
        spf = Math.max(1, Math.round(10 * tdiv / dt / 80));
        buf = []; tStart = 0; armed = false; count = 0;
        per = fresh(); meas = null;
        vdivV = vdivFor(Vp);
        vdivI = vdivFor(Math.max(0.02, Vp / V.rl));
        for (const k of ['vpk', 'vmin', 'rip', 'est', 'vdc', 'idc', 'ipk', 'cond', 'piv']) ro.set(k, '…');
      }
      function vsec() { return V.mode === 'bridge' ? c.v('a') - c.v('b') : c.v('a'); }
      function report(m) {
        const vdc = m.sum / m.n, idc = vdc / V.rl, fr = V.mode === 'half' ? V.f : 2 * V.f;
        ro.set('vpk', kit.eng(m.vmax, 'V'));
        ro.set('vmin', kit.eng(Math.max(0, m.vmin), 'V'));
        ro.set('rip', kit.eng(m.vmax - Math.max(0, m.vmin), 'V'));
        ro.set('est', V.cap ? kit.eng(idc / (fr * V.c), 'V') : 'no capacitor');
        ro.set('vdc', kit.eng(vdc, 'V'));
        ro.set('idc', kit.eng(idc, 'A'));
        ro.set('ipk', kit.eng(m.ipk, 'A') + (idc > 1e-6 ? ' (' + (m.ipk / idc).toFixed(1) + ' × I_load)' : ''));
        ro.set('cond', kit.eng(m.on * dt, 's') + ' = ' + (m.on * dt * 360 * V.f).toFixed(0) + '° per cycle');
        ro.set('piv', kit.eng(m.piv, 'V'));
      }
      function frame() {
        for (let k = 0; k < spf; k++) {
          c.step(dt); count++;
          const vo = c.v('out'), vi = vsec(), id = D1.i;
          per.vmax = Math.max(per.vmax, vo); per.vmin = Math.min(per.vmin, vo);
          per.sum += vo; per.n++;
          per.ipk = Math.max(per.ipk, id);
          if (id > Math.max(1e-4, 0.03 * (meas ? meas.ipk : 0.05))) per.on++;
          per.piv = Math.max(per.piv, vo - c.v('a'));
          if (count % nper === 0) {
            if (count >= 3 * nper) { meas = per; report(meas); }
            per = fresh();
            if (armed) { armed = false; buf = []; tStart = c.t; if (meas) vdivI = vdivFor(Math.max(0.02, meas.ipk)); }
          }
          if (!armed) {
            buf.push([c.t - tStart, vi, vo, id]);
            if (c.t - tStart >= 10 * tdiv - dt / 2) armed = true;
          }
        }
        draw();
      }
      function transformer(g, x, y1, y2, ct, C) {
        const xp = x - 18, xs = x + 18, ym = (y1 + y2) / 2;
        S.inductor(g, xp, y1, xp, y2);
        if (ct) { S.inductor(g, xs, ym - 2, xs, y1); S.inductor(g, xs, y2, xs, ym + 2); S.wire(g, [[xs, ym - 2], [xs, ym + 2]]); }
        else S.inductor(g, xs, y2, xs, y1);
        S.line(g, [[x - 3, y1 + 6], [x - 3, y2 - 6]], C.text, 1.5);
        S.line(g, [[x + 3, y1 + 6], [x + 3, y2 - 6]], C.text, 1.5);
        S.wire(g, [[xp, y1], [xp - 34, y1]]); S.wire(g, [[xp, y2], [xp - 34, y2]]);
        kit.label(g, 'mains', xp - 38, ym, { size: 12, color: C.muted, align: 'right' });
        kit.label(g, '~', xp - 50, ym + 16, { size: 14, color: C.muted, align: 'center' });
      }
      function draw() {
        const C = kit.colors(), g = st.begin(), W = st.W, Hh = st.H;
        const ox = 80, xc = ox + 58, xs = xc + 18, yT = 34, yB = 136, yM = 85, yR = 168;
        const xd1 = xs + 72, xd2 = xd1 + 50, xbus = xd2 + 45, xcap = Math.min(W - 150, xbus + 90), xload = Math.min(W - 70, xcap + 80);
        transformer(g, xc, yT, yB, V.mode === 'ct', C);
        const dcol = C.text;
        if (V.mode === 'bridge') {
          const xdc = xs + 110, T_ = [xdc, yT], B = [xdc, yB], L = [xdc - 44, yM], R = [xdc + 44, yM];
          S.wire(g, [[xs, yT], T_]); S.wire(g, [[xs, yB], B]);
          S.diode(g, T_[0], T_[1], R[0], R[1], { color: dcol });
          S.diode(g, B[0], B[1], R[0], R[1], { color: dcol });
          S.diode(g, L[0], L[1], T_[0], T_[1], { color: dcol });
          S.diode(g, L[0], L[1], B[0], B[1], { color: dcol });
          kit.label(g, 'D1', (T_[0] + R[0]) / 2 + 10, (T_[1] + R[1]) / 2 - 12, { size: 11.5, color: C.muted });
          S.node(g, T_[0], T_[1]); S.node(g, B[0], B[1]); S.node(g, L[0], L[1]); S.node(g, R[0], R[1]);
          S.wire(g, [R, [xload, yM]]);
          S.wire(g, [L, [L[0], yR], [xload, yR]]);
        } else {
          S.wire(g, [[xs, yT], [xd1, yT]]);
          S.diode(g, xd1, yT, xd2, yT, { label: 'D1' });
          S.wire(g, [[xd2, yT], [xbus, yT], [xbus, yM], [xload, yM]]);
          if (V.mode === 'ct') {
            S.wire(g, [[xs, yB], [xd1, yB]]);
            S.diode(g, xd1, yB, xd2, yB, { label: 'D2' });
            S.wire(g, [[xd2, yB], [xbus, yB], [xbus, yM]]);
            S.wire(g, [[xs, yM], [xs + 30, yM], [xs + 30, yR], [xload, yR]]);
            S.node(g, xs, yM);
            kit.label(g, 'centre tap', xs + 36, yM - 8, { size: 11, color: C.muted });
          } else S.wire(g, [[xs, yB], [xs, yR], [xload, yR]]);
          S.node(g, xbus, yM);
        }
        S.capacitor(g, xcap, yM, xcap, yR, { polarized: true, label: 'C', value: V.cap ? kit.eng(V.c, 'F') : 'not fitted', color: V.cap ? C.text : C.faint });
        S.node(g, xcap, yM); S.node(g, xcap, yR);
        S.resistor(g, xload, yM, xload, yR, { label: 'R_L', value: kit.eng(V.rl, 'Ω') });
        S.ground(g, (xcap + xload) / 2, yR);
        kit.label(g, 'CH1', xs + 6, yT - 14, { size: 11, color: '#f4e04d', weight: 700 });
        kit.label(g, 'CH2', xcap + 8, yM - 14, { size: 11, color: '#4dd6f4', weight: 700 });
        // the scope
        const sy = 200, sh = Math.max(150, Hh - sy - 28);
        const traces = [
          { pts: buf.map(p => [p[0], p[1]]), vdiv: vdivV, label: 'SECONDARY' },
          { pts: buf.map(p => [p[0], p[2]]), vdiv: vdivV, label: 'OUTPUT' }
        ];
        if (V.cur) traces.push({ pts: buf.map(p => [p[0], p[3]]), vdiv: vdivI, offset: -4, label: 'I(D1), 1 V = 1 A' });
        S.scope(g, 16, sy, W - 32, sh, { tdiv, traces });
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
    }
  });

  /* =============================================================== 3. Zener regulator */
  const ZENERS = {
    z33: { label: '3.3 V (BZX55C3V3)', vz: 3.3, rz: 40 },
    z51: { label: '5.1 V (BZX55C5V1)', vz: 5.1, rz: 15 },
    z62: { label: '6.2 V (BZX55C6V2)', vz: 6.2, rz: 4 },
    z91: { label: '9.1 V (BZX55C9V1)', vz: 9.1, rz: 6 },
    z12: { label: '12 V (BZX55C12)', vz: 12, rz: 10 }
  };
  const PZMAX = 0.5;
  /* the simulator's Zener passes 1 mA at vz; shift it so the rated voltage falls at 5 mA,
     and add the dynamic resistance in series */
  const zModel = z => z.vz - VT300 * Math.log(5) - 0.005 * z.rz;

  Hyper.sim('dio-zener', {
    title: 'Zener regulator: load line and regulation',
    blurb: `A resistor from the unregulated input feeds the output; the Zener takes whatever current the load does not, and so holds the voltage. The models are 500 mW BZX55-series parts with typical dynamic resistance.

- On the load-line graph, the operating point is where the resistor's line meets the Zener's steep curve. Lower the load resistance: the line swings down, and once it passes under the knee the output collapses — the regulator has **dropped out**.
- Switch the graph to *output against load current*: flat until the Zener current runs out, then a straight fall. The flat part's slope is the load regulation.
- Remove the load and raise the input: the Zener now carries everything. Watch its power against the 500 mW rating (the dashed hyperbola).
- Compare the 3.3 V and 6.2 V parts: low-voltage Zeners have a soft knee and regulate poorly.`,
    mount(box, kit, params) {
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.34, minH: 220, maxH: 270 });
      const GRAPHS = [['Load line on the Zener curve', 'line'], ['Output against load current', 'load'], ['Output against input voltage', 'input']];
      const ctl = kit.controls(box.side, [
        { id: 'z', type: 'select', label: 'Zener diode (500 mW)', options: Object.keys(ZENERS).map(k => [ZENERS[k].label, k]), value: ZENERS[params.z] ? params.z : 'z51' },
        { id: 'vin', label: 'Input voltage', min: 0, max: 24, step: 0.1, value: 12, unit: 'V' },
        { id: 'r', label: 'Series resistor R', min: 22, max: 4700, value: 330, log: true, sig: 2, fmt: fmtR(kit) },
        { id: 'load', type: 'check', label: 'Connect the load', value: true },
        { id: 'rl', label: 'Load resistance', min: 22, max: 100e3, value: 1000, log: true, sig: 2, fmt: fmtR(kit) },
        { id: 'graph', type: 'select', label: 'Graph', options: GRAPHS, value: GRAPHS.some(x => x[1] === params.graph) ? params.graph : 'line' }
      ], () => solve());
      const ro = kit.readout(box.side, [['vo', 'Output voltage'], ['ir', 'Current in R'], ['iz', 'Zener current'], ['il', 'Load current'],
        ['pz', 'Zener power (500 mW max)'], ['pr', 'Resistor power'], ['eff', 'Efficiency'], ['st', 'State']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'V' }, y: { label: 'A' } }, 260);
      const V = ctl.values;
      let sol = { vout: 0, ir: 0, iz: 0, il: 0 }, ph = { r: 0, z: 0, l: 0 };

      function run(vin, rl, il) {
        const z = ZENERS[V.z] || ZENERS.z51;
        const c = new kit.Circuit();
        c.V('in', 'gnd', vin);
        const R = c.R('in', 'out', V.r);
        c.R('out', 'zk', z.rz);
        const D = c.D('gnd', 'zk', { vz: zModel(z) });
        let L = null;
        if (il != null) c.I('out', 'gnd', il);
        else if (rl) L = c.R('out', 'gnd', rl);
        c.dc();
        return { vout: c.v('out'), ir: R.i, iz: -D.i, il: L ? L.i : (il || 0) };
      }
      function solve() {
        const z = ZENERS[V.z] || ZENERS.z51, rl = V.load ? V.rl : 0;
        sol = run(V.vin, rl);
        const pz = sol.vout * sol.iz, pr = sol.ir * sol.ir * V.r, pin = V.vin * sol.ir;
        const C = kit.colors();
        ro.set('vo', kit.eng(sol.vout, 'V'));
        ro.set('ir', kit.eng(sol.ir, 'A'));
        ro.set('iz', eng0(kit, sol.iz, 'A'));
        ro.set('il', kit.eng(sol.il, 'A'));
        ro.set('pz', eng0(kit, pz, 'W', 1e-8) + (pz > PZMAX ? '  — too much!' : ''));
        ro.set('pr', kit.eng(pr, 'W'));
        ro.set('eff', pin > 1e-9 ? (100 * sol.vout * sol.il / pin).toFixed(0) + ' %' : '—');
        ro.set('st', pz > PZMAX ? 'Zener overloaded' : sol.iz < 1e-3 ? 'dropped out (I_Z < 1 mA)' : 'regulating');
        const vzm = zModel(z);
        const zCurve = imax => {
          const pts = [[0, 0]];
          for (let k = 0; k <= 120; k++) { const i = 1e-6 * Math.pow(imax * 2 / 1e-6, k / 120); pts.push([vzm + VT300 * Math.log(i / 1e-3) + i * z.rz, i]); }
          return pts;
        };
        if (V.graph === 'line') {
          const vth = rl ? V.vin * rl / (V.r + rl) : V.vin, rth = rl ? V.r * rl / (V.r + rl) : V.r;
          const xmax = Math.max(vth, z.vz) + 1.5, ymax = 1.15 * Math.max(V.vin / V.r, 0.002);
          const ll = [[0, vth / rth], [vth, 0]];
          const hyp = [];
          for (let k = 0; k <= 60; k++) { const v = Math.max(0.5, z.vz - 2) + (xmax - Math.max(0.5, z.vz - 2)) * k / 60; hyp.push([v, PZMAX / v < ymax * 1.5 ? PZMAX / v : NaN]); }
          plot.set({
            x: { label: 'voltage across the Zener (V)', min: 0, max: xmax }, y: { label: 'Zener current (A)', min: 0, max: ymax },
            series: [{ pts: zCurve(ymax), label: 'Zener ' + z.vz + ' V', color: C.accent, width: 2.6 }, { pts: ll, label: 'load line of R and R_L', color: C.warn, width: 1.8 },
              { pts: hyp, label: '500 mW limit', color: C.bad, dash: [6, 4], width: 1.4 }],
            marks: [{ x: sol.vout, y: Math.max(0, sol.iz), label: 'operating point' }], hlines: [], vlines: []
          });
        } else if (V.graph === 'load') {
          const imax = Math.max(1e-3, V.vin / V.r * 0.98), pts = [];
          for (let k = 0; k <= 80; k++) { const il = imax * k / 80; pts.push([il, run(V.vin, 0, il).vout]); }
          const idrop = Math.max(0, (V.vin - z.vz) / V.r - 1e-3);
          plot.set({
            x: { label: 'load current (A)', min: 0, max: imax }, y: { label: 'output voltage (V)', min: 0, max: Math.max(V.vin, z.vz) * 1.1 },
            series: [{ pts, label: 'V_out', color: C.accent, width: 2.6 }],
            marks: V.load ? [{ x: sol.il, y: sol.vout, label: 'now' }] : [], vlines: idrop > 0 ? [{ x: idrop, label: 'drop-out' }] : [], hlines: [{ y: z.vz, label: z.vz + ' V' }]
          });
        } else {
          const pts = [], ideal = [];
          for (let k = 0; k <= 96; k++) { const vi = 24 * k / 96; pts.push([vi, run(vi, rl).vout]); ideal.push([vi, vi]); }
          plot.set({
            x: { label: 'input voltage (V)', min: 0, max: 24 }, y: { label: 'output voltage (V)', min: 0, max: Math.max(z.vz * 1.6, 6) },
            series: [{ pts, label: 'V_out', color: C.accent, width: 2.6 }, { pts: ideal, label: 'V_out = V_in', color: C.faint, dash: [5, 4], width: 1.3 }],
            marks: [{ x: V.vin, y: sol.vout, label: 'now' }], vlines: [], hlines: [{ y: z.vz, label: z.vz + ' V' }]
          });
        }
      }
      function draw(dt) {
        const C = kit.colors(), g = st.begin(), W = st.W, Hh = st.H;
        const z = ZENERS[V.z] || ZENERS.z51;
        const xs = Math.max(50, W * 0.09), xz = W * 0.42, xm = W * 0.52, xl = W * 0.66, top = Hh * 0.2, bot = Hh * 0.84, mid = (top + bot) / 2;
        dt = dt || 0;
        ph.r += dt * speed(sol.ir); ph.z += dt * speed(sol.iz); ph.l += dt * speed(sol.il);
        S.wire(g, [[xs, mid - 26], [xs, top], [xs + 40, top]]);
        S.battery(g, xs, mid - 26, xs, mid + 26, { label: 'V_in', value: kit.eng(V.vin, 'V') });
        S.resistor(g, xs + 40, top, xz - 40, top, { label: 'R', value: kit.eng(V.r, 'Ω') });
        S.wire(g, [[xz - 40, top], [xl - 36, top]]);
        S.diode(g, xz, bot - 14, xz, top + 14, { kind: 'zener', label: z.vz + ' V', color: sol.iz > 1e-3 ? C.text : C.muted });
        S.wire(g, [[xz, top], [xz, top + 14]]); S.wire(g, [[xz, bot - 14], [xz, bot]]);
        S.wire(g, [[xm, top], [xm, mid - 16]]);
        S.meter(g, xm, mid, 'V', kit.eng(sol.vout, 'V'));
        S.wire(g, [[xm, mid + 16], [xm, bot]]);
        S.switch(g, xl - 36, top, xl, top, { closed: V.load });
        S.resistor(g, xl, top, xl, bot, { label: 'R_L', value: kit.eng(V.rl, 'Ω'), color: V.load ? C.text : C.faint });
        S.wire(g, [[xs, mid + 26], [xs, bot], [xl, bot]]);
        S.node(g, xz, top); S.node(g, xz, bot); S.node(g, xm, top); S.node(g, xm, bot);
        S.ground(g, (xs + xz) / 2, bot);
        S.flow(g, [[xs, mid - 26], [xs, top], [xz, top]], ph.r, { color: C.warn });
        S.flow(g, [[xz, bot], [xs, bot], [xs, mid + 26]], ph.r, { color: C.warn });
        S.flow(g, [[xz, top], [xz, bot]], ph.z, { color: C.accent });
        if (V.load) S.flow(g, [[xz, top], [xl, top], [xl, bot], [xz, bot]], ph.l, { color: C.ok });
        kit.label(g, 'I_R = ' + kit.eng(sol.ir, 'A'), xs + 50, top + 18, { size: 12, color: C.warn });
        kit.label(g, 'I_Z = ' + eng0(kit, sol.iz, 'A'), xz - 12, bot + 14, { size: 12, color: C.accent, align: 'right' });
        kit.label(g, 'I_L = ' + kit.eng(sol.il, 'A'), xl + 12, bot + 14, { size: 12, color: C.ok });
        const pz = sol.vout * sol.iz;
        kit.label(g, 'P_Z = ' + eng0(kit, pz, 'W', 1e-8), W * 0.8, top, { size: 12.5, color: pz > PZMAX ? C.bad : C.muted, weight: 600 });
        kit.label(g, sol.iz < 1e-3 ? 'dropped out' : 'regulating', W * 0.8, top + 22, { size: 12.5, color: sol.iz < 1e-3 ? C.bad : C.ok, weight: 600 });
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* =============================================================== 4. clippers and clampers */
  const D4148 = { is: 2.52e-9, n: 1.752 };
  Hyper.sim('dio-shaper', {
    title: 'Clippers and clampers on the oscilloscope',
    blurb: `A 1 kHz signal (yellow) goes through a diode network; the output (blue) is what reaches the next stage. The diodes are 1N4148s, solved in time by the simulator.

- **Clippers** cut off what goes beyond a level: the shunt clipper at the bias plus one diode drop, the two-diode limiter at about ±0.6 V whatever the input, the Zener pair at about ±5.3 V.
- **Clampers** keep the shape and shift it: the capacitor charges to the peak on the first cycle, and after that the whole waveform sits above (or below) the clamp level. Press Reset to watch the first cycle.
- Try the square wave with a clamper — this is how a video signal gets its black level back.`,
    mount(box, kit, params) {
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 400, maxH: 620 });
      const MODES = [['Shunt clipper with a bias', 'clip'], ['Two-diode limiter', 'limit'], ['Back-to-back 4.7 V Zeners', 'zener'],
        ['Positive clamper', 'clampP'], ['Negative clamper', 'clampN'], ['Biased clamper', 'clampB']];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Circuit', options: MODES, value: MODES.some(m => m[1] === params.mode) ? params.mode : 'clip' },
        { id: 'wave', type: 'select', label: 'Input waveform', options: [['Sine', 'sine'], ['Triangle', 'tri'], ['Square', 'square']], value: 'sine' },
        { id: 'amp', label: 'Input amplitude (peak)', min: 0.5, max: 10, step: 0.1, value: 8, unit: 'V' },
        { id: 'vb', label: 'Bias voltage V_B', min: -5, max: 5, step: 0.1, value: 2, unit: 'V' }
      ], () => rebuild());
      const ro = kit.readout(box.side, [['max', 'Output maximum'], ['min', 'Output minimum'], ['avg', 'Output average (DC)'], ['x', 'Diode peak current']]);
      const V = ctl.values;
      const F = 1000, NPER = 400, DT = 1 / F / NPER, TDIV = 0.2e-3;
      let c, cap, diodes, buf, tStart, armed, count, per;

      const wave = t => {
        const s = Math.sin(2 * Math.PI * F * t);
        if (V.wave === 'tri') return V.amp * 2 / Math.PI * Math.asin(Math.max(-1, Math.min(1, s)));
        if (V.wave === 'square') return s >= 0 ? V.amp : -V.amp;
        return V.amp * s;
      };
      const clampMode = () => V.mode.indexOf('clamp') === 0;
      function rebuild() {
        c = new kit.Circuit();
        c.V('in', 'gnd', wave);
        cap = null; diodes = [];
        if (!clampMode()) {
          c.R('in', 'out', 1000);
          if (V.mode === 'clip') { diodes.push(c.D('out', 'bias', D4148)); c.V('bias', 'gnd', V.vb); }
          else if (V.mode === 'limit') { diodes.push(c.D('out', 'gnd', D4148)); diodes.push(c.D('gnd', 'out', D4148)); }
          else { diodes.push(c.D('out', 'm', { vz: 4.7 })); diodes.push(c.D('gnd', 'm', { vz: 4.7 })); }
        } else {
          cap = c.C('in', 'out', 1e-6, 0);
          if (V.mode === 'clampP') diodes.push(c.D('gnd', 'out', D4148));
          else if (V.mode === 'clampN') diodes.push(c.D('out', 'gnd', D4148));
          else { diodes.push(c.D('bias', 'out', D4148)); c.V('bias', 'gnd', V.vb); }
          c.R('out', 'gnd', 100e3);
        }
        c.reset();
        buf = []; tStart = 0; armed = false; count = 0;
        per = { max: -Infinity, min: Infinity, sum: 0, n: 0, ipk: 0 };
        ctl.show('vb', V.mode === 'clip' || V.mode === 'clampB');
        for (const k of ['max', 'min', 'avg', 'x']) ro.set(k, '…');
      }
      function frame() {
        for (let k = 0; k < 12; k++) {
          c.step(DT); count++;
          const vo = c.v('out');
          per.max = Math.max(per.max, vo); per.min = Math.min(per.min, vo); per.sum += vo; per.n++;
          for (const d of diodes) per.ipk = Math.max(per.ipk, Math.abs(d.i));
          if (count % NPER === 0) {
            ro.set('max', kit.eng(per.max, 'V')); ro.set('min', kit.eng(per.min, 'V'));
            ro.set('avg', eng0(kit, per.sum / per.n, 'V', 1e-6)); ro.set('x', kit.eng(per.ipk, 'A'));
            per = { max: -Infinity, min: Infinity, sum: 0, n: 0, ipk: 0 };
            if (armed) { armed = false; buf = []; tStart = c.t; }
          }
          if (!armed) {
            buf.push([c.t - tStart, c.v('in'), vo]);
            if (c.t - tStart >= 10 * TDIV - DT / 2) armed = true;
          }
        }
        draw();
      }
      function draw() {
        const C = kit.colors(), g = st.begin(), W = st.W, Hh = st.H;
        const x0 = 70, top = 36, bot = 150, mid = (top + bot) / 2, xo = x0 + 220, xl = xo + 110;
        S.vsource(g, x0, top + 30, x0, bot - 30, { ac: true, label: 'in', value: kit.eng(V.amp, 'V') + ' peak' });
        S.wire(g, [[x0, top + 30], [x0, top], [x0 + 60, top]]);
        S.wire(g, [[x0, bot - 30], [x0, bot], [xl, bot]]);
        if (!clampMode()) S.resistor(g, x0 + 60, top, xo - 40, top, { label: 'R', value: '1 kΩ' });
        else S.capacitor(g, x0 + 60, top, xo - 40, top, { label: 'C', value: '1 µF', scale: 1 });
        S.wire(g, [[xo - 40, top], [xl, top]]);
        S.node(g, xo, top); S.node(g, xo, bot);
        const m = V.mode;
        if (m === 'clip') {
          S.diode(g, xo, top, xo, mid);
          S.battery(g, xo, mid, xo, bot, { label: 'V_B', value: kit.eng(V.vb, 'V') });
        } else if (m === 'limit') {
          S.wire(g, [[xo - 22, top], [xo + 22, top]]); S.wire(g, [[xo - 22, bot], [xo + 22, bot]]);
          S.diode(g, xo - 22, top, xo - 22, bot, { label: '' });
          S.diode(g, xo + 22, bot, xo + 22, top);
        } else if (m === 'zener') {
          S.diode(g, xo, top, xo, mid, { kind: 'zener', label: '4.7 V' });
          S.diode(g, xo, bot, xo, mid, { kind: 'zener', label: '4.7 V' });
        } else if (m === 'clampP') S.diode(g, xo, bot, xo, top);
        else if (m === 'clampN') S.diode(g, xo, top, xo, bot);
        else {
          S.battery(g, xo, mid, xo, bot, { label: 'V_B', value: kit.eng(V.vb, 'V') });
          S.diode(g, xo, mid, xo, top);
        }
        if (clampMode()) S.resistor(g, xl, top, xl, bot, { label: 'load', value: '100 kΩ' });
        else S.wire(g, [[xl, top], [xl + 30, top]]);
        S.ground(g, (x0 + xo) / 2, bot);
        kit.label(g, 'CH1', x0 + 8, top - 14, { size: 11, color: '#f4e04d', weight: 700 });
        kit.label(g, 'CH2 (out)', xl - 20, top - 14, { size: 11, color: '#4dd6f4', weight: 700 });
        const note = { clip: 'clips above V_B + 0.6 V', limit: 'limits to about ±0.6 V', zener: 'limits to about ±(4.7 + 0.6) V', clampP: 'lowest point clamped near −0.6 V', clampN: 'highest point clamped near +0.6 V', clampB: 'lowest point clamped near V_B − 0.6 V' }[m];
        kit.label(g, note, xl + 90, mid, { size: 12.5, color: C.muted });
        if (cap) kit.label(g, 'capacitor holds ' + kit.eng(cap.vc || 0, 'V'), xl + 90, mid + 22, { size: 12.5, color: C.accent });
        const vdiv = vdivFor(clampMode() ? 2 * V.amp : V.amp);
        const sy = 184, sh = Math.max(150, Hh - sy - 28);
        S.scope(g, 16, sy, W - 32, sh, {
          tdiv: TDIV,
          traces: [{ pts: buf.map(p => [p[0], p[1]]), vdiv, label: 'IN' }, { pts: buf.map(p => [p[0], p[2]]), vdiv, label: 'OUT' }]
        });
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
    }
  });

  /* =============================================================== 5. voltage multipliers */
  Hyper.sim('dio-multiplier', {
    title: 'Voltage multiplier charging up',
    blurb: `A Cockcroft–Walton ladder: each stage adds a clamper and a peak detector, pumping charge up the ladder once per cycle. One stage is the Greinacher doubler. The slow timebase shows forty cycles across the screen; each capacitor is labelled with its voltage.

- With no load the output creeps up, step by step, towards $2N V_p$ less the diode drops. The more stages, the more cycles it takes.
- Connect the load: the output settles lower and ripples. The drop grows roughly with the cube of the number of stages, which is why long ladders are only used for tiny currents.
- Raise the frequency: the same capacitors now lose far less voltage — the reason modern multipliers run at tens of kilohertz.`,
    mount(box, kit, params) {
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 420, maxH: 640 });
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Stages N', min: 1, max: 4, step: 1, value: params.n >= 1 && params.n <= 4 ? params.n : 2 },
        { id: 'amp', label: 'Input amplitude (peak)', min: 5, max: 20, step: 0.5, value: 10, unit: 'V' },
        { id: 'f', type: 'select', label: 'Frequency', options: [['50 Hz', 50], ['1 kHz', 1000], ['20 kHz', 20000]], value: 50 },
        { id: 'c', label: 'Each capacitor', min: 0.1e-6, max: 100e-6, value: 10e-6, log: true, sig: 2, fmt: v => kit.eng(v, 'F') },
        { id: 'load', type: 'check', label: 'Connect the load', value: false },
        { id: 'rl', label: 'Load resistance', min: 10e3, max: 10e6, value: 100e3, log: true, sig: 2, fmt: fmtR(kit) },
        { type: 'buttons', items: [{ id: 'restart', label: 'Discharge and start again', primary: true }] }
      ], () => rebuild());
      const ro = kit.readout(box.side, [['vo', 'Output'], ['ideal', 'Ideal, no load: 2N·V_p'], ['cyc', 'Cycles since start'], ['rip', 'Ripple (last cycle)'],
        ['il', 'Load current'], ['drop', 'Theory: drop under load'], ['rth', 'Theory: ripple']]);
      const V = ctl.values;
      const NPER = 200;
      let c, N, caps, buf, tStart, count, T, dt, tdiv, cyc, lastMax, lastMin, curMax, curMin;

      function rebuild() {
        N = Math.max(1, Math.min(4, Math.round(V.n)));
        T = 1 / V.f; dt = T / NPER; tdiv = 4 * T;
        c = new kit.Circuit();
        c.V('in', 'gnd', t => V.amp * Math.sin(2 * Math.PI * V.f * t), { r: 1 });
        caps = [];
        for (let k = 1; k <= N; k++) {
          const aP = k === 1 ? 'in' : 'a' + (k - 1), bP = k === 1 ? 'gnd' : 'b' + (k - 1);
          caps.push({ el: c.C(aP, 'a' + k, V.c, 0), row: 0, k });
          c.D(bP, 'a' + k, D4148);
          c.D('a' + k, 'b' + k, D4148);
          caps.push({ el: c.C(bP, 'b' + k, V.c, 0), row: 1, k });
        }
        if (V.load) c.R('b' + N, 'gnd', V.rl);
        c.reset();
        buf = []; tStart = 0; count = 0; cyc = 0;
        lastMax = lastMin = 0; curMax = -Infinity; curMin = Infinity;
        ro.set('ideal', kit.eng(2 * N * V.amp, 'V'));
        theory(0);
      }
      /* the classic Cockcroft–Walton estimates at the present load current */
      function theory(il) {
        const k = il / (V.f * V.c);
        ro.set('drop', V.load ? '≈ ' + kit.eng(k * (2 * N * N * N / 3 + N * N / 2 - N / 6), 'V') + ' at this current' : 'no load');
        ro.set('rth', V.load ? '≈ ' + kit.eng(k * N * (N + 1) / 2, 'V') : 'no load');
      }
      function frame() {
        for (let s = 0; s < 40; s++) {
          c.step(dt); count++;
          const vo = c.v('b' + N);
          curMax = Math.max(curMax, vo); curMin = Math.min(curMin, vo);
          if (count % NPER === 0) { cyc++; lastMax = curMax; lastMin = curMin; curMax = -Infinity; curMin = Infinity; }
          if (count % 4 === 0) buf.push([c.t - tStart, c.v('in'), vo]);
          if (c.t - tStart >= 10 * tdiv - dt / 2) { buf = []; tStart = c.t; }
        }
        const vo = c.v('b' + N);
        ro.set('vo', kit.eng(vo, 'V'));
        ro.set('cyc', String(cyc));
        ro.set('rip', cyc ? kit.eng(lastMax - lastMin, 'V') : '…');
        ro.set('il', V.load ? kit.eng(vo / V.rl, 'A') : 'no load');
        if (count % NPER < 40) theory(V.load ? vo / V.rl : 0);
        draw();
      }
      function draw() {
        const C = kit.colors(), g = st.begin(), W = st.W, Hh = st.H;
        const sw = Math.min(150, (W - 250) / N), x0 = 120, yt = 52, yb = 138;
        const xa = k => x0 + (k - 0.5) * sw, xb = k => x0 + k * sw;
        S.vsource(g, xa(0), yb, xa(0), yt, { ac: true, label: kit.eng(V.amp, 'V'), value: 'peak' });
        S.wire(g, [[xa(0), yb], [xb(0), yb]]);
        S.ground(g, xb(0), yb);
        for (const cp of caps) {
          const k = cp.k, vc = kit.eng(cp.el.vc || 0, 'V');
          if (cp.row === 0) S.capacitor(g, xa(k - 1), yt, xa(k), yt, { label: 'C' + (2 * k - 1), value: vc });
          else S.capacitor(g, xb(k - 1), yb, xb(k), yb, { label: 'C' + (2 * k), value: vc, labelOffset: -22 });
        }
        for (let k = 1; k <= N; k++) {
          S.diode(g, xb(k - 1), yb, xa(k), yt, { color: C.text });
          S.diode(g, xa(k), yt, xb(k), yb, { color: C.text });
          S.node(g, xa(k), yt); S.node(g, xb(k), yb);
        }
        const xo = xb(N) + 50;
        S.wire(g, [[xb(N), yb], [xo, yb]]);
        if (V.load) { S.resistor(g, xo, yb, xo, yb + 56, { label: 'R_L', value: kit.eng(V.rl, 'Ω') }); S.ground(g, xo, yb + 56); }
        else kit.label(g, 'no load', xo + 6, yb + 22, { size: 11.5, color: C.faint });
        kit.label(g, 'OUT ' + kit.eng(c.v('b' + N), 'V'), xb(N) - 10, yb + 50, { size: 13, color: '#4dd6f4', weight: 700, align: 'right' });
        const sy = 212, sh = Math.max(150, Hh - sy - 28);
        const vdivO = vdivFor(N * V.amp), vdivI = 2 * vdivFor(V.amp);
        S.scope(g, 16, sy, W - 32, sh, {
          tdiv,
          traces: [{ pts: buf.map(p => [p[0], p[1]]), vdiv: vdivI, offset: 2, label: 'IN' }, { pts: buf.map(p => [p[0], p[2]]), vdiv: vdivO, offset: -4, label: 'OUT' }]
        });
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
    }
  });

  /* =============================================================== 6. flyback */
  Hyper.sim('dio-flyback', {
    title: 'Switching a relay coil: the inductive kick',
    blurb: `A transistor switches a 12 V relay coil (400 Ω, 30 mA). When it turns off, the coil insists on keeping its current flowing, and the collector voltage goes wherever it must to make that happen. Here 100 pF of stray capacitance and the transistor's own avalanche breakdown at about 60 V are all that stop it. CH1: collector voltage. CH2: coil current.

- **No protection:** a spike far above the transistor's 45 V rating. The coil's energy is dumped into the transistor as avalanche breakdown, every time it switches off.
- **Flyback diode:** the collector never goes above 12.7 V. The current circulates through the diode and dies away slowly, with the time constant $L/R$ — the relay releases late.
- **Diode + Zener** and **diode + resistor:** a higher but safe clamp voltage, and a much faster decay. Tick *zoom* to see the turn-off at 50 µs per division.`,
    mount(box, kit, params) {
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 440, maxH: 660 });
      const MODES = [['No protection', 'none'], ['Flyback diode (1N4148)', 'diode'], ['Diode + 24 V Zener', 'zener'], ['Diode + 1 kΩ resistor', 'res']];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Protection', options: MODES, value: MODES.some(m => m[1] === params.mode) ? params.mode : 'none' },
        { id: 'l', label: 'Coil inductance', min: 0.05, max: 1, value: 0.25, log: true, sig: 2, fmt: v => kit.eng(v, 'H') },
        { id: 'zoom', type: 'check', label: 'Zoom on the turn-off (50 µs/div)', value: false }
      ], id => { if (id !== 'zoom') rebuild(); });
      const ro = kit.readout(box.side, [['ion', 'Coil current, switched on'], ['vpk', 'Peak collector voltage'], ['t10', 'Current falls to 10 % in'],
        ['e', 'Energy ½LI² at turn-off'], ['where', 'Energy ends up in'], ['rate', 'Transistor rating V_CEO']]);
      const V = ctl.values;
      const VCC = 12, RC = 400, TON = 0.5e-3, TOFF = 5e-3, TEND = 10e-3;
      let data = [], stats = {}, reveal = 0, hold = 0;

      function rebuild() {
        const c = new kit.Circuit();
        c.V('vcc', 'gnd', VCC);
        c.R('vcc', 'm', RC);
        const Lc = c.L('m', 'col', V.l, 0);
        c.V('drv', 'gnd', t => (t >= TON && t < TOFF ? 5 : 0));
        c.R('drv', 'b', 1000);
        c.NPN('col', 'b', 'gnd', { beta: 200 });
        c.C('col', 'gnd', 100e-12);
        c.D('gnd', 'col', { vz: 60 });                 // the transistor's avalanche breakdown
        if (V.mode === 'diode') c.D('col', 'vcc', D4148);
        else if (V.mode === 'zener') { c.D('col', 'zz', D4148); c.D('vcc', 'zz', { vz: 24 }); }
        else if (V.mode === 'res') { c.D('col', 'rr', D4148); c.R('rr', 'vcc', 1000); }
        c.reset();
        data = [];
        let ion = 0, vpk = 0, t10 = null;
        while (c.t < TEND) {
          const fine = c.t > TOFF - 10e-6 && c.t < TOFF + 700e-6;
          c.step(fine ? 0.2e-6 : 5e-6);
          const i = Lc.i, v = c.v('col');
          if (c.t < TOFF) ion = i;
          else { vpk = Math.max(vpk, v); if (t10 == null && Math.abs(i) < 0.1 * ion) t10 = c.t - TOFF; }
          data.push([c.t, v, i]);
        }
        stats = { ion, vpk, t10, e: 0.5 * V.l * ion * ion };
        ro.set('ion', kit.eng(ion, 'A'));
        ro.set('vpk', kit.eng(vpk, 'V'));
        ro.set('t10', t10 != null ? kit.eng(t10, 's') : '> 5 ms');
        ro.set('e', kit.eng(stats.e, 'J'));
        ro.set('where', { none: 'the transistor (avalanche)', diode: 'the coil resistance and diode', zener: 'mostly the Zener', res: 'the 1 kΩ resistor and the coil' }[V.mode]);
        ro.set('rate', '45 V' + (vpk > 45 ? ' — exceeded!' : ' — safe'));
        reveal = 0; hold = 0;
      }
      function draw(dt) {
        const C = kit.colors(), g = st.begin(), W = st.W, Hh = st.H;
        const t0 = V.zoom ? TOFF - 50e-6 : 0, tdiv = V.zoom ? 50e-6 : 1e-3, span = 10 * tdiv;
        if (hold > 0) { hold -= dt || 0; if (hold <= 0) reveal = 0; }
        else { reveal += (dt || 0) / 1.6 * span; if (reveal >= span) { reveal = span; hold = 1.2; } }
        const x1 = Math.max(230, W * 0.36), x2 = x1 + 80, yr = 40, yc = 160;
        S.rail(g, x1, yr, '+12 V');
        S.wire(g, [[x1, yr], [x2, yr]]);
        S.resistor(g, x1, yr, x1, yr + 50, { label: 'coil R', value: '400 Ω', labelOffset: -70 });
        S.inductor(g, x1, yr + 50, x1, yc - 10, { core: true, label: 'coil L', value: kit.eng(V.l, 'H'), labelOffset: -70 });
        S.wire(g, [[x1, yc - 10], [x1, yc + 5]]);
        S.wire(g, [[x1, yc], [x2, yc]]);
        S.node(g, x1, yc); S.node(g, x1, yr);
        const ym = (yr + yc) / 2;
        if (V.mode === 'none') kit.label(g, 'nothing here', x2 + 8, ym, { size: 11.5, color: C.faint });
        else if (V.mode === 'diode') S.diode(g, x2, yc, x2, yr, { label: '1N4148' });
        else if (V.mode === 'zener') { S.diode(g, x2, yc, x2, ym); S.diode(g, x2, yr, x2, ym, { kind: 'zener', label: '24 V' }); }
        else { S.diode(g, x2, yc, x2, ym); S.resistor(g, x2, ym, x2, yr, { label: '1 kΩ' }); }
        if (V.mode === 'none') S.wire(g, [[x2, yc], [x2, yc - 12]], { color: C.faint });
        const q = S.npn(g, x1 - 8, yc + 35, { label: 'BC337' });
        S.ground(g, q.e[0], q.e[1]);
        S.resistor(g, q.b[0] - 70, q.b[1], q.b[0], q.b[1], { label: 'R_B', value: '1 kΩ' });
        const xg = q.b[0] - 100;
        S.wire(g, [[q.b[0] - 70, q.b[1]], [xg, q.b[1]]]);
        S.vsource(g, xg, q.b[1], xg, q.b[1] + 50, { ac: true, label: 'drive', value: '0/5 V' });
        S.ground(g, xg, q.b[1] + 50);
        kit.label(g, 'CH1', x1 + 8, yc + 14, { size: 11, color: '#f4e04d', weight: 700 });
        const warn = stats.vpk > 45;
        kit.label(g, 'peak ' + kit.eng(stats.vpk || 0, 'V'), x2 + 90, yr + 10, { size: 13, weight: 700, color: warn ? C.bad : C.ok });
        kit.label(g, warn ? 'above the 45 V rating: avalanche' : 'clamped safely', x2 + 90, yr + 32, { size: 12, color: warn ? C.bad : C.muted });
        kit.label(g, 'switch-off at 5 ms', x2 + 90, yr + 54, { size: 12, color: C.muted });
        const sy = 280, sh = Math.max(150, Hh - sy - 28);
        const vdivV = vdivFor(Math.max(15, stats.vpk || 15) * 0.55);
        const shown = data.filter(p => p[0] >= t0 && p[0] <= t0 + reveal);
        S.scope(g, 16, sy, W - 32, sh, {
          tdiv, t0,
          traces: [
            { pts: shown.map(p => [p[0], p[1]]), vdiv: vdivV, offset: -3, label: 'V_CE' },
            { pts: shown.map(p => [p[0], p[2] * 100]), vdiv: 1, offset: -3, label: 'I coil, 1 V = 10 mA' }
          ]
        });
      }
      rebuild();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* =============================================================== 7. LEDs */
  const LEDS = {
    ir: { label: 'Infrared, 940 nm', vf20: 1.25, rs: 2, glow: '#b06cff', vis: false },
    red: { label: 'Red, 630 nm', vf20: 2.0, rs: 10, glow: '#ff3b30', vis: true },
    yellow: { label: 'Yellow, 590 nm', vf20: 2.1, rs: 10, glow: '#ffd21f', vis: true },
    green: { label: 'Green (InGaN), 525 nm', vf20: 3.0, rs: 10, glow: '#2fd35a', vis: true },
    blue: { label: 'Blue, 470 nm', vf20: 3.1, rs: 10, glow: '#3b82ff', vis: true },
    white: { label: 'White (blue + phosphor)', vf20: 3.2, rs: 10, glow: '#f4f4ff', vis: true }
  };
  for (const k in LEDS) LEDS[k].is = ledIs(LEDS[k].vf20, 2, LEDS[k].rs);
  const E12 = [1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2, 10];
  function e12Up(v) {
    if (!(v > 0)) return 0;
    const d = Math.pow(10, Math.floor(Math.log10(v)));
    for (const m of E12) if (m * d >= v * 0.999) return Number((m * d).toPrecision(3));
    return 10 * d;
  }

  /* the optocoupler: an infrared LED and a phototransistor (PC817-type) */
  const OPTO = { vf20: 1.2, rs: 2, beta: 300, vcc: 5 };
  OPTO.is = ledIs(OPTO.vf20, 2, OPTO.rs);

  Hyper.sim('dio-led', {
    title: 'LED and its series resistor — and the optocoupler',
    blurb: `The supply, the resistor and the LEDs are solved as a circuit. The resistor turns the LED's steep, temperature-dependent curve into a current you choose: $I = (V_s - nV_F)/R$.

- Set 5 V and a red LED: 150 Ω gives about 20 mA. Swap to a blue LED without changing the resistor: its higher forward voltage leaves less across the resistor, so less current.
- Lower the supply towards the forward voltage: the current does not fall gently to zero — below about $V_F$ the LED simply goes out. That is why a 3.3 V logic pin makes a poor driver for a 3.1 V blue LED.
- Put three white LEDs in series on 12 V: one resistor, one current, a small part of the power wasted.
- Turn the resistor right down: the current shoots past the 30 mA absolute maximum.

**Optocoupler mode:** the LED is now the infrared emitter inside an optocoupler, and its light drives a phototransistor with a pull-up resistor to 5 V. The collector current is the LED current times the **current-transfer ratio** (CTR) — until the pull-up limits it and the transistor saturates. Lower the CTR to 50 % (an aged part) with a small pull-up: the output no longer goes properly low.`,
    mount(box, kit, params) {
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.4, minH: 240, maxH: 300 });
      const opto0 = params.mode === 'opto';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Circuit', options: [['Indicator LEDs', 'led'], ['Optocoupler (PC817-type)', 'opto']], value: opto0 ? 'opto' : 'led' },
        { id: 'col', type: 'select', label: 'LED colour', options: Object.keys(LEDS).map(k => [LEDS[k].label, k]), value: LEDS[params.col] ? params.col : 'red' },
        { id: 'n', label: 'LEDs in series', min: 1, max: 4, step: 1, value: 1 },
        { id: 'vs', label: 'Supply voltage', min: 1.5, max: 24, step: 0.1, value: 5, unit: 'V' },
        { id: 'r', label: 'Series resistor', min: 10, max: 10e3, value: opto0 ? 390 : 150, log: true, sig: 2, fmt: fmtR(kit) },
        { id: 'ctr', label: 'Current-transfer ratio (CTR)', min: 20, max: 400, step: 5, value: 100, unit: '%' },
        { id: 'rl', label: 'Pull-up resistor (to 5 V)', min: 100, max: 100e3, value: 1000, log: true, sig: 2, fmt: fmtR(kit) }
      ], () => solve());
      const ro = kit.readout(box.side, [['i', 'LED current'], ['vf', 'Forward voltage, each'], ['vr', 'Voltage across R'], ['pr', 'Power in R'], ['pl', 'Power in each LED'],
        ['b', 'Brightness (20 mA = 100 %)'], ['rn', 'Resistor for 20 mA'], ['e12', 'Next E12 value up'],
        ['ic', 'Collector current'], ['vo', 'Output voltage'], ['ost', 'Output state'], ['need', 'I_F to saturate (CTR × 0.5)']]);
      const gbox = document.createElement('div');
      gbox.style.padding = '4px 10px 10px';
      box.stage.appendChild(gbox);
      const plot = kit.plot(gbox, { x: { label: 'supply voltage (V)' }, y: { label: 'current (A)' } }, 220);
      const V = ctl.values;
      const opto = () => V.mode === 'opto';
      let sol = { i: 0, vf: 0 }, out = { ic: 0, vo: OPTO.vcc }, phase = 0, phase2 = 0;

      function run(vs) {
        const L = opto() ? OPTO : (LEDS[V.col] || LEDS.red), n = opto() ? 1 : Math.max(1, Math.round(V.n));
        const c = new kit.Circuit();
        c.V('s', 'gnd', vs);
        const R = c.R('s', 'k0', V.r);
        for (let k = 0; k < n; k++) {
          c.R('k' + k, 'j' + k, L.rs);
          c.D('j' + k, k === n - 1 ? 'gnd' : 'k' + (k + 1), { is: L.is, n: 2 });
        }
        c.dc();
        const vf = n > 1 ? c.v('k0') - c.v('k1') : c.v('k0');
        return { i: R.i, vf };
      }
      /* the phototransistor: the light makes a photocurrent in its collector–base junction,
         which the transistor multiplies by (β + 1); CTR = I_C / I_F sets how much */
      function runOut(iF) {
        const c = new kit.Circuit();
        c.V('vcc', 'gnd', OPTO.vcc);
        const RL = c.R('vcc', 'c', V.rl);
        c.I('c', 'b', Math.max(0, iF) * V.ctr / 100 / (OPTO.beta + 1));
        c.NPN('c', 'b', 'gnd', { beta: OPTO.beta });
        c.dc();
        return { ic: RL.i, vo: c.v('c') };
      }
      function solve() {
        const o = opto();
        for (const k of ['i', 'vf', 'vr', 'pr', 'pl']) ro.show(k, true);
        for (const k of ['b', 'rn', 'e12']) ro.show(k, !o);
        for (const k of ['ic', 'vo', 'ost', 'need']) ro.show(k, o);
        ctl.show('col', !o); ctl.show('n', !o); ctl.show('ctr', o); ctl.show('rl', o);
        const L = o ? OPTO : (LEDS[V.col] || LEDS.red), n = o ? 1 : Math.max(1, Math.round(V.n));
        sol = run(V.vs);
        const C = kit.colors();
        const imax = o ? 0.05 : 0.03;
        ro.set('i', kit.eng(sol.i, 'A') + (sol.i > imax ? ' — over the ' + (imax * 1000) + ' mA maximum!' : ''));
        ro.set('vf', kit.eng(sol.vf, 'V'));
        ro.set('vr', kit.eng(sol.i * V.r, 'V'));
        ro.set('pr', kit.eng(sol.i * sol.i * V.r, 'W'));
        ro.set('pl', kit.eng(sol.i * sol.vf, 'W'));
        if (!o) {
          ro.set('b', (100 * sol.i / 0.02).toFixed(0) + ' %' + (L.vis ? '' : ' (invisible to the eye)'));
          const rn = (V.vs - n * L.vf20) / 0.02;
          ro.set('rn', rn > 0 ? kit.eng(rn, 'Ω') : 'supply too low');
          ro.set('e12', rn > 0 ? kit.eng(e12Up(rn), 'Ω') : '—');
          const pts = [];
          for (let k = 0; k <= 96; k++) { const vs = 24 * k / 96; pts.push([vs, Math.max(0, run(vs).i)]); }
          const ymax = Math.max(0.035, 1.1 * Math.max(sol.i, 0));
          plot.set({
            x: { label: 'supply voltage (V)', min: 0, max: 24 }, y: { label: 'LED current (A)', min: 0, max: ymax },
            series: [{ pts, label: 'current with R = ' + kit.eng(V.r, 'Ω'), color: C.accent, width: 2.4 }],
            hlines: [{ y: 0.02, label: '20 mA rated' }, { y: 0.03, label: '30 mA absolute maximum', color: C.bad }],
            vlines: [{ x: n * L.vf20, label: n + ' × V_F' }],
            marks: [{ x: V.vs, y: sol.i, label: 'now' }]
          });
        } else {
          out = runOut(sol.i);
          const icSat = (OPTO.vcc - 0.2) / V.rl;
          ro.set('ic', kit.eng(out.ic, 'A'));
          ro.set('vo', kit.eng(out.vo, 'V'));
          ro.set('ost', out.vo < 0.4 ? 'saturated: a clean logic low' : out.vo > 4.5 ? 'off: logic high' : 'NOT saturated: an invalid level');
          ro.set('need', kit.eng(icSat / (V.ctr / 100 * 0.5), 'A'));
          const pts = [], lin = [];
          for (let k = 0; k <= 60; k++) { const iF = 0.03 * k / 60; pts.push([iF * 1000, runOut(iF).ic * 1000]); lin.push([iF * 1000, iF * V.ctr / 100 * 1000]); }
          const ymax = Math.max(1.3 * icSat, 1.2 * out.ic, 1e-4) * 1000;
          plot.set({
            x: { label: 'LED current I_F (mA)', min: 0, max: 30 }, y: { label: 'collector current I_C (mA)', min: 0, max: ymax },
            series: [{ pts, label: 'I_C with R_L = ' + kit.eng(V.rl, 'Ω'), color: C.accent, width: 2.4 }, { pts: lin, label: 'CTR × I_F', color: C.faint, dash: [5, 4], width: 1.4 }],
            hlines: [{ y: icSat * 1000, label: 'saturation limit (5 V − 0.2 V)/R_L' }],
            vlines: [],
            marks: [{ x: sol.i * 1000, y: out.ic * 1000, label: 'now' }]
          });
        }
      }
      function drawLed(g, C, W, Hh, dt) {
        const L = LEDS[V.col] || LEDS.red, n = Math.max(1, Math.round(V.n));
        const xs = Math.max(50, W * 0.1), xl = W * 0.46, top = Hh * 0.14, bot = Hh * 0.88, mid = (top + bot) / 2;
        S.wire(g, [[xs, mid - 26], [xs, top], [xs + 40, top]]);
        S.battery(g, xs, mid - 26, xs, mid + 26, { label: 'V_s', value: kit.eng(V.vs, 'V') });
        S.resistor(g, xs + 40, top, xl - 30, top, { label: 'R', value: kit.eng(V.r, 'Ω') });
        S.wire(g, [[xl - 30, top], [xl, top]]);
        const seg = (bot - top) / n, lit = sol.i > 2e-5;
        const a = L.vis ? Math.sqrt(Math.max(0, sol.i) / 0.02) * 0.5 : Math.sqrt(Math.max(0, sol.i) / 0.02) * 0.15;
        for (let k = 0; k < n; k++) {
          const y1 = top + k * seg, y2 = y1 + seg;
          if (lit) halo(g, xl, (y1 + y2) / 2, Math.min(30, seg * 0.5), L.glow, a);
          S.diode(g, xl, y1, xl, y2, { kind: 'led', on: lit && a > 0.05, glow: L.glow, label: n === 1 ? L.label.split(',')[0] : '' });
        }
        S.wire(g, [[xl, bot], [xs, bot], [xs, mid + 26]]);
        S.ground(g, (xs + xl) / 2, bot);
        S.flow(g, [[xs, mid - 26], [xs, top], [xl, top], [xl, bot], [xs, bot], [xs, mid + 26]], phase, { color: C.warn });
        kit.label(g, 'I = ' + kit.eng(sol.i, 'A'), xs + 8, top + 22, { size: 12.5, color: C.warn, weight: 600 });
        const xt = W * 0.62;
        const over = sol.i > 0.03;
        kit.label(g, over ? 'over 30 mA: the LED is being destroyed' : sol.i < 1e-4 ? 'below the forward voltage: dark' : 'current set by the resistor', xt, top + 10, { size: 12.5, color: over ? C.bad : C.muted, weight: 600 });
        kit.label(g, 'V_F = ' + kit.eng(sol.vf, 'V') + ' each', xt, top + 34, { size: 12, color: C.muted });
        kit.label(g, 'R burns ' + kit.eng(sol.i * sol.i * V.r, 'W'), xt, top + 56, { size: 12, color: C.muted });
      }
      function drawOpto(g, C, W, Hh) {
        const xs = Math.max(46, W * 0.07), xl = W * 0.36, xq = W * 0.56, xo = W * 0.72, top = Hh * 0.16, bot = Hh * 0.86, mid = (top + bot) / 2;
        // input side
        S.wire(g, [[xs, mid - 26], [xs, top], [xs + 30, top]]);
        S.battery(g, xs, mid - 26, xs, mid + 26, { label: 'V_in', value: kit.eng(V.vs, 'V') });
        S.resistor(g, xs + 30, top, xl - 26, top, { label: 'R_F', value: kit.eng(V.r, 'Ω') });
        S.wire(g, [[xl - 26, top], [xl, top], [xl, mid - 22]]);
        S.diode(g, xl, mid - 22, xl, mid + 22, { kind: 'led', on: sol.i > 1e-4, glow: '#b06cff' });
        S.wire(g, [[xl, mid + 22], [xl, bot], [xs, bot], [xs, mid + 26]]);
        S.ground(g, (xs + xl) / 2, bot);
        S.flow(g, [[xs, mid - 26], [xs, top], [xl, top], [xl, bot], [xs, bot], [xs, mid + 26]], phase, { color: C.warn });
        // the package, and the light crossing the gap
        g.save(); g.setLineDash([6, 5]); g.strokeStyle = C.muted; g.lineWidth = 1.5;
        g.strokeRect(xl - 26, mid - 40, (xq + 30) - (xl - 26), 80); g.restore();
        kit.label(g, 'PC817-type, isolated', xl - 20, mid - 52, { size: 11.5, color: C.muted });
        const glowA = Math.min(1, Math.sqrt(Math.max(0, sol.i) / 0.02));
        for (const dy of [-10, 10]) kit.arrow(g, xl + 18, mid + dy, xq - 34, mid + dy, glowA > 0.05 ? '#b06cff' : C.faint, 1.6);
        const q = S.npn(g, xq, mid, { labels: false });
        // output side
        S.rail(g, q.c[0], top - 4, '+5 V');
        const yj = q.c[1] - 16;
        S.resistor(g, q.c[0], top - 4, q.c[0], yj, { label: 'R_L', value: kit.eng(V.rl, 'Ω') });
        S.wire(g, [[q.c[0], yj], q.c]);
        S.wire(g, [[q.c[0], yj], [xo, yj], [xo, mid - 16]]);
        S.node(g, q.c[0], yj);
        const good = out.vo < 0.4 || out.vo > 4.5;
        S.meter(g, xo, mid, 'V', kit.eng(out.vo, 'V'), { readingColor: good ? C.accent : C.bad });
        S.wire(g, [[xo, mid + 16], [xo, bot]]);
        S.wire(g, [q.e, [q.e[0], bot], [xo, bot]]);
        S.ground(g, (q.e[0] + xo) / 2, bot);
        S.flow(g, [[q.c[0], top - 4], q.c, q.e, [q.e[0], bot]], phase2, { color: C.warn });
        kit.label(g, 'I_C = ' + kit.eng(out.ic, 'A'), q.c[0] + 10, bot + 12, { size: 12, color: C.warn });
        kit.label(g, 'I_F = ' + kit.eng(sol.i, 'A'), xs + 8, top + 22, { size: 12, color: C.warn });
        kit.label(g, good ? (out.vo < 0.4 ? 'output low (saturated)' : 'output high') : 'output not saturated', xo + 40, top + 4, { size: 12.5, color: good ? C.ok : C.bad, weight: 600 });
      }
      function draw(dt) {
        const C = kit.colors(), g = st.begin(), W = st.W, Hh = st.H;
        phase += (dt || 0) * speed(sol.i);
        phase2 += (dt || 0) * speed(out.ic);
        if (opto()) drawOpto(g, C, W, Hh); else drawLed(g, C, W, Hh, dt);
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* =============================================================== 8. solar module */
  const SOL = { n: 1.25, isc: 6.1, vocCell: 0.615, rshCell: 15, rs: 0.3, eg: 1.12, area: 0.65, vbr: 12, shade: 0.2 };
  function cellParams(tc, G) {
    const T = tc + 273.15, nvtN = SOL.n * KQ * TNOM;
    const i0n = SOL.isc / (Math.exp(SOL.vocCell / nvtN) - 1);
    const i0 = i0n * Math.pow(T / TNOM, 3) * Math.exp(SOL.eg / (SOL.n * KQ) * (1 / TNOM - 1 / T));
    const iph = SOL.isc * G / 1000 * (1 + 0.0005 * (T - TNOM));
    return { i0, iph, nvt: SOL.n * KQ * T, nsim: SOL.n * KQ * T / VT300 };
  }
  /* k identical cells in series, from a (−) to b (+): photocurrent, one diode, shunt leakage */
  function cells(c, a, b, k, iph, p, vbr) {
    c.I(a, b, iph);
    const d = c.D(b, a, { is: p.i0, n: k * p.nsim, vz: vbr || 0 });
    c.R(b, a, k * SOL.rshCell);
    return d;
  }
  /* a 36-cell module: three strings of 12 cells, each with its bypass diode.
     Returns the shaded cell (its diode and photocurrent) when there is one. */
  function module(c, p, shade, bypass) {
    let node = 'gnd', sh = null;
    for (let s = 0; s < 3; s++) {
      const end = 'j' + (s + 1);
      if (s === 0 && shade) {
        cells(c, node, 'm', 11, p.iph, p);
        sh = { d: cells(c, 'm', end, 1, p.iph * SOL.shade, p, SOL.vbr), iph: p.iph * SOL.shade };
      } else cells(c, node, end, 12, p.iph, p);
      if (bypass) c.D(node, end, { is: 3e-7, n: 1.1 });
      node = end;
    }
    c.R('j3', 'out', SOL.rs);
    return sh;
  }

  Hyper.sim('dio-solar', {
    title: 'Solar module: I–V curve and maximum power point',
    blurb: `A 36-cell module (about 100 W) modelled cell by cell: each cell is a photocurrent source in parallel with a diode and a leakage resistance; three bypass diodes each guard a string of twelve. The upper graph is the current against voltage, the lower one the power. The dashed curves are standard test conditions (1000 W/m², 25 °C).

- Dim the light: the current falls in proportion, the voltage hardly at all — it follows the logarithm of the light.
- Heat the module to 65 °C: the open-circuit voltage falls by about 0.3 % per degree and the maximum power by about 0.4 %.
- Compare the loads: a resistor sits wherever its line crosses the curve; a battery pins the module near 13.5 V, well below the peak, and wastes 15 % or more; an MPPT controller finds the peak.
- Shade one cell to 20 %: the whole string of twelve drops out through its bypass diode, and the power curve grows two peaks. Remove the bypass diodes and see how much worse it gets — and how hard the shaded cell is being heated.`,
    mount(box, kit, params) {
      const S = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.3, minH: 200, maxH: 240 });
      const LOADS = [['Resistor', 'res'], ['12 V battery, direct (PWM controller)', 'batt'], ['MPPT charge controller', 'mppt']];
      const ctl = kit.controls(box.side, [
        { id: 'g', label: 'Irradiance', min: 0, max: 1200, step: 10, value: 1000, unit: 'W/m²' },
        { id: 't', label: 'Cell temperature', min: -10, max: 75, step: 1, value: 25, unit: '°C' },
        { id: 'load', type: 'select', label: 'Load', options: LOADS, value: LOADS.some(l => l[1] === params.load) ? params.load : 'res' },
        { id: 'r', label: 'Load resistance', min: 0.5, max: 50, value: 3.3, log: true, sig: 2, fmt: fmtR(kit) },
        { id: 'shade', type: 'check', label: 'Shade one cell to 20 %', value: !!params.shade },
        { id: 'bypass', type: 'check', label: 'Bypass diodes fitted', value: true }
      ], () => solve());
      const ro = kit.readout(box.side, [['isc', 'Short-circuit current'], ['voc', 'Open-circuit voltage'], ['mpp', 'Maximum power point'], ['ff', 'Fill factor'],
        ['eff', 'Efficiency (0.65 m²)'], ['op', 'Operating point'], ['pop', 'Power delivered'], ['hot', 'Shaded cell dissipates']]);
      const g1 = document.createElement('div'), g2 = document.createElement('div');
      g1.style.padding = '4px 10px 0'; g2.style.padding = '0 10px 10px';
      box.stage.appendChild(g1); box.stage.appendChild(g2);
      const pI = kit.plot(g1, { x: { label: 'module voltage (V)' }, y: { label: 'current (A)' } }, 200);
      const pP = kit.plot(g2, { x: { label: 'module voltage (V)' }, y: { label: 'power (W)' } }, 180);
      const V = ctl.values;
      let op = { v: 0, i: 0 }, mpp = { v: 0, i: 0, p: 0 }, hotW = 0, phase = 0;

      function sweep(G, tc, shade, bypass) {
        const p = cellParams(tc, G), pts = [];
        if (!(p.iph > 1e-6)) return { pts: [[0, 0], [1, 0]], isc: 0, voc: 0, mpp: { v: 0, i: 0, p: 0 } };
        const c = new kit.Circuit();
        module(c, p, shade, bypass);
        const src = c.V('out', 'gnd', 0);
        const vmax = 36 * p.nvt * Math.log(p.iph / p.i0 + 1) * 1.03 + 0.3;
        let best = { v: 0, i: 0, p: 0 }, voc = 0, isc = 0;
        for (let k = 0; k <= 140; k++) {
          const v = vmax * k / 140;
          src.v = v; c.dc();
          const i = -src.i;
          if (k === 0) isc = i;
          if (!c.ok || !Number.isFinite(i)) continue;
          if (i < 0) { if (pts.length) { const q = pts[pts.length - 1]; voc = q[0] + (v - q[0]) * q[1] / (q[1] - i); } pts.push([voc, 0]); break; }
          pts.push([v, i]);
          if (v * i > best.p) best = { v, i, p: v * i };
        }
        if (!voc && pts.length) voc = pts[pts.length - 1][0];
        return { pts, isc, voc, mpp: best };
      }
      const stc = sweep(1000, 25, false, true);
      /* the module with its load: a resistor, a battery behind a blocking Schottky diode,
         or (MPPT) whatever voltage gives the most power */
      function operate(p) {
        const c = new kit.Circuit();
        const sh = module(c, p, V.shade, V.bypass);
        let src = null, bat = null;
        if (V.load === 'res') c.R('out', 'gnd', V.r);
        else if (V.load === 'batt') { c.D('out', 'b', { is: 3e-7, n: 1.1 }); bat = c.V('b', 'gnd', 12.8, { r: 0.05 }); }
        else src = c.V('out', 'gnd', mpp.v);
        c.dc();
        const v = c.v('out');
        const i = V.load === 'res' ? v / V.r : V.load === 'batt' ? Math.max(0, -bat.i) : Math.max(0, -src.i);
        let hot = 0;
        if (sh) {
          const vc = c.v('j1') - c.v('m');                        // the shaded cell's own voltage
          const iout = sh.iph - sh.d.i - vc / SOL.rshCell;        // current it passes from − to +
          hot = Math.max(0, -vc * iout);                          // electrical power it absorbs
        }
        return { v, i, hot };
      }
      function solve() {
        const C = kit.colors();
        const sw = sweep(V.g, V.t, V.shade, V.bypass);
        mpp = sw.mpp;
        const p = cellParams(V.t, V.g);
        hotW = 0;
        if (!(p.iph > 1e-6)) op = { v: 0, i: 0 };
        else { const r = operate(p); op = { v: r.v, i: r.i }; hotW = r.hot; }
        ro.set('isc', kit.eng(sw.isc, 'A'));
        ro.set('voc', kit.eng(sw.voc, 'V'));
        ro.set('mpp', kit.eng(mpp.p, 'W') + ' at ' + kit.eng(mpp.v, 'V') + ', ' + kit.eng(mpp.i, 'A'));
        ro.set('ff', sw.isc > 0 && sw.voc > 0 ? (mpp.p / (sw.isc * sw.voc)).toFixed(2) : '—');
        ro.set('eff', V.g > 0 ? (100 * mpp.p / (V.g * SOL.area)).toFixed(1) + ' %' : '—');
        ro.set('op', kit.eng(op.v, 'V') + ', ' + kit.eng(op.i, 'A'));
        const pop = op.v * op.i;
        ro.set('pop', kit.eng(pop, 'W') + (mpp.p > 0 ? ' (' + (100 * pop / mpp.p).toFixed(0) + ' % of maximum)' : ''));
        ro.set('hot', V.shade ? kit.eng(hotW, 'W') : 'no shading');
        const iv = sw.pts, pv = sw.pts.map(q => [q[0], q[0] * q[1]]);
        const xmax = Math.max(26, sw.voc * 1.05), imax = Math.max(7.5, sw.isc * 1.1);
        const marks = [{ x: mpp.v, y: mpp.i, label: 'MPP', color: C.ok }, { x: op.v, y: op.i, label: 'load', color: C.warn }];
        const vl = V.load === 'res' ? [] : V.load === 'batt' ? [{ x: 13, label: 'battery' }] : [];
        const loadLine = V.load === 'res' ? [{ pts: [[0, 0], [xmax, xmax / V.r]], label: 'resistor line', color: C.warn, width: 1.4 }] : [];
        pI.set({
          x: { label: 'module voltage (V)', min: 0, max: xmax }, y: { label: 'current (A)', min: 0, max: imax },
          series: [{ pts: stc.pts, label: 'STC', color: C.faint, dash: [5, 4], width: 1.4 }, { pts: iv, label: 'now', color: C.accent, width: 2.6 }].concat(loadLine),
          marks, vlines: vl, hlines: []
        });
        pP.set({
          x: { label: 'module voltage (V)', min: 0, max: xmax }, y: { label: 'power (W)', min: 0, max: Math.max(110, stc.mpp.p * 1.25) },
          series: [{ pts: stc.pts.map(q => [q[0], q[0] * q[1]]), label: 'STC', color: C.faint, dash: [5, 4], width: 1.4 }, { pts: pv, label: 'now', color: C.series[1], width: 2.6 }],
          marks: [{ x: mpp.v, y: mpp.p, label: kit.eng(mpp.p, 'W'), color: C.ok }, { x: op.v, y: op.v * op.i, color: C.warn }], vlines: vl, hlines: []
        });
      }
      function draw(dt) {
        const C = kit.colors(), g = st.begin(), W = st.W, Hh = st.H;
        phase += (dt || 0) * speed(op.i);
        const cw = Math.min(26, (W * 0.55) / 12 - 2), x0 = 24, y0 = 30, rh = cw + 12;
        const lum = Math.min(1, V.g / 1000);
        for (let s = 0; s < 3; s++) {
          const y = y0 + s * rh;
          for (let k = 0; k < 12; k++) {
            const x = x0 + k * (cw + 2), shaded = V.shade && s === 0 && k === 11;
            g.fillStyle = shaded ? '#1a2238' : 'hsl(220 70% ' + (18 + 30 * lum) + '%)';
            g.fillRect(x, y, cw, cw);
            g.strokeStyle = C.faint; g.lineWidth = 1; g.strokeRect(x + 0.5, y + 0.5, cw - 1, cw - 1);
            if (shaded) kit.label(g, 'leaf', x + cw / 2, y + cw / 2, { size: 9.5, color: '#9fe39f', align: 'center' });
          }
          const xe = x0 + 12 * (cw + 2) + 16;
          if (V.bypass) S.diode(g, xe, y + cw, xe, y, { kind: 'schottky', color: s === 0 && V.shade ? C.warn : C.muted });
          kit.label(g, 'string ' + (s + 1), xe + 16, y + cw / 2, { size: 11, color: C.muted });
        }
        const xl = W * 0.84, yt = 30, yb = y0 + 3 * rh - 12;
        const xw = x0 + 12 * (cw + 2) + 104;
        kit.label(g, '+', xw - 10, yt, { size: 14, color: C.text, weight: 700, align: 'center' });
        kit.label(g, '−', xw - 10, yb, { size: 14, color: C.text, weight: 700, align: 'center' });
        S.wire(g, [[xw, yt], [xl, yt]]);
        S.wire(g, [[xw, yb], [xl, yb]]);
        if (V.load === 'res') S.resistor(g, xl, yt, xl, yb, { label: 'R', value: kit.eng(V.r, 'Ω') });
        else if (V.load === 'batt') S.battery(g, xl, yt, xl, yb, { label: '12 V', value: 'battery' });
        else { g.strokeStyle = C.text; g.lineWidth = 2; g.strokeRect(xl - 26, (yt + yb) / 2 - 18, 52, 36); kit.label(g, 'MPPT', xl, (yt + yb) / 2, { size: 12, color: C.text, align: 'center', weight: 700 }); S.wire(g, [[xl, yt], [xl, (yt + yb) / 2 - 18]]); S.wire(g, [[xl, (yt + yb) / 2 + 18], [xl, yb]]); }
        S.flow(g, [[xw, yt], [xl, yt], [xl, yb], [xw, yb]], phase, { color: C.warn });
        kit.label(g, kit.eng(op.v * op.i, 'W') + ' delivered', xl - 10, yb + 22, { size: 12.5, color: C.warn, weight: 600, align: 'right' });
        if (V.shade) kit.label(g, 'shaded cell: ' + kit.eng(hotW, 'W'), x0, yb + 22, { size: 12, color: hotW > 5 ? C.bad : C.muted });
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });
})();
