/* HYPER-ELECTRONICS · sims/components-power.js — simulations for the Components and
 * Power Electronics branches: a resistor on the bench, a thermistor feeding an ADC, a
 * strain-gauge bridge with an instrumentation amplifier, a wire and its fuse, a linear
 * regulator fed from a rectifier, the switching converters, a PWM motor drive, and cells
 * under load. Every circuit is solved by kit.Circuit and drawn with kit.schem. */
(function () {
  'use strict';

  const clamp = (x, a, b) => Math.max(a, Math.min(b, x));
  /* piecewise-linear interpolation in a table [[x, y], ...] sorted by x */
  function interp(tab, x) {
    if (x <= tab[0][0]) return tab[0][1];
    for (let k = 1; k < tab.length; k++) {
      if (x <= tab[k][0]) { const a = tab[k - 1], b = tab[k]; return a[1] + (b[1] - a[1]) * (x - a[0]) / (b[0] - a[0]); }
    }
    return tab[tab.length - 1][1];
  }
  /* a box under the canvas for a graph */
  function plotBox(box) { const g = document.createElement('div'); g.style.padding = '4px 10px 10px'; box.stage.appendChild(g); return g; }
  /* speed of the current dots: log-compressed so that µA and A both move */
  const flowSpeed = i => Math.sign(i) * Math.min(140, 30 * Math.log10(1 + Math.abs(i) / 1e-6));
  function rrect(c, x, y, w, h, r) { c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, r); else c.rect(x, y, w, h); }
  /* a 1-2-5 volts-per-division that fits a span into n divisions */
  function vdivFor(span, n) {
    const want = Math.max(Math.abs(span), 1e-4) / n;
    const e = Math.pow(10, Math.floor(Math.log10(want)));
    for (const m of [1, 2, 5, 10]) if (m * e >= want) return m * e;
    return 10 * e;
  }
  /* a colour between the theme text colour (cold) and red-hot, for a temperature in °C */
  function heatColour(C, tc) {
    if (tc < 45) return C.text;
    const f = clamp((tc - 45) / 140, 0, 1);
    return 'hsl(' + Math.round(45 - 45 * f) + ' 90% ' + Math.round(58 - 8 * f) + '%)';
  }

  /* =========================================================== 1. resistor on the bench */
  const BAND = ['#1b1b1b', '#8a4b1f', '#d6322b', '#f07f1b', '#f1d02a', '#2f9b4a', '#2f66d4', '#8a55d8', '#8e8e8e', '#f5f5f5'];
  const BAND_NAMES = ['black', 'brown', 'red', 'orange', 'yellow', 'green', 'blue', 'violet', 'grey', 'white'];
  const GOLD = '#c9a431', SILVER = '#c3c7cc';
  const E24 = [10, 11, 12, 13, 15, 16, 18, 20, 22, 24, 27, 30, 33, 36, 39, 43, 47, 51, 56, 62, 68, 75, 82, 91];
  const E12 = [10, 12, 15, 18, 22, 27, 33, 39, 47, 56, 68, 82];
  const E6 = [10, 15, 22, 33, 47, 68];

  Hyper.sim('cp-resistor', {
    title: 'A resistor on the bench: colour code, tolerance and power',
    blurb: `Set the four bands to read (or build) a resistor, then put it across a supply. The simulator finds the current and the power; the graph is the manufacturer's derating line, with a dot for your part.

- Pick yellow–violet–red–gold: 4.7 kΩ ±5 %. The read-out gives the range a real part may measure, and the E-series the value belongs to.
- Put a 100 Ω, ¼ W resistor across 9 V: 0.81 W, more than three times its rating. Try the 1 W and 2 W parts.
- Raise the ambient temperature past 70 °C and watch the allowed power fall along the derating line. Designers keep below the dashed half-rating line.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.52, minH: 280 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'b1', label: 'Band 1 (first digit)', min: 1, max: 9, step: 1, value: 4, fmt: v => BAND_NAMES[Math.round(v)] + ' = ' + Math.round(v) },
        { id: 'b2', label: 'Band 2 (second digit)', min: 0, max: 9, step: 1, value: 7, fmt: v => BAND_NAMES[Math.round(v)] + ' = ' + Math.round(v) },
        { id: 'mul', type: 'select', label: 'Band 3 (multiplier)', options: [['silver ×0.01', -2], ['gold ×0.1', -1], ['black ×1', 0], ['brown ×10', 1], ['red ×100', 2], ['orange ×1 k', 3], ['yellow ×10 k', 4], ['green ×100 k', 5], ['blue ×1 M', 6]], value: 2 },
        { id: 'tol', type: 'select', label: 'Band 4 (tolerance)', options: [['brown ±1 %', 1], ['red ±2 %', 2], ['gold ±5 %', 5], ['silver ±10 %', 10]], value: 5 },
        { id: 'v', label: 'Supply voltage', min: 0, max: 50, step: 0.5, value: 9, unit: 'V' },
        { id: 'prat', type: 'select', label: 'Power rating', options: [['0.125 W (0805 chip)', 0.125], ['0.25 W (small axial)', 0.25], ['0.5 W', 0.5], ['1 W', 1], ['2 W', 2]], value: 0.25 },
        { id: 'ta', label: 'Ambient temperature', min: 0, max: 150, step: 1, value: 25, unit: '°C' }
      ], () => solve());
      const ro = kit.readout(box.side, [['r', 'Resistance'], ['range', 'A real part measures'], ['es', 'Standard series'], ['i', 'Current'], ['p', 'Power'], ['pa', 'Allowed at this ambient'], ['tb', 'Body temperature (est.)'], ['ok', 'Verdict']]);
      const plot = kit.plot(plotBox(box), { x: { label: 'ambient temperature (°C)' }, y: { label: 'power (W)', min: 0 } }, 170);
      const V = ctl.values;
      let R = 4700, I = 0, P = 0, Tb = 25, verdict = 0, phase = 0;

      const allowed = ta => ta <= 70 ? V.prat : ta >= 155 ? 0 : V.prat * (155 - ta) / 85;
      function solve() {
        const d = 10 * Math.round(V.b1) + Math.round(V.b2);
        R = d * Math.pow(10, V.mul);
        const c = new kit.Circuit();
        c.V('p', 'gnd', V.v);
        const r = c.R('p', 'gnd', R);
        c.dc();
        I = r.i; P = r.p;
        const pa = allowed(V.ta);
        Tb = V.ta + P * 85 / V.prat;              // a part at full rating at 70 °C reaches its 155 °C limit
        verdict = P <= 0.5 * pa ? 0 : P <= pa ? 1 : 2;
        const tol = V.tol / 100;
        ro.set('r', kit.eng(R, 'Ω') + ' ±' + V.tol + ' %');
        ro.set('range', kit.eng(R * (1 - tol), 'Ω') + ' to ' + kit.eng(R * (1 + tol), 'Ω'));
        const inS = [E6.includes(d) ? 'E6' : '', E12.includes(d) ? 'E12' : '', E24.includes(d) ? 'E24' : ''].filter(Boolean);
        ro.set('es', inS.length ? inS.join(', ') : 'not standard; nearest E24 ' + kit.eng(Hyper.circuit.eSeries(R, 'E24'), 'Ω'));
        ro.set('i', kit.eng(I, 'A'));
        ro.set('p', kit.eng(P, 'W'));
        ro.set('pa', pa > 0 ? kit.eng(pa, 'W') : 'none (above 155 °C)');
        ro.set('tb', Tb < 1000 ? Math.round(Tb) + ' °C' : 'far beyond 1000 °C');
        ro.set('ok', ['comfortable (under half the rating)', 'within rating, but running hot', 'overloaded: it will burn'][verdict]);
        const ymax = Math.max(V.prat * 1.25, Math.min(P * 1.15, V.prat * 4));
        plot.set({
          x: { label: 'ambient temperature (°C)', min: 0, max: 175 },
          y: { label: 'power (W)', min: 0, max: ymax },
          series: [{ pts: [[0, V.prat], [70, V.prat], [155, 0], [175, 0]], label: 'allowed (derating)' },
                   { pts: [[0, V.prat / 2], [70, V.prat / 2], [155, 0]], label: 'half rating', dash: [6, 4] }],
          marks: [{ x: V.ta, y: Math.min(P, ymax), label: P > ymax ? 'off the scale' : 'your part' }],
          vlines: [{ x: 70, label: '70 °C' }]
        });
      }

      function draw(dt) {
        phase += dt || 0;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        // the part itself, large
        const cy = Hh * 0.27, bx1 = W * 0.16, bx2 = W * 0.5, bh = Math.min(62, Hh * 0.2);
        c.strokeStyle = C.muted; c.lineWidth = 4; c.lineCap = 'round';
        c.beginPath(); c.moveTo(W * 0.04, cy); c.lineTo(W * 0.62, cy); c.stroke();
        rrect(c, bx1, cy - bh / 2, bx2 - bx1, bh, bh * 0.42);
        c.fillStyle = V.tol <= 2 ? '#8fb5de' : '#dcc39a'; c.fill();
        const heat = clamp((Tb - 60) / 220, 0, 0.8);
        if (heat > 0) { c.save(); c.globalAlpha = heat; c.fillStyle = C.bad; rrect(c, bx1, cy - bh / 2, bx2 - bx1, bh, bh * 0.42); c.fill(); c.restore(); }
        c.strokeStyle = C.text; c.lineWidth = 1.5; rrect(c, bx1, cy - bh / 2, bx2 - bx1, bh, bh * 0.42); c.stroke();
        const b1 = Math.round(V.b1), b2 = Math.round(V.b2);
        const mulCol = V.mul === -2 ? SILVER : V.mul === -1 ? GOLD : BAND[V.mul];
        const tolCol = { 1: BAND[1], 2: BAND[2], 5: GOLD, 10: SILVER }[V.tol] || GOLD;
        const mulName = V.mul === -2 ? 'silver' : V.mul === -1 ? 'gold' : BAND_NAMES[V.mul];
        const tolName = { 1: 'brown', 2: 'red', 5: 'gold', 10: 'silver' }[V.tol] || 'gold';
        const bands = [[0.2, BAND[b1], BAND_NAMES[b1]], [0.33, BAND[b2], BAND_NAMES[b2]], [0.46, mulCol, mulName], [0.8, tolCol, tolName]];
        const bw = (bx2 - bx1) * 0.075;
        bands.forEach(([f, col, name], k) => {
          const x = bx1 + f * (bx2 - bx1);
          c.fillStyle = col; c.fillRect(x - bw / 2, cy - bh / 2 + 2, bw, bh - 4);
          c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 1; c.strokeRect(x - bw / 2, cy - bh / 2 + 2, bw, bh - 4);
          kit.label(c, name, x, cy + bh / 2 + 12 + (k % 2) * 13, { size: 11, color: C.muted, align: 'center' });
        });
        if (Tb > 300) {                                   // smoke
          c.save(); c.strokeStyle = C.faint; c.lineWidth = 2;
          for (let k = 0; k < 3; k++) {
            const x = bx1 + (0.3 + 0.2 * k) * (bx2 - bx1), s = (phase * 30 + k * 17) % 40;
            c.beginPath(); c.moveTo(x, cy - bh / 2 - 4);
            c.quadraticCurveTo(x + 10, cy - bh / 2 - 14 - s * 0.3, x - 4, cy - bh / 2 - 26 - s * 0.5); c.stroke();
          }
          c.restore();
        }
        kit.label(c, kit.eng(R, 'Ω') + '  ±' + V.tol + ' %', W * 0.66, cy - 12, { size: 20, weight: 700 });
        kit.label(c, b1 + '' + b2 + ' × 10^' + V.mul + ' Ω', W * 0.66, cy + 14, { size: 12.5, color: C.muted });
        // the test circuit
        const top = Hh * 0.62, bot = Hh * 0.93, xl = W * 0.1, xr = W * 0.4, mid = (top + bot) / 2;
        S.wire(c, [[xl, mid + 38], [xl, bot], [xr, bot], [xr, bot - 8]]);
        S.battery(c, xl, mid + 10, xl, mid + 38, { label: 'supply', value: kit.eng(V.v, 'V') });
        S.wire(c, [[xl, mid + 10], [xl, mid - 4]]);
        S.meter(c, xl, mid - 20, 'A', kit.eng(I, 'A'));
        S.wire(c, [[xl, mid - 36], [xl, top], [xr, top], [xr, top + 8]]);
        S.resistor(c, xr, top + 8, xr, bot - 8, { label: 'R', value: kit.eng(R, 'Ω'), color: verdict === 2 ? C.bad : C.text });
        S.flow(c, [[xl, bot], [xl, top], [xr, top], [xr, bot], [xl, bot]], phase * flowSpeed(I), { color: C.warn });
        const vcol = [C.ok, C.warn, C.bad][verdict];
        kit.label(c, ['Comfortable', 'Hot, but within rating', 'Overloaded'][verdict], W * 0.56, top + 6, { size: 16, weight: 700, color: vcol });
        kit.label(c, kit.eng(P, 'W') + ' in a ' + kit.eng(V.prat, 'W') + ' part', W * 0.56, top + 30, { size: 12.5, color: C.muted });
        kit.label(c, 'body about ' + (Tb < 1000 ? Math.round(Tb) + ' °C' : '> 1000 °C'), W * 0.56, top + 50, { size: 12.5, color: C.muted });
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* =========================================================== 2. thermistor into an ADC */
  const SENSORS = {
    ntc10: { kind: 'ntc', r25: 10e3, beta: 3950, rf: 10e3, delta: 1.5e-3 },
    ntc100: { kind: 'ntc', r25: 100e3, beta: 4267, rf: 4.7e3, delta: 1.5e-3 },
    pt1000: { kind: 'rtd', r0: 1000, rf: 1000, delta: 3e-3 }
  };
  function sensorR(s, tc) {
    if (s.kind === 'ntc') return s.r25 * Math.exp(s.beta * (1 / (tc + 273.15) - 1 / 298.15));
    const A = 3.9083e-3, B = -5.775e-7, Cc = -4.183e-12;       // IEC 60751 Callendar–Van Dusen
    return s.r0 * (1 + A * tc + B * tc * tc + (tc < 0 ? Cc * (tc - 100) * tc * tc * tc : 0));
  }
  function sensorT(s, r) {
    if (!(r > 0)) return NaN;
    if (s.kind === 'ntc') return 1 / (1 / 298.15 + Math.log(r / s.r25) / s.beta) - 273.15;
    let t = (r / s.r0 - 1) / 3.85e-3;
    for (let k = 0; k < 25; k++) { const f = sensorR(s, t) - r, d = (sensorR(s, t + 0.01) - sensorR(s, t - 0.01)) / 0.02; if (!d) break; t -= f / d; }
    return t;
  }

  Hyper.sim('cp-thermistor', {
    title: 'A thermistor divider feeding an ADC',
    blurb: `A temperature sensor at the bottom of a voltage divider, read by a microcontroller's ADC that shares the divider's supply as its reference. The simulator solves the divider; the graph is the whole transfer curve, with a dot where you are.

- With the 10 kΩ NTC and a 10 kΩ fixed resistor the curve is steepest, and each ADC step worth the fewest degrees, near 25 °C, where the two resistances are equal. Change the fixed resistor and watch the steep part move.
- Heat the 100 kΩ printer thermistor towards 250 °C: the resolution per ADC step coarsens, one reason printer firmware tables are dense at the top.
- Switch to the Pt1000: nearly straight, but it changes far less per degree, so each ADC step is worth more degrees. Real RTD front ends amplify it.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 270 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'sens', type: 'select', label: 'Sensor', options: [['NTC 10 kΩ, β = 3950', 'ntc10'], ['NTC 100 kΩ, β = 4267 (3D printer)', 'ntc100'], ['Pt1000 platinum RTD', 'pt1000']], value: 'ntc10' },
        { id: 't', label: 'Temperature', min: -40, max: 300, step: 1, value: 25, unit: '°C' },
        { id: 'rf', label: 'Fixed (pull-up) resistor', min: 100, max: 1e6, value: 10e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'vref', type: 'select', label: 'Supply = ADC reference', options: [['3.3 V', 3.3], ['5 V', 5]], value: 3.3 },
        { id: 'bits', type: 'select', label: 'ADC resolution', options: [['10 bits', 10], ['12 bits', 12], ['16 bits', 16]], value: 12 }
      ], id => { if (id === 'sens') ctl.set('rf', (SENSORS[V.sens] || SENSORS.ntc10).rf); solve(); });
      const ro = kit.readout(box.side, [['rs', 'Sensor resistance'], ['vo', 'ADC input'], ['code', 'ADC code'], ['back', 'Temperature from the code'], ['res', 'One ADC step is worth'], ['self', 'Self-heating error']]);
      const plot = kit.plot(plotBox(box), { x: { label: 'temperature (°C)' }, y: { label: 'ADC input (V)', min: 0 } }, 170);
      const V = ctl.values;
      let now = { rs: 1e4, vout: 1.65, code: 2048, n: 4096, tback: 25, i: 0 }, phase = 0;

      function solve() {
        const s = SENSORS[V.sens] || SENSORS.ntc10;
        const rs = sensorR(s, V.t);
        const c = new kit.Circuit();
        c.V('vcc', 'gnd', V.vref);
        const Rf = c.R('vcc', 'out', V.rf);
        const Rs = c.R('out', 'gnd', rs);
        c.dc();
        const vout = c.v('out');
        const n = Math.pow(2, V.bits);
        const code = clamp(Math.floor(vout / V.vref * n), 0, n - 1);
        const vq = (code + 0.5) / n * V.vref;
        const tback = sensorT(s, V.rf * vq / (V.vref - vq));
        const vAt = tc => { const r = sensorR(s, tc); return V.vref * r / (r + V.rf); };
        const slope = vAt(V.t + 0.5) - vAt(V.t - 0.5);          // volts per kelvin
        const res = Math.abs(slope) > 1e-12 ? (V.vref / n) / Math.abs(slope) : Infinity;
        const selfErr = Rs.p / s.delta;
        now = { rs, vout, code, n, tback, i: Rf.i };
        ro.set('rs', kit.eng(rs, 'Ω'));
        ro.set('vo', kit.eng(vout, 'V'));
        ro.set('code', code + ' of ' + (n - 1));
        ro.set('back', Number.isFinite(tback) ? tback.toFixed(2) + ' °C' : 'out of range');
        ro.set('res', res < 100 ? (res < 0.01 ? res.toExponential(1) : res.toPrecision(2)) + ' °C' : 'too coarse to use');
        ro.set('self', (selfErr < 0.01 ? selfErr.toExponential(1) : selfErr.toPrecision(2)) + ' K (' + kit.eng(Rs.p, 'W') + ' in the sensor)');
        const pts = [];
        for (let tc = -40; tc <= 300; tc += 2) pts.push([tc, vAt(tc)]);
        const tEq = sensorT(s, V.rf);
        plot.set({
          x: { label: 'temperature (°C)', min: -40, max: 300 },
          y: { label: 'ADC input (V)', min: 0, max: V.vref },
          series: [{ pts, label: 'V_out' }],
          marks: [{ x: V.t, y: vout, label: V.t + ' °C' }],
          vlines: Number.isFinite(tEq) && tEq > -40 && tEq < 300 ? [{ x: tEq, label: 'R_T = R_fixed (steepest)' }] : []
        });
      }

      function draw(dt) {
        phase += dt || 0;
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const x0 = W * 0.2, top = Hh * 0.14, bot = Hh * 0.88, mid = (top + bot) / 2;
        S.rail(c, x0, top, kit.eng(V.vref, 'V') + ' (ADC reference)');
        S.resistor(c, x0, top, x0, mid - 6, { label: 'R fixed', value: kit.eng(V.rf, 'Ω') });
        S.wire(c, [[x0, mid - 6], [x0, mid + 6]]);
        S.node(c, x0, mid);
        const sensLabel = V.sens === 'pt1000' ? 'Pt1000' : 'NTC';
        S.resistor(c, x0, mid + 6, x0, bot - 10, { label: sensLabel, value: kit.eng(now.rs, 'Ω') });
        const ym = (mid + bot) / 2;
        S.line(c, [[x0 - 20, ym + 14], [x0 - 12, ym + 14], [x0 + 12, ym - 14]], C.text, 1.5);   // the thermistor's slash
        S.wire(c, [[x0, bot - 10], [x0, bot]]);
        S.ground(c, x0, bot);
        S.flow(c, [[x0, top], [x0, bot]], phase * flowSpeed(now.i), { color: C.warn });
        // thermometer
        const tx = W * 0.07, ty0 = mid - 10, ty1 = bot - 16, f = clamp((V.t + 40) / 340, 0, 1);
        c.strokeStyle = C.muted; c.lineWidth = 1.5; rrect(c, tx - 5, ty0, 10, ty1 - ty0, 5); c.stroke();
        const tcol = V.t < 45 ? C.accent : heatColour(C, V.t);
        c.fillStyle = tcol; rrect(c, tx - 3, ty1 - f * (ty1 - ty0 - 4) - 2, 6, f * (ty1 - ty0 - 4) + 2, 3); c.fill();
        kit.dot(c, tx, ty1 + 6, 8, tcol);
        kit.label(c, V.t + ' °C', tx, ty0 - 12, { size: 12, align: 'center', weight: 600 });
        // the ADC
        const ax = W * 0.36, aw = W * 0.2, ah = Hh * 0.26;
        S.wire(c, [[x0, mid], [ax, mid]]);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2; rrect(c, ax, mid - ah / 2, aw, ah, 6); c.fill(); c.stroke();
        kit.label(c, V.bits + '-bit ADC', ax + aw / 2, mid - ah / 2 + 14, { size: 12, align: 'center', color: C.muted });
        kit.label(c, String(now.code), ax + aw / 2, mid + 4, { size: 20, weight: 700, align: 'center', color: C.accent });
        const fr = now.code / (now.n - 1);
        c.fillStyle = C.bg2; c.fillRect(ax + 10, mid + ah / 2 - 18, aw - 20, 8);
        c.fillStyle = C.accent; c.fillRect(ax + 10, mid + ah / 2 - 18, (aw - 20) * fr, 8);
        kit.label(c, kit.eng(now.vout, 'V'), (x0 + ax) / 2, mid - 12, { size: 12, align: 'center', color: C.accent });
        // what the firmware concludes
        const rx = W * 0.62;
        kit.label(c, 'the firmware reads', rx, mid - 30, { size: 12.5, color: C.muted });
        kit.label(c, Number.isFinite(now.tback) ? now.tback.toFixed(1) + ' °C' : '—', rx, mid - 4, { size: 24, weight: 700 });
        const err = now.tback - V.t;
        kit.label(c, Number.isFinite(err) ? 'quantisation error ' + (err >= 0 ? '+' : '') + err.toFixed(2) + ' K' : '', rx, mid + 24, { size: 12, color: C.muted });
      }
      solve();
      const loop = kit.loop(dt => draw(dt), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* =========================================================== 3. strain-gauge bridge */
  Hyper.sim('cp-strain-bridge', {
    title: 'Strain-gauge bridge and instrumentation amplifier',
    blurb: `A cantilever with 350 Ω foil gauges (gauge factor 2.0) wired into a Wheatstone bridge, amplified by a three-op-amp instrumentation amplifier on a single 5 V supply with its reference at 2.5 V. The whole circuit, op-amps included, is solved by the simulator.

- Quarter bridge, 500 µε, 5 V: the bridge gives only 1.25 mV. That is why the in-amp is there.
- Change the temperature by 20 K in the quarter bridge: a gauge not matched to the metal reads a false strain. Switch to the half bridge: the two gauges drift together and the error vanishes — and the signal doubles.
- Push the gain to 1000 and the strain to 2000 µε: the output hits the rail. Gain is chosen from the largest signal you must measure.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.56, minH: 300 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'eps', label: 'Strain at the gauges', min: -2000, max: 2000, step: 10, value: 500, unit: 'µε' },
        { id: 'cfg', type: 'select', label: 'Bridge', options: [['Quarter (one active gauge)', 'quarter'], ['Half (top and bottom gauges)', 'half'], ['Full (four active gauges)', 'full']], value: 'quarter' },
        { id: 'vex', label: 'Excitation', min: 1, max: 5, step: 0.1, value: 5, unit: 'V' },
        { id: 'g', label: 'In-amp gain', min: 1, max: 1000, value: 200, log: true, sig: 3, fmt: v => Number(v.toPrecision(3)) + ' ×' },
        { id: 'dt', label: 'Temperature change', min: -20, max: 40, step: 1, value: 0, unit: 'K' }
      ], () => solve());
      const ro = kit.readout(box.side, [['dr', 'ΔR/R of an active gauge'], ['vb', 'Bridge output'], ['vbi', 'Formula N·V·GF·ε/4'], ['rg', 'R_G (G = 1 + 49.4 kΩ/R_G)'], ['vo', 'In-amp output'], ['code', '12-bit ADC (0–5 V)'], ['lsb', 'Strain per ADC step'], ['terr', 'Error from temperature'], ['sig', 'Stress, if the part is steel']]);
      const plot = kit.plot(plotBox(box), { x: { label: 'strain (µε)' }, y: { label: 'in-amp output (V)', min: 0, max: 5 } }, 170);
      const V = ctl.values;
      const R0 = 350, GF = 2.0, APP = 10e-6;           // apparent strain of a mismatched gauge: 10 µε per kelvin
      const RF = 24.7e3;
      let sol = null;

      function arms(eps, dT) {
        const x = GF * eps * 1e-6, xt = GF * APP * dT;
        const r = [R0, R0, R0, R0];                       // R1 ex–a, R2 a–gnd, R3 ex–b, R4 b–gnd
        if (V.cfg === 'quarter') r[0] = R0 * (1 + x + xt);
        else if (V.cfg === 'half') { r[0] = R0 * (1 + x + xt); r[1] = R0 * (1 - x + xt); }
        else { r[0] = R0 * (1 + x + xt); r[1] = R0 * (1 - x + xt); r[2] = R0 * (1 - x + xt); r[3] = R0 * (1 + x + xt); }
        return r;
      }
      function run(eps, dT) {
        const r = arms(eps, dT);
        const c = new kit.Circuit();
        c.V('ex', 'gnd', V.vex);
        c.R('ex', 'a', r[0]); c.R('a', 'gnd', r[1]); c.R('ex', 'b', r[2]); c.R('b', 'gnd', r[3]);
        const G = Math.max(1, V.g), RG = G > 1.0001 ? 2 * RF / (G - 1) : 1e12;
        const o = { vpos: 5, vneg: 0, gain: 1e5 };
        c.OPAMP('b', 'n1', 'o1', o); c.R('o1', 'n1', RF); c.R('n1', 'n2', RG);
        c.OPAMP('a', 'n2', 'o2', o); c.R('o2', 'n2', RF);
        c.V('vref', 'gnd', 2.5);
        c.R('o2', 'm', 10e3); c.R('m', 'out', 10e3); c.R('o1', 'p', 10e3); c.R('p', 'vref', 10e3);
        c.OPAMP('p', 'm', 'out', o);
        c.dc();
        const vd = c.v('b') - c.v('a');
        let out = c.v('out');
        if (!c.ok || !Number.isFinite(out)) out = clamp(2.5 + G * vd, 0, 5);   // deep saturation: fall back to the clipped ideal
        return { vd, out, r, RG, va: c.v('a'), vb: c.v('b') };
      }
      function solve() {
        sol = run(V.eps, V.dt);
        const N = V.cfg === 'quarter' ? 1 : V.cfg === 'half' ? 2 : 4;
        const sens = N * V.vex * GF / 4;                   // volts per unit strain
        const code = clamp(Math.floor(sol.out / 5 * 4096), 0, 4095);
        const lsbStrain = (5 / 4096) / (Math.max(1, V.g) * sens) * 1e6;
        const tOnly = run(0, V.dt).vd, t0 = run(0, 0).vd;
        const terr = (tOnly - t0) / sens * 1e6;
        ro.set('dr', (GF * V.eps * 1e-6 * 100).toPrecision(3) + ' %  (' + kit.eng(Math.abs(GF * V.eps * 1e-6 * R0), 'Ω') + ')');
        ro.set('vb', kit.eng(sol.vd, 'V'));
        ro.set('vbi', kit.eng(sens * V.eps * 1e-6, 'V') + ' (N = ' + N + ')');
        ro.set('rg', V.g > 1.0001 ? kit.eng(sol.RG, 'Ω') : 'open');
        ro.set('vo', kit.eng(sol.out, 'V') + (sol.out > 4.97 || sol.out < 0.03 ? ' (at the rail!)' : ''));
        ro.set('code', String(code));
        ro.set('lsb', lsbStrain.toPrecision(2) + ' µε');
        ro.set('terr', (Math.abs(terr) < 0.05 ? '0' : terr.toFixed(0)) + ' µε');
        ro.set('sig', (200e9 * V.eps * 1e-6 / 1e6).toFixed(0) + ' MPa');
        const pts = [];
        for (let e = -2000; e <= 2000; e += 100) pts.push([e, run(e, V.dt).out]);
        plot.set({ x: { label: 'strain (µε)', min: -2000, max: 2000 }, y: { label: 'in-amp output (V)', min: 0, max: 5 }, series: [{ pts, label: 'output' }], marks: [{ x: V.eps, y: sol.out }], hlines: [{ y: 2.5, label: 'reference 2.5 V' }] });
      }

      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        if (!sol) return;
        // the cantilever
        const wx = W * 0.04, by = Hh * 0.22, L = W * 0.3, th = 14, defl = clamp(V.eps / 2000, -1, 1) * Hh * 0.08;
        c.fillStyle = C.faint; c.fillRect(wx - 10, by - 44, 10, 88);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 1.5;
        c.beginPath();
        const yAt = u => by + defl * u * u * (3 - u) / 2;   // cantilever deflection shape, u = 0…1
        for (let k = 0; k <= 30; k++) { const u = k / 30; k ? c.lineTo(wx + u * L, yAt(u) - th / 2) : c.moveTo(wx, yAt(0) - th / 2); }
        for (let k = 30; k >= 0; k--) { const u = k / 30; c.lineTo(wx + u * L, yAt(u) + th / 2); }
        c.closePath(); c.fill(); c.stroke();
        kit.arrow(c, wx + L, yAt(1) - th / 2 - 36 * Math.sign(V.eps || 1), wx + L, yAt(1) - th / 2 * Math.sign(V.eps || 1), C.accent, 2.5);
        const ten = V.eps >= 0 ? C.bad : C.accent, com = V.eps >= 0 ? C.accent : C.bad;
        const g = (u, top, col, name) => { const y = yAt(u) + (top ? -th / 2 - 5 : th / 2 + 1); c.fillStyle = col; c.fillRect(wx + u * L - 12, y, 24, 4); kit.label(c, name, wx + u * L, y + (top ? -9 : 14), { size: 10.5, align: 'center', color: col }); };
        g(0.15, true, ten, 'R1');
        if (V.cfg !== 'quarter') g(0.15, false, com, 'R2');
        if (V.cfg === 'full') { g(0.4, true, ten, 'R4'); g(0.4, false, com, 'R3'); }
        kit.label(c, V.eps >= 0 ? 'top in tension' : 'top in compression', wx + 6, by + 48, { size: 11, color: C.muted });
        // the bridge (a diamond)
        const cx = W * 0.5, cy = Hh * 0.4, d = Math.min(W * 0.12, Hh * 0.26);
        const ex = [cx, cy - d], gd = [cx, cy + d], A = [cx - d, cy], B = [cx + d, cy];
        const col = k => (V.cfg === 'quarter' && k > 0) ? C.muted : (sol.r[k] > R0 * 1.0000001 ? C.bad : sol.r[k] < R0 * 0.9999999 ? C.accent : C.text);
        S.resistor(c, ex[0], ex[1], A[0], A[1], { label: 'R1', color: col(0) });
        S.resistor(c, A[0], A[1], gd[0], gd[1], { label: 'R2', color: col(1) });
        S.resistor(c, ex[0], ex[1], B[0], B[1], { label: 'R3', color: col(2) });
        S.resistor(c, B[0], B[1], gd[0], gd[1], { label: 'R4', color: col(3) });
        S.node(c, A[0], A[1]); S.node(c, B[0], B[1]);
        S.rail(c, ex[0], ex[1], kit.eng(V.vex, 'V'));
        S.ground(c, gd[0], gd[1]);
        kit.label(c, 'V_b − V_a = ' + kit.eng(sol.vd, 'V'), cx, cy + d + 46, { size: 12, align: 'center', color: C.accent });
        // the in-amp
        const ox = W * 0.8, oy = cy;
        const pins = S.opamp(c, ox, oy, { label: 'INA', flip: true });          // + input on top
        const xb2 = Math.max(B[0] + 8, ox - 76), xa2 = Math.max(B[0] + 20, ox - 62);
        S.wire(c, [[B[0], B[1]], [xb2, B[1]], [xb2, pins.inp[1]], pins.inp]);
        S.wire(c, [[A[0], A[1]], [A[0], gd[1] + 30], [xa2, gd[1] + 30], [xa2, pins.inn[1]], pins.inn]);
        S.resistor(c, ox - 4, oy - 44, ox - 4, oy - 30, { label: 'R_G', value: V.g > 1.0001 ? kit.eng(sol.RG, 'Ω') : 'open', scale: 0.5 });
        S.wire(c, [[pins.out[0], pins.out[1]], [pins.out[0] + 14, pins.out[1]]]);
        S.meter(c, pins.out[0] + 30, pins.out[1], 'V', kit.eng(sol.out, 'V'), { color: sol.out > 4.97 || sol.out < 0.03 ? C.bad : C.text });
        kit.label(c, 'ref 2.5 V', ox - 10, oy + 44, { size: 11, color: C.muted, align: 'center' });
      }
      solve();
      const loop = kit.loop(() => draw(), box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* =========================================================== 4. a wire and its fuse */
  const WIRES = [[0.5, 2.1], [0.75, 2.3], [1.5, 2.8], [2.5, 3.4], [4, 4.0], [6, 4.6], [10, 5.9]];   // mm², outer diameter mm
  Hyper.sim('cp-wire-fuse', {
    title: 'A wire, a load and a fuse',
    blurb: `A battery feeds a load through a fuse and a run of PVC-insulated copper wire (out and back). The simulator solves the circuit with the wire's resistance at its present temperature, and a heat balance warms the wire (the clock runs five times fast). The graph is the time–current picture a designer uses: the fuse must always blow before the wire reaches 160 °C.

- 12 V, 10 A, 1.5 mm², 5 m: look at the voltage lost in the wire. Try 0.5 mm²: the drop, not the heating, is often what forces a thicker wire at low voltage.
- Tick the short circuit and watch the fuse clear it in a fraction of a second. Then fit a 40 A fuse on the 0.5 mm² wire: the wire curve now lies below the fuse curve, and the wire cooks first.
- Set a steady current a little above the fuse rating: the fuse takes seconds or minutes. Small overloads are slow to clear.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.5, minH: 280 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'vs', type: 'select', label: 'Battery', options: [['12 V', 12], ['24 V', 24]], value: 12 },
        { id: 'il', label: 'Load (current it draws)', min: 0.5, max: 40, step: 0.5, value: 10, unit: 'A' },
        { id: 'a', type: 'select', label: 'Wire size', options: [['0.5 mm² (≈ 20 AWG)', 0.5], ['0.75 mm² (≈ 18 AWG)', 0.75], ['1.5 mm² (≈ 16 AWG)', 1.5], ['2.5 mm² (≈ 14 AWG)', 2.5], ['4 mm² (≈ 12 AWG)', 4], ['6 mm² (≈ 10 AWG)', 6], ['10 mm² (≈ 8 AWG)', 10]], value: 1.5 },
        { id: 'len', label: 'Length of the run (one way)', min: 0.5, max: 20, step: 0.5, value: 5, unit: 'm' },
        { id: 'fuse', type: 'select', label: 'Fuse rating', options: [['5 A', 5], ['7.5 A', 7.5], ['10 A', 10], ['15 A', 15], ['20 A', 20], ['30 A', 30], ['40 A', 40]], value: 15 },
        { id: 'short', type: 'check', label: 'Short circuit at the load', value: false },
        { type: 'buttons', items: [{ id: 'replace', label: 'Replace the fuse', primary: true }, { id: 'cool', label: 'Let the wire cool' }] }
      ], id => {
        if (id === 'replace') { melt = 0; blown = false; }
        if (id === 'cool') { theta = TA; }
        setup();
      });
      const ro = kit.readout(box.side, [['i', 'Current'], ['vl', 'Voltage at the load'], ['drop', 'Lost in the wire'], ['pw', 'Heat in the wire'], ['tw', 'Wire temperature now'], ['tss', 'Wire temperature, steady'], ['rate', 'Wire rating (70 °C)'], ['fz', 'Fuse'], ['dmg', 'Wire reaches 160 °C in']]);
      const plot = kit.plot(plotBox(box), { x: { label: 'current (A)', log: true }, y: { label: 'time (s)', log: true } }, 190);
      const V = ctl.values;
      const TA = 25, RHO = 1.724e-8, ALPHA = 0.00393, H_CONV = 14, SPEED = 5;
      let theta = TA, melt = 0, blown = false, phase = 0, simT = 0;
      let geo = null, I = 0, vload = 0;

      function geometry() {
        const Smm = V.a, S2 = Smm * 1e-6;
        const Do = ((WIRES.find(w => w[0] === Smm) || [1.5, 2.8])[1]) * 1e-3;
        const d = Math.sqrt(4 * S2 / Math.PI);
        const Cth = 3.45e6 * S2 + 1.9e6 * Math.PI / 4 * (Do * Do - d * d);    // J/(m·K): copper plus PVC
        const Rth = 1 / (H_CONV * Math.PI * Do);                               // K·m/W to still air
        return { S2, Do, Cth, Rth, rOf: th => RHO * (1 + ALPHA * (th - 20)) / S2 };
      }
      const tBlow = (i, In) => { const x = i / In; return x <= 1.35 ? Infinity : 1.0 * (4 - 1.8225) / (x * x - 1.8225); };   // model: 1 s at twice the rating
      function steady(i) {                      // steady wire temperature with R rising with temperature; Infinity = runaway
        const a = i * i * geo.Rth * RHO / geo.S2;
        const den = 1 - a * ALPHA;
        return den <= 0 ? Infinity : (TA + a * (1 - 20 * ALPHA)) / den;
      }
      function tTo160(i) {                      // from ambient, with R at 90 °C
        const r = geo.rOf(90), tss = TA + i * i * r * geo.Rth, tau = geo.Cth * geo.Rth;
        if (tss <= 160) return Infinity;
        return -tau * Math.log(1 - (160 - TA) / (tss - TA));
      }
      function solveCircuit() {
        const c = new kit.Circuit();
        const rw = geo.rOf(theta) * V.len;
        c.V('b', 'gnd', V.vs, { r: 0.01 });
        c.SW('b', 'f', !blown, { ron: 0.08 / V.fuse });
        c.R('f', 'l', rw);
        c.R('l', 'r', V.vs / V.il);                   // the load, sized to draw the set current from the full supply
        c.SW('l', 'r', V.short, { ron: 0.002 });
        const back = c.R('r', 'gnd', rw);
        c.dc();
        I = back.i; vload = c.v('l') - c.v('r');
        if (blown) { I = 0; vload = 0; }             // only the open fuse's leakage is left
      }
      function setup() {
        geo = geometry();
        solveCircuit();
        const rating = (() => { let lo = 0, hi = 500; for (let k = 0; k < 50; k++) { const m = (lo + hi) / 2; if (steady(m) < 70) lo = m; else hi = m; } return lo; })();
        const fpts = [], wpts = [];
        for (let k = 0; k <= 80; k++) {
          const i = Math.pow(10, k / 80 * 3.3);        // 1 A … 2000 A
          const tf = tBlow(i, V.fuse), tw = tTo160(i);
          if (Number.isFinite(tf) && tf < 2e4 && tf > 1e-4) fpts.push([i, tf]);
          if (Number.isFinite(tw) && tw < 2e4 && tw > 1e-4) wpts.push([i, tw]);
        }
        const tnow = tBlow(Math.abs(I), V.fuse);
        plot.set({
          x: { label: 'current (A)', log: true, min: 1, max: 2000 }, y: { label: 'time (s)', log: true, min: 1e-3, max: 1e4 },
          series: [{ pts: fpts, label: 'fuse opens' }, { pts: wpts, label: 'wire reaches 160 °C' }],
          vlines: [{ x: Math.max(1, Math.abs(I)), label: 'now' }, { x: rating, label: 'wire rating', dash: [2, 3] }],
          marks: Number.isFinite(tnow) && tnow > 1e-3 && tnow < 1e4 ? [{ x: Math.abs(I), y: tnow }] : []
        });
        ro.set('rate', kit.eng(rating, 'A') + ' in free air');
      }

      function frame(dt) {
        dt = dt || 0;
        phase += dt;
        const h = dt * SPEED / 10;
        for (let k = 0; k < 10; k++) {
          solveCircuit();
          const r = geo.rOf(theta);
          theta += h * (I * I * r - (theta - TA) / geo.Rth) / geo.Cth;
          if (!Number.isFinite(theta) || theta > 1500) theta = 1500;
          const tb = tBlow(Math.abs(I), V.fuse);
          if (!blown) { if (Number.isFinite(tb)) melt += h / tb; else melt *= Math.exp(-h / 5); }
          if (melt >= 1 && !blown) { blown = true; melt = 1; }
          simT += h;
        }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const xb = W * 0.08, xf1 = W * 0.16, xf2 = W * 0.26, xl = W * 0.84, top = Hh * 0.2, bot = Hh * 0.8, mid = (top + bot) / 2;
        const wcol = heatColour(C, theta), ww = 1.5 + V.a * 0.9;
        S.battery(c, xb, mid - 14, xb, mid + 14, { label: 'battery', value: V.vs + ' V' });
        S.wire(c, [[xb, mid - 14], [xb, top], [xf1, top]]);
        S.fuse(c, xf1, top, xf2, top, { label: 'fuse ' + V.fuse + ' A', color: blown ? C.bad : C.text });
        if (blown) { kit.label(c, 'blown', (xf1 + xf2) / 2, top + 16, { size: 11.5, align: 'center', color: C.bad, weight: 700 }); }
        S.wire(c, [[xf2, top], [xl, top], [xl, mid - 34]], { color: wcol, width: ww });
        S.wire(c, [[xl, mid + 34], [xl, bot], [xb, bot], [xb, mid + 14]], { color: wcol, width: ww });
        S.resistor(c, xl, mid - 34, xl, mid + 34, { label: 'load', value: kit.eng(V.vs / V.il, 'Ω') });
        const xs = xl - W * 0.1;
        S.wire(c, [[xs, top], [xs, mid - 17]]); S.wire(c, [[xs, mid + 17], [xs, bot]]);
        S.switch(c, xs, mid - 17, xs, mid + 17, { closed: V.short, color: V.short ? C.bad : C.muted });
        kit.label(c, 'short', xs - 36, mid, { size: 11, color: V.short ? C.bad : C.muted });
        S.node(c, xs, top); S.node(c, xs, bot);
        const loopPts = [[xb, mid], [xb, top], [xl, top], [xl, bot], [xb, bot], [xb, mid]];
        const shortPts = [[xb, mid], [xb, top], [xs, top], [xs, bot], [xb, bot], [xb, mid]];
        if (!blown) S.flow(c, V.short ? shortPts : loopPts, phase * flowSpeed(I), { color: C.warn });
        kit.label(c, V.len + ' m of ' + V.a + ' mm² copper, out and back', (xf2 + xl) / 2, top - 16, { size: 12, align: 'center', color: C.muted });
        kit.label(c, 'wire ' + Math.round(theta) + ' °C', (xf2 + xs) / 2, bot + 18, { size: 13, align: 'center', weight: 700, color: wcol === C.text ? C.muted : wcol });
        kit.label(c, 'clock ×' + SPEED + ':  ' + simT.toFixed(1) + ' s', W - 10, Hh - 10, { size: 11, align: 'right', color: C.faint });
        // melting progress of the fuse element
        if (!blown && melt > 0.01) { c.fillStyle = C.warn; c.fillRect(xf1, top - 22, (xf2 - xf1) * melt, 4); }
        // read-outs
        const rw = geo.rOf(theta) * V.len * 2;
        ro.set('i', kit.eng(I, 'A'));
        ro.set('vl', kit.eng(vload, 'V'));
        ro.set('drop', kit.eng(Math.abs(I) * rw, 'V') + ' (' + (100 * Math.abs(I) * rw / V.vs).toFixed(1) + ' %)');
        ro.set('pw', kit.eng(I * I * rw, 'W') + ' (' + kit.eng(I * I * rw / (2 * V.len), 'W') + ' per metre)');
        ro.set('tw', Math.round(theta) + ' °C');
        const tss = steady(Math.abs(I));
        ro.set('tss', blown ? 'no current' : Number.isFinite(tss) && tss < 1500 ? Math.round(tss) + ' °C' + (tss > 70 ? ' (above the PVC limit)' : '') : 'runaway: the wire would melt');
        const tb = tBlow(Math.abs(I), V.fuse);
        ro.set('fz', blown ? 'blown' : Number.isFinite(tb) ? 'opens in about ' + kit.eng(tb * (1 - melt), 's') : 'holds (current below 1.35 × rating)');
        const tw = tTo160(Math.abs(I));
        ro.set('dmg', blown ? '—' : Number.isFinite(tw) ? kit.eng(tw, 's') : 'never (steady below 160 °C)');
      }
      setup();
      let ticks = 0;
      const loop = kit.loop(dt => { frame(dt); if (++ticks % 15 === 0) setup(); }, box.stage);
      loop.start();
      st.onResize(() => loop.once());
    }
  });

  /* =========================================================== 5. linear regulator */
  function buildRegulator(kit, kind, vset, iload) {
    const c = new kit.Circuit();
    const src = c.V('in', 'gnd', 0);
    c.V('ref', 'gnd', 1.25);
    const R2 = 1000, R1 = R2 * (vset / 1.25 - 1);
    if (kind === 'npn') {
      // a Darlington pass device fed from the input through a bias resistor; the error amplifier pulls its base down through a diode
      c.R('in', 'base', 1500);
      c.NPN('in', 'base', 'e1', { beta: 60 });
      c.NPN('in', 'e1', 'out', { beta: 60, is: 1e-12 });
      c.R('e1', 'out', 2000);
      c.D('base', 'drv');
      c.VCVS('ea', 'gnd', 'ref', 'fb', 1e4);
      c.R('ea', 'drv', 100);
    } else {
      // a PNP pass transistor (emitter to the input, 0.2 Ω of ballast) whose base current is pulled to ground by an NPN driver
      c.PNP('out', 'pb', 'pe', { beta: 50, is: 1e-12 });
      c.R('in', 'pe', 0.2);
      c.R('pe', 'pb', 1000);
      c.R('pb', 'dn', 47);
      c.NPN('dn', 'bd', 'gnd', { beta: 100 });
      c.VCVS('ea', 'gnd', 'ref', 'fb', 500);
      c.R('ea', 'bd', 10e3);
    }
    const Rtop = c.R('out', 'fb', R1), Rbot = c.R('fb', 'gnd', R2);
    c.C('out', 'gnd', 10e-6, 0);
    const RL = c.R('out', 'gnd', vset / iload);
    return { c, src, RL, Rtop, Rbot };
  }
  /* operating point at vin, reached by stepping the input up from zero (continuation) */
  function rampTo(b, vin) {
    const n = Math.max(1, Math.ceil(vin / 0.25));
    for (let k = 1; k <= n; k++) { b.src.v = vin * k / n; b.c.dc(); }
    return b.c.ok;
  }

  Hyper.sim('cp-linear-reg', {
    title: 'A linear regulator fed from a rectifier',
    blurb: `The input is what a transformer, bridge rectifier and reservoir capacitor deliver: a 100 Hz sawtooth, its top set by the transformer and its depth by the capacitor. The regulator — a pass transistor, a 1.25 V reference, an error amplifier and a feedback divider — is solved by the simulator at every instant.

- Standard regulator, 5 V at 0.5 A: lower the input until the valleys of the ripple dip below about 6.6 V. The output drops out in notches, one per ripple valley: the classic design mistake.
- Switch to the LDO: it keeps regulating down to a few tenths of a volt above the output.
- Raise the input to 20 V at 1 A: the output stays at 5 V, but the regulator now burns about 14 W. Linear regulation costs heat.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 320 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Regulator', options: [['Standard (NPN Darlington, 7805-like)', 'npn'], ['LDO (PNP pass transistor)', 'ldo']], value: 'npn' },
        { id: 'vset', type: 'select', label: 'Output voltage', options: [['3.3 V', 3.3], ['5 V', 5], ['12 V', 12]], value: 5 },
        { id: 'vtop', label: 'Input, top of the ripple', min: 2, max: 25, step: 0.1, value: 9, unit: 'V' },
        { id: 'rip', label: 'Ripple, peak to peak', min: 0, max: 6, step: 0.1, value: 2, unit: 'V' },
        { id: 'il', label: 'Load current', min: 0.02, max: 1.5, step: 0.01, value: 0.5, unit: 'A' }
      ], () => rebuild());
      const ro = kit.readout(box.side, [['vin', 'Input top / valley'], ['vout', 'Output (lowest)'], ['drop', 'Dropout at this load'], ['head', 'Headroom at the valley'], ['pd', 'Regulator dissipation'], ['eff', 'Efficiency'], ['tj', 'Junction, TO-220 without heat sink']]);
      const plot = kit.plot(plotBox(box), { x: { label: 'input voltage (V)' }, y: { label: 'output (V)', min: 0 } }, 160);
      const V = ctl.values;
      const T = 0.01, DT = T / 100;
      let b = null, buf = [], cur = [], acc = { p: 0, po: 0, n: 0 }, stats = { vmin: 0, pd: 0, po: 0 }, dropout = 0;

      const vinAt = t => {
        const ph = (t % T) / T, top = V.vtop, rip = Math.min(V.rip, V.vtop);
        return ph < 0.85 ? top - rip * ph / 0.85 : top - rip + rip * (1 - Math.cos(Math.PI * (ph - 0.85) / 0.15)) / 2;
      };
      function rebuild() {
        // transfer curve and dropout, from a slow sweep of the input
        const sw = buildRegulator(kit, V.kind === 'ldo' ? 'ldo' : 'npn', V.vset, V.il);
        const pts = [];
        let reg = null;
        for (let k = 1; k <= 500; k++) { const vin = k * 0.05; sw.src.v = vin; sw.c.dc(); pts.push([vin, sw.c.v('out')]); }
        reg = pts[pts.length - 1][1];
        const p = pts.find(q => q[1] >= 0.99 * reg);
        dropout = p ? p[0] - p[1] : 0;
        const valley = V.vtop - Math.min(V.rip, V.vtop);
        plot.set({
          x: { label: 'input voltage (V)', min: 0, max: 25 }, y: { label: 'output (V)', min: 0, max: Math.max(6, V.vset * 1.4) },
          series: [{ pts, label: 'output' }, { pts: [[0, 0], [25, 25]], label: 'input', dash: [5, 4] }],
          vlines: [{ x: Math.max(0.01, valley), label: 'valley' }, { x: V.vtop, label: 'top' }]
        });
        // the live circuit, started at a proper operating point
        b = buildRegulator(kit, V.kind === 'ldo' ? 'ldo' : 'npn', V.vset, V.il);
        rampTo(b, vinAt(0));
        b.src.v = vinAt;
        b.c.t = 0;
        buf = []; cur = []; acc = { p: 0, po: 0, n: 0 };
        stats = { vmin: b.c.v('out'), pd: 0, po: 0 };
        ro.set('drop', kit.eng(dropout, 'V'));
      }
      function frame() {
        for (let k = 0; k < 8; k++) {
          b.c.step(DT);
          const vi = b.c.v('in'), vo = b.c.v('out');
          const io = b.RL.i + b.Rtop.i;
          acc.p += (vi - vo) * io; acc.po += vo * b.RL.i; acc.n++;
          cur.push([cur.length * DT, vi, vo]);
          if (cur.length >= 200) {
            buf = cur; cur = [];
            stats = { vmin: Math.min(...buf.map(q => q[2])), pd: acc.p / acc.n, po: acc.po / acc.n };
            acc = { p: 0, po: 0, n: 0 };
          }
        }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        // schematic, left half
        const top = Hh * 0.12, bot = Hh * 0.9, xs = W * 0.05, xp = W * 0.24, yp = Hh * 0.3, yo = Hh * 0.5, xo = W * 0.46, xd = W * 0.3, xcap = W * 0.37;
        const ldo = V.kind === 'ldo';
        S.vsource(c, xs, (top + bot) / 2 - 20, xs, (top + bot) / 2 + 20, { ac: V.rip > 0 });
        kit.label(c, 'rectified input, ' + kit.eng(V.vtop, 'V') + ' top', xs + 8, top + 14, { size: 11.5, color: C.muted });
        S.wire(c, [[xs, (top + bot) / 2 - 20], [xs, top], [xp + 8, top]]);
        S.wire(c, [[xs, (top + bot) / 2 + 20], [xs, bot], [xo, bot]]);
        const pins = ldo ? S.pnp(c, xp, yp, { label: 'pass' }) : S.npn(c, xp, yp, { label: 'pass' });
        const up = ldo ? pins.e : pins.c, dn = ldo ? pins.c : pins.e, gate = pins.b;
        S.wire(c, [[up[0], up[1]], [up[0], top]]);
        S.wire(c, [[dn[0], dn[1]], [dn[0], yo], [xo, yo], [xo, yo + 12]]);
        S.node(c, xd, yo); S.node(c, xcap, yo);
        S.capacitor(c, xcap, yo, xcap, bot, { label: '10 µF' });
        S.resistor(c, xo, yo + 12, xo, bot - 6, { label: 'load', value: kit.eng(V.il, 'A') });
        S.wire(c, [[xo, bot - 6], [xo, bot]]);
        const yfb = Hh * 0.72;
        S.resistor(c, xd, yo, xd, yfb, { label: 'R1', scale: 0.8 });
        S.resistor(c, xd, yfb, xd, bot, { label: 'R2', scale: 0.8 });
        S.node(c, xd, yfb);
        const ax = W * 0.14, ay = Hh * 0.66;
        const oa = S.opamp(c, ax, ay, { flip: true, label: 'EA', size: 0.8 });        // + (reference) on top, − (feedback) below
        const fbPin = oa.inn, refPin = oa.inp;
        S.wire(c, [[xd, yfb], [xd - 20, yfb], [xd - 20, ay + 34], [fbPin[0] - 10, ay + 34], [fbPin[0] - 10, fbPin[1]], fbPin]);
        S.wire(c, [refPin, [refPin[0] - 10, refPin[1]], [refPin[0] - 10, refPin[1] - 22]]);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.arc(refPin[0] - 10, refPin[1] - 26, 4, 0, 7); c.stroke();
        kit.label(c, '1.25 V ref', refPin[0] - 4, refPin[1] - 27, { size: 10.5, color: C.muted });
        const xv = oa.out[0] + 6;
        S.wire(c, [oa.out, [xv, oa.out[1]], [xv, yp + 48]]);
        if (ldo) { S.resistor(c, xv, yp + 48, xv, gate[1] + 4, { scale: 0.6 }); kit.label(c, 'driver', xv - 10, yp + 26, { size: 10.5, color: C.muted, align: 'right' }); }
        else S.diode(c, xv, gate[1] + 4, xv, yp + 48, { scale: 0.8 });                // anode at the base: it can only pull the base down
        S.wire(c, [[xv, gate[1] + 4], [xv, gate[1]], gate]);
        // heat in the pass device
        const hot = clamp(stats.pd / 10, 0, 1);
        c.fillStyle = C.surface; c.fillRect(xp + 32, yp + 16, 50, 7);
        c.fillStyle = hot > 0.6 ? C.bad : hot > 0.25 ? C.warn : C.ok; c.fillRect(xp + 32, yp + 16, 50 * hot, 7);
        kit.label(c, kit.eng(stats.pd, 'W') + ' of heat', xp + 32, yp + 34, { size: 11, color: C.muted });
        kit.label(c, 'out ' + kit.eng(stats.vmin, 'V') + ' min', xd + 6, yo - 12, { size: 12, color: C.accent });
        // the scope, right half
        const sx = W * 0.57, sy = Hh * 0.06, sw = W * 0.41, sh = Hh * 0.8;
        const vdiv = vdivFor(Math.max(V.vtop, V.vset) * 1.1, 7);
        S.scope(c, sx, sy, sw, sh, {
          tdiv: 2e-3, divy: 8,
          traces: [{ pts: buf.map(q => [q[0], q[1]]), vdiv, offset: -4, label: 'IN' }, { pts: buf.map(q => [q[0], q[2]]), vdiv, offset: -4, label: 'OUT' }]
        });
        // read-outs
        const valley = V.vtop - Math.min(V.rip, V.vtop);
        ro.set('vin', kit.eng(V.vtop, 'V') + ' / ' + kit.eng(valley, 'V'));
        ro.set('vout', kit.eng(stats.vmin, 'V') + (stats.vmin < 0.98 * V.vset ? '  dropping out' : ''));
        const head = valley - V.vset - dropout;
        ro.set('head', head >= 0 ? kit.eng(head, 'V') : 'none: short by ' + kit.eng(-head, 'V'));
        ro.set('pd', kit.eng(stats.pd, 'W'));
        ro.set('eff', stats.po + stats.pd > 0 ? (100 * stats.po / (stats.po + stats.pd)).toFixed(0) + ' %' : '—');
        const tj = 25 + 50 * stats.pd;
        ro.set('tj', Math.round(tj) + ' °C' + (tj > 150 ? ' (thermal shutdown)' : tj > 110 ? ' (needs a heat sink)' : ''));
      }
      rebuild();
      const loop = kit.loop(() => frame(), box.stage);
      loop.start();
    }
  });

  /* =========================================================== 6. switching converters */
  Hyper.sim('cp-converter', {
    title: 'Switching converters: buck, boost and inverting',
    blurb: `A real switching circuit stepped in time: the switch opens and closes at the chosen frequency and duty cycle, the inductor current ramps up and down, the diode (or a second switch) takes over when the main switch opens, and the output capacitor with its ESR smooths the result. The scope shows the switch node, the inductor current (through a 1 V/A current probe) and the output ripple, AC-coupled. The switches are ideal and instant, so only conduction losses appear.

- Buck, 12 V, 42 %: the output sits a little under $D \\cdot V_\\text{in}$ = 5 V (the diode drop). Halve the inductance: the ripple current doubles.
- Raise the load resistance until the current triangle touches zero: discontinuous mode, and the output creeps above $D \\cdot V_\\text{in}$. Tick the synchronous switch: the current now reverses instead.
- Raise the ESR: the output ripple turns from smooth curves into steps — the capacitor's resistance, not its capacitance, now sets the ripple.
- Boost: see how the output current comes in pulses through the diode. Press *Start from zero* for the switch-on transient.`,
    mount(box, kit, P) {
      P = P || {};
      const T0 = P.topo === 'boost' ? 'boost' : P.topo === 'inv' ? 'inv' : 'buck';
      const DEF = { buck: { d: 0.42, r: 5 }, boost: { d: 0.5, r: 24 }, inv: { d: 0.4, r: 10 } };
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 380 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'topo', type: 'select', label: 'Converter', options: [['Buck (step-down)', 'buck'], ['Boost (step-up)', 'boost'], ['Inverting buck–boost', 'inv']], value: T0 },
        { id: 'vin', label: 'Input voltage', min: 3, max: 24, step: 0.5, value: 12, unit: 'V' },
        { id: 'd', label: 'Duty cycle D', min: 0.05, max: 0.9, step: 0.01, value: DEF[T0].d, fmt: v => Math.round(v * 100) + ' %' },
        { id: 'f', label: 'Switching frequency', min: 20e3, max: 500e3, value: 100e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Hz') },
        { id: 'l', label: 'Inductance L', min: 4.7e-6, max: 470e-6, value: 47e-6, log: true, sig: 2, fmt: v => kit.eng(v, 'H') },
        { id: 'r', label: 'Load resistance', min: 1, max: 200, value: DEF[T0].r, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'esr', label: 'Output capacitor ESR (47 µF)', min: 0.002, max: 0.5, value: 0.02, log: true, sig: 2, fmt: v => kit.eng(v, 'Ω') },
        { id: 'sync', type: 'check', label: 'Synchronous switch instead of the diode', value: false },
        { type: 'buttons', items: [{ id: 'start', label: 'Start from zero', primary: true }] }
      ], (id) => {
        if (id === 'topo') { ctl.set('d', DEF[V.topo].d); ctl.set('r', DEF[V.topo].r); }
        build(id === 'start');
      });
      const ro = kit.readout(box.side, [['vo', 'Output (average)'], ['vi', 'Ideal (lossless, CCM)'], ['il', 'Inductor current (average)'], ['dil', 'Ripple ΔI_L: simulated / ideal formula'], ['dv', 'Output ripple (p-p)'], ['mode', 'Mode'], ['eff', 'Efficiency (conduction losses only)'], ['loss', 'Losses: switch · rectifier · L · ESR']]);
      const plot = kit.plot(plotBox(box), { x: { label: 'time (ms)' }, y: { label: 'output (V)' } }, 150);
      const V = ctl.values;
      const N = 100, CAP = 47e-6, RON = 0.03, DCR = 0.03;
      let s = null, step = 0, win = [], shown = [], hist = [], phase = 0, meas = null;

      function ideal() {
        const d = V.d, vin = V.vin;
        const vo = V.topo === 'buck' ? d * vin : V.topo === 'boost' ? vin / (1 - d) : -vin * d / (1 - d);
        const il = V.topo === 'buck' ? vo / V.r : V.topo === 'boost' ? vo * vo / (V.r * vin) : Math.abs(vo) / (V.r * (1 - d));
        const dil = V.topo === 'buck' ? (vin - vo) * d / (V.f * V.l) : vin * d / (V.f * V.l);
        return { vo, il, dil };
      }
      function build(fromZero) {
        const c = new kit.Circuit();
        const id = ideal();
        const v0 = fromZero ? 0 : id.vo, i0 = fromZero ? 0 : id.il;
        c.V('in', 'gnd', V.vin);
        const dopt = { is: 1e-6, n: 1.1 };
        let hs, ls = null, D = null, L;
        if (V.topo === 'buck') {
          hs = c.SW('in', 'sw', false, { ron: RON });
          if (V.sync) ls = c.SW('sw', 'gnd', false, { ron: RON }); else D = c.D('gnd', 'sw', dopt);
          L = c.L('sw', 'lx', V.l, i0); c.R('lx', 'out', DCR);
        } else if (V.topo === 'boost') {
          L = c.L('in', 'lx', V.l, i0); c.R('lx', 'sw', DCR);
          hs = c.SW('sw', 'gnd', false, { ron: RON });
          if (V.sync) ls = c.SW('sw', 'out', false, { ron: RON }); else D = c.D('sw', 'out', dopt);
        } else {
          hs = c.SW('in', 'sw', false, { ron: RON });
          L = c.L('sw', 'lx', V.l, i0); c.R('lx', 'gnd', DCR);
          if (V.sync) ls = c.SW('out', 'sw', false, { ron: RON }); else D = c.D('out', 'sw', dopt);
        }
        const Resr = c.R('out', 'cn', V.esr);
        c.C('cn', 'gnd', CAP, v0);
        const RL = c.R('out', 'gnd', V.r);
        c.reset();
        s = { c, hs, ls, D, L, Resr, RL, dt: 1 / V.f / N };
        step = 0; win = []; shown = []; meas = null; hist = [];
      }
      function stepOnce() {
        const k = step % N, on = k < Math.round(V.d * N);
        s.hs.closed = on; if (s.ls) s.ls.closed = !on;
        s.c.step(s.dt);
        step++;
        const c = s.c, il = s.L.i;
        const lossD = s.D ? Math.max(0, s.D.p) : (s.ls && s.ls.closed ? s.ls.i * s.ls.i * RON : 0);
        win.push({ t: 0, sw: c.v('sw'), il, vo: c.v('out'), pout: s.RL.p,
                   lsw: on ? s.hs.i * s.hs.i * RON : 0, lrec: lossD, ll: il * il * DCR, lc: s.Resr.p });
        if (win.length >= 3 * N) {
          shown = win.map((q, j) => Object.assign(q, { t: j * s.dt }));
          win = [];
          const avg = key => shown.reduce((a, q) => a + q[key], 0) / shown.length;
          const vo = avg('vo'), vs = shown.map(q => q.vo), is = shown.map(q => q.il);
          meas = { vo, vpp: Math.max(...vs) - Math.min(...vs), il: avg('il'), imin: Math.min(...is), imax: Math.max(...is), pout: avg('pout'),
                   lsw: avg('lsw'), lrec: avg('lrec'), ll: avg('ll'), lc: avg('lc') };
          hist.push([c.t * 1e3, vo]);
          if (hist.length > 400) hist.splice(0, hist.length - 400);
        }
      }
      function frame(dt) {
        phase += dt || 0;
        for (let k = 0; k < 2 * N; k++) stepOnce();
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        const on = s.hs.closed;
        // schematic, upper part
        const top = Hh * 0.08, bot = Hh * 0.36, mid = (top + bot) / 2, xs = W * 0.06, xn = W * 0.36, xo = W * 0.6, xc = W * 0.68, xr = W * 0.8;
        S.vsource(c, xs, mid - 18, xs, mid + 18, { label: 'V_in', value: kit.eng(V.vin, 'V') });
        S.wire(c, [[xs, mid - 18], [xs, top], [W * 0.12, top]]);
        S.wire(c, [[xs, mid + 18], [xs, bot], [xr, bot]]);
        const swLabel = { label: 'Q1', color: on ? C.accent : C.text };
        const rec = (x1, y1, x2, y2, o) => {
          if (V.sync) S.switch(c, x1, y1, x2, y2, Object.assign({ label: 'Q2', closed: !on, color: !on ? C.accent : C.text }, o));
          else S.diode(c, x1, y1, x2, y2, Object.assign({ kind: 'schottky', label: 'D' }, o));
        };
        const lab = { label: 'L', value: kit.eng(V.l, 'H') };
        let pathOn, pathOff;
        if (V.topo === 'buck') {
          S.switch(c, W * 0.12, top, W * 0.28, top, Object.assign({ closed: on }, swLabel));
          S.wire(c, [[W * 0.28, top], [xn, top]]);
          rec(xn, bot, xn, top);
          S.inductor(c, xn, top, W * 0.54, top, lab);
          S.wire(c, [[W * 0.54, top], [xr, top]]);
          pathOn = [[xs, bot], [xs, top], [xr, top], [xr, bot], [xs, bot]];
          pathOff = [[xn, bot], [xn, top], [xr, top], [xr, bot], [xn, bot]];
        } else if (V.topo === 'boost') {
          S.inductor(c, W * 0.12, top, W * 0.3, top, lab);
          S.wire(c, [[W * 0.3, top], [xn, top]]);
          S.switch(c, xn, top, xn, bot, Object.assign({ closed: on }, swLabel));
          rec(xn, top, W * 0.52, top);
          S.wire(c, [[W * 0.52, top], [xr, top]]);
          pathOn = [[xs, bot], [xs, top], [xn, top], [xn, bot], [xs, bot]];
          pathOff = [[xs, bot], [xs, top], [xr, top], [xr, bot], [xs, bot]];
        } else {
          S.switch(c, W * 0.12, top, W * 0.28, top, Object.assign({ closed: on }, swLabel));
          S.wire(c, [[W * 0.28, top], [xn, top]]);
          S.inductor(c, xn, top, xn, bot, lab);
          rec(W * 0.52, top, xn + 16, top);
          S.wire(c, [[xn + 16, top], [xn, top]]);
          S.wire(c, [[W * 0.52, top], [xr, top]]);
          pathOn = [[xs, bot], [xs, top], [xn, top], [xn, bot], [xs, bot]];
          pathOff = [[xn, bot], [xn, top], [xr, top], [xr, bot], [xn, bot]];
          pathOff = pathOff.reverse();
        }
        S.node(c, xn, top);
        kit.label(c, 'SW', xn + 6, top - 12, { size: 11, color: C.muted });
        S.capacitor(c, xc, top, xc, bot, { label: 'C 47 µF', value: 'ESR ' + kit.eng(V.esr, 'Ω') });
        S.node(c, xc, top); S.node(c, xc, bot);
        S.resistor(c, xr, top, xr, bot, { label: 'load', value: kit.eng(V.r, 'Ω') });
        const il = s.L.i;
        S.flow(c, on ? pathOn : pathOff, phase * flowSpeed(il), { color: C.warn });
        // gate drive, as a little PWM picture above Q1
        const gx = V.topo === 'boost' ? xn + 18 : W * 0.14, gy = V.topo === 'boost' ? mid - 12 : top - 24, gw = 44;
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath();
        c.moveTo(gx, gy + 6); c.lineTo(gx, gy - 4); c.lineTo(gx + gw * 0.5 * V.d, gy - 4); c.lineTo(gx + gw * 0.5 * V.d, gy + 6); c.lineTo(gx + gw * 0.5, gy + 6);
        c.lineTo(gx + gw * 0.5, gy - 4); c.lineTo(gx + gw * 0.5 * (1 + V.d), gy - 4); c.lineTo(gx + gw * 0.5 * (1 + V.d), gy + 6); c.lineTo(gx + gw, gy + 6); c.stroke();
        kit.label(c, 'V_out ' + (meas ? kit.eng(meas.vo, 'V') : '…'), xo, top - 16, { size: 13, weight: 700, color: C.accent });
        // the scope
        const sy = Hh * 0.44, sh = Hh * 0.5;
        const swMax = Math.max(V.vin, meas ? Math.abs(meas.vo) : V.vin) * 1.1;
        const vd1 = vdivFor(swMax, 3), idiv = vdivFor(Math.max(meas ? Math.abs(meas.imax) : 1, meas ? Math.abs(meas.imin) : 0, 0.05), 2.5);
        const vpp = meas ? meas.vpp : 0.01, vd3 = Math.max(1e-3, vdivFor(vpp, 1.6));
        const vavg = meas ? meas.vo : 0;
        S.scope(c, 12, sy, W - 24, sh, {
          tdiv: 3 / V.f / 10, divy: 8,
          traces: [
            { pts: shown.map(q => [q.t, q.sw]), vdiv: vd1, offset: V.topo === 'inv' ? 0.5 : 0.5, label: 'SW' },
            { pts: shown.map(q => [q.t, q.il]), vdiv: idiv, offset: -3.3, label: 'I_L (1 V/A)' },
            { pts: shown.map(q => [q.t, q.vo - vavg]), vdiv: vd3, offset: -0.5, label: 'V_out AC' }
          ]
        });
        // read-outs and the start-up graph (throttled)
        if (meas && step % (6 * N) < 2 * N) {
          const id = ideal();
          ro.set('vo', kit.eng(meas.vo, 'V'));
          ro.set('vi', kit.eng(id.vo, 'V'));
          ro.set('il', kit.eng(meas.il, 'A'));
          ro.set('dil', kit.eng(meas.imax - meas.imin, 'A') + ' / ' + kit.eng(id.dil, 'A'));
          ro.set('dv', kit.eng(meas.vpp, 'V'));
          ro.set('mode', meas.imin < -0.005 * Math.max(0.1, Math.abs(meas.il)) ? 'current reverses (forced CCM)' : meas.imin < 0.01 * Math.max(0.05, Math.abs(meas.il)) ? 'discontinuous (DCM)' : 'continuous (CCM)');
          const lossSum = meas.lsw + meas.lrec + meas.ll + meas.lc;
          ro.set('eff', meas.pout > 1e-9 ? (100 * meas.pout / (meas.pout + lossSum)).toFixed(1) + ' %' : '—');
          ro.set('loss', [meas.lsw, meas.lrec, meas.ll, meas.lc].map(x => kit.eng(x, 'W')).join(' · '));
          const pts = hist.slice();
          plot.set({ x: { label: 'time (ms)' }, y: { label: 'output (V)' }, series: [{ pts, label: 'V_out, averaged over 3 periods' }], hlines: [{ y: id.vo, label: 'ideal' }] });
        }
      }
      build(false);
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
    }
  });

  /* =========================================================== 7. PWM motor drive */
  Hyper.sim('cp-motor-pwm', {
    title: 'PWM speed control of a DC motor',
    blurb: `A 12 V brushed motor (armature 1.5 Ω and 0.5 mH, motor constant 0.019 V·s/rad) switched by a low-side MOSFET. The electrical circuit — supply, armature, back-EMF, MOSFET with its body diode and avalanche clamp, flyback diode — is stepped in time by the simulator, and the shaft's speed follows from the motor torque, the load and the inertia.

- Duty 60 %: the speed settles near 60 % of the no-load speed, less the droop from the load. The current is a sawtooth: rising while the MOSFET conducts, freewheeling through the diode while it is off.
- Drop the frequency to 300 Hz: the current falls to zero every period (discontinuous) and the motor would whine. Raise it to 20 kHz: smooth current, silent.
- Untick the flyback diode: each turn-off drives the drain up to the MOSFET's 60 V avalanche limit, and the MOSFET absorbs the inductor's energy every cycle.
- Add load torque until it stalls: the current rises to what only the resistance limits.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 320 });
      const S = kit.schem;
      const M = { V: 12, R: 1.5, L: 0.5e-3, k: 0.019, J: 2e-5, b: 2e-6 };
      const ctl = kit.controls(box.side, [
        { id: 'd', label: 'Duty cycle', min: 0, max: 1, step: 0.01, value: 0.6, fmt: v => Math.round(v * 100) + ' %' },
        { id: 'f', label: 'PWM frequency', min: 200, max: 25e3, value: 2e3, log: true, sig: 2, fmt: v => kit.eng(v, 'Hz') },
        { id: 'tl', label: 'Load torque', min: 0, max: 0.12, step: 0.002, value: 0.02, unit: 'N·m' },
        { id: 'fly', type: 'check', label: 'Flyback diode fitted', value: true },
        { type: 'buttons', items: [{ id: 'stop', label: 'Stop the shaft and restart', primary: true }] }
      ], id => { if (id === 'stop') { w = 0; hist = []; simT = 0; } if (id === 'f' || id === 'fly' || id === 'stop') build(); });
      const ro = kit.readout(box.side, [['rpm', 'Speed'], ['rpmss', 'Steady speed (formula)'], ['iav', 'Motor current (average)'], ['ipp', 'Current ripple (p-p)'], ['tq', 'Motor torque (average)'], ['emf', 'Back-EMF kω'], ['vav', 'Average voltage on the motor'], ['p', 'Power in / to the shaft'], ['aval', 'Avalanche loss in the MOSFET'], ['clk', 'Clock']]);
      const plot = kit.plot(plotBox(box), { x: { label: 'time (s)' }, y: { label: 'speed (rpm)', min: 0 } }, 150);
      const V = ctl.values;
      const NP = 40, MAXSTEPS = 600;
      let w = 0, ang = 0, simT = 0, s = null, step = 0, win = [], shown = [], hist = [], meas = null, phase = 0;

      function build() {
        const i0 = s ? s.Lm.i : 0;
        const c = new kit.Circuit();
        const vsrc = c.V('vs', 'gnd', M.V);
        c.R('vs', 'm1', M.R);
        const Lm = c.L('m1', 'm2', M.L, i0);
        c.V('m2', 'd', () => M.k * w);                 // the back-EMF follows the shaft speed
        const sw = c.SW('d', 'gnd', false, { ron: 0.02 });
        const body = c.D('gnd', 'd', { vz: 60 });       // the MOSFET's body diode and avalanche clamp
        const fly = V.fly ? c.D('d', 'vs', { is: 1e-6, n: 1.1 }) : null;
        c.reset();
        s = { c, vsrc, Lm, sw, body, fly, dt: 1 / V.f / NP };
        step = 0; win = []; shown = [];
      }
      function frame(dt) {
        phase += dt || 0;
        const steps = Math.min(MAXSTEPS, Math.max(1, Math.round((1 / 60) / s.dt)));
        for (let k = 0; k < steps; k++) {
          const j = step % NP, on = j < Math.round(V.d * NP);
          s.sw.closed = on;
          s.c.step(s.dt);
          step++;
          const i = s.Lm.i;
          const torque = M.k * i - M.b * w;
          if (w <= 0 && torque <= V.tl) w = 0;
          else { w += (torque - V.tl) * s.dt / M.J; if (w < 0) w = 0; }
          ang += w * s.dt; simT += s.dt;
          const vd = s.c.v('d');
          win.push({ t: 0, vd, i, pin: s.vsrc.p, aval: vd > 30 && s.body.i < 0 ? -s.body.i * vd : 0 });
          if (win.length >= 3 * NP) {
            shown = win.map((q, n) => Object.assign(q, { t: n * s.dt }));
            win = [];
            const avg = key => shown.reduce((a, q) => a + q[key], 0) / shown.length;
            const is = shown.map(q => q.i);
            meas = { i: avg('i'), imin: Math.min(...is), imax: Math.max(...is), vd: avg('vd'), pin: avg('pin'), aval: avg('aval') };
          }
          if (step % Math.max(1, Math.round(0.01 / s.dt)) === 0) { hist.push([simT, w * 60 / (2 * Math.PI)]); if (hist.length > 300) hist.shift(); }
        }
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H;
        // the circuit, left
        const xm = Math.max(W * 0.2, 100), top = Hh * 0.06, yd = top + 26 + Math.max(50, Hh * 0.24), xf = xm + 60;
        S.rail(c, xm, top + 12, '+12 V');
        S.wire(c, [[xm, top + 12], [xm, top + 26]]);
        S.motor(c, xm, top + 26, xm, yd - 8, { label: 'M' });
        S.wire(c, [[xm, yd - 8], [xm, yd]]);
        if (V.fly) {
          S.wire(c, [[xm, top + 18], [xf, top + 18], [xf, top + 30]]);
          S.diode(c, xf, yd - 6, xf, top + 30, { label: 'D' });
          S.wire(c, [[xf, yd - 6], [xf, yd], [xm, yd]]);
          S.node(c, xm, top + 18);
        } else kit.label(c, 'no flyback diode', xm + 34, (top + yd) / 2 + 22, { size: 11.5, color: C.bad });
        S.node(c, xm, yd);
        const q = S.nmos(c, xm - 8, yd + 30, { label: 'Q' });
        S.wire(c, [q.s, [q.s[0], q.s[1] + 8]]);
        S.ground(c, q.s[0], q.s[1] + 8);
        const on = s.sw.closed;
        S.wire(c, [q.g, [q.g[0] - 20, q.g[1]]], { color: on ? C.accent : C.text });
        const i = s.Lm.i;
        const path = on ? [[xm, top + 12], [xm, yd], [xm, q.s[1]]] : [[xm, top + 18], [xm, yd], [xf, yd], [xf, top + 18], [xm, top + 18]];
        if (on || V.fly) S.flow(c, path, phase * flowSpeed(i), { color: C.warn });
        // the shaft and flywheel, right
        const fx = W * 0.62, fy = Hh * 0.24, fr = Math.min(W * 0.1, Hh * 0.15);
        c.strokeStyle = C.text; c.lineWidth = 2; c.beginPath(); c.arc(fx, fy, fr, 0, 7); c.stroke();
        c.fillStyle = C.surface; c.beginPath(); c.arc(fx, fy, fr - 2, 0, 7); c.fill();
        for (let k = 0; k < 3; k++) { const a = ang + k * 2 * Math.PI / 3; S.line(c, [[fx, fy], [fx + Math.cos(a) * (fr - 4), fy + Math.sin(a) * (fr - 4)]], C.accent, 3); }
        kit.dot(c, fx, fy, 4, C.text);
        const rpm = w * 60 / (2 * Math.PI);
        kit.label(c, Math.round(rpm) + ' rpm', fx + fr + 14, fy - 8, { size: 18, weight: 700 });
        kit.label(c, 'load ' + V.tl.toFixed(3) + ' N·m', fx + fr + 14, fy + 16, { size: 12, color: C.muted });
        kit.label(c, 'PWM ' + Math.round(V.d * 100) + ' % at ' + kit.eng(V.f, 'Hz'), fx + fr + 14, fy + 36, { size: 12, color: C.accent });
        // the scope, bottom
        const sy = yd + 90, sh = Math.max(80, Hh - sy - 18);
        const ivals = meas ? Math.max(Math.abs(meas.imax), 0.1) : 1;
        S.scope(c, 12, sy, W - 24, sh, {
          tdiv: 3 / V.f / 10, divy: 8,
          traces: [{ pts: shown.map(p => [p.t, p.vd]), vdiv: V.fly ? 5 : 20, offset: 0, label: 'drain' },
                   { pts: shown.map(p => [p.t, p.i]), vdiv: vdivFor(ivals, 3.5), offset: -4, label: 'I_motor (1 V/A)' }]
        });
        if (meas && step % (NP * 10) < steps) {
          const vav = M.V - meas.vd;
          const wss = (V.d * M.V * M.k - M.R * V.tl) / (M.k * M.k + M.R * M.b);
          ro.set('rpm', Math.round(rpm) + ' rpm');
          ro.set('rpmss', wss > 0 ? Math.round(wss * 60 / (2 * Math.PI)) + ' rpm' : 'stalled');
          ro.set('iav', kit.eng(meas.i, 'A'));
          ro.set('ipp', kit.eng(meas.imax - meas.imin, 'A'));
          ro.set('tq', (M.k * meas.i).toFixed(3) + ' N·m');
          ro.set('emf', kit.eng(M.k * w, 'V'));
          ro.set('vav', kit.eng(vav, 'V'));
          ro.set('p', kit.eng(meas.pin, 'W') + ' / ' + kit.eng(V.tl * w, 'W'));
          ro.set('aval', V.fly ? 'none (the diode carries the current)' : kit.eng(meas.aval, 'W'));
          ro.set('clk', simT.toFixed(2) + ' s simulated' + (steps >= MAXSTEPS ? ' (slow motion)' : ''));
          plot.set({ x: { label: 'time (s)' }, y: { label: 'speed (rpm)', min: 0 }, series: [{ pts: hist.slice(), label: 'speed' }] });
        }
      }
      build();
      const loop = kit.loop(dt => frame(dt), box.stage);
      loop.start();
    }
  });

  /* =========================================================== 8. cells under load */
  const CELLS = {
    li: { name: 'Li-ion 18650', cap: 3.0, r: 0.035, cut: 3.0, k: 1.0, ocv: [[-0.02, 2.4], [0, 2.9], [0.03, 3.3], [0.08, 3.45], [0.15, 3.55], [0.3, 3.65], [0.5, 3.75], [0.7, 3.9], [0.85, 4.02], [1, 4.18]], rT: [1, 2, 4.5], cT: [1, 0.9, 0.7] },
    nimh: { name: 'NiMH AA', cap: 2.0, r: 0.03, cut: 1.0, k: 1.05, ocv: [[-0.02, 0.7], [0, 0.95], [0.03, 1.1], [0.1, 1.2], [0.3, 1.24], [0.6, 1.27], [0.9, 1.32], [1, 1.4]], rT: [1, 2, 4], cT: [1, 0.9, 0.7] },
    alk: { name: 'Alkaline AA', cap: 2.8, r: 0.15, cut: 0.9, k: 1.35, ocv: [[-0.03, 0.5], [0, 0.9], [0.1, 1.1], [0.3, 1.25], [0.6, 1.35], [0.9, 1.47], [1, 1.58]], rT: [1, 2, 3.5], cT: [1, 0.7, 0.4], rEnd: 0.45 },
    pb: { name: 'Lead-acid 12 V', cap: 7.0, r: 0.025, cut: 10.5, k: 1.25, ocv: [[-0.02, 9.8], [0, 11.7], [0.25, 12.0], [0.5, 12.2], [0.75, 12.45], [1, 12.75]], rT: [1, 1.6, 2.5], cT: [1, 0.85, 0.65] },
    sc: { name: 'Supercapacitor', farad: 100, vmax: 2.7, r: 0.015, cut: 1.35, rT: [1, 1.3, 2], cT: [1, 1, 1] }
  };
  Hyper.sim('cp-storage', {
    title: 'Cells and supercapacitors under load',
    blurb: `Each storage device is modelled as an ideal source whose voltage depends on its state of charge, behind an internal resistance; a constant-current load discharges it until the terminal voltage reaches the cut-off. The graph plots terminal voltage against the charge delivered; earlier runs stay for comparison.

- Li-ion at 1.5 A, then at 10 A: the curve drops by the $I \\cdot r$ sag and reaches the cut-off earlier, so less capacity is delivered.
- Alkaline AA at 0.1 A and at 1 A: a primary cell with high internal resistance loses most of its capacity at high current.
- The supercapacitor falls in a straight line: its voltage is proportional to its charge. Stopping at half voltage still delivers three-quarters of its energy.
- Try −20 °C: internal resistance several times higher, capacity lower.`,
    mount(box, kit, P) {
      P = P || {};
      const st = kit.stage(box.stage, { aspect: 0.46, minH: 250 });
      const S = kit.schem;
      const ctl = kit.controls(box.side, [
        { id: 'cell', type: 'select', label: 'Cell', options: [['Li-ion 18650, 3.0 Ah', 'li'], ['NiMH AA, 2.0 Ah', 'nimh'], ['Alkaline AA (primary)', 'alk'], ['Lead-acid 12 V, 7 Ah', 'pb'], ['Supercapacitor 100 F, 2.7 V', 'sc']], value: CELLS[P.cell] ? P.cell : 'li' },
        { id: 'i', label: 'Load current', min: 0.05, max: 20, value: 1.5, log: true, sig: 2, fmt: v => kit.eng(v, 'A') },
        { id: 'temp', type: 'select', label: 'Cell temperature', options: [['25 °C', 0], ['0 °C', 1], ['−20 °C', 2]], value: 0 },
        { type: 'buttons', items: [{ id: 'go', label: 'Start a discharge', primary: true }, { id: 'clear', label: 'Clear the graph' }] }
      ], id => {
        if (id === 'cell' || id === 'clear') runs = [];
        start();
        update();
      });
      const ro = kit.readout(box.side, [['crate', 'C-rate'], ['vt', 'Terminal voltage'], ['ocv', 'Open-circuit voltage'], ['sag', 'Sag I·r'], ['heat', 'Heat in the cell I²r'], ['q', 'Delivered'], ['e', 'Energy delivered'], ['t', 'Time'], ['res', 'Result']]);
      const plot = kit.plot(plotBox(box), { x: { label: 'charge delivered (Ah)' }, y: { label: 'terminal voltage (V)' } }, 190);
      const V = ctl.values;
      let q = 0, e = 0, t = 0, running = false, cur = [], runs = [], vt = 0, ocv = 0, r = 0, result = '', frames = 0;

      const cell = () => CELLS[V.cell] || CELLS.li;
      function capOf(cl) {                              // usable capacity (C) at this current and temperature
        if (V.cell === 'sc') return cl.farad * cl.vmax;
        const ref = cl.cap / 20;
        const peuk = Math.min(1.1, Math.pow(ref / Math.max(V.i, 1e-3), cl.k - 1));
        return cl.cap * 3600 * peuk * cl.cT[V.temp];
      }
      function state() {
        const cl = cell();
        let v0;
        if (V.cell === 'sc') { v0 = cl.vmax - q / cl.farad; r = cl.r * cl.rT[V.temp]; }
        else {
          const soc = Math.min(1, 1 - q / capOf(cl));      // below zero the table falls off the knee
          v0 = interp(cl.ocv, soc);
          r = cl.r * cl.rT[V.temp] * (cl.rEnd ? 1 + (cl.rEnd / cl.r - 1) * Math.pow(1 - soc, 2) : 1);
        }
        const c = new kit.Circuit();
        c.V('p', 'gnd', v0, { r });
        c.I('p', 'gnd', V.i);
        c.dc();
        ocv = v0; vt = c.v('p');
      }
      function start() { q = 0; e = 0; t = 0; cur = []; running = true; result = ''; state(); }
      function tick(dt) {
        if (!running) return;
        const cl = cell();
        const span = capOf(cl) / V.i;                   // seconds for a full discharge at this current
        const h = span / (12 * 60) * (dt ? dt * 60 : 1) / 4;   // about 12 s of real time per discharge
        for (let k = 0; k < 4; k++) {
          state();
          if (vt <= cl.cut || (V.cell === 'sc' && ocv <= 0)) {
            running = false;
            result = V.cell === 'sc' ? 'cut-off at ' + kit.eng(cl.cut, 'V') + ': ' + (e / 3600).toPrecision(2) + ' Wh, ' + (100 * e / (0.5 * cl.farad * cl.vmax * cl.vmax)).toFixed(0) + ' % of the stored energy'
              : 'cut-off after ' + (q / 3600).toFixed(2) + ' Ah = ' + (100 * q / 3600 / cl.cap).toFixed(0) + ' % of the rated capacity';
            runs.push({ pts: cur.slice(), label: kit.eng(V.i, 'A') + (V.temp ? ' cold' : '') });
            if (runs.length > 4) runs.shift();
            cur = [];
            break;
          }
          q += V.i * h; e += vt * V.i * h; t += h;
          cur.push([q / 3600, vt]);
        }
      }
      function update() {
        const cl = cell();
        const qmax = V.cell === 'sc' ? cl.farad * cl.vmax / 3600 : cl.cap;
        const ocvPts = [];
        if (V.cell === 'sc') ocvPts.push([0, cl.vmax], [qmax, 0]);
        else for (let k = 0; k <= 40; k++) { const soc = 1 - k / 40; ocvPts.push([qmax * k / 40, interp(cl.ocv, soc)]); }
        const series = runs.map(rn => ({ pts: rn.pts, label: rn.label }));
        if (cur.length) series.push({ pts: cur.slice(), label: kit.eng(V.i, 'A') + ' (now)' });
        series.push({ pts: ocvPts, label: 'resting voltage', dash: [5, 4] });
        const vmax = V.cell === 'sc' ? cl.vmax : cl.ocv[cl.ocv.length - 1][1];
        plot.set({ x: { label: 'charge delivered (Ah)', min: 0, max: qmax * 1.1 }, y: { label: 'terminal voltage (V)', min: V.cell === 'pb' ? 9 : 0, max: vmax * 1.05 }, series, hlines: [{ y: cl.cut, label: 'cut-off' }] });
        const cap = V.cell === 'sc' ? cl.farad * cl.vmax / 3600 : cl.cap;
        ro.set('crate', V.cell === 'sc' ? 'not used for capacitors' : (V.i / cap).toPrecision(2) + ' C');
        ro.set('vt', kit.eng(vt, 'V'));
        ro.set('ocv', kit.eng(ocv, 'V'));
        ro.set('sag', kit.eng(V.i * r, 'V'));
        ro.set('heat', kit.eng(V.i * V.i * r, 'W'));
        ro.set('q', (q / 3600 * 1000).toFixed(0) + ' mAh');
        ro.set('e', (e / 3600).toPrecision(3) + ' Wh');
        ro.set('t', t < 120 ? t.toFixed(0) + ' s' : t < 7200 ? (t / 60).toFixed(1) + ' min' : (t / 3600).toFixed(2) + ' h');
        ro.set('res', running ? 'discharging…' : result || '—');
      }
      function draw() {
        const C = kit.colors(), c = st.begin(), W = st.W, Hh = st.H, cl = cell();
        // the cell, with its charge level
        const bx = W * 0.05, by = Hh * 0.18, bw = W * 0.1, bh = Hh * 0.66;
        const qmax = V.cell === 'sc' ? cl.farad * cl.vmax : capOf(cl);
        const lvl = clamp(1 - q / qmax, 0, 1);
        c.fillStyle = C.surface; c.strokeStyle = C.text; c.lineWidth = 2; rrect(c, bx, by, bw, bh, 8); c.fill(); c.stroke();
        c.fillStyle = C.text; c.fillRect(bx + bw * 0.3, by - 8, bw * 0.4, 8);
        c.fillStyle = lvl > 0.3 ? C.ok : lvl > 0.1 ? C.warn : C.bad;
        rrect(c, bx + 5, by + 5 + (bh - 10) * (1 - lvl), bw - 10, (bh - 10) * lvl, 5); c.fill();
        kit.label(c, Math.round(lvl * 100) + ' %', bx + bw / 2, by + bh + 16, { size: 12, align: 'center', color: C.muted });
        // the model: EMF behind r, into a constant-current load
        const x1 = W * 0.26, x2 = W * 0.52, top = Hh * 0.18, bot = Hh * 0.84, mid = (top + bot) / 2;
        if (V.cell === 'sc') S.capacitor(c, x1, mid - 26, x1, mid + 10, { label: '100 F', value: kit.eng(ocv, 'V') });
        else S.battery(c, x1, mid - 26, x1, mid + 10, { label: 'EMF', value: kit.eng(ocv, 'V') });
        S.wire(c, [[x1, mid - 26], [x1, top], [x1 + 20, top]]);
        S.resistor(c, x1 + 20, top, x2 - 30, top, { label: 'r', value: kit.eng(r, 'Ω') });
        S.wire(c, [[x2 - 30, top], [x2, top], [x2, mid - 17]]);
        S.isource(c, x2, mid - 17, x2, mid + 17, { label: 'load', value: kit.eng(V.i, 'A') });
        S.wire(c, [[x2, mid + 17], [x2, bot], [x1, bot], [x1, mid + 10]]);
        c.setLineDash && c.setLineDash([4, 4]);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(x1 - 30, top - 34, (x2 - 16) - (x1 - 30), bot - top + 48);
        c.setLineDash && c.setLineDash([]);
        kit.label(c, 'inside the cell', x1 - 24, bot + 24, { size: 11, color: C.faint });
        const xm = x2 + W * 0.14;
        S.wire(c, [[x2, top], [xm, top], [xm, mid - 16]]); S.wire(c, [[xm, mid + 16], [xm, bot], [x2, bot]]);
        S.meter(c, xm, mid, 'V', kit.eng(vt, 'V'));
        S.node(c, x2, top); S.node(c, x2, bot);
        kit.label(c, running ? 'discharging' : 'stopped', W * 0.78, top, { size: 13, weight: 700, color: running ? C.accent : C.muted });
        kit.label(c, kit.eng(vt, 'V') + ' at ' + kit.eng(V.i, 'A'), W * 0.78, top + 24, { size: 13 });
        kit.label(c, 'lost inside: ' + kit.eng(V.i * r, 'V'), W * 0.78, top + 44, { size: 12, color: C.muted });
      }
      start();
      const loop = kit.loop(dt => { tick(dt); draw(); if (++frames % 6 === 0 || !running) update(); }, box.stage);
      loop.start();
    }
  });
})();
