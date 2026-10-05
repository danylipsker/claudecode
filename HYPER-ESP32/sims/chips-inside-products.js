/* HYPER-ESP32 · sims/chips-inside-products.js
 *
 * ESP chips inside products. Facts come from the catalogue (kit.esp: CHIPS, BOARDS, PRODUCTS).
 *
 *   cp-esp-inside     is there an ESP inside? every finished product (or every co-processor board) of the catalogue as a square
 *                     params: { set: 'products' | 'co', maker: 'Shelly', filter: 'u-blox' }
 *   cp-modem-host     a host and an ESP that is only its radio: AT commands over a UART, or ESP-Hosted over SPI and SDIO
 *                     params: { mode: 'at' | 'spi' | 'sdio' }
 *   cp-border-router  a Thread mesh, a border router and the home network; switch things off and watch the route
 *   cp-smart-plug     a smart plug as blocks: mains side, isolation, the ESP side; schematic only
 *                     params: { isolation: 'iso' | 'none' }
 *   cp-802154-chips   the three ESP chips with an 802.15.4 radio, matched to a job, with a battery estimate
 *   cp-led-strip      a pixel strip: current, frame time, the voltage along the copper and where to inject power
 *   cp-voice-path     a voice satellite: what runs where, and how much audio leaves the house
 *   cp-reflash-check  a checklist for reflashing a commercial device, with its verdict
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- helpers */
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const inRect = (p, r) => p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
  const txt = v => (v == null || v === '' || (typeof v === 'number' && !isFinite(v)) ? '—' : String(v));
  const fontOf = (size, weight) => (weight || 500) + ' ' + size + 'px system-ui, "Segoe UI", sans-serif';
  // shortens a string with an ellipsis so that it fits in maxW pixels
  function fit(c, str, maxW, size, weight) {
    let s = String(str == null ? '' : str);
    c.save(); c.font = fontOf(size, weight);
    if (maxW > 8 && c.measureText(s).width > maxW) {
      while (s.length > 1 && c.measureText(s + '…').width > maxW) s = s.slice(0, -1);
      s += '…';
    }
    c.restore();
    return s;
  }
  // draws wrapped text, left aligned; returns the y below the last line
  function wrap(S, c, text, x, y, maxW, lh, o) {
    o = o || {};
    const words = String(text).split(' ');
    let line = '';
    c.save(); c.font = fontOf(o.size || 12, o.weight);
    const lines = [];
    for (const w of words) {
      const t = line ? line + ' ' + w : w;
      if (c.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t;
    }
    c.restore();
    if (line) lines.push(line);
    const max = o.maxLines || 99;
    lines.slice(0, max).forEach((l, i) => {
      if (i === max - 1 && lines.length > max) l = fit(c, l + ' …', maxW, o.size || 12, o.weight);
      S.text(c, l, x, y, { size: o.size, color: o.color, align: o.align || 'left', weight: o.weight });
      y += lh;
    });
    return y;
  }
  const cut = (s, n) => { s = String(s == null ? '' : s); return s.length > n ? s.slice(0, n - 1).trim() + '…' : s; };
  // a bytes-per-second figure as text
  const rate = v => (v >= 1e6 ? (v / 1e6 >= 10 ? Math.round(v / 1e6) : (v / 1e6).toFixed(1)) + ' MB/s' : v >= 1e3 ? (v / 1e3 >= 10 ? Math.round(v / 1e3) : (v / 1e3).toFixed(1)) + ' kB/s' : Math.round(v) + ' B/s');
  const secs = s => (s >= 100 ? Math.round(s) + ' s' : s >= 1 ? s.toFixed(1) + ' s' : s >= 0.001 ? Math.round(s * 1000) + ' ms' : (s * 1e6).toFixed(0) + ' µs');
  const tint = (C, a) => (C.dark ? 'rgba(255,255,255,' + (a * 0.55) + ')' : 'rgba(0,0,0,' + (a * 0.4) + ')');

  /* ================================================================ cp-esp-inside */
  const GROUP = m => {
    m = String(m || 'other');
    if (/shelly/i.test(m)) return 'Shelly';
    if (/sonoff/i.test(m)) return 'Sonoff';
    if (/tuya/i.test(m)) return 'Tuya';
    if (/olimex/i.test(m)) return 'Olimex';
    if (/nabu|open home/i.test(m)) return 'Nabu Casa';
    if (/espressif/i.test(m)) return 'Espressif (resold)';
    if (/third party/i.test(m)) return 'Third party';
    if (/heltec/i.test(m)) return 'Heltec';
    if (/wemos|lolin/i.test(m)) return 'LOLIN';
    if (/unexpected/i.test(m)) return 'Unexpected Maker';
    if (/everything smart/i.test(m)) return 'Everything Smart';
    if (/apollo/i.test(m)) return 'Apollo';
    return m;
  };
  const CATS = [['esp32', 'ESP32 family', 150], ['esp8266', 'ESP8266 family', 45], ['maker', 'maker-named, ESP-class', 205], ['other', 'not an ESP', 8], ['none', 'no chip named', null]];
  const VERDICT = { esp32: 'An ESP32-family chip', esp8266: 'An ESP8266-family chip', maker: 'An ESP-class part under the maker\'s own name', other: 'Not an Espressif chip', none: 'No chip named: an accessory, or not read' };
  function classify(p) {
    const chip = p.chip || '', part = String(p.part || '');
    if (/not an? (ESP|Espressif)/i.test(part)) return 'other';
    if (/^esp32/.test(chip)) return 'esp32';
    if (chip === 'esp8266') return 'esp8266';
    if (/ESP-Shelly/i.test(part)) return 'maker';
    if (/Beken|Realtek|Rockchip|Silicon Labs/i.test(part)) return 'other';
    return 'none';
  }

  Hyper.sim('cp-esp-inside', {
    title: 'Is there an ESP inside?',
    blurb: `Every square is one finished product or board of the catalogue, coloured by what the maker, or the community that opened it, says is inside. The colours are in the legend under the picture. **Click a square**, or pick a maker to see its list, and read the part and the note beside it.

**Try this**
- Look at the **Shelly** row: the chip changes with the generation, and the newest parts carry the maker's own name.
- Pick **Tuya**: the old modules are ESP8266, the newer ones are not ESP at all.
- Look at **Sonoff**: some devices contain no Espressif chip, and one has locked flash.
- Where a square has a dashed ring, a u-blox module sits inside.`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 1.0, minH: 330, maxH: 560 });
      const isCo = params.set === 'co';
      const all = isCo
        ? E.BOARDS.filter(b => b.role === 'co' || /u-blox/i.test((b.part || '') + ' ' + (b.name || ''))).map(b => ({ name: b.name, group: b.maker || 'other', chip: b.chip, part: b.part, note: (b.watch && b.watch[0]) || (b.good && b.good[0]) || '', cat: b.chip || 'none', ublox: /u-blox|NINA|NORA/i.test((b.part || '') + ' ' + (b.name || '')) }))
        : E.PRODUCTS.map(p => ({ name: p.name, group: GROUP(p.maker), chip: p.chip, part: p.part, note: p.note, cat: classify(p), ublox: false }));
      const cats = isCo
        ? all.map(x => x.cat).filter((v, i, a) => a.indexOf(v) === i).map((id, i) => { const ch = E.chip(id); return [id, ch && ch.name ? ch.name : txt(id), [150, 205, 280, 330, 45, 8][i % 6]]; })
        : CATS;
      const hueOf = id => { const k = cats.find(q => q[0] === id); return k ? k[2] : null; };
      const names = all.map(x => x.group).filter((v, i, a) => a.indexOf(v) === i).sort();
      const want = params.maker ? GROUP(params.maker) : '';
      let maker = names.indexOf(want) >= 0 ? want : '';
      let sel = null, hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'maker', type: 'select', label: 'Maker', options: [['All makers', '']].concat(names.map(n => [n, n])), value: maker },
        { id: 'show', type: 'select', label: 'Show', options: [['Everything', 'all'], ['An ESP-family chip inside', 'esp'], ['Not an ESP', 'other']], value: 'all' }
      ], (id, v) => { if (id === 'maker') maker = v; sel = null; loop.once(); });
      if (isCo) ctl.show('show', false);
      const ro = kit.readout(box.side, [['count', 'In view'], ['name', 'Selected'], ['verdict', 'Inside'], ['part', 'Part'], ['note', 'Note']]);
      const visible = () => all.filter(it => (!maker || it.group === maker) && (isCo || ctl.values.show === 'all' || (ctl.values.show === 'esp' ? /^(esp32|esp8266|maker)$/.test(it.cat) : it.cat === 'other')));
      function tile(c, C, x, y, s, it, on) {
        const h = hueOf(it.cat);
        c.fillStyle = h == null ? tint(C, 0.35) : kit.hue(h);
        c.fillRect(x, y, s, s);
        if (on) { c.strokeStyle = C.text; c.lineWidth = 2; c.strokeRect(x - 1, y - 1, s + 2, s + 2); }
        if (it.ublox) { c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([3, 2]); c.strokeRect(x - 2.5, y - 2.5, s + 5, s + 5); c.restore(); }
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10;
        const items = visible();
        hits = [];
        // the legend, at the bottom, wrapped
        const present = cats.filter(k => all.some(it => it.cat === k[0]));
        const entries = present.map(k => [k[0], k[1], k[2]]);
        if (isCo && all.some(it => it.ublox)) entries.push(['ring', 'dashed ring: u-blox module', 'ring']);
        let lx = M, ly = 0, lines = 1;
        const lay = entries.map(e => { c.save(); c.font = fontOf(10.5, 500); const w = 16 + c.measureText(e[1]).width + 12; c.restore(); if (lx + w > W - M && lx > M) { lx = M; lines++; } const r = { e, x: lx, line: lines - 1 }; lx += w; return r; });
        const legendTop = H - M - lines * 16;
        lay.forEach(r => {
          const y = legendTop + r.line * 16 + 7;
          if (r.e[2] === 'ring') { c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.5; c.setLineDash([3, 2]); c.strokeRect(r.x + 0.5, y - 5, 10, 10); c.restore(); }
          else { c.fillStyle = r.e[2] == null ? tint(C, 0.35) : kit.hue(r.e[2]); c.fillRect(r.x, y - 5, 10, 10); }
          S.text(c, r.e[1], r.x + 15, y, { align: 'left', size: 10.5, color: C.text2 });
        });
        const top = 10, bottom = legendTop - 8;
        if (!items.length) S.text(c, 'nothing to show with these choices', W / 2, (top + bottom) / 2, { size: 12, color: C.muted });
        else if (!maker) {
          // overview: one row per maker, one square per product
          const groups = [];
          items.forEach(it => { let g = groups.find(x => x.name === it.group); if (!g) { g = { name: it.group, list: [] }; groups.push(g); } g.list.push(it); });
          groups.sort((a, b) => b.list.length - a.list.length || a.name.localeCompare(b.name));
          const rowH = clamp((bottom - top) / groups.length, 14, 34), labelW = W < 520 ? 92 : 150, barX = M + labelW + 6, barW = W - barX - M;
          const maxN = Math.max.apply(null, groups.map(g => g.list.length)), unit = Math.max(6, Math.min(28, barW / maxN));
          groups.forEach((g, gi) => {
            const y = top + gi * rowH, s = Math.max(5, Math.min(unit - 2, rowH - 4));
            S.text(c, fit(c, g.name + ' · ' + g.list.length, labelW, 11), M, y + rowH / 2, { align: 'left', size: 11, color: C.text2 });
            g.list.forEach((it, i) => {
              const x = barX + i * unit, yy = y + (rowH - s) / 2;
              tile(c, C, x, yy, s, it, it === sel);
              hits.push({ x: x - 1, y: yy - 1, w: s + 2, h: s + 2, it });
            });
          });
        } else {
          // one maker: a list
          const head = 22, rowH = clamp((bottom - top - head) / items.length, 15, 28), s = Math.min(rowH - 5, 16);
          S.text(c, fit(c, maker + ' · ' + items.length + (isCo ? ' boards' : ' products'), W - 2 * M, 12.5, 650), M, top + 8, { align: 'left', size: 12.5, weight: 650, color: C.text });
          const nameW = (W - 2 * M - s - 14) * 0.54, partW = (W - 2 * M - s - 14) * 0.44;
          items.forEach((it, i) => {
            const y = top + head + i * rowH;
            if (it === sel) { c.fillStyle = C.dark ? 'rgba(123,140,255,.22)' : 'rgba(60,90,220,.12)'; c.fillRect(M - 4, y, W - 2 * M + 8, rowH); }
            tile(c, C, M, y + (rowH - s) / 2, s, it, false);
            S.text(c, fit(c, it.name, nameW, 11), M + s + 8, y + rowH / 2, { align: 'left', size: 11, color: C.text });
            S.text(c, fit(c, it.part || '—', partW, 10.5), W - M, y + rowH / 2, { align: 'right', size: 10.5, color: C.muted });
            hits.push({ x: M - 4, y, w: W - 2 * M + 8, h: rowH, it });
          });
        }
        // the read-out
        const counts = {};
        items.forEach(it => { counts[it.cat] = (counts[it.cat] || 0) + 1; });
        ro.set('count', present.filter(k => counts[k[0]]).map(k => counts[k[0]] + ' ' + k[1]).join(' · ') || 'nothing');
        if (sel && items.indexOf(sel) >= 0) {
          ro.set('name', cut(sel.name, 70));
          ro.set('verdict', isCo ? (hueOf(sel.cat) != null ? (cats.find(k => k[0] === sel.cat) || [0, txt(sel.cat)])[1] + ' inside' : 'no chip named') : VERDICT[sel.cat]);
          ro.set('part', cut(txt(sel.part), 90));
          ro.set('note', cut(txt(sel.note), 190));
        } else {
          ro.set('name', 'click a square or a row');
          ro.set('verdict', '—'); ro.set('part', '—'); ro.set('note', '—');
        }
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => inRect(p, q)); if (h) { sel = h.it; loop.once(); } }, p => hits.some(q => inRect(p, q)));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cp-modem-host */
  const AT_CMDS = [
    ['AT (is anybody there?)', 'AT', ['OK']],
    ['Station mode', 'AT+CWMODE=1', ['OK']],
    ['Join a Wi-Fi network', 'AT+CWJAP="ssid","pw"', ['WIFI CONNECTED', 'WIFI GOT IP', 'OK']],
    ['Ask for the IP address', 'AT+CIFSR', ['+CIFSR:STAIP,"192.168.1.50"', 'OK']],
    ['Open a TCP connection', 'AT+CIPSTART="TCP","example.com",80', ['CONNECT', 'OK']]
  ];
  Hyper.sim('cp-modem-host', {
    title: 'The ESP as a modem',
    blurb: `A host processor on the left, an ESP on the right that is only its radio. In **ESP-AT** mode the host sends a text command down a UART and the ESP answers; the time on the wire is the number of bytes times ten bit times, divided by the baud rate. In **ESP-Hosted** mode frames cross an SPI or SDIO bus instead.

The bars compare the **ceilings** of the links, in bytes per second on a logarithmic axis, with the best-case rate of the ESP32's own Wi-Fi from the catalogue. Real throughput is lower on every link.

**Try this**
- In AT mode press *Send it* for each command, at 9 600 and at 921 600 baud, and read the time on the wire.
- Look at the *30 kB web page* read-out: how long does the UART hold it up?
- Switch to SPI, then SDIO, and move the clock: where does the link stop being the limit?`,
    mount(box, kit, params) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 350, maxH: 520 });
      const mode0 = ['at', 'spi', 'sdio'].indexOf(params.mode) >= 0 ? params.mode : 'at';
      const ctl = kit.controls(box.side, [
        { id: 'mode', type: 'select', label: 'Link', options: [['ESP-AT over a UART', 'at'], ['ESP-Hosted over SPI', 'spi'], ['ESP-Hosted over SDIO', 'sdio']], value: mode0 },
        { id: 'baud', type: 'select', label: 'UART speed', options: [['9 600 baud', 9600], ['115 200 baud', 115200], ['460 800 baud', 460800], ['921 600 baud', 921600]], value: 115200 },
        { id: 'spi', label: 'SPI clock', min: 1, max: 40, step: 1, value: 40, unit: 'MHz' },
        { id: 'sdio', label: 'SDIO clock, 4 bits', min: 5, max: 50, step: 1, value: 50, unit: 'MHz' },
        { id: 'cmd', type: 'select', label: 'AT command', options: AT_CMDS.map((q, i) => [q[0], i]), value: 2 },
        { type: 'buttons', items: [{ id: 'send', label: 'Send it', primary: true }] }
      ], (id) => {
        if (id === 'send') { anim = 0; loop.start(); return; }
        sync(); loop.once();
      });
      const ro = kit.readout(box.side, [['link', 'The link'], ['ceiling', 'Ceiling'], ['radio', 'Against the radio'], ['page', '30 kB web page'], ['cmd', 'The command']]);
      let anim = -1;
      function sync() {
        const m = ctl.values.mode;
        ctl.show('baud', m === 'at'); ctl.show('spi', m === 'spi'); ctl.show('sdio', m === 'sdio'); ctl.show('cmd', m === 'at'); ctl.show('send', true);
        ro.show('cmd', m === 'at');
      }
      sync();
      const wifiBps = () => { const w = E.chip('esp32'); return ((w && w.wifi && w.wifi.mbps) || 150) * 1e6 / 8; };
      const bars = () => {
        const v = ctl.values;
        return [
          ['at', 'UART ' + Math.round(v.baud) + ' baud', v.baud / 10],
          ['spi', 'SPI ' + Math.round(v.spi) + ' MHz', v.spi * 1e6 / 8],
          ['sdio', 'SDIO ' + Math.round(v.sdio) + ' MHz, 4 bits', v.sdio * 1e6 * 4 / 8],
          ['wifi', 'Wi-Fi 4 radio, best case', wifiBps()]
        ];
      };
      const loop = kit.loop((dt) => {
        if (anim >= 0) anim += dt;
        if (anim > 3.2) anim = -1;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, v = ctl.values, m = v.mode;
        const cm = AT_CMDS[clamp(Math.round(v.cmd), 0, AT_CMDS.length - 1)];
        // the picture: host, link, ESP, radio
        const bw = clamp(W * 0.24, 78, 130), by = Math.max(22, H * 0.06), bh = 58, yM = by + bh / 2;
        const espX = W - M - 56 - bw;
        const hostB = S.box(c, M, by, bw, bh, { label: 'Host', sub: m === 'at' ? 'any MCU' : 'Linux or fast MCU', color: kit.hue(212) });
        const espB = S.box(c, espX, by, bw, bh, { label: 'ESP', sub: m === 'at' ? 'AT firmware' : 'ESP-Hosted', color: kit.hue(8), active: anim >= 1.2 && anim < 1.7 });
        S.wire(c, [hostB.r, espB.l], { color: C.muted, width: 2.6 });
        const linkW = espB.l[0] - hostB.r[0];
        const lab = m === 'at' ? 'UART · ' + Math.round(v.baud) + ' baud' : m === 'spi' ? 'SPI · ' + Math.round(v.spi) + ' MHz' : 'SDIO · ' + Math.round(v.sdio) + ' MHz';
        const lab2 = m === 'at' ? 'TX · RX · GND' : m === 'spi' ? 'clock · 2 data · select' : 'clock · command · 4 data';
        S.text(c, fit(c, lab, linkW - 6, 10.5, 600), (hostB.r[0] + espB.l[0]) / 2, yM - 13, { size: 10.5, color: C.text2, weight: 600 });
        S.text(c, fit(c, lab2, linkW - 6, 9.5), (hostB.r[0] + espB.l[0]) / 2, yM + 14, { size: 9.5, color: C.muted });
        const ax = W - M - 26;
        S.antenna(c, ax, by + bh, 30);
        S.radio(c, ax, by + 6, { r: 24, n: 3, phase: anim >= 0 ? anim * 0.8 : 0.3, color: kit.hue(8) });
        S.wire(c, [espB.r, [ax - 6, yM], [ax - 6, by + bh - 2]], { color: C.faint, width: 1.6, dash: true });
        // the message in flight
        const cmdText = m === 'at' ? cm[1] : 'network frame';
        const repText = m === 'at' ? cm[2][cm[2].length - 1] : 'network frame';
        if (anim >= 0 && anim < 1.2) S.msg(c, hostB.r[0], yM, espB.l[0], yM, anim / 1.2, { label: fit(c, cmdText, Math.max(60, linkW), 10.5), shape: 'packet', color: kit.hue(212) });
        if (anim >= 1.7 && anim < 2.9) S.msg(c, espB.l[0], yM, hostB.r[0], yM, (anim - 1.7) / 1.2, { label: fit(c, repText, Math.max(60, linkW), 10.5), shape: 'packet', color: kit.hue(150) });
        // what was said
        const ty = by + bh + 16;
        if (m === 'at') {
          const shown = anim < 0 ? 'press “Send it”' : anim < 1.7 ? '→ ' + cm[1] : cm[2].join('  ');
          S.text(c, fit(c, shown, W - 2 * M, 11), M, ty, { align: 'left', size: 11, mono: true, color: anim >= 1.7 ? C.ok : C.text });
        } else S.text(c, 'The host driver sees a normal network interface', M, ty, { align: 'left', size: 11, color: C.muted });
        // the ceilings, on a log axis
        const list = bars(), top = ty + 42, labW = Math.min(150, W * 0.36), x0 = M + labW, x1 = W - M - 62;
        const bh2 = clamp((H - top - 28) / list.length - 8, 14, 26);
        const X = val => x0 + clamp((Math.log10(Math.max(val, 1)) - 3) / 5, 0, 1) * (x1 - x0);
        S.text(c, 'bytes per second, logarithmic', x0, top - 24, { align: 'left', size: 9.5, color: C.faint });
        [[1e3, '1k'], [1e4, '10k'], [1e5, '100k'], [1e6, '1M'], [1e7, '10M'], [1e8, '100M']].forEach(([val, t]) => {
          const x = X(val);
          c.strokeStyle = C.grid; c.lineWidth = 1; c.beginPath(); c.moveTo(x, top - 8); c.lineTo(x, top + list.length * (bh2 + 8)); c.stroke();
          S.text(c, t, x, top - 10, { size: 9, color: C.faint });
        });
        list.forEach((b, i) => {
          const y = top + i * (bh2 + 8), on = b[0] === m;
          S.text(c, fit(c, b[1], labW - 6, 10.5, on ? 650 : 500), M, y + bh2 / 2, { align: 'left', size: 10.5, color: on ? C.text : C.muted, weight: on ? 650 : 500 });
          c.fillStyle = b[0] === 'wifi' ? kit.hue(8, 0.85) : on ? kit.hue(212) : (C.dark ? 'rgba(150,156,180,.45)' : 'rgba(80,86,110,.35)');
          c.fillRect(x0, y, Math.max(2, X(b[2]) - x0), bh2);
          S.text(c, rate(b[2]), X(b[2]) + 4, y + bh2 / 2, { align: 'left', size: 10, color: C.text2 });
        });
        // the numbers
        const cur = list.find(b => b[0] === m) || list[0];
        ro.set('link', lab);
        ro.set('ceiling', rate(cur[2]) + '  (' + kit.fmt(cur[2] * 8 / 1e6, 3) + ' Mbit/s)');
        ro.set('radio', kit.fmt(cur[2] / wifiBps() * 100, 3) + ' % of the Wi-Fi rate');
        ro.set('page', secs(30000 / cur[2]) + ' at best');
        const bytes = cm[1].length + 2, rbytes = cm[2].join('\r\n').length + 4;
        ro.set('cmd', bytes + ' bytes out, ' + rbytes + ' back: ' + secs((bytes + rbytes) * 10 / v.baud) + ' on the wire');
        if (anim < 0) loop.stop();
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cp-border-router */
  const NODES = {
    s: { x: 0.07, y: 0.5, kind: 'sensor', label: 'sensor', name: 'sensor' },
    r1: { x: 0.23, y: 0.22, kind: 'bulb', label: 'R1', name: 'R1' },
    r2: { x: 0.23, y: 0.78, kind: 'bulb', label: 'R2', name: 'R2' },
    r3: { x: 0.40, y: 0.5, kind: 'bulb', label: 'R3', name: 'R3' },
    r4: { x: 0.53, y: 0.2, kind: 'bulb', label: 'R4', name: 'R4' },
    r5: { x: 0.53, y: 0.8, kind: 'bulb', label: 'R5', name: 'R5' },
    b1: { x: 0.68, y: 0.3, kind: 'gateway', label: 'BR 1', name: 'border router 1' },
    b2: { x: 0.68, y: 0.72, kind: 'gateway', label: 'BR 2', name: 'border router 2' },
    h: { x: 0.82, y: 0.5, kind: 'router', label: 'home', name: 'home router' },
    p: { x: 0.94, y: 0.5, kind: 'phone', label: 'phone', name: 'phone' }
  };
  const MESH = [['s', 'r1'], ['s', 'r2'], ['r1', 'r3'], ['r2', 'r3'], ['r1', 'r4'], ['r3', 'r4'], ['r3', 'r5'], ['r2', 'r5'], ['r4', 'b1'], ['r5', 'b2']];
  const IPLINK = [['b1', 'h'], ['b2', 'h'], ['h', 'p']];
  // shortest route between two nodes over the given links, using only live nodes; null when there is none
  function route(alive, edges, from, to) {
    const adj = {};
    edges.forEach(e => { if (alive(e[0]) && alive(e[1])) { (adj[e[0]] = adj[e[0]] || []).push(e[1]); (adj[e[1]] = adj[e[1]] || []).push(e[0]); } });
    const prev = {}; prev[from] = null;
    const q = [from];
    while (q.length) {
      const u = q.shift();
      if (u === to) break;
      (adj[u] || []).forEach(w => { if (!(w in prev)) { prev[w] = u; q.push(w); } });
    }
    if (!(to in prev)) return null;
    const path = [];
    for (let k = to; k != null; k = prev[k]) path.unshift(k);
    return path;
  }
  function reach(alive, edges, from) {
    const seen = {}; seen[from] = true;
    const q = [from];
    while (q.length) {
      const u = q.shift();
      edges.forEach(e => { const w = e[0] === u ? e[1] : e[1] === u ? e[0] : null; if (w && alive(w) && !seen[w]) { seen[w] = true; q.push(w); } });
    }
    return seen;
  }

  Hyper.sim('cp-border-router', {
    title: 'A Thread mesh and its border router',
    blurb: `A battery sensor on the left, a phone on the right. The sensor's message hops from router to router across the **802.15.4 mesh** (dashed), crosses a **border router**, then travels over **Wi-Fi or Ethernet** (solid) to the home router and the phone. The bright line is the route the network has chosen.

**Click a router or a border router** to switch it off, and click again to bring it back. The picture is schematic.

**Try this**
- Switch off R3: the mesh finds another way round, through R1 and R4 or R2 and R5.
- Switch off BR 1: the mesh still works, but now there is no way out. Add a second border router, and the route comes back.
- Switch off R1 and R2: the sensor has no router in reach and is cut off.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.62, minH: 300, maxH: 460 });
      const dead = {};
      let phase = 0;
      const ctl = kit.controls(box.side, [
        { id: 'br2', type: 'check', label: 'Add a second border router', value: false },
        { type: 'buttons', items: [{ id: 'reset', label: 'Switch everything back on' }] }
      ], (id) => { if (id === 'reset') Object.keys(dead).forEach(k => delete dead[k]); });
      const ro = kit.readout(box.side, [['route', 'Route'], ['hops', 'Hops'], ['state', 'State']]);
      let spots = [];
      const alive = id => !dead[id] && (id !== 'b2' || ctl.values.br2);
      const loop = kit.loop((dt) => {
        phase += dt * 70;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, r = clamp(W * 0.032, 11, 16);
        const showB2 = ctl.values.br2;
        const P = id => [NODES[id].x * W, 22 + NODES[id].y * (H - 54)];
        // the two networks
        c.fillStyle = tint(C, 0.07); c.fillRect(6, 6, W * 0.6 - 6, H - 34);
        c.fillStyle = tint(C, 0.04); c.fillRect(W * 0.6 + 6, 6, W * 0.4 - 12, H - 34);
        S.text(c, 'Thread mesh · 802.15.4', 14, 15, { align: 'left', size: 10.5, color: C.muted });
        S.text(c, fit(c, 'home network · Wi-Fi / Ethernet', W * 0.4 - 24, 10.5), W - 14, 15, { align: 'right', size: 10.5, color: C.muted });
        const path = route(alive, MESH.concat(IPLINK.filter(e => showB2 || (e[0] !== 'b2'))), 's', 'p');
        const onPath = (a, b) => { if (!path) return false; for (let i = 0; i < path.length - 1; i++) if ((path[i] === a && path[i + 1] === b) || (path[i] === b && path[i + 1] === a)) return true; return false; };
        const edgeOk = e => (e[0] !== 'b2' && e[1] !== 'b2') || showB2;
        MESH.filter(edgeOk).forEach(e => {
          const a = P(e[0]), b = P(e[1]), ok = alive(e[0]) && alive(e[1]);
          S.link(c, a[0], a[1], b[0], b[1], { wireless: true, color: onPath(e[0], e[1]) ? C.accent : (ok ? C.muted : C.faint), width: onPath(e[0], e[1]) ? 3 : 1.4, gap: r });
        });
        IPLINK.filter(edgeOk).forEach(e => {
          const a = P(e[0]), b = P(e[1]), ok = alive(e[0]) && alive(e[1]);
          S.link(c, a[0], a[1], b[0], b[1], { color: onPath(e[0], e[1]) ? C.accent : (ok ? C.muted : C.faint), width: onPath(e[0], e[1]) ? 3 : 1.6, gap: r });
        });
        if (path) S.flow(c, path.map(P), phase, { color: C.accent, r: 3, gap: 18 });
        spots = [];
        Object.keys(NODES).forEach(id => {
          if (id === 'b2' && !showB2) return;
          const n = NODES[id], p = P(id), off = !alive(id);
          S.node(c, p[0], p[1], { kind: n.kind, label: n.label, r, dim: off, active: !off && path && path.indexOf(id) >= 0, color: id === 'b1' || id === 'b2' ? 150 : n.kind === 'bulb' ? 205 : undefined });
          if (off) { c.strokeStyle = C.bad; c.lineWidth = 2.4; c.beginPath(); c.moveTo(p[0] - r, p[1] - r); c.lineTo(p[0] + r, p[1] + r); c.moveTo(p[0] + r, p[1] - r); c.lineTo(p[0] - r, p[1] + r); c.stroke(); }
          if (id !== 's' && id !== 'h' && id !== 'p') spots.push({ id, x: p[0] - r * 1.4, y: p[1] - r * 1.4, w: r * 2.8, h: r * 2.8 });
        });
        S.text(c, fit(c, W < 520 ? 'dashed: mesh · solid: Wi-Fi or Ethernet · click a router' : 'dashed: 802.15.4 mesh   solid: Wi-Fi or Ethernet   click a router to switch it off', W - 16, 10), W / 2, H - 12, { size: 10, color: C.faint });
        // the numbers
        if (path) {
          ro.set('route', cut(path.map(k => NODES[k].name).join(' → '), 120));
          ro.set('hops', String(path.length - 1));
          ro.set('state', 'the sensor reaches the phone');
        } else {
          const meshAlive = id => alive(id) && id !== 'h' && id !== 'p';
          const seen = reach(meshAlive, MESH, 's');
          const others = Object.keys(seen).filter(k => k !== 's').length;
          ro.set('route', 'none');
          ro.set('hops', '—');
          ro.set('state', others > 0 ? 'the mesh still works, but nothing connects it to the home network' : 'the sensor has no router in reach: it is cut off');
        }
      }, box.stage);
      kit.click(st, p => { const h = spots.find(q => inRect(p, q)); if (h) dead[h.id] = !dead[h.id]; }, p => spots.some(q => inRect(p, q)));
      loop.start();
    }
  });

  /* ================================================================ cp-smart-plug */
  const PLUG_PARTS = {
    mains: ['Mains in', 'Live and neutral from the wall socket, 110 to 230 V. Dangerous whether or not anything seems to be working.'],
    fuse: ['Fuse and varistor', 'A fuse that melts on a short circuit and a varistor that absorbs voltage spikes. They guard the product, not you.'],
    relay: ['Relay', 'An electromagnet closes a mechanical switch in the live wire. The coil is driven from the low-voltage side and the contacts carry the load: the only link between the two sides.'],
    meter: ['Metering chip', 'Measures the current through a small shunt resistor and the voltage, and reports power to the ESP over a serial link. It often sits on the mains side.'],
    load: ['The load', 'Whatever is plugged in: a lamp, a kettle. Up to the relay\'s rated current, 10 or 16 A in a typical plug.'],
    psu: ['AC-DC supply', 'Turns mains into about 3.3 V. An isolated design uses a transformer, so the two sides share no wire; a cheap non-isolated one connects them.'],
    esp: ['The ESP module', 'Runs the firmware: Wi-Fi, the button, the LED, the relay driver and the serial link to the metering chip.'],
    ui: ['Button and LED', 'The user\'s button and status LED, wired to GPIO pins of the ESP.'],
    pads: ['Serial pads', 'Small pads for TX, RX, ground and 3.3 V, used by the maker in the factory. A reflasher connects a serial adapter here, with the power off.']
  };
  Hyper.sim('cp-smart-plug', {
    title: 'Inside a smart plug',
    blurb: `A smart plug drawn as blocks: the **mains side** on top, the **low-voltage side** with the ESP below, and the supply that joins them. Only the relay links the two sides in a good design. This is a schematic, not a circuit.

**Click a block** to read what it does.

**Try this**
- Choose the **isolated** supply and plug the device in: the ESP side stays green, but a device that is plugged in is still never opened.
- Choose the **not isolated** supply: the whole low-voltage side turns red, because it shares the mains wire.
- Unplug it. Only now is it the moment to work on it.
- Set *Highlight* to what a reflasher reaches: the serial pads and the ESP.`,
    mount(box, kit, params) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.85, minH: 380, maxH: 520 });
      let sel = 'relay', hits = [];
      const ctl = kit.controls(box.side, [
        { id: 'iso', type: 'select', label: 'Low-voltage supply', options: [['Isolated (transformer)', 'iso'], ['Not isolated (cheap)', 'none']], value: params.isolation === 'none' ? 'none' : 'iso' },
        { id: 'live', type: 'check', label: 'Plugged into the wall', value: true },
        { id: 'show', type: 'select', label: 'Highlight', options: [['Everything', 'all'], ['What a reflasher reaches', 'pads'], ['The mains side', 'mains']], value: 'all' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['esp', 'The ESP side'], ['touch', 'The serial pads'], ['part', 'Selected block']]);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, v = ctl.values, iso = v.iso === 'iso', live = v.live;
        hits = [];
        const g = 10, bw = (W - 2 * M - 4 * g) / 5, bh = clamp(H * 0.13, 44, 58), colX = i => M + i * (bw + g);
        const yBar = Math.round(H * 0.5), y1 = H * 0.1, y2 = H * 0.7;
        // the two bands
        c.fillStyle = live ? 'rgba(229,72,77,.13)' : tint(C, 0.06); c.fillRect(4, 4, W - 8, yBar - 10);
        c.fillStyle = !iso && live ? 'rgba(229,72,77,.13)' : live ? 'rgba(34,179,122,.11)' : tint(C, 0.06); c.fillRect(4, yBar + 6, W - 8, H - yBar - 10);
        S.text(c, 'MAINS SIDE' + (live ? ' · live' : ''), 12, 14, { align: 'left', size: 9.5, color: live ? C.bad : C.muted, weight: 650 });
        S.text(c, iso ? 'LOW-VOLTAGE SIDE · isolated' : 'LOW-VOLTAGE SIDE · ' + (live ? 'AT MAINS POTENTIAL' : 'not isolated'), 12, H - 14, { align: 'left', size: 9.5, color: !iso && live ? C.bad : iso && live ? C.ok : C.muted, weight: 650 });
        c.save(); c.strokeStyle = iso ? C.ok : C.bad; c.lineWidth = 1.6; c.setLineDash(iso ? [7, 4] : [2, 6]); c.beginPath(); c.moveTo(6, yBar); c.lineTo(W - 6, yBar); c.stroke(); c.restore();
        S.text(c, iso ? 'isolation barrier' : 'no barrier', W - 12, yBar - 8, { align: 'right', size: 9.5, color: iso ? C.ok : C.bad });
        // the blocks
        const inSet = k => v.show === 'all' || (v.show === 'pads' ? (k === 'pads' || k === 'esp') : (k === 'mains' || k === 'fuse' || k === 'relay' || k === 'meter' || k === 'load' || k === 'psu'));
        const mk = (k, x, y, label, sub, colr) => {
          c.save(); c.globalAlpha = inSet(k) ? 1 : 0.3;
          const b = S.box(c, x, y, bw, bh, { label, sub, color: colr, active: k === sel, size: 11 });
          c.restore();
          hits.push({ x, y, w: bw, h: bh, k });
          return b;
        };
        const hot = live ? C.bad : C.muted, lowC = !iso && live ? C.bad : C.ok;
        const bMains = mk('mains', colX(0), y1, 'Mains in', 'L · N', hot);
        const bFuse = mk('fuse', colX(1), y1, 'Fuse', 'varistor', hot);
        const bRelay = mk('relay', colX(2), y1, 'Relay', 'contacts', hot);
        const bMeter = mk('meter', colX(3), y1, 'Meter', 'chip', hot);
        const bLoad = mk('load', colX(4), y1, 'Load', 'plugged in', hot);
        const bPsu = mk('psu', colX(1), yBar - bh / 2, 'AC-DC', iso ? 'transformer' : 'no isolation', iso ? C.ok : C.bad);
        const bUi = mk('ui', colX(0), y2, 'Button', 'and LED', lowC);
        const bEsp = mk('esp', colX(2), y2, 'ESP', 'Wi-Fi + logic', lowC);
        const bPads = mk('pads', colX(4), y2, 'Serial', 'pads', lowC);
        // the wires
        S.wire(c, [bMains.r, bFuse.l], { color: hot }); S.wire(c, [bFuse.r, bRelay.l], { color: hot });
        S.wire(c, [bRelay.r, bMeter.l], { color: hot }); S.wire(c, [bMeter.r, bLoad.l], { color: hot });
        S.wire(c, [bFuse.b, bPsu.t], { color: hot });
        S.wire(c, [bPsu.r, [bEsp.x + 14, bPsu.cy], [bEsp.x + 14, bEsp.y]], { color: lowC });
        S.text(c, '3.3 V', bEsp.x + 18, bPsu.cy + 11, { align: 'left', size: 9.5, color: lowC });
        S.wire(c, [bEsp.t, bRelay.b], { color: C.faint, dash: true, width: 1.6 });
        S.text(c, 'relay coil', bEsp.cx + 6, yBar - bh / 2 - 8 > y1 + bh + 12 ? y1 + bh + 14 : yBar - 24, { align: 'left', size: 9.5, color: C.muted });
        S.wire(c, [bMeter.b, [bMeter.cx, bEsp.y - 10], [bEsp.x + bEsp.w - 14, bEsp.y - 10], [bEsp.x + bEsp.w - 14, bEsp.y]], { color: C.faint, dash: true, width: 1.6 });
        S.text(c, 'serial', bMeter.cx - 4, bEsp.y - 18, { align: 'right', size: 9.5, color: C.muted });
        S.wire(c, [bUi.r, bEsp.l], { color: lowC }); S.wire(c, [bEsp.r, bPads.l], { color: lowC });
        // the numbers
        ro.set('esp', iso ? 'floats free of the mains' : live ? 'at mains potential: live' : 'would be at mains potential if plugged in');
        ro.set('touch', !live ? 'unplugged: the moment to work on it' : iso ? 'isolated, but never probe a device that is plugged in' : 'dangerous: the pads are at mains potential. Do not');
        const pt = PLUG_PARTS[sel];
        ro.set('part', pt ? pt[0] + ': ' + pt[1] : '—');
      }, box.stage);
      kit.click(st, p => { const h = hits.find(q => inRect(p, q)); if (h) { sel = h.k; loop.once(); } }, p => hits.some(q => inRect(p, q)));
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cp-802154-chips */
  Hyper.sim('cp-802154-chips', {
    title: 'Which 802.15.4 chip for the job?',
    blurb: `The three ESP chips with an 802.15.4 radio, side by side, from the catalogue. Choose the **job** and each card says how well the chip fits it. For a battery sensor the bars estimate the battery life from the catalogue's receive and sleep currents.

The estimate is for the **chip alone**, awake at its receive current for the awake time and asleep for the rest of the period, with 80 % of the battery usable and no self-discharge. A real board adds the regulator, the sensor and the radio's transmit peaks.

**Try this**
- Choose *a battery sensor* and report once an hour: compare the H2 with the C6 and the C5.
- Lengthen the awake time and see which chip loses more.
- Choose *a gateway* and see which chip cannot do it alone, and why.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.95, minH: 400, maxH: 560 });
      const IDS = ['esp32-h2', 'esp32-c6', 'esp32-c5'];
      const ctl = kit.controls(box.side, [
        { id: 'role', type: 'select', label: 'The job', options: [['A battery sensor or button (end device)', 'battery'], ['A plug or bulb on the mains (router)', 'router'], ['A gateway: Wi-Fi and mesh together', 'gateway'], ['It also needs 5 GHz Wi-Fi', '5ghz']], value: 'battery' },
        { id: 'every', label: 'Report every', min: 1, max: 1440, value: 60, unit: 'min', log: true, sig: 2 },
        { id: 'awake', label: 'Awake each time', min: 20, max: 3000, value: 300, unit: 'ms', log: true, sig: 2 },
        { id: 'mah', label: 'Battery', min: 50, max: 3000, step: 10, value: 220, unit: 'mAh' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['h2', 'ESP32-H2'], ['c6', 'ESP32-C6'], ['c5', 'ESP32-C5']]);
      function verdict(id, role, ch) {
        const five = ch.wifi && ch.wifi.bands && ch.wifi.bands.indexOf(5) >= 0;
        if (role === 'battery') return id === 'esp32-h2' ? ['best', 'lowest receive current, and no Wi-Fi to drain the cell'] : ['works', 'works, but its receiver draws more'];
        if (role === 'router') return id === 'esp32-c6' ? ['best', 'adds Wi-Fi and Bluetooth LE to the mesh radio'] : id === 'esp32-h2' ? ['works', 'mesh only: Wi-Fi has to come from elsewhere'] : ['works', 'also dual-band Wi-Fi 6'];
        if (role === 'gateway') return !ch.wifi ? ['no', 'no Wi-Fi: only the radio half of a gateway'] : id === 'esp32-c6' ? ['best', 'both radios on one chip, sharing the band'] : ['works', 'both radios, and 5 GHz as well'];
        return five ? ['best', 'the only one with a 5 GHz radio'] : ['no', 'no 5 GHz radio'];
      }
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, v = ctl.values;
        const wide = W >= 560, g = 8;
        const cw = wide ? (W - 2 * M - 2 * g) / 3 : W - 2 * M, chh = wide ? H - 2 * M : (H - 2 * M - 2 * g) / 3;
        const period = Math.max(1, v.every * 60), awake = Math.min(v.awake / 1000, period);
        IDS.forEach((id, i) => {
          const ch = E.chip(id);
          if (!ch) return;
          const x = wide ? M + i * (cw + g) : M, y = wide ? M : M + i * (chh + g);
          const vd = verdict(id, v.role, ch), col = vd[0] === 'best' ? C.ok : vd[0] === 'works' ? C.warn : C.bad;
          S.box(c, x, y, cw, chh, { color: col, active: vd[0] === 'best', r: 10 });
          S.text(c, ch.name, x + 12, y + 16, { align: 'left', size: 14, weight: 650, color: C.text });
          S.text(c, vd[0] === 'best' ? 'best fit' : vd[0] === 'works' ? 'works' : 'does not fit', x + cw - 12, y + 16, { align: 'right', size: 11.5, weight: 650, color: col });
          const nl = wide ? 2 : 1;
          let yy = wrap(S, c, vd[1], x + 12, y + 36, cw - 24, 14, { size: 11, color: C.text2, maxLines: nl });
          const radios = (ch.wifi ? 'Wi-Fi ' + ch.wifi.gen + ' (' + (ch.wifi.bands || []).join(' + ') + ' GHz)' : 'no Wi-Fi') + ' · BLE ' + txt(ch.bt && ch.bt.le) + (ch.ieee802154 ? ' · Zigbee ' + txt(ch.ieee802154.zigbee) + ' · Thread ' + txt(ch.ieee802154.thread) : '');
          yy = wrap(S, c, radios, x + 12, yy + 4, cw - 24, 13, { size: 10.5, color: C.muted, maxLines: nl });
          wrap(S, c, 'receive ' + txt(ch.rxMa) + ' mA · deep sleep ' + txt(ch.sleepUa) + ' µA · ' + txt(ch.gpio) + ' GPIO · ' + E.boardsOf(id).length + ' boards in the catalogue', x + 12, yy + 4, cw - 24, 13, { size: 10.5, color: C.muted, maxLines: nl });
          // the battery estimate
          const avg = ((ch.rxMa || 0) * awake + ((ch.sleepUa || 0) / 1000) * (period - awake)) / period;
          const life = E.batteryLife(v.mah, avg, { usable: 0.8, selfDischarge: 0 }), days = life.days;
          const by = y + chh - 22, bx = x + 12, bwid = cw - 24 - 78;
          if (v.role === 'battery') {
            const f = clamp((Math.log10(Math.max(days, 1)) - 1) / (Math.log10(30 * 365) - 1), 0, 1);
            c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; c.fillRect(bx, by, bwid, 10);
            c.fillStyle = col; c.fillRect(bx, by, Math.max(2, bwid * f), 10);
            S.text(c, days >= 730 ? kit.fmt(days / 365, 2) + ' years' : kit.fmt(days, 3) + ' days', bx + bwid + 8, by + 5, { align: 'left', size: 10.5, weight: 650, color: C.text });
          } else S.text(c, fit(c, 'mains powered: no battery to size', cw - 24, 10.5), bx, by + 5, { align: 'left', size: 10.5, color: C.faint });
          const key = id === 'esp32-h2' ? 'h2' : id === 'esp32-c6' ? 'c6' : 'c5';
          ro.set(key, kit.fmt(avg * 1000, 3) + ' µA average · ' + (days >= 730 ? kit.fmt(days / 365, 2) + ' years' : kit.fmt(days, 3) + ' days'));
        });
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cp-led-strip */
  Hyper.sim('cp-led-strip', {
    title: 'A pixel strip: current, time and voltage',
    blurb: `A strip of WS2812B-type pixels at full white draws about 60 mA each, takes 30 µs per pixel to send, and has copper rails that drop the voltage along its length. The top row shows the pixels as they would look, the graph the supply voltage along the strip. The red triangles are where power is fed in.

The copper resistance is an **assumed** figure: thin strips vary, so change it. The pixel colours are a schematic of what a falling voltage does: blue and green fail first, so white turns yellow, then red, then dark.

**Try this**
- Leave 150 pixels at half brightness fed from one end, then raise the pixels to 400: watch the far end.
- Feed the strip from **both ends**, then **every metre**: the drop shrinks.
- Set a **current limit**: the brightness falls to fit it, as WLED's maximum-current setting does.`,
    mount(box, kit) {
      const E = kit.esp, S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.72, minH: 340, maxH: 500 });
      const ctl = kit.controls(box.side, [
        { id: 'n', label: 'Pixels', min: 1, max: 600, step: 1, value: 150 },
        { id: 'bri', label: 'Brightness', min: 5, max: 100, step: 1, value: 50, unit: '%' },
        { id: 'dens', type: 'select', label: 'Pixels per metre', options: [['30', 30], ['60', 60], ['144', 144]], value: 60 },
        { id: 'rho', label: 'Strip copper, both rails (assumed)', min: 0.02, max: 0.3, step: 0.01, value: 0.1, unit: 'Ω/m' },
        { id: 'feed', type: 'select', label: 'Power fed in', options: [['at one end', 0], ['at both ends', 1], ['every metre', 2], ['every half metre', 3]], value: 0 },
        { id: 'limit', label: 'Current limit, 0 = none', min: 0, max: 30, step: 0.5, value: 0, unit: 'A' }
      ], () => loop.once());
      const ro = kit.readout(box.side, [['bri', 'Brightness used'], ['current', 'Current'], ['power', 'Power at 5 V'], ['supply', 'Supply to choose'], ['frame', 'One frame'], ['length', 'Strip length'], ['low', 'Lowest voltage'], ['verdict', 'Far end']]);
      const V0 = 5;
      function model() {
        const v = ctl.values, n = Math.max(1, Math.round(v.n)), dens = v.dens;
        let bri = v.bri / 100;
        const want = E.pixelCurrent(n, bri) / 1000;
        if (v.limit > 0 && want > v.limit) bri = clamp((v.limit * 1000 / n - 1) / 60, 0, bri);
        const ipix = (bri * 60 + 1) / 1000, r = v.rho / dens;
        let feeds;
        if (v.feed === 0) feeds = [0]; else if (v.feed === 1) feeds = [0, n];
        else { const step = v.feed === 2 ? dens : Math.max(1, Math.round(dens / 2)); feeds = []; for (let k = 0; k < n; k += step) feeds.push(k); }
        const vAt = k => {
          let a = 0, b = null;
          for (const f of feeds) { if (f <= k) a = f; else { b = f; break; } }
          let drop;
          if (b == null) { const L = n - a, x = k - a; drop = ipix * r * (L * x - x * x / 2); }
          else { const nn = b - a, x = k - a; drop = ipix * r * x * (nn - x) / 2; }
          return Math.max(0, V0 - drop);
        };
        return { n, dens, bri, ipix, feeds, vAt, current: E.pixelCurrent(n, bri) / 1000 };
      }
      const colourAt = (V, bri) => {
        const fr = clamp((V - 2.8) / 1.6, 0, 1), fg = clamp((V - 3.3) / 1.4, 0, 1), fb = clamp((V - 3.6) / 1.2, 0, 1), k = 0.3 + 0.7 * bri;
        return 'rgb(' + Math.round(255 * fr * k) + ',' + Math.round(255 * fg * k) + ',' + Math.round(255 * fb * k) + ')';
      };
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, m = model();
        const px = M + 6, pw = W - 2 * M - 12;
        // the pixels
        const dots = Math.max(1, Math.min(m.n, Math.floor(pw / 5))), dw = pw / dots, sy = 26;
        c.fillStyle = C.dark ? '#05060c' : '#1b1e26'; c.fillRect(px - 4, sy - 6, pw + 8, 28);
        for (let j = 0; j < dots; j++) {
          const k = Math.min(m.n - 1, Math.floor((j + 0.5) * m.n / dots));
          c.fillStyle = colourAt(m.vAt(k), m.bri);
          c.fillRect(px + j * dw, sy, Math.max(1, dw - 1), 16);
        }
        S.text(c, 'pixel 1', px, sy - 12, { align: 'left', size: 9.5, color: C.faint });
        S.text(c, 'pixel ' + m.n + ' · ' + kit.fmt(m.n / m.dens, 3) + ' m', px + pw, sy - 12, { align: 'right', size: 9.5, color: C.faint });
        // where the power goes in
        c.fillStyle = C.bad;
        m.feeds.slice(0, 80).forEach(f => { const x = px + clamp(f / m.n, 0, 1) * pw; c.beginPath(); c.moveTo(x, sy + 24); c.lineTo(x - 4, sy + 33); c.lineTo(x + 4, sy + 33); c.closePath(); c.fill(); });
        // the voltage along the strip
        const gy = sy + 46, gh = H - gy - 44, Y = val => gy + gh * (1 - (val - 2.5) / 3);
        c.strokeStyle = C.grid; c.lineWidth = 1;
        [3, 3.5, 4, 4.5, 5].forEach(val => { c.beginPath(); c.moveTo(px, Y(val)); c.lineTo(px + pw, Y(val)); c.stroke(); S.text(c, kit.fmt(val, 2) + ' V', px - 2, Y(val) - 7, { align: 'left', size: 9, color: C.faint }); });
        c.save(); c.strokeStyle = C.warn; c.lineWidth = 1.4; c.setLineDash([5, 4]); c.beginPath(); c.moveTo(px, Y(3.5)); c.lineTo(px + pw, Y(3.5)); c.stroke(); c.restore();
        S.text(c, 'about 3.5 V: the least a pixel needs', px + pw, Y(3.5) + 9, { align: 'right', size: 9.5, color: C.warn });
        c.strokeStyle = C.accent; c.lineWidth = 2.2; c.beginPath();
        let vMin = V0, kMin = 0;
        for (let k = 0; k < m.n; k++) {
          const val = m.vAt(k), x = px + (k + 0.5) / m.n * pw;
          if (val < vMin) { vMin = val; kMin = k; }
          if (k === 0) c.moveTo(x, Y(val)); else c.lineTo(x, Y(val));
        }
        c.stroke();
        const mx = px + (kMin + 0.5) / m.n * pw;
        kit.dot(c, mx, Y(vMin), 4, vMin < 3.5 ? C.bad : C.accent);
        S.text(c, 'supply voltage along the strip', px + pw / 2, gy + gh + 14, { size: 10.5, color: C.muted });
        S.text(c, 'start', px, gy + gh + 28, { align: 'left', size: 9.5, color: C.faint });
        S.text(c, 'end', px + pw, gy + gh + 28, { align: 'right', size: 9.5, color: C.faint });
        // the numbers
        const frame = (m.n * 30 + 300) / 1e6;
        ro.set('bri', Math.round(m.bri * 100) + ' %' + (m.bri * 100 < ctl.values.bri - 0.5 ? ' (held down by the limit)' : ''));
        ro.set('current', kit.fmt(m.current, 3) + ' A');
        ro.set('power', kit.fmt(m.current * V0, 3) + ' W');
        ro.set('supply', Math.max(0.5, Math.ceil(m.current * 1.2 * 2) / 2) + ' A or more, 5 V');
        ro.set('frame', kit.fmt(frame * 1000, 3) + ' ms: up to ' + Math.floor(1 / frame) + ' frames a second');
        ro.set('length', kit.fmt(m.n / m.dens, 3) + ' m');
        ro.set('low', kit.fmt(vMin, 3) + ' V at pixel ' + (kMin + 1));
        ro.set('verdict', vMin >= 4.6 ? 'colours stay true' : vMin >= 4 ? 'a slight drift' : vMin >= 3.5 ? 'goes yellow and dim' : 'below the minimum: feed power in at more points');
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });

  /* ================================================================ cp-voice-path */
  const fmtBytes = b => (b >= 1e9 ? (b / 1e9).toFixed(2) + ' GB' : b >= 1e6 ? (b / 1e6).toFixed(b >= 1e7 ? 0 : 1) + ' MB' : b >= 1e3 ? Math.round(b / 1e3) + ' kB' : Math.round(b) + ' B');
  Hyper.sim('cp-voice-path', {
    title: 'A voice satellite: what runs where',
    blurb: `The path of a spoken command. Sound goes from the microphones through an **audio processor** to the **ESP32-S3**, and over Wi-Fi to the **Home Assistant server**, which turns speech into text, finds what was meant and sends speech back. The question is where the **wake word** is recognised.

Audio is sent as 16 kHz, 16-bit mono: 32 000 bytes a second. If the server must hear it all to find the wake word, that stream never stops. The bar is a day, 0 to 24 hours; the coloured parts are the times audio leaves the device.

**Try this**
- Move the wake word to the **server**: the whole day turns red.
- Put it on the **device** and raise the commands a day: how little leaves the house?
- Remove the **audio processor** and read what happens when the speaker plays.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 0.9, minH: 380, maxH: 520 });
      let t = 0;
      const ctl = kit.controls(box.side, [
        { id: 'wake', type: 'select', label: 'The wake word runs on', options: [['the device (ESP32-S3)', 'device'], ['the server', 'server']], value: 'device' },
        { id: 'dsp', type: 'check', label: 'Audio processor with echo cancellation', value: true },
        { id: 'cmds', label: 'Commands a day', min: 1, max: 200, step: 1, value: 25 },
        { id: 'sec', label: 'Seconds of audio per command', min: 2, max: 15, step: 1, value: 6, unit: 's' }
      ], () => {});
      const ro = kit.readout(box.side, [['rate', 'Audio stream'], ['data', 'Leaves the device a day'], ['when', 'Audio leaves'], ['share', 'Share of the day'], ['dsp', 'While it plays music']]);
      const loop = kit.loop((dt) => {
        t += dt;
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, v = ctl.values, local = v.wake === 'device', cyc = t % 9;
        const gap = clamp(W * 0.05, 14, 30), bw = (W - 2 * M - 3 * gap) / 4, bh = 56, by = 22, phase = t * 70;
        const cmdOn = cyc >= 3 && cyc < 6, repOn = cyc >= 6, heard = cyc >= 3 && cyc < 3.9;
        const colX = i => M + i * (bw + gap);
        const mic = S.box(c, colX(0), by, bw, bh, { label: 'Mics', sub: 'sound in', color: kit.hue(212) });
        const dsp = S.box(c, colX(1), by, bw, bh, { label: 'Audio DSP', sub: v.dsp ? 'echo cancel' : 'none', color: kit.hue(280), dash: !v.dsp });
        const esp = S.box(c, colX(2), by, bw, bh, { label: 'ESP32-S3', sub: local ? 'wake word' : 'streams audio', color: kit.hue(8), active: local && heard });
        const srv = S.box(c, colX(3), by, bw, bh, { label: 'Server', sub: local ? 'STT · intent · TTS' : 'wake word, STT…', color: kit.hue(150), active: !local ? true : cmdOn });
        const spk = S.box(c, colX(2), by + bh + 28, bw, bh, { label: 'Speaker', sub: 'the reply', color: kit.hue(212) });
        const wires = [[mic.r, dsp.l], [dsp.r, esp.l], [esp.r, srv.l]];
        wires.forEach(w => S.wire(c, w, { color: C.faint, width: 2 }));
        const back = [srv.b, [srv.cx, spk.cy], spk.r];
        S.wire(c, back, { color: C.faint, width: 2 });
        S.text(c, 'Wi-Fi', (esp.r[0] + srv.l[0]) / 2, by + bh / 2 - 12, { size: 9.5, color: C.muted });
        S.flow(c, [mic.r, dsp.l], phase, { color: kit.hue(212), r: 2.6, gap: 14 });
        S.flow(c, [dsp.r, esp.l], phase, { color: kit.hue(212), r: 2.6, gap: 14 });
        if (!local || cmdOn) S.flow(c, [esp.r, srv.l], phase, { color: local ? kit.hue(150) : kit.hue(8), r: 2.8, gap: 14 });
        if (repOn) S.flow(c, back, phase, { color: kit.hue(150), r: 2.8, gap: 14 });
        S.text(c, local ? 'only the command crosses the Wi-Fi' : 'everything crosses the Wi-Fi', esp.cx, by + bh + 14, { size: 9.5, color: local ? C.ok : C.bad });
        // the day
        const dayY = Math.max(by + 2 * bh + 70, H * 0.58), x0 = M + 4, x1 = W - M - 4, bwd = x1 - x0;
        S.text(c, 'one day: audio that leaves the device', x0, dayY - 14, { align: 'left', size: 10.5, color: C.muted });
        c.fillStyle = C.dark ? 'rgba(255,255,255,.08)' : 'rgba(0,0,0,.07)'; c.fillRect(x0, dayY, bwd, 20);
        if (!local) { c.fillStyle = kit.hue(8); c.fillRect(x0, dayY, bwd, 20); }
        else {
          c.fillStyle = kit.hue(150);
          for (let i = 0; i < Math.round(v.cmds); i++) { const x = x0 + ((i * 0.618034 + 0.1) % 1) * bwd; c.fillRect(x, dayY, Math.max(1.5, v.sec / 86400 * bwd), 20); }
        }
        S.text(c, '0 h', x0, dayY + 32, { align: 'left', size: 9.5, color: C.faint });
        S.text(c, '24 h', x1, dayY + 32, { align: 'right', size: 9.5, color: C.faint });
        const note = local ? 'The green marks are the commands: audio leaves the device only after the wake word.' : 'The server must hear everything to catch the wake word, so audio leaves all day.';
        wrap(S, c, note, x0, dayY + 52, bwd, 14, { size: 11, color: local ? C.ok : C.bad, maxLines: 3 });
        // the numbers
        const perDay = local ? v.cmds * v.sec * 32000 : 32000 * 86400;
        ro.set('rate', '32 kB/s (16 kHz, 16 bit, mono)');
        ro.set('data', fmtBytes(perDay));
        ro.set('when', local ? 'only after the wake word' : 'all the time it is powered');
        ro.set('share', (local ? kit.fmt(v.cmds * v.sec / 86400 * 100, 2) : '100') + ' % of the day');
        ro.set('dsp', v.dsp ? 'it still hears the wake word over its own playback' : 'the speaker drowns the single microphone');
      }, box.stage);
      loop.start();
    }
  });

  /* ================================================================ cp-reflash-check */
  const CHIPS = { esp8266: 'ESP8266 / ESP8285', esp32: 'ESP32 (original)', c3: 'ESP32-C3', other: 'Beken, Realtek or Tuya\'s own', unknown: 'not known yet' };
  Hyper.sim('cp-reflash-check', {
    title: 'Can this device be reflashed, and should it?',
    blurb: `Describe the device and the steps turn green, amber or red. The checklist follows the general method: know the chip, check that it can be written, handle the power safely, save the original firmware, and know what you give up.

It is a way of thinking, not a recipe for any one product: always look up your exact model and revision, and never open a device that is plugged in.

**Try this**
- Choose *Beken, Realtek or Tuya's own*: the ESP tools stop applying.
- Tick *flash is locked*, as on a Matter-certified plug.
- Choose a mains device whose supply is **not isolated** and read step 3.
- Untick *saved the original firmware* and see what the checklist asks for.`,
    mount(box, kit) {
      const S = kit.esym;
      const st = kit.stage(box.stage, { aspect: 1.05, minH: 400, maxH: 580 });
      const ctl = kit.controls(box.side, [
        { id: 'chip', type: 'select', label: 'The chip inside', options: Object.keys(CHIPS).map(k => [CHIPS[k], k]), value: 'esp8266' },
        { id: 'locked', type: 'check', label: 'The flash is locked or secure boot is on', value: false },
        { id: 'pads', type: 'check', label: 'Serial pads are reachable', value: true },
        { id: 'mains', type: 'check', label: 'It runs from the mains', value: true },
        { id: 'supply', type: 'select', label: 'Its low-voltage supply', options: [['Isolated', 'iso'], ['Not isolated', 'none'], ['Not known', 'unknown']], value: 'unknown' },
        { id: 'backup', type: 'check', label: 'I have saved the original firmware', value: false },
        { id: 'cloud', type: 'check', label: 'I rely on the maker\'s app and cloud', value: true }
      ], () => { ctl.show('supply', ctl.values.mains); loop.once(); });
      const ro = kit.readout(box.side, [['tool', 'Tools'], ['boot', 'Boot pin'], ['verdict', 'Verdict']]);
      ctl.show('supply', ctl.values.mains);
      const loop = kit.loop(() => {
        const c = st.begin(), C = kit.colors(), W = st.W, H = st.H, M = 10, v = ctl.values;
        const steps = [];
        steps.push(v.chip === 'unknown'
          ? ['warn', 'Know the chip of your exact unit', 'Not known yet. Read the module label, and search the community databases and the regulatory filing for your model and revision.']
          : ['ok', 'Know the chip of your exact unit', 'Chip: ' + CHIPS[v.chip] + '. Check that your revision matches the database entry.']);
        if (v.chip === 'other') steps.push(['stop', 'Can the ESP tools write to it?', 'Not an Espressif chip. The ESP flashing tools and firmware do not apply to it.']);
        else if (v.locked) steps.push(['stop', 'Can the ESP tools write to it?', 'The flash is locked, or secure boot is on, so ordinary tools cannot rewrite it. Some Matter-certified devices are built this way.']);
        else if (v.chip === 'unknown') steps.push(['warn', 'Can the ESP tools write to it?', 'It depends on the chip: settle step 1 first.']);
        else if (!v.pads) steps.push(['warn', 'Can the ESP tools write to it?', 'No serial pads you can reach: you would have to solder to the module or chip pins.']);
        else steps.push(['ok', 'Can the ESP tools write to it?', 'Yes: an ESP chip with reachable serial pads answers the ESP flashing tool.']);
        if (!v.mains) steps.push(['ok', 'Power and safety', 'Battery or USB powered: no mains risk. Keep any lithium cell protected and powered from its own supply.']);
        else if (v.supply === 'iso') steps.push(['warn', 'Power and safety', 'Mains device. Unplug it and keep it unplugged; power the chip from the 3.3 V adapter. Even with an isolated supply, never open a live device.']);
        else steps.push(['warn', 'Power and safety', (v.supply === 'none' ? 'Not isolated: the low-voltage side sits at mains potential when plugged in.' : 'Isolation unknown: assume it is not isolated.') + ' Work only with the plug out of the wall; never connect a computer to a live device.']);
        steps.push(v.backup ? ['ok', 'Save the original firmware', 'Saved: you can go back to the original behaviour.'] : ['warn', 'Save the original firmware', 'Read the whole flash and keep the file before writing anything.']);
        steps.push(['warn', 'What you give up', 'The warranty and the safety approval' + (v.cloud ? ', and the maker\'s app and cloud' : '') + (v.mains ? '; protection that lives in the old firmware, such as overload and over-temperature' : '') + '.']);
        // the list
        const top = 10, vh = 42, rowH = (H - top - vh - 18) / steps.length, colOf = s => (s === 'ok' ? C.ok : s === 'warn' ? C.warn : C.bad);
        steps.forEach((s, i) => {
          const y = top + i * rowH, col = colOf(s[0]);
          S.box(c, M, y, W - 2 * M, rowH - 6, { color: col, active: true, r: 8 });
          c.beginPath(); c.arc(M + 18, y + (rowH - 6) / 2, 11, 0, Math.PI * 2); c.fillStyle = col; c.fill();
          S.text(c, String(i + 1), M + 18, y + (rowH - 6) / 2 + 1, { size: 11.5, weight: 700, color: C.dark ? '#10142a' : '#ffffff' });
          S.text(c, s[1], M + 38, y + 14, { align: 'left', size: 12, weight: 650, color: C.text });
          wrap(S, c, s[2], M + 38, y + 30, W - 2 * M - 48, 13, { size: 10.5, color: C.text2, maxLines: 3 });
        });
        const stop = steps.some(s => s[0] === 'stop');
        const verdict = stop ? 'Do not reflash this one: use its local interface, or choose a device that allows it.'
          : v.chip === 'unknown' ? 'Find out the chip first.'
          : v.mains && v.supply !== 'iso' ? 'Possible, with great care: only unplugged, powered from the adapter.'
          : 'Possible: go step by step, with the backup first.';
        const vc = stop ? C.bad : v.chip === 'unknown' || (v.mains && v.supply !== 'iso') ? C.warn : C.ok;
        S.box(c, M, H - vh - 8, W - 2 * M, vh, { color: vc, active: true, r: 8 });
        wrap(S, c, verdict, M + 12, H - vh - 8 + 15, W - 2 * M - 24, 14, { size: 11.5, weight: 650, color: C.text, maxLines: 2 });
        ro.set('tool', v.chip === 'other' ? 'not the ESP tools' : v.chip === 'unknown' ? '—' : 'the ESP flashing tool (esptool)');
        ro.set('boot', v.chip === 'esp8266' || v.chip === 'esp32' ? 'GPIO0 to ground at power-up' : v.chip === 'c3' ? 'GPIO9 to ground at power-up' : '—');
        ro.set('verdict', cut(verdict, 80));
      }, box.stage);
      st.onResize(() => loop.once());
      loop.once();
    }
  });
})();
