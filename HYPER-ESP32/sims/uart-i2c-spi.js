/* HYPER-ESP32 · sims/uart-i2c-spi.js
 *
 * Simulations of "UART, I2C and SPI" (topic code ub). Every waveform comes from kit.esp.proto.
 *
 *   ub-frame      one byte on UART, I2C, SPI and 1-Wire, each as a logic analyser shows it, with time and throughput
 *   ub-uart       a UART frame (start, data, parity, stop) and a receiver whose clock is off by a few per cent
 *   ub-link       two UARTs: TX to RX crossed correctly and wrongly, ground, baud rates, a 5 V module
 *   ub-i2c        an I2C transfer for a chosen address: acknowledge, or nobody home
 *   ub-pullup     the rising edge of an I2C line against the pull-up resistor and the bus capacitance
 *   ub-spi        an SPI byte in each of the four modes with the sampling edge marked; a wrong mode on the peripheral
 *   ub-spibus     two peripherals on one SPI bus with their own chip selects
 *   ub-onewire    1-Wire: reset, presence, bytes and the sensor's answer
 *   ub-register   a chip's registers: click bits, write, read back, and turn two bytes into units
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  const hex2 = v => '0x' + (v & 255).toString(16).toUpperCase().padStart(2, '0');
  const hexN = (v, n) => '0x' + (v >>> 0).toString(16).toUpperCase().padStart(n, '0');
  const printable = b => b >= 32 && b < 127;
  const asc = b => (printable(b) ? String.fromCharCode(b) : b === 10 || b === 13 ? '↵' : '·');
  const byteLabel = v => hex2(v) + (printable(v) ? '   \'' + String.fromCharCode(v) + '\'' : '');
  const fmtT = s => {
    const a = Math.abs(s);
    if (a >= 1) return +s.toPrecision(3) + ' s';
    if (a >= 1e-3) return +(s * 1e3).toPrecision(3) + ' ms';
    return +(s * 1e6).toPrecision(3) + ' µs';
  };
  const fmtRate = (bytes, t) => {
    const r = t > 0 ? bytes / t : 0;
    return r >= 1e6 ? +(r / 1e6).toPrecision(3) + ' MB/s' : r >= 1e3 ? +(r / 1e3).toPrecision(3) + ' kB/s' : Math.round(r) + ' B/s';
  };
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  // translucent fills for decoded marks (readable on both themes)
  const TINT = {
    start: 'rgba(224,160,48,.42)', stop: 'rgba(34,179,122,.34)', ok: 'rgba(34,179,122,.34)', bad: 'rgba(229,72,77,.46)',
    addr: 'rgba(123,140,255,.38)', parity: 'rgba(214,100,200,.36)', device: 'rgba(214,100,200,.34)', warn: 'rgba(224,160,48,.42)'
  };
  const idle = (edges, t) => { let v = edges.length ? edges[0][1] : 0; for (const e of edges) { if (e[0] > t) break; v = e[1]; } return v; };
  // a dashed vertical line
  function vline(c, x, y0, y1, color, w) {
    c.save(); c.strokeStyle = color; c.lineWidth = w || 1.2; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(x, y0); c.lineTo(x, y1); c.stroke(); c.restore();
  }
  function tri(c, x, y, up, color, r) {
    r = r || 5;
    c.save(); c.fillStyle = color; c.beginPath();
    if (up) { c.moveTo(x, y - r); c.lineTo(x - r, y + r * 0.8); c.lineTo(x + r, y + r * 0.8); } else { c.moveTo(x, y + r); c.lineTo(x - r, y - r * 0.8); c.lineTo(x + r, y - r * 0.8); }
    c.closePath(); c.fill(); c.restore();
  }
  /* a UART receiver: scans an edge list for start bits and reads every frame in the middle of its own bit times.
     o: { bits, parity, stop } -> [{ byte, ok, reason, t }]   (a start bit that is not low in its middle is a glitch and is ignored) */
  function uartReceive(P, edges, baudRx, o) {
    o = o || {};
    const nd = o.bits || 8, par = o.parity === 'even' || o.parity === 'odd', Tr = 1 / baudRx, out = [];
    const lvl = t => P.levelAt(edges, t);
    const falls = [];
    for (let i = 1; i < edges.length; i++) if (edges[i][1] === 0 && edges[i - 1][1] === 1) falls.push(edges[i][0]);
    let next = -Infinity;
    for (const tf of falls) {
      if (tf < next) continue;
      if (lvl(tf + 0.5 * Tr) !== 0) continue;
      let byte = 0, ones = 0;
      for (let i = 0; i < nd; i++) { const v = lvl(tf + (1.5 + i) * Tr); byte |= v << i; ones += v; }
      let k = 1 + nd, parityOk = true;
      if (par) { parityOk = lvl(tf + (k + 0.5) * Tr) === ((ones % 2) ^ (o.parity === 'odd' ? 1 : 0)); k++; }
      const stopOk = lvl(tf + (k + 0.5) * Tr) === 1;
      out.push({ byte, ok: stopOk && parityOk, reason: !stopOk ? 'framing error' : !parityOk ? 'parity error' : '', t: tf });
      next = tf + (k + 0.5) * Tr;
    }
    return out;
  }
  // a little deterministic noise
  function lcg(seed) { let s = seed >>> 0; return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296); }
  /* a paragraph that wraps at maxW: kit.label for each line; returns the number of lines */
  function para(kit, c, text, x, y, maxW, lh, o) {
    o = o || {};
    c.save();
    c.font = (o.weight || 500) + ' ' + (o.size || 12.5) + 'px ' + (o.mono ? 'monospace' : 'sans-serif');
    const lines = [];
    let line = '';
    for (const w of String(text).split(' ')) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxW * 0.94 && line) { lines.push(line); line = w; } else line = t;
    }
    if (line) lines.push(line);
    c.restore();
    lines.forEach((l, i) => kit.label(c, l, x, y + i * lh, o));
    return lines.length;
  }

  /* ================================================================ ub-frame */
  Hyper.sim('ub-frame', {
    title: 'One byte on four buses',
    blurb: `The same byte, sent over each bus, drawn as a logic analyser would show it. **Every row group has its own time scale** (printed under it), so compare the times in the read-outs, not the widths.

**Try this**
- Move **Byte to send** to 0x55 (the letter U, alternating bits) and 0xFF (all ones): see which bus still shows edges.
- On the UART the byte is wrapped in a start and a stop bit; on I2C it comes **after an address byte**, with an acknowledge after each; SPI has no wrapping at all; 1-Wire stretches every bit to 70 µs.
- Raise **Bytes to move** to 1024 (an OLED frame) and compare the four times and rates, including each bus's overhead.
- Change the clocks: the SPI line at 40 MHz is more than ten times faster than I2C at 400 kHz.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym, P = E.proto;
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 420, maxH: 620 });
      const ctl = kit.controls(box.side, [
        { id: 'byte', label: 'Byte to send', min: 0, max: 255, step: 1, value: params.byte != null ? params.byte : 0x41, fmt: v => byteLabel(Math.round(v)) },
        { id: 'baud', type: 'select', label: 'UART speed', options: [['9 600 baud', 9600], ['115 200 baud', 115200], ['921 600 baud', 921600]], value: 115200 },
        { id: 'i2c', type: 'select', label: 'I2C clock', options: [['100 kHz', 100e3], ['400 kHz', 400e3], ['1 MHz', 1e6]], value: 400e3 },
        { id: 'spi', type: 'select', label: 'SPI clock', options: [['1 MHz', 1e6], ['8 MHz', 8e6], ['40 MHz', 40e6]], value: 8e6 },
        { id: 'n', label: 'Bytes to move', min: 1, max: 4096, step: 1, value: params.payload || 1, log: true, sig: 3, fmt: v => Math.round(v) + (Math.round(v) === 1 ? ' byte' : ' bytes') }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['uart', 'UART'], ['i2c', 'I2C'], ['spi', 'SPI'], ['ow', '1-Wire']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const byte = Math.round(ctl.values.byte) & 255, n = Math.max(1, Math.round(ctl.values.n));
        const baud = ctl.values.baud, hzI = ctl.values.i2c, hzS = ctl.values.spi;
        const M = 10, W = st.W - 2 * M;
        // the four waveforms
        const u = P.uart(byte, { baud });
        const uMarks = u.bits.map(b => ({ t0: b.t0, t1: b.t1, text: b.kind === 'start' ? 'start' : b.kind === 'stop' ? 'stop' : 'D' + b.i, color: b.kind === 'start' ? TINT.start : b.kind === 'stop' ? TINT.stop : null }));
        const i2 = P.i2c({ addr: 0x48, data: [byte], hz: hzI });
        const i2Marks = i2.marks.map(m => ({ t0: m.t0, t1: m.t1, text: m.text, color: m.kind === 'start' || m.kind === 'stop' ? TINT.warn : m.kind === 'addr' ? TINT.addr : m.kind === 'ack' ? TINT.ok : m.kind === 'nack' ? TINT.bad : null }));
        const sp = P.spi({ mode: 0, hz: hzS, bytes: [byte], miso: [0] });
        const ow = P.onewire([byte], { reset: false });
        const owMarks = ow.marks.map(m => ({ t0: m.t0, t1: m.t1, text: m.text }));
        // layout: four headers and eight rows
        const head = 20, foot = 16, gap = 8;
        const rowH = Math.max(26, Math.floor((st.H - 4 * (head + foot) - 3 * gap - 6) / 8));
        let y = 4;
        const lane = (title, sub, rows, traces, o) => {
          kit.label(c, title, M, y + 9, { size: 12.5, weight: 650 });
          kit.label(c, sub, M + W, y + 9, { size: 11, color: C.muted, align: 'right' });
          y += head;
          S.logic(c, M, y, W, rows * rowH + foot, traces, Object.assign({ labelW: 46, grid: 8 }, o));
          y += rows * rowH + foot + gap;
        };
        lane('UART', '2 wires · no clock · 8N1 at ' + baud + ' baud', 1,
          [{ label: 'TX', edges: u.edges, marks: uMarks }], { t0: -0.5 * u.tBit, t1: u.t1 + 0.5 * u.tBit });
        lane('I2C', '2 wires · address 0x48, then the byte', 2,
          [{ label: 'SCL', edges: i2.scl }, { label: 'SDA', edges: i2.sda, marks: i2Marks }], { t0: i2.scl[0][0], t1: i2.t1 });
        lane('SPI', '4 wires · mode 0 · MSB first', 4,
          [{ label: 'CS', edges: sp.cs }, { label: 'SCK', edges: sp.sck }, { label: 'MOSI', edges: sp.mosi, marks: sp.marks.map(m => ({ t0: m.t0, t1: m.t1, text: m.text })) }, { label: 'MISO', edges: sp.miso }],
          { t0: sp.cs[0][0], t1: sp.t1 });
        lane('1-Wire', '1 wire · LSB first · 70 µs a bit', 1,
          [{ label: 'DQ', edges: ow.edges, marks: owMarks }], { t0: -60e-6, t1: ow.t1 + 20e-6 });
        // times and rates
        const tU = n * 10 / baud, tI = (9 * (n + 1) + 2) / hzI, tS = n * 8 / hzS, tO = 960e-6 + n * 560e-6;
        const byteWord = n === 1 ? 'the byte' : n + ' bytes';
        ro.set('uart', fmtT(tU) + ' for ' + byteWord + ' · ' + fmtRate(n, tU) + ' · 2 wires');
        ro.set('i2c', fmtT(tI) + ' (address + ' + byteWord + ') · ' + fmtRate(n, tI) + ' · 2 wires');
        ro.set('spi', fmtT(tS) + ' · ' + fmtRate(n, tS) + ' · 4 wires, 3 shared');
        ro.set('ow', fmtT(tO) + ' (with reset) · ' + fmtRate(n, tO) + ' · 1 wire');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ub-uart */
  Hyper.sim('ub-uart', {
    title: 'A UART frame, and a receiver whose clock is off',
    blurb: `The trace is what the transmitter puts on the wire. The **dashed lines** are where the receiver reads: it starts a timer on the falling edge of the start bit and reads in the middle of each bit — *by its own clock*. Green dots are bits read correctly, red ones are bits it got wrong.

**Try this**
- Leave the **receiver clock error** at 0 % and change the byte, the parity and the stop bits: every frame starts low and ends high.
- Detune the receiver slowly to **+4 %** and then **+6 %**: the sample lines slide along the frame; by the last bit they leave their own slot and the byte is read wrongly.
- Then try **−6 %**: slower is just as bad. The tolerance is about half a bit by the last sample.
- Set 8 data bits with **even parity** and detune: a parity or framing error is how a real UART notices.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym, P = E.proto;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 460 });
      const ctl = kit.controls(box.side, [
        { id: 'byte', label: 'Byte to send', min: 0, max: 127, step: 1, value: params.byte != null ? params.byte : 0x41, fmt: v => byteLabel(Math.round(v)) },
        { id: 'baud', type: 'select', label: 'Baud rate', options: [['9 600', 9600], ['19 200', 19200], ['115 200', 115200], ['921 600', 921600]], value: 115200 },
        { id: 'bits', type: 'select', label: 'Data bits', options: [['8', 8], ['7', 7]], value: 8 },
        { id: 'parity', type: 'select', label: 'Parity', options: [['none', 'none'], ['even', 'even'], ['odd', 'odd']], value: 'none' },
        { id: 'stop', type: 'select', label: 'Stop bits', options: [['1', 1], ['2', 2]], value: 1 },
        { id: 'err', label: 'Receiver clock error', min: -10, max: 10, step: 0.1, value: params.err != null ? params.err : 0, unit: '%' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['bit', 'One bit lasts'], ['frame', 'One frame'], ['rate', 'Characters a second'], ['got', 'The receiver reads'], ['drift', 'Error at the last bit']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const baud = ctl.values.baud, nd = ctl.values.bits, par = ctl.values.parity, stp = ctl.values.stop;
        const byte = Math.round(ctl.values.byte) & ((1 << nd) - 1);
        const f = P.uart(byte, { baud, bits: nd, parity: par, stop: stp });
        const Tb = f.tBit, nb = f.bits.length, errp = ctl.values.err / 100, Tr = 1 / (baud * (1 + errp));
        // where and what the receiver reads
        const samples = f.bits.map((b, k) => { const t = (k + 0.5) * Tr; const v = P.levelAt(f.edges, t); return { t, v, want: b.v, ok: v === b.v, kind: b.kind }; });
        let got = 0;
        for (let i = 0; i < nd; i++) got |= samples[1 + i].v << i;
        const startOk = samples[0].v === 0;
        let parOk = true, ones = 0;
        for (let i = 0; i < nd; i++) ones += samples[1 + i].v;
        if (par !== 'none') parOk = samples[1 + nd].v === ((ones % 2) ^ (par === 'odd' ? 1 : 0));
        const stopOk = samples[nb - stp].v === 1;
        const verdict = !startOk ? 'no start bit seen: ignored' : !stopOk ? 'framing error' : !parOk ? 'parity error' : got === byte ? 'correct' : 'WRONG BYTE';
        const good = startOk && stopOk && parOk && got === byte;
        const eb = E.baudError(baud, baud * (1 + errp), nb);
        // the picture
        const M = 8, W = st.W - 2 * M;
        const t1 = Math.max(f.t1, nb * Tr) + 0.7 * Tb, t0 = -0.7 * Tb;
        const marks = f.bits.map(b => ({ t0: b.t0, t1: b.t1, text: b.kind === 'start' ? 'start' : b.kind === 'stop' ? 'stop' : b.kind === 'parity' ? 'par' : 'D' + b.i, color: b.kind === 'start' ? TINT.start : b.kind === 'stop' ? TINT.stop : b.kind === 'parity' ? TINT.parity : null }));
        const hL = Math.min(150, st.H * 0.42);
        const lg = S.logic(c, M, 6, W, hL, [{ label: 'TX', edges: f.edges, marks }], { t0, t1, labelW: 40, grid: nb + 1 });
        const ty = lg.rowY(0), th = lg.rowH * 0.5;
        samples.forEach(s => {
          const x = lg.X(s.t);
          vline(c, x, lg.plot.y, lg.plot.y + lg.plot.h, s.ok ? C.ok : C.bad, 1.2);
          kit.dot(c, x, ty + th * (1 - s.v), 4, s.ok ? C.ok : C.bad, C.bg2);
        });
        para(kit, c, 'dashed lines: where the receiver reads each bit — the first one checks the start bit, the last one the stop bit', M + 40, 6 + hL + 8, W - 40, 12.5, { size: 10.5, color: C.muted });
        // the bits as sent and as read
        const cell = Math.min(30, (W - 150) / 8), by = 6 + hL + 42;
        kit.label(c, 'sent', M + 44, by + cell / 2, { size: 11.5, color: C.text2, align: 'right' });
        S.bits(c, M + 54, by, byte, { n: nd, cell, labels: true });
        const wrong = [];
        for (let i = 0; i < nd; i++) if (((got >> i) & 1) !== ((byte >> i) & 1)) wrong.push(nd - 1 - i);
        kit.label(c, 'read', M + 44, by + cell * 2.1, { size: 11.5, color: C.text2, align: 'right' });
        S.bits(c, M + 54, by + cell * 1.6, got, { n: nd, cell, hi: wrong, color: good ? C.ok : C.bad });
        const tx = M + 54 + nd * cell + 22;
        kit.label(c, 'sent ' + byteLabel(byte), tx, by + cell * 0.5, { size: 12.5, weight: 600 });
        kit.label(c, 'read ' + byteLabel(got), tx, by + cell * 2.1, { size: 12.5, weight: 600, color: good ? C.ok : C.bad });
        kit.label(c, verdict, tx, by + cell * 3.1, { size: 12.5, weight: 650, color: good ? C.ok : C.bad });
        // numbers
        const perChar = nb;
        ro.set('bit', fmtT(Tb));
        ro.set('frame', nb + ' bits · ' + fmtT(nb * Tb));
        ro.set('rate', kit.fmt(baud / perChar, 4) + ' at most');
        ro.set('got', byteLabel(got) + ' · ' + verdict);
        ro.set('drift', kit.fmt(eb.errorPct, 3) + ' % → ' + kit.fmt(eb.drift, 2) + ' bit · ' + (eb.drift < 0.25 ? 'comfortable' : eb.drift < 0.4 ? 'marginal' : 'fails'));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ub-link */
  Hyper.sim('ub-link', {
    title: 'Two UARTs: TX to RX, and what goes wrong',
    blurb: `An ESP (left) sends "PING" and a module (right) answers "PONG". The two traces are what each transmitter puts on its wire; under each is what the *other* end makes of it, decoded by a receiver running at *its own* baud rate.

**Try this**
- With the **correct wiring** and equal baud rates, each end reads what the other sent. Note that the two wires **cross** in the drawing: TX meets RX.
- Choose **TX to TX**: both outputs drive one wire and the inputs hear nothing.
- Choose **no ground wire**: the levels have no common reference and the text is garbled, or arrives only by luck.
- Back to the correct wiring, set the **module baud** to 9 600: the ESP's bits are far too short for it, and the module's bits are far too long for the ESP. Neither end reads a word.
- Choose **module drives 5 V**: the text arrives, but the ESP pin is above its 3.3 V limit — a level shifter belongs there.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym, P = E.proto;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 340, maxH: 440 });
      const ctl = kit.controls(box.side, [
        { id: 'wiring', type: 'select', label: 'Wiring', options: [['TX to RX, RX to TX, ground joined', 'ok'], ['TX to TX, RX to RX (not crossed)', 'straight'], ['Crossed, but no ground wire', 'noground'], ['Crossed, module drives 5 V', '5v']], value: params.wiring || 'ok' },
        { id: 'bA', type: 'select', label: 'ESP baud rate', options: [['9 600', 9600], ['115 200', 115200]], value: 115200 },
        { id: 'bB', type: 'select', label: 'Module baud rate', options: [['9 600', 9600], ['115 200', 115200]], value: params.moduleBaud || 115200 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['mod', 'The module reads'], ['esp', 'The ESP reads'], ['note', 'The wiring']]);
      const MSG_A = E.bytesOf('PING\r\n'), MSG_B = E.bytesOf('PONG\r\n');
      const text = bytes => bytes.length ? bytes.slice(0, 10).map(asc).join('') + (bytes.length > 10 ? '…' : '') : '(nothing)';
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const w = ctl.values.wiring, bA = ctl.values.bA, bB = ctl.values.bB;
        const fa = P.uartBytes(MSG_A, { baud: bA, gap: 1, show: 'ascii' }), fb = P.uartBytes(MSG_B, { baud: bB, gap: 1, show: 'ascii' });
        // what each receiver makes of the other's signal
        let toMod = uartReceive(P, fa.edges, bB, {}), toEsp = uartReceive(P, fb.edges, bA, {});
        let note = 'correct';
        if (w === 'straight') { toMod = []; toEsp = []; note = 'two outputs fight on one wire'; }
        const rnd = lcg(11);
        if (w === 'noground') {
          const garble = list => list.map(() => ({ byte: 33 + Math.floor(rnd() * 90), ok: false }));
          toMod = garble(toMod); toEsp = garble(toEsp); note = 'no common reference: unreliable';
        }
        if (w === '5v') note = 'ESP pin at 5 V: over its limit';
        const okMod = toMod.length === MSG_A.length && toMod.every((r, i) => r.byte === MSG_A[i]);
        const okEsp = toEsp.length === MSG_B.length && toEsp.every((r, i) => r.byte === MSG_B[i]);
        // the two boards and their wires
        const M = 10, W = st.W - 2 * M, bw = Math.min(118, W * 0.22), by = 6, bh = 94, py = [by + 32, by + 56, by + 80];
        const xr = M + bw, xl = M + W - bw;
        S.box(c, M, by, bw, bh, { label: 'ESP', sub: '3.3 V logic', color: kit.hue(150) });
        S.box(c, xl, by, bw, bh, { label: 'Module', sub: w === '5v' ? 'drives 5 V' : 'GPS, modem …', color: kit.hue(212) });
        ['TX', 'RX', 'GND'].forEach((n, i) => {
          kit.label(c, n, xr - 7, py[i], { size: 11, align: 'right', color: C.text2, weight: 600 });
          kit.label(c, n, xl + 7, py[i], { size: 11, color: C.text2, weight: 600 });
        });
        const crossed = w !== 'straight';
        const wire = (y1, y2, color, dash) => S.wire(c, [[xr, y1], [xl, y2]], { color, dash });
        if (crossed) { wire(py[0], py[1], C.accent); wire(py[1], py[0], w === '5v' ? C.bad : C.accent); }
        else { wire(py[0], py[0], C.bad); wire(py[1], py[1], C.bad); }
        if (w !== 'noground') wire(py[2], py[2], C.muted); else kit.label(c, 'no ground wire', (xr + xl) / 2, py[2], { size: 11, color: C.bad, align: 'center' });
        if (w === '5v') kit.label(c, '5 V', xl - 12, py[0] - 11, { size: 11, color: C.bad, weight: 650, align: 'right' });
        if (w === 'straight') kit.label(c, 'TX meets TX', (xr + xl) / 2, py[0] - 10, { size: 11, color: C.bad, align: 'center' });
        else kit.label(c, 'ESP TX → module RX', (xr + xl) / 2 - 36, py[0] - 10, { size: 10.5, color: C.muted, align: 'center' });
        // the traces and their readings
        const hL = Math.max(62, Math.floor((st.H - bh - 22 - 2 * 26) / 2));
        const trace = (y, label, f, baud, recv, ok, who) => {
          const t0 = -0.6 / baud, t1 = f.t1 + 0.3 / baud;
          S.logic(c, M, y, W, hL, [{ label, edges: f.edges, marks: f.marks.map(m => ({ t0: m.t0, t1: m.t1, text: m.text })) }], { t0, t1, labelW: 56, grid: 8 });
          kit.label(c, who + ' reads: ' + text(recv.map(r => r.byte)) + (w === 'straight' ? '' : recv.some(r => r.ok === false) ? '   (' + (w === 'noground' ? 'noise' : 'framing errors') + ')' : ''), M + 56, y + hL + 11, { size: 12, weight: 650, color: ok ? C.ok : C.bad });
        };
        const y1 = by + bh + 12;
        trace(y1, 'ESP TX', fa, bA, toMod, okMod, 'the module');
        trace(y1 + hL + 24, 'module TX', fb, bB, toEsp, okEsp, 'the ESP');
        ro.set('mod', text(toMod.map(r => r.byte)) + (okMod ? '  ✓' : '  ✗'));
        ro.set('esp', text(toEsp.map(r => r.byte)) + (okEsp ? '  ✓' : '  ✗'));
        ro.set('note', note);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ub-i2c */
  Hyper.sim('ub-i2c', {
    title: 'An I2C transfer, and nobody home',
    blurb: `The controller calls one address; **SDA** carries the address byte, then the part must pull SDA low during the ninth clock (**A**, acknowledge). If nobody does, the ninth bit stays high (**N**) and the transfer ends — that is how a scan finds parts. *S* is START, *P* is STOP.

**Try this**
- Call 0x48 (a TMP102 is fitted): the address is acknowledged and the data bytes follow, each with its own A. Switch to **read**: the part sends, and the controller says **N** after the last byte.
- Move **Address called** by one, to 0x49: nobody has it, the ninth bit stays high and Arduino's \`endTransmission()\` returns 2.
- Untick a part: its address now gets an N.
- Move the address to 0x3C, 0x68 and 0x76, the other three parts of the bus.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym, P = E.proto;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 360, maxH: 480 });
      const PARTS = [[0x3C, 'OLED'], [0x48, 'TMP102'], [0x68, 'MPU6050'], [0x76, 'BME280']];
      const present0 = params.present || PARTS.map(p => p[0]);
      const ctl = kit.controls(box.side, [
        { id: 'addr', label: 'Address called', min: 0x08, max: 0x77, step: 1, value: params.addr != null ? params.addr : 0x48, fmt: v => { const a = Math.round(v), nm = E.I2C_ADDR[a]; return hex2(a) + (nm ? '  ' + nm[0] : ''); } },
        { id: 'dir', type: 'select', label: 'Direction', options: [['write to the part', 'w'], ['read from the part', 'r']], value: params.dir || 'w' },
        { id: 'n', type: 'select', label: 'Data bytes', options: [['1', 1], ['2', 2], ['3', 3]], value: 2 },
        { id: 'hz', type: 'select', label: 'Clock', options: [['100 kHz', 100e3], ['400 kHz', 400e3]], value: 100e3 }
      ].concat(PARTS.map(([a, nm]) => ({ id: 'p' + a, type: 'check', label: nm + ' on the bus at ' + hex2(a), value: present0.indexOf(a) >= 0 }))), () => loop.once());
      const ro = kit.readout(box.side, [['res', 'Result'], ['ard', 'Arduino Wire'], ['time', 'Transfer takes'], ['bytes', 'Data bytes moved']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const addr = Math.round(ctl.values.addr), read = ctl.values.dir === 'r', n = +ctl.values.n, hz = ctl.values.hz;
        const part = PARTS.find(p => p[0] === addr && ctl.values['p' + p[0]]);
        const home = !!part;
        const data = read ? [0x19, 0x00, 0x4B].slice(0, n) : [0x00, 0x42, 0x17].slice(0, n);
        const tr = P.i2c({ addr, read, data, hz, addrAck: home });
        const M = 10, W = st.W - 2 * M;
        // the bus: controller, two wires, four parts
        const cw = Math.min(100, W * 0.2), ch = 52, cy = 8;
        S.box(c, M, cy, cw, ch, { label: 'ESP', sub: 'calls ' + hex2(addr), color: kit.hue(150), active: true });
        const busX = M + cw, busEnd = M + W, yS = cy + 16, yC = cy + 30;
        S.wire(c, [[busX, yS], [busEnd, yS]], { color: C.accent }); S.wire(c, [[busX, yC], [busEnd, yC]], { color: C.muted });
        kit.label(c, 'SDA', busEnd - 2, yS - 8, { size: 10, color: C.accent, align: 'right' }); kit.label(c, 'SCL', busEnd - 2, yC + 8, { size: 10, color: C.muted, align: 'right' });
        const pw = (W - cw - 20) / 4 - 8, py = cy + 52;
        PARTS.forEach(([a, nm], i) => {
          const px = busX + 14 + i * (pw + 8), on = ctl.values['p' + a], called = a === addr;
          S.wire(c, [[px + pw / 2, yS], [px + pw / 2, py]], { color: on ? C.accent : C.faint, dash: !on });
          S.box(c, px, py, pw, 42, { label: nm, sub: hex2(a), color: on ? (called ? C.ok : kit.hue(212)) : C.faint, active: on && called, dash: !on, size: 11.5 });
        });
        // the analyser
        const ay = py + 56, ah = st.H - ay - 30;
        const marks = tr.marks.map(m => ({ t0: m.t0, t1: m.t1, text: m.text, color: m.kind === 'start' || m.kind === 'stop' ? TINT.warn : m.kind === 'addr' ? TINT.addr : m.kind === 'ack' ? TINT.ok : m.kind === 'nack' ? TINT.bad : null }));
        S.logic(c, M, ay, W, Math.max(110, ah), [{ label: 'SCL', edges: tr.scl }, { label: 'SDA', edges: tr.sda, marks }], { t0: tr.scl[0][0], t1: tr.t1 + 0.3 * tr.tBit, labelW: 40, grid: 10 });
        const name = home ? part[1] : (E.I2C_ADDR[addr] ? E.I2C_ADDR[addr][0] : null);
        const res = home ? 'ACK: the ' + part[1] + ' answered' : 'NACK: nobody has ' + hex2(addr) + (name ? ' (a ' + name + ' would)' : '');
        kit.label(c, res, M + 40, ay + Math.max(110, ah) + 12, { size: 12.5, weight: 650, color: home ? C.ok : C.bad });
        ro.set('res', res);
        ro.set('ard', 'endTransmission() = ' + (home ? '0' : '2') + (home ? ' (acknowledged)' : ' (NACK on the address)'));
        ro.set('time', fmtT(tr.t1) + ' at ' + (hz / 1000) + ' kHz');
        ro.set('bytes', home ? n + (read ? ' read' : ' written') : '0 — the transfer ends after the address');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ub-pullup */
  Hyper.sim('ub-pullup', {
    title: 'The rising edge of an I2C line',
    blurb: `A part pulls the line low quickly; the **pull-up resistor** has to lift it again through the **bus capacitance**, which takes a time of 0.8473 × R × C. The bar under the picture is the window of resistor values that work for this supply, clock and capacitance: too small and the parts cannot pull the line low, too large and the line is too slow.

**Try this**
- At 100 kHz with 100 pF, leave 4.7 kΩ and see a healthy edge. Switch to **400 kHz**: the same resistor now misses the 300 ns limit, and at **1 MHz** the high level no longer even reaches 70 %.
- Lower the resistor to 2.2 kΩ and the edge is fast again; keep going down below 1 kΩ and the *low* level rises instead.
- Add **extra boards**: each brings its own 4.7 kΩ in parallel. Watch the total fall into the red.
- Raise the capacitance towards 400 pF (a long cable) and watch the window close.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.66, minH: 350, maxH: 470 });
      const ctl = kit.controls(box.side, [
        { id: 'R', label: 'Pull-up resistor', min: 0.47, max: 47, value: params.R || 4.7, log: true, sig: 3, fmt: v => kit.eng(v * 1000, 'Ω') },
        { id: 'C', label: 'Bus capacitance', min: 10, max: 600, step: 5, value: params.C || 100, unit: 'pF' },
        { id: 'boards', label: 'Extra boards, each with 4.7 kΩ pull-ups', min: 0, max: 10, step: 1, value: params.boards || 0 },
        { id: 'vcc', type: 'select', label: 'Bus supply', options: [['3.3 V', 3.3], ['5 V', 5]], value: 3.3 },
        { id: 'hz', type: 'select', label: 'Clock', options: [['100 kHz', 100e3], ['400 kHz', 400e3], ['1 MHz', 1e6]], value: params.hz || 100e3 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['rt', 'Pull-up in total'], ['rise', 'Rise time, 30 % to 70 %'], ['win', 'Allowed resistor range'], ['low', 'When pulled low'], ['res', 'Verdict']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const R = ctl.values.R * 1000, Cb = ctl.values.C * 1e-12, boards = Math.round(ctl.values.boards), vcc = ctl.values.vcc, hz = ctl.values.hz;
        const Rt = boards > 0 ? 1 / (1 / R + boards / 4700) : R;
        const limit = hz > 400e3 ? 120e-9 : hz > 100e3 ? 300e-9 : 1000e-9;
        const pu = E.i2cPullup(vcc, Cb, hz, Rt);
        const Rmin = pu.min, Rmax = limit / (0.8473 * Cb), rise = pu.rise;
        // the steady-state waveform: a quick fall (the part's output resistance) and an RC rise
        const Rd = 133, vl = vcc * Rd / (Rt + Rd), T = 1 / hz, half = T / 2, tauR = Rt * Cb, tauF = Rd * Cb;
        const a = Math.exp(-half / tauF), b = Math.exp(-half / tauR);
        const vL = (vl + (vcc - vl) * a - vcc * a * b) / (1 - a * b), vH = vcc - (vcc - vL) * b;
        const volt = t => { const x = t % T; return x < half ? vl + (vH - vl) * Math.exp(-x / tauF) : vcc - (vcc - vL) * Math.exp(-(x - half) / tauR); };
        const M = 10, W = st.W - 2 * M, lw = 40;
        // the line voltage over three clock periods
        const gy = 10, gh = Math.max(120, st.H * 0.5);
        const an = S.analog(c, M + lw, gy, W - lw, gh, volt, { t0: 0, t1: 3 * T, min: 0, max: vcc * 1.08, color: C.accent, width: 2.2, steps: 360 });
        c.save(); c.setLineDash([4, 4]); c.lineWidth = 1; c.strokeStyle = C.faint;
        for (const f of [0.3, 0.7]) { const yy = an.Y(vcc * f); c.beginPath(); c.moveTo(M + lw, yy); c.lineTo(M + W, yy); c.stroke(); }
        for (let k = 0; k < 6; k++) { const xx = an.X(k * half); c.beginPath(); c.moveTo(xx, gy); c.lineTo(xx, gy + gh); c.stroke(); }
        c.restore();
        kit.label(c, '70 %', M + lw - 4, an.Y(vcc * 0.7), { size: 10, color: C.muted, align: 'right' });
        kit.label(c, '30 %', M + lw - 4, an.Y(vcc * 0.3), { size: 10, color: C.muted, align: 'right' });
        kit.label(c, kit.fmt(vcc, 2) + ' V', M + lw - 4, an.Y(vcc), { size: 10, color: C.muted, align: 'right' });
        kit.label(c, '0 V', M + lw - 4, an.Y(0), { size: 10, color: C.muted, align: 'right' });
        kit.label(c, 'the part lets go (release)', an.X(half) + 4, gy + gh + 11, { size: 10, color: C.faint });
        kit.label(c, 'the part pulls low', an.X(T) + 4, gy + gh + 11, { size: 10, color: C.faint });
        // the window of resistor values, on a log axis from 100 ohm to 100 kilohm
        const wy = gy + gh + 44, wx = M + lw, ww = W - lw, lx = r => wx + clamp((Math.log10(r) - 2) / 3, 0, 1) * ww;
        c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.06)'; c.fillRect(wx, wy, ww, 18);
        if (Rmin < Rmax) { c.fillStyle = 'rgba(34,179,122,.45)'; c.fillRect(lx(Rmin), wy, lx(Rmax) - lx(Rmin), 18); }
        [100, 1000, 10000, 100000].forEach((r, i) => { kit.label(c, ['100 Ω', '1 kΩ', '10 kΩ', '100 kΩ'][i], lx(r), wy + 30, { size: 10, color: C.muted, align: i === 0 ? 'left' : i === 3 ? 'right' : 'center' }); });
        tri(c, lx(Rt), wy - 5, false, Rt < Rmin || Rt > Rmax ? C.bad : C.ok, 6);
        kit.label(c, 'your total: ' + kit.eng(Rt, 'Ω'), lx(Rt), wy - 18, { size: 11, color: C.text, align: lx(Rt) > wx + ww * 0.8 ? 'right' : 'center', weight: 600 });
        para(kit, c, Rmin < Rmax ? 'green: allowed range ' + kit.eng(Rmin, 'Ω') + ' to ' + kit.eng(Rmax, 'Ω') : 'no resistor works: slow the clock or cut the capacitance', M, wy + 50, W, 13.5, { size: 11, color: Rmin < Rmax ? C.ok : C.bad });
        // the verdict
        let verdict, good = false;
        if (Rt < Rmin) verdict = 'too strong: the parts cannot pull the line below 0.4 V';
        else if (rise > limit) verdict = 'too weak: the edge is slower than the ' + Math.round(limit * 1e9) + ' ns limit';
        else if (vH < 0.7 * vcc) verdict = 'the high level never gets valid before the next edge';
        else { verdict = 'good'; good = true; }
        ro.set('rt', kit.eng(Rt, 'Ω') + (boards ? ' (with ' + boards + ' extra board' + (boards > 1 ? 's' : '') + ')' : ''));
        ro.set('rise', kit.fmt(rise * 1e9, 3) + ' ns · limit ' + Math.round(limit * 1e9) + ' ns');
        ro.set('win', Rmin < Rmax ? kit.eng(Rmin, 'Ω') + ' to ' + kit.eng(Rmax, 'Ω') : 'empty');
        ro.set('low', kit.fmt(vcc / Rt * 1000, 3) + ' mA · reaches ' + kit.fmt(vl, 2) + ' V (needs ≤ 0.4 V, 3 mA)');
        ro.set('res', verdict);
        para(kit, c, good ? 'good: the edge is fast enough and the parts can pull the line down' : verdict, M, wy + 82, W, 15, { size: 12, color: good ? C.ok : C.bad, weight: 650 });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ub-spi */
  Hyper.sim('ub-spi', {
    title: 'An SPI byte, and where it is read',
    blurb: `Four wires, one byte each way at once: **MOSI** carries what the controller sends, **MISO** what the peripheral replies. The **triangles** on SCK mark the edge on which the peripheral reads, the **dots** the bit it reads there; the controller reads MISO on its own sampling edge.

**Try this**
- In **mode 0**, find the rising edges and see that MOSI is steady at each: data changes on the falling edge, half a clock earlier.
- Switch to **mode 3**: SCK now rests high and the controller reads on the rising edge again, one clock edge later in the pulse.
- Tick **Show all four modes**: modes 0 and 3 read on the rising edge, 1 and 2 on the falling edge.
- Where shown, make the **peripheral expect** another mode than the controller uses: its reads land on moving data, so the byte is wrong — or right only by luck — and nothing tells you.`,
    mount(box, kit, params) {
      params = params || {};
      const duplexView = params.view !== 'modes';
      const E = kit.esp, S = kit.esym, P = E.proto;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 380, maxH: 580 });
      const modeOpts = [['mode 0 (CPOL 0, CPHA 0)', 0], ['mode 1 (CPOL 0, CPHA 1)', 1], ['mode 2 (CPOL 1, CPHA 0)', 2], ['mode 3 (CPOL 1, CPHA 1)', 3]];
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Controller mode', options: modeOpts, value: params.mode || 0 },
        { id: 'pmode', type: 'select', label: 'Peripheral expects', options: [['the same mode', -1]].concat(modeOpts), value: -1 },
        { id: 'out', label: 'Controller sends (MOSI)', min: 0, max: 255, step: 1, value: 0xA5, fmt: v => hex2(Math.round(v)) },
        { id: 'inb', label: 'Peripheral replies (MISO)', min: 0, max: 255, step: 1, value: 0x3C, fmt: v => hex2(Math.round(v)) },
        { id: 'hz', type: 'select', label: 'Clock', options: [['1 MHz', 1e6], ['8 MHz', 8e6]], value: 1e6 },
        { id: 'lsb', type: 'check', label: 'Least significant bit first', value: false },
        { id: 'cmp', type: 'check', label: 'Show all four modes', value: !duplexView }
      ], (id) => { sync(); loop.once(); });
      const sync = () => { ctl.show('pmode', !ctl.values.cmp && !duplexView); ctl.show('mode', !ctl.values.cmp); ctl.show('inb', !ctl.values.cmp); };
      sync();
      const ro = kit.readout(box.side, [['mode', 'Mode'], ['idle', 'SCK rests'], ['edge', 'Data is read on'], ['per', 'The peripheral reads'], ['ctl', 'The controller reads']]);
      // when the peripheral (with its own CPOL/CPHA) reads, for each bit of a transfer built in controller mode `mode`
      const readTimes = (sp, mode, pm) => {
        const cpol = mode >> 1, rising = ((pm >> 1) ^ (pm & 1)) === 0, ts = [];
        for (let k = 0; k < 8; k++) {
          const lead = sp.sck[1 + 2 * k][0], trail = sp.sck[2 + 2 * k][0];
          const rise = cpol === 0 ? lead : trail, fall = cpol === 0 ? trail : lead;
          ts.push({ t: rising ? rise : fall, rising, lead: rising ? cpol === 0 : cpol === 1 });
        }
        return ts;
      };
      // the controller changes its data on the trailing edge in modes 0 and 2 (CPHA 0) and on the leading edge in modes 1 and 3: a peripheral that reads on that very edge reads while the data moves
      const racy = (tt, mode) => tt.some(s => (s.lead && (mode & 1) === 1) || (!s.lead && (mode & 1) === 0));
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const cmp = ctl.values.cmp, hz = ctl.values.hz, lsb = ctl.values.lsb, out = Math.round(ctl.values.out) & 255, inb = Math.round(ctl.values.inb) & 255;
        const M = 10, W = st.W - 2 * M;
        const want = k => (out >> (lsb ? k : 7 - k)) & 1;
        const readByte = (sp, tt, line) => { let v = 0; tt.forEach((s, k) => { const bit = P.levelAt(line, s.t + sp.tBit * 0.02); v |= bit << (lsb ? k : 7 - k); }); return v; };
        if (!cmp) {
          const mode = +ctl.values.mode, pm = duplexView || +ctl.values.pmode < 0 ? mode : +ctl.values.pmode;
          const sp = P.spi({ mode, hz, bytes: [out], miso: [inb], lsbFirst: lsb });
          const traces = [{ label: 'CS', edges: sp.cs }, { label: 'SCK', edges: sp.sck },
            { label: 'MOSI', edges: sp.mosi, marks: [{ t0: sp.marks[0].t0, t1: sp.marks[0].t1, text: hex2(out) }] },
            { label: 'MISO', edges: sp.miso, marks: [{ t0: sp.marks[0].t0, t1: sp.marks[0].t1, text: hex2(inb), color: TINT.device }] }];
          const lg = S.logic(c, M, 6, W, st.H - 84, traces, { t0: sp.cs[0][0], t1: sp.t1, labelW: 46, grid: 8 });
          const per = readTimes(sp, mode, pm), ctlT = readTimes(sp, mode, mode);
          const got = readByte(sp, per, sp.mosi), gotC = readByte(sp, ctlT, sp.miso), th = lg.rowH * 0.5, race = racy(per, mode);
          const col = ok => (race ? (ok ? C.warn : C.bad) : (ok ? C.ok : C.bad));
          per.forEach((s, k) => {
            const lvl = P.levelAt(sp.mosi, s.t + sp.tBit * 0.02), x = lg.X(s.t), okBit = lvl === want(k);
            vline(c, x, lg.plot.y, lg.plot.y + lg.plot.h, col(okBit), 1.1);
            tri(c, x, lg.rowY(1) + th * 0.5, s.rising, col(okBit), 5);
            kit.dot(c, x, lg.rowY(2) + th * (1 - lvl), 3.8, col(okBit), C.bg2);
          });
          ctlT.forEach(s => kit.dot(c, lg.X(s.t), lg.rowY(3) + th * (1 - P.levelAt(sp.miso, s.t + sp.tBit * 0.02)), 3.8, C.warn, C.bg2));
          para(kit, c, 'triangles: the edge on which the peripheral reads · dots: the bit it reads there (amber dots on MISO: the controller reading)', M + 46, st.H - 70, W - 46, 12.5, { size: 10.5, color: C.muted });
          para(kit, c, race ? 'The peripheral reads on an edge where the data is changing: ' + hex2(got) + (got === out ? ' this time, but it is a race — unreliable' : ' instead of ' + hex2(out) + ' — wrong mode, and no error')
            : 'peripheral reads ' + hex2(got) + '  ✓ as sent: it reads in the middle of each bit', M + 46, st.H - 36, W - 46, 15, { size: 12.5, weight: 650, color: race ? (got === out ? C.warn : C.bad) : C.ok });
          ro.set('mode', 'mode ' + mode + ': CPOL ' + (mode >> 1) + ', CPHA ' + (mode & 1));
          ro.set('idle', mode >> 1 ? 'high' : 'low');
          ro.set('edge', per[0].rising ? 'the rising edge' + (pm !== mode ? ' (peripheral mode ' + pm + ')' : '') : 'the falling edge' + (pm !== mode ? ' (peripheral mode ' + pm + ')' : ''));
          ro.set('per', hex2(got) + (race ? (got === out ? ' (a race: right by luck)' : ' ✗ (sent ' + hex2(out) + ')') : ' ✓'));
          ro.set('ctl', hex2(gotC) + (gotC === inb ? ' ✓' : ' ✗'));
        } else {
          const sps = [0, 1, 2, 3].map(m => P.spi({ mode: m, hz, bytes: [out], miso: [0], lsbFirst: lsb }));
          const traces = [];
          sps.forEach((sp, m) => { traces.push({ label: 'SCK ' + m, edges: sp.sck }); traces.push({ label: 'MOSI ' + m, edges: sp.mosi, marks: m === 0 ? [{ t0: sp.marks[0].t0, t1: sp.marks[0].t1, text: hex2(out) }] : [] }); });
          const lg = S.logic(c, M, 6, W, st.H - 62, traces, { t0: sps[0].cs[0][0], t1: sps[0].t1, labelW: 56, grid: 8 });
          const th = lg.rowH * 0.5;
          sps.forEach((sp, m) => {
            readTimes(sp, m, m).forEach((s, k) => {
              const x = lg.X(s.t);
              tri(c, x, lg.rowY(2 * m) + th * 0.5, s.rising, C.ok, 4.5);
              vline(c, x, lg.rowY(2 * m), lg.rowY(2 * m + 1) + th, C.ok, 1);
              kit.dot(c, x, lg.rowY(2 * m + 1) + th * (1 - P.levelAt(sp.mosi, s.t + sp.tBit * 0.02)), 3.4, C.ok, C.bg2);
            });
          });
          para(kit, c, 'modes 0 and 3 read on the rising edge, modes 1 and 2 on the falling edge; 0 and 1 rest low, 2 and 3 rest high', M + 56, st.H - 40, W - 56, 14, { size: 11.5, color: C.text2 });
          ro.set('mode', 'all four');
          ro.set('idle', 'modes 0, 1: low · modes 2, 3: high');
          ro.set('edge', 'modes 0, 3: rising · modes 1, 2: falling');
          ro.set('per', hex2(out) + ' ✓ (each mode read in its own way)');
          ro.set('ctl', '—');
        }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ub-spibus */
  Hyper.sim('ub-spibus', {
    title: 'Two peripherals on one SPI bus',
    blurb: `A display and a second peripheral share **SCK, MOSI and MISO**; each has its own **chip select**. The analyser shows one transaction to each, **each with its own time scale** (the second is much slower). The wire levels are real; what a misconfigured part would read is only described.

**Try this**
- With **one chip select at a time**, each part sees only its own bytes. Note how SCK rests low for the display (mode 0) and, for the accelerometer, **high** (mode 3): the controller changes its settings between the two.
- Choose **both chip selects low**: both parts listen to the display's bytes, and both may answer on MISO. The red band is two outputs fighting.
- Choose **the deselected part keeps driving MISO**: its reply lands on the display's transaction.
- Untick **set speed and mode for each transaction**: the second part is spoken to in the display's mode and at the display's speed, and misreads.
- Pick the **SD card in start-up**: it must be clocked at 400 kHz or less until it is ready.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym, P = E.proto;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 500, maxH: 620 });
      const ctl = kit.controls(box.side, [
        { id: 'scn', type: 'select', label: 'What the program does', options: [['One chip select at a time (correct)', 'ok'], ['Both chip selects low at once (bug)', 'both'], ['The deselected part keeps driving MISO (bug)', 'drive']], value: params.scenario || 'ok' },
        { id: 'two', type: 'select', label: 'Second peripheral', options: [['Accelerometer: mode 3, up to 5 MHz', 'acc'], ['SD card in start-up: mode 0, 400 kHz or less', 'sd']], value: params.second || 'acc' },
        { id: 'own', type: 'check', label: 'Set speed and mode for each transaction', value: true },
        { id: 'hz', type: 'select', label: 'Display clock', options: [['10 MHz', 10e6], ['20 MHz', 20e6], ['40 MHz', 40e6]], value: 20e6 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['a', 'Display transaction'], ['b', 'Second transaction'], ['res', 'Outcome']]);
      const fmtHz = h => (h >= 1e6 ? h / 1e6 + ' MHz' : h / 1e3 + ' kHz');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const scn = ctl.values.scn, acc = ctl.values.two === 'acc', own = ctl.values.own, hzA = ctl.values.hz;
        const A = P.spi({ mode: 0, hz: hzA, bytes: [0x2A, 0x00, 0x10], miso: [0, 0, 0] });
        const modeB = own ? (acc ? 3 : 0) : 0, hzB = own ? (acc ? 1e6 : 400e3) : hzA;
        const bytesB = acc ? [0x80, 0x00] : [0x40, 0x00, 0x00, 0x00, 0x00, 0x95], replyB = acc ? [0x00, 0xE5] : [0xFF, 0xFF, 0xFF, 0xFF, 0xFF, 0x01];
        const B = P.spi({ mode: modeB, hz: hzB, bytes: bytesB, miso: replyB });
        const nameB = acc ? 'accelerometer' : 'SD card';
        const bad = !own && (acc || hzA > 400e3);
        const M = 10, W = st.W - 2 * M;
        // the boards and the wires
        const cw = Math.min(96, W * 0.18), cy = 24, ch = 62;
        S.box(c, M, cy, cw, ch, { label: 'ESP', sub: 'controller', color: kit.hue(150), active: true });
        const bx = M + cw, bEnd = M + W, yy = [14, 26, 38];
        ['SCK', 'MOSI', 'MISO'].forEach((n, i) => { S.wire(c, [[bx, yy[i]], [bEnd - 34, yy[i]]], { color: C.accent }); kit.label(c, n, bEnd - 30, yy[i], { size: 10, color: C.accent }); });
        const pw = (W - cw - 60) / 2, py = 62, pxA = bx + 24, pxB = pxA + pw + 14;
        [[pxA, 'Display', 'mode 0 · ' + fmtHz(hzA), 150], [pxB, acc ? 'Accelerometer' : 'SD card', acc ? 'mode 3 · 1 MHz' : 'mode 0 · 400 kHz', 212]].forEach(([px, nm, sub, hu]) => {
          [0.2, 0.5, 0.8].forEach((f, k) => S.wire(c, [[px + pw * f, yy[k]], [px + pw * f, py]], { color: C.accent }));
          S.box(c, px, py, pw, 44, { label: nm, sub, color: kit.hue(hu), size: 11.5 });
        });
        S.wire(c, [[M + cw * 0.3, cy + ch], [M + cw * 0.3, 122], [pxA + pw / 2, 122], [pxA + pw / 2, py + 44]], { color: kit.hue(150) });
        S.wire(c, [[M + cw * 0.7, cy + ch], [M + cw * 0.7, 132], [pxB + pw / 2, 132], [pxB + pw / 2, py + 44]], { color: kit.hue(212) });
        kit.label(c, 'CS display', M + cw * 0.3 + 4, 117, { size: 10, color: kit.hue(150) });
        kit.label(c, 'CS second', M + cw * 0.7 + 4, 141, { size: 10, color: kit.hue(212) });
        // two transactions, each with its own time scale
        const top = 154, blk = Math.floor((st.H - top - 54) / 2), head = 15;
        const rnd = lcg(5);
        const block = (y, title, X, csD, csS, miso, marks, misoMarks, flag) => {
          kit.label(c, title, M, y + 6, { size: 11.5, weight: 650, color: flag ? C.bad : C.text });
          return S.logic(c, M, y + head, W, blk - head, [
            { label: 'CS disp', edges: csD }, { label: 'CS 2nd', edges: csS }, { label: 'SCK', edges: X.sck },
            { label: 'MOSI', edges: X.mosi, marks }, { label: 'MISO', edges: miso, marks: misoMarks }], { t0: X.cs[0][0], t1: X.t1, labelW: 56, grid: 8 });
        };
        const high = X => [[X.cs[0][0], 1]];
        // transaction 1: the display
        let misoA = A.miso;
        if (scn !== 'ok') { misoA = [[A.cs[0][0], 0]]; for (let k = 0; k < 20; k++) misoA.push([A.cs[1][0] + (k + 0.5) * (A.t1 - A.cs[1][0]) / 20, rnd() < 0.5 ? 0 : 1]); }
        const lgA = block(top, 'Transaction 1: the display, mode 0, ' + fmtHz(hzA), A, A.cs, scn === 'both' ? A.cs : high(A), misoA,
          A.marks.map(m => ({ t0: m.t0, t1: m.t1, text: m.text })), [], false);
        if (scn !== 'ok') {
          const th = lgA.rowH * 0.5, xa = lgA.X(A.cs[1][0]), xb = lgA.X(A.cs[A.cs.length - 1][0]);
          c.fillStyle = 'rgba(229,72,77,.30)'; c.fillRect(xa, lgA.rowY(4) - 2, xb - xa, th + 4);
          kit.label(c, scn === 'both' ? 'two outputs on MISO' : 'the ' + nameB + ' drives MISO', (xa + xb) / 2, lgA.rowY(4) + th + 10, { size: 10, color: C.bad, align: 'center', weight: 650 });
        }
        // transaction 2: the second part
        block(top + blk + 6, 'Transaction 2: the ' + nameB + ', mode ' + modeB + ', ' + fmtHz(hzB) + (own ? '' : ' (the display\'s settings)'), B, high(B), B.cs, B.miso,
          B.marks.map(m => ({ t0: m.t0, t1: m.t1, text: m.text, color: bad ? TINT.bad : null })),
          B.marks.map(m => ({ t0: m.t0, t1: m.t1, text: m.text, color: TINT.device })), bad);
        const good = scn === 'ok' && !bad;
        const text = scn === 'both' ? 'Both parts take the display\'s bytes as their own command, and two outputs drive MISO.'
          : scn === 'drive' ? 'A part that is not selected must let go of MISO: here it corrupts the display\'s transaction.'
          : bad ? (acc ? 'The accelerometer needs mode 3 and at most 5 MHz, but is addressed in mode 0 at the display\'s speed: it reads shifted bytes.' : 'The card is clocked at the display\'s speed during start-up: it cannot follow and never answers properly.')
          : 'Only one part listens at a time, each with its own settings: it works.';
        para(kit, c, text, M, st.H - 36, W, 15, { size: 12, weight: 650, color: good ? C.ok : C.bad });
        ro.set('a', 'mode 0 · ' + fmtHz(hzA) + ' · 3 bytes · ' + fmtT(A.t1 - A.cs[1][0]));
        ro.set('b', 'mode ' + modeB + ' · ' + fmtHz(hzB) + ' · ' + bytesB.length + ' bytes · ' + fmtT(B.t1 - B.cs[1][0]));
        ro.set('res', good ? 'works' : scn === 'both' ? 'both listen; MISO contention' : scn === 'drive' ? 'MISO corrupted' : 'the second part misreads');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ub-onewire */
  Hyper.sim('ub-onewire', {
    title: '1-Wire: reset, presence and bits',
    blurb: `One wire, pulled high by a resistor. The controller starts everything by pulling the line low: a **long** low (480 µs) is a reset, to which the part answers with a **presence pulse**; after that every bit is a 70 µs slot started by a falling edge, a short low for a **1**, a long low for a **0**, least significant bit first. Pink marks are bytes the *sensor* sends back.

**Try this**
- Choose **Reset only** and zoom on *Reset and presence*: the 480 µs low, then the sensor's answer 60 µs after the release.
- Untick **A DS18B20 is on the wire**: the reset gets no answer and the exchange stops there.
- Zoom on *The first byte*: for 0xCC (binary 11001100, sent from the right) read the slots — two long, two short, two long, two short.
- Choose **Read ROM**: the sensor sends its 64-bit identity, family code 0x28 first and a CRC last.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym, P = E.proto;
      const st = kit.stage(box.stage, { aspect: 0.58, minH: 330, maxH: 430 });
      const ROM =[0x28, 0xFF, 0x1A, 0x2B, 0x3C, 0x04, 0x00];
      ROM.push(E.crc8(ROM));
      const CMDS = { reset: { out: [], back: [] }, convert: { out: [0xCC, 0x44], back: [] }, scratch: { out: [0xCC, 0xBE], back: [0x91, 0x01] }, rom: { out: [0x33], back: ROM } };
      const ctl = kit.controls(box.side, [
        { id: 'cmd', type: 'select', label: 'Exchange', options: [['Reset only', 'reset'], ['Skip ROM, Convert T: 0xCC 0x44', 'convert'], ['Skip ROM, Read Scratchpad: 0xCC 0xBE', 'scratch'], ['Read ROM: 0x33', 'rom']], value: params.cmd || 'convert' },
        { id: 'view', type: 'select', label: 'Zoom', options: [['The whole exchange', 'all'], ['Reset and presence', 'reset'], ['The first byte', 'byte']], value: params.view || 'all' },
        { id: 'dev', type: 'check', label: 'A DS18B20 is on the wire', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['time', 'On the wire'], ['rate', 'Speed'], ['pres', 'Presence'], ['bytes', 'Bytes']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const k = CMDS[ctl.values.cmd], dev = ctl.values.dev, M = 10, W = st.W - 2 * M;
        const bytes = dev ? k.out.concat(k.back) : [];
        const ow = P.onewire(bytes, {});
        let edges = ow.edges;
        let marks = ow.marks.map((m, j) => {
          if (j === 0) return { t0: m.t0, t1: m.t1, text: 'reset', color: TINT.warn };
          if (j === 1) return { t0: m.t0, t1: m.t1, text: 'presence', color: TINT.ok };
          const own = j - 2 < k.out.length;
          return { t0: m.t0, t1: m.t1, text: (own ? '' : '← ') + m.text, color: own ? null : TINT.device };
        });
        if (!dev) {
          edges = edges.filter(e => Math.abs(e[0] - 540e-6) > 1e-9 && Math.abs(e[0] - 660e-6) > 1e-9);
          marks = [{ t0: 0, t1: 480e-6, text: 'reset', color: TINT.warn }, { t0: 480e-6, t1: 960e-6, text: 'no presence', color: TINT.bad }];
        }
        let t0 = -100e-6, t1 = (dev ? ow.t1 : 1000e-6) + 100e-6;
        const firstByte = dev && bytes.length ? bytes[0] : null;
        if (ctl.values.view === 'reset') t1 = 1000e-6;
        if (ctl.values.view === 'byte' && firstByte != null) {
          t0 = 940e-6; t1 = 960e-6 + 8 * 70e-6 + 30e-6;
          marks = [];
          for (let i = 0; i < 8; i++) { const v = (firstByte >> i) & 1; marks.push({ t0: 960e-6 + i * 70e-6, t1: 960e-6 + (i + 1) * 70e-6, text: 'bit ' + i + ' = ' + v, color: v ? null : TINT.start }); }
        } else if (ctl.values.view === 'byte') t1 = 1000e-6;
        // the little circuit
        const by = 6, bh = 44;
        S.box(c, M, by, 90, bh, { label: 'ESP', sub: 'GPIO4', color: kit.hue(150) });
        const sx = M + W - 120;
        S.box(c, sx, by, 120, bh, { label: 'DS18B20', sub: dev ? 'on the wire' : 'not connected', color: dev ? kit.hue(212) : C.faint, dash: !dev });
        S.wire(c, [[M + 90, by + bh / 2], [dev ? sx : sx - 20, by + bh / 2]], { color: C.accent, dash: !dev });
        kit.label(c, '4.7 kΩ pull-up to 3V3 · one data wire + ground', M + 90 + (sx - M - 90) / 2, by + bh / 2 - 12, { size: 10.5, color: C.muted, align: 'center' });
        const ly = by + bh + 14, lh = st.H - ly - 62;
        const lg = S.logic(c, M, ly, W, Math.max(110, lh), [{ label: 'DQ', edges, marks }], { t0, t1, labelW: 40, grid: 10 });
        const caption = !dev ? 'The controller pulls the line low for 480 µs, lets go, and no part answers: the line simply stays high.'
          : ctl.values.view === 'byte' ? 'Each slot is 70 µs: a bit starts with a falling edge from the controller; a short low (6 µs here) is a 1, a long low (60 µs) is a 0. Least significant bit first.'
          : ctl.values.view === 'reset' ? 'Reset: low for 480 µs; then the part waits 60 µs and pulls the line low for 120 µs: "somebody is here".'
          : 'Reset and presence, then the bytes: each is eight 70 µs slots. Pink bytes are the sensor\'s answer.';
        para(kit, c, caption, M, ly + Math.max(110, lh) + 12, W, 14, { size: 11, color: C.text2 });
        // numbers
        const nb = bytes.length;
        ro.set('time', fmtT(dev ? ow.t1 : 960e-6) + (ctl.values.cmd === 'convert' && dev ? ' + 750 ms of conversion' : ''));
        ro.set('rate', '70 µs per bit: 14.3 kbit/s, 1.8 kB/s');
        ro.set('pres', dev ? 'yes: low for 120 µs, 60 µs after the release' : 'none: the line goes straight back high');
        ro.set('bytes', nb ? bytes.map(b => hex2(b).slice(2)).join(' ') + (ctl.values.cmd === 'scratch' && dev ? '  → ' + kit.fmt(((0x01 << 8) | 0x91) * 0.0625, 6) + ' °C' : '') : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ub-register */
  Hyper.sim('ub-register', {
    title: 'A chip is its registers',
    blurb: `A schematic MPU6050-style chip with three registers. **Click the bits** of the staged byte, then **write** it and **read back**. Below, the chip's two data bytes for the X acceleration are combined into a signed number and scaled by the sensitivity the range register selects.

**Try this**
- The chip **powers up asleep** (SLEEP set, 0x40): the data bytes stay at zero. Clear bit 6 and write 0x00 to PWR_MGMT_1 to wake it, then tilt the board.
- In ACCEL_CONFIG set bits 4:3 to 01 (0x08): the range becomes ±4 g and the sensitivity halves to 8192 counts per g — the same tilt gives a smaller raw number.
- Tilt the board to negative angles: the two bytes show a leading 1 and the signed value goes negative.
- Set bit 7 of PWR_MGMT_1 and write: the DEVICE_RESET bit clears itself and resets everything. WHO_AM_I accepts no writes.`,
    mount(box, kit, params) {
      params = params || {};
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 420, maxH: 520 });
      const REGS = {
        0x6B: { name: 'PWR_MGMT_1', labels: ['RESET', 'SLEEP', 'CYCLE', '—', 'TEMP', 'CLK2', 'CLK1', 'CLK0'], ro: false },
        0x1C: { name: 'ACCEL_CONFIG', labels: ['XA_ST', 'YA_ST', 'ZA_ST', 'AFS1', 'AFS0', '—', '—', '—'], ro: false },
        0x75: { name: 'WHO_AM_I', labels: ['—', 'ID5', 'ID4', 'ID3', 'ID2', 'ID1', 'ID0', '—'], ro: true }
      };
      const SENS = [16384, 8192, 4096, 2048], RANGE = ['±2 g', '±4 g', '±8 g', '±16 g'];
      const chip = { 0x6B: 0x40, 0x1C: 0x00, 0x75: 0x68 };
      let reg = 0x6B, staged = chip[reg], readVal = null, msg = 'The chip has just powered up: it is asleep.';
      const resetChip = () => { chip[0x6B] = 0x40; chip[0x1C] = 0x00; };
      const ctl = kit.controls(box.side, [
        { id: 'reg', type: 'select', label: 'Register', options: [['PWR_MGMT_1 (0x6B)', 0x6B], ['ACCEL_CONFIG (0x1C)', 0x1C], ['WHO_AM_I (0x75), read-only', 0x75]], value: 0x6B },
        { id: 'tilt', label: 'Tilt of the board (X axis)', min: -90, max: 90, step: 1, value: params.tilt != null ? params.tilt : 20, unit: '°' },
        { type: 'buttons', items: [{ id: 'write', label: 'Write the staged byte', primary: true }, { id: 'read', label: 'Read it back' }, { id: 'reset', label: 'Reset the chip' }] }
      ], (id, v) => {
        if (id === 'reg') { reg = v; staged = chip[reg]; readVal = null; msg = 'Register ' + hex2(reg) + ' selected: the staged byte starts as what the chip holds.'; }
        else if (id === 'write') {
          if (REGS[reg].ro) msg = 'WHO_AM_I is read-only: the write was ignored.';
          else if (reg === 0x6B && (staged & 0x80)) { resetChip(); msg = 'DEVICE_RESET was set: the chip reset itself, and the bit cleared on its own.'; }
          else { chip[reg] = staged; msg = 'Wrote ' + hex2(staged) + ' to ' + REGS[reg].name + '.'; }
          readVal = null;
        } else if (id === 'read') { readVal = chip[reg]; msg = 'Read back ' + hex2(readVal) + (readVal === staged ? ': it matches what was staged.' : ': it differs from the staged byte.'); }
        else if (id === 'reset') { resetChip(); readVal = null; staged = chip[reg]; msg = 'The chip was reset: every register is back to its reset value.'; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['reg', 'Register'], ['staged', 'Staged byte'], ['chip', 'The chip holds'], ['raw', 'X data, signed'], ['acc', 'Acceleration']]);
      let hits = [];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const R = REGS[reg], M = 10, W = st.W - 2 * M;
        const cell = Math.max(18, Math.min(38, (W - 190) / 8)), x0 = M + 92;
        hits = [];
        kit.label(c, hex2(reg) + '  ' + R.name, M, 14, { size: 13, weight: 650 });
        kit.label(c, R.ro ? 'read-only' : 'click a bit to flip it', M + W, 14, { size: 11, color: C.muted, align: 'right' });
        // the staged byte (clickable) and the chip's own byte
        let y = 30;
        kit.label(c, 'staged', x0 - 8, y + cell / 2, { size: 11.5, color: C.text2, align: 'right' });
        S.bits(c, x0, y, staged, { n: 8, cell, labels: R.labels });
        for (let i = 0; i < 8; i++) hits.push({ x: x0 + i * cell, y, w: cell, h: cell, bit: 7 - i });
        kit.label(c, hex2(staged), x0 + 8 * cell + 12, y + cell / 2, { size: 13, weight: 650, mono: true });
        y += cell + 34;
        kit.label(c, 'chip says', x0 - 8, y + cell / 2, { size: 11.5, color: C.text2, align: 'right' });
        if (readVal == null) {
          S.box(c, x0, y, 8 * cell, cell, { label: 'not read since the last write', color: C.faint, dash: true, size: 11 });
        } else {
          const diff = []; for (let i = 0; i < 8; i++) if (((readVal >> (7 - i)) & 1) !== ((staged >> (7 - i)) & 1)) diff.push(i);
          S.bits(c, x0, y, readVal, { n: 8, cell, hi: diff, color: C.ok });
          kit.label(c, hex2(readVal), x0 + 8 * cell + 12, y + cell / 2, { size: 13, weight: 650, mono: true });
        }
        y += cell + 14;
        y += para(kit, c, msg, M, y + 6, W, 14, { size: 11.5, color: C.text2 }) * 14 + 8;
        // what the chip's state means
        const sleeping = (chip[0x6B] & 0x40) !== 0, afs = (chip[0x1C] >> 3) & 3, sens = SENS[afs];
        y += para(kit, c, sleeping ? 'SLEEP = 1: the chip is asleep, data registers are not updated' : 'SLEEP = 0: awake and measuring', M, y, W, 14, { size: 11.5, color: sleeping ? C.warn : C.ok, weight: 600 }) * 14 + 3;
        y += para(kit, c, 'AFS_SEL = ' + afs + ': range ' + RANGE[afs] + ', ' + sens + ' counts per g', M, y, W, 14, { size: 11.5, color: C.text2, weight: 600 }) * 14 + 14;
        // the two data bytes and their meaning
        const tilt = ctl.values.tilt * Math.PI / 180, ax = Math.sin(tilt);
        const raw = sleeping ? 0 : clamp(Math.round(ax * sens), -32768, 32767), u = raw & 0xFFFF, hi = u >> 8, lo = u & 255;
        const val = E.signed((hi << 8) | lo, 16), g = val / sens, c2 = Math.max(16, Math.min(26, cell * 0.7));
        kit.label(c, 'ACCEL_XOUT_H  ' + hex2(0x3B), x0 - 8, y + c2 / 2, { size: 10.5, color: C.text2, align: 'right' });
        S.bits(c, x0, y, hi, { n: 8, cell: c2, color: C.accent });
        kit.label(c, hex2(hi), x0 + 8 * c2 + 10, y + c2 / 2, { size: 12, mono: true, weight: 600 });
        y += c2 + 6;
        kit.label(c, 'ACCEL_XOUT_L  ' + hex2(0x3C), x0 - 8, y + c2 / 2, { size: 10.5, color: C.text2, align: 'right' });
        S.bits(c, x0, y, lo, { n: 8, cell: c2, color: C.accent });
        kit.label(c, hex2(lo), x0 + 8 * c2 + 10, y + c2 / 2, { size: 12, mono: true, weight: 600 });
        y += c2 + 18;
        y += para(kit, c, '(' + hex2(hi) + ' << 8) | ' + hex2(lo) + ' = ' + hexN((hi << 8) | lo, 4) + ' = ' + ((hi << 8) | lo) + ' unsigned, ' + val + ' signed', M, y, W, 14, { size: 11.5, color: C.text, mono: true }) * 14 + 4;
        para(kit, c, val + ' ÷ ' + sens + ' = ' + kit.fmt(g, 3) + ' g' + (sleeping ? ' (the chip is asleep: nothing is measured)' : ''), M, y, W, 15, { size: 12, weight: 650, color: sleeping ? C.warn : C.ok });
        ro.set('reg', hex2(reg) + ' ' + R.name);
        ro.set('staged', hex2(staged) + ' = ' + staged.toString(2).padStart(8, '0'));
        ro.set('chip', hex2(chip[reg]) + ' = ' + chip[reg].toString(2).padStart(8, '0'));
        ro.set('raw', hexN((hi << 8) | lo, 4) + ' → ' + val);
        ro.set('acc', kit.fmt(g, 3) + ' g');
      }, box.stage);
      kit.click(st, p => {
        const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h);
        if (h && !REGS[reg].ro) { staged ^= 1 << h.bit; readVal = null; msg = 'Staged ' + hex2(staged) + ': not written yet.'; loop.once(); }
        else if (h) { msg = 'WHO_AM_I is read-only: its bits cannot be staged.'; loop.once(); }
      }, p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
