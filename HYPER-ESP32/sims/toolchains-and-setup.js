/* HYPER-ESP32 · sims/toolchains-and-setup.js
 *
 *   ts-build-pipeline  a program travelling from source to a running chip: compiled C++ against interpreted MicroPython
 *   ts-auto-reset      DTR and RTS of the serial bridge pressing EN and the boot pin: the auto-reset sequence
 *   ts-baud-garbage    a serial line read at the wrong baud rate: the text turns to garbage
 *   ts-tools-menu      Tools-menu options as switches, and what they do to the flash map and to the symptoms
 *   ts-repl-upload     one idea tried by compile-and-upload, by file copy, at the prompt, and by saving to a drive
 *   ts-flash-image     what esptool writes where, per chip and per kind of image
 *
 * Numbers come from kit.esp (partitions, UART edges); the rest is schematic and says so in the blurbs.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- small helpers */
  // wrapped text, left aligned: -> the y below the last line
  function wrap(c, text, x, y, maxW, lh, o) {
    o = o || {};
    c.save();
    c.font = (o.weight || 500) + ' ' + (o.size || 12) + 'px ' + (o.mono ? 'Consolas, "Cascadia Code", monospace' : 'system-ui, "Segoe UI", sans-serif');
    c.fillStyle = o.color || '#888'; c.textAlign = 'left'; c.textBaseline = 'top';
    const words = String(text).split(/\s+/);
    let line = '', yy = y;
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxW && line) { c.fillText(line, x, yy); line = w; yy += lh; } else line = t;
    }
    if (line) { c.fillText(line, x, yy); yy += lh; }
    c.restore();
    return yy;
  }
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const ease = x => x * x * (3 - 2 * x);
  const hex = n => '0x' + Math.round(n).toString(16);
  function dur(s) {
    if (!(s >= 0)) return '—';
    if (s < 0.95) return (s * 1000 < 10 ? (s * 1000).toFixed(1) : Math.round(s * 1000)) + ' ms';
    if (s < 60) return (s < 10 ? s.toFixed(1) : Math.round(s)) + ' s';
    const m = Math.floor(s / 60), r = Math.round(s - m * 60);
    return m + ' min ' + (r < 10 ? '0' : '') + r + ' s';
  }
  function kb(n) { return n >= 1048576 ? (n / 1048576).toFixed(n % 1048576 ? 2 : 0) + ' MB' : Math.round(n / 1024) + ' KB'; }

  /* ================================================================ ts-build-pipeline */
  const PIPE = {
    cpp: [
      { name: 'Edit', file: 'sketch.ino', where: 'pc', text: 'You write setup() and loop() as text: a few hundred bytes.' },
      { name: 'Compile', file: 'sketch.o', where: 'pc', text: 'The compiler turns each source file into machine code for this chip: Xtensa for the ESP32, S2 and S3, RISC-V for the C and H series.' },
      { name: 'Link', file: 'firmware.elf', where: 'pc', text: 'The linker joins your code with the Arduino core, FreeRTOS, the radio stacks and your libraries, and fixes every address. The .elf also carries names and debug data that stay on the computer.' },
      { name: 'Binary', file: 'firmware.bin', where: 'pc', text: 'The .elf is reduced to the image the chip needs: a few hundred kilobytes even for blink, because the core comes with it.' },
      { name: 'Upload', file: 'esptool', where: 'cable', text: 'The chip is put into download mode and esptool sends the image over the serial line; the ROM bootloader writes it into flash.' },
      { name: 'Boot', file: 'running', where: 'chip', text: 'Reset: the boot ROM starts the bootloader, which starts your application. setup() runs once, then loop() for ever.' }
    ],
    py: [
      { name: 'Edit', file: 'main.py', where: 'pc', text: 'You write the program as text: a few hundred bytes.' },
      { name: 'Copy', file: 'main.py', where: 'cable', text: 'Thonny or mpremote writes the file into the chip\'s file system over the serial line. No compiler, no linker, no change to the firmware.' },
      { name: 'Run', file: 'running', where: 'chip', text: 'The interpreter, on the chip since you flashed MicroPython, translates the file to bytecode in RAM and runs it.' }
    ]
  };
  const WHERE = { pc: ['your computer', 212], cable: ['the cable', 40], chip: ['the chip', 150] };

  Hyper.sim('ts-build-pipeline', {
    title: 'From source to a running chip',
    blurb: `A program travels left to right. Blue stages happen on **your computer**, the amber one on **the cable**, green on **the chip**. The picture is schematic: the stages are real, the sizes are typical, not measured.

**Try this**
- Press *Send it to the chip* with **Arduino C++**: four stages happen before anything reaches the chip, and what travels is the whole image.
- Switch to **MicroPython**: the interpreter is already on the chip, so only the file travels, and there is nothing to compile.
- Change one line in your mind and send again: C++ repeats the whole chain, MicroPython only the copy.
- Slow the playback down to read what each stage does.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 330, maxH: 500 });
      let t = 0;                                   // token position in stages, 0 … n - 1
      const ctl = kit.controls(box.side, [
        { id: 'lang', type: 'select', label: 'Language', options: [['Arduino C++ (compiled)', 'cpp'], ['MicroPython (interpreted)', 'py']], value: params && params.lang === 'py' ? 'py' : 'cpp' },
        { id: 'speed', label: 'Playback speed', min: 0.3, max: 3, step: 0.1, value: 1, unit: '×' },
        { type: 'buttons', items: [{ id: 'run', label: 'Send it to the chip', primary: true }] }
      ], id => { if (id === 'run' || id === 'lang') { t = 0; loop.start(); } });
      const ro = kit.readout(box.side, [['now', 'Stage'], ['where', 'Where it happens'], ['cable', 'Travels over the cable'], ['again', 'Change one line, then']]);
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors();
        const L = ctl.values.lang === 'py' ? 'py' : 'cpp', P = PIPE[L], n = P.length;
        t = Math.min(n - 1, t + dt * ctl.values.speed * 0.8);
        const i = Math.min(n - 1, Math.floor(t)), m = ease(clamp((t - i - 0.45) / 0.55, 0, 1));
        const pos = i + (i < n - 1 ? m : 0), cur = Math.min(n - 1, Math.round(pos));
        // legend
        const M = 12, gap = 20, W = st.W - 2 * M, bh = 54;
        let lx = M;
        for (const key of ['pc', 'cable', 'chip']) {
          c.fillStyle = kit.hue(WHERE[key][1]); c.fillRect(lx, 11, 10, 10);
          kit.label(c, WHERE[key][0], lx + 15, 16, { size: 11, color: C.text2, align: 'left' });
          lx += 28 + WHERE[key][0].length * 6.4;
        }
        // the boxes
        const cols = (n <= 3 || W >= 620) ? n : Math.ceil(n / 2), rows = Math.ceil(n / cols), bw = (W - (cols - 1) * gap) / cols, top = 38, rowGap = 40;
        const boxes = P.map((s, k) => ({ x: M + (k % cols) * (bw + gap), y: top + Math.floor(k / cols) * (bh + rowGap), s }));
        boxes.forEach((b, k) => {
          const hue = WHERE[b.s.where][1];
          S.box(c, b.x, b.y, bw, bh, { label: b.s.name, sub: b.s.file, color: kit.hue(hue), active: k === cur, fill: k < cur ? kit.hue(hue, 0.16) : undefined, size: 12.5 });
        });
        for (let k = 0; k < n - 1; k++) {
          const a = boxes[k], b = boxes[k + 1];
          if (Math.abs(a.y - b.y) < 1) kit.arrow(c, a.x + bw + 2, a.y + bh / 2, b.x - 2, b.y + bh / 2, C.muted, 1.6);
          else { S.wire(c, [[a.x + bw / 2, a.y + bh + 1], [a.x + bw / 2, a.y + bh + rowGap / 2], [b.x + bw / 2, a.y + bh + rowGap / 2], [b.x + bw / 2, b.y - 9]], { color: C.muted, width: 1.6 }); kit.arrow(c, b.x + bw / 2, b.y - 10, b.x + bw / 2, b.y - 1, C.muted, 1.6); }
        }
        // the token: the file as it is at this stage
        const f = Math.min(n - 2, Math.floor(pos)), g = n > 1 ? pos - f : 0, A = boxes[Math.max(0, f)], B = boxes[Math.min(n - 1, f + 1)];
        const tx = A.x + bw / 2 + (B.x - A.x) * (n > 1 ? g : 0), ty = A.y - 2 + (B.y - A.y) * (n > 1 ? g : 0);
        S.box(c, tx - 36, ty - 13, 72, 20, { label: P[cur].file, size: 10.5, active: true, color: C.accent, r: 10, fill: C.dark ? '#1c2350' : '#e6eaff' });
        // the interpreter, already on the chip
        let by = top + rows * (bh + rowGap) - rowGap + 14;
        if (L === 'py') {
          const fx = boxes[1].x, fw = boxes[2].x + bw - fx;
          S.wire(c, [[boxes[2].x + bw / 2, boxes[2].y + bh + 1], [boxes[2].x + bw / 2, by]], { color: kit.hue(150), dash: true });
          S.box(c, fx, by, fw, 36, { label: 'MicroPython firmware', sub: 'the interpreter, flashed once', color: kit.hue(150), active: cur === 2, size: 12 });
          by += 50;
        } else by += 4;
        // what the current stage does
        kit.label(c, (cur + 1) + '.  ' + P[cur].name, M, by + 6, { size: 14, weight: 650, align: 'left' });
        wrap(c, P[cur].text, M, by + 22, W, 17, { size: 12.5, color: C.text2 });
        ro.set('now', P[cur].name + ' (' + P[cur].file + ')');
        ro.set('where', WHERE[P[cur].where][0]);
        ro.set('cable', L === 'cpp' ? 'the whole image, a few hundred KB' : 'only main.py, a few KB at most');
        ro.set('again', L === 'cpp' ? 'compile, link and upload again' : 'copy the file again');
        if (t >= n - 1 - 1e-9) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ts-auto-reset */
  // steps: [time ms, input a, input b]; the circuit maps (DTR, RTS) to (EN, boot pin) as two transistors do
  const RESET_MODES = {
    upload: { name: 'Start an upload', a: 'DTR', b: 'RTS', circuit: true, t1: 300, steps: [[0, 0, 0], [50, 0, 1], [150, 1, 0], [200, 0, 0]],
      text: 'esptool asserts RTS: the circuit pulls EN low and holds the chip in reset. Then it swaps: DTR on, RTS off. EN rises while DTR holds the boot pin low, so the chip samples "low" at that instant and enters download mode. DTR is released, and the upload begins.' },
    run: { name: 'Restart and run', a: 'DTR', b: 'RTS', circuit: true, t1: 300, steps: [[0, 0, 0], [50, 0, 1], [150, 0, 0]],
      text: 'After the upload esptool asserts RTS alone: EN goes low and comes back, while the boot pin stays high. The chip samples "high" and starts the program it has just received.' },
    'terminal-dtr': { name: 'Terminal opens: DTR first', a: 'DTR', b: 'RTS', circuit: true, t1: 300, steps: [[0, 0, 0], [50, 1, 0], [100, 1, 1]],
      text: 'A terminal asserts DTR, then RTS. DTR alone lowers the boot pin, but EN never falls, so nothing is sampled; with both asserted, neither line is pulled. The program keeps running.' },
    'terminal-rts': { name: 'Terminal opens: RTS first', a: 'DTR', b: 'RTS', circuit: true, t1: 300, steps: [[0, 0, 0], [50, 0, 1], [100, 1, 1]],
      text: 'A terminal asserts RTS first, then DTR. RTS alone pulls EN low: a reset. When DTR follows, EN rises with the boot pin high, and the chip restarts its program. This is why some terminals restart the board when they open the port.' },
    hand: { name: 'By hand, no circuit', a: 'BOOT key', b: 'EN key', circuit: false, t1: 2000, steps: [[0, 0, 0], [300, 1, 0], [700, 1, 1], [1000, 1, 0], [1500, 0, 0]],
      text: 'Without the circuit your fingers do it: hold BOOT (boot pin low), tap EN (reset), release EN — the chip samples the boot pin low and enters download mode — then release BOOT. The time scale here is a second or two, not milliseconds.' }
  };
  function resetData(m) {
    const fn = m.circuit ? (d, r) => [(r && !d) ? 0 : 1, (d && !r) ? 0 : 1] : (boot, en) => [en ? 0 : 1, boot ? 0 : 1];
    const A = [], B = [], EN = [], IO = [], rows = [];
    for (const [t, a, b] of m.steps) { const [en, io] = fn(a, b); A.push([t, a]); B.push([t, b]); EN.push([t, en]); IO.push([t, io]); rows.push([t, en, io]); }
    const segs = [], reads = [];
    let cur = 'running', t0 = 0, prev = 1;
    for (const [t, en, io] of rows) {
      if (prev === 1 && en === 0) { segs.push([t0, t, cur]); cur = 'reset'; t0 = t; }
      else if (prev === 0 && en === 1) { segs.push([t0, t, 'reset']); cur = io ? 'running' : 'download'; t0 = t; reads.push([t, io]); }
      prev = en;
    }
    segs.push([t0, m.t1, cur]);
    return { A, B, EN, IO, segs, reads, last: cur, reset: segs.some(s => s[2] === 'reset') };
  }
  const STATE_LABEL = { running: 'running', reset: 'held in reset', download: 'download mode' };

  Hyper.sim('ts-auto-reset', {
    title: 'Auto-reset: DTR and RTS press the buttons',
    blurb: `The USB-serial bridge has two spare control lines, **DTR** and **RTS**. Two transistors on the board turn them into the two buttons of the chip: RTS alone pulls **EN** (reset) low, DTR alone pulls the **boot pin** low, and both together pull neither. The chip looks at the boot pin only at the instant EN rises (the marker on the traces).

The time axis is real for the circuit modes (esptool holds reset for about 100 ms and the boot pin for about 50 ms; terminals differ). Chips with built-in USB do the same inside their USB block, with no transistors.

**Try this**
- Play **Start an upload** and find the marker where the boot pin is low: that is download mode.
- Play **Restart and run**: the same reset, but the boot pin is high.
- Play **Terminal opens: RTS first**: a program restarts just because a terminal opened the port.
- Switch to **By hand** and do the same with your fingers, at human speed.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 450, maxH: 540 });
      let mode = RESET_MODES[params && params.mode] ? params.mode : 'upload', chip = 'esp32', tc = 0;
      let D = resetData(RESET_MODES[mode]);
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'What the computer does', options: [['esptool starts an upload', 'upload'], ['esptool restarts the chip to run', 'run'], ['A terminal opens the port: DTR first', 'terminal-dtr'], ['A terminal opens the port: RTS first', 'terminal-rts'], ['No circuit: BOOT and EN by hand', 'hand']], value: mode },
        { id: 'chip', type: 'select', label: 'Chip', options: [['ESP32 (boot pin GPIO0)', 'esp32'], ['ESP32-C3 (boot pin GPIO9)', 'esp32-c3']], value: 'esp32' },
        { id: 'speed', label: 'Playback speed', min: 0.25, max: 3, step: 0.05, value: 1, unit: '×' },
        { type: 'buttons', items: [{ id: 'play', label: 'Play', primary: true }] }
      ], (id, v) => {
        if (id === 'mode') { mode = v; D = resetData(RESET_MODES[mode]); tc = 0; loop.start(); }
        else if (id === 'chip') { chip = v; loop.once(); }
        else if (id === 'play') { tc = 0; loop.start(); }
      });
      const ro = kit.readout(box.side, [['inputs', 'Inputs now'], ['pins', 'EN · boot pin'], ['chip', 'The chip'], ['end', 'At the end']]);
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), m = RESET_MODES[mode], bootPin = chip === 'esp32' ? 'GPIO0' : 'GPIO9';
        tc = Math.min(m.t1, tc + dt * (m.t1 / 4) * ctl.values.speed);
        const lv = e => E.proto.levelAt(e, tc);
        const a = lv(D.A), b = lv(D.B), en = lv(D.EN), io = lv(D.IO);
        const M = 10, W = st.W - 2 * M;
        // the circuit
        const sw = Math.max(80, Math.min(120, W * 0.2)), cw = W - 2 * sw - 60, y = 8, h = 62;
        const bridge = S.box(c, M, y, sw, h, { label: m.circuit ? 'USB-serial' : 'bridge', sub: m.circuit ? 'bridge chip' : '(unused)', color: C.muted, dash: !m.circuit, size: 11.5 });
        const circ = S.box(c, M + sw + 30, y, cw, h, { label: m.circuit ? 'two transistors' : 'your fingers', sub: cw < 170 ? '' : (m.circuit ? 'DTR → boot pin · RTS → EN' : 'BOOT and EN keys'), color: C.muted, dash: !m.circuit, size: cw < 120 ? 10.5 : 11.5 });
        const chipB = S.box(c, st.W - M - sw, y, sw, h, { label: chip === 'esp32' ? 'ESP32' : 'ESP32-C3', sub: 'EN · ' + bootPin, color: kit.hue(8), active: true, size: 11.5 });
        const lineCol = v => (v ? C.accent : C.muted);
        S.wire(c, [[bridge.r[0], y + 20], [circ.l[0], y + 20]], { color: m.circuit ? lineCol(a) : C.faint, round: 0 });
        S.wire(c, [[bridge.r[0], y + 42], [circ.l[0], y + 42]], { color: m.circuit ? lineCol(b) : C.faint, round: 0 });
        S.wire(c, [[circ.r[0], y + 20], [chipB.l[0], y + 20]], { color: en ? C.ok : C.bad, round: 0 });
        S.wire(c, [[circ.r[0], y + 42], [chipB.l[0], y + 42]], { color: io ? C.ok : C.warn, round: 0 });
        kit.label(c, m.a, bridge.r[0] + 4, y + 11, { size: 10, color: C.muted, align: 'left' });
        kit.label(c, m.b, bridge.r[0] + 4, y + 33, { size: 10, color: C.muted, align: 'left' });
        kit.label(c, 'EN', circ.r[0] + 4, y + 11, { size: 10, color: C.muted, align: 'left' });
        kit.label(c, bootPin, circ.r[0] + 4, y + 33, { size: 10, color: C.muted, align: 'left' });
        // the traces
        const px = 74, pw = st.W - px - 14, t1 = m.t1, X = t => px + clamp(t / t1, 0, 1) * pw, y0 = 96, rh = 24, rg = 14;
        const rowsT = [[m.a, D.A, C.accent], [m.b, D.B, C.accent], ['EN', D.EN, C.ok], [bootPin, D.IO, C.warn]];
        rowsT.forEach(([label, edges, color], k) => S.wave(c, px, y0 + k * (rh + rg), pw, rh, edges, { t0: 0, t1, label, color, fill: true }));
        const yEnd = y0 + 4 * (rh + rg) - rg;
        // the instants at which the chip reads the boot pin
        for (const [t, v] of D.reads) {
          c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.3; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(t), y0 - 8); c.lineTo(X(t), yEnd + 8); c.stroke(); c.restore();
          kit.label(c, 'boot pin read: ' + (v ? 'high' : 'low'), clamp(X(t) + 4, px, st.W - 110), y0 - 12, { size: 10, color: C.warn, align: 'left' });
        }
        // what the chip is doing
        const sy = yEnd + 16;
        c.save();
        for (const [s0, s1, name] of D.segs) {
          const col = name === 'running' ? C.ok : name === 'reset' ? C.bad : C.warn;
          c.globalAlpha = 0.32; c.fillStyle = col; c.fillRect(X(s0), sy, Math.max(1, X(s1) - X(s0)), 24); c.globalAlpha = 1;
          if (X(s1) - X(s0) > 54) kit.label(c, STATE_LABEL[name], (X(s0) + X(s1)) / 2, sy + 12, { size: 10.5, color: C.text, align: 'center' });
        }
        c.restore();
        kit.label(c, 'the chip', px - 6, sy + 12, { size: 11, color: C.text2, align: 'right' });
        kit.label(c, '0', px, sy + 36, { size: 10, color: C.faint, align: 'left' });
        kit.label(c, kit.fmt(t1, 3) + ' ms', px + pw, sy + 36, { size: 10, color: C.faint, align: 'right' });
        // the cursor
        c.save(); c.strokeStyle = C.text; c.lineWidth = 1.3; c.beginPath(); c.moveTo(X(tc), y0 - 4); c.lineTo(X(tc), sy + 26); c.stroke(); c.restore();
        wrap(c, m.text, M, sy + 52, W, 17, { size: 12.5, color: C.text2 });
        // the numbers
        const seg = D.segs.find(s => tc >= s[0] && tc <= s[1]) || D.segs[D.segs.length - 1];
        ro.set('inputs', m.a + ' ' + (a ? (m.circuit ? 'asserted' : 'pressed') : (m.circuit ? 'off' : 'released')) + ' · ' + m.b + ' ' + (b ? (m.circuit ? 'asserted' : 'pressed') : (m.circuit ? 'off' : 'released')));
        ro.set('pins', 'EN ' + (en ? 'high' : 'LOW') + ' · ' + bootPin + ' ' + (io ? 'high' : 'LOW'));
        ro.set('chip', STATE_LABEL[seg[2]]);
        ro.set('end', STATE_LABEL[D.last] + (D.reset ? ' (after a reset)' : ' (no reset happened)'));
        if (tc >= m.t1 - 1e-9) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ts-baud-garbage */
  const BAUDS = [9600, 19200, 57600, 74880, 115200, 230400, 460800, 921600];
  const MSGS = ['Hello, ESP32!', 'temp:23.5,hum:48', 'LED is on'];
  // what a UART receiver does: find a start bit, sample the middle of each following bit at ITS baud rate
  function decodeUart(E, edges, rxBaud) {
    const tb = 1 / rxBaud, lv = t => E.proto.levelAt(edges, t), frames = [];
    let free = -Infinity;
    for (let i = 1; i < edges.length; i++) {
      if (!(edges[i - 1][1] === 1 && edges[i][1] === 0)) continue;
      const ts = edges[i][0];
      if (ts < free) continue;                                    // inside the frame being read
      if (lv(ts + 0.5 * tb) !== 0) { free = ts + 0.5 * tb; continue; }   // a glitch, not a start bit
      let byte = 0;
      const samples = [ts + 0.5 * tb];
      for (let k = 0; k < 8; k++) { const s = ts + (1.5 + k) * tb; samples.push(s); if (lv(s)) byte |= 1 << k; }
      const sStop = ts + 9.5 * tb;
      samples.push(sStop);
      frames.push({ t0: ts, byte, ok: lv(sStop) === 1, samples });
      free = sStop;
    }
    return frames;
  }

  Hyper.sim('ts-baud-garbage', {
    title: 'The wrong baud rate',
    blurb: `A UART has no clock wire. The monitor starts a clock of its own at each start bit and samples the **middle of every bit** at the baud rate you set. The trace shows the line as the program drives it; the amber ticks are where the monitor samples it.

**Try this**
- Keep both at 115200: every tick lands mid-bit and the text is clean.
- Set the monitor to 9600 with the program at 115200: the ticks are far too sparse and the text is garbage.
- Set the program to 9600 with the monitor at 115200: now the ticks are far too dense.
- Return to matching speeds and raise the **clock error**: a UART tolerates a few per cent, because over ten bits the error must stay under half a bit.
- 74880 is the speed at which the ESP8266's boot ROM prints; a monitor at 115200 shows its first line as garbage.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 440, maxH: 540 });
      const bopts = BAUDS.map(b => [String(b) + (b === 74880 ? ' (ESP8266 ROM)' : ''), b]);
      const ctl = kit.controls(box.side, [
        { id: 'msg', type: 'select', label: 'The program prints', options: MSGS.map(m => [m, m]), value: MSGS[0] },
        { id: 'tx', type: 'select', label: 'Program: Serial.begin(…)', options: bopts, value: 115200 },
        { id: 'rx', type: 'select', label: 'Monitor set to', options: bopts, value: 115200 },
        { id: 'err', label: 'Clock error of the program', min: -8, max: 8, step: 0.5, value: 0, unit: '%' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['ratio', 'Monitor ÷ program'], ['ok', 'Characters correct'], ['bit', 'Bit time: program · monitor'], ['verdict', 'Result']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const txA = v.tx * (1 + v.err / 100), rx = v.rx;
        const one = [];
        for (const ch of String(v.msg)) one.push(ch.charCodeAt(0) & 255);
        one.push(10);
        const bytes = one.concat(one, one);
        const wire = E.proto.uartBytes(bytes, { baud: txA, gap: 0, show: 'ascii' });
        const frames = decodeUart(E, wire.edges, rx);
        const chars = frames.map(f => (!f.ok ? '�' : f.byte === 10 ? '\n' : f.byte >= 32 && f.byte < 127 ? String.fromCharCode(f.byte) : '�'));
        const shown = chars.join('').split('\n'), sent = [v.msg, v.msg, v.msg];
        const good = frames.reduce((n, f, i) => n + (f.ok && f.byte === bytes[i] ? 1 : 0), 0), total = bytes.length;
        // the wire and the monitor's sample points
        const M = 12, W = st.W - 2 * M, tbTx = 1 / txA, tbRx = 1 / rx;
        const win = Math.min(Math.max(20 * Math.max(tbTx, tbRx), 24 * tbTx), 60 * tbTx);
        kit.label(c, 'the wire, and where the monitor samples it', M, 12, { size: 12, color: C.text2, weight: 600, align: 'left' });
        const lg = S.logic(c, M, 24, W, 118, [{ label: 'wire', edges: wire.edges, marks: wire.marks, color: C.accent }], { t0: 0, t1: win, grid: 12 });
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.6;
        for (const f of frames.slice(0, 6)) for (const t of f.samples) {
          if (t < 0 || t > win) continue;
          const x = lg.X(t), y = lg.rowY(0) + lg.rowH * 0.5 + 4;
          c.beginPath(); c.moveTo(x, y); c.lineTo(x, y + 11); c.stroke();
        }
        c.restore();
        // what was sent, what is shown
        const py = 24 + 118 + 18, pw = (W - 12) / 2, ph = 92, cap = Math.max(8, Math.floor((pw - 16) / 7.4));
        const panel = (x, title, lines, ok) => {
          S.box(c, x, py, pw, ph, { color: C.border2 || C.muted, fill: C.dark ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.05)', r: 6, size: 11 });
          kit.label(c, title, x + 8, py + 11, { size: 10.5, color: C.muted, align: 'left' });
          lines.slice(0, 4).forEach((ln, k) => S.text(c, ln.length > cap ? ln.slice(0, cap - 1) + '…' : ln || ' ', x + 8, py + 30 + k * 15, { mono: true, size: 12, align: 'left', color: ok ? C.ok : (/�/.test(ln) || !ln ? C.bad : C.text) }));
        };
        panel(M, 'the program printed', sent, true);
        panel(M + pw + 12, 'the monitor shows', shown, good === total);
        // the explanation
        const dev = Math.abs(v.err) / 100 * 9.5;
        let why;
        if (good === total && v.tx === v.rx && v.err === 0) why = 'Both ends use the same bit time, so every sample falls in the middle of a bit and the text is clean.';
        else if (good === total && v.tx === v.rx) why = 'The program\'s clock is ' + kit.fmt(Math.abs(v.err), 3) + ' % off. Over the ten bits of a byte the error adds up to ' + kit.fmt(dev, 2) + ' of a bit at the stop bit: under half a bit, so the text survives.';
        else if (v.tx === v.rx) why = 'The clocks are the same nominal speed, but a ' + kit.fmt(Math.abs(v.err), 3) + ' % error adds up to ' + kit.fmt(dev, 2) + ' bit by the stop bit. Past half a bit the monitor samples the wrong bit and the text breaks.';
        else why = 'The monitor measures bits of ' + kit.fmt(tbRx * 1e6, 3) + ' µs while the wire carries bits of ' + kit.fmt(tbTx * 1e6, 3) + ' µs. Its samples fall at the wrong moments, so the characters it decodes are not the ones sent.';
        wrap(c, why, M, py + ph + 14, W, 17, { size: 12.5, color: C.text2 });
        ro.set('ratio', v.tx === v.rx && v.err === 0 ? 'equal' : kit.fmt(rx / txA, 3) + ' ×');
        ro.set('ok', good + ' of ' + total);
        ro.set('bit', kit.fmt(tbTx * 1e6, 3) + ' µs · ' + kit.fmt(tbRx * 1e6, 3) + ' µs');
        ro.set('verdict', good === total ? 'readable' : good > 0 ? 'partly garbled' : 'garbage');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ts-tools-menu */
  const SETUPS = {
    esp32: { name: 'ESP32 DevKit: WROOM-32E, 4 MB, no PSRAM, USB bridge', flash: 4, psram: null, usb: false, first: 0x1000 },
    wrover: { name: 'ESP32-WROVER-E kit: 4 MB, 8 MB PSRAM, USB bridge', flash: 4, psram: 'quad', usb: false, first: 0x1000 },
    s3: { name: 'ESP32-S3 N16R8 board: 16 MB, octal PSRAM, chip USB only', flash: 16, psram: 'octal', usb: true, first: 0 },
    c3: { name: 'ESP32-C3 board: 4 MB, chip USB only', flash: 4, psram: null, usb: true, first: 0 }
  };
  const SCHEME_FOR = { 4: 'default-4m', 8: 'default-8m', 16: 'default-16m' };
  const SEV = { bad: 3, warn: 2, note: 1, ok: 0 };

  Hyper.sim('ts-tools-menu', {
    title: 'The Tools menu and the flash map',
    blurb: `Choose the board you have, then change the options as the Tools menu would. The flash map is the partition table that results (numbers from the same partition tables the Arduino core uses); the boxes on the right show what the sketch would see.

**Try this**
- Pick the **ESP32-S3 board** and leave *USB CDC On Boot* off: the Serial Monitor stays empty. Switch it on.
- Raise the **sketch size** past the app partition: *Sketch too big*. Choose a scheme with a bigger app (*Huge app*).
- On the **WROVER** kit leave PSRAM off, then switch it on; try the octal setting on it.
- Set **Flash Size** to 16 MB on a 4 MB module and watch the table run past the end.
- Tick *Erase all flash* and see which partitions are wiped.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 1, minH: 490, maxH: 580 });
      const schemes = E.PARTITION_SCHEMES;
      const ctl = kit.controls(box.side, [
        { id: 'setup', type: 'select', label: 'The board you have', options: Object.keys(SETUPS).map(k => [SETUPS[k].name, k]), value: 'esp32' },
        { id: 'flash', type: 'select', label: 'Flash Size', options: [['4 MB', 4], ['8 MB', 8], ['16 MB', 16]], value: 4 },
        { id: 'scheme', type: 'select', label: 'Partition Scheme', options: schemes.map(p => [p.name, p.id]), value: 'default-4m' },
        { id: 'psram', type: 'select', label: 'PSRAM', options: [['Disabled', 'off'], ['Enabled (quad)', 'quad'], ['OPI (octal)', 'octal']], value: 'off' },
        { id: 'cdc', type: 'check', label: 'USB CDC On Boot', value: false },
        { id: 'erase', type: 'check', label: 'Erase all flash before sketch upload', value: false },
        { id: 'sketch', label: 'Sketch size', min: 100, max: 3500, step: 50, value: 700, unit: 'KB' }
      ], (id, v) => {
        if (id === 'setup') {
          const s = SETUPS[v];
          ctl.set('flash', s.flash); ctl.set('scheme', SCHEME_FOR[s.flash]); ctl.set('psram', 'off'); ctl.set('cdc', false);
        }
        loop.once();
      });
      const ro = kit.readout(box.side, [['verdict', 'Outcome'], ['app', 'Sketch against app space'], ['serial', 'Serial Monitor'], ['psram', 'PSRAM'], ['files', 'File system'], ['why', 'What is wrong']]);
      const MB = 1048576;
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, S0 = SETUPS[v.setup] || SETUPS.esp32;
        const scheme = schemes.find(p => p.id === v.scheme) || schemes[0];
        const real = S0.flash * MB, chosen = v.flash * MB, pt = E.partitions(scheme.parts, chosen);
        const appMax = pt.appMax || 0, sketchB = v.sketch * 1024;
        // what goes wrong
        const issues = [];
        const tooBig = appMax > 0 && sketchB > appMax;
        if (pt.used > chosen) issues.push(['bad', 'flash', 'The scheme needs ' + kb(pt.used) + ' but Flash Size says ' + v.flash + ' MB: it does not fit.']);
        else if (pt.used > real) issues.push(['bad', 'flash', 'The table runs past the end of the real ' + S0.flash + ' MB: the bootloader reports a partition beyond the chip and the board does not start.']);
        if (v.flash > S0.flash && pt.used <= chosen) issues.push([pt.used > real ? 'bad' : 'warn', 'size', 'Flash Size ' + v.flash + ' MB, but the module has ' + S0.flash + ' MB: the image claims memory that is not there.']);
        else if (v.flash < S0.flash) issues.push(['note', 'size', (S0.flash - v.flash) + ' MB of the module\'s flash are never used.']);
        if (tooBig) issues.push(['bad', 'big', 'Sketch too big: ' + kb(sketchB) + ' against an app partition of ' + kb(appMax) + '. The build stops and nothing is uploaded.']);
        let serial;
        if (!S0.usb) serial = ['ok', 'Text appears: the bridge chip is wired to UART0.' + (v.cdc ? ' (This chip has no native USB: the option does nothing.)' : '')];
        else if (v.cdc) serial = ['ok', 'Text appears on the chip\'s own USB port.'];
        else serial = ['bad', 'The monitor stays empty: Serial is on the UART0 pins, and this board has only the chip\'s USB connector.'];
        let ps;
        const have = S0.psram;
        if (v.psram === 'off') ps = have ? ['note', 'PSRAM is off: psramFound() is false and the 8 MB stay unused.'] : ['ok', 'No PSRAM fitted, none enabled.'];
        else if (!have) ps = ['bad', 'PSRAM enabled, but this module has none: an error about PSRAM at start-up.'];
        else if (v.psram !== have) ps = ['bad', 'Wrong interface (' + (v.psram === 'quad' ? 'quad' : 'octal') + ' chosen, the module is ' + have + '): PSRAM is not found.'];
        else ps = ['ok', '8 MB of PSRAM found. ' + (have === 'octal' ? 'GPIO35–37 are taken by it.' : 'GPIO16 and 17 are taken by it.')];
        if (serial[0] === 'bad') issues.push(['bad', 'serial', serial[1]]);
        if (ps[0] === 'bad' || ps[0] === 'note') issues.push([ps[0], 'psram', ps[1]]);
        if (v.erase) issues.push(['note', 'erase', 'Erase all flash: saved settings, Wi-Fi credentials and files are wiped at the next upload.']);
        const worst = issues.reduce((m, x) => Math.max(m, SEV[x[0]]), 0);
        let verdict, vcol;
        if (tooBig) { verdict = 'Build stops: sketch too big'; vcol = C.bad; }
        else if (issues.some(x => x[1] === 'flash' && x[0] === 'bad') || issues.some(x => x[1] === 'size' && x[0] === 'bad')) { verdict = 'The board does not start'; vcol = C.bad; }
        else if (serial[0] === 'bad') { verdict = 'Runs, but the monitor is empty'; vcol = C.bad; }
        else if (ps[0] === 'bad') { verdict = 'Runs, but PSRAM is not found'; vcol = C.bad; }
        else if (worst >= 2) { verdict = 'Runs, with a mismatch to fix'; vcol = C.warn; }
        else { verdict = 'Builds, uploads and runs as intended'; vcol = C.ok; }
        // the layout: the map on the left (or on top), the boxes beside (or below)
        const M = 12, wide = st.W >= 560, lw = wide ? Math.floor(st.W * 0.54) : st.W - 2 * M, mapY = 38, mapH = wide ? st.H - mapY - 14 : 250;
        kit.label(c, 'Flash map: ' + v.flash + ' MB chosen, ' + S0.flash + ' MB on the module', M, 14, { size: 12, weight: 600, color: C.text2, align: 'left' });
        const layers = [{ label: 'bootloader', size: 1.4, color: 232, right: hex(S0.first) }, { label: 'partition table', size: 1, color: 232, right: '0x8000' }];
        let appLayer = -1;
        for (const r of pt.rows) {
          const beyond = r.end > real, data = r.type === 'data', wiped = v.erase && data && r.subtype !== 'ota';
          if (r.type === 'app' && appLayer < 0) appLayer = layers.length;
          layers.push({ label: r.name + (r.type === 'app' ? ' (app)' : '') + (wiped ? ' · erased' : ''), size: Math.sqrt(r.size / 4096), color: beyond ? 356 : r.type === 'app' ? 212 : (r.name === 'nvs' || r.subtype === 'ota' ? 280 : 150), right: hex(r.offset) + ' · ' + kb(r.size) });
        }
        if (pt.free > 0) layers.push({ label: 'unused', size: Math.max(0.6, Math.sqrt(pt.free / 4096) * 0.6), right: kb(pt.free) });
        const boxes = S.layers(c, M, mapY, lw, layers, { h: mapH, minRow: 17 });
        if (appLayer >= 0 && boxes[appLayer]) {
          const b = boxes[appLayer], frac = Math.min(1, sketchB / Math.max(1, appMax));
          c.save(); c.globalAlpha = 0.85; c.fillStyle = tooBig ? C.bad : C.accent; c.fillRect(b.x + 3, b.y + b.h - 8, Math.max(2, (b.w - 6) * frac), 5); c.restore();
          kit.label(c, 'sketch ' + Math.round(sketchB / Math.max(1, appMax) * 100) + ' %', b.x + b.w * 0.45, b.y + 9, { size: 10, color: tooBig ? C.bad : C.text2, align: 'center' });
        }
        // the boxes
        const rx = wide ? M + lw + 16 : M, rw = wide ? st.W - rx - M : st.W - 2 * M;
        let ry = wide ? mapY : mapY + mapH + 14;
        S.box(c, rx, ry, rw, 62, { color: C.border2 || C.muted, fill: C.dark ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.05)', r: 6 });
        kit.label(c, 'Serial Monitor', rx + 8, ry + 11, { size: 10.5, color: C.muted, align: 'left' });
        S.text(c, serial[0] === 'ok' ? 'hello from setup()' : '(nothing appears)', rx + 8, ry + 38, { mono: true, size: 12, align: 'left', color: serial[0] === 'ok' ? C.ok : C.bad });
        ry += 74;
        kit.label(c, 'PSRAM', rx, ry + 6, { size: 10.5, color: C.muted, align: 'left' });
        c.save(); c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(rx + 50, ry, rw - 50, 14);
        if (ps[0] === 'ok' && have) { c.fillStyle = kit.hue(212, 0.85); c.fillRect(rx + 50, ry, rw - 50, 14); }
        c.restore();
        kit.label(c, ps[0] === 'ok' && have ? '8 MB' : ps[0] === 'bad' ? 'not found' : 'none in use', rx + 54, ry + 7, { size: 10.5, color: C.text, align: 'left' });
        ry += 28;
        S.box(c, rx, ry, rw, 34, { label: verdict, color: vcol, active: true, size: 12.5, textColor: vcol });
        ry += 46;
        if (wide) issues.slice().sort((a, b) => SEV[b[0]] - SEV[a[0]]).slice(0, 3).forEach(x => {
          const col = x[0] === 'bad' ? C.bad : x[0] === 'warn' ? C.warn : C.text2;
          ry = wrap(c, '• ' + x[2], rx, ry, rw, 15, { size: 11, color: col }) + 4;
        });
        ro.set('verdict', verdict);
        ro.set('app', kb(sketchB) + ' of ' + (appMax ? kb(appMax) : 'no app partition') + (tooBig ? ' (too big)' : ''));
        ro.set('serial', serial[0] === 'ok' ? 'shows text' : 'empty');
        ro.set('psram', ps[0] === 'ok' && have ? '8 MB found' : ps[0] === 'bad' ? 'not found' : 'not used');
        const fsRow = pt.rows.find(r => r.name === 'spiffs');
        ro.set('files', fsRow ? kb(fsRow.size) + ' at ' + hex(fsRow.offset) : 'none');
        ro.set('why', issues.length ? issues.slice().sort((a, b) => SEV[b[0]] - SEV[a[0]]).slice(0, 3).map(x => x[2]).join(' ') : 'Nothing to report: this combination is consistent.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ts-repl-upload */
  const REPL = {
    micropython: {
      setup: ['>>> from machine import Pin', '>>> led = Pin(2, Pin.OUT)'],
      lines: [
        { src: 'led.value(1)', out: [], led: 'on' }, { src: 'led.value(0)', out: [], led: 'off' }, { src: 'led.toggle()', out: [], led: 'toggle' },
        { src: 'sum(range(10))', out: ['45'] },
        { src: 'print(undefined_name)', out: ['Traceback (most recent call last):', '  File "<stdin>", line 1, in <module>', 'NameError: name \'undefined_name\' isn\'t defined'] }
      ]
    },
    circuitpython: {
      setup: ['>>> import board, digitalio', '>>> led = digitalio.DigitalInOut(board.LED)', '>>> led.direction = digitalio.Direction.OUTPUT'],
      lines: [
        { src: 'led.value = True', out: [], led: 'on' }, { src: 'led.value = False', out: [], led: 'off' }, { src: 'led.value = not led.value', out: [], led: 'toggle' },
        { src: 'sum(range(10))', out: ['45'] },
        { src: 'print(undefined_name)', out: ['Traceback (most recent call last):', '  File "<stdin>", line 1, in <module>', 'NameError: name \'undefined_name\' isn\'t defined'] }
      ]
    }
  };
  const SIMSPEED = 6;                       // simulated seconds per real second while a try is animated

  Hyper.sim('ts-repl-upload', {
    title: 'One idea, four ways to try it',
    blurb: `Each bar is the **wait** between having an idea and seeing it run, drawn to one scale. *Try an idea* runs all four at once, 6 times faster than real time. The numbers are typical, not measured: the Arduino wait is your compile time plus the upload time (ten bits per byte at the chosen baud rate; esptool also compresses, so real uploads are often quicker) plus a restart, and the other three are about a second or less.

**Try this**
- Press *Try an idea* a few times and watch how long you wait in each row.
- Make the image bigger and the baud rate lower: the Arduino bar grows, the others do not move.
- Type lines at the prompt: the answer is there at once, and a mistake only prints an error — the board is not reset.
- Shorten the **time to think**: the less you think between tries, the more the waiting dominates.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const focus = params && params.focus === 'circuitpython' ? 'circuitpython' : 'micropython', R = REPL[focus];
      const focusRow = focus === 'circuitpython' ? 'drive' : 'repl';
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 470, maxH: 580 });
      let tries = 0, runT = 1e9, ledOn = false;
      const transcript = R.setup.slice();
      const ctl = kit.controls(box.side, [
        { id: 'size', label: 'Arduino image size', min: 100, max: 1500, step: 50, value: 300, unit: 'KB' },
        { id: 'baud', type: 'select', label: 'Upload baud rate', options: [['115200', 115200], ['460800', 460800], ['921600', 921600]], value: 460800 },
        { id: 'compile', label: 'Compile time', min: 3, max: 60, step: 1, value: 10, unit: 's' },
        { id: 'think', label: 'Time to think and edit', min: 2, max: 30, step: 1, value: 8, unit: 's' },
        { type: 'buttons', items: [{ id: 'try', label: 'Try an idea', primary: true }, { id: 'reset', label: 'Reset' }] },
        { id: 'line', type: 'select', label: 'Type at the prompt', options: R.lines.map((l, i) => [l.src, i]), value: 0 },
        { type: 'buttons', items: [{ id: 'enter', label: 'Press Enter' }] }
      ], id => {
        if (id === 'try') { tries++; runT = 0; loop.start(); return; }
        if (id === 'reset') { tries = 0; runT = 1e9; ledOn = false; transcript.length = 0; R.setup.forEach(x => transcript.push(x)); }
        if (id === 'enter') {
          const l = R.lines[ctl.values.line] || R.lines[0];
          transcript.push('>>> ' + l.src);
          l.out.forEach(x => transcript.push(x));
          if (l.led === 'on') ledOn = true; else if (l.led === 'off') ledOn = false; else if (l.led === 'toggle') ledOn = !ledOn;
          if (transcript.length > 60) transcript.splice(0, transcript.length - 60);
        }
        loop.once();
      });
      const ro = kit.readout(box.side, [['ideas', 'Ideas tried'], ['cpp', 'Arduino wait per idea'], ['focus', focus === 'circuitpython' ? 'CircuitPython wait per idea' : 'MicroPython prompt wait per idea'], ['tot', 'Waiting after these ideas']]);
      const flows = () => {
        const v = ctl.values, up = v.size * 1024 * 10 / v.baud;
        return [
          { id: 'cpp', name: 'Arduino C++: compile and upload', wait: v.compile + up + 2, info: 'compile ' + dur(v.compile) + ' + upload ' + dur(up) + ' + restart 2 s', hue: 212 },
          { id: 'copy', name: 'MicroPython: copy the file', wait: 1.5, info: 'copy main.py and restart the script', hue: 150 },
          { id: 'repl', name: 'MicroPython: type at the prompt', wait: 0.05, info: 'the line runs when you press Enter', hue: 150 },
          { id: 'drive', name: 'CircuitPython: save to the drive', wait: 1.5, info: 'save; the board notices and restarts the program', hue: 286 }
        ];
      };
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), F = flows();
        if (runT < 1e8) runT += dt * SIMSPEED;
        const M = 12, W = st.W - 2 * M, maxW = Math.max.apply(null, F.map(f => f.wait)) || 1, rowH = 50, bx = M, bw = W;
        F.forEach((f, k) => {
          const y = 8 + k * rowH, isF = f.id === focusRow || (focus === 'micropython' && f.id === 'copy');
          kit.label(c, f.name, bx, y + 7, { size: 12, weight: isF ? 700 : 500, color: isF ? C.text : C.text2, align: 'left' });
          kit.label(c, 'wait ' + dur(f.wait), bx + bw, y + 7, { size: 12, weight: 650, color: C.text, align: 'right' });
          const len = Math.max(3, f.wait / maxW * bw), by = y + 17;
          c.save();
          c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(bx, by, bw, 14);
          c.fillStyle = kit.hue(f.hue, isF ? 0.9 : 0.6);
          c.fillRect(bx, by, Math.min(len, Math.max(0, runT / f.wait) * len), 14);
          c.restore();
          if (runT < f.wait) kit.dot(c, bx + runT / f.wait * len, by + 7, 5, C.accent);
          kit.label(c, f.info, bx, y + 41, { size: 10.5, color: C.muted, align: 'left' });
        });
        // the prompt
        const py = 8 + F.length * rowH + 8, ph = st.H - py - 10, lx = M + 84, pw = W - 84;
        S.box(c, lx, py, pw, ph, { color: C.border2 || C.muted, fill: C.dark ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.05)', r: 6 });
        kit.label(c, (focus === 'circuitpython' ? 'CircuitPython' : 'MicroPython') + ' prompt', lx + 8, py + 11, { size: 10.5, color: C.muted, align: 'left' });
        const cap = Math.max(1, Math.floor((ph - 30) / 15)), cpc = Math.max(10, Math.floor((pw - 16) / 7.4)), lines = transcript.slice(-cap);
        lines.forEach((ln, k) => S.text(c, ln.length > cpc ? ln.slice(0, cpc - 1) + '…' : ln, lx + 8, py + 30 + k * 15, { mono: true, size: 11.5, align: 'left', color: /Error|Traceback|File/.test(ln) ? C.bad : /^>>>/.test(ln) ? C.text : C.ok }));
        S.led(c, M + 34, py + 36, { color: 4, on: ledOn, r: 15 });
        kit.label(c, ledOn ? 'on' : 'off', M + 34, py + 70, { size: 11, color: C.text2, align: 'center' });
        kit.label(c, 'GPIO2', M + 34, py + 86, { size: 10, color: C.faint, align: 'center' });
        const fw = F.find(f => f.id === focusRow), cw = F[0];
        ro.set('ideas', String(tries));
        ro.set('cpp', dur(cw.wait));
        ro.set('focus', dur(fw.wait));
        ro.set('tot', tries ? dur(tries * cw.wait) + ' against ' + dur(tries * fw.wait) : '—');
        if (runT > maxW + 0.4 && runT < 1e8) runT = 1e9;
        if (runT >= 1e8) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ts-flash-image */
  // [name, first flash offset, esptool name]; the first offsets are those of the MicroPython images and the ESP-IDF bootloader
  const FLASH_CHIPS = { 'esp32': ['ESP32', 0x1000, 'esp32'], 'esp32-s2': ['ESP32-S2', 0x1000, 'esp32s2'], 'esp32-s3': ['ESP32-S3', 0, 'esp32s3'], 'esp32-c3': ['ESP32-C3', 0, 'esp32c3'], 'esp32-c6': ['ESP32-C6', 0, 'esp32c6'], 'esp32-c5': ['ESP32-C5', 0x2000, 'esp32c5'], 'esp32-p4': ['ESP32-P4', 0x2000, 'esp32p4'] };
  // a typical MicroPython layout for 4 MB (schematic): [name, offset, size]
  const MPY_ROWS = [['nvs', 0x9000, 0x6000], ['phy_init', 0xf000, 0x1000], ['factory app', 0x10000, 0x1f0000], ['vfs', 0x200000, 0x200000]];

  Hyper.sim('ts-flash-image', {
    title: 'What esptool writes where',
    blurb: `Choose a chip and what you are flashing. Bright regions are written by the command shown; plain ones are left as they were (or blanked by an erase). The Arduino layout is the default partition table of the Arduino core for the chosen flash size; the MicroPython layout is a typical one and schematic.

The **first offset** (where the bootloader goes) belongs to the chip: 0x1000 on the ESP32 and S2, 0 on the S3, C3 and C6, 0x2000 on the C5 and P4.

**Try this**
- Switch chips and watch the bootloader move, while the partition table stays at 0x8000.
- Compare **Arduino sketch**, **merged binary** and **MicroPython firmware**: four files, one file with gaps filled, and one file for a different layout.
- Tick *Erase first*: the data partitions are blanked (saved settings and files are gone).
- Lower the **baud rate**: the wire time grows. On built-in USB the baud setting is ignored.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 590, maxH: 600 });
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: Object.keys(FLASH_CHIPS).map(k => [FLASH_CHIPS[k][0], k]), value: 'esp32' },
        { id: 'what', type: 'select', label: 'What you flash', options: [['Arduino sketch (four files)', 'arduino'], ['Merged binary of that build', 'merged'], ['MicroPython firmware', 'mpy']], value: 'arduino' },
        { id: 'flash', type: 'select', label: 'Flash size', options: [['4 MB', 4], ['8 MB', 8], ['16 MB', 16]], value: 4 },
        { id: 'erase', type: 'check', label: 'Erase first', value: false },
        { id: 'port', type: 'select', label: 'Port', options: [['COM3 (Windows)', 'COM3'], ['/dev/ttyUSB0 (Linux)', '/dev/ttyUSB0'], ['/dev/cu.usbserial-0001 (macOS)', '/dev/cu.usbserial-0001']], value: 'COM3' },
        { id: 'baud', type: 'select', label: 'Baud rate', options: [['115200', 115200], ['460800', 460800], ['921600', 921600]], value: 460800 },
        { id: 'size', label: 'Size of the file written', min: 100, max: 3000, step: 50, value: 600, unit: 'KB' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['first', 'First offset'], ['files', 'Files written'], ['time', 'Wire time at most'], ['note', 'Note']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values, FC = FLASH_CHIPS[v.chip] || FLASH_CHIPS.esp32, first = FC[1];
        const pt = E.partitions(E.PARTITION_SCHEMES.find(p => p.id === SCHEME_FOR[v.flash]).parts, v.flash * 1048576);
        const layers = [], RIGHT = (o, z) => (st.W >= 600 ? hex(o) + ' · ' + kb(z) : hex(o));
        const hueW = v.what === 'merged' ? 40 : 212;
        const gapNote = v.erase ? 'blank' : 'untouched';
        layers.push({ label: v.what === 'mpy' ? 'bootloader (in the image)' : 'bootloader.bin', size: 1.4, color: v.what === 'merged' ? 40 : hueW, right: hex(first) });
        layers.push({ label: v.what === 'mpy' ? 'partition table (in the image)' : 'partitions.bin', size: 1, color: v.what === 'merged' ? 40 : hueW, right: '0x8000' });
        let files = 0, bytes = 0;
        if (v.what === 'mpy') {
          files = 1; bytes = v.size * 1024;
          MPY_ROWS.forEach((r, k0) => {
            const k = k0, isApp = k === 2, gap = k < 2;
            if (k === 3) r = [r[0], r[1], v.flash * 1048576 - r[1]];
            layers.push({ label: r[0] + (isApp ? ' · in the image' : gap ? ' · ' + (v.erase ? 'blank' : 'gap') : ' · ' + (v.erase ? 'blank' : 'made at first start')), size: Math.sqrt(r[2] / 4096), color: isApp ? 150 : undefined, right: RIGHT(r[1], r[2]) });
          });
                  } else {
          let seenApp = false;
          for (const r of pt.rows) {
            let label = r.name, color, tag = '';
            if (r.name === 'otadata') { label += ' · boot_app0.bin'; color = hueW; }
            else if (r.type === 'app' && !seenApp) { seenApp = true; label += ' (app) · app.bin'; color = hueW; }
            else if (v.what === 'merged' && !seenApp) { label += ' · gap, filled with 0xFF'; color = 40; }
            else label += ' · ' + gapNote;
            layers.push({ label, size: Math.sqrt(r.size / 4096), color, right: RIGHT(r.offset, r.size) });
          }
          if (v.what === 'arduino') { files = 4; bytes = (v.size + 40) * 1024; }
          else { files = 1; bytes = 0x10000 + v.size * 1024 - first; }
        }
        // the command
        const cmd = [];
        const chipName = FC[2];
        if (v.erase) cmd.push('esptool --chip ' + chipName + ' --port ' + v.port + ' erase-flash');
        let w = 'esptool --chip ' + chipName + ' --port ' + v.port + ' --baud ' + v.baud + ' write-flash ';
        if (v.what === 'arduino') {
          const order = ['bootloader.bin', 'partitions.bin', 'boot_app0.bin', 'app.bin'], offs = { 'bootloader.bin': hex(first), 'partitions.bin': '0x8000', 'boot_app0.bin': '0xe000', 'app.bin': '0x10000' };
          w += order.map(f => offs[f] + ' ' + f).join(' ');
        } else if (v.what === 'merged') w += hex(first) + ' merged.bin';
        else w += hex(first) + ' micropython.bin';
        cmd.push(w);
        // drawing: the map
        const M = 12, wide = st.W >= 600, lw = wide ? Math.floor(st.W * 0.55) : st.W - 2 * M, mapY = 36, mapH = wide ? st.H - mapY - 14 : 240;
        kit.label(c, FC[0] + ', ' + v.flash + ' MB (coloured = written)', M, 14, { size: 12, weight: 600, color: C.text2, align: 'left' });
        S.layers(c, M, mapY, lw, layers, { h: mapH, minRow: 17 });
        const rx = wide ? M + lw + 16 : M, rw = wide ? st.W - rx - M : st.W - 2 * M;
        let ry = wide ? mapY : mapY + mapH + 14;
        const cmdText = cmd.join('  then  ');
        const lines = Math.ceil(cmdText.length * 7 / Math.max(80, rw - 20)) + 1;
        const bh = Math.max(70, lines * 16 + 30);
        S.box(c, rx, ry, rw, bh, { color: C.border2 || C.muted, fill: C.dark ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.05)', r: 6 });
        kit.label(c, 'the command', rx + 8, ry + 11, { size: 10.5, color: C.muted, align: 'left' });
        wrap(c, cmdText, rx + 8, ry + 24, rw - 16, 16, { mono: true, size: 11.5, color: C.text });
        ry += bh + 12;
        const usb = v.chip !== 'esp32' && v.chip !== 'esp32-s2';
        const note = v.what === 'mpy' ? 'The firmware file is built for one chip and starts at its first offset.' : v.what === 'merged' ? 'One file for the first offset: the gaps are part of it, so it is larger than the pieces.' : 'Four pieces, each at its own offset; saved settings and files are left alone.';
        ry = wrap(c, note, rx, ry, rw, 17, { size: 12.5, color: C.text2 });
        if (v.erase) ry = wrap(c, 'Erase first blanks everything: saved settings, Wi-Fi credentials and the file system (not the eFuses).', rx, ry + 6, rw, 17, { size: 12.5, color: C.warn });
        if (usb) wrap(c, 'Over built-in USB the baud rate is ignored.', rx, ry + 6, rw, 17, { size: 12.5, color: C.muted });
        ro.set('first', hex(first));
        ro.set('files', files + (files === 1 ? ' file' : ' files') + ' · ' + kb(bytes));
        ro.set('time', dur(bytes * 10 / v.baud) + ' at ' + v.baud + ' baud');
        ro.set('note', v.erase ? 'erases first' : 'keeps saved data');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
