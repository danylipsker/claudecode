/* HYPER-ESP32 · sims/inside-the-chip.js
 *
 * Topic "Inside the chip". Simulations (ids ic-…):
 *   ic-clock-tree      crystal, PLL and divider to the CPU clock; relative current, time and energy for a job
 *   ic-memory-map      the chip's memories as layers and where a variable, a function or a malloc lands
 *   ic-flash-cache     an interrupt arriving while the flash is written: IRAM, held back, or a crash
 *   ic-boot-sequence   reset, boot ROM, bootloader, app, setup(): the stages and the console of each chip
 *   ic-auto-reset      DTR and RTS pressing BOOT and RESET through two transistors
 *   ic-efuses          settings that can only be burned, never restored
 *   ic-gpio-matrix     connecting a peripheral signal to a pin: IO MUX or matrix, and the pins that cannot
 *   ic-shared-radio    Wi-Fi, Bluetooth and 802.15.4 taking turns on one transceiver
 *   ic-power-domains   the high-power and low-power islands in active, light and deep sleep
 */
(function () {
  'use strict';

  /* ================================================================ helpers */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const kbText = kb => (kb >= 1024 ? kb / 1024 + ' MB' : kb + ' KB');
  // a repeatable pseudo-random number in [0, 1) from an integer
  const hash01 = n => { let x = (n * 2654435761) >>> 0; x ^= x >>> 15; x = Math.imul(x, 2246822519) >>> 0; x ^= x >>> 13; return (x >>> 0) / 4294967296; };
  const trough = (c, C, x, y, w, h) => { c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.06)'; c.fillRect(x, y, w, h); };

  /* ================================================================ ic-clock-tree */
  const FREQS = { 'esp32': [20, 40, 80, 160, 240], 'esp32-s3': [20, 40, 80, 160, 240], 'esp32-c3': [20, 40, 80, 160], 'esp32-c6': [20, 40, 80, 160] };
  Hyper.sim('ic-clock-tree', {
    title: 'The clock tree: from crystal to CPU',
    blurb: `The crystal is the reference. Above 40 MHz the CPU clock is the **PLL** output divided down; at 40 MHz and below it comes straight from the crystal. The frequencies offered are the ones each chip accepts (the same list MicroPython allows).

The three bars and the column chart use a simple model: current = a fixed part + a part proportional to the clock, and a job of fixed length takes time $\\propto 1/f$. **The numbers are relative to full speed and the fixed share is yours to choose** — measure a real board for absolute figures. The PLL value is schematic.

**Try this**
- Lower the clock with a fixed share of 30 %: the current falls, but the **energy for the job** rises.
- Set the fixed share to 0: now the energy is the same at every clock — current and time cancel.
- Choose 20 MHz on a chip with a radio: Wi-Fi and Bluetooth cannot run there.
- Compare the ESP32 and the ESP32-C3: different lists of legal frequencies.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 430, maxH: 520 });
      let chip = FREQS[params && params.chip] ? params.chip : 'esp32';
      const list = () => FREQS[chip];
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: Object.keys(FREQS).map(id => [E.chip(id).name, id]), value: chip },
        { id: 'step', label: 'CPU frequency', min: 0, max: 4, step: 1, value: 4, fmt: v => { const l = list(); return l[clamp(Math.round(v), 0, l.length - 1)] + ' MHz'; } },
        { id: 'fixed', label: 'Fixed share of the current', min: 0, max: 70, step: 5, value: 30, unit: '%' }
      ], id => { if (id === 'chip') chip = ctl.values.chip; loop.once(); });
      const ro = kit.readout(box.side, [['clk', 'CPU clock'], ['path', 'Clock path'], ['cur', 'Current'], ['job', 'A job of 1 million ticks'], ['en', 'Energy for that job']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), L = list(), i = clamp(Math.round(ctl.values.step), 0, L.length - 1);
        const f = L[i], fmax = L[L.length - 1], info = E.chip(chip), xtal = 40, usePll = f > xtal, fx = ctl.values.fixed / 100;
        const div = usePll ? Math.round(480 / f * 100) / 100 : xtal / f;
        const M = 12, W = st.W, gap = Math.max(18, W * 0.04), bw = (W - 2 * M - 3 * gap) / 4, y = 30, bh = 56;
        const xs = [0, 1, 2, 3].map(k => M + k * (bw + gap));
        kit.label(c, 'Where the CPU clock comes from', M, 12, { size: 12, weight: 650, color: C.text2 });
        const on = kit.hue(150), off = C.faint;
        const bx = S.box(c, xs[0], y, bw, bh, { label: 'Crystal', sub: xtal + ' MHz', color: kit.hue(40), active: true });
        const pll = S.box(c, xs[1], y, bw, bh, { label: 'PLL', sub: '≈ 480 MHz (schematic)', color: kit.hue(200), active: usePll, dash: !usePll });
        const dv = S.box(c, xs[2], y, bw, bh, { label: '÷ ' + kit.fmt(div, 3), sub: 'divider', color: kit.hue(150), active: true });
        const cp = S.box(c, xs[3], y, bw, bh, { label: f + ' MHz', sub: info.cores + (info.cores > 1 ? ' cores' : ' core'), color: kit.hue(8), active: true });
        kit.arrow(c, bx.r[0], bx.cy, pll.l[0], pll.cy, usePll ? on : off, usePll ? 2.4 : 1.2);
        kit.arrow(c, pll.r[0], pll.cy, dv.l[0], dv.cy, usePll ? on : off, usePll ? 2.4 : 1.2);
        kit.arrow(c, dv.r[0], dv.cy, cp.l[0], cp.cy, on, 2.4);
        // the bypass from the crystal straight to the divider
        c.save(); c.strokeStyle = usePll ? off : on; c.lineWidth = usePll ? 1.2 : 2.4; if (usePll) c.setLineDash([4, 4]);
        c.beginPath(); c.moveTo(bx.cx, y + bh); c.lineTo(bx.cx, y + bh + 14); c.lineTo(dv.cx, y + bh + 14); c.lineTo(dv.cx, y + bh + 2); c.stroke(); c.restore();
        // slow clock and peripherals
        const y2 = y + bh + 34;
        S.box(c, xs[0], y2, bw * 2 + gap, 38, { label: 'Slow clock', sub: 'RC ≈ 150 kHz or crystal', color: kit.hue(280), size: 11 });
        S.box(c, xs[2], y2, bw * 2 + gap, 38, { label: 'Bus and peripherals', sub: 'same clock source', color: kit.hue(186), size: 11 });
        // the model: relative current, time and energy
        const cur = fx + (1 - fx) * f / fmax, tm = fmax / f, en = cur * tm;
        const all = L.map(v => { const cv = fx + (1 - fx) * v / fmax; return cv * fmax / v; }), enMax = Math.max.apply(null, all);
        const yb = y2 + 62;
        kit.label(c, 'Against full speed (' + fmax + ' MHz = 100 %)', M, yb, { size: 12, weight: 650, color: C.text2 });
        const bars = [['Current', cur, 1, Math.round(cur * 100) + ' %', kit.hue(36)], ['Time for the job', tm, L[L.length - 1] / L[0], '× ' + kit.fmt(tm, 3), kit.hue(212)], ['Energy for the job', en, Math.max(1, enMax), Math.round(en * 100) + ' %', kit.hue(8)]];
        const lw = Math.min(150, W * 0.28), bwid = W - 2 * M - lw - 70;
        bars.forEach(([name, v, mx, txt, colr], k) => {
          const by = yb + 16 + k * 24;
          kit.label(c, name, M, by + 8, { size: 11.5, color: C.text2 });
          trough(c, C, M + lw, by, bwid, 16);
          c.fillStyle = colr; c.fillRect(M + lw, by, Math.max(2, bwid * clamp(v / mx, 0, 1)), 16);
          kit.label(c, txt, M + lw + bwid + 8, by + 8, { size: 11.5, weight: 600 });
        });
        // energy at every frequency
        const yc = yb + 16 + 3 * 24 + 18, ch = Math.max(50, st.H - yc - 58), cw = (W - 2 * M) / L.length;
        kit.label(c, 'Energy for the same job at each clock', M, yc, { size: 12, weight: 650, color: C.text2 });
        L.forEach((v, k) => {
          const e = all[k], hh = (ch - 18) * clamp(e / enMax, 0, 1), cx = M + k * cw + cw * 0.15;
          c.fillStyle = k === i ? kit.hue(8) : (C.dark ? 'rgba(255,255,255,.18)' : 'rgba(0,0,0,.14)');
          c.fillRect(cx, yc + 14 + ch - hh, cw * 0.7, hh);
          kit.label(c, v + ' MHz', cx + cw * 0.35, yc + 14 + ch + 12, { size: 10.5, align: 'center', color: k === i ? C.text : C.muted });
          kit.label(c, Math.round(e * 100) + ' %', cx + cw * 0.35, yc + 14 + ch - hh - 8, { size: 10, align: 'center', color: C.text2 });
        });
        if ((info.wifi || info.bt) && f < 80) kit.label(c, 'No Wi-Fi or Bluetooth below 80 MHz (' + f + ' MHz here)', M, st.H - 10, { size: 11.5, color: C.warn, weight: 600 });
        ro.set('clk', f + ' MHz (highest on this chip: ' + fmax + ' MHz)');
        ro.set('path', usePll ? 'crystal → PLL → ÷ ' + kit.fmt(div, 3) : 'crystal ÷ ' + kit.fmt(div, 3));
        ro.set('cur', Math.round(cur * 100) + ' % of the full-speed current');
        ro.set('job', kit.fmt(1000 / f, 3) + ' ms');
        ro.set('en', Math.round(en * 100) + ' % of the full-speed energy');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ic-memory-map */
  // the windows of each chip, from the datasheets (the ESP32 and the S3); null: not given here
  const MAPS = {
    'esp32': { win: { psram: '0x3F80_0000', fconst: '0x3F40_0000', fcode: '0x400C_2000', dram: '0x3FFA_E000', iram: '0x4008_0000', rtc: '0x5000_0000', rom: '0x4000_0000' },
      seen: { fconst: '0x3F40…', fcode: '0x400D…', dram: '0x3FFB…', iram: '0x4008…', rtc: '0x5000…', psram: '0x3F80…' } },
    'esp32-s3': { win: { psram: '0x3C00_0000', fconst: '0x3C00_0000', fcode: '0x4200_0000', dram: '0x3FC8_8000', iram: '0x4037_0000', rtc: '0x5000_0000', rom: '0x4000_0000' },
      seen: { fconst: '0x3C…', fcode: '0x42…', dram: '0x3FC9…', iram: '0x4037…', rtc: '0x5000…', psram: '0x3C…' } },
    'esp32-c3': { win: {}, seen: {} },
    'esp32-c6': { win: {}, seen: {} }
  };
  const THINGS = [
    ['A string constant: "hello"', 'str', 'fconst', 'const char *s = "hello";', 'in flash, read through the cache; no RAM used', 'everything'],
    ['A const lookup table', 'tab', 'fconst', 'const int table[] = {1, 2, 3};', 'in flash, read through the cache; no RAM used', 'everything'],
    ['A global variable', 'glob', 'dram', 'int counter = 0;', 'in data RAM; set up again at every boot', 'nothing: starts again after any reset'],
    ['A local variable', 'loc', 'dram', 'int x;  // inside a function', 'on the task stack, which is part of data RAM', 'until the function returns'],
    ['A small malloc (2 KB)', 'm2', 'dram', 'char *p = malloc(2048);', 'on the heap, in data RAM', 'until you free it; gone at reset'],
    ['A big malloc (100 KB)', 'm100', 'big', 'char *p = malloc(102400);', 'on the heap; in PSRAM if it is fitted and enabled, otherwise in data RAM if one block that large exists', 'until you free it; gone at reset'],
    ['A function', 'fn', 'fcode', 'void loop() { … }', 'in flash, run through the cache', 'everything'],
    ['A function with IRAM_ATTR', 'iram', 'iram', 'void IRAM_ATTR isr() { … }', 'in instruction RAM; copied from flash at every boot', 'its flash image survives; the copy is made again at boot'],
    ['A variable with RTC_DATA_ATTR', 'rtc', 'rtc', 'RTC_DATA_ATTR int boots;', 'in RTC memory, which stays powered in deep sleep', 'deep sleep; lost at power-off']
  ];
  Hyper.sim('ic-memory-map', {
    title: 'Where things live in memory',
    blurb: `The picture stacks the chip's memories as layers. Sizes come from the catalogue; the address windows are given for the ESP32 and the ESP32-S3 (from their datasheets). The layers are **not drawn to scale**.

Pick a thing from a program, and the layer where it lands is outlined, with the first digits you would see if you printed its address.

**Try this**
- Choose *A global variable*, then *A function*: data RAM against the flash window.
- Choose *A function with IRAM_ATTR*: why an interrupt handler sits in a different layer.
- Choose *A variable with RTC_DATA_ATTR*, and read what survives.
- Pick the ESP32-S3 and tick PSRAM: the **big malloc** moves to a different layer.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 420, maxH: 560 });
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: Object.keys(MAPS).map(id => [E.chip(id).name, id]), value: MAPS[params && params.chip] ? params.chip : 'esp32' },
        { id: 'thing', type: 'select', label: 'What is it?', options: THINGS.map(t => [t[0], t[1]]), value: 'glob' },
        { id: 'psram', type: 'check', label: 'PSRAM fitted and enabled', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['where', 'It lives'], ['seen', 'First digits of its address'], ['live', 'It survives'], ['code', 'In a program']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), info = E.chip(ctl.values.chip), map = MAPS[ctl.values.chip], win = map.win, hasP = !!info.psramMax;
        const t = THINGS.find(x => x[1] === ctl.values.thing) || THINGS[0];
        const usePsram = ctl.values.psram && hasP;
        let key = t[2];
        if (key === 'big') key = usePsram ? 'psram' : 'dram';
        const layers = [];
        if (hasP) layers.push({ key: 'psram', label: 'PSRAM (optional)', sub: String(info.psramMax).split(' (')[0], size: 2, color: 280, right: win.psram || '' });
        layers.push({ key: 'fconst', label: 'Flash: constants', sub: 'through the cache', size: 2, color: 40, right: win.fconst || '' });
        layers.push({ key: 'fcode', label: 'Flash: code', sub: 'through the cache', size: 3, color: 30, right: win.fcode || '' });
        layers.push({ key: 'dram', label: 'Data RAM', sub: 'globals, heap, stacks', size: 3, color: 150, right: win.dram || '' });
        layers.push({ key: 'iram', label: 'Instruction RAM', sub: 'IRAM: SRAM used for code', size: 2, color: 186, right: win.iram || '' });
        layers.push({ key: 'rtc', label: 'RTC memory', sub: kbText(info.rtcram || 0) + ', on in deep sleep', size: 1, color: 212, right: win.rtc || '' });
        layers.push({ key: 'rom', label: 'ROM', sub: kbText(info.rom || 0) + ', fixed', size: 1.5, color: 8, right: win.rom || '' });
        const M = 12, lw = Math.min(st.W * 0.6, 420), top = 26, h = st.H - top - 12;
        kit.label(c, info.name + ' · ' + kbText(info.sram) + ' SRAM · not to scale', M, 12, { size: 12, weight: 650, color: C.text2 });
        const boxes = S.layers(c, M, top, lw, layers.map(l => ({ label: l.label, sub: l.sub, size: l.size, color: l.color, right: st.W >= 520 ? l.right : '' })), { h, minRow: 30 });
        let hit = null;
        layers.forEach((l, k) => { if (l.key === key) hit = boxes[k]; });
        if (hit) {
          c.save(); c.strokeStyle = C.accent; c.lineWidth = 3; c.strokeRect(hit.x - 1, hit.y + 1, hit.w + 2, hit.h - 2); c.restore();
          const px = M + lw + 14, pw = st.W - px - M, py = clamp(hit.y + hit.h / 2, top + 40, st.H - 60);
          kit.arrow(c, px, py, M + lw + 2, hit.y + hit.h / 2, C.accent, 2.2);
          if (pw > 150) {
            S.box(c, px + 4, py - 24, pw - 4, 48, { label: t[0], sub: t[3], color: C.accent, active: true, size: 11 });
          }
        }
        const seen = map.seen[key];
        ro.set('where', t[4].replace('PSRAM if it is fitted and enabled, otherwise in data RAM if one block that large exists', usePsram ? 'PSRAM (fitted and enabled here)' : 'data RAM, if one block that large exists (PSRAM is off here)'));
        ro.set('seen', seen || (map.seen && Object.keys(map.seen).length ? '—' : 'differs by chip: see the datasheet'));
        ro.set('live', t[5]);
        ro.set('code', t[3]);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ic-flash-cache */
  const HANDLERS = [['In IRAM (IRAM_ATTR)', 'iram'], ['In flash, registered the ordinary way', 'ordinary'], ['In flash, registered IRAM-safe', 'safe']];
  Hyper.sim('ic-flash-cache', {
    title: 'A flash write meets an interrupt',
    blurb: `Time runs left to right over 400 ms. At 100 ms the program saves a setting: the flash is erased and written, so the **cache is off** for the length you choose. The ticks on the *interrupt* lane are the moments an interrupt is raised.

- **In IRAM**: the handler runs at once, flash write or not.
- **In flash, ordinary registration**: the interrupt is **held back**; when the cache returns the handler runs once, late, and the other ticks of the window are lost.
- **In flash, IRAM-safe registration**: the interrupt is allowed to run — and the handler touches flash with the cache off: **panic**.

**Try this**
- Start with the handler in IRAM and lengthen the flash write: nothing changes.
- Switch to *In flash, ordinary* and make the interrupts faster: more of them are lost.
- Choose *IRAM-safe* and shorten the write to 5 ms: the crash needs an interrupt inside the window.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 400, maxH: 480 });
      const T = 400, W0 = 100;
      let tcur = 0;
      const ctl = kit.controls(box.side, [
        { id: 'h', type: 'select', label: 'The interrupt handler is', options: HANDLERS, value: 'ordinary' },
        { id: 'P', label: 'An interrupt every', min: 1, max: 40, step: 1, value: 10, unit: 'ms' },
        { id: 'L', label: 'The flash write keeps the cache off for', min: 5, max: 150, step: 5, value: 40, unit: 'ms' },
        { type: 'buttons', items: [{ id: 'run', label: 'Run again', primary: true }] }
      ], () => { tcur = 0; loop.start(); });
      const ro = kit.readout(box.side, [['n', 'Interrupts raised'], ['ok', 'Handled at once'], ['late', 'Held back or lost'], ['res', 'Result']]);
      function events() {
        const P = ctl.values.P, L = ctl.values.L, h = ctl.values.h, W1 = W0 + L, ev = [];
        let crash = null, heldN = 0;
        for (let t = P; t < T; t += P) {
          const inWin = t >= W0 && t < W1;
          if (crash != null && t > crash) break;
          if (!inWin || h === 'iram') ev.push({ t, kind: 'ok' });
          else if (h === 'safe') { ev.push({ t, kind: 'crash' }); crash = t; }
          else { heldN++; ev.push({ t, kind: heldN === 1 ? 'late' : 'lost', at: W1 }); }
        }
        return { ev, crash, W1 };
      }
      const loop = kit.loop(dt => {
        tcur = Math.min(T, tcur + dt * 110);
        const c = st.begin(), C = kit.colors(), r = events(), h = ctl.values.h, L = ctl.values.L;
        const M = 12, lx = 120, pw = st.W - lx - M, X = t => lx + clamp(t / T, 0, 1) * pw;
        const lanes = [['Flash chip', 40], ['Cache', 94], ['CPU runs from', 148], ['Interrupt', 202], ['Handler ran', 256]];
        kit.label(c, 'Time (ms)', M, 12, { size: 11, color: C.muted });
        for (let t = 0; t <= T; t += 50) { kit.label(c, String(t), X(t), 14, { size: 10, align: 'center', color: C.faint }); c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(X(t) + 0.5, 24); c.lineTo(X(t) + 0.5, 310); c.stroke(); }
        const crashed = r.crash != null && tcur >= r.crash;
        const end = crashed ? r.crash : T;
        lanes.forEach(([name, y]) => kit.label(c, name, M, y + 27, { size: 11.5, color: C.text2 }));
        // the flash write window
        const wx = X(W0), ww = X(r.W1) - X(W0);
        c.fillStyle = C.dark ? 'rgba(229,72,77,.35)' : 'rgba(229,72,77,.22)'; c.fillRect(wx, 38, ww, 272);
        kit.label(c, 'erase + write', wx + ww / 2, 46, { size: 10, align: 'center', color: C.bad });
        // lane 1: flash chip: reading (blue), busy (red)
        const bar = (y, a, b, col, txt) => { c.fillStyle = col; c.fillRect(X(a), y, Math.max(1, X(b) - X(a)), 26); if (txt && X(b) - X(a) > 60) kit.label(c, txt, (X(a) + X(b)) / 2, y + 13, { size: 10.5, align: 'center', color: '#fff' }); };
        const lim = t => Math.min(t, tcur, end);
        bar(54, 0, lim(W0), kit.hue(212), 'ready: reads on demand');
        if (tcur > W0) bar(54, W0, lim(r.W1), kit.hue(4), 'busy');
        if (tcur > r.W1 && !crashed) bar(54, r.W1, lim(T), kit.hue(212), 'ready');
        // lane 2: cache
        bar(108, 0, lim(W0), kit.hue(150), 'on');
        if (tcur > W0) bar(108, W0, lim(r.W1), C.dark ? '#555b78' : '#9aa0b8', 'off');
        if (tcur > r.W1 && !crashed) bar(108, r.W1, lim(T), kit.hue(150), 'on');
        // lane 3: where the CPU can run from
        bar(162, 0, lim(W0), kit.hue(150), 'flash or RAM');
        if (tcur > W0) bar(162, W0, lim(r.W1), kit.hue(36), 'RAM only');
        if (tcur > r.W1 && !crashed) bar(162, r.W1, lim(T), kit.hue(150), 'flash or RAM');
        // lane 4 and 5: the interrupts and what the handler did
        let ok = 0, held = 0;
        r.ev.forEach(e => {
          if (e.t > tcur) return;
          c.strokeStyle = C.text2; c.lineWidth = 1.5; c.beginPath(); c.moveTo(X(e.t), 216); c.lineTo(X(e.t), 242); c.stroke();
          if (e.kind === 'ok') { ok++; kit.dot(c, X(e.t), 283, 4.5, kit.hue(150)); }
          else if (e.kind === 'late') { held++; if (tcur >= e.at) { kit.dot(c, X(e.at), 283, 4.5, kit.hue(36)); kit.arrow(c, X(e.t), 262, X(e.at) - 4, 279, kit.hue(36), 1.4); } }
          else if (e.kind === 'lost') { held++; c.save(); c.strokeStyle = C.muted; c.lineWidth = 1.2; c.beginPath(); c.moveTo(X(e.t) - 2.5, 280.5); c.lineTo(X(e.t) + 2.5, 285.5); c.moveTo(X(e.t) + 2.5, 280.5); c.lineTo(X(e.t) - 2.5, 285.5); c.stroke(); c.restore(); }
          else if (e.kind === 'crash') { held++; kit.label(c, '✕', X(e.t), 283, { size: 17, align: 'center', color: C.bad, weight: 700 }); }
        });
        kit.label(c, 'green: on time · amber: late', lx, 322, { size: 10.5, color: C.muted });
        kit.label(c, '× lost · ✕ crash', lx, 336, { size: 10.5, color: C.muted });
        kit.dot(c, X(tcur), 24, 4, C.accent);
        if (crashed) {
          S.box(c, M, st.H - 54, st.W - 2 * M, 42, { label: "Guru Meditation Error: Core 0 panic'ed", sub: 'Cache disabled but cached memory region accessed', color: C.bad, active: true, size: 11.5, textColor: C.bad });
        } else if (tcur >= T) {
          const late = r.ev.filter(e => e.kind === 'late').length, lost = r.ev.filter(e => e.kind === 'lost').length;
          kit.label(c, h === 'iram' ? 'All handled on time.' : late ? 'Ran once, ' + L + ' ms late; ' + lost + ' lost.' : 'No interrupt in the window: no harm.', M, st.H - 30, { size: 12, color: C.text, weight: 600 });
        }
        const raised = r.ev.filter(e => e.t <= tcur).length;
        ro.set('n', String(raised));
        ro.set('ok', String(ok));
        ro.set('late', String(r.ev.filter(e => e.t <= tcur && e.kind !== 'ok').length));
        ro.set('res', crashed ? 'crash at ' + r.crash + ' ms: the chip prints a backtrace and restarts' : tcur >= T ? (r.ev.some(e => e.kind !== 'ok') ? 'late and lost interrupts' : 'all on time') : 'running …');
        void held;
        if (tcur >= T || crashed) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });


  /* ================================================================ ic-boot-sequence */
  // what the ROM prints, in the usual form of each chip (example values: they differ between boards and versions)
  const ROMS = {
    'esp32': { head: ['ets Jun  8 2016 00:22:57', '', 'rst:0x1 (POWERON_RESET),boot:0x13 (SPI_FAST_FLASH_BOOT)', 'configsip: 0, SPIWP:0xee', 'mode:DIO, clock div:2', 'load:0x3fff0030,len:7176', 'load:0x40078000,len:15564', 'entry 0x40080640'],
      dl: ['ets Jun  8 2016 00:22:57', '', 'rst:0x1 (POWERON_RESET),boot:0x3 (DOWNLOAD_BOOT(UART0/UART1/SDIO_REI_REO_V2))', 'waiting for download'],
      bad: ['ets Jun  8 2016 00:22:57', '', 'rst:0x1 (POWERON_RESET),boot:0x33 (SPI_FAST_FLASH_BOOT)', 'flash read err, 1000', 'ets_main.c 371', '… and again, and again'] },
    'esp32-s3': { head: ['ESP-ROM:esp32s3-20210327', 'Build:Mar 27 2021', 'rst:0x1 (POWERON),boot:0x8 (SPI_FAST_FLASH_BOOT)', 'SPIWP:0xee', 'mode:DIO, clock div:1', 'load:0x3fce3808,len:0x4bc', 'load:0x403c9700,len:0xbd8', 'entry 0x403c98d0'],
      dl: ['ESP-ROM:esp32s3-20210327', 'Build:Mar 27 2021', 'rst:0x1 (POWERON),boot:0x0 (DOWNLOAD(USB/UART0))', 'waiting for download'] },
    'esp32-c3': { head: ['ESP-ROM:esp32c3-api1-20210207', 'Build:Feb  7 2021', 'rst:0x1 (POWERON),boot:0xc (SPI_FAST_FLASH_BOOT)', 'SPIWP:0xee', 'mode:DIO, clock div:1', 'load:0x3fcd6100,len:0x438', 'load:0x403ce000,len:0x91c', 'entry 0x403ce000'],
      dl: ['ESP-ROM:esp32c3-api1-20210207', 'Build:Feb  7 2021', 'rst:0x1 (POWERON),boot:0x4 (DOWNLOAD(USB/UART0/1))', 'waiting for download'] },
    'esp32-c6': { head: ['ESP-ROM:esp32c6-20220919', 'Build:Sep 19 2022', 'rst:0x1 (POWERON),boot:0x1c (SPI_FAST_FLASH_BOOT)', 'SPIWP:0xee', 'mode:DIO, clock div:1', 'load:0x4086c110,len:0xd34', 'load:0x40860000,len:0xa28', 'entry 0x4086c110'],
      dl: ['ESP-ROM:esp32c6-20220919', 'Build:Sep 19 2022', 'rst:0x1 (POWERON),boot:0x0 (DOWNLOAD(USB/UART0))', 'waiting for download'] }
  };
  const BOOT_OFFSET = { 'esp32': '0x1000', 'esp32-s3': '0x0', 'esp32-c3': '0x0', 'esp32-c6': '0x0' };
  Hyper.sim('ic-boot-sequence', {
    title: 'From reset to setup()',
    blurb: `Reset is released and the chip works through its stages; the console shows what each one prints. The **times are illustrative orders of magnitude**, and the lines are typical examples (addresses and dates differ between boards and versions; an Arduino build prints less from the second stage than an ESP-IDF one).

Click a stage to jump to it.

**Try this**
- Set the boot pin to *low* at reset: the ROM stops in download mode and waits for esptool.
- On the ESP32 tick **GPIO12 high at reset**: the flash cannot be read and the boot repeats. (The reference page on strapping pins explains why.)
- Compare the first lines of the four chips: the ROM's first line has a different form on each.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.8, minH: 400, maxH: 580 });
      let tsim = 0, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: Object.keys(ROMS).map(id => [E.chip(id).name, id]), value: 'esp32' },
        { id: 'pin', type: 'select', label: 'Boot pin at reset', options: [['high (normal)', 'high'], ['low (BOOT held)', 'low']], value: 'high' },
        { id: 'g12', type: 'check', label: 'GPIO12 high at reset (ESP32 only)', value: false },
        { id: 'slow', type: 'check', label: 'Slow motion', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Reset', primary: true }] }
      ], () => { tsim = 0; loop.start(); });
      const ro = kit.readout(box.side, [['stage', 'Stage now'], ['res', 'Outcome'], ['off', 'Bootloader read from flash offset']]);
      // the stages and their lines for the present settings
      function plan() {
        const id = ctl.values.chip, R = ROMS[id], info = E.chip(id), dual = info.cores > 1;
        const bad = id === 'esp32' && ctl.values.g12 && ctl.values.pin === 'high', dl = ctl.values.pin === 'low';
        const stages = [{ name: 'Reset', dur: 6, lines: [] }];
        if (bad) { stages.push({ name: 'Boot ROM', dur: 60, lines: R.bad }); return { stages, bad, dl }; }
        if (dl) { stages.push({ name: 'Boot ROM', dur: 40, lines: R.dl }); return { stages, bad, dl }; }
        stages.push({ name: 'Boot ROM', dur: 30, lines: R.head });
        const sdk = '5.5.5', ms = k => 'I (' + k + ') ';
        stages.push({ name: 'Bootloader', dur: 70, lines: [ms(30) + 'boot: ESP-IDF v' + sdk + ' 2nd stage bootloader', ms(36) + 'boot: Partition Table:', ms(40) + 'boot: ## Label    Type ST Offset   Length',
          ms(46) + 'boot:  0 nvs      01 02 00009000 00005000', ms(52) + 'boot:  1 otadata  01 00 0000e000 00002000', ms(58) + 'boot:  2 app0     00 10 00010000 00140000',
          ms(64) + 'boot:  3 app1     00 11 00150000 00140000', ms(70) + 'boot:  4 spiffs   01 82 00290000 00160000', ms(76) + 'boot: End of partition table', ms(88) + 'boot: Loaded app at offset 0x10000'] });
        const mhz = info.mhz;
        stages.push({ name: 'App start', dur: 110, lines: (dual ? [ms(120) + 'cpu_start: Pro cpu up.', ms(126) + 'cpu_start: Starting app cpu, entry 0x400811d4', ms(0 + 140) + 'cpu_start: App cpu up.'] : [ms(120) + 'cpu_start: Unicore app'])
          .concat([ms(160) + 'cpu_start: Pro cpu start user code', ms(166) + 'cpu_start: cpu freq: ' + mhz + '000000 Hz', ms(180) + 'heap_init: Initializing. RAM available:']) });
        stages.push({ name: 'setup()', dur: 30, lines: ['> loopTask calls setup(), then loop()', '> your first Serial.println() appears here'] });
        return { stages, bad, dl };
      }
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), P = plan(), rate = ctl.values.slow ? 35 : 110;
        const total = P.stages.reduce((a, s) => a + s.dur, 0);
        tsim = Math.min(total, tsim + dt * rate);
        const M = 12, W = st.W;
        kit.label(c, 'Stages (click one to jump)', M, 12, { size: 12, weight: 650, color: C.text2 });
        // the stage strip
        const n = P.stages.length, sw = (W - 2 * M - (n - 1) * 8) / n, sy = 26, sh = 44;
        hits = [];
        let acc = 0, cur = 0;
        P.stages.forEach((s, k) => { if (tsim >= acc) cur = k; acc += s.dur; });
        acc = 0;
        P.stages.forEach((s, k) => {
          const done = tsim >= acc + s.dur, active = k === cur && tsim < total + 1e-6 && !(tsim >= total && k < n - 1);
          const col = P.bad && k > 0 ? C.bad : P.dl && k > 0 ? C.warn : null;
          S.box(c, M + k * (sw + 8), sy, sw, sh, { label: s.name, sub: Math.round(s.dur) + ' ms', color: col || (done ? kit.hue(150) : active ? C.accent : C.faint), active: active || done, size: Math.max(9.5, Math.min(11.5, sw / 9)), dash: !done && !active });
          hits.push({ x: M + k * (sw + 8), y: sy, w: sw, h: sh, t: acc + 0.5 });
          acc += s.dur;
        });
        // the console
        const cy = sy + sh + 16, ch = st.H - cy - 12;
        kit.label(c, 'Console, 115200 baud', M, cy, { size: 12, weight: 650, color: C.text2 });
        c.fillStyle = C.dark ? '#0a0d1c' : '#f2f4fb'; c.fillRect(M, cy + 10, W - 2 * M, ch - 10);
        c.strokeStyle = C.border || C.faint; c.lineWidth = 1; c.strokeRect(M + 0.5, cy + 10.5, W - 2 * M - 1, ch - 11);
        // lines that have appeared so far
        const shown = [];
        acc = 0;
        P.stages.forEach(s => {
          s.lines.forEach((ln, j) => { if (tsim >= acc + s.dur * (j + 0.5) / Math.max(1, s.lines.length)) shown.push([ln, s.name]); });
          acc += s.dur;
        });
        const fsz = W < 520 ? 10 : 11, maxc = Math.max(20, Math.floor((W - 2 * M - 16) / (fsz * 0.6)));
        const vis = [];
        shown.forEach(([ln]) => { let rest = ln, pre = ''; while (rest.length > maxc) { let k = rest.lastIndexOf(',', maxc - 1); if (k < 10) k = rest.lastIndexOf(' ', maxc - 1); if (k < 10) k = maxc - 1; vis.push([pre + rest.slice(0, k + 1), ln]); rest = rest.slice(k + 1).trimStart(); pre = '  '; } vis.push([pre + rest, ln]); });
        const lh = 14.5, rows = Math.max(3, Math.floor((ch - 22) / lh)), first = Math.max(0, vis.length - rows);
        vis.slice(first).forEach(([txt, ln], k) => {
          const col = /^I \(/.test(ln) ? kit.hue(186) : /^>/.test(ln) ? kit.hue(150) : /flash read err|ets_main|and again/.test(ln) ? C.bad : /waiting for download/.test(ln) ? C.warn : C.text2;
          kit.label(c, txt, M + 8, cy + 24 + k * lh, { size: fsz, color: col, font: 'Consolas, "Cascadia Code", monospace' });
        });
        const done = tsim >= total;
        const stName = P.stages[cur].name;
        ro.set('stage', done ? (P.dl ? 'waiting in the ROM' : P.bad ? 'the ROM cannot read the flash' : 'running your program') : stName);
        ro.set('res', P.dl ? 'download mode: esptool can upload' : P.bad ? 'boot loop: GPIO12 chose 1.8 V for a 3.3 V flash' : 'normal boot to setup()');
        ro.set('off', BOOT_OFFSET[ctl.values.chip] + (P.dl ? ' (not read: download mode)' : ''));
        if (done) loop.stop();
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { tsim = h.t; loop.start(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ic-auto-reset */
  // sequences of the two control lines: [time ms, DTR asserted, RTS asserted]; 'hand': the buttons instead
  const SEQS = {
    dl: { name: 'esptool: enter download mode', ev: [[0, 0, 0], [40, 0, 1], [140, 1, 0], [190, 0, 0]], T: 260 },
    run: { name: 'esptool: reset after the upload', ev: [[0, 0, 0], [40, 0, 1], [140, 0, 0]], T: 260 },
    both: { name: 'a terminal opens the port: both lines asserted', ev: [[0, 0, 0], [60, 1, 1], [200, 0, 0]], T: 260 },
    dtr: { name: 'only DTR asserted', ev: [[0, 0, 0], [60, 1, 0], [200, 0, 0]], T: 260 },
    rts: { name: 'only RTS asserted', ev: [[0, 0, 0], [60, 0, 1], [160, 0, 0]], T: 260 },
    hand: { name: 'by hand: hold BOOT, tap RESET', hand: true, T: 260 }
  };
  Hyper.sim('ic-auto-reset', {
    title: 'DTR and RTS press BOOT and RESET for you',
    blurb: `On a development board two control lines of the USB-serial chip, **DTR** and **RTS**, reach the chip through two transistors: asserting **RTS** pulls **EN** low (reset), asserting **DTR** pulls the **boot pin** low. Asserting both does nothing.

The four traces are the lines as esptool moves them; the bottom lane shows what the chip does. The cursor marks the instant the boot pin is read, when EN rises again.

**Try this**
- *esptool: enter download mode*: EN goes low, then rises **while the boot pin is low**.
- *esptool: reset after the upload*: the boot pin stays high, so the program runs.
- *Both lines asserted* — the case a terminal creates: nothing happens, which is the point of the circuit.
- *By hand*: you do with two fingers what the two transistors do.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.78, minH: 420, maxH: 560 });
      let tcur = 0;
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: ['esp32', 'esp32-s3', 'esp32-c3', 'esp32-c6'].map(id => [E.chip(id).name, id]), value: 'esp32' },
        { id: 'seq', type: 'select', label: 'What happens on the lines', options: Object.keys(SEQS).map(k => [SEQS[k].name, k]), value: 'dl' },
        { type: 'buttons', items: [{ id: 'play', label: 'Play', primary: true }] }
      ], () => { tcur = 0; loop.start(); });
      const ro = kit.readout(box.side, [['boot', 'Boot pin'], ['res', 'The chip']]);
      // levels of dtr, rts (asserted = 1), EN and the boot pin at time t
      function lv(sq, t) {
        if (sq.hand) { const rst = t >= 60 && t < 110, boot = t < 200; return { dtr: 0, rts: 0, en: rst ? 0 : 1, io: boot ? 0 : 1, handBoot: boot, handRst: rst }; }
        let d = 0, r = 0;
        for (const e of sq.ev) if (t >= e[0]) { d = e[1]; r = e[2]; }
        return { dtr: d, rts: r, en: r && !d ? 0 : 1, io: d && !r ? 0 : 1 };
      }
      function edges(sq, key) {
        const out = [[0, lv(sq, 0)[key]]]; let last = out[0][1];
        for (let t = 1; t <= sq.T; t++) { const v = lv(sq, t)[key]; if (v !== last) { out.push([(t - 0.5) / 1000, v]); last = v; } }
        out.push([sq.T / 1000, last]);
        return out;
      }
      function chipStates(sq) {
        // reset intervals and what the boot pin said when each ended
        const res = []; let inReset = false, a = 0;
        for (let t = 0; t <= sq.T; t++) {
          const l = lv(sq, t);
          if (!l.en && !inReset) { inReset = true; a = t; }
          if (l.en && inReset) { inReset = false; res.push({ a, b: t, io: lv(sq, t).io }); }
        }
        return res;
      }
      const loop = kit.loop(dt => {
        tcur = Math.min(260, tcur + dt * 70);
        const c = st.begin(), C = kit.colors(), sq = SEQS[ctl.values.seq], now = lv(sq, tcur), M = 12, W = st.W;
        const bootPin = (E.PINS[ctl.values.chip].defaults || {}).boot;
        // the circuit
        kit.label(c, 'On the board', M, 12, { size: 12, weight: 650, color: C.text2 });
        const y0 = 28, h0 = 92, uw = Math.min(150, W * 0.27), ew = Math.min(150, W * 0.27);
        const usb = S.box(c, M, y0, uw, h0, { label: 'USB-serial chip', sub: 'DTR · RTS', color: kit.hue(212), size: 11.5 });
        const tr = S.box(c, W / 2 - 44, y0 + 10, 88, h0 - 20, { label: 'two', sub: 'transistors', color: kit.hue(36), size: 11.5 });
        const esp = S.box(c, W - M - ew, y0, ew, h0, { label: E.chip(ctl.values.chip).name, sub: 'EN · GPIO' + bootPin, color: kit.hue(8), size: 11.5 });
        const on = C.accent, offc = C.faint;
        const wire = (x1, y1, x2, y2, hot, col) => { c.save(); c.strokeStyle = hot ? col : offc; c.lineWidth = hot ? 3 : 1.4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.restore(); };
        const yRts = y0 + h0 * 0.28, yDtr = y0 + h0 * 0.72;
        wire(usb.r[0], yRts, tr.l[0], yRts, now.rts, on); wire(usb.r[0], yDtr, tr.l[0], yDtr, now.dtr, on);
        wire(tr.r[0], yRts, esp.l[0], yRts, !now.en, C.bad); wire(tr.r[0], yDtr, esp.l[0], yDtr, !now.io, C.warn);
        kit.label(c, 'RTS', usb.r[0] + 6, yRts - 9, { size: 10.5, color: now.rts ? C.accent : C.muted, weight: 600 });
        kit.label(c, 'DTR', usb.r[0] + 6, yDtr - 9, { size: 10.5, color: now.dtr ? C.accent : C.muted, weight: 600 });
        kit.label(c, W < 520 ? 'EN' : 'EN ' + (now.en ? 'high' : 'LOW'), esp.l[0] - 6, yRts - 9, { size: 10.5, color: now.en ? C.muted : C.bad, align: 'right', weight: 600 });
        kit.label(c, W < 520 ? 'IO' + bootPin : 'GPIO' + bootPin + ' ' + (now.io ? 'high' : 'LOW'), esp.l[0] - 6, yDtr - 9, { size: 10.5, color: now.io ? C.muted : C.warn, align: 'right', weight: 600 });
        // the traces
        const ty = y0 + h0 + 22, lw = 52, tw = W - 2 * M - lw, th = st.H - ty - 74;
        const hand = !!sq.hand;
        const rows = (hand ? [] : [{ label: 'DTR', edges: edges(sq, 'dtr'), color: C.accent }, { label: 'RTS', edges: edges(sq, 'rts'), color: C.accent }])
          .concat([{ label: 'EN', edges: edges(sq, 'en'), color: kit.hue(4) }, { label: 'GPIO' + bootPin, edges: edges(sq, 'io'), color: kit.hue(46) }]);
        if (hand) rows.unshift({ label: 'BOOT', edges: [[0, 1], [0.2, 0], [0.26, 0]], color: C.accent }, { label: 'RESET', edges: [[0, 0], [0.06, 1], [0.11, 0], [0.26, 0]], color: C.accent });
        S.logic(c, M, ty, W - 2 * M, th, rows, { t0: 0, t1: sq.T / 1000, cursor: tcur / 1000, labelW: lw });
        kit.label(c, 'pressed or asserted = up', M, ty - 8, { size: 10, color: C.faint });
        // what the chip does
        const sts = chipStates(sq), by = st.H - 62, bh = 26, X = t => M + lw + (t / sq.T) * tw;
        kit.label(c, 'The chip', M, by + bh / 2, { size: 11, color: C.text2 });
        let a = 0;
        const seg = (t0, t1, txt, col) => { if (t1 <= t0) return; c.fillStyle = col; c.fillRect(X(t0), by, X(t1) - X(t0), bh); if (X(t1) - X(t0) > 56) kit.label(c, txt, (X(t0) + X(t1)) / 2, by + bh / 2, { size: 10.5, align: 'center', color: '#fff', weight: 600 }); };
        sts.forEach(r => { seg(a, r.a, 'running', kit.hue(150)); seg(r.a, r.b, 'reset', kit.hue(4)); a = r.b; });
        const last = sts[sts.length - 1];
        seg(a, sq.T, last ? (last.io ? 'runs the program' : 'download mode') : 'running', last ? (last.io ? kit.hue(150) : kit.hue(40)) : kit.hue(150));
        if (last && tcur >= last.b) { c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([3, 3]); c.beginPath(); c.moveTo(X(last.b), ty - 4); c.lineTo(X(last.b), by + bh); c.stroke(); c.setLineDash([]); kit.label(c, 'boot pin read: ' + (last.io ? 'high' : 'low'), X(last.b) + 5, by - 7, { size: 10.5, color: C.warn }); }
        // the verdict
        const verdict = !sts.length ? 'No reset happened: the chip keeps running its program.' : last.io ? 'The chip was reset and started its program.' : 'The chip left reset with the boot pin low: download mode, ready for esptool.';
        kit.label(c, !sts.length ? 'No reset: it keeps running.' : last.io ? 'Reset, then it runs the program.' : 'Reset, boot pin low: download mode.', M, st.H - 14, { size: 12, color: C.text, weight: 600 });
        ro.set('boot', 'GPIO' + bootPin + (ctl.values.chip === 'esp32' || ctl.values.chip === 'esp32-s3' ? '' : ' (and GPIO8 high)'));
        ro.set('res', verdict);
        if (tcur >= 260) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.start();
    }
  });

  /* ================================================================ ic-efuses */
  const FUSES = [
    ['flash', 'Flash voltage fixed', 'The chip stops reading the strapping pin for the flash supply and always uses the value burned.', 'A wrong value leaves the flash unreadable: the chip never boots again.'],
    ['jtag', 'USB debug closed', 'JTAG through the USB port is switched off; debugging needs the JTAG pins, or is gone for good.', 'Debugging and some recovery methods are lost on that unit.'],
    ['dl', 'Download mode disabled', 'The ROM refuses to enter download mode, so esptool and the BOOT button no longer work.', 'The unit can only be updated by its own program, over the air. A bug there is final.'],
    ['print', 'ROM messages silenced', 'The ROM stops printing its boot lines to the serial port.', 'Harmless, but it also hides the boot log you would use to diagnose a fault.'],
    ['sb', 'Secure boot on', 'The chip runs only firmware signed with your key.', 'Lose the signing key and the unit can never be updated again.'],
    ['fe', 'Flash encryption on', 'The program in flash is encrypted with a key nobody can read.', 'Plain firmware no longer runs; every update has to be encrypted for this chip.'],
    ['mac', 'Custom MAC address', 'A different base address replaces the factory one for the chip\'s Wi-Fi and Bluetooth.', 'The address can never be changed again.']
  ];
  Hyper.sim('ic-efuses', {
    title: 'eFuses go one way',
    blurb: `A row of a few eFuse settings. Each starts **intact** (reads 0). Burning one blows its link: it reads 1, and nothing can restore it. This is **a simulation: nothing here touches a chip**, and no real burn command is given on this page.

Click a fuse to select it, then try the buttons. *New board* gives you a fresh set of intact fuses, which is exactly what a real chip does not offer.

**Try this**
- Burn *Flash voltage fixed* and then try to restore it: writing 0 changes nothing.
- Read the **risk** of each setting before you imagine burning it.
- Compare the room in the eFuse block between the ESP32 and the C6: the catalogue's figures.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 420, maxH: 460 });
      let blown = {}, sel = 'flash', msg = 'Select a fuse and press a button.', hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: ['esp32', 'esp32-s3', 'esp32-c3', 'esp32-c6'].map(id => [E.chip(id).name, id]), value: 'esp32-c6' },
        { type: 'buttons', items: [{ id: 'burn', label: 'Burn it (write 1)', primary: true }, { id: 'undo', label: 'Try to restore it (write 0)' }, { id: 'new', label: 'New board' }] }
      ], (id) => {
        const f = FUSES.find(x => x[0] === sel);
        if (id === 'burn') { blown[sel] = true; msg = 'Burned: "' + f[1] + '" now reads 1. ' + f[3]; }
        else if (id === 'undo') { msg = blown[sel] ? 'You wrote 0, and it still reads 1. A blown fuse stays blown.' : 'It already reads 0: there is nothing to restore.'; }
        else if (id === 'new') { blown = {}; msg = 'A fresh board with every fuse intact. A real chip has no such button.'; }
        loop.once();
      });
      const ro = kit.readout(box.side, [['state', 'Selected fuse'], ['eff', 'When burned'], ['risk', 'Risk'], ['room', 'eFuse block of this chip'], ['last', 'What just happened']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), info = E.chip(ctl.values.chip), M = 12, W = st.W, f = FUSES.find(x => x[0] === sel);
        kit.label(c, 'Settings you may burn (a few of the many fields)', M, 12, { size: 12, weight: 650, color: C.text2 });
        const n = FUSES.length, cols = W >= 640 ? 7 : 4, rows = Math.ceil(n / cols), cw = (W - 2 * M) / cols, y = 44, cellH = 112;
        hits = [];
        FUSES.forEach((fz, k) => {
          const col = k % cols, row = Math.floor(k / cols), gx = M + col * cw, gy = y + row * (cellH + 8);
          const cx = gx + cw / 2, b = !!blown[fz[0]], isSel = fz[0] === sel;
          if (isSel) { c.fillStyle = C.dark ? 'rgba(123,140,255,.18)' : 'rgba(60,90,220,.10)'; c.fillRect(gx + 2, gy - 10, cw - 4, cellH); }
          // the fuse: a wire with a thin link, intact or blown
          const wy = gy + 18, a = cx - cw * 0.34, z = cx + cw * 0.34;
          c.save(); c.lineWidth = 2.4; c.strokeStyle = b ? C.faint : C.ok; c.lineCap = 'round';
          c.beginPath(); c.moveTo(a, wy); c.lineTo(cx - 9, wy); c.stroke();
          c.beginPath(); c.moveTo(cx + 9, wy); c.lineTo(z, wy); c.stroke();
          if (b) { c.strokeStyle = C.bad; c.lineWidth = 2; c.beginPath(); c.moveTo(cx - 9, wy); c.lineTo(cx - 4, wy - 6); c.moveTo(cx + 9, wy); c.lineTo(cx + 4, wy + 6); c.stroke(); }
          else { c.lineWidth = 1.4; c.beginPath(); c.moveTo(cx - 9, wy); c.lineTo(cx + 9, wy); c.stroke(); }
          c.restore();
          kit.label(c, b ? '1' : '0', cx, wy + 22, { size: 18, weight: 700, align: 'center', color: b ? C.bad : C.ok, font: 'Consolas, monospace' });
          kit.label(c, b ? 'blown' : 'intact', cx, wy + 42, { size: 10.5, align: 'center', color: b ? C.bad : C.muted });
          const words = fz[1].split(' '), l1 = words.slice(0, Math.ceil(words.length / 2)).join(' '), l2 = words.slice(Math.ceil(words.length / 2)).join(' ');
          kit.label(c, l1, cx, wy + 62, { size: 10, align: 'center', color: isSel ? C.text : C.text2, weight: isSel ? 650 : 500 });
          kit.label(c, l2, cx, wy + 75, { size: 10, align: 'center', color: isSel ? C.text : C.text2, weight: isSel ? 650 : 500 });
          hits.push({ x: gx, y: gy - 10, w: cw, h: cellH, id: fz[0] });
        });
        // the block as a whole
        const by = y + rows * (cellH + 8) + 12, total = info.id === 'esp32' ? 1024 : 4096, users = info.id === 'esp32' ? 768 : 1792;
        kit.label(c, 'The whole eFuse block of the ' + info.name + ' (catalogue)', M, by, { size: 12, weight: 650, color: C.text2 });
        const bw = W - 2 * M, bh = 26;
        const segs = [['factory fields', total - users, kit.hue(36)], ['keys and data', users, kit.hue(212)]];
        let x = M;
        segs.forEach(([name, v, col]) => { const w = bw * v / total; c.fillStyle = col; c.fillRect(x, by + 12, w - 1, bh); const txt = name + ' · ' + v + ' bits'; kit.label(c, c.measureText(txt).width < w - 10 ? txt : String(v), x + w / 2, by + 12 + bh / 2, { size: 10.5, align: 'center', color: '#fff', weight: 600 }); x += w; });
        kit.label(c, total + ' bits in all. A bit that reads 1 stays 1.', M, by + 12 + bh + 16, { size: 11, color: C.muted });
        ro.set('state', f[1] + ': ' + (blown[sel] ? 'burned, reads 1' : 'intact, reads 0'));
        ro.set('eff', f[2]);
        ro.set('risk', f[3]);
        ro.set('room', total + ' bits, ' + users + ' for users');
        ro.set('last', msg);
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { sel = h.id; msg = 'Selected: ' + FUSES.find(x => x[0] === sel)[1] + '.'; loop.once(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });


  /* ================================================================ ic-gpio-matrix */
  // the fixed fast (IO MUX) pins of a few signals. UART0 from the catalogue; the main SPI bus from the datasheets (the C6: none shown)
  const DIRECT = {
    'esp32': { uart0tx: 1, uart0rx: 3, spiclk: 18, spimosi: 23, spimiso: 19 },
    'esp32-s3': { uart0tx: 43, uart0rx: 44, spiclk: 12, spimosi: 11, spimiso: 13 },
    'esp32-c3': { uart0tx: 21, uart0rx: 20, spiclk: 6, spimosi: 7, spimiso: 2 },
    'esp32-c6': { uart0tx: 16, uart0rx: 17 }
  };
  // name, id, direction: out (the pin must be able to drive), in, adc
  const SIGNALS = [['UART0 TX', 'uart0tx', 'out'], ['UART0 RX', 'uart0rx', 'in'], ['UART1 TX', 'uart1tx', 'out'], ['UART1 RX', 'uart1rx', 'in'], ['I2C SDA', 'sda', 'out'], ['I2C SCL', 'scl', 'out'],
    ['SPI clock (main bus)', 'spiclk', 'out'], ['SPI MOSI (main bus)', 'spimosi', 'out'], ['SPI MISO (main bus)', 'spimiso', 'in'], ['PWM (LEDC) output', 'pwm', 'out'], ['Analogue input (ADC)', 'adc', 'adc']];
  Hyper.sim('ic-gpio-matrix', {
    title: 'Connect a peripheral signal to a pin',
    blurb: `Choose a **peripheral signal** and click a **pin**. If the pin is the signal's own fast IO MUX pin (ringed) the signal goes straight through; anywhere else it goes through the **GPIO matrix**, which costs a short extra delay but allows almost any pin.

Pin colours say whether the pin can carry that signal: green fine, amber to be careful with, red it cannot. The pin facts come from the catalogue.

**Try this**
- *UART0 TX*: the ringed pin is the console's direct pin. Pick another and watch the route change.
- On the ESP32 give an **output** signal GPIO34: input-only pins turn red.
- Pick a flash pin (GPIO6 on the ESP32): red, whatever the signal.
- Choose *Analogue input (ADC)*: the matrix is not used at all, and only pins with an ADC channel stay green.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.55, minH: 380, maxH: 420 });
      const picks = {};
      let hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: Object.keys(DIRECT).map(id => [E.chip(id).name, id]), value: 'esp32' },
        { id: 'sig', type: 'select', label: 'Peripheral signal', options: SIGNALS.map(s => [s[0], s[1]]), value: 'uart1tx' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['route', 'Route'], ['pin', 'Pin check'], ['direct', 'Direct pin for this signal']]);
      const judge = (chip, sig, n) => {
        const p = E.pin(chip, n) || {};
        if (p.flash) return ['bad', 'Wired to the flash or PSRAM memory: do not use.'];
        if (sig[2] === 'adc') return p.adc ? ['ok', 'Analogue channel ' + p.adc + ' is wired to this pad.'] : ['bad', 'This pin has no ADC channel.'];
        if (p.dir === 'I' && sig[2] !== 'in') return ['bad', 'Input-only pin: it cannot drive an output signal.'];
        if (p.safe === 'avoid') return ['bad', p.note || 'Avoid this pin.'];
        if (p.safe === 'caution') return ['warn', p.note || 'Use with care.'];
        return ['ok', p.note || 'A free pin.'];
      };
      const defaultPin = (chip, sig) => {
        const d = DIRECT[chip][sig[1]];
        if (d != null) return d;
        const used = new Set(Object.values(DIRECT[chip]));
        const g = E.PINS[chip].gpios.map(x => x.n).find(n => !used.has(n) && judge(chip, sig, n)[0] === 'ok');
        return g != null ? g : E.PINS[chip].gpios[0].n;
      };
      const pickOf = (chip, sig) => { const k = chip + ':' + sig[1]; if (picks[k] == null) picks[k] = defaultPin(chip, sig); return picks[k]; };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), chip = ctl.values.chip, sig = SIGNALS.find(s => s[1] === ctl.values.sig) || SIGNALS[0], M = 12, W = st.W;
        const n = pickOf(chip, sig), dpin = DIRECT[chip][sig[1]], isDirect = dpin === n, isAdc = sig[2] === 'adc', v = judge(chip, sig, n);
        // the route
        const y0 = 26, bw = Math.min(150, W * 0.25);
        const sb = S.box(c, M, y0 + 22, bw, 52, { label: sig[0], sub: 'peripheral signal', color: kit.hue(186), active: true, size: 11 });
        const mx = S.box(c, W / 2 - bw / 2, y0, bw, 40, { label: 'IO MUX', sub: 'fixed fast routes', color: kit.hue(150), active: isDirect, dash: !isDirect, size: 11 });
        const gm = S.box(c, W / 2 - bw / 2, y0 + 56, bw, 40, { label: 'GPIO matrix', sub: 'any pin, small delay', color: kit.hue(36), active: !isDirect && !isAdc, dash: isDirect || isAdc, size: 11 });
        const pb = S.box(c, W - M - bw, y0 + 22, bw, 52, { label: 'GPIO' + n, sub: v[0] === 'bad' ? 'cannot carry it' : 'the pin', color: v[0] === 'bad' ? C.bad : v[0] === 'warn' ? C.warn : C.ok, active: true, size: 11 });
        const mid = isAdc ? null : (isDirect ? mx : gm), hot = isDirect ? kit.hue(150) : kit.hue(36);
        if (isAdc) { kit.arrow(c, sb.r[0], sb.cy, pb.l[0], pb.cy, C.accent, 2.2); kit.label(c, 'analogue pads bypass both', W / 2, y0 + 112, { size: 10.5, align: 'center', color: C.muted }); }
        else { kit.arrow(c, sb.r[0], sb.cy, mid.l[0], mid.cy, hot, 2.4); kit.arrow(c, mid.r[0], mid.cy, pb.l[0], pb.cy, hot, 2.4); }
        // the pins
        const pins = E.PINS[chip].gpios.map(g => g.n), rows = 3, cols = Math.ceil(pins.length / rows), top = y0 + 140;
        const cw = Math.min(40, (W - 2 * M) / cols), chh = Math.min(44, (st.H - top - 48) / rows);
        kit.label(c, 'Click a pin of the ' + E.chip(chip).name + ' for this signal', M, top - 12, { size: 12, weight: 650, color: C.text2 });
        hits = [];
        pins.forEach((p, k) => {
          const cx = M + (k % cols) * cw, cy = top + Math.floor(k / cols) * chh, j = judge(chip, sig, p), sel = p === n;
          const hue = j[0] === 'ok' ? 140 : j[0] === 'warn' ? 46 : 4;
          c.fillStyle = kit.hue(hue, C.dark ? 0.32 : 0.28); c.fillRect(cx + 1, cy + 1, cw - 2, chh - 2);
          c.strokeStyle = sel ? C.accent : kit.hue(hue, 0.7); c.lineWidth = sel ? 3 : 1; c.strokeRect(cx + 1.5, cy + 1.5, cw - 3, chh - 3);
          if (p === dpin) { c.strokeStyle = C.accent; c.lineWidth = 2; c.beginPath(); c.arc(cx + cw / 2, cy + chh / 2, Math.min(cw, chh) * 0.44, 0, kit.TAU); c.stroke(); }
          kit.label(c, String(p), cx + cw / 2, cy + chh / 2, { size: Math.min(12, cw * 0.4), align: 'center', color: C.text, weight: sel ? 700 : 500 });
          if (j[0] === 'bad') kit.label(c, '×', cx + cw - 7, cy + 8, { size: 11, align: 'center', color: C.bad });
          hits.push({ x: cx, y: cy, w: cw, h: chh, n: p });
        });
        kit.label(c, 'green: fine · amber: care · red ×: cannot', M, st.H - 26, { size: 10.5, color: C.muted });
        kit.label(c, 'ring: the direct IO MUX pin of this signal', M, st.H - 11, { size: 10.5, color: C.muted });
        ro.set('route', isAdc ? 'a fixed analogue pad: the matrix is not used' : isDirect ? 'IO MUX, direct (the fast path)' : 'GPIO matrix (a small extra delay)');
        ro.set('pin', 'GPIO' + n + ': ' + v[1]);
        ro.set('direct', dpin != null ? 'GPIO' + dpin : isAdc ? 'not applicable' : 'none shown for this signal: every pin goes through the matrix');
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { const sig = SIGNALS.find(s => s[1] === ctl.values.sig) || SIGNALS[0]; picks[ctl.values.chip + ':' + sig[1]] = h.n; loop.once(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ic-shared-radio */
  const RADIO_CHIPS = ['esp32', 'esp32-s2', 'esp32-c3', 'esp32-c6', 'esp32-h2', 'esp32-p4'];
  Hyper.sim('ic-shared-radio', {
    title: 'One transceiver, three protocols',
    blurb: `Each lane shows the time slots (1 ms each, 400 ms in all) in which a protocol **asks** for the radio; the bottom lane shows who **gets** it. A request that loses its slot is hollow with a red mark.

**This is a schematic model**: real arbitration is finer-grained, but the effect is the same — whoever is more urgent wins the slot, and bulk Wi-Fi data waits. Which protocols appear depends on the chip, from the catalogue.

**Try this**
- On the ESP32-C3 raise the Wi-Fi traffic, then add a **BLE connection**: Wi-Fi gets less than it asked for.
- Set BLE to *scan, window = interval*: the scan eats the slots.
- Choose the ESP32-H2: no Wi-Fi, and the two light protocols hardly collide.
- Compare **who is favoured**: urgency, Wi-Fi first, Bluetooth first.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.74, minH: 400, maxH: 520 });
      const N = 400;
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: RADIO_CHIPS.map(id => [E.chip(id).name, id]), value: 'esp32-c6' },
        { id: 'wifi', label: 'Wi-Fi traffic', min: 0, max: 100, step: 5, value: 40, unit: '%' },
        { id: 'ble', type: 'select', label: 'Bluetooth LE', options: [['off', 'off'], ['advertising every 100 ms', 'adv'], ['connection, interval 30 ms', 'conn'], ['scan, window = interval', 'scan']], value: 'conn' },
        { id: 'zb', label: '802.15.4 (Zigbee, Thread) traffic', min: 0, max: 40, step: 5, value: 10, unit: '%' },
        { id: 'prio', type: 'select', label: 'Who is favoured', options: [['by urgency (the usual)', 'urg'], ['Wi-Fi first', 'wifi'], ['Bluetooth first', 'ble']], value: 'urg' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['wifi', 'Wi-Fi'], ['ble', 'Bluetooth LE'], ['zb', '802.15.4'], ['busy', 'Transceiver busy']]);
      function model() {
        const info = E.chip(ctl.values.chip), has = { wifi: !!info.wifi, ble: !!info.bt, zb: !!info.ieee802154 };
        const v = ctl.values, req = { wifi: new Array(N).fill(0), ble: new Array(N).fill(0), zb: new Array(N).fill(0) };
        // priorities: 3 urgent, 2 normal, 1 bulk
        const base = { beacon: 3, wdata: 1, adv: 2, conn: 3, scan: 1, zb: 2 };
        const pr = { beacon: base.beacon, wdata: base.wdata, adv: base.adv, conn: base.conn, scan: base.scan, zb: base.zb };
        if (v.prio === 'wifi') { pr.beacon = 4; pr.wdata = 3; }
        if (v.prio === 'ble') { pr.adv = 4; pr.conn = 4; pr.scan = 3; }
        const kind = new Array(N).fill('');
        for (let s = 0; s < N; s++) {
          if (has.wifi) {
            if (s % 102 < 2) { req.wifi[s] = pr.beacon; kind[s] += 'b'; }
            else if (hash01(Math.floor(s / 4) + 1) * 100 < v.wifi) { req.wifi[s] = pr.wdata; kind[s] += 'w'; }
          }
          if (has.ble) {
            if (v.ble === 'adv' && s % 100 < 5 && s % 2 === 0) req.ble[s] = pr.adv;
            if (v.ble === 'conn' && s % 30 < 3) req.ble[s] = pr.conn;
            if (v.ble === 'scan') req.ble[s] = pr.scan;
          }
          if (has.zb && hash01(Math.floor(s / 4) + 977) * 100 < v.zb) req.zb[s] = pr.zb;
        }
        // the arbiter: the highest priority wins; equal priorities take turns
        const owner = new Array(N).fill(null), tally = { wifi: [0, 0], ble: [0, 0], zb: [0, 0], beacon: [0, 0] };
        for (let s = 0; s < N; s++) {
          let best = null, bp = 0;
          const cand = [];
          for (const k of ['wifi', 'ble', 'zb']) { const r = req[k][s]; if (r > bp) { bp = r; cand.length = 0; cand.push(k); } else if (r === bp && r > 0) cand.push(k); }
          if (cand.length) best = cand[s % cand.length];     // equal urgency: they take turns
          owner[s] = best;
          for (const k of ['wifi', 'ble', 'zb']) if (req[k][s]) { const got = best === k; if (k === 'wifi' && kind[s].includes('b')) { tally.beacon[1]++; if (got) tally.beacon[0]++; } else { tally[k][1]++; if (got) tally[k][0]++; } }
        }
        return { has, req, owner, tally, info };
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), m = model(), M = 12, lw = 96, W = st.W, pw = W - lw - M, X = s => lw + (s / N) * pw;
        const lanes = [['wifi', 'Wi-Fi', 200], ['ble', 'Bluetooth LE', 238], ['zb', '802.15.4', 286], ['radio', 'The transceiver', 150]];
        kit.label(c, 'Slots of 1 ms: who asks, who gets it (400 ms)', M, 12, { size: 12, weight: 650, color: C.text2 });
        const y0 = 30, lh = Math.min(66, (st.H - y0 - 60) / 4);
        lanes.forEach(([k, name, hue], i) => {
          const y = y0 + i * (lh + 6);
          kit.label(c, name, M, y + lh / 2, { size: 11.5, color: C.text2, weight: 600 });
          c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.04)'; c.fillRect(lw, y, pw, lh);
          if (k !== 'radio' && !m.has[k]) { kit.label(c, 'none on the ' + m.info.name, lw + pw / 2, y + lh / 2, { size: 11, align: 'center', color: C.faint }); return; }
          const sw = Math.max(1, pw / N);
          for (let s = 0; s < N; s++) {
            if (k === 'radio') { const o = m.owner[s]; if (o) { const hh = { wifi: 200, ble: 238, zb: 286 }[o]; c.fillStyle = kit.hue(hh); c.fillRect(X(s), y + 4, sw, lh - 8); } continue; }
            const r = m.req[k][s];
            if (!r) continue;
            const got = m.owner[s] === k;
            if (got) { c.fillStyle = kit.hue(hue); c.fillRect(X(s), y + 4, sw, lh - 8); }
            else { c.strokeStyle = C.bad; c.lineWidth = 1; c.strokeRect(X(s) + 0.5, y + 4.5, Math.max(1, sw - 1), lh - 9); }
          }
        });
        const yl = y0 + 4 * (lh + 6) + 4;
        kit.label(c, 'filled: got the slot · red outline: refused', M, yl, { size: 10.5, color: C.muted });
        kit.label(c, 'bottom lane: the colour of whoever owns each slot', M, yl + 15, { size: 10.5, color: C.muted });
        const pct = (a, b) => (b ? Math.round(100 * a / b) + ' % of the slots it asked for' : 'asked for nothing');
        const T = m.tally;
        ro.set('wifi', m.has.wifi ? 'data: ' + pct(T.wifi[0], T.wifi[1]) + (T.beacon[1] ? '; beacons: ' + T.beacon[0] + ' of ' + T.beacon[1] + ' slots' : '') : 'none on this chip');
        ro.set('ble', m.has.ble ? (ctl.values.ble === 'off' ? 'off' : pct(T.ble[0], T.ble[1])) : 'none on this chip');
        ro.set('zb', m.has.zb ? pct(T.zb[0], T.zb[1]) : 'none on this chip');
        ro.set('busy', Math.round(100 * m.owner.filter(Boolean).length / N) + ' % of the time');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ ic-power-domains */
  const DOMAIN_CHIPS = ['esp32', 'esp32-s3', 'esp32-c3', 'esp32-c6', 'esp32-h2', 'esp32-p4'];
  Hyper.sim('ic-power-domains', {
    title: 'The two islands of the chip',
    blurb: `The big *high-power* island holds the cores, the SRAM, the radio and the fast peripherals. The small *low-power* island stays alive in sleep. Lit boxes are powered; dim boxes are off. Figures are the catalogue's.

**Try this**
- Step through *active*, *light sleep* and *deep sleep* and watch the big island go dark.
- In **deep sleep** only RTC memory keeps its data, and the program restarts on wake.
- Pick the ESP32-C6 and the ESP32-C3: one has a low-power core in the small island, the other has none.
- Compare the deep-sleep currents of the chips.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.7, minH: 380, maxH: 480 });
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'Chip', options: DOMAIN_CHIPS.map(id => [E.chip(id).name, id]), value: 'esp32-c6' },
        { id: 'mode', type: 'select', label: 'Power mode', options: [['Active, radio on', 'active'], ['Light sleep', 'light'], ['Deep sleep', 'deep']], value: 'deep' },
        { id: 'lp', type: 'check', label: 'The low-power core is running (if the chip has one)', value: true }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['cur', 'Typical current (catalogue)'], ['keeps', 'What keeps its data'], ['wake', 'Resumes'], ['wakeby', 'Can wake it']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), info = E.chip(ctl.values.chip), mode = ctl.values.mode, M = 12, W = st.W, H = st.H;
        const hpOn = mode === 'active', ramOn = mode !== 'deep', cpuOn = mode === 'active';
        const big = { x: M, y: 26, w: W * 0.58, h: H - 40 }, sm = { x: big.x + big.w + 14, y: 26, w: W - big.x - big.w - 14 - M, h: H - 40 };
        kit.label(c, 'High-power island', big.x, 12, { size: 12, weight: 650, color: C.text2 });
        kit.label(c, 'Low-power island', sm.x, 12, { size: 12, weight: 650, color: C.text2 });
        c.save(); c.strokeStyle = hpOn ? kit.hue(150) : C.faint; c.lineWidth = 2; c.setLineDash(hpOn ? [] : [5, 4]); c.strokeRect(big.x, big.y, big.w, big.h); c.restore();
        c.save(); c.strokeStyle = kit.hue(212); c.lineWidth = 2; c.strokeRect(sm.x, sm.y, sm.w, sm.h); c.restore();
        const items = [];
        for (let k = 0; k < info.cores; k++) items.push([(/risc/i.test(info.arch) ? 'RISC-V' : 'Xtensa') + ' core ' + (k + 1), info.mhz + ' MHz at most', cpuOn, 8, false]);
        items.push(['SRAM', kbText(info.sram), ramOn, 150, mode === 'light']);
        items.push(['Radio', info.wifi || info.bt || info.ieee802154 ? 'Wi-Fi, Bluetooth …' : 'none on this chip', hpOn && !!(info.wifi || info.bt || info.ieee802154), 200, false]);
        items.push(['Fast peripherals', 'UART, SPI, I2C …', hpOn, 36, false]);
        const gridRows = Math.ceil(items.length / 2), bw = (big.w - 36) / 2, rowH = (big.h - 24) / gridRows;
        items.forEach((it, i) => S.box(c, big.x + 12 + (i % 2) * (bw + 12), big.y + 12 + Math.floor(i / 2) * rowH, bw, rowH - 8, { label: it[0], sub: it[1], color: it[2] ? kit.hue(it[3]) : C.faint, active: it[2], dash: it[4] || !it[2], size: W < 520 ? 9.5 : 11 }));
        // the small island
        const sh = (sm.h - 24) / 5;
        const sbox = (i, label, sub, on, hue) => S.box(c, sm.x + 8, sm.y + 8 + i * (sh + 2), sm.w - 16, sh - 4, { label, sub, color: kit.hue(hue), active: on, size: W < 520 ? 9.5 : 10.5 });
        sbox(0, 'Power control', 'switches the big island', true, 212);
        sbox(1, 'Slow clock', '≈ 150 kHz or 32 kHz', true, 280);
        sbox(2, 'RTC memory', kbText(info.rtcram || 0), true, 186);
        sbox(3, 'RTC pins', 'wake-capable', true, 150);
        sbox(4, info.lp ? 'Low-power core' : 'no low-power core', info.lp ? info.lp.replace(/ with its own.*/, '') : '', !!info.lp && ctl.values.lp, 8);
        const rx = info.rxMa, tx = info.txMa;
        ro.set('cur', mode === 'active' ? (rx != null ? 'radio receiving ' + rx + ' mA, transmitting ' + (tx != null ? tx + ' mA' : 'n/a') : 'no radio on this chip') : mode === 'light' ? (info.lightUa != null ? info.lightUa + ' µA' : 'not published') : (info.sleepUa != null ? info.sleepUa + ' µA' : 'not published'));
        ro.set('keeps', mode === 'active' ? 'everything' : mode === 'light' ? 'all RAM and the CPU state' : 'RTC memory only');
        ro.set('wake', mode === 'active' ? 'already running' : mode === 'light' ? 'at the next instruction' : 'from reset: ROM, bootloader, app, setup()');
        ro.set('wakeby', mode === 'active' ? '—' : mode === 'light' ? 'timer, any pin, UART and more' : 'timer, an RTC pin' + (info.touch ? ', touch' : '') + (info.lp ? ', the low-power core' : ''));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
