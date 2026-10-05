/* HYPER-ESP32 · sims/outputs-and-actuators.js
 *
 * Simulations of the topic "Lights, sound and loads" (topic code oa):
 *
 *   oa-pwm-dimming     a PWM signal, the number of bits a frequency allows, and equal steps of duty against equal steps to the eye
 *   oa-rgb-mixing      three duty values make a colour: gamma on or off, common anode, and the resistor of each colour
 *   oa-pixel-strip     the WS2812 data stream of the first pixels, the frame time and the current of a strip
 *   oa-strip-drop      the voltage along a long strip with one, two or several feed points
 *   oa-tone-wave       a note as a square wave: duty, harmonics and what a passive piezo radiates
 *   oa-flyback         the switch-off of a coil: no diode, a diode, a diode with a Zener
 *   oa-fan-tach        a four-wire fan: the 25 kHz control, two tach pulses per turn and the speed read-out
 *   oa-heater-window   time-proportioning of a heater: the window against the thermal time constant
 *   oa-ir-burst        an NEC infrared frame, its 38 kHz carrier and the receiver's answer
 *
 * Chip facts (LEDC timer width, bits at a frequency) come from the catalogue (kit.esp); the models say where they are schematic.
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const GAM = 2.2;
  /* the eye (and a screen coded for it) sees about the 2.2th root of the light */
  const toScreen = lin => Math.pow(clamp(lin, 0, 1), 1 / GAM);
  const rgbCss = (r, g, b) => 'rgb(' + Math.round(clamp(r, 0, 255)) + ',' + Math.round(clamp(g, 0, 255)) + ',' + Math.round(clamp(b, 0, 255)) + ')';
  /* the part of an edge list that lies in a window, starting with the level at its start (a slanted first segment is drawn otherwise) */
  function windowEdges(edges, t0, t1) {
    let lvl = edges.length ? edges[0][1] : 0;
    const out = [];
    for (const e of edges) { if (e[0] <= t0) lvl = e[1]; else if (e[0] < t1) out.push(e); }
    return [[t0, lvl]].concat(out);
  }
  const fmtT = (kit, s) => (s >= 1 ? kit.fmt(s, 3) + ' s' : s >= 1e-3 ? kit.fmt(s * 1e3, 3) + ' ms' : kit.fmt(s * 1e6, 3) + ' µs');
  /* hue 0 … 360 -> [r, g, b] 0 … 255 at full saturation and value */
  function hueRgb(h) {
    h = ((h % 360) + 360) % 360;
    const region = Math.floor(h / 60), up = Math.round((h % 60) * 255 / 60), down = 255 - up;
    return [[255, up, 0], [down, 255, 0], [0, 255, up], [0, down, 255], [up, 0, 255], [255, 0, down]][region];
  }

  /* ================================================================ oa-pwm-dimming */
  Hyper.sim('oa-pwm-dimming', {
    title: 'PWM dimming: frequency, bits and gamma',
    blurb: `The trace is the PWM signal on the pin. Under it, two ramps show what the eye sees when the duty rises in **equal steps** (top) and when it follows **duty = brightness to the power 2.2** (bottom), at the number of bits you choose. The marker is the brightness you ask for.

**Try this**
- Switch **gamma correction** off with 50 % asked: the duty is 50 % and the LED *looks* about 73 % bright. Switch it on: the duty drops to about 22 % and it looks like 50 %.
- Lower the **resolution** to 4 to 6 bits and look at the dark end of the lower ramp: it climbs in visible steps. At 10 to 12 bits it is smooth.
- Ask for 16 bits at 5 kHz: the setup **fails**, because 80 MHz / 5 kHz leaves room for 13 bits. Lower the frequency to 100 Hz and try again on the ESP32 and on the S3.
- Move the **frequency** below 100 Hz and read the flicker verdict.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const IDS = ['esp32', 'esp32-s3', 'esp32-c3', 'esp32-c6'].filter(id => E.chip(id));
      if (!IDS.length) return;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 380, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: IDS.map(id => [E.chip(id).name + ' · ' + E.ledcTimerBits(id) + '-bit timer', id]), value: IDS.indexOf(params.chip) >= 0 ? params.chip : IDS[0] },
        { id: 'f', label: 'PWM frequency', min: 20, max: 20000, value: 5000, unit: 'Hz', log: true, sig: 3 },
        { id: 'bits', label: 'Resolution', min: 2, max: 16, step: 1, value: 8, unit: 'bits' },
        { id: 'L', label: 'Brightness asked for', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'gamma', type: 'check', label: 'Gamma correction (duty = brightness to the 2.2)', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['duty', 'Duty value'], ['avg', 'Average voltage'], ['seen', 'The LED looks'], ['first', 'First step above off'], ['max', 'Most bits at this frequency'], ['flicker', 'Flicker']]);
      function model() {
        const v = ctl.values, f = v.f, cap = E.ledcTimerBits(v.chip);
        const limit = Math.max(1, Math.min(cap, E.ledcMaxBits(f, 80e6, cap)));
        const bits = Math.round(v.bits), ok = bits <= limit, used = Math.min(bits, limit);
        const levels = Math.pow(2, used) - 1, L = v.L / 100;
        const duty = Math.round((v.gamma ? Math.pow(L, GAM) : L) * levels), frac = levels ? duty / levels : 0;
        return { f, cap, limit, bits, ok, used, levels, L, duty, frac, seen: toScreen(frac), first: toScreen(1 / levels), gamma: v.gamma };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), m = model(), W = st.W, H = st.H, M = 12;
        const px = M + 4, pw = W - px - (W >= 560 ? 72 : M);
        // the signal on the pin
        kit.label(c, 'The signal on the pin (three periods)', M, 11, { size: 11.5, weight: 650, color: C.text2 });
        const ay = 26, ah = clamp(H * 0.13, 40, 66), T = 1 / m.f, t1 = 3 * T;
        const edges = m.frac <= 0 ? [[0, 0]] : m.frac >= 1 ? [[0, 1]] : windowEdges(S.pwmEdges(m.f, m.frac, 0, t1, 0), 0, t1);
        S.wave(c, px, ay, pw, ah, edges, { t0: 0, t1, fill: true, color: kit.hue(40) });
        kit.label(c, 'period ' + fmtT(kit, T) + ' · on ' + fmtT(kit, T * m.frac) + ' · one step ' + fmtT(kit, T / Math.pow(2, m.used)), px, ay + ah + 12, { size: 10.5, color: C.muted });
        if (W >= 560) {
          S.led(c, W - 38, ay + ah / 2 - 4, { color: 45, on: m.seen, r: 15 });
          kit.label(c, 'looks ' + Math.round(m.seen * 100) + ' %', W - 38, ay + ah / 2 + 26, { size: 10.5, color: C.text2, align: 'center' });
        }
        // the two ramps
        const K = clamp(Math.floor(pw / 6), 16, 64), cw = pw / K, rb = clamp(H * 0.11, 28, 54);
        const y1 = ay + ah + 44, y2 = y1 + rb + 34;
        const row = (y, gammaOn, label) => {
          kit.label(c, label, px, y - 9, { size: 11, color: C.text2, weight: 600 });
          for (let k = 0; k < K; k++) {
            const x = k / (K - 1), d = Math.round((gammaOn ? Math.pow(x, GAM) : x) * m.levels) / m.levels, s = toScreen(d);
            c.fillStyle = rgbCss(255 * s, 214 * s, 150 * s);
            c.fillRect(px + k * cw, y, Math.ceil(cw), rb);
          }
          c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(px + 0.5, y + 0.5, pw - 1, rb - 1);
        };
        row(y1, false, 'Equal steps of duty');
        row(y2, true, 'Duty = brightness to the power 2.2 (' + m.used + ' bits)');
        const mx = px + m.L * pw;
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.moveTo(mx, y1 - 3); c.lineTo(mx, y2 + rb + 3); c.stroke();
        kit.label(c, 'asked ' + Math.round(m.L * 100) + ' %', clamp(mx, px + 30, px + pw - 30), y2 + rb + 14, { size: 10.5, color: C.accent, align: 'center', weight: 600 });
        kit.label(c, '0 %', px, y2 + rb + 14, { size: 10, color: C.faint });
        kit.label(c, '100 %', px + pw, y2 + rb + 14, { size: 10, color: C.faint, align: 'right' });
        kit.label(c, 'brightness asked for', px + pw / 2 + (Math.abs(mx - (px + pw / 2)) < 60 ? (mx < px + pw / 2 ? 70 : -70) : 0), y2 + rb + 28, { size: 10, color: C.faint, align: 'center' });
        if (!m.ok) kit.label(c, 'setup fails: this chip allows ' + m.limit + ' bits at this frequency', M, H - 12, { size: 11, color: C.bad, weight: 600 });
        else kit.label(c, 'ledcAttach(pin, ' + kit.fmt(m.f, 3) + ', ' + m.bits + ') is accepted', M, H - 12, { size: 11, color: C.muted });
        // numbers
        ro.set('duty', m.duty + ' of ' + m.levels + '  (' + kit.fmt(m.frac * 100, 3) + ' %)');
        ro.set('avg', kit.fmt(3.3 * m.frac, 3) + ' V of 3.3 V');
        ro.set('seen', 'about ' + Math.round(m.seen * 100) + ' % bright (light ' + Math.round(m.frac * 100) + ' %)');
        ro.set('first', kit.fmt(m.first * 100, 2) + ' % bright');
        ro.set('max', m.limit + ' bits' + (m.limit < m.cap ? ' (clock-limited)' : ' (timer-limited)'));
        ro.set('flicker', m.f < 100 ? 'visible flicker' : m.f < 1000 ? 'steady to the eye; camera bands likely' : m.f < 20000 ? 'steady to eyes and cameras' : 'steady (nothing gained above 20 kHz)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ oa-rgb-mixing */
  Hyper.sim('oa-rgb-mixing', {
    title: 'RGB mixing: duty, gamma and resistors',
    blurb: `Three duty values make a colour. The left swatch is the colour you **asked for**; the right one is what the LED would **show**, computed from the light each duty produces. The three traces are the PWM signals, and the table gives the resistor each colour needs.

**Try this**
- Switch **gamma correction** off: the right swatch turns paler and brighter than the left, especially for dark and mixed colours.
- Make the colour dark, say (40, 20, 10), with gamma on. The duty values are tiny: the dark end is where the number of bits matters.
- Tick **common anode**: the traces invert, and a duty of zero would mean full on.
- Change the supply to **3.3 V** and look at the green and blue resistors: about 20 Ω, and a swing of about three to one in current if the LED's forward voltage is only 0.1 V off.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 390, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'r', label: 'Red', min: 0, max: 255, step: 1, value: 255 },
        { id: 'g', label: 'Green', min: 0, max: 255, step: 1, value: 120 },
        { id: 'b', label: 'Blue', min: 0, max: 255, step: 1, value: 20 },
        { id: 'gamma', type: 'check', label: 'Gamma correction on each channel', value: true },
        { id: 'anode', type: 'check', label: 'Common-anode LED (duty is inverted)', value: false },
        { id: 'vs', type: 'select', label: 'Supply for the LED', options: [['3.3 V pin', 3.3], ['5 V with a transistor per colour', 5]], value: 5 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['hex', 'Asked for'], ['duty', 'Duty (R, G, B)'], ['i', 'Total LED current'], ['look', 'The LED looks']]);
      const NAMES = ['Red', 'Green', 'Blue'], HUES = [4, 140, 232], VF = [2.0, 3.1, 3.1], I0 = 10;   // typical forward voltages; 10 mA per colour at full duty
      const BITS = 10, LV = Math.pow(2, BITS) - 1;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12, v = ctl.values;
        const asked = [v.r, v.g, v.b].map(x => Math.round(x));
        const duty = asked.map(x => Math.round((v.gamma ? Math.pow(x / 255, GAM) : x / 255) * LV) / LV);
        const show = duty.map(d => 255 * toScreen(d));
        // swatches
        const sw = (W - 3 * M) / 2, sy = 24, sh = clamp(H * 0.24, 70, 130);
        kit.label(c, 'You asked for', M, 11, { size: 11.5, weight: 650, color: C.text2 });
        kit.label(c, 'The LED shows', M * 2 + sw, 11, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = rgbCss(asked[0], asked[1], asked[2]); c.fillRect(M, sy, sw, sh);
        c.fillStyle = rgbCss(show[0], show[1], show[2]); c.fillRect(M * 2 + sw, sy, sw, sh);
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(M + 0.5, sy + 0.5, sw - 1, sh - 1); c.strokeRect(M * 2 + sw + 0.5, sy + 0.5, sw - 1, sh - 1);
        // the three PWM traces
        const ty0 = sy + sh + 30, th = clamp(H * 0.065, 18, 30), gap = 12, px = M + 40, pw = W - px - 78;
        kit.label(c, 'PWM on the three pins' + (v.anode ? ' (inverted for a common anode)' : ''), M, ty0 - 14, { size: 11, weight: 650, color: C.text2 });
        for (let i = 0; i < 3; i++) {
          const y = ty0 + i * (th + gap);
          const d = duty[i], T = 1, t1 = 3;
          let edges = d <= 0 ? [[0, 0]] : d >= 1 ? [[0, 1]] : windowEdges(S.pwmEdges(1 / T, d, 0, t1, 0), 0, t1);
          if (v.anode) edges = edges.map(e => [e[0], 1 - e[1]]);
          S.wave(c, px, y, pw, th, edges, { t0: 0, t1, color: kit.hue(HUES[i]), label: NAMES[i][0], fill: true });
          kit.label(c, 'duty ' + Math.round(d * 100) + ' %', px + pw + 8, y + th / 2, { size: 10.5, color: C.text2 });
        }
        // the resistors
        const ry = ty0 + 3 * (th + gap) + 8, cwid = (W - 2 * M - 16) / 3, vs = v.vs;
        let iTotal = 0;
        for (let i = 0; i < 3; i++) {
          const x = M + i * (cwid + 8), head = vs - VF[i], R = head / (I0 / 1000), Rn = E.eSeries(R, 'E12') || R;
          const inom = head / Rn * 1000, ilo = (head - 0.1) / Rn * 1000, ihi = (head + 0.1) / Rn * 1000;
          iTotal += duty[i] * inom;
          const wide = ihi / Math.max(0.01, ilo) > 1.5 || ilo < 1;
          S.box(c, x, ry, cwid, 82, { color: kit.hue(HUES[i]), label: null });
          kit.label(c, NAMES[i], x + 8, ry + 12, { size: 11.5, weight: 650, color: kit.hue(HUES[i]) });
          kit.label(c, 'Vf ' + kit.fmt(VF[i], 2) + ' V · R ' + kit.fmt(Rn, 3) + ' Ω', x + 8, ry + 29, { size: 10.5, color: C.text });
          kit.label(c, 'headroom ' + kit.fmt(head, 2) + ' V', x + 8, ry + 44, { size: 10.5, color: C.muted });
          kit.label(c, 'if Vf is ±0.1 V:', x + 8, ry + 59, { size: 10, color: C.muted });
          kit.label(c, kit.fmt(Math.max(0, ilo), 2) + ' to ' + kit.fmt(ihi, 2) + ' mA', x + 8, ry + 73, { size: 10.5, color: wide ? C.bad : C.ok, weight: 600 });
        }
        ro.set('hex', '#' + asked.map(x => x.toString(16).toUpperCase().padStart(2, '0')).join('') + '  (' + asked.join(', ') + ')');
        ro.set('duty', duty.map(d => Math.round(d * 100) + ' %').join(', '));
        ro.set('i', kit.fmt(iTotal, 3) + ' mA');
        const lum = x => Math.max(...x) / 255;
        ro.set('look', v.gamma ? 'as asked' : lum(show) - lum(asked) > 0.05 ? 'paler and brighter than asked' : 'close to what was asked');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ oa-pixel-strip */
  Hyper.sim('oa-pixel-strip', {
    title: 'Addressable LEDs: the stream, the frame and the current',
    blurb: `The pixels are drawn with the light they would give. The trace is the data wire for the **first pixels**: 24 bits each, green first, with the byte values decoded. A 0 is a short high pulse (about 0.4 µs), a 1 a long one (about 0.8 µs), 1.25 µs per bit. The bar at the bottom is the current of the whole strip on a scale of amperes.

**Try this**
- Choose **Everything white** at brightness 255 and add pixels: 60 pixels take about 3.7 A, and the frame time and the refresh rate follow the count.
- Lower the **brightness** to 20: the current drops, and the data values are small numbers: only 21 levels per colour are left.
- Choose **One red pixel moving**: the strip takes the same few milliamps whatever its length, but the frame time still grows with the length.
- Raise the count to 1000: the strip can be refreshed only about 30 times a second.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 400, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Pixels', min: 1, max: 1000, value: 60, log: true, sig: 3 },
        { id: 'pat', type: 'select', label: 'Pattern', options: [['Everything white', 'white'], ['Rainbow', 'rainbow'], ['One red pixel moving', 'chase'], ['Dim blue sky', 'sky']], value: 'white' },
        { id: 'br', label: 'Brightness (setBrightness)', min: 0, max: 255, step: 1, value: 255 }
      ], () => {});
      const ro = kit.readout(box.side, [['frame', 'One frame on the wire'], ['rate', 'Fastest refresh'], ['i', 'Strip current'], ['p', 'Power at 5 V'], ['lev', 'Levels per colour'], ['bytes', 'Data per frame']]);
      const colourOf = (pat, k, n, t) => {
        if (pat === 'white') return [255, 255, 255];
        if (pat === 'rainbow') return hueRgb((k / n) * 360 + t * 40);
        if (pat === 'chase') return Math.floor(t * 6) % Math.min(n, 24) === k ? [255, 0, 0] : [0, 0, 0];
        return [10, 30, 120];
      };
      const scale = (x, b) => (b >= 255 ? x : Math.floor(x * (b + 1) / 256));    // what setBrightness does to a value
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12, v = ctl.values;
        const n = Math.max(1, Math.round(v.n)), pat = v.pat, b = Math.round(v.br);
        const px = (k, tt) => colourOf(pat, k, n, tt).map(x => scale(x, b));
        // the pixels
        const r = 7, step = 2 * r + 4.9, count = Math.max(1, Math.min(n, Math.floor((W - 2 * M) / step)));
        kit.label(c, 'The first ' + count + ' of ' + n + ' pixels, as they light', M, 11, { size: 11.5, weight: 650, color: C.text2 });
        const shown = []; for (let k = 0; k < count; k++) shown.push(px(k, t).map(x => 255 * toScreen(x / 255)));
        S.pixels(c, M, 24, shown, { r });
        // the data wire
        const ly = 24 + 2 * r + 30, lh = clamp(H * 0.3, 96, 170), nb = W >= 520 ? 2 : 1;
        kit.label(c, 'Data wire: the first ' + nb + (nb > 1 ? ' pixels' : ' pixel') + ' of the frame', M, ly - 10, { size: 11.5, weight: 650, color: C.text2 });
        const sig = E.proto.ws2812(Array.from({ length: nb }, (_, k) => px(k, t)));
        const tEnd = nb * 24 * 1.25e-6;
        S.logic(c, M, ly, W - 2 * M, lh, [{ label: 'DIN', edges: windowEdges(sig.edges, 0, tEnd), marks: sig.marks, color: C.accent }], { t0: 0, t1: tEnd, unit: 'µs', grid: nb * 8 });
        // the current, on a log scale of amperes
        let mA = 0;
        for (let k = 0; k < n; k++) { const q = px(k, t); mA += (q[0] + q[1] + q[2]) / 255 * 20 + 1; }
        const A = mA / 1000, by = ly + lh + 36, bx = M + 4, bw = W - bx - M - 4, X = a => bx + (Math.log10(clamp(a, 0.01, 30)) + 2) / 3.4772 * bw;
        kit.label(c, 'Current of the whole strip: ' + kit.fmt(A, 3) + ' A', M, by - 14, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(bx, by, bw, 14);
        c.fillStyle = A > 20 ? C.bad : A > 2 ? C.warn : C.ok; c.fillRect(bx, by, Math.max(2, X(A) - bx), 14);
        [[0.5, 'USB port'], [2, '2 A'], [5, '5 A'], [10, '10 A'], [20, '20 A']].forEach(([a, lab]) => {
          c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.moveTo(X(a), by - 3); c.lineTo(X(a), by + 17); c.stroke();
          kit.label(c, lab, X(a), by + 28, { size: 10, color: C.muted, align: 'center' });
        });
        // numbers
        const frame = n * 24 * 1.25e-6 + 50e-6;
        ro.set('frame', fmtT(kit, frame));
        ro.set('rate', kit.fmt(1 / frame, 3) + ' a second');
        ro.set('i', kit.fmt(A, 3) + ' A');
        ro.set('p', kit.fmt(A * 5, 3) + ' W');
        ro.set('lev', (b >= 255 ? 256 : b + 1) + ' (of 256)');
        ro.set('bytes', 3 * n + ' bytes');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ oa-strip-drop */
  /* the rail voltage at every pixel of a strip: n nodes joined by a loop resistance r (ohms), a load current i (amperes) at each,
     the supply vs fed through 5 mΩ at the nodes in `feeds` — a tridiagonal system, solved by the Thomas algorithm */
  function stripVoltages(n, i, r, feeds, vs) {
    const g = 1 / r, gf = 1 / 0.005, a = new Array(n), b = new Array(n), cc = new Array(n), d = new Array(n);
    for (let k = 0; k < n; k++) {
      const left = k > 0 ? g : 0, right = k < n - 1 ? g : 0, f = feeds.has(k) ? gf : 0;
      a[k] = -left; cc[k] = -right; b[k] = left + right + f; d[k] = f * vs - i;
    }
    for (let k = 1; k < n; k++) { const w = a[k] / b[k - 1]; b[k] -= w * cc[k - 1]; d[k] -= w * d[k - 1]; }
    const v = new Array(n);
    v[n - 1] = d[n - 1] / b[n - 1];
    for (let k = n - 2; k >= 0; k--) v[k] = (d[k] - cc[k] * v[k + 1]) / b[k];
    return v;
  }
  /* what a white pixel looks like at a supply voltage: blue and green need the most, red the least (schematic thresholds) */
  function whiteAt(v) {
    return [clamp((v - 2.4) / 1.2, 0, 1), clamp((v - 3.0) / 1.2, 0, 1), clamp((v - 3.2) / 1.2, 0, 1)];
  }
  const lookWord = v => (v >= 4.4 ? 'white' : v >= 4.0 ? 'a warm white' : v >= 3.7 ? 'yellow' : v >= 3.5 ? 'orange and dim' : 'unreliable: under 3.5 V');

  Hyper.sim('oa-strip-drop', {
    title: 'The voltage along an LED strip',
    blurb: `Every pixel of the strip is set to **white**. Current enters at the feed points and flows through the thin copper of the strip, so the voltage falls with the distance from the nearest feed. The coloured band shows what a white pixel would look like at each place; the graph shows the voltage. The model is a ladder of resistors solved exactly; the colour thresholds are **schematic**, since real parts differ.

**Try this**
- Leave 300 pixels at full white and **one end only**: the far end falls under 3.5 V, where the pixels stop working.
- Lower the **brightness** to 50 %: the drop halves and the far end comes back to a warm white.
- Choose **both ends**: the weakest point moves to the middle and the drop falls to about a quarter.
- Try **every 100 pixels**, then raise the rail resistance to see how much copper the strip really has.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 380, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Pixels', min: 20, max: 600, step: 10, value: 300 },
        { id: 'br', label: 'Brightness (all white)', min: 5, max: 100, step: 5, value: 100, unit: '%' },
        { id: 'rp', label: 'Rail resistance per pixel (both rails)', min: 0.1, max: 2, step: 0.05, value: 0.6, unit: 'mΩ' },
        { id: 'feed', type: 'select', label: 'Where power is fed in', options: [['one end only', 'one'], ['both ends', 'both'], ['start, middle and end', 'three'], ['every 100 pixels', 'every']], value: 'one' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['i', 'Strip current'], ['vmin', 'Lowest voltage'], ['where', 'At pixel'], ['look', 'White there looks'], ['loss', 'Drop at the worst pixel']]);
      const VS = 5;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12, v = ctl.values;
        const n = Math.round(v.n), perPixel = v.br / 100 * 0.06 + 0.001, I = n * perPixel;
        const feeds = new Set([0]);
        if (v.feed === 'both' || v.feed === 'three' || v.feed === 'every') feeds.add(n - 1);
        if (v.feed === 'three') feeds.add(Math.round((n - 1) / 2));
        if (v.feed === 'every') for (let k = 100; k < n - 1; k += 100) feeds.add(k);
        const volts = stripVoltages(n, perPixel, v.rp / 1000, feeds, VS);
        let vmin = VS, at = 0;
        volts.forEach((x, k) => { if (x < vmin) { vmin = x; at = k; } });
        // the colour band
        const px = M + 36, pw = W - px - M, sy = 26, sh = 26;
        kit.label(c, 'What white looks like along the strip', M, 11, { size: 11.5, weight: 650, color: C.text2 });
        const cols = Math.max(20, Math.floor(pw / 3)), cw = pw / cols;
        for (let q = 0; q < cols; q++) {
          const k = Math.round(q / (cols - 1) * (n - 1)), f = whiteAt(volts[k]).map(x => 255 * toScreen(x));
          c.fillStyle = rgbCss(f[0], f[1], f[2]); c.fillRect(px + q * cw, sy, Math.ceil(cw), sh);
          if (volts[k] < 3.5) { c.fillStyle = 'rgba(229,72,77,.55)'; c.fillRect(px + q * cw, sy + sh - 5, Math.ceil(cw), 5); }
        }
        c.strokeStyle = C.axis; c.lineWidth = 1; c.strokeRect(px + 0.5, sy + 0.5, pw - 1, sh - 1);
        const X = k => px + k / Math.max(1, n - 1) * pw;
        feeds.forEach(k => {
          c.fillStyle = C.accent; c.beginPath(); c.moveTo(X(k), sy + sh + 2); c.lineTo(X(k) - 5, sy + sh + 10); c.lineTo(X(k) + 5, sy + sh + 10); c.closePath(); c.fill();
        });
        kit.label(c, 'power fed in at the triangles', M, sy + sh + 24, { size: 10, color: C.accent });
        // the graph
        const gy = sy + sh + 44, gh = clamp(H - gy - 54, 110, 300), ymin = vmin < 3 ? 2 : 3, ymax = 5.2;
        const Y = q => gy + gh - (clamp(q, ymin, ymax) - ymin) / (ymax - ymin) * gh;
        c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.03)'; c.fillRect(px, gy, pw, gh);
        for (let q = Math.ceil(ymin * 2) / 2; q <= ymax; q += 0.5) {
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(px, Y(q)); c.lineTo(px + pw, Y(q)); c.stroke();
          kit.label(c, kit.fmt(q, 2) + ' V', px - 6, Y(q), { size: 9.5, color: C.faint, align: 'right' });
        }
        const guide = (q, text, colour) => {
          c.save(); c.strokeStyle = colour; c.lineWidth = 1.4; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(px, Y(q)); c.lineTo(px + pw, Y(q)); c.stroke(); c.restore();
          kit.label(c, text, px + pw - 4, Y(q) - 7, { size: 10, color: colour, align: 'right' });
        };
        guide(4.4, 'white starts to turn warm', C.warn);
        guide(3.5, 'pixel logic fails below 3.5 V', C.bad);
        const m = Math.min(n, Math.floor(pw / 2));
        c.beginPath();
        for (let q = 0; q < m; q++) { const k = Math.round(q / (m - 1) * (n - 1)); q ? c.lineTo(px + q / (m - 1) * pw, Y(volts[k])) : c.moveTo(px, Y(volts[k])); }
        c.strokeStyle = kit.hue(200); c.lineWidth = 2.4; c.lineJoin = 'round'; c.stroke();
        feeds.forEach(k => { c.strokeStyle = C.accent; c.lineWidth = 1; c.globalAlpha = 0.5; c.beginPath(); c.moveTo(X(k), gy); c.lineTo(X(k), gy + gh); c.stroke(); c.globalAlpha = 1; });
        kit.dot(c, X(at), Y(vmin), 4.5, vmin < 3.5 ? C.bad : C.accent);
        kit.label(c, 'pixel 1', px, gy + gh + 12, { size: 10, color: C.faint });
        kit.label(c, 'pixel ' + n, px + pw, gy + gh + 12, { size: 10, color: C.faint, align: 'right' });
        kit.label(c, 'position along the strip', px + pw / 2, gy + gh + 12, { size: 10, color: C.faint, align: 'center' });
        kit.label(c, 'Voltage at each pixel', M, gy - 10, { size: 11.5, weight: 650, color: C.text2 });
        ro.set('i', kit.fmt(I, 3) + ' A  (' + kit.fmt(I * VS, 3) + ' W)');
        ro.set('vmin', kit.fmt(vmin, 3) + ' V');
        ro.set('where', String(at + 1));
        ro.set('look', lookWord(vmin));
        ro.set('loss', kit.fmt(VS - vmin, 2) + ' V');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ oa-tone-wave */
  Hyper.sim('oa-tone-wave', {
    title: 'A note on a buzzer',
    blurb: `The top trace is the signal on the pin. Below it, the first twelve **harmonics** of that square wave, and then what the buzzer actually **radiates**: the harmonics multiplied by the buzzer's response. A piezo disc has a mechanical resonance, so it is loud near 3 kHz and weak far from it. The response curves are typical shapes, not a particular part.

**Try this**
- Play **440 Hz** at 50 % duty: only the odd harmonics (440, 1320, 2200 Hz …) are present, with strengths 1, 1/3, 1/5 …
- Change the duty to **25 %**: the fundamental falls, the even harmonics appear, and the sound gets thinner.
- Move the frequency to **3 kHz** on the piezo: the radiated level rises, the loudest it can be.
- Switch to the **active buzzer**: the pin carries only a steady level and the buzzer's own oscillator makes the 2.7 kHz tone.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 390, maxH: 580 });
      const ctl = kit.controls(box.side, [
        { id: 'kind', type: 'select', label: 'Buzzer', options: [['Passive piezo disc (resonance 3 kHz)', 'piezo'], ['Passive magnetic transducer', 'magnetic'], ['Active buzzer (own oscillator, 2.7 kHz)', 'active']], value: 'piezo' },
        { id: 'f', label: 'Frequency on the pin', min: 50, max: 6000, value: 440, unit: 'Hz', log: true, sig: 3 },
        { id: 'duty', label: 'Duty cycle', min: 5, max: 95, step: 5, value: 50, unit: '%' }
      ], id => { if (id === 'kind') vis(); loop.once(); });
      const vis = () => { const a = ctl.values.kind === 'active'; ctl.show('f', !a); ctl.show('duty', !a); };
      vis();
      const ro = kit.readout(box.side, [['note', 'Nearest note'], ['T', 'Period'], ['fund', 'Fundamental, against 50 % duty'], ['level', 'Radiated level'], ['note2', 'Note']]);
      const NOTES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
      const noteOf = f => { const m = 69 + 12 * Math.log(f / 440) / Math.LN2, n = Math.round(m); return { name: NOTES[((n % 12) + 12) % 12] + (Math.floor(n / 12) - 1), cents: Math.round((m - n) * 100) }; };
      const resp = (kind, f) => (kind === 'magnetic' ? 1 / Math.sqrt(1 + Math.pow(150 / f, 4)) : 1 / Math.sqrt(1 + 9 * Math.pow(f / 3000 - 3000 / f, 2)));
      const REF = 2 / Math.PI;                          // the fundamental of a 50 % square wave, the strongest a square wave can give
      const hz = f => (f >= 1000 ? kit.fmt(f / 1000, 2) + 'k' : String(Math.round(f)));
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12, v = ctl.values, active = v.kind === 'active';
        const f0 = active ? 2700 : v.f, D = active ? 0.5 : v.duty / 100, kind = v.kind;
        const px = M + 40, pw = W - px - (W >= 520 ? 60 : M);
        // the signal on the pin
        kit.label(c, active ? 'On the pin: a steady level; inside: the oscillator' : 'The signal on the pin (three periods)', M, 11, { size: 11.5, weight: 650, color: C.text2 });
        const wy = 26, wh = clamp(H * 0.1, 30, 50), T = 1 / f0, t1 = 3 * T;
        const edges = active ? [[0, 1]] : windowEdges(S.pwmEdges(f0, D, 0, t1, 0), 0, t1);
        S.wave(c, px, wy, pw, wh, edges, { t0: 0, t1, color: kit.hue(40), fill: true, label: 'pin' });
        if (active) { const e2 = windowEdges(S.pwmEdges(f0, 0.5, 0, t1, 0), 0, t1); S.wave(c, px, wy + wh + 8, pw, wh * 0.6, e2, { t0: 0, t1, color: C.muted, label: 'inside' }); }
        if (W >= 520) S.buzzer(c, W - 30, wy + wh / 2, true, { r: 12, phase: t * 2 });
        // harmonics
        const nh = 12, by0 = wy + wh + (active ? wh * 0.6 + 8 : 0) + 52, bh = clamp(H * 0.14, 44, 86), slot = pw / nh;
        const amp = n => Math.abs(2 / (n * Math.PI) * Math.sin(n * Math.PI * D));
        const drawBars = (y, title, fn, colour) => {
          kit.label(c, title, M, y - 12, { size: 11.5, weight: 650, color: C.text2 });
          c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px, y + bh); c.lineTo(px + pw, y + bh); c.stroke();
          for (let n = 1; n <= nh; n++) {
            const fn_ = n * f0, a = fn_ > 20000 ? 0 : fn(n, fn_), h = clamp(a / (REF * 1.05), 0, 1) * bh, x = px + (n - 0.5) * slot;
            c.fillStyle = fn_ > 20000 ? C.faint : colour; c.globalAlpha = fn_ > 20000 ? 0.4 : 1;
            c.fillRect(x - slot * 0.32, y + bh - h, slot * 0.64, Math.max(h, a > 0 ? 1 : 0));
            c.globalAlpha = 1;
            kit.label(c, fn_ > 20000 ? '—' : hz(fn_), x, y + bh + 11, { size: 9, color: C.muted, align: 'center' });
          }
        };
        drawBars(by0, 'Harmonics of the signal (Hz)', n => amp(n), kit.hue(40));
        const ry = by0 + bh + 48;
        drawBars(ry, 'What the buzzer radiates', (n, fn_) => amp(n) * resp(kind, fn_), kit.hue(200));
        // the numbers
        let sum = 0;
        for (let n = 1; n <= nh; n++) if (n * f0 <= 20000) sum += Math.pow(amp(n) * resp(kind, n * f0), 2);
        const level = Math.sqrt(sum) / REF, db = level > 0.001 ? 20 * Math.log10(level) : -60;
        const nt = noteOf(f0);
        ro.set('note', nt.name + (nt.cents ? ' (' + (nt.cents > 0 ? '+' : '') + nt.cents + ' cents)' : ''));
        ro.set('T', fmtT(kit, T));
        ro.set('fund', Math.round(amp(1) / REF * 100) + ' %');
        ro.set('level', db <= -60 ? 'silent' : kit.fmt(db, 3) + ' dB (0 dB: piezo at resonance, 50 %)');
        ro.set('note2', active ? 'The pin only switches the oscillator on and off.' : kind === 'piezo' ? 'Loud near 3 kHz, weak far from it.' : 'Flat above a few hundred hertz.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ oa-flyback */
  const wrapText = (s, n) => {
    const out = []; let line = '';
    for (const w of s.split(' ')) { if ((line + ' ' + w).trim().length > n) { out.push(line); line = w; } else line = (line + ' ' + w).trim(); }
    if (line) out.push(line);
    return out;
  };
  const VBR = 40, VD = 0.7, VZ = 12;          // the MOSFET's breakdown voltage, the diode drop, the Zener voltage (schematic round numbers)
  const COILS = { relay: { R: 200, L: 0.4 }, valve: { R: 30, L: 0.06 }, pump: { R: 8, L: 0.003 } };

  Hyper.sim('oa-flyback', {
    title: 'Switching off a coil: the flyback diode',
    blurb: `The MOSFET turns off at **t = 0**. The coil's current cannot stop at once: it flows on, and the drain voltage goes wherever it must for that to happen. The model is **schematic**: a coil with its resistance and inductance, a 40 V MOSFET that goes into breakdown (avalanche) at 40 V, an ideal diode of 0.7 V and a 12 V Zener. Real spikes depend on stray capacitance and on the part, and many small MOSFETs are not rated to survive avalanche at all.

**Try this**
- With **no protection** look at the drain trace: it jumps to the breakdown voltage for a moment, and the MOSFET absorbs more energy than the coil stored.
- Add **a diode**: the drain stays 0.7 V above the supply, and the current dies away slowly, in a few time constants.
- Add the **Zener**: the release is much quicker, at the price of a higher drain voltage (the supply plus 12.7 V).
- Choose the **small pump** and raise the supply to 24 V: the Zener's 12.7 V plus 24 V is still under 40 V. Pick the **relay coil** to see how little energy a small coil holds.`,
    mount(box, kit) {
      const S = kit.esym, SC = kit.schem;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 430, maxH: 620 });
      const ctl = kit.controls(box.side, [
        { id: 'load', type: 'select', label: 'Load', options: [['Relay coil (200 Ω, 400 mH)', 'relay'], ['Solenoid valve (30 Ω, 60 mH)', 'valve'], ['Small DC pump (8 Ω, 3 mH)', 'pump']], value: 'valve' },
        { id: 'V', label: 'Supply', min: 5, max: 24, step: 1, value: 12, unit: 'V' },
        { id: 'prot', type: 'select', label: 'Across the coil', options: [['nothing', 'none'], ['a diode', 'diode'], ['a diode and a 12 V Zener', 'zener']], value: 'none' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['E', 'Energy stored in the coil'], ['peak', 'Peak drain voltage'], ['t10', 'Current down to 10 % after'], ['mos', 'Energy the MOSFET absorbs'], ['why', 'What happens']]);
      function model() {
        const v = ctl.values, P = COILS[v.load], V = v.V, R = P.R, L = P.L, I0 = V / R, tau = L / R;
        const Vc = v.prot === 'diode' ? VD : v.prot === 'zener' ? VD + VZ : 0;
        const E = 0.5 * L * I0 * I0;
        let i, vd, tEnd, t10, mos, peak, why;
        if (!Vc) {                                  // no path: the drain rises to breakdown and the current falls linearly
          const slope = (VBR - V) / L;
          tEnd = I0 / slope; t10 = 0.9 * tEnd;
          i = t => (t < 0 ? I0 : t < tEnd ? I0 - slope * t : 0);
          vd = t => (t < 0 ? 0.05 : t < tEnd ? VBR : V);
          mos = E * VBR / (VBR - V); peak = VBR;
          why = 'The current has nowhere to go: the drain climbs until the MOSFET breaks down, at ' + VBR + ' V here, and the part absorbs the energy. Small MOSFETs are not made for it.';
        } else {                                    // the current circulates through the diode (and Zener): di/dt = -(R i + Vc)/L
          tEnd = tau * Math.log(1 + I0 * R / Vc);
          i = t => (t < 0 ? I0 : t < tEnd ? (I0 + Vc / R) * Math.exp(-t / tau) - Vc / R : 0);
          vd = t => (t < 0 ? 0.05 : t < tEnd ? V + Vc : V);
          t10 = Math.min(tEnd, tau * Math.log((I0 + Vc / R) / (0.1 * I0 + Vc / R)));
          mos = 0; peak = V + Vc;
          why = v.prot === 'diode' ? 'The diode carries the current round the coil. The drain stays 0.7 V above the supply, and the coil lets go slowly.' : 'The Zener lets the voltage across the coil rise to 12.7 V, so the current dies faster: a quicker release, and the MOSFET sees the supply plus 12.7 V.';
        }
        return { V, R, L, I0, tau, E, i, vd, tEnd, t10, mos, peak, why, Vc };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12, m = model(), v = ctl.values;
        // the circuit
        const xc = M + 56, xd = xc + 58, xn = M + 214, ytop = 34, ynode = 94;
        SC.rail(c, xc, 22, '+' + m.V + ' V');
        SC.wire(c, [[xc, 22], [xc, ytop]]);
        SC.inductor(c, xc, ytop, xc, ynode, { label: 'coil' });
        SC.node(c, xc, ynode);
        if (m.Vc) {
          SC.wire(c, [[xc, ytop], [xd, ytop]]); SC.wire(c, [[xc, ynode], [xd, ynode]]);
          if (v.prot === 'diode') SC.diode(c, xd, ynode, xd, ytop, { kind: 'diode' });
          else { SC.diode(c, xd, ynode, xd, ynode - 26, { kind: 'diode' }); SC.wire(c, [[xd, ynode - 26], [xd, ytop + 26]]); SC.diode(c, xd, ytop, xd, ytop + 26, { kind: 'zener' }); }
          SC.node(c, xc, ytop); SC.node(c, xd, ynode);
        }
        const yn = ynode + 40, pins = SC.nmos(c, xn, yn, { labels: false });
        SC.wire(c, [[xc, ynode], [xc, pins.d[1]], [pins.d[0], pins.d[1]]]);
        SC.wire(c, [pins.s, [pins.s[0], pins.s[1] + 6]]); SC.ground(c, pins.s[0], pins.s[1] + 6);
        kit.label(c, 'gate', pins.g[0] - 4, pins.g[1], { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'drain', pins.d[0] + 10, pins.d[1] - 2, { size: 10.5, color: C.muted, align: 'left' });
        if (m.Vc) kit.label(c, v.prot === 'diode' ? 'flyback diode' : 'diode + Zener', xd + 12, (ytop + ynode) / 2, { size: 10.5, color: C.muted, align: 'left' });
        // the three traces
        const y0 = pins.s[1] + 30, th = clamp((H - y0 - 54) / 3 - 18, 34, 80), px = M + 46, pw = W - px - M, t0 = -m.tau, t1 = 5 * m.tau;
        const X = t => px + (t - t0) / (t1 - t0) * pw;
        S.wave(c, px, y0, pw, th, [[t0, 1], [0, 0]], { t0, t1, label: 'gate', color: C.muted });
        const y1 = y0 + th + 20, y2 = y1 + th + 20;
        kit.label(c, 'coil current, ' + kit.fmt(m.I0 * 1000, 3) + ' mA before switch-off', px, y1 - 6, { size: 10, color: C.muted, align: 'left' });
        S.analog(c, px, y1, pw, th, m.i, { t0, t1, min: 0, max: m.I0 * 1.15, steps: 480, color: kit.hue(150), label: 'coil' });
        kit.label(c, 'voltage at the drain', px, y2 - 6, { size: 10, color: C.muted, align: 'left' });
        const an = S.analog(c, px, y2, pw, th, m.vd, { t0, t1, min: 0, max: 46, steps: 480, color: kit.hue(20), label: 'drain' });
        const guide = (q, text, colour) => {
          c.save(); c.strokeStyle = colour; c.lineWidth = 1.2; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(px, an.Y(q)); c.lineTo(px + pw, an.Y(q)); c.stroke(); c.restore();
          kit.label(c, text, px + pw - 2, an.Y(q) - 6, { size: 9.5, color: colour, align: 'right' });
        };
        guide(VBR, 'MOSFET breakdown ' + VBR + ' V', C.bad);
        guide(m.V, 'supply ' + m.V + ' V', C.faint);
        c.save(); c.strokeStyle = C.axis; c.lineWidth = 1; c.setLineDash([3, 4]); c.beginPath(); c.moveTo(X(0), y0 - 4); c.lineTo(X(0), y2 + th + 4); c.stroke(); c.restore();
        kit.label(c, 't = 0: the gate turns off', X(0) + 5, y2 + th + 14, { size: 10, color: C.muted, align: 'left' });
        kit.label(c, kit.fmt(t1 * 1e3, 3) + ' ms', px + pw, y2 + th + 14, { size: 10, color: C.faint, align: 'right' });
        kit.label(c, kit.fmt(t0 * 1e3, 3) + ' ms', px, y2 + th + 14, { size: 10, color: C.faint, align: 'left' });
        ro.set('E', kit.fmt(m.E * 1e3, 3) + ' mJ');
        ro.set('peak', kit.fmt(m.peak, 3) + ' V' + (m.Vc ? '' : ' (breakdown)'));
        ro.set('t10', kit.fmt(m.t10 * 1e3, 3) + ' ms');
        ro.set('mos', m.mos ? kit.fmt(m.mos * 1e3, 3) + ' mJ in avalanche' : 'none: the diode takes it');
        ro.set('why', m.why);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ oa-fan-tach */
  Hyper.sim('oa-fan-tach', {
    title: 'A four-wire fan: control and tach',
    blurb: `The **control** wire gets PWM; the **tach** wire gives two pulses for each turn of the fan. The fan on the left turns at the real speed slowed down 30 times. The curve shows speed and power against duty: the power follows the **cube** of the speed. The fan's response here is a typical shape (a minimum speed of a fifth of the maximum), not a particular fan.

**Try this**
- Drag the **duty** from 100 % to 50 %: the speed falls to 60 %, the power to about a fifth.
- Read the pulses **counted in one second**: the program's reading is a multiple of 30 rpm, because a one-second window sees whole pulses only.
- Choose **1 kHz** or **100 Hz** for the PWM: outside the specification the fan may hum or follow the signal badly.
- Set the fan to **stop at 0 %** and watch the tach go quiet, which is what a program must treat as a stall if it is not expected.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 420, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'duty', label: 'PWM duty on the control wire', min: 0, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'fc', type: 'select', label: 'PWM frequency', options: [['100 Hz', 100], ['1 kHz', 1000], ['25 kHz (the specification)', 25000]], value: 25000 },
        { id: 'zero', type: 'select', label: 'The fan at 0 % duty', options: [['keeps a minimum speed', 'min'], ['stops', 'stop']], value: 'min' },
        { id: 'rmax', label: 'Speed at 100 %', min: 800, max: 3000, step: 50, value: 1500, unit: 'rpm' }
      ], () => {});
      const ro = kit.readout(box.side, [['rpm', 'Speed'], ['f', 'Tach frequency'], ['count', 'Counted in one second'], ['air', 'Airflow, against 100 %'], ['p', 'Power (3 W at full speed)'], ['sig', 'Control signal']]);
      let ang = 0;
      const speedAt = (d, rmax, zero) => (d > 0 ? rmax * (0.2 + 0.8 * d) : zero === 'min' ? rmax * 0.2 : 0);
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12, v = ctl.values;
        const d = v.duty / 100, rpm = speedAt(d, v.rmax, v.zero), f = 2 * rpm / 60, spec = v.fc >= 21000 && v.fc <= 28000;
        ang += dt * (rpm / 60) * 2 * Math.PI / 30;
        // the fan and its wires
        const fh = clamp(H * 0.27, 96, 150), r = fh / 2 - 8, cx = M + r + 8, cy = 24 + fh / 2;
        c.save();
        c.beginPath(); c.arc(cx, cy, r + 5, 0, 2 * Math.PI); c.strokeStyle = C.axis; c.lineWidth = 3; c.stroke();
        for (let k = 0; k < 7; k++) {
          const a = ang + k * 2 * Math.PI / 7;
          c.beginPath(); c.moveTo(cx, cy); c.arc(cx, cy, r, a, a + 0.62); c.closePath();
          c.fillStyle = C.dark ? 'rgba(190,200,240,.55)' : 'rgba(60,80,140,.45)'; c.fill();
        }
        c.beginPath(); c.arc(cx, cy, r * 0.22, 0, 2 * Math.PI); c.fillStyle = C.text2 || C.text; c.fill();
        c.restore();
        kit.label(c, 'slowed down 30 ×', cx, cy + r + 18, { size: 10, color: C.faint, align: 'center' });
        const wx = cx + r + 34;
        [['#222', 'ground'], ['#e0b82a', '+12 V'], ['#2eaa63', 'tach (from the fan)'], ['#3a6fd8', 'control (to the fan)']].forEach(([col, name], k) => {
          kit.dot(c, wx, 38 + k * 22, 5, col, C.axis);
          kit.label(c, (k + 1) + '  ' + name, wx + 12, 38 + k * 22, { size: 11, color: C.text2, align: 'left' });
        });
        // the traces
        const ty = 24 + fh + 30, th = clamp(H * 0.07, 22, 38), px = M + 46, pw = W - px - M;
        const Tc = 1 / v.fc, t1c = 3 * Tc;
        const ce = d <= 0 ? [[0, 0]] : d >= 1 ? [[0, 1]] : windowEdges(S.pwmEdges(v.fc, d, 0, t1c, 0), 0, t1c);
        S.wave(c, px, ty, pw, th, ce, { t0: 0, t1: t1c, color: kit.hue(232), label: 'control', fill: true });
        kit.label(c, 'three periods: ' + fmtT(kit, t1c), px, ty - 8, { size: 10, color: C.muted, align: 'left' });
        const ty2 = ty + th + 28, TW = 0.1;
        const te = f > 0 ? windowEdges(S.pwmEdges(f, 0.5, 0, TW, 0), 0, TW) : [[0, 1]];
        S.wave(c, px, ty2, pw, th, te, { t0: 0, t1: TW, color: kit.hue(150), label: 'tach' });
        kit.label(c, '100 ms · open collector, pulled up to 3.3 V', px, ty2 - 8, { size: 10, color: C.muted, align: 'left' });
        // speed and power against duty
        const cy0 = ty2 + th + 30, ch = Math.max(66, H - cy0 - 30), cw = pw;
        kit.label(c, 'Speed and power against duty', M, cy0 - 12, { size: 11, weight: 650, color: C.text2 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.03)'; c.fillRect(px, cy0, cw, ch);
        const CX = q => px + q * cw, CY = q => cy0 + ch - q * ch;
        const curve = (fn, col, dash) => { c.save(); c.beginPath(); for (let k = 0; k <= 100; k++) { const q = k / 100, y = fn(q); k ? c.lineTo(CX(q), CY(y)) : c.moveTo(CX(q), CY(y)); } c.strokeStyle = col; c.lineWidth = 2; if (dash) c.setLineDash([5, 4]); c.stroke(); c.restore(); };
        curve(q => speedAt(q, 1, v.zero), C.accent, false);
        curve(q => Math.pow(speedAt(q, 1, v.zero), 3), C.warn, true);
        const sNow = rpm / v.rmax;
        kit.dot(c, CX(d), CY(sNow), 4.5, C.accent); kit.dot(c, CX(d), CY(Math.pow(sNow, 3)), 4.5, C.warn);
        kit.label(c, 'speed', CX(0.97), CY(1) + 10, { size: 10, color: C.accent, align: 'right' });
        kit.label(c, 'power (speed cubed)', CX(0.97), CY(Math.pow(0.85, 3)) + 14, { size: 10, color: C.warn, align: 'right' });
        kit.label(c, '0 %', px, cy0 + ch + 12, { size: 10, color: C.faint, align: 'left' });
        kit.label(c, '100 % duty', px + cw, cy0 + ch + 12, { size: 10, color: C.faint, align: 'right' });
        const pulses = Math.floor(f);
        ro.set('rpm', Math.round(rpm) + ' rpm');
        ro.set('f', kit.fmt(f, 3) + ' Hz  (two pulses a turn)');
        ro.set('count', f > 0 ? pulses + ' pulses = ' + pulses * 30 + ' rpm (±30)' : 'no pulses: a stalled fan');
        ro.set('air', Math.round(sNow * 100) + ' %');
        ro.set('p', kit.fmt(3 * Math.pow(sNow, 3), 2) + ' W');
        ro.set('sig', spec ? 'inside the specification (about 25 kHz)' : 'outside the specification: may hum or be ignored');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ oa-heater-window */
  Hyper.sim('oa-heater-window', {
    title: 'Time-proportioning a heater',
    blurb: `The upper trace is the heater, on for the fraction **duty** of every **window** and off for the rest. The lower trace is the temperature of the thing it heats, a first-order model with a thermal **time constant**: it warms during the on-time and cools during the off-time. The ripple is the temperature difference between the end of the on-time and the end of the off-time.

**Try this**
- Set a **window of 2 s** and a time constant of 60 s: the ripple is a fraction of a degree. Raise the window to 30 s, then to 120 s: the temperature saw-tooths.
- With a **window of 30 s** and a time constant of 10 s the load follows every on-off step: a heater with little thermal mass needs short windows.
- Choose **Warm-up from cold** to see the temperature climb towards the average and the window ripple on top of it.
- Read **a mechanical relay's life**: a window of 2 s uses up 100 000 cycles in a couple of days.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 380, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'duty', label: 'Power (duty of the window)', min: 0, max: 100, step: 1, value: 30, unit: '%' },
        { id: 'win', label: 'Window', min: 0.2, max: 120, value: 2, unit: 's', log: true, sig: 2 },
        { id: 'tau', label: 'Thermal time constant', min: 5, max: 600, value: 60, unit: 's', log: true, sig: 2 },
        { id: 'A', label: 'Temperature rise at full power', min: 50, max: 300, step: 5, value: 160, unit: '°C' },
        { id: 'mode', type: 'select', label: 'Show', options: [['the steady state', 'steady'], ['warm-up from cold', 'warm']], value: 'steady' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['pw', 'Average power (a 100 W heater)'], ['tavg', 'Average temperature'], ['rip', 'Ripple, peak to peak'], ['ratio', 'Window against time constant'], ['relay', 'A relay good for 100 000 cycles']]);
      const TA = 22;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12, v = ctl.values;
        const D = clamp(v.duty / 100, 0, 1), Wn = v.win, tau = v.tau, A = v.A;
        const a = Math.exp(-D * Wn / tau), b = Math.exp(-(1 - D) * Wn / tau);
        const x0 = D <= 0 ? 0 : D >= 1 ? A : A * b * (1 - a) / (1 - a * b);          // the temperature rise at the start of a window, in the steady state
        const ripple = D <= 0 || D >= 1 ? 0 : A * (1 - a) * (1 - b) / (1 - a * b);
        const warm = v.mode === 'warm', span = warm ? Math.max(5 * tau, 3 * Wn) : 6 * Wn;
        const xs = warm ? 0 : x0, rate = a * b;
        const xAt = t => {
          const k = Math.floor(t / Wn), u = t - k * Wn, xk = x0 + (xs - x0) * Math.pow(rate, k);
          if (D <= 0) return xs * Math.exp(-t / tau);
          if (u < D * Wn) return A + (xk - A) * Math.exp(-u / tau);
          return (A + (xk - A) * a) * Math.exp(-(u - D * Wn) / tau);
        };
        const px = M + 40, pw = W - px - M;
        kit.label(c, 'The heater: on for ' + Math.round(D * 100) + ' % of each ' + fmtT(kit, Wn) + ' window', M, 11, { size: 11.5, weight: 650, color: C.text2 });
        const hy = 26, hh = clamp(H * 0.1, 26, 44), windows = Math.ceil(span / Wn);
        if (windows <= 250) {
          const edges = [];
          for (let k = 0; k < windows; k++) { if (D > 0) edges.push([k * Wn, 1]); if (D < 1) edges.push([k * Wn + D * Wn, 0]); }
          S.wave(c, px, hy, pw, hh, windowEdges(edges.length ? edges : [[0, D >= 1 ? 1 : 0]], 0, span), { t0: 0, t1: span, color: kit.hue(20), fill: true, label: 'heater' });
        } else {
          c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(px, hy, pw, hh);
          c.fillStyle = kit.hue(20, 0.5); c.fillRect(px, hy + hh * (1 - D), pw, hh * D);
          kit.label(c, 'many windows: the fill is the duty', px + pw / 2, hy + hh / 2, { size: 10.5, color: C.text2, align: 'center' });
        }
        const gy = hy + hh + 44, gh = Math.max(110, H - gy - 56), tmin = TA, tmax = TA + A * 1.04;
        kit.label(c, 'Temperature of the heated thing', M, gy - 12, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.03)'; c.fillRect(px, gy, pw, gh);
        const an = S.analog(c, px, gy, pw, gh, t => TA + xAt(t), { t0: 0, t1: span, min: tmin, max: tmax, steps: Math.min(1200, Math.max(120, Math.round(pw * 1.5))), color: kit.hue(200), width: 2 });
        const avg = TA + A * D;
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.3; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(px, an.Y(avg)); c.lineTo(px + pw, an.Y(avg)); c.stroke(); c.restore();
        kit.label(c, 'average ' + Math.round(avg) + ' °C', px + pw - 3, an.Y(avg) - 7, { size: 10, color: C.warn, align: 'right' });
        for (const q of [TA, TA + A / 2, TA + A]) kit.label(c, Math.round(q) + ' °C', px - 6, an.Y(q), { size: 9.5, color: C.faint, align: 'right' });
        kit.label(c, '0', px, gy + gh + 12, { size: 10, color: C.faint, align: 'left' });
        kit.label(c, fmtT(kit, span), px + pw, gy + gh + 12, { size: 10, color: C.faint, align: 'right' });
        const cyc = D > 0 && D < 1 ? 3600 / Wn : 0, days = cyc ? 100000 / cyc / 24 : Infinity;
        ro.set('pw', kit.fmt(D * 100, 3) + ' W');
        ro.set('tavg', kit.fmt(avg, 3) + ' °C');
        ro.set('rip', kit.fmt(ripple, 2) + ' °C' + (ripple > 0.1 * A ? '  (large)' : ''));
        ro.set('ratio', kit.fmt(Wn / tau, 2) + (Wn > tau ? ' (the load follows each step)' : Wn < tau / 10 ? ' (well smoothed)' : ''));
        ro.set('relay', cyc ? (days < 365 ? kit.fmt(days, 3) + ' days' : kit.fmt(days / 365, 3) + ' years') : 'no switching at all');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ oa-ir-burst */
  Hyper.sim('oa-ir-burst', {
    title: 'An infrared remote code',
    blurb: `The top trace is what the LED does; the lower one is the answer of a **receiver module** tuned to 38 kHz (low during a mark). In the *whole frame* view the carrier is too fast to show, so a mark is drawn as a block. The other two views zoom in: *the first bits* shows that the **length of the space** carries the bit, and *the carrier* shows the 38 kHz bursts at one third duty.

**Try this**
- Change the **command**: the bytes and the pattern of long and short spaces change, and the frame length stays about the same, because every byte is followed by its inverse.
- In the *first bits* view find the address byte: a short space is a 0, a long space is a 1, and the least significant bit comes first.
- In the *carrier* view see that the receiver needs about ten cycles of carrier before its output drops.
- Set the **carrier** to 36 or 40 kHz: a receiver tuned to 38 kHz hears it poorly and the range falls.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 480 });
      const ctl = kit.controls(box.side, [
        { id: 'addr', label: 'Address', min: 0, max: 255, step: 1, value: 0 },
        { id: 'cmd', label: 'Command', min: 0, max: 255, step: 1, value: 69 },
        { id: 'view', type: 'select', label: 'View', options: [['the whole frame', 'frame'], ['the first bits (zoom)', 'bits'], ['the carrier (zoom)', 'carrier']], value: 'frame' },
        { id: 'fc', type: 'select', label: 'Carrier of the sender', options: [['36 kHz', 36000], ['38 kHz', 38000], ['40 kHz', 40000]], value: 38000 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['len', 'Frame length'], ['bytes', 'The four bytes'], ['ones', 'Ones and zeros'], ['avg', 'Average LED current (100 mA in a mark)'], ['rx', 'A 38 kHz receiver']]);
      const hex = x => '0x' + (x & 255).toString(16).toUpperCase().padStart(2, '0');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12, v = ctl.values;
        const addr = Math.round(v.addr) & 255, cmd = Math.round(v.cmd) & 255, fc = v.fc;
        const nec = E.proto.nec(addr, cmd), tFrame = nec.t1 - 1e-3, Tc = 1 / fc;
        let t0, t1, led, rx, marks = nec.marks.slice();
        const inv = e => e.map(q => [q[0], 1 - q[1]]);
        if (v.view === 'carrier') {
          t0 = -0.05e-3; t1 = 0.4e-3;
          const ed = [[t0, 0]];
          for (let k = 0; k * Tc < t1; k++) ed.push([k * Tc, 1], [k * Tc + Tc / 3, 0]);
          led = ed;
          rx = [[t0, 1], [10 * Tc, 0]];            // a receiver needs about ten cycles of carrier before its output answers
          marks = [{ t0: 0, t1: t1, text: 'start of the 9 ms leader' }];
        } else if (v.view === 'bits') {
          t0 = 13.3e-3; t1 = 13.3e-3 + 20e-3;
          led = nec.edges; rx = inv(nec.edges);
          marks = [];
          let t = 13.5e-3;
          for (let i = 0; i < 8; i++) { const bit = (addr >> i) & 1, len = bit ? 2.25e-3 : 1.125e-3; marks.push({ t0: t, t1: t + len, text: String(bit) }); t += len; }
        } else {
          t0 = 0; t1 = tFrame + 1e-3;
          led = nec.edges; rx = inv(nec.edges);
        }
        kit.label(c, v.view === 'frame' ? 'A whole NEC frame' : v.view === 'bits' ? 'The first byte, the address, least significant bit first' : 'The 38 kHz carrier at the start of the leader', M, 11, { size: 11.5, weight: 650, color: C.text2 });
        const lh = Math.min(H - 70, clamp(H * 0.62, 150, 260));
        S.logic(c, M, 22, W - 2 * M, lh, [
          { label: 'LED', edges: windowEdges(led, t0, t1), marks, color: kit.hue(20) },
          { label: 'receiver', edges: windowEdges(rx, t0, t1), color: kit.hue(150) }
        ], { t0, t1, unit: v.view === 'carrier' ? 'µs' : 'ms', grid: 10, labelW: 58 });
        const cap = v.view === 'frame' ? 'A mark is a burst of carrier; a space is darkness.' : v.view === 'bits' ? 'Every bit starts with a 560 µs mark; the space after it is 560 µs for a 0 and 1690 µs for a 1.' : 'About one third duty; the receiver output (low means light seen) drops after about ten cycles.';
        wrapText(cap, Math.max(30, Math.floor((W - 2 * M) / 5.8))).forEach((line, k) => kit.label(c, line, M, 22 + lh + 16 + k * 14, { size: 10.5, color: C.muted, align: 'left' }));
        const bytes = [addr, ~addr & 255, cmd, ~cmd & 255];
        let ones = 0; for (const b of bytes) for (let i = 0; i < 8; i++) ones += (b >> i) & 1;
        const markTime = 9e-3 + 33 * 560e-6, avg = 100 * (1 / 3) * markTime / tFrame, off = Math.abs(fc - 38000);
        ro.set('len', kit.fmt(tFrame * 1e3, 3) + ' ms');
        ro.set('bytes', bytes.map(hex).join('  '));
        ro.set('ones', ones + ' ones, ' + (32 - ones) + ' zeros');
        ro.set('avg', kit.fmt(avg, 2) + ' mA');
        ro.set('rx', off === 0 ? 'hears it well' : 'hears it poorly: the range falls');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
