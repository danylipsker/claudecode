/* HYPER-ESP32 · sims/audio.js
 *
 * Simulations of the topic "Audio" (topic code au):
 *
 *   au-sampling        a tone sampled at 8, 16 or 44.1 kHz: the Nyquist limit, the alias it folds to, an ideal anti-alias filter
 *   au-quantise        a sine rounded to 3 … 16 bits: the staircase, the error and the signal-to-noise ratio against 6.02 N + 1.76 dB
 *   au-i2s-mic         one I2S frame from a microphone: the L/R pin, the slot the ESP reads, and how small speech is in 24 bits
 *   au-pdm             a one-bit PDM stream made by a delta-sigma modulator and decoded by averaging, against the oversampling ratio
 *   au-amp             a class-D amplifier: gain, volume, supply and cable against clipping, power and the ESP's own rail
 *   au-buffer          a ring buffer between a stalling source and a steady speaker (params: source 'sd' | 'network')
 *   au-spectrum        a mixed signal and its FFT: block length, window and resolution (a small FFT lives in this file)
 *   au-voice-pipeline  the voice-assistant chain stage by stage, where each runs, the delay and the data
 *                      (params: arch 'device' | 'satellite' | 'streaming')
 *
 * Numbers come from the arithmetic the pages quote; models that are schematic (the amplifier, the latencies) say so.
 */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const hzText = f => (f >= 1000 ? +(f / 1000).toPrecision(3) + ' kHz' : Math.round(f) + ' Hz');
  const secText = (kit, s) => (s >= 1 ? kit.fmt(s, 3) + ' s' : kit.fmt(s * 1000, 3) + ' ms');
  // a line of text that fits: shortens with an ellipsis when wider than maxW
  function fit(c, text, maxW, size, weight) {
    c.save(); c.font = (weight || 500) + ' ' + size + 'px sans-serif';
    let t = String(text);
    while (t.length > 3 && c.measureText(t).width > maxW) t = t.slice(0, -2);
    c.restore();
    return t === String(text) ? t : t.replace(/\s*$/, '') + '…';
  }
  // translucent fills for marks, readable on both themes
  const TINT = { grey: 'rgba(150,156,190,.34)', blue: 'rgba(123,140,255,.40)', green: 'rgba(34,179,122,.36)', amber: 'rgba(224,160,48,.42)', red: 'rgba(229,72,77,.45)' };

  /* ================================================================ au-sampling */
  Hyper.sim('au-sampling', {
    title: 'Sampling a tone, and aliasing',
    blurb: `A tone (blue) is measured at the dots. The dashed line is **the lowest-frequency wave that passes through the dots**: it is what the stream actually contains. Below half the sample rate (the Nyquist frequency) it lies on the blue wave. Above it the stream holds a **false lower tone**.

**Try this**
- At **8 kHz** sampling, move the tone from 1 kHz to 3 kHz: it stays true. Move it past 4 kHz and the alias appears at 8 kHz minus the tone.
- Set the tone to **7 kHz** at 8 kHz: the stream holds a 1 kHz wave, upside down. Nothing afterwards can tell it from a real 1 kHz tone.
- Tick **ideal anti-alias filter**: the tone above the limit is removed before sampling, and the stream is silent instead of wrong.
- At **44.1 kHz** a 14 kHz tone is far below the limit, with about three samples per cycle: enough, but barely.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 330, maxH: 470 });
      const ctl = kit.controls(box.side, [
        { id: 'f', label: 'Tone', min: 200, max: 14000, step: 50, value: 1000, unit: 'Hz', sig: 4 },
        { id: 'fs', type: 'select', label: 'Sample rate', options: [['8 kHz', 8000], ['16 kHz', 16000], ['44.1 kHz', 44100]], value: 8000 },
        { id: 'filt', type: 'check', label: 'Ideal anti-alias filter before the sampler', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['nyq', 'Nyquist limit'], ['has', 'The stream contains'], ['spc', 'Samples per cycle'], ['say', 'Verdict']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12;
        const f = ctl.values.f, fs = ctl.values.fs, nyq = fs / 2;
        const removed = ctl.values.filt && f > nyq, amp = removed ? 0 : 1;
        const k = Math.round(f / fs), d = f - k * fs;                 // the stream holds sin(2π d t): d is the signed alias
        const aliased = f > nyq && !removed;
        const T = 0.002;                                              // the window: 2 ms
        // the waves
        const px = M + 4, pw = W - 2 * M - 8, py = 30, ph = Math.max(110, H * 0.4);
        kit.label(c, 'The tone and its samples (2 ms)', px, 12, { size: 11.5, weight: 650, color: C.text2 });
        const X = t => px + t / T * pw, Y = v => py + ph / 2 - v * ph / 2 * 0.88;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(px, Y(0)); c.lineTo(px + pw, Y(0)); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = removed ? 1.2 : 2; c.globalAlpha = removed ? 0.35 : 1; c.beginPath();
        for (let i = 0; i <= pw; i++) { const t = i / pw * T, v = Math.sin(TAU * f * t); i ? c.lineTo(px + i, Y(v)) : c.moveTo(px + i, Y(v)); }
        c.stroke(); c.globalAlpha = 1;
        if (aliased) {
          c.strokeStyle = C.warn; c.lineWidth = 2; c.setLineDash([6, 4]); c.beginPath();
          for (let i = 0; i <= pw; i++) { const t = i / pw * T, v = Math.sin(TAU * d * t); i ? c.lineTo(px + i, Y(v)) : c.moveTo(px + i, Y(v)); }
          c.stroke(); c.setLineDash([]);
        }
        const dotR = fs > 20000 ? 2.4 : 3.6;
        for (let n = 0; n / fs <= T; n++) {
          const t = n / fs, v = amp * Math.sin(TAU * f * t), x = X(t);
          c.strokeStyle = C.muted; c.lineWidth = 1; c.beginPath(); c.moveTo(x, Y(0)); c.lineTo(x, Y(v)); c.stroke();
          kit.dot(c, x, Y(v), dotR, removed ? C.faint : C.text);
        }
        if (removed) kit.label(c, 'the filter removed this tone before sampling: the samples are all zero', px + pw / 2, py + 14, { size: 11, color: C.warn, align: 'center' });
        // the frequency axis
        const fmax = fs > 20000 ? 24000 : 16000, ay = py + ph + 64, ax = px + 6, aw = pw - 12;
        const FX = q => ax + clamp(q / fmax, 0, 1) * aw;
        kit.label(c, 'Where the tone is, and where the stream says it is', px, ay - 34, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = C.dark ? 'rgba(229,72,77,.18)' : 'rgba(229,72,77,.12)';
        if (nyq < fmax) c.fillRect(FX(nyq), ay - 22, ax + aw - FX(nyq), 22);
        c.strokeStyle = C.axis; c.lineWidth = 1.2; c.beginPath(); c.moveTo(ax, ay); c.lineTo(ax + aw, ay); c.stroke();
        const step = fmax > 20000 ? 4000 : 2000;
        for (let q = 0; q <= fmax; q += step) { c.beginPath(); c.moveTo(FX(q), ay); c.lineTo(FX(q), ay + 5); c.stroke(); kit.label(c, q / 1000 + 'k', FX(q), ay + 15, { size: 10, color: C.muted, align: 'center' }); }
        c.strokeStyle = C.ok; c.lineWidth = 1.5; c.setLineDash([4, 3]); c.beginPath(); c.moveTo(FX(nyq), ay - 26); c.lineTo(FX(nyq), ay + 4); c.stroke(); c.setLineDash([]);
        kit.label(c, 'fs/2', FX(nyq), ay - 30, { size: 10.5, color: C.ok, align: 'center', weight: 600 });
        if (!removed) kit.arrow(c, FX(f), ay - 2, FX(f), ay - 22, C.accent, 2.5);
        if (aliased) kit.arrow(c, FX(Math.abs(d)), ay - 2, FX(Math.abs(d)), ay - 22, C.warn, 2.5);
        const lx = f > fmax * 0.7 ? 'right' : 'left';
        if (!removed) kit.label(c, hzText(f), FX(f) + (lx === 'left' ? 6 : -6), ay - 14, { size: 10.5, color: C.accent, align: lx });
        if (aliased) kit.label(c, 'alias ' + hzText(Math.abs(d)), FX(Math.abs(d)) + 6, ay - 14, { size: 10.5, color: C.warn });
        // the numbers
        ro.set('nyq', hzText(nyq));
        ro.set('has', removed ? 'nothing (filtered out)' : hzText(Math.abs(d)) + (d < 0 ? ', upside down' : ''));
        ro.set('spc', kit.fmt(fs / f, 3));
        ro.set('say', removed ? 'A filter must remove what is above the limit before sampling.' : aliased ? 'Aliased: a false ' + hzText(Math.abs(d)) + ' tone.' : f > nyq * 0.9 ? 'Just inside the limit: a real filter would already attenuate it.' : 'True: below the Nyquist limit.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ au-quantise */
  Hyper.sim('au-quantise', {
    title: 'Rounding to N bits',
    blurb: `A sine is rounded to the nearest of 2^N levels. The stairs (green) follow the wave (blue); the **error** under them is the quantisation noise. The signal-to-noise ratio is measured here over thousands of samples and compared with the textbook figure $6.02N + 1.76$ dB, which holds for a **full-scale** sine.

**Try this**
- Go from **4 bits** to **8** to **16**: each bit adds about 6 dB, and the stairs vanish into the line.
- Lower the **level** to 10 %: the signal uses fewer of the levels, and the SNR falls by the same 20 dB. This is why recordings should use the whole range, and why a quiet microphone needs gain.
- Raise the level to 100 %: the top of the wave touches the largest code and the SNR comes close to the formula.
- Watch the error: it looks like noise, not like the wave. That is why 16-bit audio is hiss-free to the ear.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 340, maxH: 480 });
      const ctl = kit.controls(box.side, [
        { id: 'bits', type: 'select', label: 'Bits per sample', options: [['3 bits', 3], ['4 bits', 4], ['6 bits', 6], ['8 bits', 8], ['12 bits', 12], ['16 bits', 16]], value: 4 },
        { id: 'lvl', label: 'Signal level', min: 1, max: 100, step: 1, value: 90, unit: '% of full scale' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['lev', 'Levels'], ['step', 'Step'], ['snr', 'SNR, measured'], ['th', 'SNR, 6.02 N + 1.76 − level loss'], ['mem', 'One second at 16 kHz mono']]);
      const code = (x, half) => clamp(Math.round(x * half), -half, half - 1) / half;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12;
        const N = ctl.values.bits, half = Math.pow(2, N - 1), A = ctl.values.lvl / 100;
        const px = M + 4, pw = W - 2 * M - 8, py = 28, ph = Math.max(120, H * 0.42), SPC = 48, cycles = 2;
        kit.label(c, 'The wave and the nearest levels (' + SPC + ' samples per cycle)', px, 12, { size: 11.5, weight: 650, color: C.text2 });
        const Y = v => py + ph / 2 - v * ph / 2 * 0.95;
        // level lines when there are few
        if (N <= 6) { c.strokeStyle = C.grid; c.lineWidth = 1; for (let k = -half; k < half; k++) { const y = Y(k / half); c.beginPath(); c.moveTo(px, y); c.lineTo(px + pw, y); c.stroke(); } }
        else { c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(px, Y(0)); c.lineTo(px + pw, Y(0)); c.stroke(); }
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= pw; i++) { const v = A * Math.sin(TAU * cycles * i / pw); i ? c.lineTo(px + i, Y(v)) : c.moveTo(px + i, Y(v)); }
        c.stroke();
        const n = SPC * cycles, dx = pw / n;
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i < n; i++) {
          const q = code(A * Math.sin(TAU * i / SPC), half), x0 = px + i * dx;
          i ? c.lineTo(x0, Y(q)) : c.moveTo(x0, Y(q)); c.lineTo(x0 + dx, Y(q));
        }
        c.stroke();
        // the error, magnified so that it can be seen: one step is a fixed height
        const ey = py + ph + 40, eh = Math.max(46, H * 0.16), step = 1 / half;
        kit.label(c, 'The error (rounded − true), drawn between ± one step', px, ey - 12, { size: 11.5, weight: 650, color: C.text2 });
        c.strokeStyle = C.grid; c.beginPath(); c.moveTo(px, ey + eh / 2); c.lineTo(px + pw, ey + eh / 2); c.stroke();
        c.strokeStyle = C.bad; c.lineWidth = 1.6; c.beginPath();
        for (let i = 0; i <= pw; i++) {
          const x = A * Math.sin(TAU * cycles * i / pw), e = (code(x, half) - x) / step;
          const y = ey + eh / 2 - clamp(e, -1, 1) * eh / 2;
          i ? c.lineTo(px + i, y) : c.moveTo(px + i, y);
        }
        c.stroke();
        // measured SNR over many samples at an irrational frequency
        let ps = 0, pe = 0; const K = 8192;
        for (let i = 0; i < K; i++) { const x = A * Math.sin(TAU * 0.0123456789 * i), e = code(x, half) - x; ps += x * x; pe += e * e; }
        const snr = pe > 0 ? 10 * Math.log10(ps / pe) : 99, th = 6.02 * N + 1.76 + 20 * Math.log10(A);
        ro.set('lev', Math.pow(2, N).toLocaleString('en') + ' (codes ' + (-half) + ' … ' + (half - 1) + ')');
        ro.set('step', kit.fmt(100 / half, 3) + ' % of full scale');
        ro.set('snr', kit.fmt(snr, 3) + ' dB');
        ro.set('th', kit.fmt(th, 3) + ' dB');
        ro.set('mem', kit.fmt(16000 * N / 8 / 1000, 3) + ' kB (' + kit.fmt(16 * N, 3) + ' kbit/s)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ au-i2s-mic */
  const hexN = (v, n) => (v >>> 0).toString(16).toUpperCase().padStart(n, '0');
  Hyper.sim('au-i2s-mic', {
    title: 'One frame from an I2S microphone',
    blurb: `BCLK, WS and the microphone's data line for one stereo frame with 32-bit slots. The microphone answers **only in the slot its L/R pin chooses**; in the other slot its data pin is released (high-impedance, drawn flat). The 24-bit sample is **most significant bit first, one clock after the WS edge**, followed by eight zeros.

**Try this**
- Tie **L/R to 3.3 V** while the program reads the **left slot**: every sample is zero, and nothing reports an error. The classic "my microphone is dead".
- Set the program to read **both slots**: one slot has the sound, the other zeros.
- Move the sound to **60 dB SPL** (speech at about a metre): the amplitude is only about a thousandth of full scale, and the top bits of the word stay zero. That is the right level, not a fault.
- Raise it to **120 dB SPL**: the microphone's limit, full scale.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 410, maxH: 580 });
      const ctl = kit.controls(box.side, [
        { id: 'lr', type: 'select', label: 'Microphone L/R pin', options: [['tied to GND: left slot', 'L'], ['tied to 3.3 V: right slot', 'R']], value: 'L' },
        { id: 'rd', type: 'select', label: 'The program reads', options: [['the left slot (mono)', 'L'], ['the right slot (mono)', 'R'], ['both slots (stereo)', 'B']], value: 'L' },
        { id: 'spl', label: 'Sound at the microphone', min: 30, max: 120, step: 1, value: 66, unit: 'dB SPL' }
      ], () => {});
      const ro = kit.readout(box.side, [['lvl', 'Level in the samples'], ['cnt', 'Amplitude, 24-bit counts'], ['pct', 'Share of full scale'], ['rx', 'The ESP receives']]);
      let phase = 0;
      const tb = 1 / (16000 * 64);                      // one BCLK period at 16 kHz with 32-bit slots
      const loop = kit.loop(dt => {
        phase += dt * TAU * 1.2;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 8;
        const spl = ctl.values.spl, dbfs = spl - 94 - 26;        // -26 dBFS at 94 dB SPL, the usual MEMS figure
        const frac = Math.min(1, Math.pow(10, dbfs / 20));
        const v = Math.round(frac * Math.sin(phase) * 8388607);
        const u24 = v < 0 ? v + 16777216 : v, word = ((u24 << 8) >>> 0);
        const ms = ctl.values.lr === 'L' ? 0 : 1, s0 = ms * 32 + 1;
        // the three traces
        const bclk = [[0, 0]];
        for (let k = 0; k < 64; k++) bclk.push([k * tb + tb / 2, 1], [(k + 1) * tb, 0]);
        const ws = [[0, 0], [32 * tb, 1]];
        const dataAt = k => (k >= s0 && k < s0 + 24 ? (u24 >> (23 - (k - s0))) & 1 : 0);
        const sd = [[0, dataAt(0)]];
        let last = dataAt(0);
        for (let k = 1; k <= 64; k++) { const d = dataAt(k); if (d !== last) { sd.push([k * tb, d]); last = d; } }
        const a = x => x * tb;
        const sdMarks = ms === 0
          ? [{ t0: a(1), t1: a(25), text: 'sample ' + hexN(u24, 6), color: TINT.green }, { t0: a(25), t1: a(33), text: '0s', color: TINT.grey }, { t0: a(33), t1: a(64), text: 'released (high-Z)', color: TINT.amber }]
          : [{ t0: a(0), t1: a(33), text: 'released (high-Z)', color: TINT.amber }, { t0: a(33), t1: a(57), text: 'sample ' + hexN(u24, 6), color: TINT.green }, { t0: a(57), t1: a(64), text: '0s', color: TINT.grey }];
        const lh = clamp(H * 0.42, 150, 240);
        S.logic(c, M, 4, W - 2 * M, lh, [
          { label: 'BCLK', edges: bclk, color: C.text2 },
          { label: 'WS', edges: ws, marks: [{ t0: 0, t1: a(32), text: 'left slot', color: TINT.blue }, { t0: a(32), t1: a(64), text: 'right slot', color: TINT.green }] },
          { label: 'SD', edges: sd, marks: sdMarks }
        ], { t0: 0, t1: 64 * tb, labelW: 40, grid: 8 });
        // what the ESP reads
        const reads = ctl.values.rd, got = ch => (ch === ms ? word : 0);
        const words = reads === 'B' ? [['left slot', 0], ['right slot', 1]] : [[reads === 'L' ? 'left slot' : 'right slot', reads === 'L' ? 0 : 1]];
        const cell = clamp((W - 2 * M - 14) / 16, 9, 19);
        let y = lh + 24;
        kit.label(c, 'The 32-bit word the ESP gets (upper half, then lower half)', M + 2, y - 6, { size: 11, color: C.text2, weight: 650 });
        y += 8;
        let allZero = true;
        words.forEach(w => {
          const val = got(w[1]);
          if (val !== 0) allZero = false;
          kit.label(c, w[0] + (val === 0 ? ': all zeros' : ': the last eight bits are padding'), M + 2, y + 6, { size: 10.5, color: C.muted });
          S.bits(c, M + 2, y + 14, (val >>> 16) >>> 0, { n: 16, cell, color: C.accent });
          S.bits(c, M + 2, y + 14 + cell + 3, val & 0xFFFF, { n: 16, cell, color: C.accent, hi: [8, 9, 10, 11, 12, 13, 14, 15] });
          y += 14 + 2 * cell + 16;
        });
        const read24 = words.map(w => got(w[1]) | 0).map(x => x >> 8);
        ro.set('lvl', kit.fmt(spl, 3) + ' dB SPL = ' + kit.fmt(dbfs, 3) + ' dBFS' + (dbfs >= 0 ? ' (at the limit)' : ''));
        ro.set('cnt', Math.round(frac * 8388607).toLocaleString('en'));
        ro.set('pct', frac >= 0.1 ? kit.fmt(frac * 100, 3) + ' %' : kit.fmt(frac * 100, 2) + ' % (about 1 in ' + Math.round(1 / frac) + ')');
        ro.set('rx', allZero ? 'zeros only: the microphone speaks in the other slot' : words.length > 1 ? 'one slot with sound, the other zeros' : 'samples, now ' + read24[0].toLocaleString('en'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ au-pdm */
  Hyper.sim('au-pdm', {
    title: 'A one-bit PDM stream, and getting the sound back',
    blurb: `A **delta-sigma modulator** turns the signal into one bit per clock: the **density of ones** follows the wave (top: the signal; middle: the stream, one cycle drawn as black ticks for ones). Averaging the bits over a short window, a **decimation filter**, gives the sound back (bottom, green, over the true wave in blue). The picture is one cycle of a 1 kHz tone at a 16 kHz output rate, so 64 times oversampling means a 1.024 MHz clock.

**Try this**
- Raise the **oversampling ratio** from 8 to 128: the stream gets denser and the decoded wave closes on the true one; the SNR rises by roughly 9 dB per doubling.
- Look at the **zoom**: at the positive peak the stream is nearly all ones; at zero it alternates 1 and 0.
- Switch to **two averages in a row**: smoother, with more delay and less leftover noise.
- Set the level to **0 %**: the stream is a pure 1010 pattern, half ones, which decodes to silence.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 420, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'osr', type: 'select', label: 'Oversampling ratio', options: [['8 × (128 kHz clock)', 8], ['16 ×', 16], ['32 ×', 32], ['64 × (1.024 MHz clock)', 64], ['128 ×', 128]], value: 64 },
        { id: 'amp', label: 'Signal level', min: 0, max: 100, step: 1, value: 70, unit: '%' },
        { id: 'filt', type: 'select', label: 'Decimation filter', options: [['one moving average', 1], ['two averages in a row', 2]], value: 1 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['clk', 'PDM clock'], ['ones', 'Ones in the cycle'], ['snr', 'Decoded SNR'], ['bits', 'Bits per output sample']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12;
        const osr = ctl.values.osr, A = ctl.values.amp / 100, stages = ctl.values.filt, SPC = 16, L = SPC * osr;
        // modulate three cycles (-1 … 2): a first-order delta-sigma modulator
        const total = 3 * L, y = new Int8Array(total), x = j => A * Math.sin(TAU * (j - L) / L);
        let acc = 0, prev = -1;
        for (let j = 0; j < total; j++) { acc += x(j) - prev; prev = acc >= 0 ? 1 : -1; y[j] = prev; }
        // moving averages of length osr, aligned for their delay
        const boxcar = src => { const out = new Float64Array(total); let s = 0; for (let j = 0; j < total; j++) { s += src[j]; if (j >= osr) s -= src[j - osr]; out[j] = s / osr; } return out; };
        let f1 = boxcar(y); if (stages === 2) f1 = boxcar(f1);
        const shift = Math.round(stages * (osr - 1) / 2);
        const dec = j => f1[Math.min(total - 1, j + L + shift)];     // the decoded value at display position j (0 … L)
        // layout
        const px = M + 4, pw = W - 2 * M - 8, rowH = Math.max(52, H * 0.15);
        const X = j => px + j / L * pw;
        let ty = 18;
        kit.label(c, 'The signal: one cycle', px, ty - 6, { size: 11.5, weight: 650, color: C.text2 });
        const Yv = (v, y0, h) => y0 + h / 2 - v * h / 2 * 0.9;
        c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= pw; i++) { const v = A * Math.sin(TAU * i / pw), yy = Yv(v, ty, rowH); i ? c.lineTo(px + i, yy) : c.moveTo(px + i, yy); }
        c.stroke();
        ty += rowH + 24;
        kit.label(c, 'The PDM stream: a black tick is a one', px, ty - 6, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(px, ty, pw, rowH * 0.55);
        c.fillStyle = C.text; let ones = 0;
        for (let j = 0; j < L; j++) { if (y[j + L] > 0) { ones++; c.fillRect(X(j), ty, Math.max(0.6, pw / L), rowH * 0.55); } }
        ty += rowH * 0.55 + 26;
        kit.label(c, 'After the averaging: the sound (green) against the true wave (blue)', px, ty - 6, { size: 11.5, weight: 650, color: C.text2 });
        c.strokeStyle = C.accent; c.lineWidth = 1.2; c.setLineDash([4, 3]); c.beginPath();
        for (let i = 0; i <= pw; i++) { const v = A * Math.sin(TAU * i / pw), yy = Yv(v, ty, rowH); i ? c.lineTo(px + i, yy) : c.moveTo(px + i, yy); }
        c.stroke(); c.setLineDash([]);
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath();
        for (let i = 0; i <= pw; i++) { const yy = Yv(dec(Math.min(L - 1, Math.round(i / pw * L))), ty, rowH); i ? c.lineTo(px + i, yy) : c.moveTo(px + i, yy); }
        c.stroke();
        ty += rowH + 26;
        // the zoom: 48 bits at the positive peak
        const zn = 48, z0 = Math.round(L / 4) - zn / 2, zw = pw / zn;
        kit.label(c, 'Zoom: ' + zn + ' bits at the positive peak', px, ty - 6, { size: 11.5, weight: 650, color: C.text2 });
        const zh = Math.min(22, Math.max(14, zw * 0.9));
        for (let k = 0; k < zn; k++) {
          const b = y[z0 + k + L] > 0, bx = px + k * zw;
          c.fillStyle = b ? C.text : (C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)');
          c.fillRect(bx + 0.5, ty, Math.max(1, zw - 1), zh);
        }
        // the numbers
        let ps = 0, pe = 0;
        for (let j = 0; j < L; j++) { const t = x(j + L), e = dec(j) - t; ps += t * t; pe += e * e; }
        const clk = 16000 * osr;
        ro.set('clk', clk >= 1e6 ? kit.fmt(clk / 1e6, 4) + ' MHz' : kit.fmt(clk / 1e3, 4) + ' kHz');
        ro.set('ones', kit.fmt(ones / L * 100, 3) + ' %');
        ro.set('snr', ps > 0 ? kit.fmt(10 * Math.log10(ps / Math.max(pe, 1e-12)), 3) + ' dB' : 'no signal');
        ro.set('bits', String(osr));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ au-amp */
  Hyper.sim('au-amp', {
    title: 'A class-D amplifier on a USB supply',
    blurb: `The digital volume and the amplifier's gain decide the **voltage the amplifier wants**; the supply, less the drop in the cable, decides the voltage it can give. Above that the wave **clips**. The model is **schematic**: 0 dBFS at the input is taken as 1 V peak before the gain, the output stage loses 0.3 V, and the cable carries the speaker's peak current. A real part has its own gain table and limits (see its datasheet).

**Try this**
- Start at 40 % volume: clean sound, a fraction of a watt, a small current.
- Raise the **volume** to 100 % with 15 dB of gain: the wave is clipped flat, a 4 Ω speaker on 5 V gets about three watts, and the current is over an ampere.
- Raise the **cable resistance** to 1.2 Ω at that setting: the rail sags, the amplifier clips earlier, and the ESP's regulator drops out.
- Choose **3.3 V shared with the ESP**: the amplifier's current peaks pull down the ESP's own rail below the brownout threshold.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 380, maxH: 540 });
      const ctl = kit.controls(box.side, [
        { id: 'vcc', type: 'select', label: 'Supply', options: [['5 V from USB (the ESP behind a regulator)', 5], ['3.3 V, shared with the ESP', 3.3]], value: 5 },
        { id: 'z', type: 'select', label: 'Speaker', options: [['4 Ω', 4], ['8 Ω', 8]], value: 4 },
        { id: 'g', type: 'select', label: 'Amplifier gain', options: [['3 dB', 3], ['6 dB', 6], ['9 dB', 9], ['12 dB', 12], ['15 dB', 15]], value: 9 },
        { id: 'vol', label: 'Volume (digital level)', min: 0, max: 100, step: 1, value: 40, unit: '%' },
        { id: 'rc', label: 'Cable and connector resistance', min: 0, max: 1.5, step: 0.05, value: 0.3, unit: 'Ω' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['want', 'Peak voltage wanted'], ['rail', 'Rail at the amplifier'], ['pw', 'Power in the speaker'], ['ip', 'Peak current'], ['clip', 'Clipping'], ['esp', 'The ESP']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12;
        const vcc = ctl.values.vcc, Z = ctl.values.z, g = ctl.values.g, rc = ctl.values.rc;
        const want = ctl.values.vol / 100 * Math.pow(10, g / 20);
        // the rail sags by the peak current through the cable: a few iterations settle it
        let vmax = vcc - 0.3, ipk = Math.min(want, vmax) / Z;
        for (let i = 0; i < 12; i++) { vmax = Math.max(0, vcc - ipk * rc - 0.3); ipk = Math.min(want, vmax) / Z; }
        const rail = vcc - ipk * rc, vpk = Math.min(want, vmax);
        // the waves
        const px = M + 24, pw = W - px - M - 4, py = 26, ph = Math.max(120, H * 0.4), vscale = Math.max(want, vcc, 1) * 1.08;
        kit.label(c, 'The output wave (two cycles)', M, 12, { size: 11.5, weight: 650, color: C.text2 });
        const Y = v => py + ph / 2 - v / vscale * ph / 2;
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(px, Y(0)); c.lineTo(px + pw, Y(0)); c.stroke();
        c.strokeStyle = C.bad; c.lineWidth = 1.2; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(px, Y(vmax)); c.lineTo(px + pw, Y(vmax)); c.moveTo(px, Y(-vmax)); c.lineTo(px + pw, Y(-vmax)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'most it can give: ±' + kit.fmt(vmax, 3) + ' V', px + pw - 2, Y(vmax) - 8, { size: 10, color: C.bad, align: 'right' });
        c.strokeStyle = C.faint; c.lineWidth = 1.2; c.setLineDash([3, 3]); c.beginPath();
        for (let i = 0; i <= pw; i++) { const v = want * Math.sin(TAU * 2 * i / pw); i ? c.lineTo(px + i, Y(v)) : c.moveTo(px + i, Y(v)); }
        c.stroke(); c.setLineDash([]);
        c.strokeStyle = vpk < want - 1e-6 ? C.warn : C.accent; c.lineWidth = 2.2; c.beginPath();
        let sumsq = 0, clipped = 0; const K = 400;
        for (let i = 0; i <= pw; i++) { const raw = want * Math.sin(TAU * 2 * i / pw), v = clamp(raw, -vmax, vmax); i ? c.lineTo(px + i, Y(v)) : c.moveTo(px + i, Y(v)); }
        c.stroke();
        for (let i = 0; i < K; i++) { const raw = want * Math.sin(TAU * i / K), v = clamp(raw, -vmax, vmax); sumsq += v * v; if (Math.abs(raw) > vmax + 1e-9) clipped++; }
        kit.label(c, 'V', M + 4, Y(0), { size: 10, color: C.muted });
        // the rail meter
        const my = py + ph + 46, mw = pw, VM = 5.6, mx = px;
        kit.label(c, 'The supply rail under load', M, my - 18, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(mx, my, mw, 16);
        const limit = vcc === 5 ? 3.6 : 2.5, bad = rail < limit;
        c.fillStyle = bad ? C.bad : rail < limit + 0.4 ? C.warn : C.ok; c.fillRect(mx, my, clamp(rail / VM, 0, 1) * mw, 16);
        c.strokeStyle = C.text; c.lineWidth = 1.5; c.beginPath(); c.moveTo(mx + limit / VM * mw, my - 4); c.lineTo(mx + limit / VM * mw, my + 20); c.stroke();
        kit.label(c, vcc === 5 ? 'regulator drops out at about 3.6 V' : 'ESP brownout at about 2.5 V', mx + limit / VM * mw + 4, my + 30, { size: 10, color: C.text2 });
        kit.label(c, kit.fmt(rail, 3) + ' V', mx + 4, my + 8, { size: 11, color: '#fff', weight: 650 });
        // the numbers
        const P = sumsq / K / Z, clipPct = clipped / K * 100;
        ro.set('want', kit.fmt(want, 3) + ' V (volume × gain)');
        ro.set('rail', kit.fmt(rail, 3) + ' V (' + kit.fmt(vcc, 2) + ' V less ' + kit.fmt(ipk * rc, 2) + ' V in the cable)');
        ro.set('pw', P >= 1 ? kit.fmt(P, 3) + ' W' : kit.fmt(P * 1000, 3) + ' mW');
        ro.set('ip', kit.fmt(ipk, 3) + ' A');
        ro.set('clip', clipPct < 0.5 ? 'none' : kit.fmt(clipPct, 2) + ' % of the wave is flat');
        ro.set('esp', bad ? (vcc === 5 ? 'its 3.3 V regulator drops out: the chip resets in time with the music' : 'below the brownout threshold: it resets') : rail < limit + 0.4 ? 'little margin left: a louder passage will reset it' : 'running normally');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ au-buffer */
  Hyper.sim('au-buffer', {
    title: 'A buffer between a stalling source and a steady speaker',
    blurb: `The speaker takes audio at a fixed rate. The source (an SD card, or the network) delivers it faster than that, **except during its pauses**. The buffer holds the audio in between. Green is the buffer's fill; amber bands are the source's pauses; a red gap in the strip below is silence, an **underrun**.

**Try this**
- With the **SD card** setting, raise the pause to 600 ms while the buffer stays at 250 ms: every pause now breaks the sound. Raise the buffer above the pause and the sound is whole again.
- Lower **source speed** to 100 % or less: after the first pause the buffer never refills, and the next one gets through only by luck.
- Raise **start playing at** to 100 %: a longer wait before the first sound, and the buffer begins full.
- With the **network** setting, a buffer of a few seconds rides over long Wi-Fi hiccups, at the price of a long start.`,
    mount(box, kit, params) {
      params = params || {};
      const net = params.source === 'network';
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 360, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'buf', label: 'Buffer', min: 50, max: 8000, value: net ? 3000 : 250, unit: 'ms of audio', log: true, sig: 3 },
        { id: 'rate', label: 'Source speed', min: 80, max: 150, step: 1, value: net ? 110 : 150, unit: '% of playback' },
        { id: 'stall', label: 'Pause of the source', min: 0, max: 3000, step: 50, value: net ? 1500 : 200, unit: 'ms' },
        { id: 'every', label: 'A pause every', min: 2, max: 20, step: 1, value: net ? 8 : 5, unit: 's' },
        { id: 'start', label: 'Start playing at', min: 10, max: 100, step: 5, value: 60, unit: '% full' },
        { id: 'speed', type: 'select', label: 'Simulation speed', options: [['real time', 1], ['4 ×', 4]], value: 4 },
        { type: 'buttons', items: [{ id: 'restart', label: 'Restart', primary: true }] }
      ], id => { if (id === 'restart') reset(); else if (!loop.running) loop.once(); });
      const ro = kit.readout(box.side, [['under', 'Underruns'], ['fill', 'Buffer now'], ['wait', 'Wait before the first sound'], ['ride', 'Rides out pauses up to'], ['ram', net ? 'RAM at 128 kbit/s MP3' : 'RAM at 44.1 kHz stereo WAV'], ['say', 'Verdict']]);
      const SPAN = 20, DT = 0.02;
      let t, fill, playing, under, started, hist, acc;
      function reset() { t = 0; fill = 0; playing = false; under = 0; started = false; hist = []; acc = 0; if (!loop.running) loop.once(); }
      function step(h) {
        const v = ctl.values, cap = v.buf / 1000, r = v.rate / 100, P = v.every, L = Math.min(v.stall / 1000, P * 0.9);
        const inStall = L > 0 && (t % P) >= P - L;
        if (!inStall) fill = Math.min(cap, fill + r * h);
        if (playing) { fill -= h; if (fill <= 0) { fill = 0; playing = false; under++; } }
        if (!playing && fill >= v.start / 100 * cap - 1e-9) { playing = true; started = true; }
        t += h;
        acc += h;
        while (acc >= DT) { acc -= DT; hist.push({ t, f: fill / cap, stall: inStall, silent: started && !playing, on: playing }); }
        while (hist.length > SPAN / DT + 4) hist.shift();
      }
      const loop = kit.loop(dt => {
        const sdt = dt * ctl.values.speed;
        for (let s = 0; s < 8; s++) step(sdt / 8);
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12, v = ctl.values, cap = v.buf / 1000;
        const px = M + 30, pw = W - px - M, py = 26, ph = Math.max(130, H * 0.5), t1 = t, t0 = t - SPAN;
        const X = tt => px + clamp((tt - t0) / SPAN, 0, 1) * pw, Y = f => py + ph - clamp(f, 0, 1) * ph;
        kit.label(c, 'Buffer fill, the last ' + SPAN + ' s', M, 12, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; c.fillRect(px, py, pw, ph);
        // pauses and silences as bands
        for (const h of hist) {
          const x = X(h.t - DT), w = Math.max(1, pw * DT / SPAN + 0.6);
          if (h.stall) { c.fillStyle = C.dark ? 'rgba(224,160,48,.22)' : 'rgba(224,160,48,.25)'; c.fillRect(x, py, w, ph); }
        }
        c.strokeStyle = C.grid; c.lineWidth = 1; c.setLineDash([3, 4]);
        c.beginPath(); c.moveTo(px, Y(v.start / 100)); c.lineTo(px + pw, Y(v.start / 100)); c.stroke(); c.setLineDash([]);
        kit.label(c, 'start level', px + 4, Y(v.start / 100) - 7, { size: 10, color: C.muted });
        c.strokeStyle = C.ok; c.lineWidth = 2; c.beginPath();
        let first = true;
        for (const h of hist) { const x = X(h.t), y = Y(h.f); if (first) { c.moveTo(x, y); first = false; } else c.lineTo(x, y); }
        c.stroke();
        for (const g of ['0 %', '50 %', '100 %']) { const f = g === '0 %' ? 0 : g === '50 %' ? 0.5 : 1; kit.label(c, g, px - 4, Y(f), { size: 9.5, color: C.muted, align: 'right' }); }
        // the sound out
        const sy = py + ph + 30, sh = 18;
        kit.label(c, 'The sound out', M, sy - 8, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; c.fillRect(px, sy, pw, sh);
        for (const h of hist) {
          const x = X(h.t - DT), w = Math.max(1, pw * DT / SPAN + 0.6);
          c.fillStyle = h.silent ? C.bad : h.on ? C.ok : C.faint;
          c.globalAlpha = h.silent ? 0.9 : 0.55; c.fillRect(x, sy, w, sh); c.globalAlpha = 1;
        }
        let ky = sy + sh + 22;
        const key = (col, text, kx) => { c.fillStyle = col; c.fillRect(kx, ky - 5, 12, 10); kit.label(c, text, kx + 17, ky, { size: 10.5, color: C.text2 }); return kx + 17 + text.length * 6.2 + 14; };
        let kx = px; kx = key('rgba(224,160,48,.5)', 'source paused', kx); kx = key(C.ok, 'sound playing', kx); key(C.bad, 'silence (underrun)', kx);
        // the numbers
        const bps = net ? 16000 : 176400, ride = cap * 1000;
        ro.set('under', String(under));
        ro.set('fill', Math.round(fill * 1000) + ' ms (' + Math.round(fill / cap * 100) + ' %)');
        ro.set('wait', kit.fmt(v.start / 100 * cap / (v.rate / 100), 3) + ' s');
        ro.set('ride', (ride >= 1000 ? kit.fmt(ride / 1000, 3) + ' s' : Math.round(ride) + ' ms') + ' (when full)');
        ro.set('ram', kit.fmt(cap * bps / 1000, 3) + ' kB');
        ro.set('say', v.stall > 0 && v.stall >= ride ? 'Every pause is longer than the buffer: dropouts.' : v.rate <= 100 ? 'The source is not faster than the speaker: the buffer cannot refill.' : under > 0 ? 'Some dropouts so far: the buffer is on the edge.' : 'The buffer hides the pauses.');
      }, box.stage);
      st.onResize(() => loop.once());
      reset();
      loop.start();
    }
  });

  /* ================================================================ au-spectrum */
  // an in-place radix-2 FFT (re, im: Float64Array of a power-of-two length)
  function fftInPlace(re, im) {
    const n = re.length;
    for (let i = 1, j = 0; i < n; i++) {
      let bit = n >> 1;
      for (; j & bit; bit >>= 1) j ^= bit;
      j ^= bit;
      if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
    }
    for (let len = 2; len <= n; len <<= 1) {
      const ang = -TAU / len;
      for (let i = 0; i < n; i += len) {
        for (let k = 0; k < len / 2; k++) {
          const wr = Math.cos(ang * k), wi = Math.sin(ang * k), a = i + k, b = i + k + len / 2;
          const xr = re[b] * wr - im[b] * wi, xi = re[b] * wi + im[b] * wr;
          re[b] = re[a] - xr; im[b] = im[a] - xi; re[a] += xr; im[a] += xi;
        }
      }
    }
  }
  Hyper.sim('au-spectrum', {
    title: 'A mixed signal and its FFT',
    blurb: `Two tones and a little noise, sampled at 8 kHz, and the spectrum of one block of them. Each bar is a **bin**, $f_s / N$ wide; the bin number times that width is its frequency. Small triangles mark where the tones really are.

**Try this**
- Set **tone A to 437.5 Hz** (bin 14 of 256 exactly) with no window: a clean spike. Move it to **450 Hz** and the energy **leaks** into the neighbouring bins.
- Switch to the **Hann window**: leakage nearly vanishes, the peak gets a little wider.
- Bring **tone B** to within 40 Hz of A with 256 samples: the two merge. Raise the block to **1024** samples and they separate again, because bins are now four times narrower.
- Raise the **noise**: it forms a floor across all bins, best seen on the decibel axis.`,
    mount(box, kit) {
      const FS = 8000;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 390, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'fa', label: 'Tone A (level 1)', min: 100, max: 3900, step: 2.5, value: 440, unit: 'Hz' },
        { id: 'fb', label: 'Tone B (level 0.5)', min: 100, max: 3900, step: 2.5, value: 1000, unit: 'Hz' },
        { id: 'noise', label: 'Noise', min: 0, max: 40, step: 1, value: 4, unit: '% of tone A' },
        { id: 'N', type: 'select', label: 'Samples in the block', options: [['64', 64], ['128', 128], ['256', 256], ['512', 512], ['1024', 1024]], value: 256 },
        { id: 'win', type: 'select', label: 'Window', options: [['none (rectangular)', 'rect'], ['Hann', 'hann']], value: 'rect' },
        { id: 'db', type: 'select', label: 'Vertical axis', options: [['decibels (−80 to 0)', 'db'], ['linear', 'lin']], value: 'db' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['bw', 'Bin width'], ['len', 'Block length'], ['pa', 'Tone A shows at'], ['ab', 'A and B']]);
      // fixed noise, so that the picture does not flicker
      const noise = new Float64Array(1024); let seed = 12345;
      for (let i = 0; i < 1024; i++) { seed = (seed * 1103515245 + 12345) & 0x7fffffff; noise[i] = (seed / 0x7fffffff) * 2 - 1; }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 12, v = ctl.values, N = v.N, hann = v.win === 'hann', dbs = v.db === 'db';
        const re = new Float64Array(N), im = new Float64Array(N), xs = new Float64Array(N);
        let cg = 0;
        for (let n = 0; n < N; n++) {
          const x = Math.sin(TAU * v.fa * n / FS) + 0.5 * Math.sin(TAU * v.fb * n / FS) + v.noise / 100 * noise[n];
          const w = hann ? 0.5 - 0.5 * Math.cos(TAU * n / (N - 1)) : 1;
          xs[n] = x; re[n] = x * w; cg += w / N;
        }
        fftInPlace(re, im);
        const half = N / 2, mag = new Float64Array(half);
        for (let k = 0; k < half; k++) mag[k] = Math.hypot(re[k], im[k]) * 2 / (N * cg);
        // the block
        const px = M + 34, pw = W - px - M, wy = 24, wh = Math.max(56, H * 0.17);
        kit.label(c, 'The block: ' + N + ' samples = ' + kit.fmt(N / FS * 1000, 3) + ' ms', M, 12, { size: 11.5, weight: 650, color: C.text2 });
        c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(px, wy + wh / 2); c.lineTo(px + pw, wy + wh / 2); c.stroke();
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath();
        for (let n = 0; n < N; n++) { const x = px + n / (N - 1) * pw, y = wy + wh / 2 - clamp(xs[n] / 1.9, -1, 1) * wh / 2; n ? c.lineTo(x, y) : c.moveTo(x, y); }
        c.stroke();
        // the spectrum
        const sy = wy + wh + 44, sh = H - sy - 40;
        kit.label(c, 'The spectrum: ' + half + ' bins of ' + kit.fmt(FS / N, 3) + ' Hz', M, sy - 12, { size: 11.5, weight: 650, color: C.text2 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.035)'; c.fillRect(px, sy, pw, sh);
        const lvl = m => (dbs ? clamp((20 * Math.log10(Math.max(m, 1e-6)) + 80) / 80, 0, 1) : clamp(m / 1.2, 0, 1));
        const bw = pw / half;
        c.fillStyle = C.ok;
        for (let k = 0; k < half; k++) { const h = lvl(mag[k]) * sh; c.fillRect(px + k * bw, sy + sh - h, Math.max(1, bw - (bw > 3 ? 1 : 0)), h); }
        const gl = dbs ? [0, -20, -40, -60, -80] : [0, 0.5, 1];
        for (const g of gl) { const y = sy + sh - (dbs ? (g + 80) / 80 : g / 1.2) * sh; c.strokeStyle = C.grid; c.beginPath(); c.moveTo(px, y); c.lineTo(px + pw, y); c.stroke(); kit.label(c, dbs ? g + ' dB' : String(g), px - 4, y, { size: 9.5, color: C.muted, align: 'right' }); }
        for (let f = 0; f <= FS / 2; f += 1000) { const x = px + f / (FS / 2) * pw; kit.label(c, f / 1000 + 'k', x, sy + sh + 12, { size: 10, color: C.muted, align: f === 0 ? 'left' : f === FS / 2 ? 'right' : 'center' }); }
        kit.label(c, 'Hz', px + pw / 2, sy + sh + 28, { size: 10, color: C.faint, align: 'center' });
        const mark = (f, name, col) => { const x = px + f / (FS / 2) * pw; c.fillStyle = col; c.beginPath(); c.moveTo(x, sy + sh + 1); c.lineTo(x - 5, sy + sh + 10); c.lineTo(x + 5, sy + sh + 10); c.closePath(); c.fill(); kit.label(c, name, x, sy - 3, { size: 10.5, color: col, align: 'center', weight: 650 }); };
        mark(v.fa, 'A', C.accent); mark(v.fb, 'B', C.warn);
        // the numbers
        const kA = Math.round(v.fa * N / FS); let best = clamp(kA, 1, half - 1);
        for (let k = Math.max(1, kA - 3); k <= Math.min(half - 1, kA + 3); k++) if (mag[k] > mag[best]) best = k;
        const sep = Math.abs(v.fa - v.fb), need = (hann ? 4 : 2) * FS / N;
        ro.set('bw', kit.fmt(FS / N, 4) + ' Hz');
        ro.set('len', kit.fmt(N / FS * 1000, 3) + ' ms');
        ro.set('pa', kit.fmt(best * FS / N, 5) + ' Hz in bin ' + best + ' (true ' + v.fa + ' Hz), ' + kit.fmt(20 * Math.log10(Math.max(mag[best], 1e-6)), 3) + ' dB');
        ro.set('ab', sep >= need ? 'two separate peaks' : 'merged: they are ' + kit.fmt(sep, 3) + ' Hz apart, closer than about ' + kit.fmt(need, 3) + ' Hz');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ au-voice-pipeline */
  const sizeText = kB => (kB < 1000 ? Math.round(kB) + ' kB' : kB < 1e6 ? +(kB / 1000).toPrecision(3) + ' MB' : +(kB / 1e6).toPrecision(3) + ' GB');
  Hyper.sim('au-voice-pipeline', {
    title: 'The voice-assistant chain, stage by stage',
    blurb: `Each row is one stage, tagged with **where it runs**: on the device, on a server, or on the network between them. The bar is the time the stage adds after you stop speaking; stages with no bar run all the time. The times are **typical orders of magnitude**, not measurements of a product. Press **Say it** to send one command down the chain.

**Try this**
- Compare the three **designs**: the data the device sends in a day goes from nothing to megabytes to gigabytes, and so does what leaves the room.
- With the satellite design, change **meaning** to a large language model: the delay jumps by more than two seconds and no network is faster.
- Pick the **cloud service** for speech to text, then the **home server, processor only**: the choice moves the delay more than anything on the device.
- Set 100 commands of 10 s: still a thousandth of what streaming all day costs.`,
    mount(box, kit, params) {
      params = params || {};
      const st = kit.stage(box.stage, { aspect: 0.98, minH: 450, maxH: 660 });
      let play = -1, running = false;
      const ctl = kit.controls(box.side, [
        { id: 'arch', type: 'select', label: 'Design', options: [['Everything on the device (a fixed list of commands)', 'device'], ['Wake word on the device, speech on a server', 'satellite'], ['The device streams everything to a server', 'streaming']], value: ['device', 'satellite', 'streaming'].indexOf(params.arch) >= 0 ? params.arch : 'satellite' },
        { id: 'stt', type: 'select', label: 'Speech to text', options: [['home server, fast model', 0.5], ['home server, processor only', 1.8], ['cloud service', 0.7]], value: 0.5 },
        { id: 'nlu', type: 'select', label: 'Meaning', options: [['fixed rules (as in Assist)', 0.1], ['large language model', 2.5]], value: 0.1 },
        { id: 'n', label: 'Commands per day', min: 1, max: 100, step: 1, value: 20 },
        { id: 'len', label: 'Length of a command', min: 1, max: 10, step: 0.5, value: 4, unit: 's' },
        { type: 'buttons', items: [{ id: 'go', label: 'Say it', primary: true }] }
      ], id => { if (id === 'go') { play = 0; running = true; loop.start(); } else if (!running) loop.once(); });
      const ro = kit.readout(box.side, [['delay', 'Delay after you stop speaking'], ['big', 'Longest stage'], ['leaves', 'Audio leaves the device'], ['data', 'Data sent per day'], ['can', 'It can understand']]);
      const stages = () => {
        const v = ctl.values, a = v.arch;
        if (a === 'device') return [
          { name: 'Microphones, front end', where: 'device', t: 0, note: 'always on' },
          { name: 'Wake word', where: 'device', t: 0, note: 'always on' },
          { name: 'End of speech', where: 'device', t: 0.5, note: 'half a second of quiet' },
          { name: 'Command recogniser', where: 'device', t: 0.3, note: 'matches a fixed list' },
          { name: 'Action', where: 'device', t: 0.05, note: 'switch, timer, relay' }];
        if (a === 'streaming') return [
          { name: 'Microphone', where: 'device', t: 0, note: 'streams all the time' },
          { name: 'Upload', where: 'network', t: 0, note: 'always, 32 kB/s' },
          { name: 'Front end, wake word', where: 'server', t: 0, note: 'always on' },
          { name: 'End of speech', where: 'server', t: 0.8, note: 'a second of quiet' },
          { name: 'Speech to text', where: 'server', t: v.stt, note: 'model on the server' },
          { name: 'Meaning', where: 'server', t: v.nlu, note: v.nlu > 1 ? 'language model' : 'rules' },
          { name: 'Speech synthesis', where: 'server', t: 0.5, note: 'to first sound' },
          { name: 'Download', where: 'network', t: 0.05, note: 'reply streams back' },
          { name: 'Playback', where: 'device', t: 0.05, note: 'speaker' }];
        return [
          { name: 'Microphones, front end', where: 'device', t: 0, note: 'always on' },
          { name: 'Wake word', where: 'device', t: 0, note: 'always on, local' },
          { name: 'End of speech', where: 'device', t: 0.8, note: 'a second of quiet' },
          { name: 'Upload', where: 'network', t: 0.05, note: 'only after the wake word' },
          { name: 'Speech to text', where: 'server', t: v.stt, note: 'model on the server' },
          { name: 'Meaning', where: 'server', t: v.nlu, note: v.nlu > 1 ? 'language model' : 'rules' },
          { name: 'Speech synthesis', where: 'server', t: 0.5, note: 'to first sound' },
          { name: 'Download', where: 'network', t: 0.05, note: 'reply streams back' },
          { name: 'Playback', where: 'device', t: 0.05, note: 'speaker' }];
      };
      const loop = kit.loop(dt => {
        if (running) { play += dt * 1.6; }
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, v = ctl.values, S = stages();
        const total = S.reduce((s, x) => s + x.t, 0);
        if (running && play > total + 0.8) { running = false; play = -1; }
        const top = 8, rowH = clamp((H - 70) / S.length, 32, 50), chipW = 64;
        const nameX = M + chipW + 8, barX0 = Math.max(nameX + 150, W * 0.56), barW = W - M - barX0 - 50, maxT = Math.max(1.5, ...S.map(x => x.t));
        const hueOf = w => (w === 'device' ? 150 : w === 'server' ? 250 : 40);
        let cum = 0;
        S.forEach((s, i) => {
          const y = top + i * rowH, active = play >= 0 && play >= cum && play < cum + Math.max(s.t, 0.15), done = play >= 0 && play >= cum + Math.max(s.t, 0.15);
          if (active) { c.fillStyle = C.dark ? 'rgba(123,140,255,.20)' : 'rgba(60,90,220,.12)'; c.fillRect(M - 4, y, W - 2 * M + 8, rowH - 3); }
          c.fillStyle = kit.hue(hueOf(s.where), s.where === 'network' ? 0.35 : 0.55);
          c.fillRect(M, y + 4, chipW, rowH - 11);
          kit.label(c, s.where, M + chipW / 2, y + rowH / 2 - 2, { size: 10.5, align: 'center', weight: 650, color: C.text });
          kit.label(c, fit(c, s.name, barX0 - nameX - 8, 12.5, 650), nameX, y + rowH / 2 - 8, { size: 12.5, weight: 650, color: done ? C.muted : C.text });
          kit.label(c, fit(c, s.note, barX0 - nameX - 8, 10, 500), nameX, y + rowH / 2 + 8, { size: 10, color: C.muted });
          if (s.t > 0) {
            c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(barX0, y + rowH / 2 - 7, barW, 14);
            c.fillStyle = kit.hue(hueOf(s.where), 0.85); c.fillRect(barX0, y + rowH / 2 - 7, Math.max(2, s.t / maxT * barW), 14);
            kit.label(c, s.t < 1 ? Math.round(s.t * 1000) + ' ms' : kit.fmt(s.t, 3) + ' s', W - M, y + rowH / 2, { size: 11, align: 'right', color: C.text2 });
          } else kit.label(c, 'continuous', barX0, y + rowH / 2, { size: 10.5, color: C.faint });
          if (done) kit.label(c, '✓', M + chipW + 1, y + 8, { size: 12, color: C.ok, weight: 700 });
          cum += s.t;
        });
        const ey = top + S.length * rowH + 14;
        kit.label(c, play >= 0 ? 'Since you stopped talking: ' + kit.fmt(Math.min(Math.max(play, 0), total), 3) + ' s of ' + kit.fmt(total, 3) + ' s' : 'Press "Say it" to follow one command through the chain', M, ey, { size: 11.5, weight: 650, color: C.text2 });
        // the numbers
        const kB = v.arch === 'device' ? 0 : v.arch === 'satellite' ? v.n * v.len * 32 : 32 * 86400;
        const big = S.reduce((m, x) => (x.t > m.t ? x : m), S[0]);
        ro.set('delay', kit.fmt(total, 3) + ' s');
        ro.set('big', big.name + ', ' + kit.fmt(big.t, 3) + ' s');
        ro.set('leaves', v.arch === 'device' ? 'never' : v.arch === 'satellite' ? 'only after the wake word' : 'always');
        ro.set('data', v.arch === 'device' ? 'none' : sizeText(kB));
        ro.set('can', v.arch === 'device' ? 'only the fixed commands' : 'anything the server models cover');
        if (!running && loop.running) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
