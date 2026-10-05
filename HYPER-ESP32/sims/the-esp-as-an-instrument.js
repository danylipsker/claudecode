/* HYPER-ESP32 · sims/the-esp-as-an-instrument.js
 *
 * Simulations of the topic "The ESP as an instrument":
 *   in-target     accuracy, precision and resolution: shots on a target and readings on a number line
 *   in-voltmeter  a voltmeter built from a divider, the ADC and a calibration: the chain, the error against the input, the loading
 *   in-scope      a waveform sampled by the ESP at a chosen rate: trigger, aliasing, an anti-alias filter
 *   in-logic      a UART or I2C stream captured by polling at a chosen sample rate and decoded from the capture
 *   in-counter    the input stage of a frequency counter: threshold, noise, hysteresis and a glitch filter
 *   in-generator  LEDC squares and their duty resolution, a DAC staircase sine, and PWM through an RC filter
 *   in-wifiscan   a Wi-Fi scan as a channel chart with signal strengths, and the congestion of channels 1, 6 and 11
 *   in-logger     a logger filling its storage: stop, rotate or ring, and the wear of flushing
 *   in-power      a sleep-and-wake current profile against what a meter that samples it reads
 *   in-present    a live signal shown raw, smoothed and as a slowly refreshed number
 *   in-calibrate  a calibration line fitted through points, the residuals and the uncertainty that is left
 *
 * Numbers come from kit.esp where the engine has them (LEDC resolution, Wi-Fi channels, chip currents, flash life, battery life).
 * The converter, divider, meter and noise models are schematic: representative figures, not measurements of a particular chip.
 * Everything is drawn in theme colours; static pictures redraw on demand (loop.once), moving ones run a loop.
 */
(function () {
  'use strict';
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const fmt = (v, s) => Hyper.util.fmt(v, s);
  const num = (v, d) => (Number.isFinite(v) ? v.toFixed(d) : '—');
  const tText = s => { const a = Math.abs(s); return a >= 1 ? fmt(s, 3) + ' s' : a >= 1e-3 ? fmt(s * 1e3, 3) + ' ms' : a >= 1e-6 ? fmt(s * 1e6, 3) + ' µs' : fmt(s * 1e9, 3) + ' ns'; };
  const fText = f => f >= 1e6 ? fmt(f / 1e6, 3) + ' MHz' : f >= 1e3 ? fmt(f / 1e3, 3) + ' kHz' : fmt(f, 3) + ' Hz';
  const shade = C => C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';
  const rng = seed => { let s = (seed * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
  const gauss = r => { let u = 0; while (u === 0) u = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * r()); };
  const line = (c, x0, y0, x1, y1, color, w) => { c.strokeStyle = color; c.lineWidth = w || 1; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); };
  const dash = (c, x0, y0, x1, y1, color, w) => { c.save(); c.setLineDash([5, 4]); c.strokeStyle = color; c.lineWidth = w || 1.4; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore(); };
  const frame = (c, x, y, w, h, C) => { c.fillStyle = C.dark ? 'rgba(0,0,0,.28)' : 'rgba(0,0,0,.035)'; c.fillRect(x, y, w, h); c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(x + 0.5, y + 0.5, w, h); };
  const grid = (c, x, y, w, h, nx, ny, C) => { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); for (let i = 1; i < nx; i++) { const gx = Math.round(x + w * i / nx) + 0.5; c.moveTo(gx, y); c.lineTo(gx, y + h); } for (let j = 1; j < ny; j++) { const gy = Math.round(y + h * j / ny) + 0.5; c.moveTo(x, gy); c.lineTo(x + w, gy); } c.stroke(); };
  const niceTop = v => { const e = Math.pow(10, Math.floor(Math.log10(Math.max(v, 1e-9)))); const m = v / e; return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 5 ? 5 : 10) * e; };

  /* ================================================================ in-target */
  Hyper.sim('in-target', {
    title: 'Accuracy, resolution and precision',
    blurb: `Thirty readings of the same steady voltage, 1650.3 mV, drawn twice. On the **target**, each reading is a shot, the bull's-eye is the truth and each ring is 10 mV. On the **number line**, each reading is a dot at its error, stacked when readings repeat; the vertical green line is the mean and the bar is one standard deviation either side of it.

The three sliders are the three properties: **bias** moves the whole cluster away from the truth (accuracy), **scatter** spreads it (precision), and **one step** snaps every reading to a grid (resolution). The picture is schematic: the second axis of the target uses the same settings.

**Try this**
- Set the scatter to 0 and the bias to 14 mV: every reading is the same, to the last digit, and wrong by the bias. Precise, not accurate.
- Set the bias to 0 and the scatter to 8 mV: right on average, individually unreliable. Take new readings: the cluster dances around the bull's-eye.
- Raise **one step** to 10 mV: the dots fall on a few grid lines, whatever the scatter. Now the readings look very precise, and are not.
- Compare the mean error with the step: a bias smaller than one step cannot even be seen.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.64, maxH: 540 });
      let seed = 3;
      const ctl = kit.controls(box.side, [
        { id: 'bias', label: 'Bias (offset)', min: -30, max: 30, step: 0.5, value: 14, unit: 'mV' },
        { id: 'sd', label: 'Scatter (noise)', min: 0, max: 15, step: 0.25, value: 2, unit: 'mV' },
        { id: 'step', label: 'One step (resolution)', min: 0.1, max: 20, step: 0.1, value: 1, unit: 'mV', log: true },
        { type: 'buttons', items: [{ id: 'new', label: 'Take new readings', primary: true }] }
      ], id => { if (id === 'new') seed++; loop.once(); });
      const ro = kit.readout(box.side, [['acc', 'Mean error (accuracy)'], ['prec', 'Scatter (precision)'], ['res', 'One step (resolution)'], ['verdict', 'In words']]);
      const TRUE = 1650.3, N = 30, R = 40;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const r = rng(seed * 7919), step = Math.max(v.step, 0.05);
        const q = x => Math.round(x / step) * step;
        const shots = [];
        for (let i = 0; i < N; i++) {
          const ex = q(TRUE + v.bias + v.sd * gauss(r)) - TRUE;
          const ey = q(TRUE - 0.45 * v.bias + v.sd * gauss(r)) - TRUE;
          shots.push([ex, ey]);
        }
        const errs = shots.map(s => s[0]);
        const mean = errs.reduce((a, b) => a + b, 0) / N;
        const sd = Math.sqrt(errs.reduce((a, b) => a + (b - mean) * (b - mean), 0) / (N - 1));
        const wide = st.W >= 600;
        const ts = wide ? Math.min(st.H - 24, st.W * 0.4) : Math.min(st.W - 24, st.H * 0.52);
        const tx = wide ? 12 : (st.W - ts) / 2, ty = 12;
        const cx = tx + ts / 2, cy = ty + ts / 2, k = ts / 2 / (R * 1.15);
        // target
        c.fillStyle = shade(C); c.beginPath(); c.arc(cx, cy, R * 1.15 * k, 0, Math.PI * 2); c.fill();
        for (const rr of [40, 30, 20, 10]) { c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.arc(cx, cy, rr * k, 0, Math.PI * 2); c.stroke(); }
        line(c, cx - R * 1.15 * k, cy, cx + R * 1.15 * k, cy, C.grid, 1); line(c, cx, cy - R * 1.15 * k, cx, cy + R * 1.15 * k, C.grid, 1);
        kit.dot(c, cx, cy, 3, C.text);
        for (const [ex, ey] of shots) kit.dot(c, cx + clamp(ex, -R * 1.15, R * 1.15) * k, cy - clamp(ey, -R * 1.15, R * 1.15) * k, 4, kit.hue(28, 0.85), C.text);
        kit.label(c, 'rings: 10 mV', tx + 4, ty + ts - 6, { size: 10.5, color: C.muted });
        // number line
        const nx = wide ? tx + ts + 28 : 18, nw = wide ? st.W - nx - 16 : st.W - 36;
        const ny = wide ? ty + ts * 0.55 : ty + ts + 70, X = e => nx + nw * (e + R) / (2 * R);
        const counts = new Map();
        for (const e of errs) { const key = Math.round(e / step); counts.set(key, (counts.get(key) || 0) + 1); }
        const pxStep = nw * step / (2 * R);
        if (pxStep > 4) { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); for (let e = Math.ceil(-R / step) * step; e <= R; e += step) { const gx = Math.round(X(e)) + 0.5; c.moveTo(gx, ny - 78); c.lineTo(gx, ny); } c.stroke(); }
        else { c.fillStyle = shade(C); c.fillRect(nx, ny - 78, nw, 78); }
        line(c, nx, ny, nx + nw, ny, C.axis, 1.4);
        for (let e = -40; e <= 40; e += 10) { const x = X(e); line(c, x, ny, x, ny + 5, C.axis, 1); kit.label(c, (e > 0 ? '+' : '') + e, x, ny + 16, { size: 10, color: C.muted, align: 'center' }); }
        kit.label(c, 'error of each reading (mV)', nx, ny + 32, { size: 10.5, color: C.muted });
        for (const [key, cnt] of counts) for (let j = 0; j < cnt; j++) kit.dot(c, X(key * step), ny - 7 - j * 7.5, 3.2, kit.hue(28, 0.9), C.text);
        line(c, X(0), ny - 84, X(0), ny, C.text, 1.6); kit.label(c, 'truth', X(0), ny - 92, { size: 10.5, color: C.text, align: 'center' });
        const mx = clamp(mean, -R, R);
        line(c, X(mx), ny - 84, X(mx), ny, C.ok, 2.2);
        c.fillStyle = C.dark ? 'rgba(34,179,122,.28)' : 'rgba(34,179,122,.20)'; c.fillRect(X(clamp(mean - sd, -R, R)), ny + 38, Math.max(2, X(clamp(mean + sd, -R, R)) - X(clamp(mean - sd, -R, R))), 8);
        kit.label(c, 'mean ± one standard deviation', X(mx), ny + 60, { size: 10.5, color: C.ok, align: 'center' });
        const accurate = Math.abs(mean) < 8, precise = sd < 4, fine = step <= 4;
        ro.set('acc', (mean >= 0 ? '+' : '') + num(mean, 1) + ' mV');
        ro.set('prec', num(sd, 2) + ' mV');
        ro.set('res', num(step, 2) + ' mV');
        ro.set('verdict', (accurate ? 'accurate' : 'not accurate') + ', ' + (precise ? 'precise' : 'not precise') + ', ' + (fine ? 'fine steps' : 'coarse steps'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ in-voltmeter */
  const VM = (function () {
    const RATIO = 82e3 / (1e6 + 82e3), RIN = { low: 10e6, high: 1.082e6 }, STEP = 3.1 / 4096, FS = 2.4, GERR = 0.018, OFFS = 0.009, TOL = 0.009;
    /* one reading of the chain: the source, a range, the converter, an optional calibration -> what is shown */
    function measure(vin, rs, rangeKey, cal, avgN, noiseC) {
      const range = rangeKey === 'auto' ? (vin * 0.98 <= FS ? 'low' : 'high') : rangeKey;
      const rin = RIN[range], vm = vin * rin / (rin + rs);
      const nom = range === 'low' ? 1 : RATIO, act = range === 'low' ? 1 : RATIO * (1 + TOL);
      const vp = vm * act, over = vp > FS;
      let rd = Math.min(vp, 3.1) * (1 + GERR) + OFFS;
      rd = Math.round(rd / STEP) * STEP;
      const gtot = (1 + GERR) * (act / nom) - 1;
      const shown = cal ? (rd - (OFFS - 0.001)) / nom / (1 + gtot - 0.002) : rd / nom;
      const stepIn = STEP / nom, noise = noiseC / Math.sqrt(Math.max(1, avgN)) * stepIn;
      return { range, rin, vm, vp, over, shown, err: shown - vin, stepIn, noise, loadErr: vm - vin, ratio: nom };
    }
    return { measure, FS, RATIO, RIN };
  })();

  Hyper.sim('in-voltmeter', {
    title: 'A voltmeter built from a divider, the ADC and a calibration',
    blurb: `The top row follows one measurement along its chain: the **source**, the **range** with its divider, the **converter** (what the pin sees, as volts), the **calibration** and the **display**. The graph below is the **error of the display** at every input voltage, for the chosen range, in millivolts: the dark green line is the error, the band is the step of one count and the noise.

The converter model is schematic and typical of an uncalibrated chip: a gain error of 1.8 %, an offset of 9 mV at the pin and a divider with 1 % resistors. The calibration removes all but 0.2 % and 1 mV. The direct range has 10 MΩ of input resistance in the model; the divider range 1.08 MΩ.

**Try this**
- Choose the **30 V range** with the calibration off and read the error at 5 V: the 9 mV offset at the pin is more than 100 mV at the input. Now tick **calibrated**.
- Raise the **source resistance** to 100 kΩ on the 30 V range: the meter loads the source and reads about 8 % low. Switch to the direct range and the loading all but vanishes.
- Slide the input above 2.4 V on the direct range: the display says OVER, and the pin would be in danger without a clamp.
- Choose **automatic** and sweep the input: the error curve jumps where the range changes.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, maxH: 640 });
      const ctl = kit.controls(box.side, [
        { id: 'vin', label: 'Voltage at the source', min: 0, max: 32, step: 0.05, value: 12, unit: 'V' },
        { id: 'range', type: 'select', label: 'Range', options: [['direct, 0 to 2.4 V', 'low'], ['30 V, through the divider', 'high'], ['automatic', 'auto']], value: 'high' },
        { id: 'rs', label: 'Source resistance', min: 0.1, max: 1000, step: 0.1, value: 10, unit: 'kΩ', log: true },
        { id: 'cal', type: 'check', label: 'Calibrated (gain and offset corrected)', value: false },
        { id: 'avg', type: 'select', label: 'Readings averaged', options: [['1', 1], ['16', 16], ['64', 64], ['256', 256]], value: 64 },
        { id: 'noise', label: 'Noise of one reading', min: 0, max: 8, step: 0.5, value: 3, unit: 'counts' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['shown', 'Display'], ['true', 'Voltage at the source'], ['err', 'Error'], ['step', 'One count, at the input'], ['rin', 'Input resistance'], ['load', 'Loading error']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, rs = v.rs * 1e3;
        const m = VM.measure(v.vin, rs, v.range, v.cal, v.avg, v.noise);
        // the chain
        const M = 10, gap = 14, n = 5, bw = (st.W - 2 * M - (n - 1) * gap) / n, by = 14, bh = 48, sz = bw < 84 ? 10.5 : 12.5;
        const vtxt = x => (Math.abs(x) >= 10 ? x.toFixed(1) : x.toFixed(3)) + ' V';
        const boxes = [
          ['Source', vtxt(v.vin) + ' / ' + (v.rs >= 100 ? Math.round(v.rs) : v.rs.toFixed(1)) + 'k', kit.hue(30)],
          ['Range', m.range === 'low' ? 'direct' : '÷' + (1 / VM.RATIO).toFixed(1), kit.hue(200)],
          ['Converter', m.over ? 'over: ' + vtxt(m.vp) : vtxt(m.vp), m.over ? C.bad : kit.hue(150)],
          ['Calibrate', v.cal ? 'on' : 'off', v.cal ? C.ok : C.faint],
          ['Display', m.over ? 'OVER' : vtxt(m.shown), m.over ? C.bad : C.accent]
        ];
        boxes.forEach((b, i) => {
          const x = M + i * (bw + gap);
          S.box(c, x, by, bw, bh, { label: b[0], sub: b[1], color: b[2], active: true, size: sz });
          if (i < n - 1) kit.arrow(c, x + bw + 1, by + bh / 2, x + bw + gap - 1, by + bh / 2, C.muted, 1.4);
        });
        kit.label(c, 'what the pin sees, as volts at the pin; the display scales it back', M, by + bh + 14, { size: 10.5, color: C.muted });
        // the error graph
        const lx = 56, rx = 14, gx = lx, gw = st.W - lx - rx, gy = by + bh + 44, gh = st.H - gy - 40;
        const X = V => gx + gw * V / 32;
        let emax = 0.02;
        const pts = [];
        for (let i = 0; i <= 160; i++) {
          const V = 32 * i / 160, mm = VM.measure(V, rs, v.range, v.cal, v.avg, v.noise);
          pts.push([V, mm.over ? null : mm.err * 1000, (mm.stepIn / 2 + mm.noise) * 1000]);
          if (!mm.over) emax = Math.max(emax, Math.abs(mm.err * 1000) + (mm.stepIn / 2 + mm.noise) * 1000);
        }
        const top = niceTop(emax * 1.1), Y = e => gy + gh / 2 - (gh / 2) * clamp(e / top, -1, 1);
        frame(c, gx, gy, gw, gh, C); grid(c, gx, gy, gw, gh, 8, 4, C);
        line(c, gx, Y(0), gx + gw, Y(0), C.axis, 1.2);
        for (let V = 0; V <= 32; V += 4) kit.label(c, V + '', X(V), gy + gh + 12, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'voltage at the source (V)', gx + gw, gy + gh + 28, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'error of the display (mV)', gx, gy - 12, { size: 10.5, color: C.muted });
        kit.label(c, '+' + fmt(top, 2), gx - 6, gy + 6, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, '−' + fmt(top, 2), gx - 6, gy + gh - 6, { size: 10, color: C.muted, align: 'right' });
        // over-range zones, the band and the curve
        let runStart = -1;
        const flush = (i0, i1) => {
          if (i1 - i0 < 1) return;
          c.fillStyle = C.dark ? 'rgba(34,179,122,.26)' : 'rgba(34,179,122,.20)'; c.beginPath();
          for (let i = i0; i <= i1; i++) c.lineTo(X(pts[i][0]), Y(pts[i][1] + pts[i][2]));
          for (let i = i1; i >= i0; i--) c.lineTo(X(pts[i][0]), Y(pts[i][1] - pts[i][2]));
          c.closePath(); c.fill();
          c.strokeStyle = kit.hue(150, 1); c.lineWidth = 2; c.beginPath();
          for (let i = i0; i <= i1; i++) { if (i === i0) c.moveTo(X(pts[i][0]), Y(pts[i][1])); else c.lineTo(X(pts[i][0]), Y(pts[i][1])); }
          c.stroke();
        };
        for (let i = 0; i <= 160; i++) {
          const ok = pts[i][1] != null;
          if (ok && runStart < 0) runStart = i;
          if ((!ok || i === 160) && runStart >= 0) { flush(runStart, ok ? i : i - 1); runStart = -1; }
          if (!ok) { c.fillStyle = C.dark ? 'rgba(229,72,77,.18)' : 'rgba(229,72,77,.10)'; c.fillRect(X(pts[i][0]) - gw / 320, gy, gw / 160 + 1, gh); }
        }
        const x0 = X(v.vin);
        dash(c, x0, gy, x0, gy + gh, C.warn, 1.3);
        if (!m.over) kit.dot(c, x0, Y(m.err * 1000), 4.5, C.warn, C.text);
        kit.label(c, 'red: over range · band: one count and the noise', gx + 6, gy + 12, { size: 10.5, color: C.muted });
        ro.set('shown', m.over ? 'OVER' : num(m.shown, m.stepIn >= 0.05 ? 2 : 3) + ' V');
        ro.set('true', num(v.vin, 3) + ' V');
        ro.set('err', m.over ? '—' : (m.err >= 0 ? '+' : '') + num(m.err * 1000, 1) + ' mV' + (v.vin > 0.05 ? ' (' + num(100 * m.err / v.vin, 2) + ' %)' : ''));
        ro.set('step', num(m.stepIn * 1000, 2) + ' mV');
        ro.set('rin', m.rin >= 1e6 ? num(m.rin / 1e6, 2) + ' MΩ' : num(m.rin / 1e3, 0) + ' kΩ');
        ro.set('load', num(100 * m.loadErr / Math.max(v.vin, 1e-9), 2) + ' %');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ in-scope */
  const harmonicsOf = kind => {
    const out = [];
    if (kind === 'sine') return [{ h: 1, a: 1 }];
    for (let h = 1; h <= 25; h += 2) out.push({ h, a: kind === 'square' ? 4 / (Math.PI * h) : 8 / (Math.PI * Math.PI * h * h) * (((h - 1) / 2) % 2 === 0 ? 1 : -1) });
    return out;
  };
  Hyper.sim('in-scope', {
    title: 'The ESP as an oscilloscope: sampling, trigger and aliasing',
    blurb: `The upper trace is the real signal. The lower one is what an ESP scope would draw: the dots are the **samples** the converter took, the line joins them, and the dotted orange line is the **trigger level**. With the trigger off, every picture starts at a different moment and the trace slides about; with it on, each picture starts where the signal crosses the level going up, and the picture stands still.

The signal swings between 0.3 and 2.3 V, inside the converter's range. The model adds noise in counts of a 12-bit converter and quantises to the chosen number of bits; the filter is a first-order RC with its corner at half the sample rate. Schematic, but the arithmetic of sampling and of the alias is exact.

**Try this**
- Set the signal to 1 kHz and the rate to 20 kS/s: 20 samples a period, a faithful picture. Lower the rate to 3 kS/s: three samples a period, a lumpy sine.
- Put the frequency above half the sample rate (1.2 kHz at 2 kS/s): the trace shows a slow wave that is not there. The read-out gives its apparent frequency.
- Tick **anti-alias filter** with the signal still above the limit: the false wave shrinks to a small ripple.
- Choose a **square** wave and lower the rate: the edges are placed by the samples, not by the signal.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.82, maxH: 620 });
      let frameNo = 0, acc = 0;
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Signal', options: [['sine', 'sine'], ['square', 'square'], ['triangle', 'triangle']], value: 'sine' },
        { id: 'f', label: 'Frequency', min: 100, max: 40000, step: 10, value: 1000, unit: 'Hz', log: true },
        { id: 'fs', label: 'Sample rate', min: 1, max: 200, step: 0.5, value: 20, unit: 'kS/s', log: true },
        { id: 'tdiv', label: 'Time per division', min: 0.05, max: 5, step: 0.05, value: 0.5, unit: 'ms', log: true },
        { id: 'trig', type: 'check', label: 'Trigger on (rising edge)', value: true },
        { id: 'level', label: 'Trigger level', min: 5, max: 95, step: 1, value: 50, unit: '% of range' },
        { id: 'aa', type: 'check', label: 'Anti-alias filter (corner at half the rate)', value: false },
        { id: 'bits', type: 'select', label: 'Bits used', options: [['8', 8], ['10', 10], ['12', 12]], value: 12 },
        { id: 'noise', label: 'Noise', min: 0, max: 8, step: 0.5, value: 2, unit: 'counts' }
      ], () => { acc = 1; loop.once(); });
      const ro = kit.readout(box.side, [['spp', 'Samples per period'], ['nyq', 'Highest frequency shown'], ['app', 'Frequency of the drawn wave'], ['verdict', 'The picture is'], ['trig', 'Trigger']]);
      const VFS = 2.45;
      const loop = kit.loop((dt) => {
        acc += dt;
        if (acc < 0.09) return;
        acc = 0; frameNo++;
        const c = st.begin(), C = kit.colors(), v = ctl.values, fs = v.fs * 1e3, f = v.f;
        const fc = v.aa ? fs / 2 : Infinity, hs = harmonicsOf(v.kind);
        const truth = t => { let s = 0; for (const o of hs) s += o.a * Math.sin(2 * Math.PI * o.h * f * t); return 1.3 + 1.0 * s; };
        const filtered = t => { let s = 0; for (const o of hs) { const w = o.h * f / fc, g = 1 / Math.sqrt(1 + w * w); s += o.a * g * Math.sin(2 * Math.PI * o.h * f * t - Math.atan(w)); } return 1.3 + 1.0 * s; };
        const r = rng(frameNo * 131 + 7), lsb12 = VFS / 4095, maxc = Math.pow(2, v.bits) - 1;
        const sample = t => { const x = filtered(t) + v.noise * lsb12 * gauss(r); return clamp(Math.round(clamp(x, 0, VFS) / VFS * maxc), 0, maxc) / maxc * VFS; };
        const T = 10 * v.tdiv * 1e-3, L = v.level / 100 * VFS;
        const t0 = v.trig ? 0 : r() / Math.max(f, 1) * 3;                 // an untriggered capture starts at any moment
        const scan = Math.min(6000, Math.ceil(fs * 0.03)), K = Math.ceil(T * fs) + scan + 2;
        const xs = new Array(K);
        for (let k = 0; k < K; k++) xs[k] = sample(t0 + k / fs);
        let start = 0, found = !v.trig;
        if (v.trig) for (let k = 1; k < scan; k++) if (xs[k - 1] < L && xs[k] >= L) { start = k; found = true; break; }
        // layout
        const lx = 52, rx = 12, pw = st.W - lx - rx, ph = (st.H - 96) / 2;
        const y1 = 22, y2 = y1 + ph + 40, X = tt => lx + pw * tt / T, Y = (V, y) => y + ph - ph * clamp(V / 2.6, 0, 1);
        for (const [yy, name] of [[y1, 'the real signal'], [y2, 'what the ESP draws']]) {
          frame(c, lx, yy, pw, ph, C); grid(c, lx, yy, pw, ph, 10, 4, C);
          kit.label(c, name, lx, yy - 10, { size: 10.5, color: C.muted });
          kit.label(c, '2.5 V', lx - 6, yy + 6, { size: 10, color: C.muted, align: 'right' }); kit.label(c, '0 V', lx - 6, yy + ph - 4, { size: 10, color: C.muted, align: 'right' });
        }
        kit.label(c, fmt(v.tdiv, 2) + ' ms / division', lx + pw, y2 + ph + 14, { size: 10.5, color: C.muted, align: 'right' });
        // the real signal, from the moment of the trigger
        const tStart = start / fs + t0;
        c.strokeStyle = kit.hue(212, 1); c.lineWidth = 1.8; c.beginPath();
        const nPix = Math.max(60, Math.round(pw));
        for (let i = 0; i <= nPix; i++) { const tt = T * i / nPix, yv = Y(truth(tStart + tt), y1); if (i) c.lineTo(lx + pw * i / nPix, yv); else c.moveTo(lx, yv); }
        c.stroke();
        // the samples
        const n = Math.min(K - start, Math.floor(T * fs) + 2);
        c.strokeStyle = C.accent; c.lineWidth = 1.8; c.beginPath();
        for (let i = 0; i < n; i++) { const x = X(i / fs), yy = Y(xs[start + i], y2); if (i) c.lineTo(x, yy); else c.moveTo(x, yy); }
        c.stroke();
        if (pw / Math.max(1, T * fs) > 3.2) for (let i = 0; i < n; i++) kit.dot(c, X(i / fs), Y(xs[start + i], y2), 2.6, kit.hue(28, 0.95), C.text);
        const yl = Y(L, y2); dash(c, lx, yl, lx + pw, yl, C.warn, 1.2);
        if (v.trig && found) kit.dot(c, X(0), Y(xs[start], y2), 4, C.warn, C.text);
        // numbers
        const spp = fs / f, near = Math.round(f / fs) * fs, app = Math.abs(f - near);
        const aliased = f >= fs / 2;
        ro.set('spp', num(spp, 1));
        ro.set('nyq', fText(fs / 2));
        ro.set('app', aliased ? fText(Math.max(app, 0.01)) + ' (false)' : fText(f));
        ro.set('verdict', aliased ? 'aliased: not the real signal' : spp >= 5 ? 'faithful' : 'coarse: the shape is guessed');
        ro.set('trig', v.trig ? (found ? 'found, steady' : 'not found in 30 ms') : 'off, slides about');
      }, box.stage);
      st.onResize(() => { acc = 1; loop.once(); });
      loop.start();
    }
  });

  /* ================================================================ in-logic */
  const BUSES = [['UART, 9600 baud', 'u9600'], ['UART, 115200 baud', 'u115200'], ['UART, 921600 baud', 'u921600'], ['I2C, 100 kHz', 'i100000'], ['I2C, 400 kHz', 'i400000']];
  const MSGS = [['"Hi"  (0x48 0x69)', 0], ['"Ok"  (0x4F 0x6B)', 1]];
  const MSG_BYTES = [[0x48, 0x69], [0x4F, 0x6B]];
  const hex2 = b => '0x' + (b < 16 ? '0' : '') + b.toString(16).toUpperCase();
  /* the levels of an edge list [[t, level], …] at increasing times */
  const levelsAt = (edges, T) => {
    const out = new Array(T.length); let j = 0;
    for (let k = 0; k < T.length; k++) {
      while (j + 1 < edges.length && edges[j + 1][0] <= T[k]) j++;
      out[k] = edges.length ? (T[k] < edges[0][0] ? edges[0][1] : edges[j][1]) : 1;
    }
    return out;
  };
  const edgesOfSamples = (T, L) => { const out = []; for (let k = 0; k < T.length; k++) if (k === 0 || L[k] !== L[k - 1]) out.push([T[k], L[k]]); return out; };
  function decodeUart(T, L, baud) {
    const tb = 1 / baud, n = T.length, out = [];
    let k = 0;
    while (k < n) {
      while (k < n && L[k] === 1) k++;
      if (k >= n) break;
      const ts = T[k];
      let j = k;
      const at = tt => { while (j + 1 < n && T[j + 1] <= tt) j++; return L[j]; };
      if (ts + 9.5 * tb > T[n - 1] + 1e-12) break;
      let byte = 0;
      for (let i = 0; i < 8; i++) byte |= at(ts + (i + 1.5) * tb) << i;
      const stopOk = at(ts + 9.5 * tb) === 1;
      out.push({ byte, bad: !stopOk, t0: ts, t1: ts + 10 * tb, text: hex2(byte) + (stopOk ? '' : ' !') });
      while (k < n && T[k] <= ts + 9.5 * tb) k++;
    }
    return out;
  }
  function decodeI2c(T, SCL, SDA, tb) {
    const n = T.length, out = [];
    let started = false, bits = [], times = [];
    for (let k = 1; k < n; k++) {
      if (!started) { if (SCL[k - 1] && SCL[k] && SDA[k - 1] === 1 && SDA[k] === 0) { started = true; bits = []; times = []; } continue; }
      if (SCL[k - 1] === 0 && SCL[k] === 1) {
        bits.push(SDA[k]); times.push(T[k]);
        if (bits.length === 9) {
          let byte = 0;
          for (let i = 0; i < 8; i++) byte = (byte << 1) | bits[i];
          const first = out.length === 0;
          out.push({ byte, bad: bits[8] === 1, t0: times[0] - tb * 0.5, t1: times[8] + tb * 0.5, text: first ? hex2(byte >> 1) + ((byte & 1) ? ' R' : ' W') : hex2(byte) });
          bits = []; times = [];
        }
      } else if (SCL[k - 1] && SCL[k] && SDA[k - 1] === 0 && SDA[k] === 1) break;
    }
    return out;
  }
  Hyper.sim('in-logic', {
    title: 'A logic analyser by polling: what the sample rate does to the decoding',
    blurb: `A UART or an I2C write is sent on the line (the true traces at the top). The ESP **polls** the pin at the chosen sample rate; the traces marked *seen* are rebuilt from those samples alone, and the bytes in the boxes are **decoded from the samples**, the way a software decoder would. A red box is a framing error or a missing acknowledge.

The tick marks under the traces are the sample instants, drawn when they are far enough apart to see. **Busy processor** delays each sample by up to the chosen time at random, the way Wi-Fi interrupts do.

**Try this**
- With UART at 115200 baud and 500 kS/s the message decodes. Lower the sample rate towards 150 kS/s (about one sample a bit): the bytes turn wrong, with no warning.
- Choose UART at 921600 baud: at 1 MS/s (about one sample a bit) one bit is read wrong; at 2 MS/s it is right.
- Choose I2C at 400 kHz: at 1 MS/s it decodes; at 700 kS/s the SCL pulses are missed and nothing is decoded.
- Raise the **busy processor** time: at 115200 baud and 500 kS/s a delay of 10 to 20 µs, longer than a bit, garbles the bytes. I2C at 5 MS/s fails at 5 µs.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.7, maxH: 560 });
      let seed = 1;
      const ctl = kit.controls(box.side, [
        { id: 'bus', type: 'select', label: 'Bus', options: BUSES, value: 'u115200' },
        { id: 'msg', type: 'select', label: 'Data sent', options: MSGS, value: 0 },
        { id: 'fs', label: 'Sample rate', min: 10, max: 20000, step: 10, value: 500, unit: 'kS/s', log: true },
        { id: 'jit', label: 'Busy processor (delay per sample, up to)', min: 0, max: 50, step: 1, value: 0, unit: 'µs' },
        { type: 'buttons', items: [{ id: 'again', label: 'New delays' }] }
      ], id => { if (id === 'again') seed++; loop.once(); });
      const ro = kit.readout(box.side, [['spb', 'Samples per bit'], ['sent', 'Sent'], ['got', 'Decoded'], ['verdict', 'The decoder']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, bytes = MSG_BYTES[v.msg] || MSG_BYTES[0];
        const uart = v.bus[0] === 'u', rate = +v.bus.slice(1);
        let lines, t1, tb, trueBytes;
        if (uart) {
          const u = E.proto.uartBytes(bytes, { baud: rate, gap: 1 });
          lines = [{ label: 'TX', edges: u.edges }]; t1 = u.t1; tb = 1 / rate; trueBytes = bytes;
        } else {
          const i = E.proto.i2c({ addr: 0x48, read: false, data: bytes, hz: rate });
          lines = [{ label: 'SCL', edges: i.scl }, { label: 'SDA', edges: i.sda }]; t1 = i.t1; tb = i.tBit || 1 / rate; trueBytes = [0x90].concat(bytes);
        }
        const t0 = Math.min(...lines.map(l => l.edges[0][0])) - tb * 0.5, tEnd = t1 + 2 * tb;
        // the polling loop's samples
        const fs = v.fs * 1e3, r = rng(seed * 991 + 3), J = v.jit * 1e-6, T = [];
        let tk = t0;
        for (let k = 0; k < 400000; k++) {
          tk = Math.max(k === 0 ? t0 : T[k - 1] + 1e-9, t0 + k / fs + J * r());
          if (tk > tEnd) break;
          T.push(tk);
        }
        const Ls = lines.map(l => levelsAt(l.edges, T));
        const dec = uart ? decodeUart(T, Ls[0], rate) : decodeI2c(T, Ls[0], Ls[1], tb);
        const got = dec.map(d => d.byte), ok = got.length === trueBytes.length && got.every((b, i) => b === trueBytes[i]) && !dec.some(d => d.bad);
        const bad = 'rgba(229,72,77,.38)';
        const traces = [];
        lines.forEach((l, i) => traces.push({ label: l.label, edges: l.edges, color: kit.hue(212, 1) }));
        lines.forEach((l, i) => {
          const isData = uart || i === 1;
          traces.push({ label: l.label + ' seen', edges: edgesOfSamples(T, Ls[i]), color: kit.hue(28, 1), marks: isData ? dec.map(d => ({ t0: d.t0, t1: d.t1, text: d.text, color: d.bad ? bad : undefined })) : [] });
        });
        const lg = S.logic(c, 8, 12, st.W - 16, st.H - 130, traces, { t0, t1: tEnd, labelW: 64 });
        const px = lg.plot.x, pw = lg.plot.w, spacing = pw / Math.max(1, T.length);
        if (spacing >= 3) { c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); for (const t of T) { const x = px + pw * (t - t0) / (tEnd - t0); c.moveTo(x, lg.plot.y + lg.plot.h - 5); c.lineTo(x, lg.plot.y + lg.plot.h); } c.stroke(); }
        const by = st.H - 104;
        kit.label(c, 'true bytes', 8, by, { size: 11, color: C.muted });
        trueBytes.forEach((b, i) => S.box(c, 90 + i * 70, by - 12, 64, 24, { label: hex2(b), color: C.faint, size: 11.5 }));
        kit.label(c, 'decoded', 8, by + 36, { size: 11, color: C.muted });
        if (!got.length) kit.label(c, 'nothing decoded', 90, by + 36, { size: 11.5, color: C.bad });
        got.slice(0, 8).forEach((b, i) => S.box(c, 90 + i * 70, by + 24, 64, 24, { label: dec[i].text, color: dec[i].bad || b !== trueBytes[i] ? C.bad : C.ok, active: true, size: 11 }));
        kit.label(c, T.length + ' samples', st.W - 10, by + 36, { size: 10.5, color: C.muted, align: 'right' });
        ro.set('spb', num(fs * tb, 2));
        ro.set('sent', trueBytes.map(hex2).join(' ') + (uart ? '' : '  (address + data)'));
        ro.set('got', got.length ? dec.map(d => d.text).join(' ') : 'nothing');
        ro.set('verdict', ok ? 'correct' : got.length ? 'wrong or incomplete: clean-looking, not true' : 'lost the frame');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ in-counter */
  Hyper.sim('in-counter', {
    title: 'The input stage of a frequency counter',
    blurb: `A 1 kHz signal is fed to a counter pin whose threshold is 1.65 V. The upper graph is the **voltage at the pin** over 8 ms (eight cycles), with the threshold as a dashed line; the lower trace is the **digital signal the counter sees**. Every rising edge of it is counted, and a small triangle marks it. A perfect input stage counts exactly **8**.

**Noise** is random and fast; **interference** is a 7.3 kHz hum, slower than the glitch filter can remove. The three input stages are a bare pin (one threshold), a glitch filter (a change must last 30 µs to count) and a Schmitt trigger (the threshold becomes two levels, 1.35 V and 1.95 V).

**Try this**
- Choose the **slow triangle** with 120 mV of noise and a bare pin: each slow crossing chatters, and the count is far too high.
- Switch to the **glitch filter**: the short spikes vanish and 8 returns.
- Add 700 mV of **interference**: the filter no longer helps, because the bumps are longer than 30 µs. The **Schmitt trigger** still does, as long as the noise stays below its gap.
- Reduce the amplitude to 0.4 V on the Schmitt trigger: the signal never reaches the upper threshold and nothing is counted. Hysteresis needs a swing.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.72, maxH: 560 });
      let seed = 4;
      const ctl = kit.controls(box.side, [
        { id: 'shape', type: 'select', label: 'Signal', options: [['square, fast edges', 'sq'], ['sine', 'sin'], ['slow triangle', 'tri']], value: 'tri' },
        { id: 'amp', label: 'Amplitude (peak to peak)', min: 0.2, max: 3.3, step: 0.05, value: 2.4, unit: 'V' },
        { id: 'off', label: 'Centre level', min: 0.5, max: 2.8, step: 0.05, value: 1.65, unit: 'V' },
        { id: 'noise', label: 'Noise', min: 0, max: 400, step: 10, value: 120, unit: 'mV' },
        { id: 'hum', label: 'Interference at 7.3 kHz', min: 0, max: 800, step: 10, value: 0, unit: 'mV' },
        { id: 'mode', type: 'select', label: 'Input stage', options: [['bare pin, one threshold', 'bare'], ['glitch filter, 30 µs', 'glitch'], ['Schmitt trigger, ±0.3 V', 'schmitt']], value: 'bare' },
        { type: 'buttons', items: [{ id: 'again', label: 'New noise' }] }
      ], id => { if (id === 'again') seed++; loop.once(); });
      const ro = kit.readout(box.side, [['n', 'Edges counted'], ['true', 'Cycles in the window'], ['read', 'Frequency read'], ['err', 'Error']]);
      const F = 1000, WIN = 0.008, DT = 5e-6, VTH = 1.65, HY = 0.3, GL = 6;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, r = rng(seed * 313 + 11), N = Math.round(WIN / DT);
        const ph = r() * 6.28;
        const volts = new Array(N), raw = new Array(N);
        for (let k = 0; k < N; k++) {
          const t = k * DT, u = ((t * F) % 1 + 1) % 1;
          const base = v.shape === 'sq' ? (u < 0.5 ? 0.5 : -0.5) : v.shape === 'sin' ? 0.5 * Math.sin(2 * Math.PI * u) : (u < 0.25 ? 2 * u : u < 0.75 ? 1 - 2 * u : 2 * u - 2);
          volts[k] = clamp(v.off + v.amp * base + v.noise / 1000 * gauss(r) + v.hum / 1000 * Math.sin(2 * Math.PI * 7300 * t + ph), 0, 3.3);
          raw[k] = volts[k] > VTH ? 1 : 0;
        }
        let s = new Array(N).fill(0);
        if (v.mode === 'bare') s = raw.slice();
        else if (v.mode === 'schmitt') { let q = volts[0] > VTH ? 1 : 0; for (let k = 0; k < N; k++) { if (volts[k] > VTH + HY) q = 1; else if (volts[k] < VTH - HY) q = 0; s[k] = q; } }
        else { let q = raw[0], run = 0; for (let k = 0; k < N; k++) { if (raw[k] !== q) { run++; if (run >= GL) { q = raw[k]; run = 0; } } else run = 0; s[k] = q; } }
        const marks = []; let n = 0;
        for (let k = 1; k < N; k++) if (s[k] === 1 && s[k - 1] === 0) { n++; marks.push(k); }
        // the graphs
        const lx = 50, rx = 12, pw = st.W - lx - rx, y1 = 22, h1 = (st.H - 120) * 0.62, y2 = y1 + h1 + 44, h2 = 52, X = k => lx + pw * k / N, Y = V => y1 + h1 - h1 * V / 3.3;
        frame(c, lx, y1, pw, h1, C); grid(c, lx, y1, pw, h1, 8, 3, C);
        kit.label(c, 'voltage at the pin', lx, y1 - 10, { size: 10.5, color: C.muted });
        for (const V of [0, 1.65, 3.3]) kit.label(c, V + ' V', lx - 6, Y(V) + (V === 0 ? -4 : V === 3.3 ? 5 : 0), { size: 10, color: C.muted, align: 'right' });
        if (v.mode === 'schmitt') { dash(c, lx, Y(VTH + HY), lx + pw, Y(VTH + HY), C.warn, 1.3); dash(c, lx, Y(VTH - HY), lx + pw, Y(VTH - HY), C.warn, 1.3); }
        else dash(c, lx, Y(VTH), lx + pw, Y(VTH), C.warn, 1.3);
        c.strokeStyle = kit.hue(212, 1); c.lineWidth = 1.4; c.beginPath();
        for (let k = 0; k < N; k++) { if (k) c.lineTo(X(k), Y(volts[k])); else c.moveTo(X(k), Y(volts[k])); }
        c.stroke();
        for (const k of marks) { c.fillStyle = kit.hue(28, 1); c.beginPath(); c.moveTo(X(k), y1 + 2); c.lineTo(X(k) - 5, y1 - 7); c.lineTo(X(k) + 5, y1 - 7); c.closePath(); c.fill(); }
        const edges = [[0, s[0]]];
        for (let k = 1; k < N; k++) if (s[k] !== s[k - 1]) edges.push([k * DT, s[k]]);
        kit.label(c, 'what the counter sees', lx, y2 - 8, { size: 10.5, color: C.muted });
        S.wave(c, lx, y2, pw, h2, edges, { t0: 0, t1: WIN, color: kit.hue(28, 1), width: 1.6 });
        kit.label(c, '8 ms', lx + pw, y2 + h2 + 14, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, n + ' rising edges counted (a perfect input counts 8)', lx, y2 + h2 + 14, { size: 11, color: n === 8 ? C.ok : C.bad, weight: 600 });
        const read = n / WIN;
        ro.set('n', String(n));
        ro.set('true', '8');
        ro.set('read', fText(read));
        ro.set('err', (n >= 8 ? '+' : '') + num(100 * (n - 8) / 8, 0) + ' %');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ in-generator */
  Hyper.sim('in-generator', {
    title: 'The ESP as a signal generator',
    blurb: `Three ways to make a signal. **LEDC square wave**: the top graph is the duty resolution in bits against frequency (the timer counts an 80 MHz clock, so the finest duty step is one clock tick out of one period); the lower picture is three periods of the wave with the duty rounded to what the hardware can do. **DAC staircase sine** (original ESP32 and ESP32-S2 only): a table of points written one after another, with an optional RC filter that smooths the steps. **PWM + RC filter**: a fast square wave averaged by a low-pass filter, the way a chip without a DAC makes a slow analogue level.

**Try this**
- In LEDC mode choose the **ESP32-S3** and slide the frequency up from 1 kHz: the resolution falls from 14 bits (the timer's cap) to 1 bit at 40 MHz, where only 50 % is possible.
- Ask for a 10 % duty at 5 MHz: the hardware rounds it to the nearest of 16 steps.
- In DAC mode use 8 points a cycle: a coarse staircase; with 64 points and a filter corner near the signal frequency the sine is clean. The frequency is 1 / (points × time per point).
- In PWM + RC mode compare a corner of 300 Hz with one of 5 kHz at 20 kHz PWM: the ripple grows as the filter lets more through.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.78, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Generator', options: [['LEDC square wave', 'ledc'], ['DAC staircase sine', 'dac'], ['PWM with an RC filter', 'rc']], value: 'ledc' },
        { id: 'chip', type: 'select', label: 'Chip (timer width)', options: [['ESP32, 20 bits', 'esp32'], ['ESP32-C6, 20 bits', 'esp32-c6'], ['ESP32-S3, 14 bits', 'esp32-s3'], ['ESP32-C3, 14 bits', 'esp32-c3']], value: 'esp32-s3' },
        { id: 'f', label: 'Frequency', min: 10, max: 40e6, step: 1, value: 1000, unit: 'Hz', log: true },
        { id: 'duty', label: 'Duty wanted', min: 0, max: 100, step: 1, value: 25, unit: '%' },
        { id: 'pts', type: 'select', label: 'Points per cycle', options: [['8', 8], ['16', 16], ['32', 32], ['64', 64]], value: 16 },
        { id: 'stepus', label: 'Time per point', min: 10, max: 2000, step: 5, value: 100, unit: 'µs', log: true },
        { id: 'fc', label: 'RC filter corner', min: 5, max: 20000, step: 1, value: 300, unit: 'Hz', log: true }
      ], () => { vis(); loop.once(); });
      const vis = () => { const m = ctl.values.mode; ctl.show('chip', m === 'ledc'); ctl.show('f', m !== 'dac'); ctl.show('duty', m !== 'dac'); ctl.show('pts', m === 'dac'); ctl.show('stepus', m === 'dac'); ctl.show('fc', m !== 'ledc'); };
      const ro = kit.readout(box.side, [['a', 'Frequency'], ['b', 'Resolution'], ['c', 'Steps'], ['d', 'Actual duty / level'], ['e', 'Note']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, lx = 54, rx = 14, pw = st.W - lx - rx;
        if (v.mode === 'ledc') {
          const cap = E.ledcTimerBits(v.chip), bitsOf = f => E.ledcMaxBits(f, 80e6, cap), f = v.f;
          const gy = 28, gh = (st.H - 150) * 0.52, X = ff => lx + pw * Math.log(ff / 10) / Math.log(4e6), Y = b => gy + gh - gh * b / 20;
          frame(c, lx, gy, pw, gh, C); grid(c, lx, gy, pw, gh, 6, 4, C);
          kit.label(c, 'duty resolution in bits, against frequency', lx, gy - 10, { size: 10.5, color: C.muted });
          for (const b of [0, 5, 10, 15, 20]) kit.label(c, String(b), lx - 6, Y(b), { size: 10, color: C.muted, align: 'right' });
          [[10, '10 Hz'], [100, '100'], [1e3, '1 kHz'], [1e4, '10 kHz'], [1e5, '100 kHz'], [1e6, '1 MHz'], [1e7, '10 MHz']].forEach(([ff, t]) => kit.label(c, t, X(ff), gy + gh + 12, { size: 9.5, color: C.muted, align: 'center' }));
          c.strokeStyle = kit.hue(212, 1); c.lineWidth = 2; c.beginPath();
          for (let i = 0; i <= pw; i++) { const ff = 10 * Math.pow(4e6, i / pw), yy = Y(bitsOf(ff)); if (i) c.lineTo(lx + i, yy); else c.moveTo(lx, yy); }
          c.stroke();
          const bits = bitsOf(f), steps = Math.pow(2, bits), dq = Math.round(v.duty / 100 * steps) / steps;
          dash(c, X(f), gy, X(f), gy + gh, C.warn, 1.3); kit.dot(c, X(f), Y(bits), 4.5, C.warn, C.text);
          const wy = gy + gh + 44, wh = Math.max(40, st.H - wy - 44);
          kit.label(c, 'three periods, duty rounded to the hardware\'s steps', lx, wy - 10, { size: 10.5, color: C.muted });
          S.wave(c, lx, wy, pw, wh, S.pwmEdges(f, dq, 0, 3 / f), { t0: 0, t1: 3 / f, color: kit.hue(28, 1), fill: true, width: 2 });
          kit.label(c, tText(3 / f) + ' shown', lx + pw, wy + wh + 14, { size: 10.5, color: C.muted, align: 'right' });
          ro.set('a', fText(f)); ro.set('b', bits + ' bits' + (bits === cap ? ' (the timer\'s cap)' : '')); ro.set('c', fmt(steps, 5));
          ro.set('d', num(dq * 100, 2) + ' % (wanted ' + v.duty + ' %)'); ro.set('e', 'step of ' + num(100 / steps, steps > 1e4 ? 4 : 2) + ' %');
        } else if (v.mode === 'dac') {
          const N = v.pts, dtp = v.stepus * 1e-6, f = 1 / (N * dtp), tau = 1 / (2 * Math.PI * v.fc);
          const level = i => Math.round(128 + 127 * Math.sin(2 * Math.PI * i / N)), V = lv => lv / 255 * 3.3;
          // an RC filter driven by the staircase, run until it has settled; then two cycles are drawn
          const sub = 12, dts = dtp / sub, cycles = 6, tot = cycles * N * sub, pts = [];
          let y = V(level(0)), pmin = 9, pmax = -9;
          for (let k = 0; k < tot; k++) {
            const i = Math.floor(k / sub) % N, a = dts / (tau + dts);
            y += a * (V(level(i)) - y);
            if (k >= (cycles - 2) * N * sub) { pts.push(y); if (k >= (cycles - 1) * N * sub) { pmin = Math.min(pmin, y); pmax = Math.max(pmax, y); } }
          }
          const gy = 28, gh = st.H - gy - 60, X = tt => lx + pw * tt / (2 * N * dtp), Y = vv => gy + gh - gh * vv / 3.4;
          frame(c, lx, gy, pw, gh, C); grid(c, lx, gy, pw, gh, 8, 4, C);
          for (const b of [0, 1, 2, 3]) kit.label(c, b + ' V', lx - 6, Y(b), { size: 10, color: C.muted, align: 'right' });
          kit.label(c, 'two cycles: the staircase from the DAC, and the same through the RC filter', lx, gy - 10, { size: 10.5, color: C.muted });
          c.strokeStyle = kit.hue(212, 1); c.lineWidth = 2; c.beginPath();
          for (let i = 0; i < 2 * N; i++) { const x0 = X(i * dtp), x1 = X((i + 1) * dtp), yy = Y(V(level(i % N))); if (i) c.lineTo(x0, yy); else c.moveTo(x0, yy); c.lineTo(x1, yy); }
          c.stroke();
          c.strokeStyle = kit.hue(28, 1); c.lineWidth = 2.2; c.beginPath();
          pts.forEach((yy, k) => { const x = lx + pw * k / (pts.length - 1); if (k) c.lineTo(x, Y(yy)); else c.moveTo(x, Y(yy)); });
          c.stroke();
          kit.label(c, tText(2 / f) + ' shown', lx + pw, gy + gh + 14, { size: 10.5, color: C.muted, align: 'right' });
          ro.set('a', fText(f)); ro.set('b', '8 bits'); ro.set('c', N + ' points × 256 levels');
          ro.set('d', 'step ' + num(3300 / 256, 1) + ' mV; filtered swing ' + num(pmax - pmin, 2) + ' V');
          ro.set('e', 'filter corner ' + fText(v.fc) + (v.fc > f * 3 ? ': passes the steps' : v.fc < f / 3 ? ': also flattens the sine' : ': smooths the steps'));
        } else {
          const f = Math.min(v.f, 2e6), D = clamp(v.duty / 100, 0, 1), T = 1 / f, tau = 1 / (2 * Math.PI * v.fc);
          let v0 = D * 3.3, v1 = v0;
          if (D > 0 && D < 1) { const a = Math.exp(-D * T / tau), b = Math.exp(-(1 - D) * T / tau); v0 = 3.3 * (1 - a) * b / (1 - a * b); v1 = v0 / b; }
          const filt = tt => { const u = ((tt % T) + T) % T; return D <= 0 ? 0 : D >= 1 ? 3.3 : u < D * T ? 3.3 + (v0 - 3.3) * Math.exp(-u / tau) : v1 * Math.exp(-(u - D * T) / tau); };
          const span = 4 * T, y1 = 28, h1 = (st.H - 120) * 0.38, y2 = y1 + h1 + 44, h2 = st.H - y2 - 44;
          kit.label(c, 'the PWM output of the pin (four periods)', lx, y1 - 10, { size: 10.5, color: C.muted });
          S.wave(c, lx, y1, pw, h1, S.pwmEdges(f, D, 0, span), { t0: 0, t1: span, color: kit.hue(212, 1), fill: true, width: 2 });
          const Y = vv => y2 + h2 - h2 * vv / 3.4;
          frame(c, lx, y2, pw, h2, C); grid(c, lx, y2, pw, h2, 8, 4, C);
          kit.label(c, 'after the RC filter (settled)', lx, y2 - 10, { size: 10.5, color: C.muted });
          for (const b of [0, 1, 2, 3]) kit.label(c, b + ' V', lx - 6, Y(b), { size: 10, color: C.muted, align: 'right' });
          dash(c, lx, Y(D * 3.3), lx + pw, Y(D * 3.3), C.warn, 1.2);
          c.strokeStyle = kit.hue(28, 1); c.lineWidth = 2.2; c.beginPath();
          for (let i = 0; i <= pw; i++) { const yy = Y(filt(span * i / pw)); if (i) c.lineTo(lx + i, yy); else c.moveTo(lx, yy); }
          c.stroke();
          kit.label(c, tText(span) + ' shown · dashed: the average', lx + pw, y2 + h2 + 14, { size: 10.5, color: C.muted, align: 'right' });
          ro.set('a', fText(f) + (v.f > 2e6 ? ' (capped at 2 MHz here)' : '')); ro.set('b', E.ledcMaxBits(f, 80e6, 14) + ' bits of duty'); ro.set('c', fmt(Math.pow(2, E.ledcMaxBits(f, 80e6, 14)), 5));
          ro.set('d', 'average ' + num(D * 3.3, 2) + ' V, ripple ' + num((v1 - v0) * 1000, 1) + ' mV peak to peak');
          ro.set('e', 'settles in about ' + tText(5 * tau));
        }
      }, box.stage);
      vis();
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ in-wifiscan */
  const SCEN = [['a quiet street (5 networks)', 5], ['an apartment block (14 networks)', 14], ['an office floor (22 networks)', 22]];
  const NAMES = ['Cafe', 'Home', 'Flat', 'Office', 'Guest', 'Shop', 'Lab'];
  function makeNets(count, seed) {
    const r = rng(seed * 17 + 5), out = [];
    for (let i = 0; i < count; i++) {
      const u = r(), ch = u < 0.28 ? 1 : u < 0.58 ? 6 : u < 0.86 ? 11 : [2, 3, 4, 5, 7, 8, 9, 10, 12, 13][Math.floor(r() * 10)];
      out.push({ name: NAMES[i % NAMES.length] + '-' + (10 + (i * 37 + seed * 11) % 90), ch, rssi: -38 - 50 * Math.pow(r(), 0.8) });
    }
    return out;
  }
  Hyper.sim('in-wifiscan', {
    title: 'A Wi-Fi scan as a channel chart',
    blurb: `Every network the ESP hears is drawn as a **hump 20 MHz wide** (four channel numbers) centred on its channel, as tall as its signal. The bright hump is your own network. Underneath, the **load** on channels 1, 6 and 11 is the power of all the other networks that overlap them, added up: the quietest of the three is where your router belongs.

The networks are invented, in three typical places. **Extra walls** lowers every signal by the same number of decibels: networks that fall under -92 dBm are no longer heard, which is how a scan from a poor position misses networks that are really there. **Scan again** adds a few decibels of scatter to each reading, because RSSI never repeats exactly.

**Try this**
- Choose the apartment block: channels 1, 6 and 11 are crowded, and the odd networks on 3 or 9 straddle two of them.
- Move your own network to channel 3: it overlaps both channel 1 and channel 6, and the list shows what that does to the load.
- Add 20 dB of **extra walls**: half of the networks disappear, and the load on every channel falls. A survey made with the board in a drawer says very little.
- Press **Scan again** a few times: each strength moves by a few dB, and the strongest network is not always the same.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.66, maxH: 540 });
      let scan = 1;
      const ctl = kit.controls(box.side, [
        { id: 'scen', type: 'select', label: 'Place', options: SCEN.map((s, i) => [s[0], i]), value: 1 },
        { id: 'walls', label: 'Extra walls (all signals weaker by)', min: 0, max: 35, step: 1, value: 0, unit: 'dB' },
        { id: 'own', type: 'select', label: 'Channel of your own network', options: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(c => [String(c), c]), value: 6 },
        { type: 'buttons', items: [{ id: 'scan', label: 'Scan again', primary: true }] }
      ], id => { if (id === 'scan') scan++; loop.once(); });
      const ro = kit.readout(box.side, [['n', 'Networks heard'], ['top', 'Strongest'], ['load', 'Load on channel 1 · 6 · 11'], ['best', 'Quietest of the three']]);
      const FLOOR = -92;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const nets0 = makeNets(SCEN[v.scen][1], v.scen + 1), r = rng(scan * 733 + 1);
        const nets = nets0.map(n => ({ name: n.name, ch: n.ch, rssi: n.rssi - v.walls + 2.5 * gauss(r) })).map(n => Object.assign(n, { seen: n.rssi >= FLOOR }));
        const heard = nets.filter(n => n.seen).sort((a, b) => b.rssi - a.rssi);
        const wide = st.W >= 640, cw = wide ? st.W * 0.64 : st.W;
        const lx = 40, rx = 10, pw = cw - lx - rx, gy = 26, gh = (st.H - 190) * 1, gb = gy + gh;
        const X = ch => lx + pw * (ch + 1) / 16, Y = dbm => gb - gh * clamp((dbm + 95) / 65, 0, 1);
        frame(c, lx, gy, pw, gh, C);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
        for (const d of [-90, -70, -50]) { const yy = Math.round(Y(d)) + 0.5; c.moveTo(lx, yy); c.lineTo(lx + pw, yy); }
        c.stroke();
        for (const d of [-90, -70, -50, -30]) kit.label(c, String(d), lx - 6, Y(d), { size: 9.5, color: C.muted, align: 'right' });
        kit.label(c, 'signal in dBm; each hump is 20 MHz wide', lx, gy - 10, { size: 10.5, color: C.muted });
        for (let ch = 1; ch <= 13; ch++) kit.label(c, String(ch), X(ch), gb + 12, { size: 10, color: [1, 6, 11].includes(ch) ? C.text : C.muted, align: 'center', weight: [1, 6, 11].includes(ch) ? 700 : 500 });
        kit.label(c, 'channel', lx + pw, gb + 26, { size: 10, color: C.muted, align: 'right' });
        const hump = (n, color, w) => {
          const y = Y(n.rssi);
          c.beginPath(); c.moveTo(X(n.ch - 2), gb); c.lineTo(X(n.ch - 1.4), y); c.lineTo(X(n.ch + 1.4), y); c.lineTo(X(n.ch + 2), gb); c.closePath();
          c.fillStyle = color.replace('1)', '0.14)'); c.fill(); c.strokeStyle = color; c.lineWidth = w; c.stroke();
        };
        heard.forEach((n, i) => hump(n, 'hsl(' + ((i * 47 + 20) % 360) + ' 70% ' + (C.dark ? '66%' : '42%') + ' / 1)', 1.3));
        const own = { ch: v.own, rssi: -45 };
        c.beginPath(); c.moveTo(X(own.ch - 2), gb); c.lineTo(X(own.ch - 1.4), Y(own.rssi)); c.lineTo(X(own.ch + 1.4), Y(own.rssi)); c.lineTo(X(own.ch + 2), gb); c.closePath();
        c.fillStyle = C.dark ? 'rgba(123,140,255,.26)' : 'rgba(60,90,220,.18)'; c.fill(); c.strokeStyle = C.accent; c.lineWidth = 2.6; c.stroke();
        kit.label(c, 'yours', X(own.ch), Y(own.rssi) - 9, { size: 10.5, color: C.accent, align: 'center', weight: 650 });
        // the load on 1, 6 and 11
        const load = ch => { let sum = 0; for (const n of heard) { const w = Math.max(0, 1 - Math.abs(ch - n.ch) / 4); sum += w * E.dBmToMw(n.rssi); } return sum; };
        const loads = [1, 6, 11].map(ch => ({ ch, p: load(ch) }));
        const best = loads.reduce((a, b) => (b.p < a.p ? b : a));
        const by = gb + 40, bw = (cw - lx - rx - 16) / 3, bh = 34;
        loads.forEach((l, i) => {
          const x = lx + i * (bw + 8), dbm = l.p > 0 ? E.mwToDbm(l.p) : null;
          S_box(c, kit, x, by, bw, bh, 'channel ' + l.ch, dbm == null ? 'nothing heard' : fmt(dbm, 3) + ' dBm', l === best ? C.ok : C.faint, l === best);
        });
        kit.label(c, 'the load: power of the networks that overlap the channel, added up', lx, by + bh + 14, { size: 10.5, color: C.muted });
        if (wide) {
          const px = cw + 6, pw2 = st.W - px - 10;
          kit.label(c, 'heard, strongest first', px, gy - 10, { size: 10.5, color: C.muted });
          heard.slice(0, 11).forEach((n, i) => {
            const y = gy + 6 + i * 22;
            kit.label(c, n.name, px, y + 8, { size: 11, color: C.text });
            kit.label(c, 'ch ' + n.ch, px + pw2 * 0.55, y + 8, { size: 10.5, color: C.muted });
            kit.label(c, Math.round(n.rssi) + ' dBm', px + pw2, y + 8, { size: 10.5, color: C.text2, align: 'right' });
          });
          if (!heard.length) kit.label(c, 'nothing heard', px, gy + 14, { size: 11, color: C.bad });
        }
        ro.set('n', heard.length + ' of ' + nets.length);
        ro.set('top', heard.length ? Math.round(heard[0].rssi) + ' dBm (' + E.rssiQuality(heard[0].rssi) + ')' : 'nothing');
        ro.set('load', loads.map(l => (l.p > 0 ? Math.round(E.mwToDbm(l.p)) : '—')).join(' · ') + ' dBm');
        ro.set('best', 'channel ' + best.ch + (loads.every(l => l.p === 0) ? ' (all quiet)' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  function S_box(c, kit, x, y, w, h, label, sub, color, active) { kit.esym.box(c, x, y, w, h, { label, sub, color, active, size: 11.5 }); }

  /* ================================================================ in-logger */
  const dText = d => !Number.isFinite(d) ? 'never' : d < 1 ? fmt(d * 24, 3) + ' hours' : d < 365 ? fmt(d, 3) + ' days' : d < 36500 ? fmt(d / 365, 3) + ' years' : 'more than 100 years';
  Hyper.sim('in-logger', {
    title: 'A logger filling its storage',
    blurb: `The bar is the storage. Each reading appends a line of the chosen size; time runs fast (the chosen number of days each second). With **stop** the logger fills the storage and stops, keeping the oldest data. With **rotate** it writes log.csv and, when that is half the storage, moves it aside as log.old (deleting the older log.old) and starts afresh: the newest data is always kept, between one and two half-files of it. With **ring** the head wraps round and overwrites the oldest lines.

**Flush every N lines** sets how many readings wait in memory before they are written. On internal flash each flush is a write that wears the part: the read-out gives the life in years for 100 000 erase cycles per 4 kB sector spread evenly by wear levelling. It also shows how much a power cut would lose.

**Try this**
- At one 30-byte line a minute on the 1 MB flash the storage fills in about 24 days. Switch the policy to **ring**: it never fills, and always holds the last 24 days.
- Set the interval to 1 s with a flush every line: the flash life falls to a fraction of a year. Raise **flush every** to 32 and the life rises 32-fold, at the price of up to half a minute of lost data.
- Choose the **SD card**: the fill time becomes years, and the flash wear is not modelled (the card has its own).
- Watch the **rotate** policy: two bars, one filling and one holding the previous period.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.5, maxH: 420 });
      let days = 0;
      const ctl = kit.controls(box.side, [
        { id: 'int', label: 'One line every', min: 1, max: 3600, step: 1, value: 60, unit: 's', log: true },
        { id: 'bytes', label: 'Bytes per line', min: 10, max: 200, step: 1, value: 30, unit: 'bytes' },
        { id: 'store', type: 'select', label: 'Storage', options: [['LittleFS in flash, 1 MB', 1048576], ['LittleFS in flash, 1.5 MB', 1572864], ['SD card, 16 GB', 16e9]], value: 1048576 },
        { id: 'pol', type: 'select', label: 'When it is full', options: [['stop (keep the oldest)', 'stop'], ['rotate two files', 'rotate'], ['ring (overwrite the oldest)', 'ring']], value: 'stop' },
        { id: 'flush', label: 'Flush every', min: 1, max: 100, step: 1, value: 1, unit: 'lines', log: true },
        { id: 'speed', label: 'Time runs', min: 0.2, max: 60, step: 0.1, value: 4, unit: 'days per second', log: true },
        { type: 'buttons', items: [{ id: 'restart', label: 'Start again', primary: true }] }
      ], id => { if (id === 'restart') days = 0; loop.once(); });
      const ro = kit.readout(box.side, [['perday', 'Written per day'], ['full', 'Full after'], ['kept', 'History kept'], ['flush', 'Flushes per day'], ['life', 'Flash life'], ['lost', 'Lost in a power cut']]);
      const loop = kit.loop(dt => {
        days += dt * ctl.values.speed;
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const perDay = 86400 / v.int * v.bytes, cap = v.store, fullDays = cap / perDay, written = days * perDay;
        const M = 14, bw = st.W - 2 * M, bh = 30, N = 100;
        const cells = (y, filledFrac, label, headFrac, color) => {
          kit.label(c, label, M, y - 10, { size: 10.5, color: C.muted });
          const cw = bw / N;
          for (let i = 0; i < N; i++) { c.fillStyle = i / N < filledFrac ? color : shade(C); c.fillRect(M + i * cw + 0.5, y, Math.max(1, cw - 1), bh); }
          if (headFrac != null) { c.fillStyle = C.text; c.fillRect(M + bw * headFrac - 1, y - 5, 3, bh + 10); }
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(M + 0.5, y + 0.5, bw, bh);
        };
        const y0 = 40, col = kit.hue(150, 0.9);
        let kept;
        if (v.pol === 'stop') {
          const fr = Math.min(1, written / cap);
          cells(y0, fr, 'storage (' + (cap >= 1e9 ? '16 GB' : fmt(cap / 1048576, 3) + ' MB') + ')', null, written >= cap ? C.bad : col);
          if (written >= cap) kit.label(c, 'FULL: the logger has stopped', M + bw / 2, y0 + bh / 2, { size: 12.5, color: C.text, align: 'center', weight: 700 });
          kept = Math.min(days, fullDays);
        } else if (v.pol === 'rotate') {
          const half = cap / 2, cyc = written / half, idx = Math.floor(cyc), fr = cyc - idx;
          cells(y0, fr, 'log.csv (being written, half of the storage)', fr, col);
          cells(y0 + 70, idx >= 1 ? 1 : 0, idx >= 1 ? 'log.old (the previous period, kept)' : 'log.old (nothing yet)', null, kit.hue(212, 0.8));
          kept = days < fullDays / 2 ? days : fullDays / 2 + (days / (fullDays / 2) % 1) * fullDays / 2;
        } else {
          const lap = written / cap, fr = lap >= 1 ? 1 : lap, head = lap - Math.floor(lap);
          cells(y0, fr, 'storage as a ring: the line is the write head', lap >= 1 ? head : null, col);
          kept = Math.min(days, fullDays);
        }
        kit.label(c, 'day ' + fmt(days, 4), st.W - M, 14, { size: 12, color: C.text, align: 'right', weight: 650 });
        const flushPerDay = 86400 / v.int / v.flush, isFlash = cap < 1e9;
        const life = isFlash ? E.flashLife(flushPerDay, cap / 4096, 1e5) : NaN;
        kit.label(c, v.pol === 'rotate' ? 'the newest data is always kept, in two files' : v.pol === 'ring' ? 'always the latest ' + dText(fullDays) : 'the oldest ' + dText(fullDays) + ' are kept', M, st.H - 12, { size: 11, color: C.muted });
        ro.set('perday', fmt(perDay / 1000, 3) + ' kB');
        ro.set('full', v.pol === 'stop' ? dText(fullDays) : dText(fullDays) + ' (then ' + (v.pol === 'ring' ? 'overwrites' : 'rotates') + ')');
        ro.set('kept', dText(kept));
        ro.set('flush', fmt(flushPerDay, 4));
        ro.set('life', isFlash ? dText(life * 365) : 'the card has its own wear levelling');
        ro.set('lost', v.flush === 1 ? 'the line in progress' : 'up to ' + v.flush + ' lines (' + tText(v.flush * v.int) + ' of data)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ in-power */
  const PCHIPS = [['ESP32', 'esp32'], ['ESP32-S2', 'esp32-s2'], ['ESP32-S3', 'esp32-s3'], ['ESP32-C3', 'esp32-c3'], ['ESP32-C6', 'esp32-c6'], ['ESP32-H2 (BLE and 802.15.4)', 'esp32-h2']];
  Hyper.sim('in-power', {
    title: 'What a meter that samples makes of a sleep-and-wake current',
    blurb: `The shaded steps are the **true current** of a node that wakes, connects (receiving current), sends (transmit current) and sleeps, on a logarithmic scale because the sleep current is ten thousand times smaller than the radio's. The dots are what a meter that **reads every so often** reports. The dashed line is the true average of the cycle, the solid one the mean of all the meter's readings.

Currents come from the catalogue entry of the chip (deep sleep, receive and transmit at the chip, not the board). The connect phase lasts 1.2 s and the send 0.25 s in this model. The meter either reads the current at that instant, or the mean of the last 68 ms (the INA219 with 128 conversions averaged); and every reading is rounded to the smallest step of the chosen range.

**Try this**
- With the default settings the meter reads zero between wakes: on the ±40 mV range one step is 0.1 mA, and the sleep is 0.005 to 0.025 mA. The estimate of the average is dominated by luck.
- Read every 1 s with **averaging off**, and slide **Meter starts at** from 0 to 2 s: the estimate jumps, because the readings catch the wake or miss it.
- Turn averaging on and read every 0.07 s: the estimate is close to the true average, and the sleep still reads zero.
- Choose the 0.001 mA step (a profiler): now even the sleep is seen, and the estimate is good.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip (currents from the catalogue)', options: PCHIPS, value: 'esp32-c3' },
        { id: 'T', label: 'The node wakes every', min: 5, max: 600, step: 1, value: 60, unit: 's', log: true },
        { id: 'dt', label: 'The meter reads every', min: 0.05, max: 60, step: 0.05, value: 1, unit: 's', log: true },
        { id: 'phase', label: 'Meter starts at', min: 0, max: 60, step: 0.05, value: 0.5, unit: 's' },
        { id: 'avg', type: 'check', label: 'Meter averages over its last 68 ms', value: false },
        { id: 'step', type: 'select', label: 'Smallest step of the meter', options: [['0.1 mA (±40 mV, 0.1 Ω)', 0.1], ['0.8 mA (±320 mV, 0.1 Ω)', 0.8], ['0.001 mA (a profiler)', 0.001]], value: 0.1 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['true', 'True average'], ['meter', 'Mean of the meter\'s readings'], ['err', 'Error'], ['life', '2000 mAh battery, by the truth'], ['lifem', '… by the meter']]);
      const CONNECT = 1.2, SEND = 0.25, W68 = 0.068;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, ch = E.chip(v.chip) || {};
        const sleep = (ch.sleepUa != null ? ch.sleepUa : 10) / 1000, rx = ch.rxMa != null ? ch.rxMa : 90, tx = ch.txMa != null ? ch.txMa : 300, T = v.T;
        const phases = [{ mA: rx, s: CONNECT }, { mA: tx, s: SEND }, { mA: sleep, s: Math.max(0.01, T - CONNECT - SEND) }];
        const period = phases.reduce((a, p) => a + p.s, 0), Qc = phases.reduce((a, p) => a + p.s * p.mA, 0), truth = Qc / period;
        const cur = t => { const u = ((t % period) + period) % period; return u < CONNECT ? rx : u < CONNECT + SEND ? tx : sleep; };
        const charge = t => { const k = Math.floor(t / period), u = t - k * period; let q = k * Qc, left = u; for (const p of phases) { const d = Math.min(left, p.s); q += d * p.mA; left -= d; if (left <= 0) break; } return q; };
        const reading = t => { const raw = v.avg ? (charge(t) - charge(t - W68)) / W68 : cur(t); return Math.round(raw / v.step) * v.step; };
        // the mean of the meter's readings over many cycles
        const span = Math.min(20 * period, 20000), M = Math.min(200000, Math.max(1, Math.floor(span / v.dt)));
        let sum = 0;
        for (let k = 0; k < M; k++) sum += reading(v.phase + k * v.dt);
        const est = sum / M;
        // the picture: two cycles on a logarithmic axis
        const lx = 56, rx2 = 12, pw = st.W - lx - rx2, gy = 28, gh = st.H - gy - 46, win = 2 * period;
        const lo = 0.001, hi = 1000, X = t => lx + pw * t / win, Y = a => gy + gh - gh * Math.log(clamp(Math.max(a, lo), lo, hi) / lo) / Math.log(hi / lo);
        frame(c, lx, gy, pw, gh, C);
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath();
        for (let e = -3; e <= 3; e++) { const yy = Math.round(Y(Math.pow(10, e))) + 0.5; c.moveTo(lx, yy); c.lineTo(lx + pw, yy); }
        c.stroke();
        for (let e = -3; e <= 3; e++) kit.label(c, e < 0 ? Math.round(Math.pow(10, e + 3)) + ' µA' : Math.pow(10, e) + ' mA', lx - 6, Y(Math.pow(10, e)), { size: 9.5, color: C.muted, align: 'right' });
        kit.label(c, 'current, logarithmic · two cycles of ' + tText(period) + ' each', lx, gy - 10, { size: 10.5, color: C.muted });
        let t = 0;
        c.fillStyle = C.dark ? 'rgba(123,140,255,.40)' : 'rgba(60,90,220,.28)';
        for (let k = 0; k < 2; k++) for (const p of phases) { const x0 = X(t), x1 = X(t + p.s); c.fillRect(x0, Y(p.mA), Math.max(1.5, x1 - x0), gy + gh - Y(p.mA)); t += p.s; }
        dash(c, lx, Y(truth), lx + pw, Y(truth), C.warn, 1.6);
        line(c, lx, Y(est), lx + pw, Y(est), est > 0 ? C.ok : C.bad, 1.6);
        const count = Math.floor((win - v.phase) / v.dt) + 1;
        if (count > 0 && count <= pw / 3) {
          for (let k = 0; k < count; k++) { const tt = v.phase + k * v.dt, rd = reading(tt); kit.dot(c, X(tt), Y(rd), 3, rd > 0 ? kit.hue(28, 0.95) : C.bad, C.text); }
        } else kit.label(c, count > 0 ? 'too many readings to draw' : 'the meter starts after this window', lx + 8, gy + 14, { size: 10.5, color: C.muted });
        kit.label(c, 'dashed: true average · solid: mean of the readings · dots: readings (red: reads zero)', lx, gy + gh + 16, { size: 10.5, color: C.muted });
        const life = E.batteryLife(2000, truth, { selfDischarge: 0.02 }).days, lifeM = est > 0 ? E.batteryLife(2000, est, { selfDischarge: 0.02 }).days : NaN;
        ro.set('true', num(truth, truth < 0.1 ? 4 : 3) + ' mA');
        ro.set('meter', num(est, est < 0.1 ? 4 : 3) + ' mA');
        ro.set('err', est > 0 ? (est >= truth ? '+' : '') + num(100 * (est - truth) / truth, 0) + ' %' : 'reads nothing at all');
        ro.set('life', dText(life));
        ro.set('lifem', est > 0 ? dText(lifeM) : 'a battery that never runs out');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ in-present */
  Hyper.sim('in-present', {
    title: 'Live data: smoothing, refresh rate and the last digit',
    blurb: `A voltage near 1.65 V is sampled 50 times a second with noise. The graph shows the last 20 seconds: the **raw** readings (faint), the **smoothed** value (blue) and the **number on the display** (orange steps). The display below is what a reader sees: it is refreshed only at the chosen rate, and only when the smoothed value has moved by more than the **deadband**.

Press **Apply a step** to move the signal by 0.5 V and watch how long each setting takes to follow it. The read-outs give the time constant, the time to show 95 % of a step (three time constants), how much the smoothing cuts the noise, and how often the last digit of the display changes.

**Try this**
- Set the smoothing to 0 and the refresh to 25 per second: the digits are a blur, and the last digit changes many times a second.
- Raise the smoothing to 0.4 s and the refresh to 5 per second: the number is calm and follows a step in about a second.
- Set the **deadband** to 1 step: the last digit stops flickering, and the display lags by up to one step.
- Tick **sensor unplugged** with the dash switched off: the display shows 0.00 as if it were a measurement. Switch the dash on.`,
    mount(box, kit) {
      const G = kit.gfx;
      const st = kit.stage(box.stage, { aspect: 0.68, maxH: 540 });
      let level = 1.65, up = false, t = 0, accS = 0, accD = 0, smooth = 1.65, shown = 1.65;
      const H = 1000, raw = [], sm = [], sh = [], changes = [], r = rng(77);
      const ctl = kit.controls(box.side, [
        { id: 'tau', label: 'Smoothing time constant', min: 0, max: 3, step: 0.05, value: 0.4, unit: 's' },
        { id: 'rate', type: 'select', label: 'Display refresh', options: [['1 per second', 1], ['2 per second', 2], ['5 per second', 5], ['10 per second', 10], ['25 per second', 25]], value: 5 },
        { id: 'dead', label: 'Deadband', min: 0, max: 3, step: 0.25, value: 0.5, unit: 'steps' },
        { id: 'noise', label: 'Noise of the signal', min: 0, max: 150, step: 5, value: 40, unit: 'mV' },
        { id: 'unplug', type: 'check', label: 'Sensor unplugged', value: false },
        { id: 'dash', type: 'check', label: 'Show missing data as a dash', value: true },
        { type: 'buttons', items: [{ id: 'step', label: 'Apply a step of 0.5 V', primary: true }] }
      ], id => { if (id === 'step') up = !up; });
      const ro = kit.readout(box.side, [['tau', 'Time constant'], ['settle', 'Time to show 95 % of a step'], ['noise', 'Noise, raw → smoothed'], ['chg', 'Changes of the display per second']]);
      const sd = a => { if (a.length < 2) return 0; const m = a.reduce((x, y) => x + y, 0) / a.length; return Math.sqrt(a.reduce((x, y) => x + (y - m) * (y - m), 0) / (a.length - 1)); };
      const loop = kit.loop(dt => {
        const v = ctl.values;
        t += dt; accS += dt; accD += dt;
        level += ((1.65 + (up ? 0.5 : 0)) - level) * Math.min(1, dt / 0.02);
        while (accS >= 0.02) {
          accS -= 0.02;
          const x = v.unplug ? 0 : clamp(level + 0.03 * Math.sin(t * 0.7) + v.noise / 1000 * gauss(r), 0, 3.3);
          smooth += (v.tau < 0.001 ? 1 : 1 - Math.exp(-0.02 / v.tau)) * (x - smooth);
          raw.push(x); sm.push(smooth); sh.push(v.unplug && v.dash ? null : shown);
          if (raw.length > H) { raw.shift(); sm.shift(); sh.shift(); }
        }
        const period = 1 / v.rate;
        if (accD >= period) {
          accD = accD % period;
          const cand = Math.round(smooth * 100) / 100;
          if (cand !== shown && (v.dead <= 0 || Math.abs(smooth - shown) > v.dead * 0.01)) { shown = cand; changes.push(t); }
        }
        while (changes.length && changes[0] < t - 5) changes.shift();
        // draw
        const c = st.begin(), C = kit.colors(), lx = 46, rx = 12, pw = st.W - lx - rx, gy = 22, gh = (st.H - 130), n = raw.length;
        const Y = V => gy + gh - gh * clamp((V - 0.9) / 1.6, 0, 1), X = i => lx + pw * (1 - (n - 1 - i) / (H - 1));
        frame(c, lx, gy, pw, gh, C); grid(c, lx, gy, pw, gh, 10, 4, C);
        for (const V of [1, 1.5, 2, 2.5]) kit.label(c, V.toFixed(1) + ' V', lx - 6, Y(V), { size: 9.5, color: C.muted, align: 'right' });
        kit.label(c, 'the last 20 seconds · faint: raw · blue: smoothed · orange: the display', lx, gy - 10, { size: 10.5, color: C.muted });
        const path = (arr, color, w, stair) => { c.strokeStyle = color; c.lineWidth = w; c.beginPath(); let pen = false; for (let i = 0; i < arr.length; i++) { if (arr[i] == null) { pen = false; continue; } if (pen) c.lineTo(X(i), Y(arr[i])); else { c.moveTo(X(i), Y(arr[i])); pen = true; } } c.stroke(); };
        path(raw, C.dark ? 'rgba(255,255,255,.28)' : 'rgba(0,0,0,.25)', 1, false);
        path(sm, C.accent, 2, false);
        path(sh, kit.hue(28, 1), 2.4, true);
        // the display
        const dy = gy + gh + 22, hgt = 56, miss = v.unplug && v.dash;
        c.fillStyle = '#14161c'; c.fillRect(lx, dy - 8, 250, hgt + 16);
        G.drawSeg7(c, miss ? '----' : G.seg7Number(shown, 4, 2), lx + 14, dy, hgt, { color: miss ? '#ffb020' : '#ff3b30' });
        kit.label(c, 'V', lx + 226, dy + hgt - 6, { size: 14, color: '#ff3b30', align: 'center', weight: 700 });
        kit.label(c, 'refresh ' + v.rate + ' a second · deadband ' + fmt(v.dead, 2) + ' step' + (v.dead === 1 ? '' : 's'), lx + 266, dy + 14, { size: 11, color: C.muted });
        kit.label(c, 'one step is 0.01 V', lx + 266, dy + 32, { size: 11, color: C.muted });
        const tail = k => raw.slice(-100).map((_, i, a) => (k === 'raw' ? raw : sm)[raw.length - a.length + i]);
        ro.set('tau', v.tau < 0.001 ? 'none' : fmt(v.tau, 3) + ' s');
        ro.set('settle', v.tau < 0.001 ? 'at once' : tText(3 * v.tau));
        ro.set('noise', num(sd(tail('raw')) * 1000, 1) + ' → ' + num(sd(tail('sm')) * 1000, 1) + ' mV');
        ro.set('chg', num(changes.length / 5, 1));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ in-calibrate */
  Hyper.sim('in-calibrate', {
    title: 'A calibration line, its residuals and the uncertainty that is left',
    blurb: `The ESP's converter in this model reads **1.018 × the voltage + 8 mV**, plus a gentle bow (the non-linearity) and the noise you choose. You compare it with a multimeter at the chosen number of points and fit a straight line by least squares. The upper graph is *reading against reference*: orange dots are the calibration points, the dotted line is a perfect converter and the blue line is the fit.

The lower graph is the **error** over the whole range: grey is the error before calibration, green the error after correcting with the fit, the green dots are the corrected errors at the calibration points (the residuals), and the pale band is the **expanded uncertainty** that remains, built from the reference, the noise, the rounding of one count and the residuals. It does not shrink to zero, and it is not made of the bow alone.

**Try this**
- With two points the line fits them exactly, and the residuals are zero, so they say nothing. Add points: a bow in the middle shows up as residuals of alternating sign.
- Set the non-linearity to 2 %: the straight line cannot follow, the worst error after calibration grows, and the verdict says the residuals show a curve.
- Raise the **reference uncertainty** to 2 %: the band widens, though the fit looks the same. A calibration cannot be better than its reference.
- Raise the noise: the points scatter and the fitted line wobbles; more points tame it. Take new data to see it move.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.86, maxH: 640 });
      let seed = 2;
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Calibration points', min: 2, max: 8, step: 1, value: 5 },
        { id: 'nl', label: 'Non-linearity (bow at mid-range)', min: 0, max: 3, step: 0.1, value: 0.6, unit: '%' },
        { id: 'noise', label: 'Noise of each averaged point', min: 0, max: 10, step: 0.25, value: 2, unit: 'mV' },
        { id: 'ref', label: 'Reference uncertainty (limit)', min: 0, max: 2, step: 0.05, value: 0.5, unit: '% of reading' },
        { id: 'k', type: 'select', label: 'Coverage factor k', options: [['1 (about 68 %)', 1], ['2 (about 95 %)', 2], ['3 (about 99.7 %)', 3]], value: 2 },
        { type: 'buttons', items: [{ id: 'new', label: 'Take new data', primary: true }] }
      ], id => { if (id === 'new') seed++; loop.once(); });
      const ro = kit.readout(box.side, [['gain', 'Fitted gain'], ['off', 'Fitted offset'], ['rms', 'Residual rms'], ['before', 'Worst error before'], ['after', 'Worst error after'], ['U', 'Expanded uncertainty'], ['words', 'In words']]);
      const HI = 2400, G0 = 1.018, O0 = 8;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, n = Math.round(v.n), r = rng(seed * 4099 + 5);
        const bow = x => v.nl / 100 * HI * 4 * (x / HI) * (1 - x / HI), model = x => G0 * x + O0 + bow(x);
        const xs = [], ys = [];
        for (let i = 0; i < n; i++) { const x = 200 + 2100 * i / Math.max(1, n - 1); xs.push(x); ys.push(model(x) + v.noise * gauss(r)); }
        const mx = xs.reduce((a, b) => a + b, 0) / n, my = ys.reduce((a, b) => a + b, 0) / n;
        let sxx = 0, sxy = 0;
        for (let i = 0; i < n; i++) { sxx += (xs[i] - mx) * (xs[i] - mx); sxy += (xs[i] - mx) * (ys[i] - my); }
        const g = sxy / sxx, o = my - g * mx;
        const res = ys.map((y, i) => y - (g * xs[i] + o)), rms = n > 2 ? Math.sqrt(res.reduce((a, b) => a + b * b, 0) / (n - 2)) : 0;
        const before = x => model(x) - x, after = x => (model(x) - o) / g - x;
        let wb = 0, wa = 0;
        for (let i = 0; i <= 100; i++) { const x = 200 + 2100 * i / 100; wb = Math.max(wb, Math.abs(before(x))); wa = Math.max(wa, Math.abs(after(x))); }
        const ur = v.ref / 100 * 1250 / Math.sqrt(3), un = v.noise, uq = 0.8 / Math.sqrt(12), U = v.k * Math.sqrt(ur * ur + un * un + uq * uq + rms * rms);
        const lx = 56, rx = 14, pw = st.W - lx - rx, g1y = 22, g1h = (st.H - 110) * 0.46, g2y = g1y + g1h + 42, g2h = st.H - g2y - 34;
        const X = x => lx + pw * x / 2500, Y1 = y => g1y + g1h - g1h * clamp(y / 2600, 0, 1);
        frame(c, lx, g1y, pw, g1h, C); grid(c, lx, g1y, pw, g1h, 5, 4, C);
        kit.label(c, 'reading of the ESP against the reference (mV)', lx, g1y - 10, { size: 10.5, color: C.muted });
        dash(c, X(0), Y1(0), X(2500), Y1(2500), C.muted, 1.2);
        line(c, X(0), Y1(o), X(2500), Y1(g * 2500 + o), C.accent, 2.2);
        for (let i = 0; i < n; i++) kit.dot(c, X(xs[i]), Y1(ys[i]), 4.2, kit.hue(28, 1), C.text);
        for (const V of [0, 1000, 2000]) kit.label(c, String(V), X(V), g1y + g1h + 12, { size: 10, color: C.muted, align: 'center' });
        const top = niceTop(Math.max(wb, U * 1.3, 4)), Y2 = e => g2y + g2h / 2 - (g2h / 2) * clamp(e / top, -1, 1);
        frame(c, lx, g2y, pw, g2h, C); grid(c, lx, g2y, pw, g2h, 5, 4, C);
        kit.label(c, 'error over the range (mV): grey before, green after, band: the uncertainty', lx, g2y - 10, { size: 10.5, color: C.muted });
        c.fillStyle = C.dark ? 'rgba(34,179,122,.20)' : 'rgba(34,179,122,.16)'; c.fillRect(lx, Y2(U), pw, Math.max(1, Y2(-U) - Y2(U)));
        line(c, lx, Y2(0), lx + pw, Y2(0), C.axis, 1.2);
        const curve = (fn, color) => { c.strokeStyle = color; c.lineWidth = 2; c.beginPath(); for (let i = 0; i <= 100; i++) { const x = 200 + 2100 * i / 100, yy = Y2(fn(x)); if (i) c.lineTo(X(x), yy); else c.moveTo(X(x), yy); } c.stroke(); };
        curve(before, C.muted); curve(after, kit.hue(150, 1));
        for (let i = 0; i < n; i++) kit.dot(c, X(xs[i]), Y2(res[i]), 3.6, kit.hue(150, 1), C.text);
        kit.label(c, '+' + fmt(top, 2), lx - 6, g2y + 6, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, '−' + fmt(top, 2), lx - 6, g2y + g2h - 6, { size: 10, color: C.muted, align: 'right' });
        for (const V of [0, 1000, 2000]) kit.label(c, String(V), X(V), g2y + g2h + 12, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'reference (mV)', lx + pw, g2y + g2h + 28, { size: 10.5, color: C.muted, align: 'right' });
        ro.set('gain', num(g, 4));
        ro.set('off', num(o, 2) + ' mV');
        ro.set('rms', n > 2 ? num(rms, 2) + ' mV' : '0 (two points always fit)');
        ro.set('before', num(wb, 1) + ' mV');
        ro.set('after', num(wa, 1) + ' mV');
        ro.set('U', '± ' + num(U, 1) + ' mV (k = ' + v.k + ')');
        ro.set('words', n <= 2 ? 'a line through two points cannot be tested' : rms <= 1.5 * Math.max(v.noise, 0.5) + 0.5 ? 'residuals are scatter: a line is a fair model' : 'residuals show a curve: use a table');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
