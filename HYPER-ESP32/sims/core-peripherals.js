/* HYPER-ESP32 · sims/core-peripherals.js
 *
 * Simulations of the topic "The core peripherals":
 *   cr-pwm        PWM: frequency, resolution and duty, with the average voltage and the brightness of an LED
 *   cr-adc        the ADC as a staircase: attenuation ranges, bits, the dead zones of the original ESP32, averaging
 *   cr-interrupt  an interrupt cutting into the main loop, a flag picked up later; polling for comparison
 *   cr-timer      a hardware timer alarm at an exact period beside a delay() loop that drifts
 *   cr-rmt        the RMT playing a WS2812 pixel or an infrared (NEC) frame, and what the tick does to the timing
 *   cr-pcnt       the pulse counter following a quadrature encoder, with and without contact bounce
 *   cr-watchdog   a watchdog fed and starved, and the mistake of feeding it from a timer
 *   cr-touch      a touch pin as a finger approaches, against a threshold (the ESP32 falls, the S3 rises)
 *   cr-dac        the DAC as a staircase sine, with an RC filter
 *   cr-mcpwm      a complementary PWM pair with dead time, and the shoot-through it prevents
 *
 * Numbers come from kit.esp (PWM limits, ADC ranges and curve, signal edges); everything is drawn in theme colours;
 * static pictures redraw on demand (loop.once), a running loop only where something moves by itself.
 */
(function () {
  'use strict';
  const clamp = (v, a, b) => v < a ? a : v > b ? b : v;
  const fmt = (v, s) => Hyper.util.fmt(v, s);
  const tText = s => { const a = Math.abs(s); return a >= 1 ? fmt(s, 3) + ' s' : a >= 1e-3 ? fmt(s * 1e3, 3) + ' ms' : a >= 1e-6 ? fmt(s * 1e6, 3) + ' µs' : fmt(s * 1e9, 3) + ' ns'; };
  const fText = f => f >= 1e6 ? fmt(f / 1e6, 3) + ' MHz' : f >= 1e3 ? fmt(f / 1e3, 3) + ' kHz' : fmt(f, 3) + ' Hz';
  const shade = C => C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)';
  /* a seeded random generator, so a picture repeats until the reader asks for another */
  const rng = seed => { let s = (seed * 2654435761) >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };
  /* a dashed line */
  const dash = (c, x0, y0, x1, y1, color, w) => { c.save(); c.setLineDash([5, 4]); c.strokeStyle = color; c.lineWidth = w || 1.4; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke(); c.restore(); };
  /* intervals [[a, b], …] -> an edge list that starts low (overlaps are merged) */
  const edgesOf = ints => {
    const s = ints.filter(i => i[1] > i[0]).sort((p, q) => p[0] - q[0]), out = [[-1, 0]];
    let cur = null;
    for (const [a, b] of s) {
      if (cur && a <= cur[1]) cur[1] = Math.max(cur[1], b);
      else { if (cur) out.push([cur[0], 1], [cur[1], 0]); cur = [a, b]; }
    }
    if (cur) out.push([cur[0], 1], [cur[1], 0]);
    return out;
  };

  /* ================================================================ cr-pwm */
  Hyper.sim('cr-pwm', {
    title: 'PWM: frequency, resolution and duty',
    blurb: `The top trace is the pin over three periods. The ruler under it cuts one period into the steps of the duty counter, and the chart shows how many duty bits the LEDC clock leaves at each frequency.

**Try this**
- Set **8 bits** and raise the frequency from 5 kHz: the bits the clock allows fall by one for every doubling. Past the red line the driver cannot give the resolution you asked for and the setup would fail.
- Lower the resolution to 3 bits and look at how coarse the duty steps are.
- Set 25 % duty and compare **light made** with **as seen**: the LED makes a quarter of the light but looks far brighter than a quarter.
- Drop the frequency below 5 Hz and the LED really blinks; at 50 Hz it flickers; above a kilohertz it looks steady.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Frequency', min: 1, max: 200000, value: params && params.preset === 'motor' ? 20000 : 5000, unit: 'Hz', log: true, sig: 3 },
        { id: 'bits', label: 'Resolution wanted', min: 1, max: 16, step: 1, value: 8, unit: 'bits' },
        { id: 'duty', label: 'Duty cycle', min: 0, max: 100, step: 1, value: 25, unit: '%' },
        { id: 'clk', type: 'select', label: 'LEDC clock', options: [['80 MHz (APB)', 80e6], ['40 MHz (crystal)', 40e6]], value: 80e6 },
        { id: 'cap', type: 'select', label: 'Timer width', options: [['20 bits (ESP32, C5, C6, C61, H2, P4)', 20], ['14 bits (S2, S3, C3, C2)', 14]], value: 20 }
      ], () => update());
      const ro = kit.readout(box.side, [['period', 'Period'], ['on', 'Time high'], ['duty', 'Duty value'], ['avg', 'Average voltage'], ['bits', 'Bits allowed here'], ['look', 'The LED looks']]);
      const model = () => {
        const v = ctl.values, maxBits = Math.max(1, E.ledcMaxBits(v.f, v.clk, v.cap));
        const bits = Math.min(v.bits, maxBits), duty = E.ledcDuty(v.duty / 100, bits);
        return { v, maxBits, bits, refused: v.bits > maxBits, steps: Math.pow(2, bits), duty, p: E.pwm(v.f, bits, duty, 3.3) };
      };
      const draw = t => {
        const c = st.begin(), C = kit.colors(), m = model(), p = m.p, v = m.v;
        const W = st.W, Ht = st.H, lx = 58, w = Math.max(60, W - lx - 14), T3 = 3 * p.period;
        // the pin
        const wy = 30, wh = Math.round(Ht * 0.22);
        kit.label(c, 'The pin, three periods', lx, 12, { size: 11.5, color: C.text2, weight: 600 });
        kit.label(c, '3.3 V', lx - 8, wy + 2, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, '0 V', lx - 8, wy + wh - 2, { size: 10.5, color: C.muted, align: 'right' });
        const pe = S.pwmEdges(v.f, p.frac, 0, T3);
        S.wave(c, lx, wy, w, wh, pe, { t0: 0, t1: T3, fill: true, color: kit.hue(205), idle: E.proto.levelAt(pe, 0) });
        const ya = wy + wh - p.frac * wh;
        dash(c, lx, ya, lx + w, ya, C.warn, 1.5);
        kit.label(c, 'average ' + fmt(p.avg, 3) + ' V', lx + w, clamp(ya - 8, wy + 6, wy + wh - 6), { size: 10.5, color: C.warn, align: 'right', bg: C.bg2 });
        // one period as counter steps
        const ry = wy + wh + 26, rw = w / 3, rh = 14;
        kit.label(c, 'one period = ' + tText(p.period) + ', ' + m.steps + ' counter steps of ' + tText(p.stepTime), lx, ry - 10, { size: 10.5, color: C.muted });
        c.fillStyle = shade(C); c.fillRect(lx, ry, rw, rh);
        c.fillStyle = kit.hue(205, 0.55); c.fillRect(lx, ry, rw * p.frac, rh);
        if (m.steps <= 64) {
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath();
          for (let i = 1; i < m.steps; i++) { const x = Math.round(lx + rw * i / m.steps) + 0.5; c.moveTo(x, ry); c.lineTo(x, ry + rh); }
          c.stroke();
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(lx + 0.5, ry + 0.5, rw, rh);
        kit.label(c, m.duty + ' of ' + m.steps + ' steps high', lx + rw + 8, ry + rh / 2, { size: 11, color: C.text2 });
        // the lamp
        const yb = ry + rh + 24, blink = v.f < 6;
        const on = blink ? ((t * v.f) % 1 < p.frac ? 1 : 0) : null;
        const made = blink ? on : p.frac, seen = blink ? on : Math.pow(p.frac, 0.45);
        S.led(c, lx + 34, yb + 36, { color: 48, on: made, r: 15, label: 'light made' });
        S.led(c, lx + 124, yb + 36, { color: 48, on: seen, r: 15, label: 'as seen' });
        // the limit: bits against frequency
        const cx0 = lx + Math.round(w * 0.44), cw = Math.round(w * 0.56) - 4, cy0 = yb + 4, ch = Math.min(220, Ht - yb - 34);
        if (ch > 36 && cw > 60) {
          const X = f => cx0 + cw * clamp(Math.log10(f), 0, 6) / 6, Y = b => cy0 + ch - ch * clamp(b, 0, 20) / 20;
          c.save();
          c.beginPath(); c.moveTo(cx0, cy0 + ch);
          for (let i = 0; i <= cw; i += 2) { const f = Math.pow(10, 6 * i / cw); c.lineTo(cx0 + i, Y(Math.min(v.cap, E.ledcMaxBits(f, v.clk, v.cap)))); }
          c.lineTo(cx0 + cw, cy0 + ch); c.closePath();
          c.fillStyle = C.dark ? 'rgba(34,179,122,.18)' : 'rgba(34,179,122,.16)'; c.fill();
          c.strokeStyle = C.ok; c.lineWidth = 1.6; c.stroke();
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(cx0 + 0.5, cy0 + 0.5, cw, ch);
          c.restore();
          const px = X(v.f), py = Y(v.bits);
          kit.dot(c, px, py, 5, m.refused ? C.bad : C.accent, C.text);
          if (m.refused) kit.dot(c, px, Y(m.maxBits), 4, C.ok, C.text);
          kit.label(c, 'duty bits', cx0, cy0 - 7, { size: 10, color: C.muted });
          kit.label(c, '20', cx0 - 4, cy0 + 2, { size: 9.5, color: C.faint, align: 'right' });
          kit.label(c, '0', cx0 - 4, cy0 + ch, { size: 9.5, color: C.faint, align: 'right' });
          kit.label(c, '1 Hz', cx0, cy0 + ch + 10, { size: 9.5, color: C.faint });
          kit.label(c, '1 kHz', X(1000), cy0 + ch + 10, { size: 9.5, color: C.faint, align: 'center' });
          kit.label(c, '1 MHz', cx0 + cw, cy0 + ch + 10, { size: 9.5, color: C.faint, align: 'right' });
        }
        kit.label(c, m.refused ? 'ledcAttach would fail: only ' + m.maxBits + ' bits fit at ' + fText(v.f) + '. Shown with ' + m.bits + ' bits.' : 'the setup is possible: ' + m.bits + ' bits of at most ' + m.maxBits, lx, Ht - 8, { size: 11, color: m.refused ? C.bad : C.muted });
        ro.set('period', tText(p.period)); ro.set('on', tText(p.tOn)); ro.set('duty', m.duty + ' of ' + m.steps);
        ro.set('avg', fmt(p.avg, 3) + ' V'); ro.set('bits', m.maxBits + ' bits');
        ro.set('look', v.f < 6 ? 'blinking' : v.f < 100 ? 'flickering' : v.f < 1000 ? 'steady (flickers on a camera)' : 'steady');
      };
      const update = () => { if (ctl.values.f < 6) loop.start(); else { loop.stop(); loop.once(); } };
      const loop = kit.loop((dt, t) => draw(t), box.stage);
      st.onResize(() => loop.once());
      update();
    }
  });

  /* ================================================================ cr-adc */
  const ADC_SAT = { 0: 1.1, 2.5: 1.45, 6: 2.1, 11: 3.2 };       // where an original ESP32 reaches 4095: schematic
  Hyper.sim('cr-adc', {
    title: 'The ADC as a staircase',
    blurb: `The horizontal axis is the voltage on the pin, the vertical one the count the chip reports. The green band is the range Espressif recommends for the chosen attenuation; the red parts are outside it.

For the **original ESP32** the orange curve is a representative model of its uncalibrated converter: nothing below about 0.1 V, and a bend near the top. It is schematic: every real chip differs a little, which is why the factory calibration exists. The dotted line is the ideal converter that calibration restores.

**Try this**
- Choose the ESP32 and 11 dB, and slide the voltage down below 0.1 V: the count sticks at 0, a dead zone.
- Switch to 0 dB: the same 12 bits now cover a much smaller voltage range, so one count is finer, but the pin saturates at about 1 V.
- Lower the bits to 5 and the staircase appears; raise the noise, then raise the readings averaged and watch the error bar shrink with the square root of the number.
- Click on the graph to move the input.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.7, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: [['ESP32', 'esp32'], ['ESP32-S2', 'esp32-s2'], ['ESP32-S3', 'esp32-s3'], ['ESP32-C3', 'esp32-c3'], ['ESP32-C6', 'esp32-c6']], value: 'esp32' },
        { id: 'db', type: 'select', label: 'Attenuation', options: [['0 dB', 0], ['2.5 dB', 2.5], ['6 dB', 6], ['11 dB', 11]], value: 11 },
        { id: 'vin', label: 'Input voltage', min: 0, max: 3.3, step: 0.01, value: 1.2, unit: 'V' },
        { id: 'bits', label: 'Resolution', min: 4, max: 12, step: 1, value: 12, unit: 'bits' },
        { id: 'noise', label: 'Noise of one reading', min: 0, max: 20, step: 1, value: 6, unit: 'counts' },
        { id: 'avg', label: 'Readings averaged', min: 1, max: 64, step: 1, value: 1 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['count', 'Count'], ['mv', 'Millivolts (calibrated)'], ['lsb', 'One count'], ['win', 'Recommended range'], ['noise', 'Noise left'], ['state', 'The input is']]);
      let geo = null;
      const win = () => { const v = ctl.values, r = E.ADC_RANGE[v.chip][v.db]; return { lo: r[0], hi: r[1] }; };
      const vsat = () => { const v = ctl.values; return v.chip === 'esp32' ? ADC_SAT[v.db] : win().hi; };
      // the count the chip reports for a voltage (before noise), on the scale of the chosen bits
      const reading = (V, uncal) => {
        const v = ctl.values, top = Math.pow(2, v.bits) - 1, sat = vsat();
        if (v.chip === 'esp32' && uncal) return Math.round(E.adcEsp32Raw(V * 3.2 / sat) / 4095 * top);
        return Math.round(clamp(V / sat, 0, 1) * top);
      };
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, w = win(), top = Math.pow(2, v.bits) - 1, sat = vsat();
        const lx = 56, rx = 16, ty = 22, by = st.H - 40, pw = st.W - lx - rx, ph = by - ty;
        const X = V => lx + pw * V / 3.3, Y = n => by - ph * n / top;
        geo = { lx, pw, X };
        // recommended window
        c.fillStyle = C.dark ? 'rgba(229,72,77,.14)' : 'rgba(229,72,77,.10)'; c.fillRect(lx, ty, pw, ph);
        c.fillStyle = C.dark ? 'rgba(34,179,122,.20)' : 'rgba(34,179,122,.16)'; c.fillRect(X(w.lo), ty, X(w.hi) - X(w.lo), ph);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(lx + 0.5, ty + 0.5, pw, ph);
        // grid and labels
        for (let V = 0; V <= 3.3001; V += 0.5) { const x = Math.round(X(V)) + 0.5; c.strokeStyle = C.grid; c.beginPath(); c.moveTo(x, ty); c.lineTo(x, by); c.stroke(); kit.label(c, fmt(V, 2) + ' V', x, by + 12, { size: 10, color: C.muted, align: 'center' }); }
        kit.label(c, 'count (' + v.bits + ' bits)', lx - 8, ty - 8, { size: 10.5, color: C.muted, align: 'left' });
        kit.label(c, String(top), lx - 6, ty + 2, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, '0', lx - 6, by, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, 'input voltage on the pin', lx + pw / 2, by + 28, { size: 11, color: C.text2, align: 'center' });
        // the ideal line
        c.save(); c.setLineDash([2, 4]); c.strokeStyle = C.muted; c.lineWidth = 1.6; c.beginPath(); c.moveTo(X(0), Y(0)); c.lineTo(X(Math.min(3.3, sat)), Y(top * Math.min(1, 3.3 / sat))); c.stroke(); c.restore();
        // what the chip reports
        const curve = uncal => {
          c.beginPath();
          for (let i = 0; i <= pw; i++) { const V = 3.3 * i / pw, n = reading(V, uncal); if (i) c.lineTo(lx + i, Y(n)); else c.moveTo(lx + i, Y(n)); }
          c.stroke();
        };
        c.lineWidth = 2.2;
        c.strokeStyle = v.chip === 'esp32' ? kit.hue(30) : C.accent;
        curve(true);
        // the input
        const n = reading(v.vin, true), sigma = E.oversample(v.noise, v.avg), x = X(v.vin);
        dash(c, x, by, x, Y(n), C.warn, 1.5); dash(c, lx, Y(n), x, Y(n), C.warn, 1.5);
        const eb = ph * sigma / top;
        c.strokeStyle = C.warn; c.lineWidth = 2.4; c.beginPath(); c.moveTo(x, Y(n) - eb); c.lineTo(x, Y(n) + eb); c.stroke();
        kit.dot(c, x, Y(n), 5, C.warn, C.text);
        kit.label(c, 'count ' + n, x + 8, Y(n) - 10, { size: 11, color: C.warn, bg: C.bg2 });
        const key = v.chip === 'esp32' ? ['orange: the uncalibrated ESP32 (schematic)', 'dotted: an ideal converter'] : ['blue: what the converter reports', 'dotted: the same, ideal'];
        kit.label(c, key[0], lx + 8, ty + 14, { size: 10.5, color: v.chip === 'esp32' ? kit.hue(30) : C.accent });
        kit.label(c, key[1], lx + 8, ty + 28, { size: 10.5, color: C.muted });
        kit.label(c, 'green: recommended range', lx + pw - 8, by - 28, { size: 10.5, color: C.ok, align: 'right' });
        kit.label(c, 'red: outside it', lx + pw - 8, by - 14, { size: 10.5, color: C.bad, align: 'right' });
        // numbers
        const mv = clamp(v.vin, w.lo, w.hi) * 1000;
        ro.set('count', n + ' of ' + top);
        ro.set('mv', fmt(mv, 4) + ' mV' + (v.vin < w.lo || v.vin > w.hi ? ' (clipped to the range)' : ''));
        ro.set('lsb', fmt(sat / Math.pow(2, v.bits) * 1000, 3) + ' mV');
        ro.set('win', fmt(w.lo, 3) + ' to ' + fmt(w.hi, 3) + ' V');
        ro.set('noise', fmt(sigma, 2) + ' counts = ' + fmt(sigma * sat / top * 1000, 2) + ' mV');
        ro.set('state', v.vin < w.lo ? (v.chip === 'esp32' ? 'in the dead zone: reads about 0' : 'below the range') : v.vin > w.hi ? 'above the range: bends or saturates' : 'inside the range');
      };
      const loop = kit.loop(draw, box.stage);
      kit.click(st, p => { if (geo && p.x >= geo.lx && p.x <= geo.lx + geo.pw) ctl.set('vin', Math.round(clamp((p.x - geo.lx) / geo.pw * 3.3, 0, 3.3) * 100) / 100, true); }, p => !!geo && p.x >= geo.lx && p.x <= geo.lx + geo.pw);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cr-interrupt */
  Hyper.sim('cr-interrupt', {
    title: 'An interrupt cutting into the loop',
    blurb: `One press of a button, drawn over 250 ms. The **handler** runs at every edge of the pin, even inside a long pass of the loop (amber). It counts an edge as a press only if the pin is low and nothing has happened on the pin for the **quiet time**; every edge, counted or not, restarts that quiet time. A counted press sets the **flag** (red), and the loop picks the flag up only when a pass ends. In *polling* mode there is no handler: the loop merely looks at the pin at the end of each pass.

The handler is drawn wider than it really is: 20 µs would be a hairline.

**Try this**
- With 50 ms of work in the loop, switch between the two methods and shorten the press to 20 ms: polling misses it, the interrupt does not.
- Set bounce to 8 ms and the quiet time to 0: the handler counts several presses for one, some of them from the bounce on *release*. Raise the quiet time to 30 ms to ignore all of it.
- Make the loop short (1 ms) in polling mode with bounce on: now even polling sees the bounce.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, maxH: 480 });
      let seed = 3;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Method', options: [['Interrupt: the handler sets a flag', 'isr'], ['Polling: the loop looks at the pin', 'poll']], value: 'isr' },
        { id: 'press', label: 'Press length', min: 5, max: 200, step: 5, value: 80, unit: 'ms' },
        { id: 'bounce', label: 'Contact bounce', min: 0, max: 15, step: 1, value: 4, unit: 'ms' },
        { id: 'dead', label: 'Quiet time needed before a press', min: 0, max: 60, step: 1, value: 30, unit: 'ms' },
        { id: 'work', label: 'One pass of the loop takes', min: 1, max: 120, step: 1, value: 50, unit: 'ms' },
        { id: 'isr', label: 'Handler runs for', min: 1, max: 300, step: 1, value: 20, unit: 'µs', log: true, sig: 2 },
        { type: 'buttons', items: [{ id: 'again', label: 'Different bounce' }] }
      ], id => { if (id === 'again') seed++; loop.once(); });
      const ro = kit.readout(box.side, [['edges', 'Edges at the pin'], ['acc', 'Counted as presses'], ['seen', 'The loop reacts after'], ['verdict', 'Result']]);
      const TMAX = 0.25;
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, isr = v.mode === 'isr';
        const tDown = 0.04, tUp = tDown + v.press / 1000, P = v.work / 1000;
        const edges = E.proto.bounce([[tDown, tUp]], { bounceMs: v.bounce, seed });
        const all = [], falls = [];
        for (let i = 1; i < edges.length; i++) if (edges[i][1] !== edges[i - 1][1]) { all.push([edges[i][0], edges[i][1]]); if (edges[i][1] === 0) falls.push(edges[i][0]); }
        const lx = 92, rx = 14, pw = st.W - lx - rx, X = t => lx + pw * clamp(t / TMAX, 0, 1);
        // the handler runs at every edge (a CHANGE interrupt); a press is the first falling edge after a quiet time
        const acc = [], runs = []; let last = null;
        if (isr) for (const [te, lvl] of all) { const ok = lvl === 0 && (last == null || te - last >= v.dead / 1000); runs.push([te, ok]); if (ok) acc.push(te); last = te; }
        const checks = []; for (let k = 1; k * P <= TMAX + P; k++) checks.push(k * P);
        const flagEdges = [[0, 0]]; let pick = null, pickups = 0;
        if (isr) {
          let i = 0;
          for (const ck of checks) {
            const first = acc.find(a => a <= ck && a > (checks[checks.indexOf(ck) - 1] || -1));
            if (first != null) { flagEdges.push([first, 1], [ck, 0]); pickups++; if (pick == null) pick = ck; }
            i++;
          }
        }
        // polling: samples at the end of each pass
        let seen = 0, firstSeen = null; let prev = 1;
        if (!isr) for (const ck of checks) { const lvl = E.proto.levelAt(edges, ck); if (prev === 1 && lvl === 0) { seen++; if (firstSeen == null) firstSeen = ck; } prev = lvl; }
        // rows
        const rows = ['button pin', 'handler', 'flag', 'loop()'], y0 = 30, rh = (st.H - y0 - 34) / 4;
        rows.forEach((r, i) => kit.label(c, r, lx - 10, y0 + rh * i + rh / 2, { size: 11.5, color: C.text2, align: 'right', weight: 600 }));
        for (let i = 0; i < 4; i++) { c.fillStyle = i % 2 ? 'rgba(0,0,0,0)' : shade(C); c.fillRect(lx, y0 + rh * i, pw, rh); }
        // time scale
        for (let ms = 0; ms <= 250; ms += 50) { const x = X(ms / 1000); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(Math.round(x) + 0.5, y0); c.lineTo(Math.round(x) + 0.5, y0 + rh * 4); c.stroke(); kit.label(c, ms + ' ms', x, y0 + rh * 4 + 12, { size: 10, color: C.muted, align: 'center' }); }
        // pin
        S.wave(c, lx, y0 + rh * 0.2, pw, rh * 0.6, edges, { t0: 0, t1: TMAX, color: kit.hue(205), idle: 1 });
        // loop passes
        const ly = y0 + rh * 3 + rh * 0.2, lh = rh * 0.6;
        let a = 0;
        for (const ck of checks.concat([TMAX + P])) {
          const x0 = X(a), x1 = X(Math.min(ck, TMAX));
          if (x1 > x0) { c.fillStyle = kit.hue(40, 0.55); c.fillRect(x0 + 0.5, ly, Math.max(0.5, x1 - x0 - 1), lh); }
          if (ck <= TMAX) { c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(ck), ly - 3); c.lineTo(X(ck), ly + lh + 3); c.stroke(); }
          a = ck;
        }
        kit.label(c, 'amber: work · black tick: the loop looks at the flag or the pin', lx, y0 + rh * 4 + 28, { size: 10, color: C.muted });
        if (isr) {
          // handler runs: red blocks (accepted) and grey (ignored), drawn across the loop row too
          for (const [te, ok] of runs.slice().sort((p, q) => p[1] - q[1])) {
            const x = X(te), wdt = Math.max(3, pw * (v.isr * 1e-6) / TMAX);
            c.fillStyle = ok ? C.bad : C.faint; c.fillRect(x, y0 + rh * 1 + rh * 0.2, wdt, rh * 0.6);
            if (ok) { c.fillStyle = C.bad; c.fillRect(x, ly - 2, wdt, lh + 4); }
          }
          S.wave(c, lx, y0 + rh * 2 + rh * 0.2, pw, rh * 0.6, flagEdges, { t0: 0, t1: TMAX, color: C.bad, fill: true });
          kit.label(c, 'red: counted as a press · grey: an edge ignored (a rising edge, or inside the quiet time)', lx, y0 + rh * 1 + 6, { size: 9.5, color: C.muted });
        } else {
          kit.label(c, 'no interrupt: nothing happens between the looks', lx + 6, y0 + rh * 1.5, { size: 10.5, color: C.faint });
          kit.label(c, 'no flag', lx + 6, y0 + rh * 2.5, { size: 10.5, color: C.faint });
        }
        const firstAcc = acc.length ? acc[0] : null;
        ro.set('edges', String(all.length) + '  (' + falls.length + ' falling)');
        ro.set('acc', isr ? acc.length + (acc.length > 1 ? '  (one press counted ' + acc.length + ' times)' : '') : 'no handler');
        const react = isr ? (pick != null && firstAcc != null ? pick - firstAcc : null) : (firstSeen != null ? firstSeen - tDown : null);
        ro.set('seen', react == null ? 'never' : tText(Math.max(0, react)));
        ro.set('verdict', isr ? (acc.length === 1 ? 'caught, counted once' : acc.length + ' presses counted for one') : (seen === 0 ? 'MISSED: the press fell between two looks' : seen === 1 ? 'caught, counted once' : seen + ' presses counted for one'));
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cr-timer */
  Hyper.sim('cr-timer', {
    title: 'A hardware timer against a delay loop',
    blurb: `Both rows aim for the same period. The **hardware timer** (top) raises its alarm after an exact number of ticks. The **loop** (bottom) calls delay() for that period, but every pass also does some work, so every pass is longer. The graph shows how far each tick lies from where it should be, in milliseconds.

**Try this**
- Leave the work at 1.2 ms: the loop falls steadily behind while the timer stays on the line.
- Add jitter: the loop is now late by a different amount each time, as it is when Wi-Fi or a print takes the CPU.
- Choose the 1 kHz tick with a 2.5 ms period: the alarm value must be a whole number of ticks, so the timer itself is off by a fixed amount. A tick that divides the period (1 MHz here) cures it.
- Set the work and the jitter to 0: the loop then keeps the period, but it has no time left for anything else.`,
    mount(box, kit) {
      const E = kit.esp;
      const st = kit.stage(box.stage, { aspect: 0.66, maxH: 500 });
      let seed = 5;
      const ctl = kit.controls(box.side, [
        { id: 'period', label: 'Period wanted', min: 1, max: 100, step: 0.5, value: 10, unit: 'ms' },
        { id: 'work', label: 'Work in each pass of the loop', min: 0, max: 10, step: 0.1, value: 1.2, unit: 'ms' },
        { id: 'jit', label: 'Extra delay, random up to', min: 0, max: 10, step: 0.1, value: 2, unit: 'ms' },
        { id: 'tick', type: 'select', label: 'Timer tick', options: [['1 MHz (1 µs)', 1e6], ['100 kHz (10 µs)', 1e5], ['1 kHz (1 ms)', 1e3]], value: 1e6 },
        { type: 'buttons', items: [{ id: 'again', label: 'Different jitter' }] }
      ], id => { if (id === 'again') seed++; loop.once(); });
      const ro = kit.readout(box.side, [['alarm', 'Alarm value'], ['tp', 'Timer period'], ['lp', 'Loop period, on average'], ['jit', 'Loop: longest minus shortest'], ['min', 'Loop after one minute']]);
      const K = 80;
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const P = v.period / 1000, N = Math.max(1, Math.round(P * v.tick)), actual = N / v.tick;
        const rand = rng(seed), loopT = [], passes = [];
        let t = 0;
        for (let k = 1; k <= K; k++) { const d = P + v.work / 1000 + rand() * v.jit / 1000; t += d; loopT.push(t); passes.push(d); }
        const mean = loopT[K - 1] / K, pp = Math.max(...passes) - Math.min(...passes);
        const lx = 112, rx = 14, pw = st.W - lx - rx, win = 10.5 * P, X = tt => lx + pw * clamp(tt / win, 0, 1);
        // the two rows of ticks
        const y0 = 28, rh = 34;
        kit.label(c, 'Alarms and loop passes over ten periods', lx, 12, { size: 11.5, color: C.text2, weight: 600 });
        [['hardware timer', 0], ['delay() loop', 1]].forEach(([name, i]) => { kit.label(c, name, lx - 10, y0 + rh * i + rh / 2, { size: 11.5, color: C.text2, align: 'right', weight: 600 }); c.fillStyle = i ? 'rgba(0,0,0,0)' : shade(C); c.fillRect(lx, y0 + rh * i, pw, rh); });
        for (let k = 1; k <= 10; k++) dash(c, X(k * P), y0, X(k * P), y0 + 2 * rh, C.faint, 1);
        c.lineWidth = 2.4;
        c.strokeStyle = C.ok; c.beginPath();
        for (let k = 1; k * actual <= win; k++) { const x = X(k * actual); c.moveTo(x, y0 + 5); c.lineTo(x, y0 + rh - 5); }
        c.stroke();
        c.strokeStyle = C.bad; c.beginPath();
        for (const lt of loopT) { if (lt > win) break; const x = X(lt); c.moveTo(x, y0 + rh + 5); c.lineTo(x, y0 + 2 * rh - 5); }
        c.stroke();
        kit.label(c, 'dashed: where the ticks should be', lx, y0 + 2 * rh + 12, { size: 10, color: C.muted });
        // the drift graph
        const gy = y0 + 2 * rh + 36, gh = st.H - gy - 34, gw = pw;
        const errLoop = loopT.map((tt, i) => (tt - (i + 1) * P) * 1000), errTimer = loopT.map((tt, i) => (i + 1) * (actual - P) * 1000);
        const hi = Math.max(0.01, ...errLoop, ...errTimer), lo = Math.min(0, ...errLoop, ...errTimer), span = hi - lo || 1;
        const GX = i => lx + gw * i / K, GY = e => gy + gh - gh * (e - lo) / span;
        kit.label(c, 'How far each tick is from its ideal time (ms)', lx, gy - 10, { size: 11.5, color: C.text2, weight: 600 });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(lx + 0.5, gy + 0.5, gw, gh);
        dash(c, lx, GY(0), lx + gw, GY(0), C.faint, 1);
        const line = (arr, color) => { c.strokeStyle = color; c.lineWidth = 2.2; c.beginPath(); arr.forEach((e, i) => { if (i) c.lineTo(GX(i + 1), GY(e)); else c.moveTo(GX(1), GY(e)); }); c.stroke(); };
        line(errLoop, C.bad); line(errTimer, C.ok);
        kit.label(c, fmt(hi, 3) + ' ms', lx - 6, gy + 4, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, fmt(lo, 3), lx - 6, gy + gh, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, 'tick number', lx + gw / 2, gy + gh + 14, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, '0', lx, gy + gh + 14, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, String(K), lx + gw, gy + gh + 14, { size: 10, color: C.muted, align: 'center' });
        kit.label(c, 'red: the delay() loop', lx + 10, gy + 14, { size: 10.5, color: C.bad });
        kit.label(c, 'green: the hardware timer', lx + 10, gy + 28, { size: 10.5, color: C.ok });
        // numbers
        ro.set('alarm', N + ' ticks at ' + fText(v.tick));
        ro.set('tp', tText(actual) + (Math.abs(actual - P) > 1e-9 ? '  (wanted ' + tText(P) + ')' : '  (exact)'));
        ro.set('lp', tText(mean) + '  (' + (mean > P ? '+' + fmt((mean / P - 1) * 100, 2) + ' %' : 'on time') + ')');
        ro.set('jit', tText(pp));
        const late = 60 / P * mean - 60;
        ro.set('min', late > 0.0005 ? fmt(late, 3) + ' s late' : 'on time');
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cr-rmt */
  /* the four times of a WS2812 bit, in seconds: [high, low] for a 0 and for a 1, and the tolerance of the datasheet */
  const WS_NOM = { 0: [0.4e-6, 0.85e-6], 1: [0.8e-6, 0.45e-6] }, WS_NS = { 0: [400, 850], 1: [800, 450] }, WS_TOL = 150e-9;
  const wsFrame = (r, g, b, tickNs) => {
    const tk = tickNs * 1e-9, q = ns => Math.max(1, Math.round(ns / tickNs + 1e-9));
    const sym = { 0: [q(WS_NS[0][0]), q(WS_NS[0][1])], 1: [q(WS_NS[1][0]), q(WS_NS[1][1])] };
    const edges = [[-2e-6, 0]], bitMarks = [], byteMarks = [];
    let t = 0, worst = 0;
    for (const [name, byte] of [['G', g], ['R', r], ['B', b]]) {
      const a = t;
      for (let i = 7; i >= 0; i--) {
        const bit = (byte >> i) & 1, h = sym[bit][0] * tk, l = sym[bit][1] * tk;
        edges.push([t, 1], [t + h, 0]);
        bitMarks.push({ t0: t, t1: t + h + l, text: String(bit) });
        t += h + l;
      }
      byteMarks.push({ t0: a, t1: t, text: name + ' ' + byte });
    }
    for (const bit of [0, 1]) for (const k of [0, 1]) worst = Math.max(worst, Math.abs(sym[bit][k] * tk - WS_NOM[bit][k]));
    return { edges, bitMarks, byteMarks, sym, worst, ok: worst <= WS_TOL + 1e-12, t1: t, tk };
  };
  Hyper.sim('cr-rmt', {
    title: 'The RMT playing a pulse train',
    blurb: `The RMT plays a list of symbols, each "level, duration, level, duration", out of a pin. The picture is the pin. For the **WS2812** every bit is one symbol: a 1 is a long high and a short low, a 0 the reverse, and the whole thing must be right within about 150 ns. For the **infrared** code the picture shows the envelope; the 38 kHz carrier inside each burst is added by the RMT in hardware.

**Try this**
- Keep the WS2812 on the 100 ns tick and change the colour: the byte marks follow, green first.
- Raise the tick to 500 ns and then 1 µs: the shortest time the RMT can play becomes too coarse, the timing leaves the specification and the read-out turns red.
- Switch to the infrared code: a frame is 34 symbols and about 68 ms, but it tolerates ticks of tens of microseconds.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.58, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'proto', type: 'select', label: 'Signal', options: [['WS2812 pixel, 800 kHz', 'ws'], ['Infrared remote, NEC', 'nec']], value: 'ws' },
        { id: 'tick', type: 'select', label: 'RMT tick', options: [['100 ns (10 MHz)', 100], ['250 ns', 250], ['400 ns', 400], ['500 ns', 500], ['1 µs (1 MHz)', 1000]], value: 100 },
        { id: 'r', label: 'Red', min: 0, max: 255, step: 1, value: 40 },
        { id: 'g', label: 'Green', min: 0, max: 255, step: 1, value: 0 },
        { id: 'b', label: 'Blue', min: 0, max: 255, step: 1, value: 0 },
        { id: 'addr', label: 'Address', min: 0, max: 255, step: 1, value: 0 },
        { id: 'cmd', label: 'Command', min: 0, max: 255, step: 1, value: 69 }
      ], id => { if (id === 'proto') vis(); loop.once(); });
      const ro = kit.readout(box.side, [['tick', 'Tick'], ['sym', 'Symbols'], ['time', 'Frame time'], ['mem', 'Channel memory'], ['spec', 'Timing']]);
      const vis = () => { const ws = ctl.values.proto === 'ws'; ['r', 'g', 'b'].forEach(k => ctl.show(k, ws)); ['addr', 'cmd'].forEach(k => ctl.show(k, !ws)); };
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, ws = v.proto === 'ws', tk = v.tick * 1e-9;
        let traces, t0, t1, lines = [], spec, symN, frame;
        if (ws) {
          const f = wsFrame(v.r, v.g, v.b, v.tick);
          traces = [{ label: 'DATA', edges: f.edges, marks: f.bitMarks, color: kit.hue(150) }, { label: 'bytes', edges: [[0, 0]], marks: f.byteMarks, color: C.faint }];
          t0 = -2e-6; t1 = f.t1 + 4e-6; symN = 24; frame = f.t1 + 50e-6;
          const s1 = f.sym[1], s0 = f.sym[0];
          lines = [
            'a 1:  high ' + s1[0] + ' ticks, low ' + s1[1] + ' ticks  =  ' + tText(s1[0] * tk) + ' + ' + tText(s1[1] * tk) + '   (wanted 800 ns + 450 ns)',
            'a 0:  high ' + s0[0] + ' ticks, low ' + s0[1] + ' ticks  =  ' + tText(s0[0] * tk) + ' + ' + tText(s0[1] * tk) + '   (wanted 400 ns + 850 ns)'
          ];
          spec = f.ok ? ['in specification: worst error ' + tText(f.worst) + ' of ±150 ns', C.ok] : ['OUT OF SPECIFICATION: error ' + tText(f.worst) + ' against ±150 ns. The pixel may show another colour.', C.bad];
        } else {
          const n = E.proto.nec(v.addr, v.cmd, { t: 0 });
          traces = [{ label: 'IR', edges: n.edges, marks: n.marks, color: kit.hue(20) }];
          t0 = -2e-3; t1 = n.t1 + 1e-3; symN = 34; frame = n.t1 - 1e-3;
          lines = ['symbols: 1 leader (9 ms + 4.5 ms), 32 bits (560 µs, then 560 or 1690 µs), 1 stop', 'each burst is a 38 kHz carrier, added by the RMT in hardware'];
          spec = ['fine at this tick: pulses of 560 µs rounded to ' + tText(tk) + ' ticks', C.ok];
        }
        kit.label(c, ws ? 'One WS2812 pixel: 24 bits, green then red then blue' : 'An infrared NEC frame: address, its inverse, command, its inverse', 12, 14, { size: 11.5, color: C.text2, weight: 600 });
        const ly = 28, lh = Math.round(st.H * (ws ? 0.5 : 0.36));
        S.logic(c, 8, ly, st.W - 16, lh, traces, { t0, t1, labelW: 50, grid: ws ? 12 : 10 });
        lines.forEach((s, i) => kit.label(c, s, 14, ly + lh + 18 + i * 17, { size: 11, color: C.text2 }));
        kit.label(c, spec[0], 14, ly + lh + 18 + lines.length * 17 + 6, { size: 11.5, color: spec[1], weight: 600 });
        ro.set('tick', tText(tk) + ' (' + fText(Math.round(1 / tk)) + ')');
        ro.set('sym', symN + ' symbols' + (ws ? ' + a reset gap' : ''));
        ro.set('time', tText(frame));
        ro.set('mem', symN <= 48 ? 'fits in one block (a block holds 48 or 64 symbols)' : 'needs more than one block');
        ro.set('spec', ws ? (spec[1] === C.ok ? 'in specification' : 'out of specification') : 'tolerant');
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      vis();
      loop.once();
    }
  });

  /* ================================================================ cr-pcnt */
  Hyper.sim('cr-pcnt', {
    title: 'The pulse counter and a quadrature encoder',
    blurb: `Two signals, A and B, a quarter of a cycle apart: when **A leads B** the knob turns forward, when B leads it turns back. The pulse counter watches every edge of both and counts up or down, four counts per cycle. Beside it is a naive counter that counts only the rising edges of A.

**Try this**
- Press *Turn forward*, then *Turn back*: the PCNT count goes up and down; the naive counter only goes up.
- Switch on **contact bounce** and turn the knob again: each step wobbles forward, back and forward. The PCNT count stays exact because the bounce cancels; the naive counter counts the extra rising edges.
- Raise the speed: the traces get dense, but a hardware counter never misses an edge.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.6, maxH: 460 });
      const SEQ = [[0, 0], [1, 0], [1, 1], [0, 1]];
      let k = 0, t = 0, pos = 0, naive = 0, lastDir = 0, acc = 0, curA = 0, curB = 0;
      let queue = [], A = [[-1, 0]], B = [[-1, 0]];
      const ctl = kit.controls(box.side, [
        { id: 'rate', label: 'Speed', min: 5, max: 200, step: 5, value: 40, unit: 'counts/s' },
        { id: 'bounce', type: 'check', label: 'Contact bounce at every step', value: false },
        { type: 'buttons', items: [{ id: 'fwd', label: 'Turn forward 2 detents', primary: true }, { id: 'back', label: 'Turn back 2 detents' }, { id: 'zero', label: 'Zero the counters' }] }
      ], id => {
        if (id === 'fwd' || id === 'back') { const d = id === 'fwd' ? 1 : -1; for (let i = 0; i < 8; i++) { queue.push(d); if (ctl.values.bounce) queue.push(-d, d); } loop.start(); }
        if (id === 'zero') { pos = 0; naive = 0; }
      });
      const ro = kit.readout(box.side, [['pcnt', 'PCNT count'], ['det', 'Detents (4 counts each)'], ['naive', 'Naive counter (A rising only)'], ['dir', 'Last direction'], ['rpm', 'Speed at this rate']]);
      const step = d => {
        k = (k + d + 4) % 4;
        const [a, b] = SEQ[k];
        if (a !== curA) { A.push([t, a]); if (a === 1) naive++; curA = a; }
        if (b !== curB) { B.push([t, b]); curB = b; }
        pos += d; lastDir = d;
      };
      const loop = kit.loop(dt => {
        t += dt;
        acc += dt * ctl.values.rate;
        while (acc >= 1 && queue.length) { acc -= 1; step(queue.shift()); }
        if (!queue.length) acc = Math.min(acc, 1);
        while (A.length > 2 && A[1][0] < t - 2) A.shift();
        while (B.length > 2 && B[1][0] < t - 2) B.shift();
        draw();
      }, box.stage);
      const draw = () => {
        const c = st.begin(), C = kit.colors();
        // the knob
        const cx = 64, cy = 54, r = 34, ang = pos * Math.PI * 2 / 80 - Math.PI / 2;
        c.save(); c.beginPath(); c.arc(cx, cy, r, 0, Math.PI * 2); c.fillStyle = C.dark ? '#2c3244' : '#d5d9e4'; c.fill(); c.lineWidth = 1.5; c.strokeStyle = C.muted; c.stroke();
        for (let i = 0; i < 20; i++) { const a = i * Math.PI * 2 / 20; c.beginPath(); c.moveTo(cx + Math.cos(a) * (r + 2), cy + Math.sin(a) * (r + 2)); c.lineTo(cx + Math.cos(a) * (r + 7), cy + Math.sin(a) * (r + 7)); c.strokeStyle = C.axis; c.lineWidth = 1.2; c.stroke(); }
        c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(ang) * r * 0.85, cy + Math.sin(ang) * r * 0.85); c.strokeStyle = C.accent; c.lineWidth = 3.5; c.lineCap = 'round'; c.stroke(); c.restore();
        kit.label(c, '20 detents, 80 counts a turn', cx, cy + r + 18, { size: 10, color: C.muted, align: 'center' });
        // the counts
        const nx = 150;
        kit.label(c, 'PCNT count', nx, 22, { size: 11, color: C.muted });
        kit.label(c, String(pos), nx, 52, { size: 30, weight: 700, color: C.text });
        kit.label(c, 'naive counter (A rising only)', nx + 170, 22, { size: 11, color: C.muted });
        kit.label(c, String(naive), nx + 170, 52, { size: 30, weight: 700, color: pos / 4 !== naive && naive !== 0 ? C.bad : C.text });
        kit.label(c, lastDir > 0 ? 'A leads B: forward' : lastDir < 0 ? 'B leads A: back' : 'at rest', nx, 84, { size: 11.5, color: C.text2 });
        // the signals, the last second
        const ty = 140, th = st.H - ty - 14, sh = e => [e[0] - (t - 1), e[1]], E = kit.esp;
        const eA = A.map(sh), eB = B.map(sh);
        S.logic(c, 8, ty, st.W - 16, th, [{ label: 'A', edges: eA, color: kit.hue(205), idle: E.proto.levelAt(eA, 0) }, { label: 'B', edges: eB, color: kit.hue(30), idle: E.proto.levelAt(eB, 0) }], { t0: 0, t1: 1, labelW: 30, grid: 10, unit: 's' });
        kit.label(c, 'the last second · now at the right edge', 14, ty - 8, { size: 10.5, color: C.muted });
        ro.set('pcnt', String(pos)); ro.set('det', fmt(pos / 4, 3)); ro.set('naive', String(naive));
        ro.set('dir', lastDir > 0 ? 'forward' : lastDir < 0 ? 'back' : '—');
        ro.set('rpm', fmt(ctl.values.rate / 80 * 60, 3) + ' rpm');
      };
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ cr-watchdog */
  Hyper.sim('cr-watchdog', {
    title: 'A watchdog, fed and starved',
    blurb: `The program feeds the watchdog (green ticks) at the end of every pass. The sawtooth is the time since the last feed; when it reaches the timeout the chip resets (red line), reboots for a moment, and the program starts again.

**Try this**
- Press **Make the program hang**: the feeding stops, the sawtooth climbs to the timeout, the watchdog bites and the chip restarts healthy.
- Tick **also feed it from a background timer** and hang the program again: the timer (blue ticks) keeps the watchdog happy and the hung program is never reset. That is the mistake.
- Make one pass take longer than the timeout: the program is fed too late and the chip resets by itself, with no hang at all. Choose a timeout longer than the slowest normal pass.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.6, maxH: 460 });
      let t = 0, lastFeed = 0, hung = false, booting = false, bootEnd = 0, nextPass = 0.5, nextBg = 0.5;
      let resets = [], feeds = [], samples = [], segs = [{ t0: 0, s: 'run' }];
      const WIN = 20;
      const setState = (s, tt) => { if (segs[segs.length - 1].s !== s) segs.push({ t0: tt, s }); };
      const restart = () => { t = 0; lastFeed = 0; hung = false; booting = false; nextPass = ctl.values.pass; nextBg = 0.5; resets = []; feeds = []; samples = []; segs = [{ t0: 0, s: 'run' }]; };
      const ctl = kit.controls(box.side, [
        { id: 'timeout', label: 'Watchdog timeout', min: 1, max: 10, step: 0.5, value: 3, unit: 's' },
        { id: 'pass', label: 'One pass of the program takes', min: 0.1, max: 8, step: 0.1, value: 0.5, unit: 's' },
        { id: 'bg', type: 'check', label: 'Also feed it from a background timer (the mistake)', value: false },
        { type: 'buttons', items: [{ id: 'hang', label: 'Make the program hang', primary: true }, { id: 'clear', label: 'Start again' }] }
      ], id => {
        if (id === 'hang' && !booting) { hung = true; setState('hung', t); }
        if (id === 'clear') restart();
        loop.start();
      });
      const ro = kit.readout(box.side, [['state', 'The program'], ['since', 'Time since the last feed'], ['n', 'Resets so far'], ['why', 'Last reset']]);
      const feed = (tt, kind) => { lastFeed = tt; feeds.push({ t: tt, kind }); };
      const tick = tt => {
        const v = ctl.values;
        if (booting) { if (tt >= bootEnd) { booting = false; hung = false; lastFeed = tt; nextPass = tt + v.pass; nextBg = tt + 0.5; setState('run', tt); } return; }
        if (!hung) while (tt >= nextPass) { feed(nextPass, 'program'); nextPass += v.pass; }
        if (v.bg) while (tt >= nextBg) { feed(nextBg, 'timer'); nextBg += 0.5; }
        if (tt - lastFeed >= v.timeout) { resets.push(tt); booting = true; bootEnd = tt + 1.2; setState('boot', tt); }
      };
      const loop = kit.loop(dt => {
        const t1 = t + dt;
        for (let tt = t; tt < t1 - 1e-9;) { tt = Math.min(t1, tt + 0.01); tick(tt); }
        t = t1;
        samples.push([t, booting ? 0 : t - lastFeed]);
        while (samples.length > 2 && samples[1][0] < t - WIN - 1) samples.shift();
        while (feeds.length && feeds[0].t < t - WIN - 1) feeds.shift();
        draw();
      }, box.stage);
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const since = booting ? 0 : t - lastFeed, state = booting ? 'boot' : hung ? 'hung' : 'run';
        // the status
        const lx = 56, rx = 14, pw = st.W - lx - rx, sy = 10;
        const col = state === 'run' ? C.ok : state === 'hung' ? C.bad : C.faint;
        S.box(c, lx, sy, 170, 36, { label: state === 'run' ? 'RUNNING' : state === 'hung' ? 'HUNG: not feeding' : 'REBOOTING', color: col, active: true, size: 13, textColor: col });
        const bx = lx + 184, bw = pw - 184;
        c.fillStyle = shade(C); c.fillRect(bx, sy + 8, bw, 20);
        const frac = clamp(1 - since / v.timeout, 0, 1);
        c.fillStyle = frac > 0.5 ? C.ok : frac > 0.2 ? C.warn : C.bad; c.fillRect(bx, sy + 8, bw * frac, 20);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(bx + 0.5, sy + 8.5, bw, 20);
        kit.label(c, 'time left before the dog bites: ' + fmt(Math.max(0, v.timeout - since), 2) + ' s', bx + 8, sy + 18, { size: 11, color: C.text });
        // the timeline
        const ty = 82, by = st.H - 62, ph = by - ty, t0 = t - WIN, X = tt => lx + pw * clamp((tt - t0) / WIN, 0, 1), ymax = v.timeout * 1.3, Y = s => by - ph * clamp(s / ymax, 0, 1);
        c.fillStyle = shade(C); c.fillRect(lx, ty, pw, ph);
        segs.forEach((g, i) => {
          const a = g.t0, b = i + 1 < segs.length ? segs[i + 1].t0 : t;
          if (b < t0 || g.s === 'run') return;
          c.fillStyle = g.s === 'hung' ? (C.dark ? 'rgba(229,72,77,.18)' : 'rgba(229,72,77,.14)') : (C.dark ? 'rgba(150,156,189,.22)' : 'rgba(80,90,130,.15)');
          c.fillRect(X(Math.max(a, t0)), ty, X(b) - X(Math.max(a, t0)), ph);
        });
        for (let s = 0; s <= WIN; s += 5) { const x = X(t0 + s); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(Math.round(x) + 0.5, ty); c.lineTo(Math.round(x) + 0.5, by); c.stroke(); }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(lx + 0.5, ty + 0.5, pw, ph);
        dash(c, lx, Y(v.timeout), lx + pw, Y(v.timeout), C.bad, 1.5);
        kit.label(c, 'timeout ' + fmt(v.timeout, 2) + ' s', lx + pw - 6, Y(v.timeout) - 9, { size: 10.5, color: C.bad, align: 'right' });
        S.analog(c, lx, ty, pw, ph, samples.filter(p => p[0] >= t0 - 0.2), { t0, t1: t, min: 0, max: ymax, color: C.accent, width: 2 });
        for (const r of resets) if (r >= t0) { c.strokeStyle = C.bad; c.lineWidth = 2.5; c.beginPath(); c.moveTo(X(r), ty); c.lineTo(X(r), by); c.stroke(); kit.label(c, 'RESET', X(r) - 4, ty + 10, { size: 10.5, color: C.bad, align: 'right', weight: 700 }); }
        // feeds
        const fy = by + 14;
        kit.label(c, 'feeds', lx - 8, fy + 8, { size: 10.5, color: C.muted, align: 'right' });
        for (const f of feeds) if (f.t >= t0) { c.strokeStyle = f.kind === 'program' ? C.ok : kit.hue(250); c.lineWidth = 2; c.beginPath(); c.moveTo(X(f.t), fy); c.lineTo(X(f.t), fy + 16); c.stroke(); }
        kit.label(c, 'green: fed by the program · blue: fed by the timer · the last 20 seconds', lx, fy + 32, { size: 10, color: C.muted });
        kit.label(c, 'height: time since the last feed', lx + 6, ty + 10, { size: 10, color: C.muted });
        ro.set('state', state === 'run' ? 'running' : state === 'hung' ? 'hung' + (v.bg ? ' (but the timer keeps feeding)' : '') : 'rebooting');
        ro.set('since', fmt(since, 2) + ' s');
        ro.set('n', String(resets.length));
        ro.set('why', resets.length ? 'task watchdog (ESP_RST_TASK_WDT / WDT_RESET)' : 'none yet');
      };
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ cr-touch */
  Hyper.sim('cr-touch', {
    title: 'A touch pad and a finger',
    blurb: `A finger near the pad adds capacitance and changes the reading. The dashed grey line is the baseline, the **untouched** reading; the orange one is the threshold. The numbers are typical in order of magnitude only: your pad and board will differ.

**Try this**
- On the **ESP32** the reading falls when the finger comes near; on the **S2 and S3** it rises, and by a much smaller proportion. Same finger, opposite direction.
- Keep the threshold at 10 %: the S3 only trips when the finger is almost touching, the ESP32 sooner.
- Raise the noise and lower the threshold to 3 %: false touches appear. A threshold must sit well outside the noise.
- Untick *the finger moves by itself* and place the finger by hand.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.64, maxH: 480 });
      const rand = rng(11);
      let t = 0, hist = [], touched = false;
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: [['ESP32: the reading falls', 'esp32'], ['ESP32-S2 / S3: the reading rises', 's3']], value: 'esp32' },
        { id: 'auto', type: 'check', label: 'The finger moves by itself', value: true },
        { id: 'd', label: 'Finger distance (when not moving by itself)', min: 0, max: 30, step: 0.5, value: 20, unit: 'mm' },
        { id: 'th', label: 'Threshold: change from the baseline', min: 2, max: 80, step: 1, value: 10, unit: '%' },
        { id: 'noise', label: 'Noise on the reading', min: 0, max: 10, step: 0.5, value: 2, unit: '%' }
      ], () => { hist = []; });
      const ro = kit.readout(box.side, [['val', 'Reading'], ['base', 'Baseline (untouched)'], ['chg', 'Change from the baseline'], ['thr', 'Threshold at'], ['d', 'Finger'], ['touch', 'Touched?']]);
      const WIN = 10;
      const loop = kit.loop(dt => {
        t += dt;
        const v = ctl.values, es = v.chip === 'esp32';
        const d = v.auto ? 15 + 16 * Math.sin(t * 0.7) : v.d, dd = clamp(d, 0, 30), g = 1 / (1 + Math.pow(dd / 6, 2));
        const base = es ? 75 : 28000, n = (rand() * 2 - 1) * v.noise / 100;
        const val = base * (es ? 1 - 0.8 * g : 1 + 0.2 * g) * (1 + n);
        const thr = es ? base * (1 - v.th / 100) : base * (1 + v.th / 100);
        touched = es ? val < thr : val > thr;
        hist.push([t, val, dd, touched]);
        while (hist.length > 2 && hist[0][0] < t - WIN - 0.5) hist.shift();
        const c = st.begin(), C = kit.colors();
        // the pad and the finger
        const pad = { x: 56, y: 132, w: 90, h: 14 }, kmm = 2.4;
        c.fillStyle = C.dark ? '#c9a227' : '#b8860b'; c.fillRect(pad.x, pad.y, pad.w, pad.h);
        kit.label(c, 'touch pad', pad.x + pad.w + 10, pad.y + 7, { size: 10.5, color: C.muted });
        const fy = pad.y - 10 - dd * kmm;
        c.fillStyle = C.dark ? 'rgba(255,200,170,.9)' : 'rgba(224,160,120,.95)';
        c.beginPath(); c.roundRect ? c.roundRect(pad.x + 20, fy - 40, 50, 40, 18) : c.rect(pad.x + 20, fy - 40, 50, 40); c.fill();
        kit.label(c, fmt(dd, 3) + ' mm', pad.x + 75, fy - 18, { size: 10.5, color: C.text2 });
        S.led(c, st.W - 70, 50, { color: 140, on: touched, r: 13, label: touched ? 'TOUCHED' : 'not touched' });
        // the readings
        const lx = 64, rx = 14, ty = 168, by = st.H - 26, pw = st.W - lx - rx, ph = by - ty, t0 = t - WIN;
        const lo = es ? 0 : 26000, hi = es ? 100 : 34500, X = tt => lx + pw * clamp((tt - t0) / WIN, 0, 1), Y = x => by - ph * clamp((x - lo) / (hi - lo), 0, 1);
        c.fillStyle = shade(C); c.fillRect(lx, ty, pw, ph);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(lx + 0.5, ty + 0.5, pw, ph);
        dash(c, lx, Y(base), lx + pw, Y(base), C.muted, 1.4);
        dash(c, lx, Y(thr), lx + pw, Y(thr), C.warn, 1.6);
        kit.label(c, 'baseline', lx + 6, Y(base) + (es ? 10 : -9), { size: 10, color: C.muted });
        kit.label(c, 'threshold', lx + pw - 6, Y(thr) + (es ? 10 : -9), { size: 10, color: C.warn, align: 'right' });
        kit.label(c, String(hi), lx - 6, ty + 4, { size: 10, color: C.muted, align: 'right' });
        kit.label(c, String(lo), lx - 6, by, { size: 10, color: C.muted, align: 'right' });
        S.analog(c, lx, ty, pw, ph, hist.map(p => [p[0], p[1]]), { t0, t1: t, min: lo, max: hi, color: C.accent, width: 2 });
        c.fillStyle = C.ok;
        for (const p of hist) if (p[3] && p[0] >= t0) { c.beginPath(); c.arc(X(p[0]), Y(p[1]), 2.4, 0, Math.PI * 2); c.fill(); }
        kit.label(c, 'touch reading, the last 10 s · green dots: counted as touched', lx, by + 14, { size: 10, color: C.muted });
        ro.set('val', fmt(val, 4)); ro.set('base', fmt(base, 4)); ro.set('chg', (val >= base ? '+' : '') + fmt((val / base - 1) * 100, 3) + ' %');
        ro.set('thr', fmt(thr, 4) + (es ? ' (below it counts)' : ' (above it counts)')); ro.set('d', fmt(dd, 3) + ' mm'); ro.set('touch', touched ? 'yes' : 'no');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ cr-dac */
  Hyper.sim('cr-dac', {
    title: 'The DAC as a staircase sine',
    blurb: `The program writes a table of values to the DAC, one every few tens of microseconds. The output holds each value until the next one: a staircase (blue). The thin line is the ideal sine; the orange line is the staircase after an RC filter.

**Try this**
- Raise the **samples per period**: the steps get finer and the output frequency falls, because one period now takes longer.
- Lower the **DAC bits** to 4: the output can only take 16 levels, so each step is much taller and the sine is a coarse staircase.
- Switch on the **RC filter** and move the corner: a corner well below the signal flattens it, one well above leaves the steps rounded off.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.58, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Samples per period', min: 4, max: 64, step: 1, value: 16 },
        { id: 'dt', label: 'Time between samples', min: 20, max: 400, step: 5, value: 100, unit: 'µs' },
        { id: 'bits', label: 'DAC bits', min: 3, max: 8, step: 1, value: 8 },
        { id: 'rc', type: 'check', label: 'Add an RC filter after the pin', value: false },
        { id: 'fc', label: 'Filter corner', min: 50, max: 5000, value: 1000, unit: 'Hz', log: true, sig: 3 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['f', 'Output frequency'], ['rate', 'Sample rate'], ['step', 'One step'], ['levels', 'Output levels'], ['amp', 'Amplitude after the filter']]);
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const n = Math.round(v.n), dt = v.dt * 1e-6, T = n * dt, f = 1 / T, top = Math.pow(2, v.bits) - 1;
        const val = i => Math.round((0.5 + 0.5 * Math.sin(2 * Math.PI * i / n)) * top) / top * 3.3;
        const stair = [];
        for (let j = 0; j < 3 * n; j++) { const vj = val(j % n); stair.push([j * dt, vj], [(j + 1) * dt, vj]); }
        const lx = 56, rx = 14, ty = 30, by = st.H - 40, pw = st.W - lx - rx, ph = by - ty, t1 = 3 * T;
        c.fillStyle = shade(C); c.fillRect(lx, ty, pw, ph);
        for (const V of [0, 1.65, 3.3]) { const y = by - ph * V / 3.3; c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(lx, y); c.lineTo(lx + pw, y); c.stroke(); kit.label(c, fmt(V, 3) + ' V', lx - 6, y, { size: 10, color: C.muted, align: 'right' }); }
        c.strokeStyle = C.axis; c.strokeRect(lx + 0.5, ty + 0.5, pw, ph);
        S.analog(c, lx, ty, pw, ph, tt => 1.65 + 1.65 * Math.sin(2 * Math.PI * tt / T), { t0: 0, t1, min: 0, max: 3.3, color: C.muted, width: 1.2 });
        S.analog(c, lx, ty, pw, ph, stair, { t0: 0, t1, min: 0, max: 3.3, color: C.accent, width: 2.2 });
        let amp = 1;
        if (v.rc) {
          const tau = 1 / (2 * Math.PI * v.fc), pts = [];
          let y = 1.65;
          for (let j = -4 * n; j < 3 * n; j++) {
            const vj = val(((j % n) + n) % n);
            for (let s = 1; s <= 4; s++) { y = vj + (y - vj) * Math.exp(-(dt / 4) / tau); if (j >= 0) pts.push([j * dt + s * dt / 4, y]); }
          }
          S.analog(c, lx, ty, pw, ph, pts, { t0: 0, t1, min: 0, max: 3.3, color: kit.hue(35), width: 2.4 });
          amp = 1 / Math.sqrt(1 + Math.pow(f / v.fc, 2));
        }
        for (let i = 0; i <= 3; i++) { const x = lx + pw * i / 3; kit.label(c, tText(i * T), x, by + 12, { size: 10, color: C.muted, align: i === 0 ? 'left' : i === 3 ? 'right' : 'center' }); }
        kit.label(c, 'three periods · blue: the DAC output · thin line: the ideal sine' + (v.rc ? ' · orange: after the RC filter' : ''), lx, by + 28, { size: 10.5, color: C.muted });
        kit.label(c, 'DAC output', lx, 14, { size: 11.5, color: C.text2, weight: 600 });
        ro.set('f', fText(f)); ro.set('rate', fText(1 / dt)); ro.set('step', fmt(3.3 / top * 1000, 3) + ' mV'); ro.set('levels', String(top + 1));
        ro.set('amp', v.rc ? fmt(amp * 100, 3) + ' % of the signal' : 'no filter');
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cr-mcpwm */
  Hyper.sim('cr-mcpwm', {
    title: 'Dead time in a half-bridge',
    blurb: `The first two traces are the signals MCPWM sends to the gate drivers of the upper (A) and lower (B) switch. The other two show when each switch really **conducts**: a switch turns on at once but takes its turn-off delay to stop. Where both conduct at the same time (red) the supply is shorted through them.

**Try this**
- Set the dead time to 0: A and B are exact opposites, but the lower switch is still on while the upper turns on, and a red band appears on every edge.
- Raise the dead time past the turn-off delay: the red bands vanish and a gap appears between the conducting periods.
- At 50 kHz with a long dead time and a small duty cycle, the upper pulse can become shorter than the dead time and never turn on.
- The read-out shows how much of the period dead time takes.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.6, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'PWM frequency', min: 1, max: 50, step: 1, value: 20, unit: 'kHz' },
        { id: 'duty', label: 'Duty cycle', min: 5, max: 95, step: 1, value: 30, unit: '%' },
        { id: 'td', label: 'Dead time on each edge', min: 0, max: 2000, step: 25, value: 500, unit: 'ns' },
        { id: 'toff', label: 'Switch turn-off delay', min: 50, max: 1000, step: 25, value: 250, unit: 'ns' },
        { id: 'view', type: 'select', label: 'View', options: [['Zoom in on an edge', 'zoom'], ['Two whole periods', 'whole']], value: 'zoom' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['T', 'Period'], ['td', 'Dead time per edge'], ['both', 'Both switches on, per edge'], ['loss', 'Period taken by dead time'], ['v', 'Verdict']]);
      const draw = () => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const T = 1 / (v.f * 1000), dT = v.duty / 100 * T, td = v.td * 1e-9, toff = v.toff * 1e-9;
        const A = [], B = [], Ac = [], Bc = [];
        for (let k = -2; k <= 4; k++) {
          const b = k * T;
          if (dT > td) { A.push([b + td, b + dT]); Ac.push([b + td, b + dT + toff]); }
          if (T - dT > td) { B.push([b + dT + td, b + T]); Bc.push([b + dT + td, b + T + toff]); }
        }
        const over = [];
        for (const a of Ac) for (const bb of Bc) { const s = Math.max(a[0], bb[0]), e = Math.min(a[1], bb[1]); if (e > s) over.push([s, e]); }
        let t0 = 0, t1 = 2 * T;
        if (v.view === 'zoom') { const W = Math.max(2e-6, 2.5 * (td + toff)); t0 = T - 0.4 * W; t1 = T + 0.6 * W; }
        kit.label(c, v.view === 'zoom' ? 'Zoom on the instant the upper switch is told to turn on (the lower one off)' : 'Two whole periods', 12, 14, { size: 11.5, color: C.text2, weight: 600 });
        const ly = 28, lh = st.H - ly - 56;
        const tr = (label, ints, color) => { const e = edgesOf(ints); return { label, edges: e, color, idle: kit.esp.proto.levelAt(e, t0) }; };
        const g = S.logic(c, 8, ly, st.W - 16, lh, [
          tr('A gate', A, kit.hue(205)), tr('B gate', B, kit.hue(30)), tr('A conducts', Ac, kit.hue(205)), tr('B conducts', Bc, kit.hue(30))
        ], { t0, t1, labelW: 74, grid: 10 });
        let shown = 0;
        for (const [s, e] of over) {
          if (e < t0 || s > t1) continue;
          const x0 = g.X(Math.max(s, t0)), x1 = g.X(Math.min(e, t1));
          c.fillStyle = C.dark ? 'rgba(229,72,77,.45)' : 'rgba(229,72,77,.35)'; c.fillRect(x0, g.plot.y, Math.max(2, x1 - x0), g.plot.h);
          if (!shown++) kit.label(c, 'both on: shoot-through', x1 + 6, g.plot.y + 10, { size: 10.5, color: C.bad, weight: 700 });
        }
        const both = Math.max(0, toff - td), loss = 2 * td / T;
        kit.label(c, 'the gap in the gate signals is the dead time; the red band is what is left of the overlap', 12, st.H - 14, { size: 10.5, color: C.muted });
        ro.set('T', tText(T)); ro.set('td', tText(td));
        ro.set('both', both > 0 ? tText(both) + '  (twice per period)' : 'never');
        ro.set('loss', fmt(loss * 100, 3) + ' %');
        ro.set('v', dT <= td ? 'the upper pulse is shorter than the dead time: it never turns on' : both > 0 ? 'SHOOT-THROUGH: raise the dead time above ' + tText(toff) : 'safe: both switches are never on together');
      };
      const loop = kit.loop(draw, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
