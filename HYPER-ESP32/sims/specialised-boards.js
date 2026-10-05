/* HYPER-ESP32 · sims/specialised-boards.js
 *
 * Simulations of "Boards built for a job" (topic code: sb).
 *
 *   sb-tdisplay-status   a T-Display drawn with its status screen: the battery divider switch, the power-on pin, USB
 *   sb-lora-anatomy      LoRa boards taken apart: ESP32, radio, OLED, antenna, battery; click a part
 *   sb-lora-airtime      spreading factor, bandwidth and payload against airtime, packets an hour and range
 *   sb-cam-flashing      flashing an ESP32-CAM: adapter wiring, the GPIO0 jumper, power, and when the mode is read
 *   sb-cyd-pins          the Cheap Yellow Display: which GPIOs its parts use and which are left
 *   sb-display-chooser   every display board of the catalogue by size, resolution, interface and touch
 *   sb-epaper-refresh    full against partial refresh, ghosting, and what an update interval does to a battery
 *   sb-relay-boot        what a relay does while the chip is still booting, and the strapping-pin trap
 *   sb-esp01-boot        the boot-mode pins of an ESP-01 and an ESP-12F
 *
 * Board facts come from the catalogue (kit.esp); the divider ratio, the airtime-to-range exponents, the e-paper
 * refresh times and the awake currents are teaching figures and the blurbs say so.
 */
(function () {
  'use strict';

  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const fmt = (v, d) => (Number.isFinite(v) ? v.toFixed(d == null ? 1 : d) : '—');
  const isNum = v => typeof v === 'number' && Number.isFinite(v);
  const shorten = (s, n) => { s = String(s == null ? '' : s); return s.length > n ? s.slice(0, n - 1) + '…' : s; };
  const isNarrow = box => (box && box.stage && box.stage.clientWidth ? box.stage.clientWidth : 760) < 520;
  /* a simple word wrap by character count -> lines */
  function wrap(str, n) {
    const words = String(str).split(/\s+/), lines = [];
    let cur = '';
    for (const w of words) { if ((cur + ' ' + w).trim().length > n && cur) { lines.push(cur); cur = w; } else cur = (cur + ' ' + w).trim(); }
    if (cur) lines.push(cur);
    return lines;
  }

  /* ================================================================ sb-tdisplay-status */
  const TD = {
    ttgo: { id: 'lilygo-ttgo-t-display', name: 'TTGO T-Display', w: 240, h: 135, adc: 34, sw: 14, power: null, usbBlocks: false },
    s3: { id: 'lilygo-t-display-s3', name: 'T-Display-S3', w: 320, h: 170, adc: 4, sw: null, power: 15, usbBlocks: true }
  };
  Hyper.sim('sb-tdisplay-status', {
    title: 'A T-Display and its status screen',
    blurb: `The picture is the screen of the board you choose, drawn the way a program would draw a status page. The chain beside it shows how the battery reaches the ADC. The divider ratio (a factor of two) is an assumption: the catalogue does not give the resistor values.

**Try this**
- On the **TTGO T-Display**, switch off *Program drives the switch*: the divider is disconnected and the battery reads zero, although the cell is full.
- Choose the **T-Display-S3** and unplug USB-C with the power-on pin off: the screen is dark. With USB-C plugged in it lights anyway, which is how the omission slips through testing.
- On the S3 with USB-C plugged in, the battery cannot be read at all.
- Slide the voltage down to 3.3 V and watch the charge estimate: it is a rough gauge, not a measurement.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym, G = kit.gfx;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { aspect: 1.2, minH: 460, maxH: 640 } : { aspect: 0.58, maxH: 480 });
      let b1 = 0, b2 = 0;
      const ctl = kit.controls(box.side, [
        { id: 'board', type: 'select', label: 'Board', options: [['TTGO T-Display (ESP32)', 'ttgo'], ['T-Display-S3', 's3']], value: 'ttgo' },
        { id: 'v', label: 'Battery voltage', min: 3, max: 4.2, step: 0.01, value: 3.74, unit: 'V' },
        { id: 'rssi', label: 'Wi-Fi signal', min: -90, max: -30, step: 1, value: -62, unit: 'dBm' },
        { id: 'en', type: 'check', label: 'Program drives GPIO14 (TTGO) or GPIO15 (S3)', value: true },
        { id: 'usb', type: 'check', label: 'USB-C plugged in', value: true },
        { type: 'buttons', items: [{ id: 'b1', label: 'Press button 1' }, { id: 'b2', label: 'Press button 2' }] }
      ], id => { if (id === 'b1') b1++; if (id === 'b2') b2++; loop.once(); });
      const ro = kit.readout(box.side, [['board', 'Board'], ['screen', 'Screen'], ['pin', 'Battery pin'], ['bat', 'Battery'], ['says', 'So']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const v = ctl.values, d = TD[v.board] || TD.ttgo, bd = E.board(d.id), M = 10;
        const vb = +v.v, pinMv = Math.round(vb * 1000 / 2);          // a divider of two equal resistors (assumed)
        const screenOn = d.power == null ? true : !!(v.en || v.usb);
        let state = 'ok', mv = pinMv * 2;
        if (d.sw != null && !v.en) { state = 'off'; mv = 0; }
        if (d.usbBlocks && v.usb) { state = 'usb'; mv = null; }
        const frac = mv ? E.lipoSoc(mv / 1000) : 0;
        // the screen, as a program would fill it
        const fb = G.fb(d.w, d.h, { depth: 16 });
        fb.fillRect(0, 0, d.w, d.h, screenOn ? 0x0b1020 : 0x000000);
        if (screenOn) {
          fb.fillRect(0, 0, d.w, 20, 0x1f3a8a);
          fb.text('STATUS', 6, 3, { size: 2, color: 0xffffff });
          const bars = [-85, -75, -65, -55];
          bars.forEach((t, i) => fb.fillRect(d.w - 30 + i * 6, 16 - (4 + i * 3), 4, 4 + i * 3, v.rssi > t ? 0xffffff : 0x4a5a8a));
          fb.text('Battery', 6, 30, { size: 2, color: 0xaab4d8 });
          fb.rect(6, 50, d.w - 12, 14, 0xaab4d8);
          if (mv) fb.fillRect(8, 52, Math.max(1, Math.round((d.w - 16) * frac)), 10, frac < 0.15 ? 0xe5484d : frac < 0.35 ? 0xe0a030 : 0x22b37a);
          const line = state === 'usb' ? 'n/a: USB-C in' : state === 'off' ? '0 mV: switch off' : fmt(mv / 1000, 2) + ' V  ' + Math.round(frac * 100) + ' %';
          fb.text(line, 6, 70, { size: 2, color: 0xffffff });
          fb.text('B1 ' + b1 + '   B2 ' + b2, 6, d.h - 24, { size: 2, color: 0xaab4d8 });
        }
        const avail = narrow ? st.W - 2 * M - 8 : st.W * 0.56;
        const scale = Math.max(1, Math.floor(avail / d.w * 2) / 2);
        kit.label(c, d.name + (bd ? ' · ' + (E.chip(bd.chip) || {}).name : ''), M + 4, 14, { size: 12, weight: 650 });
        const r = G.draw(c, fb, M + 4, 30, scale, { style: 'tft' });
        if (!screenOn) kit.label(c, 'screen dark: the power-on pin is low on a battery', r.x, r.y + r.h + 16, { size: 11, color: C.warn });
        // the battery chain
        const dx = narrow ? M : r.x + r.w + 30, dy = narrow ? r.y + r.h + (screenOn ? 22 : 36) : 30, dw = narrow ? st.W - 2 * M : st.W - dx - M;
        const bh = clamp((st.H - dy - M) / 4 - 14, 24, 40), gap = 14;
        const items = [
          { label: 'Lithium cell', sub: fmt(vb, 2) + ' V', color: kit.hue(140), on: true },
          { label: 'Divider ÷ 2', sub: 'assumed 100 k + 100 k', color: kit.hue(212), on: true },
          d.sw != null ? { label: 'Switch GPIO' + d.sw, sub: v.en ? 'driven: on' : 'not driven: off', color: v.en ? kit.hue(140) : C.bad, on: !!v.en }
            : { label: 'USB-C', sub: v.usb ? 'plugged in: blocks the reading' : 'unplugged', color: v.usb ? C.bad : kit.hue(140), on: !v.usb },
          { label: 'ADC GPIO' + d.adc, sub: state === 'ok' ? pinMv + ' mV' : state === 'off' ? 'about 0 mV' : 'cannot read', color: state === 'ok' ? kit.hue(48) : C.bad, on: state === 'ok' }
        ];
        items.forEach((it, i) => {
          const y = dy + i * (bh + gap);
          S.box(c, dx, y, dw, bh, { label: it.label, sub: it.sub, color: it.color, active: it.on, size: 12 });
          if (i < items.length - 1) S.wire(c, [[dx + dw / 2, y + bh], [dx + dw / 2, y + bh + gap]], { color: it.on ? C.muted : C.faint, dash: !it.on });
        });
        // the read-outs
        ro.set('board', d.name + ' · ' + (bd ? (E.chip(bd.chip) || {}).name : ''));
        ro.set('screen', bd ? shorten(bd.display, 72) : '—');
        ro.set('pin', 'GPIO' + d.adc + (d.sw != null ? ', behind a switch on GPIO' + d.sw : ', not readable on USB-C'));
        ro.set('bat', state === 'ok' ? fmt(mv / 1000, 2) + ' V · about ' + Math.round(frac * 100) + ' % charge' : state === 'off' ? 'reads 0 V' : 'no reading');
        ro.set('says', !screenOn ? 'The screen stays dark: GPIO15 is not driven high.' : state === 'off' ? 'The divider is disconnected until GPIO14 is driven.' : state === 'usb' ? 'Read the battery only while USB-C is unplugged.' : 'All as expected: the divider is on, so the reading is the cell.');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sb-lora-anatomy */
  const LORA = [
    { id: 'lilygo-lora32-v1-6-1', short: 'LilyGO LoRa32 V1.6.1', radio: 'SX1276 or SX1278', band: '868/915 MHz (SX1276) or 433 MHz (SX1278)' },
    { id: 'lilygo-t-beam-v1-2', short: 'LilyGO T-Beam v1.2', radio: 'SX1276, SX1278 or SX1262, by variant', band: 'SX1276 868/915 MHz, SX1278 433 MHz, SX1262 400–520 or 830–945 MHz' },
    { id: 'heltec-wifi-lora-32-v3', short: 'Heltec WiFi LoRa 32 V3', radio: 'SX1262', band: '863–928 MHz or 470–510 MHz versions' },
    { id: 'lilygo-t3-s3', short: 'LilyGO T3-S3', radio: 'SX1262, SX1276, SX1278, SX1280 or LR1121, by version', band: 'by version; the SX1280 is 2.4 GHz' }
  ];
  const numPins = (b, re, strip) => {
    const out = Object.entries(b.pins || {}).filter(([k, v]) => re.test(k) && isNum(v)).map(([k, v]) => k.replace(strip || /^$/, '') + ' ' + v);
    return out.length ? out.join(' · ') : 'not in the catalogue record';
  };
  const watchFor = (b, re) => {
    const w = (b.watch || []).filter(x => re.test(x));
    return w.length ? w.slice(0, 2).join(' | ') : 'nothing special recorded for this part';
  };
  Hyper.sim('sb-lora-anatomy', {
    title: 'A LoRa board taken apart',
    blurb: `Pick a board and **click a part**. The text comes from the board's catalogue record: the radio chips it is sold with, the pins the record gives, and what the record says to watch for.

**Try this**
- Click the **radio** on each board: the chip and band change from board to board, and so does the pin set (an SX1262 has a BUSY line, an SX1276 does not).
- Click the **antenna** and read why the Wi-Fi antenna cannot serve it.
- On the **Heltec V3** the catalogue gives no radio pins; compare with the LoRa32, which does.
- On the **T-Beam** click the GNSS receiver and read the strapping-pin warning.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { aspect: 1.0, minH: 400, maxH: 560 } : { aspect: 0.6, maxH: 460 });
      let sel = 'radio', hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'board', type: 'select', label: 'Board', options: LORA.map(x => [x.short, x.id]), value: LORA[0].id }
      ], () => { loop.once(); });
      const ro = kit.readout(box.side, [['part', 'Part'], ['facts', 'Facts'], ['pins', 'Pins'], ['watch', 'Watch for']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const meta = LORA.find(x => x.id === ctl.values.board) || LORA[0], b = E.board(meta.id);
        if (!b) return;
        const chip = E.chip(b.chip) || { name: b.chip, cores: 1, mhz: 0 };
        // the parts of this board, in the order they are laid out
        const parts = [
          { id: 'mcu', label: chip.name, sub: 'Wi-Fi + Bluetooth LE', hue: 212 },
          { id: 'radio', label: meta.radio.length > 22 ? 'LoRa radio' : meta.radio, sub: meta.radio.length > 22 ? 'by variant' : 'LoRa', hue: 8 }
        ];
        if (b.display) parts.push({ id: 'oled', label: 'OLED', sub: '128 × 64', hue: 186 });
        if ((b.has || []).includes('gnss')) parts.push({ id: 'gnss', label: 'GNSS', sub: 'position', hue: 140 });
        if ((b.has || []).includes('sd')) parts.push({ id: 'sd', label: 'microSD', sub: 'storage', hue: 48 });
        parts.push({ id: 'battery', label: 'Battery', sub: 'charger', hue: 100 });
        parts.push({ id: 'usb', label: 'USB', sub: 'programming', hue: 280 });
        const M = 12, bx = M, by = M + 14, bw = narrow ? st.W - 2 * M - 84 : st.W * 0.62, rows = Math.ceil(parts.length / 2);
        const bh = Math.min(st.H - by - M - (narrow ? 56 : 8), rows * 66 + 20);
        kit.label(c, meta.short, bx, M + 2, { size: 12.5, weight: 650 });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.05)'; c.strokeStyle = C.faint; c.lineWidth = 1;
        c.beginPath(); c.rect(bx, by, bw, bh); c.fill(); c.stroke();
        hits = [];
        const cw = (bw - 30) / 2, ch = Math.min(52, (bh - 20 - (rows - 1) * 10) / rows);
        parts.forEach((p, i) => {
          const x = bx + 10 + (i % 2) * (cw + 10), y = by + 10 + Math.floor(i / 2) * (ch + 10);
          S.box(c, x, y, cw, ch, { label: p.label, sub: p.sub, color: kit.hue(p.hue), active: sel === p.id, size: 12 });
          hits.push({ x, y, w: cw, h: ch, id: p.id });
        });
        // the antennas: the LoRa one on its own connector
        const ax = bx + bw + (narrow ? 46 : 60), ay = by + 80;
        S.antenna(c, ax, ay, 46);
        c.strokeStyle = sel === 'antenna' ? C.accent : C.muted; c.lineWidth = sel === 'antenna' ? 2 : 1;
        c.beginPath(); c.arc(ax, ay - 46, 16, 0, Math.PI * 2); c.stroke();
        S.radio(c, ax, ay - 46, { r: 14, phase: 0.5 });
        kit.label(c, 'LoRa antenna', ax, ay + 12, { size: 10.5, color: sel === 'antenna' ? C.accent : C.text2, align: 'center' });
        kit.label(c, '(own connector)', ax, ay + 25, { size: 9.5, color: C.faint, align: 'center' });
        hits.push({ x: ax - 36, y: ay - 70, w: 72, h: 110, id: 'antenna' });
        kit.label(c, 'Wi-Fi and Bluetooth: the board\'s own antenna', bx, by + bh + 16, { size: 10.5, color: C.muted });
        // the read-out for the selected part
        const info = {
          mcu: { t: chip.name, f: (chip.cores || 1) + ' core' + ((chip.cores || 1) > 1 ? 's' : '') + (chip.mhz ? ' at up to ' + chip.mhz + ' MHz' : '') + ' · flash ' + (b.flash || 'not stated') + ' · PSRAM ' + (b.psram || 'none listed'), p: numPins(b, /I2C_/), w: watchFor(b, /strapping|GPIO12|flash/i) },
          radio: { t: 'LoRa radio: ' + meta.radio, f: 'Band: ' + meta.band + '. Talks SPI to the ESP32.', p: numPins(b, /^LORA_/, /^LORA_/), w: watchFor(b, /radio|band|LoRa|DIO|reset|V3|V2|TCXO/i) },
          oled: { t: 'OLED display', f: shorten(b.display, 110), p: numPins(b, /OLED|I2C_/), w: watchFor(b, /OLED|Vext/i) },
          gnss: { t: 'GNSS receiver', f: 'A satellite-positioning receiver on a serial port.', p: numPins(b, /GPS|GNSS/), w: watchFor(b, /GNSS|GPIO12|strapping/i) },
          sd: { t: 'microSD slot', f: 'Card storage on its own SPI pins.', p: numPins(b, /^SD_/, /^SD_/), w: watchFor(b, /SD|GPIO2|GPIO13/i) },
          battery: { t: 'Battery and charger', f: shorten(b.battery, 110), p: numPins(b, /BATT|ADC_Ctrl|adc_ctrl|battery_adc/i), w: watchFor(b, /batter|PMU|VBAT|ADC_Ctrl/i) },
          usb: { t: 'USB port', f: ((b.usb && b.usb.conn) || 'USB') + ' · ' + ((b.usb && b.usb.bridge) || 'bridge not stated'), p: 'UART0 or native USB', w: watchFor(b, /USB|flash/i) },
          antenna: { t: 'LoRa antenna connector', f: 'The radio has its own antenna connector, for the band you bought. The Wi-Fi and Bluetooth antenna cannot serve it: the bands and lengths differ.', p: '—', w: watchFor(b, /antenna/i) }
        }[sel] || { t: '—', f: '—', p: '—', w: '—' };
        ro.set('part', info.t); ro.set('facts', info.f); ro.set('pins', info.p); ro.set('watch', shorten(info.w, 220));
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { sel = h.id; loop.once(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ sb-lora-airtime */
  const ENV = [['open country, line of sight (n = 2.2)', 2.2], ['suburbs (n = 3)', 3], ['city (n = 3.5)', 3.5]];
  const fmtTime = t => (t < 1 ? fmt(t * 1000, t < 0.1 ? 1 : 0) + ' ms' : fmt(t, t < 10 ? 2 : 1) + ' s');
  const fmtDist = m => (m < 1000 ? Math.round(m) + ' m' : m < 1e6 ? fmt(m / 1000, m < 1e4 ? 1 : 0) + ' km' : 'over 1000 km');
  Hyper.sim('sb-lora-airtime', {
    title: 'LoRa: airtime, packets an hour and range',
    blurb: `The bars show, for every spreading factor, the airtime of one packet and the range at a 10 dB fade margin, for the settings on the right. The antennas are taken as 2 dBi each. The path-loss exponents are teaching values: real range depends on terrain, height and antennas, and can differ by a factor of several.

**Try this**
- Move the **spreading factor** from 7 to 12: the airtime grows about fortyfold and the range grows too. The packets an hour under a 1 % limit fall from hundreds to a few tens.
- Widen the **bandwidth** to 500 kHz: packets get short and fast, and the range shrinks.
- Raise the **payload**: airtime grows in steps, not smoothly.
- Switch **Surroundings** to *city* and see how little of the free-space range is left.`,
    mount(box, kit) {
      const E = kit.esp;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { aspect: 1.3, minH: 480, maxH: 660 } : { aspect: 0.6, maxH: 440 });
      const ctl = kit.controls(box.side, [
        { id: 'sf', label: 'Spreading factor', min: 7, max: 12, step: 1, value: 9, fmt: v => 'SF' + v },
        { id: 'bw', type: 'select', label: 'Bandwidth', options: [['125 kHz', 125e3], ['250 kHz', 250e3], ['500 kHz', 500e3]], value: 125e3 },
        { id: 'bytes', label: 'Payload', min: 1, max: 222, step: 1, value: 20, unit: 'bytes' },
        { id: 'cr', type: 'select', label: 'Coding rate', options: [['4/5', 1], ['4/6', 2], ['4/7', 3], ['4/8', 4]], value: 1 },
        { id: 'mhz', type: 'select', label: 'Band', options: [['868 MHz (Europe)', 868], ['915 MHz (Americas)', 915], ['433 MHz', 433]], value: 868 },
        { id: 'tx', label: 'Transmit power', min: 2, max: 20, step: 1, value: 14, unit: 'dBm' },
        { id: 'env', type: 'select', label: 'Surroundings', options: ENV, value: 3 },
        { id: 'duty', type: 'select', label: 'Duty-cycle limit', options: [['1 %', 0.01], ['10 %', 0.1], ['none', 1]], value: 0.01 }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['toa', 'Time on air'], ['rate', 'Bit rate'], ['sens', 'Receiver sensitivity'], ['pph', 'Packets an hour'], ['range', 'Range']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const per = [];
        for (let sf = 7; sf <= 12; sf++) {
          const r = E.lora({ sf, bw: +v.bw, cr: +v.cr, bytes: +v.bytes });
          const range = E.linkRange({ tx: +v.tx, gt: 2, gr: 2, mhz: +v.mhz, n: +v.env, sens: r.sensitivity, margin: 10 });
          per.push({ sf, t: r.t, range, r });
        }
        const M = 12, gapX = 18, cw = narrow ? st.W - 2 * M : (st.W - 2 * M - gapX) / 2, chH = narrow ? (st.H - 3 * M - 50) / 2 : st.H - 2 * M - 26;
        const drawChart = (x, y, title, key, lo, hi, fmtV, hue) => {
          kit.label(c, title, x, y + 6, { size: 12, weight: 650 });
          const top = y + 24, rowH = (chH - 26) / 6, lw = 34, bw0 = cw - lw - 8;
          per.forEach((p, i) => {
            const yy = top + i * rowH, val = clamp(p[key], lo, hi), f = clamp(Math.log(val / lo) / Math.log(hi / lo), 0.02, 1), cur = p.sf === +v.sf;
            kit.label(c, 'SF' + p.sf, x, yy + rowH / 2, { size: 11, weight: cur ? 700 : 500, color: cur ? C.accent : C.muted });
            c.fillStyle = cur ? C.accent : kit.hue(hue, 0.5);
            c.fillRect(x + lw, yy + 3, bw0 * f, rowH - 6);
            const txt = fmtV(p[key]), inside = bw0 * f > 70;
            kit.label(c, txt, inside ? x + lw + bw0 * f - 4 : x + lw + bw0 * f + 4, yy + rowH / 2, { size: 10.5, color: inside ? (cur ? '#fff' : C.text) : C.text2, align: inside ? 'right' : 'left', weight: cur ? 700 : 500 });
          });
        };
        drawChart(M, M, 'Airtime of one packet', 't', 0.01, 20, fmtTime, 28);
        drawChart(narrow ? M : M + cw + gapX, narrow ? M + chH + M : M, 'Range at 10 dB margin', 'range', 100, 3e5, fmtDist, 150);
        kit.label(c, 'log scales · antennas 2 dBi each · ' + (+v.tx) + ' dBm', M, st.H - 10, { size: 10, color: C.faint });
        const cur = per[+v.sf - 7] || per[0];
        ro.set('toa', fmtTime(cur.t) + ' (preamble ' + fmtTime(cur.r.tPreamble) + ', ' + cur.r.nPayload + ' symbols of data)');
        ro.set('rate', fmt(cur.r.bitrate, 0) + ' bit/s');
        ro.set('sens', fmt(cur.r.sensitivity, 1) + ' dBm');
        const limit = +v.duty, n = E.dutyLimit(cur.t, limit);
        ro.set('pph', limit >= 1 ? 'no limit: up to ' + Math.floor(3600 / cur.t) + ' an hour' : n + ' under the ' + Math.round(limit * 100) + ' % limit, one every ' + fmt(3600 / Math.max(1, n), 1) + ' s');
        ro.set('range', 'about ' + fmtDist(cur.range) + ' (teaching exponent)');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sb-cam-flashing */
  Hyper.sim('sb-cam-flashing', {
    title: 'Flashing an ESP32-CAM',
    blurb: `The ESP32-CAM has no USB and no BOOT button, so a USB-serial adapter is wired to it by hand. The pads are those of the catalogue's pin list. **The jumper is read only at the instant of reset**: change it, then press RST, as you would on the bench.

**Try this**
- Wire everything correctly, leave the jumper off and look at *An upload now*: the chip is running, not waiting.
- Fit the jumper, press **RST**, and the chip is in download mode. Then take the jumper off *without* pressing RST: the mode does not change.
- Swap the **TX** wire to U0T: the serial lines are no longer crossed and nothing connects.
- Power it from the adapter's **3.3 V** pin and watch the program stage fail.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { aspect: 1.25, minH: 460, maxH: 640 } : { aspect: 0.62, maxH: 460 });
      let latched = false;
      const ctl = kit.controls(box.side, [
        { id: 'tx', type: 'select', label: 'Adapter TX goes to', options: [['U0R (GPIO3)', 'r'], ['U0T (GPIO1)', 't']], value: 'r' },
        { id: 'rx', type: 'select', label: 'Adapter RX goes to', options: [['U0T (GPIO1)', 't'], ['U0R (GPIO3)', 'r']], value: 't' },
        { id: 'pw', type: 'select', label: 'Power', options: [['5V pin, supply good for 500 mA', 'good'], ['5V pin, weak adapter', 'weak'], ['3.3 V pin of the adapter', 'v33']], value: 'good' },
        { id: 'jump', type: 'check', label: 'Jumper: GPIO0 to GND', value: false },
        { type: 'buttons', items: [{ id: 'rst', label: 'Press RST', primary: true }] }
      ], id => { if (id === 'rst') latched = !!ctl.values.jump; loop.once(); });
      const ro = kit.readout(box.side, [['mode', 'Mode at the last reset'], ['up', 'An upload now'], ['next', 'At the next reset']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const b = E.board('esp32-cam-ai-thinker');
        const hd = (b && b.headers) || [];
        const left = (hd.find(h => h.side === 'left') || { pins: ['GND', 'U0T=1', 'U0R=3', 'VCC', 'GND', '0', '16', '3V3'] }).pins.map(p => E.parsePin(p));
        const right = (hd.find(h => h.side === 'right') || { pins: ['4', '2', '14', '15', '13', '12', 'GND', '5V'] }).pins.map(p => E.parsePin(p));
        const M = 12, W = st.W;
        const aw = narrow ? 78 : Math.min(150, W * 0.2), bw = narrow ? 118 : Math.min(190, W * 0.26);
        const bx = narrow ? W - M - bw - 40 : W * 0.5 - bw / 2 + 20, by = M + 28, bhh = Math.min(st.H * 0.55, 8 * 24 + 40);
        const pitch = clamp((bhh - 40) / 8, 14, 24), py = i => by + 30 + (i + 0.5) * pitch;
        const ax = M, ay = by + 10, ah = Math.min(bhh - 20, 150);
        const apins = [['5V', 'good'], ['3V3', 'n'], ['GND', 'n'], ['TX', 'n'], ['RX', 'n']], ap = i => ay + 28 + (i + 0.5) * ((ah - 34) / 5);
        const okSerial = v.tx === 'r' && v.rx === 't';
        const colTx = v.tx === 'r' ? C.ok : C.bad, colRx = v.rx === 't' ? C.ok : C.bad;
        const colPw = v.pw === 'good' ? C.ok : v.pw === 'weak' ? C.warn : C.bad;
        // the boxes
        kit.label(c, 'USB-serial adapter', ax, by + 2, { size: 11, weight: 650 });
        S.box(c, ax, ay, aw, ah, { color: kit.hue(212) });
        apins.forEach(([nm], i) => { kit.dot(c, ax + aw, ap(i), 3.5, '#e9c46a'); kit.label(c, nm, ax + aw - 8, ap(i), { size: 10.5, align: 'right' }); });
        kit.label(c, 'ESP32-CAM', bx, by + 2, { size: 11, weight: 650 });
        S.box(c, bx, by + 14, bw, 8 * pitch + 24, { color: kit.hue(150) });
        const lab = p => (p.gpio != null && p.label !== String(p.gpio) ? p.label : p.gpio != null ? 'GPIO' + p.gpio : p.label);
        left.forEach((p, i) => { kit.dot(c, bx, py(i), 3.5, '#e9c46a'); kit.label(c, lab(p), bx + 8, py(i), { size: 10.5 }); });
        right.forEach((p, i) => { kit.dot(c, bx + bw, py(i), 3.5, '#e9c46a'); kit.label(c, lab(p), bx + bw - 8, py(i), { size: 10.5, align: 'right' }); });
        const iU0T = left.findIndex(p => p.label === 'U0T'), iU0R = left.findIndex(p => p.label === 'U0R'), iGnd = left.findIndex(p => p.label === 'GND');
        const iG0 = left.findIndex(p => p.gpio === 0), iG0n = left.findIndex((p, i) => i === iG0 - 1 && p.label === 'GND');
        const i3v3 = left.findIndex(p => p.label === '3V3'), i5v = right.findIndex(p => p.label === '5V');
        const wire = (pts, color) => S.wire(c, pts, { color });
        wire([[ax + aw, ap(2)], [ax + aw + 56, ap(2)], [ax + aw + 56, py(Math.max(0, iGnd))], [bx, py(Math.max(0, iGnd))]], C.muted);
        const tIdx = v.tx === 'r' ? iU0R : iU0T, rIdx = v.rx === 't' ? iU0T : iU0R;
        wire([[ax + aw, ap(3)], [ax + aw + 14, ap(3)], [ax + aw + 14, py(tIdx)], [bx, py(tIdx)]], colTx);
        wire([[ax + aw, ap(4)], [ax + aw + 28, ap(4)], [ax + aw + 28, py(rIdx)], [bx, py(rIdx)]], colRx);
        if (v.pw === 'v33') wire([[ax + aw, ap(1)], [ax + aw + 42, ap(1)], [ax + aw + 42, py(i3v3)], [bx, py(i3v3)]], colPw);
        else { const top = by - 4, rx0 = bx + bw + 26; wire([[ax + aw, ap(0)], [ax + aw + 70, ap(0)], [ax + aw + 70, top], [rx0, top], [rx0, py(i5v)], [bx + bw, py(i5v)]], colPw); }
        kit.label(c, v.pw === 'v33' ? '3V3 (weak)' : '5V', ax + aw + 74, ap(0) - 10, { size: 9.5, color: colPw });
        // the jumper between GPIO0 and the GND beside it
        if (iG0 >= 0 && iG0n >= 0) {
          c.strokeStyle = v.jump ? C.warn : C.faint; c.lineWidth = v.jump ? 3 : 1.4; c.setLineDash(v.jump ? [] : [3, 3]);
          c.beginPath(); c.moveTo(bx, py(iG0n)); c.lineTo(bx - 12, py(iG0n)); c.lineTo(bx - 12, py(iG0)); c.lineTo(bx, py(iG0)); c.stroke(); c.setLineDash([]);
          kit.label(c, v.jump ? 'jumper on' : 'jumper off', bx - 16, (py(iG0n) + py(iG0)) / 2, { size: 9.5, color: v.jump ? C.warn : C.faint, align: 'right' });
        }
        // the three outcomes
        const mode = latched ? ['Download mode', 'GPIO0 low at reset', C.ok, 'GPIO0 was low at the last reset'] : ['Runs the program', 'GPIO0 high at reset', C.accent, 'GPIO0 was high at the last reset'];
        const up = !okSerial ? ['Failed to connect', 'TX and RX must cross', C.bad, 'the adapter TX must reach the board receive pin, and the reverse']
          : !latched ? ['Failed to connect', 'chip is running', C.bad, 'the chip is running its program, not waiting for esptool']
          : v.pw !== 'good' ? ['Upload may fail', 'supply sags', C.warn, 'the supply sags under load and the upload may time out'] : ['Upload works', 'esptool connects', C.ok, 'esptool connects and writes the program'];
        const next = v.jump ? ['Waits for an upload', 'GPIO0 still on GND', C.warn, 'GPIO0 is still tied to ground, so the chip waits for another upload']
          : v.pw !== 'good' ? ['Brownout resets', 'camera needs more', C.bad, 'the supply sags as the camera and Wi-Fi start, and the chip resets']  : ['Camera program runs', 'GPIO0 high at reset', C.ok, 'GPIO0 is high at reset, so the program in flash starts'];
        const oy = by + 14 + 8 * pitch + 24 + 18, oh = clamp(st.H - oy - M, 30, 46);
        const ow = narrow ? (W - 2 * M - 2 * 6) / 3 : (W - 2 * M - 2 * 10) / 3;
        [['Mode', mode], ['An upload now', up], ['Next reset', next]].forEach(([t, o], i) => {
          const x = M + i * (ow + (narrow ? 6 : 10));
          kit.label(c, t, x, oy - 8, { size: 10, color: C.muted });
          S.box(c, x, oy, ow, oh, { label: o[0], sub: o[1], color: o[2], active: true, size: narrow ? 10 : 11.5 });
        });
        ro.set('mode', mode[0] + ': ' + mode[3] + (!!v.jump !== latched ? '. The jumper changed since: press RST to apply it.' : ''));
        ro.set('up', up[0] + ': ' + up[3]);
        ro.set('next', next[0] + ': ' + next[3]);
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sb-cyd-pins */
  const CYD_GPIOS = [0, 1, 2, 3, 4, 5, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 23, 25, 26, 27, 32, 33, 34, 35, 36, 39];   // the 26 usable pins of an ESP32-WROOM-32
  const CYD_CONNECTOR = [1, 3, 22, 27, 35];                                        // free pins that reach a connector (P1, P3, CN1)
  const CYD_GROUPS = [
    { id: 'tft', label: 'display', hue: 212, re: /^TFT_/, can: false },
    { id: 'touch', label: 'touch', hue: 28, re: /^XPT2046_/, can: true, off: 'noTouch' },
    { id: 'sd', label: 'SD card', hue: 48, re: /^SD_(CS|SCK|MISO|MOSI)/, can: true, off: 'noSd' },
    { id: 'led', label: 'RGB LED', hue: 330, re: /^LED_/, can: true, off: 'noLed' },
    { id: 'ldr', label: 'light sensor', hue: 100, re: /^LDR$/, can: false },
    { id: 'spk', label: 'speaker', hue: 280, re: /^SPEAKER$/, can: true, off: 'noSpk' },
    { id: 'boot', label: 'BOOT', hue: 0, re: /^BOOT$/, can: false }
  ];
  Hyper.sim('sb-cyd-pins', {
    title: 'The Cheap Yellow Display: what is left',
    blurb: `Every tile is one of the 26 usable GPIOs of the ESP32 module on the Cheap Yellow Display, coloured by the part that owns it in the catalogue's pin list. A bright tile with a dashed edge is free; a small "conn" mark means it reaches a connector. **Click a tile** to read what the catalogue says about the pin.

**Try this**
- Count the free tiles with everything in use: five. Only GPIO22 and GPIO27 are free outputs.
- Tick **No SD card**, **No touch** and so on, and watch the free pins grow.
- Colour by **strapping pins**: the display's lines sit on several of them.
- Colour by **input only**: GPIO34, 35, 36 and 39 can never drive anything.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { aspect: 1.1, minH: 420, maxH: 560 } : { aspect: 0.56, maxH: 420 });
      let sel = 22, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'mark', type: 'select', label: 'Colour by', options: [['the part that uses the pin', 'owner'], ['strapping pins', 'strap'], ['ADC2 pins (clash with Wi-Fi)', 'adc2'], ['input-only pins', 'input']], value: 'owner' },
        { id: 'noSd', type: 'check', label: 'No SD card', value: false },
        { id: 'noTouch', type: 'check', label: 'No touch', value: false },
        { id: 'noLed', type: 'check', label: 'No RGB LED', value: false },
        { id: 'noSpk', type: 'check', label: 'No speaker', value: false }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['used', 'Pins in use'], ['free', 'Free pins'], ['sel', 'Selected'], ['says', 'The catalogue says']]);
      const b0 = E.board('esp32-2432s028r');
      const owner = {};
      if (b0) for (const [k, val] of Object.entries(b0.pins || {})) {
        if (!isNum(val)) continue;
        const g = CYD_GROUPS.find(x => x.re.test(k));
        if (g && owner[val] == null) owner[val] = g;
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        const own = n => { const g = owner[n]; return g && !(g.off && v[g.off]) ? g : null; };
        const M = 10, cols = narrow ? 5 : 9, gap = 6, tw = (st.W - 2 * M - (cols - 1) * gap) / cols, rows = Math.ceil(CYD_GPIOS.length / cols);
        const th = clamp((st.H - 2 * M - 70) / rows - gap, 30, 54);
        hits = [];
        let usedN = 0; const free = [];
        CYD_GPIOS.forEach((n, i) => {
          const x = M + (i % cols) * (tw + gap), y = M + Math.floor(i / cols) * (th + gap), g = own(n), pn = E.pin('esp32', n) || {};
          if (g) usedN++; else free.push(n);
          let hue = g ? g.hue : null, flag = false;
          if (v.mark === 'strap') { flag = !!pn.strap; hue = flag ? 40 : null; }
          if (v.mark === 'adc2') { flag = /^ADC2/.test(pn.adc || ''); hue = flag ? 8 : null; }
          if (v.mark === 'input') { flag = pn.dir === 'I'; hue = flag ? 280 : null; }
          const lit = v.mark === 'owner' ? !!g : flag;
          S.box(c, x, y, tw, th, { label: String(n), sub: v.mark === 'owner' ? (g ? g.label : CYD_CONNECTOR.includes(n) ? 'free · conn' : 'free') : (flag ? 'yes' : '—'), color: lit ? kit.hue(hue) : C.faint, active: lit || sel === n, dash: v.mark === 'owner' && !g, size: 12.5 });
          if (sel === n) { c.strokeStyle = C.accent; c.lineWidth = 2; c.strokeRect(x - 1.5, y - 1.5, tw + 3, th + 3); }
          hits.push({ x, y, w: tw, h: th, n });
        });
        // the legend
        const ly = M + rows * (th + gap) + 8; let lx = M, lr = 0;
        for (const g of CYD_GROUPS) {
          const iw = 26 + g.label.length * 6;
          if (lx + iw > st.W - M && lx > M) { lx = M; lr++; }
          c.fillStyle = kit.hue(g.hue, 0.7); c.fillRect(lx, ly + lr * 16 - 5, 10, 10); kit.label(c, g.label, lx + 14, ly + lr * 16, { size: 10, color: C.muted }); lx += iw;
        }
        ro.set('used', usedN + ' of ' + CYD_GPIOS.length);
        ro.set('free', free.length ? free.map(n => 'GPIO' + n + (pinOnlyIn(n) ? ' (in)' : '')).join(', ') : 'none');
        const pn = E.pin('esp32', sel) || {}, g = own(sel);
        ro.set('sel', 'GPIO' + sel + ' · ' + (g ? 'used by the ' + g.label : 'free') + (CYD_CONNECTOR.includes(sel) && !g ? ' · on a connector' : ''));
        const vd = E.pinVerdict('esp32', sel);
        ro.set('says', vd ? shorten(vd.text, 150) : '—');
        function pinOnlyIn(n) { const q = E.pin('esp32', n); return !!(q && q.dir === 'I'); }
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { sel = h.n; loop.once(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ sb-display-chooser */
  const BUS_HUE = { SPI: 212, parallel: 28, QSPI: 150, RGB: 330, 'MIPI-DSI': 280, I2C: 60, other: 0 };
  /* the facts of a board's screen, read from its catalogue record: -> null when the record gives no size or resolution */
  function parseScreen(b) {
    const d = b.display;
    if (!d) return null;
    const main = String(d).split(/;\s*touch:/i)[0];
    const sz = main.match(/(\d+(?:\.\d+)?)\s*″/), rs = main.match(/(\d{2,4})\s*[×x]\s*(\d{2,4})/);
    if (!sz || !rs) return null;
    const inch = +sz[1], w = +rs[1], h = +rs[2];
    if (!(inch > 0) || !(w > 0) || !(h > 0)) return null;
    let bus = 'other';
    if (/MIPI-DSI/i.test(main)) bus = 'MIPI-DSI'; else if (/QSPI/i.test(main)) bus = 'QSPI'; else if (/8-bit parallel|I80/i.test(main)) bus = 'parallel';
    else if (/\bRGB\b/.test(main)) bus = 'RGB'; else if (/I2C/i.test(main)) bus = 'I2C'; else if (/SPI/i.test(main)) bus = 'SPI';
    const tm = String(d).match(/;\s*touch:\s*([^;]*)/i);
    let touch = 'none';
    if (tm) touch = /capacitive/i.test(tm[1]) ? 'capacitive' : /resistive/i.test(tm[1]) ? 'resistive' : 'touch';
    else if (/capacitive touch/i.test(main)) touch = 'capacitive';
    else if ((b.has || []).includes('touch')) touch = 'touch';
    const panel = /e-paper|e-ink/i.test(main) ? 'e-paper' : /AMOLED/i.test(main) ? 'AMOLED' : /OLED/i.test(main) ? 'OLED' : /LCD|TFT|IPS/i.test(main) ? 'LCD' : 'other';
    return { b, inch, w, h, px: w * h, bus, touch, panel, ppi: Math.hypot(w, h) / inch };
  }
  Hyper.sim('sb-display-chooser', {
    title: 'Choosing a display board',
    blurb: `Every board of the catalogue whose record gives a screen size and resolution is a dot: size across, pixel count up (both logarithmic), colour by the interface that feeds the screen. Dots that fail your filters fade. **Click a bright dot** to read the board.

**Try this**
- Filter **Interface** to *16-bit RGB*: the dots sit at 4 to 7 inches and half a million pixels, and nearly all are ESP32-S3.
- Filter to *MIPI-DSI*: only ESP32-P4 boards remain, at the top right.
- Choose **Panel: e-paper** and then **Touch: capacitive**: very few boards are left.
- Narrow the size to 1 to 2 inches and see how many boards share that corner.`,
    mount(box, kit) {
      const E = kit.esp;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { aspect: 1.15, minH: 420, maxH: 600 } : { aspect: 0.62, maxH: 460 });
      const all = E.BOARDS.map(parseScreen).filter(Boolean);
      const chips = [...new Set(all.map(s => s.b.chip))].sort();
      let pick = null, dots = [];
      const ctl = kit.controls(box.side, [
        { id: 'lo', label: 'Smallest screen', min: 0.5, max: 10.5, step: 0.1, value: 0.5, unit: 'in' },
        { id: 'hi', label: 'Largest screen', min: 0.5, max: 10.5, step: 0.1, value: 10.5, unit: 'in' },
        { id: 'bus', type: 'select', label: 'Interface', options: [['any', ''], ['SPI', 'SPI'], ['8-bit parallel', 'parallel'], ['QSPI', 'QSPI'], ['16-bit RGB', 'RGB'], ['MIPI-DSI', 'MIPI-DSI'], ['I2C', 'I2C']], value: '' },
        { id: 'touch', type: 'select', label: 'Touch', options: [['any', ''], ['capacitive', 'capacitive'], ['resistive', 'resistive'], ['none', 'none']], value: '' },
        { id: 'panel', type: 'select', label: 'Panel', options: [['any', ''], ['LCD / TFT / IPS', 'LCD'], ['AMOLED', 'AMOLED'], ['OLED', 'OLED'], ['e-paper', 'e-paper']], value: '' },
        { id: 'chip', type: 'select', label: 'Chip', options: [['any', '']].concat(chips.map(k => [(E.chip(k) || {}).name || k, k])), value: '' }
      ], () => { pick = null; loop.once(); });
      const ro = kit.readout(box.side, [['n', 'Boards that match'], ['pick', 'The board you clicked'], ['facts', 'Its screen'], ['more', 'And']]);
      const matches = s => {
        const v = ctl.values, lo = Math.min(+v.lo, +v.hi), hi = Math.max(+v.lo, +v.hi);
        if (s.inch < lo - 1e-9 || s.inch > hi + 1e-9) return false;
        if (v.bus && s.bus !== v.bus) return false;
        if (v.panel && s.panel !== v.panel) return false;
        if (v.chip && s.b.chip !== v.chip) return false;
        if (v.touch === 'none') return s.touch === 'none';
        if (v.touch) return s.touch === v.touch;
        return true;
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors();
        const M = 12, lx = M + 38, ty = M + 20, pw = st.W - lx - M, ph = st.H - ty - M - 30;
        const X = inch => lx + clamp(Math.log(inch / 0.5) / Math.log(11 / 0.5), 0, 1) * pw;
        const Y = px => ty + ph - clamp(Math.log(px / 5000) / Math.log(2e6 / 5000), 0, 1) * ph;
        // axes
        c.strokeStyle = C.grid; c.lineWidth = 1;
        for (const [px, t] of [[1e4, '10 k'], [1e5, '100 k'], [1e6, '1 M']]) { c.beginPath(); c.moveTo(lx, Y(px)); c.lineTo(lx + pw, Y(px)); c.stroke(); kit.label(c, t, lx - 6, Y(px), { size: 10, color: C.muted, align: 'right' }); }
        for (const t of [1, 2, 3, 5, 7, 10]) { c.beginPath(); c.moveTo(X(t), ty); c.lineTo(X(t), ty + ph); c.stroke(); kit.label(c, t + '″', X(t), ty + ph + 12, { size: 10, color: C.muted, align: 'center' }); }
        kit.label(c, 'pixels', M, ty - 8, { size: 10, color: C.faint });
        kit.label(c, 'screen diagonal', lx + pw, ty + ph + 26, { size: 10, color: C.faint, align: 'right' });
        // the legend
        let gx = lx;
        for (const k of Object.keys(BUS_HUE)) { if (k === 'other') continue; c.fillStyle = kit.hue(BUS_HUE[k]); c.beginPath(); c.arc(gx + 4, M + 4, 4, 0, Math.PI * 2); c.fill(); const nm = k === 'parallel' ? '8-bit' : k; kit.label(c, nm, gx + 11, M + 4, { size: 10, color: C.muted }); gx += 20 + nm.length * 6; }
        // the dots: faded ones first
        dots = [];
        let nMatch = 0; const names = [];
        for (const pass of [0, 1]) for (const s of all) {
          const m = matches(s);
          if ((pass === 1) !== m) continue;
          const x = X(s.inch), y = Y(s.px);
          c.beginPath(); c.arc(x, y, m ? 4 : 2.4, 0, Math.PI * 2);
          c.fillStyle = m ? kit.hue(BUS_HUE[s.bus] || 0) : C.faint; c.globalAlpha = m ? 0.85 : 0.3; c.fill(); c.globalAlpha = 1;
          if (m) { nMatch++; dots.push({ x, y, s }); if (names.length < 6) names.push(s); }
        }
        if (pick && matches(pick)) { c.beginPath(); c.arc(X(pick.inch), Y(pick.px), 8, 0, Math.PI * 2); c.strokeStyle = C.accent; c.lineWidth = 2; c.stroke(); }
        ro.set('n', nMatch + ' of ' + all.length);
        if (pick && matches(pick)) {
          const b = pick.b;
          ro.set('pick', b.name + ' · ' + b.maker);
          ro.set('facts', shorten(b.display, 120));
          ro.set('more', (E.chip(b.chip) || {}).name + ' · ' + Math.round(pick.ppi) + ' dots per inch' + (b.psram ? ' · PSRAM ' + shorten(b.psram, 24) : ''));
        } else {
          ro.set('pick', nMatch ? 'click a bright dot' : 'no board matches: loosen a filter');
          ro.set('facts', '—');
          ro.set('more', names.length ? 'first matches: ' + names.map(s => shorten(s.b.name, 26)).join('; ') : '—');
        }
      }, box.stage);
      kit.click(st, p => {
        let best = null, bd = 18;
        for (const d of dots) { const dd = Math.hypot(d.x - p.x, d.y - p.y); if (dd < bd) { bd = dd; best = d; } }
        if (best) { pick = best.s; loop.once(); }
      }, p => dots.some(d => Math.hypot(d.x - p.x, d.y - p.y) < 18));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sb-epaper-refresh */
  Hyper.sim('sb-epaper-refresh', {
    title: 'E-paper: refreshes, ghosts and battery life',
    blurb: `A 2.13-inch 250 × 122 panel like the Heltec Wireless Paper's. **Partial** refreshes are quick but leave faint ghosts of what was there; a **full** refresh flashes and clears them. Below, an update interval becomes a battery life. The refresh times (0.5 s partial, 2 s full), the awake time and the awake current are teaching figures; the 20 µA sleep current is the Heltec Wireless Paper's.

**Try this**
- Press **partial** four or five times and watch the ghost meter and the grey remnants of earlier digits. Then press **full**.
- Raise the **update interval** from 10 minutes to an hour: the battery life grows more than fourfold.
- Lengthen the **awake time** (a slow Wi-Fi connection): the awake share of the energy rises and the life falls, while the sleep current hardly matters.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym, G = kit.gfx;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { aspect: 1.25, minH: 460, maxH: 640 } : { aspect: 0.62, maxH: 460 });
      const PW = 250, PH = 122, SLEEP_MA = 0.02;
      const SCREENS = [['Room', '21.5 °C', 'door closed'], ['Room', '22.1 °C', 'door OPEN'], ['Away', '18.0 °C', 'door closed'], ['Room', '21.9 °C', 'door OPEN']];
      const draw = k => {
        const fb = G.fb(PW, PH), s = SCREENS[k % SCREENS.length];
        fb.text(s[0], 8, 8, { size: 2 }); fb.text(s[1], 8, 36, { size: 4 }); fb.text(s[2], 8, 96, { size: 2 });
        fb.rect(0, 0, PW, PH, 1);
        return fb;
      };
      let idx = 0, cur = draw(0), prevPx = cur.px.slice ? cur.px.slice() : Array.from(cur.px);
      const ghost = new Float32Array(PW * PH);
      let busy = 0, busyMax = 1, kind = 'none yet', partials = 0, ghostLevel = 0;
      const ctl = kit.controls(box.side, [
        { id: 'interval', label: 'Update interval', min: 1, max: 1440, step: 1, value: 10, unit: 'min', log: true },
        { id: 'awake', label: 'Awake time before the refresh', min: 1, max: 20, step: 0.5, value: 5.5, unit: 's' },
        { id: 'mA', label: 'Average awake current', min: 30, max: 150, step: 5, value: 90, unit: 'mA' },
        { id: 'kind', type: 'select', label: 'Each update is', options: [['a partial refresh', 'partial'], ['a full refresh', 'full']], value: 'partial' },
        { id: 'cell', type: 'select', label: 'Battery', options: [['500 mAh', 500], ['1000 mAh', 1000], ['2000 mAh', 2000]], value: 1000 },
        { type: 'buttons', items: [{ id: 'partial', label: 'Next picture: partial refresh', primary: true }, { id: 'full', label: 'Next picture: full refresh' }] }
      ], id => {
        if (id === 'partial' || id === 'full') {
          idx++;
          const next = draw(idx);
          if (id === 'partial') {
            for (let i = 0; i < ghost.length; i++) if (prevPx[i] && !next.px[i]) ghost[i] = Math.min(1, ghost[i] * 0.75 + 0.3);
            busy = busyMax = 0.5; partials++; kind = 'partial refresh (' + partials + ' since the last full one)';
          } else { ghost.fill(0); busy = busyMax = 2; partials = 0; kind = 'full refresh'; }
          prevPx = next.px.slice ? next.px.slice() : Array.from(next.px);
          cur = next;
          loop.start();
        } else loop.once();
      });
      const ro = kit.readout(box.side, [['mode', 'Last refresh'], ['ghost', 'Ghosting'], ['avg', 'Average current'], ['life', 'Battery life'], ['share', 'Energy spent awake']]);
      const loop = kit.loop(dt => {
        const c = st.begin(), C = kit.colors(), v = ctl.values;
        if (busy > 0) busy = Math.max(0, busy - dt);
        const M = 12;
        const avail = narrow ? st.W - 2 * M - 8 : st.W * 0.56, scale = Math.max(1, Math.floor(avail / PW * 2) / 2);
        // while a full refresh runs, the panel flashes black and white
        let shown = cur;
        if (busy > 0 && busyMax > 1) {
          const t = 1 - busy / busyMax, fl = G.fb(PW, PH);
          if (t < 0.15 || (t >= 0.3 && t < 0.45)) fl.fillRect(0, 0, PW, PH, 1);
          if (t < 0.75) shown = fl;
        }
        kit.label(c, 'E-paper 2.13″', M + 4, 14, { size: 12, weight: 650 });
        const r = G.draw(c, shown, M + 4, 30, scale, { style: 'epaper' });
        // the ghosts: faint remnants where ink used to be
        if (shown === cur) {
          let gs = 0, gn = 0;
          for (let i = 0; i < ghost.length; i++) {
            if (ghost[i] < 0.04) continue;
            gs += ghost[i]; gn++;
            if (!cur.px[i]) { c.fillStyle = 'rgba(0,0,0,' + (ghost[i] * 0.3).toFixed(3) + ')'; c.fillRect(r.x + (i % PW) * scale, r.y + Math.floor(i / PW) * scale, scale, scale); }
          }
          ghostLevel = gn ? gs / gn * Math.min(1, gn / 600) : 0;
        }
        // the busy lamp and the ghost meter
        const busyOn = busy > 0;
        c.beginPath(); c.arc(r.x + r.w - 6, r.y - 12, 5, 0, Math.PI * 2); c.fillStyle = busyOn ? C.warn : C.faint; c.fill();
        kit.label(c, busyOn ? 'BUSY: refreshing' : 'idle: holds the picture', r.x + r.w - 16, r.y - 12, { size: 10.5, color: busyOn ? C.warn : C.muted, align: 'right' });
        const my = r.y + r.h + 22;
        kit.label(c, 'ghosting', r.x, my, { size: 10.5, color: C.muted });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.1)' : 'rgba(0,0,0,.08)'; c.fillRect(r.x + 60, my - 6, r.w - 60, 12);
        c.fillStyle = ghostLevel > 0.5 ? C.bad : ghostLevel > 0.25 ? C.warn : C.ok; c.fillRect(r.x + 60, my - 6, (r.w - 60) * clamp(ghostLevel, 0, 1), 12);
        // the energy of one cycle
        const T = v.interval * 60, awakeT = Math.min(T, v.awake + (v.kind === 'full' ? 2 : 0.5)), sleepT = Math.max(0, T - awakeT);
        const dc = E.dutyCycle([{ mA: +v.mA, s: awakeT }, { mA: SLEEP_MA, s: sleepT }]);
        const life = E.batteryLife(+v.cell, dc.avg, { usable: 0.8 });
        const ex = narrow ? M : r.x + r.w + 24, ey = narrow ? my + 34 : 40, ew = narrow ? st.W - 2 * M : st.W - ex - M;
        kit.label(c, 'where one cycle\'s energy goes', ex, ey, { size: 11.5, weight: 650 });
        const a = clamp(dc.share[0], 0, 1);
        c.fillStyle = C.accent; c.fillRect(ex, ey + 14, ew * Math.max(0.01, a), 18);
        c.fillStyle = C.dark ? 'rgba(255,255,255,.14)' : 'rgba(0,0,0,.12)'; c.fillRect(ex + ew * Math.max(0.01, a), ey + 14, ew * (1 - Math.max(0.01, a)), 18);
        kit.label(c, 'awake ' + Math.round(a * 100) + ' %', ex, ey + 46, { size: 10.5, color: C.accent });
        kit.label(c, 'asleep ' + Math.round((1 - a) * 100) + ' %', ex + ew, ey + 46, { size: 10.5, color: C.muted, align: 'right' });
        kit.label(c, 'awake ' + fmtTime(awakeT) + ' of every ' + fmtTime(T), ex, ey + 64, { size: 10.5, color: C.muted });
        ro.set('mode', kind);
        ro.set('ghost', ghostLevel > 0.5 ? 'heavy: do a full refresh' : ghostLevel > 0.25 ? 'visible' : ghostLevel > 0.02 ? 'faint' : 'none');
        ro.set('avg', fmt(dc.avg, dc.avg < 1 ? 2 : 1) + ' mA');
        ro.set('life', life.years >= 1 ? fmt(life.years, 1) + ' years' : fmt(life.days, 0) + ' days');
        ro.set('share', Math.round(a * 100) + ' %');
        if (busy <= 0 && loop.running) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
  /* ================================================================ sb-relay-boot */
  Hyper.sim('sb-relay-boot', {
    title: 'What a relay does while the chip boots',
    blurb: `For the first moments after power-up the ESP32 does not drive its pins: it is in reset, then in the boot ROM and the bootloader. During that time **the board's own resistor decides** what the relay's input sees. The traces show the reset line, the relay input and the relay contact. The boot time is a teaching value; on a real board it is a fraction of a second to a second or more.

**Try this**
- Leave *the relay switches on when high* with a **pull-down**: the relay stays off through the whole boot. Now choose a **pull-up**: it clicks on until the program sets the pin.
- Change the relay to switch on when **low** and the answers swap: it needs the pull-up.
- Choose **nothing: floating** and see why a bare input is not safe.
- Put the relay on **GPIO12 of an ESP32** with a pull-up: the chip does not boot at all.
- Press **Power-cycle the board** to replay the start-up.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { aspect: 1.1, minH: 420, maxH: 560 } : { aspect: 0.6, maxH: 440 });
      const T = 4;
      let anim = T;
      const ctl = kit.controls(box.side, [
        { id: 'act', type: 'select', label: 'The relay input switches on when it is', options: [['high', 1], ['low', 0]], value: 1 },
        { id: 'hold', type: 'select', label: 'While the chip does not drive it, the board holds the pin', options: [['low (pull-down)', 'down'], ['high (pull-up)', 'up'], ['nothing (floating)', 'none']], value: 'down' },
        { id: 'boot', label: 'Time until the program sets the pin', min: 0.1, max: 3, step: 0.1, value: 0.6, unit: 's' },
        { id: 'pin', type: 'select', label: 'Pin used', options: [['an ordinary pin', 'plain'], ['GPIO12 of an ESP32', 'gpio12']], value: 'plain' },
        { type: 'buttons', items: [{ id: 'go', label: 'Power-cycle the board', primary: true }] }
      ], id => { if (id === 'go') { anim = 0; loop.start(); } else { anim = T; loop.once(); } });
      const ro = kit.readout(box.side, [['res', 'The relay at power-up'], ['why', 'Because'], ['cure', 'The cure']]);
      /* the traces as segments [t0, t1, level]; level 0, 1, or 0.5 for "not held by anything" */
      function scenario() {
        const v = ctl.values, act = +v.act, tb = +v.boot;
        const pinL = v.hold === 'down' ? 0 : v.hold === 'up' ? 1 : 0.5, offL = act === 1 ? 0 : 1;
        const dead = v.pin === 'gpio12' && pinL === 1;
        const pin = dead ? [[0, T, pinL]] : [[0, tb, pinL], [tb, T, offL]];
        const rel = pin.map(([a, b, l]) => [a, b, l === 0.5 ? 0.5 : (l === act ? 1 : 0)]);
        let verdict;
        if (dead) verdict = ['bad', 'The chip does not boot', 'The board holds GPIO12 high at reset, which selects a 1.8 V flash supply that a 3.3 V flash module cannot use.', 'Use another pin for the relay, or hold GPIO12 low at reset.'];
        else if (pinL === 0.5) verdict = ['warn', 'The relay may click at every power-up', 'Nothing holds the input while the chip is not driving it, so noise and leakage decide.', 'Add a resistor that holds the input at the OFF level.'];
        else if (pinL === act) verdict = ['bad', 'The relay is ON for the first ' + fmt(tb, 1) + ' s', 'The board holds the input at the ON level until the program sets the pin.', act === 1 ? 'Add a pull-down resistor (about 10 kΩ) on the input.' : 'Add a pull-up resistor (about 10 kΩ) on the input.'];
        else verdict = ['ok', 'The relay stays off through the boot', 'The resistor holds the input at the OFF level until the program takes over.', 'Still write the OFF level first thing in the program.'];
        return { en: [[0, 0.15, 0], [0.15, T, 1]], pin, rel, verdict, dead, act };
      }
      const levelAt = (segs, t) => { for (const [a, b, l] of segs) if (t >= a && t < b) return l; return segs.length ? segs[segs.length - 1][2] : 0; };
      function trace(c, x, y, w, h, segs, color, label, C) {
        const X = t => x + clamp(t / T, 0, 1) * w, Y = l => y + h - l * h;
        c.save(); c.lineWidth = 2; c.strokeStyle = color; c.lineJoin = 'miter';
        let prev = null;
        for (const [a, b, l] of segs) {
          c.setLineDash(l === 0.5 ? [4, 4] : []);
          c.beginPath();
          if (prev != null && prev !== l) { c.moveTo(X(a), Y(prev)); c.lineTo(X(a), Y(l)); } else c.moveTo(X(a), Y(l));
          c.lineTo(X(b), Y(l)); c.stroke();
          if (l === 0.5) { c.setLineDash([]); kit.label(c, '?', (X(a) + X(b)) / 2, Y(l) - 8, { size: 11, color: C.warn, align: 'center' }); }
          prev = l;
        }
        c.restore();
        kit.label(c, label, x - 6, y + h / 2, { size: 11, color: C.text2, align: 'right' });
      }
      const loop = kit.loop(dt => {
        if (anim < T) anim = Math.min(T, anim + dt * 1.4);
        const c = st.begin(), C = kit.colors(), sc = scenario(), M = 12;
        const labW = narrow ? 84 : 124, x0 = M + labW, w = st.W - x0 - M, rowH = clamp((st.H - 190) / 3, 26, 54), y0 = M + 18;
        const rows = [[sc.en, C.text2, narrow ? 'reset' : 'power / reset (EN)'], [sc.pin, sc.verdict[0] === 'bad' ? C.bad : kit.hue(212), narrow ? 'input pin' : 'relay input pin'], [sc.rel, sc.verdict[0] === 'ok' ? C.ok : sc.verdict[0] === 'warn' ? C.warn : C.bad, 'relay contact']];
        rows.forEach(([segs, col, lab], i) => trace(c, x0, y0 + i * (rowH + 18), w, rowH, segs, col, lab, C));
        // the time axis and the cursor
        const ay = y0 + 3 * (rowH + 18) - 6;
        for (let t = 0; t <= T; t++) { kit.label(c, t + ' s', x0 + (t / T) * w, ay + 8, { size: 10, color: C.muted, align: 'center' }); }
        c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([3, 3]);
        c.beginPath(); c.moveTo(x0 + (anim / T) * w, y0 - 6); c.lineTo(x0 + (anim / T) * w, ay); c.stroke(); c.setLineDash([]);
        // the relay at the cursor, and the verdict
        const lv = levelAt(sc.rel, anim), on = lv === 1 || (lv === 0.5 && Math.floor(anim * 6) % 2 === 0);
        const by = ay + 26, rl = S.relay(c, M, by, on);
        const bx = M + 84, bh = clamp(st.H - by - M, 40, 56), col = sc.verdict[0] === 'ok' ? C.ok : sc.verdict[0] === 'warn' ? C.warn : C.bad;
        S.box(c, bx, by, st.W - bx - M, bh, { label: sc.verdict[1], sub: shorten(sc.verdict[2], narrow ? 46 : 96), color: col, active: true, size: narrow ? 11 : 12.5 });
        ro.set('res', sc.verdict[1]); ro.set('why', sc.verdict[2]); ro.set('cure', sc.verdict[3]);
        if (anim >= T && loop.running) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ sb-esp01-boot */
  /* the module variants: which boot pins the outside world controls, and what each pin does when nothing holds it (rest: 1 high, 0 low, null none) */
  const ESP_MODS = {
    esp01: { name: 'ESP-01', pins: [['en', 'CH_PD (enable)', null, 'needs a pull-up'], ['g0', 'GPIO0', 1, 'boot pin'], ['g2', 'GPIO2', 1, 'must be high']], g15: 0 },
    esp01s: { name: 'ESP-01S', pins: [['en', 'CH_PD (enable)', 1, 'pull-up fitted'], ['g0', 'GPIO0', 1, 'boot pin'], ['g2', 'GPIO2', 1, 'must be high']], g15: 0 },
    esp12f: { name: 'ESP-12F', pins: [['en', 'EN', null, 'needs a pull-up'], ['g15', 'GPIO15', null, 'must be low'], ['g0', 'GPIO0', 1, 'boot pin'], ['g2', 'GPIO2', 1, 'must be high']], g15: null }
  };
  Hyper.sim('sb-esp01-boot', {
    title: 'ESP8266 boot-mode pins at reset',
    blurb: `Each switch is what the **outside circuit** does to a pin at the moment of reset: pull it low, leave it, or pull it high; if you leave it, the chip's own weak pull resistor decides, where it has one. The ESP-01 has GPIO15 fixed inside the module, so it has two boot pins to worry about; an ESP-12F on your own board has three. The rules are the ESP8266 datasheet's, from the catalogue.

**Try this**
- On the **ESP-01**, pull GPIO0 low: serial download mode, which is what the flashing jumper does.
- Pull **GPIO2** low: the chip refuses to start in either mode.
- Choose **ESP-12F** and leave GPIO15 alone: it has no resistor inside, so a bare board needs one.
- On the **ESP-01** (not the 01S) pull **CH_PD** low or leave it: nothing runs without an enable.
- Pull GPIO15 **high** on the ESP-12F: the chip tries to boot from SDIO and your program never runs.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const narrow = isNarrow(box);
      const st = kit.stage(box.stage, narrow ? { aspect: 1.2, minH: 460, maxH: 620 } : { aspect: 0.7, maxH: 480 });
      let ext = {}, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'mod', type: 'select', label: 'Module', options: Object.keys(ESP_MODS).map(k => [ESP_MODS[k].name, k]), value: 'esp01' },
        { type: 'buttons', items: [{ id: 'clear', label: 'Disconnect everything' }] }
      ], id => { ext = {}; loop.once(); });
      const ro = kit.readout(box.side, [['res', 'The chip'], ['why', 'Because']]);
      function outcome(mod, v) {
        if (v.en === 0) return ['bad', 'In reset', 'CH_PD low holds the chip in reset: nothing runs.'];
        if (v.en == null) return ['warn', 'Not determined', 'Nothing holds the enable pin high: the chip may or may not run. Fit a pull-up (the ESP-01S has one).'];
        const g15 = mod.g15 != null ? mod.g15 : v.g15;
        if (g15 == null) return ['warn', 'Not determined', 'GPIO15 has no pull resistor inside the chip: left floating, the boot mode is luck. A board needs a pull-down.'];
        if (g15 === 1) return ['bad', 'SDIO boot', 'GPIO15 high selects boot from SDIO: the chip does not run your program.'];
        if (v.g2 === 0) return ['bad', 'Does not start', 'GPIO2 must be high at reset in both flash boot and serial download.'];
        if (v.g0 === 1) return ['ok', 'Runs the program', 'GPIO15 low, GPIO0 high, GPIO2 high: normal start from flash.'];
        return ['warn', 'Serial download mode', 'GPIO15 low, GPIO0 low, GPIO2 high: the ROM waits for a program over the serial port. Its log is at 74880 baud.'];
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), mod = ESP_MODS[ctl.values.mod] || ESP_MODS.esp01, M = 12;
        const v = {};
        for (const [k, , rest] of mod.pins) v[k] = ext[k] != null ? ext[k] : rest;
        if (mod.g15 != null) v.g15 = mod.g15;
        const out = outcome(mod, v), col = out[0] === 'ok' ? C.ok : out[0] === 'warn' ? C.warn : C.bad;
        // the module and its boot pins
        const bw = narrow ? 0 : Math.min(150, st.W * 0.22);
        if (bw) {
          S.module(c, M, M + 20, bw, 110, { label: mod.name, antenna: 'pcb' });
          kit.label(c, 'boot pins', M + bw / 2, M + 150, { size: 10.5, color: C.muted, align: 'center' });
          const all = mod.pins.concat(mod.g15 != null ? [['g15f', 'GPIO15', mod.g15, 'fixed by the module']] : []);
          all.forEach(([k, name], i) => {
            const lv = k === 'g15f' ? mod.g15 : v[k], y = M + 170 + i * 22;
            c.fillStyle = lv == null ? C.warn : lv ? kit.hue(140) : kit.hue(212); c.beginPath(); c.arc(M + 8, y, 5, 0, Math.PI * 2); c.fill();
            kit.label(c, name + ' · ' + (lv == null ? 'floating' : lv ? 'high' : 'low'), M + 20, y, { size: 10.5 });
          });
        }
        // the switches
        const x0 = narrow ? M : bw + M + 36, w = st.W - x0 - M;
        kit.label(c, 'At reset, the outside circuit…', x0, M + 8, { size: 12, color: C.text2, weight: 600 });
        hits = [];
        mod.pins.forEach(([k, name, rest, role], i) => {
          const y = M + 34 + i * 52;
          kit.label(c, name, x0, y, { size: 13, weight: 650 });
          kit.label(c, role + ' · inside: ' + (rest == null ? 'no pull' : rest ? 'pull-up' : 'pull-down'), x0, y + 16, { size: 10.5, color: C.muted });
          const opts = [['pulls low', 0], ['leaves it', undefined], ['pulls high', 1]], bwid = Math.min(78, (w - 8) / 3);
          opts.forEach(([t, val], j) => {
            const bx = x0 + j * (bwid + 4), by = y + 26, on = ext[k] === val;
            S.box(c, bx, by, bwid, 18, { label: t, size: 10.5, r: 9, active: on, color: on ? C.accent : C.faint });
            hits.push({ x: bx, y: by, w: bwid, h: 18, k, val });
          });
        });
        const oy = M + 34 + mod.pins.length * 52 + 14;
        S.box(c, x0, oy, w, 42, { label: out[1], sub: shorten(out[2], narrow ? 40 : 88), color: col, active: true, size: 13 });
        ro.set('res', out[1]); ro.set('why', out[2]);
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h); if (h) { ext[h.k] = h.val; loop.once(); } },
        p => hits.some(q => p.x >= q.x && p.x <= q.x + q.w && p.y >= q.y && p.y <= q.y + q.h));
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
