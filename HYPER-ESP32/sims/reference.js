/* HYPER-ESP32 · sims/reference.js
 *
 * The three reference simulations. Writers: read them before writing your own.
 *
 *   ref-blink       a pin against time: the two ways to blink, and what "other work" does to each
 *   ref-strapping   a board with its strapping pins, switches to set them, and how the chip then boots
 *   ref-chip        a chip as a block diagram drawn from the catalogue; params: { chip: 'esp32-c3' }
 *
 * They show the pattern: numbers from kit.esp, drawing with kit.esym, theme colours only, a static picture redrawn
 * with loop.once() after every change, and a running loop only where something moves by itself.
 */
(function () {
  'use strict';

  /* ================================================================ ref-blink */
  Hyper.sim('ref-blink', {
    title: 'Two ways to blink',
    blurb: `The trace is the LED pin over the last four seconds; the strip under it shows when the loop is **stuck waiting** (dark) and when it is **free to do other things** (light).

**Try this**
- Leave the method on *delay* and add **other work**: the blink slows down, because the work is added to every pass.
- Switch to *watch the clock*: the rhythm snaps back to exactly twice the interval, whatever the work.
- Now make the other work longer than the interval: even the clock method cannot blink faster than the loop goes round.
- Read **slowest reaction**: how long a button press could go unnoticed.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.56 });
      const ctl = kit.controls(box.side, [
        { id: 'method', type: 'select', label: 'Method', options: [['delay()', 'delay'], ['watch the clock', 'clock']], value: 'delay' },
        { id: 'I', label: 'Interval', min: 100, max: 1000, step: 50, value: 500, unit: 'ms' },
        { id: 'W', label: 'Other work in the loop', min: 0, max: 600, step: 10, value: 0, unit: 'ms' }
      ], () => {});
      const ro = kit.readout(box.side, [['period', 'One full blink'], ['passes', 'Loop passes'], ['react', 'Slowest reaction']]);
      const SPAN = 4;
      // when the pin toggles: -> [[t, level], …] and the busy intervals of the loop, for the window [t0, t1] (seconds)
      function trace(t0, t1) {
        const I = ctl.values.I / 1000, W = ctl.values.W / 1000, edges = [], busy = [];
        if (ctl.values.method === 'delay') {
          const P = 2 * I + W;
          for (let k = Math.floor(t0 / P) - 1; k * P < t1; k++) {
            const a = k * P;
            edges.push([a, 1], [a + I, 0]);
            busy.push([a, a + 2 * I, 'wait']);
            if (W > 0) busy.push([a + 2 * I, a + P, 'work']);
          }
        } else {
          const pass = Math.max(W, 0.0002);
          let level = 0;
          // the pin flips at the end of the first pass that finds the deadline reached
          for (let k = Math.floor(t0 / I) - 2; k * I < t1 + I; k++) {
            if (k < 0) continue;
            const due = k * I, at = W > 0 ? Math.ceil(due / pass - 1e-9) * pass : due;
            level = k % 2 === 0 ? 1 : 0;
            if (!edges.length || at > edges[edges.length - 1][0] + 1e-9) edges.push([at, level]); else edges[edges.length - 1][1] = level;
          }
          if (W > 0) for (let a = Math.floor(t0 / pass) * pass; a < t1; a += pass) busy.push([a, a + pass, 'work']);
        }
        return { edges, busy };
      }
      const loop = kit.loop((dt, t) => {
        const c = st.begin(), C = kit.colors();
        const I = ctl.values.I, W = ctl.values.W, delay = ctl.values.method === 'delay';
        const t1 = t, t0 = t - SPAN, tr = trace(t0, t1);
        const on = E.proto.levelAt(tr.edges.filter(e => e[0] <= t1), t1) === 1;
        // the scene: a pin, a resistor, an LED
        const y0 = st.H * 0.2, x0 = Math.max(70, st.W * 0.14);
        S.box(c, x0 - 56, y0 - 24, 112, 48, { label: 'ESP32', sub: 'GPIO2', color: kit.hue(8) });
        S.wire(c, [[x0 + 56, y0], [x0 + 110, y0]], { color: on ? C.accent : C.muted });
        kit.schem.resistor(c, x0 + 110, y0, x0 + 190, y0, { label: '220 Ω' });
        S.wire(c, [[x0 + 190, y0], [x0 + 236, y0]], { color: on ? C.accent : C.muted });
        S.led(c, x0 + 252, y0, { color: 4, on, r: 12 });
        S.wire(c, [[x0 + 266, y0], [x0 + 306, y0], [x0 + 306, y0 + 22]]);
        kit.schem.ground(c, x0 + 306, y0 + 22);
        kit.label(c, on ? 'HIGH · 3.3 V' : 'LOW · 0 V', x0 + 83, y0 - 14, { size: 11.5, color: on ? C.accent : C.muted, align: 'center' });
        // the trace of the pin, and what the loop is doing
        const px = 64, pw = st.W - px - 20, py = st.H * 0.46, ph = st.H * 0.2;
        S.wave(c, px, py, pw, ph, tr.edges, { t0, t1, label: 'GPIO2', fill: true });
        const by = py + ph + 22, bh = 16, X = tt => px + Math.max(0, Math.min(1, (tt - t0) / SPAN)) * pw;
        c.fillStyle = C.dark ? 'rgba(255,255,255,.10)' : 'rgba(0,0,0,.07)'; c.fillRect(px, by, pw, bh);
        for (const [a, b, kind] of tr.busy) {
          if (b < t0 || a > t1) continue;
          c.fillStyle = kind === 'wait' ? (C.dark ? 'rgba(229,72,77,.75)' : 'rgba(200,40,50,.7)') : kit.hue(40, 0.8);
          c.fillRect(X(a), by, Math.max(0.5, X(b) - X(a)), bh);
        }
        kit.label(c, 'the loop', px - 6, by + bh / 2, { size: 11, color: C.text2, align: 'right' });
        kit.label(c, delay ? 'red: stuck in delay()' + (W ? ' · amber: other work' : '') : (W ? 'amber: other work · the loop is never stuck' : 'the loop is free all the time'), px, by + bh + 14, { size: 11, color: C.muted });
        kit.label(c, '4 s ago', px, py + ph + 10, { size: 10, color: C.faint });
        kit.label(c, 'now', px + pw, py + ph + 10, { size: 10, color: C.faint, align: 'right' });
        // the numbers
        const period = delay ? 2 * I + W : Math.max(2 * I, 2 * Math.max(W, 0));
        const passes = delay ? 1000 / (2 * I + W) : (W > 0 ? 1000 / W : null);
        ro.set('period', kit.fmt(period, 4) + ' ms' + (period > 2 * I + 0.5 ? '  (wanted ' + 2 * I + ')' : ''));
        ro.set('passes', passes == null ? 'many thousands a second' : kit.fmt(passes, 3) + ' a second');
        ro.set('react', delay ? kit.fmt(2 * I + W, 4) + ' ms' : (W > 0 ? kit.fmt(W, 3) + ' ms' : 'under 1 ms'));
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ ref-strapping */
  // how each chip reads its strapping pins. rest: the level its own pull resistor gives (null: floating). From the datasheets.
  const STRAP = {
    'esp32': { name: 'ESP32', board: 'esp32-devkitc-v4', pins: [[0, 'boot pin', 1], [2, 'download gate', 0], [12, 'flash voltage', 0], [15, 'boot messages', 1]],
      boot(v) {
        if (v[12] === 1) return ['bad', 'Does not start', 'GPIO12 high chose 1.8 V for the flash supply. The module\'s 3.3 V flash cannot be read, so the chip resets again and again.'];
        if (v[0] === 1) return ['ok', 'Runs the program', v[15] === 0 ? 'Normal start from flash — silently: GPIO15 low switched the boot messages off.' : 'Normal start from flash, with the boot messages on the serial port.'];
        if (v[2] === 0) return ['warn', 'Download mode', 'GPIO0 low (and GPIO2 low): the boot ROM waits for a program over the serial port. This is what the BOOT button does.'];
        return ['bad', 'Stuck', 'GPIO0 low asks for download mode, but GPIO2 is high, which the ROM does not accept. Nothing runs.'];
      } },
    'esp32-s3': { name: 'ESP32-S3', board: 'esp32-s3-devkitc-1-v1.1', pins: [[0, 'boot pin', 1], [46, 'download gate', 0], [45, 'flash voltage', 0]],
      boot(v) {
        if (v[45] === 1) return ['bad', 'Does not start', 'GPIO45 high chose 1.8 V for the flash supply; with 3.3 V memory the chip cannot read its program.'];
        if (v[0] === 1) return ['ok', 'Runs the program', 'Normal start from flash.'];
        if (v[46] === 0) return ['warn', 'Download mode', 'GPIO0 low and GPIO46 low: the boot ROM waits for a program over USB or the serial port.'];
        return ['bad', 'Stuck', 'GPIO0 low with GPIO46 high is not a valid combination.'];
      } },
    'esp32-c3': { name: 'ESP32-C3', board: 'esp32-c3-devkitm-1', pins: [[9, 'boot pin', 1], [8, 'download gate', null], [2, 'must be high', null]],
      boot(v) {
        if (v[2] === 0) return ['bad', 'Does not start', 'GPIO2 must be high at reset for either kind of start.'];
        if (v[2] == null) return ['warn', 'Undefined', 'GPIO2 has no pull resistor inside the chip: left floating, the result is a matter of luck. Modules and boards add a pull-up.'];
        if (v[9] === 1) return ['ok', 'Runs the program', 'Normal start from flash.'];
        if (v[8] === 1) return ['warn', 'Download mode', 'GPIO9 low and GPIO8 high: the boot ROM waits for a program over USB or the serial port.'];
        if (v[8] == null) return ['warn', 'Undefined', 'GPIO9 low asks for download mode, which needs GPIO8 high — and GPIO8 is floating.'];
        return ['bad', 'Stuck', 'GPIO9 low with GPIO8 low is not a valid combination.'];
      } },
    'esp32-c6': { name: 'ESP32-C6', board: 'esp32-c6-devkitc-1', pins: [[9, 'boot pin', 1], [8, 'download gate', null], [15, 'JTAG source', null]],
      boot(v) {
        if (v[9] === 1) return ['ok', 'Runs the program', 'Normal start from flash.' + (v[15] === 0 ? ' GPIO15 low: JTAG moves from USB to the pins, if an eFuse allows it.' : '')];
        if (v[8] === 1) return ['warn', 'Download mode', 'GPIO9 low and GPIO8 high: the boot ROM waits for a program over USB or the serial port.'];
        if (v[8] == null) return ['warn', 'Undefined', 'GPIO9 low asks for download mode, which needs GPIO8 high — and GPIO8 is floating.'];
        return ['bad', 'Stuck', 'GPIO9 low with GPIO8 low is not a valid combination.'];
      } }
  };
  Hyper.sim('ref-strapping', {
    title: 'Strapping pins at reset',
    blurb: `Each switch is what the **outside circuit** does to a strapping pin at the moment of reset: pull it low, pull it high, or leave it alone — in which case the chip's own weak pull resistor decides, if it has one.

**Try this**
- On the ESP32, pull **GPIO12** high, as an SD card or a relay board would: the chip can no longer read its flash.
- Pull the **boot pin** low: download mode — the BOOT button, done by hand.
- Choose the **ESP32-C3** and leave GPIO2 alone: nothing inside the chip holds it, so a bare chip needs a resistor there.
- Press *Reset the chip* to watch the instant at which the pins are read.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, maxH: 600 });
      let chip = STRAP[params.chip] ? params.chip : 'esp32';
      let ext = {};                     // what the outside circuit does: 0, 1 or undefined (nothing)
      let anim = 2;                     // seconds since reset; 2 = settled
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: Object.keys(STRAP).map(k => [STRAP[k].name, k]), value: chip },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset the chip', primary: true }, { id: 'clear', label: 'Disconnect everything' }] }
      ], (id, v) => {
        if (id === 'chip') { chip = v; ext = {}; }
        if (id === 'clear') ext = {};
        anim = 0; loop.start();
      });
      const ro = kit.readout(box.side, [['res', 'The chip'], ['why', 'Because']]);
      let hits = [];
      const levels = () => { const R = STRAP[chip], v = {}; for (const [n, , rest] of R.pins) v[n] = ext[n] != null ? ext[n] : rest; return v; };
      const loop = kit.loop(dt => {
        if (anim < 2) anim = Math.min(2, anim + dt);
        const c = st.begin(), C = kit.colors(), R = STRAP[chip], v = levels();
        const sampled = anim >= 1, out = R.boot(v);
        // the board, with the strapping pins lit
        const hl = {};
        for (const [n] of R.pins) hl[n] = v[n] == null ? C.warn : v[n] ? kit.hue(140) : kit.hue(212);
        const bw = Math.min(st.W * 0.5, 330);
        const b = E.board(R.board);
        if (b) S.board(c, b, { x: 4, y: 4, w: bw, h: st.H - 8 }, { highlight: hl, dim: p => p.gpio == null || !R.pins.some(q => q[0] === p.gpio) });
        // the switches
        const x0 = bw + 18, w = st.W - x0 - 10;
        kit.label(c, 'At reset, the outside circuit…', x0, 16, { size: 12, color: C.text2, weight: 600 });
        hits = [];
        R.pins.forEach(([n, role, rest], i) => {
          const y = 40 + i * 52;
          kit.label(c, 'GPIO' + n, x0, y, { size: 13, weight: 650 });
          kit.label(c, role + ' · inside: ' + (rest == null ? 'no pull' : rest ? 'pull-up' : 'pull-down'), x0, y + 16, { size: 10.5, color: C.muted });
          const opts = [['pulls low', 0], ['leaves it', undefined], ['pulls high', 1]], bwid = Math.min(74, (w - 8) / 3);
          opts.forEach(([t, val], k) => {
            const bx = x0 + k * (bwid + 4), by = y + 26, on = ext[n] === val;
            S.box(c, bx, by, bwid, 18, { label: t, size: 10.5, r: 9, active: on, color: on ? C.accent : C.faint });
            hits.push({ x: bx, y: by, w: bwid, h: 18, n, val });
          });
        });
        // the instant of reset
        const ty = 40 + R.pins.length * 52 + 14, tw = w - 6;
        const en = [[-0.2, 0], [0.5, 1]];
        S.wave(c, x0 + 26, ty, tw - 26, 16, en, { t0: 0, t1: 2, label: 'EN', color: C.text2 });
        const sx = x0 + 26 + (tw - 26) * 0.5;
        c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(sx, ty - 6); c.lineTo(sx, ty + 24); c.stroke(); c.setLineDash([]);
        kit.label(c, 'pins read here', sx + 5, ty + 30, { size: 10, color: C.warn });
        if (anim < 2) kit.dot(c, x0 + 26 + (tw - 26) * (anim / 2), ty + 8, 4, C.accent);
        // the outcome
        const oy = ty + 46, col = out[0] === 'ok' ? C.ok : out[0] === 'warn' ? C.warn : C.bad;
        if (sampled) {
          S.box(c, x0, oy, tw, 34, { label: out[1], color: col, active: true, size: 13.5, textColor: col });
          ro.set('res', out[1]); ro.set('why', out[2]);
        } else { S.box(c, x0, oy, tw, 34, { label: 'in reset …', color: C.faint, dash: true }); ro.set('res', 'in reset'); ro.set('why', '—'); }
        if (anim >= 2) loop.stop();
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { ext[h.n] = h.val; anim = 0; loop.start(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ref-chip */
  Hyper.sim('ref-chip', {
    title: 'The chip as a block diagram',
    blurb: `Everything in the picture comes from the same catalogue as [the chip explorer](#/tools/chips): bright tiles are what the chip has, dim ones what it lacks.

**Try this**
- **Compare with** another chip: tiles that differ get a coloured edge and show both values.
- Find the radios each chip carries, and the ones it does not.
- Compare the ESP32-C3 with the original ESP32, then with the ESP32-C6.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.7, maxH: 620 });
      const chips = E.CHIPS.filter(c => !c.coproc);
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: chips.map(c => [c.name, c.id]), value: E.chip(params.chip) ? params.chip : 'esp32' },
        { id: 'cmp', type: 'select', label: 'Compare with', options: [['—', '']].concat(chips.map(c => [c.name, c.id])), value: params.compare || '' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['ram', 'RAM'], ['gpio', 'GPIO'], ['sleep', 'Deep sleep'], ['status', 'Status']]);
      const n0 = v => (v == null || v === false ? 0 : v);
      const TILES = [
        ['GPIO', c => c.gpio], ['ADC', c => c.adc ? (c.adc.unpublished ? '?' : c.adc.ch) : 0], ['DAC', c => c.dac], ['Touch', c => c.touch], ['UART', c => c.uart], ['I2C', c => c.i2c], ['SPI', c => c.spi], ['I2S', c => c.i2s],
        ['CAN', c => c.twai], ['PWM', c => c.ledc], ['Motor PWM', c => (c.mcpwm ? '✓' : 0)], ['Counter', c => c.pcnt], ['RMT', c => (c.rmt ? '✓' : 0)], ['USB', c => ((c.usb || []).some(u => /otg/i.test(u)) ? 'OTG' : (c.usb || []).length ? 'serial' : 0)],
        ['Ethernet', c => (c.eth ? '✓' : 0)], ['Camera', c => ((c.cam || []).length ? (/csi/i.test(c.cam.join()) ? 'MIPI' : 'DVP') : 0)], ['Big LCD', c => (/dsi/i.test((c.lcd || []).join()) ? 'MIPI' : /rgb/i.test((c.lcd || []).join()) ? 'RGB' : 0)], ['SD host', c => ((c.sdio || []).some(s => /host/i.test(s)) ? '✓' : 0)]
      ];
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const a = E.chip(ctl.values.chip), b = ctl.values.cmp && ctl.values.cmp !== a.id ? E.chip(ctl.values.cmp) : null;
        const hueA = /risc/i.test(a.arch) ? 150 : 8, M = 12, W = st.W - 2 * M;
        kit.label(c, a.name + (b ? '   against   ' + b.name : ''), M, 14, { size: 14, weight: 650 });
        kit.label(c, a.tagline || '', M, 32, { size: 11.5, color: C.muted });
        // processor and memory
        const y1 = 48, h1 = 62, cw = W * 0.5;
        const coreW = Math.min(88, (cw - 8) / Math.max(2, a.cores + (a.lp ? 1 : 0)) - 6);
        for (let i = 0; i < a.cores; i++) S.box(c, M + i * (coreW + 6), y1, coreW, h1, { label: /risc/i.test(a.arch) ? 'RISC-V' : a.arch.replace('Tensilica ', ''), sub: a.mhz + ' MHz', color: kit.hue(hueA), active: true });
        if (a.lp) S.box(c, M + a.cores * (coreW + 6), y1, coreW, h1, { label: 'low-power', sub: 'core', color: kit.hue(hueA), dash: true });
        const mx = M + cw + 8, mw = W - cw - 8;
        const bar = (label, kb, y, max) => {
          kit.label(c, label, mx, y + 7, { size: 11, color: C.text2 });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(mx + 44, y, mw - 110, 14);
          c.fillStyle = kit.hue(hueA, 0.85); c.fillRect(mx + 44, y, Math.max(2, (mw - 110) * Math.min(1, n0(kb) / max)), 14);
          if (b) { c.fillStyle = C.warn; c.fillRect(mx + 44 + (mw - 110) * Math.min(1, n0(label === 'RAM' ? b.sram : b.rom) / max) - 1, y - 2, 2, 18); }
          kit.label(c, kb ? (kb >= 1024 ? kb / 1024 + ' MB' : kb + ' KB') : '—', mx + mw, y + 7, { size: 11, align: 'right', weight: 600 });
        };
        bar('RAM', a.sram, y1 + 4, 1024); bar('ROM', a.rom, y1 + 24, 1024);
        kit.label(c, 'PSRAM: ' + (a.psramMax || 'not supported'), mx, y1 + 52, { size: 10.5, color: a.psramMax ? C.text2 : C.faint });
        // radios
        const y2 = y1 + h1 + 14, rw = (W - 16 - 40) / 3;
        const radios = [['Wi-Fi', x => x.wifi ? 'Wi-Fi ' + x.wifi.gen : '', x => x.wifi ? x.wifi.bands.join(' + ') + ' GHz' : 'none', 200],
          ['Bluetooth', x => x.bt ? (x.bt.classic ? 'Classic + LE' : 'Bluetooth LE') : '', x => x.bt ? (x.bt.le ? 'LE ' + x.bt.le : 'LE') : 'none', 238],
          ['802.15.4', x => x.ieee802154 ? 'Zigbee · Thread' : '', x => x.ieee802154 ? '802.15.4' : 'none', 286]];
        radios.forEach(([name, lab, sub, hue], i) => {
          const has = !!lab(a), other = b ? !!lab(b) : has, x = M + i * (rw + 8);
          S.box(c, x, y2, rw, 44, { label: has ? lab(a) : name, sub: sub(a), color: has ? kit.hue(hue) : C.faint, active: has, dash: !has });
          if (b && other !== has) { c.strokeStyle = C.warn; c.lineWidth = 2; c.strokeRect(x - 2, y2 - 2, rw + 4, 48); kit.label(c, b.name + ': ' + (other ? lab(b) : 'none'), x + rw / 2, y2 + 54, { size: 10, color: C.warn, align: 'center' }); }
        });
        if (a.wifi || a.bt || a.ieee802154) { const ax = M + W - 16; S.antenna(c, ax, y2 + 44, 34); S.radio(c, ax, y2 + 10, { r: 22, n: 3, phase: 0.6, from: -2.4, to: -0.75 }); }
        else kit.label(c, 'no radio', M + W - 20, y2 + 22, { size: 10.5, color: C.faint, align: 'center' });
        // peripherals
        const y3 = y2 + 44 + (b ? 26 : 12), cols = st.W < 520 ? 4 : 6, tw = (W - (cols - 1) * 6) / cols, th = Math.max(34, Math.min(46, (st.H - y3 - 8) / Math.ceil(TILES.length / cols) - 6));
        TILES.forEach(([name, f], i) => {
          const va = f(a), vb = b ? f(b) : va, x = M + (i % cols) * (tw + 6), y = y3 + Math.floor(i / cols) * (th + 6), has = !!n0(va), diff = b && String(n0(va)) !== String(n0(vb));
          S.box(c, x, y, tw, th, { label: has ? String(va) : '—', sub: name, color: has ? kit.hue(hueA) : C.faint, active: has, dash: !has, size: 13 });
          if (diff) { c.strokeStyle = C.warn; c.lineWidth = 2; c.strokeRect(x - 1.5, y - 1.5, tw + 3, th + 3); kit.label(c, String(n0(vb) || '—'), x + tw - 5, y + 9, { size: 9.5, color: C.warn, align: 'right' }); }
        });
        ro.set('ram', (a.sram >= 1024 ? a.sram / 1024 + ' MB' : a.sram + ' KB') + (b ? '  ·  ' + (b.sram >= 1024 ? b.sram / 1024 + ' MB' : b.sram + ' KB') : ''));
        ro.set('gpio', a.gpio + (b ? '  ·  ' + b.gpio : ''));
        ro.set('sleep', (a.sleepUa != null ? a.sleepUa + ' µA' : 'not published') + (b ? '  ·  ' + (b.sleepUa != null ? b.sleepUa + ' µA' : 'not published') : ''));
        ro.set('status', a.status || '—');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
