/* HYPER-ESP32 · sims/debugging-and-testing.js
 *
 *   db-log-levels   a stream of log lines filtered by level, and what printing costs at each baud rate
 *   db-boot-log     an annotated boot log to click through, line by line, for five kinds of start
 *   db-backtrace    a crash report whose addresses turn into function names, frame by frame
 *   db-watchdog     a task and the idle task on a timeline: who feeds the watchdog, and when it bites
 *   db-stack        a task's stack filling up towards the canary, and the high-water mark
 *   db-upload       the upload handshake, stage by stage, failing at the link you choose
 *   db-jtag         a debugger: breakpoints, watchpoints and stepping through a small program
 *   db-bisect       finding the faulty change in the fewest tests (with an optional flaky fault)
 *   db-soak         free memory over days: a leak, a short test and a long one
 *
 * The messages are the ones the tools print; the addresses, timings and programs are made up and say so in the blurbs.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- small helpers */
  const MONO = 'Consolas, "Cascadia Code", Menlo, monospace';
  const SANS = 'system-ui, "Segoe UI", sans-serif';
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const pad = (v, n) => String(v).padStart(n, ' ');
  const hex8 = n => '0x' + (n >>> 0).toString(16).padStart(8, '0');
  const setFont = (c, size, mono, weight) => { c.font = (weight || 500) + ' ' + size + 'px ' + (mono ? MONO : SANS); };
  // shorten a string with an ellipsis so that it fits maxW pixels
  function fit(c, str, maxW, size, mono) {
    let s = String(str);
    c.save(); setFont(c, size, mono);
    if (c.measureText(s).width > maxW) {
      while (s.length > 1 && c.measureText(s + '…').width > maxW) s = s.slice(0, -1);
      s += '…';
    }
    c.restore();
    return s;
  }
  // wrap text into lines no wider than maxW pixels
  function wrapLines(c, text, maxW, size, mono) {
    const words = String(text).split(/\s+/), out = [];
    let line = '';
    c.save(); setFont(c, size, mono);
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
    }
    if (line) out.push(line);
    c.restore();
    return out;
  }
  // draw wrapped text; -> the y below the last line
  function para(kit, c, text, x, y, maxW, lh, o) {
    o = o || {};
    const lines = wrapLines(c, text, maxW, o.size || 12, false);
    lines.forEach((l, i) => kit.label(c, l, x, y + i * lh + lh / 2, { size: o.size || 12, color: o.color, weight: o.weight }));
    return y + lines.length * lh;
  }
  // a small deterministic random generator
  function rng(seed) { let s = seed >>> 0 || 1; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; }

  /* ================================================================ db-log-levels */
  const LV = [
    { n: 'Error', ch: 'E', rate: 0.3, len: 72, msgs: [['wifi', 'connect failed, reason 201'], ['mqtt', 'publish failed, rc -1'], ['sensor', 'no answer from 0x48']] },
    { n: 'Warning', ch: 'W', rate: 0.8, len: 68, msgs: [['adc', 'reading near full scale'], ['wifi', 'signal weak, rssi -84'], ['heap', 'only 41 KB free']] },
    { n: 'Info', ch: 'I', rate: 3, len: 60, msgs: [['loop', 'alive'], ['wifi', 'connected, ip 192.168.1.23'], ['mqtt', 'sent temp 23.4'], ['sensor', 'read ok']] },
    { n: 'Debug', ch: 'D', rate: 14, len: 56, msgs: [['adc', 'raw 2231'], ['mqtt', 'topic home/temp qos 0 len 4'], ['wifi', 'scan done, 11 networks'], ['i2c', 'write 2 bytes to 0x48']] },
    { n: 'Verbose', ch: 'V', rate: 55, len: 52, msgs: [['loop', 'pass 8213'], ['adc', 'sample 2231 2236 2229'], ['lwip', 'tcp_write 24 bytes'], ['i2c', 'read reg 0x00 -> 0x1a']] }
  ];
  Hyper.sim('db-log-levels', {
    title: 'Log levels and the cost of printing',
    blurb: `The program writes lines at five levels, from *error* (rare) to *verbose* (dozens a second). The **level** decides which of them reach the serial monitor; the bar shows how much of the serial line they use. Line rates and lengths are typical, not measured.

When the line is more than full, the program waits inside \`print\`, so the **program speed** drops: chatter is not free.

**Try this**
- Keep **Info** at 115 200 baud: a calm log, a few percent of the line.
- Switch to **Verbose**: the line is far over capacity and the program runs at a fraction of its speed.
- Now raise the baud rate: the same lines fit again. Or lower the chatter instead.
- At 9 600 baud even **Debug** is too much for a program that must stay fast.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 340, maxH: 520 });
      const ctl = kit.controls(box.side, [
        { id: 'level', type: 'select', label: 'Log level', options: [['Error only', 0], ['Warning and above', 1], ['Info and above', 2], ['Debug and above', 3], ['Verbose (everything)', 4]], value: 2 },
        { id: 'baud', type: 'select', label: 'Baud rate', options: [['9 600', 9600], ['115 200', 115200], ['460 800', 460800], ['921 600', 921600]], value: 115200 },
        { id: 'chat', label: 'How chatty the program is', min: 0.5, max: 5, step: 0.1, value: 1, unit: '×' }
      ], () => { buf = []; acc = [0, 0, 0, 0, 0]; loop.once(); });
      const ro = kit.readout(box.side, [['lines', 'Lines a second'], ['bytes', 'Bytes a second'], ['busy', 'Serial line used'], ['speed', 'Program speed'], ['one', 'One line takes']]);
      let buf = [], acc = [0, 0, 0, 0, 0], count = 0, tms = 0;
      function metrics() {
        const L = ctl.values.level, k = ctl.values.chat, cap = ctl.values.baud / 10;
        let lines = 0, bytes = 0;
        const per = LV.map((l, i) => { const r = i <= L ? l.rate * k : 0; lines += r; bytes += r * l.len; return r * l.len; });
        const busy = bytes / cap;
        return { lines, bytes, per, cap, busy, speed: busy > 1 ? 1 / busy : 1 };
      }
      const loop = kit.loop(dt => {
        const m = metrics(), c = st.begin(), C = kit.colors(), W = st.W, M = 12;
        const colors = [C.bad, C.warn, C.ok, C.accent, kit.hue(280)];
        tms += dt * 1000;
        for (let i = 0; i <= ctl.values.level; i++) {
          acc[i] += LV[i].rate * ctl.values.chat * m.speed * dt;
          let guard = 0;
          while (acc[i] >= 1 && guard++ < 4) { acc[i] -= 1; count++; const mm = LV[i].msgs[count % LV[i].msgs.length]; buf.push({ i, t: Math.round(tms), tag: mm[0], text: mm[1] }); }
          if (acc[i] > 4) acc[i] = 0;
        }
        if (buf.length > 40) buf.splice(0, buf.length - 40);
        // the terminal
        const ty = 26, th = Math.round(st.H * 0.52), rows = Math.max(3, Math.floor((th - 10) / 15));
        kit.label(c, 'serial monitor', M, 12, { size: 11.5, color: C.muted });
        c.fillStyle = C.dark ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.06)'; c.fillRect(M, ty, W - 2 * M, th);
        c.strokeStyle = C.faint; c.lineWidth = 1; c.strokeRect(M + 0.5, ty + 0.5, W - 2 * M - 1, th - 1);
        const shown = buf.slice(-rows);
        shown.forEach((ln, k) => {
          const txt = '[' + pad(ln.t, 7) + '] ' + LV[ln.i].ch + ' (' + ln.tag + ') ' + ln.text;
          kit.label(c, fit(c, txt, W - 2 * M - 14, 11, true), M + 7, ty + 9 + k * 15, { size: 11, font: MONO, color: colors[ln.i] });
        });
        if (!shown.length) kit.label(c, 'nothing printed at this level yet', M + 7, ty + 12, { size: 11, color: C.faint });
        // the serial line
        const by = ty + th + 26, bw = W - 2 * M, bh = 18;
        kit.label(c, 'Serial line used: ' + Math.round(m.busy * 100) + ' % of ' + kit.fmt(m.cap, 3) + ' chars/s', M, by - 12, { size: 11.5, color: C.text2 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; c.fillRect(M, by, bw, bh);
        let x = M;
        m.per.forEach((b, i) => {
          const w = Math.min(M + bw - x, (b / m.cap) * bw);
          if (w > 0) { c.fillStyle = colors[i]; c.globalAlpha = 0.85; c.fillRect(x, by, w, bh); c.globalAlpha = 1; x += w; }
        });
        if (m.busy > 1) { c.strokeStyle = C.bad; c.lineWidth = 2; c.strokeRect(M, by, bw, bh); kit.label(c, 'over capacity: the program waits inside print()', M, by + bh + 14, { size: 11.5, color: C.bad, weight: 600 }); }
        else kit.label(c, 'room to spare', M, by + bh + 14, { size: 11.5, color: C.ok });
        // the legend
        const lw = bw / 5, ly = by + bh + 36;
        LV.forEach((l, i) => {
          const lx = M + i * lw;
          c.fillStyle = colors[i]; c.globalAlpha = i <= ctl.values.level ? 1 : 0.3; c.fillRect(lx, ly - 5, 9, 9);
          kit.label(c, l.ch + ' ' + kit.fmt(i <= ctl.values.level ? l.rate * ctl.values.chat : 0, 2) + '/s', lx + 14, ly, { size: 10.5, color: i <= ctl.values.level ? C.text2 : C.faint });
          c.globalAlpha = 1;
        });
        ro.set('lines', kit.fmt(m.lines, 3));
        ro.set('bytes', kit.fmt(m.bytes, 3));
        ro.set('busy', Math.round(m.busy * 100) + ' %');
        ro.set('speed', Math.round(m.speed * 100) + ' % of full speed');
        const avgLen = m.lines > 0 ? m.bytes / m.lines : 60;
        ro.set('one', kit.fmt(avgLen * 10 / ctl.values.baud * 1000, 3) + ' ms');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ db-boot-log */
  const ROM = 'ets Jun  8 2016 00:22:57';
  const BOOTS = {
    normal: {
      name: 'A normal start', verdict: ['ok', 'Normal start'],
      lines: [
        ['rom', ROM, 'The date of the ROM code, printed first. It is the same on every ESP32: it identifies the ROM, not your program.'],
        ['rom', 'rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)', 'Two facts. rst:0x1 is a power-on reset (on an ESP32 the EN button gives the same). boot:0x13 is how the strapping pins chose to start: normally, from flash.'],
        ['rom', 'configsip: 0, SPIWP:0xee', 'How the flash memory is connected, read from the chip\'s eFuses. Of no interest unless the flash cannot be read.'],
        ['rom', 'mode:DIO, clock div:2', 'How the ROM reads the first part of the flash (dual I/O) and the clock divider it uses to do so.'],
        ['rom', 'load:0x3fff0030,len:4832', 'The ROM copies a piece of the second-stage bootloader from flash into RAM at this address; len is the size in bytes. Several load lines follow.'],
        ['rom', 'entry 0x400805cc', 'The ROM jumps to this address. From here on a program in flash is in charge.'],
        ['boot', 'I (29) boot: ESP-IDF v5.5 2nd stage bootloader', 'The second-stage bootloader introduces itself. The 29 is milliseconds since reset.'],
        ['boot', 'I (54) boot: Partition Table:', 'It reads the partition table and lists every partition: name, type, offset and length.'],
        ['boot', 'I (62) boot:  2 factory   factory app   00 00 00010000 00100000', 'The partition that holds the application: it starts at 0x10000 and is 0x100000 bytes, 1 MB, long.'],
        ['boot', 'I (88) boot: Loaded app from partition at offset 0x10000', 'The bootloader has chosen that application and hands over to it.'],
        ['app', 'I (131) cpu_start: cpu freq: 240000000 Hz', 'The start-up code of the application reports the CPU clock: 240 MHz.'],
        ['app', 'I (160) main_task: Calling app_main()', 'ESP-IDF\'s main task starts your code. In an Arduino sketch, setup() and loop() follow.'],
        ['app', '=== firmware banner ===', 'Your own output starts here: the start-up banner of the program on the reading-boot-messages page.']
      ]
    },
    flash: {
      name: 'Flash cannot be read (GPIO12 high)', verdict: ['bad', 'Boot loop: the flash cannot be read'],
      lines: [
        ['rom', ROM, 'The ROM starts as usual: it does not know yet that anything is wrong.'],
        ['rom', 'rst:0x10 (RTCWDT_RTC_RESET),boot:0x33 (SPI_FAST_FLASH_BOOT)', 'The boot value is 0x33 instead of the normal 0x13: one extra bit, the level of GPIO12 at reset. And rst:0x10 says the RTC watchdog had to reset the chip because the start stalled.'],
        ['rom', 'flash read err, 1000', 'The ROM cannot read the program from flash. GPIO12 high chose 1.8 V for the flash supply, but a module with 3.3 V flash cannot be read like that.'],
        ['err', 'ets_main.c 371', 'The ROM source file and line where it gave up. A reset follows.'],
        ['rom', ROM + '   (and again)', 'The chip resets and tries again: the same lines repeat for ever. Cure: stop whatever holds GPIO12 high at reset, or use another pin.']
      ]
    },
    download: {
      name: 'Download mode (boot pin low)', verdict: ['warn', 'Download mode: waiting for an upload'],
      lines: [
        ['rom', ROM, 'The ROM starts as usual.'],
        ['rom', 'rst:0x1 (POWERON_RESET),boot:0x3 (DOWNLOAD_BOOT(UART0/UART1/SDIO_REI_REO_V2))', 'boot:0x3 instead of 0x13: the boot pin (GPIO0) was low at reset. The ROM will not run the program in flash.'],
        ['rom', 'waiting for download', 'The ROM waits for esptool to send a program. Nothing is wrong, but nothing will run until the next reset with the boot pin high.']
      ]
    },
    brownout: {
      name: 'Brownout loop (weak supply)', verdict: ['bad', 'Boot loop: the supply collapses'],
      lines: [
        ['err', 'Brownout detector was triggered', 'Printed by the running program just before the reset: the supply voltage fell below the detector\'s threshold, so the chip resets itself to stay safe.'],
        ['rom', ROM, 'The chip is restarting.'],
        ['rom', 'rst:0xc (SW_CPU_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)', 'On an ESP32 the brownout handler restarts with a software reset, so the ROM line alone does not prove a brownout: the message above does.'],
        ['rom', 'entry 0x400805cc', 'The start-up proceeds normally (the load lines are left out here).'],
        ['app', 'starting Wi-Fi...', 'Your program starts the radio. A transmitting radio draws a burst of hundreds of milliamps.'],
        ['err', 'Brownout detector was triggered', 'The weak supply sags under that burst and the chip resets again: the pattern repeats, always at the same place. Cure: a better cable, regulator or capacitor, not a code change.']
      ]
    },
    panic: {
      name: 'A crash and its restart', verdict: ['bad', 'Crash and restart'],
      lines: [
        ['err', 'Guru Meditation Error: Core  1 panic\'ed (LoadProhibited). Exception was unhandled.', 'The panic handler reports the kind of crash. LoadProhibited: the program read an address that does not exist.'],
        ['err', 'PC      : 0x400d2a1c  PS      : 0x00060630', 'A few of the registers. PC is the address of the instruction that failed; the decoder turns it into a function and a line.'],
        ['err', 'EXCVADDR: 0x00000004', 'The address being read: 4. A pointer was null, and the code reached 4 bytes into the structure it should have pointed to.'],
        ['err', 'Backtrace: 0x400d2a1c:0x3ffb1f90 0x400d2b3a:0x3ffb1fb0', 'Where it happened and who called whom, as PC:SP pairs. Decode it with the .elf of this build.'],
        ['err', 'ELF file SHA256: 7c1e5d3a09b2...', 'A fingerprint of the build that crashed. The .elf you decode with must have the same one.'],
        ['err', 'Rebooting...', 'The panic handler restarts the chip.'],
        ['rom', 'rst:0xc (SW_CPU_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)', 'To the ROM a panic restart looks like any software restart, which is why the reset reason in software matters: it knows it was a panic.']
      ]
    }
  };
  const BOOT_KIND = { rom: ['ROM bootloader', 212], boot: ['second-stage bootloader', 150], app: ['your application', 40], err: ['an error or a crash report', null] };
  Hyper.sim('db-boot-log', {
    title: 'An annotated boot log',
    blurb: `Click a line (or use *Next line*) and read what it says and who prints it. Blue lines come from the **ROM bootloader**, green from the **second-stage bootloader**, amber from **your application**, red are errors. The text is typical for an ESP32; other chips and versions word it a little differently, and the addresses vary with every build.

**Try this**
- Walk through *A normal start* and match each line to its voice.
- Open *Flash cannot be read*: find the one extra bit in boot:0x33.
- Compare *Download mode* with the normal start: only the boot value changes.
- In *A crash and its restart* notice that the ROM line afterwards says "software": the panic is only visible above it.`,
    mount(box, kit, params) {
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 400, maxH: 600 });
      let key = BOOTS[params && params.scenario] ? params.scenario : 'normal', sel = 0, hits = [], playing = false, tick = 0;
      const ctl = kit.controls(box.side, [
        { id: 'sc', type: 'select', label: 'What happened', options: Object.keys(BOOTS).map(k => [BOOTS[k].name, k]), value: key },
        { type: 'buttons', items: [{ id: 'prev', label: 'Previous line' }, { id: 'next', label: 'Next line', primary: true }, { id: 'play', label: 'Play / stop' }] }
      ], (id, v) => {
        const n = BOOTS[key].lines.length;
        if (id === 'sc') { key = v; sel = 0; playing = false; }
        if (id === 'next') sel = (sel + 1) % n;
        if (id === 'prev') sel = (sel + n - 1) % n;
        if (id === 'play') { playing = !playing; tick = 0; }
        loop.start();
      });
      const ro = kit.readout(box.side, [['voice', 'Printed by'], ['line', 'Line'], ['verdict', 'This start']]);
      const loop = kit.loop(dt => {
        const B = BOOTS[key], n = B.lines.length;
        if (playing) { tick += dt; if (tick > 1.6) { tick = 0; sel = (sel + 1) % n; } }
        const c = st.begin(), C = kit.colors(), W = st.W, M = 12;
        const colorOf = k => (BOOT_KIND[k][1] == null ? C.bad : kit.hue(BOOT_KIND[k][1], 1));
        // legend
        let lx = M;
        for (const k of ['rom', 'boot', 'app', 'err']) {
          c.fillStyle = colorOf(k); c.fillRect(lx, 9, 9, 9);
          const nm = k === 'rom' ? 'ROM' : k === 'boot' ? 'bootloader' : k === 'app' ? 'application' : 'error';
          kit.label(c, nm, lx + 13, 14, { size: 11, color: C.text2 });
          lx += 30 + nm.length * 6;
        }
        // the log
        const rowH = 17, ly = 28, lh = n * rowH + 10;
        c.fillStyle = C.dark ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.06)'; c.fillRect(M, ly, W - 2 * M, lh);
        hits = [];
        B.lines.forEach((ln, i) => {
          const y = ly + 5 + i * rowH;
          if (i === sel) { c.fillStyle = C.dark ? 'rgba(123,140,255,.25)' : 'rgba(60,90,220,.14)'; c.fillRect(M + 1, y, W - 2 * M - 2, rowH); }
          c.fillStyle = colorOf(ln[0]); c.fillRect(M + 1, y + 2, 3, rowH - 4);
          kit.label(c, fit(c, ln[1], W - 2 * M - 16, 11, true), M + 9, y + rowH / 2, { size: 11, font: MONO, color: i === sel ? C.text : C.text2 });
          hits.push({ y, h: rowH, i });
        });
        // the explanation
        const cur = B.lines[sel], ey = ly + lh + 12;
        kit.label(c, BOOT_KIND[cur[0]][0], M, ey + 6, { size: 12.5, weight: 650, color: colorOf(cur[0]) });
        para(kit, c, cur[2], M, ey + 18, W - 2 * M, 16.5, { size: 12.5, color: C.text2 });
        ro.set('voice', BOOT_KIND[cur[0]][0]);
        ro.set('line', (sel + 1) + ' of ' + n);
        ro.set('verdict', B.verdict[1]);
        if (!playing) loop.stop();
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.y >= q.y && p.y <= q.y + q.h); if (h) { sel = h.i; playing = false; loop.once(); } }, p => hits.some(q => p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ db-backtrace */
  // a made-up program: [start, end, function, file, [[offset, line], …]]
  const SYMS = [
    [0x400d1e90, 0x400d1ee0, 'setup', 'main.ino', [[0, 10], [0x14, 14]]],
    [0x400d1ef0, 0x400d1f40, 'loop', 'main.ino', [[0, 20], [0x0e, 23], [0x24, 26]]],
    [0x400d2a00, 0x400d2a30, 'readLast', 'sensor.cpp', [[0, 40], [0x08, 41], [0x1c, 42], [0x24, 43]]],
    [0x400d2a40, 0x400d2a90, 'average', 'sensor.cpp', [[0, 50], [0x10, 51], [0x2a, 52], [0x36, 53]]],
    [0x400d2b00, 0x400d2b80, 'printReading', 'display.cpp', [[0, 80], [0x1c, 86], [0x3a, 88], [0x58, 90]]],
    [0x400d2c00, 0x400d2c60, 'loadConfig', 'config.cpp', [[0, 55], [0x1a, 57]]],
    [0x400d2d00, 0x400d2d30, 'callHandler', 'events.cpp', [[0, 30], [0x0c, 33]]],
    [0x400d3c20, 0x400d3c80, 'loopTask', 'main.cpp', [[0, 70], [0x2d, 74]]],
    [0x4008a1c0, 0x4008a200, 'panic_abort', 'panic.c', [[0, 463]]],
    [0x4008a210, 0x4008a240, 'esp_system_abort', 'esp_system.c', [[0, 115]]],
    [0x4008b100, 0x4008b140, '__assert_func', 'assert.c', [[0, 47]]]
  ];
  function decode(addr, shift) {
    const a = addr - (shift || 0);
    for (const [s, e, fn, file, lines] of SYMS) {
      if (a >= s && a < e) { let ln = lines[0][1]; for (const [o, l] of lines) if (a - s >= o) ln = l; return { fn, file, line: ln, sys: /panic|abort|assert/.test(fn) }; }
    }
    return null;
  }
  const CRASHES = {
    null: { name: 'Null pointer: LoadProhibited', cause: "Guru Meditation Error: Core  1 panic'ed (LoadProhibited).", pcs: [0x400d2a1c, 0x400d2b3a, 0x400d1f0e, 0x400d3c4d],
      meaning: 'A pointer was null: the code read a field at a small offset from address zero.', look: 'a pointer that was never set, in the first frame of yours' },
    callback: { name: 'Null callback: InstrFetchProhibited', cause: "Guru Meditation Error: Core  1 panic'ed (InstrFetchProhibited).", pcs: [0x00000000, 0x400d2d0f, 0x400d1f14, 0x400d3c4d],
      meaning: 'The program jumped to address zero: it called a function pointer that was null. The crash frame has no name; the caller does.', look: 'the caller, frame 1: which callback was never registered' },
    divide: { name: 'Division by zero: IntegerDivideByZero', cause: "Guru Meditation Error: Core  1 panic'ed (IntegerDivideByZero).", pcs: [0x400d2a6a, 0x400d2b5a, 0x400d1f0e, 0x400d3c4d],
      meaning: 'An integer was divided by zero. (RISC-V chips return a result instead of faulting.)', look: 'the divisor on the line of the first frame, for example an empty sample count' },
    assert: { name: 'Failed assert: abort()', cause: 'assert failed: loadConfig config.cpp:57 (file != nullptr)', pcs: [0x4008a1d2, 0x4008a21c, 0x4008b11a, 0x400d2c1a, 0x400d1ea4, 0x400d3c4d],
      meaning: 'A check in the program failed on purpose and called abort(). The top frames are inside the system; yours begins at the first named function of the program.', look: 'frame 3: loadConfig, line 57, the condition that failed' }
  };
  Hyper.sim('db-backtrace', {
    title: 'From addresses to function names',
    blurb: `A crash report holds **addresses**; the **.elf** file of the build knows which function and line each one belongs to. Pick a crash, then raise *Frames decoded* to turn the addresses into names, top frame first. The program, the addresses and the files are made up; the shape of the report is what a real one looks like.

**Try this**
- *Null pointer*: move *Field offset* and watch EXCVADDR follow it. A small number means a null pointer.
- *Null callback*: the first frame is address 0 and cannot be decoded; the caller is the clue.
- *Failed assert*: the first frames belong to the system. Look for the first function of yours.
- Untick *the .elf of the running build*: the names still look fine — and are wrong.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 380, maxH: 580 });
      const ctl = kit.controls(box.side, [
        { id: 'crash', type: 'select', label: 'The crash', options: Object.keys(CRASHES).map(k => [CRASHES[k].name, k]), value: 'null' },
        { id: 'off', label: 'Field offset in the structure', min: 0, max: 64, step: 4, value: 4, unit: 'bytes' },
        { id: 'frames', label: 'Frames decoded', min: 0, max: 6, step: 1, value: 0 },
        { id: 'elf', type: 'check', label: 'Use the .elf of the running build', value: true },
        { type: 'buttons', items: [{ id: 'all', label: 'Decode all', primary: true }] }
      ], (id, v) => {
        if (id === 'all') ctl.set('frames', 6);
        if (id === 'crash') ctl.show('off', ctl.values.crash === 'null');
        loop.once();
      });
      const ro = kit.readout(box.side, [['cause', 'Cause'], ['where', 'First frame of yours'], ['look', 'Look for']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 12, K = CRASHES[ctl.values.crash] || CRASHES.null;
        const shift = ctl.values.elf ? 0 : 0x24;
        const off = ctl.values.crash === 'null' ? ctl.values.off : 0;
        const nFrames = K.pcs.length, nDec = Math.min(ctl.values.frames, nFrames);
        // the report
        const fs = 11, lh = 15;
        c.fillStyle = C.dark ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.06)'; c.fillRect(M, 8, W - 2 * M, 54 + nFrames * lh);
        const rep = [[K.cause, C.bad], [ctl.values.crash === 'null' ? 'EXCVADDR: ' + hex8(off) : ctl.values.crash === 'callback' ? 'EXCVADDR: ' + hex8(0) : 'EXCVADDR: not used by this crash', C.text2], [W < 520 ? 'Backtrace (program addresses; the stack addresses are left out):' : 'Backtrace:', C.text2]];
        rep.forEach(([t, col], i) => kit.label(c, fit(c, t, W - 2 * M - 12, fs, true), M + 7, 20 + i * lh, { size: fs, font: MONO, color: col }));
        const decoded = [];
        K.pcs.forEach((pc, i) => {
          const sp = 0x3ffb1f90 + i * 0x20, y = 20 + (3 + i) * lh + 4;
          const isDec = i < nDec, d = isDec ? decode(pc, shift) : null;
          kit.label(c, '#' + i + ' ' + hex8(pc) + (W < 520 ? '' : ':' + hex8(sp)), M + 7, y, { size: fs, font: MONO, color: C.text2 });
          const x2 = M + 7 + (W < 520 ? 86 : 158) + 14;
          let txt = '?', col = C.faint;
          if (isDec) {
            if (pc === 0 && shift === 0) { txt = 'address 0: nothing there'; col = C.warn; }
            else if (d) { txt = d.fn + '()  ' + d.file + ':' + d.line; col = d.sys ? C.muted : C.text; }
            else { txt = 'no such function'; col = C.warn; }
          }
          decoded.push({ pc, d, isDec });
          kit.label(c, fit(c, '→ ' + txt, Math.max(40, W - x2 - M - 6), fs, true), x2, y, { size: fs, font: MONO, color: col, weight: isDec ? 650 : 500 });
        });
        // the call stack as a staircase: the caller at the top, the crash at the bottom right
        const sy = 8 + 54 + nFrames * lh + 14;
        kit.label(c, 'who called whom', M, sy, { size: 11.5, color: C.muted });
        const order = K.pcs.map((pc, i) => i).reverse();   // outermost first
        const bh = Math.max(20, Math.min(26, (st.H - sy - 30) / nFrames - 5)), stepX = Math.min(26, (W - 2 * M - 120) / Math.max(1, nFrames));
        order.forEach((fi, k) => {
          const x = M + k * stepX, y = sy + 12 + k * (bh + 5), w = W - 2 * M - k * stepX, info = decoded[fi];
          const isTop = fi === 0;
          const label = info.isDec ? (info.pc === 0 && shift === 0 ? 'address 0' : info.d ? info.d.fn + '()' : '??') : 'frame ' + fi;
          S_box(c, C, x, y, w, bh, label, isTop && info.isDec ? C.bad : info.isDec ? C.accent : C.faint, info.isDec);
        });
        if (!ctl.values.elf) kit.label(c, 'wrong .elf: the names look plausible and are false', M, st.H - 12, { size: 11.5, color: C.bad, weight: 650 });
        // the reading
        const firstOwn = decoded.findIndex(f => f.isDec && f.d && !f.d.sys);
        ro.set('cause', K.meaning);
        ro.set('where', nDec === 0 ? 'decode a frame to see' : (firstOwn >= 0 ? '#' + firstOwn + '  ' + decoded[firstOwn].d.fn + '()  ' + decoded[firstOwn].d.file + ':' + decoded[firstOwn].d.line : 'not decoded yet'));
        ro.set('look', ctl.values.crash === 'null' ? (off < 4 ? 'offset ' + off + ': a pointer that was never set' : 'a null pointer plus offset ' + off + ': ' + K.look) : K.look);
      }, box.stage);
      // a rounded box with a label (own helper: the kit's box would need the symbols kit)
      function S_box(c, C, x, y, w, h, label, color, active) {
        c.save();
        c.beginPath(); if (c.roundRect) c.roundRect(x, y, w, h, 6); else c.rect(x, y, w, h);
        c.fillStyle = active ? (color === C.bad ? (C.dark ? 'rgba(229,72,77,.22)' : 'rgba(229,72,77,.12)') : (C.dark ? 'rgba(123,140,255,.20)' : 'rgba(60,90,220,.12)')) : C.surface;
        c.fill(); c.lineWidth = active ? 2 : 1.2; c.strokeStyle = color; c.stroke();
        c.restore();
        kit.label(c, fit(c, label, w - 14, 12, false), x + 8, y + h / 2, { size: 12, weight: 600, color: active ? C.text : C.faint });
      }
      st.onResize(() => loop.once());
      ctl.show('off', true);
      loop.once();
    }
  });

  /* ================================================================ db-watchdog */
  const WD_MODES = {
    busy: ['Busy loop with no pause', 'The task never waits, so the idle task never runs and nobody feeds the watchdog.'],
    yield: ['A loop that calls yield()', 'yield() lets only tasks of the same priority in. None is ready, so the task simply carries on: the idle task still never runs.'],
    delay: ['Work, then delay(1)', 'Each pass the task works, then sleeps for a tick. For that tick the idle task runs, and it feeds the watchdog.'],
    hang: ['Fine, until a call hangs', 'The task behaves well until three seconds after each start, when a call (a sensor that was unplugged) never returns: from then on it never waits.']
  };
  Hyper.sim('db-watchdog', {
    title: 'Who feeds the watchdog?',
    blurb: `Your task runs at a higher priority than the **idle task**, which runs only when your task waits. The idle task is the one that **feeds the watchdog**: the counter in the bottom trace climbs while only your task runs, and drops to zero whenever the idle task gets the core. If it reaches the timeout, the chip resets. Time runs faster than real time (*Speed*). The picture is simplified to one core.

**Try this**
- *Busy loop*: the counter climbs to the timeout and the task watchdog fires; the message names the task that was running.
- *yield()*: no better. Then *Work, then delay(1)*: the counter never rises above the length of one pass.
- *Fine, until a call hangs* with a short timeout: a healthy device that fails after three seconds.
- Set *Interrupts off for* above 300 ms: a different watchdog, the interrupt watchdog, fires.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 360, maxH: 520 });
      const WIN = 10000, N = 12000, IWDT = 300;
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'What the task does', options: Object.keys(WD_MODES).map(k => [WD_MODES[k][0], k]), value: 'busy' },
        { id: 'to', label: 'Task watchdog timeout', min: 1, max: 10, step: 0.5, value: 5, unit: 's' },
        { id: 'work', label: 'Work per pass', min: 1, max: 200, step: 1, value: 10, unit: 'ms' },
        { id: 'irq', label: 'Interrupts off for', min: 0, max: 600, step: 10, value: 0, unit: 'ms' },
        { id: 'speed', label: 'Speed', min: 1, max: 20, step: 1, value: 4, unit: '×' },
        { type: 'buttons', items: [{ id: 'reset', label: 'Start again', primary: true }] }
      ], id => { if (id === 'reset' || id === 'mode') fresh(); loop.start(); });
      const ro = kit.readout(box.side, [['now', 'Now'], ['wdt', 'Watchdog counter'], ['resets', 'Resets so far'], ['idle', 'Idle task ran']]);
      let S, hist, wh, resets, marks;
      function fresh() {
        S = { ms: 0, boot: 0, wdt: 0, phase: 'run', rem: 0, irqLeft: 0, irqBlocked: 0, hold: 0, fired: null, idleMs: 0, totMs: 0 };
        hist = new Uint8Array(N); wh = new Float32Array(N); resets = 0; marks = [];
      }
      fresh();
      // one millisecond of the machine
      function tick() {
        const i = S.ms % N, since = S.ms - S.boot, W = ctl.values.work, mode = ctl.values.mode, X = ctl.values.irq;
        if (S.hold > 0) {                                   // the chip is resetting
          hist[i] = 3; wh[i] = 0; S.hold--; S.ms++;
          if (S.hold === 0) { S.boot = S.ms; S.wdt = 0; S.phase = 'run'; S.rem = W; S.irqLeft = 0; S.irqBlocked = 0; S.fired = null; resets++; marks.push(S.ms); }
          return;
        }
        // a critical section that starts every two seconds
        if (X > 0 && since >= 1000 && (since - 1000) % 2000 === 0 && S.irqLeft === 0) S.irqLeft = X;
        let who;                                            // 0 idle, 1 task, 2 interrupts off
        if (S.irqLeft > 0) {
          who = 2; S.irqLeft--; S.irqBlocked++;
          if (S.irqBlocked >= IWDT) { S.fired = ['int', "Guru Meditation Error: Core  0 panic'ed (Interrupt wdt timeout on CPU0)."]; S.hold = 1500; }
        } else {
          S.irqBlocked = 0;
          const spin = mode === 'busy' || mode === 'yield' || (mode === 'hang' && since >= 3000);
          if (spin) who = 1;
          else if (S.phase === 'run') { who = 1; S.rem--; if (S.rem <= 0) { S.phase = 'sleep'; S.rem = 1; } }
          else { who = 0; S.rem--; if (S.rem <= 0) { S.phase = 'run'; S.rem = W; } }
        }
        hist[i] = who;
        if (who === 0) { S.wdt = 0; S.idleMs++; } else S.wdt++;
        S.totMs++;
        wh[i] = S.wdt;
        if (S.wdt >= ctl.values.to * 1000 && !S.fired) { S.fired = ['task', 'E (' + Math.round(S.ms) + ') task_wdt: Task watchdog got triggered. IDLE0 did not report in ' + ctl.values.to + ' s.']; S.hold = 1500; }
        S.ms++;
      }
      const loop = kit.loop(dt => {
        const steps = Math.min(900, Math.round(dt * 1000 * ctl.values.speed));
        for (let k = 0; k < steps; k++) tick();
        const c = st.begin(), C = kit.colors(), W = st.W, M = 10, px = Math.min(100, Math.max(76, W * 0.19)), pw = W - px - M;
        const rows = [['your task', 1, kit.hue(212)], ['idle task', 0, kit.hue(150)], ['interrupts', 2, C.bad]];
        const rowH = 22, y0 = 14, t0 = S.ms - WIN, X = ms => px + (ms - t0) / WIN * pw;
        kit.label(c, 'who has the processor, over the last 10 s (simulated)', M, 6, { size: 11, color: C.muted });
        rows.forEach(([name, code, col], r) => {
          const y = y0 + 6 + r * (rowH + 6);
          if (code === 2) {
            kit.label(c, 'interrupts', px - 6, y + 6, { size: 10.5, color: C.text2, align: 'right' });
            kit.label(c, 'switched off', px - 6, y + 17, { size: 10.5, color: C.text2, align: 'right' });
          } else kit.label(c, name, px - 6, y + rowH / 2, { size: 11, color: C.text2, align: 'right' });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.05)'; c.fillRect(px, y, pw, rowH);
          for (let x = 0; x < pw; x++) {
            const a = Math.floor(t0 + x / pw * WIN), b = Math.max(a + 1, Math.floor(t0 + (x + 1) / pw * WIN));
            let n = 0, tot = 0;
            for (let m = a; m < b; m++) { if (m < 0 || m >= S.ms) continue; tot++; if (hist[m % N] === code) n++; }
            if (n > 0) { c.globalAlpha = 0.25 + 0.75 * (n / Math.max(1, tot)); c.fillStyle = col; c.fillRect(px + x, y, 1.2, rowH); }
          }
          c.globalAlpha = 1;
        });
        // resets
        for (const mk of marks) { if (mk >= t0) { c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(X(mk), y0); c.lineTo(X(mk), y0 + 3 * (rowH + 6) + 118); c.stroke(); } }
        // the counter
        const wy = y0 + 6 + 3 * (rowH + 6) + 14, wh2 = 100, top = Math.max(1, ctl.values.to * 1000) * 1.15;
        kit.label(c, 'watchdog', px - 6, wy + 12, { size: 11, color: C.text2, align: 'right' });
        kit.label(c, 'counter', px - 6, wy + 26, { size: 11, color: C.text2, align: 'right' });
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px, wy); c.lineTo(px, wy + wh2); c.lineTo(px + pw, wy + wh2); c.stroke();
        const ty = wy + wh2 - Math.min(1, ctl.values.to * 1000 / top) * wh2;
        c.setLineDash([5, 4]); c.strokeStyle = C.bad; c.beginPath(); c.moveTo(px, ty); c.lineTo(px + pw, ty); c.stroke(); c.setLineDash([]);
        kit.label(c, 'timeout ' + ctl.values.to + ' s', px + pw - 4, ty - 8, { size: 10.5, color: C.bad, align: 'right' });
        c.strokeStyle = C.accent; c.lineWidth = 1.6; c.beginPath();
        let started = false;
        for (let x = 0; x < pw; x++) {
          const a = Math.floor(t0 + x / pw * WIN), b = Math.max(a + 1, Math.floor(t0 + (x + 1) / pw * WIN));
          let mx = -1;
          for (let m = a; m < b; m++) { if (m < 0 || m >= S.ms) continue; mx = Math.max(mx, wh[m % N]); }
          if (mx < 0) continue;
          const yy = wy + wh2 - Math.min(1, mx / top) * wh2;
          if (!started) { c.moveTo(px + x, yy); started = true; } else c.lineTo(px + x, yy);
        }
        c.stroke();
        // the message
        const my = wy + wh2 + 20;
        if (S.fired) {
          const lines = wrapLines(c, S.fired[1], W - 2 * M, 11, true);
          lines.forEach((l, i) => kit.label(c, l, M, my + i * 15, { size: 11, font: MONO, color: C.bad, weight: 650 }));
          if (S.fired[0] === 'task') kit.label(c, 'Tasks currently running: CPU 0: ' + (ctl.values.mode === 'hang' ? 'sensorTask' : 'yourTask'), M, my + lines.length * 15, { size: 11, font: MONO, color: C.bad });
        } else para(kit, c, WD_MODES[ctl.values.mode][1], M, my - 8, W - 2 * M, 16, { size: 12, color: C.text2 });
        ro.set('now', S.hold > 0 ? 'resetting…' : S.irqLeft > 0 ? 'interrupts off' : (hist[(S.ms - 1 + N) % N] === 1 ? 'your task runs' : 'idle task runs'));
        ro.set('wdt', kit.fmt(S.wdt / 1000, 3) + ' s of ' + ctl.values.to + ' s');
        ro.set('resets', String(resets));
        ro.set('idle', S.totMs ? Math.round(100 * S.idleMs / S.totMs) + ' % of the time' : '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ db-stack */
  Hyper.sim('db-stack', {
    title: 'A stack filling towards the canary',
    blurb: `The tall bar is the **stack** of one task, with its size set when the task was created. Every call adds a frame (a fixed overhead plus the local buffer you declare); a hungry library call adds more. At the far end sits the **canary**. Past it lies other memory: an overflow tramples it until the canary is noticed. The sizes are typical, not measured.

**Try this**
- Press *Run it*: the stack fills as the calls go deeper, and the **high-water mark** stays where the deepest call left it.
- Raise *Local buffer*: a few hundred bytes per call, a dozen calls deep, and a 4 KB stack is gone.
- Tick the library call: 2 KB at the deepest point. See how little margin a small stack has.
- Keep the *margin* in the read-out above a few hundred bytes.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 380, maxH: 560 });
      let prog = 1;
      const ctl = kit.controls(box.side, [
        { id: 'size', label: 'Stack size of the task', min: 1024, max: 8192, step: 256, value: 4096, unit: 'bytes' },
        { id: 'depth', label: 'Call depth', min: 1, max: 30, step: 1, value: 8 },
        { id: 'buf', label: 'Local buffer in each call', min: 0, max: 1024, step: 32, value: 128, unit: 'bytes' },
        { id: 'lib', type: 'check', label: 'A hungry library call at the deepest point (2 KB)', value: false },
        { type: 'buttons', items: [{ id: 'run', label: 'Run it', primary: true }] }
      ], id => { if (id === 'run') { prog = 0; loop.start(); } else { prog = 1; loop.once(); } });
      const ro = kit.readout(box.side, [['used', 'Used at the deepest point'], ['free', 'High-water mark (free)'], ['verdict', 'Verdict']]);
      const BASE = 400, FRAME = 64, LIB = 2048;
      const usedAt = p => { const v = ctl.values, d = Math.round(v.depth * Math.min(1, p)); return BASE + d * (FRAME + v.buf) + (v.lib && p >= 1 ? LIB : 0); };
      const loop = kit.loop(dt => {
        if (prog < 1) prog = Math.min(1, prog + dt / 2.2);
        const c = st.begin(), C = kit.colors(), v = ctl.values, W = st.W, M = 12;
        const used = usedAt(prog), full = usedAt(1), size = v.size, over = used > size;
        const span = Math.max(size, full) * 1.0 + 700, top = 22, H = st.H - top - 18 - (full > size ? 44 : 0), sc = H / span;
        const bx = M + 6, bw = Math.min(110, W * 0.26);
        kit.label(c, 'low addresses ↑   the stack grows downwards', M, 10, { size: 11, color: C.muted });
        // the stack's own space
        c.fillStyle = C.dark ? 'rgba(255,255,255,.07)' : 'rgba(0,0,0,.05)'; c.fillRect(bx, top, bw, size * sc);
        c.strokeStyle = C.axis; c.lineWidth = 1.4; c.strokeRect(bx, top, bw, size * sc);
        // what is on it
        let y = top;
        const seg = (bytes, col, label) => { const h = bytes * sc; c.fillStyle = col; c.fillRect(bx, y, bw, Math.max(0.5, h)); const yy = y; y += h; return [yy, h]; };
        const base = seg(BASE, C.faint, 'task and system');
        const d = Math.round(v.depth * Math.min(1, prog));
        const callBytes = d * (FRAME + v.buf);
        const per = (FRAME + v.buf) * sc;
        for (let k = 0; k < d; k++) { c.fillStyle = k % 2 ? kit.hue(212, 0.85) : kit.hue(212, 0.6); c.fillRect(bx, y + k * per, bw, Math.max(0.5, per)); }
        y += callBytes * sc;
        const callEnd = y;
        if (v.lib && prog >= 1) { seg(LIB, C.warn, 'library'); }
        const topY = y;
        // the canary at the far end
        const cy = top + size * sc;
        c.fillStyle = C.bad; c.fillRect(bx - 4, cy - 3, bw + 8, 4);
        // beyond the stack
        c.save(); c.setLineDash([4, 4]); c.strokeStyle = C.faint; c.strokeRect(bx, cy + 3, bw, Math.max(8, (span - size) * sc - 4)); c.restore();
        kit.label(c, 'other memory', bx + bw / 2, cy + 18, { size: 10.5, color: C.faint, align: 'center' });
        if (over) { c.fillStyle = C.bad; c.globalAlpha = 0.6; c.fillRect(bx, cy + 3, bw, Math.max(1, (topY - cy))); c.globalAlpha = 1; }
        // a legend in a fixed column at the right (positions that follow the picture would collide)
        const lx = bx + bw + 22;
        let ly = top + 6;
        const item = (col, text, bold) => { c.fillStyle = col; c.fillRect(lx - 14, ly - 4, 9, 9); kit.label(c, text, lx, ly, { size: 11, color: C.text2, weight: bold ? 650 : 500 }); ly += 19; };
        kit.label(c, 'stack of ' + size + ' bytes', lx - 14, ly, { size: 11.5, color: C.text, weight: 650 }); ly += 21;
        item(C.faint, 'task and system: ' + BASE);
        item(kit.hue(212), d + ' calls × (' + FRAME + ' + ' + v.buf + ') = ' + callBytes);
        if (v.lib && prog >= 1) item(C.warn, 'library call: ' + LIB);
        item(C.bad, 'canary at the far end');
        c.strokeStyle = over ? C.bad : C.ok; c.lineWidth = 2; c.beginPath(); c.moveTo(bx - 8, topY); c.lineTo(bx + bw + 8, topY); c.stroke();
        item(over ? C.bad : C.ok, 'top of the stack now: ' + used, true);
        const freeMark = size - full;
        const verdict = freeMark < 0 ? 'overflow by ' + (-freeMark) + ' bytes' : freeMark < 500 ? 'tight: only ' + freeMark + ' bytes of margin' : 'fits, ' + freeMark + ' bytes of margin';
        if (over && prog >= 1) {
          const lines = wrapLines(c, "Guru Meditation Error: Core 1 panic'ed (Unhandled debug exception). Debug exception reason: Stack canary watchpoint triggered (myTask)", W - 2 * M, 10.5, true);
          lines.forEach((l, i) => kit.label(c, l, M, st.H - 8 - (lines.length - 1 - i) * 13, { size: 10.5, font: MONO, color: C.bad }));
        }
        ro.set('used', full + ' bytes of ' + size);
        ro.set('free', freeMark >= 0 ? freeMark + ' bytes' : 'overflowed');
        ro.set('verdict', verdict);
        if (prog >= 1) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ db-upload */
  const STEPS = ['Open the serial port', 'Reset the chip into download mode', 'Sync: say hello to the boot ROM', 'Identify the chip, raise the speed', 'Erase and write the flash', 'Reset and run the program'];
  const FAULTS = {
    ok: { name: 'Everything works', fail: -1, link: [], cause: 'Nothing is wrong: every stage succeeds.', cure: 'Nothing to do.', msg: [] },
    busy: { name: 'Another program holds the port', fail: 0, link: [1], msg: ["could not open port 'COM5': PermissionError(13, 'Access is denied.', None, 5)"], cause: 'A serial monitor or another IDE window has the port open; only one program can.', cure: 'Close the other program, then upload again.' },
    gone: { name: 'Port number changed or missing', fail: 0, link: [1], msg: ["could not open port 'COM5': FileNotFoundError(2, 'The system cannot find the file specified.', None, 2)"], cause: 'The board came back as another port number, or the cable came loose.', cure: 'Select the port again after replugging.' },
    cable: { name: 'Charge-only cable', fail: 0, link: [2], msg: ['[the port list stays empty: the computer cannot see the board]'], cause: 'The cable has power wires only. The board lights up and the computer never hears of it.', cure: 'Use a cable that carries data.' },
    driver: { name: 'Driver missing', fail: 0, link: [3], msg: ['[the port list stays empty: the bridge chip has no driver]'], cause: 'The USB-serial bridge (CP210x, CH340 …) needs a driver the computer does not have.', cure: 'Install the driver for the bridge chip.' },
    wrongport: { name: 'Wrong port (another device)', fail: 2, link: [1], msg: ['Connecting......_____......', 'A fatal error occurred: Failed to connect to ESP32: No serial data received.'], cause: 'The port opens, but nothing there answers: it belongs to another device.', cure: 'Pick the port that appears when you plug the board in.' },
    boot: { name: 'Chip not in download mode', fail: 2, link: [4], msg: ['Connecting......', 'A fatal error occurred: Failed to connect to ESP32: Wrong boot mode detected (0x13)! The chip needs to be in download mode.'], cause: 'The chip answers, but it is running its program: the automatic reset did not pull the boot pin low.', cure: 'Hold BOOT, tap RESET, release BOOT, upload again.' },
    uart: { name: 'A part loads the serial pins', fail: 2, link: [4], msg: ['Connecting......_____......', 'A fatal error occurred: Failed to connect to ESP32: Timed out waiting for packet header'], cause: 'A sensor or module on GPIO1 and GPIO3 (the serial pins of the ESP32) garbles the conversation.', cure: 'Disconnect whatever is on the serial pins while uploading.' },
    power: { name: 'Weak USB power', fail: 4, link: [2, 4], msg: ['Writing at 0x00010000... (21 %)', 'A fatal error occurred: The chip stopped responding.'], cause: 'Writing flash draws the most current; a weak port or a long cable browns out in the middle.', cure: 'Use a short cable, a powered hub, and unplug motors and radios.' },
    speed: { name: 'Upload speed too high for the cable', fail: 4, link: [2], msg: ['Writing at 0x00010000... (34 %)', 'Serial data stream stopped: Possible serial noise or corruption.'], cause: 'At 921 600 baud a poor cable corrupts data.', cure: 'Lower the upload speed to 115 200 baud, or change the cable.' },
    pin: { name: 'A part holds the boot pin low', fail: 5, link: [4], msg: ['Hard resetting via RTS pin...', '[the monitor then shows: waiting for download]'], cause: 'The upload worked, but at every reset the boot pin is low again, so the chip waits for another upload instead of running.', cure: 'Find what pulls GPIO0 (GPIO9 on a C3 or C6) low at reset.' }
  };
  const LINKS = [['esptool', 'tool'], ['port', 'computer'], ['cable', 'USB'], ['bridge', 'USB-UART'], ['chip', 'boot ROM']];
  Hyper.sim('db-upload', {
    title: 'An upload, link by link',
    blurb: `An upload runs through six stages and five links. Choose **what is wrong**, press *Upload*, and watch where it stops: the stage that fails, the message esptool prints, the cause and the first cure. The wording is the tool's, typical of versions 4 and 5; the port names are examples.

**Try this**
- *Charge-only cable* and *Driver missing* look the same: the port list stays empty. That is the clue.
- *Chip not in download mode* is different: the chip **answered**, so the cable and driver are fine.
- *Weak USB power* and *Upload speed too high* both fail while writing: one is current, the other noise.
- *A part holds the boot pin low* is the sneaky one: the upload succeeds and the program never runs.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.86, minH: 420, maxH: 600 });
      let key = 'ok', p = -1;                 // p: progress through the stages, -1 = not started
      const ctl = kit.controls(box.side, [
        { id: 'f', type: 'select', label: 'What is wrong', options: Object.keys(FAULTS).map(k => [FAULTS[k].name, k]), value: key },
        { type: 'buttons', items: [{ id: 'go', label: 'Upload', primary: true }] }
      ], (id, v) => { if (id === 'f') { key = v; p = -1; loop.once(); } if (id === 'go') { p = 0; loop.start(); } });
      const ro = kit.readout(box.side, [['stage', 'Stopped at'], ['cause', 'Cause'], ['cure', 'Try first']]);
      const loop = kit.loop(dt => {
        const F = FAULTS[key];
        if (p >= 0) { const end = F.fail >= 0 ? F.fail + 0.999 : STEPS.length; p = Math.min(end, p + dt / 0.9); }
        const c = st.begin(), C = kit.colors(), W = st.W, M = 12;
        const done = p >= 0 && (F.fail < 0 ? p >= STEPS.length : p >= F.fail + 0.999), stage = Math.floor(p);
        // the five links
        const n = LINKS.length, gap = 8, bw = (W - 2 * M - (n - 1) * gap) / n;
        LINKS.forEach(([nm, sub], i) => {
          const bad = F.link.includes(i);
          S.box(c, M + i * (bw + gap), 10, bw, 44, { label: nm, sub: bw > 62 ? sub : undefined, color: bad && done ? C.bad : kit.hue(212), active: bad && done, size: 11.5 });
          if (i < n - 1) kit.arrow(c, M + i * (bw + gap) + bw + 1, 32, M + (i + 1) * (bw + gap) - 1, 32, C.muted, 1.4, 5);
        });
        // the six stages
        const sy = 70, rh = 24;
        STEPS.forEach((s, i) => {
          const y = sy + i * rh, isFail = F.fail === i && done, passed = p >= 0 && i < Math.min(stage, F.fail >= 0 ? F.fail : 99), cur = p >= 0 && i === stage && !done;
          const col = isFail ? C.bad : passed ? C.ok : cur ? C.accent : C.faint;
          c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.arc(M + 9, y + rh / 2, 7, 0, 6.2832); if (passed || isFail) { c.fillStyle = col; c.fill(); } c.stroke();
          kit.label(c, isFail ? '×' : passed ? '✓' : String(i + 1), M + 9, y + rh / 2 + 0.5, { size: 10.5, color: passed || isFail ? (C.dark ? '#0d1020' : '#fff') : col, align: 'center', weight: 700 });
          kit.label(c, fit(c, s, W - 2 * M - 30, 12.5, false), M + 24, y + rh / 2, { size: 12.5, color: isFail ? C.bad : passed || cur ? C.text : C.muted, weight: isFail || cur ? 650 : 500 });
        });
        // the console
        const cy = sy + STEPS.length * rh + 14, chh = st.H - cy - 10;
        c.fillStyle = C.dark ? 'rgba(0,0,0,.4)' : 'rgba(0,0,0,.06)'; c.fillRect(M, cy, W - 2 * M, chh);
        const lines = [], ok = F.fail < 0, noPort = key === 'cable' || key === 'driver';
        if (p >= 0) {
          if (!noPort) lines.push(['Serial port COM5:', C.text2]);
          if (p >= 1 && (ok || F.fail > 0) && !(done && F.fail === 2)) lines.push(['Connecting....', C.text2]);
          if ((ok || F.fail > 2) && p >= 3) lines.push(['Connected to ESP32 on COM5', C.text2]);
          if ((ok || F.fail > 3) && p >= 4) { lines.push(['Chip type: ESP32-D0WD-V3', C.text2]); lines.push(['Changing baud rate to 460800', C.text2]); }
          if ((ok || F.fail > 4) && p >= 5) { lines.push(['Writing at 0x00010000... (100 %)', C.text2]); lines.push(['Hash of data verified.', C.text2]); }
          if (ok && p >= 6) lines.push(['Hard resetting via RTS pin...', C.ok]);
          if (done) F.msg.forEach(m => lines.push([m, m.charAt(0) === '[' ? C.warn : C.bad]));
          if (done && ok) lines.push(['Done: the program is running.', C.ok]);
        }
        let ly = cy + 10;
        for (const [t, col] of lines) {
          const ws = wrapLines(c, t, W - 2 * M - 14, 10.5, true);
          for (const w of ws) { if (ly < cy + chh - 4) kit.label(c, w, M + 7, ly, { size: 10.5, font: MONO, color: col }); ly += 13; }
        }
        if (p < 0) kit.label(c, 'press Upload', M + 7, cy + 14, { size: 11.5, color: C.faint });
        ro.set('stage', done ? (F.fail < 0 ? 'nowhere: it worked' : 'stage ' + (F.fail + 1) + ': ' + STEPS[F.fail]) : p < 0 ? '—' : 'running…');
        ro.set('cause', done ? F.cause : '—');
        ro.set('cure', done ? F.cure : '—');
        if (done || p < 0) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ db-jtag */
  const JCODE = [
    'int limit = 100;', 'int total = 0;', '', 'void tune(int step) {', '  limit = limit - step * 5;', '}', '', 'void loop() {',
    '  for (int i = 1; i <= 6; i++) {', '    total += i * 10;', '    if (total > limit) {', '      tune(i);', '    }', '  }',
    '  Serial.printf("total %d limit %d\\n", ...);', '}'
  ];
  const JSTEP = [5, 9, 10, 11, 12, 15];           // lines that carry a statement (a breakpoint can go there)
  // the whole run of three passes, as a list of statements executed: { line, stack, writes: [[name, old, new]], after: {…} }
  const JTRACE = (() => {
    const E = [], s = { limit: 100, total: 0, i: 0, step: null };
    const push = (line, stack, writes) => E.push({ line, stack, writes, after: Object.assign({}, s) });
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 1; i <= 6; i++) {
        const oi = s.i; s.i = i; push(9, ['loop()'], [['i', oi, i]]);
        const ot = s.total; s.total += i * 10; push(10, ['loop()'], [['total', ot, s.total]]);
        push(11, ['loop()'], []);
        if (s.total > s.limit) {
          push(12, ['loop()'], []);
          const ol = s.limit; s.step = i; s.limit = s.limit - i * 5;
          push(5, ['tune(step=' + i + ')', 'loop()'], [['limit', ol, s.limit]]);
          s.step = null;
        }
      }
      push(15, ['loop()'], []);
    }
    return E;
  })();
  Hyper.sim('db-jtag', {
    title: 'Breakpoints and watchpoints',
    blurb: `The program on the left is the one from the page: **tune()** keeps lowering **limit**. You are the debugger. Click in the **gutter** next to a line to set a breakpoint (there are only two, as on an ESP32 or S3), tick a **watchpoint** to stop whenever a variable changes, and use *Step*, *Step over* and *Continue*. The program is a made-up trace of three passes of the loop; the behaviour of the debugger is real.

**Try this**
- Set a breakpoint on line 12 and press *Continue* a few times: the first time through, \`tune\` is called only when \`i\` reaches 5.
- Clear it, tick *Watch limit* and *Continue*: the program stops inside \`tune\`, with the call stack showing who called it.
- Tick *Watch total* as well, then try a third breakpoint: the chip has no comparator left.
- *Step over* on line 12 runs the whole call to \`tune\`; *Step* goes into it.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 480, maxH: 640 });
      let pos = 0, bps = new Set(), msg = 'Halted before the first statement (line 9 of loop). Step, or press Continue.', hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'wl', type: 'check', label: 'Watch limit', value: false },
        { id: 'wt', type: 'check', label: 'Watch total', value: false },
        { type: 'buttons', items: [{ id: 'step', label: 'Step' }, { id: 'over', label: 'Step over' }, { id: 'cont', label: 'Continue', primary: true }, { id: 'reset', label: 'Start again' }] }
      ], id => {
        if (id === 'step') step(false);
        else if (id === 'over') step(true);
        else if (id === 'cont') cont();
        else if (id === 'reset') { pos = 0; msg = 'Halted before the first statement (line 9 of loop).'; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['stop', 'Stopped because'], ['bp', 'Hardware breakpoints'], ['wp', 'Watchpoints']]);
      const watched = () => { const w = new Set(); if (ctl.values.wl) w.add('limit'); if (ctl.values.wt) w.add('total'); return w; };
      const stateNow = () => (pos > 0 ? JTRACE[pos - 1].after : { limit: 100, total: 0, i: 0, step: null });
      // run one statement; -> a stop message if a watchpoint fired
      function exec() {
        const e = JTRACE[pos]; pos++;
        const w = watched(), hit = e.writes.find(x => w.has(x[0]) && x[1] !== x[2]);
        if (hit) return 'Watchpoint: ' + hit[0] + ' changed ' + hit[1] + ' → ' + hit[2] + ' at line ' + e.line + ' in ' + e.stack[0] + (e.stack.length > 1 ? ', called from ' + e.stack[1] : '');
        return null;
      }
      function step(over) {
        if (pos >= JTRACE.length) { msg = 'The three traced passes are done: press Start again.'; return; }
        let m = exec();
        if (!m && over && JTRACE[pos - 1].line === 12 && JTRACE[pos] && JTRACE[pos].line === 5) m = exec();
        msg = m || (pos >= JTRACE.length ? 'The three traced passes are done.' : 'Stepped: now at line ' + JTRACE[pos].line + ' in ' + JTRACE[pos].stack[0] + '.');
      }
      function cont() {
        if (pos >= JTRACE.length) { msg = 'The three traced passes are done: press Start again.'; return; }
        let first = true, guard = 0;
        while (pos < JTRACE.length && guard++ < 1000) {
          if (!first && bps.has(JTRACE[pos].line)) { msg = 'Breakpoint at line ' + JTRACE[pos].line + ' in ' + JTRACE[pos].stack[0] + '.'; return; }
          first = false;
          const m = exec();
          if (m) { msg = m; return; }
        }
        msg = 'The three traced passes are done.';
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 10, lh = 16, gutter = 34;
        const wide = W >= 540, codeW = wide ? Math.round(W * 0.58) : W - 2 * M;
        const s = stateNow(), cur = pos < JTRACE.length ? JTRACE[pos] : null;
        kit.label(c, 'loop() and tune() — click the gutter for a breakpoint', M, 10, { size: 11, color: C.muted });
        const cy = 24;
        c.fillStyle = C.dark ? 'rgba(0,0,0,.35)' : 'rgba(0,0,0,.06)'; c.fillRect(M, cy, codeW, JCODE.length * lh + 8);
        hits = [];
        JCODE.forEach((t, i) => {
          const y = cy + 4 + i * lh, ln = i + 1;
          if (cur && cur.line === ln) { c.fillStyle = C.dark ? 'rgba(123,140,255,.28)' : 'rgba(60,90,220,.16)'; c.fillRect(M, y, codeW, lh); }
          kit.label(c, String(ln), M + gutter - 6, y + lh / 2, { size: 10.5, font: MONO, color: C.faint, align: 'right' });
          if (bps.has(ln)) { c.fillStyle = C.bad; c.beginPath(); c.arc(M + 8, y + lh / 2, 5, 0, 6.2832); c.fill(); }
          else if (JSTEP.includes(ln)) { c.strokeStyle = C.faint; c.lineWidth = 1; c.beginPath(); c.arc(M + 8, y + lh / 2, 4, 0, 6.2832); c.stroke(); }
          if (cur && cur.line === ln) kit.label(c, '▶', M + gutter + 2, y + lh / 2, { size: 10, color: C.accent });
          kit.label(c, fit(c, t, codeW - gutter - 22, 11.5, true), M + gutter + 14, y + lh / 2, { size: 11.5, font: MONO, color: cur && cur.line === ln ? C.text : C.text2 });
          if (JSTEP.includes(ln)) hits.push({ y, h: lh, ln });
        });
        // the panels: at the right of the code, or in two columns below it on a narrow stage
        const colW = (W - 2 * M) / 2;
        const vx = wide ? M + codeW + 12 : M, py = wide ? cy : cy + JCODE.length * lh + 18;
        kit.label(c, 'variables', vx, py + 6, { size: 11.5, weight: 650, color: C.text2 });
        const prev = pos > 1 ? JTRACE[pos - 2].after : { limit: 100, total: 0, i: 0, step: null };
        const vars = [['limit', s.limit], ['total', s.total], ['i', s.i]].concat(cur && cur.stack[0].indexOf('tune') === 0 ? [['step', JTRACE[pos].stack[0].replace(/\D/g, '')]] : []);
        vars.forEach(([n, v], k) => {
          const changed = prev[n] !== undefined && String(prev[n]) !== String(v) && pos > 0 && JTRACE[pos - 1].writes.some(x => x[0] === n && x[1] !== x[2]);
          kit.label(c, n + ' = ' + v, vx + 8, py + 24 + k * 16, { size: 12, font: MONO, color: changed ? C.warn : v < 0 ? C.bad : C.text, weight: changed ? 700 : 500 });
        });
        const stack = cur ? cur.stack : ['(finished)'];
        const sx = wide ? vx : M + colW, sy2 = wide ? py + 24 + vars.length * 16 + 10 : py;
        kit.label(c, 'call stack', sx, sy2 + (wide ? 0 : 6), { size: 11.5, weight: 650, color: C.text2 });
        stack.forEach((t, k) => kit.label(c, fit(c, '#' + k + '  ' + t, colW - 12, 12, true), sx + 8, sy2 + (wide ? 18 : 24) + k * 16, { size: 12, font: MONO, color: C.text2 }));
        const my = wide ? sy2 + 18 + stack.length * 16 + 12 : py + 24 + Math.max(vars.length, stack.length) * 16 + 12;
        const pw = wide ? W - vx - M : W - 2 * M, mx = wide ? vx : M;
        const lines = wrapLines(c, msg, pw, 12, false);
        lines.forEach((l, k) => kit.label(c, l, mx, my + 8 + k * 16, { size: 12, color: /Watchpoint/.test(msg) ? C.warn : /Breakpoint/.test(msg) ? C.bad : C.text2, weight: 600 }));
        ro.set('stop', msg.length > 60 ? msg.slice(0, 57) + '…' : msg);
        ro.set('bp', bps.size + ' of 2');
        ro.set('wp', watched().size + ' of 2');
      }, box.stage);
      kit.click(st, p => {
        const h = hits.find(q => p.x < 10 + 34 + 4 && p.y >= q.y && p.y <= q.y + q.h);
        if (!h) return;
        if (bps.has(h.ln)) bps.delete(h.ln);
        else if (bps.size >= 2) msg = 'No hardware breakpoint is left: the chip has two. Clear one first.';
        else bps.add(h.ln);
        loop.once();
      }, p => p.x < 48 && hits.some(q => p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ db-bisect */
  Hyper.sim('db-bisect', {
    title: 'Find the faulty change',
    blurb: `The fault appeared somewhere between a version that worked (change 0) and the broken one (the last change). Click a change to **build and run that version**: green means it works, red means the fault shows. The goal is the first bad change in the fewest tests; halving the range each time needs only about log₂ of their number. The faulty change is hidden and different each time.

Turn down **Chance that the fault shows** and the fault becomes *intermittent*: a bad version may pass, so a single pass proves nothing and each "good" needs several runs.

**Try this**
- 32 changes, certain fault: test the middle one, then the middle of the half that is left. Five tests find it.
- Press *Test the middle for me* to see that strategy play out.
- Set the chance to 30 %: count how many runs you now need before you trust a green version.
- Look for a case where a bad version passes every run by luck: you are fooled.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 410, maxH: 540 });
      let seed = 11, R = rng(seed), N = 32, bad = 17, cells = [], tests = [], runs = 0, found = null, reveal = false, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'n', type: 'select', label: 'Changes in the range', options: [['8', 8], ['16', 16], ['32', 32], ['64', 64], ['128', 128]], value: 32 },
        { id: 'p', label: 'Chance that the fault shows in one run', min: 10, max: 100, step: 5, value: 100, unit: '%' },
        { type: 'buttons', items: [{ id: 'mid', label: 'Test the middle for me', primary: true }, { id: 'new', label: 'New puzzle' }, { id: 'show', label: 'Show the answer' }] }
      ], id => {
        if (id === 'n' || id === 'new') fresh();
        else if (id === 'p') { fresh(); }
        else if (id === 'mid') autoMid();
        else if (id === 'show') reveal = true;
        loop.once();
      });
      const ro = kit.readout(box.side, [['runs', 'Runs so far'], ['ideal', 'Fewest possible'], ['range', 'The fault is in'], ['k', 'Runs to trust a green'], ['res', 'Result']]);
      function fresh() {
        seed = (seed * 7919 + 13) >>> 0; R = rng(seed);
        N = ctl.values.n; bad = 1 + Math.floor(R() * N);
        cells = Array.from({ length: N + 1 }, () => ({ pass: 0, fail: 0 }));
        tests = []; runs = 0; found = null; reveal = false;
      }
      const need = () => { const p = ctl.values.p / 100; return p >= 0.999 ? 1 : Math.max(1, Math.ceil(Math.log(0.05) / Math.log(1 - p))); };
      function bounds() {
        const k = need();
        let lo = 0, hi = N;
        for (let i = 1; i < N; i++) { if (cells[i].fail > 0) { hi = Math.min(hi, i); } else if (cells[i].pass >= k && i < hi) lo = Math.max(lo, i); }
        for (let i = 1; i < N; i++) if (cells[i].fail > 0 && i <= lo) lo = Math.min(lo, i - 1);   // a failure below a "good" overrides it
        return [lo, hi];
      }
      function runVersion(i) {
        if (i < 1 || i >= N) return;
        runs++;
        const shows = i >= bad && R() < ctl.values.p / 100;
        if (shows) cells[i].fail++; else cells[i].pass++;
        tests.push('#' + i + (shows ? ': the fault shows' : ': passes'));
        const [lo, hi] = bounds();
        found = hi - lo === 1 ? hi : null;
      }
      function autoMid() {
        if (found != null) return;
        const [lo, hi] = bounds(), mid = lo + Math.floor((hi - lo) / 2);
        if (mid < 1 || mid >= N) return;
        let g = 0;
        while (g++ < 40 && cells[mid].fail === 0 && cells[mid].pass < need()) { runVersion(mid); if (cells[mid].fail > 0) break; }
      }
      fresh();
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 12;
        const k = need(), [lo, hi] = bounds(), ideal = Math.ceil(Math.log2(N));
        const total = N + 1, cols = Math.min(total, Math.max(8, Math.floor((W - 2 * M) / 20))), rows = Math.ceil(total / cols), cw = (W - 2 * M) / cols, ch = Math.min(cw, 26);
        kit.label(c, 'changes 0 … ' + N + ', oldest first: 0 works, ' + N + ' is broken', M, 10, { size: 11, color: C.muted });
        hits = [];
        for (let i = 0; i <= N; i++) {
          const x = M + (i % cols) * cw, y = 24 + Math.floor(i / cols) * (ch + 3), w = cw - 3, cell = cells[i];
          const inRange = i > lo && i <= hi, known = i === 0 || i === N || cell.fail > 0 || cell.pass > 0;
          let fill = C.surface, line = C.faint, a = 1;
          if (i === 0 || (i < N && cell.fail === 0 && cell.pass >= k)) { fill = C.ok; line = C.ok; }
          else if (i === N || cell.fail > 0) { fill = C.bad; line = C.bad; }
          else if (cell.pass > 0) { fill = kit.hue(150, 0.35); line = C.ok; }
          if (!inRange && !(i === 0 || i === N) && !known) a = 0.35;
          c.globalAlpha = a; c.fillStyle = fill; c.fillRect(x, y, w, ch); c.strokeStyle = line; c.lineWidth = 1.2; c.strokeRect(x + 0.5, y + 0.5, w - 1, ch - 1); c.globalAlpha = 1;
          if (cw >= 17 && N <= 64) kit.label(c, i === 0 || cell.fail > 0 || i === N ? String(i) : cell.pass > 0 && cell.pass < k ? String(cell.pass) : String(i), x + w / 2, y + ch / 2, { size: 9.5, color: (fill === C.ok || fill === C.bad) ? (C.dark ? '#0d1020' : '#fff') : C.text2, align: 'center' });
          if ((reveal || found != null) && i === bad) { c.strokeStyle = C.warn; c.lineWidth = 2.5; c.strokeRect(x - 1, y - 1, w + 2, ch + 2); }
          hits.push({ x, y, w, h: ch, i });
        }
        const by = 24 + rows * (ch + 3) + 12;
        const leg = wrapLines(c, 'green: works (after ' + k + ' run' + (k > 1 ? 's' : '') + ') · red: the fault showed · pale green: passed, not yet trusted · gold ring: the culprit', W - 2 * M, 10.5, false);
        leg.forEach((l, j) => kit.label(c, l, M, by + j * 13, { size: 10.5, color: C.muted }));
        let ly = by + leg.length * 13 + 12;
        kit.label(c, 'last tests', M, ly, { size: 11.5, weight: 650, color: C.text2 });
        tests.slice(-4).forEach((t, j) => kit.label(c, t, M + 8, ly + 16 + j * 14, { size: 11, font: MONO, color: C.text2 }));
        ly += 16 + 4 * 14 + 8;
        let res = 'still searching';
        if (found != null) res = found === bad ? 'found: change #' + found + ' is the first bad one — in ' + runs + ' runs (fewest possible ' + ideal + ')' : 'you say #' + found + ', but the culprit is #' + bad + ': a bad version passed every run by luck';
        const lines = wrapLines(c, found != null ? res : 'Click a change between ' + (lo + 1) + ' and ' + (hi - 1) + ' to run that version.', W - 2 * M, 12.5, false);
        lines.forEach((l, j) => { if (ly + j * 16 < st.H - 4) kit.label(c, l, M, ly + j * 16, { size: 12.5, weight: 650, color: found != null ? (found === bad ? C.ok : C.bad) : C.text }); });
        ro.set('runs', String(runs));
        ro.set('ideal', ideal + ' tests (certain fault)');
        ro.set('range', hi - lo <= 1 ? 'change #' + hi : 'changes ' + (lo + 1) + ' to ' + hi + ' (' + (hi - lo) + ' left)');
        ro.set('k', String(k));
        ro.set('res', found != null ? (found === bad ? 'found #' + found : 'fooled: truth is #' + bad) : 'still searching');
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h && found == null) { runVersion(h.i); loop.once(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ db-soak */
  Hyper.sim('db-soak', {
    title: 'What a short test cannot see',
    blurb: `The curve is the **free heap** of a device over two weeks: the normal ups and downs of its work (Wi-Fi reconnects, secure handshakes), and a slow **leak** underneath. The shaded part is your **test**. Below, the chance that the same test would catch a fault that strikes only now and then. The numbers are examples, not measurements.

**Try this**
- Leave the leak at 400 bytes an hour and the test at 6 hours: the drop is far smaller than the ups and downs, so the test sees nothing wrong.
- Lengthen the test until the downward trend stands out from the noise.
- Read **Heap lasts**: the leak that is invisible in a morning ends the device within weeks.
- Move **Fault comes once every** and read the chance that the test misses it: it falls only when the test is several times longer.`,
    mount(box, kit) {
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 340, maxH: 500 });
      const SPAN = 336, HEAP0 = 200;           // hours (14 days), KB free at the start
      const ctl = kit.controls(box.side, [
        { id: 'leak', label: 'Leak', min: 0, max: 2000, step: 50, value: 400, unit: 'bytes/h' },
        { id: 'noise', label: 'Normal ups and downs', min: 0, max: 40, step: 1, value: 15, unit: 'KB' },
        { id: 'test', label: 'Test length', min: 1, max: 336, step: 1, value: 6, unit: 'h', log: true },
        { id: 'mtbf', label: 'Fault comes once every', min: 6, max: 720, step: 1, value: 48, unit: 'h', log: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['drop', 'Heap lost during the test'], ['see', 'Can the test see it?'], ['dies', 'Heap lasts'], ['miss', 'A once-in-a-while fault is missed']]);
      const heap = t => HEAP0 - ctl.values.leak * t / 1000 - ctl.values.noise * (0.5 * Math.abs(Math.sin(t * 1.19)) + 0.5 * Math.abs(Math.sin(t * 3.7 + 1)));
      const dur = h => (h < 48 ? (h < 10 ? h.toFixed(1) : Math.round(h)) + ' hours' : (h / 24 < 10 ? (h / 24).toFixed(1) : Math.round(h / 24)) + ' days');
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 12, v = ctl.values;
        const px = 42, pw = W - px - M, py = 22, ph = st.H - py - 134;
        const X = t => px + t / SPAN * pw, Y = kb => py + ph - clamp(kb / HEAP0, 0, 1.05) * ph;
        kit.label(c, 'free heap (KB) over 14 days', M, 10, { size: 11, color: C.muted });
        // the test window
        const tw = Math.min(SPAN, v.test);
        c.fillStyle = C.dark ? 'rgba(123,140,255,.20)' : 'rgba(60,90,220,.12)'; c.fillRect(X(0), py, Math.max(2, X(tw) - X(0)), ph);
        kit.label(c, 'your test: ' + dur(v.test), Math.min(px + pw - 4, X(tw) + 5), py + 10, { size: 10.5, color: C.accent, align: X(tw) > px + pw - 120 ? 'right' : 'left' });
        // axes and grid
        c.strokeStyle = C.axis; c.lineWidth = 1; c.beginPath(); c.moveTo(px, py); c.lineTo(px, py + ph); c.lineTo(px + pw, py + ph); c.stroke();
        for (const kb of [0, 50, 100, 150, 200]) { kit.label(c, String(kb), px - 5, Y(kb), { size: 10, color: C.faint, align: 'right' }); c.strokeStyle = C.grid; c.beginPath(); c.moveTo(px, Y(kb)); c.lineTo(px + pw, Y(kb)); c.stroke(); }
        for (const d of [0, 2, 4, 6, 8, 10, 12, 14]) kit.label(c, d + ' d', X(d * 24), py + ph + 11, { size: 10, color: C.faint, align: 'center' });
        // the curve
        c.strokeStyle = C.accent; c.lineWidth = 1.5; c.beginPath();
        const n = Math.max(120, Math.floor(pw * 1.5));
        for (let i = 0; i <= n; i++) { const t = i / n * SPAN, y = Y(Math.max(0, heap(t))); if (i) c.lineTo(X(t), y); else c.moveTo(X(t), y); }
        c.stroke();
        // exhaustion
        const dies = v.leak > 0 ? (HEAP0 - v.noise * 0.5) * 1000 / v.leak : Infinity;
        if (dies <= SPAN) { c.strokeStyle = C.bad; c.setLineDash([4, 4]); c.beginPath(); c.moveTo(X(dies), py); c.lineTo(X(dies), py + ph); c.stroke(); c.setLineDash([]); kit.label(c, 'heap gone', X(dies) - 4, py + 24, { size: 10.5, color: C.bad, align: 'right' }); }
        // the chance of missing a fault
        const miss = Math.exp(-v.test / v.mtbf), by = py + ph + 34, bw = W - 2 * M;
        const ml = wrapLines(c, 'Chance that this test misses a fault that comes once every ' + dur(v.mtbf) + ': ' + Math.round(miss * 100) + ' %', bw, 11.5, false);
        ml.forEach((l, j) => kit.label(c, l, M, by - 6 + j * 14, { size: 11.5, color: C.text2 }));
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; c.fillRect(M, by + 16, bw, 14);
        c.fillStyle = miss > 0.5 ? C.bad : miss > 0.05 ? C.warn : C.ok; c.fillRect(M, by + 16, bw * miss, 14);
        kit.label(c, 'to be 95 % sure of seeing it: ' + dur(3 * v.mtbf), M, by + 44, { size: 11, color: C.muted });
        const dropKB = v.leak * v.test / 1000;
        ro.set('drop', kit.fmt(dropKB, 3) + ' KB');
        ro.set('see', v.leak === 0 ? 'no leak to see' : dropKB > 2 * v.noise && dropKB > 1 ? 'yes: the trend stands out of the noise' : 'no: lost in the normal ups and downs');
        ro.set('dies', isFinite(dies) ? dur(dies) : 'for ever (no leak)');
        ro.set('miss', Math.round(miss * 100) + ' % of such tests');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
