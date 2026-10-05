/* HYPER-ESP32 · sims/espressif-devkits.js
 *
 *   dk-anatomy        a development board taken apart: USB, bridge, regulator, auto-reset, module, buttons, LEDs, headers
 *   dk-autoreset      DTR and RTS against EN and the boot pin: what esptool does, and why both lines at once do nothing
 *   dk-board-pair     two DevKits side by side with every header pin coloured by what the datasheet says about it
 *   dk-kit-chooser    which Espressif board: filters over the 66 records of the board catalogue
 *   dk-kit-map        the parts of an evaluation kit as blocks around its module, from the catalogue's on-board list
 *   dk-memory-budget  camera frames, audio buffers and display frames against the RAM and PSRAM of a board
 *   dk-lcdkit-pins    the 22 GPIOs of the ESP32-C3-LCDkit and who uses each
 *   dk-jtag-pins      the pad JTAG pins of each chip, their strapping duties, and which chips need no adapter
 *
 * Every board and pin fact is read from the board catalogue at run time (Hyper.esp, Espressif records read on
 * 2026-10-04); the drawings are schematic.
 */
(function () {
  'use strict';

  /* ================================================================ helpers */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const font = (size, weight) => (weight || 500) + ' ' + size + 'px system-ui, "Segoe UI", sans-serif';
  /* a string cut with an ellipsis so that it fits maxW pixels */
  function fit(c, str, maxW, size, weight) {
    str = String(str == null ? '' : str);
    c.save(); c.font = font(size, weight);
    if (c.measureText(str).width <= maxW) { c.restore(); return str; }
    let s = str;
    while (s.length > 1 && c.measureText(s + '…').width > maxW) s = s.slice(0, -1);
    c.restore();
    return s.trimEnd() + '…';
  }
  /* word-wrap: -> an array of lines, at most maxLines (the last one cut with an ellipsis) */
  function wrap(c, str, maxW, size, weight, maxLines) {
    c.save(); c.font = font(size, weight);
    const words = String(str == null ? '' : str).split(/\s+/).filter(Boolean), out = [];
    let line = '';
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxW && line) { out.push(line); line = w; } else line = t;
    }
    if (line) out.push(line);
    c.restore();
    if (maxLines && out.length > maxLines) { const keep = out.slice(0, maxLines); keep[maxLines - 1] = keep[maxLines - 1].replace(/\s*\S*$/, '') + '…'; return keep; }
    return out;
  }
  /* draw wrapped lines; -> the y after the last line */
  function para(kit, c, str, x, y, maxW, size, color, lineH, maxLines, weight) {
    const lines = wrap(c, str, maxW, size, weight, maxLines);
    lines.forEach((t, i) => kit.label(c, t, x, y + i * lineH, { size, color, weight }));
    return y + lines.length * lineH;
  }
  const chipName = (E, id) => { const ch = E.chip(id); return ch ? ch.name : String(id); };
  const mb = s => { const m = /(\d+)\s*MB/i.exec(String(s || '')); return m ? +m[1] : 0; };
  const fmtBytes = n => { const f = (v, d) => String(+v.toFixed(d)); return n >= 1048576 ? f(n / 1048576, n >= 10485760 ? 0 : 2) + ' MB' : n >= 1024 ? f(n / 1024, n >= 10240 ? 0 : 1) + ' KB' : Math.round(n) + ' B'; };

  /* ================================================================ dk-anatomy */
  const ANATOMY_BOARDS = [
    ['ESP32-DevKitC V4', 'esp32-devkitc-v4'], ['ESP32-S3-DevKitC-1 v1.1', 'esp32-s3-devkitc-1-v1.1'], ['ESP32-C3-DevKitM-1', 'esp32-c3-devkitm-1'],
    ['ESP32-C6-DevKitC-1', 'esp32-c6-devkitc-1'], ['ESP32-H2-DevKitM-1', 'esp32-h2-devkitm-1'], ['ESP-WROVER-KIT', 'esp-wrover-kit']
  ];
  /* what the catalogue record says about the blocks of a board */
  function anatomyOf(E, b) {
    const u = b.usb || {}, br = String(u.bridge || ''), cn = String(u.conn || ''), on = b.onboard || [];
    const hasBridge = /uart|bridge|cp210|ft22|ch34/i.test(br) && !/^none/i.test(br);
    const hasNative = /native/i.test(br);
    const m = /x\s*(\d)/i.exec(cn);
    const conns = Math.max(m ? +m[1] : 1, (hasBridge ? 1 : 0) + (hasNative ? 1 : 0), 1);
    const kind = /type-c|usb-c/i.test(cn) ? 'USB-C' : /micro/i.test(cn) ? 'Micro-USB' : 'USB';
    const bridgeName = /CP2102N/i.test(br) ? 'CP2102N' : /CP2102/i.test(br) ? 'CP2102' : /FT2232/i.test(br) ? 'FT2232' : /CH34/i.test(br) ? 'CH340' : 'USB–UART';
    const sp = /up to\s*([\d.]+\s*[MK]bps)/i.exec(br);
    const pled = on.find(t => /power on led/i.test(t)) || '';
    const rail = /\b5\s?V/i.test(pled) ? '5 V' : /3\.3\s?V/i.test(pled) ? '3.3 V' : '';
    let rgbPin = null;
    for (const t of on) { const g = /RGB.*GPIO\s*(\d+)/i.exec(t); if (g) { rgbPin = +g[1]; break; } }
    const ldo = on.find(t => /ldo/i.test(t)) || '';
    const holes = (b.headers || []).reduce((a, h) => a + h.pins.length, 0);
    const gpios = (b.headers || []).reduce((a, h) => a + h.pins.filter(p => E.parsePin(p).gpio != null).length, 0);
    const pins = E.PINS[b.chip] ? E.PINS[b.chip].defaults || {} : {};
    return { hasBridge, hasNative, conns, kind, bridgeName, speed: sp ? sp[1] : '', rail, rgbPin, ldo, j5: on.some(t => /J5/.test(t)), xtal: on.some(t => /32\.768/.test(t)),
      holes, gpios, rows: (b.headers || []).length, tx: pins.tx, rx: pins.rx, boot: pins.boot, part: b.part || '', hasLed: !!pled };
  }

  Hyper.sim('dk-anatomy', {
    title: 'A development board taken apart',
    blurb: `The blocks are read from the board's catalogue record: connectors, bridge chip, LEDs, the J5 current jumper. Pick a board, then **follow** one path: the current, the data, or the reset and boot lines. The moving dots show the direction.

**Try this**
- Choose the **ESP32-DevKitC V4**: one connector, a bridge, no user LED. Then the **S3-DevKitC-1**: a second connector goes straight to the chip.
- Follow the **power** path on the C6 board and find the **J5** jumper: break it and you can measure the module alone.
- Follow **reset and boot**: the two buttons do by hand what the bridge's DTR and RTS lines do by wire.
- Click any block for what it does.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 430, maxH: 580 });
      const start = ANATOMY_BOARDS.some(o => o[1] === params.board) ? params.board : ANATOMY_BOARDS[0][1];
      let sel = null, phase = 0, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'board', type: 'select', label: 'Board', options: ANATOMY_BOARDS, value: start },
        { id: 'follow', type: 'select', label: 'Follow', options: [['Everything', 'all'], ['Power: 5 V to 3.3 V', 'power'], ['Data: program and serial port', 'data'], ['Reset and boot', 'reset']], value: 'all' }
      ], () => { sel = null; loop.start(); });
      const ro = kit.readout(box.side, [['usb', 'USB'], ['chip', 'Chip'], ['led', 'LEDs'], ['pins', 'Header'], ['about', 'Selected block']]);
      const IN = { power: ['usbA', 'ldo', 'module', 'headers'], data: ['usbA', 'usbB', 'bridge', 'module'], reset: ['bridge', 'reset', 'buttons', 'module'] };
      const about = (k, A, b) => ({
        usbA: 'The USB connector: 5 V for the board and, if it has a bridge, the data lines to it.',
        usbB: 'A second connector that goes straight to the chip\'s own USB pins, with no bridge in between.',
        ldo: 'A linear regulator turns the 5 V of USB into 3.3 V for the module and the 3V3 pin.' + (A.ldo ? ' The record names: ' + A.ldo + '.' : ''),
        bridge: 'The bridge chip appears to the computer as a serial port and talks UART to the chip.' + (A.speed ? ' Speed limit: ' + A.speed + '.' : ''),
        reset: 'Two transistors turn the DTR and RTS lines into the boot pin and EN, so the computer can reset and program the chip.',
        module: 'The module: ' + chipName(E, b.chip) + ' with its flash' + (b.psram ? ', PSRAM' : '') + ', crystal and antenna.',
        buttons: 'EN resets the chip; BOOT, held during a reset, asks for download mode.',
        leds: 'The power LED' + (A.rail ? ' is on the ' + A.rail + ' rail' : '') + (A.rgbPin != null ? '; the RGB LED is on GPIO' + A.rgbPin : '') + '.',
        headers: 'Two rows of pins with the GPIOs, 3V3, 5V and ground, for a breadboard.'
      })[k];
      const loop = kit.loop(dt => {
        phase += dt * 45;
        const c = st.begin(), C = kit.colors();
        const b = E.board(ctl.values.board);
        if (!b) return;
        const A = anatomyOf(E, b), follow = ctl.values.follow;
        const W = st.W, M = 8, capH = 92, Hd = st.H - capH - M, usable = W - 2 * M;
        const fw = [0.21, 0.24, 0.27, 0.2], gap = usable * 0.08 / 3;
        const cw = fw.map(f => f * usable), x1 = M, x2 = x1 + cw[0] + gap, x3 = x2 + cw[1] + gap, x4 = x3 + cw[2] + gap;
        const y = f => M + f * Hd, fs = W < 520 ? 10.5 : 12;
        const R = {
          usbA: { x: x1, y: y(0.13), w: cw[0], h: 0.26 * Hd }, usbB: { x: x1, y: y(0.76), w: cw[0], h: 0.24 * Hd },
          ldo: { x: x2, y: y(0.02), w: cw[1], h: 0.18 * Hd }, bridge: { x: x2, y: y(0.28), w: cw[1], h: 0.18 * Hd }, reset: { x: x2, y: y(0.54), w: cw[1], h: 0.18 * Hd },
          module: { x: x3, y: y(0.02), w: cw[2], h: 0.78 * Hd },
          buttons: { x: x4, y: y(0.02), w: cw[3], h: 0.22 * Hd }, leds: { x: x4, y: y(0.3), w: cw[3], h: 0.22 * Hd }, headers: { x: x4, y: y(0.58), w: cw[3], h: 0.22 * Hd }
        };
        const showB = A.hasNative && A.conns >= 2;
        if (!A.hasBridge) { R.usbA.y = y(0.3); }
        const cy = r => r.y + r.h / 2, rx = r => r.x + r.w;
        const mx1 = rx(R.usbA) + gap / 2;
        // wires
        const wires = [];
        const add = (kind, pts) => wires.push({ kind, pts });
        add('power', [[rx(R.usbA), R.usbA.y + 0.2 * R.usbA.h], [mx1, R.usbA.y + 0.2 * R.usbA.h], [mx1, cy(R.ldo)], [R.ldo.x, cy(R.ldo)]]);
        add('power', [[rx(R.ldo), cy(R.ldo)], [R.module.x, cy(R.ldo)]]);
        add('power', [[rx(R.module), cy(R.headers)], [R.headers.x, cy(R.headers)]]);
        if (A.hasBridge) {
          add('data', [[rx(R.usbA), R.usbA.y + 0.8 * R.usbA.h], [mx1, R.usbA.y + 0.8 * R.usbA.h], [mx1, cy(R.bridge)], [R.bridge.x, cy(R.bridge)]]);
          add('data', [[rx(R.bridge), cy(R.bridge)], [R.module.x, cy(R.bridge)]]);
          add('reset', [[R.bridge.x + R.bridge.w / 2, R.bridge.y + R.bridge.h], [R.bridge.x + R.bridge.w / 2, R.reset.y]]);
          add('reset', [[rx(R.reset), cy(R.reset)], [R.module.x, cy(R.reset)]]);
        } else add('data', [[rx(R.usbA), cy(R.usbA)], [mx1, cy(R.usbA)], [mx1, cy(R.bridge)], [R.module.x, cy(R.bridge)]]);
        if (showB) add('data', [[rx(R.usbB), cy(R.usbB)], [R.module.x + R.module.w / 2, cy(R.usbB)], [R.module.x + R.module.w / 2, R.module.y + R.module.h]]);
        add('reset', [[rx(R.module), cy(R.buttons)], [R.buttons.x, cy(R.buttons)]]);
        add('led', [[rx(R.module), cy(R.leds)], [R.leds.x, cy(R.leds)]]);
        const col = { power: C.warn, data: C.accent, reset: kit.hue(330), led: C.faint };
        for (const w of wires) {
          const on = follow === 'all' || w.kind === follow || w.kind === 'led';
          c.save(); c.globalAlpha = on ? 1 : 0.22;
          S.wire(c, w.pts, { color: col[w.kind], width: 2 });
          c.restore();
          if (on && follow !== 'all' && w.kind !== 'led') S.flow(c, w.pts, phase, { color: col[w.kind], r: 2.6, gap: 16 });
          else if (follow === 'all' && w.kind !== 'led') S.flow(c, w.pts, phase, { color: col[w.kind], r: 1.8, gap: 22 });
        }
        // the J5 jumper on the supply wire
        if (A.j5) {
          const jx = (rx(R.ldo) + R.module.x) / 2, jy = cy(R.ldo);
          c.fillStyle = C.bg2; c.fillRect(jx - 9, jy - 6, 18, 12); c.strokeStyle = C.warn; c.lineWidth = 1.6; c.strokeRect(jx - 9, jy - 6, 18, 12);
          kit.label(c, 'J5', jx, jy - 13, { size: 9.5, color: C.warn, align: 'center', weight: 600 });
        }
        // the blocks
        hits = [];
        const draw = (k, label, sub, color) => {
          const r = R[k], member = (IN[follow] || []).indexOf(k) >= 0, inPath = follow === 'all' || member || k === 'leds';
          c.save(); c.globalAlpha = inPath ? 1 : 0.3;
          S.box(c, r.x, r.y, r.w, r.h, { label: fit(c, label, r.w - 8, fs, 600), sub: sub ? fit(c, sub, r.w - 6, fs - 2) : null, color, active: sel === k || (follow !== 'all' && member), size: fs });
          c.restore();
          hits.push({ k, x: r.x, y: r.y, w: r.w, h: r.h });
        };
        draw('usbA', A.kind, A.hasBridge ? 'to the bridge' : 'to the chip', C.muted);
        if (showB) draw('usbB', A.kind, 'to the chip itself', kit.hue(250));
        draw('ldo', 'LDO 3.3 V', A.ldo ? A.ldo.split(/\s/)[0] : 'from 5 V', C.warn);
        if (A.hasBridge) { draw('bridge', A.bridgeName, A.speed || 'serial bridge', C.accent); draw('reset', 'Auto-reset', 'DTR · RTS', kit.hue(330)); }
        draw('module', chipName(E, b.chip), b.flash ? b.flash + ' flash' : 'module', kit.hue(150));
        if (b.psram) kit.label(c, fit(c, b.psram + ' PSRAM', R.module.w - 8, fs - 2), R.module.x + R.module.w / 2, R.module.y + R.module.h / 2 + 24, { size: fs - 2, color: C.muted, align: 'center' });
        draw('buttons', 'EN · BOOT', 'boot = GPIO' + (A.boot == null ? '?' : A.boot), kit.hue(330));
        draw('leds', 'LEDs', (A.rgbPin != null ? 'RGB: GPIO' + A.rgbPin : A.hasLed ? 'power LED' : 'none listed') + (A.rail ? ' · ' + A.rail : ''), C.text2);
        draw('headers', 'Headers', A.rows + ' × ' + Math.round(A.holes / Math.max(1, A.rows)) + ' pins', C.text2);
        // the caption
        const cap = sel ? about(sel, A, b) : ({
          all: 'Pick a path to follow, or click a block. ' + b.name + ': ' + A.conns + ' × ' + A.kind + (A.hasBridge ? ', bridge ' + A.bridgeName : ', no bridge') + (A.hasNative ? ', chip\'s own USB' : '') + '.',
          power: '5 V from the USB connector goes through the 3.3 V regulator to the module and the 3V3 pin.' + (A.rail ? ' The power LED sits on the ' + A.rail + ' rail.' : '') + (A.j5 ? ' Lift the J5 jumper to measure the module on its own.' : ''),
          data: A.hasBridge ? 'The computer talks to the bridge, which talks UART to the chip' + (A.tx != null ? ' (GPIO' + A.tx + ' and GPIO' + A.rx + ')' : '') + '.' + (showB ? ' The second connector reaches the chip\'s own USB directly.' : '') : 'The connector goes straight to the chip\'s own USB pins.',
          reset: A.hasBridge ? 'RTS pulls EN low (reset); DTR holds GPIO' + A.boot + ' low as EN rises (download mode). The EN and BOOT buttons do the same by hand.' : 'No bridge, so no DTR and RTS: the chip\'s own USB does the job, and the two buttons work by hand.'
        })[follow];
        para(kit, c, cap, M, M + Hd + 10, W - 2 * M, 11.5, C.text2, 15, 5);
        ro.set('usb', A.conns + ' × ' + A.kind + ' · ' + (A.hasBridge ? A.bridgeName + ' bridge' : 'no bridge') + (A.hasNative ? ' + own USB' : ''));
        ro.set('chip', chipName(E, b.chip) + (b.flash ? ' · ' + b.flash : '') + (b.psram ? ' + ' + b.psram + ' PSRAM' : ''));
        ro.set('led', (A.hasLed ? 'power' + (A.rail ? ' (' + A.rail + ')' : '') : 'none listed') + (A.rgbPin != null ? ' · RGB on GPIO' + A.rgbPin : '') + (A.j5 ? ' · J5 jumper' : '') + (A.xtal ? ' · 32 kHz crystal option' : ''));
        ro.set('pins', A.holes + ' holes · ' + A.gpios + ' GPIO numbers · ' + (b.size ? b.size[0] + ' × ' + b.size[1] + ' mm' : 'size not listed'));
        ro.set('about', sel ? about(sel, A, b) : 'Click a block');
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); sel = h ? (sel === h.k ? null : h.k) : null; loop.once(); },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ dk-autoreset */
  // esptool's sequences as [ms, DTR asserted, RTS asserted] steps; the window shows 0 to 240 ms
  const RESET_SEQ = {
    boot: { steps: [[0, 0, 0], [20, 0, 1], [120, 1, 0], [170, 0, 0]], note: 'esptool: RTS resets the chip, then DTR holds the boot pin low as EN rises.' },
    run: { steps: [[0, 0, 0], [20, 0, 1], [120, 0, 0]], note: 'esptool after flashing: RTS alone resets the chip, with the boot pin high.' },
    open: { steps: [[0, 0, 0], [60, 1, 1]], note: 'A terminal opens the port and sets DTR and RTS at the same moment.' }
  };
  Hyper.sim('dk-autoreset', {
    title: 'DTR and RTS: the auto-reset circuit',
    blurb: `Four traces: the two control lines of the USB bridge (high = asserted), the chip's **EN** pin and its **boot pin** (GPIO0 on the ESP32 and S3, GPIO9 on the C3 and C6). The two transistors turn the lines into EN and the boot pin: each conducts only when its two inputs *differ*.

**Try this**
- Play **esptool: into download mode**. EN dips low (reset), then rises while the boot pin is low: the chip reads it and waits for a program.
- Play **a terminal opens the port**: both lines are set at once and nothing happens — that is the reason for the crossing.
- Untick **cross-coupled transistors**, as if each line drove its pin directly, and play the same: opening a terminal now holds the chip in reset with the boot pin low.
- In **manual** mode set the lines yourself and watch the table: only two of the four combinations do anything.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 400, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'What happens', options: [['esptool: into download mode', 'boot'], ['esptool: restart the program', 'run'], ['A terminal opens the port', 'open'], ['Manual: set the lines yourself', 'manual']], value: 'boot' },
        { id: 'cross', type: 'check', label: 'Cross-coupled transistors (the real circuit)', value: true },
        { id: 'dtr', type: 'check', label: 'Manual: DTR asserted', value: false },
        { id: 'rts', type: 'check', label: 'Manual: RTS asserted', value: false },
        { type: 'buttons', items: [{ id: 'play', label: 'Play again', primary: true }] }
      ], (id) => {
        if (id === 'mode' || id === 'play') { cursor = 0; hold = 0; hist = [[0, 0, 0]]; }
        if ((id === 'dtr' || id === 'rts') && ctl.values.mode === 'manual') hist.push([T, ctl.values.dtr ? 1 : 0, ctl.values.rts ? 1 : 0]);
        syncControls(); loop.start();
      });
      const ro = kit.readout(box.side, [['en', 'EN pin'], ['io0', 'Boot pin'], ['chip', 'The chip']]);
      let cursor = 0, hold = 0, T = 0, hist = [[0, 0, 0]];
      const syncControls = () => { const man = ctl.values.mode === 'manual'; ctl.show('dtr', man); ctl.show('rts', man); ctl.show('play', !man); };
      syncControls();
      // EN and the boot pin from the two lines: 1 = high
      const lines = (dtr, rts, cross) => ({ en: (rts && (!cross || !dtr)) ? 0 : 1, io0: (dtr && (!cross || !rts)) ? 0 : 1 });
      // a step list -> the four traces' edges over [t0, t1] seconds
      function traces(steps, cross, tEnd) {
        const eD = [], eR = [], eE = [], eI = [];
        let pd = null, pr = null, pe = null, pi = null;
        for (const [t, d, r] of steps) {
          const L = lines(d, r, cross), ts = t / 1000;
          if (d !== pd) { eD.push([ts, d]); pd = d; }
          if (r !== pr) { eR.push([ts, r]); pr = r; }
          if (L.en !== pe) { eE.push([ts, L.en]); pe = L.en; }
          if (L.io0 !== pi) { eI.push([ts, L.io0]); pi = L.io0; }
        }
        return { eD, eR, eE, eI };
      }
      const level = (edges, t) => { let v = edges.length ? edges[0][1] : 0; for (const [a, b] of edges) { if (a <= t) v = b; else break; } return v; };
      const lowSpans = (edges, t1) => { const out = []; let a = null; for (const [t, v] of edges) { if (v === 0 && a == null) a = t; if (v === 1 && a != null) { out.push([a, t]); a = null; } } if (a != null) out.push([a, t1]); return out; };
      // what the chip does: look at the boot pin at each rising edge of EN
      function verdict(eE, eI, t) {
        let res = 'runs the program (nothing happened)', last = null;
        for (let i = 1; i < eE.length; i++) if (eE[i][0] <= t && eE[i][1] === 1 && eE[i - 1][1] === 0) last = eE[i][0];
        if (last != null) res = level(eI, last) === 0 ? 'enters download mode and waits for a program' : 'restarts and runs the program';
        if (level(eE, t) === 0) res = 'is held in reset' + (level(eI, t) === 0 ? ' with the boot pin low: download mode when the lines are released' : '');
        return res;
      }
      const loop = kit.loop((dt, tm) => {
        T = tm;
        const manual = ctl.values.mode === 'manual', cross = !!ctl.values.cross;
        const c = st.begin(), C = kit.colors();
        const W = st.W, M = 10;
        let steps, t0, t1, now;
        if (manual) {
          t1 = Math.max(3, T); t0 = t1 - 3; now = t1;
          steps = hist.map(h => [h[0] * 1000, h[1], h[2]]);
        } else {
          const sq = RESET_SEQ[ctl.values.mode] || RESET_SEQ.boot;
          steps = sq.steps; t0 = 0; t1 = 0.24;
          if (dt > 0) { if (cursor < 0.24) cursor = Math.min(0.24, cursor + dt * 0.06); else { hold += dt; if (hold > 1.4) { cursor = 0; hold = 0; } } }
          now = cursor;
        }
        const tr = traces(steps, cross, t1);
        const toMs = a => a;
        const mk = (spans, text, color) => spans.map(([a, b]) => ({ t0: a, t1: b, text, color })).filter(m => m.t1 > t0 && m.t0 < t1);
        const lh = Math.round(st.H * 0.46);
        S.logic(c, M, M, W - 2 * M, lh, [
          { label: 'RTS', edges: tr.eR, color: kit.hue(30), idle: 0 },
          { label: 'DTR', edges: tr.eD, color: kit.hue(200), idle: 0 },
          { label: 'EN', edges: tr.eE, color: kit.hue(330), idle: 1, marks: mk(lowSpans(tr.eE, t1), 'reset', 'rgba(229,72,77,.28)') },
          { label: 'boot', edges: tr.eI, color: kit.hue(150), idle: 1, marks: mk(lowSpans(tr.eI, t1), 'low', 'rgba(224,160,48,.30)') }
        ], { t0, t1, cursor: manual ? null : now, unit: manual ? 's' : 'ms', labelW: 40, grid: 8 });
        // the verdict
        const vy = M + lh + 10;
        const v = verdict(tr.eE, tr.eI, manual ? now : now);
        const bad = /held|download/.test(v) ? C.warn : C.ok;
        S.box(c, M, vy, W - 2 * M, 38, { color: bad, active: true });
        para(kit, c, 'The chip ' + v, M + 10, vy + 12, W - 2 * M - 20, W < 520 ? 11 : 12, C.text, 14, 2, 600);
        // the truth table
        const dNow = manual ? (ctl.values.dtr ? 1 : 0) : level(tr.eD, now), rNow = manual ? (ctl.values.rts ? 1 : 0) : level(tr.eR, now);
        const ty = vy + 38 + 12, colW = (W - 2 * M) / 4, rowH = 17;
        ['DTR', 'RTS', 'EN', 'boot pin'].forEach((h, i) => kit.label(c, h, M + colW * (i + 0.5), ty + 6, { size: 11, color: C.muted, align: 'center', weight: 600 }));
        [[0, 0], [1, 1], [1, 0], [0, 1]].forEach(([d, r], i) => {
          const y = ty + 18 + i * rowH, L = lines(d, r, cross), on = d === dNow && r === rNow;
          if (on) { c.fillStyle = C.dark ? 'rgba(123,140,255,.22)' : 'rgba(60,90,220,.13)'; c.fillRect(M, y - 1, W - 2 * M, rowH - 1); }
          const cells = [d ? 'asserted' : 'off', r ? 'asserted' : 'off', L.en ? 'high' : 'LOW', L.io0 ? 'high' : 'LOW'];
          cells.forEach((t, k) => kit.label(c, t, M + colW * (k + 0.5), y + 7, { size: 11, align: 'center', color: (k >= 2 && t === 'LOW') ? C.warn : C.text2, weight: on ? 650 : 500 }));
        });
        const L = lines(dNow, rNow, cross);
        ro.set('en', L.en ? 'high (running)' : 'LOW (reset)'); ro.set('io0', L.io0 ? 'high (normal start)' : 'LOW (download mode)'); ro.set('chip', v);
        if (!manual && cursor >= 0.24 && hold > 1.35) { /* about to replay */ }
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ dk-board-pair */
  const PAIR_BOARDS = () => Hyper.esp.BOARDS.filter(b => b.maker === 'Espressif' && b.headers && b.headers.length);
  Hyper.sim('dk-board-pair', {
    title: 'Two DevKits side by side',
    blurb: `Each header pin is coloured by what the chip's datasheet says about it: **yellow** strapping pins, **red** pins used by flash or PSRAM, **blue** USB, **olive** JTAG, grey ground and power. A warm outline marks the **on-board LED pin**, a blue one the **BOOT pin**. Choose any two Espressif boards that have a header table in [the board catalogue](#/tools/boards?maker=Espressif); the [pinout explorer](#/tools/pinout) shows the same boards one at a time.

**Try this**
- Compare the **S3-DevKitC-1 v1.0 and v1.1**: the rows are identical, only the LED pin moves.
- Set *Show* to **flash or PSRAM**: on the ESP32 DevKitC six pins are lost; on the S3 three.
- Compare the **DevKitC V4** with the **C3-DevKitM-1**: count the pins that are free of any colour.
- Set *Show* to **strapping pins** to see how many each chip has on its header.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 1.3, minH: 520, maxH: 700 });
      const list = PAIR_BOARDS(), opts = list.map(b => [b.name, b.id]);
      const pick = (id, alt) => (list.some(b => b.id === id) ? id : alt);
      const ctl = kit.controls(box.side, [
        { id: 'a', type: 'select', label: 'Left board', options: opts, value: pick(params.a, 'esp32-devkitc-v4') },
        { id: 'b', type: 'select', label: 'Right board', options: opts, value: pick(params.b, 'esp32-s3-devkitc-1-v1.1') },
        { id: 'show', type: 'select', label: 'Show', options: [['All pins', ''], ['Strapping pins', 'strap'], ['Flash or PSRAM pins', 'flash'], ['USB and JTAG', 'usb'], ['Free GPIO only', 'free']], value: '' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['a', 'Left'], ['b', 'Right'], ['la', 'LED, left'], ['lb', 'LED, right']]);
      const stats = (b) => {
        const k = { gpio: 0, strap: 0, flash: 0, usb: 0, jtag: 0, nc: 0 }, total = { n: 0 };
        for (const h of b.headers) for (const raw of h.pins) {
          const p = E.parsePin(raw);
          if (p.gpio == null) { if (/NC/i.test(p.label)) k.nc++; continue; }
          k.gpio++; total.n++;
          const kind = E.pinKind(b.chip, p);
          if (kind === 'strap') k.strap++; else if (kind === 'flash') k.flash++; else if (kind === 'usb') k.usb++; else if (kind === 'jtag') k.jtag++;
        }
        return k;
      };
      const ledPin = b => { for (const t of (b.onboard || [])) { const g = /LED.*GPIO\s*(\d+)/i.exec(t); if (g) return +g[1]; } return null; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 6, footH = 78;
        const bs = [E.board(ctl.values.a), E.board(ctl.values.b)];
        const half = (W - 2 * M) / 2, show = ctl.values.show;
        bs.forEach((b, i) => {
          if (!b) return;
          const x = M + i * half, led = ledPin(b), boot = E.PINS[b.chip] && E.PINS[b.chip].defaults ? E.PINS[b.chip].defaults.boot : null;
          const hl = {};
          if (boot != null) hl[boot] = kit.hue(230, 0.9);
          if (led != null) hl[led] = kit.hue(30, 0.95);
          S.board(c, b, { x: x + 2, y: M, w: half - 4, h: st.H - footH - M }, {
            highlight: hl, labels: W >= 380,
            dim: p => {
              if (!show) return false;
              const kind = p.gpio == null ? 'none' : E.pinKind(b.chip, p);
              if (show === 'free') return !(kind === 'gpio' || kind === 'adc' || kind === 'touch' || kind === 'dac' || kind === 'i2c' || kind === 'spi');
              if (show === 'usb') return !(kind === 'usb' || kind === 'jtag');
              return kind !== show;
            }
          });
          const k = stats(b), fy = st.H - footH + 8;
          kit.label(c, fit(c, b.name, half - 8, 12, 650), x + 6, fy, { size: 12, weight: 650 });
          kit.label(c, k.gpio + ' GPIO numbers on the headers', x + 6, fy + 17, { size: 11, color: C.text2 });
          kit.label(c, fit(c, k.strap + ' strapping · ' + k.flash + ' flash/PSRAM · ' + k.usb + ' USB' + (k.nc ? ' · ' + k.nc + ' NC' : ''), half - 8, 11), x + 6, fy + 33, { size: 11, color: C.muted });
          kit.label(c, fit(c, [b.flash ? b.flash + ' flash' : '', b.psram ? b.psram + ' PSRAM' : ''].filter(Boolean).join(' · ') || 'memory not listed', half - 8, 11), x + 6, fy + 49, { size: 11, color: C.muted });
        });
        bs.forEach((b, i) => {
          if (!b) return;
          const k = stats(b), led = ledPin(b);
          ro.set(i ? 'b' : 'a', b.name + ': ' + k.gpio + ' GPIO · ' + k.strap + ' strap · ' + k.flash + ' flash/PSRAM');
          ro.set(i ? 'lb' : 'la', led != null ? 'GPIO' + led : 'no LED pin listed');
        });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ dk-kit-chooser */
  const CHIP_HUE = { 'esp32': 215, 'esp32-s2': 190, 'esp32-s3': 150, 'esp32-c3': 40, 'esp32-c2': 60, 'esp32-c5': 20, 'esp32-c6': 300, 'esp32-c61': 270, 'esp32-h2': 95, 'esp32-p4': 350, 'esp32-s31': 120, 'esp32-h4': 80, 'esp32-h21': 110, 'esp8266': 0 };
  const CHIP_ORDER = ['esp32', 'esp32-s2', 'esp32-s3', 'esp32-c2', 'esp32-c3', 'esp32-c5', 'esp32-c6', 'esp32-c61', 'esp32-h2', 'esp32-h4', 'esp32-h21', 'esp32-p4', 'esp32-s31', 'esp8266'];
  Hyper.sim('dk-kit-chooser', {
    title: 'Which Espressif board?',
    blurb: `Tick what the project needs; the list keeps the Espressif boards that have it. The 66 records of [the board catalogue](#/tools/boards?maker=Espressif) are filtered by what their **chip** offers (Wi-Fi generation, bands, the 802.15.4 radio, Bluetooth Classic) and by what is **on the board** (PSRAM, camera, display, audio, Ethernet, the chip's own USB). Use **Page** to move through a long list; click a row for the catalogue's remarks.

**Try this**
- Tick **5 GHz Wi-Fi**: only the C5 boards remain.
- Tick **802.15.4** and **Bluetooth Classic**: there is no board with both of them — except one chip not yet in general use.
- Tick **Camera** and **PSRAM on the board**, then add **still current** to drop the discontinued kits.
- Choose the **C-series** and tick **PSRAM**: which of the four DevKits carry it?`,
    mount(box, kit, params) {
      const E = kit.esp;
      const recs = E.family('Espressif').slice();
      const present = CHIP_ORDER.filter(id => recs.some(b => b.chip === id));
      const has = (b, k) => (b.has || []).indexOf(k) >= 0;
      const ch = b => E.chip(b.chip) || {};
      const CHECKS = [
        ['wifi6', 'Wi-Fi 6 or newer', b => ch(b).wifi && ch(b).wifi.gen >= 6], ['band5', '5 GHz Wi-Fi', b => ch(b).wifi && (ch(b).wifi.bands || []).indexOf(5) >= 0],
        ['z154', '802.15.4 (Zigbee, Thread)', b => !!ch(b).ieee802154], ['classic', 'Bluetooth Classic', b => !!(ch(b).bt && ch(b).bt.classic)],
        ['psram', 'PSRAM on the board', b => !!b.psram], ['camera', 'Camera', b => has(b, 'camera')], ['display', 'Display', b => has(b, 'display')],
        ['audio', 'Microphone or speaker', b => has(b, 'mic') || has(b, 'speaker')], ['eth', 'Ethernet', b => has(b, 'eth')],
        ['native', 'The chip\'s own USB', b => /native/i.test((b.usb && b.usb.bridge) || '')], ['current', 'Still current', b => b.status === 'current']
      ];
      const chipOpts = [['Any chip', '']].concat([['C-series (C2 C3 C5 C6 C61)', 'c']], present.map(id => [chipName(E, id), id]));
      const startChip = params.chip === 'c' || present.indexOf(params.chip) >= 0 ? params.chip : '';
      const defs = [{ id: 'chip', type: 'select', label: 'Chip', options: chipOpts, value: startChip }]
        .concat(CHECKS.map(([id, label]) => ({ id, type: 'check', label, value: false })))
        .concat([{ id: 'page', label: 'Page', min: 1, max: 8, step: 1, value: 1 }]);
      let sel = null, hits = [];
      const ctl = kit.controls(box.side, defs, id => { if (id !== 'page') { ctl.set('page', 1); } sel = null; loop.once(); });
      const ro = kit.readout(box.side, [['n', 'Boards that match'], ['sel', 'Selected'], ['note', 'The catalogue says']]);
      const match = b => {
        const cv = ctl.values.chip;
        if (cv === 'c' ? !/^esp32-c/.test(b.chip) : cv && b.chip !== cv) return false;
        return CHECKS.every(([id, , f]) => !ctl.values[id] || f(b));
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 8;
        const list = recs.filter(match).sort((a, b) => CHIP_ORDER.indexOf(a.chip) - CHIP_ORDER.indexOf(b.chip) || a.name.localeCompare(b.name));
        const rowH = W < 520 ? 38 : 34, top = 26, per = Math.max(3, Math.floor((st.H - top - 22) / rowH)), pages = Math.max(1, Math.ceil(list.length / per));
        const page = clamp(Math.round(ctl.values.page), 1, pages);
        hits = [];
        kit.label(c, list.length + (list.length === 1 ? ' board' : ' boards') + (pages > 1 ? ' · page ' + page + ' of ' + pages : ''), M, 13, { size: 12, weight: 650 });
        list.slice((page - 1) * per, page * per).forEach((b, i) => {
          const y = top + i * rowH, hue = CHIP_HUE[b.chip] == null ? 200 : CHIP_HUE[b.chip], on = sel === b.id;
          c.fillStyle = on ? (C.dark ? 'rgba(123,140,255,.22)' : 'rgba(60,90,220,.13)') : (i % 2 ? 'transparent' : (C.dark ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.03)'));
          c.fillRect(M - 2, y, W - 2 * M + 4, rowH - 2);
          c.fillStyle = kit.hue(hue); c.fillRect(M - 2, y, 4, rowH - 2);
          const tag = chipName(E, b.chip).replace('ESP32-', ''), tw = Math.min(70, W * 0.18);
          kit.label(c, fit(c, b.name, W - 2 * M - tw - 14, 12.5, 600), M + 8, y + 11, { size: 12.5, weight: 600 });
          kit.label(c, fit(c, tag, tw, 11, 600), W - M - 2, y + 11, { size: 11, weight: 600, align: 'right', color: kit.hue(hue) });
          const sub = [b.flash ? b.flash + ' flash' : '', b.psram ? b.psram + ' PSRAM' : '', (b.has || []).filter(k => ['camera', 'display', 'touch', 'mic', 'speaker', 'eth', 'battery'].indexOf(k) >= 0).join(' · ')].filter(Boolean).join(' · ');
          kit.label(c, fit(c, sub || 'no details in the record', W - 2 * M - 70, 10.5), M + 8, y + 25, { size: 10.5, color: C.muted });
          kit.dot(c, W - M - 6, y + 25, 3.5, b.status === 'current' ? C.ok : C.faint);
          hits.push({ id: b.id, y, h: rowH - 2 });
        });
        if (!list.length) kit.label(c, 'No Espressif board has all of that. Untick one of the boxes.', M, top + 20, { size: 12, color: C.muted });
        kit.label(c, 'green dot: still current · grey: discontinued or superseded', M, st.H - 9, { size: 10, color: C.faint });
        ro.set('n', list.length + ' of ' + recs.length);
        const s = sel && E.board(sel);
        ro.set('sel', s ? s.name : '—');
        ro.set('note', s ? ((s.watch && s.watch[0]) || (s.good && s.good[0]) || 'no remarks in the record') : 'click a row');
      }, box.stage);
      const st = kit.stage(box.stage, { aspect: 1.25, minH: 480, maxH: 640 });
      kit.click(st, p => { const h = hits.find(q => p.y >= q.y && p.y <= q.y + q.h); sel = h ? h.id : null; loop.once(); }, p => hits.some(q => p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ dk-kit-map */
  // the catalogue's on-board lines, sorted into kinds by their words
  const KIND = [
    ['audio', 'Audio', 280, /codec|speaker|micro?phone|amplifier|\bPA\b|ES\d{4}|NS41|audio|headphone|AUX|DAC/i], ['display', 'Display, touch', 215, /LCD|display|MIPI DSI|touch|screen/i],
    ['camera', 'Camera', 30, /camera|CSI|OV\d{4}|DVP/i], ['storage', 'Storage, memory', 175, /microSD|SD card|SD slot|flash|PSRAM|SD-card/i],
    ['power', 'Power', 8, /battery|charger|LDO|regulator|Li-ion|power|jumper|AP5056|crystal/i], ['radio', 'Radio', 200, /Wi-Fi|antenna|radio|IPEX|PIFA|C6-MINI|C5-MINI|H2-MINI|802\.15/i],
    ['link', 'USB, debug, ports', 250, /USB|JTAG|header|connector|UART|bridge|DIP|expansion|Ethernet|PHY|RJ45|FT2232|FPC/i], ['sense', 'Sensors, input', 140, /gyro|accelero|IMU|encoder|infrared|IR_|button|QMA|sensor/i]
  ];
  const kindOf = t => { for (const k of KIND) if (k[3].test(t)) return k; return ['other', 'Other', 0, null]; };
  Hyper.sim('dk-kit-map', {
    title: 'What an evaluation kit carries',
    blurb: `The module is at the top; under it, one card for each part the catalogue lists as **on the board**, coloured by what it is for. Click a card for the full line of the record. The picture is a list drawn from the catalogue, not a layout of the board.

**Try this**
- Look at the **ESP32-P4-Function-EV-Board**: find the C6 module that gives it Wi-Fi.
- Compare the **S3-EYE** with the **Korvo-2**: which carries the camera, which the microphone array?
- Count the cards in *Power*: a charger and a battery socket mean the kit can run alone.
- Open the **LyraT**: the DIP switches and the JTAG header share pins with the SD card.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const all = E.family('Espressif').filter(b => b.onboard && b.onboard.length >= 3);
      const wanted = Array.isArray(params.boards) ? params.boards.map(id => E.board(id)).filter(Boolean) : all.filter(b => b.family === 'Kit');
      const list = (wanted.length ? wanted : all).map(b => [b.name, b.id]);
      const start = list.some(o => o[1] === params.board) ? params.board : list[0][1];
      let sel = null, hits = [];
      const ctl = kit.controls(box.side, [{ id: 'board', type: 'select', label: 'Kit', options: list, value: start }], () => { sel = null; loop.once(); });
      const ro = kit.readout(box.side, [['chip', 'Chip'], ['mem', 'Memory'], ['usb', 'USB'], ['status', 'Status'], ['sel', 'Selected part']]);
      const st = kit.stage(box.stage, { aspect: 1.3, minH: 520, maxH: 680 });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 8;
        const b = E.board(ctl.values.board);
        if (!b) return;
        hits = [];
        // the module
        const mh = 62;
        c.save(); c.beginPath(); c.roundRect ? c.roundRect(M, M, W - 2 * M, mh, 9) : c.rect(M, M, W - 2 * M, mh); c.fillStyle = C.surface; c.fill(); c.lineWidth = 2; c.strokeStyle = kit.hue(150); c.stroke(); c.restore();
        kit.label(c, fit(c, chipName(E, b.chip) + (b.role === 'co' ? ' (radio co-processor)' : ''), W - 2 * M - 16, 14, 650), M + 10, M + 16, { size: 14, weight: 650 });
        kit.label(c, fit(c, b.part || '', W - 2 * M - 16, 10.5), M + 10, M + 35, { size: 10.5, color: C.muted });
        kit.label(c, fit(c, [b.flash ? b.flash + ' flash' : '', b.psram ? b.psram + ' PSRAM' : '', b.size ? b.size.join(' × ') + ' mm' : ''].filter(Boolean).join(' · '), W - 2 * M - 16, 11), M + 10, M + 51, { size: 11, color: C.text2 });
        // the legend, only for the kinds that occur
        const items = (b.onboard || []).map(t => ({ t, k: kindOf(t) }));
        const used = KIND.filter(k => items.some(i => i.k[0] === k[0]));
        let lx = M, ly = M + mh + 14;
        used.forEach(k => {
          const lab = k[1], w = 20 + lab.length * 5.6;
          if (lx + w > W - M) { lx = M; ly += 15; }
          c.fillStyle = kit.hue(k[2]); c.fillRect(lx, ly - 4, 8, 8);
          kit.label(c, lab, lx + 12, ly, { size: 10.5, color: C.text2 }); lx += w + 8;
        });
        // the cards
        const cols = W < 520 ? 1 : 2, gap = 8, cwid = (W - 2 * M - (cols - 1) * gap) / cols, chh = 46, y0 = ly + 14;
        const cap = Math.max(1, Math.floor((st.H - y0 - 6) / (chh + 6))) * cols;
        items.slice(0, cap).forEach((it, i) => {
          const x = M + (i % cols) * (cwid + gap), y = y0 + Math.floor(i / cols) * (chh + 6), on = sel === i;
          c.fillStyle = on ? (C.dark ? 'rgba(123,140,255,.22)' : 'rgba(60,90,220,.13)') : C.surface; c.fillRect(x, y, cwid, chh);
          c.fillStyle = it.k[2] ? kit.hue(it.k[2]) : C.faint; c.fillRect(x, y, 5, chh);
          para(kit, c, it.t, x + 12, y + 12, cwid - 18, 11, C.text, 14, 3);
          hits.push({ i, x, y, w: cwid, h: chh });
        });
        if (items.length > cap) kit.label(c, '+' + (items.length - cap) + ' more parts: widen the page', M, st.H - 7, { size: 10, color: C.faint });
        ro.set('chip', chipName(E, b.chip));
        ro.set('mem', [b.flash ? b.flash + ' flash' : 'flash not listed', b.psram ? b.psram + ' PSRAM' : 'no PSRAM'].join(' · '));
        ro.set('usb', b.usb && b.usb.conn ? b.usb.conn + (b.usb.bridge ? ' · ' + b.usb.bridge : '') : 'not listed');
        ro.set('status', b.status || 'not listed');
        ro.set('sel', sel != null && items[sel] ? items[sel].t : 'click a card');
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); sel = h ? (sel === h.i ? null : h.i) : null; loop.once(); },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ dk-memory-budget */
  const MEM_BOARDS = {
    camera: ['esp32-s3-eye', 'esp-eye', 'esp32-s3-korvo-2', 'esp32-p4-eye', 'esp32-p4-function-ev-board'],
    audio: ['esp32-s3-box-3', 'esp32-s3-korvo-2', 'esp32-lyrat', 'esp32-lyrat-mini', 'esp32-s3-lcd-ev-board'],
    lcd: ['esp32-c3-lcdkit', 'esp32-s3-lcd-ev-board', 'esp-wrover-kit', 'esp32-p4-function-ev-board', 'esp32-s3-box-3']
  };
  const CAM_RES = [[160, 120, 'QQVGA'], [320, 240, 'QVGA'], [640, 480, 'VGA'], [800, 600, 'SVGA'], [1024, 768, 'XGA'], [1280, 720, 'HD 720p'], [1280, 1024, 'SXGA'], [1600, 1200, 'UXGA'], [1920, 1080, 'Full HD'], [2592, 1944, '5 megapixel']];
  const LCD_RES = [[128, 64, 'OLED 128 × 64'], [240, 240, 'round or square 240 × 240'], [320, 240, 'QVGA 320 × 240'], [480, 320, 'HVGA 480 × 320'], [800, 480, 'WVGA 800 × 480'], [1024, 600, '7-inch 1024 × 600'], [1280, 800, 'WXGA 1280 × 800']];
  const LCD_IF = [['SPI, one data line', 1, 0.05], ['SPI, four data lines (quad)', 4, 0.05], ['Parallel 8-bit (I80)', 8, 0.05], ['Parallel 16-bit (I80)', 16, 0.05], ['RGB, 16-bit with sync', 16, 0.25]];
  function memOf(E, b) {
    const ch = E.chip(b.chip) || {};
    const sram = (ch.sram || 0) * 1024, ps = mb(b.psram) * 1048576, mapped = /(\d+)\s*MB\s*mapped/i.exec(String(ch.psramMax || ''));
    return { sram, ps, usable: mapped ? Math.min(ps, +mapped[1] * 1048576) : ps, mapped: !!mapped && ps > +mapped[1] * 1048576 };
  }
  function memVerdict(need, m) {
    if (!(need > 0)) return ['ok', 'nothing to store'];
    if (need <= m.sram * 0.5) return ['ok', 'fits in internal RAM, with room left for the program'];
    if (need <= m.sram) return ['warn', 'would take almost all the internal RAM'];
    if (m.usable <= 0) return ['bad', 'does not fit, and this board has no PSRAM'];
    if (need <= m.usable * 0.85) return ['ok', 'needs PSRAM: ' + Math.round(need / m.usable * 100) + ' % of it'];
    if (need <= m.usable) return ['warn', 'fits in PSRAM, but only just'];
    return ['bad', 'does not fit even in PSRAM'];
  }
  Hyper.sim('dk-memory-budget', {
    title: 'Buffers against memory',
    blurb: `A camera frame, a second of audio or a screen buffer is **width × height × bytes** (or **rate × bytes × channels × seconds**). The bars show what share of the board's internal RAM and of its usable PSRAM the buffers take; the numbers come from the catalogue (the chip's RAM, the board's PSRAM). JPEG sizes use a rough 0.1 byte per pixel: they vary a lot with the picture. On the original ESP32 only 4 MB of PSRAM can be mapped at a time.

**Try this**
- *Camera:* choose **UXGA, RGB565** and one frame, then add frames until the PSRAM is full; then switch to **JPEG**.
- *Audio:* raise the rate and channels, then stretch the seconds: see when the recording leaves the internal RAM, and how long the PSRAM lasts.
- *Display:* switch the **interface** from SPI to RGB and watch the frame rate; then choose **1/10 of a frame** buffers to see why GUIs draw in strips.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const mode = MEM_BOARDS[params.mode] ? params.mode : 'camera';
      const boards = MEM_BOARDS[mode].map(id => E.board(id)).filter(Boolean);
      const bopts = boards.map(b => [b.name, b.id]);
      const bstart = boards.some(b => b.id === params.board) ? params.board : boards[0].id;
      const defs = [{ id: 'board', type: 'select', label: 'Board', options: bopts, value: bstart }];
      if (mode === 'camera') defs.push(
        { id: 'res', type: 'select', label: 'Frame size', options: CAM_RES.map((r, i) => [r[2] + ' ' + r[0] + ' × ' + r[1], i]), value: 7 },
        { id: 'fmt', type: 'select', label: 'Format', options: [['JPEG (about 0.1 byte per pixel)', 0.1], ['Grayscale (1 byte)', 1], ['RGB565 (2 bytes)', 2], ['RGB888 (3 bytes)', 3]], value: 2 },
        { id: 'frames', label: 'Frames kept', min: 1, max: 4, step: 1, value: 2 });
      if (mode === 'audio') defs.push(
        { id: 'rate', type: 'select', label: 'Sample rate', options: [['8 kHz', 8000], ['16 kHz (speech)', 16000], ['22.05 kHz', 22050], ['44.1 kHz (CD)', 44100], ['48 kHz', 48000]], value: 16000 },
        { id: 'bytes', type: 'select', label: 'Sample size', options: [['16 bit (2 bytes)', 2], ['24 bit in a 32-bit slot (4 bytes)', 4]], value: 2 },
        { id: 'ch', type: 'select', label: 'Channels', options: [['1 (mono)', 1], ['2 (stereo or two microphones)', 2], ['4 (microphone array)', 4]], value: 2 },
        { id: 'sec', label: 'Seconds kept', min: 0.1, max: 600, value: 10, unit: 's', log: true, sig: 3 });
      if (mode === 'lcd') defs.push(
        { id: 'res', type: 'select', label: 'Panel', options: LCD_RES.map((r, i) => [r[2], i]), value: 2 },
        { id: 'depth', type: 'select', label: 'Colour depth', options: [['16 bit (RGB565)', 2], ['24 bit (RGB888)', 3], ['1 bit (monochrome)', 0.125]], value: 2 },
        { id: 'bus', type: 'select', label: 'Interface', options: LCD_IF.map((r, i) => [r[0], i]), value: 0 },
        { id: 'mhz', label: 'Bus clock', min: 5, max: 80, step: 1, value: 40, unit: 'MHz' },
        { id: 'buf', type: 'select', label: 'Buffer', options: [['one full frame', 1], ['two full frames', 2], ['1/10 of a frame (strips)', 0.1]], value: 1 });
      const ctl = kit.controls(box.side, defs, () => loop.once());
      const rows = mode === 'camera' ? [['need', 'Needed'], ['one', 'One frame'], ['ram', 'Internal RAM'], ['psram', 'PSRAM (usable)'], ['v', 'Verdict']]
        : mode === 'audio' ? [['need', 'Needed'], ['one', 'Data rate'], ['long', 'Longest in PSRAM'], ['ram', 'Internal RAM'], ['psram', 'PSRAM (usable)'], ['v', 'Verdict']]
          : [['need', 'Needed'], ['one', 'One frame'], ['fps', 'Frame rate at best'], ['ram', 'Internal RAM'], ['psram', 'PSRAM (usable)'], ['v', 'Verdict']];
      const ro = kit.readout(box.side, rows);
      const st = kit.stage(box.stage, { aspect: 0.82, minH: 380, maxH: 520 });
      const bar = (c, C, x, y, w, label, cap, need) => {
        kit.label(c, label + (cap > 0 ? ' · ' + fmtBytes(cap) : ' · none'), x, y, { size: 11.5, color: C.text2, weight: 600 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.09)' : 'rgba(0,0,0,.07)'; c.fillRect(x, y + 9, w, 18);
        if (cap > 0) {
          const f = need / cap;
          c.fillStyle = f > 1 ? C.bad : f > 0.85 ? C.warn : C.ok; c.fillRect(x, y + 9, Math.max(2, Math.min(1, f) * w), 18);
          kit.label(c, f > 1 ? 'too big by ×' + (f >= 10 ? Math.round(f) : f.toFixed(1)) : (f < 0.01 ? '< 1 %' : Math.round(f * 100) + ' %'), x + w - 6, y + 18, { size: 11, weight: 650, align: 'right', color: f > 0.5 || f > 1 ? '#fff' : C.text });
        } else kit.label(c, 'no memory of this kind', x + 6, y + 18, { size: 11, color: C.faint });
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 12, v = ctl.values;
        const b = E.board(v.board) || boards[0], m = memOf(E, b), pw = W - 2 * M;
        let need = 0, pic = null, note = '';
        if (mode === 'camera') {
          const r = CAM_RES[clamp(Math.round(v.res), 0, CAM_RES.length - 1)], one = Math.ceil(r[0] * r[1] * v.fmt), n = Math.round(v.frames);
          need = one * n; pic = { kind: 'cam', r, n, jpeg: v.fmt < 1 };
          if ((b.id === 'esp32-s3-eye' || b.id === 'esp-eye') && r[0] * r[1] > 1920000) note = 'this board\'s camera tops out at 1600 × 1200';
          ro.set('one', fmtBytes(one) + ' (' + r[0] + ' × ' + r[1] + ')');
        } else if (mode === 'audio') {
          const rate = v.rate * v.bytes * v.ch;
          need = rate * v.sec; pic = { kind: 'aud', rate: v.rate, ch: v.ch };
          ro.set('one', fmtBytes(rate) + ' a second');
          const lg = m.usable > 0 ? m.usable / rate : 0;
          ro.set('long', m.usable > 0 ? (lg >= 120 ? kit.fmt(lg / 60, 3) + ' min' : kit.fmt(lg, 3) + ' s') : 'no PSRAM');
        } else {
          const r = LCD_RES[clamp(Math.round(v.res), 0, LCD_RES.length - 1)], bus = LCD_IF[clamp(Math.round(v.bus), 0, LCD_IF.length - 1)];
          const frame = Math.ceil(r[0] * r[1] * v.depth), full = bus[0].indexOf('RGB') === 0, bufs = full ? Math.max(1, v.buf) : v.buf;
          need = Math.ceil(frame * bufs); pic = { kind: 'lcd', r };
          const fps = (v.mhz * 1e6 * bus[1]) / (r[0] * r[1] * v.depth * 8 * (1 + bus[2]));
          ro.set('one', fmtBytes(frame) + ' (' + r[0] + ' × ' + r[1] + ')');
          ro.set('fps', Number.isFinite(fps) ? kit.fmt(fps, 3) + ' a second' : '—');
          if (full && v.buf < 1) note = 'an RGB panel has no memory: it needs the full frame';
        }
        // the picture
        const ph = Math.round(st.H * 0.3);
        if (pic.kind === 'cam') {
          const s = clamp(Math.sqrt(pic.r[0] * pic.r[1] / (2592 * 1944)), 0.12, 1), fw = Math.min(pw * 0.55, ph * 1.3) * s, fh = fw * pic.r[1] / pic.r[0];
          for (let i = pic.n - 1; i >= 0; i--) {
            const x = M + 4 + i * 9, y = M + 4 + (ph - 14 - fh) / 2 + (pic.n - 1 - i) * 0;
            c.fillStyle = C.surface; c.fillRect(x, y, fw, fh); c.strokeStyle = pic.jpeg ? C.ok : C.accent; c.lineWidth = 1.6; c.strokeRect(x, y, fw, fh);
          }
          kit.label(c, pic.r[0] + ' × ' + pic.r[1] + (pic.jpeg ? ' · JPEG' : ' · raw') + ' · ' + pic.n + (pic.n === 1 ? ' frame' : ' frames'), M + 4 + pic.n * 9 + fw + 6, M + ph / 2, { size: 11.5, color: C.text2 });
        } else if (pic.kind === 'aud') {
          const cyc = clamp(pic.rate / 3000, 2, 16), n = Math.min(4, pic.ch), lane = (ph - 8) / n;
          for (let k = 0; k < n; k++) {
            c.beginPath(); c.strokeStyle = kit.hue(200 + k * 40); c.lineWidth = 1.6;
            for (let x = 0; x <= pw; x += 2) { const yy = M + 4 + lane * (k + 0.5) + Math.sin(x / pw * cyc * 6.2832 + k) * lane * 0.38; if (x === 0) c.moveTo(M + x, yy); else c.lineTo(M + x, yy); }
            c.stroke();
          }
        } else {
          const r = pic.r, s = Math.min((pw * 0.5) / r[0], (ph - 12) / r[1]), pwid = r[0] * s, phgt = r[1] * s;
          c.fillStyle = C.surface; c.fillRect(M + 4, M + 4 + (ph - 12 - phgt) / 2, pwid, phgt); c.strokeStyle = C.accent; c.lineWidth = 1.6; c.strokeRect(M + 4, M + 4 + (ph - 12 - phgt) / 2, pwid, phgt);
          kit.label(c, r[0] + ' × ' + r[1], M + 4 + pwid + 8, M + ph / 2, { size: 11.5, color: C.text2 });
        }
        // the numbers and the bars
        let y = M + ph + 8;
        kit.label(c, 'Needed: ' + fmtBytes(need), M, y, { size: 14, weight: 650 }); y += 20;
        const vd = memVerdict(need, m), col = vd[0] === 'ok' ? C.ok : vd[0] === 'warn' ? C.warn : C.bad;
        kit.label(c, fit(c, vd[1].charAt(0).toUpperCase() + vd[1].slice(1), pw, 12), M, y, { size: 12, color: col, weight: 600 }); y += 18;
        if (note) { kit.label(c, fit(c, note, pw, 11), M, y, { size: 11, color: C.warn }); y += 16; }
        y += 6;
        bar(c, C, M, y, pw, chipName(E, b.chip) + ' internal RAM (all of it)', m.sram, need); y += 44;
        bar(c, C, M, y, pw, b.name + ' PSRAM' + (m.mapped ? ' (4 MB mapped)' : ''), m.usable, need);
        ro.set('need', fmtBytes(need)); ro.set('ram', m.sram ? fmtBytes(m.sram) + ' · ' + Math.round(need / m.sram * 100) + ' %' : 'not listed');
        ro.set('psram', m.usable ? fmtBytes(m.usable) + ' · ' + Math.round(need / m.usable * 100) + ' %' : 'none'); ro.set('v', vd[1]);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ dk-lcdkit-pins */
  const LCDKIT_KINDS = { lcd: ['LCD', 215], audio: ['Speaker amplifier', 280], ir: ['Infrared', 30], led: ['RGB LED', 140], usb: ['USB', 250], flash: ['Flash (do not use)', 356], uart: ['UART0 console', 190], boot: ['BOOT button (usual)', 52], free: ['Not assigned in the record', 0] };
  Hyper.sim('dk-lcdkit-pins', {
    title: 'The C3-LCDkit pin budget',
    blurb: `All 22 GPIOs of the ESP32-C3, coloured by who uses them on the **ESP32-C3-LCDkit**: the roles are read from the board's catalogue record (LCD, speaker amplifier, infrared, RGB LED) and the rest from the chip's pin table. A thick outline marks a **strapping pin**. Switch the view to see what the datasheet says about each pin; click a pin for its note.

**Try this**
- Find the strapping pins (GPIO2, GPIO8, GPIO9) and see what the kit puts on them: an LCD input and an LED input, which do not pull the pin.
- Count the pins that are left: the encoder's two pins and its switch are not given in the record.
- Switch to *what the datasheet says* and find the six pins that are flash: no kit can use them.
- Note GPIO0 and GPIO1: the LCD uses them, which costs a 32 kHz crystal.`,
    mount(box, kit) {
      const E = kit.esp;
      const b = E.board('esp32-c3-lcdkit') || { display: '', onboard: [] }, ch = E.chip('esp32-c3') || { gpio: 22 }, n = ch.gpio || 22;
      const txt = [b.display || ''].concat(b.onboard || []).join(' | ');
      const num = (re, d) => { const m = re.exec(txt); return m ? +m[1] : d; };
      const role = {};
      const put = (g, k, label) => { if (g != null && !role[g]) role[g] = { k, label }; };
      put(num(/LCD_SDA IO(\d+)/, 0), 'lcd', 'LCD data'); put(num(/LCD_SCL IO(\d+)/, 1), 'lcd', 'LCD clock'); put(num(/LCD_D\/C IO(\d+)/, 2), 'lcd', 'LCD data/command');
      put(num(/LCD_CS IO(\d+)/, 7), 'lcd', 'LCD chip select'); put(num(/LCD_BL_CTRL IO(\d+)/, 5), 'lcd', 'LCD backlight');
      put(num(/AUDIO_PA IO(\d+)/, 3), 'audio', 'amplifier'); put(num(/IR_RX\/IR_TX IO(\d+)/, 4), 'ir', 'IR in/out'); put(num(/IO(\d+) = RGB_LED/, 8), 'led', 'RGB LED');
      const info = g => E.pin('esp32-c3', g) || {};
      for (let g = 0; g < n; g++) {
        const p = info(g);
        if (p.usb) put(g, 'usb', 'USB ' + p.usb); else if (p.flash) put(g, 'flash', 'flash'); else if (p.uart0) put(g, 'uart', 'UART0 ' + p.uart0); else if (g === 9) put(g, 'boot', 'BOOT button'); else put(g, 'free', 'unassigned');
      }
      let sel = null, hits = [];
      const ctl = kit.controls(box.side, [{ id: 'view', type: 'select', label: 'Colour by', options: [['Who uses the pin', 'role'], ['What the datasheet says', 'safe']], value: 'role' }], () => loop.once());
      const ro = kit.readout(box.side, [['sel', 'Pin'], ['role', 'Role in the kit'], ['ds', 'Datasheet'], ['strap', 'Strapping pins in use'], ['free', 'Unassigned and safe']]);
      const st = kit.stage(box.stage, { aspect: 1.05, minH: 440, maxH: 600 });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 8, view = ctl.values.view;
        const cols = W < 520 ? 4 : 6, rows = Math.ceil(n / cols), g = 6, cw = (W - 2 * M - (cols - 1) * g) / cols, chh = clamp((st.H * 0.52) / rows - g, 36, 60);
        hits = [];
        for (let i = 0; i < n; i++) {
          const x = M + (i % cols) * (cw + g), y = M + Math.floor(i / cols) * (chh + g), r = role[i] || { k: 'free', label: '' }, p = info(i), K = LCDKIT_KINDS[r.k] || LCDKIT_KINDS.free;
          const base = view === 'role' ? (K[1] || K[1] === 0 && r.k !== 'free' ? kit.hue(K[1], 0.9) : C.faint) : (p.safe === 'yes' ? C.ok : p.safe === 'avoid' ? C.bad : C.warn);
          c.save(); c.globalAlpha = (view === 'role' && r.k === 'free') ? 0.55 : 1;
          c.fillStyle = base; c.fillRect(x, y, cw, chh); c.restore();
          c.fillStyle = 'rgba(0,0,0,.34)'; c.fillRect(x, y, cw, chh);
          c.strokeStyle = p.strap ? C.text : 'transparent'; c.lineWidth = p.strap ? 3 : 0; if (p.strap) c.strokeRect(x + 1.5, y + 1.5, cw - 3, chh - 3);
          if (sel === i) { c.strokeStyle = C.accent; c.lineWidth = 2; c.strokeRect(x - 1, y - 1, cw + 2, chh + 2); }
          kit.label(c, 'GPIO' + i, x + 6, y + 13, { size: 12, weight: 650, color: '#fff' });
          kit.label(c, fit(c, view === 'role' ? (r.label || '') : (p.safe || ''), cw - 8, 10.5), x + 6, y + chh - 12, { size: 10.5, color: 'rgba(255,255,255,.92)' });
          if (p.strap) kit.label(c, 'strap', x + cw - 5, y + 13, { size: 9.5, align: 'right', color: '#fff', weight: 600 });
          hits.push({ i, x, y, w: cw, h: chh });
        }
        let y = M + rows * (chh + g) + 6;
        // the legend
        let lx = M;
        const used = Object.keys(LCDKIT_KINDS).filter(k => Object.keys(role).some(g2 => role[g2].k === k));
        if (view === 'role') used.forEach(k => {
          const lab = LCDKIT_KINDS[k][0], w = 18 + lab.length * 5.6;
          if (lx + w > W - M) { lx = M; y += 15; }
          c.fillStyle = k === 'free' ? C.faint : kit.hue(LCDKIT_KINDS[k][1]); c.fillRect(lx, y - 4, 8, 8);
          kit.label(c, lab, lx + 12, y, { size: 10.5, color: C.text2 }); lx += w + 8;
        });
        else [['safe', C.ok], ['caution', C.warn], ['avoid', C.bad]].forEach(([lab, col]) => { c.fillStyle = col; c.fillRect(lx, y - 4, 8, 8); kit.label(c, lab, lx + 12, y, { size: 10.5, color: C.text2 }); lx += 70; });
        y += 18;
        const s = sel != null ? sel : null, sp = s != null ? info(s) : null, sr = s != null ? role[s] : null;
        const detail = s != null ? 'GPIO' + s + ': ' + (sr ? sr.label : '') + '. ' + (sp.note || '') : 'Click a pin. A thick outline marks a strapping pin: its level is read once at reset.';
        para(kit, c, detail, M, y, W - 2 * M, 11, C.text2, 14, Math.max(2, Math.floor((st.H - y - 6) / 14)));
        const strapUse = Object.keys(role).map(Number).filter(g2 => info(g2).strap && role[g2].k !== 'free' && role[g2].k !== 'flash').sort((a, b2) => a - b2).map(g2 => 'GPIO' + g2 + ' (' + role[g2].label + ')');
        const freeSafe = Object.keys(role).map(Number).filter(g2 => role[g2].k === 'free' && info(g2).safe === 'yes').sort((a, b2) => a - b2);
        ro.set('sel', s != null ? 'GPIO' + s : '—'); ro.set('role', sr ? sr.label : '—'); ro.set('ds', sp ? (sp.safe || '—') + (sp.strap ? ' · strapping' : '') : '—');
        ro.set('strap', strapUse.length ? strapUse.join(', ') : 'none'); ro.set('free', freeSafe.length ? freeSafe.map(g2 => 'GPIO' + g2).join(', ') : 'none');
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); sel = h ? h.i : null; loop.once(); },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ dk-jtag-pins */
  const JTAG_CHIPS = ['esp32', 'esp32-s2', 'esp32-s3', 'esp32-c3', 'esp32-c6', 'esp32-c5', 'esp32-c61', 'esp32-h2', 'esp32-p4'];
  const JTAG_SIGS = [['TCK', 'MTCK'], ['TMS', 'MTMS'], ['TDI', 'MTDI'], ['TDO', 'MTDO']];
  Hyper.sim('dk-jtag-pins', {
    title: 'JTAG pins and debug adapters',
    blurb: `A debug adapter has four JTAG wires. On a chip with **pad JTAG** they go to four ordinary GPIOs; the picture shows which, read from the pin table in the board catalogue. Chips with the **built-in USB Serial/JTAG** need no adapter at all. Tick *the adapter holds TDI high* to see what that does to the chip's strapping pins.

**Try this**
- Choose the **ESP32**: its four JTAG pins are GPIO12 to GPIO15, and GPIO12 and GPIO15 are strapping pins. Tick *TDI held high* and read the verdict.
- Choose the **ESP32-S2**: no USB JTAG, so an adapter is the only way to debug it.
- Choose the **ESP32-S3** or **C3**: USB Serial/JTAG is the default, the pad pins stay free GPIOs.
- Choose the **C6** and tick the box: its TDI pin is a strapping pin too, with a different job.`,
    mount(box, kit, params) {
      const E = kit.esp;
      const start = JTAG_CHIPS.indexOf(params.chip) >= 0 ? params.chip : 'esp32';
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: JTAG_CHIPS.map(id => [chipName(E, id), id]), value: start },
        { id: 'tdi', type: 'check', label: 'The adapter holds TDI high during reset', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['usb', 'Built-in USB JTAG'], ['pads', 'Pad JTAG pins'], ['tdi', 'TDI high at reset']]);
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 420, maxH: 580 });
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, M = 8, v = ctl.values;
        const ch = E.chip(v.chip) || {}, gp = (E.PINS[v.chip] && E.PINS[v.chip].gpios) || [];
        const pads = {};
        gp.forEach(g => { if (g.jtag) pads[g.jtag] = g; });
        const builtin = (ch.usb || []).some(u => /serial\/jtag/i.test(u));
        // the two boxes and four wires
        const aw = Math.min(110, W * 0.26), cw = Math.min(190, W * 0.42), ax = M, cx = W - M - cw, top = 14, rowH = clamp(st.H * 0.09, 34, 46), bh = 40 + rowH * 4;
        S_box(c, kit, ax, top, aw, bh, 'Debug adapter', C.accent, C);
        S_box(c, kit, cx, top, cw, bh, chipName(E, v.chip), kit.hue(150), C);
        JTAG_SIGS.forEach(([sig, mt], i) => {
          const y = top + 40 + i * rowH + rowH / 2, g = pads[mt];
          const strap = g && g.strap, bad = strap && v.tdi && mt === 'MTDI';
          kit.label(c, sig, ax + aw - 8, y, { size: 12, weight: 650, align: 'right' });
          const col = bad ? C.bad : strap ? C.warn : C.accent;
          c.strokeStyle = col; c.lineWidth = 2; c.beginPath(); c.moveTo(ax + aw, y); c.lineTo(cx, y); c.stroke();
          kit.label(c, g ? 'GPIO' + g.n : 'not listed', cx + 10, y - 6, { size: 12.5, weight: 650, color: col });
          kit.label(c, fit(c, mt + (strap ? ' · strapping pin' : ''), cw - 14, 10.5), cx + 10, y + 9, { size: 10.5, color: strap ? C.warn : C.muted });
        });
        kit.label(c, 'and ground', ax + 8, top + bh - 14, { size: 10.5, color: C.muted });
        let y = top + bh + 18;
        const msg = builtin ? 'This chip has USB Serial/JTAG: one USB cable programs and debugs it. The pad pins above stay free GPIOs unless an eFuse moves JTAG to them.' : 'No JTAG over USB on this chip: the four pad pins are the only way in, so a debug adapter (an FT2232 board, an ESP-Prog) is needed.';
        S_box(c, kit, M, y, W - 2 * M, 14 + 15 * 3, null, builtin ? C.ok : C.warn, C);
        para(kit, c, msg, M + 10, y + 14, W - 2 * M - 20, 11.5, builtin ? C.ok : C.warn, 15, 3, 600);
        y += 14 + 15 * 3 + 12;
        // what a high TDI does
        const tp = pads.MTDI, stext = tp && tp.strap ? tp.strap : '';
        let tv;
        if (!v.tdi) tv = ['ok', 'TDI floats or idles low: no effect on the boot.'];
        else if (!tp) tv = ['warn', 'The catalogue does not list a TDI pad for this chip.'];
        else if (/flash|VDD_SDIO|VDD_SPI|1\.8/i.test(stext)) tv = ['bad', 'GPIO' + tp.n + ' high at reset: ' + stext.replace(/^MTDI:\s*/i, '')];
        else if (stext) tv = ['warn', 'GPIO' + tp.n + ' is a strapping pin, but its job does not matter for a normal boot: ' + stext.replace(/^MTDI:\s*/i, '')];
        else tv = ['ok', 'GPIO' + tp.n + ' is not a strapping pin: no effect on the boot.'];
        const tcol = tv[0] === 'ok' ? C.ok : tv[0] === 'warn' ? C.warn : C.bad;
        para(kit, c, tv[1], M, y, W - 2 * M, 11.5, tcol, 15, Math.max(2, Math.floor((st.H - y - 6) / 15)), 600);
        ro.set('usb', builtin ? 'yes: no adapter needed' : 'no: adapter needed');
        ro.set('pads', JTAG_SIGS.map(([sig, mt]) => sig + ' ' + (pads[mt] ? 'GPIO' + pads[mt].n : '?')).join(' · '));
        ro.set('tdi', v.tdi ? tv[1] : 'not held');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  // a labelled rounded box for the JTAG picture
  function S_box(c, kit, x, y, w, h, label, color, C) {
    c.save(); c.beginPath(); c.roundRect ? c.roundRect(x, y, w, h, 8) : c.rect(x, y, w, h); c.fillStyle = C.surface; c.fill(); c.lineWidth = 1.8; c.strokeStyle = color; c.stroke(); c.restore();
    if (label) kit.label(c, label, x + w / 2, y + 18, { size: 12.5, weight: 650, align: 'center' });
  }
})();
